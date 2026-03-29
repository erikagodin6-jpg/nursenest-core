/**
 * Noncritical Prisma reads: missing tables, schema drift, or connection blips must not take down routes.
 */

/** Prisma / Postgres signals for optional tables or drifted schema (P2010, P2021, etc.). */
export function isNonFatalPrismaSchemaError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code?: string }).code) : "";
  return (
    /does not exist|relation [^ ]+ does not exist|table|Unknown table|column/i.test(msg) ||
    /P2010|P2021|P2022|P2003|P1017/i.test(msg + code)
  );
}

export async function safePrismaCount(
  label: string,
  run: () => Promise<number>,
): Promise<{ value: number; warning?: string }> {
  try {
    return { value: await run() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const hint = isNonFatalPrismaSchemaError(e) ? "schema_or_table" : "query";
    return {
      value: 0,
      warning: `[${label}] ${hint}: ${msg.slice(0, 280)}`,
    };
  }
}

export async function withPrismaReadFallback<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<{ value: T; warning?: string }> {
  try {
    return { value: await run() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      value: fallback,
      warning: `[${label}] ${isNonFatalPrismaSchemaError(e) ? "schema_or_table" : "read"}: ${msg.slice(0, 280)}`,
    };
  }
}
