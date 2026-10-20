import Link from "next/link";
import { Check, MapPin, Search } from "lucide-react";
import { listBusinesses } from "@/lib/businesses";
import BusinessCard from "@/components/BusinessCard";
import CategoryRow from "@/components/CategoryRow";
import Streetscape from "@/components/Streetscape";

// Always read fresh listings instead of caching the page at build time.
export const dynamic = "force-dynamic";

const OWNER_POINTS = [
  "Your own page with photos, your story and where to find you",
  "One place for your website, Etsy shop, Instagram, Facebook and TikTok",
  "A spot to share your crowdfunding and hear from people who want to invest",
];

export default async function Home() {
  const newest = (await listBusinesses()).slice(0, 8);

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pt-20">
          <h1 className="max-w-[16ch] text-[40px] sm:max-w-[22ch] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[60px]">
            Find the small businesses in your neighborhood.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[19px] text-muted">
            Bakeries, makers, salons, repair shops and more, run by people who live near you.
          </p>
          <form
            action="/search"
            className="mt-8 flex max-w-2xl flex-col overflow-hidden rounded-md border-2 border-ink bg-bg shadow-[4px_4px_0_0_var(--ink)] sm:flex-row"
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
            <label className="flex items-center gap-3 border-t-2 border-ink px-4 sm:w-56 sm:border-l-2 sm:border-t-0">
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
        <Streetscape className="block h-44 w-full sm:h-56" />
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        <CategoryRow hrefFor={(c) => (c ? `/search?category=${encodeURIComponent(c)}` : "/search")} />
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

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="grid items-center gap-10 border-t-2 border-ink pt-12 md:grid-cols-2">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em]">
              Own a small business?
            </h2>
            <p className="mt-3 max-w-[44ch] text-[19px] text-muted">
              Put it where your neighbors are looking. Listing is free and takes about five
              minutes.
            </p>
            <Link href="/add" className="btn-primary mt-6 px-6 py-3">
              List your business
            </Link>
          </div>
          <ul className="space-y-4">
            {OWNER_POINTS.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gilt text-ink">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
