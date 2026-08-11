import { Resend } from "resend";

let resendClient: Resend | null = null;

/** Lazily instantiated so the Resend SDK doesn't throw at build/import time when no key is configured yet. */
export function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Juriskills <achats@juriskills.fr>";
