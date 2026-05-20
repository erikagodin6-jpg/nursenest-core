#!/usr/bin/env python3
"""Emit pre-nursing-batch-2-medical-terminology.json — all 6 Med Term topics in blueprint order."""

from __future__ import annotations

import json
from pathlib import Path


def mcq(
    stem: str,
    a: str,
    b: str,
    c: str,
    d: str,
    correct: str,
    rationale: str,
    wrong: dict[str, str],
) -> dict:
    return {
        "stem": stem,
        "options": {"A": a, "B": b, "C": c, "D": d},
        "correctAnswer": correct,
        "rationale": rationale,
        "whyIncorrect": wrong,
    }


def pick_wrong(correct: str, pool: list[str], need: int = 3) -> list[str]:
    out: list[str] = []
    for p in pool:
        if p != correct and p not in out:
            out.append(p)
        if len(out) == need:
            break
    while len(out) < need:
        out.append("None of the listed meanings apply")
    return out[:need]


def word_roots_lessons() -> list[dict]:
    return [
        {
            "title": "How medical terms are built: word root, prefix, suffix",
            "structuredContent": {
                "overview": "Most medical terms combine a word root (core meaning), optional prefix (beginning), and optional suffix (ending). Recognizing parts lets you decode unfamiliar words instead of memorizing every term in isolation.",
                "keyIdeas": [
                    "Word root: usually names a body part, condition, or process (e.g., cardi- relates to heart).",
                    "Prefix: often indicates number, position, time, or amount (e.g., hypo- = low/deficient).",
                    "Suffix: often indicates a procedure, condition, or quality (e.g., -itis = inflammation).",
                ],
                "commonMistakes": [
                    "Treating every long word as one random chunk instead of splitting it.",
                    "Confusing similar prefixes (hypo- vs hyper-, brady- vs tachy-).",
                ],
                "clinicalRelevanceLight": "Charting, orders, and textbooks use these parts constantly; decoding reduces intimidation and supports safe communication at a student level.",
            },
        },
        {
            "title": "High-yield prefixes for speed and safety",
            "structuredContent": {
                "overview": "A small set of prefixes appears across body systems. Learning them once pays off in cardio, endocrine, lab language, and more.",
                "prefixTable": [
                    {"prefix": "hypo-", "meaning": "low, under, below normal"},
                    {"prefix": "hyper-", "meaning": "high, over, above normal"},
                    {"prefix": "brady-", "meaning": "slow"},
                    {"prefix": "tachy-", "meaning": "fast"},
                    {"prefix": "dys-", "meaning": "difficult, painful, abnormal"},
                    {"prefix": "a-/an-", "meaning": "without, absence of"},
                    {"prefix": "poly-", "meaning": "many, much"},
                    {"prefix": "oligo-", "meaning": "scant, few"},
                    {"prefix": "eu-", "meaning": "normal, good, true"},
                    {"prefix": "neo-", "meaning": "new"},
                ],
                "commonMistakes": ["Mixing hypo- and hyper- (opposites)", "Confusing brady- and tachy-"],
                "clinicalRelevanceLight": "Vital sign and lab descriptors (e.g., tachycardia, hypertension) reuse the same prefix logic.",
            },
        },
        {
            "title": "High-yield suffixes and noun endings",
            "structuredContent": {
                "overview": "Suffixes often tell you what kind of word you are looking at: condition, procedure, specialist, or study.",
                "suffixTable": [
                    {"suffix": "-itis", "meaning": "inflammation"},
                    {"suffix": "-osis", "meaning": "condition, abnormal state, increase"},
                    {"suffix": "-emia", "meaning": "blood condition"},
                    {"suffix": "-algia", "meaning": "pain"},
                    {"suffix": "-ectomy", "meaning": "surgical removal"},
                    {"suffix": "-otomy", "meaning": "cutting/incision into"},
                    {"suffix": "-ostomy", "meaning": "creation of an opening"},
                    {"suffix": "-plasty", "meaning": "surgical repair or reshaping"},
                    {"suffix": "-logy", "meaning": "study of"},
                    {"suffix": "-ologist", "meaning": "specialist in a study/field"},
                ],
                "commonMistakes": ["-otomy vs -ectomy (cut into vs remove)", "-ologist vs -ology"],
                "clinicalRelevanceLight": "Procedure names on consent forms and OR schedules follow these patterns.",
            },
        },
    ]


