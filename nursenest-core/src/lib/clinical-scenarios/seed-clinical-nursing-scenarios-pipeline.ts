import type { ClinicalNursingScenarioTier } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { allBranchingClinicalSeedSpecs } from "@/lib/clinical-scenarios/branching-clinical-scenarios-catalog";
import {
  consequencesFromOptions,
  type BranchingSeedScenarioSpec,
} from "@/lib/clinical-scenarios/branching-scenario-seed-types";

/** Stable title prefix for catalog draft seed rows (dedupe + idempotent runs). */
export const CATALOG_DRAFT_SEED_PREFIX = "catalog-draft-v1";

const ALLOWED_CONSEQUENCE = new Set(["patient improves", "patient unchanged", "patient deteriorates"]);

export function catalogDraftScenarioTitle(spec: BranchingSeedScenarioSpec): string {
  const stripped = spec.title.replace(/^\[seed:[^\]]+\]\s*/, "").trim();
  return `[seed:${CATALOG_DRAFT_SEED_PREFIX}-${spec.seedKey}] ${stripped}`.slice(0, 240);
}

export function catalogDraftTitleMatchPrefix(spec: BranchingSeedScenarioSpec): string {
  return `[seed:${CATALOG_DRAFT_SEED_PREFIX}-${spec.seedKey}]`;
}

export type ClinicalScenarioSeedCli = {
  /** Default true: log only, no DB writes. */
  dryRun: boolean;
  apply: boolean;
  /** When apply + publish: set APPROVED after validation (off by default). */
  publish: boolean;
  tier: ClinicalNursingScenarioTier | null;
  pathwayId: string | null;
  limit: number | null;
  update: boolean;
};

function parseBool(raw: string | undefined, defaultVal: boolean): boolean {
  if (raw == null || raw === "") return defaultVal;
  const v = raw.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return defaultVal;
}

function parseTier(raw: string | undefined): ClinicalNursingScenarioTier | null {
  if (!raw?.trim()) return null;
  const u = raw.trim().toUpperCase();
  if (u === "RN" || u === "RN_NCLEX_RN") return "RN_NCLEX_RN";
  if (u === "PN" || u === "RPN" || u === "RPN_PN" || u === "LPN") return "RPN_PN";
  if (u === "NP") return "NP";
  if (u === "NEW_GRAD" || u === "NEWGRAD" || u === "NEW-GRAD") return "NEW_GRAD";
  return null;
}

function parseLimit(raw: string | undefined): number | null {
  if (!raw?.trim()) return null;
  const n = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

/**
 * Parses `process.argv`-style flags. Defaults: dry-run (no `--apply=true`), no publish, no update.
 */
export function parseClinicalScenarioSeedCliArgs(argv: string[]): ClinicalScenarioSeedCli {
  const map = new Map<string, string>();
  for (const a of argv) {
    if (!a.startsWith("--")) continue;
    const body = a.slice(2);
    const eq = body.indexOf("=");
    if (eq === -1) map.set(body.toLowerCase(), "true");
    else map.set(body.slice(0, eq).toLowerCase(), body.slice(eq + 1));
  }
  const apply = parseBool(map.get("apply"), false);
  const publish = parseBool(map.get("publish"), false);
  const update = parseBool(map.get("update"), false);
  const dryRun = !apply;
  return {
    dryRun,
    apply,
    publish,
    tier: parseTier(map.get("tier")),
    pathwayId: map.get("pathwayid")?.trim() || null,
    limit: parseLimit(map.get("limit")),
    update,
  };
}

export function filterBranchingSpecsForSeed(
  specs: BranchingSeedScenarioSpec[],
  opts: Pick<ClinicalScenarioSeedCli, "tier" | "pathwayId" | "limit">,
): BranchingSeedScenarioSpec[] {
  let out = specs;
  if (opts.tier) out = out.filter((s) => s.tierFocus === opts.tier);
  const pathwayFilter = opts.pathwayId?.trim();
  if (pathwayFilter) out = out.filter((s) => s.pathwayId === pathwayFilter);
  if (opts.limit != null) out = out.slice(0, opts.limit);
  return out;
}

/** `b1-<tier>-<topic-slug>` → topic slug (may contain hyphens). */
export function topicSlugFromSeedKey(seedKey: string): string | null {
  if (!seedKey.startsWith("b1-")) return null;
  const rest = seedKey.slice(3);
  const i = rest.indexOf("-");
  if (i === -1) return null;
  const slug = rest.slice(i + 1).trim();
  return slug || null;
}

export function enrichCatalogDraftReferencesJson(spec: BranchingSeedScenarioSpec): Prisma.InputJsonValue {
  const base = Array.isArray(spec.referencesJson) ? [...(spec.referencesJson as unknown[])] : [];
  const slug = topicSlugFromSeedKey(spec.seedKey);
  const extra: Record<string, unknown>[] = [
    { kind: "catalog_seed", seedKey: spec.seedKey, pipeline: CATALOG_DRAFT_SEED_PREFIX },
  ];
  if (slug) {
    extra.push({ kind: "related_topic_slug", slug });
    extra.push({
      kind: "suggested_pathway_lesson_hint",
      note: "Link pathway lessons when product maps slug → pathwayLessonId; safe placeholder for authoring.",
      slug,
    });
  }
  return [...base, ...extra] as unknown as Prisma.InputJsonValue;
}

/** Validates branching seed content for production pipeline (stages, rationales, UI consequence strings). */
export function validateBranchingSpecForProductionSeed(spec: BranchingSeedScenarioSpec): string[] {
  const errors: string[] = [];
  if (spec.stages.length < 3 || spec.stages.length > 6) {
    errors.push(`${spec.seedKey}: expected 3–6 stages, got ${spec.stages.length}`);
  }
  for (const st of spec.stages) {
    if (st.options.length < 2) errors.push(`${spec.seedKey} stage ${st.orderIndex}: need at least 2 options`);
    const consMap = consequencesFromOptions(st.options) as Record<string, string>;
    for (const o of st.options) {
      if (!o.rationale?.trim()) errors.push(`${spec.seedKey} stage ${st.orderIndex}: option missing rationale`);
      const msg = consMap[o.id];
      if (!msg || !ALLOWED_CONSEQUENCE.has(msg)) {
        errors.push(
          `${spec.seedKey} stage ${st.orderIndex}: consequence must be patient improves|patient unchanged|patient deteriorates (got ${String(msg)})`,
        );
      }
    }
  }
  return errors;
}

export function allCatalogBranchingSpecsForSeed(): BranchingSeedScenarioSpec[] {
  return allBranchingClinicalSeedSpecs();
}

/** Pure upsert intent for idempotent DB scripts (duplicate title key → skip unless update). */
export function resolveCatalogSeedUpsertAction(
  existingId: string | null | undefined,
  update: boolean,
): "create" | "update" | "skip" {
  if (!existingId) return "create";
  if (!update) return "skip";
  return "update";
}

export function catalogSeedCountsByTier(specs: BranchingSeedScenarioSpec[]): Record<ClinicalNursingScenarioTier, number> {
  const out: Record<ClinicalNursingScenarioTier, number> = {
    RN_NCLEX_RN: 0,
    RPN_PN: 0,
    NP: 0,
    NEW_GRAD: 0,
  };
  for (const s of specs) out[s.tierFocus] += 1;
  return out;
}
