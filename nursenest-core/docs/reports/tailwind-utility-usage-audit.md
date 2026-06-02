# Tailwind Utility Usage Audit
Generated: 2026-05-13T14:36:33.291Z
Tailwind version: 4.2.4  •  Entry point: `src/app/globals.css`

## Executive Summary

| Metric | Count |
|---|---|
| Total unique Tailwind utilities | **2407** |
| Multi-family (shared across routes) | 1310 |
| Shared-component-only | 1017 |
| Marketing-only | 25 |
| Learner-only | 22 |
| Admin-only | 22 |
| Tests-only | 11 |
| Arbitrary value utilities | **828** |
| Responsive variants | 465 |
| Hover/focus variants | 165 |
| Dark-mode variants | 39 |

## Key Finding: Route-Scoped Tailwind Is Not Feasible

**1310 of 2407 utilities (54.4%) are used across multiple route families.**
The shared component layer (buttons, cards, badges, menus) uses Tailwind utilities
that are imported by marketing, learner, and admin routes simultaneously.

Only **46 utilities** are exclusively in learner or admin routes.
At ~120 bytes/utility, scoping them would save at most ~5.4 KB — not significant
compared to the ~900 KB total Tailwind utility output.

## Per-Family Utility Counts

| Family | Unique Utilities | Files |
|---|---|---|
| marketing | 833 | |
| learner | 402 | |
| admin | 890 | |
| shared | 2315 | |
| tests | 44 | |

## Top 100 Utilities by Usage

```
font-semibold                                    943x  MULTI_FAMILY
text-sm                                          910x  MULTI_FAMILY
flex                                             887x  MULTI_FAMILY
border                                           798x  MULTI_FAMILY
text-xs                                          729x  MULTI_FAMILY
items-center                                     642x  MULTI_FAMILY
mt-2                                             620x  MULTI_FAMILY
px-4                                             607x  MULTI_FAMILY
flex-wrap                                        595x  MULTI_FAMILY
gap-2                                            573x  MULTI_FAMILY
gap-3                                            561x  MULTI_FAMILY
uppercase                                        542x  MULTI_FAMILY
rounded-xl                                       520x  MULTI_FAMILY
font-medium                                      517x  MULTI_FAMILY
rounded-full                                     498x  MULTI_FAMILY
mt-1                                             477x  MULTI_FAMILY
font-bold                                        471x  MULTI_FAMILY
mx-auto                                          444x  MULTI_FAMILY
w-full                                           440x  MULTI_FAMILY
inline-flex                                      436x  MULTI_FAMILY
grid                                             434x  MULTI_FAMILY
mt-3                                             430x  MULTI_FAMILY
flex-col                                         429x  MULTI_FAMILY
px-3                                             429x  MULTI_FAMILY
mt-4                                             426x  MULTI_FAMILY
rounded-2xl                                      416x  MULTI_FAMILY
shrink-0                                         415x  MULTI_FAMILY
text-[var(--theme-heading-text)]                 411x  MULTI_FAMILY
py-2                                             403x  MULTI_FAMILY
tracking-wide                                    396x  MULTI_FAMILY
justify-between                                  386x  MULTI_FAMILY
rounded-lg                                       367x  MULTI_FAMILY
leading-relaxed                                  352x  MULTI_FAMILY
border-[var(--semantic-border-soft)]             350x  MULTI_FAMILY
p-4                                              346x  MULTI_FAMILY
text-primary                                     343x  MULTI_FAMILY
gap-4                                            340x  MULTI_FAMILY
justify-center                                   332x  MULTI_FAMILY
text-muted-foreground                            311x  MULTI_FAMILY
space-y-2                                        296x  MULTI_FAMILY
hover:underline                                  287x  MULTI_FAMILY
min-w-0                                          279x  MULTI_FAMILY
max-w-3xl                                        278x  MULTI_FAMILY
text-lg                                          272x  MULTI_FAMILY
text-[var(--semantic-text-secondary)]            264x  MULTI_FAMILY
text-[var(--semantic-text-primary)]              264x  MULTI_FAMILY
h-4                                              262x  MULTI_FAMILY
sm:grid-cols-2                                   260x  MULTI_FAMILY
p-5                                              259x  MULTI_FAMILY
flex-1                                           253x  MULTI_FAMILY
border-b                                         253x  MULTI_FAMILY
w-4                                              249x  MULTI_FAMILY
text-center                                      246x  MULTI_FAMILY
text-[var(--theme-muted-text)]                   245x  MULTI_FAMILY
py-3                                             244x  MULTI_FAMILY
space-y-4                                        244x  MULTI_FAMILY
text-[var(--semantic-text-muted)]                243x  MULTI_FAMILY
mt-6                                             240x  MULTI_FAMILY
border-t                                         238x  MULTI_FAMILY
underline                                        238x  MULTI_FAMILY
sm:px-6                                          235x  MULTI_FAMILY
overflow-hidden                                  224x  MULTI_FAMILY
text-[11px]                                      223x  MULTI_FAMILY
border-border                                    222x  MULTI_FAMILY
max-w-2xl                                        213x  MULTI_FAMILY
items-start                                      213x  MULTI_FAMILY
shadow-sm                                        209x  MULTI_FAMILY
p-6                                              209x  MULTI_FAMILY
py-1.5                                           209x  MULTI_FAMILY
space-y-3                                        205x  MULTI_FAMILY
px-2                                             197x  MULTI_FAMILY
bg-[var(--semantic-surface)]                     194x  MULTI_FAMILY
text-[10px]                                      194x  MULTI_FAMILY
text-[var(--semantic-brand)]                     194x  MULTI_FAMILY
text-base                                        193x  MULTI_FAMILY
space-y-6                                        193x  MULTI_FAMILY
px-5                                             192x  MULTI_FAMILY
text-left                                        188x  MULTI_FAMILY
mt-8                                             187x  MULTI_FAMILY
text-2xl                                         186x  MULTI_FAMILY
mt-0.5                                           184x  MULTI_FAMILY
text-balance                                     181x  MULTI_FAMILY
py-2.5                                           180x  MULTI_FAMILY
lg:px-8                                          175x  MULTI_FAMILY
text-foreground                                  175x  MULTI_FAMILY
py-1                                             172x  MULTI_FAMILY
py-0.5                                           172x  MULTI_FAMILY
sm:flex-row                                      171x  MULTI_FAMILY
transition                                       171x  MULTI_FAMILY
leading-snug                                     166x  MULTI_FAMILY
font-mono                                        163x  MULTI_FAMILY
block                                            161x  MULTI_FAMILY
rounded                                          160x  MULTI_FAMILY
h-5                                              153x  MULTI_FAMILY
gap-1                                            151x  MULTI_FAMILY
space-y-1                                        151x  MULTI_FAMILY
items-end                                        151x  MULTI_FAMILY
list-disc                                        150x  MULTI_FAMILY
gap-1.5                                          150x  MULTI_FAMILY
w-5                                              149x  MULTI_FAMILY
```

