const CACHE_PREFIX = "nursenest-fc-";
const DECK_META_KEY = `${CACHE_PREFIX}deck-meta`;
const DECK_CARDS_KEY = `${CACHE_PREFIX}deck-cards-`;
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getCacheEntry<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCacheEntry<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
      keys.sort();
      if (keys.length > 0) {
        localStorage.removeItem(keys[0]);
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
      }
    } catch {}
  }
}

export function cacheMyDecks(decks: any[]): void {
  setCacheEntry(`${DECK_META_KEY}-my`, decks);
}

export function getCachedMyDecks(): any[] | null {
  return getCacheEntry<any[]>(`${DECK_META_KEY}-my`);
}

export function cachePublicDecks(decks: any[]): void {
  setCacheEntry(`${DECK_META_KEY}-public`, decks);
}

export function getCachedPublicDecks(): any[] | null {
  return getCacheEntry<any[]>(`${DECK_META_KEY}-public`);
}

export function cacheDeckCards(deckId: string, cards: any[]): void {
  setCacheEntry(`${DECK_CARDS_KEY}${deckId}`, cards);
}

export function getCachedDeckCards(deckId: string): any[] | null {
  return getCacheEntry<any[]>(`${DECK_CARDS_KEY}${deckId}`);
}

export function cacheExamFlashcardCounts(counts: Record<string, number>, total: number): void {
  setCacheEntry(`${CACHE_PREFIX}exam-counts`, { counts, total });
}

export function getCachedExamFlashcardCounts(): { counts: Record<string, number>; total: number } | null {
  return getCacheEntry<{ counts: Record<string, number>; total: number }>(`${CACHE_PREFIX}exam-counts`);
}

export function cacheExamFlashcards(tier: string, cards: any[]): void {
  setCacheEntry(`${CACHE_PREFIX}exam-cards-${tier}`, cards);
}

export function getCachedExamFlashcards(tier: string): any[] | null {
  return getCacheEntry<any[]>(`${CACHE_PREFIX}exam-cards-${tier}`);
}

export type DegradedMode = "live" | "cached" | "emergency" | "error";

export interface FlashcardFetchResult<T> {
  data: T;
  mode: DegradedMode;
}

export async function fetchWithFallback<T>(
  fetchFn: () => Promise<T>,
  getCached: () => T | null,
  emergencyData: T | null,
  updateCache?: (data: T) => void
): Promise<FlashcardFetchResult<T>> {
  try {
    const data = await fetchFn();
    if (updateCache) updateCache(data);
    return { data, mode: "live" };
  } catch (liveError) {
    console.warn("[FlashcardCache] Live fetch failed, trying cache:", liveError);
    const cached = getCached();
    if (cached !== null) {
      return { data: cached, mode: "cached" };
    }
    if (emergencyData !== null) {
      return { data: emergencyData, mode: "emergency" };
    }
    throw liveError;
  }
}

export const EMERGENCY_NURSING_DECK = {
  id: "emergency-core-nursing",
  title: "Core Nursing Essentials",
  description: "Emergency study deck with essential nursing concepts",
  cardCount: 20,
  visibility: "public",
  isEmergency: true,
};

