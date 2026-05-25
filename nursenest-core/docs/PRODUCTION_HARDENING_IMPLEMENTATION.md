# Production Hardening Implementation Guide

This guide provides step-by-step instructions for implementing the production hardening blueprint.

## Overview

The production hardening initiative is a **salvage/refactor stabilization program** focused on:

- Runtime isolation between public and learner systems
- Scalability hardening through query optimization
- Deployment resilience via static generation
- Concurrency validation and load testing
- Regression prevention through automated gates

## Quick Start

### 1. Run Initial Audits

```bash
# Check runtime boundaries
node scripts/audit-public-runtime.mjs

# Check force-dynamic budget
node scripts/audit-force-dynamic.mjs

# Check for unbounded queries
node scripts/audit-unbounded-queries.mjs
```

### 2. Review Current State

The project already has:
- ✅ `(public-static)` route group established
- ✅ Static header/footer components
- ✅ ISR configuration in default layout (revalidate = 300)
- ✅ Safe header/cookie wrappers in default layout
- ✅ Runtime boundary enforcement in marketing layout

## Phase 1: Marketing Layout Split & Static Public Runtime

### Objectives

Transform public routes into deployment-safe static shells that survive:
- Auth failures
- DB degradation
- Prisma instability
- Deployment cache invalidation

### Implementation Steps

#### 1.1 Migrate Routes to `(public-static)`

**Priority 1 Routes:**
- `/pricing` → `src/app/(marketing)/(public-static)/pricing/`
- `/legal/*` → `src/app/(marketing)/(public-static)/legal/`
- `/blog` → `src/app/(marketing)/(public-static)/blog/`
- `/about` → `src/app/(marketing)/(public-static)/about/`

**Migration Checklist:**
- [ ] Move route directory to `(public-static)`
- [ ] Remove `force-dynamic` declarations
- [ ] Remove `headers()` and `cookies()` calls
- [ ] Remove Prisma/DB imports
- [ ] Remove auth/session checks
- [ ] Add ISR revalidation if needed
- [ ] Test rendering without DB connection

#### 1.2 Create Client Auth Islands

Auth-aware UI should be moved to client-side islands:

```tsx
// src/components/auth-islands/AuthStatusIsland.tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AuthStatus = dynamic(() => import('./AuthStatus'), {
  ssr: false,
  loading: () => <div className="h-10 w-24 animate-pulse bg-gray-200" />
});

export function AuthStatusIsland() {
  return (
    <Suspense fallback={<div className="h-10 w-24 bg-gray-100" />}>
      <AuthStatus />
    </Suspense>
  );
}
```

**Usage in Static Layouts:**

```tsx
// src/app/(marketing)/(public-static)/layout.tsx
import { AuthStatusIsland } from '@/components/auth-islands/AuthStatusIsland';

export default function PublicStaticLayout({ children }) {
  return (
    <div>
      <header>
        <nav>
          {/* Static navigation */}
        </nav>
        <AuthStatusIsland /> {/* Lazy-loaded, failure-isolated */}
      </header>
      <main>{children}</main>
    </div>
  );
}
```

#### 1.3 Verify Runtime Boundaries

```bash
# Should pass with no violations
node scripts/audit-public-runtime.mjs
```

## Phase 2: Force-Dynamic Burn-Down

### Current State
- **Current:** 212 declarations
- **Target:** <150 declarations
- **Critical:** 200 (do not exceed)

### Strategy

#### 2.1 Generate Classification Report

```bash
node scripts/audit-force-dynamic.mjs
```

This creates `reports/force-dynamic-audit.json` with classifications:
- `required`: Legitimately needs request-time rendering
- `convertToISR`: Can use ISR with revalidation
- `convertToStatic`: Can be fully static
- `convertToClientIsland`: Move auth logic to client

#### 2.2 Conversion Patterns

**Convert to ISR:**

```tsx
// Before
export const dynamic = 'force-dynamic';

// After
export const revalidate = 3600; // 1 hour
// Remove force-dynamic
```

**Convert to Static:**

```tsx
// Before
export const dynamic = 'force-dynamic';

// After
export async function generateStaticParams() {
  return [/* static params */];
}
// Remove force-dynamic
```

**Convert to Client Island:**

Move auth-dependent logic to client components with Suspense boundaries.

#### 2.3 Track Progress

```bash
# Check current count
node scripts/audit-force-dynamic.mjs

# Should show progress toward <150 target
```

## Phase 3: Public Hub & Catalog Optimization

### Objectives

- <100KB initial payload
- <300ms p95 TTFB
- >80% cache hit ratio

### Implementation Steps

#### 3.1 Precompute Catalog Indexes

```bash
# Create build-time script
node scripts/build-pathway-indexes.mjs
```

Generate lightweight metadata maps instead of hydrating full content.

#### 3.2 Add ISR to Hubs

```tsx
// src/app/(marketing)/(public-static)/rn/page.tsx
export const revalidate = 1800; // 30 minutes

export default async function RNHub() {
  // Use precomputed indexes
  const pathways = await loadPrecomputedPathways('rn');
  
  return <HubView pathways={pathways} />;
}
```

#### 3.3 Implement Static Fallbacks

Ensure hubs render without DB:

```tsx
import { safeDbQuery } from '@/server/resilience';

const pathways = await safeDbQuery(
  () => db.pathway.findMany({ take: 50 }),
  {
    fallback: [], // Empty array if DB fails
    timeout: 3000,
  }
);
```

