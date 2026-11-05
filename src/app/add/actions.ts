"use server";

import { redirect } from "next/navigation";
import { addBusiness, listingsTodayFor } from "@/lib/businesses";
import { sendEditLink } from "@/lib/editLinks";
import { notifyAdmin, siteUrl } from "@/lib/email";
import { parseListing, type FormState } from "@/lib/listingForm";

export async function createBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const { errors, values, listing } = await parseListing(formData);
  if (!listing) return { errors, values };
  if ((await listingsTodayFor(listing.ownerEmail)) >= 5) {
    return { errors: { form: "You've added a lot of listings today. Please try again tomorrow." }, values };
  }
  const id = await addBusiness(listing);
  // Email the owner a private link to edit their listing. A failed email
  // shouldn't undo the publish; they can ask for a new link later.
  await sendEditLink(id, true).catch((e) => console.error("edit link email failed", e));
  // Let Sweet Main know, so new listings get a quick look.
  await notifyAdmin(
    `New listing: ${listing.name}`,
    [
      `${listing.name} (${listing.category}) just joined Sweet Main.`,
      listing.tagline,
      "Have a quick look to make sure it's real. You can hide or delete it from the admin page.",
    ],
    { label: "See the listing", url: `${await siteUrl()}/b/${id}` },
  );
  redirect(`/b/${id}?new=1`);
}
