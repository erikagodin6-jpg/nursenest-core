# NurseNest mobile — production audit & App Store readiness (Prompt 5)

**Scope:** RN / RPN / NP core (`apps/mobile` + `packages/nursenest-mobile-shared`). Web (`nursenest-core/`) unchanged for deploy.  
**Truthpack:** `.vibecheck/truthpack/` is not present in this clone — tier names, copy, and routes were not re-derived from truthpack; align env and store copy with product source before release.

---

## 1. Production hardening (implemented)

| Area | Status | Notes |
| --- | --- | --- |
| **Error boundaries** | Done | Global `ErrorBoundary` in `app/_layout.tsx`; `ScreenErrorBoundary` for isolated screens (e.g. lesson sample). |
| **Sentry** | Partial | `@sentry/react-native` + `initSentryFromEnv()` when `EXPO_PUBLIC_SENTRY_DSN` is set; no DSN in repo. Native symbolication / EAS plugin wiring is a follow-up. |
| **Structured logging** | Done | `lib/logging.ts` — dev console, prod redacts obvious PII keys; `registerRemoteLogger()` hook for future remote sinks. |
| **Analytics** | Done | `hooks/useAnalytics.ts` uses PostHog (`EXPO_PUBLIC_POSTHOG_KEY` / `EXPO_PUBLIC_POSTHOG_HOST`), aligned with web `NEXT_PUBLIC_POSTHOG_*` naming. |
| **Feature flags** | Stub | `lib/feature-flags.ts` — all off until server-driven flags exist. |
| **Network recovery** | Done | `lib/rq-network.ts` — NetInfo → `onlineManager` + refetch active queries on reconnect. |
| **React Query** | Done | `mobileQueryClientDefaults()` — retries bounded; no retry on **401/403**; **mutations retry: 0**; exponential `retryDelay`. |
| **API GET retries** | Done | `lib/api.ts` — GET-only bounded retries with backoff; no retry after 401/403; respects `ApiError`. |
| **Memory / lists** | Documented | Lessons tab `FlatList` uses `windowSize={7}` + `removeClippedSubviews`. Prefer FlashList for very large hubs if profiling shows frame drops. |
| **Images** | Done | Sample lesson uses `expo-image` with `cachePolicy="memory-disk"`. |

---

## 2. Performance & bundle audit

### Commands (run from `apps/mobile`)

```bash
npm run typecheck
npm run lint
npm run export:web          # npx expo export --platform web
npm run doctor              # npx expo-doctor
npm run release:readiness   # typecheck + lint + expo-doctor (non-fatal)
```

### Web export / bundle analysis

1. `cd apps/mobile && npm run export:web` — produces static web output under `dist/` (Expo SDK 52).  
2. Inspect chunk sizes with your preferred analyzer (e.g. `source-map-explorer` on the emitted bundles) — not added as a dependency to keep the repo light.  
3. **Finding (initial):** mobile shell is moderate; heaviest risk remains **webview + lesson JSON** on device — keep **one lesson per navigation** (matches existing lessons list pagination in `(tabs)/lessons.tsx`, `PAGE_LIMIT = 15`).

### Navigation perf

- Tabs + stack are standard Expo Router; avoid mounting heavy subtrees before navigation (already using `Suspense` + `LoadingFallback` on home).

### Large lesson / session handling

- Reuse shared `lesson-pagination`, `markdown-chunks`, and resume keys in `@nursenest/mobile-shared` — do not load unbounded lesson HTML into lists.

---

## 3. Push architecture (no marketing spam)

- **Types:** `packages/nursenest-mobile-shared/src/push/channels.ts` — `study`, `subscription`, `streak`, `continue_learning`.  
- **Server sends:** Documented only — no fake push sends.  
- **EAS / FCM:** `app.config.ts` adds `expo-notifications` with `enableBackgroundRemoteNotifications: false`; `extra.eas.projectId` from `EAS_PROJECT_ID` or placeholder UUID until `eas init`.

---

## 4. Offline foundations

- **Types & keys:** `offline/types.ts`, `offline/eviction-keys.ts`, bounded caps per bucket.  
- **React Query persistence:** Phase 2 — gate with `EXPO_PUBLIC_ENABLE_QUERY_PERSISTENCE` + `parseQueryPersistenceFlag` (`query-persistence-flag.ts`); `apps/mobile/lib/query-persistence.ts` documents no unbounded storage.

