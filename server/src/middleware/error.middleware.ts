import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError, logger } from "../utils";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    res.status(400).json({ success: false, message: "Validation failed", errors });
    return;
  }

  // Custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Prisma unique constraint violation
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
    return;
  }

  // Unexpected errors — log with full context, return safe message in production
  logger.error("Unhandled error", err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
}
