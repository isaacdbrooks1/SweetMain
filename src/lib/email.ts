// Sends email through Resend (resend.com). Needs RESEND_API_KEY in .env.local
// and in Vercel, and sweetmain.com verified in Resend.
import "server-only";
import { headers } from "next/headers";

const FROM = "Sweet Main <hello@sweetmain.com>";

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(msg: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set.");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      // Replies reach the hello@ inbox unless a message sets its own Reply-To.
      reply_to: msg.replyTo ?? "hello@sweetmain.com",
    }),
  });
  if (!res.ok) throw new Error(`Resend refused the email (${res.status}): ${await res.text()}`);
}

// Makes text safe to put inside an HTML email.
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// A plain, readable email layout: text, an optional button, a small footer.
export function emailHtml(paragraphs: string[], button?: { label: string; url: string }): string {
  const body = paragraphs.map((p) => `<p style="margin:0 0 16px">${esc(p)}</p>`).join("");
  const btn = button
    ? `<p style="margin:24px 0"><a href="${esc(button.url)}" style="background:#0b6b3a;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:6px;display:inline-block">${esc(button.label)}</a></p>`
    : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#1e2420;max-width:560px">${body}${btn}<p style="margin:32px 0 0;font-size:13px;color:#5f6b64">Sweet Main · Find and support small businesses near you.</p></div>`;
}

// The site's own address for links in emails. On the live site it's fixed, so a
// faked request can never make an emailed link point somewhere else.
export async function siteUrl(): Promise<string> {
  if (process.env.NODE_ENV === "production") return "https://www.sweetmain.com";
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.sweetmain.com";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

// Where Sweet Main's own mail goes. Cloudflare Email Routing forwards it to the owner's inbox.
export const CONTACT_EMAIL = "hello@sweetmain.com";

// A short heads-up to Sweet Main (new listing, new report). Never throws: an alert
// failing must not break the visitor's action.
export async function notifyAdmin(subject: string, lines: string[], link: { label: string; url: string }) {
  if (!emailConfigured()) return;
  try {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `[Sweet Main] ${subject}`,
      text: `${lines.join("\n\n")}\n\n${link.label}: ${link.url}`,
      html: emailHtml(lines, link),
    });
  } catch (e) {
    console.error("admin alert failed", e);
  }
}
