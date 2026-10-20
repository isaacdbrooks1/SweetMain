import Link from "next/link";
import HeaderSearch from "./HeaderSearch";

export function Wordmark() {
  return (
    <span className="text-xl font-extrabold tracking-tight">
      sweet<span className="text-brand">main</span>
    </span>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" aria-label="Sweet Main home">
          <Wordmark />
        </Link>
        <HeaderSearch />
        <nav className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link href="/search" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-subtle">
            Browse
          </Link>
          <Link href="/add" className="btn-primary px-3.5 py-2 text-sm">
            List your business
          </Link>
        </nav>
      </div>
    </header>
  );
}
