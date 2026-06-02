# Topic Ownership & Authority Domination Engine

Generated: 2026-05-31T05:49:38.207Z

## Implementation Summary

The topic ownership foundation is implemented in `src/lib/authority/topic-ownership-engine.ts`.

It supports:

- 0-100 topic ownership scoring.
- Required asset coverage for authority articles, lessons, flashcards, questions, SATA, matrix, bowtie, cases, simulations, skills, labs, pharmacology, care plans, concept maps, clinical reasoning, study guides, career relevance, placement relevance, and certification relevance.
- Profession-specific ownership for RN, RPN, NP, RT, paramedic, OT, PT, MLT, and PSW.
- Certification ownership for NCLEX, REx-PN, CNPLE, FNP, PMHNP, AGPCNP, WHNP, PNP-PC, TEAS, HESI, and CASPER.
- Competitor comparison against UWorld, Archer, Lecturio, Amboss, and Osmosis.
- Gap analysis and revenue-prioritized build recommendations.

## Ownership Dashboard

- Topics tracked: 13
- Average ownership: 36%
- Fully owned topics: 0
- Strongest topics: Heart Failure, Diabetes, COPD, Stroke, DKA
- Weakest topics: Ventilator Management, Trauma Assessment, AKI, ABG Interpretation, AFib

## Topic Ownership Snapshot

| Topic |Ownership |Status |Strongest Profession |Weakest Profession |
| Heart Failure |49% |emerging |RN |PT |
| Diabetes |49% |emerging |RN |RT |
| COPD |47% |emerging |RN |PSW |
| Stroke |43% |emerging |RN |RT |
| DKA |42% |emerging |RN |OT |
| Pneumonia |36% |emerging |RN |OT |
| Sepsis |35% |emerging |RN |OT |
| AFib |32% |emerging |RN |OT |
| CKD |32% |emerging |NP |Paramedic |
| ABG Interpretation |31% |emerging |RT |PSW |
| AKI |30% |emerging |RN |OT |
| Ventilator Management |21% |not_owned |RT |PSW |
| Trauma Assessment |21% |not_owned |Paramedic |MLT |

## If We Only Build 10 Things This Quarter

| Rank |Topic |Priority |Ownership Gap |Top Work |
| 1 |Sepsis |83 (highest) |65% |Missing SEO Authority Page; Missing Lessons; Missing Flashcards |
| 2 |AFib |78 (high) |68% |Missing SEO Authority Page; Missing Lessons; Missing Flashcards |
| 3 |Trauma Assessment |78 (high) |79% |Missing SEO Authority Page; Missing Lessons; Missing Flashcards |
| 4 |Diabetes |77 (high) |51% |Missing Internal Links; Missing Allied Health Connections |
| 5 |ABG Interpretation |77 (high) |69% |Missing SEO Authority Page; Missing Lessons; Missing Flashcards |
| 6 |Ventilator Management |77 (high) |79% |Missing SEO Authority Page; Missing Lessons; Missing Flashcards |
| 7 |Heart Failure |76 (high) |51% |Missing Internal Links; Missing Allied Health Connections |
| 8 |Stroke |76 (high) |57% |Missing Flashcards; Missing SATA Questions; Missing Matrix Questions |
| 9 |DKA |75 (high) |58% |Missing Internal Links; Missing Allied Health Connections |
| 10 |COPD |74 (high) |53% |Missing Concept Maps; Missing Study Guides; Missing Career Relevance |

## If We Only Build 50 Things This Year

Current tracked backlog contains 13 prioritized topic initiatives. As more topics are added, this same ranking model should select the top 50 by traffic potential, revenue potential, conversion potential, and ownership gap.

## Profession Ownership Highlights

- RN strongest: Diabetes 87%, Heart Failure 85%, DKA 79%
- RT strongest: COPD 64%, ABG Interpretation 61%, Ventilator Management 57%
- Paramedic strongest: Trauma Assessment 55%, Stroke 45%, DKA 43%
- MLT strongest: ABG Interpretation 53%, AKI 51%, DKA 49%

## Certification Ownership Highlights

- NCLEX strongest: Diabetes 87%, Heart Failure 85%, DKA 79%
- REx-PN strongest: Diabetes 73%, Heart Failure 71%, COPD 61%
- CNPLE strongest: Diabetes 82%, Heart Failure 77%, DKA 73%
- TEAS strongest: Diabetes 67%, Heart Failure 65%, DKA 59%

## Competitor Ownership Signals

| Topic |NurseNest |Leader |Leader Score |Position |Opportunity |
| Heart Failure |49% |UWorld |78% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| COPD |47% |UWorld |75% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| Diabetes |49% |UWorld |82% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| DKA |42% |UWorld |80% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| Sepsis |35% |UWorld |84% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| Stroke |43% |UWorld |80% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| AFib |32% |UWorld |78% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| AKI |30% |Amboss |74% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| CKD |32% |Amboss |70% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| Pneumonia |36% |UWorld |74% |competitor_leads |Close the ownership gap with simulations, NGN formats, allied links, and authority content. |
| Ventilator Management |21% |Amboss |64% |nobody_owns |White-space topic: build a complete cluster before competitors consolidate authority. |
| ABG Interpretation |31% |Amboss |68% |nobody_owns |White-space topic: build a complete cluster before competitors consolidate authority. |
| Trauma Assessment |21% |Amboss |56% |nobody_owns |White-space topic: build a complete cluster before competitors consolidate authority. |

## Next Integration Points

1. Replace baseline scores with live counts from authority pages, lessons, flashcards, questions, simulations, labs, skills, and care plans.
2. Add an admin Topic Ownership dashboard using this scoring layer.
3. Feed priority recommendations into the content factory and SEO command center.
4. Add Search Console traffic and revenue attribution to refine build priority.
5. Expand tracked topics beyond the initial clinical and allied-health set.
