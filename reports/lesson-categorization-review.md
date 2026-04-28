# Lesson categorization review (manual + deterministic)

This file tracks **editorial taxonomy rules** implemented in `nursenest-core/src/lib/lessons/lesson-taxonomy.ts`. It is not auto-generated; refresh it when you materially change category lists, legacy maps, or keyword priority.

## Controlled categories

Display categories are the fixed list `LESSON_CATEGORIES` in `lesson-taxonomy.ts` (**21** entries, including **Fundamentals**). There is **no** `"Unknown"` bucket: empty or unclassified free text falls back to **Fundamentals** for display; hub routing still uses `REVIEW_REQUIRED` when taxonomy cannot place a lesson.

## Keyword priority (title + topic corpus)

When inferring from text, rules are evaluated **in order** (first match wins):

1. Pharmacology (antibiotics, anticoagulants, insulin, high-alert meds, stewardship language, etc.)
2. Infection Control (isolation, PPE, transmission, HAI, hand hygiene, meningitis + precaution context, etc.)
3. Leadership & Delegation (delegation, assignment, scope, UAP, supervision, etc.)
4. Safety & Prioritization (falls, triage, ABCs, rapid response, restraints, etc.)
5. Body-system and other clinical buckets (cardiovascular, respiratory, …)
6. Exam Strategy (integrated review / certification prep phrasing)

## Legacy `topic` strings

`LEGACY_TOPIC_TO_CATEGORY` maps historical catalog labels to the controlled set. If `topic` is already a valid controlled string but clearly contradicted by the **title** (e.g. topic `Safety & Prioritization` with an antibiotic-stewardship title), `normalizeLessonCategory(topic, title)` may override to **Pharmacology**, **Infection Control**, or **Leadership & Delegation**.

## RN / PN / RPN hub buckets

`RN_PN_RPN_HUB_CATEGORY_DEFS` includes **`infection_control`** (display **Infection Control**). Taxonomy leaf `immune_infectious` maps to **`infection_control`**, not Safety & Prioritization.

## Title cleanup

`normalizeVisibleLessonTitle` strips trailing `| NurseNest`, `| US`, `| Canada`, converts a single substantive `|` to `: `, and normalizes long dashes before `premiumizeLessonDisplayTitle` runs.

## When to update this doc

- Add/remove a `LESSON_CATEGORIES` entry or rename a hub id.
- Add legacy catalog `topic` strings from imports.
- Change keyword priority or meningitis / sepsis edge-case rules.
