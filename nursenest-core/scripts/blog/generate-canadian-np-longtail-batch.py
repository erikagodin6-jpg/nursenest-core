#!/usr/bin/env python3
"""
Deterministic 550-post Canadian NP hybrid static long-tail batch.
Run from nursenest-core/: python3 scripts/blog/generate-canadian-np-longtail-batch.py

26 anchors + 131 (domain x angle) x 4 tracks = 550. Word count >= 1800 (HTML stripped-like).
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "src" / "content" / "blog-static-longtail"
REPORT_DIR = ROOT / "reports"
PUBLISHED = "2026-05-09"
MIN_WORDS = 1800
TARGET_LINKS = 5

TRACKS = [
    ("phc", "PHC NP", "PHC NP", "Primary Health Care NP"),
    ("adult", "Adult NP", "Adult NP", "Adult NP"),
    ("family", "Family NP", "Family NP", "Family NP"),
    ("general", "General NP", "General NP", "Canadian NP"),
]

DOMAINS = [
    ("cardiovascular", "Cardiovascular", "Cardiovascular"),
    ("endocrine-metabolic", "Endocrine and metabolic", "Endocrine"),
    ("respiratory", "Respiratory", "Respiratory"),
    ("renal-fluid-electrolyte", "Renal, fluid, and electrolyte", "Renal"),
    ("gastrointestinal", "Gastrointestinal", "Gastrointestinal"),
    ("neurology", "Neurology", "Neurology"),
    ("hematology-hemostasis", "Hematology and hemostasis", "Hematology"),
    ("infectious-disease", "Infectious disease", "Infectious Disease"),
    ("musculoskeletal", "Musculoskeletal", "Musculoskeletal"),
    ("mental-health-addictions", "Mental health and substance use", "Mental Health"),
    ("womens-sexual-health", "Women's and sexual health", "Women's Health"),
    ("paediatric", "Paediatric", "Paediatrics"),
    ("geriatric", "Geriatric", "Geriatrics"),
    ("palliative-symptom", "Palliative and symptom management", "Palliative Care"),
    ("dermatology", "Dermatology", "Dermatology"),
    ("ent-allergy", "ENT and allergy", "ENT"),
    ("ophthalmology", "Ophthalmology", "Ophthalmology"),
    ("emergency-urgent", "Emergency and urgent ambulatory", "Emergency"),
    ("occupational-disability", "Occupational and disability documentation", "Primary Care"),
    ("travel-public-health", "Travel and public health", "Public Health"),
    ("primary-care-organization", "Primary care organization and access", "Primary Care"),
    ("indigenous-cultural-safety", "Indigenous health and cultural safety", "Population Health"),
    ("population-prevention", "Population health and prevention", "Population Health"),
    ("legal-ethical", "Legal, ethical, and regulatory literacy", "Professional Practice"),
    ("pharmacology-stewardship", "Pharmacology and stewardship", "Pharmacology"),
]

ANGLES = [
    ("differential-diagnosis", "differential diagnosis and clinical reasoning"),
    ("prescribing-safety-documentation", "prescribing safety, documentation, and audit readiness"),
    ("labs-imaging-interpretation", "laboratory and imaging interpretation in primary care"),
    ("chronic-management-ebp", "chronic disease management aligned with Canadian EBP summaries"),
    ("red-flags-escalation", "red flags, escalation, and safe handoff"),
    ("patient-education-shared-decision", "patient education and shared decision-making"),
    ("multimorbidity-polypharmacy", "multimorbidity and polypharmacy"),
    ("telehealth-hybrid-care", "telehealth and hybrid ambulatory models"),
    ("interprofessional-collaboration", "interprofessional collaboration"),
    ("quality-safety-qi", "quality improvement and safety science"),
]

APA_REFS = [
    "Hypertension Canada. (2024). Hypertension Canada guideline resources (educational overview). https://hypertension.ca/",
    "Diabetes Canada. (2023). Clinical practice guidelines (public guideline hub). https://www.diabetes.ca/clinical-practice-guidelines",
    "Canadian Paediatric Society. (2024). Practice points and position statements (index). https://cps.ca/en/documents/",
    "Registered Nurses' Association of Ontario. (2024). Best practice guidelines (public catalogue). https://rnao.ca/bpg",
    "CADTH. (2025). Evidence products and rapid reviews (public site). https://www.cadth.ca/",
    "Health Canada. (2024). Drugs and health products — information for health professionals (navigation hub). https://www.canada.ca/en/health-canada/services/drugs-health-products.html",
    "Government of Canada. (2025). Controlled Drugs and Substances Act (public statute text for legal literacy). https://laws-lois.justice.gc.ca/eng/acts/C-38.8/",
]


def theme_pairs() -> list[tuple[int, int]]:
    out: list[tuple[int, int]] = []
    for d in range(len(DOMAINS)):
        for a in range(len(ANGLES)):
            out.append((d, a))
            if len(out) >= 131:
                return out
    raise RuntimeError("not enough domain/angle pairs")


def count_words_html(html: str) -> int:
    plain = re.sub(r"<[^>]+>", " ", html)
    plain = re.sub(r"\s+", " ", plain).strip()
    return len(plain.split()) if plain else 0


def h(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


@dataclass
class Topic:
    slug: str
    title: str
    excerpt: str
    seo_title: str
    seo_description: str
    category: str
    tags: list[str]
    track_label: str
    focus_line: str
    anchor: bool


def anchor_topics() -> list[Topic]:
    raw: list[tuple[str, str, str, str, str, list[str], str]] = [
        (
            "canadian-np-anchor-provincial-college-verification-educational",
            "Provincial and territorial NP regulation in Canada: educational overview and college verification habits",
            "International English overview of how Canadian nurse practitioner students should think about provincial and territorial regulatory colleges, scope, and documentation without substituting for college policy.",
            "Professional Practice",
            ["Canadian NP", "Regulation", "NP licensing", "PHC NP", "EBP"],
            "General NP",
            "Regulatory literacy for Canadian advanced practice nursing begins with naming the correct college for the jurisdiction and reading current standards rather than relying on informal summaries.",
        ),
        (
            "canadian-np-anchor-phc-primary-care-access-panel-continuity",
            "PHC NP longitudinal panels in Canada: continuity, access, and accountable prescribing culture",
            "Primary health care nurse practitioner students learn how panel awareness, continuity relationships, and accountable prescribing documentation support safer ambulatory care in Canadian contexts.",
            "Primary Care",
            ["PHC NP", "Canadian NP", "Primary care", "NP licensing", "EBP"],
            "PHC NP",
            "Panel-based primary care rewards systems thinking: who is overdue, who is unstable, and which medication changes require explicit safety nets.",
        ),
        (
            "canadian-np-anchor-adult-ambiguous-chest-pain-office-triage",
            "Ambiguous chest pain in adult ambulatory care: Canadian NP triage, risk stratification, and escalation",
            "Adult NP educational review for stable-appearing chest discomfort in primary care, emphasizing Canadian cardiovascular risk context, shared decision-making, and safe escalation.",
            "Cardiovascular",
            ["Adult NP", "Canadian NP", "Cardiovascular", "Clinical reasoning", "EBP"],
            "Adult NP",
            "Chest pain questions in advanced practice exams reward structured risk stratification, ECG literacy, and explicit safety-netting rather than premature reassurance.",
        ),
        (
            "canadian-np-anchor-family-paediatric-fever-infant-young-child",
            "Fever in infants and young children: family NP red flags, caregiver education, and Canadian guideline literacy",
            "Family NP preparation article on fever in young children with emphasis on caregiver counselling, safety-netting, and when urgent assessment is non-negotiable.",
            "Paediatrics",
            ["Family NP", "Canadian NP", "Paediatrics", "Patient education", "EBP"],
            "Family NP",
            "Young-child fever is as much a communication and safety-netting problem as a temperature threshold problem.",
        ),
        (
            "canadian-np-anchor-controlled-substances-documentation-educational",
            "Controlled substances and narcotic prescribing documentation: Canadian educational framing for NPs",
            "Non-exhaustive educational overview of federal scheduling literacy, provincial documentation expectations, and why nurse practitioners must verify local rules with their college.",
            "Pharmacology",
            ["Canadian NP", "Prescribing", "NP licensing", "Pharmacology", "EBP"],
            "General NP",
            "Documentation for controlled substances should make indication, benefit-risk discussion, monitoring plan, and follow-up obligations legible to any colleague who opens the chart.",
        ),
        (
            "canadian-np-anchor-maid-awareness-primary-care-interprofessional",
            "Medical assistance in dying (MAID) awareness for Canadian primary care NPs: ethics, scope, and team roles",
            "High-level educational awareness piece for advanced practice learners about interprofessional roles, consent themes, and jurisdictional variability without providing procedural instruction.",
            "Professional Practice",
            ["Canadian NP", "Ethics", "Primary care", "Interprofessional", "EBP"],
            "PHC NP",
            "Exam preparation rewards respectful language, clarity about scope boundaries, and recognition that processes differ by province and territory.",
        ),
        (
            "canadian-np-anchor-cultural-safety-indigenous-health-primary-care",
            "Cultural safety and Indigenous health in Canadian NP practice: relationship, humility, and system accountability",
            "Educational synthesis for nurse practitioner students linking cultural humility, structural competency, and primary care quality improvement without reducing content to checklist tokenism.",
            "Population Health",
            ["Canadian NP", "Cultural safety", "Primary care", "EBP", "Population health"],
            "PHC NP",
            "Cultural safety is an ongoing practice of accountability and relationship, not a one-time training certificate.",
        ),
        (
            "canadian-np-anchor-hypertension-canada-bp-measurement-home-monitoring",
            "Hypertension Canada-aligned blood pressure measurement: office, home, and masked hypertension reasoning for NPs",
            "Clinical reasoning article for Canadian NP learners on accurate BP measurement, out-of-office monitoring, and how guideline literacy supports diagnosis and follow-up planning.",
            "Cardiovascular",
            ["Canadian NP", "Hypertension", "EBP", "PHC NP", "Clinical reasoning"],
            "PHC NP",
            "Hypertension diagnosis and management quality is often limited by measurement technique before it is limited by pharmacology knowledge.",
        ),
        (
            "canadian-np-anchor-diabetes-canada-type-2-cardiorenal-risk",
            "Type 2 diabetes in Canada: cardiorenal risk framing, guideline hubs, and NP-led follow-up structures",
            "Advanced practice educational synthesis on glycemic targets as only one axis of diabetes care, with emphasis on ASCVD, heart failure, and kidney protection themes common in Canadian exams.",
            "Endocrine",
            ["Canadian NP", "Diabetes", "EBP", "Adult NP", "Cardiorenal"],
            "Adult NP",
            "Modern diabetes care in primary care is increasingly organized around organ protection and patient-centered targets rather than a single A1c number in isolation.",
        ),
        (
            "canadian-np-anchor-mental-health-ssri-initiation-safety",
            "SSRI initiation in ambulatory mental health: Canadian NP monitoring, adverse effects, and escalation thresholds",
            "Educational psychopharmacology review for nurse practitioner students covering activation, GI tolerability, hyponatremia risk in older adults, bleeding interactions, and serotonin syndrome cues.",
            "Mental Health",
            ["Canadian NP", "Mental health", "Pharmacology", "Adult NP", "EBP"],
            "Adult NP",
            "SSRI questions often test whether you can pair initiation with follow-up timing, adverse-effect surveillance, and clear patient safety-netting.",
        ),
        (
            "canadian-np-anchor-deprescribing-polypharmacy-beers-context",
            "Deprescribing and polypharmacy in older adults: Beers-adjacent reasoning with Canadian formulary and team realities",
            "Geriatric pharmacology educational article emphasizing gradual taper plans, anticholinergic burden concepts, falls risk, and interprofessional collaboration with pharmacy colleagues.",
            "Geriatrics",
            ["Canadian NP", "Geriatrics", "Pharmacology", "EBP", "PHC NP"],
            "PHC NP",
            "Deprescribing is a structured reduction of harm risk, not an abrupt stop of every sedating medication on the list.",
        ),
        (
            "canadian-np-anchor-anticoagulation-af-stroke-prevention-choice",
            "Atrial fibrillation stroke prevention: anticoagulation choice literacy for Canadian adult NPs",
            "Educational comparison framing for stroke risk tools, bleeding risk awareness, renal implications, and direct oral anticoagulant versus warfarin themes without product-specific dosing advice.",
            "Cardiovascular",
            ["Canadian NP", "Anticoagulation", "Adult NP", "EBP", "Cardiovascular"],
            "Adult NP",
            "AF management questions reward matching bleeding and thrombotic risk to follow-up intensity and therapy class themes at an educational level.",
        ),
        (
            "canadian-np-anchor-copd-exacerbation-ambulatory-management",
            "COPD exacerbation in ambulatory care: Canadian NP recognition, steroid themes, antibiotic stewardship, and follow-up",
            "Respiratory educational article on exacerbation triggers, inhaler optimization, oxygen safety language, and when emergency referral is mandatory.",
            "Respiratory",
            ["Canadian NP", "COPD", "Respiratory", "EBP", "PHC NP"],
            "PHC NP",
            "COPD exacerbation care balances prompt symptom relief with stewardship and early recognition of impending respiratory failure.",
        ),
        (
            "canadian-np-anchor-hfref-four-pillar-therapy-primary-care",
            "HFrEF four-pillar therapy in primary care: Canadian NP pathophysiology, monitoring, and patient counselling",
            "Heart failure educational synthesis connecting RAAS inhibition, evidence-informed add-on classes, symptom monitoring, and laboratory safety nets at an advanced practice depth.",
            "Cardiovascular",
            ["Canadian NP", "Heart failure", "Adult NP", "EBP", "Cardiovascular"],
            "Adult NP",
            "HFrEF management is longitudinal titration with toxicity monitoring, not a single visit prescription event.",
        ),
        (
            "canadian-np-anchor-ckd-egfr-acr-raas-primary-care",
            "CKD staging with eGFR and albuminuria: Canadian NP primary care actions, RAAS themes, and referral triggers",
            "Renal educational article on CKD recognition in diabetes and hypertension, risk stratification using albuminuria, and safe prescribing awareness as kidney function changes.",
            "Renal",
            ["Canadian NP", "CKD", "Renal", "EBP", "PHC NP"],
            "PHC NP",
            "CKD is frequently under-recognized in ambulatory panels until complications appear; systematic urine albumin screening is part of high-quality diabetes and hypertension care.",
        ),
        (
            "canadian-np-anchor-contraception-counselling-shared-decision",
            "Contraception counselling as advanced practice: Canadian NP shared decision-making, contraindications literacy, and follow-up",
            "Women's health educational article on counselling structure, medical eligibility literacy at a high level, and documentation habits that support safe prescribing.",
            "Women's Health",
            ["Canadian NP", "Women's health", "Family NP", "EBP", "Patient education"],
            "Family NP",
            "Contraception visits are safety-critical prescribing encounters disguised as routine primary care.",
        ),
        (
            "canadian-np-anchor-geriatric-frailty-falls-syncope",
            "Geriatric frailty, falls, and syncope: Canadian NP office workup, medication review, and home safety",
            "Geriatrics educational synthesis on orthostatic vital signs, gait and balance, vision and footwear, and medication contributors with interprofessional referral patterns.",
            "Geriatrics",
            ["Canadian NP", "Geriatrics", "EBP", "PHC NP", "Adult NP"],
            "PHC NP",
            "Falls are often multifactorial; the exam rewards a structured search for reversible contributors rather than a single magic test.",
        ),
        (
            "canadian-np-anchor-palliative-breathlessness-primary-care",
            "Breathlessness in serious illness: Canadian NP palliative symptom framing in primary care boundaries",
            "Palliative educational article on total symptom assessment, oxygen myth-busting at an educational level, opioid-sparing adjunct themes, and interprofessional hospice interfaces without dosing protocols.",
            "Palliative Care",
            ["Canadian NP", "Palliative", "Respiratory", "EBP", "PHC NP"],
            "PHC NP",
            "Breathlessness in advanced illness requires clarifying trajectory, treatable contributors, and patient goals before focusing on a single medication class.",
        ),
        (
            "canadian-np-anchor-antimicrobial-stewardship-uri-educational",
            "Antimicrobial stewardship for common infections: Canadian NP delayed prescribing, safety-netting, and patient explanations",
            "Infectious disease educational content on viral illness counselling, watchful waiting themes, and documentation that supports appropriate antibiotic use.",
            "Infectious Disease",
            ["Canadian NP", "Antibiotics", "EBP", "PHC NP", "Family NP"],
            "Family NP",
            "Stewardship is communicated through empathy and timelines, not through scolding patients for seeking care.",
        ),
        (
            "canadian-np-anchor-travel-vaccine-pretravel-counselling",
            "Travel health in Canadian primary care: vaccine literacy, outbreak awareness, and documentation for NPs",
            "Travel medicine educational overview for nurse practitioner students on itinerary risk triage, vaccine record review, and referral to travel clinics when complexity exceeds primary care scope.",
            "Public Health",
            ["Canadian NP", "Travel", "Immunization", "EBP", "PHC NP"],
            "PHC NP",
            "Travel visits are risk triage encounters: the goal is to identify who needs specialist travel medicine and who can be managed in primary care with good documentation.",
        ),
        (
            "canadian-np-anchor-occupational-disability-forms-educational",
            "Occupational forms and disability documentation: Canadian NP educational boundaries, objectivity, and consent",
            "Professional practice educational article on functional assessment language, avoiding speculation beyond chart evidence, and jurisdictional variability for forms completion.",
            "Professional Practice",
            ["Canadian NP", "Documentation", "NP licensing", "EBP", "General practice"],
            "General NP",
            "Form completion questions test whether documentation is factual, bounded, and aligned with what you actually assessed.",
        ),
        (
            "canadian-np-anchor-exam-clinical-reasoning-prep-educational",
            "Canadian NP licensing preparation as clinical reasoning training: vignette discipline, time management, and safety habits",
            "Meta-educational article on how to study for Canadian NP examinations using structured differential diagnosis, red-flag scanning, and scope-safe answer patterns.",
            "Professional Practice",
            ["Canadian NP", "NP licensing", "Exam preparation", "Clinical reasoning", "EBP"],
            "General NP",
            "Exam performance improves when you rehearse explicit algorithms for instability, not when you accumulate passive reading hours alone.",
        ),
        (
            "canadian-np-anchor-echo-collaborative-care-models",
            "Project ECHO-style collaborative care in Canada: Canadian NP roles in telementoring and primary care capacity building",
            "Educational overview of hub-and-spoke learning models, case-based telementoring ethics, and how advanced practice nurses participate in interprofessional education.",
            "Primary Care",
            ["Canadian NP", "Interprofessional", "EBP", "PHC NP", "Education"],
            "PHC NP",
            "ECHO models scale specialist knowledge into primary care through case-based learning rather than through informal curbside alone.",
        ),
        (
            "canadian-np-anchor-qi-pdsa-access-improvement",
            "Quality improvement for access and safety: Canadian NP PDSA cycles in primary care teams",
            "QI educational article on small tests of change, measurement definitions, run charts at a literacy level, and ethical improvement work that includes patient partners.",
            "Primary Care",
            ["Canadian NP", "Quality improvement", "EBP", "PHC NP", "Leadership"],
            "PHC NP",
            "QI is disciplined experimentation: define the problem numerically, change one lever, measure, and iterate.",
        ),
        (
            "canadian-np-anchor-interprofessional-boundaries-collaboration",
            "Interprofessional boundaries for Canadian NPs: collaboration with physicians, pharmacists, and allied health without role confusion",
            "Professional practice educational synthesis on clear communication, consultative relationships, and conflict de-escalation when scope questions arise.",
            "Professional Practice",
            ["Canadian NP", "Interprofessional", "EBP", "NP licensing", "Leadership"],
            "General NP",
            "Advanced practice nursing is team-based; excellence is visible in handoffs, respectful consult questions, and shared care plans.",
        ),
        (
            "canadian-np-anchor-emr-documentation-audit-readiness",
            "EMR documentation and audit readiness for Canadian NPs: problem-oriented notes, billing-adjacent clarity, and privacy",
            "Educational article on structured assessment documentation, differential documentation habits, follow-up accountability, and privacy obligations at a high level.",
            "Professional Practice",
            ["Canadian NP", "Documentation", "EBP", "NP licensing", "Health informatics"],
            "General NP",
            "Good notes tell the story of clinical reasoning so another clinician can safely continue care tomorrow.",
        ),
    ]
    if len(raw) != 26:
        raise RuntimeError(f"expected 26 anchors, got {len(raw)}")
    topics: list[Topic] = []
    for slug, title, excerpt, cat, tags, track, focus in raw:
        topics.append(
            Topic(
                slug=slug,
                title=title,
                excerpt=excerpt,
                seo_title=(title[:72] + " | NurseNest"),
                seo_description=excerpt[:158],
                category=cat,
                tags=tags,
                track_label=track,
                focus_line=focus,
                anchor=True,
            )
        )
    return topics


def expansion_topics() -> list[Topic]:
    pairs = theme_pairs()
    topics: list[Topic] = []
    for tr_slug, tr_label, track_tag, tag_extra in TRACKS:
        for d, a in pairs:
            dom_slug, dom_title, cat = DOMAINS[d]
            ang_slug, ang_title = ANGLES[a]
            slug = f"canadian-np-{tr_slug}-{dom_slug}-{ang_slug}"
            title = f"{dom_title} for Canadian {tr_label} practice: {ang_title[:1].upper() + ang_title[1:]}"
            excerpt = (
                f"Educational deep dive for Canadian nurse practitioner students and licensing preparation, framed for {tr_label} learners with emphasis on {ang_title}, "
                f"{dom_title.lower()} pathophysiology, and evidence-informed primary care reasoning. Verify scope, documentation rules, and formulary constraints with your provincial or territorial regulatory college."
            )
            topics.append(
                Topic(
                    slug=slug,
                    title=title,
                    excerpt=excerpt,
                    seo_title=title[:72] + " | NurseNest",
                    seo_description=excerpt[:158],
                    category=cat,
                    tags=[track_tag, "Canadian NP", "NP licensing", cat, "EBP", "Clinical reasoning"],
                    track_label=track_tag,
                    focus_line=(
                        f"This installment anchors advanced practice nursing reasoning in {dom_title.lower()} while foregrounding {ang_title} for {tr_label} contexts across Canada."
                    ),
                    anchor=False,
                )
            )
    if len(topics) != 524:
        raise RuntimeError(f"expected 524 expansions, got {len(topics)}")
    return topics


def pick_links(self_slug: str, pool: list[str], k: int) -> list[str]:
    others = [s for s in pool if s != self_slug]
    out: list[str] = []
    step = 37 + (k % 11)
    idx = k % len(others)
    guard = 0
    while len(out) < TARGET_LINKS and others:
        s = others[idx]
        if s not in out:
            out.append(s)
        idx = (idx + step) % len(others)
        guard += 1
        if guard > len(others) * 3:
            break
    return out[:TARGET_LINKS]


def slug_to_title(slug: str, m: dict[str, Topic]) -> str:
    t = m.get(slug)
    return t.title if t else slug.replace("-", " ")


def faq_block(province_note: str) -> list[tuple[str, str]]:
    return [
        (
            "Is this article a substitute for my provincial regulatory college standards?",
            f"No. This is educational exam preparation and clinical reasoning practice. {province_note}",
        ),
        (
            "How should Canadian NP students use guideline hubs responsibly?",
            "Use Diabetes Canada, Hypertension Canada, CPS, RNAO, CADTH, and Health Canada pages as starting points, then read the primary guideline sections relevant to your patient context and local formulary.",
        ),
        (
            "Why does this article emphasize documentation and safety netting?",
            "Canadian advanced practice assessments often reward structured follow-up, explicit red-flag counselling, and charting that makes clinical reasoning auditable to another clinician.",
        ),
        (
            "Does NurseNest replace individualized preceptorship?",
            "No. Preceptorship, college policy, and institutional order sets remain authoritative for your practice as a learner or registrant.",
        ),
    ]


def build_body(t: Topic, internal_slugs: list[str], m: dict[str, Topic]) -> str:
    province_note = (
        "Scope, prescribing rules, billing-related documentation expectations, and title protection differ by province and territory; "
        "confirm current standards directly with your regulatory college."
    )
    faq_html = "".join(f"<h3>{h(q)}</h3>\n<p>{h(a)}</p>\n" for q, a in faq_block(province_note))
    links_html = "".join(
        f'<li><a href="/blog/{h(s)}">{h(slug_to_title(s, m))}</a></li>\n' for s in internal_slugs
    )
    refs_html = "".join(f"<p>{h(r)}</p>\n" for r in APA_REFS)

    parts = [
        f"""<h2>Introduction</h2>
