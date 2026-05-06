# Mobile Layout Instability Map (CLS, hydration, dvh)

Instability = cumulative layout shift, hydration mismatch, viewport unit jumps (iOS URL bar), sticky jitter, flex min-content explosions.

| ID | Surface | File(s) | Mechanism | User-visible symptom | Sev | Mitigation idea | Tag |
|----|---------|-----------|-----------|----------------------|-----|-----------------|-----|
| LAY-01 | Marketing | `marketing-mobile-motion-shell.tsx` | SSR `serverNarrowViewportHint` vs client `matchMedia` | Motion wrapper swap shifts padding/margins | P2 | Reduce branch diff; prefer CSS `@media` for layout | AI_CAN_PREP_BUT_DEV_REVIEW |
| LAY-02 | Learner practice | `learner-exam-chrome.tsx` | `lg:h-[100dvh]` only large screens | Mobile vs desktop different scroll containers | P1 | Document or align `<lg` flex chain with `100dvh` | AI_CAN_PREP_BUT_DEV_REVIEW |
| LAY-03 | Learner shell | `layout.tsx` | Sticky header cluster + deferred `LearnerStudyNextBlock` Suspense | Skeleton → content height jump | P2 | Reserve min-height for study-next strip | AI_CAN_PREP_BUT_DEV_REVIEW |
| LAY-04 | iOS Safari | Global | `100vh` vs `100dvh` mix | Bottom bar covers CTAs | P2 | Prefer `dvh` + `safe-area` (partially done on bottom nav) | SAFE_FOR_AI |
| LAY-05 | Bottom nav | `learner-shell-primary-nav.tsx` | `flex-wrap` reflow when optional items appear | Nav height jumps when feature flags flip | P2 | Stable row height or “more” menu | AI_CAN_PREP_BUT_DEV_REVIEW |
| LAY-06 | Fonts / i18n | Marketing shards | Late shard load | Text reflow after hydration | P3 | font metric + skeleton width | DEVELOPER_ONLY |
| LAY-07 | Images LCP | Homepage hero | Image without dimensions | CLS | P2 | explicit `width`/`height` attrs | SAFE_FOR_AI |

**Hydration audit checklist (DEVELOPER_ONLY):** search for `typeof window`, `Date.now` in initial render, `localStorage` read before mount in marketing header — each can cause mismatch.

**Testing:** Playwright `expect(locator).toHaveCSS('transform', ...)` rarely useful; prefer **visual snapshots** + **CLS trace** (Web Vitals extension) on 3G throttling.
