# Student Workspace Navigation Redesign

**Status:** Implemented  
**Date:** 2026-06-01  
**Scope:** Authenticated learner shell only — marketing pages unchanged

---

## Current Navigation Audit

### Problems with the existing navigation

| Problem | Detail |
|---|---|
| Max-width 1280px centered container | Wastes screen real estate; study content feels narrow |
| Marketing-style top nav (`SiteHeaderServer`) | Tier hub strip (RN/PN/NP links), brand marketing links, "View plans" — inappropriate after login |
| No persistent left navigation | Every route change users must re-orient; no spatial memory |
| `LearnerStudyPathStrip` | Hub→Learn→Practice→Review pill flow is not discoverable and adds visual noise |
| No program context | Pathway is implicit (embedded in query params); users can't easily switch |
| No "Continue Studying" anchor | Users must navigate to hub to find where they left off |
| Footer present on every page | Adds scroll depth to focused study surfaces |

### What was already good

- `SentryLearnerShell`, `LearnerExamChromeGate`, `LearnerExamStudyProviders` — keep all
- Focused exam/flashcard shell suppression (`isFocusedExamShell`) — keep, extend to hide sidebar
- Semantic CSS token system (`--semantic-*`, `--role-*`) — use throughout workspace
- Admin QA toolbar, degraded mode banner, trial banner — keep, move inside content area
- `PageTransitionShell` — keep

---

## Information Architecture

```
WorkspaceShell
├── WorkspaceSidebar (fixed, 280px expanded / 72px collapsed)
│   ├── Logo mark + "NurseNest" text (collapsed: logo only)
│   ├── ProgramSwitcher (current program ▼, shows accessible pathways)
│   ├── ContinueStudyingCard (streamed in via Suspense)
│   │   ├── Lesson title
│   │   ├── "Lesson N of M" subtitle
│   │   └── Resume → link
│   ├── NavItem: Dashboard
│   ├── NavSection: LEARN
│   │   ├── Lessons
│   │   ├── ECG Interpretation
│   │   ├── Lab Interpretation
│   │   └── Clinical Skills
│   ├── NavSection: PRACTICE
│   │   ├── Flashcards
│   │   ├── Question Bank
│   │   └── Practice Tests
│   ├── NavSection: ASSESS
│   │   ├── CAT Exams
│   │   └── Readiness Assessment
│   ├── NavSection: ANALYZE
│   │   ├── Weak Areas
│   │   ├── Analytics
│   │   └── Report Cards
│   ├── NavSection: TOOLS
│   │   ├── Study Plan
│   │   ├── Study Coach
│   │   └── Notes
│   ├── NavSection: ACCOUNT
│   │   ├── Blog
│   │   └── Settings
│   └── CollapseToggle (bottom)
│
└── WorkspaceMain
    ├── WorkspaceHeader (sticky, 56px)
    │   ├── HamburgerButton (mobile only)
    │   ├── Breadcrumb (current section)
    │   ├── SearchButton
    │   ├── NotificationsButton
    │   ├── ThemeToggle
    │   └── UserAvatarMenu
    │
    └── ContentArea (max-width: 1600px, scrollable)
        ├── [Existing banners: admin, degraded, trial, baseline]
        ├── main#nn-learner-main
        └── (footer suppressed in workspace mode)

MobileNavDrawer (slide-over, 320px, overlays content on mobile)
```

---

## Route Mapping

| Nav Label | Route | pathwayId scoping |
|---|---|---|
| Dashboard | `/app/command-center` | `?pathwayId={id}` |
| Lessons | `/app/lessons` | `?pathwayId={id}` |
| ECG Interpretation | `/app/ecg` | none |
| Lab Interpretation | `/app/labs` | none |
| Clinical Skills | `/app/clinical-skills` | none |
| Flashcards | `/app/flashcards` | `?pathwayId={id}` |
| Question Bank | `/app/question-bank` | `?pathwayId={id}` |
| Practice Tests | `/app/practice-tests` | `?pathwayId={id}` |
| CAT Exams | `/app/cat` | `?pathwayId={id}` |
| Readiness Assessment | `/app/readiness` | `?pathwayId={id}` |
| Weak Areas | `/app/account/analytics` | none |
| Analytics | `/app/account/analytics` | none |
| Report Cards | `/app/account/report-card` | none |
| Study Plan | `/app/study-plan` | `?pathwayId={id}` |
| Study Coach | `/app/coach` | none |
| Notes | `/app/account/notes` | none |
| Blog | `/blog` | none |
| Settings | `/app/account/settings` | none |

