#!/usr/bin/env python3
"""One-shot generator for Middle East licensing long-tail batch (40 posts). Run from nursenest-core/."""
from __future__ import annotations

import html
import os
import re
from pathlib import Path

# Repo root: .../nursenest-core (parent of scripts/)
OUT = Path(__file__).resolve().parents[2] / "src" / "content" / "blog-static-longtail"

DISCLAIMER = (
    "This article supports educational exam preparation and clinical reasoning practice. "
    "It is not individualized medical advice, a substitute for your institution's policies, "
    "or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care."
)

INTERNAL = [
    ("hyperkalemia-ecg-changes-nursing-students", "Hyperkalemia ECG changes: nursing exam review"),
    ("hypokalemia-pathophysiology-nursing-priorities", "Hypokalemia pathophysiology and nursing priorities"),
    ("liver-cirrhosis-symptoms-nursing-care", "Liver cirrhosis symptoms and nursing care"),
    ("pancreatitis-symptoms-causes-nursing-priorities", "Pancreatitis nursing priorities"),
]

POSTS: list[dict] = [
    {
        "slug": "dha-nursing-exam-uae-educational-guide-longtail",
        "title": "DHA Nursing Exam UAE: Educational Study Guide for Internationally Educated Nurses",
        "country": "United Arab Emirates",
        "exam": "Dubai Health Authority (DHA)–style licensing discussions",
        "focus": "Educational overview of how DHA-related nursing assessments are commonly discussed in UAE migration prep, plus clinical study anchors.",
    },
    {
        "slug": "haad-doh-abu-dhabi-nursing-exam-explained-longtail",
        "title": "HAAD and DOH Abu Dhabi Nursing Exam Pathways Explained (Educational Framing)",
        "country": "United Arab Emirates (Abu Dhabi)",
        "exam": "HAAD / Department of Health – Abu Dhabi naming in prep materials",
        "focus": "Clarifies common naming changes in study communities and stresses verifying requirements with the official UAE regulator.",
    },
    {
        "slug": "qatar-prometric-nursing-licensing-exam-prep-longtail",
        "title": "Qatar Prometric Nursing Exam Prep: Structure, Study Strategy, and Clinical Review",
        "country": "Qatar",
        "exam": "Prometric-delivered assessments as discussed in Qatar licensing prep",
        "focus": "Computer-based testing habits, safety priorities, and verification with Qatar health regulator sources.",
    },
    {
        "slug": "saudi-prometric-nursing-exam-study-guide-longtail",
        "title": "Saudi Prometric Nursing Exam Study Guide: Clinical Topics and Test Strategy",
        "country": "Saudi Arabia",
        "exam": "Prometric-delivered nursing assessments in Saudi prep contexts",
        "focus": "SCFHS-related discussions at a high level without claiming current rule text; emphasizes official verification.",
    },
    {
        "slug": "nursing-in-dubai-uae-practice-overview-international-rns-longtail",
        "title": "Nursing in Dubai Explained: Practice Context for Internationally Educated RNs",
        "country": "United Arab Emirates (Dubai)",
        "exam": "General UAE employment and licensing orientation (educational)",
        "focus": "Acclimation to multidisciplinary teams, documentation expectations, and exam-relevant clinical standards.",
    },
    {
        "slug": "medication-safety-gulf-nursing-licensing-exam-review-longtail",
        "title": "Medication Safety Review for Gulf Region Nursing Licensing Exams",
        "country": "UAE / Saudi Arabia / Qatar (general acute care)",
        "exam": "Licensing-style pharmacology and safety items",
        "focus": "Five rights, high-alert medications, renal dosing hooks, and escalation for adverse reactions.",
    },
    {
        "slug": "infection-control-ipc-middle-east-nursing-exam-review-longtail",
        "title": "Infection Prevention and Control Review for Middle East Nursing Exams",
        "country": "Regional acute care (educational)",
        "exam": "IPC items on computer-delivered nursing tests",
        "focus": "Transmission-based precautions, PPE sequence, device-related infection bundles, and isolation communication.",
    },
    {
        "slug": "sepsis-nursing-care-gulf-licensing-exam-priorities-longtail",
        "title": "Sepsis Nursing Care Priorities for Gulf Licensing and Prometric-Style Exams",
        "country": "Regional ICU and wards (educational)",
        "exam": "Clinical judgment items on sepsis recognition",
        "focus": "qSOFA/SIRS teaching limits, escalation, cultures vs time-sensitive therapy framing as exam themes.",
    },
    {
        "slug": "ecg-interpretation-nursing-prometric-style-exam-prep-longtail",
        "title": "ECG Interpretation Basics for Nursing Licensing Exams (Prometric-Style Prep)",
        "country": "General",
        "exam": "ECG items on international nursing exams",
        "focus": "Rate, rhythm, ischemia patterns, electrolyte effects, and when to escalate—without replacing formal ECG courses.",
    },
    {
        "slug": "diabetes-nursing-management-licensing-exam-gulf-longtail",
        "title": "Diabetes Nursing Management for Gulf Region Licensing Exam Review",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Glycemic emergencies, insulin safety, teaching",
        "focus": "DKA/HHS distinction themes, hypoglycemia first aid within scope, foot risk education.",
    },
    {
        "slug": "oxygen-therapy-safety-nursing-licensing-exams-longtail",
        "title": "Oxygen Therapy: Safety and Monitoring for Nursing Licensing Exams",
        "country": "General",
        "exam": "Respiratory therapy items",
        "focus": "SpO2 targets as educational concepts, CO2 retention risk, humidification, and fire safety documentation.",
    },
    {
        "slug": "prioritization-strategies-nclex-prometric-nursing-longtail",
        "title": "Prioritization Questions: NCLEX-Style vs Prometric-Style Nursing Strategies",
        "country": "General",
        "exam": "NCLEX-RN compared to Prometric-delivered international exams (educational)",
        "focus": "Maslow, ABCs, unstable-first rules, therapeutic communication distractors.",
    },
    {
        "slug": "icu-nursing-review-international-licensing-exam-prep-longtail",
        "title": "ICU Nursing Review for Internationally Educated Nurses Preparing for Licensing Exams",
        "country": "Regional tertiary hospitals",
        "exam": "Critical care items on broad RN exams",
        "focus": "Hemodynamics, ventilator alarms as escalation triggers, sedation assessment, family updates.",
    },
    {
        "slug": "documentation-standards-gulf-nursing-practice-exams-longtail",
        "title": "Documentation Standards in Gulf Nursing Practice: Exam-Relevant Principles",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Legal-ethical and practice questions",
        "focus": "Objective vs subjective charting, incident reporting, consent and interpreter documentation themes.",
    },
    {
        "slug": "cultural-considerations-middle-east-healthcare-nursing-longtail",
        "title": "Cultural Considerations in Middle East Healthcare: Professional Nursing Education",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Communication and ethics items",
        "focus": "Respectful language, privacy and modesty as clinical logistics (draping, chaperones), avoiding stereotyping.",
    },
    {
        "slug": "multidisciplinary-team-communication-nursing-gulf-longtail",
        "title": "Communication With Multidisciplinary Teams in Gulf Acute Care Settings",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "SBAR, conflict in orders, escalation",
        "focus": "Closed-loop communication, read-back, pharmacist and physician collaboration, nurse advocacy.",
    },
    {
        "slug": "fluid-imbalance-electrolytes-nursing-exam-review-longtail",
        "title": "Fluid Imbalance and Electrolytes: Nursing Exam Review for Gulf Candidates",
        "country": "General",
        "exam": "Fluid volume deficit/excess, sodium, potassium",
        "focus": "IV therapy monitoring, oral rehydration teaching, diuretic effects, lab trend interpretation.",
    },
    {
        "slug": "ngn-style-clinical-judgment-gulf-nursing-exams-longtail",
        "title": "NGN-Style Clinical Judgment for Gulf Nursing Exam Preparation",
        "country": "General",
        "exam": "Next-generation NCLEX-style case layers applied to international prep",
        "focus": "Cues, hypotheses, priority actions, evaluation—mapped to generic computer case formats.",
    },
    {
        "slug": "nclex-vs-prometric-nursing-exam-comparison-longtail",
        "title": "NCLEX vs Prometric Nursing Exams: Educational Comparison for International RNs",
        "country": "United States vs Gulf migration contexts",
        "exam": "NCLEX-RN / PN vs Prometric-delivered regional exams",
        "focus": "Item style differences at a high level; warns against false precision on unpublished blueprint details.",
    },
    {
        "slug": "transitioning-gulf-nursing-practice-international-rns-longtail",
        "title": "Transitioning to Gulf Nursing Practice: Orientation Topics for International RNs",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Professional adjustment (not a single test blueprint)",
        "focus": "Shift handoffs, scope questions routed to facility policy, emotional resilience while studying.",
    },
    {
        "slug": "uae-moh-nursing-licensing-pathway-educational-overview-longtail",
        "title": "UAE MOH Nursing Licensing Pathway: Educational Overview for Candidates",
        "country": "United Arab Emirates",
        "exam": "MOH UAE discussions in prep forums",
        "focus": "Emphasizes verifying eligibility, dataflow, and exam scheduling with official MOH UAE communications.",
    },
    {
        "slug": "saudi-scfhs-nursing-classification-exam-framing-longtail",
        "title": "Saudi SCFHS Nursing Classification and Exam Prep: High-Level Educational Framing",
        "country": "Saudi Arabia",
        "exam": "SCFHS-related classification and testing discussions",
        "focus": "Avoids legal advice; frames study plans around clinical competencies and official portal verification.",
    },
    {
        "slug": "qatar-qchp-nurse-registration-educational-overview-longtail",
        "title": "Qatar QCHP Nurse Registration Overview for Internationally Educated Nurses (Educational)",
        "country": "Qatar",
        "exam": "QCHP / Ministry of Public Health prep discussions",
        "focus": "Professional documentation, CPD concepts, and clinical refreshers while candidates confirm requirements.",
    },
    {
        "slug": "uae-emirates-variations-nursing-licensing-framing-longtail",
        "title": "UAE Emirates Variations in Nursing Licensing Discussions: Educational Framing",
        "country": "United Arab Emirates",
        "exam": "DHA vs DOH vs MOH naming in study groups",
        "focus": "Why candidates must not assume one emirate's rules apply to another; respectful accuracy.",
    },
    {
        "slug": "prometric-computer-delivered-nursing-test-strategies-longtail",
        "title": "Prometric Computer-Delivered Nursing Test Strategies for International Candidates",
        "country": "General",
        "exam": "Prometric test-center experience",
        "focus": "Time management, flagging items, break planning, anxiety regulation, and practice test discipline.",
    },
    {
        "slug": "handoff-sbar-communication-gulf-acute-care-nursing-longtail",
        "title": "SBAR Handoffs and Escalation in Gulf Acute Care: Nursing Exam Review",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Communication and safety items",
        "focus": "Structured reporting, read-back of critical values, MET/RRT activation themes.",
    },
    {
        "slug": "medication-reconciliation-acute-care-gulf-nursing-exams-longtail",
        "title": "Medication Reconciliation in Acute Care: Gulf Nursing Exam Focus",
        "country": "Regional hospitals",
        "exam": "Admission/discharge med safety",
        "focus": "Allergy documentation, high-risk drug classes, patient teach-back on changes.",
    },
    {
        "slug": "clabsi-prevention-ipc-nursing-licensing-focus-longtail",
        "title": "CLABSI Prevention and Central Line Nursing Care for Licensing Exams",
        "country": "General ICU/med-surg",
        "exam": "IPC and device questions",
        "focus": "Hub scrub, dressing changes per policy, daily necessity review, fever workup cues.",
    },
    {
        "slug": "stroke-nursing-priorities-licensing-exam-gulf-longtail",
        "title": "Stroke Nursing Priorities for Licensing Exams in Gulf Acute Care Contexts",
        "country": "Regional stroke centers",
        "exam": "Neuro assessment and time-sensitive care items",
        "focus": "FAST, glucose check, NIHSS as facility-dependent, thrombolysis exclusion themes as exam distractors.",
    },
    {
        "slug": "heart-failure-nursing-review-gulf-licensing-prep-longtail",
        "title": "Heart Failure Nursing Review for Gulf Licensing Exam Preparation",
        "country": "General",
        "exam": "HF exacerbation items",
        "focus": "Daily weights, I/O, oxygen, medication education for RAAS/SGLT2 themes at guideline level.",
    },
    {
        "slug": "acute-kidney-injury-nursing-priorities-licensing-exams-longtail",
        "title": "Acute Kidney Injury Nursing Priorities for International Licensing Exams",
        "country": "General",
        "exam": "Renal failure items",
        "focus": "Prerenal/intrinsic/postrenal framing, potassium and fluid safety, nephrotoxin avoidance.",
    },
    {
        "slug": "postoperative-monitoring-nursing-licensing-exam-review-longtail",
        "title": "Postoperative Monitoring and Complications: Nursing Licensing Exam Review",
        "country": "General",
        "exam": "Perioperative items",
        "focus": "Airway, bleeding, pain vs masking ileus, DVT prophylaxis, early mobilization education.",
    },
    {
        "slug": "pain-assessment-cultural-sensitivity-gulf-nursing-longtail",
        "title": "Pain Assessment With Cultural Sensitivity in Gulf Region Nursing Practice",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Therapeutic communication and pain scales",
        "focus": "Validated tools, nonverbal cues, family involvement preferences without stereotyping individuals.",
    },
    {
        "slug": "pediatric-dosing-safety-nursing-calculations-licensing-longtail",
        "title": "Pediatric Dosing Safety and Nursing Calculations for Licensing Exams",
        "country": "General",
        "exam": "Dosage calculation items",
        "focus": "mg/kg, rounding rules, double-check culture, growth-chart context as distractor.",
    },
    {
        "slug": "postpartum-hemorrhage-nursing-priorities-licensing-longtail",
        "title": "Postpartum Hemorrhage Nursing Priorities for Licensing Exam Review",
        "country": "General OB",
        "exam": "OB emergency items",
        "focus": "Tone, tissue, trauma, thrombin framework; fundal massage only as protocol allows; massive transfusion as team response.",
    },
    {
        "slug": "professional-modesty-privacy-nursing-care-gulf-education-longtail",
        "title": "Professional Modesty and Privacy Considerations in Patient-Centered Gulf Nursing Care",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Ethics and fundamentals items",
        "focus": "Draping, same-gender care when requested and operationally feasible, interpreter use, private discussions.",
    },
    {
        "slug": "family-centered-care-multicultural-gulf-hospitals-nursing-longtail",
        "title": "Family-Centered Care in Multicultural Gulf Hospitals: Nursing Education",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Communication and discharge teaching",
        "focus": "Visitor policies as institution-specific; teach-back; boundary setting with respect.",
    },
    {
        "slug": "nurse-scope-of-practice-uae-context-educational-framing-longtail",
        "title": "Nurse Scope of Practice in UAE Context: Educational Framing (Not Legal Advice)",
        "country": "United Arab Emirates",
        "exam": "Delegation and scope items",
        "focus": "RN vs technician roles as facility-dependent; escalate scope questions to authoritative sources.",
    },
    {
        "slug": "health-information-privacy-documentation-nursing-gulf-longtail",
        "title": "Health Information Privacy and Nursing Documentation in Gulf Healthcare Settings",
        "country": "UAE / Saudi Arabia / Qatar",
        "exam": "Ethics, informatics, confidentiality",
        "focus": "Password discipline, photography bans, sharing information only with care team and authorized contacts.",
    },
    {
        "slug": "high-alert-medications-pharmacology-gulf-nursing-exams-longtail",
        "title": "High-Alert Medications Pharmacology Review for Gulf Nursing Licensing Exams",
        "country": "General",
        "exam": "Insulin, anticoagulants, chemo, opioids, electrolytes",
        "focus": "Independent double checks, pump programming vigilance, reversal agent awareness as educational themes.",
    },
]

