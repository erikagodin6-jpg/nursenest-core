# International Content Expansion Phase 1

Generated: 2026-06-01T20:52:41.598Z
Mode: apply
Database available: yes
Blocker: Production publish failed before article selection: 
Invalid `prisma.blogPost.findMany()` invocation in
/root/nursenest-core/nursenest-core/scripts/blog/international-content-expansion-phase1.mts:559:39

  556   OR: [{ publishAt: null }, { publishAt: { lte: generatedAt } }],
  557 } satisfies Prisma.BlogPostWhereInput;
  558 
→ 559 const posts = await prisma.blogPost.findMany(
The provided database string is invalid. Error parsing connection string: invalid port number in database URL. Please refer to the documentation in https://www.prisma.io/docs/reference/database-reference/connection-urls for constructing a correct connection string. In some cases, certain characters must be escaped. Please check the string for any illegal characters.

## Pathways Added

| Hub | Locale | Region | Profession | Exam | Source inventory |
| --- | --- | --- | --- | --- | --- |
| /fr/np | fr | canada | np | cnple | English NP blog inventory |
| /es/np | es | us | np | fnp | English NP blog inventory |
| /fr/rpn | fr | canada | rpn | rex-pn | English RPN blog inventory |
| /es/pn | es | us | pn | nclex-pn | English RPN blog inventory |

## Articles Translated

| Variant | Selected | Created | Updated | Existing skipped | Failed | Before | After |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| fr-np | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| es-np | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| fr-rpn | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| es-pn | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Ranking Inputs

- Search volume proxy: `perfImpressions` and `perfClicks` from existing English posts.
- Exam relevance proxy: existing exam/career fields plus NP, CNPLE, FNP, RPN, REx-PN, PN, NCLEX-PN terminology in title, tags, category, and body.
- Clinical importance proxy: safety, priority, pharmacology, cardiac, respiratory, labs, clinical judgment, case, and assessment terms.
- Internal traffic proxy: `perfInternalClicks`, `perfConversionAssists`, and `perfSubscriptionAssists`.

## Top Source Sets

- NP source articles selected: 0.
- RPN/PN source articles selected: 0.

### Top 10 NP Sources


### Top 10 RPN/PN Sources


## Publishing Schedule

- French cadence: 3 posts/day.
- Spanish cadence: 3 posts/day.
- Mix target: 40% RN, 30% RPN/PN, 30% NP.
- RN-only publishing is explicitly avoided; every 10-day block should include 12 RN, 9 RPN/PN, and 9 NP posts per language.
- French runway from this phase: 0 posts = about 0 days at 3/day.
- Spanish runway from this phase: 0 posts = about 0 days at 3/day.

## Runway Improvement

- French publication runway added: 0 candidate posts.
- Spanish publication runway added: 0 candidate posts.
- Immediate localized rows created/updated in this run: 0.

## Coverage Improvement

- Dedicated hubs now exist for French NP, Spanish NP, French RPN, and Spanish PN.
- Hubs auto-populate from published `LocalizedBlogArticle` rows for their pathway mapping.
- No random topic generation was used; source selection is exclusively from existing English `BlogPost` inventory.
