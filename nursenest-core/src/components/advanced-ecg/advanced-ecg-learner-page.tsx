"use client";

import Link from "next/link";
import type { AdvancedEcgAccessDecision } from "@/lib/advanced-ecg/advanced-ecg-access";
import {
  ADVANCED_ECG_MODULE_CHECKOUT_ANCHOR,
  ADVANCED_ECG_MODULE_ENTITLEMENT,
  ADVANCED_ECG_PRICING_ANCHOR,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import type { AdvancedEcgCurriculumUnit } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

type AdvancedEcgLearnerPageProps = {
  access: AdvancedEcgAccessDecision;
  curriculum: readonly AdvancedEcgCurriculumUnit[];
};

function reasonHeading(reason: AdvancedEcgAccessDecision extends { ok: false; reason: infer R } ? R : never): string {
  switch (reason) {
    case "sign_in_required":
      return "Sign in to view Advanced ECG";
    case "module_unavailable":
      return "Advanced ECG is not published yet";
    case "base_subscription_required":
      return "Start with a base learner subscription";
    case "tier_not_eligible":
      return "Advanced ECG is currently scoped to RN and NP learners";
    default:
      return "Unlock Advanced ECG";
  }
}

function reasonBody(access: Extract<AdvancedEcgAccessDecision, { ok: false }>): string {
  switch (access.reason) {
    case "sign_in_required":
      return "Advanced ECG is a separate paid module. Sign in first, then add the module from pricing when you are ready.";
    case "module_unavailable":
      return "The dedicated Advanced ECG learner surface is still in admin or QA preview. Core ECG remains in the main learner ecosystem.";
    case "base_subscription_required":
      return "Advanced ECG rides on the learner platform but is not included in base exam subscriptions. Start a supported RN or NP base subscription first, then add the module separately.";
    case "tier_not_eligible":
      return "Advanced ECG is not exposed to RPN/PN or Allied pathways by default. It is designed for RN/NP, critical care, emergency, telemetry, and advanced practice interpretation.";
    default:
      return "Advanced ECG is a separate paid module. It is not included in base exam subscriptions and requires its own add-on purchase.";
  }
}

export function AdvancedEcgLearnerPage({ access, curriculum }: AdvancedEcgLearnerPageProps) {
  const unlocked = access.ok;

  return (
    <div className="space-y-6" data-nn-qa-advanced-ecg-page="">
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
              Advanced ECG Add-On
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
              Advanced ECG is a separate paid module.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Not included in base exam subscriptions. Designed for RN/NP, critical care, emergency, telemetry, and advanced practice ECG interpretation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">
                Dedicated entitlement: <code>{ADVANCED_ECG_MODULE_ENTITLEMENT}</code>
              </span>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Clinician-reviewed before learner exposure</span>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Separate from core ECG quizzes and renderer</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] p-4 lg:w-[22rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
              {unlocked ? "Learner access" : "Upgrade path"}
            </p>
            {unlocked ? (
              <>
                <p className="mt-2 text-lg font-semibold text-[var(--semantic-text-primary)]">
                  {access.mode === "admin-preview" ? "Admin preview mode" : "Advanced ECG unlocked"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {access.mode === "admin-preview"
                    ? "Previewing the dedicated add-on surface without exposing it to learners yet."
                    : "Your base learner account and Advanced ECG add-on are both active."}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-lg font-semibold text-[var(--semantic-text-primary)]">{reasonHeading(access.reason)}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{reasonBody(access)}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={access.reason === "sign_in_required" ? "/login?callbackUrl=%2Fmodules%2Fecg-advanced" : ADVANCED_ECG_PRICING_ANCHOR}
                    className={MARKETING_PRIMARY_CTA_CLASS}
                  >
                    {access.reason === "sign_in_required" ? "Sign in" : "View add-on pricing"}
                  </Link>
                  <Link href={ADVANCED_ECG_MODULE_CHECKOUT_ANCHOR} className={MARKETING_SECONDARY_CTA_CLASS}>
                    Review access requirements
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="upgrade" className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                Curriculum scaffold
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                Advanced ECG learner path
              </h3>
            </div>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
              {curriculum.length} units
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {curriculum.map((unit, index) => (
              <article
                key={unit.slug}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] p-4"
                data-nn-qa-advanced-ecg-unit={unit.slug}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                  Unit {index + 1}
                </p>
                <h4 className="mt-2 text-base font-semibold text-[var(--semantic-text-primary)]">{unit.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{unit.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
              Safety gates
            </p>
            <ul className="mt-3 space-y-3 text-sm text-[var(--semantic-text-secondary)]">
              <li>High-risk strips stay blocked until clinician review is recorded.</li>
              <li>Unsupported generated waveform content is not surfaced as learner-ready Advanced ECG.</li>
              <li>Core ECG CAT exclusions and existing RN/NP gating remain unchanged.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
              Separate purchase
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              This learner surface is intentionally separate from the core ECG hub. Standard RN, PN, NP, and Allied subscriptions do not unlock it automatically.
            </p>
            {!unlocked ? (
              <Link href={ADVANCED_ECG_PRICING_ANCHOR} className={`mt-4 inline-flex ${MARKETING_PRIMARY_CTA_CLASS}`}>
                Open pricing
              </Link>
            ) : null}
          </div>
        </aside>
      </section>
    </div>
  );
}
