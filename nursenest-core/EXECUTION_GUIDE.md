# Production Hardening Execution Guide

**Status**: Infrastructure Complete - Ready for Execution  
**Blueprint**: Production Hardening Execution Blueprint  
**Plan**: [`plans/production-hardening-phase-deployment-resilience.md`](plans/production-hardening-phase-deployment-resilience.md)  
**Implementation Status**: [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md)

---

## 🎯 Strategic Direction

This is a **salvage/refactor stabilization program**, NOT a rebuild.

**Core Principles:**
- ✅ Preserve current application structure
- ✅ Incremental migration over disruptive replacement
- ✅ Maintain existing runtime-boundary enforcement
- ✅ Preserve degraded-mode protections
- ✅ Reduce request-time rendering aggressively
- ✅ Isolate learner/runtime-heavy systems from public delivery
- ✅ Block regressions through deployment gates
- ✅ Optimize for operational resilience over feature velocity

---

## 📋 Phase-by-Phase Execution

### PHASE 1: Marketing Layout Split & Static Public Runtime

#### ✅ Infrastructure Complete

**Created Components:**
- [`src/components/layout/site-header-static.tsx`](src/components/layout/site-header-static.tsx) - Static header (no auth/cookies/headers)
- [`src/components/layout/site-footer-static.tsx`](src/components/layout/site-footer-static.tsx) - Static footer
- [`src/components/marketing/marketing-navigation-static.tsx`](src/components/marketing/marketing-navigation-static.tsx) - Pure static nav
- [`src/components/auth/optional-auth-island.tsx`](src/components/auth/optional-auth-island.tsx) - Client-only auth widget
- Enhanced [`src/app/(marketing)/(public-static)/layout.tsx`](src/app/(marketing)/(public-static)/layout.tsx) - Complete static layout

**Runtime Rules Enforced:**
- ❌ No `headers()`
- ❌ No `cookies()`
- ❌ No auth/session runtime
- ❌ No learner systems
- ❌ No Prisma reads
- ❌ No force-dynamic inheritance
- ✅ ISR enabled (`revalidate: 3600`)
- ✅ Client islands supported

#### 🚀 Execution Steps

**Step 1: Migrate Blog Routes**
```bash
# Move blog routes to public-static
mv src/app/(marketing)/(default)/blog src/app/(marketing)/(public-static)/blog

# Update imports to use static components
# Replace SiteHeaderServer with SiteHeaderStatic
# Replace dynamic auth checks with OptionalAuthIsland
```

**Step 2: Migrate Pricing Pages**
```bash
# Move pricing to public-static
mv src/app/(marketing)/(default)/pricing src/app/(marketing)/(public-static)/pricing

# Convert dynamic pricing logic to:
# - Static base pricing display
# - Client island for calculator
# - Client island for checkout CTA
```

**Step 3: Migrate Legal/Informational Pages**
```bash
# Move legal pages
mv src/app/(marketing)/(default)/terms src/app/(marketing)/(public-static)/terms
mv src/app/(marketing)/(default)/privacy src/app/(marketing)/(public-static)/privacy
mv src/app/(marketing)/(default)/faq src/app/(marketing)/(public-static)/faq
mv src/app/(marketing)/(default)/about src/app/(marketing)/(public-static)/about
```

**Step 4: Migrate Pathway Landing Pages**
```bash
# Move pathway hubs (Priority 2)
# These require more careful migration due to catalog dependencies
# Use catalog snapshots from Phase 3
```

**Verification:**
```bash
# Run public runtime audit
node scripts/audit-public-route-dependencies.mjs --verbose

# Should show 0 violations in (public-static) routes
```

---

### PHASE 2: Force-Dynamic Burn-Down

#### ✅ Infrastructure Complete

**Created Tooling:**
- [`scripts/audit-force-dynamic-count.mjs`](scripts/audit-force-dynamic-count.mjs) - Automated tracking
- Baseline: 212 declarations
- Target: <150 declarations
- Tolerance: 5 increase allowed

#### 🚀 Execution Steps

**Step 1: Run Initial Audit**
```bash
node scripts/audit-force-dynamic-count.mjs --verbose > reports/force-dynamic-baseline.txt
```

**Step 2: Classify All Declarations**
Create `reports/force-dynamic-audit.json`:
```json
{
  "routes": [
    {
      "path": "src/app/(marketing)/(default)/blog/page.tsx",
      "classification": "isr",
      "reason": "Already has revalidate: 180, can remove force-dynamic",
      "priority": "high",
      "owner": "marketing"
    }
  ]
}
```

