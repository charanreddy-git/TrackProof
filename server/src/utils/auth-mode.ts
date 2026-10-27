import { ApiError } from "./api-error";
import { logger } from "./logger";

export type AuthMode = "otp" | "demo";
export type DemoRole = "USER" | "CAPTAIN";

/**
 * Demo accounts are deliberately hard-coded. They are only ever created or
 * returned while AUTH_MODE=demo outside production.
 */
export const DEMO_ACCOUNTS = {
  USER: {
    name: "Demo Requester",
    phone: "+919876543210",
  },
  CAPTAIN: {
    name: "Demo Inspector",
    phone: "+919876543211",
  },
} as const;

let warnedAboutInvalidMode = false;

export function isDemoAuthEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;

  const configured = process.env.AUTH_MODE?.trim().toLowerCase();

  if (configured && configured !== "otp" && configured !== "demo") {
    if (!warnedAboutInvalidMode) {
      logger.warn(
        `Ignoring invalid AUTH_MODE "${configured}". Falling back to otp.`
      );
      warnedAboutInvalidMode = true;
    }
    return false;
  }

  return configured === "demo";
}

export function getAuthMode(): AuthMode {
  return isDemoAuthEnabled() ? "demo" : "otp";
}

export function requireDemoAuth(): void {
  if (!isDemoAuthEnabled()) {
    throw ApiError.forbidden(
      "Demo authentication is disabled. Set AUTH_MODE=demo in a non-production environment to use it."
    );
  }
}
