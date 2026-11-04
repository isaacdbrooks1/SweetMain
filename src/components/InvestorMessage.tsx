"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { sendInvestorMessage, type MessageState } from "@/lib/investorActions";

// Collapsed to one button until someone wants to write, to keep the page calm.
export default function InvestorMessage({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<MessageState, FormData>(sendInvestorMessage, {});

  if (state.sent) {
    return (
      <p role="status" className="mt-3 flex items-start gap-2 text-[15px]">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
        Sent. The owner will reply to your email.
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary mt-3 w-full">
        <MessageSquare size={18} /> Message the owner
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 space-y-3">
      <input type="hidden" name="businessId" value={businessId} />
      <div aria-hidden className="absolute left-[-9999px]">
        <label>Company <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label htmlFor="inv-name" className="label">Your name</label>
        <input id="inv-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="inv-email" className="label">Your email</label>
        <input id="inv-email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="inv-amount" className="label">Amount you have in mind</label>
        <select id="inv-amount" name="amount" className="field" defaultValue="Not sure yet">
          <option>Not sure yet</option>
          <option>Under $1,000</option>
          <option>$1,000 to $10,000</option>
          <option>$10,000 to $50,000</option>
          <option>Over $50,000</option>
        </select>
      </div>
      <div>
        <label htmlFor="inv-message" className="label">Message</label>
        <textarea id="inv-message" name="message" rows={4} required maxLength={1500} className="field" placeholder="A little about you and what you have in mind." />
      </div>
      {state.error && <p className="text-[15px] font-bold text-danger">{state.error}</p>}
      <p className="text-[13px] text-muted">Your message is emailed to the owner, who can reply to you directly.</p>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
