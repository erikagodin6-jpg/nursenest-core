# Clinical SERP CTR Optimization + Intent Rewrite

## Figma-first gate

Ship **bulk title/description rewrites** only after SERP preview frames exist (desktop + mobile), truncation review, and theme readability checks — see `docs/governance/figma-premium-ui-mandatory-process.md`.

**Mock in Figma:** before/after snippets, mobile truncation, FAQ rich-result preview, breadcrumb SERP, trust indicators, NCLEX relevance chips.

## Objective

Raise organic CTR from impressions by improving specificity, intent match, and nursing authority — **not** keyword stuffing.

## Title frameworks (code)

`src/lib/seo/clinical-title-patterns.ts`

- Mechanism: Why X Causes Y; How X Leads to Y  
- Interpretation: X Explained for Nurses | Interpretation Guide  
- Comparison: X vs Y  
- Exam prep: Topic: NCLEX-RN Review  
- Clinical application: Nursing Assessment of X  

## Meta description guardrails (code)

`src/lib/seo/clinical-meta-description-patterns.ts`

- Length targets (~90–158 chars), weak filler detection, vague openers, clinical anchor expectation  

## Query intent buckets

Mapped via `inferSerpIntentFromTitle`: mechanism, interpretation, comparison, exam_prep, clinical_application, tool_calculator, unknown.

## Automated audit

```bash
cd nursenest-core
npm run audit:clinical-serp
npm run audit:clinical-serp -- --priority-only
npm run audit:clinical-serp -- --slug=my-slug
npm run audit:clinical-serp -- --json
```

Implementation: `scripts/seo/audit-clinical-serp-quality.mts` + `src/lib/seo/clinical-serp-quality-audit.ts`

Checks: bare-topic titles, mobile truncation risk, meta quality flags, duplicate titles/descriptions across programmatic registry, intent-unknown hints, title/H1 duplication info.

## Before / after examples (editorial)

| Weak | Strong |
|------|--------|
| Hyperkalemia | Why Hyperkalemia Causes Cardiac Arrhythmias (NCLEX Review) |
| COPD Barrel Chest | Why COPD Causes Barrel Chest (Air Trapping Explained) |

## High-priority slug hints

`HIGH_CTR_PRIORITY_SLUG_HINTS` in `clinical-serp-quality-audit.ts` — editorial queue for pages matching hyperkalemia, COPD, ABG, ECG, NCLEX, CAT, etc.

## Tests

```bash
npm run test:unit:clinical-serp
```

## Risks

- Over-long titles on mobile  
- Duplicate SERP copy across slugs  
- Intent mismatch (informational query vs tool page)  

Resolve with GSC query export + page pairing, not blind global rewrites.

## Related

- `src/lib/seo/programmatic-metadata.ts`  
- `scripts/seo/verify-gsc-csv.ts`
