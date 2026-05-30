# Asset Cache Analysis

**Analyzed:** 2026-05-30T08:08:09.273Z

## Root cause summary

| Layer | Finding |
| --- | --- |
| **Git / deploy** | 0 modified/untracked files under `public/marketing/` — new bytes not shipped until commit + deploy |
| **App wiring** | Code on `main` references `generated-screenshots`; Ocean theme must use `core/` not `themes/ocean/` (fixed locally) |
| **CDN fallback** | Institutions + hero carousel still resolve CDN WebP/PNG when local slot missing or chain falls through |
| **Next.js Image** | `/_next/image` caches optimized derivatives — fingerprint compares underlying static file |
| **Browser** | Standard cache headers on `public/marketing/**` static files |

## Probe results

- **Homepage slot 1 local:** `https://nursenest.ca/marketing/homepage-screenshots/screenshot1-480w.webp` → 200 · image/webp · 10610b · Sat, 30 May 2026 07:11:34 GMT
- **CDN screenshot1.png:** `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png` → 200 · image/png · 553881b · Sat, 28 Mar 2026 12:08:26 GMT
- **CDN screenshot1 webp:** `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1-480w.webp` → 403 · application/xml · 249b · —
- **Core dashboard:** `https://nursenest.ca/marketing/generated-screenshots/core/learner-dashboard.webp` → 200 · image/webp · 45450b · Sat, 30 May 2026 07:11:34 GMT
- **RN hub marketing:** `https://nursenest.ca/marketing/generated-screenshots/marketing/rn-marketing-hub.webp` → 200 · image/webp · 37250b · Sat, 30 May 2026 07:11:34 GMT
- **Phantom themes/ocean (should 404):** `https://nursenest.ca/marketing/generated-screenshots/themes/ocean/ecg-workstation.webp` → 404 · text/html; charset=utf-8 · 13470b · —

## Remediation order

1. Commit + deploy all `public/marketing/**` changes (homepage slots + generated captures)
2. Deploy wiring fix (`marketingProofFromCoreKey` Ocean → `core/`)
3. Re-upload CDN `screenshot1–15` per `docs/SCREENSHOT_CAPTURE_TO_CDN.md` OR rely on local-first hero chain after deploy
4. Purge DigitalOcean CDN if institutions page still serves stale Spaces WebP after local files deploy
5. Re-run `npm run verify:production:marketing-screenshots`
