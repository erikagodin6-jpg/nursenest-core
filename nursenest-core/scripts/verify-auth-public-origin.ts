/**
 * Validates AUTH_URL / NEXTAUTH_URL for Auth.js public-origin + secure-cookie alignment.
 *
 * From `nursenest-core/` with deploy env loaded (e.g. DigitalOcean env vars):
 *   npx tsx scripts/verify-auth-public-origin.ts
 *   npm run verify:auth-public-origin
 *
 * Local HTTP: pass `--allow-http` to skip https-only checks.
 */
import {
  collectAuthPublicOriginEnvIssues,
  hasAnyAuthPublicOriginUrl,
} from "../src/lib/auth/auth-public-origin-env";

const allowHttp = process.argv.includes("--allow-http");
const issues = !hasAnyAuthPublicOriginUrl()
  ? (() => {
      console.error(
        "[verify-auth-public-origin] error: neither AUTH_URL nor NEXTAUTH_URL is set — set one to your canonical public origin (origin-only, e.g. https://www.example.com).",
      );
      return [
        {
          code: "auth_url_missing",
          severity: "critical" as const,
          message:
            "Set AUTH_URL or NEXTAUTH_URL to the canonical public origin (origin-only, e.g. https://www.example.com).",
        },
      ];
    })()
  : collectAuthPublicOriginEnvIssues({ requireProductionHttps: !allowHttp });

for (const i of issues) {
  const tag = i.severity === "critical" ? "error" : "warn";
  console.error(`[verify-auth-public-origin] ${tag} code=${i.code} — ${i.message}`);
}

const critical = issues.filter((i) => i.severity === "critical");
if (critical.length > 0) {
  console.error(`[verify-auth-public-origin] failed: ${critical.length} critical issue(s)`);
  process.exit(1);
}

console.error("[verify-auth-public-origin] ok");
