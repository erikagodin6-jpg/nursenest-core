#!/usr/bin/env node
/**
 * Post-deploy: bust Next.js Data Cache tags for blog, pathway lesson hubs, and public flashcard tags
 * (same as {@link revalidateBlogPublishingSurfaces}).
 *
 * Requires:
 *   - BASE_URL or DEPLOY_REVALIDATE_BASE_URL (e.g. https://www.nursenest.ca)
 *   - CRON_SECRET (Bearer token for POST /api/cron/blog-revalidate)
 *
 *   BASE_URL=https://www.nursenest.ca CRON_SECRET=... npm run deploy:revalidate-marketing-cache
 *
 * Skips with exit 0 if BASE_URL or CRON_SECRET is unset (so CI without secrets does not fail).
 */
const base =
  String(process.env.DEPLOY_REVALIDATE_BASE_URL ?? process.env.BASE_URL ?? process.env.VERCEL_URL ?? "").trim();
const secret = String(process.env.CRON_SECRET ?? "").trim();

if (!base || !secret) {
  console.log(
    "[post-deploy-revalidate] skip missing_base_or_secret base_set=" +
      (base ? "1" : "0") +
      " secret_set=" +
      (secret ? "1" : "0"),
  );
  process.exit(0);
}

const url = new URL("/api/cron/blog-revalidate", base.endsWith("/") ? base : `${base}/`);

async function main() {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: "{}",
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[post-deploy-revalidate] failed status=${res.status} body=${text.slice(0, 500)}`);
    process.exit(1);
  }
  console.log(`[post-deploy-revalidate] ok status=${res.status} ${text.slice(0, 200)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
