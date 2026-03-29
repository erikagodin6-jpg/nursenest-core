import manifestData from "./question-manifest.json";
import type { QuestionManifest } from "@shared/question-manifest";

const manifest: QuestionManifest = manifestData as QuestionManifest;

export const CAREER_SLUG_TO_KEY: Record<string, string> = {
  "rrt": "rrt",
  "respiratory-therapy": "rrt",
  "paramedic": "paramedic",
  "pharmacy-tech": "pharmacyTech",
  "pharmacy-technician": "pharmacyTech",
  "pharmacyTech": "pharmacyTech",
  "mlt": "mlt",
  "medical-laboratory-technologist": "mlt",
  "imaging": "imaging",
  "radiologic-technologist": "imaging",
  "occupational-therapy": "occupationalTherapyAssistant",
  "occupational-therapy-assistant": "occupationalTherapyAssistant",
  "occupationalTherapyAssistant": "occupationalTherapyAssistant",
  "physical-therapy": "physiotherapyAssistant",
  "physiotherapy-assistant": "physiotherapyAssistant",
  "physiotherapyAssistant": "physiotherapyAssistant",
  "psychotherapist": "psychotherapist",
  "social-worker": "socialWorker",
  "socialWorker": "socialWorker",
  "addictions-counsellor": "addictionsCounsellor",
  "addictionsCounsellor": "addictionsCounsellor",
  "social-work": "socialWorker",
  "psychotherapy": "psychotherapist",
  "surgical-technologist": "surgicalTechnologist",
  "surgicalTechnologist": "surgicalTechnologist",
  "diagnostic-sonography": "diagnosticSonography",
  "diagnosticSonography": "diagnosticSonography",
  "cardiac-sonographer": "cardiacSonographer",
  "cardiacSonographer": "cardiacSonographer",
  "health-info-mgmt": "healthInfoMgmt",
  "healthInfoMgmt": "healthInfoMgmt",
  "critical-care": "criticalCare",
  "criticalCare": "criticalCare",
  "emergency-nursing": "emergencyNursing",
  "emergencyNursing": "emergencyNursing",
  "perioperative": "perioperative",
  "oncology-nursing": "oncologyNursing",
  "oncologyNursing": "oncologyNursing",
  "pediatric-cert": "pediatricCert",
  "pediatricCert": "pediatricCert",
};

const NURSING_TIER_SLUG_TO_KEY: Record<string, string> = {
  "rn": "rn",
  "nclex-rn": "rn",
  "rpn": "rpn",
  "rpn-lvn": "rpn",
  "lvn": "rpn",
  "nclex-pn": "rpn",
  "np": "np",
  "nurse-practitioner": "np",
  "pre-nursing": "preNursing",
  "preNursing": "preNursing",
};

const NURSING_TIER_STATIC_COUNTS: Record<string, number> = Object.fromEntries(
  Object.entries(manifest.static.nursing)
    .filter(([key]) => ["rn", "rpn", "np", "preNursing"].includes(key))
    .map(([key, tc]) => [key, tc.total])
);

const NURSING_TIER_COUNTS: Record<string, number> = {
  rn: NURSING_TIER_STATIC_COUNTS.rn || 0,
  rpn: NURSING_TIER_STATIC_COUNTS.rpn || 0,
  np: NURSING_TIER_STATIC_COUNTS.np || 0,
  preNursing: NURSING_TIER_STATIC_COUNTS.preNursing || 0,
};

function getManifestCount(key: string): number {
  const alliedEntry = manifest.static.alliedHealth[key];
  if (alliedEntry) return alliedEntry.total;

  const certEntry = manifest.static.nursingCert[key];
  if (certEntry) return certEntry.total;

  return 0;
}

export const CAREER_QUESTION_COUNTS: Record<string, number> = Object.fromEntries(
  [
    ...Object.keys(manifest.static.alliedHealth),
    ...Object.keys(manifest.static.nursingCert),
  ].map((key) => [key, getManifestCount(key)])
);

