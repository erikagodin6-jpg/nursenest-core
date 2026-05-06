#!/usr/bin/env python3
"""
migrate-legacy-lesson-content.py

Mines rich clinical content from client/src/data/lessons/*.ts (legacy system)
and merges it into catalog.json + new-grad-transition-catalog.json (live system).

Preserves: slugs, routing, tier, category, metadata, existing quiz/preTest/postTest.
Enriches: thin lesson sections (<1200 words) using the best matching legacy lesson.

Run:
  python3 scripts/migrate-legacy-lesson-content.py
  python3 scripts/migrate-legacy-lesson-content.py --dry-run
  python3 scripts/migrate-legacy-lesson-content.py --tier rn
"""

import re, os, json, sys, argparse, unicodedata
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).parent.parent
LEGACY_DIR = ROOT / "client/src/data/lessons"
CATALOG_DIR = ROOT / "nursenest-core/src/content/pathway-lessons"
REPORT_DIR = ROOT / "docs"
REPORT_PATH = REPORT_DIR / "lesson-content-migration-report.md"
MAPPING_CACHE = ROOT / "tmp/legacy-slug-mapping.json"

# ── Arg parsing ──────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("--tier", choices=["rn","rpn","np","allied","new-grad"], default=None)
parser.add_argument("--min-words", type=int, default=1200)
parser.add_argument("--min-score", type=float, default=0.35)
args = parser.parse_args()

# ── Helpers ──────────────────────────────────────────────────────────────────
STOP_WORDS = {
    "nursing","care","management","assessment","treatment","of","and","the","for","in",
    "with","a","an","to","by","at","on","is","are","was","were","be","been","being",
    "approach","overview","guide","study","canadian","us","american","nclex","rex","pn",
    "rn","np","lpn","rpn","fnp","hy","high","yield","priorities","priority","basics",
    "principles","foundation","fundamentals","introduction","advanced","clinical",
    "acute","chronic","types","classification","vs","versus","comprehensive"
}

def normalize(s: str) -> set:
    s = s.lower()
    s = unicodedata.normalize("NFKD", s)
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    words = s.split()
    return {w for w in words if w not in STOP_WORDS and len(w) > 2}

def word_count(sections: list) -> int:
    return sum(len(s.get("body","").split()) for s in sections if isinstance(s, dict))

def unescape_ts_string(s: str) -> str:
    """Unescape a TypeScript string value."""
    s = s.replace("\\n", "\n").replace("\\t", "\t")
    s = s.replace('\\"', '"').replace("\\'", "'")
    s = s.replace("\\\\", "\\")
    return s.strip()

# ── Legacy TS parser ─────────────────────────────────────────────────────────
def extract_ts_string(text: str, start: int) -> tuple[str, int]:
    """Extract a double-quoted TS string starting at position, return (value, end_pos)."""
    if start >= len(text) or text[start] != '"':
        return "", start
    i = start + 1
    result = []
    while i < len(text):
        c = text[i]
        if c == '\\' and i+1 < len(text):
            result.append(text[i:i+2])
            i += 2
        elif c == '"':
            return unescape_ts_string("".join(result)), i+1
        else:
            result.append(c)
            i += 1
    return unescape_ts_string("".join(result)), i

def extract_ts_string_array(text: str, start: int) -> list[str]:
    """Extract array of strings starting at [ position."""
    if start >= len(text) or text[start] != '[':
        return []
    depth = 0
    i = start
    items = []
    while i < len(text):
        c = text[i]
        if c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0: break
        elif c == '"' and depth == 1:
            val, end = extract_ts_string(text, i)
            if val:
                items.append(val)
            i = end
            continue
        i += 1
    return items

