import "server-only";

import type { PrismaClient } from "@prisma/client";

export type MediaUsageRef = {
  type: "blog" | "lesson" | "pathway_lesson" | "exam_question";
  id: string;
  label: string;
  href: string;
};

const MAX_REFS_PER_TYPE = 20;
/** Stored on the row for admin UI preview */
const MAX_REFS_STORED = 25;

function uniqKey(r: MediaUsageRef) {
  return `${r.type}:${r.id}`;
}

/**
 * Best-effort: finds rows whose stored HTML/JSON text includes the public CDN URL (or storage key path).
 */
export async function scanMediaUsage(
  prisma: PrismaClient,
  params: { publicUrl: string; storageKey: string },
): Promise<{ refs: MediaUsageRef[]; count: number }> {
  const { publicUrl, storageKey } = params;
  const keyTail = storageKey.replace(/^\/+/, "").split("/").pop() ?? storageKey;
  const needles = Array.from(new Set([publicUrl, keyTail].filter(Boolean)));

  const refs: MediaUsageRef[] = [];
  const seen = new Set<string>();

  function push(ref: MediaUsageRef) {
    const k = uniqKey(ref);
    if (seen.has(k)) return;
    seen.add(k);
    refs.push(ref);
  }

  for (const needle of needles) {
    if (!needle || needle.length < 8) continue;

    const coverRows = await prisma.blogPost.findMany({
      where: { coverImage: needle },
      select: { id: true, title: true },
      take: MAX_REFS_PER_TYPE,
    });
    for (const r of coverRows) {
      push({
        type: "blog",
        id: r.id,
        label: r.title.slice(0, 120),
        href: `/admin/blog/control-panel?id=${encodeURIComponent(r.id)}`,
      });
    }

    const bodyRows = await prisma.blogPost.findMany({
      where: { body: { contains: needle } },
      select: { id: true, title: true },
      take: MAX_REFS_PER_TYPE,
    });
    for (const r of bodyRows) {
      push({
        type: "blog",
        id: r.id,
        label: r.title.slice(0, 120),
        href: `/admin/blog/control-panel?id=${encodeURIComponent(r.id)}`,
      });
    }

    const lessonRows = await prisma.contentItem.findMany({
      where: {
        type: "lesson",
        OR: [{ summary: { contains: needle } }, { title: { contains: needle } }],
      },
      select: { id: true, title: true, slug: true },
      take: MAX_REFS_PER_TYPE,
    });
    for (const r of lessonRows) {
      push({
        type: "lesson",
        id: r.id,
        label: r.title.slice(0, 120),
        href: `/admin/lessons/${encodeURIComponent(r.id)}/edit`,
      });
    }

    const pathwayRows = await prisma.pathwayLesson.findMany({
      where: {
        OR: [{ title: { contains: needle } }, { seoTitle: { contains: needle } }],
      },
      select: { id: true, title: true, pathwayId: true, slug: true, locale: true },
      take: MAX_REFS_PER_TYPE,
    });
    for (const r of pathwayRows) {
      push({
        type: "pathway_lesson",
        id: r.id,
        label: `${r.pathwayId} · ${r.title.slice(0, 100)}`,
        href: "/admin/lessons",
      });
    }

    const qRows = await prisma.examQuestion.findMany({
      where: {
        OR: [{ stem: { contains: needle } }, { rationale: { contains: needle } }],
      },
      select: { id: true, stem: true },
      take: MAX_REFS_PER_TYPE,
    });
    for (const r of qRows) {
      push({
        type: "exam_question",
        id: r.id,
        label: (r.stem ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120) || r.id.slice(0, 12),
        href: `/admin/questions?focus=${encodeURIComponent(r.id)}`,
      });
    }
  }

  const jsonRows = await prisma.$queryRaw<Array<{ id: string; title: string; slug: string }>>`
    SELECT id, title, slug
    FROM content_items
    WHERE type = 'lesson'
      AND (
        position(${publicUrl} in content::text) > 0
        OR position(${keyTail} in content::text) > 0
      )
    LIMIT ${MAX_REFS_PER_TYPE}
  `;

  for (const r of jsonRows) {
    push({
      type: "lesson",
      id: r.id,
      label: r.title.slice(0, 120),
      href: `/admin/lessons/${encodeURIComponent(r.id)}/edit`,
    });
  }

  const pathwayJson = await prisma.$queryRaw<Array<{ id: string; title: string; pathway_id: string }>>`
    SELECT id, title, pathway_id
    FROM pathway_lessons
    WHERE position(${publicUrl} in sections::text) > 0
       OR position(${keyTail} in sections::text) > 0
    LIMIT ${MAX_REFS_PER_TYPE}
  `;

  for (const r of pathwayJson) {
    push({
      type: "pathway_lesson",
      id: r.id,
      label: `${r.pathway_id} · ${r.title.slice(0, 100)}`,
      href: "/admin/lessons",
    });
  }

  const examJson = await prisma.$queryRaw<Array<{ id: string; stem: string | null }>>`
    SELECT id, stem
    FROM exam_questions
    WHERE position(${publicUrl} in COALESCE(options::text, '')) > 0
       OR position(${keyTail} in COALESCE(options::text, '')) > 0
       OR position(${publicUrl} in COALESCE(exhibit_data::text, '')) > 0
       OR position(${keyTail} in COALESCE(exhibit_data::text, '')) > 0
       OR position(${publicUrl} in COALESCE(images::text, '')) > 0
       OR position(${keyTail} in COALESCE(images::text, '')) > 0
    LIMIT ${MAX_REFS_PER_TYPE}
  `;

  for (const r of examJson) {
    push({
      type: "exam_question",
      id: r.id,
      label: (r.stem ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120) || r.id.slice(0, 12),
      href: `/admin/questions?focus=${encodeURIComponent(r.id)}`,
    });
  }

  const count = refs.length;
  return { refs: refs.slice(0, MAX_REFS_STORED), count };
}
