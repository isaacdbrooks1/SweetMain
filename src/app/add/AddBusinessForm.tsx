"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { createBusiness } from "./actions";
import type { FormState } from "@/lib/listingForm";
import { CATEGORY_NAMES, MAX_PHOTOS, SUPPORT_PLATFORMS, SUPPORT_ROWS } from "@/lib/categories";
import PhotoUpload from "@/components/PhotoUpload";

// One block of the form: title and explanation on the left, fields on the right.
function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-10 md:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {intro && <p className="mt-1 text-[15px] leading-relaxed text-muted">{intro}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

type TextField = (
  name: string,
  label: string,
  opts?: { placeholder?: string; hint?: string; required?: boolean; type?: string },
) => React.ReactNode;

// Ticking "online only" hides the address boxes, since there's nowhere to visit.
function LocationFields({ val, err, text }: { val: Record<string, string>; err: Record<string, string>; text: TextField }) {
  const [online, setOnline] = useState(val.onlineOnly === "on");
  return (
    <>
      <label className="flex items-center gap-3 text-[15px]">
        <input
          type="checkbox"
          name="onlineOnly"
          checked={online}
          onChange={(e) => setOnline(e.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        We&apos;re online only, with no physical location
      </label>
      {!online && (
        <>
          {text("address", "Street address", {
            placeholder: "123 Main St",
            hint: "Only if customers can visit you, like a shop or studio. Leave it blank for home-based businesses; we'll just show your town.",
          })}
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
            {text("city", "City", { placeholder: "Springfield" })}
            {text("state", "State", { placeholder: "OR" })}
            {text("zip", "ZIP", { placeholder: "97477" })}
          </div>
        </>
      )}
      <ErrorText msg={err.location} />
    </>
  );
}

// Up to 3 extra links (YouTube, Pinterest, X…), shown one at a time as needed.
const MORE_LINKS = 3;
function MoreLinks({ val, err }: { val: Record<string, string>; err: Record<string, string> }) {
  const [count, setCount] = useState(() => Array.from({ length: MORE_LINKS }, (_, i) => val[`more${i}`]).filter(Boolean).length);
  return (
    <div>
      {count > 0 && <p className="label">Other links</p>}
      <div className="space-y-2">
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>
            <input
              name={`more${i}`}
              defaultValue={val[`more${i}`]}
              placeholder="YouTube, Pinterest, X, LinkedIn, Linktree…"
              aria-label={`Other link ${i + 1}`}
              className={`field ${err[`more${i}`] ? "border-danger" : ""}`}
            />
            <ErrorText msg={err[`more${i}`]} />
          </div>
        ))}
      </div>
      {count < MORE_LINKS && (
        <button
          type="button"
          onClick={() => setCount(count + 1)}
          className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-bold text-brand hover:underline"
        >
          <Plus size={16} /> Add another link
        </button>
      )}
    </div>
  );
}

