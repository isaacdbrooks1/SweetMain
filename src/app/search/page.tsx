import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, X } from "lucide-react";
import { searchBusinesses } from "@/lib/businesses";
import { DEFAULT_RADIUS, RADIUS_OPTIONS } from "@/lib/geo";
import BusinessCard from "@/components/BusinessCard";
import CategoryRow from "@/components/CategoryRow";

export const metadata: Metadata = { title: "Browse · Sweet Main" };

type Props = { searchParams: Promise<{ q?: string; near?: string; category?: string; radius?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", near = "", category = "", radius: radiusParam } = await searchParams;
  const radius = RADIUS_OPTIONS.includes(Number(radiusParam)) ? Number(radiusParam) : DEFAULT_RADIUS;
  const { results, place, placeNotFound } = await searchBusinesses({ q, near, category, radius });

  // Builds a link to this page with some filters changed.
  const hrefWith = (changes: Record<string, string>) => {
    const p = new URLSearchParams();
    const next = { q, near, category, radius: radiusParam ?? "", ...changes };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/search?${s}` : "/search";
  };

  const filters = [
    category && { label: category, href: hrefWith({ category: "" }) },
    q && { label: `“${q}”`, href: hrefWith({ q: "" }) },
    near && { label: place ? `Within ${radius} mi of ${place.label}` : near, href: hrefWith({ near: "", radius: "" }) },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <form action="/search" className="mb-6 flex flex-col gap-2 sm:flex-row">
        {category && <input type="hidden" name="category" value={category} />}
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-line px-3 focus-within:border-ink">
          <Search size={18} className="text-muted" />
          <input name="q" defaultValue={q} placeholder="Search" aria-label="Search" className="w-full py-2.5 focus:outline-none" />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-line px-3 focus-within:border-ink sm:w-56">
          <MapPin size={18} className="text-muted" />
          <input name="near" defaultValue={near} placeholder="City, ST or ZIP" aria-label="Where?" className="w-full py-2.5 focus:outline-none" />
        </label>
        <select name="radius" defaultValue={radius} aria-label="Distance" className="rounded-lg border border-line bg-bg px-3 py-2.5 focus:border-ink focus:outline-none">
          {RADIUS_OPTIONS.map((r) => <option key={r} value={r}>Within {r} mi</option>)}
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <CategoryRow active={category} hrefFor={(c) => hrefWith({ category: c })} />

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="mr-1 font-semibold">
          {results.length} {results.length === 1 ? "business" : "businesses"}
        </span>
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.href}
            aria-label={`Remove filter: ${f.label}`}
            className="flex items-center gap-1 rounded-full border border-line py-1 pl-3 pr-2 hover:border-ink"
          >
            {f.label} <X size={14} />
          </Link>
        ))}
        {filters.length > 0 && (
          <Link href="/search" className="ml-1 font-semibold underline">Clear filters</Link>
        )}
      </div>
      {placeNotFound && (
        <p className="mt-2 text-sm text-muted">
          We couldn&apos;t find &ldquo;{near}&rdquo; on the map. Try a ZIP code or &ldquo;City, ST&rdquo;.
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-line px-6 py-12 text-center">
          <p className="font-semibold">No businesses match that search yet.</p>
          <p className="mt-1 text-muted">
            Try a wider distance, fewer words, or{" "}
            <Link href="/search" className="font-semibold text-ink underline">see everything</Link>.
          </p>
          <p className="mt-6 text-sm text-muted">
            Know a business that should be here?{" "}
            <Link href="/add" className="font-semibold text-ink underline">Add it</Link>
          </p>
        </div>
      )}
    </main>
  );
}
