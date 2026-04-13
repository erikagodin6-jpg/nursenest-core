/**
 * Internal Link Resolver — core ranking engine.
 *
 * Quality-over-quantity philosophy:
 * - Only include links that are clinically relevant to the current topic/pathway.
 * - Body-system fallback is a last resort — suppressed when strong exact matches exist.
 * - Wrong-pathway targets are excluded unconditionally when context has a pathway.
 * - Match strength (strong / moderate / weak) is tracked so the UI can enforce
 *   a minimum quality bar per section.
 *
 * Resolution pipeline:
 * 1. Normalize topic — run topicKey through synonym map + resolve body system hints.
 * 2. Collect candidates — query registry by exact topicKey, then topicHints, then
 *    body-system fallback (only when exact/hint hits are insufficient).
 * 3. Score each candidate — locale match, pathway match, topic exactness.
 * 4. Filter ineligible — self-links, excluded hrefs, noindex locales, wrong pathway.
 * 5. Apply locale prefix — withMarketingLocale() for correct language URLs.
 * 6. Deduplicate — by resolved href.
 * 7. Quality gate — if strong candidates exist for a kind, drop weak (body-system) ones.
 * 8. Cap by surface density — respect DENSITY_CONFIG per kind.
 * 9. Select anchor text — rotate variants to avoid repetitive anchors.
 */

import type {
  LinkContext,
  LinkCandidate,
  LinkTarget,
  LinkTargetKind,
  ResolvedLinks,
} from "@/lib/linking/internal-link-types";
import { getTargetsForTopic, getTargetsByBodySystem } from "@/lib/linking/link-target-registry";
import { synonymNormalize, synonymNormalizeOrSlugify } from "@/lib/linking/topic-synonym-map";
import { getDensityConfig } from "@/lib/linking/link-density-config";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { isLocaleSeoIndexable } from "@/lib/i18n/language-readiness";

// ── Match strength ────────────────────────────────────────────────────────────

/**
 * Match strength controls the quality gate in buildCandidates.
 *
 * strong   — exact topicKey match (+ optional pathway/locale bonus)
 * moderate — synonym hint match or exact topicKey without pathway match
 * weak     — body-system fallback only; suppressed if strong/moderate exists
 */
export type MatchStrength = "strong" | "moderate" | "weak";

/** Score thresholds for match strength classification. */
const STRONG_THRESHOLD   = 25; // exact topic + pathway match
const MODERATE_THRESHOLD = 45; // exact topic, no/wrong pathway; or hint match

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Lower score = higher priority (sorted ascending).
 *
 * Breakdown (cumulative adjustments from base 60):
 *   −30 exact topicKey match
 *   −20 pathway match (same examFamily)
 *    −5 shared target (examFamily = null) — slight preference over unrelated scoped
 *   −10 locale-prefixed href matches request locale
 *   +30 body-system fallback source (added by collectCandidates, not here)
 */
function scoreTarget(target: LinkTarget, context: LinkContext): number {
  let score = 60;

  const locale = context.locale ?? "en";
  const contextExamFamily = context.pathway?.examFamily ?? null;

  if (target.examFamily === null || target.examFamily === undefined) {
    score -= 5; // shared target — neutral-positive
  } else if (contextExamFamily && target.examFamily === contextExamFamily) {
    score -= 20; // same pathway
  }
  // Note: wrong-pathway targets are excluded before scoring, not penalised here.

  if (context.topicKey && target.topicKey === context.topicKey) {
    score -= 30; // exact topic key
  }

  if (locale !== "en" && target.href.startsWith(`/${locale}/`)) {
    score -= 10; // locale-specific href is a bonus
  }

  return Math.max(0, score);
}

function matchStrength(score: number): MatchStrength {
  if (score <= STRONG_THRESHOLD)   return "strong";
  if (score <= MODERATE_THRESHOLD) return "moderate";
  return "weak";
}

// ── Locale-aware href ─────────────────────────────────────────────────────────

/**
 * Resolve a canonical href to a locale-aware href.
 * Exam-hub paths (us/, canada/, allied-health/) are never locale-prefixed.
 * For other marketing paths (blog, flashcards, lessons index), apply prefix.
 */
function resolveHref(href: string, locale: string): string {
  // Exam-pathway routes: /us/... /canada/... /allied-health/...
  if (
    href.startsWith("/us/") ||
    href.startsWith("/canada/") ||
    href.startsWith("/allied-health")
  ) {
    return href;
  }
  // Check locale is eligible before prefixing
  if (locale !== "en" && !isLocaleSeoIndexable(locale)) {
    // Fallback to English — locale version not safe to link to
    return href;
  }
  return withMarketingLocale(locale, href);
}

// ── Anchor text rotation ──────────────────────────────────────────────────────

/**
 * Pick an anchor text from the target's variants using a stable rotation
 * based on a per-call counter to ensure natural variation across a page.
 */
function pickAnchorText(target: LinkTarget, counter: number): string {
  const all = [target.anchorText, ...target.anchorVariants].filter(Boolean);
  return all[counter % all.length] ?? target.anchorText;
}

// ── Core resolution ───────────────────────────────────────────────────────────

type CandidateWithScore = {
  target: LinkTarget;
  score: number;
  strength: MatchStrength;
  localeMatch: boolean;
  pathwayMatch: boolean;
  resolvedHref: string;
};

