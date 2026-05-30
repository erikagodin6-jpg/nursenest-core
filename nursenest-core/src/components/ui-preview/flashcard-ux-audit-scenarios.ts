import type { ActiveStudyCard } from "@/components/study/active-study-session";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

/** Real clinical stems — bank-style payloads for UX audit captures (not lorem ipsum). */

const MCQ_SHORT: ExamMicroQuestionPayload = {
  itemKind: "STANDARD" as import("@prisma/client").FlashcardItemKind,
  questionStem: "A patient is hypoxic with SpO₂ 88%. What is the priority nursing action?",
  answerOptions: [
    { letter: "A", text: "Administer supplemental oxygen" },
    { letter: "B", text: "Call a rapid response" },
    { letter: "C", text: "Document findings in the chart" },
    { letter: "D", text: "Reassess in one hour" },
  ],
  correctLetter: "A",
  rationaleCorrect: "Oxygen directly addresses hypoxia and is the immediate priority before escalation or documentation.",
  rationaleIncorrect: [
    { letter: "B", rationale: "No code criteria are met; oxygen comes first." },
    { letter: "C", rationale: "Documentation follows intervention." },
    { letter: "D", rationale: "Delay worsens tissue hypoxia." },
  ],
};

const MCQ_LONG: ExamMicroQuestionPayload = {
  itemKind: "PRIORITY" as import("@prisma/client").FlashcardItemKind,
  questionStem:
    "A nurse is caring for a client with acute decompensated heart failure. Which finding best indicates decreased cardiac output requiring immediate intervention?",
  answerOptions: [
    { letter: "A", text: "Bounding peripheral pulses with warm extremities" },
    { letter: "B", text: "Cool, clammy extremities with narrowed pulse pressure" },
    { letter: "C", text: "Urine output 45 mL/hr for the past two hours" },
    { letter: "D", text: "Blood pressure 138/86 mmHg with mild headache" },
  ],
  correctLetter: "B",
  rationaleCorrect:
    "Cool, clammy extremities with narrowed pulse pressure indicate compensatory vasoconstriction and inadequate stroke volume — classic decreased cardiac output. In acute decompensated heart failure, prioritize perfusion: elevate HOB, apply oxygen, prepare diuretics per order, and monitor for pulmonary edema. Avoid fluid boluses unless ordered. Reassess lung sounds, work of breathing, and mental status after positioning and oxygen.",
  rationaleIncorrect: [
    {
      letter: "A",
      rationale:
        "Bounding pulses with warm skin suggest hyperdynamic circulation or early compensatory state, not the hypoperfusion pattern seen in decompensated heart failure.",
    },
    {
      letter: "C",
      rationale:
        "Urine output above 30 mL/hr suggests adequate renal perfusion relative to the acute decompensation described; it does not confirm decreased cardiac output.",
    },
    {
      letter: "D",
      rationale:
        "Isolated hypertension with headache does not establish perfusion failure; peripheral perfusion and pulse pressure are more specific for output.",
    },
  ],
};

const SATA: SataQuestionPayload = {
  itemKind: "SATA",
  questionStem:
    "The nurse is assessing a postoperative client for signs of infection. Which findings should the nurse report to the provider? Select all that apply.",
  answerOptions: [
    { letter: "A", text: "Temperature 38.6°C (101.5°F)" },
    { letter: "B", text: "Heart rate 58 beats/min" },
    { letter: "C", text: "WBC 14.2 × 10³/µL" },
    { letter: "D", text: "Erythema and warmth at the incision site" },
    { letter: "E", text: "Blood pressure 118/72 mmHg" },
  ],
  correctLetters: ["A", "C", "D"],
  rationaleCorrect:
    "Fever, leukocytosis, and localized erythema with warmth are classic postoperative infection indicators requiring provider notification and possible culture orders.",
  rationaleByLetter: [
    { letter: "A", rationale: "Fever exceeds typical post-op baseline and warrants evaluation.", correct: true },
    { letter: "B", rationale: "Bradycardia is not a typical infection sign unless sepsis is advanced.", correct: false },
    { letter: "C", rationale: "Elevated WBC supports immune activation.", correct: true },
    { letter: "D", rationale: "Incision erythema and warmth suggest local inflammation.", correct: true },
    { letter: "E", rationale: "Normotensive reading alone does not rule in or out infection.", correct: false },
  ],
};

