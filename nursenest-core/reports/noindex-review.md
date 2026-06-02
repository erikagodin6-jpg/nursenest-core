# Phase 2 — Noindex Audit
Generated: 2026-05-30 | Source: codebase inspection of all page metadata generators

---

## Noindex Categories

### INTENTIONAL — Correct (Keep)

| Page / Surface | File | Noindex Reason |
|---|---|---|
| Learner dashboard `/app` | `layout.tsx` (learner shell) | Auth-required; learner chrome |
| Practice sessions `/app/questions` | Learner shell | Auth-required |
| CAT exam sessions `/app/practice-tests/*` | `learner-exam-chrome` | Exam in progress |
| Flashcard sessions `/app/flashcards/*` | Learner shell | Auth-required study tool |
| Account/settings `/app/account/*` | Learner shell | Personal account data |
| Clinical Skills detail pages | `clinical-skills/[slug]/page.tsx` → metadata: `robots: { index: false, follow: false }` | Auth-required |
| Clinical Skills hub | `clinical-skills/page.tsx:18-19` | `robots: { index: false, follow: false }` (learner-only) |
| International pathway shells | Via `robotsForRegionalMarketingHub` | `isRegionPublishedForPublicSite() === false` |
| Filtered question pages | `questions/page.tsx:80` | `narrowedLabel` → faceted URL |
| Admin routes `/admin/*` | Admin layout | Staff-only |
| Preview routes `/preview/*` | Preview layout | Draft content |
| Internal routes `/internal/*` | Internal layout | Build tooling |

### INTENTIONAL — Correct (These Should Be Noindex)

| Page | Reason |
|---|---|
| `/login` | Auth page; no unique content value |
| `/signup` | Auth page |
| `/verify-email` | Transactional |
| `/forgot-password` | Transactional |
| `/app/onboarding` | Authenticated flow |

### DANGEROUS — Verified Not Present

The following patterns were **NOT found** with accidental noindex:
- ✅ US RN hub `/us/rn/nclex-rn` → `index: true`
- ✅ CA RN hub `/canada/rn/nclex-rn` → `index: true`
- ✅ NCLEX commercial landing pages → defaults to `published`
- ✅ Blog posts → per-article control, published = `index: true`
- ✅ Glossary → `index: true` for published entries
- ✅ Lesson detail pages → indexable when published
- ✅ Pricing pages `/us/rn/nclex-rn/pricing` → `index: true` (no explicit noindex found)

---

## The 5,611 Noindex Entries in Search Console

These are most likely:

| Cause | Estimated Volume | Fix |
|---|---|---|
| Historical locale preview pages (old `incomplete` tier locales) | ~2,000–3,000 | These pages have `noindex` in metadata. To de-index: keep noindex OR remove the pages and add 301 redirects to canonical. |
| Filtered/faceted question pages (`/questions?topic=X`) | ~1,000 | Correct — keep noindex. These are internal navigation, not indexable content. |
| Learner app routes that Google crawled before auth gate | ~500–800 | Protected by robots.txt `/app/` now. Will clear. |
| International shell pages (marketing only, noindex until published) | ~300–500 | Intentional until content is built. |

### LEGACY LOCALE NOINDEX (Root cause of most 5,611)

File: `src/lib/seo/language-readiness.ts` and `src/lib/i18n/marketing-locale-policy.ts`

Locales with `tier: "preview"` or `"incomplete"` get noindex via `localeRobotsOverride`. These are correct — incomplete locales should be noindexed. The count will only decrease when those locales are promoted to `tier: "full"`.

**No action needed.** The noindex on these pages is correct and protecting the index from low-quality locale pages.

---

## Action Items

| Issue | Severity | Action |
|---|---|---|
| Confirm `/us/rn/nclex-rn` is NOT noindexed in production | CRITICAL | Inspect GSC URL Inspection tool for this specific URL |
| Remove noindex from any high-value US pages accidentally marked | HIGH | None found in code — verify in GSC live test |
| Legacy locale preview pages | MEDIUM | Keep noindex until content is ready. No code change. |
| Historical learner shell crawls | LOW | Will clear from Search Console over time |