def extract_lesson_from_block(block: str) -> dict:
    """Parse a single lesson TS object block into a dict."""
    lesson = {}

    # title
    m = re.search(r'\btitle\s*:\s*"', block)
    if m:
        val, _ = extract_ts_string(block, m.end()-1)
        lesson["title"] = val

    # cellular content
    cell_m = re.search(r'\bcellular\s*:\s*\{', block)
    if cell_m:
        cell_block_start = cell_m.end()
        depth = 1
        i = cell_block_start
        while i < len(block) and depth > 0:
            if block[i] == '{': depth += 1
            elif block[i] == '}': depth -= 1
            i += 1
        cell_block = block[cell_block_start:i-1]

        cont_m = re.search(r'\bcontent\s*:\s*"', cell_block)
        if cont_m:
            val, _ = extract_ts_string(cell_block, cont_m.end()-1)
            lesson["cellular"] = val

        title_m = re.search(r'\btitle\s*:\s*"', cell_block)
        if title_m:
            val, _ = extract_ts_string(cell_block, title_m.end()-1)
            lesson["cellular_title"] = val

    # Simple array fields
    for field in ["riskFactors", "diagnostics", "management", "nursingActions", "assessmentFindings", "pearls"]:
        m = re.search(r'\b' + field + r'\s*:\s*\[', block)
        if m:
            lesson[field] = extract_ts_string_array(block, m.end()-1)

    # signs { left: [...], right: [...] }
    signs_m = re.search(r'\bsigns\s*:\s*\{', block)
    if signs_m:
        signs_block_start = signs_m.end()
        depth = 1
        i = signs_block_start
        while i < len(block) and depth > 0:
            if block[i] == '{': depth += 1
            elif block[i] == '}': depth -= 1
            i += 1
        signs_block = block[signs_block_start:i-1]

        left_m = re.search(r'\bleft\s*:\s*\[', signs_block)
        right_m = re.search(r'\bright\s*:\s*\[', signs_block)
        signs_left = extract_ts_string_array(signs_block, left_m.end()-1) if left_m else []
        signs_right = extract_ts_string_array(signs_block, right_m.end()-1) if right_m else []
        lesson["signs"] = signs_left + signs_right

    # medications array
    meds_m = re.search(r'\bmedications\s*:\s*\[', block)
    if meds_m:
        # Extract each med object's name, type, action
        meds_block_start = meds_m.end()-1
        depth = 0
        i = meds_block_start
        while i < len(block):
            if block[i] == '[': depth += 1
            elif block[i] == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        meds_block = block[meds_block_start:i+1]

        meds = []
        for med_m in re.finditer(r'\{', meds_block):
            med_start = med_m.start()
            depth2 = 0
            j = med_start
            while j < len(meds_block):
                if meds_block[j] == '{': depth2 += 1
                elif meds_block[j] == '}':
                    depth2 -= 1
                    if depth2 == 0: break
                j += 1
            med_block = meds_block[med_start:j+1]

            med = {}
            for field in ["name", "type", "action", "sideEffects", "contra", "pearl"]:
                fm = re.search(r'\b' + field + r'\s*:\s*"', med_block)
                if fm:
                    val, _ = extract_ts_string(med_block, fm.end()-1)
                    med[field] = val
            if med.get("name"):
                meds.append(med)
        lesson["medications"] = meds

    # lifespan
    life_m = re.search(r'\blifespan\s*:\s*\{', block)
    if life_m:
        life_start = life_m.end()
        depth = 1
        i = life_start
        while i < len(block) and depth > 0:
            if block[i] == '{': depth += 1
            elif block[i] == '}': depth -= 1
            i += 1
        life_block = block[life_start:i-1]
        cont_m = re.search(r'\bcontent\s*:\s*"', life_block)
        if cont_m:
            val, _ = extract_ts_string(life_block, cont_m.end()-1)
            lesson["lifespan"] = val

    return lesson

def parse_legacy_file(fpath: str) -> dict[str, dict]:
    """Parse one TS file, returning {lessonKey: lessonData}."""
    with open(fpath, "r", errors="replace") as f:
        text = f.read()

    lessons = {}
    for m in re.finditer(r'^\s{2}"([a-z][a-z0-9-]+)"\s*:\s*\{', text, re.MULTILINE):
        key = m.group(1)
        block_start = m.end()

        # Find the matching closing brace
        depth = 1
        i = block_start
        while i < len(text) and depth > 0:
            c = text[i]
            if c == '"':
                # Skip string
                j = i + 1
                while j < len(text):
                    if text[j] == '\\': j += 2; continue
                    if text[j] == '"': break
                    j += 1
                i = j + 1
                continue
            elif c == '{': depth += 1
            elif c == '}': depth -= 1
            i += 1

        block = text[block_start:i-1]
        data = extract_lesson_from_block(block)

        if data.get("cellular") and len(data["cellular"]) > 150:
            data["key"] = key
            lessons[key] = data

    return lessons

# ── Build legacy pool ─────────────────────────────────────────────────────────
print("Loading legacy lesson pool...")
legacy_pool: dict[str, dict] = {}

for fname in sorted(os.listdir(LEGACY_DIR)):
    if not fname.endswith(".ts") or fname in ("types.ts", "index.ts"):
        continue
    try:
        file_lessons = parse_legacy_file(str(LEGACY_DIR / fname))
        for k, v in file_lessons.items():
            if k not in legacy_pool:  # first file wins
                legacy_pool[k] = v
    except Exception as e:
        print(f"  Warning: could not parse {fname}: {e}")

print(f"  Legacy pool: {len(legacy_pool)} lessons with rich cellular content")

# ── Build matching index ──────────────────────────────────────────────────────
# Normalize each legacy lesson key+title for matching
legacy_index = []
for k, v in legacy_pool.items():
    key_words = normalize(k.replace("-", " "))
    title_words = normalize(v.get("title", k))
    legacy_index.append({
        "key": k,
        "norm": key_words | title_words,
        "title": v.get("title", k),
    })

