# Scalability & Concurrent-User Hardening Roadmap

**Priority Order (Non-Negotiable):**
1. Stability
2. Isolation  
3. Bounded Operations
4. Cacheability
5. Deployment Safety
6. Scalability
7. Optimization Polish

**Date:** 2026-05-25  
**Status:** IN PROGRESS

---

## 🔴 PHASE 1: STABILITY (Days 1-3)

**Objective:** Prevent cascading failures, ensure fail-safe defaults

### 1.1 Emergency Force-Dynamic Reduction
**Priority:** CRITICAL  
**Impact:** Blocks deployment gates, affects build performance

**Actions:**
- [ ] Convert 22 ISR-eligible routes (flashcards, lessons, topics)
- [ ] Extract 4 client-island routes (login, signup, reset, verify)
- [ ] Review 64 unclassified routes for appropriate strategy
- [ ] Target: <300 force-dynamic declarations (from 404)

**Success Criteria:**
- ✅ Deployment gates passing
- ✅ Build time <10 minutes
- ✅ No new force-dynamic additions

### 1.2 Critical Route Stability
**Priority:** HIGH  
**Impact:** Prevents homepage/blog outages

**Actions:**
- [ ] Audit homepage DB dependencies
- [ ] Add timeout guards to all DB aggregations
- [ ] Implement fail-safe fallbacks for stats
- [ ] Add emergency static snapshot generation

**Pattern:**
```typescript
// Every marketing route should have:
try {
  const data = await withTimeout(fetchData(), 5000);
  return render(data);
} catch (error) {
  return renderStaticFallback();
}
```

### 1.3 Session Provider Isolation
**Priority:** HIGH  
**Impact:** Prevents auth crashes from affecting marketing

**Actions:**
- [ ] Verify SessionProvider only in (app) layout
- [ ] Remove any SessionProvider from (marketing) layout
- [ ] Add contract tests for layout boundaries
- [ ] Document provider placement rules

---

## 🟠 PHASE 2: ISOLATION (Days 4-6)

**Objective:** Traffic spikes in one area cannot affect other areas

### 2.1 Runtime Boundary Enforcement
**Priority:** HIGH  
**Impact:** Prevents cross-contamination

**Actions:**
- [ ] Create ESLint rule: no (marketing) → (app) imports
- [ ] Create ESLint rule: no (app) → (admin) imports
- [ ] Add pre-commit hook to enforce boundaries
- [ ] Add CI check for boundary violations

**Rule:**
```javascript
// eslint-plugin-local-rules
'no-cross-boundary-imports': {
  '(marketing)/**': {
    cannotImport: ['(app)/**', '(admin)/**']
  },
  '(app)/**': {
    cannotImport: ['(admin)/**']
  }
}
```

### 2.2 Database Connection Isolation
**Priority:** MEDIUM  
**Impact:** Prevents learner spikes from exhausting connections

**Actions:**
- [ ] Document current connection pool settings
- [ ] Calculate max concurrent queries per route type
- [ ] Add connection pool monitoring
- [ ] Create separate read replica config (future)

**Target:**
- Marketing routes: <5 DB queries each
- Learner routes: <25 DB queries each
- Admin routes: no hard limit (low traffic)

### 2.3 API Route Segregation
**Priority:** MEDIUM  
**Impact:** Clear ownership and rate limiting

**Actions:**
- [ ] Audit all `/api/*` routes for classification
- [ ] Apply correct rate limits per category
- [ ] Document which routes are public vs authenticated
- [ ] Add route-level telemetry

---

## 🟡 PHASE 3: BOUNDED OPERATIONS (Days 7-10)

**Objective:** No unbounded queries, pagination everywhere

### 3.1 Query Bounds Enforcement
**Priority:** HIGH  
**Impact:** Prevents memory exhaustion

**Actions:**
- [ ] Run unbounded query audit script
- [ ] Fix all `take: 5000` patterns
- [ ] Fix all missing `take` clauses
- [ ] Add pre-commit check for unbounded queries

**Pattern:**
```typescript
// BAD
const users = await prisma.user.findMany();

// GOOD
const users = await prisma.user.findMany({
  take: 50,
  skip: page * 50,
});
```

### 3.2 API Pagination Standards
**Priority:** HIGH  
**Impact:** Prevents large payload crashes

**Actions:**
- [ ] Create cursor pagination library
- [ ] Audit all list endpoints
- [ ] Add pagination to unpaginated endpoints
- [ ] Document pagination standards

**Standard:**
```typescript
// All list endpoints must:
- Accept cursor or page params
- Return max 100 items
- Include nextCursor/hasMore
- Document total count strategy
```

### 3.3 Payload Size Guards
**Priority:** MEDIUM  
**Impact:** Prevents JSON serialization crashes

**Actions:**
- [ ] Add payload size middleware to API routes
- [ ] Log warnings for responses >1MB
- [ ] Error for responses >5MB
- [ ] Create chunked response helpers

---

## 🟢 PHASE 4: CACHEABILITY (Days 11-15)

**Objective:** Maximize CDN/edge cache hit rates

### 4.1 ISR Conversion (Public Routes)
**Priority:** HIGH (after stability)  
**Impact:** Reduces origin compute by 80%+

**Actions:**
- [ ] Convert homepage to ISR (revalidate: 3600)
- [ ] Convert blog routes to ISR (revalidate: 1800)
- [ ] Convert pathway hubs to ISR (revalidate: 3600)
- [ ] Convert pricing to ISR (revalidate: 7200)

**Pattern:**
```typescript
// Remove
export const dynamic = 'force-dynamic';

// Add
export const revalidate = 3600; // 1 hour
```

