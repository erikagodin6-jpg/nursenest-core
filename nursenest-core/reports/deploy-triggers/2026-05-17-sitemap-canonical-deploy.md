# Deploy trigger: sitemap canonical fix

Purpose: force a main-branch deploy after sitemap canonical-origin hardening.

Related fixes:
- `410ffc822e7a92984a80ead8cef9769bb1b37617` — force canonical HTTPS origin for sitemap emission.
- `8840942c1aba522ae468a2df6905788d78fb807d` — emit fallback breadcrumb schema from marketing JSON-LD.

Expected production verification after deploy:

```bash
curl -I https://www.nursenest.ca/sitemap.xml
curl https://www.nursenest.ca/sitemap.xml | head
```

Required result:
- HTTP 200
- `Content-Type: application/xml`
- child `<loc>` values use `https://www.nursenest.ca/...`
