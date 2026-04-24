import assert from "node:assert/strict";
import test from "node:test";

import type { PrismaClient } from "@prisma/client";
import { ContentStatus } from "@prisma/client";

import type { LegacyPublicContentExportV1 } from "@/lib/legacy/legacy-public-content-types";
import { runLegacyPublicContentImport } from "@/lib/legacy/legacy-public-content-pipeline";

const lessonOnlyPayload: LegacyPublicContentExportV1 = {
  version: 1,
  lessons: [
    {
      pathwayId: "ca-rn-nclex-rn",
      slug: "demo-lesson",
      title: "Patched title",
      topic: "Safety",
      topicSlug: "safety",
      bodySystem: "general",
    },
  ],
  flashcards: {},
};

const demoLessonRow = () => ({
  id: "pl-1",
  pathwayId: "ca-rn-nclex-rn",
  slug: "demo-lesson",
  title: "Old title",
  topic: "",
  topicSlug: "",
  bodySystem: "",
  previewSectionCount: 1,
  seoTitle: "Old",
  seoDescription: "",
  sections: [{ id: "s1", heading: "H", kind: "overview", body: "x".repeat(400) }],
  locale: "en",
  exams: [],
  countries: [],
  priority: "medium",
  examMeta: [],
  status: ContentStatus.PUBLISHED,
  tierCode: null,
  structuralPublicComplete: true,
  published_at: new Date(),
});

test("dry-run import performs no prisma writes", async () => {
  let updates = 0;
  let creates = 0;
  const prisma = {
    pathwayLesson: {
      findUnique: async (args: { where: Record<string, unknown> }) => {
        const w = args.where as {
          pathwayId_slug_locale?: { slug?: string };
          id?: string;
        };
        if (w.pathwayId_slug_locale?.slug === "demo-lesson" || w.id === "pl-1") {
          return demoLessonRow();
        }
        return null;
      },
      update: async () => {
        updates += 1;
        return {};
      },
      create: async () => {
        creates += 1;
        return { id: "new" };
      },
    },
    flashcardTag: { findUnique: async () => null, create: async () => ({ id: "tag-1" }) },
    flashcardDeck: {
      findFirst: async () => null,
    },
    flashcardDeckOnTag: {
      findUnique: async () => null,
      create: async () => {
        creates += 1;
        return {};
      },
    },
  } as unknown as PrismaClient;

  const result = await runLegacyPublicContentImport(prisma, lessonOnlyPayload, {
    apply: false,
    overwriteBody: false,
    allowPathwayCorrection: false,
    allowCreateMissingLessons: false,
  });

  assert.equal(updates, 0);
  assert.equal(creates, 0);
  assert.equal(result.dryRun, true);
  assert.ok(result.changes.length > 0, "dry-run should emit planned changes");
});

test("apply import calls pathwayLesson.update when patch non-empty", async () => {
  let updates = 0;
  let snap = demoLessonRow();
  const prisma = {
    pathwayLesson: {
      findUnique: async (args: { where: Record<string, unknown> }) => {
        const w = args.where as { pathwayId_slug_locale?: { slug?: string }; id?: string };
        if (w.pathwayId_slug_locale?.slug === "demo-lesson" || w.id === "pl-1") {
          return { ...snap };
        }
        return null;
      },
      update: async (args: { data: Record<string, unknown> }) => {
        updates += 1;
        snap = { ...snap, ...args.data } as typeof snap;
        return {};
      },
      create: async () => {
        throw new Error("should not create");
      },
    },
    flashcardTag: { findUnique: async () => ({ id: "t1" }), create: async () => ({ id: "t1" }) },
    flashcardDeck: { findFirst: async () => null },
    flashcardDeckOnTag: { findUnique: async () => null, create: async () => ({}) },
  } as unknown as PrismaClient;

  await runLegacyPublicContentImport(prisma, lessonOnlyPayload, {
    apply: true,
    overwriteBody: false,
    allowPathwayCorrection: false,
    allowCreateMissingLessons: false,
  });

  assert.ok(updates >= 1);
});

test("dry-run deck patch logs flashcard_deck without prisma.update", async () => {
  let deckUpdates = 0;
  const prisma = {
    pathwayLesson: {
      findUnique: async () => null,
      update: async () => {
        deckUpdates += 1;
        return {};
      },
      create: async () => ({ id: "x" }),
    },
    flashcardTag: { findUnique: async () => null, create: async () => ({ id: "t" }) },
    flashcardDeck: {
      findFirst: async () => ({
        id: "deck-1",
        title: "Old deck title",
        visibility: "SUBSCRIBER",
      }),
      update: async () => {
        deckUpdates += 1;
        return {};
      },
    },
    flashcardDeckOnTag: { findUnique: async () => null, create: async () => ({}) },
  } as unknown as PrismaClient;

  const payload: LegacyPublicContentExportV1 = {
    version: 1,
    lessons: [],
    flashcards: {
      decks: [{ slug: "demo-deck", title: "New deck title" }],
    },
  };

  const result = await runLegacyPublicContentImport(prisma, payload, {
    apply: false,
    overwriteBody: false,
    allowPathwayCorrection: false,
    allowCreateMissingLessons: false,
  });

  assert.equal(deckUpdates, 0);
  assert.ok(
    result.changes.some((c) => c.entity === "flashcard_deck" && c.action === "update"),
    "dry-run should log a planned flashcard_deck update",
  );
});
