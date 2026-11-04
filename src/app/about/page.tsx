import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About, terms and privacy · Sweet Main",
  description: "What Sweet Main is, the rules for listings, and how we handle your information.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 border-t border-line pt-8">
      <h2 className="text-[26px] font-extrabold tracking-[-0.01em]">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-10">
      <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[44px]">About Sweet Main</h1>
      <p className="mt-4 text-[19px] text-muted">
        Sweet Main is a free directory that helps neighbors find and support independent local
        businesses: the bakeries, makers, salons and repair shops run by people who live near you.
      </p>
      <p className="mt-3">
        Listing a business is free for good. We don&apos;t sell ads to listed businesses and we
        don&apos;t make sales calls.
      </p>
      <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-bold text-brand">
        <a href="#terms" className="hover:underline">Terms</a>
        <a href="#investing" className="hover:underline">Investing</a>
        <a href="#privacy" className="hover:underline">Privacy</a>
        <a href="#remove" className="hover:underline">Changing or removing a listing</a>
      </nav>

      <Section id="terms" title="Terms">
        <p>By listing a business on Sweet Main, you agree that:</p>
        <ul>
          <li>You own or run the business, or have its permission to list it.</li>
          <li>What you post is accurate, and you have the right to use the photos and words.</li>
          <li>The business is a real, independent business, not a chain or a scam.</li>
          <li>Nothing you post is illegal, hateful, or misleading.</li>
        </ul>
        <p>
          We may hide or remove any listing, at any time, for example if it&apos;s reported and
          breaks these rules. Sweet Main is provided as is; we do our best to keep it running and
          accurate, but we can&apos;t promise it always will be.
        </p>
      </Section>

      <Section id="investing" title="Investing">
        <p>
          Some businesses link to fundraising pages (such as Kiva, Honeycomb Credit or Wefunder) or
          let people message them about investing. Sweet Main only shows those links and passes
          messages along.
        </p>
        <ul>
          <li>We don&apos;t review, recommend or arrange any investment.</li>
          <li>We never handle money and never take a fee or a cut.</li>
          <li>Investing in a small business is risky: you can lose some or all of your money.</li>
        </ul>
        <p>Do your own research, and get proper advice before investing.</p>
      </Section>

      <Section id="privacy" title="Privacy">
        <p>We keep this simple and collect as little as we can.</p>
        <ul>
          <li>
            <strong>Listings are public.</strong> Everything on a listing page (name, photos, story,
            links, town, and street address if you add one) can be seen by anyone.
          </li>
          <li>
            <strong>Owner emails are private.</strong> We use them only to send you your edit link
            and messages from your page. They are never shown on the site.
          </li>
          <li>
            <strong>Messages to owners</strong> (including your name, email and message) are stored
            and emailed to the owner so they can reply to you.
          </li>
          <li>
            <strong>Reports</strong> about listings are private and only seen by Sweet Main.
          </li>
          <li>
            <strong>No tracking or ad cookies.</strong> The only cookie is the admin sign-in.
          </li>
          <li>We never sell your information.</li>
        </ul>
        <p>
          The site runs on trusted services: Vercel (hosting), Supabase (database and photos) and
          Resend (email).
        </p>
      </Section>

      <Section id="remove" title="Changing or removing a listing">
        <p>
          Owners can change or delete their listing any time using the private edit link we emailed
          them. Lost it?{" "}
          <Link href="/edit-link" className="font-bold text-brand hover:underline">Get a new edit link</Link>.
        </p>
        <p>
          See something wrong on someone else&apos;s listing? Use <strong>Report this listing</strong>{" "}
          at the bottom of their page.
        </p>
      </Section>
    </main>
  );
}