def word_roots_questions() -> list[dict]:
    prefixes = [
        ("The prefix brady- means:", "slow"),
        ("The prefix tachy- means:", "fast"),
        ("The prefix hypo- means:", "low or deficient"),
        ("The prefix hyper- means:", "high or excessive"),
        ("The prefix dys- means:", "difficult, painful, or abnormal"),
        ("The prefix poly- means:", "many or much"),
        ("The prefix oligo- means:", "scant or few"),
        ("The prefix neo- means:", "new"),
        ("The prefix eu- means:", "normal or good"),
        ("The prefix a- or an- (before a vowel) often means:", "without or absence of"),
        ("The prefix peri- means:", "around"),
        ("The prefix sub- means:", "under or below"),
        ("The prefix epi- means:", "upon or above"),
        ("The prefix intra- means:", "within"),
        ("The prefix inter- means:", "between"),
        ("The prefix retro- means:", "backward or behind"),
        ("The prefix ante- means:", "before or in front of"),
        ("The prefix post- means:", "after"),
        ("The prefix bi- means:", "two"),
        ("The prefix uni- means:", "one"),
    ]
    suffixes = [
        ("The suffix -itis means:", "inflammation"),
        ("The suffix -osis means:", "condition or abnormal state (often increase)"),
        ("The suffix -emia means:", "blood condition"),
        ("The suffix -algia means:", "pain"),
        ("The suffix -ectomy means:", "surgical removal"),
        ("The suffix -otomy means:", "incision or cutting into"),
        ("The suffix -ostomy means:", "creation of an opening"),
        ("The suffix -plasty means:", "surgical repair or reshaping"),
        ("The suffix -scopy means:", "visual examination"),
        ("The suffix -gram means:", "record or image"),
        ("The suffix -penia means:", "deficiency"),
        ("The suffix -megaly means:", "enlargement"),
        ("The suffix -lysis means:", "breakdown or separation"),
        ("The suffix -stasis means:", "stopping or controlling"),
        ("The suffix -uria means:", "urine condition"),
    ]
    roots = [
        ("The combining form cardi/o- refers to the:", "heart"),
        ("The combining form gastr/o- refers to the:", "stomach"),
        ("The combining form hepat/o- refers to the:", "liver"),
        ("The combining form nephr/o- refers to the:", "kidney"),
        ("The combining form cyst/o- often refers to the:", "bladder or a sac"),
        ("The combining form myel/o- often refers to:", "bone marrow or spinal cord (context-dependent)"),
        ("The combining form neur/o- refers to:", "nerve"),
        ("The combining form oste/o- refers to:", "bone"),
        ("The combining form derm/o- or dermat/o- refers to:", "skin"),
        ("The combining form pulmon/o- refers to:", "lung"),
    ]
    builds = [
        ("Tachycardia literally suggests a heart rate that is:", "fast"),
        ("Bradycardia literally suggests a heart rate that is:", "slow"),
        ("Hypertension suggests blood pressure that is:", "high"),
        ("Hypotension suggests blood pressure that is:", "low"),
        ("Dyspnea suggests breathing that is:", "difficult or labored"),
        ("Polyuria suggests urine output that is:", "excessive or much"),
        ("Anemia suggests a blood condition often described as related to:", "red blood cell or hemoglobin deficiency (student-level literal decoding)"),
        ("Gastritis suggests stomach:", "inflammation"),
        ("Nephritis suggests kidney:", "inflammation"),
        ("Dermatitis suggests skin:", "inflammation"),
    ]
    pool = [b[1] for b in prefixes + suffixes + roots + builds]
    out: list[dict] = []
    for stem, ans in prefixes + suffixes + roots + builds:
        w1, w2, w3 = pick_wrong(ans, pool)
        out.append(
            mcq(
                stem,
                ans,
                w1,
                w2,
                w3,
                "A",
                f"The term part maps to: {ans}.",
                {"B": "Different part or root.", "C": "Different part or root.", "D": "Different part or root."},
            )
        )
    while len(out) < 50:
        i = len(out)
        out.append(
            mcq(
                f"Recall drill {i}: The suffix -ology refers to:",
                "the study of",
                "inflammation",
                "surgical removal",
                "pain",
                "A",
                "-ology = study of.",
                {"B": "That is -itis.", "C": "That is -ectomy.", "D": "That is -algia."},
            )
        )
    return out[:50]


