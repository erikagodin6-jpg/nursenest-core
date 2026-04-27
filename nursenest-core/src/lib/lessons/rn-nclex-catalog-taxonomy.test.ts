/**
 * RN / CA NCLEX-RN bundled catalog editorial invariants.
 *
 * Run:
 *   node --import tsx --test src/lib/lessons/rn-nclex-catalog-taxonomy.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import catalog from "../../content/pathway-lessons/catalog.json";
import {
  RN_NCLEX_CONTROLLED_TOPICS,
  RN_NCLEX_DUPLICATE_SLUGS_TO_REMOVE,
  premiumTitleForRnNclexLesson,
} from "./rn-nclex-catalog-taxonomy";

const CONTROLLED = new Set<string>(RN_NCLEX_CONTROLLED_TOPICS);

type CatalogFile = {
  pathways: Record<string, { lessons?: Array<{ slug?: string; title?: string; topic?: string; topicSlug?: string }> }>;
};

const data = catalog as CatalogFile;

function normalizeLessonTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("RN NCLEX-RN / CA RN catalog taxonomy", () => {
  for (const pathwayId of ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const) {
    it(`${pathwayId}: every lesson topic is in the controlled category list`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      for (const row of lessons) {
        const topic = typeof row.topic === "string" ? row.topic.trim() : "";
        assert.ok(CONTROLLED.has(topic), `slug=${row.slug} unexpected topic=${JSON.stringify(topic)}`);
      }
    });

    it(`${pathwayId}: no removed duplicate slug rows remain`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      const slugs = new Set(lessons.map((l) => String(l.slug ?? "")));
      for (const banned of RN_NCLEX_DUPLICATE_SLUGS_TO_REMOVE) {
        assert.equal(slugs.has(banned), false, `duplicate slug ${banned} should be removed from ${pathwayId}`);
      }
    });

    it(`${pathwayId}: titles must not carry regional NCLEX suffixes`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      for (const row of lessons) {
        const t = String(row.title ?? "");
        assert.equal(
          /\((NCLEX-RN,\s*US|NCLEX-RN,\s*Canada)\)\s*$/i.test(t),
          false,
          `slug=${row.slug} title still has regional suffix`,
        );
      }
    });

    it(`${pathwayId}: no duplicate normalized titles within the pathway`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      const map = new Map<string, string[]>();
      for (const row of lessons) {
        const key = normalizeLessonTitleKey(String(row.title ?? ""));
        const slug = String(row.slug ?? "");
        map.set(key, [...(map.get(key) ?? []), slug]);
      }
      const dups = [...map.entries()].filter(([, slugs]) => slugs.length > 1);
      assert.deepEqual(
        dups,
        [],
        `Duplicate lesson titles after normalization: ${JSON.stringify(dups.slice(0, 12))}`,
      );
    });

    it(`${pathwayId}: topicSlug is kebab-case (no spaces)`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      for (const row of lessons) {
        const ts = String(row.topicSlug ?? "").trim();
        assert.ok(ts.length > 0, `slug=${row.slug} missing topicSlug`);
        assert.doesNotMatch(ts, /\s/);
        assert.equal(ts, ts.toLowerCase(), `slug=${row.slug} topicSlug must be lowercase`);
      }
    });

    it(`${pathwayId}: each topicSlug maps to exactly one controlled topic label`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      const bySlug = new Map<string, Set<string>>();
      for (const row of lessons) {
        const ts = String(row.topicSlug ?? "").trim();
        const topic = String(row.topic ?? "").trim();
        if (!bySlug.has(ts)) bySlug.set(ts, new Set());
        bySlug.get(ts)!.add(topic);
      }
      const conflicts = [...bySlug.entries()].filter(([, topics]) => topics.size > 1);
      assert.deepEqual(conflicts, []);
    });

    it(`${pathwayId}: premiumTitleForRnNclexLesson stays stable (re-entrant)`, () => {
      const lessons = data.pathways[pathwayId]?.lessons ?? [];
      for (const row of lessons) {
        const once = premiumTitleForRnNclexLesson(row, pathwayId);
        const twice = premiumTitleForRnNclexLesson({ ...row, title: once.title, topic: once.topic }, pathwayId);
        assert.equal(twice.title, once.title);
        assert.equal(twice.topic, once.topic);
      }
    });
  }
});
