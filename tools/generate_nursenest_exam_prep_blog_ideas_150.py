#!/usr/bin/env python3
"""Generate 150 long-tail NurseNest exam-prep blog ideas JSON (25 x 6 categories)."""
from __future__ import annotations

import json
import re
from pathlib import Path

PATH_LESSONS = "`/lessons/` (pathway lesson hubs and topic clusters)"
PATH_PRACTICE = "`/app/practice` (question bank and practice sessions)"
PATH_CAT = "`/app/cat` (computer-adaptive testing)"
PATH_PRICING = "`/pricing` (plans and trial access)"


def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:96]


def outline_with_links(theme: str) -> str:
    """H2/H3 outline that naturally weaves required internal paths."""
    return "\n".join(
        [
            f"## {theme}: what high-intent learners are really trying to solve",
            "### Clarify the goal (exam, timeline, weak domains) without overwhelm",
            "### Map the constraint: part-time work, language load, or retake pressure",
            "## Build a study system that compounds (not cram-and-forget)",
            "### Weekly rhythm: lessons → flashcards → practice questions",
            "### Why spaced retrieval beats passive re-reading for long-term recall",
            "## Use NurseNest surfaces in the right order",
            f"### Start with targeted {PATH_LESSONS} for concept repair, then drill",
            f"### Move into {PATH_PRACTICE} for volume, rationales, and weak-topic tagging",
            f"### Add {PATH_CAT} late-stage to calibrate stamina and decision quality under pressure",
            "## De-risk the paywall decision with a calm evaluation path",
            f"### Compare what you get at {PATH_PRICING} to your current stack (time + outcomes)",
            "### Trial workflow: one CAT, one weak-topic lesson block, one practice set",
            "## Trust and E-E-A-T signals readers should look for",
            "### Transparent scope (exam pathway alignment, updates, limitations)",
            "### How to document your own readiness signals (scores, trends, error patterns)",
        ]
    )


def targets(exam_hint: str) -> list[str]:
    return [
        f"{exam_hint}: pathway lessons under `/lessons/` (e.g. `/us/rn/nclex-rn/lessons`, `/canada/rpn/rex-pn/lessons`, or your exam hub)",
        "/app/practice — question bank and practice sessions",
        "/app/cat — computer-adaptive testing (CAT)",
        "/pricing — plans and trial access",
        "Flashcards — topic decks linked from lesson wayfinding where available",
    ]


def entry(title: str, slug: str | None, search_intent: str, theme: str, exam_hint: str) -> dict:
    return {
        "title": title,
        "slug": slug or slugify(title),
        "search_intent": search_intent,
        "outline": outline_with_links(theme),
        "internal_link_targets": targets(exam_hint),
    }


