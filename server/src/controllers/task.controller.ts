import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import {
  createTaskSchema,
  submitTaskSchema,
  taskFilterSchema,
} from "../validators/task.validator";
import { ApiError } from "../utils/api-error";
import { getIO } from "../sockets";
import { resolveGoogleMapsUrl } from "../utils/url-resolver";

/** Express 5 types `req.params` values as `string | string[]`; named route params are always strings at runtime. */
function paramId(req: Request): string {
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
      const coords = await resolveGoogleMapsUrl(url);
      res.status(200).json({ success: true, data: coords });
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = taskFilterSchema.parse(req.query.filter);
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
        paramId(req),
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
        paramId(req),
        req.user!.userId
      );

      getIO()
        .to(`task:${task.id}`)
        .emit("task:accepted", {
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
        paramId(req),
        req.user!.userId
      );

      getIO()
        .to(`task:${task.id}`)
        .emit("task:started", { taskId: task.id });

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
        paramId(req),
        req.user!.userId,
        input,
        imagePath
      );

      getIO()
        .to(`task:${task.id}`)
        .emit("task:submitted", {
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
        paramId(req),
        req.user!.userId
      );

      getIO()
        .to(`task:${task.id}`)
        .emit("task:completed", { taskId: task.id });

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
}