export function getQuestionCount(careerSlugOrKey: string): number {
  const key = CAREER_SLUG_TO_KEY[careerSlugOrKey] || careerSlugOrKey;
  return CAREER_QUESTION_COUNTS[key] || 0;
}

export function getQuestionCountDisplay(careerSlugOrKey: string): string {
  const count = getQuestionCount(careerSlugOrKey);
  if (count === 0) return "Coming Soon";
  if (count < 50) return `${count}`;
  if (count < 1000) {
    const rounded = Math.floor(count / 50) * 50;
    return `${rounded}+`;
  }
  const rounded = Math.floor(count / 100) * 100;
  return `${rounded.toLocaleString()}+`;
}

export function getTotalNursingCertQuestions(): number {
  return Object.values(manifest.static.nursingCert).reduce(
    (sum, tc) => sum + tc.total,
    0
  );
}

export function getTotalNursingCertDisplay(): string {
  const total = getTotalNursingCertQuestions();
  const rounded = Math.floor(total / 500) * 500;
  return `${rounded.toLocaleString()}+`;
}

export function getTotalAlliedHealthQuestions(): number {
  return Object.values(manifest.static.alliedHealth).reduce(
    (sum, tc) => sum + tc.total,
    0
  );
}

export function getTotalAlliedHealthDisplay(): string {
  const total = getTotalAlliedHealthQuestions();
  const rounded = Math.floor(total / 1000) * 1000;
  return `${rounded.toLocaleString()}+`;
}

export function getManifest(): QuestionManifest {
  return manifest;
}

export function getManifestIntegrity(): {
  generatedAt: string;
  fileCount: number;
  parseFailures: string[];
  contentHash: string;
  isStale: boolean;
} {
  const generatedDate = new Date(manifest.generatedAt);
  const now = new Date();
  const ageMs = now.getTime() - generatedDate.getTime();
  const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

  return {
    generatedAt: manifest.generatedAt,
    fileCount: manifest.integrity.fileCount,
    parseFailures: manifest.integrity.parseFailures,
    contentHash: manifest.integrity.contentHash,
    isStale: ageMs > STALE_THRESHOLD_MS,
  };
}

export function getPublicTotalQuestions(): number {
  return manifest.totals.publicTotal;
}

export function getPublicTotalDisplay(): string {
  const total = getPublicTotalQuestions();
  const rounded = Math.floor(total / 1000) * 1000;
  return `${rounded.toLocaleString()}+`;
}

let _newGradCounts: {
  interviewQuestions: number;
  scenarioQuestions: number;
  simulationSets: number;
  mockInterviewTests: number;
} | null = null;

export function getNewGradCounts(): {
  interviewQuestions: number;
  scenarioQuestions: number;
  simulationSets: number;
  mockInterviewTests: number;
} {
  if (_newGradCounts) return _newGradCounts;
  try {
    const { INTERVIEW_QUESTION_BANK } = require("@/data/newgrad/premium-toolkit");
    const { WORKPLACE_SCENARIOS, WORKPLACE_SCENARIO_CATEGORIES } = require("@/data/newgrad/workplace-scenarios");
    _newGradCounts = {
      interviewQuestions: INTERVIEW_QUESTION_BANK?.length || 0,
      scenarioQuestions: WORKPLACE_SCENARIOS?.length || 0,
      simulationSets: WORKPLACE_SCENARIO_CATEGORIES?.length || 0,
      mockInterviewTests: 3,
    };
  } catch {
    _newGradCounts = {
      interviewQuestions: 25,
      scenarioQuestions: 28,
      simulationSets: 4,
      mockInterviewTests: 3,
    };
  }
  return _newGradCounts;
}

export function getNewGradTotalDisplay(): string {
  const counts = getNewGradCounts();
  const total = counts.interviewQuestions + counts.scenarioQuestions;
  return `${total}+`;
}