---

## Desktop Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  280px fixed sidebar      │  Content area (flex-1, max-w-1600px)    │
│  ─────────────────────    │  ─────────────────────────────────────  │
│  🌱 NurseNest             │  [Breadcrumb]  [Search]  🔔 🌙 👤      │
│  ─────────────────────    │  ─────────────────────────────────────  │
│  NCLEX-RN ▼              │                                         │
│                           │  <page content>                         │
│  ┌─────────────────────┐  │                                         │
│  │ Continue Studying   │  │                                         │
│  │ Cardiovascular Dis… │  │                                         │
│  │ Lesson 12 of 48     │  │                                         │
│  │         Resume →    │  │                                         │
│  └─────────────────────┘  │                                         │
│                           │                                         │
│  ● Dashboard              │                                         │
│                           │                                         │
│  LEARN                    │                                         │
│    📚 Lessons             │                                         │
│    🫀 ECG Interpretation  │                                         │
│    🧪 Lab Interpretation  │                                         │
│    🩺 Clinical Skills     │                                         │
│                           │                                         │
│  PRACTICE                 │                                         │
│    🎴 Flashcards          │                                         │
│    ❓ Question Bank       │                                         │
│    📝 Practice Tests      │                                         │
│                           │                                         │
│  ASSESS                   │                                         │
│    🎯 CAT Exams           │                                         │
│    📊 Readiness           │                                         │
│                           │                                         │
│  ANALYZE                  │                                         │
│    📉 Weak Areas          │                                         │
│    📈 Analytics           │                                         │
│    🗂️ Report Cards        │                                         │
│                           │                                         │
│  TOOLS                    │                                         │
│    📅 Study Plan          │                                         │
│    🤖 Study Coach         │                                         │
│    📓 Notes               │                                         │
│                           │                                         │
│  ACCOUNT                  │                                         │
│    📰 Blog                │                                         │
│    ⚙️ Settings            │                                         │
│                           │                                         │
│  [← Collapse]             │                                         │
└─────────────────────────────────────────────────────────────────────┘
```

## Collapsed Sidebar Wireframe (72px)

```
┌──────────┬─────────────────────────────────────────────────────────┐
│  72px    │  Content area                                           │
│          │                                                         │
│  🌱      │  [≡]  [Breadcrumb]  [Search]  🔔  🌙  👤             │
│  ──      │  ────────────────────────────────────────────────────  │
│  RN ▼    │                                                         │
│  ──      │  <page content>                                         │
│          │                                                         │
│  🏠      │                                                         │
│  📚      │                                                         │
│  🫀      │                                                         │
│  🧪      │                                                         │
│  🩺      │                                                         │
│  🎴      │                                                         │
│  ❓      │                                                         │
│  📝      │                                                         │
│  🎯      │                                                         │
│  📊      │                                                         │
│  📉      │                                                         │
│  📈      │                                                         │
│  🗂️     │                                                         │
│  📅      │                                                         │
│  🤖      │                                                         │
│  📓      │                                                         │
│  ⚙️      │                                                         │
│          │                                                         │
│  →       │                                                         │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

## Mobile Wireframe

