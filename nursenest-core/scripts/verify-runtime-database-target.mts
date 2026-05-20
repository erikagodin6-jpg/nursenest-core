#!/usr/bin/env npx tsx
/**
 * Deployment / CI: emit a single JSON line describing DATABASE_URL / DIRECT_URL
 * contract status and critical `pathway_lessons` columns expected by the checked-in Prisma schema.
 * Never prints credentials or the full connection string.
 */
import "../src/lib/db/script-env-bootstrap";
import {
  PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN,
  PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR,
  pathwayLessonsStructuralPublicCompleteColumnPresent,
} from "../src/lib/db/pathway-lessons-schema-contract";
import {
  isRejectedRuntimePlaceholderDatabaseUrl,
  maskDatabaseUrlHostForLog,
} from "../src/lib/env/require-database-env";

async function main(): Promise<void> {
  const databaseUrlPresent = Boolean(process.env.DATABASE_URL?.trim());
  const directUrlPresent = Boolean(process.env.DIRECT_URL?.trim());
  const raw = process.env.DATABASE_URL?.trim() ?? "";

  let databaseHostMasked = "(none)";
  if (raw) {
    const { host, port } = maskDatabaseUrlHostForLog(raw);
    databaseHostMasked = `${host}:${port}`;
  }

  const rejectsPlaceholder = raw.length > 0 && isRejectedRuntimePlaceholderDatabaseUrl(raw);
  const contractOk = databaseUrlPresent && !rejectsPlaceholder;

  let schemaProbe:
    | {
        attempted: boolean;
        ok: boolean | null;
        prismaSchemaExpectsColumn: typeof PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN;
        liveColumnPresent: boolean | null;
        error: string | null;
        migrationDirectory: typeof PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR;
        recommendedAction: string | null;
      }
    | undefined;

  if (!contractOk) {
    schemaProbe = {
      attempted: false,
      ok: null,
      prismaSchemaExpectsColumn: PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN,
      liveColumnPresent: null,
      error: rejectsPlaceholder ? "database_url_rejected_placeholder" : "database_url_missing",
      migrationDirectory: PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR,
      recommendedAction: null,
    };
  } else {
    let liveColumnPresent: boolean | null = null;
    let probeError: string | null = null;
    const { prisma } = await import("../src/lib/db.ts");
    try {
      liveColumnPresent = await pathwayLessonsStructuralPublicCompleteColumnPresent(prisma);
    } catch (e) {
      probeError = e instanceof Error ? e.message.slice(0, 500) : String(e).slice(0, 500);
    } finally {
      try {
        await prisma.$disconnect();
      } catch {
        /* ignore */
      }
    }
    const schemaOk = liveColumnPresent === true;
    schemaProbe = {
      attempted: true,
      ok: schemaOk,
      prismaSchemaExpectsColumn: PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN,
      liveColumnPresent,
      error: probeError,
      migrationDirectory: PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR,
      recommendedAction: schemaOk
        ? null
        : `Compare prisma/schema.prisma (PathwayLesson.structuralPublicComplete) to live DB; if the column is missing, run prisma migrate deploy so migration ${PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR} applies.`,
    };
  }

  const ok = Boolean(contractOk && schemaProbe?.ok === true);

  console.log(
    JSON.stringify({
      databaseUrlPresent,
      directUrlPresent,
      databaseHostMasked,
      rejectsPlaceholder,
      contractOk,
      schemaProbe,
      ok,
    }),
  );

  if (!ok) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
