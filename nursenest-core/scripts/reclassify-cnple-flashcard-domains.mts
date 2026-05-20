/**
 * Reclassify CNPLE flashcard domains — Phase 1 of taxonomy + quality pass.
 *
 * Problem: 67% of cards (709/1,054) collapsed into "CNPLE — Advanced NP Practice"
 * because the original seed only keyed off bodySystem/topic, which are "General" /
 * "Advanced practice" for 87% of CNPLE lessons.
 *
 * Fix: classify by LESSON TITLE (the richest signal) + bodySystem/topic as fallbacks.
 *
 * New taxonomy: 15 CNPLE competency domains aligned to the CNPLE blueprint.
 * Strategy: UPDATE existing card categoryIds — preserves IDs, progress, study sessions.
 *
 * Usage:
 *   npx tsx scripts/reclassify-cnple-flashcard-domains.mts            # dry-run
 *   npx tsx scripts/reclassify-cnple-flashcard-domains.mts --apply    # write to DB
 */
import "@/lib/db/env-bootstrap";
import { prisma } from "./lib/prisma-script-client";

const DRY_RUN = !process.argv.includes("--apply");

const CNPLE_DECK_ID = "cmnxsjry200050ntcsbzo7378";
const CNPLE_PATHWAY_ID = "ca-np-cnple";

// ── New competency-based domain taxonomy ──────────────────────────────────────
export const CNPLE_COMPETENCY_DOMAINS = [
  "CNPLE — Pharmacology & Prescribing",
  "CNPLE — Diagnostics & Lab Interpretation",
  "CNPLE — Differential Diagnosis",
  "CNPLE — Acute & Urgent Care",
  "CNPLE — Cardiovascular",
  "CNPLE — Chronic Disease Management",
  "CNPLE — Women's Health",
  "CNPLE — Mental Health",
  "CNPLE — Pediatrics",
  "CNPLE — Geriatrics",
  "CNPLE — Primary Care & Prevention",
  "CNPLE — Professional Practice & Ethics",
  "CNPLE — Respiratory",
  "CNPLE — Endocrine & Metabolic",
  "CNPLE — Musculoskeletal & Rheumatology",
  "CNPLE — Neurological",
  "CNPLE — Renal & Genitourinary",
  "CNPLE — Infectious Disease",
  "CNPLE — Hematology & Oncology",
  "CNPLE — Gastrointestinal & Hepatic",
  "CNPLE — Dermatology & Skin",
  "CNPLE — Clinical Assessment",
  "CNPLE — Advanced NP Practice", // fallback — should be small after reclassification
] as const;

