import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import pg from "pg";

type ColumnInfo = {
  column_name: string;
  data_type: string;
  udt_name: string;
};

type TableInfo = {
  table_schema: string;
  table_name: string;
};

type InventoryRow = {
  schema: string;
  table: string;
  rowCount: number;
  contentType: string;
  publicCount: number | null;
  hiddenCount: number | null;
  visibilityBasis: string;
  articleLike: boolean;
  articleSignals: string[];
  inspectedColumns: string[];
};

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 3,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 5_000,
});

function quoteIdent(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function qualifiedName(schema: string, table: string): string {
  return `${quoteIdent(schema)}.${quoteIdent(table)}`;
}

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function columnSet(columns: ColumnInfo[]): Set<string> {
  return new Set(columns.map((column) => column.column_name.toLowerCase()));
}

function findColumn(columns: ColumnInfo[], candidates: string[]): string | null {
  const normalized = new Map(columns.map((column) => [column.column_name.toLowerCase(), column.column_name]));
  for (const candidate of candidates) {
    const found = normalized.get(candidate.toLowerCase());
    if (found) return found;
  }
  return null;
}

function inferContentType(table: string, columns: ColumnInfo[]): string {
  const tableLower = table.toLowerCase();
  const cols = columnSet(columns);
  if (tableLower.includes("blog") || tableLower.includes("article") || tableLower.includes("post")) return "Article / Blog";
  if (tableLower.includes("lesson") || cols.has("learningobjectives")) return "Lesson";
  if (tableLower.includes("question") || cols.has("rationale") || cols.has("correctanswer")) return "Question Bank";
  if (tableLower.includes("flashcard") || cols.has("front") || cols.has("back")) return "Flashcard";
  if (tableLower.includes("seo") || cols.has("metadescription") || cols.has("canonicalurl")) return "SEO / Metadata";
  if (tableLower.includes("content") || cols.has("body") || cols.has("markdown") || cols.has("html")) return "Content";
  if (tableLower.includes("user") || tableLower.includes("account") || tableLower.includes("profile")) return "User / Account";
  if (tableLower.includes("subscription") || tableLower.includes("stripe") || tableLower.includes("payment")) return "Commerce";
  if (tableLower.includes("analytics") || tableLower.includes("event") || tableLower.includes("progress")) return "Analytics / Progress";
  return "Operational / Other";
}

function articleSignals(table: string, columns: ColumnInfo[]): string[] {
  const cols = columnSet(columns);
  const signals: string[] = [];
  const tableLower = table.toLowerCase();

  if (/(blog|article|post|seo|content|guide|glossary|authority|cluster)/i.test(table)) {
    signals.push(`table-name:${tableLower}`);
  }
  if (["title", "headline", "name"].some((column) => cols.has(column))) signals.push("title-like-column");
  if (["slug", "canonicalslug", "path", "url"].some((column) => cols.has(column))) signals.push("route-like-column");
  if (
    ["body", "content", "markdown", "mdx", "html", "rawcontent", "articlebody", "description"].some((column) =>
      cols.has(column),
    )
  ) {
    signals.push("body-like-column");
  }
  if (
    ["seotitle", "metatitle", "metadescription", "canonicalurl", "ogtitle", "ogdescription", "noindex"].some(
      (column) => cols.has(column),
    )
  ) {
    signals.push("seo-column");
  }
  if (["publishedat", "publishdate", "scheduledat", "status", "visibility"].some((column) => cols.has(column))) {
    signals.push("publishing-state-column");
  }

  return signals;
}

function isArticleLike(table: string, columns: ColumnInfo[]): boolean {
  const signals = articleSignals(table, columns);
  const hasBody = signals.includes("body-like-column");
  const hasRoute = signals.includes("route-like-column");
  const hasTitle = signals.includes("title-like-column");
  const namedContent = signals.some((signal) => signal.startsWith("table-name:"));
  const hasSeo = signals.includes("seo-column");
  return (hasTitle && hasRoute && (hasBody || hasSeo)) || (namedContent && (hasBody || hasSeo || hasRoute));
}

function statusCondition(column: string, values: string[]): string {
  const sqlValues = values.map((value) => `'${value.replaceAll("'", "''")}'`).join(", ");
  return `lower(${quoteIdent(column)}::text) in (${sqlValues})`;
}

function booleanCondition(column: string, expected: boolean): string {
  return `${quoteIdent(column)} is ${expected ? "true" : "false"}`;
}

function buildVisibilityConditions(columns: ColumnInfo[]): { publicCondition: string | null; hiddenCondition: string | null; basis: string } {
  const publicConditions: string[] = [];
  const hiddenConditions: string[] = [];
  const basis: string[] = [];

  const status = findColumn(columns, ["status", "publicationStatus", "publishStatus", "state"]);
  if (status) {
    basis.push(status);
    publicConditions.push(statusCondition(status, ["published", "public", "live", "active", "approved"]));
    hiddenConditions.push(
      statusCondition(status, ["draft", "scheduled", "pending", "pending_review", "pending review", "archived", "hidden", "private", "unpublished", "deleted"]),
    );
  }

  const visibility = findColumn(columns, ["visibility", "visibleState"]);
  if (visibility) {
    basis.push(visibility);
    publicConditions.push(statusCondition(visibility, ["public", "published", "visible", "indexable"]));
    hiddenConditions.push(statusCondition(visibility, ["hidden", "private", "unlisted", "noindex"]));
  }

  const publishedBool = findColumn(columns, ["published", "isPublished", "public", "isPublic"]);
  if (publishedBool) {
    basis.push(publishedBool);
    publicConditions.push(booleanCondition(publishedBool, true));
    hiddenConditions.push(`${quoteIdent(publishedBool)} is not true`);
  }

  const hiddenBool = findColumn(columns, ["hidden", "isHidden", "archived", "isArchived", "noindex", "isNoindex", "deleted"]);
  if (hiddenBool) {
    basis.push(hiddenBool);
    hiddenConditions.push(booleanCondition(hiddenBool, true));
    publicConditions.push(`${quoteIdent(hiddenBool)} is not true`);
  }

  const publishedAt = findColumn(columns, ["publishedAt", "publishDate", "published_at"]);
  if (publishedAt) {
    basis.push(publishedAt);
    publicConditions.push(`${quoteIdent(publishedAt)} is not null and ${quoteIdent(publishedAt)} <= now()`);
    hiddenConditions.push(`${quoteIdent(publishedAt)} is null or ${quoteIdent(publishedAt)} > now()`);
  }

  if (publicConditions.length === 0 && hiddenConditions.length === 0) {
    return { publicCondition: null, hiddenCondition: null, basis: "none detected" };
  }

  return {
    publicCondition: publicConditions.length > 0 ? `(${publicConditions.join(" or ")})` : null,
    hiddenCondition: hiddenConditions.length > 0 ? `(${hiddenConditions.join(" or ")})` : null,
    basis: [...new Set(basis)].join(", "),
  };
}

async function getTables(): Promise<TableInfo[]> {
  const result = await pool.query<TableInfo>(`
    select table_schema, table_name
    from information_schema.tables
    where table_type = 'BASE TABLE'
      and table_schema not in ('pg_catalog', 'information_schema')
    order by table_schema, table_name
  `);
  return result.rows;
}

async function getColumns(schema: string, table: string): Promise<ColumnInfo[]> {
  const result = await pool.query<ColumnInfo>(
    `
      select column_name, data_type, udt_name
      from information_schema.columns
      where table_schema = $1
        and table_name = $2
      order by ordinal_position
    `,
    [schema, table],
  );
  return result.rows;
}

async function countRows(schema: string, table: string): Promise<number> {
  const result = await pool.query<{ count: string }>(`select count(*)::text as count from ${qualifiedName(schema, table)}`);
  return Number(result.rows[0]?.count ?? 0);
}

async function countVisibility(schema: string, table: string, columns: ColumnInfo[]): Promise<{ publicCount: number | null; hiddenCount: number | null; basis: string }> {
  const { publicCondition, hiddenCondition, basis } = buildVisibilityConditions(columns);
  if (!publicCondition && !hiddenCondition) {
    return { publicCount: null, hiddenCount: null, basis };
  }

  const publicSelect = publicCondition ? `count(*) filter (where ${publicCondition})::text as public_count` : `null::text as public_count`;
  const hiddenSelect = hiddenCondition ? `count(*) filter (where ${hiddenCondition})::text as hidden_count` : `null::text as hidden_count`;
  const result = await pool.query<{ public_count: string | null; hidden_count: string | null }>(
    `select ${publicSelect}, ${hiddenSelect} from ${qualifiedName(schema, table)}`,
  );
  return {
    publicCount: result.rows[0]?.public_count == null ? null : Number(result.rows[0].public_count),
    hiddenCount: result.rows[0]?.hidden_count == null ? null : Number(result.rows[0].hidden_count),
    basis,
  };
}

function markdownTable(rows: InventoryRow[]): string {
  const header = "| Table Name | Row Count | Content Type | Public Count | Hidden Count | Article-Like? | Visibility Basis | Signals |";
  const divider = "|---|---:|---|---:|---:|---|---|---|";
  const body = rows
    .map((row) =>
      [
        `${row.schema}.${row.table}`,
        row.rowCount,
        row.contentType,
        row.publicCount ?? "n/a",
        row.hiddenCount ?? "n/a",
        row.articleLike ? "Yes" : "No",
        row.visibilityBasis,
        row.articleSignals.join("; ") || "none",
      ]
        .map((cell) => String(cell).replaceAll("|", "\\|"))
        .join(" | "),
    )
    .map((line) => `| ${line} |`)
    .join("\n");
  return `${header}\n${divider}\n${body}`;
}

function csv(rows: InventoryRow[]): string {
  const header = [
    "Table Name",
    "Schema",
    "Row Count",
    "Content Type",
    "Public Count",
    "Hidden Count",
    "Article-Like",
    "Visibility Basis",
    "Article Signals",
    "Inspected Columns",
  ];
  const lines = rows.map((row) =>
    [
      `${row.schema}.${row.table}`,
      row.schema,
      row.rowCount,
      row.contentType,
      row.publicCount ?? "",
      row.hiddenCount ?? "",
      row.articleLike ? "yes" : "no",
      row.visibilityBasis,
      row.articleSignals.join("; "),
      row.inspectedColumns.join("; "),
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.map(csvCell).join(","), ...lines].join("\n");
}

async function main(): Promise<void> {
  const tables = await getTables();
  const rows: InventoryRow[] = [];

  for (const table of tables) {
    const columns = await getColumns(table.table_schema, table.table_name);
    const rowCount = await countRows(table.table_schema, table.table_name);
    const visibility = await countVisibility(table.table_schema, table.table_name, columns);
    const signals = articleSignals(table.table_name, columns);
    rows.push({
      schema: table.table_schema,
      table: table.table_name,
      rowCount,
      contentType: inferContentType(table.table_name, columns),
      publicCount: visibility.publicCount,
      hiddenCount: visibility.hiddenCount,
      visibilityBasis: visibility.basis,
      articleLike: isArticleLike(table.table_name, columns),
      articleSignals: signals,
      inspectedColumns: columns.map((column) => `${column.column_name}:${column.data_type}`),
    });
  }

  rows.sort((a, b) => {
    if (a.articleLike !== b.articleLike) return a.articleLike ? -1 : 1;
    return b.rowCount - a.rowCount || `${a.schema}.${a.table}`.localeCompare(`${b.schema}.${b.table}`);
  });

  const articleRows = rows.filter((row) => row.articleLike);
  const totalRows = rows.reduce((sum, row) => sum + row.rowCount, 0);
  const articleLikeRows = articleRows.reduce((sum, row) => sum + row.rowCount, 0);

  const report = `# Production Table Content Inventory

Generated: ${new Date().toISOString()}

Scope: all non-system PostgreSQL base tables visible to the production database user. System schemas \`pg_catalog\` and \`information_schema\` are excluded.

## Summary

- Tables inspected: ${rows.length}
- Total rows counted: ${totalRows.toLocaleString()}
- Article-like tables flagged: ${articleRows.length}
- Rows in article-like tables: ${articleLikeRows.toLocaleString()}

## Method

Every table was inspected for column signatures, not just naming conventions:

- title-like fields: \`title\`, \`headline\`, \`name\`
- route-like fields: \`slug\`, \`canonicalSlug\`, \`path\`, \`url\`
- body-like fields: \`body\`, \`content\`, \`markdown\`, \`mdx\`, \`html\`, \`rawContent\`, \`articleBody\`, \`description\`
- SEO fields: \`seoTitle\`, \`metaTitle\`, \`metaDescription\`, \`canonicalUrl\`, \`ogTitle\`, \`ogDescription\`, \`noindex\`
- publishing fields: \`status\`, \`visibility\`, \`published\`, \`isPublished\`, \`hidden\`, \`isHidden\`, \`publishedAt\`

Public and hidden counts are exact where visibility/status/published columns exist. Tables without visibility semantics are reported as \`n/a\` rather than guessed.

## Article-Like Tables

${markdownTable(articleRows)}

## All Tables

${markdownTable(rows)}
`;

  await mkdir(path.join(ROOT_OUT, "docs/reports"), { recursive: true });
  await mkdir(path.join(ROOT_OUT, "reports"), { recursive: true });
  await writeFile(path.join(ROOT_OUT, "docs/reports/production-table-content-inventory.md"), report);
  await writeFile(path.join(ROOT_OUT, "reports/production-table-content-inventory.csv"), csv(rows));
  await writeFile(path.join(ROOT_OUT, "reports/production-article-like-tables.csv"), csv(articleRows));

  console.log(`Inspected ${rows.length} tables.`);
  console.log(`Flagged ${articleRows.length} article-like tables.`);
  console.log(`Wrote docs/reports/production-table-content-inventory.md`);
  console.log(`Wrote reports/production-table-content-inventory.csv`);
  console.log(`Wrote reports/production-article-like-tables.csv`);
}

const ROOT_OUT = process.cwd();

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
