# RN Lesson Detail — Reading Workspace v2 (Design Spec)

**Status:** Design-only — PNG exports in `lesson-mockups/exports/lesson-detail-v2/`  
**Preview:** Open `rn-lesson-detail-reading-v2-design.html` in a browser

---

## Non-negotiables

| Rule | Detail |
|------|--------|
| Theme system | Keep `--nn-hub-cat-accent`, `--lsc-*`, `data-lsc-role`, semantic tokens |
| Reading first | Center column owns layout; sidebars yield first |
| Section cards | Every section = own container (not one article blob) |
| Left nav | ≤240px, collapsible, drawer on mobile |
| Right rail | ≤220px, compact progress/TOC, collapsible |
| No narrow column | Target ~88–96ch prose inside full-width surface |

---

## Layout (desktop ≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ Site nav (unchanged)                                        │
├─────────────────────────────────────────────────────────────┤
│ Lesson header — title, meta chips, progress                 │
├──────────┬──────────────────────────────────────┬───────────┤
│ Left TOC │ Reading surface (dominant)           │ Progress  │
│ ~240px   │ Section cards stacked, full width    │ ~200px    │
│ collapse │ inside surface                       │ collapse  │
└──────────┴──────────────────────────────────────┴───────────┘
```

Grid: `minmax(10.5rem, 15rem) minmax(0, 1fr) minmax(10.5rem, 13.75rem)`

Collapsed: `3.25rem | 1fr | 3.25rem`

---

## Section card (all sections)

- Uniform 1px border (no thick left accent bar)
- Role color on section label/eyebrow only + very light `--lsc-soft` fill
- **No box-shadow** on section cards (flat, calm)
- Padding: 1.9–3rem
- Cards **wrap around** floated sticky rails — full width between rails, no narrow center gutter
- Prose uses full card width (no artificial 96ch cap in layout)

## Pearls & tips placement (v2.2+)

- **Desktop:** clinical pearls under left Contents rail only (no right study tips column)
- **Progress (v2.6):** full-width strip above lesson body (not in right rail)
- **Card spacing (v2.6):** all sections in `.reading-stack` flex column (`gap: 14px`) — no per-card grid rows (fixes huge gaps)
- **Wrap:** lower cards use negative margin to extend under left/right columns
- **Collapsed rails / mobile:** pearls + tips at **bottom of lesson** in a footer stack
- Compact mini-boxes (~11px type), light tinted backgrounds on white page

## Visual tone

- Page background: **white** (`#ffffff`), not grey-blue
- Section cards: very light role tints (near-white), soft borders, **no shadows**
- Reduced muddy color-mix; airy, clinical brightness

---

## Mobile

- TOC → drawer overlay
- Full-width reading surface
- Section cards stack with 48px+ tap-friendly spacing
- No horizontal scroll

---

## PNG deliverables

| File | Description |
|------|-------------|
| `desktop-reading-workspace-ocean.png` | Full desktop, rails open |
| `desktop-reading-collapsed-rails.png` | Both rails collapsed |
| `mobile-reading-drawer.png` | Mobile with TOC drawer |
| `mobile-reading-fullwidth.png` | Mobile reading only |

---

## Implementation note (after approval)

Presentation-layer only — extend existing `LessonReadingViewport`, `LessonSectionCard`, `lesson-readability-hotfix.css`. No routing/auth/pipeline changes.
