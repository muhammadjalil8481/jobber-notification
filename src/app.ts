import express from "express";
import { start } from "@notifications/server";

const app = express();

start(app);
