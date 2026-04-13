"use client";

export type StudyItemState = {
  starred?: boolean;
  saved?: boolean;
  confusing?: boolean;
  highlighted?: boolean;
  note?: string;
};

export type StudyQuickFilters = {
  starredOnly?: boolean;
  savedOnly?: boolean;
  notesOnly?: boolean;
  confusingOnly?: boolean;
};

const STORAGE_KEY = "flashcard-study-item-state:v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRawState(): Record<string, StudyItemState> {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StudyItemState>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRawState(state: Record<string, StudyItemState>): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence; ignore storage failures.
  }
}

export function getStudyItemState(cardId: string): StudyItemState {
  if (!cardId) return {};
  return readRawState()[cardId] ?? {};
}

export function setStudyItemState(cardId: string, patch: Partial<StudyItemState>): StudyItemState {
  if (!cardId) return {};
  const all = readRawState();
  const existing = all[cardId] ?? {};
  const next: StudyItemState = {
    ...existing,
    ...patch,
  };
  if (!next.note?.trim()) delete next.note;
  all[cardId] = next;
  writeRawState(all);
  return next;
}

export function cardMatchesStudyFilters(cardId: string, filters: StudyQuickFilters): boolean {
  if (!filters.starredOnly && !filters.savedOnly && !filters.notesOnly && !filters.confusingOnly) return true;
  const state = getStudyItemState(cardId);
  if (filters.starredOnly && !state.starred) return false;
  if (filters.savedOnly && !state.saved) return false;
  if (filters.notesOnly && !(state.note && state.note.trim().length > 0)) return false;
  if (filters.confusingOnly && !state.confusing) return false;
  return true;
}

export function hasActiveStudyFilters(filters: StudyQuickFilters): boolean {
  return Boolean(filters.starredOnly || filters.savedOnly || filters.notesOnly || filters.confusingOnly);
}

export function countSavedStudyItems(): { starred: number; saved: number; noted: number; confusing: number } {
  const all = readRawState();
  let starred = 0;
  let saved = 0;
  let noted = 0;
  let confusing = 0;
  for (const state of Object.values(all)) {
    if (state.starred) starred += 1;
    if (state.saved) saved += 1;
    if (state.note && state.note.trim().length > 0) noted += 1;
    if (state.confusing) confusing += 1;
  }
  return { starred, saved, noted, confusing };
}

/**
 * Deterministic local-only bridge for server-side session building.
 * Returns card IDs that match the selected quick filters.
 */
export function getStudyItemIdsMatchingFilters(filters: StudyQuickFilters, max = 500): string[] {
  const all = readRawState();
  const ids = Object.keys(all)
    .filter((cardId) => cardMatchesStudyFilters(cardId, filters))
    .sort();
  return ids.slice(0, Math.max(0, max));
}
