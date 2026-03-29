import type { CareerQuestion } from "./rrt-questions";
import type { CareerType } from "@shared/careers";

const cache: Record<string, CareerQuestion[] | undefined> = {};
const inFlight: Record<string, Promise<CareerQuestion[]> | undefined> = {};

function normalizeCareerType(careerType: CareerType | string): string {
  return String(careerType || "").trim();
}

function isSafeCareerType(careerType: string): boolean {
  return /^[A-Za-z0-9_-]{2,64}$/.test(careerType);
}

async function fetchCareerQuestionPoolFromApi(
  careerType: CareerType | string,
  limit: number,
  offset: number,
): Promise<CareerQuestion[]> {
  const ct = normalizeCareerType(careerType);
  if (!isSafeCareerType(ct)) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const params = new URLSearchParams({
      careerType: ct,
      limit: String(limit),
      offset: String(offset),
    });
    const resp = await fetch(`/api/allied/career-question-pool?${params.toString()}`, { signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    const questions = Array.isArray(json?.questions) ? json.questions : [];
    return questions as CareerQuestion[];
  } finally {
    clearTimeout(timeout);
  }
}

export async function prefetchCareerQuestionPool(
  careerType: CareerType | string,
  opts?: { limit?: number; offset?: number },
): Promise<CareerQuestion[]> {
  const ct = normalizeCareerType(careerType);
  if (!ct) return [];

  if (cache[ct]) return cache[ct] || [];
  if (inFlight[ct]) return inFlight[ct] || [];

  const limit = Math.min(Math.max(opts?.limit ?? 1200, 1), 2000);
  const offset = Math.max(opts?.offset ?? 0, 0);

  inFlight[ct] = fetchCareerQuestionPoolFromApi(ct, limit, offset).then((q) => {
    cache[ct] = q;
    delete inFlight[ct];
    return q;
  }).catch(() => {
    cache[ct] = [];
    delete inFlight[ct];
    return [];
  });

  return inFlight[ct];
}

export function getCareerQuestionPool(careerType: CareerType | string): CareerQuestion[] {
  const ct = normalizeCareerType(careerType);
  return cache[ct] || [];
}
