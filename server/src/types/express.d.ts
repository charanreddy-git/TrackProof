import type { JwtPayload } from "../utils";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
