import type { CareerType } from "@shared/careers";
import { CAREER_CONFIGS } from "@shared/careers";
import { fisherYatesShuffle } from "@shared/shuffle";

export interface CareerPooledQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  difficulty: number;
  category: string;
  topic: string;
  careerType: CareerType;
  tier: string;
}

let careerQuestionsCache: Record<string, CareerPooledQuestion[]> = {};

async function loadFromApi(careerType: CareerType): Promise<CareerPooledQuestion[] | null> {
  if (careerType !== "socialWorker") return null;
  try {
    const resp = await fetch("/api/social-worker/questions");
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.questions || data.questions.length === 0) return null;
    const config = CAREER_CONFIGS[careerType];
    const tiers = config.tiers;
    return data.questions.map((q: any) => {
      let tier = "free";
      if (tiers.length >= 3) {
        if (q.difficulty <= 2) tier = tiers[0].id;
        else if (q.difficulty <= 3) tier = tiers[1].id;
        else tier = tiers[2].id;
      }
      return { ...q, careerType, tier };
    });
  } catch {
    return null;
  }
}

async function loadCareerQuestions(careerType: CareerType): Promise<CareerPooledQuestion[]> {
  if (careerQuestionsCache[careerType]) return careerQuestionsCache[careerType];

  const apiQuestions = await loadFromApi(careerType);
  if (apiQuestions && apiQuestions.length > 0) {
    careerQuestionsCache[careerType] = apiQuestions;
    return apiQuestions;
  }

  try {
    const mod = await import(`../data/career-questions/${CAREER_CONFIGS[careerType].slug}-questions.ts`);
    const exportKey = Object.keys(mod).find(k => Array.isArray(mod[k]));
    if (!exportKey) return [];
    const raw = mod[exportKey] as Array<{
      id: string;
      stem: string;
      options: string[];
      correctIndex: number;
      rationale: string;
      difficulty: number;
      category: string;
      topic: string;
    }>;

    const config = CAREER_CONFIGS[careerType];
    const tiers = config.tiers;
    const pooled: CareerPooledQuestion[] = raw.map((q) => {
      let tier = "free";
      if (tiers.length >= 3) {
        if (q.difficulty <= 2) tier = tiers[0].id;
        else if (q.difficulty <= 3) tier = tiers[1].id;
        else tier = tiers[2].id;
      }
      return {
        ...q,
        careerType,
        tier,
      };
    });

    careerQuestionsCache[careerType] = pooled;
    return pooled;
  } catch {
    return [];
  }
}

export function getCareerQuestionsSync(careerType: CareerType): CareerPooledQuestion[] {
  return careerQuestionsCache[careerType] || [];
}

export async function buildCareerQuestionPool(careerType: CareerType): Promise<CareerPooledQuestion[]> {
  return loadCareerQuestions(careerType);
}

export function getCareerExamQuestions(
  questions: CareerPooledQuestion[],
  tier: string,
  count: number,
  categories?: string[]
): CareerPooledQuestion[] {
  let filtered = tier === "all" ? questions : questions.filter(q => q.tier === tier || q.tier === "free");
  if (categories && categories.length > 0) {
    filtered = filtered.filter(q => categories.includes(q.category));
  }
  const shuffled = fisherYatesShuffle([...filtered]);
  return shuffled.slice(0, count);
}

export function getCareerCategories(questions: CareerPooledQuestion[]): string[] {
  const cats = new Set(questions.map(q => q.category));
  return Array.from(cats).sort();
}

export function getCareerPoolStats(questions: CareerPooledQuestion[]): {
  total: number;
  categories: Record<string, number>;
  byDifficulty: Record<number, number>;
} {
  const categories: Record<string, number> = {};
  const byDifficulty: Record<number, number> = {};
  for (const q of questions) {
    categories[q.category] = (categories[q.category] || 0) + 1;
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
  }
  return { total: questions.length, categories, byDifficulty };
}
