"use server";

import { redirect } from "next/navigation";
import { addBusiness, type SupportLink } from "@/lib/businesses";
import { CATEGORY_NAMES, MAX_PHOTOS, SUPPORT_PLATFORMS, SUPPORT_ROWS } from "@/lib/categories";
import { imageExists } from "@/lib/uploads";

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

// Only accepts links that go to Google (a Maps/Search listing or a g.page review link).
function googleUrl(raw: string): string | null {
  const url = cleanUrl(raw);
  if (!url) return null;
  const host = new URL(url).hostname.toLowerCase();
  const ok = /(^|\.)google\.[a-z.]+$/.test(host) || host === "g.page" || host === "maps.app.goo.gl" || host === "g.co";
  return ok ? url : null;
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
  if (v("state") && !/^[A-Za-z]{2}$/.test(v("state"))) errors.state = "Use the 2-letter code, like OR.";
  if (!onlineOnly && v("address")) {
    if (v("address").length > 120) errors.address = "Keep this under 120 characters.";
    else if (!v("city") || !v("state")) errors.location = "Please add your city and state along with the street address.";
  }

  const linkRules: Record<string, (raw: string) => string | null> = {
    website: cleanUrl,
    etsy: (r) => socialUrl(r, (h) => `https://www.etsy.com/shop/${h}`),
    instagram: (r) => socialUrl(r, (h) => `https://www.instagram.com/${h}`),
    facebook: (r) => socialUrl(r, (h) => `https://www.facebook.com/${h}`),
    tiktok: (r) => socialUrl(r, (h) => `https://www.tiktok.com/@${h}`),
    google: googleUrl,
  };
  const links: Record<string, string> = {};
  for (const [key, rule] of Object.entries(linkRules)) {
    if (!v(key)) continue;
    const url = rule(v(key));
    if (url) links[key] = url;
    else
      errors[key] =
        key === "google"
          ? "Please paste the review link from your Google Business Profile."
          : "That doesn't look like a link or handle.";
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

  // Photos were uploaded already; only keep names that really are our uploads.
  const photoNames = formData.getAll("photos").filter((p): p is string => typeof p === "string");
  const photos: string[] = [];
  for (const p of photoNames.slice(0, MAX_PHOTOS)) if (await imageExists(p)) photos.push(p);
  values.photos = photos.join(",");
  const logo = v("logo") && (await imageExists(v("logo"))) ? v("logo") : undefined;
  values.logo = logo ?? "";
  const ownerPhoto = v("ownerPhoto") && (await imageExists(v("ownerPhoto"))) ? v("ownerPhoto") : undefined;
  values.ownerPhoto = ownerPhoto ?? "";
  if (v("ownerName").length > 60) errors.ownerName = "Keep this under 60 characters.";
  if (v("ownerStory").length > 600) errors.ownerStory = "Keep this under 600 characters.";

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
    address: onlineOnly ? undefined : v("address") || undefined,
    onlineOnly,
    logo,
    photos,
    links,
    supportLinks,
    investorContact: v("investorContact") === "on",
    ownerName: v("ownerName") || undefined,
    ownerStory: v("ownerStory"),
    ownerPhoto,
    ownerEmail: v("ownerEmail"),
  });
  redirect(`/b/${id}?new=1`);
}