assert len(POSTS) == 40, len(POSTS)


def word_count(html_text: str) -> int:
    t = re.sub(r"<[^>]+>", " ", html_text)
    t = re.sub(r"\s+", " ", t).strip()
    return len(t.split()) if t else 0


def yaml_escape(s: str) -> str:
    if any(c in s for c in ':"\'\n'):
        return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'
    return s


def build_body(meta: dict, peer_slugs: list[str], title_by_slug: dict[str, str]) -> str:
    c = meta["country"]
    e = meta["exam"]
    topic = meta["focus"]
    slug = meta["slug"]
    peers = [s for s in peer_slugs if s != slug][:4]
    peer_links = "".join(
        f'<li><a href="/blog/{html.escape(ps)}">{html.escape(title_by_slug.get(ps, ps))}</a></li>\n'
        for ps in peers
    )
    int_links = "".join(
        f'<li><a href="/blog/{html.escape(s)}">{html.escape(t)}</a></li>\n' for s, t in INTERNAL
    )
    return f"""<h2>Introduction</h2>
<p>This guide is written in international English for internationally educated nurses preparing for licensing-related assessments commonly discussed in <strong>{html.escape(c)}</strong> contexts, including <strong>{html.escape(e)}</strong>. It is educational exam preparation—not legal advice, not an official bulletin, and not a promise of eligibility. Always verify names, fees, credential evaluation steps, and examination blueprints with the regulator and test delivery vendor you are actually applying through.</p>
<p>{html.escape(topic)} Use the sections below to build a repeatable study map: understand the generic structure of computer-delivered clinical tests, refresh high-yield safety content, and practice explaining your reasoning the way structured items reward.</p>

<h2>Key Takeaways</h2>
<ul>
<li>Regulators and exam vendors change processes; treat community summaries as hypotheses until you confirm on an official site.</li>
<li>Clinical licensing items usually blend pathophysiology, nursing scope, communication, documentation, and escalation.</li>
<li>Patient safety themes—medications, infection prevention, falls, deteriorating patient response—appear across countries.</li>
<li>Professional communication in multicultural teams rewards clarity, respect, and closed-loop follow-through.</li>
</ul>

<h2>Exam overview and structure (educational generalization)</h2>
<p>Many nurses encounter <strong>multiple-choice and case-based items</strong> delivered on computer at a test center. Stems often include vital signs, lab values, a short history, and a question about the <em>first</em> or <em>best</em> nursing action. Some programs also include calculation, prioritization drag-and-drop, or multi-step clinical judgment formats. Exact weighting, time limits, and retake rules are not stable year to year, which is why your pre-test checklist should always include reading the newest candidate handbook from the official authority.</p>
<p>When this article references <strong>Prometric</strong> or regional authorities such as <strong>DHA</strong>, <strong>DOH Abu Dhabi</strong>, <strong>MOH UAE</strong>, <strong>QCHP</strong>, or <strong>SCFHS</strong>, the intent is to align <em>study topics</em> with the way candidates talk about their journeys—not to reproduce proprietary exam content or unpublished blueprints.</p>

<h2>Eligibility, paperwork, and study strategies</h2>
<p>Internationally educated nurses frequently balance credential evaluation, language testing, employment offers, and family logistics. A resilient study strategy uses <strong>time blocking</strong>, <strong>weak-area tagging</strong>, and <strong>mixed review</strong> so that pharmacology, med-surg, pediatrics, OB, mental health, leadership, and ethics all stay warm. Pair each content block with a small batch of practice questions so knowledge stays applied, not passive.</p>
<p>For eligibility and documentation, maintain a single folder (digital or paper) with transcripts, registration certificates, experience letters, identification, and official correspondence. When instructions conflict between a recruiter and a regulator, the regulator wins.</p>

<h2>Clinical judgment and safety mindset</h2>
<p>Licensing exams reward the same habit you need at the bedside: identify the most urgent threat, act within nursing scope, communicate clearly, and re-evaluate. Practice naming the <strong>mechanism</strong>, the <strong>most dangerous complication</strong>, and the <strong>assessment finding</strong> that would change your next step. That three-part sentence helps you avoid pretty-but-wrong answers that are true yet not priority.</p>

<h2>Medication safety anchors</h2>
<p>Expect items on high-alert medications, therapeutic duplication, renal adjustments, anticoagulation teaching, insulin timing, opioids and respiratory depression, and antibiotic stewardship. Always ask: Do I have enough data to give this drug safely? What must I monitor after administration? When must I page the provider or activate emergency response?</p>

<h2>Infection prevention and control (IPC)</h2>
<p>IPC questions frequently test indications for contact, droplet, and airborne precautions; appropriate PPE; sterile technique; and device bundles. Remember that <strong>family and visitor education</strong> is part of nursing practice when policies support it, especially for isolation indications and hand hygiene.</p>

<h2>Documentation and professional communication</h2>
<p>Accurate, objective, timely documentation supports continuity of care and legal-ethical accountability. Items may test what belongs in the record, how to correct an error, how to quote a patient concern, and when incident or adverse-event reporting is appropriate. Pair charting questions with communication scenarios involving physicians, pharmacists, therapists, and unlicensed assistive personnel.</p>

<h2>Escalation and deteriorating patient recognition</h2>
<p>Early escalation saves lives. Know common triggers for rapid response activation: sustained hypotension, new hypoxia, altered consciousness, chest pain suggestive of acute coronary syndrome, massive bleeding, and sepsis suspicion. Nursing exams often probe whether you <strong>stay with the unstable patient</strong> versus delegate inappropriately.</p>

<h2>Common exam traps</h2>
<ul>
<li>Choosing teaching when the patient is unstable.</li>
<li>Completing paperwork before addressing airway, breathing, or circulation threats.</li>
<li>Ignoring modesty, privacy, or interpreter needs in communication answer choices.</li>
<li>Assuming one Gulf country's rule set automatically applies to another emirate or nation.</li>
</ul>

<h2>Suggested internal links</h2>
<ul>
{int_links}{peer_links}<li><a href="/app/dashboard">NurseNest learner dashboard</a> — continue adaptive study after reading.</li>
</ul>

<h2>Premium lesson CTA</h2>
<p>Translate this review into timed practice inside NurseNest premium pathways: adaptive questions, rationales tied to safety science, and dashboards that keep internationally educated nurses oriented toward exam day without cram-only burnout.</p>

<h2>FAQ Schema Questions</h2>
<h3>Is this article official regulatory guidance?</h3>
<p>No. It is educational exam preparation. Always confirm requirements with the relevant health authority and authorized test delivery information.</p>
<h3>Do Gulf licensing exams use NCLEX items verbatim?</h3>
<p>Not as a blanket rule. Some conceptual overlaps exist in nursing science, but vendors, blueprints, and scoring differ. Avoid prep materials that promise leaked content.</p>
<h3>How should I study culture-related questions?</h3>
<p>Prioritize individual patient preferences, hospital policy, professional boundaries, and respectful communication rather than stereotypes about any nationality or religion.</p>

<h2>APA-7 References</h2>
<p>World Health Organization. (2024). <em>Global strategic directions for nursing and midwifery 2021–2025</em>. https://www.who.int/publications/i/item/9789240029921</p>
<p>Surviving Sepsis Campaign. (2021). <em>Hour-1 bundle</em> (educational summary resources). Society of Critical Care Medicine. https://www.sccm.org/survivingsepsiscampaign</p>
<p>Institute for Safe Medication Practices. (2023). <em>High-alert medications</em> (patient safety education). https://www.ismp.org/</p>
<p>American Nurses Association. (2021). <em>Nursing: Scope and standards of practice</em> (4th ed.). American Nurses Association. (Use for professional role concepts in international English programs.)</p>
"""


