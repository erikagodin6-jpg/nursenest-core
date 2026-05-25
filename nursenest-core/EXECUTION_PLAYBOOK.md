# 🚀 Production Hardening Execution Playbook

**Status:** All infrastructure complete - Ready for incremental rollout  
**Date:** 2026-05-25  
**Phases Complete:** 15/15 (100%)

## Quick Start

```bash
# 1. Run audits to establish baseline
node scripts/audit-force-dynamic.mjs
node scripts/audit-public-runtime.mjs
node scripts/audit-unbounded-queries.mjs

# 2. Convert ISR-eligible routes (batch)
node scripts/batch-convert-to-isr.mjs \
  src/app/(marketing)/(default)/pre-nursing/[slug]/page.tsx \
  src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx

# 3. Verify changes
git diff
npm run typecheck
npm run lint

# 4. Test locally
npm run dev
# Visit converted routes, verify they render

# 5. Re-run audit to confirm reduction
node scripts/audit-force-dynamic.mjs

# 6. Commit and deploy
git add .
git commit -m "feat: convert pre-nursing routes to ISR"
git push
```

## Daily Workflow

### Morning: Check Status
```bash
# Check force-dynamic count
node scripts/audit-force-dynamic.mjs | grep "Force-dynamic declarations"

# Check for new violations
node scripts/audit-public-runtime.mjs
```

### During Development: Convert Routes
```bash
# Identify next batch (5-7 routes)
cat reports/force-dynamic-audit.json | jq '.[] | select(.classification=="convertToISR") | .route' | head -7

# Convert batch
node scripts/batch-convert-to-isr.mjs <route1> <route2> ...

# Test
npm run dev
# Verify routes render correctly

# Commit
