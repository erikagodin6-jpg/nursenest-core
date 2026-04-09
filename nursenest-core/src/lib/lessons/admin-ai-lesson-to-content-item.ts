import type { Prisma } from "@prisma/client";
import type { AdminAiGeneratedLesson, AdminAiLessonPathway } from "@/lib/lessons/admin-ai-lesson-schema";
import { TierCode } from "@prisma/client";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Map admin pathway picker to `TierCode` for `ContentItem` / exam alignment. */
export function adminLessonPathwayToTierCode(pathway: AdminAiLessonPathway): TierCode {
  switch (pathway) {
    case "NCLEX-RN":
      return TierCode.RN;
    case "NCLEX-PN":
      return TierCode.LVN_LPN;
    case "REx-PN":
      return TierCode.RPN;
    case "NP-US":
    case "CNPLE":
      return TierCode.NP;
    case "Allied":
      return TierCode.ALLIED;
    default:
      return TierCode.RN;
  }
}

/** Build `content_items.content` JSON blocks from a generated lesson plan. */
export function adminAiLessonToContentBlocks(lesson: AdminAiGeneratedLesson): Prisma.InputJsonValue {
  const blocks: { sectionTitle: string; content: string }[] = [
    { sectionTitle: "Pathway overview", content: lesson.pathwayAwareIntro },
    ...lesson.structuredBody.map((b) => ({ sectionTitle: b.sectionTitle, content: b.content })),
  ];

  if (lesson.keyPoints.length) {
    blocks.push({
      sectionTitle: "Key points",
      content: `<ul>${lesson.keyPoints.map((k) => `<li>${escapeHtml(k)}</li>`).join("")}</ul>`,
    });
  }
  if (lesson.redFlags.length) {
    blocks.push({
      sectionTitle: "Red flags",
      content: `<ul>${lesson.redFlags.map((k) => `<li>${escapeHtml(k)}</li>`).join("")}</ul>`,
    });
  }
  if (lesson.priorities.length) {
    blocks.push({
      sectionTitle: "Priorities",
      content: `<ul>${lesson.priorities.map((k) => `<li>${escapeHtml(k)}</li>`).join("")}</ul>`,
    });
  }
  if (lesson.internalLinkSuggestions.length) {
    const links = lesson.internalLinkSuggestions
      .map(
        (l) =>
          `<li><strong>${escapeHtml(l.label)}</strong> — <code>${escapeHtml(l.suggestedPath)}</code><br/><span class="text-muted">${escapeHtml(l.rationale)}</span></li>`,
      )
      .join("");
    blocks.push({
      sectionTitle: "Suggested study links",
      content: `<ul>${links}</ul>`,
    });
  }
  if (lesson.endOfLessonCtas.length) {
    const ctas = lesson.endOfLessonCtas
      .map(
        (c) =>
          `<p><strong>${escapeHtml(c.label)}</strong> — <a href="${escapeHtml(c.suggestedHref)}">${escapeHtml(c.copy)}</a></p>`,
      )
      .join("");
    blocks.push({ sectionTitle: "Practice next", content: ctas });
  }
  if (lesson.metadata.clinicalPearl?.trim()) {
    blocks.push({
      sectionTitle: "Clinical pearl",
      content: `<p>${lesson.metadata.clinicalPearl}</p>`,
    });
  }
  if (lesson.metadata.safetyNote?.trim()) {
    blocks.push({
      sectionTitle: "Safety",
      content: `<p>${lesson.metadata.safetyNote}</p>`,
    });
  }

  return blocks as unknown as Prisma.InputJsonValue;
}

/** Flatten blocks to plain text for publish / quality checks. */
export function adminAiLessonPlainTextBody(lesson: AdminAiGeneratedLesson): string {
  const parts = [
    lesson.pathwayAwareIntro.replace(/<[^>]+>/g, " "),
    ...lesson.structuredBody.map((b) => b.content.replace(/<[^>]+>/g, " ")),
    ...lesson.keyPoints,
    ...lesson.redFlags,
    ...lesson.priorities,
  ];
  return parts.join("\n").replace(/\s+/g, " ").trim();
}
