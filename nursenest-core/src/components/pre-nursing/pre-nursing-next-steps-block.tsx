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
    <section className="nn-card mt-8 border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What comes after Pre-Nursing</h3>
        <span className="text-xs text-gray-700 dark:text-gray-300">Your hint: {hint === "unsure" ? "Not set yet" : prioritizedTitle}</span>
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
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
              className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 ${
                highlighted ? "border-primary dark:border-primary" : ""
              }`}
              onClick={() =>
                trackClientEvent(PH.preNursingPathwayCtaClicked, {
                  source_surface: sourceSurface,
                  selected_pathway_hint: hint,
                  destination_pathway: route.key,
                })
              }
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{route.title}</p>
              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{route.whoFor}</p>
              <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">{route.note}</p>
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
          Compare plans
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
          Browse exam lesson hubs
        </Link>
        {prioritizedHref ? (
          <Link href={prioritizedHref} className="text-gray-700 hover:text-primary hover:underline dark:text-gray-300">
            Open suggested pathway
          </Link>
        ) : null}
        {secondaryHref ? (
          <Link href={secondaryHref} className="text-gray-700 hover:text-primary hover:underline dark:text-gray-300">
            Canada RN option
          </Link>
        ) : null}
      </div>
    </section>
  );
}

