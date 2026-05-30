# Screenshot Deployment Validation (Phase 5)

**Production base:** https://nursenest.ca
**Validated:** 2026-05-30T08:19:12.008Z
**Program status:** NOT COMPLETE — stale or missing assets on live site

## Fingerprint matrix (repo vs deployed static URL)

| Repo Asset | Repo SHA256 | Repo Bytes | Production URL | Prod SHA256 | Prod Bytes | Match |
| --- | --- | --- | --- | --- | --- | --- |
| /marketing/homepage-screenshots/screenshot1.webp | d89cdbecb0565559 | 58650 | https://nursenest.ca/marketing/homepage-screenshots/screenshot1.webp | d89cdbecb0565559 | 58650 | YES |
| /marketing/homepage-screenshots/screenshot1-480w.webp | c4d2af269697cc2d | 10610 | https://nursenest.ca/marketing/homepage-screenshots/screenshot1-480w.webp | c4d2af269697cc2d | 10610 | YES |
| /marketing/generated-screenshots/marketing/rn-marketing-hub.webp | 53a9eff80fbec71e | 37250 | https://nursenest.ca/marketing/generated-screenshots/marketing/rn-marketing-hub.webp | 53a9eff80fbec71e | 37250 | YES |
| /marketing/generated-screenshots/marketing/pn-marketing-hub.webp | 347545422ce0850a | 37608 | https://nursenest.ca/marketing/generated-screenshots/marketing/pn-marketing-hub.webp | 347545422ce0850a | 37608 | YES |
| /marketing/generated-screenshots/core/ecg-workstation.webp | c2f43d28ac7aadd0 | 60298 | https://nursenest.ca/marketing/generated-screenshots/core/ecg-workstation.webp | c2f43d28ac7aadd0 | 60298 | YES |

## CDN carousel fallback

| Asset | Last known state |
| --- | --- |
| `screenshot1.png` on DigitalOcean Spaces CDN | 553881 bytes, SHA256 1d60f2483a219a54… |
| Expected | Refreshed PNG/WebP from `docs/SCREENSHOT_CAPTURE_TO_CDN.md` or local WebP chain only |

## Legacy markers detected on live pages

- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot7.png`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot12-480w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot15-480w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot6.png`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot2-480w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot10.png`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot12-480w.webp`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot10.png`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot4.png`
- https://nursenest.ca/for-institutions: `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot14-768w.webp`

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
