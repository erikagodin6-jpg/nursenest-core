export type DomainKey =
  | "respiratory"
  | "pharmacy-tech"
  | "mlt"
  | "imaging"
  | "sonography"
  | "emt"
  | "paramedic"
  | "medical-assistant"
  | "dental-hygiene"
  | "dental-assistant"
  | "physiotherapy"
  | "pta"
  | "occupational-therapy"
  | "ota"
  | "social-work"
  | "psychotherapy"
  | "mental-health-addictions"
  | "psw"
  | "community-health"
  | "dietetic-technician"
  | "lab-assistant";

export type DomainMastery = {
  correct: number;
  incorrect: number;
  confidence: number;
  lastPracticedAt?: number;
};

export type LearnerProfile = {
  userId: string;
  createdAt: number;
  updatedAt: number;
  overallProgress: number;
  domain: Record<DomainKey, DomainMastery>;
  strengths: DomainKey[];
  weaknesses: DomainKey[];
  preferredDifficulty: "easy" | "medium" | "hard";
};

export function createEmptyProfile(userId: string): LearnerProfile {
  const base: DomainMastery = {
    correct: 0,
    incorrect: 0,
    confidence: 0,
  };

  const domainKeys: DomainKey[] = [
    "respiratory",
    "pharmacy-tech",
    "mlt",
    "imaging",
    "sonography",
    "emt",
    "paramedic",
    "medical-assistant",
    "dental-hygiene",
    "dental-assistant",
    "physiotherapy",
    "pta",
    "occupational-therapy",
    "ota",
    "social-work",
    "psychotherapy",
    "mental-health-addictions",
    "psw",
    "community-health",
    "dietetic-technician",
    "lab-assistant"
  ];

  const domain = Object.fromEntries(
    domainKeys.map((k) => [k, { ...base }])
  ) as LearnerProfile["domain"];

  return {
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    overallProgress: 0,
    domain,
    strengths: [],
    weaknesses: [],
    preferredDifficulty: "medium"
  };
}

export function updateMastery(profile: LearnerProfile, domain: DomainKey, correct: boolean) {
  const d = profile.domain[domain];

  if (correct) d.correct++;
  else d.incorrect++;

  const total = d.correct + d.incorrect;
  d.confidence = total === 0 ? 0 : d.correct / total;
  d.lastPracticedAt = Date.now();

  profile.updatedAt = Date.now();

  const values = Object.values(profile.domain);
  profile.overallProgress = values.reduce((a, b) => a + b.confidence, 0) / values.length;

  profile.strengths = Object.entries(profile.domain)
    .filter(([, v]) => v.confidence > 0.8)
    .map(([k]) => k as DomainKey);

  profile.weaknesses = Object.entries(profile.domain)
    .filter(([, v]) => v.confidence < 0.5)
    .map(([k]) => k as DomainKey);

  return profile;
}