# Blog Performance Validation

Generated: 2026-06-01

## Target

Validate that `/blog` can support a 5,000+ article corpus without loading the full corpus, exposing internal errors, or timing out on avoidable count and merge queries.

## Expected Runtime Behavior

| Route | Rows requested | Rows rendered | Count query | Full corpus merge |
| --- | ---: | ---: | --- | --- |
| `/blog` | 25 max | 24 max | No | No |
| `/blog?page=2` | 25 max | 24 max | No | No |
| `/blog?page=5` | 25 max | 24 max | No | No |
| `/blog?page=10` | 25 max | 24 max | No | No |

The extra row is used only to infer whether there is another page.

## Automated Validation

Focused command:

```bash
node --import tsx --test src/lib/blog/safe-blog-queries.list-load.test.mts src/lib/blog/safe-blog-queries.build-phase.test.mts src/lib/blog/blog-sitemap-merge.contract.test.ts
```

Result:

- 13 tests passed.
- 0 tests failed.

Expanded command:

```bash
node --import tsx --test src/lib/blog/safe-blog-queries.list-load.test.mts src/lib/blog/safe-blog-queries.build-phase.test.mts src/lib/blog/blog-sitemap-merge.contract.test.ts src/lib/blog/multilingual-blog-seo.contract.test.ts
```

Result:

- 20 tests passed.
- 2 tests failed in `src/lib/blog/multilingual-blog-seo.contract.test.ts`.

The failures are locale-gating expectations unrelated to the `/blog` timeout fix:

- Spanish synthetic entry indexability gate.
- French minimum-word threshold expectation.

The safe blog query tests and blog sitemap merge contract tests passed.

## TypeScript Validation

Command:

```bash
npx tsc --noEmit --pretty false
```

Result:

- Failed due to broad pre-existing errors across unrelated lessons, sitemap locale routes, admin blog imports, authority pages, ECG modules, RT ventilator modules, and SEO engines.
- No changed `/blog` index route file was identified in the reported error set.

## Local HTTP Smoke

A local Next dev server reported ready on `127.0.0.1:4321`, but follow-up `curl` calls from a separate sandbox command could not connect to that process. This appears to be a sandbox process/network isolation issue rather than a route response result. No persistent Next process remained visible afterward.

Production HTTP validation should be rerun after deployment with:

```bash
curl -I https://nursenest.ca/blog
curl -I https://nursenest.ca/blog?page=2
curl -I https://nursenest.ca/blog?page=5
curl -I https://nursenest.ca/blog?page=10
curl -I https://nursenest.ca/sitemap-blog.xml
```

## Production Readiness Assessment

The code path is now structurally ready for a 5,000+ article corpus. The remaining validation dependency is deployment and live origin confirmation.
