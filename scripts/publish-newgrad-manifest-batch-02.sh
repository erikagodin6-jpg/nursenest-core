#!/usr/bin/env bash
# Wrapper: blog batch content is at repo ../data/blog-content/; Prisma runs from the Next.js app.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/nursenest-core"
exec npx tsx scripts/publish-newgrad-manifest-batch-02.ts "$@"
