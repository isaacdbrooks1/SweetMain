"use server";

import { redirect } from "next/navigation";
import { updateBusiness } from "@/lib/businesses";
import { tokenMatches } from "@/lib/editLinks";
import { deleteListing } from "@/lib/moderation";
import { parseListing, type FormState } from "@/lib/listingForm";

export async function saveListing(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const key = String(formData.get("key") ?? "");
  // Check the private key again on every save, never just when the page loads.
  if (!(await tokenMatches(id, key))) {
    return { errors: { form: "This edit link has expired. Get a new one at www.sweetmain.com/edit-link." }, values: {} };
  }
  const { errors, values, listing } = await parseListing(formData);
  if (!listing) return { errors, values };
  await updateBusiness(id, listing);
  redirect(`/b/${id}?updated=1`);
}

// Lets an owner remove their own listing (and its photos) with their edit link.
export async function deleteOwnListing(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const key = String(formData.get("key") ?? "");
  if (!(await tokenMatches(id, key))) redirect(`/b/${id}/edit`);
  await deleteListing(id);
  redirect("/?removed=1");
}