**Step 3: High-Priority Conversions**

**Blog Routes** (already have ISR):
```typescript
// src/app/(marketing)/(default)/blog/page.tsx
// REMOVE: export const dynamic = "force-dynamic";
// KEEP: export const revalidate = 180;
```

**Lessons Hub** (already has ISR):
```typescript
// src/app/(marketing)/(default)/lessons/page.tsx
// REMOVE: export const dynamic = "force-dynamic";
// KEEP: export const revalidate = 600;
```

**Practice Exams Hub** (already has ISR):
```typescript
// src/app/(marketing)/(default)/practice-exams/page.tsx
// REMOVE: export const dynamic = "force-dynamic";
// KEEP: export const revalidate = 600;
```

**Pathway Hubs** (already have ISR):
```typescript
// src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx
// REMOVE: export const dynamic = "force-dynamic";
// KEEP: export const revalidate = 86400;
```

**Step 4: Track Progress**
```bash
# After each batch of conversions
node scripts/audit-force-dynamic-count.mjs

# Target: Reduce by 10-15 per sprint
# Sprint 1: 212 → 197
# Sprint 2: 197 → 182
# Sprint 3: 182 → 167
# Sprint 4: 167 → <150
```

**Verification:**
```bash
# Ensure CI fails on regression
node scripts/audit-force-dynamic-count.mjs --fail-on-increase
```

---

### PHASE 3: Public Hub & Catalog Optimization

#### ✅ Infrastructure Complete

**Created System:**
- [`src/lib/catalog/catalog-snapshot-generator.ts`](src/lib/catalog/catalog-snapshot-generator.ts) - Precomputed indexes
- Lightweight metadata snapshots
- ISR-friendly caching
- Chunked loading support

#### 🚀 Execution Steps

**Step 1: Generate Catalog Snapshots**

Create build script:
```bash
# scripts/build-pathway-indexes.mjs
import { generateAllCatalogSnapshots } from '../src/lib/catalog/catalog-snapshot-generator.ts';
import { prisma } from '../src/lib/prisma.ts';

await generateAllCatalogSnapshots(prisma);
```

Add to build process:
```json
// package.json
{
  "scripts": {
    "build:prepare-content": "node scripts/build-pathway-indexes.mjs && ..."
  }
}
```

**Step 2: Implement Snapshot Caching**

Choose caching strategy:
```typescript
// Option A: Redis
await redis.setex(`catalog:RN`, 3600, JSON.stringify(snapshot));

// Option B: Database
await prisma.catalogSnapshot.upsert({
  where: { key: 'catalog:RN' },
  create: { key: 'catalog:RN', data: snapshot },
  update: { data: snapshot }
});

// Option C: File system (for ISR)
await fs.writeFile(
  'src/generated/pathway-indexes/rn.json',
  JSON.stringify(snapshot)
);
```

**Step 3: Integrate into Pathway Hubs**

```typescript
// src/app/(marketing)/(public-static)/[locale]/[slug]/[examCode]/lessons/page.tsx
import { getCachedCatalogSnapshot } from '@/lib/catalog/catalog-snapshot-generator';

export const revalidate = 3600; // ISR

export default async function PathwayLessonsPage({ params }) {
  // Use lightweight snapshot instead of full catalog
  const snapshot = await getCachedCatalogSnapshot(`catalog:${params.examCode}`);
  
  return (
    <PathwayLessonsHub
      snapshot={snapshot}
      // Client-side pagination for full catalog
    />
  );
}
```

**Step 4: Implement Chunked Loading**

```typescript
// Client component for chunked catalog
'use client';

export function ChunkedCatalogView({ initialSnapshot }) {
  const [items, setItems] = useState(initialSnapshot.recentItems);
  const [loading, setLoading] = useState(false);
  
  const loadMore = async () => {
    setLoading(true);
    const response = await fetch(`/api/catalog/chunk?cursor=${cursor}`);
    const data = await response.json();
    setItems([...items, ...data.items]);
    setLoading(false);
  };
  
  return (
    <div>
      {items.map(item => <CatalogItem key={item.id} {...item} />)}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}
```

**Performance Budgets:**
```json
// config/performance-budgets.json
{
  "publicPayloadKB": 100,
  "publicTTFBms": 300,
  "learnerTTFBms": 500,
  "maxSerializedPropsKB": 50
}
```