<p>{h(t.excerpt)} This resource is written in international English for translation-friendly study workflows. It is designed for nurse practitioner students and licensing-oriented learners in Canada who want depth in advanced practice nursing, clinical reasoning, and evidence-informed primary care habits.</p>
<p>Throughout, maintain a disciplined habit: when a clinical recommendation could change by jurisdiction, formulary, or college standard, pause and verify rather than memorizing a single national shortcut. {h(province_note)}</p>
<p>{h(t.focus_line)}</p>""",
        """<h2>Key takeaways</h2>
<ul>
<li>Anchor decisions in pathophysiology first, then map findings to a prioritized differential diagnosis that fits the chief concern and risk context.</li>
<li>Separate educational overview from individualized medical advice; this article supports exam preparation and structured reasoning, not bedside orders.</li>
<li>Use Canadian guideline hubs and professional society resources as evidence anchors while recognizing that exam items often test safe processes, follow-up, and documentation.</li>
<li>Prescribing safety includes indication clarity, monitoring plans, drug interaction surveillance, renal and hepatic adjustment literacy, and explicit patient counselling about red flags.</li>
<li>Interprofessional collaboration and clear handoffs are part of advanced practice quality, not an add-on after the clinical plan is finished.</li>
</ul>""",
        f"""<h2>Why this matters for Canadian NP exams and licensing preparation</h2>
