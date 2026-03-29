import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { routeParamString } from "./route-params";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

function extractTextFromContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (typeof block === "string") return block;
        if (block && typeof block.content === "string") return block.content;
        if (block && Array.isArray(block.items)) return block.items.join(" ");
        return "";
      })
      .join(" ");
  }
  return "";
}

function generateStaticHtml(item: any): string {
  const title = item.title || "Content";
  const summary = item.summary || "";
  const contentBlocks = Array.isArray(item.content) ? item.content : [];

  let bodyHtml = "";
  for (const block of contentBlocks) {
    if (!block) continue;
    const type = block.type || "paragraph";
    const content = block.content || "";

    switch (type) {
      case "heading":
        bodyHtml += `<h2>${escapeHtml(content)}</h2>\n`;
        break;
      case "paragraph":
        bodyHtml += `<p>${escapeHtml(content)}</p>\n`;
        break;
      case "list":
      case "bulletList":
        if (Array.isArray(block.items)) {
          bodyHtml += "<ul>\n";
          for (const item of block.items) {
            bodyHtml += `  <li>${escapeHtml(item)}</li>\n`;
          }
          bodyHtml += "</ul>\n";
        }
        break;
      case "clinical-pearl":
        bodyHtml += `<div class="clinical-pearl"><strong>Clinical Pearl:</strong> ${escapeHtml(content)}</div>\n`;
        break;
      case "medication":
        bodyHtml += `<div class="medication"><pre>${escapeHtml(content)}</pre></div>\n`;
        break;
      default:
        if (content) bodyHtml += `<p>${escapeHtml(content)}</p>\n`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${escapeHtml(title)}</title></head>
<body>
<h1>${escapeHtml(title)}</h1>
${summary ? `<p class="summary">${escapeHtml(summary)}</p>` : ""}
${bodyHtml}
<footer><p>Static fallback version. Some interactive features may be unavailable.</p></footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function validateContentBlocks(content: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!content) {
    errors.push("Content is null or undefined");
    return { valid: false, errors };
  }
  if (!Array.isArray(content)) {
    errors.push("Content is not an array");
    return { valid: false, errors };
  }
  if (content.length === 0) {
    errors.push("Content array is empty");
    return { valid: false, errors };
  }
  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (!block || typeof block !== "object") {
      errors.push(`Block ${i} is not a valid object`);
    }
  }
  return { valid: errors.length === 0, errors };
}

function buildVerifiedPayload(item: any): any {
  const blocks = Array.isArray(item.content) ? item.content : [];
  const normalizedBlocks = blocks.map((block: any) => {
    if (!block || typeof block !== "object") return { type: "paragraph", content: "" };
    return {
      type: block.type || "paragraph",
      content: block.content || "",
      ...(block.items ? { items: Array.isArray(block.items) ? block.items : [] } : {}),
    };
  });

  return {
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    type: item.type || "lesson",
    category: item.category || null,
    tier: item.tier || "free",
    summary: item.summary || "",
    content: normalizedBlocks,
    seoTitle: item.seoTitle || item.seo_title || null,
    seoDescription: item.seoDescription || item.seo_description || null,
    regionScope: item.regionScope || item.region_scope || "BOTH",
    publishedAt: item.publishedAt || item.published_at || null,
    verified: true,
    verifiedAt: new Date().toISOString(),
  };
}

function buildBackupPayload(item: any): any {
  const text = extractTextFromContent(item.content);
  const truncated = text.length > 2000 ? text.substring(0, 2000) + "..." : text;

  return {
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    type: item.type || "lesson",
    tier: item.tier || "free",
    summary: item.summary || truncated.substring(0, 300),
    content: [{ type: "paragraph", content: truncated }],
    minimal: true,
    createdAt: new Date().toISOString(),
  };
}

export async function generateRenderPayloads(contentId: string): Promise<{ verified: boolean; backup: boolean; html: boolean }> {
  const result = { verified: false, backup: false, html: false };

  try {
    const itemResult = await pool.query("SELECT * FROM content_items WHERE id = $1", [contentId]);
    if (itemResult.rows.length === 0) return result;
    const item = snakeToCamel(itemResult.rows[0]);

    const versionResult = await pool.query(
      "SELECT COALESCE(MAX(version), 0) as max_version FROM render_payloads WHERE content_id = $1",
      [contentId]
    );
    const nextVersion = parseInt(versionResult.rows[0].max_version) + 1;

    const verifiedPayload = buildVerifiedPayload(item);
    await pool.query(
      `INSERT INTO render_payloads (id, content_id, payload_type, version, data, validated_at, created_at)
       VALUES (gen_random_uuid(), $1, 'verified', $2, $3, NOW(), NOW())`,
      [contentId, nextVersion, JSON.stringify(verifiedPayload)]
    );
    result.verified = true;

    const backupPayload = buildBackupPayload(item);
    await pool.query(
      `INSERT INTO render_payloads (id, content_id, payload_type, version, data, created_at)
       VALUES (gen_random_uuid(), $1, 'backup', $2, $3, NOW())`,
      [contentId, nextVersion, JSON.stringify(backupPayload)]
    );
    result.backup = true;

    const htmlSnapshot = generateStaticHtml(item);
    await pool.query(
      `INSERT INTO render_payloads (id, content_id, payload_type, version, data, html_snapshot, created_at)
       VALUES (gen_random_uuid(), $1, 'static_html', $2, $3, $4, NOW())`,
      [contentId, nextVersion, JSON.stringify({ generated: true }), htmlSnapshot]
    );
    result.html = true;

    await pool.query(
      `INSERT INTO content_snapshots (id, content_id, version, title, slug, content_data, metadata, snapshot_type, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'publish', NOW())`,
      [
        contentId, nextVersion, item.title, item.slug,
        JSON.stringify(item.content),
        JSON.stringify({ tier: item.tier, category: item.category, status: item.status, regionScope: item.regionScope }),
      ]
    );

    const oldPayloads = await pool.query(
      `SELECT id FROM render_payloads WHERE content_id = $1 AND version < $2 - 5`,
      [contentId, nextVersion]
    );
    if (oldPayloads.rows.length > 0) {
      const ids = oldPayloads.rows.map((r: any) => r.id);
      await pool.query(`DELETE FROM render_payloads WHERE id = ANY($1)`, [ids]);
    }

    const oldSnapshots = await pool.query(
      `SELECT id FROM content_snapshots WHERE content_id = $1 AND version < $2 - 10`,
      [contentId, nextVersion]
    );
    if (oldSnapshots.rows.length > 0) {
      const ids = oldSnapshots.rows.map((r: any) => r.id);
      await pool.query(`DELETE FROM content_snapshots WHERE id = ANY($1)`, [ids]);
    }

  } catch (err: any) {
    console.error(`[ContentFailover] Error generating payloads for ${contentId}:`, err.message);
  }

  return result;
}

async function logFallbackEvent(contentId: string | null, failureReason: string, fallbackTier: string, requestPath: string, responseTime?: number): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO fallback_event_logs (id, content_id, failure_reason, fallback_tier, request_path, response_time, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
      [contentId, failureReason, fallbackTier, requestPath, responseTime || null]
    );
  } catch (err: any) {
    console.error("[ContentFailover] Failed to log fallback event:", err.message);
  }
}

