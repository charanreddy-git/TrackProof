import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Resolve Google Maps URL (USER only)
router.post("/resolve-url", authorize(["USER"]), TaskController.resolveUrl);

// Create task (USER only)
router.post("/", authorize(["USER"]), TaskController.createTask);

// Get tasks (filtered by role automatically)
router.get("/", TaskController.getTasks);

// Get single task
router.get("/:id", TaskController.getTaskById);

// Accept task (CAPTAIN only)
router.post("/:id/accept", authorize(["CAPTAIN"]), TaskController.acceptTask);

// Start task (CAPTAIN only)
router.post("/:id/start", authorize(["CAPTAIN"]), TaskController.startTask);

// Submit evidence (CAPTAIN only, with file upload)
router.post(
  "/:id/submit",
  authorize(["CAPTAIN"]),
  upload.single("image"),
  TaskController.submitTask
);

// Complete task (USER only)
router.post("/:id/complete", authorize(["USER"]), TaskController.completeTask);

export default router;
