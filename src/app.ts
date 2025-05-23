import express from "express";
import { start } from "@notifications/server";
import { errorHandlerMiddleware } from "@muhammadjalil8481/jobber-shared";
import { log } from "./logger";

const app = express();

start(app);
app.use(errorHandlerMiddleware({ log, serviceName: "notification-service" }));
