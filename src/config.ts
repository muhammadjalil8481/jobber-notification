import dotenv from "dotenv";

dotenv.config();
class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SENDER_EMAIL_NAME: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public SMTP_HOST: string | undefined;
  public SMTP_PORT: string | undefined;
  public PORT: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.SENDER_EMAIL_NAME = process.env.SENDER_EMAIL_NAME || "";
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || "";
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || "";
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || "";
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || "";
    this.SMTP_HOST = process.env.SMTP_HOST || "";
    this.SMTP_PORT = process.env.SMTP_PORT || "";
    this.PORT = process.env.PORT || "";

    validateEnvVariables(this);
  }
}

function validateEnvVariables(config: Config) {
  const missingVars: string[] = [];

  for (const key in config) {
    const value = config[key as keyof Config];
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
}

export const config = new Config();
