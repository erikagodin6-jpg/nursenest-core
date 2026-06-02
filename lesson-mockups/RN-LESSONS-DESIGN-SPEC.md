# RN Lessons Hub & Lesson Page — Design System v3

**Deliverable:** 12 hub concepts + 12 lesson page concepts (desktop + mobile)  
**Gallery:** Open `rn-lessons-design-gallery-v3.html` in a browser  
**Status:** Concept exploration — not production implementation

---

## Design principles

| Principle | Requirement |
|-----------|-------------|
| Content width | Max 1400–1600px; never crush content with sidebars |
| Navigation | Top nav only, or minimal collapsible rail — no permanent wide sidebar |
| Section cards | Every major topic gets its own colored box — never one giant text blob |
| Whitespace | Generous vertical rhythm (48–96px between major blocks) |
| Tone | Premium health-tech / educational SaaS — bright, calm, engaging |
| Study sessions | Optimized for 30–90 minute reading; low visual fatigue |

---

## Typography system

| Token | Desktop | Mobile | Weight | Use |
|-------|---------|--------|--------|-----|
| `--font-display` | DM Sans | DM Sans | 700–800 | Page titles, hero |
| `--font-body` | DM Sans | DM Sans | 400–500 | Body copy |
| `--text-hero` | 48–56px | 32–36px | 800 | Hub hero |
| `--text-h1` | 40–48px | 28–32px | 800 | Lesson title |
| `--text-h2` | 28–32px | 22–24px | 700 | Section card titles |
| `--text-h3` | 20–22px | 18px | 700 | Subsections |
| `--text-body` | 17–18px | 16px | 400 | Lesson content |
| `--text-small` | 13–14px | 12–13px | 500 | Meta, labels |
| `--leading-body` | 1.75–1.85 | 1.7 | — | Long-form reading |
| `--measure` | 72ch max | 100% | — | Prose width inside cards |

---

## Spacing & layout

| Token | Value | Use |
|-------|-------|-----|
| `--space-page-x` | clamp(20px, 4vw, 48px) | Horizontal page padding |
| `--space-section` | 64–96px | Between hub sections |
| `--space-card` | 28–40px | Inside section cards |
| `--space-stack` | 24–32px | Between lesson section cards |
| `--radius-card` | 16–24px | Section containers |
| `--radius-pill` | 999px | Chips, filters |
| `--max-width` | 1520px | Page shell |

---

## Section colour system (lesson pages)

Maps to `lesson-section-theme.ts` roles. Each section card uses:

- **Background:** `color-mix(in srgb, token 8%, white)`
- **Border:** `color-mix(in srgb, token 22%, transparent)`
- **Accent bar:** 4px left border or top gradient strip
- **Icon badge:** 40×40 rounded square with token at 12% opacity

| Section | Token | Light hex | Role |
|---------|-------|-----------|------|
| Pathophysiology | `--sec-patho` | #2563eb | concept |
| Signs & Symptoms | `--sec-sx` | #0d9488 | warning |
| Assessment Findings | `--sec-assess` | #0891b2 | diagnostic |
| Labs & Diagnostics | `--sec-labs` | #0284c7 | diagnostic |
| Nursing Interventions | `--sec-interv` | #16a34a | action |
| Medications | `--sec-meds` | #7c3aed | success |
| Patient Teaching | `--sec-teach` | #059669 | education |
| Safety Considerations | `--sec-safety` | #dc2626 | danger |
| NCLEX Pearls | `--sec-pearl` | #d97706 | review |
| Prioritization | `--sec-priority` | #ea580c | review |
| Delegation | `--sec-delegate` | #6366f1 | application |
| Clinical Scenarios | `--sec-scenario` | #9333ea | application |
| Practice Questions | `--sec-practice` | #4f46e5 | cta |

