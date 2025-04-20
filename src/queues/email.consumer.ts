import { Channel, ConsumeMessage } from "amqplib";
import { log } from "@notifications/logger";

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      throw new Error("Channel is not defined");
    }
    const exchangeName = "auth_email_exchange";
    const queueName = "auth_email_queue";
    const bindingKey = "auth.email.key";

    await channel.assertExchange(exchangeName, "direct");
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(jobberQueue.queue, exchangeName, bindingKey);
    channel.consume(
      jobberQueue.queue,
      async (message: ConsumeMessage | null) => {
        console.log(
          "Received message:",
          JSON.parse(message!.content.toString())
        );

        // send emails

        // acknowledge the message after processing
      }
    );
  } catch (error) {
    log.error("Notification service consumeAuthEmailMessages() method", error);
  }
}

export { consumeAuthEmailMessages };
