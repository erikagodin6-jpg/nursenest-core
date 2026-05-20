import { prisma } from "./prisma-script-client";

/**
 * Required columns for the study-content-pathway-lesson-links migration.
 * These columns must exist before running link-study-content.ts.
 */
export const STUDY_LINK_REQUIRED_COLUMNS = [
  { table: "exam_questions", column: "study_link_pathway_id" },
  { table: "exam_questions", column: "study_link_lesson_slug" },
  { table: "clinical_nursing_scenarios", column: "study_link_lesson_slug" },
] as const;

export const PRODUCTION_REQUIRED_COLUMNS = [
  { table: "pathway_lessons", column: "allied_profession_key" },
  { table: "pathway_lessons", column: "structural_public_complete" },
  { table: "pathway_lessons", column: "exam_meta" },
  { table: "pathway_lessons", column: "content_version" },
  { table: "pathway_lessons", column: "published_at" },
  { table: "pathway_lessons", column: "published_by_user_id" },
  ...STUDY_LINK_REQUIRED_COLUMNS,
  { table: "blog_article_generation_jobs", column: "next_attempt_at" },
] as const;

export const ALLIED_AUDIT_REQUIRED_COLUMNS = [
  { table: "pathway_lessons", column: "allied_profession_key" },
] as const;

export type RequiredColumn = (typeof STUDY_LINK_REQUIRED_COLUMNS)[number];

export class SchemaReadinessError extends Error {
  readonly code = "SCHEMA_NOT_READY";
  readonly missingColumns: Array<{ table: string; column: string }>;

  constructor(missingColumns: Array<{ table: string; column: string }>) {
    super(
      `SCHEMA_NOT_READY: Missing required columns:\n${missingColumns
        .map((c) => `  - ${c.table}.${c.column}`)
        .join("\n")}`,
    );
    this.name = "SchemaReadinessError";
    this.missingColumns = missingColumns;
  }
}

/**
 * Check if a specific column exists in the database schema.
 * Uses information_schema to verify column existence without requiring
 * the Prisma client to have the field in its type definitions.
 */
export async function checkColumnExists(table: string, column: string): Promise<boolean> {
  try {
    const result = await prisma.$queryRaw<[{ column_name: string }]>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = ${table} AND column_name = ${column}
      LIMIT 1;
    `;
    return result.length > 0;
  } catch {
    // If query fails, assume column doesn't exist
    return false;
  }
}

/**
 * Check all required columns for the study-link migration.
 * Returns a list of missing columns.
 */
export async function checkStudyLinkSchemaReadiness(): Promise<{
  ready: boolean;
  missingColumns: Array<{ table: string; column: string }>;
}> {
  return checkSchemaReadiness(STUDY_LINK_REQUIRED_COLUMNS);
}

export async function checkSchemaReadiness(
  requiredColumns: readonly { table: string; column: string }[],
): Promise<{
  ready: boolean;
  missingColumns: Array<{ table: string; column: string }>;
}> {
  const missingColumns: Array<{ table: string; column: string }> = [];

  for (const { table, column } of requiredColumns) {
    const exists = await checkColumnExists(table, column);
    if (!exists) {
      missingColumns.push({ table, column });
    }
  }

  return {
    ready: missingColumns.length === 0,
    missingColumns,
  };
}

/**
 * Assert that the database schema is ready for the study-link migration.
 * Throws with a clear error message if columns are missing.
 */
export async function assertStudyLinkSchemaReady(): Promise<void> {
  const { ready, missingColumns } = await checkStudyLinkSchemaReadiness();

  if (!ready) {
    const missingDetails = missingColumns
      .map((c) => `  - ${c.table}.${c.column}`)
      .join("\n");

    throw new Error(
      `Schema readiness check failed. Missing columns for study-link migration:\n${missingDetails}\n\n` +
        `Run 'npx prisma migrate deploy' before running link-study-content.`,
    );
  }
}

export async function assertSchemaReady(
  requiredColumns: readonly { table: string; column: string }[] = PRODUCTION_REQUIRED_COLUMNS,
): Promise<void> {
  const { ready, missingColumns } = await checkSchemaReadiness(requiredColumns);
  if (!ready) {
    throw new SchemaReadinessError(missingColumns);
  }
}