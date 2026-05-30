"use client";

import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";

export const FLASHCARDS_HUB_PREFS_VERSION = 1 as const;

export type FlashcardsHubCardLimit = number | "all";

export type FlashcardsHubPreferencesV1 = {
  v: typeof FLASHCARDS_HUB_PREFS_VERSION;
  cardLimit: FlashcardsHubCardLimit;
  customCardLimit: number | null;
  shuffleOn: boolean;
  selectedCanonicalIds: CanonicalStudyCategoryId[];
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  notStudiedOnly: boolean;
};

export const FLASHCARD_SESSION_PRESETS = [10, 25, 50, 100, 250] as const;

export function flashcardsHubPrefsStorageKey(pathwayId: string): string {
  return `nn_flashcards_hub_prefs_v1_${pathwayId.trim()}`;
}

export function defaultFlashcardsHubPreferences(): FlashcardsHubPreferencesV1 {
  return {
    v: 1,
    cardLimit: 25,
    customCardLimit: null,
    shuffleOn: true,
    selectedCanonicalIds: [],
    weakOnly: false,
    incorrectOnly: false,
    starredOnly: false,
    notStudiedOnly: false,
  };
}

function clampCustomLimit(n: number): number {
  if (!Number.isFinite(n)) return 25;
  return Math.min(500, Math.max(10, Math.floor(n)));
}

function parseCardLimit(raw: unknown): FlashcardsHubCardLimit {
  if (raw === "all") return "all";
  const n = Number(raw);
  if (!Number.isFinite(n)) return 25;
  if (FLASHCARD_SESSION_PRESETS.includes(n as (typeof FLASHCARD_SESSION_PRESETS)[number])) {
    return n;
  }
  return clampCustomLimit(n);
}

export function readFlashcardsHubPreferences(pathwayId: string): FlashcardsHubPreferencesV1 {
  if (typeof window === "undefined") return defaultFlashcardsHubPreferences();
  try {
    const raw = localStorage.getItem(flashcardsHubPrefsStorageKey(pathwayId));
    if (!raw) return defaultFlashcardsHubPreferences();
    const j = JSON.parse(raw) as Partial<FlashcardsHubPreferencesV1>;
    if (j.v !== 1) return defaultFlashcardsHubPreferences();
    const custom =
      j.customCardLimit != null && Number.isFinite(Number(j.customCardLimit))
        ? clampCustomLimit(Number(j.customCardLimit))
        : null;
    const selected = Array.isArray(j.selectedCanonicalIds)
      ? j.selectedCanonicalIds.filter((id): id is CanonicalStudyCategoryId => typeof id === "string" && id.length > 0)
      : [];
    return {
      v: 1,
      cardLimit: parseCardLimit(j.cardLimit),
      customCardLimit: custom,
      shuffleOn: j.shuffleOn !== false,
      selectedCanonicalIds: selected,
      weakOnly: Boolean(j.weakOnly),
      incorrectOnly: Boolean(j.incorrectOnly),
      starredOnly: Boolean(j.starredOnly),
      notStudiedOnly: Boolean(j.notStudiedOnly),
    };
  } catch {
    return defaultFlashcardsHubPreferences();
  }
}

export function writeFlashcardsHubPreferences(pathwayId: string, next: FlashcardsHubPreferencesV1): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(flashcardsHubPrefsStorageKey(pathwayId), JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

/** Cards requested for API — server caps to available inventory. */
export function cardLimitQueryValue(limit: FlashcardsHubCardLimit): string {
  if (limit === "all") return "all";
  return String(clampCustomLimit(limit));
}

export function resolveNumericCardLimit(limit: FlashcardsHubCardLimit): number {
  if (limit === "all") return 500;
  return clampCustomLimit(limit);
}

export function effectiveSessionCardCount(
  limit: FlashcardsHubCardLimit,
  matchingCards: number | null,
): number {
  const requested = limit === "all" ? (matchingCards ?? 500) : resolveNumericCardLimit(limit);
  if (matchingCards == null) return requested;
  return Math.max(0, Math.min(requested, matchingCards));
}

export function sessionSizeLabel(limit: FlashcardsHubCardLimit, effective: number, matchingCards: number | null): string {
  if (limit === "all") {
    return matchingCards != null ? `Full review (${effective})` : "Full review";
  }
  if (matchingCards != null && effective < resolveNumericCardLimit(limit)) {
    return `${effective} cards (${matchingCards} available)`;
  }
  return `${effective} cards`;
}

export type FlashcardsCustomSessionCheckpoint = {
  pathwayId: string;
  /** Query string for `/app/flashcards/custom` (without `includeCards`). */
  queryString: string;
  index: number;
  totalCards: number;
  systemsLabel: string;
  updatedAt: string;
};

const CUSTOM_CK_KEY = "nn_flashcards_custom_checkpoint_v1";

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function normalizeCustomSessionCheckpoint(v: unknown): FlashcardsCustomSessionCheckpoint | null {
  if (!isPlainRecord(v)) return null;
  const pathwayId = typeof v.pathwayId === "string" ? v.pathwayId.trim() : "";
  const queryString = typeof v.queryString === "string" ? v.queryString : "";
  const systemsLabel = typeof v.systemsLabel === "string" && v.systemsLabel.trim() ? v.systemsLabel : "Flashcards";
  const indexRaw = Number(v.index);
  const totalRaw = Number(v.totalCards);
  const updatedAt = typeof v.updatedAt === "string" ? v.updatedAt : new Date(0).toISOString();
  if (!pathwayId || !Number.isFinite(indexRaw) || !Number.isFinite(totalRaw)) return null;
  const index = Math.max(0, Math.floor(indexRaw));
  const totalCards = Math.max(0, Math.floor(totalRaw));
  if (totalCards <= 0 || index <= 0 || index >= totalCards - 1) return null;
  return { pathwayId, queryString, index, totalCards, systemsLabel, updatedAt };
}

function readCustomCheckpoints(): Record<string, FlashcardsCustomSessionCheckpoint> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CUSTOM_CK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainRecord(parsed)) return {};
    const normalized: Record<string, FlashcardsCustomSessionCheckpoint> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const ck = normalizeCustomSessionCheckpoint(value);
      if (ck) normalized[key] = ck;
    }
    return normalized;
  } catch {
    return {};
  }
}

function writeCustomCheckpoints(all: Record<string, FlashcardsCustomSessionCheckpoint>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_CK_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function saveFlashcardsCustomSessionCheckpoint(ck: FlashcardsCustomSessionCheckpoint): void {
  if (!ck.pathwayId.trim()) return;
  const all = readCustomCheckpoints();
  all[ck.pathwayId.trim()] = ck;
  writeCustomCheckpoints(all);
}

export function readFlashcardsCustomSessionCheckpoint(
  pathwayId: string,
): FlashcardsCustomSessionCheckpoint | null {
  const id = pathwayId.trim();
  if (!id) return null;
  return readCustomCheckpoints()[id] ?? null;
}

export function clearFlashcardsCustomSessionCheckpoint(pathwayId: string): void {
  const id = pathwayId.trim();
  if (!id) return;
  const all = readCustomCheckpoints();
  delete all[id];
  writeCustomCheckpoints(all);
}

export function resumeCustomSessionHref(ck: FlashcardsCustomSessionCheckpoint): string {
  const q = new URLSearchParams(ck.queryString);
  q.set("includeCards", "1");
  q.set("resumeIndex", String(Math.max(0, ck.index)));
  return `/app/flashcards/custom?${q.toString()}`;
}
