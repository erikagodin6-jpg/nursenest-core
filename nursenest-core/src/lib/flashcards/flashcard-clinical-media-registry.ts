/**
 * Clinical media registry for flashcard decks.
 *
 * Maps card IDs → ClinicalAudioBlock / ClinicalImageBlock attachments so audio
 * and images are fetched from the shared registry once and reused everywhere
 * (lessons, flashcards, practice tests, CAT) without duplicating assets.
 *
 * To add audio to a new card:
 *   1. Find the soundId in CARDIAC_SOUND_RECORDS or RESPIRATORY_SOUND_RECORDS.
 *   2. Add an entry below using the card's DB id or content-file id.
 *   3. The session hydration server reads this map and injects clinicalMedia
 *      into SessionCardPayload before serialising to the client.
 */

import type { SessionCardClinicalMedia } from "@/lib/flashcards/session-runtime-types";

export type FlashcardClinicalMediaEntry = {
  /** Card IDs from content seed files or DB. */
  cardIds: string[];
  media: SessionCardClinicalMedia[];
};

// ── Cardiac Medications deck ──────────────────────────────────────────────────

const CARDIAC_MEDS: FlashcardClinicalMediaEntry[] = [
  {
    // Digoxin: therapeutic level check → apical pulse auscultation
    cardIds: ["pn-cardiac-fc-01", "pn-cardiac-fc-15"],
    media: [
      { type: "audio", soundId: "s1", soundKind: "cardiac", soundDisplayName: "S1 — apical pulse landmark", placement: "rationale" },
    ],
  },
  {
    // Digoxin toxicity triad — bradycardia alters S1/S2 timing
    cardIds: ["pn-cardiac-fc-02"],
    media: [
      { type: "audio", soundId: "s1", soundKind: "cardiac", soundDisplayName: "S1/S2 — note rate and regularity", placement: "rationale" },
    ],
  },
  {
    // Before giving digoxin — check apical pulse for 1 full minute
    cardIds: ["pn-cardiac-fc-04"],
    media: [
      { type: "audio", soundId: "s1", soundKind: "cardiac", soundDisplayName: "Apical pulse — S1 marks onset of systole", placement: "stem" },
    ],
  },
  {
    // Beta-blockers for HF — S3 gallop context
    cardIds: ["pn-cardiac-fc-08", "pn-cardiac-fc-18"],
    media: [
      { type: "audio", soundId: "s3", soundKind: "cardiac", soundDisplayName: "S3 gallop — heart failure context", placement: "rationale" },
    ],
  },
  {
    // Diltiazem AFib + bradycardia — irregular rhythm
    cardIds: ["pn-cardiac-fc-11"],
    media: [
      { type: "audio", soundId: "s1", soundKind: "cardiac", soundDisplayName: "Irregular S1 — atrial fibrillation rhythm", placement: "stem" },
    ],
  },
  {
    // Digoxin + hypokalemia → increased toxicity risk, S3/S4 in HF
    cardIds: ["pn-cardiac-fc-16"],
    media: [
      { type: "audio", soundId: "s3", soundKind: "cardiac", soundDisplayName: "S3 — fluid overload / HF", placement: "rationale" },
      { type: "audio", soundId: "s4", soundKind: "cardiac", soundDisplayName: "S4 — reduced compliance", placement: "rationale" },
    ],
  },
  {
    // Prioritise assessment — digoxin + furosemide + lisinopril
    cardIds: ["pn-cardiac-fc-20"],
    media: [
      { type: "audio", soundId: "s1", soundKind: "cardiac", soundDisplayName: "Apical auscultation — check before digoxin", placement: "stem" },
      { type: "audio", soundId: "s3", soundKind: "cardiac", soundDisplayName: "S3 — fluid overload alert", placement: "rationale" },
    ],
  },
];

// ── Diuretics deck ────────────────────────────────────────────────────────────

