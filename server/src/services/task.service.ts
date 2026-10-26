import { prisma } from "../lib";
import { ApiError, haversineDistance, MAX_DISTANCE_METERS } from "../utils";
import type { CreateTaskInput, SubmitTaskInput } from "../validators";
import { TaskStatus } from "@prisma/client";

/** Safe shape for public/open task listings — no phone number. */
const publicUserSelect = {
  select: { id: true, name: true, role: true },
} as const;

/** Contact shape for participants who are allowed to reach each other. */
const contactUserSelect = {
  select: { id: true, name: true, phone: true, role: true },
} as const;

/** Standard include block — attaches creator and assignee to task queries */
const taskWithUsers = {
  createdBy: contactUserSelect,
  acceptedBy: contactUserSelect,
} as const;

type TaskFilter = "available" | "accepted";

export class TaskService {
  /**
   * Create a new task (USER only)
   */
  static async createTask(userId: string, input: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        targetLat: input.latitude,
        targetLng: input.longitude,
        status: TaskStatus.OPEN,
        createdById: userId,
      },
      include: taskWithUsers,
    });
  }

  /**
   * Get tasks filtered by role:
   * - USER: own created tasks
   * - CAPTAIN "available": all OPEN tasks
   * - CAPTAIN "accepted": own accepted tasks
   * - CAPTAIN (no filter): OPEN tasks + own accepted tasks
   */
  static async getTasks(
    userId: string,
    role: "USER" | "CAPTAIN",
    filter?: TaskFilter
  ) {
    if (role === "USER") {
      return prisma.task.findMany({
        where: { createdById: userId },
        include: taskWithUsers,
        orderBy: { createdAt: "desc" },
      });
    }

    if (filter === "available") {
      return prisma.task.findMany({
        where: { status: TaskStatus.OPEN },
        include: { createdBy: publicUserSelect },
        orderBy: { createdAt: "desc" },
      });
    }

    if (filter === "accepted") {
      return prisma.task.findMany({
        where: { acceptedById: userId },
        include: taskWithUsers,
        orderBy: { updatedAt: "desc" },
      });
    }

    // Default: OPEN tasks (contact hidden) + own accepted tasks (contact visible)
    const [openTasks, acceptedTasks] = await Promise.all([
      prisma.task.findMany({
        where: { status: TaskStatus.OPEN },
        include: { createdBy: publicUserSelect },
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.findMany({
        where: { acceptedById: userId },
        include: taskWithUsers,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return [...openTasks, ...acceptedTasks].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Get a single task by ID with access control.
   * - USER: must be the task creator
   * - CAPTAIN: task must be OPEN or assigned to them
   */
  static async getTaskById(
    taskId: string,
    userId: string,
    role: "USER" | "CAPTAIN"
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: taskWithUsers,
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    if (role === "USER" && task.createdById !== userId) {
      throw ApiError.forbidden("You do not have access to this task");
    }

    if (
      role === "CAPTAIN" &&
      task.status !== "OPEN" &&
      task.acceptedById !== userId
    ) {
      throw ApiError.forbidden("You do not have access to this task");
    }

    // An unclaimed task is public, but the requester's phone number is not.
    if (role === "CAPTAIN" && task.status === "OPEN") {
      return {
        ...task,
        createdBy: {
          id: task.createdBy.id,
          name: task.createdBy.name,
          role: task.createdBy.role,
        },
      };
    }

    return task;
  }

  /**
   * Captain accepts a task (OPEN → ACCEPTED).
   * Uses a transaction to prevent two captains accepting the same task simultaneously.
   */
  static async acceptTask(taskId: string, captainId: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw ApiError.notFound("Task not found");
      if (task.status !== TaskStatus.OPEN) {
        throw ApiError.badRequest("Task is no longer available");
      }

      // Conditional update: two inspectors can read OPEN at the same time,
      // but only one can move the row out of OPEN.
      const claimed = await tx.task.updateMany({
        where: { id: taskId, status: TaskStatus.OPEN },
        data: {
          status: TaskStatus.ACCEPTED,
          acceptedById: captainId,
        },
      });

      if (claimed.count === 0) {
        throw ApiError.badRequest("Task is no longer available");
      }

      return tx.task.findUniqueOrThrow({
        where: { id: taskId },
        include: taskWithUsers,
      });
    });
  }

  /**
   * Captain starts a task (ACCEPTED → IN_PROGRESS).
   * Wrapped in a transaction to guard against duplicate start requests.
   */
  static async startTask(taskId: string, captainId: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw ApiError.notFound("Task not found");
      if (task.acceptedById !== captainId) {
        throw ApiError.forbidden("You are not assigned to this task");
      }
      if (task.status !== TaskStatus.ACCEPTED) {
        throw ApiError.badRequest("Task must be in ACCEPTED status to start");
      }

      return tx.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.IN_PROGRESS },
        include: taskWithUsers,
      });
    });
  }

  /**
   * Captain submits evidence (IN_PROGRESS → SUBMITTED).
   * Validates GPS proximity via Haversine formula before accepting submission.
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
      throw ApiError.badRequest("Task must be IN_PROGRESS to submit evidence");
    }

    const distance = haversineDistance(
      task.targetLat,
      task.targetLng,
      input.latitude,
      input.longitude
    );

    if (distance > MAX_DISTANCE_METERS) {
      throw ApiError.badRequest(
        `Too far from target. Distance: ${Math.round(distance)}m, maximum allowed: ${MAX_DISTANCE_METERS}m`
      );
    }

    const updated = await prisma.task.updateMany({
      where: {
        id: taskId,
        acceptedById: captainId,
        status: TaskStatus.IN_PROGRESS,
      },
      data: {
        status: TaskStatus.SUBMITTED,
        evidenceImage: imagePath,
        evidenceLat: input.latitude,
        evidenceLng: input.longitude,
        evidenceAccuracy: input.accuracy ?? null,
        evidenceCapturedAt: input.capturedAt
          ? new Date(input.capturedAt)
          : new Date(),
        evidenceSubmittedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      throw ApiError.badRequest("Task must be IN_PROGRESS to submit evidence");
    }

    return prisma.task.findUniqueOrThrow({
      where: { id: taskId },
      include: taskWithUsers,
    });
  }

  /**
   * User marks a task as completed (SUBMITTED → COMPLETED).
   * Wrapped in a transaction to guard against duplicate complete requests.
   */
  static async completeTask(taskId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw ApiError.notFound("Task not found");
      if (task.createdById !== userId) {
        throw ApiError.forbidden("Only the task creator can mark it as completed");
      }
      if (task.status !== TaskStatus.SUBMITTED) {
        throw ApiError.badRequest("Task must be SUBMITTED to complete");
      }

      return tx.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.COMPLETED },
        include: taskWithUsers,
      });
    });
  }
}
