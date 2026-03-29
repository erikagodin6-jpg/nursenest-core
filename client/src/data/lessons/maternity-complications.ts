import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgUmbilicalCordProlapse = getAssetUrl("umbilicalcordprolapse_1773340545537.png");
const imgVaginalHematoma = getAssetUrl("vaginalhematoma_1773375165171.png");

const ectopicPregnancy: LessonContent = {
  title: "Ectopic Pregnancy",
  image: getAssetUrl("ectopicpregnancy_1773340513136.png"),
  cellular: {
    title: "Pathophysiology of Ectopic Implantation",
    content: "Ectopic pregnancy occurs when a fertilized ovum implants outside the uterine cavity, most commonly in the fallopian tube (tubal pregnancy). The extrauterine tissue cannot support normal placental development or fetal growth. As the embryo grows, it stretches the surrounding structure, eventually leading to rupture with potentially life-threatening hemorrhage. Risk factors include previous ectopic pregnancy, pelvic inflammatory disease, tubal surgery, endometriosis, IUD use, and assisted reproduction. Clinical presentation includes unilateral lower abdominal or pelvic pain, vaginal bleeding (often irregular), and amenorrhea followed by abnormal bleeding. Rupture produces sudden severe pain, signs of hypovolemic shock (tachycardia, hypotension, diaphoresis), referred shoulder pain from diaphragmatic irritation by blood in the peritoneal cavity, and peritoneal signs. A positive pregnancy test with no intrauterine gestational sac on ultrasound is a critical diagnostic clue. Serial beta-hCG levels that fail to double appropriately suggest ectopic pregnancy. This is a surgical/medical emergency requiring rapid intervention to prevent maternal death from hemorrhage."
  },
  signs: {
    left: [
      "Unilateral lower abdominal/pelvic pain",
      "Amenorrhea followed by irregular vaginal bleeding",
      "Positive pregnancy test with no intrauterine sac on ultrasound",
      "Beta-hCG levels that fail to double normally",
      "Adnexal tenderness on examination"
    ],
    right: [
      "Rupture: sudden severe pain, rebound tenderness, guarding",
      "Hypovolemic shock: tachycardia, hypotension, diaphoresis",
      "Referred shoulder pain (Kehr's sign) from peritoneal blood irritating diaphragm",
      "Internal hemorrhage: may be massive and rapidly fatal",
      "Peritonitis from blood in abdominal cavity"
    ]
  },
  medications: [
    { name: "Methotrexate", type: "Antimetabolite", action: "Terminates ectopic pregnancy by inhibiting trophoblastic cell division; used for unruptured ectopic", sideEffects: "Nausea, stomatitis, abdominal pain, transient liver enzyme elevation", contra: "Ruptured ectopic, hemodynamic instability, immunodeficiency, liver/renal disease", pearl: "Medical management only for UNRUPTURED ectopic with stable vitals and specific size/hCG criteria" }
  ],
  pearls: [
    "Positive pregnancy test + no intrauterine sac + pelvic pain = ectopic until proven otherwise",
    "Rupture is a surgical emergency: rapid hemorrhage can be fatal",
    "Referred shoulder pain (Kehr's sign) suggests peritoneal blood irritating the diaphragm",
    "Serial beta-hCG that fails to double appropriately is a key diagnostic clue",
    "Risk factors: PID history, previous ectopic, tubal surgery, IUD use",
    "Two large-bore IVs, type and cross-match, prepare for emergency surgery"
  ],
  quiz: [
    { question: "A woman at 7 weeks gestation presents with unilateral pelvic pain, vaginal spotting, and shoulder pain. What is the priority concern?", options: ["Threatened miscarriage", "Ruptured ectopic pregnancy with possible hemorrhage", "Urinary tract infection", "Round ligament pain"], correct: 1, rationale: "Unilateral pelvic pain + vaginal bleeding + shoulder pain (Kehr's sign) suggests ruptured ectopic pregnancy. Shoulder pain indicates peritoneal blood irritating the diaphragm." },
    { question: "What diagnostic finding is most suspicious for ectopic pregnancy?", options: ["Normal doubling of beta-hCG", "Positive pregnancy test with empty uterus on ultrasound", "High blood pressure", "Elevated white blood cell count"], correct: 1, rationale: "A positive pregnancy test with no intrauterine gestational sac on ultrasound strongly suggests ectopic implantation." }
  ]
};

const dicPregnancy: LessonContent = {
  title: "Disseminated Intravascular Coagulation (DIC)",
  cellular: {
    title: "Consumptive Coagulopathy Pathophysiology",
    content: "DIC in pregnancy is a life-threatening coagulation disorder characterized by widespread activation of the clotting cascade producing diffuse microvascular thrombosis, which consumes clotting factors and platelets faster than they can be replaced, leading paradoxically to simultaneous clotting AND hemorrhage. Pregnancy-specific triggers include placental abruption (most common obstetric cause), amniotic fluid embolism, retained dead fetus, severe preeclampsia/HELLP syndrome, sepsis, and massive hemorrhage. The pathophysiology involves release of tissue thromboplastin or other procoagulant substances that activate coagulation systemically. Widespread fibrin deposition causes microvascular obstruction and organ ischemia. Simultaneously, consumption of clotting factors (fibrinogen, platelets, factors V and VIII) produces hemorrhagic tendency. Laboratory findings include prolonged PT and aPTT, decreased fibrinogen, decreased platelet count, elevated D-dimer and fibrin degradation products, and fragmented red blood cells (schistocytes) on peripheral smear. Treatment focuses on addressing the underlying cause, replacing consumed blood products (FFP, platelets, cryoprecipitate for fibrinogen), and supportive care."
  },
  signs: {
    left: [
      "Simultaneous bleeding AND clotting (paradoxical)",
      "Petechiae, purpura, ecchymoses",
      "Oozing from IV sites, wounds, mucous membranes",
      "Hematuria, GI bleeding",
      "Bleeding from every puncture site"
    ],
    right: [
      "Multi-organ failure from microvascular thrombosis",
      "Renal failure from fibrin deposition in glomeruli",
      "Respiratory distress from pulmonary microthrombosis",
      "Cerebral ischemia from microvascular obstruction",
      "Massive hemorrhage with cardiovascular collapse"
    ]
  },
  medications: [
    { name: "Fresh Frozen Plasma (FFP)", type: "Blood product", action: "Replaces consumed clotting factors in DIC", sideEffects: "Fluid overload, transfusion reactions, TRALI", contra: "None absolute in life-threatening DIC", pearl: "FFP replaces ALL clotting factors: given when PT/aPTT are prolonged" },
    { name: "Cryoprecipitate", type: "Blood product", action: "Concentrated source of fibrinogen, factor VIII, and von Willebrand factor", sideEffects: "Transfusion reactions", contra: "None absolute in DIC", pearl: "Given specifically when fibrinogen levels are critically low (<100-150 mg/dL)" },
    { name: "Platelet Transfusion", type: "Blood product", action: "Replaces consumed platelets to support hemostasis", sideEffects: "Transfusion reactions, alloimmunization", contra: "HIT (relative)", pearl: "Transfuse when platelets are critically low or active hemorrhage present" }
  ],
  pearls: [
    "DIC = simultaneous clotting AND bleeding: the paradox of consumptive coagulopathy",
    "Placental abruption is the most common obstetric trigger for DIC",
    "Lab triad: low platelets + low fibrinogen + elevated D-dimer",
    "Treatment priority: address the underlying CAUSE (deliver placenta, treat sepsis)",
    "Replace consumed products: FFP for factors, cryoprecipitate for fibrinogen, platelets",
    "Oozing from every puncture site is a classic DIC presentation",
    "Monitor for organ failure from microvascular thrombosis"
  ],
  quiz: [
    { question: "What is the most common obstetric trigger for DIC?", options: ["Gestational diabetes", "Placental abruption", "Preterm labor", "Hyperemesis"], correct: 1, rationale: "Placental abruption releases tissue thromboplastin that activates the coagulation cascade systemically, making it the most common obstetric cause of DIC." },
    { question: "A postpartum patient is oozing from IV sites, has petechiae, and lab shows low platelets and fibrinogen with elevated D-dimer. What is the diagnosis?", options: ["ITP", "DIC", "Von Willebrand disease", "Liver failure"], correct: 1, rationale: "Simultaneous bleeding + low platelets + low fibrinogen + elevated D-dimer is the classic presentation of DIC." }
  ]
};

