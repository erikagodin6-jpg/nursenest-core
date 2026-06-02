import { pool } from "./storage";

export interface MigrationScript {
  version: string;
  name: string;
  description: string;
  up: string;
  down: string;
  validationQuery?: string;
  breakingChange?: boolean;
  affectedTables?: string[];
}

export interface MigrationAuditEntry {
  id: string;
  version: string;
  name: string;
  direction: "up" | "down";
  status: "pending" | "running" | "success" | "failed" | "rolled_back";
  dryRun: boolean;
  executedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  errorMessage: string | null;
  affectedRows: number | null;
  executedBy: string | null;
  rollbackOf: string | null;
}

export interface DryRunResult {
  version: string;
  name: string;
  direction: "up" | "down";
  sql: string;
  estimatedAffectedTables: string[];
  validationPassed: boolean;
  validationMessage: string | null;
  breakingChange: boolean;
  currentSchemaConflicts: string[];
}

async function ensureMigrationTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      name text NOT NULL,
      description text,
      applied_at timestamp NOT NULL DEFAULT NOW(),
      checksum text,
      execution_time_ms integer
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migration_audit_log (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      version text NOT NULL,
      name text NOT NULL,
      direction text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      dry_run boolean DEFAULT false,
      executed_at timestamp NOT NULL DEFAULT NOW(),
      completed_at timestamp,
      duration_ms integer,
      error_message text,
      affected_rows integer,
      executed_by text,
      rollback_of varchar,
      sql_executed text,
      metadata jsonb DEFAULT '{}'::jsonb
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_migration_audit_version ON migration_audit_log(version)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_migration_audit_status ON migration_audit_log(status)`);
}

function simpleChecksum(sql: string): string {
  let hash = 0;
  for (let i = 0; i < sql.length; i++) {
    const char = sql.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function getRegisteredMigrations(): MigrationScript[] {
  return registeredMigrations;
}

const registeredMigrations: MigrationScript[] = [
  {
    version: "001",
    name: "add_schema_version_tracking",
    description: "Adds schema_version column to key content tables for backward compatibility",
    up: `
      ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS schema_version integer DEFAULT 1;
      ALTER TABLE content_items ADD COLUMN IF NOT EXISTS schema_version integer DEFAULT 1;
      ALTER TABLE lessons ADD COLUMN IF NOT EXISTS schema_version integer DEFAULT 1;
    `,
    down: `
      ALTER TABLE exam_questions DROP COLUMN IF EXISTS schema_version;
      ALTER TABLE content_items DROP COLUMN IF EXISTS schema_version;
      ALTER TABLE lessons DROP COLUMN IF EXISTS schema_version;
    `,
    validationQuery: `SELECT COUNT(*) as cnt FROM information_schema.columns WHERE column_name = 'schema_version' AND table_name IN ('exam_questions', 'content_items', 'lessons')`,
    affectedTables: ["exam_questions", "content_items", "lessons"],
  },
  {
    version: "002",
    name: "add_cleanup_tracking_table",
    description: "Creates cleanup_reports table for auto-cleanup audit trail",
    up: `
      CREATE TABLE IF NOT EXISTS cleanup_reports (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        run_type text NOT NULL,
        status text NOT NULL DEFAULT 'running',
        started_at timestamp NOT NULL DEFAULT NOW(),
        completed_at timestamp,
        duration_ms integer,
        items_scanned integer DEFAULT 0,
        items_cleaned integer DEFAULT 0,
        items_flagged integer DEFAULT 0,
        details jsonb DEFAULT '[]'::jsonb,
        triggered_by text DEFAULT 'system',
        error_message text
      )
    `,
    down: `DROP TABLE IF EXISTS cleanup_reports`,
    affectedTables: ["cleanup_reports"],
  },
  {
    version: "003",
    name: "add_content_schema_metadata",
    description: "Adds schema metadata columns for backward compatibility layer",
    up: `
      ALTER TABLE content_items ADD COLUMN IF NOT EXISTS content_format text DEFAULT 'v1';
      ALTER TABLE content_items ADD COLUMN IF NOT EXISTS migration_source text;
    `,
    down: `
      ALTER TABLE content_items DROP COLUMN IF EXISTS content_format;
      ALTER TABLE content_items DROP COLUMN IF EXISTS migration_source;
    `,
    affectedTables: ["content_items"],
  },
];

export function registerMigration(migration: MigrationScript): void {
  const existing = registeredMigrations.find(m => m.version === migration.version);
  if (existing) {
    throw new Error(`Migration version ${migration.version} is already registered`);
  }
  registeredMigrations.push(migration);
  registeredMigrations.sort((a, b) => a.version.localeCompare(b.version));
}

export async function getAppliedMigrations(): Promise<{ version: string; name: string; appliedAt: string }[]> {
  await ensureMigrationTables();
  const result = await pool.query(`SELECT version, name, applied_at FROM schema_migrations ORDER BY version`);
  return result.rows.map((r: any) => ({
    version: r.version,
    name: r.name,
    appliedAt: r.applied_at,
  }));
}

export async function getMigrationAuditLog(limit: number = 50): Promise<MigrationAuditEntry[]> {
  await ensureMigrationTables();
  const result = await pool.query(
    `SELECT id, version, name, direction, status, dry_run, executed_at, completed_at,
            duration_ms, error_message, affected_rows, executed_by, rollback_of
     FROM migration_audit_log ORDER BY executed_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows.map((r: any) => ({
    id: r.id,
    version: r.version,
    name: r.name,
    direction: r.direction,
    status: r.status,
    dryRun: r.dry_run,
    executedAt: r.executed_at,
    completedAt: r.completed_at,
    durationMs: r.duration_ms,
    errorMessage: r.error_message,
    affectedRows: r.affected_rows,
    executedBy: r.executed_by,
    rollbackOf: r.rollback_of,
  }));
}