def study_strategies() -> list[dict]:
    rows: list[tuple[str, str, str, str, str]] = [
        (
            "How to Pass the NCLEX-RN First Try Using a Blocked Study System (Without Daily Chaos)",
            "nclex-rn-first-try-blocked-study-system-nursenest",
            "Best way to pass NCLEX-RN first time with a repeatable weekly schedule and burnout guardrails.",
            "NCLEX-RN blocked scheduling",
            "NCLEX-RN",
        ),
        (
            "Best Way to Study for the REx-PN on Evenings-Only: 90-Minute Micro-Blocks That Actually Compound",
            "rex-pn-evening-only-90-minute-study-blocks",
            "REx-PN study plan for working learners who need efficient night blocks and clear priorities.",
            "Evening-only REx-PN micro-blocks",
            "REx-PN",
        ),
        (
            "How to Pass the CNPE Primary Care Stream Using Case-Based Lessons Plus Weekly Question Caps",
            "cnpe-primary-care-case-lessons-weekly-question-cap",
            "CNPE prep strategy combining deep cases with sustainable question volume.",
            "CNPE case-first sequencing",
            "CNPE (Primary Care)",
        ),
        (
            "NCLEX-PN vs NCLEX-RN Study Load: How to Right-Size Your Daily Question Target on NurseNest",
            "nclex-pn-vs-rn-daily-question-target-right-sizing",
            "Learners comparing NCLEX-PN and RN workloads want a concrete daily practice target.",
            "Right-sizing daily practice load",
            "NCLEX-PN / NCLEX-RN",
        ),
        (
            "How to Study for Allied Health Certification Exams When You Forgot ‘Textbook Math’ Years Ago",
            "allied-health-cert-forgot-math-structured-remediation",
            "Allied health test takers need confidence rebuilding for dosage, conversions, and safety checks.",
            "Allied health remediation sequencing",
            "Allied health certification",
        ),
        (
            "Best Study Strategy for NCLEX-RN SATA Questions: Teach-Back Lessons Then Pattern Drills",
            "nclex-rn-sata-teach-back-lessons-pattern-drills",
            "Searchers want a SATA-specific method beyond ‘select all that apply panic’.",
            "SATA teach-back then drill",
            "NCLEX-RN",
        ),
        (
            "How to Pass the REx-PN Pharmacology Section Using Flashcard Spacing + Rationale Review",
            "rex-pn-pharmacology-flashcards-rationale-review-system",
            "REx-PN learners hunting a drug-heavy pass path with fewer false confidents.",
            "Pharmacology spacing + rationales",
            "REx-PN",
        ),
        (
            "CNPE Exam Prep Without Cramming: A 12-Week ‘Evidence → Decision’ Loop for Working NPs",
            "cnpe-12-week-evidence-to-decision-loop-working-np",
            "CNPE candidates want a defensible schedule that respects clinical jobs.",
            "12-week evidence-to-decision loop",
            "CNPE",
        ),
        (
            "How to Pass Nursing Exams While Managing ADHD: External Structure, Timers, and Low-Friction Starts",
            "nursing-exams-adhd-external-structure-timers-nursenest",
            "Neurodivergent learners search for systems that reduce activation energy.",
            "ADHD-friendly structure",
            "NCLEX-RN / REx-PN",
        ),
        (
            "Best Way to Study for NCLEX-RN Priority and Delegation: Lesson Ladders Before Question Floods",
            "nclex-rn-priority-delegation-lesson-ladders-before-questions",
            "High-intent searches for delegation mastery tied to clinical judgment items.",
            "Delegation lesson ladders",
            "NCLEX-RN",
        ),
        (
            "How to Pass the REx-PN First Try If English Is Your Second Language: Vocabulary Banks + Slow CAT",
            "rex-pn-first-try-esl-vocabulary-banks-slow-cat",
            "ESL learners want language-load tactics without shame or generic advice.",
            "ESL vocabulary + CAT pacing",
            "REx-PN",
        ),
        (
            "How to Study for Multiple Allied Certs in One Year Without Mixing Safety Rules (Crosswalk Method)",
            "multiple-allied-certs-one-year-crosswalk-safety-rules",
            "People stacking certs need contamination-proof study design.",
            "Crosswalk method for stacked certs",
            "Allied health",
        ),
        (
            "Best NCLEX-RN Study Strategy for ‘Bad Test Anxiety’: Low-Stakes Practice Ramps Into Timed Blocks",
            "nclex-rn-test-anxiety-low-stakes-ramps-timed-blocks",
            "Anxiety-specific NCLEX prep queries want graduated exposure, not brute force.",
            "Anxiety-graded practice ramps",
            "NCLEX-RN",
        ),
        (
            "How to Pass the CNPE Acute Care Stream: High-Acuity Topics First, Then Primary Care Bridges",
            "cnpe-acute-care-first-then-primary-care-bridges",
            "Stream-specific sequencing for acute care NP exam prep.",
            "Acute stream sequencing",
            "CNPE (Acute Care)",
        ),
        (
            "Best Way to Study for NCLEX-RN Labs and Electrolytes: Concept Mini-Lessons Then Error-Tagged Sets",
            "nclex-rn-labs-electrolytes-mini-lessons-error-tagged-sets",
            "Labs are a bottom-funnel pain point; searchers want targeted repair.",
            "Labs/electrolytes repair loop",
            "NCLEX-RN",
        ),
        (
            "How to Pass the REx-PN Using a ‘Monday Diagnosis / Wednesday Skills / Friday Safety’ Rotation",
            "rex-pn-mon-wed-fri-topic-rotation-study-system",
            "Canadian PN learners want memorable weekly cadences.",
            "Weekly topic rotation",
            "REx-PN",
        ),
        (
            "How to Study for the NCLEX-RN While in Nursing School Finals: Minimum Viable NCLEX Blocks",
            "nclex-rn-during-nursing-school-finals-minimum-viable-blocks",
            "Concurrent students need overlap-friendly scheduling.",
            "Minimum viable NCLEX blocks",
            "NCLEX-RN",
        ),
        (
            "Best Study Strategy for Allied Health Infection Control Exams: Checklist Lessons + Scenario Drills",
            "allied-health-infection-control-checklist-lessons-scenario-drills",
            "Infection control cert prep needs procedural memory + scenario judgment.",
            "Infection control checklist drills",
            "Allied health",
        ),
        (
            "How to Pass the CNPE With a 60-Hour Clinical Week: Weekend Deep Work + Weekday Micro-Review",
            "cnpe-60-hour-clinical-week-weekend-deep-weekday-micro",
            "Working NP students need credible time partitioning.",
            "Clinical-heavy scheduling",
            "CNPE",
        ),
        (
            "NCLEX-RN Study Plan for Visual Learners: Pathway Diagrams in Lessons + Image-Rich Question Review",
            "nclex-rn-visual-learners-diagrams-lessons-image-rich-review",
            "Style-specific NCLEX strategies reduce dropout mid-prep.",
            "Visual learner sequencing",
            "NCLEX-RN",
        ),
        (
            "How to Pass the REx-PN Gerontology Items: Age-Related Physiology Lessons Before Community Scenarios",
            "rex-pn-gerontology-physiology-before-community-scenarios",
            "Long-tail gerontology NCLEX/PN prep for Canadian context.",
            "Gerontology sequencing",
            "REx-PN",
        ),
        (
            "Best Way to Study for NCLEX-RN Maternal–Newborn: Timed Topic Sprints After Foundational Lessons",
            "nclex-rn-maternal-newborn-timed-sprints-after-lessons",
            "OB is high anxiety; searchers want sprint structure post-concepts.",
            "OB timed sprints",
            "NCLEX-RN",
        ),
        (
            "How to Study for the NCLEX-RN as a Repeat Planner: Pretest Mapping Then Lesson-First Repair Weeks",
            "nclex-rn-repeat-planner-pretest-mapping-lesson-first-repair",
            "Repeaters often search for ‘start over’ systems that aren’t generic.",
            "Repeat planner repair weeks",
            "NCLEX-RN",
        ),
        (
            "How to Pass Allied Health Patient Safety Certs: Root-Cause Thinking Lessons + Practice Case Banks",
            "allied-health-patient-safety-root-cause-lessons-practice-cases",
            "Safety certification prep needs judgment, not flashcards alone.",
            "Patient safety judgment loop",
            "Allied health",
        ),
        (
            "Best Study Strategy for CNPE Ethics and Jurisprudence: Short Rules Lessons + Applied Scenarios",
            "cnpe-ethics-jurisprudence-short-rules-applied-scenarios",
            "NP candidates want jurisprudence prep that feels exam-shaped.",
            "Ethics/jurisprudence applied loop",
            "CNPE",
        ),
    ]
    assert len(rows) == 25
    return [entry(t, s, i, th, e) for t, s, i, th, e in rows]


