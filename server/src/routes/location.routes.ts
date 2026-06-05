import { Router } from "express";
import { LocationController } from "../controllers/location.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

// Update captain location (CAPTAIN only)
router.post(
  "/update",
  authorize(["CAPTAIN"]),
  LocationController.updateLocation
);

// Get location history for a task
router.get("/:taskId", LocationController.getLocationHistory);

export default router;