export async function getPendingMigrations(): Promise<MigrationScript[]> {
  const applied = await getAppliedMigrations();
  const appliedVersions = new Set(applied.map(a => a.version));
  return registeredMigrations.filter(m => !appliedVersions.has(m.version));
}

export async function dryRunMigration(version: string, direction: "up" | "down" = "up"): Promise<DryRunResult> {
  await ensureMigrationTables();

  const migration = registeredMigrations.find(m => m.version === version);
  if (!migration) {
    throw new Error(`Migration version ${version} not found`);
  }

  const sql = direction === "up" ? migration.up : migration.down;
  const conflicts: string[] = [];

  if (direction === "up") {
    const applied = await getAppliedMigrations();
    if (applied.find(a => a.version === version)) {
      conflicts.push(`Migration ${version} has already been applied`);
    }
  }

  let validationPassed = true;
  let validationMessage: string | null = null;

  if (migration.validationQuery && direction === "up") {
    try {
      const valResult = await pool.query(migration.validationQuery);
      const firstRow = valResult.rows[0];
      if (firstRow) {
        const values = Object.values(firstRow);
        const numericVal = values.length > 0 ? Number(values[0]) : null;
        if (numericVal !== null && numericVal === 0) {
          validationPassed = false;
          validationMessage = "Validation query returned 0 — expected conditions not yet met";
        } else {
          validationMessage = `Validation query passed (result: ${JSON.stringify(firstRow)})`;
        }
      } else {
        validationPassed = false;
        validationMessage = "Validation query returned no rows";
      }
    } catch (err: any) {
      validationPassed = false;
      validationMessage = `Validation check warning: ${err.message}`;
    }
  }

  const dryRunStatus = conflicts.length > 0 ? "conflict" : (validationPassed ? "success" : "warning");

  await pool.query(
    `INSERT INTO migration_audit_log (version, name, direction, status, dry_run, executed_by, metadata)
     VALUES ($1, $2, $3, $4, true, 'system', $5)`,
    [version, migration.name, direction, dryRunStatus, JSON.stringify({ conflicts, validationMessage })]
  );

  return {
    version,
    name: migration.name,
    direction,
    sql: sql.trim(),
    estimatedAffectedTables: migration.affectedTables || [],
    validationPassed,
    validationMessage,
    breakingChange: migration.breakingChange || false,
    currentSchemaConflicts: conflicts,
  };
}

