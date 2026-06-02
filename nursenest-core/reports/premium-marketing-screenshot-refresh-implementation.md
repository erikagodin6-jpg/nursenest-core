# Premium marketing screenshot refresh — implementation guide

This document describes the **governance workflow** for replacing stale DigitalOcean Spaces PNGs used by `screenshot-registry.ts`, marketing carousels, and the root Open Graph image. **Do not invent CDN URLs:** filenames remain `screenshot1.png` … `screenshot15.png` at `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/`.

## Goals

- Replace PNGs with **real** captures from the current premium UI.
- Keep **`src/lib/marketing/screenshot-registry.ts`** as the single URL source for marketing (`entry()` derives `publicUrl` from id).
- Pass **`npm run test:homepage`** (includes `screenshot-registry.contract.test.ts`).
- Use **two pipelines:**
  1. **Product truth** — `node scripts/capture-screenshots.mjs` (monorepo root) + seeded demo learner.
  2. **Preview / themes** — `UI_PREVIEW_THEMES=ocean,midnight UI_PREVIEW_MIRROR_REPORTS=1 npm run ui-preview:capture` from **`nursenest-core/`**.

## Prerequisites

1. `DATABASE_URL` for Prisma.
2. Seed user: `npx tsx scripts/seed-screenshot-demo-user.ts` (repo root).
3. Start app: `cd nursenest-core && npm run dev` (`SCREENSHOT_BASE_URL` defaults to `http://localhost:3000`).
4. `npx playwright install chromium`.

## Step 1 — Product captures

From **monorepo root**:

```bash
node scripts/capture-screenshots.mjs
```

Optional env: `SCREENSHOT_BASE_URL`, `SCREENSHOT_OUTPUT_DIR`, `SCREENSHOT_ONLY_IDS`, `SCREENSHOT_WAIT_MS`.

### Inventory (see `CAPTURE_TARGETS` in script)

**Public:** `home-desktop`, `home-mobile`, `pricing-desktop`, `faq-desktop`, `about-desktop`.

**Authenticated:** dashboard, question bank, **practice-tests hub**, practice runner, CAT session/mobile, CAT results, smart review, study plan, analytics, **report card**, **flashcards** desktop/mobile, lessons hub, labs, med-calculations, **OSCE**.

Outputs: `screenshots/…` and `capture-manifest.json`.

**Limits:** `practice-q-desktop` may need an in-session runner for rationale UI; OSCE/labs may show paywall/empty states depending on demo entitlements.

## Step 2 — UI preview capture

From **`nursenest-core/`**:

```bash
UI_PREVIEW_THEMES=ocean,midnight UI_PREVIEW_MIRROR_REPORTS=1 npm run ui-preview:capture
```

Produces `preview-screenshots/` and optionally mirrors to `reports/ui-redesign-preview/`. Use for governance review; CDN registry still uses `screenshotN.png` unless product adopts preview frames explicitly.

## Step 3 — Editorial mapping → Spaces

1. Choose source PNGs per marketing slot.
2. Crop/resize to carousel-safe framing.
3. Export as **`screenshot{N}.png`** and upload (overwrite same keys).
4. Update **label / description / alt** in `screenshot-registry.ts` only.

Registry ids stay **1–15**; expanding ids requires `ScreenshotId` type + contract updates.

**Open Graph:** `ROOT_LAYOUT_OPEN_GRAPH_IMAGE` in `src/app/layout.tsx` references **`screenshot1.png`**. For OG-specific art, upload e.g. `og-home.png` **first**, then change layout metadata.

## Step 4 — Upload (DigitalOcean Spaces)

Use team credentials; CLI pattern:

```bash
aws s3 cp ./screenshot7.png s3://BUCKET/screenshot7.png \
  --endpoint-url https://tor1.digitaloceanspaces.com --acl public-read
```

Purge CDN cache if applicable.

## Step 5 — Validation

```bash
cd nursenest-core
npm run test:homepage
node --import tsx --test src/lib/marketing/screenshot-registry.contract.test.ts
```

## QA checklist

- Premium current UI; no placeholders or raw i18n keys.
- No admin-only controls in learner captures.
- Midnight/Ocean readable where relevant.
- No clipped headings; empty states only when intentional.
- No off-brand neon; semantic tokens.

---

*Script update: `scripts/capture-screenshots.mjs` adds home-mobile, practice-tests hub, flashcards (desktop/mobile), report card, OSCE.*
