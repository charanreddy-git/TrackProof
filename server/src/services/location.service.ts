import { prisma } from "../lib/prisma";
import { LocationUpdateInput } from "../validators/location.validator";

export class LocationService {
  /**
   * Save a captain's location update for a task
   */
  static async updateLocation(captainId: string, input: LocationUpdateInput) {
    const log = await prisma.locationLog.create({
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        taskId: input.taskId,
        captainId,
      },
    });

    return log;
  }
}
