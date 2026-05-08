# Blog vertical slice — redesign summary

## Summary

Marketing blog surfaces (`/blog`, `/blog/tag/*`, new `/blog/category/*`, `/blog/[slug]`) now align with the **homepage / premium** design language: `nn-spectrum-rule-top`, semantic status tokens, `premium-redesign-2026.css` blog topic badges, card shadows, responsive grids, and mobile overflow fixes (tags, filters, buttons). Article pages add optional **Clinical summary** and **Key takeaways** when `shortSummary` / `schemaSummary` / `keyTakeaways` are present, a comfortable **prose measure** (`max-w-[65ch]`), and an **On this page** TOC (desktop `xl+`) when the body has multiple headings. Internal lesson links and analytics in `BlogPostDistributionFooter` are preserved; related lessons use card chips. Breadcrumb category crumbs link to `/blog/category/{exact category}` when a category exists.

## Files changed (primary)

- `src/app/(marketing)/(default)/blog/page.tsx`
- `src/app/(marketing)/(default)/blog/[slug]/page.tsx`
- `src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx`
- `src/app/(marketing)/(default)/blog/category/[category]/page.tsx` (new)
- `src/lib/blog/safe-blog-queries.ts`
- `src/lib/blog/blog-post-category-visual.ts` (new)
- `src/lib/seo/pathway-breadcrumbs.ts`
- `src/app/premium-redesign-2026.css`
- `src/components/blog/blog-post-card.tsx`, `blog-topic-badge.tsx`, `blog-marketing-post-list-client.tsx`, `blog-article-toc.tsx`, `blog-related-reading-section.tsx`, `blog-post-distribution-footer.tsx`
- `tests/e2e/public/blog-marketing-redesign.spec.ts` (new)

## Playwright routes

`/blog`, `/blog/tag/pathophysiology`, `/blog/category/Pathophysiology`, first article from index, mobile `/blog`. Requires `BASE_URL` server (default `http://localhost:3000`).

## Screenshots

Run Playwright successfully, then copy attachments to `preview-screenshots/` and `reports/ui-redesign-preview/`.

## Verification

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass

## Blockers

Playwright E2E needs running Next app. Category URLs match DB `category` string exactly.