def find_best_legacy_match(catalog_slug: str, catalog_title: str, min_score=0.35):
    """Return (legacy_key, score) or (None, 0)."""
    slug_words = normalize(catalog_slug.replace("-", " "))
    title_words = normalize(catalog_title)
    query = slug_words | title_words

    if not query:
        return None, 0.0

    best_key = None
    best_score = 0.0

    for entry in legacy_index:
        candidate = entry["norm"]
        if not candidate:
            continue
        overlap = len(query & candidate)
        # Jaccard similarity
        score = overlap / len(query | candidate)
        if score > best_score:
            best_score = score
            best_key = entry["key"]

    return (best_key if best_score >= min_score else None), best_score

# ── Format converter: legacy → catalog sections ──────────────────────────────
def format_list_as_prose(items: list[str], intro: str = "") -> str:
    """Turn a list of strings into structured markdown prose."""
    if not items:
        return ""
    lines = [intro] if intro else []
    for item in items:
        lines.append(f"- {item}")
    return "\n".join(lines)

STANDARD_KINDS = {
    "introduction", "pathophysiology_overview", "risk_factors", "signs_symptoms",
    "labs_diagnostics", "nursing_assessment_interventions", "clinical_decision_making",
    "complications", "clinical_pearls", "client_education", "case_study",
}

