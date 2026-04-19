# Balanced Surface Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the root layout nearly empty, move auth/analytics to the learner surface, convert hotspot marketing i18n to shard-only loading, and split header/footer into server shells plus client islands without losing features or regressing SEO/auth.

**Architecture:** The implementation reduces cost by tightening graph boundaries instead of removing behavior. Root becomes document-and-theme only, learner layout owns client auth/analytics convenience, marketing homepage metadata/page share one cached shard helper, and the marketing chrome is split into server wrappers that pass only small props into interactive client components.

**Tech Stack:** Next.js App Router, React Server Components, next-auth, next-themes, Node test runner, tsx test runner, TypeScript, existing i18n shard loaders

---

## File Structure

### Existing files to modify

- `nursenest-core/src/app/layout.tsx`
  - Remove `AuthSessionProvider` and `AnalyticsProvider`; keep only the minimal document/theme shell.
- `nursenest-core/src/app/(student)/app/layout.tsx`
  - Become the learner/admin surface owner for client auth and analytics providers.
- `nursenest-core/src/app/(marketing)/(default)/layout.tsx`
  - Swap direct full-client chrome imports for server-shell header/footer composition.
- `nursenest-core/src/app/(marketing)/[locale]/layout.tsx`
  - Same as default marketing layout; keep shard-only loader usage.
- `nursenest-core/src/app/(marketing)/(default)/page.tsx`
  - Route page + metadata to one cached shard helper.
- `nursenest-core/src/app/(marketing)/[locale]/page.tsx`
  - Remove `loadMarketingMessages()`; use one cached shard helper reused by page and metadata.
- `nursenest-core/src/components/layout/site-header.tsx`
  - Convert into a thin client module or compatibility re-export; large client implementation moves behind explicit `.client`.
- `nursenest-core/src/components/layout/site-footer.tsx`
  - Same pattern as header.
- `nursenest-core/src/build-compile-memory-safety.test.ts`
  - Add root/layout/provider boundary checks.
- `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`
  - Add homepage shard-helper and import-boundary assertions.

### New files to create

- `nursenest-core/src/components/layout/site-header.server.tsx`
  - Server shell for marketing header structure and minimal serialized props.
- `nursenest-core/src/components/layout/site-header.client.tsx`
  - Interactive marketing header logic currently living in `site-header.tsx`.
- `nursenest-core/src/components/layout/site-footer.server.tsx`
  - Server shell for marketing footer structure and minimal serialized props.
- `nursenest-core/src/components/layout/site-footer.client.tsx`
  - Interactive marketing footer logic currently living in `site-footer.tsx`.
- `nursenest-core/src/app/(student)/app/learner-surface-providers.tsx`
  - Client wrapper that mounts `AuthSessionProvider` + `AnalyticsProvider` for the learner surface.
- `nursenest-core/src/lib/marketing-i18n/homepage-message-shards.ts`
  - Cached shard-only helper shared by hotspot homepage metadata and page code.

These splits keep responsibilities clear:

- root: document + theme only
- learner app shell: auth/analytics client convenience only
- marketing layouts: server composition + shard loading
- header/footer shells: structure and stable links
- header/footer clients: stateful UI and tracking only

---

### Task 1: Add failing guardrails for root, learner, and homepage boundaries

**Files:**
- Modify: `nursenest-core/src/build-compile-memory-safety.test.ts`
- Modify: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`
- Test: `nursenest-core/src/build-compile-memory-safety.test.ts`
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`

- [ ] **Step 1: Add failing root/learner boundary tests**

Append these tests to `nursenest-core/src/build-compile-memory-safety.test.ts`:

```ts
test("root layout keeps only the theme provider globally", () => {
  const rootLayout = readFileSync(join(root, "src", "app", "layout.tsx"), "utf8");

  assert.match(rootLayout, /AppThemeProvider/);
  assert.doesNotMatch(rootLayout, /AuthSessionProvider/);
  assert.doesNotMatch(rootLayout, /AnalyticsProvider/);
});

test("learner app layout owns auth and analytics providers", () => {
  const appLayout = readFileSync(join(root, "src", "app", "(student)", "app", "layout.tsx"), "utf8");

  assert.match(appLayout, /LearnerSurfaceProviders/);
});

test("root layout does not import merged marketing loaders or content loaders", () => {
  const rootLayout = readFileSync(join(root, "src", "app", "layout.tsx"), "utf8");

  assert.doesNotMatch(rootLayout, /loadMarketingMessages/);
  assert.doesNotMatch(rootLayout, /loadMarketingMessageShards/);
  assert.doesNotMatch(rootLayout, /@\/lib\/(blog|lessons|questions)\//);
});
```

- [ ] **Step 2: Add failing hotspot marketing/homepage boundary tests**

Append these tests to `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`:

```ts
test("localized homepage uses shard helper instead of merged marketing message loader", () => {
  const localizedHomePage = readAppFile("app/(marketing)/[locale]/page.tsx");
  const shardHelper = readAppFile("lib/marketing-i18n/homepage-message-shards.ts");

  assert.doesNotMatch(localizedHomePage, /loadMarketingMessages/);
  assert.match(localizedHomePage, /@\/lib\/marketing-i18n\/homepage-message-shards/);
  assert.match(shardHelper, /cache\(/);
  assert.match(shardHelper, /loadMarketingMessageShards/);
});

test("marketing layouts render explicit server-shell chrome", () => {
  const defaultLayout = readAppFile("app/(marketing)/(default)/layout.tsx");
  const localeLayout = readAppFile("app/(marketing)/[locale]/layout.tsx");

  assert.match(defaultLayout, /SiteHeaderServer/);
  assert.match(defaultLayout, /SiteFooterServer/);
  assert.match(localeLayout, /SiteHeaderServer/);
  assert.match(localeLayout, /SiteFooterServer/);
});
```

- [ ] **Step 3: Run the focused tests and confirm they fail**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx tsx --test src/build-compile-memory-safety.test.ts src/lib/marketing/build-phase-memory-guards.test.ts
```

Expected: FAIL because the current root layout still mounts auth/analytics, learner layout does not yet have `LearnerSurfaceProviders`, localized homepage still uses `loadMarketingMessages()`, and marketing layouts still import `SiteHeader` / `SiteFooter`.

- [ ] **Step 4: Commit the failing guardrails checkpoint**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/src/build-compile-memory-safety.test.ts nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts
git commit -m "test: add surface split guardrails"
```

### Task 2: Make the root layout nearly empty and move auth/analytics to the learner surface

**Files:**
- Create: `nursenest-core/src/app/(student)/app/learner-surface-providers.tsx`
- Modify: `nursenest-core/src/app/layout.tsx`
- Modify: `nursenest-core/src/app/(student)/app/layout.tsx`
- Test: `nursenest-core/src/build-compile-memory-safety.test.ts`

- [ ] **Step 1: Create the learner surface provider wrapper**

Create `nursenest-core/src/app/(student)/app/learner-surface-providers.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";

export function LearnerSurfaceProviders({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </AuthSessionProvider>
  );
}
```

- [ ] **Step 2: Remove auth and analytics from the root layout**

Update `nursenest-core/src/app/layout.tsx` so the body wrapper becomes:

```tsx
      <body className="min-h-full flex flex-col bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] transition-colors duration-200">
        <Script id="nursenest-theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
```

Also remove these imports:

```tsx
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
```

- [ ] **Step 3: Mount auth and analytics at the learner app layout**

Update `nursenest-core/src/app/(student)/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { LearnerSurfaceProviders } from "./learner-surface-providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppSegmentLayout({ children }: { children: React.ReactNode }) {
  const [{ AdminGlobalCommandPalette }, { getLearnerMarketingBundle }] = await Promise.all([
    import("@/components/admin/admin-global-command-palette"),
    import("@/lib/learner/learner-marketing-server"),
  ]);
  let locale = "en";
  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    const bundle = await getLearnerMarketingBundle();
    locale = bundle.locale;
    messages = bundle.messages;
    fallbackMessages = bundle.fallbackMessages;
  } catch (e) {
    console.error("[app-segment-layout] failed to load learner marketing bundle", {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return (
    <LearnerSurfaceProviders>
      <MarketingI18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
        {children}
        <Suspense fallback={null}>
          <AdminGlobalCommandPalette />
        </Suspense>
      </MarketingI18nProvider>
    </LearnerSurfaceProviders>
  );
}
```

