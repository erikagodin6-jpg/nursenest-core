import type { LessonContent } from "./types";

export const generatedBatch073Lessons: Record<string, LessonContent> = {
  "pediatric-pathophysiology-np": {
    title: "Bronchiolitis: Airway Narrowing in Infants",
    cellular: { title: "RSV Bronchiolitis Pathophysiology", content: "RSV infects bronchiolar epithelial cells via fusion protein-mediated entry, causing necrosis, ciliary destruction, peribronchiolar lymphocytic infiltration, submucosal edema, and mucus hypersecretion. In infants, bronchiolar lumens are less than 1 mm; even 1 mm of circumferential edema reduces cross-sectional area by approximately 75%. A ball-valve mechanism develops where air enters on inspiration but becomes trapped on expiration, causing hyperinflation, air trapping, ventilation-perfusion mismatch, and hypoxemia. The immature infant immune response produces an exaggerated inflammatory reaction with neutrophil and eosinophil recruitment, worsening airway obstruction." },
    riskFactors: ["Age less than 12 months (peak incidence 2-6 months)", "Prematurity (gestational age less than 37 weeks)", "Chronic lung disease or bronchopulmonary dysplasia", "Congenital heart disease with hemodynamically significant lesions", "Immunodeficiency (primary or acquired)", "Exposure to secondhand tobacco smoke", "Daycare attendance or older school-age siblings", "Lack of breastfeeding", "Low birth weight"],
    diagnostics: ["Clinical diagnosis based on history and physical examination (no routine labs required)", "Pulse oximetry for continuous SpO2 monitoring (most important objective measure)", "Nasal wash or nasopharyngeal aspirate for RSV rapid antigen testing or PCR (guides cohorting, not treatment)", "Chest X-ray only if diagnosis is uncertain or complications suspected (typically shows hyperinflation, peribronchial thickening, patchy atelectasis)", "ABG only for impending respiratory failure (rising PaCO2 indicates fatigue)", "CBC and CRP are NOT routinely recommended (do not change management)"],
    management: ["Supportive care is the mainstay: hydration, oxygen, nasal suctioning", "Supplemental oxygen for SpO2 consistently below 90% (AAP 2014 guideline)", "Nasal suctioning before feeds and PRN for airway clearance", "IV or NG fluids if oral intake is less than 50% of normal or respiratory rate exceeds 60-70", "High-flow nasal cannula (HFNC) for moderate-severe distress as escalation from standard O2", "Trial of nebulized hypertonic saline (3%) in inpatients to improve mucociliary clearance", "Albuterol and corticosteroids are NOT recommended routinely per AAP guidelines", "Palivizumab (Synagis) for RSV prophylaxis in eligible high-risk infants"],
    nursingActions: ["Continuous cardiorespiratory and SpO2 monitoring with appropriate alarm settings", "Bulb or wall suction of nasopharynx before feeds and PRN (primary nursing intervention)", "Assess respiratory status hourly: rate, effort, retractions, nasal flaring, grunting, auscultation", "Maintain hydration via frequent small oral feeds, NG, or IV as ordered", "Position infant with head of bed elevated 30 degrees or in upright position", "Implement contact and droplet isolation precautions; cohort RSV-positive patients", "Educate parents on signs of worsening (apnea, cyanosis, poor feeding, lethargy)"],
    assessmentFindings: ["Tachypnea (RR >60 in infants), nasal flaring, intercostal and subcostal retractions", "Expiratory wheezing and fine crackles on auscultation", "Prolonged expiratory phase with hyperinflated chest", "Hypoxemia (SpO2 <90-92%) indicating V/Q mismatch", "Apnea episodes especially in infants under 2 months or ex-premature infants", "Poor feeding, decreased urine output indicating dehydration", "Irritability progressing to lethargy with worsening hypoxia"],
    signs: {
      left: ["Nasal congestion with clear rhinorrhea", "Low-grade fever (38-38.5 C)", "Mild wheezing with adequate oral intake", "SpO2 92-95% on room air", "Active and alert between coughing episodes"],
      right: ["Apneic episodes or respiratory pauses", "SpO2 consistently below 90% on supplemental O2", "Severe retractions with grunting and head bobbing", "Lethargy or decreased responsiveness", "Cyanosis or mottled appearance"]
    },
    medications: [{
      name: "Palivizumab (Synagis)",
      type: "Monoclonal antibody (RSV prophylaxis)",
      action: "Binds to the RSV F protein on the viral surface, preventing viral fusion and entry into respiratory epithelial cells",
      sideEffects: "Injection site reactions, fever, rash, upper respiratory symptoms",
      contra: "History of severe hypersensitivity reaction to palivizumab",
      pearl: "Given IM monthly during RSV season (Nov-Mar); prophylaxis only, NOT treatment; indicated for preterm infants <29 weeks, infants with CLD or hemodynamically significant CHD"
    }, {
      name: "Hypertonic Saline (3%)",
      type: "Mucolytic/osmotic agent (nebulized)",
      action: "Draws water into the airway lumen via osmotic gradient, rehydrating airway surface liquid and improving mucociliary clearance of mucus plugs",
      sideEffects: "Bronchospasm (may pretreat with bronchodilator), cough",
      contra: "Severe bronchospasm, hypernatremia",
      pearl: "Evidence supports use in hospitalized infants to reduce length of stay; NOT recommended in the ED setting; administer with close monitoring for bronchospasm"
    }],
    pearls: ["Bronchiolitis is a CLINICAL diagnosis; routine labs, CXR, and viral testing do NOT change management", "AAP guidelines do NOT recommend routine use of bronchodilators or systemic corticosteroids for bronchiolitis", "Apnea may be the presenting symptom in very young infants (<2 months) and ex-premature infants", "The 1 mm rule: 1 mm of edema reduces an infant bronchiolar cross-sectional area by 75% vs only 19% in an adult", "Nasal suctioning is the single most effective nursing intervention since infants are obligate nose breathers until 4-6 months", "Dehydration risk increases when RR exceeds 60-70 because the infant cannot coordinate suck-swallow-breathe"],
    quiz: [
      {
        question: "A 3-month-old with RSV bronchiolitis has an SpO2 of 88%, severe intercostal retractions, and grunting. Which intervention should the NP prioritize?",
        options: ["Nebulized albuterol treatment", "Supplemental oxygen and preparation for HFNC or escalation of care", "Systemic corticosteroids IV", "Chest X-ray before any intervention"],
        correct: 1,
        rationale: "Oxygen is the priority for hypoxemia with SpO2 <90%. AAP guidelines do not recommend routine albuterol or corticosteroids for bronchiolitis. Imaging should not delay oxygenation in a child showing signs of respiratory failure."
      },
      {
        question: "Which infant is eligible for palivizumab (Synagis) prophylaxis?",
        options: ["A healthy full-term 4-month-old in daycare", "A 2-month-old born at 28 weeks gestation entering RSV season", "A 14-month-old with resolved bronchiolitis last season", "A 6-month-old with mild intermittent asthma"],
        correct: 1,
        rationale: "Palivizumab is indicated for preterm infants born at less than 29 weeks gestation during their first RSV season. It is not recommended for healthy full-term infants or for treatment of active infection."
      },
      {
        question: "Why does 1 mm of bronchiolar edema cause more severe obstruction in infants than in adults?",
        options: ["Infants have more bronchiolar smooth muscle causing bronchospasm", "Infant bronchioles have lumens less than 1 mm, so 1 mm of edema reduces cross-sectional area by 75%", "Infants produce more mucus than adults", "Infant bronchioles lack cartilaginous support entirely"],
        correct: 1,
        rationale: "The infant bronchiolar lumen is very small (<1 mm). Poiseuille's law dictates that resistance to airflow is inversely proportional to the fourth power of the radius. Even 1 mm of circumferential edema reduces cross-sectional area by approximately 75% in an infant vs 19% in an adult bronchus."
      }
    ]
  },
  "pediatric-prescribing-np": {
    title: "Pediatric Weight-Based Dosing",
    cellular: { title: "Developmental Pharmacokinetics in Children", content: "Pediatric pharmacokinetics differ from adults across all ADME parameters. Absorption is affected by higher gastric pH in neonates (achlorhydria until 2-3 months), slower gastric emptying, and variable first-pass metabolism. Distribution differs due to higher total body water (70-80% in neonates vs 55-60% in adults), lower protein binding (decreased albumin and alpha-1-acid glycoprotein), and an immature blood-brain barrier allowing greater CNS drug penetration. Hepatic metabolism matures at different rates for each CYP enzyme: CYP3A7 predominates in neonates and transitions to CYP3A4 by 6-12 months, while CYP2D6 reaches adult activity by 3-5 years. Renal elimination is reduced in neonates (GFR 2-4 mL/min at birth, reaching adult values by 1-2 years), requiring dose adjustments for renally cleared drugs." },
    riskFactors: ["Neonatal age (immature hepatic and renal function)", "Prematurity (further delays organ maturation)", "Obesity (altered volume of distribution for lipophilic drugs)", "Genetic polymorphisms in drug-metabolizing enzymes (CYP2D6 ultra-rapid metabolizers)", "Polypharmacy increasing drug interaction risk", "Dehydration or acute illness altering drug distribution", "Hepatic or renal impairment requiring dose adjustment", "Off-label drug use (majority of pediatric prescriptions)"],
    diagnostics: ["Accurate weight in kilograms on calibrated scale (basis for ALL dosing)", "Serum creatinine with age-adjusted reference ranges for renal dosing", "Therapeutic drug monitoring for narrow therapeutic index drugs (vancomycin, aminoglycosides, phenytoin, digoxin)", "Hepatic function panel (AST, ALT, bilirubin) before hepatically metabolized drugs", "Pharmacogenomic testing when available (CYP2D6 for codeine, TPMT for azathioprine)", "Body surface area calculation for chemotherapy and select drug dosing"],
    management: ["Calculate all doses in mg/kg using actual body weight; verify dose does not exceed maximum adult dose", "Use the Holliday-Segar formula for maintenance IV fluids (4-2-1 rule: 4 mL/kg/hr first 10 kg, 2 mL/kg/hr next 10 kg, 1 mL/kg/hr each additional kg)", "Select age-appropriate formulations (liquid for infants/toddlers, chewable for preschoolers, tablets/capsules for school-age)", "Implement mandatory independent double-check for high-alert medications (insulin, opioids, chemotherapy, anticoagulants)", "Adjust dosing intervals based on developmental pharmacokinetics (neonates often require extended intervals)", "Avoid medications contraindicated by age (aspirin <18 years, fluoroquinolones <18 years, tetracyclines <8 years)"],
    nursingActions: ["Verify weight in kilograms at every visit; recalculate doses with weight changes", "Perform independent dose verification: mg/kg calculation, total dose, maximum dose check", "Administer oral liquids with calibrated oral syringe (never household spoons)", "Educate parents on measuring devices, storage, and recognizing adverse effects", "Monitor therapeutic drug levels at appropriate timing (trough levels drawn 30 min before next dose)", "Document weight, calculated dose, route, site, and patient response"],
    assessmentFindings: ["Weight recorded in kilograms on calibrated scale at each encounter", "Signs of drug toxicity specific to prescribed medication class", "Signs of therapeutic response (fever resolution, pain reduction, infection clearance)", "Allergic reactions (urticaria, angioedema, anaphylaxis) after medication administration", "Hydration status affecting drug distribution and clearance"],
    signs: {
      left: ["Therapeutic drug levels within target range", "Expected clinical response to prescribed therapy", "Appropriate weight gain on growth trajectory", "No adverse drug reactions noted", "Adequate oral intake tolerating medication"],
      right: ["Signs of drug toxicity (lethargy, vomiting, seizures)", "Supratherapeutic drug levels", "Anaphylaxis or severe allergic reaction", "Medication error identified (wrong dose, wrong drug)", "Renal or hepatic dysfunction affecting drug clearance"]
    },
    medications: [{
      name: "Amoxicillin",
      type: "Aminopenicillin antibiotic",
      action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins",
      sideEffects: "Diarrhea, rash, nausea, vomiting, hypersensitivity reactions",
      contra: "Penicillin anaphylaxis; concurrent infectious mononucleosis (EBV rash)",
      pearl: "Standard dose 45 mg/kg/day divided BID; high-dose 80-90 mg/kg/day for resistant AOM; max 3 g/day"
    }, {
      name: "Ibuprofen",
      type: "NSAID (analgesic/antipyretic/anti-inflammatory)",
      action: "Inhibits cyclooxygenase-1 and -2, reducing prostaglandin synthesis to decrease pain, fever, and inflammation",
      sideEffects: "GI upset, GI bleeding, renal impairment with dehydration, platelet dysfunction",
      contra: "Age less than 6 months, dehydration, renal insufficiency, active GI bleeding, aspirin allergy",
      pearl: "Dose 10 mg/kg every 6-8 hours (max 40 mg/kg/day); can alternate with acetaminophen; avoid in dehydrated children due to renal risk"
    }],
    pearls: ["ALWAYS weigh in kilograms -- a weight in pounds used for mg/kg dosing is the most common source of 2.2x overdose errors", "Never exceed the maximum adult dose regardless of the child's weight", "Neonates require extended dosing intervals due to immature hepatic metabolism and reduced GFR", "The 10x dosing error is the most dangerous pediatric medication error -- decimal point errors in mg/kg calculations", "Codeine is contraindicated in children under 12 due to CYP2D6 ultra-rapid metabolizer risk causing fatal respiratory depression", "Off-label prescribing is common in pediatrics; document rationale and evidence supporting use"],
    quiz: [
      {
        question: "A 3-year-old weighing 15 kg is prescribed amoxicillin 90 mg/kg/day divided BID for acute otitis media. What is the correct dose per administration?",
        options: ["450 mg every 12 hours", "675 mg every 12 hours", "1350 mg every 12 hours", "90 mg every 12 hours"],
        correct: 1,
        rationale: "Total daily dose = 90 mg/kg/day x 15 kg = 1350 mg/day. Divided BID: 1350/2 = 675 mg every 12 hours. This does not exceed the maximum adult dose of 3 g/day."
      },
      {
        question: "Why do neonates require extended dosing intervals for many medications compared to older children?",
        options: ["Neonates have higher gastric pH increasing absorption speed", "Neonates have immature hepatic CYP enzymes and reduced GFR, prolonging drug half-life", "Neonates have more adipose tissue increasing volume of distribution", "Neonates have higher serum albumin increasing protein binding"],
        correct: 1,
        rationale: "Neonatal hepatic metabolism (CYP enzymes) and renal function (GFR 2-4 mL/min at birth) are immature, resulting in slower drug clearance and prolonged half-lives. Extended dosing intervals prevent drug accumulation and toxicity."
      },
      {
        question: "Which medication is contraindicated in all children under age 12 due to the risk of fatal respiratory depression in CYP2D6 ultra-rapid metabolizers?",
        options: ["Acetaminophen", "Ibuprofen", "Codeine", "Amoxicillin"],
        correct: 2,
        rationale: "Codeine is a prodrug converted to morphine by CYP2D6. Ultra-rapid metabolizers convert codeine to morphine at dangerously high rates, causing fatal respiratory depression. The FDA issued a black box warning contraindicating codeine in children under 12."
      }
    ]
  },
  "pediatric-red-flags-np": {
    title: "Pediatric Red Flags",
    cellular: { title: "Pathophysiology of Critical Pediatric Presentations", content: "Pediatric red flags represent clinical findings that indicate potentially life-threatening conditions requiring immediate evaluation. Children compensate for physiological stress differently than adults: tachycardia is the earliest sign of shock, while hypotension is a late and ominous finding indicating loss of approximately 25-30% of blood volume. The immature immune system in neonates produces blunted inflammatory responses, making fever in infants under 28 days a medical emergency requiring full sepsis workup because clinical appearance alone cannot exclude serious bacterial infection. Developmental regression (loss of previously acquired milestones) always indicates pathology such as neurodegenerative disease, brain tumor, or metabolic disorder and is never normal variation." },
    riskFactors: ["Neonatal age (under 28 days) with immature immune system", "Prematurity with associated organ immaturity", "Unimmunized or under-immunized status", "Congenital anomalies or chronic medical conditions", "History of non-accidental trauma or child maltreatment", "Immunocompromised state (primary or secondary)", "Recent neurosurgical procedure or VP shunt placement", "Exposure to infectious contacts or recent travel"],
    diagnostics: ["Full sepsis workup for febrile neonates under 28 days: CBC, blood culture, urinalysis, urine culture, lumbar puncture with CSF analysis", "CT head without contrast for new-onset focal seizures, altered mental status, or signs of increased ICP", "Blood glucose point-of-care testing for any child with altered mental status (hypoglycemia is reversible and must be excluded immediately)", "Toxicology screen for unexplained altered mental status, seizures, or cardiac dysrhythmias", "Skeletal survey and ophthalmologic exam for suspected non-accidental trauma", "Urgent echocardiography for cyanosis unresponsive to supplemental oxygen (suspect ductal-dependent cardiac lesion)"],
    management: ["Fever in neonate under 28 days: immediate IV access, empiric antibiotics (ampicillin + gentamicin or cefotaxime), hospitalization", "Hypoglycemia: immediate dextrose administration (D10W 2-5 mL/kg IV in neonates, D25W 2-4 mL/kg in older children)", "Suspected septic shock: aggressive IV fluid resuscitation 20 mL/kg isotonic crystalloid boluses up to 60 mL/kg in first hour", "Suspected increased ICP: elevate HOB 30 degrees, maintain midline head position, avoid hyperthermia and hypercarbia", "Cyanotic newborn: prostaglandin E1 infusion for ductal-dependent congenital heart disease", "Status epilepticus: benzodiazepine (IV lorazepam 0.1 mg/kg or IM midazolam 0.2 mg/kg) within 5 minutes of seizure onset"],
    nursingActions: ["Perform rapid assessment using Pediatric Assessment Triangle (appearance, work of breathing, circulation to skin)", "Obtain point-of-care glucose immediately for any child with altered mental status", "Establish IV/IO access within 5 minutes for critically ill children", "Initiate continuous cardiorespiratory monitoring and pulse oximetry", "Measure and record accurate weight in kilograms for emergency medication dosing", "Assess for signs of non-accidental trauma: patterned bruising, burns, injuries inconsistent with developmental stage", "Activate rapid response or emergency team for decompensating pediatric patients"],
    assessmentFindings: ["Fever ≥38.0°C rectally in infant under 28 days (medical emergency)", "Petechial or purpuric rash with fever (meningococcemia until proven otherwise)", "Bilious (green) emesis in a neonate (malrotation with volvulus until proven otherwise)", "Bulging fontanelle with irritability or lethargy (increased ICP or meningitis)", "Developmental regression at any age (always pathological)", "Non-blanching purpura (DIC, meningococcemia, ITP, HUS)", "Inconsolable crying with pallor and drawing up legs (intussusception)"],
    signs: {
      left: ["Mild URI symptoms with active and playful child", "Low-grade fever with known source and age over 3 months", "Age-appropriate developmental milestone achievement", "Single episode of non-bilious emesis with good hydration", "Minor bruising on shins and knees in mobile children"],
      right: ["Fever in neonate under 28 days", "Petechial rash with fever and toxic appearance", "Bilious vomiting in neonate (surgical emergency)", "Unresponsive or minimally responsive child", "Cyanosis unresponsive to supplemental oxygen"]
    },
    medications: [{
      name: "Ampicillin",
      type: "Aminopenicillin antibiotic (IV)",
      action: "Inhibits bacterial cell wall synthesis; covers Group B Strep, Listeria, and Enterococcus in neonatal sepsis",
      sideEffects: "Rash, diarrhea, hypersensitivity, seizures at high doses",
      contra: "Penicillin anaphylaxis",
      pearl: "Empiric neonatal sepsis coverage: ampicillin + gentamicin (or cefotaxime for meningitis); Listeria coverage is the reason ampicillin is included"
    }, {
      name: "Prostaglandin E1 (Alprostadil)",
      type: "Vasodilator/ductal maintenance agent",
      action: "Maintains patency of the ductus arteriosus by relaxing ductal smooth muscle, allowing mixing of oxygenated and deoxygenated blood in ductal-dependent cardiac lesions",
      sideEffects: "Apnea (most critical -- have intubation equipment ready), fever, flushing, hypotension, seizures",
      contra: "Respiratory distress syndrome (relative); have ventilatory support available",
      pearl: "Apnea occurs in 10-12% of neonates receiving PGE1; ALWAYS have intubation equipment at bedside; indicated for any cyanotic newborn unresponsive to O2 pending cardiology evaluation"
    }],
    pearls: ["Fever in a neonate under 28 days is a medical emergency -- full sepsis workup and empiric IV antibiotics regardless of clinical appearance", "Bilious (green) vomiting in a neonate is malrotation with volvulus until proven otherwise -- this is a surgical emergency", "Hypotension is a LATE sign of shock in children; tachycardia and poor perfusion are EARLY signs that must not be ignored", "Petechial rash with fever = meningococcemia until proven otherwise; initiate antibiotics immediately", "Always check blood glucose in any child with altered mental status -- hypoglycemia is the most rapidly reversible cause", "Developmental regression is NEVER normal and always requires urgent investigation"],
    quiz: [
      {
        question: "A 2-week-old neonate presents with a rectal temperature of 38.2°C. The infant appears well, is feeding normally, and has no focal findings. What is the appropriate NP action?",
        options: ["Reassure parents and recommend acetaminophen with follow-up in 24 hours", "Prescribe oral amoxicillin and close outpatient follow-up", "Obtain full sepsis workup, initiate empiric IV antibiotics, and admit to hospital", "Observe in the ED for 4 hours and discharge if afebrile"],
        correct: 2,
        rationale: "ANY fever ≥38.0°C rectally in an infant under 28 days requires full sepsis workup (blood culture, urinalysis/culture, LP) and empiric IV antibiotics regardless of clinical appearance. Neonatal immune immaturity means clinical appearance cannot reliably exclude serious bacterial infection."
      },
      {
        question: "A 10-day-old neonate presents with bilious (green) emesis. Which condition must be immediately excluded?",
        options: ["Pyloric stenosis", "Gastroesophageal reflux", "Malrotation with midgut volvulus", "Overfeeding"],
        correct: 2,
        rationale: "Bilious vomiting in a neonate is malrotation with midgut volvulus until proven otherwise. This is a time-critical surgical emergency because volvulus can cause complete mesenteric vascular occlusion leading to bowel necrosis within hours. An upper GI series is the diagnostic study of choice."
      },
      {
        question: "A cyanotic 2-day-old newborn does not improve with 100% FiO2 supplemental oxygen. What is the most appropriate next step?",
        options: ["Increase FiO2 and add CPAP", "Initiate prostaglandin E1 infusion and obtain urgent echocardiography", "Administer surfactant for suspected RDS", "Obtain chest X-ray and observe"],
        correct: 1,
        rationale: "Cyanosis unresponsive to supplemental oxygen (failed hyperoxia test) strongly suggests a ductal-dependent congenital heart lesion. PGE1 maintains ductus arteriosus patency to allow mixing of blood, while urgent echocardiography confirms the cardiac diagnosis. Always have intubation equipment ready as PGE1 causes apnea in 10-12% of neonates."
      }
    ]
  },
  "pediatrics-rn": {
    title: "Bronchiolitis & Croup",
    cellular: { title: "Pathophysiology of Bronchiolitis & Croup", content: "Bronchiolitis (primarily RSV) involves viral invasion of bronchiolar epithelial cells causing necrosis, edema, mucus hypersecretion, and small airway obstruction. In infants with bronchiolar lumens less than 1 mm, even 1 mm of edema reduces cross-sectional area by 75%, creating a ball-valve mechanism with air trapping, hyperinflation, and hypoxemia. Croup (laryngotracheobronchitis, primarily parainfluenza virus) involves subglottic inflammation below the cricoid cartilage, the narrowest portion of the pediatric airway. Subglottic edema of 1 mm reduces the infant airway cross-sectional area by approximately 60%, producing the classic triad of barking (seal-like) cough, inspiratory stridor, and hoarseness." },
    riskFactors: ["Age less than 12 months for bronchiolitis (peak 2-6 months)", "Age 6 months to 3 years for croup (peak incidence)", "Prematurity or bronchopulmonary dysplasia", "Congenital heart disease", "Daycare attendance and older siblings", "Exposure to secondhand smoke", "Lack of breastfeeding", "Fall and winter seasonality (RSV and parainfluenza)"],
    diagnostics: ["Pulse oximetry (most important objective measure for bronchiolitis)", "Respiratory rate count for full 60 seconds", "Clinical assessment of work of breathing (retractions, nasal flaring, grunting)", "Westley Croup Score assessment (stridor, retractions, air entry, cyanosis, level of consciousness)", "Chest X-ray only if diagnosis uncertain (bronchiolitis: hyperinflation; croup: steeple sign on AP neck film)", "Nasopharyngeal swab for RSV if needed for cohorting decisions"],
    management: ["Bronchiolitis: nasal suctioning (primary intervention), supplemental O2 for SpO2 <90%, IV/NG fluids if unable to feed", "Croup: cool mist or humidified air, single dose dexamethasone 0.6 mg/kg PO/IM, nebulized racemic epinephrine for moderate-severe stridor", "Position infant upright or with HOB elevated 30 degrees", "Maintain hydration with small frequent feeds; IV fluids if RR >60-70", "Contact and droplet isolation precautions for RSV-positive patients", "Observe for minimum 2-4 hours after racemic epinephrine for rebound stridor"],
    nursingActions: ["Perform continuous cardiorespiratory and SpO2 monitoring", "Suction nasopharynx before feeds and PRN (infants are obligate nose breathers)", "Assess respiratory status every 1-2 hours: rate, effort, breath sounds, SpO2", "Monitor and document hydration status: I&O, wet diapers, mucous membranes, fontanelle", "Keep the child calm -- crying and agitation worsen stridor in croup", "Administer nebulized racemic epinephrine as ordered; monitor for rebound effect 2-4 hours after treatment", "Educate parents on signs of respiratory deterioration requiring return to ED"],
    assessmentFindings: ["Bronchiolitis: wheezing, fine crackles, tachypnea, nasal flaring, retractions, prolonged expiration, hyperinflated chest", "Croup: barking seal-like cough, inspiratory stridor (worse at night and with agitation), hoarseness, low-grade fever", "Both: tachypnea, increased work of breathing, decreased oral intake", "Signs of respiratory failure: cyanosis, severe retractions, grunting, lethargy, diminished breath sounds", "Dehydration: sunken fontanelle, dry mucous membranes, decreased urine output"],
    signs: {
      left: ["Mild wheezing or stridor with adequate feeding", "SpO2 >92% on room air", "Low-grade fever with alert and interactive child", "Barking cough that improves with cool air exposure", "Slight nasal congestion with clear rhinorrhea"],
      right: ["Severe retractions with grunting and head bobbing", "SpO2 <90% on supplemental oxygen", "Apneic episodes or cyanosis", "Stridor at rest that does not improve with interventions", "Lethargy or decreased responsiveness"]
    },
    medications: [{
      name: "Dexamethasone",
      type: "Corticosteroid (glucocorticoid)",
      action: "Reduces subglottic inflammation and edema by suppressing inflammatory mediator release",
      sideEffects: "Hyperglycemia, GI upset, behavioral changes (irritability), immunosuppression with prolonged use",
      contra: "Active untreated systemic fungal infection; varicella or herpes exposure without immunity",
      pearl: "Single dose 0.6 mg/kg PO/IM for croup (max 16 mg); onset 2-4 hours, lasts 48-72 hours; effective even for mild croup reducing return visits"
    }, {
      name: "Racemic Epinephrine",
      type: "Alpha and beta adrenergic agonist (nebulized)",
      action: "Causes mucosal vasoconstriction reducing subglottic edema and improving airflow through the narrowed airway",
      sideEffects: "Tachycardia, tremor, pallor, rebound mucosal edema (stridor may worsen 2-4 hours after treatment)",
      contra: "Underlying cardiac arrhythmias, hypertrophic cardiomyopathy",
      pearl: "Observe patient for minimum 2-4 hours after administration for rebound stridor; effect lasts only 1-2 hours; may repeat if needed for severe stridor"
    }],
    pearls: ["Bronchiolitis is treated with supportive care ONLY: nasal suctioning, oxygen, and hydration; albuterol and steroids are NOT recommended per AAP", "Croup responds to a single dose of dexamethasone 0.6 mg/kg -- even mild croup benefits from steroid treatment", "NEVER examine the throat of a child with suspected epiglottitis (drooling, tripod positioning, toxic appearance) -- it can cause complete airway obstruction", "After racemic epinephrine, observe for minimum 2-4 hours for rebound stridor before discharge", "Inspiratory stridor = upper airway obstruction (croup); expiratory wheezing = lower airway obstruction (bronchiolitis)", "Keep children with croup CALM -- crying and agitation significantly worsen stridor"],
    quiz: [
      {
        question: "An 8-month-old with RSV bronchiolitis has an SpO2 of 88% and severe retractions. Which nursing intervention takes priority?",
        options: ["Administer nebulized albuterol", "Apply supplemental oxygen", "Obtain a chest X-ray", "Administer oral corticosteroids"],
        correct: 1,
        rationale: "Supplemental oxygen is the priority for hypoxemia (SpO2 <90%). AAP guidelines do NOT recommend routine albuterol or corticosteroids for bronchiolitis. Chest X-ray should not delay oxygen therapy."
      },
      {
        question: "A 2-year-old is admitted with croup after receiving nebulized racemic epinephrine in the ED. Which nursing assessment is most important?",
        options: ["Monitoring for rebound stridor for 2-4 hours after treatment", "Checking blood glucose every 2 hours", "Assessing bowel sounds for ileus", "Measuring head circumference"],
        correct: 0,
        rationale: "Racemic epinephrine provides temporary relief lasting only 1-2 hours. Rebound mucosal edema can cause stridor to return or worsen 2-4 hours after treatment. The child must be observed for this rebound effect before discharge."
      },
      {
        question: "A nurse notes that a child with croup has inspiratory stridor, while a child with bronchiolitis has expiratory wheezing. What does this difference indicate?",
        options: ["Both indicate lower airway obstruction", "Stridor indicates upper airway narrowing (extrathoracic); wheezing indicates lower airway obstruction (intrathoracic)", "Stridor indicates bronchospasm; wheezing indicates mucosal edema", "Both are normal findings in pediatric respiratory infections"],
        correct: 1,
        rationale: "Inspiratory stridor results from turbulent airflow through a narrowed extrathoracic upper airway (subglottic edema in croup). Expiratory wheezing results from intrathoracic lower airway obstruction (bronchiolar edema and mucus plugging in bronchiolitis)."
      }
    ]
  },
  "pediatrics-rpn": {
    title: "Pediatric Nursing Fundamentals for Practical Nurses",
    cellular: { title: "Growth, Development, and Physiological Principles in Pediatric Nursing", content: "Children are not small adults; their organ systems are developmentally immature with higher metabolic rates, more precarious fluid-electrolyte balance, and developing immune systems. Growth follows predictable patterns: birth weight doubles by 4-6 months and triples by 12 months, posterior fontanelle closes by 2-3 months, anterior fontanelle by 12-18 months. Development proceeds cephalocaudal (head to toe) and proximodistal (center to periphery). Vital sign ranges are age-dependent, and pediatric dehydration can progress rapidly because children have higher body surface area to weight ratios and greater insensible fluid losses." },
    riskFactors: ["Prematurity (immature organ systems, increased susceptibility to infection, respiratory distress, temperature instability)", "Low birth weight or failure to thrive", "Incomplete immunization status", "Exposure to secondhand tobacco smoke", "Socioeconomic factors including food insecurity and inadequate healthcare access", "Congenital anomalies or genetic conditions", "Developmental delay or disability"],
    diagnostics: ["Growth chart plotting: weight, length/height, and head circumference on age-appropriate WHO or CDC charts; investigate crossing of two or more percentile lines", "Developmental screening: Ages and Stages Questionnaire (ASQ) at 9, 18, 24, and 30 months; Denver Developmental Screening Test II (DDST-II)", "Vital signs with age-appropriate normals: HR (neonate 100-160, infant 80-140, toddler 80-130, school-age 70-110)", "Dehydration assessment: skin turgor, mucous membranes, fontanelle status, capillary refill (>2 sec abnormal), urine output (<1 mL/kg/hr in infants is oliguria)", "Immunization status review against recommended schedule", "Basic labs with pediatric reference ranges: newborn Hgb 14-24 g/dL declining to nadir 9-11 g/dL at 2-3 months"],
    management: ["Administer medications using strict weight-based dosing (mg/kg); verify dose does not exceed max adult dose; independent double-check before administration", "Calculate maintenance fluids using Holliday-Segar method: 100 mL/kg/day first 10 kg, 50 mL/kg/day next 10 kg, 20 mL/kg/day each additional kg", "Implement age-appropriate safety measures: crib rails up, choking hazard assessment, car seat safety education", "Provide oral rehydration therapy as first-line for mild-moderate dehydration with small frequent volumes of ORS", "Administer immunizations per recommended schedule following proper storage, route, and site guidelines", "Implement family-centered care: include parents in plan of care, encourage rooming-in, provide discharge education", "Provide anticipatory guidance: nutrition, sleep safety (back to sleep), car seat safety, poison prevention"],
    nursingActions: ["Weigh child in kilograms at each visit on same scale with minimal clothing -- basis for ALL medication dosing", "Assess vital signs using age-appropriate equipment: correct BP cuff size (40% arm circumference), full 60-second respiratory rate in infants", "Monitor fluid balance: record all I&O, weigh diapers (1 g = 1 mL urine), assess dehydration signs each shift", "Assess anterior fontanelle in infants: bulging suggests increased ICP, sunken suggests dehydration", "Apply atraumatic care: therapeutic play for procedure prep, perform painful procedures in treatment room (not bed), offer comfort items", "Administer oral medications to infants using oral syringe directed to inner cheek (never back of throat)", "Report and document signs of child maltreatment: unexplained bruises in non-mobile infants, patterned burns, inconsistent history"],
    assessmentFindings: ["Normal newborn: RR 30-60, HR 100-160, weight loss up to 10% first week with regain by day 10-14, physiological jaundice after 24 hours, positive Moro, rooting, Babinski reflexes", "Dehydration: mild (3-5%) slightly dry mucous membranes; moderate (6-9%) sunken fontanelle, tachycardia, oliguria; severe (10%+) hypotension, lethargy, absent urine output", "Respiratory distress: nasal flaring, grunting, retractions (substernal, intercostal, supraclavicular), head bobbing in infants", "Developmental red flags: no social smile by 2 months, not sitting by 9 months, not walking by 18 months, no words by 16 months, loss of skills at any age", "Circulatory compromise: tachycardia (earliest sign), prolonged capillary refill (>2 sec), mottled extremities, weak pulses; hypotension is a LATE sign"],
    signs: { left: ["Growth parameters tracking along expected percentile curves", "Achieving developmental milestones within expected time frames", "Mild URI symptoms with normal activity level", "Mild dehydration responding to oral rehydration therapy", "Low-grade fever with known viral illness and active child"], right: ["Severe dehydration (>10% weight loss, absent urine output, hypotension, lethargy)", "Signs of meningitis (bulging fontanelle, nuchal rigidity, fever, irritability or lethargy, petechial rash)", "Respiratory failure (cyanosis, severe retractions, grunting, bradycardia)", "Signs of shock (persistent tachycardia, prolonged capillary refill, hypotension, altered mental status)", "Fever in infant under 28 days (≥38.0°C rectally requires immediate sepsis workup)"] },
    medications: [{ name: "Acetaminophen (Tylenol Pediatric)", type: "Non-opioid analgesic/antipyretic", action: "Inhibits COX centrally reducing prostaglandin synthesis to lower hypothalamic thermoregulatory set point and decrease pain signaling", sideEffects: "Hepatotoxicity at supratherapeutic doses, nausea, rare allergic reactions", contra: "Severe hepatic impairment, active liver disease; caution with concurrent acetaminophen-containing products", pearl: "Dose 10-15 mg/kg every 4-6 hours (max 75 mg/kg/day or 4 g/day); safe from birth; infant drops and children's liquid have DIFFERENT concentrations -- always verify formulation" }, { name: "Amoxicillin", type: "Aminopenicillin antibiotic", action: "Inhibits bacterial cell wall synthesis; effective against common pediatric pathogens (S. pneumoniae, H. influenzae, M. catarrhalis)", sideEffects: "Diarrhea, diaper dermatitis, nausea, rash (especially with EBV infection), allergic reactions", contra: "Penicillin anaphylaxis; concurrent EBV infection (maculopapular rash risk)", pearl: "First-line for AOM: standard dose 45 mg/kg/day BID or high-dose 80-90 mg/kg/day BID for resistant organisms; always complete full course" }],
    pearls: ["Children are NOT small adults -- vital signs, medication doses, fluid requirements, and disease presentations differ by age group; always use age-specific reference ranges", "Hypotension is a LATE sign of shock in children -- tachycardia, prolonged capillary refill, and mottled skin are EARLY warnings", "The anterior fontanelle is a clinical window: bulging = increased ICP (meningitis, hydrocephalus); sunken = dehydration", "Weight in kilograms is the most important measurement in pediatric nursing -- it determines ALL medication doses and fluid calculations", "Fever in a neonate under 28 days (≥38.0°C rectally) is a medical emergency requiring immediate sepsis workup", "Oral rehydration therapy is first-line for mild-moderate dehydration and is as effective as IV fluids for most cases"],
    quiz: [{ question: "A practical nurse notes a sunken anterior fontanelle, dry mucous membranes, and decreased wet diapers in a 6-month-old. These findings are most consistent with which condition?", options: ["Increased intracranial pressure", "Dehydration", "Meningitis", "Normal developmental finding"], correct: 1, rationale: "A sunken fontanelle with dry mucous membranes and decreased urine output are classic signs of dehydration. A bulging fontanelle would suggest increased ICP. Report findings and monitor fluid status closely." }, { question: "A 3-year-old weighing 15 kg is prescribed amoxicillin 45 mg/kg/day divided BID for acute otitis media. What is the correct dose per administration?", options: ["225 mg every 12 hours", "337.5 mg every 12 hours", "675 mg every 12 hours", "45 mg every 12 hours"], correct: 1, rationale: "Total daily dose = 45 mg/kg/day x 15 kg = 675 mg/day. Divided BID: 675/2 = 337.5 mg per dose every 12 hours." }, { question: "An 8-month-old has HR 180, capillary refill 4 seconds, and mottled extremities with normal blood pressure. What do these findings suggest?", options: ["Pain requiring analgesics", "Compensated shock requiring immediate intervention", "Normal vital signs for this age", "Fever causing elevated heart rate"], correct: 1, rationale: "Tachycardia, prolonged capillary refill (>2 sec), and mottled extremities with maintained blood pressure indicate compensated shock. Children maintain blood pressure until 25-30% blood volume is lost; hypotension is a late and ominous sign." }]
  },
  "pediatric-triangle-rn": {
    title: "Pediatric Assessment Triangle (PAT)",
    cellular: { title: "Physiological Basis of the Pediatric Assessment Triangle", content: "The PAT is a rapid 30-second across-the-room assessment evaluating three domains. Appearance (TICLS mnemonic: Tone, Interactiveness, Consolability, Look/gaze, Speech/cry) reflects adequacy of ventilation, oxygenation, and brain perfusion -- it is the most important component. Work of Breathing assesses respiratory effort through nasal flaring, retractions, head bobbing, tripod positioning, and audible sounds (stridor, wheezing, grunting). Circulation to Skin evaluates cardiovascular function via pallor, mottling, and cyanosis. The PAT generates six physiological categories: stable (all normal), respiratory distress (abnormal WOB only), respiratory failure (abnormal appearance + WOB), compensated shock (abnormal circulation only), decompensated shock (abnormal appearance + circulation), and cardiopulmonary failure (all three abnormal)." },
    riskFactors: ["Age-related inability to verbalize symptoms (infants and pre-verbal children)", "Rapid physiological decompensation in pediatric patients", "Underlying chronic conditions masking acute deterioration", "Parental anxiety interfering with accurate history", "Limited pediatric assessment experience of healthcare team"],
    diagnostics: ["Complete PAT assessment within 30 seconds from across the room before touching the child", "Full vital signs with age-appropriate reference ranges after PAT", "Pulse oximetry for objective oxygenation assessment", "Point-of-care blood glucose for any child with abnormal appearance", "Pediatric Glasgow Coma Scale for quantifiable neurological assessment", "PEWS (Pediatric Early Warning Score) for ongoing monitoring and escalation decisions"],
    management: ["Stable (all PAT components normal): proceed with routine assessment and workup", "Respiratory distress (abnormal WOB, normal appearance): position of comfort, supplemental O2 PRN, treat underlying cause", "Respiratory failure (abnormal appearance + WOB): prepare for assisted ventilation, BVM with appropriately sized mask, advanced airway intervention", "Compensated shock (abnormal circulation, normal appearance): IV/IO access, 20 mL/kg isotonic fluid bolus, identify and treat cause", "Decompensated shock (abnormal appearance + circulation): aggressive fluid resuscitation, vasopressors, activate emergency team", "Cardiopulmonary failure (all three abnormal): initiate CPR, activate code team, full resuscitation per PALS algorithm"],
    nursingActions: ["Perform PAT before touching the child -- observe from doorway for appearance, breathing effort, and skin color", "Document PAT findings and physiological category in triage or initial assessment", "Reassess PAT after every intervention to evaluate treatment response", "Prioritize interventions based on PAT category: appearance abnormality takes precedence over isolated WOB changes", "Ensure appropriately sized resuscitation equipment is available (Broselow tape for length-based equipment sizing)", "Communicate PAT findings using structured handoff (SBAR) when escalating care"],
    assessmentFindings: ["Normal appearance: good muscle tone, interactive, consolable, makes eye contact, strong cry", "Abnormal appearance: limp or floppy tone, not interactive, inconsolable or no response to stimulation, glassy gaze, weak or absent cry", "Abnormal WOB: visible nasal flaring, intercostal/subcostal retractions, head bobbing, tripod positioning, audible stridor/wheezing/grunting", "Abnormal circulation: pallor (vasoconstriction), mottling (uneven perfusion), cyanosis (deoxygenation)", "Grunting: end-expiratory sound indicating the child is creating auto-PEEP to maintain alveolar recruitment -- sign of impending respiratory failure"],
    signs: {
      left: ["Normal tone with age-appropriate activity (TICLS normal)", "Mild tachypnea without retractions", "Pink skin with brisk capillary refill", "Strong cry and interactive behavior", "Consolable with parental comfort"],
      right: ["Limp tone or unresponsive to stimulation", "Severe retractions with grunting", "Mottling or central cyanosis", "Weak or absent cry", "Bradycardia (preterminal sign in children)"]
    },
    medications: [{
      name: "Epinephrine",
      type: "Catecholamine (alpha and beta agonist)",
      action: "Alpha-1: peripheral vasoconstriction increasing SVR; Beta-1: increases heart rate and contractility; Beta-2: bronchodilation",
      sideEffects: "Tachycardia, hypertension, dysrhythmias, tremor, tissue necrosis with extravasation",
      contra: "No absolute contraindications in cardiac arrest; caution with tachydysrhythmias",
      pearl: "PALS cardiac arrest dose: 0.01 mg/kg (0.1 mL/kg of 1:10,000) IV/IO every 3-5 minutes; use Broselow tape for rapid weight estimation and dosing"
    }, {
      name: "Normal Saline (0.9% NaCl)",
      type: "Isotonic crystalloid fluid",
      action: "Expands intravascular volume to improve cardiac output and tissue perfusion in shock states",
      sideEffects: "Hyperchloremic metabolic acidosis with large volumes, fluid overload, pulmonary edema",
      contra: "Caution in heart failure and renal failure; monitor for signs of fluid overload",
      pearl: "Pediatric shock bolus: 20 mL/kg over 5-20 minutes; may repeat up to 60 mL/kg in first hour; reassess PAT after each bolus"
    }],
    pearls: ["Appearance is the MOST important PAT component -- an abnormal appearance indicates more severe illness than isolated work of breathing changes", "The PAT is done in 30 seconds from across the room BEFORE touching the child -- observation first", "Grunting is a critical sign indicating the child is generating auto-PEEP to keep alveoli open -- prepare for respiratory failure management", "A child who goes from agitated to quiet and limp is NOT improving -- this progression suggests decompensation", "Bradycardia in a child is a preterminal sign usually from hypoxia; it requires immediate intervention", "Reassess PAT after EVERY intervention to evaluate response and adjust treatment plan"],
    quiz: [
      {
        question: "A nurse observes from the doorway that a 2-year-old has limp muscle tone, nasal flaring with intercostal retractions, and mottled skin. Using the PAT, what is the physiological category?",
        options: ["Respiratory distress", "Compensated shock", "Respiratory failure", "Cardiopulmonary failure"],
        correct: 3,
        rationale: "All three PAT components are abnormal: appearance (limp tone), work of breathing (nasal flaring, retractions), and circulation to skin (mottling). When all three are abnormal, the category is cardiopulmonary failure, requiring immediate resuscitation."
      },
      {
        question: "Which component of the PAT is the most important indicator of a child's severity of illness?",
        options: ["Work of breathing", "Circulation to skin", "Appearance (TICLS)", "Respiratory rate"],
        correct: 2,
        rationale: "Appearance (assessed using TICLS: Tone, Interactiveness, Consolability, Look/gaze, Speech/cry) is the most important PAT component because it reflects the adequacy of ventilation, oxygenation, and brain perfusion simultaneously."
      },
      {
        question: "A child with croup has inspiratory stridor and mild retractions but is alert, interactive, and consolable with pink skin. After nebulized racemic epinephrine, the child becomes quiet, limp, and pale. What does this change indicate?",
        options: ["The medication is working and the child is resting comfortably", "The child has improved from respiratory distress to stable", "The child has decompensated -- PAT now shows abnormal appearance and circulation requiring immediate intervention", "This is a normal response to racemic epinephrine"],
        correct: 2,
        rationale: "A child who goes from alert/interactive to quiet/limp is NOT improving -- this represents clinical decompensation. The PAT now shows abnormal appearance (limp, quiet) and circulation (pale), suggesting decompensated shock or respiratory failure. Immediate reassessment and escalation of care are required."
      }
    ]
  },
  "pediatric-vaccine-schedule-np": {
    title: "Pediatric Vaccine Schedule Overview",
    cellular: { title: "Immunological Basis of Vaccination", content: "Vaccines stimulate adaptive immunity by presenting antigens (inactivated organisms, live-attenuated organisms, toxoids, subunit proteins, or mRNA) to antigen-presenting cells, activating both humoral (B-cell antibody production) and cell-mediated (T-cell) immune responses. Primary vaccination produces IgM followed by class-switching to IgG, while booster doses stimulate memory B cells to mount a rapid, high-affinity IgG anamnestic response. Live vaccines (MMR, varicella, rotavirus) produce stronger and longer-lasting immunity but are contraindicated in immunocompromised patients. Conjugate vaccines (PCV13, Hib, MenACWY) link polysaccharide antigens to protein carriers, converting T-cell-independent responses to T-cell-dependent responses, enabling effective immunization in children under 2 years whose immune systems cannot mount adequate responses to polysaccharide antigens alone." },
    riskFactors: ["Missed or delayed immunizations due to parental vaccine hesitancy", "Immunocompromised state (contraindication for live vaccines: MMR, varicella, rotavirus, LAIV)", "History of severe allergic reaction (anaphylaxis) to vaccine component", "Moderate to severe acute illness (defer vaccination until recovered)", "Pregnancy (contraindication for live vaccines)", "Egg allergy history (relevant for influenza vaccine; MMR is safe in egg allergy)", "Preterm birth (follow chronological age schedule, not corrected age, except for Hepatitis B in infants <2 kg)"],
    diagnostics: ["Review immunization records at every visit against CDC/ACIP recommended schedule", "Check antibody titers (quantitative IgG) for vaccine-preventable diseases when immunization history is unknown or uncertain", "Assess for contraindications and precautions before each vaccine administration", "Screen for immunocompromised status before live vaccine administration", "Monitor for immediate adverse reactions for 15-30 minutes post-vaccination (15 min standard; 30 min for first-time injectable vaccines or history of syncope)", "Report adverse events through VAERS (Vaccine Adverse Event Reporting System)"],
    management: ["Follow ACIP catch-up schedule for children who are behind; minimum intervals must be observed but there is no need to restart a series", "Administer multiple vaccines at the same visit using different anatomical sites (separate limbs or sites at least 1 inch apart)", "Hepatitis B vaccine within 24 hours of birth for all newborns; add HBIG for infants born to HBsAg-positive mothers", "Administer live vaccines either simultaneously or separated by at least 28 days", "Defer vaccination during moderate-to-severe acute illness; mild illness with low-grade fever is NOT a contraindication", "Provide Vaccine Information Statements (VIS) to parents before each vaccination as required by federal law", "Prescribe catch-up immunizations for internationally adopted children based on serologic testing"],
    nursingActions: ["Verify vaccine name, dose, route, and site against orders and ACIP schedule before administration", "Check vaccine storage temperature logs (refrigerator 2-8°C, freezer -50 to -15°C depending on vaccine) to ensure cold chain integrity", "Administer IM vaccines in the vastus lateralis for infants <12 months and deltoid for children ≥12 months", "Use a 1-inch needle for IM injections in infants and appropriate length based on patient size", "Document vaccine name, manufacturer, lot number, expiration date, site, route, dose, and VIS date given in medical record", "Monitor for anaphylaxis for 15-30 minutes post-vaccination; have epinephrine available", "Provide anticipatory guidance: expected reactions (low-grade fever, injection site soreness), when to call provider"],
    assessmentFindings: ["Expected post-vaccination reactions: injection site erythema, swelling, and soreness; low-grade fever; irritability for 24-48 hours", "MMR-related rash and fever 7-12 days after vaccination (attenuated viral replication)", "Varicella vaccine: mild varicelliform rash 5-26 days after vaccination (up to 5% of recipients)", "Rotavirus vaccine: mild diarrhea and irritability within first week", "Signs of anaphylaxis: urticaria, angioedema, wheezing, stridor, hypotension, tachycardia within minutes of administration", "Signs of severe adverse reaction requiring VAERS reporting: encephalopathy, seizures, anaphylaxis, intussusception (rotavirus)"],
    signs: {
      left: ["Mild injection site redness and swelling", "Low-grade fever 24-48 hours post-vaccination", "Mild irritability or fussiness", "Expected MMR rash at 7-12 days post-vaccination", "Mild limping after thigh injection in infants"],
      right: ["Anaphylaxis (urticaria, angioedema, wheezing, hypotension)", "High fever >40.5°C within 48 hours of vaccination", "Seizure within 72 hours of vaccination", "Encephalopathy within 7 days of pertussis-containing vaccine", "Intussusception within 21 days of rotavirus vaccine"]
    },
    medications: [{
      name: "Epinephrine (1:1,000 IM)",
      type: "Catecholamine (emergency anaphylaxis treatment)",
      action: "Alpha-1 vasoconstriction reverses hypotension; Beta-1 increases cardiac output; Beta-2 bronchodilation reverses bronchospasm; mast cell stabilization reduces further mediator release",
      sideEffects: "Tachycardia, tremor, anxiety, headache, pallor",
      contra: "No absolute contraindications in anaphylaxis",
      pearl: "Pediatric dose: 0.01 mg/kg IM (max 0.3 mg) in anterolateral thigh; must be immediately available at all vaccination sites; may repeat every 5-15 minutes"
    }, {
      name: "Acetaminophen",
      type: "Antipyretic/analgesic",
      action: "Inhibits central COX reducing prostaglandin synthesis and lowering hypothalamic thermoregulatory set point",
      sideEffects: "Hepatotoxicity at supratherapeutic doses",
      contra: "Severe hepatic impairment",
      pearl: "10-15 mg/kg every 4-6 hours PRN for post-vaccination fever; do NOT give prophylactically before vaccination as it may reduce immune response"
    }],
    pearls: ["Mild illness with low-grade fever is NOT a contraindication to vaccination -- only moderate-to-severe acute illness warrants deferral", "Live vaccines (MMR, varicella, rotavirus, LAIV) are contraindicated in immunocompromised patients; inactivated vaccines are safe", "There is no need to restart a vaccine series if the schedule is interrupted -- just continue where you left off respecting minimum intervals", "MMR vaccine is safe in children with egg allergy (grown in chick embryo fibroblasts, not egg protein)", "Rotavirus is the only vaccine given orally; if the infant spits out the dose, do NOT re-administer", "Hepatitis B vaccine is given within 24 hours of birth; add HBIG within 12 hours for infants born to HBsAg-positive mothers"],
    quiz: [
      {
        question: "A parent brings a 15-month-old for well-child visit. The child has a mild runny nose and low-grade fever of 37.8°C. The parent asks if vaccines should be delayed. What is the NP's best response?",
        options: ["Defer all vaccines until the child is completely symptom-free", "Administer scheduled vaccines -- mild illness with low-grade fever is NOT a contraindication", "Administer only inactivated vaccines and defer live vaccines", "Prescribe prophylactic acetaminophen and vaccinate next week"],
        correct: 1,
        rationale: "Per ACIP guidelines, mild illness with or without low-grade fever is NOT a contraindication to vaccination. Only moderate-to-severe acute illness warrants deferral. Delaying vaccines unnecessarily leaves the child unprotected."
      },
      {
        question: "An HIV-positive child with a CD4 count of 12% is due for MMR vaccination. What should the NP do?",
        options: ["Administer MMR as scheduled since the child needs protection", "Defer MMR because live vaccines are contraindicated in severely immunocompromised patients (CD4 <15%)", "Administer MMR with concurrent IVIG", "Give a half-dose of MMR to reduce risk"],
        correct: 1,
        rationale: "MMR is a live vaccine and is contraindicated in severely immunocompromised patients. For HIV-positive children, MMR may be given if CD4 ≥15%, but is contraindicated if CD4 <15% due to risk of vaccine-strain disease."
      },
      {
        question: "Why are conjugate vaccines (PCV13, Hib) used instead of polysaccharide vaccines in children under 2 years of age?",
        options: ["Conjugate vaccines are less expensive", "Children under 2 cannot mount T-cell-independent responses to polysaccharide antigens alone; conjugation converts it to a T-cell-dependent response", "Polysaccharide vaccines cause more injection site reactions", "Conjugate vaccines require fewer booster doses"],
        correct: 1,
        rationale: "The immature immune system of children under 2 years cannot mount adequate T-cell-independent responses to polysaccharide antigens. Conjugating the polysaccharide to a protein carrier creates a T-cell-dependent response, enabling effective antibody production and immunological memory in young children."
      }
    ]
  },
  "peds-antibiotic-selection-np": {
    title: "Pediatric Antibiotic Selection",
    cellular: { title: "Principles of Pediatric Antimicrobial Therapy", content: "Pediatric antibiotic selection requires understanding that common pathogens differ by age: neonates are susceptible to Group B Streptococcus, E. coli, and Listeria; infants and toddlers to S. pneumoniae, H. influenzae, and M. catarrhalis; school-age children to Group A Streptococcus and S. aureus. Antibiotic pharmacokinetics differ in children due to developmental changes in renal and hepatic clearance, higher volume of distribution, and age-related differences in protein binding. Antimicrobial stewardship is critical because unnecessary antibiotic use promotes resistance, disrupts the developing microbiome (increasing risk of C. difficile, allergic disease, and obesity), and exposes children to adverse effects including tendon damage (fluoroquinolones), tooth discoloration (tetracyclines), and bone marrow suppression (chloramphenicol)." },
    riskFactors: ["Daycare attendance (increased exposure to resistant organisms)", "Recent antibiotic use within 30 days (selects for resistant flora)", "Recurrent infections suggesting immunodeficiency or anatomic abnormality", "Age-related pathogen susceptibility patterns", "Penicillin or cephalosporin allergy (limits first-line options)", "Immunocompromised state", "Foreign body or indwelling device (biofilm-associated infections)", "Incomplete immunization status (increased risk of invasive bacterial disease)"],
    diagnostics: ["Obtain appropriate cultures BEFORE initiating antibiotics when possible (blood, urine, CSF, wound)", "CBC with differential: leukocytosis with left shift suggests bacterial infection; lymphocytosis suggests viral", "C-reactive protein (CRP) and procalcitonin for differentiating bacterial from viral infection", "Urinalysis and urine culture for UTI (catheterized or suprapubic specimen in non-toilet-trained children)", "Rapid strep testing (RADT) with throat culture backup for negative RADT in children with pharyngitis", "Chest X-ray for suspected pneumonia (not routinely needed for outpatient community-acquired pneumonia)"],
    management: ["AOM first-line: amoxicillin 80-90 mg/kg/day divided BID for 10 days (ages <2 years) or 5-7 days (≥2 years)", "GAS pharyngitis: amoxicillin 50 mg/kg once daily (max 1000 mg) or 25 mg/kg BID x 10 days; penicillin V as alternative", "Community-acquired pneumonia: amoxicillin 90 mg/kg/day divided BID for outpatient typical bacterial; azithromycin for atypical", "UTI: cephalexin or TMP-SMX based on local resistance; culture-directed therapy once sensitivities available", "Neonatal sepsis: ampicillin + gentamicin empirically; add cefotaxime for suspected meningitis", "Watchful waiting appropriate for AOM in children ≥2 years with mild unilateral symptoms and reliable follow-up", "De-escalate or discontinue antibiotics when culture data confirms viral etiology"],
    nursingActions: ["Obtain cultures before first antibiotic dose -- culture accuracy decreases significantly after antibiotic exposure", "Calculate weight-based dose and independently verify before administration", "Assess for drug allergy history: differentiate true allergy (urticaria, anaphylaxis) from intolerance (GI upset)", "Monitor for adverse effects: diarrhea, rash, allergic reactions, C. difficile symptoms", "Educate parents on completing full antibiotic course, proper storage, and recognizing adverse effects", "Monitor therapeutic response: expect clinical improvement within 48-72 hours; report persistent fever or worsening symptoms"],
    assessmentFindings: ["AOM: bulging erythematous TM with decreased mobility on pneumatic otoscopy, otalgia, fever, irritability", "GAS pharyngitis: exudative tonsillar erythema, palatal petechiae, tender anterior cervical lymphadenopathy, absence of cough (Centor/McIsaac criteria)", "Pneumonia: tachypnea (most sensitive sign), fever, cough, crackles, decreased breath sounds, grunting in severe cases", "UTI in infants: fever without source, irritability, poor feeding, foul-smelling urine", "Cellulitis: expanding area of warmth, erythema, edema, tenderness; mark borders and reassess for progression"],
    signs: {
      left: ["Localized ear pain with erythematous but mobile TM (possible viral)", "Low-grade fever with clear rhinorrhea and cough (viral URI)", "Exudative pharyngitis with positive rapid strep test", "Mild UTI symptoms with positive urinalysis", "Small area of cellulitis without systemic symptoms"],
      right: ["Toxic appearance with high fever and petechial rash (meningococcemia)", "Periorbital or orbital cellulitis with proptosis or ophthalmoplegia", "Fever persisting >48-72 hours despite appropriate antibiotic therapy", "Signs of sepsis: tachycardia, poor perfusion, altered mental status", "C. difficile colitis: profuse watery diarrhea after antibiotic course"]
    },
    medications: [{
      name: "Amoxicillin",
      type: "Aminopenicillin antibiotic",
      action: "Bactericidal; inhibits cell wall synthesis by binding PBPs; covers S. pneumoniae, H. influenzae, Group A Strep",
      sideEffects: "Diarrhea, rash (especially with EBV), nausea, allergic reactions",
      contra: "Penicillin anaphylaxis; concurrent EBV (mononucleosis)",
      pearl: "First-line for AOM, GAS pharyngitis, and outpatient CAP; high-dose 80-90 mg/kg/day overcomes intermediate penicillin resistance in S. pneumoniae"
    }, {
      name: "Ceftriaxone",
      type: "Third-generation cephalosporin",
      action: "Bactericidal; broad-spectrum cell wall synthesis inhibitor; excellent CSF penetration for meningitis coverage",
      sideEffects: "Diarrhea, rash, biliary sludging (pseudolithiasis), injection site pain",
      contra: "Neonates with hyperbilirubinemia; NEVER co-infuse with calcium-containing solutions in neonates (risk of fatal ceftriaxone-calcium precipitates)",
      pearl: "Single IM dose (50 mg/kg) for AOM treatment failure; empiric meningitis coverage at 100 mg/kg/day divided q12h with vancomycin"
    }, {
      name: "Azithromycin",
      type: "Macrolide antibiotic",
      action: "Bacteriostatic; binds 50S ribosomal subunit inhibiting protein synthesis; covers atypical organisms (Mycoplasma, Chlamydophila)",
      sideEffects: "GI upset (nausea, diarrhea, abdominal pain), QT prolongation, hepatotoxicity (rare)",
      contra: "History of cholestatic jaundice with prior azithromycin use; QT prolongation risk",
      pearl: "First-line for atypical pneumonia (Mycoplasma) in children ≥5 years; 10 mg/kg day 1 then 5 mg/kg days 2-5; alternative for penicillin-allergic patients"
    }],
    pearls: ["Obtain cultures BEFORE antibiotics whenever possible -- even a single dose significantly reduces culture yield", "High-dose amoxicillin (80-90 mg/kg/day) overcomes intermediate penicillin resistance in S. pneumoniae by achieving higher middle ear concentrations", "Watchful waiting for AOM is appropriate in children ≥2 years with mild, unilateral symptoms and reliable follow-up", "Ceftriaxone is CONTRAINDICATED with calcium-containing IV solutions in neonates due to risk of fatal precipitate formation", "Fluoroquinolones are generally avoided in children <18 due to risk of tendon and cartilage damage (exceptions exist for complicated UTI, anthrax)", "If no clinical improvement in 48-72 hours, reassess diagnosis and consider broadening coverage, imaging, or culture-directed therapy"],
    quiz: [
      {
        question: "A 3-year-old with bilateral acute otitis media and fever of 39°C has failed initial amoxicillin therapy after 72 hours. What is the most appropriate next step?",
        options: ["Continue amoxicillin for 3 more days", "Switch to high-dose amoxicillin-clavulanate 90 mg/kg/day", "Prescribe azithromycin", "Discontinue antibiotics and observe"],
        correct: 1,
        rationale: "For AOM treatment failure after 48-72 hours of amoxicillin, the recommended second-line agent is high-dose amoxicillin-clavulanate (90 mg/kg/day of amoxicillin component). The clavulanate provides beta-lactamase coverage for resistant H. influenzae and M. catarrhalis."
      },
      {
        question: "Why is ceftriaxone contraindicated for IV use in neonates receiving calcium-containing solutions?",
        options: ["Ceftriaxone causes hepatotoxicity in neonates", "Ceftriaxone-calcium precipitates can form in lungs and kidneys causing fatal reactions", "Calcium inactivates ceftriaxone rendering it ineffective", "Neonates cannot metabolize ceftriaxone"],
        correct: 1,
        rationale: "Ceftriaxone can form insoluble precipitates with calcium ions. In neonates, these precipitates have been found in lungs and kidneys at autopsy, causing fatal cardiopulmonary events. Ceftriaxone must never be co-infused with calcium-containing solutions in neonates."
      },
      {
        question: "A 7-year-old presents with gradual-onset nonproductive cough, low-grade fever, and bilateral fine crackles. Chest X-ray shows bilateral interstitial infiltrates. What is the most likely pathogen and first-line treatment?",
        options: ["S. pneumoniae; amoxicillin", "Mycoplasma pneumoniae; azithromycin", "H. influenzae; amoxicillin-clavulanate", "Group A Streptococcus; penicillin"],
        correct: 1,
        rationale: "The presentation (school-age child, gradual onset, nonproductive cough, bilateral interstitial infiltrates) is classic for atypical (walking) pneumonia caused by Mycoplasma pneumoniae. First-line treatment is azithromycin, which provides excellent coverage for atypical organisms."
      }
    ]
  },
  "peds-heent": {
    title: "Otitis Media and Conjunctivitis",
    cellular: { title: "Pathophysiology of Otitis Media and Conjunctivitis", content: "Otitis media results from eustachian tube dysfunction: the pediatric eustachian tube is shorter, more horizontal, and more compliant than in adults, impairing middle ear ventilation and drainage. Viral URI causes mucosal edema and obstruction, creating conditions for bacterial colonization by S. pneumoniae, non-typeable H. influenzae, and M. catarrhalis. Conjunctivitis involves inflammation of the conjunctival membrane classified as bacterial (purulent discharge, often unilateral initially), viral (watery discharge, preauricular lymphadenopathy, bilateral), or allergic (bilateral itching, watery discharge, chemosis). Neonatal conjunctivitis (ophthalmia neonatorum) requires urgent evaluation to exclude gonococcal infection, which can rapidly progress to corneal perforation." },
    riskFactors: ["Age 6 months to 2 years (peak AOM incidence)", "Daycare attendance (increased pathogen exposure)", "Bottle-feeding in supine position (milk pooling near eustachian tube)", "Pacifier use after 6 months of age", "Exposure to secondhand smoke", "Craniofacial anomalies (cleft palate, Down syndrome -- altered eustachian tube anatomy)", "Family history of recurrent otitis media", "Lack of breastfeeding (reduced passive immunity transfer)"],
    diagnostics: ["Pneumatic otoscopy: assess TM color, position, mobility, and translucency (gold standard for AOM diagnosis)", "Tympanometry for middle ear effusion assessment when pneumatic otoscopy is inconclusive", "Conjunctival swab culture for neonatal conjunctivitis or suspected gonococcal/chlamydial infection", "Visual acuity screening at well-child visits starting at age 3-4 years", "Hearing screening with audiometry for children with recurrent AOM or persistent effusion >3 months", "Fluorescein staining if corneal involvement suspected with conjunctivitis"],
    management: ["AOM: amoxicillin 80-90 mg/kg/day BID x 10 days (<2 years) or 5-7 days (≥2 years); watchful waiting option for mild symptoms in children ≥2 years", "Treatment failure AOM: amoxicillin-clavulanate 90 mg/kg/day or single dose ceftriaxone 50 mg/kg IM", "Bacterial conjunctivitis: erythromycin ophthalmic ointment or polymyxin-trimethoprim drops; resolves 5-7 days even without treatment", "Viral conjunctivitis: supportive care with cool compresses and artificial tears; highly contagious for 10-14 days", "Allergic conjunctivitis: avoid allergens, cool compresses, antihistamine drops (olopatadine, ketotifen)", "Gonococcal ophthalmia neonatorum: IV/IM ceftriaxone 25-50 mg/kg plus saline eye irrigation; ophthalmology consult"],
    nursingActions: ["Position child for otoscopic exam: infant supine with head turned, toddler on parent's lap with head stabilized", "Pull pinna down and back for infants, up and back for children over 3 years for proper otoscopic visualization", "Administer ear drops: warm to body temperature, position affected ear up for 3-5 minutes after instillation", "Teach parents to administer ophthalmic ointment or drops: pull lower lid down, apply to inner canthus", "Instruct on infection control for conjunctivitis: hand hygiene, no sharing towels/pillows, keep child home from daycare until discharge resolves", "Assess hearing and speech development in children with recurrent AOM or persistent effusion", "Educate parents on AOM prevention: upright feeding position, avoid secondhand smoke, complete vaccinations (PCV13, influenza)"],
    assessmentFindings: ["AOM: bulging, erythematous, opacified TM with decreased or absent mobility on pneumatic otoscopy; otalgia, fever, irritability, ear tugging in infants", "Otitis media with effusion (OME): retracted TM with air-fluid levels or bubbles, conductive hearing loss, no acute infection signs", "Bacterial conjunctivitis: mucopurulent discharge, eyelid crusting (especially upon waking), conjunctival injection", "Viral conjunctivitis: watery discharge, preauricular lymphadenopathy, conjunctival injection, often follows URI", "Allergic conjunctivitis: bilateral itching (hallmark), chemosis, watery discharge, allergic shiners, cobblestone papillae on tarsal conjunctiva"],
    signs: {
      left: ["Mild ear pain with mobile TM and clear effusion (OME)", "Unilateral conjunctival injection with watery discharge", "Low-grade fever with mild irritability", "Clear rhinorrhea preceding ear symptoms", "Child interactive and feeding well"],
      right: ["Bulging erythematous TM with purulent drainage (TM perforation)", "Periorbital swelling with restricted eye movement (orbital cellulitis)", "High fever with toxic appearance and mastoid tenderness (acute mastoiditis)", "Neonatal purulent eye discharge within first 5 days of life (gonococcal ophthalmia)", "Facial nerve palsy associated with acute otitis media (rare complication)"]
    },
    medications: [{
      name: "Amoxicillin",
      type: "Aminopenicillin antibiotic",
      action: "Bactericidal; inhibits cell wall synthesis; first-line coverage for S. pneumoniae in AOM",
      sideEffects: "Diarrhea, rash, nausea, diaper dermatitis, allergic reactions",
      contra: "Penicillin anaphylaxis; concurrent EBV infection",
      pearl: "High-dose 80-90 mg/kg/day BID overcomes intermediate penicillin resistance; always complete full course to prevent treatment failure"
    }, {
      name: "Erythromycin Ophthalmic Ointment (0.5%)",
      type: "Macrolide antibiotic (topical ophthalmic)",
      action: "Bacteriostatic; inhibits bacterial protein synthesis at 50S ribosome; broad coverage for common conjunctival pathogens",
      sideEffects: "Temporary blurred vision, mild burning on application",
      contra: "Known macrolide hypersensitivity",
      pearl: "Applied prophylactically to all newborns within 1 hour of birth to prevent gonococcal ophthalmia neonatorum; also first-line treatment for pediatric bacterial conjunctivitis"
    }],
    pearls: ["Pneumatic otoscopy (assessing TM mobility) is the gold standard for AOM diagnosis -- a bulging TM with decreased mobility is the most specific finding", "Pull pinna DOWN and BACK in infants; UP and BACK in children over 3 for proper otoscopic visualization", "Watchful waiting for AOM is appropriate in children ≥2 years with mild unilateral symptoms and reliable follow-up within 48-72 hours", "Erythromycin ophthalmic ointment is given to ALL newborns within 1 hour of birth to prevent gonococcal ophthalmia neonatorum", "Neonatal conjunctivitis with purulent discharge in the first 5 days of life is gonococcal until proven otherwise -- this is an ophthalmic emergency", "Recurrent AOM (≥3 episodes in 6 months or ≥4 in 12 months) may warrant ENT referral for tympanostomy tube placement"],
    quiz: [
      {
        question: "A nurse is preparing to perform an otoscopic examination on a 9-month-old infant. How should the pinna be positioned?",
        options: ["Pull up and back", "Pull down and back", "Pull straight out laterally", "No manipulation needed in infants"],
        correct: 1,
        rationale: "In infants and children under 3 years, the external ear canal is directed upward, so the pinna should be pulled down and back to straighten the canal for visualization. In children over 3 years and adults, the pinna is pulled up and back."
      },
      {
        question: "A 2-day-old newborn develops copious purulent eye discharge bilaterally. Which action is the priority?",
        options: ["Apply warm compresses and reassess in 24 hours", "Obtain conjunctival cultures and initiate systemic ceftriaxone for suspected gonococcal ophthalmia", "Start erythromycin ophthalmic ointment only", "Irrigate eyes with sterile saline and observe"],
        correct: 1,
        rationale: "Purulent conjunctival discharge in a neonate within the first 5 days of life is gonococcal ophthalmia neonatorum until proven otherwise. This is an ophthalmic emergency that requires systemic antibiotics (ceftriaxone) because gonococcal infection can cause corneal perforation and blindness within 24 hours."
      },
      {
        question: "Which finding on pneumatic otoscopy is MOST specific for acute otitis media?",
        options: ["Erythematous tympanic membrane", "Bulging tympanic membrane with decreased mobility", "Air-fluid levels behind the tympanic membrane", "Retracted tympanic membrane"],
        correct: 1,
        rationale: "A bulging TM with decreased or absent mobility on pneumatic otoscopy is the most specific finding for AOM. Erythema alone can result from crying. Air-fluid levels and retraction suggest otitis media with effusion (OME) without acute infection."
      }
    ]
  },
  "peds-neuro": {
    title: "Pediatric Neurological Conditions and Seizures",
    cellular: { title: "Pathophysiology of Pediatric Neurological Conditions", content: "The pediatric nervous system differs from adults because myelination, synapse formation, and neural pathway refinement continue throughout childhood. The immature brain has a lower seizure threshold because inhibitory GABA pathways are not fully developed while excitatory glutamate pathways are more active. Febrile seizures (2-5% of children ages 6 months to 5 years) occur during rapid temperature rise due to this lowered threshold. Pediatric brain tumors are commonly infratentorial (posterior fossa), unlike adult supratentorial tumors, explaining why children present with signs of increased ICP from CSF obstruction and cerebellar dysfunction (ataxia, nystagmus) rather than focal cortical deficits. Meningitis in neonates presents atypically without classic meningeal signs because neck muscles are undeveloped." },
    riskFactors: ["Age 6 months to 5 years (febrile seizures)", "Prematurity", "Family history of seizures or neurological conditions", "Recent illness or infection", "History of meningitis or encephalitis", "Congenital brain malformations", "Head trauma or non-accidental injury", "Immunocompromised state"],
    diagnostics: ["Temperature assessment in all pediatric patients with altered consciousness", "Head circumference measurement plotted on growth chart in children under 2", "CT or MRI for new-onset seizures, focal deficits, or suspected mass", "Pediatric Glasgow Coma Scale for age-appropriate neurological assessment", "Lumbar puncture if meningitis suspected (after ruling out raised ICP)", "Developmental milestone screening with report of any regression"],
    management: ["During seizure: protect from injury, do not restrain, time the seizure, turn to side after", "Febrile seizures: treat fever with acetaminophen or ibuprofen after seizure resolves", "Maintain seizure precautions with padded side rails and suction available", "Keep environment calm and minimize stimulation for neurologically impaired children", "Position with HOB elevated for raised ICP; maintain midline head position", "Support nutrition and hydration with age-appropriate modifications"],
    nursingActions: ["Assess neurological status using age-appropriate tools (Pediatric GCS, fontanelle assessment)", "Monitor temperature and treat fever promptly in seizure-prone children", "Time and document all seizure activity (type, duration, pre-ictal and post-ictal behavior)", "Measure head circumference and compare to previous measurements", "Assess developmental milestones and report any regression", "Educate parents about febrile seizure management and when to seek emergency care", "Maintain safety precautions appropriate to developmental level", "Provide emotional support to parents and family"],
    assessmentFindings: ["Febrile seizure: rapid temperature rise with generalized tonic-clonic activity, post-ictal drowsiness", "Infant meningitis: poor feeding, irritability, lethargy, high-pitched cry, bulging fontanelle", "Increased ICP in infants: bulging fontanelle, setting-sun eyes, increasing head circumference", "Brain tumor: morning headache, vomiting, ataxia, personality changes, visual disturbances", "Developmental regression: loss of previously achieved milestones"],
    signs: {
      left: ["Febrile seizure activity", "Bulging fontanelle", "High-pitched cry", "Poor feeding", "Developmental regression"],
      right: ["Setting-sun eyes", "Increased head circumference", "Ataxia and coordination problems", "Morning vomiting", "Irritability or lethargy"]
    },
    medications: [{
      name: "Acetaminophen",
      type: "Antipyretic/Analgesic",
      action: "Reduces fever by acting on the hypothalamic heat-regulating center",
      sideEffects: "Hepatotoxicity at excessive doses",
      contra: "Severe hepatic impairment",
      pearl: "Weight-based dosing 10-15 mg/kg every 4-6 hours (max 5 doses/day); do NOT give aspirin to children under 18 (Reye syndrome risk)"
    }, {
      name: "Ceftriaxone",
      type: "Third-generation cephalosporin",
      action: "Inhibits bacterial cell wall synthesis; broad-spectrum coverage including common meningitis pathogens",
      sideEffects: "Diarrhea, rash, injection site pain",
      contra: "Cephalosporin allergy, neonates receiving IV calcium",
      pearl: "Empiric meningitis treatment pending culture results; combined with vancomycin; administer immediately when meningitis is suspected, do not delay for LP"
    }],
    pearls: ["Simple febrile seizures are benign and do NOT require anticonvulsant treatment; parents need reassurance", "In infants, classic meningeal signs (nuchal rigidity, Kernig, Brudzinski) are often ABSENT; look for poor feeding, irritability, bulging fontanelle", "Developmental regression (loss of previously acquired skills) is ALWAYS abnormal and requires urgent investigation", "Never give aspirin to children under 18 due to Reye syndrome risk", "Morning vomiting with headache in a child should raise concern for brain tumor until proven otherwise", "Pediatric GCS uses modified verbal and motor scales for pre-verbal children"],
    lifespan: { title: "Across the Lifespan", content: "Febrile seizures affect 2-5% of children aged 6 months to 5 years; most outgrow them by age 5. The risk of developing epilepsy after a simple febrile seizure is only 1-2%, similar to the general population. Bacterial meningitis pathogens differ by age: Group B Streptococcus and E. coli in neonates, Streptococcus pneumoniae and Neisseria meningitidis in older infants and children. Brain tumors in children under 3 years have more aggressive courses and poorer prognosis due to the limitations of radiation therapy in the developing brain." },
    quiz: [{
      question: "A 2-year-old with a temperature of 39.4°C has a generalized tonic-clonic seizure lasting 90 seconds. After the seizure, the child is drowsy but recovers to baseline in 30 minutes. What should the nurse teach the parents?",
      options: ["The child needs to start daily anticonvulsant medication", "This is a simple febrile seizure that is usually benign; manage fever and monitor", "The child has epilepsy and will have seizures for life", "Febrile seizures cause brain damage and developmental delays"],
      correct: 1,
      rationale: "This is a simple febrile seizure (generalized, <15 minutes, single occurrence, quick recovery in a child 6 months to 5 years). These are benign, do not cause brain damage, and do not require anticonvulsant therapy. Parents need reassurance and education about fever management."
    }, {
      question: "A 4-month-old presents with poor feeding, lethargy, a high-pitched cry, and a bulging anterior fontanelle. Which assessment finding would the nurse NOT expect in an infant this age?",
      options: ["Temperature instability", "Positive Kernig sign (nuchal rigidity with knee extension)", "Irritability alternating with lethargy", "Bulging fontanelle"],
      correct: 1,
      rationale: "Classic meningeal signs (Kernig, Brudzinski) are unreliable in infants because their neck muscles are not developed enough to produce nuchal rigidity. Infant meningitis presents with poor feeding, irritability or lethargy, temperature instability, high-pitched cry, and bulging fontanelle."
    }, {
      question: "A parent reports that their 18-month-old, who was previously walking and saying several words, has stopped walking and no longer speaks. What should the nurse do?",
      options: ["Reassure the parent that children develop at different rates", "Report immediately as developmental regression always requires urgent investigation", "Suggest monitoring for another month", "Attribute the changes to the child's recent illness"],
      correct: 1,
      rationale: "Developmental regression (loss of previously acquired skills) is ALWAYS abnormal and requires urgent investigation. It can indicate neurodegenerative disease, brain tumor, metabolic disorder, or non-accidental injury."
    }]
  },
  "peds-weight-dosing-np": {
    title: "Peds Weight Dosing",
    cellular: { title: "Developmental Pharmacokinetics and Weight-Based Dosing", content: "Pediatric weight-based dosing compensates for age-related pharmacokinetic differences. Neonates have higher total body water (70-80%), lower serum albumin, immature hepatic CYP enzymes (CYP3A7 transitions to CYP3A4 by 6-12 months), and low GFR (2-4 mL/min at birth, adult values by 1-2 years). Toddlers and young children may have accelerated hepatic metabolism relative to body weight, sometimes requiring higher mg/kg doses than adults. Obese children present dosing challenges: hydrophilic drugs should be dosed on ideal body weight while lipophilic drugs use adjusted body weight. The therapeutic index must account for the fact that the 10x dosing error (decimal point misplacement) is the most dangerous and common pediatric medication error." },
    riskFactors: ["Neonatal age with immature organ function", "Prematurity further delaying metabolic enzyme maturation", "Obesity (altered Vd requiring adjusted dosing calculations)", "Renal or hepatic impairment", "Polypharmacy with drug-drug interactions", "Weight measurement errors (pounds vs kilograms)", "Decimal point errors in dose calculations (10x error)", "Off-label medication use without established pediatric dosing"],
    diagnostics: ["Accurate weight in kilograms on calibrated scale at every encounter", "Serum creatinine with Schwartz formula for estimated GFR in children", "Therapeutic drug levels at steady state: trough 30 min before dose, peak per drug-specific timing", "Hepatic function panel before hepatically metabolized drugs", "Drug-specific monitoring: vancomycin troughs (15-20 mcg/mL for serious infections), gentamicin peak and trough", "Body surface area (BSA) calculation using Mosteller formula for chemotherapy dosing"],
    management: ["Calculate dose as mg/kg using actual weight; verify against maximum adult dose", "Use ideal body weight for hydrophilic drugs and adjusted body weight for lipophilic drugs in obese children", "Apply age-appropriate dosing intervals: neonates often q8-12h, infants q6-8h due to developmental PK differences", "Implement mandatory independent double-check for high-alert medications", "Adjust doses based on therapeutic drug monitoring results and clinical response", "Use Holliday-Segar formula for maintenance IV fluids: 4 mL/kg/hr (first 10 kg) + 2 mL/kg/hr (next 10 kg) + 1 mL/kg/hr (each additional kg)"],
    nursingActions: ["Weigh every child in kilograms (NEVER pounds) on calibrated scale before ANY medication administration", "Independently calculate and verify mg/kg dose, total dose, and route before administration", "Use oral syringes (not parenteral syringes) for oral liquid medications to prevent IV administration errors", "Program smart pumps with pediatric drug libraries and weight-based dosing limits", "Educate parents on home medication measurement using calibrated oral syringes (not household teaspoons)", "Monitor for signs of drug toxicity or subtherapeutic response", "Document weight, calculated dose rationale, and administration details"],
    assessmentFindings: ["Current weight in kilograms measured on calibrated scale", "Signs of drug toxicity: lethargy, vomiting, seizures, hepatotoxicity (jaundice, elevated LFTs), nephrotoxicity (decreased urine output)", "Therapeutic drug levels outside target range", "Adverse drug reactions: rash, GI symptoms, allergic reactions, anaphylaxis", "Signs of therapeutic efficacy: fever resolution, pain improvement, infection clearance"],
    signs: {
      left: ["Therapeutic drug levels within target range", "Clinical improvement with prescribed therapy", "Appropriate growth trajectory maintained", "No adverse drug reactions", "Parents demonstrate correct medication measurement technique"],
      right: ["Drug toxicity symptoms (lethargy, seizures, vomiting)", "Supratherapeutic drug levels on monitoring", "Anaphylaxis after medication administration", "Identified medication error (10x dose, wrong drug, wrong route)", "Acute renal or hepatic failure from drug toxicity"]
    },
    medications: [{
      name: "Gentamicin",
      type: "Aminoglycoside antibiotic",
      action: "Bactericidal; binds 30S ribosomal subunit causing misreading of mRNA; concentration-dependent killing with post-antibiotic effect",
      sideEffects: "Nephrotoxicity (monitor BUN/creatinine), ototoxicity (irreversible vestibular and cochlear damage), neuromuscular blockade",
      contra: "Pre-existing renal impairment, concurrent nephrotoxic or ototoxic drugs, myasthenia gravis",
      pearl: "Narrow therapeutic index; monitor peak (5-10 mcg/mL) and trough (<2 mcg/mL) levels; extended-interval dosing (once daily) preferred in children >1 month to maximize peak-dependent killing while minimizing trough-related toxicity"
    }, {
      name: "Vancomycin",
      type: "Glycopeptide antibiotic",
      action: "Bactericidal; inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors; covers MRSA and resistant gram-positive organisms",
      sideEffects: "Red man syndrome (histamine-mediated with rapid infusion), nephrotoxicity, ototoxicity",
      contra: "Known vancomycin hypersensitivity; caution with concurrent nephrotoxic agents",
      pearl: "Infuse over at least 60 minutes to prevent red man syndrome; target trough 15-20 mcg/mL for serious infections (meningitis, bacteremia); AUC-guided dosing now preferred over trough-only monitoring"
    }],
    pearls: ["The most dangerous pediatric medication error is the 10x error from decimal point misplacement -- always double-check calculations", "ALWAYS weigh in kilograms; using pounds without conversion causes a 2.2x overdose", "Never exceed the maximum adult dose regardless of child's weight (a 50 kg child getting adult-dose amoxicillin)", "Neonates need extended dosing intervals (q8-12h instead of q6h) due to immature clearance", "Use oral syringes (not parenteral) for oral medications to prevent accidental IV administration", "Red man syndrome from vancomycin is rate-related (infusion too fast), NOT a true allergy -- slow the infusion rate"],
    quiz: [
      {
        question: "A 10 kg infant is prescribed gentamicin 2.5 mg/kg IV every 8 hours. The nurse calculates the dose as 250 mg. What error has occurred?",
        options: ["No error; the calculation is correct", "A 10x error: correct dose is 25 mg (2.5 mg/kg x 10 kg = 25 mg)", "The dosing interval should be every 12 hours", "The route should be IM, not IV"],
        correct: 1,
        rationale: "The correct calculation is 2.5 mg/kg x 10 kg = 25 mg per dose. The nurse calculated 250 mg, a classic 10x error from decimal point misplacement. This is the most common and dangerous type of pediatric medication error. Independent double-check would catch this."
      },
      {
        question: "A child is receiving IV vancomycin and develops flushing of the face, neck, and upper trunk during the infusion. What is the most appropriate nursing action?",
        options: ["Stop the infusion immediately and treat for anaphylaxis", "Slow the infusion rate -- this is red man syndrome, a histamine-mediated reaction, not a true allergy", "Administer epinephrine IM", "Document as a vancomycin allergy and discontinue permanently"],
        correct: 1,
        rationale: "Red man syndrome is caused by histamine release from rapid vancomycin infusion, NOT from an immune-mediated allergic reaction. The appropriate action is to slow or temporarily stop the infusion. It is NOT a true allergy and does not require epinephrine or permanent discontinuation."
      },
      {
        question: "Why do neonates require longer dosing intervals (q8-12h) compared to older children (q6-8h) for most medications?",
        options: ["Neonates absorb drugs more slowly from the GI tract", "Neonates have mature hepatic metabolism but immature renal function", "Neonates have both immature hepatic CYP enzymes and low GFR, resulting in prolonged drug half-lives", "Neonates have higher protein binding decreasing free drug levels"],
        correct: 2,
        rationale: "Neonates have immature hepatic CYP enzymes (especially CYP3A4, which doesn't mature until 6-12 months) and very low GFR (2-4 mL/min at birth, reaching adult values by 1-2 years). Both of these result in slower drug clearance and prolonged half-lives, requiring extended dosing intervals to prevent accumulation and toxicity."
      }
    ]
  },
  "pemphigus-rpn": {
    title: "Pemphigus: Autoimmune Blistering Disease for Practical Nurses",
    cellular: { title: "Pathophysiology of Pemphigus Vulgaris", content: "Pemphigus vulgaris is caused by IgG autoantibodies directed against desmoglein-3 and desmoglein-1, transmembrane glycoproteins that form desmosomes holding keratinocytes together. When autoantibodies bind desmogleins, they disrupt desmosomal adhesion causing acantholysis (loss of cell-cell connections within the epidermis), producing intraepidermal blister formation. The blisters are characteristically flaccid (soft, easily ruptured) because they form within the thin epidermal layers. A positive Nikolsky sign (lateral pressure on normal skin causes epidermal separation) confirms epidermal fragility. Oral mucosa is typically affected first, with painful erosions preceding skin involvement by weeks to months. Without treatment, mortality exceeds 75% from secondary infection and fluid/protein losses." },
    riskFactors: ["Middle-aged adults (40-60 years) with peak incidence", "Ashkenazi Jewish and Mediterranean descent (HLA-DRB1 genetic predisposition)", "Drug-induced pemphigus (penicillamine, captopril, rifampin)", "Concurrent autoimmune conditions (myasthenia gravis, thymoma, lupus)", "Physical triggers including burns, UV radiation, and surgical wounds", "Emotional and physiological stress as potential disease flare triggers"],
    diagnostics: ["Skin biopsy with histopathology: intraepidermal acantholysis with suprabasal cleft formation", "Direct immunofluorescence (DIF) of perilesional skin: intercellular IgG and C3 in chicken-wire pattern (gold standard)", "Indirect immunofluorescence: circulating anti-desmoglein antibodies; titer correlates with disease activity", "ELISA for anti-desmoglein 1 and anti-desmoglein 3 antibodies for diagnosis and monitoring", "CBC: baseline before immunosuppressive therapy; may show leukocytosis if secondary infection", "Wound culture if secondary bacterial infection suspected (S. aureus most common)"],
    management: ["High-dose systemic corticosteroids (prednisone 1-2 mg/kg/day) to suppress autoantibody production", "Steroid-sparing immunosuppressants added early (rituximab, mycophenolate, azathioprine) to allow steroid taper", "Meticulous wound care with non-adherent dressings, sterile saline cleansing", "Pain management before wound care and meals (oral erosions cause severe eating difficulty)", "High-protein, high-calorie diet with soft foods and supplements for oral erosion patients", "Infection prevention with strict hand hygiene and sterile wound care technique", "Fluid and electrolyte monitoring -- extensive denuded areas cause losses similar to burns"],
    nursingActions: ["Perform comprehensive skin assessment every shift: document location, size, number of blisters/erosions, and % BSA affected", "Test for Nikolsky sign with gentle lateral pressure; report positive finding to physician", "Administer immunosuppressive medications on schedule; monitor for infection, hyperglycemia, bone marrow suppression", "Provide gentle wound care with non-adherent dressings; NEVER use adhesive tape directly on fragile skin", "Monitor oral mucosa before each meal; provide prescribed oral rinses (viscous lidocaine) to facilitate nutrition", "Weigh patient daily on same scale at same time to monitor fluid status and nutritional adequacy", "Report signs of secondary infection (increased erythema, purulent drainage, fever, elevated WBC) immediately"],
    assessmentFindings: ["Flaccid blisters that rupture easily leaving painful, raw, denuded erosions slow to heal", "Positive Nikolsky sign: lateral pressure on normal skin causes epidermal separation", "Oral erosions: painful irregular ulcerations on buccal mucosa, palate, tongue, gingiva (often first manifestation)", "Asboe-Hansen sign: pressure on existing blister causes lateral extension", "Weight loss and malnutrition from decreased oral intake", "Signs of secondary infection: increased erythema, purulent exudate, fever, foul odor"],
    signs: { left: ["New blister formation on previously unaffected skin", "Mild pain at erosion sites", "Difficulty eating due to oral erosions", "Slow healing of existing erosions", "Mild perilesional erythema"], right: ["Rapidly spreading blisters affecting >20% BSA", "Positive Nikolsky sign on widespread skin areas", "Signs of sepsis (fever, tachycardia, hypotension, altered mental status)", "Purulent drainage indicating secondary infection", "Significant weight loss >5% in one week", "Electrolyte imbalances from extensive fluid and protein loss"] },
    medications: [{ name: "Prednisone", type: "Systemic corticosteroid", action: "Suppresses immune response by inhibiting NF-kB and reducing pro-inflammatory cytokine production, halting autoantibody-driven acantholysis", sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, hypertension, cushingoid features, peptic ulcer disease, mood changes, adrenal suppression", contra: "Active systemic fungal infection, live vaccines, uncontrolled diabetes, active peptic ulcer without gastroprotection", pearl: "Never discontinue abruptly after prolonged use (adrenal crisis risk); taper gradually; administer with food and PPI; monitor blood glucose every 6 hours during high-dose therapy" }, { name: "Rituximab (Rituxan)", type: "Anti-CD20 monoclonal antibody", action: "Depletes B lymphocytes by binding CD20 surface antigen, reducing production of pathogenic anti-desmoglein autoantibodies", sideEffects: "Infusion reactions (fever, chills, hypotension, bronchospasm -- worst during first infusion), severe immunosuppression, PML (rare), hepatitis B reactivation", contra: "Active severe infection, severe immunodeficiency, hepatitis B carriers without antiviral prophylaxis", pearl: "Now considered first-line for moderate-severe pemphigus; premedicate with acetaminophen, diphenhydramine, and methylprednisolone to reduce infusion reactions; screen for hepatitis B before initiating" }],
    pearls: ["Pemphigus blisters are FLACCID (intraepidermal) vs bullous pemphigoid blisters which are TENSE (subepidermal at dermal-epidermal junction)", "Nikolsky sign is a hallmark: lateral pressure on normal skin causes epidermal separation -- always report a positive result", "Oral mucosa is typically the FIRST site affected; inspect the oral cavity at every assessment", "Treat denuded skin like a burn: non-adherent dressings, strict asepsis, monitor fluid/protein losses, high-protein diet", "NEVER use adhesive tape on pemphigus skin -- it will strip the fragile epidermis and extend wounds; use gauze wraps or tubular netting", "Monitor blood glucose every 6 hours on high-dose corticosteroids -- steroid-induced hyperglycemia is extremely common", "Rituximab infusion reactions are most common during the FIRST infusion; premedication reduces severity"],
    quiz: [{ question: "Which assessment finding is most characteristic of pemphigus vulgaris?", options: ["Tense, fluid-filled blisters difficult to rupture", "Flaccid blisters that rupture easily leaving painful denuded erosions", "Raised, scaly plaques with silvery scales on extensor surfaces", "Grouped vesicles on erythematous base in dermatomal pattern"], correct: 1, rationale: "Pemphigus vulgaris produces flaccid blisters (intraepidermal acantholysis) that rupture very easily. Tense blisters characterize bullous pemphigoid (subepidermal), scaly plaques describe psoriasis, and dermatomal vesicles describe herpes zoster." }, { question: "The practical nurse applies gentle lateral pressure adjacent to a blister and the epidermis separates. Which clinical sign has been demonstrated?", options: ["Trousseau sign", "Brudzinski sign", "Nikolsky sign", "Homans sign"], correct: 2, rationale: "Nikolsky sign is positive when lateral pressure on normal-appearing skin causes epidermal separation, confirming loss of intercellular adhesion (acantholysis) in pemphigus." }, { question: "A patient with pemphigus vulgaris is receiving high-dose prednisone. Which monitoring action is most important?", options: ["Check serum calcium levels weekly", "Monitor blood glucose at least every 6 hours", "Assess for hypothyroidism daily", "Obtain daily serum potassium levels"], correct: 1, rationale: "High-dose corticosteroid therapy commonly causes steroid-induced hyperglycemia through hepatic gluconeogenesis stimulation and peripheral insulin resistance. Blood glucose monitoring every 6 hours allows early detection and management with sliding scale insulin." }]
  },
  "pemphigus-vulgaris-rn": {
    title: "Pemphigus Vulgaris",
    cellular: { title: "Pathophysiology of Pemphigus Vulgaris", content: "Pemphigus vulgaris is a severe autoimmune blistering disease caused by IgG autoantibodies against desmoglein-3 (mucosal epithelium) and desmoglein-1 (superficial epidermis), disrupting desmosomal cell-cell adhesion and causing acantholysis within the suprabasal epidermis. This produces flaccid, fragile blisters that rupture easily, leaving painful non-healing erosions. Nikolsky sign is positive (lateral pressure on normal skin causes epidermal separation). Mucosal involvement (oral, pharyngeal, esophageal, genital) often precedes skin lesions and causes severe pain, dysphagia, and nutritional compromise. Without immunosuppressive treatment, the disease is fatal from secondary infection, fluid losses, and malnutrition." },
    riskFactors: ["Middle-aged adults (40-60 years)", "Ashkenazi Jewish and Mediterranean descent (HLA-DRB1 alleles)", "Drug triggers: penicillamine, captopril, ACE inhibitors, rifampin", "Concurrent autoimmune diseases (myasthenia gravis, thymoma)", "Physical trauma, UV exposure, burns at wound sites", "Emotional stress as disease flare trigger"],
    diagnostics: ["Skin biopsy with histopathology showing suprabasal acantholysis (intraepidermal cleft)", "Direct immunofluorescence of perilesional skin: intercellular IgG/C3 in chicken-wire pattern (gold standard)", "ELISA for anti-desmoglein 1 and 3 antibody titers (quantitative monitoring)", "Wound cultures from denuded areas when secondary infection suspected", "CBC, CMP, and albumin to monitor for infection, electrolyte imbalances, and malnutrition", "Pre-treatment screening: hepatitis B/C serology, TB testing, varicella immunity before immunosuppression"],
    management: ["Systemic corticosteroids (prednisone 1-2 mg/kg/day) as initial disease control", "Rituximab as first-line steroid-sparing agent for moderate-severe disease", "Mycophenolate mofetil or azathioprine as alternative steroid-sparing agents", "Wound care with non-adherent dressings; sterile saline cleansing; no adhesive tape on skin", "Nutritional support: soft diet, liquid supplements, viscous lidocaine before meals for oral erosions", "Infection prevention: strict hand hygiene, aseptic wound care, monitoring for sepsis", "Gradual corticosteroid taper guided by clinical response and antibody titers"],
    nursingActions: ["Perform head-to-toe skin and mucous membrane assessment every shift documenting new lesions, healing progress, and % BSA affected", "Implement gentle handling techniques: lift (don't slide) the patient; use draw sheets for repositioning", "Apply non-adherent dressings secured with gauze wraps or tubular netting (NEVER adhesive tape)", "Provide oral care with gentle rinses; apply prescribed topical anesthetics (viscous lidocaine) 15-20 minutes before meals", "Monitor nutritional status: daily weights, calorie counts, serum albumin trends", "Administer immunosuppressive medications on schedule; monitor CBC for bone marrow suppression and glucose for steroid-induced hyperglycemia", "Assess for signs of secondary infection at wound sites and systemically (temperature, WBC trends)", "Coordinate care with dermatology, nutrition services, wound care team, and pain management"],
    assessmentFindings: ["Flaccid blisters on skin and mucous membranes that rupture leaving painful, shallow, denuded erosions", "Positive Nikolsky sign on examination", "Oral erosions causing dysphagia, odynophagia, and decreased oral intake", "Progressive weight loss from pain-related decreased nutrition", "Signs of secondary infection: wound erythema, purulent drainage, fever, leukocytosis", "Fluid and electrolyte imbalances from extensive transepidermal losses", "Psychological distress from chronic painful disfiguring disease"],
    signs: {
      left: ["Stable number of lesions with evidence of healing at edges", "Adequate oral intake with pain management", "Stable weight and serum albumin", "No signs of secondary infection", "Negative Nikolsky sign in previously affected areas (remission)"],
      right: ["Rapidly expanding erosions involving >30% BSA", "Sepsis (fever, tachycardia, hypotension, altered mental status)", "Significant hypoalbuminemia (<2.5 g/dL) with edema", "Inability to eat or drink due to extensive oral involvement", "Electrolyte derangements (hyponatremia, hypokalemia) from wound losses"]
    },
    medications: [{
      name: "Prednisone",
      type: "Systemic corticosteroid",
      action: "Suppresses autoimmune response by inhibiting inflammatory cytokines and reducing anti-desmoglein autoantibody production",
      sideEffects: "Hyperglycemia, infection risk, osteoporosis, cushingoid features, GI ulceration, mood disturbances, adrenal suppression",
      contra: "Active systemic fungal infection, live vaccines during therapy",
      pearl: "Taper gradually (never abrupt discontinuation); concurrent PPI for gastroprotection; calcium/vitamin D supplementation; monitor glucose q6h during high-dose therapy"
    }, {
      name: "Mycophenolate Mofetil (CellCept)",
      type: "Immunosuppressant (purine synthesis inhibitor)",
      action: "Inhibits inosine monophosphate dehydrogenase, selectively suppressing lymphocyte proliferation and reducing autoantibody production",
      sideEffects: "GI symptoms (nausea, diarrhea, abdominal pain), leukopenia, anemia, increased infection risk, teratogenicity",
      contra: "Pregnancy (Category D -- highly teratogenic), breastfeeding, hypersensitivity",
      pearl: "Common steroid-sparing agent; monitor CBC every 2 weeks initially then monthly; female patients MUST use two forms of contraception; takes 2-3 months to reach full therapeutic effect"
    }],
    pearls: ["Pemphigus = FLACCID blisters (INTRAepidermal); bullous pemphigoid = TENSE blisters (SUBepidermal) -- this distinction is a high-yield exam question", "NEVER use adhesive tape, blood pressure cuffs directly on lesions, or friction during care -- all can extend existing wounds or create new ones", "Oral mucosa is often the FIRST site affected; a patient presenting with persistent painful mouth sores unresponsive to usual treatments should be evaluated for pemphigus", "Manage like a burn patient: fluid and protein replacement, infection prevention, pain management, nutritional support", "Nikolsky sign is the hallmark physical exam finding -- always test and document", "Rituximab has emerged as first-line steroid-sparing therapy; pre-screen for hepatitis B (risk of reactivation)"],
    quiz: [
      {
        question: "A patient with pemphigus vulgaris has extensive oral erosions and reports severe pain when eating. Which nursing intervention should be implemented FIRST?",
        options: ["Encourage a regular diet for adequate nutrition", "Apply viscous lidocaine to oral mucosa 15-20 minutes before meals", "Insert a nasogastric tube for enteral feeding", "Restrict oral intake to clear liquids only"],
        correct: 1,
        rationale: "Topical anesthetics (viscous lidocaine) applied before meals reduce pain and facilitate oral intake. A regular diet may be too painful, and NG tube or clear liquid restriction should not be the first interventions when topical pain management can enable oral feeding."
      },
      {
        question: "A nurse needs to reposition a patient with pemphigus vulgaris in bed. What is the most appropriate technique?",
        options: ["Slide the patient across the sheet using a two-person assist", "Lift the patient using a draw sheet to avoid skin shearing", "Apply skin protectant and slide with friction-reducing devices", "Ask the patient to reposition independently to minimize staff handling"],
        correct: 1,
        rationale: "Patients with pemphigus have extremely fragile skin prone to acantholysis. Sliding or friction creates shearing forces that can strip the epidermis and extend lesions. Using a draw sheet to LIFT (not slide) the patient minimizes shearing forces and prevents iatrogenic skin damage."
      },
      {
        question: "Which finding differentiates pemphigus vulgaris from bullous pemphigoid?",
        options: ["Pemphigus has tense blisters; bullous pemphigoid has flaccid blisters", "Pemphigus has positive Nikolsky sign with flaccid intraepidermal blisters; bullous pemphigoid has negative Nikolsky sign with tense subepidermal blisters", "Both conditions have identical blister characteristics", "Bullous pemphigoid affects oral mucosa first; pemphigus does not"],
        correct: 1,
        rationale: "Pemphigus produces flaccid blisters from intraepidermal acantholysis with positive Nikolsky sign. Bullous pemphigoid produces tense blisters from subepidermal separation at the basement membrane zone with typically negative Nikolsky sign. Pemphigus commonly involves oral mucosa first; bullous pemphigoid primarily affects skin."
      }
    ]
  },
};