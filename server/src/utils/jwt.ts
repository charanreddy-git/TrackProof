import jwt, { type SignOptions } from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  console.error("CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is not defined!");
  process.exit(1);
}

const JWT_SECRET: string = rawSecret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  phone: string;
  role: "USER" | "CAPTAIN";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload as object, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
}
