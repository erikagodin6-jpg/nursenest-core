# NurseNest — refactor & consolidation priority list

Ranked for **ROI**, **risk**, and **complexity reduction**. **No commitment to execution order** — this is an audit output. All items are documentation-level observations unless a future story explicitly scopes code changes.

---

## P0 — Dangerous tech debt (fix carefully; high blast radius)

| Item | Why | Suggested direction |
|------|-----|---------------------|
| **Parallel CAT stacks** (`lib/exams/cat-engine` vs `lib/cat/*`) | Two “CAT” mental models; easy to patch wrong file; duplicated concepts (theta, sessions). | Write a **facade doc + import lint rule**; long-term: extract shared types + single selection core if product agrees. |
| **Lesson legacy bridge (`ContentItem` + `PathwayLesson`)** | Correct today (Option B) but easy to regress if someone reintroduces ContentItem bodies. | Keep E2E on redirect + entitlement; add **admin-only** warnings when editing legacy rows. |
| **Marketing duplicate route trees** (`(default)` vs `[locale]`) | Double maintenance → metadata / hreflang drift. | Extract shared `generateMetadata` + loader helpers per surface; track in epic. |

---

## P1 — High ROI cleanups (engineering velocity)

| Item | Why | Direction |
|------|-----|-----------|
| **Practice exam vs test naming** | Same API; users and support confused. | UI copy + deep links audit; optional redirect alias **only** if product approves URL policy. |
| **`content-registry.ts` vs free-form docs** | Registry exists but not all engineers know it. | Link from onboarding README; CI already can run `content:source-of-truth:check` — wire into default `npm test` or PR template. |
| **Labs / ECG documentation** | New hires assume PathwayLesson for all “content”. | Keep SoT table in `system-source-of-truth.md` synced when labs migrate to DB (if ever). |

---

## P2 — Performance / build instability drivers

| Item | Notes |
|------|-------|
| **Large `nursenest-core/.next` + lesson indexes** | Build-time memory; DigitalOcean build scripts — do not add unbounded sync imports. |
| **i18n compile + marketing merge** | Fails CI on drift — treat as **release gate**, not “flaky CI”. |
| **Playwright / E2E matrices** | Tier-matrix configs multiply runtime — schedule selectively. |

---

## P3 — AI indexing / Cursor / contributor complexity

| Item | Notes |
|------|-------|
| **Huge `reports/`, `generated-indexes/`, `public/i18n`** | Slow IDE; use `.cursorignore` + `reports/cursor-remote-stability.md`. |
| **Overlapping “adaptive” naming** | Prompts bad AI refactors across `lib/cat` and `lib/exams`. |
| **Legacy `server/` + `client/` + `nursenest-core/` triple tree** | Agents pick wrong file — prefer explicit paths in tasks. |

---

## Dead / legacy candidates (do not delete without archaeology)

| Area | Location | Status |
|------|----------|--------|
| **Vite marketing home duplicate** | `client/src/pages/home.tsx` | Parallel to Next — `legacy-restoration-map.md` |
| **MLT adaptive engine** | `server/mlt-adaptive-engine.ts` | Monolith simulation — confirm unused in Next before removal |
| **Legacy lesson JSON loaders** | `client/src/lib/getI18n.ts`, old translation bundles | Migration inputs; not Next SoT |

---

## Temporary compatibility layers (treat as “do not extend”)

- `ContentItem` lessons + `pathwayLessonIdFromContentItemTags` redirect bridge.  
- OSCE legacy JSON when **no** published DB rows + env gate.  
- Blog static corpus when DB absent at build.

---

## How to use this list

1. Pick **one** P0 item only if a dedicated epic exists (risk).  
2. Prefer **P1** for sprint filler that reduces support tickets.  
3. For perf CI, pull from **P2**.  
4. For **AI/agent** guardrails, improve docs + `validate:editor-stability` / content registry checks (**P3**).


---

## Overlapping abstractions (watch list)

| Name A | Name B | Overlap |
|--------|--------|-----------|
| `PracticeTest` | “Practice exam” UI | Same entity, different labels. |
| `lib/exams/cat-engine` | `lib/cat` | Both “CAT”; different domains. |
| `PathwayLesson` | `ContentItem` lesson | Bridged by tags + redirect. |
| Next `(marketing)/(default)` | Next `(marketing)/[locale]` | Parallel trees for similar URLs. |
| `nursenest-core` App Router | Vite `client` router | Parallel marketing/study experiences. |
