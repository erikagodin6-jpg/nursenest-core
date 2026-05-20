# Mobile UI/UX Risk Audit — NurseNest (Complete)

**Goal:** Inventory overlapping chrome, cutoff text, horizontal scroll, fixed widths, whitespace, sticky issues, touch targets, nested overflow, risky flex/grid, heavy mobile payloads, and CLS/hydration risks **before** polish sprints.

**Method:** Static review of representative layouts and shared chrome (`src/components/layout`, `src/app/(student)/app/(learner)`, marketing header, admin nav, ECG module shell, motion wrappers). **No runtime profiling** and no code changes in this pass.

**Categorization (for fixes later):**

| Tag | Meaning |
|-----|---------|
| **SAFE_FOR_AI** | Low-risk class/token adjustments (touch min height, `min-w-0`, `truncate`, safe `gap`) with narrow diff |
| **AI_CAN_PREP_BUT_DEV_REVIEW** | Agent can draft structural/layout changes; human must verify across breakpoints + CAT/practice |
| **DEVELOPER_ONLY** | Bundle/perf traces, Playwright trace review, Lighthouse, design QA — not suitable for blind automation |

**Screenshot / test recommendation (default):** iPhone 13/14 **390×844**, **Pixel 5 393×851**, plus **320×568** stress. Use Playwright `test:e2e:mobile` project where present; add trace steps for: open marketing mega-menu, complete one onboarding step, open learner bottom nav with max items (OSCE + printables + study tools enabled), start CAT session, open admin drawer.

---



## Route inventory (audit scope)

| Area | Primary routes / layouts |
|------|-------------------------|
| Homepage | `/` (default marketing), locale-prefixed marketing home |
| Pricing | `…/{pathway}/pricing` via `buildExamPathwayPath`, global pricing if present |
| Onboarding | `/app/onboarding`, `/signup`, `api/onboarding/complete` |
| Lesson hubs | Marketing pathway `…/lessons`, `/app/lessons` |
| Lesson detail | Marketing `…/lessons/[slug]`, `/app/lessons/[id]` |
| CAT | Marketing CAT landings, `/app/practice-tests/cat-launch`, live session `/app/practice-tests/[id]` |
| Practice | `/app/practice-tests`, `/app/practice-tests/start`, results |
| Flashcards | `/app/flashcards`, weak areas, hub client |
| Admin | `/admin/*` + `admin-nav-client` drawer |
| Navigation | `site-header.tsx`, `learner-shell-primary-nav.tsx`, `mobile-context-drawer.tsx` |
| Modals/drawers | Context drawer, admin overlay, any Radix/dialog surfaces (spot-check z-index) |
| ECG/labs | `/modules/ecg/*`, study-tools lab drills under `/app/lab-drills` (nav-linked) |
| Blogs | `/blog/*`, pathway blog trees under marketing `[locale]/[slug]/…/blog` |

## 1. Homepage (marketing)

**Primary surfaces:** `(marketing)/(default)/page.tsx` (and locale variants), `MarketingMobileMotionShell`, `site-header.tsx`.

| Risk | Evidence / likely cause | Sev | Tag | Suggested responsive fix |
|------|-------------------------|-----|-----|-------------------------|
| **CLS on motion breakpoint** | `MarketingMobileMotionShell` swaps `PageTransitionShell` vs raw children at `max-width:768px` after `matchMedia` — first paint uses `serverNarrowViewportHint` from Edge header; client resize can flip branch | P2 | AI_CAN_PREP_BUT_DEV_REVIEW | Keep SSR/client branch aligned; avoid height-affecting transitions on root; optional `useLayoutEffect` audit |
| **Header link touch targets** | `site-header.tsx`: `NAV_LINK_CLASS` uses `h-8` (32px) for dense nav links — below common **44px** guidance for primary navigation on touch | P1 | SAFE_FOR_AI | Increase tap area with `min-h-11` + negative margin or padding without changing visual density of text |
| **Mega-menu / tier strip overflow** | Large client component (`site-header.tsx` ~1100+ LOC): multiple `shrink-0`, `whitespace-nowrap`, tier hub strip — high risk of **horizontal overflow** on narrow widths when translations grow | P1 | AI_CAN_PREP_BUT_DEV_REVIEW | Audit with longest-locale strings; enforce `min-w-0` + wrap/scroll region for overflow row |
| **Mobile context drawer** | `mobile-context-drawer.tsx`: `max-h-[85dvh]` + scrollable body — generally sound; nested selectors may still clip rare keyboards | P3 | DEVELOPER_ONLY | Visual QA with iOS Safari URL bar show/hide |