const hyperemesisGravidarum: LessonContent = {
  title: "Hyperemesis Gravidarum",
  image: getAssetUrl("hyperemesisgravidarum_1773340513136.png"),
  cellular: {
    title: "Pathophysiology of Severe Pregnancy Nausea",
    content: "Hyperemesis gravidarum is severe, persistent nausea and vomiting during pregnancy that exceeds normal morning sickness. It is characterized by weight loss exceeding 5% of pre-pregnancy weight, dehydration, electrolyte imbalances, ketonuria, and nutritional deficiency. The condition typically peaks between 8-12 weeks gestation but can persist throughout pregnancy. The exact pathophysiology is not fully understood but involves elevated beta-hCG levels, estrogen effects on the GI tract, altered gastric motility, and possible thyroid stimulation. Risk factors include molar pregnancy (markedly elevated hCG), multiple gestation, previous hyperemesis, and obesity. Complications include Wernicke encephalopathy from thiamine (B1) deficiency, Mallory-Weiss tears from forceful vomiting, metabolic alkalosis from loss of hydrochloric acid, hypokalemia, hyponatremia, and fetal growth restriction from severe malnutrition. Management includes IV fluid and electrolyte replacement, antiemetic therapy, thiamine supplementation before dextrose administration (to prevent Wernicke's), nutritional support, and in severe cases, parenteral nutrition."
  },
  signs: {
    left: [
      "Persistent, severe vomiting beyond normal morning sickness",
      "Weight loss >5% of pre-pregnancy weight",
      "Dehydration: poor skin turgor, dry mucous membranes, concentrated urine",
      "Ketonuria from starvation ketosis",
      "Peaks 8-12 weeks but can persist throughout pregnancy"
    ],
    right: [
      "Wernicke encephalopathy from thiamine (B1) deficiency",
      "Metabolic alkalosis from HCl loss through vomiting",
      "Hypokalemia and hyponatremia from fluid/electrolyte depletion",
      "Mallory-Weiss tears from forceful retching",
      "Fetal growth restriction from severe maternal malnutrition"
    ]
  },
  medications: [
    { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist antiemetic", action: "Blocks serotonin receptors in the CTZ and vagal afferents to reduce nausea/vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "QT prolongation, severe liver disease", pearl: "Commonly used for severe hyperemesis when first-line agents fail" },
    { name: "Thiamine (Vitamin B1)", type: "Water-soluble vitamin", action: "Prevents Wernicke encephalopathy in patients with prolonged vomiting and poor intake", sideEffects: "Rare at standard doses", contra: "None significant", pearl: "MUST give thiamine BEFORE dextrose-containing IV fluids to prevent precipitating Wernicke's" },
    { name: "Doxylamine/Pyridoxine", type: "Antihistamine/vitamin B6 combination", action: "First-line antiemetic for pregnancy-related nausea; doxylamine provides antihistamine effect, pyridoxine reduces nausea", sideEffects: "Drowsiness, dry mouth", contra: "MAO inhibitor use", pearl: "Considered first-line therapy for pregnancy nausea before escalating to stronger antiemetics" }
  ],
  pearls: [
    "Hyperemesis gravidarum differs from morning sickness by weight loss, dehydration, and ketonuria",
    "ALWAYS give thiamine BEFORE dextrose IV fluids to prevent Wernicke encephalopathy",
    "Metabolic alkalosis from HCl loss through persistent vomiting",
    "Molar pregnancy causes markedly elevated hCG which can worsen hyperemesis",
    "Risk factors: molar pregnancy, multiple gestation, previous hyperemesis",
    "Monitor electrolytes closely: hypokalemia and hyponatremia are common",
    "IV fluid rehydration is a cornerstone of management"
  ],
  quiz: [
    { question: "Before administering IV dextrose to a patient with hyperemesis gravidarum, what must be given first?", options: ["Ondansetron", "Thiamine (vitamin B1)", "Potassium", "Insulin"], correct: 1, rationale: "Thiamine must be given before dextrose to prevent precipitating Wernicke encephalopathy. Dextrose metabolism requires thiamine, and depleted stores can cause acute neurologic deterioration." },
    { question: "What metabolic disturbance is most characteristic of prolonged vomiting in hyperemesis?", options: ["Metabolic acidosis", "Metabolic alkalosis from loss of hydrochloric acid", "Respiratory alkalosis", "Respiratory acidosis"], correct: 1, rationale: "Persistent vomiting causes loss of hydrochloric acid (HCl), leading to metabolic alkalosis with concurrent hypokalemia and hypochloremia." }
  ]
};

const torchInfections: LessonContent = {
  title: "TORCH Infections in Pregnancy",
  cellular: {
    title: "Transplacental Infection Pathophysiology",
    content: "TORCH is an acronym for a group of infections that can cross the placenta and cause significant fetal harm: Toxoplasmosis, Other (syphilis, varicella, parvovirus B19), Rubella, Cytomegalovirus (CMV), and Herpes simplex virus (HSV). These infections share the ability to cause congenital abnormalities, growth restriction, and neonatal disease despite sometimes producing mild or no symptoms in the mother. Toxoplasmosis is transmitted through undercooked meat or cat feces and can cause hydrocephalus, intracranial calcifications, and chorioretinitis. Rubella in early pregnancy causes congenital rubella syndrome with cataracts, heart defects, and deafness: this triad is heavily tested. CMV is the most common congenital viral infection and can cause hearing loss, developmental delay, and hepatosplenomegaly. HSV transmission typically occurs during vaginal delivery through an active lesion, causing neonatal herpes with high mortality. Syphilis causes congenital syphilis with multi-organ involvement. The timing of maternal infection relative to gestational age critically determines severity: first trimester infections generally cause the most severe fetal effects."
  },
  signs: {
    left: [
      "Maternal infection may be mild or asymptomatic",
      "Routine prenatal screening includes rubella immunity and syphilis testing",
      "First trimester infections cause most severe fetal effects",
      "CMV is the most common congenital viral infection",
      "Cat litter avoidance for toxoplasmosis prevention"
    ],
    right: [
      "Congenital rubella syndrome: cataracts + heart defects + deafness (classic triad)",
      "Toxoplasmosis: hydrocephalus, intracranial calcifications, chorioretinitis",
      "CMV: hearing loss, developmental delay, hepatosplenomegaly",
      "Neonatal herpes: vesicular lesions, encephalitis, high mortality",
      "Congenital syphilis: multi-organ involvement, snuffles, rash, bone changes"
    ]
  },
  medications: [
    { name: "Acyclovir/Valacyclovir", type: "Antiviral", action: "Suppresses HSV replication; given near term to reduce viral shedding and risk of neonatal transmission", sideEffects: "Nausea, headache, renal toxicity at high doses", contra: "Renal impairment requires dose adjustment", pearl: "Active genital herpes at delivery → cesarean section to prevent neonatal transmission" },
    { name: "Penicillin G", type: "Antibiotic", action: "Only proven treatment for syphilis in pregnancy; treats maternal infection and prevents congenital syphilis", sideEffects: "Allergic reactions, Jarisch-Herxheimer reaction (treatment-induced inflammatory response)", contra: "True penicillin allergy (desensitization may be done)", pearl: "Penicillin is the ONLY acceptable treatment for syphilis in pregnancy: no alternatives" }
  ],
  pearls: [
    "TORCH = Toxoplasmosis, Other, Rubella, CMV, Herpes: all cross the placenta",
    "Congenital rubella triad: cataracts + heart defects + deafness: extremely high-yield",
    "CMV is the MOST COMMON congenital viral infection",
    "Active genital herpes at delivery → cesarean section to prevent neonatal herpes",
    "Penicillin is the ONLY treatment for syphilis in pregnancy: no substitutions",
    "Prevention: rubella vaccination before pregnancy, avoid cat litter, safe food handling",
    "First trimester infections generally cause the most severe congenital effects"
  ],
  quiz: [
    { question: "What is the classic triad of congenital rubella syndrome?", options: ["Jaundice, hepatomegaly, anemia", "Cataracts, congenital heart defects, and sensorineural deafness", "Hydrocephalus, seizures, rash", "Microcephaly, limb defects, GI malformation"], correct: 1, rationale: "Congenital rubella syndrome classically presents with cataracts, congenital heart defects, and sensorineural deafness: one of the most tested congenital infection triads." },
    { question: "A pregnant woman with active genital herpes lesions is in labor. What is the recommended delivery method?", options: ["Vaginal delivery with antiviral cream", "Cesarean section to prevent neonatal herpes transmission", "Induced vaginal delivery", "Wait for lesions to resolve"], correct: 1, rationale: "Active genital herpes lesions at delivery carry high risk of neonatal transmission during vaginal birth. Cesarean delivery is recommended." }
  ]
};

const chorioamnionitis: LessonContent = {
  title: "Chorioamnionitis (Intraamniotic Infection)",
  cellular: {
    title: "Infection Pathophysiology",
    content: "Chorioamnionitis is an acute infection of the amniotic membranes and fluid, typically caused by ascending polymicrobial infection from the lower genital tract. The most significant risk factor is prolonged rupture of membranes (PROM), as the protective barrier between the sterile intrauterine environment and vaginal flora is compromised. Other risk factors include multiple vaginal examinations during labor, internal fetal monitoring, preterm labor, and GBS colonization. The infection triggers an inflammatory cascade producing maternal fever (often the earliest clinical sign), maternal and fetal tachycardia, uterine tenderness, purulent or foul-smelling amniotic fluid, and elevated white blood cell count. Fetal effects include tachycardia, sepsis, pneumonia, and neurologic injury. The primary treatment is prompt antibiotic administration and delivery: antibiotics should NOT be delayed while awaiting culture results or delivery. Intrapartum antibiotics significantly reduce neonatal sepsis risk. Post-delivery monitoring of the neonate for signs of infection is essential."
  },
  signs: {
    left: [
      "Maternal fever (often earliest sign)",
      "Maternal tachycardia",
      "Fetal tachycardia",
      "Uterine tenderness",
      "Purulent or foul-smelling amniotic fluid"
    ],
    right: [
      "Neonatal sepsis from vertical transmission",
      "Neonatal pneumonia",
      "Preterm delivery",
      "Postpartum endometritis",
      "Neurologic injury to the fetus from inflammation"
    ]
  },
  medications: [
    { name: "Ampicillin + Gentamicin", type: "Combination antibiotic", action: "Broad-spectrum coverage for polymicrobial intraamniotic infection; standard first-line regimen", sideEffects: "Ampicillin: allergic reactions; Gentamicin: nephrotoxicity, ototoxicity", contra: "Penicillin allergy (use alternatives)", pearl: "Do NOT delay antibiotics: administer promptly upon diagnosis and plan for delivery" }
  ],
  pearls: [
    "Prolonged rupture of membranes is the most significant risk factor",
    "Maternal fever is often the earliest clinical sign",
    "Do NOT delay antibiotics: prompt administration reduces neonatal sepsis risk",
    "Delivery is the definitive treatment: antibiotics buy time but do not replace delivery",
    "Monitor neonate closely post-delivery for signs of infection",
    "Fetal tachycardia may be the first sign of fetal compromise from infection"
  ],
  quiz: [
    { question: "What is the most significant risk factor for chorioamnionitis?", options: ["Gestational diabetes", "Prolonged rupture of membranes", "Advanced maternal age", "Multiparity"], correct: 1, rationale: "Prolonged rupture of membranes compromises the barrier between the sterile intrauterine environment and vaginal flora, allowing ascending infection." },
    { question: "A laboring patient develops fever, tachycardia, and foul-smelling amniotic fluid. What is the priority intervention?", options: ["Wait for culture results", "Administer antibiotics promptly and plan for delivery", "Increase IV fluids only", "Apply ice packs for fever"], correct: 1, rationale: "Chorioamnionitis requires prompt antibiotic administration: do not delay for culture results. Delivery is the definitive treatment." }
  ]
};

