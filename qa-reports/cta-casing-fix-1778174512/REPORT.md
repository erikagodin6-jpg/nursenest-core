# CTA Title Case — Marketing / Pathway Hubs

**Timestamp folder:** `cta-casing-fix-1778174512`  
**Scope:** Button and button-styled link labels only (marketing & pathway hub surfaces). No H1s, hero body, section titles, nav inventory, or `/app/*` learner tiles in this pass.

## 1. Files changed (this pass)

| Path | Reason |
|------|--------|
| `nursenest-core/src/components/marketing/allied-health-pathway-hub.tsx` | Hero + StudyCard + pricing band + deep-link CTAs |
| `nursenest-core/src/lib/blog/blog-cta-localized.ts` | Blog end-of-article pricing CTA strings |
| `nursenest-core/src/components/marketing/new-grad-work-area-hub.tsx` | StudyCard `cta` props |
| `nursenest-core/src/components/marketing/marketing-home-safe-mode.tsx` | Safe-mode hero CTAs |
| `nursenest-core/src/components/marketing/home-feature-deep-dives-section.tsx` | Primary / secondary tracked CTAs |
| `nursenest-core/src/components/marketing/about-page-client.tsx` | Hero primary / secondary links |
| `nursenest-core/src/components/marketing/home-restored-client.tsx` | `linkLabel` i18n fallbacks (CTA strip only) |
| `nursenest-core/src/components/marketing/home-conversion-hero.tsx` | Hero CTA fallbacks |
| `nursenest-core/src/components/marketing/home-final-study-cta.tsx` | Final band CTA + pricing lead fallback |
| `nursenest-core/src/components/marketing/home-hero-screenshot-section.tsx` | Carousel handoff CTA fallback |
| `nursenest-core/src/components/marketing/pricing-hero.tsx` | Default primary CTA label |
| `nursenest-core/src/components/marketing/country-marketing-home.tsx` | Pathway card “Open hub” affordance |
| `nursenest-core/src/components/marketing/nursing-tier-hub-page.tsx` | Locked StudyCard fallback CTA |
| `nursenest-core/src/components/marketing/marketing-practice-questions-hub-client.tsx` | Mode cards, practice launch row, quick links |
| `nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` | `PathwayHero` CTA labels + ramping row |
| `nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | CAT hub action links |
| `nursenest-core/src/lib/marketing/countries/registry.ts` | Country / global homepage primary & secondary CTA labels + cross-border link labels |
| `nursenest-core/src/components/pre-nursing/pre-nursing-next-steps-block.tsx` | Footer text links used as CTAs |
| `nursenest-core/src/components/pre-nursing/pre-nursing-module-engagement.tsx` | “Compare plans” link |
| `tools/i18n/marketing/marketing-en.json` | English marketing strings for public hubs + programmatic CTAs + home carousel / final CTA link |
| `nursenest-core/public/i18n/**` and `client/public/i18n/**` (via `npm run i18n:compile`) | Compiled shards after `marketing-en.json` edits |

## 2. CTA labels corrected (representative)

Full sweep spans dozens of literals; representative **before → after** pairs:

| Location | Before | After |
|----------|--------|-------|
| `allied-health-pathway-hub.tsx` (hero) | View plans and pricing | View Plans and Pricing |
| `allied-health-pathway-hub.tsx` (hero) | Choose your occupation track | Choose Your Occupation Track |
| `allied-health-pathway-hub.tsx` | Browse lessons hub | Browse Lessons Hub |
| `allied-health-pathway-hub.tsx` | Open practice exams | Open Practice Exams |
| `blog-cta-localized.ts` | View plans and pricing | View Plans and Pricing |
| `blog-cta-localized.ts` | See affordable plans for … | See Affordable Plans for … |
| `marketing-practice-questions-hub-client.tsx` | Start mixed practice (all hubs) | Start Mixed Practice (All Hubs) |
| `questions/page.tsx` | Create account | Create Account |
| `cat/page.tsx` | View plans for CAT access | View Plans for CAT Access |
| `registry.ts` | Browse Canada RN & PN prep | Browse Canada RN & PN Prep |
| `marketing-en.json` | Open the question bank | Open the Question Bank |
| `marketing-en.json` | Create free account (programmatic) | Create Free Account |

*(Article and short conjunctions follow Title Case rules: e.g. “Create **a** Free Account…”, “Go **to** Practice Questions Hub”, “View Plans **for** CAT Access”.)*

## 3. Routes verified in browser

| Target | Intended URL | Viewport | Screenshot | Result |
|--------|--------------|----------|------------|--------|
| Allied global hub | `http://127.0.0.1:3000/allied/allied-health` | 1440×900 | `screenshots/allied-health-desktop.png` | Playwright `page.goto` timed out from this agent sandbox before `domcontentloaded`; **static** Playwright render used showing **View Plans and Pricing** + **Choose Your Occupation Track**. |
| Same | (as above) | 375×812 | `screenshots/allied-health-mobile.png` | Static fallback (same hero CTA pair). |
| US RN hub | `http://127.0.0.1:3000/us/rn/nclex-rn` | 1440×900 | `screenshots/us-rn-nclex-rn-hero-desktop.png` | Static StudyCard-style label list for casing check. |
| US NP FNP hub | `http://127.0.0.1:3000/us/np/fnp` | 1440×900 | `screenshots/us-np-fnp-hero-desktop.png` | Static StudyCard-style label list for casing check. |

**Re-verify locally:** With `npm run dev:next` on port 3000, open the URLs above and confirm live heroes match Title Case (especially allied hero pills).

## 4. Screenshots saved

```text
qa-reports/cta-casing-fix-1778174512/screenshots/
  allied-health-desktop.png
  allied-health-mobile.png
  us-rn-nclex-rn-hero-desktop.png
  us-np-fnp-hero-desktop.png
```

Confirmed via `ls` in workspace.

## 5. Candidates intentionally not changed

| Candidate | Reason |
|-----------|--------|
| `country-marketing-home.tsx` — `<h2>Choose your pathway</h2>` | Section heading, not a CTA control |
| `country-marketing-home.tsx` — “Question bank”, “Practice exams” in tools list | Inline list links / IA labels, not hero pill CTAs |
| `marketing-home-safe-mode.tsx` — `SAFE_NAV_LINKS` entries | Navigation labels (out of scope) |
| `lessons/page.tsx` — template strings like “Browse lessons by clinical area for …” | Body / SEO description prose |
| `pathway-questions-hub-view.tsx` | Not modified in this pass (unused in current tree; other work may touch it) |
| Disabled-tile `disabledNote` paragraphs on international hubs | Long explanatory copy, not compact CTA labels |

## 6. Layout / wrap

No CSS or layout props were changed. Title Case strings are slightly wider; spot-check on a live dev server is recommended for the allied hero row at ~375px width.

## 7. Coordination

- Avoided `exam-pathways-data-*` and pathway **display title** fields (parallel “pathway title casing” worker).
- Touched `registry.ts` **only** for `primaryCta`, `secondaryCta`, and `crossBorderCta.label` strings — not `headline`, `subheadline`, or card titles.

## 8. Console errors

- **Live browser (cursor-ide-browser):** navigations returned `chrome-error://chromewebdata/` for this session (remote browser could not load the dev host).
- **Playwright live `goto`:** timed out at 25s waiting for `domcontentloaded` against `http://127.0.0.1:3000` from the agent shell (port accepts TCP but HTTP stalled in this environment).
- **After static screenshots:** no additional runtime console capture (no successful live page load in this sandbox).

## 9. Locale coverage

- **English:** `tools/i18n/marketing/marketing-en.json` updated for hub CTAs and related keys.
- **Other locales:** not edited (per instructions). Run your usual overlay workflow if non-EN marketing should mirror English casing.

## 10. Truthpack

Attempted to read `.vibecheck/truthpack/copy.json` — path not present in this clone; brand literals (e.g. REx-PN, NurseNest) were preserved from source strings only.

---

**Re-capture live screenshots (local):** from `nursenest-core/`, with dev running on 3000, use Playwright or browser devtools to save PNGs into this folder for true route verification.
