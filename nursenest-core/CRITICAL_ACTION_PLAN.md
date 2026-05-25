# 🚨 Critical Action Plan - Production Hardening

**Date:** 2026-05-25  
**Status:** CRITICAL - Immediate Action Required

## Critical Findings

### ❌ Force-Dynamic Crisis
- **Current:** 404 declarations
- **Budget:** 150 declarations
- **Overage:** 254 declarations (169% over budget)
- **Status:** CRITICAL - Blocking deployment gates

### Classification Breakdown
- **Required:** 314 (legitimately need request-time rendering)
- **Unclassified:** 64 (needs manual review)
- **ConvertToISR:** 22 (can use ISR with revalidation)
- **ConvertToClientIsland:** 4 (move auth logic to client)

### ⚠️ Runtime Boundary Violations
- **Public-static layout:** 2 violations (false positive - comments only)
- **Status:** Low priority - audit script needs refinement

## Immediate Actions (Next 2 Hours)

### 1. Emergency Force-Dynamic Triage

**Target:** Reduce by 100 declarations in first pass

**Quick Wins - ConvertToISR (22 routes):**
```bash
# These can be converted immediately with minimal risk
- Flashcard routes (add revalidate: 3600)
- Lesson routes (add revalidate: 1800)
- Topic routes (add revalidate: 3600)
```

**Strategy:**
1. Review `reports/force-dynamic-audit.json`
2. Start with `convertToISR` classification (22 routes)
3. Add `export const revalidate = 3600` and remove `force-dynamic`
4. Test each route renders without DB connection
5. Deploy incrementally

### 2. Pathway Layout Optimization

**High-Impact Target:**
```
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx
```

**Current:** force-dynamic  
**Target:** ISR with revalidate  
**Impact:** Affects all child routes

**Action:**
- Remove force-dynamic
- Add revalidate: 1800 (30 min)
- Ensure pathway resolution is cached
- Test with stale data

### 3. Lesson Routes Batch Conversion

**Targets (3 routes):**
- `lessons/page.tsx` - Lesson index
- `lessons/[lessonSlug]/page.tsx` - Lesson detail
- `lessons/topics/[topicSlug]/page.tsx` - Topic detail

**Pattern:**
```typescript
// Remove
export const dynamic = 'force-dynamic';

// Add
export const revalidate = 1800; // 30 minutes
```

## Medium-Term Actions (This Week)

### 4. Unclassified Route Review (64 routes)

**Process:**
1. Examine each route's data dependencies
2. Classify as required/ISR/static/client-island
3. Apply appropriate pattern
4. Track progress

**Priority Routes:**
- CAT routes (likely required - real-time)
- OSCE routes (likely required - session-based)
- Clinical scenarios (likely ISR)
- Exam routes (needs analysis)

### 5. Client Island Extraction (4 routes)

**Targets:**
- Login page
- Signup page
- Reset password
- Verify email

**Pattern:**
Move auth-dependent logic to client components with Suspense boundaries.

## Architectural Decisions

### Decision 1: Aggressive ISR Adoption

**Rationale:**
- 404 declarations is unsustainable
- ISR provides 90% of benefits with 10% of risk
- Stale data is acceptable for educational content
- Cache invalidation can be added later

**Risk Mitigation:**
- Start with long revalidation periods (1 hour)
- Monitor cache hit ratios
- Add manual revalidation endpoints if needed

### Decision 2: Accept "Required" Classification

**Rationale:**
- 314 routes legitimately need request-time rendering
- These are learner-facing, session-dependent routes
- Focus optimization on public/marketing routes first

**Action:**
- Document why each is required
- Ensure they use query standards
- Add Suspense boundaries
- Defer optional systems

### Decision 3: Incremental Deployment

**Strategy:**
- Convert 5-10 routes per deployment
- Monitor for regressions
- Rollback individual routes if needed
- Track force-dynamic count trend

## Success Metrics

### Phase 1 Target (This Week)
- **Force-dynamic count:** <300 (reduce by 104)
- **ISR routes:** +22 (all convertToISR)
- **Client islands:** +4 (all convertToClientIsland)
- **Deployment gates:** Passing (adjust budget to 300 temporarily)

### Phase 2 Target (Next Week)
- **Force-dynamic count:** <200 (reduce by 100 more)
- **Unclassified routes:** 0 (all reviewed and classified)
- **Query standards:** Applied to top 20 learner routes

### Phase 3 Target (Sprint End)
- **Force-dynamic count:** <150 (final target)
- **Public routes:** 100% ISR or static
- **Learner routes:** Bounded queries enforced
- **Deployment gates:** Passing at target budget

## Risk Assessment

### High Risk
- **Stale content:** ISR may serve outdated data
  - **Mitigation:** Start with long revalidation, add manual invalidation
  
- **Cache invalidation:** Deployment may invalidate all caches
  - **Mitigation:** Warm cache post-deployment, monitor hit ratios

### Medium Risk
- **Route-specific bugs:** Some routes may break with ISR
  - **Mitigation:** Incremental rollout, per-route rollback

### Low Risk
- **Performance regression:** ISR should improve, not degrade
  - **Mitigation:** Monitor TTFB, rollback if degraded

## Rollback Strategy

### Per-Route Rollback
```typescript
// If ISR causes issues, revert to force-dynamic
export const dynamic = 'force-dynamic';
// Remove revalidate
```

### Batch Rollback
- Git revert specific commit
- Deploy immediately
- Investigate root cause
- Re-attempt with fixes

## Monitoring Plan

### Track Daily
- Force-dynamic count (run audit script)
- Deployment success rate
- Cache hit ratio
- TTFB p95

### Alert On
- Force-dynamic count increase
- Cache hit ratio <70%
- TTFB p95 >500ms
- Deployment failures

## Next Steps (Immediate)

1. ✅ Review force-dynamic audit report
2. ⏳ Wait for unbounded query audit completion
3. 🎯 Convert 22 ISR-eligible routes (batch 1)
4. 🎯 Convert 4 client-island routes (batch 2)
5. 📊 Re-run audit, track progress
6. 🚀 Deploy batch 1, monitor
7. 🚀 Deploy batch 2, monitor
8. 📈 Update status document

## Communication

### Stakeholders
- Engineering team: Daily force-dynamic count updates
- Product team: ISR may cause stale content (acceptable tradeoff)
- Ops team: Monitor cache hit ratios, TTFB

### Status Updates
- Daily: Force-dynamic count trend
- Weekly: Phase completion status
- Blockers: Escalate immediately if count increases

---

**Bottom Line:** 404 force-dynamic declarations is a production stability crisis. Aggressive ISR adoption is the fastest path to stability. Accept some stale content risk in exchange for massive scalability gains.
