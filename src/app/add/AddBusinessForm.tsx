"use client";

import { useActionState } from "react";
import { createBusiness, type FormState } from "./actions";
import { CATEGORY_NAMES, MAX_PHOTOS, SUPPORT_PLATFORMS, SUPPORT_ROWS } from "@/lib/categories";
import PhotoUpload from "@/components/PhotoUpload";

// One block of the form: title and explanation on the left, fields on the right.
function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-10 md:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {intro && <p className="mt-1 text-sm leading-relaxed text-muted">{intro}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1.5 text-sm font-medium text-danger">{msg}</p> : null;
}

export default function AddBusinessForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createBusiness, {});
  const val = state.values ?? {};
  const err = state.errors ?? {};
  const errorCount = Object.keys(err).length;
  const split = (s?: string) => (s ? s.split(",").filter(Boolean) : []);

  const text = (name: string, label: string, opts: { placeholder?: string; hint?: string; required?: boolean; type?: string } = {}) => (
    <div>
      <label htmlFor={name} className="label">
        {label} {opts.required ? null : <span className="font-normal text-muted">(optional)</span>}
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
    <form action={action} key={JSON.stringify(val)} noValidate>
      {errorCount > 0 && (
        <div role="alert" className="mb-8 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm font-semibold text-danger">
          Please fix {errorCount === 1 ? "the item" : `the ${errorCount} items`} marked below.
        </div>
      )}

      <Section title="Basics" intro="What people see first in search results.">
        {text("name", "Business name", { required: true, placeholder: "Sunny Side Bakery" })}
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select id="category" name="category" defaultValue={val.category ?? ""} className={`field ${err.category ? "border-danger" : ""}`}>
            <option value="" disabled>Choose a category</option>
            {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ErrorText msg={err.category} />
        </div>
        {text("tagline", "Short description", {
          required: true,
          placeholder: "Sourdough and pastries, baked every morning",
          hint: "One sentence, up to 120 characters.",
        })}
        <div>
          <label htmlFor="description" className="label">
            About <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={val.description}
            placeholder="How you got started, what you make, your hours…"
            className={`field ${err.description ? "border-danger" : ""}`}
          />
          <ErrorText msg={err.description} />
        </div>
      </Section>

      <Section title="Photos" intro="Listings with photos get far more clicks. Your first photo is the cover. JPG, PNG or WebP, up to 5 MB each.">
        <div>
          <p className="label">Logo <span className="font-normal text-muted">(optional)</span></p>
          <PhotoUpload name="logo" max={1} variant="logo" initial={split(val.logo)} />
        </div>
        <div>
          <p className="label">Photos <span className="font-normal text-muted">(up to {MAX_PHOTOS})</span></p>
          <PhotoUpload name="photos" max={MAX_PHOTOS} variant="photos" initial={split(val.photos)} />
        </div>
      </Section>

      <Section title="Location" intro="Helps people nearby find you. Your street address is only shown if you add one.">
        {text("address", "Street address", {
          placeholder: "123 Main St",
          hint: "Only if customers can visit you, like a shop or studio. Leave blank for home-based businesses; we'll just show your town.",
        })}
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          {text("city", "City", { required: true, placeholder: "Springfield" })}
          {text("state", "State", { required: true, placeholder: "OR" })}
          {text("zip", "ZIP", { required: true, placeholder: "97477" })}
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="onlineOnly" defaultChecked={val.onlineOnly === "on"} className="h-4 w-4 accent-brand" />
          We&apos;re online only, with no physical location
        </label>
        <ErrorText msg={err.location} />
      </Section>

      <Section title="Links" intro="Paste a full link, or just your @handle for social accounts.">
        {text("website", "Website", { placeholder: "sunnysidebakery.com" })}
        {text("etsy", "Etsy shop", { placeholder: "Shop name or link" })}
        <div className="grid gap-4 sm:grid-cols-3">
          {text("instagram", "Instagram", { placeholder: "@handle" })}
          {text("facebook", "Facebook", { placeholder: "Page name or link" })}
          {text("tiktok", "TikTok", { placeholder: "@handle" })}
        </div>
      </Section>

      <Section
        title="Support & investment"
        intro="Already raising money on Wefunder, Kiva, GoFundMe or similar? Link it here. Local Finds never handles money or takes a cut."
      >
        <div>
          <p className="label">Fundraising links <span className="font-normal text-muted">(optional)</span></p>
          <div className="space-y-2">
            {Array.from({ length: SUPPORT_ROWS }, (_, i) => (
              <div key={i}>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    name={`support${i}_platform`}
                    defaultValue={val[`support${i}_platform`] ?? SUPPORT_PLATFORMS[0]}
                    aria-label={`Fundraising link ${i + 1} site`}
                    className="field sm:w-40"
                  >
                    {SUPPORT_PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <input
                    name={`support${i}_url`}
                    defaultValue={val[`support${i}_url`]}
                    placeholder="https://"
                    aria-label={`Fundraising link ${i + 1}`}
                    className={`field ${err[`support${i}_url`] ? "border-danger" : ""}`}
                  />
                </div>
                <ErrorText msg={err[`support${i}_url`]} />
              </div>
            ))}
          </div>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-line p-4">
          <input type="checkbox" name="investorContact" defaultChecked={val.investorContact === "on"} className="mt-1 h-4 w-4 accent-brand" />
          <span>
            <span className="font-semibold">Let investors contact me</span>
            <span className="mt-0.5 block text-sm text-muted">
              Adds a &quot;Message the owner&quot; button for people interested in a larger
              investment. Messages are sent to your email; your address stays hidden.
            </span>
          </span>
        </label>
      </Section>

      <Section title="Contact email" intro="Private. Used only to send you messages from your page.">
        {text("ownerEmail", "Email", { required: true, type: "email", placeholder: "you@example.com" })}
      </Section>

      <div className="flex flex-col-reverse items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-sm text-muted">Your listing goes live as soon as you publish.</p>
        <button type="submit" disabled={pending} className="btn-primary px-8 py-3">
          {pending ? "Publishing…" : "Publish listing"}
        </button>
      </div>
    </form>
  );
}
