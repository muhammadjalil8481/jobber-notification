import client, { Channel, ChannelModel } from "amqplib";
import { log } from "@notifications/logger";
import { config } from "@notifications/config";

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`
    );
    const channel: Channel = await connection.createChannel();
    log.info("Notification service connected to RabbitMQ successfully");
    closeConnection;
    return channel;
  } catch (error) {
    log.error("Notification service createConnection() method", error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
}
export { createConnection };
