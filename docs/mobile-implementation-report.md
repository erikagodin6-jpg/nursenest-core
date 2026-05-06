# Mobile implementation report (Prompt 1 foundation)

## Truthpack

`.vibecheck/truthpack` was **unavailable** in this workspace. Tier and pricing decisions were **not** re-derived here; entitlement behavior remains unchanged on the server.

## What shipped

### File structure (high level)

```
apps/mobile/
  index.js                 # gesture-handler + expo-router entry
  app/
    _layout.tsx            # QueryClient, theme, auth hydrate, Stack + login modal
    login.tsx              # WebView sign-in + CookieManager → SecureStore
    (tabs)/
      _layout.tsx          # Bottom tabs (5 IA destinations)
      index.tsx            # Home — pathway list + connectivity
      lessons.tsx          # Shell copy (API wiring next)
      flashcards.tsx
      practice.tsx
      account.tsx            # Sign-in / sign-out controls
  lib/                     # env, theme, auth store, query client, API factory
  components/              # ErrorBoundary, LoadingFallback
  hooks/                   # analytics stub, NetInfo hook
  assets/                  # minimal icons (dev placeholders)
  env.example              # EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN
packages/nursenest-mobile-shared/
  src/                     # contracts, pathways, api client, auth helpers, lessons builders, tests
```

### Shared logic strategy

- **`@nursenest/mobile-shared`**: portable TypeScript only; mirrors `nursenest-core/src/lib/mobile-native/*` contracts (see `src/contracts.ts` header).
- **`apps/mobile`**: UI, navigation, SecureStore, WebView, TanStack Query provider shell; imports shared package via `file:../../packages/nursenest-mobile-shared`.

### Reused from existing codebase (conceptually or structurally)

- Auth **routes** and session model: Next.js **Auth.js** at pinned `/api/auth` (see `PINNED_AUTH_BASE_PATH` in `nursenest-core`).
- Pathway IDs aligned with `exam-pathways-data-segment-*.ts` (`MOBILE_V1_PATHWAYS` includes `us-rn-new-grad-transition` as RN-family).
- Engagement event **names** mirrored for the analytics stub.

### Web-only (not duplicated in V1 mobile)

- SEO routes, sitemap/robots, marketing CMS, blogs, multilingual overlays, admin/staff consoles, allied-only hubs.
- Server-only entitlement resolution (`getUserAccess`, paywall HTML, etc.) — mobile consumes **results** via authenticated APIs only.

### Technical debt / risks

1. **Cookie string persistence** — storing a composed `Cookie` header is sensitive; SecureStore mitigates, but rotation/logout must clear state (implemented). Prefer future opaque token exchange if product adds a native-specific endpoint.
2. **Expo Go vs dev client** — CookieManager + SecureStore behavior differs; CI should use dev builds for auth E2E.
3. **`Set-Cookie` via fetch** — intentionally not relied upon in production mobile (see `credentials-sign-in.ts` comments + architecture doc).

### Performance

- TanStack Query defaults: `staleTime` 60s, single retry — tune per route when wiring lesson lists (pagination mandatory per repo guardrails).
- Home tab lists ~11 pathway strings — negligible; real lesson grids must stay paginated server-side.

### Roadmap (next slices)

1. Wire **Lessons** tab to `buildPathwayLessonsListPath` + `createJsonApiClient` with TanStack Query (cursor/page from server contract).
2. Flashcards / Practice: reuse existing learner API routes; add optimistic UI where safe.
3. Optional **Sentry RN** / PostHog after keys and privacy review (`EXPO_PUBLIC_*` only).
4. **EAS** project config when ready (omit placeholder project IDs).

### Verification

Commands run successfully on this branch:

```bash
npm install --prefix apps/mobile --no-fund --no-audit
npm run mobile:typecheck
npm run mobile:lint
npm --prefix nursenest-core run typecheck:critical
npm install --prefix packages/nursenest-mobile-shared --no-fund --no-audit
npm --prefix packages/nursenest-mobile-shared run test
```

Full `npm --prefix nursenest-core run typecheck` is heavier; use it before release if you have time budget.