def clip_seo_desc(text: str, max_len: int = 158) -> str:
    """Prefer a full clause under max_len; avoid chopping mid-phrase."""
    text = text.strip()
    if len(text) <= max_len:
        return text
    cut = text[:max_len]
    # Avoid ending SEO description at the first short clause (e.g., right after the exam name).
    for sep, minpos in ((". ", 125), ("; ", 95), (", ", 85)):
        sp = cut.rfind(sep)
        if sp >= minpos:
            return cut[: sp + 1].rstrip()
    sp = cut.rfind(" ")
    if sp >= 60:
        return cut[:sp].rstrip(",;:- ") + "."
    return text[: max_len - 3].rstrip() + "..."


def shorten_seo_title(title: str, suffix: str = " | NurseNest", max_total: int = 70) -> str:
    room = max_total - len(suffix)
    if len(title) <= room:
        return title + suffix
    t = title[: room - 3].rsplit(" ", 1)[0].rstrip(",;:- ")
    return t + "..." + suffix


def tags_for(meta: dict) -> str:
    slug = meta["slug"].lower()
    tags = ["Middle East", "Gulf nursing", "Exam preparation", "International nurses", "Patient safety"]
    if any(
        x in slug
        for x in (
            "uae",
            "dubai",
            "dha",
            "haad",
            "doh",
            "emirates",
            "moh-nursing",
            "abu-dhabi",
            "scope-of-practice-uae",
        )
    ):
        tags.append("UAE")
    if "saudi" in slug or "scfhs" in slug:
        tags.append("Saudi Arabia")
    if "qatar" in slug or "qchp" in slug:
        tags.append("Qatar")
    if "prometric" in slug or "nclex" in slug:
        tags.append("Prometric")
    if "nclex" in slug:
        tags.append("NCLEX-RN")
    tags.append("Clinical judgment")
    tags.append("Licensing")
    # de-dupe preserve order
    seen: set[str] = set()
    out: list[str] = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return ", ".join(out[:8])