---

## 2. Pricing

**Routes:** Pathway pricing under marketing hubs (`buildExamPathwayPath(…, "pricing")`), any `/pricing` marketing pages.

| Risk | Notes | Sev | Tag |
|------|-------|-----|-----|
| Sticky CTA + header stacking | Same header stack as global marketing — z-index / `sticky` interactions | P2 | AI_CAN_PREP_BUT_DEV_REVIEW |
| Wide comparison tables | If tables use fixed column widths — **horizontal scroll** | P2 | AI_CAN_PREP_BUT_DEV_REVIEW |

*Recommendation:* grep pathway pricing components for `table`, `min-w-`, `grid-cols-` in a follow-up static pass.

---

## 3. Onboarding / signup

**Surfaces:** `components/auth/signup-form.tsx`, `app/(student)/app/(learner)/onboarding/page.tsx`, `api/onboarding/complete`.

| Risk | Evidence | Sev | Tag |
|------|----------|-----|-----|
| Multi-column grids on small screens | Signup uses `sm:grid-cols-2` patterns — OK if single column default | P3 | SAFE_FOR_AI |
| Long form + keyboard | Drawer/modals on marketing may cover inputs — DEVELOPER_ONLY device QA | P2 | DEVELOPER_ONLY |

---

## 4. Lesson hubs (marketing) & lesson detail

**Surfaces:** Marketing pathway layouts, lesson hub cards, `/app/lessons` hub client.

| Risk | Notes | Sev | Tag |
|------|-------|-----|-----|
| Hub card grids | Many hubs use dense card grids — risk **uneven whitespace** or tiny tap targets on cards | P2 | AI_CAN_PREP_BUT_DEV_REVIEW |
| Pathway lesson continuation links | Depend on chrome + bottom nav safe-area — see learner shell | P2 | AI_CAN_PREP_BUT_DEV_REVIEW |

---

## 5. CAT & practice exams (learner)

**Surfaces:** `learner-exam-chrome.tsx`, practice test session route, question/flashcard stacks.

| Risk | Evidence | Sev | Tag |
|------|----------|-----|-----|
| **Focused session chrome** | `LearnerExamChromeGate`: `lg:h-[100dvh]` + `lg:overflow-hidden` — **mobile does not** get the same locked column; practice UI must self-manage height — risk **double scroll** or **lost sticky** on small screens | P1 | AI_CAN_PREP_BUT_DEV_REVIEW | Unify `min-h-0`/`dvh` strategy for `<lg` or document intentional difference |
| Minimal nav strip | `py-1.5`, `text-xs` exit control — acceptable for secondary but verify **44px** hit box on “Exit” | P2 | SAFE_FOR_AI |
| **Bottom nav hidden only on session path** | Chrome hidden pathname-only for `/app/practice-tests/:id` — correct; verify no `?examShell` regression (commented in file) | P3 | DEVELOPER_ONLY | E2E regression |

---

## 6. Flashcards

**Surfaces:** `flashcards-hub-client.tsx` (hub), study session components.

| Risk | Notes | Sev | Tag |
|------|-------|-----|-----|
| Hub payload weight | Server page composes large payload — **slow mobile** / parse cost (governance: keep payloads bounded) | P2 | DEVELOPER_ONLY | Network waterfall + JSON size budget |
| Card stack gestures | Overlap with browser back-swipe — UX risk | P2 | DEVELOPER_ONLY |

---

## 7. Admin

**Surfaces:** `admin-nav-client.tsx`.

| Risk | Evidence | Sev | Tag |
|------|----------|-----|-----|
| Drawer width | `w-[min(18rem,92vw)]` — good pattern | P3 | SAFE_FOR_AI |
| **Long nav list scroll** | `NavBody` `overflow-y-auto` without always-visible focus trap audit | P2 | AI_CAN_PREP_BUT_DEV_REVIEW | Confirm focus loop + scroll chaining |
| **Top bar + content** | Sticky `top-0` bar; main content not offset in layout (drawer overlays) — OK | P3 | — |

