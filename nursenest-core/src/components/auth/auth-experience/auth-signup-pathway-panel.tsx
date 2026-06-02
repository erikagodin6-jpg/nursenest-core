"use client";

import type { SignupTierValue } from "@/lib/marketing/signup-exam-focus-options";

const PATHWAY_CARDS: { tier: SignupTierValue; label: string; sub: string }[] = [
  { tier: "RN", label: "RN", sub: "NCLEX-RN" },
  { tier: "RPN", label: "RPN", sub: "REx-PN" },
  { tier: "LVN_LPN", label: "LPN", sub: "NCLEX-PN" },
  { tier: "NP", label: "NP", sub: "Board prep" },
  { tier: "ALLIED", label: "Allied Health", sub: "Certifications" },
];

const PREVIEW_STRIP = [
  { title: "Readiness", detail: "Live mastery bands", pct: 72 },
  { title: "Flashcards", detail: "Adaptive decks", pct: 58 },
  { title: "CAT", detail: "Exam simulation", pct: 84 },
] as const;

export type AuthSignupPathwayPanelProps = {
  tier: SignupTierValue;
  onTierSelect: (tier: SignupTierValue) => void;
};

/**
 * Figma 87:15 left column — pathway aspiration + study previews.
 */
export function AuthSignupPathwayPanel({ tier, onTierSelect }: AuthSignupPathwayPanelProps) {
  return (
    <aside
      className="nn-premium-auth-signup-story"
      data-nn-premium-auth-signup-story
      aria-label="Choose your nursing pathway"
    >
      <div className="nn-premium-auth-signup-story-copy">
        <p className="nn-premium-auth-eyebrow">Start your pathway</p>
        <h2>Clinical mastery begins with one calm decision.</h2>
        <p>
          Join thousands preparing with adaptive intelligence — flashcards, CAT, and readiness analytics in one
          ecosystem.
        </p>
        <p className="nn-premium-auth-signup-story__supporting">
          New grad and pre-nursing learners can start with foundational RN study and adjust their focus during setup.
        </p>
        <p className="nn-premium-auth-eyebrow nn-premium-auth-signup-story__pathway-label">Choose your pathway</p>
      </div>

      <div className="nn-premium-auth-signup-pathway-grid" role="list" data-nn-auth-signup-pathways>
        {PATHWAY_CARDS.map((card) => {
          const selected = tier === card.tier;
          return (
            <button
              key={card.tier}
              type="button"
              role="listitem"
              className={`nn-premium-auth-signup-pathway-card${selected ? " is-selected" : ""}`}
              data-nn-auth-pathway-tier={card.tier}
              aria-pressed={selected}
              onClick={() => onTierSelect(card.tier)}
            >
              <strong>{card.label}</strong>
              <small>{card.sub}</small>
            </button>
          );
        })}
      </div>

      <div className="nn-premium-auth-signup-preview-strip" aria-label="Study mode previews">
        {PREVIEW_STRIP.map((item) => (
          <div key={item.title} className="nn-premium-auth-signup-preview-card">
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <div className="nn-premium-auth-signup-preview-bar" aria-hidden>
              <span style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