## Arbitrary Value Utilities (828 total)

These generate one-off CSS rules and are the highest-cost per class.

```
text-[var(--theme-heading-text)]                     411x  MULTI_FAMILY
border-[var(--semantic-border-soft)]                 350x  MULTI_FAMILY
text-[var(--semantic-text-secondary)]                264x  MULTI_FAMILY
text-[var(--semantic-text-primary)]                  264x  MULTI_FAMILY
text-[var(--theme-muted-text)]                       245x  MULTI_FAMILY
text-[var(--semantic-text-muted)]                    243x  MULTI_FAMILY
text-[11px]                                          223x  MULTI_FAMILY
bg-[var(--semantic-surface)]                         194x  MULTI_FAMILY
text-[10px]                                          194x  MULTI_FAMILY
text-[var(--semantic-brand)]                         194x  MULTI_FAMILY
text-[var(--theme-body-text)]                        148x  MULTI_FAMILY
shadow-[var(--semantic-shadow-soft)]                 131x  MULTI_FAMILY
bg-[var(--theme-card-bg)]                            113x  MULTI_FAMILY
text-[var(--semantic-info)]                          102x  MULTI_FAMILY
text-[var(--semantic-success)]                        96x  MULTI_FAMILY
text-[var(--semantic-danger)]                         79x  MULTI_FAMILY
text-[var(--semantic-warning)]                        76x  MULTI_FAMILY
border-[var(--border-subtle)]                         73x  MULTI_FAMILY
text-[var(--theme-primary)]                           72x  MULTI_FAMILY
bg-[var(--semantic-panel-muted)]                      65x  MULTI_FAMILY
pb-[var(--nn-rhythm-tight-y)]                         61x  MULTI_FAMILY
pt-[var(--nn-rhythm-page-y)]                          61x  MULTI_FAMILY
text-[var(--palette-heading)]                         51x  MULTI_FAMILY
bg-[var(--semantic-brand)]                            50x  MULTI_FAMILY
text-[var(--palette-text-muted)]                      49x  MULTI_FAMILY
bg-[var(--bg-card)]                                   46x  MULTI_FAMILY
min-h-[44px]                                          45x  MULTI_FAMILY
transition-[width]                                    39x  MULTI_FAMILY
border-[var(--theme-card-border)]                     36x  MULTI_FAMILY
hover:bg-[var(--semantic-panel-muted)]                32x  MULTI_FAMILY
text-[9px]                                            30x  MULTI_FAMILY
text-[var(--semantic-chart-3)]                        29x  MULTI_FAMILY
shadow-[var(--elevation-rest)]                        29x  MULTI_FAMILY
tracking-[0.14em]                                     28x  MULTI_FAMILY
shadow-[var(--shadow-elevated)]                       27x  MULTI_FAMILY
bg-[var(--page-bg)]                                   27x  MULTI_FAMILY
text-[0.65rem]                                        26x  MULTI_FAMILY
bg-[var(--semantic-panel-cool)]                       24x  MULTI_FAMILY
text-[var(--semantic-warning-contrast)]               23x  MULTI_FAMILY
tracking-[0.12em]                                     23x  MULTI_FAMILY
text-[13px]                                           22x  MULTI_FAMILY
tracking-[0.18em]                                     22x  MULTI_FAMILY
text-[12px]                                           21x  MULTI_FAMILY
rounded-[1.75rem]                                     21x  MULTI_FAMILY
text-[var(--semantic-chart-2)]                        19x  MULTI_FAMILY
text-[var(--role-cta-foreground)]                     18x  MULTI_FAMILY
shadow-[var(--shadow-card)]                           18x  MULTI_FAMILY
border-[var(--header-nav-border)]                     18x  MULTI_FAMILY
min-w-[640px]                                         18x  MULTI_FAMILY
min-w-[720px]                                         17x  MULTI_FAMILY
```

