// Temporary storage: listings live in .data/businesses.json on this computer.
// This gets swapped for the Supabase database in the setup phase; the
// functions below keep the same shape so the pages won't need to change.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { locate, milesBetween, parseNear, type Place } from "./geo";

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
  // Uploaded file names (see lib/uploads.ts). The first photo is the cover.
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

function withCoordinates<T extends Omit<Business, "id" | "createdAt">>(b: T): T {
  if (b.onlineOnly || b.lat !== undefined) return b;
  const point = locate(b);
  return point ? { ...b, ...point } : b;
}

const FILE = path.join(process.cwd(), ".data", "businesses.json");

async function readAll(): Promise<Business[]> {
  try {
    const list: Business[] = JSON.parse(await fs.readFile(FILE, "utf8"));
    // Fill in fields that listings saved by older versions of the site don't have.
    return list.map((b) => withCoordinates({ ...b, photos: b.photos ?? [] }));
  } catch {
    return [];
  }
}

async function writeAll(list: Business[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

function toPublic(b: Business): PublicBusiness {
  const copy: Partial<Business> = { ...b };
  delete copy.ownerEmail;
  return copy as PublicBusiness;
}

export async function addBusiness(input: NewBusiness): Promise<string> {
  const list = await readAll();
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const id = `${slug || "business"}-${randomUUID().slice(0, 6)}`;
  list.push({ ...withCoordinates(input), id, createdAt: new Date().toISOString() });
  await writeAll(list);
  return id;
}

export async function getBusiness(id: string): Promise<PublicBusiness | null> {
  const found = (await readAll()).find((b) => b.id === id);
  return found ? toPublic(found) : null;
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
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublic);

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
