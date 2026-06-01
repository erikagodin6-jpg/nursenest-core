# Production Origin Verification

Generated: 2026-06-01T19:01:59.224Z

These checks target the currently deployed production origin.

| Route | Status | Response time ms | Cache | Upstream | Error |
| --- | ---: | ---: | --- | --- | --- |
| / | 200 | 1159 | MISS | 200 | - |
| /healthz | 200 | 269 | MISS | 200 | - |
| /readyz | 200 | 352 | MISS | 200 | - |
| /blog | 200 | 939 | MISS | 200 | - |
| /blog?page=2 | 200 | 791 | MISS | 200 | - |
| /blog?page=5 | 200 | 1420 | MISS | 200 | - |
| /blog?page=10 | 200 | 909 | MISS | 200 | - |
| /sitemap.xml | 200 | 80 | MISS | 200 | - |
| /sitemap-blog.xml | 200 | 1889 | MISS | 200 | - |

Verdict: origin routes returned HTTP 200.
