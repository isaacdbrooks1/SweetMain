import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { listBusinesses } from "@/lib/businesses";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";

// Always read fresh listings instead of caching the page at build time.
export const dynamic = "force-dynamic";

const STEPS = [
  { title: "Add your business", text: "Free, in about five minutes. No tech skills needed." },
  { title: "Link everything", text: "Your website, Instagram, Facebook, TikTok and Etsy shop in one place." },
  { title: "Get support", text: "Neighbors can find you, follow you and back your crowdfunding." },
];

export default async function Home() {
  const newest = (await listBusinesses()).slice(0, 6);

  return (
    <main>
      <section className="border-b border-line bg-brand-soft/60">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <p className="font-medium text-accent">Shop small. Shop local.</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Find the small businesses that make your community special
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Bakers, makers, shops and services, all in one place, with links to their websites,
            socials and Etsy shops.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="font-display text-2xl font-semibold">Browse by category</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/search?category=${encodeURIComponent(c.name)}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 font-medium transition hover:border-brand hover:text-brand"
            >
              <span className="text-2xl" aria-hidden>{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">New on Local Finds</h2>
          {newest.length > 0 && (
            <Link href="/search" className="font-medium text-brand hover:underline">See all →</Link>
          )}
        </div>
        {newest.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newest.map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="text-lg">No businesses yet. Yours could be the first!</p>
            <Link href="/add" className="btn-primary mt-4">Add your business</Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="rounded-3xl bg-brand px-6 py-12 text-brand-ink sm:px-12">
          <h2 className="font-display text-3xl font-semibold">Own a small business?</h2>
          <p className="mt-2 max-w-xl opacity-90">Get found by people who want to shop local.</p>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="font-display text-3xl opacity-60">{i + 1}</span>
                <p className="mt-1 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm opacity-85">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/add"
            className="mt-8 inline-flex rounded-full bg-brand-ink px-6 py-3 font-semibold text-brand hover:opacity-90"
          >
            Add your business, it&apos;s free
          </Link>
        </div>
      </section>
    </main>
  );
}
