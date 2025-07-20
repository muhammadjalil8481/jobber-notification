import client, { Channel, ChannelModel } from "amqplib";
import { log } from "@notifications/logger";
import { config } from "@notifications/config";
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from "./email.consumer";

async function createConnection(): Promise<Channel | undefined> {
  let retries = 0;
  const maxRetries = 3;

  log.info(
    `Notification service createConnection() method: Connecting to RabbitMQ ${config.RABBITMQ_ENDPOINT}...`
  );
  while (retries < maxRetries) {
    try {
      const url = config.RABBITMQ_ENDPOINT;
      const connection: ChannelModel = await client.connect(`${url}`);
      const channel: Channel = await connection.createChannel();
      log.info("Notification service connected to RabbitMQ successfully");

      // Consumer
      await consumeAuthEmailMessages(channel);
      await consumeOrderEmailMessages(channel);

      closeConnection(channel, connection);
      return channel;
    } catch (error) {
      retries++;
      if (retries >= 3) {
        log.error("Notification service createConnection() method", error);
        process.exit(1);
      }
    }
  }
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
}
export { createConnection };
