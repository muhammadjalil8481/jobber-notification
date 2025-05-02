import client, { Channel, ChannelModel } from "amqplib";
import { log } from "@notifications/logger";
import { config } from "@notifications/config";
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from "./email.consumer";
// import { IEmailMessageDetails } from "@muhammadjalil8481/jobber-shared";

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`
    );
    const channel: Channel = await connection.createChannel();
    log.info("Notification service connected to RabbitMQ successfully");

    // Consumer
    await consumeAuthEmailMessages(channel);
    await consumeOrderEmailMessages(channel);

    // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=3232324234`;
    // const messageDetails: IEmailMessageDetails = {
    //   receiverEmail: "kjalil875@gmail.com",
    //   template: "verifyEmail",
    //   verifyLink: verificationLink,
    // };
    // await channel.assertExchange("auth_email_exchange", "direct");
    // const message = JSON.stringify(messageDetails);
    // channel.publish(
    //   "auth_email_exchange",
    //   "auth_email_key",
    //   Buffer.from(message)
    // );

    closeConnection(channel, connection);
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