---

## 8. Navigation & mobile menus

**Learner:** `learner-shell-primary-nav.tsx`.

| Risk | Evidence | Sev | Tag |
|------|----------|-----|-----|
| **Bottom nav density** | `flex-wrap` + many optional rows (study tools, printables, OSCE, clinical) — labels `text-xs`, `max-w-[min(46vw,10rem)]` — **label truncation** and **wrap jumps** when flags toggle | P1 | AI_CAN_PREP_BUT_DEV_REVIEW | Progressive disclosure (overflow menu) or icon+tooltip for `<sm` |
| Touch targets | `min-h-12` on bottom links — **meets** 48px; pathway pill compact variant — verify | P2 | SAFE_FOR_AI |
| **Desktop nav hidden bug comment** | `max-md:hidden` chosen deliberately — regression risk if Tailwind order changes | P3 | DEVELOPER_ONLY | Contract screenshot |

**Marketing:** hamburger + `MobileContextDrawer` portal — z-index `210` vs other modals — verify no **overlap** (search modal, cookie banner).

---

## 9. Modals / drawers

| Risk | Notes | Sev | Tag |
|------|-------|-----|-----|
| Nested portals | `createPortal` in drawers + theme — focus stacking | P2 | DEVELOPER_ONLY |
| `85dvh` drawers | Short devices — ensure CTA row sticky inside drawer | P2 | SAFE_FOR_AI |

---

## 10. ECG / labs

**Surfaces:** `app/modules/ecg/layout.tsx` (auth gate only), nested lesson/quiz pages under `app/modules/ecg/`.

| Risk | Notes | Sev | Tag |
|------|-------|-----|-----|
| Module outside learner shell | May **omit** learner bottom nav patterns — inconsistent safe-area | P2 | AI_CAN_PREP_BUT_DEV_REVIEW | Align padding with `--nn-rhythm-*` tokens |
| Video drill pages | Native video + controls + sticky lesson chrome — **overlap** risk | P2 | DEVELOPER_ONLY | Device QA |

---

## 11. Blogs

**Surfaces:** `(marketing)/(default)/blog/*`, pathway blog routes, portable HTML body.

| Risk | Notes | Sev | Tag |
|------|-------|-----|-----|
| **Prose images / tables** | CMS HTML without `max-w-full` can force **horizontal scroll** | P1 | AI_CAN_PREP_BUT_DEV_REVIEW | Global prose styles: `prose img { max-width:100%; height:auto }`, table wrapper `overflow-x-auto` |
| Code blocks | Long lines overflow-x — acceptable if scroll visible | P3 | SAFE_FOR_AI |

---

## 12. Cross-cutting: learner shell chrome

**File:** `app/(student)/app/(learner)/layout.tsx`.

| Risk | Evidence | Sev | Tag |
|------|----------|-----|-----|
| **Sticky + `overflow-x-clip`** | Sticky wrapper `overflow-x-clip` — mitigates horizontal bleed but can interact badly with **popovers** anchored to header | P2 | AI_CAN_PREP_BUT_DEV_REVIEW | Popover portal escape hatch |
| **Padding vs fixed bottom nav** | `pb-[calc(var(--nn-rhythm-shell-y)+5rem+env(safe-area-inset-bottom))]` — reserves space; bottom nav `fixed` + `safe-area` — generally **sound** | P3 | — |
| **MobileBottomNav inside sticky parent** | Unusual DOM: `fixed` child inside `sticky` parent with `overflow-x-clip` — watch for **browser-specific clipping** (esp. iOS) | P2 | AI_CAN_PREP_BUT_DEV_REVIEW | Physical device smoke |

---

## Severity summary

| Severity | Count (approx.) | Examples |
|----------|-----------------|------------|
| P1 | 4–6 | Marketing nav touch targets; exam focus mobile parity; blog media overflow; dense learner bottom nav |
| P2 | 12–18 | CLS motion shell; mega-menu overflow; ECG shell parity; drawer focus |
| P3 | Many | Minor keyboard/dvh edge cases |

---

## Deliverables sibling docs

- `mobile-overflow-hotspots.md` — file/route hotspots table  
- `mobile-layout-instability-map.md` — CLS / hydration / dvh map  
- `mobile-polish-priority-list.md` — ordered backlog with tags  
