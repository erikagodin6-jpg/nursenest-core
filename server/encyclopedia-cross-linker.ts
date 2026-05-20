import { pool } from "./storage";

const ENSURE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS encyclopedia_cross_links (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entry_id VARCHAR NOT NULL,
    target_entry_id VARCHAR NOT NULL,
    match_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    match_reason TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_entry_id, target_entry_id)
  )
`;

let tableEnsured = false;
async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  await pool.query(ENSURE_TABLE_SQL);
  tableEnsured = true;
}

let colNames: { category: string; keywords: string; crossLinks: string } | null = null;
async function getColNames() {
  if (colNames) return colNames;
  const r = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'encyclopedia_entries'`
  );
  const cols = new Set(r.rows.map((row: any) => row.column_name));
  colNames = {
    category: cols.has('category') ? 'category' : 'domain',
    keywords: cols.has('seo_keywords') ? 'seo_keywords' : 'keywords',
    crossLinks: cols.has('cross_profession_links') ? 'cross_profession_links' : 'cross_links',
  };
  return colNames;
}

interface EntryRow {
  id: string;
  profession: string;
  slug: string;
  title: string;
  category: string;
  seo_keywords: string[] | null;
  overview: string | null;
}

interface CrossLinkMatch {
  sourceId: string;
  targetId: string;
  score: number;
  reason: string;
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function extractKeywords(entry: EntryRow): string[] {
  const words = new Set<string>();
  const titleWords = normalizeText(entry.title).split(/\s+/).filter(w => w.length > 2);
  titleWords.forEach(w => words.add(w));

  if (entry.seo_keywords) {
    for (const kw of entry.seo_keywords) {
      normalizeText(kw).split(/\s+/).filter(w => w.length > 2).forEach(w => words.add(w));
    }
  }

  const stopWords = new Set([
    "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",
    "have", "has", "had", "been", "will", "can", "may", "not", "but", "all",
    "each", "which", "their", "what", "about", "into", "more", "other", "than",
    "them", "then", "these", "some", "also", "most", "over", "such", "only",
    "its", "how", "when", "where", "who", "why",
  ]);

  return Array.from(words).filter(w => !stopWords.has(w));
}

function computeMatchScore(source: EntryRow, target: EntryRow): { score: number; reasons: string[] } {
  if (source.profession === target.profession) return { score: 0, reasons: [] };

  let score = 0;
  const reasons: string[] = [];

  const sourceTitle = normalizeText(source.title);
  const targetTitle = normalizeText(target.title);
  if (sourceTitle === targetTitle) {
    score += 10;
    reasons.push("exact title match");
  } else {
    const sourceWords = sourceTitle.split(/\s+/).filter(w => w.length > 3);
    const targetWords = targetTitle.split(/\s+/).filter(w => w.length > 3);
    const titleOverlap = sourceWords.filter(w => targetWords.includes(w));
    if (titleOverlap.length > 0) {
      const overlapRatio = titleOverlap.length / Math.max(sourceWords.length, targetWords.length);
      const titleScore = Math.round(overlapRatio * 8);
      if (titleScore > 0) {
        score += titleScore;
        reasons.push(`title overlap: ${titleOverlap.join(", ")}`);
      }
    }
  }

  if (source.category === target.category) {
    score += 3;
    reasons.push("same category");
  }

  const sourceKw = extractKeywords(source);
  const targetKw = extractKeywords(target);
  const kwOverlap = sourceKw.filter(w => targetKw.includes(w));
  if (kwOverlap.length > 0) {
    const kwScore = Math.min(kwOverlap.length, 5);
    score += kwScore;
    reasons.push(`keyword overlap (${kwOverlap.length}): ${kwOverlap.slice(0, 5).join(", ")}`);
  }

  if (source.overview && target.overview) {
    const sourceOverview = normalizeText(source.overview).split(/\s+/).filter(w => w.length > 4);
    const targetOverview = normalizeText(target.overview).split(/\s+/).filter(w => w.length > 4);
    const uniqueSource = new Set(sourceOverview);
    const uniqueTarget = new Set(targetOverview);
    let overviewOverlap = 0;
    uniqueSource.forEach(w => { if (uniqueTarget.has(w)) overviewOverlap++; });
    if (overviewOverlap >= 5) {
      const overviewScore = Math.min(Math.floor(overviewOverlap / 3), 4);
      score += overviewScore;
      reasons.push(`overview content overlap (${overviewOverlap} shared terms)`);
    }
  }

  return { score, reasons };
}

export async function analyzeAndPopulateCrossLinks(): Promise<{ totalLinks: number; entriesUpdated: number }> {
  await ensureTable();
  const cn = await getColNames();

  const result = await pool.query(
    `SELECT id, profession, slug, title,
            ${cn.category} AS category,
            ${cn.keywords} AS seo_keywords,
            overview
     FROM encyclopedia_entries WHERE status = 'published'`
  );
  const entries: EntryRow[] = result.rows;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`DELETE FROM encyclopedia_cross_links`);

    if (entries.length < 2) {
      const allIds = entries.map(e => e.id);
      if (allIds.length > 0) {
        await client.query(
          `UPDATE encyclopedia_entries SET ${cn.crossLinks} = '[]'::jsonb, updated_at = NOW() WHERE id = ANY($1)`,
          [allIds]
        );
      }
      await client.query("COMMIT");
      return { totalLinks: 0, entriesUpdated: 0 };
    }

