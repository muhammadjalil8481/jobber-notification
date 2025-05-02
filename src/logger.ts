import { Logger } from "winston";
import { LogLevel, winstonLogger } from "@muhammadjalil8481/jobber-shared";
import { config } from "./config";

const log: Logger = winstonLogger({
  name: "notification-service",
  level: LogLevel.DEBUG,
  elasticSearchNode: config.ELASTIC_SEARCH_URL,
});

// ✅ Wrap log methods to also print to Debug Console
const logMethods = ["info", "warn", "error", "debug"] as const;

logMethods.forEach((method) => {
  const original = log[method].bind(log);
  log[method] = (...args) => {
    // Pipe to original logger
    original(...args);
    
    // Pipe to VS Code Debug Console
    const tag = `[${method.toUpperCase()}]`;

    // @ts-ignore - Ignore the type error here
    console[method === "debug" ? "log" : method](tag, ...args);

    return log;
  };
});



export { log };
