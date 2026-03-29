import crypto from "crypto";
import { pool } from "./storage";

export interface VersionCreateInput {
  contentId: string;
  contentType: string;
  locale?: string;
  region?: string;
  tier?: string;
  payload: any;
  createdBy?: string;
  backupArtifactRefs?: any[];
}

export interface ContentVersionRecord {
  id: string;
  contentId: string;
  contentType: string;
  locale: string;
  region: string;
  tier: string;
  versionNumber: number;
  publishedAt: Date;
  validationStatus: string;
  payloadHash: string;
  backupArtifactRefs: any[];
  payload: any;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function stableStringify(obj: any): string {
  if (obj === null || obj === undefined) return "null";
  if (typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}

function computePayloadHash(payload: any): string {
  const serialized = stableStringify(payload);
  return crypto.createHash("sha256").update(serialized).digest("hex");
}

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

export async function createContentVersion(input: VersionCreateInput): Promise<ContentVersionRecord> {
  const payloadHash = computePayloadHash(input.payload);

  const MAX_RETRIES = 3;
  let insertedRow: any;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await pool.query(
        `INSERT INTO content_versions
         (id, content_id, content_type, locale, region, tier, version_number, published_at, validation_status, payload_hash, backup_artifact_refs, payload, created_by, created_at, updated_at)
         SELECT gen_random_uuid(), $1, $2, $3, $4, $5,
                COALESCE((SELECT MAX(version_number) FROM content_versions WHERE content_id = $1 AND content_type = $2), 0) + 1,
                NOW(), 'verified', $6, $7, $8, $9, NOW(), NOW()
         RETURNING *`,
        [
          input.contentId,
          input.contentType,
          input.locale || "en",
          input.region || "US",
          input.tier || "free",
          payloadHash,
          JSON.stringify(input.backupArtifactRefs || []),
          JSON.stringify(input.payload),
          input.createdBy || null,
        ]
      );
      insertedRow = result.rows[0];
      break;
    } catch (err: any) {
      if (err.code === "23505" && attempt < MAX_RETRIES - 1) {
        continue;
      }
      throw err;
    }
  }

  if (!insertedRow) {
    throw new Error(`Failed to create content version for ${input.contentType}:${input.contentId} after ${MAX_RETRIES} retries`);
  }

  const versionNumber = insertedRow.version_number;
  await pruneOldVersions(input.contentId, input.contentType);

  console.log(`[ContentVersion] Created version ${versionNumber} for ${input.contentType}:${input.contentId} (hash: ${payloadHash.substring(0, 12)}...)`);
  return snakeToCamel(insertedRow);
}

async function pruneOldVersions(contentId: string, contentType: string): Promise<void> {
  try {
    const verifiedVersions = await pool.query(
      `SELECT id FROM content_versions
       WHERE content_id = $1 AND content_type = $2 AND validation_status = 'verified'
       ORDER BY version_number DESC`,
      [contentId, contentType]
    );

    if (verifiedVersions.rows.length > 5) {
      const idsToDelete = verifiedVersions.rows.slice(5).map((r: any) => r.id);
      await pool.query(
        `DELETE FROM content_versions WHERE id = ANY($1)`,
        [idsToDelete]
      );
    }
  } catch (e: any) {
    console.error("[ContentVersion] Prune error:", e.message);
  }
}

function runtimeValidatePayload(payload: any, contentType: string): boolean {
  if (!payload) return false;

  switch (contentType) {
    case "question":
    case "exam_question": {
      const stem = payload.stem || payload.question || "";
      const options = payload.options || payload.choices || [];
      const correctAnswer = payload.correctAnswer || payload.correct_answer;
      if (!stem || stem.trim().length < 10) return false;
      if (!Array.isArray(options) || options.length < 2) return false;
      if (correctAnswer === null || correctAnswer === undefined) return false;
      return true;
    }
    case "flashcard":
    case "deck_flashcard": {
      const front = payload.front || "";
      const back = payload.back || "";
      if (!front || front.trim().length < 3) return false;
      if (!back || back.trim().length < 3) return false;
      return true;
    }
    case "lesson": {
      const title = payload.title || "";
      if (!title || title.trim().length < 3) return false;
      return true;
    }
    case "exam_config":
    case "exam_blueprint": {
      if (!payload.title && !payload.name && !payload.code && !payload.exam_name && !payload.exam_code && !payload.examName && !payload.examCode) return false;
      return true;
    }
    case "digital_product": {
      if (!payload.title || !payload.slug) return false;
      return true;
    }
    case "flashcard_deck": {
      if (!payload.title) return false;
      return true;
    }
    default:
      return payload !== null && payload !== undefined;
  }
}

export async function getVerifiedContent(
  contentId: string,
  contentType: string
): Promise<{ version: ContentVersionRecord; failoverUsed: boolean } | null> {
  const versions = await pool.query(
    `SELECT * FROM content_versions
     WHERE content_id = $1 AND content_type = $2 AND validation_status = 'verified'
     ORDER BY version_number DESC LIMIT 2`,
    [contentId, contentType]
  );

  if (versions.rows.length === 0) return null;

  const latest = snakeToCamel(versions.rows[0]) as ContentVersionRecord;

  if (runtimeValidatePayload(latest.payload, contentType)) {
    return { version: latest, failoverUsed: false };
  }

  console.warn(`[ContentVersion] Latest version ${latest.versionNumber} for ${contentType}:${contentId} failed runtime validation, attempting failover...`);

  await pool.query(
    `UPDATE content_versions SET validation_status = 'failed_runtime', updated_at = NOW() WHERE id = $1`,
    [latest.id]
  );

  if (versions.rows.length > 1) {
    const previous = snakeToCamel(versions.rows[1]) as ContentVersionRecord;
    if (runtimeValidatePayload(previous.payload, contentType)) {
      console.warn(`[ContentVersion] Failover to version ${previous.versionNumber} for ${contentType}:${contentId} succeeded`);
      logFailoverEvent(contentId, contentType, latest.versionNumber, previous.versionNumber);
      return { version: previous, failoverUsed: true };
    }
  }

  console.error(`[ContentVersion] No valid version available for ${contentType}:${contentId}`);
  return null;
}