async function logSubstitutionEvent(originalId: string | null, substituteId: string, criteria: any, score: number, reason: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO substitution_event_logs (id, original_content_id, substitute_content_id, match_criteria, match_score, reason, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
      [originalId, substituteId, JSON.stringify(criteria), score, reason]
    );
  } catch (err: any) {
    console.error("[ContentFailover] Failed to log substitution event:", err.message);
  }
}

async function getVerifiedPayload(contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT data FROM render_payloads WHERE content_id = $1 AND payload_type = 'verified'
       ORDER BY version DESC LIMIT 1`,
      [contentId]
    );
    if (result.rows.length > 0) {
      return typeof result.rows[0].data === "string" ? JSON.parse(result.rows[0].data) : result.rows[0].data;
    }
  } catch (err: any) {
    console.error("[ContentFailover] Error fetching verified payload:", err.message);
  }
  return null;
}

async function getBackupPayload(contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT data FROM render_payloads WHERE content_id = $1 AND payload_type = 'backup'
       ORDER BY version DESC LIMIT 1`,
      [contentId]
    );
    if (result.rows.length > 0) {
      return typeof result.rows[0].data === "string" ? JSON.parse(result.rows[0].data) : result.rows[0].data;
    }
  } catch (err: any) {
    console.error("[ContentFailover] Error fetching backup payload:", err.message);
  }
  return null;
}

async function getStaticHtml(contentId: string): Promise<string | null> {
  try {
    const result = await pool.query(
      `SELECT html_snapshot FROM render_payloads WHERE content_id = $1 AND payload_type = 'static_html'
       ORDER BY version DESC LIMIT 1`,
      [contentId]
    );
    if (result.rows.length > 0 && result.rows[0].html_snapshot) {
      return result.rows[0].html_snapshot;
    }
  } catch (err: any) {
    console.error("[ContentFailover] Error fetching static HTML:", err.message);
  }
  return null;
}

