# Tagalog I18n Summary

Generated: 2026-05-04T00:31:33.904Z

Coverage: 100% (17563/17563)
Missing shards: 0
Missing keys: 0
Placeholder fields: 0
English leak suspicions: 0
Untranslated review fields: 0
Blocked indexable surfaces: 0

| Route | Surface | Score | Indexable | Top issue |
| --- | --- | ---: | --- | --- |
| /tl | homepage | 100 | yes | none |
| /tl/pricing | pricing | 100 | yes | none |
| /tl/rn | rn-hub | 100 | yes | none |
| /tl/rex-pn | rex-pn-hub | 100 | yes | none |
| /tl/np | np-hub | 100 | yes | none |
| /tl/allied | allied-hub | 100 | yes | none |
| /tl/new-grad | new-grad-hub | 100 | yes | none |
| /tl/lessons | lesson-library | 100 | yes | none |
| /tl/question-bank | practice-questions | 100 | yes | none |
| /app/flashcards | flashcards | 100 | no | none |
| /app/practice-tests/cat-launch | cat | 100 | no | none |
| /tl/login | auth | 100 | no | none |

## SEO Validation

- Static SEO validation passed with `npm run audit:localized-seo` and `npm run i18n:seo:verify`.
- Tagalog readiness matched `/tl`, `/tl/pricing`, `/tl/lessons`, and `/tl/question-bank`; those shared locale-safe surfaces are sitemap/hreflang eligible.
- Pathway/allied/flashcard route families still fail closed in localized SEO because the router does not yet safely support localized public route shapes for those surfaces.
- Playwright route verification was attempted with `npm run test:localized-seo:routes`, but the Next.js dev server timed out after compile blockers: `UnhandledSchemeError: Reading from "node:crypto"` via `src/lib/db/database-url-drift-audit.ts` / `src/lib/instrumentation/register-node.ts`, and `UnhandledSchemeError: Reading from "node:module"` via `src/lib/navigation/country-exam-readiness-snapshot.ts` / `src/components/layout/site-footer.tsx`.
