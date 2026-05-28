/**
 * Phase 3 — Adaptive Learning Resilience
 * Nightly adaptive snapshot engine.
 *
 * Generates per-user:
 *   - Weakness maps (topics with low accuracy)
 *   - Readiness maps (NCLEX readiness scores)
 *   - Recommendation maps (lessons, flashcards, questions, CAT sessions)
 *
 * When the live adaptive engine is unavailable, these snapshots are served
 * so learners always receive personalized recommendations.
 */

import { pool } from "./storage";
import { addAlert } from "./platform-resilience";

export interface WeaknessMap {
  topic: string;
  bodySystem: string;
  accuracy: number;
  questionCount: number;
  priority: "high" | "medium" | "low";
}

export interface ReadinessMap {
  overall: number;
  bySystem: Record<string, number>;
  trend: "improving" | "stable" | "declining";
  estimatedReadyDate: string | null;
}

export interface RecommendationMap {
  lessons: string[];
  flashcardDecks: string[];
  questionTopics: string[];
  catRecommended: boolean;
  reason: string;
}

export interface AdaptiveSnapshot {
  userId: string;
  tier: string;
  weaknesses: WeaknessMap[];
  readiness: ReadinessMap;
  recommendations: RecommendationMap;
  generatedAt: string;
  validUntil: string;
}

const SNAPSHOT_TTL_MS = 25 * 60 * 60 * 1000; // 25 hours — covers overnight gaps
const SNAPSHOT_CACHE = new Map<string, { snapshot: AdaptiveSnapshot; fetchedAt: number }>();
const MEM_TTL_MS = 10 * 60 * 1000;

export async function ensureAdaptiveSnapshotTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS adaptive_snapshots (
        user_id varchar PRIMARY KEY,
        tier text NOT NULL DEFAULT 'free',
        weaknesses jsonb NOT NULL DEFAULT '[]'::jsonb,
        readiness jsonb NOT NULL DEFAULT '{}'::jsonb,
        recommendations jsonb NOT NULL DEFAULT '{}'::jsonb,
        generated_at timestamptz NOT NULL DEFAULT NOW(),
        valid_until timestamptz NOT NULL,
        generation_duration_ms integer,
        question_count integer DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_adaptive_snapshots_valid ON adaptive_snapshots(valid_until);
      CREATE INDEX IF NOT EXISTS idx_adaptive_snapshots_tier ON adaptive_snapshots(tier);
    `);
  } catch (e: any) {
    console.error("[AdaptiveSnapshot] Table init error:", e.message);
  }
}

export async function generateAdaptiveSnapshot(userId: string, tier: string): Promise<AdaptiveSnapshot | null> {
  const start = Date.now();
  try {
    // Compute weakness map from question history
    const { rows: historyRows } = await pool.query(
      `SELECT
         COALESCE(q.topic, 'General') as topic,
         COALESCE(q.body_system, 'General') as body_system,
         COUNT(*) FILTER (WHERE h.is_correct = true)::float / NULLIF(COUNT(*), 0) as accuracy,
         COUNT(*) as question_count
       FROM user_question_history h
       LEFT JOIN exam_questions q ON q.id = h.question_id
       WHERE h.user_id = $1 AND h.answered_at > NOW() - INTERVAL '90 days'
       GROUP BY q.topic, q.body_system
       ORDER BY accuracy ASC NULLS FIRST
       LIMIT 30`,
      [userId]
    ).catch(() => ({ rows: [] }));

    const weaknesses: WeaknessMap[] = historyRows.map((r: any) => ({
      topic: r.topic,
      bodySystem: r.body_system,
      accuracy: parseFloat(r.accuracy || "0"),
      questionCount: parseInt(r.question_count || "0"),
      priority: parseFloat(r.accuracy || "0") < 0.5 ? "high" : parseFloat(r.accuracy || "0") < 0.7 ? "medium" : "low",
    }));

    // Compute overall readiness from recent performance
    const { rows: readinessRows } = await pool.query(
      `SELECT
         COALESCE(q.body_system, 'General') as body_system,
         COUNT(*) FILTER (WHERE h.is_correct = true)::float / NULLIF(COUNT(*), 0) as accuracy
       FROM user_question_history h
       LEFT JOIN exam_questions q ON q.id = h.question_id
       WHERE h.user_id = $1 AND h.answered_at > NOW() - INTERVAL '30 days'
       GROUP BY q.body_system`,
      [userId]
    ).catch(() => ({ rows: [] }));

    const bySystem: Record<string, number> = {};
    let totalAccuracy = 0;
    for (const r of readinessRows) {
      const acc = parseFloat(r.accuracy || "0") * 100;
      bySystem[r.body_system] = Math.round(acc);
      totalAccuracy += acc;
    }
    const overall = readinessRows.length > 0 ? Math.round(totalAccuracy / readinessRows.length) : 0;

    const readiness: ReadinessMap = {
      overall,
      bySystem,
      trend: "stable",
      estimatedReadyDate: overall >= 85 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    };

    // Build recommendations from weak topics
    const highPriorityTopics = weaknesses.filter((w) => w.priority === "high").map((w) => w.topic);
    const recommendations: RecommendationMap = {
      lessons: highPriorityTopics.slice(0, 5),
      flashcardDecks: highPriorityTopics.slice(0, 3),
      questionTopics: highPriorityTopics.slice(0, 5),
      catRecommended: overall >= 60,
      reason: highPriorityTopics.length > 0
        ? `Focus on ${highPriorityTopics.slice(0, 2).join(", ")} — accuracy below threshold`
        : "Your performance looks strong — a full CAT is recommended",
    };

    const snapshot: AdaptiveSnapshot = {
      userId,
      tier,
      weaknesses,
      readiness,
      recommendations,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + SNAPSHOT_TTL_MS).toISOString(),
    };

    const duration = Date.now() - start;

    await pool.query(
      `INSERT INTO adaptive_snapshots (user_id, tier, weaknesses, readiness, recommendations, generated_at, valid_until, generation_duration_ms, question_count)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         tier = EXCLUDED.tier,
         weaknesses = EXCLUDED.weaknesses,
         readiness = EXCLUDED.readiness,
         recommendations = EXCLUDED.recommendations,
         generated_at = NOW(),
         valid_until = EXCLUDED.valid_until,
         generation_duration_ms = EXCLUDED.generation_duration_ms,
         question_count = EXCLUDED.question_count`,
      [userId, tier, JSON.stringify(weaknesses), JSON.stringify(readiness), JSON.stringify(recommendations),
       snapshot.validUntil, duration, historyRows.length]
    );

    SNAPSHOT_CACHE.set(userId, { snapshot, fetchedAt: Date.now() });
    return snapshot;
  } catch (e: any) {
    console.error("[AdaptiveSnapshot] Generate error:", e.message);
    return null;
  }
}

export async function getAdaptiveSnapshot(userId: string): Promise<AdaptiveSnapshot | null> {
  const mem = SNAPSHOT_CACHE.get(userId);
  if (mem && Date.now() - mem.fetchedAt < MEM_TTL_MS) return mem.snapshot;

  try {
    const { rows } = await pool.query(
      `SELECT user_id, tier, weaknesses, readiness, recommendations, generated_at, valid_until
       FROM adaptive_snapshots WHERE user_id = $1`,
      [userId]
    );
    if (!rows.length) return null;
    const r = rows[0];
    const snapshot: AdaptiveSnapshot = {
      userId: r.user_id,
      tier: r.tier,
      weaknesses: r.weaknesses || [],
      readiness: r.readiness || { overall: 0, bySystem: {}, trend: "stable", estimatedReadyDate: null },
      recommendations: r.recommendations || { lessons: [], flashcardDecks: [], questionTopics: [], catRecommended: false, reason: "" },
      generatedAt: r.generated_at.toISOString(),
      validUntil: r.valid_until.toISOString(),
    };
    SNAPSHOT_CACHE.set(userId, { snapshot, fetchedAt: Date.now() });
    return snapshot;
  } catch {
    return null;
  }
}

export function isAdaptiveSnapshotFresh(snapshot: AdaptiveSnapshot): boolean {
  return Date.now() < new Date(snapshot.validUntil).getTime();
}

/** Called by the nightly scheduler to refresh all snapshots. */
export async function runNightlyAdaptiveSnapshots(): Promise<{ refreshed: number; errors: number }> {
  let refreshed = 0;
  let errors = 0;

  try {
    const { rows: users } = await pool.query(
      `SELECT DISTINCT u.id, COALESCE(s.plan_code, 'free') as tier
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       WHERE u.created_at > NOW() - INTERVAL '1 year'
       ORDER BY u.id LIMIT 5000`
    ).catch(() => ({ rows: [] }));

    const BATCH_SIZE = 20;
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(
        batch.map(async (user: any) => {
          const snap = await generateAdaptiveSnapshot(user.id, user.tier);
          if (snap) refreshed++;
          else errors++;
        })
      );
      await new Promise((r) => setTimeout(r, 500)); // rate limit DB pressure
    }
  } catch (e: any) {
    addAlert("warning", "adaptive_snapshot", "Nightly Adaptive Snapshot Failed", e.message, "adaptive-snapshot-engine");
  }

  console.log(`[AdaptiveSnapshot] Nightly run: ${refreshed} refreshed, ${errors} errors`);
  return { refreshed, errors };
}
