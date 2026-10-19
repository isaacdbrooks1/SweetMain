import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { listBusinesses } from "@/lib/businesses";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = { title: "Browse · Local Finds" };

type Props = { searchParams: Promise<{ q?: string; near?: string; category?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", near = "", category = "" } = await searchParams;
  const results = await listBusinesses({ q, near, category });

  const chipHref = (c: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (near) p.set("near", near);
    if (c) p.set("category", c);
    return `/search?${p}`;
  };
  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
      active ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface hover:border-brand"
    }`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">
        {category || "Browse local businesses"}
      </h1>
      <div className="mt-5 max-w-3xl">
        <SearchBar q={q} near={near} category={category} />
      </div>

      <nav aria-label="Categories" className="mt-5 flex flex-wrap gap-2">
        <Link href={chipHref("")} className={chip(!category)}>All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.name} href={chipHref(c.name)} className={chip(category === c.name)}>
            {c.icon} {c.name}
          </Link>
        ))}
      </nav>

      <p className="mt-8 text-muted">
        {results.length} {results.length === 1 ? "business" : "businesses"}
        {q && <> matching &ldquo;{q}&rdquo;</>}
        {near && <> near {near}</>}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="text-lg">Nothing here yet.</p>
          <p className="mt-1 text-muted">Try a different search, or know a business that should be listed?</p>
          <Link href="/add" className="btn-primary mt-4">Add a business</Link>
        </div>
      )}
    </main>
  );
}
