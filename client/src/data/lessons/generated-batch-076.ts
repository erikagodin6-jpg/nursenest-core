import type { LessonContent } from "./types";

export const generatedBatch076Lessons: Record<string, LessonContent> = {
  "pituitary-function": {
    title: "Pituitary Gland and Hormones",
    cellular: { title: "Pathophysiology of Pituitary Gland and Hormones", content: "The pituitary gland (hypophysis), located in the sella turcica of the sphenoid bone, is divided into the anterior pituitary (adenohypophysis) and posterior pituitary (neurohypophysis), collectively controlling growth, metabolism, reproduction, and fluid balance. The anterior pituitary produces six hormones under hypothalamic regulation: growth hormone (GH — stimulated by GHRH, inhibited by somatostatin), thyroid-stimulating hormone (TSH — stimulated by TRH), adrenocorticotropic hormone (ACTH — stimulated by CRH), follicle-stimulating hormone (FSH) and luteinizing hormone (LH — both stimulated by GnRH), and prolactin (tonically inhibited by dopamine). The posterior pituitary stores and releases two hormones synthesized in the hypothalamus: antidiuretic hormone (ADH/vasopressin — released in response to increased serum osmolality or decreased blood volume, acting on V2 receptors in renal collecting ducts to insert aquaporin-2 channels for water reabsorption) and oxytocin (stimulating uterine contractions during labor and milk ejection during breastfeeding). Pituitary disorders include hyperpituitarism (adenomas causing excess hormone production — acromegaly from GH excess, Cushing's disease from ACTH excess, prolactinoma) and hypopituitarism (panhypopituitarism from tumor compression, Sheehan syndrome from postpartum pituitary infarction, or surgical removal)." },
    riskFactors: ["Pituitary adenoma (most common cause of hyperpituitarism, often prolactinomas or GH-secreting tumors)","Head trauma or neurosurgery near the sella turcica","Postpartum hemorrhage with hypovolemic shock (Sheehan syndrome causing pituitary infarction)","Cranial radiation therapy (damages hypothalamic-pituitary axis over time)","Autoimmune hypophysitis (lymphocytic infiltration, particularly peripartum)","Genetic syndromes (MEN-1 associated with pituitary, parathyroid, and pancreatic tumors)","Infiltrative diseases (sarcoidosis, hemochromatosis, histiocytosis affecting the pituitary stalk)"],
    diagnostics: ["Serum hormone panels: prolactin, GH, IGF-1, TSH, free T4, ACTH, morning cortisol, FSH, LH, estradiol/testosterone","MRI of the sella turcica with gadolinium contrast to identify pituitary adenomas or empty sella","Water deprivation test for suspected diabetes insipidus (monitor urine osmolality and serum sodium)","ACTH stimulation test (cosyntropin test) to evaluate adrenal insufficiency from ACTH deficiency","Visual field testing (confrontation and formal perimetry) to assess for bitemporal hemianopsia from optic chiasm compression","Insulin tolerance test (gold standard for GH and ACTH reserve assessment in panhypopituitarism)"],
    management: ["Hormone replacement therapy tailored to specific deficiencies (cortisol MUST be replaced before thyroid hormone to avoid adrenal crisis)","Transsphenoidal surgery for macroadenomas causing mass effect or visual field deficits","Dopamine agonists (cabergoline, bromocriptine) as first-line for prolactinomas","Desmopressin (DDAVP) for diabetes insipidus from posterior pituitary dysfunction","Radiation therapy for residual or recurrent tumors not amenable to surgery","Monitor and replace gonadal hormones, growth hormone in deficient adults as indicated"],
    nursingActions: ["Monitor strict intake and output — sudden polyuria (>250 mL/hr of dilute urine) may indicate diabetes insipidus onset","Assess visual fields at each encounter; report any new visual changes immediately (chiasm compression)","Monitor serum sodium closely — both hypernatremia (DI) and hyponatremia (SIADH) can occur with pituitary disorders","Administer stress-dose corticosteroids before procedures in patients with ACTH deficiency","Assess for signs of adrenal crisis: severe hypotension, altered consciousness, abdominal pain, hypoglycemia","Educate patients on wearing a medical alert bracelet for adrenal insufficiency and emergency cortisol injection"],
    assessmentFindings: ["Visual field deficits (bitemporal hemianopsia) from pituitary mass compressing the optic chiasm","Galactorrhea (inappropriate breast milk production) in hyperprolactinemia","Acral enlargement (hands, feet, jaw) and coarse facial features in acromegaly","Polyuria and polydipsia with dilute urine in diabetes insipidus","Fatigue, cold intolerance, weight gain, and dry skin in secondary hypothyroidism","Signs of Cushing disease: central obesity, moon face, purple striae, buffalo hump, easy bruising"],
    signs: {
      left: ["Galactorrhea or menstrual irregularity","Mild fatigue and cold intolerance","Gradual increase in hat, shoe, or ring size","Decreased libido or erectile dysfunction","Mild headache near the temples"],
      right: ["Sudden severe headache with visual loss (pituitary apoplexy — hemorrhage into adenoma)","Acute adrenal crisis: profound hypotension, shock, altered consciousness","Diabetes insipidus with massive polyuria and dangerous hypernatremia","Bitemporal hemianopsia with rapid visual deterioration","Severe hypoglycemia from combined ACTH and GH deficiency"]
    },
    medications: [{
      name: "Cabergoline",
      type: "Dopamine agonist",
      action: "Stimulates D2 dopamine receptors on lactotroph cells, suppressing prolactin secretion and shrinking prolactinomas",
      sideEffects: "Nausea, dizziness, orthostatic hypotension, headache; rarely cardiac valvular fibrosis at high doses",
      contra: "Uncontrolled hypertension, hypersensitivity to ergot derivatives, history of cardiac valvular disease",
      pearl: "First-line for prolactinoma — normalizes prolactin and shrinks tumor in >80% of cases; take with food at bedtime to reduce nausea"
    },{
      name: "Desmopressin (DDAVP)",
      type: "Synthetic vasopressin analog",
      action: "Selective V2 receptor agonist that increases water reabsorption in renal collecting ducts by inserting aquaporin-2 channels",
      sideEffects: "Hyponatremia (water intoxication), headache, nasal congestion (intranasal form)",
      contra: "Habitual polydipsia, hyponatremia, moderate-to-severe renal impairment",
      pearl: "Monitor serum sodium regularly; instruct patients to limit evening fluid intake to prevent nocturnal hyponatremia"
    }],
    pearls: ["Always replace cortisol BEFORE thyroid hormone in panhypopituitarism — starting levothyroxine first increases cortisol metabolism and can precipitate adrenal crisis","Pituitary apoplexy (hemorrhage into an adenoma) presents with sudden thunderclap headache, visual loss, and ophthalmoplegia — it is a neurosurgical emergency","Sheehan syndrome should be suspected in any woman with postpartum failure to lactate and persistent fatigue after significant delivery-related blood loss","Prolactinomas are treated medically (cabergoline) first, NOT surgically — they are uniquely responsive to dopamine agonist therapy","Diabetes insipidus produces large volumes of dilute urine (low specific gravity <1.005); SIADH produces concentrated urine with hyponatremia — know the distinction","Patients with adrenal insufficiency must double their steroid dose during illness and carry emergency injectable hydrocortisone"],
    quiz: [
      {
        question: "A nurse notices a post-surgical pituitary patient suddenly producing 400 mL of clear urine per hour with a specific gravity of 1.002. Which condition should the nurse suspect?",
        options: ["Syndrome of inappropriate ADH (SIADH)","Diabetes insipidus","Normal postoperative diuresis","Urinary tract infection"],
        correct: 1,
        rationale: "Large volumes of dilute urine (low specific gravity) after pituitary surgery indicate diabetes insipidus from disrupted ADH release. SIADH would cause concentrated urine with decreased output."
      },
      {
        question: "A patient with panhypopituitarism needs hormone replacement. Which hormone must be replaced FIRST before starting thyroid hormone?",
        options: ["Growth hormone","Testosterone","Cortisol (glucocorticoid)","Estrogen"],
        correct: 2,
        rationale: "Cortisol must be replaced before thyroid hormone because levothyroxine increases cortisol metabolism. Starting thyroid replacement without adequate cortisol coverage can precipitate a life-threatening adrenal crisis."
      },
      {
        question: "A patient with a prolactinoma asks why surgery was not recommended as first-line treatment. What is the best explanation?",
        options: ["Surgery carries a 50% mortality rate for pituitary tumors","Prolactinomas uniquely respond to dopamine agonist medication, which shrinks the tumor and normalizes hormone levels","Radiation therapy is always preferred over surgery","Prolactinomas are benign and never require any treatment"],
        correct: 1,
        rationale: "Unlike other pituitary adenomas, prolactinomas respond exceptionally well to dopamine agonists (cabergoline), which normalize prolactin levels and reduce tumor size in over 80% of patients, making surgery unnecessary in most cases."
      },
    ]
  },
  "pku-adult-management-np": {
    title: "PKU Adult Management",
    cellular: { title: "Pathophysiology of PKU Adult Management", content: "Phenylketonuria (PKU) is an autosomal recessive inborn error of metabolism caused by deficiency of phenylalanine hydroxylase (PAH), the hepatic enzyme that converts phenylalanine (Phe) to tyrosine. Without functional PAH, phenylalanine accumulates in the blood and crosses the blood-brain barrier, where it competitively inhibits large neutral amino acid transport, disrupts neurotransmitter synthesis (dopamine, serotonin, norepinephrine), impairs myelin formation, and causes oxidative stress to neurons. In adults who discontinue dietary treatment, elevated phenylalanine causes executive dysfunction, anxiety, depression, tremor, and white matter changes on MRI. Maternal PKU syndrome occurs when women with PKU become pregnant without adequate phenylalanine control (Phe >6 mg/dL), causing microcephaly, congenital heart defects, intellectual disability, and intrauterine growth restriction in the non-PKU fetus due to teratogenic effects of elevated maternal Phe crossing the placenta." },
    riskFactors: ["Autosomal recessive inheritance (both parents must carry PAH mutation)","Discontinuation of phenylalanine-restricted diet during adolescence or adulthood","Maternal PKU without preconception phenylalanine control (teratogenic to fetus)","High-protein dietary intake without medical food supplementation","Non-adherence to amino acid formula (medical food) leading to nutritional deficiencies","BH4-nonresponsive classic PKU genotype (more severe enzyme deficiency)","Inadequate monitoring of blood phenylalanine levels"],
    diagnostics: ["Quantitative plasma phenylalanine levels (target 120-360 micromol/L or 2-6 mg/dL for adults)","Plasma tyrosine levels (often low due to impaired conversion from phenylalanine)","Plasma amino acid profile to assess nutritional adequacy of medical food","BH4 loading test to determine sapropterin responsiveness (20 mg/kg oral challenge)","Neuropsychological testing for executive function, attention, and processing speed","Brain MRI for white matter changes in patients with chronically elevated Phe","Bone density screening (DXA scan) — PKU patients on restricted diets are at risk for osteopenia"],
    management: ["Lifelong phenylalanine-restricted diet with individualized Phe tolerance (typically 200-500 mg Phe/day)","Phenylalanine-free amino acid medical formula to ensure adequate protein and micronutrient intake","Sapropterin (Kuvan/BH4) trial for BH4-responsive patients — may allow increased dietary Phe tolerance","Pegvaliase (Palynziq) enzyme substitution therapy for adults with uncontrolled Phe on diet alone","Preconception counseling: achieve Phe <6 mg/dL at least 3 months before conception (maternal PKU)","Regular monitoring of nutritional status including vitamin B12, iron, zinc, selenium, and essential fatty acids","Neuropsychiatric assessment and treatment for anxiety, depression, and executive dysfunction"],
    nursingActions: ["Monitor plasma phenylalanine levels at each visit; correlate with dietary adherence and clinical symptoms","Counsel on strict avoidance of high-Phe foods: meat, fish, eggs, dairy, nuts, soy, aspartame-containing products","Assess adherence to amino acid medical formula — palatability is a major barrier; discuss flavoring strategies","Screen for depression, anxiety, and cognitive changes at each visit using validated tools (PHQ-9, GAD-7)","Coordinate preconception counseling for women of childbearing age — maternal PKU syndrome prevention is critical","Educate about aspartame avoidance — metabolized to phenylalanine; present in diet sodas and sugar-free products","Monitor injection site reactions and anaphylaxis risk in patients receiving pegvaliase"],
    assessmentFindings: ["Musty or mousy body odor (from phenylacetic acid accumulation in sweat)","Lighter skin and hair pigmentation than family members (impaired melanin synthesis from low tyrosine)","Executive dysfunction: difficulty with planning, organization, working memory, and sustained attention","Anxiety, depression, irritability (from disrupted monoamine neurotransmitter synthesis)","Tremor, hyperreflexia, or spasticity with chronically elevated phenylalanine (>20 mg/dL)","Eczematous skin rash in poorly controlled PKU","White matter changes on brain MRI correlating with blood Phe levels"],
    signs: {
      left: ["Blood Phe within target (2-6 mg/dL)","Stable mood and cognitive function","Good dietary adherence with medical formula","Normal growth parameters and nutritional markers","Skin and hair pigmentation appropriate for family"],
      right: ["Blood Phe >20 mg/dL with neurocognitive decline","Severe anxiety, depression, or psychotic features","Tremor, hyperreflexia, or gait disturbance","Pregnant with uncontrolled Phe (maternal PKU emergency)","Anaphylaxis symptoms after pegvaliase injection"]
    },
    medications: [{
      name: "Sapropterin (Kuvan)",
      type: "Phenylalanine hydroxylase cofactor (synthetic BH4)",
      action: "Provides exogenous tetrahydrobiopterin that stabilizes residual PAH enzyme, enhancing phenylalanine metabolism and lowering blood Phe levels in BH4-responsive patients",
      sideEffects: "Headache, rhinorrhea, pharyngolaryngeal pain, diarrhea, vomiting",
      contra: "BH4-nonresponsive PKU genotype (no residual PAH activity to enhance)",
      pearl: "Only effective in ~25-50% of PKU patients; BH4 loading test required before prescribing; dissolve tablets in water and take with food"
    },{
      name: "Pegvaliase (Palynziq)",
      type: "PEGylated phenylalanine ammonia lyase (enzyme substitution)",
      action: "Substitutes for deficient PAH by converting phenylalanine to trans-cinnamic acid and ammonia via an alternative metabolic pathway, reducing blood Phe levels",
      sideEffects: "Injection site reactions (most common), anaphylaxis (REMS program required), arthralgia, hypersensitivity",
      contra: "Inability to self-administer epinephrine for anaphylaxis management",
      pearl: "REMS-restricted: patients must carry auto-injectable epinephrine at all times; slow dose titration over months to target dose; observe 60 minutes after first injection"
    }],
    pearls: ["PKU is LIFELONG — adults who abandon dietary treatment develop executive dysfunction, mood disorders, and white matter changes that may be partially reversible with diet resumption","Maternal PKU syndrome is preventable: blood Phe must be <6 mg/dL for at least 3 months BEFORE conception and maintained throughout pregnancy","Aspartame (NutraSweet) is metabolized to phenylalanine and is absolutely contraindicated — check all medications and sugar-free products","Sapropterin works only in BH4-responsive patients (~25-50%); a formal BH4 loading test must be performed before prescribing","Pegvaliase carries anaphylaxis risk requiring REMS enrollment and auto-injectable epinephrine; most effective option for adults uncontrolled on diet alone","Low tyrosine contributes to light pigmentation and impaired neurotransmitter synthesis — tyrosine supplementation may benefit some patients"],
    quiz: [
      {
        question: "A 28-year-old woman with PKU presents for preconception counseling. Her current blood phenylalanine level is 14 mg/dL. What is the priority recommendation?",
        options: ["She may conceive now and begin dietary restriction during the first trimester","She must achieve blood Phe <6 mg/dL for at least 3 months before conception","PKU dietary restriction is unnecessary during pregnancy","Sapropterin alone is sufficient without dietary modification"],
        correct: 1,
        rationale: "Maternal PKU syndrome (microcephaly, congenital heart defects, intellectual disability in the fetus) is caused by elevated maternal Phe crossing the placenta. Blood Phe must be controlled to <6 mg/dL for at least 3 months before conception and maintained throughout pregnancy."
      },
      {
        question: "An adult PKU patient reports drinking diet soda containing aspartame. What should the NP advise?",
        options: ["Aspartame is safe in moderation for PKU patients","Aspartame must be strictly avoided because it is metabolized to phenylalanine","Aspartame only affects children with PKU, not adults","Switch to sucralose only if blood Phe is above 10 mg/dL"],
        correct: 1,
        rationale: "Aspartame is an artificial sweetener that is metabolized to phenylalanine in the body. It is absolutely contraindicated in PKU because it directly raises blood phenylalanine levels. All diet beverages and sugar-free products must be checked for aspartame content."
      },
      {
        question: "Which medication requires enrollment in a REMS program due to anaphylaxis risk in PKU management?",
        options: ["Sapropterin (Kuvan)","Pegvaliase (Palynziq)","Levothyroxine","Folic acid"],
        correct: 1,
        rationale: "Pegvaliase (Palynziq) carries a significant risk of anaphylaxis and requires REMS enrollment. Patients must carry auto-injectable epinephrine at all times and be observed for 60 minutes after the initial injection."
      },
    ]
  },
  "placental-abruption-basics-rpn": {
    title: "Placental Abruption Basics",
    cellular: { title: "Understanding Placental Abruption", content: "Placental abruption is a serious pregnancy complication where the placenta separates from the uterine wall before the baby is born. The placenta is the baby's lifeline providing oxygen and nutrients. When it separates, the baby loses part or all of its blood supply, and the mother can experience severe bleeding.\n\nAbruption can be partial or complete (life-threatening emergency). Bleeding can be revealed (dark red vaginal bleeding) or concealed (blood trapped behind the placenta — no visible bleeding but the uterus becomes rigid and painful). Concealed abruption is more dangerous because severity is underestimated.\n\nThe classic presentation is painful vaginal bleeding with a rigid, tender uterus in the third trimester. Risk factors include hypertension (the #1 risk factor), prior abruption, abdominal trauma, cocaine use, smoking, and premature rupture of membranes." },
    riskFactors: ["Hypertension/preeclampsia (most common risk factor)", "Previous placental abruption (recurrence risk 10-15%)", "Abdominal trauma (car accident, fall, domestic violence)", "Cocaine or methamphetamine use", "Cigarette smoking", "Premature rupture of membranes", "Advanced maternal age", "Multiple gestation"],
    diagnostics: ["Monitor fetal heart rate continuously (late decelerations, bradycardia = fetal distress)", "Assess uterine tone (rigid, board-like uterus is classic)", "Monitor vital signs for hemorrhagic shock", "Estimate blood loss (concealed hemorrhage may be present)", "Expect CBC, coagulation studies (DIC can develop)", "Ultrasound may confirm but CANNOT rule out abruption (sensitivity only 50%)"],
    management: ["Call for help immediately — obstetric emergency", "Start large-bore IV access (two lines) for fluid resuscitation", "Position patient on left side to optimize uteroplacental blood flow", "Prepare for emergency cesarean delivery if fetal distress", "Administer oxygen via non-rebreather mask", "Type and crossmatch blood for potential transfusion"],
    nursingActions: ["Apply continuous electronic fetal monitoring — report abnormalities immediately", "Monitor uterine activity: tone, tenderness, contractions", "Monitor for hemorrhagic shock: tachycardia, hypotension, pallor", "Maintain two large-bore IV lines", "Monitor pad count and weigh pads for blood loss estimation", "Assess for DIC: oozing from IV sites, petechiae, gingival bleeding", "Provide emotional support", "Prepare for emergency delivery at all times"],
    assessmentFindings: ["Painful dark red vaginal bleeding in third trimester", "Rigid, board-like, tender uterus", "Fetal heart rate abnormalities (late decelerations, bradycardia)", "Signs of hemorrhagic shock", "Concealed hemorrhage: rigidity and pain WITHOUT visible bleeding", "Increasing fundal height (blood accumulating behind placenta)"],
    signs: {
      left: ["Painful vaginal bleeding (dark red)", "Abdominal pain and tenderness", "Back pain", "Constant uterine pain", "Decreased fetal movement"],
      right: ["Rigid board-like uterus", "Fetal heart rate abnormalities", "Tachycardia and hypotension", "Increasing fundal height", "Abnormal coagulation studies"]
    },
    medications: [{
      name: "Oxytocin (Pitocin) — post-delivery",
      type: "Uterotonic",
      action: "Stimulates uterine contractions to control postpartum hemorrhage by compressing blood vessels at the placental site",
      sideEffects: "Uterine hyperstimulation, water intoxication at high doses",
      contra: "Before delivery if fetal distress requires emergent cesarean",
      pearl: "Used AFTER delivery to prevent postpartum hemorrhage from uterine atony; the definitive treatment for abruption with fetal distress is DELIVERY"
    }],
    pearls: ["Abruption = PAINFUL bleeding + RIGID uterus; Previa = PAINLESS bleeding + SOFT uterus", "Hypertension is the #1 risk factor", "Concealed hemorrhage can be MORE dangerous — severity is underestimated", "A negative ultrasound does NOT rule out abruption (sensitivity only ~50%)", "DIC can develop rapidly from tissue thromboplastin release", "Delivery is the definitive treatment"],
    quiz: [{
      question: "A patient at 34 weeks has painful dark red vaginal bleeding and a rigid, tender uterus. What should the nurse suspect?",
      options: ["Placenta previa", "Placental abruption — painful bleeding with rigid uterus is classic", "Normal labor", "Cervical insufficiency"],
      correct: 1,
      rationale: "Painful bleeding with rigid, board-like uterus is classic for abruption. Placenta previa causes PAINLESS bright red bleeding with a soft uterus."
    }, {
      question: "A pregnant patient had a car accident and has severe abdominal pain and rigid uterus but NO vaginal bleeding. Could this be abruption?",
      options: ["No — abruption always causes visible bleeding", "Yes — concealed abruption where blood is trapped behind the placenta", "No — just muscle soreness", "Only if bleeding starts later"],
      correct: 1,
      rationale: "Concealed abruption occurs when blood is trapped between the placenta and uterine wall. Pain and rigidity are present without visible bleeding, making it more dangerous because blood loss is hidden."
    }, {
      question: "What is the most common risk factor for placental abruption?",
      options: ["Gestational diabetes", "Hypertension/preeclampsia", "Group B Streptococcus", "Iron deficiency anemia"],
      correct: 1,
      rationale: "Hypertension and preeclampsia are the most common risk factors. Chronic hypertension damages spiral arteries supplying the placenta, predisposing to premature separation."
    }]
  },
  "placenta-previa-basics-rpn": {
    title: "Placenta Previa Basics",
    cellular: { title: "Understanding Placenta Previa", content: "Placenta previa occurs when the placenta implants over or near the opening of the cervix. Normally the placenta implants in the upper uterus. When it covers the cervix, it blocks the baby's exit and can cause severe bleeding.\n\nTypes include complete previa (placenta completely covers the cervical opening), partial previa (partially covers), and marginal previa (edge near but not covering). Low-lying placenta means it is within 2 cm of the cervix.\n\nThe hallmark is PAINLESS bright red vaginal bleeding, usually starting in the late second or third trimester. As the cervix thins and dilates, the placenta separates from the cervix, tearing blood vessels. Key difference from abruption: previa causes PAINLESS bleeding with SOFT uterus; abruption causes PAINFUL bleeding with RIGID uterus.\n\nDo NOT perform a digital vaginal exam on a patient with suspected placenta previa — this can cause massive hemorrhage." },
    riskFactors: ["Prior cesarean section (scar provides abnormal implantation site)", "Prior placenta previa (recurrence risk 4-8%)", "Multiple gestation", "Advanced maternal age (>35 years)", "Multiparity", "Smoking", "Uterine surgery (myomectomy, prior D&C)", "In vitro fertilization"],
    diagnostics: ["Diagnosis confirmed by transvaginal ultrasound (safe — NOT a digital vaginal exam)", "Monitor fetal heart rate during bleeding episodes", "Monitor maternal vital signs for hemorrhagic shock", "Order CBC for hemoglobin and hematocrit", "Type and crossmatch blood", "Serial ultrasounds to track placental location (many resolve by term)"],
    management: ["Nothing per vagina: no vaginal exams, no intercourse, no tampons", "If preterm and stable: expectant management with antenatal corticosteroids", "If bleeding is severe: emergency cesarean regardless of gestational age", "Complete previa at term: planned cesarean delivery (vaginal delivery contraindicated)", "Prepare for potential blood transfusion", "Bed rest or modified activity as ordered"],
    nursingActions: ["Do NOT perform digital vaginal exam — can cause massive hemorrhage", "Monitor vaginal bleeding: amount, color, clots", "Apply continuous fetal monitoring during bleeding", "Monitor maternal vital signs frequently", "Maintain IV access with large-bore catheter", "Educate on pelvic rest: no intercourse, no douching, no tampons", "Keep emergency delivery supplies at bedside", "Provide emotional support about activity restrictions"],
    assessmentFindings: ["Painless bright red vaginal bleeding (hallmark)", "Soft, non-tender uterus", "Fetal heart rate usually normal initially", "Intermittent bleeding — first bleed often mild ('sentinel bleed')", "Transverse or breech fetal position", "Ultrasound confirms placental location over cervix"],
    signs: {
      left: ["Painless bright red vaginal bleeding", "Bleeding often at rest or during sleep", "No abdominal pain", "Bleeding may stop and restart", "Decreased fetal movement (if severe)"],
      right: ["Soft non-tender uterus", "Ultrasound showing placenta over cervix", "Normal fetal heart rate (unless severe hemorrhage)", "Abnormal fetal lie", "Hemoglobin drop with bleeding"]
    },
    medications: [{
      name: "Betamethasone (Celestone)",
      type: "Antenatal corticosteroid",
      action: "Crosses placenta to accelerate fetal lung surfactant production, reducing respiratory distress syndrome risk if preterm delivery needed",
      sideEffects: "Maternal hyperglycemia (transient), insomnia",
      contra: "Active chorioamnionitis",
      pearl: "12 mg IM × 2 doses 24 hours apart; given between 23-36 weeks when preterm delivery anticipated within 7 days; maximum benefit 2-7 days after administration"
    }],
    pearls: ["Previa = PAINLESS, bright red, SOFT uterus; Abruption = PAINFUL, dark red, RIGID uterus", "NEVER perform digital vaginal exam — use transvaginal ultrasound (safe)", "Complete previa = mandatory cesarean delivery", "First bleed is often mild ('sentinel bleed') — subsequent bleeds progressively heavier", "Many low-lying placentas resolve by term ('placental migration')", "Prior cesarean is the strongest risk factor"],
    quiz: [{
      question: "A patient at 32 weeks has painless bright red vaginal bleeding with a soft uterus. What should the nurse suspect and NOT do?",
      options: ["Suspect abruption and perform vaginal exam", "Suspect placenta previa and do NOT perform digital vaginal exam — diagnose with ultrasound", "Suspect normal bloody show", "Suspect cervical infection"],
      correct: 1,
      rationale: "Painless bright red bleeding with soft uterus is classic for placenta previa. Digital vaginal exam must NEVER be performed as it can disrupt the placenta and cause massive hemorrhage."
    }, {
      question: "Can a patient with complete placenta previa have a vaginal delivery?",
      options: ["Yes, if labor progresses normally", "No — complete previa requires cesarean because the placenta blocks the birth canal", "Only if the baby is small", "It depends on preference"],
      correct: 1,
      rationale: "Complete previa is an absolute contraindication to vaginal delivery. The placenta covers the cervical opening — dilation would cause massive hemorrhage."
    }, {
      question: "How does previa bleeding differ from abruption bleeding?",
      options: ["No difference", "Previa: painless, bright red, soft uterus; Abruption: painful, dark red, rigid uterus", "Previa causes more bleeding", "Abruption bleeding is painless"],
      correct: 1,
      rationale: "This key clinical distinction is critical for rapid nursing assessment. Previa = PAINLESS, bright red, SOFT uterus. Abruption = PAINFUL, dark red, RIGID uterus."
    }]
  },
  "plasmapheresis-indications-np": {
    title: "Plasmapheresis Indications",
    cellular: { title: "Pathophysiology of Plasmapheresis & Therapeutic Plasma Exchange", content: "Therapeutic plasma exchange (TPE/plasmapheresis) removes the patient's plasma containing pathogenic autoantibodies, immune complexes, paraproteins, or toxins and replaces it with donor plasma or albumin solution. Each standard exchange removes approximately one plasma volume (40 mL/kg), eliminating roughly 63% of the target substance. Blood is drawn through a central venous catheter or large-bore peripheral access, separated by centrifugation or membrane filtration, the plasma is discarded, and cellular components are returned with replacement fluid. Category I ASFA indications (first-line therapy) include Guillain-Barré syndrome (anti-ganglioside antibodies), myasthenic crisis (anti-AChR antibodies), thrombotic thrombocytopenic purpura (TTP — removes anti-ADAMTS13 autoantibodies and replenishes ADAMTS13 enzyme), and anti-GBM disease (Goodpasture syndrome). Category II indications include acute demyelinating encephalomyelitis (ADEM), neuromyelitis optica (NMO), and severe lupus nephritis refractory to conventional therapy." },
    riskFactors: ["Autoimmune disorders producing pathogenic antibodies (myasthenia gravis, GBS, anti-GBM disease)","TTP with severe ADAMTS13 deficiency (<10% activity)","Hyperviscosity syndrome from paraprotein excess (Waldenström macroglobulinemia, multiple myeloma)","Rapidly progressive glomerulonephritis with anti-GBM or ANCA antibodies","Severe acute inflammatory demyelinating conditions refractory to corticosteroids","Cryoglobulinemia with end-organ damage","ABO-incompatible organ transplant requiring antibody removal"],
    diagnostics: ["Disease-specific autoantibody panels (anti-AChR, anti-GBM, ANCA, anti-ADAMTS13)","ADAMTS13 activity level and inhibitor titer for TTP diagnosis","Serum viscosity and quantitative immunoglobulins for hyperviscosity syndrome","CBC with differential, coagulation studies (PT/INR, PTT, fibrinogen) before each session","Ionized calcium level (citrate anticoagulant causes hypocalcemia during procedure)","Serum albumin and total protein to guide replacement fluid selection","Blood type and screen; hepatitis B/C and HIV serologies before initiating therapy"],
    management: ["Determine TPE prescription: volume to exchange (typically 1-1.5 plasma volumes), replacement fluid (5% albumin vs fresh frozen plasma), and treatment schedule","FFP replacement required when coagulation factor replenishment is needed (TTP, coagulopathy, pre-surgical)","Albumin replacement preferred when only antibody/toxin removal is the goal (lower allergic risk than FFP)","Central venous catheter placement (internal jugular or femoral) for reliable vascular access","Concurrent immunosuppressive therapy to prevent antibody rebound after TPE (corticosteroids, rituximab, cyclophosphamide)","Standard course: 5 exchanges over 10-14 days for most autoimmune indications; daily for TTP until platelet normalization","Monitor for post-exchange coagulopathy if albumin-only replacement used (clotting factors removed but not replaced)"],
    nursingActions: ["Monitor ionized calcium during procedure — citrate anticoagulant chelates calcium causing perioral tingling, paresthesias, and potentially tetany","Assess vascular access site for bleeding, hematoma, infection, and catheter patency before each session","Monitor vital signs every 15 minutes during exchange — hypotension is the most common procedural complication","Administer IV calcium gluconate as ordered for symptomatic hypocalcemia (tingling, Chvostek sign, muscle cramping)","Hold ACE inhibitors before TPE — bradykinin accumulation can cause severe hypotension during albumin-based exchange","Document pre/post treatment labs including CBC, coagulation studies, and disease-specific markers","Assess for allergic reactions to replacement fluid (FFP): urticaria, flushing, dyspnea, anaphylaxis"],
    assessmentFindings: ["Perioral tingling and fingertip numbness during exchange (citrate-induced hypocalcemia)","Hypotension during or immediately after procedure (intravascular volume shifts)","Chills, flushing, or urticaria (allergic reaction to FFP replacement fluid)","Catheter site erythema, swelling, or purulent drainage (central line infection)","Post-procedure bleeding or prolonged oozing from puncture sites (coagulation factor depletion)","Improvement in disease-specific symptoms after successive treatments (improved strength in MG, rising platelets in TTP)","Fatigue and lightheadedness following treatment sessions"],
    signs: {
      left: ["Mild perioral tingling responding to calcium supplementation","Stable vital signs throughout procedure","Gradual improvement in disease-specific markers","Mild fatigue post-procedure","Vascular access functioning well"],
      right: ["Severe hypocalcemia: tetany, carpopedal spasm, laryngospasm, QT prolongation","Anaphylaxis to replacement fluid (hypotension, bronchospasm, angioedema)","Catheter-related bloodstream infection (fever, rigors, hemodynamic instability)","Severe hypotension unresponsive to fluid bolus","Significant hemorrhage from coagulation factor depletion"]
    },
    medications: [{
      name: "Calcium Gluconate",
      type: "Electrolyte replacement",
      action: "Replaces ionized calcium depleted by citrate anticoagulant during plasmapheresis; citrate chelates free calcium ions in the blood",
      sideEffects: "Bradycardia with rapid IV push, tissue necrosis with extravasation, hypercalcemia with excess dosing",
      contra: "Hypercalcemia, digitalis toxicity (calcium potentiates digoxin effects), severe renal impairment",
      pearl: "Administer IV slowly (not to exceed 200 mg/min); monitor for Chvostek and Trousseau signs during TPE; oral calcium supplementation may be given prophylactically between sessions"
    },{
      name: "Rituximab",
      type: "Anti-CD20 monoclonal antibody",
      action: "Depletes CD20-positive B lymphocytes responsible for producing pathogenic autoantibodies, preventing antibody rebound after plasmapheresis",
      sideEffects: "Infusion reactions (fever, chills, rigors), progressive multifocal leukoencephalopathy (rare), hepatitis B reactivation, prolonged hypogammaglobulinemia",
      contra: "Active severe infections, hepatitis B without prophylaxis, severe immunodeficiency",
      pearl: "Schedule rituximab AFTER (not before) TPE sessions to avoid removing the drug; screen for hepatitis B before starting; premedicate with acetaminophen, diphenhydramine, and corticosteroid"
    }],
    pearls: ["Citrate-induced hypocalcemia is the most common complication of TPE — monitor ionized calcium and have IV calcium gluconate at bedside","ACE inhibitors must be held before albumin-based TPE because the procedure activates the contact system, causing bradykinin accumulation and potentially severe hypotension","In TTP, TPE must begin IMMEDIATELY (within hours) — mortality drops from >90% to <20% with prompt plasma exchange","FFP replacement is mandatory in TTP because fresh frozen plasma provides the missing ADAMTS13 enzyme","Schedule immunosuppressive medications AFTER TPE sessions to avoid removing the therapeutic drug during exchange","Rebound antibody production is expected after TPE — concurrent immunosuppression is essential for sustained response"],
    quiz: [
      {
        question: "During plasmapheresis, a patient reports tingling around the mouth and fingertips. What is the most likely cause?",
        options: ["Allergic reaction to albumin replacement","Citrate-induced hypocalcemia","Air embolism from the circuit","Hyperkalemia from hemolyzed cells"],
        correct: 1,
        rationale: "Citrate anticoagulant used in the TPE circuit chelates ionized calcium, causing hypocalcemia. Perioral and fingertip paresthesias are the earliest symptoms. Treatment is IV calcium gluconate administration."
      },
      {
        question: "Why is fresh frozen plasma (rather than albumin) used as the replacement fluid in TTP?",
        options: ["Albumin is too expensive for TTP treatment","FFP contains ADAMTS13 enzyme that the patient is deficient in","Albumin causes more allergic reactions than FFP","FFP has a lower infection transmission risk"],
        correct: 1,
        rationale: "TTP is caused by ADAMTS13 deficiency (from autoantibodies). FFP provides functional ADAMTS13 enzyme to cleave ultra-large von Willebrand factor multimers, while also removing the pathogenic autoantibodies during exchange."
      },
      {
        question: "When should rituximab be administered relative to a TPE session?",
        options: ["Immediately before TPE to maximize drug levels","AFTER the TPE session to prevent the drug from being removed during exchange","It does not matter; timing has no effect","Rituximab should never be used with plasmapheresis"],
        correct: 1,
        rationale: "Rituximab is an IgG monoclonal antibody that would be removed from the plasma during TPE if given before the session. It should be administered after the exchange to ensure therapeutic drug levels are maintained."
      },
    ]
  },
  "plastic-bronchitis-rn": {
    title: "Plastic Bronchitis",
    cellular: { title: "Pathophysiology of Plastic Bronchitis", content: "Plastic bronchitis is a rare condition characterized by the formation of large, branching fibrinous or mucoid casts that occlude the tracheobronchial tree, causing acute respiratory distress and potentially fatal airway obstruction. The casts are composed of fibrin and inflammatory cells (type 1, associated with pulmonary inflammation from asthma, infections, or allergic bronchopulmonary aspergillosis) or acellular mucin and chyle (type 2, associated with congenital heart disease, particularly after Fontan palliation where elevated central venous pressure disrupts pulmonary lymphatic drainage). In post-Fontan patients, elevated systemic venous pressure impairs lymphatic drainage from the lungs, causing lymphatic fluid to leak into the airways and polymerize into rubbery, tree-shaped casts that conform to the bronchial anatomy. Clinical presentation includes acute dyspnea, cough (sometimes expectorating intact casts), wheezing, and respiratory failure. The nurse monitors respiratory status closely, recognizes acute deterioration from airway obstruction, assists with emergent bronchoscopy for cast removal, administers mucolytics (inhaled tissue plasminogen activator, dornase alfa), monitors oxygen saturation continuously, provides airway management support, and educates patients about recognizing symptoms of recurrence." },
    riskFactors: ["History of Fontan palliation for single-ventricle congenital heart disease (elevated central venous pressure disrupts pulmonary lymphatic drainage)","Severe or poorly controlled asthma with chronic airway inflammation","Allergic bronchopulmonary aspergillosis (ABPA)","Sickle cell disease with acute chest syndrome","Lymphatic abnormalities including lymphangiectasia or thoracic duct injury","Chronic respiratory infections (viral bronchiolitis, influenza, pneumonia)","Cystic fibrosis with mucus hypersecretion"],
    diagnostics: ["Chest X-ray showing segmental or lobar atelectasis from cast obstruction","CT chest revealing bronchial occlusion with mucoid impaction pattern","Bronchoscopy (diagnostic and therapeutic) — direct visualization and removal of bronchial casts","Analysis of expectorated or retrieved casts: type 1 (inflammatory/fibrin-rich) vs type 2 (acellular/mucin-chyle-rich)","Pulmonary function testing (spirometry) showing obstructive pattern during acute episodes","Echocardiography to assess Fontan circuit pressures and cardiac function in post-surgical patients","Lymphangiography or dynamic contrast-enhanced MRI lymphangiography to map lymphatic drainage abnormalities"],
    management: ["Emergent bronchoscopy for cast removal during acute airway obstruction","Inhaled tissue plasminogen activator (tPA) to dissolve fibrin-based casts","Inhaled dornase alfa (Pulmozyme) as mucolytic for mucoid casts","Low-fat diet with medium-chain triglyceride (MCT) supplementation to reduce chylous lymphatic flow in type 2 casts","Inhaled heparin nebulization to prevent fibrin cast reformation","Thoracic duct ligation or lymphatic embolization for refractory lymphatic-type plastic bronchitis","Optimize Fontan hemodynamics to reduce central venous pressure contributing to lymphatic congestion"],
    nursingActions: ["Monitor respiratory status continuously: oxygen saturation, respiratory rate, work of breathing, breath sounds","Recognize acute deterioration — sudden dyspnea, stridor, absent breath sounds, and desaturation suggest cast re-obstruction","Assist with emergent bronchoscopy preparation and recovery; ensure suction equipment at bedside","Collect and preserve expectorated casts for pathological analysis (place in saline-moistened container)","Administer inhaled mucolytics (tPA, dornase alfa) as prescribed and monitor for bronchospasm post-nebulization","Educate patient and family to recognize cast expectoration (rubbery, tree-shaped structures) and seek immediate care for worsening dyspnea","Coordinate dietary modifications with nutritionist for low-fat/MCT diet in lymphatic-type plastic bronchitis"],
    assessmentFindings: ["Acute-onset dyspnea, wheezing, and respiratory distress from airway cast obstruction","Productive cough with expectoration of rubbery, branching, tree-shaped casts that conform to bronchial anatomy","Unilateral decreased or absent breath sounds over the obstructed segment","Hypoxemia with oxygen desaturation refractory to supplemental oxygen","Recurrent segmental atelectasis on imaging despite adequate respiratory effort","History of Fontan surgery with progressively worsening respiratory symptoms","Chylous pleural effusion in lymphatic-type disease"],
    signs: {
      left: ["Mild intermittent cough with occasional small cast fragments","Oxygen saturation stable above 94% on room air","Mild wheezing responsive to bronchodilators","Stable respiratory rate and effort","Intermittent chest discomfort with deep breathing"],
      right: ["Severe acute dyspnea with stridor and absent breath sounds (complete cast obstruction)","Oxygen saturation <85% unresponsive to supplemental oxygen","Respiratory failure requiring emergent intubation","Expectoration of large intact bronchial cast","Cardiovascular collapse from massive bilateral airway obstruction"]
    },
    medications: [{
      name: "Dornase Alfa (Pulmozyme)",
      type: "Recombinant human DNase / mucolytic",
      action: "Cleaves extracellular DNA in mucoid casts, reducing cast viscosity and facilitating expectoration and clearance",
      sideEffects: "Voice alteration, pharyngitis, rash, chest pain, bronchospasm (rare)",
      contra: "Known hypersensitivity to dornase alfa or Chinese hamster ovary cell products",
      pearl: "More effective for mucoid (type 2) casts; administer via nebulizer daily; pre-treat with bronchodilator to prevent bronchospasm"
    },{
      name: "Inhaled Tissue Plasminogen Activator (tPA)",
      type: "Fibrinolytic agent (off-label inhaled use)",
      action: "Converts plasminogen to plasmin, which enzymatically degrades fibrin within bronchial casts, dissolving type 1 inflammatory casts",
      sideEffects: "Hemoptysis (fibrinolysis of cast may expose bleeding surfaces), bronchospasm",
      contra: "Active pulmonary hemorrhage, coagulopathy, recent surgery",
      pearl: "Used off-label for fibrin-rich (type 1) plastic bronchitis casts; typically nebulized 5 mg in 5 mL NS twice daily; monitor closely for hemoptysis"
    }],
    pearls: ["Plastic bronchitis casts are TREE-SHAPED and rubbery — they conform to the bronchial anatomy; if a patient coughs up such a structure, this is diagnostic","Post-Fontan patients are at highest risk for type 2 (lymphatic/chyle) casts due to elevated central venous pressure impairing pulmonary lymphatic drainage","Acute complete cast obstruction is a life-threatening emergency — emergent bronchoscopy for cast removal is the definitive treatment","Low-fat diet with MCT oil reduces chylous lymphatic flow and decreases cast formation in lymphatic-type plastic bronchitis","tPA nebulization dissolves FIBRIN casts (type 1); dornase alfa dissolves MUCOID casts (type 2) — identifying cast type guides pharmacotherapy","Sudden absent breath sounds in a child with Fontan physiology should raise immediate suspicion for plastic bronchitis until proven otherwise"],
    quiz: [
      {
        question: "A child with a history of Fontan surgery presents with acute dyspnea and absent breath sounds on the right side. The nurse should prepare for which priority intervention?",
        options: ["Chest physiotherapy and postural drainage","Nebulized albuterol treatment","Emergent bronchoscopy for suspected cast removal","Oral antibiotic administration"],
        correct: 2,
        rationale: "In a post-Fontan patient with acute dyspnea and absent breath sounds, plastic bronchitis with complete airway cast obstruction should be suspected. Emergent bronchoscopy is the priority intervention for direct cast visualization and removal."
      },
      {
        question: "A patient with plastic bronchitis expectorates a rubbery, tree-shaped structure. What should the nurse do with this specimen?",
        options: ["Discard it as normal mucus expectoration","Preserve it in a saline-moistened container for pathological analysis","Send it for culture and sensitivity only","Document the event but no specimen collection is needed"],
        correct: 1,
        rationale: "Expectorated bronchial casts should be preserved and sent for pathological analysis to determine cast type (inflammatory fibrin vs mucoid/chyle). Cast composition guides treatment selection — tPA for fibrin casts, dornase alfa for mucoid casts."
      },
      {
        question: "Which dietary modification helps reduce cast formation in lymphatic-type (type 2) plastic bronchitis?",
        options: ["High-protein, high-calorie diet","Low-fat diet with medium-chain triglyceride (MCT) supplementation","Sodium-restricted diet with fluid limitation","Ketogenic diet with high fat intake"],
        correct: 1,
        rationale: "Low-fat diet with MCT supplementation reduces chylous lymphatic flow because MCTs are absorbed directly into the portal circulation rather than through intestinal lymphatics, decreasing the volume of lymphatic fluid that can leak into airways and form casts."
      },
    ]
  },
  "pleurisy-rpn": {
    title: "Pleurisy: Basic Assessment & Care",
    cellular: { title: "Understanding Pleurisy", content: "Pleurisy (pleuritis) is inflammation of the pleura — the thin membrane lining the chest wall (parietal pleura) and covering the lungs (visceral pleura). Normally a small amount of lubricating fluid allows smooth lung movement. When inflamed, the rough surfaces rub against each other with every breath, causing sharp chest pain.\n\nThe hallmark is sharp, stabbing chest pain that worsens with deep breathing, coughing, or sneezing and improves when holding the breath or leaning forward. A pleural friction rub — a grating, creaking sound synchronized with breathing — may be heard on auscultation (disappears if fluid accumulates between the layers).\n\nCommon causes include viral infections (most common), pneumonia, pulmonary embolism, autoimmune diseases, rib fracture, and tuberculosis. Pleurisy itself is a symptom requiring identification and treatment of the underlying cause." },
    riskFactors: ["Viral respiratory infections (most common cause)", "Bacterial pneumonia", "Pulmonary embolism", "Autoimmune diseases (SLE, rheumatoid arthritis)", "Tuberculosis", "Rib fracture or chest trauma", "Recent chest surgery", "Cancer (lung cancer, mesothelioma)"],
    diagnostics: ["Listen for pleural friction rub on auscultation", "Assess pain characteristics: sharp, localized, worse with breathing", "Expect chest X-ray (may show effusion, pneumonia, or be normal)", "Monitor vital signs including oxygen saturation", "Expect blood work: CBC, ESR/CRP", "Monitor for pleural effusion development"],
    management: ["Treat the underlying cause", "Administer prescribed analgesics and anti-inflammatory medications", "Encourage gentle deep breathing exercises despite pain (prevent atelectasis)", "Position on the affected side to splint and reduce pain", "Apply warm compresses for comfort", "Rest during acute phase"],
    nursingActions: ["Assess pain: location, quality, severity, aggravating/alleviating factors", "Auscultate for pleural friction rub", "Monitor respiratory status: rate, depth, oxygen saturation", "Administer pain medications and assess effectiveness", "Teach splinting: press pillow against chest when coughing", "Encourage lying on the affected side (reduces pleural movement and pain)", "Monitor for pleural effusion: increasing dyspnea, decreased breath sounds", "Encourage incentive spirometry despite pain"],
    assessmentFindings: ["Sharp, stabbing chest pain worse with breathing, coughing, sneezing", "Pain improves with shallow breathing or breath-holding", "Pain improves lying on affected side", "Pleural friction rub on auscultation", "Decreased breath sounds if effusion develops", "Tachypnea (rapid shallow breathing)"],
    signs: {
      left: ["Sharp chest pain with breathing", "Worse with deep breaths and coughing", "Better when holding breath", "Better lying on affected side", "Shallow rapid breathing"],
      right: ["Pleural friction rub", "Normal or decreased breath sounds", "Elevated ESR/CRP", "CXR findings (effusion, infiltrate)", "Dullness to percussion (if effusion)"]
    },
    medications: [{
      name: "Ibuprofen (Advil/Motrin)",
      type: "NSAID",
      action: "Inhibits COX-1 and COX-2, reducing prostaglandin synthesis to decrease pleural inflammation and pain",
      sideEffects: "GI upset, GI bleeding, renal impairment",
      contra: "Active GI bleeding, severe renal disease, aspirin-sensitive asthma",
      pearl: "First-line for pleuritic pain; 400-800 mg TID with food; if contraindicated, acetaminophen provides analgesia without anti-inflammatory effect"
    }],
    pearls: ["Pleuritic pain is SHARP and WORSE with deep breathing — the hallmark feature", "Friction rub DISAPPEARS when effusion accumulates (fluid separates inflamed surfaces)", "Position on the AFFECTED side to splint and reduce pain", "Teach pillow splinting when coughing", "Pleurisy is a SYMPTOM — always identify underlying cause", "PE can cause pleurisy — always consider PE in new pleuritic chest pain"],
    quiz: [{
      question: "A patient with sharp chest pain worse with breathing should be positioned how for comfort?",
      options: ["Sitting upright", "Lying on unaffected side", "Lying on the AFFECTED side — this splints and reduces pleural movement", "Prone"],
      correct: 2,
      rationale: "Lying on the affected side splints the inflamed pleura, limiting chest wall expansion on that side and reducing friction between inflamed layers."
    }, {
      question: "A nurse hears a pleural friction rub. The next day it's gone but dyspnea has increased. What happened?",
      options: ["Pleurisy resolved", "Pleural effusion developed — fluid eliminated the rub but is compressing the lung", "Faulty stethoscope", "Asthma attack"],
      correct: 1,
      rationale: "Fluid accumulation separates inflamed surfaces (rub disappears) but compresses the lung (increased dyspnea). Report the change to the provider."
    }, {
      question: "Why encourage deep breathing despite pleurisy pain?",
      options: ["To cure pleurisy", "To prevent atelectasis — avoiding deep breaths can lead to lung collapse", "To increase effusion", "No benefit"],
      correct: 1,
      rationale: "Pain causes shallow breathing which can lead to atelectasis and pneumonia. Premedicate with analgesics and teach splinting to enable effective deep breathing."
    }]
  },
  "pnh-rn": {
    title: "Paroxysmal Nocturnal Hemoglobinuria (PNH)",
    cellular: { title: "Pathophysiology of Paroxysmal Nocturnal Hemoglobinuria (PNH)", content: "Paroxysmal nocturnal hemoglobinuria (PNH) is an acquired clonal hematopoietic stem cell disorder caused by a somatic mutation in the PIG-A gene, which is essential for the biosynthesis of glycosylphosphatidylinositol (GPI) anchors that attach complement-regulatory proteins (CD55/DAF and CD59/MIRL) to the cell surface. Without GPI-anchored CD55 and CD59, red blood cells are unprotected from complement-mediated lysis, particularly during sleep when mild respiratory acidosis lowers blood pH and activates the alternative complement pathway, causing the characteristic morning hemoglobinuria (dark red-brown urine). Chronic intravascular hemolysis releases free hemoglobin that scavenges nitric oxide, causing smooth muscle dystonia (esophageal spasm, dysphagia, erectile dysfunction, abdominal pain), pulmonary hypertension, and a strongly prothrombotic state (hepatic vein thrombosis/Budd-Chiari syndrome is a classic complication). The nurse monitors urine color, serum LDH and haptoglobin as hemolysis markers, monitors renal function, monitors CBC for cytopenias (associated aplastic anemia), administers complement inhibitor therapy (eculizumab or ravulizumab -- anti-C5 monoclonal antibodies) as prescribed, ensures meningococcal vaccination before starting complement inhibitors, monitors for breakthrough hemolysis, manages iron and folate supplementation, and monitors for thrombotic complications." },
    riskFactors: ["Acquired somatic PIG-A gene mutation in hematopoietic stem cells (not inherited; occurs sporadically)","History of aplastic anemia (PNH clones frequently arise in aplastic anemia bone marrow)","Myelodysplastic syndrome (MDS) with PNH clone overlap","Bone marrow failure syndromes","Young to middle-aged adults (median age at diagnosis 30-40 years)","Prior immunosuppressive therapy for aplastic anemia (may unmask or expand PNH clone)"],
    diagnostics: ["Flow cytometry for GPI-anchored proteins (CD55 and CD59) on red blood cells and granulocytes — gold standard diagnostic test","Serum lactate dehydrogenase (LDH) — markedly elevated, most sensitive marker of intravascular hemolysis","Serum haptoglobin — decreased or undetectable (consumed binding free hemoglobin from hemolysis)","Direct antiglobulin test (DAT/Coombs) — negative, distinguishing PNH from autoimmune hemolytic anemia","Urine hemosiderin and urinalysis for hemoglobinuria (dark red-brown morning urine)","CBC showing anemia, possible pancytopenia; reticulocyte count elevated (compensatory erythropoiesis)","Serum free hemoglobin elevated; urine hemoglobin positive; renal function tests for hemoglobin-induced kidney injury"],
    management: ["Eculizumab or ravulizumab (complement C5 inhibitors) as primary therapy to block complement-mediated hemolysis","Meningococcal vaccination (MenACWY and MenB) at least 2 weeks before starting complement inhibitor therapy","Anticoagulation for thrombotic events (Budd-Chiari, cerebral venous sinus thrombosis, DVT/PE are common in PNH)","Iron and folate supplementation to support erythropoiesis (chronic hemolysis depletes iron stores through urinary loss)","Bone marrow transplant — only curative therapy; reserved for severe disease with bone marrow failure","Erythropoiesis-stimulating agents for anemia management when complement inhibitors provide incomplete response","Monitor for breakthrough hemolysis and adjust complement inhibitor dosing"],
    nursingActions: ["Inspect first morning urine for hemoglobinuria (cola-colored or dark red-brown urine indicates active hemolysis)","Monitor LDH levels as the primary marker of hemolysis activity — rising LDH suggests breakthrough hemolysis","Ensure meningococcal vaccination is documented BEFORE initiating eculizumab or ravulizumab therapy","Assess for signs of thrombosis at each visit: unilateral leg swelling (DVT), right upper quadrant pain (Budd-Chiari), headache with neurological changes (cerebral sinus thrombosis)","Monitor CBC, reticulocyte count, haptoglobin, and renal function at regular intervals","Educate patient to carry a medical card noting complement inhibitor therapy and increased meningococcal infection risk","Administer eculizumab IV every 2 weeks (or ravulizumab every 8 weeks) per protocol; monitor for infusion reactions"],
    assessmentFindings: ["Dark red-brown or cola-colored morning urine (hemoglobinuria from overnight complement activation)","Fatigue and dyspnea on exertion from chronic anemia","Jaundice and scleral icterus from bilirubin production during hemolysis","Dysphagia, abdominal pain, and erectile dysfunction from nitric oxide depletion by free hemoglobin","Signs of venous thrombosis (leg swelling, hepatomegaly with ascites in Budd-Chiari syndrome)","Pallor with tachycardia reflecting anemia","Episodic worsening triggered by infections, surgery, or stress (complement activation triggers)"],
    signs: {
      left: ["Mild fatigue with stable hemoglobin","Intermittent dark urine episodes","LDH mildly elevated above baseline","Stable renal function","Compensated hemolysis with adequate reticulocyte response"],
      right: ["Severe hemolytic crisis with hemoglobin drop and hemodynamic instability","Budd-Chiari syndrome: acute hepatomegaly, ascites, right upper quadrant pain","Cerebral venous sinus thrombosis: severe headache, seizures, altered consciousness","Acute kidney injury from massive hemoglobinuria","Meningococcal sepsis in patient on complement inhibitor therapy (medical emergency)"]
    },
    medications: [{
      name: "Eculizumab (Soliris)",
      type: "Complement C5 inhibitor (monoclonal antibody)",
      action: "Binds complement component C5, preventing its cleavage into C5a and C5b, thereby blocking formation of the membrane attack complex (MAC/C5b-9) that lyses GPI-deficient PNH red blood cells",
      sideEffects: "Headache, nasopharyngitis, back pain, nausea; serious: life-threatening meningococcal infection from terminal complement blockade",
      contra: "Unresolved Neisseria meningitidis infection, unvaccinated against meningococcal disease",
      pearl: "Meningococcal vaccines (MenACWY + MenB) MUST be given ≥2 weeks before first dose; patients carry lifelong increased meningococcal risk; administer IV every 2 weeks after loading phase"
    },{
      name: "Ravulizumab (Ultomiris)",
      type: "Long-acting complement C5 inhibitor (monoclonal antibody)",
      action: "Binds complement C5 with enhanced recycling mechanism, providing longer duration of complement blockade compared to eculizumab",
      sideEffects: "Upper respiratory infection, headache, nausea; serious: meningococcal infection (same risk as eculizumab)",
      contra: "Unresolved Neisseria meningitidis infection, unvaccinated against meningococcal disease",
      pearl: "Administered IV every 8 weeks (vs every 2 weeks for eculizumab), improving patient convenience and adherence; same meningococcal vaccination requirements"
    }],
    pearls: ["Morning hemoglobinuria (dark urine) is the hallmark of PNH — complement activation increases during sleep due to mild respiratory acidosis lowering blood pH","PNH is the ONLY hemolytic anemia with a NEGATIVE direct Coombs test and intravascular hemolysis — this distinguishes it from autoimmune hemolytic anemia","Thrombosis is the leading cause of death in PNH — Budd-Chiari syndrome (hepatic vein thrombosis) is a classic complication","Meningococcal vaccination is MANDATORY before starting eculizumab/ravulizumab — complement blockade dramatically increases meningococcal infection risk","LDH is the most sensitive marker of hemolysis in PNH — monitor trends to detect breakthrough hemolysis on complement inhibitor therapy","PNH and aplastic anemia frequently coexist — flow cytometry for GPI-anchored proteins should be performed in all aplastic anemia patients"],
    quiz: [
      {
        question: "A patient with PNH reports that their first morning urine is consistently dark red-brown but clears later in the day. What explains this pattern?",
        options: ["Dehydration concentrated the urine overnight","Complement-mediated hemolysis increases during sleep due to mild respiratory acidosis","Urinary tract infection causes morning hematuria","Myoglobinuria from nocturnal muscle breakdown"],
        correct: 1,
        rationale: "During sleep, hypoventilation causes mild respiratory acidosis, which lowers blood pH and activates the alternative complement pathway. PNH red blood cells lacking CD55/CD59 are vulnerable to complement lysis, causing hemoglobinuria that is most concentrated in the morning specimen."
      },
      {
        question: "Before starting eculizumab therapy for PNH, which intervention must the nurse verify has been completed?",
        options: ["Hepatitis B vaccination series","Meningococcal vaccination (MenACWY and MenB)","Annual influenza vaccination","Pneumococcal polysaccharide vaccine"],
        correct: 1,
        rationale: "Eculizumab blocks terminal complement (C5), which is essential for defense against Neisseria meningitidis. Meningococcal vaccines must be administered at least 2 weeks before initiating therapy to allow protective antibody development."
      },
      {
        question: "A nurse caring for a PNH patient notes new right upper quadrant pain, hepatomegaly, and ascites. Which complication should be suspected?",
        options: ["Gallstones from chronic hemolysis","Budd-Chiari syndrome (hepatic vein thrombosis)","Viral hepatitis reactivation","Hepatocellular carcinoma"],
        correct: 1,
        rationale: "Budd-Chiari syndrome (thrombosis of the hepatic veins) is a classic and serious thrombotic complication of PNH. It presents with right upper quadrant pain, hepatomegaly, and ascites. Thrombosis is the leading cause of death in PNH."
      },
    ]
  },
  "polyarteritis-nodosa-np": {
    title: "Polyarteritis Nodosa",
    cellular: { title: "Pathophysiology of Polyarteritis Nodosa", content: "Polyarteritis nodosa (PAN) is a systemic necrotizing vasculitis affecting medium-sized muscular arteries, causing segmental transmural inflammation with fibrinoid necrosis of the vessel wall, aneurysm formation, thrombosis, and downstream organ ischemia. Unlike ANCA-associated vasculitides, PAN is ANCA-negative and does NOT involve small vessels or glomerulonephritis (spares the lungs and glomeruli). The inflammation is immune complex-mediated, with approximately 30% of cases associated with hepatitis B virus (HBV) infection. Affected organs include kidneys (renal artery aneurysms causing renovascular hypertension, NOT glomerulonephritis), gastrointestinal tract (mesenteric artery involvement causing postprandial abdominal pain and bowel ischemia), peripheral nervous system (vasa nervorum inflammation causing mononeuritis multiplex), skin (livedo reticularis, subcutaneous nodules, ulcers), and musculoskeletal system (myalgias, arthralgias). Constitutional symptoms include fever, weight loss, and malaise." },
    riskFactors: ["Chronic hepatitis B virus infection (strongly associated with ~30% of PAN cases)","Middle-aged adults, predominantly male (peak incidence 40-60 years)","Hepatitis C virus with cryoglobulinemia (less commonly associated)","Hairy cell leukemia (rare but recognized association)","Intravenous drug use (associated with HBV acquisition)","No genetic predisposition or familial pattern identified"],
    diagnostics: ["Conventional angiography (mesenteric or renal): shows characteristic microaneurysms and segmental stenosis of medium arteries — diagnostic gold standard","Hepatitis B surface antigen and HBV DNA — essential to identify HBV-associated PAN (different treatment approach)","ANCA testing — characteristically NEGATIVE (distinguishes PAN from ANCA-associated vasculitides like GPA)","ESR and CRP markedly elevated; leukocytosis and thrombocytosis common","Tissue biopsy (sural nerve, skin, or affected organ) showing transmural necrotizing inflammation of medium arteries","Serum creatinine, urinalysis (proteinuria but NO red blood cell casts — PAN does NOT cause glomerulonephritis)","Nerve conduction studies/EMG if mononeuritis multiplex suspected"],
    management: ["High-dose corticosteroids (prednisone 1 mg/kg/day) for non-HBV-associated PAN as first-line","Cyclophosphamide added for severe or life-threatening organ involvement (renal, GI, CNS)","HBV-associated PAN: antiviral therapy (entecavir or tenofovir) PLUS short-course corticosteroids PLUS plasma exchange — long-term immunosuppression avoided","Aggressive blood pressure management for renovascular hypertension (ACE inhibitors, ARBs)","Azathioprine or methotrexate for remission maintenance after cyclophosphamide induction","Five-Factor Score (FFS) to guide treatment intensity: proteinuria >1g/day, renal insufficiency, GI involvement, cardiomyopathy, CNS involvement","Monitor for relapse with serial ESR/CRP and symptom assessment"],
    nursingActions: ["Assess all extremities for sensory and motor deficits consistent with mononeuritis multiplex (foot drop, wrist drop, asymmetric sensory loss)","Monitor blood pressure closely — renovascular hypertension from renal artery involvement is common and requires tight control","Assess for postprandial abdominal pain, bloody stools, or signs of bowel ischemia (mesenteric vasculitis — surgical emergency if perforation occurs)","Monitor for skin changes: livedo reticularis (mottled purplish reticular pattern), tender subcutaneous nodules, digital ischemia/gangrene","Administer immunosuppressive therapy as prescribed; monitor CBC and liver function for cyclophosphamide toxicity","Screen for hepatitis B before starting immunosuppression — reactivation risk; ensure antiviral coverage if HBV-positive","Educate about infection risk during immunosuppressive therapy; report fever, cough, or dysuria promptly"],
    assessmentFindings: ["Constitutional symptoms: fever, weight loss >10%, malaise, myalgias (present in majority of patients)","Mononeuritis multiplex: asymmetric sensory and motor neuropathy (foot drop, wrist drop) from vasa nervorum vasculitis","Livedo reticularis and tender subcutaneous nodules along affected arteries","Postprandial abdominal pain ('intestinal angina') from mesenteric artery involvement","Hypertension — new onset or worsening, often severe (renovascular hypertension from renal artery aneurysms)","Testicular pain and tenderness in males (testicular artery vasculitis — nearly pathognomonic when present)","Asymmetric arthritis and severe myalgias without joint destruction"],
    signs: {
      left: ["Mild constitutional symptoms (low-grade fever, fatigue, weight loss)","Livedo reticularis on extremities","Mild sensory neuropathy in one extremity","Elevated ESR/CRP with nonspecific findings","Manageable hypertension"],
      right: ["Acute abdomen from mesenteric artery thrombosis with bowel infarction (surgical emergency)","Ruptured renal artery aneurysm with retroperitoneal hemorrhage","Rapidly progressive mononeuritis multiplex with motor deficits","Malignant hypertension with end-organ damage","Digital gangrene from digital artery occlusion"]
    },
    medications: [{
      name: "Cyclophosphamide",
      type: "Alkylating agent / immunosuppressant",
      action: "Cross-links DNA strands in rapidly dividing lymphocytes, suppressing the immune-mediated vascular inflammation driving PAN",
      sideEffects: "Hemorrhagic cystitis (prevented with hydration and MESNA), bone marrow suppression, infertility, secondary malignancy (bladder cancer), infection risk",
      contra: "Active infection, severely depressed bone marrow, pregnancy (teratogenic), bladder outflow obstruction",
      pearl: "Aggressive IV hydration and MESNA co-administration prevent hemorrhagic cystitis; limit cumulative lifetime dose; monitor CBC biweekly; offer fertility preservation counseling before starting"
    },{
      name: "Prednisone",
      type: "Systemic corticosteroid",
      action: "Suppresses NF-kB-mediated inflammatory gene transcription, reducing vascular inflammation and immune complex deposition in PAN",
      sideEffects: "Hyperglycemia, osteoporosis, adrenal suppression, immunosuppression, weight gain, cataracts, avascular necrosis",
      contra: "Active untreated infections, live vaccine administration during therapy",
      pearl: "Start at 1 mg/kg/day for severe PAN; taper gradually over months once remission achieved; co-prescribe calcium/vitamin D and consider bisphosphonate for bone protection during prolonged use"
    }],
    pearls: ["PAN affects MEDIUM arteries and is ANCA-NEGATIVE — this distinguishes it from GPA (Wegener), MPA, and EGPA which affect small vessels and are ANCA-positive","PAN spares the LUNGS and GLOMERULI — if a patient has glomerulonephritis or pulmonary involvement, consider ANCA-associated vasculitis instead","Hepatitis B testing is MANDATORY before treatment — HBV-associated PAN requires antiviral therapy, and prolonged immunosuppression could worsen HBV infection","Testicular pain in a male with systemic vasculitis is nearly pathognomonic for PAN — always ask about this symptom","Classic angiographic finding is 'string of pearls' — microaneurysms alternating with stenotic segments in mesenteric or renal arteries","Mononeuritis multiplex (asymmetric neuropathy) is one of the most common and distinctive presentations of PAN"],
    quiz: [
      {
        question: "A patient presents with fever, weight loss, foot drop, livedo reticularis, and new hypertension. ANCA testing is negative. Which vasculitis should the NP suspect?",
        options: ["Granulomatosis with polyangiitis (GPA)","Polyarteritis nodosa (PAN)","Microscopic polyangiitis (MPA)","Eosinophilic granulomatosis with polyangiitis (EGPA)"],
        correct: 1,
        rationale: "Polyarteritis nodosa is a medium-vessel, ANCA-negative vasculitis presenting with constitutional symptoms, mononeuritis multiplex (foot drop), skin manifestations (livedo reticularis), and renovascular hypertension. GPA, MPA, and EGPA are ANCA-positive small-vessel vasculitides."
      },
      {
        question: "Why is hepatitis B testing mandatory before treating polyarteritis nodosa?",
        options: ["HBV causes all cases of PAN","HBV-associated PAN requires antiviral therapy rather than prolonged immunosuppression","Hepatitis B vaccination is needed before starting corticosteroids","HBV testing is only needed if the patient has liver symptoms"],
        correct: 1,
        rationale: "Approximately 30% of PAN cases are associated with HBV infection. HBV-associated PAN requires antiviral therapy as the primary treatment, with only short-course corticosteroids and plasma exchange. Prolonged immunosuppression without antivirals could worsen HBV infection."
      },
      {
        question: "Which organ system is characteristically spared in polyarteritis nodosa, helping distinguish it from ANCA-associated vasculitides?",
        options: ["Kidneys","Peripheral nerves","Lungs and glomeruli","Skin"],
        correct: 2,
        rationale: "PAN spares the lungs and glomeruli — it causes renal artery aneurysms and renovascular hypertension but NOT glomerulonephritis. The presence of pulmonary involvement or glomerulonephritis should prompt consideration of small-vessel ANCA-associated vasculitides instead."
      },
    ]
  },
  "polycystic-kidney-disease-rpn": {
    title: "Polycystic Kidney Disease Basics",
    cellular: { title: "Understanding Polycystic Kidney Disease", content: "Polycystic kidney disease (PKD) is a genetic condition where many fluid-filled cysts grow in both kidneys, gradually replacing normal tissue. As cysts grow over years, they destroy kidney structure and impair function, eventually leading to kidney failure.\n\nThe most common form is autosomal dominant PKD (ADPKD), meaning only one copy of the abnormal gene is needed. Symptoms usually appear in adulthood (ages 30-50), but cysts begin forming before birth. ADPKD affects approximately 1 in 400-1000 people.\n\nAs kidneys fill with cysts, they become very large. Patients may feel fullness or pain. Cysts can bleed, become infected, or develop stones. High blood pressure is very common and often appears before kidney function declines. About 50% of ADPKD patients develop kidney failure requiring dialysis or transplant by age 60." },
    riskFactors: ["Family history of PKD (autosomal dominant — 50% chance)", "PKD1 mutation (more severe — ESRD average age 54)", "PKD2 mutation (milder — ESRD average age 74)", "Hypertension (accelerates damage)", "Male sex (faster progression)", "Frequent UTIs", "Kidney stones", "High-protein diet"],
    diagnostics: ["Expect kidney ultrasound (multiple bilateral cysts)", "Monitor blood pressure regularly (often first sign)", "Monitor kidney function: BUN and creatinine", "Monitor urinalysis for blood and protein", "Expect genetic testing if family history unclear", "Monitor for liver cysts (common in ADPKD)"],
    management: ["Control blood pressure (target <130/80) — MOST IMPORTANT modifiable factor", "Limit sodium intake", "Stay well hydrated (may slow cyst growth)", "Report blood in urine, flank pain, fever", "Avoid contact sports (cyst rupture risk)", "Avoid NSAIDs (worsen kidney function)"],
    nursingActions: ["Monitor blood pressure at every visit and teach home monitoring", "Monitor kidney function labs", "Assess for flank or abdominal pain", "Monitor for UTIs (cysts can become infected)", "Educate on fluid intake and low-sodium diet", "Teach to avoid NSAIDs", "Provide genetic counseling resources", "Assess emotional impact of chronic progressive genetic disease"],
    assessmentFindings: ["Flank or abdominal pain from enlarged kidneys", "Palpable enlarged kidneys", "Hypertension (often first sign)", "Hematuria from cyst bleeding", "Urinary tract infections", "Kidney stones", "Abdominal fullness and early satiety", "Family history of kidney disease"],
    signs: {
      left: ["Flank pain or fullness", "Blood in urine", "Frequent headaches (hypertension)", "Abdominal fullness", "Family members with kidney disease"],
      right: ["Enlarged kidneys on exam", "Multiple bilateral cysts on ultrasound", "Elevated blood pressure", "Rising creatinine", "Liver cysts on imaging"]
    },
    medications: [{
      name: "Tolvaptan (Jynarque)",
      type: "Vasopressin V2 receptor antagonist",
      action: "Blocks ADH action on collecting duct, reducing cAMP-driven cyst growth; slows kidney volume increase and eGFR decline",
      sideEffects: "Excessive thirst and polyuria, liver toxicity (monitor LFTs), hypernatremia",
      contra: "Liver disease, inability to sense thirst, hypovolemia",
      pearl: "FDA-approved to slow ADPKD progression; patients must drink 2-3 L water daily; LFTs required monthly for 18 months; REMS program"
    }],
    pearls: ["ADPKD is autosomal DOMINANT — 50% chance of passing to each child", "Hypertension is often the FIRST sign — treat aggressively (target <130/80)", "Avoid NSAIDs — they worsen kidney function", "Avoid contact sports — enlarged kidneys are vulnerable", "Adequate hydration (2-3 L/day) may slow cyst growth", "About 50% need dialysis or transplant by age 60"],
    quiz: [{
      question: "What is the MOST important modifiable factor to slow PKD progression?",
      options: ["Restricting protein", "Blood pressure control (target <130/80)", "Limiting fluid", "Avoiding exercise"],
      correct: 1,
      rationale: "Aggressive blood pressure control is the single most important modifiable factor. ACE inhibitors or ARBs are preferred."
    }, {
      question: "Why should PKD patients avoid ibuprofen?",
      options: ["Doesn't work for kidney pain", "NSAIDs reduce blood flow to already-compromised kidneys — use acetaminophen instead", "Causes cyst growth", "No reason to avoid"],
      correct: 1,
      rationale: "NSAIDs reduce renal blood flow by inhibiting prostaglandin-mediated vasodilation, further impairing function in cystic kidneys."
    }, {
      question: "A parent with ADPKD asks about inheritance risk. What should they know?",
      options: ["No risk", "Each child has 50% chance — autosomal dominant inheritance", "25% chance", "Only sons inherit"],
      correct: 1,
      rationale: "ADPKD is autosomal dominant. Each child has a 50% chance of inheriting the mutation. Genetic counseling and testing are available."
    }]
  },
  "polycystic-kidney-management-np": {
    title: "Polycystic Kidney Disease: Tolvaptan & Monitoring",
    cellular: { title: "Pathophysiology of ADPKD and Tolvaptan Mechanism", content: "In autosomal dominant polycystic kidney disease (ADPKD), dysfunctional polycystin proteins on renal tubular cell cilia cause decreased intracellular calcium, which activates adenylyl cyclase and increases cyclic AMP (cAMP). Elevated cAMP drives two pathological processes: cyst epithelial cell proliferation and chloride-driven fluid secretion into cyst lumens. Vasopressin (ADH) binding to V2 receptors on collecting duct cells amplifies this cAMP-mediated cystogenesis. Tolvaptan selectively blocks V2 receptors, reducing cAMP levels in cyst-lining cells and slowing both cyst growth and total kidney volume (TKV) expansion. The TEMPO 3:4 and REPRISE trials demonstrated tolvaptan reduces TKV growth rate and slows eGFR decline. However, hepatotoxicity is a significant risk requiring intensive liver function monitoring. The NP must carefully select candidates using Mayo Imaging Classification (Class 1C-1E predict rapid progression), assess ADPKD risk using PROPKD score (PKD1 truncating mutations, male sex, early hypertension, early urological events), and implement structured monitoring protocols." },
    riskFactors: ["PKD1 truncating mutation (fastest progression to ESRD, typically by age 55)","Mayo Imaging Classification 1C, 1D, or 1E (high predicted TKV growth rate)","Male sex with early-onset hypertension before age 35","Early urological events (hematuria, flank pain, UTI before age 35)","Large total kidney volume adjusted for height (htTKV >600 mL/m at baseline)","Family history of early ESRD from ADPKD (before age 58)","High PROPKD score (≥7 predicts ESRD before age 60)"],
    diagnostics: ["MRI-measured total kidney volume (TKV) using Mayo Imaging Classification to predict progression rate","Serial eGFR using CKD-EPI equation every 3-6 months to track rate of decline","Liver function tests (ALT, AST, total bilirubin) monthly for first 18 months of tolvaptan, then every 3 months","Serum sodium (risk of hypernatremia from aquaretic effect) and serum osmolality","Urine osmolality and 24-hour urine volume to confirm tolvaptan pharmacodynamic effect","Genetic testing for PKD1 vs PKD2 mutation type to refine prognosis (PROPKD score)","Serum creatinine, BUN, and urinalysis at each visit; urine albumin-to-creatinine ratio for proteinuria monitoring"],
    management: ["Tolvaptan initiation: split-dose regimen (45 mg morning / 15 mg afternoon) titrated to 60/30 then 90/30 mg based on tolerance","Mandatory fluid intake matching urine output (often 3-4 L/day) to prevent dehydration and hypernatremia from aquaretic effect","Discontinue tolvaptan if ALT or AST >3x upper limit of normal, or if ALT/AST >2x ULN with bilirubin >2x ULN (Hy's Law criteria)","Continue aggressive BP control with ACE inhibitor or ARB (target <110/75 in young patients per HALT-PKD trial)","Prescribe high water intake (2.5-3 L/day) even without tolvaptan to suppress endogenous vasopressin","Monitor and manage CKD complications: erythropoietin for anemia, phosphate binders, sodium bicarbonate for acidosis","Nephrology co-management for eGFR <30 mL/min; transplant referral planning when eGFR approaches 20 mL/min"],
    nursingActions: ["Obtain liver function tests at each scheduled visit; compare to baseline; immediately report ALT/AST elevations >3x ULN","Counsel patients on mandatory high fluid intake — tolvaptan causes massive aquaresis (4-6 L urine/day); dehydration is dangerous","Monitor serum sodium at every visit; hypernatremia indicates insufficient water intake relative to urinary losses","Assess for signs of hepatotoxicity: fatigue, anorexia, nausea, right upper quadrant pain, dark urine, jaundice","Document 24-hour urine volume and fluid intake at each visit to confirm treatment adherence and pharmacologic response","Educate about split-dose timing: larger dose in morning, smaller dose in afternoon to minimize nocturia","Verify REMS enrollment and prescriber certification for tolvaptan (restricted distribution program for hepatotoxicity monitoring)"],
    assessmentFindings: ["Polyuria (4-6 L/day) and polydipsia as expected pharmacologic effects of tolvaptan","Nocturia (most common tolerability complaint leading to discontinuation)","Stable or slower rate of eGFR decline compared to pre-treatment trajectory","Flank pain or hematuria (cyst rupture or hemorrhage, not necessarily tolvaptan-related)","Signs of hepatotoxicity: fatigue, anorexia, RUQ pain, jaundice (requires immediate drug discontinuation)","Hypernatremia with thirst and dry mucous membranes (inadequate fluid replacement)","Decreasing TKV growth rate on serial MRI (treatment response)"],
    signs: {
      left: ["Expected polyuria (3-5 L/day) with adequate fluid intake","Serum sodium within normal range","Liver enzymes stable within normal limits","eGFR decline rate slower than predicted trajectory","Manageable nocturia with dose timing adjustments"],
      right: ["ALT/AST >3x ULN (requires immediate tolvaptan discontinuation)","Jaundice with ALT elevation (Hy's Law — risk of liver failure)","Severe hypernatremia (Na >150 mEq/L) from inadequate fluid replacement","Acute kidney injury (rapidly rising creatinine)","Severe dehydration with hemodynamic instability"]
    },
    medications: [{
      name: "Tolvaptan (Jinarc/Samsca)",
      type: "Vasopressin V2 receptor antagonist",
      action: "Selectively blocks V2 receptors on collecting duct cells, reducing cAMP-driven cyst cell proliferation and fluid secretion; produces aquaresis (electrolyte-free water excretion) without natriuresis",
      sideEffects: "Polyuria, polydipsia, nocturia, thirst, dry mouth; SERIOUS: hepatotoxicity (elevated ALT/AST, hepatic failure), hypernatremia, dehydration",
      contra: "Unable to sense or respond to thirst; hypovolemia or hypernatremia; concurrent strong CYP3A4 inhibitors (ketoconazole, clarithromycin); liver disease or elevated transaminases; anuria; pregnancy",
      pearl: "REMS-restricted program; monthly LFTs for first 18 months then every 3 months; split dosing (larger AM, smaller PM) to manage nocturia; patients MUST drink enough water to match urine output"
    },{
      name: "Lisinopril",
      type: "ACE inhibitor",
      action: "Blocks angiotensin-converting enzyme, reducing angiotensin II-mediated vasoconstriction, aldosterone secretion, and intraglomerular pressure; provides renoprotection beyond BP lowering in ADPKD",
      sideEffects: "Dry cough, hyperkalemia, angioedema, dizziness, acute kidney injury if bilateral renal artery stenosis",
      contra: "Pregnancy (teratogenic), bilateral renal artery stenosis, history of ACE inhibitor-induced angioedema, hyperkalemia",
      pearl: "First-line antihypertensive for ADPKD; HALT-PKD trial showed aggressive BP target (<110/75) with RAAS blockade slowed TKV growth in young patients with preserved GFR"
    }],
    pearls: ["Tolvaptan is the ONLY disease-modifying drug for ADPKD — it slows cyst growth by blocking vasopressin-driven cAMP accumulation","Monthly LFTs for 18 months are MANDATORY — hepatotoxicity can be severe; stop tolvaptan immediately if ALT >3x ULN","Patients on tolvaptan may produce 4-6 L of urine daily — they MUST drink equivalent volumes of water to prevent hypernatremia","Mayo Imaging Classification (1A-1E based on height-adjusted TKV) predicts progression rate and helps select tolvaptan candidates","Tolvaptan is NOT indicated for all ADPKD patients — reserve for rapidly progressive disease (Class 1C-1E or high PROPKD score)","Nocturia is the most common reason for tolvaptan discontinuation — split dosing with larger AM dose helps manage this"],
    quiz: [
      {
        question: "A patient on tolvaptan for ADPKD has an ALT level 4 times the upper limit of normal on routine monitoring. What is the priority action?",
        options: ["Continue tolvaptan and recheck in 2 weeks","Immediately discontinue tolvaptan and notify the prescriber","Reduce the tolvaptan dose by half","Add hepatoprotective supplements and continue monitoring"],
        correct: 1,
        rationale: "Tolvaptan must be immediately discontinued when ALT or AST exceeds 3 times the upper limit of normal due to the risk of serious hepatotoxicity. The prescriber must be notified and liver enzymes must be monitored until normalization."
      },
      {
        question: "A patient starting tolvaptan asks why they need to drink so much water. What is the most accurate explanation?",
        options: ["Water helps dissolve kidney cysts","Tolvaptan blocks water reabsorption in the kidneys, causing massive urine output that must be replaced to prevent dangerous dehydration","Water flushes the medication through the kidneys faster","High water intake is recommended for all kidney disease regardless of medication"],
        correct: 1,
        rationale: "Tolvaptan blocks vasopressin V2 receptors, preventing water reabsorption in the collecting ducts. This causes aquaresis (4-6 L urine/day). Patients must drink enough water to match output to prevent hypernatremia and dehydration."
      },
      {
        question: "Which classification system helps the NP determine if an ADPKD patient is a candidate for tolvaptan therapy?",
        options: ["KDIGO CKD staging","Mayo Imaging Classification of TKV","Child-Pugh score","RIFLE criteria"],
        correct: 1,
        rationale: "The Mayo Imaging Classification uses height-adjusted total kidney volume (htTKV) to classify ADPKD into classes 1A-1E, predicting the rate of kidney growth. Classes 1C-1E indicate rapidly progressive disease and are candidates for tolvaptan therapy."
      },
    ]
  },
  "polycythemia-basics-rpn": {
    title: "Polycythemia Basics",
    cellular: { title: "Understanding Polycythemia", content: "Polycythemia means too many red blood cells. Thick blood flows slowly and can form clots, leading to stroke, heart attack, or pulmonary embolism.\n\nPrimary polycythemia (polycythemia vera, PV) is a bone marrow cancer where a JAK2 V617F mutation (>95% of cases) causes excess RBC production without normal signals. Secondary polycythemia occurs when the body produces extra RBCs in response to low oxygen — from chronic lung disease, high altitude, sleep apnea, or heavy smoking.\n\nPV presents with a ruddy (red, flushed) complexion and itching after warm baths (aquagenic pruritus from histamine release). Treatment includes regular phlebotomy (removing blood to lower RBC count) and low-dose aspirin to prevent clots." },
    riskFactors: ["JAK2 V617F mutation (PV)", "Chronic lung disease/COPD (secondary)", "Chronic smoking", "Obstructive sleep apnea", "Living at high altitude", "Dehydration (relative polycythemia)", "EPO-secreting tumors", "Congenital heart disease with right-to-left shunt"],
    diagnostics: ["Monitor CBC: elevated hemoglobin (>16.5 men, >16 women) and hematocrit (>49% men, >48% women)", "Expect JAK2 V617F testing (positive in >95% of PV)", "Expect EPO level: LOW in PV, HIGH in secondary", "Monitor for clot symptoms", "Assess for aquagenic pruritus", "Monitor for hyperviscosity: headache, dizziness, visual changes"],
    management: ["Phlebotomy to maintain hematocrit <45% — primary treatment", "Low-dose aspirin (81 mg daily)", "Stay well hydrated", "Report clot symptoms immediately", "Avoid iron supplements", "Report worsening symptoms"],
    nursingActions: ["Monitor hemoglobin and hematocrit", "Assist with therapeutic phlebotomy (500 mL removed, target Hct <45%)", "Monitor vitals during phlebotomy (hypotension, dizziness)", "Assess for hyperviscosity: headache, dizziness, visual changes, flushed face", "Educate on hydration", "Assess for thrombosis: leg swelling, chest pain, neurological changes", "Educate on avoiding iron supplements", "Ask about itching after warm baths"],
    assessmentFindings: ["Ruddy (plethoric) complexion", "Aquagenic pruritus after warm baths", "Headache, dizziness, visual disturbances", "Elevated H&H", "Splenomegaly", "Tinnitus", "Gout"],
    signs: {
      left: ["Red flushed face", "Itching after warm bath", "Headache and dizziness", "Visual disturbances", "Fatigue"],
      right: ["Elevated hemoglobin and hematocrit", "JAK2 V617F positive (PV)", "Low EPO (PV)", "Splenomegaly", "Elevated uric acid"]
    },
    medications: [{
      name: "Aspirin (81 mg)",
      type: "Antiplatelet agent",
      action: "Irreversibly inhibits COX-1, preventing thromboxane A2 and platelet aggregation; reduces thrombotic events in PV",
      sideEffects: "GI bleeding, easy bruising",
      contra: "Active GI bleeding, aspirin allergy",
      pearl: "81 mg daily for ALL PV patients unless contraindicated; used with phlebotomy as first-line; does NOT replace phlebotomy"
    }],
    pearls: ["PV = ruddy face + itching after warm bath + elevated H&H + JAK2 positive", "Phlebotomy target: hematocrit BELOW 45%", "PV: EPO LOW; Secondary: EPO HIGH", "Thick blood = clot risk — aspirin + phlebotomy reduce this", "Avoid iron supplements in PV", "Aquagenic pruritus is nearly pathognomonic for PV"],
    quiz: [{
      question: "A patient with PV has hematocrit of 52%. Treatment priority?",
      options: ["Chemotherapy", "Therapeutic phlebotomy to reduce hematocrit below 45%", "Iron supplements", "No treatment needed"],
      correct: 1,
      rationale: "Hematocrit <45% is the primary goal. At 52%, blood viscosity significantly increases thrombotic risk."
    }, {
      question: "A patient with elevated H&H reports itching after every warm shower. What does this suggest?",
      options: ["Allergic dermatitis", "Polycythemia vera — aquagenic pruritus is characteristic", "Eczema", "Drug allergy"],
      correct: 1,
      rationale: "Aquagenic pruritus triggered by warm water is nearly pathognomonic for PV, caused by histamine release from increased mast cells."
    }, {
      question: "How does EPO level distinguish primary from secondary polycythemia?",
      options: ["Elevated in both", "In PV, EPO is LOW (autonomous production); in secondary, EPO is HIGH (response to hypoxemia)", "Normal in both", "Not useful"],
      correct: 1,
      rationale: "In PV, JAK2 mutation drives autonomous proliferation so EPO is suppressed. In secondary polycythemia, EPO is appropriately elevated in response to chronic hypoxemia."
    }]
  },
  "polymyositis-rn": {
    title: "Polymyositis",
    cellular: { title: "Pathophysiology of Polymyositis", content: "Polymyositis is an idiopathic inflammatory myopathy characterized by CD8+ T-cell-mediated destruction of skeletal muscle fibers, causing symmetric proximal muscle weakness. The autoimmune attack involves cytotoxic T lymphocytes that recognize and directly invade non-necrotic muscle fibers expressing MHC class I molecules (normally absent on healthy muscle), with endomysial inflammatory infiltration surrounding and destroying individual myocytes. Clinical presentation includes insidious onset of symmetric proximal muscle weakness (difficulty climbing stairs, rising from a chair, lifting arms above the head), dysphagia from pharyngeal muscle involvement (aspiration risk), and elevated serum creatine kinase (CK, often 10-50 times normal) from muscle fiber destruction. Interstitial lung disease occurs in a subset of patients, particularly those with anti-Jo-1 (anti-histidyl tRNA synthetase) antibodies, as part of the antisynthetase syndrome (myositis, ILD, mechanic's hands, Raynaud phenomenon, arthritis, fever). The nurse monitors muscle strength using manual muscle testing, monitors CK and aldolase levels as markers of disease activity, assesses swallowing function and implements aspiration precautions, monitors respiratory function (FVC), administers immunosuppressive therapy (high-dose corticosteroids, methotrexate, azathioprine, or IVIG) as prescribed, and coordinates physical therapy to maintain function while avoiding exercise-induced muscle damage during active inflammation." },
    riskFactors: ["Female sex (2:1 female predominance)","Age 40-60 years (peak incidence in adults) or 5-15 years (childhood form)","Presence of other autoimmune conditions (SLE, rheumatoid arthritis, Sjögren syndrome)","Anti-Jo-1 antibodies (associated with antisynthetase syndrome: myositis + ILD + mechanic's hands)","Association with underlying malignancy (ovarian, lung, breast, GI cancers — higher risk in adults >40)","HLA-DR3 and HLA-B8 genetic associations","Certain medications (statins, D-penicillamine, hydroxychloroquine can trigger drug-induced myopathy)"],
    diagnostics: ["Serum creatine kinase (CK): markedly elevated (10-50x normal), most sensitive marker of active muscle inflammation","Aldolase: elevated; may be increased even when CK is normal in some inflammatory myopathies","Myositis-specific antibodies: anti-Jo-1 (antisynthetase syndrome), anti-Mi-2, anti-SRP","Electromyography (EMG): shows characteristic myopathic pattern (short-duration, low-amplitude, polyphasic motor units with fibrillation potentials)","MRI of affected muscle groups: shows edema and inflammation in active disease; guides biopsy site selection","Muscle biopsy: definitive diagnosis showing endomysial CD8+ T-cell infiltration surrounding and invading individual muscle fibers","Age-appropriate cancer screening — polymyositis in adults >40 carries increased malignancy risk"],
    management: ["High-dose corticosteroids (prednisone 1 mg/kg/day) as initial therapy; continue until CK normalizes, then gradual taper","Steroid-sparing agents added early: methotrexate or azathioprine to reduce long-term steroid side effects","IVIG (intravenous immunoglobulin) for refractory disease or severe dysphagia","Physical therapy: gentle ROM during active inflammation; progressive strengthening during remission","Swallowing evaluation and aspiration precautions if dysphagia present","Pulmonary function testing (FVC) for patients with anti-Jo-1 antibodies — ILD monitoring","Cancer screening at diagnosis and periodic surveillance (CT chest/abdomen/pelvis, age-appropriate screening)"],
    nursingActions: ["Assess proximal muscle strength at each encounter using manual muscle testing (shoulder abduction, hip flexion, neck flexion)","Monitor CK levels as disease activity marker — declining CK indicates treatment response; rising CK suggests flare","Implement aspiration precautions: elevate HOB 30-45 degrees during and after meals, assess cough and swallow before oral intake","Monitor respiratory function: assess for dyspnea on exertion, measure oxygen saturation; declining FVC suggests ILD progression","Assess for corticosteroid side effects: hyperglycemia, weight gain, mood changes, bone density loss, infection risk","Coordinate fall prevention measures — proximal weakness impairs ability to rise from chairs and climb stairs","Educate about avoiding strenuous exercise during active inflammation (exacerbates muscle damage); gentle ROM exercises are appropriate"],
    assessmentFindings: ["Symmetric proximal muscle weakness: difficulty rising from a chair, climbing stairs, lifting arms overhead, raising head from pillow","Dysphagia and nasal regurgitation (pharyngeal and esophageal muscle involvement — aspiration risk)","Muscle tenderness on palpation in some patients (not always present)","Mechanic's hands (cracked, rough skin on fingertips and lateral fingers — associated with antisynthetase syndrome)","Raynaud phenomenon (vasospastic blanching/cyanosis of fingers with cold exposure)","Dyspnea on exertion and dry cough (interstitial lung disease, especially with anti-Jo-1 antibodies)","Arthritis of small joints (wrists, hands) in antisynthetase syndrome"],
    signs: {
      left: ["Mild proximal weakness (difficulty with overhead activities)","CK mildly elevated (2-5x normal)","Able to perform ADLs with some difficulty","Stable respiratory function","Responding to corticosteroid therapy"],
      right: ["Severe proximal weakness unable to rise from bed or swallow safely","CK >10,000 U/L with active muscle destruction","Aspiration pneumonia from severe dysphagia","Respiratory failure from diaphragmatic weakness or ILD","Rhabdomyolysis with myoglobinuria and acute kidney injury"]
    },
    medications: [{
      name: "Prednisone",
      type: "Systemic corticosteroid",
      action: "Suppresses T-cell-mediated autoimmune muscle destruction by inhibiting inflammatory cytokine production and NF-kB signaling",
      sideEffects: "Cushingoid features, hyperglycemia, osteoporosis, immunosuppression, myopathy (steroid myopathy can mimic disease flare), cataracts, mood changes",
      contra: "Active untreated systemic infections, live vaccines",
      pearl: "PARADOX: high-dose steroids treat polymyositis but can also cause steroid myopathy — if weakness worsens with normal CK, suspect steroid myopathy and taper dose"
    },{
      name: "Methotrexate",
      type: "Antimetabolite / steroid-sparing immunosuppressant",
      action: "Inhibits dihydrofolate reductase, suppressing T-cell proliferation and inflammatory cytokine production in polymyositis",
      sideEffects: "Hepatotoxicity, bone marrow suppression, pneumonitis (MTX lung), mucositis, teratogenicity",
      contra: "Pregnancy (Category X), severe hepatic or renal impairment, active infection, immunodeficiency",
      pearl: "Always co-prescribe folic acid 1 mg daily to reduce GI and hematologic toxicities; monitor CBC and LFTs every 4-8 weeks; avoid alcohol; excellent steroid-sparing agent"
    }],
    pearls: ["Proximal muscle weakness is the hallmark — test by asking the patient to rise from a chair without using arms, climb stairs, or lift arms above the head","CK level correlates with disease activity — declining CK indicates treatment response; normalizing CK precedes clinical strength improvement by weeks","If weakness worsens while CK is NORMAL during steroid therapy, suspect STEROID MYOPATHY rather than disease flare — this distinction changes management","Anti-Jo-1 antibody positive patients require lung monitoring — antisynthetase syndrome includes ILD which can be the most life-threatening component","Always screen for underlying malignancy in adults >40 with new-onset polymyositis — ovarian, lung, and GI cancers are most commonly associated","Aspiration risk from dysphagia is a leading cause of morbidity — assess swallowing function and implement precautions proactively"],
    quiz: [
      {
        question: "A patient with polymyositis on high-dose prednisone reports worsening weakness, but today's CK level is within normal limits. What should the nurse suspect?",
        options: ["Disease flare requiring increased corticosteroids","Steroid myopathy from prolonged corticosteroid use","Laboratory error requiring repeat testing","Normal variation in disease course"],
        correct: 1,
        rationale: "When weakness worsens with a normal CK level during steroid therapy, steroid myopathy is the most likely cause. Active polymyositis would show elevated CK from muscle fiber destruction. The treatment is to taper steroids and add a steroid-sparing agent."
      },
      {
        question: "Which assessment is a priority for a newly admitted patient with polymyositis who reports difficulty swallowing?",
        options: ["Visual acuity testing","Formal swallowing evaluation and aspiration precautions","Deep tendon reflex testing","Pupil reactivity assessment"],
        correct: 1,
        rationale: "Dysphagia from pharyngeal muscle weakness places patients at high risk for aspiration pneumonia. A swallowing evaluation should be performed before any oral intake, and aspiration precautions (HOB elevation, thickened liquids, supervised meals) should be implemented."
      },
      {
        question: "A 55-year-old patient is newly diagnosed with polymyositis. Beyond treating the myositis, what additional evaluation is essential?",
        options: ["Bone density scan only","Age-appropriate cancer screening","Cardiac catheterization","Sleep study"],
        correct: 1,
        rationale: "Polymyositis in adults over 40 is associated with an increased risk of underlying malignancy (ovarian, lung, breast, GI cancers). Age-appropriate cancer screening should be performed at diagnosis and periodically during follow-up."
      },
    ]
  }};