const multipleGestation: LessonContent = {
  title: "Multiple Gestation",
  cellular: {
    title: "Physiologic Demands & Complications",
    content: "Multiple gestation (twins, triplets, or higher-order multiples) significantly increases physiologic demands on the maternal system and carries higher risk for both maternal and fetal complications. Maternal blood volume expands more than in singleton pregnancy, increasing cardiac workload, iron requirements, and caloric needs. The overdistended uterus increases risk for preterm labor, preterm rupture of membranes, and postpartum hemorrhage from uterine atony. Maternal complications include gestational hypertension/preeclampsia (significantly higher risk), gestational diabetes, anemia, polyhydramnios, and placental abnormalities. Fetal complications include preterm birth (the most common and significant complication), intrauterine growth restriction (especially in monochorionic twins who share a placenta), twin-to-twin transfusion syndrome (TTTS) in monochorionic twins, malpresentation, cord complications, and higher neonatal morbidity. Monitoring requires more frequent prenatal visits, serial ultrasounds for growth assessment, cervical length monitoring, and careful nutritional counseling with increased caloric and micronutrient needs."
  },
  signs: {
    left: [
      "Uterus large for gestational age",
      "Increased caloric and nutritional requirements",
      "More frequent prenatal monitoring needed",
      "Higher weight gain expectations",
      "Greater blood volume expansion"
    ],
    right: [
      "Preterm labor: most common and significant complication",
      "Preeclampsia: significantly higher risk",
      "Postpartum hemorrhage from uterine overdistension/atony",
      "Twin-to-twin transfusion syndrome (TTTS) in monochorionic twins",
      "Intrauterine growth restriction"
    ]
  },
  medications: [
    { name: "Betamethasone", type: "Corticosteroid", action: "Accelerates fetal lung maturation when preterm delivery is anticipated", sideEffects: "Maternal hyperglycemia, infection risk", contra: "Active systemic infection", pearl: "Given when preterm delivery is anticipated between 24-34 weeks: particularly important in multiple gestation due to high preterm risk" }
  ],
  pearls: [
    "Preterm birth is the most common and significant complication of multiple gestation",
    "Preeclampsia risk is significantly higher with multiples",
    "Uterine overdistension increases postpartum hemorrhage risk (atony)",
    "Monochorionic twins share a placenta: risk for twin-to-twin transfusion syndrome",
    "Increased caloric, iron, and folate requirements compared to singleton pregnancy",
    "More frequent prenatal visits and serial growth ultrasounds required",
    "Cervical length monitoring for preterm labor risk assessment"
  ],
  quiz: [
    { question: "What is the most common and significant complication of multiple gestation?", options: ["Gestational diabetes", "Preterm birth", "Placenta previa", "Hyperemesis"], correct: 1, rationale: "Preterm birth is the most common and significant complication of multiple gestation, resulting from uterine overdistension and the physiologic demands of supporting multiple fetuses." },
    { question: "What complication is unique to monochorionic twins?", options: ["Preeclampsia", "Twin-to-twin transfusion syndrome (TTTS)", "Gestational diabetes", "Shoulder dystocia"], correct: 1, rationale: "TTTS occurs exclusively in monochorionic twins who share a placenta. Unequal blood flow through placental vascular connections causes one twin to receive too much blood and the other too little." }
  ]
};