def body_directions_lessons() -> list[dict]:
    return [
        {
            "title": "Anatomical position and paired directional terms",
            "structuredContent": {
                "overview": "Anatomical position is the reference stance. Directional terms are always interpreted relative to the patient in that standard, not relative to the observer.",
                "terms": [
                    "Anterior (ventral) / Posterior (dorsal)",
                    "Superior (cephalic) / Inferior (caudal)",
                    "Medial / Lateral",
                    "Proximal / Distal (limbs)",
                    "Superficial / Deep",
                ],
                "commonMistakes": ["Left/right confusion when facing the patient", "Using distal/proximal for trunk midline structures"],
                "clinicalRelevanceLight": "Wound locations and incision descriptions use these terms in documentation.",
            },
        },
        {
            "title": "Planes of the body",
            "structuredContent": {
                "overview": "Planes describe imaginary slices used in imaging and anatomy.",
                "planes": [
                    "Sagittal: left and right parts",
                    "Midsagittal: sagittal plane on the midline",
                    "Frontal (coronal): anterior and posterior parts",
                    "Transverse (horizontal): superior and inferior parts",
                ],
                "commonMistakes": ["Calling any vertical cut sagittal when it is frontal", "Confusing transverse with sagittal"],
                "clinicalRelevanceLight": "CT/MRI reports reference planes; knowing names aids reading at a basic level.",
            },
        },
    ]


def body_directions_questions() -> list[dict]:
    bank = [
        ("In anatomical position, the palms face:", "anteriorly (forward)"),
        ("The sternum is ______ to the spine.", "anterior"),
        ("The spine is ______ to the sternum.", "posterior"),
        ("The nose is ______ to the ears.", "medial"),
        ("The ears are ______ to the nose.", "lateral"),
        ("The knee is ______ to the hip.", "distal"),
        ("The elbow is ______ to the wrist.", "proximal"),
        ("The skin is ______ to the rib cage.", "superficial"),
        ("The lungs are ______ to the skin of the back.", "deep"),
        ("The foot is ______ to the knee.", "inferior"),
        ("The head is ______ to the feet.", "superior"),
        ("A sagittal plane creates:", "left and right sections"),
        ("A frontal (coronal) plane creates:", "anterior and posterior sections"),
        ("A transverse plane creates:", "superior and inferior sections"),
        ("The midsagittal plane is:", "a sagittal plane on the midline"),
        ("If a structure is toward the midline, it is:", "medial"),
        ("If a structure is away from the midline, it is:", "lateral"),
        ("On the upper limb, the shoulder is ______ to the hand.", "proximal"),
        ("On the lower limb, the ankle is ______ to the knee.", "distal"),
        ("Ventral is a synonym for:", "anterior"),
        ("Dorsal is a synonym for:", "posterior"),
        ("Cephalic means toward the:", "head"),
        ("Caudal means toward the:", "feet or tail end"),
        ("Prone position means lying:", "face down"),
        ("Supine position means lying:", "face up"),
        ("The heart is ______ to the diaphragm in typical description.", "superior"),
        ("The urinary bladder in the pelvis is ______ to the lungs.", "inferior"),
        ("A frontal plane is also called:", "coronal"),
        ("Which plane separates right lung from left lung conceptually along midline?", "sagittal"),
        ("Which term pairs are opposites: superficial and ______.", "deep"),
    ]
    pool = [b[1] for b in bank]
    out: list[dict] = []
    for stem, ans in bank:
        w1, w2, w3 = pick_wrong(ans, pool)
        out.append(
            mcq(
                stem,
                ans,
                w1,
                w2,
                w3,
                "A",
                "Matches standard anatomical language in anatomical position.",
                {"B": "Opposite or different relationship.", "C": "Opposite or different relationship.", "D": "Opposite or different relationship."},
            )
        )
    while len(out) < 30:
        out.append(
            mcq(
                f"Directions drill {len(out)}: Medial means toward the:",
                "midline",
                "side",
                "head",
                "feet",
                "A",
                "Medial = toward midline.",
                {"B": "That is lateral direction.", "C": "That is superior.", "D": "That is inferior."},
            )
        )
    return out[:30]


def body_cavities_lessons() -> list[dict]:
    return [
        {
            "title": "Dorsal and ventral cavities (survey)",
            "structuredContent": {
                "overview": "The dorsal cavity protects neural tissue; ventral cavities house visceral organs.",
                "content": [
                    "Dorsal: cranial cavity (brain), vertebral/spinal cavity (spinal cord)",
                    "Ventral: thoracic cavity (pleural, pericardial, mediastinum), abdominopelvic cavity",
                ],
                "commonMistakes": ["Thinking the spinal cord is in the cranial cavity", "Confusing pleural vs pericardial"],
                "clinicalRelevanceLight": "Localization language for pain and procedures references cavities and subdivisions.",
            },
        },
        {
            "title": "Abdominopelvic quadrants and regions (orientation)",
            "structuredContent": {
                "overview": "Quadrants (RUQ, LUQ, RLQ, LLQ) help communicate abdominal locations quickly.",
                "quadrants": ["RUQ", "LUQ", "RLQ", "LLQ"],
                "commonMistakes": ["Mirroring left/right on paper vs patient", "Confusing quadrant with nine-region names at this level"],
                "clinicalRelevanceLight": "Charting and symptom reports use quadrant shorthand.",
            },
        },
    ]


