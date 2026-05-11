# NCLEX Commercial Landing Ecosystem

## Page inventory

Implemented 13 English-first commercial SEO landing routes:

- `/nclex-question-bank` - best NCLEX question bank / qbank comparison intent.
- `/nclex-study-plan` - 30/60/90 day NCLEX study-plan intent.
- `/rex-pn-study-plan` - Canadian PN / REx-PN study-plan intent.
- `/nclex-vs-rex-pn` - comparison intent for US/Canada and RN/PN exam differences.
- `/nclex-next-gen-question-types` - NGN format and clinical judgment intent.
- `/cat-nclex-simulator` - CAT simulator commercial and exam-prep intent.
- `/free-nclex-practice-questions` - free practice value and conversion intent.
- `/best-nclex-prep-course` - commercial prep-course comparison intent.
- `/lpn-nclex-prep` - practical nursing / NCLEX-PN intent.
- `/lvn-nclex-prep` - LVN practical nursing intent.
- `/canadian-nclex-guide` - Canadian RN / IEN / NCLEX Canada intent.
- `/how-to-pass-nclex-2026` - 2026 long-tail strategy intent.
- `/adaptive-nclex-testing` - adaptive testing explainer intent.

## Figma references

Required Figma file target: `NurseNest NCLEX Commercial SEO Ecosystem`.

Execution note: the official Figma MCP server was not registered in this Cursor session, and the available UI canvas MCP timed out waiting for the editor webview. No real Figma URL, file key, or frame IDs were available to attach. This is an unresolved release risk and should be resolved before a final visual PR is treated as Figma-complete.

Design concepts were translated into the implemented module system and should be recreated in Figma with these frame groups before final sign-off:

- Desktop, tablet, mobile route template frames.
- Ocean, Blossom, Midnight theme variants.
- Hero, comparison matrix, study timeline, CAT simulator, question bank preview, readiness dashboard, trust section, FAQ, sticky CTA, and pricing/free-vs-premium modules.

## SEO targeting strategy

The registry in `nursenest-core/src/lib/seo/nclex-commercial-landing-pages.ts` stores each page's target queries, intent mix, title, meta description, H1, internal links, FAQ schema, and breadcrumb schema. The pages are built for commercial, informational, comparison, exam-prep, and long-tail queries without relying on fake proof or thin filler.

## Conversion strategy

Each page has:

- One primary CTA mapped to the most relevant study action.
- One secondary CTA for comparison, CAT, lessons, or practice.
- Audience chips for fast visitor self-identification.
- A premium readiness preview that reinforces adaptive study, clinical judgment, and weak-area recovery.
- A final CTA module that explains whether the visitor should start with lessons, questions, rationales, or CAT.

## Internal-link strategy

Pages link into existing NurseNest surfaces rather than creating parallel study tools:

- RN NCLEX lessons, question bank, CAT, and flashcards.
- Canadian RN and REx-PN hubs, lessons, questions, and CAT readiness.
- Global question-bank and practice-exam routes.
- Cross-links between commercial explainers such as NCLEX study plan, CAT simulator, and NCLEX vs REx-PN.

## Schema strategy

Implemented schema support:

- BreadcrumbList via the shared `BreadcrumbBar` rendering path.
- FAQPage JSON-LD from each page's registry FAQs.
- Canonical metadata through `seoPageMetadata` and `absoluteUrl`.

## Free vs premium positioning

Free pages and CTAs are positioned around genuine sample value: rationale previews, category filtering, NGN examples, and directional readiness cues. Upgrade language is tied to deeper study loops, CAT simulation, flashcards, and remediation rather than fear-based claims.

## Launch phases

1. Registry and shared renderer: implemented.
2. Static public route entrypoints: implemented.
3. Sitemap collector and fallback paths: implemented.
4. Contract tests for SEO/schema/content/route/sitemap: implemented.
5. Figma file and frame evidence: blocked by unavailable Figma MCP and canvas timeout.
6. Browser visual QA screenshots: not completed in this pass.

## Mobile UX decisions

- Mobile sticky CTA appears only below the mobile breakpoint.
- Comparison matrices collapse into stacked rows.
- Timeline, differentiator, and internal-link grids collapse to one column.
- CTAs expand to full width on small screens.
- CSS uses semantic/theme tokens and existing premium visual infrastructure.

