import express from "express";
import { start } from "@notifications/server";
import { errorHandlerMiddleware } from "@muhammadjalil8481/jobber-shared";
import { log } from "./logger";
import cookieParser from "cookie-parser"

const app = express();

start(app);

app.use(cookieParser())
app.use(errorHandlerMiddleware({ log, serviceName: "notification-service" }));
