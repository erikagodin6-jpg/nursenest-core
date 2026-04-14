#!/usr/bin/env node
/**
 * Lists recent unresolved Sentry issues for ops / triage.
 *
 * Requires:
 *   SENTRY_AUTH_TOKEN — API token with `project:read` (and org access)
 *   SENTRY_ORG — organization slug
 *   SENTRY_PROJECT — project slug
 *
 * Usage:
 *   cd nursenest-core && node scripts/sentry-recent-issues.mjs
 *   STATS_PERIOD=7d LIMIT=10 node scripts/sentry-recent-issues.mjs
 */

const host = process.env.SENTRY_HOST?.trim() || "https://sentry.io";
const token = process.env.SENTRY_AUTH_TOKEN?.trim();
const org = process.env.SENTRY_ORG?.trim();
const project = process.env.SENTRY_PROJECT?.trim();
const statsPeriod = process.env.STATS_PERIOD?.trim() || "7d";
const limit = Math.min(100, Math.max(1, Number(process.env.LIMIT) || 10));

function main() {
  if (!token || !org || !project) {
    console.error(
      "Set SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT (see .env.example Sentry section).",
    );
    process.exit(1);
  }

  const url = new URL(`${host}/api/0/projects/${encodeURIComponent(org)}/${encodeURIComponent(project)}/issues/`);
  url.searchParams.set("statsPeriod", statsPeriod);
  url.searchParams.set("query", "is:unresolved");
  url.searchParams.set("limit", String(limit));

  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const text = await res.text();
      if (!res.ok) {
        console.error(`Sentry API ${res.status}: ${text.slice(0, 500)}`);
        process.exit(1);
      }
      return JSON.parse(text);
    })
    .then((issues) => {
      if (!Array.isArray(issues)) {
        console.error("Unexpected response shape");
        process.exit(1);
      }
      for (const row of issues) {
        const title = row.title ?? row.culprit ?? "(no title)";
        const level = row.level ?? "?";
        const count = row.count ?? "?";
        const shortId = row.shortId ?? row.id ?? "?";
        console.log(`${shortId}\tlevel=${level}\tcount~${count}\t${title}`);
      }
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

main();
