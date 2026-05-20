# NurseNest mobile — App Store / Google Play release architecture (planning)

**Status:** Planning and release-readiness only.  
**Last updated:** 2026-05-06  
**Out of scope for this document:** In-app purchase (IAP) / StoreKit implementation, new payment code, database duplication, mobile-only entitlements, or breaking changes to the Next.js web app.

**Related docs:** `docs/mobile-architecture.md`, `docs/mobile-implementation-report.md`, `docs/phase-5b-shared-progress-entitlements.md`, `docs/entitlements-web-mobile-audit.md` (note: audit §6 dated 2026-05-06 states `apps/mobile` absent; the repo now contains **`apps/mobile`** — treat Phase 5B + `docs/mobile-architecture.md` as current for the native shell).

**Repo facts used:** `apps/mobile/` (Expo SDK 52, React Native 0.76, Expo Router), `packages/nursenest-mobile-shared/` (HTTP contracts; no Prisma), `nursenest-core/src/lib/mobile-native/api-boundary.ts` (shared boundary types), production learner app under `nursenest-core/` (Next.js).

---

## 1) Stack recommendation (justify against existing repo)

| Option | Fit for NurseNest today | Notes |
|--------|-------------------------|--------|
| **React Native + Expo (current)** | **Recommended: continue.** | `apps/mobile` is already Expo 52 + Hermes + Expo Router. Auth uses WebView to the web origin plus `@react-native-cookies/cookies` and SecureStore-backed **`Cookie`** headers for `fetch` to the same **`/api/*`** routes as the browser (`apps/mobile/lib/api.ts`, `docs/mobile-architecture.md`). Matches “web = canonical product + SEO; mobile = premium learner shell.” |
| **Capacitor** | Pivot, not default. | Could wrap the Next.js web app in a store shell; faster path to a single WebView UI but weaker fit for the **already-built** tabbed RN shell, native navigation, and incremental offline/queue roadmap. Still requires identical session/cookie semantics to hit the same APIs. |
| **Flutter / native greenfield** | Poor default. | Highest rebuild cost; entitlements would still be **`getUserAccess`** on the server — no benefit for store submission alone. |

**Pivot only if** Expo cannot meet a hard product constraint (uncommon here) or the team abandons RN entirely for non-technical reasons. Even an IAP-heavy future is still typically implemented **on** Expo with native modules / dev clients.

**Tradeoffs (brief):** Expo gives EAS Build/Submit, OTA update constraints per Apple policy, and shared TypeScript with `nursenest-core`. Costs: upgrade cadence, **development builds** for CookieManager + SecureStore (Expo Go is insufficient for full auth per `docs/mobile-architecture.md`), and discipline to keep secrets out of the client bundle (`EXPO_PUBLIC_*` only).

---

## 2)–6) Architecture principles (bullets)

- **Same user identity:** One Postgres `User.id`. Session is established with existing **NextAuth** on the **same web origin**; the shell persists the **session cookie string** and sends it on API calls. No separate “mobile account” or client-trusted entitlement JWT.
- **Website subscribers — no double pay:** Stripe webhooks update `Subscription` / `User`; APIs and RSC use **`getUserAccess`** / **`requireSubscriberSession`** (`docs/entitlements-web-mobile-audit.md`). A web-paid user who signs into the app receives the **same** premium gates — **no second Stripe product** for mobile-only access.
- **Progress + adaptive = same DB/APIs as Phase 5B:** Lesson progress, practice tests (including CAT `adaptiveState` on `PracticeTest`), topic ledger (`UserTopicStat`), flashcards, exams — all **existing** `nursenest-core` route handlers and Prisma models. Native clients are HTTP consumers; **no duplicate progress tables** (`docs/phase-5b-shared-progress-entitlements.md`).
- **No mobile-only entitlement layer:** Do not add mobile SKU flags, SQLite authority, or bypass routes. Staff roles continue to flow through **`getUserAccess`** only.
- **No breaking web:** Store work stays in `apps/mobile/`, shared package, and docs. Do not change stable learner URLs, weaken subscriber API cache semantics, or move paywall enforcement client-side.
- **Contracts stay shared:** `nursenest-core/src/lib/mobile-native/*` remains the semantic source; `@nursenest/mobile-shared` mirrors types for Metro — no secrets in query strings (`api-boundary.ts`).

---

## 7) Store setup checklist

### Bundle identifiers

| Item | Current repo (`apps/mobile/app.json`) | Pre-flight |
|------|----------------------------------------|------------|
| **iOS bundle ID** | `com.nursenest.app` | Register in Apple Developer + App Store Connect; provisioning profiles via EAS or manual match. |
| **Android applicationId** | `com.nursenest.app` (`android.package`) | Same applicationId in Play Console; enable Play App Signing; secure upload key. |

### Icons, splash, presentation

- **Icons / splash:** `./assets/icon.png`, `./assets/splash-icon.png`, adaptive foreground — verify pixel-safe margins and dark/light contrast.
- **Screenshots:** Per-device sets (phone + **iPad** because `supportsTablet: true`). Depict **authenticated** study flows that match review claims; avoid screenshots of paywalls that look like **in-app checkout** if v1 is account-based access only.

### Privacy & policy URLs

- **Privacy policy URL** (required): HTTPS; content must match actual data collection (e.g. **Sentry** `@sentry/react-native`, **PostHog** `posthog-react-native`, **NetInfo**, **notifications** if enabled).
- **Support / marketing URLs** as required by each store.

