"use client";

import { difficultyBandLabel } from "@/lib/questions/difficulty-label";

function miniBars(values: number[]) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 0.001);
  return (
    <div className="nn-premium-cat-transparency-bars flex h-8 items-end gap-0.5" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={`nn-premium-cat-transparency-bar nn-premium-cat-transparency-bar--${(i % 4) + 1} w-1.5 min-h-[3px] rounded-sm`}
          style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Optional, non-intrusive CAT telemetry (does not change selection or scoring).
 */
export function CatLiveTransparencyStrip({
  difficultyTail,
  theta,
  se,
  show,
  onToggle,
}: {
  difficultyTail: number[];
  theta: number | null;
  se: number | null;
  show: boolean;
  onToggle: (next: boolean) => void;
}) {
  const tail = difficultyTail.slice(-12);
  const lastD = tail.length ? tail[tail.length - 1] : null;

  return (
    <div
      className="nn-premium-cat-transparency-strip rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_38%,var(--semantic-surface))] px-3 py-2 text-xs text-[var(--semantic-text-primary)]"
      data-nn-qa-cat-live-transparency
    >
      <label className="flex cursor-pointer items-center gap-2 font-medium text-[var(--semantic-text-primary)]">
        <input
          type="checkbox"
          className="size-3.5 rounded border-[var(--semantic-border-soft)] text-[var(--semantic-brand)] accent-[var(--semantic-brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
          checked={show}
          onChange={(e) => onToggle(e.target.checked)}
        />
        Show live calibration (difficulty trend · θ band)
      </label>
      {show ? (
        <div className="mt-2 flex flex-wrap items-end gap-4 text-[var(--semantic-text-secondary)]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Recent difficulties
            </p>
            {miniBars(tail)}
            {lastD != null && Number.isFinite(lastD) ? (
              <p className="mt-1 text-[11px]">
                Last:{" "}
                <span className="font-medium text-[var(--semantic-text-primary)]">{difficultyBandLabel(lastD)}</span>
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Ability estimate
            </p>
            <p className="mt-1 tabular-nums text-[var(--semantic-text-primary)]">
              θ {theta != null && Number.isFinite(theta) ? theta.toFixed(2) : "—"}
              {se != null && Number.isFinite(se) ? (
                <>
                  {" "}
                  · SE {se.toFixed(2)}
                </>
              ) : null}
            </p>
            <p className="mt-0.5 max-w-[14rem] text-[10px] leading-snug text-[var(--semantic-text-secondary)]">
              Same engine as results. This is optional context while you test.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
