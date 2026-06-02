# Mobile UX audit — final (Expo `apps/mobile`)

**Date:** 2026-05-06  
**Scope:** Surgical UX polish (no architecture rewrites, `@nursenest/mobile-shared` contracts preserved).

## Screen inventory

| Area | Route / file | Notes |
|------|----------------|-------|
| Root shell | `app/_layout.tsx` | `SafeAreaProvider` + `GestureHandlerRootView`, existing RQ/Sentry/auth |
| Gate | `app/index.tsx` | Branded loading spinner |
| Auth | `(auth)/login.tsx` | Theme-aware, `KeyboardAvoidingView`, scroll, billing disclaimer |
| Onboarding | `(onboarding)/*` | Safe areas, theme tokens, 44pt targets, FlatList perf on pathway lists |
| Tabs | `(tabs)/*` | Tab bar `tabBarHideOnKeyboard`; Home pull-to-refresh; Lessons hub/detail patterns |
| Learner lesson | `(learner)/lesson/[slug].tsx` + `PathwayLessonDetailScreen` | Bottom inset for home indicator, a11y on actions |
| App stack | `(app)/*` | Header sign-out uses theme + `accessibilityLabel` |

**CAT:** No dedicated CAT UI in this repo slice; practice tab documents server-gated CAT (continuity messaging only).

## Before → after (high level)

| Topic | Before | After |
|-------|--------|-------|
| Safe area | No `SafeAreaProvider` / inconsistent insets | Provider at root; `SafeAreaView` on major flows; lesson detail uses `useSafeAreaInsets` for scroll bottom padding |
| Theme / hardcoded color | Login/onboarding/path rows used raw blues/grays | Surfaces use `useAppTheme()` + `semanticOnBrand` for primary buttons |
| Dynamic type | Mixed `allowFontScaling` | Home, tabs, onboarding, login favor `allowFontScaling` on user-facing `Text` |
| Keyboard | Login centered in plain `View` | `KeyboardAvoidingView` + scroll + dismiss on drag |
| Tablet width | Fixed padding only | `useLearnerHorizontalPadding()` centers content up to 720px readable width |
| Lists | Lessons list only | `initialNumToRender` / `maxToRenderPerBatch` / `updateCellsBatchingPeriod` on lessons + pathway lists |
| Pull to refresh | Lessons only | Home dashboard `RefreshControl` refetches profile + subscriber queries |
| Offline | Home badge only | Flashcards & Practice tabs show connectivity line aligned with `useNetworkHint` |
| Entitlement copy | Generic "upgrade on web" | Neutral copy: website billing, no in-app purchases |
| Haptics | N/A | **Not added** — `expo-haptics` not in dependencies; avoided new dep |
| FlashList | N/A | App uses `FlatList` only; tuned props instead of new `@shopify/flash-list` dep |
| Reanimated | Present | `react-native-reanimated/plugin` added last in `babel.config.js` (required for worklets) |

## Decisions

1. **No `expo-haptics`** — Keeps dependency surface minimal; tab/list feedback relies on opacity press states.
2. **No FlashList** — Would add weight; `FlatList` tuning + existing pagination is sufficient for current list sizes.
3. **`semanticOnBrand`** — Single high-contrast token for label text on brand-filled buttons in light/dark.
4. **Billing policy** — All new/updated user-facing strings align with web-only billing (no IAP claims).

## Validation (executed)

```text
$ npm --prefix apps/mobile run typecheck
> tsc --noEmit
(exit 0)

$ npm --prefix apps/mobile run lint
> eslint . -c eslint.config.cjs --max-warnings 0
(exit 0)
```

**`npx expo-doctor`:** Not successfully executed in this sandbox (`npm`/`npx` failed with `ENOENT` resolving `~/.cursor-server/.../lib`). Run locally: `cd apps/mobile && npx expo-doctor`.

**iOS Simulator / Android Emulator:** Not run in CI sandbox (no interactive `expo start` / device farm). Document as **not run**.

**`eas.json` / `app.config.ts`:** Reviewed — no secrets committed; `EAS_PROJECT_ID` reads from env with placeholder UUID for local only (see `app.config.ts` comment).