```
Mobile (<768px): Sidebar hidden, hamburger shows drawer on demand

┌─────────────────────────────────┐
│  [≡]  NurseNest        🔔  👤  │  ← WorkspaceHeader (mobile)
│  ─────────────────────────────  │
│                                 │
│  <page content>                 │
│                                 │
└─────────────────────────────────┘

On hamburger tap → slide-over drawer (320px from left):

┌──────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────┐                               │
│ │  ✕   🌱 NurseNest             │  overlay backdrop             │
│ │  ──────────────────────        │                               │
│ │  NCLEX-RN ▼                  │                               │
│ │  ──────────────────────        │                               │
│ │  ┌──────────────────────┐      │                               │
│ │  │ Continue Studying    │      │                               │
│ │  │ Cardiovascular...    │      │                               │
│ │  │ Resume →             │      │                               │
│ │  └──────────────────────┘      │                               │
│ │  ● Dashboard                   │                               │
│ │  LEARN                         │                               │
│ │    Lessons                     │                               │
│ │    ECG Interpretation          │                               │
│ │    ...                         │                               │
│ │  [safe-area bottom padding]    │                               │
│ └────────────────────────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Program Switching Logic

1. Server renders with pathway from `loadLearnerPathwayNavMetadata(userId)` (DB-stored preference)
2. `ProgramSwitcher` receives:
   - `currentPathwayId` (from server)
   - `accessiblePathways[]` (from `listPathwaysCompatibleWithSubscription`)
3. On program switch:
   - Call `PATCH /api/learner/profile` to update `user.learnerPath`
   - Navigate to `/app/command-center?pathwayId={newId}`
4. On next render, server loads new pathway from DB

### Accessible pathways by tier

| User Tier | Accessible Programs |
|---|---|
| RN (CA) | NCLEX-RN (CA) |
| RN (US) | NCLEX-RN (US), New Grad |
| RPN (CA) | REx-PN (CA) |
| LPN (US) | NCLEX-PN (US) |
| NP (US) | FNP, AGPCNP, PMHNP, WHNP, PNP-PC |
| NP (CA) | CNPLE |
| ALLIED | Allied Core (US or CA) |

---

## Accessibility Review

| Requirement | Implementation |
|---|---|
| Keyboard navigation | All nav items are `<a>` elements; tab order: logo → program → continue → nav items → collapse |
| ARIA landmarks | Sidebar: `<nav aria-label="Study workspace">`, Header: `<header>`, Content: `<main>` (existing) |
| ARIA current page | `aria-current="page"` on active nav link |
| Screen reader section labels | `<span class="sr-only">` for section headers (LEARN, PRACTICE, etc.) |
| Collapse button | `aria-label="Collapse sidebar"` / `"Expand sidebar"` toggled by state |
| Mobile drawer | `role="dialog"`, `aria-label="Navigation menu"`, `aria-modal="true"`, focus trapped |
| Color contrast | All text uses semantic tokens with 4.5:1 minimum contrast across all themes |
| Touch targets | Min 44×44px for all interactive elements (`min-h-11`, `min-w-11`) |
| Reduced motion | Sidebar animation respects `prefers-reduced-motion` |
| Tooltip on collapse | `title` attribute on collapsed icon-only nav items |

---

## Performance Considerations

| Concern | Solution |
|---|---|
| Sidebar re-renders on route change | Sidebar is in layout.tsx (Next.js server component boundary); client state preserved across routes via React tree |
| Hydration flicker on collapse state | CSS default is expanded; `useEffect` reads localStorage and transitions; 200ms ease imperceptible |
| Layout shift | `--workspace-sidebar-w` CSS var applied synchronously via `data-sidebar-collapsed` attribute before paint |
| Continue Studying card latency | Wrapped in `<Suspense>` with skeleton; streams in independently, never blocks layout render |
| Icon bundle size | Use SVG inline or lucide-react tree-shaking; icons are small |
| Mobile drawer | Rendered lazily (only when open state is true); uses CSS `translate` not `display:none` to avoid reflow |
| Sidebar scroll | `overflow-y: auto` on sidebar container; `will-change: scroll-position` removed to avoid GPU overhead |
| `usePathname()` cost | Memoized nav items; re-render only on pathname change |

---

## CSS Architecture

```css
/* Workspace CSS custom properties */
--workspace-sidebar-w:            280px
--workspace-sidebar-w-collapsed:   72px
--workspace-header-h:              56px
--workspace-sidebar-bg:            var(--semantic-surface)
--workspace-sidebar-border:        var(--semantic-border-soft)
--workspace-nav-hover:             color-mix(in srgb, var(--semantic-brand) 8%, transparent)
--workspace-nav-active-bg:         color-mix(in srgb, var(--semantic-brand) 12%, transparent)
--workspace-nav-active-fg:         var(--semantic-brand)
--workspace-section-label:         var(--semantic-text-muted)
```

All colors derive from semantic tokens — workspace works with every theme automatically.