def build_frontmatter(meta: dict) -> str:
    title = meta["title"]
    slug = meta["slug"]
    excerpt = (
        f"Educational exam prep for nurses targeting {meta['country']} licensing discussions "
        f"({meta['exam']}): clinical safety refresh, documentation, IPC, and test strategy—verify all eligibility rules officially."
    )
    seo_title = shorten_seo_title(title)
    lead = meta["title"].split(":")[0].strip()
    if len(lead) > 52:
        lead = lead[:49].rsplit(" ", 1)[0] + "..."
    seo_desc = (
        f"{lead}: Gulf licensing exam prep (clinical judgment, meds, IPC, charting, escalation). "
        f"Educational only; confirm rules with official authorities."
    )
    if len(seo_desc) > 158:
        seo_desc = clip_seo_desc(seo_desc)
    tags_csv = tags_for(meta)
    cat = "International Nursing"
    lines = [
        "---",
        f"slug: {slug}",
        f"title: {yaml_escape(title)}",
        f"excerpt: {yaml_escape(excerpt)}",
        f"category: {cat}",
        f"tags: {tags_csv}",
        "publishedAt: 2026-05-09",
        "updatedAt: 2026-05-09",
        f"seoTitle: {yaml_escape(seo_title)}",
        f"seoDescription: {yaml_escape(seo_desc)}",
        f"canonicalUrl: /blog/{slug}",
        "authorDisplayName: NurseNest Editorial",
        "medicalReviewerName: Clinical review board (educational)",
        f"disclaimer: {yaml_escape(DISCLAIMER)}",
        "---",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    slugs = [p["slug"] for p in POSTS]
    title_by_slug = {p["slug"]: p["title"] for p in POSTS}
    report: list[str] = []
    for meta in POSTS:
        body = build_body(meta, slugs, title_by_slug)
        wc = word_count(body)
        fm = build_frontmatter(meta)
        text = fm + body + "\n"
        path = OUT / f"{meta['slug']}.md"
        path.write_text(text, encoding="utf-8")
        report.append(f"| {meta['title'][:50]}… | `{meta['slug']}` | {meta['country'][:24]} | {wc} |")
    print("Wrote", len(POSTS), "files to", OUT)
    for line in report[:5]:
        print(line)
    print("...")


if __name__ == "__main__":
    main()
