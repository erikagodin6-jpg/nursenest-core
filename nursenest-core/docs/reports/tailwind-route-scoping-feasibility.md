# Tailwind v4 Route-Scoping Feasibility Study
Generated: 2026-05-13

## Executive Summary

**Route-scoped Tailwind entry points are NOT feasible for this project.**
The shared component layer uses 2,315 unique Tailwind utilities that are imported
by marketing, learner, and admin routes simultaneously. Splitting would duplicate
Tailwind's preflight/base across routes and break shared components.

---

## Audit Data

| Route Family | Unique Utilities | Total Uses |
|---|---|---|
| shared (components + lib) | 2,315 | 68,269 |
| admin | 890 | 22,804 |
| marketing | 833 | 11,989 |
| learner | 402 | 3,156 |
| tests | 44 | — |

| Classification | Count | % of total |
|---|---|---|
| Multi-family (shared across 2+ routes) | 1,310 | 54.4% |
| Shared-component-only | 547 | 22.7% |
| Admin-only | 22 | 0.9% |
| Learner-only | 22 | 0.9% |
| Marketing-only | 25 | 1.0% |

**Only 69 utilities (2.9%) are exclusive to a single non-shared route family.**
Scoping those would save at most ~5.4 KB — not meaningful.

---

## Feasibility Questions Answered

### 1. Can Tailwind v4 be split into multiple CSS entry points safely?

**No, not safely for this project.**

Tailwind v4 uses a single `@import "tailwindcss"` entry point in `globals.css`.
Adding a second `@import "tailwindcss"` in a child layout CSS file would:
- Duplicate the `@layer properties` block (~40 KB of CSS custom properties)
- Duplicate the Tailwind preflight/base reset
- Potentially conflict with `@theme inline` token definitions
- The second Tailwind instance would generate its own utility set independently

Tailwind v4 does NOT support the "split entry points" pattern natively.

### 2. How does App Router CSS import ordering affect this?

Next.js App Router loads CSS in this order:
1. Root layout CSS (globals.css → all routes)
2. Child layout CSS (marketing/learner/admin → respective routes)
3. Page CSS

If two different layouts both import `@import "tailwindcss"`, the second import would
regenerate the entire Tailwind utility set, creating ~900 KB of duplicate CSS for
routes that use both (e.g., marketing homepage loads root + marketing layout CSS).

### 3. Would multiple Tailwind imports duplicate base/preflight?

**Yes.** Tailwind v4's preflight (`@layer base`) resets browser styles. Importing it
twice would cause a second pass of resets, which is unnecessary and could cause subtle
rendering differences.

### 4. How would this affect themes/tokens?

The `@theme inline` block in `globals.css` defines CSS custom property mappings
(--color-heading, --color-muted-foreground, etc.) that back Tailwind utilities.
A second Tailwind entry point would not see these `@theme inline` definitions
unless the second entry point also imports the same `@theme inline` block.

This would require duplicating the entire ~140-line `@theme inline` block in each
entry point CSS file, creating a maintenance burden.

### 5. How would this affect build time and memory?

The current webpack build already OOMs at ~7.5 GB RSS on the production container.
Running Tailwind CSS generation multiple times (once per entry point) would increase
peak memory by 20–40% and build time proportionally.

### 6. Which route family should be tested first?

If a pilot is attempted despite the above constraints:
- **Admin** has the most admin-only arbitrary values (17 unique) and admin-specific
  color tokens not used in marketing. It would be the safest family to scope.
- Marketing is the WORST choice to isolate because `src/components` (shared) uses
  most marketing utilities too (buttons, cards, forms).

---

## Alternative Approaches That DO Work

### A. Named CSS Class Extraction (Recommended — Phase 3/4)

Convert high-frequency Tailwind utility combinations in marketing/learner components
to named CSS classes in the route-scoped CSS files already created (Phase 2).

Example: The marketing CTA pattern (`inline-flex items-center justify-center ...`)
repeated 78 times → extract to `.nn-marketing-cta-primary` in `marketing-global.css`.

This does NOT reduce the Tailwind utility CSS in the root bundle but improves
authoring quality and enables cleaner measurement of "marketing CSS" separately.

### B. Arbitrary Value Consolidation (High Impact)

**2,756 arbitrary value CSS rules total 333 KB** in the compiled root CSS.
The top categories:
- `bg-[color-mix(in_srgb,...)]` — 746 rules (~100 KB)
- `border-[color-mix(...)]` — 563 rules (~70 KB)
- `text-[specific-px]` — 259 rules (~30 KB)
- `min-h-[...]` — 74 rules (~10 KB)

Converting repeated arbitrary color-mix expressions to Tailwind opacity modifiers
(`bg-background/78` instead of `bg-[color-mix(in_srgb,var(--background)_78%,...)]`)
is the **highest-impact single change available** and could save 80–150 KB.

Blocker: Tailwind v4 uses `oklch` color space for opacity modifiers vs `srgb` in
the current arbitrary values. Visual parity verification is required.

### C. @source Configuration (Future Work)

Tailwind v4 supports `@source none` + explicit `@source` declarations to restrict
what files are scanned for utility generation. This is currently not used, and
implementing it could reduce utility output by excluding test files, Storybook,
and generated JSON files that may contain class-like strings.

Estimated saving: 30–80 KB (needs measurement after implementation).

---

## Recommendation

Do NOT implement route-scoped Tailwind in this sprint. The feasibility blockers are
significant and the maximum saving (5.4 KB) does not justify the risk.

Focus instead on:
1. **Arbitrary value consolidation** (Phase 4 pilot) — most impactful
2. **Named class extraction** for marketing/learner component patterns
3. **@source configuration** — future sprint, low risk

---

## Current CSS Bundle State (Reference)

| Chunk | Size | Routes |
|---|---|---|
| Root CSS (globals + tokens + a11y) | 1,170 KB | All |
| Marketing CSS chunk | 376 KB | Marketing only |
| Learner CSS chunk | 132 KB + 64 KB | Learner only |

Tailwind utility CSS accounts for approximately **900 KB** of the 1,170 KB root bundle.
Custom CSS (nn-* classes, theme blocks) accounts for ~270 KB.