async function logFailoverEvent(contentId: string, contentType: string, fromVersion: number, toVersion: number): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, entity_type, entity_id, action, after_json, created_at)
       VALUES (gen_random_uuid(), $1, $2, 'content_version_failover', $3, NOW())`,
      [
        contentType,
        contentId,
        JSON.stringify({ fromVersion, toVersion, reason: "runtime_validation_failure" }),
      ]
    );
  } catch (e: any) {
    console.error("[ContentVersion] Failed to log failover event:", e.message);
  }
}

export async function getVersionHistory(
  contentId: string,
  contentType: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ versions: ContentVersionRecord[]; total: number }> {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM content_versions WHERE content_id = $1 AND content_type = $2`,
    [contentId, contentType]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT * FROM content_versions
     WHERE content_id = $1 AND content_type = $2
     ORDER BY version_number DESC
     LIMIT $3 OFFSET $4`,
    [contentId, contentType, limit, offset]
  );

  return { versions: result.rows.map(snakeToCamel), total };
}

export async function getVersion(versionId: string): Promise<ContentVersionRecord | null> {
  const result = await pool.query(
    `SELECT * FROM content_versions WHERE id = $1`,
    [versionId]
  );
  return result.rows.length > 0 ? snakeToCamel(result.rows[0]) : null;
}

export async function restoreVersion(versionId: string, restoredBy?: string): Promise<ContentVersionRecord> {
  const version = await getVersion(versionId);
  if (!version) throw new Error("Version not found");
  if (version.validationStatus !== "verified") throw new Error("Cannot restore a non-verified version");

  const newVersion = await createContentVersion({
    contentId: version.contentId,
    contentType: version.contentType,
    locale: version.locale,
    region: version.region,
    tier: version.tier,
    payload: version.payload,
    createdBy: restoredBy || version.createdBy || undefined,
    backupArtifactRefs: version.backupArtifactRefs as any[],
  });

  console.log(`[ContentVersion] Restored version ${version.versionNumber} as new version ${newVersion.versionNumber} for ${version.contentType}:${version.contentId}`);
  return newVersion;
}

export async function listAllVersions(filters?: {
  contentType?: string;
  validationStatus?: string;
  limit?: number;
  offset?: number;
}): Promise<{ versions: ContentVersionRecord[]; total: number }> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters?.contentType) {
    params.push(filters.contentType);
    conditions.push(`content_type = $${params.length}`);
  }
  if (filters?.validationStatus) {
    params.push(filters.validationStatus);
    conditions.push(`validation_status = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM content_versions ${whereClause}`,
    params
  );

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;
  params.push(limit, offset);

  const result = await pool.query(
    `SELECT * FROM content_versions ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { versions: result.rows.map(snakeToCamel), total: countResult.rows[0].total };
}

export async function createVersionOnPublish(
  contentId: string,
  contentType: string,
  payload: any,
  options?: { locale?: string; region?: string; tier?: string; createdBy?: string }
): Promise<ContentVersionRecord> {
  if (!runtimeValidatePayload(payload, contentType)) {
    throw new Error(`Payload for ${contentType}:${contentId} failed runtime validation`);
  }

  return await createContentVersion({
    contentId,
    contentType,
    locale: options?.locale,
    region: options?.region,
    tier: options?.tier,
    payload,
    createdBy: options?.createdBy,
  });
}

export async function ensureContentVersionsTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_versions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        content_id VARCHAR NOT NULL,
        content_type TEXT NOT NULL,
        locale TEXT DEFAULT 'en',
        region TEXT DEFAULT 'US',
        tier TEXT DEFAULT 'free',
        version_number INTEGER NOT NULL DEFAULT 1,
        published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        validation_status TEXT NOT NULL DEFAULT 'verified',
        payload_hash TEXT NOT NULL,
        backup_artifact_refs JSONB DEFAULT '[]'::jsonb,
        payload JSONB DEFAULT '{}'::jsonb,
        created_by VARCHAR,
        updated_by VARCHAR,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`ALTER TABLE content_versions ADD COLUMN IF NOT EXISTS validation_status TEXT NOT NULL DEFAULT 'verified'`);
    await pool.query(`ALTER TABLE content_versions ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb`);
    await pool.query(`ALTER TABLE content_versions ADD COLUMN IF NOT EXISTS backup_artifact_refs JSONB DEFAULT '[]'::jsonb`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_content_versions_lookup ON content_versions (content_id, content_type, validation_status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_content_versions_type ON content_versions (content_type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_content_versions_status ON content_versions (validation_status)`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_content_versions_unique_version ON content_versions (content_id, content_type, version_number)`);
    console.log("[ContentVersion] Table ensured");
  } catch (e: any) {
    console.error("[ContentVersion] Table creation error:", e.message);
  }
}