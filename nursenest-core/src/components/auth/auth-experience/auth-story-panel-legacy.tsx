import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AUTH_EDUCATIONAL_DISCLAIMER } from "@/components/auth/auth-experience/constants";

const ecosystemItems = ["Lessons", "Flashcards", "Practice Exams", "CAT Readiness", "Report Cards"] as const;

/** Non-login auth routes until screen-specific Figma frames are implemented. */
export function AuthStoryPanelLegacy() {
  return (
    <aside className="nn-premium-auth-story" data-nn-premium-auth-story aria-label="NurseNest Study Ecosystem">
      <div className="nn-premium-auth-brand-row">
        <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
        <span className="nn-premium-auth-theme-pill">Sea Glass · Premium study</span>
      </div>
      <div className="nn-premium-auth-story-copy">
        <p className="nn-premium-auth-eyebrow">Trusted by nursing students</p>
        <h2>Calm, focused access to adaptive NCLEX readiness</h2>
        <p>
          Sign in once and return to the same premium study loop—lessons, flashcards, practice exams, and CAT sessions—without
          losing your pathway or momentum.
        </p>
      </div>
      <div className="nn-premium-auth-ecosystem-grid" data-nn-premium-auth-ecosystem>
        {ecosystemItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <p className="nn-premium-auth-disclaimer">{AUTH_EDUCATIONAL_DISCLAIMER}</p>
      <p className="nn-premium-auth-account-link">
        Account deletion is available after sign in from <Link href="/app/account/settings">Account Settings</Link>.
      </p>
    </aside>
  );
}
