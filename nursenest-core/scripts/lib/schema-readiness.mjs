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
    super(`SCHEMA_NOT_READY: ${message}\n${formatMissingColumns(missingColumns)}`);
    this.name = "SchemaReadinessError";
    this.code = "SCHEMA_NOT_READY";
    this.missingColumns = missingColumns;
  }
}

export function formatMissingColumns(missingColumns) {
  if (!missingColumns?.length) return "(none)";
  return missingColumns.map(({ table, column }) => `- ${table}.${column}`).join("\n");
}

export async function checkRequiredColumnsWithQuery(query, requiredColumns = PRODUCTION_REQUIRED_COLUMNS) {
  const missingColumns = [];

  for (const { table, column } of requiredColumns) {
    const result = await query(
      `SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2 LIMIT 1`,
      [table, column],
    );
    const rowCount = Array.isArray(result?.rows) ? result.rows.length : Number(result?.rowCount ?? 0);
    if (rowCount < 1) missingColumns.push({ table, column });
  }

  return { ready: missingColumns.length === 0, missingColumns };
}

export async function checkRequiredColumns(client, requiredColumns = PRODUCTION_REQUIRED_COLUMNS) {
  return checkRequiredColumnsWithQuery((text, params) => client.query(text, params), requiredColumns);
}

export async function assertRequiredColumns(client, requiredColumns = PRODUCTION_REQUIRED_COLUMNS) {
  const result = await checkRequiredColumns(client, requiredColumns);
  if (!result.ready) {
    throw new SchemaReadinessError(result.missingColumns);
  }
  return result;
}

export async function withPgClient(databaseUrl, fn) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function assertRequiredColumnsFromDatabaseUrl(databaseUrl, requiredColumns = PRODUCTION_REQUIRED_COLUMNS) {
  return withPgClient(databaseUrl, (client) => assertRequiredColumns(client, requiredColumns));
}

export function isSchemaReadinessError(error) {
  return error instanceof SchemaReadinessError || Boolean(error && typeof error === "object" && error.code === "SCHEMA_NOT_READY");
}