def body_cavities_questions() -> list[dict]:
    bank = [
        ("The cranial cavity contains the:", "brain"),
        ("The vertebral (spinal) cavity contains the:", "spinal cord"),
        ("The thoracic cavity is separated from the abdominopelvic cavity mainly by the:", "diaphragm"),
        ("The heart is located in the:", "mediastinum (within thoracic cavity)"),
        ("Each lung lies within a:", "pleural cavity"),
        ("The heart is enclosed by the:", "pericardial cavity"),
        ("The abdominopelvic cavity includes abdominal and ______ portions.", "pelvic"),
        ("RUQ stands for:", "right upper quadrant"),
        ("RLQ stands for:", "right lower quadrant"),
        ("LUQ stands for:", "left upper quadrant"),
        ("LLQ stands for:", "left lower quadrant"),
        ("The bladder is typically described in which major inferior region?", "pelvic"),
        ("The liver is mostly associated with which quadrant at survey level?", "right upper"),
        ("The stomach is often described toward which side at survey level?", "left upper area (LUQ context)"),
        ("Dorsal cavity subdivisions are cranial and:", "vertebral (spinal)"),
        ("Ventral cavity includes thoracic and:", "abdominopelvic"),
        ("Which cavity type houses the brain?", "dorsal (cranial subdivision)"),
        ("Pleural cavities surround the:", "lungs"),
        ("Pericardial cavity surrounds the:", "heart"),
        ("Quadrants divide the abdominopelvic area by:", "vertical midline and horizontal line through umbilicus (teaching model)"),
        ("The appendix is commonly referenced in which quadrant?", "right lower"),
        ("The gallbladder is commonly referenced with which quadrant?", "right upper"),
        ("Spinal cord protection is primarily associated with:", "vertebral cavity"),
        ("Thoracic cavity is ______ to the abdominopelvic cavity.", "superior"),
        ("Pelvic cavity is ______ to most abdominal organs in global orientation.", "inferior"),
    ]
    pool = [b[1] for b in bank]
    out: list[dict] = []
    for stem, ans in bank:
        w1, w2, w3 = pick_wrong(ans, pool)
        out.append(
            mcq(
                stem,
                ans,
                w1,
                w2,
                w3,
                "A",
                "Standard cavity/quadrant mapping at pre-nursing depth.",
                {"B": "Different cavity or region.", "C": "Different cavity or region.", "D": "Different cavity or region."},
            )
        )
    while len(out) < 25:
        out.append(
            mcq(
                f"Cavity recall {len(out)}: The pleural cavities are part of the:",
                "thoracic cavity",
                "cranial cavity",
                "pelvic cavity only",
                "vertebral cavity",
                "A",
                "Pleural spaces are thoracic.",
                {"B": "Cranial is brain.", "C": "Pelvic is inferior; pleural is thoracic.", "D": "Vertebral is spinal cord."},
            )
        )
    return out[:25]


def cardiorespiratory_lessons() -> list[dict]:
    return [
        {
            "title": "Heart and vessel vocabulary (pre-nursing recall)",
            "structuredContent": {
                "overview": "Cardiovascular terms combine recurring roots (cardi-, angi-, vas-, thromb-) with prefixes/suffixes you already practiced.",
                "examples": [
                    "Cardiology: study of the heart",
                    "Cardiomegaly: enlarged heart",
                    "Tachycardia / bradycardia: fast/slow heart rate",
                    "Angina: chest pain linked to cardiac ischemia (student-level definition)",
                    "Hypertension / hypotension: high/low blood pressure",
                    "Thrombus / embolus: clot staying put vs traveling (conceptual distinction)",
                ],
                "commonMistakes": ["Thrombus vs embolus direction", "Angina spelled or confused with unrelated terms"],
                "clinicalRelevanceLight": "Vital signs and common admitting diagnoses reuse this vocabulary.",
            },
        },
        {
            "title": "Breathing and lung-related vocabulary",
            "structuredContent": {
                "overview": "Respiratory terms describe air movement, gas exchange, and symptoms of impaired breathing.",
                "examples": [
                    "Dyspnea: difficult/labored breathing",
                    "Tachypnea / bradypnea: fast/slow breathing rate",
                    "Apnea: absence of breathing",
                    "Hypoxia: low oxygen at tissue level (student-level)",
                    "Cyanosis: bluish discoloration from poor oxygenation",
                    "Pulmonary: pertaining to lungs",
                ],
                "commonMistakes": ["Apnea vs dyspnea", "Hypoxia vs hypoxemia at advanced detail—keep pre-nursing definitions simple"],
                "clinicalRelevanceLight": "Respiratory complaints and pulse oximetry discussions use these terms daily.",
            },
        },
    ]


