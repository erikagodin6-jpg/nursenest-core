import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let c = fs.readFileSync(fp, "utf8");
    const marker = `"${id}":`;
    const idx = c.indexOf(marker);
    if (idx === -1) continue;
    if (!c.slice(idx, idx + 300).includes("[WRITE YOUR")) continue;
    let bc = 0, es = idx + marker.length;
    while (es < c.length && c[es] !== "{") es++;
    let start = es;
    for (let i = start; i < c.length; i++) {
      if (c[i] === "{") bc++;
      else if (c[i] === "}") { bc--; if (bc === 0) { es = i + 1; break; } }
    }
    const newBlock = `{\n    ${buildLS(lesson)}\n  }`;
    c = c.slice(0, start) + newBlock + c.slice(es);
    fs.writeFileSync(fp, c, "utf8");
    console.log(`Injected ${id} in ${file}`);
    return true;
  }
  console.log(`NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {

"addisons-disease-basics-rpn": {
  title: "Addison Disease (Primary Adrenal Insufficiency)",
  cellular: {
    title: "Pathophysiology of Addison Disease",
    content: "Addison disease is primary adrenal insufficiency resulting from destruction or dysfunction of the adrenal cortex, leading to deficient production of cortisol (glucocorticoid), aldosterone (mineralocorticoid), and adrenal androgens. The adrenal cortex normally produces these hormones under regulation by the hypothalamic-pituitary-adrenal (HPA) axis, with cortisol secretion driven by ACTH from the anterior pituitary.\n\nIn Addison disease, at least 90% of the adrenal cortex must be destroyed before clinical insufficiency becomes apparent, reflecting the substantial functional reserve of these glands. The most common cause in developed countries is autoimmune adrenalitis (80-90%), where T-cell-mediated destruction targets adrenocortical cells. Autoantibodies against 21-hydroxylase are present in most cases. It may occur in isolation or as part of autoimmune polyendocrine syndromes (APS type 1 or type 2, associated with thyroid disease, type 1 diabetes, pernicious anemia, vitiligo).\n\nOther causes include infectious destruction (tuberculosis is the leading cause worldwide, fungal infections such as histoplasmosis, CMV in AIDS), bilateral adrenal hemorrhage (Waterhouse-Friderichsen syndrome in meningococcal sepsis, anticoagulant therapy), metastatic disease (lung, breast, melanoma), infiltrative diseases (sarcoidosis, amyloidosis, hemochromatosis), and bilateral adrenalectomy.\n\nCortisol deficiency causes profound metabolic derangements. Cortisol is essential for maintaining vascular tone (permissive action for catecholamines), hepatic gluconeogenesis, protein and fat mobilisation, anti-inflammatory responses, and stress adaptation. Without cortisol, patients cannot mount an appropriate stress response, and even minor illnesses can precipitate life-threatening adrenal crisis.\n\nAldosterone deficiency disrupts the renin-angiotensin-aldosterone system's regulation of sodium, potassium, and water balance. Without aldosterone, the kidneys cannot retain sodium and excrete potassium effectively, leading to hyponatremia, hyperkalemia, and hypovolemia. The hyperkalemia can be severe enough to cause cardiac arrhythmias.\n\nA distinguishing feature of primary adrenal insufficiency is hyperpigmentation. Low cortisol removes negative feedback on the pituitary, causing markedly elevated ACTH secretion. ACTH is derived from the same precursor molecule (pro-opiomelanocortin, POMC) as melanocyte-stimulating hormone (MSH). Elevated POMC processing produces excess MSH, causing diffuse hyperpigmentation most prominent in skin creases (palmar creases), scars, areolae, buccal mucosa, and sun-exposed areas. This finding is ABSENT in secondary adrenal insufficiency (pituitary ACTH deficiency) because ACTH is not elevated.\n\nAdrenal crisis (Addisonian crisis) is a life-threatening emergency precipitated by physiologic stress (infection, surgery, trauma, dehydration) in a patient with adrenal insufficiency who cannot mount an appropriate cortisol response. It presents with severe hypotension refractory to fluids and vasopressors, altered mental status, severe abdominal pain mimicking acute abdomen, fever, hyponatremia, hyperkalemia, and hypoglycemia. Without emergent IV hydrocortisone and fluid resuscitation, it is rapidly fatal."
  },
  riskFactors: [
    "Autoimmune disease history (thyroid disease, type 1 diabetes, vitiligo, pernicious anemia - autoimmune polyendocrine syndromes)",
    "Tuberculosis (leading cause of Addison disease worldwide, especially in endemic regions)",
    "HIV/AIDS (CMV adrenalitis, fungal infections, Kaposi sarcoma infiltration)",
    "Anticoagulant therapy (risk of bilateral adrenal hemorrhage)",
    "Meningococcal sepsis (Waterhouse-Friderichsen syndrome - bilateral adrenal hemorrhage)",
    "Bilateral metastatic disease to the adrenals (lung, breast, melanoma, lymphoma)",
    "Long-term exogenous glucocorticoid use followed by abrupt discontinuation (causes secondary insufficiency from HPA axis suppression)",
    "Female sex (autoimmune Addison disease has 2:1 female predominance)"
  ],
  diagnostics: [
    "Early morning serum cortisol: low cortisol (<83 nmol/L or <3 mcg/dL at 8 AM) is highly suggestive; cortisol >500 nmol/L (>18 mcg/dL) effectively rules out adrenal insufficiency",
    "ACTH stimulation test (cosyntropin test): gold standard; synthetic ACTH (cosyntropin 250 mcg IV) is administered and cortisol measured at 30 and 60 minutes; failure to rise above 500 nmol/L confirms adrenal insufficiency",
    "Plasma ACTH level: elevated in PRIMARY insufficiency (loss of negative feedback); low or normal in SECONDARY insufficiency (pituitary cause) - this distinguishes the two",
    "Electrolytes: hyponatremia, hyperkalemia, mild metabolic acidosis (from aldosterone deficiency in primary disease)",
    "Blood glucose: hypoglycemia (cortisol is essential for gluconeogenesis)",
    "CBC: may show eosinophilia and lymphocytosis (cortisol normally suppresses eosinophils)",
    "21-hydroxylase antibodies: positive in autoimmune Addison disease",
    "CT adrenal glands: small atrophic glands in autoimmune disease; enlarged glands with calcification in TB or hemorrhage; mass lesions in metastatic disease"
  ],
  management: [
    "Lifelong glucocorticoid replacement: hydrocortisone 15-25 mg/day in divided doses (typically 10-15 mg on waking, 5-10 mg in early afternoon) mimicking the normal diurnal cortisol rhythm; alternative: prednisone 3-5 mg/day",
    "Mineralocorticoid replacement: fludrocortisone 0.05-0.2 mg daily for aldosterone deficiency (primary insufficiency only; NOT needed in secondary insufficiency where aldosterone is preserved)",
    "Stress dosing (sick day rules): double or triple the glucocorticoid dose during febrile illness, surgery, trauma, or significant physiologic stress; educate patient and family on this critical intervention",
    "Adrenal crisis management: IV hydrocortisone 100 mg bolus immediately, followed by 50-100 mg every 6-8 hours; aggressive IV normal saline for volume resuscitation; identify and treat precipitating cause; dextrose for hypoglycemia",
    "Medical alert identification: patient must wear medical alert bracelet/necklace indicating adrenal insufficiency and steroid dependence at all times",
    "Emergency injection kit: patients should carry a prefilled hydrocortisone IM injection kit for situations where oral medication cannot be taken (vomiting, loss of consciousness); train patient and family on administration"
  ],
  nursingActions: [
    "Assess for signs of adrenal crisis: profound hypotension, altered mental status, severe abdominal pain, nausea/vomiting, fever, weakness - this is a medical emergency requiring immediate IV hydrocortisone",
    "Monitor vital signs closely: blood pressure (orthostatic measurements), heart rate, temperature; hypotension resistant to fluids may indicate cortisol deficiency",
    "Monitor electrolytes: sodium (hyponatremia), potassium (hyperkalemia - assess for ECG changes), glucose (hypoglycemia - ensure regular meals and snacks)",
    "Administer replacement hormones at prescribed times: hydrocortisone in the morning with a smaller afternoon dose to mimic normal cortisol rhythm; fludrocortisone in the morning",
    "Educate on sick day rules: this is potentially life-saving education - double or triple glucocorticoid dose during illness (fever, vomiting, diarrhea, significant stress); seek emergency care if unable to take oral medications",
    "Ensure patient has medical alert identification and carries emergency injection kit; teach family/caregivers how to administer IM hydrocortisone",
    "Never abruptly discontinue glucocorticoid replacement - adrenal crisis can result; educate that this is a lifelong medication",
    "Assess skin for hyperpigmentation: darkening of skin creases, scars, areolae, and buccal mucosa (monitoring for adequacy of replacement)",
    "Pre-surgical preparation: collaborate with anesthesia and surgical team for stress-dose steroids (typically IV hydrocortisone 100 mg before induction, then every 8 hours perioperatively)"
  ],
  assessmentFindings: [
    "Hyperpigmentation of skin creases (palmar), scars, areolae, buccal mucosa, and sun-exposed areas (pathognomonic for primary adrenal insufficiency)",
    "Fatigue, weakness, and muscle wasting (from cortisol and androgen deficiency)",
    "Weight loss and decreased appetite, often with salt craving (sodium depletion from aldosterone deficiency)",
    "Orthostatic hypotension and dizziness (volume depletion and loss of cortisol's permissive effect on catecholamines)",
    "Nausea, vomiting, and abdominal pain (can mimic acute abdomen during crisis)",
    "Hypoglycemia symptoms: shakiness, confusion, diaphoresis (especially during fasting or illness)",
    "Depression, irritability, and difficulty concentrating"
  ],
  signs: {
    left: [
      "Hyperpigmentation (skin creases, scars, buccal mucosa)",
      "Orthostatic hypotension",
      "Fatigue and muscle weakness",
      "Weight loss with salt craving",
      "Hypoglycemia"
    ],
    right: [
      "Adrenal crisis: severe hypotension refractory to fluids (emergency)",
      "Altered mental status or loss of consciousness",
      "Hyperkalemia with ECG changes (peaked T waves)",
      "Severe hyponatremia (seizures, cerebral edema)",
      "Fever and severe abdominal pain mimicking acute abdomen"
    ]
  },
  medications: [
    {
      name: "Hydrocortisone (Cortef)",
      type: "Glucocorticoid Replacement",
      action: "Synthetic cortisol that replaces the deficient endogenous cortisol; provides glucocorticoid effects including maintenance of blood glucose (gluconeogenesis), vascular tone (permissive effect on catecholamines), anti-inflammatory effects, and stress response capability",
      sideEffects: "At replacement doses: minimal side effects; at supraphysiologic doses or chronic excess: weight gain, moon facies, glucose intolerance, osteoporosis, skin thinning, immunosuppression, mood changes, growth suppression in children",
      contra: "Systemic fungal infections (at supraphysiologic doses); no absolute contraindications for replacement therapy in diagnosed adrenal insufficiency",
      pearl: "Divide daily dose to mimic diurnal rhythm: largest dose on waking (10-15 mg), smaller dose early afternoon (5-10 mg); NEVER take at bedtime as this disrupts sleep; during stress (illness, surgery): double or triple the dose immediately; for adrenal crisis: 100 mg IV stat then 50 mg every 6-8 hours"
    },
    {
      name: "Fludrocortisone (Florinef)",
      type: "Mineralocorticoid Replacement",
      action: "Synthetic aldosterone analogue that acts on renal collecting tubules to promote sodium and water reabsorption and potassium excretion, correcting the hyponatremia, hyperkalemia, and hypovolemia of aldosterone deficiency",
      sideEffects: "Hypertension (from sodium and water retention), hypokalemia (from enhanced potassium excretion), edema, headache, weight gain",
      contra: "Systemic fungal infections; use with caution in heart failure and hypertension",
      pearl: "Needed ONLY in primary adrenal insufficiency (Addison disease); NOT needed in secondary insufficiency because aldosterone secretion is preserved (regulated by renin-angiotensin, not ACTH); dose adjusted based on blood pressure, serum potassium, and plasma renin activity; does NOT need stress dosing (aldosterone secretion does not increase with stress)"
    },
    {
      name: "IV Hydrocortisone (Emergency)",
      type: "Emergency Glucocorticoid",
      action: "Rapid-acting IV cortisol replacement for adrenal crisis; at high doses (100 mg), hydrocortisone has sufficient mineralocorticoid activity to also replace aldosterone effects, making separate fludrocortisone unnecessary during acute crisis management",
      sideEffects: "At emergency doses: hyperglycemia, fluid retention, hypertension (desired effect in crisis), insomnia, mood changes; GI upset",
      contra: "None in a true adrenal crisis - treatment is lifesaving and must not be delayed for any reason",
      pearl: "In suspected adrenal crisis: give 100 mg IV hydrocortisone IMMEDIATELY - do NOT wait for confirmatory lab results; at 100 mg dose, hydrocortisone provides adequate mineralocorticoid effect so fludrocortisone is not needed acutely; concurrent aggressive IV normal saline (not dextrose alone) for volume expansion; draw blood for cortisol and ACTH before treatment if possible, but NEVER delay treatment for labs"
    }
  ],
  pearls: [
    "Adrenal crisis can be fatal within hours if untreated - when suspected, administer IV hydrocortisone 100 mg IMMEDIATELY; never delay treatment to wait for confirmatory lab results",
    "Hyperpigmentation (skin creases, buccal mucosa, scars) distinguishes PRIMARY from secondary adrenal insufficiency - it occurs only in primary disease where elevated ACTH co-stimulates melanocytes",
    "Sick day rules are LIFE-SAVING education: double or triple glucocorticoid dose during fever, vomiting, injury, or surgery; inability to take oral medications requires IM injection or emergency department visit for IV hydrocortisone",
    "Fludrocortisone is needed ONLY in primary adrenal insufficiency - secondary insufficiency (pituitary ACTH deficiency) preserves aldosterone because it is regulated by the renin-angiotensin system, not ACTH",
    "Salt craving is a characteristic symptom of primary adrenal insufficiency reflecting sodium wasting from aldosterone deficiency - patients may report unusual desire for salty foods",
    "Medical alert identification and emergency injection kit are non-negotiable - every patient with adrenal insufficiency must have both at all times",
    "The most common precipitant of adrenal crisis is failure to increase glucocorticoid dose during illness - education and re-education on sick day rules at every visit is essential",
    "Never abruptly stop chronic glucocorticoid therapy (even when prescribed for non-adrenal conditions) - HPA axis suppression occurs after as little as 2-3 weeks of daily use, and abrupt cessation causes secondary adrenal crisis"
  ],
  quiz: [
    {
      question: "A patient with known Addison disease presents with vomiting, severe hypotension (BP 72/40), and confusion. Temperature is 38.8 C. What is the priority intervention?",
      options: [
        "Draw blood for cortisol and ACTH levels before starting any treatment",
        "Administer oral hydrocortisone 20 mg and encourage oral fluids",
        "Administer IV hydrocortisone 100 mg stat and begin aggressive IV normal saline resuscitation",
        "Start vasopressor therapy and obtain CT abdomen to rule out acute abdomen"
      ],
      correct: 2,
      rationale: "This presentation is adrenal crisis - a life-threatening emergency. IV hydrocortisone 100 mg must be given immediately along with aggressive IV normal saline. Oral medication is inappropriate in a vomiting patient. While labs are helpful, treatment must NEVER be delayed for results. Vasopressors alone will not resolve the crisis without cortisol replacement, as cortisol is needed for vascular responsiveness to catecholamines."
    },
    {
      question: "A patient with Addison disease calls the clinic reporting a temperature of 38.5 C and mild gastroenteritis. They are able to keep fluids down. What should the nurse advise?",
      options: [
        "Continue the regular hydrocortisone dose and monitor symptoms",
        "Stop all medications until the illness resolves to avoid drug interactions",
        "Double or triple the hydrocortisone dose and seek emergency care if unable to keep oral medications down",
        "Take an extra dose of fludrocortisone instead of hydrocortisone"
      ],
      correct: 2,
      rationale: "Sick day rules for adrenal insufficiency require doubling or tripling the glucocorticoid dose during physiologic stress such as febrile illness. The patient should also be instructed to seek emergency care if they cannot tolerate oral medications (persistent vomiting) as they will need parenteral hydrocortisone. Fludrocortisone does not need stress dosing. Never stop glucocorticoid replacement."
    },
    {
      question: "Which clinical finding is present in Addison disease (primary adrenal insufficiency) but NOT in secondary adrenal insufficiency?",
      options: [
        "Fatigue and weakness",
        "Hypoglycemia during fasting",
        "Hyperpigmentation of skin creases and buccal mucosa",
        "Orthostatic hypotension"
      ],
      correct: 2,
      rationale: "Hyperpigmentation occurs only in primary adrenal insufficiency because the low cortisol removes negative feedback, causing markedly elevated ACTH (from POMC, which also produces MSH). In secondary insufficiency, ACTH is low (the pituitary is the problem), so MSH is not elevated and hyperpigmentation does not occur. Fatigue, hypoglycemia, and orthostatic hypotension can occur in both types."
    }
  ]
},

"cushings-syndrome-basics-rpn": {
  title: "Cushing Syndrome",
  cellular: {
    title: "Pathophysiology of Cushing Syndrome",
    content: "Cushing syndrome is the clinical condition resulting from prolonged exposure to excessive glucocorticoids, either from endogenous overproduction or exogenous administration. It is important to distinguish Cushing syndrome (the clinical state from any cause) from Cushing disease (specifically caused by an ACTH-secreting pituitary adenoma, accounting for 70% of endogenous cases).\n\nThe most common cause of Cushing syndrome is iatrogenic - prolonged administration of exogenous glucocorticoids (prednisone, dexamethasone, hydrocortisone) for conditions such as autoimmune diseases, asthma, organ transplant rejection, and inflammatory conditions. Even inhaled and topical steroids at high doses can cause cushingoid features.\n\nEndogenous causes are categorised as ACTH-dependent or ACTH-independent. ACTH-dependent causes (80% of endogenous cases) include Cushing disease (pituitary corticotroph adenoma secreting excess ACTH, 70%) and ectopic ACTH syndrome (ACTH secretion from non-pituitary tumours - small cell lung cancer, bronchial carcinoids, pancreatic neuroendocrine tumours, 10%). ACTH-independent causes (20%) include adrenal adenoma, adrenal carcinoma, and bilateral adrenal hyperplasia.\n\nExcessive cortisol produces widespread metabolic and physiologic effects. Glucocorticoid excess promotes hepatic gluconeogenesis and insulin resistance, causing hyperglycemia and potential steroid-induced diabetes. It enhances lipogenesis in central and facial fat deposits while promoting lipolysis in the extremities, creating the characteristic central obesity, moon facies, and buffalo hump (dorsocervical fat pad) with thin extremities.\n\nProtein catabolism causes proximal muscle wasting (difficulty rising from a chair, climbing stairs), skin thinning with easy bruising, poor wound healing, and wide purple striae (distinct from the narrow white-pink striae of pregnancy or growth). The purple colour results from the thin dermis allowing visualisation of the underlying red-blue vasculature. Bone protein matrix breakdown leads to osteoporosis with pathologic fractures and avascular necrosis.\n\nCortisol's mineralocorticoid activity at high levels promotes sodium and water retention (hypertension, edema) and potassium excretion (hypokalemia). The hypertension of Cushing syndrome is a major cause of morbidity and mortality. Immunosuppression from cortisol's anti-inflammatory effects increases susceptibility to infections, which may present atypically due to blunted inflammatory responses.\n\nNeuropsychiatric effects include emotional lability, depression, anxiety, insomnia, cognitive impairment, and occasionally psychosis. These effects can be the presenting complaint and may be mistaken for primary psychiatric disorders."
  },
  riskFactors: [
    "Chronic exogenous glucocorticoid therapy (most common cause overall; prednisone greater than 7.5 mg/day equivalent for more than 3 weeks begins to cause cushingoid features)",
    "Pituitary adenoma (microadenoma usually; Cushing disease is more common in women aged 20-50)",
    "Adrenal tumours: adenoma (benign, more common) or carcinoma (malignant, aggressive)",
    "Ectopic ACTH-secreting tumours: small cell lung cancer (most common malignant cause), bronchial carcinoids",
    "Female sex (Cushing disease has 3:1 female-to-male predominance)",
    "Alcoholism (pseudo-Cushing syndrome - chronic alcohol excess activates HPA axis, producing clinical features that resolve with abstinence)"
  ],
  diagnostics: [
    "24-hour urinary free cortisol: elevated (greater than 3-4 times the upper limit of normal is virtually diagnostic); requires complete 24-hour urine collection",
    "Late-night salivary cortisol: elevated (loss of normal diurnal cortisol rhythm; normally cortisol is lowest at midnight); two elevated samples are confirmatory",
    "Low-dose dexamethasone suppression test (1 mg overnight): take 1 mg dexamethasone at 11 PM, measure cortisol at 8 AM; failure to suppress cortisol below 50 nmol/L (1.8 mcg/dL) suggests Cushing syndrome",
    "Plasma ACTH level: distinguishes ACTH-dependent from ACTH-independent causes; elevated in pituitary or ectopic ACTH sources; suppressed in adrenal tumours",
    "High-dose dexamethasone suppression test: distinguishes pituitary from ectopic ACTH sources; pituitary adenomas usually suppress (partially), ectopic sources do not",
    "MRI pituitary with gadolinium: localises pituitary adenoma (often <10 mm microadenoma)",
    "CT adrenal glands: identifies adrenal adenoma or carcinoma in ACTH-independent disease",
    "CT chest/abdomen: localises ectopic ACTH-secreting tumours",
    "Metabolic assessment: fasting glucose/HbA1c (steroid diabetes), lipid panel, DEXA scan (osteoporosis), electrolytes (hypokalemia)"
  ],
  management: [
    "Iatrogenic Cushing syndrome: gradual taper of exogenous glucocorticoids (NEVER abrupt discontinuation - risk of adrenal crisis); use lowest effective dose; consider steroid-sparing agents for the underlying condition",
    "Cushing disease (pituitary adenoma): transsphenoidal pituitary surgery is first-line with 70-90% remission rate for microadenomas; post-operative monitoring for adrenal insufficiency (suppressed adrenals may take months to recover)",
    "Adrenal tumours: unilateral adrenalectomy for adenoma; radical surgery plus adjuvant mitotane chemotherapy for adrenal carcinoma",
    "Ectopic ACTH syndrome: treat the underlying tumour if possible; if unresectable, medical adrenal blockade (ketoconazole, metyrapone, osilodrostat) or bilateral adrenalectomy",
    "Medical therapy for cortisol reduction (when surgery not feasible): ketoconazole (inhibits steroidogenesis), metyrapone, osilodrostat, pasireotide (somatostatin analogue for pituitary tumours)",
    "Management of complications: treat hypertension, diabetes, osteoporosis, hypokalemia; DVT prophylaxis (hypercortisolism is a hypercoagulable state)"
  ],
  nursingActions: [
    "Assess for cushingoid features: central obesity with thin extremities, moon facies, buffalo hump, wide purple striae, easy bruising, skin thinning, facial plethora, hirsutism in women, acne",
    "Monitor blood glucose regularly: cortisol excess causes insulin resistance and hyperglycemia; some patients develop steroid-induced diabetes requiring insulin",
    "Monitor blood pressure: hypertension from mineralocorticoid effects of cortisol; administer antihypertensives as prescribed",
    "Assess for signs of infection: cortisol suppresses immune function and inflammatory responses; infections may present with minimal signs (fever may be blunted, WBC less elevated than expected); report any subtle signs of infection",
    "Fall prevention and skin integrity: osteoporosis increases fracture risk; skin is thin and fragile with poor wound healing; avoid adhesive tape on skin, use gentle handling, pad bony prominences",
    "Monitor electrolytes: potassium (hypokalemia - watch for cardiac arrhythmias, muscle weakness), sodium (hypernatremia), calcium (bone loss)",
    "Assess mood and mental health: depression, anxiety, insomnia, and emotional lability are common; provide supportive environment and refer to mental health services as needed",
    "Post-operative care after transsphenoidal surgery: monitor for diabetes insipidus (large urine volumes, high serum sodium - damaged posterior pituitary), CSF rhinorrhea (clear nasal drainage - test for glucose/beta-2-transferrin), adrenal insufficiency (may need stress-dose steroids)",
    "During steroid taper: educate on gradual dose reduction, signs of adrenal insufficiency (fatigue, weakness, hypotension, nausea), and need for stress dosing during illness until adrenal recovery"
  ],
  assessmentFindings: [
    "Central (truncal) obesity with thin extremities, moon facies (round, plethoric face), and dorsocervical fat pad (buffalo hump)",
    "Wide purple striae (>1 cm) on abdomen, breasts, thighs, and upper arms - distinct from narrow stretch marks",
    "Easy bruising, thin fragile skin, poor wound healing",
    "Hirsutism (excess body/facial hair in women) and acne from adrenal androgen excess",
    "Proximal muscle weakness (difficulty rising from chair, climbing stairs)",
    "Hypertension (present in 80% of patients)",
    "Hyperglycemia or overt diabetes mellitus",
    "Emotional lability, depression, insomnia, cognitive changes",
    "Osteoporosis with pathologic fractures (especially vertebral compression fractures)"
  ],
  signs: {
    left: [
      "Moon facies and central obesity with thin extremities",
      "Wide purple striae on trunk",
      "Easy bruising and thin skin",
      "Proximal muscle weakness",
      "Hypertension and hyperglycemia"
    ],
    right: [
      "Pathologic fractures (osteoporosis - vertebral compression)",
      "Opportunistic infections (immunosuppression)",
      "Deep vein thrombosis or pulmonary embolism (hypercoagulable state)",
      "Steroid psychosis (severe mood disturbance, hallucinations)",
      "Hypokalemia with cardiac arrhythmias (especially ectopic ACTH syndrome)"
    ]
  },
  medications: [
    {
      name: "Ketoconazole (for Cushing syndrome)",
      type: "Steroidogenesis Inhibitor / Antifungal",
      action: "Inhibits multiple cytochrome P450 enzymes involved in adrenal and gonadal steroidogenesis, most importantly 11-beta-hydroxylase and 17-alpha-hydroxylase, reducing cortisol production; used off-label for cortisol reduction in Cushing syndrome when surgery is not feasible",
      sideEffects: "Hepatotoxicity (most significant - monitor liver function tests every 2-4 weeks initially), nausea, GI upset, gynecomastia in men (inhibits testosterone synthesis), adrenal insufficiency (over-suppression), QT prolongation",
      contra: "Pre-existing liver disease, concurrent medications metabolised by CYP3A4 (numerous drug interactions), QT-prolonging drugs",
      pearl: "Monitor liver function tests closely - hepatotoxicity can be severe and potentially fatal; dose titrated based on serum cortisol levels or 24-hour urinary free cortisol; concurrent monitoring for adrenal insufficiency (can over-suppress cortisol); not first-line - used when surgery is not possible or as a bridge"
    },
    {
      name: "Spironolactone",
      type: "Potassium-Sparing Diuretic / Mineralocorticoid Antagonist",
      action: "Blocks aldosterone and cortisol at the mineralocorticoid receptor in renal collecting tubules; promotes sodium excretion and potassium retention; also has anti-androgenic effects helpful for hirsutism in Cushing syndrome",
      sideEffects: "Hyperkalemia (most important - monitor potassium), gynecomastia and breast tenderness in men, menstrual irregularities in women, GI upset, dizziness",
      contra: "Hyperkalemia (K+ >5.0), severe renal impairment, Addison disease, concurrent potassium supplements or other potassium-sparing drugs",
      pearl: "Used adjunctively in Cushing syndrome for dual benefit: corrects hypokalemia from cortisol's mineralocorticoid effects and reduces hirsutism/acne through androgen receptor blockade; monitor potassium closely especially if also on ACE inhibitor/ARB; avoid potassium supplements and potassium-rich foods"
    },
    {
      name: "Metyrapone",
      type: "Steroidogenesis Inhibitor",
      action: "Inhibits 11-beta-hydroxylase, the enzyme catalysing the final step of cortisol synthesis (conversion of 11-deoxycortisol to cortisol), rapidly reducing cortisol production",
      sideEffects: "Nausea, vomiting, abdominal pain, dizziness, adrenal insufficiency (over-suppression), hirsutism and acne (accumulation of androgenic precursors proximal to the enzymatic block), hypertension (accumulation of mineralocorticoid precursors), hypokalemia",
      contra: "Primary adrenal insufficiency, hypersensitivity; caution in hepatic impairment",
      pearl: "Rapid onset of action makes it useful for acute cortisol reduction (preoperative preparation, acute severe Cushing); unique side effects result from accumulation of steroid precursors proximal to the enzymatic block: androgen precursors cause hirsutism, and 11-deoxycorticosterone (mineralocorticoid) can worsen hypertension and hypokalemia"
    }
  ],
  pearls: [
    "The most common cause of Cushing syndrome is IATROGENIC - always ask about exogenous glucocorticoid use (oral, inhaled, topical, injected) before pursuing expensive endogenous workup",
    "Wide purple striae (>1 cm) are highly specific for Cushing syndrome - they result from skin thinning from collagen breakdown combined with rapid central weight gain; narrow white-pink striae from pregnancy or growth are NOT the same",
    "Never abruptly discontinue chronic glucocorticoid therapy - the HPA axis is suppressed and sudden withdrawal causes Addisonian crisis; taper gradually over weeks to months",
    "Cushing patients are IMMUNOCOMPROMISED - infections may present atypically with minimal fever, reduced WBC response, and blunted inflammatory signs; maintain high clinical suspicion",
    "Cushing syndrome is a hypercoagulable state with significantly increased risk of DVT and PE - DVT prophylaxis should be considered, especially perioperatively",
    "After successful transsphenoidal surgery for Cushing disease, the patient will need temporary glucocorticoid replacement because the suppressed normal corticotrophs take months to recover",
    "Moon facies + central obesity + wide purple striae + proximal muscle weakness + hyperglycemia = classic Cushing syndrome presentation",
    "Hypokalemia is more severe in ectopic ACTH syndrome (very high cortisol levels overwhelm the renal enzyme that normally inactivates cortisol, causing massive mineralocorticoid effect)"
  ],
  quiz: [
    {
      question: "A patient who has been taking prednisone 20 mg daily for 3 months asks if they can stop the medication because they feel better. What is the most important nursing response?",
      options: [
        "You can stop the prednisone since your symptoms have improved",
        "You should switch to an over-the-counter anti-inflammatory instead",
        "Prednisone must be tapered gradually under medical supervision; stopping abruptly can cause a life-threatening adrenal crisis",
        "You should take double the dose for 3 days and then stop"
      ],
      correct: 2,
      rationale: "After 3 months of daily prednisone, the HPA axis is significantly suppressed and the adrenal glands have atrophied. Abrupt discontinuation would cause secondary adrenal insufficiency (adrenal crisis) with potentially fatal hypotension, hypoglycemia, and cardiovascular collapse. The dose must be tapered gradually over weeks to months to allow the HPA axis to recover."
    },
    {
      question: "Which combination of assessment findings is most characteristic of Cushing syndrome?",
      options: [
        "Weight loss, hyperpigmentation, and hypotension",
        "Central obesity, moon facies, wide purple striae, and proximal muscle weakness",
        "Exophthalmos, heat intolerance, and weight loss",
        "Periorbital edema, cold intolerance, and constipation"
      ],
      correct: 1,
      rationale: "Central (truncal) obesity with thin extremities, moon facies, wide purple striae, and proximal muscle weakness are the classic features of cortisol excess. Weight loss with hyperpigmentation and hypotension describes Addison disease (opposite condition). Exophthalmos with heat intolerance describes Graves disease. Periorbital edema with cold intolerance describes hypothyroidism."
    },
    {
      question: "A nurse is caring for a patient with Cushing syndrome who has a small skin tear from tape removal. Which nursing consideration is most important?",
      options: [
        "Apply a standard adhesive bandage and document the injury",
        "Recognise that wound healing is significantly impaired in Cushing syndrome; use non-adhesive dressings and monitor closely for infection",
        "The skin tear is a normal occurrence that requires no special attention",
        "Apply topical hydrocortisone cream to the wound to promote healing"
      ],
      correct: 1,
      rationale: "Cushing syndrome causes thin fragile skin, poor wound healing (cortisol inhibits fibroblast activity and collagen synthesis), and immunosuppression. Even minor wounds require careful attention with non-adhesive dressings and close monitoring for infection, which may present with minimal signs due to blunted inflammatory response. Adhesive products should be avoided. Topical steroids would worsen healing."
    }
  ]
},

"graves-disease-rpn": {
  title: "Graves Disease (Hyperthyroidism)",
  cellular: {
    title: "Pathophysiology of Graves Disease",
    content: "Graves disease is an autoimmune disorder and the most common cause of hyperthyroidism, accounting for 60-80% of all cases. It is caused by thyroid-stimulating immunoglobulins (TSI) - autoantibodies that bind to and activate the TSH receptor on thyroid follicular cells, mimicking the action of TSH and stimulating unregulated thyroid hormone production. Unlike physiologic TSH stimulation, TSI is not subject to negative feedback, resulting in continuous overproduction of thyroid hormones (T3 and T4).\n\nThe pathogenesis involves a break in immune tolerance to the TSH receptor. Genetic susceptibility (HLA-DR3 association, CTLA-4 polymorphisms) combined with environmental triggers (stress, smoking, infections, postpartum period, high iodine intake) initiates the autoimmune process. TSH receptor-specific B lymphocytes produce TSI, which activates the cAMP signaling pathway in thyroid cells, stimulating iodine uptake, thyroid hormone synthesis, thyroglobulin proteolysis, and thyroid gland growth (goitre).\n\nExcess thyroid hormone produces a hypermetabolic state affecting virtually every organ system. Thyroid hormones increase basal metabolic rate, oxygen consumption, and heat production. They sensitise the cardiovascular system to catecholamines by upregulating beta-adrenergic receptors, causing tachycardia, increased cardiac output, widened pulse pressure, and predisposition to atrial fibrillation. The increased metabolic demands on the heart can precipitate high-output heart failure, particularly in elderly patients or those with pre-existing cardiac disease.\n\nNeuromuscular effects include fine tremor, hyperreflexia, anxiety, emotional lability, insomnia, and proximal muscle weakness (thyrotoxic myopathy). GI effects include increased motility causing frequent bowel movements or diarrhea. Metabolic effects include weight loss despite increased appetite, heat intolerance with diaphoresis, and glucose intolerance (increased hepatic gluconeogenesis and glucose absorption).\n\nGraves disease has unique extrathyroidal manifestations not seen in other causes of hyperthyroidism. Graves ophthalmopathy (thyroid eye disease) occurs in 25-50% of patients and results from TSH receptor-expressing fibroblasts and adipocytes in the retro-orbital tissue being targeted by the same autoimmune process. Infiltration of orbital tissues by lymphocytes and glycosaminoglycan deposition causes periorbital edema, proptosis (exophthalmos), lid lag, lid retraction, diplopia (extraocular muscle involvement), and in severe cases optic nerve compression with vision loss.\n\nGraves dermopathy (pretibial myxedema) occurs in 1-2% of patients, usually those with severe ophthalmopathy. Glycosaminoglycan deposition in the skin, typically over the anterior tibia, produces raised, indurated, non-pitting plaques with an orange-peel (peau d'orange) appearance.\n\nThyroid storm (thyrotoxic crisis) is a life-threatening exacerbation of hyperthyroidism characterised by fever (>40 C), severe tachycardia or arrhythmias, altered mental status (agitation, delirium, psychosis, coma), GI symptoms (nausea, vomiting, diarrhea, jaundice), and cardiovascular collapse. It is typically precipitated by surgery, infection, trauma, iodinated contrast, or cessation of antithyroid drugs in uncontrolled hyperthyroidism. Mortality ranges from 20-30% even with treatment."
  },
  riskFactors: [
    "Female sex (5-10 times more common in women; peak incidence in women aged 30-60)",
    "Family history of autoimmune thyroid disease (Graves or Hashimoto)",
    "Other autoimmune conditions: type 1 diabetes, rheumatoid arthritis, pernicious anemia, myasthenia gravis, celiac disease",
    "Smoking (significantly increases risk of Graves ophthalmopathy and worsens its severity)",
    "High psychological stress (may trigger onset through immune system modulation)",
    "Postpartum period (autoimmune rebound after relative immune suppression of pregnancy)",
    "Excess iodine intake (amiodarone, iodinated contrast dyes, kelp supplements) - Jod-Basedow phenomenon",
    "Genetic susceptibility: HLA-DR3, CTLA-4 gene polymorphisms"
  ],
  diagnostics: [
    "TSH level: suppressed (undetectable or very low) - the most sensitive screening test for hyperthyroidism; TSH is suppressed because excess T3/T4 inhibits pituitary TSH secretion",
    "Free T4 and free T3: elevated; T3 may be disproportionately elevated in early Graves disease; in 5% of cases, only T3 is elevated (T3 thyrotoxicosis)",
    "TSH receptor antibodies (TRAb/TSI): positive and confirmatory for Graves disease; distinguishes it from other causes of hyperthyroidism (toxic multinodular goitre, toxic adenoma)",
    "Radioactive iodine uptake (RAIU) scan: diffusely increased uptake throughout the entire gland in Graves disease (unlike focal uptake in toxic adenoma); contraindicated in pregnancy",
    "CBC: may show mild normocytic anemia and relative lymphocytosis",
    "Hepatic function: elevated alkaline phosphatase (from increased bone turnover) and occasionally elevated transaminases",
    "Orbital CT or MRI: for ophthalmopathy assessment - shows enlarged extraocular muscles and increased retro-orbital fat",
    "ECG: sinus tachycardia, atrial fibrillation (occurs in 10-15% of hyperthyroid patients, higher in elderly)"
  ],
  management: [
    "Antithyroid drugs (ATDs): methimazole (first-line) or propylthiouracil (PTU); methimazole is preferred due to once-daily dosing and lower hepatotoxicity risk; PTU is preferred in first trimester of pregnancy and thyroid storm",
    "Beta-blockers (propranolol): provide rapid symptomatic relief by blocking adrenergic symptoms (tachycardia, tremor, anxiety, palpitations, heat intolerance) while waiting for ATDs to take effect (ATDs take 4-6 weeks); propranolol also inhibits peripheral T4-to-T3 conversion",
    "Radioactive iodine (RAI) therapy: definitive treatment that destroys thyroid tissue; results in hypothyroidism requiring lifelong levothyroxine replacement; contraindicated in pregnancy, breastfeeding, and moderate-severe active ophthalmopathy (can worsen eye disease)",
    "Thyroidectomy: surgical option for large goitres, suspicious nodules, severe ophthalmopathy, medication intolerance, or patient preference; near-total or total thyroidectomy; risks include hypoparathyroidism and recurrent laryngeal nerve injury",
    "Ophthalmopathy management: smoking cessation (critical), selenium supplementation, artificial tears, prism glasses for diplopia, glucocorticoids for moderate-severe disease, orbital decompression surgery for severe/sight-threatening cases",
    "Thyroid storm management: beta-blocker (propranolol IV), antithyroid drug (PTU preferred - also blocks peripheral T4-to-T3 conversion), iodine solution (Lugol or SSKI - given 1 hour AFTER ATD to block hormone release), glucocorticoid (hydrocortisone - blocks peripheral conversion and treats relative adrenal insufficiency), cooling measures, ICU monitoring"
  ],
  nursingActions: [
    "Assess vital signs: tachycardia (resting HR often >100), widened pulse pressure, atrial fibrillation, elevated temperature (heat intolerance)",
    "Monitor weight: weigh regularly as unintentional weight loss despite increased appetite is hallmark; high-calorie diet to meet increased metabolic demands",
    "Provide a cool, calm environment: patients are heat intolerant and agitated; maintain comfortable room temperature, provide lightweight clothing and linens, limit visitors if overstimulated",
    "Administer antithyroid medications and beta-blockers as prescribed; educate that ATDs take 4-6 weeks for full effect while beta-blockers provide immediate symptom relief",
    "Monitor for agranulocytosis (rare but serious ATD side effect): sore throat, fever, and mouth ulcers require IMMEDIATE reporting and CBC - discontinue ATD if WBC/ANC critically low",
    "Eye care for ophthalmopathy: artificial tears during the day, lubricating ointment at night, sleep with head elevated, sunglasses outdoors, tape eyelids closed at night if unable to fully close (prevents corneal ulceration)",
    "Fall prevention and safety: fine tremor, muscle weakness, tachycardia, and anxiety increase fall risk; restlessness and impaired concentration may affect safety",
    "Monitor for thyroid storm: fever >40 C, extreme tachycardia (>140), altered mental status, profound agitation or obtundation - this is a medical emergency requiring ICU-level care",
    "Pre-thyroidectomy care: ensure euthyroid state before surgery with ATDs; voice assessment pre-operatively (baseline for recurrent laryngeal nerve comparison); teach post-operative calcium monitoring importance"
  ],
  assessmentFindings: [
    "Tachycardia (often >100 bpm at rest), palpitations, and widened pulse pressure; atrial fibrillation in 10-15%",
    "Diffuse symmetrical goitre (often with audible bruit due to increased vascularity)",
    "Fine resting tremor of outstretched hands",
    "Exophthalmos (protruding eyes), lid lag, lid retraction, periorbital edema (Graves ophthalmopathy)",
    "Weight loss despite increased appetite and food intake",
    "Heat intolerance with excessive sweating, warm moist skin",
    "Emotional lability, anxiety, irritability, insomnia, difficulty concentrating",
    "Hyperactive deep tendon reflexes (hyperreflexia)",
    "Frequent bowel movements or diarrhea (increased GI motility)"
  ],
  signs: {
    left: [
      "Tachycardia and widened pulse pressure",
      "Diffuse goitre with bruit",
      "Exophthalmos and lid lag",
      "Fine tremor and hyperreflexia",
      "Weight loss with increased appetite"
    ],
    right: [
      "Atrial fibrillation (risk of stroke)",
      "Thyroid storm (fever >40 C, severe tachycardia, altered mental status - emergency)",
      "Heart failure (high-output, especially in elderly)",
      "Corneal ulceration from inability to close eyelids",
      "Pretibial myxedema (orange-peel skin over shins)"
    ]
  },
  medications: [
    {
      name: "Methimazole (Tapazole)",
      type: "Thionamide Antithyroid Drug",
      action: "Inhibits thyroid peroxidase (TPO), the enzyme that catalyses iodine organification and coupling reactions essential for T3 and T4 synthesis; reduces thyroid hormone production without destroying the gland",
      sideEffects: "Rash (most common), GI upset, arthralgia, taste alteration; rare but serious: agranulocytosis (0.2-0.5% - potentially fatal), hepatotoxicity (cholestatic pattern), ANCA-positive vasculitis",
      contra: "First trimester of pregnancy (associated with aplasia cutis and choanal atresia - use PTU instead); known hypersensitivity; breastfeeding at high doses",
      pearl: "First-line ATD for non-pregnant adults due to once-daily dosing and lower hepatotoxicity risk than PTU; takes 4-6 weeks for full effect because it blocks NEW hormone synthesis but existing stored hormone must be depleted; CRITICAL patient education: report sore throat, fever, or mouth ulcers immediately as these may indicate agranulocytosis requiring urgent CBC"
    },
    {
      name: "Propranolol",
      type: "Non-Selective Beta-Adrenergic Blocker",
      action: "Blocks beta-1 and beta-2 adrenergic receptors, reducing heart rate, blood pressure, and catecholamine-driven symptoms (tremor, anxiety, palpitations); uniquely also inhibits peripheral conversion of T4 to the more active T3",
      sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm (beta-2 blockade), cold extremities, masking of hypoglycemia symptoms in diabetics, depression, sexual dysfunction",
      contra: "Asthma or reactive airway disease (beta-2 blockade causes bronchospasm - use cardioselective beta-blocker like atenolol instead), severe bradycardia, heart block, decompensated heart failure, concurrent calcium channel blocker (verapamil/diltiazem)",
      pearl: "Provides IMMEDIATE symptom relief while waiting for ATDs to work (4-6 weeks); the dual action (beta-blockade + T4-to-T3 conversion inhibition) makes propranolol specifically preferred over other beta-blockers in thyrotoxicosis; in thyroid storm, IV propranolol is used for rapid rate control; avoid in asthmatics - use atenolol (cardioselective) as alternative"
    },
    {
      name: "Propylthiouracil (PTU)",
      type: "Thionamide Antithyroid Drug",
      action: "Inhibits thyroid peroxidase (same mechanism as methimazole) AND additionally blocks peripheral conversion of T4 to T3 (5-deiodinase inhibition); the dual mechanism makes PTU preferred in thyroid storm",
      sideEffects: "Rash, GI upset, arthralgia; rare but serious: hepatotoxicity (hepatocellular pattern - potentially fulminant liver failure, FDA black box warning), agranulocytosis, ANCA-positive vasculitis",
      contra: "Known hepatotoxicity from PTU; third trimester of pregnancy (methimazole is safer after first trimester)",
      pearl: "Reserved for two specific situations: (1) first trimester of pregnancy (methimazole is teratogenic in first trimester) and (2) thyroid storm (dual mechanism provides faster hormone level reduction); FDA black box warning for severe hepatotoxicity including fatal liver failure - not first-line for routine hyperthyroidism; requires multiple daily doses (every 8 hours) vs once-daily methimazole"
    }
  ],
  pearls: [
    "Agranulocytosis from ATDs is rare but potentially FATAL - educate every patient to report sore throat, fever, or mouth ulcers immediately and seek urgent CBC before taking the next dose",
    "Methimazole is first-line EXCEPT in first trimester of pregnancy (use PTU) and thyroid storm (use PTU for its additional T4-to-T3 conversion blockade)",
    "Beta-blockers provide immediate symptom relief; ATDs take 4-6 weeks - this gap must be bridged with beta-blocker therapy",
    "Smoking significantly worsens Graves ophthalmopathy and reduces response to treatment - smoking cessation is a critical intervention",
    "Thyroid storm: temperature >40 C + extreme tachycardia + altered mental status = medical emergency with 20-30% mortality; requires ICU, IV beta-blocker, PTU, iodine (1 hour AFTER ATD), and glucocorticoid",
    "In thyroid storm treatment, iodine must be given at least 1 HOUR after the antithyroid drug - giving iodine first would provide substrate for more hormone production (Jod-Basedow effect)",
    "New-onset atrial fibrillation in a patient under 65 should prompt thyroid function testing - hyperthyroidism is a common and treatable cause",
    "Post-radioactive iodine therapy: most patients develop hypothyroidism within 6-12 months and require lifelong levothyroxine; this is an expected outcome, not a complication"
  ],
  quiz: [
    {
      question: "A patient taking methimazole calls the clinic reporting a sore throat and fever of 38.9 C for the past 24 hours. What is the priority nursing action?",
      options: [
        "Advise the patient to take over-the-counter cold medication and rest",
        "Instruct the patient to hold the methimazole and seek immediate medical evaluation for an urgent CBC to rule out agranulocytosis",
        "Reassure the patient that sore throat is a common minor side effect and to continue the medication",
        "Advise the patient to double the methimazole dose to reduce thyroid hormone levels more quickly"
      ],
      correct: 1,
      rationale: "Sore throat and fever in a patient on antithyroid drugs (methimazole or PTU) may indicate agranulocytosis - a rare but potentially fatal complication where granulocytes (neutrophils) drop to critically low levels, leaving the patient unable to fight infection. The medication must be held and an urgent CBC obtained. If the absolute neutrophil count is critically low, the patient needs emergent care with broad-spectrum antibiotics."
    },
    {
      question: "A patient with newly diagnosed Graves disease asks why they need propranolol in addition to methimazole. What is the best explanation?",
      options: [
        "Propranolol treats the underlying autoimmune cause while methimazole treats symptoms",
        "Propranolol provides immediate relief of symptoms like rapid heart rate and tremor, while methimazole takes 4-6 weeks to reduce thyroid hormone levels",
        "Propranolol prevents thyroid storm while methimazole prevents cancer",
        "Both medications work the same way but are more effective together"
      ],
      correct: 1,
      rationale: "Methimazole blocks NEW thyroid hormone production but does not affect already-stored hormones. It takes 4-6 weeks for existing hormone stores to be depleted. Propranolol provides immediate symptomatic relief by blocking beta-adrenergic effects (tachycardia, tremor, anxiety, palpitations) and also inhibits peripheral T4-to-T3 conversion. The two medications complement each other: propranolol bridges the gap until methimazole achieves therapeutic effect."
    },
    {
      question: "Which patient with hyperthyroidism requires propylthiouracil (PTU) instead of methimazole?",
      options: [
        "A 45-year-old man with a large goitre",
        "A woman in the first trimester of pregnancy",
        "A patient with mild ophthalmopathy",
        "A 65-year-old with atrial fibrillation"
      ],
      correct: 1,
      rationale: "PTU is specifically indicated in the first trimester of pregnancy because methimazole is associated with teratogenic effects (aplasia cutis, choanal atresia, esophageal atresia) during this period. After the first trimester, patients are typically switched to methimazole (lower hepatotoxicity risk). PTU is also preferred in thyroid storm due to its additional ability to block peripheral T4-to-T3 conversion."
    }
  ]
},

"hashimoto-thyroiditis-rpn": {
  title: "Hashimoto Thyroiditis (Hypothyroidism)",
  cellular: {
    title: "Pathophysiology of Hashimoto Thyroiditis",
    content: "Hashimoto thyroiditis is a chronic autoimmune inflammation of the thyroid gland and the most common cause of hypothyroidism in iodine-sufficient regions. It is characterised by lymphocytic infiltration and progressive destruction of thyroid follicular cells, leading to gradual decline in thyroid hormone production.\n\nThe autoimmune process involves both cellular and humoral immunity. CD4+ T-helper cells activate CD8+ cytotoxic T lymphocytes that directly destroy thyroid follicular cells. Simultaneously, B lymphocytes produce autoantibodies, most importantly anti-thyroid peroxidase (anti-TPO) antibodies (present in >90% of cases) and anti-thyroglobulin antibodies (present in 60-70%). While these antibodies are primarily disease markers, anti-TPO antibodies can fix complement and contribute to thyroid cell destruction. Antibody-dependent cell-mediated cytotoxicity (ADCC) via natural killer cells also contributes.\n\nGenetic susceptibility involves HLA-DR3 and HLA-DR5 associations, CTLA-4 polymorphisms, and PTPN22 gene variants. Environmental triggers include high iodine intake (iodine excess enhances thyroid cell immunogenicity), selenium deficiency, infections (molecular mimicry), pregnancy (postpartum immune rebound), and certain medications (lithium, amiodarone, interferon-alpha, immune checkpoint inhibitors).\n\nAs thyroid tissue is progressively destroyed, thyroid hormone production falls. The pituitary responds by increasing TSH secretion (negative feedback loop), which initially compensates and maintains normal T3/T4 levels - this is subclinical hypothyroidism (elevated TSH with normal free T4). Eventually, the remaining thyroid tissue cannot compensate despite maximal TSH stimulation, and overt hypothyroidism develops (elevated TSH with low free T4).\n\nThyroid hormone deficiency produces a hypometabolic state that is essentially the opposite of hyperthyroidism. Decreased basal metabolic rate causes cold intolerance, weight gain, fatigue, and bradycardia. Reduced sympathetic nervous system activity contributes to constipation, decreased sweating, and dry skin. Accumulation of glycosaminoglycans (especially hyaluronic acid) in tissues causes myxedema - a non-pitting edema affecting the face (periorbital puffiness), hands, and feet. This same process in the vocal cords and tongue causes the hoarse voice and macroglossia characteristic of hypothyroidism.\n\nCardiovascular effects include decreased cardiac output, diastolic hypertension (from increased systemic vascular resistance), pericardial effusion (from increased capillary permeability), and accelerated atherosclerosis (from hyperlipidemia - decreased LDL receptor expression and reduced cholesterol clearance). The combination of bradycardia and pericardial effusion can compromise cardiac function.\n\nMyxedema coma is the most severe, life-threatening manifestation of hypothyroidism. Despite the name, it can occur without frank coma. It is characterised by severe hypothermia (core temperature often <35 C), altered mental status (lethargy to coma), bradycardia, hypotension, hypoventilation (respiratory failure from decreased respiratory drive and respiratory muscle weakness), hyponatremia (impaired free water excretion), and hypoglycemia. It is typically precipitated by an acute event (infection, surgery, cold exposure, sedative medication) in a patient with long-standing untreated hypothyroidism. Mortality is 30-60% even with treatment."
  },
  riskFactors: [
    "Female sex (7-10 times more common in women; peak incidence 45-65 years)",
    "Family history of autoimmune thyroid disease",
    "Other autoimmune conditions: type 1 diabetes, celiac disease, pernicious anemia, vitiligo, Addison disease, rheumatoid arthritis",
    "Down syndrome and Turner syndrome (markedly increased prevalence of autoimmune thyroiditis)",
    "High iodine intake (iodine excess increases thyroid antigenicity)",
    "Medications: lithium (inhibits thyroid hormone synthesis and release), amiodarone (contains iodine and can cause both hypothyroidism and hyperthyroidism), interferon-alpha and immune checkpoint inhibitors (trigger autoimmune thyroiditis)",
    "Postpartum period (postpartum thyroiditis in 5-10% of women)",
    "Radiation exposure to the head and neck (therapeutic radiation, nuclear fallout)",
    "Age (prevalence increases with age in both sexes)"
  ],
  diagnostics: [
    "TSH: elevated (the most sensitive test for primary hypothyroidism); TSH rises before T4 falls due to the sensitivity of the negative feedback loop",
    "Free T4: low in overt hypothyroidism; normal in subclinical hypothyroidism (elevated TSH with normal FT4)",
    "Anti-TPO antibodies: positive in >90% of Hashimoto thyroiditis; confirms autoimmune etiology; the single most useful antibody test",
    "Anti-thyroglobulin antibodies: positive in 60-70%; less specific than anti-TPO",
    "Lipid panel: elevated total cholesterol, LDL, and triglycerides (thyroid hormone is needed for LDL receptor expression; hypothyroidism reduces cholesterol clearance)",
    "CBC: may show macrocytic anemia (associated pernicious anemia or folate deficiency) or normocytic anemia (decreased erythropoietin production)",
    "Thyroid ultrasound: diffusely heterogeneous, hypoechoic gland with possible pseudonodules (lymphoid aggregates); goitre may be present initially but gland often atrophies over time",
    "CK (creatine kinase): may be elevated from hypothyroid myopathy",
    "BMP: hyponatremia (impaired free water excretion from decreased GFR and excess ADH)"
  ],
  management: [
    "Levothyroxine (synthetic T4) replacement: first-line treatment; starting dose depends on patient age, weight, and cardiac status; typical full replacement: 1.6 mcg/kg/day; start low in elderly and cardiac patients (12.5-25 mcg/day) and titrate slowly",
    "TSH monitoring: recheck TSH 6-8 weeks after starting or changing dose; goal is to normalise TSH within the reference range (0.4-4.0 mIU/L, with lower half preferred for most adults)",
    "Subclinical hypothyroidism: treatment considered when TSH >10 mIU/L, or TSH 5-10 with symptoms, positive TPO antibodies, dyslipidemia, or pregnancy planning",
    "Pregnancy: levothyroxine dose typically needs to increase by 25-50% by week 4-6 of gestation; monitor TSH every 4 weeks in the first half; target TSH <2.5 in first trimester",
    "Myxedema coma management: IV levothyroxine loading dose (200-400 mcg), IV hydrocortisone (cortisol may be deficient and thyroid hormone increases cortisol metabolism), passive rewarming, supportive care (intubation for respiratory failure, vasopressors), treat precipitating cause",
    "Monitor and treat complications: lipid management, cardiac monitoring in elderly, screen for associated autoimmune conditions"
  ],
  nursingActions: [
    "Assess for hypothyroid symptoms: fatigue, cold intolerance, weight gain, constipation, dry skin, hair loss, cognitive slowing, depression, menstrual irregularities (menorrhagia)",
    "Administer levothyroxine correctly: on an empty stomach, 30-60 minutes before breakfast OR at bedtime (at least 3-4 hours after last meal); with a full glass of water; consistency in timing is important",
    "Educate about medication interactions: calcium, iron, antacids, soy, and fibre supplements reduce levothyroxine absorption - separate by at least 4 hours; certain drugs increase metabolism (phenytoin, carbamazepine, rifampin) - may require dose increase",
    "Monitor for signs of over-replacement (iatrogenic hyperthyroidism): tachycardia, palpitations, anxiety, tremor, weight loss, heat intolerance, insomnia, diarrhea; especially important in elderly with cardiac disease",
    "Assess cardiac status before and during treatment initiation, especially in elderly patients: levothyroxine increases metabolic rate and cardiac workload; start low, go slow in patients with coronary artery disease",
    "Monitor for myxedema coma (in severely hypothyroid patients): hypothermia, altered mental status, bradycardia, hypotension, hypoventilation - this is a medical emergency",
    "Educate that levothyroxine is a lifelong medication; stopping it will result in return of hypothyroid symptoms",
    "Ensure regular follow-up: TSH every 6-8 weeks during dose adjustment, then annually when stable; annual thyroid function testing",
    "Screen for related autoimmune conditions: check vitamin B12 levels (pernicious anemia), blood glucose (type 1 diabetes), celiac serology if GI symptoms"
  ],
  assessmentFindings: [
    "Fatigue, lethargy, and decreased exercise tolerance (often the earliest and most prominent complaint)",
    "Cold intolerance (thermostat turned up, wearing extra layers while others are comfortable)",
    "Weight gain despite decreased appetite (from decreased metabolic rate and fluid retention)",
    "Constipation (decreased GI motility)",
    "Dry, coarse skin and brittle nails; hair thinning and loss (including lateral third of eyebrows - Queen Anne sign)",
    "Periorbital and facial puffiness (myxedema - non-pitting), generalised non-pitting edema",
    "Hoarse voice and macroglossia (glycosaminoglycan infiltration)",
    "Bradycardia and diastolic hypertension",
    "Delayed relaxation phase of deep tendon reflexes (hung-up reflexes)",
    "Cognitive slowing: difficulty concentrating, memory impairment, depression; sometimes misdiagnosed as dementia in elderly"
  ],
  signs: {
    left: [
      "Fatigue and cold intolerance",
      "Dry coarse skin with brittle nails",
      "Periorbital puffiness (myxedema)",
      "Bradycardia",
      "Weight gain and constipation"
    ],
    right: [
      "Myxedema coma (hypothermia, altered mental status, hypoventilation - emergency)",
      "Pericardial effusion (rare, from increased capillary permeability)",
      "Severe hyponatremia (impaired free water excretion)",
      "Carpal tunnel syndrome (from myxedematous tissue compression)",
      "Severe hyperlipidemia with accelerated atherosclerosis"
    ]
  },
  medications: [
    {
      name: "Levothyroxine (Synthroid, Eltroxin)",
      type: "Synthetic Thyroid Hormone (T4)",
      action: "Synthetic form of thyroxine (T4) that is converted to the active hormone triiodothyronine (T3) by peripheral deiodinase enzymes; provides steady physiologic thyroid hormone replacement; long half-life (7 days) allows once-daily dosing and stable blood levels",
      sideEffects: "At correct replacement doses: minimal side effects; signs of over-replacement (iatrogenic hyperthyroidism): tachycardia, palpitations, angina, tremor, nervousness, insomnia, weight loss, diarrhea, heat intolerance, bone loss (osteoporosis risk with chronic over-replacement)",
      contra: "Untreated adrenal insufficiency (thyroid hormone increases cortisol metabolism; must replace cortisol FIRST or adrenal crisis may occur), acute myocardial infarction, thyrotoxicosis",
      pearl: "CRITICAL: must be taken on EMPTY STOMACH (30-60 min before breakfast or at bedtime 3-4 hours after eating) - food reduces absorption by 20-40%; separate from calcium, iron, and antacids by 4 hours; TSH takes 6-8 weeks to fully reflect a dose change - do not adjust dose sooner; brand consistency matters - switching brands may alter levels; in elderly/cardiac patients, start 12.5-25 mcg and increase by 12.5-25 mcg every 4-6 weeks"
    },
    {
      name: "IV Levothyroxine (for Myxedema Coma)",
      type: "Emergency Thyroid Hormone Replacement",
      action: "IV formulation provides rapid thyroid hormone replacement bypassing GI absorption, which is unreliable in myxedema coma due to ileus and mucosal edema; loading dose rapidly elevates circulating T4 levels",
      sideEffects: "Cardiac arrhythmias (particularly in elderly or those with coronary disease), tachycardia, angina, myocardial infarction (increased cardiac oxygen demand)",
      contra: "None in true myxedema coma - treatment is lifesaving; caution with underlying coronary artery disease (risk of myocardial ischemia as metabolic rate increases)",
      pearl: "Loading dose of 200-400 mcg IV, followed by 50-100 mcg IV daily until oral medication can be taken; MUST give IV hydrocortisone (100 mg) BEFORE or simultaneously with levothyroxine because: (1) thyroid hormone increases cortisol metabolism, potentially worsening undiagnosed co-existing adrenal insufficiency, and (2) autoimmune polyendocrine syndrome may include both hypothyroidism and adrenal insufficiency"
    }
  ],
  pearls: [
    "Levothyroxine must be taken on an EMPTY stomach, 30-60 minutes before eating - food, calcium, iron, antacids, and soy reduce absorption significantly; this is the most common cause of apparent treatment failure",
    "In elderly patients and those with coronary artery disease, start levothyroxine at LOW dose (12.5-25 mcg) and titrate slowly - rapid correction increases cardiac workload and can precipitate angina, MI, or arrhythmias",
    "Always rule out adrenal insufficiency before starting levothyroxine - thyroid hormone increases cortisol metabolism and can precipitate adrenal crisis in a patient with co-existing unrecognised adrenal insufficiency",
    "TSH is the MOST SENSITIVE test for primary hypothyroidism - it rises before free T4 falls; a normal TSH effectively rules out primary hypothyroidism",
    "Loss of the lateral third of the eyebrows (Queen Anne sign) is a classic physical finding of hypothyroidism but may not be present in all patients",
    "Hypothyroidism causes hyperlipidemia (particularly elevated LDL) - always check thyroid function before starting statin therapy in a patient with new hyperlipidemia; correcting hypothyroidism may normalise lipids",
    "In myxedema coma, give IV hydrocortisone BEFORE levothyroxine to prevent precipitating adrenal crisis",
    "Cognitive slowing and depression in hypothyroidism can mimic dementia in the elderly - TSH should be checked in any elderly patient with new cognitive complaints"
  ],
  quiz: [
    {
      question: "A patient taking levothyroxine 100 mcg daily reports taking the medication with breakfast along with their calcium supplement and multivitamin containing iron. Why might the patient's TSH remain elevated despite an adequate dose?",
      options: [
        "The levothyroxine dose is too high causing paradoxical TSH elevation",
        "Calcium, iron, and food all significantly reduce levothyroxine absorption; the medication should be taken on an empty stomach separated from these supplements by at least 4 hours",
        "Levothyroxine is ineffective when taken by mouth and should be given by injection",
        "The calcium supplement is causing thyroid damage"
      ],
      correct: 1,
      rationale: "Levothyroxine absorption is significantly reduced by food (20-40% reduction), calcium supplements, iron supplements, antacids, and soy products. These substances bind levothyroxine in the GI tract, preventing absorption. The medication must be taken on an empty stomach with water, 30-60 minutes before eating, and calcium/iron supplements should be separated by at least 4 hours. This is the most common cause of apparent treatment failure."
    },
    {
      question: "An 80-year-old patient with coronary artery disease is newly diagnosed with hypothyroidism (TSH 45 mIU/L). What starting dose of levothyroxine should the nurse anticipate?",
      options: [
        "Full replacement dose of 125 mcg daily for rapid correction",
        "Low starting dose of 12.5-25 mcg daily with gradual titration",
        "No medication until the TSH normalises on its own",
        "Liothyronine (T3) 50 mcg daily for faster effect"
      ],
      correct: 1,
      rationale: "In elderly patients and those with coronary artery disease, levothyroxine must be started at a low dose (12.5-25 mcg) and increased gradually (every 4-6 weeks). Rapid correction increases metabolic rate and cardiac workload, which can precipitate angina, myocardial infarction, or fatal arrhythmias in patients with underlying cardiac disease. The principle is 'start low, go slow.'"
    },
    {
      question: "Which laboratory finding is MOST sensitive for detecting primary hypothyroidism before symptoms develop?",
      options: [
        "Low free T3",
        "Elevated TSH",
        "Elevated cholesterol",
        "Positive anti-TPO antibodies"
      ],
      correct: 1,
      rationale: "TSH is the most sensitive marker for primary hypothyroidism. Through the negative feedback loop, TSH rises as soon as thyroid hormone production begins to decline, often while free T4 is still within the normal range (subclinical hypothyroidism). Free T3 is a late marker. Cholesterol elevation and anti-TPO antibodies support the diagnosis but are not as sensitive as TSH for detecting early hypothyroidism."
    }
  ]
},

"diabetes-insipidus-basics-rpn": {
  title: "Diabetes Insipidus",
  cellular: {
    title: "Pathophysiology of Diabetes Insipidus",
    content: "Diabetes insipidus (DI) is a disorder of water balance characterised by the excretion of abnormally large volumes of dilute urine (polyuria) and compensatory excessive thirst (polydipsia). It results from either deficient antidiuretic hormone (ADH, also called vasopressin) production or impaired renal response to ADH. Despite the name, it is entirely unrelated to diabetes mellitus - the shared word 'diabetes' simply refers to excessive urine production.\n\nNormal water balance relies on ADH secreted by the posterior pituitary gland. When plasma osmolality rises above approximately 280 mOsm/kg (or blood volume decreases), osmoreceptors in the hypothalamus stimulate ADH release. ADH acts on V2 receptors in the renal collecting duct, activating aquaporin-2 water channels that allow water reabsorption from the tubular fluid back into the hypertonic medullary interstitium. This concentrates the urine and returns plasma osmolality toward normal. Without ADH or its renal action, the collecting duct remains impermeable to water, and large volumes of dilute urine are excreted.\n\nCentral (neurogenic) diabetes insipidus results from insufficient ADH production or secretion by the hypothalamic-posterior pituitary axis. Causes include pituitary surgery (especially transsphenoidal surgery for pituitary adenoma - the most common iatrogenic cause), traumatic brain injury, brain tumours (craniopharyngioma, metastases), infiltrative diseases (sarcoidosis, histiocytosis), autoimmune hypophysitis, and infections (meningitis, encephalitis). Approximately 25-30% of cases are idiopathic (presumed autoimmune).\n\nPost-surgical DI following transsphenoidal pituitary surgery has a characteristic triphasic pattern: initial DI (days 1-5, from surgical trauma causing transient ADH deficiency), followed by inappropriate ADH release (days 5-10, from dying posterior pituitary neurons releasing stored ADH), then permanent DI if sufficient neurons were destroyed. Many post-surgical cases are transient.\n\nNephrogenic diabetes insipidus results from renal resistance to ADH action despite normal or elevated ADH levels. The collecting duct fails to respond to ADH. Causes include chronic lithium therapy (the most common acquired cause - lithium enters collecting duct cells and interferes with aquaporin-2 trafficking, affecting up to 20-40% of lithium-treated patients), hypercalcemia (calcium deposits in the medulla damage collecting duct), hypokalemia (impairs concentrating ability), tubulointerstitial diseases, and rare congenital mutations in the V2 receptor or aquaporin-2 gene.\n\nThe clinical consequences of DI depend on whether the thirst mechanism is intact and whether the patient has access to water. With intact thirst and adequate water intake, patients compensate by drinking large volumes (often 3-20 litres per day) and maintain near-normal serum sodium. However, if thirst is impaired (hypothalamic damage), the patient is obtunded, or water is restricted (hospitalised patients with IV fluids inadequate to match output), rapid and severe hypernatremia develops, causing brain cell shrinkage, altered mental status, seizures, coma, and potentially death."
  },
  riskFactors: [
    "Pituitary or hypothalamic surgery (transsphenoidal surgery is the most common cause of central DI)",
    "Traumatic brain injury, especially with basilar skull fractures affecting the pituitary stalk",
    "Brain tumours: craniopharyngioma (most common tumour cause in children), pituitary metastases, germinomas",
    "Chronic lithium therapy (most common cause of acquired nephrogenic DI; affects 20-40% of patients on lithium)",
    "Hypercalcemia from any cause (primary hyperparathyroidism, malignancy, excess vitamin D)",
    "Chronic hypokalemia (impairs renal concentrating ability)",
    "Infiltrative diseases: sarcoidosis, histiocytosis X (Langerhans cell histiocytosis), hemochromatosis",
    "Pregnancy (rare: placental vasopressinase can cause transient gestational DI by degrading endogenous ADH)"
  ],
  diagnostics: [
    "Urine output: polyuria defined as >3 litres per day in adults; in severe DI, output can reach 15-20 litres/day",
    "Urine specific gravity: very low (<1.005) and urine osmolality inappropriately dilute (<300 mOsm/kg, often <200) despite elevated or high-normal serum osmolality",
    "Serum sodium and osmolality: elevated or high-normal (>287 mOsm/kg) reflecting free water loss exceeding intake",
    "Water deprivation test: the definitive diagnostic test; fluid is withheld under close monitoring and urine osmolality measured; failure to concentrate urine (osmolality remains <300) despite rising serum osmolality confirms DI",
    "Desmopressin (DDAVP) challenge: after water deprivation confirms DI, desmopressin is administered; urine concentration (>50% increase in osmolality) = central DI (kidneys respond to exogenous ADH); no response = nephrogenic DI (kidneys cannot respond)",
    "Plasma ADH level: low in central DI despite high serum osmolality; elevated in nephrogenic DI (appropriate pituitary response but kidney resistance)",
    "MRI brain with pituitary focus: may show absent posterior pituitary bright spot (normally seen on T1 MRI from stored ADH phospholipid vesicles), pituitary stalk thickening, or mass lesion"
  ],
  management: [
    "Central DI: desmopressin (DDAVP) replacement - synthetic ADH analogue given intranasally, orally, or subcutaneously; dose titrated to control polyuria without causing water intoxication (hyponatremia from over-replacement)",
    "Nephrogenic DI: treat underlying cause (discontinue lithium if possible, correct hypercalcemia/hypokalemia); thiazide diuretics paradoxically reduce urine volume (promote proximal sodium and water reabsorption), low-sodium diet, NSAIDs (indomethacin - reduce prostaglandin-mediated antagonism of ADH)",
    "Acute management of hypernatremia: gradual correction of free water deficit using hypotonic IV fluids (D5W, 0.45% NaCl); correct no faster than 10-12 mEq/L per 24 hours to prevent cerebral edema",
    "Monitoring: strict intake and output, daily weights, serum sodium every 4-6 hours during acute management, urine specific gravity and osmolality",
    "For post-surgical transient DI: monitor closely, administer DDAVP as needed, and reassess ADH function periodically (many cases resolve within days to weeks)",
    "Ensure adequate free water access at all times for alert patients with intact thirst mechanism"
  ],
  nursingActions: [
    "Monitor strict intake and output with hourly measurements during acute management: urine output may exceed 500 mL/hour in severe DI; fluid replacement must match or exceed output",
    "Monitor serum sodium and osmolality every 4-6 hours: hypernatremia (>145 mEq/L) indicates inadequate free water replacement; target correction no faster than 10-12 mEq/L per 24 hours",
    "Assess urine specific gravity every void: very dilute urine (<1.005) with large volume output is the hallmark; increasing specific gravity suggests response to treatment",
    "Daily weights at the same time with same clothing: rapid weight loss reflects fluid losses; weight should stabilise with adequate replacement",
    "Administer desmopressin (DDAVP) as prescribed: intranasal, oral, or subcutaneous; educate on proper intranasal technique; monitor for excessive response (water retention, hyponatremia)",
    "Ensure continuous access to fluids: patients with intact thirst will drink to compensate; restricting fluids or failing to provide adequate IV fluids in obtunded patients causes dangerous hypernatremia",
    "Monitor for signs of hypernatremia: lethargy, irritability, confusion, seizures, muscle twitching, oliguria progressing to obtundation and coma; report sodium >150 mEq/L immediately",
    "Monitor for signs of desmopressin over-replacement: headache, nausea, hyponatremia (sodium <135), weight gain, decreased urine output - hold dose and report",
    "Post-pituitary surgery patients: monitor for triphasic response (initial DI, then SIADH, then possible permanent DI); urine output trending is critical"
  ],
  assessmentFindings: [
    "Polyuria: urine output >3 litres per day, often 5-20 litres; patient reports nocturia and frequent urination day and night",
    "Polydipsia: intense, unquenchable thirst with constant drinking; patients often crave ice-cold water",
    "Urine appears very dilute (colourless, like water) with low specific gravity (<1.005)",
    "Signs of dehydration if intake does not match output: dry mucous membranes, poor skin turgor, tachycardia, hypotension",
    "Hypernatremia if unable to maintain adequate fluid intake: irritability, confusion, lethargy, seizures",
    "Sleep disturbance and fatigue from nocturia (waking multiple times per night to urinate and drink)",
    "In post-surgical patients: sudden onset of large-volume dilute urine output in the hours to days following transsphenoidal pituitary surgery"
  ],
  signs: {
    left: [
      "Polyuria (>3 L/day of very dilute urine)",
      "Polydipsia (intense thirst, constant drinking)",
      "Nocturia disrupting sleep",
      "Low urine specific gravity (<1.005)",
      "Dehydration signs (dry mucous membranes, tachycardia)"
    ],
    right: [
      "Severe hypernatremia (>155 mEq/L) with altered mental status, seizures",
      "Hypovolemic shock if output greatly exceeds intake",
      "Cerebral edema if hypernatremia corrected too rapidly",
      "Desmopressin over-replacement: hyponatremia, water intoxication",
      "Circulatory collapse in obtunded patients unable to drink"
    ]
  },
  medications: [
    {
      name: "Desmopressin (DDAVP)",
      type: "Synthetic ADH Analogue",
      action: "Synthetic analogue of vasopressin (ADH) with selective V2 receptor agonist activity (minimal V1 vasopressor effect); binds V2 receptors on renal collecting duct cells, promoting insertion of aquaporin-2 water channels, enabling water reabsorption from tubular fluid",
      sideEffects: "Hyponatremia (most serious - from water retention if dose is excessive or fluid intake is unrestricted), headache, nausea, nasal congestion (intranasal form), abdominal cramps; rare: seizures from severe hyponatremia",
      contra: "Habitual polydipsia (risk of severe hyponatremia), moderate-severe renal impairment, hyponatremia, conditions predisposing to fluid overload (heart failure)",
      pearl: "Available as intranasal spray, oral tablets, and subcutaneous injection; intranasal absorption can be affected by nasal congestion, rhinitis, or URI - switch to oral or SC during these conditions; to prevent hyponatremia, teach patients to have one period of breakthrough diuresis between doses (allow urine output to increase briefly before next dose); restrict fluid intake to thirst-driven amounts only when on DDAVP"
    },
    {
      name: "Hydrochlorothiazide (HCTZ)",
      type: "Thiazide Diuretic (Paradoxical Use)",
      action: "Paradoxically reduces urine volume in nephrogenic DI by inhibiting sodium chloride reabsorption in the distal convoluted tubule; the resulting mild sodium depletion enhances proximal tubular sodium and water reabsorption, reducing the volume of filtrate delivered to the collecting duct and thus reducing urine output by 30-50%",
      sideEffects: "Hypokalemia (most common), hyponatremia, hyperuricemia (gout), hyperglycemia, hypercalcemia, dehydration, orthostatic hypotension",
      contra: "Anuria, sulfonamide allergy (cross-reactivity), severe hypokalemia, symptomatic hyperuricemia",
      pearl: "Used for NEPHROGENIC DI where desmopressin is ineffective (kidneys cannot respond to ADH); must be combined with low-sodium diet for maximal effect; supplement potassium or use with amiloride (potassium-sparing diuretic) to prevent hypokalemia; the paradox of using a diuretic to treat polyuria is a commonly tested concept"
    }
  ],
  pearls: [
    "Diabetes insipidus has NOTHING to do with diabetes mellitus - DI involves water balance (ADH), while DM involves glucose metabolism (insulin); the only shared feature is polyuria",
    "The key diagnostic distinction between central and nephrogenic DI: desmopressin administration concentrates urine in central DI (kidneys respond) but NOT in nephrogenic DI (kidneys are resistant to ADH)",
    "Lithium is the most common cause of acquired nephrogenic DI - up to 40% of patients on chronic lithium develop some degree of concentrating defect; monitor renal function and urine output in all lithium-treated patients",
    "After transsphenoidal pituitary surgery, monitor urine output hourly for 24-48 hours: sudden onset of >250-300 mL/hour of dilute urine strongly suggests central DI",
    "In hospitalised patients with DI who cannot drink, failure to match IV fluid input to urine output causes rapid, dangerous hypernatremia - this is preventable with careful monitoring",
    "Correct hypernatremia SLOWLY (no faster than 10-12 mEq/L per 24 hours) - rapid correction causes osmotic fluid shift into brain cells, producing fatal cerebral edema",
    "Desmopressin over-replacement causes the opposite problem: water retention and hyponatremia with risk of seizures - allow brief breakthrough diuresis between doses to prevent this",
    "Using a thiazide diuretic to REDUCE urine output in nephrogenic DI is a paradox frequently tested on exams - it works by promoting proximal reabsorption through mild volume depletion"
  ],
  quiz: [
    {
      question: "A patient undergoes transsphenoidal pituitary surgery. Six hours post-operatively, urine output is 450 mL/hour and the urine appears colourless. Serum sodium is 149 mEq/L. What condition does the nurse suspect?",
      options: [
        "Syndrome of inappropriate ADH secretion (SIADH)",
        "Central diabetes insipidus from surgical disruption of ADH production",
        "Normal post-operative diuresis from IV fluids",
        "Urinary tract infection causing increased output"
      ],
      correct: 1,
      rationale: "Large-volume dilute urine output (450 mL/hour, colourless) with rising serum sodium (149) shortly after transsphenoidal pituitary surgery is the classic presentation of central diabetes insipidus from surgical disruption of the posterior pituitary or pituitary stalk. ADH production is compromised, and the kidneys cannot concentrate urine. SIADH would cause the opposite (concentrated urine, low sodium). This volume greatly exceeds normal post-operative diuresis."
    },
    {
      question: "A patient with central diabetes insipidus takes desmopressin (DDAVP) intranasally. They develop a head cold with severe nasal congestion. What should the nurse advise?",
      options: [
        "Double the intranasal dose to compensate for poor absorption",
        "Contact the provider about switching to oral or subcutaneous desmopressin as nasal congestion impairs absorption",
        "Stop desmopressin until the cold resolves since it is not essential",
        "Add a nasal decongestant spray immediately before desmopressin"
      ],
      correct: 1,
      rationale: "Nasal congestion significantly impairs absorption of intranasal desmopressin, potentially causing breakthrough diabetes insipidus with dangerous polyuria and hypernatremia. The provider should be contacted about switching to oral tablets or subcutaneous injection during the illness. Doubling the dose is unpredictable and unsafe. Desmopressin is essential and should not be stopped. Decongestant sprays do not reliably restore absorption."
    },
    {
      question: "A nurse is correcting hypernatremia (sodium 162 mEq/L) in a patient with diabetes insipidus. After 12 hours of treatment, the sodium has dropped to 146 mEq/L (a decrease of 16 mEq/L). What is the appropriate concern?",
      options: [
        "The correction is too slow and the infusion rate should be increased",
        "The sodium is now within normal range and treatment can be stopped",
        "The correction rate is too rapid (exceeding 10-12 mEq/L per 24 hours) and risks cerebral edema",
        "The decrease indicates renal failure and dialysis is needed"
      ],
      correct: 2,
      rationale: "Hypernatremia should be corrected no faster than 10-12 mEq/L per 24 hours. A decrease of 16 mEq/L in 12 hours is dangerously rapid. Rapid correction causes water to shift into brain cells (which had adapted to the hyperosmolar state by producing idiogenic osmoles), producing cerebral edema, seizures, and potentially death. The infusion rate should be slowed and serum sodium monitored more frequently."
    }
  ]
}

};

let injected = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: injected ${injected}/${Object.keys(lessons).length} lessons`);
