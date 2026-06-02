#!/usr/bin/env python3
"""
rn-remap-legacy-sections.py

Phase 1 of the RN lesson upgrade:
  - Maps legacy section kinds into corresponding standard section bodies
  - Removes legacy-named sections after merging
  - Preserves all good existing standard section content
  - Targets ca-rn-nclex-rn and us-rn-nclex-rn only

Run:
  python3 scripts/rn-remap-legacy-sections.py
  python3 scripts/rn-remap-legacy-sections.py --dry-run
"""

import json, argparse
from pathlib import Path

ROOT = Path(__file__).parent.parent
CATALOG_PATH = ROOT / "nursenest-core/src/content/pathway-lessons/catalog.json"

parser = argparse.ArgumentParser()
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()

RN_PATHWAYS = {"ca-rn-nclex-rn", "us-rn-nclex-rn"}

# How legacy kinds map into standard kinds
# Each legacy kind's body is appended (with a separator) to the target standard kind
LEGACY_MERGE_MAP = {
    "core_concept":      "pathophysiology_overview",
    "clinical_meaning":  "introduction",
    "exam_relevance":    "clinical_pearls",
    "clinical_scenario": "case_study",
    "takeaways":         "clinical_decision_making",
    # also handle alternate names seen in the wild
    "key_concepts":      "pathophysiology_overview",
    "clinical_pearls_extra": "clinical_pearls",
    "assessment_focus":  "signs_symptoms",
    "nursing_notes":     "nursing_assessment_interventions",
}

LEGACY_KINDS = set(LEGACY_MERGE_MAP.keys())

STANDARD_SECTION_DEFAULTS = {
    "introduction": {
        "id": "introduction",
        "heading": "Overview",
        "kind": "introduction",
        "body": "",
    },
    "pathophysiology_overview": {
        "id": "pathophysiology_overview",
        "heading": "Pathophysiology",
        "kind": "pathophysiology_overview",
        "body": "",
    },
    "signs_symptoms": {
        "id": "signs_symptoms",
        "heading": "Signs & Symptoms",
        "kind": "signs_symptoms",
        "body": "",
    },
    "labs_diagnostics": {
        "id": "labs_diagnostics",
        "heading": "Diagnostics & Labs",
        "kind": "labs_diagnostics",
        "body": "",
    },
    "nursing_assessment_interventions": {
        "id": "nursing_assessment_interventions",
        "heading": "Management & Treatments",
        "kind": "nursing_assessment_interventions",
        "body": "",
    },
    "clinical_decision_making": {
        "id": "clinical_decision_making",
        "heading": "Clinical Decision-Making & Nursing Priorities",
        "kind": "clinical_decision_making",
        "body": "",
    },
    "complications": {
        "id": "complications",
        "heading": "Complications",
        "kind": "complications",
        "body": "",
    },
    "clinical_pearls": {
        "id": "clinical_pearls",
        "heading": "Clinical Pearls",
        "kind": "clinical_pearls",
        "body": "",
    },
    "client_education": {
        "id": "client_education",
        "heading": "Patient & Client Education",
        "kind": "client_education",
        "body": "",
    },
    "case_study": {
        "id": "case_study",
        "heading": "Case-Based Application",
        "kind": "case_study",
        "body": "",
    },
}

def word_count(body: str) -> int:
    return len(body.split())

