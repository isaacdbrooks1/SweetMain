import Link from "next/link";
import HeaderSearch from "./HeaderSearch";

// The logo is a little green street-name sign reading "Sweet Main".
export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className={`street-sign ${size === "lg" ? "text-2xl" : "text-[17px] min-[400px]:text-[19px]"}`}>
      Sweet Main
    </span>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6">
        <Link href="/" aria-label="Sweet Main home" className="shrink-0 rounded-md">
          <Wordmark />
        </Link>
        <HeaderSearch />
        <nav className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Link href="/search" className="hidden rounded-md px-3 py-2 font-bold hover:bg-subtle min-[360px]:block">
            Browse
          </Link>
          <Link href="/add" className="btn-primary whitespace-nowrap px-3 py-2 text-[15px] sm:px-3.5">
            <span className="sm:hidden">List yours</span>
            <span className="hidden sm:inline">List your business</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
