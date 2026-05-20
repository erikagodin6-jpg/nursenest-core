# Homepage marketing screenshots → CDN (DigitalOcean Spaces)

This document ties **local Playwright captures** to **CDN object keys** (`screenshot1.png`–`screenshot15.png`) used by `screenshot-registry.ts`, `home-hero-carousel.ts`, and marketing carousels.

**Human-readable target table:** `docs/screenshot-capture-targets.md` (kept in sync with `capture-slot-targets.json`).

## Canonical capture pipeline

| Item | Location |
|------|----------|
| Playwright script | `nursenest-core/scripts/capture-marketing-screenshots.mjs` |
| Named targets (routes, slots, review notes) | `nursenest-core/scripts/capture-slot-targets.json` |
| Demo learner seed (subscription + pathway; **no schema migrations**) | `nursenest-core/scripts/seed-screenshot-demo-user.ts` |
| Wrapper from repo root | `scripts/capture-screenshots.mjs` → delegates into `nursenest-core/scripts/` |
| Generated outputs | `nursenest-core/public/marketing/screenshots/` (PNG + `capture-manifest.json`; gitignored — see folder `.gitignore`) |

Do **not** invent CDN hosts. Verified bases in code:

- `SCREENSHOT_CDN_BASE` in `src/lib/marketing/screenshot-registry.ts`
- `HOME_HERO_CDN_BASE_URL` in `src/config/home-hero-carousel.ts`

Canonical origin:

`https://nursenest-images.tor1.cdn.digitaloceanspaces.com`

Objects live at the **bucket root** as `screenshot{N}.png`. Optional WebP variants (`screenshot{N}-1200w.webp`, …) are documented in `home-hero-carousel.ts`.

## Upload policy — manual approval only

**DigitalOcean Spaces:** uploading or overwriting **`screenshot1.png`–`screenshot15.png`** (or optional WebP companions) is **manual-approval only**. Review **local** PNGs first; automation must not promote binaries to the production bucket without an explicit human gate.

1. Run captures locally and review PNGs (Ocean / Midnight / Blossom themes are applied per slot in JSON).
2. **Do not** overwrite existing production Space keys or purge CDN caches until product explicitly approves.
3. CI/automation must **not** push binaries to Spaces without that approval gate.
4. After approval, upload with your standard DO Spaces workflow so keys remain `screenshot1.png`–`screenshot15.png`.

## Slot → capture target → local file

Sources of truth: `nursenest-core/scripts/capture-slot-targets.json` (routes may include env overrides — see script header).

| Slot | CDN key | Capture target id | Route / resolution | Auth |
|------|---------|-------------------|---------------------|------|
| 1 | screenshot1.png | slot-01-practice-rationale | `/app/questions/session` | demo |
| 2 | screenshot2.png | slot-02-flashcards-study | `/app/flashcards` or `SCREENSHOT_FLASHCARD_STUDY_PATH` | demo |
| 3 | screenshot3.png | slot-03-learner-dashboard | `/app` | demo |
| 4 | screenshot4.png | slot-04-question-bank-advanced | `/app/questions/bank` | demo |
| 5 | screenshot5.png | slot-05-progress-report | `/app/account/report` | demo |
| 6 | screenshot6.png | slot-06-cat-launch-or-session | `/app/practice-tests/cat-launch?pathwayId=…` or `SCREENSHOT_CAT_SESSION_PATH` | demo |
| 7 | screenshot7.png | slot-07-cat-results-insights | `/app/practice-tests/cat-insights` or `SCREENSHOT_CAT_RESULTS_PATH` | demo |
| 8 | screenshot8.png | slot-08-study-plan | `/app/study-plan` | demo |
| 9 | screenshot9.png | slot-09-smart-review | `/app/review` | demo |
| 10 | screenshot10.png | slot-10-question-bank-list | `/app/questions` | demo |
| 11 | screenshot11.png | slot-11-confidence-analytics | `/app/analytics` | demo |
| 12 | screenshot12.png | slot-12-lesson-detail | `SCREENSHOT_LESSON_DETAIL_PATH` or first `/app/lessons/` link | demo |
| 13 | screenshot13.png | slot-13-lesson-library | `/app/lessons` | demo |
| 14 | screenshot14.png | slot-14-marketing-home-desktop | `/` (marketing homepage) | guest |
| 15 | screenshot15.png | slot-15-ecg-workstation | `/modules/ecg/basic/lessons` | demo |