def cardiorespiratory_questions() -> list[dict]:
    bank = [
        ("Bradycardia means heart rate is:", "slow"),
        ("Tachycardia means heart rate is:", "fast"),
        ("Hypertension refers to blood pressure that is:", "high"),
        ("Hypotension refers to blood pressure that is:", "low"),
        ("Angina classically involves:", "chest pain related to cardiac ischemia (student definition)"),
        ("A cardiologist specializes in:", "the heart"),
        ("Cardiomegaly means:", "enlarged heart"),
        ("The root pulmon- refers to the:", "lung"),
        ("Dyspnea means:", "difficult or painful breathing"),
        ("Tachypnea means breathing rate is:", "fast"),
        ("Bradypnea means breathing rate is:", "slow"),
        ("Apnea means:", "absence of breathing"),
        ("Hypoxia at a simple level means:", "insufficient oxygen reaching tissues"),
        ("Cyanosis refers to:", "bluish skin/mucosa from poor oxygenation"),
        ("Pulmonary relates to:", "the lungs"),
        ("The combining form angi/o- often relates to:", "vessels"),
        ("A thrombus is best described as:", "a clot attached at its site of formation"),
        ("An embolus is best described as:", "a traveling clot or plug"),
        ("Arrhythmia suggests:", "abnormal heart rhythm"),
        ("The pericardium is:", "around the heart"),
        ("Myocardium refers to:", "heart muscle"),
        ("Endocardium lines:", "the inner heart chambers/valves region"),
        ("Epicardium is associated with:", "outer heart surface layer"),
        ("Hemorrhage means:", "heavy bleeding or abnormal bleeding"),
        ("Edema means:", "swelling from fluid accumulation in tissues"),
        ("Auscultation means:", "listening with a stethoscope"),
        ("Percussion in assessment context often means:", "tapping to elicit sound"),
        ("Orthopnea classically means:", "breathing easier when sitting upright"),
        ("Hemoptysis means:", "coughing up blood"),
        ("Pleurisy relates to:", "pleura inflammation (pain with breathing at student level)"),
        ("Alveoli are best described as:", "tiny air sacs for gas exchange"),
        ("Bronchi are:", "major air passages branching from trachea"),
        ("The trachea is the:", "windpipe"),
        ("Epistaxis means:", "nosebleed"),
        ("Stridor suggests:", "high-pitched upper airway sound"),
        ("Wheezing is commonly associated with:", "narrowed lower airways"),
        ("Inspiration means:", "breathing in"),
        ("Expiration means:", "breathing out"),
        ("Ventilation at student level refers to:", "mechanical movement of air in and out"),
        ("Perfusion at a simple level refers to:", "blood flow through tissues"),
        ("A murmur is:", "an extra heart sound"),
        ("Systole refers to:", "contraction phase of the heart"),
        ("Diastole refers to:", "relaxation/filling phase of the heart"),
        ("Hypertrophy means:", "increase in tissue size (e.g., thickened muscle)"),
        ("Atrophy means:", "decrease in tissue size"),
        ("Ischemia means:", "inadequate blood supply to tissue"),
        ("Infarction at student level means:", "tissue death from lost blood supply"),
        ("Stenosis means:", "narrowing"),
 ]
    pool = [b[1] for b in bank]
    out: list[dict] = []
    for stem, ans in bank:
        w1, w2, w3 = pick_wrong(ans, pool)
        out.append(
            mcq(
                stem,
                ans,
                w1,
                w2,
                w3,
                "A",
                "Matches foundational cardiorespiratory terminology.",
                {"B": "Different definition.", "C": "Different definition.", "D": "Different definition."},
            )
        )
    while len(out) < 45:
        out.append(
            mcq(
                f"Cardiopulmonary term {len(out)}: -pnea in tachypnea relates to:",
                "breathing",
                "heart rate",
                "urine",
                "liver",
                "A",
                "Pnea refers to breathing.",
                {"B": "Cardia relates to heart.", "C": "Uro- relates to urine.", "D": "Hepat- relates to liver."},
            )
        )
    return out[:45]


