/**
 * Static educational disclaimers — **not** user-facing product copy keys.
 * Wire localized strings through i18n at UI boundaries; these anchor server-side docs/tests.
 */
export const TUTORING_SAFETY_DISCLAIMERS = {
  educationalOnly:
    "NurseNest tutoring outputs are for exam preparation and conceptual education only. They are not medical advice, diagnosis, or treatment guidance for real patients.",
  noEmergency:
    "Do not use NurseNest for emergencies. If you believe you or someone else is experiencing a medical emergency, call your local emergency number.",
  aiMayErr:
    "AI-generated explanations may be incomplete or incorrect. Always verify with authoritative coursework, your program, and clinical instructors.",
} as const;