export async function executeMigration(
  version: string,
  executedBy: string = "system"
): Promise<{ success: boolean; error?: string; durationMs: number }> {
  await ensureMigrationTables();

  const migration = registeredMigrations.find(m => m.version === version);
  if (!migration) {
    return { success: false, error: `Migration version ${version} not found`, durationMs: 0 };
  }

  const applied = await getAppliedMigrations();
  if (applied.find(a => a.version === version)) {
    return { success: false, error: `Migration ${version} has already been applied`, durationMs: 0 };
  }

  const auditResult = await pool.query(
    `INSERT INTO migration_audit_log (version, name, direction, status, dry_run, executed_by, sql_executed)
     VALUES ($1, $2, 'up', 'running', false, $3, $4) RETURNING id`,
    [version, migration.name, executedBy, migration.up]
  );
  const auditId = auditResult.rows[0].id;

  const startTime = Date.now();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(migration.up);

    if (migration.validationQuery) {
      const valResult = await client.query(migration.validationQuery);
      if (valResult.rows.length === 0) {
        throw new Error("Post-migration validation failed: query returned no rows");
      }
      const firstRow = valResult.rows[0];
      const values = Object.values(firstRow);
      const numericVal = values.length > 0 ? Number(values[0]) : null;
      if (numericVal !== null && numericVal === 0) {
        throw new Error("Post-migration validation failed: expected non-zero result but got 0");
      }
    }

    const checksum = simpleChecksum(migration.up);
    await client.query(
      `INSERT INTO schema_migrations (version, name, description, checksum, execution_time_ms)
       VALUES ($1, $2, $3, $4, $5)`,
      [version, migration.name, migration.description, checksum, Date.now() - startTime]
    );

    await client.query("COMMIT");

    const durationMs = Date.now() - startTime;
    await pool.query(
      `UPDATE migration_audit_log SET status = 'success', completed_at = NOW(), duration_ms = $1 WHERE id = $2`,
      [durationMs, auditId]
    );

    return { success: true, durationMs };
  } catch (err: any) {
    await client.query("ROLLBACK");
    const durationMs = Date.now() - startTime;

    await pool.query(
      `UPDATE migration_audit_log SET status = 'failed', completed_at = NOW(), duration_ms = $1, error_message = $2 WHERE id = $3`,
      [durationMs, err.message, auditId]
    );

    return { success: false, error: err.message, durationMs };
  } finally {
    client.release();
  }
}

export async function rollbackMigration(
  version: string,
  executedBy: string = "system"
): Promise<{ success: boolean; error?: string; durationMs: number }> {
  await ensureMigrationTables();

  const migration = registeredMigrations.find(m => m.version === version);
  if (!migration) {
    return { success: false, error: `Migration version ${version} not found`, durationMs: 0 };
  }

  const applied = await getAppliedMigrations();
  if (!applied.find(a => a.version === version)) {
    return { success: false, error: `Migration ${version} has not been applied`, durationMs: 0 };
  }

  const originalAudit = await pool.query(
    `SELECT id FROM migration_audit_log WHERE version = $1 AND direction = 'up' AND status = 'success' AND dry_run = false ORDER BY executed_at DESC LIMIT 1`,
    [version]
  );
  const rollbackOf = originalAudit.rows[0]?.id || null;

  const auditResult = await pool.query(
    `INSERT INTO migration_audit_log (version, name, direction, status, dry_run, executed_by, sql_executed, rollback_of)
     VALUES ($1, $2, 'down', 'running', false, $3, $4, $5) RETURNING id`,
    [version, migration.name, executedBy, migration.down, rollbackOf]
  );
  const auditId = auditResult.rows[0].id;

  const startTime = Date.now();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(migration.down);
    await client.query(`DELETE FROM schema_migrations WHERE version = $1`, [version]);
    await client.query("COMMIT");

    const durationMs = Date.now() - startTime;
    await pool.query(
      `UPDATE migration_audit_log SET status = 'rolled_back', completed_at = NOW(), duration_ms = $1 WHERE id = $2`,
      [durationMs, auditId]
    );

    return { success: true, durationMs };
  } catch (err: any) {
    await client.query("ROLLBACK");
    const durationMs = Date.now() - startTime;

    await pool.query(
      `UPDATE migration_audit_log SET status = 'failed', completed_at = NOW(), duration_ms = $1, error_message = $2 WHERE id = $3`,
      [durationMs, err.message, auditId]
    );

    return { success: false, error: err.message, durationMs };
  } finally {
    client.release();
  }
}

export async function getMigrationStatus(): Promise<{
  totalRegistered: number;
  totalApplied: number;
  pending: number;
  lastApplied: string | null;
  migrations: { version: string; name: string; description: string; applied: boolean; appliedAt: string | null }[];
}> {
  const applied = await getAppliedMigrations();
  const appliedMap = new Map(applied.map(a => [a.version, a.appliedAt]));

  const migrations = registeredMigrations.map(m => ({
    version: m.version,
    name: m.name,
    description: m.description,
    applied: appliedMap.has(m.version),
    appliedAt: appliedMap.get(m.version) || null,
  }));

  return {
    totalRegistered: registeredMigrations.length,
    totalApplied: applied.length,
    pending: registeredMigrations.length - applied.length,
    lastApplied: applied.length > 0 ? applied[applied.length - 1].version : null,
    migrations,
  };
}
