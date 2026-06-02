# Premium Shell Architecture Governance

## Ownership Model

NurseNest uses one shell ownership model across the platform:

- **Root layout** owns providers, global theme bootstrapping, metadata, and app-wide CSS only.
- **Marketing shell** owns public SEO surfaces, pricing, onboarding, auth-adjacent marketing pages, public hubs, `SiteHeader`, and `SiteFooter`.
- **Learner shell** owns authenticated learner navigation, NurseNest brand lockup, pathway context, account access, theme control, mobile bottom nav, and lightweight continuity signals.
- **Focused exam shell** owns active CAT/practice-test sessions. It preserves minimal NurseNest identity, timer/progress/exam controls, and exit behavior while suppressing standard learner chrome before hydration.
- **Module shell** owns ECG, labs, and specialty educational surfaces that must keep stable `/modules/*` URLs while converging visually with the learner ecosystem.
- **Internal shell** owns operational surfaces and must remain clearly distinct from learner study UX.

## Route Inheritance

| Route family | Shell owner | Notes |
| --- | --- | --- |
| `/` and public hubs | Marketing shell | SEO and public navigation remain intact. |
| `/app` | Learner shell + dashboard orchestrator | Dashboard owns primary recommendations and launch hierarchy. |
| `/app/lessons`, `/app/flashcards`, `/app/questions`, `/app/account/*` | Learner shell | Shell owns persistent navigation; page owns local contextual actions. |
| `/app/practice-tests/[id]` | Focused exam shell | Active session routes suppress learner nav on initial render and after client route transitions. |
| `/modules/ecg/*`, `/modules/ecg-interpretation/*`, `/modules/lab-values/*` | Module shell | Stable module URLs keep access gates and robots rules while adopting premium NurseNest module chrome. |
| `/internal/*` | Internal operational shell | Staff/admin enforcement stays server-side; internal chrome must not masquerade as learner UX. |

## CAT Exception Rules

Active CAT/practice-test session routes are the only learner routes allowed to suppress standard shell navigation. They must keep:

- NurseNest leaf + wordmark in the minimal shell.
- Clear exit affordance back to `/app`.
- Exam timer, progress, and focused controls.
- No unrelated quick-launch, remediation, dashboard, or marketing chrome.

Non-session practice routes such as `/app/practice-tests`, `/app/practice-tests/start`, `/app/practice-tests/cat-insights`, and results paths remain normal learner-shell pages.

## Recommendation Governance

Dashboard pages own the main study story: primary next step, readiness/adaptive insight, weak areas/remediation, and supplementary tools in that order. The shell may show only a lightweight continuity pulse outside the dashboard, avoiding duplicate “What Should I Do Next?” stacks.

## Navigation Governance

The persistent learner shell is the primary navigation system. Page-level navigation should be contextual and narrow, generally two or three related actions instead of repeated nine-tile launch grids. Quick launch, study modes, and remediation CTAs should read as one hierarchy, not separate competing systems.

## Module Governance

Stable `/modules/*` routes must not behave like isolated mini-apps. They should use the premium educational module shell or route users into canonical `/app/*` learner surfaces where those exist. Access gates such as `requireEcgModuleAccess` and `requireLabValuesModuleAccess` stay server-enforced.

## Theme Requirements

Shell surfaces must use existing theme and semantic tokens across Ocean, Blossom, Midnight, Sunset, and Aurora. Layout, hierarchy, and navigation behavior must not fork by theme.

## App Store Risks To Track

- Screenshot export may be blocked by local dev-server health or missing paid-user credentials.
- Full build validation can exceed local memory or collide with an existing build; use `typecheck:critical` and targeted Playwright suites when necessary, documenting blockers.
- Remaining module details should continue to converge toward learner-owned primitives as module routes evolve.
