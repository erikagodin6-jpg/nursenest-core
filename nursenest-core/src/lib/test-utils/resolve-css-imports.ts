/**
 * Test helper: resolves one level of local @import declarations in a CSS file
 * so contract tests can read the full CSS content even when a file is a barrel
 * of @import statements.
 *
 * Only resolves relative ./  and ../  imports — not node_modules or remote URLs.
 * Does not recurse (section files are not expected to import each other).
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function resolveCssFile(filePath: string): string {
  const absPath = resolve(filePath);
  const content = readFileSync(absPath, "utf8");
  const dir = dirname(absPath);

  return content.replace(
    /@import\s+"(\.\.?\/[^"]+)"\s*;/g,
    (_match, importPath) => {
      try {
        const importedPath = join(dir, importPath);
        return readFileSync(importedPath, "utf8");
      } catch {
        // If the imported file cannot be resolved, leave the @import in place
        // so tests can identify broken imports rather than silently passing.
        return _match;
      }
    },
  );
}
