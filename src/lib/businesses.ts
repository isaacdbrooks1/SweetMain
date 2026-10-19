// Temporary storage: listings live in .data/businesses.json on this computer.
// This gets swapped for the Supabase database in the setup phase; the
// functions below keep the same shape so the pages won't need to change.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

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
  onlineOnly: boolean;
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
export type NewBusiness = Omit<Business, "id" | "createdAt">;

const FILE = path.join(process.cwd(), ".data", "businesses.json");

async function readAll(): Promise<Business[]> {
  try {
    const list: Business[] = JSON.parse(await fs.readFile(FILE, "utf8"));
    // Listings saved before photos existed have no photos list.
    return list.map((b) => ({ ...b, photos: b.photos ?? [] }));
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
  list.push({ ...input, id, createdAt: new Date().toISOString() });
  await writeAll(list);
  return id;
}

export async function getBusiness(id: string): Promise<PublicBusiness | null> {
  const found = (await readAll()).find((b) => b.id === id);
  return found ? toPublic(found) : null;
}

export async function listBusinesses(filters: {
  q?: string;
  category?: string;
  near?: string;
} = {}): Promise<PublicBusiness[]> {
  const q = filters.q?.trim().toLowerCase();
  const near = filters.near?.trim().toLowerCase();
  return (await readAll())
    .filter((b) => !filters.category || b.category === filters.category)
    .filter(
      (b) =>
        !q ||
        [b.name, b.tagline, b.description, b.category].some((t) =>
          t.toLowerCase().includes(q),
        ),
    )
    // Simple text match for now; real "within N miles" search comes in the Find phase.
    .filter(
      (b) =>
        !near ||
        b.onlineOnly ||
        [b.city, b.state, b.zip, `${b.city}, ${b.state}`].some((t) =>
          t.toLowerCase().includes(near),
        ),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublic);
}
