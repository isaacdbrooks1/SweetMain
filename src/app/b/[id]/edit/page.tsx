import type { Metadata } from "next";
import Link from "next/link";
import { getListingForEdit } from "@/lib/businesses";
import { tokenMatches } from "@/lib/editLinks";
import AddBusinessForm from "@/app/add/AddBusinessForm";
import { saveListing } from "./actions";

export const metadata: Metadata = { title: "Edit your listing · Sweet Main", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ key?: string }> };

export default async function EditPage({ params, searchParams }: Props) {
  const [{ id }, { key = "" }] = await Promise.all([params, searchParams]);
  const values = (await tokenMatches(id, key)) ? await getListingForEdit(id) : null;

  if (!values) {
    return (
      <main className="mx-auto max-w-xl px-4 pt-14">
        <h1 className="text-[34px] font-extrabold leading-tight">This edit link doesn&apos;t work</h1>
        <p className="mt-3 text-muted">
          It may be an old link: each time a new one is sent, the previous one stops working.
        </p>
        <Link href="/edit-link" className="btn-primary mt-6">Email me a new link</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pt-10">
      <header className="pb-8">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[44px]">Edit your listing</h1>
        <p className="mt-2 text-muted">
          Changes show on <Link href={`/b/${id}`} className="font-bold text-brand hover:underline">your page</Link> as soon as you save.
        </p>
      </header>
      <AddBusinessForm
        action={saveListing}
        initial={values}
        hidden={{ id, key }}
        submitLabel="Save changes"
        footnote="Your changes go live as soon as you save."
      />
    </main>
  );
}
