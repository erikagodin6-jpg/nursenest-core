import { pool } from "./storage";

export interface ContentVersionInfo {
  schemaVersion: number;
  contentFormat: string;
  needsMigration: boolean;
  compatibilityNotes: string[];
}

const CURRENT_SCHEMA_VERSIONS: Record<string, number> = {
  exam_questions: 1,
  content_items: 1,
  lessons: 1,
  flashcard_decks: 1,
  deck_flashcards: 1,
};

const CONTENT_TRANSFORMERS: Record<string, Record<number, (content: any) => any>> = {
  content_items: {
    1: (content: any) => content,
  },
  lessons: {
    1: (content: any) => content,
  },
  exam_questions: {
    1: (content: any) => content,
  },
};

export function getCurrentSchemaVersion(tableName: string): number {
  return CURRENT_SCHEMA_VERSIONS[tableName] || 1;
}

export function transformContent(tableName: string, content: any, fromVersion: number): any {
  const transformers = CONTENT_TRANSFORMERS[tableName];
  if (!transformers) return content;

  const currentVersion = getCurrentSchemaVersion(tableName);
  let result = content;

  for (let v = fromVersion; v <= currentVersion; v++) {
    if (transformers[v]) {
      result = transformers[v](result);
    }
  }

  return result;
}

export function getContentVersionInfo(tableName: string, record: any): ContentVersionInfo {
  const currentVersion = getCurrentSchemaVersion(tableName);
  const recordVersion = record?.schema_version || record?.schemaVersion || 1;
  const contentFormat = record?.content_format || record?.contentFormat || "v1";

  const notes: string[] = [];
  const needsMigration = recordVersion < currentVersion;

  if (needsMigration) {
    notes.push(`Content is at schema version ${recordVersion}, current is ${currentVersion}`);
  }

  return {
    schemaVersion: recordVersion,
    contentFormat,
    needsMigration,
    compatibilityNotes: notes,
  };
}

export async function ensureBackwardCompatibility(tableName: string, records: any[]): Promise<any[]> {
  const currentVersion = getCurrentSchemaVersion(tableName);

  return records.map(record => {
    const recordVersion = record?.schema_version || record?.schemaVersion || 1;

    if (recordVersion < currentVersion) {
      const transformed = transformContent(tableName, record, recordVersion);
      return { ...transformed, schema_version: currentVersion, _migrated: true };
    }

    return record;
  });
}

export async function getSchemaVersionStats(): Promise<{
  tables: { tableName: string; currentVersion: number; recordsByVersion: Record<number, number> }[];
}> {
  const tables: { tableName: string; currentVersion: number; recordsByVersion: Record<number, number> }[] = [];

  for (const [tableName, currentVersion] of Object.entries(CURRENT_SCHEMA_VERSIONS)) {
    try {
      const colCheck = await pool.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = 'schema_version'`,
        [tableName]
      );

      if (colCheck.rows.length > 0) {
        const result = await pool.query(
          `SELECT COALESCE(schema_version, 1) as version, COUNT(*) as cnt FROM ${tableName} GROUP BY COALESCE(schema_version, 1) ORDER BY version`
        );
        const recordsByVersion: Record<number, number> = {};
        for (const row of result.rows) {
          recordsByVersion[row.version] = parseInt(row.cnt);
        }
        tables.push({ tableName, currentVersion, recordsByVersion });
      } else {
        const countResult = await pool.query(`SELECT COUNT(*) as cnt FROM ${tableName}`);
        tables.push({
          tableName,
          currentVersion,
          recordsByVersion: { 1: parseInt(countResult.rows[0]?.cnt || "0") },
        });
      }
    } catch {
      tables.push({ tableName, currentVersion, recordsByVersion: {} });
    }
  }

  return { tables };
}
