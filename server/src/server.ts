import "dotenv/config";
import http from "http";
import app from "./app";
import { initializeSocket } from "./sockets";

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║       InstantLocate Server Running       ║
║──────────────────────────────────────────║
║  REST API:  http://localhost:${PORT}/api    ║
║  WebSocket: http://localhost:${PORT}        ║
║  Health:    http://localhost:${PORT}/api/health ║
╚══════════════════════════════════════════╝
  `);
});
