import type { ReactNode } from "react";

/**
 * Side-by-side or stacked summary cells — alternating soft tints, no ad-hoc borders.
 */
export function LearnerSegmentedBlock({
  columns = 1,
  segments,
}: {
  columns?: 1 | 2;
  segments: { id: string; label: ReactNode; children: ReactNode }[];
}) {
  return (
    <div className="nn-ls-segments" data-nn-ls-cols={columns === 2 ? "2" : "1"}>
      {segments.map((s) => (
        <div key={s.id} className="nn-ls-segment">
          <div className="nn-ls-segment__label">{s.label}</div>
          <div className="nn-ls-segment__body">{s.children}</div>
        </div>
      ))}
    </div>
  );
}
