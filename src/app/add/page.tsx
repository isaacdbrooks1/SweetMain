import type { Metadata } from "next";
import AddBusinessForm from "./AddBusinessForm";

export const metadata: Metadata = { title: "List your business · Sweet Main" };

export default function AddPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-10">
      <header className="pb-8">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[44px]">List your business</h1>
        <p className="mt-2 max-w-xl text-muted">
          Free for independent businesses. Only the basics are required; add as much else as
          you like.
        </p>
      </header>
      <AddBusinessForm />
    </main>
  );
}
