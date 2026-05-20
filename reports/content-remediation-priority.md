# Content remediation priority

Ordered plan for improving **public educational quality** without mass-deleting rows, breaking **indexed routes**, or weakening **canonical SEO** metadata.

## P0 — Trust and policy (fix first)

| Item | Action | Why |
| --- | --- | --- |
| Placeholder / lorem / TODO in **live** HTML or lesson JSON | Replace copy in place; keep slug/URL | E-E-A-T and learner trust; **blocked on new publish** via shared guard |
| AI self-disclaimer ("as an AI…") | Remove entirely; rewrite neutral educator voice | Same gates block going forward |
| Invalid internal links in blog plans | Repair `internalLinkPlan` / anchors | Pre-publish already blocks broken lesson paths |

**Verification:** `npm run content:audit-published-educational` — any row listed under placeholders should be edited first.

## P1 — Depth and structure (SEO + learning value)

| Item | Action | Why |
| --- | --- | --- |
| Blog composite / governance score below bar | Use `npm run blog:audit-published-quality` weak list | Composite and hints already rank remediation |
| Blog body below publish word target | Expand clinical arcs (mechanism → assessment → interventions → teaching → escalation) | `blog-pre-publish-validation` + `blog-publish-quality-validator` |
| Pathway lessons with `structuralPublicComplete = false` | Complete premium spine / normalized sections | Publish transition already blocked |

## P2 — Polish and internal linking

| Item | Action | Why |
| --- | --- | --- |
| Low internal link density (blogs) | Add substantive `/...` anchors to lessons/tools | Snapshot script surfaces `<a href="/` counts |
| Repetitive paragraphs (long lessons) | De-duplicate; merge into one stronger section | `validateLessonForPublish` duplicate heuristic |

## What not to do

- Do **not** bulk-delete `BlogPost` or `PathwayLesson` rows for "cleanup" — prefer **status** / workflow plus in-place rewrites.
- Do **not** change `slug` / unique keys unless a dedicated SEO migration is approved.
- Do **not** relax `private` / `no-store` cache semantics on learner `/app` surfaces when touching related code.

## Automation summary (future publishes)

| Gate | Location |
| --- | --- |
| Placeholder + AI disclaimer (blogs) | `validateBlogPrePublish`, `evaluateBlogGenerationOutputGate` |
| Placeholder + AI disclaimer + long duplicate paragraphs (lessons) | `validateLessonForPublish`, `governContentItemLessonPublish` |
| Word count + arcs + filler (blogs) | Existing blog quality modules |
| Thin lesson body | `governContentItemLessonPublish` plus optional acknowledge |

## Next steps for owners

1. Run `npm run content:audit-published-educational` with production read-only DB access.
2. Triage P0 slugs first; assign rewrites in CMS/admin.
3. Re-run audits until snapshot tables are empty or only intentional edge cases remain (document exceptions in ticket notes, not in public HTML).