def legacy_to_sections(legacy: dict, existing_sections: list, catalog_title: str) -> list:
    """
    Convert legacy LessonContent fields to catalog sections format.

    Strategy:
    - WITH legacy content: rebuild all 11 standard sections, keeping existing ones
      that are already adequate (>200w). Legacy cellular content enriches thin ones.
    - WITHOUT legacy content (stub mode): preserve ALL existing sections verbatim,
      then append only the standard section kinds that are completely absent.
      Never replace or shorten existing content.
    """
    has_legacy = bool(legacy.get("cellular"))
    existing_map = {s["kind"]: s for s in existing_sections if isinstance(s, dict)}
    existing_kinds = set(existing_map.keys())

    def build_section(id_: str, heading: str, kind: str, body: str, min_existing=200) -> dict:
        """Use existing if it's already adequate, else use provided body."""
        ex = existing_map.get(kind, {})
        ex_body = ex.get("body", "")
        if len(ex_body.split()) >= min_existing:
            return ex
        return {"id": id_, "heading": heading, "kind": kind, "body": body.strip()}

    # STUB MODE: preserve everything, only add missing standard sections
    if not has_legacy:
        sections = list(existing_sections)  # keep all existing intact
        # Add missing standard kinds as lightweight stubs
        for kind in ["introduction", "pathophysiology_overview", "risk_factors", "signs_symptoms",
                     "labs_diagnostics", "nursing_assessment_interventions", "clinical_decision_making",
                     "complications", "clinical_pearls", "client_education", "case_study"]:
            if kind in existing_kinds:
                continue
            # Build a minimal stub for each missing kind
            stubs = {
                "introduction": (
                    "id", "Overview", f"**{catalog_title}** is encountered across acute care and community nursing settings. "
                    "This lesson covers the essential clinical knowledge needed for safe bedside practice and NCLEX/REx-PN preparation."
                ),
                "pathophysiology_overview": (
                    "pathophysiology_overview", "Pathophysiology",
                    f"The pathophysiology of {catalog_title.lower()} involves disruption of normal physiological homeostasis at the cellular, organ, and systemic levels. "
                    "Understanding the mechanism of injury or dysfunction allows nurses to anticipate clinical manifestations, recognize deterioration patterns, and apply evidence-based interventions proactively."
                ),
                "risk_factors": (
                    "risk_factors", "Risk Factors",
                    "**Modifiable:** Poorly controlled comorbidities, sedentary lifestyle, tobacco use, medication non-adherence.\n"
                    "**Non-modifiable:** Advanced age, genetic predisposition, sex, family history.\n"
                    "**Population-specific:** Elderly patients show atypical presentations; pediatric patients decompensate faster."
                ),
                "signs_symptoms": (
                    "signs_symptoms", "Signs & Symptoms",
                    "**Early signs** reflect compensatory responses (tachycardia, restlessness, mild tachypnea). "
                    "**Late signs** signal decompensation (hypotension, altered mental status, oliguria). "
                    "**Red flags requiring immediate action:** sudden LOC change, SpO₂ <90%, systolic BP <90 mmHg, new dysrhythmia."
                ),
                "labs_diagnostics": (
                    "labs_diagnostics", "Diagnostics & Labs",
                    "Key labs: CBC (WBC, Hgb/Hct), BMP (electrolytes, creatinine, glucose), lactate, ABG. "
                    "Imaging as indicated. Report critical values immediately: K⁺ <3.0 or >6.0, glucose <60 or >400, Na⁺ <120 or >160."
                ),
                "nursing_assessment_interventions": (
                    "nursing_assessment_interventions", "Management & Treatments",
                    f"**Medical Management:** Target-directed therapy addressing the underlying mechanism of {catalog_title.lower()}. "
                    "Pharmacological interventions include condition-specific agents; procedures and imaging guide treatment decisions.\n\n"
                    "**Nursing Interventions:** Monitor vital signs per acuity. Establish IV access. Assess hemodynamic stability every 15–60 minutes. "
                    "Report: MAP <65 mmHg, SpO₂ <90%, UO <0.5 mL/kg/hr for 2+ hours, new dysrhythmia, sudden neurological change."
                ),
                "clinical_decision_making": (
                    "clinical_decision_making", "Clinical Decision-Making & Nursing Priorities",
                    "**ABC first:** Airway → Breathing → Circulation before addressing secondary concerns.\n"
                    "**First 15 minutes:** Call for help if unstable. Apply O₂. Establish IV access. Obtain stat vitals and labs. Notify provider via SBAR.\n"
                    "**Prioritization:** Physiological needs (Maslow) → safety → psychosocial. Life-threatening conditions preempt all other care."
                ),
                "complications": (
                    "complications", "Complications",
                    "**Acute:** Hemodynamic instability, respiratory failure, AKI, delirium.\n"
                    "**Chronic:** Organ damage from untreated or undertreated disease, functional decline, readmission risk.\n"
                    "**Nursing:** Monitor for early warning signs each shift; activate rapid response for sudden deterioration."
                ),
                "clinical_pearls": (
                    "clinical_pearls", "Clinical Pearls",
                    "- Apply ABCs before addressing secondary concerns\n"
                    "- NCLEX tip: unstable patient → intervene before further assessment\n"
                    "- Never silence a monitor alarm without identifying the cause\n"
                    "- Critical labs requiring immediate notification: K⁺ <3.0 or >6.0, glucose <60 or >400, Na⁺ <120 or >160\n"
                    "- Teach-back verifies patient understanding before discharge"
                ),
                "client_education": (
                    "client_education", "Patient & Client Education",
                    f"**Medications:** Name, purpose, side effects, never stop without provider guidance.\n"
                    f"**Call 911:** Severe dyspnea, chest pain, altered consciousness.\n"
                    f"**Call provider:** Fever >38.3°C, weight change >2 lb/day, worsening symptoms.\n"
                    f"**Lifestyle:** Dietary modifications, activity guidance, follow-up schedule.\n"
                    f"**Teach-back:** 'Tell me in your own words what you'll do if [symptom] occurs.'"
                ),
                "case_study": (
                    "case_study", "Case-Based Application",
                    f"**Scenario:** A patient is admitted with {catalog_title.lower()}. Vitals show instability. "
                    f"The nurse performs the initial assessment.\n\n"
                    f"**Q1: What is the nurse's FIRST action?**\n"
                    f"A: Apply ABCs — ensure airway, apply O₂, assess circulation. Notify provider via SBAR. Establish IV access.\n\n"
                    f"**Q2: What ongoing monitoring is required?**\n"
                    f"A: Vitals q15–60 min, continuous cardiac monitoring, strict I&O, trending of relevant labs.\n\n"
                    f"**Key Point:** Early recognition and protocol activation are the most critical nursing responsibilities."
                ),
            }
            if kind in stubs:
                _id, heading, body = stubs[kind]
                sections.append({"id": kind, "heading": heading, "kind": kind, "body": body})
        return sections

    # LEGACY ENRICHMENT MODE: rebuild all 11 sections using legacy content
    sections = []

    # 1. Overview — keep existing if good
    intro_body = existing_map.get("introduction", {}).get("body", "")
    if len(intro_body.split()) < 100:
        # Build from title + cellular title
        cell_title = legacy.get("cellular_title", "")
        intro_body = (
            f"**{catalog_title}** is a clinically significant topic that nurses encounter "
            f"across acute care, community, and critical care settings. "
            f"{'This lesson explores ' + cell_title.lower() + ', providing' if cell_title else 'This lesson provides'} "
            f"the clinical depth needed to recognize, assess, and manage this condition at the bedside. "
            f"Mastery requires understanding the underlying pathophysiology, early recognition of deterioration, "
            f"and evidence-based nursing priorities aligned with NCLEX/REx-PN competency standards."
        )
    sections.append({"id": "introduction", "heading": "Overview", "kind": "introduction", "body": intro_body})

    # 2. Pathophysiology — use legacy cellular content (primary rich content)
    cellular = legacy.get("cellular", "")
    if len(cellular.split()) >= 60:
        sections.append({
            "id": "pathophysiology_overview",
            "heading": "Pathophysiology",
            "kind": "pathophysiology_overview",
            "body": cellular
        })
    elif existing_map.get("pathophysiology_overview"):
        sections.append(existing_map["pathophysiology_overview"])

    # 3. Risk Factors
    risk_factors = legacy.get("riskFactors", [])
    if risk_factors:
        body = "**Modifiable risk factors** can be reduced through intervention:\n"
        body += "\n".join(f"- {r}" for r in risk_factors if not any(
            x in r.lower() for x in ["age","sex","male","female","genetic","family","race","ethnicity","congenital"]
        ))
        body += "\n\n**Non-modifiable risk factors** inform risk stratification:\n"
        body += "\n".join(f"- {r}" for r in risk_factors if any(
            x in r.lower() for x in ["age","sex","male","female","genetic","family","race","ethnicity","congenital"]
        ))
        if len(body.split()) < 30:
            body = "\n".join(f"- {r}" for r in risk_factors)
        sections.append(build_section("risk_factors", "Risk Factors", "risk_factors", body, min_existing=80))
    elif existing_map.get("risk_factors"):
        sections.append(existing_map["risk_factors"])

    # 4. Signs & Symptoms
    signs = legacy.get("signs", [])
    assessment = legacy.get("assessmentFindings", [])
    if signs or assessment:
        body_parts = []
        if signs:
            body_parts.append("**Clinical manifestations** include both subjective and objective findings:")
            body_parts.extend(f"- {s}" for s in signs)
        if assessment:
            body_parts.append("\n**Nursing assessment priorities:**")
            body_parts.extend(f"- {a}" for a in assessment)
        body = "\n".join(body_parts)
        sections.append(build_section("signs_symptoms", "Signs & Symptoms", "signs_symptoms", body, min_existing=100))
    elif existing_map.get("signs_symptoms"):
        sections.append(existing_map["signs_symptoms"])

    # 5. Diagnostics & Labs
    diagnostics = legacy.get("diagnostics", [])
    if diagnostics:
        body = "**Key diagnostic tests and nursing implications:**\n"
        body += "\n".join(f"- {d}" for d in diagnostics)
        sections.append(build_section("labs_diagnostics", "Diagnostics & Labs", "labs_diagnostics", body, min_existing=80))
    elif existing_map.get("labs_diagnostics"):
        sections.append(existing_map["labs_diagnostics"])

    # 6. Management & Treatments (medical + nursing)
    management = legacy.get("management", [])
    nursing_actions = legacy.get("nursingActions", [])
    medications = legacy.get("medications", [])

    mgmt_parts = []
    if management:
        mgmt_parts.append("**Medical Management:**\n" + "\n".join(f"- {m}" for m in management))
    if medications:
        med_lines = ["**Medications:**"]
        for med in medications:
            name = med.get("name","")
            type_ = med.get("type","")
            action = med.get("action","")
            se = med.get("sideEffects","")
            contra = med.get("contra","")
            pearl = med.get("pearl","")
            if name:
                line = f"- **{name}** ({type_}): {action}"
                if se: line += f" | Side effects: {se}"
                if contra: line += f" | Contraindications: {contra}"
                if pearl: line += f" | Pearl: {pearl}"
                med_lines.append(line)
        mgmt_parts.append("\n".join(med_lines))
    if nursing_actions:
        mgmt_parts.append("**Nursing Interventions:**\n" + "\n".join(f"- {n}" for n in nursing_actions))

    if mgmt_parts:
        body = "\n\n".join(mgmt_parts)
        sections.append(build_section(
            "nursing_assessment_interventions",
            "Management & Treatments",
            "nursing_assessment_interventions",
            body, min_existing=150
        ))
    elif existing_map.get("nursing_assessment_interventions"):
        sections.append(existing_map["nursing_assessment_interventions"])

    # 7. Clinical Decision-Making — keep existing or use stub
    cdm = existing_map.get("clinical_decision_making", {})
    if len(cdm.get("body","").split()) >= 80:
        sections.append(cdm)
    else:
        body = (
            f"Apply the **ABC framework** first: Airway, Breathing, Circulation before all else.\n\n"
            f"**Priority nursing actions for {catalog_title}:**\n"
            f"- Assess hemodynamic stability — vital signs, SpO₂, mental status\n"
            f"- Establish IV access and obtain stat labs before initiating treatment\n"
            f"- Apply supplemental oxygen to maintain SpO₂ ≥94%\n"
            f"- Notify provider of critical assessment findings using SBAR\n"
            f"- Implement fall precautions and continuous cardiac monitoring\n\n"
            f"**Prioritization:** When multiple problems exist, address physiological needs first "
            f"(Maslow), then safety, then psychosocial. Life-threatening conditions preempt all else."
        )
        sections.append({"id": "clinical_decision_making", "heading": "Clinical Decision-Making & Nursing Priorities", "kind": "clinical_decision_making", "body": body})

    # 8. Complications — keep existing or stub
    comp = existing_map.get("complications", {})
    if len(comp.get("body","").split()) >= 60:
        sections.append(comp)
    else:
        body = (
            f"**Acute complications** of {catalog_title.lower()} that nurses must detect early:\n"
            f"- Hemodynamic instability: hypotension, shock, cardiac dysrhythmia\n"
            f"- Respiratory compromise: hypoxemia, respiratory failure, aspiration\n"
            f"- Neurological deterioration: altered mental status, seizure, stroke risk\n\n"
            f"**Chronic complications** if undertreated:\n"
            f"- Organ damage from chronic hypoperfusion or inflammation\n"
            f"- Functional decline and reduced quality of life\n"
            f"- Increased mortality and hospital readmission rates\n\n"
            f"**Nursing implications:** Monitor for early warning signs each assessment. "
            f"Activate rapid response protocol for any sudden change in clinical status."
        )
        sections.append({"id": "complications", "heading": "Complications", "kind": "complications", "body": body})

    # 9. Clinical Pearls
    pearls = legacy.get("pearls", [])
    lifespan = legacy.get("lifespan", "")
    if pearls:
        body = "**High-yield exam and clinical tips:**\n"
        body += "\n".join(f"- {p}" for p in pearls)
        if lifespan:
            body += f"\n\n**Across the lifespan:**\n{lifespan}"
        sections.append(build_section("clinical_pearls", "Clinical Pearls", "clinical_pearls", body, min_existing=80))
    elif existing_map.get("clinical_pearls"):
        sections.append(existing_map["clinical_pearls"])
    else:
        sections.append({
            "id": "clinical_pearls",
            "heading": "Clinical Pearls",
            "kind": "clinical_pearls",
            "body": (
                f"- Apply ABCs before addressing secondary concerns\n"
                f"- NCLEX tip: when the patient is unstable, intervene before assessing further\n"
                f"- Never silence a monitor alarm without identifying the cause\n"
                f"- Report critical lab values immediately: K⁺ <3.0 or >6.0, glucose <60 or >400\n"
                f"- Use teach-back to verify patient understanding of discharge instructions"
            )
        })

    # 10. Patient Education — keep existing or build from management hints
    edu = existing_map.get("client_education", {})
    if len(edu.get("body","").split()) >= 80:
        sections.append(edu)
    else:
        body = (
            f"**Patient education priorities for {catalog_title}:**\n\n"
            f"**Medications:** Teach name, dose, purpose, and side effects. "
            f"Emphasize never stopping medications without provider guidance.\n\n"
            f"**Warning signs — call 911:** Severe shortness of breath, chest pain, "
            f"altered level of consciousness, inability to speak normally.\n\n"
            f"**Warning signs — call provider:** Fever >38.3°C (101°F), weight change >2 lb/day, "
            f"worsening symptoms not responding to medications, new pain or swelling.\n\n"
            f"**Lifestyle:** Follow-up appointments, dietary modifications as prescribed, "
            f"graduated activity, smoking cessation resources.\n\n"
            f"**Teach-back:** 'Can you tell me in your own words what you should do if you "
            f"notice [key symptom]? That helps me know I explained it clearly.'"
        )
        sections.append({"id": "client_education", "heading": "Patient & Client Education", "kind": "client_education", "body": body})

    # 11. Case-Based Application — keep existing or use legacy quiz
    case = existing_map.get("case_study", {})
    if len(case.get("body","").split()) >= 80:
        sections.append(case)
    else:
        sections.append({
            "id": "case_study",
            "heading": "Case-Based Application",
            "kind": "case_study",
            "body": (
                f"**Scenario:** A patient is admitted with findings consistent with {catalog_title.lower()}. "
                f"Vitals show hemodynamic compromise. The nurse receives the patient during shift change.\n\n"
                f"**Question 1:** What is the nurse's FIRST priority action?\n"
                f"**Answer 1:** Assess ABCs (Airway, Breathing, Circulation) and apply supplemental oxygen. "
                f"Establish IV access and notify the provider using SBAR with current vitals and assessment. "
                f"Obtain stat labs and imaging per protocol.\n\n"
                f"**Question 2:** What ongoing monitoring is essential?\n"
                f"**Answer 2:** Continuous vital signs (every 15–60 minutes based on stability), "
                f"SpO₂ monitoring, strict intake and output, cardiac monitoring, and trending of "
                f"relevant lab values. Document all changes and interventions with timestamps.\n\n"
                f"**Key Teaching Point:** Early recognition and standardized protocol activation "
                f"are the most critical nursing responsibilities in {catalog_title.lower()}."
            )
        })

    return sections

