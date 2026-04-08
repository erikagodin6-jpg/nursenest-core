import type { PathwayFamily } from "@/lib/questions/question-bank-taxonomy";
import { mapRowToCanonicalTopic } from "@/lib/questions/question-bank-taxonomy";
import {
  blueprintDomainFromCanonicalTopic,
  inferBlueprintDomainFromNclexCategory,
  type BlueprintDomainId,
} from "./blueprint-domain";
import { inferClinicalSystemFromHaystack, type ClinicalSystemId } from "./clinical-system-id";

export type QuestionRowForBlueprint = {
  topic: string | null;
  subtopic: string | null;
  bodySystem: string | null;
  exam: string | null;
  nclexClientNeedsCategory: string | null;
  tags?: string[] | null;
};

export function inferBlueprintDomainForRow(family: PathwayFamily, row: QuestionRowForBlueprint): BlueprintDomainId {
  const fromCol = inferBlueprintDomainFromNclexCategory(row.nclexClientNeedsCategory);
  if (fromCol) return fromCol;
  const canonical = mapRowToCanonicalTopic(family, {
    topic: row.topic,
    subtopic: row.subtopic,
    bodySystem: row.bodySystem,
    exam: row.exam,
  });
  return blueprintDomainFromCanonicalTopic(family, canonical);
}

export function inferClinicalSystemForRow(row: QuestionRowForBlueprint): ClinicalSystemId {
  const tagStr = Array.isArray(row.tags) ? row.tags.join(" ") : "";
  const h = `${row.topic ?? ""} ${row.subtopic ?? ""} ${row.bodySystem ?? ""} ${tagStr}`;
  return inferClinicalSystemFromHaystack(h);
}

/** Coarse medication-safety / class buckets for planning (not pharmacology tutoring). */
export type MedicationBucketId =
  | "high_alert"
  | "antimicrobial"
  | "cardiovascular_meds"
  | "insulin_glucose"
  | "opioids_sedation"
  | "anticoagulation"
  | "other_pharm";

export function inferMedicationBuckets(row: QuestionRowForBlueprint): MedicationBucketId[] {
  const h = `${row.topic ?? ""} ${row.subtopic ?? ""} ${row.bodySystem ?? ""} ${Array.isArray(row.tags) ? row.tags.join(" ") : ""}`.toLowerCase();
  const out = new Set<MedicationBucketId>();
  if (/(insulin|glucose|hypoglyc|dka|hyperosmolar)/.test(h)) out.add("insulin_glucose");
  if (/(antibiotic|antimicrobial|culture|sepsis.*antibiot)/.test(h)) out.add("antimicrobial");
  if (/(warfarin|heparin|dabigatran|apixaban|rivaroxaban|anticoagul|thromb)/.test(h)) out.add("anticoagulation");
  if (/(opioid|fentanyl|morphine|sedation|benzodiazepin)/.test(h)) out.add("opioids_sedation");
  if (/(nitro|beta.?block|ace\b|arb\b|digoxin|antiarrhythm)/.test(h)) out.add("cardiovascular_meds");
  if (/(chemo|high.?alert|look.?alike|sound.?alike)/.test(h)) out.add("high_alert");
  if (/(pharm|medication|drug|dosage|adverse|interaction)/.test(h)) out.add("other_pharm");
  return [...out];
}
