import Link from "next/link";
import { Wordmark } from "./SiteHeader";
import EmailLink from "./EmailLink";

const LINKS = [
  { href: "/search", label: "All businesses" },
  { href: "/towns", label: "Towns" },
  { href: "/add", label: "List your business" },
  { href: "/edit-link", label: "Edit your listing" },
  { href: "/about", label: "About, terms and privacy" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand text-center text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Wordmark />
        <p className="mx-auto mt-4 max-w-md">
          A free directory of independent shops, makers and services, run by the people who
          live near you.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 font-bold">
          {LINKS.map((l) => (
            <li key={l.href}><Link href={l.href} className="hover:underline">{l.label}</Link></li>
          ))}
          <li><EmailLink className="hover:underline" /></li>
        </ul>
      </div>
      <div className="border-t border-[#3d8961]">
        <p className="mx-auto max-w-3xl px-4 py-6 text-[15px] leading-relaxed text-[#dcebe2]">
          Sweet Main does not review, recommend or take part in any investment. Links to
          crowdfunding sites and messages to owners are between you and the business.
        </p>
      </div>
    </footer>
  );
}