- [ ] **Step 4: Re-run the root/learner guardrail tests**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx tsx --test src/build-compile-memory-safety.test.ts
```

Expected: PASS for the new root/learner boundary checks and the existing dynamic-import guard checks.

- [ ] **Step 5: Commit the provider relocation**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/src/app/layout.tsx nursenest-core/src/app/(student)/app/layout.tsx nursenest-core/src/app/(student)/app/learner-surface-providers.tsx nursenest-core/src/build-compile-memory-safety.test.ts
git commit -m "refactor: move auth and analytics to learner surface"
```

### Task 3: Add one cached shard helper for hotspot homepage metadata and page code

**Files:**
- Create: `nursenest-core/src/lib/marketing-i18n/homepage-message-shards.ts`
- Modify: `nursenest-core/src/app/(marketing)/(default)/page.tsx`
- Modify: `nursenest-core/src/app/(marketing)/[locale]/page.tsx`
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`
- Test: `nursenest-core/src/lib/seo/safe-marketing-metadata.test.ts`

- [ ] **Step 1: Create the cached homepage shard helper**

Create `nursenest-core/src/lib/marketing-i18n/homepage-message-shards.ts`:

```ts
import "server-only";

import { cache } from "react";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  MARKETING_PAGE_BODY_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

const MARKETING_BUILD_PHASE = "phase-production-build";

export function homepageMessageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_PAGE_BODY_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
}

export const loadHomepageMessageBundle = cache(async function loadHomepageMessageBundle(locale: string) {
  const messages = await loadMarketingMessageShards(locale, homepageMessageShards());
  const fallbackMessages =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, homepageMessageShards());

  return { messages, fallbackMessages };
});
```

- [ ] **Step 2: Route default homepage metadata and page through the helper**

Update `nursenest-core/src/app/(marketing)/(default)/page.tsx`:

```tsx
import { loadHomepageMessageBundle } from "@/lib/marketing-i18n/homepage-message-shards";
```

Replace direct shard loading:

```tsx
const { messages: m } = await loadHomepageMessageBundle(STATIC_LOCALE);
```

And in metadata:

```tsx
const { messages: m } = await loadHomepageMessageBundle(STATIC_LOCALE);
```

Remove the old local helper:

```tsx
function homePageMessageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_PAGE_BODY_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
}
```

- [ ] **Step 3: Replace localized homepage merged-message loading with the same shard helper**

Update `nursenest-core/src/app/(marketing)/[locale]/page.tsx` so both page and metadata use:

```tsx
import { loadHomepageMessageBundle } from "@/lib/marketing-i18n/homepage-message-shards";
```

Replace:

```tsx
const m = await loadMarketingMessages(locale);
const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
```

with:

```tsx
const { messages: primary, fallbackMessages: en } = await loadHomepageMessageBundle(locale);
```

In `generateMetadata()`:

```tsx
const { messages: primary, fallbackMessages: en } = await loadHomepageMessageBundle(locale);
const fallback = en ?? {};
const title = resolveMarketingCopy(primary, `pages.home.metaTitle${metaSfx}`, fallback, defaultHomeMetaTitle(marketingRegion));
```

In the page body:

```tsx
const [{ messages: primary, fallbackMessages: en }, homeStatsRaw, publishedGlobalRegionCardIds] = await Promise.all([
  loadHomepageMessageBundle(locale),
  loadLocalizedHomePageStats(),
  listPublishedHomeGlobalRegionCardIds(),
]);
```

Do not reintroduce `loadMarketingMessages()` anywhere in the hotspot homepages.

- [ ] **Step 4: Re-run the homepage/memory/metadata tests**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts src/lib/seo/safe-marketing-metadata.test.ts
```

Expected: PASS for the new shard-helper assertions and the existing metadata safety coverage.