def pass_rates_outcomes() -> list[dict]:
    rows: list[tuple[str, str, str, str, str]] = [
        (
            "How to Know You’re Ready to Write the NCLEX-RN (Signals That Beat ‘I Feel Ready’)",
            "how-to-know-ready-nclex-rn-readiness-signals",
            "Bottom-funnel query: readiness checklist before scheduling NCLEX-RN.",
            "NCLEX-RN readiness signals",
            "NCLEX-RN",
        ),
        (
            "Why Students Fail the REx-PN (Common Prep Mistakes) and How to Avoid Them With Measurable Practice",
            "why-students-fail-rex-pn-common-mistakes-measurable-practice",
            "Fear-based search after peer stories; wants credible failure modes + fixes.",
            "REx-PN failure modes",
            "REx-PN",
        ),
        (
            "How to Know You’re Ready for the CNPE: When Your Practice Decisions Stabilize (Not When Your Notes Look Pretty)",
            "how-to-know-ready-cnpe-decision-stability",
            "CNPE readiness is judgment-heavy; searchers want decision-based criteria.",
            "CNPE decision stability",
            "CNPE",
        ),
        (
            "NCLEX-RN Pass Confidence vs Actual Readiness: How to Separate Anxiety from Skill Gaps Using Trends",
            "nclex-rn-confidence-vs-readiness-anxiety-vs-skill-gaps",
            "Mid-funnel emotional regulation + objective metrics.",
            "Confidence vs readiness",
            "NCLEX-RN",
        ),
        (
            "Why Allied Health Exam Candidates Plateau (And the Three Metrics That Break the Plateau)",
            "allied-health-exam-plateau-three-metrics-breakthrough",
            "Plateau searches want diagnostics beyond ‘study harder’.",
            "Allied prep plateau metrics",
            "Allied health",
        ),
        (
            "How to Know You’re Ready for NCLEX-RN CAT: When Adaptive Practice Feels Hard But Fair (Not Random)",
            "ready-for-nclex-cat-when-adaptive-feels-hard-but-fair",
            "CAT-specific readiness anxiety is a real long-tail cluster.",
            "CAT fairness readiness",
            "NCLEX-RN",
        ),
        (
            "Why Students Fail NCLEX-RN SATA: Misreading ‘Partially True’ Options and How Rationales Retrain Judgment",
            "why-students-fail-nclex-rn-sata-partially-true-rationales",
            "SATA failure analysis is high intent.",
            "SATA failure analysis",
            "NCLEX-RN",
        ),
        (
            "How to Know You’re Ready for the REx-PN Clinical Judgment Emphasis: Scenario Speed + Safety Red Flags",
            "rex-pn-ready-clinical-judgment-scenario-speed-red-flags",
            "Canadian PN exams emphasize judgment; learners want readiness framing.",
            "REx-PN judgment readiness",
            "REx-PN",
        ),
        (
            "CNPE Pass Prep Reality: Why ‘High Question Volume Alone’ Underprepares You for Decision Density",
            "cnpe-why-question-volume-alone-underprepares-decision-density",
            "NP candidates comparing banks vs deep learning.",
            "CNPE decision density",
            "CNPE",
        ),
        (
            "How to Know You’re Ready for Allied Health Dosage Exams: Error-Free Streaks Under Time Pressure",
            "allied-health-dosage-exam-ready-error-free-streaks-time-pressure",
            "Dosage exam readiness is measurable; searchers want thresholds.",
            "Dosage readiness streaks",
            "Allied health",
        ),
        (
            "Why Students Fail NCLEX-RN Time Management: Over-Reading Stems and How Timed Practice Retrains Pace",
            "nclex-rn-time-management-fail-over-reading-stems-timed-practice",
            "Time management is a distinct SEO cluster for NCLEX.",
            "NCLEX time management",
            "NCLEX-RN",
        ),
        (
            "How to Know You’re Ready for the REx-PN After a Mock Week: What Score Trends Actually Mean",
            "rex-pn-mock-week-score-trends-what-they-mean",
            "Mock week interpretation for Canadian PN learners.",
            "REx-PN mock interpretation",
            "REx-PN",
        ),
        (
            "Why Students Fail the CNPE If They Skip Weak-Area Remediation (And How to Track Weak Areas Honestly)",
            "cnpe-fail-skip-weak-area-remediation-track-honestly",
            "Accountability framing for NP prep.",
            "CNPE weak-area honesty",
            "CNPE",
        ),
        (
            "How to Know You’re Ready for NCLEX-RN Priority Questions: When You Can Explain ‘Why Not B’ Out Loud",
            "nclex-rn-priority-ready-explain-why-not-b-out-loud",
            "Teach-back readiness for priority/delegation.",
            "Priority teach-back readiness",
            "NCLEX-RN",
        ),
        (
            "Why Students Fail Allied Health Exams on ‘Best Communication’ Items: Rote vs Therapeutic Reasoning",
            "allied-health-fail-communication-items-rote-vs-therapeutic",
            "Communication items are common trap searches.",
            "Therapeutic reasoning readiness",
            "Allied health",
        ),
        (
            "How to Know You’re Ready for the NCLEX-RN If You’re Scoring ‘Borderline’: Trend Direction Matters More",
            "nclex-rn-borderline-scores-trend-direction-readiness",
            "Borderline anxiety is huge; wants trend-based guidance.",
            "Borderline score trends",
            "NCLEX-RN",
        ),
        (
            "Why Students Fail the REx-PN Pharmacology: Confusing Look-Alike Drugs and How Flashcard Pairs Fix It",
            "rex-pn-pharm-fail-look-alike-drugs-flashcard-pairs",
            "Pharm failure mode + tool pairing.",
            "REx-PN pharm pairs",
            "REx-PN",
        ),
        (
            "How to Know You’re Ready for CNPE Acute Care: When You Can Stabilize a Case Before Reaching for Orders",
            "cnpe-acute-care-ready-stabilize-before-orders",
            "Acute care readiness language without pretending to prescribe.",
            "Acute stabilization thinking",
            "CNPE (Acute Care)",
        ),
        (
            "Why Students Fail NCLEX-RN on First Attempt: Underestimating Analysis Questions vs Memorization",
            "nclex-rn-first-attempt-fail-analysis-vs-memorization",
            "Classic long-tail ‘why fail’ query with analysis emphasis.",
            "Analysis vs memorization",
            "NCLEX-RN",
        ),
        (
            "How to Know You’re Ready for the REx-PN Mental Health Items: Safety Hierarchy Under Ambiguity",
            "rex-pn-mental-health-ready-safety-hierarchy-ambiguity",
            "MH judgment readiness for PN exams.",
            "MH safety hierarchy readiness",
            "REx-PN",
        ),
        (
            "Why Students Fail Allied Health Pathophys Exams: Skipping Mechanism Links to Interventions",
            "allied-health-pathophys-fail-mechanism-to-intervention-gap",
            "Pathophys exams need mechanism bridges.",
            "Mechanism-to-intervention",
            "Allied health",
        ),
        (
            "How to Know You’re Ready for NCLEX-RN Infection Control: When Isolation Decisions Feel Boring (That’s Good)",
            "nclex-rn-infection-control-ready-when-decisions-feel-boring",
            "Infection control readiness via automaticity.",
            "Infection control automaticity",
            "NCLEX-RN",
        ),
        (
            "Why Students Fail the CNPE If They Avoid Ethics Scenarios Until the Last Month",
            "cnpe-fail-avoid-ethics-until-last-month",
            "Ethics procrastination pattern.",
            "CNPE ethics timing",
            "CNPE",
        ),
        (
            "How to Know You’re Ready for NCLEX-RN Pediatric Calculations: Double-Check Rituals Under Fatigue",
            "nclex-rn-peds-calculations-ready-double-check-fatigue",
            "Peds calc readiness is a narrow high-intent niche.",
            "Peds calc rituals",
            "NCLEX-RN",
        ),
        (
            "Why Students Fail the REx-PN If They Only Study Content and Never Simulate Exam Fatigue",
            "rex-pn-fail-content-only-no-exam-fatigue-simulation",
            "Stamina/readiness intersection.",
            "Exam fatigue simulation",
            "REx-PN",
        ),
    ]
    assert len(rows) == 25
    return [entry(t, s, i, th, e) for t, s, i, th, e in rows]


