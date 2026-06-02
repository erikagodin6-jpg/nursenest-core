/**
 * English fixtures for node tests — keep in sync with tools/i18n/marketing/marketing-en.json `auth.transition.*`
 */
export const AUTH_TRANSITION_EN_FIXTURES: Record<string, string> = {
  "auth.transition.common.ctaContinue": "Continue",
  "auth.transition.common.ctaResume": "Resume",
  "auth.transition.common.ctaStart": "Start",
  "auth.transition.common.whatsNextEyebrow": "What's next",
  "auth.transition.common.exploreLessons": "Explore lessons",
  "auth.transition.common.signInContinue": "Sign in to continue studying",
  "auth.transition.common.signInPrefix": "Sign in",
  "auth.transition.common.alreadySignedInHelp": "Continue — returning you to your study workspace.",
  "auth.transition.emailVerified.eyebrow": "Ready for adaptive study",
  "auth.transition.emailVerified.title": "You're ready to begin adaptive study.",
  "auth.transition.emailVerified.messageRn":
    "Your account is active. NCLEX-RN readiness tracking and your pathway unlock as soon as you sign in.",
  "auth.transition.emailVerified.messageRpn":
    "Your account is active. practical nursing readiness tracking and your pathway unlock as soon as you sign in.",
  "auth.transition.emailVerified.messageNp":
    "Your account is active. advanced practice readiness tracking and your pathway unlock as soon as you sign in.",
  "auth.transition.emailVerified.messageGeneral":
    "Your account is active. nursing readiness tracking and your pathway unlock as soon as you sign in.",
  "auth.transition.emailVerified.help":
    "We will pick up where you left off if you already started studying on this device.",
  "auth.transition.emailVerified.whatsNextTitleRn": "Your RN study path",
  "auth.transition.emailVerified.whatsNextTitleRpn": "Your RPN study path",
  "auth.transition.emailVerified.whatsNextTitleNp": "Your NP study path",
  "auth.transition.emailVerified.whatsNextTitleGeneral": "Continue into your study workspace",
  "auth.transition.emailVerified.verifyBannerTitle": "You're ready to begin adaptive study.",
  "auth.transition.emailVerified.verifyBannerMessage": "Sign in to open your pathway and readiness tools.",
  "auth.transition.sessionExpired.eyebrow": "Session paused",
  "auth.transition.sessionExpired.title": "Your session paused while you were away.",
  "auth.transition.sessionExpired.message": "Your study progress is saved and ready to continue.",
  "auth.transition.sessionExpired.helpDefault":
    "Sign in again and we will return you to the same study session when possible.",
  "auth.transition.oauth.eyebrow": "Continuing with {{provider}}",
  "auth.transition.oauth.title": "Linking your NurseNest account",
  "auth.transition.oauth.messageDefault": "One moment — preparing your adaptive study workspace.",
  "auth.transition.oauth.helpDefault": "Adaptive profile and pathway preferences are syncing.",
  "auth.transition.oauth.providerApple": "Apple",
  "auth.transition.oauth.providerGoogle": "Google",
  "auth.transition.oauth.providerUnknown": "your provider",
  "auth.transition.signIn.loadingFlashcardsHeadline": "Restoring your flashcard session",
  "auth.transition.signIn.loadingFlashcardsDetail": "Your deck and progress are syncing",
  "auth.transition.signIn.loadingCatHeadline": "Restoring your adaptive CAT session",
  "auth.transition.signIn.loadingCatDetail": "Exam simulation settings are loading",
  "auth.transition.signIn.loadingPracticeHeadline": "Restoring your practice session",
  "auth.transition.signIn.loadingPracticeDetail": "Your exam queue is ready to continue",
  "auth.transition.signIn.loadingQuestionsHeadline": "Restoring your question bank session",
  "auth.transition.signIn.loadingQuestionsDetail": "Your practice queue is loading",
  "auth.transition.signIn.loadingLessonsHeadline": "Opening your lesson workspace",
  "auth.transition.signIn.loadingLessonsDetail": "Returning to your last study hub",
  "auth.transition.signIn.loadingAppHeadline": "Preparing your study workspace",
  "auth.transition.signIn.loadingAppDetail": "Restoring your adaptive session",
  "auth.transition.signIn.loadingDefaultHeadline": "Preparing your study workspace",
  "auth.transition.signIn.loadingDefaultDetail": "Loading your pathway and readiness insights",
  "auth.transition.signIn.continuationRnFlashcards": "Resume cardiac prioritization when you return.",
  "auth.transition.signIn.continuationRnCat": "Continue NCLEX adaptive readiness.",
  "auth.transition.signIn.continuationNpSoap": "Resume SOAP note practice.",
  "auth.transition.signIn.continuationNpDifferential": "Resume differential diagnosis review.",
  "auth.transition.signIn.alreadySignedInSuffix": "returning you to your study workspace.",
  "auth.transition.signUp.eyebrow": "Almost there",
  "auth.transition.signUp.title": "Your NurseNest account is on its way.",
  "auth.transition.signUp.message": "Check your inbox to verify your email, then sign in to unlock adaptive study.",
  "auth.transition.signUp.help": "Did not receive it? Check spam or request a new link after signing in.",
  "auth.transition.signUp.loadingHeadlineRn": "Preparing your NCLEX-RN pathway",
  "auth.transition.signUp.loadingHeadlineRpn": "Preparing your practical nursing pathway",
  "auth.transition.signUp.loadingHeadlineNp": "Preparing your nurse practitioner pathway",
  "auth.transition.signUp.loadingHeadlineGeneral": "Creating your study account",
  "auth.transition.signUp.loadingDetail": "Check your inbox to verify your email",
  "auth.transition.signUp.loadingRestore": "Restoring your saved session",
  "auth.transition.whatsNext.rn1Title": "Start flashcards",
  "auth.transition.whatsNext.rn1Detail": "Adaptive warm-up for your NCLEX track",
  "auth.transition.whatsNext.rn2Title": "Begin readiness review",
  "auth.transition.whatsNext.rn2Detail": "See accuracy bands and weak areas",
  "auth.transition.whatsNext.rn3Title": "Practice cardiac questions",
  "auth.transition.whatsNext.rn3Detail": "High-yield stems with rationales",
  "auth.transition.loading.oauthHeadline": "Restoring your adaptive session",
  "auth.transition.loading.oauthDetail": "Secure sign-in in progress",
};

export function createAuthTransitionTestTranslator(
  messages: Record<string, string> = AUTH_TRANSITION_EN_FIXTURES,
) {
  return (key: string, params?: Record<string, string | number | undefined>) => {
    let out = messages[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) out = out.replaceAll(`{{${k}}}`, String(v));
      }
    }
    return out;
  };
}
