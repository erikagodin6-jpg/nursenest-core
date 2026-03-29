import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgTrisomy21 = getAssetUrl("trisomy21_1773340545537.png");
const imgVPShunt = getAssetUrl("VP_1773375165171.png");

export const clinicalConditionsBatchILessons: Record<string, LessonContent> = {
  "trisomy-21-management-rpn": {
    title: "Trisomy 21 (Down Syndrome)",
    image: imgTrisomy21,
    cellular: {
      title: "Chromosomal Nondisjunction",
      content: "Trisomy 21, or Down syndrome, results from an extra copy of chromosome 21 due to nondisjunction during meiosis. This chromosomal abnormality leads to overexpression of genes on chromosome 21, affecting multiple organ systems. The extra genetic material disrupts normal development, causing characteristic physical features, intellectual disability, and increased risk of congenital heart defects. Down syndrome is the most common chromosomal cause of intellectual disability. The nurse assists with monitoring growth and development, supporting feeding, and reporting changes in respiratory or cardiac status."
    },
    riskFactors: [
      "Advanced maternal age (especially >35 years)",
      "Previous child with trisomy 21",
      "Parental chromosomal translocation carrier status",
      "Family history of chromosomal abnormalities"
    ],
    diagnostics: [
      "Monitor vital signs and report abnormalities",
      "Measure and document head circumference, weight, and length at each visit",
      "Observe feeding patterns and report difficulties",
      "Monitor respiratory status and report increased work of breathing",
      "Report signs of cardiac compromise: cyanosis, diaphoresis with feeding, poor weight gain"
    ],
    management: [
      "Support feeding by suctioning nose with bulb syringe before feedings",
      "Allow rest periods during feeding due to prone respiratory issues",
      "Swaddle infant for comfort and thermoregulation",
      "Encourage activities appropriate to developmental age, not chronological age",
      "Increase fiber and fluids in diet to prevent constipation",
      "Assist with scheduling routine vision and hearing testing"
    ],
    nursingActions: [
      "Monitor respiratory function and auscultate lung sounds",
      "Assess for signs of congenital heart defect: cyanosis, murmur, feeding intolerance",
      "Document developmental milestones and report delays",
      "Monitor height and weight for growth trends using Down syndrome-specific growth charts",
      "Provide family support and referrals to early intervention programs",
      "Reinforce importance of physical therapy, speech therapy, and occupational therapy"
    ],
    signs: {
      left: [
        "Brushfield spots (white specks on iris)",
        "Low-set small ears",
        "Upslanting palpebral fissures",
        "Epicanthal folds",
        "Short neck with excess skin",
        "Single palmar transverse crease (simian crease)",
        "Sandal toe deformity (wide gap between first and second toes)"
      ],
      right: [
        "Decreased muscle tone (hypotonia)",
        "Congenital heart defects (AV canal defect most common)",
        "Hearing and vision impairment",
        "Intellectual disability",
        "Developmental delays",
        "Protruding tongue",
        "Short stature"
      ]
    },
    medications: [
      { name: "Levothyroxine", type: "Thyroid hormone replacement", action: "Replaces deficient thyroid hormone in congenital or acquired hypothyroidism, common in Down syndrome", sideEffects: "Tachycardia, weight loss, irritability, insomnia", contra: "Untreated adrenal insufficiency, thyrotoxicosis", pearl: "Hypothyroidism screening is essential in Down syndrome. Monitor TSH and T4 levels regularly. Administer on an empty stomach." }
    ],
    pearls: [
      "Atlantoaxial instability (C1-C2) occurs in 10-20% of individuals with Down syndrome; screen before sports participation",
      "Congenital heart defects are present in approximately 50% of infants with Down syndrome",
      "Use Down syndrome-specific growth charts rather than standard pediatric growth charts",
      "Early intervention programs significantly improve developmental outcomes",
      "Monitor for leukemia, which has a 10-20x increased incidence in Down syndrome"
    ],
    quiz: [
      { question: "Which physical finding is characteristic of trisomy 21?", options: ["Port-wine stain on the face", "Single palmar transverse crease", "Café-au-lait spots", "Webbed neck"], correct: 1, rationale: "A single palmar transverse crease (simian crease) is a classic physical finding in trisomy 21, along with upslanting palpebral fissures, epicanthal folds, and low-set ears." },
      { question: "What should the nurse do before feeding an infant with Down syndrome?", options: ["Position the infant flat on their back", "Suction the nose with a bulb syringe", "Withhold feedings until a swallow study is completed", "Administer supplemental oxygen"], correct: 1, rationale: "Infants with Down syndrome often have nasal congestion. Suctioning the nose before feedings helps clear the airway and improves feeding ability." },
      { question: "Why are rest periods important during feeding for an infant with Down syndrome?", options: ["To prevent overfeeding", "Because these infants are prone to respiratory issues and fatigue easily", "To allow for medication administration", "Because they have hypoglycemia"], correct: 1, rationale: "Infants with Down syndrome are prone to respiratory issues and have decreased muscle tone, causing them to fatigue easily during feedings. Rest periods help prevent respiratory distress." }
    ]
  },

  "trisomy-21-management-rn": {
    title: "Trisomy 21 (Down Syndrome)",
    image: imgTrisomy21,
    cellular: {
      title: "Pathophysiology of Trisomy 21",
      content: "Trisomy 21 occurs when nondisjunction during meiosis produces a gamete with an extra chromosome 21, resulting in 47 chromosomes instead of 46. The overexpression of genes on chromosome 21 leads to disrupted embryogenesis affecting the cardiac septum (endocardial cushion defects), craniofacial development, GI tract (duodenal atresia, Hirschsprung disease), and central nervous system (reduced neuronal density). Approximately 95% of cases are full trisomy 21, while 3-4% result from Robertsonian translocation and 1-2% from mosaicism. The nurse must coordinate comprehensive multidisciplinary care, manage cardiac and respiratory complications, perform developmental screening, and educate families on long-term health surveillance."
    },
    riskFactors: [
      "Advanced maternal age (risk increases exponentially after age 35)",
      "Prior pregnancy with trisomy 21",
      "Parental balanced translocation carrier",
      "Family history of chromosomal abnormalities",
      "Abnormal prenatal screening markers (low AFP, high hCG, low estriol)"
    ],
    diagnostics: [
      "Interpret prenatal screening: nuchal translucency, quad screen, cell-free fetal DNA",
      "Coordinate postnatal karyotype analysis for definitive diagnosis",
      "Order and interpret echocardiogram to evaluate for congenital heart defects",
      "Monitor thyroid function tests (TSH, free T4) annually",
      "Screen for celiac disease with tissue transglutaminase antibodies",
      "Coordinate cervical spine radiography for atlantoaxial instability screening",
      "Monitor CBC for hematologic abnormalities (transient myeloproliferative disorder, leukemia)"
    ],
    management: [
      "Coordinate cardiology referral for congenital heart defect evaluation and management",
      "Implement developmental stimulation appropriate to functional level",
      "Refer to early intervention programs: PT, OT, and speech therapy",
      "Monitor growth using Down syndrome-specific growth charts",
      "Implement aspiration precautions for infants with poor feeding coordination",
      "Coordinate hearing and vision screening at recommended intervals",
      "Manage constipation with dietary fiber, fluids, and stool softeners as needed",
      "Coordinate screening for obstructive sleep apnea by age 4"
    ],
    nursingActions: [
      "Perform comprehensive cardiovascular assessment: auscultate for murmurs, assess for cyanosis",
      "Assess developmental milestones using standardized tools and Down syndrome developmental expectations",
      "Educate family on health surveillance schedule specific to Down syndrome",
      "Monitor for signs of atlantoaxial instability: neck pain, gait changes, bowel/bladder dysfunction",
      "Screen for behavioral and mental health concerns including anxiety and depression",
      "Coordinate multidisciplinary team meetings for individualized care planning",
      "Teach signs of increased intracranial pressure if hydrocephalus is a concern",
      "Facilitate genetic counseling referral for family planning"
    ],
    signs: {
      left: [
        "Hypotonia (decreased muscle tone)",
        "Brachycephaly (flat occiput)",
        "Upslanting palpebral fissures",
        "Epicanthal folds",
        "Brushfield spots",
        "Small ears, flat nasal bridge",
        "Protruding tongue (macroglossia)"
      ],
      right: [
        "Congenital heart defect (atrioventricular canal most common)",
        "Duodenal atresia (double bubble sign on X-ray)",
        "Atlantoaxial instability",
        "Hypothyroidism",
        "Increased risk of leukemia",
        "Hearing loss (conductive or sensorineural)",
        "Obstructive sleep apnea"
      ]
    },
    medications: [
      { name: "Levothyroxine", type: "Thyroid hormone replacement", action: "Replaces deficient thyroid hormone to maintain normal metabolic function", sideEffects: "Tachycardia, irritability, weight loss, heat intolerance", contra: "Uncorrected adrenal insufficiency, acute MI", pearl: "Hypothyroidism develops in 15-20% of children with Down syndrome. Screen TSH at birth, 6 months, 12 months, then annually. Administer on empty stomach, separate from calcium and iron by 4 hours." },
      { name: "Polyethylene glycol (MiraLAX)", type: "Osmotic laxative", action: "Draws water into the intestinal lumen to soften stool and promote bowel movements", sideEffects: "Bloating, cramping, diarrhea", contra: "Bowel obstruction", pearl: "Constipation is very common in Down syndrome due to hypotonia. First-line approach includes increased fiber and fluids. Add osmotic laxative if lifestyle measures are insufficient." }
    ],
    pearls: [
      "Endocardial cushion defect (AV canal) is the most common cardiac anomaly in Down syndrome, present in ~40% of affected infants",
      "Atlantoaxial instability requires screening before participation in contact sports or gymnastics",
      "Transient myeloproliferative disorder occurs in ~10% of neonates with Down syndrome and usually resolves spontaneously",
      "Children with Down syndrome have a 10-20x increased risk of developing leukemia compared to the general population",
      "Obstructive sleep apnea affects up to 50% of individuals with Down syndrome due to midface hypoplasia and macroglossia"
    ],
    quiz: [
      { question: "Which congenital heart defect is most commonly associated with trisomy 21?", options: ["Tetralogy of Fallot", "Atrioventricular canal defect", "Transposition of the great arteries", "Coarctation of the aorta"], correct: 1, rationale: "Atrioventricular (AV) canal defect is the most common cardiac anomaly in Down syndrome, occurring in approximately 40% of affected infants. An echocardiogram should be performed on all newborns with Down syndrome." },
      { question: "At what frequency should thyroid function be screened in a child with Down syndrome?", options: ["Only at birth", "Every 5 years", "Annually after initial newborn screening", "Only when symptoms develop"], correct: 2, rationale: "Children with Down syndrome have a 15-20% risk of developing hypothyroidism. Screening should be done at birth, 6 months, 12 months, and then annually to detect subclinical hypothyroidism early." },
      { question: "Which screening should be completed before a child with Down syndrome participates in contact sports?", options: ["Echocardiogram", "Cervical spine radiography for atlantoaxial instability", "Bone density scan", "Pulmonary function testing"], correct: 1, rationale: "Atlantoaxial instability (C1-C2 subluxation) occurs in 10-20% of individuals with Down syndrome. Cervical spine imaging is recommended before sports participation to prevent spinal cord injury." }
    ]
  },

  "trisomy-21-management-np": {
    title: "Trisomy 21 (Down Syndrome)",
    image: imgTrisomy21,
    cellular: {
      title: "Genetics and Multi-System Pathophysiology",
      content: "Trisomy 21 results from meiotic nondisjunction (95%), Robertsonian translocation (3-4%), or mosaicism (1-2%), producing an extra copy of chromosome 21 with overexpression of over 300 genes. The DSCR (Down Syndrome Critical Region) on 21q22 drives many phenotypic features. Overexpression of DYRK1A contributes to intellectual disability, while COL6A1 and COL6A2 overexpression affects connective tissue integrity. Cardiac septal development is disrupted by altered VEGF-A signaling, resulting in endocardial cushion defects. The clinician must manage the full spectrum of health surveillance including prescribing thyroid replacement, managing cardiac follow-up, screening for hematologic malignancies, evaluating for atlantoaxial instability, and coordinating transition to adult care."
    },
    riskFactors: [
      "Advanced maternal age (1:350 at age 35, 1:100 at age 40, 1:25 at age 45)",
      "Prior trisomy 21 pregnancy (recurrence risk ~1% for full trisomy)",
      "Parental Robertsonian translocation (up to 100% if parent carries 21;21)",
      "Mosaicism in a parent (variable risk)",
      "Abnormal first-trimester combined screening (PAPP-A low, hCG high, increased NT)"
    ],
    diagnostics: [
      "Order karyotype or chromosomal microarray for definitive genetic diagnosis",
      "Order echocardiogram within first month of life for all infants with Down syndrome",
      "Prescribe and interpret annual TSH and free T4 for thyroid surveillance",
      "Order cervical spine flexion-extension radiographs between ages 3-5",
      "Screen for celiac disease with IgA and tTG-IgA by age 2 or with symptoms",
      "Order polysomnography for obstructive sleep apnea screening by age 4",
      "Monitor CBC annually for hematologic abnormalities; evaluate blasts if present",
      "Order audiologic evaluation by 6 months and annually thereafter"
    ],
    management: [
      "Prescribe levothyroxine for confirmed hypothyroidism, titrating to normalize TSH",
      "Manage cardiac follow-up with cardiology for AV canal defect or other CHD",
      "Refer for surgical repair of congenital heart defects as indicated",
      "Prescribe subacute bacterial endocarditis prophylaxis for unrepaired cardiac defects as indicated",
      "Coordinate developmental and behavioral interventions across the lifespan",
      "Manage atlantoaxial instability with activity restrictions and neurosurgical referral if symptomatic",
      "Screen for and manage obstructive sleep apnea with referral for adenotonsillectomy or CPAP",
      "Prescribe appropriate immunization schedule with attention to RSV prophylaxis if cardiac disease present",
      "Coordinate transition to adult healthcare services beginning at age 12-14"
    ],
    nursingActions: [
      "Conduct comprehensive health surveillance visits using AAP Down syndrome guidelines",
      "Prescribe and adjust thyroid hormone replacement based on serial lab trends",
      "Evaluate and manage behavioral comorbidities: ADHD, anxiety, depression, autism spectrum features",
      "Coordinate hematology referral for abnormal CBC findings or suspected leukemia",
      "Manage reproductive health counseling for adolescents and adults with Down syndrome",
      "Evaluate for Alzheimer disease in adults with Down syndrome (onset typically age 40-50)",
      "Prescribe RSV prophylaxis (palivizumab) for infants with significant cardiac disease",
      "Coordinate genetic counseling for family members regarding recurrence risk"
    ],
    signs: {
      left: [
        "Characteristic facial features: flat profile, upslanting eyes, epicanthal folds",
        "Hypotonia progressing to joint hyperlaxity",
        "Single palmar crease, clinodactyly of fifth finger",
        "Short stature, brachycephaly",
        "Macroglossia, small oral cavity",
        "Wide gap between first and second toes",
        "Dry, coarse skin"
      ],
      right: [
        "Endocardial cushion defect (AV canal): murmur, failure to thrive, heart failure",
        "Atlantoaxial instability: myelopathy signs, neck pain, torticollis",
        "Hypothyroidism: fatigue, constipation, weight gain, delayed growth",
        "Transient myeloproliferative disorder in neonates",
        "Duodenal atresia: bilious vomiting, double-bubble sign",
        "Early-onset Alzheimer disease (age 40-50)",
        "Obstructive sleep apnea: snoring, restless sleep, daytime somnolence"
      ]
    },
    medications: [
      { name: "Levothyroxine", type: "Thyroid hormone replacement", action: "Synthetic T4 that restores normal metabolic function in hypothyroidism", sideEffects: "Tachycardia, tremor, weight loss, insomnia, heat intolerance", contra: "Uncorrected adrenal insufficiency, thyrotoxicosis", pearl: "Start at 10-15 mcg/kg/day in neonates. Recheck TSH 4-6 weeks after initiation or dose change. Separate from calcium, iron, and soy formula by 4 hours." },
      { name: "Palivizumab (Synagis)", type: "RSV monoclonal antibody", action: "Provides passive immunity against respiratory syncytial virus by binding the F protein", sideEffects: "Injection site reaction, fever, rash", contra: "History of severe hypersensitivity reaction to palivizumab", pearl: "Indicated for infants with Down syndrome and hemodynamically significant CHD during RSV season. Administered IM monthly during RSV season." },
      { name: "Methylphenidate", type: "CNS stimulant", action: "Blocks reuptake of dopamine and norepinephrine to improve attention and executive function", sideEffects: "Appetite suppression, insomnia, growth suppression, tachycardia", contra: "Concurrent MAOI use, severe anxiety, glaucoma", pearl: "ADHD is common in Down syndrome. Start at lowest effective dose. Monitor growth closely as children with Down syndrome are already at risk for short stature." }
    ],
    pearls: [
      "Follow the AAP Health Supervision Guidelines for Children with Down Syndrome for standardized health surveillance",
      "Adults with Down syndrome develop Alzheimer neuropathology almost universally by age 40, with clinical dementia in 50-70% by age 60",
      "Mosaicism (2% of cases) may present with milder phenotypic features; karyotype confirms diagnosis",
      "Fertility is reduced but not absent in females with Down syndrome; males are almost always infertile",
      "Celiac disease prevalence in Down syndrome is 5-16%, much higher than the general population (1%)"
    ],
    quiz: [
      { question: "At what age should polysomnography be ordered for a child with Down syndrome?", options: ["At birth", "By age 2", "By age 4", "Only when snoring develops"], correct: 2, rationale: "AAP guidelines recommend polysomnography for all children with Down syndrome by age 4 to screen for obstructive sleep apnea, which affects up to 50% of individuals with Down syndrome." },
      { question: "An NP is evaluating a 45-year-old adult with Down syndrome who presents with progressive memory loss and personality changes. What should the clinician suspect?", options: ["Hypothyroidism", "Early-onset Alzheimer disease", "Schizophrenia", "Vitamin B12 deficiency"], correct: 1, rationale: "Adults with Down syndrome are at very high risk for early-onset Alzheimer disease, with neuropathological changes developing almost universally by age 40. Progressive memory loss and personality changes in this population should raise suspicion for Alzheimer disease." },
      { question: "Which genetic mechanism accounts for approximately 95% of trisomy 21 cases?", options: ["Robertsonian translocation", "Meiotic nondisjunction", "Mosaicism", "Ring chromosome formation"], correct: 1, rationale: "Meiotic nondisjunction, the failure of chromosomes to separate properly during cell division, accounts for approximately 95% of trisomy 21 cases. Translocation accounts for 3-4% and mosaicism for 1-2%." }
    ]
  },

  "hypospadias-management-rpn": {
    title: "Hypospadias",
    cellular: {
      title: "Urethral Development Failure",
      content: "Hypospadias is a congenital defect resulting from the failure of the urethral folds to fuse completely during fetal development. This results in an abnormal urethral opening on the underside (ventral surface) of the penis, anywhere between the glans and the perineum. The defect may be accompanied by chordee (ventral curvature of the penis) and an incomplete foreskin (dorsal hood). If left untreated, hypospadias can cause difficulties with toilet training, frequent urinary tract infections, and inability to achieve normal erections. The nurse monitors for post-operative complications, assists with catheter care, and educates families on activity restrictions."
    },
    riskFactors: [
      "Family history of hypospadias",
      "Low birth weight or preterm birth",
      "Maternal exposure to endocrine-disrupting chemicals",
      "Advanced maternal age",
      "Assisted reproductive technology"
    ],
    diagnostics: [
      "Monitor post-operative urine output and report decreased output",
      "Observe surgical site for signs of infection: redness, swelling, purulent drainage",
      "Monitor catheter patency and report obstruction",
      "Report fever or signs of systemic infection",
      "Document pain level using age-appropriate pain scale"
    ],
    management: [
      "Delay circumcision until surgical repair (foreskin tissue used for reconstruction)",
      "Prepare child for surgery typically performed at age 6-12 months",
      "Maintain temporary urinary catheter as ordered post-operatively",
      "Administer antibiotics, analgesics, and antispasmodics as ordered",
      "Provide sponge baths only during urinary diversion period (5-10 days)",
      "Restrict straddle toys and strenuous activity during recovery"
    ],
    nursingActions: [
      "Monitor catheter site for displacement or kinking",
      "Assess surgical site for bleeding, edema, or hematoma",
      "Report any signs of urethral fistula formation: urine leaking from abnormal site",
      "Administer antispasmodic medications (oxybutynin) as ordered to prevent bladder spasms",
      "Encourage increased fluid intake to maintain urine output",
      "Educate parents on post-operative care: no tub baths, sponge baths only",
      "Reinforce avoidance of straddle toys (bicycles, rocking horses) during healing"
    ],
    signs: {
      left: [
        "Urethral opening on ventral surface of penis",
        "Abnormal urine stream (spraying or downward-directed)",
        "Dorsal hooded foreskin (incomplete ventral foreskin)",
        "Chordee (ventral penile curvature)"
      ],
      right: [
        "Post-operative: fever, purulent drainage (infection)",
        "Urethral fistula (urine leaking from non-meatal site)",
        "Meatal stenosis (narrowing of urethral opening)",
        "Bladder spasms after catheter placement"
      ]
    },
    medications: [
      { name: "Oxybutynin", type: "Antispasmodic/Anticholinergic", action: "Relaxes detrusor muscle of the bladder to reduce bladder spasms", sideEffects: "Dry mouth, constipation, drowsiness, urinary retention", contra: "Urinary retention, uncontrolled narrow-angle glaucoma, GI obstruction", pearl: "Commonly prescribed post-operatively to prevent painful bladder spasms from the indwelling catheter. Monitor for urinary retention after catheter removal." },
      { name: "Cephalexin", type: "First-generation cephalosporin", action: "Inhibits bacterial cell wall synthesis for prophylaxis against surgical site infection", sideEffects: "Diarrhea, rash, nausea", contra: "Cephalosporin allergy, severe penicillin allergy (cross-reactivity)", pearl: "Prophylactic antibiotics are typically continued for the duration of catheter placement. Monitor for signs of UTI despite prophylaxis." }
    ],
    pearls: [
      "Never circumcise an infant with hypospadias; the foreskin tissue is essential for surgical repair",
      "Surgical repair is ideally performed between 6-12 months to minimize psychological impact",
      "Post-operative urinary diversion typically lasts 5-10 days to allow the urethra to heal",
      "Avoid straddle toys and rough play for 2-3 weeks post-operatively to protect the surgical site",
      "Double diapers may be used post-operatively: the inner diaper collects stool while the outer diaper secures the catheter"
    ],
    quiz: [
      { question: "Why is circumcision contraindicated in an infant with hypospadias?", options: ["It increases the risk of UTI", "The foreskin tissue is needed for surgical repair", "It can cause excessive bleeding", "The infant is too young for the procedure"], correct: 1, rationale: "The foreskin tissue is used as graft material during hypospadias repair surgery. Circumcision would remove this tissue and compromise the surgical reconstruction." },
      { question: "What is the recommended timing for hypospadias surgical repair?", options: ["At birth", "6-12 months of age", "2-3 years of age", "After puberty"], correct: 1, rationale: "Surgical repair is ideally performed between 6-12 months of age. This timing allows adequate tissue development while minimizing psychological impact and the child's awareness of genital surgery." },
      { question: "Which activity restriction should the nurse reinforce for a post-operative hypospadias repair patient?", options: ["No swimming for 6 months", "Avoid straddle toys during healing", "Bed rest for 2 weeks", "No bathing for 1 month"], correct: 1, rationale: "Straddle toys (bicycles, rocking horses) must be avoided post-operatively to prevent pressure on the surgical repair site and reduce the risk of fistula formation." }
    ]
  },

  "hypospadias-management-rn": {
    title: "Hypospadias",
    cellular: {
      title: "Embryologic Urethral Development",
      content: "Hypospadias results from incomplete fusion of the urethral folds during weeks 8-14 of embryonic development, when androgens (primarily dihydrotestosterone) direct masculinization of the external genitalia. Inadequate androgen signaling or receptor dysfunction leads to an ectopic urethral meatus on the ventral surface of the penis. The defect is classified by meatal location: glanular/coronal (anterior, ~50%), penile shaft (middle, ~30%), or penoscrotal/perineal (posterior, ~20%). Associated abnormalities include chordee and a dorsally hooded foreskin. The nurse manages perioperative care, monitors for surgical complications including urethral fistula and meatal stenosis, coordinates pain management, and provides comprehensive family education."
    },
    riskFactors: [
      "Familial inheritance (8% risk with affected father, 14% with affected brother)",
      "Low birth weight and intrauterine growth restriction",
      "Maternal exposure to anti-androgens or endocrine disruptors",
      "In vitro fertilization or intracytoplasmic sperm injection",
      "Advanced maternal age",
      "Maternal progestin use during early pregnancy"
    ],
    diagnostics: [
      "Classify hypospadias severity: anterior (glanular/coronal), middle (penile shaft), posterior (penoscrotal/perineal)",
      "Assess for associated cryptorchidism, which may indicate a disorder of sex development",
      "Monitor post-operative urine output: minimum 1 mL/kg/hr in pediatric patients",
      "Assess surgical site for signs of urethral fistula: urine leaking from suture line",
      "Monitor for meatal stenosis: straining to void, decreased stream after catheter removal",
      "Evaluate for bladder spasms: crying, pulling at catheter, suprapubic pain",
      "Order renal ultrasound if posterior hypospadias with cryptorchidism (rule out DSD)"
    ],
    management: [
      "Coordinate pre-operative education with family regarding surgical procedure and expected outcomes",
      "Maintain catheter patency post-operatively: secure catheter, prevent kinking and traction",
      "Implement double-diapering technique for catheter management",
      "Manage pain with scheduled analgesics and antispasmodics",
      "Maintain stent or catheter for 5-14 days post-operatively as ordered",
      "Coordinate follow-up with pediatric urologist for wound assessment and uroflow studies",
      "Educate parents on signs of complications: fistula, stricture, wound dehiscence",
      "Implement infection prevention strategies for catheter care"
    ],
    nursingActions: [
      "Perform comprehensive pre-operative assessment including genital examination documentation",
      "Educate family on importance of delaying circumcision for tissue preservation",
      "Monitor surgical dressing and report excessive bleeding or hematoma",
      "Assess catheter drainage: color, clarity, volume; report hematuria or decreased output",
      "Administer oxybutynin for bladder spasms and evaluate effectiveness",
      "Teach parents double-diaper technique: inner diaper for stool, outer for catheter",
      "Provide emotional support to parents regarding genital surgery on their child",
      "Coordinate speech and developmental referrals if hypospadias is part of a syndrome"
    ],
    signs: {
      left: [
        "Ventral urethral meatus (glanular to perineal)",
        "Chordee (ventral curvature of penis)",
        "Dorsal hooded foreskin",
        "Abnormal urinary stream direction",
        "Fish-mouth appearance of glans"
      ],
      right: [
        "Post-operative fistula: urine from suture line",
        "Meatal stenosis: strained voiding, thin stream",
        "Wound infection: erythema, purulent drainage, fever",
        "Urethral stricture: decreased flow post-repair",
        "Bladder spasms: suprapubic pain, catheter pulling"
      ]
    },
    medications: [
      { name: "Oxybutynin", type: "Antispasmodic", action: "Anticholinergic agent that relaxes the detrusor muscle to prevent bladder spasms", sideEffects: "Dry mouth, constipation, flushing, drowsiness", contra: "Urinary retention, GI obstruction, uncontrolled glaucoma", pearl: "Post-operative bladder spasms are common and painful. Administer scheduled rather than PRN for better spasm control. Monitor for constipation." },
      { name: "Acetaminophen with codeine", type: "Opioid analgesic combination", action: "Provides moderate pain relief through central opioid receptor activation and prostaglandin inhibition", sideEffects: "Constipation, sedation, respiratory depression, nausea", contra: "CYP2D6 ultra-rapid metabolizers, post-tonsillectomy in children", pearl: "Used for moderate post-operative pain. Monitor respiratory status. Some institutions prefer ibuprofen alternating with acetaminophen to avoid opioid side effects." },
      { name: "Trimethoprim-sulfamethoxazole", type: "Antibiotic combination", action: "Inhibits sequential steps in bacterial folate synthesis for UTI prophylaxis", sideEffects: "Rash, nausea, photosensitivity, Stevens-Johnson syndrome", contra: "Sulfa allergy, infants <2 months, severe hepatic/renal impairment", pearl: "Low-dose prophylaxis may be prescribed while the catheter is in place to prevent UTI. Adequate hydration is essential." }
    ],
    pearls: [
      "Posterior hypospadias with bilateral cryptorchidism requires evaluation for disorders of sex development (DSD) including karyotype",
      "Urethral fistula is the most common complication of hypospadias repair, occurring in 5-20% of cases",
      "Chordee correction and urethroplasty may be performed in one stage (distal) or two stages (proximal severe)",
      "Post-operative catheter stenting reduces fistula risk by allowing the neourethra to heal without urine exposure",
      "Parents should be educated that cosmetic and functional outcomes are generally excellent with modern techniques"
    ],
    quiz: [
      { question: "What is the most common complication following hypospadias surgical repair?", options: ["Meatal stenosis", "Urethral fistula", "Wound dehiscence", "Urinary retention"], correct: 1, rationale: "Urethral fistula, where urine leaks through a secondary opening along the repair site, is the most common complication of hypospadias surgery, occurring in 5-20% of cases." },
      { question: "When should the nurse suspect a disorder of sex development (DSD) in a newborn with hypospadias?", options: ["Any glanular hypospadias", "Posterior hypospadias with bilateral cryptorchidism", "Hypospadias with dorsal hooded foreskin", "Hypospadias in a premature infant"], correct: 1, rationale: "Posterior (severe) hypospadias with bilateral cryptorchidism raises concern for a disorder of sex development and requires urgent evaluation including karyotype analysis." },
      { question: "What is the purpose of the double-diaper technique after hypospadias repair?", options: ["To prevent catheter displacement and separate stool from the catheter", "To absorb more urine", "To keep the infant warm", "To prevent diaper rash"], correct: 0, rationale: "The double-diaper technique uses an inner diaper to contain stool and an outer diaper to secure and protect the catheter, preventing contamination of the surgical site with fecal bacteria." }
    ]
  },

  "hypospadias-management-np": {
    title: "Hypospadias",
    cellular: {
      title: "Androgen-Dependent Urethral Morphogenesis",
      content: "Urethral development occurs between weeks 8-14 of gestation through androgen-dependent fusion of the urethral folds over the urethral plate. Dihydrotestosterone (DHT), converted from testosterone by 5-alpha reductase in genital skin, drives this closure from proximal to distal. Hypospadias results from insufficient DHT signaling due to genetic mutations (SRD5A2, AR gene variants), placental insufficiency reducing hCG-driven fetal testosterone, or environmental endocrine disruptors. Posterior hypospadias may indicate broader anomalies of sex development (46,XY DSD). The clinician evaluates severity, prescribes pre-operative testosterone therapy for severe cases, manages post-operative complications, and coordinates long-term urological follow-up including fertility implications."
    },
    riskFactors: [
      "Monogenic defects in androgen synthesis or receptor pathway (SRD5A2, AR mutations)",
      "Placental insufficiency and IUGR (reduced hCG-driven testosterone production)",
      "Environmental endocrine disruptors (phthalates, pesticides, phytoestrogens)",
      "Assisted reproductive technology (3-5x increased risk)",
      "Multiple gestation pregnancies",
      "Maternal use of progestins during early pregnancy",
      "First-degree family history (recurrence risk 8-14%)"
    ],
    diagnostics: [
      "Classify severity: Type I (anterior: glanular, coronal), Type II (middle: distal/mid-shaft), Type III (posterior: proximal shaft, penoscrotal, perineal)",
      "Order karyotype and endocrine evaluation for posterior hypospadias with cryptorchidism",
      "Measure testosterone, DHT, 17-hydroxyprogesterone, and androstenedione for suspected DSD",
      "Order renal-bladder ultrasound (10-15% have upper tract anomalies in severe cases)",
      "Evaluate post-repair uroflowmetry to assess urethral caliber and stream",
      "Monitor for post-operative complications: fistula rate 5-20%, stricture rate 5-10%",
      "Order voiding cystourethrogram if recurrent UTIs post-repair"
    ],
    management: [
      "Prescribe pre-operative topical testosterone or DHT cream for severe hypospadias to increase penile size and tissue vascularity",
      "Consider parenteral testosterone (testosterone enanthate 2 mg/kg IM x 1-2 doses) before surgery for posterior defects",
      "Refer to experienced pediatric urologist for definitive repair (single vs. staged procedure)",
      "Prescribe post-operative prophylactic antibiotics for duration of catheterization",
      "Prescribe oxybutynin for bladder spasm prevention post-operatively",
      "Manage post-operative pain with multimodal analgesia: acetaminophen, ibuprofen, +/- caudal block",
      "Coordinate long-term follow-up through puberty to monitor for meatal stenosis, residual chordee",
      "Refer for fertility counseling in adulthood for severe posterior repairs"
    ],
    nursingActions: [
      "Evaluate neonatal genital examination findings and classify hypospadias severity",
      "Order and interpret endocrine studies in severe or syndromic presentations",
      "Prescribe pre-operative testosterone supplementation when indicated",
      "Manage recurrent post-operative complications and determine need for revision surgery",
      "Coordinate genetic counseling for families regarding recurrence risk",
      "Monitor growth and development of external genitalia through puberty",
      "Evaluate voiding function with uroflowmetry at follow-up visits",
      "Address psychosocial concerns regarding genital appearance and function"
    ],
    signs: {
      left: [
        "Ventral meatal displacement (mild to severe)",
        "Incomplete foreskin with dorsal hood",
        "Chordee (ventral penile curvature)",
        "Meatal web or glanular groove",
        "Small phallus (severe posterior cases)"
      ],
      right: [
        "Associated cryptorchidism (8-10% in severe cases)",
        "Inguinal hernia (9-15% prevalence)",
        "Bifid scrotum (severe posterior)",
        "Upper urinary tract anomalies (rare, in posterior cases)",
        "DSD features if ambiguous genitalia present"
      ]
    },
    medications: [
      { name: "Testosterone cream (topical 5%)", type: "Androgen", action: "Stimulates penile growth and increases tissue vascularity to optimize surgical tissue quality", sideEffects: "Temporary penile growth, pubic hair development, increased erections", contra: "Androgen-dependent neoplasm", pearl: "Applied topically to the penis for 4-6 weeks before surgery for severe hypospadias. Effects are temporary and reverse after discontinuation. Improves tissue quality for surgical repair." },
      { name: "Testosterone enanthate", type: "Parenteral androgen", action: "Stimulates androgen receptor-mediated penile growth and tissue vascularization", sideEffects: "Temporary virilization, bone age advancement (minimal with limited doses)", contra: "Androgen-sensitive tumors", pearl: "Dose: 2 mg/kg IM, 1-2 injections given 4-6 weeks before surgery. Used for severe posterior hypospadias. Increases penile length and glans circumference to facilitate repair." },
      { name: "Oxybutynin", type: "Anticholinergic/Antispasmodic", action: "Blocks muscarinic receptors in detrusor muscle to reduce bladder spasms", sideEffects: "Dry mouth, constipation, drowsiness, heat intolerance", contra: "Urinary retention, GI obstruction, uncontrolled narrow-angle glaucoma", pearl: "Prescribe 0.1-0.2 mg/kg/dose TID for 5-14 days post-operatively. Bladder spasms are a significant source of pain and catheter dislodgement in young children." }
    ],
    pearls: [
      "Pre-operative testosterone therapy can increase penile tissue by 50% and improve surgical outcomes in severe hypospadias",
      "The tabularized incised plate (TIP/Snodgrass) repair is the most widely used technique for distal hypospadias with >95% success rate",
      "Two-stage repairs are preferred for severe proximal hypospadias with significant chordee",
      "Long-term follow-up through puberty is essential as meatal stenosis and residual chordee may not manifest until adolescence",
      "Sexual function and fertility outcomes are generally favorable after successful hypospadias repair, but patients with severe posterior repairs should receive fertility counseling"
    ],
    quiz: [
      { question: "What is the rationale for prescribing topical testosterone before hypospadias repair?", options: ["To induce early puberty", "To increase penile tissue size and vascularity for improved surgical outcomes", "To test for androgen insensitivity", "To prevent post-operative infection"], correct: 1, rationale: "Topical testosterone increases penile size and tissue vascularity, optimizing the tissue available for surgical reconstruction. This is especially important in severe posterior hypospadias where tissue quality directly affects surgical success." },
      { question: "Which endocrine evaluation should be ordered for a newborn with posterior hypospadias and bilateral cryptorchidism?", options: ["TSH and free T4 only", "Karyotype, testosterone, DHT, and 17-hydroxyprogesterone", "Cortisol and ACTH only", "Growth hormone stimulation test"], correct: 1, rationale: "Posterior hypospadias with bilateral cryptorchidism raises concern for a disorder of sex development (DSD). A comprehensive endocrine evaluation including karyotype, testosterone, DHT, and adrenal steroids is essential to determine the underlying etiology." },
      { question: "What surgical technique is most commonly used for distal hypospadias repair?", options: ["Two-stage Bracka repair", "Tabularized incised plate (TIP/Snodgrass) repair", "Byars flaps", "Denis Browne procedure"], correct: 1, rationale: "The tabularized incised plate (TIP or Snodgrass) repair is the most widely used technique for distal hypospadias, with success rates exceeding 95%. It involves incising the urethral plate and tubularizing it to create the neourethra." }
    ]
  },

  "duchenne-md-management-rpn": {
    title: "Duchenne Muscular Dystrophy",
    cellular: {
      title: "Dystrophin Deficiency and Muscle Degeneration",
      content: "Duchenne muscular dystrophy (DMD) is an X-linked recessive disorder caused by mutations in the dystrophin gene, resulting in absence of the dystrophin protein needed for muscle fiber stabilization. Without dystrophin, the muscle cell membrane becomes fragile and susceptible to damage during contraction. Repeated cycles of muscle damage, inflammation, and attempted regeneration eventually lead to replacement of muscle fibers with fat and connective tissue. The disease primarily affects boys, with onset between ages 2-5 years. Muscles of the proximal lower extremities and pelvis are affected first. The nurse monitors mobility, assists with fall prevention, and reports changes in motor function or respiratory status."
    },
    riskFactors: [
      "Male sex (X-linked recessive inheritance)",
      "Maternal carrier status (2/3 of cases inherited, 1/3 sporadic mutations)",
      "Family history of DMD or Becker muscular dystrophy",
      "Elevated CK levels on newborn screening"
    ],
    diagnostics: [
      "Monitor and document motor function and mobility changes",
      "Report progressive difficulty with ambulation or frequent falls",
      "Monitor respiratory rate and effort during activity and rest",
      "Report signs of respiratory compromise: increased work of breathing, weak cough",
      "Document daily activity tolerance and report decline"
    ],
    management: [
      "Assist with fall prevention measures: remove rugs, reduce clutter",
      "Support participation in gentle recreational exercise and swimming",
      "Assist with mobility aids as disease progresses",
      "Monitor nutritional intake to prevent obesity (which accelerates functional decline)",
      "Assist with respiratory exercises as directed",
      "Maintain a safe, clutter-free environment"
    ],
    nursingActions: [
      "Observe for Gower sign: child uses hands on thighs to rise from squat position",
      "Assess gait pattern for waddling, toe-walking, and lordosis",
      "Note pseudohypertrophy of calf muscles (enlarged but weak)",
      "Report new falls, difficulty climbing stairs, or inability to keep up with peers",
      "Monitor respiratory function and report decreased oxygen saturation",
      "Provide emotional support to child and family",
      "Reinforce importance of physical therapy exercises"
    ],
    signs: {
      left: [
        "Gower sign (using hands on legs to stand)",
        "Waddling gait and lordosis",
        "Pseudohypertrophy of calf muscles",
        "Toe-walking",
        "Difficulty climbing stairs",
        "Frequent falls",
        "Progressive proximal muscle weakness"
      ],
      right: [
        "Loss of ambulation (typically by age 12)",
        "Scoliosis progression",
        "Respiratory insufficiency",
        "Weak cough and recurrent pneumonia",
        "Cardiomyopathy (dilated)",
        "Contractures of ankles, knees, hips",
        "Cognitive and behavioral difficulties"
      ]
    },
    medications: [
      { name: "Prednisone/Deflazacort", type: "Corticosteroid", action: "Reduces muscle inflammation and slows disease progression, prolonging ambulation", sideEffects: "Weight gain, growth suppression, mood changes, osteoporosis, immunosuppression, cushingoid features", contra: "Active systemic infection, live vaccines during treatment", pearl: "Corticosteroids are the only medications proven to slow disease progression. Deflazacort may cause less weight gain than prednisone. Monitor bone density and consider calcium/vitamin D supplementation." }
    ],
    pearls: [
      "Gower sign is the hallmark clinical finding: the child 'walks up' their legs with their hands to compensate for proximal weakness",
      "Most boys with DMD are wheelchair-dependent by age 12",
      "Death typically occurs by age 20-30 from respiratory failure or cardiomyopathy",
      "Swimming is an excellent low-impact exercise that supports mobility without joint stress",
      "Obesity accelerates loss of mobility and should be prevented through dietary management"
    ],
    quiz: [
      { question: "Which clinical finding is the hallmark sign of Duchenne muscular dystrophy?", options: ["Babinski sign", "Gower sign", "Kernig sign", "Brudzinski sign"], correct: 1, rationale: "Gower sign is the hallmark finding in DMD. The child uses their hands on their legs to 'walk up' their body from a seated or squatting position, compensating for proximal muscle weakness in the pelvis and lower extremities." },
      { question: "Which type of exercise should the nurse encourage for a child with DMD?", options: ["High-intensity weight training", "Contact sports", "Swimming and gentle recreational exercise", "Competitive running"], correct: 2, rationale: "Swimming and gentle recreational exercises are encouraged because they maintain mobility without placing excessive stress on weakened muscles and joints. High-impact and strenuous activities may accelerate muscle damage." },
      { question: "What is the most important environmental modification for a child with DMD?", options: ["Installing grab bars in the shower", "Removing rugs and clutter to prevent falls", "Lowering the thermostat", "Adding night lights only"], correct: 1, rationale: "Children with DMD are at high risk for falls due to progressive proximal weakness and gait instability. Removing rugs, clutter, and other tripping hazards is the most important safety measure." }
    ]
  },

  "duchenne-md-management-rn": {
    title: "Duchenne Muscular Dystrophy",
    cellular: {
      title: "Pathophysiology of Dystrophinopathy",
      content: "Duchenne muscular dystrophy results from mutations in the DMD gene on Xp21, the largest known human gene encoding the protein dystrophin. Dystrophin functions as a structural bridge between the intracellular actin cytoskeleton and the extracellular matrix via the dystrophin-associated glycoprotein complex (DAGC). Without dystrophin, the sarcolemma loses mechanical stability during muscle contraction, allowing calcium influx that activates proteases and triggers necrosis. Ongoing cycles of necrosis overwhelm satellite cell-mediated regeneration, leading to progressive fibrosis and fatty replacement. The nurse manages multi-system complications including respiratory decline, cardiomyopathy screening, mobility preservation, nutritional optimization, and psychosocial support for the child and family."
    },
    riskFactors: [
      "X-linked recessive inheritance (affects almost exclusively males)",
      "Maternal carrier status (carrier mothers transmit the gene to 50% of sons)",
      "Spontaneous mutations account for approximately one-third of cases",
      "Family history of neuromuscular disease",
      "Delayed motor milestones in early childhood"
    ],
    diagnostics: [
      "Interpret elevated serum CK levels (10-100x normal, often >10,000 IU/L at diagnosis)",
      "Coordinate genetic testing for DMD gene mutations (deletions, duplications, point mutations)",
      "Monitor pulmonary function tests: FVC, peak cough flow, MIP/MEP annually after age 6",
      "Coordinate annual echocardiogram and ECG for cardiomyopathy screening starting at diagnosis",
      "Assess for scoliosis progression with serial Cobb angle measurements",
      "Monitor bone density (DEXA scan) due to corticosteroid use and decreased weight-bearing",
      "Perform standardized motor assessments (6-minute walk test, North Star Ambulatory Assessment)"
    ],
    management: [
      "Administer corticosteroids (prednisone or deflazacort) as prescribed to prolong ambulation",
      "Coordinate physical therapy for stretching and prevention of contractures",
      "Implement respiratory management: cough assist device, nocturnal BiPAP as disease progresses",
      "Monitor for and manage cardiomyopathy with ACE inhibitors or beta-blockers as prescribed",
      "Coordinate scoliosis management: bracing and surgical referral when Cobb angle >20-25 degrees",
      "Implement weight management to prevent obesity-related acceleration of functional decline",
      "Coordinate transition to power wheelchair when ambulation is no longer functional",
      "Coordinate palliative care referral when appropriate"
    ],
    nursingActions: [
      "Perform comprehensive neuromuscular assessment at each visit",
      "Assess respiratory function: auscultate lung sounds, evaluate cough strength, monitor SpO2",
      "Monitor for signs of heart failure: edema, tachycardia, gallop rhythm, exercise intolerance",
      "Teach family to use cough assist device and perform manual assisted coughing techniques",
      "Educate on corticosteroid side effects: weight gain, mood changes, adrenal suppression",
      "Coordinate multidisciplinary team: neurology, cardiology, pulmonology, orthopedics, PT/OT",
      "Assess psychosocial impact on child and family: school performance, peer relationships, depression",
      "Facilitate genetic counseling for family planning"
    ],
    signs: {
      left: [
        "Early: delayed motor milestones, Gower sign, waddling gait",
        "Pseudohypertrophy of calves (fatty infiltration)",
        "Lumbar lordosis and toe-walking",
        "Progressive proximal-to-distal weakness pattern",
        "CK levels markedly elevated (10-100x normal)"
      ],
      right: [
        "Loss of ambulation by age 10-13",
        "Progressive restrictive lung disease (declining FVC)",
        "Dilated cardiomyopathy (onset typically age 10+)",
        "Scoliosis (progressive after loss of ambulation)",
        "Nocturnal hypoventilation requiring BiPAP",
        "Dysphagia and nutritional difficulties in late stages",
        "Cognitive impairment (average IQ ~85)"
      ]
    },
    medications: [
      { name: "Deflazacort", type: "Corticosteroid", action: "Reduces muscle inflammation, stabilizes sarcolemma, slows decline in muscle strength", sideEffects: "Weight gain (less than prednisone), growth suppression, cataracts, osteoporosis, cushingoid features", contra: "Active systemic fungal infection, live vaccination", pearl: "FDA-approved specifically for DMD. Dose: 0.9 mg/kg/day. May cause less weight gain than prednisone (0.75 mg/kg/day). Monitor growth, bone density, blood glucose, and cataracts annually." },
      { name: "Enalapril", type: "ACE inhibitor", action: "Reduces afterload and prevents cardiac remodeling to slow cardiomyopathy progression", sideEffects: "Cough, hypotension, hyperkalemia, renal impairment", contra: "Pregnancy, bilateral renal artery stenosis, angioedema history", pearl: "Started prophylactically by age 10 or at first sign of declining cardiac function. Some centers start ACE inhibitors at diagnosis regardless of cardiac function to preserve myocardium." },
      { name: "Eteplirsen", type: "Antisense oligonucleotide (exon-skipping therapy)", action: "Promotes exon 51 skipping to restore a truncated but partially functional dystrophin protein", sideEffects: "Balance disorder, vomiting, contact dermatitis", contra: "Not applicable to non-exon 51 amenable mutations", pearl: "FDA-approved for DMD patients with mutations amenable to exon 51 skipping (~13% of cases). Administered IV weekly. Clinical benefit is modest but represents a targeted molecular approach." }
    ],
    pearls: [
      "CK levels are massively elevated (often >10,000 IU/L) in DMD and may be the first laboratory abnormality detected",
      "Corticosteroids prolong ambulation by 2-5 years and are considered standard of care",
      "Cardiomyopathy is the leading cause of death in DMD, surpassing respiratory failure with modern ventilatory support",
      "Adrenal suppression from chronic corticosteroids requires stress-dose steroids during illness or surgery",
      "Succinylcholine and volatile anesthetics are contraindicated in DMD due to risk of rhabdomyolysis and malignant hyperthermia-like reactions"
    ],
    quiz: [
      { question: "What is the expected CK level at diagnosis in a child with Duchenne muscular dystrophy?", options: ["Normal (50-200 IU/L)", "Mildly elevated (500-1000 IU/L)", "Markedly elevated (>10,000 IU/L)", "Decreased below normal"], correct: 2, rationale: "CK levels are markedly elevated in DMD, often 10-100 times the upper limit of normal (>10,000 IU/L), reflecting ongoing muscle cell membrane damage and necrosis." },
      { question: "Which cardiac complication is the leading cause of death in DMD with modern respiratory support?", options: ["Aortic stenosis", "Dilated cardiomyopathy", "Endocarditis", "Pericardial effusion"], correct: 1, rationale: "Dilated cardiomyopathy develops in virtually all patients with DMD by their teens or twenties. With advances in respiratory support (BiPAP, cough assist), cardiomyopathy has become the leading cause of death." },
      { question: "Why are succinylcholine and volatile anesthetics contraindicated in DMD?", options: ["They cause hepatotoxicity", "They worsen cognitive impairment", "They can trigger rhabdomyolysis and malignant hyperthermia-like reactions", "They interfere with corticosteroid therapy"], correct: 2, rationale: "Patients with DMD have fragile muscle cell membranes. Succinylcholine and volatile anesthetics can trigger massive rhabdomyolysis, hyperkalemia, and cardiac arrest (malignant hyperthermia-like reactions)." }
    ]
  },

  "duchenne-md-management-np": {
    title: "Duchenne Muscular Dystrophy",
    cellular: {
      title: "Molecular Pathogenesis",
      content: "DMD results from loss-of-function mutations (65% large deletions, 10% duplications, 25% point mutations/small indels) in the DMD gene at Xp21.2, the largest human gene spanning 2.4 megabases. The reading frame rule predicts severity: out-of-frame mutations cause DMD (no functional dystrophin), while in-frame mutations cause the milder Becker muscular dystrophy (truncated but partially functional dystrophin). Dystrophin anchors the subsarcolemmal cytoskeleton to the dystrophin-associated glycoprotein complex, protecting the membrane during eccentric contractions. Loss of dystrophin leads to sarcolemmal microinjury, calcium-mediated protease activation, mitochondrial dysfunction, and chronic inflammatory fibrosis. The clinician manages the complete spectrum of DMD care including prescribing corticosteroids, initiating cardioprotective therapy, managing respiratory decline, overseeing molecular therapies (exon-skipping, gene therapy), and coordinating multidisciplinary care through disease progression."
    },
    riskFactors: [
      "X-linked recessive inheritance (1 in 3,500-5,000 male births)",
      "Maternal germline mosaicism (recurrence risk 7-10% even with de novo mutation)",
      "Large deletions in the central hotspot region (exons 45-55) of the DMD gene",
      "Out-of-frame mutations in the DMD gene (reading frame rule)",
      "Absent family history in one-third of cases (de novo mutations)"
    ],
    diagnostics: [
      "Order and interpret genetic testing: multiplex ligation-dependent probe amplification (MLPA) for deletions/duplications, sequencing for point mutations",
      "Prescribe and interpret serial pulmonary function tests: FVC <80% predicted triggers nocturnal monitoring, <50% requires NIV evaluation",
      "Order annual echocardiogram and cardiac MRI (more sensitive for early fibrosis detection)",
      "Order annual DEXA scan for bone density monitoring while on corticosteroids",
      "Evaluate serum CK, liver function (ALT/AST may be muscle-origin), renal function",
      "Order sleep study for nocturnal hypoventilation when FVC <50% predicted",
      "Monitor HbA1c and fasting glucose for steroid-induced diabetes"
    ],
    management: [
      "Prescribe deflazacort 0.9 mg/kg/day or prednisone 0.75 mg/kg/day (initiate by age 4-6)",
      "Manage corticosteroid side effects: calcium/vitamin D supplementation, bisphosphonates for osteoporosis",
      "Prescribe ACE inhibitor (enalapril/lisinopril) by age 10 or at first sign of cardiac dysfunction",
      "Add beta-blocker for progressive cardiomyopathy (carvedilol or metoprolol)",
      "Initiate nocturnal non-invasive ventilation (BiPAP) when FVC falls below 50% or with nocturnal desaturation",
      "Prescribe cough assist device when peak cough flow drops below 270 L/min",
      "Evaluate eligibility for exon-skipping therapy: eteplirsen (exon 51), golodirsen (exon 53), viltolarsen (exon 53), casimersen (exon 45)",
      "Prescribe stress-dose corticosteroids during illness or surgery (adrenal suppression)",
      "Coordinate with orthopedics for scoliosis surgery when Cobb angle exceeds 20-30 degrees"
    ],
    nursingActions: [
      "Prescribe and titrate corticosteroid therapy, monitoring for efficacy and adverse effects",
      "Manage cardiac surveillance program: echocardiogram, cardiac MRI, ECG at recommended intervals",
      "Evaluate and prescribe respiratory support devices based on pulmonary function trajectory",
      "Coordinate molecular therapy eligibility and administration (IV infusion therapies)",
      "Manage endocrine complications: growth failure, delayed puberty, adrenal insufficiency",
      "Prescribe immunization schedule including pneumococcal and influenza vaccines (avoid live vaccines on steroids)",
      "Coordinate advance care planning discussions with family at appropriate disease stage",
      "Manage acute illness with stress-dose steroids and early respiratory intervention"
    ],
    signs: {
      left: [
        "Onset age 2-5: delayed walking, Gower sign, calf pseudohypertrophy",
        "Progressive weakness: proximal > distal, lower > upper extremities",
        "Elevated CK (10,000-50,000+ IU/L at diagnosis)",
        "Positive genetic testing: DMD gene out-of-frame mutation",
        "Cognitive delay (average IQ ~85, one standard deviation below mean)"
      ],
      right: [
        "Loss of ambulation (age 10-13 without steroids, 13-15 with steroids)",
        "Dilated cardiomyopathy (EF decline, regional wall motion abnormalities)",
        "Restrictive lung disease (declining FVC, nocturnal hypoventilation)",
        "Severe scoliosis requiring surgical fixation",
        "Dysphagia and GI dysmotility in late stages",
        "Adrenal insufficiency from chronic corticosteroid use",
        "Osteoporosis and vertebral compression fractures"
      ]
    },
    medications: [
      { name: "Deflazacort (Emflaza)", type: "Corticosteroid", action: "Anti-inflammatory effects on muscle, stabilizes sarcolemma, reduces fibrosis, prolongs ambulation", sideEffects: "Weight gain, growth suppression, cushingoid facies, cataracts, behavioral changes, osteoporosis, glucose intolerance", contra: "Active systemic fungal infection", pearl: "FDA-approved for DMD at 0.9 mg/kg/day. CINRG trial showed 2.5-year prolongation of ambulation. Monitor: growth, DEXA, ophthalmology, HbA1c, blood pressure annually." },
      { name: "Enalapril", type: "ACE inhibitor", action: "Reduces afterload, prevents angiotensin II-mediated cardiac remodeling and fibrosis", sideEffects: "Hypotension, hyperkalemia, cough, renal impairment", contra: "Pregnancy, bilateral renal artery stenosis, angioedema history", pearl: "Start 0.1 mg/kg/day by age 10 or at first EF decline. Some protocols initiate at diagnosis based on evidence of early subclinical fibrosis. Monitor BMP at baseline, 1 week, and every 3-6 months." },
      { name: "Eteplirsen (Exondys 51)", type: "Phosphorodiamidate morpholino oligomer (exon-skipping)", action: "Binds pre-mRNA to exclude exon 51 during splicing, converting out-of-frame to in-frame mutation, producing truncated functional dystrophin", sideEffects: "Procedural pain, upper respiratory infection, cough, pyrexia, balance disorder", contra: "DMD mutations not amenable to exon 51 skipping", pearl: "Applicable to ~13% of DMD patients. Dose: 30 mg/kg IV weekly. Produces small amounts of dystrophin (~1% of normal). Accelerated FDA approval based on surrogate endpoint. Continue standard-of-care alongside molecular therapy." },
      { name: "Delandistrogene moxeparvovec (Elevidys)", type: "AAV-based gene therapy", action: "Delivers a micro-dystrophin transgene via rAAVrh74 vector to skeletal and cardiac muscle cells", sideEffects: "Vomiting, nausea, elevated liver enzymes, fever, thrombocytopenia (immune response to capsid)", contra: "Pre-existing AAV antibodies, active infection, immunocompromised state", pearl: "FDA-approved for ambulatory DMD ages 4-5. Single IV infusion. Requires corticosteroid immunosuppression before and after. Monitor liver function, platelets, and troponin. Represents a paradigm shift from symptom management to molecular correction." }
    ],
    pearls: [
      "The reading frame rule predicts phenotype: out-of-frame = DMD (severe), in-frame = Becker MD (milder)",
      "Cardiac MRI with late gadolinium enhancement detects myocardial fibrosis earlier than echocardiogram",
      "Adrenal crisis can occur during stress/illness in chronically steroid-treated patients; always prescribe stress-dose protocols",
      "Gene therapy (micro-dystrophin) represents a potential paradigm shift but requires long-term safety monitoring",
      "Nocturnal BiPAP initiated at FVC <50% predicted has been shown to extend survival significantly in DMD"
    ],
    quiz: [
      { question: "Which molecular mechanism differentiates Duchenne from Becker muscular dystrophy?", options: ["Different genes are affected", "Duchenne has out-of-frame mutations while Becker has in-frame mutations in the same gene", "Becker affects females while Duchenne affects males", "Duchenne involves mitochondrial DNA mutations"], correct: 1, rationale: "The reading frame rule explains the difference: out-of-frame mutations in the DMD gene produce no functional dystrophin (Duchenne), while in-frame mutations produce a truncated but partially functional protein (Becker). Both disorders involve the same gene." },
      { question: "At what FVC threshold should the clinician initiate nocturnal non-invasive ventilation in DMD?", options: ["<80% predicted", "<60% predicted", "<50% predicted or with nocturnal desaturation", "<30% predicted"], correct: 2, rationale: "Nocturnal BiPAP is initiated when FVC falls below 50% predicted or when sleep studies demonstrate nocturnal hypoventilation/desaturation. Early initiation of NIV has been shown to extend survival in DMD." },
      { question: "What percentage of DMD patients are eligible for eteplirsen (exon 51 skipping)?", options: ["All patients with DMD", "Approximately 50%", "Approximately 13%", "Less than 1%"], correct: 2, rationale: "Eteplirsen targets exon 51 skipping and is applicable to approximately 13% of DMD patients whose specific deletions are amenable to this approach. Genetic testing must confirm eligibility." }
    ]
  },

  "vp-shunt-management-rpn": {
    title: "Ventriculoperitoneal Shunt",
    image: imgVPShunt,
    cellular: {
      title: "CSF Diversion for Hydrocephalus",
      content: "A ventriculoperitoneal (VP) shunt is a surgically implanted device that diverts excess cerebrospinal fluid (CSF) from the ventricles of the brain to the peritoneal cavity, where it is reabsorbed. Hydrocephalus occurs when CSF production exceeds absorption, or when flow is obstructed, causing ventricular dilation and increased intracranial pressure (ICP). The shunt system consists of a proximal catheter (in the ventricle), a one-way valve, and a distal catheter (in the peritoneum). The nurse monitors for signs of shunt malfunction and increased ICP, reports changes immediately, and assists with pre- and post-operative care."
    },
    riskFactors: [
      "Premature birth with intraventricular hemorrhage",
      "Myelomeningocele (spina bifida)",
      "Congenital CNS malformations (Dandy-Walker, Chiari malformation)",
      "CNS infections (meningitis, ventriculitis)",
      "Brain tumors obstructing CSF pathways",
      "Post-surgical or post-traumatic hydrocephalus"
    ],
    diagnostics: [
      "Monitor head circumference and mark measurement location for consistency",
      "Monitor vital signs and report bradycardia or irregular respirations",
      "Report signs of increased ICP: persistent irritability, poor feeding, vomiting, bulging fontanelle",
      "Observe for sunset eyes (downward deviation of eyes)",
      "Report fever, which may indicate shunt infection",
      "Monitor surgical incision for signs of infection"
    ],
    management: [
      "Initiate seizure precautions pre-operatively",
      "Maintain head of bed elevation as ordered post-operatively",
      "Avoid lying on the operative side in the immediate post-operative period",
      "Monitor abdominal tenderness (risk for ileus, constipation, peritonitis)",
      "Report fever immediately as it may indicate shunt infection",
      "Test surgical site drainage for glucose (CSF contains glucose)"
    ],
    nursingActions: [
      "Measure head circumference at consistent marked location and document trends",
      "Assess fontanelle: report bulging or tense fontanelle",
      "Monitor for signs of increased ICP: high-pitched cry, lethargy, poor feeding, vomiting",
      "Report changes in level of consciousness immediately",
      "Assess shunt tract along the neck and chest for redness, swelling, or tenderness",
      "Reinforce parent education on shunt malfunction signs",
      "Report sunset eye sign (sclera visible above iris with downward gaze deviation)"
    ],
    signs: {
      left: [
        "Bulging anterior fontanelle (in infants)",
        "Increasing head circumference",
        "Sunset eyes (downward eye deviation)",
        "High-pitched cry",
        "Poor feeding and vomiting",
        "Lethargy and irritability",
        "Separated cranial sutures"
      ],
      right: [
        "Shunt malfunction: return of ICP symptoms",
        "Shunt infection: fever, redness along shunt tract",
        "Abdominal distension (distal catheter obstruction)",
        "Peritonitis (abdominal pain, rigidity, fever)",
        "Overdrainage: headache when upright, sunken fontanelle",
        "CSF leak from incision site (test for glucose)",
        "Seizures"
      ]
    },
    medications: [
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Temporarily reduces CSF production by inhibiting carbonic anhydrase in the choroid plexus", sideEffects: "Metabolic acidosis, electrolyte imbalance, drowsiness, tingling", contra: "Severe hepatic/renal disease, hyponatremia, hypokalemia", pearl: "May be used as a temporizing measure to reduce ICP before surgical shunt placement. Monitor electrolytes closely. Not a substitute for definitive shunt surgery." }
    ],
    pearls: [
      "Signs of shunt malfunction in infants include bulging fontanelle, increasing head circumference, sunset eyes, and high-pitched cry",
      "Shunt infections typically present within 1-2 months of surgery and require urgent treatment",
      "The shunt valve can sometimes be palpated behind the ear and may be assessed by the provider for pumping refill",
      "Shunts require revision surgeries as the child grows or if malfunction occurs",
      "Contact sports such as boxing and wrestling should be avoided to prevent shunt displacement"
    ],
    quiz: [
      { question: "Which finding should the nurse report immediately in an infant with a VP shunt?", options: ["Soft, flat fontanelle", "Bulging fontanelle with persistent irritability", "Normal feeding pattern", "Head circumference unchanged from last visit"], correct: 1, rationale: "A bulging fontanelle with persistent irritability indicates increased intracranial pressure and possible shunt malfunction. This requires immediate notification as it is a medical emergency." },
      { question: "What should the nurse assess if fluid is draining from the shunt incision site?", options: ["Test the drainage for glucose, as CSF contains glucose", "Assume it is normal wound drainage", "Apply a pressure dressing and wait", "Irrigate the site with saline"], correct: 0, rationale: "CSF contains glucose, and testing drainage from the shunt site for glucose helps determine if it is a CSF leak, which requires urgent medical attention." },
      { question: "Which sport should be avoided by a child with a VP shunt?", options: ["Swimming", "Wrestling", "Walking", "Cycling with a helmet"], correct: 1, rationale: "Contact sports such as wrestling and boxing should be avoided because they pose a risk of shunt displacement or disconnection from physical impact." }
    ]
  },

  "vp-shunt-management-rn": {
    title: "Ventriculoperitoneal Shunt",
    image: imgVPShunt,
    cellular: {
      title: "Hydrocephalus Pathophysiology",
      content: "Hydrocephalus results from imbalanced CSF dynamics: the choroid plexus produces approximately 500 mL/day of CSF, which flows from the lateral ventricles through the foramina of Monro, third ventricle, cerebral aqueduct, fourth ventricle, and into the subarachnoid space for reabsorption by arachnoid granulations. Obstruction at any point (obstructive/non-communicating) or impaired absorption (communicating) causes ventricular dilation and elevated ICP. The VP shunt bypasses the obstruction by directing CSF from a ventricular catheter through a pressure-regulated valve to the peritoneal cavity. The nurse manages comprehensive pre- and post-operative care, monitors for shunt complications (malfunction, infection, overdrainage), performs neurological assessments, and educates families on long-term shunt management."
    },
    riskFactors: [
      "Intraventricular hemorrhage of prematurity (most common cause in premature infants)",
      "Neural tube defects: myelomeningocele, Chiari II malformation",
      "Congenital aqueductal stenosis",
      "CNS infections: bacterial meningitis, TORCH infections",
      "Brain tumors (posterior fossa tumors in children)",
      "Post-hemorrhagic or post-infectious hydrocephalus",
      "Dandy-Walker malformation"
    ],
    diagnostics: [
      "Perform serial head circumference measurements and plot on age-appropriate growth curve",
      "Interpret CT/MRI findings: ventricular size, catheter position, periventricular edema",
      "Assess shunt function: valve palpation (should depress and refill), shunt series X-ray for catheter integrity",
      "Monitor for signs of shunt infection: CSF culture via shunt tap, WBC count, glucose, protein",
      "Evaluate for overdrainage: slit ventricle syndrome on imaging, positional headaches",
      "Monitor ICP signs: vital sign changes (Cushing triad), pupil reactivity, LOC",
      "Obtain shunt series (skull, chest, abdomen X-rays) to evaluate catheter continuity and position"
    ],
    management: [
      "Maintain seizure precautions pre- and post-operatively",
      "Position post-operatively on the non-operative side with HOB as ordered",
      "Monitor for abdominal complications: ileus, peritonitis, pseudocyst formation",
      "Implement infection prevention: meticulous wound care, hand hygiene, minimize shunt manipulation",
      "Administer antibiotics as prescribed for shunt infection (IV vancomycin + ceftazidime typically)",
      "Coordinate neurosurgical follow-up for shunt reprogramming or revision",
      "Educate family on emergency signs requiring immediate medical attention",
      "Coordinate early childhood development programs for developmental monitoring"
    ],
    nursingActions: [
      "Perform comprehensive neurological assessment: LOC, pupil response, motor function, cranial nerves",
      "Monitor vital signs for Cushing triad: hypertension, bradycardia, irregular respirations",
      "Assess operative site: incision integrity, CSF leak, infection signs, swelling along shunt tract",
      "Maintain strict I&O and monitor for post-operative fluid imbalances",
      "Teach parents signs of shunt malfunction: headache, vomiting, lethargy, personality changes, visual changes",
      "Teach parents signs of shunt infection: fever, redness/tenderness along shunt tract, wound drainage",
      "Coordinate imaging studies for suspected malfunction: CT scan, shunt series",
      "Manage pain with scheduled analgesics and non-pharmacological measures"
    ],
    signs: {
      left: [
        "Infants: bulging fontanelle, split sutures, increasing HC, sunset eyes, high-pitched cry",
        "Older children/adults: headache (worse in morning), nausea/vomiting, papilledema",
        "Cushing triad: hypertension, bradycardia, irregular respirations (late sign)",
        "Altered level of consciousness",
        "Visual disturbances (CN VI palsy)",
        "Gait changes",
        "Cognitive decline"
      ],
      right: [
        "Shunt malfunction: recurrence of hydrocephalus symptoms",
        "Shunt infection: fever, meningismus, wound erythema, abdominal pain",
        "Overdrainage/slit ventricle syndrome: positional headache, small ventricles on CT",
        "Distal catheter migration: abdominal pseudocyst, bowel perforation",
        "Proximal catheter obstruction: choroid plexus or tissue ingrowth",
        "Shunt disconnection: palpable gap in tubing, visible on X-ray",
        "Subdural hematoma/hygroma from overdrainage"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis; covers gram-positive organisms including MRSA and coagulase-negative staphylococci", sideEffects: "Red man syndrome (infusion-related), nephrotoxicity, ototoxicity", contra: "Known vancomycin hypersensitivity", pearl: "First-line for shunt infections (most commonly caused by S. epidermidis or S. aureus). Administer IV and sometimes intraventricularly. Monitor trough levels (15-20 mcg/mL for CNS infections)." },
      { name: "Ceftazidime", type: "Third-generation cephalosporin", action: "Inhibits bacterial cell wall synthesis; provides gram-negative coverage including Pseudomonas", sideEffects: "Diarrhea, rash, thrombocytopenia", contra: "Severe cephalosporin allergy", pearl: "Combined with vancomycin for empiric coverage of shunt infections. Provides CNS penetration. Duration of treatment is typically 10-14 days after shunt removal and externalization." },
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Reduces CSF production by 30-50% by inhibiting carbonic anhydrase in the choroid plexus", sideEffects: "Metabolic acidosis, hypokalemia, paresthesias, nephrolithiasis", contra: "Severe hepatic/renal disease, adrenal insufficiency, hyperchloremic acidosis", pearl: "Used as temporizing measure for hydrocephalus when surgery must be delayed. Combined with furosemide for additive CSF reduction. Not effective long-term; definitive surgical management is required." }
    ],
    pearls: [
      "Shunt infection occurs in 5-15% of cases, most commonly within 1-2 months of surgery; S. epidermidis is the most frequent pathogen",
      "Shunt malfunction is the most common complication requiring revision; 40% of shunts fail within 1 year",
      "In older children, shunt malfunction may present as personality changes, declining school performance, or headaches worse in the morning",
      "Programmable shunt valves may need reprogramming after MRI due to magnetic interference",
      "Emergency signs requiring immediate evaluation: sudden severe headache, vomiting, decreased consciousness, new seizures"
    ],
    quiz: [
      { question: "Which organism most commonly causes VP shunt infections?", options: ["Escherichia coli", "Staphylococcus epidermidis", "Pseudomonas aeruginosa", "Streptococcus pneumoniae"], correct: 1, rationale: "Staphylococcus epidermidis (coagulase-negative staphylococci) is the most common cause of VP shunt infections, typically introduced during surgery as skin flora contaminates the hardware." },
      { question: "A child with a VP shunt presents with morning headaches, vomiting, and declining school performance. What should the nurse suspect?", options: ["Migraine headache", "Gastroenteritis", "Shunt malfunction with increased ICP", "Sinusitis"], correct: 2, rationale: "Morning headaches, vomiting, and cognitive decline in a child with a VP shunt are classic signs of shunt malfunction causing increased intracranial pressure. This requires urgent imaging and neurosurgical evaluation." },
      { question: "What is the approximate failure rate of VP shunts within the first year?", options: ["5%", "15%", "40%", "75%"], correct: 2, rationale: "Approximately 40% of VP shunts fail within the first year, making shunt malfunction the most common complication. Families must be educated on lifelong monitoring for signs of shunt failure." }
    ]
  },

  "vp-shunt-management-np": {
    title: "Ventriculoperitoneal Shunt",
    image: imgVPShunt,
    cellular: {
      title: "Advanced CSF Dynamics and Shunt Physiology",
      content: "CSF is produced at 0.35 mL/min (~500 mL/day) primarily by the choroid plexus via active transport of Na+, Cl-, and HCO3- with osmotic water movement. Normal ICP is 5-15 mmHg in adults and 1.5-6 mmHg in infants. CSF absorption occurs at arachnoid granulations via pressure-dependent bulk flow. VP shunts use differential pressure valves (low, medium, high pressure), flow-regulated valves, or programmable valves (adjustable externally with magnetic tools) to regulate CSF drainage. The clinician manages the complete spectrum of shunt-dependent hydrocephalus: prescribing pre-operative medications, managing shunt valve pressure settings, treating shunt infections with targeted antimicrobial therapy, evaluating for endoscopic third ventriculostomy (ETV) candidacy, and managing long-term complications including slit ventricle syndrome, overdrainage, and shunt dependency."
    },
    riskFactors: [
      "Grade III-IV intraventricular hemorrhage in premature infants",
      "Post-meningitic hydrocephalus (Gram-negative organisms, TB meningitis)",
      "Posterior fossa tumors causing obstructive hydrocephalus",
      "Chiari II malformation with myelomeningocele",
      "Congenital aqueductal stenosis (X-linked or sporadic)",
      "Post-subarachnoid hemorrhage in adults",
      "Normal pressure hydrocephalus (NPH) in elderly (triad: dementia, gait apraxia, urinary incontinence)"
    ],
    diagnostics: [
      "Order and interpret CT/MRI for ventricular size, periventricular edema, and catheter position",
      "Order shunt series (skull-chest-abdomen X-rays) to evaluate catheter integrity and continuity",
      "Prescribe and interpret CSF studies from shunt tap: cell count, glucose, protein, gram stain, culture",
      "Evaluate Evans ratio on imaging (frontal horn width / biparietal diameter; >0.3 suggests ventriculomegaly)",
      "Order ophthalmologic evaluation for papilledema in older children",
      "Assess for NPH triad in elderly: gait apraxia, dementia, urinary incontinence",
      "Consider ICP monitoring (invasive or non-invasive) in complex or equivocal cases",
      "Evaluate ETV candidacy based on etiology, age, and MRI findings"
    ],
    management: [
      "Prescribe empiric antibiotics for suspected shunt infection: IV vancomycin + ceftazidime pending culture",
      "Coordinate shunt externalization and replacement for confirmed infection",
      "Manage programmable valve settings in collaboration with neurosurgery",
      "Prescribe acetazolamide (25-100 mg/kg/day divided) ± furosemide (1 mg/kg/day) for temporizing CSF reduction",
      "Evaluate and refer for endoscopic third ventriculostomy (ETV) as alternative to shunt revision in appropriate candidates",
      "Manage slit ventricle syndrome: upgrade to antisiphon or programmable valve, consider cranial expansion",
      "Prescribe seizure prophylaxis (levetiracetam) when indicated perioperatively",
      "Manage shunt-related abdominal complications: pseudocyst drainage, catheter repositioning",
      "Coordinate transition of care for shunt-dependent patients from pediatric to adult neurosurgery"
    ],
    nursingActions: [
      "Perform and interpret comprehensive neurological examination including fundoscopy",
      "Prescribe and interpret imaging for suspected shunt malfunction",
      "Manage antimicrobial therapy based on CSF culture and sensitivity results",
      "Adjust programmable shunt valve settings based on clinical response and imaging",
      "Evaluate developmental trajectory and prescribe early intervention services",
      "Manage endocrine complications in post-tumor hydrocephalus (pituitary dysfunction)",
      "Prescribe and monitor anticonvulsant therapy for shunt-related epilepsy",
      "Coordinate multidisciplinary care: neurosurgery, ophthalmology, developmental pediatrics, rehabilitation"
    ],
    signs: {
      left: [
        "Acute shunt malfunction: sudden headache, projectile vomiting, obtundation",
        "Chronic shunt malfunction: gradual cognitive decline, personality change, gait deterioration",
        "Cushing triad (late, ominous): hypertension, bradycardia, Cheyne-Stokes breathing",
        "Papilledema on fundoscopy",
        "CN VI palsy (false localizing sign of raised ICP)",
        "Infants: full fontanelle, distended scalp veins, setting sun sign"
      ],
      right: [
        "Shunt infection: fever, meningismus, wound dehiscence, peritonitis",
        "Overdrainage: orthostatic headache, subdural collections, slit ventricles",
        "Proximal obstruction: tissue/choroid plexus blocking ventricular catheter",
        "Distal obstruction: peritoneal adhesions, pseudocyst, catheter migration",
        "Shunt disconnection or fracture (seen on shunt series)",
        "Loculated (trapped) ventricle requiring separate shunt catheter",
        "Shunt nephritis (immune complex deposition, rare)"
      ]
    },
    medications: [
      { name: "Vancomycin (IV + intrathecal)", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis; bactericidal against gram-positive shunt pathogens", sideEffects: "Red man syndrome, nephrotoxicity, ototoxicity, thrombocytopenia", contra: "Vancomycin hypersensitivity", pearl: "IV dosing: 15 mg/kg q6h (target trough 15-20 mcg/mL). Intrathecal dosing: 5-20 mg/day via external ventricular drain. Treatment duration: 10-14 days after shunt removal. CSF penetration of IV vancomycin alone is poor, necessitating intrathecal administration in severe infections." },
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Reduces CSF production by 30-50% by inhibiting HCO3- and Na+ transport in choroid plexus epithelium", sideEffects: "Metabolic acidosis, hypokalemia, growth impairment (in chronic use), nephrolithiasis", contra: "Hepatic insufficiency, hyponatremia, hyperchloremic acidosis, adrenal failure", pearl: "Dose: 25-100 mg/kg/day divided TID-QID. Often combined with furosemide 1 mg/kg/day for additive effect. Monitor BMP weekly. Use as bridge to surgery, not as definitive treatment. Prolonged use in infants can impair growth." },
      { name: "Levetiracetam (Keppra)", type: "Anticonvulsant", action: "Modulates synaptic vesicle protein SV2A to reduce abnormal neuronal excitability", sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness", contra: "Hypersensitivity to levetiracetam", pearl: "First-line for perioperative seizure prophylaxis and shunt-related epilepsy due to minimal drug interactions and no hepatic enzyme induction. Dose: 20-60 mg/kg/day divided BID. No need for drug level monitoring in most cases." },
      { name: "Rifampin", type: "RNA polymerase inhibitor", action: "Inhibits bacterial RNA synthesis; excellent biofilm penetration for device-related infections", sideEffects: "Hepatotoxicity, orange discoloration of bodily fluids, drug interactions (CYP3A4 inducer)", contra: "Severe hepatic disease, concurrent protease inhibitors", pearl: "Added to vancomycin for shunt infections caused by biofilm-forming organisms (S. epidermidis). Excellent biofilm penetration. Never use as monotherapy (rapid resistance development). Monitor LFTs." }
    ],
    pearls: [
      "S. epidermidis causes 50-60% of shunt infections; biofilm formation on the device makes eradication difficult without shunt removal",
      "Endoscopic third ventriculostomy (ETV) is preferred over shunt revision in children >6 months with obstructive hydrocephalus",
      "The ETV Success Score (ETVSS) uses age, etiology, and prior shunt history to predict ETV success probability",
      "Programmable valves must be checked and potentially reprogrammed after any MRI, as the magnetic field can alter the valve setting",
      "Normal pressure hydrocephalus in elderly responds to shunting when gait apraxia is the predominant symptom (best prognostic indicator)"
    ],
    quiz: [
      { question: "Why is intrathecal vancomycin often added to IV vancomycin for VP shunt infections?", options: ["To reduce the total IV dose needed", "Because IV vancomycin has poor CSF penetration", "To prevent red man syndrome", "Because intrathecal administration is more convenient"], correct: 1, rationale: "IV vancomycin has poor penetration across the blood-brain barrier into the CSF. Intrathecal administration via an external ventricular drain ensures adequate drug concentration at the site of infection." },
      { question: "What is the most important consideration after a patient with a programmable VP shunt valve undergoes MRI?", options: ["Order a repeat CT scan", "Check and potentially reprogram the valve setting", "Replace the shunt immediately", "Prescribe antibiotics"], correct: 1, rationale: "MRI magnetic fields can alter the pressure setting of programmable VP shunt valves. The valve setting must be verified and reprogrammed if needed after any MRI to prevent over- or under-drainage." },
      { question: "Which symptom in the NPH triad has the best prognosis for improvement after VP shunt placement?", options: ["Dementia", "Gait apraxia", "Urinary incontinence", "All three improve equally"], correct: 1, rationale: "In normal pressure hydrocephalus, gait apraxia is the symptom most likely to improve after VP shunt placement and is the best prognostic indicator for shunt responsiveness. Dementia and urinary incontinence may partially improve but are less predictable." }
    ]
  }
};
