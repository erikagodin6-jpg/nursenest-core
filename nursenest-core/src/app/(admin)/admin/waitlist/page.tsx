import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

export const dynamic = "force-dynamic";

function hubHref(countrySlug: string, roleTrack: string, examCode: string): string {
  return `/${countrySlug}/${roleTrack}/${examCode}`;
}

export default async function AdminWaitlistPage() {
  await requireAdmin();

  const waitlistOrUpcoming = EXAM_PATHWAYS.filter(
    (p) => p.acquisitionMode === "waitlist" || p.status === "upcoming",
  ).sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Programs</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Waitlist & upcoming pathways</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          There is no separate waitlist lead table in this schema yet—ops uses pathway <strong>acquisitionMode</strong> and{" "}
          <strong>status</strong> to drive CTAs. For email capture analytics, wire PostHog or export from your marketing tool. Use{" "}
          <Link className="font-semibold text-primary underline" href="/admin/users">
            Users
          </Link>{" "}
          for account-level review.
        </p>
      </div>

      {waitlistOrUpcoming.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No pathways are marked waitlist or upcoming in the registry.
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {waitlistOrUpcoming.map((p) => (
            <li key={p.id} className="nn-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">{p.displayName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.id} · {p.countryCode} · {p.stripeTier}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Status: <span className="font-medium text-foreground">{p.status}</span> · Acquisition:{" "}
                  <span className="font-medium text-foreground">{p.acquisitionMode}</span>
                </p>
                {p.internalNotes ? (
                  <p className="mt-2 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">{p.internalNotes}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={hubHref(p.countrySlug, p.roleTrack, p.examCode)}
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80"
                  target="_blank"
                  rel="noreferrer"
                >
                  View hub
                </Link>
                <Link
                  href="/admin/product-availability"
                  className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                >
                  Registry row
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
