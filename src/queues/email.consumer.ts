import { Channel, ConsumeMessage } from "amqplib";
import { log } from "@notifications/logger";
import { IEmailLocals } from "@muhammadjalil8481/jobber-shared";
import { config } from "@notifications/config";
import { sendEmail } from "./mail.transport";

interface ConsumerParams {
  channel: Channel;
  exchangeName: string;
  queueName: string;
  bindingKey: string;
  name: string;
  handler: (message: ConsumeMessage) => Promise<void>;
}

async function consumeMessage(data: ConsumerParams): Promise<void> {
  try {
    const { channel, exchangeName, queueName, bindingKey, handler, name } =
      data;
    if (!channel) {
      throw new Error("Channel is not defined");
    }
    await channel.assertExchange(exchangeName, "direct");
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(jobberQueue.queue, exchangeName, bindingKey);
    channel.consume(
      jobberQueue.queue,
      async (message: ConsumeMessage | null) => {
        try {
          await handler(message!);
        } catch (error) {
          log.error(
            `Notification service consumeMessage() consumer method: ${name}`,
            error
          );
        }
      }
    );
  } catch (error) {
    log.error("Notification service consumeMessage() method", error);
  }
}

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  await consumeMessage({
    channel,
    name: "auth_email",
    exchangeName: "auth_email_exchange",
    queueName: "auth_email_queue",
    bindingKey: "auth_email_key",
    handler: async (message: ConsumeMessage) => {
      const data = JSON.parse(message!.content.toString());
      log.info("Notification service Received auth email message:", data);
      if (!data) throw new Error("Data not recieved in auth email consumer");

      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL!,
        appIcon:
          "https://www.shutterstock.com/image-vector/circular-logo-chain-round-link-260nw-2330524625.jpg",
        username: data.username,
        verifyLink: data.verifyLink,
        resetLink: data.resetLink,
      };
      await sendEmail(data.template, data.receiverEmail, locals);

      // acknowledge the message after processing
      log.info("Notification service auth email Acknowledging message:", data);
      channel.ack(message!);
    },
  });
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  await consumeMessage({
    channel,
    name: "order_email",
    exchangeName: "order_email_exchange",
    queueName: "order_email_queue",
    bindingKey: "order_email_key",
    handler: async (message: ConsumeMessage) => {
      const data = JSON.parse(message!.content.toString());
      log.info("Notification service Received order email message:", data);
      if (!data) throw new Error("Data not recieved in order email consumer");

      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL!,
        appIcon:
          "https://www.shutterstock.com/image-vector/circular-logo-chain-round-link-260nw-2330524625.jpg",
        username: data.username,
        sender: data.sender,
        offerLink: data.offerLink,
        amount: data.amount,
        buyerUsername: data.buyerUsername,
        sellerUsername: data.sellerUsername,
        title: data.title,
        description: data.description,
        deliveryDays: data.deliveryDays,
        orderId: data.orderId,
        orderDue: data.orderDue,
        requirements: data.requirements,
        orderUrl: data.orderUrl,
        originalDate: data.originalDate,
        newDate: data.newDate,
        reason: data.reason,
        subject: data.subject,
        header: data.header,
        type: data.type,
        message: data.message,
        serviceFee: data.serviceFee,
        total: data.total,
      };

      if (data.template === "orderPlaced") {
        await sendEmail("orderPlaced", data.receiverEmail, locals);
        await sendEmail("orderReceipt", data.senderEmail, locals);
      } else {
        await sendEmail(data.template, data.receiverEmail, locals);
      }
      // acknowledge the message after processing
      log.info("Notification service Acknowledging message:", data);
      channel.ack(message!);
    },
  });
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };
