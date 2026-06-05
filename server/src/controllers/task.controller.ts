import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import {
  createTaskSchema,
  submitTaskSchema,
} from "../validators/task.validator";
import { ApiError } from "../utils/api-error";
import { getIO } from "../sockets";
import { parseCoordinates, followRedirects } from "../utils/url-resolver";

function getParamId(req: Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createTaskSchema.parse(req.body);
      const task = await TaskService.createTask(req.user!.userId, input);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async resolveUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;
      if (!url || typeof url !== "string") {
        throw ApiError.badRequest("A valid URL string is required");
      }

      const isGoogleMaps =
        url.includes("maps.google.com") ||
        url.includes("google.com/maps") ||
        url.includes("goo.gl/maps") ||
        url.includes("maps.app.goo.gl");

      if (!isGoogleMaps) {
        throw ApiError.badRequest("Invalid location URL. Only Google Maps URLs are supported.");
      }

      let coords = parseCoordinates(url);

      if (!coords) {
        try {
          const resolvedUrl = await followRedirects(url);
          coords = parseCoordinates(resolvedUrl);
        } catch (err) {
          throw ApiError.badRequest("Unable to resolve Google Maps link. Please verify the link is accessible.");
        }
      }

      if (!coords) {
        throw ApiError.badRequest("Could not extract latitude and longitude from the provided Google Maps link.");
      }

      res.status(200).json({ success: true, data: coords });
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = req.query.filter as string | undefined;
      const tasks = await TaskService.getTasks(
        req.user!.userId,
        req.user!.role,
        filter
      );
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getTaskById(
        getParamId(req),
        req.user!.userId,
        req.user!.role
      );
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async acceptTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.acceptTask(
        getParamId(req),
        req.user!.userId
      );

      // Emit real-time event to task room
      const io = getIO();
      io.to(`task:${task.id}`).emit("task:accepted", {
        taskId: task.id,
        captainId: req.user!.userId,
        captainName: task.acceptedBy!.name,
      });

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async startTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.startTask(
        getParamId(req),
        req.user!.userId
      );

      // Emit real-time event
      const io = getIO();
      io.to(`task:${task.id}`).emit("task:started", { taskId: task.id });

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async submitTask(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw ApiError.badRequest("Evidence image is required");
      }

      const input = submitTaskSchema.parse(req.body);
      const imagePath = `/uploads/${req.file.filename}`;

      const task = await TaskService.submitTask(
        getParamId(req),
        req.user!.userId,
        input,
        imagePath
      );

      // Emit real-time event
      const io = getIO();
      io.to(`task:${task.id}`).emit("task:submitted", {
        taskId: task.id,
        evidenceImage: imagePath,
      });

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async completeTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.completeTask(
        getParamId(req),
        req.user!.userId
      );

      // Emit real-time event
      const io = getIO();
      io.to(`task:${task.id}`).emit("task:completed", { taskId: task.id });

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
}
