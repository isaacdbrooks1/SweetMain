"use server";

// "Message the owner" for people interested in investing. The message is saved
// and emailed to the owner with Reply-To set to the sender, so the owner's
// address is never shown. Sweet Main only passes the message along.
import { supabase } from "./supabase";
import { emailHtml, sendEmail } from "./email";

export type MessageState = { sent?: boolean; error?: string };

const AMOUNTS = ["Not sure yet", "Under $1,000", "$1,000 to $10,000", "$10,000 to $50,000", "Over $50,000"];

export async function sendInvestorMessage(_prev: MessageState, formData: FormData): Promise<MessageState> {
  if (String(formData.get("company") ?? "")) return { sent: true }; // bot trap
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const id = get("businessId");
  const name = get("name");
  const email = get("email");
  const amount = AMOUNTS.includes(get("amount")) ? get("amount") : "Not sure yet";
  const message = get("message");

  if (!name || name.length > 80) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email so the owner can reply." };
  if (message.length < 10) return { error: "Please write a little more about what you have in mind." };
  if (message.length > 1500) return { error: "Please keep your message under 1,500 characters." };

  const { data: b } = await supabase
    .from("businesses")
    .select("id, name, owner_email, investor_contact, status")
    .eq("id", id)
    .maybeSingle();
  if (!b || b.status !== "live" || !b.investor_contact) return { error: "This business isn't taking messages right now." };

  // Limits: 2 messages a day from one person to one business, 10 an hour to any one business.
  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const hourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  const [fromSender, recent] = await Promise.all([
    supabase.from("investor_messages").select("id", { count: "exact", head: true }).eq("business_id", id).ilike("sender_email", email.replace(/[%_]/g, "")).gte("created_at", dayAgo),
    supabase.from("investor_messages").select("id", { count: "exact", head: true }).eq("business_id", id).gte("created_at", hourAgo),
  ]);
  if ((fromSender.count ?? 0) >= 2) return { error: "You've already messaged this business today. The owner will reply by email." };
  if ((recent.count ?? 0) >= 10) return { error: "This business has had a lot of messages just now. Please try again later." };

  const { data: row, error } = await supabase
    .from("investor_messages")
    .insert({ business_id: id, sender_name: name, sender_email: email, amount, message })
    .select("id")
    .single();
  if (error) return { error: "Something went wrong saving your message. Please try again." };

  const paragraphs = [
    `${name} is interested in investing in ${b.name} and sent you this message through Sweet Main:`,
    message,
    `Amount they mentioned: ${amount}`,
    `Reply to this email to answer ${name} directly at ${email}.`,
    "Sweet Main only passes messages along. We don't review, arrange or take part in any investment, so get proper advice before agreeing to anything.",
  ];
  try {
    await sendEmail({
      to: b.owner_email,
      subject: `${name} is interested in investing in ${b.name}`,
      text: paragraphs.join("\n\n"),
      html: emailHtml(paragraphs),
      replyTo: email,
    });
    await supabase.from("investor_messages").update({ emailed: true }).eq("id", row.id);
  } catch (e) {
    console.error("investor message email failed", e);
    return { error: "We saved your message but couldn't email it just now. Please try again later." };
  }
  return { sent: true };
}
