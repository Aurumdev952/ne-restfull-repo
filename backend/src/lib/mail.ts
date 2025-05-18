import { mail } from "@/config";
import nodemailer from "nodemailer";

export async function sendEmail({
  content,
  subject,
  toEmail,
}: {
  toEmail: string;
  subject: string;
  content: string;
}) {
  try {
    let transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: false,
      ignoreTLS: true,
    });

    let mailOptions = {
      from: '"Test User" <test@example.com>',
      to: toEmail,
      subject,
      //   text: "This is a test email.", // Plain text body
      html: content,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}
