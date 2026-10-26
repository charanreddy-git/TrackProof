import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { requestOtpSchema, verifyOtpSchema } from "../validators";

export class AuthController {
  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const input = requestOtpSchema.parse(req.body);
      const result = await AuthService.requestOtp(input);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const input = verifyOtpSchema.parse(req.body);
      const result = await AuthService.verifyOtp(input);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
