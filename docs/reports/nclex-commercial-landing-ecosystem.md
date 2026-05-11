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

Validation commands to run after this report:

- `node --import tsx --test src/lib/seo/nclex-commercial-landing-pages.contract.test.ts`
- `npm run typecheck`
- `npm run test:seo-sitemap`
- `npm run seo:guardrails`
- `npm run test:internal-links-audit`
