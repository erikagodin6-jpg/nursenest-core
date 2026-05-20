export type EsClinicalGlossaryEntry = {
  english: string;
  preferredSpanish: string;
  notes?: string;
  protected?: boolean;
};

export const ES_PROTECTED_TERMS = [
  "NurseNest",
  "REx-PN",
  "NCLEX",
  "CPNRE",
  "OSCE",
  "CAT",
  "RN",
  "RPN",
  "PN",
  "NP",
  "NGN",
  "NCSBN",
  "CASN",
] as const;

export const ES_CLINICAL_GLOSSARY: readonly EsClinicalGlossaryEntry[] = [
  { english: "Nursing Exam Prep", preferredSpanish: "Preparación para exámenes de enfermería" },
  { english: "Practice Questions", preferredSpanish: "Preguntas de práctica" },
  { english: "Flashcards", preferredSpanish: "Tarjetas de memoria" },
  { english: "New Grad", preferredSpanish: "Recién graduado/a" },
  { english: "Patient Care", preferredSpanish: "Atención al paciente" },
  { english: "Lessons", preferredSpanish: "Lecciones" },
  { english: "Study Plan", preferredSpanish: "Plan de estudio" },
  { english: "Readiness", preferredSpanish: "Preparación" },
  { english: "Clinical Judgment", preferredSpanish: "Juicio clínico" },
  { english: "practical nurse", preferredSpanish: "enfermero/a práctico/a" },
  { english: "registered practical nurse", preferredSpanish: "enfermero/a práctico/a registrado/a" },
  { english: "registered nurse", preferredSpanish: "enfermero/a registrado/a" },
  { english: "nurse practitioner", preferredSpanish: "enfermero/a practicante" },
  { english: "rationale", preferredSpanish: "justificación" },
  { english: "care plan", preferredSpanish: "plan de cuidados" },
  { english: "priority assessment", preferredSpanish: "evaluación prioritaria" },
  { english: "medication administration", preferredSpanish: "administración de medicamentos" },
  { english: "dosage calculation", preferredSpanish: "cálculo de dosis" },
  { english: "patient safety", preferredSpanish: "seguridad del paciente" },
  { english: "infection prevention", preferredSpanish: "prevención de infecciones" },
  { english: "therapeutic communication", preferredSpanish: "comunicación terapéutica" },
  { english: "scope of practice", preferredSpanish: "ámbito de práctica" },
  { english: "professional accountability", preferredSpanish: "responsabilidad profesional" },
  { english: "health assessment", preferredSpanish: "evaluación de salud" },
  { english: "pediatrics", preferredSpanish: "pediatría" },
  { english: "maternity", preferredSpanish: "maternidad" },
  { english: "mental health", preferredSpanish: "salud mental" },
  { english: "pharmacology", preferredSpanish: "farmacología" },
  { english: "medical-surgical nursing", preferredSpanish: "enfermería médico-quirúrgica" },
  ...ES_PROTECTED_TERMS.map((term) => ({ english: term, preferredSpanish: term, protected: true })),
] as const;