const DIURETICS: FlashcardClinicalMediaEntry[] = [
  {
    // Furosemide: check before administration → listen for crackles first
    cardIds: ["pn-diur-fc-03"],
    media: [
      { type: "audio", soundId: "fine-crackles", soundKind: "respiratory", soundDisplayName: "Fine crackles — volume overload indicator", placement: "stem" },
    ],
  },
  {
    // 4 lb overnight weight gain → pulmonary fluid
    cardIds: ["pn-diur-fc-07", "pn-diur-fc-14"],
    media: [
      { type: "audio", soundId: "fine-crackles", soundKind: "respiratory", soundDisplayName: "Fine crackles at lung bases — early fluid overload", placement: "rationale" },
    ],
  },
  {
    // Oliguria on furosemide for HF — signs of inadequate response
    cardIds: ["pn-diur-fc-16"],
    media: [
      { type: "audio", soundId: "coarse-crackles", soundKind: "respiratory", soundDisplayName: "Coarse crackles — severe pulmonary edema", placement: "rationale" },
    ],
  },
  {
    // Spironolactone in HF — S3 + crackle context
    cardIds: ["pn-diur-fc-20"],
    media: [
      { type: "audio", soundId: "s3", soundKind: "cardiac", soundDisplayName: "S3 — heart failure context for spironolactone use", placement: "rationale" },
      { type: "audio", soundId: "fine-crackles", soundKind: "respiratory", soundDisplayName: "Fine crackles — pulmonary oedema", placement: "rationale" },
    ],
  },
];

// ── DVT deck ──────────────────────────────────────────────────────────────────

const DVT: FlashcardClinicalMediaEntry[] = [
  {
    // Sudden dyspnea in DVT patient → PE → pleural friction rub + crackles
    cardIds: ["pn-dvt-fc-03"],
    media: [
      { type: "audio", soundId: "pleural-friction-rub", soundKind: "respiratory", soundDisplayName: "Pleural friction rub — pulmonary infarction / pleuritis", placement: "rationale" },
      { type: "audio", soundId: "fine-crackles", soundKind: "respiratory", soundDisplayName: "Fine crackles — pulmonary congestion in PE", placement: "rationale" },
    ],
  },
];

// ── CNPLE Geriatrics deck ─────────────────────────────────────────────────────

const CNPLE: FlashcardClinicalMediaEntry[] = [
  {
    // Goals of care in advanced COPD → wheeze context
    cardIds: ["cnple-ger-12"],
    media: [
      { type: "audio", soundId: "wheezes", soundKind: "respiratory", soundDisplayName: "Wheeze — COPD advanced disease context", placement: "rationale" },
    ],
  },
];

// ── Combined registry ─────────────────────────────────────────────────────────

export const FLASHCARD_CLINICAL_MEDIA_ENTRIES: readonly FlashcardClinicalMediaEntry[] = [
  ...CARDIAC_MEDS,
  ...DIURETICS,
  ...DVT,
  ...CNPLE,
];

/** Flat map: cardId → media blocks. Built once at module load. */
const _byCardId = new Map<string, SessionCardClinicalMedia[]>();
for (const entry of FLASHCARD_CLINICAL_MEDIA_ENTRIES) {
  for (const cardId of entry.cardIds) {
    const existing = _byCardId.get(cardId) ?? [];
    _byCardId.set(cardId, [...existing, ...entry.media]);
  }
}

/**
 * Returns clinical media blocks for a card, or undefined when none are registered.
 * Used by session hydration to populate SessionCardPayload.clinicalMedia.
 */
export function getFlashcardClinicalMedia(cardId: string): SessionCardClinicalMedia[] | undefined {
  const blocks = _byCardId.get(cardId);
  return blocks?.length ? blocks : undefined;
}

/** All card IDs that have registered media (for diagnostics / tests). */
export function allFlashcardIdsWithMedia(): string[] {
  return [..._byCardId.keys()];
}
