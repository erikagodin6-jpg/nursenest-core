import type { LessonContent } from "./types";

export const npEndoContent: Record<string, LessonContent> = {
  "thyroid-storm-np": {
    title: "Thyroid Storm: NP Management",
    cellular: {
      title: "Thyroid Storm Pathophysiology",
      content: "Thyroid storm (thyrotoxic crisis) is a life-threatening exacerbation of thyrotoxicosis with multisystem decompensation. The massive excess of thyroid hormones (T3 and T4) increases beta-adrenergic receptor sensitivity and density, amplifying catecholamine effects on the heart (tachycardia, arrhythmias, high-output heart failure), vasculature (systolic hypertension, widened pulse pressure), and CNS (agitation, psychosis, seizures, coma). T3 directly increases basal metabolic rate by uncoupling oxidative phosphorylation and upregulating Na+/K+-ATPase activity in virtually all tissues, generating massive heat production (hyperthermia up to 41°C). Hepatic dysfunction occurs from direct thyroid hormone hepatotoxicity and hepatic congestion from high-output cardiac failure. The precipitant (infection, surgery, iodine load, abrupt antithyroid drug discontinuation) overwhelms already-stressed physiological compensatory mechanisms. The Burch-Wartofsky Point Scale (BWPS ≥ 45 = thyroid storm, 25-44 = impending storm) guides clinical diagnosis based on thermoregulatory dysfunction, CNS effects, GI-hepatic dysfunction, cardiovascular dysfunction, and precipitant history."
    },
    riskFactors: [
      "Untreated or inadequately treated Graves disease (most common underlying cause)",
      "Precipitant event: infection/sepsis (most common), surgery, trauma, DKA, stroke, PE, labor/delivery",
      "Iodine load: CT contrast dye, amiodarone (contains 37% iodine by weight) in a patient with underlying thyroid disease",
      "Abrupt discontinuation of antithyroid medication",
      "Radioactive iodine therapy without adequate pretreatment with antithyroid drugs",
      "Thyroid palpation or thyroid surgery in inadequately prepared patient",
      "Non-adherence to methimazole or PTU therapy",
      "Toxic multinodular goiter or toxic adenoma with precipitating event"
    ],
    diagnostics: [
      "Burch-Wartofsky Point Scale (BWPS): clinical scoring system — ≥ 45 = thyroid storm, 25-44 = impending storm; based on temperature, CNS status, GI/hepatic dysfunction, cardiovascular function, precipitant, heart failure",
      "TSH: profoundly suppressed (< 0.01 mIU/L); free T4 markedly elevated; free T3 elevated (T3 is the more metabolically active hormone)",
      "Note: absolute thyroid hormone levels do NOT differentiate thyroid storm from uncomplicated thyrotoxicosis — clinical presentation determines storm diagnosis",
      "CBC: leukocytosis (even without infection due to stress response), normocytic anemia",
      "LFTs: elevated AST, ALT, bilirubin (thyroid hormone hepatotoxicity + hepatic congestion); coagulopathy in severe cases",
      "BMP: hyperglycemia (increased gluconeogenesis, glycogenolysis), hypercalcemia (increased bone turnover), elevated BUN (dehydration)",
      "Cortisol level: relative adrenal insufficiency may coexist (increased cortisol clearance; treat empirically with hydrocortisone)",
      "ECG: sinus tachycardia (most common), atrial fibrillation (10-25%), atrial flutter, SVT; ST-T changes"
    ],
    management: [
      "Block thyroid hormone synthesis: PTU 500-1000 mg loading dose then 250 mg q4h PO/NG (preferred over methimazole in storm — PTU also blocks peripheral T4→T3 conversion)",
      "Block thyroid hormone release: SSKI (saturated potassium iodide) 5 drops q6h or Lugol solution 10 drops q8h — MUST wait ≥ 1 hour after first PTU dose (iodine given before thionamide can worsen thyrotoxicosis via Jod-Basedow effect)",
      "Block peripheral effects: propranolol 60-80 mg PO q4-6h or esmolol drip 50-200 mcg/kg/min (esmolol preferred for titratability in critically ill); propranolol also inhibits T4→T3 conversion at high doses",
      "Block T4→T3 conversion: hydrocortisone 100 mg IV q8h (also treats relative adrenal insufficiency — thyrotoxicosis increases cortisol metabolism) or dexamethasone 2 mg IV q6h",
      "Supportive care: aggressive cooling (acetaminophen, cooling blankets — avoid aspirin which displaces T4 from TBG increasing free T4), IV fluid resuscitation (insensible losses from hyperthermia and tachypnea are massive), glucose supplementation",
      "Treat precipitant: cultures and empiric broad-spectrum antibiotics if infection suspected",
      "ICU monitoring: continuous telemetry, arterial line for hemodynamic monitoring, central venous access",
      "Refractory cases: cholestyramine 4 g q6h (binds T4/T3 in enterohepatic circulation), lithium (blocks thyroid hormone release — rarely used), therapeutic plasma exchange/plasmapheresis (removes circulating T3/T4)"
    ],
    nursingActions: [
      "Continuous vital sign monitoring: HR, BP, temperature, SpO2 — tachycardia refractory to treatment or rising temperature indicates inadequate therapy",
      "Temperature management: apply cooling blankets, cold packs to axillae and groin, administer acetaminophen; AVOID aspirin (displaces T4 from thyroid-binding globulin, increasing free T4)",
      "Cardiac monitoring: continuous telemetry for AF/flutter, SVT, ST changes; rate control with beta-blockers; assess for high-output heart failure (JVD, crackles, peripheral edema)",
      "Medication timing: ensure PTU is given BEFORE iodine solution (≥ 1 hour gap — iodine before thionamide worsens thyrotoxicosis); document times precisely",
      "Fluid and electrolyte management: aggressive IV hydration (patients can lose 2-3 L/day from insensible losses); monitor I&O, electrolytes, glucose (hyperglycemia common)",
      "Neurological assessment: agitation, delirium, psychosis, seizures, coma — sedation may be needed but avoid over-sedation that masks neurological deterioration",
      "Nutritional support: dramatically increased metabolic demands (BMR increased 50-100%); high-calorie enteral nutrition when feasible; replete electrolytes and vitamins (thiamine)",
      "Medication administration: PTU can only be given orally/rectally (no IV formulation); if patient cannot take PO, use NG tube or rectal compounding"
    ],
    signs: {
      left: [
        "Uncomplicated thyrotoxicosis: sinus tachycardia < 120, anxiety, tremor, weight loss — Burch-Wartofsky < 25",
        "Impending storm (BWPS 25-44): moderate tachycardia, mild agitation, GI symptoms without hepatic dysfunction",
        "Responding to treatment: declining HR, clearing sensorium, temperature normalizing within 24-48 hours",
        "Stable hemodynamics without heart failure"
      ],
      right: [
        "Thyroid storm (BWPS ≥ 45): temperature > 40°C, HR > 140, altered mental status (agitation → coma), hepatic failure",
        "High-output heart failure with flash pulmonary edema — may require inotropic support",
        "Atrial fibrillation with rapid ventricular response refractory to beta-blockade",
        "Multiorgan failure: hepatic failure (coagulopathy, jaundice), renal failure (ATN from hypotension/dehydration), DIC"
      ]
    },
    medications: [
      {
        name: "Propylthiouracil (PTU)",
        type: "Thionamide Antithyroid Drug",
        action: "Inhibits thyroid peroxidase (TPO), blocking iodination and coupling steps in thyroid hormone synthesis; uniquely also blocks peripheral conversion of T4 to T3 by inhibiting type 1 deiodinase — dual mechanism makes PTU preferred over methimazole in thyroid storm",
        sideEffects: "Hepatotoxicity (FDA black box — fulminant hepatic failure, rare but potentially fatal), agranulocytosis (0.3% — neutrophils < 500), vasculitis (ANCA-positive), rash, arthralgias",
        contra: "Prior PTU-induced hepatotoxicity or agranulocytosis, severe hepatic impairment",
        pearl: "Loading dose 500-1000 mg PO/NG/PR then 250 mg q4h in thyroid storm. Onset of action 1-2 hours (faster than methimazole). Check baseline CBC and LFTs. Monitor ANC — if sore throat/fever, check WBC immediately (agranulocytosis). PTU is preferred ONLY for thyroid storm and first-trimester pregnancy; methimazole is preferred for routine thyrotoxicosis (lower hepatotoxicity risk). No IV formulation — must be given orally, via NG, or rectally compounded."
      },
      {
        name: "Hydrocortisone (for thyroid storm)",
        type: "Systemic Corticosteroid",
        action: "Inhibits peripheral T4→T3 conversion by type 1 deiodinase (reduces active hormone); treats relative adrenal insufficiency (thyrotoxicosis increases cortisol clearance, depleting adrenal reserve); provides anti-inflammatory and hemodynamic support",
        sideEffects: "Hyperglycemia, immunosuppression, fluid retention, GI bleeding",
        contra: "Active untreated infection (relative — benefit in thyroid storm outweighs risk)",
        pearl: "100 mg IV q8h in thyroid storm (or dexamethasone 2 mg IV q6h). The rationale is dual: (1) inhibits T4→T3 conversion (same mechanism as PTU but complementary pathway) and (2) addresses relative adrenal insufficiency that occurs because thyrotoxicosis accelerates cortisol metabolism. Even if adrenal function is normal, the stress response of thyroid storm exceeds adrenal capacity. This is the 'block everything' approach: PTU blocks synthesis, iodine blocks release, beta-blockers block effects, steroids block conversion."
      }
    ],
    pearls: [
      "The treatment order in thyroid storm matters: PTU first (block synthesis) → wait ≥ 1 hour → iodine (block release) → beta-blocker (block effects) + steroids (block conversion); giving iodine before PTU provides substrate for new hormone synthesis, worsening the storm (Jod-Basedow effect)",
      "Avoid aspirin in thyroid storm — it displaces T4 from thyroid-binding globulin (TBG), acutely increasing free T4 levels; use acetaminophen for fever management",
      "Thyroid storm mortality remains 10-30% even with treatment — it is an ICU emergency requiring the 'block everything' approach: block synthesis (PTU), block release (iodine), block peripheral effects (beta-blocker), block T4→T3 conversion (steroids + PTU), and treat the precipitant"
    ],
    quiz: [
      {
        question: "A 35-year-old woman with known Graves disease presents with temperature 40.2°C, HR 156, agitation, and jaundice. She stopped methimazole 2 weeks ago. Burch-Wartofsky score is 55. The team plans to start iodine solution immediately. What is the critical intervention the NP should ensure?",
        options: [
          "Ensure iodine solution is given immediately to block thyroid hormone release as quickly as possible",
          "Administer PTU loading dose first and wait at least 1 hour before giving iodine solution",
          "Give IV methimazole instead of PTU for faster onset of action",
          "Start aspirin 650 mg for fever control along with the iodine"
        ],
        correct: 1,
        rationale: "PTU MUST be given at least 1 hour before iodine in thyroid storm. Iodine given to an unblocked thyroid provides substrate for new hormone synthesis (Jod-Basedow effect), potentially worsening the storm. PTU blocks synthesis first, then iodine safely blocks release. There is no IV methimazole formulation. Aspirin is contraindicated in thyroid storm because it displaces T4 from TBG, increasing free T4."
      }
    ]
  },
  "adrenal-crisis-np": {
    title: "Adrenal Crisis: NP Management",
    cellular: {
      title: "Adrenal Crisis Pathophysiology",
      content: "Adrenal crisis (acute adrenal insufficiency) is a life-threatening emergency caused by inadequate cortisol production relative to physiological demand. Cortisol is essential for maintaining vascular tone (permissive effect on catecholamine sensitivity), gluconeogenesis, immune modulation, and stress response. In primary adrenal insufficiency (Addison disease), autoimmune destruction of adrenal cortex eliminates both cortisol and aldosterone production. Loss of cortisol causes vasodilation, hypoglycemia, and inability to mount a stress response; loss of aldosterone causes sodium wasting, potassium retention, and hypovolemia (renal sodium loss pulling water). In secondary adrenal insufficiency (pituitary ACTH deficiency) or tertiary (hypothalamic CRH deficiency, most commonly from chronic exogenous glucocorticoid use causing HPA axis suppression), aldosterone is preserved (regulated by RAAS, not ACTH), so hyperkalemia is less prominent. Crisis is precipitated when physiological cortisol demand exceeds production capacity: infection (most common trigger), surgery, trauma, or abrupt glucocorticoid withdrawal. The hemodynamic collapse of adrenal crisis results from loss of cortisol's permissive effect on alpha-1 adrenergic receptors — catecholamines cannot maintain SVR without cortisol."
    },
    riskFactors: [
      "Known adrenal insufficiency with inadequate stress-dose steroid coverage during illness/surgery (most common precipitant)",
      "Chronic glucocorticoid use (> 7.5 mg prednisone equivalent daily for > 3 weeks) with abrupt discontinuation or failure to stress-dose during illness",
      "Autoimmune adrenalitis (Addison disease — 80% of primary AI in developed countries; associated with other autoimmune conditions: autoimmune polyendocrine syndromes)",
      "Bilateral adrenal hemorrhage: Waterhouse-Friderichsen syndrome (meningococcal sepsis), anticoagulant therapy, heparin-induced thrombocytopenia, antiphospholipid syndrome",
      "Pituitary apoplexy or pituitary surgery (loss of ACTH)",
      "Adrenal metastases (lung, breast, melanoma — bilateral involvement needed for clinical insufficiency)",
      "Infections: tuberculosis, fungal infections (histoplasmosis, coccidioidomycosis — granulomatous adrenalitis), CMV in HIV",
      "Medications: ketoconazole, etomidate (single dose can suppress adrenal function for 24h), mitotane, checkpoint inhibitors (hypophysitis or adrenalitis)"
    ],
    diagnostics: [
      "Random cortisol level: < 3 mcg/dL in stressed patient is diagnostic of adrenal crisis; 3-15 mcg/dL is indeterminate (should be > 18-20 mcg/dL during stress); > 18 effectively excludes crisis",
      "DO NOT delay treatment to await cortisol results — clinical diagnosis and immediate treatment with hydrocortisone saves lives",
      "ACTH stimulation test (cosyntropin test): 250 mcg IV, measure cortisol at 0 and 60 minutes; cortisol < 18-20 mcg/dL at 60 minutes confirms adrenal insufficiency (can be performed AFTER starting dexamethasone which doesn't cross-react with cortisol assay)",
      "ACTH level: elevated > 100 pg/mL = primary AI (adrenal failure); low/normal = secondary/tertiary AI (pituitary/hypothalamic failure)",
      "BMP: hyponatremia (common in both primary and secondary), hyperkalemia (PRIMARY only — aldosterone deficiency), hypoglycemia, prerenal azotemia",
      "CBC: eosinophilia (loss of cortisol-mediated eosinophil suppression), lymphocytosis, anemia",
      "Adrenal antibodies (21-hydroxylase antibodies): confirm autoimmune etiology in primary AI",
      "CT adrenal glands: bilateral adrenal hemorrhage (acute), calcified adrenals (TB, prior hemorrhage), adrenal masses (metastases, lymphoma)"
    ],
    management: [
      "HYDROCORTISONE 100 mg IV bolus IMMEDIATELY — do not wait for lab results if clinical suspicion exists; then 50 mg IV q6-8h or 200 mg/24h continuous infusion",
      "If hydrocortisone unavailable: dexamethasone 4 mg IV (does not interfere with subsequent cortisol testing; lacks mineralocorticoid activity so add fludrocortisone if primary AI suspected)",
      "Aggressive IV fluid resuscitation: NS or D5NS boluses (patients are profoundly hypovolemic from sodium/water loss and vasodilation); 1-2 L NS in first hour, then 150-250 mL/hr guided by hemodynamics",
      "Correct hypoglycemia: D50 if glucose < 70 mg/dL; D10 infusion for maintenance; hydrocortisone will also raise glucose via gluconeogenesis",
      "Vasopressor support: norepinephrine if hypotension persists despite fluids and hydrocortisone; patients may be catecholamine-resistant until cortisol is replaced",
      "Treat precipitant: empiric broad-spectrum antibiotics if infection suspected (most common trigger for crisis)",
      "Taper to maintenance: once stable, reduce to hydrocortisone 50 mg q8h × 24h, then 25 mg q8h, then maintenance (15-25 mg/day in divided doses); add fludrocortisone 0.05-0.1 mg daily for primary AI",
      "Educate on stress dosing BEFORE discharge: double or triple oral dose during febrile illness; injectable hydrocortisone kit (Solu-Cortef 100 mg) for emergencies; medic alert bracelet/card"
    ],
    nursingActions: [
      "Recognize adrenal crisis: unexplained hypotension refractory to fluids and vasopressors, especially in patients on chronic steroids, with adrenal insufficiency history, or with classic triad (hypotension + hyponatremia + hypoglycemia)",
      "STAT hydrocortisone administration: 100 mg IV push — this is a time-critical intervention (mortality increases with each hour of untreated crisis); do not delay for cortisol level results",
      "Aggressive fluid resuscitation: NS boluses with close hemodynamic monitoring; I&O tracking; patients may require 3-5 L in first 24 hours",
      "Blood glucose monitoring q1h until stable, then q4h: hypoglycemia is common and recurrent until cortisol is adequately replaced; D50 bolus and D10 maintenance as needed",
      "Hemodynamic monitoring: continuous BP, consider arterial line for labile pressures; vasopressors may be needed initially but should improve rapidly once cortisol is replaced",
      "Electrolyte monitoring: sodium and potassium q4h initially; hyponatremia corrects slowly over days (do not overcorrect — risk of ODS); hyperkalemia in primary AI usually resolves with hydrocortisone and fluids",
      "Patient and family education before discharge: sick-day rules (double or triple dose during illness with fever), injectable hydrocortisone kit teaching (100 mg IM — patient or family member should be trained), medic alert bracelet/card",
      "Ensure outpatient follow-up with endocrinology is arranged before discharge; verify maintenance steroid prescription and stress-dose steroid supply"
    ],
    signs: {
      left: [
        "Chronic adrenal insufficiency on stable replacement: fatigue, maintained weight, electrolytes normal on replacement",
        "Mild illness with appropriate stress dosing implemented by patient (doubled oral steroid dose)",
        "Post-crisis recovery: improving BP, normalizing sodium, stable glucose on maintenance hydrocortisone",
        "Stable hemodynamics on maintenance therapy without orthostatic hypotension"
      ],
      right: [
        "Adrenal crisis: severe hypotension (SBP < 90) refractory to fluids, altered mental status, hypoglycemia, hyponatremia — IMMEDIATE hydrocortisone 100 mg IV",
        "Febrile illness in AI patient who has NOT stress-dosed — pre-crisis state requiring urgent intervention",
        "Bilateral adrenal hemorrhage (Waterhouse-Friderichsen): fulminant sepsis with meningococcal purpura, DIC, and refractory shock",
        "Etomidate-induced adrenal suppression in critically ill patient (even single dose suppresses cortisol for 24h)"
      ]
    },
    medications: [
      {
        name: "Hydrocortisone (Solu-Cortef)",
        type: "Glucocorticoid with Mineralocorticoid Activity",
        action: "Replaces cortisol: restores vascular tone (permissive effect on catecholamine receptors), stimulates hepatic gluconeogenesis, provides anti-inflammatory effect, restores stress response capability; at stress doses (100-300 mg/day), provides sufficient mineralocorticoid activity to replace aldosterone",
        sideEffects: "Hyperglycemia, immunosuppression, fluid retention, hypokalemia (at high doses), GI bleeding, mood changes",
        contra: "No absolute contraindications in adrenal crisis — the risk of not treating far exceeds any medication risk",
        pearl: "100 mg IV bolus then 50 mg q6-8h in crisis. At doses > 50 mg/day, hydrocortisone provides sufficient mineralocorticoid activity — separate fludrocortisone is NOT needed during acute management. Once stable and tapered to maintenance (15-25 mg/day in 2-3 divided doses), ADD fludrocortisone 0.05-0.1 mg daily for primary AI. The largest dose should be given in the morning (cortisol follows circadian rhythm). Stress dosing: 2-3x maintenance for illness; 100 mg IV for surgical stress."
      },
      {
        name: "Fludrocortisone (Florinef)",
        type: "Synthetic Mineralocorticoid",
        action: "Potent mineralocorticoid receptor agonist in renal collecting duct: promotes sodium reabsorption, potassium excretion, and water retention; replaces aldosterone deficiency in primary adrenal insufficiency",
        sideEffects: "Hypertension, hypokalemia, edema, headache, weight gain",
        contra: "Severe hypertension, heart failure (relative — fluid retention worsens CHF)",
        pearl: "0.05-0.1 mg PO daily for primary AI maintenance (not needed in secondary AI where aldosterone is preserved). Not needed during acute crisis when hydrocortisone > 50 mg/day provides adequate mineralocorticoid activity. Monitor BP (hypertension = over-replacement), electrolytes (hypokalemia = over-replacement), and PRA (plasma renin activity — should be in upper-normal range for optimal dosing). Patients on fludrocortisone should have unrestricted sodium intake."
      }
    ],
    pearls: [
      "Adrenal crisis can present as vasopressor-refractory shock — if a critically ill patient on vasopressors is not responding to fluid resuscitation, consider random cortisol level and empiric hydrocortisone 100 mg IV; cortisol is essential for catecholamine sensitivity and vascular tone",
      "NEVER abruptly stop chronic glucocorticoids (> 3 weeks of > 7.5 mg prednisone equivalent daily) — HPA axis suppression can last up to 12 months after discontinuation; taper gradually and provide stress-dose education",
      "The stress-dose steroid teaching for patients with AI is one of the most important patient education interventions in endocrinology: double or triple dose during febrile illness, injectable kit for emergencies when unable to take PO, medic alert bracelet — failure to educate contributes to preventable deaths"
    ],
    quiz: [
      {
        question: "A patient with known Addison disease on hydrocortisone 20 mg/day presents to the ED with fever 39.5°C, vomiting, BP 78/50, HR 118, Na+ 126, K+ 6.1, glucose 52. He has been unable to take his oral medications for 2 days. What is the priority intervention?",
        options: [
          "Send a random cortisol level and cosyntropin stimulation test, then decide on treatment based on results",
          "Administer hydrocortisone 100 mg IV immediately, start NS bolus, correct hypoglycemia with D50",
          "Start norepinephrine drip for refractory hypotension and add fludrocortisone 0.1 mg via NG tube",
          "Administer dexamethasone 4 mg IV and arrange urgent endocrinology consultation"
        ],
        correct: 1,
        rationale: "This is adrenal crisis in a known Addison disease patient who hasn't taken replacement steroids for 2 days during a febrile illness. The classic triad is present: hypotension + hyponatremia + hypoglycemia, with hyperkalemia confirming primary AI (aldosterone deficiency). Hydrocortisone 100 mg IV must be given IMMEDIATELY — do not wait for lab results. NS bolus addresses hypovolemia and sodium depletion. D50 corrects hypoglycemia. Vasopressors are unlikely to be effective without cortisol replacement. At stress doses, hydrocortisone provides adequate mineralocorticoid effect; separate fludrocortisone isn't needed acutely."
      }
    ]
  },
  "cushing-syndrome-np": {
    title: "Cushing Syndrome: NP Management",
    cellular: {
      title: "Cushing Syndrome Pathophysiology",
      content: "Cushing syndrome results from chronic excess glucocorticoid exposure, either exogenous (iatrogenic — most common cause overall) or endogenous (ACTH-dependent or ACTH-independent). ACTH-dependent causes (80% of endogenous): Cushing disease (pituitary corticotroph adenoma secreting excess ACTH — 70%) and ectopic ACTH syndrome (small cell lung cancer, carcinoid tumors, medullary thyroid cancer — 10%). ACTH-independent causes (20%): adrenal adenoma, adrenal carcinoma, bilateral macronodular adrenal hyperplasia. Excess cortisol causes: protein catabolism (proximal myopathy, thin skin, striae, poor wound healing), altered fat distribution (central obesity, moon facies, buffalo hump via differential adipocyte glucocorticoid receptor expression), insulin resistance (hyperglycemia, diabetes), mineralocorticoid effects (hypertension, hypokalemia — cortisol activates mineralocorticoid receptor when 11β-HSD2 is overwhelmed), immunosuppression, and bone loss (osteoporosis with vertebral fractures). The hypercortisolism also suppresses the hypothalamic-pituitary-gonadal axis causing hypogonadism, amenorrhea, and decreased libido."
    },
    riskFactors: [
      "Exogenous glucocorticoid use (most common cause overall — prednisone, dexamethasone for autoimmune disease, transplant, COPD, cancer)",
      "Pituitary adenoma (Cushing disease — most common endogenous cause; female predominance 3:1)",
      "Ectopic ACTH secretion: small cell lung carcinoma, bronchial carcinoid, thymic carcinoid, medullary thyroid cancer, pheochromocytoma",
      "Adrenal adenoma (benign; unilateral) or adrenal carcinoma (malignant; often large > 6 cm with androgen co-secretion)",
      "Bilateral macronodular adrenal hyperplasia (BMAH) — aberrant receptor expression (GIP, LH, vasopressin receptors on adrenal cells)",
      "McCune-Albright syndrome (GNAS mutation causing constitutive cortisol production)",
      "Primary pigmented nodular adrenocortical disease (PPNAD) — part of Carney complex",
      "Family history of MEN1 or Carney complex"
    ],
    diagnostics: [
      "First-line screening tests (need ≥ 2 positive for diagnosis): (1) 24-hour urine free cortisol (UFC > 3x upper normal is diagnostic), (2) Late-night salivary cortisol (× 2 nights; loss of diurnal rhythm — normally cortisol nadir at midnight), (3) Overnight 1 mg dexamethasone suppression test (cortisol > 1.8 mcg/dL at 8 AM = positive — fails to suppress)",
      "ACTH level to determine etiology: elevated/normal = ACTH-dependent (pituitary or ectopic); suppressed (< 5 pg/mL) = ACTH-independent (adrenal source)",
      "High-dose dexamethasone suppression test (8 mg overnight): Cushing disease suppresses > 50% (pituitary retains some feedback sensitivity); ectopic ACTH does NOT suppress",
      "CRH stimulation test: Cushing disease shows ACTH/cortisol rise; ectopic ACTH does not respond",
      "Pituitary MRI with gadolinium: identifies pituitary adenoma (often < 6 mm microadenoma — may be negative in 40%)",
      "CT chest/abdomen: for ectopic ACTH source (bronchial carcinoid) and adrenal pathology",
      "Bilateral inferior petrosal sinus sampling (BIPSS) with CRH stimulation: gold standard to distinguish pituitary from ectopic ACTH when imaging is inconclusive (central-to-peripheral ACTH gradient > 3:1 after CRH = pituitary source)",
      "Metabolic workup: glucose/HbA1c, lipid panel, DEXA scan (osteoporosis common), potassium (hypokalemia especially with ectopic ACTH)"
    ],
    management: [
      "Cushing disease: transsphenoidal pituitary adenomectomy (first-line; cure rate 65-90% for microadenoma); recurrence 5-20%",
      "Ectopic ACTH: surgical resection of source tumor when possible; medical therapy for unresectable/occult source",
      "Adrenal adenoma: unilateral adrenalectomy (laparoscopic); adrenal carcinoma — open adrenalectomy + mitotane ± chemotherapy",
      "Medical therapy (bridge to surgery or if not surgical candidate): ketoconazole (adrenal enzyme inhibitor 200-400 mg BID-TID), metyrapone (11β-hydroxylase inhibitor), osilodrostat (11β-hydroxylase inhibitor, FDA-approved for Cushing disease), cabergoline (D2 agonist for mild Cushing disease), pasireotide (somatostatin analog for Cushing disease), mifepristone (glucocorticoid receptor antagonist — for hyperglycemia)",
      "Post-surgical management: morning cortisol < 2 mcg/dL confirms remission; physiologic replacement needed for months until suppressed HPA axis recovers (hydrocortisone 15-20 mg/day with stress-dose education)",
      "Bilateral adrenalectomy: definitive cure for refractory cases but requires lifelong glucocorticoid + mineralocorticoid replacement; risk of Nelson syndrome (pituitary ACTH adenoma growth after adrenalectomy)",
      "Comorbidity management: diabetes (may require insulin during active Cushing), hypertension, osteoporosis treatment (bisphosphonates), psychiatric symptoms (depression common)",
      "Iatrogenic Cushing: gradual glucocorticoid taper (do NOT stop abruptly — adrenal suppression); switch to alternate-day dosing; use steroid-sparing agents when possible"
    ],
    nursingActions: [
      "Assessment of Cushingoid features: document weight, BP, glucose, skin integrity (thin skin, easy bruising, striae — violaceous striae > 1 cm are specific), proximal muscle weakness (ask patient to rise from chair without using arms), mood changes",
      "Blood glucose monitoring: hyperglycemia is common (glucocorticoid-induced insulin resistance); may require insulin therapy during active Cushing syndrome",
      "Infection prevention: cortisol excess causes immunosuppression — surgical wound infection rate is high; aseptic technique, monitor for atypical infections (fungal, PJP), consider PJP prophylaxis if severe hypercortisolism",
      "Fall and fracture prevention: osteoporosis + proximal myopathy + thin skin creates high fracture risk; assist with mobility, assess bone density, prevent skin tears",
      "Perioperative care (transsphenoidal surgery): post-op cortisol monitoring (morning cortisol drawn at 6 AM with hydrocortisone held overnight; < 2 mcg/dL confirms remission); monitor for diabetes insipidus (common post-pituitary surgery — polyuria > 250 mL/hr, low urine specific gravity, rising serum Na+); CSF leak watch (clear rhinorrhea — beta-2 transferrin test)",
      "Post-surgical adrenal insufficiency management: teach stress-dose steroid protocol (HPA axis is suppressed — may take 6-18 months to recover); gradual cortisol taper guided by morning cortisol levels",
      "Psychological support: depression, anxiety, and cognitive impairment are common in active Cushing; symptoms typically improve with cortisol normalization but may persist",
      "Wound care: poor wound healing is characteristic of Cushing — meticulous incision care, monitor for dehiscence"
    ],
    signs: {
      left: [
        "Mild Cushing with weight gain, mild hypertension, glucose intolerance — may be subclinical (incidental adrenal adenoma)",
        "Post-surgical remission: morning cortisol < 2, requiring physiologic replacement, recovering HPA axis",
        "Improving Cushingoid features over months after successful treatment (weight redistribution, skin healing, mood improvement)",
        "Medical therapy achieving cortisol normalization (UFC within normal range)"
      ],
      right: [
        "Ectopic ACTH with severe hypercortisolism: profound hypokalemia (< 3.0), severe hyperglycemia, opportunistic infections, muscle wasting — ACTH levels often > 200 pg/mL",
        "Adrenal carcinoma: large adrenal mass (> 6 cm), virilization in women (androgen co-secretion), rapid progression",
        "Post-adrenalectomy adrenal crisis from inadequate replacement or illness without stress dosing",
        "Nelson syndrome: progressive skin hyperpigmentation and expanding pituitary mass after bilateral adrenalectomy"
      ]
    },
    medications: [
      {
        name: "Ketoconazole",
        type: "Adrenal Steroidogenesis Inhibitor / Antifungal",
        action: "Inhibits multiple adrenal steroidogenesis enzymes (CYP17A1, CYP11A1, CYP11B1), reducing cortisol, aldosterone, and androgen production; most commonly used medical therapy for Cushing syndrome",
        sideEffects: "Hepatotoxicity (FDA black box — monitor LFTs), nausea, adrenal insufficiency (if over-suppressed), hypogonadism (inhibits testosterone synthesis), QT prolongation, drug interactions (potent CYP3A4 inhibitor)",
        contra: "Severe hepatic impairment, concurrent drugs with hepatotoxic potential or QT-prolonging, pregnancy (teratogenic)",
        pearl: "200-400 mg PO BID-TID; start low and titrate based on UFC or serum cortisol. Monitor LFTs weekly × 4 weeks then monthly. Target UFC in normal range or use 'block and replace' strategy (ketoconazole + physiologic hydrocortisone). Many drug interactions via CYP3A4 — review medication list carefully. Response rate 50-70% for cortisol normalization."
      },
      {
        name: "Mifepristone (Korlym)",
        type: "Glucocorticoid Receptor Antagonist",
        action: "Competitive antagonist at the glucocorticoid receptor (and progesterone receptor); blocks cortisol action at target tissues without reducing cortisol production — cortisol and ACTH levels actually INCREASE on therapy (cannot monitor cortisol levels for efficacy)",
        sideEffects: "Adrenal insufficiency (monitor clinically — cannot use cortisol levels), hypokalemia (cortisol increase overwhelms 11β-HSD2 → mineralocorticoid effect), endometrial thickening, nausea, fatigue",
        contra: "Pregnancy (abortifacient — progesterone receptor antagonism), concurrent CYP3A4 substrates with narrow therapeutic index (simvastatin, cyclosporine), chronic corticosteroid use for non-Cushing indications",
        pearl: "FDA-approved for hyperglycemia secondary to endogenous Cushing syndrome (not for all Cushing). Start 300 mg daily, titrate to max 1200 mg daily. Unique mechanism: blocks cortisol at the receptor level rather than reducing production. ACTH and cortisol levels RISE during treatment — cannot use standard cortisol monitoring; follow clinical parameters (glucose, weight, BP). Risk of adrenal insufficiency — teach patients to recognize symptoms and have dexamethasone available (mifepristone has high affinity for GR, so hydrocortisone may not overcome the blockade; dexamethasone at very high doses is used for rescue)."
      }
    ],
    pearls: [
      "Violaceous striae > 1 cm wide (especially on abdomen, axillae, thighs) are highly specific for Cushing syndrome — thin striae from weight gain are non-specific, but wide purple striae indicate protein catabolism from cortisol excess; proximal myopathy (inability to rise from chair without using arms) is another specific feature",
      "After successful transsphenoidal surgery for Cushing disease, the contralateral normal pituitary corticotrophs are suppressed from chronic hypercortisolism — morning cortisol < 2 mcg/dL confirms remission but the patient will need physiologic hydrocortisone replacement for 6-18 months until HPA axis recovery; stress-dose education is critical",
      "In ectopic ACTH syndrome, severe hypokalemia is characteristic because massive cortisol excess overwhelms 11β-HSD2 (the enzyme that normally inactivates cortisol before it reaches the mineralocorticoid receptor), causing cortisol to act as a potent mineralocorticoid — this pattern distinguishes ectopic ACTH from typical Cushing disease"
    ],
    quiz: [
      {
        question: "A patient with Cushing disease undergoes successful transsphenoidal pituitary adenomectomy. On post-op day 2, morning cortisol (drawn with hydrocortisone held for 24h) is 0.8 mcg/dL. The patient feels well. What does this cortisol result indicate and what is the next step?",
        options: [
          "The cortisol is critically low — administer stress-dose hydrocortisone 100 mg IV and investigate persistent adrenal pathology",
          "The low cortisol confirms surgical remission — start physiologic hydrocortisone replacement and educate on stress dosing until HPA axis recovers",
          "The test is unreliable post-operatively — repeat in 6 months",
          "The patient needs immediate repeat surgery as the adenoma was not fully resected"
        ],
        correct: 1,
        rationale: "A morning cortisol < 2 mcg/dL after transsphenoidal surgery for Cushing disease confirms biochemical remission — the remaining normal corticotrophs are suppressed from chronic hypercortisolism and cannot produce ACTH. This is the desired outcome, not a complication. The patient will need physiologic hydrocortisone replacement (15-25 mg/day) with stress-dose education until the HPA axis recovers (6-18 months). Recovery is monitored with serial morning cortisol and ACTH stimulation tests."
      }
    ]
  },
  "hyperaldosteronism-np": {
    title: "Primary Hyperaldosteronism: NP Mgmt",
    cellular: {
      title: "Hyperaldosteronism Pathophysiology",
      content: "Primary hyperaldosteronism (PA, Conn syndrome) is autonomous aldosterone production independent of the renin-angiotensin system. Aldosterone, produced by the zona glomerulosa, acts on the mineralocorticoid receptor (MR) in the renal collecting duct principal cells, upregulating ENaC (epithelial sodium channels) and ROMK (potassium channels). This causes sodium reabsorption (leading to volume expansion and hypertension) and potassium/hydrogen ion excretion (causing hypokalemia and metabolic alkalosis). The volume expansion suppresses renin via the juxtaglomerular apparatus, creating the hallmark biochemical signature: elevated aldosterone with suppressed renin (elevated aldosterone-to-renin ratio). PA accounts for 5-13% of hypertension cases and is the most common cause of secondary hypertension. Importantly, aldosterone causes cardiovascular damage BEYOND its hemodynamic effects: MR activation in cardiac and vascular tissue promotes fibrosis, inflammation, endothelial dysfunction, and oxidative stress, leading to LVH, atrial fibrillation, stroke, and MI at rates exceeding those of matched essential hypertension."
    },
    riskFactors: [
      "Resistant hypertension (3+ antihypertensives at optimal doses including diuretic — PA prevalence 17-23%)",
      "Hypertension with spontaneous or diuretic-induced hypokalemia",
      "Hypertension with adrenal incidentaloma",
      "Family history of early-onset hypertension or cerebrovascular accident at young age (familial hyperaldosteronism subtypes)",
      "Hypertension onset < 40 years",
      "Sleep apnea (associated with elevated aldosterone)",
      "Bilateral adrenal hyperplasia (most common PA subtype — 60-70%)",
      "Aldosterone-producing adenoma (Conn adenoma — 30-40%)"
    ],
    diagnostics: [
      "Screening: morning aldosterone-to-renin ratio (ARR) — aldosterone ≥ 15 ng/dL with ARR ≥ 30 (ng/dL per ng/mL/hr) is positive screen; must be done with K+ corrected to > 4.0 mEq/L and certain medications held (spironolactone/eplerenone for 6 weeks, diuretics for 4 weeks; ACEi/ARB can be continued for screening)",
      "Confirmatory testing: oral sodium loading test (3 days high salt diet → 24h urine aldosterone > 12 mcg/day), IV saline suppression test (2L NS over 4h → aldosterone > 10 ng/dL), or fludrocortisone suppression test",
      "Subtype differentiation: CT adrenal glands (identify adenoma vs. bilateral hyperplasia — but CT alone is insufficient for lateralization)",
      "Adrenal vein sampling (AVS): GOLD STANDARD for lateralization — measures aldosterone/cortisol ratio from each adrenal vein; lateralization ratio > 4:1 indicates unilateral source (surgical candidate); essential before adrenalectomy in patients > 35",
      "Serum potassium: hypokalemia in only ~30% of PA (normokalemic PA is more common than previously recognized)",
      "Metabolic panel: metabolic alkalosis from H+ excretion",
      "ECG: LVH, U waves (hypokalemia), atrial fibrillation",
      "Genetic testing: consider in patients < 20 years or family history (GRA/familial hyperaldosteronism type I — responds to glucocorticoids)"
    ],
    management: [
      "Unilateral aldosterone-producing adenoma: laparoscopic adrenalectomy (cure rate 30-60% for HTN; biochemical cure ~95%); preoperative treatment with spironolactone 4-6 weeks to normalize potassium and assess BP response",
      "Bilateral adrenal hyperplasia (idiopathic hyperaldosteronism): medical management with mineralocorticoid receptor antagonists (MRA) — spironolactone 25-100 mg daily (first-line) or eplerenone 25-50 mg BID (fewer anti-androgenic side effects)",
      "Target BP < 130/80 mmHg; add additional antihypertensives as needed (ACEi/ARB preferred as second-line — also suppress RAAS)",
      "Potassium supplementation: often needed initially until MRA takes effect; monitor K+ closely (hyperkalemia risk with MRA, especially with CKD)",
      "Familial hyperaldosteronism type I (glucocorticoid-remediable aldosteronism): low-dose dexamethasone 0.25-0.5 mg/day suppresses ACTH-driven aldosterone production",
      "Cardiovascular risk assessment: PA patients have excess cardiovascular risk beyond BP — screen for LVH (echo), assess AF risk, optimize lipids and glucose",
      "Long-term follow-up: annual electrolytes, renal function, blood pressure monitoring; post-adrenalectomy patients may still need antihypertensive if longstanding HTN has caused vascular remodeling",
      "Post-adrenalectomy: monitor for contralateral adrenal suppression (rare); most patients can discontinue MRA immediately"
    ],
    nursingActions: [
      "Pre-screening medication review: identify medications that interfere with ARR testing (spironolactone must be held 6 weeks, diuretics 4 weeks); ensure potassium is corrected to > 4.0 before testing",
      "Blood pressure monitoring: orthostatic measurements (hypovolemia risk with diuretics, volume status changes with treatment); track response to MRA therapy",
      "Electrolyte monitoring: potassium (hypokalemia at baseline, hyperkalemia risk with MRA treatment — check K+ at 1, 4, and 12 weeks after starting MRA), sodium, magnesium",
      "Spironolactone side effect monitoring: gynecomastia (10-15% in men), breast tenderness, menstrual irregularities, erectile dysfunction (anti-androgenic effects) — if intolerable, switch to eplerenone",
      "Pre-operative care for adrenalectomy: optimize BP and K+ with spironolactone × 4-6 weeks; discontinue spironolactone morning of surgery; monitor post-op aldosterone levels and K+",
      "Dietary counseling: sodium restriction (< 2 g/day), potassium-rich foods; review medication interactions (NSAIDs can worsen HTN and blunt MRA effect)",
      "Patient education: PA is a treatable/curable cause of hypertension; adrenalectomy may cure or significantly improve HTN; medical therapy with MRA is effective long-term for bilateral disease",
      "Screen for complications: echocardiogram for LVH, urine albumin for renal damage, glucose for metabolic syndrome"
    ],
    signs: {
      left: [
        "Mild hypertension with incidentally discovered hypokalemia, ARR positive on screening",
        "Bilateral adrenal hyperplasia responding to spironolactone with normalized BP and K+",
        "Post-adrenalectomy for unilateral adenoma: normalized aldosterone and renin, improved or cured hypertension",
        "Stable eplerenone therapy without anti-androgenic side effects"
      ],
      right: [
        "Severe resistant hypertension (4+ medications) with persistent hypokalemia despite supplementation",
        "Cardiac complications: LVH, atrial fibrillation, heart failure — aldosterone causes direct myocardial fibrosis beyond BP effects",
        "Severe hypokalemia (< 2.5 mEq/L) with muscle weakness, rhabdomyolysis, cardiac arrhythmias",
        "Adrenal carcinoma mimicking PA — large adrenal mass with mixed hormone secretion (aldosterone + cortisol + androgens)"
      ]
    },
    medications: [
      {
        name: "Spironolactone",
        type: "Mineralocorticoid Receptor Antagonist (non-selective)",
        action: "Competitive antagonist at the mineralocorticoid receptor in renal collecting duct, blocking aldosterone-mediated sodium reabsorption and potassium excretion; also has direct anti-fibrotic and anti-inflammatory effects on cardiovascular tissue; additionally blocks androgen receptors (causes anti-androgenic side effects)",
        sideEffects: "Gynecomastia (10-15% in men), breast tenderness, menstrual irregularities, erectile dysfunction (anti-androgenic), hyperkalemia, GI upset",
        contra: "Hyperkalemia (K+ > 5.5), severe renal failure (CrCl < 30), concurrent use with other potassium-sparing diuretics, Addison disease",
        pearl: "Start 25-50 mg daily, titrate to 100-400 mg daily based on BP and K+ response. First-line MRA for PA. Anti-androgenic side effects are dose-dependent and due to androgen receptor antagonism (not mineralocorticoid related). If side effects intolerable, switch to eplerenone (selective MRA without anti-androgenic effects but requires BID dosing and higher cost). Check K+ at 1, 4, 12 weeks then every 3-6 months. Avoid in CKD stage 4-5."
      },
      {
        name: "Eplerenone",
        type: "Selective Mineralocorticoid Receptor Antagonist",
        action: "Selectively blocks the mineralocorticoid receptor without significant androgen or progesterone receptor activity — avoids the anti-androgenic side effects of spironolactone while maintaining aldosterone-blocking efficacy",
        sideEffects: "Hyperkalemia, dizziness, GI upset, cough; notably ABSENT: gynecomastia, breast tenderness, menstrual irregularity, erectile dysfunction",
        contra: "Hyperkalemia, severe renal impairment (CrCl < 30), concurrent strong CYP3A4 inhibitors, K+ > 5.5 mEq/L",
        pearl: "25-50 mg PO BID (BID required due to shorter half-life than spironolactone). ~60% potency of spironolactone at the MR. Preferred in males and premenopausal females who develop anti-androgenic side effects on spironolactone. Also proven to reduce mortality in heart failure post-MI (EPHESUS trial) and HFrEF (EMPHASIS-HF trial). CYP3A4 metabolized — check drug interactions."
      }
    ],
    pearls: [
      "Primary hyperaldosteronism is the most common cause of secondary hypertension and is vastly under-diagnosed — screen ALL patients with resistant hypertension (3+ drugs), hypokalemia, adrenal incidentaloma, or onset < 40 years; normokalemic PA is more common than hypokalemic PA",
      "Adrenal vein sampling (AVS) is essential before adrenalectomy in patients > 35 years — CT alone misclassifies 37% of PA cases (small adenomas may be non-functioning incidentalomas, and unilateral adenoma on CT may coexist with bilateral hyperplasia); AVS is the gold standard for surgical candidacy",
      "Aldosterone causes cardiovascular damage beyond its effect on blood pressure — PA patients have 4x the rate of stroke, 6x the MI rate, and 12x the AF rate compared to BP-matched essential hypertension; this excess risk is mediated by direct aldosterone-induced cardiac and vascular fibrosis and is an argument for aggressive MRA therapy"
    ],
    quiz: [
      {
        question: "A 45-year-old man with resistant hypertension (on 4 medications) has K+ 3.1, ARR 68 (aldosterone 24 ng/dL, renin 0.35 ng/mL/hr), and a 1.5 cm left adrenal nodule on CT with normal right adrenal. What is the most appropriate next step?",
        options: [
          "Proceed directly to left laparoscopic adrenalectomy based on CT findings",
          "Start spironolactone 50 mg daily for bilateral adrenal hyperplasia",
          "Perform adrenal vein sampling to confirm lateralization before considering surgery",
          "Repeat ARR testing in 6 months to confirm the diagnosis"
        ],
        correct: 2,
        rationale: "Despite a clear left adrenal nodule on CT, adrenal vein sampling (AVS) is required before adrenalectomy in patients > 35 years. CT alone misclassifies ~37% of PA cases: the nodule may be a non-functioning incidentaloma (very common in this age group) with bilateral hyperplasia being the actual PA source, or there may be bilateral disease with one dominant nodule. AVS lateralization ratio > 4:1 confirms unilateral source and guides surgical decision-making. Without AVS, an unnecessary adrenalectomy may not cure the PA."
      }
    ]
  },
  "pheochromocytoma-np": {
    title: "Pheochromocytoma: NP Management",
    cellular: {
      title: "Pheochromocytoma Catecholamine Physiology",
      content: "Pheochromocytomas are catecholamine-producing tumors arising from chromaffin cells of the adrenal medulla (90%) or extra-adrenal paraganglia (paragangliomas — 10%). These tumors synthesize, store, and episodically release catecholamines (norepinephrine, epinephrine, and dopamine) in massive, unregulated quantities. Norepinephrine activates alpha-1 receptors (vasoconstriction → severe hypertension) and beta-1 receptors (tachycardia, increased contractility). Epinephrine activates beta-2 receptors (vasodilation, bronchodilation, hyperglycemia via glycogenolysis) in addition to alpha and beta-1 effects. The episodic nature of catecholamine release causes paroxysmal symptoms: the classic triad of headache, diaphoresis, and palpitations with hypertension. Sustained catecholamine excess causes catecholamine cardiomyopathy (myocardial stunning, takotsubo-like syndrome, dilated cardiomyopathy), malignant hypertension, and metabolic effects (hyperglycemia, weight loss). The '10% rules' (10% bilateral, 10% extra-adrenal, 10% malignant, 10% pediatric) have been revised upward — genetic predisposition is found in 30-40% of cases (SDHx, VHL, RET, NF1 mutations)."
    },
    riskFactors: [
      "Genetic syndromes (30-40% are hereditary): MEN2 (RET mutation — bilateral pheo + medullary thyroid cancer + hyperparathyroidism), VHL (bilateral pheo + renal cell carcinoma + hemangioblastoma), SDHx mutations (paragangliomas — SDHB has highest malignancy risk), NF1 (pheo in 1-5%)",
      "Family history of pheochromocytoma or paraganglioma",
      "Incidentally discovered adrenal mass (incidentaloma workup identifies pheo in ~5%)",
      "Hypertensive crisis during surgery, anesthesia, or medication use (undiagnosed pheo)",
      "Age 30-50 years (peak incidence); can occur at any age",
      "History of paroxysmal hypertensive episodes with classic triad",
      "Bilateral adrenal masses (consider VHL or MEN2)",
      "Young patient with hypertension, especially with adrenal mass"
    ],
    diagnostics: [
      "Plasma free metanephrines (normetanephrine + metanephrine): BEST initial screening test — sensitivity > 97%; elevated > 3x upper normal is virtually diagnostic; intermediate elevations require confirmatory testing",
      "24-hour urine metanephrines and catecholamines: alternative screening; collect during symptomatic episode if possible",
      "Clonidine suppression test: for borderline metanephrine elevations — clonidine 0.3 mg PO suppresses normal catecholamine production but not tumor-derived; failure to suppress normetanephrine confirms pheo",
      "CT abdomen/pelvis with contrast: localize adrenal/extra-adrenal tumor (most > 3 cm at diagnosis); pheos enhance avidly with contrast (> 110 HU on enhanced CT)",
      "MRI: T2 hyperintense ('light bulb bright') signal; MRI preferred during pregnancy",
      "MIBG scan (I-123 or I-131 metaiodobenzylguanidine): localizes catecholamine-producing tissue; useful for extra-adrenal, metastatic, or recurrent disease",
      "Ga-68 DOTATATE PET/CT: superior sensitivity for paragangliomas and SDHx-related tumors",
      "Genetic testing: ALL pheo/paraganglioma patients should be offered genetic testing (SDHx, VHL, RET, NF1, MAX, TMEM127)"
    ],
    management: [
      "Alpha-blockade FIRST: phenoxybenzamine (non-competitive alpha-1/alpha-2 blocker) 10 mg PO BID, titrate to 20-30 mg TID over 10-14 days preoperatively; OR doxazosin (competitive alpha-1 blocker) 2-8 mg daily — goal: seated BP < 130/80, orthostatic SBP > 90",
      "Beta-blockade ONLY after adequate alpha-blockade: propranolol 20-40 mg TID or atenolol 25-50 mg daily — control tachycardia; NEVER give beta-blocker before alpha-blocker (unopposed alpha stimulation → hypertensive crisis)",
      "High-sodium diet and generous IV fluids preoperatively: catecholamine-induced vasoconstriction causes chronic volume depletion; preoperative volume expansion reduces post-operative hypotension",
      "Calcium channel blockers: nicardipine or amlodipine as adjunct or alternative to alpha-blockade (especially useful for paroxysmal HTN)",
      "Metyrosine (alpha-methyltyrosine): inhibits tyrosine hydroxylase, reducing catecholamine synthesis; reserved for large tumors or inadequate alpha-blockade response",
      "Surgical resection: laparoscopic adrenalectomy (< 6 cm tumors); open surgery for > 6 cm, invasive, or paragangliomas; intraoperative hemodynamic management requires experienced anesthesiologist",
      "Intraoperative management: phentolamine IV for hypertensive surges during tumor manipulation; phenylephrine or norepinephrine after tumor ligation (abrupt catecholamine loss → profound hypotension)",
      "Malignant pheo/paraganglioma (SDHx, metastatic): MIBG therapy (I-131), combination chemotherapy (CVD: cyclophosphamide, vincristine, dacarbazine), temozolomide, sunitinib"
    ],
    nursingActions: [
      "Pre-operative alpha-blockade monitoring: sitting and standing BP at each visit (target sitting < 130/80, standing SBP > 90); HR (target < 80-100 bpm once beta-blocked); nasal congestion and orthostatic dizziness are expected alpha-blockade effects (reassure patient)",
      "Pre-operative volume expansion: encourage high-sodium diet (>5000 mg/day) and liberal fluids × 2 weeks before surgery; IV NS 1-2 L night before surgery",
      "Intraoperative awareness (if in OR): expect severe BP lability during tumor manipulation (hypertensive surges) and profound hypotension after tumor vessel ligation — communicate closely with anesthesia",
      "Post-operative monitoring: continuous BP monitoring for 24-48h; hypotension common due to sudden catecholamine loss + volume depletion; aggressive IV fluids and vasopressors may be needed",
      "Post-operative hypoglycemia: insulin resistance resolves when catecholamines drop → blood glucose monitoring q1h × 4h post-op; D10 infusion if needed",
      "24-hour urine or plasma metanephrines 2-4 weeks post-surgery: confirms biochemical cure; if elevated, consider residual/recurrent disease",
      "Genetic counseling referral: ALL pheo/paraganglioma patients should have genetic testing; cascade screening of family members if mutation identified",
      "Long-term follow-up: annual metanephrines for at least 10 years (recurrence possible); lifetime surveillance for SDHx mutation carriers"
    ],
    signs: {
      left: [
        "Paroxysmal symptoms (classic triad: headache, diaphoresis, palpitations) with normal inter-episode BP",
        "Incidentally discovered adrenal mass with mildly elevated metanephrines — requires workup but may be early/subclinical",
        "Post-surgical biochemical remission: normalized metanephrines at 2-4 week follow-up",
        "Stable alpha-blockade with controlled BP and no paroxysmal events"
      ],
      right: [
        "Hypertensive crisis during undiagnosed pheo: SBP > 220, chest pain, stroke, aortic dissection, pulmonary edema — phentolamine IV rescue",
        "Catecholamine cardiomyopathy: takotsubo-like syndrome, dilated cardiomyopathy, pulmonary edema (may be initial presentation)",
        "Intraoperative hypertensive emergency during non-pheo surgery in undiagnosed patient (trigger: anesthesia induction, tumor palpation, medications)",
        "Malignant pheochromocytoma with metastatic disease (liver, bone, lung) — SDHB mutation carrier highest malignancy risk (40-50%)"
      ]
    },
    medications: [
      {
        name: "Phenoxybenzamine",
        type: "Non-competitive Alpha-1 and Alpha-2 Adrenergic Blocker",
        action: "Irreversibly (non-competitively) blocks alpha-1 and alpha-2 adrenergic receptors, preventing catecholamine-induced vasoconstriction; the non-competitive binding ensures that even massive catecholamine surges during tumor manipulation cannot overcome the blockade — critical advantage over competitive blockers",
        sideEffects: "Orthostatic hypotension, reflex tachycardia (alpha-2 blockade removes presynaptic negative feedback → increased NE release → tachycardia), nasal congestion, miosis, retrograde ejaculation, fatigue",
        contra: "Hypotension, conditions where a fall in BP is undesirable",
        pearl: "Start 10 mg PO BID × 2-3 days, increase by 10-20 mg every 2-3 days to target dose (typically 20-30 mg TID, max 100+ mg/day in large tumors). Takes 10-14 days for adequate blockade. Nasal congestion is a SIGN of adequate blockade (not just a side effect). ALWAYS add beta-blocker AFTER alpha-blockade is established (typically after 2-3 days of phenoxybenzamine). Available only through specialty pharmacies in many countries; doxazosin is a common competitive alpha-1 blocker alternative."
      },
      {
        name: "Phentolamine (IV emergency)",
        type: "Competitive Alpha-1 and Alpha-2 Blocker",
        action: "Rapidly blocks alpha-adrenergic receptors intravenously, causing immediate vasodilation and blood pressure reduction; used for acute hypertensive crises during pheochromocytoma catecholamine surges",
        sideEffects: "Tachycardia (reflex), hypotension (overshoot), GI effects (nausea, vomiting, diarrhea), nasal congestion",
        contra: "Hypotension, CAD (reflex tachycardia may worsen ischemia)",
        pearl: "2-5 mg IV bolus, can repeat q5 min for hypertensive crises during tumor manipulation in surgery or pre-operative emergencies. Half-life ~19 minutes (very short-acting). Have phenylephrine or norepinephrine ready for rebound hypotension. This is the rescue drug for intraoperative hypertensive surges during pheochromocytoma resection. Nicardipine drip is an alternative for more sustained control."
      }
    ],
    pearls: [
      "NEVER give a beta-blocker before alpha-blockade in pheochromocytoma — blocking beta-2-mediated vasodilation leaves alpha-mediated vasoconstriction unopposed, potentially causing lethal hypertensive crisis; the sequence is always: alpha-blockade FIRST (2-3 days minimum), THEN beta-blockade for reflex tachycardia",
      "All pheochromocytoma and paraganglioma patients should undergo genetic testing — 30-40% carry germline mutations; SDHB mutations carry the highest malignancy risk (40-50%) and require lifelong surveillance of the patient and genetic counseling for family members",
      "The 'pheo mimics everything' — pheochromocytoma can present as panic attacks, essential hypertension, thyroid storm, MI, stroke, aortic dissection, or takotsubo cardiomyopathy; maintain high clinical suspicion for paroxysmal hypertension with the classic triad of headache, diaphoresis, and palpitations"
    ],
    quiz: [
      {
        question: "A patient with a newly diagnosed 4 cm pheochromocytoma (plasma normetanephrine 10x upper normal) has persistent tachycardia (HR 110) and BP 165/100. The surgical team requests the NP to 'start a beta-blocker' to control heart rate before surgery next week. What is the most important response?",
        options: [
          "Start propranolol 40 mg TID immediately as requested to control tachycardia",
          "Initiate alpha-blockade with phenoxybenzamine first; add beta-blocker only AFTER adequate alpha-blockade (2-3 days minimum)",
          "Start the beta-blocker and alpha-blocker simultaneously to address both tachycardia and hypertension",
          "Defer all medication and proceed directly to surgery — preoperative blockade is unnecessary with modern anesthesia"
        ],
        correct: 1,
        rationale: "Alpha-blockade MUST precede beta-blockade in pheochromocytoma. Starting a beta-blocker first blocks beta-2-mediated vasodilation while leaving alpha-1-mediated vasoconstriction unopposed, which can cause a lethal hypertensive crisis. The protocol is: phenoxybenzamine (or doxazosin) for at least 10-14 days → then add propranolol or atenolol for reflex tachycardia → high-salt diet and fluids for volume expansion → surgery. This preoperative preparation reduces intraoperative morbidity and mortality."
      }
    ]
  },
  "hypercalcemia-malignancy-np": {
    title: "Hypercalcemia of Malignancy: NP Mgmt",
    cellular: {
      title: "Mechanisms of Malignant Hypercalcemia",
      content: "Hypercalcemia of malignancy (HCM) occurs through three main mechanisms: (1) Humoral hypercalcemia of malignancy (HHM, 80%): tumor secretion of PTHrP (parathyroid hormone-related peptide), which activates PTH/PTHrP receptors on osteoblasts, stimulating RANKL expression and osteoclast-mediated bone resorption, while also increasing renal calcium reabsorption — most common with squamous cell carcinomas (lung, head/neck), renal cell carcinoma, and breast cancer. (2) Local osteolytic hypercalcemia (20%): direct bone destruction by metastases releasing calcium — breast cancer, multiple myeloma, lymphoma; myeloma produces osteoclast-activating factors (RANKL, MIP-1α, IL-6). (3) Calcitriol-mediated (1%): lymphoma cells express 1-alpha-hydroxylase, converting 25-OH vitamin D to active 1,25-(OH)2 vitamin D (calcitriol), which increases intestinal calcium absorption. HCM is a poor prognostic indicator — median survival after diagnosis is 1-3 months for most solid tumors."
    },
    riskFactors: [
      "Squamous cell carcinomas (lung, head and neck, esophagus — highest PTHrP incidence)",
      "Breast cancer (both PTHrP-mediated and osteolytic metastases)",
      "Multiple myeloma (osteolytic lesions, OAF production)",
      "Renal cell carcinoma (PTHrP-secreting)",
      "Non-Hodgkin lymphoma and Hodgkin lymphoma (calcitriol-mediated or PTHrP)",
      "Advanced cancer stage (HCM rarely occurs with early-stage disease)",
      "Dehydration (concentrates calcium, reduced renal clearance)",
      "Immobility (increased bone resorption from disuse)"
    ],
    diagnostics: [
      "Corrected calcium = measured calcium + 0.8 × (4.0 - albumin) — always correct for albumin; ionized calcium is more accurate but less available",
      "PTHrP level: elevated in HHM (> 2.0 pmol/L); PTH should be suppressed (< 20 pg/mL) — if PTH is elevated, consider concurrent primary hyperparathyroidism",
      "PTH (intact): SUPPRESSED in malignant hypercalcemia (negative feedback from high calcium); ELEVATED in primary hyperparathyroidism",
      "Calcitriol (1,25-OH-D): elevated in lymphoma-mediated hypercalcemia",
      "Calcium level classification: mild 10.5-12.0 mg/dL, moderate 12.0-14.0, severe > 14.0 mg/dL (symptoms correlate poorly with level — rate of rise matters more than absolute value)",
      "BMP: renal function (pre-renal AKI from dehydration common), electrolytes (hypokalemia, hypomagnesemia from polyuria)",
      "ECG: shortened QT interval (QTc < 360 ms), widened T waves, Osborn waves (severe); bradycardia, heart block at very high levels",
      "Staging workup: CT chest/abdomen/pelvis, bone scan or PET-CT for extent of disease"
    ],
    management: [
      "Aggressive IV hydration: NS 200-500 mL/hr initially (3-6 L in first 24 hours); restores intravascular volume, increases renal calcium excretion; adjust for cardiac/renal function",
      "Zoledronic acid 4 mg IV over 15 minutes: bisphosphonate — inhibits osteoclast-mediated bone resorption; onset 2-4 days, peak effect 4-7 days, duration 2-4 weeks; adjust for renal function (hold if CrCl < 30)",
      "Denosumab 120 mg SC: anti-RANKL monoclonal antibody — alternative to bisphosphonate, especially if renal impairment (not renally cleared); onset similar to bisphosphonates",
      "Calcitonin 4 IU/kg SC or IM q12h: rapid onset (4-6 hours) but tachyphylaxis develops within 48 hours (downregulation of calcitonin receptors); useful as bridge while awaiting bisphosphonate effect",
      "Loop diuretics (furosemide): ONLY after euvolemia is established — promote calciuresis; do NOT give to dehydrated patients (worsens volume depletion)",
      "Corticosteroids: dexamethasone 40 mg IV daily × 4 days for calcitriol-mediated hypercalcemia (lymphoma) or myeloma (inhibits 1-alpha-hydroxylase and has direct anti-tumor effect)",
      "Dialysis: for severe refractory hypercalcemia (Ca2+ > 18 mg/dL) or in renal failure preventing adequate fluid/bisphosphonate therapy",
      "Treat underlying malignancy: definitive management — chemotherapy, radiation, surgery; HCM will recur without tumor control"
    ],
    nursingActions: [
      "Aggressive IV hydration: monitor I&O hourly; auscultate lungs q4h for fluid overload (crackles); daily weights; adjust rate for cardiac and renal function (elderly and HF patients need careful titration)",
      "Cardiac monitoring: continuous telemetry — QT shortening, bradycardia, heart block possible at high calcium levels; report arrhythmias immediately",
      "Calcium monitoring: serum calcium q6-8h initially; always calculate corrected calcium if albumin is low; trending is more useful than single values",
      "Neurological assessment: confusion, lethargy, weakness — calcium > 14 mg/dL commonly causes altered mental status; seizures possible; fall precautions",
      "Renal function monitoring: creatinine, BUN, urine output; hypercalcemia causes nephrogenic diabetes insipidus (polyuria then oliguria as renal injury develops)",
      "Medication administration: calcitonin first (fastest onset) → then bisphosphonate (sustained effect); ensure adequate hydration BEFORE furosemide",
      "GI symptom management: nausea, vomiting, constipation are common with hypercalcemia — antiemetics, aggressive bowel regimen",
      "Goals of care discussion: HCM is a poor prognostic marker (median survival 1-3 months for most solid tumors); discuss prognosis and goals with patient/family; palliative care consultation"
    ],
    signs: {
      left: [
        "Mild hypercalcemia (10.5-12.0 mg/dL): may be asymptomatic or cause subtle fatigue, constipation, polyuria",
        "Responding to IV hydration with calcium trending down and improving mental status",
        "Good response to bisphosphonate with calcium normalizing within 4-7 days",
        "Underlying malignancy responsive to treatment (favorable biology)"
      ],
      right: [
        "Severe hypercalcemia (> 14.0 mg/dL): obtundation, coma, renal failure, cardiac arrhythmias — medical emergency",
        "Refractory hypercalcemia despite bisphosphonate and fluids (poor prognosis — consider denosumab or dialysis)",
        "Hypercalcemic crisis: calcium > 18 mg/dL with cardiovascular collapse — urgent dialysis may be required",
        "Recurrent HCM despite treatment: indicates progressive, treatment-refractory malignancy (end-of-life care discussion)"
      ]
    },
    medications: [
      {
        name: "Zoledronic Acid (Zometa)",
        type: "Bisphosphonate (Nitrogen-containing)",
        action: "Binds hydroxyapatite in bone, is internalized by osteoclasts during resorption, and inhibits farnesyl pyrophosphate synthase (FPP synthase) in the mevalonate pathway, preventing prenylation of small GTPases essential for osteoclast function — causes osteoclast apoptosis and reduces bone resorption",
        sideEffects: "Acute phase reaction (fever, myalgias 24-72h post-infusion — 30%), nephrotoxicity (dose-dependent — infuse over ≥ 15 minutes), hypocalcemia (especially after treatment of severe HCM), osteonecrosis of the jaw (ONJ — long-term use), atypical femoral fractures (long-term)",
        contra: "CrCl < 30 mL/min (use denosumab instead), hypocalcemia, pregnancy",
        pearl: "4 mg IV over 15 minutes (do not infuse faster — nephrotoxicity increases). Onset 2-4 days, peak 4-7 days, duration 2-4 weeks. Check creatinine before each dose. Can repeat in 7 days if calcium remains elevated. Ensure adequate hydration before and during infusion. Pre-treat with acetaminophen for acute phase reaction. Superior to pamidronate for HCM (stronger and faster)."
      },
      {
        name: "Denosumab (Xgeva)",
        type: "Anti-RANKL Monoclonal Antibody",
        action: "Binds RANK ligand (RANKL), preventing its interaction with RANK receptor on osteoclast precursors; blocks osteoclast formation, function, and survival; not renally cleared — advantage over bisphosphonates in renal impairment",
        sideEffects: "Hypocalcemia (can be severe — supplement calcium and vitamin D), osteonecrosis of the jaw, atypical fractures, infections",
        contra: "Hypocalcemia (correct before starting), pregnancy",
        pearl: "120 mg SC for HCM. Onset similar to bisphosphonates (2-4 days). KEY ADVANTAGE: not renally cleared — can be used safely in renal impairment (unlike bisphosphonates). Also effective for bisphosphonate-refractory HCM. Rebound hypercalcemia can occur upon discontinuation (unlike bisphosphonates which bind to bone long-term). Must supplement calcium 500 mg and vitamin D 400 IU daily to prevent treatment-induced hypocalcemia."
      }
    ],
    pearls: [
      "The treatment sequence for acute malignant hypercalcemia is: (1) NS hydration (immediate — corrects dehydration and increases renal calcium excretion), (2) Calcitonin (rapid onset within hours but tachyphylaxis by 48h — bridge therapy), (3) Bisphosphonate or denosumab (definitive treatment but takes 2-4 days); furosemide ONLY after euvolemia is established",
      "Hypercalcemia of malignancy has PTH SUPPRESSED and PTHrP elevated — if PTH is elevated in a cancer patient, consider concurrent primary hyperparathyroidism (coexistence of two common conditions) rather than assuming the cancer is causing the hypercalcemia",
      "HCM is a prognostic marker indicating advanced disease — median survival after first HCM episode is 1-3 months for most solid tumors; palliative care involvement and goals-of-care discussions should accompany medical management"
    ],
    quiz: [
      {
        question: "A patient with metastatic squamous cell lung cancer presents with calcium 15.8 mg/dL, confusion, severe dehydration, and creatinine 2.4 (baseline 0.9). PTH is suppressed at 4 pg/mL, PTHrP is markedly elevated. What is the correct initial management sequence?",
        options: [
          "Furosemide 40 mg IV immediately, then start NS hydration and zoledronic acid",
          "NS hydration 300-500 mL/hr, calcitonin 4 IU/kg SC q12h, then zoledronic acid 4 mg IV after rehydration improves creatinine",
          "Denosumab 120 mg SC immediately — bisphosphonate is contraindicated with elevated creatinine",
          "Hemodialysis for severe hypercalcemia followed by IV steroids for PTHrP-mediated disease"
        ],
        correct: 1,
        rationale: "The correct sequence is: (1) Aggressive NS hydration first (corrects dehydration and increases renal calcium excretion — this patient is severely volume depleted), (2) Calcitonin for rapid-onset calcium lowering (bridge therapy while awaiting bisphosphonate effect), (3) Bisphosphonate once renal function improves from hydration. Furosemide should NEVER be given before euvolemia — it worsens dehydration. Denosumab is an option with renal impairment but zoledronic acid can be used once creatinine improves. Steroids are for calcitriol-mediated (lymphoma) HCM, not PTHrP-mediated."
      }
    ]
  },
  "hyponatremia-correction-np": {
    title: "Hyponatremia Correction: NP Approach",
    cellular: {
      title: "Hyponatremia Classification & Brain Adaptation",
      content: "Hyponatremia (Na+ < 135 mEq/L) is the most common electrolyte disorder, classified by timing, volume status, and tonicity. In acute hyponatremia (< 48 hours), water shifts rapidly into brain cells (osmotic gradient), causing cerebral edema, increased ICP, and potentially fatal herniation — this requires urgent treatment. In chronic hyponatremia (> 48 hours or unknown duration), the brain adapts by extruding organic osmolytes (glutamate, taurine, myo-inositol) over 24-48 hours to restore cell volume — the brain is 'osmo-adapted.' This adaptation is protective against edema but creates vulnerability to overly rapid correction: if serum sodium is raised too quickly, water is pulled out of brain cells faster than osmolytes can be re-accumulated, causing oligodendrocyte apoptosis and osmotic demyelination syndrome (ODS/central pontine myelinolysis). Causes by volume status: hypovolemic (diuretics, GI losses, adrenal insufficiency), euvolemic (SIADH — most common, hypothyroidism, adrenal insufficiency, psychogenic polydipsia), hypervolemic (CHF, cirrhosis, nephrotic syndrome). Tonicity assessment distinguishes true hypotonic hyponatremia from pseudohyponatremia (hyperlipidemia, hyperproteinemia) and translocational (hyperglycemia — corrected Na+ rises 1.6-2.4 mEq/L per 100 mg/dL glucose above 100)."
    },
    riskFactors: [
      "SIADH (most common cause of euvolemic hyponatremia — CNS disorders, pulmonary disease, medications, malignancy)",
      "Thiazide diuretics (block NaCl reabsorption in DCT without reducing medullary tonicity → impaired free water excretion)",
      "Advanced age (reduced renal concentrating ability, multiple medications, comorbidities)",
      "Heart failure and cirrhosis (hypervolemic hyponatremia from impaired free water excretion)",
      "Medications: SSRIs, carbamazepine, cyclophosphamide, oxcarbazepine, desmopressin — all can cause SIADH",
      "Post-operative patients (pain, nausea, narcotics stimulate ADH; hypotonic IV fluids iatrogenically lower sodium)",
      "Adrenal insufficiency (cortisol deficiency impairs free water excretion and stimulates ADH)",
      "Psychogenic polydipsia (extreme water intake > 15 L/day overwhelms renal excretory capacity)"
    ],
    diagnostics: [
      "Serum sodium with confirmation: < 135 mEq/L; severity — mild 130-135, moderate 125-129, severe < 125 mEq/L",
      "Serum osmolality: < 280 mOsm/kg confirms true hypotonic hyponatremia; if normal/elevated → pseudohyponatremia or translocational (check glucose, lipids, proteins)",
      "Urine osmolality: > 100 mOsm/kg = impaired free water excretion (SIADH, HF, cirrhosis, diuretics); < 100 = primary polydipsia or low solute intake (beer potomania)",
      "Urine sodium: > 30 mEq/L = renal sodium wasting (SIADH, diuretics, adrenal insufficiency, renal salt wasting); < 20 mEq/L = appropriate sodium conservation (hypovolemia, HF, cirrhosis)",
      "Volume status assessment: clinical (skin turgor, mucous membranes, orthostatic vitals, JVP, edema) — distinguishes hypovolemic vs. euvolemic vs. hypervolemic causes",
      "TSH and cortisol: rule out hypothyroidism and adrenal insufficiency (both cause euvolemic hyponatremia and must be excluded before diagnosing SIADH)",
      "Serum uric acid: < 4 mg/dL supports SIADH diagnosis (increased renal uric acid excretion)",
      "CT head or CXR if SIADH suspected: CNS pathology (tumor, stroke, infection, SAH) and pulmonary disease (pneumonia, lung cancer, TB) are common SIADH causes"
    ],
    management: [
      "Acute symptomatic hyponatremia (seizures, altered mental status): 3% NaCl 100 mL IV bolus over 10 minutes, repeat up to 3 times if symptoms persist — goal: raise Na+ by 4-6 mEq/L to stop symptoms, then slow correction",
      "Chronic hyponatremia correction rate: ≤ 8 mEq/L per 24 hours (≤ 6 mEq/L in high-risk: alcoholism, liver disease, malnutrition, severe hyponatremia < 105 mEq/L) — PREVENT ODS",
      "SIADH management: fluid restriction (800-1000 mL/day first-line), salt tablets + loop diuretic (increase free water excretion), tolvaptan (V2 receptor antagonist — oral, effective but expensive and hepatotoxicity risk), urea (osmotic diuretic promoting free water loss)",
      "Hypovolemic hyponatremia: NS (0.9%) volume resuscitation — WARNING: once hypovolemia is corrected, ADH suppression causes aquaresis (massive water diuresis) that can rapidly overcorrect sodium; monitor closely",
      "Hypervolemic hyponatremia: fluid restriction + loop diuretics; SGLT2 inhibitors in HF (natriuresis + aquaresis); tolvaptan in HF (short-term symptomatic improvement — no mortality benefit)",
      "Proactive DDAVP strategy: give DDAVP 1-2 mcg IV q8h to clamp urine osmolality, then use 3% NaCl at calculated rate for precise correction — this allows controlled correction and prevents overcorrection",
      "If overcorrection occurs: STOP all saline, give DDAVP 2-4 mcg IV + D5W infusion to re-lower sodium — this 'rescue' can prevent ODS even after inadvertent overcorrection",
      "Medication-induced SIADH: discontinue offending agent (SSRIs, carbamazepine) — sodium usually normalizes within 1-2 weeks"
    ],
    nursingActions: [
      "Sodium monitoring: q2-4h serum sodium during active correction; calculate hourly rate of rise and ALERT provider if approaching correction limit",
      "Strict I&O: document all IV fluids, oral intake, and urine output hourly; unexpected high urine output (aquaresis) can cause rapid sodium rise",
      "Create sodium correction timeline in nursing notes: plot sodium values, time, and calculate 24-hour rate of change from the STARTING point — this real-time tracking prevents overcorrection",
      "Neurological assessment: for acute hyponatremia — seizures, altered consciousness (too-slow correction); for chronic hyponatremia correction — new dysarthria, dysphagia, quadriparesis (overcorrection/ODS developing 2-6 days later)",
      "Fluid restriction enforcement: if on fluid restriction (SIADH), ALL fluids count — IV medications, flushes, ice chips; collaborate with pharmacy to concentrate IV medications",
      "Identify high-risk patients early: alcoholism, liver disease, severe hyponatremia < 110, malnutrition — alert provider that stricter correction limit (≤ 6 mEq/L/24h) applies",
      "Monitor for aquaresis: when treating hypovolemic hyponatremia with NS, volume correction suppresses ADH → sudden dilute urine output increases; this can rapidly overcorrect sodium — have DDAVP and D5W ready",
      "Teach patients about chronic SIADH management: fluid restriction adherence, salt tablet use, medication avoidance (NSAIDs, desmopressin can worsen SIADH)"
    ],
    signs: {
      left: [
        "Mild chronic hyponatremia (Na+ 130-135) asymptomatic or with subtle symptoms (gait instability, cognitive slowing)",
        "Appropriate correction rate (< 8 mEq/L/24h) with resolving symptoms",
        "SIADH responding to fluid restriction with sodium trending upward gradually",
        "Medication-induced SIADH resolving after offending agent discontinued"
      ],
      right: [
        "Acute symptomatic hyponatremia: seizures, coma, respiratory arrest — EMERGENCY requiring 3% NaCl bolus immediately",
        "Overcorrection: sodium rose > 10 mEq/L in 24 hours — RESCUE with DDAVP + D5W immediately to prevent ODS",
        "ODS developing 2-6 days after rapid correction: new dysarthria, dysphagia, quadriparesis, locked-in syndrome",
        "Hypovolemic hyponatremia with aquaresis: massive urine output after volume correction causing rapid uncontrolled sodium rise"
      ]
    },
    medications: [
      {
        name: "Tolvaptan (Samsca)",
        type: "Vasopressin V2 Receptor Antagonist (Vaptan)",
        action: "Selectively blocks V2 vasopressin receptors in the renal collecting duct, preventing aquaporin-2 insertion and promoting free water excretion (aquaresis) without sodium loss — raises serum sodium by eliminating excess water rather than adding sodium",
        sideEffects: "Overly rapid sodium correction (must monitor q6h for first 24h), thirst, dry mouth, polyuria, hypernatremia, hepatotoxicity (FDA black box — limit use to 30 days)",
        contra: "Hypovolemic hyponatremia, urgent need for rapid correction (too slow), inability to sense or respond to thirst, concurrent use of strong CYP3A4 inhibitors, liver disease (hepatotoxicity risk)",
        pearl: "15 mg PO daily, can increase to 30-60 mg. Must INITIATE in hospital with sodium monitoring q6h for first 24 hours (overcorrection risk). Liberalize fluid intake during initiation (counterintuitive — replaces some of the free water being excreted to prevent overcorrection). ONLY for euvolemic or hypervolemic hyponatremia — contraindicated in hypovolemic. Do not use with fluid restriction (synergistic overcorrection risk). Expensive and hepatotoxicity limits long-term use."
      },
      {
        name: "3% Hypertonic Saline",
        type: "Concentrated Sodium Solution",
        action: "Directly raises serum sodium concentration; in acute symptomatic hyponatremia, the osmotic effect draws water from brain cells back into the extracellular space, reducing cerebral edema and preventing herniation",
        sideEffects: "Overly rapid correction (ODS risk), volume overload, phlebitis (give via central line if possible; can use peripheral in emergency)",
        contra: "Hypernatremia; unmonitored infusion (must have frequent sodium checks)",
        pearl: "For acute symptomatic hyponatremia (seizures, obtundation): 100 mL bolus over 10 minutes × up to 3 boluses until symptoms resolve — this rapidly raises sodium by ~1.5-2 mEq/L per bolus. For controlled chronic correction: infusion rate calculated by Adler-Sterns formula. ALWAYS pair with proactive DDAVP when correcting chronic hyponatremia to maintain precise correction rate. Central line preferred but peripheral acceptable in emergency. Target: raise 4-6 mEq/L to stop acute symptoms, then ≤ 8 mEq/L total in first 24h."
      }
    ],
    pearls: [
      "The most dangerous moment in treating hypovolemic hyponatremia is when you fix the volume deficit — once intravascular volume is restored, ADH suppression triggers massive aquaresis (dilute urine output > 200 mL/hr) that can overcorrect sodium by 15-20 mEq/L in hours; have DDAVP and D5W ready for this predictable complication",
      "The proactive DDAVP strategy is the safest approach for chronic severe hyponatremia: give DDAVP 1-2 mcg q8h to clamp urine osmolality, then use 3% NaCl at a calculated rate to control correction precisely — this eliminates the unpredictable aquaresis that causes overcorrection",
      "Chronic hyponatremia even in the 'mild' range (125-135) causes gait instability, attention deficits, and increased fall/fracture risk — it is NOT 'asymptomatic'; treatment improves quality of life and reduces fracture risk"
    ],
    quiz: [
      {
        question: "A patient with chronic hyponatremia (Na+ 112 mEq/L) due to SIADH is being treated with 3% saline. At 8 hours, sodium has risen to 118 mEq/L. At 14 hours, sodium is 124 mEq/L (12 mEq/L rise in 14 hours). The patient is a 58-year-old with liver cirrhosis. What is the most appropriate immediate action?",
        options: [
          "Continue current rate — 12 mEq/L rise is within the 24-hour limit of 8 mEq/L for high-risk patients",
          "Stop 3% saline, start D5W infusion, and administer DDAVP 2-4 mcg IV to re-lower sodium back toward safe correction rate",
          "Switch to normal saline and monitor sodium in 6 hours",
          "Increase 3% saline rate to reach target sodium of 135 mEq/L within 24 hours"
        ],
        correct: 1,
        rationale: "This patient with liver cirrhosis (HIGH RISK for ODS) has had sodium rise by 12 mEq/L in 14 hours — this far exceeds the ≤ 6 mEq/L/24h recommended for high-risk patients. Immediate rescue intervention is required: stop all saline, start D5W (free water), and give DDAVP to prevent further water loss. The goal is to re-lower sodium to ≤ 6-8 mEq/L above the starting point (target ~118-120 at 24h mark). This rescue strategy can prevent ODS even after overcorrection if implemented promptly. Option A is incorrect — 12 mEq/L exceeds BOTH the standard limit (8) and high-risk limit (6)."
      }
    ]
  },
  "men-syndromes-np": {
    title: "MEN Syndromes: NP Management",
    cellular: {
      title: "Multiple Endocrine Neoplasia Genetics",
      content: "Multiple endocrine neoplasia (MEN) syndromes are autosomal dominant inherited tumor syndromes affecting endocrine glands. MEN1 (Wernicke-Menin) involves mutations in the MEN1 tumor suppressor gene on chromosome 11q13, encoding menin — a nuclear protein involved in transcriptional regulation, DNA repair, and chromatin remodeling. Loss of menin function causes unregulated cell proliferation in parathyroids (95-100%), anterior pituitary (30-40%), and enteropancreatic neuroendocrine tumors (60-70% — gastrinomas most common). MEN2 involves activating (gain-of-function) mutations in the RET proto-oncogene on chromosome 10q11.2. MEN2A (75%) features medullary thyroid carcinoma (MTC, 95-100%), pheochromocytoma (50%), and primary hyperparathyroidism (20-30%). MEN2B (5%) features MTC (aggressive, earliest onset), pheochromocytoma (50%), marfanoid habitus, mucosal neuromas, and intestinal ganglioneuromas — NO hyperparathyroidism. The RET codon-specific mutations dictate phenotype severity and timing of prophylactic thyroidectomy. MEN4 involves CDKN1B mutations and resembles MEN1."
    },
    riskFactors: [
      "Family history of MEN syndrome (autosomal dominant — 50% risk per offspring)",
      "Known MEN1, RET, or CDKN1B germline mutation",
      "Multigland endocrine tumors at young age",
      "Recurrent primary hyperparathyroidism (especially multigland disease in young patients)",
      "Medullary thyroid carcinoma at any age (10-25% are hereditary)",
      "Bilateral pheochromocytoma (consider MEN2A/2B or VHL)",
      "Zollinger-Ellison syndrome (gastrinoma — 25% are MEN1-associated)",
      "Young patient with pituitary adenoma + pancreatic NET or hyperparathyroidism"
    ],
    diagnostics: [
      "Genetic testing: MEN1 gene sequencing (chromosome 11), RET proto-oncogene sequencing (chromosome 10) — once mutation identified, cascade screening of first-degree relatives",
      "MEN1 screening: calcium/PTH (hyperparathyroidism — earliest manifestation), prolactin/IGF-1 (pituitary), fasting gastrin/chromogranin A (pancreatic NETs), fasting glucose and insulin (insulinoma)",
      "MEN2A screening: calcitonin (MTC — both basal and stimulated), plasma metanephrines (pheochromocytoma), calcium/PTH (hyperparathyroidism)",
      "MEN2B clinical features: mucosal neuromas (lips, tongue — pathognomonic), marfanoid body habitus, intestinal ganglioneuromas, medullated corneal nerves — clinical diagnosis often possible before genetic testing",
      "Thyroid ultrasound: for MTC screening in MEN2 carriers",
      "CT/MRI abdomen: pancreatic NETs in MEN1; adrenal imaging for pheochromocytoma in MEN2",
      "Pituitary MRI: screening in MEN1 carriers",
      "Annual screening protocols for asymptomatic carriers: begin in childhood for MEN2 (calcitonin, metanephrines); begin by age 8-10 for MEN1 (calcium, prolactin)"
    ],
    management: [
      "MEN1 hyperparathyroidism: subtotal parathyroidectomy (3.5 glands) or total with autotransplantation (recurrence is common with less-than-subtotal surgery)",
      "MEN1 gastrinoma (Zollinger-Ellison): high-dose PPI for acid suppression; surgical resection if > 2 cm (metastatic risk increases with size); somatostatin analogs for advanced disease",
      "MEN1 insulinoma: surgical enucleation; diazoxide or somatostatin analogs for unresectable",
      "MEN1 pituitary adenoma: treat based on tumor type — prolactinoma (cabergoline), non-functioning or GH-secreting (transsphenoidal surgery)",
      "MEN2A/2B MTC: PROPHYLACTIC THYROIDECTOMY based on RET codon-specific risk — highest risk (codon 918/MEN2B): thyroidectomy within first 6 months of life; high risk (C634): by age 5 years; moderate risk: by age 5-10 or when calcitonin rises",
      "MEN2 pheochromocytoma: alpha-blockade → surgical resection; cortical-sparing adrenalectomy preferred (preserves adrenal function) if unilateral; bilateral requires lifelong cortisol replacement",
      "Genetic counseling: all affected families; discuss screening protocols, reproductive options, psychological support for presymptomatic carriers",
      "Lifelong surveillance: annual biochemical and imaging screening per MEN subtype; tumor recurrence and new primary tumors develop throughout life"
    ],
    nursingActions: [
      "Genetic testing coordination: ensure pre-test genetic counseling, informed consent, and post-test result disclosure with genetic counselor present; respect patient autonomy regarding testing decisions",
      "Screening protocol adherence: maintain tracking system for annual screening labs and imaging per MEN subtype; patients often receive care from multiple specialists — the NP can coordinate integrated care",
      "Pre-operative workup for MEN2: ALWAYS rule out pheochromocytoma BEFORE thyroidectomy — undiagnosed pheo during surgery can cause lethal hypertensive crisis; plasma metanephrines required preoperatively",
      "Post-thyroidectomy monitoring (MEN2): calcium q6h × 24h post-op (hypoparathyroidism risk from extensive surgery), voice assessment (RLN injury), calcitonin and CEA levels for MTC recurrence surveillance",
      "Calcitonin trending: serial calcitonin levels monitor MTC recurrence/persistence after thyroidectomy; doubling time < 6 months indicates aggressive disease requiring additional evaluation",
      "Patient education on MEN syndromes: lifelong condition requiring ongoing surveillance; importance of family member screening; each generation needs genetic testing and counseling",
      "Psychosocial support: diagnosis of hereditary cancer syndrome has profound psychological impact — cancer anxiety, survivor guilt, reproductive decision-making concerns; facilitate access to genetic counseling and support groups",
      "Multi-endocrine management: patients may develop multiple hormone deficiencies post-surgery — coordinate endocrine replacement therapy (thyroid hormone, cortisol, calcium/vitamin D, testosterone)"
    ],
    signs: {
      left: [
        "Asymptomatic MEN carrier detected by genetic screening — begin surveillance protocol",
        "MEN1 with mild hyperparathyroidism: calcium 10.5-11.0, asymptomatic — monitor vs. surgical timing",
        "Post-prophylactic thyroidectomy in MEN2: undetectable calcitonin, stable on thyroid hormone replacement",
        "Well-controlled Zollinger-Ellison syndrome on PPI therapy with normalized gastrin"
      ],
      right: [
        "MEN2B in infant/young child: mucosal neuromas, marfanoid habitus — urgent RET testing and thyroidectomy needed (MTC develops in infancy in MEN2B)",
        "Metastatic MTC with rising calcitonin and CEA: systemic therapy needed (vandetanib, cabozantinib, selpercatinib for RET-mutant)",
        "MEN1 with malignant pancreatic NET: liver metastases on imaging — requires multidisciplinary oncology approach",
        "Undiagnosed pheochromocytoma in MEN2 patient presenting for thyroidectomy — MUST cancel surgery until pheo is treated (alpha-blockade → adrenalectomy → then thyroidectomy)"
      ]
    },
    medications: [
      {
        name: "Vandetanib (Caprelsa)",
        type: "Multi-kinase Inhibitor (RET, VEGFR, EGFR)",
        action: "Inhibits RET kinase (directly targets the driver oncogene in MEN2-associated MTC), VEGFR (anti-angiogenic), and EGFR; slows MTC progression in advanced/metastatic disease",
        sideEffects: "QT prolongation (FDA black box — ECG monitoring required, REMS program), diarrhea, rash, hypertension, hypothyroidism, hepatotoxicity, interstitial lung disease",
        contra: "Congenital long QT syndrome, QTc > 450 ms, concurrent QT-prolonging drugs, hypokalemia/hypomagnesemia (correct before starting)",
        pearl: "300 mg PO daily for advanced MTC. Check ECG at baseline, 2-4 weeks, then q3 months. Maintain K+ > 4.0 and Mg2+ > 1.8. REMS program required due to QT prolongation risk. Alternative: cabozantinib (different multi-kinase inhibitor without QT concern). Selpercatinib (Retevmo) is a highly selective RET inhibitor with better tolerability — increasingly used first-line for RET-mutant MTC."
      },
      {
        name: "Selpercatinib (Retevmo)",
        type: "Selective RET Kinase Inhibitor",
        action: "Highly selective inhibitor of wild-type and mutant RET kinase; specifically designed to target the RET driver mutation in MEN2-associated and sporadic RET-mutant MTC with minimal off-target kinase inhibition — improved tolerability over multi-kinase inhibitors",
        sideEffects: "Dry mouth, diarrhea, hypertension, hepatotoxicity (ALT/AST elevation), QT prolongation (less than vandetanib), edema, fatigue, hypocalcemia",
        contra: "Severe hepatic impairment, concurrent strong CYP3A4 inhibitors (dose reduction required), QT prolongation",
        pearl: "120-160 mg PO BID (weight-based dosing). FDA-approved for RET-mutant MTC (including MEN2). Overall response rate ~73% with durable responses. Better tolerated than vandetanib/cabozantinib due to RET selectivity. Monitor LFTs every 2 weeks × 3 months, then monthly. Increasingly considered first-line for advanced MTC in MEN2 patients."
      }
    ],
    pearls: [
      "In MEN2, ALWAYS rule out pheochromocytoma BEFORE thyroidectomy — the surgical sequence is: screen metanephrines → if pheo present, alpha-blockade → adrenalectomy → THEN thyroidectomy; operating on an undiagnosed pheo can cause lethal intraoperative hypertensive crisis",
      "MEN1 is remembered as the '3 P's': Parathyroid (95-100%), Pituitary (30-40%), Pancreatic NETs (60-70%); the most common presenting feature is primary hyperparathyroidism, often at a younger age (< 30) with multigland disease — recurrent hyperparathyroidism in young patients should raise MEN1 suspicion",
      "Prophylactic thyroidectomy in MEN2 carriers is one of the most impactful genetic medicine interventions — RET codon-specific risk stratification guides timing, and early thyroidectomy before MTC develops is potentially curative; delayed thyroidectomy after MTC develops requires lifelong calcitonin/CEA surveillance for recurrence"
    ],
    quiz: [
      {
        question: "A 4-year-old child is found to carry a RET codon C634 mutation (MEN2A, high risk) on genetic screening after his father was diagnosed with MTC. The child is asymptomatic. Calcitonin is normal. What is the recommended management?",
        options: [
          "Annual calcitonin monitoring until calcitonin rises, then perform thyroidectomy",
          "Prophylactic total thyroidectomy by age 5 with central lymph node dissection, plus screening for pheochromocytoma",
          "Begin vandetanib prophylaxis to prevent MTC development",
          "Observe with thyroid ultrasound every 6 months and intervene only if nodules develop"
        ],
        correct: 1,
        rationale: "RET codon C634 mutations are classified as 'high risk' in the ATA MEN2 guidelines, with recommended prophylactic thyroidectomy by age 5 years. MTC in MEN2A develops from C-cell hyperplasia that progresses to microscopic then macroscopic MTC — prophylactic thyroidectomy before this progression is potentially curative. Central lymph node dissection is performed if calcitonin is elevated or at the surgeon's discretion. Pheochromocytoma screening (metanephrines) must be done before surgery. Waiting for calcitonin elevation means waiting for MTC to develop, which reduces cure rates."
      }
    ]
  },
  "carcinoid-syndrome-np": {
    title: "Carcinoid Syndrome: NP Management",
    cellular: {
      title: "Carcinoid Syndrome Pathophysiology",
      content: "Carcinoid syndrome results from systemic release of bioactive amines (serotonin, histamine, tachykinins, prostaglandins) from well-differentiated neuroendocrine tumors (NETs). Most gastrointestinal NETs drain into the portal system where the liver metabolizes these amines — syndrome occurs only when liver metastases allow vasoactive substances to bypass hepatic first-pass metabolism and enter systemic circulation (or in primary bronchial/ovarian NETs which drain directly into systemic circulation). Serotonin (5-HT), synthesized from tryptophan via tryptophan hydroxylase, is the primary mediator: it causes intestinal hypermotility (diarrhea via 5-HT3 and 5-HT4 receptors), bronchoconstriction, and fibrosis. Carcinoid heart disease (Hedinger syndrome) occurs in 20-50%: serotonin-mediated endocardial fibrosis predominantly affects right-sided cardiac valves (tricuspid regurgitation and pulmonic stenosis) because serotonin is metabolized by pulmonary MAO before reaching left heart. Flushing is mediated primarily by tachykinins (substance P, neurokinin A) and histamine rather than serotonin. Tryptophan diversion to serotonin synthesis can cause niacin (vitamin B3) deficiency with pellagra-like symptoms."
    },
    riskFactors: [
      "Hepatic metastases from midgut NETs (most common scenario for carcinoid syndrome)",
      "Primary bronchial carcinoid (direct systemic venous drainage bypasses liver)",
      "Ovarian carcinoid (direct systemic drainage)",
      "Large tumor burden with extensive liver involvement",
      "Well-differentiated NET (Grade 1-2) — paradoxically, well-differentiated tumors produce more bioactive amines than poorly differentiated (high-grade) neuroendocrine carcinomas",
      "Midgut location (jejunum, ileum, appendix, proximal colon) — highest serotonin production",
      "Long disease duration (carcinoid heart disease increases with duration of serotonin exposure)"
    ],
    diagnostics: [
      "24-hour urine 5-HIAA (5-hydroxyindoleacetic acid): serotonin metabolite — elevated > 2x upper normal is highly specific for carcinoid syndrome; avoid serotonin-rich foods (bananas, avocados, walnuts, kiwi) and medications (SSRIs, tryptophan) that cause false positives × 72h before collection",
      "Serum chromogranin A: elevated in most NETs; non-specific (also elevated with PPI use, renal failure, atrophic gastritis) but useful for monitoring treatment response and disease progression",
      "Plasma 5-HIAA: emerging as alternative to 24h urine (more convenient, good correlation)",
      "CT chest/abdomen/pelvis with contrast: tumor localization, liver metastases assessment",
      "Ga-68 DOTATATE PET/CT: somatostatin receptor-based imaging — highest sensitivity for well-differentiated NETs; guides somatostatin analog therapy and PRRT eligibility",
      "Echocardiogram: mandatory to screen for carcinoid heart disease (tricuspid regurgitation, pulmonic stenosis, right-sided valve thickening/retraction); repeat annually if 5-HIAA elevated",
      "NT-proBNP: elevated with carcinoid heart disease; useful for screening and monitoring",
      "Histologic grading: Ki-67 index and mitotic rate classify as Grade 1 (< 3%), Grade 2 (3-20%), Grade 3 (> 20%) — guides treatment and prognosis"
    ],
    management: [
      "Somatostatin analogs (first-line): octreotide LAR 20-30 mg IM q4 weeks or lanreotide 120 mg SC q4 weeks — control symptoms in 50-70% and have antiproliferative effect (PROMID, CLARINET trials)",
      "Breakthrough flushing/diarrhea: octreotide 100-500 mcg SC PRN (rescue dosing) in addition to long-acting formulation",
      "Telotristat ethyl 250 mg PO TID: tryptophan hydroxylase inhibitor — reduces serotonin production; add-on for diarrhea inadequately controlled by somatostatin analogs (TELESTAR trial)",
      "PRRT (peptide receptor radionuclide therapy): Lu-177 DOTATATE (Lutathera) for progressive, somatostatin receptor-positive NETs — significant PFS benefit (NETTER-1 trial)",
      "Hepatic-directed therapies for liver-predominant disease: hepatic artery embolization (TAE), chemoembolization (TACE), radioembolization (Y-90) — debulks liver metastases and reduces hormone secretion",
      "Cytoreductive surgery: if > 90% of tumor burden can be removed — improves symptoms and may improve survival",
      "Carcinoid heart disease: valve replacement surgery when severe (bioprosthetic valves preferred — less thrombogenic); pre-operative octreotide infusion to prevent carcinoid crisis",
      "Carcinoid crisis prevention: octreotide 250-500 mcg IV bolus then 50-200 mcg/hr infusion before any surgery, biopsy, hepatic embolization, or anesthesia (catecholamine release can trigger massive hormone release)"
    ],
    nursingActions: [
      "Symptom diary: track flushing episodes (frequency, duration, triggers), diarrhea (number of stools/day, consistency), wheezing, peripheral edema — guides treatment titration",
      "Carcinoid crisis prevention: ensure octreotide IV is ordered and available BEFORE any procedure (surgery, biopsy, embolization, even central line placement) — crisis can cause refractory hypotension and bronchospasm",
      "Somatostatin analog injection technique: teach patient/family proper IM (octreotide LAR) or deep SC (lanreotide) injection; ensure rotation of injection sites; schedule injections consistently on time (delays can cause breakthrough symptoms)",
      "Nutritional assessment: tryptophan diversion to serotonin production can cause niacin deficiency (pellagra: dermatitis, diarrhea, dementia) — monitor for pellagra-like symptoms; supplement niacin if needed",
      "Cardiac monitoring: baseline and annual echocardiogram; monitor for signs of right heart failure (peripheral edema, hepatomegaly, JVD, ascites) from carcinoid valve disease",
      "Trigger avoidance education: physical exertion, emotional stress, alcohol, catecholamine-releasing medications, and certain foods (tyramine-rich) can trigger flushing/crisis — teach patients to recognize and avoid triggers",
      "Diarrhea management: loperamide as adjunct; electrolyte monitoring; adequate hydration; assess nutritional status and weight trend",
      "Coordinate multidisciplinary care: medical oncology, interventional radiology (hepatic procedures), cardiothoracic surgery (if valve disease), nuclear medicine (PRRT), endocrinology"
    ],
    signs: {
      left: [
        "Mild intermittent flushing with < 4 stools/day controlled on somatostatin analog monotherapy",
        "Stable or declining 5-HIAA and chromogranin A levels on treatment",
        "Normal echocardiogram without evidence of carcinoid heart disease",
        "Stable disease on imaging (no tumor growth) on somatostatin analog therapy"
      ],
      right: [
        "Carcinoid crisis: severe refractory hypotension, bronchospasm, flushing during surgery/procedure — IV octreotide bolus + infusion, vasopressin (avoid catecholamines which can worsen crisis)",
        "Carcinoid heart disease with severe tricuspid regurgitation and right heart failure — surgical valve replacement needed",
        "Refractory diarrhea (> 10 stools/day) despite somatostatin analog + telotristat — significant impact on quality of life, electrolyte derangement",
        "Progressive disease on imaging despite somatostatin analogs — consider PRRT, liver-directed therapy, or systemic chemotherapy"
      ]
    },
    medications: [
      {
        name: "Octreotide LAR (Sandostatin LAR)",
        type: "Long-acting Somatostatin Analog",
        action: "Binds somatostatin receptors (SSTR2 and SSTR5) on NET cells, inhibiting hormone secretion (serotonin, tachykinins) and exerting direct antiproliferative effects through cell cycle arrest and apoptosis induction",
        sideEffects: "Cholelithiasis (gallstone formation in 25-50% due to gallbladder stasis — monitor with ultrasound), steatorrhea, hyperglycemia (inhibits insulin secretion), injection site pain/nodules, bradycardia, hypothyroidism",
        contra: "Known hypersensitivity",
        pearl: "20-30 mg IM every 4 weeks (gluteal injection — rotate sites). Start with short-acting octreotide 100 mcg SC TID × 2 weeks to assess tolerance before transitioning to LAR. Titrate LAR to symptom control (can increase to 40 mg if breakthrough symptoms). Always have short-acting octreotide available for rescue dosing. MUST be given BEFORE any procedure to prevent carcinoid crisis. Gallbladder ultrasound annually."
      },
      {
        name: "Telotristat Ethyl (Xermelo)",
        type: "Tryptophan Hydroxylase Inhibitor",
        action: "Inhibits tryptophan hydroxylase (the rate-limiting enzyme in serotonin synthesis) peripherally, reducing serotonin production by tumor cells; specifically targets the mechanism of carcinoid diarrhea",
        sideEffects: "Nausea, headache, elevated liver enzymes, depression (serotonin modulation), constipation, decreased appetite, abdominal pain",
        contra: "Severe hepatic impairment; caution with concurrent CYP3A4 substrates",
        pearl: "250 mg PO TID with food (add to ongoing somatostatin analog — not monotherapy). FDA-approved for carcinoid syndrome diarrhea inadequately controlled by somatostatin analog therapy. TELESTAR trial showed significant reduction in bowel movement frequency. Monitor LFTs at baseline, q3 months × 1 year, then periodically. Depression monitoring recommended (peripheral serotonin reduction). Does NOT cross BBB — CNS serotonin unaffected."
      }
    ],
    pearls: [
      "Carcinoid crisis is a life-threatening emergency: during surgery, biopsy, or embolization, tumor manipulation causes massive release of vasoactive substances → refractory hypotension + bronchospasm + flushing; PREVENTION is key: IV octreotide 250-500 mcg bolus before the procedure, then 50-200 mcg/hr infusion; AVOID catecholamines (epinephrine can worsen crisis) — use vasopressin if pressors needed",
      "Carcinoid heart disease affects RIGHT-sided valves because serotonin is metabolized by pulmonary MAO/endothelium before reaching the left heart — tricuspid regurgitation and pulmonic stenosis are classic; NT-proBNP and annual echocardiogram are screening tools; severe valve disease requires surgical replacement",
      "24-hour urine 5-HIAA collection requires dietary preparation: avoid bananas, avocados, plums, eggplant, tomatoes, kiwi, walnuts, pineapple, and medications (SSRIs, MAOIs, acetaminophen, caffeine) for 72 hours before collection — false positives from dietary serotonin sources are common"
    ],
    quiz: [
      {
        question: "A patient with known metastatic midgut NET and carcinoid syndrome (controlled on octreotide LAR) is scheduled for hepatic artery embolization of liver metastases. During the procedure, he develops severe flushing, BP 70/40, HR 52, and wheezing. What is the immediate management?",
        options: [
          "Administer epinephrine 0.3 mg IM for anaphylaxis and start IV fluids",
          "Administer IV octreotide 500 mcg bolus, start octreotide infusion 100-200 mcg/hr, give vasopressin for hypotension — avoid catecholamines",
          "Stop the procedure, give IV diphenhydramine 50 mg and hydrocortisone 100 mg for contrast reaction",
          "Increase octreotide LAR dose and reschedule the procedure in 4 weeks"
        ],
        correct: 1,
        rationale: "This is carcinoid crisis — massive release of vasoactive amines triggered by tumor manipulation during hepatic embolization. Management: IV octreotide 500 mcg bolus (blocks hormone receptors), octreotide infusion 100-200 mcg/hr, and vasopressin for hypotension. CRITICAL: avoid catecholamines (epinephrine, norepinephrine) as they can worsen the crisis by stimulating further hormone release from tumor cells. This distinguishes carcinoid crisis from anaphylaxis — in anaphylaxis, epinephrine is the treatment; in carcinoid crisis, it's contraindicated."
      }
    ]
  },
  "insulinoma-np": {
    title: "Insulinoma: NP Management",
    cellular: {
      title: "Insulinoma Pathophysiology",
      content: "Insulinomas are the most common functional pancreatic neuroendocrine tumors, arising from pancreatic beta cells. They autonomously secrete insulin independent of blood glucose levels, causing recurrent hypoglycemia. Normally, insulin secretion is tightly regulated: rising glucose stimulates GLUT2 transporters on beta cells → glucose metabolism generates ATP → ATP-sensitive K+ channel closure → membrane depolarization → calcium influx → insulin vesicle exocytosis. In insulinoma, this feedback is disrupted — tumor cells secrete insulin constitutively or at inappropriately low glucose thresholds. The resulting hyperinsulinemic hypoglycemia causes neuroglycopenic symptoms (confusion, behavioral changes, seizures, coma) because the brain relies almost exclusively on glucose for energy. Insulin also suppresses ketogenesis and lipolysis, so patients cannot generate ketone bodies as alternative brain fuel — distinguishing insulinoma from starvation ketosis. Most insulinomas (90%) are benign, solitary, and small (< 2 cm); 10% are malignant; 5-10% are associated with MEN1."
    },
    riskFactors: [
      "MEN1 syndrome (5-10% of insulinomas; typically multiple tumors requiring different surgical approach)",
      "Most insulinomas are sporadic with no identifiable risk factors",
      "Age 40-60 years (peak incidence)",
      "Equal sex distribution",
      "Family history of MEN1 (autosomal dominant)",
      "History of recurrent unexplained hypoglycemia, especially fasting hypoglycemia",
      "Psychiatric misdiagnosis (symptoms attributed to panic disorder, seizure disorder, or substance use)"
    ],
    diagnostics: [
      "72-hour supervised fast (gold standard diagnostic test): patient fasts under observation until symptomatic hypoglycemia occurs; draw simultaneous glucose, insulin, C-peptide, proinsulin when glucose < 55 mg/dL or symptoms develop",
      "Diagnostic criteria during fast: glucose < 55 mg/dL with inappropriately elevated insulin (≥ 3 μU/mL), C-peptide (≥ 0.6 ng/mL), and proinsulin (≥ 5.0 pmol/L); absence of sulfonylurea/meglitinide in urine/blood screen; insulin antibodies negative",
      "Whipple triad: (1) symptoms consistent with hypoglycemia, (2) documented low blood glucose, (3) resolution of symptoms with glucose administration — required before investigating cause",
      "Localization: CT/MRI abdomen (sensitivity 70-80% for tumors > 1 cm), endoscopic ultrasound (EUS — sensitivity 90-95%, can detect tumors < 5 mm; most sensitive preoperative test), somatostatin receptor scintigraphy (Ga-68 DOTATATE PET — less sensitive for insulinoma as only 50-60% express SSTR2)",
      "Selective arterial calcium stimulation test (SACST): calcium injection into splenic, gastroduodenal, SMA arteries with hepatic vein insulin sampling — localizes tumor to pancreatic region when imaging is negative",
      "Intraoperative ultrasound: identifies tumors not seen on preoperative imaging — used during surgical exploration",
      "Rule out factitious hypoglycemia: exogenous insulin (insulin elevated, C-peptide suppressed), sulfonylurea (screen positive), insulin antibodies (insulin autoimmune syndrome)",
      "MEN1 screening: calcium, PTH, prolactin, IGF-1 — if MEN1 suspected (young patient, multiple tumors, family history)"
    ],
    management: [
      "Surgical enucleation or partial pancreatectomy: curative in > 90% of benign, solitary insulinomas; laparoscopic approach for well-localized tumors",
      "Pre-operative stabilization: frequent small meals, IV dextrose infusion (D10), diazoxide 50-300 mg/day (inhibits insulin secretion via K-ATP channel activation)",
      "Diazoxide: first-line medical therapy for unresectable/metastatic insulinoma or pre-operative bridge; 50-300 mg/day in 2-3 divided doses",
      "Somatostatin analogs (octreotide): effective in ~50% of insulinomas (depends on SSTR2 expression); caution — may paradoxically worsen hypoglycemia by suppressing glucagon more than insulin in SSTR2-negative tumors",
      "Everolimus 10 mg daily: mTOR inhibitor FDA-approved for advanced pancreatic NETs; has direct anti-hypoglycemic effect (impairs insulin signaling) — useful for malignant insulinoma",
      "Malignant insulinoma: cytoreductive surgery, hepatic-directed therapies (embolization), PRRT (if SSTR-positive), streptozocin-based chemotherapy, everolimus, sunitinib",
      "Emergency hypoglycemia management: glucagon 1 mg IM/SC (patient/family should have glucagon kit); IV dextrose (D50) in ED; continuous D10 infusion for recurrent episodes",
      "MEN1-associated insulinoma: may require more extensive pancreatectomy due to multiple tumors; genetic counseling and screening of family members"
    ],
    nursingActions: [
      "Blood glucose monitoring: q1-4h during diagnostic fasting; immediately if symptomatic; document symptoms correlated with glucose level (Whipple triad)",
      "72-hour fast protocol nursing care: patient must fast completely (water only); monitor vitals q4h; draw labs when glucose < 55 or symptomatic (glucose, insulin, C-peptide, proinsulin, beta-hydroxybutyrate); have D50 at bedside; do not leave patient unattended (seizure/coma risk)",
      "Safety precautions during diagnostic fast: fall precautions, seizure precautions, continuous glucose monitoring if available, 1:1 or frequent nursing checks; orient family to call for help if patient becomes confused",
      "Pre-operative care: ensure adequate glucose levels; D10 infusion during NPO period; intraoperative blood glucose monitoring (frequent sampling — insulin drops immediately after tumor removal, causing glucose to rise)",
      "Post-operative monitoring: blood glucose q1h × 4h then q4h; expect HYPERGLYCEMIA initially (residual beta cells are suppressed from chronic hypoglycemia — may take weeks to recover); short-term insulin may be needed paradoxically",
      "Diazoxide side effect monitoring: fluid retention (weight gain, peripheral edema — add thiazide diuretic), hirsutism, nausea, hyperglycemia (therapeutic effect)",
      "Patient education: carry glucose tablets/gel at all times, wear medic alert bracelet, teach family glucagon injection technique, avoid prolonged fasting and excessive exercise",
      "Long-term follow-up: annual glucose/insulin/C-peptide levels; imaging surveillance for malignant or MEN1-associated insulinoma"
    ],
    signs: {
      left: [
        "Neuroglycopenic symptoms (confusion, personality change, visual changes) occurring during fasting or before meals — resolving immediately with glucose intake",
        "Fasting insulin/C-peptide elevated with glucose < 55 mg/dL — Whipple triad confirmed",
        "Well-localized solitary tumor on EUS — excellent surgical cure expected",
        "Post-enucleation: normoglycemia without medications"
      ],
      right: [
        "Severe hypoglycemia causing seizures or loss of consciousness — IV dextrose and glucagon",
        "Hypoglycemic unawareness from recurrent episodes (counter-regulatory hormone blunting) — increased risk of severe events",
        "Malignant insulinoma with liver metastases: persistent hypoglycemia despite surgery — requires multimodal therapy",
        "MEN1-associated multiple insulinomas: more extensive pancreatectomy needed with risk of pancreatic insufficiency"
      ]
    },
    medications: [
      {
        name: "Diazoxide (Proglycem)",
        type: "K-ATP Channel Opener / Insulin Secretion Inhibitor",
        action: "Opens ATP-sensitive potassium channels on pancreatic beta cells, maintaining membrane hyperpolarization and preventing the calcium influx required for insulin secretion; directly inhibits insulin release from both normal and tumor beta cells",
        sideEffects: "Fluid retention (edema, weight gain — often co-prescribed with thiazide diuretic), hirsutism, nausea, hyperglycemia (therapeutic in this context), hypotension",
        contra: "Functional hypoglycemia (reactive hypoglycemia — different mechanism), aortic coarctation, AV shunt (hypotension risk), pheochromocytoma (catecholamine interaction)",
        pearl: "50-300 mg/day PO in 2-3 divided doses. Effective in 50-60% of insulinoma patients. Usually co-prescribed with hydrochlorothiazide 25-50 mg to counteract fluid retention (thiazide also has mild hyperglycemic effect — synergistic). Hirsutism limits use in women. First-line medical therapy for inoperable insulinoma and pre-operative stabilization. Monitor daily weights, electrolytes (hypokalemia from thiazide), and blood glucose (may overshoot to hyperglycemia)."
      },
      {
        name: "Glucagon Emergency Kit",
        type: "Counter-regulatory Hormone",
        action: "Activates hepatic glucagon receptors, stimulating glycogenolysis and gluconeogenesis to rapidly raise blood glucose; mobilizes glycogen stores (effective only if hepatic glycogen is adequate — may be depleted in prolonged fasting or malnutrition)",
        sideEffects: "Nausea, vomiting, transient hyperglycemia, rebound hypoglycemia (in insulinoma — insulin secretion may increase in response to glucose rise)",
        contra: "Pheochromocytoma (catecholamine release), glycogen storage disease (inadequate glycogen stores), insulinoma with massive insulin production (may trigger further insulin release)",
        pearl: "1 mg IM or SC (nasal glucagon 3 mg is available for outpatient use). Onset 5-15 minutes. Patient and family MUST be trained in glucagon use for emergency hypoglycemia when patient cannot take oral glucose (unconscious, seizing). Note: in insulinoma, glucagon's glycemic effect may be blunted or transient because the glucose rise triggers additional insulin secretion from the tumor — IV dextrose is more reliable in severe cases."
      }
    ],
    pearls: [
      "The classic presentation of insulinoma is recurrent fasting hypoglycemia — symptoms typically occur in the early morning, with prolonged fasting, or after exercise; patients often learn to eat frequently to avoid symptoms, leading to weight gain (unlike most other pancreatic tumors which cause weight loss)",
      "After surgical enucleation of insulinoma, expect a period of HYPERGLYCEMIA — the remaining normal beta cells have been chronically suppressed by tumor-produced insulin and need days to weeks to recover function; some patients paradoxically require short-term insulin therapy post-operatively",
      "Endoscopic ultrasound (EUS) is the most sensitive preoperative localization tool (90-95% sensitivity for pancreatic insulinomas) — CT and MRI miss 20-30% of insulinomas because they are typically < 2 cm; if EUS is negative, selective arterial calcium stimulation test can regionalize the tumor"
    ],
    quiz: [
      {
        question: "During a supervised 72-hour fast, a 50-year-old patient develops confusion and diaphoresis at hour 18. Blood glucose is 42 mg/dL. Simultaneous labs show: insulin 18 μU/mL (elevated for this glucose), C-peptide 3.2 ng/mL (elevated), sulfonylurea screen negative. What is the most likely diagnosis?",
        options: [
          "Factitious hypoglycemia from exogenous insulin administration",
          "Insulinoma — endogenous hyperinsulinemic hypoglycemia with elevated C-peptide and negative drug screen",
          "Reactive (postprandial) hypoglycemia",
          "Adrenal insufficiency causing fasting hypoglycemia"
        ],
        correct: 1,
        rationale: "The findings demonstrate Whipple triad (symptoms + low glucose + symptom resolution with glucose) with biochemical evidence of endogenous hyperinsulinism: elevated insulin AND C-peptide (insulin and C-peptide are co-secreted from beta cells in equimolar amounts — elevated C-peptide confirms endogenous source, ruling out exogenous insulin administration which would have elevated insulin but SUPPRESSED C-peptide). Negative sulfonylurea screen excludes drug-induced hypoglycemia. This is classic insulinoma. Next steps: localization with EUS and surgical planning."
      }
    ]
  },
  "conn-syndrome-np": {
    title: "Conn Syndrome: NP Management",
    cellular: {
      title: "Aldosterone-Producing Adenoma",
      content: "Conn syndrome specifically refers to primary hyperaldosteronism caused by a unilateral aldosterone-producing adenoma (APA), which accounts for 30-40% of all primary aldosteronism cases. The adenoma autonomously produces aldosterone through constitutive expression of aldosterone synthase (CYP11B2) — the enzyme converting corticosterone to aldosterone. Recent genomic studies have identified somatic mutations in ~90% of APAs: KCNJ5 mutations (most common — 40%; alter potassium channel selectivity, depolarizing the cell and increasing calcium-dependent aldosterone synthesis), ATP1A1 and ATP2B3 mutations (Na+/K+-ATPase and Ca²+-ATPase), CACNA1D mutations (voltage-gated calcium channel), and CLCN2 mutations (chloride channel). The KCNJ5-mutant adenomas tend to be larger and more common in younger women, while ATP1A1/ATP2B3/CACNA1D mutations are associated with smaller tumors and more severe hypertension. Conn syndrome is curable with unilateral adrenalectomy, making accurate lateralization essential — distinguishing APA from bilateral adrenal hyperplasia (BAH) determines whether surgical or medical management is appropriate."
    },
    riskFactors: [
      "Same as primary hyperaldosteronism (this is a subtype)",
      "Younger age of hypertension onset suggests APA over BAH",
      "Severe hypokalemia (APA typically produces more aldosterone than BAH, causing more severe potassium depletion)",
      "Unilateral adrenal nodule on imaging with PA biochemistry confirmed",
      "KCNJ5 somatic mutation (most common in young women with larger adenomas)"
    ],
    diagnostics: [
      "Same diagnostic pathway as primary hyperaldosteronism: ARR screening → confirmatory testing → subtype differentiation",
      "CT adrenals: unilateral adenoma (typically 1-2 cm, lipid-rich); BUT CT alone insufficient for lateralization in patients > 35 (incidentalomas are common)",
      "Adrenal vein sampling: GOLD STANDARD for lateralization — confirms unilateral aldosterone source and identifies surgical candidates",
      "Lateralization index: aldosterone/cortisol ratio from adrenal veins; ratio > 4:1 indicates unilateral APA",
      "Post-adrenalectomy prediction: younger age, shorter HTN duration, fewer antihypertensive medications, positive family history of HTN → better chance of complete HTN resolution"
    ],
    management: [
      "Laparoscopic unilateral adrenalectomy: definitive treatment for APA — biochemical cure ~95%, complete HTN resolution 30-60%, HTN improvement > 90%",
      "Pre-operative preparation: spironolactone 50-100 mg daily × 4-6 weeks to normalize potassium, control BP, and assess MRA-responsiveness",
      "Post-operative monitoring: potassium q4h × 24h (hyperkalemia possible as contralateral zona glomerulosa may be transiently suppressed from chronic renin suppression); stop spironolactone, taper antihypertensives",
      "If surgery not desired/not candidate: medical management same as BAH (spironolactone or eplerenone + antihypertensives)",
      "Long-term follow-up: annual BP, electrolytes, renal function; HTN may persist if longstanding vascular remodeling"
    ],
    nursingActions: [
      "Pre-operative counseling: explain surgical expectations — aldosterone will normalize but hypertension may persist (30-60% full resolution); younger patients with shorter HTN duration have best surgical outcomes",
      "Pre-operative potassium optimization: ensure K+ > 4.0 on spironolactone before surgery; IV potassium replacement if needed",
      "Post-operative electrolyte monitoring: K+ q4-8h × 24h; watch for transient hyperkalemia (suppressed contralateral adrenal takes days-weeks to restore aldosterone production)",
      "Post-operative BP monitoring: antihypertensives may need rapid reduction; orthostatic vitals; most patients need medication adjustment within first week",
      "Discharge education: gradual antihypertensive taper guided by home BP monitoring; electrolyte recheck at 1 and 4 weeks post-op"
    ],
    signs: {
      left: [
        "Classic APA: younger patient, more severe hypokalemia, lateralized on AVS — good surgical candidate",
        "Post-adrenalectomy: normalized aldosterone and renin, improving BP, potassium normalized",
        "Progressive antihypertensive medication reduction post-surgery",
        "Complete HTN resolution off all medications (30-60% of surgical cases)"
      ],
      right: [
        "Refractory hypokalemia despite potassium supplementation and spironolactone",
        "Post-operative hyperkalemia from contralateral adrenal suppression (temporary — monitor closely)",
        "Persistent hypertension after adrenalectomy (longstanding HTN with vascular remodeling — may still need medications)",
        "AVS cannulation failure (technically difficult procedure — ~20% non-diagnostic; may need repeat)"
      ]
    },
    medications: [
      {
        name: "Spironolactone (pre-operative)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Blocks aldosterone at the MR, normalizing potassium and reducing blood pressure before adrenalectomy; also serves as a therapeutic trial — significant BP improvement on spironolactone predicts good surgical outcome",
        sideEffects: "Same as hyperaldosteronism lesson — gynecomastia, breast tenderness, hyperkalemia",
        contra: "Hyperkalemia, severe renal failure",
        pearl: "Pre-operative use for 4-6 weeks: normalizes potassium, reduces BP, allows aldosterone-mediated cardiovascular remodeling to begin reversing. If patient's BP normalizes on spironolactone alone, the probability of post-surgical HTN cure is higher. Discontinue morning of surgery. Monitor K+ closely post-op as it may rise rapidly."
      }
    ],
    pearls: [
      "Conn syndrome (APA) is CURABLE with adrenalectomy — biochemical cure rate is ~95%, and complete HTN resolution occurs in 30-60% of patients; predictors of HTN cure include younger age, shorter HTN duration (< 6 years), fewer medications, and absence of LVH",
      "Adrenal vein sampling is required to confirm lateralization in patients > 35 before adrenalectomy — CT alone misclassifies 37% of PA cases; a unilateral adenoma on CT may be a non-functioning incidentaloma with bilateral hyperplasia as the true PA source",
      "Post-adrenalectomy transient hyperkalemia occurs because chronic renin suppression has caused contralateral adrenal zona glomerulosa atrophy — aldosterone production from the remaining adrenal takes days to weeks to normalize; monitor potassium and avoid potassium supplements or potassium-sparing drugs in the early post-operative period"
    ],
    quiz: [
      {
        question: "A patient with Conn syndrome undergoes successful left laparoscopic adrenalectomy. On post-operative day 1, potassium is 5.8 mEq/L (pre-operative K+ was 3.0 on spironolactone). The patient is asymptomatic. What is the most likely explanation and management?",
        options: [
          "Post-surgical adrenal crisis — administer hydrocortisone 100 mg IV immediately",
          "Transient hyperkalemia from suppressed contralateral adrenal — stop potassium supplements, hold spironolactone, low-potassium diet, monitor closely",
          "Hemolyzed sample — repeat immediately and treat only if confirmed",
          "Renal failure from surgical complication — urgent nephrology consultation"
        ],
        correct: 1,
        rationale: "Post-adrenalectomy transient hyperkalemia is expected and results from chronic suppression of the contralateral adrenal's zona glomerulosa (renin has been suppressed by the autonomous aldosterone production). The remaining adrenal needs days to weeks to restore aldosterone production. Management: discontinue spironolactone (no longer needed — the adenoma is removed), stop potassium supplementation, low-K+ diet, and monitor. Most cases self-resolve within 1-2 weeks. The patient does NOT have adrenal crisis — unilateral adrenalectomy for APA does not cause cortisol deficiency (cortisol is produced by the zona fasciculata which is not suppressed by aldosterone excess)."
      }
    ]
  },
  "myxedema-coma-np": {
    title: "Myxedema Coma: NP Management",
    cellular: {
      title: "Myxedema Coma Pathophysiology",
      content: "Myxedema coma is the most severe, life-threatening manifestation of decompensated hypothyroidism. Severe thyroid hormone deficiency reduces cellular metabolism throughout the body: decreased Na+/K+-ATPase activity, reduced oxygen consumption, impaired thermogenesis, and slowed protein synthesis. Cardiovascular effects include bradycardia, decreased cardiac output, reduced stroke volume, and pericardial effusion (accumulation of glycosaminoglycans and fluid). Respiratory failure occurs from central hypoventilation (blunted CO2 response), respiratory muscle weakness, and pleural effusions. CNS effects include decreased cerebral blood flow, altered mental status progressing to coma, and seizures. Hypothermia results from impaired thermogenesis. Hyponatremia from impaired free water excretion (reduced GFR, increased ADH) is common and may be severe. The term 'myxedema coma' is somewhat misleading — most patients present with altered mental status rather than frank coma, and the 'myxedema' refers to the characteristic non-pitting edema from glycosaminoglycan accumulation in the dermis."
    },
    riskFactors: [
      "Elderly women with longstanding untreated or undertreated hypothyroidism",
      "Cold weather exposure (inability to thermoregulate — most common precipitant is winter season)",
      "Infection, sepsis (precipitant in 30-50%)",
      "Non-adherence to levothyroxine therapy",
      "Medications: sedatives, opioids, anesthetics, lithium, amiodarone (all can precipitate myxedema coma in hypothyroid patients)",
      "Recent surgery, trauma, or critical illness",
      "Heart failure, stroke, GI bleeding (any acute illness in severely hypothyroid patient)",
      "Prior thyroidectomy or radioactive iodine therapy without adequate replacement"
    ],
    diagnostics: [
      "TSH: markedly elevated in primary hypothyroidism (most common); low/normal in secondary (pituitary) hypothyroidism",
      "Free T4: extremely low; free T3 may also be low but T4 is more reliable in acute illness",
      "Clinical diagnosis: altered mental status + hypothermia + precipitating event in context of hypothyroidism — DO NOT delay treatment for lab confirmation",
      "ABG: respiratory acidosis (hypercapnia from hypoventilation), hypoxemia",
      "BMP: hyponatremia (common and potentially severe), hypoglycemia (reduced gluconeogenesis, concurrent adrenal insufficiency)",
      "CBC: anemia (normocytic), possible leukocytosis if infection is precipitant",
      "CK: may be markedly elevated (hypothyroid myopathy, rhabdomyolysis)",
      "Cortisol: must assess for concurrent adrenal insufficiency (autoimmune polyendocrine syndrome; also, treating with thyroid hormone without cortisol replacement in a patient with concurrent adrenal insufficiency can precipitate adrenal crisis — thyroid hormone increases cortisol metabolism)"
    ],
    management: [
      "IV levothyroxine (T4): loading dose 200-500 mcg IV, then 50-100 mcg IV daily (GI absorption is severely impaired in myxedema coma — must use IV); some protocols add IV liothyronine (T3) 5-20 mcg then 2.5-10 mcg q8h for faster onset",
      "Hydrocortisone 100 mg IV q8h: MUST administer BEFORE or concurrently with thyroid hormone — if concurrent adrenal insufficiency exists, thyroid hormone replacement increases cortisol metabolism and can precipitate adrenal crisis",
      "Passive rewarming: warm blankets, heated IV fluids, warm room — AVOID active external rewarming (causes peripheral vasodilation → cardiovascular collapse in a patient with impaired cardiac function)",
      "Supportive ventilation: intubation and mechanical ventilation for respiratory failure (common — hypoventilation + respiratory muscle weakness + pleural effusions)",
      "IV fluid: cautious NS for hypotension; avoid large-volume resuscitation (impaired cardiac function, risk of pulmonary edema); hyponatremia corrects with thyroid hormone replacement (do not correct rapidly)",
      "Treat precipitant: empiric antibiotics if infection suspected (infection is most common trigger); treat other precipitants",
      "Vasopressor support: may be needed but myxedema heart is poorly responsive to catecholamines until thyroid hormone is repleted",
      "ICU admission mandatory: mortality remains 25-60% even with treatment"
    ],
    nursingActions: [
      "Core temperature monitoring: q1h with core temperature probe (rectal or esophageal — peripheral thermometers may not register severely hypothermic temperatures below 35°C)",
      "Passive rewarming ONLY: warm blankets, bear hugger on lowest setting, warm room; do NOT use active rewarming devices or warm baths (peripheral vasodilation can cause fatal cardiovascular collapse in a decompensated myxedema heart)",
      "Cardiac monitoring: continuous telemetry — bradycardia, QT prolongation, heart block, low voltage QRS; pericardial effusion may cause muffled heart sounds; avoid atropine for bradycardia (ineffective until thyroid hormone is replaced)",
      "Respiratory monitoring: hypoventilation is common — be prepared for intubation; monitor ABGs; once intubated, use low tidal volumes (respiratory muscle weakness limits weaning efforts)",
      "Medication administration: IV levothyroxine ONLY (PO not absorbed in myxedema coma); ensure hydrocortisone is given BEFORE or WITH thyroid hormone; verify central line for vasopressors if needed",
      "Electrolyte monitoring: sodium q4-6h (hyponatremia is common and will correct with thyroid replacement — do not overcorrect); glucose monitoring (hypoglycemia risk); potassium",
      "Neurological assessment: GCS trending — mental status should improve within 24-72 hours of treatment; failure to improve suggests alternative diagnosis or inadequate treatment",
      "Skin assessment: myxedema skin is fragile and edematous — handle gently; pressure injury prevention with frequent repositioning"
    ],
    signs: {
      left: [
        "Responding to IV thyroid hormone: improving mental status, rising core temperature, normalizing HR within 24-72h",
        "Mild hypothermia (35-36°C) correcting with passive rewarming and thyroid replacement",
        "Stable hemodynamics without vasopressor requirement",
        "Hyponatremia improving as free water excretion normalizes"
      ],
      right: [
        "Refractory hypothermia below 32°C despite treatment — indicates severe metabolic shutdown (very poor prognosis)",
        "Cardiovascular collapse: severe bradycardia, hypotension unresponsive to vasopressors (catecholamine resistance without thyroid hormone)",
        "Respiratory failure requiring mechanical ventilation with difficult weaning due to respiratory muscle weakness",
        "Concurrent adrenal crisis precipitated by thyroid hormone replacement without cortisol coverage"
      ]
    },
    medications: [
      {
        name: "IV Levothyroxine (T4)",
        type: "Synthetic Thyroid Hormone",
        action: "Replaces deficient T4; converted to active T3 peripherally by deiodinases; restores cellular metabolism, thermogenesis, cardiac function, and CNS function over 24-72 hours",
        sideEffects: "Cardiac arrhythmias if loading dose is too high in elderly/cardiac patients (T4 increases myocardial oxygen demand), precipitation of adrenal crisis (if cortisol not co-administered), angina",
        contra: "Uncorrected adrenal insufficiency (MUST give hydrocortisone first), acute MI (relative — start with lower loading dose)",
        pearl: "Loading dose 200-500 mcg IV (lower dose 200 mcg for elderly/cardiac disease, higher dose 300-500 mcg for younger patients without cardiac disease); then 50-100 mcg IV daily. Must be IV — GI absorption is severely impaired in myxedema coma. Always give hydrocortisone 100 mg IV BEFORE or simultaneously. Response begins within 24 hours but full recovery takes days to weeks. Some experts add IV liothyronine (T3) 5-20 mcg for faster onset (T3 acts within hours vs. days for T4), though evidence is conflicting."
      },
      {
        name: "Hydrocortisone (for concurrent adrenal insufficiency prevention)",
        type: "Glucocorticoid",
        action: "Provides cortisol coverage during thyroid hormone replacement — thyroid hormone increases cortisol metabolism via hepatic enzyme induction; if adrenal reserve is insufficient (autoimmune polyendocrine syndrome or hypothalamic-pituitary disease), this increased metabolism can precipitate adrenal crisis",
        sideEffects: "Hyperglycemia, immunosuppression",
        contra: "None in this emergency context",
        pearl: "100 mg IV q8h starting BEFORE levothyroxine. After adrenal insufficiency is ruled out by cosyntropin stimulation test (can be done on hydrocortisone if dexamethasone is used instead — doesn't cross-react with cortisol assay), hydrocortisone can be tapered. If cosyntropin test is normal, hydrocortisone can be stopped. The association between hypothyroidism and adrenal insufficiency (autoimmune polyendocrine syndrome type 2: Addison + Hashimoto + Type 1 diabetes) makes this precaution mandatory."
      }
    ],
    pearls: [
      "Hydrocortisone MUST be given BEFORE or with thyroid hormone replacement in myxedema coma — thyroid hormone increases cortisol metabolism, and if the patient has concurrent adrenal insufficiency (autoimmune polyendocrine syndrome), adrenal crisis can be fatal; treat empirically and test for adrenal function later",
      "Avoid active external rewarming (heating blankets on high, warm baths) in myxedema coma — peripheral vasodilation in a patient with severely compromised cardiac function causes hemodynamic collapse; passive rewarming (warm blankets, warm room, warm IV fluids) is safe",
      "Myxedema coma mortality remains 25-60% even with treatment — it is an ICU emergency; delayed diagnosis and delayed treatment are the strongest predictors of poor outcome; maintain high clinical suspicion in any elderly patient presenting with hypothermia, altered mental status, and bradycardia, especially in winter"
    ],
    quiz: [
      {
        question: "An 82-year-old woman is found unresponsive at home in winter. Temperature is 33.5°C (rectal), HR 42, BP 80/50. She has facial and periorbital puffiness, dry skin, and a thyroidectomy scar. TSH is 120 mIU/L, free T4 < 0.1. The team prepares to start IV levothyroxine. What MUST be done simultaneously or before the levothyroxine?",
        options: [
          "Apply active external warming blankets to raise body temperature above 36°C before starting thyroid hormone",
          "Administer hydrocortisone 100 mg IV to prevent possible adrenal crisis from thyroid hormone replacement",
          "Perform a cosyntropin stimulation test and wait for results before giving any hormones",
          "Start norepinephrine drip to raise BP above 90 systolic before thyroid hormone"
        ],
        correct: 1,
        rationale: "Hydrocortisone MUST be given before or concurrently with levothyroxine in myxedema coma. This patient had a thyroidectomy (possible concurrent adrenal insufficiency from autoimmune polyendocrine syndrome), and thyroid hormone replacement increases cortisol metabolism — precipitating adrenal crisis if adrenal reserve is insufficient. The hydrocortisone covers this risk empirically. Do NOT wait for cosyntropin results. Active warming is contraindicated (causes vasodilation and cardiovascular collapse). Vasopressors are often ineffective until thyroid hormone is repleted."
      }
    ]
  },
  "androgen-insensitivity-np": {
    title: "Androgen Insensitivity: NP Approach",
    cellular: {
      title: "Androgen Insensitivity Pathophysiology",
      content: "Androgen insensitivity syndrome (AIS) is an X-linked recessive disorder caused by mutations in the androgen receptor (AR) gene on Xq11-12. Despite 46,XY karyotype and functioning testes producing testosterone and DHT, the target tissues cannot respond to androgens due to dysfunctional androgen receptors. In complete AIS (CAIS), phenotype is female with normal breast development (aromatization of testosterone to estrogen), absent pubic/axillary hair, blind-ending vagina, absent uterus and ovaries, and undescended testes (often inguinal). Müllerian structures are absent because anti-Müllerian hormone (AMH) from testes functions normally. In partial AIS (PAIS), variable virilization produces ambiguous genitalia. Testosterone and LH levels are elevated (lack of negative feedback from AR dysfunction), and estrogen levels are adequate for breast development (from peripheral aromatization). The undescended testes have increased malignancy risk (seminoma, gonadoblastoma) — risk is 3-5% lifetime in CAIS (higher after puberty) and up to 50% in partial forms."
    },
    riskFactors: [
      "X-linked recessive inheritance — mothers are carriers; 50% of 46,XY offspring will be affected",
      "Family history of AIS (maternal lineage transmission)",
      "Bilateral inguinal hernias in a phenotypic female infant (testes found during hernia repair — classic presentation leading to diagnosis)",
      "Primary amenorrhea in an adolescent female with normal breast development but absent pubic hair",
      "Gonadal malignancy risk: 3-5% in CAIS (usually delayed until after puberty), up to 50% in PAIS and intra-abdominal gonads"
    ],
    diagnostics: [
      "Karyotype: 46,XY in a phenotypically female individual",
      "Hormonal profile: elevated testosterone (male range), elevated LH (lack of AR-mediated negative feedback), normal/elevated AMH, low-normal estradiol (from aromatization)",
      "Androgen receptor gene sequencing: identifies AR mutation — confirms diagnosis",
      "Pelvic ultrasound/MRI: absent uterus and ovaries; may visualize inguinal or intra-abdominal testes",
      "Physical examination (CAIS): female external genitalia, normal breast development, absent or sparse pubic/axillary hair, blind-ending vagina (shortened), bilateral inguinal masses (testes) in some cases",
      "Physical examination (PAIS): variable — micropenis, hypospadias, bifid scrotum, labioscrotal fusion",
      "AMH level: elevated (functioning Sertoli cells producing AMH normally)",
      "Gonadal histology: if gonadectomy performed — assess for germ cell neoplasia in situ (GCNIS)"
    ],
    management: [
      "Gender assignment: CAIS — raised female (gender identity is consistently female in CAIS); PAIS — gender assignment requires multidisciplinary team and depends on degree of virilization",
      "Gonadectomy timing in CAIS: traditionally performed after puberty to allow natural breast development and bone mineralization from estrogen (aromatized from testosterone); recent data suggests testes can often be safely retained through puberty with surveillance",
      "Post-gonadectomy: estrogen replacement therapy (oral or transdermal) for bone health, cardiovascular protection, and well-being; standard female hormone replacement dosing",
      "Vaginal management: vaginal dilation (first-line) if penetrative intercourse desired; surgical vaginoplasty only if dilation fails",
      "PAIS: individualized management depending on gender assignment, degree of virilization, and family/patient preference",
      "Gonadal surveillance if gonads retained: annual ultrasound and tumor markers; gonadectomy recommended for PAIS and any intra-abdominal gonads (higher malignancy risk)",
      "Psychosocial support: disclosure of diagnosis (timing varies — generally in adolescence with supportive counseling), gender identity support, peer support groups (AIS-DSD support groups)",
      "Fertility counseling: CAIS patients are infertile (no uterus, no oocytes); genetic counseling for family planning (carrier testing for maternal relatives)"
    ],
    nursingActions: [
      "Sensitive communication: use the patient's identified gender and pronouns; AIS disclosure requires careful, supportive counseling preferably with psychology/gender specialist involvement",
      "Adolescent support: timing of full diagnosis disclosure is individualized — earlier age-appropriate discussions with full details as cognitive and emotional maturity develops; address questions about fertility honestly and compassionately",
      "Bone density monitoring: if gonadectomy performed, ensure estrogen replacement is adequate; DEXA scans at baseline and every 2 years; calcium and vitamin D supplementation",
      "Hormone replacement education: importance of estrogen adherence for bone health, cardiovascular protection; teach proper administration of patches or oral estrogen",
      "Psychological screening: anxiety, depression, gender distress — AIS patients benefit from specialized psychological support; connect with peer support groups (AIS-DSD support network)",
      "Gonadal surveillance: if gonads are retained, annual imaging and tumor marker monitoring; educate patient/family on signs of gonadal tumor (pelvic/inguinal mass, pain)",
      "Privacy and confidentiality: medical information about DSD conditions is sensitive — ensure proper consent for information sharing, especially in adolescents",
      "Transition care: prepare adolescent patients for adult endocrine and gynecologic care; ensure continuity of hormone replacement and surveillance"
    ],
    signs: {
      left: [
        "Typical CAIS: female phenotype, normal breast development, absent menstruation, sparse body hair — diagnosed in adolescence during amenorrhea workup",
        "Adequate estrogen replacement after gonadectomy with stable bone density and absence of menopausal symptoms",
        "Successful vaginal dilation or vaginoplasty with satisfactory sexual function",
        "Psychologically well-adjusted with appropriate support and disclosure"
      ],
      right: [
        "Gonadal malignancy: new pelvic/inguinal mass, rising tumor markers (AFP, hCG, LDH) — urgent gonadectomy and oncology referral",
        "Osteoporosis from inadequate estrogen replacement post-gonadectomy — fracture risk, DEXA T-score ≤ -2.5",
        "Psychological crisis: severe distress related to diagnosis disclosure, identity, or fertility issues — urgent psychiatric/psychology referral",
        "PAIS with gender identity discordance — requires multidisciplinary gender team involvement"
      ]
    },
    medications: [
      {
        name: "Estradiol (post-gonadectomy replacement)",
        type: "Estrogen Hormone Replacement",
        action: "Replaces estrogen that was previously produced by aromatization of testicular testosterone; maintains bone mineral density, cardiovascular protection, breast tissue maintenance, and overall well-being",
        sideEffects: "VTE risk (lower with transdermal), breast tenderness, headache, mood changes, rare hepatic effects (oral formulation)",
        contra: "Active VTE, estrogen-sensitive malignancy (breast cancer — not a typical concern in AIS patients who have 46,XY biology), active liver disease",
        pearl: "Transdermal estradiol 50-100 mcg/patch twice weekly (preferred — lower VTE risk than oral) or oral estradiol 1-2 mg daily. Start at low dose and titrate for symptom control and bone protection. No progesterone is needed (no uterus — no endometrial protection required). Monitor DEXA every 2 years, lipid panel, and general well-being. Lifelong treatment until age of natural menopause (~50 years), then shared decision-making about continuation."
      }
    ],
    pearls: [
      "Bilateral inguinal hernias in a phenotypically female infant should prompt karyotype testing — up to 1-2% of female infants with bilateral inguinal hernias have CAIS with inguinal testes; this is a classic presentation leading to early diagnosis",
      "CAIS individuals consistently identify as female — gender identity development is concordant with the female phenotype, not the 46,XY karyotype; disclosure should be handled with sensitivity and psychological support; historically, non-disclosure was practiced but modern guidelines recommend age-appropriate, staged disclosure",
      "Gonadal malignancy risk in CAIS is lower than previously estimated (3-5% lifetime rather than historical 25-30% estimates) — this has shifted practice toward delaying gonadectomy until after puberty to allow natural estrogen-dependent development, with surveillance imaging in the interim"
    ],
    quiz: [
      {
        question: "A 16-year-old phenotypic female presents with primary amenorrhea. She has normal breast development, absent pubic hair, and a blind-ending vagina on exam. Ultrasound shows absent uterus and bilateral inguinal masses. Karyotype is 46,XY. What is the most likely diagnosis?",
        options: [
          "Turner syndrome (45,X) with streak gonads",
          "Complete androgen insensitivity syndrome with inguinal testes",
          "Müllerian agenesis (Mayer-Rokitansky-Küster-Hauser syndrome) with 46,XX karyotype",
          "Congenital adrenal hyperplasia with virilization"
        ],
        correct: 1,
        rationale: "The combination of female phenotype, 46,XY karyotype, normal breast development, absent pubic hair, absent uterus (AMH from testes caused Müllerian regression), and bilateral inguinal masses (testes) is pathognomonic for complete androgen insensitivity syndrome (CAIS). Turner syndrome has 45,X karyotype. MRKH has 46,XX karyotype with normal secondary sexual characteristics including pubic hair. CAH causes virilization, not feminization. The absent pubic hair (androgen-dependent) with normal breast development (estrogen from aromatization) is the key distinguishing feature."
      }
    ]
  },
  "dka-management-np": {
    title: "DKA Management: NP Approach",
    cellular: {
      title: "DKA Metabolic Pathophysiology",
      content: "Diabetic ketoacidosis (DKA) results from absolute or relative insulin deficiency combined with counter-regulatory hormone excess (glucagon, cortisol, catecholamines, GH). Without insulin, glucose cannot enter cells, triggering hepatic gluconeogenesis and glycogenolysis (causing severe hyperglycemia) and unregulated lipolysis (releasing free fatty acids from adipose tissue). In the liver, fatty acids undergo beta-oxidation to acetyl-CoA, which is converted to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone) by ketogenesis — a process driven by glucagon excess and insulin deficiency. Ketone bodies are strong organic acids that consume bicarbonate buffers, causing high anion gap metabolic acidosis (AG = Na - Cl - HCO3; normal 8-12; DKA typically > 20). Hyperglycemia causes osmotic diuresis (glycosuria pulls water and electrolytes), leading to profound dehydration (average 5-9 L deficit), total body potassium depletion (despite possible initial hyperkalemia from transcellular shift due to acidosis and insulin deficiency), and electrolyte derangement. Cerebral edema is the most feared complication in children, occurring in 0.5-1% of pediatric DKA cases."
    },
    riskFactors: [
      "Type 1 diabetes (most common; DKA may be the initial presentation in 20-30%)",
      "Type 2 diabetes (increasingly recognized; DKA can occur, especially in African American and Hispanic patients with 'ketosis-prone' Type 2 DM)",
      "Insulin omission or pump failure (most common precipitant in known diabetics)",
      "Infection (second most common precipitant — UTI, pneumonia, sepsis; activates counter-regulatory hormones)",
      "New-onset Type 1 diabetes (no endogenous insulin production)",
      "SGLT2 inhibitor use (euglycemic DKA — glucose may be < 250 mg/dL but ketoacidosis is present)",
      "Substance use: cocaine, alcohol",
      "Medications: corticosteroids, atypical antipsychotics (olanzapine, clozapine)"
    ],
    diagnostics: [
      "DKA diagnostic criteria: blood glucose > 250 mg/dL (unless euglycemic DKA), pH < 7.30, bicarbonate < 18 mEq/L, anion gap > 12, positive serum/urine ketones",
      "Classification: mild (pH 7.25-7.30, HCO3 15-18), moderate (pH 7.0-7.24, HCO3 10-14), severe (pH < 7.0, HCO3 < 10)",
      "BMP: hyperglycemia, hyponatremia (dilutional + osmotic shift — correct sodium: add 1.6 mEq/L for each 100 mg/dL glucose > 100), potassium (may be high/normal/low despite total body depletion), elevated BUN/creatinine (prerenal), low bicarbonate, elevated anion gap",
      "Beta-hydroxybutyrate (serum): preferred over urine ketones (more sensitive, not affected by dehydration); > 3.0 mmol/L in DKA",
      "ABG/VBG: metabolic acidosis with respiratory compensation (Kussmaul breathing — deep, rapid respirations to blow off CO2)",
      "CBC: leukocytosis (stress response — does not necessarily indicate infection; bands > 10% more suggestive of infection)",
      "Serum osmolality: usually 300-320 mOsm/kg (> 320 suggests concurrent HHS)",
      "ECG: assess for hyper/hypokalemia changes; continuous telemetry during potassium replacement"
    ],
    management: [
      "IV fluid resuscitation: NS 15-20 mL/kg/hr for first 1-2 hours (1-2 L), then 250-500 mL/hr; switch to 0.45% NS once sodium normalizes or remains elevated; add D5 when glucose < 200 mg/dL",
      "Insulin infusion: regular insulin 0.1-0.14 units/kg/hr continuous IV (no bolus per current ADA guidelines); target glucose decrease 50-70 mg/dL per hour; when glucose < 200, reduce rate to 0.02-0.05 units/kg/hr and add D5 to fluids",
      "Potassium replacement: if K+ < 3.3 → hold insulin and replace potassium first (20-40 mEq/hr); if K+ 3.3-5.3 → add 20-40 mEq KCl/L to each liter of IV fluids; if K+ > 5.3 → hold potassium, recheck in 2 hours; goal K+ 4-5 mEq/L",
      "Bicarbonate: ONLY if pH < 6.9 (100 mEq NaHCO3 in 400 mL sterile water with 20 mEq KCl over 2 hours); routine bicarbonate is NOT recommended (worsens intracellular acidosis, causes paradoxical CNS acidosis, shifts K+ into cells)",
      "Phosphate: replace if < 1.0 mg/dL or if cardiac/respiratory dysfunction; 20-30 mEq potassium phosphate in place of some KCl",
      "DKA resolution criteria: glucose < 200 mg/dL + ≥ 2 of: pH > 7.3, bicarbonate ≥ 15, anion gap ≤ 12",
      "Transition to subcutaneous insulin: overlap IV insulin for 1-2 hours with SC insulin to prevent rebound hyperglycemia/ketosis (IV insulin has 5-minute half-life)",
      "Identify and treat precipitant: infection workup (cultures, CXR), medication review, insulin pump assessment, adherence evaluation"
    ],
    nursingActions: [
      "Blood glucose monitoring q1h during insulin infusion; beta-hydroxybutyrate q2-4h; BMP q2-4h until stable; ABG/VBG as needed for pH trending",
      "Potassium monitoring: q1-2h initially (K+ shifts rapidly with insulin and fluid therapy); continuous telemetry (cardiac arrhythmias from hypo/hyperkalemia); NEVER start insulin if K+ < 3.3 — life-threatening arrhythmia risk",
      "Fluid balance: strict I&O hourly; assess for fluid overload (crackles, JVD) especially in elderly, cardiac, or renal patients; urine output target > 0.5 mL/kg/hr",
      "Neurological assessment (especially pediatric patients): headache, vomiting, altered mental status, Cushing response (HTN + bradycardia) — signs of cerebral edema; if suspected: mannitol 0.5-1 g/kg IV + HOB elevation + reduce fluid rate + emergent CT",
      "Insulin infusion management: dedicate separate IV line for insulin drip; flush new tubing with insulin solution before connecting (insulin adsorbs to tubing); never disconnect — if glucose drops below target, add dextrose to fluids rather than stopping insulin (need insulin to resolve ketosis)",
      "Assess for DKA resolution: glucose < 200, pH > 7.3, HCO3 ≥ 15, AG ≤ 12; coordinate SC insulin transition with provider — overlap SC insulin × 1-2 hours before stopping drip",
      "Precipitant investigation: obtain blood and urine cultures, CXR; assess insulin pump sites for occlusion/infection; medication reconciliation; screen for new diabetes if first presentation",
      "Patient education before discharge: DKA prevention (sick-day rules, when to check ketones, when to seek emergency care, insulin pump troubleshooting), importance of never omitting basal insulin even when not eating"
    ],
    signs: {
      left: [
        "Mild DKA (pH 7.25-7.30): alert, mild dehydration, able to tolerate oral fluids, stable hemodynamics",
        "Responding to treatment: glucose declining 50-70 mg/dL/hr, improving pH and bicarbonate, clearing anion gap, adequate urine output",
        "DKA resolving: pH > 7.3, HCO3 ≥ 15, AG ≤ 12, glucose < 200 — ready for SC insulin transition",
        "Potassium stable 4-5 mEq/L with appropriate replacement"
      ],
      right: [
        "Severe DKA (pH < 7.0): altered mental status, severe dehydration, Kussmaul breathing, hemodynamic instability",
        "Hypokalemia (K+ < 3.3) — must replace BEFORE starting insulin (cardiac arrest risk)",
        "Cerebral edema (pediatric): sudden deterioration, headache, vomiting, posturing — emergent mannitol and neurosurgical consultation",
        "Refractory DKA: failure to resolve after 12-24 hours — reassess insulin dosing, check for occult infection (abscess, osteomyelitis), insulin resistance, or concurrent HHS"
      ]
    },
    medications: [
      {
        name: "Regular Insulin (IV infusion)",
        type: "Short-acting Insulin",
        action: "Binds insulin receptors, facilitating glucose uptake into cells, suppressing hepatic gluconeogenesis and glycogenolysis, and critically — suppressing lipolysis and ketogenesis (stopping the production of ketone bodies that cause the acidosis)",
        sideEffects: "Hypoglycemia (most common — monitor q1h), hypokalemia (insulin drives K+ into cells — monitor q1-2h and replace aggressively), hypophosphatemia",
        contra: "Hypokalemia < 3.3 mEq/L (must correct first — insulin will worsen hypokalemia and can cause cardiac arrest)",
        pearl: "0.1-0.14 units/kg/hr IV continuous (no bolus per 2024 ADA guidelines). Goal: glucose decrease 50-70 mg/dL/hr. When glucose < 200: reduce rate to 0.02-0.05 units/kg/hr AND add D5 to IV fluids — DO NOT stop insulin drip (need insulin to resolve ketosis, not just hyperglycemia). Transition to SC insulin when DKA resolved AND patient eating: give SC basal and bolus insulin, overlap IV drip × 1-2 hours, then disconnect. IV insulin half-life is only 5 minutes — stopping without overlap causes rapid return of hyperglycemia and ketosis."
      },
      {
        name: "Potassium Chloride (IV replacement)",
        type: "Electrolyte Replacement",
        action: "Replaces total body potassium deficit (average 3-5 mEq/kg in DKA); insulin therapy drives potassium intracellularly, and correction of acidosis shifts K+ into cells — without replacement, severe hypokalemia causing cardiac arrhythmias will develop",
        sideEffects: "Hyperkalemia (if over-replaced or renal function impaired — monitor closely), cardiac arrhythmias, phlebitis (concentrated IV solutions require central line)",
        contra: "Hyperkalemia > 5.3 mEq/L (hold replacement and recheck in 2h), oliguria/anuria without central monitoring",
        pearl: "Add 20-40 mEq/L to each liter of IV fluids. If K+ < 3.3: HOLD INSULIN and replace K+ at 20-40 mEq/hr with telemetry monitoring until K+ > 3.3, THEN start insulin. If K+ 3.3-5.3: add 20-40 mEq/L to fluids. Check q1-2h initially. Despite potentially elevated serum K+ on presentation (acidosis shifts K+ extracellularly), total body K+ is profoundly depleted (urinary losses from osmotic diuresis). Some K+ can be given as potassium phosphate (replaces both K+ and PO4)."
      }
    ],
    pearls: [
      "NEVER start insulin if potassium is < 3.3 mEq/L — insulin drives potassium intracellularly, and starting insulin with critically low potassium can cause fatal cardiac arrhythmia; replace potassium FIRST, then start insulin",
      "Do NOT stop the insulin drip when glucose reaches 200 mg/dL — insulin is needed to resolve ketoacidosis, not just hyperglycemia; instead, REDUCE the rate and ADD dextrose to IV fluids; DKA resolution is defined by pH and anion gap normalization, not by glucose alone",
      "The transition from IV to SC insulin is a critical moment: overlap for 1-2 hours (give SC basal + mealtime insulin while continuing the drip for 1-2h); IV insulin has a 5-minute half-life, so stopping without overlap causes rapid hyperglycemia and ketosis rebound — this is the most common cause of DKA recurrence during hospitalization"
    ],
    quiz: [
      {
        question: "A patient with DKA has been on insulin drip for 6 hours. Current glucose is 180 mg/dL (was 450 at admission). pH is 7.18, bicarbonate 12, anion gap 22. Potassium is 3.8. The resident asks to stop the insulin drip since glucose is near target. What is the most appropriate response?",
        options: [
          "Agree to stop the insulin drip — glucose is below 200 mg/dL",
          "Reduce insulin drip rate and add D5 to IV fluids — DKA is NOT resolved (pH < 7.30, AG still elevated); insulin must continue to clear ketosis",
          "Convert to subcutaneous insulin and start the patient on clear liquid diet",
          "Increase insulin drip rate — the pH is still severely acidotic and needs faster correction"
        ],
        correct: 1,
        rationale: "The insulin drip must NOT be stopped — DKA is defined by acidosis and ketosis, not hyperglycemia. This patient's pH (7.18), bicarbonate (12), and anion gap (22) indicate ongoing severe DKA. The glucose has come down but ketoacidosis persists. The correct action is to REDUCE the insulin rate (0.02-0.05 units/kg/hr) and ADD D5 to the IV fluids to prevent hypoglycemia while continuing to suppress ketogenesis. DKA is resolved when pH > 7.3, HCO3 ≥ 15, AND AG ≤ 12."
      }
    ]
  },
  "diabetes-pregnancy-np": {
    title: "Diabetes in Pregnancy: NP Mgmt",
    cellular: {
      title: "Diabetes in Pregnancy Pathophysiology",
      content: "Pregnancy is inherently a state of progressive insulin resistance. Placental hormones — human placental lactogen (hPL), progesterone, cortisol, prolactin, and TNF-alpha — antagonize insulin action at the post-receptor level (impair GLUT4 translocation, reduce insulin receptor substrate-1 phosphorylation). This physiological insulin resistance ensures glucose availability for the developing fetus, who depends on maternal glucose transport via GLUT1 across the placenta (insulin does NOT cross the placenta). In normal pregnancy, pancreatic beta-cell mass increases 2-3 fold to compensate. Gestational diabetes mellitus (GDM) occurs when maternal beta cells cannot compensate for the progressive insulin resistance (inadequate beta-cell reserve — often indicating underlying predisposition to Type 2 DM). Pre-existing diabetes (Type 1 or Type 2) in pregnancy poses additional risks: first-trimester hyperglycemia is teratogenic (cardiac defects, neural tube defects — risk proportional to HbA1c), and sustained hyperglycemia causes fetal hyperinsulinemia → macrosomia, organomegaly, neonatal hypoglycemia, and delayed surfactant production (increased RDS risk)."
    },
    riskFactors: [
      "Pre-existing Type 1 or Type 2 diabetes (risks highest with poor periconception glucose control — HbA1c > 8% associated with 15-20% major malformation rate)",
      "GDM risk factors: BMI > 30, age > 35, family history of T2DM, prior GDM, prior macrosomic infant (> 4000 g), PCOS, high-risk ethnicity (South Asian, African, Hispanic, Indigenous)",
      "Previous stillbirth or congenital anomaly (may indicate undiagnosed diabetes)",
      "Multiple gestation (higher insulin resistance)",
      "Corticosteroid use (e.g., betamethasone for fetal lung maturity — causes acute hyperglycemia)",
      "Excess gestational weight gain",
      "History of glucose intolerance or prediabetes prior to pregnancy"
    ],
    diagnostics: [
      "GDM screening: 75 g OGTT at 24-28 weeks (IADPSG/CDA criteria: fasting ≥ 5.1 mmol/L, 1h ≥ 10.0, 2h ≥ 8.5 — one abnormal value = GDM); or 50 g GCT screen → 100 g OGTT if positive (Carpenter-Coustan or NDDG criteria — two abnormal values needed)",
      "Early screening (first trimester): indicated for high-risk patients; fasting glucose, HbA1c, or early OGTT",
      "Pre-existing DM monitoring: HbA1c monthly during pregnancy (target < 6.5% without significant hypoglycemia); self-monitored blood glucose (SMBG) fasting and 1h or 2h postprandial at each meal",
      "Glucose targets: fasting < 5.3 mmol/L (95 mg/dL), 1h postprandial < 7.8 mmol/L (140 mg/dL), 2h postprandial < 6.7 mmol/L (120 mg/dL)",
      "CGM (continuous glucose monitoring): increasingly used in pregnancy — time-in-range 63-140 mg/dL target > 70%; improves neonatal outcomes (CONCEPTT trial in T1DM)",
      "Fetal surveillance: anatomy ultrasound at 18-20 weeks (screen for congenital anomalies), growth ultrasound q4 weeks from 28 weeks (assess for macrosomia/IUGR), fetal echocardiogram if HbA1c > 6.5% in first trimester",
      "Non-stress testing (NST) and biophysical profile (BPP): starting 32-36 weeks depending on glucose control and risk level",
      "Urine albumin/creatinine ratio: screen for diabetic nephropathy each trimester"
    ],
    management: [
      "Pre-conception counseling: optimize HbA1c to < 6.5% before conception (ideally < 6.0%); folic acid 5 mg daily (higher dose in DM); discontinue teratogenic medications (ACEi, ARB, statins); switch to insulin if on oral hypoglycemics (except metformin — can be continued in T2DM and GDM)",
      "Medical nutrition therapy: 1800-2500 kcal/day (individualized); carbohydrate counting/distribution across 3 meals and 2-3 snacks; avoid concentrated sweets; complex carbohydrates preferred",
      "Insulin therapy for GDM: indicated when glucose targets not met despite 1-2 weeks of dietary management; NPH and rapid-acting analogs (lispro, aspart) are preferred; avoid glargine U-300 in pregnancy (limited data)",
      "Insulin for pre-existing DM: intensified basal-bolus regimen; insulin requirements increase 50-100% through pregnancy (especially third trimester); requirements drop precipitously immediately postpartum",
      "Metformin in pregnancy: acceptable for GDM and T2DM when insulin not feasible or as adjunct; crosses placenta (long-term neonatal effects under study); glyburide no longer recommended (inferior outcomes vs. insulin and metformin)",
      "Intrapartum glucose management: target glucose 70-110 mg/dL during labor; insulin-glucose infusion protocol; hypoglycemia prevention in mother",
      "Delivery timing: well-controlled GDM on diet — await spontaneous labor up to 40+6 weeks; GDM on insulin or poorly controlled — induction at 38-39 weeks; pre-existing DM — 37-39 weeks based on control and complications; cesarean section recommended if EFW > 4500 g (DM) or > 5000 g (non-DM)",
      "Postpartum: insulin requirements drop 50% immediately after delivery (placental hormones clear within hours); breastfeeding recommended (reduces future T2DM risk); screen for persistent DM at 6-12 weeks postpartum with 75 g OGTT"
    ],
    nursingActions: [
      "SMBG training: teach 4-7 point glucose monitoring (fasting, pre- and post-prandial); target fasting < 95, 1h post < 140, 2h post < 120 mg/dL; maintain glucose log for provider review",
      "Insulin injection technique: proper SC injection sites (abdomen — absorption changes in pregnancy due to stretching; thighs and arms also acceptable), rotation, needle length selection, timing relative to meals",
      "Hypoglycemia education: recognize symptoms (tremor, diaphoresis, confusion), treat with 15 g fast-acting carbohydrate, recheck in 15 minutes (15-15 rule); glucagon kit teaching for partner/family; hypoglycemia risk is highest in first trimester (morning sickness, nausea reducing intake)",
      "Dietary counseling: collaborate with dietitian for meal planning; carbohydrate counting, portion sizes, glycemic index awareness; bedtime snack with protein/fat to prevent overnight hypoglycemia",
      "Fetal monitoring coordination: schedule anatomy scan, growth ultrasounds, NSTs; educate on kick count monitoring (daily after 28 weeks); report decreased fetal movement immediately",
      "Intrapartum nursing: blood glucose q1h during active labor; IV insulin protocol management; D5 NS available for hypoglycemia; neonatal team at delivery for glucose monitoring",
      "Postpartum monitoring: frequent glucose checks (insulin needs drop 50% immediately); adjust/discontinue insulin for GDM; encourage breastfeeding (lowers glucose, facilitates weight loss); schedule 6-12 week OGTT for GDM patients",
      "Long-term counseling: GDM has 50% risk of developing T2DM within 5-10 years; annual diabetes screening recommended; preconception planning for future pregnancies"
    ],
    signs: {
      left: [
        "Well-controlled GDM on diet: glucose targets consistently met, appropriate fetal growth, no polyhydramnios",
        "Pre-existing DM with HbA1c < 6.5%, normal fetal anatomy, and appropriate growth trajectory",
        "Mild GDM responding to metformin with glucose targets achieved and fetal growth normal",
        "Normal fetal surveillance (NST reactive, BPP 8/8, no macrosomia)"
      ],
      right: [
        "Poorly controlled diabetes with fetal macrosomia (EFW > 4500 g) — increased shoulder dystocia risk; consider cesarean delivery",
        "Pre-existing DM with first-trimester HbA1c > 10%: high risk of major congenital anomalies (15-20%); fetal echocardiogram and detailed anatomy scan critical",
        "DKA in pregnancy: medical emergency (fetal mortality 10-30% in DKA); aggressive insulin and fluid management; continuous fetal monitoring",
        "Preeclampsia superimposed on diabetic nephropathy — accelerated renal decline, severe maternal/fetal risk"
      ]
    },
    medications: [
      {
        name: "Insulin Aspart (NovoRapid) / Insulin Lispro (Humalog)",
        type: "Rapid-acting Insulin Analog",
        action: "Modified insulin molecules with faster absorption and shorter duration than regular human insulin; better postprandial glucose control; extensive safety data in pregnancy (both FDA category B; no increased teratogenicity in large studies)",
        sideEffects: "Hypoglycemia (especially first trimester with nausea/vomiting reducing intake), injection site reactions, weight gain",
        contra: "Hypoglycemia; known hypersensitivity",
        pearl: "Inject 5-15 minutes before meals for optimal postprandial coverage. Dose increases significantly through pregnancy: first trimester 0.7 units/kg/day, second trimester 0.8 units/kg/day, third trimester 0.9-1.2 units/kg/day. Post-delivery: immediately reduce total daily dose by ~50% (placental hormone clearance restores insulin sensitivity within hours). For insulin pumps: rapid-acting analog only, adjust basal rates and bolus ratios each trimester."
      },
      {
        name: "NPH Insulin (Humulin N)",
        type: "Intermediate-acting Insulin",
        action: "Protamine-complexed human insulin with intermediate duration (12-16 hours); provides basal insulin coverage; longest safety track record in pregnancy of all basal insulins",
        sideEffects: "Hypoglycemia (especially nocturnal with evening dose — peak action 4-8 hours), weight gain",
        contra: "Hypoglycemia; known hypersensitivity",
        pearl: "Longest pregnancy safety record of all basal insulins. Usually given BID (morning and bedtime). Bedtime dose adjusted to control fasting glucose. Peak action at 4-8 hours means bedtime NPH can cause 2-3 AM hypoglycemia — bedtime snack with protein/fat is recommended. Insulin glargine U-100 (Lantus) and detemir (Levemir) also have good pregnancy safety data and may provide more stable basal coverage with less nocturnal hypoglycemia."
      }
    ],
    pearls: [
      "First-trimester hyperglycemia is teratogenic — the risk of major congenital anomalies is directly proportional to HbA1c at conception: < 7% = ~3% risk (near baseline), 8-9% = 10%, > 10% = 20-25%; pre-conception optimization is the single most important intervention for women with pre-existing diabetes",
      "Insulin requirements drop by ~50% within hours of placental delivery — failure to reduce insulin dose causes severe maternal hypoglycemia postpartum; this rapid change is because placental hormones (hPL, progesterone) that drove insulin resistance are cleared within hours of delivery",
      "GDM is a risk marker for future Type 2 DM: 50% of women with GDM develop T2DM within 5-10 years; annual screening (fasting glucose or HbA1c) and lifestyle modification counseling are essential long-term interventions after GDM diagnosis"
    ],
    quiz: [
      {
        question: "A woman with Type 1 DM and HbA1c 8.2% is 8 weeks pregnant (unplanned pregnancy). She is currently on insulin glargine and insulin aspart with a pump. She is anxious about fetal risks. What is the most important information to communicate, and what should be done?",
        options: [
          "Reassure her that HbA1c 8.2% poses no significant fetal risk and continue current management",
          "Counsel that HbA1c 8.2% at conception carries an increased risk (~10%) of major congenital anomalies; optimize glucose control immediately, order fetal echocardiogram and detailed anatomy scan, increase folic acid to 5 mg daily",
          "Recommend pregnancy termination due to high teratogenic risk",
          "Switch from insulin pump to NPH/regular insulin injections as pumps are contraindicated in pregnancy"
        ],
        correct: 1,
        rationale: "HbA1c 8.2% at conception carries approximately 10% risk of major congenital anomalies (vs. 3% at HbA1c < 7%). The critical period for organogenesis is weeks 3-8 — this patient is at 8 weeks, so the window of highest teratogenic risk is already passing. Immediate actions: intensify glucose management targeting HbA1c < 6.5%, order fetal echocardiogram (cardiac defects most common — VSD, TGA), detailed anatomy scan at 18-20 weeks, and increase folic acid to 5 mg daily. Insulin pumps are NOT contraindicated in pregnancy — they offer excellent glucose control. While risk is elevated, most pregnancies with HbA1c 8-9% result in healthy infants."
      }
    ]
  },
  "diabetes-technology-np": {
    title: "Diabetes Technology: NP Approach",
    cellular: {
      title: "CGM and Insulin Pump Technology",
      content: "Modern diabetes technology encompasses continuous glucose monitoring (CGM), insulin pump therapy (CSII), and automated insulin delivery (AID) systems. CGM sensors measure interstitial glucose via an enzymatic reaction: glucose oxidase on the sensor filament converts glucose to gluconic acid, generating an electrical current proportional to glucose concentration. The interstitial fluid glucose lags behind blood glucose by 5-15 minutes (physiological lag from glucose diffusion across capillary walls into interstitial space). CGM provides glucose values every 1-5 minutes, trend arrows indicating rate/direction of change, and time-in-range (TIR) analysis — the percentage of time glucose is between 70-180 mg/dL (target > 70% for most adults). Insulin pumps deliver rapid-acting insulin subcutaneously at programmed basal rates (mimicking pancreatic basal secretion) and patient-initiated boluses for meals and corrections. AID systems (hybrid closed-loop) combine CGM data with algorithmic pump control: the algorithm adjusts basal insulin delivery every 5 minutes based on CGM readings, automatically increasing delivery when glucose is rising and suspending/reducing when glucose is falling — significantly improving TIR and reducing hypoglycemia."
    },
    riskFactors: [
      "Technology-related DKA risk: insulin pump failure (occlusion, battery, reservoir empty, site dislodgement) causes rapid DKA in Type 1 (no basal insulin depot; DKA develops within 4-6 hours of pump stoppage)",
      "Skin reactions: adhesive allergies, infection at insertion sites, lipodystrophy from repeated site use",
      "Sensor inaccuracy: interference from acetaminophen (older sensors), vitamin C, dehydration, compression (lying on sensor), and first 12-24 hours of sensor warmup",
      "Technology burden and burnout: alarm fatigue, body image concerns (visible devices), device management burden",
      "Cost and access barriers: CGM and pump supplies can be expensive; insurance coverage varies",
      "Inappropriate reliance on technology: patients may neglect fingerstick verification in critical situations (very high/low readings, rapid change, symptoms not matching CGM)"
    ],
    diagnostics: [
      "Ambulatory glucose profile (AGP): standardized CGM data report showing time-in-range, glucose variability, median glucose curve, and high/low patterns over 14 days",
      "Key CGM metrics: TIR 70-180 mg/dL (target > 70%), time below range < 70 (target < 4%), time below 54 (target < 1%), time above 180 (target < 25%), time above 250 (target < 5%), GMI (glucose management indicator — estimated HbA1c from CGM), coefficient of variation (CV — target < 36%)",
      "HbA1c: still valuable — correlates with long-term complications; discordance between HbA1c and GMI may indicate hemoglobin variants, anemia, or significant glycemic variability",
      "Pump data download: basal rates, bolus history, total daily dose, carbohydrate ratios, correction factors, site change frequency",
      "AID system reports: algorithm adjustments, time in automated mode, manual overrides, sensor-pump connectivity gaps",
      "Skin assessment: insertion sites for infection (erythema, warmth, discharge), lipodystrophy, adhesive dermatitis"
    ],
    management: [
      "CGM initiation: education on sensor insertion, calibration requirements (varies by device), trend arrow interpretation, alarm settings, and when to verify with fingerstick (symptoms not matching, rapid rate of change, critical decisions)",
      "Insulin pump management: individualize basal rates (typically 40-50% of TDD), insulin-to-carbohydrate ratios, correction/sensitivity factors; teach site rotation, infusion set changes every 2-3 days",
      "AID system optimization: adjust target glucose settings, meal announcement strategies, exercise mode utilization; ensure patient understands system limitations (still requires carb counting and meal bolusing in most systems)",
      "Pump failure/DKA prevention: teach patients to ALWAYS carry backup supplies (rapid-acting insulin pen, syringes, glucose meter); if glucose > 250 with ketones, switch to injection therapy and change infusion set — do NOT bolus through potentially occluded tubing",
      "Technology troubleshooting: sensor errors (remove and replace), pump occlusion alarms (change site and tubing), adhesive issues (barrier products, overpatch tapes)",
      "Periodic technology assessment: review CGM/pump data at each visit; pattern recognition for basal rate adjustments, ratio changes; assess device satisfaction and technology burden",
      "Hybrid closed-loop systems: Medtronic 780G, Tandem Control-IQ, Omnipod 5, CamAPS FX — each has different algorithm approach; match system to patient lifestyle and preference",
      "DIY systems (Loop, OpenAPS, AndroidAPS): growing community; NPs should be aware these exist and provide safe monitoring even if not officially endorsed"
    ],
    nursingActions: [
      "CGM education: proper sensor insertion technique (site selection — abdomen, upper arm), calibration if required, warmup period, trend arrow meaning (each arrow ≈ 1-2 mg/dL/min change), setting appropriate alarms (avoid alarm fatigue — start with wider ranges and narrow over time)",
      "Time-in-range counseling: explain TIR concept — every 5% TIR improvement corresponds to ~0.5% HbA1c reduction and meaningful complication risk reduction; help patients set achievable goals",
      "Pump site management: inspect sites at each visit for lipodystrophy, infection, scarring; teach rotation patterns; site changes every 2-3 days (steel needle sets can stay 2 days, flexible cannula 3 days maximum)",
      "Emergency preparedness: ensure patient ALWAYS carries: rapid-acting insulin pen, syringes, glucose meter and strips, ketone strips, fast-acting glucose; written 'pump failure' protocol with injection doses calculated",
      "Data review: download and review CGM/pump data at each visit; identify patterns (dawn phenomenon, post-meal spikes, nocturnal hypoglycemia); adjust therapy collaboratively with patient",
      "Technology burden assessment: screen for device fatigue, alarm burnout, body image concerns; offer 'technology breaks' when appropriate (temporary switch to MDI with CGM); validate emotional challenges of 24/7 disease management",
      "Inpatient pump management: if patient is alert and competent, allow self-management of pump and CGM (hospital policy permitting); document TDD for IV insulin conversion if pump must be discontinued; fingerstick verification of CGM required per most hospital policies",
      "Insurance and access support: assist with prior authorization documentation; connect with manufacturer patient assistance programs; advocate for coverage of CGM and pump supplies"
    ],
    signs: {
      left: [
        "TIR > 70% with < 4% time below 70 mg/dL and CV < 36% — excellent glucose management",
        "Stable CGM use with appropriate alarm response and verified fingerstick practice when needed",
        "Successful AID system use with > 80% time in automated mode and improved TIR vs. prior management",
        "Good site rotation with healthy skin integrity at insertion sites"
      ],
      right: [
        "Pump site infection: erythema, warmth, discharge, fever — remove site immediately, treat with antibiotics, switch to injections until healed",
        "Unexplained hyperglycemia > 250 with ketones on pump therapy — presume site/pump failure until proven otherwise; treat with injection, change site, inspect for occlusion",
        "Severe hypoglycemia from AID system over-delivery — assess for system malfunction, medication/alcohol interaction, or algorithm settings",
        "Technology burnout: patient removing CGM/pump frequently, ignoring alarms, declining appointment — assess mental health, consider treatment simplification"
      ]
    },
    medications: [
      {
        name: "Insulin Aspart (in pump therapy)",
        type: "Rapid-acting Insulin Analog (pump-compatible)",
        action: "Used exclusively in insulin pumps for both continuous basal delivery and bolus dosing; rapid absorption profile allows precise glucose management when combined with CGM feedback in AID systems",
        sideEffects: "Hypoglycemia, site reactions, lipodystrophy with repeated site use, insulin stacking (multiple correction boluses before first bolus has peaked)",
        contra: "Known hypersensitivity; not for IV use from pump cartridge",
        pearl: "Insulin aspart, lispro, and faster-acting insulin aspart (Fiasp) are all pump-compatible. Fiasp has ~5-minute faster onset which may reduce post-meal spikes but has higher infusion site reaction rates. Pump cartridge/reservoir should be changed every 2-3 days (insulin degrades at body temperature). AID systems require sensor-pump communication — if sensor signal is lost for > 20 minutes, most systems revert to pre-programmed basal rates (open loop)."
      }
    ],
    pearls: [
      "Every 5% increase in time-in-range (70-180 mg/dL) corresponds to approximately 0.5% reduction in HbA1c — making TIR a clinically meaningful metric; even moving from 50% to 55% TIR provides significant complication risk reduction",
      "Pump therapy DKA risk: patients on insulin pumps develop DKA faster than those on injections (4-6 hours after pump stoppage vs. 12-24 hours after missing long-acting insulin) because there is no basal insulin depot — pump patients MUST carry backup injection supplies and know their injection doses at all times",
      "CGM trend arrows are the most actionable real-time information: a single upward arrow (↑) means glucose is rising 1-2 mg/dL per minute — at this rate, glucose will rise 60-120 mg/dL in the next hour; teaching patients to respond proactively to trend arrows (pre-emptive correction boluses, activity) dramatically improves control"
    ],
    quiz: [
      {
        question: "A Type 1 diabetic on an insulin pump calls with glucose of 320 mg/dL, nausea, and moderate ketones on urine dipstick. She changed her pump site yesterday. What is the most appropriate immediate advice?",
        options: [
          "Give a correction bolus through the pump and recheck in 2 hours",
          "Take a correction dose via INJECTION (pen/syringe), change the pump infusion set to a new site, drink fluids, recheck glucose and ketones in 1 hour — go to ED if not improving",
          "Remove the pump, switch to NPH insulin, and schedule an office visit for tomorrow",
          "Increase pump basal rate by 50% and recheck in 4 hours"
        ],
        correct: 1,
        rationale: "Hyperglycemia > 250 with ketones on a pump is a pump site/delivery failure until proven otherwise. The correction dose must be given via INJECTION (pen or syringe) — not through the potentially occluded pump. The infusion set must be changed to a new site. If the pump is working correctly, the new site will deliver insulin properly. If glucose doesn't improve in 1-2 hours or ketones worsen, the patient should go to the ED for possible DKA. Bolusing through an occluded site delivers no insulin. Switching to NPH is unnecessary — just fix the pump site issue."
      }
    ]
  },
  "gestational-diabetes-screening-np": {
    title: "Gestational Diabetes Screening: NP Approach",
    cellular: {
      title: "GDM Screening Rationale & Physiology",
      content: "Gestational diabetes mellitus (GDM) screening targets the physiological insulin resistance of pregnancy that unmasks beta-cell insufficiency. Between 24-28 weeks gestation, placental hormone production (human placental lactogen, progesterone, cortisol) reaches levels sufficient to overcome normal compensatory beta-cell hyperplasia in susceptible women. Screening timing at 24-28 weeks balances early enough detection for intervention with late enough gestational age for insulin resistance to manifest. Two validated screening approaches exist: (1) One-step 75 g OGTT (IADPSG/WHO/CDA criteria): fasting, 1h, and 2h glucose measured — any single elevated value diagnoses GDM; identifies more women but some may represent physiological variation. (2) Two-step approach (ACOG/NIH): 50 g glucose challenge test (GCT) — non-fasting screen; if positive (≥ 130 or 140 mg/dL at 1h), proceed to 100 g OGTT for confirmatory diagnosis (two or more elevated values required). Early screening (first trimester) is recommended for high-risk women to detect pre-existing diabetes versus true GDM."
    },
    riskFactors: [
      "BMI ≥ 30 kg/m² (strongest modifiable risk factor)",
      "Age > 35 years",
      "Prior GDM (recurrence rate 30-70% in subsequent pregnancies)",
      "Prior macrosomic infant (> 4000 g)",
      "First-degree relative with Type 2 DM",
      "High-risk ethnicity: South Asian, African, Hispanic, Indigenous, Pacific Islander",
      "Polycystic ovary syndrome",
      "Multiple gestation, glycosuria, polyhydramnios"
    ],
    diagnostics: [
      "Universal screening at 24-28 weeks: recommended for all pregnant women not previously diagnosed with diabetes",
      "One-step 75 g OGTT (IADPSG): fasting ≥ 92 mg/dL, 1h ≥ 180 mg/dL, 2h ≥ 153 mg/dL — ONE elevated value = GDM diagnosis",
      "Two-step: 50 g GCT screen (1h glucose ≥ 130-140 mg/dL = positive) → 100 g OGTT (Carpenter-Coustan: fasting ≥ 95, 1h ≥ 180, 2h ≥ 155, 3h ≥ 140 mg/dL — TWO or more elevated = GDM diagnosis)",
      "Early screening (first visit): HbA1c, fasting glucose, or random glucose for high-risk women; HbA1c ≥ 6.5% or fasting glucose ≥ 126 = pre-existing diabetes; HbA1c 5.7-6.4% = prediabetes (high risk for GDM — rescreen at 24-28 weeks)",
      "Postpartum screening: 75 g OGTT at 6-12 weeks postpartum (test for persistent glucose abnormality); then annual fasting glucose or HbA1c for life"
    ],
    management: [
      "Medical nutrition therapy (MNT) is first-line: individualized carbohydrate management, 3 meals + 2-3 snacks, caloric intake based on pre-pregnancy BMI; registered dietitian referral; SMBG fasting + 1h post-prandial after each meal",
      "Glucose targets: fasting < 95 mg/dL, 1h postprandial < 140 mg/dL, 2h postprandial < 120 mg/dL",
      "Insulin therapy: if targets not met after 1-2 weeks of MNT; NPH + rapid-acting analog preferred",
      "Metformin: acceptable alternative when insulin not feasible; crosses placenta (long-term neonatal studies reassuring to date but ongoing)",
      "Fetal surveillance: monthly growth ultrasounds from 28 weeks, NST/BPP starting 32-36 weeks based on glycemic control",
      "Delivery timing: diet-controlled GDM — expectant management to 40+6 weeks; GDM on medication — induction 39+0-39+6 weeks",
      "Postpartum: discontinue insulin/metformin immediately after delivery; breastfeeding encouraged; OGTT at 6-12 weeks; lifelong annual diabetes screening (50% develop T2DM within 5-10 years)"
    ],
    nursingActions: [
      "OGTT administration: patient instruction for proper preparation (fasting 8-14 hours for 75g/100g OGTT, no restrictions for 50g GCT); ensure patient drinks entire glucose solution within 5 minutes; blood draws at exact specified intervals; patient must remain seated and not eat during test",
      "SMBG training: teach proper blood glucose monitoring technique; review meter accuracy; establish monitoring schedule (fasting + post-prandial); teach glucose log documentation",
      "Dietary counseling: carbohydrate education — portion control, glycemic index, meal spacing; bedtime snack with protein to prevent overnight ketosis; avoid simple sugars and juice",
      "Insulin teaching: if insulin started — injection technique, storage, dose adjustment framework, hypoglycemia recognition and treatment, sick-day rules",
      "Emotional support: GDM diagnosis can cause anxiety and guilt — reassure that GDM is a physiological condition, not caused by dietary choices; emphasize that management significantly reduces risks",
      "Postpartum follow-up: schedule 6-12 week OGTT; emphasize lifelong screening; encourage breastfeeding (protective against T2DM); discuss preconception planning for future pregnancies"
    ],
    signs: {
      left: [
        "GDM well-controlled on diet: all glucose values consistently within target, appropriate fetal growth",
        "Mild GDM with fasting glucose 95-100 responding to dietary changes",
        "Normal postpartum OGTT at 6-12 weeks — continue annual screening",
        "Successful transition to healthy lifestyle with maintained weight management"
      ],
      right: [
        "Fasting glucose consistently > 105 despite dietary management — insulin therapy needed",
        "Rapid fetal growth (AC > 90th percentile) despite reported glucose targets being met — verify SMBG accuracy, consider CGM",
        "Polyhydramnios with macrosomia — indicates poor glycemic control or undiagnosed pre-existing diabetes",
        "Postpartum OGTT showing impaired glucose tolerance or Type 2 DM — initiate preventive interventions"
      ]
    },
    medications: [
      {
        name: "Metformin (in GDM)",
        type: "Biguanide",
        action: "Reduces hepatic glucose production and enhances peripheral insulin sensitivity via AMPK activation; does NOT stimulate insulin secretion (no hypoglycemia risk as monotherapy); crosses the placenta",
        sideEffects: "GI effects (nausea, diarrhea — start low, titrate slowly), B12 deficiency with long-term use, lactic acidosis (extremely rare; avoid in renal/hepatic failure), metallic taste",
        contra: "Serum creatinine > 1.4 mg/dL, hepatic failure, severe infection, alcohol abuse, conditions predisposing to lactic acidosis",
        pearl: "500 mg daily increasing to 500 mg BID over 1-2 weeks for GI tolerance. MiG and MiTy trials showed metformin is acceptable in GDM with similar short-term neonatal outcomes to insulin. Does cross the placenta — long-term follow-up studies (MiG TOFU) suggest possible increased BMI in childhood but data is evolving. Use when insulin is refused, access barriers exist, or as adjunct to insulin for insulin resistance."
      }
    ],
    pearls: [
      "50% of women with GDM develop Type 2 DM within 5-10 years — postpartum OGTT and annual screening are NOT optional; this is a lifetime metabolic risk signal, not a pregnancy-limited condition",
      "Breastfeeding for ≥ 3 months reduces the mother's risk of developing T2DM by 40-50% and should be actively encouraged and supported as a medical intervention, not just an infant feeding choice",
      "The 50 g GCT (screening test) does NOT require fasting — many patients are incorrectly told to fast, leading to false negatives; the 75 g and 100 g OGTTs (diagnostic tests) DO require fasting; ensure correct patient instructions based on which test is being performed"
    ],
    quiz: [
      {
        question: "A 28-year-old woman at 26 weeks gestation has a 50 g GCT result of 152 mg/dL. She is concerned about having diabetes. What is the next appropriate step?",
        options: [
          "Diagnose GDM based on the elevated GCT result and start dietary management",
          "Schedule a fasting 100 g OGTT to confirm or rule out GDM — the GCT is a screening test, not diagnostic",
          "Reassure that 152 mg/dL is normal and no further testing is needed",
          "Start metformin immediately and repeat the GCT in 4 weeks"
        ],
        correct: 1,
        rationale: "The 50 g GCT is a SCREENING test, not a diagnostic test. A result ≥ 130-140 mg/dL (threshold varies by institution) is positive and requires a confirmatory 100 g OGTT (3-hour test, fasting required). GDM is diagnosed when TWO or more values are elevated on the 100 g OGTT. Many women with a positive screen have normal confirmatory testing and do not have GDM. Starting treatment based on a screening test alone would lead to overdiagnosis and unnecessary intervention."
      }
    ]
  },
  "thyroid-cancer-surveillance-np": {
    title: "Thyroid Cancer Surveillance: NP Approach",
    cellular: {
      title: "Thyroid Cancer Biology & Surveillance Rationale",
      content: "Differentiated thyroid cancer (DTC — papillary 85%, follicular 10%) arises from thyroid follicular cells and generally retains the ability to produce thyroglobulin (Tg) and concentrate iodine — properties exploited for surveillance and treatment. After total thyroidectomy ± radioactive iodine (RAI) ablation, serum thyroglobulin serves as a tumor marker: detectable Tg (especially rising Tg) indicates residual or recurrent disease. Anti-thyroglobulin antibodies (TgAb) can interfere with Tg assays (causing falsely low results in immunometric assays) — a rising TgAb level itself may serve as a surrogate tumor marker. TSH stimulates thyroid cancer growth via the TSH receptor on tumor cells — the basis for TSH suppression therapy with levothyroxine (target TSH < 0.1 for high-risk, 0.5-2.0 for low-risk patients in remission). The ATA risk stratification (low, intermediate, high risk) and dynamic risk assessment (response to therapy: excellent, indeterminate, biochemically incomplete, structurally incomplete) guide the intensity and duration of surveillance."
    },
    riskFactors: [
      "Childhood radiation exposure to head/neck (strongest risk factor for papillary thyroid cancer)",
      "Family history of thyroid cancer (first-degree relative doubles risk)",
      "Genetic syndromes: familial adenomatous polyposis (FAP — cribriform-morular variant of PTC), Cowden syndrome (PTEN mutation), Carney complex, MEN2 (medullary, not differentiated)",
      "Prior history of thyroid cancer (recurrence risk depends on initial risk stratification and response to therapy)",
      "Iodine deficiency (associated with follicular thyroid cancer)",
      "Obesity (modest increased risk)",
      "Female sex (3:1 predominance, though male thyroid nodules have higher malignancy rate)"
    ],
    diagnostics: [
      "Serum thyroglobulin (Tg): primary surveillance marker after total thyroidectomy ± RAI; stimulated Tg (TSH > 30 or after rhTSH stimulation) < 1 ng/mL = excellent response; Tg > 1 ng/mL on TSH suppression or > 10 on stimulation requires investigation",
      "Anti-thyroglobulin antibodies (TgAb): must be measured with EVERY Tg level (TgAb interfere with Tg assay); rising TgAb trend = potential disease recurrence even if Tg is undetectable",
      "Neck ultrasound: first at 6-12 months post-surgery, then periodically based on risk level; evaluate thyroid bed for local recurrence and lateral neck lymph nodes (levels II-VI); suspicious features: round shape, loss of fatty hilum, calcifications, cystic change, hypervascularity",
      "Ultrasound-guided FNA: for suspicious lymph nodes ≥ 8-10 mm in smallest dimension; FNA washout for thyroglobulin (Tg-FNA > institutional cutoff confirms metastatic DTC)",
      "Diagnostic whole-body RAI scan: not routine for low-risk patients with excellent response; indicated for high-risk or rising Tg with negative ultrasound",
      "Cross-sectional imaging: CT (without iodinated contrast if RAI therapy planned), MRI, PET-CT (FDG-PET useful for Tg-elevated, RAI-negative disease — indicates dedifferentiation)",
      "TSH monitoring: ensure appropriate suppression level based on risk category",
      "Dynamic risk assessment: reclassify response to therapy every 1-2 years — excellent response allows de-escalation of surveillance intensity"
    ],
    management: [
      "TSH suppression with levothyroxine: high-risk (TSH < 0.1 mIU/L × 5 years), intermediate (TSH 0.1-0.5), low-risk with excellent response (TSH 0.5-2.0 — near-normal range); adjust based on dynamic risk reclassification",
      "Excellent response (undetectable Tg, negative TgAb, negative imaging): reduce surveillance frequency — annual Tg/TgAb, neck US every 1-3 years; relax TSH target to 0.5-2.0",
      "Biochemically incomplete response (detectable/rising Tg without structural disease): closer monitoring q6-12 months; consider diagnostic RAI scan, cross-sectional imaging; may observe if Tg stable and < 5-10",
      "Structurally incomplete response (identifiable disease on imaging): surgical resection for operable disease; RAI for RAI-avid disease; external beam radiation for non-resectable/non-RAI avid; lenvatinib or sorafenib for progressive RAI-refractory DTC",
      "RAI-refractory DTC: multikinase inhibitors (lenvatinib, sorafenib — FDA-approved), BRAF inhibitors (dabrafenib/trametinib for BRAF V600E-mutant PTC), clinical trials; molecular testing guides targeted therapy selection",
      "Medullary thyroid cancer surveillance: calcitonin and CEA every 6-12 months; calcitonin doubling time < 6 months = aggressive disease",
      "Long-term levothyroxine management: titrate for TSH target; monitor for atrial fibrillation risk (TSH < 0.1 increases AF risk, especially age > 60) and bone density (postmenopausal women on TSH-suppressive doses need DEXA monitoring)",
      "Pregnancy management: increase levothyroxine dose 25-30% upon positive pregnancy test; Tg monitoring with pregnancy-specific reference ranges; continue monitoring through pregnancy"
    ],
    nursingActions: [
      "Tg and TgAb monitoring coordination: schedule labs at appropriate intervals based on risk level; ensure TgAb is ALWAYS ordered with Tg; use same assay platform consistently (Tg values vary between assay manufacturers)",
      "TSH monitoring and levothyroxine dose management: check TSH q6-8 weeks after dose changes, then q6-12 months when stable; titrate to risk-appropriate target; educate on levothyroxine administration (empty stomach, 30-60 minutes before breakfast, avoid calcium/iron supplements within 4 hours)",
      "Neck ultrasound coordination: schedule per risk-stratified surveillance protocol; ensure radiologist experienced in thyroid cancer surveillance; communicate relevant history (surgery type, RAI dose, prior imaging findings)",
      "Symptom assessment: voice changes (recurrent laryngeal nerve involvement), dysphagia, neck mass, bone pain, respiratory symptoms (pulmonary metastases) — any new symptoms require prompt evaluation",
      "Cardiovascular monitoring for TSH-suppressed patients: screen for atrial fibrillation (especially > 60 years), palpitations, bone density changes (DEXA in postmenopausal women on suppressive therapy)",
      "RAI precautions education: if RAI therapy administered — radiation safety precautions (distance, time, shielding), avoid pregnancy for 6-12 months, brief hypothyroidism period if THW preparation used",
      "Psychosocial support: cancer survivorship concerns, body image (neck scar, thyroid medication dependency), fear of recurrence; thyroid cancer support groups; fertility counseling if RAI planned in reproductive-age patients",
      "Dynamic risk reclassification communication: explain to patients that initial risk category can change with treatment response — many high-risk patients are reclassified to excellent response over time, allowing reduced surveillance and improved quality of life"
    ],
    signs: {
      left: [
        "Excellent response: undetectable stimulated Tg, stable/declining TgAb, clean neck ultrasound — reduced surveillance intensity appropriate",
        "Low-risk PTC with excellent response at 1-year: TSH target relaxed to 0.5-2.0, annual Tg, US every 2-3 years",
        "Stable biochemically incomplete response: Tg detectable but stable < 5 ng/mL without structural correlate — observation with close monitoring",
        "Successful de-escalation: patient reclassified from intermediate to excellent response — less frequent labs and imaging"
      ],
      right: [
        "Rising Tg trend (especially stimulated Tg > 10): structural recurrence likely — comprehensive imaging workup needed",
        "Structurally incomplete response: identifiable disease on imaging — multidisciplinary discussion for surgery, RAI, or systemic therapy",
        "RAI-refractory DTC with progressive disease: FDG-PET positive, RAI scan negative — indicates dedifferentiation; multikinase inhibitors or BRAF-targeted therapy needed",
        "Symptomatic recurrence: hoarseness (RLN involvement), airway compromise, bone metastasis with pain/fracture risk"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (TSH-suppressive dosing)",
        type: "Synthetic T4 — TSH Suppression Therapy",
        action: "Replaces thyroid hormone after thyroidectomy AND suppresses TSH-mediated stimulation of residual thyroid cancer cells; TSH suppression reduces recurrence risk in intermediate and high-risk DTC",
        sideEffects: "Atrial fibrillation (1.5-2x increased risk with TSH < 0.1, especially > 60 years), osteoporosis (TSH suppression accelerates bone turnover in postmenopausal women), anxiety, palpitations, tremor, insomnia, heat intolerance, weight loss",
        contra: "Untreated adrenal insufficiency (correct before starting); thyrotoxicosis (factitious)",
        pearl: "Dose for TSH suppression is higher than simple replacement (typically 2-2.5 mcg/kg/day vs. 1.6 mcg/kg/day). Target TSH: < 0.1 for high-risk × 5 years, 0.1-0.5 for intermediate risk, 0.5-2.0 for low-risk/excellent response. Balance cancer recurrence risk against AF and osteoporosis risk — dynamic reclassification allows de-escalation. Take on empty stomach consistently; many drug interactions affect absorption (calcium, iron, PPI, cholestyramine)."
      },
      {
        name: "Lenvatinib (Lenvima)",
        type: "Multi-kinase Inhibitor (VEGFR, FGFR, RET, KIT, PDGFRα)",
        action: "Inhibits VEGF receptors (anti-angiogenic), FGFR, RET, KIT, and PDGFR; used for progressive radioactive iodine-refractory differentiated thyroid cancer; SELECT trial showed significant PFS benefit",
        sideEffects: "Hypertension (68%), diarrhea (59%), fatigue, weight loss, proteinuria, hand-foot syndrome, hepatotoxicity, arterial thromboembolic events, GI perforation/fistula",
        contra: "Uncontrolled hypertension, recent arterial thromboembolic event, QT prolongation",
        pearl: "24 mg PO daily. SELECT trial: PFS 18.3 months vs. 3.6 months with placebo in RAI-refractory DTC. Requires aggressive BP management (ACEi/ARB first-line). Monitor urine protein, LFTs, and TSH (may affect levothyroxine absorption). Dose reductions needed in ~2/3 of patients due to side effects. Dental evaluation before starting (risk of ONJ). Alternative: sorafenib 400 mg PO BID (DECISION trial)."
      }
    ],
    pearls: [
      "Anti-thyroglobulin antibodies (TgAb) MUST be measured with every thyroglobulin level — TgAb can cause falsely low Tg results in immunometric assays, leading to false reassurance; a rising TgAb trend itself should be treated as a potential sign of disease recurrence even if Tg appears undetectable",
      "Dynamic risk assessment means the initial risk category is NOT permanent — a patient initially classified as intermediate or high risk who achieves an excellent response (undetectable Tg, negative imaging) can be reclassified, allowing de-escalation of TSH suppression and surveillance intensity; this improves quality of life and reduces iatrogenic complications",
      "TSH suppression must balance cancer risk against cardiovascular and skeletal risk: in patients > 60 years, TSH < 0.1 increases atrial fibrillation risk 1.5-2x; in postmenopausal women, TSH suppression accelerates bone loss — DEXA monitoring and relaxation of TSH target when appropriate are important long-term management considerations"
    ],
    quiz: [
      {
        question: "A patient had total thyroidectomy and RAI for a 3 cm papillary thyroid cancer (intermediate risk) 2 years ago. Current labs: stimulated Tg < 0.1 ng/mL, TgAb < 1 IU/mL, neck US shows no suspicious findings. How should management be adjusted?",
        options: [
          "No change — maintain TSH < 0.1 and annual stimulated Tg and US indefinitely",
          "Reclassify as excellent response — relax TSH target to 0.5-2.0 mIU/L, reduce surveillance frequency (Tg annually, US every 2-3 years)",
          "Discontinue levothyroxine to test whether the cancer recurs",
          "Perform diagnostic whole-body RAI scan to confirm absence of disease"
        ],
        correct: 1,
        rationale: "This patient meets criteria for excellent response to therapy: undetectable stimulated Tg, negative TgAb, and negative imaging at 2 years. According to dynamic risk reclassification (ATA guidelines), intermediate-risk patients who achieve excellent response can have their TSH target relaxed (0.5-2.0 mIU/L), reducing the cardiovascular and bone risks of aggressive TSH suppression. Surveillance can be de-escalated to annual Tg/TgAb and neck US every 2-3 years. Diagnostic RAI scans are not routinely indicated for patients with excellent response. Levothyroxine must never be discontinued as it's needed for both replacement and mild TSH suppression."
      }
    ]
  },
  "stress-hpa-axis-np": {
    title: "HPA Axis & Stress Response: NP Guide",
    cellular: {
      title: "HPA Axis Physiology & Stress Response",
      content: "The hypothalamic-pituitary-adrenal (HPA) axis is the primary neuroendocrine stress response system. The hypothalamus releases corticotropin-releasing hormone (CRH) and arginine vasopressin (AVP) from the paraventricular nucleus in response to physical or psychological stress. CRH travels via the hypothalamic-hypophyseal portal system to the anterior pituitary, where it stimulates corticotrophs to release adrenocorticotropic hormone (ACTH) via the CRH-R1 receptor. ACTH acts on the adrenal cortex zona fasciculata, stimulating cortisol synthesis through the steroidogenic pathway (cholesterol → pregnenolone → 17-hydroxyprogesterone → 11-deoxycortisol → cortisol via 11β-hydroxylase). Cortisol exerts negative feedback at both the hypothalamus (reducing CRH) and pituitary (reducing ACTH) to terminate the stress response. Cortisol's metabolic effects are essential for stress adaptation: gluconeogenesis (energy mobilization), lipolysis, protein catabolism, anti-inflammatory immunosuppression (redirecting energy from immune to survival functions), enhanced cardiovascular function (permissive effect on catecholamine receptors), and CNS modulation (alertness and memory consolidation). Chronic stress or exogenous glucocorticoid exposure suppresses the HPA axis: adrenal atrophy occurs within weeks, and recovery after suppression can take 6-18 months."
    },
    riskFactors: [
      "Chronic exogenous glucocorticoid use (most common cause of HPA axis suppression — > 7.5 mg prednisone equivalent daily for > 3 weeks)",
      "Abrupt glucocorticoid discontinuation without taper",
      "Critical illness (relative adrenal insufficiency in sepsis — CIRCI)",
      "Chronic psychological stress (HPA axis dysregulation — blunted cortisol response)",
      "Pituitary surgery or radiation (secondary adrenal insufficiency)",
      "Autoimmune adrenalitis (primary AI affecting HPA axis at the adrenal level)",
      "Hypothalamic tumors or infiltrative disease (tertiary AI)",
      "Medications: etomidate, ketoconazole, megestrol acetate, immune checkpoint inhibitors (hypophysitis)"
    ],
    diagnostics: [
      "Morning cortisol (8 AM): < 3 mcg/dL = adrenal insufficiency likely; > 15-18 = adequate; 3-15 = indeterminate (needs stimulation test)",
      "ACTH stimulation test (250 mcg cosyntropin): cortisol at 0 and 60 minutes; peak cortisol < 18-20 mcg/dL = adrenal insufficiency",
      "Low-dose cosyntropin test (1 mcg): more sensitive for secondary/tertiary AI (detects partial ACTH deficiency before standard dose test becomes abnormal)",
      "ACTH level: distinguish primary (ACTH > 100 — adrenal failure) from secondary/tertiary (ACTH low/normal — pituitary/hypothalamic failure)",
      "Insulin tolerance test (ITT): gold standard for HPA axis integrity — induces hypoglycemia (glucose < 40) which should stimulate cortisol > 18; reserved for evaluating HPA axis recovery after pituitary surgery",
      "DHEA-S: low in primary AI (adrenal androgen deficiency); may be normal in secondary AI if ACTH is not completely absent",
      "Cortisol diurnal rhythm testing: morning cortisol should be highest (6-8 AM), evening lowest; flat or reversed rhythm suggests axis dysfunction",
      "Overnight metyrapone test: metyrapone blocks 11β-hydroxylase → blocks cortisol production → if intact HPA, ACTH rises → 11-deoxycortisol rises; failure to rise indicates central (pituitary) insufficiency"
    ],
    management: [
      "Glucocorticoid taper protocol: reduce by 10-20% of daily dose every 1-2 weeks when above physiologic dose (> 7.5 mg prednisone); once at physiologic dose, switch to hydrocortisone and taper by 2.5 mg every 2-4 weeks with serial morning cortisol monitoring",
      "Physiologic replacement: hydrocortisone 15-25 mg/day (typically 10 mg morning, 5 mg afternoon) or prednisone 3-5 mg daily (longer half-life, simpler dosing)",
      "Stress dosing protocol: minor illness with fever → double oral dose; moderate surgical procedure → hydrocortisone 50 mg IV × 1 then resume oral; major surgery → hydrocortisone 100 mg IV q8h × 24-48h then rapid taper to maintenance",
      "Critical illness-related corticosteroid insufficiency (CIRCI): hydrocortisone 50 mg IV q6h for septic shock not responding to fluids and vasopressors (ADRENAL/APROCCHSS trials — reduced time on vasopressors, possible mortality benefit in severe septic shock)",
      "HPA axis recovery monitoring: serial morning cortisol every 2-4 weeks during taper; cosyntropin test when morning cortisol > 10 mcg/dL to confirm axis recovery; may take 6-18 months",
      "Immune checkpoint inhibitor hypophysitis: high-dose dexamethasone for acute phase (4-8 mg/day), then physiologic hydrocortisone replacement; thyroid and gonadal axes may also be affected",
      "Relative adrenal insufficiency in critical illness: consider in any ICU patient with refractory hypotension; random cortisol < 10 in critically ill patient is suggestive; treat empirically",
      "Patient education: medic alert bracelet/card, emergency injection kit (Solu-Cortef 100 mg), sick-day rules, avoid abrupt discontinuation"
    ],
    nursingActions: [
      "Identify patients at risk for HPA axis suppression: anyone on > 7.5 mg prednisone equivalent for > 3 weeks; frequent short courses of steroids; inhaled corticosteroids at high doses with systemic absorption",
      "Glucocorticoid taper adherence monitoring: ensure patient understands the taper schedule; provide written instructions; check morning cortisol at scheduled intervals during taper",
      "Stress-dose steroid education: teach 'sick-day rules' — double dose for fever/illness, triple for major stress; demonstrate IM hydrocortisone injection technique for patient and family member; provide injection kit",
      "Adrenal crisis recognition: educate patient on crisis symptoms (severe weakness, dizziness, nausea, abdominal pain, confusion) — seek emergency care immediately; carry medic alert card with diagnosis and steroid regimen",
      "Monitor for Cushing features during chronic steroid therapy: weight, blood glucose, blood pressure, skin integrity, mood changes; proactive management of side effects",
      "Perioperative steroid management coordination: communicate steroid status to surgical and anesthesia teams; ensure stress-dose protocol is ordered and administered; monitor post-operative recovery of steroid dosing",
      "Critical illness steroid assessment: for ICU patients with refractory shock — facilitate random cortisol testing and empiric hydrocortisone if clinical suspicion is high",
      "Long-term follow-up: track HPA axis recovery over 6-18 months after steroid discontinuation; ensure adequate stress dosing until full recovery confirmed by stimulation testing"
    ],
    signs: {
      left: [
        "Physiologic HPA axis: appropriate cortisol rise during illness/surgery (cortisol > 18 in stress)",
        "Gradual glucocorticoid taper without withdrawal symptoms, morning cortisol rising progressively",
        "Recovered HPA axis: normal cosyntropin test, no longer requiring replacement",
        "Stable on physiologic hydrocortisone replacement with adequate sick-day stress dosing in place"
      ],
      right: [
        "Adrenal crisis during illness in patient with suppressed HPA axis: hypotension, hypoglycemia, altered mental status — immediate hydrocortisone 100 mg IV",
        "Steroid withdrawal syndrome: arthralgias, myalgias, fatigue, nausea with cortisol in normal range — reflects relative decrease from supraphysiologic levels; slow taper further",
        "Refractory septic shock not responding to vasopressors — consider CIRCI and empiric hydrocortisone",
        "Checkpoint inhibitor-induced hypophysitis: acute headache, fatigue, hypotension — MRI pituitary shows enlargement; multiple hormone deficiencies"
      ]
    },
    medications: [
      {
        name: "Hydrocortisone (physiologic replacement)",
        type: "Glucocorticoid (closest to endogenous cortisol)",
        action: "Replaces cortisol in patients with HPA axis suppression; provides both glucocorticoid (metabolic, anti-inflammatory) and mineralocorticoid (sodium retention, potassium excretion) effects at physiologic doses",
        sideEffects: "At physiologic doses (15-25 mg/day): minimal side effects; weight gain, mood changes, and metabolic effects are dose-dependent; over-replacement causes Cushingoid features",
        contra: "Active untreated systemic infection (relative — benefit outweighs risk in true AI)",
        pearl: "Physiologic replacement: 15-25 mg/day in divided doses (10 mg AM + 5 mg afternoon, or 10-5-5 split for TID dosing); mimic diurnal cortisol rhythm by giving largest dose in morning. During taper from pharmacologic doses, switch to hydrocortisone when dose reaches prednisone ~5 mg equivalent. Monitor weight, glucose, BP, morning cortisol during recovery. Dual-release hydrocortisone (Plenadren) provides more physiologic cortisol profile but is expensive."
      },
      {
        name: "Dexamethasone (for ACTH testing compatibility)",
        type: "Long-acting Synthetic Glucocorticoid",
        action: "40x more potent than hydrocortisone with negligible mineralocorticoid activity; critically, does NOT cross-react with cortisol immunoassays — allows ACTH stimulation testing while patient is receiving glucocorticoid coverage",
        sideEffects: "Hyperglycemia, insomnia, mood disturbance, immunosuppression, adrenal suppression (long half-life — 36-72 hours)",
        contra: "Known hypersensitivity; consider shorter-acting agents when possible",
        pearl: "When investigating suspected AI but needing to provide glucocorticoid coverage: give dexamethasone 0.5-1 mg (provides glucocorticoid coverage) and perform cosyntropin stimulation test — dexamethasone does not interfere with cortisol assay, allowing valid results. This is important in the emergency setting where you need to both treat potential AI and confirm the diagnosis simultaneously. After testing, switch to hydrocortisone for ongoing replacement."
      }
    ],
    pearls: [
      "Any patient on > 7.5 mg prednisone equivalent for > 3 weeks has potential HPA axis suppression — they MUST be tapered gradually (not stopped abruptly) and require stress-dose steroid coverage during illness or surgery until axis recovery is confirmed; this includes high-dose inhaled corticosteroids which can have significant systemic absorption",
      "HPA axis recovery after chronic glucocorticoid use takes 6-18 months — during this period, the patient needs physiologic replacement and stress dosing; recovery is confirmed by morning cortisol > 10 mcg/dL followed by a normal cosyntropin stimulation test (peak cortisol > 18 mcg/dL)",
      "In critically ill patients with refractory septic shock, relative adrenal insufficiency (CIRCI) is increasingly recognized: empiric hydrocortisone 50 mg IV q6h can reduce vasopressor requirements and may improve outcomes — this is not the same as chronic AI management and should be treated as a critical care intervention with rapid taper once shock resolves"
    ],
    quiz: [
      {
        question: "A patient has been on prednisone 40 mg daily for 3 months for a lupus flare. The rheumatologist wants to taper and discontinue the steroid. Which of the following is the correct approach?",
        options: [
          "Stop prednisone immediately — 3 months is not long enough to suppress the HPA axis",
          "Gradual taper: reduce by 5-10 mg every 1-2 weeks to physiologic dose (5 mg), then switch to hydrocortisone and continue slow taper with morning cortisol monitoring until axis recovery confirmed",
          "Reduce to prednisone 5 mg immediately and maintain for 6 months",
          "Switch directly to hydrocortisone 10 mg daily and stop in 2 weeks"
        ],
        correct: 1,
        rationale: "Three months of prednisone 40 mg daily will have caused significant HPA axis suppression. Abrupt discontinuation risks adrenal crisis. The correct approach is a gradual taper: reduce by 5-10 mg every 1-2 weeks (rate depends on clinical status) until reaching physiologic dose (~5 mg prednisone = 20 mg hydrocortisone). Then switch to hydrocortisone and continue slower taper (2.5 mg decrements every 2-4 weeks) while monitoring morning cortisol. Full HPA axis recovery may take 6-18 months after reaching physiologic doses. The patient needs stress-dose education throughout this period."
      }
    ]
  },
  "testosterone-deficiency-np": {
    title: "Testosterone Deficiency: NP Management",
    cellular: {
      title: "Male Hypogonadism Pathophysiology",
      content: "Male hypogonadism involves insufficient testosterone production, classified as primary (testicular failure — elevated LH/FSH with low testosterone) or secondary/central (hypothalamic-pituitary dysfunction — low/normal LH/FSH with low testosterone). The hypothalamic-pituitary-gonadal (HPG) axis: GnRH from the hypothalamus (pulsatile secretion) stimulates pituitary LH (stimulates Leydig cell testosterone production) and FSH (stimulates Sertoli cell spermatogenesis). Testosterone (T) exerts negative feedback at both hypothalamus and pituitary. In the periphery, T is converted to dihydrotestosterone (DHT) by 5-alpha-reductase (DHT mediates prostate growth, male pattern hair, sebaceous activity) and to estradiol by aromatase (E2 mediates bone health, fat distribution, and also provides negative HPG feedback). Free testosterone (2-3% of total) is the biologically active fraction; the rest is bound to SHBG (60-70%) and albumin (30-40%). Conditions that increase SHBG (aging, liver disease, hyperthyroidism) can lower free T while total T appears normal. Primary causes include Klinefelter syndrome (47,XXY), testicular trauma, orchitis, and chemotherapy/radiation. Secondary causes include obesity (most common acquired cause — adipose aromatase converts T to E2, which suppresses GnRH), opioids, pituitary tumors, and hyperprolactinemia."
    },
    riskFactors: [
      "Aging (testosterone declines ~1-2% per year after age 30 — not all men become symptomatic)",
      "Obesity (strongest modifiable risk factor — adipose aromatase converts T to estradiol, suppressing HPG axis; weight loss can restore T levels)",
      "Type 2 diabetes and metabolic syndrome (bidirectional relationship with low T)",
      "Opioid use (suppresses GnRH — up to 90% of chronic opioid users have low T)",
      "Klinefelter syndrome (47,XXY — most common chromosomal cause of primary hypogonadism; prevalence 1:600 males)",
      "Chronic illness: HIV, CKD, liver cirrhosis, COPD (functional central hypogonadism)",
      "Medications: glucocorticoids, ketoconazole, spironolactone, GnRH agonists (leuprolide), anabolic steroid use (suppresses endogenous HPG axis)",
      "Pituitary pathology: prolactinoma (hyperprolactinemia suppresses GnRH), pituitary adenoma, hemochromatosis (iron deposition in pituitary), cranial radiation"
    ],
    diagnostics: [
      "Total testosterone: measure in morning (8-10 AM) fasting — T has diurnal variation with peak in early morning; < 300 ng/dL (or < 10.4 nmol/L) on TWO separate morning samples is diagnostic",
      "Free testosterone (calculated or equilibrium dialysis): more accurate than total T when SHBG abnormalities suspected (obesity, aging, liver disease, thyroid disease); low free T with normal total T = clinically relevant hypogonadism",
      "LH and FSH: distinguish primary (elevated — testicular failure) from secondary (low/normal — central cause); critical for determining etiology",
      "Prolactin: if secondary hypogonadism — elevated prolactin suggests prolactinoma (pituitary MRI indicated)",
      "SHBG: elevated in aging, liver disease, hyperthyroidism (total T may be normal but free T is low); decreased in obesity, hypothyroidism, diabetes",
      "Complete pituitary panel if secondary: cortisol, TSH, free T4, IGF-1, prolactin — assess for panhypopituitarism",
      "Pituitary MRI: if secondary hypogonadism, especially with prolactin > 250 or visual field complaints",
      "Karyotype: if primary hypogonadism in young male — rule out Klinefelter (47,XXY)"
    ],
    management: [
      "Address reversible causes first: weight loss (5-10% body weight can significantly raise T), opioid reduction/cessation, sleep apnea treatment, discontinue offending medications",
      "Testosterone replacement therapy (TRT) — indicated when: low T on two morning samples + symptoms (sexual dysfunction, fatigue, decreased muscle mass, depressed mood, osteoporosis)",
      "TRT options: testosterone cypionate/enanthate 100-200 mg IM every 1-2 weeks; testosterone gel 1-2% (50-100 mg daily — apply to shoulders, upper arms, abdomen; avoid skin-to-skin transfer); testosterone undecanoate (Nebido) 1000 mg IM every 10-14 weeks (long-acting); testosterone patch; oral testosterone undecanoate (Jatenzo); nasal testosterone gel (Natesto)",
      "Monitoring during TRT: testosterone level at 3-6 months (goal 400-700 ng/dL mid-interval), hematocrit q6-12 months (polycythemia risk — hold if Hct > 54%), PSA at baseline and annually (TRT is NOT proven to cause prostate cancer but monitoring is prudent), lipid panel, liver function",
      "Contraindications to TRT: desire for fertility (TRT suppresses spermatogenesis — use clomiphene or hCG instead), breast cancer, untreated polycythemia (Hct > 54%), untreated severe OSA, active prostate cancer, unstable CVD",
      "Fertility preservation: TRT causes azoospermia in most men within 3-6 months; for men desiring fertility — clomiphene citrate 25-50 mg PO every other day or hCG 1500-3000 IU SC 2-3x/week (both stimulate endogenous T production while maintaining/restoring spermatogenesis)",
      "Osteoporosis assessment: DEXA scan if low T documented, especially with fragility fracture history; TRT improves BMD",
      "Cardiovascular safety: recent TRAVERSE trial showed TRT does NOT increase major adverse cardiovascular events in hypogonadal men with or at risk for CVD; reassuring for appropriate use"
    ],
    nursingActions: [
      "Proper specimen collection: morning fasting testosterone (8-10 AM); educate patient on timing importance; two separate confirmed low values required before initiating TRT",
      "TRT administration education: IM injection technique (if self-injecting), gel application (proper amount, site, drying time, handwashing, avoiding skin contact with partners/children — testosterone transfer risk), patch application and rotation",
      "Monitor for TRT adverse effects: polycythemia (CBC/Hct q6-12 months — therapeutic phlebotomy if Hct > 54%), acne, sleep apnea worsening, mood changes/irritability, breast tenderness (gynecomastia from aromatization)",
      "PSA monitoring: baseline before starting TRT, then at 3-6 months and annually; > 1.4 ng/mL rise from baseline → urology referral for prostate evaluation",
      "Fertility counseling: explicitly ask about future fertility BEFORE starting TRT; if fertility desired, use clomiphene or hCG instead; TRT-induced azoospermia is usually reversible (3-12 months after stopping) but not guaranteed",
      "Screen for sleep apnea: TRT can worsen untreated OSA; assess with Epworth Sleepiness Scale; sleep study referral if positive screen",
      "Assess treatment response: energy, libido, mood, body composition changes, bone density — symptomatic improvement typically begins within 3-6 months; if no improvement, reassess diagnosis and adherence",
      "Transdermal testosterone safety: educate about secondary exposure risk — gel transfers through skin contact; wash hands after application, cover application site with clothing, wash area before anticipated skin contact with partner/children"
    ],
    signs: {
      left: [
        "Symptomatic improvement on TRT: improved energy, libido, mood, and body composition within 3-6 months",
        "Testosterone in target range (400-700 ng/dL at mid-interval) with hematocrit < 50%",
        "Reversible cause addressed: weight loss normalizing testosterone, opioid cessation restoring HPG function",
        "Normal PSA trend without significant rise on annual monitoring"
      ],
      right: [
        "Polycythemia: hematocrit > 54% on TRT — hold TRT, therapeutic phlebotomy, dose reduction or switch to transdermal (lower polycythemia risk than IM)",
        "TRT-induced azoospermia in patient desiring fertility — discontinue TRT, start clomiphene or hCG, refer to reproductive endocrinology",
        "Prolactinoma discovered on workup for secondary hypogonadism — pituitary MRI showing macroadenoma, visual field deficit",
        "Significant PSA rise (> 1.4 ng/mL from baseline or total > 4.0) — urology referral for prostate evaluation"
      ]
    },
    medications: [
      {
        name: "Testosterone Cypionate (IM injection)",
        type: "Intramuscular Testosterone Ester",
        action: "Esterified testosterone slowly released from IM depot, providing testosterone replacement that restores physiological levels; converted to DHT by 5-alpha-reductase and to estradiol by aromatase for full androgenic and secondary hormonal effects",
        sideEffects: "Polycythemia (most significant — monitor Hct), injection site pain, mood fluctuations (peak-trough with IM dosing), acne, gynecomastia (from aromatization to estradiol), testicular atrophy and azoospermia (from HPG axis suppression), sleep apnea exacerbation",
        contra: "Prostate cancer (active), breast cancer in men, desire for current fertility, Hct > 54%, severe untreated OSA, severe heart failure",
        pearl: "100-200 mg IM every 1-2 weeks (more frequent lower doses reduce peak-trough fluctuations). Check trough testosterone level (draw just before next injection); target 400-700 ng/dL. IM injections cause wider testosterone fluctuations than gels — patients may experience mood/energy variations between injections. Self-injection in the deltoid or thigh is feasible with proper training. Hematocrit monitoring is critical — polycythemia is the most common clinically significant side effect."
      },
      {
        name: "Clomiphene Citrate (off-label for male hypogonadism)",
        type: "Selective Estrogen Receptor Modulator (SERM)",
        action: "Blocks estrogen receptors at the hypothalamus and pituitary, removing negative feedback and increasing GnRH pulsatility → increased LH and FSH → increased endogenous testicular testosterone production AND maintained spermatogenesis (key advantage over exogenous testosterone)",
        sideEffects: "Visual disturbances (rare — discontinue if occurs), mood changes, headache, GI upset, gynecomastia (rare), polycythemia (less than TRT)",
        contra: "Active liver disease, undiagnosed visual symptoms, primary hypogonadism (won't work — testes cannot respond to increased LH/FSH)",
        pearl: "25-50 mg PO every other day or daily (off-label for male hypogonadism). ONLY works for secondary/central hypogonadism (functional HPG axis with competent testes). Raises both testosterone AND maintains/improves spermatogenesis — ideal for hypogonadal men desiring fertility. Check total T at 4-6 weeks; target > 400 ng/dL. Not FDA-approved for male hypogonadism but widely used in endocrine and reproductive medicine. If primary hypogonadism (elevated LH/FSH), clomiphene will not work — exogenous TRT is needed."
      }
    ],
    pearls: [
      "Always measure testosterone in the MORNING (8-10 AM) fasting — testosterone has a circadian rhythm with peak levels in early morning and nadir in evening; afternoon levels can be 20-40% lower and lead to false diagnosis of hypogonadism",
      "TRT causes azoospermia in most men within 3-6 months by suppressing the HPG axis (LH/FSH drop → no intratesticular testosterone → spermatogenesis stops); ALWAYS ask about fertility plans before starting TRT; for men wanting children, use clomiphene citrate or hCG which preserve or restore spermatogenesis",
      "Obesity is the most common reversible cause of low testosterone in younger men — adipose tissue aromatase converts testosterone to estradiol, which suppresses GnRH; weight loss of 5-10% can significantly raise testosterone levels and should be the first-line intervention in obese hypogonadal men before considering TRT"
    ],
    quiz: [
      {
        question: "A 32-year-old obese man (BMI 38) presents with fatigue, decreased libido, and erectile dysfunction. Morning testosterone is 240 ng/dL (confirmed on repeat), LH 3 mIU/mL (low-normal), FSH 2 mIU/mL (low-normal). He and his wife are planning to conceive within the next year. What is the most appropriate management?",
        options: [
          "Start testosterone cypionate 200 mg IM every 2 weeks to restore testosterone levels",
          "Lifestyle modification with weight loss goal of 5-10% AND clomiphene citrate 25-50 mg every other day — preserves fertility while treating hypogonadism",
          "Start testosterone gel 1% daily — transdermal route has less fertility impact than injections",
          "Refer to urology for testicular biopsy before any treatment"
        ],
        correct: 1,
        rationale: "This patient has secondary hypogonadism (low T with inappropriately low-normal LH/FSH) most likely due to obesity (aromatase-mediated estradiol excess suppressing GnRH). Two critical factors guide management: (1) he wants fertility — ALL exogenous testosterone (IM or gel) suppresses spermatogenesis; clomiphene citrate stimulates endogenous testosterone production while MAINTAINING spermatogenesis; (2) obesity is the likely reversible cause — weight loss of 5-10% can significantly raise testosterone. The combination of lifestyle modification + clomiphene addresses both the underlying cause and preserves fertility."
      }
    ]
  },
  "hpa-axis-stress-np": {
    title: "HPA Axis Stress Response: NP Management",
    cellular: {
      title: "Clinical HPA Axis Stress Management",
      content: "The clinical significance of HPA axis function centers on the stress response and its suppression by exogenous glucocorticoids. During physiological stress (surgery, infection, trauma), cortisol secretion increases 2-10 fold above baseline (from ~10-20 mcg/day to 75-150 mcg/day in major stress). This cortisol surge is essential for: maintaining vascular tone and hemodynamic stability, mobilizing glucose through gluconeogenesis, modulating the immune response to prevent excessive inflammation, and supporting cardiac contractility. When exogenous glucocorticoids suppress the HPA axis, the adrenals cannot mount this stress response — creating a life-threatening vulnerability. The degree and duration of HPA suppression depend on glucocorticoid dose, duration, potency, route of administration, and individual patient factors. Even 'low-dose' chronic steroids (prednisone 5 mg/day for months) can cause significant suppression. Recovery follows a predictable pattern: CRH recovers first (weeks), then ACTH (weeks-months), then adrenal function (months — up to 18 months). Perioperative stress dosing protocols are based on graded stress categories: minor procedures (hydrocortisone 25 mg), moderate (50-75 mg/day × 1-2 days), major (100 mg q8h × 2-3 days, then rapid taper)."
    },
    riskFactors: [
      "Same as stress-hpa-axis-np — this lesson focuses on clinical management of stress dosing in practice",
      "Any patient on chronic glucocorticoids undergoing surgery, illness, or trauma",
      "Patients with known primary, secondary, or tertiary adrenal insufficiency",
      "Patients recently tapered off steroids (within past 12 months — HPA axis may not be fully recovered)",
      "High-dose inhaled corticosteroids with systemic absorption"
    ],
    diagnostics: [
      "Clinical assessment of HPA axis suppression risk: steroid dose, duration, route, timing of last dose",
      "Morning cortisol: if > 15 mcg/dL off steroids for > 24h, axis likely intact; < 5 mcg/dL suggests suppression",
      "ACTH stimulation test: definitive assessment of axis integrity; peak cortisol > 18 mcg/dL = adequate reserve",
      "Perioperative risk stratification: minor surgery (hernia, dental) → minimal stress; moderate (joint replacement, cholecystectomy) → moderate stress; major (cardiac, abdominal, trauma) → major stress"
    ],
    management: [
      "Stress dosing by surgical category: minor → usual dose or hydrocortisone 25 mg IV; moderate → hydrocortisone 50 mg IV pre-op + 25 mg q8h × 24h, then resume maintenance; major → hydrocortisone 100 mg IV pre-op + 50 mg q8h × 48-72h, then taper over 1-2 days to maintenance",
      "Sick-day rules for outpatients: oral steroid patients should double dose during febrile illness; if unable to take oral medications (vomiting) → IM hydrocortisone 100 mg and proceed to ED",
      "Emergency injection kit: Solu-Cortef 100 mg with syringe/needle; patient and family trained in IM injection technique",
      "Perioperative communication: ensure surgical, anesthesia, and nursing teams are aware of steroid dependence; order stress-dose steroids in pre-operative orders",
      "Post-operative taper: rapidly reduce to maintenance dose over 1-3 days as surgical stress resolves (prolonged high-dose steroids increase infection and wound healing complications)",
      "Documentation: medical alert identification, medication list clearly noting steroid dependence, emergency contact information"
    ],
    nursingActions: [
      "Pre-operative verification: confirm stress-dose steroids are ordered; verify timing (first dose with anesthesia induction or 30 min before); ensure correct dosing for surgical category",
      "Intraoperative coordination: administer IV hydrocortisone as ordered; communicate with anesthesia about steroid-dependent patient; monitor hemodynamics (hypotension may indicate inadequate steroid coverage)",
      "Post-operative monitoring: vital signs q2-4h; assess for adrenal crisis signs (hypotension, tachycardia, altered mental status, fever) — any unexplained hemodynamic instability should raise suspicion for inadequate steroid coverage",
      "Taper protocol: follow ordered taper schedule; do not discontinue steroids abruptly; transition to oral when patient tolerating PO intake",
      "Sick-day rule education: teach before discharge — double oral dose for fever, triple for major illness; IM injection technique for patient and family; when to seek emergency care",
      "Emergency kit provision: ensure patient has injectable hydrocortisone kit before discharge; verify they and a family member can demonstrate IM injection technique",
      "Medication reconciliation: at every care transition (admission, transfer, discharge), verify steroid dose and ensure continuity; missed steroid doses in hospitalized patients are a common and dangerous medication error",
      "Medic alert documentation: encourage patient to obtain medic alert bracelet/necklace and carry emergency card with diagnosis, steroid dose, and emergency instructions"
    ],
    signs: {
      left: [
        "Appropriate stress-dose protocol administered for surgical category with stable hemodynamics",
        "Successful taper to maintenance dose post-operatively without signs of insufficiency",
        "Patient demonstrates understanding of sick-day rules and can show IM injection technique",
        "Adequate outpatient emergency preparedness: medic alert, injection kit, emergency contact plan"
      ],
      right: [
        "Perioperative adrenal crisis: unexplained intraoperative or post-operative hypotension not responding to fluids — immediate hydrocortisone 100 mg IV",
        "Missed steroid doses in hospitalized patient causing hemodynamic instability — medication reconciliation failure",
        "Sick patient unable to take oral steroids without IM injection kit — at risk for crisis",
        "Prolonged post-operative high-dose steroids causing wound healing complications, hyperglycemia, or infection"
      ]
    },
    medications: [
      {
        name: "Hydrocortisone (stress dosing)",
        type: "Glucocorticoid — Stress Coverage",
        action: "Provides cortisol coverage equivalent to the physiological stress response; replaces the cortisol surge (75-150 mcg/day) that normal adrenals produce during major stress; prevents hemodynamic collapse from inadequate cortisol-mediated vascular tone and catecholamine sensitivity",
        sideEffects: "Hyperglycemia (monitor blood glucose q4-6h during stress dosing), immunosuppression (wound healing concerns with prolonged high doses), fluid retention",
        contra: "None in true stress-dosing context — risk of not treating far exceeds medication risks",
        pearl: "Stress dosing is TEMPORARY and should be tapered rapidly back to maintenance (1-3 days for most surgical procedures). The most common error is not giving stress doses when needed; the second most common is prolonging high doses unnecessarily. Hydrocortisone is preferred over dexamethasone for perioperative stress dosing because its mineralocorticoid activity supports hemodynamics and its short half-life allows physiologic taper."
      }
    ],
    pearls: [
      "The most dangerous medication error in steroid-dependent patients is a missed dose — hospitalized patients' chronic steroids are frequently held, omitted, or not reconciled at admission; ensure every care transition includes explicit steroid dose verification",
      "Stress dosing is based on the STRESS LEVEL of the procedure, not the patient's usual steroid dose — a patient on prednisone 5 mg daily undergoing cardiac surgery needs hydrocortisone 100 mg q8h (major stress dosing), not just a doubled oral dose",
      "The injectable hydrocortisone emergency kit (Solu-Cortef 100 mg IM) is as important as an EpiPen for a patient with anaphylaxis risk — every steroid-dependent patient should have one, know how to use it, and have a family member trained in its administration"
    ],
    quiz: [
      {
        question: "A patient on prednisone 10 mg daily for rheumatoid arthritis is scheduled for elective hip replacement surgery (moderate surgical stress). The pre-operative orders do not include stress-dose steroids. What should the NP do?",
        options: [
          "No action needed — prednisone 10 mg daily is sufficient for surgical stress",
          "Contact the surgeon to add perioperative stress-dose hydrocortisone: 50 mg IV at induction, then 25 mg IV q8h × 24-48 hours, then resume oral maintenance",
          "Double the oral prednisone to 20 mg on the day of surgery only",
          "Hold prednisone on the day of surgery to avoid immunosuppression during the procedure"
        ],
        correct: 1,
        rationale: "A patient on prednisone 10 mg daily has HPA axis suppression and cannot mount an adequate cortisol stress response for a moderate surgical procedure. Hip replacement is moderate surgical stress requiring hydrocortisone 50 mg IV at induction + 25 mg q8h for 24-48 hours, then rapid taper to maintenance. Simply doubling the oral dose is insufficient for surgical stress levels. Holding steroids would be dangerous — it could cause intraoperative hemodynamic collapse. The omission of stress-dose steroids from pre-operative orders is a common and potentially fatal medication error that the NP should catch and address."
      }
    ]
  },
  "hypercalcemia-workup-np": {
    title: "Hypercalcemia Workup: NP Approach",
    cellular: {
      title: "Hypercalcemia Differential Diagnosis",
      content: "Hypercalcemia (corrected calcium > 10.5 mg/dL or ionized calcium > 5.6 mg/dL) results from increased bone resorption, increased intestinal calcium absorption, or decreased renal calcium excretion. Primary hyperparathyroidism (PHPT) and malignancy account for > 90% of cases. PHPT: autonomous PTH secretion from a parathyroid adenoma (85%), hyperplasia (10-15%), or carcinoma (< 1%) increases bone resorption (osteoclast activation via RANKL), renal calcium reabsorption (DCT), and intestinal absorption (via 1,25-dihydroxyvitamin D production). Malignancy-related mechanisms are covered in hypercalcemia-malignancy-np. Other causes: vitamin D intoxication (25-OH-D levels > 150 ng/mL), granulomatous disease (sarcoidosis, TB — macrophage 1-alpha-hydroxylase producing calcitriol), milk-alkali syndrome (excess calcium + alkali intake), thyrotoxicosis, immobilization (increased bone resorption), lithium (shifts PTH set point), thiazide diuretics (increase renal calcium reabsorption). The PTH level is the pivotal branching point in workup: elevated/inappropriately normal PTH = PTH-dependent; suppressed PTH = PTH-independent."
    },
    riskFactors: [
      "Primary hyperparathyroidism (most common cause of outpatient hypercalcemia — prevalence 1-3 per 1000 in postmenopausal women)",
      "Malignancy (most common cause of inpatient hypercalcemia)",
      "Vitamin D supplementation excess (increasingly common with widespread supplementation)",
      "Granulomatous diseases: sarcoidosis, tuberculosis, fungal infections",
      "Thiazide diuretics (unmask or worsen PHPT)",
      "Lithium therapy (5% develop hypercalcemia)",
      "Immobilization (especially in Paget disease or young patients with high bone turnover)",
      "Milk-alkali syndrome (excessive calcium + antacid intake)"
    ],
    diagnostics: [
      "Corrected calcium and ionized calcium: confirm hypercalcemia; correct total calcium for albumin",
      "PTH (intact): THE MOST IMPORTANT single test — elevated/inappropriately normal = PTH-dependent (PHPT, lithium, FHH); suppressed = PTH-independent (malignancy, vitamin D, granulomatous, thyrotoxicosis)",
      "If PTH elevated: 24-hour urine calcium/creatinine clearance ratio to distinguish PHPT (ratio > 0.02) from familial hypocalciuric hypercalcemia (FHH — ratio < 0.01; CaSR mutation, benign, no treatment needed)",
      "If PTH suppressed: PTHrP (malignancy), 25-OH vitamin D (exogenous D intoxication), 1,25-(OH)2 vitamin D/calcitriol (granulomatous disease, lymphoma), SPEP/UPEP (myeloma), TSH (thyrotoxicosis)",
      "Phosphate: low in PHPT (PTH promotes renal phosphate wasting); may be elevated in malignancy, renal failure",
      "Alkaline phosphatase: elevated with increased bone turnover (Paget, malignancy with bone metastases, PHPT with bone disease)",
      "Renal function: creatinine, eGFR (hypercalcemia can cause prerenal AKI; chronic PHPT can cause nephrocalcinosis and renal impairment)",
      "Parathyroid imaging (if PHPT confirmed): sestamibi scan + ultrasound for adenoma localization before surgery; 4D CT or PET/CT if initial imaging negative"
    ],
    management: [
      "Mild asymptomatic PHPT (calcium < 1 mg/dL above normal): observe vs. surgery based on guideline criteria (age < 50, osteoporosis, renal stones, eGFR < 60, markedly elevated calcium)",
      "Symptomatic or severe PHPT: parathyroidectomy (curative in 95-98%; minimally invasive with pre-operative localization); post-op monitoring for hungry bone syndrome (severe hypocalcemia from rapid bone remineralization after surgery)",
      "Non-surgical PHPT candidates: cinacalcet 30 mg BID (calcimimetic — activates CaSR, reduces PTH) for calcium control; bisphosphonates or denosumab for bone protection",
      "Acute management of symptomatic hypercalcemia: same regardless of cause — IV hydration, calcitonin (bridge), bisphosphonate/denosumab (sustained effect); treat underlying cause",
      "Granulomatous disease hypercalcemia: corticosteroids (prednisone 20-40 mg/day) — inhibit macrophage 1-alpha-hydroxylase, reducing calcitriol production",
      "Vitamin D intoxication: stop vitamin D, hydration, glucocorticoids (reduce calcitriol effect); severe cases may need bisphosphonate",
      "Thiazide-associated: discontinue thiazide; recheck calcium off thiazide (may unmask underlying PHPT)",
      "FHH (Ca/Cr clearance ratio < 0.01): NO TREATMENT needed — benign condition; avoid unnecessary parathyroidectomy"
    ],
    nursingActions: [
      "Systematic workup coordination: ensure PTH is drawn with initial calcium; if PTH elevated, order 24-hour urine calcium; if PTH suppressed, order PTHrP, vitamin D levels, and malignancy workup",
      "Symptom assessment: 'stones, bones, groans, moans, and psychic overtones' — nephrolithiasis, bone pain, abdominal pain/constipation, fatigue/weakness, depression/confusion; document severity",
      "Hydration assessment and management: dehydration worsens hypercalcemia; encourage oral fluids (2-3 L/day) for mild cases; IV hydration for moderate-severe",
      "Medication review: identify calcium-containing supplements, vitamin D doses, thiazides, lithium, antacids — these may cause or contribute to hypercalcemia",
      "Pre-operative parathyroidectomy care: education about surgery, post-operative calcium monitoring (q6h × 24h for hungry bone syndrome), symptoms of hypocalcemia to report (perioral numbness, tingling, muscle cramps, Chvostek/Trousseau signs)",
      "Post-parathyroidectomy monitoring: calcium and PTH levels at 6h and 24h post-op; aggressive calcium and vitamin D supplementation if hungry bone syndrome develops (can require IV calcium gluconate for severe cases)",
      "Bone density assessment: DEXA scan for all PHPT patients; osteoporosis is a surgical indication",
      "Dietary counseling: moderate calcium intake (do NOT restrict in PHPT — restriction paradoxically increases PTH); adequate vitamin D (maintain 25-OH-D 30-50 ng/mL); adequate hydration to prevent nephrolithiasis"
    ],
    signs: {
      left: [
        "Mild PHPT (calcium 10.5-11.5): often asymptomatic, incidentally discovered; may be appropriate for observation with monitoring",
        "Post-parathyroidectomy: normalizing calcium, intact remaining parathyroids, no hungry bone syndrome",
        "Vitamin D excess: calcium normalizing after D supplement discontinuation",
        "FHH confirmed (Ca/Cr ratio < 0.01): benign, no treatment needed — saves unnecessary surgery"
      ],
      right: [
        "Severe hypercalcemia (> 14 mg/dL): altered mental status, dehydration, ECG changes — medical emergency requiring IV hydration and bisphosphonate",
        "Hungry bone syndrome post-parathyroidectomy: severe hypocalcemia with tetany/seizures — IV calcium gluconate, aggressive oral calcium (6-12 g/day) and calcitriol",
        "Parathyroid carcinoma: markedly elevated calcium (often > 14), very high PTH (> 500), palpable neck mass — en bloc surgical resection required",
        "Concurrent PHPT and malignancy: both PTH and PTHrP elevated — requires treatment of both conditions"
      ]
    },
    medications: [
      {
        name: "Cinacalcet (Sensipar/Mimpara)",
        type: "Calcimimetic (Calcium-Sensing Receptor Agonist)",
        action: "Allosterically activates the calcium-sensing receptor (CaSR) on parathyroid chief cells, increasing receptor sensitivity to calcium and suppressing PTH secretion; does NOT address the underlying adenoma — controls calcium level without surgery",
        sideEffects: "Nausea (most common — take with food), hypocalcemia (over-suppression of PTH), QT prolongation, myalgia, vomiting",
        contra: "Hypocalcemia, severe hepatic impairment",
        pearl: "30 mg PO BID with food, titrate to max 90 mg QID based on calcium response. Indicated for PHPT when surgery is contraindicated or refused, and for secondary/tertiary hyperparathyroidism in CKD. Lowers calcium but does NOT improve bone density (unlike parathyroidectomy). Monitor calcium at 1 week then monthly after dose changes. Does not reduce PTH-related bone disease — surgery is still preferred when feasible."
      }
    ],
    pearls: [
      "PTH is the most important single test in the hypercalcemia workup: elevated/inappropriately normal PTH = PTH-dependent (PHPT, FHH, lithium); suppressed PTH = PTH-independent (malignancy, vitamin D, granulomatous disease) — this single branching point directs the entire subsequent workup",
      "Familial hypocalciuric hypercalcemia (FHH) mimics PHPT biochemically (mild hypercalcemia, elevated PTH) but is a benign autosomal dominant condition that does NOT require surgery — the 24-hour urine Ca/Cr clearance ratio (< 0.01 in FHH vs. > 0.02 in PHPT) is the distinguishing test; unnecessary parathyroidectomy for FHH will not cure the hypercalcemia",
      "Hungry bone syndrome after parathyroidectomy for severe PHPT can cause life-threatening hypocalcemia: after years of PTH-driven bone resorption, the 'hungry' bones rapidly take up calcium when PTH drops post-surgery; high-risk patients (very high PTH, elevated ALP, bone disease) should start calcium and calcitriol supplements before surgery"
    ],
    quiz: [
      {
        question: "A 58-year-old postmenopausal woman has incidentally discovered calcium of 11.2 mg/dL (confirmed). PTH is 88 pg/mL (elevated). 24-hour urine calcium is 320 mg/day (elevated). DEXA shows T-score -2.8 at lumbar spine. She has no history of kidney stones. What is the most appropriate management?",
        options: [
          "Observe with annual calcium and DEXA — she is asymptomatic",
          "Refer for parathyroidectomy — she meets surgical criteria with osteoporosis (T-score < -2.5)",
          "Start cinacalcet 30 mg BID to control calcium and defer surgery",
          "Check Ca/Cr clearance ratio to rule out FHH — the elevated 24h urine calcium already exceeds the FHH threshold"
        ],
        correct: 1,
        rationale: "This patient has confirmed primary hyperparathyroidism (elevated calcium + elevated PTH + elevated urinary calcium excluding FHH). She meets surgical criteria per guidelines: T-score ≤ -2.5 at any site (lumbar spine T-score -2.8 = osteoporosis). Current APA/AAES guidelines recommend parathyroidectomy for PHPT patients who meet any surgical criterion, even if 'asymptomatic' by symptom report. Parathyroidectomy will cure the PHPT and improve bone density. The elevated 24-hour urine calcium (320 mg > threshold) already effectively excludes FHH (ratio would be > 0.02). Cinacalcet lowers calcium but does not improve bone density."
      }
    ]
  },
  "hypocalcemia-algorithm-np": {
    title: "Hypocalcemia Algorithm: NP Approach",
    cellular: {
      title: "Hypocalcemia Pathophysiology & Assessment",
      content: "Hypocalcemia (corrected calcium < 8.5 mg/dL or ionized calcium < 4.6 mg/dL) results from PTH deficiency, PTH resistance, vitamin D deficiency/resistance, or calcium sequestration. PTH deficiency (hypoparathyroidism): most commonly post-surgical (thyroidectomy, parathyroidectomy — transient or permanent depending on parathyroid gland preservation); autoimmune (isolated or polyendocrine syndrome); congenital (DiGeorge syndrome — 22q11 deletion); infiltrative (hemochromatosis, Wilson disease, metastases). Vitamin D deficiency reduces intestinal calcium absorption (calcitriol activates TRPV6 calcium channels and calbindin in enterocytes). PTH resistance occurs in pseudohypoparathyroidism (Albright hereditary osteodystrophy — Gsα mutation preventing cAMP generation). Calcium sequestration: pancreatitis (saponification), hyperphosphatemia (CKD — calcium-phosphate precipitation), massive blood transfusion (citrate chelates calcium), hungry bone syndrome, rhabdomyolysis. The clinical manifestations of hypocalcemia result from increased neuromuscular excitability: peripheral nerve tingling → muscle cramps → carpopedal spasm → laryngospasm → seizures → cardiac arrhythmias."
    },
    riskFactors: [
      "Post-thyroidectomy or parathyroidectomy (most common cause of acute hypoparathyroidism — parathyroid glands damaged or devascularized)",
      "Vitamin D deficiency (prevalence 40-50% in general population; higher in elderly, dark skin, northern latitudes, obesity, malabsorption)",
      "Chronic kidney disease stage 4-5 (impaired 1-alpha-hydroxylation of vitamin D + hyperphosphatemia)",
      "Hypomagnesemia (magnesium is required for PTH secretion AND action — functional hypoparathyroidism)",
      "Massive blood transfusion (citrate in stored blood chelates calcium)",
      "Acute pancreatitis (free fatty acids bind calcium — saponification)",
      "Medications: bisphosphonates, denosumab, cinacalcet, foscarnet, cisplatin",
      "Sepsis and critical illness (multifactorial: cytokine-mediated PTH resistance, vitamin D deficiency, renal impairment)"
    ],
    diagnostics: [
      "Corrected calcium: total calcium + 0.8 × (4.0 - albumin); ionized calcium is more accurate (especially in ICU, albumin abnormalities, acid-base disturbances)",
      "PTH (intact): LOW = hypoparathyroidism; HIGH = secondary hyperparathyroidism (vitamin D deficiency, CKD, PTH resistance, hungry bone)",
      "25-hydroxyvitamin D: < 20 ng/mL = deficiency; < 10 = severe deficiency; target 30-50 ng/mL",
      "1,25-dihydroxyvitamin D (calcitriol): low in CKD (impaired 1-alpha-hydroxylase), hypoparathyroidism (PTH stimulates 1-alpha-hydroxylase)",
      "Magnesium: MUST check in all hypocalcemia — hypomagnesemia (< 1.5 mg/dL) causes functional hypoparathyroidism and PTH resistance; calcium will NOT correct until magnesium is replaced",
      "Phosphate: elevated in hypoparathyroidism and CKD (PTH normally promotes renal phosphate excretion); low in vitamin D deficiency",
      "Alkaline phosphatase: elevated in vitamin D deficiency with secondary hyperparathyroidism (increased bone turnover)",
      "ECG: prolonged QT interval (most important finding — predisposes to torsades de pointes), heart block, T-wave changes"
    ],
    management: [
      "Acute symptomatic hypocalcemia: calcium gluconate 1-2 g (10-20 mL of 10% solution) IV over 10-20 minutes with cardiac monitoring; followed by calcium gluconate infusion (6 g in 500 mL D5W over 24 hours) — titrate to keep ionized calcium > 4.0 mg/dL",
      "Calcium chloride (10%): contains 3x more elemental calcium per gram than gluconate but causes severe tissue necrosis if extravasated — use only through central line or in cardiac arrest",
      "Correct hypomagnesemia FIRST: magnesium sulfate 2 g IV over 15-30 min, then 1 g/hr maintenance; hypocalcemia will NOT correct if magnesium is depleted",
      "Chronic hypoparathyroidism: oral calcium carbonate 1-3 g elemental calcium daily in divided doses + calcitriol 0.25-2 mcg daily (calcitriol is required because PTH is needed to activate vitamin D; ergocalciferol alone is insufficient)",
      "Recombinant PTH (1-84) (Natpara): for chronic hypoparathyroidism poorly controlled on calcium/calcitriol; reduces calcium and calcitriol doses; REMS program (osteosarcoma risk in animal studies)",
      "Vitamin D deficiency: ergocalciferol 50,000 IU weekly × 8-12 weeks then maintenance 1000-2000 IU daily; severe deficiency or malabsorption may require higher doses or calcitriol",
      "CKD-related: calcitriol or vitamin D analogs (paricalcitol, doxercalciferol), phosphate binders to control hyperphosphatemia, calcium supplementation",
      "Post-thyroidectomy protocol: calcium q6h × 24h post-op; if symptomatic or calcium < 7.5, start IV calcium; oral calcium carbonate 1.5-3 g TID + calcitriol 0.5 mcg BID for prophylaxis"
    ],
    nursingActions: [
      "Acute hypocalcemia: continuous cardiac monitoring (QT prolongation → torsades de pointes risk); IV calcium gluconate administration — infuse slowly over 10-20 minutes (rapid infusion causes bradycardia and cardiac arrest); calcium is incompatible with bicarbonate in IV tubing (precipitates)",
      "Neuromuscular assessment: Chvostek sign (facial nerve tapping → ipsilateral facial muscle twitching — present in 10-25% of normal population), Trousseau sign (BP cuff inflated above SBP × 3 minutes → carpopedal spasm — more specific, positive in 94% of hypocalcemia), perioral/fingertip tingling, muscle cramps, stridor (laryngospasm)",
      "IV access: ensure patent, large-bore IV for calcium infusion; calcium gluconate can go through peripheral IV (calcium CHLORIDE must go through central line due to tissue necrosis risk with extravasation)",
      "Magnesium check and replacement: always verify magnesium level; replace if < 2.0 mg/dL; hypocalcemia will not correct until magnesium is adequate",
      "Post-thyroidectomy monitoring: calcium q6h × 24h; teach patient symptoms of hypocalcemia (tingling, numbness, cramps); ensure calcium and calcitriol are prescribed before discharge",
      "Oral calcium administration: take with meals for absorption; space calcium from levothyroxine (4 hours apart), iron, and fluoroquinolones; calcium carbonate requires stomach acid (take with food); calcium citrate can be taken without food (preferred in achlorhydria or PPI use)",
      "QT monitoring: measure QTc on ECG; if prolonged, avoid QT-prolonging medications (fluoroquinolones, antipsychotics, antiemetics); torsades risk increases with hypokalemia and hypomagnesemia in addition to hypocalcemia",
      "Patient education for chronic hypoparathyroidism: lifelong calcium and calcitriol therapy; symptoms of over-replacement (hypercalcemia: confusion, constipation, polyuria) and under-replacement (tingling, cramps); regular lab monitoring"
    ],
    signs: {
      left: [
        "Mild hypocalcemia (7.5-8.5): may be asymptomatic or cause perioral tingling; oral calcium supplementation usually sufficient",
        "Positive Trousseau sign without other significant symptoms — respond to oral calcium and calcitriol",
        "Post-thyroidectomy transient hypoparathyroidism: improving calcium trend with oral supplementation over 1-4 weeks",
        "Vitamin D deficiency correcting with ergocalciferol supplementation and calcium trending upward"
      ],
      right: [
        "Severe symptomatic hypocalcemia: tetany, seizures, laryngospasm, QT prolongation — IV calcium gluconate emergency",
        "Refractory hypocalcemia despite IV calcium: check and replace MAGNESIUM (most common overlooked cause of refractory hypocalcemia)",
        "Post-parathyroidectomy hungry bone syndrome: severe, prolonged hypocalcemia requiring IV calcium + high-dose oral calcium + calcitriol (can persist weeks to months)",
        "Torsades de pointes from prolonged QT: immediate IV magnesium sulfate 2 g, IV calcium, overdrive pacing"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate (IV)",
        type: "Intravenous Calcium Replacement",
        action: "Directly replaces ionized calcium in the extracellular fluid; stabilizes cardiac membrane potential (reduces risk of arrhythmias from prolonged QT); reduces neuromuscular excitability (prevents tetany, seizures, laryngospasm)",
        sideEffects: "Bradycardia with rapid infusion, cardiac arrest (especially in digitalized patients — calcium potentiates digoxin toxicity), tissue irritation at IV site, phlebitis",
        contra: "Hypercalcemia, concurrent digoxin therapy (relative — use extreme caution, slow infusion rate); NEVER mix with sodium bicarbonate in IV line (calcium carbonate precipitate)",
        pearl: "10% calcium gluconate: 1 g (10 mL) contains 93 mg elemental calcium. For acute symptomatic hypocalcemia: 1-2 g (10-20 mL) IV over 10-20 minutes with cardiac monitoring, then 6 g in 500 mL D5W over 24h continuous infusion. ALWAYS infuse slowly — rapid infusion can cause cardiac arrest. Preferred over calcium chloride for peripheral IV (less tissue necrosis). Check ionized calcium q4-6h during infusion. Digitalized patients: infuse even more slowly (increased digoxin sensitivity with calcium)."
      },
      {
        name: "Calcitriol (1,25-dihydroxyvitamin D)",
        type: "Active Vitamin D",
        action: "Active form of vitamin D — does NOT require renal 1-alpha-hydroxylation or PTH stimulation for activation; directly increases intestinal calcium absorption (upregulates TRPV6 and calbindin), reduces renal calcium excretion, and promotes bone calcium mobilization",
        sideEffects: "Hypercalcemia (monitor calcium closely — narrow therapeutic window), hypercalciuria (kidney stone risk), hyperphosphatemia (if combined with excess dietary phosphorus)",
        contra: "Hypercalcemia, hyperphosphatemia (correct first)",
        pearl: "0.25-2 mcg PO daily for hypoparathyroidism. CRITICAL: in hypoparathyroidism, calcitriol (active D) is required — ergocalciferol (D2) or cholecalciferol (D3) require PTH-stimulated renal 1-alpha-hydroxylation, which is absent without PTH. Monitor calcium weekly during dose adjustment, then monthly when stable. Also used in CKD (impaired 1-alpha-hydroxylase). Onset of action 1-3 days (much faster than ergocalciferol which takes weeks). This rapid onset is both an advantage (quick correction) and risk (hypercalcemia develops quickly with dose excess)."
      }
    ],
    pearls: [
      "Magnesium is the most commonly overlooked cause of refractory hypocalcemia — hypomagnesemia impairs BOTH PTH secretion (from parathyroid glands) AND PTH action (at target organs); calcium will NOT normalize until magnesium is replaced; always check and replace magnesium in any patient with hypocalcemia that is not responding to calcium administration",
      "Calcium gluconate is safe for peripheral IV; calcium CHLORIDE contains 3x more elemental calcium but causes severe tissue necrosis with extravasation and must go through a central line — in emergencies without central access, use calcium gluconate peripherally",
      "Post-thyroidectomy hypocalcemia protocol: check calcium q6h × 24h; start oral calcium carbonate 1.5-3 g TID + calcitriol 0.5 mcg BID prophylactically in high-risk patients (total thyroidectomy, central neck dissection, inadvertent parathyroidectomy); PTH level at 4-6 hours post-op predicts permanent vs. transient hypoparathyroidism (PTH < 10 pg/mL = high risk of permanent)"
    ],
    quiz: [
      {
        question: "A patient 12 hours post-total thyroidectomy develops perioral tingling, fingertip numbness, and a positive Trousseau sign. Calcium is 7.2 mg/dL, PTH 4 pg/mL, magnesium 2.1 mg/dL. What is the most appropriate management?",
        options: [
          "Observe and recheck calcium in 6 hours — mild hypocalcemia post-thyroidectomy is expected and self-resolving",
          "Administer calcium gluconate 1-2 g IV over 10-20 minutes, start calcium gluconate infusion, begin oral calcium carbonate and calcitriol",
          "Give calcium chloride 1 g IV push for rapid correction",
          "Administer magnesium sulfate 2 g IV first — magnesium must be corrected before calcium will normalize"
        ],
        correct: 1,
        rationale: "This patient has symptomatic post-thyroidectomy hypocalcemia (Trousseau positive, perioral tingling) with confirmed low PTH (indicating hypoparathyroidism). Magnesium is normal (2.1) so magnesium replacement is not the priority. Treatment: IV calcium gluconate 1-2 g over 10-20 minutes for acute symptoms (safe through peripheral IV), followed by calcium gluconate infusion for sustained correction, plus oral calcium carbonate 1.5-3 g TID and calcitriol 0.5-1 mcg BID (calcitriol is essential because absent PTH means the body cannot activate vitamin D). Calcium chloride should NOT be given IV push through peripheral IV (tissue necrosis risk). The very low PTH (4 pg/mL) suggests permanent hypoparathyroidism — this patient will likely need lifelong calcium and calcitriol."
      }
    ]
  },
  "hyperprolactinemia-workup-np": {
    title: "Hyperprolactinemia: NP Workup",
    cellular: {
      title: "Prolactin Physiology & Hyperprolactinemia",
      content: "Prolactin is secreted by lactotroph cells in the anterior pituitary and is unique among pituitary hormones in being under tonic inhibitory control by dopamine from the tuberoinfundibular pathway. Dopamine acts on D2 receptors on lactotrophs, inhibiting both prolactin synthesis and secretion. Any interruption of this dopaminergic inhibition causes hyperprolactinemia. Causes are classified as: physiological (pregnancy — estrogen stimulates lactotroph hyperplasia; lactation; stress; sleep), pharmacological (most common pathological cause — antipsychotics, metoclopramide, and other D2 receptor blockers; SSRIs; verapamil), and pathological (prolactinoma — micro < 10 mm or macro ≥ 10 mm; stalk effect — any sellar/suprasellar mass compressing the pituitary stalk interrupts dopamine delivery, causing mild hyperprolactinemia < 200 ng/mL; hypothyroidism — TRH stimulates prolactin; CKD — reduced prolactin clearance). The degree of prolactin elevation helps differentiate: mild (25-100 ng/mL) suggests medication, stalk effect, hypothyroidism; moderate (100-250) may be microprolactinoma or stalk effect; markedly elevated (> 250) is virtually diagnostic of macroprolactinoma. The 'hook effect' — a laboratory artifact — can cause falsely low prolactin in very large macroprolactinomas; serial dilution of the sample corrects this."
    },
    riskFactors: [
      "Antipsychotic medication use (most common pharmacological cause — risperidone highest risk, followed by haloperidol; aripiprazole and quetiapine least likely)",
      "Prolactinoma (most common functioning pituitary adenoma — micro > macro)",
      "Pregnancy and lactation (physiological — prolactin rises throughout pregnancy to 200+ ng/mL at term)",
      "Hypothyroidism (TRH stimulates prolactin release)",
      "Other pituitary/sellar lesions compressing the stalk (craniopharyngioma, meningioma, Rathke cleft cyst)",
      "CKD (reduced prolactin clearance)",
      "Other medications: metoclopramide, domperidone, SSRIs, verapamil, opioids, methyldopa",
      "Chest wall irritation: herpes zoster, post-thoracotomy (afferent neural pathways stimulate prolactin)"
    ],
    diagnostics: [
      "Serum prolactin: morning fasting preferred (stress and meals can mildly elevate); confirm elevation on repeat testing",
      "Degree of elevation guides differential: < 100 ng/mL → medications, stalk effect, hypothyroidism, CKD; 100-250 → microprolactinoma or large stalk compression; > 250 → macroprolactinoma (virtually diagnostic)",
      "TSH: rule out hypothyroidism (TRH stimulates prolactin)",
      "Pregnancy test: in women of reproductive age",
      "BMP/creatinine: rule out CKD",
      "Medication review: comprehensive — antipsychotics, antiemetics, SSRIs, opioids, verapamil",
      "Pituitary MRI with gadolinium: if no pharmacological or physiological cause identified; identifies prolactinoma (micro vs. macro), stalk compression from non-functioning adenoma, other sellar pathology",
      "Visual field testing: for macroadenomas (may compress optic chiasm causing bitemporal hemianopsia)",
      "Hook effect testing: if large macroadenoma seen on MRI but prolactin is only mildly elevated — request serial dilution of sample to unmask true (much higher) prolactin level"
    ],
    management: [
      "Medication-induced: if clinically appropriate, taper/switch to prolactin-sparing antipsychotic (aripiprazole, quetiapine); collaborate with psychiatry — do NOT independently change psychiatric medications",
      "Microprolactinoma: dopamine agonist first-line — cabergoline 0.25-0.5 mg twice weekly (preferred — more effective, better tolerated) or bromocriptine 1.25-2.5 mg BID-TID (nausea common — start low, take at bedtime with food)",
      "Macroprolactinoma: cabergoline (higher doses may be needed — up to 1 mg twice weekly or more); expect tumor shrinkage in 80-90% within 3-6 months; normalize prolactin in 80%",
      "Surgical (transsphenoidal): reserved for cabergoline-resistant prolactinomas, medication intolerance, CSF leak from tumor shrinkage, or patient preference; not first-line (70-80% cure for micro, 30-50% for macro)",
      "Hypothyroidism-related: treat with levothyroxine — prolactin normalizes as TSH normalizes",
      "Pregnancy and prolactinoma: discontinue cabergoline when pregnancy confirmed (most microprolactinomas do not enlarge; macroprolactinomas may enlarge — visual field monitoring each trimester)",
      "Monitoring: prolactin levels at 3 months then annually; MRI at 1 year then per clinical need; try cabergoline withdrawal after 2+ years of normal prolactin and tumor shrinkage (30-40% maintain normal prolactin off medication)",
      "Macroprolactin screening: if prolactin elevated but patient is asymptomatic, request macroprolactin testing — macroprolactin (big-big prolactin) is biologically inactive and causes laboratory elevation without clinical significance"
    ],
    nursingActions: [
      "Comprehensive medication review: identify ALL dopamine-blocking medications (antipsychotics, antiemetics, opioids); this is the most common cause of mild-moderate hyperprolactinemia and must be excluded before further workup",
      "Symptom assessment: women — menstrual irregularity (oligomenorrhea, amenorrhea), galactorrhea, infertility, decreased libido, vaginal dryness, bone loss; men — erectile dysfunction, decreased libido, gynecomastia, infertility, decreased muscle mass, bone loss",
      "Cabergoline education: take with food at bedtime to minimize nausea/dizziness; start low dose and increase gradually; report dizziness, headache, visual changes; sexual function typically improves within weeks",
      "Visual field monitoring: for macroprolactinomas — baseline formal visual fields, repeat if symptoms change or tumor grows; patients should report any new visual disturbance immediately",
      "Bone density assessment: prolonged hyperprolactinemia causes hypogonadism which leads to osteoporosis — DEXA scan at baseline if longstanding disease",
      "Fertility counseling: women — prolactinoma is the most common pituitary cause of infertility; treatment with cabergoline usually restores ovulation; discuss contraception (may become fertile quickly with treatment); pregnancy management planning",
      "Cardiac valve monitoring: high-dose cabergoline (> 2 mg/week as used in Parkinson disease) associated with cardiac valve fibrosis (5-HT2B receptor mechanism); at standard prolactinoma doses, risk is minimal but echocardiogram is reasonable with long-term use at higher doses",
      "Medication withdrawal trial: after 2+ years of cabergoline with normalized prolactin and tumor shrinkage, discuss trial discontinuation — monitor prolactin monthly × 3 months, then q3 months × 1 year; resume if prolactin re-elevates"
    ],
    signs: {
      left: [
        "Medication-induced hyperprolactinemia (PRL 25-100 ng/mL) resolving after antipsychotic switch",
        "Microprolactinoma responding to cabergoline: normalizing prolactin, restoring menses, tumor shrinking on MRI",
        "Asymptomatic mild hyperprolactinemia with macroprolactin confirmed (biologically inactive — no treatment needed)",
        "Successful cabergoline withdrawal: normal prolactin maintained off medication after 2+ year trial"
      ],
      right: [
        "Macroprolactinoma with visual field deficit from optic chiasm compression — urgent cabergoline initiation; if no rapid response, consider surgery",
        "Pituitary apoplexy: sudden headache, visual loss, cranial nerve palsies in patient with prolactinoma — neurosurgical emergency",
        "Cabergoline-resistant prolactinoma (10-15%): prolactin remains elevated and tumor does not shrink despite adequate doses — surgical referral",
        "Hook effect: large macroadenoma on MRI with mild prolactin elevation — request serial dilution to reveal true (markedly elevated) prolactin level; false-normal prolactin can lead to misdiagnosis and inappropriate surgery for 'non-functioning adenoma'"
      ]
    },
    medications: [
      {
        name: "Cabergoline (Dostinex)",
        type: "Dopamine D2 Receptor Agonist (Ergot-derived)",
        action: "Long-acting, highly selective D2 receptor agonist on pituitary lactotrophs; suppresses prolactin synthesis and secretion; induces tumor cell apoptosis and shrinkage in prolactinomas; twice-weekly dosing due to long elimination half-life (63-69 hours)",
        sideEffects: "Nausea, dizziness, headache, nasal congestion, constipation; rare: impulse control disorders (gambling, hypersexuality — dopamine agonist class effect), cardiac valve fibrosis (at high Parkinson doses > 2 mg/week; minimal risk at prolactinoma doses), CSF rhinorrhea (if tumor shrinks rapidly creating fistula in invasive macroadenomas)",
        contra: "Uncontrolled hypertension, hypersensitivity to ergot derivatives, history of cardiac valvulopathy, severe hepatic impairment",
        pearl: "Start 0.25 mg twice weekly, titrate by 0.25 mg q4 weeks based on prolactin response. Normalizes prolactin in ~80% and shrinks tumors in ~90% of prolactinomas. Superior to bromocriptine (better efficacy, fewer side effects, convenient dosing). At standard prolactinoma doses (0.25-1 mg twice weekly), cardiac valve risk is minimal — echocardiogram only needed at higher doses or with long-term use. After 2+ years with normal PRL and tumor shrinkage, trial discontinuation — 30-40% maintain normal PRL off medication."
      }
    ],
    pearls: [
      "The degree of prolactin elevation is diagnostically important: PRL > 250 ng/mL is virtually diagnostic of a macroprolactinoma; PRL 25-100 ng/mL suggests medications, stalk effect, or hypothyroidism; if a large pituitary mass is seen on MRI but PRL is only mildly elevated (50-100), consider the 'hook effect' (falsely low result) or a non-functioning adenoma causing stalk compression (not a prolactinoma)",
      "The 'hook effect' (high-dose hook) occurs when extremely high prolactin levels saturate BOTH the capture and detection antibodies in the immunometric assay, preventing sandwich formation and producing a falsely normal/low result — if a large macroadenoma is present, always request serial dilution of the sample; misdiagnosis as 'non-functioning adenoma' leads to unnecessary surgery instead of medical management with cabergoline",
      "DO NOT independently change psychiatric medications to treat drug-induced hyperprolactinemia — collaborate with psychiatry; aripiprazole (partial D2 agonist) can be added to existing antipsychotic to lower prolactin without compromising psychotic symptom control; quetiapine and clozapine have the lowest prolactin-elevating potential"
    ],
    quiz: [
      {
        question: "A 35-year-old woman has amenorrhea and galactorrhea. Prolactin is 340 ng/mL. MRI shows a 2.5 cm pituitary macroadenoma abutting the optic chiasm. Visual fields show early bitemporal hemianopsia. What is the first-line treatment?",
        options: [
          "Urgent transsphenoidal surgery given optic chiasm compression",
          "Cabergoline — dopamine agonist therapy is first-line for prolactinomas regardless of size, and tumor shrinkage typically relieves chiasm compression within days to weeks",
          "Radiation therapy to shrink the tumor and preserve pituitary function",
          "Observation with serial MRI — prolactinomas rarely cause permanent visual damage"
        ],
        correct: 1,
        rationale: "Prolactin > 250 ng/mL with a pituitary macroadenoma is virtually diagnostic of a macroprolactinoma. First-line treatment is ALWAYS a dopamine agonist (cabergoline), even with visual field compromise. Tumor shrinkage begins within days and visual improvement often occurs within 1-2 weeks. Surgery is reserved for cabergoline-resistant tumors, medication intolerance, or pituitary apoplexy. This is one of the few tumors where medical therapy is more effective than surgery. Observation is inappropriate with active chiasm compression."
      }
    ]
  },
  "adrenal-incidentaloma-np": {
    title: "Adrenal Incidentaloma: NP Workup",
    cellular: {
      title: "Adrenal Incidentaloma Assessment",
      content: "An adrenal incidentaloma is an adrenal mass ≥ 1 cm discovered on imaging performed for indications other than suspected adrenal disease. Prevalence is 3-7% on abdominal CT (increases with age — up to 10% in elderly). Most are non-functioning cortical adenomas (80%). The two critical questions in evaluation are: (1) Is it hormonally active? (subclinical Cushing > pheochromocytoma > primary aldosteronism > adrenal carcinoma; functional tumors require treatment regardless of size), and (2) Is it malignant? (adrenocortical carcinoma is rare but aggressive; size > 4-6 cm, irregular borders, heterogeneous enhancement, washout < 50% on delayed CT are concerning features). CT characteristics guide risk assessment: Hounsfield units (HU) < 10 on unenhanced CT indicates lipid-rich adenoma (benign — no further imaging needed); HU > 10 requires contrast washout study (absolute washout > 60% and relative washout > 40% at 15 minutes suggests adenoma). MRI signal drop on out-of-phase compared to in-phase images (India ink artifact at tumor-tissue interface) indicates intracellular lipid = adenoma."
    },
    riskFactors: [
      "Age (prevalence increases with age — up to 10% by age 70)",
      "Obesity and metabolic syndrome (associated with non-functioning adenomas)",
      "Hypertension, diabetes (may indicate subclinical autonomous cortisol secretion)",
      "Known extra-adrenal malignancy (adrenal metastasis is common — lung, breast, melanoma, kidney, lymphoma)",
      "Large mass size > 4-6 cm (increased malignancy risk)",
      "Rapid growth on serial imaging",
      "Young age with large adrenal mass (higher index of suspicion for adrenal carcinoma)"
    ],
    diagnostics: [
      "Hormonal workup (ALL adrenal incidentalomas ≥ 1 cm require functional assessment):",
      "1. Pheochromocytoma screening: plasma free metanephrines (MANDATORY — undiagnosed pheo is life-threatening during any future surgery, even non-adrenal)",
      "2. Cortisol excess: 1 mg overnight dexamethasone suppression test (DST) — cortisol > 1.8 mcg/dL at 8 AM = abnormal (possible autonomous cortisol secretion); cortisol > 5.0 = likely Cushing syndrome",
      "3. Aldosterone/renin ratio: ONLY if hypertensive or hypokalemic (not needed if normotensive with normal K+)",
      "4. Sex steroids (DHEA-S, testosterone, estradiol): if large mass (> 4 cm) or clinical virilization — elevated androgens suggest adrenocortical carcinoma",
      "CT adrenal protocol: unenhanced HU < 10 = lipid-rich adenoma (benign — high specificity); HU > 10 → enhanced CT with 15-minute delayed washout (absolute washout > 60% = adenoma, < 60% = indeterminate/suspicious)",
      "MRI chemical shift imaging: signal dropout on opposed-phase = intracellular lipid = adenoma; no dropout = indeterminate (may be metastasis, carcinoma, or pheo)",
      "PET/CT with FDG: may differentiate benign from malignant — adenomas typically non-avid; carcinomas and metastases are FDG-avid",
      "Biopsy: ONLY when metastasis is suspected (known primary malignancy) AND pheochromocytoma has been biochemically excluded — never biopsy without excluding pheo first (life-threatening hypertensive crisis)"
    ],
    management: [
      "Lipid-rich adenoma (HU < 10, < 4 cm, non-functional): no surgery needed; repeat imaging at 6-12 months then annually × 2-4 years; repeat hormonal assessment annually × 5 years",
      "Subclinical Cushing (autonomous cortisol secretion without overt Cushing phenotype): consider surgery if comorbidities potentially attributable to cortisol (uncontrolled diabetes, hypertension, osteoporosis, obesity); if no surgery, monitor metabolic parameters closely",
      "Pheochromocytoma: alpha-blockade → surgical resection (as per pheochromocytoma lesson)",
      "Primary aldosteronism: ARR → confirmatory testing → AVS → medical or surgical management (as per hyperaldosteronism lesson)",
      "Suspicious for carcinoma: size > 4-6 cm, rapid growth, HU > 10 with poor washout, heterogeneous, irregular borders, elevated androgens → surgical resection (open adrenalectomy for large/suspicious masses)",
      "Adrenal metastasis: biopsy may be indicated for tissue diagnosis (AFTER excluding pheo); management guided by primary malignancy treatment",
      "Bilateral adrenal masses: congenital adrenal hyperplasia (17-OHP level), bilateral metastases, bilateral pheochromocytomas (genetic syndrome screening), BMAH",
      "Post-adrenalectomy: morning cortisol to assess for contralateral adrenal suppression if ipsilateral tumor was cortisol-secreting; may need temporary steroid replacement"
    ],
    nursingActions: [
      "Ensure complete hormonal workup is performed: plasma metanephrines (mandatory for ALL), 1 mg DST (mandatory for ALL), ARR (if hypertensive/hypokalemic); this workup must be done BEFORE any surgical planning",
      "Imaging follow-up scheduling: establish surveillance plan based on initial characteristics; lipid-rich adenoma < 4 cm → repeat CT at 12 months; indeterminate features → repeat CT at 6 months; set up tracking system to prevent lost follow-up",
      "Patient education: explain that most adrenal incidentalomas are benign and non-functional; the workup is to ensure nothing needs treatment; surveillance imaging is important to track any growth",
      "Pre-operative coordination: if surgery planned, ensure pheo has been biochemically excluded (even if not the suspected diagnosis — pheo can mimic any adrenal mass); if pheo confirmed, do NOT proceed to surgery without alpha-blockade",
      "Dexamethasone suppression test education: patient takes dexamethasone 1 mg PO at 11 PM the night before; fasting blood draw at 8 AM for cortisol; no special dietary preparation needed; stress, illness, or estrogen therapy (OCP) can cause false positives",
      "Document incidentaloma discovery clearly in medical record with surveillance plan — these are frequently 'lost to follow-up' after the initial imaging study, and interval growth of a malignant lesion can be missed",
      "Coordinate with primary care, endocrinology, and surgery as needed — adrenal incidentalomas may be discovered by various providers, and ownership of follow-up must be clearly established",
      "Anxiety management: being told you have an 'adrenal mass' can be alarming — reassure that the vast majority are benign, explain the step-by-step evaluation process, and provide timeline for results"
    ],
    signs: {
      left: [
        "Lipid-rich adenoma (HU < 10, < 4 cm): non-functional on hormonal workup — surveillance only, high likelihood benign",
        "Stable or slightly decreasing size on 12-month follow-up imaging — reassuring",
        "Normal functional assessment (metanephrines, DST, ARR) at annual follow-up",
        "Patient understanding and compliance with surveillance imaging schedule"
      ],
      right: [
        "Mass > 6 cm or rapidly growing (> 1 cm in 12 months) — high suspicion for adrenocortical carcinoma; urgent surgical referral",
        "Unenhanced HU > 10 with poor washout and heterogeneous enhancement — indeterminate; may need PET/CT or surgical excision",
        "Elevated DHEA-S or testosterone in female patient with large adrenal mass — strongly suggests adrenocortical carcinoma (androgen co-secretion)",
        "Undiagnosed pheochromocytoma in patient scheduled for non-adrenal surgery — CANCEL surgery until pheo is treated; this is why metanephrine screening is mandatory for ALL incidentalomas"
      ]
    },
    medications: [
      {
        name: "Dexamethasone 1 mg (overnight suppression test)",
        type: "Synthetic Glucocorticoid (diagnostic use)",
        action: "Provides potent negative feedback to the HPA axis at the hypothalamus and pituitary; in normal individuals, 1 mg at bedtime suppresses ACTH and morning cortisol (< 1.8 mcg/dL); autonomous cortisol-secreting adrenal adenomas are not suppressed by this feedback",
        sideEffects: "Single dose: insomnia, mild mood change (minimal clinical significance)",
        contra: "None for single diagnostic dose",
        pearl: "Patient takes 1 mg dexamethasone PO at 11 PM; blood draw at 8 AM for cortisol. Cortisol < 1.8 mcg/dL = normal suppression (Cushing excluded). Cortisol 1.8-5.0 = possible autonomous cortisol secretion (MACS — mild autonomous cortisol secretion). Cortisol > 5.0 = likely Cushing syndrome. False positives: estrogen use (OCP — increases CBG, elevating total cortisol), acute illness, depression, alcohol use, CYP3A4 inducers (phenytoin, carbamazepine) that accelerate dexamethasone metabolism."
      }
    ],
    pearls: [
      "Plasma free metanephrines must be checked in EVERY adrenal incidentaloma — even if the mass 'looks benign' on CT; an undiagnosed pheochromocytoma that is biopsied or manipulated during unrelated surgery can cause a fatal hypertensive crisis; this is a non-negotiable screening test",
      "CT Hounsfield units < 10 on unenhanced imaging is the single most useful imaging characteristic — it identifies a lipid-rich adenoma with > 98% specificity for benign disease; these patients need only surveillance and functional assessment, not further imaging workup",
      "Adrenal incidentalomas are commonly 'lost to follow-up' — studies show 20-30% of patients do not receive recommended surveillance imaging or hormonal reassessment; establishing clear ownership of follow-up and automated tracking/reminders is essential to prevent missed malignancies or undetected functional tumors"
    ],
    quiz: [
      {
        question: "A 55-year-old patient has a 2.5 cm right adrenal mass discovered incidentally on CT for abdominal pain evaluation. Unenhanced CT shows Hounsfield units of 5. BP is 128/82. K+ is 4.2 mEq/L. What is the appropriate workup?",
        options: [
          "No workup needed — HU < 10 confirms benign adenoma; discharge from follow-up",
          "Plasma free metanephrines and 1 mg overnight dexamethasone suppression test; ARR not needed (normotensive, normal K+); surveillance imaging at 12 months",
          "Immediate PET-CT to rule out malignancy, followed by adrenal biopsy",
          "Surgical referral for adrenalectomy — any adrenal mass > 2 cm requires removal"
        ],
        correct: 1,
        rationale: "HU < 10 confirms a lipid-rich lesion consistent with benign adenoma (imaging-wise), but ALL adrenal incidentalomas ≥ 1 cm require functional assessment regardless of imaging characteristics. Mandatory workup includes: (1) plasma free metanephrines (to exclude pheochromocytoma — this is non-negotiable), (2) 1 mg overnight DST (to assess for autonomous cortisol secretion). ARR is only needed if hypertensive or hypokalemic (this patient is normotensive with normal K+). Surveillance imaging at 12 months confirms stability. No biopsy is needed for a typical lipid-rich adenoma. Surgery is not indicated for a 2.5 cm non-functional benign-appearing adenoma."
      }
    ]
  },
  "glucagonoma-np": {
    title: "Glucagonoma: NP Management",
    cellular: {
      title: "Glucagonoma Pathophysiology",
      content: "Glucagonomas are rare pancreatic alpha-cell neuroendocrine tumors that secrete excess glucagon, producing the classic '4D syndrome': dermatitis (necrolytic migratory erythema — pathognomonic), diabetes (glucagon-induced gluconeogenesis and glycogenolysis), deep vein thrombosis (hypercoagulability — 30% incidence), and depression. Necrolytic migratory erythema (NME) is the most distinctive feature — it begins as erythematous patches that develop central clearing with peripheral blistering, crusting, and desquamation, primarily affecting the groin, perineum, lower extremities, and perioral area. The mechanism involves hypoaminoacidemia (glucagon promotes hepatic amino acid uptake for gluconeogenesis, depleting plasma amino acids and causing epidermal necrosis from amino acid deficiency) combined with zinc and essential fatty acid deficiency. Most glucagonomas are malignant (60-80% have metastases at diagnosis) and are typically large (> 5 cm) due to delayed diagnosis."
    },
    riskFactors: [
      "MEN1 syndrome (rare association — glucagonoma is uncommon even within MEN1)",
      "Age 50-70 years (peak incidence)",
      "No specific modifiable risk factors identified",
      "Delayed diagnosis is common — median delay 3-5 years from symptom onset to diagnosis due to rarity of the condition"
    ],
    diagnostics: [
      "Serum glucagon: markedly elevated (> 500 pg/mL strongly suggestive; > 1000 pg/mL virtually diagnostic; normal < 150 pg/mL)",
      "CT/MRI abdomen: large pancreatic mass (usually body/tail — where alpha cells are concentrated); liver metastases in 60-80% at diagnosis",
      "Skin biopsy of NME: necrolysis of superficial epidermis with acanthosis; often misdiagnosed as eczema, psoriasis, or pemphigus",
      "Plasma amino acids: diffusely low (glucagon drives hepatic amino acid uptake for gluconeogenesis)",
      "Blood glucose/HbA1c: diabetes or glucose intolerance (glucagon is counter-regulatory to insulin)",
      "Ga-68 DOTATATE PET/CT: somatostatin receptor imaging for staging and PRRT candidacy",
      "CBC: normochromic normocytic anemia (common in glucagonoma)",
      "Zinc level: often low (contributes to NME pathogenesis)"
    ],
    management: [
      "Surgical resection: curative if localized (distal pancreatectomy for body/tail tumors); debulking even with metastases may improve symptoms",
      "Somatostatin analogs (octreotide LAR): control glucagon secretion, improve NME and diabetes; antiproliferative effect on tumor",
      "NME treatment: zinc supplementation (220 mg zinc sulfate daily), amino acid infusion (10% amino acid solution IV for acute NME), essential fatty acid supplementation — addresses the nutritional deficiency driving epidermal necrosis",
      "DVT prophylaxis: anticoagulation (enoxaparin or DOAC) — 30% thrombotic event rate; consider indefinite anticoagulation if metastatic",
      "Diabetes management: usually mild-moderate; may respond to somatostatin analog therapy; insulin if needed",
      "Hepatic-directed therapy for liver metastases: embolization, TACE, Y-90 radioembolization",
      "PRRT: Lu-177 DOTATATE for SSTR-positive progressive disease",
      "Nutritional optimization: high-protein diet, amino acid supplementation, zinc, omega-3 fatty acids; TPN for severe malnutrition"
    ],
    nursingActions: [
      "Skin assessment and NME management: examine skin at each visit — groin, perineum, lower extremities, perioral area; NME can be extremely painful and disabling; document extent and stage of lesions",
      "Nutritional assessment: weight trend, albumin, amino acid levels, zinc; ensure high-protein diet and supplementation; consult dietitian",
      "DVT surveillance: assess for leg swelling, calf tenderness, dyspnea (PE); ensure anticoagulation is ordered and monitored; educate on signs of DVT/PE",
      "Blood glucose monitoring: DM management as needed; somatostatin analogs may improve or worsen glycemic control (also suppresses insulin secretion)",
      "Somatostatin analog injection teaching: proper technique, site rotation, schedule adherence",
      "Psychosocial support: the combination of visible skin disease, diabetes, and cancer diagnosis is psychologically challenging; screen for depression (one of the 4 D's); facilitate mental health referral",
      "Coordinate multidisciplinary care: oncology, endocrinology, dermatology, nutrition, surgery"
    ],
    signs: {
      left: [
        "NME improving with somatostatin analog therapy and nutritional supplementation",
        "Glucagon levels declining on treatment with stable disease on imaging",
        "Diabetes well-controlled on oral agents or somatostatin analog",
        "No thrombotic events with adequate anticoagulation"
      ],
      right: [
        "Severe NME with extensive desquamation and secondary infection — IV amino acid infusion needed",
        "Malignant glucagonoma with progressive liver metastases despite somatostatin analog — systemic therapy or PRRT",
        "Pulmonary embolism or deep vein thrombosis despite prophylaxis — escalate anticoagulation",
        "Severe malnutrition with cachexia — TPN may be required"
      ]
    },
    medications: [
      {
        name: "Octreotide LAR (for glucagonoma)",
        type: "Somatostatin Analog",
        action: "Inhibits glucagon secretion from tumor cells via SSTR2; reduces NME severity, improves diabetes control, and has antiproliferative effect on tumor growth",
        sideEffects: "Cholelithiasis, steatorrhea, hyperglycemia (paradoxical — also suppresses insulin), injection site reactions",
        contra: "Known hypersensitivity",
        pearl: "20-30 mg IM every 4 weeks. Response rate for symptom control ~70%. NME improvement typically seen within 1-2 weeks. Monitor blood glucose closely — octreotide can improve or worsen glycemia (suppresses both glucagon and insulin). May not fully control glucagon levels; addition of amino acid infusions and zinc supplementation significantly improves NME."
      }
    ],
    pearls: [
      "Necrolytic migratory erythema (NME) is PATHOGNOMONIC for glucagonoma — it is often misdiagnosed as eczema, psoriasis, pemphigus, or dermatitis for years before the correct diagnosis; any migratory, recurrent, erosive dermatitis involving the groin, perineum, or perioral area should prompt glucagon level measurement",
      "The '4 D's' of glucagonoma: Dermatitis (NME), Diabetes, DVT, Depression — remembering this mnemonic helps recognize the syndrome in clinical practice",
      "NME is driven by amino acid deficiency (glucagon diverts amino acids to hepatic gluconeogenesis) — IV amino acid infusion can dramatically improve skin lesions even before definitive tumor treatment; zinc supplementation is also critical"
    ],
    quiz: [
      {
        question: "A patient presents with a painful, migratory erythematous rash with blistering and crusting in the groin and perioral area, new-onset diabetes, and unexplained DVT. Labs show normocytic anemia and diffusely low plasma amino acid levels. What is the most likely diagnosis and initial workup?",
        options: [
          "Celiac disease with dermatitis herpetiformis — order tTG antibodies and skin biopsy",
          "Glucagonoma syndrome — order serum glucagon level and CT abdomen to identify pancreatic tumor",
          "Pemphigus vulgaris — order direct immunofluorescence and anti-desmoglein antibodies",
          "Zinc deficiency from malnutrition — supplement zinc and reassess in 4 weeks"
        ],
        correct: 1,
        rationale: "The combination of necrolytic migratory erythema (distinctive rash in groin/perioral area), new-onset diabetes, DVT, and hypoaminoacidemia is classic for glucagonoma syndrome (the '4 D's'). The initial workup should include serum glucagon level (expected to be markedly elevated > 500 pg/mL) and CT abdomen to identify the pancreatic tumor and assess for hepatic metastases. While zinc deficiency contributes to NME, it is a consequence of the glucagonoma, not the primary diagnosis."
      }
    ]
  },
  "vipoma-np": {
    title: "VIPoma: NP Management",
    cellular: {
      title: "VIPoma (Verner-Morrison Syndrome)",
      content: "VIPomas are rare pancreatic neuroendocrine tumors that secrete vasoactive intestinal peptide (VIP), causing the Verner-Morrison syndrome (also called WDHA: Watery Diarrhea, Hypokalemia, Achlorhydria). VIP is a 28-amino acid neuropeptide that acts on VIP receptors (VPAC1 and VPAC2) in the intestinal epithelium, stimulating massive secretion of water and electrolytes into the intestinal lumen. VIP activates adenylyl cyclase, increasing intracellular cAMP, which opens chloride channels (CFTR) and inhibits NaCl absorption — a mechanism similar to cholera toxin (hence the term 'pancreatic cholera'). The resulting secretory diarrhea is voluminous (> 3 L/day, often > 5 L/day), watery, persists during fasting (distinguishing from osmotic diarrhea), and causes severe potassium depletion (hypokalemia can be life-threatening). VIP also inhibits gastric acid secretion (achlorhydria), causes facial flushing (vasodilation), and can cause hypercalcemia (25% — VIP stimulates osteoclast activity)."
    },
    riskFactors: [
      "MEN1 (rare association)",
      "Age 40-60 years typical; children may develop VIPoma from ganglioneuroblastoma or ganglioneuroma (extra-pancreatic location)",
      "No other specific risk factors — VIPomas are rare (1 per 10 million per year)"
    ],
    diagnostics: [
      "Serum VIP: markedly elevated (> 75 pg/mL; normal < 50 pg/mL; often > 200 pg/mL in VIPoma) — specimen must be collected in pre-chilled EDTA tube and processed promptly (VIP degrades rapidly)",
      "Stool volume and electrolytes: secretory pattern — large volume (> 700 mL/day, often > 3 L/day), stool osmotic gap < 50 mOsm/kg, persists during fasting",
      "BMP: hypokalemia (often severe < 2.5 — major cause of morbidity and mortality), metabolic acidosis (bicarbonate loss in stool), hyperglycemia (VIP is glucagon-like), hypercalcemia (25%)",
      "CT/MRI abdomen: pancreatic mass (most are in body/tail; most are > 3 cm at diagnosis; 50-70% have metastases at diagnosis)",
      "Ga-68 DOTATATE PET: somatostatin receptor imaging for staging",
      "Serum chromogranin A: elevated (non-specific but useful for monitoring)",
      "Gastric pH analysis: achlorhydria (VIP inhibits gastric acid secretion)",
      "Rule out other causes of secretory diarrhea: carcinoid (5-HIAA), gastrinoma (gastrin), celiac disease (tTG), inflammatory bowel disease, laxative abuse, microscopic colitis"
    ],
    management: [
      "Aggressive fluid and electrolyte replacement: patients may lose > 5 L/day of potassium-rich fluid; IV NS with high-dose potassium replacement (40-80 mEq/L); bicarbonate replacement for metabolic acidosis; this is life-saving and must be the first intervention",
      "Octreotide 200-300 mcg SC q8h initially for acute symptom control (reduces VIP secretion and intestinal fluid secretion); then octreotide LAR 20-30 mg IM q4 weeks for maintenance",
      "Surgical resection: potentially curative for localized tumors; even debulking in metastatic disease can significantly improve symptoms and reduce VIP levels",
      "Hepatic-directed therapy: embolization, TACE, Y-90 for liver-predominant metastatic disease",
      "PRRT: Lu-177 DOTATATE for SSTR-positive progressive disease",
      "Systemic therapy: everolimus, sunitinib, temozolomide-based chemotherapy for progressive disease",
      "Glucocorticoids: prednisone 20-40 mg/day may reduce VIP-mediated secretory diarrhea (adjunct to somatostatin analogs)",
      "Nutritional support: parenteral nutrition may be required during acute secretory crises"
    ],
    nursingActions: [
      "Fluid balance monitoring: strict I&O hourly; daily weights; stool output measurement (may exceed 3-5 L/day); dehydration assessment (mucous membranes, skin turgor, orthostatic vitals)",
      "Electrolyte monitoring: potassium q4-6h (life-threatening hypokalemia); bicarbonate, magnesium, calcium; aggressive replacement — patients may require 100-200+ mEq potassium per day during acute crisis",
      "Cardiac monitoring: continuous telemetry (hypokalemia causes arrhythmias, QT prolongation, U waves, cardiac arrest); report QT changes immediately",
      "Octreotide administration: ensure proper timing and dosing; monitor for response (diarrhea volume should decrease within 24-48 hours of initiation)",
      "Nutritional assessment: patients often severely malnourished from chronic massive diarrhea; weight trend, albumin, prealbumin; TPN may be required",
      "Skin care: perineal skin breakdown from severe diarrhea — barrier creams, frequent cleaning, incontinence care products",
      "Educate patient and family: VIPoma is treatable; octreotide dramatically improves symptoms in most cases; surgical cure is possible for localized tumors"
    ],
    signs: {
      left: [
        "Responding to octreotide: stool output decreasing, potassium stabilizing, weight improving",
        "Localized tumor on imaging — surgical cure possible",
        "Stable disease on somatostatin analog with manageable diarrhea (< 1 L/day)",
        "Electrolytes maintained with oral supplementation"
      ],
      right: [
        "VIPoma crisis: massive secretory diarrhea (> 5 L/day) with severe hypokalemia (K+ < 2.5), metabolic acidosis, cardiovascular collapse — ICU admission, aggressive IV replacement, high-dose octreotide",
        "Refractory to octreotide: stool output remains > 3 L/day despite maximum doses — consider glucocorticoids, surgical debulking, or hepatic-directed therapy",
        "Cardiac arrhythmia from hypokalemia — IV potassium replacement with continuous monitoring, correct magnesium simultaneously",
        "Progressive metastatic disease with increasing VIP levels — consider PRRT or systemic therapy"
      ]
    },
    medications: [
      {
        name: "Octreotide (for VIPoma)",
        type: "Somatostatin Analog",
        action: "Inhibits VIP secretion from tumor cells and directly blocks VIP-mediated intestinal secretion (reduces cAMP-driven chloride and water secretion from enterocytes); dramatically reduces diarrhea volume in > 80% of VIPoma patients",
        sideEffects: "Cholelithiasis, steatorrhea, hyperglycemia, injection site reactions",
        contra: "Known hypersensitivity",
        pearl: "Acute: 200-300 mcg SC q8h (higher doses than typical NET use due to severity of secretory state); response within 24-48 hours. Transition to octreotide LAR 20-30 mg IM q4 weeks for maintenance. If response inadequate, increase to 40 mg LAR or add SC rescue doses. The dramatic reduction in stool output is one of the most gratifying therapeutic responses in endocrine oncology."
      }
    ],
    pearls: [
      "The term 'pancreatic cholera' reflects the mechanism: VIP activates the same CFTR chloride channels as cholera toxin, causing massive isotonic secretory diarrhea that persists during fasting — this distinguishes it from osmotic causes of diarrhea and is a key diagnostic clue",
      "Hypokalemia is the most immediately life-threatening aspect of VIPoma — patients may require 100-200+ mEq of potassium per day during acute crises; continuous cardiac monitoring is essential until potassium is stabilized",
      "VIPoma should be considered in any patient with unexplained high-volume secretory diarrhea (> 1 L/day, persists with fasting, stool osmotic gap < 50) after ruling out more common causes — delayed diagnosis is typical because the condition is so rare"
    ],
    quiz: [
      {
        question: "A patient presents with 2-week history of watery diarrhea (5-6 L/day), weakness, and muscle cramps. Labs show K+ 2.1, HCO3 14, glucose 210. Stool studies show stool osmotic gap of 30 mOsm/kg and no leukocytes. Stool persists despite 48 hours of fasting. What is the most likely diagnosis and immediate priority?",
        options: [
          "Infectious diarrhea — stool cultures and empiric antibiotics",
          "VIPoma — immediate aggressive IV potassium and fluid replacement, then check serum VIP and CT abdomen",
          "Celiac disease — order tTG antibodies and duodenal biopsy",
          "Laxative abuse — check stool for laxative screen"
        ],
        correct: 1,
        rationale: "Large-volume secretory diarrhea (> 3 L/day, low osmotic gap, persists during fasting, no leukocytes) with severe hypokalemia and metabolic acidosis is classic for VIPoma (pancreatic cholera/WDHA syndrome). The immediate priority is aggressive IV fluid and potassium replacement — K+ 2.1 is life-threatening. After stabilization, serum VIP level and CT abdomen will confirm the diagnosis. Infectious diarrhea does not typically persist during fasting at this volume. Celiac disease causes osmotic diarrhea that improves with fasting. Laxative abuse should be on the differential but the severity of presentation favors VIPoma."
      }
    ]
  },
  "hypogonadism-np": {
    title: "Hypogonadism: NP Management",
    cellular: {
      title: "Primary & Secondary Hypogonadism",
      content: "Hypogonadism refers to insufficient gonadal function resulting in inadequate sex hormone production and/or impaired gamete production. Primary hypogonadism (hypergonadotropic): gonadal failure with elevated FSH/LH (loss of negative feedback). Causes: Klinefelter syndrome (47,XXY — most common genetic cause in males), Turner syndrome (45,X — females), gonadal dysgenesis, bilateral orchiectomy, chemotherapy/radiation-induced gonadal damage, autoimmune oophoritis/orchitis, premature ovarian insufficiency (POI). Secondary hypogonadism (hypogonadotropic): hypothalamic-pituitary dysfunction with low/inappropriately normal FSH/LH. Causes: pituitary tumors (prolactinoma most common), Kallmann syndrome (GnRH deficiency with anosmia — KAL1, FGFR1 mutations), functional (obesity, chronic illness, eating disorders, excessive exercise — hypothalamic amenorrhea), medications (opioids, glucocorticoids, GnRH analogs). Clinical manifestations depend on timing: pre-pubertal onset prevents secondary sexual characteristic development (eunuchoid proportions, high-pitched voice, absent puberty); post-pubertal onset causes sexual dysfunction, infertility, muscle loss, osteoporosis, mood changes, and metabolic effects."
    },
    riskFactors: [
      "Klinefelter syndrome (1:600 males — most common chromosomal cause of male hypogonadism; tall stature, small firm testes, gynecomastia, learning difficulties)",
      "Turner syndrome (1:2500 females — short stature, web neck, cardiac anomalies, streak gonads, primary amenorrhea)",
      "Pituitary/hypothalamic disease: prolactinoma, other pituitary adenomas, craniopharyngioma, pituitary surgery/radiation, hemochromatosis",
      "Chemotherapy: alkylating agents (cyclophosphamide, chlorambucil) are most gonadotoxic",
      "Chronic opioid use (up to 90% develop hypogonadism)",
      "Anorexia nervosa and female athlete triad (functional hypothalamic amenorrhea)",
      "Obesity (aromatase-mediated testosterone conversion to estrogen in males)",
      "Autoimmune polyendocrine syndromes (autoimmune gonadal failure with other endocrine autoimmunity)"
    ],
    diagnostics: [
      "Morning testosterone (males): < 300 ng/dL on two morning samples; check free T if SHBG abnormalities suspected",
      "Estradiol (females with amenorrhea/oligomenorrhea): low estradiol with elevated FSH = primary ovarian insufficiency",
      "FSH and LH: elevated = primary (gonadal failure); low/normal = secondary (central cause); critical branching point in workup",
      "Prolactin: if secondary — elevated prolactin → prolactinoma workup",
      "Karyotype: if primary hypogonadism in male (Klinefelter — 47,XXY) or female with delayed puberty/primary amenorrhea (Turner — 45,X)",
      "Pituitary MRI: if secondary hypogonadism — evaluate for pituitary/hypothalamic pathology",
      "Complete pituitary panel: if secondary — TSH, free T4, cortisol/ACTH, IGF-1, prolactin (assess for panhypopituitarism)",
      "DEXA scan: assess bone density (hypogonadism causes osteoporosis in both sexes)",
      "Semen analysis (males): assess fertility — oligospermia or azoospermia common in both primary and secondary hypogonadism",
      "AMH (females): ovarian reserve assessment — very low in POI"
    ],
    management: [
      "Male primary hypogonadism: testosterone replacement therapy (TRT) — see testosterone-deficiency-np lesson; fertility usually not achievable in primary (testicular failure), but assisted reproduction techniques (micro-TESE for Klinefelter) may be possible",
      "Male secondary hypogonadism: if fertility desired → gonadotropin therapy (hCG 1500-3000 IU 2-3x/week ± FSH 75-150 IU 3x/week) to stimulate both testosterone and spermatogenesis; if fertility not desired → TRT",
      "Female primary hypogonadism (POI): estrogen-progestogen replacement therapy (cyclical or continuous HRT) for symptom control, bone protection, cardiovascular protection until average age of menopause (~51); fertility → donor oocyte IVF",
      "Female secondary hypogonadism: treat underlying cause (prolactinoma → cabergoline; hypothalamic amenorrhea → weight restoration, reduce exercise; pituitary lesion → surgery); fertility → pulsatile GnRH or gonadotropin therapy",
      "Kallmann syndrome: GnRH pump therapy (pulsatile) or gonadotropin injections for puberty induction and fertility; testosterone for virilization if fertility not desired",
      "Turner syndrome: growth hormone for short stature (pediatric), estrogen at age ~12 for puberty induction, cyclical estrogen-progestogen replacement through reproductive years, cardiac surveillance",
      "Bone health: DEXA scan at diagnosis; adequate calcium (1200 mg/day) and vitamin D (1000-2000 IU/day); hormone replacement is the primary osteoporosis prevention in hypogonadism",
      "Address reversible causes: weight loss (obesity-related male hypogonadism), opioid reduction, treat underlying illness, nutrition optimization"
    ],
    nursingActions: [
      "Assess for hypogonadism symptoms: males — decreased libido, erectile dysfunction, fatigue, decreased muscle mass, gynecomastia, depressed mood, hot flashes; females — amenorrhea, vaginal dryness, hot flashes, infertility, decreased libido, mood changes, osteoporosis",
      "Puberty assessment in adolescents: Tanner staging at each visit; delayed puberty (no breast development by age 13 in girls, no testicular enlargement by age 14 in boys) requires investigation",
      "Fertility counseling: essential before starting any hormone replacement — discuss impact on fertility and available options; male TRT causes azoospermia; discuss clomiphene/hCG alternatives if fertility desired",
      "Hormone replacement monitoring: males — testosterone levels, hematocrit, PSA annually; females — symptom assessment, breakthrough bleeding, breast exam, DEXA scan",
      "Bone density monitoring: baseline DEXA at diagnosis; repeat at 1-2 years on hormone replacement; calcium and vitamin D supplementation counseling",
      "Psychosocial support: hypogonadism affects body image, sexual function, fertility, and self-esteem; particularly sensitive in adolescents with delayed puberty; facilitate referral to psychology/support groups as appropriate",
      "Genetic counseling coordination: for Klinefelter, Turner, Kallmann — genetic counseling for patients and families; reproductive options discussion",
      "Transition care for adolescents: ensure smooth transition from pediatric to adult endocrine care; continuity of hormone replacement and surveillance"
    ],
    signs: {
      left: [
        "Adequate hormone replacement: improving energy, libido, mood; DEXA stable or improving; age-appropriate secondary sexual characteristics",
        "Successful fertility achieved with gonadotropin therapy in secondary hypogonadism",
        "Reversible cause addressed: testosterone normalizing with weight loss or opioid cessation",
        "Turner syndrome on appropriate surveillance: cardiac monitoring, hearing assessment, thyroid screening"
      ],
      right: [
        "Klinefelter with untreated hypogonadism: severe osteoporosis, metabolic syndrome, gynecomastia, depression — testosterone replacement urgently needed",
        "Panhypopituitarism discovered during hypogonadism workup: multiple hormone deficiencies requiring comprehensive replacement",
        "Premature ovarian insufficiency in young woman: emotional impact, fertility implications, long-term cardiovascular and bone health concerns",
        "Adolescent with delayed puberty and anosmia: suspect Kallmann syndrome — MRI for absent olfactory bulbs, genetic testing"
      ]
    },
    medications: [
      {
        name: "hCG (Human Chorionic Gonadotropin)",
        type: "LH Analog",
        action: "Mimics LH action on Leydig cells, stimulating intratesticular testosterone production; maintains or restores spermatogenesis (unlike exogenous testosterone which suppresses it); used for secondary hypogonadism when fertility is desired",
        sideEffects: "Gynecomastia (aromatization of testosterone to estrogen), headache, injection site reactions, mood changes, multiple pregnancy risk if used for ovulation induction",
        contra: "Androgen-dependent tumors, precocious puberty",
        pearl: "1500-3000 IU SC or IM 2-3x/week for male secondary hypogonadism with fertility goals. Add FSH (recombinant FSH 75-150 IU 3x/week) if spermatogenesis is not restored after 6-12 months of hCG alone. Takes 6-12 months for sperm production to begin. More expensive and less convenient than testosterone but preserves/restores fertility. Also used for cryptorchidism in children and puberty induction in Kallmann syndrome."
      }
    ],
    pearls: [
      "The FSH/LH level is the single most important test for classifying hypogonadism: elevated FSH/LH = primary (gonadal failure, irreversible in most cases); low/normal FSH/LH = secondary (central cause, often treatable and fertility potentially restorable with appropriate therapy)",
      "Klinefelter syndrome (47,XXY) is present in 1 in 600 males but is vastly under-diagnosed — only ~25% are diagnosed during their lifetime; consider in any male presenting with small firm testes, gynecomastia, tall stature, learning difficulties, or infertility; testosterone replacement improves quality of life and prevents osteoporosis",
      "Functional hypothalamic amenorrhea (FHA) from eating disorders, excessive exercise, or stress is a diagnosis of exclusion — pituitary MRI is needed to exclude structural pathology; treatment is directed at the underlying cause (weight restoration, exercise reduction), and hormone replacement may be needed for bone protection"
    ],
    quiz: [
      {
        question: "A 22-year-old man presents with primary infertility. Exam reveals gynecomastia, small firm testes, tall eunuchoid body proportions, and sparse facial hair. Labs show testosterone 180 ng/dL, FSH 35 mIU/mL, LH 28 mIU/mL. What is the most likely diagnosis and appropriate workup?",
        options: [
          "Secondary hypogonadism from prolactinoma — order prolactin and pituitary MRI",
          "Klinefelter syndrome — order karyotype and refer for genetic counseling; discuss testosterone replacement and fertility options",
          "Kallmann syndrome — test olfactory function and order pituitary MRI",
          "Obesity-related hypogonadism — recommend weight loss and recheck testosterone"
        ],
        correct: 1,
        rationale: "The combination of primary hypogonadism (elevated FSH/LH confirming gonadal failure), small firm testes, gynecomastia, tall stature with eunuchoid proportions, and infertility in a young male is classic for Klinefelter syndrome (47,XXY). Karyotype confirms the diagnosis. Treatment includes testosterone replacement (for virilization, bone health, mood, energy) and genetic counseling. Fertility may be possible through micro-TESE (testicular sperm extraction) with IVF/ICSI — sperm retrieval is successful in 40-50% of Klinefelter patients. This is primary hypogonadism (elevated LH/FSH), ruling out secondary causes. Kallmann syndrome would show LOW FSH/LH."
      }
    ]
  },
  "panhypopituitarism-np": {
    title: "Panhypopituitarism: NP Management",
    cellular: {
      title: "Panhypopituitarism Pathophysiology",
      content: "Panhypopituitarism is deficiency of all anterior pituitary hormones (ACTH, TSH, LH/FSH, GH, prolactin) ± posterior pituitary (ADH — central diabetes insipidus). The anterior pituitary has a characteristic vulnerability pattern based on cell location and vascular supply: gonadotrophs (LH/FSH) are most vulnerable and lost first, followed by somatotrophs (GH), thyrotrophs (TSH), and corticotrophs (ACTH) — thus the mnemonic 'Go Look For The Adenoma' reflects the order of hormone loss. Causes include pituitary tumors (most common — non-functioning adenoma), surgical resection, radiation therapy, Sheehan syndrome (postpartum pituitary necrosis from hemorrhagic shock), pituitary apoplexy (hemorrhage into adenoma), autoimmune hypophysitis (including checkpoint inhibitor-induced), infiltrative disease (sarcoidosis, hemochromatosis, histiocytosis), and traumatic brain injury (TBI — 12-15% develop hypopituitarism). The clinical presentation depends on the number and severity of hormone deficits: ACTH deficiency is the most acutely dangerous (adrenal crisis), TSH deficiency causes secondary hypothyroidism, and gonadotropin deficiency causes hypogonadism."
    },
    riskFactors: [
      "Pituitary adenoma (most common cause — non-functioning macroadenoma causing mass effect on normal pituitary tissue)",
      "Pituitary surgery (transsphenoidal) — variable rates of new hormone deficits depending on tumor size and surgical extent",
      "Cranial radiation (dose-dependent — GH most sensitive, ACTH most resistant; effects may develop years after radiation)",
      "Sheehan syndrome (postpartum hemorrhage with hypotension — pituitary gland enlarges during pregnancy and is vulnerable to ischemia)",
      "Pituitary apoplexy (hemorrhage into pituitary adenoma — sudden headache, visual loss, hormonal crisis)",
      "Immune checkpoint inhibitors (ipilimumab, nivolumab, pembrolizumab — hypophysitis in 5-17%)",
      "Traumatic brain injury (hypopituitarism in 12-15% — screening recommended at 3 and 12 months post-TBI)",
      "Infiltrative diseases: sarcoidosis (neurosarcoidosis), hemochromatosis (iron deposition in gonadotrophs), Langerhans cell histiocytosis"
    ],
    diagnostics: [
      "Complete pituitary panel: morning cortisol (8 AM), ACTH, TSH, free T4, LH, FSH, testosterone (males) or estradiol (females), IGF-1, prolactin",
      "ACTH stimulation test: if morning cortisol 3-15 mcg/dL (indeterminate); peak cortisol < 18 = adrenal insufficiency",
      "TFTs: secondary hypothyroidism — low free T4 with low/inappropriately normal TSH (TSH is unreliable for monitoring secondary hypothyroidism — must follow free T4)",
      "IGF-1: screening for GH deficiency; if low, confirm with insulin tolerance test (ITT — gold standard) or glucagon stimulation test",
      "Serum sodium and osmolality: central DI causes hypernatremia, dilute urine (urine osmolality < 300), polyuria (> 3 L/day); water deprivation test with DDAVP if diagnosis uncertain",
      "Pituitary MRI with gadolinium: identify sellar/suprasellar mass, empty sella, stalk thickening (infiltrative disease), hemorrhage (apoplexy)",
      "Visual field testing: for any sellar mass approaching optic chiasm",
      "Baseline DEXA: GH and sex hormone deficiency both cause osteoporosis"
    ],
    management: [
      "CRITICAL: replace cortisol FIRST before thyroid hormone — thyroid hormone increases cortisol metabolism; starting levothyroxine without cortisol coverage in a patient with concurrent ACTH deficiency can precipitate adrenal crisis",
      "Cortisol replacement: hydrocortisone 15-25 mg/day in divided doses (10 mg morning + 5 mg afternoon or 10-5-5 split); stress dosing protocol essential; medic alert bracelet",
      "Thyroid hormone: levothyroxine (titrate to free T4 in upper half of normal range — do NOT use TSH for monitoring in secondary hypothyroidism)",
      "Sex hormones: testosterone replacement in males (TRT or gonadotropins if fertility desired); estrogen-progestogen in premenopausal females (if uterus present); fertility → gonadotropin therapy",
      "Growth hormone: recombinant GH for adults with confirmed GH deficiency and impaired quality of life (improves body composition, bone density, energy, lipid profile); start low (0.2 mg/day), titrate based on IGF-1",
      "ADH replacement (central DI): desmopressin (DDAVP) — intranasal, oral, or SC; titrate to control polyuria without hyponatremia",
      "Monitoring: annual pituitary panel, free T4, morning cortisol (if on hydrocortisone — assess clinical status rather than levels), IGF-1 (if on GH), DEXA q2 years",
      "Ongoing MRI surveillance: for residual or recurrent pituitary mass; frequency depends on pathology"
    ],
    nursingActions: [
      "Medication administration sequencing: ensure hydrocortisone is started BEFORE levothyroxine — this sequencing is critical; thyroid hormone without cortisol coverage in panhypopituitarism can be fatal",
      "Comprehensive hormone replacement education: patients may be on 3-5 different hormone replacements; ensure understanding of each medication's purpose, timing, and importance",
      "Stress-dose steroid protocol: same as adrenal insufficiency — double dose for illness, IM injection for vomiting, medic alert bracelet; training for patient AND family member",
      "DDAVP management (if central DI): teach proper nasal spray or tablet dosing; monitor fluid balance; too much DDAVP → hyponatremia; too little → polyuria and dehydration; serum sodium monitoring during dose titration",
      "Secondary hypothyroidism monitoring: educate that TSH is NOT useful for dose adjustment — free T4 must be followed; target free T4 in upper-normal range; levothyroxine administration timing (empty stomach, separate from calcium/iron)",
      "Growth hormone injection training: proper SC injection technique, site rotation, storage (refrigerate); monitor for side effects (arthralgia, edema, carpal tunnel — usually resolve with dose reduction)",
      "Fertility counseling: panhypopituitarism causes infertility but gonadotropin therapy can restore fertility in many cases — important for reproductive-age patients; refer to reproductive endocrinology",
      "Psychosocial support: managing multiple hormone deficiencies is complex and burdensome; fatigue and mood changes are common; validate challenges and connect with pituitary support organizations"
    ],
    signs: {
      left: [
        "Stable on comprehensive hormone replacement: adequate energy, normal electrolytes, maintained bone density, good quality of life",
        "Post-surgical panhypopituitarism with some hormone recovery over time (partial deficits may improve months after surgery)",
        "Well-managed central DI with stable sodium on DDAVP",
        "Improving IGF-1 and body composition on GH replacement"
      ],
      right: [
        "Adrenal crisis from missed hydrocortisone doses during illness — emergency hydrocortisone 100 mg IV + fluid resuscitation",
        "Hyponatremia from DDAVP over-replacement (excessive ADH → water retention → dilutional hyponatremia) — reduce DDAVP dose, fluid restrict",
        "Pituitary apoplexy: sudden severe headache, visual loss, ophthalmoplegia, hemodynamic instability — emergent MRI, stress-dose steroids, neurosurgical consultation",
        "Checkpoint inhibitor-induced hypophysitis: acute headache, fatigue, multiple new hormone deficits — high-dose dexamethasone for acute phase, then physiologic replacement"
      ]
    },
    medications: [
      {
        name: "Desmopressin (DDAVP)",
        type: "Synthetic ADH/Vasopressin Analog (V2 selective)",
        action: "Selective V2 receptor agonist in renal collecting duct; promotes aquaporin-2 insertion, increasing water reabsorption and concentrating urine; replaces ADH deficiency in central diabetes insipidus without the V1-mediated vasoconstrictive effects of vasopressin",
        sideEffects: "Hyponatremia (most important — from excessive water retention if dose too high), headache, nausea, nasal congestion (intranasal formulation)",
        contra: "Habitual or psychogenic polydipsia (addition of DDAVP to excessive water intake causes severe hyponatremia), hyponatremia, type 2B or platelet-type von Willebrand disease (paradoxical thrombocytopenia)",
        pearl: "Intranasal: 5-20 mcg 1-2x daily; oral tablets: 0.1-0.4 mg 2-3x daily; SC: 1-2 mcg 1-2x daily. Start with bedtime dose to control nocturia, then add daytime doses as needed. Dose titration guided by urine output (target 2-3 L/day) and serum sodium (monitor weekly during titration, then monthly). Allow a brief period of polyuria before each dose ('breakthrough') to prevent hyponatremia from continuous antidiuresis. If serum sodium drops < 135, reduce dose."
      },
      {
        name: "Recombinant Human Growth Hormone (Somatropin)",
        type: "Growth Hormone Replacement",
        action: "Replaces GH deficiency; stimulates IGF-1 production from the liver, which mediates anabolic effects: increased lean body mass, decreased visceral adiposity, improved bone mineral density, improved lipid profile, and enhanced quality of life and energy",
        sideEffects: "Arthralgia, myalgia, peripheral edema, carpal tunnel syndrome (usually dose-dependent and reversible), hyperglycemia (insulin antagonism), theoretical concern for tumor growth (monitor)",
        contra: "Active malignancy, acute critical illness, active diabetic retinopathy",
        pearl: "Start 0.2 mg SC daily at bedtime (mimics physiological nocturnal GH secretion); titrate by 0.1-0.2 mg q4-6 weeks based on IGF-1 level (target mid-normal age-adjusted range). Women on oral estrogen need higher GH doses (estrogen inhibits GH-induced IGF-1 production — switch to transdermal estrogen if possible). Monitor IGF-1, fasting glucose, lipid panel. Benefits include improved energy, exercise capacity, body composition, and psychological well-being."
      }
    ],
    pearls: [
      "The cardinal rule of panhypopituitarism treatment: cortisol FIRST, then thyroid hormone — starting levothyroxine without cortisol replacement in a patient with concurrent ACTH deficiency can precipitate fatal adrenal crisis; this is because thyroid hormone increases cortisol metabolism via hepatic enzymes",
      "TSH is USELESS for monitoring secondary hypothyroidism — TSH is low because the pituitary cannot produce it; levothyroxine dose must be titrated to free T4 level (target upper half of normal range); this is a common mistake that leads to under-dosing of levothyroxine",
      "Traumatic brain injury is an under-recognized cause of panhypopituitarism — 12-15% of moderate-to-severe TBI patients develop hypopituitarism; screening at 3 and 12 months post-TBI is recommended (morning cortisol, TSH/free T4, testosterone or estradiol, IGF-1) but is rarely performed in practice"
    ],
    quiz: [
      {
        question: "A patient with a large pituitary macroadenoma undergoes transsphenoidal surgery. Post-operatively, pituitary panel shows ACTH 5 pg/mL (low), cortisol 2.1 mcg/dL (low), TSH 0.4 mIU/L (low-normal), and free T4 0.6 ng/dL (low). The resident orders levothyroxine 75 mcg daily. What should the NP prioritize?",
        options: [
          "Start the levothyroxine as ordered — the patient needs thyroid hormone replacement",
          "Hold levothyroxine until hydrocortisone is started — cortisol replacement MUST precede thyroid hormone in panhypopituitarism",
          "Order a cosyntropin stimulation test to confirm adrenal insufficiency before starting any hormones",
          "Start both hormones simultaneously — there is no specific order required"
        ],
        correct: 1,
        rationale: "The patient has both secondary adrenal insufficiency (low ACTH, low cortisol) and secondary hypothyroidism (low-normal TSH with low free T4). Hydrocortisone MUST be started BEFORE levothyroxine. Thyroid hormone increases cortisol metabolism — starting levothyroxine without cortisol coverage can precipitate adrenal crisis. The correct sequence is: start hydrocortisone 20 mg morning + 10 mg afternoon, confirm adequate cortisol coverage, THEN start levothyroxine. This is one of the most important endocrine treatment sequencing principles."
      }
    ]
  },
  "craniopharyngioma-np": {
    title: "Craniopharyngioma: NP Management",
    cellular: {
      title: "Craniopharyngioma: Sellar Tumor Pathology",
      content: "Craniopharyngiomas are benign but locally aggressive tumors arising from Rathke pouch remnants along the craniopharyngeal duct (from nasopharynx to sella/hypothalamus). They have a bimodal age distribution (peak at 5-14 years and 50-74 years). Two histological subtypes exist: adamantinomatous (children — CTNNB1 β-catenin mutations, calcified, cystic) and papillary (adults — BRAF V600E mutations, solid, rarely calcified). These tumors cause morbidity through: (1) compression of the pituitary gland/stalk → endocrine deficits (40-87% at diagnosis), (2) compression of the optic chiasm → visual field deficits (62-84%), (3) hypothalamic involvement → obesity (hypothalamic obesity is extremely treatment-resistant), diabetes insipidus, behavioral/cognitive changes, temperature dysregulation. Despite being histologically benign (WHO grade I), their intimate relationship with the hypothalamus and optic apparatus makes treatment challenging. Surgical cure requires total resection but risks hypothalamic damage with devastating metabolic consequences (morbid hypothalamic obesity, hyperphagia, autonomic dysfunction)."
    },
    riskFactors: [
      "No modifiable risk factors — craniopharyngiomas arise from embryological remnants",
      "Bimodal age distribution: childhood peak (5-14 years) and adult peak (50-74 years)",
      "No sex predilection (equal incidence)",
      "CTNNB1 (β-catenin) mutations: adamantinomatous subtype (children)",
      "BRAF V600E mutations: papillary subtype (adults) — potential targeted therapy implications"
    ],
    diagnostics: [
      "MRI brain with gadolinium: mixed cystic-solid sellar/suprasellar mass; adamantinomatous type shows calcification, cystic components with 'machine oil' fluid (cholesterol-rich); papillary type is predominantly solid",
      "CT: calcification is the hallmark of adamantinomatous craniopharyngioma (90% calcified — unusual for other sellar masses)",
      "Complete pituitary panel: assess for panhypopituitarism (GH deficiency most common — 75%, followed by gonadotropins, TSH, ACTH)",
      "Visual field testing: bitemporal hemianopsia or other visual field cuts from chiasmal compression",
      "Water deprivation test or serum/urine osmolality: assess for central diabetes insipidus (present pre-operatively in 15-30% and post-operatively in 80-95%)",
      "Cognitive/neuropsychological testing: hypothalamic involvement can cause memory, executive function, and behavioral changes",
      "BMI and metabolic assessment: hypothalamic obesity develops in 50-75% of patients, especially after surgery involving the hypothalamus"
    ],
    management: [
      "Surgical resection: primary treatment; extent balanced against hypothalamic preservation — gross total resection (GTR) offers lowest recurrence but highest hypothalamic morbidity; subtotal resection (STR) with planned radiation preserves hypothalamic function better",
      "Radiation therapy: adjuvant after STR (reduces recurrence from 50-70% to 10-20%); proton beam radiation preferred in children (reduced scatter to normal brain tissue)",
      "BRAF V600E-targeted therapy: dabrafenib/trametinib for papillary craniopharyngioma with BRAF V600E mutation — emerging treatment with dramatic tumor shrinkage reported; may allow less aggressive surgery",
      "Intracystic therapy: bleomycin or interferon-alpha injected into cystic component (reduces cyst volume without open surgery)",
      "Hormone replacement: lifelong comprehensive replacement for panhypopituitarism (cortisol, thyroid, sex hormones, GH, DDAVP) — see panhypopituitarism lesson",
      "Hypothalamic obesity management: extremely challenging; conventional diet/exercise largely ineffective; GLP-1 receptor agonists (semaglutide, liraglutide) showing promise; bariatric surgery considered for severe cases (mixed results); dextroamphetamine or methylphenidate for daytime somnolence",
      "Visual rehabilitation: if persistent visual field deficits post-surgery; driving assessment",
      "Long-term MRI surveillance: annually for 5 years, then every 2-3 years if stable (recurrence can occur decades later)"
    ],
    nursingActions: [
      "Pre-operative assessment: complete endocrine evaluation, visual fields, neurocognitive baseline; ensure stress-dose steroids are ordered for surgery",
      "Post-operative monitoring: hourly I&O and urine specific gravity (central DI develops in 80-95% post-operatively — polyuria > 250 mL/hr with low specific gravity < 1.005); serum sodium q4-6h (triphasic pattern of DI may occur: transient DI → SIADH → permanent DI over 1-2 weeks)",
      "DI management: initiate DDAVP when confirmed (polyuria with rising sodium and dilute urine); carefully titrate to prevent both under-treatment (dehydration) and over-treatment (hyponatremia)",
      "Post-operative endocrine: assess all pituitary axes; initiate hydrocortisone before levothyroxine; growth hormone assessment deferred until 3-6 months post-surgery",
      "Visual assessment: post-operative visual field testing; document improvement or new deficits; ophthalmology follow-up",
      "Weight and appetite monitoring: hypothalamic obesity can develop rapidly post-operatively; early dietitian involvement; educate patient/family about limited efficacy of conventional weight management for hypothalamic obesity",
      "Cognitive and behavioral assessment: hypothalamic damage can cause personality changes, memory impairment, sleep-wake disruption, temperature dysregulation — document baseline and post-operative changes",
      "Long-term follow-up coordination: these patients require lifelong multidisciplinary care — endocrinology, neurosurgery/radiation oncology, ophthalmology, neuropsychology, dietetics; establish a coordinated care plan"
    ],
    signs: {
      left: [
        "Post-surgical: visual fields improving, endocrine deficits managed with replacement, stable imaging without recurrence",
        "Transient DI resolving within 1-2 weeks post-operatively (less likely to be permanent)",
        "Papillary craniopharyngioma with BRAF V600E responding dramatically to targeted therapy",
        "Child achieving normal growth on GH replacement with stable imaging"
      ],
      right: [
        "Severe hypothalamic obesity developing post-operatively: BMI > 40, hyperphagia, daytime somnolence — extremely treatment-resistant and significantly impacts quality of life",
        "Triphasic DI pattern: initial DI → transient SIADH with hyponatremia (days 4-8 — dangerous, can cause seizures) → permanent DI",
        "Tumor recurrence on MRI (20-50% after STR alone) — repeat surgery, radiation, or targeted therapy",
        "Adrenal crisis from inadequate steroid coverage during illness — education failure requiring reinforcement"
      ]
    },
    medications: [
      {
        name: "Dabrafenib/Trametinib (for BRAF V600E craniopharyngioma)",
        type: "BRAF Inhibitor + MEK Inhibitor Combination",
        action: "Dabrafenib selectively inhibits mutant BRAF V600E kinase; trametinib inhibits MEK1/2 downstream — combination blocks the hyperactivated MAPK pathway that drives papillary craniopharyngioma proliferation; dramatic tumor shrinkage reported in case series and clinical trials",
        sideEffects: "Pyrexia, rash, fatigue, arthralgias, cardiac toxicity (reduced LVEF), skin squamous cell carcinoma (BRAF inhibitor class effect), hepatotoxicity",
        contra: "Wild-type BRAF (only effective in V600E-mutant tumors), severe hepatic impairment, QT prolongation",
        pearl: "This represents a paradigm shift in papillary craniopharyngioma management — BRAF V600E targeted therapy can achieve dramatic tumor reduction (>90% volume reduction reported in some cases), potentially converting unresectable tumors to operable ones or avoiding surgery altogether. BRAF V600E testing should be performed on all papillary craniopharyngiomas. FDA-approved for BRAF V600E-mutant craniopharyngioma (landmark approval based on ROAR basket trial and case series). Duration of therapy and long-term outcomes still being studied."
      }
    ],
    pearls: [
      "Hypothalamic obesity is the most devastating long-term consequence of craniopharyngioma treatment — it develops in 50-75% of patients (especially children) after hypothalamic damage from surgery or tumor, and conventional diet/exercise is largely ineffective because the hypothalamic appetite/satiety circuits are destroyed; emerging treatments (GLP-1 receptor agonists, bariatric surgery) offer hope but results are variable",
      "The triphasic DI pattern after pituitary/hypothalamic surgery is a dangerous pitfall: phase 1 (days 1-3): DI with polyuria → phase 2 (days 4-8): SIADH with hyponatremia (stored ADH released from dying neurons) → phase 3 (day 7+): permanent DI; the SIADH phase is most dangerous because DDAVP given for phase 1 DI combined with SIADH causes severe hyponatremia — close sodium monitoring every 4-6 hours during the first 2 weeks post-operatively is essential",
      "BRAF V600E-targeted therapy for papillary craniopharyngioma represents one of the most exciting recent advances in neuro-oncology — molecular testing should be performed on all craniopharyngioma tissue; BRAF-positive tumors may achieve dramatic responses, potentially changing the treatment paradigm from radical surgery (with hypothalamic damage) to medical management"
    ],
    quiz: [
      {
        question: "A child undergoes subtotal resection of a cystic, calcified sellar/suprasellar craniopharyngioma. On post-operative day 5, urine output drops dramatically to 30 mL/hr (was 300 mL/hr on days 1-3), and serum sodium drops from 148 to 129 mEq/L. The patient is still receiving DDAVP. What is happening and what should be done?",
        options: [
          "DI is resolving — continue DDAVP at current dose and increase IV fluids",
          "This is phase 2 (SIADH phase) of the triphasic DI pattern — HOLD DDAVP immediately, restrict fluids, monitor sodium q4h",
          "The patient has developed cerebral salt wasting — increase IV NS rate and add fludrocortisone",
          "This represents normal post-operative fluid shifts — no intervention needed"
        ],
        correct: 1,
        rationale: "This is the classic triphasic DI pattern: Phase 1 (days 1-3): DI with polyuria (300 mL/hr) → Phase 2 (days 4-8): SIADH from uncontrolled ADH release from dying hypothalamic neurons → Phase 3: permanent DI. The patient is now in Phase 2 (oliguria + hyponatremia). DDAVP must be HELD immediately — continuing DDAVP during the SIADH phase adds exogenous ADH to already-elevated endogenous ADH, causing dangerous hyponatremia. Fluids should be restricted. Sodium monitoring q4h is essential. Phase 3 (permanent DI) will typically emerge days later, at which point DDAVP will need to be restarted."
      }
    ]
  },
  "ectopic-acth-np": {
    title: "Ectopic ACTH Syndrome: NP Mgmt",
    cellular: {
      title: "Ectopic ACTH Pathophysiology",
      content: "Ectopic ACTH syndrome occurs when non-pituitary tumors secrete ACTH (or rarely CRH), causing ACTH-dependent Cushing syndrome. The most common sources are small cell lung carcinoma (50%), bronchial carcinoid (10%), thymic carcinoid (10%), medullary thyroid carcinoma, and pancreatic neuroendocrine tumors. ACTH secretion from ectopic sources is autonomous and NOT subject to normal hypothalamic-pituitary feedback — cortisol levels can be extremely high (often > 50 mcg/dL). The massive cortisol excess overwhelms 11β-HSD2 (the enzyme that normally inactivates cortisol before it reaches the mineralocorticoid receptor in the kidney), causing cortisol to act as a potent mineralocorticoid → severe hypokalemia and metabolic alkalosis (a distinguishing feature from pituitary Cushing disease where hypokalemia is uncommon). The rapidity of cortisol rise in ectopic ACTH (especially small cell lung cancer) means patients often present with the metabolic consequences (hypokalemia, hyperglycemia, infections) rather than the classic Cushingoid body habitus (which requires chronic cortisol exposure to develop)."
    },
    riskFactors: [
      "Small cell lung carcinoma (most common cause — often occult at time of Cushing diagnosis)",
      "Bronchial carcinoid (may be occult for years — 'occult ectopic ACTH')",
      "Thymic carcinoid",
      "Medullary thyroid carcinoma (MEN2-associated)",
      "Pancreatic neuroendocrine tumors",
      "Pheochromocytoma (rare ACTH-secreting variant)",
      "Smoking history (lung cancer risk)"
    ],
    diagnostics: [
      "Cortisol: markedly elevated (UFC often > 4x upper normal; sometimes > 10x); serum cortisol may be > 40-50 mcg/dL",
      "ACTH: elevated (often > 200 pg/mL — higher levels than typical Cushing disease which is usually 40-200 pg/mL)",
      "Hypokalemia: present in majority of ectopic ACTH (vs. uncommon in Cushing disease) — from mineralocorticoid effect of cortisol overwhelming 11β-HSD2",
      "High-dose dexamethasone suppression test: ectopic ACTH does NOT suppress (vs. Cushing disease which typically suppresses > 50%)",
      "CRH stimulation test: ectopic ACTH shows NO response (flat ACTH and cortisol); Cushing disease shows stimulated response",
      "Bilateral inferior petrosal sinus sampling (BIPSS): central-to-peripheral ACTH gradient < 2:1 (no gradient) after CRH = ectopic source; gradient > 3:1 = pituitary source (gold standard for localization)",
      "CT chest/abdomen: identify source tumor (chest CT for bronchial/thymic carcinoid, lung cancer); thin-cut chest CT with contrast may reveal small bronchial carcinoids missed on standard CT",
      "Ga-68 DOTATATE PET: useful for localizing occult carcinoid tumors (somatostatin receptor expression)",
      "Whole-body MRI and FDG-PET: if CT and somatostatin imaging are negative for occult source"
    ],
    management: [
      "Treat the source tumor: surgical resection if localized (bronchial carcinoid resection can be curative); chemotherapy for small cell lung cancer (but prognosis remains poor)",
      "Cortisol-lowering medical therapy: ketoconazole 200-400 mg TID, metyrapone 250-750 mg q6h, or combination — rapid cortisol reduction essential to control metabolic complications",
      "Etomidate infusion: for acute, severe, life-threatening hypercortisolism (Cushing crisis) when oral medications cannot be given; 0.04-0.05 mg/kg/hr IV with cortisol monitoring q6h — only option for acute IV cortisol lowering",
      "Mifepristone: glucocorticoid receptor antagonist for hyperglycemia associated with ectopic ACTH (remember: cortisol and ACTH levels INCREASE — cannot monitor these; monitor clinical parameters)",
      "Bilateral adrenalectomy: definitive treatment for occult ectopic ACTH when source cannot be found; cures hypercortisolism but requires lifelong steroid replacement",
      "Aggressive potassium replacement: may require 200+ mEq/day; spironolactone or eplerenone can help (block mineralocorticoid effect of cortisol on renal MR)",
      "Infection prophylaxis: severe hypercortisolism is profoundly immunosuppressive — PJP prophylaxis (trimethoprim-sulfamethoxazole), antifungal coverage; aggressive treatment of any infection",
      "Glycemic management: severe insulin resistance; high-dose insulin often required; may need insulin drip for acute management"
    ],
    nursingActions: [
      "Potassium monitoring: q4-6h initially (severe hypokalemia is life-threatening — cardiac arrhythmias); aggressive replacement; continuous telemetry; may need central line for high-rate potassium infusion",
      "Blood glucose monitoring: q4-6h; anticipate need for high-dose insulin; cortisol causes severe insulin resistance; glucose may be > 300-500 mg/dL",
      "Infection surveillance: hypercortisolism is severely immunosuppressive; monitor for fever, WBC changes, opportunistic infections; low threshold for cultures and empiric antibiotics; PJP prophylaxis",
      "Cortisol monitoring: if on ketoconazole/metyrapone, monitor cortisol q12-24h to assess response and avoid over-treatment (adrenal insufficiency); titrate medications to target cortisol normalization",
      "Psychological assessment: severe hypercortisolism causes psychosis, agitation, insomnia, depression — psychiatric support may be needed; benzodiazepines for severe agitation",
      "DVT prophylaxis: hypercortisolism is a thrombotic state; LMWH + IPC devices",
      "Wound care: poor wound healing from cortisol excess; skin tears easily; pressure injury prevention",
      "Goals of care discussion: small cell lung cancer with ectopic ACTH has poor prognosis; facilitate palliative care involvement and advance care planning"
    ],
    signs: {
      left: [
        "Occult bronchial carcinoid identified on imaging — resection can cure Cushing syndrome",
        "Cortisol normalizing on medical therapy (ketoconazole/metyrapone) with improving potassium and glucose",
        "Localized tumor successfully resected with resolving hypercortisolism (post-op morning cortisol < 5 confirms remission)",
        "Successful bilateral adrenalectomy for occult ectopic ACTH — no longer hypercortisolemic, on replacement therapy"
      ],
      right: [
        "Cushing crisis: severe hypercortisolism with psychosis, severe hypokalemia (K+ < 2.0), hyperglycemia (> 500), sepsis — ICU admission, etomidate infusion if oral therapy fails",
        "Occult ectopic ACTH: all imaging negative for source tumor — may require bilateral adrenalectomy as definitive treatment",
        "Small cell lung cancer with ectopic ACTH: rapidly progressive disease with poor prognosis despite cortisol control",
        "Opportunistic infection (PJP pneumonia, invasive fungal) from severe immunosuppression — high mortality"
      ]
    },
    medications: [
      {
        name: "Metyrapone (Metopirone)",
        type: "11β-Hydroxylase Inhibitor",
        action: "Inhibits 11β-hydroxylase (CYP11B1), the final enzymatic step in cortisol synthesis (11-deoxycortisol → cortisol); rapidly reduces cortisol production within hours; accumulated precursors (11-deoxycortisol) do NOT have glucocorticoid activity",
        sideEffects: "Adrenal insufficiency (over-suppression — monitor cortisol levels), nausea, dizziness, hirsutism/acne (accumulated androgen precursors), hypokalemia worsening (ACTH-driven aldosterone remains elevated), hypertension (11-deoxycorticosterone accumulation has mineralocorticoid activity)",
        contra: "Primary adrenal insufficiency, known hypersensitivity",
        pearl: "250-750 mg PO q6h (can dose up to 6 g/day in severe ectopic ACTH). Rapid onset (hours) — useful for acute cortisol reduction. Monitor cortisol q12-24h to titrate dose. Can worsen hypokalemia (mineralocorticoid-active precursors accumulate) — add spironolactone. Often used in combination with ketoconazole for synergistic cortisol blockade. 'Block and replace' strategy: metyrapone to fully suppress cortisol + physiologic hydrocortisone replacement — provides controlled cortisol level."
      },
      {
        name: "Etomidate (IV cortisol-lowering)",
        type: "Imidazole Anesthetic / Adrenal Enzyme Inhibitor",
        action: "At sub-anesthetic doses, inhibits 11β-hydroxylase (and other adrenal steroidogenesis enzymes) similarly to ketoconazole; the ONLY IV agent available for rapid cortisol reduction — critical for patients too ill to take oral medications or in Cushing crisis",
        sideEffects: "Adrenal suppression (therapeutic), sedation (at anesthetic doses — use sub-anesthetic for cortisol lowering), myoclonus, nausea, injection site pain",
        contra: "Must be administered in ICU with cortisol monitoring q4-6h (risk of complete adrenal suppression)",
        pearl: "0.04-0.05 mg/kg/hr IV continuous infusion (sub-anesthetic dose for cortisol lowering). Check cortisol q4-6h and titrate to target 15-20 mcg/dL (not lower — risk of adrenal crisis). ONLY IV cortisol-lowering agent available — unique role in Cushing crisis when patient cannot take oral medications. Requires ICU monitoring. Duration of action is 24 hours even after single anesthetic dose (for procedural sedation) — this is why etomidate is avoided in septic patients."
      }
    ],
    pearls: [
      "Severe hypokalemia distinguishes ectopic ACTH from pituitary Cushing disease — in ectopic ACTH, cortisol levels are so high that they overwhelm 11β-HSD2, allowing cortisol to activate the mineralocorticoid receptor → massive potassium wasting; hypokalemia < 3.0 mEq/L with metabolic alkalosis in a patient with Cushing features should raise immediate suspicion for ectopic source",
      "The 'occult ectopic ACTH' syndrome is one of the most challenging diagnostic problems in endocrinology — BIPSS confirms ectopic source but imaging fails to identify the tumor (bronchial carcinoids can be < 5 mm); serial thin-cut chest CT, Ga-68 DOTATATE PET, and sometimes surveillance for years are required; bilateral adrenalectomy may be needed as a bridge",
      "Etomidate is the ONLY IV cortisol-lowering agent — for severe/life-threatening hypercortisolism (psychosis, cardiac instability, severe hypokalemia, overwhelming infection) when oral medications cannot be administered, sub-anesthetic etomidate infusion (0.04-0.05 mg/kg/hr) with q4-6h cortisol monitoring in the ICU is the rescue intervention"
    ],
    quiz: [
      {
        question: "A 62-year-old smoker presents with rapidly developing proximal weakness, K+ 2.3, glucose 380, and BP 180/105. Random cortisol is 68 mcg/dL, ACTH 350 pg/mL. 8 mg dexamethasone suppression test shows no cortisol suppression. CT chest shows a 2 cm lung nodule. What is the most likely diagnosis?",
        options: [
          "Cushing disease from a pituitary macroadenoma — MRI pituitary and BIPSS",
          "Ectopic ACTH syndrome from lung cancer — initiate cortisol-lowering therapy, oncology referral, and manage metabolic complications",
          "Primary adrenal adenoma causing Cushing syndrome — CT adrenals and surgical referral",
          "Exogenous steroid abuse — medication reconciliation and steroid taper"
        ],
        correct: 1,
        rationale: "The clinical picture is classic for ectopic ACTH syndrome: (1) rapid onset of Cushingoid metabolic features (no time for typical body habitus changes), (2) severe hypokalemia (cortisol overwhelming 11β-HSD2), (3) very high ACTH (350 pg/mL — higher than typical Cushing disease), (4) no suppression on high-dose dexamethasone (pituitary tumors typically suppress), (5) lung nodule in a smoker (ectopic source). Immediate priorities: aggressive potassium replacement, cortisol-lowering medical therapy (ketoconazole/metyrapone), glucose management, and oncology referral for the lung nodule (likely small cell carcinoma or carcinoid). Primary adrenal causes have SUPPRESSED ACTH. Exogenous steroid abuse has SUPPRESSED ACTH and cortisol."
      }
    ]
  },
  "hyperparathyroid-crisis-np": {
    title: "Hyperparathyroid Crisis: NP Management",
    cellular: {
      title: "Parathyroid Crisis Pathophysiology",
      content: "Parathyroid crisis (hypercalcemic crisis from primary hyperparathyroidism) is a rare but life-threatening emergency with corrected calcium typically > 14 mg/dL caused by acute, massive PTH hypersecretion from a parathyroid adenoma (or less commonly carcinoma). The mechanisms of severe hypercalcemia mirror those of PHPT but are amplified: markedly elevated PTH drives aggressive osteoclast-mediated bone resorption, maximizes renal calcium reabsorption, and increases calcitriol production enhancing intestinal calcium absorption. At calcium levels > 14 mg/dL, patients develop severe neuromuscular dysfunction (weakness, confusion, coma), cardiovascular compromise (shortened QT, bradycardia, cardiac arrest), renal failure (nephrocalcinosis, calcium-induced vasoconstriction of afferent arterioles), and GI dysfunction (pancreatitis from calcium-activated trypsinogen, ileus, severe constipation). The precipitant is often dehydration or immobilization in a patient with previously undiagnosed PHPT, creating a vicious cycle: hypercalcemia → polyuria (nephrogenic DI effect) → dehydration → reduced renal calcium excretion → worsening hypercalcemia."
    },
    riskFactors: [
      "Undiagnosed or undertreated primary hyperparathyroidism",
      "Dehydration (most common precipitant of crisis)",
      "Immobilization (adds disuse bone resorption to PTH-driven resorption)",
      "Thiazide diuretic initiation (reduces renal calcium excretion)",
      "Concurrent illness causing volume depletion (vomiting, diarrhea, reduced intake)",
      "Parathyroid carcinoma (may present with crisis due to very high PTH levels)",
      "Lithium therapy (shifts calcium-PTH set point)"
    ],
    diagnostics: [
      "Corrected calcium: typically > 14 mg/dL (often > 16 in true crisis); ionized calcium elevated",
      "PTH (intact): markedly elevated (often > 300-500 pg/mL; in carcinoma, may be > 1000 pg/mL)",
      "BMP: AKI (pre-renal from dehydration + calcium-induced renal vasoconstriction), elevated BUN/creatinine",
      "ECG: shortened QT, widened T waves, heart block, bradycardia; continuous monitoring required",
      "Phosphate: LOW (PTH promotes renal phosphate wasting)",
      "24-hour urine calcium: markedly elevated (distinguishes from FHH)",
      "Imaging: parathyroid ultrasound and sestamibi scan for adenoma localization; CT for parathyroid carcinoma evaluation",
      "Alkaline phosphatase: may be elevated (increased bone turnover)"
    ],
    management: [
      "Aggressive IV hydration: NS 200-500 mL/hr (3-6 L in first 24 hours — restore intravascular volume and promote renal calcium excretion); adjust for cardiac/renal function",
      "Calcitonin 4 IU/kg SC q12h: rapid onset (2-6 hours) bridge therapy — tachyphylaxis in 48 hours but provides immediate calcium lowering",
      "Zoledronic acid 4 mg IV over 15 minutes: sustained calcium reduction (onset 2-4 days, peak 4-7 days); adjust if renal impairment",
      "Denosumab 120 mg SC: if renal impairment precludes bisphosphonate",
      "Loop diuretic (furosemide): ONLY after euvolemia established; promotes calciuresis",
      "Cinacalcet 30 mg q12h: can reduce PTH rapidly in severe PHPT crisis; used as bridge to surgery",
      "URGENT parathyroidectomy: definitive treatment — should be performed within 24-72 hours once patient is medically stabilized; parathyroid crisis is a surgical emergency",
      "Dialysis: for refractory hypercalcemia with oliguric renal failure or calcium > 18 mg/dL not responding to medical therapy"
    ],
    nursingActions: [
      "Continuous cardiac monitoring: QT changes, bradycardia, heart block; report arrhythmias immediately; calcium > 14 has significant cardiac toxicity risk",
      "Aggressive hydration management: I&O hourly; lung auscultation q4h for fluid overload; daily weights; CVP monitoring if central line available",
      "Calcium monitoring: q4-6h until stable and trending down; ionized calcium preferred for accuracy in ICU setting",
      "Renal function monitoring: creatinine, BUN, urine output — AKI is common; anticipate improvement with rehydration but may need dialysis if oliguric",
      "Neurological assessment: confusion, obtundation, coma — correlates with calcium level; document mental status changes and report deterioration",
      "Pre-operative preparation: parathyroidectomy is urgent once medically stabilized; coordinate with endocrine surgery; pre-operative localization imaging",
      "Post-parathyroidectomy: calcium monitoring q6h × 24h; prepare for hungry bone syndrome (especially if alkaline phosphatase was markedly elevated pre-operatively); IV calcium gluconate available",
      "Pain and GI symptom management: nausea, vomiting, abdominal pain (may indicate pancreatitis — lipase level); bowel management (severe constipation from hypercalcemia)"
    ],
    signs: {
      left: [
        "Calcium responding to IV hydration and calcitonin — trending down toward < 14 within first 24 hours",
        "Improving mental status and renal function with rehydration",
        "Successful urgent parathyroidectomy with intraoperative PTH drop > 50% (confirming cure)",
        "Post-operative normocalcemia maintained with mild supplementation"
      ],
      right: [
        "Refractory hypercalcemia > 16 despite IV fluids, calcitonin, and bisphosphonate — consider urgent dialysis or emergent parathyroidectomy",
        "Cardiac arrest from severe hypercalcemia (calcium > 18) — aggressive IV hydration, calcitonin, and emergent calcium-lowering with dialysis",
        "Parathyroid carcinoma: very high PTH (> 1000), palpable neck mass, invasive features on imaging — en bloc resection required",
        "Post-parathyroidectomy hungry bone syndrome: severe prolonged hypocalcemia requiring IV calcium infusion + high-dose oral calcium + calcitriol"
      ]
    },
    medications: [
      {
        name: "Cinacalcet (in parathyroid crisis)",
        type: "Calcimimetic",
        action: "Activates the calcium-sensing receptor on parathyroid cells, directly reducing PTH secretion from the adenoma; provides rapid PTH lowering as a bridge to definitive surgical management",
        sideEffects: "Nausea, hypocalcemia (post-PTH drop), QT prolongation, vomiting",
        contra: "Hypocalcemia",
        pearl: "30-60 mg PO q12h for acute PTH lowering in parathyroid crisis; can reduce calcium by 1-2 mg/dL within 24-48 hours by directly suppressing PTH from the adenoma. Used as a medical bridge to surgery — does NOT replace surgery, which remains the definitive treatment. Can be crushed and given via NG tube if patient cannot swallow."
      }
    ],
    pearls: [
      "Parathyroid crisis is a SURGICAL emergency — medical management (hydration, calcitonin, bisphosphonate) stabilizes the patient, but definitive treatment is urgent parathyroidectomy within 24-72 hours; delaying surgery risks recurrent crisis and progressive organ damage",
      "The vicious cycle of hypercalcemia must be broken with aggressive hydration: high calcium → polyuria (calcium inhibits ADH action = nephrogenic DI) → dehydration → reduced GFR → reduced calcium excretion → higher calcium; NS at 200-500 mL/hr restores GFR and promotes calciuresis",
      "Parathyroid carcinoma should be suspected when PTH is massively elevated (> 1000 pg/mL), calcium is very high (> 16), a palpable neck mass is present, or there is evidence of local invasion — it requires en bloc surgical resection (not just adenomectomy) and has a high recurrence rate; do NOT rupture the capsule during surgery"
    ],
    quiz: [
      {
        question: "A 65-year-old woman presents with confusion, calcium 16.8 mg/dL, PTH 620 pg/mL, creatinine 2.4 (baseline 0.9), and potassium 3.0. ECG shows shortened QT. She has been taking hydrochlorothiazide for hypertension. What is the correct management sequence?",
        options: [
          "Start spironolactone to preserve potassium and begin cinacalcet; schedule elective parathyroidectomy in 4-6 weeks",
          "Aggressive IV NS hydration → discontinue HCTZ → calcitonin 4 IU/kg SC → zoledronic acid when renal function improves → urgent parathyroidectomy within 24-72 hours",
          "IV calcium gluconate for the shortened QT interval and nephrology consultation for emergent dialysis",
          "Start IV furosemide immediately to promote calciuresis, then schedule outpatient parathyroidectomy"
        ],
        correct: 1,
        rationale: "This is parathyroid crisis (calcium > 14, PTH markedly elevated, AKI, altered mental status). The correct sequence: (1) Aggressive NS hydration (restore volume and GFR to promote calcium excretion — the patient is severely dehydrated from hypercalcemia-induced polyuria), (2) Discontinue HCTZ (thiazides reduce urinary calcium excretion and likely precipitated the crisis), (3) Calcitonin for rapid calcium lowering (onset 2-6 hours), (4) Bisphosphonate for sustained effect once renal function improves, (5) URGENT parathyroidectomy within 24-72 hours (definitive treatment). Furosemide should NOT be given before euvolemia (worsens dehydration). IV calcium is contraindicated in hypercalcemia. Elective surgery is inappropriate for crisis."
      }
    ]
  },
  "toxic-multinodular-goiter-np": {
    title: "Toxic Multinodular Goiter: NP Mgmt",
    cellular: {
      title: "Toxic Multinodular Goiter Pathophysiology",
      content: "Toxic multinodular goiter (TMNG, Plummer disease) is the second most common cause of hyperthyroidism (after Graves disease), resulting from autonomously functioning thyroid nodules within a multinodular goiter. Over decades, chronically stimulated thyroid follicular cells develop somatic activating mutations in the TSH receptor (TSHR) or the Gsα subunit (GNAS), resulting in constitutive cAMP signaling independent of TSH. These autonomous nodules produce thyroid hormone regardless of feedback, eventually producing enough T3/T4 to suppress TSH and cause clinical thyrotoxicosis. Unlike Graves disease (which has diffuse, antibody-mediated gland activation), TMNG has focal autonomous areas within a heterogeneous gland. The thyrotoxicosis is typically milder than Graves disease but occurs in an older population (> 50 years) with more cardiovascular comorbidity — atrial fibrillation is often the presenting feature. Iodine exposure (contrast dye, amiodarone) can trigger 'iodine-induced thyrotoxicosis' (Jod-Basedow phenomenon) in TMNG patients because the autonomous nodules have capacity for increased hormone production given additional iodine substrate."
    },
    riskFactors: [
      "Longstanding multinodular goiter (MNG develops over decades; autonomous function develops gradually)",
      "Iodine deficiency areas (endemic goiter → MNG → autonomous function over time)",
      "Age > 50 years (TMNG is a disease of older adults — contrasts with Graves which peaks age 20-40)",
      "Female sex (4:1 female predominance for nodular thyroid disease)",
      "Iodine exposure in at-risk patients: CT contrast, amiodarone, kelp supplements (Jod-Basedow effect in preexisting MNG)",
      "Family history of multinodular goiter",
      "Residence in iodine-deficient regions (historically common in mountainous/inland areas)"
    ],
    diagnostics: [
      "TSH: suppressed (< 0.1 mIU/L); free T4 elevated or normal (subclinical if TSH suppressed with normal free T4/T3); free T3 may be preferentially elevated ('T3 thyrotoxicosis')",
      "Thyroid uptake and scan (I-123 or Tc-99m): patchy/heterogeneous uptake with hot (functioning) and cold (suppressed) areas — distinguishes from Graves (diffuse uptake) and toxic adenoma (single hot nodule with suppressed remaining gland)",
      "Thyroid ultrasound: multiple nodules of varying size with heterogeneous echotexture; assess for suspicious features (microcalcifications, irregular margins, hypoechogenicity) requiring FNA",
      "TSH receptor antibodies (TRAb): NEGATIVE — distinguishes TMNG from Graves disease (TRAb positive in 95% of Graves)",
      "Anti-TPO antibodies: may be mildly positive in some patients (coexistent Hashimoto's) but not characteristic",
      "ECG: atrial fibrillation is often the presenting feature in elderly TMNG patients",
      "FNA of suspicious nodules: rule out thyroid carcinoma within MNG (4-7% malignancy risk in MNG nodules with suspicious US features)",
      "CT neck/chest (without iodinated contrast if RAI planned): for large goiters to assess substernal extension, tracheal compression"
    ],
    management: [
      "Antithyroid drugs (methimazole preferred): 10-30 mg daily to achieve euthyroidism; often used as bridge to definitive therapy; TMNG rarely remits spontaneously (unlike Graves which can remit) — indefinite methimazole is needed if definitive therapy is not pursued",
      "Radioactive iodine (RAI, I-131): definitive treatment — higher doses required than Graves (30-50 mCi vs. 10-15 mCi for Graves) because of heterogeneous uptake; gradual effect over 6-18 months; hypothyroidism common result (desired)",
      "Surgery (total or near-total thyroidectomy): preferred for large goiters (> 80 g), compressive symptoms (dysphagia, dyspnea, tracheal deviation), concern for malignancy within nodules, or patient preference; requires pre-treatment with methimazole to achieve euthyroidism",
      "Beta-blockers: symptomatic relief of tachycardia, tremor, anxiety while awaiting definitive treatment; propranolol (also blocks T4→T3 conversion) or atenolol",
      "Rate control for AF: beta-blockers or calcium channel blockers; anticoagulation per CHA₂DS₂-VASc score; AF may convert to sinus rhythm once euthyroid",
      "Subclinical hyperthyroidism (suppressed TSH, normal T4/T3): treat if TSH < 0.1 in patients > 65 (increased AF and osteoporosis risk) or symptomatic; observe if TSH 0.1-0.4 and asymptomatic",
      "Avoid iodine-containing contrast and medications (amiodarone, kelp) — can worsen thyrotoxicosis in TMNG",
      "Monitor for amiodarone-induced thyrotoxicosis (AIT) type 1 in TMNG patients on amiodarone — treat with methimazole + perchlorate"
    ],
    nursingActions: [
      "Cardiac monitoring: atrial fibrillation is common in TMNG (especially elderly); HR, rhythm, assess for symptoms of HF (dyspnea, edema)",
      "Methimazole education: take at same time daily; monitor for side effects (rash — common; agranulocytosis — rare but serious: educate to report sore throat/fever immediately and check WBC)",
      "Pre-RAI preparation: methimazole should be stopped 3-5 days before RAI (methimazole reduces iodine uptake); ensure patient is not pregnant; radiation safety precautions post-treatment",
      "Pre-operative preparation for thyroidectomy: ensure euthyroid on methimazole; vocal cord assessment (pre-operative laryngoscopy); calcium/PTH baseline (hypoparathyroidism risk)",
      "Airway assessment: large goiters can cause tracheal compression; assess for stridor, positional dyspnea; CT neck for retrosternal extension",
      "Post-thyroidectomy monitoring: same as post-thyroidectomy for any cause — calcium q6h, voice assessment, airway monitoring, hematoma watch",
      "Medication review: identify and avoid iodine-containing substances (CT contrast, amiodarone, betadine, cough syrups with iodine, seaweed/kelp supplements)",
      "Long-term follow-up: TSH monitoring q6-8 weeks after treatment change; annual TSH once stable; many patients develop hypothyroidism after RAI or surgery requiring levothyroxine"
    ],
    signs: {
      left: [
        "Mild thyrotoxicosis in elderly patient: new-onset AF, modest T4 elevation, weight loss — may be the only symptoms",
        "Subclinical hyperthyroidism (TSH 0.1-0.4, normal T4/T3) in patient < 65 without symptoms — can observe with serial monitoring",
        "Responding to methimazole with normalizing TSH and improved AF rate control",
        "Successful RAI therapy with resolving thyrotoxicosis (TSH rising over months)"
      ],
      right: [
        "Large compressive goiter: tracheal deviation, dysphagia, stridor — requires surgical decompression",
        "Thyroid storm in TMNG (rare — usually precipitated by surgery in unprepared patient or iodine load)",
        "Jod-Basedow effect: acute thyrotoxicosis after CT contrast or amiodarone in patient with unrecognized TMNG",
        "Suspicious nodule within MNG: FNA showing malignancy — requires total thyroidectomy with appropriate oncologic management"
      ]
    },
    medications: [
      {
        name: "Methimazole (Tapazole)",
        type: "Thionamide Antithyroid Drug",
        action: "Inhibits thyroid peroxidase (TPO), blocking iodination and coupling reactions in thyroid hormone synthesis; does NOT block T4→T3 conversion (unlike PTU); first-line antithyroid drug for TMNG and non-pregnant Graves disease",
        sideEffects: "Rash (5%), arthralgias, GI upset, agranulocytosis (0.1-0.3% — usually within first 90 days; educate to seek emergency care for sore throat/fever), hepatotoxicity (cholestatic — milder than PTU's hepatocellular pattern), teratogenic (aplasia cutis, choanal atresia — avoid in first trimester of pregnancy)",
        contra: "First trimester pregnancy (PTU preferred), known hypersensitivity, severe hepatic impairment",
        pearl: "10-30 mg daily (single daily dose — advantage over PTU which requires TID dosing). Onset of action 2-4 weeks (existing stored hormone must deplete). Unlike Graves disease, TMNG rarely remits spontaneously — methimazole will be needed long-term if definitive therapy (RAI or surgery) is not pursued. Check CBC baseline and if sore throat/fever develops. Lower agranulocytosis risk than PTU. Preferred over PTU for all non-pregnant thyrotoxicosis."
      }
    ],
    pearls: [
      "TMNG is the most common cause of new-onset atrial fibrillation in the elderly — check TSH in ALL elderly patients presenting with new AF; thyrotoxicosis from TMNG may be the only identifiable cause, and AF may revert to sinus rhythm once euthyroidism is achieved",
      "Unlike Graves disease, TMNG does NOT spontaneously remit — the somatic activating mutations in TSHR/Gsα are permanent; patients need either lifelong methimazole or definitive treatment (RAI or surgery); this is important for counseling patients about long-term management expectations",
      "Iodine contrast or amiodarone can trigger severe thyrotoxicosis in patients with preexisting MNG through the Jod-Basedow effect — always check TSH before administering iodinated contrast to elderly patients with known or suspected goiter; if TMNG is present, use alternative imaging or pretreat with methimazole"
    ],
    quiz: [
      {
        question: "A 72-year-old woman with a known multinodular goiter presents with new atrial fibrillation, weight loss of 5 kg, and heat intolerance. TSH is 0.02 mIU/L, free T4 is 2.4 ng/dL (elevated), TRAb is negative. Thyroid scan shows patchy heterogeneous uptake with several hot areas. What is the most likely diagnosis and appropriate management?",
        options: [
          "Graves disease — start PTU and schedule ophthalmology evaluation",
          "Toxic multinodular goiter — start methimazole and beta-blocker for rate control; plan for definitive therapy (RAI or surgery)",
          "Subacute thyroiditis — supportive care with NSAIDs and observe for spontaneous resolution",
          "Toxic adenoma — schedule urgent hemithyroidectomy"
        ],
        correct: 1,
        rationale: "The clinical picture is classic for TMNG: elderly patient, known MNG, thyrotoxicosis symptoms, suppressed TSH with elevated T4, NEGATIVE TRAb (excludes Graves — which has positive TRAb), and thyroid scan showing patchy heterogeneous uptake with hot areas (TMNG pattern vs. diffuse uptake in Graves or single hot nodule in toxic adenoma). Management: methimazole to achieve euthyroidism, beta-blocker for AF rate control and symptom relief, anticoagulation assessment (CHA₂DS₂-VASc score), and planning for definitive therapy (RAI is most common in elderly; surgery if compressive symptoms or malignancy concern)."
      }
    ]
  },
  "thyroid-nodule-malignancy-np": {
    title: "Thyroid Nodule Malignancy Workup: NP",
    cellular: {
      title: "Thyroid Nodule Risk Assessment",
      content: "Thyroid nodules are extremely common (present in 50-70% of adults on ultrasound) but only 5-15% are malignant. Risk stratification is based on clinical history, ultrasound features, and cytological findings. The American Thyroid Association (ATA) ultrasound pattern classification stratifies nodules by sonographic appearance: high suspicion (solid hypoechoic with microcalcifications, irregular margins, taller-than-wide, or extrathyroidal extension — malignancy risk 70-90%), intermediate suspicion (solid hypoechoic without the above features — 10-20%), low suspicion (isoechoic/hyperechoic solid or partially cystic — 5-10%), very low suspicion (spongiform or partially cystic without suspicious features — < 3%), and benign (purely cystic — < 1%). FNA is the diagnostic standard: the Bethesda classification system (I-VI) guides management based on cytological findings. Molecular testing (ThyroSeq, Afirma GSC) of FNA specimens with indeterminate cytology (Bethesda III-IV) has improved risk stratification, reducing unnecessary surgery by 50-75% for benign molecular results."
    },
    riskFactors: [
      "Childhood head/neck radiation exposure (strongest risk factor for papillary thyroid cancer — 7% excess risk per Gy)",
      "Family history of thyroid cancer (first-degree relative — 2-3x increased risk)",
      "Male sex with thyroid nodule (higher malignancy rate per nodule than females — 8-10% vs. 5-6%)",
      "Age < 20 or > 70 (higher malignancy risk at extremes of age)",
      "Rapid nodule growth",
      "Firm, fixed, non-mobile nodule on palpation",
      "Associated cervical lymphadenopathy",
      "History of familial adenomatous polyposis (FAP), Cowden syndrome, MEN2, or Carney complex"
    ],
    diagnostics: [
      "TSH: first test for all thyroid nodules; if low → thyroid scan to evaluate for autonomously functioning ('hot') nodule (hot nodules are almost never malignant — FNA not needed)",
      "Thyroid ultrasound: ATA pattern classification; measure nodule dimensions (≥ 3 dimensions); assess for suspicious features: microcalcifications, irregular margins, hypoechogenicity, taller-than-wide, extrathyroidal extension, abnormal cervical lymph nodes",
      "FNA biopsy: indicated based on size AND ultrasound pattern — high suspicion ≥ 1 cm, intermediate ≥ 1 cm, low suspicion ≥ 1.5-2 cm, very low ≥ 2 cm; US-guided FNA preferred; FNA of any suspicious lymph node regardless of thyroid nodule size",
      "Bethesda classification: I (non-diagnostic — repeat FNA), II (benign — follow with US), III (atypia/FLUS — molecular testing or repeat FNA), IV (follicular neoplasm — molecular testing or lobectomy), V (suspicious for malignancy — surgery), VI (malignant — surgery)",
      "Molecular testing (Bethesda III-IV): ThyroSeq v3 (positive predictive value ~60-70%), Afirma GSC (negative predictive value ~96%); benign molecular result can avoid surgery; suspicious result guides extent of surgery",
      "Calcitonin: not routinely recommended by ATA but some guidelines suggest checking if > 1 cm nodule; elevated calcitonin suggests medullary thyroid cancer (FNA cytology may miss MTC)",
      "CT neck (without iodinated contrast if RAI possible): for large nodules or suspected extrathyroidal extension; assess lymph node involvement",
      "Lymph node FNA with thyroglobulin washout: for suspicious lateral neck lymph nodes (Tg-FNA > institutional threshold = metastatic PTC)"
    ],
    management: [
      "Benign cytology (Bethesda II): surveillance with repeat US at 12-24 months; if stable × 2-3 years, extend interval; FNA only for significant growth (> 20% increase in 2 dimensions or > 50% volume increase)",
      "Indeterminate cytology (Bethesda III-IV): molecular testing (preferred) — benign molecular result → surveillance; suspicious molecular result → surgery (lobectomy or total thyroidectomy based on nodule size, patient preference, molecular result)",
      "Suspicious/malignant cytology (Bethesda V-VI): surgery — lobectomy sufficient for low-risk PTC < 4 cm without extrathyroidal extension; total thyroidectomy for larger tumors, bilateral disease, or when RAI is planned",
      "Active surveillance: an option for very low-risk papillary microcarcinoma (< 1 cm, no extrathyroidal extension, no nodal disease, favorable location away from RLN and trachea) — Japanese experience shows excellent outcomes with surveillance",
      "Pre-operative: vocal cord assessment (laryngoscopy); TSH, calcium, PTH baseline; discussion of surgical extent and completion thyroidectomy possibility",
      "Thyroid lobectomy: appropriate for low-risk DTC 1-4 cm without ETE; advantage — 50% chance of avoiding levothyroxine; disadvantage — if final pathology upgrades, may need completion thyroidectomy",
      "RAI therapy: considered after total thyroidectomy for intermediate-high risk DTC; requires TSH stimulation (THW or rhTSH); follow with surveillance thyroglobulin",
      "Medullary thyroid cancer: total thyroidectomy with central ± lateral lymph node dissection; RET testing; calcitonin and CEA for surveillance"
    ],
    nursingActions: [
      "TSH ordering: first step for ALL thyroid nodules — if TSH is low, the patient needs a thyroid scan before FNA (hot nodules don't need FNA — they're almost never malignant)",
      "FNA preparation: explain the procedure (US-guided, minimal discomfort, 15-20 minutes, 3-4 passes typical); no anticoagulation hold needed for superficial FNA; post-procedure ice and pressure for 15 minutes",
      "Bethesda result communication: help patients understand the result category and its clinical implications; Bethesda II (benign — 97% accuracy) is reassuring; Bethesda III-IV (indeterminate — ~15-30% malignancy risk) needs further workup, not immediate surgery",
      "Molecular testing education: if Bethesda III-IV, explain that molecular testing can often determine whether surgery is needed — reduces unnecessary thyroidectomies by 50-75%",
      "Pre-operative patient education: voice changes possible (RLN risk 1-2%), hypoparathyroidism risk (temporary 10-20%, permanent 1-2%), need for thyroid hormone replacement after total thyroidectomy, scar care",
      "Cancer diagnosis support: thyroid cancer diagnosis is frightening; reassure that differentiated thyroid cancer has excellent prognosis (10-year survival > 95% for PTC and FTC); connect with thyroid cancer support groups",
      "Surveillance nodule tracking: maintain tracking system for benign nodules — US at 12-24 months, then extended intervals if stable; ensure patients don't fall through cracks (lost to follow-up)",
      "Active surveillance counseling: for eligible patients with papillary microcarcinoma, discuss active surveillance as a safe alternative to immediate surgery — requires commitment to regular US monitoring (q6 months × 2 years, then annually)"
    ],
    signs: {
      left: [
        "Benign FNA (Bethesda II): stable nodule on serial ultrasound — continue surveillance per protocol",
        "Indeterminate FNA with benign molecular testing (Afirma GSC negative): can avoid surgery with US surveillance",
        "Low-risk PTC after lobectomy: favorable pathology (< 2 cm, no ETE, negative margins, no nodal disease) — surveillance without RAI",
        "Active surveillance of papillary microcarcinoma: stable size on serial US, no new concerning features"
      ],
      right: [
        "High-suspicion US pattern with Bethesda V-VI cytology: confirmed malignancy requiring surgical planning",
        "Rapidly growing nodule with extracapsular extension on US: concern for aggressive thyroid cancer variant (anaplastic or poorly differentiated)",
        "Lateral neck lymph node with elevated Tg-FNA washout: metastatic PTC requiring modified radical neck dissection in addition to thyroidectomy",
        "Bethesda I (non-diagnostic) on repeat FNA: consider core needle biopsy or diagnostic lobectomy; do not dismiss as benign"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (post-thyroidectomy)",
        type: "Thyroid Hormone Replacement",
        action: "Replaces thyroid hormone after thyroidectomy; in thyroid cancer management, also provides TSH suppression to reduce tumor growth stimulation (TSH suppression targets depend on risk stratification)",
        sideEffects: "At replacement doses: minimal if properly dosed; at suppressive doses: AF risk, bone loss in postmenopausal women, anxiety, insomnia, palpitations",
        contra: "Untreated adrenal insufficiency (treat cortisol deficiency first)",
        pearl: "Post-thyroidectomy: start levothyroxine at ~1.6 mcg/kg/day for replacement; adjust for TSH target based on cancer risk. After lobectomy: ~50% of patients maintain adequate thyroid function without levothyroxine — monitor TSH at 6-8 weeks. Post-total thyroidectomy: all patients need levothyroxine. Take on empty stomach, 30-60 minutes before breakfast; separate from calcium, iron, PPIs by 4 hours."
      }
    ],
    pearls: [
      "The first test for ANY thyroid nodule is TSH — not ultrasound or FNA; if TSH is suppressed, obtain a thyroid scan: autonomously functioning ('hot') nodules are almost never malignant and do not need FNA; this simple step avoids unnecessary invasive procedures",
      "Molecular testing for indeterminate FNA results (Bethesda III-IV) has transformed thyroid nodule management — a benign molecular result (especially Afirma GSC negative with 96% NPV) can safely avoid surgery in patients who would have previously undergone diagnostic lobectomy; this reduces unnecessary thyroidectomies by 50-75%",
      "Active surveillance is an emerging, guideline-supported option for very low-risk papillary thyroid microcarcinoma (< 1 cm, no ETE, favorable location) — decades of Japanese data show that the vast majority of these tiny papillary cancers do not grow or metastasize during surveillance; this option should be discussed with eligible patients who prefer to avoid surgery"
    ],
    quiz: [
      {
        question: "A 38-year-old woman has a 1.2 cm solid hypoechoic thyroid nodule with irregular margins and microcalcifications on ultrasound. TSH is normal. FNA shows Bethesda V (suspicious for papillary thyroid carcinoma). What is the most appropriate management?",
        options: [
          "Repeat FNA in 6 months to confirm the diagnosis before any surgical intervention",
          "Molecular testing (ThyroSeq or Afirma) to better characterize the indeterminate result",
          "Thyroid lobectomy or total thyroidectomy based on patient preference and clinical factors — Bethesda V has 60-75% malignancy risk",
          "Observe with serial ultrasound every 6 months — small nodules rarely need surgery"
        ],
        correct: 2,
        rationale: "Bethesda V (suspicious for malignancy) has a 60-75% malignancy risk and is an indication for surgery. The ultrasound features (solid hypoechoic, irregular margins, microcalcifications) are ATA high-suspicion pattern, further supporting malignancy. Either lobectomy (if low-risk features anticipated — < 4 cm, no bilateral disease) or total thyroidectomy (if patient prefers definitive surgery, bilateral nodular disease, or RAI anticipated) is appropriate. Molecular testing is primarily useful for Bethesda III-IV (indeterminate), not Bethesda V where malignancy risk is already high enough to recommend surgery. Repeating FNA delays diagnosis of a likely cancer."
      }
    ]
  }
};
