/**
 * Fails CI / prebuild if the repo-root Dockerfile bakes DATABASE_URL via ARG/ENV or reintroduces the
 * historical DigitalOcean/App Platform placeholder (`postgres:postgres@127.0.0.1:5432/postgres`).
 *
 * Run: node scripts/verify-dockerfile-database-url.mjs
 * Optional: DOCKERFILE_PATH=/abs/path/to/Dockerfile
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const defaultDockerfile = path.join(packageRoot, "..", "Dockerfile");
const dockerfilePath = process.env.DOCKERFILE_PATH?.trim() || defaultDockerfile;

if (!existsSync(dockerfilePath)) {
  console.error(`[verify-dockerfile-database-url] Missing Dockerfile: ${dockerfilePath}`);
  process.exit(1);
}

const text = readFileSync(dockerfilePath, "utf8");
const lines = text.split(/\r?\n/);

const violations = [];
for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i] ?? "";
  const trimmed = line.trim();
  if (/^ARG\s+DATABASE_URL\b/i.test(trimmed)) {
    violations.push({ line: i + 1, kind: "ARG_DATABASE_URL", text: trimmed });
  }
  if (/^ENV\s+DATABASE_URL\b/i.test(trimmed)) {
    violations.push({ line: i + 1, kind: "ENV_DATABASE_URL", text: trimmed });
  }
}

const bannedLiteral = "postgres:postgres@127.0.0.1:5432/postgres";
if (text.includes(bannedLiteral)) {
  violations.push({ line: 0, kind: "BANNED_PLACEHOLDER_SUBSTRING", text: bannedLiteral });
}

if (violations.length > 0) {
  console.error("[verify-dockerfile-database-url] Forbidden Dockerfile DATABASE_URL patterns:");
  for (const v of violations) {
    console.error(`  ${v.line > 0 ? `line ${v.line}` : "file"}: ${v.kind}${v.text ? ` — ${v.text}` : ""}`);
  }
  console.error(
    "[verify-dockerfile-database-url] Use a one-line RUN prefix for `npm run db:generate` only; never ARG/ENV DATABASE_URL.",
  );
  process.exit(1);
}

console.log(`[verify-dockerfile-database-url] OK — ${dockerfilePath}`);