**Verification:**
```bash
# Measure payload sizes
npm run build
# Check .next/server/app/(marketing)/(public-static)/[locale]/[slug]/[examCode]/lessons.html

# Should be < 100KB
```

---

### PHASE 4: Learner Delivery Hardening

#### ✅ Infrastructure Complete

**Created System:**
- [`scripts/audit-unbounded-queries.mjs`](scripts/audit-unbounded-queries.mjs) - Query auditing
- [`src/lib/pagination/cursor-pagination.ts`](src/lib/pagination/cursor-pagination.ts) - Standard pagination
- MAX_PAGE_SIZE: 100
- DEFAULT_PAGE_SIZE: 20

#### 🚀 Execution Steps

**Step 1: Run Unbounded Query Audit**
```bash
node scripts/audit-unbounded-queries.mjs --verbose > reports/unbounded-queries.txt
```

**Step 2: Fix High-Severity Violations**

**Pattern: Add take limits**
```typescript
// BEFORE (unbounded)
const flashcards = await prisma.flashcard.findMany({
  where: { userId }
});

// AFTER (bounded)
const flashcards = await prisma.flashcard.findMany({
  where: { userId },
  take: 100,
  orderBy: { createdAt: 'desc' }
});
```

**Pattern: Implement cursor pagination**
```typescript
// src/app/(app)/app/(learner)/flashcards/page.tsx
import { paginateQuery } from '@/lib/pagination/cursor-pagination';

export default async function FlashcardsPage({ searchParams }) {
  const result = await paginateQuery(
    prisma.flashcard,
    { cursor: searchParams.cursor, limit: 20 },
    { where: { userId }, orderBy: { createdAt: 'desc' } }
  );
  
  return (
    <FlashcardList
      items={result.items}
      nextCursor={result.nextCursor}
      hasMore={result.hasMore}
    />
  );
}
```

**Step 3: Defer Optional Systems**

```typescript
// Defer recommendations
<Suspense fallback={<RecommendationsSkeleton />}>
  <DeferredRecommendations userId={userId} />
</Suspense>

// Defer analytics
<Suspense fallback={null}>
  <DeferredAnalytics userId={userId} />
</Suspense>
```

**Step 4: Add Query Standards**

```typescript
// src/server/db/query-standards.ts
export const QUERY_STANDARDS = {
  STANDARD_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  MAX_INCLUDE_DEPTH: 2,
  DEFAULT_TIMEOUT_MS: 5000
} as const;

// Use in queries
const items = await prisma.item.findMany({
  take: QUERY_STANDARDS.STANDARD_PAGE_SIZE,
  // ...
});
```

**Verification:**
```bash
# Re-run audit - should show 0 high-severity violations
node scripts/audit-unbounded-queries.mjs --fail-on-violations
```

---

### PHASE 5: Concurrent User Load Testing

#### ✅ Infrastructure Complete

**Created Tests:**
- [`tests/load/public-traffic-spike.k6.js`](tests/load/public-traffic-spike.k6.js) - 1000 concurrent public users
- [`tests/load/learner-concurrent-sessions.k6.js`](tests/load/learner-concurrent-sessions.k6.js) - 500 concurrent learners

#### 🚀 Execution Steps

**Step 1: Install k6**
```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
choco install k6
```

**Step 2: Run Public Traffic Test**
```bash
# Local test
BASE_URL=http://localhost:3000 k6 run tests/load/public-traffic-spike.k6.js

# Production test (careful!)
BASE_URL=https://nursenest.com k6 run tests/load/public-traffic-spike.k6.js
```

**Step 3: Run Learner Concurrency Test**
```bash
BASE_URL=http://localhost:3000 k6 run tests/load/learner-concurrent-sessions.k6.js
```

**Step 4: Create Additional Tests**

**CAT Concurrency:**
```javascript
// tests/load/cat-concurrency.k6.js
// Simulate 100 concurrent CAT sessions
// Test question selection performance
// Test answer submission latency
```

**Flashcard Concurrency:**
```javascript
// tests/load/flashcard-concurrency.k6.js
// Simulate 200 concurrent flashcard sessions
// Test card loading performance
// Test progress tracking
```

**Deployment Under Load:**
```javascript
// tests/load/deployment-under-load.k6.js
// Maintain steady traffic
// Trigger deployment
// Measure disruption window
```

**Step 5: Analyze Results**
```bash
# Results saved to load-test-results.json
cat load-test-results.json | jq '.metrics'

# Look for:
# - TTFB p95 < 500ms
# - Error rate < 1%
# - Cache hit rate > 80%
```

