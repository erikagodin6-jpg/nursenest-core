import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { emitStructuredLog } from "./log-sink";

/**
 * Thrown when a client-data or opaque server module cannot be resolved or executed at runtime.
 * Always includes absolute paths for operations debugging.
 */
export class ClientDataImportError extends Error {
  readonly requestedPath: string;
  readonly resolvedFile: string;

  constructor(message: string, ctx: { requestedPath: string; resolvedFile: string }, cause?: unknown) {
    super(message, cause instanceof Error ? { cause } : undefined);
    this.name = "ClientDataImportError";
    this.requestedPath = ctx.requestedPath;
    this.resolvedFile = ctx.resolvedFile;
  }
}

/**
 * Dynamic import that TypeScript does not treat as a static module graph edge.
 * With `moduleResolution: "bundler"`, `import(pathToFileURL(...).href)` can still
 * pull client content into `tsc -p tsconfig.server.json`.
 */
function importWithoutTsModuleGraph(specifier: string): Promise<unknown> {
  return new Function("s", "return import(s)")(specifier) as Promise<unknown>;
}

/**
 * Resolve a filesystem path to an actual module file under client/ (typically .ts).
 * Used before dynamic import so Node/tsx can load the module.
 */
export function resolveClientDataModuleFile(absolutePathWithoutOrWithExt: string): string {
  const norm = path.normalize(absolutePathWithoutOrWithExt);
  if (fs.existsSync(norm) && fs.statSync(norm).isFile()) return norm;
  for (const ext of [".ts", ".tsx"]) {
    const withExt = norm + ext;
    if (fs.existsSync(withExt)) return withExt;
    const indexFile = path.join(norm, `index${ext}`);
    if (fs.existsSync(indexFile)) return indexFile;
  }
  return norm.endsWith(".ts") || norm.endsWith(".tsx") ? norm : `${norm}.ts`;
}

function assertResolvedModuleFileIsReadable(resolvedFile: string, requestedPath: string): void {
  try {
    if (!fs.existsSync(resolvedFile)) {
      throw new ClientDataImportError(
        `Resolved path does not exist: ${resolvedFile}`,
        { requestedPath, resolvedFile },
      );
    }
    const st = fs.statSync(resolvedFile);
    if (!st.isFile()) {
      throw new ClientDataImportError(
        `Resolved path is not a file: ${resolvedFile}`,
        { requestedPath, resolvedFile },
      );
    }
  } catch (e) {
    if (e instanceof ClientDataImportError) throw e;
    throw new ClientDataImportError(
      `Cannot access module file: ${resolvedFile} (${e instanceof Error ? e.message : String(e)})`,
      { requestedPath, resolvedFile },
      e,
    );
  }
}

/**
 * Dynamically import a client data TypeScript module without a static specifier, so
 * `tsc -p tsconfig.server.json` does not typecheck client lesson/question content.
 */
/** Return type is intentionally loose: opaque ESM namespace from arbitrary paths; callers validate exports. */
export async function importClientDataAbsolute(absolutePath: string): Promise<any> {
  const requestedPath = path.resolve(absolutePath);
  const resolvedFile = resolveClientDataModuleFile(requestedPath);
  assertResolvedModuleFileIsReadable(resolvedFile, requestedPath);

  const href = pathToFileURL(resolvedFile).href;
  try {
    return await importWithoutTsModuleGraph(href);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(
      "[client-data-import] Dynamic import failed\n" +
        `  requestedPath: ${requestedPath}\n` +
        `  resolvedFile:  ${resolvedFile}\n` +
        `  fileUrl:       ${href}\n` +
        `  error:         ${msg}`,
    );
    emitStructuredLog(
      {
        level: "error",
        type: "client_data_import_failure",
        requestedPath,
        resolvedFile,
        message: msg,
      },
      "error",
    );
    throw new ClientDataImportError(
      `Dynamic import failed for ${resolvedFile}: ${msg}`,
      { requestedPath, resolvedFile },
      e,
    );
  }
}

/** Same opaque loader for arbitrary server `.ts` modules (e.g. seeds) without pulling their imports into `tsc`. */
export async function importTsModuleAbsolute(absolutePath: string): Promise<any> {
  return importClientDataAbsolute(absolutePath);
}
