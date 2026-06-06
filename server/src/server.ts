import "dotenv/config";
import http from "http";
import app from "./app";
import { initializeSocket } from "./sockets";
import { prisma } from "./lib/prisma";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`Server ready`, { port: PORT });
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received — shutting down gracefully`);
  httpServer.close(async () => {
    await prisma.$disconnect();
    logger.info("Server closed");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
