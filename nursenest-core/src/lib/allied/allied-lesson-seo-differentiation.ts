/**
 * Allied pathway lesson surfaces: reduce duplicate/thin SEO signals when `alliedProfessionKey` is set
 * by injecting role-specific language into titles, descriptions, keywords, H1, and JSON-LD headline copy.
 */
import { alliedProfessionTrackChipLabel, getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { clampMetaDescription } from "@/lib/seo/programmatic-seo-engine/guardrails";
import { mergePathwayLessonPublicMetadata } from "@/lib/seo/programmatic-seo-engine/lesson-public-metadata";

export type AlliedLessonSeoSurface = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  jsonLdHeadline: string;
  jsonLdDescription: string;
  /** Visible H1 / hero title — aligned with JSON-LD headline for parity. */
  displayTitle: string;
  /** Short occupation label for JSON-LD `about` when allied profession is set. */
  structuredAboutOccupation: string | null;
};

function stripTrailingBrand(title: string): string {
  return title.replace(/\s*\|\s*NurseNest\s*$/i, "").trim();
}

function titleMentionsProfession(metaTitle: string, track: string, h1: string): boolean {
  const lower = metaTitle.toLowerCase();
  const bucket = new Set<string>(
    [h1, track, ...h1.split(/\s+/), ...track.split(/\s+/)]
      .map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())
      .flatMap((s) => s.split(/\s+/))
      .filter((w) => w.length > 2),
  );
  for (const w of bucket) {
    if (w.length > 2 && lower.includes(w)) return true;
  }
  return false;
}

/**
 * Merged programmatic SEO + allied-role differentiation for marketing lesson detail + metadata.
 */
export function buildAlliedAwareLessonPublicSeoSurface(
  pathway: ExamPathwayDefinition,
  lesson: {
    title: string;
    topic: string;
    bodySystem: string;
    seoTitle: string;
    seoDescription: string;
    alliedProfessionKey?: string | null;
  },
): AlliedLessonSeoSurface {
  const merged = mergePathwayLessonPublicMetadata({
    pathway,
    lesson: {
      title: lesson.seoTitle.trim() || lesson.topic,
      topic: lesson.topic,
      bodySystem: lesson.bodySystem,
      seoTitle: lesson.seoTitle,
      seoDescription: lesson.seoDescription,
    },
  });

  const baseDisplayTitle = lesson.title.trim() || lesson.seoTitle.trim() || lesson.topic.trim();

  const key = lesson.alliedProfessionKey?.trim().toLowerCase();
  if (!key || !isAlliedMarketingCorePathwayId(pathway.id)) {
    return {
      metaTitle: merged.title.title,
      metaDescription: merged.description.description,
      keywords: merged.keywords,
      jsonLdHeadline: merged.title.title,
      jsonLdDescription: merged.description.description,
      displayTitle: baseDisplayTitle,
      structuredAboutOccupation: null,
    };
  }

  const prof = getAlliedProfessionByProfessionKey(key);
  if (!prof) {
    return {
      metaTitle: merged.title.title,
      metaDescription: merged.description.description,
      keywords: merged.keywords,
      jsonLdHeadline: merged.title.title,
      jsonLdDescription: merged.description.description,
      displayTitle: baseDisplayTitle,
      structuredAboutOccupation: null,
    };
  }

  const track = alliedProfessionTrackChipLabel(prof);
  const h1 = prof.h1.trim();

  let metaTitle = merged.title.title;
  if (!titleMentionsProfession(metaTitle, track, h1)) {
    const stem = stripTrailingBrand(metaTitle);
    metaTitle = `${stem} · ${track} | NurseNest`.slice(0, 110);
  }

  let metaDescription = merged.description.description;
  const dLow = metaDescription.toLowerCase();
  const needsRoleLens = !dLow.includes(track.toLowerCase()) && !dLow.includes(h1.toLowerCase());
  if (needsRoleLens) {
    metaDescription = clampMetaDescription(
      `${metaDescription} Role lens: ${track} (${h1}). Priorities and examples reflect typical ${track} exam vignettes.`,
    );
  } else if (!/\b(example|clinical pearl|documentation|scope|ventilation|specimen|patient)\b/i.test(metaDescription)) {
    metaDescription = clampMetaDescription(
      `${metaDescription} Includes ${track}-scoped cues where licensure items differ from generic nursing framing.`,
    );
  }

  const geo = pathway.countrySlug === "canada" ? "Canada" : "United States";
  const keywords = [
    ...merged.keywords.filter((k) => !/registered nursing|practical nursing|nurse practitioner/i.test(k)),
    track,
    h1,
    `${track} licensure prep`,
    `${pathway.shortName} ${track}`,
    "allied health exam prep",
    geo,
  ];
  const uniq = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))].slice(0, 20);

  const displayLower = baseDisplayTitle.toLowerCase();
  const displayTitle =
    displayLower.includes(track.toLowerCase()) || displayLower.includes(h1.toLowerCase())
      ? baseDisplayTitle
      : `${baseDisplayTitle} — ${track}`;

  return {
    metaTitle: metaTitle.slice(0, 110),
    metaDescription,
    keywords: uniq,
    jsonLdHeadline: displayTitle.slice(0, 200),
    jsonLdDescription: metaDescription.slice(0, 320),
    displayTitle: displayTitle.slice(0, 200),
    structuredAboutOccupation: track,
  };
}
