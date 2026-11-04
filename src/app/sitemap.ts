import type { MetadataRoute } from "next";
import { listBusinesses } from "@/lib/businesses";
import { townsFrom } from "@/lib/towns";

// The list of pages Google should know about. Rebuilt at most once an hour.
export const revalidate = 3600;

const SITE = "https://www.sweetmain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const list = await listBusinesses();
  return [
    { url: `${SITE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/search`, changeFrequency: "daily" },
    { url: `${SITE}/towns`, changeFrequency: "weekly" },
    { url: `${SITE}/add`, changeFrequency: "monthly" },
    { url: `${SITE}/about`, changeFrequency: "monthly" },
    ...townsFrom(list).map((t) => ({ url: `${SITE}/town/${t.slug}`, changeFrequency: "weekly" as const })),
    ...list.map((b) => ({ url: `${SITE}/b/${b.id}`, lastModified: b.createdAt, changeFrequency: "weekly" as const })),
  ];
}
