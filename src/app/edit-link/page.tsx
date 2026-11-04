import type { Metadata } from "next";
import LinkForm from "./LinkForm";

export const metadata: Metadata = { title: "Edit your listing · Sweet Main", robots: { index: false } };

export default function EditLinkPage() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-14">
      <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em]">Edit your listing</h1>
      <p className="mt-2 text-muted">
        We&apos;ll email you a private link to edit your listing. Use the same email you gave when you
        listed your business.
      </p>
      <LinkForm />
    </main>
  );
}