- [ ] **Step 5: Commit the homepage shard-helper refactor**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/src/lib/marketing-i18n/homepage-message-shards.ts nursenest-core/src/app/(marketing)/(default)/page.tsx nursenest-core/src/app/(marketing)/[locale]/page.tsx nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts
git commit -m "refactor: share shard-based homepage metadata loader"
```

### Task 4: Split marketing header into explicit server shell and client island

**Files:**
- Create: `nursenest-core/src/components/layout/site-header.server.tsx`
- Create: `nursenest-core/src/components/layout/site-header.client.tsx`
- Modify: `nursenest-core/src/components/layout/site-header.tsx`
- Modify: `nursenest-core/src/app/(marketing)/(default)/layout.tsx`
- Modify: `nursenest-core/src/app/(marketing)/[locale]/layout.tsx`
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`

- [ ] **Step 1: Create the header client island**

Move the current interactive implementation from `nursenest-core/src/components/layout/site-header.tsx` into `nursenest-core/src/components/layout/site-header.client.tsx` and keep the top of the file as:

```tsx
"use client";

export function SiteHeaderClient() {
  // move the current SiteHeader body here unchanged first
}
```

Inside that file, rename the export:

```tsx
export function SiteHeaderClient() {
  // previous SiteHeader implementation
}
```

- [ ] **Step 2: Create the header server shell**

Create `nursenest-core/src/components/layout/site-header.server.tsx`:

```tsx
import { SiteHeaderClient } from "@/components/layout/site-header.client";

export function SiteHeaderServer() {
  return <SiteHeaderClient />;
}
```

This is intentionally minimal in the first pass. The server shell boundary is the important contract; prop-thinning can happen in a second refactor while behavior stays stable.

- [ ] **Step 3: Convert the public header entrypoint into a compatibility wrapper**

Replace `nursenest-core/src/components/layout/site-header.tsx` with:

```tsx
export { SiteHeaderClient as SiteHeader } from "@/components/layout/site-header.client";
```

This preserves existing imports outside the hotspot while the marketing layouts switch explicitly to `SiteHeaderServer`.

- [ ] **Step 4: Update marketing layouts to use the server shell**

In both:

- `nursenest-core/src/app/(marketing)/(default)/layout.tsx`
- `nursenest-core/src/app/(marketing)/[locale]/layout.tsx`

replace:

```tsx
import { SiteHeader } from "@/components/layout/site-header";
```

with:

```tsx
import { SiteHeaderServer } from "@/components/layout/site-header.server";
```

and replace:

```tsx
<SiteHeader />
```

with:

```tsx
<SiteHeaderServer />
```

- [ ] **Step 5: Re-run the marketing guardrail test**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts
```

Expected: PASS for the explicit `SiteHeaderServer` assertions.

- [ ] **Step 6: Commit the header split**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/src/components/layout/site-header.server.tsx nursenest-core/src/components/layout/site-header.client.tsx nursenest-core/src/components/layout/site-header.tsx nursenest-core/src/app/(marketing)/(default)/layout.tsx nursenest-core/src/app/(marketing)/[locale]/layout.tsx
git commit -m "refactor: split marketing header into server and client"
```

### Task 5: Split marketing footer into explicit server shell and client island

**Files:**
- Create: `nursenest-core/src/components/layout/site-footer.server.tsx`
- Create: `nursenest-core/src/components/layout/site-footer.client.tsx`
- Modify: `nursenest-core/src/components/layout/site-footer.tsx`
- Modify: `nursenest-core/src/app/(marketing)/(default)/layout.tsx`
- Modify: `nursenest-core/src/app/(marketing)/[locale]/layout.tsx`
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`

- [ ] **Step 1: Create the footer client island**

Move the current interactive implementation from `nursenest-core/src/components/layout/site-footer.tsx` into `nursenest-core/src/components/layout/site-footer.client.tsx` and rename the export:

```tsx
"use client";

export function SiteFooterClient() {
  // previous SiteFooter implementation
}
```

- [ ] **Step 2: Create the footer server shell**

Create `nursenest-core/src/components/layout/site-footer.server.tsx`:

```tsx
import { SiteFooterClient } from "@/components/layout/site-footer.client";

