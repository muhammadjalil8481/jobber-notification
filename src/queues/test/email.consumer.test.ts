import * as connection from "@notifications/queues/connection";
import { Channel } from "amqplib";
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from "../email.consumer";

jest.mock("@notifications/queues/connection");
jest.mock("amqplib");
jest.mock("@muhammadjalil8481/jobber-shared");

jest.mock("@muhammadjalil8481/jobber-shared", () => ({
  winstonLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }),
  LogLevel: {
    DEBUG: "debug",
  },
}));

describe("Email Consumer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("consumeAuthEmailMessages Method", () => {
    it("should be called", async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, "assertExchange");
      jest.spyOn(channel, "assertQueue").mockReturnValue({
        queue: "auth_email_queue",
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, "createConnection")
        .mockReturnValue(channel as never);
      const connectionChannel = await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel as Channel);
      expect(connectionChannel?.assertExchange).toHaveBeenCalledWith(
        "auth_email_exchange",
        "direct"
      );
      expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.bindQueue).toHaveBeenCalledWith(
        "auth_email_queue",
        "auth_email_exchange",
        "auth_email_key"
      );
    });
  });

  describe("consumeOrderEmailMessages Method", () => {
    it("should be called", async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, "assertExchange");
      jest.spyOn(channel, "assertQueue").mockReturnValue({
        queue: "order_email_queue",
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, "createConnection")
        .mockReturnValue(channel as never);
      const connectionChannel = await connection.createConnection();
      await consumeOrderEmailMessages(connectionChannel as Channel);
      expect(connectionChannel?.assertExchange).toHaveBeenCalledWith(
        "order_email_exchange",
        "direct"
      );
      expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.bindQueue).toHaveBeenCalledWith(
        "order_email_queue",
        "order_email_exchange",
        "order_email_key"
      );
      expect(connectionChannel?.consume).toHaveBeenCalledTimes(1);
    });
  });
});
