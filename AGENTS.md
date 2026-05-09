# NurseNest Agent Guide

Production Next.js monorepo. Optimize for safety, small diffs, and behavior preservation.

## Platform ecosystem guardrails

NurseNest is **one** cohesive premium adaptive clinical learning ecosystem — not disconnected mini-apps or fragmented redesigns. Future work must **converge** toward shared primitives, learner shells (`nn-learner-page-hero`, `LearnerSurfaceCard`, semantic surfaces), **semantic tokens**, **canonical navigation**, and **adaptive study loops**. Do **not** fork parallel nav systems for labs/ECG/simulations, ship spreadsheet-first lab UX, or introduce disconnected scoring products.

**Authority:** `.cursor/rules/ecosystem-platform-guardrails.mdc` (always applied; sections for Labs, ECG, Advanced ECG entitlements, simulations, themes, tokens, adaptive learning, brand). **Architecture reference:** `docs/ecosystem-design-system-convergence.md`. **Subscription + clinical readiness positioning (ECG, Labs, OSCE, med calc, simulations):** `docs/planning/subscription-clinical-readiness-ecosystem.md`. **Lab Values pedagogy (interpretation depth vs range memorization):** `docs/planning/lab-values-educational-depth.md`. **Transfusion + reactions (integrated clinical safety):** `docs/planning/transfusion-clinical-readiness-ecosystem.md`. **Transfusion Figma program:** `docs/planning/transfusion-ecosystem-figma-brief.md`. **Implementation + placement + marketing (all readiness ecosystems):** `docs/planning/clinical-readiness-ecosystem-implementation-directive.md`. **Future BLS/ACLS/PALS emergency pathways:** `docs/planning/bls-acls-pals-emergency-readiness-pathways.md`.

## General Engineering Rules

- Keep diffs surgical. Change only what the task requires.
- Do not rewrite unrelated files or reformat broad areas opportunistically.
- Prefer existing helpers, loaders, guards, and route patterns over new abstractions.
- Preserve response shapes, route params, and stable learner URLs unless explicitly requested.
- No schema changes, Prisma model changes, migrations, or seed rewrites unless explicitly requested.
- Do not add heavy libraries without a clear reason tied to the task.
- Do not touch env files, secrets, or deployment config unless explicitly asked.

## Auth And Admin Rules

- Admin and staff access must be enforced server-side.
- DB-backed role state is the source of truth. Do not trust JWT claims alone for authorization.
- Do not invent parallel auth systems, alternate session sources, or client-only permission checks.
- Do not move security-sensitive logic to the client.
- Preserve entitlement, paywall, and subscription gating behavior.
- Learner routes and flows must remain stable. Do not break Lessons, Flashcards, Questions, CAT, dashboard, or paywall behavior.

## UI And UX Rules

- Header, nav, and footer changes must not clip text, wrap mid-label, or hide critical controls on mobile or desktop.
- Preserve current IA and core CTAs unless the task explicitly changes them.
- Do not reintroduce the arch graphic anywhere.
- Do not silently change copy across the app. Limit copy edits to the requested surface.
- Preserve locale and i18n behavior. Keep existing keys, loaders, fallback logic, and locale routing intact.

## Testing And Verification Rules

- After auth, dashboard, nav, lesson, or paywall changes, run focused validation for the affected flow.
- Prefer targeted tests and route checks over broad, slow suites when the task is narrow.
- If you cannot run a needed verification, say so clearly and explain why.
- Treat unrelated pre-existing failures as separate from the task; do not “fix the world” unless asked.

## SEO And Content Rules

- Do not break sitemap, robots, canonical, metadata, or public marketing route behavior.
- Preserve content safety and exam-pathway scoping. Do not mix regions, exams, or entitlement levels accidentally.
- Do not introduce unreviewed global copy churn, content migrations, or indexing changes without explicit request.
