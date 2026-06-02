# United States NCLEX Internal Linking Architecture

Generated: 2026-06-01

Goal: make the US NCLEX-RN acquisition system navigable from broad informational search to high-intent conversion and then into post-signup study actions.

## Canonical Hub

Primary hub: `/us/rn/nclex-rn`

Hub role:
- Owns United States NCLEX-RN pathway context.
- Links downward to lessons, questions, CAT, flashcards, pricing, and blog.
- Receives upward links from all NCLEX-RN commercial pages and blog content.
- Should not be replaced by broad `/nclex-rn` routes unless canonical strategy is explicitly changed.

## Link Hierarchy

| Layer | Routes | Link obligation |
|---|---|---|
| Pillar hub | `/us/rn/nclex-rn` | Links to every major study surface and every high-intent commercial spoke. |
| Commercial spokes | `/nclex-question-bank`, `/cat-nclex-simulator`, `/nclex-study-plan`, proposed NCLEX-RN slugs | Link up to hub, sideways to related spokes, down to app/route action. |
| Learning surfaces | `/us/rn/nclex-rn/lessons`, `/questions`, `/cat`, `/flashcards` | Link up to hub, sideways to complementary surfaces, down to topic/session actions. |
| Topic lessons | `/us/rn/nclex-rn/lessons/[slug]` | Link up to lesson hub, sideways to related questions/flashcards/blog, down to specific practice. |
| Blog | `/blog/us-rn/[slug]` and global NCLEX posts | Link up to hub, sideways to commercial spoke, down to related lesson/question route. |
| App activation | `/app/practice-tests`, `/app/flashcards`, `/app/study-plan`, `/app/account/readiness` | Link back to account/study loop, not marketing pages. |

## Three-Direction Rule

Every indexable NCLEX asset must link:

1. Upward: to `/us/rn/nclex-rn` or the closest parent hub.
2. Sideways: to a sibling commercial/study surface with matching intent.
3. Downward: to the next action, such as questions, CAT, lesson, flashcards, signup, or pricing.

## Commercial Spoke Link Plan

| Page | Upward link | Sideways links | Downward conversion/action |
|---|---|---|---|
| `/nclex-rn-practice-questions/` | `/us/rn/nclex-rn` | CAT, SATA, NGN, rationales/blog | `/us/rn/nclex-rn/questions`, `/signup`, `/pricing` |
| `/nclex-rn-cat-exam/` | `/us/rn/nclex-rn` | Readiness assessment, question bank, study plan | `/us/rn/nclex-rn/cat`, `/app/practice-tests?pathwayId=us-rn-nclex-rn` |
| `/nclex-rn-flashcards/` | `/us/rn/nclex-rn` | Question bank, pharmacology, weak areas | `/app/flashcards?pathwayId=us-rn-nclex-rn` |
| `/nclex-rn-study-plan/` | `/us/rn/nclex-rn` | Readiness, CAT, question bank | `/app/study-plan`, `/signup` |
| `/nclex-rn-readiness-assessment/` | `/us/rn/nclex-rn` | CAT, practice tests, analytics | `/app/account/readiness`, `/us/rn/nclex-rn/cat` |
| `/nclex-rn-pharmacology/` | `/us/rn/nclex-rn` | Flashcards, question bank, lab/ECG pages | Pharmacology lessons/questions |
| `/nclex-rn-priority-delegation/` | `/us/rn/nclex-rn` | NGN, case studies, study plan | Leadership/delegation lessons/questions |
| `/nclex-rn-sata/` | `/us/rn/nclex-rn` | NGN question types, question bank | SATA-filtered practice if available; otherwise question hub |
| `/nclex-rn-next-gen-nclex/` | `/us/rn/nclex-rn` | SATA, case studies, CAT | NGN practice route and lesson cluster |
| `/nclex-rn-case-studies/` | `/us/rn/nclex-rn` | NGN, readiness, question bank | Case-study filtered practice when available |

## Blog Linking Rules

For each US RN blog article:

- First screen: one contextual link to the most relevant lesson or commercial spoke.
- Mid-article: one link to question practice or CAT if the topic is exam-actionable.
- Final CTA: one conversion link, usually `/signup`, `/pricing`, or the pathway hub.
- Schema FAQ answers must not promise pass outcomes, unlimited access, or unsupported features.

## Priority Retagging Plan

The blog surfacing audit found global blog scale but weak scoped US RN attribution. Retag in this order:

1. NCLEX NGN articles.
2. Sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, GI bleed.
3. Pharmacology and medication safety.
4. Delegation, prioritization, safety, infection control.
5. Study plan and repeat-test-taker articles.

## Measurement Events

Track internal link effectiveness by source:

- Blog to hub click.
- Blog to question bank click.
- Commercial spoke to signup click.
- Commercial spoke to pricing click.
- Commercial spoke to app action click for signed-in users.
- Lesson to question practice click.
- Rationale to related lesson/flashcard click.

## Governance

Do not add new footer/global nav links until:

1. The page is implemented.
2. Metadata, canonical, schema, and CTA are verified.
3. The linked post-signup feature exists for US RN.
4. The page has no unsupported count or pass-prediction claim.