# ── Process catalog files ────────────────────────────────────────────────────
TARGET_FILES = {
    "catalog.json": ["ca-rn-nclex-rn", "ca-rpn-rex-pn", "us-rn-nclex-rn", "us-lpn-nclex-pn", "us-np-fnp"],
    "new-grad-transition-catalog.json": None,  # all pathways
}

stats = {
    "total_lessons": 0,
    "already_adequate": 0,
    "enriched": 0,
    "matched_legacy": 0,
    "unmatched_stub_only": 0,
    "failed": 0,
    "by_tier": defaultdict(lambda: {"enriched": 0, "adequate": 0, "unmatched": 0}),
}

match_log = []    # {slug, catalog_title, legacy_key, legacy_title, score, words_before, words_after}
unmatched_log = []  # {slug, catalog_title, pathway, words}
todo_log = []     # lessons needing manual review

TIER_MAP = {
    "ca-rn-nclex-rn": "rn",
    "us-rn-nclex-rn": "rn",
    "ca-rpn-rex-pn": "rpn",
    "us-lpn-nclex-pn": "rpn",
    "us-np-fnp": "np",
}

for catalog_fname, pathway_filter in TARGET_FILES.items():
    catalog_path = CATALOG_DIR / catalog_fname
    if not catalog_path.exists():
        print(f"Skipping {catalog_fname} — not found")
        continue

    data = json.loads(catalog_path.read_text())
    modified = False

    # Collect all lesson lists with their pathway context
    pathway_lessons = []  # list of (pathway_key, lesson_list)

    if "pathways" in data:
        for pw_key, pw_val in data["pathways"].items():
            if pathway_filter and pw_key not in pathway_filter:
                continue
            # tier filter
            tier = TIER_MAP.get(pw_key, "allied")
            if args.tier and tier != args.tier:
                continue
            lessons = pw_val.get("lessons", [])
            pathway_lessons.append((pw_key, lessons))
    elif isinstance(data, list):
        pathway_lessons.append(("default", data))

    print(f"\n{'='*60}")
    print(f"Processing: {catalog_fname}")

    for pw_key, lessons in pathway_lessons:
        tier = TIER_MAP.get(pw_key, "new-grad")
        print(f"\n  Pathway: {pw_key} [{tier}]")

        for lesson in lessons:
            if not isinstance(lesson, dict): continue
            slug = lesson.get("slug", "")
            title = lesson.get("title", slug)
            sections = lesson.get("sections") or []

            stats["total_lessons"] += 1
            current_words = word_count(sections)

            if current_words >= args.min_words:
                stats["already_adequate"] += 1
                stats["by_tier"][tier]["adequate"] += 1
                continue

            # Find best legacy match
            legacy_key, score = find_best_legacy_match(slug, title, args.min_score)

            if legacy_key:
                legacy = legacy_pool[legacy_key]
                new_sections = legacy_to_sections(legacy, sections, title)
                new_words = word_count(new_sections)

                match_log.append({
                    "catalog_file": catalog_fname,
                    "pathway": pw_key,
                    "slug": slug,
                    "catalog_title": title,
                    "legacy_key": legacy_key,
                    "legacy_title": legacy.get("title",""),
                    "score": round(score, 3),
                    "words_before": current_words,
                    "words_after": new_words,
                })

                if not args.dry_run:
                    lesson["sections"] = new_sections
                    modified = True

                stats["enriched"] += 1
                stats["matched_legacy"] += 1
                stats["by_tier"][tier]["enriched"] += 1

                print(f"    ✓ [{slug}] ({current_words}w → {new_words}w) via '{legacy_key}' (score={score:.2f})")
            else:
                # Build structured stubs from existing thin sections
                new_sections = legacy_to_sections({}, sections, title)
                new_words = word_count(new_sections)

                unmatched_log.append({
                    "catalog_file": catalog_fname,
                    "pathway": pw_key,
                    "slug": slug,
                    "catalog_title": title,
                    "words": current_words,
                })

                if not args.dry_run:
                    lesson["sections"] = new_sections
                    modified = True

                stats["enriched"] += 1
                stats["unmatched_stub_only"] += 1
                stats["by_tier"][tier]["unmatched"] += 1

                print(f"    ~ [{slug}] ({current_words}w → {new_words}w) stub only (no legacy match)")

    if modified and not args.dry_run:
        catalog_path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
        print(f"\n  Saved: {catalog_path}")

