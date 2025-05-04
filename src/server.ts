// import "express-async-errors";
import { LogLevel } from "@muhammadjalil8481/jobber-shared";
import { Application } from "express";
import http from "http";
import { healthRoutes } from "./routes";
import { log } from "./logger";
import { config } from "./config";
import { checkElasticSearchConnection } from "./elasticsearch";
import { createConnection } from "./queues/connection";
const SERVER_PORT = config.PORT;

export function start(app: Application): void {
  startServer(app);
  app.use("", healthRoutes);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
 await createConnection();
}

function startElasticSearch(): void {
  checkElasticSearchConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(
      `Worker with process id of ${process.pid} on notification server has started`
    );
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log(LogLevel.ERROR, "Notification service startServer() method", error);
  }
}