async function findSubstituteContent(
  originalItem: any,
  originalId: string | null
): Promise<any | null> {
  try {
    const tier = originalItem?.tier || "free";
    const category = originalItem?.category || originalItem?.bodySystem || null;
    const type = originalItem?.type || "lesson";

    let query = `SELECT * FROM content_items WHERE status = 'published' AND type = $1`;
    const params: any[] = [type];
    let paramIdx = 2;

    if (originalId) {
      query += ` AND id != $${paramIdx}`;
      params.push(originalId);
      paramIdx++;
    }

    if (category) {
      query += ` AND category = $${paramIdx}`;
      params.push(category);
      paramIdx++;
    }

    if (tier && tier !== "free") {
      query += ` AND (tier = $${paramIdx} OR tier = 'free')`;
      params.push(tier);
      paramIdx++;
    }

    query += ` ORDER BY published_at DESC NULLS LAST LIMIT 5`;

    const result = await pool.query(query, params);
    if (result.rows.length === 0 && category) {
      const fallbackResult = await pool.query(
        `SELECT * FROM content_items WHERE status = 'published' AND type = $1
         ${originalId ? "AND id != $2" : ""}
         ORDER BY published_at DESC NULLS LAST LIMIT 3`,
        originalId ? [type, originalId] : [type]
      );
      if (fallbackResult.rows.length > 0) {
        const substitute = snakeToCamel(fallbackResult.rows[0]);
        const criteria = { type, tier, category: "any" };
        await logSubstitutionEvent(originalId, substitute.id, criteria, 30, "No exact match, generic substitute used");
        return substitute;
      }
      return null;
    }

    if (result.rows.length > 0) {
      let bestMatch = result.rows[0];
      let bestScore = 0;

      for (const row of result.rows) {
        let score = 50;
        if (row.tier === tier) score += 25;
        if (row.category === category) score += 25;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = row;
        }
      }

      const substitute = snakeToCamel(bestMatch);
      const criteria = { type, tier, category };
      await logSubstitutionEvent(originalId, substitute.id, criteria, bestScore, "Matched by profession/tier/topic");
      return substitute;
    }
  } catch (err: any) {
    console.error("[ContentFailover] Error finding substitute:", err.message);
  }
  return null;
}

export async function serveWithFallback(
  contentId: string,
  requestPath: string,
  originalItem: any | null,
  failureReason: string
): Promise<{ data: any; fallbackTier: string; isSubstitute: boolean }> {
  const startTime = Date.now();

  const verified = await getVerifiedPayload(contentId);
  if (verified) {
    const elapsed = Date.now() - startTime;
    await logFallbackEvent(contentId, failureReason, "cached_payload", requestPath, elapsed);
    return { data: verified, fallbackTier: "cached_payload", isSubstitute: false };
  }

  const backup = await getBackupPayload(contentId);
  if (backup) {
    const elapsed = Date.now() - startTime;
    await logFallbackEvent(contentId, failureReason, "backup_payload", requestPath, elapsed);
    return { data: backup, fallbackTier: "backup_payload", isSubstitute: false };
  }

  const html = await getStaticHtml(contentId);
  if (html) {
    const elapsed = Date.now() - startTime;
    await logFallbackEvent(contentId, failureReason, "static_html", requestPath, elapsed);
    return {
      data: {
        id: contentId,
        title: "Content (Fallback)",
        content: [{ type: "paragraph", content: "This content is being served from a static backup." }],
        _staticHtml: html,
        _fallback: true,
      },
      fallbackTier: "static_html",
      isSubstitute: false,
    };
  }

  const substitute = await findSubstituteContent(originalItem, contentId);
  if (substitute) {
    const elapsed = Date.now() - startTime;
    await logFallbackEvent(contentId, failureReason, "substitute", requestPath, elapsed);
    return {
      data: {
        ...substitute,
        _isSubstitute: true,
        _originalContentId: contentId,
        _substituteMessage: "This item is temporarily unavailable. We've opened a backup resource.",
      },
      fallbackTier: "substitute",
      isSubstitute: true,
    };
  }

  const elapsed = Date.now() - startTime;
  await logFallbackEvent(contentId, failureReason, "none_available", requestPath, elapsed);
  return {
    data: null,
    fallbackTier: "none_available",
    isSubstitute: false,
  };
}

