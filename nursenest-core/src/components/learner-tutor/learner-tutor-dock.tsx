"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, X } from "lucide-react";
import type { LearnerTutorShellContext } from "@/lib/learner/tutor/tutor-types";
import type { TutorIntentDefinition } from "@/lib/learner/tutor/tutor-types";
import { LearnerKickerHeading, LearnerNotePanel, LearnerSurface } from "@/components/learner-ui";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";

function IntentRow({
  def,
  t,
  onNavigate,
}: {
  def: TutorIntentDefinition;
  t: (key: string) => string;
  onNavigate: () => void;
}) {
  const label = t(def.labelKey);
  const detail = t(def.detailKey);
  const isLive = def.phase === "live" && def.href;

  if (isLive) {
    return (
      <Link
        href={def.href!}
        onClick={onNavigate}
        className="group flex flex-col gap-0.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-text-muted))] bg-[var(--semantic-surface)] px-3.5 py-3 text-left transition motion-safe:duration-150 hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
      >
        <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{label}</span>
        <span className="text-xs leading-snug text-[var(--semantic-text-secondary)]">{detail}</span>
      </Link>
    );
  }

  return (
    <div
      className="flex flex-col gap-0.5 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-surface))] px-3.5 py-3"
      aria-disabled="true"
    >
      <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{label}</span>
      <span className="text-xs leading-snug text-[var(--semantic-text-muted)]">{detail}</span>
    </div>
  );
}

/**
 * **Current:** opens a calm side sheet with **navigation intents** + visibly **planned** AI rows (no chat, no fake replies).
 *
 * **Future:** same component can call model routes using `context` + page-bound question ids (see `TutorSessionBinder` TODO in module).
 */
export function LearnerTutorDock({ context, intents }: { context: LearnerTutorShellContext; intents: TutorIntentDefinition[] }) {
  const { t } = useMarketingI18n();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const live = intents.filter((i) => i.phase === "live");
  const planned = intents.filter((i) => i.phase === "planned");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
  }, [open]);

  const trackOpen = () => {
    trackClientEvent(PH.learnerNavClick, {
      actor: "authenticated",
      nav_id: "learner_tutor_open",
      surface: "learner_tutor_dock",
      country: readMarketingRegionFromDocument(),
      pathway_id: context.pathwayId ?? "",
    });
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) trackOpen();
        }}
        className="nn-ls-tutor-fab fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] transition motion-safe:duration-200 motion-safe:hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--semantic-bg-base)]"
        title={t("learner.tutor.fab.label")}
      >
        <BookOpenCheck className="h-6 w-6" aria-hidden />
        <span className="sr-only">{t("learner.tutor.fab.label")}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[59] flex justify-end" role="presentation">
          <button
            type="button"
            aria-label={t("learner.tutor.backdropClose")}
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-text-primary)_18%,transparent)] backdrop-blur-[2px]"
            onClick={close}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[61] flex h-full w-full max-w-md flex-col border-l border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[var(--semantic-bg-base)] shadow-[var(--semantic-shadow-soft)] motion-safe:animate-[nn-tutor-panel-in_0.22s_ease-out_both]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] px-5 py-4">
              <LearnerKickerHeading
                id={titleId}
                kicker={t("learner.tutor.panel.kicker")}
                title={t("learner.tutor.panel.title")}
                intro={
                  context.pathwayLabel
                    ? t("learner.tutor.panel.introWithPath", { path: context.pathwayLabel })
                    : t("learner.tutor.panel.introGeneric")
                }
              />
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-transparent p-2 text-[var(--semantic-text-muted)] transition hover:border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-surface)] hover:text-[var(--semantic-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]"
                aria-label={t("learner.tutor.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <LearnerNotePanel tone="info" className="mb-6">
                {t("learner.tutor.panel.trustNote")}
              </LearnerNotePanel>

              <p className="nn-dash-section-label mb-2">{t("learner.tutor.section.live")}</p>
              <div className="space-y-2">
                {live.map((def) => (
                  <IntentRow key={def.id} def={def} t={t} onNavigate={close} />
                ))}
              </div>

              <p className="nn-dash-section-label mb-2 mt-8">{t("learner.tutor.section.planned")}</p>
              <LearnerSurface tone="secondary" padding="sm" radius="lg" shadow={false} className="space-y-2">
                {planned.map((def) => (
                  <IntentRow key={def.id} def={def} t={t} onNavigate={close} />
                ))}
              </LearnerSurface>

              <p className="mt-6 text-[11px] leading-relaxed text-[var(--semantic-text-muted)]">{t("learner.tutor.panel.footer")}</p>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes nn-tutor-panel-in {
          from {
            opacity: 0.85;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
