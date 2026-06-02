#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { Pool } = pg;

const OUT_DIR = path.resolve(process.cwd(), "reports/hidden-article-repositories");
const NOW_SQL = "now()";

const ARTICLE_FIELD_PATTERNS = [
  /(^|_)title($|_)/i,
  /(^|_)slug($|_)/i,
  /(^|_)(body|content|markdown|html|rich_text|article)($|_)/i,
  /(^|_)(seo|meta|description|excerpt|summary|canonical|og|keywords?)($|_)/i,
];

const BODY_FIELD_PATTERNS = [
  /(^|_)(body|content|markdown|html|rich_text|article|sections?|blocks?)($|_)/i,
];

const TITLE_FIELD_PATTERNS = [/(^|_)title($|_)/i, /(^|_)heading($|_)/i];
const SLUG_FIELD_PATTERNS = [/(^|_)slug($|_)/i];
const SEO_FIELD_PATTERNS = [/(^|_)(seo|meta|description|excerpt|summary|canonical|og|keywords?)($|_)/i];

const QUESTION_FIELD_PATTERNS = [/(^|_)(stem|question|prompt|rationale|answer|options?)($|_)/i];
const FLASHCARD_FIELD_PATTERNS = [/(^|_)(front|back|card|deck|hint|memory|mnemonic)($|_)/i];
const LESSON_FIELD_PATTERNS = [/(^|_)(lesson|module|objective|takeaway|sections?)($|_)/i];

