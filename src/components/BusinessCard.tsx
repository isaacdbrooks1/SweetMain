import Link from "next/link";
import type { PublicBusiness } from "@/lib/businesses";
import BusinessAvatar from "./BusinessAvatar";

export function placeLabel(b: PublicBusiness): string {
  if (b.onlineOnly) return "Online";
  return [b.city, b.state].filter(Boolean).join(", ") || b.zip;
}

export default function BusinessCard({ business: b }: { business: PublicBusiness }) {
  return (
    <Link
      href={`/b/${b.id}`}
      className="group flex gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <BusinessAvatar category={b.category} />
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold group-hover:text-brand">{b.name}</h3>
        <p className="text-sm text-muted">
          {b.category} · {placeLabel(b)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm">{b.tagline}</p>
        {(b.supportLinks.length > 0 || b.investorContact) && (
          <span className="mt-3 inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
            Open to support
          </span>
        )}
      </div>
    </Link>
  );
}