    const matches: CrossLinkMatch[] = [];
    const THRESHOLD = 4;

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const { score, reasons } = computeMatchScore(entries[i], entries[j]);
        if (score >= THRESHOLD) {
          matches.push({
            sourceId: entries[i].id,
            targetId: entries[j].id,
            score,
            reason: reasons.join("; "),
          });
        }
      }
    }

    if (matches.length > 0) {
      const BATCH_SIZE = 100;
      for (let i = 0; i < matches.length; i += BATCH_SIZE) {
        const batch = matches.slice(i, i + BATCH_SIZE);
        const values: string[] = [];
        const params: any[] = [];
        let idx = 1;

        for (const m of batch) {
          values.push(`(gen_random_uuid(), $${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, 'active', NOW())`);
          params.push(m.sourceId, m.targetId, m.score, m.reason);
          idx += 4;
          values.push(`(gen_random_uuid(), $${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, 'active', NOW())`);
          params.push(m.targetId, m.sourceId, m.score, m.reason);
          idx += 4;
        }

        await client.query(
          `INSERT INTO encyclopedia_cross_links (id, source_entry_id, target_entry_id, match_score, match_reason, status, created_at)
           VALUES ${values.join(", ")}
           ON CONFLICT (source_entry_id, target_entry_id) DO UPDATE SET match_score = EXCLUDED.match_score, match_reason = EXCLUDED.match_reason`,
          params
        );
      }
    }

    const entryMap = new Map<string, EntryRow>();
    for (const e of entries) entryMap.set(e.id, e);

    const crossLinksResult = await client.query(
      `SELECT source_entry_id, target_entry_id, match_score
       FROM encyclopedia_cross_links
       WHERE status = 'active'
       ORDER BY match_score DESC`
    );

    const linksPerEntry = new Map<string, { profession: string; slug: string; title: string }[]>();
    for (const row of crossLinksResult.rows) {
      const target = entryMap.get(row.target_entry_id);
      if (!target) continue;
      if (!linksPerEntry.has(row.source_entry_id)) {
        linksPerEntry.set(row.source_entry_id, []);
      }
      const links = linksPerEntry.get(row.source_entry_id)!;
      if (links.length < 10) {
        links.push({
          profession: target.profession,
          slug: target.slug,
          title: target.title,
        });
      }
    }

    let entriesUpdated = 0;
    for (const e of entries) {
      const links = linksPerEntry.get(e.id) || [];
      await client.query(
        `UPDATE encyclopedia_entries SET ${cn.crossLinks} = $1::jsonb, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify(links), e.id]
      );
      entriesUpdated++;
    }

    await client.query("COMMIT");
    return { totalLinks: matches.length * 2, entriesUpdated };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getCrossLinksForEntry(entryId: string): Promise<any[]> {
  await ensureTable();
  const cn = await getColNames();

  const result = await pool.query(
    `SELECT cl.match_score, cl.match_reason, e.id, e.profession, e.slug, e.title,
            e.${cn.category} AS category, e.seo_description
     FROM encyclopedia_cross_links cl
     JOIN encyclopedia_entries e ON e.id = cl.target_entry_id
     WHERE cl.source_entry_id = $1 AND cl.status = 'active' AND e.status = 'published'
     ORDER BY cl.match_score DESC
     LIMIT 10`,
    [entryId]
  );

  return result.rows.map((r: any) => ({
    id: r.id,
    profession: r.profession,
    slug: r.slug,
    title: r.title,
    category: r.category,
    seoDescription: r.seo_description,
    matchScore: r.match_score,
    matchReason: r.match_reason,
  }));
}

export async function getCrossLinkStats(): Promise<any> {
  await ensureTable();

  const totalLinks = await pool.query(
    `SELECT COUNT(*)::int AS total FROM encyclopedia_cross_links WHERE status = 'active'`
  );
  const uniqueEntries = await pool.query(
    `SELECT COUNT(DISTINCT source_entry_id)::int AS total FROM encyclopedia_cross_links WHERE status = 'active'`
  );
  const avgScore = await pool.query(
    `SELECT COALESCE(AVG(match_score), 0)::float AS avg FROM encyclopedia_cross_links WHERE status = 'active'`
  );
  const byProfessionPair = await pool.query(
    `SELECT e1.profession AS source_profession, e2.profession AS target_profession, COUNT(*)::int AS link_count
     FROM encyclopedia_cross_links cl
     JOIN encyclopedia_entries e1 ON e1.id = cl.source_entry_id
     JOIN encyclopedia_entries e2 ON e2.id = cl.target_entry_id
     WHERE cl.status = 'active'
     GROUP BY e1.profession, e2.profession
     ORDER BY link_count DESC
     LIMIT 50`
  );

  return {
    totalLinks: totalLinks.rows[0]?.total || 0,
    uniqueLinkedEntries: uniqueEntries.rows[0]?.total || 0,
    averageMatchScore: Math.round((avgScore.rows[0]?.avg || 0) * 100) / 100,
    byProfessionPair: byProfessionPair.rows.map((r: any) => ({
      sourceProfession: r.source_profession,
      targetProfession: r.target_profession,
      linkCount: r.link_count,
    })),
  };
}
