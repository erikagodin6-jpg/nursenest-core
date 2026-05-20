import { existsSync } from "fs";
import path from "path";

const TARGET_RELATIVE_PATH = path.join("tools", "i18n", "source", "i18n-en.ts");

/**
 * Walks upward from cwd to find the repo root.
 * Safe for:
 * - Docker
 * - CI/CD
 * - nested monorepo paths
 * - DigitalOcean / Render builds
 */
export function getMonorepoRoot(): string {
  let current = process.cwd();

  for (let i = 0; i < 10; i++) {
    const candidate = path.join(current, TARGET_RELATIVE_PATH);

    if (existsSync(candidate)) {
      return current;
    }

    const parent = path.dirname(current);

    // stop at filesystem root
    if (parent === current) break;

    current = parent;
  }

  // last resort fallback
  return process.cwd();
}