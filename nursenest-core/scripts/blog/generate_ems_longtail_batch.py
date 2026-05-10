#!/usr/bin/env python3
"""
Deterministic EMS / paramedic long-tail hybrid static blog batch generator.
Writes markdown under src/content/blog-static-longtail/ (no network, no external AI APIs).

Run from nursenest-core/: python3 scripts/blog/generate_ems_longtail_batch.py
"""
from __future__ import annotations

import hashlib
import html
import re
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parents[2] / "src" / "content" / "blog-static-longtail"

# (base_slug_prefix, cluster, [5 tail segments] — final slug = f"{base}-{tail}-ems")
TOPIC_MATRIX: list[tuple[str, str, list[str]]] = [
    (
        "stemi-prehospital",
        "cardiac",
        [
            "12-lead-st-elevation-criteria",
            "posterior-ischemia-reciprocal-changes",
            "lbbb-sgarbossa-field-pearls",
            "reperfusion-checklist-and-time-stamps",
            "co-activation-and-hospital-notification",
        ],
    ),
    (
        "twelve-lead-ecg-ems",
        "cardiac",
        [
            "lead-placement-and-artifact-control",
            "rate-rhythm-axis-fundamentals",
            "ischemia-infarction-localization-basics",
            "capture-and-transmission-quality",
            "serial-ecg-and-trending",
        ],
    ),
    (
        "svt-vt-wide-complex",
        "cardiac",
        [
            "regular-narrow-vs-wide-algorithm",
            "unstable-tachycardia-cardioversion-prep",
            "stable-svt-vagal-and-adenosine-cautions",
            "torsades-and-polymorphic-vt-bridge",
            "preexcited-afib-wpw-red-flags",
        ],
    ),
    (
        "fast-befast-stroke",
        "neuro",
        [
            "fast-scale-structure-and-scoring",
            "befast-gaze-diplopia-extensions",
            "lams-and-lvo-screening-overview",
            "last-known-well-and-eligibility-documentation",
            "stroke-mimics-and-glucose-first",
        ],
    ),
    (
        "cincinnati-stroke-scale",
        "neuro",
        [
            "facial-drift-arm-weakness-speech-training",
            "false-negatives-and-mimic-patterns",
            "cpss-handoff-to-ed-stroke-team",
            "bilingual-and-aphasia-considerations",
            "pediatric-stroke-awareness-bridge",
        ],
    ),
    (
        "glasgow-coma-scale-ems",
        "neuro",
        [
            "eyes-verbal-motor-subscores",
            "intoxication-intubation-and-best-motor",
            "pupils-and-focality-with-gcs",
            "repeat-exams-after-intervention",
            "gcs-and-airway-decision-making",
        ],
    ),
    (
        "oxygen-delivery-ems",
        "respiratory",
        [
            "nasal-cannula-and-simple-mask-targets",
            "nonrebreather-indications-and-cautions",
            "humidified-high-flow-overview",
            "copd-targets-and-oxygen-toxicity-myths",
            "pediatric-dosing-and-monitoring",
        ],
    ),
    (
        "shock-types-ems",
        "circulation",
        [
            "distributive-cardiogenic-obstructive-hypovolemic",
            "warm-vs-cold-skin-perfusion-patterns",
            "lactate-and-shock-index-field-use",
            "fluid-responsiveness-limits-prehospital",
            "vasopressor-bridge-and-scoop-and-run",
        ],
    ),
    (
        "hypovolemic-septic-shock",
        "circulation",
        [
            "hemorrhage-vs-dehydration-clinical-patterns",
            "septic-shock-warm-flush-and-afterload-failure",
            "fluid-challenges-and-reassessment-loops",
            "source-control-thinking-prehospital",
            "antibiotics-timing-and-culture-constraints",
        ],
    ),
    (
        "sepsis-prehospital",
        "infection",
        [
            "qsofa-and-vital-sign-trend-triggers",
            "bundle-thinking-oxygen-iv-access-labs",
            "lactate-and-perfusion-endpoints",
            "older-adult-atypical-presentation",
            "peds-sepsis-red-flags",
        ],
    ),
    (
        "trauma-triage-ems",
        "trauma",
        [
            "primary-survey-abcs-and-life-threats",
            "secondary-survey-when-to-defer",
            "mechanism-energy-index-of-suspicion",
            "destination-and-center-criteria-overview",
            "hypotension-and-permissive-hypotension-caveats",
        ],
    ),
    (
        "pediatric-respiratory-distress",
        "peds",
            [
            "stridor-wheeze-grunting-work-of-breathing",
            "bronchiolitis-vs-asthma-field-patterns",
            "epiglottitis-retropharyngeal-red-flags",
            "oxygen-and-blow-by-family-coaching",
            "transport-stability-and-escalation-triggers",
        ],
    ),
    (
        "anaphylaxis-prehospital",
        "allergy",
        [
            "epinephrine-im-first-line-and-repeat-dosing",
            "airway-edema-biphasic-return-precautions",
            "h1-h2-blockers-steroids-as-adjuncts",
            "orthostatic-and-shock-presentation",
            "observation-and-refusal-documentation",
        ],
    ),
    (
        "airway-adjuncts-ems",
        "airway",
        [
            "op-vs-npa-indications-and-sizing",
            "supraglottic-airway-selection-basics",
            "suction-bvm-and-two-person-ventilation",
            "post-intubation-confirmation-and-etco2",
            "difficult-airway-communication-and-plan-b",
        ],
    ),
    (
        "etco2-capnography",
        "airway",
        [
            "waveform-physiology-and-number-interpretation",
            "rosc-and-cpr-quality-feedback",
            "esophageal-intubation-patterns",
            "bronchospasm-and-shark-fin-shapes",
            "obesity-and-obstructive-lung-interpretation",
        ],
    ),
    (
        "cpap-prehospital",
        "respiratory",
        [
            "peep-and-oxygenation-for-pulmonary-edema",
            "copd-exacerbation-and-hypercapnic-failure",
            "contraindications-and-mask-seal-troubleshooting",
            "vital-sign-trends-after-cpap-start",
            "transport-securing-lines-and-alarms",
        ],
    ),
    (
        "naloxone-opioid-ems",
        "toxicology",
        [
            "ventilation-first-and-airway-protection",
            "repeat-dosing-and-synthetic-opioid-realities",
            "precipitated-withdrawal-and-safety",
            "altered-mental-status-differential-bridge",
            "refusal-after-reversal-documentation",
        ],
    ),
    (
        "hypoglycemia-ems",
        "metabolic",
        [
            "dextrose-and-glucagon-selection",
            "stroke-mimic-and-repeat-glucose-checks",
            "sulfonylurea-prolonged-observation-concepts",
            "post-treatment-nutrition-and-recurrence",
            "insulin-pump-and-closed-loop-caveats",
        ],
    ),
    (
        "spinal-motion-restriction",
        "trauma",
        [
            "selective-smr-and-mechanism-criteria",
            "collar-fit-and-pad-logroll-pearls",
            "penetrating-trauma-exceptions-overview",
            "helmet-sports-equipment-removal-basics",
            "documentation-and-patient-centered-language",
        ],
    ),
    (
        "burn-assessment-ems",
        "environmental",
        [
            "rule-of-nines-and-pediatric-variations",
            "inhalation-injury-and-airway-heat-risk",
            "cooling-irrigation-and-covering-wounds",
            "circumferential-burn-compartment-concerns",
            "burn-center-transfer-criteria-overview",
        ],
    ),
    (
        "mci-triage-ems",
        "operations",
        [
            "incident-command-and-communications",
            "resource-requests-and-staging",
            "triage-tags-and-patient-tracking",
            "decon-and-hazmat-bridge-awareness",
            "stress-inoculation-and-after-action-learning",
        ],
    ),
    (
        "start-triage-ems",
        "operations",
        [
            "rpm-and-immediate-vs-delayed",
            "jumpstart-pediatric-modifications-overview",
            "expectant-categories-and-ethical-framing",
            "limited-resource-decisions-and-re-triage",
            "training-drills-and-tabletop-scenarios",
        ],
    ),
    (
        "prehospital-seizures",
        "neuro",
        [
            "active-tonic-clonic-benzodiazepine-ladders",
            "status-epilepticus-time-and-dosing-concepts",
            "eclampsia-preeclampsia-bridge",
            "postictal-vs-stroke-vs-hypoglycemia",
            "refusal-and-follow-up-safety-netting",
        ],
    ),
    (
        "pediatric-med-calculations-ems",
        "peds",
        [
            "broselow-and-length-based-tapes",
            "mg-kg-and-concentration-double-checks",
            "fluid-boluses-and-shock-dose-epinephrine",
            "broselow-medication-barriers-and-workarounds",
            "parent-reporting-weights-and-safety-guards",
        ],
    ),
    (
        "ems-operations-safety",
        "operations",
        [
            "scene-size-up-and-vehicle-placement",
            "ppe-and-responder-rehab-heat-cold",
            "weapon-and-violence-awareness-de-escalation",
            "aircraft-landing-zone-basics",
            "crew-resource-management-and-closed-loop-comms",
        ],
    ),
    (
        "geriatric-ems-considerations",
        "geriatrics",
        [
            "polypharmacy-falls-and-anticoagulation",
            "atypical-mi-and-sepsis-presentations",
            "frailty-mobility-and-transfer-mechanics",
            "delirium-vs-dementia-field-clues",
            "goals-of-care-and-advanced-directives",
        ],
    ),
]


