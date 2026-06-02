#!/usr/bin/env python3
"""Lesson Quality Certification Audit — scores 100 sampled lessons against 6 criteria."""
import json, re
from collections import defaultdict

with open('/tmp/quality_sample.json') as f:
    sample = json.load(f)

# ─── Scoring rubric weights ───────────────────────────────────────────────────
# 1. Clinical Accuracy        0–20
# 2. Exam Alignment           0–20
# 3. Educational Value        0–20
# 4. Clinical Reasoning       0–15
# 5. Pharmacology Accuracy    0–15
# 6. Learning Design          0–10
# Total                       0–100

CLINICAL_TERMS = re.compile(
    r'\b(pathophysiology|mechanism|pathogen|hemoglobin|infarction|ischemia|inflammation|'
    r'edema|fibrosis|necrosis|hypertrophy|atrophy|thrombosis|embolism|sepsis|hypoxia|'
    r'perfusion|cardiac output|renal|hepatic|pulmonary|systolic|diastolic|tachycardia|'
    r'bradycardia|dyspnea|diuresis|electrolyte|sodium|potassium|glucose|pH|paCO2|paO2|'
    r'HCO3|ABG|CBC|BUN|creatinine|troponin|BNP|INR|aPTT|hematocrit|bilirubin|albumin)\b',
    re.I
)

EXAM_TERMS = re.compile(
    r'\b(NCLEX|REx-PN|CNPLE|blueprint|exam|priority|delegation|ABCs|Maslow|SBAR|'
    r'testable|correct answer|wrong answer|elimination|clinical judgment|NGN|'
    r'safety|prioritization|first action|most important|best response|'
    r'expected finding|unexpected finding|normal|abnormal|reassess|escalate|'
    r'notify|provider|charge nurse|immediate|urgent|emergent|critical)\b',
    re.I
)

CLINICAL_REASONING = re.compile(
    r'\b(prioritize|delegate|assess|evaluate|intervention|safety|judgment|decision|'
    r'recognize|identify|distinguish|differentiate|compare|analyze|apply|implement|'
    r'notify|escalate|hold|withhold|administer|monitor|teach|educate|document|report)\b',
    re.I
)

PHARM_TERMS = re.compile(
    r'\b(medication|drug|dose|mg|mcg|mL|tablet|capsule|IV|PO|IM|SQ|topical|inhaled|'
    r'sublingual|adverse|side effect|contraindication|interaction|allergy|toxic|'
    r'antidote|reversal|monitor|therapeutic|serum level|trough|peak|half-life|'
    r'mechanism|receptor|antagonist|agonist|inhibitor|enzyme|CYP|renal clearance)\b',
    re.I
)

PHARM_SAFETY = re.compile(
    r'\b(contraindicated|avoid|hold|do not|never|black box|warning|caution|allergy|'
    r'anaphylaxis|antidote|overdose|toxicity|toxic level|therapeutic window|narrow|'
    r'monitor|withhold|discontinue|reversal agent|high alert|high-alert)\b',
    re.I
)

PLACEHOLDERS = re.compile(
    r'\b(TODO|PLACEHOLDER|TBD|coming soon|to be added|content here|'
    r'insert content|example text|lorem ipsum|FIXME)\b',
    re.I
)

FACTUAL_ERRORS = [
    # Common nursing factual error patterns
    (re.compile(r'normal\s+pH\s*(?:is\s*)?(?:7\.4[5-9]|7\.[5-9]|[89]\.)', re.I), "pH normal range error"),
    (re.compile(r'normal\s+(?:HR|heart rate)\s*(?:is\s*)?(?:>?\s*120|<?\s*40)', re.I), "HR normal range error"),
    (re.compile(r'potassium\s+normal\s*(?:is\s*)?(?:[6-9]\.|[1-2]\.)', re.I), "K+ normal range error"),
    (re.compile(r'sodium\s+normal\s*(?:is\s*)?(?:>?\s*160|<?\s*120)', re.I), "Na+ normal range error"),
    (re.compile(r'glucose.*(?:normal|fasting).*(?:>?\s*200|<?\s*50)\s*mg', re.I), "Glucose range error"),
]

MISLEADING_EXAM = [
    (re.compile(r'always\s+(?:administer|give)\s+without\s+checking', re.I), "Unsafe exam guidance"),
    (re.compile(r'never\s+notify\s+the\s+(?:provider|doctor|physician)', re.I), "Misleading safety guidance"),
    (re.compile(r'assessment\s+is\s+not\s+necessary\s+before', re.I), "Wrong assessment sequence"),
]

