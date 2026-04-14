#!/usr/bin/env bash
# Run from nursenest-core/ with a real DATABASE_URL in the environment (or load via set -a; source /path/.env).
#
# Non-destructive toward the database by default:
#   - migrate status (read-only)
#   - entitlement audit (read-only queries)
#   - import-blog --dry-run (no writes)
#   - blog final report (read-only)
#
# Optional (mutates DB — opt-in only):
#   BLOG_IMPORT_APPLY=1  — runs import-blog WITHOUT --dry-run after the dry-run step
#
# Optional (mutates repo working tree — opt-in only):
#   PULL_SCHEMA=1        — runs `prisma db pull` (rewrites prisma/schema.prisma from remote; backup schema first)
#
# Frontend smoke (optional):
#   PRODUCTION_BASE_URL=https://your-domain.com  — curl /blog, sitemap, etc.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set. Export it or: set -a && source /path/to/.env && set +a"
  exit 1
fi

echo "== Step 1: Prisma (migrate status) =="
npx prisma migrate status

if [[ "${PULL_SCHEMA:-0}" == "1" ]]; then
  echo "== prisma db pull (rewrites prisma/schema.prisma — PULL_SCHEMA=1) =="
  npx prisma db pull
else
  echo "== Skipping prisma db pull (set PULL_SCHEMA=1 to introspect remote into schema file) =="
fi

echo "== Step 2: Entitlement audit (read-only) =="
npm run audit:entitlements

echo "== Step 3a: Blog import DRY-RUN (no DB writes) =="
npx tsx scripts/import-blog.ts --dry-run --batch-size=25 --dedupe-report

if [[ "${BLOG_IMPORT_APPLY:-0}" == "1" ]]; then
  echo "== Step 3b: Blog import APPLY (writes BlogPost rows) — BLOG_IMPORT_APPLY=1 =="
  npx tsx scripts/import-blog.ts --batch-size=25 --dedupe-report
else
  echo "== Skipping live blog import (set BLOG_IMPORT_APPLY=1 after reviewing dry-run) =="
fi

echo "== Step 4: Blog final report =="
npm run blog:audit:final

if [[ -n "${PRODUCTION_BASE_URL:-}" ]]; then
  echo "== Step 5: Frontend smoke (PRODUCTION_BASE_URL) =="
  BASE="${PRODUCTION_BASE_URL%/}"
  for path in "/blog" "/sitemap.xml"; do
    code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 30 "${BASE}${path}" || echo "000")"
    echo "  ${BASE}${path} -> HTTP ${code}"
  done
else
  echo "== Step 5: Skipped (set PRODUCTION_BASE_URL to curl /blog and /sitemap.xml) =="
fi

echo "Done. Review data/audit/*.json and dedupe report under data/audit/."
