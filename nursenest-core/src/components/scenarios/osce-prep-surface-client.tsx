"use client";

import { useMemo, useState } from "react";
import { getPathwayBodySystemGroups } from "@/lib/learner-study-hub/body-system-data";
import { devSampleOsceStations } from "@/lib/scenarios/dev-sample-scenario-content";
import type { LegacyOsceStationListItem } from "@/lib/scenarios/legacy-osce-stations-runtime";
import { ScenarioStudyShell } from "@/components/scenarios/ScenarioStudyShell";
import { ScenarioCategorySelector } from "@/components/scenarios/ScenarioCategorySelector";
import { OsceStationCard } from "@/components/scenarios/OsceStationCard";
import { OsceChecklist } from "@/components/scenarios/OsceChecklist";
import { ScenarioRationalePanel } from "@/components/scenarios/ScenarioRationalePanel";
import { ScenarioEmptyState } from "@/components/scenarios/ScenarioEmptyState";
import { isNursingPathwayForScenarioSurfaces } from "@/lib/scenarios/scenario-pathway-guard";

function stationDetailHref(opts: {
  prefix: string;
  stationId: string;
  pathwayId: string | null;
  appendPathwayQuery: boolean;
}): string {
  const base = `${opts.prefix}${encodeURIComponent(opts.stationId)}`;
  if (!opts.appendPathwayQuery || !opts.pathwayId?.trim()) return base;
  const q = `pathwayId=${encodeURIComponent(opts.pathwayId.trim())}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

export function OscePrepSurfaceClient({
  pathwayId,
  showDevSamples,
  legacyListItems,
  stationDetailHrefPrefix,
  appendPathwayQueryOnDetailLinks = false,
}: {
  pathwayId: string | null;
  showDevSamples: boolean;
  /** Recovered legacy OSCE skill stations (serialized on the server). */
  legacyListItems: readonly LegacyOsceStationListItem[];
  /** e.g. `/app/osce/` or `/us/rn/nclex-rn/osce/` — station id is appended. */
  stationDetailHrefPrefix: string;
  appendPathwayQueryOnDetailLinks?: boolean;
}) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const groups = useMemo(() => getPathwayBodySystemGroups(pathwayId), [pathwayId]);
  const nursing = isNursingPathwayForScenarioSurfaces(pathwayId);

  const displayRows = useMemo((): LegacyOsceStationListItem[] => {
    if (legacyListItems.length > 0) return [...legacyListItems];
    if (showDevSamples) {
      return devSampleOsceStations().map((s) => ({
        id: s.id,
        title: s.title,
        family: s.family,
        minutes: s.minutes,
        meta: "Dev sample",
      }));
    }
    return [];
  }, [legacyListItems, showDevSamples]);

  const checklistItems = useMemo(
    () => [
      { id: "intro", label: "Introduce self and confirm patient identity" },
      { id: "wash", label: "Perform hand hygiene" },
      { id: "close", label: "Close loop: summarize plan and safety checks" },
    ],
    [],
  );

  if (!nursing) {
    return (
      <ScenarioStudyShell
        eyebrow="OSCE prep"
        title="Not available for this pathway yet"
        subtitle="OSCE prep is being rolled out for RN, PN/RPN, NP, and New Grad nursing tracks first."
        pathwayId={pathwayId}
      >
        <ScenarioEmptyState
          title="No stations for this track"
          description="Switch to a nursing pathway or check back after we extend OSCE prep to additional tracks."
        />
      </ScenarioStudyShell>
    );
  }

  const hasLegacy = legacyListItems.length > 0;

  return (
    <ScenarioStudyShell
      eyebrow="OSCE prep"
      title={hasLegacy ? "OSCE station library" : "Station library (shell)"}
      subtitle={
        hasLegacy
          ? "Recovered legacy skill stations: scenario stem, candidate instructions, patient script, examiner checklist items, step rationales, and critical fails — aligned to nursing pathways until per-tier splits ship."
          : "Timed station mode, checklist scoring, examiner feedback, and learner reflection will attach to authored stations. This page wires navigation, categories, and empty states only."
      }
      pathwayId={pathwayId}
    >
      {!hasLegacy ? (
        <ScenarioCategorySelector groups={groups} value={categoryId} onChange={setCategoryId} label="Filter by clinical area" />
      ) : null}
      {displayRows.length === 0 ? (
        <ScenarioEmptyState
          title="No published stations yet"
          description="Authoring tools and bank-backed stations will populate this library. Production stays empty until content ships."
          footnote={showDevSamples ? undefined : "Dev-only samples appear when NODE_ENV !== production and the public flag is on."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayRows.map((s) => (
            <OsceStationCard
              key={s.id}
              href={stationDetailHref({
                prefix: stationDetailHrefPrefix,
                stationId: s.id,
                pathwayId,
                appendPathwayQuery: appendPathwayQueryOnDetailLinks,
              })}
              title={s.title}
              family={s.family}
              minutes={s.minutes}
              meta={s.meta}
            />
          ))}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <OsceChecklist items={checklistItems} title="Sample examiner checklist (interactive shell)" />
        <ScenarioRationalePanel
          body={
            hasLegacy
              ? "Open a station to view full step-by-step rationales, critical steps, patient script, and examiner checklist items from the recovered legacy bank."
              : "Rationales and red lines will render from authored station JSON. This block demonstrates the panel layout only."
          }
        />
      </div>
    </ScenarioStudyShell>
  );
}