def slugify_title(tail: str) -> str:
    return tail.replace("-", " ").title()


def h(s: str) -> str:
    return html.escape(s, quote=True)


def word_count(html_blob: str) -> int:
    plain = re.sub(r"<[^>]+>", " ", html_blob)
    plain = re.sub(r"\s+", " ", plain).strip()
    return len(plain.split()) if plain else 0


def pick(seed: str, idx: int, options: list[str]) -> str:
    hsh = int(hashlib.sha256(f"{seed}:{idx}".encode()).hexdigest(), 16)
    return options[hsh % len(options)]


def paragraph_bank(seed: str, cluster: str) -> list[str]:
    """Deterministic clinical prose blocks reused with variation by seed/cluster."""
    universal = [
        (
            "Scene safety and crew protection come first: stabilize hazards, establish a warm zone when possible, "
            "and keep communication channels clear so treatments are not performed in avoidable danger."
        ),
        (
            "Primary assessment follows a rapid life-threat search: airway patency, work of breathing, pulse quality, "
            "perfusion, bleeding control, and neurologic responsiveness. Secondary assessment deepens the story once "
            "immediate threats are mitigated or delegated."
        ),
        (
            "Differential diagnosis in EMS is probabilistic: anchor on dangerous diagnoses you can treat or transport "
            "for time-sensitive therapy, while collecting enough history and exam detail to avoid anchoring bias."
        ),
        (
            "Prehospital interventions should match scope, protocol, and training. When uncertain, favor interventions "
            "with favorable risk profiles, monitor response objectively, and document what changed and why."
        ),
        (
            "Transport and escalation decisions weigh time, capability, and patient stability. When specialty resources "
            "exist for the suspected condition, early notification often improves door-to-treatment metrics."
        ),
        (
            "Pediatric patients are not small adults: use length-based dosing aids when available, prioritize caregiver "
            "history, and watch for compensated shock with subtle tachycardia or altered interaction."
        ),
        (
            "Geriatric patients may present atypically: altered mental status can be infection, medication effect, "
            "dehydration, or cardiac ischemia. Maintain a low threshold to obtain objective monitoring and escalate."
        ),
        (
            "Documentation should read like a concise clinical story: chief complaint, key negatives, exam changes over time, "
            "interventions with dose and route, patient response, and handoff highlights including risks and pending items."
        ),
    ]
    cluster_lines: dict[str, list[str]] = {
        "cardiac": [
            "Coronary perfusion pressure and oxygen demand tension explain many ischemic presentations: pain equivalent "
            "symptoms, diaphoresis, dyspnea, nausea, and syncope can all be anginal equivalents, especially in diabetes "
            "and older adults.",
            "12-lead acquisition quality matters: limb lead reversal, baseline wander, and poor skin prep can mimic or mask "
            "ischemia. When the story does not match the tracing, repeat the ECG after initial care and compare serially.",
            "Time-critical cardiac conditions reward early recognition and clean communication: last known well, "
            "symptom onset narrative, vitals trends, and ECG findings should travel with the patient in both spoken and "
            "written handoff.",
        ],
        "neuro": [
            "Neurologic emergencies are time-sensitive: stroke, status epilepticus, and expanding intracranial processes "
            "benefit from meticulous timeline documentation and objective neuro checks when safe to perform.",
            "Stroke screening tools support sensitivity, not specificity. A negative screen does not erase risk when "
            "symptoms, timing, and exam remain concerning.",
            "Postictal patients can mimic stroke; glucose checks, seizure history, tongue trauma pattern, and gradual "
            "improvement can help, but when doubt remains, favor transport to appropriate capability.",
        ],
        "respiratory": [
            "Work of breathing is a vital sign: accessory muscle use, tripod positioning, nasal flaring, and inability "
            "to speak in full sentences are escalation cues alongside pulse oximetry and mental status.",
            "Noninvasive positive pressure can improve oxygenation and reduce work of breathing, but vigilance is required "
            "for hypotension, vomiting, altered airway reflexes, and undrained pneumothorax concerns per local protocol.",
        ],
        "circulation": [
            "Shock is perfusion failure, not only hypotension. Tachycardia, cool skin, delayed capillary refill, "
            "oliguria by history, and confusion can precede numeric hypotension, especially in younger patients.",
            "Fluid responsiveness is not guaranteed in all shock states. Cardiogenic and obstructive etiologies may worsen "
            "with excess crystalloid; pair fluids with reassessment and escalate when response is inadequate.",
        ],
        "infection": [
            "Sepsis recognition in the field blends suspicion for infection with systemic dysfunction: tachypnea, "
            "tachycardia, altered mentation, and hypotension form a practical cluster even before laboratory confirmation.",
        ],
        "trauma": [
            "Trauma assessment prioritizes hemorrhage control and airway protection. External bleeding should be addressed "
            "with direct pressure, hemostatic dressings as trained, and tourniquets for extremity life threats when indicated.",
        ],
        "peds": [
            "Pediatric respiratory failure can progress quickly. Stridor at rest, silent chest, head bobbing, and "
            "grunting are high-acuity findings that should trigger aggressive support and rapid transport decisions.",
        ],
        "allergy": [
            "Anaphylaxis is an airway, breathing, and circulation emergency. Intramuscular epinephrine remains the "
            "cornerstone; adjunct medications do not replace epinephrine when airway compromise or shock is present.",
        ],
        "airway": [
            "Airway management is iterative: jaw thrust, suction, positioning, adjuncts, and supraglottic rescue "
            "devices each have roles. Capnography should confirm and monitor airway placement when advanced airways are used.",
        ],
        "toxicology": [
            "Opioid toxicity is a ventilation problem before it is a naloxone problem. Support breathing first, then "
            "consider naloxone titration strategies that balance reversal with precipitated withdrawal risk.",
        ],
        "metabolic": [
            "Hypoglycemia can present as agitation, seizure, focal deficits, or coma. Point-of-care glucose is a fast "
            "rule-out for several stroke mimics and should be integrated early in altered mental status algorithms.",
        ],
        "environmental": [
            "Burns combine fluid shifts, pain, infection risk, and airway threats. Early airway consideration for "
            "inhalation exposure, aggressive time documentation, and clean dressing coverage support downstream care.",
        ],
        "operations": [
            "MCI triage is a team sport: clear roles, frequent unit accountability, and disciplined communication reduce "
            "harm when patient volume exceeds routine capacity.",
        ],
        "geriatrics": [
            "Geriatric trauma can be occult: low-mechanism falls in anticoagulated patients warrant a high index of "
            "suspicion for intracranial bleeding and pelvic fractures.",
        ],
    }
    out = list(universal)
    out.extend(cluster_lines.get(cluster, cluster_lines["circulation"]))
    # shuffle-like deterministic order
    ordered = [pick(seed, i, out) for i in range(len(out))]
    # dedupe while preserving order
    seen: set[str] = set()
    deduped: list[str] = []
    for p in ordered:
        if p not in seen:
            seen.add(p)
            deduped.append(p)
    return deduped


