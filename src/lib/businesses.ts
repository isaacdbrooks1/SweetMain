// Listings live in the Supabase "businesses" table (see supabase/setup.sql).
// Only the server talks to it; owner emails never leave this file except on insert.
import { randomUUID } from "crypto";
import { locate, milesBetween, parseNear, type Place } from "./geo";
import { supabase } from "./supabase";

export type SupportLink = { platform: string; url: string };

export type Business = {
  id: string;
  createdAt: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  zip: string;
  // Optional street address, only for places customers can visit.
  address?: string;
  onlineOnly: boolean;
  // Center of the ZIP or town (not the street address). Missing for online-only businesses.
  lat?: number;
  lng?: number;
  // Photo file names in Supabase Storage (see lib/images.ts). The first photo is the cover.
  logo?: string;
  photos: string[];
  links: {
    website?: string;
    etsy?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  supportLinks: SupportLink[];
  investorContact: boolean;
  // Private: used to forward messages to the owner. Never shown on the site.
  ownerEmail: string;
};

export type PublicBusiness = Omit<Business, "ownerEmail">;
export type NewBusiness = Omit<Business, "id" | "createdAt" | "lat" | "lng">;
export type SearchResult = PublicBusiness & { distance?: number };

// Every column except owner_email. Public pages only ever select these.
const PUBLIC_COLUMNS =
  "id, created_at, name, category, tagline, description, city, state, zip, address, online_only, lat, lng, logo, photos, links, support_links, investor_contact";

type Row = {
  id: string;
  created_at: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  zip: string;
  address: string | null;
  online_only: boolean;
  lat: number | null;
  lng: number | null;
  logo: string | null;
  photos: string[];
  links: Business["links"];
  support_links: SupportLink[];
  investor_contact: boolean;
};

function fromRow(r: Row): PublicBusiness {
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    category: r.category,
    tagline: r.tagline,
    description: r.description,
    city: r.city,
    state: r.state,
    zip: r.zip,
    address: r.address ?? undefined,
    onlineOnly: r.online_only,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    logo: r.logo ?? undefined,
    photos: r.photos ?? [],
    links: r.links ?? {},
    supportLinks: r.support_links ?? [],
    investorContact: r.investor_contact,
  };
}

async function readAll(): Promise<PublicBusiness[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select(PUBLIC_COLUMNS)
    .eq("status", "live")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Couldn't load listings: ${error.message}`);
  return (data as Row[]).map(fromRow);
}

export async function addBusiness(input: NewBusiness): Promise<string> {
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const id = `${slug || "business"}-${randomUUID().slice(0, 6)}`;
  // Center of the ZIP or town, used for "within N miles" search.
  const point = input.onlineOnly ? null : locate(input);
  const { error } = await supabase.from("businesses").insert({
    id,
    name: input.name,
    category: input.category,
    tagline: input.tagline,
    description: input.description,
    city: input.city,
    state: input.state,
    zip: input.zip,
    address: input.address ?? null,
    online_only: input.onlineOnly,
    lat: point?.lat ?? null,
    lng: point?.lng ?? null,
    logo: input.logo ?? null,
    photos: input.photos,
    links: input.links,
    support_links: input.supportLinks,
    investor_contact: input.investorContact,
    owner_email: input.ownerEmail,
  });
  if (error) throw new Error(`Couldn't save the listing: ${error.message}`);
  return id;
}

export async function getBusiness(id: string): Promise<PublicBusiness | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .eq("status", "live")
    .maybeSingle();
  if (error) throw new Error(`Couldn't load the listing: ${error.message}`);
  return data ? fromRow(data as Row) : null;
}

export async function listBusinesses(): Promise<PublicBusiness[]> {
  return (await searchBusinesses({})).results;
}

export async function searchBusinesses(filters: {
  q?: string;
  category?: string;
  near?: string;
  radius?: number;
}): Promise<{ results: SearchResult[]; place: Place | null; placeNotFound: boolean }> {
  const q = filters.q?.trim().toLowerCase();
  const nearText = filters.near?.trim() ?? "";
  const place = nearText ? parseNear(nearText) : null;

  let list: SearchResult[] = (await readAll())
    .filter((b) => !filters.category || b.category === filters.category)
    .filter(
      (b) =>
        !q ||
        [b.name, b.tagline, b.description, b.category].some((t) => t.toLowerCase().includes(q)),
    );

  if (place) {
    // Nearby businesses first, closest at the top; online shops after them.
    const radius = filters.radius ?? 25;
    const local = list
      .filter((b) => b.lat !== undefined && b.lng !== undefined)
      .map((b) => ({ ...b, distance: milesBetween(place, { lat: b.lat!, lng: b.lng! }) }))
      .filter((b) => b.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    list = [...local, ...list.filter((b) => b.onlineOnly)];
  } else if (nearText) {
    // We couldn't place it on the map, so fall back to matching the words.
    const t = nearText.toLowerCase();
    list = list.filter(
      (b) => b.onlineOnly || [b.city, b.state, b.zip].some((f) => f.toLowerCase().includes(t)),
    );
  }

  return { results: list, place, placeNotFound: !!nearText && !place };
}
