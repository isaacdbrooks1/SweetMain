"use client";

import { useActionState } from "react";
import { createBusiness, type FormState } from "./actions";
import { CATEGORIES, SUPPORT_PLATFORMS, SUPPORT_ROWS } from "@/lib/categories";

function Section({ step, title, intro, children }: {
  step: number;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand">
          {step}
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          {intro && <p className="mt-1 text-muted">{intro}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-sm font-medium text-danger">{msg}</p> : null;
}

export default function AddBusinessForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createBusiness, {});
  const val = state.values ?? {};
  const err = state.errors ?? {};
  const errorCount = Object.keys(err).length;

  const text = (name: string, label: string, opts: { placeholder?: string; hint?: string; required?: boolean; type?: string } = {}) => (
    <div>
      <label htmlFor={name} className="label">
        {label} {opts.required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={opts.type ?? "text"}
        defaultValue={val[name]}
        placeholder={opts.placeholder}
        aria-invalid={!!err[name]}
        className={`field ${err[name] ? "border-danger" : ""}`}
      />
      {opts.hint && !err[name] && <p className="hint">{opts.hint}</p>}
      <ErrorText msg={err[name]} />
    </div>
  );

  return (
    // The key makes the form refill with what the person typed after an error.
    <form action={action} key={JSON.stringify(val)} className="space-y-6" noValidate>
      {errorCount > 0 && (
        <div role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-4 font-medium text-danger">
          Please fix {errorCount === 1 ? "the item" : `the ${errorCount} items`} marked below.
        </div>
      )}

      <Section step={1} title="About your business">
        {text("name", "Business name", { required: true, placeholder: "Sunny Side Bakery" })}
        <div>
          <label htmlFor="category" className="label">
            Category <span className="text-accent">*</span>
          </label>
          <select id="category" name="category" defaultValue={val.category ?? ""} className={`field ${err.category ? "border-danger" : ""}`}>
            <option value="" disabled>Choose one…</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>
          <ErrorText msg={err.category} />
        </div>
        {text("tagline", "One-line description", {
          required: true,
          placeholder: "Fresh sourdough and pastries, baked every morning",
          hint: "Shown on search results. Up to 120 characters.",
        })}
        <div>
          <label htmlFor="description" className="label">Tell your story</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={val.description}
            placeholder="How you got started, what makes you special, hours, anything people should know."
            className={`field ${err.description ? "border-danger" : ""}`}
          />
          <ErrorText msg={err.description} />
        </div>
      </Section>

      <Section step={2} title="Where can people find you?" intro="This helps people nearby discover you.">
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          {text("city", "City", { placeholder: "Springfield" })}
          {text("state", "State", { placeholder: "OR" })}
          {text("zip", "ZIP code", { placeholder: "97477" })}
        </div>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="onlineOnly" defaultChecked={val.onlineOnly === "on"} className="h-5 w-5 accent-brand" />
          <span>We&apos;re online only (no physical location)</span>
        </label>
        <ErrorText msg={err.location} />
      </Section>

      <Section step={3} title="Your links" intro="All optional. Paste a full link or just your @handle.">
        {text("website", "Website", { placeholder: "sunnysidebakery.com" })}
        {text("etsy", "Etsy shop", { placeholder: "etsy.com/shop/SunnySide or SunnySide" })}
        <div className="grid gap-4 sm:grid-cols-3">
          {text("instagram", "Instagram", { placeholder: "@sunnysidebakes" })}
          {text("facebook", "Facebook", { placeholder: "facebook.com/sunnyside" })}
          {text("tiktok", "TikTok", { placeholder: "@sunnysidebakes" })}
        </div>
      </Section>

      <Section
        step={4}
        title="Support & invest"
        intro="Let your community back you. Link to a crowdfunding or donation page you already run, and choose whether investors can contact you."
      >
        <div className="space-y-3">
          {Array.from({ length: SUPPORT_ROWS }, (_, i) => (
            <div key={i}>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  name={`support${i}_platform`}
                  defaultValue={val[`support${i}_platform`] ?? SUPPORT_PLATFORMS[0]}
                  aria-label={`Support link ${i + 1} platform`}
                  className="field sm:w-44"
                >
                  {SUPPORT_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
                <input
                  name={`support${i}_url`}
                  defaultValue={val[`support${i}_url`]}
                  placeholder="Link to your campaign or page"
                  aria-label={`Support link ${i + 1}`}
                  className={`field ${err[`support${i}_url`] ? "border-danger" : ""}`}
                />
              </div>
              <ErrorText msg={err[`support${i}_url`]} />
            </div>
          ))}
        </div>
        <label className="flex items-start gap-3 rounded-xl bg-accent-soft p-4">
          <input type="checkbox" name="investorContact" defaultChecked={val.investorContact === "on"} className="mt-0.5 h-5 w-5 accent-brand" />
          <span>
            <span className="font-medium">Let people contact me about investing</span>
            <span className="mt-1 block text-sm text-muted">
              Adds an &quot;Interested in investing?&quot; message form to your page. Messages go
              straight to your email. Local Finds doesn&apos;t arrange or take part in any deal.
            </span>
          </span>
        </label>
      </Section>

      <Section step={5} title="Your email">
        {text("ownerEmail", "Email address", {
          required: true,
          type: "email",
          placeholder: "you@example.com",
          hint: "Private. We only use it to send you messages from your page. It's never shown publicly.",
        })}
      </Section>

      <div className="flex flex-col items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-primary w-full text-lg sm:w-auto sm:px-10 disabled:opacity-60">
          {pending ? "Publishing…" : "Publish my listing"}
        </button>
        <p className="text-sm text-muted">Your listing goes live right away. It&apos;s free.</p>
      </div>
    </form>
  );
}