<p>Canadian nurse practitioner preparation pathways reward integration: pathophysiology, pharmacology, diagnostics, communication, ethics, and systems thinking in the same vignette. Questions often embed primary care ambiguity, where the stem is intentionally incomplete and the best answer demonstrates safe next steps, follow-up timing, and appropriate consultation boundaries.</p>
<p>For {h(t.track_label)} learners, the highest-yield habit is to read for instability before reading for diagnosis labels. If the patient is deteriorating, the answer cluster that prioritizes assessment, escalation, and resuscitation-adjacent support will dominate. If the patient is stable, shared decision-making, counselling, preventive planning, and documentation themes become more prominent.</p>
<p>Licensing preparation also rewards regulatory literacy at an educational level: knowing that colleges govern scope and conduct, knowing that federal and provincial layers interact for controlled substances, and knowing that you must verify local expectations rather than importing assumptions from other countries.</p>""",
        f"""<h2>Advanced pathophysiology (educational synthesis)</h2>
<p>This section names mechanisms in plain language so you can defend a differential in an exam stem or a structured oral examination. Start by identifying the primary organ system and the compensatory responses that attempt to restore homeostasis. Then ask what breaks first when compensation fails, because that is usually where red-flag escalation belongs.</p>
<p>For the topic "{h(t.title)}", connect tissue-level changes to symptoms, physical examination cues, and the laboratory patterns you would expect when compensation is intact versus when it is not. When multiple chronic conditions coexist, explain how one disease modifies the expression of another (for example, how autonomic neuropathy changes hypoglycemia awareness, or how CKD changes drug clearance and electrolyte risk).</p>
<p>Advanced practice depth means you can explain not only what changes, but why the change produces risk: thrombotic risk, arrhythmia risk, neurologic injury risk, renal progression risk, or hemorrhagic risk depending on context. That risk language is what makes pathophysiology usable for prescribing safety and for patient education.</p>""",
        """<h2>Differential diagnosis (structured, non-exhaustive)</h2>
