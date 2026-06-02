/**
 * Unified render routing for flashcard question types.
 *
 * FlashcardStudyRenderer dispatches to a typed renderer based on itemKind:
 *
 *   MCQRenderer       — RECALL, CLINICAL, PRIORITY, CONCEPT, MED_SAFETY, LAB_TREND
 *   SATARenderer      — SATA (select-all-that-apply)
 *   ECGRenderer       — ECG_STRIP (rhythm strip + identify options)
 *   BowtieRenderer    — BOWTIE (condition → action → outcome columns)
 *   LegacyRenderer    — null itemKind or unknown kind (front/back card)
 *
 * This module is pure TypeScript — no React, no DB, no side effects.
 * Used by the study session component to decide which renderer to mount.
 */

import type { FlashcardItemKind } from "@prisma/client";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "./flashcard-exam-style";

// ─── Render route discriminants ───────────────────────────────────────────────

export const MCQ_KINDS = new Set<FlashcardItemKind>([
  "RECALL",
  "CLINICAL",
  "PRIORITY",
  "CONCEPT",
  "MED_SAFETY",
  "LAB_TREND",
]);

export type FlashcardRenderRoute =
  | { renderer: "mcq"; payload: ExamMicroQuestionPayload }
  | { renderer: "sata"; payload: SataQuestionPayload }
  | { renderer: "ecg"; payload: ExamMicroQuestionPayload; imageUrl: string }
  | { renderer: "bowtie"; itemKind: "BOWTIE" }
  | { renderer: "legacy"; front: string; back: string };

// ─── Router ───────────────────────────────────────────────────────────────────

export type RouterInput = {
  itemKind: FlashcardItemKind | null;
  front: string;
  back: string;
  /** Resolved by parseExamMicroQuestionFromDbFields or hydrateCanonicalMcq */
  mcqPayload: ExamMicroQuestionPayload | null;
  /** Resolved by hydrateCanonicalSata */
  sataPayload: SataQuestionPayload | null;
  /** ECG strip image URL for ECG_STRIP cards */
  ecgImageUrl?: string | null;
};

/**
 * Returns the render route for a flashcard.
 *
 * Priority:
 *   1. SATA payload (canonical SATA if sataPayload is set)
 *   2. ECG_STRIP with image → ecg renderer
 *   3. BOWTIE → bowtie renderer (payload resolved by dedicated component)
 *   4. MCQ kinds with mcqPayload → mcq renderer
 *   5. Fallback → legacy front/back renderer
 */
export function resolveFlashcardRenderRoute(input: RouterInput): FlashcardRenderRoute {
  const { itemKind, front, back, mcqPayload, sataPayload, ecgImageUrl } = input;

  if (itemKind === "SATA" && sataPayload) {
    return { renderer: "sata", payload: sataPayload };
  }

  if (itemKind === "ECG_STRIP" && mcqPayload && ecgImageUrl) {
    return { renderer: "ecg", payload: mcqPayload, imageUrl: ecgImageUrl };
  }

  if (itemKind === "BOWTIE") {
    return { renderer: "bowtie", itemKind: "BOWTIE" };
  }

  if (itemKind && MCQ_KINDS.has(itemKind) && mcqPayload) {
    return { renderer: "mcq", payload: mcqPayload };
  }

  return { renderer: "legacy", front, back };
}

// ─── Unsupported-format fallback ─────────────────────────────────────────────

/**
 * True when the card declares a specialized itemKind but no typed payload was resolved.
 * The caller should render an "unsupported format" alert rather than silently
 * falling back to the front/back card (which would show raw JSON to the learner).
 */
export function isMissingPayloadForDeclaredKind(input: RouterInput): boolean {
  const { itemKind, mcqPayload, sataPayload } = input;
  if (!itemKind) return false;

  if (itemKind === "SATA") return sataPayload === null;
  if (itemKind === "BOWTIE") return false; // bowtie has no pre-resolved payload
  if (itemKind === "ECG_STRIP") return mcqPayload === null;
  if (MCQ_KINDS.has(itemKind)) return mcqPayload === null;
  return false;
}

// ─── Renderer name helpers ────────────────────────────────────────────────────

export function rendererLabelForKind(kind: FlashcardItemKind | null): string {
  if (!kind) return "Classic";
  switch (kind) {
    case "SATA": return "Select All That Apply";
    case "ECG_STRIP": return "ECG Strip";
    case "BOWTIE": return "Bowtie / Clinical Judgment";
    case "LAB_TREND": return "Lab Trend";
    case "MED_SAFETY": return "Medication Safety";
    case "CLINICAL": return "Clinical Judgment";
    case "PRIORITY": return "Priority";
    case "RECALL": return "Recall";
    case "CONCEPT": return "Concept";
  }
}
