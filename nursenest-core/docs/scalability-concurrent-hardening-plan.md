# Scalability & Concurrent-User Hardening Plan

**Objective:** Transform the platform from "high request-cost dynamic monolith" into "cache-efficient, horizontally scalable, isolated runtime architecture."

**Date:** 2026-05-25
**Status:** IN PROGRESS

---

## Baseline Assessment (Completed)

### Current Architecture State

✅ **Stateless Foundation:**
- JWT sessions (no server-side session store)
- Postgres-backed rate limiting
- DO Spaces for assets
- Route isolation: (marketing), (app), (admin), (runtime)

✅ **Initial Stabilization Complete:**
- SessionProvider crash isolation
- Public fail-open blog fallback
- Partial ISR/static conversion
- Reduced learner shell optional runtime work
- Degraded-mode protections
- Reduced force-dynamic count
- Route integrity testing
- Hydration auditing

⚠️ **Known Cost Hotspots:**
- Homepage dynamic rendering with DB aggregations
- Learner dashboard heavy initial loads
- Question bank large payload serialization
- No systematic per-request cost measurement
- Limited route-level performance instrumentation

---

## Phase 1: Reduce Per-Request Server Cost

### Objectives
- Measure TTFB, DB query count, memory allocation, payload size
- Identify routes with repeated DB reads, excessive rendering
- Target: public routes cheap enough for traffic spikes

### Implementation Tasks

#### 1.1 Performance Instrumentation
- [ ] Create route performance profiler middleware
- [ ] Add per-request metrics collection
- [ ] Implement DB query counting per request
- [ ] Track memory allocation patterns
- [ ] Measure serialization costs
- [ ] Create performance dashboard/reporting

#### 1.2 Route Cost Audit
- [ ] Audit homepage (`/`) - currently force-dynamic with stats
- [ ] Audit blog routes (`/blog/*`)
- [ ] Audit pathway hubs (`/canada/rn/nclex-rn`)
- [ ] Audit pricing page (`/pricing`)
- [ ] Audit learner dashboard (`/app`)
- [ ] Audit practice test routes (`/app/practice-tests`)
- [ ] Audit flashcard routes (`/app/flashcards`)

#### 1.3 Database Query Optimization
- [ ] Eliminate N+1 queries in hot paths
- [ ] Add selective projections (avoid SELECT *)
- [ ] Implement query result caching where safe
- [ ] Review Prisma query plans
- [ ] Add missing indexes for hot queries

#### 1.4 Serialization Optimization
- [ ] Audit large JSON payloads in learner routes
- [ ] Reduce lesson catalog sizes
- [ ] Implement pagination for large lists
- [ ] Stream large responses where possible
- [ ] Compress API responses appropriately

---

## Phase 2: Public Route CDN/ISR Optimization

### Objectives
- Maximize CDN cache hit rates for public traffic
- Implement ISR for semi-static content
- Reduce origin compute for marketing pages

### Implementation Tasks

#### 2.1 ISR Implementation
- [ ] Convert homepage to ISR with 1-hour revalidation
- [ ] Implement ISR for blog posts
- [ ] Add ISR for pathway hub pages
- [ ] Create lightweight pathway indexes
- [ ] Implement static snapshots for pricing

#### 2.2 CDN Optimization
- [ ] Audit current cache headers effectiveness
- [ ] Implement edge caching for public APIs
- [ ] Add CDN-Cache-Control directives
- [ ] Create cache-friendly public layouts
- [ ] Implement smart cache invalidation

#### 2.3 Static Generation
- [ ] Identify fully static marketing pages
- [ ] Generate static shells at build time
- [ ] Implement incremental static regeneration
- [ ] Create fallback static content
- [ ] Precompute pathway metadata

---

## Phase 3: Learner Traffic Isolation

### Objectives
- Prevent learner spikes from affecting public pages
- Isolate traffic by runtime boundaries
- Implement graceful degradation per boundary

### Implementation Tasks

#### 3.1 Traffic Isolation Architecture
- [ ] Audit (app) route group isolation
- [ ] Verify no marketing→learner imports
- [ ] Audit (admin) route group isolation
- [ ] Document traffic flow boundaries
- [ ] Create isolation violation tests

#### 3.2 Learner Delivery Optimization
- [ ] Convert to session-driven APIs
- [ ] Implement incremental loading patterns
- [ ] Add cursor pagination everywhere
- [ ] Create lightweight question delivery
- [ ] Defer analytics/recommendations

#### 3.3 Eliminate Heavy Patterns
- [ ] Find and fix `take: 5000` queries
- [ ] Reduce SSR learner payloads
- [ ] Remove blocking recommendation engines
- [ ] Defer heavy computations
- [ ] Implement lazy loading for secondary content