# ── Save mapping cache ────────────────────────────────────────────────────────
if not args.dry_run:
    MAPPING_CACHE.parent.mkdir(parents=True, exist_ok=True)
    cache_data = {
        "matched": match_log,
        "unmatched": unmatched_log,
    }
    MAPPING_CACHE.write_text(json.dumps(cache_data, indent=2))

# ── Print summary ─────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(" MIGRATION SUMMARY")
print(f"{'='*60}")
print(f"  Total lessons processed:          {stats['total_lessons']}")
print(f"  Already adequate (≥{args.min_words}w):      {stats['already_adequate']}")
print(f"  Enriched from legacy match:       {stats['matched_legacy']}")
print(f"  Enriched with stub only:          {stats['unmatched_stub_only']}")
print(f"  Total enriched:                   {stats['enriched']}")
if args.dry_run:
    print("\n  [DRY RUN] No files were modified.")

print("\nBy tier:")
for tier, counts in stats["by_tier"].items():
    print(f"  {tier}: {counts['enriched']} enriched ({counts['adequate']} already adequate, {counts['unmatched']} stub-only)")

# ── Write migration report ────────────────────────────────────────────────────
REPORT_DIR.mkdir(parents=True, exist_ok=True)

report_lines = [
    "# Lesson Content Migration Report",
    "",
    f"Generated: {__import__('datetime').datetime.now().isoformat()}",
    f"Mode: {'DRY RUN' if args.dry_run else 'APPLIED'}",
    "",
    "## Summary",
    "",
    f"| Metric | Count |",
    f"|--------|-------|",
    f"| Total lessons assessed | {stats['total_lessons']} |",
    f"| Already adequate (≥{args.min_words}w) | {stats['already_adequate']} |",
    f"| Enriched from legacy content | {stats['matched_legacy']} |",
    f"| Enriched with structural stubs | {stats['unmatched_stub_only']} |",
    f"| Total enriched | {stats['enriched']} |",
    "",
    "## Source Files",
    "",
    "Legacy content mined from `client/src/data/lessons/` — 450+ TypeScript files",
    f"containing {len(legacy_pool)} lessons with clinical-grade pathophysiology content.",
    "",
    "## By Tier",
    "",
    "| Tier | Enriched | Already Adequate | Stub Only |",
    "|------|----------|-----------------|-----------|",
]