**Contrast:** All text on tinted backgrounds uses `--text-primary` (#0f172a light / #f0f6ff dark) with minimum 4.5:1 on body text.

---

## Component library

### Hub components

| Component | Description | States |
|-----------|-------------|--------|
| `HubHero` | Title, subtitle, progress ring, CTA | default, loading |
| `ProgressOverview` | Streak, % complete, time studied | hover tooltips |
| `CategoryPill` | Med-Surg, Pharm, etc. | default, active, hover |
| `LessonCard` | Title, category, progress bar, time | hover lift, active border |
| `FeaturedStrip` | High-yield horizontal scroll | scroll-snap |
| `WeakAreaCard` | Recommended remediation | pulse on new |
| `ContinueStudying` | Last lesson + resume CTA | progress fill animation |
| `RecentRow` | Compact list with thumbnails | hover |
| `SearchFilter` | Query + category filters | focus ring |

### Lesson components

| Component | Description | States |
|-----------|-------------|--------|
| `LessonHeader` | Title, meta chips, progress | sticky shrink |
| `SectionNav` | Horizontal pill nav (no sidebar) | active, scroll-sync |
| `SectionCard` | Coloured box per topic | expanded, collapsed |
| `SectionCardHeader` | Icon, title, chevron | hover |
| `PracticeBlock` | MCQ inside indigo card | selected, correct, wrong |
| `ReviewDock` | Bottom sticky post-test CTA | visible on scroll end |
| `ProgressRail` | Thin left spine (optional) | fill on scroll |

### Microinteractions

- Card hover: `translateY(-2px)` + shadow deepen (150ms ease)
- Section expand: height transition 280ms `cubic-bezier(0.4, 0, 0.2, 1)`
- Progress bar: width animation 400ms on load
- Category pill: background fill slide on active
- Search: border glow `box-shadow: 0 0 0 3px var(--primary-s)`

---

## Hub design priorities (v4)

1. **Categories are primary** — large “Browse by category” section dominates the page  
2. **Resume is compact** — single-line bar (~48px), not a hero-sized CTA  
3. **No emojis** — SVG icons or typographic badges only  
4. **Five themes** — Ocean, Blossom, Aurora, Sunset, Midnight (matches `theme-palettes.css`)  
5. **Bright & breathable** — white surfaces, soft borders, theme accent colours (`--c1`–`--c6`)

## 12 Lessons Hub concepts (v4)

| # | Name | Direction |
|---|------|-----------|
| H1 | **System Cards (2-col)** | Category cards with lesson preview rows |
| H2 | **Category Tiles (3-col)** | Large bright tiles |
| H3 | **Hero Tiles (4-col)** | Spacious 4-column grid |
| H4 | **Mixed Grid** | System cards + compact tiles |
| H5 | **Category List** | Full-width rows with accent bar |
| H6 | **Category Focus** | Minimal hero, oversized category block |
| H7 | **Horizontal Scroll** | Scrollable category panels |
| H8 | **Bento Categories** | Asymmetric grid — categories dominate |
| H9 | **Ultrawide (3-col)** | 3-column system cards at 1520px |
| H10 | **Ultra Minimal** | Tiny header, categories fill viewport |
| H11 | **Tiles + Progress** | Tiles with completion % |
| H12 | **Full Grid + Footer** | All categories + small high-yield strip |

---

## 12 Lesson Page concepts

| # | Name | Direction | Key traits |
|---|------|-----------|------------|
| L1 | **Color-Coded Stack** | Card stack | 12 distinct section cards, full width |
| L2 | **Editorial Reader** | Magazine | Wide hero, chapter-like sections |
| L3 | **Modular Grid** | 2-col ultrawide | Section cards in responsive grid |
| L4 | **Clinical Workflow** | Process flow | Recognize → Assess → Intervene sequence |
| L5 | **Sticky Pill Nav** | Nav-first | Top pills only, no sidebar |
| L6 | **Accordion Study** | Collapsible | All sections collapsed by default |
| L7 | **Progress Spine** | Thin rail | 4px left progress spine, not a sidebar |
| L8 | **Health-Tech Panels** | Clinical SaaS | Icon headers, clean panels |
| L9 | **Soft Neumorphism** | Soft UI | Raised cards, subtle shadows |
| L10 | **Premium Magazine** | Luxury editorial | 96px section gaps, large type |
| L11 | **Practice Dock** | Interactive | Indigo practice cards + bottom dock |
| L12 | **Dark Clinical** | Dark mode | Polished dark + vibrant section accents |

---

## Responsive breakpoints

| Breakpoint | Width | Hub behavior | Lesson behavior |
|------------|-------|--------------|-----------------|
| Mobile | &lt;640px | Single column, stacked cards | Section cards full width, nav scroll |
| Tablet | 640–1024px | 2-col category grid | Single column cards |
| Desktop | 1024–1440px | 3–4 col grid | Full-width cards, max 1520px |
| Ultrawide | &gt;1440px | 4–5 col or bento | Optional 2-col section grid (L3) |

---

## Dark mode

- Background: `#07111f` → `#111827` surfaces (not flat grey)
- Section cards: token at 12% opacity on `#152032`
- Borders: `rgba(56, 189, 248, 0.15)` accent family
- Text: `#f0f6ff` primary, `#94a3b8` muted
- Avoid: muddy `#333` on `#444` stacks

---

## Implementation path (when ready)

1. **Review** gallery HTML with stakeholders — pick 1–2 hub + 1–2 lesson directions  
2. **Converge** tokens into `theme-palettes.css` + `lesson-readability-hotfix.css`  
3. **Hub:** `lessons-page-shell.tsx`, `marketing-lessons-hub-category-first-index.tsx`  
4. **Lesson:** `pathway-lesson-detail-page-body.tsx`, `lesson-section-card.tsx`  
5. **Contract tests:** `premium-lesson-reading-architecture-v2.contract.test.ts`  
6. **E2E:** `pathway-lessons-hub-premium.spec.ts`, `lesson-detail-premium-smoke.spec.ts`

---

## Files

| File | Purpose |
|------|---------|
| `rn-lessons-design-gallery-v3.html` | Interactive 12+12 concept gallery |
| `RN-LESSONS-DESIGN-SPEC.md` | This specification |
| `lessons-hub-mockup.html` | Legacy 5-theme hub mockup |
| `lesson-redesign-premium-mockups.html` | Legacy premium lesson mockups |