**Step 6: Create Load Test Report**
```markdown
# reports/load-testing/2026-05-25-baseline.md

## Public Traffic Spike
- Peak: 1000 concurrent users
- TTFB p95: 320ms (target: <300ms) ⚠️
- Error rate: 0.3% ✅
- Cache hit rate: 85% ✅

## Bottlenecks Identified
1. Homepage stats API slow under load
2. Blog pagination needs optimization
3. Pathway hub catalog loading heavy

## Action Items
- [ ] Implement homepage stats caching
- [ ] Add blog pagination cursor
- [ ] Deploy catalog snapshots
```

---

### PHASE 6: Deployment Safety Gates

#### ✅ Infrastructure Complete

**Created System:**
- [`.github/workflows/deployment-gates.yml`](.github/workflows/deployment-gates.yml) - CI/CD gates
- [`scripts/audit-public-route-dependencies.mjs`](scripts/audit-public-route-dependencies.mjs) - Dependency tracking
- Integrated all audit scripts

#### 🚀 Execution Steps

**Step 1: Enable GitHub Workflow**
```bash
# Workflow is already in .github/workflows/
# Push to trigger
git add .github/workflows/deployment-gates.yml
git commit -m "Enable deployment safety gates"
git push
```

**Step 2: Configure Branch Protection**

In GitHub repository settings:
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Require status checks:
   - ✅ Architectural Audits
   - ✅ TypeScript Type Check
   - ✅ Production Smoke Tests
4. Require branches to be up to date
5. Save changes

**Step 3: Test Gates Locally**
```bash
# Run all checks
npm run typecheck
node scripts/audit-force-dynamic-count.mjs --fail-on-increase
node scripts/audit-unbounded-queries.mjs --fail-on-violations
node scripts/audit-public-route-dependencies.mjs --fail-on-new

# All should pass before pushing
```

**Step 4: Configure Notifications**

Add to workflow:
```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment gates failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Step 5: Document Deployment Process**
```markdown
# docs/DEPLOYMENT_PROCESS.md

## Pre-Deployment Checklist
1. Run local audits
2. Ensure all tests pass
3. Review force-dynamic count
4. Check for unbounded queries
5. Verify public route dependencies

## Deployment Gates
- Architectural audits must pass
- TypeCheck must pass
- Smoke tests must pass

## If Gates Fail
1. Review GitHub Actions logs
2. Fix violations locally
3. Re-run audits
4. Push fixes
5. Wait for gates to pass
```

---

### PHASE 7: Resiliency & Failsafe Hardening

#### ✅ Infrastructure Complete

**Created System:**
- [`src/lib/marketing/public-route-failsafe.ts`](src/lib/marketing/public-route-failsafe.ts) - Graceful degradation
- [`src/lib/observability/production-alerts.ts`](src/lib/observability/production-alerts.ts) - Alert definitions
- Static fallback data
- Timeout-based fallbacks

#### 🚀 Execution Steps

**Step 1: Integrate Failsafes into Public Routes**

```typescript
// src/app/(marketing)/(public-static)/page.tsx
import { withPublicRouteFallback, PUBLIC_ROUTE_FALLBACKS } from '@/lib/marketing/public-route-failsafe';

export default async function HomePage() {
  // Wrap DB calls with failsafe
  const stats = await withPublicRouteFallback(
    () => getHomeStats(),
    PUBLIC_ROUTE_FALLBACKS.homeStats,
    'home_stats'
  );
  
  return <HomePageContent stats={stats} />;
}
```

**Step 2: Add Timeout Wrappers**

```typescript
// For slow operations
const blogPosts = await withPublicRouteFallbackTimeout(
  () => getBlogPosts(),
  PUBLIC_ROUTE_FALLBACKS.blogPosts,
  'blog_posts',
  3000 // 3 second timeout
);
```

**Step 3: Test Failure Scenarios**

```bash
# Test DB failure
# Temporarily break DB connection
# Verify public routes still render with fallbacks

# Test auth failure
# Disable auth service
# Verify public routes still render

# Test Prisma failure
# Simulate Prisma timeout
# Verify fallbacks activate
```

**Step 4: Configure Alerts**

```typescript
// src/lib/observability/alert-config.ts
import { PRODUCTION_ALERTS, executeAlertAction } from '@/lib/observability/production-alerts';

