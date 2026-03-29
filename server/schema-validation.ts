import { pool } from "./storage";

interface TableColumnCheck {
  table: string;
  columns: string[];
}

const CRITICAL_SCHEMA: TableColumnCheck[] = [
  {
    table: "mock_exam_attempts",
    columns: ["exam_type", "blueprint_code", "blueprint_meta", "cat_state", "blueprint_coverage_state", "review_unlocked", "timer_state", "stopping_rule_status"],
  },
  {
    table: "users",
    columns: ["preferred_theme"],
  },
  {
    table: "watermark_sessions",
    columns: ["masked_email", "user_id_suffix", "ip_address", "user_agent", "expires_at"],
  },
];

interface NullabilityCheck {
  table: string;
  column: string;
  expectedNullable: boolean;
}

const NULLABILITY_CHECKS: NullabilityCheck[] = [
  { table: "users", column: "email", expectedNullable: true },
];

export async function validateSchemaAtStartup(): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position`
    );
    const columnsByTable = new Map<string, Set<string>>();
    for (const row of result.rows) {
      if (!columnsByTable.has(row.table_name)) {
        columnsByTable.set(row.table_name, new Set());
      }
      columnsByTable.get(row.table_name)!.add(row.column_name);
    }

    let driftDetected = false;
    for (const check of CRITICAL_SCHEMA) {
      const tableColumns = columnsByTable.get(check.table);
      if (!tableColumns) {
        console.warn(`[SCHEMA VALIDATION] WARNING: Table "${check.table}" does not exist`);
        driftDetected = true;
        continue;
      }
      const missing = check.columns.filter(col => !tableColumns.has(col));
      if (missing.length > 0) {
        console.warn(`[SCHEMA VALIDATION] WARNING: Table "${check.table}" is missing columns: ${missing.join(", ")}`);
        driftDetected = true;
      }
    }

    const nullResult = await pool.query(
      `SELECT table_name, column_name, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND (${NULLABILITY_CHECKS.map((_, i) => `(table_name = $${i * 2 + 1} AND column_name = $${i * 2 + 2})`).join(' OR ')})`,
      NULLABILITY_CHECKS.flatMap(c => [c.table, c.column])
    );
    for (const check of NULLABILITY_CHECKS) {
      const row = nullResult.rows.find(r => r.table_name === check.table && r.column_name === check.column);
      if (!row) continue;
      const isNullable = row.is_nullable === 'YES';
      if (isNullable !== check.expectedNullable) {
        const expected = check.expectedNullable ? 'nullable' : 'NOT NULL';
        const actual = isNullable ? 'nullable' : 'NOT NULL';
        console.warn(`[SCHEMA VALIDATION] WARNING: ${check.table}.${check.column} should be ${expected} but is ${actual}`);
        driftDetected = true;
      }
    }

    if (driftDetected) {
      console.warn("[SCHEMA VALIDATION] Schema drift detected! Run 'npm run db:push' to sync the database schema.");
    } else {
      console.log("[SCHEMA VALIDATION] All critical tables and columns verified.");
    }
  } catch (e: any) {
    console.error("[SCHEMA VALIDATION] Failed to validate schema:", e.message);
  }
}
