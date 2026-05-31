# Global Weak Content Report

## Purpose

This report defines how NurseNest identifies content that exists but is not yet educationally valuable enough to publish.

## Weak Content Signals

| Signal | Applies To | Action |
| --- | --- | --- |
| Placeholder language | All assets | Quarantine |
| Thin content | Lessons, blogs, care pages | Expand or noindex |
| Generic rationale | Questions, exams, flashcards | Rewrite |
| Obvious distractors | Questions, NGN cases | Rewrite item |
| Definition-only flashcard | Flashcards | Expand or merge |
| Missing clinical reasoning | Lessons, questions, rationales | Rewrite |
| Missing safety concept | Clinical/exam assets | Clinical review |
| Missing blueprint metadata | Questions, exams, lessons | Metadata repair |
| Missing adaptive routing | Premium learning assets | Remediation mapping |
| Missing review history | All publishable assets | Hold publication |

## Severity Bands

| Severity | Meaning | Required Action |
| --- | --- | --- |
| Critical | Unsafe, inaccurate, placeholder, or misleading | Remove from publication path |
| High | Educationally weak or exam-unrealistic | Rewrite before publication |
| Medium | Incomplete but salvageable | Revise and review |
| Low | Minor quality improvement | Queue for refresh |

## Weekly Queue

The weak content queue should be sorted by:

1. Published content below `90`
2. Subscriber-facing content below `90`
3. High-traffic public content below `90`
4. High-value exam pathways below `90`
5. Localized content missing review gates

## Publication Rule

Weak content may not be used to satisfy inventory targets. Counts only matter after the item passes quality gates.