function quoteIdent(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function qTable(schema, table) {
  return `${quoteIdent(schema)}.${quoteIdent(table)}`;
}

function csvCell(value) {
  const s = value == null ? "" : String(value);
  return `"${s.replaceAll('"', '""')}"`;
}

function hasAny(columns, patterns) {
  return columns.some((c) => patterns.some((p) => p.test(c.column_name) || p.test(semanticName(c.column_name))));
}

function names(columns, patterns) {
  return columns
    .filter((c) => {
      const semantic = semanticName(c.column_name);
      if (semantic.endsWith("_id") || semantic.endsWith("_key")) return false;
      if (["content_type", "content_hash", "body_system", "licensing_body"].includes(semantic)) return false;
      return patterns.some((p) => p.test(c.column_name) || p.test(semantic));
    })
    .map((c) => c.column_name);
}

function semanticName(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase();
}

function inferContentType(tableName, columns, articleLike) {
  const score = (patterns) => names(columns, patterns).length;
  const table = tableName.toLowerCase();
  const questionScore = score(QUESTION_FIELD_PATTERNS) + (table.includes("question") ? 1 : 0);
  const flashcardScore = score(FLASHCARD_FIELD_PATTERNS) + (table.includes("flashcard") || table.includes("deck") ? 1 : 0);
  const lessonScore = score(LESSON_FIELD_PATTERNS) + (table.includes("lesson") || table.includes("module") ? 1 : 0);
  if (articleLike && (table.includes("blog") || table.includes("article") || table.includes("content_item"))) return "article-like";
  if (questionScore >= Math.max(2, flashcardScore, lessonScore)) return "question-like";
  if (flashcardScore >= Math.max(2, questionScore, lessonScore)) return "flashcard-like";
  if (lessonScore >= Math.max(2, questionScore, flashcardScore)) return "lesson-like";
  if (articleLike) return "article-like";
  if (hasAny(columns, [/email/i, /password/i, /role/i, /session/i, /token/i])) return "auth/user/system";
  if (columns.length <= 4 && hasAny(columns, [/id$/i])) return "join/config";
  return "non-article/operational";
}

function visibilityExpressions(columns) {
  const columnNames = new Set(columns.map((c) => c.column_name));
  if (
    columnNames.has("postStatus") &&
    columnNames.has("publishAt") &&
    columnNames.has("workflowStatus") &&
    columnNames.has("scheduledAt")
  ) {
    const publicWhere = [
      "(",
      "(",
      "\"postStatus\" = 'PUBLISHED'",
      "AND (\"publishAt\" IS NULL OR \"publishAt\" <= now())",
      "AND \"workflowStatus\" = 'PUBLISHED'",
      ")",
      "OR",
      "(",
      "\"postStatus\" = 'APPROVED'",
      "AND \"workflowStatus\" NOT IN ('FAILED_GENERATION','FAILED_IMAGE')",
      ")",
      "OR",
      "(",
      "\"postStatus\" = 'SCHEDULED'",
      "AND (\"publishAt\" <= now() OR \"scheduledAt\" <= now())",
      "AND \"workflowStatus\" NOT IN ('FAILED_GENERATION','FAILED_IMAGE','GENERATED','OUTLINE_READY','NEEDS_SOURCE_REVIEW','NEEDS_MEDICAL_REVIEW','NEEDS_SEO_REVIEW','NEEDS_METADATA','NEEDS_REFERENCES')",
      ")",
      ")",
      "AND NOT (",
      "lower(\"slug\") LIKE '%bloge2e%'",
      "OR lower(\"title\") LIKE '%bloge2e%'",
      "OR lower(\"title\") LIKE '%runtime draft scheduled%'",
      "OR lower(\"title\") LIKE '%runtime en scheduled%'",
      "OR lower(\"title\") LIKE '%runtime en published%'",
      ")",
    ].join(" ");
    return {
      publicWhere,
      hiddenWhere: `NOT (${publicWhere})`,
      reasons: ["postStatus", "publishAt", "workflowStatus", "scheduledAt"],
    };
  }

  const exprs = [];
  const reasons = [];
  const publicationStatusNames = new Set([
    "status",
    "state",
    "visibility",
    "post_status",
    "workflow_status",
    "publication_status",
    "publish_status",
    "content_status",
  ]);

  for (const c of columns) {
    const col = quoteIdent(c.column_name);
    const name = semanticName(c.column_name);
    const type = c.data_type.toLowerCase();
    const isText = ["text", "character varying", "character", "USER-DEFINED".toLowerCase()].includes(type) || type.includes("char");
    const isBool = type === "boolean";
    const isTime = type.includes("timestamp") || type === "date";

    if (isBool && /^(published|is_published|is_public|public|visible|is_visible|active|enabled)$/.test(name)) {
      exprs.push(`${col} IS TRUE`);
      reasons.push(c.column_name);
    }
    if (isBool && /^(hidden|is_hidden|archived|is_archived|draft|is_draft|private|is_private|deleted|is_deleted|noindex|is_noindex)$/.test(name)) {
      exprs.push(`(${col} IS FALSE OR ${col} IS NULL)`);
      reasons.push(c.column_name);
    }
    if (isText && publicationStatusNames.has(name)) {
      exprs.push(`lower(coalesce(${col}::text, '')) IN ('published','live','public','public_preview','active','approved','scheduled')`);
      reasons.push(c.column_name);
    }
    if (isTime && /(^|_)(deleted_at|archived_at|removed_at)($|_)/.test(name)) {
      exprs.push(`${col} IS NULL`);
      reasons.push(c.column_name);
    }
    if (isTime && /(^|_)(publish_at|published_at|scheduled_at|go_live_at)($|_)/.test(name)) {
      exprs.push(`(${col} IS NULL OR ${col} <= ${NOW_SQL})`);
      reasons.push(c.column_name);
    }
  }

  if (exprs.length === 0) return null;
  const publicWhere = exprs.join(" AND ");
  return {
    publicWhere,
    hiddenWhere: `NOT (${publicWhere})`,
    reasons: [...new Set(reasons)],
  };
}

async function countWhere(client, schema, table, where = "TRUE") {
  const sql = `SELECT count(*)::bigint AS n FROM ${qTable(schema, table)} WHERE ${where}`;
  const result = await client.query(sql);
  return Number(result.rows[0]?.n ?? 0);
}

async function distinctVisibilityValues(client, schema, table, columns) {
  const out = {};
  const publicationStatusNames = new Set([
    "status",
    "state",
    "visibility",
    "post_status",
    "workflow_status",
    "publication_status",
    "publish_status",
    "content_status",
  ]);
  const probes = columns.filter((c) => publicationStatusNames.has(semanticName(c.column_name)));
  for (const c of probes.slice(0, 8)) {
    try {
      const sql = `SELECT ${quoteIdent(c.column_name)}::text AS v, count(*)::bigint AS n FROM ${qTable(schema, table)} GROUP BY 1 ORDER BY 2 DESC NULLS LAST LIMIT 12`;
      const rows = (await client.query(sql)).rows;
      out[c.column_name] = rows.map((r) => `${r.v ?? "NULL"}:${r.n}`).join("; ");
    } catch {
      out[c.column_name] = "probe_failed";
    }
  }
  return out;
}

function redactedDbSummary(raw) {
  try {
    const url = new URL(raw);
    return {
      protocol: url.protocol.replace(":", ""),
      hostHash: crypto.createHash("sha256").update(url.hostname).digest("hex").slice(0, 10),
      database: url.pathname.replace(/^\//, "") || "(none)",
    };
  } catch {
    return { protocol: "unknown", hostHash: "unparseable", database: "unknown" };
  }
}

async function main() {
  let databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set after dotenv load.");
  }
  const allowSelfSignedSsl = process.env.NN_DB_AUDIT_ALLOW_SELF_SIGNED_SSL === "1";
  if (allowSelfSignedSsl) {
    try {
      const u = new URL(databaseUrl);
      u.searchParams.delete("sslmode");
      u.searchParams.delete("sslcert");
      u.searchParams.delete("sslrootcert");
      databaseUrl = u.toString();
    } catch {
      /* keep original; URL validation below will fail with a clear error if needed */
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 4,
    statement_timeout: 60_000,
    ...(allowSelfSignedSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  const client = await pool.connect();
  try {
    const tableRows = (
      await client.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name
      `)
    ).rows;

    const colRows = (
      await client.query(`
        SELECT table_schema, table_name, column_name, data_type, udt_name
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name, ordinal_position
      `)
    ).rows;

    const byTable = new Map();
    for (const c of colRows) {
      const key = `${c.table_schema}.${c.table_name}`;
      if (!byTable.has(key)) byTable.set(key, []);
      byTable.get(key).push(c);
    }

    const rows = [];
    for (const t of tableRows) {
      const columns = byTable.get(`${t.table_schema}.${t.table_name}`) ?? [];
      const articleFields = names(columns, ARTICLE_FIELD_PATTERNS);
      const titleFields = names(columns, TITLE_FIELD_PATTERNS);
      const slugFields = names(columns, SLUG_FIELD_PATTERNS);
      const bodyFields = names(columns, BODY_FIELD_PATTERNS);
      const seoFields = names(columns, SEO_FIELD_PATTERNS);
      const articleLike =
        articleFields.length >= 2 &&
        (titleFields.length > 0 || slugFields.length > 0) &&
        (bodyFields.length > 0 || seoFields.length > 0);
      const contentType = inferContentType(t.table_name, columns, articleLike);
      const visibility = visibilityExpressions(columns);

      let rowCount = null;
      let publicCount = null;
      let hiddenCount = null;
      let countError = "";
      let visibilityValues = {};
      try {
        rowCount = await countWhere(client, t.table_schema, t.table_name);
        if (visibility) {
          publicCount = await countWhere(client, t.table_schema, t.table_name, visibility.publicWhere);
          hiddenCount = await countWhere(client, t.table_schema, t.table_name, visibility.hiddenWhere);
          visibilityValues = await distinctVisibilityValues(client, t.table_schema, t.table_name, columns);
        }
      } catch (e) {
        countError = e instanceof Error ? e.message : String(e);
      }

      rows.push({
        schema: t.table_schema,
        tableName: t.table_name,
        rowCount,
        contentType,
        publicCount,
        hiddenCount,
        classification: visibility ? "visibility_classified" : "visibility_unknown",
        articleLike,
        titleFields,
        slugFields,
        bodyFields,
        seoFields,
        articleFields,
        visibilityFields: visibility?.reasons ?? [],
        visibilityValues,
        countError,
      });
    }

    rows.sort((a, b) => {
      if (a.articleLike !== b.articleLike) return a.articleLike ? -1 : 1;
      return String(a.tableName).localeCompare(String(b.tableName));
    });

    const generatedAt = new Date().toISOString();
    const db = redactedDbSummary(databaseUrl);
    writeFileSync(
      path.join(OUT_DIR, "table-content-audit.json"),
      JSON.stringify({ generatedAt, database: db, tables: rows }, null, 2),
    );

    const headers = [
      "Table Name",
      "Row Count",
      "Content Type",
      "Public Count",
      "Hidden Count",
      "Classification",
      "Article-like",
      "Title Fields",
      "Slug Fields",
      "Body/Content Fields",
      "SEO Fields",
      "Visibility Fields",
      "Visibility Values",
      "Count Error",
    ];
    const csvRows = [
      headers.map(csvCell).join(","),
      ...rows.map((r) =>
        [
          `${r.schema}.${r.tableName}`,
          r.rowCount ?? "",
          r.contentType,
          r.publicCount ?? "",
          r.hiddenCount ?? "",
          r.classification,
          r.articleLike ? "YES" : "NO",
          r.titleFields.join("; "),
          r.slugFields.join("; "),
          r.bodyFields.join("; "),
          r.seoFields.join("; "),
          r.visibilityFields.join("; "),
          Object.entries(r.visibilityValues).map(([k, v]) => `${k}=[${v}]`).join(" | "),
          r.countError,
        ].map(csvCell).join(","),
      ),
    ];
    writeFileSync(path.join(OUT_DIR, "table-content-audit.csv"), `${csvRows.join("\n")}\n`);

    const articleRows = rows.filter((r) => r.articleLike);
    const hiddenArticleRows = articleRows.filter((r) => Number(r.hiddenCount ?? 0) > 0 || r.classification === "visibility_unknown");
    const lines = [
      "# Hidden Article Repository Audit",
      "",
      `Generated: ${generatedAt}`,
      "",
      "## Database",
      "",
      `- Protocol: ${db.protocol}`,
      `- Host hash: ${db.hostHash}`,
      `- Database: ${db.database}`,
      "",
      "## Summary",
      "",
      `- Base tables inspected: ${rows.length}`,
      `- Article-like tables flagged by fields: ${articleRows.length}`,
      `- Article-like tables with hidden rows or unknown visibility: ${hiddenArticleRows.length}`,
      "",
      "## Flagged Article-Like Tables",
      "",
      "| Table Name | Row Count | Content Type | Public Count | Hidden Count | Fields Triggering Flag | Visibility Fields |",
      "| --- | ---: | --- | ---: | ---: | --- | --- |",
      ...articleRows.map((r) =>
        `| \`${r.schema}.${r.tableName}\` | ${r.rowCount ?? "error"} | ${r.contentType} | ${r.publicCount ?? "unknown"} | ${r.hiddenCount ?? "unknown"} | ${[...new Set([...r.titleFields, ...r.slugFields, ...r.bodyFields, ...r.seoFields])].join(", ") || "-"} | ${r.visibilityFields.join(", ") || "unknown"} |`,
      ),
      "",
      "## All Tables",
      "",
      "| Table Name | Row Count | Content Type | Public Count | Hidden Count | Article-like |",
      "| --- | ---: | --- | ---: | ---: | --- |",
      ...rows.map((r) =>
        `| \`${r.schema}.${r.tableName}\` | ${r.rowCount ?? "error"} | ${r.contentType} | ${r.publicCount ?? "unknown"} | ${r.hiddenCount ?? "unknown"} | ${r.articleLike ? "YES" : "NO"} |`,
      ),
      "",
      "## Notes",
      "",
      "- The audit does not dump article body text or secrets.",
      "- Article-like classification is based on actual columns containing title/slug/body/content/markdown/SEO-like fields, not table names alone.",
      "- Public/hidden counts are only computed when visibility/status/publish/hidden/delete fields exist. Otherwise the table is marked `visibility_unknown` and counts are `unknown`.",
    ];
    writeFileSync(path.join(OUT_DIR, "hidden-article-repositories.md"), `${lines.join("\n")}\n`);
    console.log(JSON.stringify({
      generatedAt,
      outDir: path.relative(process.cwd(), OUT_DIR),
      tableCount: rows.length,
      articleLikeTables: articleRows.length,
      hiddenOrUnknownArticleLikeTables: hiddenArticleRows.length,
    }, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
