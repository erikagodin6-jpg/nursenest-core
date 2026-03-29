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
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "turner-syndrome-rpn": {
    title: "Turner Syndrome for Practical Nurses",
    cellular: {
      title: "Genetics and Pathophysiology of Turner Syndrome",
      content: "Turner syndrome is a chromosomal disorder affecting approximately 1 in 2,000 to 2,500 live female births, caused by complete or partial absence of one X chromosome, resulting in a 45,X karyotype. During normal female development, two X chromosomes (46,XX) are required for complete ovarian development and the full expression of female secondary sexual characteristics. In Turner syndrome, the missing or structurally abnormal X chromosome leads to gonadal dysgenesis, where the ovaries fail to develop normally and instead become fibrous streaks of connective tissue (streak gonads) incapable of producing adequate estrogen and progesterone. This ovarian failure results in primary amenorrhea, absent puberty, and infertility in most affected individuals. The haploinsufficiency of the SHOX gene (Short Stature Homeobox gene), which is located on the pseudoautosomal region of the X chromosome, is directly responsible for the characteristic short stature seen in Turner syndrome. SHOX normally promotes long bone growth, and with only one functional copy, skeletal growth is significantly impaired. The average untreated adult height is approximately 143 cm (4 feet 8 inches). Turner syndrome affects multiple organ systems beyond the reproductive system. Cardiovascular anomalies occur in 25-45% of patients, with bicuspid aortic valve being the most common (found in up to 30% of patients), followed by coarctation of the aorta (occurring in 7-18% of patients). Aortic root dilation and dissection represent life-threatening complications that require ongoing surveillance with serial echocardiography. Renal anomalies occur in approximately 30-40% of patients and include horseshoe kidney, duplicated collecting systems, and rotational abnormalities. Lymphatic system dysfunction manifests as lymphedema of the hands and feet in neonates and may cause cystic hygroma (fluid-filled sac) detected prenatally on ultrasound. Autoimmune conditions are significantly more common in Turner syndrome, including Hashimoto thyroiditis (occurring in up to 30% of patients), celiac disease, and type 1 diabetes mellitus. Recurrent otitis media and sensorineural hearing loss affect a substantial proportion of patients. For the practical nurse, understanding this multisystem involvement is essential for comprehensive monitoring, early recognition of complications, and patient education. The characteristic physical features include short stature, webbed neck (pterygium colli), low posterior hairline, shield chest (broad chest with widely spaced nipples), cubitus valgus (increased carrying angle of the elbows), and multiple pigmented nevi. Neonatal lymphedema of the dorsum of hands and feet is often the first clinical sign that raises suspicion for Turner syndrome."
    },
    riskFactors: [
      "No specific maternal risk factors have been consistently identified (not associated with advanced maternal age unlike trisomies)",
      "Turner syndrome occurs sporadically and is rarely inherited from a parent with the condition",
      "Prenatal ultrasound findings that raise suspicion include cystic hygroma, fetal hydrops, coarctation of the aorta, and renal anomalies",
      "Family history of congenital heart disease may prompt additional genetic screening",
      "Short stature in a female child without other explanation warrants karyotype analysis",
      "Delayed puberty (absent breast development by age 13, absent menarche by age 15) requires chromosomal evaluation",
      "Recurrent otitis media with sensorineural hearing loss in a female patient should prompt consideration of Turner syndrome"
    ],
    diagnostics: [
      "Karyotype analysis (gold standard): confirms 45,X or mosaic patterns (45,X/46,XX); obtained from peripheral blood lymphocytes; results take 1-2 weeks",
      "Echocardiogram: essential at diagnosis and serial monitoring every 3-5 years to evaluate for bicuspid aortic valve, coarctation of the aorta, and aortic root dilation",
      "Renal ultrasound: performed at diagnosis to identify horseshoe kidney, duplicated collecting systems, or structural anomalies present in 30-40% of patients",
      "Thyroid function tests (TSH, free T4): baseline and annual monitoring for Hashimoto thyroiditis, which occurs in up to 30% of Turner syndrome patients",
      "Bone age X-ray (left wrist): assesses skeletal maturity to guide growth hormone therapy timing and predict adult height",
      "FSH and LH levels: markedly elevated in Turner syndrome due to absent ovarian feedback (hypergonadotropic hypogonadism); confirms gonadal failure",
      "Hearing evaluation (audiometry): baseline and periodic screening for sensorineural hearing loss and conductive hearing loss from recurrent otitis media"
    ],
    management: [
      "Growth hormone therapy (somatropin) initiated as early as age 2-4 years to maximize height potential; can increase adult height by 5-8 cm on average",
      "Estrogen replacement therapy initiated at age 11-12 years using low-dose estradiol to induce puberty, promote breast development, and support bone health",
      "Progesterone added after 2 years of estrogen therapy or when breakthrough bleeding occurs to induce regular menstrual cycles and protect the endometrium",
      "Annual thyroid function monitoring and levothyroxine replacement if hypothyroidism develops from Hashimoto thyroiditis",
      "Cardiovascular surveillance with echocardiography every 3-5 years; MRI of heart and aorta recommended every 5-10 years in adulthood to monitor for aortic dilation",
      "Blood pressure monitoring at every visit due to increased risk of hypertension; treat with antihypertensives if elevated",
      "Fertility counseling: most patients are infertile but some with mosaic Turner syndrome may conceive; discuss options including oocyte donation and adoption"
    ],
    nursingActions: [
      "Monitor growth parameters (height, weight, BMI) at every visit and plot on Turner syndrome-specific growth charts",
      "Administer growth hormone injections as prescribed and teach family proper subcutaneous injection technique, site rotation, and storage requirements",
      "Assess for signs of cardiac complications including chest pain, dyspnea, dizziness, blood pressure differences between arms (coarctation)",
      "Monitor vital signs including blood pressure in all four extremities at initial assessment to screen for coarctation of the aorta",
      "Educate patient and family about the importance of lifelong hormone replacement therapy and regular follow-up appointments",
      "Assess psychosocial well-being including self-esteem, body image, peer relationships, and academic performance at each visit",
      "Document and report any new symptoms including hearing changes, swelling of hands or feet, or signs of thyroid dysfunction",
      "Coordinate multidisciplinary care among endocrinology, cardiology, genetics, audiology, and psychology services"
    ],
    assessmentFindings: [
      "Short stature: height consistently below the 3rd percentile for age on standard growth charts; average untreated adult height 143 cm",
      "Webbed neck (pterygium colli): lateral folds of skin extending from the mastoid process to the acromion, creating a shortened broad neck appearance",
      "Shield chest: broad chest with widely spaced, hypoplastic (underdeveloped) nipples",
      "Lymphedema: puffy, non-pitting swelling of the dorsum of hands and feet, particularly prominent in neonates",
      "Cubitus valgus: increased carrying angle of the elbows (greater than 15 degrees) visible when arms are extended at sides",
      "Low posterior hairline: the hairline extends lower on the back of the neck than typical",
      "Delayed or absent puberty: no breast development by age 13 and no menarche by age 15 without hormone replacement therapy"
    ],
    signs: {
      left: [
        "Short stature below 3rd percentile for age",
        "Webbed neck and low posterior hairline",
        "Shield chest with widely spaced nipples",
        "Cubitus valgus (increased carrying angle)",
        "Multiple pigmented nevi on skin",
        "Lymphedema of hands and feet in neonates"
      ],
      right: [
        "Absent puberty requiring hormone therapy",
        "Cardiac murmur indicating bicuspid aortic valve or coarctation",
        "Blood pressure discrepancy between upper and lower extremities",
        "Hearing loss (sensorineural or conductive)",
        "Signs of hypothyroidism (fatigue, weight gain, cold intolerance)",
        "Aortic dissection symptoms (sudden severe chest/back pain) -- emergency"
      ]
    },
    medications: [
      {
        name: "Somatropin (Growth Hormone)",
        type: "Recombinant human growth hormone",
        action: "Binds to growth hormone receptors on hepatocytes and other tissues, stimulating production of insulin-like growth factor 1 (IGF-1) which promotes longitudinal bone growth at the epiphyseal plates, increases protein synthesis, and enhances cell proliferation",
        sideEffects: "Injection site reactions (redness, swelling), headache, joint pain, peripheral edema, rarely intracranial hypertension (papilledema, visual changes), scoliosis progression, hyperglycemia",
        contra: "Active malignancy, closed epiphyses (no further growth possible), active proliferative or severe non-proliferative diabetic retinopathy, critical illness (increased mortality in ICU patients)",
        pearl: "Administer subcutaneously at bedtime to mimic physiological growth hormone secretion pattern; rotate injection sites among thighs, abdomen, and upper arms; monitor IGF-1 levels to adjust dosing; treatment continues until near-adult height or bone age indicates closed growth plates"
      },
      {
        name: "Estradiol (Estrogen Replacement)",
        type: "Estrogen hormone replacement",
        action: "Binds to estrogen receptors in target tissues including breast, uterus, bone, and brain to induce secondary sexual characteristics (breast development, fat distribution), promote bone mineralization and closure of epiphyseal plates, and maintain cardiovascular and neurological health",
        sideEffects: "Breast tenderness, nausea, headache, mood changes, breakthrough bleeding, increased risk of thromboembolic events at high doses",
        contra: "Known or suspected estrogen-dependent neoplasia, active deep vein thrombosis or pulmonary embolism, undiagnosed abnormal uterine bleeding, active liver disease",
        pearl: "Start with ultra-low dose transdermal estradiol at age 11-12 to mimic natural puberty onset; gradually increase dose over 2-3 years; add progesterone after 2 years or at breakthrough bleeding to protect endometrium; transdermal route preferred over oral to reduce hepatic first-pass effect and lower thromboembolic risk"
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic thyroid hormone (T4 replacement)",
        action: "Replaces deficient endogenous thyroid hormone by providing synthetic thyroxine (T4) which is converted to the active form triiodothyronine (T3) in peripheral tissues; T3 enters the nucleus and binds thyroid hormone receptors to regulate metabolism, growth, and development",
        sideEffects: "Tachycardia, palpitations, tremor, heat intolerance, weight loss, insomnia, diarrhea (signs of overreplacement/thyrotoxicosis)",
        contra: "Untreated adrenal insufficiency (must replace cortisol before thyroid hormone to prevent adrenal crisis), uncorrected thyrotoxicosis, acute myocardial infarction",
        pearl: "Take on an empty stomach 30-60 minutes before breakfast with a full glass of water; separate from calcium, iron, and antacids by at least 4 hours as they impair absorption; monitor TSH every 6-8 weeks after dose changes until stable, then annually; goal TSH within normal reference range"
      }
    ],
    pearls: [
      "Turner syndrome is the only monosomy (complete loss of a chromosome) compatible with life -- all autosomal monosomies are lethal",
      "Bicuspid aortic valve is the most common cardiac anomaly in Turner syndrome (up to 30% of patients) and requires lifelong echocardiographic surveillance",
      "Coarctation of the aorta causes blood pressure to be higher in the upper extremities than in the lower extremities -- always check BP in all four limbs at initial assessment",
      "Growth hormone therapy should be started early (age 2-4 years) and continued until near-adult height is achieved or epiphyses close -- delayed initiation reduces height benefit",
      "Estrogen replacement is started at low doses around age 11-12 to mimic the natural timing of puberty -- starting too early can accelerate bone maturation and reduce final height",
      "Hashimoto thyroiditis occurs in up to 30% of Turner syndrome patients -- annual TSH screening is mandatory throughout life",
      "Psychosocial support is critical: short stature, delayed puberty, and infertility can significantly impact self-esteem and peer relationships, especially during adolescence"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 6-year-old girl with Turner syndrome who receives daily growth hormone injections. The parent asks when to administer the injection. What is the correct response?",
        options: [
          "Give the injection in the morning before breakfast",
          "Give the injection at bedtime to mimic the body's natural growth hormone release pattern",
          "Give the injection at any time as long as it is consistent each day",
          "Give the injection immediately after meals for better absorption"
        ],
        correct: 1,
        rationale: "Growth hormone is naturally secreted in a pulsatile pattern with the largest peak occurring during sleep. Administering somatropin at bedtime mimics this physiological pattern and optimizes the therapeutic effect. Consistency in timing is important, but bedtime is the preferred administration time."
      },
      {
        question: "A newborn female is noted to have puffy hands and feet. The practical nurse understands this finding may be the first sign of which condition?",
        options: [
          "Down syndrome (trisomy 21)",
          "Turner syndrome (45,X)",
          "Klinefelter syndrome (47,XXY)",
          "Edwards syndrome (trisomy 18)"
        ],
        correct: 1,
        rationale: "Lymphedema of the dorsum of the hands and feet in a female neonate is a classic early sign of Turner syndrome caused by lymphatic system dysfunction. This finding should prompt karyotype analysis. Down syndrome presents with hypotonia and characteristic facial features, Klinefelter syndrome affects males, and Edwards syndrome presents with clenched fists and rocker-bottom feet."
      },
      {
        question: "A practical nurse is monitoring blood pressure in a child with Turner syndrome. Blood pressure in the right arm is 130/85 mmHg and in the right leg is 90/60 mmHg. Which condition does this discrepancy suggest?",
        options: [
          "Bicuspid aortic valve",
          "Atrial septal defect",
          "Coarctation of the aorta",
          "Patent ductus arteriosus"
        ],
        correct: 2,
        rationale: "A blood pressure that is significantly higher in the upper extremities compared to the lower extremities is the hallmark sign of coarctation of the aorta, a narrowing of the aortic arch that restricts blood flow to the lower body. Coarctation occurs in 7-18% of Turner syndrome patients and requires surgical or catheter-based repair."
      }
    ]
  },

  "umbilical-cord-prolapse-rpn": {
    title: "Umbilical Cord Prolapse for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Umbilical Cord Prolapse",
      content: "Umbilical cord prolapse is a life-threatening obstetric emergency that occurs when the umbilical cord descends alongside (occult prolapse) or ahead of (overt prolapse) the presenting fetal part after rupture of membranes. The umbilical cord is the fetal lifeline, containing two umbilical arteries that carry deoxygenated blood from the fetus to the placenta and one umbilical vein that returns oxygenated blood from the placenta to the fetus. These three vessels are protected by Wharton jelly, a mucoid connective tissue that provides cushioning and prevents compression. When the cord prolapses, the presenting part (usually the fetal head) compresses the cord against the cervix, vaginal wall, or pelvic structures, mechanically obstructing blood flow through the umbilical vessels. This compression leads to fetal hypoxia within minutes as oxygen delivery is interrupted. Overt (frank) cord prolapse occurs when the cord can be visualized at or protruding from the vaginal introitus after membrane rupture. This is immediately recognizable on visual inspection or vaginal examination. Occult (hidden) cord prolapse occurs when the cord descends alongside the presenting part but remains within the uterus, making it detectable only through fetal heart rate monitoring changes. The normal fetal heart rate is 110-160 beats per minute. Cord compression produces characteristic fetal heart rate patterns including variable decelerations (sudden drops in fetal heart rate that vary in timing relative to contractions), prolonged bradycardia (sustained heart rate below 110 bpm for more than 10 minutes), and absent variability. These patterns indicate acute fetal distress requiring immediate intervention. Risk factors for cord prolapse include malpresentation (breech, transverse lie), unengaged presenting part (high station), polyhydramnios (excessive amniotic fluid), premature rupture of membranes, multiparity, multiple gestation, prematurity (smaller fetus with more room for cord descent), and long umbilical cord. Artificial rupture of membranes (amniotomy) when the presenting part is high also significantly increases risk. The incidence of cord prolapse is approximately 0.1-0.6% of all deliveries. For the practical nurse working in obstetrics, rapid recognition and immediate positioning of the patient are critical first interventions while preparing for emergency cesarean delivery. The single most important nursing action upon identifying cord prolapse is to elevate the presenting part off the cord using a gloved hand inserted into the vagina to maintain upward pressure until surgical delivery is accomplished."
    },
    riskFactors: [
      "Malpresentation (breech, transverse lie, or oblique lie) -- presenting part does not fill the pelvis, leaving space for cord descent",
      "Unengaged presenting part (high station at -3 or above) -- the fetal head has not descended into the pelvis to block cord passage",
      "Polyhydramnios (excessive amniotic fluid) -- sudden release of large fluid volume with membrane rupture can wash the cord down",
      "Premature rupture of membranes (PROM) -- membrane rupture before the onset of labor when presenting part may be high",
      "Multiparity (previous pregnancies stretch uterine and cervical tissues, allowing more cord mobility)",
      "Multiple gestation (twins, triplets) -- smaller fetuses with more space for cord prolapse",
      "Amniotomy (artificial rupture of membranes) when presenting part is not engaged increases prolapse risk significantly"
    ],
    diagnostics: [
      "Vaginal examination: direct palpation of pulsating cord at or near the cervical os; the cord will feel like a pulsating, soft, rope-like structure",
      "Continuous electronic fetal monitoring (EFM): variable decelerations, prolonged bradycardia (below 110 bpm), or absent variability indicate cord compression",
      "Visual inspection: with overt prolapse, the cord may be visible at the vaginal introitus -- observe for pulsation indicating fetal viability",
      "Leopold maneuvers: assess fetal lie and presentation before membrane rupture to identify malpresentation that increases prolapse risk",
      "Ultrasound: confirm fetal presentation, estimate amniotic fluid volume, and identify cord position relative to the presenting part",
      "Fetal scalp stimulation: if heart rate tracing is non-reassuring, fetal scalp stimulation with acceleration response suggests intact fetal oxygenation"
    ],
    management: [
      "IMMEDIATE: Insert gloved hand into vagina and manually elevate the presenting part off the cord -- maintain upward pressure continuously until cesarean delivery",
      "Position patient in knee-chest position (face down, knees to chest) or steep Trendelenburg to use gravity to shift the presenting part away from the cord",
      "Administer oxygen at 8-10 L/min via non-rebreather mask to maximize maternal and fetal oxygenation",
      "Prepare for emergency cesarean delivery -- this is the definitive treatment; goal is delivery within 10-30 minutes of prolapse recognition",
      "If cord is visible and protruding, cover it with warm, sterile saline-soaked gauze to prevent drying, spasm, and further compression",
      "Bladder filling with 500-700 mL warm normal saline via Foley catheter may be ordered to elevate the presenting part while preparing for surgery",
      "Administer terbutaline 0.25 mg subcutaneously if ordered to relax the uterus (tocolysis) and reduce contractions that worsen cord compression"
    ],
    nursingActions: [
      "Call for help immediately and activate the obstetric emergency team -- do not leave the patient to get help; use the call bell or direct someone else to call",
      "Maintain manual elevation of the presenting part -- the nurse who feels the cord must keep their hand in the vagina pushing the presenting part upward until surgical delivery",
      "Apply continuous electronic fetal monitoring and assess fetal heart rate pattern every minute during the emergency",
      "Position patient in knee-chest or steep Trendelenburg position and assist with patient transport to the operating room in this position",
      "Start or ensure large-bore IV access (18-gauge or larger) for fluid resuscitation and anesthesia preparation",
      "Document the time of cord prolapse recognition, interventions performed, fetal heart rate patterns, and time of delivery",
      "Provide calm, clear communication to the patient and support person explaining what is happening and that emergency delivery is needed",
      "After delivery, assess the neonate using APGAR scoring and prepare for potential neonatal resuscitation if fetal hypoxia occurred"
    ],
    assessmentFindings: [
      "Palpable pulsating cord in the vaginal canal on examination -- the cord feels soft, rope-like, and pulsates with fetal heart rate",
      "Sudden onset of variable decelerations on fetal heart rate tracing following membrane rupture",
      "Prolonged fetal bradycardia (sustained heart rate below 110 bpm for more than 10 minutes) indicating severe cord compression",
      "Visible umbilical cord at the vaginal introitus (overt prolapse) -- may be dark blue/purple and pulsating",
      "Absent or minimal fetal heart rate variability suggesting fetal hypoxia from interrupted cord blood flow",
      "Maternal sensation of something coming out of the vagina after membrane rupture",
      "Sudden gush of amniotic fluid followed immediately by abnormal fetal heart tones -- classic sequence for cord prolapse"
    ],
    signs: {
      left: [
        "Variable decelerations on fetal heart monitor",
        "Maternal report of feeling something in vagina",
        "Sudden gush of amniotic fluid with non-reassuring tracing",
        "Cord palpated on vaginal examination",
        "Fetal heart rate changes after amniotomy",
        "Malpresentation identified on Leopold maneuvers"
      ],
      right: [
        "Prolonged fetal bradycardia below 110 bpm",
        "Visible cord at vaginal introitus",
        "Absent fetal heart rate variability",
        "Fetal heart rate below 60 bpm (impending fetal death)",
        "Loss of cord pulsation (fetal demise risk)",
        "Late decelerations with absent variability"
      ]
    },
    medications: [
      {
        name: "Terbutaline (Brethine)",
        type: "Beta-2 adrenergic agonist (tocolytic)",
        action: "Stimulates beta-2 adrenergic receptors on uterine smooth muscle, increasing intracellular cyclic AMP which decreases intracellular calcium and relaxes the myometrium, reducing uterine contractions that compress the prolapsed cord",
        sideEffects: "Maternal tachycardia, palpitations, tremor, hyperglycemia, hypokalemia, pulmonary edema (with prolonged use), fetal tachycardia",
        contra: "Maternal cardiac disease, uncontrolled hyperthyroidism, cardiac arrhythmias; use with extreme caution if maternal heart rate exceeds 120 bpm",
        pearl: "Given as a single subcutaneous injection of 0.25 mg for acute tocolysis in cord prolapse emergencies; onset of action within 5-15 minutes; monitor maternal heart rate and blood pressure; this is a temporizing measure only while preparing for emergency cesarean delivery"
      },
      {
        name: "Normal Saline for Bladder Filling",
        type: "Isotonic crystalloid solution (mechanical intervention)",
        action: "When instilled into the bladder via Foley catheter (500-700 mL), the distended bladder mechanically elevates the presenting fetal part away from the prolapsed cord, reducing cord compression and improving fetal blood flow as a temporizing measure",
        sideEffects: "Maternal bladder discomfort, urgency sensation; risk of bladder overdistension if volume exceeds 700 mL; transient maternal hypotension from vagal response",
        contra: "Bladder injury, known bladder rupture, inability to insert Foley catheter; should not delay surgical delivery",
        pearl: "Clamp the Foley catheter after instilling warm normal saline to maintain bladder distension; this technique provides hands-free cord decompression during transport to the operating room; drain the bladder immediately before cesarean delivery"
      },
      {
        name: "Oxygen (Supplemental)",
        type: "Medical gas for maternal-fetal oxygenation",
        action: "Increases the fraction of inspired oxygen (FiO2), raising maternal arterial oxygen tension (PaO2) and hemoglobin oxygen saturation, which increases the oxygen gradient across the placenta and delivers more oxygen to the fetus through the compressed umbilical cord",
        sideEffects: "Maternal drying of nasal and oral mucosa; very high concentrations for prolonged periods may cause absorption atelectasis; oxygen toxicity only with prolonged exposure at high FiO2",
        contra: "No absolute contraindications in an obstetric emergency; paraquat poisoning (theoretical); relative concern for premature neonates post-delivery (adjust to target SpO2)",
        pearl: "Administer at 8-10 L/min via non-rebreather mask to achieve FiO2 of 60-80% in cord prolapse emergencies; maternal SpO2 should be maintained at 95% or higher; ensure mask fits snugly and reservoir bag remains inflated during inhalation"
      }
    ],
    pearls: [
      "Cord prolapse is an obstetric emergency -- the goal is delivery within 10-30 minutes of recognition; every minute of delay increases the risk of fetal brain injury or death",
      "The SINGLE most important nursing action is to insert a gloved hand into the vagina and push the presenting part UP and OFF the cord -- maintain this pressure continuously until surgical delivery",
      "NEVER attempt to push a prolapsed cord back into the uterus -- this can cause vasospasm and worsen the obstruction",
      "Knee-chest position (face and chest down, buttocks up) is the best patient position because gravity moves the presenting part away from the pelvis and relieves cord pressure",
      "If the cord is visible and protruding, keep it moist with warm sterile saline-soaked gauze -- a dry cord will spasm and constrict, worsening fetal hypoxia",
      "Always assess fetal heart rate IMMEDIATELY after amniotomy (artificial rupture of membranes) -- cord prolapse risk is highest at this moment",
      "Document the time of prolapse recognition, time continuous cord elevation began, fetal heart rate patterns throughout, and time of delivery -- this timeline is critical for medicolegal documentation"
    ],
    quiz: [
      {
        question: "During a vaginal examination following spontaneous rupture of membranes, the practical nurse feels a pulsating, soft structure in the vaginal canal. What is the immediate priority action?",
        options: [
          "Document the finding and notify the physician",
          "Push the cord back into the uterus to relieve compression",
          "Keep the hand in the vagina and push the presenting part upward off the cord while calling for emergency help",
          "Position the patient on her left side and apply oxygen"
        ],
        correct: 2,
        rationale: "When a prolapsed cord is palpated, the immediate priority is to manually elevate the presenting part off the cord to relieve compression and restore fetal blood flow. The nurse must keep their hand in place and call for help simultaneously. The cord must NEVER be pushed back into the uterus as this can cause vasospasm. Left lateral position alone is insufficient; knee-chest or Trendelenburg is needed."
      },
      {
        question: "A patient with a known breech presentation is undergoing amniotomy. Immediately after the procedure, the fetal heart rate drops to 80 bpm with variable decelerations. What does the practical nurse suspect?",
        options: [
          "Normal fetal response to membrane rupture",
          "Umbilical cord prolapse with cord compression",
          "Placental abruption",
          "Uterine rupture"
        ],
        correct: 1,
        rationale: "Breech presentation is a major risk factor for cord prolapse because the breech does not fill the pelvis as completely as a cephalic presentation. Sudden fetal bradycardia with variable decelerations immediately after amniotomy is the classic presentation of cord compression from cord prolapse. Immediate vaginal examination should be performed to confirm."
      },
      {
        question: "While preparing for emergency cesarean delivery for cord prolapse, which position should the practical nurse place the patient in to relieve cord compression?",
        options: [
          "Supine with legs elevated",
          "Left lateral Sims position",
          "Knee-chest position with buttocks elevated",
          "Semi-Fowler position at 45 degrees"
        ],
        correct: 2,
        rationale: "Knee-chest position (face and chest on the bed, knees bent, buttocks elevated) uses gravity to shift the presenting part away from the pelvis and off the prolapsed cord. This is the most effective position for relieving cord compression. Steep Trendelenburg is an alternative. Supine and semi-Fowler positions would worsen compression by pushing the presenting part further onto the cord."
      }
    ]
  },

  "vaginal-hematoma-rpn": {
    title: "Vaginal and Vulvar Hematoma for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Postpartum Perineal and Vulvar Hematoma",
      content: "A postpartum vaginal or vulvar hematoma is a localized collection of blood that forms within the soft tissues of the perineum, vagina, or vulva following vaginal delivery, resulting from rupture of blood vessels beneath intact mucosa or skin. The female perineum is highly vascularized, receiving blood supply from branches of the internal pudendal artery, and the tissues become especially engorged during pregnancy due to increased blood volume (40-50% increase by term) and hormonal effects that cause vasodilation and increased capillary permeability. During vaginal delivery, the perineal tissues undergo significant stretching and compression as the fetal head descends through the birth canal. Even when the mucosal surface remains intact (no visible laceration), deeper vessels, particularly veins within the submucosal and subcutaneous tissue layers, can rupture from shearing forces, forming a hematoma. The absence of a visible wound is what makes concealed hematomas particularly dangerous -- significant blood loss can occur internally while external inspection appears normal. Hematomas are classified by anatomical location. Vulvar hematomas form in the superficial tissues of the labia and perineum and are usually visible as a tense, discolored, bulging mass. They tend to be self-limiting because the surrounding tissue planes provide tamponade. Vaginal hematomas form within the paravaginal tissue above the pelvic diaphragm and may extend into the broad ligament or retroperitoneal space. These are more dangerous because they are concealed within the vaginal vault and may not be apparent on external inspection, yet they can expand to contain 500 mL to over 1 liter of blood, leading to hypovolemic shock. The hallmark clinical presentation is pain that is disproportionate to the apparent findings. A patient who has had a normal vaginal delivery with a small or absent perineal tear but complains of severe, unrelenting perineal, rectal, or vaginal pressure and pain should raise immediate suspicion for hematoma formation. Other key signs include a visible, tense, bluish-purple swelling on the vulva or perineum; difficulty voiding due to urethral compression by the hematoma; and progressive tachycardia and hypotension as blood accumulates. Risk factors include instrumental delivery (forceps or vacuum extraction), episiotomy (especially mediolateral), prolonged second stage of labor, precipitous delivery, first vaginal birth (nulliparity), large fetal weight (macrosomia), pre-existing coagulopathy, and use of anticoagulant medications. For the practical nurse, vigilant postpartum perineal assessment, pain evaluation, and early recognition of the hallmark sign of pain out of proportion to visible injury are essential for timely intervention."
    },
    riskFactors: [
      "Instrumental delivery (forceps or vacuum extraction) -- mechanical trauma to deep perineal vessels during application and traction",
      "Episiotomy, especially mediolateral type, which cuts through vascular tissue and may extend deeper than intended",
      "Prolonged second stage of labor (pushing phase) causing sustained pressure on perineal vasculature",
      "Precipitous delivery (rapid, uncontrolled delivery) causing sudden stretching and vessel rupture",
      "Nulliparity (first vaginal delivery) -- untested perineal tissues are less elastic and more susceptible to injury",
      "Macrosomia (large birth weight infant over 4,000 g) requiring greater perineal distension during delivery",
      "Pre-existing coagulopathy or use of anticoagulant medications (heparin, enoxaparin) impairing hemostasis after vessel rupture"
    ],
    diagnostics: [
      "Visual inspection of perineum: look for unilateral, tense, bluish-purple swelling of the vulva, labia, or perineum that was not present immediately after delivery",
      "Palpation: the hematoma feels firm, tender, and fluctuant; note the size in centimeters and mark boundaries with a skin marker to track expansion",
      "Complete blood count (CBC): hemoglobin and hematocrit to quantify blood loss; significant drops indicate concealed hemorrhage; repeat serially",
      "Coagulation studies (PT, PTT, fibrinogen): rule out coagulopathy as a contributing factor, especially if bleeding is excessive or diffuse",
      "Vital signs monitoring: tachycardia (HR > 100 bpm) and hypotension (SBP < 90 mmHg) are late signs of significant blood loss into the hematoma",
      "Vaginal speculum examination (performed by provider): visualize the vaginal walls and cervix for concealed vaginal vault hematomas not visible externally"
    ],
    management: [
      "Small hematomas (less than 5 cm, non-expanding, stable vital signs): conservative management with ice packs (20 minutes on, 20 minutes off), analgesics, and close observation",
      "Mark hematoma borders with skin marker and measure every 15-30 minutes to detect expansion -- a growing hematoma requires surgical intervention",
      "Large or expanding hematomas: surgical evacuation (incision, clot removal, ligation of bleeding vessel) under anesthesia performed by the physician",
      "Administer IV fluids (lactated Ringer or normal saline) via large-bore IV access to maintain intravascular volume if significant blood loss is suspected",
      "Monitor urine output via Foley catheter insertion if the hematoma is compressing the urethra and causing urinary retention",
      "Administer pain management as prescribed -- severe pain requires IV analgesics (morphine or ketorolac); oral ibuprofen for mild-moderate pain",
      "Blood transfusion may be required if hemoglobin drops below 7 g/dL or patient becomes symptomatic (dizziness, tachycardia, dyspnea)"
    ],
    nursingActions: [
      "Perform perineal assessment every 15 minutes for the first hour postpartum, then every 30 minutes for the next hour, then per facility protocol",
      "Assess pain level using a validated pain scale at each perineal check -- pain out of proportion to visible injury is the hallmark warning sign",
      "Apply ice packs to the perineum for the first 24 hours (20 minutes on, 20 minutes off) to promote vasoconstriction and reduce swelling",
      "Monitor vital signs every 15 minutes if hematoma is identified -- report tachycardia greater than 100 bpm or systolic BP drop greater than 20 mmHg from baseline",
      "Measure and document hematoma size at each assessment; mark boundaries with skin marker to objectively track any expansion",
      "Maintain large-bore IV access and ensure blood type and crossmatch are on file in case transfusion is needed",
      "Assist with voiding and monitor for urinary retention -- a vulvar hematoma can compress the urethra causing inability to void",
      "Provide emotional support and explain all interventions calmly; unexpected postpartum complications increase anxiety in new mothers"
    ],
    assessmentFindings: [
      "Severe perineal, vaginal, or rectal pain out of proportion to the apparent delivery trauma -- this is the hallmark finding",
      "Unilateral, tense, fluctuant, bluish-purple swelling of the vulva, labia, or perineum",
      "Rectal pressure and sensation of fullness despite having an empty rectum",
      "Difficulty voiding or complete urinary retention from urethral compression by the expanding hematoma",
      "Tachycardia and hypotension developing gradually as concealed blood loss continues into the tissue",
      "Restlessness, anxiety, and increasing analgesic requests not explained by the delivery itself",
      "Fundal height within normal limits (ruling out uterine atony as the cause of blood loss)"
    ],
    signs: {
      left: [
        "Perineal pain greater than expected after delivery",
        "Visible swelling or discoloration of vulva/perineum",
        "Rectal pressure or fullness",
        "Increasing analgesic requirements",
        "Difficulty initiating urination",
        "Restlessness or anxiety in the new mother"
      ],
      right: [
        "Rapidly expanding tense mass on perineum",
        "Tachycardia above 100 bpm with normal fundal tone",
        "Hypotension (systolic BP below 90 mmHg)",
        "Hemoglobin drop of more than 2 g/dL from baseline",
        "Complete urinary retention requiring catheterization",
        "Signs of hypovolemic shock (pallor, diaphoresis, altered consciousness)"
      ]
    },
    medications: [
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase (COX-1 and COX-2) enzymes, reducing prostaglandin synthesis which decreases inflammation, pain, and fever at the site of tissue injury; provides both analgesic and anti-inflammatory effects for perineal pain",
        sideEffects: "GI irritation, nausea, dyspepsia, increased bleeding risk, renal impairment with prolonged use, headache",
        contra: "Active GI bleeding, severe renal impairment, third trimester of pregnancy (postpartum use is safe), aspirin-sensitive asthma, concurrent anticoagulant therapy",
        pearl: "First-line analgesic for postpartum perineal pain; administer with food to reduce GI irritation; 400-600 mg every 6-8 hours; safe during breastfeeding as minimal amounts pass into breast milk; avoid if patient has active hematoma expansion (may worsen bleeding)"
      },
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic agent (synthetic oxytocin)",
        action: "Binds to oxytocin receptors on uterine smooth muscle cells, increasing intracellular calcium and stimulating rhythmic uterine contractions; in the postpartum period, promotes sustained uterine contraction to compress myometrial blood vessels and prevent uterine atony-related hemorrhage",
        sideEffects: "Uterine hyperstimulation (sustained tetanic contraction), water intoxication and hyponatremia (antidiuretic effect at high doses), hypotension with rapid IV bolus, nausea, vomiting",
        contra: "Known hypersensitivity; avoid rapid undiluted IV push which can cause severe hypotension and cardiac arrhythmias",
        pearl: "Standard postpartum dose is 10-40 units in 1 liter of IV fluid infused at 125-200 mL/hour; also given as 10 units IM after placental delivery; always verify uterine tone is firm (ruling out uterine atony as bleeding source) before attributing blood loss solely to hematoma"
      },
      {
        name: "Ice Pack Application (Cryotherapy)",
        type: "Non-pharmacological intervention (topical cold therapy)",
        action: "Local application of cold causes vasoconstriction of superficial blood vessels, reduces blood flow to the injured area, slows the rate of hematoma expansion, decreases edema formation by reducing capillary permeability, and provides analgesic effect by slowing nerve conduction velocity",
        sideEffects: "Skin numbness, frostbite risk if applied directly without barrier, rebound vasodilation after removal, discomfort from cold sensation",
        contra: "Raynaud phenomenon, cryoglobulinemia, cold urticaria; avoid direct skin contact (always wrap in cloth barrier)",
        pearl: "Apply ice pack wrapped in a thin cloth to the perineum for 20 minutes on, 20 minutes off during the first 24 hours; most effective when started within 30 minutes of delivery; after 24 hours, switch to warm sitz baths to promote healing and comfort"
      }
    ],
    pearls: [
      "The hallmark sign of postpartum hematoma is PAIN OUT OF PROPORTION to visible perineal injury -- a patient with severe pain after a normal delivery with no visible laceration must be assessed for concealed hematoma",
      "Concealed vaginal vault hematomas are the most dangerous because they can accumulate over 1 liter of blood without external signs until hypovolemic shock develops",
      "Always check for urinary retention in a patient with perineal pain postpartum -- a vulvar hematoma can compress the urethra and prevent voiding",
      "Mark the borders of a visible hematoma with a skin marker at the first assessment so you can objectively measure whether it is expanding at subsequent checks",
      "Tachycardia is often the FIRST vital sign change in concealed hemorrhage -- do not wait for hypotension to report concerns about a growing hematoma",
      "Normal uterine tone (firm fundus) with tachycardia should prompt investigation for hematoma as the source of blood loss rather than uterine atony",
      "Ice packs applied in the first 24 hours postpartum reduce hematoma expansion through vasoconstriction -- follow the 20-on/20-off protocol to prevent tissue injury"
    ],
    quiz: [
      {
        question: "A patient is 2 hours postpartum after a vacuum-assisted vaginal delivery. She rates her perineal pain as 9/10 despite having no visible perineal laceration. Her uterine fundus is firm. What should the practical nurse suspect?",
        options: [
          "Normal postpartum discomfort that will resolve with time",
          "Uterine atony causing internal hemorrhage",
          "Perineal or vaginal hematoma with concealed bleeding",
          "Urinary tract infection"
        ],
        correct: 2,
        rationale: "Pain out of proportion to visible injury is the hallmark sign of a postpartum hematoma. Vacuum-assisted delivery is a major risk factor. The firm fundus rules out uterine atony. The severe pain with no visible laceration strongly suggests blood is collecting in the deeper tissues forming a concealed hematoma that requires immediate assessment."
      },
      {
        question: "A practical nurse identifies a 4 cm vulvar hematoma on a postpartum patient. What is the most important nursing action to monitor for expansion?",
        options: [
          "Apply warm compresses to promote reabsorption",
          "Mark the borders of the hematoma with a skin marker and remeasure at each assessment",
          "Elevate the patient's legs to reduce venous pressure",
          "Instruct the patient to notify the nurse only if pain increases"
        ],
        correct: 1,
        rationale: "Marking hematoma borders with a skin marker provides an objective measurement tool to detect expansion at subsequent assessments. Without marking, subjective visual assessment is unreliable for detecting gradual size increase. Cold (not warm) therapy is appropriate in the first 24 hours. Active nursing surveillance is required rather than relying on patient self-reporting."
      },
      {
        question: "A postpartum patient with a known perineal hematoma develops a heart rate of 115 bpm with blood pressure of 100/65 mmHg. Her fundus is firm at the umbilicus. What do these findings indicate?",
        options: [
          "Normal postpartum hemodynamic changes",
          "Uterine atony requiring fundal massage",
          "Possible hematoma expansion with concealed hemorrhage requiring immediate physician notification",
          "Anxiety reaction that will resolve with reassurance"
        ],
        correct: 2,
        rationale: "Tachycardia (HR > 100 bpm) and a drop in blood pressure in a patient with a known hematoma and firm fundus indicates concealed hemorrhage from hematoma expansion. The firm fundus rules out uterine atony. These vital sign changes represent compensatory mechanisms for blood volume loss and require immediate physician notification for potential surgical intervention."
      }
    ]
  },

  "viral-myocarditis-rpn": {
    title: "Viral Myocarditis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Viral Myocarditis",
      content: "Myocarditis is inflammation of the myocardium (heart muscle) that can result from infectious, autoimmune, or toxic causes, with viral infection being the most common etiology. Coxsackievirus B (an enterovirus) is historically the most frequently identified causative agent, though adenovirus, parvovirus B19, human herpesvirus 6 (HHV-6), influenza, SARS-CoV-2, and Epstein-Barr virus are also important causes. The pathophysiology of viral myocarditis proceeds through three overlapping phases. In Phase 1 (viral invasion, days 1-3), the virus enters the body through the respiratory or gastrointestinal tract and reaches the heart via the bloodstream. Coxsackievirus B binds to the coxsackievirus-adenovirus receptor (CAR) on cardiomyocytes, gaining entry to the cardiac muscle cells. Once inside, the virus hijacks cellular machinery to replicate, causing direct cardiomyocyte necrosis and releasing intracellular contents (troponin, CK-MB) into the bloodstream. In Phase 2 (immune response, days 4-14), the innate and adaptive immune systems mount an inflammatory response. Natural killer cells, macrophages, and T lymphocytes infiltrate the myocardium to destroy virus-infected cardiomyocytes. While this immune response is necessary to clear the virus, it causes significant collateral damage to uninfected cardiomyocytes, creating patchy areas of myocardial inflammation and necrosis. Pro-inflammatory cytokines (TNF-alpha, interleukins) further injure the myocardium and depress contractile function. In Phase 3 (resolution or progression, weeks to months), the inflammation either resolves with myocardial healing and fibrosis, or progresses to chronic inflammation leading to dilated cardiomyopathy. Approximately 10-20% of patients with acute myocarditis develop dilated cardiomyopathy, which is a leading cause of heart transplantation in young adults. The inflamed, edematous myocardium has impaired systolic function (reduced ejection fraction) because damaged and necrotic cardiomyocytes cannot contract effectively. Diastolic function is also impaired as the stiff, inflamed muscle resists normal filling. These functional impairments produce symptoms of heart failure: dyspnea, orthopnea, fatigue, peripheral edema, and reduced exercise tolerance. The inflammation can also disrupt the cardiac conduction system, producing arrhythmias ranging from premature ventricular contractions to ventricular tachycardia and complete heart block. Myocarditis is a significant cause of sudden cardiac death in young adults and athletes, which is why patients must be placed on activity restriction during the acute phase. Cardiac MRI with gadolinium enhancement is the most sensitive noninvasive diagnostic tool, showing myocardial edema and late gadolinium enhancement in areas of inflammation and fibrosis. Endomyocardial biopsy remains the gold standard for definitive diagnosis but is invasive and rarely performed except in fulminant cases. For the practical nurse, care focuses on hemodynamic monitoring, activity restriction, medication administration, recognition of heart failure and arrhythmia signs, and patient education about the importance of prolonged activity modification during recovery."
    },
    riskFactors: [
      "Recent viral illness (upper respiratory infection or gastroenteritis within 1-3 weeks before cardiac symptoms onset)",
      "Young adults and adolescents (ages 20-40) are most commonly affected, with a male predominance (2:1 ratio)",
      "Immunocompromised state (HIV/AIDS, immunosuppressive therapy, organ transplant recipients) increases susceptibility",
      "Strenuous physical activity during active viral infection may increase viral replication in the myocardium and worsen inflammation",
      "Pregnancy and peripartum period (peripartum cardiomyopathy may overlap with viral myocarditis)",
      "Autoimmune disorders (systemic lupus erythematosus, sarcoidosis) may predispose to autoimmune-mediated myocarditis",
      "COVID-19 infection and mRNA vaccination (rare cases of myocarditis, predominantly in young males after second dose)"
    ],
    diagnostics: [
      "Troponin I or T: elevated due to cardiomyocyte necrosis; troponin is more specific for myocardial injury than CK-MB; serial levels track ongoing damage",
      "CK-MB (creatine kinase-MB isoenzyme): elevated in myocardial injury; less specific than troponin but supports the diagnosis when elevated with compatible symptoms",
      "B-type natriuretic peptide (BNP or NT-proBNP): elevated when the ventricles are stretched from volume overload or heart failure; levels correlate with severity",
      "12-lead ECG: may show diffuse ST-segment changes (elevation or depression), T-wave inversions, low voltage QRS complexes, and arrhythmias (PVCs, heart block)",
      "Echocardiogram: assesses ventricular function; may show reduced ejection fraction, regional wall motion abnormalities, ventricular dilation, and pericardial effusion",
      "Cardiac MRI with gadolinium: most sensitive noninvasive test; shows myocardial edema on T2-weighted images and late gadolinium enhancement in areas of inflammation and fibrosis",
      "Viral serology (Coxsackievirus B, adenovirus, parvovirus B19 antibodies): helps identify causative virus; rising titers confirm recent infection"
    ],
    management: [
      "Strict activity restriction and bed rest during acute phase to reduce myocardial oxygen demand; avoid all strenuous activity for 3-6 months after diagnosis",
      "ACE inhibitor (enalapril or lisinopril) or ARB therapy to reduce afterload, prevent ventricular remodeling, and improve cardiac output in heart failure",
      "Beta-blocker therapy (metoprolol succinate or carvedilol) initiated at low doses once hemodynamically stable to reduce heart rate, lower myocardial oxygen demand, and prevent arrhythmias",
      "Diuretic therapy (furosemide) for fluid overload symptoms: peripheral edema, pulmonary congestion, dyspnea, and weight gain",
      "Continuous cardiac monitoring for arrhythmia detection; antiarrhythmic therapy or temporary pacing as needed for hemodynamically significant arrhythmias",
      "Anticoagulation may be considered if ejection fraction is severely reduced (below 30%) to prevent intracardiac thrombus formation",
      "Immunosuppressive therapy (prednisone, azathioprine) reserved for biopsy-proven autoimmune or giant cell myocarditis; not routinely used for viral myocarditis"
    ],
    nursingActions: [
      "Monitor vital signs every 2-4 hours including heart rate, blood pressure, respiratory rate, SpO2, and temperature during acute phase",
      "Maintain continuous cardiac telemetry monitoring and report any new arrhythmias (PVCs, ventricular tachycardia, heart block) immediately",
      "Assess for heart failure signs at each shift: dyspnea, orthopnea, crackles on lung auscultation, peripheral edema, jugular venous distension, and weight gain",
      "Enforce strict bed rest with bathroom privileges during acute phase; assist with activities of daily living to minimize cardiac workload",
      "Obtain daily weights at the same time, same clothing, same scale; report weight gain of more than 1 kg in 24 hours (fluid retention)",
      "Administer ACE inhibitors, beta-blockers, and diuretics as prescribed; monitor blood pressure before each dose of ACE inhibitor and beta-blocker",
      "Educate patient about the critical importance of activity restriction for 3-6 months -- premature return to exercise risks sudden cardiac death",
      "Monitor intake and output; implement fluid restriction (typically 1.5-2 liters per day) if ordered for heart failure management"
    ],
    assessmentFindings: [
      "Chest pain: may be sharp and pleuritic (pericardial involvement) or dull and pressure-like (myocardial inflammation); often worsened by lying flat",
      "Dyspnea and orthopnea: shortness of breath at rest or with minimal exertion indicates impaired ventricular function and pulmonary congestion",
      "Fatigue and exercise intolerance out of proportion to the patient's baseline fitness level, reflecting reduced cardiac output",
      "Tachycardia out of proportion to fever: the heart rate is faster than expected for the degree of fever, suggesting myocardial irritability",
      "New-onset arrhythmias: premature ventricular contractions, ventricular tachycardia, or heart block detected on telemetry or ECG",
      "Fever, malaise, and myalgia consistent with the preceding viral illness that triggered the myocarditis",
      "Peripheral edema, jugular venous distension, and hepatomegaly if right-sided heart failure develops"
    ],
    signs: {
      left: [
        "Chest pain (pleuritic or pressure-like)",
        "Fatigue and exercise intolerance",
        "Low-grade fever and malaise",
        "Tachycardia disproportionate to fever",
        "Mild dyspnea on exertion",
        "Recent viral illness in preceding weeks"
      ],
      right: [
        "Cardiogenic shock (hypotension, tachycardia, cool extremities)",
        "Ventricular tachycardia or ventricular fibrillation",
        "Complete heart block requiring temporary pacing",
        "Acute pulmonary edema (severe dyspnea, pink frothy sputum)",
        "Cardiac tamponade (muffled heart sounds, JVD, hypotension)",
        "Sudden cardiac death (particularly in young athletes)"
      ]
    },
    medications: [
      {
        name: "Enalapril (Vasotec)",
        type: "ACE inhibitor (angiotensin-converting enzyme inhibitor)",
        action: "Blocks the conversion of angiotensin I to angiotensin II by inhibiting ACE, resulting in vasodilation, reduced afterload and preload, decreased aldosterone secretion, reduced sodium and water retention, and prevention of adverse ventricular remodeling in heart failure",
        sideEffects: "Hypotension (especially first dose), dry persistent cough (due to bradykinin accumulation), hyperkalemia, dizziness, angioedema (rare but life-threatening), acute kidney injury",
        contra: "History of angioedema, bilateral renal artery stenosis, pregnancy (teratogenic -- causes fetal renal agenesis), hyperkalemia above 5.5 mEq/L",
        pearl: "Start at low dose (2.5 mg twice daily) and titrate up slowly; check blood pressure before each dose; monitor serum potassium and creatinine within 1-2 weeks of initiation; hold if systolic BP below 90 mmHg; if cough develops, switch to an ARB (losartan or valsartan)"
      },
      {
        name: "Metoprolol Succinate (Toprol-XL)",
        type: "Beta-1 selective adrenergic blocker (cardioselective beta-blocker)",
        action: "Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate, myocardial contractility, and oxygen consumption; decreases the renin-angiotensin-aldosterone system activation; prevents arrhythmias by stabilizing cardiac conduction; reduces ventricular remodeling in heart failure",
        sideEffects: "Bradycardia, hypotension, fatigue, dizziness, depression, bronchospasm (less likely with beta-1 selective agents), cold extremities, masking of hypoglycemic symptoms",
        contra: "Severe bradycardia (HR below 50 bpm), second- or third-degree heart block without pacemaker, cardiogenic shock, decompensated heart failure (start only when stable), sick sinus syndrome",
        pearl: "Start at the lowest dose (12.5-25 mg daily) in acute myocarditis and titrate slowly every 2 weeks; always check heart rate and blood pressure before administration -- hold if HR below 60 or SBP below 90; never stop abruptly as rebound tachycardia and hypertension can occur; use extended-release formulation for heart failure"
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2-chloride (NKCC2) cotransporter in the thick ascending limb of the loop of Henle, blocking reabsorption of sodium, potassium, and chloride; produces rapid, potent diuresis that reduces intravascular volume, preload, and pulmonary congestion in heart failure",
        sideEffects: "Hypokalemia, hyponatremia, hypotension, dehydration, metabolic alkalosis, ototoxicity (especially with rapid IV administration or high doses), hyperuricemia, hyperglycemia",
        contra: "Anuria (no urine production), severe electrolyte depletion, hepatic coma, known hypersensitivity to sulfonamides (cross-reactivity possible)",
        pearl: "Administer IV for acute pulmonary edema (onset within 5 minutes); give oral for chronic management; monitor potassium before and during therapy -- hypokalemia increases arrhythmia risk in an already irritable myocardium; weigh patient daily and assess for dehydration; IV push rate should not exceed 4 mg/minute to prevent ototoxicity"
      }
    ],
    pearls: [
      "Viral myocarditis is the most common cause of sudden cardiac death in young adults and athletes -- any young person with chest pain, dyspnea, and recent viral illness needs cardiac evaluation",
      "Activity restriction for 3-6 months after diagnosis is CRITICAL -- premature return to exercise can trigger fatal arrhythmias in an inflamed myocardium",
      "Tachycardia out of proportion to fever is a key early sign -- if the heart rate is faster than expected for the temperature elevation, consider myocarditis",
      "Troponin elevation in a young patient with recent viral illness and chest pain should raise suspicion for myocarditis rather than acute coronary syndrome",
      "Cardiac MRI with gadolinium is the most sensitive noninvasive test -- it shows both active inflammation (edema) and fibrosis (late gadolinium enhancement)",
      "NSAIDs should be AVOIDED in acute myocarditis as they may increase myocardial inflammation and worsen outcomes despite being commonly used for pericarditis",
      "Approximately 10-20% of acute viral myocarditis cases progress to dilated cardiomyopathy -- long-term follow-up with serial echocardiography is essential"
    ],
    quiz: [
      {
        question: "A 25-year-old male presents with chest pain, dyspnea, and fatigue two weeks after a viral upper respiratory infection. Troponin is elevated and ECG shows diffuse ST changes. The practical nurse understands this presentation is most consistent with which condition?",
        options: [
          "Stable angina from coronary artery disease",
          "Viral myocarditis",
          "Costochondritis",
          "Pulmonary embolism"
        ],
        correct: 1,
        rationale: "The triad of chest pain, dyspnea, and elevated troponin following a recent viral illness in a young adult is the classic presentation of viral myocarditis. Stable angina is unlikely in a 25-year-old without risk factors. Costochondritis would not elevate troponin. Pulmonary embolism presents with pleuritic chest pain and dyspnea but typically without preceding viral illness and diffuse ST changes."
      },
      {
        question: "A patient with acute viral myocarditis asks when they can return to their regular exercise routine. What is the correct nursing response?",
        options: [
          "You can resume exercise as soon as your symptoms improve",
          "Exercise restriction is recommended for at least 3-6 months after diagnosis, as determined by your cardiologist",
          "Light exercise can begin immediately as long as you monitor your heart rate",
          "You only need to wait 2 weeks after your fever resolves"
        ],
        correct: 1,
        rationale: "Activity restriction for 3-6 months is critical in viral myocarditis. An inflamed myocardium is electrically unstable and strenuous exercise can trigger fatal ventricular arrhythmias. Return to exercise must be guided by the cardiologist based on resolution of inflammation (normal cardiac MRI and biomarkers) and recovered ventricular function."
      },
      {
        question: "The practical nurse is administering metoprolol to a patient with viral myocarditis. Before giving the medication, which assessment is most important?",
        options: [
          "Assess the patient's pain level",
          "Check the patient's heart rate and blood pressure",
          "Review the patient's dietary intake",
          "Assess the patient's urinary output"
        ],
        correct: 1,
        rationale: "Heart rate and blood pressure must be assessed before administering metoprolol (a beta-blocker) because it lowers both. The medication should be held if the heart rate is below 60 bpm or systolic blood pressure is below 90 mmHg to prevent bradycardia and hypotension, which could compromise cardiac output in an already weakened heart."
      }
    ]
  },

  "visual-acuity-rpn": {
    title: "Visual Acuity Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of Visual Acuity",
      content: "Visual acuity refers to the sharpness or clarity of vision, specifically the ability of the eye to resolve fine detail. It is determined by the optical quality of the eye and the neural processing capacity of the visual system. Light enters the eye through the cornea, which provides approximately two-thirds of the eye's total refractive (light-bending) power. The light then passes through the aqueous humor, the pupil (controlled by the iris to regulate light entry), and the crystalline lens, which provides the remaining one-third of refractive power and adjusts its shape (accommodation) to focus on objects at different distances. The focused light passes through the vitreous humor and strikes the retina, a multilayered neural tissue lining the back of the eye. The retina contains two types of photoreceptors: rods (approximately 120 million, responsible for scotopic or dim-light vision and peripheral vision) and cones (approximately 6 million, responsible for photopic or bright-light vision, color perception, and visual acuity). The macula is a specialized region of the central retina responsible for sharp central vision, and the fovea centralis at the center of the macula contains the highest concentration of cones and provides the maximum visual acuity. When photoreceptors are stimulated by light, they generate electrical impulses that travel through bipolar cells and ganglion cells, whose axons form the optic nerve (cranial nerve II). The optic nerves from both eyes partially cross at the optic chiasm and project to the lateral geniculate nucleus of the thalamus, then to the primary visual cortex in the occipital lobe for conscious visual processing. Visual acuity is measured using standardized charts. The Snellen chart (distance vision) is the most widely used, tested at 20 feet (6 meters). Normal visual acuity is 20/20, meaning the patient can read at 20 feet what a person with normal vision reads at 20 feet. A result of 20/40 means the patient must stand at 20 feet to read what normal vision reads at 40 feet, indicating reduced acuity. Legal blindness is defined as best-corrected visual acuity of 20/200 or worse in the better eye, or a visual field of 20 degrees or less. Near vision is tested using the Jaeger chart or Rosenbaum pocket screener held at 14 inches (35 cm). Visual field assessment evaluates peripheral vision using confrontation testing, where the patient identifies objects in the peripheral visual field while maintaining central fixation. Common refractive errors include myopia (nearsightedness -- the focal point falls in front of the retina), hyperopia (farsightedness -- the focal point falls behind the retina), astigmatism (irregular corneal curvature causing blurred vision at all distances), and presbyopia (age-related loss of lens accommodation beginning around age 40). For the practical nurse, visual acuity assessment is a fundamental screening tool performed during health assessments, preoperative evaluations, and whenever a patient reports vision changes. Accurate technique and documentation are essential for detecting vision problems that require ophthalmologic referral."
    },
    riskFactors: [
      "Age over 40 years (presbyopia onset) and over 60 years (increased risk of cataracts, glaucoma, and macular degeneration)",
      "Diabetes mellitus (diabetic retinopathy is the leading cause of blindness in working-age adults; caused by microvascular damage to retinal vessels)",
      "Hypertension (hypertensive retinopathy with arteriolar narrowing, cotton-wool spots, and flame hemorrhages on fundoscopy)",
      "Family history of glaucoma (first-degree relatives have 4-9x increased risk), macular degeneration, or hereditary eye conditions",
      "Prolonged screen use and near work (contributes to eye strain, dry eye, and potentially myopia progression in children)",
      "Smoking (doubles the risk of age-related macular degeneration and increases cataract risk)",
      "Systemic medications affecting vision (corticosteroids causing cataracts and glaucoma, hydroxychloroquine causing retinal toxicity, ethambutol causing optic neuritis)"
    ],
    diagnostics: [
      "Snellen chart (distance visual acuity): standard test performed at 20 feet; each eye tested separately while occluding the other; record the smallest line read with more than half the letters correct",
      "Jaeger chart or Rosenbaum pocket screener (near vision): held at 14 inches (35 cm); tests reading vision; J1 or J2 is normal near vision for patients over 40",
      "Confrontation visual field testing: patient fixates on the examiner's nose while identifying fingers or movement in each quadrant of the peripheral visual field; detects gross field deficits",
      "Pupil assessment (PERRLA): Pupils Equal, Round, Reactive to Light, and Accommodation; test with penlight in each eye; assess direct and consensual responses",
      "Cover-uncover test: identifies strabismus (eye misalignment); cover one eye and observe the uncovered eye for movement when the cover is removed",
      "Ishihara color plates: screens for color vision deficiency (color blindness); patient identifies numbers embedded in colored dots; important for occupational screening"
    ],
    management: [
      "Refer to optometrist or ophthalmologist for comprehensive eye examination if screening reveals visual acuity of 20/40 or worse in either eye",
      "Corrective lenses (glasses or contact lenses) prescribed for refractive errors: myopia corrected with concave (minus) lenses, hyperopia with convex (plus) lenses",
      "Ensure adequate lighting for reading and close work; recommend task lighting that illuminates the work surface without creating glare",
      "Annual dilated eye examinations for patients with diabetes mellitus to screen for diabetic retinopathy, regardless of visual symptoms",
      "Intraocular pressure measurement (tonometry) screening for glaucoma in patients over 40, especially those with family history or African American descent",
      "Fall prevention measures for patients with impaired vision: ensure clear pathways, adequate lighting, remove throw rugs, apply contrasting colors at stair edges",
      "Patient education about protective eyewear for occupational hazards, UV protection (sunglasses with UV-A and UV-B blocking), and avoiding eye rubbing"
    ],
    nursingActions: [
      "Perform Snellen chart testing with the chart at eye level, well-illuminated, and at a standardized distance of 20 feet from the patient",
      "Test each eye separately by occluding the non-tested eye with an opaque occluder or cupped hand -- ensure the patient does not peek around the occluder",
      "If the patient wears corrective lenses, test both uncorrected and corrected visual acuity and document both results clearly",
      "Record visual acuity as a fraction (e.g., 20/40 OD, 20/20 OS) where OD = right eye (oculus dexter), OS = left eye (oculus sinister), OU = both eyes (oculus uterque)",
      "Assess for signs of eye strain, discomfort, or squinting during testing -- these behaviors may indicate uncorrected refractive errors",
      "For patients unable to read letters (children, illiterate patients, non-English speakers), use Tumbling E chart, Lea symbols, or Allen figures",
      "Document and report any sudden vision changes, new-onset visual field deficits, eye pain with vision changes, or visual acuity significantly different between eyes",
      "Educate patients about the importance of regular eye examinations, especially those with diabetes, hypertension, or family history of glaucoma"
    ],
    assessmentFindings: [
      "Decreased distance visual acuity (worse than 20/20): patient cannot read small letters on the Snellen chart; may indicate myopia, cataracts, or retinal pathology",
      "Decreased near visual acuity in patients over 40: difficulty reading small print at 14 inches; classic for presbyopia (age-related loss of lens accommodation)",
      "Visual field deficit: patient unable to detect objects or movement in one or more quadrants during confrontation testing; suggests glaucoma, stroke, or retinal detachment",
      "Unequal visual acuity between eyes (difference of two or more Snellen lines): may indicate amblyopia in children or unilateral pathology in adults",
      "Squinting, head tilting, or leaning forward during testing: compensatory behaviors suggesting uncorrected refractive error",
      "Eye pain accompanied by vision changes: red flag finding requiring urgent referral; may indicate acute angle-closure glaucoma, uveitis, or optic neuritis",
      "Cloudy or hazy vision: may indicate cataracts (gradual onset) or corneal edema (acute onset)"
    ],
    signs: {
      left: [
        "Decreased Snellen acuity (20/30-20/60 range)",
        "Difficulty reading small print up close",
        "Squinting or leaning during testing",
        "Mild headache after prolonged reading",
        "Eye fatigue with screen use",
        "Gradual onset of blurred vision"
      ],
      right: [
        "Visual acuity 20/200 or worse (legal blindness)",
        "Sudden painless vision loss (retinal detachment, central retinal artery occlusion)",
        "Sudden painful vision loss (acute angle-closure glaucoma)",
        "Visual field loss (hemianopia from stroke, quadrantanopia)",
        "Flashes of light and floaters (retinal detachment warning signs)",
        "Curtain or shadow across the visual field (retinal detachment in progress)"
      ]
    },
    medications: [
      {
        name: "Artificial Tears (Carboxymethylcellulose/Polyethylene Glycol)",
        type: "Ophthalmic lubricant / tear substitute",
        action: "Supplements the natural tear film by providing lubrication and moisture to the ocular surface; stabilizes the tear film, reduces friction during blinking, and protects the corneal and conjunctival epithelium from desiccation and mechanical irritation",
        sideEffects: "Temporary blurred vision immediately after application, mild stinging upon instillation, allergic reaction to preservatives (use preservative-free formulations for frequent use)",
        contra: "Known hypersensitivity to specific formulation ingredients; avoid preserved formulations if using more than 4-6 times daily (preservative toxicity to corneal epithelium)",
        pearl: "Apply 1-2 drops to each eye as needed; when using multiple eye drops, wait at least 5 minutes between different medications; preservative-free single-use vials are preferred for patients using artificial tears more than 4 times daily or those wearing contact lenses; instill drops into the lower conjunctival sac, not directly onto the cornea"
      },
      {
        name: "Pilocarpine (Isopto Carpine)",
        type: "Direct-acting cholinergic agonist (miotic agent)",
        action: "Directly stimulates muscarinic receptors in the sphincter pupillae muscle causing pupil constriction (miosis), and in the ciliary muscle causing contraction that opens the trabecular meshwork and Schlemm canal, increasing aqueous humor outflow and reducing intraocular pressure in glaucoma",
        sideEffects: "Miosis (small pupils causing dim vision, especially at night), brow ache, accommodative spasm (blurred near vision in younger patients), increased salivation, diaphoresis, potential for retinal detachment in susceptible patients",
        contra: "Acute iritis or uveitis (miosis worsens inflammation), conditions where pupil constriction is undesirable (posterior synechiae risk), uncontrolled asthma (systemic cholinergic effects)",
        pearl: "Apply nasolacrimal occlusion (press on the inner corner of the eye near the nose) for 1-2 minutes after instillation to reduce systemic absorption and minimize side effects; warn patients about reduced night vision due to miosis; commonly used as adjunct therapy in open-angle glaucoma or emergency treatment for acute angle-closure glaucoma"
      },
      {
        name: "Timolol (Timoptic)",
        type: "Non-selective beta-adrenergic blocker (ophthalmic)",
        action: "Blocks beta-1 and beta-2 adrenergic receptors in the ciliary epithelium, reducing the production of aqueous humor by the ciliary body, thereby lowering intraocular pressure in open-angle glaucoma and ocular hypertension by approximately 20-30%",
        sideEffects: "Systemic absorption can cause bradycardia, hypotension, bronchospasm, fatigue, and depression; local effects include eye stinging, dry eyes, and blurred vision",
        contra: "Asthma or severe COPD (risk of fatal bronchospasm even from ophthalmic use), sinus bradycardia, second- or third-degree heart block, uncompensated heart failure, cardiogenic shock",
        pearl: "Even as an eye drop, timolol can be systemically absorbed and cause significant cardiovascular and respiratory effects; apply nasolacrimal occlusion for 2 minutes after instillation; always ask about asthma and heart conditions before administering; check apical pulse before first dose; a single drop in one eye can lower heart rate by 10-15 bpm"
      }
    ],
    pearls: [
      "The Snellen chart must be positioned at exactly 20 feet from the patient with adequate, non-glare illumination -- incorrect distance invalidates the results",
      "Always test each eye SEPARATELY (monocular testing) before testing both eyes together -- a significant difference between eyes (2 or more Snellen lines) requires referral",
      "OD means right eye (oculus dexter), OS means left eye (oculus sinister), OU means both eyes (oculus uterque) -- always use standard abbreviations in documentation",
      "Legal blindness is defined as best-corrected visual acuity of 20/200 or worse in the better eye, OR a visual field of 20 degrees or less",
      "Sudden painless vision loss is a medical emergency -- causes include central retinal artery occlusion (treat within 90 minutes) and retinal detachment (requires urgent surgical repair)",
      "Timolol eye drops can cause systemic beta-blockade -- ALWAYS check for asthma, COPD, and bradycardia before administering ophthalmic beta-blockers",
      "Apply nasolacrimal occlusion (press the inner corner of the eye near the nose for 1-2 minutes) after instilling any eye drops to reduce systemic absorption and maximize local effect"
    ],
    quiz: [
      {
        question: "A practical nurse is performing a Snellen chart vision screening. The patient can read the 20/40 line with the right eye and the 20/20 line with the left eye. How should this finding be documented?",
        options: [
          "OD 20/40, OS 20/20",
          "OS 20/40, OD 20/20",
          "OU 20/40",
          "Visual acuity normal bilateral"
        ],
        correct: 0,
        rationale: "OD stands for oculus dexter (right eye) and OS stands for oculus sinister (left eye). The right eye visual acuity is 20/40 and the left eye is 20/20. The significant difference between eyes (two Snellen lines) warrants referral for comprehensive ophthalmologic examination to determine the cause of decreased right eye acuity."
      },
      {
        question: "Before administering timolol eye drops to a patient with glaucoma, which assessment is most important for the practical nurse to perform?",
        options: [
          "Assess visual acuity using the Snellen chart",
          "Check for a history of asthma or COPD and assess heart rate",
          "Perform a pupillary light reflex test",
          "Measure intraocular pressure"
        ],
        correct: 1,
        rationale: "Timolol is a non-selective beta-blocker that, even as an eye drop, can be systemically absorbed and cause bronchospasm in patients with asthma or COPD and bradycardia in patients with cardiac conditions. Checking for respiratory disease history and heart rate is essential before administration to prevent potentially fatal bronchospasm or symptomatic bradycardia."
      },
      {
        question: "A patient reports suddenly seeing flashes of light and a large number of new floaters in the right eye, followed by a shadow spreading across the visual field. What should the practical nurse do?",
        options: [
          "Apply artificial tears and schedule a routine eye appointment",
          "Reassure the patient that floaters are a normal age-related change",
          "Report immediately as these are warning signs of retinal detachment requiring urgent ophthalmologic evaluation",
          "Perform a confrontation visual field test and document the findings"
        ],
        correct: 2,
        rationale: "Sudden onset of flashes of light, a shower of new floaters, and a curtain or shadow across the visual field are the classic warning triad of retinal detachment. This is an ophthalmic emergency requiring urgent referral for surgical repair (typically within 24 hours) to prevent permanent vision loss. Delaying treatment can result in irreversible blindness."
      }
    ]
  },

  "vitiligo-rpn": {
    title: "Vitiligo for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Vitiligo",
      content: "Vitiligo is a chronic autoimmune disorder characterized by the progressive destruction of melanocytes, the pigment-producing cells located in the basal layer of the epidermis, resulting in well-defined patches of depigmented (white) skin. It affects approximately 0.5-2% of the global population, with onset most commonly between ages 10 and 30 years, and affects all races and ethnicities equally, though it is more noticeable in individuals with darker skin tones. Melanocytes originate from neural crest cells during embryonic development and migrate to the epidermis, hair follicles, eyes, and inner ear. Their primary function is to produce melanin, a pigment that protects underlying cells from ultraviolet (UV) radiation damage by absorbing UV photons and dissipating the energy as heat. Melanin is synthesized within specialized organelles called melanosomes through a series of enzymatic reactions, with tyrosinase being the rate-limiting enzyme. The melanosomes are then transferred to surrounding keratinocytes via dendritic processes, providing UV protection to the entire epidermal layer. In vitiligo, melanocytes are targeted and destroyed by the immune system through several proposed mechanisms. The autoimmune hypothesis, which has the strongest evidence, involves CD8+ cytotoxic T lymphocytes that recognize melanocyte-specific antigens (such as tyrosinase, MART-1/Melan-A, and gp100) and attack melanocytes. Circulating autoantibodies against melanocyte surface antigens have been found in up to 90% of vitiligo patients. The oxidative stress hypothesis proposes that melanocytes in vitiligo have an inherent defect in handling reactive oxygen species (ROS), leading to oxidative damage that triggers the autoimmune response. Elevated levels of hydrogen peroxide have been found in the epidermis of vitiligo patients. There is also a strong genetic predisposition, with approximately 20% of vitiligo patients having a first-degree relative with the condition. The HLA associations and multiple susceptibility genes have been identified, many of which overlap with other autoimmune diseases. Vitiligo is classified into two main types. Non-segmental (generalized) vitiligo is the most common form (85-90%), presenting as bilateral, symmetric depigmented patches that typically progress over time and may affect any body surface. Segmental vitiligo is less common (10-15%), presenting as unilateral depigmented patches within a single dermatome, with earlier onset, rapid initial progression, and then stabilization. Common sites of involvement include the face (especially periorbital and perioral areas), hands, wrists, elbows, knees, axillae, and genitalia -- areas subject to friction or trauma (Koebner phenomenon). Hair in affected areas may also become white (poliosis or leukotrichia) when melanocytes in hair follicles are affected. The Wood lamp examination (ultraviolet A light at 365 nm) is a key diagnostic tool that enhances the contrast between depigmented and normally pigmented skin, making early or subtle lesions more visible. Under Wood lamp, vitiligo appears as bright blue-white fluorescent patches due to the complete absence of melanin. This is particularly useful in fair-skinned individuals where vitiligo may be difficult to see under standard lighting. The association of vitiligo with other autoimmune conditions is clinically significant. Up to 15-25% of vitiligo patients have concurrent autoimmune thyroid disease (Hashimoto thyroiditis or Graves disease), and screening with thyroid function tests is recommended. Other associated conditions include type 1 diabetes mellitus, pernicious anemia, Addison disease, alopecia areata, and rheumatoid arthritis. For the practical nurse, care focuses on psychosocial support (vitiligo significantly impacts body image and quality of life), skin protection (depigmented skin is highly susceptible to sunburn), medication application education, and screening for associated autoimmune conditions."
    },
    riskFactors: [
      "Family history of vitiligo (approximately 20% of patients have an affected first-degree relative; multiple susceptibility genes identified)",
      "Personal or family history of other autoimmune diseases (Hashimoto thyroiditis, Graves disease, type 1 diabetes, Addison disease, pernicious anemia)",
      "Age of onset typically between 10 and 30 years, though it can occur at any age",
      "Skin trauma or friction (Koebner phenomenon): new vitiligo lesions can develop at sites of physical injury, burns, or repeated friction",
      "Psychological stress (emotional stress may trigger onset or exacerbation through neuroendocrine-immune interactions)",
      "Chemical exposure to phenolic compounds (found in some hair dyes, adhesives, and rubber products) that are toxic to melanocytes",
      "Sunburn on previously unaffected skin can trigger new depigmented patches through the Koebner phenomenon"
    ],
    diagnostics: [
      "Wood lamp examination (UV-A light at 365 nm): vitiligo patches appear bright blue-white fluorescent; enhances detection of early or subtle lesions, especially in fair-skinned individuals",
      "Clinical examination: well-defined, chalk-white, depigmented macules and patches with normal skin texture (no scaling, no atrophy) -- distinguishes vitiligo from other hypopigmented conditions",
      "Thyroid function tests (TSH, free T4, anti-TPO antibodies): screen for associated autoimmune thyroid disease at diagnosis and annually thereafter",
      "Complete blood count (CBC): screen for pernicious anemia (macrocytic anemia with elevated MCV); check vitamin B12 levels if anemia is present",
      "Fasting blood glucose or HbA1c: screen for type 1 diabetes mellitus, which has increased prevalence in vitiligo patients",
      "Antinuclear antibody (ANA): screen for systemic autoimmune conditions if clinical presentation suggests additional autoimmune involvement",
      "Skin biopsy (rarely needed): shows complete absence of melanocytes on histopathology with Fontana-Masson stain; performed only when diagnosis is uncertain"
    ],
    management: [
      "Topical corticosteroids (betamethasone) for limited disease: first-line for localized vitiligo to suppress the immune attack on melanocytes and promote repigmentation",
      "Topical calcineurin inhibitors (tacrolimus) for facial and sensitive areas: preferred over corticosteroids for the face, eyelids, and genital area to avoid steroid-induced skin atrophy",
      "Narrow-band ultraviolet B (NB-UVB) phototherapy: first-line for widespread vitiligo; stimulates melanocyte migration from hair follicle reservoirs and suppresses the autoimmune response",
      "Sunscreen application (SPF 30 or higher, broad-spectrum) to depigmented areas daily: prevents sunburn on melanin-deficient skin and reduces contrast between affected and unaffected areas",
      "Camouflage cosmetics and self-tanning products for cosmetically sensitive areas to improve appearance and psychological well-being",
      "Psychological support and counseling referrals: vitiligo has significant impact on body image, self-esteem, social functioning, and quality of life",
      "Annual screening for associated autoimmune conditions (thyroid function, blood glucose, CBC) throughout life"
    ],
    nursingActions: [
      "Assess the extent and distribution of depigmented patches using body surface area estimation and document locations, sizes, and any changes at each visit",
      "Educate patient about strict sun protection for depigmented skin: apply broad-spectrum SPF 30+ sunscreen, wear protective clothing, and avoid peak sun exposure hours",
      "Teach proper application of topical medications (tacrolimus, betamethasone): thin layer to affected areas only, frequency per prescription, and expected timeline for response (8-12 weeks minimum)",
      "Assess psychosocial impact using validated quality-of-life instruments; screen for depression, anxiety, social isolation, and low self-esteem at each visit",
      "Educate patient about the Koebner phenomenon: avoid skin trauma, friction, and tight clothing over affected areas as this can trigger new depigmented patches",
      "Monitor for topical corticosteroid side effects during long-term use: skin atrophy (thinning, striae), telangiectasias, and acneiform eruptions",
      "Provide information about support groups and vitiligo patient communities for peer support and coping strategies",
      "Coordinate referrals to dermatology for phototherapy initiation and endocrinology for management of associated autoimmune conditions"
    ],
    assessmentFindings: [
      "Well-defined, chalk-white depigmented macules and patches with normal skin texture (no scaling, induration, or atrophy)",
      "Bilateral, symmetric distribution in non-segmental vitiligo; commonly affects face (periorbital, perioral), hands, wrists, elbows, knees, and genitalia",
      "Poliosis (white hair) in affected areas indicating melanocyte destruction in hair follicles; may affect scalp hair, eyebrows, and eyelashes",
      "Koebner phenomenon: new depigmented patches developing at sites of recent skin trauma, surgical scars, or friction areas",
      "Enhanced blue-white fluorescence of depigmented patches under Wood lamp examination",
      "Psychosocial distress: patient may express embarrassment, anxiety, depression, social withdrawal, or low self-esteem related to visible depigmentation",
      "Associated findings: thyroid enlargement or nodules (Hashimoto thyroiditis), premature graying of scalp hair, or signs of other autoimmune conditions"
    ],
    signs: {
      left: [
        "White patches on sun-exposed areas (face, hands)",
        "Symmetric pattern of depigmentation",
        "Gradually enlarging patches over months to years",
        "White hair in affected areas (poliosis)",
        "Normal skin texture within depigmented patches",
        "New patches at sites of friction or trauma (Koebner phenomenon)"
      ],
      right: [
        "Rapid progression with confluent depigmentation (universal vitiligo)",
        "Severe sunburn on depigmented skin (no melanin protection)",
        "Signs of concurrent autoimmune disease (thyroid nodules, goiter)",
        "Significant psychological distress or depression",
        "Depigmentation of the oral mucosa or genitalia",
        "Complete depigmentation of the scalp, eyebrows, and eyelashes"
      ]
    },
    medications: [
      {
        name: "Tacrolimus Ointment 0.1% (Protopic)",
        type: "Topical calcineurin inhibitor (immunomodulator)",
        action: "Binds to FKBP-12, forming a complex that inhibits calcineurin phosphatase, blocking T-cell activation and reducing the production of pro-inflammatory cytokines (IL-2, IL-4, TNF-alpha) that drive the autoimmune destruction of melanocytes; promotes melanocyte survival and migration for repigmentation",
        sideEffects: "Burning and stinging sensation at application site (usually resolves within first week), pruritus, erythema, skin tingling; FDA black box warning regarding theoretical lymphoma risk with long-term use (clinical significance debated)",
        contra: "Active skin infections at the application site, known hypersensitivity to tacrolimus or macrolide compounds",
        pearl: "Preferred over topical corticosteroids for face, eyelids, neck, and genital areas because it does not cause skin atrophy; apply twice daily as a thin layer; repigmentation begins at 8-12 weeks and occurs as perifollicular (around hair follicles) pigmented spots that gradually coalesce; advise sun protection during treatment"
      },
      {
        name: "Betamethasone Dipropionate 0.05% Cream",
        type: "Potent topical corticosteroid (Class III)",
        action: "Binds to intracellular glucocorticoid receptors, translocates to the nucleus, and modulates gene transcription to suppress the inflammatory and autoimmune response attacking melanocytes; reduces T-cell infiltration, decreases pro-inflammatory cytokine production, and creates a favorable environment for melanocyte regeneration",
        sideEffects: "Skin atrophy (thinning), striae (stretch marks), telangiectasias (visible blood vessels), acneiform eruption, perioral dermatitis, hypopigmentation (paradoxically), adrenal suppression with excessive use or occlusion",
        contra: "Facial skin (use calcineurin inhibitors instead), skin infections (bacterial, viral, fungal), rosacea, perioral dermatitis; avoid prolonged continuous use beyond 3-4 months without dermatology guidance",
        pearl: "Apply once daily to affected areas on the body (not face) for 3-4 months; if no response, consider alternative therapy; use the fingertip unit (FTU) method for dosing -- one FTU covers an area equivalent to two adult handprints; schedule periodic steroid holidays (2 weeks off per month) to minimize atrophy risk; monitor for skin thinning at each visit"
      },
      {
        name: "Narrow-Band UVB Phototherapy (311-313 nm)",
        type: "Phototherapy (non-pharmacological light treatment)",
        action: "Delivers controlled doses of ultraviolet B light at 311-313 nm wavelength to depigmented skin, stimulating melanocyte stem cells in the hair follicle outer root sheath to proliferate and migrate to the depigmented epidermis; simultaneously suppresses the local autoimmune response by inducing T-cell apoptosis and modulating cytokine profiles in favor of melanocyte survival",
        sideEffects: "Erythema (sunburn-like reaction if dose is excessive), pruritus, dry skin, potential increased long-term skin cancer risk with cumulative UV exposure, phototoxic reactions if concurrent photosensitizing medications are used",
        contra: "History of photosensitivity disorders (lupus, xeroderma pigmentosum), concurrent use of photosensitizing medications, melanoma or extensive non-melanoma skin cancer history, severe photoallergy",
        pearl: "Treatment requires 2-3 sessions per week for 6-12 months; repigmentation appears first around hair follicles as perifollicular pigmented spots; facial and trunk lesions respond best while hands and feet respond poorest (fewer hair follicles); apply sunscreen to normally pigmented skin during treatment to prevent darkening and maintain even appearance; document cumulative UV dose at each session"
      }
    ],
    pearls: [
      "Vitiligo is an autoimmune condition, NOT a cosmetic problem -- it has significant psychological impact and is associated with other autoimmune diseases requiring screening",
      "Wood lamp examination is essential for diagnosis: vitiligo appears bright blue-white fluorescent under UV-A light, which is especially helpful in fair-skinned patients where lesions are subtle",
      "The Koebner phenomenon means new vitiligo patches can develop at sites of skin trauma -- educate patients to avoid sunburn, friction, and unnecessary skin injury",
      "Use tacrolimus (NOT corticosteroids) on the face, eyelids, and genital areas to avoid skin atrophy from chronic corticosteroid use",
      "Repigmentation from treatment begins as perifollicular (around hair follicles) spots that gradually coalesce -- explain this pattern to patients so they understand the slow process",
      "Screen ALL vitiligo patients for thyroid disease (TSH, anti-TPO antibodies) at diagnosis and annually -- up to 25% have concurrent autoimmune thyroid disease",
      "Psychosocial support is a critical component of vitiligo care -- assess for depression, anxiety, and social isolation at every visit and refer to counseling as needed"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient with vitiligo. Which diagnostic tool enhances the visibility of depigmented patches, especially in fair-skinned individuals?",
        options: [
          "Dermatoscope",
          "Wood lamp (UV-A light)",
          "Skin biopsy punch",
          "Diascopy (glass slide pressure)"
        ],
        correct: 1,
        rationale: "The Wood lamp emits UV-A light at 365 nm wavelength, which causes vitiligo patches to fluoresce bright blue-white due to the complete absence of melanin. This is particularly useful in fair-skinned patients where the depigmented patches may be difficult to distinguish from surrounding skin under normal lighting conditions."
      },
      {
        question: "A patient with vitiligo asks why tacrolimus ointment is prescribed for facial patches instead of the betamethasone cream used on the arms. What is the best explanation?",
        options: [
          "Tacrolimus is more effective than betamethasone for all body areas",
          "Tacrolimus does not cause skin thinning like corticosteroids, making it safer for the delicate facial skin",
          "Betamethasone is not available in a concentration suitable for facial use",
          "Tacrolimus works faster than betamethasone on the face"
        ],
        correct: 1,
        rationale: "Topical calcineurin inhibitors like tacrolimus are preferred for the face, eyelids, neck, and genital areas because they do not cause the skin atrophy, striae, and telangiectasias associated with chronic topical corticosteroid use. Facial skin is thinner and more susceptible to these corticosteroid side effects."
      },
      {
        question: "A practical nurse is educating a newly diagnosed vitiligo patient. Which screening test should be recommended based on the known association between vitiligo and other autoimmune conditions?",
        options: [
          "Hepatitis panel",
          "Thyroid function tests (TSH and anti-TPO antibodies)",
          "HIV screening",
          "Rheumatoid factor"
        ],
        correct: 1,
        rationale: "Up to 15-25% of vitiligo patients develop concurrent autoimmune thyroid disease (Hashimoto thyroiditis or Graves disease). Thyroid function tests (TSH) and thyroid autoantibodies (anti-TPO) should be obtained at diagnosis and annually thereafter to detect thyroid dysfunction early and initiate treatment."
      }
    ]
  },

  "von-willebrand-disease-rpn": {
    title: "Von Willebrand Disease for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Von Willebrand Disease",
      content: "Von Willebrand disease (VWD) is the most common inherited bleeding disorder, affecting approximately 1% of the general population (though clinically significant disease is less prevalent). It is caused by quantitative or qualitative deficiency of von Willebrand factor (VWF), a large multimeric glycoprotein that plays two essential roles in hemostasis: platelet adhesion and coagulation factor VIII protection. Under normal hemostatic conditions, when a blood vessel is injured, subendothelial collagen is exposed. VWF is released from Weibel-Palade bodies in endothelial cells and alpha-granules in platelets. The released VWF binds to exposed collagen and undergoes conformational change under the shear stress of flowing blood, exposing binding sites for the platelet glycoprotein Ib/IX/V (GPIb) receptor. This VWF bridge between collagen and platelets is the primary mechanism for platelet adhesion at sites of vascular injury, especially in areas of high shear stress such as arteries and the microvasculature. Without adequate VWF, platelets cannot adhere properly to the injured vessel wall, resulting in impaired primary hemostasis. VWF also serves as a carrier protein for coagulation factor VIII, protecting it from premature degradation by activated protein C and other proteases in the circulation. Factor VIII has a half-life of approximately 12 hours when bound to VWF but only 2 hours when circulating free. Therefore, VWF deficiency leads to secondary factor VIII deficiency, which can impair the intrinsic coagulation cascade and prolong the activated partial thromboplastin time (aPTT). VWD is classified into three types based on the nature of the VWF defect. Type 1 (70-80% of cases) is a partial quantitative deficiency with VWF levels reduced to 20-50% of normal; inheritance is autosomal dominant; symptoms are usually mild with mucocutaneous bleeding. Type 2 (15-20% of cases) involves qualitative defects in VWF function; subdivided into 2A (decreased platelet-dependent function with loss of high-molecular-weight multimers), 2B (increased binding affinity for platelet GPIb causing spontaneous platelet aggregation and thrombocytopenia), 2M (decreased platelet binding without loss of multimers), and 2N (decreased binding to factor VIII, mimicking hemophilia A). Type 3 (less than 5% of cases) is the most severe form with virtually complete absence of VWF; inheritance is autosomal recessive; presents with both mucocutaneous bleeding and joint/soft tissue bleeding similar to severe hemophilia. The clinical hallmark of VWD is mucocutaneous bleeding: prolonged nosebleeds (epistaxis), heavy menstrual bleeding (menorrhagia), easy bruising, prolonged bleeding from cuts and dental procedures, and gastrointestinal bleeding. Unlike hemophilia, joint bleeding (hemarthrosis) is uncommon except in severe Type 3 disease. Menorrhagia is often the presenting symptom in females and may lead to iron-deficiency anemia. VWD is diagnosed through a combination of VWF antigen level (quantitative), VWF ristocetin cofactor activity (functional), factor VIII activity, and VWF multimer analysis. The bleeding time is prolonged, and the aPTT may be prolonged (due to secondary factor VIII deficiency) or normal (if factor VIII levels remain adequate). For the practical nurse, care focuses on bleeding precautions, gentle handling, medication administration (desmopressin and VWF concentrates), patient education about avoiding antiplatelet medications, and ensuring the patient carries medical identification indicating their bleeding disorder."
    },
    riskFactors: [
      "Family history of von Willebrand disease (autosomal dominant inheritance for Types 1 and most Type 2; autosomal recessive for Type 3)",
      "Female sex increases symptom recognition due to menorrhagia (heavy menstrual bleeding is often the presenting complaint)",
      "Surgical or dental procedures without pre-treatment with desmopressin or VWF concentrate (increased bleeding risk)",
      "Use of antiplatelet medications (aspirin, NSAIDs) or anticoagulants that compound the existing hemostatic defect",
      "Pregnancy: VWF levels naturally rise during pregnancy but may drop rapidly postpartum, increasing the risk of postpartum hemorrhage",
      "Hypothyroidism (associated with acquired von Willebrand syndrome through reduced VWF production)",
      "Trauma or contact sports without appropriate protective equipment in patients with known VWD"
    ],
    diagnostics: [
      "VWF antigen level (VWF:Ag): measures the quantity of VWF protein in the blood; reduced in Type 1 (20-50% of normal) and virtually absent in Type 3",
      "VWF ristocetin cofactor activity (VWF:RCo): measures VWF function (ability to bind platelets in the presence of ristocetin); reduced in Types 1, 2A, and 2M; paradoxically increased in Type 2B",
      "Factor VIII activity: reduced secondary to VWF deficiency because VWF protects factor VIII from degradation; lowest in Type 3 and Type 2N",
      "Activated partial thromboplastin time (aPTT): may be prolonged due to secondary factor VIII deficiency; may be normal in mild Type 1 with adequate factor VIII",
      "Complete blood count (CBC): check for thrombocytopenia (may occur in Type 2B due to spontaneous platelet aggregation) and anemia from chronic bleeding",
      "VWF multimer analysis: distinguishes Type 2 subtypes by showing the distribution of VWF multimers (loss of high-molecular-weight multimers in Type 2A)",
      "Bleeding time or PFA-100 (platelet function analyzer): prolonged due to impaired platelet adhesion; used as a screening tool"
    ],
    management: [
      "Desmopressin (DDAVP): first-line treatment for Type 1 VWD; stimulates release of stored VWF from endothelial Weibel-Palade bodies, transiently increasing VWF and factor VIII levels 3-5 fold",
      "VWF/factor VIII concentrate (Humate-P or Wilate): used for Type 2 and Type 3 VWD, or when desmopressin is ineffective or contraindicated; provides exogenous VWF and factor VIII",
      "Tranexamic acid (antifibrinolytic): stabilizes clots by inhibiting plasminogen activation; used adjunctively for mucosal bleeding (epistaxis, menorrhagia, dental procedures)",
      "Hormonal therapy (combined oral contraceptives) for menorrhagia management: raises endogenous VWF and factor VIII levels and reduces menstrual blood loss",
      "Avoid aspirin, NSAIDs, and antiplatelet agents that impair platelet function and worsen the bleeding tendency",
      "Pre-procedure prophylaxis: administer desmopressin or VWF concentrate before surgical or dental procedures to achieve hemostatic VWF levels",
      "Iron supplementation for iron-deficiency anemia resulting from chronic mucocutaneous blood loss"
    ],
    nursingActions: [
      "Implement bleeding precautions: use soft-bristle toothbrush, electric razor, avoid rectal temperatures, apply prolonged pressure to venipuncture sites (minimum 5 minutes)",
      "Administer desmopressin as prescribed: IV infusion over 15-30 minutes, intranasal spray, or subcutaneous injection; monitor for side effects during and after administration",
      "Monitor fluid intake and output when desmopressin is administered: restrict fluids to prevent water retention and hyponatremia (antidiuretic effect of desmopressin)",
      "Assess for bleeding at each shift: check for new bruising, petechiae, epistaxis, gum bleeding, melena, hematuria, and menstrual flow character",
      "Apply prolonged direct pressure (minimum 10-15 minutes) to any bleeding site; use topical hemostatic agents (thrombin, gelatin sponge) for mucosal bleeding",
      "Educate patient to avoid contact sports and activities with high injury risk; recommend medical alert identification bracelet or necklace",
      "Ensure the patient's VWD diagnosis is clearly documented in the medical record and communicated to all healthcare providers before any procedure",
      "Monitor for signs of significant hemorrhage: tachycardia, hypotension, pallor, dizziness, decreasing hemoglobin levels"
    ],
    assessmentFindings: [
      "Easy bruising (ecchymoses) with minimal trauma, often large and in multiple stages of healing across the body",
      "Prolonged epistaxis (nosebleeds) that are difficult to control with standard measures (direct pressure for 10-15 minutes)",
      "Menorrhagia (heavy menstrual bleeding): changing pads or tampons every 1-2 hours, periods lasting more than 7 days, passage of large clots",
      "Prolonged bleeding from minor cuts, dental work, and surgical procedures beyond what is expected for the type of wound",
      "Gingival (gum) bleeding with routine tooth brushing or dental care",
      "Gastrointestinal bleeding: melena (dark tarry stools) or hematochezia (bright red blood per rectum) from GI mucosal bleeding",
      "Iron-deficiency anemia symptoms from chronic blood loss: fatigue, pallor, weakness, tachycardia, dyspnea on exertion"
    ],
    signs: {
      left: [
        "Easy bruising with minimal trauma",
        "Frequent or prolonged nosebleeds",
        "Heavy menstrual periods",
        "Gum bleeding with tooth brushing",
        "Prolonged bleeding from minor cuts",
        "Fatigue from chronic blood loss (mild anemia)"
      ],
      right: [
        "Uncontrolled hemorrhage after surgery or dental procedure",
        "Severe postpartum hemorrhage",
        "Gastrointestinal bleeding (melena, hematochezia)",
        "Hemarthrosis (joint bleeding -- primarily in severe Type 3)",
        "Intracranial hemorrhage (rare but life-threatening)",
        "Hypovolemic shock from uncontrolled bleeding"
      ]
    },
    medications: [
      {
        name: "Desmopressin (DDAVP)",
        type: "Synthetic vasopressin analog",
        action: "Binds to V2 receptors on vascular endothelial cells, stimulating the release of stored VWF from Weibel-Palade bodies and factor VIII from hepatic storage sites; increases plasma VWF and factor VIII levels 3-5 fold within 30-60 minutes of administration, temporarily correcting the hemostatic defect",
        sideEffects: "Facial flushing, headache, tachycardia, hyponatremia and water intoxication (due to antidiuretic effect), seizures from severe hyponatremia (especially in children), mild hypotension",
        contra: "Type 2B VWD (can worsen thrombocytopenia by releasing abnormal VWF that binds platelets), habitual polydipsia (increased hyponatremia risk), cardiovascular disease in elderly (fluid retention risk), hyponatremia",
        pearl: "Most effective for Type 1 VWD; a trial dose should be given before relying on it for surgical prophylaxis to confirm adequate VWF response; RESTRICT FLUIDS to 75% of maintenance for 24 hours after administration to prevent hyponatremia; tachyphylaxis develops after repeated doses (decreasing response with consecutive use within 48 hours)"
      },
      {
        name: "Tranexamic Acid (Cyklokapron/Lysteda)",
        type: "Antifibrinolytic agent",
        action: "Competitively inhibits the activation of plasminogen to plasmin by binding to the lysine-binding sites on plasminogen, thereby preventing fibrin degradation and stabilizing blood clots; does not form new clots but preserves clots already formed at bleeding sites",
        sideEffects: "Nausea, vomiting, diarrhea, abdominal pain, dizziness, headache; rarely thrombotic events (DVT, PE) especially in patients with prothrombotic risk factors; visual disturbances (requires eye examination if used long-term)",
        contra: "Active thromboembolic disease (DVT, PE, arterial thrombosis), subarachnoid hemorrhage, acquired defective color vision, history of seizures (high doses lower seizure threshold)",
        pearl: "Given orally (1000-1300 mg three times daily) for menorrhagia or as mouthwash (swish and spit) after dental procedures; can be combined with desmopressin for synergistic hemostatic effect; start 1 day before dental procedure and continue for 5-7 days; do NOT give concurrently with prothrombin complex concentrates (increased thrombosis risk)"
      },
      {
        name: "VWF/Factor VIII Concentrate (Humate-P)",
        type: "Plasma-derived clotting factor concentrate",
        action: "Provides exogenous VWF and factor VIII to directly replace the deficient proteins in the bloodstream; the infused VWF binds to collagen at sites of vascular injury and facilitates platelet adhesion, while the infused factor VIII participates in the intrinsic coagulation cascade to generate thrombin and fibrin for clot formation",
        sideEffects: "Allergic reactions (urticaria, pruritus, rare anaphylaxis), thrombotic complications with high doses, paresthesias, headache, slight risk of bloodborne pathogen transmission despite viral inactivation procedures",
        contra: "Known hypersensitivity to product components; use with caution in patients at risk for thromboembolic events; not needed for Type 1 VWD that responds to desmopressin",
        pearl: "Indicated for Type 2 and Type 3 VWD, and for Type 1 patients who do not respond to desmopressin; dose is calculated based on VWF ristocetin cofactor units (VWF:RCo IU/kg); administer by slow IV infusion; monitor VWF and factor VIII levels to guide dosing; keep product refrigerated until use and bring to room temperature before infusion; have epinephrine available for potential anaphylactic reactions"
      }
    ],
    pearls: [
      "Von Willebrand disease is the MOST COMMON inherited bleeding disorder -- affecting approximately 1% of the population; it affects both males and females equally (autosomal inheritance)",
      "The hallmark of VWD is MUCOCUTANEOUS bleeding: nosebleeds, heavy periods, easy bruising, gum bleeding, and prolonged bleeding from cuts -- distinguish this from hemophilia which causes joint and deep tissue bleeding",
      "Desmopressin (DDAVP) is effective for Type 1 VWD but CONTRAINDICATED in Type 2B because it releases abnormal VWF that causes spontaneous platelet aggregation and worsens thrombocytopenia",
      "RESTRICT FLUIDS when administering desmopressin -- its antidiuretic effect can cause water retention and life-threatening hyponatremia, especially dangerous in children who may develop seizures",
      "Menorrhagia is often the FIRST presenting symptom of VWD in females -- any woman with consistently heavy periods (changing pads every 1-2 hours, periods lasting more than 7 days) should be screened",
      "ALL patients with VWD must avoid aspirin and NSAIDs because these medications impair platelet function and compound the existing hemostatic defect",
      "Ensure the VWD diagnosis is clearly documented in the medical record and that the patient wears medical alert identification -- failure to pre-treat before surgery can result in life-threatening hemorrhage"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with Type 1 von Willebrand disease who is scheduled for a dental extraction. Which medication is most likely to be administered before the procedure?",
        options: [
          "Warfarin to prevent clot formation during the procedure",
          "Desmopressin (DDAVP) to temporarily increase VWF and factor VIII levels",
          "Aspirin to reduce inflammation at the extraction site",
          "Heparin to maintain catheter patency"
        ],
        correct: 1,
        rationale: "Desmopressin (DDAVP) is the first-line pre-procedural treatment for Type 1 VWD. It stimulates the release of stored VWF from endothelial cells, temporarily increasing VWF and factor VIII levels 3-5 fold to achieve hemostatic levels during and after the procedure. Aspirin and anticoagulants are contraindicated in VWD."
      },
      {
        question: "After administering desmopressin (DDAVP) to a patient with von Willebrand disease, which nursing action is most important?",
        options: [
          "Encourage the patient to drink plenty of fluids to stay hydrated",
          "Restrict fluid intake and monitor for signs of hyponatremia (headache, confusion, seizures)",
          "Administer aspirin for any headache that develops",
          "Position the patient in Trendelenburg to prevent hypotension"
        ],
        correct: 1,
        rationale: "Desmopressin has an antidiuretic effect (it is a vasopressin analog) that causes water retention. Fluid restriction to 75% of maintenance for 24 hours after administration is essential to prevent dilutional hyponatremia, which can cause headache, confusion, and potentially fatal seizures. Encouraging fluids would worsen the hyponatremia risk."
      },
      {
        question: "A female patient presents with heavy menstrual periods requiring pad changes every hour, easy bruising, and frequent nosebleeds. Her mother has similar symptoms. Which condition should the practical nurse suspect?",
        options: [
          "Hemophilia A",
          "Iron-deficiency anemia",
          "Von Willebrand disease",
          "Idiopathic thrombocytopenic purpura (ITP)"
        ],
        correct: 2,
        rationale: "The triad of menorrhagia, easy bruising, and epistaxis in a female with a family history of similar symptoms is the classic presentation of von Willebrand disease, the most common inherited bleeding disorder. Hemophilia A is X-linked and primarily affects males. ITP is acquired, not inherited. Iron-deficiency anemia is a consequence of the bleeding, not the cause."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nBatch Final 3 complete: ${injected} injected, ${skipped} skipped`);