def remap_lesson_sections(lesson: dict) -> tuple[list, int, int]:
    """
    Returns (new_sections, legacy_merged_count, words_before)
    Merges legacy section content into standard sections, removes legacy sections.
    Preserves standard sections that already have good content.
    """
    old_sections = lesson.get("sections") or []
    words_before = sum(word_count(s.get("body", "")) for s in old_sections)

    # Build map of current standard sections (kind → section dict)
    standard_map: dict[str, dict] = {}
    for s in old_sections:
        kind = s.get("kind", "")
        if kind not in LEGACY_KINDS:
            standard_map[kind] = dict(s)  # copy

    # Merge legacy section bodies into standard targets
    legacy_merged = 0
    for s in old_sections:
        kind = s.get("kind", "")
        if kind not in LEGACY_MERGE_MAP:
            continue
        target_kind = LEGACY_MERGE_MAP[kind]
        legacy_body = s.get("body", "").strip()
        if not legacy_body:
            continue

        if target_kind not in standard_map:
            # Create the target standard section
            tmpl = dict(STANDARD_SECTION_DEFAULTS.get(target_kind, {
                "id": target_kind,
                "heading": target_kind.replace("_", " ").title(),
                "kind": target_kind,
                "body": "",
            }))
            standard_map[target_kind] = tmpl

        existing_body = standard_map[target_kind].get("body", "").strip()

        # Only append if legacy content is NOT already in the existing body
        # (avoid duplicate content)
        if legacy_body[:80] not in existing_body:
            sep = "\n\n" if existing_body else ""
            standard_map[target_kind]["body"] = existing_body + sep + legacy_body

        legacy_merged += 1

    # Build final ordered section list using standard order
    SECTION_ORDER = [
        "introduction",
        "pathophysiology_overview",
        "risk_factors",
        "signs_symptoms",
        "labs_diagnostics",
        "nursing_assessment_interventions",
        "clinical_decision_making",
        "complications",
        "clinical_pearls",
        "client_education",
        "case_study",
    ]

    new_sections = []
    used_kinds = set()

    # First: standard sections in canonical order
    for kind in SECTION_ORDER:
        if kind in standard_map:
            new_sections.append(standard_map[kind])
            used_kinds.add(kind)

    # Then: any remaining non-legacy, non-standard sections (preserve unknown kinds)
    for s in old_sections:
        kind = s.get("kind", "")
        if kind not in LEGACY_KINDS and kind not in used_kinds:
            new_sections.append(s)
            used_kinds.add(kind)

    return new_sections, legacy_merged, words_before


# ── Main ──────────────────────────────────────────────────────────────────────
catalog = json.loads(CATALOG_PATH.read_text())

total_processed = 0
total_legacy_merged = 0
total_words_gained = 0
lessons_changed = 0

print("Phase 1: Remapping legacy section kinds for RN lessons\n")

for pw_key, pw_val in catalog["pathways"].items():
    if pw_key not in RN_PATHWAYS:
        continue

    lessons = pw_val.get("lessons", [])
    pw_changed = 0

    for lesson in lessons:
        sects = lesson.get("sections") or []
        kinds = {s.get("kind", "") for s in sects}
        has_legacy = bool(kinds & LEGACY_KINDS)

        total_processed += 1

        if not has_legacy:
            continue

        new_sections, merged, words_before = remap_lesson_sections(lesson)
        words_after = sum(word_count(s.get("body", "")) for s in new_sections)

        total_legacy_merged += merged
        delta = words_after - words_before
        total_words_gained += delta
        lessons_changed += 1
        pw_changed += 1

        if not args.dry_run:
            lesson["sections"] = new_sections

        flag = "[DRY]" if args.dry_run else "✓"
        print(f"  {flag} [{pw_key}] {lesson['slug']}: {words_before}w → {words_after}w (+{delta}w, {merged} legacy merged)")

    if not args.dry_run and pw_changed:
        print(f"\n  Pathway {pw_key}: {pw_changed} lessons updated")

if not args.dry_run:
    CATALOG_PATH.write_text(json.dumps(catalog, indent=2, ensure_ascii=False))
    print(f"\nSaved: {CATALOG_PATH}")

print(f"""
═══════════════════════════════════════════════════════
 Phase 1 Summary
═══════════════════════════════════════════════════════
  RN lessons processed:  {total_processed}
  Lessons modified:      {lessons_changed}
  Legacy sections merged:{total_legacy_merged}
  Total words gained:    +{total_words_gained:,}
  {'[DRY RUN — no files written]' if args.dry_run else 'catalog.json saved ✓'}
═══════════════════════════════════════════════════════
""")
