import Link from "next/link";
import { CountryCode, TierCode } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminInventoryFilters } from "@/components/admin/admin-inventory-filters";
import { loadAdminPathwayInventory } from "@/lib/admin/load-admin-pathway-inventory";

export const dynamic = "force-dynamic";

function parseCountry(raw: string | undefined): CountryCode | "ALL" {
  if (raw === "US" || raw === "CA") return raw as CountryCode;
  return "ALL";
}

function parseTier(raw: string | undefined): TierCode | "ALL" {
  if (raw === "RPN" || raw === "LVN_LPN" || raw === "RN" || raw === "NP" || raw === "ALLIED") return raw as TierCode;
  return "ALL";
}

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ country?: string; tier?: string }>;
}) {
  await requireAdmin();
  const sp = (await searchParams) ?? {};
  const country = parseCountry(sp.country);
  const tier = parseTier(sp.tier);

  const { rows, degraded } = await loadAdminPathwayInventory({ country, tier });

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Inventory</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Pathway & bank inventory</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Published rows vs <strong className="font-semibold text-foreground">effective</strong> lesson totals (DB + catalog
            fallback via <code className="rounded bg-muted px-1">countPathwayLessons</code>). “≥150” follows the content scale
            target; “ready” also expects 200+ pathway-matched questions. Architecture supports 500+ lessons with bounded
            pagination.
          </p>
        </div>
        <Link href="/admin/analytics" className="text-sm font-semibold text-primary underline">
          Analytics hub →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <AdminInventoryFilters country={country === "ALL" ? "ALL" : country} tier={tier === "ALL" ? "ALL" : tier} />
        {degraded ? (
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
            Partial data: question coverage report failed for one dependency—refresh or check logs.
          </p>
        ) : null}
      </div>

      <section className="mt-8 nn-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pathway</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3 text-right">Pub (DB)</th>
                <th className="px-4 py-3 text-right">Effective</th>
                <th className="px-4 py-3 text-center">≥150</th>
                <th className="px-4 py-3 text-right">Draft</th>
                <th className="px-4 py-3 text-right">Questions</th>
                <th className="px-4 py-3">Readiness</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.pathwayId} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">{r.displayName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.countryCode}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.stripeTier}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.lessonsPublished}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.lessonsEffective}</td>
                  <td className="px-4 py-3 text-center">
                    {r.meetsLessonScaleTarget ? (
                      <span className="text-emerald-700 dark:text-emerald-300">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.lessonsDraft}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.questionsMatched}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.readiness === "ready"
                          ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                          : r.readiness === "partial"
                            ? "bg-amber-500/15 text-amber-900 dark:text-amber-100"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.readiness}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">APIs & drill-downs</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li>
            <Link className="text-primary underline" href="/api/admin/question-bank-coverage">
              GET question-bank-coverage
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/questions">
              Question admin UI →
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/lessons">
              Lesson admin UI →
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/content">
              Legacy coverage view →
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