### Google Data Safety & Apple Privacy Nutrition Labels

- Inventory **all** third-party SDKs and OS permissions; map to Google Data Safety categories (e.g. diagnostics, app activity, identifiers) and Apple nutrition label categories (Contact Info, Identifiers, Usage Data, Diagnostics, etc.).
- Revisit **App Tracking Transparency** if any SDK performs cross-app tracking; first-party session cookies for auth are not IAP but may still implicate **Identifiers** depending on implementation.

### Testing and release flow

- **TestFlight / internal testing:** Use **staging** `EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN` for non-prod binaries so QA does not touch production billing.
- **Production release:** Prefer **EAS Build** + **EAS Submit** once `eas.json` and Apple/Google API keys exist in EAS. Manual Xcode / `bundletool` upload reserved for break-glass. **Gap:** `eas.json` was not present in repo snapshot — treat as a **release blocker** until added.
- **Versioning:** `expo.version` in `app.json` plus monotonic **iOS build number** / **Android versionCode** (EAS auto-increment or explicit config plugin).

### Deep links & scheme

- URL scheme `nursenest` — plan universal links / Android App Links if email magic links or password reset must return users to the app.

---

## 8) Stripe + mobile risks (reader vs digital goods)

- **Reader / account-based framing:** If users **only unlock** premium by logging into an account that was entitled **outside** the app (web Stripe subscription), many teams align with “multi-platform / account access” narratives. **Risk:** Reviewers may still classify NCLEX-style premium banks as **digital content sold through the app** if the UI presents **purchase** or **external checkout** patterns.
- **Apple Guideline 3.1.x:** Digital features consumed in-app often require **IAP** when **sold** in the app. Policies and exceptions evolve — **re-read Apple’s current text** and obtain **counsel** for borderline products; this document is **not legal advice**.
- **Google Play Billing:** Similar expectations for **digital goods** sold in-app; account management links must be assessed against current Play payments policy.
- **Linking out to web checkout:** “Tap here to pay on the website” flows for the **same digital subscription** are **high-risk** unless a narrow, documented exception applies. Prefer **no purchase UI in the binary** for v1 planning.
- **Account-based access after web subscribe:** Matches engineering reality: Stripe → Postgres → **`getUserAccess`** on each API call — **no duplicate charge** when the same user uses mobile.

---

## 9) Compliant payment strategy (recommendations only; not legal advice)

1. **Web subscriber logs in → full access (no second charge)** — aligns with the audit conclusion that **website subscriptions unlock the same APIs for the authenticated user** (`docs/entitlements-web-mobile-audit.md`, explicit **YES**).
2. **Avoid in-app “click here to pay on web” patterns** that stores read as **circumventing IAP / Play Billing** for digital subscriptions. Prefer:
   - **Account login model** and **consumption** of entitlements already granted server-side.
   - **No native purchase** for the digital subscription in v1; subscription management remains on the **website** (Stripe Customer Portal / account flows as today).
3. **Neutral locked-state copy (if shown):** Informational messaging only (e.g. that full access requires an active subscription obtained through NurseNest’s **website**). **Do not** use high-pressure “unlock now” UX tied to external checkout from the binary without counsel review. (Prior internal draft used a **NurseNest.ca** line — keep any such copy minimal and counsel-reviewed.)
4. **When IAP becomes mandatory vs optional:** If the product **sells** the subscription or premium digital unlock **inside** the app (buttons, carts, Stripe/Apple pay sheets), assume **IAP / Play Billing** is required and plan receipts + server-side account linking — a **separate program** (explicitly out of scope here). If the app is strictly **login + study** for web-billed users, many teams defer IAP — still subject to App Review interpretation.

---

## 10) Risks / debt / next steps

| Type | Item | Mitigation / owner |
|------|------|-------------------|
| **Risk** | App Review rejects for “digital subscription without IAP” | Counsel + review notes clarifying **account-based access**; binary contains **no** purchase for digital sub; screenshots consistent. |
| **Risk** | Session cookie loss / domain mismatch → 401/403 spikes | Staging matrix; Sentry on `ApiError`; runbook in `docs/mobile-architecture.md` “gaps” style. |
| **Debt** | Missing `eas.json` / EAS project wiring | Add EAS config, signing, CI (`eas build --non-interactive` already scripted). |
| **Debt** | `docs/entitlements-web-mobile-audit.md` §6 “no apps/mobile” | Update audit when mobile path is release-frozen. |
| **Next step** | Privacy questionnaires completed from **actual** SDK manifest | Privacy owner. |
| **Next step** | TestFlight + Play internal tracks on **staging** origin | QA + eng. |
| **Next step** | Store listing, export compliance, age rating questionnaires | Release manager. |

---

## Summary

**Continue Expo + React Native:** the repo already implements the cookie-forwarding shell and shared APIs described in Phase 5B. Store submission planning should emphasize **identifiers, assets, privacy forms, EAS automation**, and a **conservative payment posture** (web-billed subscription + in-app login only) without a mobile-only entitlement layer or duplicate databases.

---

## Document history

| Date | Change |
|------|--------|
| 2026-05-06 | Expanded to App Store / Play **release architecture**: stack justification, principles §2–6, store checklist, Stripe/store risks, compliance recommendations, risks table; aligned with `apps/mobile`, `packages/nursenest-mobile-shared`, Phase 5B, and entitlements audit. |