export function SiteFooterServer() {
  return <SiteFooterClient />;
}
```

- [ ] **Step 3: Convert the public footer entrypoint into a compatibility wrapper**

Replace `nursenest-core/src/components/layout/site-footer.tsx` with:

```tsx
export { SiteFooterClient as SiteFooter } from "@/components/layout/site-footer.client";
```

- [ ] **Step 4: Update marketing layouts to use the footer server shell**

In both marketing layouts, replace:

```tsx
import { SiteFooter } from "@/components/layout/site-footer";
```

with:

```tsx
import { SiteFooterServer } from "@/components/layout/site-footer.server";
```

and replace:

```tsx
<SiteFooter />
```

with:

```tsx
<SiteFooterServer />
```

- [ ] **Step 5: Re-run the marketing guardrail test**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts
```

Expected: PASS after adding a `SiteFooterServer` assertion analogous to the header assertion if it is not already present.

- [ ] **Step 6: Commit the footer split**

```bash
cd /root/nursenest-core-reclone
git add nursenest-core/src/components/layout/site-footer.server.tsx nursenest-core/src/components/layout/site-footer.client.tsx nursenest-core/src/components/layout/site-footer.tsx nursenest-core/src/app/(marketing)/(default)/layout.tsx nursenest-core/src/app/(marketing)/[locale]/layout.tsx nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts
git commit -m "refactor: split marketing footer into server and client"
```

### Task 6: Final verification and handoff evidence

**Files:**
- Modify: none unless a verification failure needs a surgical fix
- Test: `nursenest-core/src/build-compile-memory-safety.test.ts`
- Test: `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`
- Test: `nursenest-core/src/lib/seo/safe-marketing-metadata.test.ts`

- [ ] **Step 1: Run the focused regression suite**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx tsx --test src/build-compile-memory-safety.test.ts
npx tsx --test src/lib/marketing/build-phase-memory-guards.test.ts
npx tsx --test src/lib/seo/safe-marketing-metadata.test.ts
```

Expected: PASS for all three test files.

- [ ] **Step 2: Run lint diagnostics for the edited surfaces**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npx eslint src/app/layout.tsx "src/app/(student)/app/layout.tsx" src/app/(student)/app/learner-surface-providers.tsx "src/app/(marketing)/(default)/layout.tsx" "src/app/(marketing)/[locale]/layout.tsx" "src/app/(marketing)/(default)/page.tsx" "src/app/(marketing)/[locale]/page.tsx" src/components/layout/site-header.tsx src/components/layout/site-header.server.tsx src/components/layout/site-header.client.tsx src/components/layout/site-footer.tsx src/components/layout/site-footer.server.tsx src/components/layout/site-footer.client.tsx src/lib/marketing-i18n/homepage-message-shards.ts src/build-compile-memory-safety.test.ts src/lib/marketing/build-phase-memory-guards.test.ts
```

Expected: PASS with no new lint errors.

- [ ] **Step 3: Optionally run a focused production build if the machine can afford it**

Run:

```bash
cd /root/nursenest-core-reclone/nursenest-core
npm run build
```

Expected: PASS. If skipped due to environment/time constraints, record that explicitly in the final handoff.

- [ ] **Step 4: Write the final handoff with the requested deliverables**

Use this structure in the final summary:

```md
A. Files changed
- ...

B. Providers moved and why
- `AuthSessionProvider`: root -> learner app layout for client UI convenience only
- `AnalyticsProvider`: root -> learner app layout to reduce shared public graph

C. Imports removed from root/layouts
- ...

D. i18n loading improvements
- localized homepage switched from `loadMarketingMessages()` to cached shard helper reused by metadata + page

E. Metadata optimizations
- ...

F. Expected reduction in shared graph size
- auth + analytics removed from global root graph
- marketing chrome split behind explicit server shell boundary
- homepage removed repeated merged-message loads

G. Remaining hotspots not addressed
- ...
```

- [ ] **Step 5: Create the final verification commit**

```bash
cd /root/nursenest-core-reclone
git add -A
git commit -m "chore: verify balanced surface split"
```
