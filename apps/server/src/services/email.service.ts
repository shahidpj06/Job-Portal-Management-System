import { Resend } from "resend";
import { env } from "../config/env.js";

interface IPasswordResetEmail {
  email: string;
  token: string;
  expiresAt: Date;
}

const resend = new Resend(env.RESEND_API_KEY);

const sendPasswordResetEmail = async (
  input: IPasswordResetEmail,
): Promise<void> => {
  const resetUrl = new URL("/reset-password", env.CLIENT_URL);

  resetUrl.searchParams.set("token", input.token);

  const text = [
    "Reset your JobNest password",
    "",
    "We received a request to reset your password.",
    "Open the following link to choose a new password:",
    "",
    resetUrl.toString(),
    "",
    `This link expires at ${input.expiresAt.toUTCString()} and can only be used once.`,
    "",
    "If you did not request this, ignore this email. Your password has not changed.",
    "",
    "Do not forward this email or share this link.",
    "",
    "JobNest",
  ].join("\n");

  try {
    const { data, error } = await resend.emails.send({
      from: `JobNest <${env.EMAIL_FROM}>`,
      to: input.email,
      subject: "Reset your JobNest password",
      text,
    });

    if (error || !data) {
      console.error("[EmailService] Resend rejected email dispatch:", error);
      throw new Error("Email provider rejected the request.");
    }
  } catch (error) {
    console.error("[EmailService] Unable to send email:", error);
    throw new Error("Unable to send password reset email.");
  }
};

export const EmailService = {
  sendPasswordResetEmail,
};