export function registerContentFailoverRoutes(app: Express): void {

  app.post("/api/admin/content-failover/generate-payloads", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId } = req.body;
      if (!contentId) return res.status(400).json({ error: "contentId is required" });

      const result = await generateRenderPayloads(contentId);
      res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("[ContentFailover] Generate payloads error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-failover/generate-all", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const publishedResult = await pool.query(
        "SELECT id FROM content_items WHERE status = 'published' ORDER BY updated_at DESC LIMIT 500"
      );

      let generated = 0;
      let failed = 0;

      for (const row of publishedResult.rows) {
        try {
          const payloadResult = await generateRenderPayloads(row.id);
          if (payloadResult.verified && payloadResult.backup && payloadResult.html) {
            generated++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }

      res.json({ success: true, generated, failed, total: publishedResult.rows.length });
    } catch (err: any) {
      console.error("[ContentFailover] Generate all error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-failover/stats", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [
        payloadStats,
        fallbackStats,
        substitutionStats,
        recentFallbacks,
        brokenContent,
        fallbackByTier,
      ] = await Promise.all([
        pool.query(`SELECT payload_type, COUNT(*) as count FROM render_payloads GROUP BY payload_type`),
        pool.query(`SELECT COUNT(*) as total,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_7d
          FROM fallback_event_logs`),
        pool.query(`SELECT COUNT(*) as total,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_7d
          FROM substitution_event_logs`),
        pool.query(`SELECT content_id, failure_reason, fallback_tier, request_path, created_at
          FROM fallback_event_logs ORDER BY created_at DESC LIMIT 20`),
        pool.query(`SELECT f.content_id, COUNT(*) as failure_count, MAX(f.failure_reason) as last_reason, MAX(f.created_at) as last_failure
          FROM fallback_event_logs f
          WHERE f.created_at > NOW() - INTERVAL '7 days' AND f.fallback_tier != 'cached_payload'
          GROUP BY f.content_id HAVING COUNT(*) >= 2 ORDER BY failure_count DESC LIMIT 20`),
        pool.query(`SELECT fallback_tier, COUNT(*) as count
          FROM fallback_event_logs WHERE created_at > NOW() - INTERVAL '7 days'
          GROUP BY fallback_tier ORDER BY count DESC`),
      ]);

      const publishedCount = await pool.query("SELECT COUNT(*) as cnt FROM content_items WHERE status = 'published'");
      const payloadCoverage = await pool.query(
        `SELECT COUNT(DISTINCT content_id) as cnt FROM render_payloads WHERE payload_type = 'verified'`
      );

      res.json({
        payloads: snakeToCamel(payloadStats.rows),
        fallbacks: snakeToCamel(fallbackStats.rows[0]),
        substitutions: snakeToCamel(substitutionStats.rows[0]),
        recentFallbacks: snakeToCamel(recentFallbacks.rows),
        brokenContent: snakeToCamel(brokenContent.rows),
        fallbackByTier: snakeToCamel(fallbackByTier.rows),
        coverage: {
          publishedItems: parseInt(publishedCount.rows[0].cnt),
          itemsWithPayloads: parseInt(payloadCoverage.rows[0].cnt),
          coveragePercent: publishedCount.rows[0].cnt > 0
            ? Math.round((parseInt(payloadCoverage.rows[0].cnt) / parseInt(publishedCount.rows[0].cnt)) * 100)
            : 0,
        },
      });
    } catch (err: any) {
      console.error("[ContentFailover] Stats error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-failover/broken-content", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`
        SELECT f.content_id, c.title, c.slug, c.status, c.tier,
          COUNT(*) as failure_count,
          MAX(f.failure_reason) as last_reason,
          (SELECT ft.fallback_tier FROM fallback_event_logs ft
           WHERE ft.content_id = f.content_id
           ORDER BY CASE ft.fallback_tier
             WHEN 'none_available' THEN 5
             WHEN 'substitute' THEN 4
             WHEN 'static_html' THEN 3
             WHEN 'backup_payload' THEN 2
             WHEN 'cached_payload' THEN 1
             ELSE 0 END DESC LIMIT 1) as worst_fallback,
          MAX(f.created_at) as last_failure
        FROM fallback_event_logs f
        LEFT JOIN content_items c ON c.id = f.content_id
        WHERE f.created_at > NOW() - INTERVAL '30 days'
        GROUP BY f.content_id, c.title, c.slug, c.status, c.tier
        ORDER BY failure_count DESC LIMIT 50
      `);

      res.json(snakeToCamel(result.rows));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-failover/restore", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, snapshotId } = req.body;
      if (!contentId) return res.status(400).json({ error: "contentId is required" });

      let snapshot;
      if (snapshotId) {
        const snapResult = await pool.query("SELECT * FROM content_snapshots WHERE id = $1", [snapshotId]);
        snapshot = snapResult.rows[0];
      } else {
        const snapResult = await pool.query(
          "SELECT * FROM content_snapshots WHERE content_id = $1 ORDER BY version DESC LIMIT 1",
          [contentId]
        );
        snapshot = snapResult.rows[0];
      }

      if (!snapshot) return res.status(404).json({ error: "No snapshot found" });

      const metadata = typeof snapshot.metadata === "string" ? JSON.parse(snapshot.metadata) : snapshot.metadata;
      const contentData = typeof snapshot.content_data === "string" ? JSON.parse(snapshot.content_data) : snapshot.content_data;

      await pool.query(
        `UPDATE content_items SET title = $1, slug = $2, content = $3, tier = $4, category = $5, updated_at = NOW()
         WHERE id = $6`,
        [
          snapshot.title, snapshot.slug, JSON.stringify(contentData),
          metadata?.tier || "free", metadata?.category || null, contentId,
        ]
      );

      await generateRenderPayloads(contentId);

      res.json({ success: true, restoredVersion: snapshot.version });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-failover/snapshots/:contentId", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        "SELECT id, content_id, version, title, slug, snapshot_type, created_at FROM content_snapshots WHERE content_id = $1 ORDER BY version DESC LIMIT 20",
        [routeParamString(req.params.contentId)]
      );

      res.json(snakeToCamel(result.rows));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/content-failover/render/:contentId", async (req: Request, res: Response) => {
    try {
      const contentId = routeParamString(req.params.contentId);
      const payload = await getVerifiedPayload(contentId);

      if (payload) {
        res.setHeader("X-Content-Source", "verified-payload");
        res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
        return res.json(payload);
      }

      const backup = await getBackupPayload(contentId);
      if (backup) {
        await logFallbackEvent(contentId, "verified_payload_missing", "backup_payload", req.path);
        res.setHeader("X-Content-Source", "backup-payload");
        res.setHeader("Cache-Control", "public, max-age=60");
        return res.json(backup);
      }

      const html = await getStaticHtml(contentId);
      if (html) {
        await logFallbackEvent(contentId, "all_payloads_missing", "static_html", req.path);
        res.setHeader("X-Content-Source", "static-html");
        res.setHeader("Content-Type", "text/html");
        return res.send(html);
      }

      let originalItem: any = null;
      try {
        const itemResult = await pool.query("SELECT * FROM content_items WHERE id = $1", [contentId]);
        if (itemResult.rows.length > 0) originalItem = snakeToCamel(itemResult.rows[0]);
      } catch {}

      const substitute = await findSubstituteContent(originalItem || { type: "lesson", tier: "free" }, contentId);
      if (substitute) {
        await logFallbackEvent(contentId, "all_fallbacks_exhausted", "substitute", req.path);
        res.setHeader("X-Content-Source", "substitute");
        return res.json({
          ...substitute,
          _isSubstitute: true,
          _originalContentId: contentId,
          _substituteMessage: "This item is temporarily unavailable. We've opened a backup resource.",
        });
      }

      await logFallbackEvent(contentId, "no_fallback_available", "none_available", req.path);
      res.status(404).json({ error: "Content not found and no fallback available" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/content-failover/substitute/:contentId", async (req: Request, res: Response) => {
    try {
      const contentId = routeParamString(req.params.contentId);

      let originalItem: any = null;
      try {
        const itemResult = await pool.query("SELECT * FROM content_items WHERE id = $1", [contentId]);
        if (itemResult.rows.length > 0) originalItem = snakeToCamel(itemResult.rows[0]);
      } catch {}

      const substitute = await findSubstituteContent(originalItem || { type: "lesson", tier: "free" }, contentId);
      if (substitute) {
        res.json({
          ...substitute,
          _isSubstitute: true,
          _originalContentId: contentId,
          _substituteMessage: "This item is temporarily unavailable. We've opened a backup resource.",
        });
      } else {
        res.status(404).json({ error: "No substitute content available" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-failover/fallback-rates", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const days = parseInt(req.query.days as string) || 7;

      const result = await pool.query(`
        SELECT
          DATE(created_at) as date,
          fallback_tier,
          COUNT(*) as count
        FROM fallback_event_logs
        WHERE created_at > NOW() - INTERVAL '1 day' * $1
        GROUP BY DATE(created_at), fallback_tier
        ORDER BY date DESC, count DESC
      `, [days]);

      res.json(snakeToCamel(result.rows));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