def gi_urinary_lessons() -> list[dict]:
    return [
        {
            "title": "GI terminology: digestion through elimination",
            "structuredContent": {
                "overview": "GI terms use roots like gastr- (stomach), enter- (intestine), col- (colon), hepat- (liver), cholec- (gall/bile), and emesis (vomiting).",
                "examples": [
                    "Gastritis: stomach inflammation",
                    "Gastroenteritis: stomach and intestine inflammation",
                    "Hepatitis: liver inflammation",
                    "Cholecystitis: gallbladder inflammation",
                    "Dysphagia: difficulty swallowing",
                ],
                "commonMistakes": ["Gastro- vs enter-", "Hepat- vs nephr-"],
                "clinicalRelevanceLight": "Abdominal symptoms and diet orders use this language.",
            },
        },
        {
            "title": "Urinary terminology: filtration to voiding",
            "structuredContent": {
                "overview": "Urinary terms center on nephr- (kidney), ren- (kidney), cyst- (bladder), ureter, urethra, and -uria patterns.",
                "examples": [
                    "Nephrology: kidney study/specialty",
                    "Cystitis: bladder inflammation",
                    "Urethritis: urethra inflammation",
                    "Hematuria: blood in urine",
                    "Polyuria / oliguria: much urine vs scant urine",
                ],
                "commonMistakes": ["Ureter vs urethra", "Cyst- bladder vs other 'cyst' meanings in other contexts"],
                "clinicalRelevanceLight": "I&O and urinalysis reports use these stems.",
            },
        },
    ]


def gi_urinary_questions() -> list[dict]:
    bank = [
        ("Gastritis involves inflammation of the:", "stomach"),
        ("Gastroenteritis involves inflammation of stomach and:", "intestine"),
        ("Hepatitis involves inflammation of the:", "liver"),
        ("Cholecystitis involves inflammation of the:", "gallbladder"),
        ("Dysphagia means:", "difficulty swallowing"),
        ("Emesis means:", "vomiting"),
        ("Melena suggests:", "dark/tarry stools from digested blood (student recognition)"),
        ("Hematochezia suggests:", "bright red blood per rectum (student recognition)"),
        ("The root enter- refers to:", "intestine"),
        ("The root col- or colon refers to:", "large intestine/colon"),
        ("The root hepat- refers to:", "liver"),
        ("The root cholecyst- refers to:", "gallbladder"),
        ("The root gastr- refers to:", "stomach"),
        ("Nephritis involves inflammation of the:", "kidney"),
        ("Cystitis involves inflammation of the:", "bladder"),
        ("Urethritis involves inflammation of the:", "urethra"),
        ("The ureter carries urine from kidney to:", "bladder"),
        ("The urethra carries urine from bladder:", "to outside the body"),
        ("Polyuria means:", "excessive urine output"),
        ("Oliguria means:", "scant urine output"),
        ("Anuria means:", "essentially no urine output"),
        ("Hematuria means:", "blood in the urine"),
        ("Dysuria means:", "painful urination"),
        ("Nephrology relates to:", "kidneys"),
        ("Urology commonly relates to:", "urinary tract and male reproductive (survey level)"),
        ("The nephron is a functional unit of the:", "kidney"),
        ("Urea is classically associated with:", "nitrogenous waste in urine formation (student level)"),
        ("Diuresis means:", "increased urine formation/output"),
        ("Enuresis means:", "involuntary urination (e.g., bedwetting)"),
    ]
    pool = [b[1] for b in bank]
    out: list[dict] = []
    for stem, ans in bank:
        w1, w2, w3 = pick_wrong(ans, pool)
        out.append(
            mcq(
                stem,
                ans,
                w1,
                w2,
                w3,
                "A",
                "Standard GI/urinary word-part meaning.",
                {"B": "Different organ or definition.", "C": "Different organ or definition.", "D": "Different organ or definition."},
            )
        )
    while len(out) < 25:
        out.append(
            mcq(
                f"GI/urinary drill {len(out)}: Pyel- in pyelonephritis commonly relates to:",
                "renal pelvis",
                "stomach",
                "liver",
                "pancreas",
                "A",
                "Pyel- relates to the renal pelvis region.",
                {"B": "Gastr- is stomach.", "C": "Hepat- is liver.", "D": "Pancreat- is pancreas."},
            )
        )
    return out[:25]


