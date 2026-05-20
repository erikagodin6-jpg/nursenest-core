# NurseNest Homepage — Premium Clinical Redesign (Preview Only)

**Scope:** Preview-only redesign of `/preview/homepage` inside the isolated UI preview
system. **No production homepage routes were modified.**

## Files touched

| File | Change |
|------|--------|
| `src/components/ui-preview/nursenest-premium-preview.tsx` | Replaced flat hero + repetitive pathway cards + thin "ecosystem" preview with a layered, clinically immersive homepage (8 redesigned sections). All non-homepage surfaces (lesson, dashboard, exam, flashcards, marketing, blog, tools) are preserved unchanged. |

`src/lib/ui-preview/preview-surfaces.ts` and
`src/app/(preview)/preview/[surface]/page.tsx` were **not** modified — only the
homepage rendering path was redesigned.

## New homepage section architecture

`HomepagePreview()` now composes 8 distinct sections, in order:

1. **`PremiumHero`** — Layered hero with eyebrow trust pills, large "Master nursing.
   Think like a clinician." headline, premium CTA grouping, 4 micro-stats, pathway
   quick-jump pills, ambient depth blurs, and a side `ClinicalHeroPanel`.

2. **`ClinicalHeroPanel`** (lives inside hero) — A floating clinical study card
   featuring a mock heart-failure lesson with:
   - Floating readiness badge (84%)
   - Phase progress dots (Readiness → Study → Reinforce → Mastered)
   - 2×2 semantic section cards (Assessment / Labs / Red Flag / Intervention)
   - Inline ECG strip SVG + lab values panel
   - Stat bar at the bottom (lessons / flashcards / CAT engine)

3. **`StatsTrustBand`** — Horizontal 6-stat strip (12k+ learners, 94% organized,
   420+ lessons, 2.8k flashcards, 1.2k questions, adaptive CAT).

4. **`PathwayShowcase`** — Each pathway has a *truly distinct* visual identity:
   - **RN** (large featured, blue) — body-system icon grid (Cardiac, Respiratory,
     Renal, Neuro, GI, Pharm) + NCLEX priority cue + 4 bullet checks.
   - **RPN/PN** (green) — workflow steps (Assess → Delegate → Administer → Escalate).
   - **NP** (large, purple) — diagnostic reasoning chain (HPI → Exam → Differential
     → Diagnostics → Prescribe) + 3 specialty pills.
   - **Pre-Nursing** (amber) — milestone roadmap (Prereqs → Sciences → Apply →
     Program → Clinical) with done/active/pending states.
   - **Allied Health** (teal) — 8 occupation chips (Paramedic, MLT, Imaging, RRT,
     PSW, Dental, Pharmacy, Physio).

5. **`LessonSystemPreview`** — Two-column premium card showing the 9 semantic
   section types of the lesson system, with a clinical visuals panel (ECG strip
   with rate/rhythm/priority + 6 priority lab values).

6. **`StudyEcosystemFlow`** — 4-step study loop with miniature live previews:
   1. Read the Lesson (semantic section list)
   2. Recall with Flashcards (Again/Hard/Good/Easy buttons)
   3. Practice Questions (selected option preview)
   4. Adaptive CAT Exam (domain readiness bars)

7. **`ReadinessIntelligence`** — Two-column dashboard preview:
   - Left: 5 domain mastery bars + 3-cell streak/weak/completion strip.
   - Right: "Today's Priority" recommendation card + 4-step study plan.

8. **`TestimonialStrip`** — 3 student testimonials (RN / NP / RPN) with 5-star
   ratings, color-tinted by pathway.

9. **`PremiumConversionCTA`** — Final CTA with trust signals (no card required,
   cancel anytime, all pathways included).

## Visual system

- **Multiple semantic hues** per pathway (blue / green / purple / amber / teal),
  not a single brand bar everywhere.
- **Soft `color-mix` tints** on every semantic surface for premium depth without
  harsh fills.
- **Multi-layer shadows**: `0_28px_70px_rgba(15,23,42,0.12)` on hero/feature cards,
  `0_20px_55px_rgba(15,23,42,0.09)` on secondary cards.
- **Ambient blurs** behind the hero and CTA for clinical immersion.
- **Inline SVG ECG strip** as a recurring clinical signature visual.
- **Body-system icon language** (HeartPulse, Activity, FlaskConical, Brain,
  FileText, PillIcon) used consistently inside the RN card and lesson preview.

## Themes

All 4 themes preserved: **Blossom · Ocean · Forest · Midnight**. Token-based
(`--preview-accent`, `--preview-accent-2`, `--preview-surface`, etc.) so the
redesign theme-switches cleanly without re-coloring entire regions to one hue.
The fixed bottom theme switcher remains.

## Responsive behavior

- **Desktop**: 2-col hero (1.05fr / 1fr), 2-col pathway grid, 4-col ecosystem.
- **Tablet (sm/md)**: hero stacks, pathway grid collapses to 2-col with RN
  spanning 2 rows, ecosystem becomes 2-col.
- **Mobile**: full single column, stat band shows top 3 stats, micro-stat chip
  grid wraps to 2-col, pathway pills wrap.
- All CTAs remain `h-12` (thumb-friendly).

## Safety / governance compliance

- **Logo preserved** — still uses `<BrandLeafIcon />`.
- **No production routes changed** — `src/app/(preview)/preview/[surface]/page.tsx`
  and `src/lib/ui-preview/preview-surfaces.ts` were not modified.
- **Client component** (`"use client"`) — same as the previous file.
- **No new heavy libraries** — only existing `lucide-react`, `@/components/ui/*`,
  and `BrandLeafIcon` imports.
- **No Prisma / DB / server imports.**
- **All surface kinds** (lesson, dashboard, admin, flashcards, exam, blog,
  marketing, tools) still routed correctly via `SurfaceBody`.
- **i18n / SEO / auth / entitlement / App Router** untouched.
- **Theme switching** preserved (Blossom / Ocean / Forest / Midnight).
- **Hard-coded hex colors** are confined to *semantic medical roles* (red = red
  flag, amber = warning, green = safe, blue = assessment, purple = advanced) —
  consistent with `.cursor/rules/semantic-color-guardrails.mdc` intent for
  multi-hue clinical data viz, layered on top of the theme tokens.

## Screenshots

The local dev server in this environment was unable to complete a render request
within timeout (memory-constrained host). The new visual identity should be
verified by running:

```bash
cd nursenest-core
npm run dev
# then visit:
#   http://localhost:3000/preview/homepage
#   http://localhost:3000/preview/homepage?theme=midnight
#   http://localhost:3000/preview/homepage?theme=blossom
#   http://localhost:3000/preview/homepage?theme=forest
```

Use the bottom theme switcher to compare all 4 palettes; resize to mobile/tablet
breakpoints to verify responsive behavior.