<p>Build differentials as tiers: common mimics, dangerous must-not-miss diagnoses, and context-specific contributors tied to medications, pregnancy status, age, immune compromise, occupational exposures, travel, and recent procedures. For each tier, name the discriminating features you would seek on history, examination, and targeted testing rather than ordering broad panels by default.</p>
<p>In primary care vignettes, the exam often rewards parsimony: choose the next test that changes management fastest while keeping patient burden and false-positive risk in view. When a specialty referral is appropriate, the best answer may be referral plus interim safety measures rather than attempting definitive specialty management in isolation.</p>
<p>When two diagnoses remain plausible, document your working diagnosis, what would change your mind, and the timeline for reassessment. That is both safe practice and a common communication objective in advanced practice assessments.</p>""",
        """<h2>Workup and monitoring (primary care framing)</h2>
<p>Organize workup into baseline stability assessment, focused diagnostics aligned with the differential, and monitoring that matches therapy risk. Monitoring includes scheduled follow-up visits, patient-reported outcomes where appropriate, laboratory cadence tied to medication initiation, and safety-net instructions for symptoms that should trigger earlier reassessment or emergency care.</p>
<p>For Canadian contexts, monitoring plans should remain compatible with access realities: who can return for vitals, who can access community laboratories reliably, and what backup plan exists if the patient cannot reach the clinic quickly. Those social and logistical determinants are increasingly visible in licensing scenarios that test whole-person care, not laboratory values alone.</p>""",
        """<h2>Laboratory and imaging interpretation (EBP-aligned habits)</h2>