const placentalAbnormalities: LessonContent = {
  title: "Placental Abnormalities",
  cellular: {
    title: "Abnormal Placentation Pathophysiology",
    content: "Placental abnormalities encompass conditions where the placenta develops or implants abnormally, creating significant maternal and fetal risks. Placenta previa occurs when the placenta implants over or near the cervical os, causing painless bright red vaginal bleeding as the cervix dilates or effaces. Placental abruption (abruptio placentae) is premature separation of a normally implanted placenta, causing painful dark red bleeding, rigid board-like uterus, and potential fetal distress. Placenta accreta spectrum disorders (accreta, increta, percreta) involve abnormally invasive placental attachment to or through the uterine wall, preventing normal separation at delivery and causing massive hemorrhage. Risk factors for accreta spectrum include previous cesarean delivery and placenta previa. Vasa previa occurs when fetal blood vessels cross the cervical os unprotected by placental tissue: rupture of these vessels during labor causes fetal hemorrhage and rapid fetal death. The key clinical distinction between previa and abruption is: previa = painless bright red bleeding; abruption = painful dark red bleeding with rigid uterus."
  },
  signs: {
    left: [
      "Placenta previa: painless, bright red vaginal bleeding",
      "Abruption: painful, dark red bleeding, rigid board-like uterus",
      "Accreta: failure of placenta to separate after delivery",
      "Vasa previa: fetal vessel rupture with membrane rupture",
      "Risk factors: previous cesarean, previous uterine surgery"
    ],
    right: [
      "Previa: hemorrhage requiring cesarean delivery",
      "Abruption: DIC, fetal distress, fetal death",
      "Accreta spectrum: massive hemorrhage, may require hysterectomy",
      "Vasa previa: rapid fetal exsanguination if undiagnosed",
      "All forms: maternal shock, organ failure, death without intervention"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Promotes uterine contraction to control postpartum hemorrhage from placental site bleeding", sideEffects: "Water intoxication, uterine tetany, hypotension", contra: "Before delivery of placenta previa (do not stimulate contractions)", pearl: "First-line uterotonic for postpartum hemorrhage management" },
    { name: "Rh Immune Globulin (RhoGAM)", type: "Immunoglobulin", action: "Prevents Rh sensitization in Rh-negative mothers experiencing bleeding", sideEffects: "Injection site pain, mild fever", contra: "Rh-positive mother", pearl: "Administer to Rh-negative mothers with ANY pregnancy bleeding to prevent isoimmunization" }
  ],
  pearls: [
    "Previa = PAINLESS bright red bleeding; Abruption = PAINFUL dark red + rigid uterus",
    "NEVER perform a vaginal exam with known or suspected placenta previa",
    "Placental abruption is the most common obstetric cause of DIC",
    "Previous cesarean + placenta previa = high risk for placenta accreta",
    "Vasa previa: fetal vessel rupture at membrane rupture → rapid fetal death",
    "Accreta spectrum may require planned cesarean hysterectomy",
    "Rh-negative mothers with ANY bleeding need Rh immune globulin"
  ],
  quiz: [
    { question: "A patient at 32 weeks presents with painless, bright red vaginal bleeding. What is the most likely diagnosis?", options: ["Placental abruption", "Placenta previa", "Cervical dilation", "UTI"], correct: 1, rationale: "Painless bright red bleeding is the hallmark of placenta previa. Abruption presents with painful dark bleeding and uterine rigidity." },
    { question: "Why is vaginal examination contraindicated in suspected placenta previa?", options: ["It causes pain", "It may disrupt the placenta and cause massive hemorrhage", "It is inaccurate", "It increases infection risk"], correct: 1, rationale: "Vaginal examination with placenta previa may disturb the low-lying placenta and trigger catastrophic hemorrhage." }
  ]
};

const pregnancySTIs: LessonContent = {
  title: "Sexually Transmitted Infections in Pregnancy",
  cellular: {
    title: "Vertical Transmission & Fetal Effects",
    content: "Sexually transmitted infections during pregnancy pose unique risks due to potential vertical transmission to the fetus or neonate. Syphilis (Treponema pallidum) crosses the placenta and causes congenital syphilis with multi-organ involvement including characteristic snuffles (nasal discharge), rash, bone abnormalities (Hutchinson's teeth, saddle nose), hepatosplenomegaly, and neurologic damage. Screening is mandatory at first prenatal visit and penicillin G is the ONLY acceptable treatment. Chlamydia (Chlamydia trachomatis) is the most common bacterial STI and can cause neonatal conjunctivitis (ophthalmia neonatorum) and pneumonia through birth canal transmission. Treatment is azithromycin. Gonorrhea (Neisseria gonorrhoeae) can cause ophthalmia neonatorum leading to blindness: prophylactic erythromycin eye ointment is applied to all newborns. HIV requires antiretroviral therapy during pregnancy, scheduled cesarean if viral load is high, avoidance of breastfeeding, and neonatal prophylaxis. Hepatitis B screening is universal; positive mothers require neonatal Hep B vaccine + HBIG within 12 hours of birth. Trichomoniasis is treated with metronidazole to reduce preterm birth risk."
  },
  signs: {
    left: [
      "Many STIs are asymptomatic in pregnancy: screening is essential",
      "Universal prenatal screening: syphilis, HIV, hepatitis B, chlamydia, gonorrhea",
      "Vaginal discharge changes may indicate infection",
      "Partner treatment is essential to prevent reinfection",
      "Test of cure recommended after treatment for some STIs"
    ],
    right: [
      "Congenital syphilis: snuffles, rash, bone changes, hepatosplenomegaly",
      "Ophthalmia neonatorum from chlamydia/gonorrhea: can cause blindness",
      "Neonatal herpes: vesicular lesions, encephalitis, high mortality",
      "HIV vertical transmission without treatment",
      "Hepatitis B chronic carrier state in neonate without prophylaxis"
    ]
  },
  medications: [
    { name: "Penicillin G (Benzathine)", type: "Antibiotic", action: "Only acceptable treatment for syphilis in pregnancy: no alternatives", sideEffects: "Allergic reactions, Jarisch-Herxheimer reaction", contra: "True allergy (desensitization required)", pearl: "There is NO substitute for penicillin in treating syphilis during pregnancy" },
    { name: "Azithromycin", type: "Macrolide antibiotic", action: "Treats chlamydia infection in pregnancy; safe alternative to doxycycline", sideEffects: "GI upset, nausea", contra: "Severe hepatic impairment", pearl: "Doxycycline is contraindicated in pregnancy: azithromycin is the standard" },
    { name: "Erythromycin Eye Ointment", type: "Ophthalmic antibiotic", action: "Prophylaxis against ophthalmia neonatorum from gonorrhea and chlamydia", sideEffects: "Mild eye irritation", contra: "None significant", pearl: "Applied to ALL newborns within 1 hour of birth regardless of maternal STI status" }
  ],
  pearls: [
    "Penicillin is the ONLY treatment for syphilis in pregnancy: no alternatives exist",
    "Erythromycin eye ointment is applied to ALL newborns for ophthalmia neonatorum prophylaxis",
    "Hepatitis B positive mother → neonate gets Hep B vaccine + HBIG within 12 hours of birth",
    "HIV-positive mothers: antiretroviral therapy, possible cesarean, NO breastfeeding",
    "Chlamydia treatment: azithromycin (doxycycline is contraindicated in pregnancy)",
    "Many STIs are asymptomatic: universal prenatal screening is essential",
    "Partner treatment prevents reinfection"
  ],
  quiz: [
    { question: "A pregnant patient tests positive for syphilis. She reports a penicillin allergy. What is the appropriate approach?", options: ["Use azithromycin instead", "Use doxycycline instead", "Penicillin desensitization followed by treatment: no alternative exists", "Defer treatment until postpartum"], correct: 2, rationale: "Penicillin is the ONLY acceptable treatment for syphilis in pregnancy. If the patient is allergic, desensitization must be performed. No alternative antibiotic is adequate." },
    { question: "When should erythromycin eye ointment be applied to a newborn?", options: ["Only if mother has STI", "Within 1 hour of birth to ALL newborns", "At the 2-week well-baby visit", "Only if signs of infection appear"], correct: 1, rationale: "Prophylactic erythromycin eye ointment is applied to ALL newborns within 1 hour of birth to prevent ophthalmia neonatorum, regardless of maternal STI status." }
  ]
};

const uterineRupture: LessonContent = {
  title: "Uterine Rupture",
  cellular: {
    title: "Pathophysiology of Uterine Wall Disruption",
    content: "Uterine rupture is a catastrophic obstetric emergency involving a tear through the uterine wall during labor or delivery. It most commonly occurs along a previous cesarean section scar (classical vertical scars carry higher risk than low transverse scars). The disruption of the uterine wall allows hemorrhage into the peritoneal cavity and may result in fetal extrusion into the abdominal cavity with rapid fetal compromise. Risk factors include previous uterine surgery (cesarean, myomectomy), uterine overdistension, excessive oxytocin use, obstructed labor, grand multiparity, and uterine anomalies. Clinical presentation includes sudden severe abdominal pain (often described as a tearing or ripping sensation), cessation of contractions, loss of fetal station (fetus moves up in birth canal), abnormal fetal heart rate patterns (typically prolonged bradycardia), and signs of hemorrhagic shock. This is a surgical emergency requiring immediate cesarean delivery and uterine repair or hysterectomy."
  },
  signs: {
    left: [
      "Sudden severe tearing abdominal pain",
      "Cessation of contractions",
      "Loss of fetal station (fetus palpable in abdomen)",
      "Change in uterine contour",
      "Vaginal bleeding (may be minimal if blood is intra-abdominal)"
    ],
    right: [
      "Fetal bradycardia: often the first sign on monitor",
      "Maternal hemorrhagic shock: tachycardia, hypotension",
      "Fetal death if not delivered immediately",
      "Maternal death from uncontrolled hemorrhage",
      "Need for hysterectomy if uterus cannot be repaired"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Used postoperatively to maintain uterine tone after repair", sideEffects: "Hypotension, water intoxication", contra: "Excessive use during labor increases rupture risk", pearl: "Excessive oxytocin augmentation is a risk factor FOR rupture: titrate carefully especially with prior uterine scars" }
  ],
  pearls: [
    "Previous cesarean scar is the most common risk factor: classical (vertical) scars carry highest risk",
    "Sudden severe pain + cessation of contractions + fetal bradycardia = suspect rupture",
    "Fetal bradycardia is often the FIRST sign detected on fetal monitoring",
    "Loss of fetal station (fetus moves up) is a hallmark sign",
    "This is a surgical emergency: immediate cesarean delivery required",
    "Excessive oxytocin use increases uterine rupture risk in scarred uteri",
    "Trial of labor after cesarean (TOLAC) requires careful risk-benefit assessment"
  ],
  quiz: [
    { question: "A patient with a previous cesarean section suddenly experiences severe abdominal pain, loss of contractions, and fetal bradycardia. What is the priority concern?", options: ["Placental abruption", "Uterine rupture requiring emergency delivery", "Normal labor progression", "Braxton-Hicks contractions"], correct: 1, rationale: "Sudden pain + cessation of contractions + fetal bradycardia in a patient with a uterine scar is the classic presentation of uterine rupture: a surgical emergency." },
    { question: "Which type of prior uterine incision carries the highest risk for rupture during subsequent labor?", options: ["Low transverse", "Classical (vertical)", "J-incision", "All carry equal risk"], correct: 1, rationale: "Classical (vertical) cesarean incisions involve the muscular upper uterine segment, which contracts most forcefully during labor, carrying significantly higher rupture risk than low transverse incisions." }
  ]
};

const uterineInversion: LessonContent = {
  title: "Uterine Inversion",
  cellular: {
    title: "Mechanism & Pathophysiology",
    content: "Uterine inversion occurs when the uterine fundus collapses inward, partially or completely turning inside out through the cervix. This is a rare but life-threatening obstetric emergency. The mechanism involves loss of normal fundal support combined with downward forces: most commonly caused by excessive traction on the umbilical cord before placental separation, fundal pressure (Credé maneuver) with a relaxed uterus, or spontaneous inversion with short umbilical cord. Risk factors include fundal placental implantation, uterine atony, rapid labor, excessive cord traction, and connective tissue disorders. Classification by degree: first degree (fundus reaches but does not pass through cervix), second degree (fundus protrudes through cervix into vagina), and third degree (complete inversion: uterus visible outside the introitus). Clinical presentation includes sudden severe pelvic pain, a mass visible or palpable in the vagina, absence of the uterine fundus on abdominal palpation, profound hemorrhage, and rapid onset of neurogenic and hypovolemic shock. Treatment involves immediate manual replacement of the uterus (Johnson maneuver), uterine relaxation with terbutaline or general anesthesia, and aggressive fluid/blood replacement."
  },
  signs: {
    left: [
      "Sudden severe pelvic pain after delivery",
      "Mass visible or palpable in vagina",
      "Absence of uterine fundus on abdominal palpation",
      "Excessive vaginal bleeding",
      "Often occurs during third stage of labor"
    ],
    right: [
      "Neurogenic shock from vagal stimulation (bradycardia, hypotension)",
      "Hypovolemic shock from hemorrhage",
      "Cardiovascular collapse without rapid intervention",
      "Need for emergency surgery if manual replacement fails",
      "Maternal death from uncontrolled shock"
    ]
  },
  medications: [
    { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes uterine smooth muscle to facilitate manual replacement of inverted uterus", sideEffects: "Tachycardia, tremor, hypokalemia", contra: "Cardiac disease", pearl: "Uterine relaxation is essential BEFORE attempting manual replacement" },
    { name: "Oxytocin (After Replacement)", type: "Uterotonic", action: "Contracts uterus AFTER successful replacement to maintain position and control bleeding", sideEffects: "Hypotension, cramping", contra: "Before replacement (would worsen inversion)", pearl: "Do NOT give oxytocin BEFORE replacement: it contracts the cervix around the inverted uterus making replacement impossible" }
  ],
  pearls: [
    "Do NOT apply excessive cord traction before placental separation",
    "Absence of fundus on abdominal palpation is a key diagnostic finding",
    "Neurogenic shock (vagal) occurs in addition to hypovolemic shock",
    "Relax the uterus FIRST (terbutaline), then manually replace (Johnson maneuver)",
    "Do NOT give oxytocin BEFORE replacement: it worsens the condition",
    "Oxytocin is given AFTER successful replacement to maintain tone",
    "Two large-bore IVs, rapid fluid resuscitation, type and cross-match immediately"
  ],
  quiz: [
    { question: "After delivery of the placenta, a nurse cannot palpate the uterine fundus abdominally and sees a mass protruding from the vagina. What is the most likely diagnosis?", options: ["Cervical laceration", "Uterine inversion", "Uterine atony", "Prolapsed cord"], correct: 1, rationale: "Absence of the uterine fundus on abdominal palpation with a vaginal mass is the classic finding of uterine inversion." },
    { question: "In uterine inversion, why should oxytocin NOT be given before replacement?", options: ["It causes nausea", "It contracts the cervix around the inverted uterus, making manual replacement impossible", "It raises blood pressure", "It has no effect in this situation"], correct: 1, rationale: "Oxytocin causes uterine contraction, which would tighten the cervix around the inverted fundus. The uterus must first be relaxed (with terbutaline) before manual replacement." }
  ]
};

const antenatalTesting: LessonContent = {
  title: "Antenatal Diagnostic Testing",
  cellular: {
    title: "Fetal Assessment Methods & Clinical Reasoning",
    content: "Antenatal diagnostic testing encompasses a range of assessments used to evaluate fetal well-being, detect abnormalities, and guide pregnancy management. The Nonstress Test (NST) monitors fetal heart rate response to fetal movement: a reactive NST shows accelerations with movement, indicating adequate fetal oxygenation. Non-reactive results require further evaluation. Kick counts (fetal movement monitoring) are a simple maternal assessment where decreased fetal movement may indicate fetal compromise. The Fern test detects amniotic fluid by examining cervical fluid under microscopy for a ferning (crystallization) pattern, confirming rupture of membranes. The Nitrazine test detects amniotic fluid by pH: amniotic fluid is alkaline (pH 7.0-7.5) compared to normal vaginal secretions (pH 4.5-6.0), turning Nitrazine paper blue. Fetal fibronectin (fFN) testing assesses preterm labor risk: a negative result is highly predictive that delivery will NOT occur within 7-14 days. Chorionic villus sampling (CVS) obtains placental tissue at 10-13 weeks for chromosomal analysis. Amniocentesis obtains amniotic fluid (typically 15-20 weeks) for genetic testing and fetal lung maturity assessment. Noninvasive prenatal testing (NIPT) analyzes cell-free fetal DNA in maternal blood for chromosomal abnormalities."
  },
  signs: {
    left: [
      "NST reactive: accelerations with fetal movement = reassuring",
      "NST non-reactive: further evaluation needed (BPP, CST)",
      "Decreased fetal movement (kick counts) = evaluate immediately",
      "Fern test positive: amniotic fluid confirmed on microscopy",
      "Nitrazine positive (blue): alkaline pH suggests amniotic fluid"
    ],
    right: [
      "Non-reactive NST may indicate fetal hypoxia or sleep cycle",
      "False-positive Nitrazine: blood, semen, BV can also be alkaline",
      "CVS risk: miscarriage (~1%), limb defects if done too early",
      "Amniocentesis risk: miscarriage (<1%), infection, preterm labor",
      "Fetal fibronectin negative = >95% will NOT deliver within 2 weeks"
    ]
  },
  medications: [],
  pearls: [
    "NST: reactive = reassuring (accelerations present); non-reactive = needs further evaluation",
    "Decreased fetal movement is an early warning sign: evaluate immediately",
    "Nitrazine turns BLUE with amniotic fluid (alkaline pH): false positives possible with blood/semen",
    "Fern test: amniotic fluid forms crystal/fern pattern under microscopy",
    "Negative fetal fibronectin is highly predictive that preterm delivery will NOT occur within 2 weeks",
    "NIPT screens for chromosomal abnormalities using cell-free fetal DNA: non-invasive",
    "CVS (10-13 weeks) and amniocentesis (15-20 weeks) are diagnostic, not just screening",
    "After amniocentesis: monitor for cramping, leaking fluid, decreased fetal movement"
  ],
  quiz: [
    { question: "What does a reactive nonstress test indicate?", options: ["Fetal distress", "Adequate fetal oxygenation with heart rate accelerations in response to movement", "Need for immediate delivery", "Maternal hypertension"], correct: 1, rationale: "A reactive NST shows fetal heart rate accelerations with movement, indicating adequate oxygenation and a healthy fetal nervous system response." },
    { question: "Nitrazine paper turns blue when exposed to cervical fluid. What does this suggest?", options: ["Vaginal infection", "Presence of amniotic fluid (alkaline pH) suggesting rupture of membranes", "Normal vaginal secretions", "Presence of blood only"], correct: 1, rationale: "Amniotic fluid is alkaline (pH 7.0-7.5), turning Nitrazine paper blue. This suggests rupture of membranes, though false positives are possible with blood, semen, or BV." },
    { question: "A negative fetal fibronectin test at 26 weeks in a patient with contractions indicates what?", options: ["Definite preterm labor", "Greater than 95% likelihood that delivery will NOT occur within 2 weeks", "Need for immediate tocolytics", "Cervical incompetence"], correct: 1, rationale: "Negative fetal fibronectin has high negative predictive value: over 95% of patients will NOT deliver within 7-14 days. This helps avoid unnecessary interventions." }
  ]
};

const vaginalHematomaRpn: LessonContent = {
  title: "Vaginal/Vulvar Hematoma",
  image: imgVaginalHematoma,
  cellular: {
    title: "Understanding Postpartum Hematoma Formation",
    content: "A vaginal or vulvar hematoma is a collection of blood within the soft tissues of the perineum, vagina, or vulva that develops when blood vessels are damaged during vaginal delivery. The blood accumulates in the loose connective tissue, producing visible or palpable swelling, severe pain disproportionate to the apparent injury, and discoloration. Hematomas may form even without visible lacerations when deeper vessels rupture beneath intact skin or mucosa. Predisposing factors include instrumental delivery (forceps or vacuum), episiotomy, prolonged second stage of labor, precipitous delivery, first vaginal delivery, and pre-existing coagulopathy. The nursing role focuses on vigilant postpartum monitoring, early recognition, comfort measures, and prompt reporting of findings to the healthcare team."
  },
  signs: {
    left: [
      "Severe perineal or vaginal pain disproportionate to apparent injury",
      "Visible swelling or bulging mass in the perineum or vulva",
      "Ecchymosis (bruising) of perineal tissues",
      "Pressure sensation in the rectum or vagina",
      "Difficulty voiding due to urethral compression"
    ],
    right: [
      "Expanding hematoma: increasing swelling, worsening pain, tense mass",
      "Tachycardia out of proportion to blood loss seen externally",
      "Hypotension suggesting concealed hemorrhage",
      "Restlessness and anxiety (early sign of hemodynamic compromise)",
      "Pallor and diaphoresis indicating significant blood loss"
    ]
  },
  medications: [
    { name: "Ice Application", type: "Non-pharmacological", action: "Reduces swelling and provides pain relief through vasoconstriction and reduced nerve conduction in the first 24 hours postpartum", sideEffects: "Skin irritation if applied directly without barrier", contra: "Do not apply directly to skin; use cloth barrier; limit to 20 minutes on/20 minutes off", pearl: "Ice is most effective in the first 12-24 hours for small, stable hematomas" },
    { name: "Analgesics (Acetaminophen/Ibuprofen)", type: "Pain management", action: "Provides pain relief for stable hematomas managed conservatively", sideEffects: "Ibuprofen: GI irritation; Acetaminophen: hepatotoxicity at high doses", contra: "Ibuprofen caution if bleeding risk; acetaminophen caution in liver disease", pearl: "Adequate pain control helps the patient mobilize and void, which are important postpartum goals" }
  ],
  pearls: [
    "Severe perineal pain disproportionate to visible injury is the hallmark sign of hematoma",
    "Monitor vital signs frequently: tachycardia may be the first sign of expanding hematoma",
    "Report any increasing swelling, worsening pain, or hemodynamic changes immediately",
    "Apply ice packs with a barrier for 20 minutes on/20 minutes off in the first 24 hours",
    "Monitor urine output: hematoma can compress the urethra causing urinary retention",
    "Document size of swelling, color changes, and patient comfort level at each assessment"
  ],
  quiz: [
    { question: "A postpartum patient reports severe perineal pain that seems worse than expected. The nurse observes a tense, swollen mass on the vulva. What is the priority action?", options: ["Apply ice and reassess in 2 hours", "Report findings to the healthcare provider immediately and continue monitoring vital signs", "Administer ibuprofen and document", "Encourage ambulation"], correct: 1, rationale: "A tense, swollen mass with severe pain suggests a hematoma that may be expanding. The priority is to report to the provider for evaluation while continuing to monitor vital signs for hemodynamic compromise." },
    { question: "What is the most characteristic finding of a postpartum vaginal hematoma?", options: ["Bright red vaginal bleeding", "Severe pain disproportionate to visible perineal injury", "Elevated temperature", "Foul-smelling lochia"], correct: 1, rationale: "Pain disproportionate to the apparent injury is the hallmark sign of a hematoma. The blood collects internally, so external bleeding may be minimal while pain is severe." }
  ]
};

const vaginalHematoma: LessonContent = {
  title: "Vaginal Hematoma - Pathophysiology",
  image: imgVaginalHematoma,
  cellular: {
    title: "Vascular Injury and Hematoma Classification",
    content: "Vaginal and vulvar hematomas result from vascular injury during the birth process, with blood accumulating in the loose areolar connective tissue of the perineum, paravaginal space, or retroperitoneal area. Classification is clinically important: vulvar hematomas are the most common and visible, presenting as unilateral labial swelling below the pelvic diaphragm; vaginal hematomas form above the pelvic diaphragm in the paravaginal or ischiorectal space and may not be visible externally; retroperitoneal hematomas are the most dangerous, extending into the broad ligament or retroperitoneal space with potential for massive concealed hemorrhage. The distinction between arterial and venous hematomas affects clinical presentation: arterial hematomas expand rapidly, present early (within the first few hours postpartum), and are more likely to require surgical intervention, while venous hematomas expand more slowly and may present later (6-24 hours postpartum). The rich blood supply of the pelvic floor - including branches of the internal iliac artery (pudendal, inferior vesical, middle rectal arteries) - means that hematomas can accumulate large volumes of blood before becoming clinically apparent. Risk factors include operative vaginal delivery, episiotomy (especially mediolateral), nulliparity, prolonged second stage, macrosomia, and coagulation disorders. Assessment requires systematic evaluation including visual inspection, palpation, hemodynamic monitoring, and serial assessments to detect expansion. Surgical evacuation is indicated for hematomas that are large (>3-4 cm), rapidly expanding, causing hemodynamic instability, or causing urinary retention or severe uncontrolled pain."
  },
  signs: {
    left: [
      "Severe perineal/vaginal pain disproportionate to visible injury",
      "Unilateral vulvar swelling with tense, discolored mass",
      "Rectal pressure or sensation of fullness",
      "Urinary retention from urethral compression",
      "Vaginal hematoma may present as bulging vaginal wall mass on examination"
    ],
    right: [
      "Arterial hematoma: rapid expansion within 1-2 hours, bright discoloration",
      "Venous hematoma: slower expansion over 6-24 hours",
      "Retroperitoneal hematoma: flank pain, abdominal distension, concealed hemorrhage",
      "Hemodynamic instability: tachycardia, hypotension, decreased urine output",
      "Hypovolemic shock if large volume blood loss (may exceed 500 mL without visible bleeding)"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Promotes uterine contraction to reduce ongoing uterine bleeding; does not directly treat hematoma but manages concurrent atony", sideEffects: "Water intoxication with prolonged high-dose infusion, nausea", contra: "Hypersensitivity", pearl: "Used as part of postpartum hemorrhage management if uterine atony coexists with hematoma" },
    { name: "Tranexamic Acid", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, stabilizing clot formation and reducing bleeding", sideEffects: "Nausea, diarrhea, thromboembolic events (rare)", contra: "Active thromboembolic disease, subarachnoid hemorrhage", pearl: "May be considered as adjunct therapy for postpartum hemorrhage associated with hematoma formation" },
    { name: "Broad-Spectrum Antibiotics", type: "Antimicrobial prophylaxis", action: "Prevent infection of evacuated hematoma cavity; given perioperatively if surgical drainage is performed", sideEffects: "Varies by agent", contra: "Known allergy to specific antibiotic class", pearl: "Hematoma cavities are an excellent medium for bacterial growth; prophylactic antibiotics are standard with surgical evacuation" }
  ],
  pearls: [
    "Classify hematomas by location: vulvar (below pelvic diaphragm), vaginal (above), retroperitoneal (most dangerous)",
    "Arterial hematomas expand rapidly and present early; venous hematomas are slower and present later",
    "Pain disproportionate to visible injury is the hallmark: always palpate if the patient reports severe perineal pain",
    "Surgical evacuation criteria: >3-4 cm, rapid expansion, hemodynamic instability, urinary retention, uncontrolled pain",
    "Retroperitoneal hematomas may present with flank pain and shock without visible perineal swelling",
    "Serial assessments are essential: mark hematoma borders with a skin marker to track expansion",
    "Two large-bore IVs, type and crossmatch, and prepare for possible surgical intervention"
  ],
  quiz: [
    { question: "A postpartum patient had a forceps-assisted delivery. Four hours later she reports worsening perineal pain and rectal pressure. Examination reveals a 5 cm tense, fluctuant mass on the left labia. Vital signs show HR 118, BP 96/60. What is the priority intervention?", options: ["Apply ice and monitor", "Notify the provider for surgical evaluation and establish large-bore IV access", "Administer oral analgesics", "Encourage sitz bath"], correct: 1, rationale: "A large (>3-4 cm), tense hematoma with tachycardia and hypotension indicates hemodynamic compromise requiring urgent surgical evaluation. Large-bore IV access prepares for potential transfusion." },
    { question: "What distinguishes a retroperitoneal hematoma from a vulvar hematoma?", options: ["Retroperitoneal hematomas are always smaller", "Retroperitoneal hematomas may cause flank pain and concealed hemorrhage without visible perineal swelling", "Vulvar hematomas are more dangerous", "Retroperitoneal hematomas only occur with cesarean delivery"], correct: 1, rationale: "Retroperitoneal hematomas extend into the broad ligament or retroperitoneal space. They may not produce visible perineal swelling but can cause massive concealed hemorrhage presenting as flank pain, abdominal distension, and hemodynamic instability." }
  ]
};

const vaginalHematomaNp: LessonContent = {
  title: "Vaginal Hematoma",
  image: imgVaginalHematoma,
  cellular: {
    title: "Pelvic Vascular Anatomy",
    content: "The pelvic floor vasculature is supplied primarily by branches of the internal iliac (hypogastric) artery, including the pudendal artery and its branches (inferior rectal, perineal, and dorsal artery of the clitoris), the vaginal artery, the uterine artery, and the inferior vesical artery. Batson's venous plexus - a valveless network of veins connecting the pelvic, vertebral, and abdominal venous systems - contributes to the rich venous drainage of the perineum and vaginal canal. This valveless system allows bidirectional blood flow, which can facilitate rapid expansion of venous hematomas along tissue planes. During vaginal delivery, shearing forces on the pelvic soft tissues can avulse branches of the pudendal artery or disrupt paravaginal venous plexuses, particularly during operative delivery or with inadequate repair of deep perineal lacerations. The loose areolar tissue of the ischiorectal fossa, paravaginal space, and retroperitoneal space offers minimal resistance to blood accumulation, allowing hematomas to expand to massive volumes (documented cases exceeding 1-2 liters) before producing hemodynamic compromise. Retroperitoneal hematomas extending into the broad ligament are particularly dangerous because they can track cephalad along the retroperitoneum without producing visible perineal findings. Large hematomas (>500 mL) can trigger consumption of clotting factors and platelets, precipitating disseminated intravascular coagulation (DIC) through a mechanism involving tissue factor release from damaged endothelium and activation of the extrinsic coagulation pathway. Selective arterial embolization via interventional radiology has emerged as a key management option for arterial hematomas that are refractory to surgical packing or for patients who are poor surgical candidates. This technique involves fluoroscopy-guided catheterization of the internal iliac artery with selective embolization of the bleeding branch using gelatin sponge particles, coils, or polyvinyl alcohol particles. Evidence-based management algorithms stratify hematomas by size, expansion rate, and hemodynamic status: small (<3 cm) stable hematomas are managed conservatively with ice, analgesia, and serial monitoring; moderate (3-5 cm) hematomas require close observation with preparation for intervention; large (>5 cm) or expanding hematomas with hemodynamic compromise require surgical evacuation, ligation of bleeding vessels, and possible packing of the cavity with hemostatic agents."
  },
  signs: {
    left: [
      "Vulvar hematoma: unilateral labial mass below the pelvic diaphragm (most common, most visible)",
      "Vaginal hematoma: paravaginal mass above the pelvic diaphragm, may present as vaginal wall bulge",
      "Retroperitoneal hematoma: extends into broad ligament, may present with flank/abdominal pain only",
      "Arterial injury (pudendal artery branches): rapid expansion, bright discoloration, early presentation",
      "Venous plexus disruption: slower expansion, darker discoloration, delayed presentation 6-24 hours"
    ],
    right: [
      "DIC from large hematoma: consumption of clotting factors, oozing from IV sites, petechiae",
      "Hemodynamic collapse: tachycardia, hypotension, oliguria, altered mental status",
      "Urethral obstruction with acute urinary retention requiring catheterization",
      "Secondary infection of hematoma cavity (febrile, erythema, fluctuance days after delivery)",
      "Necrotizing fasciitis (rare but catastrophic complication of infected hematoma)"
    ]
  },
  medications: [
    { name: "Selective Arterial Embolization", type: "Interventional radiology procedure", action: "Fluoroscopy-guided catheterization of the internal iliac artery with selective embolization of bleeding branch using gelatin sponge, coils, or PVA particles", sideEffects: "Post-embolization syndrome (fever, pain), non-target embolization, vessel dissection", contra: "Hemodynamically unstable patients who cannot tolerate fluoroscopy time; active DIC may impair clot formation at embolization site", pearl: "Indicated for arterial hematomas refractory to surgical packing or in patients who are poor surgical candidates; success rate >90% in experienced centers" },
    { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Competitively inhibits plasminogen activation at lysine binding sites, preventing fibrin degradation and stabilizing clot", sideEffects: "Nausea, diarrhea, thromboembolic risk (low at recommended doses)", contra: "Active thromboembolic disease, subarachnoid hemorrhage, acquired color vision disturbance", pearl: "WOMAN trial evidence supports TXA within 3 hours of postpartum hemorrhage onset; 1g IV over 10 minutes, repeat if bleeding continues after 30 minutes" },
    { name: "Cryoprecipitate/Fibrinogen Concentrate", type: "Blood product/hemostatic agent", action: "Replaces consumed fibrinogen in DIC secondary to large hematoma; targets fibrinogen level >200 mg/dL", sideEffects: "Transfusion reactions, volume overload", contra: "None absolute when fibrinogen is critically depleted", pearl: "Large hematomas (>500 mL) can trigger DIC through tissue factor release; monitor fibrinogen levels and replace aggressively if depleted" }
  ],
  pearls: [
    "Batson's venous plexus is valveless, allowing bidirectional flow and rapid hematoma expansion along tissue planes",
    "Pudendal artery branches are the most common arterial source; internal pudendal artery ligation or embolization may be required",
    "Selective arterial embolization is an alternative to surgical exploration for arterial hematomas refractory to packing",
    "Large hematomas (>500 mL) can precipitate DIC through tissue factor release and extrinsic pathway activation",
    "Management algorithm: <3 cm stable → conservative; 3-5 cm → close observation; >5 cm or expanding with hemodynamic compromise → surgical evacuation",
    "Retroperitoneal hematomas can track cephalad without visible perineal findings: CT imaging may be needed for diagnosis",
    "Post-evacuation: pack cavity with hemostatic agents, place vaginal packing, Foley catheter, and monitor for re-accumulation"
  ],
  quiz: [
    { question: "A postpartum patient develops a rapidly expanding vulvar hematoma that recurs after initial surgical evacuation and packing. What advanced intervention should be considered?", options: ["Repeat packing with tighter pressure", "Selective arterial embolization via interventional radiology", "Observation with serial vitals", "Oral tranexamic acid"], correct: 1, rationale: "Selective arterial embolization is indicated for hematomas refractory to surgical packing. Fluoroscopy-guided catheterization allows targeted occlusion of the bleeding arterial branch with >90% success in experienced centers." },
    { question: "What mechanism explains how a large postpartum hematoma can trigger DIC?", options: ["Direct pressure on the liver reducing clotting factor synthesis", "Tissue factor release from damaged endothelium activating the extrinsic coagulation pathway, consuming clotting factors", "Immune-mediated platelet destruction", "Hypothermia from blood loss"], correct: 1, rationale: "Large hematomas cause tissue factor release from damaged endothelium, activating the extrinsic coagulation cascade. Widespread consumption of clotting factors and platelets produces the characteristic DIC picture of simultaneous bleeding and microvascular thrombosis." },
    { question: "Why is Batson's venous plexus clinically significant in the context of vaginal hematomas?", options: ["It provides arterial supply to the perineum", "It is a valveless venous network that allows bidirectional flow and rapid hematoma expansion along tissue planes", "It drains into the portal system", "It is the primary site of clot formation"], correct: 1, rationale: "Batson's venous plexus is a valveless network connecting pelvic, vertebral, and abdominal venous systems. Its valveless nature allows bidirectional blood flow, facilitating rapid expansion of venous hematomas along tissue planes without the resistance of venous valves." }
  ]
};

export const maternityComplicationsLessons: Record<string, LessonContent> = {
  "ectopic-pregnancy": ectopicPregnancy,
  "dic-pregnancy": dicPregnancy,
  "hyperemesis-gravidarum": hyperemesisGravidarum,
  "torch-infections": torchInfections,
  "chorioamnionitis": chorioamnionitis,
  "multiple-gestation": multipleGestation,
  "placental-abnormalities": placentalAbnormalities,
  "pregnancy-stis": pregnancySTIs,
  "uterine-rupture": uterineRupture,
  "uterine-inversion": uterineInversion,
  "antenatal-testing": antenatalTesting,
  "vaginal-hematoma-rpn": vaginalHematomaRpn,
  "vaginal-hematoma": vaginalHematoma,
  "vaginal-hematoma-np": vaginalHematomaNp,
  "mastitis-rpn": {
    title: "Mastitis",
    cellular: { title: "Breast Tissue Infection Basics", content: "Mastitis is an infection of the breast tissue that most commonly occurs during lactation, typically within the first 6 weeks postpartum. Bacteria - most often Staphylococcus aureus - enter through cracked or damaged nipples and infect the milk ducts and surrounding tissue. Milk stasis from poor latch, missed feedings, or blocked ducts provides a medium for bacterial growth. The affected breast becomes erythematous, warm, swollen, and painful. The mother develops systemic symptoms including fever (38.5C or higher), chills, malaise, and flu-like symptoms. If untreated, mastitis can progress to breast abscess requiring incision and drainage. The condition is distinguished from engorgement (bilateral, no fever) and blocked duct (localized lump, no systemic symptoms). Continued breastfeeding is encouraged to prevent milk stasis from worsening the infection." },
    riskFactors: ["Cracked or damaged nipples", "Poor infant latch technique", "Missed or infrequent feedings", "Milk stasis or blocked ducts", "Tight-fitting bra or restrictive clothing", "Previous history of mastitis", "Fatigue and maternal stress", "First-time breastfeeding mother"],
    diagnostics: ["Assess breast for localized redness, swelling, warmth, and tenderness", "Monitor temperature for fever (38.5C or higher)", "Observe breastfeeding technique and infant latch", "Report presence of purulent nipple discharge", "Assess for systemic symptoms (chills, body aches, fatigue)"],
    management: ["Encourage continued breastfeeding or pumping to empty affected breast", "Apply warm compresses before feeding to promote milk flow", "Administer prescribed antibiotics as ordered", "Promote adequate rest, fluids, and nutrition", "Report signs of abscess formation (fluctuant mass, worsening despite antibiotics)"],
    nursingActions: ["Monitor vital signs - especially temperature every 4 hours", "Assess breast tissue for changes in redness, swelling, or induration", "Assist with positioning for breastfeeding (affected side first)", "Administer analgesics and antibiotics as ordered", "Teach proper hand hygiene before breastfeeding", "Report worsening symptoms or signs of sepsis to RN/physician"],
    signs: {
      left: ["Unilateral Breast Redness and Warmth", "Localized Swelling and Tenderness", "Fever 38.5C or Higher", "Flu-like Symptoms (chills, malaise)"],
      right: ["Cracked or Bleeding Nipples", "Palpable Firm or Lumpy Area", "Purulent Nipple Discharge", "Possible Axillary Lymphadenopathy"]
    },
    medications: [
      { name: "Dicloxacillin", type: "Penicillinase-Resistant Penicillin", action: "Kills S. aureus by inhibiting cell wall synthesis", sideEffects: "GI upset, rash, diarrhea", contra: "Penicillin allergy", pearl: "First-line antibiotic for lactational mastitis. Take on empty stomach. Safe during breastfeeding. Full 10-14 day course is essential to prevent abscess." },
      { name: "Ibuprofen", type: "NSAID", action: "Reduces inflammation and pain", sideEffects: "GI irritation, renal effects with prolonged use", contra: "Active GI bleeding, renal impairment", pearl: "Safe during breastfeeding. Helps reduce breast inflammation and pain. Alternate with acetaminophen for better pain control." }
    ],
    pearls: ["Continue breastfeeding - stopping increases risk of abscess formation", "Start feeding on the affected breast first to ensure complete emptying", "Warm compresses before feeding, cool compresses after for comfort", "Proper latch technique prevents recurrence - refer to lactation consultant", "If symptoms do not improve within 48 hours of antibiotics, suspect abscess or MRSA"],
    quiz: [{ question: "A postpartum mother with a red, warm, swollen left breast and fever of 38.8C asks if she should stop breastfeeding. What is the correct response?", options: ["Stop breastfeeding on the affected side until the infection clears", "Continue breastfeeding on both sides - start on the affected side first", "Pump and discard milk from the affected breast only", "Switch to formula until the antibiotic course is completed"], correct: 1, rationale: "Breastfeeding should CONTINUE during mastitis - stopping increases milk stasis and worsens infection. Feed from the affected breast first to ensure complete emptying. The antibiotics prescribed are safe for breastfeeding. Breast milk is safe for the infant even with mastitis." }]
  },
  "mastitis": {
    title: "Mastitis",
    cellular: { title: "Pathophysiology of Lactational Mastitis", content: "Mastitis involves bacterial invasion of breast parenchyma, most commonly caused by Staphylococcus aureus entering through nipple fissures during lactation. Milk stasis creates an ideal medium for bacterial proliferation within the ductal system. The inflammatory cascade involves neutrophil infiltration, cytokine release (IL-1, IL-6, TNF-alpha), and local tissue edema. The infected area develops cellulitis of the periductal connective tissue with wedge-shaped erythema corresponding to the affected ductal system. Systemic inflammatory response produces high fevers, rigors, and malaise. Progression to phlegmonous mastitis involves tissue necrosis within the breast parenchyma. Abscess formation occurs in 3-11% of cases when purulent material becomes walled off by granulation tissue, creating a fluctuant collection requiring drainage. Risk factors include nipple trauma providing a portal of entry, milk stasis from inadequate emptying, maternal fatigue and immunosuppression, and nasal S. aureus carriage in the mother or infant. MRSA mastitis is increasingly common and requires culture-guided antibiotic therapy. Granulomatous mastitis is a rare non-lactational variant with autoimmune pathology requiring different management." },
    riskFactors: ["Nipple fissures or trauma providing bacterial portal of entry", "Milk stasis from poor latch, skipped feedings, or weaning", "Previous mastitis episode (recurrence rate 4-8%)", "Primiparity with inexperience in breastfeeding technique", "Maternal fatigue, stress, and immunosuppression", "S. aureus nasal carriage in mother or infant", "Diabetes mellitus or immunocompromised state", "Tight bras or pressure on breast tissue"],
    diagnostics: ["Breast examination - localized wedge-shaped erythema, induration, warmth", "Vital signs - temperature, heart rate (systemic response assessment)", "CBC with differential - leukocytosis with left shift", "Blood cultures if sepsis suspected", "Breast milk culture and sensitivity if recurrent or failing antibiotics", "Breast ultrasound to evaluate for abscess (anechoic or hypoechoic collection)", "Assess breastfeeding technique and infant latch effectiveness"],
    management: ["Initiate empiric antibiotic therapy - dicloxacillin or cephalexin first-line", "Continue breastfeeding with affected breast emptied first", "Apply warm compresses before feeding to promote letdown", "Ensure adequate hydration and rest", "Ultrasound-guided needle aspiration for abscess (preferred over I&D for first attempt)", "Incision and drainage for abscess failing aspiration", "Culture milk if MRSA suspected or failing first-line antibiotics", "Refer to lactation consultant for latch assessment and technique correction"],
    nursingActions: ["Perform focused breast assessment each shift - document erythema margins with marker", "Monitor temperature trends and assess for sepsis criteria", "Administer antibiotics on schedule and assess for allergic reaction", "Teach and assist with effective breastfeeding positioning", "Assess infant latch and feeding adequacy (wet diapers, weight gain)", "Monitor for signs of abscess formation (worsening despite 48-72 hours of antibiotics)", "Provide emotional support - mastitis can be distressing and affect breastfeeding confidence", "Educate on completing full antibiotic course and prevention strategies"],
    signs: {
      left: ["Wedge-Shaped Breast Erythema", "Induration and Localized Warmth", "High Fever (38.5-40C) with Rigors", "Leukocytosis with Left Shift"],
      right: ["Fluctuant Mass (if abscess)", "Purulent or Blood-Tinged Nipple Discharge", "Ipsilateral Axillary Lymphadenopathy", "Tachycardia and Systemic Inflammatory Signs"]
    },
    medications: [
      { name: "Dicloxacillin", type: "Penicillinase-Resistant Penicillin", action: "Beta-lactam that inhibits cell wall synthesis in penicillinase-producing S. aureus", sideEffects: "GI upset, rash, hepatotoxicity (rare)", contra: "Penicillin allergy", pearl: "First-line for lactational mastitis. 500mg QID for 10-14 days. Safe during breastfeeding. Incomplete course is the most common cause of abscess formation." },
      { name: "Cephalexin", type: "First-Generation Cephalosporin", action: "Beta-lactam with good S. aureus coverage and oral bioavailability", sideEffects: "GI upset, rash, cross-reactivity with penicillin allergy (1-2%)", contra: "Severe penicillin anaphylaxis", pearl: "Alternative first-line if dicloxacillin unavailable. 500mg QID for 10-14 days. Safe during breastfeeding." },
      { name: "TMP-SMX or Clindamycin", type: "MRSA Coverage Antibiotics", action: "TMP-SMX: folate synthesis inhibition; Clindamycin: ribosomal protein synthesis inhibition", sideEffects: "TMP-SMX: rash, photosensitivity; Clindamycin: C. diff risk, GI upset", contra: "TMP-SMX: sulfa allergy, infants <2 months; Clindamycin: history of C. diff", pearl: "Used when MRSA is suspected or culture-confirmed. TMP-SMX is generally safe in breastfeeding but avoid in first month postpartum if infant is premature or jaundiced." }
    ],
    pearls: ["Mark erythema borders with skin marker to track progression or resolution on antibiotics", "Failure to improve within 48-72 hours of appropriate antibiotics warrants ultrasound for abscess", "MRSA prevalence in community-acquired mastitis is 10-15% - culture milk if risk factors present", "Total colectomy is NOT related - mastitis is breast tissue infection requiring antibiotics and continued breastfeeding", "Galactocele (milk-filled cyst) can mimic abscess - ultrasound differentiates", "Inflammatory breast cancer must be considered in non-lactating women with breast erythema and peau d'orange skin"],
    quiz: [
      { question: "A breastfeeding mother has been on dicloxacillin for 72 hours for mastitis. Her fever persists at 39.1C and a new fluctuant mass is palpable. What is the priority nursing action?", options: ["Increase the dicloxacillin dose and continue monitoring", "Notify the provider - likely abscess requiring ultrasound and possible drainage", "Discontinue breastfeeding to rest the affected breast", "Apply ice packs and reassess in 24 hours"], correct: 1, rationale: "Persistent fever and development of a fluctuant mass despite 48-72 hours of appropriate antibiotics strongly suggests abscess formation. The provider must be notified for breast ultrasound and likely ultrasound-guided aspiration or incision and drainage. Delaying treatment risks sepsis." },
      { question: "Which assessment finding differentiates mastitis from breast engorgement?", options: ["Bilateral breast fullness", "Unilateral wedge-shaped erythema with systemic fever", "Breast tenderness during letdown", "Temporary relief after breastfeeding"], correct: 1, rationale: "Engorgement is bilateral, non-infectious breast fullness without systemic symptoms. Mastitis presents with unilateral wedge-shaped erythema, localized warmth and induration, and systemic symptoms (fever 38.5C or higher, chills, malaise). Blocked duct causes a localized tender lump without fever." }
    ]
  },
  "mastitis-np": {
    title: "Mastitis",
    cellular: { title: "Molecular Pathogenesis of Lactational", content: "Lactational mastitis pathogenesis involves S. aureus biofilm formation within the ductal system. Bacteria adhere to milk fat globule membranes via fibronectin-binding proteins and produce exotoxins including alpha-hemolysin and Panton-Valentine leukocidin (PVL - associated with MRSA strains), which lyse neutrophils and macrophages, enabling tissue invasion. The innate immune response involves toll-like receptor 2 (TLR2) recognition of bacterial lipoteichoic acid, triggering NF-kB-mediated cytokine release (IL-1beta, IL-6, IL-8, TNF-alpha). Complement activation via the alternative pathway enhances opsonization. Milk stasis provides lactose and casein substrates for bacterial metabolism while reducing protective lactoferrin, lysozyme, and secretory IgA concentrations within stagnant ducts. Periductal inflammation causes edema that further obstructs adjacent ducts, creating a positive feedback loop. Abscess formation involves liquefactive necrosis walled off by fibrinous granulation tissue. Non-lactational forms include periductal mastitis (subareolar abscess - associated with smoking, which causes squamous metaplasia of duct epithelium), idiopathic granulomatous mastitis (T-cell mediated granulomatous inflammation of uncertain etiology - associated with Corynebacterium kroppenstedtii), and inflammatory breast cancer (which must be excluded in any non-lactating patient with breast erythema)." },
    riskFactors: ["S. aureus nasal colonization (maternal or infant)", "MRSA community prevalence and risk factors", "Nipple piercing (portal of entry)", "Smoking (periductal mastitis - squamous metaplasia)", "Diabetes mellitus - impaired neutrophil function", "HIV or immunosuppression", "Corynebacterium kroppenstedtii carriage (granulomatous mastitis)", "Prior breast surgery or radiation altering ductal anatomy"],
    diagnostics: ["Breast milk culture and sensitivity (aerobic and anaerobic)", "MRSA nasal screening of mother and infant", "CBC with differential and CRP for systemic inflammation", "Blood cultures if sepsis criteria present", "Breast ultrasound with Doppler - evaluate for abscess, phlegmon, or mass", "Core needle biopsy if granulomatous mastitis or inflammatory cancer suspected", "Procalcitonin for differentiating bacterial vs non-bacterial etiology", "Fine needle aspiration with culture for abscess confirmation and organism identification"],
    management: ["Prescribe empiric dicloxacillin 500mg QID or cephalexin 500mg QID for 10-14 days", "Add MRSA coverage (TMP-SMX DS BID or clindamycin 300mg QID) if risk factors present", "Order breast ultrasound for suspected abscess (failure to improve at 48-72 hours)", "Perform or refer for ultrasound-guided needle aspiration of abscess (first-line over I&D)", "Prescribe IV vancomycin or daptomycin for severe or bacteremic MRSA mastitis", "Manage granulomatous mastitis with corticosteroids (prednisone 0.5-1 mg/kg/day taper) and methotrexate for refractory cases", "Order mammogram and biopsy to exclude inflammatory breast cancer in non-lactational presentation", "Consult breast surgery for recurrent abscess or failed aspiration"],
    nursingActions: ["Obtain breast milk culture before initiating antibiotics when possible", "Perform MRSA decolonization protocol for recurrent cases (mupirocin nasal ointment BID x 5 days plus chlorhexidine body washes)", "Assess antibiotic response at 48-72 hours and escalate therapy if no improvement", "Coordinate ultrasound-guided aspiration scheduling and post-procedure follow-up", "Evaluate breastfeeding technique and refer to International Board Certified Lactation Consultant (IBCLC)", "Screen for postpartum depression as mastitis is a significant contributing stressor", "Develop evidence-based patient education on prevention strategies for recurrence", "Evaluate non-lactational mastitis for underlying pathology (biopsy if indicated)"],
    signs: {
      left: ["PVL-Positive MRSA: Necrotizing Tissue Destruction", "Biofilm-Mediated Antibiotic Resistance", "TLR2-Mediated NF-kB Inflammatory Cascade", "Complement-Driven Neutrophil Recruitment"],
      right: ["Periductal Squamous Metaplasia (smokers)", "Granulomatous Inflammation (non-caseating)", "Inflammatory Breast Cancer Mimicry", "Phlegmonous Mastitis with Tissue Necrosis"]
    },
    medications: [
      { name: "Dicloxacillin / Cephalexin", type: "First-Line Beta-Lactam", action: "Penicillinase-resistant cell wall synthesis inhibitor with excellent S. aureus (MSSA) coverage and oral bioavailability", sideEffects: "GI upset, hepatotoxicity (rare), hypersensitivity", contra: "Penicillin anaphylaxis (cephalexin: 1-2% cross-reactivity)", pearl: "NP prescribing: 500mg QID x 10-14 days. Emphasize completing the full course. Incomplete treatment is the #1 modifiable risk factor for abscess formation. Both are compatible with breastfeeding (LactMed Category L1)." },
      { name: "TMP-SMX DS", type: "Folate Synthesis Inhibitor (MRSA Coverage)", action: "Sequential inhibition of dihydrofolate reductase (TMP) and dihydropteroate synthase (SMX) - bactericidal in combination", sideEffects: "Photosensitivity, rash (Stevens-Johnson rare), hyperkalemia, bone marrow suppression", contra: "Sulfa allergy, G6PD deficiency (hemolysis risk), infants <2 months (bilirubin displacement)", pearl: "First-line oral MRSA coverage for mastitis. 1 DS tab BID x 10-14 days. Generally compatible with breastfeeding in healthy full-term infants after the first month. Monitor infant for jaundice if premature." },
      { name: "Prednisone (Granulomatous Mastitis)", type: "Glucocorticoid Immunosuppressant", action: "Suppresses T-cell mediated granulomatous inflammation through NF-kB inhibition, reduces cytokine production and granuloma formation", sideEffects: "Hyperglycemia, immunosuppression, adrenal suppression, osteoporosis with prolonged use", contra: "Active untreated bacterial infection (must rule out before starting)", pearl: "Starting dose 0.5-1 mg/kg/day with slow taper over 3-6 months. Granulomatous mastitis has 50% recurrence rate. Methotrexate is steroid-sparing alternative for refractory cases. Always biopsy first to exclude malignancy." }
    ],
    pearls: ["PVL-producing MRSA strains cause more necrotizing tissue destruction - suspect if rapid clinical deterioration despite appropriate antibiotics", "Abscess aspiration success rate is 85-90% with ultrasound guidance - I&D reserved for failed aspiration or multiloculated collections", "MRSA decolonization reduces recurrence by 60% - prescribe mupirocin nasal ointment BID x 5 days plus chlorhexidine washes for mother and infant", "Non-lactational breast erythema in women over 40 must be evaluated for inflammatory breast cancer - skin punch biopsy shows dermal lymphatic invasion", "Breast milk culture: >10^3 CFU/mL of a single pathogen confirms infection vs contamination"],
    quiz: [
      { question: "An NP evaluates a breastfeeding mother with mastitis who has failed 72 hours of dicloxacillin. Ultrasound shows a 3cm hypoechoic collection. What is the most appropriate next step?", options: ["Switch to IV vancomycin and admit for observation", "Perform ultrasound-guided needle aspiration with culture and add MRSA coverage", "Order incision and drainage under general anesthesia", "Discontinue breastfeeding and start IV ampicillin-sulbactam"], correct: 1, rationale: "Ultrasound-guided needle aspiration is the preferred first-line intervention for breast abscess (less invasive, better cosmetic outcome, 85-90% success rate). Culture of aspirated material guides targeted antibiotic therapy. MRSA coverage should be added given failure of first-line MSSA therapy. I&D is reserved for failed aspiration or multiloculated collections." },
      { question: "A non-lactating 35-year-old female smoker presents with a painful subareolar mass and purulent nipple discharge. What is the most likely diagnosis and underlying mechanism?", options: ["Lactational mastitis from retained milk", "Periductal mastitis from squamous metaplasia of lactiferous ducts", "Inflammatory breast cancer with dermal lymphatic invasion", "Granulomatous mastitis from Corynebacterium infection"], correct: 1, rationale: "Periductal mastitis (Zuska disease) occurs in smokers due to toxic metabolites causing squamous metaplasia of the lactiferous duct epithelium. The metaplastic squamous cells produce keratin that obstructs the duct, leading to ductal ectasia, bacterial overgrowth, and subareolar abscess formation. Smoking cessation is essential for preventing recurrence." }
    ]
  },
};