def wc(text): return len(text.split())
def section_text(lesson): return ' '.join(s.get('body','') for s in lesson.get('sections',[]))
def section_kinds(lesson): return {s.get('kind','') for s in lesson.get('sections',[])}

def score_clinical_accuracy(lesson, text):
    """0–20: evidence-based, current, no factual errors."""
    score = 0
    kinds = section_kinds(lesson)

    # Pathophysiology present and substantive (0–6)
    has_path = any(k in {'pathophysiology_overview','pathophysiology','core_concept'} for k in kinds)
    path_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                         if s.get('kind') in {'pathophysiology_overview','pathophysiology','core_concept'})
    path_words = wc(path_text)
    if has_path and path_words >= 200: score += 6
    elif has_path and path_words >= 100: score += 4
    elif has_path: score += 2

    # Clinical terminology density (0–6)
    clinical_hits = len(CLINICAL_TERMS.findall(text))
    total_words = wc(text)
    density = clinical_hits / max(total_words, 1) * 100
    if density >= 4: score += 6
    elif density >= 2.5: score += 5
    elif density >= 1.5: score += 4
    elif density >= 0.8: score += 3
    else: score += 1

    # No factual errors (0–5 — deduct for errors found)
    score += 5
    for pattern, _ in FACTUAL_ERRORS:
        if pattern.search(text):
            score -= 3

    # No placeholder content (0–3)
    score += 3
    if PLACEHOLDERS.search(text):
        score -= 3

    return max(0, min(20, score))

def score_exam_alignment(lesson, text, pathway):
    """0–20: blueprint relevance, testable concepts."""
    score = 0
    kinds = section_kinds(lesson)

    # Exam-specific section present (0–5)
    has_exam_sec = any(k in {'clinical_decision_making','exam_relevance','common-exam-traps',
                              'clinical_pearls','related_next_steps'} for k in kinds)
    if has_exam_sec: score += 5

    # Exam-relevant terminology density (0–6)
    exam_hits = len(EXAM_TERMS.findall(text))
    if exam_hits >= 20: score += 6
    elif exam_hits >= 12: score += 5
    elif exam_hits >= 7: score += 4
    elif exam_hits >= 3: score += 3
    elif exam_hits >= 1: score += 2

    # PreTest present with quality (0–5)
    pretest = lesson.get('preTest', [])
    if pretest:
        has_rationale = all(q.get('rationale') and len(q['rationale']) > 50 for q in pretest)
        if len(pretest) >= 5 and has_rationale: score += 5
        elif len(pretest) >= 3 and has_rationale: score += 4
        elif pretest: score += 2

    # No misleading exam guidance (0–4)
    score += 4
    for pattern, _ in MISLEADING_EXAM:
        if pattern.search(text):
            score -= 2

    return max(0, min(20, score))

def score_educational_value(lesson, text):
    """0–20: explains why, prioritization, interventions."""
    score = 0
    kinds = section_kinds(lesson)

    # Patient education section present (0–4)
    if any(k in {'client_education','patient_education','education'} for k in kinds):
        edu_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                            if s.get('kind') in {'client_education','patient_education'})
        if wc(edu_text) >= 100: score += 4
        else: score += 2

    # Nursing interventions present (0–5)
    if any(k in {'nursing_assessment_interventions','treatments','non_pharmacologic_management'} for k in kinds):
        int_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                            if s.get('kind') in {'nursing_assessment_interventions','treatments'})
        if wc(int_text) >= 200: score += 5
        elif wc(int_text) >= 100: score += 3
        else: score += 2

    # Explains "why" — pathophysiology connected to assessment (0–4)
    path_has_why = bool(re.search(r'\b(because|therefore|results in|leads to|causes|mechanism|due to|'
                                   r'rationale|explain|reason|principle)\b', text, re.I))
    if path_has_why: score += 4

    # Overall word count adequate (0–4)
    total_wc = wc(text)
    if total_wc >= 1500: score += 4
    elif total_wc >= 1000: score += 3
    elif total_wc >= 800: score += 2
    elif total_wc >= 500: score += 1

    # Case study/scenario present (0–3)
    if any(k in {'case_study','clinical_scenario','case_application'} for k in kinds):
        score += 3

    return max(0, min(20, score))

