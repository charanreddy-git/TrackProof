import { Request, Response, NextFunction } from "express";
import { LocationService } from "../services/location.service";
import { locationUpdateSchema } from "../validators/location.validator";

export class LocationController {
  static async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const input = locationUpdateSchema.parse(req.body);
      const log = await LocationService.updateLocation(
        req.user!.userId,
        input
      );
      res.status(201).json({ success: true, data: log });
    } catch (error) {
      next(error);
    }
  }

  static async getLocationHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
      const logs = await LocationService.getLocationHistory(taskId);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }
}
