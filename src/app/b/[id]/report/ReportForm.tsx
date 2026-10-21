"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { sendReport, type ReportState } from "./actions";

export default function ReportForm({ id, reasons }: { id: string; reasons: string[] }) {
  const [state, action, pending] = useActionState<ReportState, FormData>(sendReport, {});

  if (state.sent) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-md border border-brand/30 bg-brand-soft p-5">
        <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={22} />
        <div>
          <p className="font-bold">Thanks, your report was sent.</p>
          <p className="mt-1 text-muted">We&apos;ll look at this listing and remove it if it breaks the rules.</p>
          <Link href={`/b/${id}`} className="mt-3 inline-block font-bold text-brand hover:underline">
            Back to the listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={id} />
      {/* Hidden from people; catches bots that fill in every field. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="label">What&apos;s wrong with this listing?</legend>
        <div className="mt-2 space-y-2">
          {reasons.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-3 rounded-md border border-line px-4 py-3 hover:border-ink has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
              <input type="radio" name="reason" value={r} required className="h-4 w-4 accent-brand" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="details" className="label">
          Anything else we should know? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="details" name="details" rows={4} maxLength={1000} className="field" />
      </div>

      {state.error && <p className="font-bold text-danger">{state.error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Sending…" : "Send report"}
        </button>
        <Link href={`/b/${id}`} className="font-bold text-muted hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}
