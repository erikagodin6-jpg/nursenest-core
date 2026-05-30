# Screenshot Deployment Validation (Phase 5)

**Production base:** https://nursenest.ca
**Validated:** 2026-05-30T06:28:45.657Z
**Program status:** NOT COMPLETE — stale or missing assets on live site

## Fingerprint matrix (repo vs deployed static URL)

| Repo Asset | Repo SHA256 | Repo Bytes | Production URL | Prod SHA256 | Prod Bytes | Match |
| --- | --- | --- | --- | --- | --- | --- |
| /marketing/homepage-screenshots/screenshot1.webp | d89cdbecb0565559 | 58650 | https://nursenest.ca/marketing/homepage-screenshots/screenshot1.webp | 1d4f4c71cd76c667 | 802485 | NO |
| /marketing/homepage-screenshots/screenshot1-480w.webp | c4d2af269697cc2d | 10610 | https://nursenest.ca/marketing/homepage-screenshots/screenshot1-480w.webp | a3fadc74eff0264f | 5144 | NO |
| /marketing/generated-screenshots/marketing/rn-marketing-hub.webp | 53a9eff80fbec71e | 37250 | https://nursenest.ca/marketing/generated-screenshots/marketing/rn-marketing-hub.webp | 340301cfa4aa2308 | 36764 | NO |
| /marketing/generated-screenshots/marketing/pn-marketing-hub.webp | 347545422ce0850a | 37608 | https://nursenest.ca/marketing/generated-screenshots/marketing/pn-marketing-hub.webp | c9889e7bc3c0f156 | 37410 | NO |
| /marketing/generated-screenshots/core/ecg-workstation.webp | c2f43d28ac7aadd0 | 60298 | https://nursenest.ca/marketing/generated-screenshots/core/ecg-workstation.webp | 7dadc8cdb480e3b8 | 802738 | NO |

## CDN carousel fallback

| Asset | Last known state |
| --- | --- |
| `screenshot1.png` on DigitalOcean Spaces CDN | 553881 bytes, SHA256 1d60f2483a219a54… |
| Expected | Refreshed PNG/WebP from `docs/SCREENSHOT_CAPTURE_TO_CDN.md` or local WebP chain only |

## Legacy markers detected on live pages

- https://nursenest.ca/pricing: `https://nursenest.ca/_next/image?url=%2Fdashboard-redesign-preview%2F01-dash-desktop-ocean.png&w=384`
- https://nursenest.ca/pricing: `https://nursenest.ca/_next/image?url=%2Fdashboard-redesign-preview%2F10-cat-trajectory.png&w=3840&q=`
- https://nursenest.ca/pricing: `https://nursenest.ca/_next/image?url=%2Fdashboard-redesign-preview%2F03-readiness-desktop.png&w=3840`
- https://nursenest.ca/pricing: `https://nursenest.ca/_next/image?url=%2Flanding-polish-preview%2Fpng%2F08-flashcards-session-blossom`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot6-1200w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot5-1200w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot10-768w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot10-768w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot5-1200w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot14-1200w.webp`

## Cache invalidation checklist (Phase 6)

- [ ] Deploy app build containing `public/marketing/**` with new byte sizes
- [ ] Upload refreshed CDN slots if carousel still uses Spaces PNG fallback
- [ ] Purge DigitalOcean CDN / App Platform static cache if fingerprints still mismatch post-deploy
- [ ] Re-run verification until `Match = YES` for all rows and Playwright suite passes

## Re-verify commands

```bash
cd nursenest-core
PLAYWRIGHT_BASE_URL=https://nursenest.ca npm run verify:production:marketing-screenshots
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run test:e2e:production-screenshot-verification
```
