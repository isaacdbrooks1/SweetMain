"use server";

import { redirect } from "next/navigation";
import { addBusiness } from "@/lib/businesses";
import { sendEditLink } from "@/lib/editLinks";
import { parseListing, type FormState } from "@/lib/listingForm";

export async function createBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const { errors, values, listing } = await parseListing(formData);
  if (!listing) return { errors, values };
  const id = await addBusiness(listing);
  // Email the owner a private link to edit their listing. A failed email
  // shouldn't undo the publish; they can ask for a new link later.
  await sendEditLink(id, true).catch((e) => console.error("edit link email failed", e));
  redirect(`/b/${id}?new=1`);
}
