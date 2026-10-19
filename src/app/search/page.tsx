import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { listBusinesses } from "@/lib/businesses";
import BusinessCard from "@/components/BusinessCard";
import CategoryRow from "@/components/CategoryRow";

export const metadata: Metadata = { title: "Browse · Local Finds" };

type Props = { searchParams: Promise<{ q?: string; near?: string; category?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", near = "", category = "" } = await searchParams;
  const results = await listBusinesses({ q, near, category });

  const hrefFor = (c: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (near) p.set("near", near);
    if (c) p.set("category", c);
    const s = p.toString();
    return s ? `/search?${s}` : "/search";
  };

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
          <input name="near" defaultValue={near} placeholder="City or ZIP" aria-label="Where?" className="w-full py-2.5 focus:outline-none" />
        </label>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <CategoryRow active={category} hrefFor={hrefFor} />

      <p className="mt-6 text-sm font-semibold">
        {results.length} {results.length === 1 ? "business" : "businesses"}
        {category && <> in {category}</>}
        {q && <> matching &ldquo;{q}&rdquo;</>}
        {near && <> near {near}</>}
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-line px-6 py-12 text-center">
          <p className="font-semibold">No businesses match that search yet.</p>
          <p className="mt-1 text-muted">Try fewer words, a nearby town, or another category.</p>
          <p className="mt-6 text-sm text-muted">
            Know a business that should be here?{" "}
            <Link href="/add" className="font-semibold text-ink underline">Add it</Link>
          </p>
        </div>
      )}
    </main>
  );
}
