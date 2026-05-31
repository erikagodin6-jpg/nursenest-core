# NurseNest Global Content Quality Governance System

## Executive Standard

NurseNest content is not complete because it exists. It is complete only when it is clinically accurate, educationally valuable, exam-relevant, original, reviewable, and useful to a learner preparing for real nursing practice.

The global publication threshold is `90/100`. Any asset below `90` remains unpublished, regardless of inventory targets, SEO demand, pathway pressure, or launch deadlines.

## Evidence From Current Platform

The platform already contains meaningful quality infrastructure:

- Question scoring: `src/lib/questions/content-quality-score.ts`
- Premium rationale scoring: `src/lib/questions/rationale-quality-score.ts`
- Distractor scoring: `src/lib/questions/distractor-quality-score.ts`
- Lesson educational quality gates: `src/lib/lessons/lesson-educational-quality-standards.ts`
- Blog content quality gates: `src/lib/blog/blog-content-quality-gate.ts`
- Blueprint compliance: `src/lib/blueprints/blueprint-compliance-engine.ts`
- Content intelligence: `src/lib/content-quality/content-quality-intelligence-engine.ts`
- Translation quality: `src/lib/i18n/educational-translation-quality.ts`
- Existing governance baseline: `docs/governance/clinical-content-quality-governance.md`

This program consolidates those systems under one global publication standard.

## Source Of Truth

The code-level global gate is:

`src/lib/content-quality/global-content-quality-governance.ts`

It defines:

- Global publication minimum: `90/100`
- Duplicate manual review threshold: `90%+ similarity`
- Required lifecycle states
- Required review gates
- Required scoring dimensions
- Required reports
- Hard rejection criteria for lessons, questions, rationales, hints, clinical pearls, flashcards, NGN cases, blogs, simulations, practice exams, and CAT pools

Contract test:

`src/lib/content-quality/global-content-quality-governance.contract.test.ts`

## Global Lifecycle

Every content item must move through:

1. Draft
2. Internal Review
3. Clinical Review
4. Educational Review
5. SEO Review
6. Ready For Publication
7. Published
8. Archived

Localized or translated content also requires localization review before publication.

Direct `Draft -> Published` release paths are prohibited.

## Required Scoring Dimensions

Every asset receives:

- Clinical Accuracy Score
- Educational Value Score
- Exam Relevance Score
- Originality Score
- Flashcard Reusability Score
- Practice Exam Readiness Score
- CAT Readiness Score
- Adaptive Learning Score
- Publication Score

The final publication score must be at least `90`.

## Hard Rejection Rules

### Lessons

Reject lessons that are under required depth, lack clinical reasoning, omit pathophysiology, miss assessment/intervention content, lack patient safety, ignore prioritization, or repeat existing lessons without new teaching value.

### Questions

Reject questions with obvious answers, implausible distractors, trivia-only stems, missing realistic clinical scenarios, missing blueprint metadata, or missing decision-making demands.

### Rationales

Reject rationales that restate the answer, lack clinical explanation, omit wrong-option teaching, fail to explain patient safety implications, or do not teach transferable reasoning.

### Hints

Reject hints that reveal the answer or point directly to the correct option. Hints should guide reasoning, not solve the item.

### Clinical Pearls

Reject pearls that are generic, obvious, repetitive, or just restate lesson content. A publishable pearl should teach a memorable bedside, safety, escalation, or exam insight.

### Flashcards

Reject definition-only cards, one-line fact cards, duplicate cards, and cards without clinical application, memory anchor, common mistake, or exam relevance.

### NGN Cases

Reject NGN cases without cue recognition, cue analysis, prioritization, action, evaluation, realistic chart data, patient safety consequences, and remediation mapping.

### Blogs

Reject thin SEO pages, duplicate posts, placeholder language, generated filler, missing references, missing internal links, and pages without learner value.

### Simulations

Reject linear quizzes disguised as simulations. A simulation requires patient profile, findings, deterioration logic, decisions, consequences, documentation/communication tasks, and debriefing.

### Practice Exams And CAT Pools

Reject pools that are not blueprint weighted, lack mixed difficulty, omit tutor/exam mode support, miss rationales/hints/pearls, or lack analytics/adaptive metadata.

## Duplicate Detection

Manual review is required when similarity is `90%+` across:

- Lessons
- Questions
- Flashcards
- Blogs
- Rationales
- Clinical pearls

The global gate intentionally treats `90%+` similarity as review-triggering, not automatically publishable.

## Weekly Audit Cadence

Run weekly audits across:

- Lessons
- Questions
- Flashcards
- NGN Cases
- Blogs
- Simulations
- Practice Exams
- CAT Pools

Required outputs:

- Quality audit scorecards
- Weak content reports
- Duplicate content reports
- Blueprint coverage reports
- Publication readiness reports
- Monetization readiness reports

## Global Consistency Rule

NurseNest should maintain consistent educational standards across:

- RN
- PN
- NP
- UK
- Australia
- New Zealand
- UAE
- Saudi Arabia
- India
- Philippines
- French
- Spanish
- Future languages

Consistency does not mean flattening local differences. Scope of practice, terminology, regulatory expectations, documentation standards, medication naming, and exam blueprints must remain localized.

## Publication Decision

An item may be published only when all are true:

- Overall score is `90+`
- Clinical review passed
- Educational review passed
- SEO review passed when public/indexable
- Localization review passed when translated/localized
- Accessibility review passed
- No placeholder language
- No unresolved duplicate flag
- Required rationale/hint/pearl components are present when applicable
- Blueprint metadata is valid
- Adaptive routing metadata is present when applicable
- Monetization boundaries are respected

## Non-Negotiable Principle

The platform should prefer fewer excellent assets over many weak assets. Inventory targets are planning goals, not permission to publish low-value content.
