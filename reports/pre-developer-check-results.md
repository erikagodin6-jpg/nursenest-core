# Pre-developer check results

Run from `nursenest-core/nursenest-core/` unless noted.

## npm run typecheck

**FAILED (exit 2)** — multiple pre-existing errors. Highlights:

- Marketing: allied lessons page, OSCE station page, exam hub pages (NODE_ENV comparison / null types)
- Admin: `api/admin/printables/[id]/route.ts` Prisma update input mismatch
- OSCE UI: `osce-station-detail-body.tsx`
- Flashcards: `build-flashcard-custom-session.ts`, `lesson-linked-flashcards-for-pathway.ts`
- Learner: `infer-continue-study-from-activity.ts`
- Lessons: `app-lessons-hub-published-snapshot-fallback.ts`, `app-pathway-lesson-list-scope.ts`
- Migrations: `transform-med-math-lesson.ts`
- Printables analytics: `printable-analytics.server.ts`
- SEO: `breadcrumb-i18n.ts`, `sitemap-blog-xml.ts`
- Stripe: `apply-stripe-webhook-event.ts` — fixed undefined `getStripeClientForNotification` → `getStripeClient` + null guard

Re-run: `cd nursenest-core && npm run typecheck`

## npm run lint

**NOT RUN** — no `lint` script in `nursenest-core/package.json`.

## npm test

**NOT RUN** — use `npm run audit:paywall-security`, `npm run test:pathway-lessons`, or `node --import tsx --test <files>`.

## npm run build

**NOT RUN** (blocked on typecheck).

## Other

| Command | Status |
|---------|--------|
| `npm run verify:no-cross-tier-leakage` | Recommended; not run this session |
| `npm run content:source-of-truth:check` | Recommended; not run this session |
| `npm run audit:paywall-security` | Recommended; not run this session |
