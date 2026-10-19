import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          <span className="font-display font-semibold text-ink">Local Finds</span> · Find and
          support small businesses near you.
        </p>
        <nav className="flex gap-5">
          <Link href="/search" className="hover:text-ink">Browse</Link>
          <Link href="/add" className="hover:text-ink">Add your business</Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted">
        Local Finds does not review, arrange or take part in any investment. Investment links
        and messages go directly between you and the business.
      </p>
    </footer>
  );
}
