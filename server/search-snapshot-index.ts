/**
 * Phase 11 — Search Resilience
 * Static search snapshot index updated nightly.
 * When the primary search service is unavailable, this fallback index is served.
 *
 * Covers: lesson search, question search, flashcard search, blog search.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { addAlert } from "./platform-resilience";

interface SearchIndexEntry {
  id: string;
  type: "lesson" | "question" | "flashcard" | "blog";
  title: string;
  excerpt: string;
  tags: string[];
  tier: string;
  url: string;
  score: number;
}

let snapshotIndex: SearchIndexEntry[] = [];
let indexGeneratedAt: Date | null = null;
const INDEX_TTL_MS = 26 * 60 * 60 * 1000; // 26 hours

export async function buildSearchSnapshotIndex(): Promise<number> {
  const entries: SearchIndexEntry[] = [];

  try {
    // Lessons
    const { rows: lessons } = await pool.query(
      `SELECT id, title, summary, tags, tier FROM lessons WHERE is_published = true ORDER BY title LIMIT 2000`
    ).catch(() => ({ rows: [] }));

    for (const l of lessons) {
      entries.push({
        id: l.id,
        type: "lesson",
        title: l.title || "",
        excerpt: (l.summary || "").slice(0, 200),
        tags: Array.isArray(l.tags) ? l.tags : [],
        tier: l.tier || "free",
        url: `/app/lessons/${l.id}`,
        score: 1,
      });
    }

    // Questions
    const { rows: questions } = await pool.query(
      `SELECT id, stem, topic, body_system, tier FROM exam_questions WHERE is_published = true ORDER BY topic LIMIT 5000`
    ).catch(() => ({ rows: [] }));

    for (const q of questions) {
      entries.push({
        id: q.id,
        type: "question",
        title: (q.stem || "").slice(0, 120),
        excerpt: `Topic: ${q.topic || "General"} | System: ${q.body_system || "General"}`,
        tags: [q.topic, q.body_system].filter(Boolean),
        tier: q.tier || "rn",
        url: `/app/practice?questionId=${q.id}`,
        score: 1,
      });
    }

    // Flashcards
    const { rows: flashcards } = await pool.query(
      `SELECT id, front, back, tags, tier FROM flashcards WHERE is_published = true ORDER BY front LIMIT 3000`
    ).catch(() => ({ rows: [] }));

    for (const f of flashcards) {
      entries.push({
        id: f.id,
        type: "flashcard",
        title: (f.front || "").slice(0, 120),
        excerpt: (f.back || "").slice(0, 200),
        tags: Array.isArray(f.tags) ? f.tags : [],
        tier: f.tier || "free",
        url: `/app/flashcards`,
        score: 1,
      });
    }

    // Blog posts
    const { rows: blogs } = await pool.query(
      `SELECT id, title, summary, tags FROM blog_posts WHERE is_published = true ORDER BY created_at DESC LIMIT 500`
    ).catch(() => ({ rows: [] }));

    for (const b of blogs) {
      entries.push({
        id: b.id,
        type: "blog",
        title: b.title || "",
        excerpt: (b.summary || "").slice(0, 200),
        tags: Array.isArray(b.tags) ? b.tags : [],
        tier: "free",
        url: `/blog/${b.id}`,
        score: 0.8,
      });
    }
  } catch (e: any) {
    addAlert("warning", "search_snapshot", "Search Snapshot Build Error", e.message, "search-snapshot-index");
  }

  snapshotIndex = entries;
  indexGeneratedAt = new Date();
  console.log(`[SearchSnapshot] Index built: ${entries.length} entries`);
  return entries.length;
}

function searchIndex(query: string, type?: string, tier?: string, limit = 20): SearchIndexEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const results: Array<{ entry: SearchIndexEntry; score: number }> = [];

  for (const entry of snapshotIndex) {
    if (type && entry.type !== type) continue;

    const titleLower = entry.title.toLowerCase();
    const excerptLower = entry.excerpt.toLowerCase();
    const tagsLower = entry.tags.map((t) => t.toLowerCase()).join(" ");
    const combined = `${titleLower} ${excerptLower} ${tagsLower}`;

    let score = 0;
    for (const term of terms) {
      if (titleLower.includes(term)) score += 3;
      if (tagsLower.includes(term)) score += 2;
      if (excerptLower.includes(term)) score += 1;
    }

    if (score > 0) {
      results.push({ entry: { ...entry, score: score * entry.score }, score: score * entry.score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map((r) => r.entry);
}

function isIndexFresh(): boolean {
  if (!indexGeneratedAt) return false;
  return Date.now() - indexGeneratedAt.getTime() < INDEX_TTL_MS;
}

export function registerSearchSnapshotRoutes(app: Express): void {
  app.get("/api/search/snapshot", async (req: Request, res: Response) => {
    const query = String(req.query.q || "").slice(0, 200);
    const type = String(req.query.type || "");
    const tier = String(req.query.tier || "");
    const limit = Math.min(parseInt(String(req.query.limit || "20")), 50);

    if (!query) return res.status(400).json({ error: "q is required" });

    if (!isIndexFresh()) {
      // Rebuild asynchronously
      buildSearchSnapshotIndex().catch(() => {});
      if (!snapshotIndex.length) {
        return res.status(503).json({ error: "search_index_building", message: "Search index is being built. Try again in 30 seconds." });
      }
    }

    const results = searchIndex(query, type || undefined, tier || undefined, limit);
    return res.json({
      ok: true,
      results,
      count: results.length,
      indexedAt: indexGeneratedAt?.toISOString() || null,
      fallback: true,
    });
  });

  app.post("/api/admin/search-snapshot/rebuild", async (_req: Request, res: Response) => {
    const count = await buildSearchSnapshotIndex();
    return res.json({ ok: true, count, builtAt: indexGeneratedAt?.toISOString() });
  });

  app.get("/api/admin/search-snapshot/status", (_req: Request, res: Response) => {
    return res.json({
      ok: true,
      entryCount: snapshotIndex.length,
      generatedAt: indexGeneratedAt?.toISOString() || null,
      fresh: isIndexFresh(),
    });
  });
}
