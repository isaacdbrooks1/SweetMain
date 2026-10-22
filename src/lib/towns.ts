// Town pages group listings by "City, ST". The page address is a slug like
// "springfield-or", built the same way everywhere so links always match.
import type { PublicBusiness } from "./businesses";

export function townSlug(city: string, state: string): string {
  return `${city}-${state}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function hasTown(b: PublicBusiness): boolean {
  return !b.onlineOnly && !!b.city && !!b.state;
}

export type Town = { slug: string; city: string; state: string; count: number };

// Every town with at least one listing, biggest first.
export function townsFrom(list: PublicBusiness[]): Town[] {
  const towns = new Map<string, Town>();
  for (const b of list) {
    if (!hasTown(b)) continue;
    const slug = townSlug(b.city, b.state);
    const t = towns.get(slug) ?? { slug, city: b.city, state: b.state, count: 0 };
    t.count += 1;
    towns.set(slug, t);
  }
  return [...towns.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
}
