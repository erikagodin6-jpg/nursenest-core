#!/usr/bin/env npx tsx
/**
 * Deterministic clinical long-tail batch builder for the 20 requested nursing posts.
 *
 * The live AI provider is intentionally not called here. In environments without
 * configured blog AI keys, this keeps the batch reproducible and lets validators
 * decide what is publishable before a static long-tail row becomes public.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type PostSpec = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  audience: string;
  clinicalFrame: string[];
  pathophysiology: string[];
  assessment: string[];
  priorities: string[];
  traps: string[];
  teaching: string[];
  links: { href: string; label: string }[];
  faqs: { q: string; a: string }[];
  references: string[];
};

const TODAY = "2026-05-09";
const OUT_DIR = join(process.cwd(), "src", "content", "blog-static-longtail");
const DISCLAIMER =
  "This article supports exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.";

function esc(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function list(items: string[]): string {
  return `<ul>\n${items.map((item) => `  <li>${item}</li>`).join("\n")}\n</ul>`;
}

function para(items: string[]): string {
  return items.map((item) => `<p>${item}</p>`).join("\n");
}

function render(spec: PostSpec): string {
  const nc = [
    `Ask first whether the patient is unstable right now: airway, breathing, circulation, neurologic change, active bleeding, severe pain, or rapidly changing vital signs outrank routine teaching.`,
    `Then connect the diagnosis to one or two objective trends. For ${spec.audience}, the strongest answers usually use assessment data, prescribed protocols, and escalation language instead of independent medication changes.`,
    `When two choices look similar, prefer the option that prevents deterioration, verifies an order, or collects safety data before a high-risk therapy proceeds.`,
  ];
  const internalLinks = spec.links
    .map((l) => `  <li><a href="${l.href}">${esc(l.label)}</a></li>`)
    .join("\n");
  const faqHtml = spec.faqs.map((f) => `<h3>${esc(f.q)}</h3>\n<p>${f.a}</p>`).join("\n");
  const refHtml = spec.references.map((r) => `<p>${r}</p>`).join("\n");
  return `---\nslug: ${spec.slug}\ntitle: ${spec.title}\nexcerpt: ${spec.excerpt}\ncategory: ${spec.category}\ntags: ${spec.tags.join(", ")}\npublishedAt: ${TODAY}\nupdatedAt: ${TODAY}\nseoTitle: ${spec.seoTitle}\nseoDescription: ${spec.seoDescription}\ncanonicalUrl: /blog/${spec.slug}\nauthorDisplayName: NurseNest Editorial\nmedicalReviewerName: Clinical review board (educational)\ndisclaimer: ${DISCLAIMER}\n---\n\n<h2>Clinical overview for nursing exams</h2>\n${para(spec.clinicalFrame)}\n\n<h2>Pathophysiology you can use at the bedside</h2>\n${para(spec.pathophysiology)}\n\n<h2>Assessment clues and lab patterns</h2>\n${para(spec.assessment)}\n\n<h2>NCLEX nursing priorities</h2>\n${para(nc)}\n${list(spec.priorities)}\n\n<h2>Common traps that make answers unsafe</h2>\n${list(spec.traps)}\n\n<h2>Patient teaching and delegation boundaries</h2>\n${para(spec.teaching)}\n\n<h2>How to reason through a stem</h2>\n<p>Start by naming the physiologic threat in plain language. Is oxygen delivery failing, fluid shifting into the wrong compartment, sodium moving water across the blood-brain barrier, clot burden threatening perfusion, or a drug effect narrowing the margin of safety? That translation keeps you from chasing isolated words in the answer choices.</p>\n<p>Next, rank the data by immediacy. A new change in level of consciousness, respiratory fatigue, shock, suspected stroke onset, seizure activity, or dysrhythmia deserves action before routine education. Stable chronic findings still matter, but the exam usually rewards preventing the next injury.</p>\n<p>Finally, keep nursing scope clean. Verify allergies and orders, monitor objective response, implement standing protocols, protect the patient from predictable complications, and report changes with specific data. Avoid answer choices that invent a diagnosis, change a high-risk dose without direction, or promise a cure.</p>\n\n<h2>Key Takeaways</h2>\n${list([\n+    `${esc(spec.title)} is easiest to study when you connect the definition to assessment patterns, not when you memorize isolated labels.`,\n+    `Priority answers favor physiologic stability, objective monitoring, and timely escalation.`,\n+    `Medication, fluid, oxygen, and procedure choices should stay tied to orders, protocols, and local scope.`,\n+    `Teaching should include what to report early, how to use prescribed therapy safely, and when emergency care is needed.`,\n+  ])}\n\n<h2>Suggested Internal Links</h2>\n<ul>\n${internalLinks}\n  <li><a href="/app/dashboard">Learner dashboard</a> - continue adaptive practice after reading.</li>\n</ul>\n\n<h2>Premium Lesson CTA</h2>\n<p>Pair this article with NurseNest premium lessons and adaptive questions on pathophysiology, pharmacology, fluids and electrolytes, and emergency priorities. The goal is not another memorized chart; it is faster recognition of patient cues under NCLEX-RN and REx-PN timing.</p>\n\n<h2>FAQ Schema Questions</h2>\n${faqHtml}\n\n<h2>APA-7 References</h2>\n${refHtml}\n<p><em>Follow your program's citation requirements; links are for educational traceability and should not replace local clinical policy.</em></p>\n`;
}

const sharedLinks = {
  electrolytes: [
    { href: "/blog/hyponatremia-symptoms-causes-nursing-priorities", label: "Hyponatremia symptoms, causes, and nursing priorities" },
    { href: "/blog/hypernatremia-causes-symptoms-nursing-care", label: "Hypernatremia causes, symptoms, and nursing care" },
  ],
  acidBase: [
    { href: "/blog/metabolic-acidosis-vs-metabolic-alkalosis", label: "Metabolic acidosis vs metabolic alkalosis" },
    { href: "/blog/respiratory-acidosis-vs-respiratory-alkalosis", label: "Respiratory acidosis vs respiratory alkalosis" },
  ],
  respiratory: [
    { href: "/blog/copd-symptoms-treatment-nursing-care", label: "COPD symptoms, treatment themes, and nursing care" },
    { href: "/blog/asthma-pathophysiology-emergency-nursing-interventions", label: "Asthma emergency nursing interventions" },
  ],
  neuro: [
    { href: "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care", label: "Ischemic vs hemorrhagic stroke nursing care" },
    { href: "/blog/increased-intracranial-pressure-nursing-priorities", label: "Increased intracranial pressure nursing priorities" },
  ],
  clot: [
    { href: "/blog/deep-vein-thrombosis-nursing-guide", label: "Deep vein thrombosis nursing guide" },
    { href: "/blog/pulmonary-embolism-signs-symptoms-nursing-priorities", label: "Pulmonary embolism nursing priorities" },
  ],
};

const posts: PostSpec[] = [
  {
    slug: "siadh-vs-diabetes-insipidus-nursing-comparison",
    title: "SIADH vs Diabetes Insipidus Explained for Nursing Students",
    excerpt: "Compare SIADH and diabetes insipidus as opposite disorders of water balance so sodium, urine concentration, neuro checks, and nursing priorities stay clear for NCLEX-RN and REx-PN questions.",
    category: "Endocrine Disorders",
    tags: ["SIADH", "Diabetes Insipidus", "Endocrine", "Electrolytes", "NCLEX-RN", "REx-PN"],
    seoTitle: "SIADH vs diabetes insipidus for nursing students | NurseNest",
    seoDescription: "Compare SIADH and diabetes insipidus with nursing assessment clues, sodium trends, urine patterns, treatment themes, and NCLEX priorities.",
    audience: "SIADH and diabetes insipidus questions",
    clinicalFrame: [
      "SIADH and diabetes insipidus sit on the same antidiuretic hormone axis but move in opposite directions. SIADH retains free water even when plasma is already dilute; diabetes insipidus loses free water through dilute urine when ADH is absent or ineffective.",
      "Nursing exam stems rarely reward a single memorized sodium number. They reward whether you connect fluid balance to urine output, urine concentration, mental status, thirst, weight trends, and the risk of correcting sodium too quickly.",
      "The comparison also matters clinically because both disorders can look deceptively calm before neurologic harm appears. A patient with SIADH may not be obviously edematous, and a patient with central diabetes insipidus may compensate until access to water is restricted.",
    ],
    pathophysiology: [
      "ADH normally helps the kidney reabsorb water in the collecting ducts. In SIADH, too much ADH effect causes water retention, low serum osmolality, and dilutional hyponatremia. Urine remains inappropriately concentrated because the kidney is still saving water.",
      "In central diabetes insipidus, the brain does not release enough ADH. In nephrogenic diabetes insipidus, the kidney does not respond adequately to ADH. Either way, free water is lost, urine is dilute, and hypernatremia develops when intake cannot keep pace.",
      "Classic causes include CNS injury, postoperative states, pulmonary disease, malignancy, and medication effects for SIADH; pituitary injury, lithium exposure, hypercalcemia, and renal tubular disorders for diabetes insipidus. Real patients can have mixed signals, so trend data instead of anchoring.",
    ],
    assessment: [
      "SIADH commonly presents with low sodium, concentrated urine, low serum osmolality, headache, nausea, confusion, weakness, and seizure risk when severe. Weight gain may occur without dramatic edema because retained water distributes across body compartments.",
      "Diabetes insipidus commonly presents with high-volume dilute urine, intense thirst if awake, dry mucous membranes, tachycardia, hypotension, weight loss, and high sodium when water intake is inadequate. Postoperative pituitary stems often emphasize sudden urine output changes.",
      "Strict intake and output, daily weights, neurologic checks, serum sodium trends, urine specific gravity, and ordered osmolality studies are high-yield. Interpret urine findings relative to serum status: concentrated urine during hypotonic hyponatremia points toward SIADH; dilute polyuria points toward diabetes insipidus.",
    ],
    priorities: [
      "Institute seizure and fall precautions when sodium is severely abnormal or mentation changes.",
      "For SIADH, implement ordered fluid restriction, monitor response, and avoid free-water choices that worsen dilutional hyponatremia.",
      "For diabetes insipidus, replace fluids as ordered, monitor hemodynamics, and prepare desmopressin pathways when central DI is identified.",
      "Report rapid sodium shifts, worsening confusion, new seizures, or urine output changes that exceed unit thresholds.",
    ],
    traps: [
      "Assuming every hyponatremic patient has SIADH without checking volume history, diuretics, heart failure, liver disease, or renal status.",
      "Assuming every diabetes insipidus patient is hypernatremic even when thirst is intact and water is available.",
      "Selecting aggressive sodium correction without monitoring language or provider orders.",
      "Confusing diabetes mellitus glucose problems with diabetes insipidus water-balance physiology.",
    ],
    teaching: [
      "Teaching depends on cause and plan. SIADH education may include fluid restriction rationale, medication review, and neurologic warning signs. Diabetes insipidus education may include prescribed desmopressin use, hydration planning, daily weights, and when to seek urgent care for excessive urination or confusion.",
      "Delegate routine vital signs or intake totals only with clear parameters. The RN or RPN/LPN following local scope should interpret trends, assess neurologic change, and escalate abnormal sodium patterns promptly.",
    ],
    links: [...sharedLinks.electrolytes, { href: "/blog/dka-vs-hhs-nursing-priorities", label: "DKA vs HHS nursing priorities" }],
    faqs: [
      { q: "What is the fastest SIADH versus DI clue?", a: "Urine pattern is the fastest clue: SIADH retains water with urine that is too concentrated for a dilute serum picture, while DI causes high-volume dilute urine." },
      { q: "Why are neurologic checks so important?", a: "Sodium changes move water across the blood-brain barrier, so headache, confusion, seizures, and decreased consciousness can signal dangerous osmotic stress." },
      { q: "Is desmopressin used for SIADH?", a: "No. Desmopressin is associated with central diabetes insipidus plans when ordered; SIADH commonly uses fluid restriction and cause-directed therapy." },
      { q: "Can SIADH look euvolemic?", a: "Yes. Many teaching stems describe euvolemic hyponatremia because total body water rises without obvious peripheral edema." },
    ],
    references: [
      "Sterns, R. H. (2015). Disorders of plasma sodium: Causes, consequences, and correction. <em>New England Journal of Medicine</em>, <em>372</em>(1), 55-65. https://doi.org/10.1056/NEJMra1404489",
      "Verbalis, J. G., Goldsmith, S. R., Greenberg, A., et al. (2013). Diagnosis, evaluation, and treatment of hyponatremia: Expert panel recommendations. <em>American Journal of Medicine</em>, <em>126</em>(10 Suppl 1), S1-S42. https://doi.org/10.1016/j.amjmed.2013.07.006",
      "Fenske, W., Allolio, B., & Christ-Crain, M. (2012). Water balance disorders. <em>Best Practice & Research Clinical Endocrinology & Metabolism</em>, <em>26</em>(2), 153-169. https://doi.org/10.1016/j.beem.2011.08.003",
    ],
  },
  {
    slug: "dka-vs-hhs-nursing-priorities",
    title: "DKA vs HHS Explained: Nursing Priorities, Labs, and NCLEX Differences",
    excerpt: "Compare diabetic ketoacidosis and hyperosmolar hyperglycemic state through acidosis, ketones, osmolality, dehydration, potassium safety, and nursing priorities.",
    category: "Endocrine Disorders",
    tags: ["DKA", "HHS", "Diabetes", "Endocrine", "NCLEX-RN", "Nursing Priorities"],
    seoTitle: "DKA vs HHS nursing priorities and NCLEX differences | NurseNest",
    seoDescription: "Learn DKA vs HHS differences including symptoms, labs, fluids, insulin safety, potassium monitoring, and NCLEX nursing priorities.",
    audience: "hyperglycemic emergency questions",
    clinicalFrame: [
      "DKA and HHS are hyperglycemic emergencies, but the exam contrast is not simply type 1 versus type 2 diabetes. DKA is dominated by insulin deficiency, ketone production, and metabolic acidosis. HHS is dominated by severe hyperglycemia, hyperosmolality, profound dehydration, and altered mental status with little or no ketoacidosis.",
      "Both conditions can kill through volume depletion, electrolyte shifts, shock, dysrhythmia, cerebral complications, or delayed trigger recognition. Nursing priorities therefore focus on stabilization and monitoring before teaching.",
      "A strong answer choice connects glucose correction to potassium surveillance and fluid status. If insulin appears without potassium thinking, the item is usually testing whether you know insulin can move potassium into cells and precipitate dangerous hypokalemia.",
    ],
    pathophysiology: [
      "In DKA, low effective insulin and high counterregulatory hormones increase lipolysis and ketogenesis. Beta-hydroxybutyrate and acetoacetate drive high anion-gap metabolic acidosis, while hyperglycemia causes osmotic diuresis.",
      "In HHS, enough insulin may be present to suppress major ketone production but not enough to prevent extreme hyperglycemia. Osmotic diuresis continues for longer, dehydration becomes profound, and rising osmolality contributes to confusion, seizures, or coma.",
      "Potassium is deceptive in both disorders. Serum potassium may look normal or high on arrival despite total body depletion from vomiting and diuresis. Once insulin and fluids are started, potassium can fall quickly.",
    ],
    assessment: [
      "DKA stems often include abdominal pain, nausea, vomiting, Kussmaul respirations, fruity breath, dehydration, infection, missed insulin, elevated ketones, and low bicarbonate. HHS stems often include older adults, type 2 diabetes, infection, very high glucose, severe dehydration, and neurologic changes.",
      "Assessment priorities include airway and breathing if vomiting or decreased consciousness is present, mental status checks, vital-sign trends, strict intake and output, cardiac monitoring when electrolytes are abnormal, and protocol-based glucose checks.",
      "Labs commonly include glucose, electrolytes, anion gap, serum ketones or beta-hydroxybutyrate, venous or arterial pH depending on setting, renal function, osmolality, and infection workup. Do not interpret a single glucose number without acid-base and hydration context.",
    ],
    priorities: [
      "Start with ABCs, neurologic status, perfusion, and dehydration severity.",
      "Prepare for ordered isotonic fluid resuscitation and reassess lungs, perfusion, urine output, and mental status.",
      "Verify potassium and renal function before and during insulin therapy per protocol.",
      "Identify and report triggers such as infection, myocardial infarction, missed insulin, steroid use, or pump failure.",
    ],
    traps: [
      "Choosing bicarbonate for every acidotic DKA stem without severe-acidosis cues and order context.",
      "Treating the highest glucose as the only priority while missing shock, airway risk, or potassium danger.",
      "Assuming HHS has no emergency risk because ketones are absent or mild.",
      "Skipping sick-day education after stabilization when the item changes from acute care to discharge teaching.",
    ],
    teaching: [
      "Discharge teaching includes sick-day rules, never stopping basal insulin without provider direction, hydration, ketone checks when instructed, glucose monitoring frequency, and when to seek care for vomiting or persistent hyperglycemia.",
      "Delegation can include point-of-care glucose collection or vital signs, but interpretation of instability, insulin-infusion safety, and escalation of electrolyte trends require licensed clinical judgment under local policy.",
    ],
    links: [{ href: "/blog/siadh-vs-diabetes-insipidus-nursing-comparison", label: "SIADH vs diabetes insipidus" }, ...sharedLinks.acidBase],
    faqs: [
      { q: "Which has more ketones, DKA or HHS?", a: "DKA has prominent ketone production and metabolic acidosis in classic teaching. HHS has little or mild ketosis because some insulin effect remains." },
      { q: "Why does potassium matter before insulin?", a: "Insulin shifts potassium into cells, which can reveal or worsen hypokalemia and increase dysrhythmia risk." },
      { q: "Which condition causes more altered mental status?", a: "HHS often emphasizes altered mental status from hyperosmolality, but DKA can also impair mentation, especially when severe." },
      { q: "What is the nurse's role in insulin infusion safety?", a: "Verify protocol, monitor glucose and potassium trends, assess response, maintain IV access, and report abnormal changes promptly." },
    ],
    references: [
      "American Diabetes Association Professional Practice Committee. (2026). Standards of care in diabetes-2026. <em>Diabetes Care</em>, <em>49</em>(Suppl. 1). https://diabetesjournals.org/care/issue/49/Supplement_1",
      "Umpierrez, G. E., Davis, G. M., ElSayed, N. A., et al. (2024). Hyperglycemic crises in adults with diabetes: A consensus report. <em>Diabetes Care</em>, <em>47</em>(8), 1257-1275. https://doi.org/10.2337/dci24-0032",
      "Dhatariya, K. K., Glaser, N. S., Codner, E., & Umpierrez, G. E. (2020). Diabetic ketoacidosis. <em>Nature Reviews Disease Primers</em>, <em>6</em>, 40. https://doi.org/10.1038/s41572-020-0165-1",
    ],
  },
];

const compactPosts: Array<Omit<PostSpec, "clinicalFrame" | "pathophysiology" | "assessment" | "priorities" | "traps" | "teaching" | "links" | "faqs" | "references"> & {
  frame: string;
  physiology: string;
  assess: string;
  priority: string;
  trap: string;
  teach: string;
  linkSet: keyof typeof sharedLinks;
  refs: string[];
}> = [
  {
    slug: "acute-kidney-injury-prerenal-intrinsic-postrenal",
    title: "Acute Kidney Injury Explained: Prerenal vs Intrinsic vs Postrenal",
    excerpt: "Map acute kidney injury through prerenal hypoperfusion, intrinsic kidney injury, and postrenal obstruction so labs, urine output, fluids, and escalation decisions make clinical sense.",
    category: "Renal Disorders",
    tags: ["AKI", "Acute Kidney Injury", "Renal", "NCLEX-RN", "REx-PN", "Electrolytes"],
    seoTitle: "AKI prerenal intrinsic postrenal nursing guide | NurseNest",
    seoDescription: "Understand acute kidney injury causes, symptoms, stages, nursing priorities, and prerenal vs intrinsic vs postrenal differences.",
    audience: "acute kidney injury questions",
    frame: "Acute kidney injury is a sudden loss of kidney filtration or urine output that threatens fluid balance, potassium control, acid-base balance, and waste clearance. The prerenal, intrinsic, and postrenal buckets are not trivia; they tell you whether the first problem is perfusion, kidney tissue damage, or obstruction after urine is formed.",
    physiology: "Prerenal AKI begins with reduced effective renal perfusion from dehydration, hemorrhage, sepsis, heart failure, or medications that alter renal blood flow. Intrinsic AKI reflects tubular, glomerular, vascular, or interstitial injury from ischemia, nephrotoxins, rhabdomyolysis, contrast exposure, or inflammation. Postrenal AKI occurs when urine cannot drain because of obstruction such as enlarged prostate, stones, tumors, strictures, or a blocked catheter.",
    assess: "Look for urine output trends, daily weights, edema, orthostasis, mucous membranes, lung sounds, bladder distention, flank pain, catheter patency, creatinine and BUN trends, potassium, bicarbonate, urinalysis clues, and medication exposures. Sudden anuria after catheter issues is a different story from slow creatinine rise after aminoglycoside exposure.",
    priority: "Protect perfusion and urine drainage while watching for life-threatening electrolyte and volume complications. Give ordered fluids for hypovolemia, stop or question nephrotoxins when appropriate, verify catheter patency, monitor ECG changes with hyperkalemia, and prepare for dialysis discussions when refractory overload, severe hyperkalemia, uremic symptoms, or severe acidosis appears.",
    trap: "Do not give fluids automatically to every patient with AKI; pulmonary edema and heart failure contexts may make that unsafe. Do not call postrenal obstruction intrinsic failure before checking bladder and catheter clues. Do not reassure yourself because potassium is only mildly elevated if urine output is falling and ECG changes are present.",
    teach: "Teach hydration and sick-day medication guidance only as ordered by the care team, avoidance of nonprescribed NSAID overuse when relevant, follow-up labs, and warning signs such as decreased urine output, dyspnea, swelling, confusion, or palpitations.",
    linkSet: "electrolytes",
    refs: [
      "Kellum, J. A., Romagnani, P., Ashuntantang, G., Ronco, C., Zarbock, A., & Anders, H.-J. (2021). Acute kidney injury. <em>Nature Reviews Disease Primers</em>, <em>7</em>, 52. https://doi.org/10.1038/s41572-021-00284-z",
      "Kidney Disease: Improving Global Outcomes. (2012). KDIGO clinical practice guideline for acute kidney injury. <em>Kidney International Supplements</em>, <em>2</em>(1), 1-138.",
      "Rewa, O., & Bagshaw, S. M. (2019). Acute kidney injury: Epidemiology, risk factors, and consequences. <em>Seminars in Nephrology</em>, <em>39</em>(4), 319-327. https://doi.org/10.1016/j.semnephrol.2019.05.001",
    ],
  },
  {
    slug: "left-sided-vs-right-sided-heart-failure",
    title: "Left-Sided vs Right-Sided Heart Failure: Symptoms and Nursing Care",
    excerpt: "Compare pulmonary congestion from left-sided failure with systemic venous congestion from right-sided failure, including assessment clues, medication safety, and exam priorities.",
    category: "Cardiovascular Disorders",
    tags: ["Heart Failure", "Cardiac", "NCLEX-RN", "REx-PN", "Cardiovascular", "Diuretics"],
    seoTitle: "Left vs right heart failure nursing symptoms | NurseNest",
    seoDescription: "Compare left-sided and right-sided heart failure symptoms, assessment findings, medications, and NCLEX nursing interventions.",
    audience: "heart failure comparison questions",
    frame: "Left-sided and right-sided heart failure are best understood as backup patterns in a two-pump circuit. Left-sided failure backs pressure into the lungs and limits forward systemic output. Right-sided failure backs pressure into the venous system, producing peripheral and abdominal congestion. Many patients have both, but exam stems usually emphasize one side.",
    physiology: "Left ventricular systolic dysfunction reduces ejection, while diastolic dysfunction impairs filling. Either can raise pulmonary venous pressures and cause dyspnea. Right ventricular failure may follow left failure, pulmonary hypertension, lung disease, or right ventricular infarction. Systemic venous congestion explains dependent edema, jugular venous distention, hepatic congestion, and ascites.",
    assess: "Left-sided clues include crackles, orthopnea, paroxysmal nocturnal dyspnea, cough, low oxygen saturation, frothy sputum in acute pulmonary edema, fatigue, cool extremities, and altered perfusion. Right-sided clues include JVD, dependent edema, weight gain, hepatomegaly, abdominal discomfort, ascites, and skin breakdown risk over swollen tissue.",
    priority: "Position dyspneic patients upright, apply ordered oxygen, monitor response to diuretics and vasodilators, trend daily weights and intake-output, assess renal function and electrolytes, and report worsening respiratory distress or hypotension. Teaching priorities include sodium guidance, fluid limits when ordered, medication adherence, and when to call for rapid weight gain.",
    trap: "Do not assume edema means right-sided failure only; renal disease, venous disease, medications, and combined heart failure can contribute. Do not give routine fluid boluses for dyspnea and crackles unless a specific order and hemodynamic context support it. Avoid answer choices that independently titrate cardiac drugs.",
    teach: "Teach daily weights using the same scale and time, symptom zones if the program uses them, medication timing, orthostatic precautions, low-sodium pattern reading, and avoiding NSAIDs unless cleared. Reinforce that worsening breathlessness, chest pain, fainting, or rapid swelling requires prompt care.",
    linkSet: "clot",
    refs: [
      "Heidenreich, P. A., Bozkurt, B., Aguilar, D., et al. (2022). 2022 AHA/ACC/HFSA guideline for the management of heart failure. <em>Journal of the American College of Cardiology</em>, <em>79</em>(17), e263-e421. https://doi.org/10.1016/j.jacc.2021.12.012",
      "McDonagh, T. A., Metra, M., Adamo, M., et al. (2023). 2023 focused update of the ESC Guidelines for acute and chronic heart failure. <em>European Heart Journal</em>, <em>44</em>(37), 3627-3639. https://doi.org/10.1093/eurheartj/ehad195",
      "Bozkurt, B., Coats, A. J. S., Tsutsui, H., et al. (2021). Universal definition and classification of heart failure. <em>European Journal of Heart Failure</em>, <em>23</em>(3), 352-380. https://doi.org/10.1002/ejhf.2115",
    ],
  },
  {
    slug: "sepsis-pathophysiology-early-nursing-recognition",
    title: "Sepsis Pathophysiology and Early Nursing Recognition",
    excerpt: "Understand how infection becomes organ dysfunction, why early recognition matters, and which nursing assessment cues should trigger escalation on NCLEX-style sepsis questions.",
    category: "Critical Care",
    tags: ["Sepsis", "Shock", "Infection", "NCLEX-RN", "REx-PN", "Early Recognition"],
    seoTitle: "Sepsis pathophysiology and nursing recognition | NurseNest",
    seoDescription: "Review sepsis pathophysiology, early signs, lactate and perfusion clues, nursing priorities, and NCLEX recognition patterns.",
    audience: "sepsis recognition questions",
    frame: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Nursing exams focus on early recognition because deterioration can be fast and initially subtle: mild confusion, rising respiratory rate, cool or mottled skin, falling urine output, or new hypotension may precede obvious shock.",
    physiology: "Pathogen and host signals trigger inflammatory mediators, endothelial injury, vasodilation, capillary leak, microthrombi, mitochondrial dysfunction, and impaired oxygen use. Septic shock adds persistent circulatory and cellular-metabolic dysfunction with high mortality risk. The key nursing translation is that blood pressure can look acceptable until compensation fails.",
    assess: "Trend temperature, heart rate, respiratory rate, blood pressure, oxygen saturation, mental status, urine output, skin perfusion, suspected source, white blood cell pattern, lactate when ordered, cultures before antibiotics when feasible, and response to fluids or vasopressors per protocol.",
    priority: "Escalate suspected sepsis rapidly, obtain ordered cultures and lactate without delaying antibiotics beyond protocol expectations, maintain IV access, administer fluids and antimicrobials as ordered, monitor urine output, reassess perfusion after interventions, and report new hypotension or rising lactate.",
    trap: "Do not wait for fever; older adults and immunocompromised patients may be hypothermic or afebrile. Do not treat lactate as a diagnosis by itself. Do not delay ordered antibiotics because every diagnostic detail is not complete when the patient is unstable.",
    teach: "Patient teaching after recovery includes infection prevention, completing prescribed antimicrobials, wound or device care, vaccination conversations when appropriate, and seeking care for confusion, fever, worsening pain, shortness of breath, or low urine output.",
    linkSet: "electrolytes",
    refs: [
      "Evans, L., Rhodes, A., Alhazzani, W., et al. (2021). Surviving Sepsis Campaign: International guidelines for management of sepsis and septic shock 2021. <em>Intensive Care Medicine</em>, <em>47</em>, 1181-1247. https://doi.org/10.1007/s00134-021-06506-y",
      "Singer, M., Deutschman, C. S., Seymour, C. W., et al. (2016). The Third International Consensus Definitions for Sepsis and Septic Shock. <em>JAMA</em>, <em>315</em>(8), 801-810. https://doi.org/10.1001/jama.2016.0287",
      "Seymour, C. W., Gesten, F., Prescott, H. C., et al. (2017). Time to treatment and mortality during mandated emergency care for sepsis. <em>New England Journal of Medicine</em>, <em>376</em>, 2235-2244. https://doi.org/10.1056/NEJMoa1703058",
    ],
  },
  {
    slug: "digoxin-toxicity-nursing-priorities",
    title: "Digoxin Toxicity: Nursing Priorities, Signs, and Safety Checks",
    excerpt: "Review digoxin toxicity symptoms, potassium and renal risk factors, pulse checks, ECG concerns, and nursing safety priorities for medication questions.",
    category: "Pharmacology",
    tags: ["Digoxin", "Pharmacology", "Cardiac", "NCLEX-RN", "REx-PN", "Medication Safety"],
    seoTitle: "Digoxin toxicity nursing priorities | NurseNest",
    seoDescription: "Study digoxin toxicity signs, potassium risk, renal monitoring, pulse checks, antidote awareness, and NCLEX medication safety.",
    audience: "digoxin toxicity questions",
    frame: "Digoxin has a narrow therapeutic index, so nursing questions often test whether you notice early toxicity before a dysrhythmia or dangerous bradycardia develops. The drug increases cardiac contractility and slows AV nodal conduction, which can help selected heart failure or rate-control plans but becomes hazardous when levels rise or sensitivity increases.",
    physiology: "Digoxin inhibits the sodium-potassium ATPase pump, indirectly increasing intracellular calcium in cardiac cells. Renal impairment, older age, low body mass, dehydration, drug interactions, and electrolyte disturbances increase toxicity risk. Hypokalemia is especially important because it increases digoxin binding and toxicity risk.",
    assess: "Assess apical pulse before administration per policy, rhythm changes, nausea, vomiting, anorexia, fatigue, confusion, weakness, visual disturbances such as yellow-green halos in classic teaching, serum digoxin level when ordered, potassium, magnesium, calcium, renal function, and medication list interactions.",
    priority: "Hold and notify per policy for abnormal apical pulse or suspected toxicity, place unstable patients on cardiac monitoring, verify labs, manage nausea and fall risk, prepare digoxin immune Fab for severe toxicity when ordered, and assess for hyperkalemia in acute overdose contexts.",
    trap: "Do not give the next dose simply because the patient says symptoms are mild. Do not focus only on visual halos; GI and mental-status changes may appear first. Do not ignore diuretic-induced hypokalemia in a heart failure patient taking digoxin.",
    teach: "Teach patients to take the medication consistently, check pulse if instructed, report anorexia, vomiting, confusion, palpitations, fainting, or visual changes, avoid unapproved herbal products, and attend lab monitoring. Medication changes should come from the prescriber.",
    linkSet: "electrolytes",
    refs: [
      "January, C. T., Wann, L. S., Calkins, H., et al. (2019). 2019 AHA/ACC/HRS focused update of the atrial fibrillation guideline. <em>Circulation</em>, <em>140</em>(2), e125-e151. https://doi.org/10.1161/CIR.0000000000000665",
      "Pincus, M. (2016). Management of digoxin toxicity. <em>Australian Prescriber</em>, <em>39</em>(1), 18-20. https://doi.org/10.18773/austprescr.2016.006",
      "Whayne, T. F. (2018). Clinical use of digitalis: A state of the art review. <em>American Journal of Cardiovascular Drugs</em>, <em>18</em>, 427-440. https://doi.org/10.1007/s40256-018-0292-1",
    ],
  },
  {
    slug: "warfarin-vs-heparin-nursing-comparison",
    title: "Warfarin vs Heparin: Nursing Comparison for Anticoagulation Safety",
    excerpt: "Compare warfarin and heparin monitoring, onset, reversal, bleeding precautions, pregnancy considerations, and nursing priorities for NCLEX-style anticoagulation questions.",
    category: "Pharmacology",
    tags: ["Warfarin", "Heparin", "Anticoagulation", "NCLEX-RN", "REx-PN", "Medication Safety"],
    seoTitle: "Warfarin vs heparin nursing comparison | NurseNest",
    seoDescription: "Compare warfarin and heparin for nursing exams: INR, aPTT or anti-Xa, onset, reversal, bleeding precautions, and patient teaching.",
    audience: "anticoagulation comparison questions",
    frame: "Warfarin and heparin both reduce clotting, but they differ in onset, route, monitoring, reversal, and teaching. Exams use the comparison to test safety: bleeding precautions, lab interpretation, transitions between agents, and when to escalate abnormal findings.",
    physiology: "Heparin potentiates antithrombin and works quickly, usually by IV infusion or subcutaneous routes depending on indication. Unfractionated heparin may be monitored with aPTT or anti-Xa per policy. Warfarin blocks vitamin K-dependent clotting factor synthesis, has delayed onset, and is monitored with INR.",
    assess: "Assess bleeding gums, bruising, hematuria, melena, hematemesis, severe headache, hypotension, tachycardia, platelet trends for heparin-induced thrombocytopenia, renal function for some anticoagulant choices, medication interactions, diet consistency, pregnancy status when relevant, and procedure timing.",
    priority: "Verify high-alert medication checks, use infusion pumps and protocols, trend INR or aPTT/anti-Xa as ordered, hold and report critical values per policy, prepare protamine for severe heparin reversal or vitamin K/prothrombin complex pathways for warfarin reversal when ordered, and protect from injury.",
    trap: "Do not teach patients on warfarin to avoid all vitamin K; consistency is the usual teaching point. Do not ignore platelet drops on heparin. Do not administer intramuscular injections casually to anticoagulated patients when avoidable.",
    teach: "Teach bleeding precautions, soft toothbrush and electric razor use, medication-interaction checks, consistent diet for warfarin, lab follow-up, medical alert identification, and when to seek urgent care for severe headache, falls, black stools, or uncontrolled bleeding.",
    linkSet: "clot",
    refs: [
      "Kearon, C., Akl, E. A., Ornelas, J., et al. (2016). Antithrombotic therapy for VTE disease: CHEST guideline. <em>Chest</em>, <em>149</em>(2), 315-352. https://doi.org/10.1016/j.chest.2015.11.026",
      "Witt, D. M., Nieuwlaat, R., Clark, N. P., et al. (2018). American Society of Hematology guidelines for management of venous thromboembolism: Optimal management of anticoagulation therapy. <em>Blood Advances</em>, <em>2</em>(22), 3257-3291. https://doi.org/10.1182/bloodadvances.2018024893",
      "Holbrook, A., Schulman, S., Witt, D. M., et al. (2012). Evidence-based management of anticoagulant therapy. <em>Chest</em>, <em>141</em>(2 Suppl), e152S-e184S. https://doi.org/10.1378/chest.11-2295",
    ],
  },
  {
    slug: "beta-blockers-mechanism-side-effects-nursing-teaching",
    title: "Beta Blockers: Mechanism, Side Effects, and Nursing Teaching",
    excerpt: "Learn how beta blockers lower heart rate and workload, which adverse effects matter, and what nursing teaching appears on NCLEX-RN and REx-PN questions.",
    category: "Pharmacology",
    tags: ["Beta Blockers", "Pharmacology", "Cardiac", "NCLEX-RN", "REx-PN", "Medication Teaching"],
    seoTitle: "Beta blockers mechanism and nursing teaching | NurseNest",
    seoDescription: "Study beta blocker mechanism, side effects, hold parameters, asthma and diabetes cautions, and nursing teaching for exams.",
    audience: "beta blocker medication questions",
    frame: "Beta blockers reduce sympathetic stimulation at beta receptors, lowering heart rate, contractility, AV conduction, and renin release depending on selectivity. Nursing questions usually ask whether you can connect the mechanism to bradycardia, hypotension, fatigue, bronchospasm concerns, and diabetes masking effects.",
    physiology: "Beta-1 selective agents primarily affect the heart at typical doses, while nonselective agents also block beta-2 receptors in bronchial and vascular smooth muscle. Selectivity is dose-dependent, so respiratory history still matters. Abrupt withdrawal can cause rebound tachycardia or angina in some patients.",
    assess: "Assess apical pulse, blood pressure, dizziness, fatigue, shortness of breath, wheezing, heart block history, heart failure stability, blood glucose patterns in diabetes, and concurrent drugs that slow conduction. In acute coronary or heart failure contexts, know whether the question is about chronic therapy or unstable decompensation.",
    priority: "Check hold parameters, notify for symptomatic bradycardia or hypotension, monitor response after first doses or dose changes, use fall precautions for dizziness, and teach not to stop abruptly without prescriber guidance. In asthma or COPD stems, watch for bronchospasm especially with nonselective agents.",
    trap: "Do not give a beta blocker automatically when the apical pulse is below the ordered threshold. Do not tell a diabetic patient that beta blockers cause no glucose-safety issues; they may mask adrenergic symptoms of hypoglycemia. Do not confuse fatigue education with permission to discontinue abruptly.",
    teach: "Teach pulse checks if assigned, slow position changes, reporting wheezing, fainting, severe fatigue, weight gain in heart failure, or worsening depression symptoms if relevant. Reinforce adherence and coordinated refills because missed doses can destabilize cardiac conditions.",
    linkSet: "clot",
    refs: [
      "Whelton, P. K., Carey, R. M., Aronow, W. S., et al. (2018). 2017 guideline for high blood pressure in adults. <em>Hypertension</em>, <em>71</em>(6), e13-e115. https://doi.org/10.1161/HYP.0000000000000065",
      "Heidenreich, P. A., Bozkurt, B., Aguilar, D., et al. (2022). 2022 AHA/ACC/HFSA guideline for heart failure. <em>Journal of the American College of Cardiology</em>, <em>79</em>(17), e263-e421. https://doi.org/10.1016/j.jacc.2021.12.012",
      "Frishman, W. H. (2013). Beta-adrenergic receptor blockers. <em>Circulation</em>, <em>107</em>(18), e117-e119. https://doi.org/10.1161/01.CIR.0000070983.15903.A2",
    ],
  },
  {
    slug: "hyponatremia-symptoms-causes-nursing-priorities",
    title: "Hyponatremia: Symptoms, Causes, and Nursing Priorities",
    excerpt: "Connect low sodium to water balance, neurologic risk, assessment clues, correction safety, and nursing priorities for NCLEX-RN and REx-PN questions.",
    category: "Electrolytes",
    tags: ["Hyponatremia", "Sodium", "Electrolytes", "NCLEX-RN", "REx-PN", "Seizure Precautions"],
    seoTitle: "Hyponatremia nursing symptoms and priorities | NurseNest",
    seoDescription: "Review hyponatremia causes, neurologic symptoms, fluid status clues, correction risks, and NCLEX nursing priorities.",
    audience: "hyponatremia questions",
    frame: "Hyponatremia means serum sodium is low relative to body water. The nursing danger is not just the lab value; it is water shifting into brain cells and causing cerebral edema, confusion, seizures, or respiratory compromise when severe.",
    physiology: "Mechanisms include excess free water, sodium loss, low effective arterial volume, SIADH, diuretic use, heart failure, cirrhosis, adrenal insufficiency, kidney disease, or polydipsia. Acute drops are generally more symptomatic than chronic stable hyponatremia because the brain has less time to adapt.",
    assess: "Assess mental status, headache, nausea, vomiting, muscle cramps, weakness, gait instability, seizure activity, fluid intake, recent surgery, medications, edema, orthostasis, urine output, serum osmolality, urine osmolality, urine sodium when ordered, and the trend speed.",
    priority: "Protect airway and safety, institute seizure precautions for severe symptoms, clarify fluid restriction or hypertonic saline orders, monitor sodium correction rate, trend neurologic status, and report deterioration promptly. Treatment differs by volume status and cause.",
    trap: "Do not treat all hyponatremia with normal saline or water restriction automatically. Do not correct chronic hyponatremia too fast. Do not miss medication causes such as thiazides, SSRIs, carbamazepine, or postoperative ADH stimulation in teaching stems.",
    teach: "Teach prescribed fluid limits, medication review, when to report confusion or falls, and avoiding excessive free-water intake during endurance activity unless directed. Discharge teaching should match the cause, not a generic sodium slogan.",
    linkSet: "electrolytes",
    refs: [
      "Sterns, R. H. (2015). Disorders of plasma sodium. <em>New England Journal of Medicine</em>, <em>372</em>(1), 55-65. https://doi.org/10.1056/NEJMra1404489",
      "Verbalis, J. G., Goldsmith, S. R., Greenberg, A., et al. (2013). Diagnosis, evaluation, and treatment of hyponatremia. <em>American Journal of Medicine</em>, <em>126</em>(10 Suppl 1), S1-S42. https://doi.org/10.1016/j.amjmed.2013.07.006",
      "Spasovski, G., Vanholder, R., Allolio, B., et al. (2014). Clinical practice guideline on diagnosis and treatment of hyponatraemia. <em>European Journal of Endocrinology</em>, <em>170</em>(3), G1-G47. https://doi.org/10.1530/EJE-13-1020",
    ],
  },
  {
    slug: "hypernatremia-causes-symptoms-nursing-care",
    title: "Hypernatremia: Causes, Symptoms, and Nursing Care",
    excerpt: "Review high sodium as a water-deficit problem, including neurologic symptoms, dehydration clues, correction safety, and nursing care priorities.",
    category: "Electrolytes",
    tags: ["Hypernatremia", "Sodium", "Electrolytes", "NCLEX-RN", "REx-PN", "Dehydration"],
    seoTitle: "Hypernatremia causes symptoms nursing care | NurseNest",
    seoDescription: "Study hypernatremia causes, symptoms, dehydration assessment, fluid replacement safety, and NCLEX nursing priorities.",
    audience: "hypernatremia questions",
    frame: "Hypernatremia is usually a water deficit relative to sodium, not simply too much table salt. It appears in patients who cannot access water, lose free water through fever, diarrhea, diuresis, diabetes insipidus, or have impaired thirst or cognition.",
    physiology: "High serum sodium raises extracellular osmolality, pulling water out of brain cells. Rapid development can cause irritability, weakness, confusion, seizures, or coma. Chronic hypernatremia must be corrected carefully because brain adaptation makes overly rapid correction dangerous.",
    assess: "Assess thirst, mucous membranes, skin turgor, orthostasis, tachycardia, hypotension, fever, urine output, urine concentration, mental status, weight loss, access to water, enteral feeding concentration, medications, and sodium trend speed.",
    priority: "Protect airway and neurologic safety, restore volume first if shock is present per orders, monitor sodium correction rate, provide prescribed hypotonic fluids or enteral free water when ordered, and evaluate the reason the patient could not maintain water balance.",
    trap: "Do not give free water rapidly to a severely hypernatremic patient without monitoring. Do not ignore diabetes insipidus when urine is very dilute and output is high. Do not assume older adults will report thirst reliably.",
    teach: "Teaching includes hydration access, caregiver monitoring, medication and feeding-plan review, reporting excessive urination or confusion, and follow-up for underlying causes such as DI or impaired intake.",
    linkSet: "electrolytes",
    refs: [
      "Sterns, R. H. (2015). Disorders of plasma sodium. <em>New England Journal of Medicine</em>, <em>372</em>(1), 55-65. https://doi.org/10.1056/NEJMra1404489",
      "Adrogue, H. J., & Madias, N. E. (2000). Hypernatremia. <em>New England Journal of Medicine</em>, <em>342</em>(20), 1493-1499. https://doi.org/10.1056/NEJM200005183422006",
      "Lindner, G., & Funk, G.-C. (2013). Hypernatremia in critically ill patients. <em>Journal of Critical Care</em>, <em>28</em>(2), 216.e11-216.e20. https://doi.org/10.1016/j.jcrc.2012.05.001",
    ],
  },
  {
    slug: "hypocalcemia-vs-hypercalcemia-nclex-guide",
    title: "Hypocalcemia vs Hypercalcemia: NCLEX Guide for Nursing Students",
    excerpt: "Compare low and high calcium through neuromuscular signs, ECG clues, causes, safety priorities, and nursing interventions for exam stems.",
    category: "Electrolytes",
    tags: ["Calcium", "Hypocalcemia", "Hypercalcemia", "Electrolytes", "NCLEX-RN", "REx-PN"],
    seoTitle: "Hypocalcemia vs hypercalcemia NCLEX guide | NurseNest",
    seoDescription: "Compare hypocalcemia and hypercalcemia symptoms, causes, ECG patterns, nursing priorities, and NCLEX safety traps.",
    audience: "calcium imbalance questions",
    frame: "Calcium disorders often test neuromuscular excitability. Low calcium makes nerves and muscles more excitable; high calcium slows many body systems. The exam contrast becomes easier when you picture twitchy, tight, tetany-prone hypocalcemia versus sluggish, dehydrated, stone-prone hypercalcemia.",
    physiology: "Hypocalcemia may follow hypoparathyroidism, thyroid or parathyroid surgery, vitamin D deficiency, pancreatitis, massive transfusion citrate binding, renal disease, or low magnesium. Hypercalcemia may appear with hyperparathyroidism, malignancy, immobility, thiazides, vitamin D excess, or bone breakdown.",
    assess: "Hypocalcemia clues include numbness, tingling, muscle cramps, tetany, laryngospasm risk, seizures, Chvostek and Trousseau signs in teaching, and prolonged QT. Hypercalcemia clues include constipation, polyuria, dehydration, kidney stones, bone pain, confusion, weakness, shortened QT, and dysrhythmias.",
    priority: "For symptomatic hypocalcemia, protect airway and seizure safety, prepare IV calcium as ordered, and monitor ECG. For hypercalcemia, monitor hydration, kidney function, mental status, fall risk, and ordered therapies such as IV fluids, bisphosphonates, calcitonin, or dialysis in severe cases.",
    trap: "Do not massage or aggressively manipulate muscle spasms when airway risk is the real priority. Do not miss digoxin interaction concerns with IV calcium contexts. Do not encourage immobility for hypercalcemia when mobility is part of prevention and treatment planning.",
    teach: "Teach cause-specific follow-up, prescribed calcium or vitamin D use, hydration for hypercalcemia when appropriate, fall precautions, and reporting tingling, spasms, confusion, severe constipation, or palpitations.",
    linkSet: "electrolytes",
    refs: [
      "Bilezikian, J. P., Khan, A. A., Silverberg, S. J., et al. (2022). Evaluation and management of primary hyperparathyroidism. <em>Journal of Bone and Mineral Research</em>, <em>37</em>(11), 2293-2314. https://doi.org/10.1002/jbmr.4677",
      "Shoback, D. M., Bilezikian, J. P., Costa, A. G., et al. (2016). Presentation of hypoparathyroidism. <em>Journal of Clinical Endocrinology & Metabolism</em>, <em>101</em>(6), 2300-2312. https://doi.org/10.1210/jc.2015-3909",
      "Stewart, A. F. (2005). Clinical practice: Hypercalcemia associated with cancer. <em>New England Journal of Medicine</em>, <em>352</em>(4), 373-379. https://doi.org/10.1056/NEJMcp042806",
    ],
  },
  {
    slug: "metabolic-acidosis-vs-metabolic-alkalosis",
    title: "Metabolic Acidosis vs Metabolic Alkalosis: Nursing ABG Guide",
    excerpt: "Separate metabolic acid-base disorders by bicarbonate direction, causes, compensation, symptoms, and nursing priorities for NCLEX-style ABG questions.",
    category: "Acid-Base Disorders",
    tags: ["ABG", "Metabolic Acidosis", "Metabolic Alkalosis", "NCLEX-RN", "REx-PN", "Electrolytes"],
    seoTitle: "Metabolic acidosis vs alkalosis nursing guide | NurseNest",
    seoDescription: "Learn metabolic acidosis and metabolic alkalosis ABG patterns, causes, compensation, symptoms, and NCLEX nursing priorities.",
    audience: "metabolic acid-base questions",
    frame: "Metabolic acid-base disorders begin with bicarbonate or fixed acid changes, not ventilation. Metabolic acidosis means bicarbonate is low or acid load is high. Metabolic alkalosis means bicarbonate is high or hydrogen ion is lost. The respiratory system compensates by changing CO2.",
    physiology: "Metabolic acidosis appears with DKA, lactic acidosis, renal failure, diarrhea, toxins, and shock. Metabolic alkalosis appears with vomiting, gastric suction, diuretics, volume depletion, hypokalemia, or excess bicarbonate. Compensation changes pH but does not fix the cause.",
    assess: "For acidosis, assess Kussmaul respirations, hypotension, dysrhythmias, confusion, hyperkalemia risk, renal function, glucose, lactate, and perfusion. For alkalosis, assess shallow respirations, paresthesias, cramps, hypokalemia, chloride depletion, vomiting, diuretic use, and ECG changes.",
    priority: "Treat the cause, support ABCs, monitor potassium and ECG, administer ordered fluids or insulin carefully when indicated, stop losses when possible, and reassess ABGs or venous gases per protocol. Severe pH changes require escalation because enzymes, heart rhythm, and oxygen delivery are affected.",
    trap: "Do not call respiratory compensation the primary disorder. Do not pick paper-bag breathing for metabolic alkalosis. Do not ignore potassium because acid-base and potassium shifts are tightly linked.",
    teach: "Teaching depends on cause: diabetes sick-day care, diarrhea hydration, medication review for diuretics, reporting prolonged vomiting, and attending follow-up labs after kidney or endocrine disorders.",
    linkSet: "acidBase",
    refs: [
      "Kraut, J. A., & Madias, N. E. (2014). Metabolic acidosis. <em>Nature Reviews Nephrology</em>, <em>10</em>(12), 751-765. https://doi.org/10.1038/nrneph.2014.186",
      "Emmett, M. (2020). Metabolic alkalosis: A brief pathophysiologic review. <em>Clinical Journal of the American Society of Nephrology</em>, <em>15</em>(12), 1848-1856. https://doi.org/10.2215/CJN.16041219",
      "Berend, K., de Vries, A. P. J., & Gans, R. O. B. (2014). Physiological approach to assessment of acid-base disturbances. <em>New England Journal of Medicine</em>, <em>371</em>(15), 1434-1445. https://doi.org/10.1056/NEJMra1003327",
    ],
  },
  {
    slug: "respiratory-acidosis-vs-respiratory-alkalosis",
    title: "Respiratory Acidosis vs Respiratory Alkalosis: ABG Patterns for Nurses",
    excerpt: "Anchor PaCO2 changes to ventilation problems so COPD, opioid toxicity, anxiety, sepsis, and ventilator stems make sense on nursing exams.",
    category: "Acid-Base Disorders",
    tags: ["ABG", "Respiratory Acidosis", "Respiratory Alkalosis", "PaCO2", "NCLEX-RN", "REx-PN"],
    seoTitle: "Respiratory acidosis vs respiratory alkalosis | NurseNest",
    seoDescription: "Study respiratory acidosis and alkalosis: PaCO2 direction, causes, compensation, symptoms, and nursing priorities.",
    audience: "respiratory acid-base questions",
    frame: "Respiratory acid-base disorders begin with ventilation. Respiratory acidosis means CO2 retention from hypoventilation. Respiratory alkalosis means excessive CO2 elimination from hyperventilation. The kidney compensates slowly by retaining or excreting bicarbonate.",
    physiology: "Respiratory acidosis appears with COPD exacerbation, severe asthma fatigue, opioid or sedative overdose, neuromuscular weakness, chest trauma, airway obstruction, or inadequate ventilator settings. Respiratory alkalosis appears with anxiety, pain, fever, pregnancy, early sepsis, hypoxemia-driven tachypnea, or ventilator over-assistance.",
    assess: "Assess respiratory rate and depth, work of breathing, breath sounds, oxygen saturation, capnography when available, mental status, medication exposure, ABG or VBG trends, PaCO2 direction, bicarbonate compensation, and whether the timeline is acute or chronic.",
    priority: "Support airway and ventilation, position for breathing, prepare reversal agents only when ordered, monitor sedation and respiratory depression, escalate fatigue or rising CO2, and treat causes such as bronchospasm, infection, pain, or ventilator mismatch.",
    trap: "Do not assume normal oxygen saturation rules out CO2 retention. Do not coach anxious breathing while ignoring sepsis or hypoxemia clues. Do not give high-flow oxygen in chronic CO2 retention contexts without ordered targets and monitoring.",
    teach: "Teach inhaler use, avoiding sedative misuse, COPD action plans, when to seek care for increasing somnolence or dyspnea, and device adherence for prescribed noninvasive ventilation or sleep-disordered breathing plans.",
    linkSet: "respiratory",
    refs: [
      "Berend, K., de Vries, A. P. J., & Gans, R. O. B. (2014). Physiological approach to assessment of acid-base disturbances. <em>New England Journal of Medicine</em>, <em>371</em>(15), 1434-1445. https://doi.org/10.1056/NEJMra1003327",
      "Laffey, J. G., & Kavanagh, B. P. (2002). Hypocapnia. <em>New England Journal of Medicine</em>, <em>347</em>(1), 43-53. https://doi.org/10.1056/NEJM200207043470108",
      "Epstein, S. K., & Singh, N. (2001). Respiratory acidosis. <em>Respiratory Care</em>, <em>46</em>(4), 366-383.",
    ],
  },
  {
    slug: "copd-symptoms-treatment-nursing-care",
    title: "COPD: Symptoms, Treatment Themes, and Nursing Care for Exams",
    excerpt: "Translate chronic airflow limitation into dyspnea patterns, exacerbation clues, oxygen safety, medication teaching, and NCLEX nursing priorities.",
    category: "Respiratory Disorders",
    tags: ["COPD", "Chronic Bronchitis", "Emphysema", "Oxygen Therapy", "NCLEX-RN", "REx-PN"],
    seoTitle: "COPD symptoms treatment nursing care | NurseNest",
    seoDescription: "Review COPD symptoms, exacerbations, bronchodilators, steroids, oxygen targets, pulmonary rehab, and NCLEX nursing care.",
    audience: "COPD questions",
    frame: "COPD is chronic airflow limitation, usually from emphysema and chronic bronchitis patterns. Exams test whether you recognize increased work of breathing, infection-triggered exacerbations, CO2 retention risk, and long-term teaching that reduces readmissions.",
    physiology: "Airway inflammation, mucus hypersecretion, loss of elastic recoil, air trapping, and ventilation-perfusion mismatch create dyspnea and impaired gas exchange. Chronic disease may lead to pulmonary hypertension, right-sided heart strain, malnutrition, fatigue, and limited activity tolerance.",
    assess: "Assess baseline oxygen saturation, ordered target range, breath sounds, sputum color and volume, fever, accessory muscle use, ability to speak, mental status, ABGs when ordered, inhaler technique, smoking history, vaccination status, and exacerbation frequency.",
    priority: "Position upright, administer bronchodilators and steroids as ordered, titrate oxygen to prescribed targets, monitor for rising CO2 or somnolence, support noninvasive ventilation when ordered, encourage pursed-lip breathing, and escalate signs of respiratory failure.",
    trap: "Do not withhold oxygen from a hypoxemic COPD patient out of fear alone; use ordered targets and monitoring. Do not confuse chronic barrel chest with acute distress. Do not skip infection surveillance when sputum changes and fever appear.",
    teach: "Teach smoking cessation support, inhaler and spacer technique, pulmonary rehabilitation, energy conservation, nutrition strategies, vaccination, action-plan triggers, and when worsening dyspnea or sputum requires urgent contact.",
    linkSet: "respiratory",
    refs: [
      "Global Initiative for Chronic Obstructive Lung Disease. (2025). <em>Global strategy for prevention, diagnosis and management of COPD</em>. https://goldcopd.org/",
      "Celli, B. R., & Wedzicha, J. A. (2019). Update on clinical aspects of chronic obstructive pulmonary disease. <em>New England Journal of Medicine</em>, <em>381</em>(13), 1257-1266. https://doi.org/10.1056/NEJMra1900500",
      "Vogelmeier, C. F., Criner, G. J., Martinez, F. J., et al. (2017). Global strategy for diagnosis, management, and prevention of COPD 2017 report. <em>American Journal of Respiratory and Critical Care Medicine</em>, <em>195</em>(5), 557-582. https://doi.org/10.1164/rccm.201701-0218PP",
    ],
  },
  {
    slug: "asthma-pathophysiology-emergency-nursing-interventions",
    title: "Asthma Pathophysiology and Emergency Nursing Interventions",
    excerpt: "Move from airway inflammation and bronchospasm to severity clues, medication sequencing concepts, and emergency escalation priorities.",
    category: "Respiratory Disorders",
    tags: ["Asthma", "Bronchospasm", "Albuterol", "NCLEX-RN", "REx-PN", "Emergency Nursing"],
    seoTitle: "Asthma pathophysiology emergency nursing care | NurseNest",
    seoDescription: "Review asthma pathophysiology, severe attack assessment, beta-agonists, steroids, oxygen, and emergency nursing priorities.",
    audience: "asthma emergency questions",
    frame: "Asthma is reversible airway obstruction caused by inflammation, bronchial hyperresponsiveness, bronchospasm, edema, and mucus. Emergency questions test whether you recognize severe obstruction early, especially when wheezing becomes quiet because airflow is poor.",
    physiology: "Triggers activate inflammatory cells and smooth-muscle constriction, narrowing airways and causing air trapping. As fatigue develops, ventilation worsens and PaCO2 may rise, which is a late and concerning change in a patient who was hyperventilating earlier.",
    assess: "Assess ability to speak, respiratory rate, accessory muscle use, retractions, oxygen saturation, peak flow if able, mental status, breath-sound intensity, pulsus paradoxus if taught, trigger exposure, medication use, and response to initial bronchodilator therapy.",
    priority: "Stay with unstable patients, apply oxygen for hypoxemia, administer short-acting bronchodilators and systemic corticosteroids as ordered, prepare magnesium sulfate or epinephrine pathways when indicated, monitor potassium with frequent beta-agonists, and escalate fatigue or silent chest.",
    trap: "Do not interpret silent chest as improvement. Do not delay bronchodilators for lengthy teaching in an acute attack. Do not rely only on pulse oximetry when work of breathing and mental status are worsening.",
    teach: "Teach controller versus rescue inhaler purpose, spacer technique, trigger avoidance, action plans, peak-flow zones if prescribed, steroid burst completion, and urgent care signs such as poor response to rescue therapy or trouble speaking.",
    linkSet: "respiratory",
    refs: [
      "Global Initiative for Asthma. (2025). <em>Global strategy for asthma management and prevention</em>. https://ginasthma.org/",
      "National Heart, Lung, and Blood Institute. (2020). <em>2020 focused updates to the asthma management guidelines</em>. https://www.nhlbi.nih.gov/",
      "Reddel, H. K., Bacharier, L. B., Bateman, E. D., et al. (2022). Global Initiative for Asthma Strategy 2021: Executive summary. <em>American Journal of Respiratory and Critical Care Medicine</em>, <em>205</em>(1), 17-35. https://doi.org/10.1164/rccm.202109-2205PP",
    ],
  },
  {
    slug: "pulmonary-embolism-signs-symptoms-nursing-priorities",
    title: "Pulmonary Embolism: Signs, Symptoms, and Nursing Priorities",
    excerpt: "Link sudden dyspnea, pleuritic pain, tachycardia, hypoxia, clot risk, and anticoagulation safety to NCLEX-style pulmonary embolism priorities.",
    category: "Cardiovascular Disorders",
    tags: ["Pulmonary Embolism", "DVT", "Anticoagulation", "Hypoxia", "NCLEX-RN", "REx-PN"],
    seoTitle: "Pulmonary embolism signs symptoms nursing priorities | NurseNest",
    seoDescription: "Study pulmonary embolism signs, risk factors, oxygen and monitoring priorities, anticoagulation safety, and NCLEX escalation.",
    audience: "pulmonary embolism questions",
    frame: "Pulmonary embolism occurs when clot burden obstructs pulmonary circulation. The immediate nursing concern is impaired oxygenation, right-heart strain, and possible shock. PE can look dramatic with sudden dyspnea and chest pain, or subtle with unexplained tachycardia and anxiety.",
    physiology: "A clot raises pulmonary vascular resistance, worsens ventilation-perfusion mismatch, and may reduce left-sided filling when the right ventricle fails under pressure. Small emboli may cause pleuritic pain and hypoxemia; massive PE may cause syncope, hypotension, pulseless electrical activity, or cardiac arrest.",
    assess: "Assess dyspnea, pleuritic chest pain, tachycardia, tachypnea, oxygen saturation, hemoptysis, syncope, unilateral leg symptoms, recent surgery, immobility, malignancy, estrogen therapy, pregnancy, prior VTE, and bleeding risk before anticoagulation.",
    priority: "Apply oxygen as needed, keep the patient on bed rest if unstable, notify rapidly, establish IV access, prepare diagnostics and anticoagulation as ordered, monitor hemodynamics, and watch for bleeding once therapy begins. Massive PE pathways require rapid team response.",
    trap: "Do not ambulate an unstable suspected PE patient to 'work it out.' Do not wait for calf pain before suspecting PE. Do not ignore sudden dyspnea in a postoperative patient with tachycardia.",
    teach: "Teach anticoagulant safety, mobility and compression-device adherence when prescribed, hydration and ambulation after surgery, VTE recurrence signs, and emergency symptoms such as sudden shortness of breath, chest pain, fainting, or coughing blood.",
    linkSet: "clot",
    refs: [
      "Konstantinides, S. V., Meyer, G., Becattini, C., et al. (2020). 2019 ESC Guidelines for diagnosis and management of acute pulmonary embolism. <em>European Heart Journal</em>, <em>41</em>(4), 543-603. https://doi.org/10.1093/eurheartj/ehz405",
      "Stevens, S. M., Woller, S. C., Kreuziger, L. B., et al. (2021). Antithrombotic therapy for VTE disease: Second update. <em>Chest</em>, <em>160</em>(6), e545-e608. https://doi.org/10.1016/j.chest.2021.07.055",
      "Rivera-Lebron, B., McDaniel, M., Ahrar, K., et al. (2019). Diagnosis, treatment and follow up of acute pulmonary embolism. <em>American Journal of Respiratory and Critical Care Medicine</em>, <em>199</em>(10), e32-e53. https://doi.org/10.1164/rccm.201901-0158ST",
    ],
  },
  {
    slug: "deep-vein-thrombosis-nursing-guide",
    title: "Deep Vein Thrombosis (DVT): Nursing Assessment, Prevention, and Care",
    excerpt: "Master unilateral swelling, DVT prevention, anticoagulation safety, PE warning signs, and patient teaching for nursing exam questions.",
    category: "Cardiovascular Disorders",
    tags: ["DVT", "VTE", "Anticoagulation", "NCLEX-RN", "REx-PN", "Immobility"],
    seoTitle: "Deep vein thrombosis nursing guide | NurseNest",
    seoDescription: "Review DVT risk factors, assessment findings, prevention bundles, anticoagulation teaching, PE complications, and nursing priorities.",
    audience: "deep vein thrombosis questions",
    frame: "DVT is clot formation in the deep venous system, usually legs. Nursing exams connect Virchow's triad with assessment, prevention, anticoagulation safety, and pulmonary embolism escalation.",
    physiology: "Venous stasis, endothelial injury, and hypercoagulability increase clot risk. Surgery, immobility, malignancy, pregnancy, estrogen therapy, prior VTE, central lines, and inherited thrombophilia may appear in stems. A clot can propagate or embolize to the lungs.",
    assess: "Assess unilateral calf or thigh swelling, warmth, tenderness, erythema, circumference difference, pitting edema, risk factors, respiratory symptoms, bleeding risk, platelet count when heparin is used, renal function, and contraindications to compression or anticoagulation.",
    priority: "Notify for suspected new DVT, avoid massaging the limb, implement ordered anticoagulation and compression strategies, encourage early ambulation when safe, monitor for PE signs, and teach prevention. Imaging and medication decisions are provider-directed.",
    trap: "Do not rely on Homan sign as a modern diagnostic test. Do not massage a painful swollen calf. Do not confuse prophylactic anticoagulation with therapeutic dosing in exam reasoning.",
    teach: "Teach anticoagulant precautions, taking medication exactly as prescribed, avoiding prolonged immobility, hydration, compression use when ordered, and seeking emergency care for sudden dyspnea, chest pain, fainting, or hemoptysis.",
    linkSet: "clot",
    refs: [
      "Stevens, S. M., Woller, S. C., Kreuziger, L. B., et al. (2021). Antithrombotic therapy for VTE disease: Second update. <em>Chest</em>, <em>160</em>(6), e545-e608. https://doi.org/10.1016/j.chest.2021.07.055",
      "Kearon, C., Akl, E. A., Ornelas, J., et al. (2016). Antithrombotic therapy for VTE disease. <em>Chest</em>, <em>149</em>(2), 315-352. https://doi.org/10.1016/j.chest.2015.11.026",
      "National Institute for Health and Care Excellence. (2023). <em>Venous thromboembolic diseases: Diagnosis, management and thrombophilia testing</em> (NG158). https://www.nice.org.uk/guidance/ng158",
    ],
  },
  {
    slug: "stroke-ischemic-vs-hemorrhagic-nursing-care",
    title: "Stroke: Ischemic vs Hemorrhagic Nursing Care and Exam Priorities",
    excerpt: "Separate ischemic and hemorrhagic stroke cues, imaging priorities, thrombolysis safety, blood pressure themes, swallow screening, and neuro monitoring.",
    category: "Neurological Disorders",
    tags: ["Stroke", "Ischemic Stroke", "Hemorrhagic Stroke", "NCLEX-RN", "REx-PN", "Neuro Assessment"],
    seoTitle: "Ischemic vs hemorrhagic stroke nursing care | NurseNest",
    seoDescription: "Compare ischemic and hemorrhagic stroke nursing care, FAST assessment, imaging, tPA exclusions, BP priorities, and safety.",
    audience: "stroke comparison questions",
    frame: "Stroke is acute neurologic injury from interrupted blood flow or bleeding. Ischemic stroke is vessel occlusion; hemorrhagic stroke is bleeding into or around brain tissue. The nursing priority is rapid recognition, stabilization, time documentation, and avoiding contraindicated therapies.",
    physiology: "Ischemia creates an infarct core and potentially salvageable penumbra, making last-known-well time central. Hemorrhage increases pressure, injures tissue directly, and may worsen with anticoagulation or uncontrolled hypertension. Both can cause edema and increased intracranial pressure.",
    assess: "Assess FAST signs, speech, gaze, visual fields, limb drift, sensation, ataxia, severe headache, vomiting, seizure, blood glucose, anticoagulant use, blood pressure, last-known-well time, swallow safety, and neurologic scale trends when used.",
    priority: "Activate stroke response, maintain airway and oxygenation, check glucose, keep NPO until swallow screen, prepare for noncontrast CT, protect from falls and aspiration, monitor blood pressure within ordered parameters, and avoid antithrombotics until hemorrhage is excluded.",
    trap: "Do not give thrombolytics or anticoagulants when hemorrhage is suspected or imaging is not cleared. Do not lower blood pressure aggressively without protocol context. Do not offer oral fluids before swallow screening.",
    teach: "Teach FAST recognition, emergency activation, medication adherence, BP control, diabetes and lipid management, smoking cessation, rehab participation, and caregiver awareness of aspiration and fall risks.",
    linkSet: "neuro",
    refs: [
      "Powers, W. J., Rabinstein, A. A., Ackerson, T., et al. (2019). Guidelines for early management of acute ischemic stroke: 2019 update. <em>Stroke</em>, <em>50</em>(12), e344-e418. https://doi.org/10.1161/STR.0000000000000211",
      "Greenberg, S. M., Ziai, W. C., Cordonnier, C., et al. (2022). Guideline for management of spontaneous intracerebral hemorrhage. <em>Stroke</em>, <em>53</em>(7), e282-e361. https://doi.org/10.1161/STR.0000000000000407",
      "Kleindorfer, D. O., Towfighi, A., Chaturvedi, S., et al. (2021). Guideline for prevention of stroke in patients with stroke and transient ischemic attack. <em>Stroke</em>, <em>52</em>(7), e364-e467. https://doi.org/10.1161/STR.0000000000000375",
    ],
  },
  {
    slug: "increased-intracranial-pressure-nursing-priorities",
    title: "Increased Intracranial Pressure: Nursing Priorities and Monitoring",
    excerpt: "Use neuro checks, positioning, Cushing triad, osmotherapy concepts, seizure safety, and escalation cues to answer increased ICP questions safely.",
    category: "Neurological Disorders",
    tags: ["ICP", "Traumatic Brain Injury", "Cushing Triad", "NCLEX-RN", "REx-PN", "Neuro Checks"],
    seoTitle: "Increased ICP nursing priorities | NurseNest",
    seoDescription: "Review increased intracranial pressure signs, monitoring, positioning, osmotherapy, seizure precautions, and nursing priorities.",
    audience: "increased intracranial pressure questions",
    frame: "Increased intracranial pressure threatens cerebral perfusion and can lead to herniation. Nursing exams emphasize trend recognition because waiting for late signs is unsafe. Head injury, hemorrhage, tumor, infection, hydrocephalus, and edema can all raise pressure.",
    physiology: "The skull contains brain, blood, and cerebrospinal fluid. When one volume rises and compensation fails, ICP increases and cerebral perfusion pressure may fall. Herniation syndromes compress vital structures. Cushing triad is a late sign, not a goalpost for action.",
    assess: "Assess level of consciousness, orientation, pupils, motor response, GCS or ordered neuro scale, headache, vomiting, seizures, posturing, vital signs, temperature, oxygenation, ICP and CPP if monitored, fluid balance, and signs of diabetes insipidus or SIADH after brain injury.",
    priority: "Maintain airway and oxygenation, keep head midline, elevate head of bed as ordered, avoid hip and neck flexion, cluster care carefully, control fever and pain, suction briefly only when needed, implement seizure precautions, and prepare ordered hyperosmolar therapy or CSF drainage.",
    trap: "Do not lower the head flat unless a specific procedure or hemodynamic reason supports it. Do not wait for Cushing triad before reporting deterioration. Do not overstimulate, prolong suctioning, or ignore fever because all can raise metabolic demand or ICP.",
    teach: "Family teaching includes why stimulation may be limited, what neuro changes staff are tracking, and the importance of reporting new agitation, sleepiness, vomiting, or seizure activity after discharge from mild head injury.",
    linkSet: "neuro",
    refs: [
      "Carney, N., Totten, A. M., O'Reilly, C., et al. (2017). Guidelines for management of severe traumatic brain injury, fourth edition. <em>Neurosurgery</em>, <em>80</em>(1), 6-15. https://doi.org/10.1227/NEU.0000000000001432",
      "Hawryluk, G. W. J., Aguilera, S., Buki, A., et al. (2019). A management algorithm for patients with intracranial pressure monitoring. <em>Intensive Care Medicine</em>, <em>45</em>, 1783-1794. https://doi.org/10.1007/s00134-019-05805-9",
      "Chesnut, R., Videtta, W., Vespa, P., et al. (2014). Intracranial pressure monitoring: Fundamental considerations. <em>Neurocritical Care</em>, <em>21</em>(Suppl 2), S64-S84. https://doi.org/10.1007/s12028-014-0048-y",
    ],
  },
  {
    slug: "seizure-disorders-treatment-nursing-care",
    title: "Seizure Disorders: Treatment Themes and Nursing Care",
    excerpt: "Differentiate provoked seizures and epilepsy, protect patients during events, recognize status epilepticus, and teach medication safety for exams.",
    category: "Neurological Disorders",
    tags: ["Seizures", "Epilepsy", "Status Epilepticus", "NCLEX-RN", "REx-PN", "Airway"],
    seoTitle: "Seizure disorders treatment nursing care | NurseNest",
    seoDescription: "Review seizure nursing care, safety during seizures, postictal assessment, antiseizure medication teaching, and status epilepticus priorities.",
    audience: "seizure disorder questions",
    frame: "Seizures are abnormal bursts of neuronal activity. Nursing exams test event safety, airway protection after convulsions, timing, documentation, medication adherence, toxicity, and status epilepticus escalation.",
    physiology: "Provoked seizures can follow fever, hypoglycemia, hyponatremia, alcohol withdrawal, infection, head injury, or drugs. Epilepsy implies recurrent unprovoked seizures. Status epilepticus is prolonged or repeated seizure activity without recovery and can cause hypoxia, acidosis, hyperthermia, and neuronal injury.",
    assess: "Assess onset time, type of movements, eye deviation, incontinence, cyanosis, injury, oxygenation, glucose, precipitating factors, medication levels when ordered, pregnancy considerations for selected drugs, postictal confusion, and return to baseline.",
    priority: "Protect from injury, lower to floor if needed, turn side-lying when possible, do not restrain, do not place objects in the mouth, time the seizure, maintain airway after, provide oxygen and suction as needed, and prepare benzodiazepines or second-line agents per protocol for prolonged seizures.",
    trap: "Do not force a bite block into the mouth. Do not leave the patient alone during an active generalized seizure. Do not focus on teaching before airway, injury prevention, and timing in an acute event.",
    teach: "Teach medication adherence, avoiding abrupt discontinuation, sleep and trigger management, safety around water and heights, driving rules by jurisdiction, pregnancy planning, drug interactions, and when to call emergency services.",
    linkSet: "neuro",
    refs: [
      "Glauser, T., Shinnar, S., Gloss, D., et al. (2016). Evidence-based guideline: Treatment of convulsive status epilepticus. <em>Neurology</em>, <em>86</em>(16), 1524-1527. https://doi.org/10.1212/WNL.0000000000002635",
      "Fisher, R. S., Cross, J. H., French, J. A., et al. (2017). Operational classification of seizure types by the International League Against Epilepsy. <em>Epilepsia</em>, <em>58</em>(4), 522-530. https://doi.org/10.1111/epi.13670",
      "Trinka, E., Cock, H., Hesdorffer, D., et al. (2015). Definition and classification of status epilepticus. <em>Epilepsia</em>, <em>56</em>(10), 1515-1523. https://doi.org/10.1111/epi.13121",
    ],
  },
];

for (const p of compactPosts) {
  posts.push({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    audience: p.audience,
    clinicalFrame: [
      p.frame,
      "For NCLEX-RN and REx-PN learners, the safest approach is to translate the topic into a patient problem: oxygenation, perfusion, neurologic stability, fluid balance, medication safety, or infection control. That translation makes priority questions less about memorizing a chart and more about preventing harm.",
      "The article below is written for nursing education rather than self-treatment. Use it to study assessment cues, clinical reasoning, and what to report. In practice, follow local orders, protocols, and scope.",
    ],
    pathophysiology: [
      p.physiology,
      "Pathophysiology matters because the same symptom can point to different actions depending on mechanism. Dyspnea from bronchospasm, fluid overload, embolism, metabolic acidosis, or neurologic fatigue all demand different monitoring and escalation.",
      "When an item gives a timeline, use it. Acute deterioration usually raises the priority level; chronic compensated findings may lead toward teaching and monitoring unless a new instability appears.",
    ],
    assessment: [
      p.assess,
      "Compare subjective symptoms with objective data. Pain, anxiety, fatigue, or nausea are important, but they become more actionable when paired with vital signs, labs, intake-output, ECG, neuro checks, oxygenation, or medication timing.",
      "Document changes clearly: what changed, when it started, what the baseline was, what interventions were already done, and how the patient responded. That is the same logic behind strong exam answer choices.",
    ],
    priorities: [
      p.priority,
      "Use ordered protocols and reassessment loops: intervene, measure response, and escalate if the response is inadequate.",
      "Protect patients from predictable complications such as falls, aspiration, bleeding, dysrhythmia, seizure injury, hypoxia, worsening shock, or medication adverse effects.",
      "Coordinate interdisciplinary care without stepping outside nursing scope.",
    ],
    traps: [
      p.trap,
      "Do not choose an answer that treats a lab number while ignoring an unstable patient.",
      "Do not choose an education-only response when the stem describes acute deterioration.",
      "Do not invent medication changes that require prescriber input unless a standing protocol is clearly stated.",
    ],
    teaching: [
      p.teach,
      "Good teaching is specific and observable. Patients should know what symptom to watch for, what action to take, and when to seek urgent help. Avoid vague reassurance such as 'this is expected' when the finding could represent deterioration.",
    ],
    links: [...sharedLinks[p.linkSet], { href: "/blog/siadh-vs-diabetes-insipidus-nursing-comparison", label: "SIADH vs diabetes insipidus nursing comparison" }],
    faqs: [
      { q: `What is the first nursing priority for ${p.title.toLowerCase()}?`, a: "Assess immediate stability first: airway, breathing, circulation, neurologic change, severe pain, active bleeding, and rapidly worsening vital signs. Then match interventions to the cause and ordered plan." },
      { q: "How do I avoid confusing similar exam topics?", a: "Compare mechanism, assessment pattern, and safety risk. The correct answer usually protects the patient from the next likely complication rather than naming the diagnosis only." },
      { q: "When should findings be reported urgently?", a: "Report new confusion, respiratory distress, shock signs, severe electrolyte symptoms, seizure activity, chest pain, focal neurologic deficits, uncontrolled bleeding, or rapid deterioration." },
      { q: "Are these articles a treatment protocol?", a: "No. They are nursing education for exam preparation and clinical reasoning. Real care follows orders, institutional policies, and local scope." },
    ],
    references: p.refs,
  });
}

mkdirSync(OUT_DIR, { recursive: true });
for (const spec of posts) {
  writeFileSync(join(OUT_DIR, `${spec.slug}.md`), render(spec), "utf8");
}

console.log(`Wrote ${posts.length} clinical long-tail posts to ${OUT_DIR}`);
