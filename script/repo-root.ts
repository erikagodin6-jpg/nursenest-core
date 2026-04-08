import path from "path";
import { fileURLToPath } from "url";

/**
 * Absolute path to the repository root (parent of `script/`), independent of `process.cwd()`.
 * Use this in i18n scripts so merge/validate always read the same trees even when npm cwd varies.
 */
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
