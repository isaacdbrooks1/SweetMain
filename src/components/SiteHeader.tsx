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
      {/* The logo sits in the middle, with Browse on its left and the List button on its right. */}
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:gap-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/search" className="-ml-3 shrink-0 rounded-md px-3 py-2 font-bold hover:bg-subtle">
            Browse
          </Link>
          <HeaderSearch />
        </div>
        <Link href="/" aria-label="Sweet Main home" className="rounded-md">
          <Wordmark />
        </Link>
        <nav className="flex justify-end">
          <Link href="/add" className="btn-primary whitespace-nowrap px-3 py-2 text-[15px] sm:px-3.5">
            <span className="sm:hidden">List yours</span>
            <span className="hidden sm:inline">List your business</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
