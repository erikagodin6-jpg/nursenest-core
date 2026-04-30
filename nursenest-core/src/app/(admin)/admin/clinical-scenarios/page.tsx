import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  AdminClinicalScenarioCreateDraftForm,
} from "@/components/admin/admin-clinical-scenario-tools";
import { listClinicalNursingScenariosForAdmin } from "@/lib/clinical-scenarios/clinical-nursing-scenarios.server";
import { listExamPathways } from "@/lib/exam-pathways";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export default async function AdminClinicalScenariosPage({ searchParams }: PageProps) {
  await requireAdmin();
  const sp = await searchParams;
  const rawPid = sp.pathwayId;
  const pathwayFilter =
    typeof rawPid === "string" && rawPid.trim()
      ? rawPid.trim()
      : Array.isArray(rawPid) && typeof rawPid[0] === "string" && rawPid[0].trim()
        ? rawPid[0].trim()
        : undefined;

  const rows = await listClinicalNursingScenariosForAdmin({ pathwayId: pathwayFilter });
  const pathwayOptions = listExamPathways().map((p) => ({ id: p.id, title: p.displayName }));

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">Clinical scenarios</h1>
          <p className="mt-1 text-sm text-[var(--theme-body-text)]">
            Unpublished case engine — admin and staff preview only until{" "}
            <code className="rounded bg-[var(--bg-muted)] px-1">NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS</code> is enabled.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
          ← Admin home
        </Link>
      </div>

      <AdminClinicalScenarioCreateDraftForm pathwayOptions={pathwayOptions} />

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Scenarios</h2>
          <form className="flex flex-wrap items-end gap-2" method="get" action="/admin/clinical-scenarios">
            <label className="text-xs font-medium text-[var(--semantic-text-primary)]">
              Filter pathway
              <select
                name="pathwayId"
                defaultValue={pathwayFilter ?? ""}
                className="mt-1 block min-w-[220px] rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 px-2 py-2 text-sm"
              >
                <option value="">All (recent)</option>
                {pathwayOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
            >
              Apply
            </button>
          </form>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-[var(--theme-body-text)]">No scenarios yet. Create a draft above.</p>
        ) : (
          <ul className="divide-y divide-[var(--semantic-border-soft)] rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)]">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <Link
                    href={`/admin/clinical-scenarios/${encodeURIComponent(r.id)}`}
                    className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    {r.title}
                  </Link>
                  <p className="text-xs text-[var(--theme-body-text)]">
                    {r.pathwayId} · {r.tierFocus} · {r.difficulty} · {r.publishStatus} · {r._count.stages} stage(s)
                  </p>
                </div>
                <span className="text-xs text-[var(--semantic-chart-3)]">{r.canonicalCategoryId}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
