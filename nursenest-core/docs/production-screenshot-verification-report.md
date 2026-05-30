# Production Screenshot Verification Report

**Verdict:** FAIL — production does not yet display all replacement assets

| URL | Screenshot Expected | Screenshot Found | Verified | Timestamp | Playwright Capture | Status |
| --- | --- | --- | --- | --- | --- | --- |
| https://nursenest.ca/ | /marketing/homepage-screenshots/screenshot1.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:27:57.686Z | `production-screenshot-verification/homepage--1440x900.png` | FAIL |
| https://nursenest.ca/pricing | /marketing/generated-screenshots/marketing/rn-marketing-hub.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:03.722Z | `production-screenshot-verification/pricing--1440x900.png` | FAIL |
| https://nursenest.ca/us/rn/nclex-rn | /marketing/generated-screenshots/marketing/rn-marketing-hub.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:10.032Z | `production-screenshot-verification/rn-hub--1440x900.png` | FAIL |
| https://nursenest.ca/canada/pn/rex-pn | /marketing/generated-screenshots/marketing/pn-marketing-hub.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:14.130Z | `production-screenshot-verification/pn-hub--1440x900.png` | FAIL |
| https://nursenest.ca/canada/np/cnple | /marketing/generated-screenshots/marketing/np-marketing-hub.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:18.475Z | `production-screenshot-verification/np-hub--1440x900.png` | FAIL |
| https://nursenest.ca/allied/allied-health | /marketing/generated-screenshots/marketing/allied-marketing-hub.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:22.738Z | `production-screenshot-verification/allied-hub--1440x900.png` | FAIL |
| https://nursenest.ca/canada/new-grad | /marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:28.315Z | `production-screenshot-verification/new-grad--1440x900.png` | FAIL |
| https://nursenest.ca/ecg-interpretation | /marketing/generated-screenshots/core/ecg-workstation.webp | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:32.782Z | `production-screenshot-verification/ecg--1440x900.png` | FAIL |
| https://nursenest.ca/faq | Registry slot / proof component | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:36.906Z | `production-screenshot-verification/faq--1440x900.png` | WARN |
| https://nursenest.ca/for-institutions | Registry slot / proof component | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-transparent.png | No | 2026-05-30T06:28:40.926Z | `production-screenshot-verification/institutions--1440x900.png` | FAIL |

## Deployment blockers

When status is FAIL, typical causes:

1. **Code not deployed** — wiring (`MarketingPathwayHubProductPreview`, proof bands) exists only in local working tree
2. **Assets not deployed** — `public/marketing/homepage-screenshots/` and `public/marketing/generated-screenshots/` not in production build
3. **CDN stale** — carousel still falls back to `screenshot{N}.png` (last-modified Mar 2026 on CDN)
4. **Cache** — DO App Platform / CDN edge serving old static files

## Required actions before PASS

1. Commit and deploy application + `public/marketing/**` assets
2. Upload refreshed CDN slots per `docs/SCREENSHOT_CAPTURE_TO_CDN.md` OR ensure local WebP chain resolves on production
3. Purge CDN / invalidate static cache if old PNGs persist
4. Re-run: `PLAYWRIGHT_BASE_URL=https://nursenest.ca npm run verify:production:marketing-screenshots`