## Unresolved risks

- Figma evidence is missing due to tooling availability; final release should not claim Figma parity until the official Figma file is created and reviewed.
- Truthpack files were not present in the checkout, so tier/pricing claims were intentionally avoided.
- Canadian regulatory and fee details are intentionally non-specific and tell learners to verify official regulator and Pearson VUE guidance.
- No testimonials were invented; approved social proof can be added later through the registry/module system.

## Validation evidence

Commands run during implementation:

- `rg --files -g '.vibecheck/**' -g 'truthpack/**' -g '*truthpack*'` - no truthpack files found.
- MCP descriptor inspection for `user-uicanvas` tools.
- `CallMcpTool user-uicanvas/open_canvas` - failed with webview connection timeout.

Validation results:

- `node --import tsx --test src/lib/seo/nclex-commercial-landing-pages.contract.test.ts` - passed, 6/6 tests.
- `npm run test:seo-sitemap` - passed, 44/44 tests.
- `npm run seo:guardrails` - passed.
- `npm run test:internal-links-audit` - passed, 5/5 tests.
- `ReadLints` on edited files - no linter errors.
- `npm run typecheck` - failed in pre-existing question-support typing code: `src/lib/questions/practice-runner-question-support.ts` references `reason` on the supported render-class union variant. No new landing files were listed in the typecheck output.

## Final deploy readiness — 2026-05-11

### Deployment readiness

Safe to merge from the NCLEX commercial landing ecosystem perspective after the isolated typecheck fixes in the working tree. The 13 landing pages remain server-rendered, sitemap-visible, schema-tested, and internally linked into existing NurseNest study surfaces without changing learner route auth, entitlement, or CAT behavior.

### Typecheck status

The original `npm run typecheck` blocker in `src/lib/questions/practice-runner-question-support.ts` was low-risk and isolated. Root cause: `practiceRunnerNeedsUnsupportedFallback` narrowed `shape.kind === "supported"` only when canonical option length was at least two, then fell through and read `shape.reason`, which only exists on the `unsupported_shape` union member. Fix: return immediately for supported shapes, using `optsCanonicalLen < 2` as the fallback decision. Added a regression test for scalar option payloads whose canonical parsing yields too few choices.

A second unrelated full-typecheck blocker appeared in multilingual blog sitemap work: `src/lib/seo/sitemap-multilingual-blog-xml.ts` imported `MultilingualBlogLocaleCode` from the registry module instead of `src/lib/blog/multilingual-blog-seo-types.ts`. This was corrected as an isolated type-only import fix.

### Figma evidence risk

Figma evidence remains the main non-code risk. The official Figma MCP server was not registered in this Cursor session, and the available UI canvas MCP timed out waiting for the editor webview. No Figma URL, file key, frame IDs, or exported side-by-side screenshots were produced. Do not claim Figma parity in a PR until the required Figma file and Ocean/Blossom/Midnight desktop/mobile frames are created and attached.

### Commands and results

- `node --import tsx --test src/lib/questions/practice-runner-question-support.test.ts` — passed, 8/8 tests.
- `npm run typecheck:critical` — passed.
- `npm run test:seo-sitemap` — passed, 44/44 tests.
- `npm run test:internal-links-audit` — passed, 5/5 tests.
- `node --import tsx --test src/lib/seo/nclex-commercial-landing-pages.contract.test.ts` — passed, 6/6 tests.
- `npm run seo:guardrails` — initially failed because current sitemap index configuration included `sitemap-fr-blog.xml` and `sitemap-es-blog.xml` while `sitemap-index.contract.test.ts` still expected the older eight-child list; the contract was updated to match the configured child sitemap set and then passed.
- `npm run typecheck` — passed after the isolated fixes above.
- `ReadLints` on edited files — no linter errors.

### Merge decision

Safe to merge for code deploy readiness if reviewers accept the documented Figma evidence gap as a known visual QA follow-up. If the release policy requires strict Figma-first evidence before merge, hold the PR until the Figma MCP/file is available and the required frames plus screenshots are attached.

