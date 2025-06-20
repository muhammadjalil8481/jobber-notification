import { IEmailLocals } from "@muhammadjalil8481/jobber-shared";
import nodemailer from "nodemailer";
import { config } from "../config";
import Email from "email-templates";
import path from "path";

async function sendEmail(
  template: string,
  receiver: string,
  locals: IEmailLocals
): Promise<void> {
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: false,
    auth: {
      user: config.SENDER_EMAIL,
      pass: config.SENDER_EMAIL_PASSWORD,
    },
  });

  const email: Email = new Email({
    message: {
      from: `Jobber App <${config.SENDER_EMAIL}>`,
    },
    send: true,
    preview: false,
    transport: transporter,
    views: {
      options: {
        extension: "ejs",
      },
    },
    juice: true, // Enable juice for inlining CSS
    juiceResources: {
      preserveImportant: true, // Preserve important CSS rules,
      webResources: {
        relativeTo: path.join(__dirname, `.../build`),
      },
    },
  });

  await email.send({
    template: path.join(__dirname, "..", "emails", template),
    message: {
      to: receiver,
    },
    locals,
  });
}

export { sendEmail };
