import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Load project root `.env` into `process.env` before other server modules read env vars.
 * Does not override keys already set in the environment (same rule as dotenv).
 */
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  const text = readFileSync(envPath, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}
