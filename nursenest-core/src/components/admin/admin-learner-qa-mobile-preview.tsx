"use client";

import Link from "next/link";
import type { AdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";
import {
  ADMIN_LEARNER_QA_MOBILE_FLOW_LINKS,
  ADMIN_LEARNER_QA_MOBILE_VIEWPORT_PRESETS,
  adminLearnerQaMobilePreviewHref,
} from "@/lib/admin/admin-learner-qa-mobile-preview";

type Props = {
  initialPath: string;
  initialWidth: number;
  qaState: AdminLearnerQaPublicState | null;
  learnerStateLine: string;
};

/**
 * Same-origin iframe only — preserves session + `nn_admin_learner_qa` cookie for simulated learner checks.
 * Width is a QA chrome constraint only (not an emulator).
 */
export function AdminLearnerQaMobilePreview({ initialPath, initialWidth, qaState, learnerStateLine }: Props) {
  const path = initialPath;
  const widthPx = initialWidth;

  const presetLabel =
    ADMIN_LEARNER_QA_MOBILE_VIEWPORT_PRESETS.find((x) => x.widthPx === widthPx)?.label ?? `${widthPx}px (custom)`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="region"
        aria-label="Admin mobile viewport QA"
        className="mb-3 shrink-0 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-3 py-3 text-sm text-[var(--semantic-text-primary)] shadow-sm sm:px-4"
      >
        <p className="font-semibold leading-snug">Mobile viewport QA (admin only)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Same-origin iframe — your session and signed learner QA cookie apply inside the frame. This only constrains{" "}
          <strong>width</strong> for layout spot-checks; it is not a device or browser emulator.
        </p>
        <p className="mt-2 text-xs font-medium text-[var(--semantic-text-primary)]">
          <span className="text-muted-foreground">Learner simulation:</span> {learnerStateLine}
        </p>
        <p className="mt-1 text-xs font-medium text-[var(--semantic-text-primary)]">
          <span className="text-muted-foreground">Viewport preset:</span> {presetLabel} ({widthPx}px wide frame)
        </p>
        {qaState ? null : (
          <p className="mt-2 text-xs text-[var(--semantic-warning)]">
            No active learner QA cookie — the iframe still uses your staff session (live entitlements), not a simulated
            learner.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {ADMIN_LEARNER_QA_MOBILE_VIEWPORT_PRESETS.map((p) => (
            <Link
              key={p.id}
              href={adminLearnerQaMobilePreviewHref(path, p.widthPx)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium sm:text-sm ${
                widthPx === p.widthPx
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:bg-muted/50"
              }`}
            >
              {p.widthPx}px
            </Link>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link className="text-primary underline" href="/admin/learner-qa">
            ← Learner QA settings
          </Link>
          <Link className="text-primary underline" href={path}>
            Open this route full width (same tab)
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-auto rounded-xl border border-border bg-muted/15 p-2 sm:p-4">
        <div
          className="flex min-h-[min(85dvh,820px)] w-full max-w-full flex-col shadow-lg"
          style={{ width: widthPx, maxWidth: "100%" }}
        >
          <iframe
            title={`Learner preview ${widthPx}px — ${path}`}
            src={path}
            className="h-[min(85dvh,820px)] w-full flex-1 rounded-lg border border-border bg-[var(--semantic-surface)]"
          />
        </div>
      </div>

      <div className="mt-4 shrink-0 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">Jump to learner flow (keeps {widthPx}px width)</p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {ADMIN_LEARNER_QA_MOBILE_FLOW_LINKS.map((l) => (
            <li key={l.path}>
              <Link className="text-primary underline" href={adminLearnerQaMobilePreviewHref(l.path, widthPx)}>
                {l.label}
              </Link>
              {l.hint ? <span className="ml-1 text-xs text-muted-foreground">— {l.hint}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
