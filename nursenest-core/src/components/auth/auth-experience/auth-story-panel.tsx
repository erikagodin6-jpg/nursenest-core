import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AUTH_EDUCATIONAL_DISCLAIMER } from "@/components/auth/auth-experience/constants";

const TRUST_CHIPS = ["NCLEX-RN · RPN · NP", "Allied Health", "Study smarter"] as const;

const READINESS_TILES = [
  { value: "78%", label: "Readiness index" },
  { value: "12", label: "Day streak" },
  { value: "240", label: "Cards due" },
  { value: "CAT", label: "Next session" },
] as const;

/**
 * Desktop visual panel — Figma auth/sign-in (87:2) story column.
 */
export function AuthStoryPanel() {
  return (
    <aside className="nn-premium-auth-story" data-nn-premium-auth-story aria-label="NurseNest Study Ecosystem">
      <div className="nn-premium-auth-brand-row">
        <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
        <span className="nn-premium-auth-theme-pill">Sea Glass · Premium study</span>
      </div>
      <div className="nn-premium-auth-story-copy">
        <p className="nn-premium-auth-eyebrow">Adaptive NCLEX preparation</p>
        <h2>Calm focus for the shift ahead of your exam.</h2>
        <p>
          Built for nursing students. Personalized readiness tracking across lessons, flashcards, and CAT — one
          premium study loop.
        </p>
        <div className="nn-premium-auth-trust-chips" data-nn-premium-auth-trust-chips>
          {TRUST_CHIPS.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
      <div className="nn-premium-auth-readiness-preview" data-nn-premium-auth-readiness aria-label="Study readiness preview">
        {READINESS_TILES.map((tile) => (
          <div key={tile.label} className="nn-premium-auth-readiness-tile">
            <strong>{tile.value}</strong>
            <span>{tile.label}</span>
          </div>
        ))}
      </div>
      <p className="nn-premium-auth-disclaimer">{AUTH_EDUCATIONAL_DISCLAIMER}</p>
      <p className="nn-premium-auth-account-link">
        Account deletion is available after sign in from <Link href="/app/account/settings">Account Settings</Link>.
      </p>
    </aside>
  );
}
