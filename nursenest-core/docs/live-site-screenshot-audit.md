# Live Site Screenshot Audit

**Production base:** https://nursenest.ca
**Audited:** 2026-05-30T06:28:45.028Z
**Pass:** 0/10 · **Fail/Error:** 9/10

> **Completion rule:** This program is NOT complete until every row shows `Live Status = PASS` with fingerprint-verified new assets.

| Page URL | Current Image (sample) | Asset Source | Screenshot Age | Needs Replacement | Replacement Candidate | Live Status |
| --- | --- | --- | --- | --- | --- | --- |
| https://nursenest.ca/ | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/homepage-screenshots/screenshot1.webp | FAIL |
| https://nursenest.ca/pricing | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/marketing/rn-marketing-hub.webp | FAIL |
| https://nursenest.ca/us/rn/nclex-rn | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/marketing/rn-marketing-hub.webp | FAIL |
| https://nursenest.ca/canada/pn/rex-pn | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/marketing/pn-marketing-hub.webp | FAIL |
| https://nursenest.ca/canada/np/cnple | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/marketing/np-marketing-hub.webp | FAIL |
| https://nursenest.ca/allied/allied-health | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/marketing/allied-marketing-hub.webp | FAIL |
| https://nursenest.ca/canada/new-grad | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp | FAIL |
| https://nursenest.ca/ecg-interpretation | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | /marketing/generated-screenshots/core/ecg-workstation.webp | FAIL |
| https://nursenest.ca/faq | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | See screenshot-replacement-map.md | WARN |
| https://nursenest.ca/for-institutions | https://nursenest-images.tor1.cdn.digitaloceanspaces.com/Logos/north-sea-leaf-tr | CDN (other) | Stale / not deployed | Yes | See screenshot-replacement-map.md | FAIL |

## Evidence

- JSON: `reports/production-screenshot-verification/verification-results.json`
- Playwright captures: `reports/production-screenshot-verification/*.png`