def feature_deep_dives() -> list[dict]:
    rows: list[tuple[str, str, str, str, str]] = [
        (
            "How NurseNest Lessons Help You Pass the NCLEX-RN (Without Rewriting Your Whole Study Plan)",
            "how-nursenest-lessons-help-pass-nclex-rn",
            "Feature-intent: lessons for NCLEX-RN pass outcomes.",
            "Lessons for NCLEX-RN",
            "NCLEX-RN",
        ),
        (
            "Why Practice Questions Are Essential for REx-PN Success (And How to Use Them Without False Confidence)",
            "why-practice-questions-essential-rex-pn-success",
            "REx-PN question bank intent + anti-false-confidence framing.",
            "REx-PN practice questions",
            "REx-PN",
        ),
        (
            "How Computer Adaptive Testing Helps You Pass the NCLEX-RN (What CAT Is Actually Measuring)",
            "how-cat-helps-pass-nclex-rn-what-it-measures",
            "Classic CAT education query tied to NCLEX.",
            "CAT measurement basics",
            "NCLEX-RN",
        ),
        (
            "How NurseNest Flashcards Support Long-Term Retention for CNPE Pharmacology and Biologics",
            "nursenest-flashcards-cnpe-pharmacology-biologics-retention",
            "CNPE + flashcards long-tail.",
            "CNPE flashcards retention",
            "CNPE",
        ),
        (
            "Why Pre/Post Assessments Matter for Allied Health Exam Prep (Baseline → Focused Lessons → Re-Measure)",
            "pre-post-assessments-allied-health-exam-prep-baseline-remeasure",
            "Assessment-driven prep for allied certs.",
            "Pre/post assessments allied",
            "Allied health",
        ),
        (
            "How the NurseNest Test Bank Helps You Pass the REx-PN by Surfacing Weak Topics Early",
            "nursenest-test-bank-rex-pn-weak-topics-early",
            "Test bank + weak topic discovery.",
            "REx-PN test bank weak topics",
            "REx-PN",
        ),
        (
            "How Lessons + Flashcards Together Reduce NCLEX-RN ‘I Knew It But Blanked’ Moments",
            "lessons-plus-flashcards-reduce-nclex-blanking",
            "Combined modality deep dive.",
            "Lessons + flashcards synergy",
            "NCLEX-RN",
        ),
        (
            "Why CAT Practice on NurseNest Is a Different Kind of Hard (And Why That’s Useful Before Exam Day)",
            "why-nursenest-cat-hard-useful-before-exam-day",
            "CAT difficulty calibration intent.",
            "CAT difficulty calibration",
            "NCLEX-RN / REx-PN",
        ),
        (
            "How NurseNest Lessons Help CNPE Candidates Translate Guidelines Into Exam-Style Decisions",
            "nursenest-lessons-cnpe-guidelines-to-decisions",
            "CNPE lesson value prop without overstating outcomes.",
            "CNPE guideline translation",
            "CNPE",
        ),
        (
            "Why Practice Questions With Rationales Beat Rewatching Lectures for NCLEX-RN Clinical Judgment",
            "practice-rationales-beat-rewatching-lectures-nclex-cj",
            "Rationale-first learning for CJ items.",
            "Rationales vs passive video",
            "NCLEX-RN",
        ),
        (
            "How Flashcards Help You Pass Allied Health Exams When You Have 10-Minute Gaps Between Shifts",
            "flashcards-allied-health-10-minute-gap-study",
            "Micro-session flashcard use case.",
            "Micro-session flashcards",
            "Allied health",
        ),
        (
            "How NurseNest Practice Sessions in `/app/practice` Support Spaced Repetition for NCLEX-RN",
            "nursenest-app-practice-spaced-repetition-nclex-rn",
            "Direct `/app/practice` intent query.",
            "Practice spaced repetition",
            "NCLEX-RN",
        ),
        (
            "Why Topic-Clustered Lessons Help REx-PN Learners Avoid Random Question Roulette",
            "topic-cluster-lessons-rex-pn-avoid-random-roulette",
            "Structured pathways vs random Qs.",
            "REx-PN topic clusters",
            "REx-PN",
        ),
        (
            "How CAT in `/app/cat` Builds Exam Stamina Without Burning Through Every Question Bank Item",
            "app-cat-builds-stamina-without-burning-full-qbank",
            "CAT stamina + resource conservation.",
            "CAT stamina conservation",
            "NCLEX-RN",
        ),
        (
            "How NurseNest Pricing Pages Help You Choose the Right Tier Before You Overbuy Features You Won’t Use",
            "nursenest-pricing-choose-right-tier-before-overbuy",
            "Pricing research + fit guidance (credible, not pushy).",
            "Pricing fit guidance",
            "All pathways",
        ),
        (
            "Why Lessons Are the Fastest Fix for NCLEX-RN ‘Foundational Gaps’ That Keep Breaking Your Practice Scores",
            "lessons-fastest-fix-nclex-foundational-gaps",
            "Lesson-first remediation narrative.",
            "Foundational gap repair",
            "NCLEX-RN",
        ),
        (
            "How NurseNest Helps You Pass the CNPE by Pairing Deep Lessons With High-Yield Question Sets",
            "nursenest-cnpe-deep-lessons-high-yield-question-sets",
            "CNPE pairing strategy.",
            "CNPE lesson-question pairing",
            "CNPE",
        ),
        (
            "Why Flashcards Aren’t ‘Optional’ for Allied Health Terminology-Heavy Exams (If You Hate Flashcards, Read This)",
            "flashcards-not-optional-allied-health-terminology",
            "Terminology-heavy allied exams.",
            "Terminology flashcards",
            "Allied health",
        ),
        (
            "How Practice Questions Help You Pass the REx-PN by Training Canadian Context and Safety Language",
            "practice-questions-rex-pn-canadian-context-safety-language",
            "Canadian context + practice.",
            "REx-PN Canadian context practice",
            "REx-PN",
        ),
        (
            "How NurseNest Lessons Support E-E-A-T Learning: Clear Scope, Pathway Alignment, and Reviewable Progress",
            "nursenest-lessons-eeat-scope-pathway-progress",
            "Trust-building feature article (no fake stats).",
            "E-E-A-T aligned lessons",
            "All pathways",
        ),
        (
            "Why CAT Helps NCLEX-RN Test-Takers Stop Obsessing Over Question Count as a Vanity Metric",
            "cat-stops-question-count-vanity-metric-nclex-rn",
            "Psychology of prep metrics.",
            "CAT vs vanity counts",
            "NCLEX-RN",
        ),
        (
            "How `/app/practice` Fits Between Lessons and CAT: A Three-Layer NurseNest Study Stack",
            "app-practice-between-lessons-and-cat-three-layer-stack",
            "Explicit funnel: lessons → practice → CAT.",
            "Three-layer stack",
            "NCLEX-RN / REx-PN",
        ),
        (
            "Why NurseNest Flashcards Complement the Test Bank (Memorization vs Decision Practice)",
            "flashcards-complement-test-bank-memorization-vs-decision",
            "Modality complementarity.",
            "Flashcards vs decisions",
            "CNPE / NCLEX-RN",
        ),
        (
            "How Pre/Post Checks Help You Decide Whether `/pricing` Full Access Is Worth It for Your Timeline",
            "pre-post-checks-decide-pricing-full-access-worth-it",
            "Honest conversion assist tied to measurement.",
            "Pricing decision with assessments",
            "All pathways",
        ),
        (
            "How NurseNest Helps Allied Health Learners Pass Certification Exams With the Same ‘Lesson → Drill → CAT’ Spine",
            "nursenest-allied-health-lesson-drill-cat-spine",
            "Allied pathway parity messaging (credible).",
            "Allied prep spine",
            "Allied health",
        ),
    ]
    assert len(rows) == 25
    return [entry(t, s, i, th, e) for t, s, i, th, e in rows]


