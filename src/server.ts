// import "express-async-errors";
import { LogLevel, winstonLogger } from "@muhammadjalil8481/jobber-shared";
import { Application } from "express";
import { Logger } from "winston";
import http from "http";
import { healthRoutes } from "./routes";

const SERVER_PORT = 4001;

const log: Logger = winstonLogger({
  name: "notification-service",
  level: LogLevel.DEBUG,
});

export function start(app: Application): void {
  startServer(app);
  app.use("",healthRoutes)
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {}

function startElasticSearch(): void {}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(
      `Worked with process if of ${process.pid} on notification server has started`
    );
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log(LogLevel.ERROR, "Notification service startServer() method", error);
  }
}
