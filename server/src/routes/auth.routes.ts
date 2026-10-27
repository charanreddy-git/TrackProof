import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { AuthController } from "../controllers";

const router = Router();

const requestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many code requests from this connection. Try again later.",
  },
});

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many verification attempts. Try again later.",
  },
});

router.post("/otp/request", requestLimiter, AuthController.requestOtp);
router.post("/otp/verify", verifyLimiter, AuthController.verifyOtp);

// Development-only auth bypass. DemoService re-checks the environment on every
// request, so these routes cannot mint demo sessions in production.
const demoLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many demo requests. Try again in a few minutes.",
  },
});

router.get("/mode", AuthController.getMode);
router.post("/demo", demoLimiter, AuthController.demoLogin);
router.post("/demo/reset", demoLimiter, AuthController.resetDemo);

export default router;
