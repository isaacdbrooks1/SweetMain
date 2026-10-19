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
  return miles < 1 ? "Under 1 mi" : `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
}

export default function BusinessCard({ business: b }: { business: PublicBusiness & { distance?: number } }) {
  const badge = supportBadge(b);
  return (
    <Link href={`/b/${b.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        {b.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(b.photos[0])}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder category={b.category} />
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-md bg-bg px-2 py-1 text-xs font-semibold shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start gap-3">
        {b.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(b.logo)} alt="" className="h-9 w-9 shrink-0 rounded-full border border-line object-cover" />
        )}
        <div className="min-w-0">
          <h3 className="truncate font-semibold group-hover:underline">{b.name}</h3>
          <p className="text-sm text-muted">
            {b.category} · {placeLabel(b)}
            {b.distance !== undefined && <> · {distanceLabel(b.distance)}</>}
          </p>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted">{b.tagline}</p>
        </div>
      </div>
    </Link>
  );
}