// ── Title-first domain resolver ───────────────────────────────────────────────
// Priority order matters: more specific domains before generic ones.
export function resolveDomainFromTitle(
  title: string,
  bodySystem: string,
  topic: string
): string {
  const t = (title ?? "").toLowerCase();
  const sys = (bodySystem ?? "").toLowerCase();
  const top = (topic ?? "").toLowerCase();

  // ── Pharmacology & Prescribing ──────────────────────────────────────────────
  if (
    /pharmacol|prescrib|drug.inter|dosing\b|drug.drug|ace.inhib|arb\b|beta.block|statin\b|warfarin|heparin\b|coumadin|apixaban|rivaroxaban|dabigatran|insulin\b|metformin|glp.1|sglt2|gluco|anticoagul|antiplatelet|antipsychot|antidepressant|ssri\b|snri\b|stimulant|benzodiaz|opioid|nsaid\b|naloxone|nac protocol|additive hypotension|polypharmacy|drug selection|drug choice|medication management|inhaler\b|inhaler selection|corticosteroid|thiazide|diuretic\b|calcium channel|nitrate\b|bronchodilator|antiepileptic|anticonvulsant|black box warning|ccb.*selection|augmentation|saba.laba|beta.agonist/.test(t) ||
    top.includes("pharmacol") ||
    sys.includes("pharmacol")
  )
    return "CNPLE — Pharmacology & Prescribing";

  // ── Diagnostics & Lab Interpretation ────────────────────────────────────────
  if (
    /\babg\b|\becg\b|12.lead|ekg\b|\bcbc\b|\bbmp\b|\bcmp\b|\ba1c\b|hba1c|urinalysis|troponin|spirometry|\bpft|imaging\b|x.ray\b|\bmri\b|ct scan|ultrasound|\bbiopsy|lab inter|lipid panel|thyroid function|creatinine|potassium\b|sodium\b|calcium\b|\binr\b|\bpt\/ptt|ana pattern|antinuclear antibody|serum|\bbnp\b|procalcitonin|d.dimer|ferritin|tibc|transferrin|hematocrit|hemoglobin|platelet|white blood|differential count|urine culture|blood culture|acid.base|fluid.*electrolyte|electrolyte.*fluid|anion gap|mudpiles|osmolar gap|borderline lab|b12.*criter|interpretation of|interpreting\b|reading an/.test(t)
  )
    return "CNPLE — Diagnostics & Lab Interpretation";

  // ── Differential Diagnosis ───────────────────────────────────────────────────
  if (
    /\bddx\b|differential diag|algorithm|workup\b|approach to|rule out|framework.*diag|diagnostic framework|clinical reasoning|diagnostic reasoning|etiology of/.test(t)
  )
    return "CNPLE — Differential Diagnosis";

  // ── Acute & Urgent Care ──────────────────────────────────────────────────────
  if (
    /acute\b|emergenc|crisis\b|\bshock\b|anaphylaxis|sepsis\b|overdose\b|torsion\b|critical care|trauma\b|urgent\b|hypertensive emergency|status epilep|adrenal crisis|thyroid storm|airway.*obstruct|respiratory fail|respiratory arrest|cardiac arrest|code blue|resuscitat|naloxone protocol|acetaminophen.*protocol|nac protocol|dka\b|hhs\b|hyperosm|toxidrome|carbon monoxide|blast injury|central line|brain death|poisoning\b/.test(t)
  )
    return "CNPLE — Acute & Urgent Care";

  // ── Women's Health ───────────────────────────────────────────────────────────
  if (
    /women.*health|obstet|prenatal|postpartum|antenatal|gynecol|gynaecol|uterine bleed|amenorrhea|menstrual|dysmenorrhea|\bpcos\b|pregnancy\b|cervical\b|ovarian\b|endometriosis|menopause|pelvic pain|contraception|emergency contraception|gestational|breastfeed|lactation|preeclampsia|eclampsia|ectopic|placenta|labour\b|delivery\b|perinatal|maternal|palm.coein|postpartum depression|postpartum hemorrhage|gestational diabetes|bartholin|bartholinitis|\baub\b|androgen insensitivity|breast exam|breast.*examination|vulvar/.test(t) ||
    top.includes("women") ||
    sys.includes("maternal")
  )
    return "CNPLE — Women's Health";

  // ── Pediatrics ───────────────────────────────────────────────────────────────
  if (
    /\bpediatric|\bpaediatric|child\b|infant\b|neonat|adolescent|newborn|childhood|developmental|growth chart|croup\b|epiglottitis|meningitis.*child|fever.*child|child.*fever|febrile seizure|\bapgar\b|rsv\b|otitis media|roseola|kawasaki|hand.foot.mouth/.test(t) ||
    sys.includes("pediatr") ||
    sys.includes("paediatr") ||
    top.includes("pediatr")
  )
    return "CNPLE — Pediatrics";

  // ── Mental Health ────────────────────────────────────────────────────────────
  if (
    /mental health|psychiatr|\badhd\b|depression\b|anxiety\b|bipolar\b|schizophren|\bptsd\b|\bocd\b|eating disorder|substance use|alcohol use|alcohol withdrawal|suicid|psychosis|delirium\b|cognitive impair|dementia\b|alzheimer|panic disorder|social anxiety|generalized anxiety|major depressive|peripartum depression|postpartum depression|anger management|dialectical|dbt\b|cbt\b|motivational interview|cage\b|audit.c|ciwa\b|cows\b|serotonin syndrome|augmentation strateg/.test(t) ||
    sys.includes("psychiatr") ||
    sys.includes("mental health") ||
    top.includes("psychiatric")
  )
    return "CNPLE — Mental Health";

  // ── Geriatrics ───────────────────────────────────────────────────────────────
  if (
    /geriatr|gerontol|elderly\b|older adult|aging physiol|ageing physiol|polypharmacy\b|frailty\b|falls? in\b|fall prevention|beers criteria|age.related|functional decline|advance.*care planning|goals.of.care|palliative care|end.of.life|hospice|age.related/.test(t) ||
    sys.includes("geriatr") ||
    top.includes("geriatr")
  )
    return "CNPLE — Geriatrics";

  // ── Cardiovascular ───────────────────────────────────────────────────────────
  if (
    /cardiac|cardio|heart\b|coronary|acs\b|afib\b|atrial fib|atrial flutter|\bmi\b|stemi\b|nstemi\b|angina\b|heart failure|chf\b|hfref|hfpef|arrhythmia|aortic|aaa\b|valve\b|pericarditis|endocarditis|cardiomyopathy|hypertension\b|hypertensive|antihypertensive|blood pressure|cholesterol\b|atherosclerosis|hemodynamic|ventricular|atrial\b|svt\b|vt\b|vf\b|bradycardia|tachycardia|aortic stenosis|aortic regurg|mitral|tricuspid|vascular\b|arrhythmogenesis|brugada|ascvd\b|dhp vs|dhp.*non.dhp/.test(t) ||
    sys.includes("cardio") ||
    top.includes("cardiovascular")
  )
    return "CNPLE — Cardiovascular";

  // ── Respiratory ──────────────────────────────────────────────────────────────
  if (
    /respirat|pulmon|lung\b|airway\b|\bcopd\b|asthma\b|pneumonia\b|pulmonary embolism|\bpe\b|ventilation|oxygenation|oxygen\b|bronchitis|bronchiol|pleural|spirometry\b|peak flow|dyspnea\b|breathless|obstructive|restrictive|ards\b|sleep apnea|osa\b|alpha.1 anti|airflow dynamics|inhalation therapy|bronchiectasis|status asthmaticus/.test(t) ||
    sys.includes("respirat") ||
    top.includes("respiratory")
  )
    return "CNPLE — Respiratory";

  // ── Endocrine & Metabolic ────────────────────────────────────────────────────
  if (
    /endocrine\b|diabetes\b|diabetic\b|thyroid\b|adrenal\b|pituitary|cortisol\b|insulin resist|hyperglycemia|hypoglycemia|metabolic syndrome|acid.base\b|electrolyte\b|calcium\b|magnesium\b|phosphate\b|sodium\b|potassium\b|hyperthyroid|hypothyroid|hashimoto|graves|cushing|addison|hyperparathyroid|hypoparathyroid|pheochromocytoma|carcinoid/.test(t) ||
    sys.includes("endocrine") ||
    top.includes("endocrine")
  )
    return "CNPLE — Endocrine & Metabolic";

  // ── Neurological ─────────────────────────────────────────────────────────────
  if (
    /\bneuro|\bstroke\b|seizure\b|epileps|headache\b|migraine\b|parkinson\b|\bals\b|\bms\b|multiple sclerosis|neuropathy\b|encephalo|intracranial|concussion|meningitis\b|subarachnoid|intracerebral|tia\b|aphasia\b|vertigo\b|syncope.*neuro|guillain|myasthenia|neuromuscular|cns\b|bell.?s palsy|bppv\b|cerebellar|cavernous sinus|cerebral venous|pontine myelinolysis|hemisection|brown.*sequard|brown.*s.quard/.test(t) ||
    sys.includes("neurolog")
  )
    return "CNPLE — Neurological";

  // ── Renal & Genitourinary ────────────────────────────────────────────────────
  if (
    /\brenal\b|kidney\b|\baki\b|\bckd\b|dialysis\b|hemodialysis|peritoneal dialysis|glomerulo|urinary\b|\buti\b|bladder\b|prostat|\bbph\b|turp\b|nephro|nephrotic|nephritic|urine.*renal|renal.*urine|fluid balance|acid.base.*renal|hematuria\b|proteinuria|benign prostatic|erectile|testicular|male.*infertil|balanitis\b/.test(t) ||
    sys.includes("renal")
  )
    return "CNPLE — Renal & Genitourinary";

  // ── Infectious Disease ───────────────────────────────────────────────────────
  if (
    /infectious|infection\b|antimicro|antibiotic\b|\bhiv\b|\bsti\b|\buti\b|sepsis\b|tuberculosis|\btb\b|cellulitis\b|wound.*infect|viral\b|bacterial\b|fungal\b|lyme\b|hepatitis\b|covid|influenza\b|pneumonia.*infect|meningitis.*infect|osteomyelitis|endocarditis.*infect|pyelonephritis|diverticulitis|appendicitis|c\. diff|clostridioid|fidaxomicin|antimicrobial/.test(t) ||
    sys.includes("infect")
  )
    return "CNPLE — Infectious Disease";

  // ── Musculoskeletal & Rheumatology ───────────────────────────────────────────
  if (
    /musculo|joint\b|bone\b|arthritis\b|back pain|fracture\b|osteoporosis\b|tendon\b|gout\b|rheumat|spondyl|bursitis|lyme.*joint|shoulder\b|knee\b|hip\b|spinal\b|lumbar\b|cervical.*spine|carpal tunnel|plantar|fibromyalgia|lupus\b|sjogren|polymyalgia|vasculitis\b|osteopenia/.test(t) ||
    sys.includes("musculo")
  )
    return "CNPLE — Musculoskeletal & Rheumatology";

  // ── Hematology & Oncology ────────────────────────────────────────────────────
  if (
    /hematol|anemia\b|coagul|oncol|cancer\b|malignant\b|lymphoma\b|leukemia\b|thrombocytopen|platelet\b|bleeding disorder|dvc\b|dic\b|hypercoagulable|thrombophilia|hemophilia|sickle cell|polycythemia|myeloma\b|breast cancer|colorectal cancer|prostate cancer|lung cancer|cervical cancer|antiphospholipid|antisynthetase|b12 deficiency|cobalamin\b|amyloidosis/.test(t) ||
    sys.includes("hematol")
  )
    return "CNPLE — Hematology & Oncology";

  // ── Gastrointestinal & Hepatic ───────────────────────────────────────────────
  if (
    /gastroint|\bliver\b|hepat|biliary|gallbladder|bowel\b|colorectal|\bibd\b|ulcerative colitis|crohn|gerd\b|pancreat|abdominal\b|\bgi\b|nausea\b|vomiting\b|diarrhea\b|constipat|dysphagia\b|anorectal|hemorrhoid|celiac\b|cirrhosis\b|ascites\b|varices|portal hypertension/.test(t) ||
    sys.includes("gastroint")
  )
    return "CNPLE — Gastrointestinal & Hepatic";

  // ── Dermatology & Skin ───────────────────────────────────────────────────────
  if (
    /dermat|skin\b|wound\b|acne\b|eczema\b|psoriasis|melanoma\b|keratosis|rash\b|alopecia\b|pruritis|urticaria|herpes\b|shingles\b|cellulitis.*skin|contact dermatitis|atopic dermatitis|scabies\b|tinea\b|impetigo|basal cell|squamous.*skin/.test(t) ||
    sys.includes("integument")
  )
    return "CNPLE — Dermatology & Skin";

  // ── Primary Care & Prevention ────────────────────────────────────────────────
  if (
    /screening\b|immunizat|immunisat|preventive\b|prevention\b|health promotion|lifestyle\b|counselling\b|counseling\b|smoking cessation|sdoh|social determinants|annual exam|well visit|primary care|health maintenance|cancer screen|cervical screen|breast screen|colorectal screen|diabetes screen|cardiovascular risk|framingham|framingham risk|naci\b|ctfphc\b|chep\b/.test(t) ||
    top.includes("primary care") ||
    top.includes("preventive") ||
    top.includes("health promot")
  )
    return "CNPLE — Primary Care & Prevention";

  // ── Professional Practice & Ethics ───────────────────────────────────────────
  if (
    /professional\b|ethic\b|legal\b|scope of practice|regulat|advance directive|goals.of.care|informed consent|confidential|cultural safety|cultural humility|indigenous health|indigenous\b|interprofessional|collaborative practice|leadership\b|documentation\b|health equity|structural racism|social justice|regulatory\b|liability\b|negligence\b|shared decision|patient education|client education|health literacy/.test(t)
  )
    return "CNPLE — Professional Practice & Ethics";

  // ── Clinical Assessment ───────────────────────────────────────────────────────
  if (
    /assessment\b|physical exam|history taking|clinical reasoning|diagnostic reasoning|auscultation\b|percussion\b|palpation\b|heent\b|head.*neck|advanced health assessment|functional.*assessment|psychosocial|health assessment/.test(t)
  )
    return "CNPLE — Clinical Assessment";

  // ── Immunology → Infectious Disease ──────────────────────────────────────────
  if (
    /immune\b|immunol|adaptive immunity|innate immunity|autoimmun|allerg|hypersensitiv|mast cell|complement\b|cytokine\b|interleukin|interferon/.test(t)
  )
    return "CNPLE — Infectious Disease";

  // ── Chronic Disease Management (catch-all for long-term condition management) ─
  if (
    /chronic\b|management of\b|long.term|maintenance therapy|ongoing management|disease management|complication.*of|managing\b/.test(t)
  )
    return "CNPLE — Chronic Disease Management";

  // ── Pharmacology catch-all (nutritional pharmacology, clinical pharmacokinetics) ─
  if (
    /pharmacokin|pharmacodyn|drug.*mechanism|mechanism.*drug|bioavailability|absorption\b|metabolism\b|clearance\b|half.life/.test(t)
  )
    return "CNPLE — Pharmacology & Prescribing";

  // ── Acute/Urgent catch-all (procedures, resuscitation, critical physiology) ─
  if (
    /procedur\b|resuscitat|advanced practice procedur|hemostasis\b|transfusion\b|blood product|oxygenation\b|hypoxia\b|hypoxemia/.test(t)
  )
    return "CNPLE — Acute & Urgent Care";

  // ── Fallback ──────────────────────────────────────────────────────────────────
  return "CNPLE — Advanced NP Practice";
}