// A small red star for required fields (read out as "required").
function Req() {
  return (
    <span className="ml-0.5 text-danger">
      <span aria-hidden>*</span>
      <span className="sr-only"> (required)</span>
    </span>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1.5 text-[15px] font-medium text-danger">{msg}</p> : null;
}

// Used to publish a new listing, and (with action + initial) for an owner editing theirs.
export default function AddBusinessForm({ action: save = createBusiness, initial, hidden = {}, submitLabel = "Publish listing", footnote = "Your listing goes live as soon as you publish." }: {
  action?: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Record<string, string>;
  hidden?: Record<string, string>;
  submitLabel?: string;
  footnote?: string;
} = {}) {
  const [state, action, pending] = useActionState<FormState, FormData>(save, { values: initial });
  const val = state.values ?? {};
  const err = state.errors ?? {};
  const errorCount = Object.keys(err).length;
  const split = (s?: string) => (s ? s.split(",").filter(Boolean) : []);

  const text = (name: string, label: string, opts: { placeholder?: string; hint?: string; required?: boolean; type?: string } = {}) => (
    <div>
      <label htmlFor={name} className="label">
        {label}{opts.required && <Req />}
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
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <p className="mb-6 text-[15px] text-muted">
        Fields marked <span className="font-bold text-danger">*</span> are required. Everything else is optional.
      </p>
      {errorCount > 0 && (
        <div role="alert" className="mb-8 rounded-md border border-danger/30 bg-danger/5 p-4 text-[15px] font-bold text-danger">
          {err.form ?? (errorCount === 1 ? "Please fix the item marked below." : `Please fix the ${errorCount} items marked below.`)}
        </div>
      )}

      <Section title="Basics" intro="What people see first in search results.">
        {text("name", "Business name", { required: true, placeholder: "Sunny Side Bakery" })}
        <div>
          <label htmlFor="category" className="label">Category<Req /></label>
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
            About
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

      <Section title="Photos" intro="Photos help neighbors recognize your shop. Your first photo is the cover. JPG, PNG or WebP. Big phone photos are shrunk automatically.">
        <div>
          <p className="label">Logo</p>
          <PhotoUpload name="logo" max={1} variant="logo" initial={split(val.logo)} />
        </div>
        <div>
          <p className="label">Photos <span className="font-normal text-muted">(up to {MAX_PHOTOS})</span></p>
          <PhotoUpload name="photos" max={MAX_PHOTOS} variant="photos" initial={split(val.photos)} />
        </div>
      </Section>

      <Section title="Meet the owner" intro="Neighbors love knowing who's behind a shop. Shown near the top of your page.">
        <div>
          <p className="label">Your photo</p>
          <PhotoUpload name="ownerPhoto" max={1} variant="logo" addLabel="Add photo" initial={split(val.ownerPhoto)} />
        </div>
        {text("ownerName", "Your name", { placeholder: "Maria Lopez" })}
        <div>
          <label htmlFor="ownerStory" className="label">
            A few words about you
          </label>
          <textarea
            id="ownerStory"
            name="ownerStory"
            rows={3}
            maxLength={600}
            defaultValue={val.ownerStory}
            placeholder="I started baking with my grandmother and opened the shop in 2019…"
            className={`field ${err.ownerStory ? "border-danger" : ""}`}
          />
          <ErrorText msg={err.ownerStory} />
        </div>
      </Section>

      <Section title="Location" intro="Helps people nearby find you. Add your city and state, or just a ZIP code.">
        <LocationFields val={val} err={err} text={text} />
      </Section>

      <Section title="Links" intro="Add any you have. Paste a full link, or just your @handle for social accounts.">
        {text("website", "Website", { placeholder: "sunnysidebakery.com" })}
        {text("etsy", "Etsy shop", { placeholder: "Shop name or link" })}
        <div className="grid gap-4 sm:grid-cols-3">
          {text("instagram", "Instagram", { placeholder: "@handle" })}
          {text("facebook", "Facebook", { placeholder: "Page name or link" })}
          {text("tiktok", "TikTok", { placeholder: "@handle" })}
        </div>
        {text("google", "Google reviews link", {
          placeholder: "https://g.page/r/…",
          hint: "Lets customers leave you a Google review. Find it in your Google Business Profile under \"Ask for reviews.\"",
        })}
        <MoreLinks val={val} err={err} />
      </Section>

      <Section
        title="Support & investment"
        intro="Already raising money on Wefunder, Kiva, GoFundMe or similar? Link it here. Sweet Main never handles money or takes a cut."
      >
        <div>
          <p className="label">Fundraising links</p>
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
        <label className="flex items-start gap-3 rounded-md border border-line p-4">
          <input type="checkbox" name="investorContact" defaultChecked={val.investorContact === "on"} className="mt-1 h-4 w-4 accent-brand" />
          <span>
            <span className="font-bold">Let investors contact me</span>
            <span className="mt-0.5 block text-[15px] text-muted">
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
        <p className="text-[15px] text-muted">{footnote}</p>
        <button type="submit" disabled={pending} className="btn-primary px-8 py-3">
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
