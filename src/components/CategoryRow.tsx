import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

// Icon-and-label row of categories. `active` underlines the current one.
export default function CategoryRow({ active, hrefFor }: {
  active?: string;
  hrefFor: (category: string) => string;
}) {
  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex min-w-max gap-7 border-b border-line">
        {CATEGORIES.map(({ name, icon: Icon }) => {
          const on = active === name;
          return (
            <li key={name}>
              <Link
                href={hrefFor(on ? "" : name)}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-1.5 border-b-2 pb-3 pt-1 text-xs font-semibold transition-colors ${
                  on ? "border-ink text-ink" : "border-transparent text-muted hover:border-line hover:text-ink"
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
