"use server";

import { Resend } from "resend";

export const handleContact = async ({
  type,
  name,
  email,
  message,
  honeypot,
}: {
  type: "call" | "contact";
  name: string;
  email: string;
  message?: string;
  honeypot?: string;
}): Promise<{ success: boolean; error?: string }> => {
  // Honeypot check
  if (honeypot && honeypot.trim() !== "") {
    return { success: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "hello@tailormadeanalytics.com";

    const subject =
      type === "call"
        ? `TMA call request from ${name}`
        : `TMA message from ${name}`;

    const body =
      type === "call"
        ? `Name: ${name}\nEmail: ${email}\n\nThis person requested a call booking.`
        : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message ?? "(no message)"}`;

    const { error } = await resend.emails.send({
      from: `TMA Contact <hello@tailormadeanalytics.com>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject,
      text: body,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("handleContact exception:", msg);
    return { success: false, error: msg };
  }
};
