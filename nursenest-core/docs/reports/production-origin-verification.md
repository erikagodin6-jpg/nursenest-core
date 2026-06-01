# Production Origin Verification

Generated: 2026-06-01T02:26:23.685Z

These checks target the currently deployed production origin.

| Route | Status | Response time ms | Cache | Upstream | Error |
| --- | ---: | ---: | --- | --- | --- |
| / | 504 | 195 | MISS | 503 | - |
| /healthz | 504 | 89 | MISS | 503 | - |
| /readyz | 504 | 106 | MISS | 503 | - |
| /blog | 200 | 182 | HIT | 200 | - |
| /blog?page=2 | 200 | 161 | HIT | 200 | - |
| /blog?page=5 | 200 | 142 | HIT | 200 | - |
| /blog?page=10 | 200 | 150 | HIT | 200 | - |
| /sitemap.xml | 200 | 16 | HIT | 200 | - |
| /sitemap-blog.xml | 200 | 61 | HIT | 200 | - |

Verdict: one or more origin routes failed.
