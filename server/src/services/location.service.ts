import { prisma } from "../lib";
import type { LocationUpdateInput } from "../validators";

export class LocationService {
  /**
   * Check that the inspector is assigned to this visit and that it is currently
   * in progress. Used before broadcasting a location to the task room.
   */
  static async validateCaptainForTask(
    captainId: string,
    taskId: string
  ): Promise<void> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { status: true, acceptedById: true },
    });

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status !== "IN_PROGRESS") {
      throw new Error(`Task ${taskId} is not IN_PROGRESS`);
    }

    if (task.acceptedById !== captainId) {
      throw new Error(
        `Captain ${captainId} is not assigned to task ${taskId}`
      );
    }
  }

  static async logLocation(
    captainId: string,
    input: LocationUpdateInput
  ): Promise<void> {
    await prisma.locationLog.create({
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        taskId: input.taskId,
        captainId,
      },
    });
  }

  /**
   * Validates the inspector and persists a location log entry.
   */
  static async validateAndLogLocation(
    captainId: string,
    input: LocationUpdateInput
  ): Promise<LocationUpdateInput> {
    await LocationService.validateCaptainForTask(captainId, input.taskId);
    await LocationService.logLocation(captainId, input);
    return input;
  }
}
