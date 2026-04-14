# Ranked lesson fix plan (diagnostic)

## A. Content / gating fixes (highest impact)
- Primary failure mode is **premium/legacy minimum depth**, **clinical scenario signal**, and **relatedLessonRefs** metadata — tune authoring or relax gates only with product approval.
- Address placeholder/banned phrasing where `truly_missing_or_placeholder_content` dominates.

## B. Mapping / filter fixes
- Review **relatedLessonRefs** targets where `slug_mismatch` / broken refs appear in inventory.
- Allied: align **topicSlug** distribution with `topicSlugsIn` per profession or adjust filters after content inventory.

## C. Route fixes (only if proven in runtime)
- No route bugs proven from static JSON; verify with Next + `getPathwayLesson` for specific slugs if a mismatch is suspected.

## D. Manual review
- NP high-volume pathways: spot-check slugs with mixed issue types.
- "Other" tier group pathways (e.g. upcoming): confirm intentional non-publish.

## Top primary buckets (this run)
missing_required_content_sections: 7079; present_but_gating_or_merge_logic: 4580; truly_missing_or_placeholder_content: 16; missing_pre_test_items: 0; missing_post_test_items: 0