# Balanced Surface Split For Layout, Provider, Metadata, And Static-Generation Cost Reduction

## Goal

Reduce initial load cost, shared import-graph size, build-time work, and unnecessary hydration on the highest-impact shared surfaces without removing features, changing UI behavior, or regressing SEO/auth.

## In Scope

Only these surfaces:

- `nursenest-core/src/app/layout.tsx`
- marketing layouts under `nursenest-core/src/app/(marketing)/`
- learner shell layouts under `nursenest-core/src/app/(student)/app/`
- shared providers for theme, auth, analytics, and marketing i18n
- homepage routes:
  - `nursenest-core/src/app/(marketing)/(default)/page.tsx`
  - `nursenest-core/src/app/(marketing)/[locale]/page.tsx`
- shared marketing navigation and footer
- `generateMetadata` functions on the above hotspot routes
- `generateStaticParams` policy / related guardrails for the same hotspot area

## Out Of Scope

- No feature removal
- No UI/copy/theme change except loading-state-safe refactors
- No app-wide repo audit
- No broad route rewrites outside the listed hotspots
- No learner/auth flow redesign
- No SEO policy change
- No switching server-rendered SEO-critical content to client-only rendering

## Current Problems

### Root Layout

`src/app/layout.tsx` currently mounts:

- `AppThemeProvider`
- `AuthSessionProvider`
- `AnalyticsProvider`

That means all routes, including anonymous marketing pages, inherit the client/provider graph for auth and analytics whether they need it or not.

### Marketing Layouts

Marketing layouts are already server-first and shard-based, but they still carry too much shared chrome cost:

- both default and localized layouts mount the same large client header/footer graph
- localized routes still use the heavier merged-message loader on the homepage
- layout/page metadata and page rendering duplicate i18n loads on the homepage surfaces

### Learner Surface

`src/app/(student)/app/layout.tsx` currently pulls in:

- learner marketing bundle loading
- admin command palette loading

before the deeper learner shell decides which parts are actually needed.

### Shared Navigation / Footer

`SiteHeader` and `SiteFooter` are large client modules that pull:

- `next-auth/react`
- `next-themes`
- region hooks
- marketing i18n client hooks
- large navigation/menu helpers
- analytics event helpers

This makes the marketing chrome one of the biggest shared client graphs in the app.

### Homepage Metadata / Page Duplication

The default homepage is already relatively disciplined, but the localized homepage still uses `loadMarketingMessages()` twice in both metadata and page code. That is heavier than needed for a shell/page that only needs summary copy and chrome/page shards.

## Chosen Approach

Use a balanced surface split:

1. Keep the root layout minimal and global only where absolutely required
2. Move auth and analytics providers to the learner surface
3. Keep marketing layouts server-first and shard-based only
4. Split navigation/footer into server wrappers plus smaller interactive client islands
5. Replace merged message loading with shard-based loading on hotspot marketing routes
6. Add guardrails that prevent heavy loaders from creeping back into root/layout hotspots

## Architecture

### 1. Root Layout Contract

`src/app/layout.tsx` becomes a document shell only:

- global metadata
- global CSS / font setup
- first-paint theme boot script
- `AppThemeProvider` only, if still required for theme hydration parity

It must not mount:

- `AuthSessionProvider`
- `AnalyticsProvider`
- any route data loader
- any large content/data source

This isolates global cost to only the minimal theme/document concerns that truly affect first paint.

### 2. Marketing Surface Contract

Marketing layouts remain server-first and continue to own:

- marketing i18n provider
- region provider
- SEO JSON-LD shell
- server-rendered structure for header, footer, and page container

But they must use shard-based loading only for hotspot surfaces. The design is:

- keep `loadMarketingMessageShards()` as the only marketing layout/homepage i18n loader in hotspot paths
- avoid `loadMarketingMessages()` in marketing layout/homepage metadata or page code for these surfaces
- collapse duplicate i18n loading where page and metadata can share the same shard policy

### 3. Navigation And Footer Split

`SiteHeader` and `SiteFooter` are split into:

- a server shell responsible for structure, server-safe inputs, and composition
- client subcomponents responsible only for interactivity

Examples of client-only behavior that should live below the server shell:

- session-aware CTA/account controls
- region/language/theme toggles
- mobile drawer state
- mega-menu open/close state
- pageview / click tracking hooks

Examples of server-shell responsibilities:

- overall markup
- stable server-rendered links and section structure
- passing small serialized props into client islands

This preserves feature parity while shrinking the shared client entry graph.

### 4. Learner Surface Contract

The learner surface becomes the home for session-aware global client providers:

- move `AuthSessionProvider` here
- move `AnalyticsProvider` here if it is still needed across learner navigation/events

