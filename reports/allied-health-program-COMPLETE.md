# Allied Health hub program — completion report

Generated: 2026-05-09 (agent session). **Program remains operationally “in progress”** where noted below.

## 1. Bounded counts (`npm run report:allied-hub`)

- **Source:** `nursenest-core/src/lib/allied/allied-hub-inventory-counts.server.ts` appended as **Part 3** of `reports/allied-health-hub-program.md` (repo root).
- **Behavior:**
  - Lessons: prefers `alliedProfessionKey` + `topicSlugsIn`; **falls back to topic-slug-only** when `pathway_lessons.allied_profession_key` is missing in the connected database.
  - Flashcards: deck tags + `examQuestionId IN (…)` from scoped exam pool (cap `MAX_EXAM_QUESTION_IDS_FOR_FLASHCARD_POOL` = 12_000); **no invalid `examQuestion` Prisma relation** (schema uses `examQuestionId` only).
  - CAT / practice / scenario / lab / med-calc: pathway-scoped `ExamQuestion` counts where `prismaWhereForAlliedProfessionExamQuestions` exists; otherwise **`unavailable` + reason**. CAT row uses adaptive-eligible count only when marketing CAT surface is unlocked for that occupation.
  - Practice exams / sets: **`unavailable`** — no scoped Prisma entity in this helper.
  - Skill refresher: **registry scaffold count** (`alliedMasteryModulesForProfession`), not a publish audit.
- **Markdown tables:** Part 3 rows render with proper leading `|` (fixed) + **minimum compliance** vs `ALLIED_MINIMUM_CONTENT_PER_OCCUPATION`.

**Last run observation (production DO Postgres):** many occupations showed **0** lessons/flashcards in DB for the scoped filters; several rows show **`unavailable`** for exam-question attribution (no career map). **All compliance rows were “below”** on content floors in that snapshot — expected until content + migrations catch up.

## 2. Figma

- **File (MCP `create_new_file`):** [Allied hub — NurseNest](https://www.figma.com/design/A0lUC2ZcBmQ41eeZLXxQ8Q)
- **Canvas page node id:** `0:1` (empty starter page — design still to add frames per `reports/allied-health-figma-ui-plan.md`).
- **Blocker:** frames for desktop/mobile × Ocean/Midnight/Blossom and listed professions still need **human design pass**; links above are real; do not invent frame URLs until published.

## 3. Playwright (`tests/e2e/public/allied-health-hubs.spec.ts`)

**Command:**

`cd nursenest-core && npx playwright test tests/e2e/public/allied-health-hubs.spec.ts --project=chromium --workers=1`

**Status in this environment: not green.**

- **Fix applied:** strict-mode failure from **duplicate “Study tools” headings** — assertion now uses `zone.getByRole(...).first()`.
- **Failures observed:**
  - Long serial run + **remote DB timeouts** / dev instability → **`net::ERR_CONNECTION_REFUSED`** once the dev server dropped off `127.0.0.1:3000`.
  - Low-memory host + Turbopack + heavy marketing layout compile — server not consistently healthy for a full **36-test** pass.

**Re-run checklist:** stable `next dev` (or set `BASE_URL` to a preview deployment), `AUTH_SECRET` set, DB responsive; prefer `--workers=1`.

## 4. Screenshots (`docs/screenshots/allied-health-e2e/`)

- **Spec writes here:** `SCREENSHOT_DIR` = monorepo `docs/screenshots/allied-health-e2e/` (see spec + `docs/screenshots/allied-health-e2e/README.md`).
- **PNGs are gitignored** by design; they were **not checked in** because Playwright did not complete successfully in this session. Re-run the command above after a green suite to populate:
  - Chooser: `allied-hub-desktop-ocean.png`, mobile ocean/midnight.
  - Per `SCREENSHOT_PROFESSION_KEYS`: desktop ocean/midnight/blossom + mobile ocean/midnight.

## 5. Module interaction coverage (spec)

- Serial loop: **HTTP smoke** for lessons, questions, flashcards, CAT paths; **premium `a[href]`** must not include `/admin`; **5s** settle; **CAT locked** vs unlocked per `alliedHubCatSurfaceUnlocked`.
- Matrix test: premium module keys, CAT gate, psychotherapy locked labs **href** safety.

## 6. Validation commands (stdout summary)

| Command | Result (this session) |
|---------|------------------------|
| `npm run report:allied-hub` | **Exit 0** — writes `reports/allied-health-hub-program.md` (Prisma may log missing `allied_profession_key` before lesson fallback). |
| `node --import tsx --test src/lib/allied/allied-hub-program-model.contract.test.ts` | **Pass** (3/3 subtests). |
| `npm run test:homepage` | **Pass** (78 pass, 1 skip). |
| `npm run typecheck:critical` | **Exit 0**. |
| Playwright (above) | **Fail** — connection refused / env instability; **not skipped intentionally**. |
| `npm run production:build` | **Not verified to completion** — capped run in low-memory agent host; run locally/CI for authoritative result. |

## 7. Files touched (this workstream)

- `nursenest-core/src/lib/allied/allied-hub-inventory-counts.server.ts` — lesson fallback, flashcard `examQuestionId` join, table markdown pipes, inventory copy.
- `nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts` — screenshot dir `allied-health-e2e`, Study tools locator.
- `docs/screenshots/allied-health-e2e/README.md` — how to generate artifacts.
- `reports/allied-health-program-COMPLETE.md` — this file.

## 8. Git / push

- **Latest commit referenced during session:** `834cb8be2` (branch was **ahead of origin/main by 1** at one point; workspace may have moved — run `git log -1` before push).
- **Push:** not performed from this agent (no guaranteed SSH/credentials). Run `git push origin main` when ready.

## 9. Remaining blockers

1. **DB migration:** add `pathway_lessons.allied_profession_key` (and deploy) to align DB with Prisma — removes Prisma error noise and restores full lesson attribution.
2. **Playwright green** on a healthy app URL + stable database.
3. **Figma frames** populated (not only file `0:1`).
4. **Screenshot artifacts** generated after green Playwright.
5. **Content / attribution:** expand `prismaWhereForAlliedProfessionExamQuestions` coverage so fewer occupations show `unavailable` for practice/CAT/scenario/lab/med-calc.

---

**Tight summary for parent:** Counts **wired** (honest `unavailable` + DB-backed integers where safe). Playwright **not green** in this container (server/DB instability + fixed strict-mode issue). Figma **file URL real**; frames still empty at `0:1`. Push **not confirmed**.

