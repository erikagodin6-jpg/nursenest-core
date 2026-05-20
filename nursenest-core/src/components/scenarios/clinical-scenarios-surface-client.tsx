"use client";

import { useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getPathwayBodySystemGroups } from "@/lib/learner-study-hub/body-system-data";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import {
  devSampleClinicalScenarios,
  filterDevSampleClinicalScenariosByProfession,
} from "@/lib/scenarios/dev-sample-scenario-content";
import { ScenarioStudyShell } from "@/components/scenarios/ScenarioStudyShell";
import { ScenarioCategorySelector } from "@/components/scenarios/ScenarioCategorySelector";
import { ClinicalScenarioCard } from "@/components/scenarios/ClinicalScenarioCard";
import { ScenarioRationalePanel } from "@/components/scenarios/ScenarioRationalePanel";
import { ScenarioEmptyState } from "@/components/scenarios/ScenarioEmptyState";
import { isNursingPathwayForScenarioSurfaces } from "@/lib/scenarios/scenario-pathway-guard";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import Link from "next/link";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

export function ClinicalScenariosSurfaceClient({
  pathwayId,
  showDevSamples,
  alliedProfessionKey = null,
}: {
  pathwayId: string | null;
  showDevSamples: boolean;
  /** When set on allied pathways, dev previews and copy reference this occupation only. */
  alliedProfessionKey?: string | null;
}) {
  const { t } = useMarketingI18n();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const groups = useMemo(() => getPathwayBodySystemGroups(pathwayId), [pathwayId]);
  const alliedCore = Boolean(pathwayId && isAlliedMarketingCorePathwayId(pathwayId));
  const profKey = alliedProfessionKey?.trim().toLowerCase() ?? "";
  const rawSamples = showDevSamples ? devSampleClinicalScenarios() : [];
  const scenarios = useMemo(
    () => (alliedCore && profKey ? filterDevSampleClinicalScenariosByProfession(rawSamples, profKey) : rawSamples),
    [alliedCore, profKey, rawSamples],
  );
  const nursing = isNursingPathwayForScenarioSurfaces(pathwayId);

  const labelFor = (id: string) => CANONICAL_STUDY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  const filtered = useMemo(() => {
    if (!categoryId) return scenarios;
    return scenarios.filter((s) => s.categoryId === categoryId);
  }, [scenarios, categoryId]);

  const questionsPreviewHref = useMemo(() => {
    if (!pathwayId?.trim()) return loginWithCallback("/app/questions");
    const q = new URLSearchParams({ pathwayId: pathwayId.trim(), preset: "pathway_mixed" });
    if (profKey) q.set("alliedProfession", profKey);
    return loginWithCallback(`/app/questions?${q.toString()}`);
  }, [pathwayId, profKey]);

  if (alliedCore && profKey) {
    return (
      <ScenarioStudyShell
        eyebrow="Clinical scenarios"
        title="Judgment previews for your allied track"
        subtitle="Published unfolding cases roll out on nursing pathways first. For your occupation, we surface dev layout previews only in staff builds, and always link scenario-style practice back into the question bank."
        pathwayId={pathwayId}
        qaHubMarker
      >
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Scenario-style stems and branching rationales live in the pathway-scoped question bank. Open practice with your
          track preserved in the URL.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={questionsPreviewHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-[var(--semantic-brand-contrast)]"
          >
            Open question bank
          </Link>
        </div>
        {showDevSamples && filtered.length > 0 ? (
          <>
            <ScenarioCategorySelector groups={groups} value={categoryId} onChange={setCategoryId} />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filtered.map((s) => (
                <ClinicalScenarioCard
                  key={s.id}
                  title={s.title}
                  categoryLabel={labelFor(s.categoryId)}
                  summary={s.summary}
                  badges={["Dev preview", "Allied track", "Layout only"]}
                />
              ))}
            </div>
          </>
        ) : showDevSamples ? (
          <div className="mt-6">
            <ScenarioEmptyState
              title="No dev previews for this filter"
              description="Try another body-system filter, or open the question bank for scenario-style items in your lane."
            />
          </div>
        ) : null}
        <ScenarioRationalePanel
          title="Teaching points"
          body="When authored allied scenarios publish, they will list here with the same catalog shell as nursing tracks — still one scenario entity per case, filtered by occupation metadata."
        />
      </ScenarioStudyShell>
    );
  }

  if (!nursing) {
    return (
      <ScenarioStudyShell
        eyebrow="Clinical scenarios"
        title="Not available for this pathway yet"
        subtitle="Unfolding cases, vitals/labs, nursing priorities, and SBAR practice will ship for nursing tiers first."
        pathwayId={pathwayId}
      >
        <ScenarioEmptyState
          title="No scenarios for this track"
          description="Choose an RN, PN/RPN, NP, or New Grad nursing pathway to preview the shell when it is enabled."
        />
      </ScenarioStudyShell>
    );
  }

  return (
    <ScenarioStudyShell
      eyebrow={t("learner.shell.nav.clinicalScenarios")}
      title={t("components.examPathwayHub.premiumModules.clinicalScenariosHubTitle")}
      subtitle={t("components.examPathwayHub.premiumModules.clinicalScenariosHubBody")}
      pathwayId={pathwayId}
      qaHubMarker
    >
      <ScenarioCategorySelector groups={groups} value={categoryId} onChange={setCategoryId} />
      {filtered.length === 0 ? (
        <ScenarioEmptyState
          title="No scenarios in this filter"
          description="When the content pipeline publishes scenarios, they will appear here grouped by the same canonical body-system model as lessons and practice."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <ClinicalScenarioCard
              key={s.id}
              title={s.title}
              categoryLabel={labelFor(s.categoryId)}
              summary={s.summary}
              badges={["Vitals & labs", "SBAR", "Red flags"]}
            />
          ))}
        </div>
      )}
      <ScenarioRationalePanel title="Teaching points" body="Intervention rationales and escalation criteria render here from authored scenario data." />
    </ScenarioStudyShell>
  );
}
