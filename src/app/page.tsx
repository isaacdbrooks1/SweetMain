import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { listBusinesses } from "@/lib/businesses";
import BusinessCard from "@/components/BusinessCard";
import CategoryRow from "@/components/CategoryRow";
import Streetscape from "@/components/Streetscape";

// Always read fresh listings instead of caching the page at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const newest = (await listBusinesses()).slice(0, 8);

  return (
    <main>
      {/* The street first, then the headline and search sitting on the sidewalk below it. */}
      <section>
        <Streetscape className="pt-8 sm:pt-10" />
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-12 text-center sm:pt-16">
          <h1 className="mx-auto max-w-[20ch] text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[56px]">
            Find the small businesses in your neighborhood.
          </h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-[19px] text-muted">
            Bakeries, makers, salons and repair shops, run by people who live near you.
          </p>
          <form
            action="/search"
            className="mx-auto mt-8 flex max-w-2xl flex-col overflow-hidden rounded-md border-2 border-ink bg-bg text-left sm:flex-row"
          >
            <label className="flex flex-1 items-center gap-3 px-4">
              <Search size={20} className="shrink-0 text-muted" />
              <input
                name="q"
                placeholder="What are you looking for?"
                aria-label="What are you looking for?"
                className="w-full bg-transparent py-4 focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-3 border-t-2 border-ink px-4 sm:w-52 sm:border-l-2 sm:border-t-0">
              <MapPin size={20} className="shrink-0 text-muted" />
              <input
                name="near"
                placeholder="City or ZIP"
                aria-label="City or ZIP"
                className="w-full bg-transparent py-4 focus:outline-none"
              />
            </label>
            <button type="submit" className="bg-brand px-7 py-4 font-bold text-brand-ink hover:bg-brand-hover">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <CategoryRow center hrefFor={(c) => (c ? `/search?category=${encodeURIComponent(c)}` : "/search")} />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[26px] font-extrabold tracking-[-0.01em]">New on Sweet Main</h2>
          {newest.length > 0 && (
            <Link href="/search" className="font-bold text-brand hover:underline">
              See all businesses
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
            <Link href="/add" className="font-bold text-ink underline">List the first one.</Link>
          </p>
        )}
      </section>

      <section className="mx-auto mt-24 max-w-2xl px-4 text-center">
        <h2 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em]">
          Own a small business?
        </h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-[19px] text-muted">
          Give it a free page with your photos, your story and links to your website, socials and
          Etsy shop.
        </p>
        <p className="mt-3 font-bold text-brand">Free for good. No ads, no sales calls.</p>
        <Link href="/add" className="btn-primary mt-6 px-6 py-3">
          List your business
        </Link>
      </section>
    </main>
  );
}
