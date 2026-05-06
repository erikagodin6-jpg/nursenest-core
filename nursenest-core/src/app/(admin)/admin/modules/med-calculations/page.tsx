import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import type { MedCalcCategoryInventoryRow } from "@/lib/med-calculations/med-calculations-engine";
import {
  listMedCalcCategoryInventoryRows,
  medCalcProductionReadiness,
} from "@/lib/med-calculations/med-calculations-engine";

export const dynamic = "force-dynamic";

export default async function AdminMedCalculationsModulesPage() {
  await requireAdmin();

  const rnRows = listMedCalcCategoryInventoryRows("rn");
  const pnRows = listMedCalcCategoryInventoryRows("pn");
  const npRows = listMedCalcCategoryInventoryRows("np");
  const rnReady = medCalcProductionReadiness("rn");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-med-calculations-modules">
      <div
        className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] p-4 text-sm text-[var(--semantic-text-primary)]"
        role="status"
      >
        <strong>Admin visibility only.</strong> Learner route <code className="rounded bg-[var(--semantic-surface-muted)] px-1">/app/med-calculations</code>{" "}
        is production; this page inventories content and realism checks for staff readiness reviews.
      </div>

      <header className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">Admin · Modules</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">Medication calculations</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Static lesson + question inventory per pathway tier track. Realism gate:{" "}
          <span className={rnReady.ok ? "font-semibold text-[var(--semantic-success)]" : "font-semibold text-[var(--semantic-danger)]"}>
            {rnReady.ok ? "RN corpus passes validateMedCalcInventory" : "RN corpus has open realism issues"}
          </span>
          .
        </p>
        {!rnReady.ok ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--semantic-danger)]">
            {rnReady.realismIssues.slice(0, 20).map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
            {rnReady.realismIssues.length > 20 ? <li>…and more</li> : null}
          </ul>
        ) : null}
      </header>

      <section className="mt-10 space-y-6">
        <InventoryTable title="RN track (default med-calc inventory)" rows={rnRows} />
        <InventoryTable title="PN / RPN track" rows={pnRows} />
        <InventoryTable title="NP track" rows={npRows} />
      </section>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/app/med-calculations" className="font-semibold text-[var(--semantic-brand)] underline">
          Open learner hub (requires sign-in)
        </Link>
        <Link href="/admin/modules" className="font-semibold text-[var(--semantic-brand)] underline">
          Back to hidden module previews
        </Link>
      </div>
    </main>
  );
}

function InventoryTable({ title, rows }: { title: string; rows: MedCalcCategoryInventoryRow[] }) {
  const qSum = rows.reduce((s, r) => s + r.questionCount, 0);
  const fSum = rows.reduce((s, r) => s + r.flashcardCount, 0);
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
      <h2 className="border-b border-[var(--semantic-border-soft)] px-4 py-3 text-sm font-semibold text-[var(--semantic-text-primary)]">
        {title}{" "}
        <span className="font-normal text-[var(--semantic-text-muted)]">
          ({rows.length} categories · {qSum} questions · {fSum} flashcard rows)
        </span>
      </h2>
      <table className="min-w-full text-left text-sm text-[var(--semantic-text-secondary)]">
        <thead className="bg-[var(--semantic-surface-muted)] text-xs uppercase tracking-wide text-[var(--semantic-text-muted)]">
          <tr>
            <th className="px-4 py-2 font-medium">Category</th>
            <th className="px-4 py-2 font-medium">Lessons</th>
            <th className="px-4 py-2 font-medium">Questions</th>
            <th className="px-4 py-2 font-medium">Flashcards</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.categorySlug} className="border-t border-[var(--semantic-border-soft)]">
              <td className="px-4 py-2 font-medium text-[var(--semantic-text-primary)]">{row.categoryTitle}</td>
              <td className="px-4 py-2">{row.lessonCount}</td>
              <td className="px-4 py-2">{row.questionCount}</td>
              <td className="px-4 py-2">{row.flashcardCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