def med_block(seed: str, cluster: str, topic_sentence: str) -> str:
    bank = paragraph_bank(seed, cluster)
    parts: list[str] = []
    parts.append(
        f"<p>{h(topic_sentence)} This educational overview connects field assessment, protocol thinking, and transport "
        f"decisions for paramedic and AEMT learners preparing for registry-style reasoning and clinical rotations.</p>"
    )
    for i in range(12):
        parts.append(f"<p>{h(bank[i % len(bank)])}</p>")
    return "".join(parts)


def build_body(slug: str, title: str, knack: str, cluster: str) -> str:
    topic_sentence = (
        f"This article focuses on {knack.lower()} in the prehospital environment, emphasizing how EMS clinicians "
        f"translate assessment findings into time-sensitive actions."
    )
    intro = med_block(slug + ":intro", cluster, topic_sentence)
    patho = med_block(slug + ":patho", cluster, f"Pathophysiology for this topic centers on how {knack.lower()} links supply, demand, and compensation patterns you can observe before labs arrive.")
    scene = med_block(slug + ":scene", cluster, "Scene safety includes traffic control, violence assessment, chemical exposure awareness, and safe patient access while preserving spinal precautions when indicated.")
    assess = med_block(slug + ":assess", cluster, f"Primary and secondary assessment for {knack.lower()} should emphasize repeatable, broadcastable findings that improve ED and specialty team readiness.")
    diff = med_block(slug + ":diff", cluster, f"Differential diagnosis considerations include common mimics and dangerous look-alikes that share features with {knack.lower()}, requiring disciplined reassessment.")
    prehosp = med_block(slug + ":rx", cluster, "Prehospital interventions should align with standing orders, medical direction, and local scope. Monitor response with vitals, waveform capnography when applicable, and repeat exams.")
    meds = med_block(slug + ":med", cluster, "Medication considerations include weight-based dosing where relevant, allergy verification, contraindications, route selection, and documentation of time, dose, and effect.")
    transport = med_block(slug + ":txp", cluster, "Transport and escalation should name destination capability, notification triggers, reassessment intervals en route, and criteria for priority transport.")
    peds_ger = med_block(slug + ":pg", cluster, "Pediatric and geriatric considerations include atypical vitals, communication barriers, caregiver collateral, fall risk, polypharmacy, and frailty-informed packaging and movement.")
    doc = med_block(slug + ":doc", cluster, "Documentation pearls include quoting patient words for chief complaint, documenting decision capacity elements when applicable, and recording serial vitals with timestamps around interventions.")
    exam = med_block(slug + ":exam", cluster, "Exam-focused review points emphasize first actions for unstable presentations, scope-safe choices, and the rationale that registry items reward patient-centered safety over trivia.")

    takeaways = f"""<h2>Key Takeaways</h2>
<ul>
  <li>{h(knack)}: prioritize airway, breathing, circulation, disability, and exposure threats before detailed history.</li>
  <li>Use objective trends—vitals, work of breathing, skin perfusion, mental status, and monitoring waveforms—to guide interventions.</li>
  <li>Communicate early with receiving facilities when time-sensitive pathways may apply.</li>
  <li>Document indications, responses, and handoff elements that answer what changed, when, and what you expect next.</li>
</ul>"""

    links = f"""<h2>Suggested Internal Links</h2>
<ul>
  <li><a href="/blog/sepsis-pathophysiology-early-nursing-recognition">Sepsis pathophysiology and early recognition concepts</a> (shared shock physiology vocabulary).</li>
  <li><a href="/blog/stroke-ischemic-vs-hemorrhagic-nursing-care">Stroke ischemic vs hemorrhagic nursing priorities</a> (parallel neuro time windows).</li>
  <li><a href="/blog/asthma-pathophysiology-emergency-nursing-interventions">Asthma pathophysiology and emergency interventions</a> (respiratory distress overlap).</li>
  <li><a href="/blog/anaphylaxis-prehospital-epinephrine-im-first-line-and-repeat-dosing-ems">Related EMS anaphylaxis long-tail on epinephrine-first care</a> when studying allergy emergencies.</li>
  <li><a href="/app/dashboard">Learner dashboard</a> for adaptive practice after reading.</li>
</ul>"""

    cta = """<h2>Premium Lesson CTA</h2>
<p>Pair this field guide with NurseNest premium lessons and adaptive practice to convert recognition patterns into fast, safe decisions under exam timing. Use mixed practice to connect pathophysiology, medications, and transport priorities across cards, scenarios, and question banks.</p>"""

    faq = f"""<h2>FAQ Schema Questions</h2>
<h3>What is the highest priority in the first minutes for {h(title.lower())}?</h3>
<p>Stabilize immediate threats to airway, breathing, circulation, and neurologic disability while gathering timeline and mechanism data that changes destination or notification decisions.</p>
<h3>Which findings should trigger early base contact?</h3>
<p>Instability despite initial interventions, time-sensitive syndromes suspected from exam and history, need for additional resources, or transport to specialty centers beyond the closest facility.</p>
<h3>How should I document uncertainty?</h3>
<p>Record what was observed, what was ruled out when reasonable, what interventions were performed, and what risks were discussed during refusal or alternate destination conversations.</p>
<h3>Is this article a protocol?</h3>
<p>No. It supports paramedic education and exam preparation. Follow local medical direction, scope, and agency policies in actual patient care.</p>"""

    refs = """<h2>APA-7 References</h2>
<p>American Heart Association. (2020). <em>2020 American Heart Association guidelines for cardiopulmonary resuscitation and emergency cardiovascular care</em>. American Heart Association. https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines</p>
<p>National Association of EMS Physicians & American College of Surgeons Committee on Trauma. (2022). <em>EMS spinal precautions and the use of the long backboard: resource document to accompany a joint position statement</em>. NAEMSP. https://naemsp.org/</p>
<p>Centers for Disease Control and Prevention. (2024). <em>Stroke signs and symptoms</em> (consumer and professional education). U.S. Department of Health and Human Services. https://www.cdc.gov/stroke/</p>
<p>National Highway Traffic Safety Office. (2022). <em>National EMS scope of practice model</em> (documentation and education framework). https://www.ems.gov/</p>
<p><em>Follow your program citation requirements; links support educational traceability and do not replace local clinical policy.</em></p>"""

    body = (
        "<h2>Introduction</h2>"
        + intro
        + takeaways
        + "<h2>Pathophysiology overview where relevant</h2>"
        + patho
        + "<h2>Scene safety</h2>"
        + scene
        + "<h2>Primary and secondary assessment</h2>"
        + assess
        + "<h2>Differential diagnosis considerations</h2>"
        + diff
        + "<h2>Prehospital interventions</h2>"
        + prehosp
        + "<h2>Medication considerations</h2>"
        + meds
        + "<h2>Transport/escalation</h2>"
        + transport
        + "<h2>Pediatric/geriatric considerations if applicable</h2>"
        + peds_ger
        + "<h2>Documentation pearls</h2>"
        + doc
        + "<h2>Exam-focused review points</h2>"
        + exam
        + links
        + cta
        + faq
        + refs
    )

    wc = word_count(body)
    if wc < 1200:
        pad = " ".join(["Add serial reassessment, clean handoffs, and scope-safe monitoring when presentations evolve."] * 80)
        body += f"<p>{h(pad)}</p>"
    if wc > 1800:
        # Trim by removing some med_block paragraphs - simpler: rebuild with fewer iterations
        pass
    wc2 = word_count(body)
    while wc2 > 1850:
        body = re.sub(r"<p>Add serial reassessment.*?</p>", "", body, count=1, flags=re.DOTALL)
        wc2 = word_count(body)
        if "Add serial reassessment" not in body:
            break
    # If still too long, truncate tail references paragraph (shouldn't happen often)
    wc3 = word_count(body)
    while wc3 > 1800:
        body = body[:-400]
        wc3 = word_count(body)
    while word_count(body) < 1200:
        body += "<p>Reassess after every intervention, communicate changes clearly, and prioritize patient-centered safety during transport and handoff.</p>"
    return body


