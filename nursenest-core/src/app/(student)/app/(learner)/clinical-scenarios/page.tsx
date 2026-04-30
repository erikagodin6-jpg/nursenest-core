import Link from "next/link";
import { notFound } from "next/navigation";
import { ClinicalScenarioUnfoldingPreview } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";
import { ClinicalScenariosSurfaceClient } from "@/components/scenarios/clinical-scenarios-surface-client";
import { ScenarioStudyShell } from "@/components/scenarios/ScenarioStudyShell";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession } from "@/lib/auth/staff-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { mapClinicalNursingScenarioToPreview } from "@/lib/clinical-scenarios/map-clinical-scenario-to-preview";
import {
  getClinicalNursingScenarioDetailForViewer,
  listClinicalNursingScenariosForLearnerCatalog,
} from "@/lib/clinical-scenarios/clinical-nursing-scenarios.server";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { pathwayIdFromScenarioSearchParams } from "@/lib/scenarios/scenario-search-params";
import {
  SCENARIO_LEARNER_ROUTES,
  withScenarioPathwayAndProfessionQuery,
  withScenarioPathwayQuery,
} from "@/lib/scenarios/scenario-routes";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";

type PageProps = {
  searchParams: Promise<{
    pathwayId?: string | string[];
    scenarioId?: string | string[];
    alliedProfession?: string | string[];
  }>;
};

export default async function ClinicalScenariosPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromScenarioSearchParams(searchParams);
  const sp = await searchParams;
  const rawSid = sp.scenarioId;
  const scenarioId =
    typeof rawSid === "string" && rawSid.trim()
      ? rawSid.trim()
      : Array.isArray(rawSid) && typeof rawSid[0] === "string" && rawSid[0].trim()
        ? rawSid[0].trim()
        : null;

  const rawAllied = sp.alliedProfession;
  const alliedProfessionParam =
    typeof rawAllied === "string" && rawAllied.trim()
      ? rawAllied.trim().toLowerCase()
      : Array.isArray(rawAllied) && typeof rawAllied[0] === "string" && rawAllied[0].trim()
        ? rawAllied[0].trim().toLowerCase()
        : "";
  const alliedProfessionResolved =
    pathwayId && isAlliedMarketingCorePathwayId(pathwayId) && alliedProfessionParam
      ? getAlliedProfessionByProfessionKey(alliedProfessionParam)
      : undefined;
  const alliedProfessionKey = alliedProfessionResolved?.professionKey ?? "";

  const staff = await getStaffSession();
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-scenarios");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = userId ? await resolveEntitlementForPage(userId) : "error";
  const premiumUnlocked = entitlement !== "error" && entitlement.hasAccess;
  /** Drafts never ship to subscribers; staff preview only (layout already blocks non-staff when flag is off). */
  const includeDrafts = Boolean(staff);

  if (pathwayId) {
    const categoryFilter = alliedProfessionResolved?.scenarioCatalogCategoryIds;
    const catalog = await listClinicalNursingScenariosForLearnerCatalog({
      pathwayId,
      includeDraftsForStaff: includeDrafts,
      ...(categoryFilter?.length ? { canonicalCategoryIds: categoryFilter } : {}),
    });

    if (scenarioId) {
      const detail = await getClinicalNursingScenarioDetailForViewer({
        id: scenarioId,
        viewerMaySeeDrafts: includeDrafts,
      });
      if (!detail || detail.pathwayId !== pathwayId) notFound();
      const model = mapClinicalNursingScenarioToPreview(detail);
      return (
        <ScenarioStudyShell
          eyebrow="Clinical scenarios (preview)"
          title={detail.title}
          subtitle="Admin-only unpublished case engine — vitals, labs, staged judgment checks, and trajectory feedback."
          pathwayId={pathwayId}
        >
          <div className="mb-4 text-sm">
            <Link
              href={withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathwayId)}
              className="text-[var(--semantic-brand)] underline-offset-2 hover:underline"
            >
              ← Back to list
            </Link>
          </div>
          <ClinicalScenarioUnfoldingPreview scenario={model} premiumUnlocked={premiumUnlocked || includeDrafts} />
        </ScenarioStudyShell>
      );
    }

    if (catalog.length > 0) {
      return (
        <ScenarioStudyShell
          eyebrow="Clinical scenarios"
          title="Case-based judgment (catalog)"
          subtitle="Select a scenario to preview the unfolding case. Drafts are visible to staff only until publishing is enabled for learners."
          pathwayId={pathwayId}
        >
          <ul className="space-y-2">
            {catalog.map((c) => (
              <li key={c.id}>
                <Link
                  href={(() => {
                    const base = withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathwayId);
                    const join = base.includes("?") ? "&" : "?";
                    return `${base}${join}scenarioId=${encodeURIComponent(c.id)}`;
                  })()}
                  className="block rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))]"
                >
                  {c.title}{" "}
                  <span className="text-xs font-normal text-[var(--theme-body-text)]">
                    · {c.publishStatus} · {c.tierFocus}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </ScenarioStudyShell>
      );
    }
  }

  const showDevSamples =
    process.env.NODE_ENV !== "production" && isClinicalScenariosPubliclyEnabled() && Boolean(staff);
  return (
    <ClinicalScenariosSurfaceClient
      pathwayId={pathwayId}
      showDevSamples={showDevSamples}
      alliedProfessionKey={alliedProfessionKey || null}
    />
  );
}
