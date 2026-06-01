# Blog Conversion Optimization

Generated: 2026-06-01T19:09:32.412Z

## Verdict

**Conversion components exist; production-wide certification blocked by crawl failures.**

The blog article template already renders contextual conversion and learning-system links. No UI redesign or new CTA feature was added in this pass because the sprint is blocked at crawlability.

## Existing Conversion Surfaces

- Above-fold article topic/exam badges and blog breadcrumb discovery.
- `BlogPostDistributionFooter` for related lessons, flashcards, question-bank/app CTAs, and tool links.
- `MarketingStudyCrossLinks` on list/error/empty states.
- Body auto-linking through `applyAutoLinksToHtml`.
- Analytics-aware distribution links through blog distribution components.

## Requested CTA Coverage

| CTA Type | Current Evidence | Status |
| --- | --- | --- |
| Free questions | Distribution footer and generated article bodies link to question/practice surfaces where metadata exists | Needs post-crawl certification |
| Flashcards | Distribution footer links to flashcard hub/contextual flashcard anchors | Present in template |
| Lessons | Related lesson paths and auto-linking exist | Present in template |
| CAT exams | Some generated article bodies and authority pages link to CAT surfaces | Needs coverage audit |
| Study plans | App/dashboard/study loop CTAs exist in generated content | Needs coverage audit |

## Gate

Do not optimize CTR before the content can be crawled. First target: 0 HTTP 504s, then run article-template coverage on live HTML.