def comparisons() -> list[dict]:
    rows: list[tuple[str, str, str, str, str]] = [
        (
            "NurseNest vs Traditional Study Methods for NCLEX-RN: Where Time Goes (And What Actually Moves Scores)",
            "nursenest-vs-traditional-study-nclex-rn-time-to-score-movement",
            "Balanced comparison intent; not a dunk on textbooks.",
            "NCLEX traditional vs structured",
            "NCLEX-RN",
        ),
        (
            "Best Platform for REx-PN Exam Prep: Question Banks vs Lesson-First Platforms (Honest Tradeoffs)",
            "best-platform-rex-pn-question-banks-vs-lesson-first-tradeoffs",
            "Mid-funnel ‘best platform’ query for Canadian PN.",
            "REx-PN platform tradeoffs",
            "REx-PN",
        ),
        (
            "NCLEX-RN Prep: Self-Study vs Guided Pathways (How to Choose Without Shame or FOMO)",
            "nclex-rn-self-study-vs-guided-pathways-choose-without-shame",
            "Guidance comparison for anxious learners.",
            "Self-study vs guided",
            "NCLEX-RN",
        ),
        (
            "CNPE Prep: Heavy QBank vs Integrated Lessons + Practice (What Each Misses)",
            "cnpe-qbank-heavy-vs-integrated-lessons-practice-gaps",
            "NP audience comparing modalities.",
            "CNPE integrated vs QBank-only",
            "CNPE",
        ),
        (
            "Allied Health Certification Prep: Apps vs In-Person Review Courses (Cost, Flexibility, Accountability)",
            "allied-health-apps-vs-in-person-review-courses-tradeoffs",
            "Format comparison for allied learners.",
            "Allied app vs course",
            "Allied health",
        ),
        (
            "NurseNest vs ‘Just UWorld’ for NCLEX-RN: Complementary Strengths (Not a Winner-Take-All Claim)",
            "nursenest-vs-just-uworld-nclex-complementary-strengths",
            "Must stay balanced: complementary framing.",
            "NCLEX stack complementarity",
            "NCLEX-RN",
        ),
        (
            "REx-PN Study: Free PDF Notes vs NurseNest Lessons + Practice (Retention Reality Check)",
            "rex-pn-free-pdf-notes-vs-lessons-practice-retention-reality",
            "PDF vs interactive retention (credible).",
            "REx-PN PDF vs interactive",
            "REx-PN",
        ),
        (
            "CNPE Review Books vs NurseNest: When Books Win, When an Online Stack Wins",
            "cnpe-review-books-vs-nursenest-when-each-wins",
            "Balanced books vs digital.",
            "CNPE books vs digital",
            "CNPE",
        ),
        (
            "NCLEX-RN Tutoring vs NurseNest Self-Paced: Who Benefits From Each (Budget + Learning Style)",
            "nclex-rn-tutoring-vs-nursenest-self-paced-who-benefits",
            "Tutor comparison without disparaging tutors.",
            "Tutor vs self-paced",
            "NCLEX-RN",
        ),
        (
            "Best Way to Study for NCLEX-RN: Bootcamps vs Daily Micro-Sessions (Sustainability Lens)",
            "nclex-rn-bootcamp-vs-daily-micro-sessions-sustainability",
            "Bootcamp fatigue is searchable.",
            "Bootcamp vs micro-sessions",
            "NCLEX-RN",
        ),
        (
            "NurseNest vs Anki-Only Decks for Nursing Exams: Structure vs Infinite Customization",
            "nursenest-vs-anki-only-nursing-exams-structure-vs-customization",
            "Anki comparison—respect DIY power users.",
            "Anki vs structured platform",
            "NCLEX-RN / REx-PN",
        ),
        (
            "REx-PN Prep: College Review Sessions vs NurseNest Pathway Practice (Scheduling Realities)",
            "rex-pn-college-review-vs-nursenest-scheduling-realities",
            "Institutional vs online scheduling.",
            "REx-PN college vs online",
            "REx-PN",
        ),
        (
            "CNPE Prep: Conference Workshops vs Consistent Weekly Practice (What Builds Exam Stamina)",
            "cnpe-conference-workshops-vs-weekly-practice-stamina",
            "Workshop spike vs consistency.",
            "CNPE workshop vs consistency",
            "CNPE",
        ),
        (
            "Allied Health Exam Prep: YouTube Deep Dives vs Lesson-Linked Practice (Depth vs Exam Shape)",
            "allied-health-youtube-deep-dives-vs-lesson-linked-practice",
            "YouTube is competitor; balanced critique.",
            "YouTube vs exam-shaped prep",
            "Allied health",
        ),
        (
            "NurseNest vs Generic ‘NCLEX Apps’: Pathway Alignment, Depth, and Reviewability",
            "nursenest-vs-generic-nclex-apps-pathway-depth-reviewability",
            "Generic app comparison—criteria-based.",
            "Generic NCLEX apps criteria",
            "NCLEX-RN",
        ),
        (
            "Best Platform for CNPE: Community Facebook Groups vs Private Study Stack (Privacy + Quality Control)",
            "best-cnpe-platform-facebook-groups-vs-private-study-stack",
            "Community vs private prep tradeoffs.",
            "CNPE groups vs private stack",
            "CNPE",
        ),
        (
            "NCLEX-RN: Live Remediation Classes vs On-Demand Lessons (When Live Helps, When Async Wins)",
            "nclex-rn-live-remediation-vs-on-demand-lessons-tradeoffs",
            "Live vs async pedagogy comparison.",
            "Live vs async NCLEX",
            "NCLEX-RN",
        ),
        (
            "NurseNest vs Cramming High-Yield PDFs for REx-PN: What You Lose When You Skip Practice",
            "nursenest-vs-cram-pdfs-rex-pn-what-you-skip-without-practice",
            "PDF cram warning without fearmongering.",
            "REx-PN PDF cram limits",
            "REx-PN",
        ),
        (
            "Allied Health: Employer-Paid Review vs Self-Paid NurseNest (How to Pitch ROI to Yourself or Your Manager)",
            "allied-health-employer-paid-review-vs-self-paid-roi-pitch",
            "ROI framing for employer-sponsored learners.",
            "Employer vs self-paid ROI",
            "Allied health",
        ),
        (
            "CNPE vs NCLEX-RN Prep Style: Why NP Decision Practice Feels Different (And What to Import From RN Habits)",
            "cnpe-vs-nclex-rn-prep-style-decision-practice-differences",
            "Cross-exam habit import (educational).",
            "CNPE vs RN prep style",
            "CNPE / NCLEX-RN",
        ),
        (
            "Best Way to Study for REx-PN: Tutor Packages vs Subscription Practice (Predictability vs Flexibility)",
            "best-rex-pn-study-tutor-packages-vs-subscription-flexibility",
            "Pricing/packaging comparison intent.",
            "REx-PN tutor vs subscription",
            "REx-PN",
        ),
        (
            "NurseNest vs ‘Question Volume Only’ Culture: How CAT Changes What ‘Enough’ Means",
            "nursenest-vs-question-volume-only-cat-changes-enough",
            "CAT reframes sufficiency (balanced).",
            "CAT vs volume culture",
            "NCLEX-RN",
        ),
        (
            "NCLEX-RN Prep: School ATI/HESI Ecosystem vs NurseNest for Last-Mile Exam Calibration",
            "nclex-rn-ati-hesi-ecosystem-vs-nursenest-last-mile-calibration",
            "School ecosystem coexistence (no trash talk).",
            "ATI/HESI vs last-mile calibration",
            "NCLEX-RN",
        ),
        (
            "REx-PN vs NCLEX-PN Study Overlap: What Transfers, What Doesn’t (Canadian Context Callouts)",
            "rex-pn-vs-nclex-pn-study-overlap-canadian-context",
            "Crosswalk SEO for Canadian PN learners.",
            "REx-PN vs NCLEX-PN overlap",
            "REx-PN",
        ),
        (
            "Best Platform for Allied Health Practice Tests: Random Generators vs Pathway-Organized Banks",
            "best-allied-health-practice-tests-random-vs-pathway-organized",
            "Generator vs organized bank criteria.",
            "Allied practice test organization",
            "Allied health",
        ),
    ]
    assert len(rows) == 25
    return [entry(t, s, i, th, e) for t, s, i, th, e in rows]


