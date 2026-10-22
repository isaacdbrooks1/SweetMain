import Link from "next/link";
import { Wordmark } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-white/85">
            A free directory of independent shops, makers and services, run by the people who
            live near you.
          </p>
        </div>
        <div>
          <p className="font-bold">Find</p>
          <ul className="mt-3 space-y-2 text-white/85">
            <li><Link href="/search" className="hover:text-white hover:underline">All businesses</Link></li>
            <li><Link href="/towns" className="hover:text-white hover:underline">Towns</Link></li>
            <li><Link href="/search?category=Crafts+%26+Handmade" className="hover:text-white hover:underline">Handmade</Link></li>
            <li><Link href="/search?category=Food+%26+Drink" className="hover:text-white hover:underline">Food and drink</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold">For owners</p>
          <ul className="mt-3 space-y-2 text-white/85">
            <li><Link href="/add" className="hover:text-white hover:underline">List your business</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <p className="mx-auto max-w-6xl px-4 py-6 text-[14px] leading-relaxed text-white/75">
          Sweet Main does not review, recommend or take part in any investment. Links to
          crowdfunding sites and messages to owners are between you and the business.
        </p>
      </div>
    </footer>
  );
}