<p>Interpret tests as answers to explicit questions, not as fishing expeditions. Before ordering, name what result would increase concern, what result would reduce concern, and what you would do differently based on each direction. This habit prevents unnecessary testing and improves patient trust.</p>
<p>For imaging, emphasize radiation risk literacy, incidentaloma caution, and the value of shared decision-making when multiple reasonable strategies exist. For laboratory interpretation, emphasize trend interpretation, appropriate reference-interval caveats, and pre-analytic error sources such as hemolysis or timing relative to medication doses.</p>""",
        """<h2>Pharmacologic management (educational themes, not individualized prescribing)</h2>
<p>Pharmacology questions for advanced practice learners often test monitoring, contraindications, interaction mechanisms, renal and hepatic adjustment literacy, and deprescribing judgment. When a stem includes pregnancy, breastfeeding intent, age extremes, polypharmacy, or organ impairment, expect the safest answer to incorporate those modifiers explicitly.</p>
<p>Where Canadian guideline hubs exist for the condition family you are studying, use them to organize first-line versus add-on therapy themes and to organize follow-up testing cadence. Do not treat any public article as a dosing authority; dosing belongs to product monographs, institutional protocols, and individualized medical judgment.</p>""",
        """<h2>Nonpharmacologic management and behavioural counselling</h2>