def user_journeys() -> list[dict]:
    rows: list[tuple[str, str, str, str, str]] = [
        (
            "How to Go From Failing Practice Tests to Passing the NCLEX-RN: A 6-Week Repair Journey (Lesson-First)",
            "failing-practice-tests-to-pass-nclex-rn-6-week-repair",
            "Classic retake-adjacent journey SEO.",
            "NCLEX repair journey",
            "NCLEX-RN",
        ),
        (
            "8-Week Study Plan for REx-PN Success: Weeks 1–2 Lessons, 3–5 Practice, 6–8 CAT + Weak-Topic Loops",
            "8-week-study-plan-rex-pn-lessons-practice-cat-loops",
            "High-intent ‘8 week REx-PN plan’ query.",
            "8-week REx-PN plan",
            "REx-PN",
        ),
        (
            "How to Go From ‘I Read Guidelines’ to Passing CNPE-Style Cases: 10-Week Decision Density Build",
            "guidelines-to-cnpe-cases-10-week-decision-density",
            "CNPE journey from passive reading to decisions.",
            "CNPE 10-week decision build",
            "CNPE",
        ),
        (
            "30-Day Allied Health Certification Sprint: When It’s Realistic (And When It’s a Bad Idea)",
            "30-day-allied-health-cert-sprint-realistic-vs-bad-idea",
            "Sprint realism SEO for allied certs.",
            "30-day allied sprint",
            "Allied health",
        ),
        (
            "How to Go From NCLEX-RN School Exams to NCLEX-RN Readiness: Bridging ‘School Thinking’ to ‘NCLEX Thinking’",
            "school-exams-to-nclex-thinking-bridge-journey",
            "Bridge journey for new grads.",
            "School to NCLEX bridge",
            "NCLEX-RN",
        ),
        (
            "12-Week REx-PN Plan for Parents: Early Morning Lessons, Lunch Flashcards, Weekend Practice Blocks",
            "12-week-rex-pn-plan-parents-morning-lessons-lunch-flashcards",
            "Parent-specific long-tail scheduling.",
            "REx-PN parent schedule",
            "REx-PN",
        ),
        (
            "How to Go From Zero CAT Experience to Calm NCLEX-RN CAT: 3-Week Adaptive Practice Arc",
            "zero-cat-to-calm-nclex-rn-3-week-adaptive-arc",
            "CAT onboarding journey.",
            "CAT onboarding arc",
            "NCLEX-RN",
        ),
        (
            "16-Week CNPE Plan While Working Full-Time: Monthly Themes + Weekly CAT Touchpoints",
            "16-week-cnpe-plan-full-time-monthly-themes-weekly-cat",
            "Long CNPE timeline with work constraints.",
            "16-week CNPE working FT",
            "CNPE",
        ),
        (
            "How to Go From ‘I Memorize Drugs’ to Passing Pharm-Heavy Items: 4-Week Lesson + Flashcard Ladder",
            "memorize-drugs-to-pass-pharm-heavy-4-week-ladder",
            "Pharm journey for RN/PN/NP where relevant.",
            "Pharm ladder journey",
            "NCLEX-RN / CNPE",
        ),
        (
            "6-Week NCLEX-RN Crash Plan (Only If You Already Passed HESI): Where to Cut Corners Safely",
            "6-week-nclex-rn-crash-plan-post-hesi-safe-corner-cutting",
            "Crash plan with safety caveats.",
            "NCLEX crash plan caveats",
            "NCLEX-RN",
        ),
        (
            "How to Go From International RN to NCLEX-RN Ready: 90-Day Language + Clinical Judgment Stack",
            "international-rn-to-nclex-ready-90-day-language-cj-stack",
            "IEN journey long-tail.",
            "IEN NCLEX 90-day",
            "NCLEX-RN",
        ),
        (
            "10-Week REx-PN Journey for Repeat Writers: Week 1 Audit, Weeks 2–7 Repair, Weeks 8–10 CAT + Sim",
            "10-week-rex-pn-repeat-writer-audit-repair-cat-sim",
            "Repeater journey for Canadian PN.",
            "REx-PN repeater journey",
            "REx-PN",
        ),
        (
            "How to Go From Weak SATA Scores to Stable SATA Performance: 5-Week Rationale-First Journey",
            "weak-sata-to-stable-sata-5-week-rationale-first-journey",
            "SATA improvement arc.",
            "SATA improvement journey",
            "NCLEX-RN",
        ),
        (
            "14-Day ‘Last Mile’ NCLEX-RN Plan: Tight Loops Across `/lessons/`, `/app/practice`, and `/app/cat`",
            "14-day-last-mile-nclex-lessons-practice-cat-loops",
            "Explicit funnel URLs in title for SEO + user clarity.",
            "NCLEX last-mile loops",
            "NCLEX-RN",
        ),
        (
            "How to Go From Allied Classroom Confidence to Exam Hall Anxiety: 4-Week Exposure Graduation Path",
            "allied-classroom-confidence-to-exam-anxiety-4-week-exposure",
            "Allied anxiety exposure path.",
            "Allied anxiety graduation",
            "Allied health",
        ),
        (
            "20-Week CNPE Primary Care Arc: Seasoning Clinical Breadth Without Losing Exam Shape",
            "20-week-cnpe-primary-care-breadth-without-losing-exam-shape",
            "Long CNPE arc for primary care stream.",
            "CNPE 20-week arc",
            "CNPE",
        ),
        (
            "How to Go From ‘Random Qs Daily’ to a Coherent NCLEX-RN Stack: 21-Day Re-Route Plan",
            "random-qs-daily-to-coherent-nclex-stack-21-day-reroute",
            "Chaos-to-structure journey.",
            "NCLEX reroute 21-day",
            "NCLEX-RN",
        ),
        (
            "5-Week REx-PN Community Health Focus: Lesson Blocks + Scenario Practice for Population-Level Thinking",
            "5-week-rex-pn-community-health-lessons-scenario-practice",
            "Community health niche for PN.",
            "REx-PN community health arc",
            "REx-PN",
        ),
        (
            "How to Go From Part-Time Study Guilt to Consistent Wins: Micro-Wins Across Flashcards and Practice",
            "part-time-study-guilt-to-micro-wins-flashcards-practice",
            "Emotional journey + mechanics.",
            "Micro-wins journey",
            "NCLEX-RN / REx-PN",
        ),
        (
            "8-Week Allied Health Exam Journey: Weeks 1–3 Safety Rules, 4–6 Calculations, 7–8 Integrated Sim Sets",
            "8-week-allied-health-safety-calcs-integrated-sim",
            "Structured allied journey.",
            "Allied 8-week integrated",
            "Allied health",
        ),
        (
            "How to Go From ‘I Know Content’ to ‘I Finish On Time’: NCLEX-RN Pacing Journey Using Timed Practice + CAT",
            "content-know-to-finish-on-time-nclex-pacing-practice-cat",
            "Pacing journey.",
            "NCLEX pacing journey",
            "NCLEX-RN",
        ),
        (
            "11-Week CNPE + Work Travel Reality: Airport Flashcards, Hotel Practice Sets, Weekend CAT",
            "11-week-cnpe-travel-reality-flashcards-practice-cat",
            "Traveling clinician journey.",
            "CNPE travel prep",
            "CNPE",
        ),
        (
            "How to Go From Burnout Pause to Exam Restart: 4-Week Gentle Ramp (Lessons Light → Practice Normal)",
            "burnout-pause-to-exam-restart-4-week-gentle-ramp",
            "Restart journey (adjacent to FailureRecovery but journey-shaped).",
            "Exam restart ramp",
            "NCLEX-RN / CNPE",
        ),
        (
            "9-Week NCLEX-RN + NCLEX-PN Household Plan: Two Test Dates, Shared Lessons, Separate Practice Profiles",
            "9-week-household-nclex-rn-pn-two-dates-shared-lessons-separate-practice",
            "Household multi-learner long-tail.",
            "Household dual NCLEX plan",
            "NCLEX-RN / NCLEX-PN",
        ),
        (
            "How to Go From ‘I Avoid Math’ to Passing Dosage Items: 6-Week Calculation Courage Path (Allied + RN Overlap)",
            "avoid-math-to-pass-dosage-6-week-calculation-courage",
            "Math avoidance journey.",
            "Dosage courage path",
            "Allied health / NCLEX-RN",
        ),
    ]
    assert len(rows) == 25
    return [entry(t, s, i, th, e) for t, s, i, th, e in rows]


