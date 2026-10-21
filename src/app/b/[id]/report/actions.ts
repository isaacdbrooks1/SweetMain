"use server";

import { getBusiness } from "@/lib/businesses";
import { addReport, REPORT_REASONS } from "@/lib/moderation";

export type ReportState = { sent?: boolean; error?: string };

export async function sendReport(_prev: ReportState, formData: FormData): Promise<ReportState> {
  // Bots fill in every field; people never see this one.
  if (String(formData.get("company") ?? "")) return { sent: true };

  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "");
  const details = String(formData.get("details") ?? "").trim();

  if (!REPORT_REASONS.includes(reason)) return { error: "Please choose a reason." };
  if (details.length > 1000) return { error: "Please keep the details under 1,000 characters." };
  if (!(await getBusiness(id))) return { error: "That listing no longer exists." };

  await addReport(id, reason, details);
  return { sent: true };
}
