"use server";

import { sendEditLinksForEmail } from "@/lib/editLinks";

export type LinkState = { sent?: boolean; error?: string };

export async function requestEditLink(_prev: LinkState, formData: FormData): Promise<LinkState> {
  if (String(formData.get("company") ?? "")) return { sent: true }; // bot trap
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  await sendEditLinksForEmail(email);
  // Same answer whether or not the email has listings, so this can't be used to check who's listed.
  return { sent: true };
}