<p>Nonpharmacologic care includes nutrition patterns, physical activity prescriptions aligned to ability, sleep optimization, substance use counselling, smoking cessation, stress reduction, and occupational adaptations. For many chronic diseases, behaviour change is not adjunctive; it is foundational to outcomes and medication effectiveness.</p>
<p>Counselling that works is specific, prioritized, and negotiated. Choose one or two behaviour targets per visit, connect them to patient goals, and document the plan in language the patient can repeat back accurately.</p>""",
        """<h2>Red flags, escalation, and safe disposition</h2>
<p>Red flags exist to protect patients from silent deterioration. Teach patients which symptoms should prompt emergency evaluation, which symptoms should prompt same-day clinic contact, and which symptoms can be monitored with a defined recheck window. Red flag counselling should be documented explicitly because it is a standard of safe primary care communication.</p>
<p>Escalation includes activating emergency services, arranging urgent specialist consultation, directing to emergency department when outpatient workup cannot complete quickly enough, and using team resources such as rapid-access clinics when available. The exam rewards recognizing when outpatient management is no longer responsible.</p>""",
        """<h2>Evidence-based practice synopsis</h2>
<p>EBP in Canadian advanced practice nursing integrates guideline summaries, critically appraised systematic reviews, local formulary constraints, patient values, and feasibility. CADTH products can help teams understand comparative effectiveness and implementation considerations, while clinical societies publish condition-specific guidance that anchors day-to-day primary care decisions.</p>
<p>RNAO best practice guidelines can also support nursing-sensitive interventions, organizational quality, and person-centered care processes. Use these resources to build structured teaching points and to prepare for questions that ask you to justify a plan with guideline-consistent rationale at a high level.</p>""",
        """<h2>Patient education and teach-back</h2>
