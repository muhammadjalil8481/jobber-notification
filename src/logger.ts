import { Logger } from "winston";
import { LogLevel, winstonLogger } from "@muhammadjalil8481/jobber-shared";


const log: Logger = winstonLogger({
    name: "notification-service",
    level: LogLevel.DEBUG,
});

export { log }