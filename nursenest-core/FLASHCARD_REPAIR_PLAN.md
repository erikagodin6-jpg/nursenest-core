# Flashcard System Repair Plan

**Date:** 2026-05-25  
**Status:** 🔧 IN PROGRESS

---

## 🎯 Problem Analysis

### Root Cause Identified ✅

**Symptom:** Clicking flashcards forces unexpected login, then shows "unable to load"

**Root Cause:** 
1. Public ISR flashcard pages (`/flashcards`, `/flashcards/[slug]`) have "Study" buttons
2. Buttons call `startOrResumeSessionAction` server action
3. Action requires `getProtectedRouteSession` → returns null for anonymous users
4. Button still navigates to `/app/flashcards/decks/...` (protected learner route)
5. Protected route redirects anonymous users to `/login`
6. After login, original deep-link lost → "unable to load"

**Files Involved:**
- `src/components/flashcards/flashcard-session-start-button.tsx` - Broken button
- `src/app/actions/flashcards/session-actions.ts` - Requires auth
- `src/app/(marketing)/(default)/flashcards/[slug]/page.tsx` - Uses button
- `src/lib/auth/protected-route-session.ts` - Returns null for anonymous

---

## ✅ Solution Design

### Fix Strategy: Auth-Aware Navigation

**DO:**
- ✅ Check auth state client-side BEFORE calling server action
- ✅ Redirect anonymous users to `/login` with return URL
- ✅ Only call action for authenticated users
- ✅ Preserve ISR/public architecture (no auth on page render)

**DON'T:**
- ❌ Add auth requirements to public ISR pages
- ❌ Remove force-dynamic protections
- ❌ Move flashcards to shared learner runtime
- ❌ Call protected actions from public pages without auth check

### Implementation Plan

#### Step 1: Fix FlashcardSessionStartButton
Create auth-aware version that:
1. Uses `useSession()` to check auth state
2. If not authenticated → redirect to `/login?callbackUrl=...`
3. If authenticated → call action, then navigate

```typescript
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { startOrResumeSessionAction } from "@/app/actions/flashcards/session-actions";

export function FlashcardSessionStartButton({
  deckId,
  isResuming,
  cardCount,
  pathwayId,
}: {
  deckId: string;
  isResuming: boolean;
  cardCount: number;
  pathwayId?: string | null;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    // Auth check BEFORE calling protected action
    if (status === "unauthenticated") {
      const callbackUrl = `/app/flashcards/decks/${encodeURIComponent(deckId)}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (status === "loading") {
      // Still checking auth, wait
      return;
    }

    // Authenticated - proceed with action
    startTransition(async () => {
      const result = await startOrResumeSessionAction(deckId);
      if (result.ok) {
        const qs = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
        router.push(
          `/app/flashcards/decks/${encodeURIComponent(deckId)}/session/${encodeURIComponent(result.data.sessionId)}${qs}`,
        );
      }
    });
  }

  const isLoading = isPending || status === "loading";
  const buttonText = isLoading
    ? "Starting…"
    : status === "unauthenticated"
      ? "Sign in to study"
      : isResuming
        ? "Resume session"
        : `Start session · ${cardCount} cards`;

  return (
    <button
      onClick={handleStart}
      disabled={isLoading || cardCount === 0}
      className="rounded-xl bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {buttonText}
    </button>
  );
}
```

#### Step 2: Verify Public Pages Don't Use This Button

Check if public ISR pages use FlashcardSessionStartButton:
- `/flashcards/page.tsx` → Should NOT use button (links to `/login`)
- `/flashcards/[slug]/page.tsx` → Should NOT use button (links to `/login`)

If they do use it, they need SessionProvider wrapper.

#### Step 3: Add SessionProvider to Marketing Layout (If Needed)

If public pages use the auth-aware button, wrap them:

```typescript
// src/app/(marketing)/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function MarketingLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

#### Step 4: Verify Learner Flashcard Routes

Ensure learner routes properly configured:
- `src/app/(app)/app/(learner)/flashcards/**` - Protected routes
- Should have SessionProvider from (app) layout
- Can use auth-aware components

---

## 🔍 Investigation Results

### Files Audited ✅