**Redirects:** `/app/cat` routes into **`/app/practice-tests`** — use practice-tests URLs for CAT captures.

### Env overrides (optional)

| Env | Purpose |
|-----|---------|
| `SCREENSHOT_BASE_URL` | Dev/staging origin (default `http://localhost:8080`) |
| `SCREENSHOT_DEMO_PATHWAY_ID` | CAT launch pathway (default `ca-rn-nclex-rn`) |
| `SCREENSHOT_CAT_SESSION_PATH` | In-flight CAT runner (`/app/practice-tests/{sessionId}`) |
| `SCREENSHOT_CAT_RESULTS_PATH` | Specific results page (`/app/practice-tests/{id}/results`) |
| `SCREENSHOT_LESSON_DETAIL_PATH` | Explicit lesson (`/app/lessons/{id}`) |
| `SCREENSHOT_FLASHCARD_STUDY_PATH` | Active flashcard deck (`/app/flashcards/{slug}`) |
| `SCREENSHOT_ONLY_SLOTS` | Comma-separated `1`–`15` subset |
| `SCREENSHOT_TARGET_IDS` | Comma-separated capture target ids (same as JSON `id` field) |

### CLI (named targets)

```bash
cd nursenest-core
node scripts/capture-marketing-screenshots.mjs --list-targets
node scripts/capture-marketing-screenshots.mjs --targets=slot-14-marketing-home-desktop,slot-01-practice-rationale
```

### Supplementary (non-slot) PNGs

Listed in JSON under `supplementary/` — e.g. mobile homepage, learner mobile nav (opens drawer), labs hub, med calculations hub, settings, pricing, practice-tests hub. These are **not** CDN slot keys unless editorially promoted.

## How to run

From **`nursenest-core/`** (DigitalOcean `source_dir`):

```bash
cd nursenest-core
npm install
npx playwright install chromium
DATABASE_URL=… npx tsx scripts/seed-screenshot-demo-user.ts
npm run dev   # default PORT 8080 — align SCREENSHOT_BASE_URL
SCREENSHOT_BASE_URL=http://localhost:8080 node scripts/capture-marketing-screenshots.mjs
```

From **repository root** (thin wrapper):

```bash
SCREENSHOT_BASE_URL=http://localhost:8080 node scripts/capture-screenshots.mjs
```

Outputs + manifest:

`nursenest-core/public/marketing/screenshots/capture-manifest.json`

## Blockers / prerequisites

- **`AUTH_SECRET` or `NEXTAUTH_SECRET`** — required for Auth.js sign-in during capture (`nursenest-core/.env.local`). Next-only dev runs `scripts/assert-local-auth-secret.mjs`; generate with `openssl rand -base64 32`.
- **`DATABASE_URL`** — required for seed script (Prisma).
- **`SCREENSHOT_DEMO_EMAIL` / `SCREENSHOT_DEMO_PASSWORD`** — must match the seeded demo user (defaults are documented in `capture-marketing-screenshots.mjs`).
- **Entitlements** — seeded demo user receives an active `Subscription` row (demo Stripe id) so learner surfaces resolve like subscribed accounts (no schema change).
- **CAT session shots** — live runner usually requires `SCREENSHOT_CAT_SESSION_PATH` from an actual session id after starting CAT manually once.
- **Lesson detail** — set `SCREENSHOT_LESSON_DETAIL_PATH` when the auto-picked first hub lesson is unsuitable.

## Truthpack / infra cross-check

When refreshing infra docs, compare CDN hosts against `.vibecheck/truthpack/integrations.json` if present — **application source files above remain authoritative** for live URLs.
