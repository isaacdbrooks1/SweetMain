"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

// Compact search in the header, for pages without their own search.
export default function HeaderSearch() {
  // The home and browse pages have their own big search, so skip this one there.
  const path = usePathname();
  if (path === "/" || path === "/search") return null;
  return (
    <form action="/search" className="relative hidden w-full max-w-sm md:block">
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        name="q"
        placeholder="Search local businesses"
        aria-label="Search local businesses"
        className="w-full rounded-md border border-line bg-subtle py-2 pl-10 pr-3 text-[15px] focus:border-ink focus:bg-bg focus:outline-none"
      />
    </form>
  );
}