def neuro_msk_lessons() -> list[dict]:
    return [
        {
            "title": "Neuro terminology: nerves, brain, and function words",
            "structuredContent": {
                "overview": "Neuro terms combine neur-, encephal-, myel-, mening-, and suffixes like -algia, -paresis, -plegia.",
                "examples": [
                    "Neuralgia: nerve pain",
                    "Encephalitis: brain inflammation",
                    "Meningitis: meninges inflammation",
                    "Hemiparesis: weakness on one side",
                    "Hemiplegia: paralysis on one side",
                ],
                "commonMistakes": ["-paresis vs -plegia", "Mening- vs myel-"],
                "clinicalRelevanceLight": "Neuro checks and handoff language use these stems.",
            },
        },
        {
            "title": "Musculoskeletal terminology: bone, muscle, movement",
            "structuredContent": {
                "overview": "MSK terms use osteo- (bone), myo- (muscle), arthr- (joint), and prefixes like intra- extra- peri-.",
                "examples": [
                    "Arthritis: joint inflammation",
                    "Myalgia: muscle pain",
                    "Osteoporosis: porous bone (student-level)",
                    "Tendon vs ligament: muscle-to-bone vs bone-to-bone",
                ],
                "commonMistakes": ["Arthr- vs arteri-", "Ligament vs tendon attachment pattern"],
                "clinicalRelevanceLight": "Mobility and orthopedic notes reuse this vocabulary.",
            },
        },
    ]


def neuro_msk_questions() -> list[dict]:
    bank = [
        ("Neur/o- refers to:", "nerve"),
        ("Myel/o- commonly refers to:", "spinal cord or bone marrow (context-dependent)"),
        ("Mening/o- refers to:", "meninges"),
        ("Encephal/o- refers to:", "brain"),
        ("Neuralgia means:", "nerve pain"),
        ("Myalgia means:", "muscle pain"),
        ("Arthralgia means:", "joint pain"),
        ("Arthritis means:", "joint inflammation"),
        ("Myositis means:", "muscle inflammation"),
        ("Oste/o- refers to:", "bone"),
        ("Arthr/o- refers to:", "joint"),
        ("A tendon connects muscle to:", "bone"),
        ("A ligament connects bone to:", "bone"),
        ("Hemiparesis means:", "weakness on one side of the body"),
        ("Hemiplegia means:", "paralysis on one side of the body"),
        ("Quadriplegia affects:", "all four limbs"),
        ("Paraplegia typically affects:", "lower limbs/trunk pattern (student level)"),
        ("Dysphasia/aphasia contexts involve:", "speech/language impairment (student recognition)"),
        ("Paresthesia suggests:", "abnormal sensation like tingling"),
        ("Ataxia suggests:", "uncoordinated movement"),
        ("Clonus suggests:", "rhythmic muscle contractions (student recognition)"),
        ("Seizure disorder context may use:", "epilepsy (general term recognition)"),
        ("Subdural refers to:", "below the dura"),
        ("Epidural refers to:", "above/on the dura"),
        ("Osteoporosis at student level means:", "bone density loss/porous bone"),
        ("Osteomyelitis means:", "bone infection"),
        ("Bursitis involves:", "inflammation of a bursa"),
        ("Tenosynovitis involves:", "inflammation of tendon sheath"),
        ("Sprain classically injures:", "ligaments"),
        ("Strain classically injures:", "muscle or tendon"),
    ]
    pool = [b[1] for b in bank]
    out: list[dict] = []
    for stem, ans in bank:
        w1, w2, w3 = pick_wrong(ans, pool)
        out.append(
            mcq(
                stem,
                ans,
                w1,
                w2,
                w3,
                "A",
                "Foundational neuro/MSK term decoding.",
                {"B": "Different structure or meaning.", "C": "Different structure or meaning.", "D": "Different structure or meaning."},
            )
        )
    while len(out) < 25:
        out.append(
            mcq(
                f"Neuro/MSK drill {len(out)}: -plegia refers to:",
                "paralysis",
                "pain",
                "inflammation",
                "enlargement",
                "A",
                "-plegia indicates paralysis.",
                {"B": "-algia is pain.", "C": "-itis is inflammation.", "D": "-megaly is enlargement."},
            )
        )
    return out[:25]