def failure_recovery() -> list[dict]:
    rows: list[tuple[str, str, str, str, str]] = [
        (
            "What to Do If You Fail the REx-PN: A 14-Day Reset Checklist (Audit → Lessons → Practice → CAT)",
            "what-to-do-if-you-fail-rex-pn-14-day-reset-checklist",
            "High-intent post-fail search for Canadian PN.",
            "REx-PN fail reset",
            "REx-PN",
        ),
        (
            "How to Recover After Failing the NCLEX-RN Without Shame-Spiraling: Evidence-Informed Retake Sequencing",
            "recover-after-failing-nclex-rn-shame-free-retake-sequencing",
            "Emotionally intelligent retake SEO.",
            "NCLEX fail recovery",
            "NCLEX-RN",
        ),
        (
            "What to Do If You Fail the CNPE: How to Rebuild Decision Speed Before You Rebuy Every Resource",
            "what-to-do-if-you-fail-cnpe-rebuild-decision-speed",
            "CNPE fail recovery without overspending.",
            "CNPE fail recovery",
            "CNPE",
        ),
        (
            "How to Bounce Back After Failing an Allied Health Certification Exam: Domain-Based Repair, Not Restart-From-Page-1",
            "bounce-back-after-failing-allied-health-cert-domain-repair",
            "Allied cert fail recovery.",
            "Allied fail domain repair",
            "Allied health",
        ),
        (
            "What to Do If You Fail NCLEX-RN SATA Sections: Build Judgment With Rationales, Not More Memorization",
            "fail-nclex-rn-sata-sections-rationales-not-memorization",
            "SATA-specific failure recovery.",
            "SATA fail recovery",
            "NCLEX-RN",
        ),
        (
            "How to Recover After Failing the REx-PN Pharmacology Cluster: Look-Alike Pairs + Timed Safety Drills",
            "recover-rex-pn-fail-pharm-cluster-lookalike-timed-drills",
            "Pharm cluster fail recovery.",
            "REx-PN pharm recovery",
            "REx-PN",
        ),
        (
            "What to Do If You Fail NCLEX-RN on Time: A Pacing-First Retake Plan Using `/app/cat` and `/app/practice`",
            "fail-nclex-rn-on-time-pacing-first-retake-cat-practice",
            "Time-fail retake with explicit app paths.",
            "NCLEX time fail retake",
            "NCLEX-RN",
        ),
        (
            "How to Bounce Back After CNPE ‘Close Fail’: When Another Month of Random Qs Won’t Change Outcomes",
            "cnpe-close-fail-random-qs-wont-change-outcomes",
            "Close fail psychology + strategy pivot.",
            "CNPE close fail pivot",
            "CNPE",
        ),
        (
            "What to Do If You Burn Out Two Weeks Before NCLEX-RN: Minimum Viable Study + Sleep-First Recovery",
            "burnout-two-weeks-before-nclex-minimum-viable-sleep-first",
            "Burnout proximity to exam date.",
            "NCLEX late burnout",
            "NCLEX-RN",
        ),
        (
            "How to Recover After Failing Allied Health Dosage Exams: Error Typing + Double-Check Rituals Under Fatigue",
            "recover-fail-allied-dosage-exam-error-typing-double-check",
            "Dosage fail recovery.",
            "Allied dosage recovery",
            "Allied health",
        ),
        (
            "What to Do If You Fail the NCLEX-RN Priority Items: Delegation Repair Weeks With Lessons Then Scenario Blocks",
            "fail-nclex-rn-priority-delegation-repair-lessons-scenarios",
            "Priority fail recovery.",
            "Priority fail recovery",
            "NCLEX-RN",
        ),
        (
            "How to Bounce Back After Failing the REx-PN English-Heavy Items: Active Reading Drills + Slower CAT Sessions",
            "rex-pn-fail-english-heavy-active-reading-slower-cat",
            "Language-load fail recovery for PN.",
            "REx-PN language recovery",
            "REx-PN",
        ),
        (
            "What to Do If You Fail NCLEX-RN Infection Control: Isolation Decision Drills + Rationale Review Loops",
            "fail-nclex-rn-infection-control-isolation-drills-rationale-loops",
            "Isolation fail recovery.",
            "Infection control recovery",
            "NCLEX-RN",
        ),
        (
            "How to Recover After Failing the CNPE Acute Stream: Stabilization Sequences Before Advanced Therapeutics Review",
            "recover-cnpe-acute-fail-stabilization-sequences-first",
            "Acute stream fail recovery (scope-safe language).",
            "CNPE acute recovery",
            "CNPE (Acute Care)",
        ),
        (
            "What to Do If You Fail Practice CAT Repeatedly: Lower Difficulty, Shorter Sessions, and Lesson Repair",
            "fail-practice-cat-repeatedly-lower-difficulty-shorter-lessons",
            "CAT discouragement recovery.",
            "CAT discouragement recovery",
            "NCLEX-RN",
        ),
        (
            "How to Bounce Back After Failing NCLEX-RN as a First-Gen Student: Support Systems + Predictable Study Slots",
            "bounce-back-nclex-rn-first-gen-support-predictable-slots",
            "First-gen supportive recovery framing.",
            "First-gen NCLEX recovery",
            "NCLEX-RN",
        ),
        (
            "What to Do If You Fail the REx-PN Clinical Judgment Items: Scenario Debrief Method (No Blame, Just Patterns)",
            "fail-rex-pn-clinical-judgment-scenario-debrief-patterns",
            "CJ fail debrief method.",
            "REx-PN CJ debrief",
            "REx-PN",
        ),
        (
            "How to Recover After Failing Allied Health Ethics Exams: Case Logging + Applied Scenario Practice",
            "recover-fail-allied-health-ethics-case-logging-scenarios",
            "Ethics exam recovery.",
            "Allied ethics recovery",
            "Allied health",
        ),
        (
            "What to Do If You Fail NCLEX-RN Maternal–Newborn: High-Yield Lesson Repair Then Timed Topic Sets",
            "fail-nclex-rn-maternal-newborn-lesson-repair-timed-sets",
            "OB fail recovery.",
            "OB fail recovery",
            "NCLEX-RN",
        ),
        (
            "How to Bounce Back After Failing the CNPE Due to Time: Decision Templates + Timed Practice Blocks",
            "bounce-back-cnpe-fail-due-to-time-templates-timed-blocks",
            "CNPE time fail.",
            "CNPE time recovery",
            "CNPE",
        ),
        (
            "What to Do If You Fail the NCLEX-RN and Dread `/pricing`: How to Trial Responsibly Before Committing",
            "fail-nclex-rn-dread-pricing-trial-responsibly-before-committing",
            "Pricing anxiety after fail—trust-building.",
            "Post-fail pricing anxiety",
            "NCLEX-RN",
        ),
        (
            "How to Recover After Failing the REx-PN Twice: Third-Attempt Audit With Instructor/Peer Support + NurseNest Stack",
            "recover-rex-pn-fail-twice-third-attempt-audit-stack",
            "Third attempt long-tail (no guarantees).",
            "REx-PN third attempt",
            "REx-PN",
        ),
        (
            "What to Do If You Fail Allied Health Practice Exams Miserably: Stop Churn, Start Mapping Misses to Lessons",
            "fail-allied-practice-exams-stop-churn-map-misses-to-lessons",
            "Churn-stop recovery.",
            "Allied churn recovery",
            "Allied health",
        ),
        (
            "How to Bounce Back After Burnout From Over-Studying: 10-Day Recovery + Re-Entry Rules for NCLEX-RN",
            "burnout-overstudying-10-day-recovery-reentry-nclex-rn",
            "Overstudy burnout recovery.",
            "Overstudy burnout recovery",
            "NCLEX-RN",
        ),
        (
            "What to Do If You Fail NCLEX-RN Near Passing: Interpretation Without Panic + Targeted `/lessons/` Repair Plan",
            "fail-nclex-rn-near-passing-interpretation-lessons-repair-plan",
            "Near-pass psychology + targeted repair.",
            "NCLEX near-pass repair",
            "NCLEX-RN",
        ),
    ]
    assert len(rows) == 25
    return [entry(t, s, i, th, e) for t, s, i, th, e in rows]


def _assert(payload: dict[str, list[dict]]) -> None:
    assert {k: len(v) for k, v in payload.items()} == {k: 25 for k in payload}
    titles = [d["title"] for cat in payload.values() for d in cat]
    slugs = [d["slug"] for cat in payload.values() for d in cat]
    assert len(titles) == len(set(titles))
    assert len(slugs) == len(set(slugs))
    for d in (x for v in payload.values() for x in v):
        o = d["outline"]
        assert "/lessons/" in o or "`/lessons/`" in o
        assert "app/practice" in o
        assert "app/cat" in o
        assert "pricing" in o


def main() -> None:
    payload = {
        "StudyStrategies": study_strategies(),
        "PassRatesAndOutcomes": pass_rates_outcomes(),
        "FeatureDeepDives": feature_deep_dives(),
        "Comparisons": comparisons(),
        "UserJourneys": user_journeys(),
        "FailureRecovery": failure_recovery(),
    }
    _assert(payload)
    out = Path(__file__).resolve().parents[1] / "docs" / "nursenest-exam-prep-blog-ideas-150.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out)


if __name__ == "__main__":
    main()