## Phase 4: Learner Delivery Hardening

### Query Standards

All learner queries MUST use standards from `src/server/db/query-standards/`:

```tsx
import { 
  enforceTakeLimit, 
  LEARNER_QUERY_LIMITS 
} from '@/server/db/query-standards';

// Before (FORBIDDEN)
const questions = await db.question.findMany({
  where: { pathwayId },
  include: { /* deep nesting */ }
});

// After (REQUIRED)
const questions = await db.question.findMany(
  enforceTakeLimit({
    where: { pathwayId },
    take: LEARNER_QUERY_LIMITS.questions,
  })
);
```

### Audit Queries

```bash
# Find unbounded queries
node scripts/audit-unbounded-queries.mjs
```

### Deferred Loading Pattern

```tsx
// Initial render: minimal data
export default async function LearnerDashboard() {
  const session = await getSession();
  const currentModule = await getCurrentModule(session.userId);
  
  return (
    <div>
      <CurrentModuleView module={currentModule} />
      
      {/* Deferred, optional systems */}
      <Suspense fallback={<Skeleton />}>
        <RecommendationsIsland userId={session.userId} />
      </Suspense>
      
      <Suspense fallback={<Skeleton />}>
        <AnalyticsIsland userId={session.userId} />
      </Suspense>
    </div>
  );
}
```

## Phase 5: Load Testing

### Setup k6

```bash
# Install k6
brew install k6  # macOS
# or download from k6.io

# Run public traffic test
k6 run load-tests/k6/public-traffic-spike.js

# Run learner concurrency test
k6 run load-tests/k6/learner-concurrency.js
```

### Setup Playwright Concurrency Tests

```bash
# Run concurrency validation
npx playwright test --config=playwright.concurrency.config.ts
```

### Target Metrics

- **Public:** 1000 concurrent users, stable cache hit ratio
- **Learner:** 500 concurrent sessions, bounded memory growth
- **Infrastructure:** DB pool <70%, memory <2GB per instance

## Phase 6: Deployment Safety Gates

### GitHub Actions Workflow

The deployment gates workflow (`.github/workflows/deployment-gates.yml`) runs on every PR and blocks merge if:

- TypeScript errors exist
- Runtime boundary violations detected
- Force-dynamic budget exceeded
- Unbounded queries found
- Lint errors exist
- Smoke tests fail
- Build fails

### Local Pre-Push Checks

```bash
# Run all checks locally before pushing
npm run typecheck
node scripts/audit-public-runtime.mjs
node scripts/audit-force-dynamic.mjs
node scripts/audit-unbounded-queries.mjs
npm run lint
npm run build
```

## Phase 7: Resilience & Degraded-Mode

### Using Resilience Utilities

```tsx
import { 
  safeOptionalCall, 
  withTimeout,
  withCircuitBreaker 
} from '@/server/resilience';

// Optional system with timeout
const recommendations = await safeOptionalCall(
  () => getRecommendations(userId),
  {
    timeout: 2000,
    fallback: [],
    onError: (err) => console.error('Recommendations failed:', err)
  }
);

// Critical system with circuit breaker
const userProfile = await withCircuitBreaker(
  'user-profile',
  () => db.user.findUnique({ where: { id: userId } }),
  () => ({ id: userId, name: 'User' }) // Fallback
);
```

### Degraded Response Pattern

```tsx
import { createDegradedResponse } from '@/server/resilience';

export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(createSuccessResponse(data));
  } catch (error) {
    return Response.json(
      createDegradedResponse(null, 'Service temporarily unavailable'),
      { status: 200 } // Still 200, but degraded
    );
  }
}
```

## Phase 8: Observability

### Key Metrics to Track

**Public Runtime:**
- TTFB (p50, p95, p99)
- Cache hit ratio
- Render duration
- Static fallback usage

**Learner Runtime:**
- Query duration
- Payload size
- Session concurrency
- Recommendation latency

**Infrastructure:**
- Memory usage
- CPU usage
- Prisma pool utilization
- Deployment stability

### Performance Budgets

See `config/performance-budgets.json` for enforced limits.

## Success Criteria

### Performance
- ✅ Public p95 TTFB <300ms
- ✅ Learner p95 TTFB <500ms
- ✅ Cache hit ratio >80%

### Scalability
- ✅ 1000 concurrent public users
- ✅ 500 learner sessions
- ✅ Predictable request cost under load

### Reliability
- ✅ Deployment success rate >99%
- ✅ Public routes survive learner instability
- ✅ Route failures remain isolated
- ✅ Degraded-mode behavior graceful

### Architecture
- ✅ Force-dynamic count <150
- ✅ Public runtime fully static-safe
- ✅ No request-bound public shell rendering
- ✅ Bounded learner runtime operations
- ✅ Automated regression enforcement operational

## Rollback Safety

Every phase must:
- Preserve production stability
- Remain deployable independently
- Include regression validation
- Include rollback safety

If issues arise, revert the specific change and investigate before re-attempting.

## Getting Help

- Review `ARCHITECTURE_GUARDRAILS.md` for architectural principles
- Check `IMPLEMENTATION_STATUS.md` for current progress
- Run audit scripts to identify issues
- Review performance budgets in `config/performance-budgets.json`
