import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2, ChevronRight, Globe, MapPin, MessageSquare, Navigation, ShoppingBag } from "lucide-react";
import { getBusiness } from "@/lib/businesses";
import { imageUrl } from "@/lib/uploads";
import { PhotoPlaceholder, placeLabel } from "@/components/BusinessCard";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
};

const LINKS: { key: "website" | "etsy" | "instagram" | "facebook" | "tiktok"; label: string }[] = [
  { key: "website", label: "Website" },
  { key: "etsy", label: "Etsy shop" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
];

// Shows the link's address without "https://www." so people can see where it goes.
function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

// Opens Google Maps (the app on phones) searching for the business at its address,
// which often lands on the business's own Google listing.
function directionsUrl(b: { name: string; address?: string; city: string; state: string; zip: string }): string {
  const query = `${b.name}, ${b.address}, ${b.city}, ${b.state} ${b.zip}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBusiness((await params).id);
  return { title: b ? `${b.name} · Sweet Main` : "Not found · Sweet Main", description: b?.tagline };
}

export default async function BusinessPage({ params, searchParams }: Props) {
  const [{ id }, { new: isNew }] = await Promise.all([params, searchParams]);
  const b = await getBusiness(id);
  if (!b) notFound();

  const links = LINKS.filter((l) => b.links[l.key]);
  const [cover, ...rest] = b.photos;
  const ext = { target: "_blank", rel: "noopener noreferrer nofollow" } as const;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      {isNew && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4">
          <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={20} />
          <div>
            <p className="font-semibold">Your listing is live.</p>
            <p className="text-sm text-muted">Share this page&apos;s link with customers so they can find and support you.</p>
          </div>
        </div>
      )}

      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/search" className="hover:text-ink hover:underline">Browse</Link>
        <ChevronRight size={14} />
        <Link href={`/search?category=${encodeURIComponent(b.category)}`} className="hover:text-ink hover:underline">
          {b.category}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink">{b.name}</span>
      </nav>

      {/* Photos: one big cover with up to three smaller ones beside it. */}
      <div
        className={`grid h-64 gap-2 overflow-hidden rounded-2xl sm:h-96 ${
          rest.length > 0 ? "sm:grid-cols-[2fr_1fr]" : ""
        }`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(cover)} alt={`${b.name}`} className="h-full w-full object-cover" />
        ) : (
          <PhotoPlaceholder category={b.category} />
        )}
        {rest.length > 0 && (
          <div className={`hidden gap-2 sm:grid ${rest.length > 1 ? "grid-rows-2" : ""} ${rest.length > 2 ? "grid-cols-2" : ""}`}>
            {rest.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p}
                src={imageUrl(p)}
                alt=""
                className={`h-full min-h-0 w-full object-cover ${rest.length === 3 && i === 0 ? "col-span-2" : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_340px]">
        <div>
          <div className="flex items-center gap-4">
            {b.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl(b.logo)} alt="" className="h-16 w-16 shrink-0 rounded-full border border-line object-cover" />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{b.name}</h1>
              <p className="mt-1 text-muted">
                <Link href={`/search?category=${encodeURIComponent(b.category)}`} className="hover:underline">
                  {b.category}
                </Link>{" "}
                · {placeLabel(b)}
              </p>
            </div>
          </div>
          <p className="mt-6 text-lg">{b.tagline}</p>

          <section className="mt-8 border-t border-line pt-8">
            <h2 className="text-xl font-bold">About</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">
              {b.description || "This business hasn't added a longer description yet."}
            </p>
          </section>

          {!b.onlineOnly && (
            <section className="mt-8 border-t border-line pt-8">
              <h2 className="text-xl font-bold">Location</h2>
              <div className="mt-3 flex gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-muted" />
                {b.address ? (
                  <address className="not-italic">
                    {b.address}
                    <br />
                    {b.city}, {b.state} {b.zip}
                  </address>
                ) : (
                  <p>
                    {placeLabel(b)} area
                    <span className="mt-1 block text-sm text-muted">
                      No street address listed. Check their links for where to find them.
                    </span>
                  </p>
                )}
              </div>
              {b.address && (
                <a href={directionsUrl(b)} {...ext} className="btn-secondary mt-4">
                  <Navigation size={18} /> Get directions
                </a>
              )}
            </section>
          )}
        </div>

        <aside className="space-y-4 md:sticky md:top-24 md:self-start">
          {links.length > 0 && (
            <div className="rounded-xl border border-line p-5">
              <h2 className="font-bold">Find {b.name} online</h2>
              <ul className="mt-3 divide-y divide-line">
                {links.map(({ key, label }) => {
                  const url = b.links[key]!;
                  const Icon = key === "website" ? Globe : key === "etsy" ? ShoppingBag : ArrowUpRight;
                  return (
                    <li key={key}>
                      <a href={url} {...ext} className="group flex items-center gap-3 py-3">
                        <Icon size={18} className="shrink-0 text-muted" />
                        <span className="min-w-0">
                          <span className="block font-semibold group-hover:underline">{label}</span>
                          <span className="block truncate text-sm text-muted">{shortUrl(url)}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {(b.supportLinks.length > 0 || b.investorContact) && (
            <div className="rounded-xl border border-line p-5">
              <h2 className="font-bold">Support this business</h2>
              {b.supportLinks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {b.supportLinks.map((s) => (
                    <a key={s.url} href={s.url} {...ext} className="btn-primary w-full justify-between">
                      {s.platform === "Other" ? "Support page" : `Back us on ${s.platform}`}
                      <ArrowUpRight size={18} />
                    </a>
                  ))}
                </div>
              )}
              {b.investorContact && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="font-semibold">Thinking about a bigger investment?</p>
                  <p className="mt-1 text-sm text-muted">The owner is open to hearing from investors.</p>
                  {/* Gets wired to email in the "Support & invest" phase. */}
                  <button disabled className="btn-secondary mt-3 w-full cursor-not-allowed opacity-60">
                    <MessageSquare size={18} /> Message the owner (coming soon)
                  </button>
                </div>
              )}
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Sweet Main doesn&apos;t review or take part in investments. Do your own research
                before putting money in.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
