/**
 * Admin Internal Linking Inspector
 *
 * GET /api/admin/linking/inspect
 *
 * Query parameters:
 *   topicKey   — canonical topic key (e.g. "heart-failure")
 *   rawTopic   — raw term to normalize first (e.g. "HF" → "heart-failure")
 *   locale     — BCP-47 locale (default: "en")
 *   surface    — page surface (blog | lesson | flashcard | question | cat_result | hub)
 *   examFamily — exam family filter (e.g. "NCLEX-RN")
 *   bodySystem — body system filter (e.g. "cardiovascular")
 *
 * Returns:
 *   - context used for resolution
 *   - all resolved candidates per kind
 *   - density config
 *   - synonym map reverse lookup
 *   - registry stats
 *   - any gap warnings (surface requires links but none found)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { resolveLinksDebug } from "@/lib/linking/link-resolver";
import { synonymNormalize, synonymsForTopicKey, CANONICAL_TOPIC_KEYS } from "@/lib/linking/topic-synonym-map";
import { registrySize, registeredTopicKeys } from "@/lib/linking/link-target-registry";
import { getDensityConfig } from "@/lib/linking/link-density-config";
import { minLinksFor } from "@/lib/linking/link-density-config";
import type { LinkContext, LinkSurface, LinkTargetKind, ResolvedLinks } from "@/lib/linking/internal-link-types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = req.nextUrl;

  // Parse and normalize topic key
  const rawTopic   = searchParams.get("rawTopic") ?? null;
  const paramKey   = searchParams.get("topicKey") ?? null;
  const topicKey   = paramKey ?? (rawTopic ? synonymNormalize(rawTopic) ?? undefined : undefined);
  const locale     = searchParams.get("locale") ?? "en";
  const surface    = (searchParams.get("surface") ?? "blog") as LinkSurface;
  const examFamily = searchParams.get("examFamily") ?? undefined;
  const bodySystem = searchParams.get("bodySystem") ?? undefined;

  // Build context
  const context: LinkContext = {
    surface,
    locale,
    topicKey: topicKey ?? undefined,
    bodySystem,
    pathway: examFamily
      ? {
          countrySlug: examFamily.includes("REx") ? "canada" : "us",
          roleTrack:   examFamily.includes("PN") ? "lpn" : "rn",
          examCode:    examFamily.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          examFamily,
        }
      : undefined,
  };

  // Run debug resolution
  const debug = resolveLinksDebug(context);

  // Gap analysis
  type GapKind = LinkTargetKind;
  const kindToKey: Record<GapKind, keyof ResolvedLinks> = {
    lesson: "lessons", flashcard: "flashcards", question: "questions", blog: "blogs", cat: "cat", hub: "lessons",
  };
  const gaps: Array<{ kind: GapKind; required: number; found: number }> = [];
  const kinds: GapKind[] = ["lesson", "flashcard", "question", "blog", "cat"];
  for (const kind of kinds) {
    const min  = minLinksFor(surface, kind);
    const found = debug.resolved[kindToKey[kind]]?.length ?? 0;
    if (min > 0 && found < min) {
      gaps.push({ kind, required: min, found });
    }
  }

  // Synonym lookups for this topic
  const synonyms = topicKey ? synonymsForTopicKey(topicKey) : [];

  return NextResponse.json({
    // Resolution result
    context,
    resolved: debug.resolved,
    flat: debug.flat,
    rawHitCount: debug.rawHitCount,
    density: debug.density,

    // Synonym map info
    synonymLookup: {
      rawTopic: rawTopic ?? null,
      normalizedKey: topicKey ?? null,
      knownSynonyms: synonyms,
    },

    // Gap warnings
    gaps,

    // Registry stats
    registry: {
      totalTargets: registrySize(),
      topicCount: registeredTopicKeys().length,
      topicsWithData: topicKey ? registeredTopicKeys().includes(topicKey) : null,
      knownTopicKeys: CANONICAL_TOPIC_KEYS,
    },
  });
}

/**
 * POST /api/admin/linking/inspect
 *
 * Accepts a full LinkContext body for richer inspection
 * (supports topicHints, excludeHrefs, full pathway).
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: Partial<LinkContext> = {};
  try {
    body = (await req.json()) as Partial<LinkContext>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const surface = (body.surface ?? "blog") as LinkSurface;
  const context: LinkContext = {
    surface,
    locale: body.locale ?? "en",
    pathway: body.pathway,
    topicKey: body.topicKey,
    bodySystem: body.bodySystem,
    topicHints: body.topicHints,
    excludeHrefs: body.excludeHrefs,
  };

  const debug = resolveLinksDebug(context);
  const density = getDensityConfig(surface);

  const postKindToKey: Record<string, keyof ResolvedLinks> = {
    lesson: "lessons", flashcard: "flashcards", question: "questions", blog: "blogs", cat: "cat",
  };
  const gaps: Array<{ kind: string; required: number; found: number }> = [];
  for (const [kind, config] of Object.entries(density) as Array<[string, { min: number; max: number } | number]>) {
    if (kind === "totalMax") continue;
    const cfg = config as { min: number; max: number };
    const key = postKindToKey[kind];
    const found = key ? (debug.resolved[key]?.length ?? 0) : 0;
    if (cfg.min > 0 && found < cfg.min) {
      gaps.push({ kind, required: cfg.min, found });
    }
  }

  return NextResponse.json({
    context,
    resolved: debug.resolved,
    flat: debug.flat,
    rawHitCount: debug.rawHitCount,
    density: debug.density,
    gaps,
    registry: {
      totalTargets: registrySize(),
      topicCount: registeredTopicKeys().length,
    },
  });
}
