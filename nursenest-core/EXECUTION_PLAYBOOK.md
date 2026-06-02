# Scalability Hardening: Execution Playbook

**Priority Order:** Stability → Isolation → Bounded Operations → Cacheability → Deployment Safety → Scalability → Polish

**Current Status:** EXECUTING PHASE 1  
**Date:** 2026-05-25

---

## 🔴 PHASE 1: STABILITY (IMMEDIATE - Days 1-3)

**Goal:** Ensure platform doesn't break under load

### Current State (From Audits)
- ✅ Force-dynamic: 400 total (target: 150)
  - 65 marketing routes (PRIMARY TARGET)
  - 97 admin (legitimate)
  - 175 API (legitimate)
  - 36 learner (legitimate)
- ⏳ Unbounded queries: Audit running...

### Action 1.1: Critical Marketing Route Stability ⚡ PRIORITY 1

**Target:** Top 10 highest-traffic marketing routes must be bulletproof

**Execute Now:**

```bash
# 1. Homepage stability
# File: src/app/(marketing)/(default)/page.tsx
# Action: Add timeout guards, static fallback

# 2. Blog routes stability  
# Files: src/app/(marketing)/(default)/blog/**
# Action: Wrap all DB calls with try-catch + static fallback

# 3. Pathway hubs stability
# Files: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/**
# Action: Add failsafe defaults for missing data
```

**Pattern to Apply:**
```typescript
// BEFORE (risky):
const data = await prisma.user.findMany();
return <Component data={data} />;

// AFTER (stable):
try {
  const data = await Promise.race([
    prisma.user.findMany(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 5000)
    )
  ]);
  return <Component data={data} />;
} catch (error) {
  console.error('DB failed, using static fallback', error);
  return <Component data={STATIC_FALLBACK_DATA} />;
}
```

### Action 1.2: Session Provider Isolation ⚡ PRIORITY 2

**Verify:** SessionProvider is ONLY in (app) layout, NOT in (marketing)

**Execute:**
```bash
# Check (marketing) layout
grep -r "SessionProvider" src/app/\(marketing\)/

# Expected: NO RESULTS
# If found: REMOVE IT IMMEDIATELY
```

### Action 1.3: Emergency Force-Dynamic Quick Wins ⚡ PRIORITY 3

**Target:** 20 easiest marketing route conversions

**Files with `force-dynamic` that can become ISR:**

1. **Flashcard routes** (static content, can cache 1hr):
   ```typescript
   // Remove: export const dynamic = 'force-dynamic';
   // Add: export const revalidate = 3600;
   ```

2. **Lesson routes** (static content, can cache 30min):
   ```typescript
   // Remove: export const dynamic = 'force-dynamic';
   // Add: export const revalidate = 1800;
   ```

3. **Topic routes** (static content, can cache 1hr):
   ```typescript
   // Remove: export const dynamic = 'force-dynamic';
   // Add: export const revalidate = 3600;
   ```

**Execute Script:**
```bash
cd /root/nursenest-core/nursenest-core
node scripts/batch-convert-to-isr.mjs --dry-run
# Review output
node scripts/batch-convert-to-isr.mjs --execute
```

---

## 🟠 PHASE 2: ISOLATION (Days 4-6)

**Goal:** Traffic spikes in one area cannot affect others

### Action 2.1: Boundary Violation Detection ⚡ NEXT

**Create ESLint rule:**
```javascript
// .eslintrc.js
rules: {
  'no-restricted-imports': ['error', {
    patterns: [{
      group: ['../(app)/**'],
      message: 'Marketing routes cannot import from (app) - violates isolation'
    }]
  }]
}
```

### Action 2.2: Connection Pool Documentation

**Execute:**
```bash
# Document current settings
cat > docs/database-connection-pool.md << 'EOF'
# Database Connection Pool Configuration

## Current Settings
- PRISMA_CONNECTION_LIMIT: 22
- MAX_CONCURRENT_QUERIES: 22
- Statement timeout: 120s

## Per-Route Type Targets
- Marketing: <5 queries
- Learner: <25 queries
- Admin: no limit (low traffic)
EOF
```

---

## 🟡 PHASE 3: BOUNDED OPERATIONS (Days 7-10)

**Goal:** No resource exhaustion

### Action 3.1: Fix All Unbounded Queries ⚡ AFTER AUDIT COMPLETES

**Wait for:** `scripts/audit-unbounded-queries.mjs` to complete

**Then Execute:**
```bash
# Review violations
cat reports/unbounded-queries.json | jq '.violations[] | select(.severity=="CRITICAL")'

# Fix pattern:
# BEFORE: prisma.user.findMany()
# AFTER:  prisma.user.findMany({ take: 100 })
```

### Action 3.2: Implement Pagination Standards

**For all list endpoints:**
```typescript
import { createCursorPagination } from '@/lib/pagination/cursor-pagination';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  
  const pagination = createCursorPagination({
    cursor,
    pageSize: 20,
  });
  
  const items = await prisma.item.findMany({
    take: pagination.take,
    skip: pagination.skip,
    cursor: pagination.decodedCursor,
  });
  
  return Response.json({
    items,
    nextCursor: pagination.encodeCursor(items),
    hasMore: items.length === pagination.take,
  });
}
```

---

## 🟢 PHASE 4: CACHEABILITY (Days 11-15)

