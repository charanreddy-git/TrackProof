import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import locationRoutes from "./routes/location.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded evidence images)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/location", locationRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