def main() -> None:
    doc = {
        "batchMeta": {
            "blueprintFile": "data/blueprints/foundations/pre-nursing-foundational-blueprint.json",
            "domain": "Medical Terminology",
            "generatedDate": "2026-04-11",
            "sequence": "Blueprint recommendedSequenceOrder 1-6; all topics list word-roots-prefixes-and-suffixes as sole prerequisite except topic 1 (none).",
            "curriculumNotes": [
                "This batch unlocks blueprint prerequisites for organization-of-the-human-body (body-directions, body-cavities) and feeds cardiorespiratory / GI-urinary / neuro-msk terminology into later A&P topics.",
                "Lesson counts follow readinessWeight from the original generation rules: critical word roots = 3 structured lessons (blueprint targetLessonCountMin is 4; add a fourth lesson in a later pass if you need strict blueprint parity); high topics = 2; medium = 2.",
                "All topics are foundational-recall: MCQs test definitions, labeling, and term decoding without clinical judgment scenarios.",
            ],
        },
        "topics": [
            {
                "domain": "Medical Terminology",
                "topicSlug": "word-roots-prefixes-and-suffixes",
                "topicName": "Word Roots, Prefixes, and Suffixes",
                "readinessWeight": "critical",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 50,
                "targetQuestionCountMax": 60,
                "questionsGeneratedThisBatch": 50,
                "prerequisiteTopicSlugs": [],
                "lessons": word_roots_lessons(),
                "questions": word_roots_questions(),
            },
            {
                "domain": "Medical Terminology",
                "topicSlug": "body-directions-and-planes",
                "topicName": "Body Directions and Planes",
                "readinessWeight": "high",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 30,
                "targetQuestionCountMax": 40,
                "questionsGeneratedThisBatch": 30,
                "prerequisiteTopicSlugs": ["word-roots-prefixes-and-suffixes"],
                "lessons": body_directions_lessons(),
                "questions": body_directions_questions(),
            },
            {
                "domain": "Medical Terminology",
                "topicSlug": "body-cavities-and-regions",
                "topicName": "Body Cavities and Regions",
                "readinessWeight": "medium",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 25,
                "targetQuestionCountMax": 35,
                "questionsGeneratedThisBatch": 25,
                "prerequisiteTopicSlugs": ["word-roots-prefixes-and-suffixes"],
                "lessons": body_cavities_lessons(),
                "questions": body_cavities_questions(),
            },
            {
                "domain": "Medical Terminology",
                "topicSlug": "cardiorespiratory-terminology",
                "topicName": "Cardiovascular and Respiratory Terminology",
                "readinessWeight": "high",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 45,
                "targetQuestionCountMax": 55,
                "questionsGeneratedThisBatch": 45,
                "prerequisiteTopicSlugs": ["word-roots-prefixes-and-suffixes"],
                "lessons": cardiorespiratory_lessons(),
                "questions": cardiorespiratory_questions(),
            },
            {
                "domain": "Medical Terminology",
                "topicSlug": "gi-urinary-terminology",
                "topicName": "GI and Urinary Terminology",
                "readinessWeight": "medium",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 25,
                "targetQuestionCountMax": 35,
                "questionsGeneratedThisBatch": 25,
                "prerequisiteTopicSlugs": ["word-roots-prefixes-and-suffixes"],
                "lessons": gi_urinary_lessons(),
                "questions": gi_urinary_questions(),
            },
            {
                "domain": "Medical Terminology",
                "topicSlug": "neurological-musculoskeletal-terminology",
                "topicName": "Neurological and Musculoskeletal Terminology",
                "readinessWeight": "medium",
                "cognitiveLevel": "foundational-recall",
                "targetQuestionCountMin": 25,
                "targetQuestionCountMax": 35,
                "questionsGeneratedThisBatch": 25,
                "prerequisiteTopicSlugs": ["word-roots-prefixes-and-suffixes"],
                "lessons": neuro_msk_lessons(),
                "questions": neuro_msk_questions(),
            },
        ],
        "finalReport": {},
    }
    topics = doc["topics"]
    doc["finalReport"] = {
        "topicsProcessed": 6,
        "lessonsTotal": sum(len(t["lessons"]) for t in topics),
        "questionsTotal": sum(len(t["questions"]) for t in topics),
        "lessonsPerTopic": {t["topicSlug"]: len(t["lessons"]) for t in topics},
        "questionsPerTopic": {t["topicSlug"]: len(t["questions"]) for t in topics},
        "rulesConfirmation": "Prerequisite order respected: word roots first; other five topics depend only on word roots per blueprint. Depth: critical topic has three lessons; high topics have two; medium topics have two. Cognitive level: recall-only items. Each MCQ has rationale and whyIncorrect.",
    }

    for t in topics:
        assert len(t["questions"]) == t["questionsGeneratedThisBatch"]

    out = Path(__file__).with_name("pre-nursing-batch-2-medical-terminology.json")
    out.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out, "questions", doc["finalReport"]["questionsTotal"])


if __name__ == "__main__":
    main()
