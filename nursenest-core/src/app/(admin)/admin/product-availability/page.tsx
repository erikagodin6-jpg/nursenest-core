import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

export const dynamic = "force-dynamic";

function hubHref(countrySlug: string, roleTrack: string, examCode: string): string {
  return `/${countrySlug}/${roleTrack}/${examCode}`;
}

export default async function AdminProductAvailabilityPage() {
  await requireAdmin();

  const rows = [...EXAM_PATHWAYS].sort((a, b) => a.countryCode.localeCompare(b.countryCode) || a.displayName.localeCompare(b.displayName));

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Product</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Product availability</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Source: <code className="rounded bg-muted px-1">exam-product-registry</code>. Controls acquisition tone (subscribe vs waitlist),
            Stripe tier mapping, and learner-facing eligibility. Change the registry + deploy to adjust offers—keep billing env keys aligned.
          </p>
        </div>
        <Link href="/admin/inventory" className="text-sm font-semibold text-primary underline">
          Inventory →
        </Link>
      </div>

      <section className="mt-8 nn-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pathway</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acquisition</th>
                <th className="px-4 py-3">Marketing hub</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.displayName}</div>
                    <div className="text-xs text-muted-foreground">{p.id}</div>
                  </td>
                  <td className="px-4 py-3">{p.countryCode}</td>
                  <td className="px-4 py-3">{p.stripeTier}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{p.acquisitionMode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={hubHref(p.countrySlug, p.roleTrack, p.examCode)}
                      className="text-primary underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open hub
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        Per-user entitlements still come from Stripe + <code className="rounded bg-muted px-1">User</code> fields—this table is the product catalog intent, not billing state.
      </p>
    </main>
  );
}
