# Admin Page Copy Editor — Safety Report

This document summarizes draft vs publish behavior, preview, RBAC, SEO safeguards, automated verification, and remaining risks for `/admin/content/page-copy` and `/api/admin/marketing-public-content`.

## Draft vs publish

- **Save draft** (`save_draft`): Persists `draft_value` on `MarketingPublicContentOverride` (creating an unpublished row if needed). Trimming to empty clears the draft (same effect as discard for staging text). Does not set `is_published` or change the live `value` used on public pages when an existing published row is updated.
- **Publish draft** (`publish_draft`): Requires non-empty trimmed `draft_value`, runs SEO/plain-text guards, copies draft into `value`, clears `draft_value`, sets `is_published: true` and `published_at`.
- **Discard draft** (`discard_draft`): Sets `draft_value` to null only; published `value` and `is_published` are unchanged.
- **Publish now** (`upsert`): Immediate publish of the textarea body; **empty trimmed value returns 400** with `empty_value` (cannot blank the live site via this path).
- **Revert to default** (`reset`): Deletes the override row for the key/locale and appends a revision row for audit.

Public marketing continues to resolve copy from **i18n/registry defaults**, overlaid only by **published** rows (`is_published: true`) in `loadMarketingPublicContentOverridesForLocale` (cached loader in `load-marketing-public-content-overrides.ts`).

## Preview behavior

- **Open live page**: Client builds a locale-aware marketing path via `buildMarketingPublicLivePageHref` (English unprefixed; other locales under `/{code}/…`). This shows **published** live site content only.
- **Open staged preview** (`/admin/content/page-copy/preview`): Admin-layout RBAC (`requireAdmin` in parent admin layout). Server reads DB `draft_value`, `value`, and catalog default; renders a read-only diagnostics view. **Drafts are not merged into public routes**; anonymous users never see this page without passing staff auth.

## RBAC

- API: `requireAdmin` on GET/POST (`ensure-admin` session + staff DB tier).
- UI: `/admin/content/page-copy` and nested `/admin/content/page-copy/preview` are under the admin shell gated by `requireAdmin` / `adminRouteGateDecision`.
- Support and content tiers: `isPathAllowedForStaffTier` includes paths under `/admin/content/page-copy` (prefix match covers preview). Super retains full access.

## SEO safeguards

- `assertPlainMarketingOverrideText`: max length, no angle brackets, blocks `javascript:` and inline event handler patterns.
- `assertMarketingOverrideSeoGuards`: additional soft caps for meta title / meta description keys.
- Contract tests: `marketing-public-content-policy-seo.contract.test.ts` (meta description, meta title, angle brackets).

## Public fail-soft

- Marketing layouts call `loadMarketingPublicContentOverridesForLocale(…).catch(() => ({}))` so loader failures do not take down public pages; catalog defaults still apply.

## Automated verification

| Layer | File / area |
| --- | --- |
| Live href | `marketing-public-content-live-href.test.ts` |
| API contracts | `marketing-public-content-admin-api-safety.contract.test.ts` |
| DB draft vs published | `marketing-public-content-admin-flow.integration.test.ts` (requires `DATABASE_URL` + admin user for FK) |
| RBAC path | `admin-path-policy.test.ts` |
| SEO guards | `marketing-public-content-policy-seo.contract.test.ts` |
| Playwright (optional) | `tests/e2e/admin/admin-page-copy-editor-safety.spec.ts` (`E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`) |

## Remaining risks

- **`MarketingEditableI18nText` (inline)**: Still publishes immediately where used; page-copy editor is the safer staged path for allowlisted keys.
- **Cache latency**: Published overrides use `unstable_cache` with tags; in rare cases, revalidation timing could briefly lag behind DB (mitigated by `revalidateTag` on mutations).
- **Search**: Server-side filter now includes catalog default text; very large default strings could still make filtering noisy (bounded by slot count).
- **Playwright DB flows**: Full save/publish/discipline flows are covered at the Prisma integration layer; end-to-end UI mutation tests are optional and depend on staff credentials + stable seed data.