**Goal:** Maximize CDN/edge cache hits

### Action 4.1: Marketing Route ISR Conversion

**Batch 1: Blog Routes (10 routes)**
```bash
# Convert all blog routes
find src/app/\(marketing\)/\(default\)/blog -name "page.tsx" \
  -exec sed -i "s/export const dynamic = 'force-dynamic';/export const revalidate = 1800;/g" {} \;
```

**Batch 2: Pathway Hubs (15 routes)**
```bash
# Convert pathway landing pages
find src/app/\(marketing\)/\(default\)/\[locale\]/\[slug\]/\[examCode\] -name "page.tsx" \
  -exec sed -i "s/export const dynamic = 'force-dynamic';/export const revalidate = 3600;/g" {} \;
```

**Batch 3: Static Pages (20 routes)**
```bash
# Legal, FAQ, pricing pages
# These should be fully static or ISR with long revalidation
```

### Action 4.2: Cache Header Optimization

**Update next.config.mjs:**
```javascript
async headers() {
  return [
    {
      source: '/blog/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      ],
    },
    {
      source: '/:locale/:slug/:exam/lessons/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ];
}
```

---

## 🔵 PHASE 5: DEPLOYMENT SAFETY (Days 16-18)

### Action 5.1: Enable Deployment Gates

**Update CI/CD:**
```yaml
# .github/workflows/deployment-gates.yml already exists
# Just need to enable it:
git commit -am "Enable deployment safety gates"
git push
```

### Action 5.2: Pre-Deploy Checklist

**Before every deploy:**
```bash
# 1. Check force-dynamic count
node scripts/audit-force-dynamic-count.mjs --fail-on-increase

# 2. Check unbounded queries  
node scripts/audit-unbounded-queries.mjs --fail-on-violations

# 3. Check boundary violations
node scripts/audit-public-route-dependencies.mjs --fail-on-new

# 4. Run smoke tests
npm run test:smoke

# All must pass before deploy
```

---

## 🟣 PHASE 6: SCALABILITY (Days 19-25)

### Action 6.1: Load Testing

**Execute:**
```bash
# Install k6
brew install k6  # or download from k6.io

# Test public traffic spike
k6 run tests/load/public-traffic-spike.k6.js

# Test learner concurrency
k6 run tests/load/learner-concurrent-sessions.k6.js

# Analyze results
less load-test-results.json
```

### Action 6.2: Database Index Audit

**Hot paths that need indexes:**
```sql
-- Check existing indexes
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Add missing indexes (if not exist):
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_progress_user_completed 
  ON "Progress" (userId, completed, updatedAt DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_user_status 
  ON "Subscription" (userId, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exam_session_user_status 
  ON "ExamSession" (userId, status, updatedAt DESC);
```

---

## ⚪ PHASE 7: OPTIMIZATION POLISH (Days 26-30)

### Action 7.1: Performance Profiling

**Implement route profiler:**
```typescript
import { RoutePerformanceProfiler } from '@/lib/performance/route-performance-profiler';

export async function GET(request: Request) {
  const profiler = new RoutePerformanceProfiler('/api/my-route', 'GET');
  
  try {
    const data = await profiler.measureAsync('fetch-data', async () => {
      return await prisma.user.findMany({ take: 100 });
    });
    
    return profiler.complete(Response.json(data));
  } catch (error) {
    return profiler.completeWithError(error);
  }
}
```

---

## 📊 Success Metrics Tracking

### Daily Checks
```bash
# Force-dynamic count (target: decrease daily)
node scripts/audit-force-dynamic-count.mjs

# Unbounded queries (target: 0)
node scripts/audit-unbounded-queries.mjs

# Boundary violations (target: 0)
node scripts/audit-public-route-dependencies.mjs
```

### Weekly Targets

**Week 1:**
- [ ] Force-dynamic: <350 (-50 from baseline)
- [ ] All critical routes have failsafes
- [ ] SessionProvider isolated correctly
- [ ] Zero new unbounded queries

**Week 2:**
- [ ] Force-dynamic: <300 (-100 from baseline)
- [ ] All marketing routes ISR or static
- [ ] Boundary enforcement rules active
- [ ] Pagination standards documented

**Week 3:**
- [ ] Force-dynamic: <250 (-150 from baseline)
- [ ] All list endpoints paginated
- [ ] Deployment gates enabled
- [ ] Load tests passing

**Week 4:**
- [ ] Force-dynamic: <150 (TARGET)
- [ ] Cache hit rate >80%
- [ ] TTFB p95 <300ms public
- [ ] All success metrics achieved

---

## 🚨 Emergency Rollback

If anything breaks after a change:

```bash
# 1. Identify the commit
git log --oneline -10

# 2. Revert specific commit
git revert <commit-hash>

# 3. Deploy immediately
git push

# 4. Investigate root cause
# 5. Fix and re-attempt
```

---

## Current Action Items (RIGHT NOW)

1. ✅ Wait for unbounded query audit to complete
2. ⏭️ Fix top 10 critical marketing routes with failsafes
3. ⏭️ Verify SessionProvider isolation
4. ⏭️ Convert 20 easy force-dynamic routes to ISR
5. ⏭️ Run force-dynamic audit again, confirm progress

**Next command to run:**
```bash
# After unbounded audit completes:
node scripts/batch-convert-to-isr.mjs --dry-run
```
