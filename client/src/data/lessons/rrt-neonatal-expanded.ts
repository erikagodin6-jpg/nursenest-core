import type { LessonContent } from "./types";

export const rrtNeonatalExpandedLessons: Record<string, LessonContent> = {
  "bronchopulmonary-dysplasia-rrt": {
    title: "Bronchopulmonary Dysplasia (BPD)",
    cellular: `Bronchopulmonary dysplasia (BPD) is a chronic lung disease of prematurity resulting from injury to the developing lung from mechanical ventilation, oxygen toxicity, and inflammation. It is the most common chronic lung disease in infants and a leading cause of morbidity in extremely premature neonates (<28 weeks gestational age). Respiratory therapists play a central role in BPD prevention through lung-protective ventilation strategies and in long-term respiratory management of affected infants.

The pathophysiology of BPD has evolved with advances in neonatal care. "Old BPD" (pre-surfactant era) was characterized by severe airway injury, fibrosis, and smooth muscle hypertrophy from aggressive mechanical ventilation. "New BPD" (post-surfactant era) is characterized by arrested alveolar and vascular development — the premature lung has fewer, larger alveoli with simplified architecture and decreased capillary density. This developmental arrest is driven by inflammation, oxidative stress, and ventilator-induced lung injury (VILI).

Risk factors for BPD include extreme prematurity (<28 weeks), low birth weight (<1000 g), male sex, chorioamnionitis, postnatal sepsis, patent ductus arteriosus (PDA), excessive fluid administration, and prolonged mechanical ventilation with high FiO2. The incidence of BPD inversely correlates with gestational age: 70-80% of infants born at 22-24 weeks develop BPD vs <5% at 32 weeks.

BPD severity classification (NICHD): Mild BPD — breathing room air at 36 weeks PMA (postmenstrual age); Moderate BPD — requiring <30% FiO2 at 36 weeks PMA; Severe BPD — requiring ≥30% FiO2 or positive pressure support at 36 weeks PMA. The Jensen criteria (2019) grade BPD based on the type of respiratory support at 36 weeks: Grade 1 (nasal cannula ≤2 LPM), Grade 2 (nasal cannula >2 LPM or CPAP/NIPPV), Grade 3 (invasive mechanical ventilation).

Prevention strategies are the cornerstone of BPD management: early CPAP (avoiding intubation when possible), gentle ventilation (volume-targeted, permissive hypercapnia accepting PaCO2 45-55 mmHg with pH >7.20), judicious oxygen use (SpO2 targets 90-95% to avoid both hyperoxia and hypoxia), early caffeine therapy (reduces BPD by 36%), and vitamin A supplementation.

US Protocol Notes (NBRC): BPD as a chronic lung disease of prematurity is an NBRC-tested topic. Key concepts include the shift from "old" to "new" BPD pathophysiology, the role of lung-protective ventilation in prevention, oxygen saturation targets (90-95%), and the use of caffeine citrate. The BPD severity classification at 36 weeks PMA is important for board exams.

Canadian Protocol Notes (CBRC): Canadian Paediatric Society (CPS) guidelines for BPD prevention align closely with US guidelines. Canadian NICUs typically use volume-targeted ventilation modes, early CPAP/INSURE strategies, and caffeine therapy. Canadian RTs should be familiar with Canadian Neonatal Network (CNN) outcomes data and the emphasis on non-invasive ventilation strategies to reduce BPD incidence.`,
    riskFactors: [
      "Extreme prematurity (<28 weeks gestational age) — strongest risk factor; incidence inversely correlates with GA",
      "Very low birth weight (<1000 g / ELBW)",
      "Prolonged mechanical ventilation — each additional ventilator day increases BPD risk",
      "High FiO2 exposure (>0.40) — oxygen toxicity disrupts alveolar development",
      "Chorioamnionitis (prenatal inflammation) priming the fetal lung for postnatal injury",
      "Postnatal sepsis — systemic inflammation compounds lung injury",
      "Patent ductus arteriosus (PDA) — left-to-right shunt increases pulmonary blood flow and edema",
      "Excessive fluid administration in the first week of life",
      "Male sex — males have delayed lung maturation and higher BPD rates",
      "Absence of antenatal corticosteroids — betamethasone accelerates fetal lung maturity"
    ],
    diagnostics: [
      "BPD diagnosis at 36 weeks postmenstrual age: assessed by oxygen/respiratory support requirement",
      "Chest X-ray: diffuse haziness, hyperinflation, cystic changes, and fibrotic stranding in severe BPD",
      "Pulmonary function testing (infant PFTs): reduced compliance, increased resistance, air trapping",
      "Echocardiography: assess for pulmonary hypertension (elevated RV pressure, TR jet velocity) — complicates 25-40% of severe BPD",
      "SpO2 monitoring: continuous — target 90-95% to balance adequate oxygenation against oxygen toxicity",
      "ABG/capillary blood gas: monitor for permissive hypercapnia (target PaCO2 45-55, pH >7.20)",
      "CT chest (when indicated): assess structural lung disease, cystic changes, and vascular abnormalities"
    ],
    management: [
      "Prevention is paramount: early CPAP, avoid intubation when possible, use INSURE or LISA for surfactant",
      "Lung-protective ventilation: volume-targeted modes (VTV), tidal volume 4-6 mL/kg, permissive hypercapnia (PaCO2 45-55)",
      "Oxygen saturation targets: 90-95% — avoid both hyperoxia (>95%) and severe hypoxia (<88%)",
      "Caffeine citrate: loading dose 20 mg/kg IV then 5-10 mg/kg daily — start within first 10 days of life",
      "Postnatal corticosteroids: dexamethasone for infants at high risk of/developing severe BPD (typically after 7 days of age)",
      "Diuretic therapy: furosemide or chlorothiazide/spironolactone for pulmonary edema in established BPD",
      "Inhaled bronchodilators PRN for wheezing episodes — beta-2 agonist response is variable in BPD",
      "Nutritional optimization: high-calorie feeds (120-150 kcal/kg/day) to support growth and lung repair",
      "Discharge on home oxygen if SpO2 <92% on room air — wean oxygen over weeks to months as lung matures"
    ],
    nursingActions: [
      "Monitor SpO2 continuously with alarm limits set to 90-95% — avoid sustained hyperoxia",
      "Minimize ventilator days: daily assessment for extubation readiness, prefer non-invasive support",
      "Administer caffeine citrate daily — continue until 34-35 weeks PMA or until off respiratory support",
      "Assess for signs of pulmonary hypertension: increasing oxygen requirement, persistent tachypnea, RV heave",
      "Coordinate feeding and respiratory care to minimize energy expenditure during feeds",
      "Educate parents on home oxygen therapy if discharge on supplemental oxygen is anticipated",
      "Monitor growth parameters: weight, length, head circumference — poor growth indicates inadequate caloric intake",
      "Implement developmental care: minimal handling, clustered care, noise reduction — reduces stress and oxygen consumption"
    ],
    signs: [
      "Persistent oxygen requirement beyond 28 days of life in a premature infant",
      "Tachypnea, retractions, and increased work of breathing persisting beyond acute RDS phase",
      "Episodic desaturations (SpO2 drops) often associated with feeding or activity",
      "Wheezing and air trapping on auscultation",
      "Failure to wean from respiratory support despite resolution of acute RDS",
      "Poor growth despite adequate caloric intake (increased metabolic demand from chronic respiratory effort)"
    ],
    medications: [
      { name: "Caffeine Citrate", dose: "Loading: 20 mg/kg IV; Maintenance: 5-10 mg/kg daily PO/IV", route: "IV or Oral", purpose: "Methylxanthine reducing BPD incidence by 36% — stimulates respiratory drive, reduces apnea, and has anti-inflammatory properties" },
      { name: "Dexamethasone", dose: "0.15-0.2 mg/kg/day tapering over 7-10 days", route: "IV", purpose: "Postnatal corticosteroid for established/evolving BPD — reduces inflammation and facilitates extubation; use only in high-risk infants due to neurodevelopmental concerns" },
      { name: "Furosemide", dose: "1-2 mg/kg IV/PO q12-24h", route: "IV or Oral", purpose: "Loop diuretic for pulmonary edema in established BPD — monitor electrolytes (hypokalemia, hypocalcemia), nephrocalcinosis risk" },
      { name: "Budesonide (Inhaled)", dose: "0.25-0.5 mg nebulized BID", route: "Inhaled", purpose: "Inhaled corticosteroid for BPD airway inflammation — may reduce need for systemic steroids; evidence evolving" }
    ],
    pearls: [
      "Prevention is the best treatment for BPD: early CPAP, gentle ventilation, judicious oxygen, and caffeine therapy",
      "Caffeine reduces BPD by 36% (CAP trial) — one of the most evidence-based interventions in neonatal care; start early",
      "SpO2 target 90-95% — hyperoxia (>95%) damages developing lungs, but severe hypoxia (<88%) increases mortality",
      "Permissive hypercapnia (PaCO2 45-55, pH >7.20) allows lower ventilator pressures and volumes, reducing VILI",
      "Pulmonary hypertension complicates 25-40% of severe BPD and significantly worsens prognosis — screen with echo",
      "BPD severity is assessed at 36 weeks postmenstrual age, not at a fixed postnatal age — this is a key timing concept"
    ],
    preTest: [
      { question: "What is the strongest risk factor for BPD?", options: ["Male sex", "Extreme prematurity (<28 weeks GA)", "Chorioamnionitis", "PDA"], correct: 1, rationale: "Extreme prematurity is the strongest risk factor. BPD incidence inversely correlates with gestational age." },
      { question: "At what postmenstrual age is BPD severity classified?", options: ["28 days of life", "32 weeks PMA", "36 weeks PMA", "40 weeks PMA"], correct: 2, rationale: "BPD severity is classified at 36 weeks postmenstrual age based on the level of respiratory support required." }
    ],
    postTest: [
      { question: "A 25-week premature infant on day 3 of life has not yet received caffeine. What is the evidence-based recommendation?", options: ["Wait until apnea develops before starting caffeine", "Start caffeine citrate within the first 10 days — reduces BPD by 36%", "Caffeine is contraindicated in extremely premature infants", "Caffeine is only for infants >32 weeks GA"], correct: 1, rationale: "The CAP trial demonstrated that early caffeine therapy (within the first 10 days) reduces BPD incidence by 36%. Early initiation is strongly recommended for all infants <32 weeks GA." },
      { question: "A premature infant on mechanical ventilation has PaCO2 of 52 mmHg with pH 7.28. The current VT is 4.5 mL/kg. What is the appropriate action?", options: ["Increase VT to normalize PaCO2", "Accept permissive hypercapnia — PaCO2 45-55 with pH >7.20 is acceptable in BPD prevention", "Increase respiratory rate significantly", "Switch to HFOV immediately"], correct: 1, rationale: "Permissive hypercapnia (PaCO2 45-55, pH >7.20) is a lung-protective strategy in premature neonates. PaCO2 52 with pH 7.28 is within acceptable range. Increasing VT to normalize CO2 risks volutrauma and increases BPD risk." }
    ],
    quiz: [
      { question: "What is the mechanism by which 'new BPD' differs from 'old BPD'?", options: ["New BPD is caused by infection rather than ventilation", "New BPD is characterized by arrested alveolar development rather than fibrosis and airway injury", "New BPD only affects term infants", "There is no difference between old and new BPD"], correct: 1, rationale: "New BPD (post-surfactant era) is characterized by arrested alveolar and vascular development — fewer, larger, simplified alveoli with decreased capillary density. Old BPD featured severe airway injury, fibrosis, and smooth muscle hypertrophy from aggressive ventilation." },
      { question: "What SpO2 target range is recommended for extremely premature infants to reduce BPD risk?", options: ["85-89%", "90-95%", "96-100%", "80-84%"], correct: 1, rationale: "SpO2 90-95% balances adequate oxygenation against the risk of oxygen toxicity. SpO2 >95% (hyperoxia) damages developing alveoli and increases BPD risk. SpO2 <88% increases mortality risk." },
      { question: "Which medication has the strongest evidence for BPD prevention?", options: ["Inhaled corticosteroids", "Furosemide", "Caffeine citrate", "Albuterol"], correct: 2, rationale: "Caffeine citrate (CAP trial) has the strongest evidence for BPD prevention, reducing incidence by 36%. It also improves neurodevelopmental outcomes at 18-21 months. Start within the first 10 days of life in infants <32 weeks." }
    ]
  },

  "meconium-aspiration-syndrome-rrt": {
    title: "Meconium Aspiration Syndrome (MAS)",
    cellular: `Meconium aspiration syndrome (MAS) occurs when a newborn inhales meconium-stained amniotic fluid (MSAF) into the lower airways, causing respiratory distress. It is most common in term and post-term infants (>37 weeks GA) and is associated with perinatal asphyxia and fetal distress. Meconium is present in amniotic fluid in 12-20% of deliveries, but MAS develops in only 2-5% of these cases. Respiratory therapists must understand the complex pathophysiology to guide ventilatory strategies.

Meconium is a sterile, viscous substance composed of desquamated intestinal epithelial cells, bile pigments, mucus, lanugo, and vernix. Fetal distress (hypoxia, acidosis) stimulates vagal activity, causing meconium passage into the amniotic fluid. Gasping respirations in utero or during delivery draw MSAF into the trachea and bronchial tree.

The pathophysiology of MAS involves four interconnected mechanisms: (1) Mechanical airway obstruction — meconium particles obstruct large and small airways, causing complete obstruction (atelectasis) and partial obstruction (ball-valve effect with air trapping). (2) Chemical pneumonitis — bile acids, pancreatic enzymes, and free fatty acids in meconium cause intense airway inflammation and alveolar damage within 24-48 hours. (3) Surfactant inactivation — meconium components inactivate surfactant, increasing surface tension and promoting alveolar collapse (secondary surfactant deficiency). (4) Pulmonary hypertension — meconium-induced vasoconstriction and inflammation cause persistent pulmonary hypertension of the newborn (PPHN), creating right-to-left shunting and severe hypoxemia.

The gas exchange consequences are complex: areas of complete obstruction cause atelectasis and shunt; areas of partial obstruction cause air trapping; surfactant inactivation creates diffuse atelectasis; and PPHN adds right-to-left shunting at the ductus arteriosus and foramen ovale level. The result is severe, often refractory hypoxemia.

Current management has shifted from aggressive suctioning in the delivery room to supportive respiratory care. The 2015 NRP guidelines NO LONGER recommend routine intubation and tracheal suctioning for non-vigorous meconium-stained neonates. Current recommendation: provide standard resuscitation (warmth, clearing the airway if obstructed, stimulation, positive pressure ventilation if needed).

US Protocol Notes (NBRC): MAS management including delivery room care changes (no longer routine tracheal suctioning), ventilatory strategies (avoid high PEEP with air trapping, surfactant replacement, iNO for PPHN), and ECMO as rescue therapy are board-relevant topics.

Canadian Protocol Notes (CBRC): Canadian Paediatric Society guidelines for delivery room management of meconium-stained neonates align with the 2015 NRP changes. Canadian NICUs use surfactant replacement, iNO, and ECMO for severe MAS following the same indications as US practice. Canadian RTs should understand the LISA technique for surfactant delivery in MAS.`,
    riskFactors: [
      "Post-term pregnancy (>42 weeks) — meconium passage increases with gestational age",
      "Fetal distress (hypoxia, acidosis) — stimulates vagal-mediated meconium passage",
      "Non-reassuring fetal heart rate patterns during labor",
      "Oligohydramnios — thick meconium concentration from reduced amniotic fluid",
      "Intrauterine growth restriction (IUGR) — chronic fetal stress",
      "Maternal hypertension, preeclampsia, or diabetes",
      "Prolonged or difficult labor with umbilical cord compression",
      "African American ethnicity — higher incidence of MSAF"
    ],
    diagnostics: [
      "Clinical history: meconium-stained amniotic fluid with respiratory distress at birth",
      "Chest X-ray: coarse, irregular bilateral opacities (patchy infiltrates), hyperinflation from air trapping, possible pneumothorax",
      "ABG: hypoxemia with mixed respiratory and metabolic acidosis; P/F ratio assessment",
      "Echocardiography: assess for PPHN — elevated RV pressure, right-to-left shunting at PDA and foramen ovale",
      "Pre- and post-ductal SpO2: difference >5% suggests right-to-left PDA shunting from PPHN",
      "Blood culture: rule out concurrent neonatal sepsis (meconium predisposes to bacterial infection)",
      "Continuous SpO2 monitoring: pre-ductal (right hand) probe preferred"
    ],
    management: [
      "Delivery room: standard NRP resuscitation (2015 guidelines) — NO longer routine tracheal suctioning for non-vigorous infants",
      "Supplemental oxygen to maintain SpO2 target: pre-ductal 90-95% — avoid hyperoxia and hypoxia",
      "Mechanical ventilation if needed: avoid high PEEP (air trapping already present); use moderate PEEP 4-6 cmH2O",
      "Surfactant replacement therapy: poractant alfa 2.5 mL/kg — replaces inactivated surfactant; consider lavage technique in some centers",
      "Inhaled nitric oxide 20 ppm for PPHN component — selective pulmonary vasodilation",
      "HFOV (high-frequency oscillatory ventilation) for refractory hypoxemia: constant distending pressure with small volume oscillations",
      "ECMO for severe MAS with P/F <40 or OI >40 despite maximal therapy — survival rate >90% for neonatal MAS on ECMO",
      "Antibiotics: ampicillin + gentamicin empirically — meconium-stained fluid increases infection risk",
      "Minimal handling and sedation to reduce oxygen consumption and prevent pulmonary hypertensive crises"
    ],
    nursingActions: [
      "In delivery room: provide standard NRP resuscitation; suction only if airway is obstructed; do NOT routinely intubate for tracheal suctioning",
      "Place pre-ductal SpO2 probe (right hand/wrist) for continuous monitoring",
      "Compare pre-ductal and post-ductal SpO2: difference >5% suggests PPHN with right-to-left PDA shunt",
      "Minimize handling and stimulation — can trigger pulmonary hypertensive crises with acute desaturation",
      "Monitor for pneumothorax: MAS with air trapping creates high risk; watch for sudden deterioration",
      "Maintain neutral thermal environment — cold stress increases oxygen consumption and worsens pulmonary hypertension",
      "Ensure adequate sedation: fentanyl infusion often needed to minimize agitation-induced PPHN crises",
      "Prepare for ECMO if OI >40 or P/F <40 despite maximal conventional therapy and iNO"
    ],
    signs: [
      "Meconium-stained amniotic fluid (green/yellow discoloration) with respiratory distress at birth",
      "Barrel chest from air trapping with intercostal retractions and tachypnea",
      "Coarse crackles and rhonchi bilaterally on auscultation",
      "Cyanosis not responding to supplemental oxygen (suggests PPHN component)",
      "Pre-ductal and post-ductal SpO2 discrepancy >5% (right-to-left PDA shunt from PPHN)",
      "Meconium-stained skin, nails, and umbilical cord (suggesting prolonged exposure)"
    ],
    medications: [
      { name: "Poractant Alfa (Curosurf)", dose: "2.5 mL/kg (200 mg/kg) intratracheal", route: "Intratracheal via ETT", purpose: "Surfactant replacement for meconium-induced surfactant inactivation — restores surface tension reduction and lung compliance" },
      { name: "Inhaled Nitric Oxide", dose: "20 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective pulmonary vasodilator for PPHN component of MAS — improves V/Q matching and reduces right-to-left shunting" },
      { name: "Fentanyl", dose: "1-4 mcg/kg/hr IV infusion", route: "Intravenous", purpose: "Sedation/analgesia to minimize agitation and prevent pulmonary hypertensive crises — handling and distress trigger acute desaturation" },
      { name: "Ampicillin + Gentamicin", dose: "Ampicillin 50 mg/kg q12h + Gentamicin 4 mg/kg q24h IV", route: "Intravenous", purpose: "Empiric antibiotics — meconium-stained fluid increases risk of bacterial pneumonia and sepsis" }
    ],
    pearls: [
      "Current NRP guidelines (2015) do NOT recommend routine intubation and tracheal suctioning for non-vigorous meconium-stained neonates — this changed from prior practice",
      "MAS has the BEST ECMO outcomes of any neonatal indication — survival >90% on ECMO for severe MAS",
      "Avoid high PEEP in MAS — air trapping from ball-valve obstruction is already present; high PEEP worsens air trapping and pneumothorax risk",
      "Pre-ductal and post-ductal SpO2 comparison is critical: >5% difference confirms right-to-left ductal shunting from PPHN",
      "Minimal handling is therapeutic — stimulation and agitation trigger pulmonary hypertensive crises with acute, sometimes catastrophic desaturation",
      "Surfactant replacement addresses the surfactant inactivation component of MAS pathophysiology — multiple doses may be needed"
    ],
    preTest: [
      { question: "What is the current NRP recommendation for a non-vigorous meconium-stained neonate at delivery?", options: ["Routine intubation and tracheal suctioning before PPV", "Standard NRP resuscitation — intubate only if needed for ventilation", "Deep oropharyngeal suctioning before drying", "Withhold resuscitation until meconium is cleared"], correct: 1, rationale: "Since 2015, NRP no longer recommends routine tracheal suctioning for non-vigorous meconium-stained neonates. Standard resuscitation (warmth, clearing the airway if obstructed, stimulation, PPV if needed) is recommended." },
      { question: "What are the four pathophysiological mechanisms of MAS?", options: ["Infection, hemorrhage, edema, and fibrosis", "Airway obstruction, chemical pneumonitis, surfactant inactivation, and PPHN", "Bronchospasm, mucus plugging, inflammation, and atelectasis", "Metabolic acidosis, respiratory acidosis, hypoglycemia, and hypothermia"], correct: 1, rationale: "MAS involves: (1) mechanical airway obstruction, (2) chemical pneumonitis from bile/enzyme irritation, (3) surfactant inactivation, and (4) persistent pulmonary hypertension." }
    ],
    postTest: [
      { question: "A term neonate with MAS has pre-ductal SpO2 92% and post-ductal SpO2 82%. What does this indicate?", options: ["Normal neonatal transition", "Right-to-left shunting at the PDA from persistent pulmonary hypertension", "Left-to-right PDA shunt", "Coarctation of the aorta"], correct: 1, rationale: "A pre-ductal SpO2 >5% higher than post-ductal SpO2 indicates right-to-left shunting at the ductus arteriosus — deoxygenated blood from the pulmonary artery bypasses the lungs and enters the descending aorta. This is classic for PPHN complicating MAS." },
      { question: "Why should high PEEP be avoided in MAS?", options: ["High PEEP causes surfactant inactivation", "MAS already has air trapping from ball-valve obstruction — high PEEP worsens air trapping and pneumothorax risk", "High PEEP reduces oxygen delivery", "PEEP is always harmful in neonates"], correct: 1, rationale: "Meconium particles cause partial airway obstruction with a ball-valve mechanism — air enters during inspiration but cannot escape during expiration, causing air trapping. Adding high PEEP further impedes expiration and increases the risk of pneumothorax." }
    ],
    quiz: [
      { question: "What neonatal ECMO indication has the highest survival rate?", options: ["Congenital diaphragmatic hernia", "Meconium aspiration syndrome (>90% survival)", "Sepsis", "Congenital heart disease"], correct: 1, rationale: "MAS has the best ECMO outcomes of any neonatal indication, with survival rates >90%. This is because MAS is typically a reversible condition in a mature (term/post-term) infant with otherwise normal lung development." },
      { question: "What intervention addresses the surfactant inactivation component of MAS?", options: ["Inhaled nitric oxide", "Bronchodilator therapy", "Exogenous surfactant replacement", "Antibiotics"], correct: 2, rationale: "Meconium components inactivate endogenous surfactant, increasing surface tension and promoting alveolar collapse. Exogenous surfactant replacement restores normal surface tension reduction and improves lung compliance." },
      { question: "A neonate with severe MAS has an oxygenation index of 45 despite surfactant, iNO 20 ppm, and HFOV. What is the next step?", options: ["Increase iNO to 80 ppm", "Transition to conventional ventilation", "ECMO consultation — OI >40 despite maximal therapy meets ECMO criteria", "Continue current management for 24 more hours"], correct: 2, rationale: "OI >40 despite maximal conventional therapy (surfactant, iNO, optimal ventilation) meets ECMO criteria. MAS has excellent ECMO outcomes (>90% survival), so early ECMO referral is appropriate." }
    ]
  },

  "congenital-diaphragmatic-hernia-rrt": {
    title: "Congenital Diaphragmatic Hernia (CDH)",
    cellular: `Congenital diaphragmatic hernia (CDH) is a developmental defect in the diaphragm allowing abdominal organs (stomach, intestines, liver, spleen) to herniate into the thoracic cavity, compressing the ipsilateral lung and shifting the mediastinum. The resulting pulmonary hypoplasia and pulmonary hypertension create a complex respiratory emergency that challenges even experienced neonatal respiratory therapists.

CDH occurs in approximately 1 in 2,500 live births. The most common type is the Bochdalek hernia (80-90%), a posterolateral defect, predominantly left-sided (80-85%). The left-sided predominance is because the left pleuroperitoneal canal closes later in development. The herniated abdominal viscera occupy thoracic space during the critical period of lung development (pseudoglandular and canalicular stages), resulting in pulmonary hypoplasia on the ipsilateral side and, to a lesser extent, the contralateral side.

Pulmonary hypoplasia in CDH involves both reduced airway branching (fewer generations of airways and alveoli) and abnormal vascular development (pulmonary arteriolar medial hypertrophy, decreased vascular bed cross-sectional area, and vascular hyperreactivity). The combination of structural hypoplasia and vascular hyper-reactivity produces severe persistent pulmonary hypertension.

The severity of CDH is determined by the degree of pulmonary hypoplasia, which correlates with: (1) lung-to-head ratio (LHR) on prenatal ultrasound — LHR <1.0 indicates severe hypoplasia with poor prognosis; (2) liver herniation into the thorax (liver-up = worse prognosis); and (3) total fetal lung volume on prenatal MRI.

Initial stabilization is critical and counterintuitive: AVOID bag-mask ventilation (distends herniated stomach and intestines, further compressing the lung). Immediately intubate and provide gentle ventilation with LOW pressures (PIP ≤25 cmH2O). Place an orogastric tube to decompress the stomach. Permissive hypercapnia and pre-ductal SpO2 targets of 85-95% are accepted to avoid VILI in hypoplastic lungs.

US Protocol Notes (NBRC): CDH is a less common but high-yield neonatal topic. Key concepts include: avoid bag-mask ventilation (distends stomach), immediate intubation with gentle ventilation, low PIP (≤25 cmH2O), and the role of ECMO for severe CDH with refractory hypoxemia. Understanding the pathophysiology of pulmonary hypoplasia and PPHN in CDH is important.

Canadian Protocol Notes (CBRC): Canadian guidelines follow CPS recommendations for CDH management. Canadian tertiary NICUs manage CDH with the same principles: gentle ventilation, permissive hypercapnia, iNO for PPHN, and ECMO when available. Fetal surgery (tracheal occlusion/FETO) is performed at specialized Canadian centers for severe CDH.`,
    riskFactors: [
      "Idiopathic in most cases — no clear genetic cause identified in 60-70% of CDH",
      "Chromosomal abnormalities: trisomy 13, 18, 21 associated with CDH",
      "Associated congenital anomalies: cardiac defects (30-40%), neural tube defects, renal anomalies",
      "Prenatal findings indicating severity: liver-up position, low lung-to-head ratio (<1.0)",
      "Bilateral diaphragmatic hernia (rare, 1-2%) — extremely poor prognosis",
      "Large defect size — larger defects allow more visceral herniation and greater lung compression",
      "Late or absent prenatal diagnosis — prevents planned delivery at a tertiary center with ECMO capability"
    ],
    diagnostics: [
      "Prenatal ultrasound: most CDH is diagnosed prenatally — herniated abdominal viscera in thorax, mediastinal shift",
      "Lung-to-head ratio (LHR): prenatal prognostic indicator; LHR <1.0 = severe hypoplasia",
      "Prenatal MRI: total fetal lung volume assessment — more accurate than ultrasound for prognosis",
      "Postnatal chest X-ray: bowel loops visible in thorax, mediastinal shift, absent/reduced lung tissue on affected side",
      "ABG: hypoxemia, hypercapnia, and acidosis reflecting pulmonary hypoplasia severity",
      "Echocardiography: assess pulmonary hypertension severity, RV function, and rule out associated cardiac anomalies",
      "Pre- and post-ductal SpO2: assess for right-to-left ductal shunting from PPHN"
    ],
    management: [
      "Delivery room: immediately intubate — AVOID bag-mask ventilation (distends stomach, worsens lung compression)",
      "Place orogastric tube to continuous suction — decompress herniated stomach and intestines",
      "Gentle ventilation: PIP ≤25 cmH2O, PEEP 3-5 cmH2O, rate 40-60, FiO2 titrated to pre-ductal SpO2 85-95%",
      "Permissive hypercapnia: accept PaCO2 45-65 mmHg with pH >7.20 — avoid VILI in hypoplastic lungs",
      "iNO 20 ppm for PPHN component — response is variable due to structural vascular abnormality vs purely vasoreactive PPHN",
      "HFOV if conventional ventilation fails — mean airway pressure may improve ventilation of hypoplastic lung",
      "ECMO for refractory hypoxemia: typically VA-ECMO — stabilizes patient before and sometimes after surgical repair",
      "Surgical repair: delayed until hemodynamic and respiratory stabilization (usually 48-72 hours or after ECMO decannulation)",
      "Sildenafil for pulmonary hypertension management — PDE-5 inhibitor as adjunct to iNO"
    ],
    nursingActions: [
      "At delivery: intubate immediately, place OG tube to suction, do NOT use bag-mask ventilation",
      "Position patient with affected side DOWN and head elevated 30 degrees — allows gravity to shift viscera away from lung",
      "Use gentle ventilator settings: PIP ≤25, avoid high PEEP — hypoplastic lungs are extremely susceptible to barotrauma",
      "Monitor pre-ductal SpO2 (right hand) — target 85-95%; accept lower than normal values to protect hypoplastic lungs",
      "Verify OG tube is to continuous suction — gastric/intestinal distension worsens lung compression",
      "Provide minimal stimulation: sedate with fentanyl to prevent pulmonary hypertensive crises",
      "Prepare for ECMO if OI >40 or pre-ductal SpO2 <85% despite maximum ventilatory support and iNO",
      "Post-surgical monitoring: watch for pneumothorax, re-herniation, and persistent pulmonary hypertension"
    ],
    signs: [
      "Severe respiratory distress at birth: cyanosis, tachypnea, retractions, grunting",
      "Scaphoid (flat/concave) abdomen — abdominal contents have herniated into thorax",
      "Decreased or absent breath sounds on affected side (usually left)",
      "Bowel sounds heard in the chest on auscultation (pathognomonic)",
      "Barrel-shaped chest on affected side with shifted heart sounds to contralateral side",
      "Failure to improve with positive pressure ventilation — should raise CDH suspicion if not prenatally diagnosed"
    ],
    medications: [
      { name: "Inhaled Nitric Oxide", dose: "20 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective pulmonary vasodilator for PPHN — response may be limited due to structural vascular abnormality in CDH" },
      { name: "Fentanyl", dose: "1-4 mcg/kg/hr IV infusion", route: "Intravenous", purpose: "Sedation/analgesia to prevent stimulation-induced pulmonary hypertensive crises" },
      { name: "Sildenafil", dose: "0.5-1 mg/kg q6-8h PO or 0.25-0.5 mg/kg IV", route: "Oral or IV", purpose: "PDE-5 inhibitor for pulmonary hypertension — adjunct to iNO, used for chronic pulmonary hypertension management" },
      { name: "Milrinone", dose: "0.25-0.75 mcg/kg/min IV infusion", route: "Intravenous", purpose: "PDE-3 inhibitor providing pulmonary vasodilation and RV support — improves cardiac output in CDH" }
    ],
    pearls: [
      "NEVER bag-mask ventilate a CDH baby — gas enters the herniated stomach and intestines, worsening lung compression; INTUBATE immediately",
      "Scaphoid abdomen + respiratory distress at birth + absent breath sounds on one side = classic CDH presentation",
      "Surgical repair is DELAYED until the patient is hemodynamically stable — CDH is a physiological emergency, not a surgical emergency",
      "ECMO survival for CDH is approximately 50-60% — lower than MAS (>90%) due to the underlying pulmonary hypoplasia",
      "PIP ≤25 cmH2O — gentle ventilation is critical because hypoplastic lungs are extremely susceptible to barotrauma and pneumothorax",
      "iNO response in CDH is often disappointing because the pulmonary vascular abnormality is structural (medial hypertrophy), not purely vasoreactive"
    ],
    preTest: [
      { question: "Why should bag-mask ventilation be avoided in CDH?", options: ["It causes hypothermia", "It distends the herniated stomach and intestines, further compressing the hypoplastic lung", "It causes surfactant inactivation", "It is always contraindicated in neonates"], correct: 1, rationale: "Bag-mask ventilation delivers gas to both the lungs and (via swallowed air) to the herniated stomach/intestines. The resulting gastric distension further compresses the already hypoplastic lung." },
      { question: "What is the classic abdominal finding in CDH?", options: ["Distended abdomen", "Scaphoid (flat/concave) abdomen", "Normal abdomen", "Rigid abdomen"], correct: 1, rationale: "A scaphoid (flat or concave) abdomen is classic for CDH because abdominal contents have herniated into the thorax, leaving the abdomen relatively empty." }
    ],
    postTest: [
      { question: "A CDH neonate on mechanical ventilation with PIP 25, PEEP 5, iNO 20 ppm has pre-ductal SpO2 of 72% and OI of 48. What is the next management step?", options: ["Increase PIP to 35 cmH2O", "ECMO consultation — OI >40 despite maximal therapy", "Increase PEEP to 12 cmH2O", "Surgical repair immediately"], correct: 1, rationale: "OI >40 with refractory hypoxemia despite gentle ventilation and iNO meets ECMO criteria. Increasing PIP or PEEP risks pneumothorax in hypoplastic lungs. Surgical repair is delayed until stabilization (often post-ECMO)." },
      { question: "Why is surgical repair of CDH delayed rather than performed emergently?", options: ["The defect spontaneously closes", "CDH is a physiological emergency (pulmonary hypertension and hypoplasia) requiring hemodynamic stabilization before surgery", "Surgery cannot be performed on neonates", "Waiting improves lung growth"], correct: 1, rationale: "CDH is a physiological emergency driven by pulmonary hypertension and hypoplasia. Emergent surgery during hemodynamic instability increases mortality. Stabilizing the patient (often for 48-72 hours or post-ECMO) before surgical repair improves outcomes." }
    ],
    quiz: [
      { question: "What prenatal measurement helps predict CDH severity?", options: ["Biparietal diameter", "Lung-to-head ratio (LHR)", "Femur length", "Amniotic fluid index"], correct: 1, rationale: "The lung-to-head ratio (LHR) measured on prenatal ultrasound estimates the degree of pulmonary hypoplasia. LHR <1.0 indicates severe hypoplasia with poor prognosis." },
      { question: "What is the recommended maximum PIP for ventilating a CDH neonate?", options: ["15 cmH2O", "25 cmH2O", "35 cmH2O", "45 cmH2O"], correct: 1, rationale: "PIP ≤25 cmH2O is the recommended maximum for CDH. Hypoplastic lungs are extremely susceptible to barotrauma. Gentle ventilation with permissive hypercapnia is the standard approach." },
      { question: "Which side is CDH most commonly found on?", options: ["Right (80-85%)", "Left (80-85%)", "Bilateral (50%)", "Equal left and right incidence"], correct: 1, rationale: "CDH is left-sided in 80-85% of cases because the left pleuroperitoneal canal closes later during fetal development than the right, creating a longer window for herniation to occur." }
    ]
  },

  "neonatal-respiratory-distress-expanded-rrt": {
    title: "Neonatal RDS: Advanced Management",
    cellular: `Neonatal respiratory distress syndrome (RDS) is caused by surfactant deficiency in premature infants whose type II alveolar epithelial cells have not yet produced adequate surfactant. This lesson expands on advanced RDS management strategies including surfactant administration techniques, non-invasive ventilation approaches, and the integration of US and Canadian clinical guidelines.

Type II alveolar cells begin producing surfactant at approximately 24-28 weeks gestation, with adequate levels typically present by 34-36 weeks. The L/S ratio (lecithin/sphingomyelin) in amniotic fluid ≥2.0 indicates fetal lung maturity. Phosphatidylglycerol (PG) presence confirms maturity. Surfactant reduces alveolar surface tension per the Law of Laplace (P = 2T/r), preventing alveolar collapse at end-expiration. Without surfactant, alveoli collapse with each expiration, requiring enormous inspiratory pressures to re-expand — this creates the characteristic ground-glass appearance on CXR and progressive respiratory failure.

Modern RDS management emphasizes non-invasive respiratory support as the initial strategy. The COIN trial and SUPPORT trial demonstrated that early CPAP reduces the need for intubation and mechanical ventilation in premature infants. The approach hierarchy is: nasal CPAP 5-8 cmH2O → INSURE (Intubation, Surfactant, Extubation) if FiO2 >0.30-0.40 → LISA (Less Invasive Surfactant Administration) via thin catheter during CPAP → mechanical ventilation as last resort.

LISA technique involves threading a thin (4-5 French) feeding catheter through the vocal cords under direct laryngoscopy while the infant breathes spontaneously on CPAP. Surfactant is slowly instilled over 1-5 minutes. Advantages over INSURE: avoids the brief period of positive pressure ventilation, maintains spontaneous breathing throughout, and may further reduce BPD risk.

Volume-targeted ventilation (VTV) for infants requiring mechanical ventilation targets a set tidal volume (4-6 mL/kg in neonates) while the ventilator automatically adjusts PIP breath-to-breath. VTV reduces the incidence of BPD, pneumothorax, severe IVH, and periventricular leukomalacia compared to pressure-limited ventilation.

Antenatal corticosteroids (betamethasone 12 mg IM x 2 doses, 24 hours apart, or dexamethasone 6 mg IM q12h x 4 doses) given to mothers at risk of preterm delivery at 24-34 weeks accelerate fetal lung maturation, reduce RDS incidence by 44%, and decrease neonatal mortality. A rescue course may be given if >7 days since the first course and delivery remains imminent.

US Protocol Notes (NBRC): RDS management including surfactant replacement, CPAP strategies, and ventilator settings for neonates is heavily tested. Understanding the INSURE technique, volume-targeted ventilation, and antenatal steroid effects is essential for TMC and CSE.

Canadian Protocol Notes (CBRC): CPS guidelines emphasize early CPAP, surfactant via INSURE or LISA, and volume-targeted ventilation. Canadian NICUs have been early adopters of LISA technique. Antenatal corticosteroid guidelines follow Society of Obstetricians and Gynaecologists of Canada (SOGC) recommendations.`,
    riskFactors: [
      "Prematurity — inversely proportional to gestational age; highest incidence at <28 weeks",
      "Absence of antenatal corticosteroids — doubles RDS incidence",
      "Male sex — delayed surfactant production compared to females at equivalent gestational age",
      "Cesarean delivery without labor — labor activates catecholamine release promoting surfactant secretion and fluid clearance",
      "Perinatal asphyxia — injury to type II cells reduces surfactant production",
      "Maternal diabetes — insulin inhibits surfactant production (hyperinsulinemic fetus)",
      "Multiple gestation — second twin has higher RDS risk from birth asphyxia",
      "Hypothermia after birth — increases oxygen consumption and surfactant utilization"
    ],
    diagnostics: [
      "Chest X-ray: diffuse bilateral reticulogranular (ground-glass) pattern with air bronchograms — hallmark finding",
      "ABG/capillary blood gas: hypoxemia, hypercapnia, mixed respiratory and metabolic acidosis",
      "L/S ratio ≥2.0 (amniotic fluid) — indicates fetal lung maturity (surfactant sufficiency)",
      "Phosphatidylglycerol presence in amniotic fluid — confirms lung maturity",
      "Lamellar body count in amniotic fluid: >50,000/mcL indicates mature lungs",
      "SpO2 monitoring: continuous with target 90-95%",
      "Lung ultrasound: emerging diagnostic tool — white lung pattern, absent A-lines, confluent B-lines"
    ],
    management: [
      "Antenatal corticosteroids for mothers at risk of preterm delivery 24-34 weeks — reduces RDS by 44%",
      "Delivery room: delayed cord clamping (30-60 seconds), warmth, initial CPAP if spontaneously breathing",
      "Nasal CPAP 5-8 cmH2O as initial respiratory support — avoid intubation when possible",
      "Surfactant via INSURE if FiO2 requirement >0.30-0.40 on CPAP: intubate, give surfactant, extubate to CPAP",
      "LISA technique (preferred when available): thin catheter surfactant during spontaneous breathing on CPAP",
      "Surfactant dosing: poractant alfa 200 mg/kg (first dose), 100 mg/kg (repeat doses q12h PRN, max 3 total doses)",
      "Mechanical ventilation (if needed): volume-targeted 4-6 mL/kg, permissive hypercapnia PaCO2 45-55, pH >7.20",
      "SpO2 targets 90-95% — adjust FiO2 promptly to avoid prolonged hyperoxia",
      "Caffeine citrate: start within first 10 days for BPD prevention and apnea management"
    ],
    nursingActions: [
      "Ensure thermoregulation immediately after birth — hypothermia worsens RDS severity",
      "Initiate CPAP in delivery room if infant is breathing spontaneously — early CPAP reduces intubation need",
      "Assess FiO2 requirement: if >0.30-0.40 on CPAP, prepare for surfactant administration (INSURE or LISA)",
      "After surfactant: do NOT suction ETT for 1-2 hours; be prepared to rapidly decrease FiO2 and ventilator pressures as compliance improves",
      "Monitor for surfactant complications: transient bradycardia, desaturation, ETT obstruction from surfactant bolus",
      "Document surfactant dose, time of administration, and respiratory response (FiO2 change, compliance change)",
      "Position infant prone or side-lying when possible — improves ventilation and oxygenation in RDS",
      "Maintain SpO2 90-95% — frequent FiO2 adjustments may be needed; alarm limits must be properly set"
    ],
    signs: [
      "Respiratory distress within minutes of birth: tachypnea, grunting, nasal flaring, intercostal and subcostal retractions",
      "Progressive worsening over first 48-72 hours (natural history without treatment)",
      "Cyanosis requiring supplemental oxygen",
      "Ground-glass (reticulogranular) appearance on chest X-ray with air bronchograms",
      "Decreased air entry bilaterally on auscultation",
      "Improvement after surfactant administration (often dramatic — FiO2 may decrease significantly within minutes)"
    ],
    medications: [
      { name: "Poractant Alfa (Curosurf)", dose: "200 mg/kg (2.5 mL/kg) first dose; 100 mg/kg repeat doses", route: "Intratracheal via ETT or LISA catheter", purpose: "Natural porcine surfactant — higher first dose (200 mg/kg) shows better outcomes than 100 mg/kg; max 3 doses" },
      { name: "Calfactant (Infasurf)", dose: "3 mL/kg per dose intratracheal", route: "Intratracheal", purpose: "Natural bovine surfactant for neonatal RDS — contains native SP-B and SP-C proteins" },
      { name: "Betamethasone (Antenatal)", dose: "12 mg IM x 2 doses given 24 hours apart to mother", route: "Intramuscular (maternal)", purpose: "Antenatal corticosteroid accelerating fetal lung maturation — reduces RDS by 44%, reduces mortality by 31%" },
      { name: "Caffeine Citrate", dose: "Loading 20 mg/kg, maintenance 5-10 mg/kg daily", route: "IV or Oral", purpose: "Respiratory stimulant and BPD prevention — start early in all infants <32 weeks GA" }
    ],
    pearls: [
      "Antenatal steroids reduce RDS by 44% and neonatal mortality by 31% — one of the most effective interventions in perinatal medicine",
      "Early CPAP is preferred over prophylactic intubation and surfactant in spontaneously breathing premature infants",
      "Surfactant dose matters: poractant alfa 200 mg/kg first dose is superior to 100 mg/kg — use the higher initial dose",
      "After surfactant, compliance improves rapidly — reduce ventilator pressures promptly to prevent volutrauma and pneumothorax",
      "LISA is increasingly the preferred surfactant delivery method — avoids intubation and positive pressure ventilation",
      "Volume-targeted ventilation (4-6 mL/kg) reduces BPD, pneumothorax, and severe IVH compared to pressure-limited ventilation"
    ],
    preTest: [
      { question: "What is the underlying cause of neonatal RDS?", options: ["Meconium aspiration", "Surfactant deficiency from immature type II alveolar cells", "Infection", "Congenital heart disease"], correct: 1, rationale: "Neonatal RDS is caused by surfactant deficiency in premature infants whose type II alveolar epithelial cells have not yet produced adequate surfactant." },
      { question: "What is the hallmark chest X-ray finding in neonatal RDS?", options: ["Unilateral consolidation", "Bilateral reticulogranular (ground-glass) pattern with air bronchograms", "Hyperinflation with flattened diaphragms", "Normal chest X-ray"], correct: 1, rationale: "The classic RDS CXR shows diffuse bilateral reticulogranular (ground-glass) opacities with air bronchograms, reflecting collapsed surfactant-deficient alveoli." }
    ],
    postTest: [
      { question: "A premature infant on CPAP 6 cmH2O requires FiO2 0.45 at 2 hours of life. What is the next management step?", options: ["Continue CPAP and observe", "Administer surfactant via INSURE or LISA technique — FiO2 >0.30-0.40 on CPAP triggers surfactant", "Intubate for mechanical ventilation without surfactant", "Increase CPAP to 12 cmH2O"], correct: 1, rationale: "FiO2 >0.30-0.40 on CPAP despite adequate settings indicates significant surfactant deficiency requiring exogenous surfactant. INSURE (intubate, surfactant, extubate) or LISA (surfactant via thin catheter during CPAP) are the preferred techniques." },
      { question: "Why is volume-targeted ventilation preferred over pressure-limited ventilation in neonates?", options: ["It is easier to set up", "It reduces BPD, pneumothorax, and severe IVH by delivering consistent tidal volumes", "It does not require monitoring", "There is no proven benefit"], correct: 1, rationale: "Volume-targeted ventilation automatically adjusts PIP to deliver a consistent tidal volume, preventing volutrauma from excessive VT and atelectrauma from insufficient VT. Studies show reduced BPD, pneumothorax, and severe IVH compared to pressure-limited ventilation." }
    ],
    quiz: [
      { question: "What is the LISA technique for surfactant administration?", options: ["Intubation with surfactant via ETT", "Surfactant delivered via thin catheter during spontaneous breathing on CPAP", "Aerosolized surfactant via nebulizer", "Surfactant given via nasogastric tube"], correct: 1, rationale: "LISA (Less Invasive Surfactant Administration) delivers surfactant through a thin catheter inserted through the vocal cords while the infant breathes spontaneously on CPAP, avoiding intubation and positive pressure ventilation." },
      { question: "A mother at 28 weeks gestation is in preterm labor. What intervention most reduces the risk of neonatal RDS?", options: ["Immediate cesarean delivery", "Antenatal betamethasone 12 mg IM x 2 doses", "Antibiotics for the mother", "IV magnesium sulfate"], correct: 1, rationale: "Antenatal corticosteroids (betamethasone) are the most effective intervention for reducing neonatal RDS (44% reduction) and mortality (31% reduction) when given to mothers at risk of preterm delivery between 24-34 weeks." },
      { question: "What L/S ratio in amniotic fluid indicates adequate fetal lung maturity?", options: ["≥1.0", "≥1.5", "≥2.0", "≥3.0"], correct: 2, rationale: "L/S ratio ≥2.0 indicates fetal lung maturity with adequate surfactant production. Values <2.0 suggest surfactant deficiency and increased RDS risk." }
    ]
  }
};
