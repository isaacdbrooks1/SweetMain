import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusiness } from "@/lib/businesses";
import BusinessAvatar from "@/components/BusinessAvatar";
import { placeLabel } from "@/components/BusinessCard";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
};

const LINK_LABELS: Record<string, string> = {
  website: "Website",
  etsy: "Etsy shop",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBusiness((await params).id);
  return { title: b ? `${b.name} · Local Finds` : "Not found · Local Finds", description: b?.tagline };
}

export default async function BusinessPage({ params, searchParams }: Props) {
  const [{ id }, { new: isNew }] = await Promise.all([params, searchParams]);
  const b = await getBusiness(id);
  if (!b) notFound();

  const links = Object.entries(b.links).filter(([, url]) => url);
  const showSupport = b.supportLinks.length > 0 || b.investorContact;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {isNew && (
        <div role="status" className="mb-8 rounded-2xl border border-brand/30 bg-brand-soft p-5">
          <p className="font-display text-lg font-semibold text-brand">🎉 Your listing is live!</p>
          <p className="mt-1">Share this page&apos;s link with your customers so they can find and support you.</p>
        </div>
      )}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <BusinessAvatar category={b.category} size="lg" />
        <div>
          <p className="text-sm font-medium text-accent">
            {b.category} · {placeLabel(b)}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold">{b.name}</h1>
          <p className="mt-2 text-lg text-muted">{b.tagline}</p>
        </div>
      </header>

      {links.length > 0 && (
        <nav aria-label="Links" className="mt-6 flex flex-wrap gap-2">
          {links.map(([key, url], i) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={i === 0 ? "btn-primary px-5 py-2.5" : "btn-secondary"}
            >
              {LINK_LABELS[key] ?? key} ↗
            </a>
          ))}
        </nav>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_320px]">
        <section>
          <h2 className="font-display text-2xl font-semibold">About</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed">
            {b.description || "This business hasn't added a longer description yet."}
          </p>
          {!b.onlineOnly && (
            <p className="mt-6 text-muted">
              📍 {[b.city, b.state, b.zip].filter(Boolean).join(", ")}
            </p>
          )}
        </section>

        {showSupport && (
          <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-xl font-semibold">Support {b.name}</h2>
            {b.supportLinks.length > 0 && (
              <ul className="mt-4 space-y-2">
                {b.supportLinks.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3 font-medium text-brand hover:bg-brand hover:text-brand-ink"
                    >
                      {s.platform === "Other" ? "Support page" : `Back us on ${s.platform}`}
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {b.investorContact && (
              <div className="mt-5 rounded-xl bg-accent-soft p-4">
                <p className="font-medium">Interested in investing more?</p>
                <p className="mt-1 text-sm text-muted">
                  The owner welcomes messages from potential investors.
                </p>
                {/* The message form gets wired to email in the "Support & invest" phase. */}
                <button disabled className="btn-secondary mt-3 w-full cursor-not-allowed opacity-60">
                  Message form coming soon
                </button>
              </div>
            )}
            <p className="mt-4 text-xs text-muted">
              Local Finds doesn&apos;t review, arrange or take part in investments. Always do your
              own research.
            </p>
          </aside>
        )}
      </div>

      <p className="mt-12">
        <Link href="/search" className="font-medium text-brand hover:underline">
          ← Browse more local businesses
        </Link>
      </p>
    </main>
  );
}
