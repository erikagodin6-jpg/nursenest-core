"use client";

export type EmergencyStudyFlashcard = {
  id: string;
  front: string;
  back: string;
  rationale?: string;
  pearl?: string;
};

export type EmergencyStudyQuestion = {
  id: string;
  stem: string;
  answer: string;
  rationale: string;
};

export type EmergencyStudyInventory = {
  id: string;
  title: string;
  pathway: string;
  system: string;
  flashcards: EmergencyStudyFlashcard[];
  questions: EmergencyStudyQuestion[];
  pearls: string[];
};

export type EmergencyStudyCard = {
  id: string;
  front: string;
  back: string;
  topic: string;
  subtopic: string | null;
  sourceKey: string;
  pathwayId: string | null;
  explanation: string;
};

const EMERGENCY_STUDY_BASE = "/emergency-study";

function selectedInventoryFile(pathwayId: string, queryString: string): string {
  const haystack = `${pathwayId} ${queryString}`.toLowerCase();
  if (/\b(np|cnple|fnp|pmhnp|agpcnp|whnp|pnp)\b/.test(haystack)) return "np-primary-care.json";
  if (/\b(rpn|rex|rex-pn|pn|nclex-pn|lpn|lvn)\b/.test(haystack)) return "rpn-fundamentals.json";
  if (/resp|oxygen|airway|copd|asthma|ventilat/.test(haystack)) return "rn-respiratory.json";
  return "rn-cardiology.json";
}

function isEmergencyStudyInventory(value: unknown): value is EmergencyStudyInventory {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.pathway === "string" &&
    typeof v.system === "string" &&
    Array.isArray(v.flashcards) &&
    v.flashcards.every((card) => {
      const c = card as Record<string, unknown>;
      return typeof c.id === "string" && typeof c.front === "string" && typeof c.back === "string";
    })
  );
}

export async function loadEmergencyStudyInventory(args: {
  pathwayId: string;
  queryString: string;
  signal?: AbortSignal;
}): Promise<EmergencyStudyInventory | null> {
  const file = selectedInventoryFile(args.pathwayId, args.queryString);
  const res = await fetch(`${EMERGENCY_STUDY_BASE}/${file}`, {
    cache: "force-cache",
    signal: args.signal,
  });
  if (!res.ok) return null;
  const json = await res.json();
  return isEmergencyStudyInventory(json) ? json : null;
}

export function emergencyInventoryToFlashcards(
  inventory: EmergencyStudyInventory,
  pathwayId: string | null,
): EmergencyStudyCard[] {
  return inventory.flashcards.map((card) => ({
    id: `emergency:${inventory.id}:${card.id}`,
    front: card.front,
    back: card.back,
    topic: inventory.system,
    subtopic: inventory.pathway,
    sourceKey: inventory.id,
    pathwayId,
    explanation: [card.rationale, card.pearl ? `Clinical pearl: ${card.pearl}` : null]
      .filter(Boolean)
      .join("\n\n"),
  }));
}
