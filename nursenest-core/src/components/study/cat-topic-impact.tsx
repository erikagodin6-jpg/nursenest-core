export type TopicWithAccuracy = {
  topic: string;
  correct: number;
  total: number;
};

type WeakDescriptor = "Major gap" | "Needs review" | "Inconsistent";
type StrengthDescriptor = "Reliable" | "Strong" | "Consistent";

function weakDescriptor(pct: number): WeakDescriptor {
  if (pct < 30) return "Major gap";
  if (pct < 50) return "Needs review";
  return "Inconsistent";
}

function strengthDescriptor(pct: number): StrengthDescriptor {
  if (pct >= 80) return "Reliable";
  if (pct >= 70) return "Strong";
  return "Consistent";
}

function TopicBar({
  topic,
  correct,
  total,
  fillClass,
  descriptorLabel,
}: {
  topic: string;
  correct: number;
  total: number;
  fillClass: string;
  descriptorLabel: string;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="nn-cat-topic-row">
      <span className="nn-cat-topic-row__name truncate" title={topic}>
        {topic}
      </span>
      <div
        className="nn-cat-topic-row__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${topic}: ${pct}%`}
      >
        <div
          className={`nn-cat-topic-row__fill ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="nn-cat-topic-descriptor">{descriptorLabel}</span>
    </div>
  );
}

/**
 * TopicImpactBars — renders both the "Weak Areas Holding You Back" and
 * "Current Strengths" sections with horizontal bar rows (spec §5, §6).
 *
 * Each section uses a distinct surface tone:
 * - Weak areas → subtle warm (nn-cat-section-weak)
 * - Strengths → subtle positive (nn-cat-section-strength)
 */
export function TopicImpactBars({
  weakTopics,
  strengthTopics,
}: {
  weakTopics: TopicWithAccuracy[];
  strengthTopics: TopicWithAccuracy[];
}) {
  return (
    <>
      {/* ── Weak Areas ───────────────────────────────────────── */}
      <div className="nn-cat-results__section">
        <h2 className="nn-cat-results__section-title">
          Weak Areas Holding You Back
        </h2>
        <div className="nn-cat-section-weak">
          {weakTopics.length > 0 ? (
            <>
              <p className="nn-cat-section-intro">
                These topics had the biggest impact on your readiness score.
              </p>
              {weakTopics.map(({ topic, correct, total }) => {
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                return (
                  <TopicBar
                    key={topic}
                    topic={topic}
                    correct={correct}
                    total={total}
                    fillClass="nn-cat-topic-row__fill--muted"
                    descriptorLabel={weakDescriptor(pct)}
                  />
                );
              })}
            </>
          ) : (
            <p
              className="nn-cat-section-intro"
              style={{ marginBottom: 0 }}
            >
              No weak areas identified in this session.
            </p>
          )}
        </div>
      </div>

      {/* ── Strengths ────────────────────────────────────────── */}
      <div className="nn-cat-results__section">
        <h2 className="nn-cat-results__section-title">Current Strengths</h2>
        <div className="nn-cat-section-strength">
          {strengthTopics.length > 0 ? (
            <>
              <p className="nn-cat-section-intro">
                These areas are currently supporting your performance.
              </p>
              {strengthTopics.map(({ topic, correct, total }) => {
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                return (
                  <TopicBar
                    key={topic}
                    topic={topic}
                    correct={correct}
                    total={total}
                    fillClass="nn-cat-topic-row__fill--success"
                    descriptorLabel={strengthDescriptor(pct)}
                  />
                );
              })}
            </>
          ) : (
            <p
              className="nn-cat-section-intro"
              style={{ marginBottom: 0 }}
            >
              Not enough data to identify strong areas yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