function collectCandidates(context: LinkContext): CandidateWithScore[] {
  const locale = context.locale ?? "en";
  const contextExamFamily = context.pathway?.examFamily ?? null;

  const hits: CandidateWithScore[] = [];
  const seenHrefs = new Set<string>();

  const addTargets = (targets: LinkTarget[], scoreOffset = 0) => {
    for (const t of targets) {
      // Skip explicitly ineligible targets
      if (t.eligible === false) continue;

      const resolvedHref = resolveHref(t.href, locale);
      if (seenHrefs.has(resolvedHref)) continue;

      // Skip self-link
      if (context.excludeHrefs?.includes(resolvedHref)) continue;
      if (context.excludeHrefs?.includes(t.href)) continue;

      // Exclude wrong-pathway targets unconditionally when context has a pathway.
      // A shared target (examFamily = null) is always included.
      if (contextExamFamily && t.examFamily && t.examFamily !== contextExamFamily) {
        continue;
      }

      const localeMatch = locale === "en" || resolvedHref.startsWith(`/${locale}/`);
      const pathwayMatch =
        !t.examFamily || !contextExamFamily || t.examFamily === contextExamFamily;

      const rawScore = scoreTarget(t, context) + scoreOffset;
      const score = Math.max(0, rawScore);

      seenHrefs.add(resolvedHref);
      hits.push({
        target: t,
        score,
        strength: matchStrength(score),
        localeMatch,
        pathwayMatch,
        resolvedHref,
      });
    }
  };

  // Pass 1 — exact topicKey match (highest quality)
  if (context.topicKey) {
    addTargets(getTargetsForTopic(context.topicKey), 0);
  }

  // Pass 2 — synonym/hint matches (moderate quality; +10 offset to keep below body-system)
  for (const hint of context.topicHints ?? []) {
    const normalized = synonymNormalize(hint) ?? synonymNormalizeOrSlugify(hint);
    if (normalized && normalized !== context.topicKey) {
      addTargets(getTargetsForTopic(normalized), 10);
    }
  }

  // Pass 3 — body-system fallback (weak; +30 offset ensures these rank last)
  // Only added when we have a bodySystem signal.
  if (context.bodySystem) {
    addTargets(getTargetsByBodySystem(context.bodySystem), 30);
  }

  return hits;
}

function buildCandidates(
  rawHits: CandidateWithScore[],
  kind: LinkTargetKind,
  maxCount: number,
  anchorCounter: { n: number },
): LinkCandidate[] {
  const forKind = rawHits
    .filter((h) => h.target.kind === kind)
    .sort((a, b) => a.score - b.score);

  if (forKind.length === 0) return [];

  // Quality gate: if any strong/moderate candidate exists, suppress weak (body-system)
  // fallbacks. This enforces "fewer, stronger" — we never pad a section with guesses.
  const hasStrong = forKind.some((h) => h.strength !== "weak");
  const filtered = hasStrong
    ? forKind.filter((h) => h.strength !== "weak")
    : forKind;

  return filtered.slice(0, maxCount).map((h) => {
    const text = pickAnchorText(h.target, anchorCounter.n++);
    return {
      kind: h.target.kind,
      topicKey: h.target.topicKey,
      href: h.resolvedHref,
      anchorText: text,
      score: h.score,
      localeMatch: h.localeMatch,
      pathwayMatch: h.pathwayMatch,
    } satisfies LinkCandidate;
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Resolve internal link candidates for a given page context.
 *
 * This is the primary entry point for the linking engine.
 * Call this from server components, API routes, and admin tools.
 *
 * @example
 * ```ts
 * const links = resolveLinks({
 *   surface: "blog",
 *   locale: "fr",
 *   pathway: { countrySlug: "us", roleTrack: "rn", examCode: "nclex-rn", examFamily: "NCLEX-RN" },
 *   topicKey: "heart-failure",
 *   bodySystem: "cardiovascular",
 *   excludeHrefs: ["/blog/heart-failure-nclex"],
 * });
 * ```
 */
export function resolveLinks(context: LinkContext): ResolvedLinks {
  const surface = context.surface;
  const density = getDensityConfig(surface);
  const rawHits = collectCandidates(context);

  const counter = { n: 0 };

  return {
    lessons:    buildCandidates(rawHits, "lesson",    density.lesson.max,    counter),
    flashcards: buildCandidates(rawHits, "flashcard", density.flashcard.max, counter),
    questions:  buildCandidates(rawHits, "question",  density.question.max,  counter),
    blogs:      buildCandidates(rawHits, "blog",      density.blog.max,      counter),
    cat:        buildCandidates(rawHits, "cat",        density.cat.max,       counter),
  };
}

/**
 * Normalize a raw topic string (title, keyword, tag) into a canonical topic key.
 * Safe to call with any string — returns null if not recognized.
 */
export function normalizeTopicKey(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return synonymNormalize(raw) ?? synonymNormalize(raw.toLowerCase()) ?? null;
}

/**
 * Resolve links and return a flat, deduplicated array of all candidates.
 * Useful for serialization or admin inspection.
 */
export function resolveLinksFlat(context: LinkContext): LinkCandidate[] {
  const resolved = resolveLinks(context);
  return [
    ...resolved.lessons,
    ...resolved.flashcards,
    ...resolved.questions,
    ...resolved.blogs,
    ...resolved.cat,
  ].sort((a, b) => a.score - b.score);
}

/**
 * Debug-mode resolution: includes `debugReason` on each candidate and
 * returns the raw scored hits before density capping.
 */
export function resolveLinksDebug(context: LinkContext): {
  context: LinkContext;
  rawHitCount: number;
  resolved: ResolvedLinks;
  flat: LinkCandidate[];
  density: ReturnType<typeof getDensityConfig>;
} {
  const resolved = resolveLinks(context);
  const flat = resolveLinksFlat(context);
  const density = getDensityConfig(context.surface);

  return {
    context,
    rawHitCount: collectCandidates(context).length,
    resolved,
    flat,
    density,
  };
}
