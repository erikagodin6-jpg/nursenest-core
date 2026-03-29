import { useLocation, useParams } from "wouter";
import { useAuth } from "@/lib/auth";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdaptiveStudyHub } from "@/components/adaptive-study";

import { useI18n } from "@/lib/i18n";
const VALID_MODES = ["recommended", "weak-areas", "due-review", "flagged", "rapid", "mixed", "pre-exam"] as const;
type StudyModeSlug = typeof VALID_MODES[number];

const SLUG_TO_SESSION: Record<StudyModeSlug, string> = {
  "recommended": "recommended",
  "weak-areas": "weakAreas",
  "due-review": "dueForReview",
  "flagged": "flagged",
  "rapid": "rapidReview",
  "mixed": "mixedAdaptive",
  "pre-exam": "preExamBoost",
};

export default function AdaptiveStudyPage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const params = useParams<{ mode?: string }>();
  const { user, effectiveTier } = useAuth();

  const modeSlug = params.mode as StudyModeSlug | undefined;
  const initialMode = modeSlug && SLUG_TO_SESSION[modeSlug] ? SLUG_TO_SESSION[modeSlug] : undefined;

  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-gray-600 mb-4" data-testid="text-login-required">{t("pages.adaptiveStudyPage.pleaseLogInToAccess")}</p>
            <button onClick={() => setLocation("/login")} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90" data-testid="button-login">
              Log In
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <Navigation />
      <AdaptiveStudyHub
        userId={user.id}
        userTier={effectiveTier || user.tier || "free"}
        onBack={() => setLocation("/flashcards")}
        initialMode={initialMode}
      />
      <Footer />
    </div>
  );
}
