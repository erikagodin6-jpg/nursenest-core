"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import {
  examPrepHrefForHint,
  secondaryExamPrepHrefForHint,
  type PreNursingFuturePathwayHint,
} from "@/lib/pre-nursing/pre-nursing-conversion-links";

type PlanPayload = { preNursingFuturePathwayHint: string | null };

const ROUTES: Array<{
  key: PreNursingFuturePathwayHint;
  title: string;
  whoFor: string;
  note: string;
}> = [
  { key: "rn", title: "RN (NCLEX-RN)", whoFor: "Students targeting registered nurse licensing.", note: "US + Canada RN routes exist." },
  { key: "pn", title: "PN/LPN (NCLEX-PN)", whoFor: "Learners pursuing practical/vocational nursing in the US.", note: "Question banks and pathway lessons." },
  { key: "rpn", title: "RPN (REX-PN, Canada)", whoFor: "Canada-focused practical nursing pathways.", note: "Canada-sensitive progression guidance." },
  { key: "np", title: "NP", whoFor: "Nurses advancing toward practitioner-level exams.", note: "Advanced pathway hub and scoped prep." },
];

export function PreNursingNextStepsBlock({ sourceSurface }: { sourceSurface: "hub" | "module" | "study_plan" }) {
  const [hint, setHint] = useState<PreNursingFuturePathwayHint>("unsure");

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/learner/pre-nursing-plan", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as PlanPayload;
        const nextHint = data.preNursingFuturePathwayHint;
        if (nextHint && ["rn", "pn", "rpn", "np", "unsure"].includes(nextHint)) {
          setHint(nextHint as PreNursingFuturePathwayHint);
        }
      } catch {
        // leave as unsure
      }
    })();
  }, []);

  const prioritizedHref = examPrepHrefForHint(hint);
  const secondaryHref = secondaryExamPrepHrefForHint(hint);
  const prioritizedTitle = useMemo(() => ROUTES.find((r) => r.key === hint)?.title ?? "General exam prep", [hint]);

  return (
    <section className="nn-card mt-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">What comes after Pre-Nursing</h3>
        <span className="text-xs text-[var(--semantic-text-secondary)]">
          Your hint: {hint === "unsure" ? "Not set yet" : prioritizedTitle}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
        Pre-Nursing stays free. When you want exam-style prep, compare the pathways below and choose a route that matches your
        goal and location.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {ROUTES.map((route) => {
          const href = examPrepHrefForHint(route.key) ?? "/lessons";
          const highlighted = route.key === hint;
          return (
            <Link
              key={route.key}
              href={href}
              className={`rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-elevated)] p-4 shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface-elevated))] ${
                highlighted ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))]" : ""
              }`}
              onClick={() =>
                trackClientEvent(PH.preNursingPathwayCtaClicked, {
                  source_surface: sourceSurface,
                  selected_pathway_hint: hint,
                  destination_pathway: route.key,
                })
              }
            >
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{route.title}</p>
              <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{route.whoFor}</p>
              <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{route.note}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link
          href="/pricing"
          className="font-semibold text-primary hover:underline"
          onClick={() =>
            trackClientEvent(PH.preNursingComparePlansClicked, {
              source_surface: sourceSurface,
              selected_pathway_hint: hint,
            })
          }
        >
          Compare Plans
        </Link>
        <Link
          href="/lessons"
          className="font-semibold text-primary hover:underline"
          onClick={() =>
            trackClientEvent(PH.preNursingExamLessonsHubClicked, {
              source_surface: sourceSurface,
              selected_pathway_hint: hint,
            })
          }
        >
          Browse Exam Lesson Hubs
        </Link>
        {prioritizedHref ? (
          <Link
            href={prioritizedHref}
            className="font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)] hover:underline"
          >
            Open Suggested Pathway
          </Link>
        ) : null}
        {secondaryHref ? (
          <Link
            href={secondaryHref}
            className="font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)] hover:underline"
          >
            Canada RN option
          </Link>
        ) : null}
      </div>
    </section>
  );
}

