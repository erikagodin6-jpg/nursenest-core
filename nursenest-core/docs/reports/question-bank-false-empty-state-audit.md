# Question Bank False Empty State Audit

Generated: 2026-05-31T19:06:57.579Z

## Rendering Code Paths

- `src/components/questions/public-questions-study-launcher.tsx` is the only code path containing the exact publishing banner copy.
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` now logs the resolved launcher decision with pathway slug, published count, visible count, filter count, banner state, and reason.
- The banner is now allowed only when `publishedQuestionCount === 0`; unavailable snapshots, failed counts, and filtered-out visible pools render an error state instead.

## Pathway Results

| Group | Pathway | Published Questions | Active Questions | Question Bank Categories | Visible Questions | Banner Shown? | Expected? | Root Cause | Decision Reason |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| RPN Canada | ca-rpn-rex-pn | 3788 | 75 | 11 | 75 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| RN Canada | ca-rn-nclex-rn | 9110 | 4805 | 17 | 4805 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| NP | ca-np-cnple | 1496 | 0 | 0 | 0 | No | No | Published rows exist, but current hub visibility filters exclude them. | published_questions_filtered_out |
| PN US | us-lpn-nclex-pn | 4642 | 75 | 13 | 75 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| RN US | us-rn-nclex-rn | 12838 | 4805 | 17 | 4805 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| New Grad | us-rn-new-grad-transition | 0 | 0 | 0 | 0 | Yes | Yes | No published rows in pathway scope. | published_question_count_zero |
| NP | us-np-fnp | 3603 | 56 | 10 | 56 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| NP | us-np-agpcnp | 2252 | 56 | 10 | 56 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| NP | us-np-pmhnp | 2305 | 61 | 11 | 61 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| NP | us-np-whnp | 2344 | 61 | 11 | 61 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| NP | us-np-pnp-pc | 2243 | 61 | 11 | 61 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |
| Allied | ca-allied-core | 43837 | 0 | 0 | 0 | No | No | Published rows exist, but current hub visibility filters exclude them. | published_questions_filtered_out |
| Allied | us-allied-core | 43869 | 32 | 3 | 32 | No | No | Content available; publishing banner must not render. | published_and_session_pool_usable |

## Summary

- Audited pathways: 13
- False banners after fix: 0
- Pathways with published questions: 12
- Pathways with no published questions: 1