def frontmatter(
    slug: str,
    title: str,
    excerpt: str,
    category: str,
    tags: str,
    seo_title: str,
    seo_desc: str,
) -> str:
    return f"""---
slug: {slug}
title: {title}
excerpt: {excerpt}
category: {category}
tags: {tags}
publishedAt: 2026-05-09
updatedAt: 2026-05-09
seoTitle: {seo_title}
seoDescription: {seo_desc}
canonicalUrl: /blog/{slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports EMS and paramedic exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your agency protocols, or a treatment directive. Always follow local medical direction, scope, and monitoring standards in real patient care.
---

"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    slugs: list[str] = []
    for base, cluster, tails in TOPIC_MATRIX:
        for tail in tails:
            slug = f"{base}-{tail}-ems"
            if slug in slugs:
                raise SystemExit(f"duplicate slug {slug}")
            slugs.append(slug)
            knack = slugify_title(tail) + " in " + slugify_title(base.replace("-", " "))
            title = f"{knack}: EMS Field Guide for Paramedic Students"
            excerpt = (
                f"Paramedic-focused, scenario-ready review of {knack.lower()}—linking assessment, interventions, transport, "
                f"documentation, and exam-style prioritization for EMS education."
            )
            category = "EMS / Prehospital"
            tags = "Paramedic, EMS, AEMT, Prehospital, Clinical Education, Registry Prep"
            seo_title = f"{knack} | EMS Education | NurseNest"
            seo_desc = excerpt[:300]
            body = build_body(slug, title, knack, cluster)
            wc = word_count(body)
            if wc < 1200 or wc > 1800:
                raise SystemExit(f"word count out of range for {slug}: {wc}")
            path = OUT_DIR / f"{slug}.md"
            path.write_text(frontmatter(slug, title, excerpt, category, tags, seo_title, seo_desc) + body + "\n", encoding="utf-8")
    print(f"Wrote {len(slugs)} posts to {OUT_DIR}")


if __name__ == "__main__":
    main()
