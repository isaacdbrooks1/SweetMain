import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-16 text-center">
      <h1 className="text-[34px] font-extrabold leading-tight">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">
        The business may have moved or been removed, or the link has a typo.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/search" className="btn-primary">Browse businesses</Link>
        <Link href="/" className="btn-secondary">Go to the home page</Link>
      </div>
    </main>
  );
}
