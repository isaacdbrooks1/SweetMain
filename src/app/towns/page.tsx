import type { Metadata } from "next";
import Link from "next/link";
import { listBusinesses } from "@/lib/businesses";
import { townsFrom } from "@/lib/towns";

export const metadata: Metadata = { title: "Towns · Sweet Main" };
export const dynamic = "force-dynamic";

export default async function TownsPage() {
  const towns = townsFrom(await listBusinesses());

  return (
    <main className="mx-auto max-w-2xl px-4 pt-10">
      <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em]">Towns on Sweet Main</h1>
      {towns.length === 0 ? (
        <p className="mt-3 text-muted">
          No towns yet.{" "}
          <Link href="/add" className="font-bold text-ink underline">List the first business.</Link>
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {towns.map((t) => (
            <li key={t.slug}>
              <Link href={`/town/${t.slug}`} className="flex items-baseline justify-between gap-4 py-4 hover:text-brand">
                <span className="text-[19px] font-bold">{t.city}, {t.state}</span>
                <span className="text-[15px] text-muted">
                  {t.count} {t.count === 1 ? "business" : "businesses"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