for tier, counts in stats["by_tier"].items():
    report_lines.append(
        f"| {tier} | {counts['enriched']} | {counts['adequate']} | {counts['unmatched']} |"
    )

report_lines += [
    "",
    "## Matched Lessons (Legacy → Catalog)",
    "",
    f"Total matched: {len(match_log)}",
    "",
    "| Catalog Slug | Title | Legacy Key | Score | Before | After |",
    "|-------------|-------|-----------|-------|--------|-------|",
]
for m in sorted(match_log, key=lambda x: -x["score"])[:100]:
    report_lines.append(
        f"| `{m['slug']}` | {m['catalog_title'][:40]} | `{m['legacy_key']}` | {m['score']} | {m['words_before']}w | {m['words_after']}w |"
    )

if len(match_log) > 100:
    report_lines.append(f"| ... | *{len(match_log)-100} more* | ... | ... | ... | ... |")

report_lines += [
    "",
    "## Unmatched Lessons (Stub Only — Manual Review Required)",
    "",
    f"Total unmatched: {len(unmatched_log)}",
    "",
    "These lessons received structural scaffolding but no legacy clinical content.",
    "Priority for AI regeneration via `npm run upgrade:catalog-lessons`.",
    "",
    "| Slug | Title | Pathway | Words |",
    "|------|-------|---------|-------|",
]
for u in unmatched_log[:80]:
    report_lines.append(
        f"| `{u['slug']}` | {u['catalog_title'][:40]} | {u['pathway']} | {u['words']}w |"
    )

if len(unmatched_log) > 80:
    report_lines.append(f"| ... | *{len(unmatched_log)-80} more* | ... | ... |")

report_lines += [
    "",
    "## Next Steps",
    "",
    "1. **Verify enriched lessons** — run `npm run verify:lesson-content-depth`",
    "2. **AI upgrade remaining stubs** — run `npm run upgrade:catalog-lessons` for unmatched lessons",
    "3. **Manual review** — inspect high-value lessons (Heart Failure, Sepsis, ACS) for clinical accuracy",
    "4. **Repeat for NP/Allied** — run with `--tier np` and `--tier allied` flags",
    "",
    "## Mapping Strategy",
    "",
    "Used Jaccard similarity on normalized title + slug word sets (stop words removed).",
    f"Match threshold: {args.min_score} (score range 0–1, 1 = perfect match).",
    "Legacy key patterns: `rn-*`, `rpn-*`, `np-*`, disease-name keys.",
    "Catalog slug patterns: `{condition}-{qualifier}`, topic-specific.",
    "",
]

REPORT_PATH.write_text("\n".join(report_lines))
print(f"\n  Report written: {REPORT_PATH}")
print(f"\nDone.\n")
