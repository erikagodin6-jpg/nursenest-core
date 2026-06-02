# Exam Hub Hierarchy Cleanup Plan

## Current Redundancy (Canada RN example)
```
Breadcrumb: Home / Canada / RN / NCLEX-RN
Eyebrow:    NCLEX-RN (uppercase)
H1:         NCLEX-RN Practice Questions for Canada
```
→ "NCLEX-RN" appears 3x above the fold

## Changes

### 1. Breadcrumbs (pathway-breadcrumbs.ts)
- Remove the role track crumb from `pathwayOverviewBreadcrumbs`
- New pattern: Home → Country → NCLEX-RN (exam name only)
- Reduces repetition: "RN" + "NCLEX-RN" → just "NCLEX-RN"

### 2. Eyebrow label (nursing-tier-hub-page.tsx)
- Change from: `pathway.shortName` (e.g., "NCLEX-RN")
- Change to: country label with softer styling (e.g., "Canada")
- If country is ambiguous, use "NCLEX-RN Canada" in muted lowercase

### 3. Back links (nursing-tier-hub-page.tsx)
- Add a subtle "← Overview" back link above the H1
- Uses just "Overview" not "NCLEX-RN Overview"

### 4. H1 (nursing-tier-hub-page.tsx)
- Keep as the primary dominant exam title
- No changes needed (already uses `content.title`)

### 5. Typography (marketing-pathway-hub-hero-band.tsx)
- Reduce padding on hero band (px-6 pt-6 pb-5 → px-6 pt-5 pb-4)
- Reduce heading sizes via CSS class adjustments

### 6. Navigation tabs (lesson-hub-surface-chips.tsx / marketing-lessons-hub-category-lessons-surface.tsx)
- Already consistent naming: Clinical Lessons, Adaptive CAT, Flashcards, Practice Exams, Exam Overview
- No changes needed

### Files to modify:
1. `src/lib/seo/pathway-breadcrumbs.ts` — Remove role crumb from `pathwayOverviewBreadcrumbs`
2. `src/components/marketing/nursing-tier-hub-page.tsx` — Fix eyebrow, add back link, reduce hero padding
3. `src/components/marketing/marketing-pathway-hub-hero-band.tsx` — Reduce padding/spacing