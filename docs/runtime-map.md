# NurseNest Runtime Architecture Map

This document exists to improve source-tree discoverability for AI-assisted development, runtime debugging, and architectural audits.

---

# Core App Runtime

## Root Layout
- `nursenest-core/src/app/layout.tsx`

## Global Styles
- `nursenest-core/src/app/globals.css`
- `nursenest-core/src/app/styles/learner/learner-global.css`

---

# Learner Runtime

## Learner Shell
TODO: Add learner shell entrypoints

## Auth + Session Runtime
TODO: Add canonical auth/session runtime files

## Canonical Learner Access
Known chain:
- `getUserAccess`
- `accessScopeFromUserAccess`
- `toCanonicalLearnerAccess`

Referenced in entitlement integrity reporting.

---

# Flashcards Runtime

Add all flashcard runtime entrypoints here.

Suggested files:
- flashcards page route
- flashcard runtime component
- flashcard session hooks
- flashcard API routes
- flashcard provider/context
- flashcard loaders
- flashcard entitlement gates

Example structure:
- `src/app/flashcards/page.tsx`
- `src/features/flashcards/FlashcardRuntime.tsx`
- `src/hooks/useFlashcardSession.ts`
- `src/app/api/flashcards/start/route.ts`

---

# Exam Runtime

Add:
- CAT runtime
- Practice exam runtime
- Session bootstrap
- Timer systems
- Navigator systems
- Question hydration

---

# API Runtime

Document:
- learner APIs
- entitlement APIs
- session APIs
- flashcard APIs
- exam APIs
- billing APIs

---

# Billing + Entitlements

Known canonical access notes:
- Website checkout → `/app`
- Same NextAuth session + Postgres mirror
- Premium APIs use `requireSubscriberSession`

Integrity reports:
- drift detection
- Stripe reconciliation
- canonical learner access mapping

---

# Runtime Failure Investigation Notes

Current suspected runtime instability:
- flashcards load failure after clicking Start
- likely session/bootstrap mismatch
- probable legacy entitlement shape assumptions
- possible pathway/session context mismatch

Potential investigation targets:
- `requireSubscriberSession()`
- flashcard session bootstrap
- canonical learner access migration
- learner provider tree
- pathway context runtime

---

# AI Collaboration Guidance

When refactoring runtime systems:
- update this file
- document entrypoints
- document provider trees
- document auth boundaries
- document runtime ownership

This dramatically improves:
- debugging
- onboarding
- AI-assisted maintenance
- architectural consistency
- runtime tracing
