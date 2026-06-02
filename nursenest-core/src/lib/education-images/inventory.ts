import { basenameWithoutExtension } from "@/lib/education-images/normalize-concept-token";
import educationImageInventory from "@/config/education-image-inventory.json" with { type: "json" };

export type EducationImageInventory = {
  version: number;
  generatedFrom?: string;
  keys: string[];
};

let educationImageInventoryCache: EducationImageInventory | null = null;

function getEducationImageInventory(): EducationImageInventory {
  if (educationImageInventoryCache) return educationImageInventoryCache;
  educationImageInventoryCache = educationImageInventory as EducationImageInventory;
  return educationImageInventoryCache;
}

/** Unique basenames (no extension) from inventory keys — one preferred extension per basename. */
export function listInventoryBasenames(): string[] {
  const seen = new Set<string>();
  for (const k of getEducationImageInventory().keys) {
    seen.add(basenameWithoutExtension(k));
  }
  return [...seen];
}

export function getInventoryKeys(): readonly string[] {
  return getEducationImageInventory().keys;
}
