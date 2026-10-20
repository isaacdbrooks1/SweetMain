import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

// Icon-and-label row of categories, starting with "All". The current one is underlined.
export default function CategoryRow({ active = "", hrefFor }: {
  active?: string;
  hrefFor: (category: string) => string;
}) {
  const items = [{ name: "", label: "All", icon: LayoutGrid }, ...CATEGORIES.map((c) => ({ ...c, label: c.name }))];
  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex min-w-max gap-7 border-b border-line">
        {items.map(({ name, label, icon: Icon }) => {
          const on = active === name;
          return (
            <li key={label}>
              <Link
                href={hrefFor(name)}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-1.5 border-b-2 pb-3 pt-1 text-[14px] font-bold transition-colors ${
                  on ? "border-brand text-brand" : "border-transparent text-muted hover:border-line hover:text-ink"
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
