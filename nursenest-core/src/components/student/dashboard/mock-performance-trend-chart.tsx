import type { RecentMock } from "@/lib/learner/load-learner-dashboard";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

const MAX_POINTS = 8;
const MIN_QUESTIONS = 5;

/**
 * Line chart of mock exam scores over time (oldest → newest). Uses real attempts only; needs 2+ comparable mocks.
 */
export function MockPerformanceTrendChart({
  mocks,
  t,
}: {
  mocks: RecentMock[];
  t: LearnerMarketingT;
}) {
  const usable = mocks
    .filter((m) => m.total >= MIN_QUESTIONS)
    .slice(0, MAX_POINTS)
    .reverse();

  if (usable.length < 2) {
    return (
      <div className="rounded-xl border border-dashed border-[color-mix(in_srgb,var(--semantic-info)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] px-4 py-5 text-center">
        <p className="text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.performanceTrend.chartEmpty")}</p>
      </div>
    );
  }

  const w = 320;
  const h = 88;
  const padL = 36;
  const padR = 8;
  const padT = 10;
  const padB = 22;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const n = usable.length;
  const xAt = (i: number) => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (pct: number) => padT + innerH - (Math.min(100, Math.max(0, pct)) / 100) * innerH;

  const points = usable.map((m, i) => ({ x: xAt(i), y: yAt(m.pct), pct: m.pct, at: m.at }));
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  const ariaPts = usable
    .map((m) => `${m.pct}% on ${new Date(m.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`)
    .join("; ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full min-w-[260px] max-h-[110px]"
        role="img"
        aria-label={t("learner.dashboard.performanceTrend.chartAria", { points: ariaPts })}
      >
        <title>{t("learner.dashboard.performanceTrend.chartTitle")}</title>
        {/* Grid */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = yAt(pct);
          return (
            <g key={pct}>
              <line
                x1={padL}
                x2={w - padR}
                y1={y}
                y2={y}
                stroke="var(--semantic-border-soft)"
                opacity={pct === 0 || pct === 100 ? 0.55 : 0.35}
                strokeWidth={pct === 0 || pct === 100 ? 1.2 : 0.75}
                strokeDasharray={pct === 0 || pct === 100 ? "0" : "4 5"}
              />
              <text x={padL - 4} y={y + 3} textAnchor="end" fill="var(--semantic-text-muted)" style={{ fontSize: 9 }}>
                {pct}
              </text>
            </g>
          );
        })}
        {/* Line */}
        <path
          d={d}
          fill="none"
          stroke="var(--semantic-info)"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Points */}
        {points.map((p, i) => (
          <g key={`${p.at}-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              className="fill-[var(--semantic-surface)] stroke-[var(--semantic-info)]"
              strokeWidth={2}
            />
            <circle cx={p.x} cy={p.y} r={2} className="fill-[var(--semantic-info)]" />
          </g>
        ))}
        {/* X labels */}
        {(n <= 4 ? usable.map((_, i) => i) : [0, Math.floor((n - 1) / 2), n - 1]).map((i) => (
          <text
            key={i}
            x={xAt(i)}
            y={h - 4}
            textAnchor="middle"
            fill="var(--semantic-text-secondary)"
            style={{ fontSize: 9 }}
          >
            {new Date(usable[i]!.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </text>
        ))}
      </svg>
      <p className="mt-1 text-[10px] text-[var(--semantic-text-muted)]">{t("learner.dashboard.performanceTrend.chartHint")}</p>
    </div>
  );
}
