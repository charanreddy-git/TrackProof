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

export default router;
