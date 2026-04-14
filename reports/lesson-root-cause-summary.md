# Lesson root-cause bucket summary

Source: `reports/lesson-system-inventory.json` (inventory generated: 2026-04-14T13:52:25.407Z)
Diagnostic generated: 2026-04-14T13:52:50.933Z

## Non–public-complete lessons: primary bucket counts

| Bucket | Count |
| --- | ---: |
| missing_required_content_sections | 7079 |
| missing_pre_test_items | 0 |
| missing_post_test_items | 0 |
| structural_normalization_failure | 0 |
| slug_mismatch | 0 |
| route_mismatch | 0 |
| pathway_mapping_mismatch | 0 |
| filtered_out_by_topicSlugsIn | 0 |
| present_but_gating_or_merge_logic | 4610 |
| truly_missing_or_placeholder_content | 16 |

## By tier (PN / RN / NP / Allied / Other) — primary bucket

### PN

| Bucket | Count |
| --- | ---: |
| missing_required_content_sections | 750 |
| missing_pre_test_items | 0 |
| missing_post_test_items | 0 |
| structural_normalization_failure | 0 |
| slug_mismatch | 0 |
| route_mismatch | 0 |
| pathway_mapping_mismatch | 0 |
| filtered_out_by_topicSlugsIn | 0 |
| present_but_gating_or_merge_logic | 949 |
| truly_missing_or_placeholder_content | 4 |

### RN

| Bucket | Count |
| --- | ---: |
| missing_required_content_sections | 1058 |
| missing_pre_test_items | 0 |
| missing_post_test_items | 0 |
| structural_normalization_failure | 0 |
| slug_mismatch | 0 |
| route_mismatch | 0 |
| pathway_mapping_mismatch | 0 |
| filtered_out_by_topicSlugsIn | 0 |
| present_but_gating_or_merge_logic | 644 |
| truly_missing_or_placeholder_content | 0 |

### NP

| Bucket | Count |
| --- | ---: |
| missing_required_content_sections | 4991 |
| missing_pre_test_items | 0 |
| missing_post_test_items | 0 |
| structural_normalization_failure | 0 |
| slug_mismatch | 0 |
| route_mismatch | 0 |
| pathway_mapping_mismatch | 0 |
| filtered_out_by_topicSlugsIn | 0 |
| present_but_gating_or_merge_logic | 2987 |
| truly_missing_or_placeholder_content | 12 |

### Allied

| Bucket | Count |
| --- | ---: |
| missing_required_content_sections | 46 |
| missing_pre_test_items | 0 |
| missing_post_test_items | 0 |
| structural_normalization_failure | 0 |
| slug_mismatch | 0 |
| route_mismatch | 0 |
| pathway_mapping_mismatch | 0 |
| filtered_out_by_topicSlugsIn | 0 |
| present_but_gating_or_merge_logic | 30 |
| truly_missing_or_placeholder_content | 0 |

### Other

| Bucket | Count |
| --- | ---: |
| missing_required_content_sections | 234 |
| missing_pre_test_items | 0 |
| missing_post_test_items | 0 |
| structural_normalization_failure | 0 |
| slug_mismatch | 0 |
| route_mismatch | 0 |
| pathway_mapping_mismatch | 0 |
| filtered_out_by_topicSlugsIn | 0 |
| present_but_gating_or_merge_logic | 0 |
| truly_missing_or_placeholder_content | 0 |

## Top pathways by failed-lesson count

[
  {
    "pathwayId": "us-np-fnp",
    "failedCount": 1392
  },
  {
    "pathwayId": "us-np-agpcnp",
    "failedCount": 1352
  },
  {
    "pathwayId": "ca-np-cnple",
    "failedCount": 1335
  },
  {
    "pathwayId": "us-np-pmhnp",
    "failedCount": 1329
  },
  {
    "pathwayId": "us-np-pnp-pc",
    "failedCount": 1291
  },
  {
    "pathwayId": "us-np-whnp",
    "failedCount": 1291
  },
  {
    "pathwayId": "us-rn-nclex-rn",
    "failedCount": 1000
  },
  {
    "pathwayId": "us-lpn-nclex-pn",
    "failedCount": 859
  },
  {
    "pathwayId": "ca-rpn-rex-pn",
    "failedCount": 844
  },
  {
    "pathwayId": "ca-rn-nclex-rn",
    "failedCount": 702
  },
  {
    "pathwayId": "pre-nursing",
    "failedCount": 91
  },
  {
    "pathwayId": "ca-allied-core",
    "failedCount": 38
  },
  {
    "pathwayId": "us-allied-core",
    "failedCount": 38
  },
  {
    "pathwayId": "pre-nursing-pathophysiology",
    "failedCount": 27
  },
  {
    "pathwayId": "pre-nursing-anatomy-physiology",
    "failedCount": 25
  },
  {
    "pathwayId": "pre-nursing-chemistry",
    "failedCount": 25
  },
  {
    "pathwayId": "pre-nursing-math",
    "failedCount": 18
  },
  {
    "pathwayId": "pre-nursing-microbiology",
    "failedCount": 18
  },
  {
    "pathwayId": "pre-nursing-medical-terminology",
    "failedCount": 17
  },
  {
    "pathwayId": "pre-nursing-pharmacology-foundations",
    "failedCount": 13
  }
]