<p>Patient education should translate medical concepts into actionable behaviors, warning signs, medication purpose, and what to do if a dose is missed. Teach-back is a safety practice: ask patients to restate the plan in their own words and correct misunderstandings before they leave the encounter.</p>
<p>For multilingual patients and for families supporting older adults, document interpreter use accurately and ensure written materials match literacy needs. Translation-friendly international English in your notes also supports safer transitions between providers.</p>""",
        """<h2>Prescribing safety in Canada (educational overview)</h2>
<p>Prescribing safety includes indication documentation, allergy documentation, start-low-go-slow habits where appropriate, monitoring for adverse drug reactions, and explicit review of sedating medications in fall-prone patients. For controlled substances, educational programs emphasize boundaries, audit readiness, and non-stigmatizing care for patients with pain and substance use disorder risk.</p>
<p>Because federal and provincial frameworks interact, verify storage, transmission, and prescription format requirements with authoritative college guidance rather than assuming cross-border equivalence.</p>""",
        """<h2>Exam traps and misleading distractors</h2>
<ul>
<li>Choosing a correct fact that does not address the immediate risk in the stem.</li>
<li>Ordering broad testing before stabilizing or before explaining what result changes management.</li>
<li>Ignoring renal function, pregnancy status, or drug interactions when selecting therapy.</li>
<li>Confusing educational overview with a directive to act outside scope or without orders.</li>
<li>Forgetting follow-up timing and safety-netting language after initiating a higher-risk medication.</li>
</ul>""",
        """<h2>Memorization pearls that still respect clinical nuance</h2>
<ul>
<li>Instability first: airway, breathing, circulation, altered mentation, sepsis suspicion, and hemorrhage trump almost everything else.</li>
<li>Trend beats snapshot: one normal value rarely outweighs a worsening clinical trajectory.</li>
<li>Scope-safe answers escalate, notify, collaborate, and document rather than improvising unsupervised high-risk changes.</li>
<li>Canadian exams often embed accountability: what you would chart, what you would teach, and when you would refer.</li>
</ul>""",
        f"""<h2>Clinical reasoning expansion</h2>
