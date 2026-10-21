// Reports from visitors and the admin actions that deal with them (server only).
// Tables: see supabase/002_reports.sql.
import { supabase, PHOTO_BUCKET } from "./supabase";

export const REPORT_REASONS = [
  "Spam or fake business",
  "Wrong or misleading information",
  "Offensive or inappropriate content",
  "Suspicious investment or scam",
  "Something else",
];

export type Report = {
  id: number;
  createdAt: string;
  businessId: string;
  businessName: string;
  businessStatus: string;
  reason: string;
  details: string;
};

export type AdminListing = {
  id: string;
  createdAt: string;
  name: string;
  category: string;
  city: string;
  state: string;
  status: "live" | "hidden";
  ownerEmail: string;
  openReports: number;
};

export async function addReport(businessId: string, reason: string, details: string) {
  const { error } = await supabase
    .from("reports")
    .insert({ business_id: businessId, reason, details });
  if (error) throw new Error(`Couldn't save the report: ${error.message}`);
}

export async function listOpenReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("id, created_at, business_id, reason, details, businesses (name, status)")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Couldn't load reports: ${error.message}`);
  type Row = {
    id: number;
    created_at: string;
    business_id: string;
    reason: string;
    details: string;
    businesses: { name: string; status: string } | null;
  };
  return (data as unknown as Row[]).map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    businessId: r.business_id,
    businessName: r.businesses?.name ?? "(deleted listing)",
    businessStatus: r.businesses?.status ?? "deleted",
    reason: r.reason,
    details: r.details,
  }));
}

export async function listAllListings(): Promise<AdminListing[]> {
  const [listings, reports] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, created_at, name, category, city, state, status, owner_email")
      .order("created_at", { ascending: false }),
    supabase.from("reports").select("business_id").eq("status", "open"),
  ]);
  if (listings.error) throw new Error(`Couldn't load listings: ${listings.error.message}`);
  const counts = new Map<string, number>();
  for (const r of reports.data ?? []) counts.set(r.business_id, (counts.get(r.business_id) ?? 0) + 1);
  return listings.data.map((b) => ({
    id: b.id,
    createdAt: b.created_at,
    name: b.name,
    category: b.category,
    city: b.city,
    state: b.state,
    status: b.status,
    ownerEmail: b.owner_email,
    openReports: counts.get(b.id) ?? 0,
  }));
}

export async function setListingStatus(id: string, status: "live" | "hidden") {
  const { error } = await supabase.from("businesses").update({ status }).eq("id", id);
  if (error) throw new Error(`Couldn't update the listing: ${error.message}`);
  // Hiding a listing takes care of its reports.
  if (status === "hidden") {
    await supabase.from("reports").update({ status: "resolved" }).eq("business_id", id).eq("status", "open");
  }
}

export async function dismissReport(id: number) {
  const { error } = await supabase.from("reports").update({ status: "dismissed" }).eq("id", id);
  if (error) throw new Error(`Couldn't dismiss the report: ${error.message}`);
}

// Removes the listing, its reports (cascade) and its photos. Can't be undone.
export async function deleteListing(id: string) {
  const { data } = await supabase.from("businesses").select("logo, photos").eq("id", id).maybeSingle();
  const { error } = await supabase.from("businesses").delete().eq("id", id);
  if (error) throw new Error(`Couldn't delete the listing: ${error.message}`);
  const files = [...(data?.photos ?? []), ...(data?.logo ? [data.logo] : [])];
  if (files.length) await supabase.storage.from(PHOTO_BUCKET).remove(files);
}