---

## Phase 4: Database Scalability Hardening

### Objectives
- Eliminate DB bottlenecks under concurrency
- Optimize connection pooling
- Prevent query amplification

### Implementation Tasks

#### 4.1 Connection Management
- [ ] Audit current connection pool settings
- [ ] Implement PgBouncer if needed
- [ ] Optimize connection limits per instance
- [ ] Add connection exhaustion monitoring
- [ ] Test connection behavior under load

#### 4.2 Query Optimization
- [ ] Eliminate N+1 patterns everywhere
- [ ] Add selective projections throughout
- [ ] Implement pagination on all lists
- [ ] Add query batching where applicable
- [ ] Create query performance regression tests

#### 4.3 Index Audit
- [ ] Audit indexes for userId queries
- [ ] Audit indexes for pathwayId queries
- [ ] Audit indexes for deckId queries
- [ ] Audit indexes for examId queries
- [ ] Audit indexes for sessionId queries
- [ ] Add indexes for progress tracking
- [ ] Add indexes for subscription checks
- [ ] Validate index usage with EXPLAIN

#### 4.4 Caching Strategy
- [ ] Implement safe query result caching
- [ ] Add cache layers for immutable data
- [ ] Create cache invalidation strategy
- [ ] Document what's cacheable vs not
- [ ] Monitor cache hit rates

---

## Phase 5: Deployment Resilience Under Traffic

### Objectives
- Ensure deployments don't destabilize live traffic
- Implement rolling deployment safety
- Add post-deploy validation

### Implementation Tasks

#### 5.1 Deployment Process
- [ ] Implement rolling deployment strategy
- [ ] Add deployment health scoring
- [ ] Create automatic rollback triggers
- [ ] Add smoke tests post-deploy
- [ ] Implement deployment canaries

#### 5.2 Pre-Deploy Validation
- [ ] Verify public route rendering
- [ ] Verify learner route rendering
- [ ] Check hydration safety
- [ ] Detect force-dynamic regressions
- [ ] Validate runtime dependency changes
- [ ] Run performance regression suite

#### 5.3 Deployment Monitoring
- [ ] Add route health monitoring
- [ ] Monitor error rates during deploy
- [ ] Track latency changes during deploy
- [ ] Monitor cache hit rates
- [ ] Alert on deployment anomalies

---

## Phase 6: Memory & Payload Optimization

### Objectives
- Reduce memory footprint per request
- Minimize client hydration payloads
- Optimize large content delivery

### Implementation Tasks

#### 6.1 Payload Audit
- [ ] Audit large lesson catalogs
- [ ] Audit pathway bundles
- [ ] Audit serialized props sizes
- [ ] Audit client hydration sizes
- [ ] Measure first paint payloads

#### 6.2 Content Optimization
- [ ] Implement lightweight indexes
- [ ] Add lazy content loading
- [ ] Create chunked imports
- [ ] Implement streamed responses
- [ ] Reduce client hydration data

#### 6.3 Server-Only Content
- [ ] Ensure server-only content stays server-only
- [ ] Minimize client bundle sizes
- [ ] Keep first paint lightweight
- [ ] Remove unnecessary client-side data
- [ ] Optimize component splitting

---

## Phase 7: Failsafe & Degraded-Mode Hardening

### Objectives
- Expand resilience for high-traffic conditions
- Ensure graceful degradation
- Protect against cascading failures

### Implementation Tasks

#### 7.1 Degraded Mode Expansion
- [ ] Audit current degraded mode triggers
- [ ] Add DB slowdown protection
- [ ] Ensure optional systems fail independently
- [ ] Test static fallback content
- [ ] Make recommendations non-blocking

#### 7.2 Runtime Protections
- [ ] Add DB timeout handling
- [ ] Implement memory pressure detection
- [ ] Add hydration failure recovery
- [ ] Protect against catalog-read spikes
- [ ] Add route render stall detection
- [ ] Implement Prisma saturation handling

#### 7.3 Circuit Breakers
- [ ] Implement circuit breakers for external services
- [ ] Add circuit breakers for heavy DB operations
- [ ] Create fallback chains
- [ ] Test failure scenarios
- [ ] Document degradation behavior

---

## Phase 8: Load Testing & Concurrency Validation

### Objectives
- Validate concurrent user handling
- Test deployment stability under load
- Measure scalability limits

### Implementation Tasks