export const EMERGENCY_NURSING_CARDS = [
  { id: "emg-1", front: "What are the 5 Rights of Medication Administration?", back: "Right patient, Right drug, Right dose, Right route, Right time. Some add: Right documentation, Right reason, Right response.", category: "Pharmacology" },
  { id: "emg-2", front: "Normal adult heart rate range?", back: "60-100 beats per minute (BPM). Bradycardia: <60 BPM. Tachycardia: >100 BPM.", category: "Vital Signs" },
  { id: "emg-3", front: "Normal adult blood pressure range?", back: "Systolic: 90-120 mmHg. Diastolic: 60-80 mmHg. Hypertension: ≥130/80 mmHg (ACC/AHA).", category: "Vital Signs" },
  { id: "emg-4", front: "Normal adult respiratory rate?", back: "12-20 breaths per minute. Tachypnea: >20. Bradypnea: <12.", category: "Vital Signs" },
  { id: "emg-5", front: "Normal adult temperature range?", back: "36.1-37.2°C (97.0-99.0°F). Fever: ≥38.0°C (100.4°F).", category: "Vital Signs" },
  { id: "emg-6", front: "What does ABCDE stand for in primary assessment?", back: "Airway, Breathing, Circulation, Disability (neurological), Exposure. Used for rapid systematic patient assessment.", category: "Assessment" },
  { id: "emg-7", front: "Signs and symptoms of hypoglycemia?", back: "Shakiness, sweating, tachycardia, confusion, irritability, hunger, pallor, seizures (severe). Blood glucose <70 mg/dL.", category: "Endocrine" },
  { id: "emg-8", front: "What is the Glasgow Coma Scale (GCS)?", back: "Neurological assessment: Eye opening (1-4), Verbal response (1-5), Motor response (1-6). Total: 3-15. Score ≤8 = severe injury/coma.", category: "Neurological" },
  { id: "emg-9", front: "Normal serum potassium (K+) level?", back: "3.5-5.0 mEq/L. Hypokalemia: <3.5 (muscle weakness, arrhythmias). Hyperkalemia: >5.0 (peaked T waves, cardiac arrest risk).", category: "Labs" },
  { id: "emg-10", front: "Normal serum sodium (Na+) level?", back: "136-145 mEq/L. Hyponatremia: <136 (confusion, seizures). Hypernatremia: >145 (thirst, restlessness).", category: "Labs" },
  { id: "emg-11", front: "What is the nursing process?", back: "ADPIE: Assessment, Diagnosis, Planning, Implementation, Evaluation. Cyclical process for patient care planning.", category: "Fundamentals" },
  { id: "emg-12", front: "Chain of infection components?", back: "Infectious agent → Reservoir → Portal of exit → Mode of transmission → Portal of entry → Susceptible host. Break any link to prevent infection.", category: "Infection Control" },
  { id: "emg-13", front: "Normal oxygen saturation (SpO2)?", back: "95-100%. Below 90% requires immediate intervention. COPD patients may have baseline 88-92%.", category: "Respiratory" },
  { id: "emg-14", front: "Signs of left-sided heart failure?", back: "Dyspnea, orthopnea, paroxysmal nocturnal dyspnea, crackles in lungs, pink frothy sputum, fatigue, S3 heart sound.", category: "Cardiovascular" },
  { id: "emg-15", front: "Signs of right-sided heart failure?", back: "Peripheral edema, jugular venous distension (JVD), hepatomegaly, ascites, weight gain, fatigue.", category: "Cardiovascular" },
  { id: "emg-16", front: "Maslow's Hierarchy of Needs (nursing priority)?", back: "1. Physiological (airway, breathing) 2. Safety/Security 3. Love/Belonging 4. Self-esteem 5. Self-actualization. Prioritize lower levels first.", category: "Fundamentals" },
  { id: "emg-17", front: "What are standard precautions?", back: "Hand hygiene, PPE (gloves, gown, mask, eye protection), safe injection practices, respiratory hygiene. Applied to ALL patients regardless of diagnosis.", category: "Infection Control" },
  { id: "emg-18", front: "Normal blood glucose range (fasting)?", back: "70-100 mg/dL (fasting). Pre-diabetes: 100-125 mg/dL. Diabetes: ≥126 mg/dL. Random ≥200 mg/dL with symptoms = diabetes.", category: "Endocrine" },
  { id: "emg-19", front: "What is SBAR communication?", back: "Situation (what's happening), Background (context), Assessment (what you think), Recommendation (what you suggest). Structured handoff tool.", category: "Communication" },
  { id: "emg-20", front: "Early signs of shock?", back: "Tachycardia, tachypnea, narrowing pulse pressure, anxiety/restlessness, cool/clammy skin, decreased urine output, thirst.", category: "Emergency" },
];

export function clearFlashcardCache(): void {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {}
}