export type FlashcardUxAuditScenarioId =
  | "mcq-unanswered"
  | "mcq-answered"
  | "mcq-long-rationale"
  | "mcq-short-rationale"
  | "sata-unanswered"
  | "sata-answered";

export interface FlashcardUxAuditScenario {
  id: FlashcardUxAuditScenarioId;
  label: string;
  cards: ActiveStudyCard[];
  initialRevealed: boolean;
  initialCardIndex: number;
}

function cardFromExam(
  id: string,
  topic: string,
  exam: ExamMicroQuestionPayload | SataQuestionPayload,
  explanation: string,
): ActiveStudyCard {
  const isSata = "correctLetters" in exam && Array.isArray(exam.correctLetters);
  return {
    id,
    prompt: exam.questionStem,
    answer: isSata ? exam.correctLetters.join(", ") : exam.correctLetter,
    explanation,
    topic,
    subtopic: "clinical-judgment",
    pathwayId: "ca-rn-nclex-rn",
    topicSlug: topic.toLowerCase().replace(/\s+/g, "-"),
    lessonHref: "/app/lessons/cardiovascular-lesson-4-6",
    lessonTitle: `${topic} — linked lesson`,
    examMicroQuestion: exam,
  };
}

export const FLASHCARD_UX_AUDIT_SCENARIOS: Record<FlashcardUxAuditScenarioId, FlashcardUxAuditScenario> = {
  "mcq-unanswered": {
    id: "mcq-unanswered",
    label: "MCQ — unanswered",
    initialRevealed: false,
    initialCardIndex: 0,
    cards: [
      cardFromExam(
        "audit-mcq-short",
        "Respiratory",
        MCQ_SHORT,
        MCQ_SHORT.rationaleCorrect ?? "",
      ),
    ],
  },
  "mcq-answered": {
    id: "mcq-answered",
    label: "MCQ — answered",
    initialRevealed: true,
    initialCardIndex: 0,
    cards: [
      cardFromExam(
        "audit-mcq-short-answered",
        "Respiratory",
        MCQ_SHORT,
        MCQ_SHORT.rationaleCorrect ?? "",
      ),
    ],
  },
  "mcq-long-rationale": {
    id: "mcq-long-rationale",
    label: "MCQ — long rationale",
    initialRevealed: true,
    initialCardIndex: 0,
    cards: [
      cardFromExam(
        "audit-mcq-long",
        "Cardiovascular",
        MCQ_LONG,
        MCQ_LONG.rationaleCorrect ?? "",
      ),
    ],
  },
  "mcq-short-rationale": {
    id: "mcq-short-rationale",
    label: "MCQ — short rationale",
    initialRevealed: true,
    initialCardIndex: 0,
    cards: [
      cardFromExam(
        "audit-mcq-short-r",
        "Respiratory",
        MCQ_SHORT,
        "Administer oxygen first; reassess SpO₂ and work of breathing.",
      ),
    ],
  },
  "sata-unanswered": {
    id: "sata-unanswered",
    label: "SATA — unanswered",
    initialRevealed: false,
    initialCardIndex: 0,
    cards: [cardFromExam("audit-sata", "Immune Infectious", SATA, SATA.rationaleCorrect ?? "")],
  },
  "sata-answered": {
    id: "sata-answered",
    label: "SATA — answered",
    initialRevealed: true,
    initialCardIndex: 0,
    cards: [cardFromExam("audit-sata-done", "Immune Infectious", SATA, SATA.rationaleCorrect ?? "")],
  },
};

export function resolveFlashcardUxAuditScenario(raw: string | null): FlashcardUxAuditScenario {
  const id = (raw?.trim() ?? "mcq-unanswered") as FlashcardUxAuditScenarioId;
  return FLASHCARD_UX_AUDIT_SCENARIOS[id] ?? FLASHCARD_UX_AUDIT_SCENARIOS["mcq-unanswered"];
}
