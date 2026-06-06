const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    if (isTest) return;
    const line = meta
      ? `${timestamp()} [INFO]  ${message} ${JSON.stringify(meta)}`
      : `${timestamp()} [INFO]  ${message}`;
    console.log(line);
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    if (isTest) return;
    const line = meta
      ? `${timestamp()} [WARN]  ${message} ${JSON.stringify(meta)}`
      : `${timestamp()} [WARN]  ${message}`;
    console.warn(line);
  },

  error(message: string, error?: unknown): void {
    if (isTest) return;
    const detail =
      error instanceof Error ? error.stack ?? error.message : String(error ?? "");
    console.error(`${timestamp()} [ERROR] ${message}${detail ? `\n${detail}` : ""}`);
  },

  /** Emitted only outside production — useful for local dev and tests disabled. */
  debug(message: string, meta?: Record<string, unknown>): void {
    if (isProd || isTest) return;
    const line = meta
      ? `${timestamp()} [DEBUG] ${message} ${JSON.stringify(meta)}`
      : `${timestamp()} [DEBUG] ${message}`;
    console.log(line);
  },
};
