# Duplicate Content Audit

Generated: 2026-05-31T22:26:52.433Z

## Search Console Signal

- Duplicate without user-selected canonical: 370
- Duplicate, Google chose different canonical: 23
- URL-level duplicate export: Unable To Verify from this workspace.

## Duplicate-Prone Templates

| Template Family | Risk | Decision |
| --- | --- | --- |
| Localized pages | Incomplete translations can resemble canonical English content. | Keep incomplete locale pages noindex/follow and out of sitemap; publish locale pages only when unique translation quality is ready. |
| Question pages and practice-question templates | Thin question-only pages can duplicate topic/exam phrasing. | Differentiate with rationale, why-correct/why-incorrect, clinical application, exam strategy, related lessons, and schema. |
| Lesson variants | Multiple pathway versions can share headings/body systems. | Keep one canonical educational topic when content is truly shared; differentiate pathway-specific scope and exam relevance. |
| Marketing variants and exam landing pages | Regional/exam pages can share product claims. | Use self canonicals per genuinely distinct pathway; add region/exam-specific outcomes, screenshots, FAQ, and internal links. |
| `/seo/*` rewrites | Rewrite infrastructure can duplicate canonical public content. | Keep blocked and omitted from sitemap. |

## Remediation Rules

- **Merge** pages that target the same query and do not add distinct learner value.
- **Canonicalize** pages that must exist for routing but should not compete in search.
- **Differentiate** pages that are legitimate exam/pathway variants with unique scope, examples, FAQ, and internal links.
- **Noindex** private or incomplete surfaces only; do not noindex valuable public content while leaving it in the sitemap.