Placement should be as high as necessary for learner/app/admin behavior, but no higher. The likely target is `src/app/(student)/app/layout.tsx` unless validation shows a tighter placement is safe.

The learner shell keeps SSR/session access intact because server-side session reads already happen through server helpers, not through the client provider.

### 5. Metadata Contract

For hotspot routes:

- `generateMetadata` must use shard-based or summary-only sources
- it must not load full lesson/blog/question datasets
- it must not import large merged message datasets when a small shard list is enough

For homepage specifically:

- default and localized homepage metadata should use the same minimal shard strategy
- region-sensitive metadata may still depend on cookies if needed, but only with lightweight i18n/copy resolution

### 6. Static Generation Contract

This pass does not broadly rework route generation. Instead it tightens policy on the targeted hotspots:

- keep current SEO-safe routes intact
- avoid introducing new `generateStaticParams` fan-out
- preserve existing on-demand behavior and tests that forbid empty `generateStaticParams` stubs

If a hotspot route currently depends on a heavy import path only to support metadata/static generation, refactor it to use a smaller summary/slug source rather than changing page coverage.

## File-Level Changes Expected

### Root

- `nursenest-core/src/app/layout.tsx`
  - remove auth and analytics providers
  - keep theme only if needed for first paint and hydration parity

### Marketing

- `nursenest-core/src/app/(marketing)/(default)/layout.tsx`
- `nursenest-core/src/app/(marketing)/[locale]/layout.tsx`
- `nursenest-core/src/app/(marketing)/(default)/page.tsx`
- `nursenest-core/src/app/(marketing)/[locale]/page.tsx`

### Learner

- `nursenest-core/src/app/(student)/app/layout.tsx`
- optionally `nursenest-core/src/app/(student)/app/(learner)/layout.tsx` if provider placement or dynamic imports need to move lower

### Navigation / Footer / Providers

- `nursenest-core/src/components/layout/site-header.tsx`
- `nursenest-core/src/components/layout/site-footer.tsx`
- new server-shell and client-island files near these modules
- `nursenest-core/src/components/auth/auth-session-provider.tsx`
- `nursenest-core/src/components/providers/analytics-provider.tsx`

### Guardrails / Tests

- `nursenest-core/src/build-compile-memory-safety.test.ts`
- `nursenest-core/src/lib/marketing/build-phase-memory-guards.test.ts`
- add narrowly scoped tests for root/layout/provider import boundaries where useful

## Data Flow

### Marketing

1. marketing layout loads only the chrome/page shards it needs
2. server shell passes small, serializable props into header/footer client islands
3. homepage uses shard-only loaders plus summary data
4. metadata uses the same minimal shard-level inputs rather than merged message bundles

### Learner

1. root layout renders only document/theme shell
2. learner app layout mounts auth/analytics providers
3. server-side session and entitlement resolution continues in server layouts/routes
4. client session consumers still work because the provider now exists on the learner surface rather than globally

## Error Handling

- keep existing safe marketing metadata fallbacks through `safeGenerateMetadata`
- keep marketing layouts resilient if message loading fails
- preserve current degraded-mode behavior for learner surfaces
- when splitting header/footer, client islands must degrade to the same visible fallback behavior rather than throwing

## Testing Strategy

### Guardrail Updates

Add or update tests so that:

- root layout no longer imports `AuthSessionProvider` or `AnalyticsProvider`
- hotspot marketing homepage/layout files do not use `loadMarketingMessages()`
- learner app layout owns auth/analytics provider wiring
- header/footer server shells do not directly absorb the full previous client graph again

### Regression Coverage

Run focused tests around:

- marketing build/memory guards
- metadata safety
- any new hotspot import-boundary tests
- targeted linting for edited files

## Risks And Mitigations

### Risk: Auth/session regressions in marketing/header/footer client code

Mitigation: only move `AuthSessionProvider` to the learner surface, and keep marketing chrome session-dependent behavior behind explicit, validated boundaries instead of assuming every route still has a session provider.

### Risk: SEO regression from metadata loader changes

Mitigation: keep `generateMetadata` behavior the same semantically while changing only the source path to shard-based/minimal inputs.

### Risk: UI regression when splitting header/footer

Mitigation: server shell preserves the existing structure and passes data into smaller interactive client islands rather than rewriting the UX.

### Risk: New guardrails become too broad

Mitigation: scope tests only to root/layout/provider hotspot files named in this task.

## Success Criteria

- root layout is minimal and no longer mounts auth/analytics
- learner surface owns auth/analytics providers without breaking session behavior
- hotspot marketing layouts/homepages use shard-based i18n loading only
- header/footer are split so interactive client code is no longer the entire chrome surface
- homepage and hotspot metadata avoid heavier merged-message loading
- no feature removal, no SEO regression, no auth regression, no visible UI regression
