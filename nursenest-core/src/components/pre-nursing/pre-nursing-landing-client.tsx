"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Sparkles } from "lucide-react";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";

const dict = strings as Record<string, string>;

export function PreNursingLandingClient() {
  return (
    <>
      <header className="mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-[var(--theme-card-bg)] to-emerald-500/[0.05] px-6 py-10 sm:px-10">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden />
            {dict["preNursing.badge"] ?? "Pre-Nursing"} · Always free
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            {dict["preNursing.pageTitle"] ?? "Pre-Nursing Foundations"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--theme-body-text)]">
            Strengthen sciences, terminology, and clinical reasoning before you commit to NCLEX-style prep. These modules are
            free to use — <span className="font-medium text-foreground">no nursing subscription required</span> — so you can
            build habits first and add a paid exam pathway when the timing is right.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            When you’re ready for full question banks and timed practice, NurseNest exam prep plans pick up where this
            foundation leaves off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pre-nursing/lessons"
              className="nn-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold shadow-sm"
              data-testid="link-pre-nursing-lessons"
              onClick={() => trackClientEvent(PH.preNursingNextModuleClicked, { source_surface: "hub", cta_type: "start_lessons" })}
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Start free lessons
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/pre-nursing/study-plan"
              className="nn-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              onClick={() => trackClientEvent(PH.preNursingStudyPlanViewed, { source_surface: "hub", cta_type: "set_readiness_target" })}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Set a readiness target
            </Link>
            <Link
              href="/tools/med-math"
              className="nn-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              onClick={() =>
                trackClientEvent(PH.preNursingPathwayCtaClicked, { source_surface: "hub", cta_type: "med_math_tools" })
              }
            >
              Med math tools
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRE_NURSING_MODULE_REGISTRY.map((m) => (
          <Link
            key={m.slug}
            href={`/pre-nursing/lessons/${m.slug}`}
            className="nn-card nn-card-interactive group flex flex-col p-5"
            data-testid={`pre-nursing-card-${m.slug}`}
            onClick={() =>
              trackClientEvent(PH.preNursingModuleViewed, {
                source_surface: "hub",
                module_slug: m.slug,
                cta_type: "module_card",
              })
            }
          >
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)] group-hover:text-primary">
              {dict[m.titleKey] ?? m.slug}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">{dict[m.subtitleKey] ?? ""}</p>
            <p className="mt-3 text-xs font-medium text-primary">
              {m.lessons} {dict["preNursing.interactiveLessons"] ?? "interactive lessons"}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
