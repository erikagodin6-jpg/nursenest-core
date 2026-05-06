# Mobile regression checklist — NurseNest

Use this for **manual** release QA and alongside **`npm run test:e2e:mobile`** (from `nursenest-core/`). Devices: **iPhone Safari** (WebKit / iPhone 14 profile) and **Android-class width** (Pixel 7 profile or 390×844 / 412×915).

## Automated (run first)

```bash
cd nursenest-core
npm run test:e2e:mobile
```

- [ ] All **marketing** tests green on both projects (homepage + pricing).
- [ ] If `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` are set: **authenticated** block green (dashboard, onboarding URL, lesson, practice-tests, flashcards, billing).
- [ ] Optional: `npm run test:e2e` still passes (desktop projects unchanged).

## Marketing / conversion

- [ ] `/` — no horizontal scroll; hero and exam cards within viewport; **Open menu** visible; primary CTA visible.
- [ ] `/pricing` — plan cards readable; no clipped CTAs; overflow acceptable only inside intentional carousels.
- [ ] Mobile nav: open → drawer usable → **Close** returns to page (no stuck overlay).
- [ ] Region / language drawer opens and dismisses (Escape or close).

## Learner shell

- [ ] `/app` — bottom nav visible; last tab not hidden behind home indicator (safe area).
- [ ] Sticky header does not obscure first line of main content after scroll (check lesson + hub).
- [ ] Pathway pill + user actions do not overflow off-screen at 390px width.

## Onboarding

- [ ] `/app/onboarding` — new user: form usable; completed user: redirect to dashboard without broken state.
- [ ] No keyboard overlap on inputs (iOS).

## Lessons (reading)

- [ ] Hub: first lesson card fully visible; tap opens detail.
- [ ] Detail: long prose readable; **no** page-level horizontal scroll from tables/code — code scrolls inside block.
- [ ] Section nav mobile `<details>` opens and does not trap scroll.

## Flashcards

- [ ] Hub lists decks; learn link tappable.
- [ ] Study view: card face/back readable; controls ≥ 44px where primary.

## Practice exams / question bank

- [ ] `/app/practice-tests` — hero and pathway pickers usable.
- [ ] `/app/questions` — filter + first item answer flow (paid smoke covers part of this).

## CAT

- [ ] From practice-tests hub, CAT / adaptive entry visible for entitled pathway (copy may vary by feature flag).
- [ ] No redirect loop when opening CAT with valid `pathwayId` query.

## Subscription / billing

- [ ] `/app/account/billing` — status and actions clear; no layout broken on 390px.
- [ ] Paywall surfaces (if shown) have obvious primary CTA without overlapping footer.

## Admin (spot check)

- [ ] Key admin tables scroll horizontally **inside** table container, not whole page (if applicable).
- [ ] Sidebar / drawer does not cover critical actions on small laptop widths.

## SEO / structure (sanity)

- [ ] View page source: canonical and meta tags unchanged vs baseline (no regression from layout-only edits).
- [ ] No new client-only navigation replacing links for primary content.

---

**Sign-off:** Tester / date / build SHA / devices used.

- [ ] `mobile-marketing-routes.spec.ts` routes (signup, RN hub, lessons hub, blog) pass on both mobile projects.
