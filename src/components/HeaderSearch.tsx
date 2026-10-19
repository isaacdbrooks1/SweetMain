"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

// Compact search in the header. Hidden on the home page, which has its own big search.
export default function HeaderSearch() {
  if (usePathname() === "/") return null;
  return (
    <form action="/search" className="relative hidden w-full max-w-sm md:block">
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        name="q"
        placeholder="Search local businesses"
        aria-label="Search local businesses"
        className="w-full rounded-lg border border-line bg-subtle py-2 pl-10 pr-3 text-sm focus:border-ink focus:bg-bg focus:outline-none"
      />
    </form>
  );
}
