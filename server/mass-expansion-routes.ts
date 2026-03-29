import type { Express } from "express";
import { pool } from "./storage";

export interface TierExpansionTarget {
  tier: string;
  subTiers?: string[];
  targetTotal: number;
  ngPercent: number;
  batchSize: number;
  region: string;
  examTags: string[];
}

export const EXPANSION_TARGETS: TierExpansionTarget[] = [
  {
    tier: "rpn",
    targetTotal: 10000,
    ngPercent: 0.35,
    batchSize: 50,
    region: "BOTH",
    examTags: ["NCLEX-PN", "REx-PN"],
  },
  {
    tier: "rn",
    targetTotal: 15000,
    ngPercent: 0.40,
    batchSize: 50,
    region: "BOTH",
    examTags: ["NCLEX-RN", "REx-RN"],
  },
  {
    tier: "np",
    subTiers: [
      "np_fnp", "np_agpcnp", "np_pmhnp", "np_pnp",
      "np_whnp", "np_agacnp", "np_enp", "np_cnpe",
    ],
    targetTotal: 20000,
    ngPercent: 0.35,
    batchSize: 25,
    region: "US",
    examTags: ["AANP", "ANCC", "AANP-FNP", "ANCC-FNP", "AGPCNP", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP", "CNPLE"],
  },
];

const NP_SUBTIER_TARGETS: Record<string, { target: number; examTag: string; region: string }> = {
  np_fnp: { target: 3000, examTag: "AANP-FNP", region: "US" },
  np_agpcnp: { target: 2500, examTag: "AGPCNP", region: "US" },
  np_agacnp: { target: 2500, examTag: "AGACNP", region: "US" },
  np_pmhnp: { target: 3000, examTag: "PMHNP", region: "US" },
  np_pnp: { target: 2000, examTag: "PNP", region: "US" },
  np_whnp: { target: 2000, examTag: "WHNP", region: "US" },
  np_enp: { target: 1500, examTag: "ENP", region: "US" },
  np_cnpe: { target: 1500, examTag: "CNPLE", region: "CA" },
};

export function registerMassExpansionRoutes(app: Express) {
  app.get("/api/admin/expansion/status", async (_req, res) => {
    try {
      const tierCounts = await pool.query(`
        SELECT tier, COUNT(*)::int as count
        FROM exam_questions
        WHERE status = 'published'
        GROUP BY tier
        ORDER BY tier
      `);

      const generatedCounts = await pool.query(`
        SELECT system as tier, COUNT(*)::int as count
        FROM generated_questions
        GROUP BY system
        ORDER BY system
      `);

      const ngCounts = await pool.query(`
        SELECT tier, COUNT(*)::int as ngn_count
        FROM exam_questions
        WHERE status = 'published' AND question_type IN ('ngn', 'select_all', 'ordered_response', 'hot_spot', 'drag_drop', 'matrix', 'cloze', 'bowtie', 'trend')
        GROUP BY tier
      `);

      const tierMap: Record<string, any> = {};
      for (const row of tierCounts.rows) {
        tierMap[row.tier] = { published: row.count, generated: 0, ngnCount: 0 };
      }
      for (const row of generatedCounts.rows) {
        if (!row.tier) continue;
        if (!tierMap[row.tier]) tierMap[row.tier] = { published: 0, ngnCount: 0 };
        tierMap[row.tier].generated = row.count;
      }
      for (const row of ngCounts.rows) {
        if (tierMap[row.tier]) tierMap[row.tier].ngnCount = row.ngn_count;
      }

      const targets = EXPANSION_TARGETS.map(t => {
        const current = tierMap[t.tier]?.published || 0;
        const ngnCount = tierMap[t.tier]?.ngnCount || 0;
        const ngnPercent = current > 0 ? ((ngnCount / current) * 100).toFixed(1) : "0.0";
        return {
          tier: t.tier,
          target: t.targetTotal,
          current,
          deficit: Math.max(0, t.targetTotal - current),
          ngnCount,
          ngnPercent: `${ngnPercent}%`,
          ngnTarget: `${(t.ngPercent * 100).toFixed(0)}%`,
          subTiers: t.subTiers?.map(st => ({
            tier: st,
            target: NP_SUBTIER_TARGETS[st]?.target || 0,
            current: tierMap[st]?.published || 0,
            deficit: Math.max(0, (NP_SUBTIER_TARGETS[st]?.target || 0) - (tierMap[st]?.published || 0)),
          })),
        };
      });

      res.json({
        targets,
        allTiers: tierMap,
        totalPublished: Object.values(tierMap).reduce((sum: number, t: any) => sum + (t.published || 0), 0),
        totalGenerated: Object.values(tierMap).reduce((sum: number, t: any) => sum + (t.generated || 0), 0),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/expansion/promote", async (req, res) => {
    try {
      const { tier, limit = 500 } = req.body;
      if (!tier) return res.status(400).json({ error: "tier is required" });

      const subtierInfo = NP_SUBTIER_TARGETS[tier];
      const examTag = subtierInfo?.examTag || tier.toUpperCase();

      const result = await pool.query(`
        WITH promotable AS (
          SELECT id, stem, choices, correct_answers, rationale,
                 system, category, difficulty, type, scenario, exam_pearl
          FROM generated_questions
          WHERE system = $1
          AND NOT EXISTS (
            SELECT 1 FROM exam_questions eq
            WHERE eq.stem_hash = md5(generated_questions.stem)
          )
          LIMIT $2
        )
        INSERT INTO exam_questions (
          tier, exam, stem, options, correct_answer, rationale,
          body_system, topic, difficulty, question_type, region_scope,
          status, stem_hash, clinical_pearl, scenario
        )
        SELECT
          $1, $3, stem, choices, correct_answers, rationale::text,
          category, category, COALESCE(difficulty::int, 3), type, $4,
          'published', md5(stem), exam_pearl, scenario
        FROM promotable
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [tier, limit, examTag, subtierInfo?.region || 'BOTH']);

      res.json({
        promoted: result.rowCount,
        tier,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/expansion/promote-all", async (_req, res) => {
    try {
      const allTiers = [
        "rpn", "rn", "np",
        ...Object.keys(NP_SUBTIER_TARGETS),
      ];

      const results: Record<string, number> = {};
      let totalPromoted = 0;

      for (const tier of allTiers) {
        const subtierInfo = NP_SUBTIER_TARGETS[tier];
        const examTag = subtierInfo?.examTag || tier.toUpperCase();

        const result = await pool.query(`
          WITH promotable AS (
            SELECT id, stem, choices, correct_answers, rationale,
                   system, category, difficulty, type, scenario, exam_pearl
            FROM generated_questions
            WHERE system = $1
            AND NOT EXISTS (
              SELECT 1 FROM exam_questions eq
              WHERE eq.stem_hash = md5(generated_questions.stem)
            )
            LIMIT 1000
          )
          INSERT INTO exam_questions (
            tier, exam, stem, options, correct_answer, rationale,
            body_system, topic, difficulty, question_type, region_scope,
            status, stem_hash, clinical_pearl, scenario
          )
          SELECT
            $1, $3, stem, choices, correct_answers, rationale::text,
            category, category, COALESCE(difficulty::int, 3), type, $4,
            'published', md5(stem), exam_pearl, scenario
          FROM promotable
          ON CONFLICT DO NOTHING
          RETURNING id
        `, [tier, 1000, examTag, subtierInfo?.region || 'BOTH']);

        results[tier] = result.rowCount || 0;
        totalPromoted += result.rowCount || 0;
      }

      res.json({ results, totalPromoted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/expansion/blueprint-coverage", async (_req, res) => {
    try {
      const coverage = await pool.query(`
        SELECT tier, body_system, difficulty, question_type, COUNT(*)::int as count
        FROM exam_questions
        WHERE status = 'published'
        AND tier IN ('rpn', 'rn', 'np', 'np_fnp', 'np_agnp', 'np_pmhnp', 'np_pnp', 'np_whnp', 'np_agacnp', 'np_enp', 'np_agpcnp', 'np_cnpe')
        GROUP BY tier, body_system, difficulty, question_type
        ORDER BY tier, body_system
      `);

      const ngnBreakdown = await pool.query(`
        SELECT tier, question_type, COUNT(*)::int as count
        FROM exam_questions
        WHERE status = 'published'
        AND question_type IN ('ngn', 'select_all', 'ordered_response', 'hot_spot', 'drag_drop', 'matrix', 'cloze', 'bowtie', 'trend')
        GROUP BY tier, question_type
        ORDER BY tier, question_type
      `);

      res.json({
        coverage: coverage.rows,
        ngnBreakdown: ngnBreakdown.rows,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/expansion/dedup-check", async (req, res) => {
    try {
      const tier = req.query.tier as string || "rpn";

      const dupes = await pool.query(`
        SELECT stem_hash, COUNT(*)::int as dupe_count, MIN(stem) as sample_stem
        FROM exam_questions
        WHERE status = 'published' AND tier = $1
        GROUP BY stem_hash
        HAVING COUNT(*) > 1
        ORDER BY COUNT(*) DESC
        LIMIT 50
      `, [tier]);

      res.json({
        tier,
        duplicateGroups: dupes.rowCount,
        duplicates: dupes.rows,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
