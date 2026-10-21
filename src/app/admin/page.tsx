import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/admin";
import { listAllListings, listOpenReports } from "@/lib/moderation";
import { dismiss, hideListing, logout, showListing } from "./actions";
import DeleteButton from "./DeleteButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin · Sweet Main", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const smallBtn = "rounded-md px-2.5 py-1.5 text-[14px] font-bold hover:bg-subtle";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-4 pt-10">
        <h1 className="text-[34px] font-extrabold">Admin</h1>
        <p className="mt-3 text-muted">
          The admin page is turned off because no admin password is set. Add an
          ADMIN_PASSWORD (at least 12 characters) to .env.local and to Vercel&apos;s environment
          variables.
        </p>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-4 pt-14">
        <h1 className="text-[34px] font-extrabold">Admin</h1>
        <p className="mt-2 text-muted">Sign in to review reports and manage listings.</p>
        <LoginForm />
      </main>
    );
  }

  const [reports, listings] = await Promise.all([listOpenReports(), listAllListings()]);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[34px] font-extrabold">Admin</h1>
        <form action={logout}>
          <button type="submit" className={smallBtn}>Sign out</button>
        </form>
      </div>

      <section className="mt-8">
        <h2 className="text-[26px] font-extrabold">
          Reports to review <span className="text-muted">({reports.length})</span>
        </h2>
        {reports.length === 0 ? (
          <p className="mt-3 text-muted">No open reports. Nice and quiet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-bold">
                    {r.businessStatus === "live" ? (
                      <Link href={`/b/${r.businessId}`} className="hover:underline" target="_blank">{r.businessName}</Link>
                    ) : (
                      r.businessName
                    )}
                    {r.businessStatus === "hidden" && <span className="ml-2 text-[14px] text-muted">(hidden)</span>}
                  </p>
                  <p className="text-[15px]"><span className="font-bold text-danger">{r.reason}</span> on {when(r.createdAt)}</p>
                  {r.details && <p className="mt-1 whitespace-pre-line text-[15px] text-muted">{r.details}</p>}
                </div>
                <div className="flex shrink-0 gap-1">
                  {r.businessStatus === "live" && (
                    <form action={hideListing}>
                      <input type="hidden" name="id" value={r.businessId} />
                      <button type="submit" className="btn-primary px-3 py-1.5 text-[14px]">Hide listing</button>
                    </form>
                  )}
                  <form action={dismiss}>
                    <input type="hidden" name="reportId" value={r.id} />
                    <button type="submit" className={smallBtn}>Dismiss</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[26px] font-extrabold">
          All listings <span className="text-muted">({listings.length})</span>
        </h2>
        <p className="mt-1 text-[15px] text-muted">
          Hidden listings disappear from the site but can be shown again. Deleting removes the
          listing and its photos for good.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[15px]">
            <thead className="border-b-2 border-ink">
              <tr>
                <th className="py-2 pr-4 font-bold">Business</th>
                <th className="py-2 pr-4 font-bold">Added</th>
                <th className="py-2 pr-4 font-bold">Owner email</th>
                <th className="py-2 pr-4 font-bold">Status</th>
                <th className="py-2 font-bold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {listings.map((b) => (
                <tr key={b.id} className={b.status === "hidden" ? "text-muted" : ""}>
                  <td className="py-3 pr-4">
                    {b.status === "live" ? (
                      <Link href={`/b/${b.id}`} target="_blank" className="font-bold text-ink hover:underline">{b.name}</Link>
                    ) : (
                      <span className="font-bold">{b.name}</span>
                    )}
                    <span className="block text-[14px] text-muted">
                      {b.category}{b.city ? ` in ${b.city}, ${b.state}` : ", online"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{when(b.createdAt)}</td>
                  <td className="py-3 pr-4"><a href={`mailto:${b.ownerEmail}`} className="hover:underline">{b.ownerEmail}</a></td>
                  <td className="py-3 pr-4">
                    {b.status === "live" ? "Live" : "Hidden"}
                    {b.openReports > 0 && (
                      <span className="ml-2 rounded-md bg-gilt px-1.5 py-0.5 text-[13px] font-bold text-ink">
                        {b.openReports} report{b.openReports > 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <form action={b.status === "live" ? hideListing : showListing}>
                        <input type="hidden" name="id" value={b.id} />
                        <button type="submit" className={smallBtn}>{b.status === "live" ? "Hide" : "Show again"}</button>
                      </form>
                      <DeleteButton id={b.id} name={b.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