## Prefix Group Analysis (Top 20)

| Prefix | Unique Classes | Total Uses |
|---|---|---|
| `text-` | 307 | 8622 |
| `mt-` | 34 | 3111 |
| `border-` | 153 | 2990 |
| `flex-` | 25 | 2497 |
| `gap-` | 90 | 2483 |
| `px-` | 38 | 2404 |
| `bg-` | 307 | 2293 |
| `font-` | 10 | 2214 |
| `rounded-` | 28 | 2212 |
| `py-` | 54 | 2064 |
| `w-` | 76 | 1515 |
| `space-` | 29 | 1412 |
| `p-` | 30 | 1408 |
| `grid-` | 68 | 1346 |
| `items-` | 19 | 1338 |
| `max-` | 100 | 1279 |
| `h-` | 56 | 1251 |
| `min-` | 160 | 896 |
| `justify-` | 14 | 891 |
| `tracking-` | 19 | 809 |

## Learner + Admin Only Utilities (46)

These could theoretically be excluded from the marketing/root CSS, but their
collective size is only ~5.4 KB, which is not significant.

```
max-w-[1200px]                                         9x
max-w-[1400px]                                         6x
sm:mt-3                                                5x
max-w-[1100px]                                         4x
bg-rose-500/[0.06]                                     3x
hover:opacity-75                                       3x
min-h-[70vh]                                           2x
border-rose-500/25                                     2x
bg-rose-500/[0.04]                                     2x
min-w-[760px]                                          2x
bg-amber-100                                           2x
lg:top-20                                              1x
lg:w-56                                                1x
xl:w-64                                                1x
rotate-6                                               1x
opacity-[0.05]                                         1x
rounded-l-2xl                                          1x
right-3                                                1x
lg:grid-cols-[1fr_340px]                               1x
text-[22px]                                            1x
sm:pt-0                                                1x
pt-[var(--nn-rhythm-shell-y)]                          1x
md:pb-[var(--nn-rhythm-shell-y)]                       1x
md:pt-1                                                1x
md:gap-2.5                                             1x
md:px-4                                                1x
sm:gap-x-3                                             1x
md:gap-x-3                                             1x
md:gap-y-2.5                                           1x
md:px-3.5                                              1x
md:py-2.5                                              1x
sm:grid-cols-[10rem_1fr]                               1x
max-w-[1280px]                                         1x
min-w-[920px]                                          1x
max-h-60                                               1x
min-w-[360px]                                          1x
min-w-[180px]                                          1x
border-emerald-500/20                                  1x
bg-emerald-500/[0.04]                                  1x
bg-[var(--theme-bg)]                                   1x
lg:min-h-screen                                        1x
bg-[var(--theme-muted-surface)]/35                     1x
bg-[var(--semantic-panel-positive)]/10                 1x
min-w-[32rem]                                          1x
border-muted                                           1x
max-w-[320px]                                          1x
```

## Reduction Opportunities

| Approach | Est. Saving | Risk | Effort |
|---|---|---|---|
| Convert top-20 utility combos → named CSS classes | 30–80 KB | Low | Medium |
| Remove arbitrary values → Tailwind scale values | 30–50 KB | Low | Medium |
| Add `@source none` + explicit source list | Unknown | High | High |
| Route-scoped Tailwind entry points | Not feasible | Very High | Very High |
| shadcn/ui component styles → CSS Modules | 50–150 KB | Medium | Very High |

## Recommended Next Steps

1. **Named class conversion (Phase 3/4):** Convert the top repeated utility combos
   (flex containers, badge patterns, muted labels, card shells) into semantic
   CSS classes. See `docs/reports/tailwind-named-class-candidates.md`.

2. **Arbitrary value reduction:** Replace `text-[11px]`, `max-w-[1200px]`,
   `min-w-[180px]` with nearest Tailwind scale values or named classes.
   This reduces the arbitrary-value inflation in the compiled CSS.

3. **Admin-specific utilities:** The 17 admin-only utilities (max-w-[1200px] etc.)
   could be moved to a scoped admin CSS block or named class. Low priority.

4. **Tailwind `@source` configuration:** Tailwind v4 scans the entire project
   by default. Adding explicit source configuration to restrict scanning to
   the application source (excluding tests, generated files, stories) could
   reduce noise utilities. Requires careful testing.