// Monitor and trigger alerts
export async function checkAlerts(metrics: Metrics) {
  if (metrics.dbTimeouts > PRODUCTION_ALERTS.db_timeout.threshold) {
    await executeAlertAction('db_timeout', { count: metrics.dbTimeouts });
  }
  
  if (metrics.memoryUsage > PRODUCTION_ALERTS.memory_pressure.threshold) {
    await executeAlertAction('memory_pressure', { usage: metrics.memoryUsage });
  }
}
```

**Step 5: Set Up Alert Notifications**

```typescript
// Integrate with Slack/PagerDuty
async function notifyTeam(alert: AlertDefinition, context: any) {
  // Slack
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `🚨 ${alert.name}: ${alert.description}`,
      attachments: [{ text: JSON.stringify(context) }]
    })
  });
  
  // PagerDuty (for critical alerts)
  if (alert.severity === 'critical') {
    await fetch('https://events.pagerduty.com/v2/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routing_key: process.env.PAGERDUTY_KEY,
        event_action: 'trigger',
        payload: {
          summary: alert.name,
          severity: 'critical',
          source: 'nursenest-production'
        }
      })
    });
  }
}
```

---

### PHASE 8: Observability & Production Visibility

#### ✅ Infrastructure Complete

**Created System:**
- [`src/lib/observability/dashboards/public-route-health.ts`](src/lib/observability/dashboards/public-route-health.ts) - Public metrics
- [`src/lib/observability/dashboards/runtime-boundary-violations.ts`](src/lib/observability/dashboards/runtime-boundary-violations.ts) - Boundary tracking

#### 🚀 Execution Steps

**Step 1: Integrate Metrics Collection**

```typescript
// src/middleware.ts or route handlers
import { recordPublicRouteMetrics } from '@/lib/observability/dashboards/public-route-health';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = await next();
  const duration = Date.now() - startTime;
  
  recordPublicRouteMetrics({
    route: request.nextUrl.pathname,
    timestamp: new Date().toISOString(),
    ttfb_p50: duration,
    ttfb_p95: duration,
    ttfb_p99: duration,
    render_duration_ms: duration,
    cache_hit: response.headers.get('x-cache') === 'HIT',
    db_query_count: 0,
    db_query_duration_ms: 0,
    request_count: 1,
    error_count: response.status >= 400 ? 1 : 0,
    error_rate: response.status >= 400 ? 1 : 0
  });
  
  return response;
}
```

**Step 2: Set Up Metrics Storage**

Choose your observability stack:

**Option A: Prometheus + Grafana**
```typescript
// Install prom-client
import { Counter, Histogram, Registry } from 'prom-client';

const register = new Registry();

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route', 'method', 'status'],
  registers: [register]
});

// Expose metrics endpoint
// GET /api/metrics
export async function GET() {
  return new Response(await register.metrics(), {
    headers: { 'Content-Type': register.contentType }
  });
}
```

**Option B: Datadog**
```typescript
import { StatsD } from 'hot-shots';

const statsd = new StatsD({
  host: process.env.DATADOG_HOST,
  port: 8125
});

statsd.histogram('route.ttfb', duration, [`route:${pathname}`]);
```

**Option C: Custom Time-Series DB**
```typescript
// Store in TimescaleDB or InfluxDB
await db.query(`
  INSERT INTO route_metrics (timestamp, route, ttfb, cache_hit)
  VALUES ($1, $2, $3, $4)
`, [new Date(), pathname, ttfb, cacheHit]);
```

**Step 3: Create Grafana Dashboards**

```json
// grafana-dashboards/public-route-health.json
{
  "dashboard": {
    "title": "Public Route Health",
    "panels": [
      {
        "title": "TTFB p95",
        "targets": [{
          "expr": "histogram_quantile(0.95, http_request_duration_ms)"
        }]
      },
      {
        "title": "Cache Hit Rate",
        "targets": [{
          "expr": "rate(cache_hits_total[5m]) / rate(requests_total[5m])"
        }]
      },
      {
        "title": "Force-Dynamic Count",
        "targets": [{
          "expr": "force_dynamic_count"
        }]
      }
    ]
  }
}
```

**Step 4: Set Up Alerting Rules**

```yaml
# prometheus-alerts.yml
groups:
  - name: nursenest_production
    rules:
      - alert: HighTTFB
        expr: histogram_quantile(0.95, http_request_duration_ms) > 500
        for: 5m
        annotations:
          summary: "High TTFB detected"
          
      - alert: LowCacheHitRate
        expr: rate(cache_hits_total[5m]) / rate(requests_total[5m]) < 0.8
        for: 10m
        annotations:
          summary: "Cache hit rate below 80%"
          
      - alert: ForceDynamicRegression
        expr: force_dynamic_count > 220
        annotations:
          summary: "Force-dynamic count exceeded threshold"
