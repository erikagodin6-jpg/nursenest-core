const FALLBACK_ADMIN_AI_GENERATION_GATE: AdminAiGenerationGate = {
  runnable: false,
  mode: "misconfigured",
  summaryLine: "AI generation is unavailable because the admin AI generation context was not loaded.",
<<<<<<< HEAD
  flagEnabled: false,
  openAiKeyPresent: false,
  diagnostics: [],
};
=======
>>>>>>> 319a40b97 (jjkkk)

  flagEnabled: false,
  openAiKeyPresent: false,

  // 🔥 FIX: this must be an OBJECT, not an array
  diagnostics: {
    aiAdminGenerationEnvPresent: false,
    aiAdminGenerationFlagClass: "disabled",
    aiIntegrationsOpenAiKeyPresent: false,
    legacyOpenAiKeyPresent: false,
    adminAiGenerationFlagNormalized: false,
  },
};