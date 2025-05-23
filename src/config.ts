import { createConfig } from "@muhammadjalil8481/jobber-shared";
import dotenv from "dotenv";

dotenv.config();

const envList = [
  "NODE_ENV",
  "CLIENT_URL",
  "SENDER_EMAIL_NAME",
  "SENDER_EMAIL",
  "SENDER_EMAIL_PASSWORD",
  "RABBITMQ_ENDPOINT",
  "ELASTIC_SEARCH_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "PORT",
] as const;

export const config = createConfig(envList);
