import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await resend.emails.send({
      from: "harshagarwal81528@gmail.com",
      to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