def score_clinical_reasoning(lesson, text):
    """0–15: prioritization, delegation, safety, judgment."""
    score = 0
    kinds = section_kinds(lesson)

    # Clinical reasoning section (0–5)
    has_reasoning = any(k in {'clinical_decision_making','clinical_judgment',
                               'clinical-judgment-pearls','prioritization'} for k in kinds)
    if has_reasoning:
        cr_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                           if s.get('kind') in {'clinical_decision_making','clinical_judgment'})
        if wc(cr_text) >= 200: score += 5
        elif wc(cr_text) >= 100: score += 4
        else: score += 3

    # Reasoning action verbs density (0–5)
    reasoning_hits = len(CLINICAL_REASONING.findall(text))
    if reasoning_hits >= 30: score += 5
    elif reasoning_hits >= 20: score += 4
    elif reasoning_hits >= 12: score += 3
    elif reasoning_hits >= 6: score += 2
    else: score += 1

    # Priority/safety language (0–5)
    priority_hits = len(re.findall(
        r'\b(priority|first|immediately|urgent|emergent|safety|critical|life-threatening|'
        r'assessment|notify|hold|withhold|escalate|rapid response|911)\b', text, re.I))
    if priority_hits >= 15: score += 5
    elif priority_hits >= 10: score += 4
    elif priority_hits >= 6: score += 3
    elif priority_hits >= 3: score += 2
    else: score += 1

    return max(0, min(15, score))

def score_pharmacology(lesson, text):
    """0–15: medication safety, adverse effects, contraindications."""
    kinds = section_kinds(lesson)

    has_pharm_section = any(k in {'pharmacology','pharmacologic_management',
                                   'pharmacologic-management','medications'} for k in kinds)
    pharm_hits = len(PHARM_TERMS.findall(text))
    safety_hits = len(PHARM_SAFETY.findall(text))

    # Non-pharmacology topic — base score on general medication safety mentions
    if not has_pharm_section and pharm_hits < 10:
        # Give a proportional score based on what's present
        if pharm_hits >= 5: return 10
        elif pharm_hits >= 2: return 8
        else: return 7  # Non-pharm topics get baseline pass

    score = 0

    # Pharmacology section present (0–5)
    if has_pharm_section:
        pharm_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                               if s.get('kind') in {'pharmacology','pharmacologic_management',
                                                     'pharmacologic-management'})
        if wc(pharm_text) >= 200: score += 5
        elif wc(pharm_text) >= 100: score += 4
        else: score += 3
    else:
        score += 2

    # Medication safety content (0–5)
    if safety_hits >= 8: score += 5
    elif safety_hits >= 5: score += 4
    elif safety_hits >= 3: score += 3
    elif safety_hits >= 1: score += 2
    else: score += 1

    # Drug terminology depth (0–5)
    if pharm_hits >= 25: score += 5
    elif pharm_hits >= 15: score += 4
    elif pharm_hits >= 8: score += 3
    elif pharm_hits >= 4: score += 2
    else: score += 1

    return max(0, min(15, score))

def score_learning_design(lesson, text):
    """0–10: objectives match content, pre/post tests aligned, pearls useful."""
    score = 0
    kinds = section_kinds(lesson)

    # Introduction/objectives (0–3)
    has_intro = any(k in {'introduction','overview'} for k in kinds)
    if has_intro:
        intro_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                               if s.get('kind') in {'introduction','overview'})
        has_objectives = bool(re.search(r'\b(objective|learning|by the end|after|you will|able to)\b',
                                         intro_text, re.I))
        if has_objectives: score += 3
        else: score += 2

    # Clinical pearls present and exam-focused (0–4)
    has_pearls = any(k in {'clinical_pearls','related_next_steps','clinical-judgment-pearls',
                            'common-exam-traps'} for k in kinds)
    if has_pearls:
        pearl_text = ' '.join(s.get('body','') for s in lesson.get('sections',[])
                               if s.get('kind') in {'clinical_pearls','related_next_steps',
                                                     'clinical-judgment-pearls'})
        pearl_wc = wc(pearl_text)
        pearl_actionable = len(re.findall(r'\b(never|always|first|priority|remember|key|critical|'
                                           r'NCLEX|REx-PN|CNPLE|exam|trap|mistake|avoid)\b',
                                           pearl_text, re.I))
        if pearl_wc >= 200 and pearl_actionable >= 5: score += 4
        elif pearl_wc >= 100 and pearl_actionable >= 3: score += 3
        elif pearl_wc >= 50: score += 2
        else: score += 1

    # PreTest quality (0–3)
    pretest = lesson.get('preTest', [])
    if pretest:
        good_qs = sum(1 for q in pretest
                      if q.get('rationale') and len(q.get('rationale','')) > 80
                      and len(q.get('options',[])) >= 4)
        if good_qs >= 4: score += 3
        elif good_qs >= 2: score += 2
        elif good_qs >= 1: score += 1
    else:
        score += 1  # No pretest — minor deduction only

    return max(0, min(10, score))


