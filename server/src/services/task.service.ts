import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";
import { haversineDistance, MAX_DISTANCE_METERS } from "../utils/haversine";
import { CreateTaskInput, SubmitTaskInput } from "../validators/task.validator";
import { TaskStatus } from "@prisma/client";

export class TaskService {
  /**
   * Create a new task (USER only)
   */
  static async createTask(userId: string, input: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        targetLat: input.latitude,
        targetLng: input.longitude,
        status: TaskStatus.OPEN,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return task;
  }

  /**
   * Get tasks filtered by role:
   * - USER: own created tasks
   * - CAPTAIN: OPEN tasks (available) or own accepted tasks
   */
  static async getTasks(userId: string, role: string, filter?: string) {
    if (role === "USER") {
      return prisma.task.findMany({
        where: { createdById: userId },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
          acceptedBy: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // CAPTAIN
    if (filter === "available") {
      return prisma.task.findMany({
        where: { status: TaskStatus.OPEN },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (filter === "accepted") {
      return prisma.task.findMany({
        where: { acceptedById: userId },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    // Default: both available and accepted
    return prisma.task.findMany({
      where: {
        OR: [{ status: TaskStatus.OPEN }, { acceptedById: userId }],
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        acceptedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get a single task by ID with full relations
   */
  static async getTaskById(taskId: string, userId: string, role: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        acceptedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        locationLogs: {
          orderBy: { timestamp: "desc" },
          take: 20,
        },
      },
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    // Access control checks
    if (role === "USER") {
      if (task.createdById !== userId) {
        throw ApiError.forbidden("You do not have access to view this task");
      }
    } else if (role === "CAPTAIN") {
      // Captains can view task if it is OPEN (available to accept) or assigned to them
      if (task.status !== "OPEN" && task.acceptedById !== userId) {
        throw ApiError.forbidden("You do not have access to view this task");
      }
    }

    return task;
  }

  /**
   * Captain accepts a task (OPEN → ACCEPTED)
   * Uses atomic transaction to prevent race conditions
   */
  static async acceptTask(taskId: string, captainId: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw ApiError.notFound("Task not found");
      if (task.status !== TaskStatus.OPEN) {
        throw ApiError.badRequest("Task is no longer available");
      }

      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.ACCEPTED,
          acceptedById: captainId,
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
          acceptedBy: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });

      return updatedTask;
    });
  }

  /**
   * Captain starts a task (ACCEPTED → IN_PROGRESS)
   */
  static async startTask(taskId: string, captainId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) throw ApiError.notFound("Task not found");
    if (task.acceptedById !== captainId) {
      throw ApiError.forbidden("You are not assigned to this task");
    }
    if (task.status !== TaskStatus.ACCEPTED) {
      throw ApiError.badRequest("Task must be in ACCEPTED status to start");
    }

    return prisma.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.IN_PROGRESS },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        acceptedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  /**
   * Captain submits evidence (IN_PROGRESS → SUBMITTED)
   * Validates GPS proximity using Haversine formula
   */
  static async submitTask(
    taskId: string,
    captainId: string,
    input: SubmitTaskInput,
    imagePath: string
  ) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) throw ApiError.notFound("Task not found");
    if (task.acceptedById !== captainId) {
      throw ApiError.forbidden("You are not assigned to this task");
    }
    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw ApiError.badRequest(
        "Task must be IN_PROGRESS to submit evidence"
      );
    }

    // GPS validation via Haversine
    const distance = haversineDistance(
      task.targetLat,
      task.targetLng,
      input.latitude,
      input.longitude
    );

    if (distance > MAX_DISTANCE_METERS) {
      throw ApiError.badRequest(
        `Too far from target location. Distance: ${Math.round(distance)}m, Maximum allowed: ${MAX_DISTANCE_METERS}m`
      );
    }

    return prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.SUBMITTED,
        evidenceImage: imagePath,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        acceptedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  /**
   * User marks task as complete (SUBMITTED → COMPLETED)
   */
  static async completeTask(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) throw ApiError.notFound("Task not found");
    if (task.createdById !== userId) {
      throw ApiError.forbidden("Only the task creator can complete a task");
    }
    if (task.status !== TaskStatus.SUBMITTED) {
      throw ApiError.badRequest("Task must be SUBMITTED to complete");
    }

    return prisma.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.COMPLETED },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        acceptedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
