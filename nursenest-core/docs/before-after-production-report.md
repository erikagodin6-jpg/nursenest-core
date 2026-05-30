# Before / After Production Screenshot Report

**Production:** https://nursenest.ca  
**Report generated:** 2026-05-30  
**Program status:** NOT COMPLETE — deploy + wiring fix still required for full PASS

## Executive summary

| Area | Before (prior audit) | After (current production) | Verified |
| --- | --- | --- | --- |
| Pricing legacy PNGs | `dashboard-redesign-preview/`, `landing-polish-preview/` in HTML | **Removed** — `generated-screenshots` only | Partial |
| Pathway hub proofs | Missing `[data-nn-pathway-hub-proof]` | **Present** — marketing hub WebPs load | YES (fingerprints match) |
| Pricing / hub assets | Stale bytes vs repo | **MATCH** for RN/PN/NP/Allied/New Grad hubs | YES |
| ECG marketing | N/A | **Broken primary URL** — `themes/ocean/ecg-workstation.webp` 404 | NO — fix wired locally |
| Homepage hero | CDN PNG fallback / broken WebP | Local homepage slots deployed; carousel client-rendered | MISMATCH on slot 1 fingerprint |
| Institutions | CDN Spaces WebP only | Local `homepage-screenshots` slot 7 **MATCH** | YES |
| CDN `screenshot1.png` | Mar 2026 stale PNG | **Still stale** (553KB, unchanged) | Fallback only |

## Page-by-page

| Page URL | Before (asset) | After (asset) | Playwright capture | Timestamp | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | CDN / broken local WebP | Client carousel → `homepage-screenshots` chain | `reports/production-screenshot-verification/homepage--1440x900.png` | 2026-05-30 | FAIL (fingerprint) |
| `/pricing` | Legacy dashboard PNG fallbacks | `generated-screenshots/marketing/rn-marketing-hub.webp` + core stages | `pricing--1440x900.png` | 2026-05-30 | FAIL (expected asset slot mismatch in verifier) |
| `/us/rn/nclex-rn` | No product proof band | `rn-marketing-hub.webp` **MATCH** | `rn-hub--1440x900.png` | 2026-05-30 | FAIL (verifier expects rn-hub tier path) |
| `/canada/pn/rex-pn` | No proof | `pn-marketing-hub.webp` **MATCH** | `pn-hub--1440x900.png` | 2026-05-30 | FAIL |
| `/canada/np/cnple` | No proof | `np-marketing-hub.webp` **MATCH** | `np-hub--1440x900.png` | 2026-05-30 | FAIL |
| `/allied/allied-health` | No proof | `allied-marketing-hub.webp` **MATCH** | `allied-hub--1440x900.png` | 2026-05-30 | FAIL |
| `/canada/new-grad` | No proof | `new-grad-marketing-hub.webp` **MATCH** | `new-grad--1440x900.png` | 2026-05-30 | FAIL |
| `/ecg-interpretation` | No proof / placeholder | Primary `themes/ocean/ecg-workstation.webp` **404** | `ecg--1440x900.png` | 2026-05-30 | FAIL |
| `/for-institutions` | CDN Spaces screenshots | `homepage-screenshots/screenshot7-1200w.webp` **MATCH** | `institutions--1440x900.png` | 2026-05-30 | WARN |

## Wiring fix (local — needs deploy)

**Issue:** `marketingProofFromCoreKey()` pointed Ocean theme at non-existent `themes/ocean/*.webp` paths (404 on production), causing broken images until client `onError` fallback.

**Fix:** Ocean theme now resolves directly to `core/*.webp` (canonical Ocean captures). File: `src/lib/marketing/marketing-proof-screenshots.ts`.

## Deployment actions still required

1. **Deploy** wiring fix + any uncommitted `public/marketing/**` updates  
2. **Re-run** `PLAYWRIGHT_BASE_URL=https://nursenest.ca npm run verify:production:marketing-screenshots`  
3. **Optional CDN refresh** for `screenshot1.png`…`screenshot15.png` if hero still falls back to Mar 2026 PNG  
4. **Commit** untracked pathway tier assets (`allied/`, `np/`, `newgrad/`, etc.) so production can serve them when referenced

## Evidence paths

- Live audit: `docs/live-site-screenshot-audit.md`
- Production map: `docs/production-image-map.md`
- Fingerprint matrix: `docs/screenshot-deployment-validation.md`
- Cache analysis: `docs/asset-cache-analysis.md`
- Asset usage: `docs/marketing-asset-usage-report.md`
- Playwright PNGs: `reports/production-screenshot-verification/*.png`