def evaluate_lesson(lesson, pathway):
    text = section_text(lesson)

    c1 = score_clinical_accuracy(lesson, text)
    c2 = score_exam_alignment(lesson, text, pathway)
    c3 = score_educational_value(lesson, text)
    c4 = score_clinical_reasoning(lesson, text)
    c5 = score_pharmacology(lesson, text)
    c6 = score_learning_design(lesson, text)
    total = c1 + c2 + c3 + c4 + c5 + c6

    # Identify quality flags
    flags = []
    if wc(text) < 800: flags.append("thin-content")
    if not lesson.get('preTest'): flags.append("no-pretest")
    if PLACEHOLDERS.search(text): flags.append("placeholder-text")
    for pattern, msg in FACTUAL_ERRORS:
        if pattern.search(text): flags.append(f"factual-error:{msg}")
    for pattern, msg in MISLEADING_EXAM:
        if pattern.search(text): flags.append(f"misleading-exam:{msg}")
    if c4 < 9: flags.append("weak-clinical-reasoning")
    if c5 < 8 and len(re.findall(r'\b(medication|drug|pharmacology)\b', text, re.I)) > 5:
        flags.append("pharm-depth-low")

    return {
        'slug': lesson.get('slug',''),
        'title': lesson.get('title','')[:60],
        'pathway': pathway,
        'topic': lesson.get('topic',''),
        'word_count': wc(text),
        'sections': len(lesson.get('sections',[])),
        'has_pretest': bool(lesson.get('preTest')),
        'scores': {
            'clinical_accuracy': c1,
            'exam_alignment': c2,
            'educational_value': c3,
            'clinical_reasoning': c4,
            'pharmacology': c5,
            'learning_design': c6,
            'total': total
        },
        'grade': 'Excellent' if total >= 90 else ('Good' if total >= 80 else 'Needs Revision'),
        'flags': flags
    }

# Evaluate all 100 lessons
results = []
for pathway, lessons in sample.items():
    for lesson in lessons:
        result = evaluate_lesson(lesson, pathway)
        results.append(result)

# Save results
with open('/tmp/quality_results.json', 'w') as f:
    json.dump(results, f, indent=2)

# Print summary
pathway_scores = defaultdict(list)
for r in results:
    pathway_scores[r['pathway']].append(r['scores']['total'])

print('=== QUALITY AUDIT RESULTS ===\n')
all_scores = [r['scores']['total'] for r in results]
print(f'Overall average: {sum(all_scores)/len(all_scores):.1f}')
print(f'Min score: {min(all_scores)} | Max: {max(all_scores)}')
print()
for pw, scores in sorted(pathway_scores.items()):
    avg = sum(scores)/len(scores)
    grade_counts = {'Excellent':0,'Good':0,'Needs Revision':0}
    for r in results:
        if r['pathway'] == pw:
            grade_counts[r['grade']] += 1
    print(f'{pw}: avg={avg:.1f} | Excellent={grade_counts["Excellent"]} Good={grade_counts["Good"]} NeedsRevision={grade_counts["Needs Revision"]}')

print()
print(f'Excellent (≥90): {sum(1 for r in results if r["grade"]=="Excellent")}')
print(f'Good (80-89): {sum(1 for r in results if r["grade"]=="Good")}')
print(f'Needs Revision (<80): {sum(1 for r in results if r["grade"]=="Needs Revision")}')

# Flag summary
all_flags = defaultdict(int)
for r in results:
    for f in r['flags']:
        all_flags[f] += 1
print('\nFlags:')
for flag, count in sorted(all_flags.items(), key=lambda x: -x[1]):
    print(f'  {flag}: {count}')
