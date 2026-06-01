# United States NCLEX EEAT Expansion Roadmap

Generated: 2026-06-01

Goal: strengthen expertise, experience, authority, and trust across US NCLEX acquisition pages without making unsupported clinical or pass-rate claims.

## Current Evidence

| Evidence | Finding |
|---|---|
| `src/lib/seo/nclex-commercial-landing-pages.ts` | Commercial NCLEX pages exist and include Article + FAQ JSON-LD. |
| `src/lib/blog/regional-blog-cluster-page.tsx` | Blog detail pages generate metadata, FAQ schema, internal study anchors, OG image, and article-style SEO. |
| `docs/global-content-quality-governance-system.md` and `docs/content-quality/*` | Content quality governance exists at documentation level. |
| `docs/question-quality-contract-v2.md` | Question quality contract exists and can support rationale/clinical judgment claims. |
| `docs/us-launch-scorecard.md` | US content readiness is strong, but conversion and billing readiness still need work. |

## Required EEAT Surfaces

| Surface | Requirement | Implementation note |
|---|---|---|
| About page | Explain NurseNest’s nursing education mission, clinical judgment philosophy, and product boundaries. | Upgrade copy; do not create unsupported pass-rate claims. |
| Editorial standards | Publish how lessons/questions/rationales are created, reviewed, revised, and archived. | Link from footer and commercial pages. |
| Clinical review process | Document reviewer roles, evidence hierarchy, high-risk review gates, and update cadence. | Reference existing governance docs. |
| Author profiles | Add nursing education author profiles with credentials, scope, and topics. | Required before byline-heavy blog expansion. |
| Medical/clinical reviewer profiles | Add reviewer profile blocks for high-risk clinical content. | Must be real, credentialed, and permissioned. |
| Content governance page | Explain content statuses, review requirements, and no-guarantee exam support language. | Should be linked from NCLEX commercial pages. |
| Correction policy | State how errors are reported, reviewed, and corrected. | Important for YMYL trust. |
| Sources policy | Explain when official exam/regulatory sources and clinical guidelines are used. | Use NCSBN as official NCLEX source. |

## Clinical Claims Guardrails

Allowed:
- “Built around clinical judgment and NCLEX-style reasoning.”
- “Connects questions, rationales, lessons, flashcards, CAT, and readiness signals.”
- “Readiness signals help guide remediation.”

Not allowed unless evidence exists:
- Guaranteed pass claims.
- Superior pass-rate claims.
- “Most accurate predictor.”
- “Official NCLEX questions.”
- Direct claims that NurseNest reproduces the real NCLEX exam.

## Source Strategy

Primary official sources for NCLEX pages:

- NCSBN/NCLEX 2026 RN Test Plan: `https://www.nclex.com/test-plans.page`
- 2026 NCLEX-RN Test Plan PDF: `https://www.ncsbn.org/public-files/2026_RN_Test-Plan_English-F.pdf`
- NCSBN Clinical Judgment Measurement Model: `https://www.nclex.com/clinical-judgment-measurement-model.page`
- NCSBN Next Generation NCLEX overview: `https://www.nclex.com/next-generation-nclex.page`

Competitor comparison pages:

- Use competitor-owned public pages only for feature claims.
- Archive review date in the document/page.
- Avoid claims about price, question count, pass rate, guarantees, or trial length unless captured and sourced at publication time.

## Page-Level EEAT Requirements

Every high-intent NCLEX commercial page should include:

- Reviewed-by or editorial-review note.
- Link to editorial standards.
- Link to official NCLEX/NCSBN resources where educationally relevant.
- Date reviewed and next review date.
- FAQ with answer boundaries.
- “Educational support, not regulator guidance” disclaimer where eligibility/regulation appears.

## Priority Build Order

1. Editorial standards page.
2. Clinical review process page.
3. NCLEX author/reviewer profile template.
4. About page upgrade.
5. Correction policy.
6. Apply byline/reviewer blocks to NCLEX commercial and US RN blog pages.

## Acceptance Criteria

- Every NCLEX acquisition page has visible editorial trust scaffolding.
- Every clinical or exam-process claim is either source-linked or phrased as product positioning.
- Comparison pages separate verified competitor facts from NurseNest positioning.
- No page claims guaranteed outcomes.
