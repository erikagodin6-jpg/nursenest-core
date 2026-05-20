import pg from "pg";
const { Client } = pg;

export const PRODUCTION_REQUIRED_COLUMNS = Object.freeze([
  { table: "pathway_lessons", column: "allied_profession_key" },
  { table: "pathway_lessons", column: "structural_public_complete" },
  { table: "pathway_lessons", column: "exam_meta" },
  { table: "pathway_lessons", column: "content_version" },
  { table: "pathway_lessons", column: "published_at" },
  { table: "pathway_lessons", column: "published_by_user_id" },
  { table: "exam_questions", column: "study_link_pathway_id" },
  { table: "exam_questions", column: "study_link_lesson_slug" },
  { table: "clinical_nursing_scenarios", column: "study_link_lesson_slug" },
  { table: "blog_article_generation_jobs", column: "next_attempt_at" },
]);

export const ALLIED_AUDIT_REQUIRED_COLUMNS = Object.freeze([
  { table: "pathway_lessons", column: "allied_profession_key" },
]);

export class SchemaReadinessError extends Error {
  constructor(missingColumns, message = "Required database schema columns are missing.") {
    super("SCHEMA_NOT_READY: " + message + "\n" + formatMissingColumns(missingColumns));
    this.name = "SchemaReadinessError";
    this.code = "SCHEMA_NOT_READY";
    this.missingColumns = missingColumns;
  }
}

export function formatMissingColumns(missingColumns) {
  if (!missingColumns?.length) return "(none)";
  return missingColumns.map(function(c) { return "- " + c.table + "." + c.column; }).join("\n");
}

export async function checkRequiredColumnsWithQuery(query, requiredColumns) {
  if (!requiredColumns) requiredColumns = PRODUCTION_REQUIRED_COLUMNS;
  var missingColumns = [];
  for (var i = 0; i < requiredColumns.length; i++) {
    var col = requiredColumns[i];
    var result = await query(
      "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2 LIMIT 1",
      [col.table, col.column],
    );
    var rowCount = Array.isArray(result?.rows) ? result.rows.length : Number(result?.rowCount ?? 0);
    if (rowCount < 1) missingColumns.push(col);
  }
  return { ready: missingColumns.length === 0, missingColumns: missingColumns };
}

export async function checkRequiredColumns(client, requiredColumns) {
  if (!requiredColumns) requiredColumns = PRODUCTION_REQUIRED_COLUMNS;
  return checkRequiredColumnsWithQuery(function(text, params) { return client.query(text, params); }, requiredColumns);
}

export async function assertRequiredColumns(client, requiredColumns) {
  if (!requiredColumns) requiredColumns = PRODUCTION_REQUIRED_COLUMNS;
  var result = await checkRequiredColumns(client, requiredColumns);
  if (!result.ready) throw new SchemaReadinessError(result.missingColumns);
  return result;
}

export async function withPgClient(databaseUrl, fn) {
  var client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try { return await fn(client); }
  finally { await client.end().catch(function() {}); }
}

export async function assertRequiredColumnsFromDatabaseUrl(databaseUrl, requiredColumns) {
  if (!requiredColumns) requiredColumns = PRODUCTION_REQUIRED_COLUMNS;
  return withPgClient(databaseUrl, function(client) { return assertRequiredColumns(client, requiredColumns); });
}

export function isSchemaReadinessError(error) {
  return error instanceof SchemaReadinessError || Boolean(error && typeof error === "object" && error.code === "SCHEMA_NOT_READY");
}