**Public ISR Routes (No Auth):**
1. ✅ `src/app/(marketing)/(default)/flashcards/page.tsx`
   - Has `revalidate = 1800` (ISR)
   - NO server-side auth
   - Links to `/login` (correct)
   - Does NOT use FlashcardSessionStartButton

2. ✅ `src/app/(marketing)/(default)/flashcards/[slug]/page.tsx`
   - Has `revalidate = 86400` (ISR)
   - NO server-side auth
   - Links to `/login` (correct)
   - Does NOT use FlashcardSessionStartButton

**Broken Component:**
3. ❌ `src/components/flashcards/flashcard-session-start-button.tsx`
   - No auth check before calling action
   - Calls protected action from public context
   - Needs auth-aware fix

**Protected Action:**
4. ✅ `src/app/actions/flashcards/session-actions.ts`
   - Correctly requires auth
   - Returns error for anonymous users
   - No changes needed (working as designed)

### Current Status

**What's Working:**
- ✅ Public ISR flashcard hub pages (no auth, correct)
- ✅ Server actions properly protected
- ✅ ISR/cache-first architecture intact

**What's Broken:**
- ❌ FlashcardSessionStartButton calls protected action without auth check
- ❌ Anonymous users get "Not authenticated" error
- ❌ Navigation happens anyway → login loop → "unable to load"

---

## 🚀 Implementation Steps

### Phase 1: Fix the Button ✅ READY
1. Update `flashcard-session-start-button.tsx` with auth check
2. Add `useSession()` hook
3. Redirect to login if unauthenticated
4. Only call action if authenticated

### Phase 2: Verify Marketing Layout HAS SessionProvider
1. Check if `(marketing)/layout.tsx` has SessionProvider
2. If not, add it (needed for useSession hook)
3. Public ISR pages can still cache (SessionProvider is client-side)

### Phase 3: Test the Flow
1. Anonymous user clicks "Study deck"
2. Button detects no auth → redirects to `/login?callbackUrl=...`
3. User logs in
4. Redirects to `/app/flashcards/...`
5. Authenticated → action succeeds → session starts

### Phase 4: Verify No Regressions
1. Test authenticated users (should work)
2. Test anonymous users (should redirect to login)
3. Test ISR caching still works
4. Test force-dynamic count unchanged

---

##FILE TREE STRUCTURE

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── (default)/
│   │   │   ├── flashcards/
│   │   │   │   ├── page.tsx ✅ PUBLIC ISR (no auth)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx ✅ PUBLIC ISR (no auth)
│   │   └── layout.tsx ⚠️ NEEDS SessionProvider
│   ├── (app)/
│   │   └── app/
│   │       └── (learner)/
│   │           └── flashcards/
│   │               ├── page.tsx ✅ PROTECTED (has auth)
│   │               └── decks/
│   │                   └── [deckId]/
│   │                       ├── page.tsx ✅ PROTECTED
│   │                       └── session/
│   │                           └── [sessionId]/
│   │                               └── page.tsx ✅ PROTECTED
│   └── actions/
│       └── flashcards/
│           └── session-actions.ts ✅ PROTECTED (correct)
└── components/
    └── flashcards/
        └── flashcard-session-start-button.tsx ❌ NEEDS FIX
```

---

## ✅ Success Criteria

### After Fix:
- ✅ Anonymous users can browse public flashcard pages
- ✅ Clicking "Study" redirects to login (no errors)
- ✅ After login, users reach flashcard session
- ✅ No "unable to load" errors
- ✅ No unnecessary auth redirects
- ✅ ISR caching still works
- ✅ Force-dynamic count unchanged
- ✅ Zero breaking changes

---

## 📋 Next Actions

**Priority 1: Fix Button Component**
```bash
# Edit flashcard-session-start-button.tsx
# Add auth check before calling action
```

**Priority 2: Check Marketing Layout**
```bash
# Verify SessionProvider in (marketing)/layout.tsx
# Add if missing
```

**Priority 3: Test Complete Flow**
```bash
# Test anonymous → login → flashcard session
# Verify no errors
```

---

**Status:** 🔧 Ready to implement fix  
**Est. Time:** 15 minutes  
**Risk:** Low (surgical fix, no architecture changes)
