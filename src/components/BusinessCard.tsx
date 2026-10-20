import Link from "next/link";
import type { PublicBusiness } from "@/lib/businesses";
import { categoryIcon } from "@/lib/categories";
import { imageUrl } from "@/lib/uploads";

export function placeLabel(b: PublicBusiness): string {
  if (b.onlineOnly) return "Online";
  return [b.city, b.state].filter(Boolean).join(", ") || b.zip;
}

export function supportBadge(b: PublicBusiness): string | null {
  if (b.supportLinks.length > 0) return "Raising funds";
  if (b.investorContact) return "Open to investors";
  return null;
}

// Gray tile with the category icon, used when a business has no photo yet.
export function PhotoPlaceholder({ category }: { category: string }) {
  const Icon = categoryIcon(category);
  return (
    <div className="grid h-full w-full place-items-center bg-subtle text-muted/70">
      <Icon size={40} strokeWidth={1.25} />
    </div>
  );
}

export function distanceLabel(miles: number): string {
  return miles < 1 ? "Under a mile away" : `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} miles away`;
}

// Reads like a sentence: "Food & Drink in Springfield, OR" or "Crafts & Handmade, online".
export function whereLabel(b: PublicBusiness): string {
  return b.onlineOnly ? `${b.category}, online` : `${b.category} in ${placeLabel(b)}`;
}

export default function BusinessCard({ business: b }: { business: PublicBusiness & { distance?: number } }) {
  const badge = supportBadge(b);
  return (
    <Link href={`/b/${b.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
        {b.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(b.photos[0])} alt="" className="h-full w-full object-cover" />
        ) : (
          <PhotoPlaceholder category={b.category} />
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-md bg-gilt px-2 pb-0.5 pt-1 text-[13px] font-bold text-ink">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start gap-3">
        {b.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(b.logo)} alt="" className="h-10 w-10 shrink-0 rounded-full border border-line object-cover" />
        )}
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[18px] font-extrabold leading-snug group-hover:underline">{b.name}</h3>
          <p className="text-[15px] text-muted">{whereLabel(b)}</p>
          {b.distance !== undefined && (
            <p className="text-[15px] font-bold text-brand">{distanceLabel(b.distance)}</p>
          )}
          <p className="mt-1 line-clamp-2 text-[15px] leading-snug">{b.tagline}</p>
        </div>
      </div>
    </Link>
  );
}
