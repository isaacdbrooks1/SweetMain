// Private edit links for owners. Each listing has a secret key; only a hash of
// it is stored (supabase/004_email.sql), and the key itself lives only in the
// link emailed to the owner. Sending a new link replaces the old key.
import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { supabase } from "./supabase";
import { emailConfigured, emailHtml, sendEmail, siteUrl } from "./email";

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function tokenMatches(id: string, token: string): Promise<boolean> {
  if (!token || token.length > 100) return false;
  const { data } = await supabase.from("businesses").select("edit_token_hash").eq("id", id).maybeSingle();
  const stored = data?.edit_token_hash;
  if (!stored) return false;
  const a = Buffer.from(stored);
  const b = Buffer.from(hash(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

// Makes a fresh key for the listing and emails the owner a link with it.
// `isNew` changes the wording for a just-published listing.
export async function sendEditLink(id: string, isNew = false): Promise<void> {
  if (!emailConfigured()) return;
  const { data: b, error } = await supabase
    .from("businesses")
    .select("id, name, owner_email, edit_link_sent_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !b) return;

  // At most one link every 2 minutes per listing, so the form can't be used to flood an inbox.
  if (!isNew && b.edit_link_sent_at && Date.now() - Date.parse(b.edit_link_sent_at) < 2 * 60 * 1000) return;

  const token = randomBytes(24).toString("base64url");
  await supabase
    .from("businesses")
    .update({ edit_token_hash: hash(token), edit_link_sent_at: new Date().toISOString() })
    .eq("id", id);

  const site = await siteUrl();
  const editUrl = `${site}/b/${b.id}/edit?key=${token}`;
  const pageUrl = `${site}/b/${b.id}`;
  const intro = isNew
    ? `Your listing for ${b.name} is live on Sweet Main: ${pageUrl}`
    : `Here's a new link to edit your Sweet Main listing for ${b.name}.`;
  const paragraphs = [
    intro,
    "Use the button below whenever you want to update your listing. Keep this email: the link is private, so don't share it. Asking for a new link turns this one off.",
  ];
  await sendEmail({
    to: b.owner_email,
    subject: isNew ? `${b.name} is live on Sweet Main` : `Your link to edit ${b.name}`,
    text: `${paragraphs.join("\n\n")}\n\nEdit your listing: ${editUrl}`,
    html: emailHtml(paragraphs, { label: "Edit your listing", url: editUrl }),
  });
}

// For the "lost your link?" page: sends a link for every listing under that email.
export async function sendEditLinksForEmail(email: string): Promise<void> {
  const { data } = await supabase
    .from("businesses")
    .select("id")
    .ilike("owner_email", email.replace(/[%_]/g, ""))
    .limit(10);
  for (const row of data ?? []) await sendEditLink(row.id).catch((e) => console.error("edit link failed", e));
}
