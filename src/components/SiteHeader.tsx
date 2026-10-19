import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-brand-ink"
          >
            L
          </span>
          <span className="font-display text-xl font-semibold">Local Finds</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/search" className="px-2 py-2 font-medium text-muted hover:text-ink">
            Browse
          </Link>
          <Link href="/add" className="btn-primary px-4 py-2 text-sm sm:px-5">
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add your business</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