```

---

## 📊 Success Metrics Dashboard

### Performance Targets
```
Public Route TTFB p95:     [ ] <300ms (baseline: ~800ms)
Learner Route TTFB p95:    [ ] <500ms (baseline: ~1200ms)
Cache Hit Rate:            [ ] >80%
Force-Dynamic Count:       [ ] <150 (baseline: 212)
```

### Scalability Targets
```
Concurrent Public Users:   [ ] 1000 without degradation
Concurrent Learner Sessions: [ ] 500 without degradation
DB Connection Pool Usage:  [ ] <70%
Memory Usage per Instance: [ ] <2GB
```

### Reliability Targets
```
Public Routes During Auth Failure:  [ ] Operational
Public Routes During DB Degradation: [ ] Operational
Deployment Success Rate:   [ ] >99%
Zero-Downtime Deployments: [ ] Achieved
MTTR:                      [ ] <5 minutes
```

---

## 🗓️ Recommended Sprint Timeline

### Sprint 1 (Week 1-2): Foundation
- [x] Infrastructure complete
- [ ] Run all audits and establish baselines
- [ ] Begin blog route migration to public-static
- [ ] Start force-dynamic classification

### Sprint 2 (Week 3-4): Public Runtime Isolation
- [ ] Complete blog migration
- [ ] Migrate pricing pages
- [ ] Migrate legal/FAQ pages
- [ ] Remove force-dynamic from 20+ routes

### Sprint 3 (Week 5-6): Catalog Optimization
- [ ] Implement catalog snapshots
- [ ] Deploy snapshot caching
- [ ] Integrate into pathway hubs
- [ ] Measure payload improvements

### Sprint 4 (Week 7-8): Learner Hardening
- [ ] Fix all high-severity unbounded queries
- [ ] Implement cursor pagination in flashcards
- [ ] Implement cursor pagination in CAT
- [ ] Defer optional learner systems

### Sprint 5 (Week 9-10): Load Testing & Gates
- [ ] Run all load tests
- [ ] Analyze bottlenecks
- [ ] Enable deployment gates
- [ ] Configure alerts

---

## 🚀 Quick Start Commands

```bash
# 1. Run all audits
node scripts/audit-force-dynamic-count.mjs --verbose
node scripts/audit-unbounded-queries.mjs --verbose
node scripts/audit-public-route-dependencies.mjs --verbose

# 2. Check current status
npm run typecheck
npm test

# 3. Run load tests (requires k6)
k6 run tests/load/public-traffic-spike.k6.js
k6 run tests/load/learner-concurrent-sessions.k6.js

# 4. Verify deployment gates
npm run typecheck
node scripts/audit-force-dynamic-count.mjs --fail-on-increase
node scripts/audit-unbounded-queries.mjs --fail-on-violations
node scripts/audit-public-route-dependencies.mjs --fail-on-new
```

---

## 📚 Key Resources

- **Blueprint**: Production Hardening Execution Blueprint (this document's source)
- **Plan**: [`plans/production-hardening-phase-deployment-resilience.md`](plans/production-hardening-phase-deployment-resilience.md)
- **Status**: [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md)
- **Existing Infrastructure**:
  - [`src/lib/config/degraded-mode.ts`](src/lib/config/degraded-mode.ts)
  - [`src/lib/config/auto-degraded-mode.ts`](src/lib/config/auto-degraded-mode.ts)
  - [`src/lib/prisma/safe-reads.ts`](src/lib/prisma/safe-reads.ts)
  - [`src/lib/http/rate-limit-unified.ts`](src/lib/http/rate-limit-unified.ts)
  - [`src/lib/server/circuit-breaker.ts`](src/lib/server/circuit-breaker.ts)

---

## ✅ Final Implementation Principle

**This initiative succeeds by:**
- ✅ Aggressively isolating public delivery from learner runtime volatility
- ✅ Minimizing request-time rendering
- ✅ Bounding all expensive operations
- ✅ Validating concurrency behavior continuously
- ✅ Preventing regressions automatically
- ✅ Maintaining incremental production-safe evolution

**It does NOT succeed through:**
- ❌ Large-scale rewrites
- ❌ Framework churn
- ❌ Architectural resets
- ❌ Feature-first prioritization
- ❌ Runtime coupling reintroduction

---

**Status**: Ready for execution. All infrastructure is in place. Begin with Sprint 1.