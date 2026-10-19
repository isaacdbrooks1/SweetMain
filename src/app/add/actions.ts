"use server";

import { redirect } from "next/navigation";
import { addBusiness, type SupportLink } from "@/lib/businesses";
import { CATEGORY_NAMES, SUPPORT_PLATFORMS, SUPPORT_ROWS } from "@/lib/categories";

export type FormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

// Turns "mybakery.com" into "https://mybakery.com/". Returns null if it isn't a web link.
function cleanUrl(raw: string): string | null {
  const withProto = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

// Accepts a full link or just a handle like "@sunnybakes".
function socialUrl(raw: string, fromHandle: (h: string) => string): string | null {
  if (raw.includes("/") || /\.(com|net|org|co|me|io|shop)\b/i.test(raw)) return cleanUrl(raw);
  const handle = raw.replace(/^@/, "");
  return /^[\w.-]{1,60}$/.test(handle) ? fromHandle(handle) : null;
}

export async function createBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value.trim();
  }
  const v = (k: string) => values[k] ?? "";
  const errors: Record<string, string> = {};

  if (!v("name")) errors.name = "Please enter your business name.";
  if (!CATEGORY_NAMES.includes(v("category"))) errors.category = "Please pick a category.";
  if (!v("tagline")) errors.tagline = "Add a short line about what you do.";
  else if (v("tagline").length > 120) errors.tagline = "Keep this under 120 characters.";
  if (v("description").length > 2000) errors.description = "Keep this under 2,000 characters.";

  const onlineOnly = v("onlineOnly") === "on";
  if (!onlineOnly && !v("zip") && !(v("city") && v("state"))) {
    errors.location = "Add your city and state, or ZIP code, or tick “online only”.";
  }
  if (v("zip") && !/^\d{5}(-\d{4})?$/.test(v("zip"))) errors.zip = "ZIP should look like 12345.";

  const linkRules: Record<string, (raw: string) => string | null> = {
    website: cleanUrl,
    etsy: (r) => socialUrl(r, (h) => `https://www.etsy.com/shop/${h}`),
    instagram: (r) => socialUrl(r, (h) => `https://www.instagram.com/${h}`),
    facebook: (r) => socialUrl(r, (h) => `https://www.facebook.com/${h}`),
    tiktok: (r) => socialUrl(r, (h) => `https://www.tiktok.com/@${h}`),
  };
  const links: Record<string, string> = {};
  for (const [key, rule] of Object.entries(linkRules)) {
    if (!v(key)) continue;
    const url = rule(v(key));
    if (url) links[key] = url;
    else errors[key] = "That doesn't look like a link or handle.";
  }

  const supportLinks: SupportLink[] = [];
  for (let i = 0; i < SUPPORT_ROWS; i++) {
    const raw = v(`support${i}_url`);
    if (!raw) continue;
    const url = cleanUrl(raw);
    const platform = SUPPORT_PLATFORMS.includes(v(`support${i}_platform`))
      ? v(`support${i}_platform`)
      : "Other";
    if (url) supportLinks.push({ platform, url });
    else errors[`support${i}_url`] = "That doesn't look like a web link.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("ownerEmail"))) {
    errors.ownerEmail = "Please enter a valid email address.";
  }

  if (Object.keys(errors).length > 0) return { errors, values };

  const id = await addBusiness({
    name: v("name"),
    category: v("category"),
    tagline: v("tagline"),
    description: v("description"),
    city: onlineOnly ? "" : v("city"),
    state: onlineOnly ? "" : v("state").toUpperCase(),
    zip: onlineOnly ? "" : v("zip"),
    onlineOnly,
    links,
    supportLinks,
    investorContact: v("investorContact") === "on",
    ownerEmail: v("ownerEmail"),
  });
  redirect(`/b/${id}?new=1`);
}
