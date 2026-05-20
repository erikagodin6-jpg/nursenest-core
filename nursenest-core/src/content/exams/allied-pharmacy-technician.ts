import { pharmacyTechnicianQuestions } from "@/content/questions/allied-pharmacy-technician";

export type PharmacyTechnicianMockExam = {
  id: string;
  title: string;
  examType: "PTCE" | "ExCPT" | "PEBC";
  alliedProfessionKey: "pharmacy-tech";
  description: string;
  durationMinutes: number;
  questionIds: string[];
  readinessDomains: Array<"workflow" | "calculations" | "pharmacology" | "medicationSafety" | "law" | "compounding">;
  mode: "practice" | "exam";
};

const questionIds = new Set(pharmacyTechnicianQuestions.map((question) => question.id));

function exam(
  id: string,
  title: string,
  examType: PharmacyTechnicianMockExam["examType"],
  description: string,
  questionIdsForExam: string[],
  readinessDomains: PharmacyTechnicianMockExam["readinessDomains"],
  durationMinutes = 35,
): PharmacyTechnicianMockExam {
  for (const questionId of questionIdsForExam) {
    if (!questionIds.has(questionId)) {
      throw new Error(`Pharmacy technician mock exam ${id} references missing question ${questionId}`);
    }
  }

  return {
    id,
    title,
    examType,
    alliedProfessionKey: "pharmacy-tech",
    description,
    durationMinutes,
    questionIds: questionIdsForExam,
    readinessDomains,
    mode: "practice",
  };
}

export const pharmacyTechnicianMockExams: PharmacyTechnicianMockExam[] = [
  exam(
    "pharm-tech-ptce-mock-exam-1",
    "PTCE Mock Exam 1 — Pharmacy Technician Foundations",
    "PTCE",
    "A foundation PTCE-style pharmacy technician exam covering workflow, pharmacy calculations, Top 200 drugs, medication safety, law, and compounding.",
    [
      "pharm-tech-workflow-quantity-mismatch",
      "pharm-tech-workflow-lasa-product-selection",
      "pharm-tech-calc-liquid-dose",
      "pharm-tech-calc-days-supply",
      "pharm-tech-calc-mg-mcg",
      "pharm-tech-pharm-warfarin-class",
      "pharm-tech-pharm-lisinopril-suffix",
      "pharm-tech-safety-insulin-u",
      "pharm-tech-safety-leading-zero",
      "pharm-tech-law-privacy-family",
      "pharm-tech-law-controlled-substance",
      "pharm-tech-compounding-first-air",
      "pharm-tech-compounding-bud",
    ],
    ["workflow", "calculations", "pharmacology", "medicationSafety", "law", "compounding"],
    40,
  ),
  exam(
    "pharm-tech-excpt-mock-exam-1",
    "ExCPT Mock Exam 1 — Medication Safety and Workflow",
    "ExCPT",
    "An ExCPT-style pharmacy technician exam emphasizing safe dispensing workflow, medication safety, calculations, drug classes, and role boundaries.",
    [
      "pharm-tech-workflow-lasa-product-selection",
      "pharm-tech-workflow-quantity-mismatch",
      "pharm-tech-safety-insulin-u",
      "pharm-tech-safety-leading-zero",
      "pharm-tech-calc-liquid-dose",
      "pharm-tech-calc-days-supply",
      "pharm-tech-pharm-warfarin-class",
      "pharm-tech-law-controlled-substance",
      "pharm-tech-law-privacy-family",
      "pharm-tech-compounding-first-air",
    ],
    ["workflow", "medicationSafety", "calculations", "pharmacology", "law", "compounding"],
    30,
  ),
  exam(
    "pharm-tech-pebc-mock-exam-1",
    "PEBC Pharmacy Technician Mock Exam 1 — Canadian Readiness",
    "PEBC",
    "A PEBC-style pharmacy technician readiness exam focused on accuracy, role boundaries, privacy, medication safety, calculations, and compounding process discipline.",
    [
      "pharm-tech-law-privacy-family",
      "pharm-tech-law-controlled-substance",
      "pharm-tech-workflow-quantity-mismatch",
      "pharm-tech-workflow-lasa-product-selection",
      "pharm-tech-safety-insulin-u",
      "pharm-tech-calc-mg-mcg",
      "pharm-tech-calc-liquid-dose",
      "pharm-tech-pharm-lisinopril-suffix",
      "pharm-tech-compounding-bud",
      "pharm-tech-compounding-first-air",
    ],
    ["law", "workflow", "medicationSafety", "calculations", "pharmacology", "compounding"],
    30,
  ),
  exam(
    "pharm-tech-calculations-focused-exam-1",
    "Pharmacy Technician Calculations Focused Exam 1",
    "PTCE",
    "A focused pharmacy math exam for liquid dosing, days supply, unit conversion, and calculation-safety reasoning.",
    [
      "pharm-tech-calc-liquid-dose",
      "pharm-tech-calc-days-supply",
      "pharm-tech-calc-mg-mcg",
      "pharm-tech-workflow-quantity-mismatch",
      "pharm-tech-safety-leading-zero",
    ],
    ["calculations", "workflow", "medicationSafety"],
    20,
  ),
];

export default { exams: pharmacyTechnicianMockExams };
