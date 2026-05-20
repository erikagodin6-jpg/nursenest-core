import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { ClinicalScenarioUnfoldingPreview } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";
import { AdminClinicalScenarioPublishForm } from "@/components/admin/admin-clinical-scenario-tools";
import { mapClinicalNursingScenarioToPreview } from "@/lib/clinical-scenarios/map-clinical-scenario-to-preview";
import { getClinicalNursingScenarioDetailForViewer } from "@/lib/clinical-scenarios/clinical-nursing-scenarios.server";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ scenarioId: string }> };

export default async function AdminClinicalScenarioDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { scenarioId: rawId } = await params;
  const scenarioId = rawId?.trim();
  if (!scenarioId) notFound();

  const row = await getClinicalNursingScenarioDetailForViewer({ id: scenarioId, viewerMaySeeDrafts: true });
  if (!row) notFound();

  const model = mapClinicalNursingScenarioToPreview(row);
  const base = withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, row.pathwayId);
  const join = base.includes("?") ? "&" : "?";
  const learnerPreviewHref = `${base}${join}scenarioId=${encodeURIComponent(row.id)}`;

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/admin/clinical-scenarios" className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
          ← All scenarios
        </Link>
        <Link href="/admin" className="text-[var(--theme-body-text)] underline-offset-2 hover:underline">
          Admin home
        </Link>
      </div>

      <AdminClinicalScenarioPublishForm
        scenarioId={row.id}
        initialPublishStatus={row.publishStatus}
        learnerPreviewHref={learnerPreviewHref}
      />

      <ClinicalScenarioUnfoldingPreview scenario={model} allowStaffFullPreview />
    </main>
  );
}
