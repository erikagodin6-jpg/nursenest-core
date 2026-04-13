import "server-only";

import { existsSync, readFileSync } from "fs";
import path from "path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Localized prose overlay for a single pre-nursing module.
 *
 * All fields are optional — the module view falls back to English TSX content
 * for any field not present.  Interactive components (quizzes, matching exercises)
 * always render from the English TSX source; only prose sections are overlaid.
 */
export type PreNursingModuleOverlay = {
  /** Short introductory paragraph shown above the TSX module. */
  overview?: string;
  /** Bullet-point list of key concepts (rendered as <ul>). */
  key_concepts?: string[];
  /** Nursing-action paragraph shown after the main module body. */
  nursing_responsibilities?: string;
  /** Clinical pearls note. */
  clinical_pearls?: string;
  /** Patient education paragraph. */
  patient_education?: string;
  /** Summary bullet list (rendered as <ul>). */
  key_takeaways?: string[];
};

/**
 * Per-question translation overlay for the pre-nursing question bank.
 * Keyed by `PreNursingQuestion.id` (stable, e.g. "ap-01").
 * The `correct` grading index is canonical — never included in the overlay.
 */
export type PreNursingQuestionOverlay = {
  /** Translated question stem. */
  stem?: string;
  /** Translated option labels — parallel order to the English bank. */
  options?: string[];
  /** Translated rationale shown after answering. */
  rationale?: string;
};

// ── Module overlay cache ──────────────────────────────────────────────────────

const moduleOverlayCache = new Map<string, PreNursingModuleOverlay | null>();

// ── Question overlay cache ────────────────────────────────────────────────────

const questionOverlayCache = new Map<string, Record<string, PreNursingQuestionOverlay> | null>();

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveEducationalI18nRoot(): string {
  const cwd = /* turbopackIgnore: true */ process.cwd();
  const primary = path.join(cwd, "public", "i18n", "educational-overlays");
  const nestedMonorepo = path.join(cwd, "nursenest-core", "public", "i18n", "educational-overlays");
  if (existsSync(primary)) return primary;
  if (existsSync(nestedMonorepo)) return nestedMonorepo;
  return primary;
}

function readJsonFile<T>(fp: string): T | null {
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(/* turbopackIgnore: true */ fp, "utf8")) as T;
  } catch (e) {
    safeServerLog("i18n", "pre_nursing_overlay_parse_failed", {
      path: fp,
      detail: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the module prose overlay for a given locale and slug.
 * English always returns `null` (modules render native TSX).
 * Non-English locales return `null` when the overlay file is absent — callers
 * should treat `null` as "render English content".
 *
 * Files are cached per `locale:slug` after first read.
 */
export function loadPreNursingModuleOverlay(
  locale: string,
  slug: string,
): PreNursingModuleOverlay | null {
  if (locale === DEFAULT_MARKETING_LOCALE) return null;
  const key = `${locale}:${slug}`;
  if (moduleOverlayCache.has(key)) return moduleOverlayCache.get(key) ?? null;
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "pre-nursing-modules", `${slug}.json`);
  const data = readJsonFile<PreNursingModuleOverlay>(fp);
  const overlay = data && typeof data === "object" ? data : null;
  moduleOverlayCache.set(key, overlay);
  return overlay;
}

/**
 * Returns the full question overlay bundle for a locale.
 * English always returns `{}`.  Non-English returns an empty object when the
 * overlay file is absent.
 *
 * Bundle is cached per locale after first read.
 */
export function loadPreNursingQuestionsOverlay(
  locale: string,
): Record<string, PreNursingQuestionOverlay> {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const hit = questionOverlayCache.get(locale);
  if (hit !== undefined) return hit ?? {};
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "pre-nursing-questions.json");
  const data = readJsonFile<Record<string, PreNursingQuestionOverlay>>(fp);
  const bundle = data && typeof data === "object" ? data : null;
  questionOverlayCache.set(locale, bundle);
  return bundle ?? {};
}

/**
 * Applies a question overlay to a set of questions from the English bank.
 * Returns a new array; questions without an overlay entry are returned unchanged.
 * The `correct` index is never overridden.
 */
export function applyPreNursingQuestionsOverlay<
  Q extends { id: string; question: string; options: string[]; rationale: string },
>(questions: Q[], overlay: Record<string, PreNursingQuestionOverlay>): Q[] {
  if (Object.keys(overlay).length === 0) return questions;
  return questions.map((q) => {
    const o = overlay[q.id];
    if (!o) return q;
    return {
      ...q,
      question: o.stem ?? q.question,
      options: o.options ?? q.options,
      rationale: o.rationale ?? q.rationale,
    };
  });
}
