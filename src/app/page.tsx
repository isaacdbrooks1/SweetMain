import Link from "next/link";
import { ArrowRight, Check, MapPin, Search } from "lucide-react";
import { listBusinesses } from "@/lib/businesses";
import BusinessCard from "@/components/BusinessCard";
import CategoryRow from "@/components/CategoryRow";

// Always read fresh listings instead of caching the page at build time.
export const dynamic = "force-dynamic";

const OWNER_POINTS = [
  "A free page with your photos, story and location",
  "Links to your website, Etsy shop, Instagram, Facebook and TikTok",
  "A place to share your crowdfunding and hear from investors",
];

export default async function Home() {
  const newest = (await listBusinesses()).slice(0, 8);

  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="py-14 sm:py-20">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Small businesses, close to home.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Find local makers, shops and services, and support the ones you love.
        </p>
        <form
          action="/search"
          className="mt-8 flex max-w-2xl flex-col overflow-hidden rounded-xl border border-line shadow-sm sm:flex-row"
        >
          <label className="flex flex-1 items-center gap-3 px-4">
            <Search size={20} className="shrink-0 text-muted" />
            <input
              name="q"
              placeholder="Bakery, candles, dog groomer…"
              aria-label="What are you looking for?"
              className="w-full py-4 focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-3 border-t border-line px-4 sm:w-56 sm:border-l sm:border-t-0">
            <MapPin size={20} className="shrink-0 text-muted" />
            <input
              name="near"
              placeholder="City or ZIP"
              aria-label="Where?"
              className="w-full py-4 focus:outline-none"
            />
          </label>
          <button type="submit" className="m-2 rounded-lg bg-brand px-6 py-3 font-semibold text-brand-ink hover:bg-brand-hover">
            Search
          </button>
        </form>
      </section>

      <CategoryRow hrefFor={(c) => (c ? `/search?category=${encodeURIComponent(c)}` : "/search")} />

      <section className="pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Recently added</h2>
          {newest.length > 0 && (
            <Link href="/search" className="flex items-center gap-1 text-sm font-semibold hover:underline">
              See all <ArrowRight size={16} />
            </Link>
          )}
        </div>
        {newest.length > 0 ? (
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
        ) : (
          <p className="mt-6 text-muted">
            No businesses listed yet.{" "}
            <Link href="/add" className="font-semibold text-ink underline">Be the first.</Link>
          </p>
        )}
      </section>

      <section className="mt-24 grid items-center gap-10 rounded-2xl bg-subtle p-8 sm:p-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Run a small business?</h2>
          <p className="mt-3 text-lg text-muted">
            Put it in front of people who want to shop local. Listing is free and takes about
            five minutes.
          </p>
          <Link href="/add" className="btn-primary mt-6">
            List your business
          </Link>
        </div>
        <ul className="space-y-4">
          {OWNER_POINTS.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                <Check size={14} strokeWidth={3} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
