import inventoryJson from "@/config/education-image-inventory.json";
import { basenameWithoutExtension } from "@/lib/education-images/normalize-concept-token";

export type EducationImageInventory = {
  version: number;
  generatedFrom?: string;
  keys: string[];
};

const data = inventoryJson as EducationImageInventory;

/** Unique basenames (no extension) from inventory keys — one preferred extension per basename. */
export function listInventoryBasenames(): string[] {
  const seen = new Set<string>();
  for (const k of data.keys) {
    seen.add(basenameWithoutExtension(k));
  }
  return [...seen];
}

export function getInventoryKeys(): readonly string[] {
  return data.keys;
}
