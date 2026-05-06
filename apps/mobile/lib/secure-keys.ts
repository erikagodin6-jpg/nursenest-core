/** SecureStore keys — keep short, stable, namespaced. */
export const secureKeys = {
  authCookieJar: "nn_auth_cookie_jar",
  onboardingV1Done: "nn_onboarding_v1_done",
  pendingPathwayId: "nn_pending_pathway_v1",
  localStudyGoal: "nn_local_study_goal_v1",
} as const;
