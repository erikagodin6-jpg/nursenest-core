# Internal link audit

CI and local guardrail that compares internal `href` strings and common navigation targets against the App Router `src/app` tree, programmatic SEO slugs, and locale-aware marketing rules.

## Run

From the `nursenest-core/` package directory:

```bash
npm run audit:internal-links
```

Unit checks for the validator:

```bash
npm run test:internal-links-audit
```

## What it scans

- `src/**/*.ts(x)` and `scripts/**/*.ts(x)` (excluding `*.test.ts`, `*.spec.ts`)
- `next/config`-style redirect `destination` strings in `next.config.ts`
- Patterns: `href="..."`, `href={'...'}`, template `href={\`/prefix/${...}`, `router.push/replace/prefetch("...")` and simple backtick forms, `callbackUrl=` query values

## What it ignores

- `http(s):`, `mailto:`, `tel:`, `#` fragments, `javascript:`, `data:`
- Paths containing `${` (fully dynamic template bodies)
- `/_next/`, `/api/*` (validated separately against `route.ts` handlers), `/favicon.ico`, `/robots.txt`, `/sitemap.xml`, `/healthz`

## Locale rules

If the first path segment is a marketing locale code (`MARKETING_LOCALE_CODES`), the path must be a real localized marketing route (static second segment such as `/fr/pricing`, or a programmatic slug, or `/fr/tools/...`). Arbitrary `/fr/foo` is rejected.

## Exit code

- `0` when every extracted internal path resolves
- `1` when any path fails, with file, line, path, and optional suggested nearest known path
