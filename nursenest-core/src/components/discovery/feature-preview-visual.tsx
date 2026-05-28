import type { FlagshipExperience } from "@/lib/discovery/flagship-experiences";

export function FeaturePreviewVisual({ kind }: { kind: FlagshipExperience["previewKind"] }) {
  if (kind === "telemetry") {
    return (
      <div className="nn-feature-preview nn-feature-preview--telemetry" aria-hidden>
        <span className="nn-feature-preview__label">Lead II · live strip</span>
        <svg viewBox="0 0 320 86" role="img" focusable="false">
          <path d="M0 48 H38 L45 47 L52 50 L57 15 L62 68 L68 48 H112 L120 46 L126 51 L132 19 L138 66 L144 48 H196 L204 47 L211 51 L216 22 L222 64 L228 48 H320" />
        </svg>
      </div>
    );
  }

  if (kind === "assignment") {
    return (
      <div className="nn-feature-preview nn-feature-preview--assignment" aria-hidden>
        {[
          ["412", "new confusion", "urgent"],
          ["418", "post-op pain", "stable"],
          ["421", "glucose falling", "watch"],
        ].map(([room, cue, state]) => (
          <span key={room} className="nn-feature-preview__patient">
            <strong>Room {room}</strong>
            <small>{cue}</small>
            <em>{state}</em>
          </span>
        ))}
      </div>
    );
  }

  if (kind === "labs") {
    return (
      <div className="nn-feature-preview nn-feature-preview--bars" aria-hidden>
        {["K+", "Cr", "WBC", "Lactate"].map((label, index) => (
          <span key={label}>
            <small>{label}</small>
            <i style={{ width: `${45 + index * 13}%` }} />
          </span>
        ))}
      </div>
    );
  }

  if (kind === "skills") {
    return (
      <div className="nn-feature-preview nn-feature-preview--skills" aria-hidden>
        {["Verify", "Assess", "Perform", "Escalate"].map((label, index) => (
          <span key={label}>
            <strong>{index + 1}</strong>
            <small>{label}</small>
          </span>
        ))}
      </div>
    );
  }

  if (kind === "analytics") {
    return (
      <div className="nn-feature-preview nn-feature-preview--analytics" aria-hidden>
        <span><strong>82%</strong><small>readiness</small></span>
        <span><strong>4</strong><small>weak patterns</small></span>
        <span><strong>12</strong><small>due reviews</small></span>
      </div>
    );
  }

  if (kind === "flashcards") {
    return (
      <div className="nn-feature-preview nn-feature-preview--flashcards" aria-hidden>
        <span>What changed the priority?</span>
        <span>Which finding requires escalation?</span>
        <span>Why was delegation unsafe?</span>
      </div>
    );
  }

  if (kind === "med-math") {
    return (
      <div className="nn-feature-preview nn-feature-preview--math" aria-hidden>
        <span>Heparin 18 units/kg/hr</span>
        <strong>Hold? verify? administer?</strong>
        <small>Safety range + double-check</small>
      </div>
    );
  }

  return (
    <div className="nn-feature-preview nn-feature-preview--branching" aria-hidden>
      <span>Assess</span>
      <i />
      <span>Intervene</span>
      <i />
      <span>Reassess</span>
    </div>
  );
}