// ── Slug → domain name helper ─────────────────────────────────────────────────
function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ── Extract lesson slug from sourceKey ───────────────────────────────────────
// sourceKey format: "cnplev2:{lesson-slug}:{section-type}"
function lessonSlugFromSourceKey(sourceKey: string): string | null {
  const parts = sourceKey.split(":");
  if (parts.length < 3) return null;
  // cnplev2 : lesson-slug : section-type  (slug may contain colons? no — slugs use hyphens)
  return parts.slice(1, -1).join(":") || null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== APPLYING CNPLE DOMAIN RECLASSIFICATION ===");
  console.log();

  // 1. Load all CNPLE deck cards with sourceKeys
  const deckCards = await prisma.flashcard.findMany({
    where: { deckId: CNPLE_DECK_ID, sourceKey: { not: null } },
    select: { id: true, sourceKey: true, categoryId: true },
  });
  console.log(`Cards in deck with sourceKey: ${deckCards.length}`);

  // 2. Extract unique lesson slugs
  const slugToCardIds = new Map<string, string[]>();
  const noSlugCards: string[] = [];
  for (const card of deckCards) {
    const slug = lessonSlugFromSourceKey(card.sourceKey!);
    if (!slug) { noSlugCards.push(card.id); continue; }
    const arr = slugToCardIds.get(slug) ?? [];
    arr.push(card.id);
    slugToCardIds.set(slug, arr);
  }
  console.log(`Unique lesson slugs: ${slugToCardIds.size} | Cards with no parseable slug: ${noSlugCards.length}`);

  // 3. Fetch lesson metadata for all referenced slugs
  const slugArr = Array.from(slugToCardIds.keys());
  const lessons = await prisma.pathwayLesson.findMany({
    where: { pathwayId: CNPLE_PATHWAY_ID, slug: { in: slugArr } },
    select: { slug: true, title: true, bodySystem: true, topic: true },
  });
  const lessonBySlug = new Map(lessons.map((l) => [l.slug, l]));
  console.log(`Lesson metadata fetched: ${lessonBySlug.size}/${slugArr.length}`);

  // 4. Ensure all target categories exist
  const categoryMap = new Map<string, string>();
  if (!DRY_RUN) {
    for (const domain of CNPLE_COMPETENCY_DOMAINS) {
      const slug = domainToSlug(domain);
      const cat = await prisma.category.upsert({
        where: { slug },
        update: { name: domain },
        create: { name: domain, slug },
      });
      categoryMap.set(domain, cat.id);
    }
    console.log(`\nEnsured ${categoryMap.size} competency categories.`);
  } else {
    // Dry-run: mock IDs
    for (const domain of CNPLE_COMPETENCY_DOMAINS) {
      categoryMap.set(domain, `dry-run:${domainToSlug(domain)}`);
    }
  }

  // 5. Compute reclassification for every card
  const beforeDist: Record<string, number> = {};
  const afterDist: Record<string, number> = {};
  let updates = 0;
  let unchanged = 0;
  let notFound = 0;

  // Current category IDs → names (for before-snapshot)
  const currentCatIds = new Set(deckCards.map((c) => c.categoryId));
  const existingCats = await prisma.category.findMany({
    where: { id: { in: Array.from(currentCatIds) } },
    select: { id: true, name: true },
  });
  const catIdToName = new Map(existingCats.map((c) => [c.id, c.name]));

  // Batch updates
  const updateBatches: Array<{ ids: string[]; newCategoryId: string; domain: string }> = [];

  for (const [lessonSlug, cardIds] of slugToCardIds) {
    const lesson = lessonBySlug.get(lessonSlug);
    if (!lesson) {
      notFound++;
      // Cards whose lesson wasn't found → keep existing category
      for (const id of cardIds) {
        const cat = catIdToName.get(deckCards.find((c) => c.id === id)?.categoryId ?? "") ?? "unknown";
        beforeDist[cat] = (beforeDist[cat] ?? 0) + 1;
        afterDist[cat] = (afterDist[cat] ?? 0) + 1;
      }
      continue;
    }

    const newDomain = resolveDomainFromTitle(lesson.title, lesson.bodySystem ?? "", lesson.topic ?? "");
    const newCategoryId = categoryMap.get(newDomain)!;
    afterDist[newDomain] = (afterDist[newDomain] ?? 0) + cardIds.length;

    for (const cardId of cardIds) {
      const card = deckCards.find((c) => c.id === cardId)!;
      const oldName = catIdToName.get(card.categoryId) ?? "unknown";
      beforeDist[oldName] = (beforeDist[oldName] ?? 0) + 1;
      if (card.categoryId !== newCategoryId) updates++;
      else unchanged++;
    }

    if (!DRY_RUN) {
      const existing = updateBatches.find((b) => b.newCategoryId === newCategoryId);
      if (existing) existing.ids.push(...cardIds);
      else updateBatches.push({ ids: [...cardIds], newCategoryId, domain: newDomain });
    }
  }

  // 6. Apply updates
  if (!DRY_RUN) {
    let applied = 0;
    for (const batch of updateBatches) {
      await prisma.flashcard.updateMany({
        where: { id: { in: batch.ids } },
        data: { categoryId: batch.newCategoryId },
      });
      applied += batch.ids.length;
      process.stdout.write(`  updated ${applied}/${deckCards.length}\r`);
    }
    console.log(`\n✓ Updated ${applied} card category assignments.`);
  }

  // 7. Report
  console.log("\n=== BEFORE (current distribution) ===");
  for (const [name, count] of Object.entries(beforeDist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count.toString().padStart(5)}  ${name}`);
  }
  console.log(`  -----`);
  console.log(`  ${Object.values(beforeDist).reduce((s, n) => s + n, 0).toString().padStart(5)}  TOTAL`);

  console.log("\n=== AFTER (new competency distribution) ===");
  for (const [name, count] of Object.entries(afterDist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count.toString().padStart(5)}  ${name}`);
  }
  console.log(`  -----`);
  console.log(`  ${Object.values(afterDist).reduce((s, n) => s + n, 0).toString().padStart(5)}  TOTAL`);

  const fallback = afterDist["CNPLE — Advanced NP Practice"] ?? 0;
  const total = Object.values(afterDist).reduce((s, n) => s + n, 0);
  const fallbackPct = total > 0 ? ((fallback / total) * 100).toFixed(1) : "0";
  console.log(`\nFallback "Advanced NP Practice": ${fallback}/${total} (${fallbackPct}%) — target < 10%`);
  console.log(`Cards reclassified: ${updates} | Unchanged: ${unchanged} | Missing lesson: ${notFound * (slugToCardIds.size > 0 ? Math.round(deckCards.length / slugToCardIds.size) : 1)}`);

  if (DRY_RUN) console.log("\n[DRY RUN] Pass --apply to write changes.");
}

main().catch((e) => { console.error(e.message); process.exit(1); });
