import type { Metadata } from "next";
import AddBusinessForm from "./AddBusinessForm";

export const metadata: Metadata = { title: "Add your business · Local Finds" };

export default function AddPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <p className="font-medium text-accent">Free for every small business</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Add your business</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Tell your community who you are, link your website, socials and Etsy shop, and let
          people support you.
        </p>
      </header>
      <AddBusinessForm />
    </main>
  );
}
