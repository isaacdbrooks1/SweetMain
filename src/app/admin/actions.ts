"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin, signIn, signOut } from "@/lib/admin";
import { deleteListing, dismissReport, setListingStatus } from "@/lib/moderation";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  if (!ok) return { error: "That password isn't right." };
  redirect("/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin");
}

// Every admin action checks the sign-in again; never trust the page alone.
async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not signed in as admin.");
}

export async function hideListing(formData: FormData) {
  await requireAdmin();
  await setListingStatus(String(formData.get("id")), "hidden");
  revalidatePath("/admin");
}

export async function showListing(formData: FormData) {
  await requireAdmin();
  await setListingStatus(String(formData.get("id")), "live");
  revalidatePath("/admin");
}

export async function removeListing(formData: FormData) {
  await requireAdmin();
  await deleteListing(String(formData.get("id")));
  revalidatePath("/admin");
}

export async function dismiss(formData: FormData) {
  await requireAdmin();
  await dismissReport(Number(formData.get("reportId")));
  revalidatePath("/admin");
}
