import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listBusinesses } from "@/lib/businesses";
import { hasTown, townSlug } from "@/lib/towns";
import BusinessCard from "@/components/BusinessCard";

type Props = { params: Promise<{ slug: string }> };

async function townListings(slug: string) {
  return (await listBusinesses()).filter((b) => hasTown(b) && townSlug(b.city, b.state) === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const list = await townListings((await params).slug);
  const place = list[0] ? `${list[0].city}, ${list[0].state}` : "this town";
  return {
    title: `Small businesses in ${place} · Sweet Main`,
    description: `Find and support independent shops, makers and services in ${place}.`,
  };
}

export default async function TownPage({ params }: Props) {
  const list = await townListings((await params).slug);
  if (list.length === 0) notFound();
  const { city, state } = list[0];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[44px]">
        Small businesses in {city}, {state}
      </h1>
      <p className="mt-2 text-muted">
        {list.length} {list.length === 1 ? "business" : "businesses"} run by people in and around {city}.{" "}
        <Link href="/add" className="font-bold text-brand hover:underline">List yours</Link>
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((b) => <BusinessCard key={b.id} business={b} />)}
      </div>

      <p className="mt-12 text-[15px]">
        <Link href="/towns" className="font-bold text-brand hover:underline">See all towns</Link>
      </p>
    </main>
  );
}
