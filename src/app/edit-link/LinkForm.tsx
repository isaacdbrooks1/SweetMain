"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { requestEditLink, type LinkState } from "./actions";

export default function LinkForm() {
  const [state, action, pending] = useActionState<LinkState, FormData>(requestEditLink, {});

  if (state.sent) {
    return (
      <div role="status" className="mt-6 flex items-start gap-3 rounded-md border border-brand/30 bg-brand-soft p-5">
        <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={22} />
        <div>
          <p className="font-bold">Check your email.</p>
          <p className="mt-1 text-muted">
            If that address has a listing on Sweet Main, a new edit link is on its way. It can take a
            minute; check your spam folder too.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-4">
      <div aria-hidden className="absolute left-[-9999px]">
        <label>Company <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label htmlFor="email" className="label">The email you listed your business with</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      {state.error && <p className="font-bold text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Sending…" : "Email me an edit link"}
      </button>
    </form>
  );
}
