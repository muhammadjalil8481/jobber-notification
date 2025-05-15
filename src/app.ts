import express from "express";
import { start } from "@notifications/server";
import { errorHandlerMiddleware } from "./error-handler";

const app = express();

start(app);
errorHandlerMiddleware(app);