#### 8.1 Load Testing Infrastructure
- [ ] Create realistic user simulation scenarios
- [ ] Implement public traffic spike tests
- [ ] Create learner concurrent session tests
- [ ] Add deployment-during-traffic tests
- [ ] Build sustained load scenarios

#### 8.2 Concurrency Tests
- [ ] Test public traffic spikes
- [ ] Test learner exam sessions
- [ ] Test flashcard concurrent usage
- [ ] Test simultaneous auth activity
- [ ] Test CAT concurrent sessions

#### 8.3 Performance Measurement
- [ ] Measure route latency under load
- [ ] Monitor DB saturation points
- [ ] Track memory growth patterns
- [ ] Measure server CPU usage
- [ ] Monitor hydration timing
- [ ] Measure cache effectiveness
- [ ] Test failure recovery

#### 8.4 Scalability Validation
- [ ] Confirm horizontal scaling works
- [ ] Test autoscaling triggers
- [ ] Validate load distribution
- [ ] Measure per-instance limits
- [ ] Document capacity planning

---

## Success Criteria

### Performance Targets
- [ ] Public routes: TTFB < 200ms (p95)
- [ ] Learner routes: TTFB < 500ms (p95)
- [ ] DB query count: < 10 per public route
- [ ] DB query count: < 25 per learner route
- [ ] CDN cache hit rate: > 80% for public content
- [ ] ISR cache hit rate: > 90% for blog/hubs
- [ ] Memory per request: < 50MB average
- [ ] Payload size: < 500KB for initial loads

### Scalability Targets
- [ ] Handle 100 concurrent users without degradation
- [ ] Handle 500 concurrent users with <10% latency increase
- [ ] Handle 1000+ concurrent users with degraded mode active
- [ ] Deploy during 100 concurrent users with <1% errors
- [ ] Autoscale 2→3 instances under load
- [ ] Maintain <1% error rate under all conditions

### Architecture Targets
- [ ] Zero marketing→learner import violations
- [ ] Zero learner→marketing import violations
- [ ] 100% route isolation compliance
- [ ] All public routes ISR or static capable
- [ ] All learner routes properly paginated
- [ ] Zero `take: 5000` patterns in production
- [ ] All hot paths have appropriate indexes

---

## Risk Management

### High-Risk Changes
1. Homepage ISR conversion (traffic volume)
2. Database connection pool changes
3. Learner dashboard payload reduction
4. Cache header modifications

### Mitigation Strategies
- Feature flags for major changes
- Gradual rollout with monitoring
- Immediate rollback capability
- Extensive pre-deploy testing
- Load testing in staging
- Real-time monitoring during rollout

### Rollback Procedures
1. Feature flag toggles for new behavior
2. Database migration rollback scripts
3. Deployment rollback via DO UI
4. Cache invalidation procedures
5. Emergency degraded mode activation

---

## Timeline

### Week 1: Assessment & Tooling
- Create performance instrumentation
- Build route cost profiler
- Set up load testing infrastructure
- Create monitoring dashboards

### Week 2-3: Public Route Optimization (Phases 1-2)
- Implement ISR for marketing pages
- Optimize CDN caching
- Reduce DB queries in hot paths
- Measure and validate improvements

### Week 3-4: Learner Isolation & DB Optimization (Phases 3-4)
- Enforce traffic isolation
- Optimize database queries
- Add missing indexes
- Implement pagination everywhere

### Week 4-5: Deployment & Memory Optimization (Phases 5-6)
- Implement deployment safety
- Reduce payload sizes
- Optimize memory usage
- Add deployment automation

### Week 5-6: Resilience & Testing (Phases 7-8)
- Expand degraded mode
- Add circuit breakers
- Run comprehensive load tests
- Validate all success criteria

---

## Monitoring & Validation

### Key Metrics to Track
- Request latency (p50, p95, p99)
- DB query count per route
- Memory usage per request
- Payload sizes
- Cache hit rates
- Error rates
- Concurrent user count
- Instance CPU/memory
- Database connection pool usage
- Slow query frequency

### Alerting Thresholds
- TTFB p95 > 1000ms: Warning
- TTFB p95 > 2000ms: Critical
- Error rate > 1%: Warning
- Error rate > 5%: Critical
- DB connections > 80% pool: Warning
- DB connections > 90% pool: Critical
- Memory growth > 200MB/hour: Warning
- Cache hit rate < 70%: Warning

---

## Documentation Updates Required

- [ ] Update `backend-scale-architecture.md` with new patterns
- [ ] Document ISR strategy
- [ ] Document cache invalidation procedures
- [ ] Update deployment runbooks
- [ ] Create load testing guide
- [ ] Document performance budgets
- [ ] Update monitoring playbooks
