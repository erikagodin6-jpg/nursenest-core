/**
 * NurseNest — Database Environment Diagnostic
 *
 * Prints only safe, non-secret diagnostic information:
 * - DATABASE_URL present: true/false
 * - DIRECT_URL present: true/false
 * - masked host
 * - NODE_ENV
 *
 * Usage: tsx scripts/db-env-diagnostic.ts
 */

import "./load-dotenv-for-cli.mts";

function maskHost(urlString: string | undefined): string {
  if (!urlString) return "N/A";
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    if (host.length <= 4) return "***";
    return `${host[0]}***${host.slice(-3)}`;
  } catch {
    return "INVALID_URL";
  }
}

function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_DIRECT_URL;
  const nodeEnv = process.env.NODE_ENV ?? "development";

  console.log(JSON.stringify({
    databaseUrlPresent: !!databaseUrl,
    directUrlPresent: !!directUrl,
    hostMasked: databaseUrl ? maskHost(databaseUrl) : "N/A",
    nodeEnv,
  }, null, 2));
}

main();