---

## 5. App Store readiness

| Item | Detail |
| --- | --- |
| **Identifiers** | iOS `bundleIdentifier` + Android `package`: `com.nursenest.app` (`app.json`). |
| **Scheme** | `nursenest` — deep links `nursenest://…` (expo-router file routes). |
| **Icons / splash** | `assets/icon.png`, `adaptive-icon.png`, `splash-icon.png` (placeholders from repo art — replace with store-grade assets before submission). |
| **Permissions** | Minimal; notifications plugin adds only what Expo requires for push plumbing. |
| **Privacy (iOS)** | When enabling analytics/crash SDKs, complete **Privacy Manifest** required-reason APIs (UserDefaults, disk space, etc.) per Apple guidance for each native SDK version. Link data types to App Store Connect **App Privacy** labels (analytics diagnostics, product interaction — exact labels depend on final SDK mix). |
| **Deep linking** | Auth: `nursenest:///(auth)/login` (and routes under `(auth)/`). Learner: `nursenest:///(learner)/lesson/<slug>`. Tabs: `nursenest:///(tabs)` after onboarding gate. |

### Env (public only)

Documented in `packages/nursenest-mobile-shared/src/env/public-env-schema.ts` and `apps/mobile/env.example`. Prefer `EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN` or `EXPO_PUBLIC_APP_ORIGIN` / `EXPO_PUBLIC_API_ORIGIN` for API base (see `lib/env.ts` + `auth-context.tsx`).

### EAS profiles

`apps/mobile/eas.json` — `development`, `preview`, `production` inherit only non-secret `APP_ENV` flags. **Do not** put secrets in `eas.json`; use EAS Secrets.

---

## 6. Security review checklist

- [x] **SecureStore** — session / onboarding keys (`secure-keys`, `auth-context`); no tokens in analytics payloads.  
- [x] **No secrets in bundle** — only `EXPO_PUBLIC_*` + `extra` placeholders; DSN/PostHog keys are public client keys, not server secrets.  
- [x] **Entitlements** — remain server-enforced (shared client mirrors web API contracts; JWT/cookies are not authorization source of truth alone).  
- [x] **`__DEV__` gating** — Sentry disabled in dev via `enabled: !__DEV__`; logging uses dev console in development.  
- [ ] **Binary hardening follow-ups** — jailbreak / root detection if compliance requires; certificate pinning if threat model requires (not implemented).

---

## 7. CI / CD

- **Scripts (repo root):** `mobile:lint`, `mobile:typecheck`, `mobile:eas:build`, `mobile:release:readiness`, `mobile:typecheck:shared`, `mobile:lint:shared`.  
- **Workflow:** `.github/workflows/mobile-eas.yml` — **disabled** (`if: false`) template for tag / manual EAS builds; enable after `EXPO_TOKEN` and EAS project exist.  
- **Manual path:** Documented as primary until CI is turned on.

---

## 8. Risks, debt, scaling, blockers

| Risk | Mitigation |
| --- | --- |
| Store assets are placeholders | Replace icons/splash before submission. |
| Sentry without full Expo plugin | Add Sentry config plugin + source maps in EAS for actionable native crashes. |
| Duplicate NetInfo listeners | Acceptable: UI hint vs RQ online manager; consolidate if profiling shows churn. |
| EAS `projectId` placeholder | Run `eas init` and set `EAS_PROJECT_ID` in CI / local env. |

**Scaling:** Keep list pagination server-side; maintain eviction caps for offline Phase 2.

**iOS vs Android:** Both use same bundle id pattern; Android adaptive icon configured; review Play data safety form vs Apple privacy labels together when analytics is fully enabled.

**Next features:** Handoff auth parity with web, query persistence behind flag, server push worker, optional MMKV persister.

---

## 9. Verification log (this audit)

```text
cd apps/mobile && npm run typecheck && npm run lint   # pass
cd packages/nursenest-mobile-shared && npm test      # pass (vitest)
cd nursenest-core && npm run typecheck:critical      # pass (root package.json touched only)
```

---

*Verified By VibeCheck ✅* (truthpack directory missing — noted above)