### 4.2 Cache Header Optimization
**Priority:** MEDIUM  
**Impact:** Improves CDN efficiency

**Actions:**
- [ ] Audit current cache headers
- [ ] Add s-maxage for public routes
- [ ] Add stale-while-revalidate
- [ ] Verify Vary headers are correct

**Target:**
- Public HTML: `s-maxage=3600, stale-while-revalidate=86400`
- Public API: `s-maxage=300, stale-while-revalidate=600`
- Assets: `max-age=31536000, immutable`

### 4.3 Static Generation Strategy
**Priority:** LOW  
**Impact:** Further optimization

**Actions:**
- [ ] Identify fully static marketing pages
- [ ] Generate static shells at build time  
- [ ] Create fallback static content
- [ ] Implement ISR for everything else

---

## 🔵 PHASE 5: DEPLOYMENT SAFETY (Days 16-18)

**Objective:** Deployments don't destabilize live traffic

### 5.1 Deployment Gates
**Priority:** HIGH  
**Impact:** Prevents bad deploys

**Actions:**
- [ ] Add force-dynamic count check (<150)
- [ ] Add unbounded query check (0 violations)
- [ ] Add boundary violation check (0 violations)
- [ ] Add smoke test suite

**Gate Checks:**
```yaml
- Force-dynamic count <150
- No unbounded queries detected
- No boundary violations
- All smoke tests passing
- Build completes <10 min
```

### 5.2 Deployment Process
**Priority:** MEDIUM  
**Impact:** Reduces deployment risk

**Actions:**
- [ ] Document deployment checklist
- [ ] Add pre-deploy validation script
- [ ] Create post-deploy smoke test
- [ ] Document rollback procedure

### 5.3 Monitoring & Alerts
**Priority:** MEDIUM  
**Impact:** Faster incident detection

**Actions:**
- [ ] Add force-dynamic count tracking
- [ ] Add cache hit rate monitoring
- [ ] Add TTFB p95 alerts  
- [ ] Add error rate alerts

---

## 🟣 PHASE 6: SCALABILITY (Days 19-25)

**Objective:** Handle concurrent user spikes gracefully

### 6.1 Database Optimization
**Priority:** HIGH  
**Impact:** Prevents DB bottleneck

**Actions:**
- [ ] Audit missing indexes
- [ ] Add indexes for hot queries (userId, pathwayId, etc)
- [ ] Implement query result caching
- [ ] Add connection pool monitoring

**Hot Paths:**
```sql
-- Add indexes for:
User (userId, role, tier)
Progress (userId, lessonId, completed)
Subscription (userId, status)
ExamSession (userId, status, updatedAt)
FlashcardProgress (userId, nextReviewAt)
```

### 6.2 Memory Optimization
**Priority:** MEDIUM  
**Impact:** Prevents OOM under load

**Actions:**
- [ ] Audit large payload routes
- [ ] Reduce lesson catalog sizes
- [ ] Implement lazy loading
- [ ] Add memory usage monitoring

### 6.3 Load Testing
**Priority:** MEDIUM  
**Impact:** Validates scalability

**Actions:**
- [ ] Create k6 test scenarios
- [ ] Test public traffic spike (1000 RPS)
- [ ] Test learner concurrent sessions (500 users)
- [ ] Test deployment under load

---

## ⚪ PHASE 7: OPTIMIZATION POLISH (Days 26-30)

**Objective:** Fine-tuning and advanced optimizations

### 7.1 Advanced Caching
**Priority:** LOW  
**Impact:** Incremental improvements

**Actions:**
- [ ] Implement query result caching
- [ ] Add Redis layer (if needed)
- [ ] Optimize cache invalidation
- [ ] Add cache warming strategies

### 7.2 Advanced Monitoring
**Priority:** LOW  
**Impact:** Better observability

**Actions:**
- [ ] Implement route performance profiler
- [ ] Add distributed tracing
- [ ] Create performance dashboards
- [ ] Add user experience monitoring

### 7.3 Advanced Optimizations
**Priority:** LOW  
**Impact:** Diminishing returns

**Actions:**
- [ ] Optimize bundle sizes
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Add prefetching strategies

---

## Success Metrics by Phase

### Phase 1: Stability
- ✅ Force-dynamic <300 (from 404)
- ✅ Zero marketing route crashes in 7 days
- ✅ All routes have timeout guards
- ✅ Static fallbacks functional

### Phase 2: Isolation
- ✅ Zero boundary violations
- ✅ ESLint rules enforcing isolation
- ✅ Marketing resilient to learner spikes
- ✅ Connection pools properly sized

### Phase 3: Bounded Operations
- ✅ Zero unbounded queries
- ✅ All list endpoints paginated
- ✅ No payloads >5MB
- ✅ Query standards enforced

### Phase 4: Cacheability
- ✅ Force-dynamic <150 (target)
- ✅ CDN cache hit rate >80%
- ✅ Public routes ISR or static
- ✅ TTFB p95 <200ms (public)

### Phase 5: Deployment Safety
- ✅ Deployment gates passing
- ✅ Zero deployment-caused incidents
- ✅ Rollback time <5 minutes
- ✅ Smoke tests comprehensive

### Phase 6: Scalability
- ✅ Handle 500 concurrent users
- ✅ Handle 1000 RPS public traffic
- ✅ DB query time p95 <100ms
- ✅ Zero connection exhaustion

### Phase 7: Polish
- ✅ TTFB p95 <100ms (public)
- ✅ Bundle size <500KB
- ✅ Performance score >90
- ✅ Full observability

---

## Daily Progress Tracking

### Week 1 (Days 1-7): Stability & Isolation
