import { prisma } from "../lib";
import type { LocationUpdateInput } from "../validators";

export class LocationService {
  /**
   * Validates that the captain is authorized to send location updates for the
   * given task, then persists the log entry and returns the validated input.
   *
   * Throws a plain Error (not ApiError) because callers are socket handlers —
   * they have no HTTP status code to surface to clients.
   */
  static async validateAndLogLocation(
    captainId: string,
    input: LocationUpdateInput
  ): Promise<LocationUpdateInput> {
    const task = await prisma.task.findUnique({
      where: { id: input.taskId },
      select: { status: true, acceptedById: true },
    });

    if (!task) {
      throw new Error(`Task ${input.taskId} not found`);
    }

    if (task.status !== "IN_PROGRESS") {
      throw new Error(`Task ${input.taskId} is not IN_PROGRESS`);
    }

    if (task.acceptedById !== captainId) {
      throw new Error(
        `Captain ${captainId} is not assigned to task ${input.taskId}`
      );
    }

    await prisma.locationLog.create({
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        taskId: input.taskId,
        captainId,
      },
    });

    return input;
  }
}
