import type { TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { LessonContent } from "@legacy-client/data/lessons/types";
import { contentMap, loadNpGeneratedBatches } from "@legacy-client/data/lessons/index";

/**
 * Mirrors `server/lesson-content-api.ts` deriveTier — slug / optional embedded tier metadata.
 */
export function deriveTier(id: string, metadata?: { tier?: string }): string {
  if (metadata?.tier && ["rpn", "rn", "np", "free", "allied", "imaging", "newgrad"].includes(metadata.tier)) {
    return metadata.tier;
  }
  if (/-np$/.test(id) || /-advanced-np$/.test(id) || /-management-np$/.test(id) || /-np-/.test(id)) return "np";
  if (/-rn$/.test(id) || /-basics-rn$/.test(id) || /-rn-/.test(id)) return "rn";
  if (/-rpn$/.test(id) || /-basics-rpn$/.test(id) || /-rpn-/.test(id)) return "rpn";
  if (id.startsWith("free-") || id.endsWith("-free")) return "free";
  return "rpn";
}

/** Mirrors `server/lesson-content-api.ts` deriveCategory — title keyword heuristics. */
export function deriveCategory(lesson: { title?: unknown }): string {
  const raw = lesson.title;
  const title =
    typeof raw === "object" && raw !== null && "en" in (raw as object)
      ? String((raw as { en?: string }).en ?? "")
      : String(raw ?? "");
  const t = title.toLowerCase();
  if (/cardiac|heart|ecg|ekg|arrhyth|hypertens|chf|angina|mi\b/.test(t)) return "Cardiovascular";
  if (/respiratory|lung|asthma|copd|pneum|oxygen|airway|breath/.test(t)) return "Respiratory";
  if (/neuro|brain|stroke|seizure|parkinson|alzheim|ms\b|meningit/.test(t)) return "Neurological";
  if (/gi\b|gastro|bowel|liver|hepat|pancrea|colon|abdomin|constip/.test(t)) return "Gastrointestinal";
  if (/renal|kidney|dialysis|uti\b|bladder|urinar/.test(t)) return "Renal/Urinary";
  if (/diabet|thyroid|adrenal|endocrin|insulin|glucose|a1c|cushing|addison/.test(t)) return "Endocrine";
  if (/blood|anemia|hemato|platelet|coagul|leukemia|lymph|transfus|hemophil|thalass/.test(t)) return "Hematology";
  if (/pedia|child|infant|neonat|newborn|apgar/.test(t)) return "Pediatrics";
  if (/matern|pregnan|labor|delivery|obstet|prenatal|postpartum|lochia|antepartum/.test(t)) return "Maternity";
  if (/mental|psych|depress|anxiety|bipolar|schizo|suicid/.test(t)) return "Mental Health";
  if (/infect|sepsis|mrsa|vre|clostrid|hiv|aids|hepatitis|tb\b|tuberculosis/.test(t)) return "Infection Control";
  if (/pharm|medic|drug|dose|dosage/.test(t)) return "Pharmacology";
  if (/skin|wound|burn|dermat|rash|cellulitis|shingles|pressure/.test(t)) return "Integumentary";
  if (/eye|ear|vision|hearing|glauco|cataract|macula/.test(t)) return "HEENT";
  if (/bone|fracture|joint|musculo|ortho|arthr|osteopor/.test(t)) return "Musculoskeletal";
  if (/cancer|oncolog|tumor|chemo|radiation|malignan/.test(t)) return "Oncology";
  if (/electrolyte|sodium|potassium|calcium|magnesium|phosph|fluid|dehydr|acid.base/.test(t)) return "Fluid & Electrolytes";
  if (/assessment|vital|physical exam/.test(t)) return "Assessment";
  if (/safety|fall|restrain|error|ethic|legal|delegation|priorit/.test(t)) return "Fundamentals";
  if (/pain|comfort|palliative|hospice/.test(t)) return "Pain Management";
  if (/nutrition|diet|feed|ngt|peg|enteral|parenteral/.test(t)) return "Nutrition";
  if (/bph|prostat/.test(t)) return "Renal/Urinary";
  return "General";
}

/** Same ladder as `server/paywall-tier-rules.ts` allowedLessonContentTiersForUser. */
export function allowedLessonContentTiersForUser(userTier: string): string[] {
  const t = (userTier || "free").toLowerCase();
  if (t === "admin") return ["free", "rpn", "rn", "np", "allied", "imaging", "newgrad", "lvn"];
  if (t === "free") return ["free"];
  if (t === "rpn") return ["free", "rpn"];
  if (t === "rn") return ["free", "rpn", "rn"];
  if (t === "np") return ["free", "rpn", "rn", "np"];
  if (t === "allied") return ["free", "allied"];
  if (t === "imaging") return ["free", "imaging"];
  if (t === "full_access" || t === "certification_prep" || t === "new_grad_toolkit") {
    return ["free", "rpn", "rn", "np", "allied", "imaging"];
  }
  return ["free", t];
}

/** Map Prisma subscription scope → monolith lesson paywall tier string. */
export function prismaTierToLegacyLessonUserTier(scope: AccessScope): string {
  if (scope.reason === "admin_override") return "admin";
  const tier = scope.tier as TierCode | null;
  if (!tier) return "free";
  switch (tier) {
    case "RPN":
      return "rpn";
    case "LVN_LPN":
      return "rn";
    case "RN":
      return "rn";
    case "NP":
      return "np";
    case "ALLIED":
      return "allied";
    default:
      return "free";
  }
}

let npBatchesEnsured = false;

async function ensureNpBatchesLoaded(): Promise<void> {
  if (npBatchesEnsured) return;
  await loadNpGeneratedBatches();
  npBatchesEnsured = true;
}

/** Display title for a monolith {@link LessonContent} row (supports `title.en` from older bundles). */
export function legacyContentMapLessonTitle(lesson: LessonContent, id: string): string {
  const raw = lesson.title as unknown;
  if (typeof raw === "object" && raw !== null && "en" in (raw as object)) {
    return String((raw as { en?: string }).en ?? id);
  }
  return String(raw ?? id);
}

function lessonSummarySnippet(lesson: LessonContent): string | null {
  const cellular = typeof lesson.cellular === "string" ? lesson.cellular : lesson.cellular?.content ?? "";
  const t = cellular.trim();
  if (!t) return null;
  return t.length > 220 ? `${t.slice(0, 217)}…` : t;
}

export type LegacyContentMapListRow = {
  id: string;
  title: string;
  summary: string | null;
  category: string;
};

export function canAccessLegacyContentMapLesson(scope: AccessScope, lessonId: string, lesson: LessonContent): boolean {
  const userKey = prismaTierToLegacyLessonUserTier(scope);
  const allowed = new Set(allowedLessonContentTiersForUser(userKey));
  const lt = deriveTier(lessonId, lesson as { tier?: string });
  return allowed.has(lt);
}

/** All list rows for the subscriber tier (sorted by title). */
export async function listLegacyContentMapLessonsForScope(scope: AccessScope): Promise<LegacyContentMapListRow[]> {
  await ensureNpBatchesLoaded();
  const userKey = prismaTierToLegacyLessonUserTier(scope);
  const allowed = new Set(allowedLessonContentTiersForUser(userKey));
  const out: LegacyContentMapListRow[] = [];
  for (const [id, lesson] of Object.entries(contentMap) as [string, LessonContent][]) {
    const lt = deriveTier(id, lesson as { tier?: string });
    if (!allowed.has(lt)) continue;
    out.push({
      id,
      title: legacyContentMapLessonTitle(lesson, id),
      summary: lessonSummarySnippet(lesson),
      category: deriveCategory(lesson),
    });
  }
  out.sort((a, b) => a.title.localeCompare(b.title));
  return out;
}

export async function paginateLegacyContentMapLessons(
  scope: AccessScope,
  page: number,
  pageSize: number,
): Promise<{ total: number; page: number; pageCount: number; rows: LegacyContentMapListRow[] }> {
  const all = await listLegacyContentMapLessonsForScope(scope);
  const total = all.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  const rows = all.slice(start, start + pageSize);
  return { total, page: safePage, pageCount, rows };
}

export async function getLegacyContentMapLessonById(id: string): Promise<LessonContent | null> {
  await ensureNpBatchesLoaded();
  const hit = contentMap[id];
  return hit ?? null;
}