<p>To strengthen advanced practice depth, rehearse a five-step loop: (1) summarize the case in one sentence, (2) list the top three differentials with a discriminating feature for each, (3) name the next two investigations and what each rules in or out, (4) state monitoring for the top therapy risk, and (5) document patient-centred follow-up. Repeating this loop across {h(t.track_label)} scenarios builds exam speed without encouraging brittle memorization.</p>
<h2>Canadian systems and continuity themes</h2>
<p>Canadian primary care operates within varied provincial models, team compositions, and access constraints. Questions may test whether you can design follow-up that is realistic for a patient who cannot easily return tomorrow. That includes phone follow-up where appropriate, delegated tasks within scope, pharmacist collaboration for titration where locally supported, and explicit timelines for reassessment.</p>
<h2>Communication scripts for difficult conversations</h2>
<p>Advanced practice nursing includes delivering uncertainty without false reassurance. Practice a script that names what is known, what is unknown, what you will do next, and what should prompt urgent return. This communication pattern is frequently tested as an ethical and safety competency, not only as a counselling nicety.</p>
<h2>Equity-oriented history and examination habits</h2>
<p>Equity-oriented care includes asking about barriers to medications, transportation, food security, caregiver strain, and occupational demands that affect recovery. These factors change disposition, follow-up intensity, and the feasibility of monitoring plans. Licensing preparation increasingly rewards whole-person reasoning rather than organ-silo thinking alone.</p>
<h2>Documentation anchors that survive handoffs</h2>
<p>Write so the next clinician can continue safely: working diagnosis, differential considerations briefly listed, data reviewed, decisions made, monitoring plan, red flags discussed, and follow-up timing. This is also how you should study: if you cannot document the plan cleanly, you have not finished understanding the topic.</p>""",
        f"""<h2>Internal links</h2>
<ul>
{links_html}<li><a href="/app/dashboard">NurseNest learner dashboard</a></li>
<li><a href="/ca/np/cnple/lessons">Canadian NP pathway lessons hub</a> (where available in your study plan)</li>
</ul>""",
        """<h2>Premium CTA</h2>
<p>Build this topic into a deliberate study loop inside NurseNest: pair long-form reading with spaced practice, then return to the same topic after a short delay to test whether you can reproduce the differential, monitoring plan, and patient counselling script without notes.</p>""",
        f"<h2>FAQ schema questions</h2>\n{faq_html}",
        f"""<h2>APA-7 references (public sources; verify citations at time of use)</h2>
{refs_html}
<p>Additional educational navigation: Canadian Nurses Association advanced practice nursing overview pages (verify current URL in your institution library catalogue).</p>""",
    ]
    return "\n\n".join(parts)


def frontmatter(t: Topic) -> str:
    tags = ", ".join(t.tags)
    return f"""---
slug: {t.slug}
title: {t.title}
excerpt: {t.excerpt}
category: {t.category}
tags: {tags}
publishedAt: {PUBLISHED}
updatedAt: {PUBLISHED}
draft: false
seoTitle: {t.seo_title}
seoDescription: {t.seo_description}
canonicalUrl: /blog/{t.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports educational exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.
---

"""


def main() -> None:
    anchors = anchor_topics()
    expansions = expansion_topics()
    all_topics = anchors + expansions
    if len(all_topics) != 550:
        raise RuntimeError(f"expected 550, got {len(all_topics)}")
    slugs = [t.slug for t in all_topics]
    if len(set(slugs)) != len(slugs):
        raise RuntimeError("duplicate slug")
    m = {t.slug: t for t in all_topics}
    pool = slugs

    OUT.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    table_rows: list[str] = []
    for i, t in enumerate(all_topics):
        internal = pick_links(t.slug, pool, i)
        html = build_body(t, internal, m)
        wc = count_words_html(html)
        if wc < MIN_WORDS:
            raise RuntimeError(f"{t.slug} word count {wc} < {MIN_WORDS}")
        path = OUT / f"{t.slug}.md"
        path.write_text(frontmatter(t) + html, encoding="utf-8")
        table_rows.append(
            f"| {i+1} | {t.title[:80].replace('|', '/')} | `{t.slug}` | {t.track_label} | {wc} | OK | complete | {len(internal)} + hub links | |"
        )

    readme = REPORT_DIR / "canadian-np-longtail-batch-550-README.md"
    readme.write_text(
        "\n".join(
            [
                "# Canadian NP long-tail batch — report index",
                "",
                "- Part 01: `canadian-np-longtail-batch-550-part-01.md`",
                "- Generator: `scripts/blog/generate-canadian-np-longtail-batch.py`",
                "",
                "## Validation commands (from `nursenest-core/`)",
                "",
                "- `npm run validate:blog-static-longtail`",
                "- `npm run diagnose:blog-slug-collisions -- --write-report`",
                "- `npm run typecheck:critical`",
                "- `npm run test:blog-recovery`",
                "- `npm run test:homepage`",
                "",
                "## Shipped set",
                "",
                "- Posts: **550** (26 anchors + 524 expansions)",
                f"- Minimum words enforced at generation: **{MIN_WORDS}** (approximate HTML strip count)",
                "",
            ]
        ),
        encoding="utf-8",
    )
    part = REPORT_DIR / "canadian-np-longtail-batch-550-part-01.md"
    header = "| # | Title | Slug | Track | Words | Validation | SEO | Internal links | Notes |\n|---:|---|---|---|---:|---|---|---|---|\n"
    part.write_text(header + "\n".join(table_rows) + "\n", encoding="utf-8")
    print(json.dumps({"ok": True, "count": 550, "out": str(OUT), "readme": str(readme), "part01": str(part)}))


if __name__ == "__main__":
    main()

PYEND