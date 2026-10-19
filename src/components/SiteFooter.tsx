import Link from "next/link";
import { Wordmark } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-subtle">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-2 max-w-xs text-sm text-muted">
            A free directory of independent shops, makers and services.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Discover</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/search" className="hover:text-ink">Browse all</Link></li>
            <li><Link href="/search?category=Crafts+%26+Handmade" className="hover:text-ink">Handmade</Link></li>
            <li><Link href="/search?category=Food+%26+Drink" className="hover:text-ink">Food &amp; drink</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">For businesses</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/add" className="hover:text-ink">List your business</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-line px-4 py-6 text-xs leading-relaxed text-muted">
        Local Finds does not review, recommend or take part in any investment. Links to
        crowdfunding sites and messages to owners are between you and the business.
      </div>
    </footer>
  );
}
