import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusiness } from "@/lib/businesses";
import { REPORT_REASONS } from "@/lib/moderation";
import ReportForm from "./ReportForm";

export const metadata: Metadata = { title: "Report a listing · Sweet Main", robots: { index: false } };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await getBusiness(id);
  if (!b) notFound();

  return (
    <main className="mx-auto max-w-xl px-4 pt-10">
      <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em]">Report a listing</h1>
      <p className="mt-2 text-muted">
        Tell us what&apos;s wrong with <span className="font-bold text-ink">{b.name}</span>. Reports are
        private; the business won&apos;t see who sent them.
      </p>
      <div className="mt-8">
        <ReportForm id={b.id} reasons={REPORT_REASONS} />
      </div>
    </main>
  );
}
