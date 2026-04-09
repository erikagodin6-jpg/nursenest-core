"use client";

import { difficultyBandLabel } from "@/lib/questions/difficulty-label";

function miniBars(values: number[]) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 0.001);
  return (
    <div className="flex h-8 items-end gap-0.5" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm bg-primary/70"
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
    <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-xs">
      <label className="flex cursor-pointer items-center gap-2 font-medium text-foreground">
        <input
          type="checkbox"
          className="size-3.5 rounded border-border"
          checked={show}
          onChange={(e) => onToggle(e.target.checked)}
        />
        Show live calibration (difficulty trend · θ band)
      </label>
      {show ? (
        <div className="mt-2 flex flex-wrap items-end gap-4 text-muted-foreground">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide">Recent difficulties</p>
            {miniBars(tail)}
            {lastD != null && Number.isFinite(lastD) ? (
              <p className="mt-1 text-[11px]">
                Last: <span className="font-medium text-foreground">{difficultyBandLabel(lastD)}</span>
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide">Ability estimate</p>
            <p className="mt-1 tabular-nums text-foreground">
              θ {theta != null && Number.isFinite(theta) ? theta.toFixed(2) : "—"}
              {se != null && Number.isFinite(se) ? (
                <>
                  {" "}
                  · SE {se.toFixed(2)}
                </>
              ) : null}
            </p>
            <p className="mt-0.5 max-w-[14rem] text-[10px] leading-snug">
              Same engine as results — this is optional context while you test.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
