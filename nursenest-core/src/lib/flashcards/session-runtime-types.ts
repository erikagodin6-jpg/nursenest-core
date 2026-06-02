/**
 * Session Runtime Types
 *
 * Pure type definitions — no framework imports, no DB imports.
 * Designed for reuse across: flashcard drills, CAT exam sessions,
 * adaptive remediation queues, and spaced-repetition review sets.
 */

// ── Card lifecycle ─────────────────────────────────────────────────────────

/**
 * UNANSWERED → user has not yet interacted with this card.
 * ANSWERED   → user selected an option; awaiting rationale reveal.
 * REVEALED   → rationale shown; user may set confidence / bookmark before advancing.
 * LOCKED     → card is finalized (already advanced past, or loaded from prior session).
 */
export type SessionCardState = "UNANSWERED" | "ANSWERED" | "REVEALED" | "LOCKED";

export type RuntimeCard = {
  cardId: string;
  state: SessionCardState;

  /** Letter key of the picked answer (A/B/C/D for MCQ). */
  selectedAnswerId?: string;

  /** Whether the rationale panel is visible. */
  revealed: boolean;

  /** Populated after the card reaches REVEALED state. */
  attempt?: {
    correct: boolean;
    guessed?: boolean;
    confidence?: number; // 1–5
    bookmarked?: boolean;
  };
};

// ── Session aggregate ──────────────────────────────────────────────────────

export type SessionMetrics = {
  correct: number;
  incorrect: number;
  guessed: number;
  bookmarked: number;
};

export type SessionRuntime = {
  sessionId: string;

  currentIndex: number;
  totalCards: number;

  cards: RuntimeCard[];

  metrics: SessionMetrics;

  completed: boolean;
};

// ── Reducer action contracts ───────────────────────────────────────────────

export type SessionAction =
  | { type: "PICK_ANSWER"; cardId: string; selectedAnswerId: string }
  | { type: "REVEAL"; cardId: string; correct: boolean }
  | { type: "SET_CONFIDENCE"; cardId: string; confidence: number }
  | { type: "TOGGLE_BOOKMARK"; cardId: string }
  | { type: "SET_GUESSED"; cardId: string; guessed: boolean }
  | { type: "ADVANCE" }
  | { type: "COMPLETE" };

// ── Hydrated payload passed from server to client ─────────────────────────

/**
 * A single clinical media attachment for a flashcard or practice question.
 * Rendered by ClinicalAudioBlock or ClinicalImageBlock.
 * placement="stem" → shown before the question; placement="rationale" → shown in reveal panel.
 */
export type SessionCardClinicalMedia =
  | {
      type: "audio";
      soundId: string;
      soundKind: "cardiac" | "respiratory";
      soundDisplayName?: string;
      placement: "stem" | "rationale";
    }
  | {
      type: "image";
      imageUrl: string;
      imageAlt: string;
      imageCaption?: string;
      placement: "stem" | "rationale";
    };

/** Wire shape: what the server serialises and the client deserialises for each card in a session. */
export type SessionCardPayload = {
  cardId: string;
  positionInDeck: number;
  questionStem: string;
  /** Ordered answer options A–D. */
  answerOptions: Array<{ letter: string; text: string }>;
  correctLetter: string;
  rationaleCorrect: string;
  /** Per-wrong-letter rationales. */
  rationaleIncorrect: Array<{ letter: string; rationale: string }>;
  itemKind: string;
  /**
   * Optional clinical media blocks attached to this card.
   * Rendered by ClinicalAudioBlock / ClinicalImageBlock.
   * Populated by the flashcard-clinical-media-registry at session hydration time.
   */
  clinicalMedia?: SessionCardClinicalMedia[];
};

export type HydratedSessionDeck = {
  id: string;
  title: string;
  pathwayId: string | null;
};

export type HydratedSession = {
  runtime: SessionRuntime;
  cards: SessionCardPayload[];
  deck: HydratedSessionDeck;
};
