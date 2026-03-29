import type { LessonContent } from "./types";

export const rrtLessonsExpanded2: Record<string, LessonContent> = {
  "aerosol-medication-delivery-rrt": {
    title: "Aerosol Medication Delivery",
    cellular: `Aerosol medication delivery is a core respiratory therapy competency encompassing device selection, technique optimization, drug-device compatibility, and monitoring for therapeutic response. Effective aerosol delivery requires understanding particle physics, airway deposition mechanics, and patient-specific factors that influence drug delivery to the target site.

Aerosol particle size determines deposition location: particles 1-5 microns (respirable fraction) deposit in the lower airways and alveoli — this is the therapeutic target for bronchodilators and inhaled corticosteroids. Particles > 5 microns deposit in the oropharynx by inertial impaction (wasted drug causing local side effects like oral candidiasis with ICS). Particles < 1 micron remain suspended and are exhaled without depositing. The mass median aerodynamic diameter (MMAD) and geometric standard deviation (GSD) characterize the particle size distribution of an aerosol. Optimal MMAD for lower airway deposition is 1-3 microns.

Metered-dose inhalers (MDIs) use a pressurized canister containing drug in solution or suspension with hydrofluoroalkane (HFA) propellant. Each actuation delivers a precise metered dose. Lung deposition from MDI alone is only 10-20% due to high oropharyngeal impaction. Adding a valved holding chamber (spacer) increases lung deposition to 20-40% by reducing particle velocity and allowing large particles to settle before inhalation. MDI technique: shake canister, exhale fully, place mouthpiece between lips (or spacer), actuate at the beginning of a slow deep inhalation, hold breath 10 seconds, wait 30-60 seconds between puffs. Common errors: failing to shake, actuating before or after inhalation, inhaling too rapidly (increases impaction), and not holding breath (reduces sedimentation).

Dry powder inhalers (DPIs) deliver drug as a dry powder activated by the patient's inspiratory effort. Unlike MDIs, DPIs require a rapid, forceful inhalation (minimum 30-60 L/min depending on device) to deaggregate the powder into respirable particles. DPIs do NOT require breath coordination with actuation (advantage over MDIs) but are unsuitable for patients who cannot generate adequate inspiratory flow (young children, severe dyspnea, mechanically ventilated patients). Lung deposition is 20-40%. Examples: Diskus, Turbuhaler, HandiHaler, Ellipta.

Small volume nebulizers (SVNs) generate aerosol from liquid drug solution using compressed gas (jet nebulizer) or vibrating mesh/piezoelectric technology (mesh nebulizer). Jet nebulizers require 6-8 L/min driving gas flow, produce MMAD of 2-5 microns, and deliver drug over 10-15 minutes. Mesh nebulizers (Aerogen Solo) are more efficient, produce smaller and more consistent particle sizes, and are preferred for ventilator circuit delivery because they do not add flow to the circuit. During mechanical ventilation, nebulizer placement in the inspiratory limb 15 cm proximal to the Y-piece optimizes drug delivery, with humidifier turned off temporarily to prevent hygroscopic growth of aerosol particles.

Large volume nebulizers (LVNs) provide continuous aerosol delivery for bronchodilator therapy in severe asthma exacerbation (albuterol 10-15 mg/hr) and for bland aerosol therapy (sterile water or normal saline) for sputum induction and upper airway humidification. Ultrasonic nebulizers generate very dense aerosol and are used for sputum induction but are NOT appropriate for drug delivery due to drug denaturation from heat generation.`,
    riskFactors: [
      "Incorrect inhaler technique reducing lung deposition to < 10% — the most common cause of apparent treatment failure",
      "Bronchospasm paradox from excessive nebulizer treatments or preservative-induced bronchospasm (benzalkonium chloride)",
      "Oral candidiasis from inhaled corticosteroid deposition in oropharynx — mitigated by mouth rinsing and spacer use",
      "Systemic side effects: tachycardia and tremor from beta-2 agonists, hyperglycemia from systemic corticosteroid absorption",
      "Aerosol-generated infection transmission risk — use filters, avoid SVNs in isolation rooms for airborne diseases",
      "Drug incompatibility when mixing medications in same nebulizer (e.g., cromolyn + certain bronchodilators)",
      "Environmental contamination from exhaled aerosol in shared patient rooms",
      "Equipment contamination from inadequate nebulizer cleaning — Pseudomonas and mold colonization"
    ],
    diagnostics: [
      "Peak flow or FEV1 measurement before and 15-20 minutes after bronchodilator to assess response",
      "Breath sound auscultation comparing pre- and post-treatment air entry and adventitious sounds",
      "Respiratory rate, heart rate, SpO2, and work of breathing assessment before and after treatment",
      "Inhaler technique assessment using checklist scoring — correct every error observed",
      "Inspiratory flow measurement for DPI suitability (In-Check DIAL device)",
      "Sputum assessment for characteristics (volume, color, consistency) following aerosol therapy"
    ],
    management: [
      "Select device based on patient ability: MDI+spacer for most patients, DPI for coordinated patients with adequate flow, SVN for severe dyspnea or inability to use handhelds",
      "Use MDI+spacer rather than nebulizer for non-critical patients — equivalent efficacy with less infection risk",
      "For mechanically ventilated patients: mesh nebulizer in inspiratory limb, 15 cm from Y-piece, temporarily reduce humidification",
      "MDI via ventilator circuit: actuate in spacer device during early inspiration, coordinate with ventilator inspiration",
      "Continuous albuterol nebulization (10-15 mg/hr) for severe asthma exacerbation unresponsive to intermittent dosing",
      "Educate and re-educate: assess inhaler technique at EVERY visit — studies show technique deteriorates over time",
      "Add spacer to all MDI prescriptions — increases lung deposition from 10-20% to 20-40%",
      "Prescribe mouth rinsing after every ICS use to prevent oral candidiasis and dysphonia"
    ],
    nursingActions: [
      "Assess and correct inhaler technique at every patient encounter — most patients make at least one critical error",
      "Document pre- and post-treatment vital signs, breath sounds, peak flow, and patient response",
      "Verify drug, dose, route, time, and patient before every aerosol treatment (5 rights of medication administration)",
      "Clean and disinfect reusable nebulizers between treatments per institutional protocol — air dry completely",
      "Monitor heart rate during beta-2 agonist therapy — hold treatment and notify provider if HR > 120-140 or new arrhythmia",
      "Assess oral cavity for candidiasis in patients on ICS — white patches on buccal mucosa, tongue, or palate",
      "Position patient upright (45-90 degrees) for all aerosol treatments to optimize diaphragmatic excursion and aerosol deposition",
      "Use mouthpiece rather than face mask when possible — mask delivery loses 50% of dose to facial deposition"
    ],
    signs: [
      "Effective bronchodilator response: improved air entry, decreased wheezing, reduced respiratory rate, improved SpO2",
      "Paradoxical bronchospasm: worsening wheezing and dyspnea during nebulization — stop treatment, assess, may need different formulation",
      "Beta-2 agonist systemic effects: tremor, tachycardia, hypokalemia — expected at high doses, monitor in continuous nebulization",
      "ICS local effects: oral candidiasis (white patches), hoarseness (dysphonia), throat irritation",
      "Treatment failure despite good technique: reassess diagnosis, consider medication change, assess adherence",
      "Mucus clearance response: productive cough with sputum mobilization following bronchial hygiene with hypertonic saline"
    ],
    medications: [
      { name: "Albuterol (SABA)", dose: "2.5-5 mg SVN or 2-4 puffs MDI q4-6h PRN, or 10-15 mg/hr continuous", route: "Inhaled", purpose: "Short-acting beta-2 agonist for acute bronchospasm — most commonly prescribed respiratory medication" },
      { name: "Ipratropium (SAMA)", dose: "0.5 mg SVN or 2-4 puffs MDI q6h", route: "Inhaled", purpose: "Anticholinergic bronchodilator — additive benefit with SABA in acute exacerbations" },
      { name: "Budesonide (ICS)", dose: "0.25-1 mg SVN BID or 180-720 mcg DPI BID", route: "Inhaled", purpose: "Anti-inflammatory controller for persistent asthma — reduces airway inflammation, hyperresponsiveness, and remodeling" },
      { name: "Hypertonic Saline (3-7%)", dose: "4 mL nebulized BID-QID", route: "Inhaled", purpose: "Mucoactive agent for cystic fibrosis and bronchiectasis — draws fluid into airways to improve mucociliary clearance" }
    ],
    pearls: [
      "MDI+spacer is as effective as nebulizer for delivering bronchodilators in non-critical patients — with less infection risk and faster treatment time",
      "Mouth rinsing after ICS use prevents oral candidiasis and reduces systemic absorption — educate at EVERY ICS prescription",
      "DPIs require rapid, forceful inhalation (opposite of MDI technique) — patients often confuse techniques if using both device types",
      "In ventilated patients, mesh nebulizers are preferred over jet nebulizers because they do not add extra flow to the circuit",
      "The most common cause of apparent inhaler failure is incorrect technique — ALWAYS observe technique before changing medications",
      "Inhaler technique deteriorates over time even after proper instruction — reassess at EVERY visit, not just the initial prescription"
    ],
    quiz: [
      { question: "What is the optimal particle size for lower airway deposition of inhaled medications?", options: ["0.1-0.5 microns", "1-5 microns", "5-10 microns", "10-20 microns"], correct: 1, rationale: "Particles 1-5 microns (respirable fraction) deposit in the lower airways and alveoli, which is the therapeutic target. Particles > 5 microns deposit in the oropharynx by impaction (wasted drug, local side effects). Particles < 1 micron remain suspended and are exhaled without depositing." },
      { question: "Which device is MOST appropriate for a patient with severe dyspnea who cannot coordinate inhalation with MDI actuation?", options: ["MDI alone", "Dry powder inhaler", "MDI with spacer/valved holding chamber", "Small volume nebulizer"], correct: 3, rationale: "A patient with severe dyspnea likely cannot perform the slow, coordinated inhalation needed for MDI (even with spacer) or generate the forceful inhalation needed for DPI. Small volume nebulizers require only normal tidal breathing, making them ideal for patients in respiratory distress." },
      { question: "Where should a nebulizer be placed in a mechanical ventilator circuit for optimal drug delivery?", options: ["At the Y-piece", "In the expiratory limb", "In the inspiratory limb 15 cm proximal to the Y-piece", "Between the humidifier and the ventilator"], correct: 2, rationale: "Placing the nebulizer in the inspiratory limb approximately 15 cm before the Y-piece optimizes drug delivery by allowing the aerosol to be entrained into the inspiratory gas flow and delivered to the patient. Temporarily reducing humidification prevents hygroscopic particle growth that increases deposition in the circuit rather than the patient." }
    ]
  },

  "bronchial-hygiene-therapy-rrt": {
    title: "Bronchial Hygiene Therapy",
    cellular: `Bronchial hygiene therapy encompasses techniques and devices designed to mobilize and remove retained secretions from the airway. Effective secretion clearance is essential in patients with impaired mucociliary transport, excessive mucus production, or weak cough mechanics. Respiratory therapists select, apply, and modify bronchial hygiene techniques based on patient assessment and response.

Normal mucociliary clearance relies on intact ciliated epithelium, adequate periciliary fluid (sol layer), and appropriately hydrated mucus (gel layer). The cilia beat in a coordinated metachronal wave at 12-15 Hz, propelling the mucus blanket toward the pharynx at approximately 2 cm/min in the trachea. Conditions that impair mucociliary clearance include cystic fibrosis (thick, dehydrated mucus), COPD (goblet cell hyperplasia and squamous metaplasia replacing ciliated epithelium), immobilization and sedation, endotracheal intubation (cuff compresses mucosal blood flow, humidification may be inadequate), and general anesthesia (ciliary depression for 6-72 hours post-operatively).

Chest physiotherapy (CPT) involves percussion, vibration, and postural drainage. Postural drainage uses gravity to drain specific lung segments by positioning the target bronchus vertically. Percussion is performed with cupped hands at 3-5 Hz over the affected lung segment for 3-5 minutes per position. Vibration (manual or mechanical) is applied during expiration to enhance secretion movement. Modified positions are used when Trendelenburg is contraindicated (elevated ICP, uncontrolled hypertension, recent abdominal or thoracic surgery, unstable hemodynamics). CPT is labor-intensive and has been largely replaced by newer airway clearance techniques in ambulatory patients, though it remains relevant in pediatrics (cystic fibrosis) and immobile ICU patients.

Positive expiratory pressure (PEP) therapy maintains a back-pressure of 10-20 cmH2O during expiration through a resistor. This pressure splints airways open, preventing premature closure during expiration, and allows air to move behind obstructing mucus plugs via collateral ventilation channels (pores of Kohn, canals of Lambert), pushing secretions toward larger airways where coughing is effective. PEP is performed in sets of 10-20 breaths followed by 2-3 huff coughs. Oscillating PEP devices (Flutter valve, Acapella, Aerobika) add high-frequency oscillations (10-25 Hz) to the PEP effect, further loosening adherent secretions. Oscillating PEP is first-line bronchial hygiene for cystic fibrosis patients.

High-frequency chest wall oscillation (HFCWO) uses an inflatable vest connected to an air pulse generator that delivers rapid oscillations (5-25 Hz) to the chest wall, creating oscillating airflow that shears mucus from airway walls. The SmartVest and inCourage systems are commonly used in cystic fibrosis and bronchiectasis. Treatment protocol typically involves 30 minutes at varying frequencies with periodic cough breaks.

Airway suctioning removes secretions when the patient cannot cough effectively. Open suctioning involves disconnecting the patient from the ventilator, inserting a catheter, and applying negative pressure during withdrawal. Closed (inline) suctioning maintains the ventilator circuit connection, preventing PEEP loss, desaturation, and aerosolization. Suction catheter size should be no more than half the internal diameter of the ETT (French size = ETT mm x 2). Suction pressure: adults 100-150 mmHg, pediatrics 80-100 mmHg, neonates 60-80 mmHg. Duration: < 15 seconds per pass. Pre-oxygenation with 100% FiO2 for 30-60 seconds before suctioning reduces desaturation episodes.

Effective coughing technique: instruct the patient to inhale deeply, hold breath briefly, then cough with a forceful expulsion. Huff coughing (forced expiratory technique) involves exhaling forcefully through an open glottis — it is less fatiguing than coughing and more effective at clearing peripheral secretions. Assisted coughing (quad cough) uses manually applied abdominal thrust during expiration for patients with neuromuscular weakness. Mechanical insufflation-exsufflation (MI-E, CoughAssist) delivers a positive pressure insufflation followed by rapid negative pressure exsufflation, simulating a natural cough. MI-E is the gold standard for secretion clearance in neuromuscular disease (ALS, spinal cord injury, muscular dystrophy).`,
    riskFactors: [
      "Vagal stimulation during suctioning causing bradycardia, hypotension, or cardiac arrest",
      "Hypoxemia from interruption of oxygen therapy or PEEP loss during open suctioning",
      "Mucosal trauma and bleeding from excessive suction pressure or repeated catheter passes",
      "Bronchospasm triggered by suction catheter stimulating airway reflexes",
      "Atelectasis from excessive negative suction pressure collapsing lung segments",
      "Increased intracranial pressure during suctioning in patients with head injury or ICP monitoring",
      "Rib fractures from overly vigorous percussion in osteoporotic patients",
      "Aspiration during postural drainage in patients with poor airway protective reflexes"
    ],
    diagnostics: [
      "Chest auscultation for adventitious sounds (rhonchi, coarse crackles) indicating retained secretions",
      "Sawtooth pattern on ventilator flow waveform suggesting secretions in the airway",
      "Rising peak airway pressure with stable plateau pressure indicating increased airway resistance from secretions",
      "Sputum assessment: volume, color (clear, yellow, green, rust-colored), consistency (thin, thick, tenacious), and odor",
      "Chest X-ray showing mucus plugging with lobar or segmental atelectasis",
      "SpO2 and vital sign monitoring during and after bronchial hygiene therapy",
      "Peak cough flow measurement (< 270 L/min inadequate for secretion clearance, < 160 L/min indicates need for MI-E)"
    ],
    management: [
      "Select bronchial hygiene technique based on patient population: oscillating PEP for CF/bronchiectasis, MI-E for neuromuscular disease, suctioning for intubated patients",
      "Pre-oxygenate with 100% FiO2 for 30-60 seconds before suctioning to prevent desaturation",
      "Use closed (inline) suctioning for all mechanically ventilated patients to maintain PEEP and reduce infection risk",
      "Limit suction catheter diameter to half the ETT internal diameter and suction pressure to 100-150 mmHg in adults",
      "Apply PEP therapy 10-20 cmH2O for 10-20 breaths, followed by 2-3 huff coughs, repeat 4-6 cycles per session",
      "Ensure adequate systemic hydration (1.5-2 L/day unless fluid restricted) to maintain secretion viscosity",
      "Administer bronchodilator before bronchial hygiene therapy to open airways for optimal secretion drainage",
      "Suction only when clinically indicated (audible secretions, rising PIP, desaturation) — not on a fixed schedule"
    ],
    nursingActions: [
      "Assess for indications for bronchial hygiene before each treatment: audible secretions, adventitious sounds, rising PIP, visible secretions in ETT",
      "Pre-oxygenate, limit suction passes to 2-3 per episode, monitor HR and SpO2 continuously during suctioning",
      "Document sputum characteristics (amount, color, consistency, odor) and patient response to therapy",
      "Assess for contraindications to postural drainage: elevated ICP, uncontrolled hypertension, recent esophageal/abdominal surgery",
      "Monitor for vagal response during suctioning: bradycardia, hypotension — stop immediately and oxygenate if occurs",
      "Educate ambulatory patients on independent airway clearance techniques (PEP, huff cough, HFCWO) for home use",
      "Coordinate bronchial hygiene with bronchodilator and mucolytic aerosol therapy for optimal timing",
      "Assess peak cough flow in neuromuscular disease patients — refer for MI-E if < 270 L/min"
    ],
    signs: [
      "Successful therapy: improved breath sounds, resolution of rhonchi, decreased PIP, improved SpO2, productive expectoration",
      "Retained secretions: coarse crackles or rhonchi, rising PIP with stable Pplat, visible secretions in ETT, sawtooth flow pattern",
      "Suction-induced complications: bradycardia, desaturation, bloody sputum (trauma), bronchospasm (wheezing post-suction)",
      "Mucus plugging: sudden lobar or segmental atelectasis, asymmetric chest rise, absent breath sounds over affected area",
      "Effective cough: peak cough flow > 270 L/min with audible secretion clearance",
      "Inadequate cough: weak effort, inability to mobilize secretions, peak cough flow < 160 L/min requiring MI-E"
    ],
    medications: [
      { name: "Acetylcysteine (Mucomyst)", dose: "3-5 mL of 10-20% solution nebulized", route: "Inhaled", purpose: "Mucolytic that breaks disulfide bonds in mucus glycoproteins, reducing viscosity — can cause bronchospasm, pretreat with bronchodilator" },
      { name: "Dornase Alfa (Pulmozyme)", dose: "2.5 mg nebulized once daily", route: "Inhaled", purpose: "Recombinant DNase that cleaves extracellular DNA in CF sputum, reducing viscosity — CF-specific, not for non-CF bronchiectasis" },
      { name: "Hypertonic Saline (7%)", dose: "4 mL nebulized BID-QID", route: "Inhaled", purpose: "Osmotic mucoactive agent drawing fluid into airways to hydrate mucus — beneficial in CF and bronchiectasis" },
      { name: "Albuterol (pre-treatment)", dose: "2.5 mg nebulized 15-20 minutes before bronchial hygiene", route: "Inhaled", purpose: "Bronchodilator administered before mucolytic or hypertonic saline to prevent bronchospasm" }
    ],
    pearls: [
      "Suction only when indicated by clinical assessment — routine scheduled suctioning causes unnecessary mucosal trauma and complications",
      "Catheter size should be no more than half the ETT internal diameter — too large occludes the airway and causes atelectasis from excessive negative pressure",
      "Dornase alfa (Pulmozyme) is effective ONLY in cystic fibrosis — it does NOT benefit non-CF bronchiectasis or other secretion-retaining conditions",
      "Peak cough flow < 270 L/min = inadequate secretion clearance; < 160 L/min = impaired cough for respiratory infection defense — MI-E threshold",
      "Huff coughing (forced expiration through open glottis) is more effective than forceful coughing for peripheral secretion mobilization",
      "Always administer bronchodilator BEFORE mucolytic or hypertonic saline — these agents can trigger significant bronchospasm"
    ],
    quiz: [
      { question: "What is the maximum suction catheter French size for a patient with an 8.0 mm ETT?", options: ["8 French", "10 French", "14 French", "16 French"], correct: 3, rationale: "Suction catheter size should be no more than half the internal diameter of the ETT. Conversion: French size = ETT mm × 2. For an 8.0 mm ETT: max catheter = 8 × 2 = 16 French. Using a catheter that exceeds half the ETT diameter occludes the airway during suctioning, generating excessive negative pressure that causes atelectasis and hypoxemia." },
      { question: "Which airway clearance device is most appropriate for a patient with ALS and peak cough flow of 140 L/min?", options: ["HFCWO vest", "Oscillating PEP (Acapella)", "Mechanical insufflation-exsufflation (CoughAssist)", "Standard CPT with percussion"], correct: 2, rationale: "Peak cough flow < 160 L/min indicates the patient cannot generate an effective cough for secretion clearance. Mechanical insufflation-exsufflation (MI-E/CoughAssist) is the gold standard for neuromuscular disease patients — it delivers positive pressure insufflation followed by rapid negative pressure exsufflation to simulate a cough when muscular weakness prevents natural cough generation." },
      { question: "What should be administered BEFORE nebulizing hypertonic saline or acetylcysteine?", options: ["Systemic corticosteroid", "Inhaled bronchodilator (albuterol)", "Normal saline lavage", "Mucolytic via MDI"], correct: 1, rationale: "Both hypertonic saline and acetylcysteine can cause significant bronchospasm in susceptible patients. A bronchodilator (albuterol) should be administered 15-20 minutes before these agents to pre-dilate the airways and prevent bronchospasm during mucoactive therapy." }
    ]
  },

  "hemodynamic-monitoring-rrt": {
    title: "Hemodynamic Monitoring for RT",
    cellular: `Respiratory therapists must understand hemodynamic monitoring because positive pressure ventilation profoundly affects cardiovascular function, and hemodynamic status directly influences respiratory management decisions. Interpreting hemodynamic parameters in the context of ventilator interactions is a high-yield competency for board examinations and clinical practice.

Invasive hemodynamic monitoring via pulmonary artery catheter (PAC/Swan-Ganz) provides direct measurement of right atrial pressure (RAP/CVP, normal 2-6 mmHg), pulmonary artery pressure (PAP, normal 25/10 mmHg, mean 15), pulmonary artery occlusion pressure (PAOP/wedge, normal 8-12 mmHg reflecting left atrial pressure), and mixed venous oxygen saturation (SvO2, normal 60-75%). Cardiac output is measured by thermodilution (inject 10 mL cold saline into RA port, thermistor at PA tip measures temperature change — faster temperature return to baseline = lower CO). Normal cardiac index is 2.5-4.0 L/min/m2.

Hemodynamic profiles differentiate shock types: cardiogenic shock (low CO, high PAOP, high SVR), hypovolemic shock (low CO, low PAOP, high SVR), distributive/septic shock (high CO, low PAOP, low SVR in warm shock; low CO, low PAOP, high SVR in cold shock), obstructive shock (low CO, elevated right-sided pressures in PE or tamponade). RTs must recognize that ventilator settings directly influence these parameters — PEEP affects CVP and PAOP readings, and positive pressure ventilation alters cardiac output.

CVP and PAOP must be measured at end-expiration to minimize the effect of intrathoracic pressure changes. In spontaneous breathing, end-expiration is the highest point on the CVP waveform (least negative intrathoracic pressure). In mechanically ventilated patients, end-expiration is the lowest point (return to set PEEP level). High PEEP can falsely elevate CVP and PAOP readings — approximately 50% of PEEP is transmitted to the pleural space in normal lungs (less in stiff lungs, more in compliant lungs). Some clinicians subtract half the PEEP from CVP/PAOP, though this correction is imprecise.

Stroke volume variation (SVV) and pulse pressure variation (PPV) are dynamic predictors of fluid responsiveness in mechanically ventilated patients. During positive pressure inspiration, venous return decreases, and left ventricular stroke volume changes cyclically. PPV > 13% or SVV > 13% predicts fluid responsiveness (the patient will increase cardiac output with a fluid bolus). These measurements are valid only in patients on controlled ventilation with VT ≥ 8 mL/kg, no arrhythmias, and no spontaneous breathing effort.

SvO2 monitoring reflects the balance between oxygen delivery (DO2) and oxygen consumption (VO2). Normal SvO2 is 60-75%. Decreased SvO2 indicates inadequate oxygen delivery (low CO, low hemoglobin, low SaO2) or increased oxygen consumption (fever, pain, shivering, seizures). SvO2 < 40% indicates tissue hypoxia requiring immediate intervention. Increased SvO2 may indicate sepsis (mitochondrial dysfunction preventing oxygen utilization), left-to-right shunt, or cyanide poisoning.`,
    riskFactors: [
      "PA catheter complications: PA rupture (fatal), arrhythmia during insertion, infection, thrombus formation",
      "Misinterpretation of hemodynamic data not accounting for PEEP effects on CVP and PAOP",
      "Over-reliance on CVP as a marker of fluid responsiveness (CVP poorly predicts volume responsiveness)",
      "Auto-PEEP elevating CVP and confounding hemodynamic assessment in obstructive disease",
      "Air embolism during CVC insertion — mitigated by Trendelenburg positioning and Valsalva maneuver",
      "Catheter tip migration causing persistent PA wedge (risk of PA infarction) — always unwedge promptly",
      "Thermodilution CO errors from tricuspid regurgitation, intracardiac shunts, or low CO states"
    ],
    diagnostics: [
      "CVP measurement at end-expiration for right ventricular preload assessment (normal 2-6 mmHg)",
      "PAOP measurement during balloon inflation for left ventricular preload assessment (normal 8-12 mmHg)",
      "Cardiac output/cardiac index via thermodilution or pulse contour analysis",
      "SVR calculation: (MAP - CVP) × 80 / CO — normal 900-1400 dynes·sec/cm5",
      "PVR calculation: (mean PAP - PAOP) × 80 / CO — normal 100-250 dynes·sec/cm5",
      "SvO2 from PA catheter or ScvO2 from CVC as surrogate (normally 5-8% higher than SvO2)",
      "PPV/SVV on arterial line waveform analysis for fluid responsiveness in controlled ventilation",
      "Passive leg raise test: 45-degree leg elevation with CO monitoring — ≥ 10% CO increase predicts fluid responsiveness"
    ],
    management: [
      "Interpret all hemodynamic values at end-expiration and in context of current PEEP and ventilator settings",
      "Use dynamic indices (PPV, SVV, PLR) over static indices (CVP, PAOP) for fluid responsiveness assessment",
      "Optimize PEEP to balance oxygenation benefit against hemodynamic compromise — assess CO after PEEP changes",
      "Treat cardiogenic shock profile: inotropes (dobutamine), vasodilators (milrinone), IABP, reduce afterload",
      "Treat septic shock profile: volume resuscitation, vasopressors (norepinephrine first-line), source control",
      "Monitor SvO2 trends — falling SvO2 suggests imbalance between O2 delivery and consumption requiring intervention",
      "Consider hemodynamic effects before any ventilator change — increasing PEEP or mean airway pressure may drop CO",
      "Perform PEEP-off hemodynamic assessment when values seem inconsistent with clinical picture"
    ],
    nursingActions: [
      "Zero-reference the transducer at the phlebostatic axis (4th intercostal space, mid-axillary line) every shift and after repositioning",
      "Read hemodynamic values at end-expiration on the waveform tracing — do not rely on digital display averages",
      "Perform square wave test (fast flush) to verify proper transducer response — overdamped systems underestimate systolic pressure",
      "Monitor for PA catheter migration: continuous PA waveform should show typical PA tracing — if wedge waveform appears, deflate balloon and notify provider",
      "Document hemodynamic profile trends (CO, SVR, PAOP, SvO2) and correlate with ventilator changes",
      "Assess for signs of low cardiac output after PEEP increases: hypotension, tachycardia, rising lactate, falling SvO2",
      "Calculate oxygen delivery (DO2 = CO × CaO2 × 10) and consumption (VO2) to guide therapy in shock states"
    ],
    signs: [
      "Cardiogenic shock: low CO/CI, elevated PAOP > 18, elevated SVR, cool/mottled extremities",
      "Hypovolemic shock: low CO/CI, low PAOP < 8, elevated SVR, flat neck veins, tachycardia",
      "Distributive (septic) shock: high CO/CI initially, low PAOP, low SVR, warm extremities, bounding pulses",
      "Right ventricular failure: elevated CVP, elevated PAP, normal or low PAOP, low CO — worsened by PEEP",
      "Fluid responsiveness: PPV > 13%, SVV > 13%, or ≥ 10% CO increase with PLR",
      "Tissue hypoxia: SvO2 < 40%, rising lactate, metabolic acidosis despite adequate SaO2 and hemoglobin"
    ],
    medications: [
      { name: "Norepinephrine", dose: "0.01-3 mcg/kg/min IV infusion", route: "Intravenous", purpose: "First-line vasopressor for septic shock — alpha-1 vasoconstriction with some beta-1 inotropic effect" },
      { name: "Dobutamine", dose: "2.5-20 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Beta-1 inotrope for cardiogenic shock — increases contractility and CO without significant vasoconstriction" },
      { name: "Milrinone", dose: "0.375-0.75 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Phosphodiesterase inhibitor inodilator for acute decompensated heart failure — increases CO and reduces afterload" },
      { name: "Vasopressin", dose: "0.01-0.04 units/min IV infusion", route: "Intravenous", purpose: "Non-catecholamine vasopressor added to norepinephrine in refractory septic shock" }
    ],
    pearls: [
      "CVP does NOT reliably predict fluid responsiveness — use dynamic indices (PPV, SVV, PLR) for fluid management decisions",
      "Read hemodynamic values at END-EXPIRATION on the waveform — the digital display averages values across the respiratory cycle and is misleading",
      "PEEP falsely elevates CVP and PAOP — approximately 50% of PEEP transmits to pleural space in normal lungs, less in stiff ARDS lungs",
      "A falling SvO2 is an early warning of deteriorating O2 delivery-consumption balance — it often precedes hemodynamic collapse",
      "PPV/SVV are only valid in controlled mechanical ventilation with VT ≥ 8 mL/kg, regular rhythm, and no spontaneous breathing",
      "Always assess hemodynamics after PEEP changes — increasing PEEP improves oxygenation but may crash cardiac output in hypovolemic patients"
    ],
    quiz: [
      { question: "A ventilated patient has CVP 16, PAOP 22, CO 3.2 L/min, SVR 1800. What type of shock is this?", options: ["Septic shock", "Hypovolemic shock", "Cardiogenic shock", "Neurogenic shock"], correct: 2, rationale: "Low CO (3.2, normal 4-8), elevated PAOP (22, reflecting LV failure and backup), and elevated SVR (1800, compensatory vasoconstriction) is the classic cardiogenic shock profile. The heart is failing as a pump, fluid is backing up (high filling pressures), and the body is vasoconstricting to maintain blood pressure." },
      { question: "At what point in the respiratory cycle should CVP be measured in a mechanically ventilated patient?", options: ["Peak inspiration", "Mid-inspiration", "End-expiration", "Any point — it does not matter"], correct: 2, rationale: "Hemodynamic values should be read at end-expiration when intrathoracic pressure is at its most stable baseline. In mechanical ventilation, end-expiration is the lowest point on the CVP waveform (return to PEEP level). Reading at other points incorporates intrathoracic pressure artifacts from positive pressure ventilation." },
      { question: "A septic patient on norepinephrine has SvO2 of 45%. What does this indicate?", options: ["Adequate tissue oxygenation", "Oxygen delivery-consumption imbalance with tissue hypoxia", "Excessive oxygen delivery", "Normal finding in sepsis"], correct: 1, rationale: "SvO2 < 60% indicates the tissues are extracting more oxygen than normal because delivery is inadequate relative to consumption. SvO2 < 40-50% represents significant tissue hypoxia. In sepsis, this may indicate inadequate cardiac output, anemia, or hypoxemia despite vasopressor support — optimize all components of DO2." }
    ]
  },

  "patient-transport-respiratory-rrt": {
    title: "Patient Transport Respiratory Considerations",
    cellular: `Intrahospital transport of mechanically ventilated and critically ill patients carries significant risk of adverse events including desaturation, hemodynamic instability, accidental extubation, and equipment failure. Respiratory therapists play a critical role in planning, executing, and monitoring transport to minimize these risks.

Transport indications include diagnostic imaging (CT, MRI, interventional radiology), surgical procedures, and inter-unit transfers. The decision to transport must weigh diagnostic benefit against transport risk — some unstable patients may benefit from bedside procedures (portable ultrasound, bedside bronchoscopy) rather than transport.

Pre-transport assessment and preparation is the most important phase. The RT must verify: adequate oxygen supply (calculate total O2 needed: minute ventilation × transport time × 3 for safety margin, plus emergency reserve), functioning transport ventilator with appropriate mode and settings matching ICU ventilator, full monitoring (SpO2, ETCO2, ECG, blood pressure), emergency equipment (manual resuscitation bag, spare ETT, suction), and all medications (sedation, vasopressors on battery-powered pumps).

Transport ventilators range from basic (volume-cycled, limited modes) to advanced (full ICU-equivalent with pressure modes, PEEP, FiO2 blending). For ARDS patients on complex ventilator settings (high PEEP, specific I:E ratios, precise FiO2), the transport ventilator must be capable of matching these settings. If it cannot, the risks of transport must be reconsidered.

During transport, the RT must maintain continuous monitoring of SpO2, ETCO2 (to confirm ETT position and ventilation), and hemodynamic parameters. Common adverse events during transport: desaturation from PEEP loss during ventilator switch, accidental extubation during transfer between beds, hemodynamic instability from position changes and interruption of vasoactive infusions, equipment failure (O2 tank depletion, ventilator malfunction), and loss of IV access.

Post-transport verification includes: ETT position confirmation (ETCO2, depth at teeth, bilateral breath sounds), hemodynamic reassessment, ventilator settings verification matching pre-transport ICU settings, and chest X-ray if any concern about line or tube displacement.`,
    riskFactors: [
      "Accidental extubation during patient transfer between beds or during positioning for imaging",
      "Oxygen tank depletion during prolonged transport or delays — always calculate and verify O2 supply",
      "PEEP loss during ventilator switch causing acute desaturation and alveolar derecruitment in ARDS patients",
      "Hemodynamic instability from position changes, interruption of vasoactive infusions, or temperature changes",
      "Transport ventilator inability to match ICU ventilator settings (PEEP, FiO2, advanced modes)",
      "Equipment failure: ventilator malfunction, monitor battery depletion, suction failure",
      "MRI-specific risks: ferromagnetic equipment in MRI suite, projectile hazards, monitor incompatibility",
      "Prolonged transport time increasing risk of all adverse events"
    ],
    diagnostics: [
      "Pre-transport ABG to establish baseline oxygenation and ventilation",
      "Continuous SpO2, ETCO2, ECG, and blood pressure monitoring throughout transport",
      "Post-transport chest X-ray to verify ETT, CVC, and other device positions",
      "Post-transport ABG if any desaturation, hemodynamic instability, or ventilator change occurred",
      "O2 supply calculation: E-cylinder contains 660 L; flow rate × time needed = total O2 required (use safety factor of 3×)",
      "Transport ventilator pre-test: verify settings, alarms, FiO2 accuracy, and battery life before disconnecting ICU ventilator"
    ],
    management: [
      "Complete pre-transport checklist: O2 supply, transport ventilator tested, monitoring equipment, emergency airway kit, medications",
      "Match transport ventilator settings to ICU ventilator as closely as possible — verify with test lung if available",
      "Pre-oxygenate with 100% FiO2 for 5 minutes before ventilator switch to provide oxygen reserve",
      "Secure ETT and all lines before patient movement — verify ETT position (ETCO2, depth) immediately after transfer",
      "Maintain PEEP during ventilator switch using PEEP valve on manual resuscitation bag if brief manual ventilation is needed",
      "Assign roles: one team member manages airway/ventilator, one manages monitors/IV pumps, one manages patient positioning",
      "Abort transport if patient becomes hemodynamically unstable or develops acute desaturation not responsive to interventions",
      "Document all transport events, settings changes, and adverse events in the medical record"
    ],
    nursingActions: [
      "Calculate oxygen supply requirement before leaving ICU: E-cylinder duration = (pressure × 0.28) / flow rate",
      "Test transport ventilator on the patient for 5 minutes before leaving ICU to verify adequate ventilation and oxygenation",
      "Maintain hand on ETT during all patient transfers between beds to prevent accidental extubation",
      "Bring manual resuscitation bag with PEEP valve as backup for transport ventilator failure",
      "Continue sedation and vasopressor infusions uninterrupted — transfer pumps to battery power before unplugging",
      "Monitor ETCO2 continuously during transport as the first indicator of ETT displacement or ventilator malfunction",
      "Verify MRI compatibility of ALL equipment before entering the MRI suite — NO ferromagnetic devices",
      "Communicate transport plan, estimated time, and patient acuity level with receiving team before departure"
    ],
    signs: [
      "Successful transport: stable SpO2, ETCO2, hemodynamics, and no device displacement throughout",
      "Desaturation event: falling SpO2 during transport — check ETT position, ventilator function, O2 supply immediately",
      "Accidental extubation: loss of ETCO2 waveform, sudden air leak, inability to ventilate — reintubate or bag-mask ventilate",
      "O2 supply depletion: dropping FiO2 delivery, transport ventilator low O2 alarm, tank gauge approaching zero",
      "Hemodynamic instability: hypotension or hypertension during position changes or vasoactive infusion interruption"
    ],
    medications: [
      { name: "Propofol", dose: "Continue current ICU infusion rate on battery-powered pump", route: "Intravenous", purpose: "Maintain sedation during transport to prevent agitation and accidental self-extubation" },
      { name: "Midazolam", dose: "1-2 mg IV PRN for procedural sedation during transport", route: "Intravenous", purpose: "Bolus anxiolytic for acute agitation during transport when propofol adjustments are insufficient" },
      { name: "Norepinephrine", dose: "Continue current ICU infusion rate on battery-powered pump", route: "Intravenous", purpose: "Maintain hemodynamic support during transport — do not interrupt vasoactive infusions" }
    ],
    pearls: [
      "The pre-transport checklist prevents most adverse events — never rush transport preparation for critically ill patients",
      "E-cylinder O2 duration formula: (PSI × 0.28) / flow rate in L/min = minutes of O2 available — memorize this for the board exam",
      "Pre-oxygenation with 100% FiO2 before ventilator switch provides a safety buffer during the brief disconnection period",
      "ETCO2 is the FIRST indicator of ETT displacement during transport — loss of waveform means the tube is out until proven otherwise",
      "If the transport ventilator cannot match ICU PEEP settings for an ARDS patient, strongly consider postponing non-emergent transport",
      "Abort transport criteria: SpO2 < 85% not responsive to intervention, hemodynamic instability, new arrhythmia, equipment failure"
    ],
    quiz: [
      { question: "An E-cylinder at 1500 PSI is needed for transport of a patient on 10 L/min O2. How many minutes of O2 are available?", options: ["42 minutes", "28 minutes", "150 minutes", "420 minutes"], correct: 0, rationale: "E-cylinder duration = (PSI × cylinder factor) / flow rate. For E-cylinder: factor = 0.28. Duration = (1500 × 0.28) / 10 = 420 / 10 = 42 minutes. With a 3× safety factor, the usable transport time is approximately 14 minutes. If transport is expected to exceed this, bring additional cylinders." },
      { question: "What is the FIRST action when ETCO2 waveform is lost during intrahospital transport?", options: ["Continue transport to the destination for evaluation", "Check ETT position and confirm it has not been displaced", "Increase ventilator FiO2 to 100%", "Switch to manual bag ventilation and increase rate"], correct: 1, rationale: "Loss of ETCO2 waveform during transport most likely indicates ETT displacement (accidental extubation or right mainstem migration). The first action is to confirm ETT position: check depth at teeth, auscultate bilaterally, attempt direct visualization. If displaced, reintubate or bag-mask ventilate immediately." },
      { question: "Before transporting a ventilated ARDS patient on PEEP 16, what is the most critical pre-transport consideration?", options: ["Ensuring the transport gurney has side rails", "Verifying the transport ventilator can deliver PEEP 16 and match ICU settings", "Obtaining a CT order", "Switching to nasal cannula for transport"], correct: 1, rationale: "ARDS patients on high PEEP depend on that pressure to maintain alveolar recruitment. If the transport ventilator cannot deliver adequate PEEP, the patient will experience acute derecruitment, desaturation, and potentially require re-recruitment maneuvers upon return. This is the most critical pre-transport verification step." }
    ]
  },

  "infection-control-respiratory-rrt": {
    title: "Infection Control in Respiratory Care",
    cellular: `Respiratory therapists have unique infection control responsibilities because respiratory equipment and procedures create direct pathways for pathogen transmission. Ventilator-associated pneumonia (VAP), cross-contamination through nebulizers, and aerosolization of respiratory secretions during suctioning and procedures represent significant infection risks that the RT must actively mitigate.

Ventilator-associated pneumonia (VAP) is the most common nosocomial infection in mechanically ventilated patients, occurring in 5-15% of ventilated patients with mortality rates of 20-50%. VAP develops when pathogenic organisms bypass normal airway defenses and colonize the lower respiratory tract. Risk factors include prolonged intubation, aspiration of subglottic secretions pooled above the ETT cuff, gastric bacterial overgrowth (acid suppression medications increase gastric pH allowing bacterial proliferation), supine positioning, poor oral hygiene, and circuit contamination.

The VAP prevention bundle is the standard of care: head of bed elevation 30-45 degrees (reduces gastric reflux and aspiration), daily sedation vacation and spontaneous breathing trial assessment (reduces ventilator duration), DVT prophylaxis, stress ulcer prophylaxis, oral care with chlorhexidine 0.12% every 4-6 hours (reduces oropharyngeal bacterial colonization), and subglottic secretion drainage (specialized ETTs with a suction port above the cuff to remove pooled secretions).

Respiratory equipment decontamination follows Spaulding's classification: critical items (contact sterile tissue — bronchoscopes, ETTs — require sterilization), semicritical items (contact mucous membranes — nebulizers, resuscitation bags, PFT mouthpieces — require high-level disinfection), and noncritical items (contact intact skin — stethoscopes, pulse oximeter probes — require low-level disinfection). Ventilator circuits should be changed only when visibly soiled or malfunctioning — routine circuit changes every 48-72 hours do NOT reduce VAP rates and are no longer recommended.

Standard precautions apply to all patients: hand hygiene, gloves, gown, eye protection based on anticipated exposure. Transmission-based precautions are added based on the organism: contact precautions (MRSA, VRE, C. difficile — gown, gloves), droplet precautions (influenza, pertussis — surgical mask within 3 feet), and airborne precautions (tuberculosis, measles, varicella, COVID-19 — N95 respirator, negative pressure room, HEPA filtration). Aerosol-generating procedures (AGPs) including intubation, extubation, bronchoscopy, suctioning (especially open), nebulizer treatments, HFNC, and NIV require enhanced airborne precautions regardless of the patient's isolation status during respiratory infection outbreaks.`,
    riskFactors: [
      "Prolonged mechanical ventilation (VAP risk increases 1-3% per ventilator day)",
      "Aspiration of subglottic secretions around the ETT cuff — the primary VAP pathogenesis mechanism",
      "Cross-contamination from inadequate hand hygiene between patients — the most important preventable risk",
      "Contaminated respiratory equipment (nebulizers, suction equipment, ventilator circuits)",
      "Acid suppression medications (PPIs, H2 blockers) promoting gastric bacterial overgrowth and aspiration",
      "Supine positioning allowing gastric content reflux toward the oropharynx and airway",
      "Aerosol-generating procedures creating infectious aerosol in rooms without appropriate ventilation",
      "Immunocompromised patients at increased risk for opportunistic respiratory infections (Aspergillus, PJP)"
    ],
    diagnostics: [
      "Clinical Pulmonary Infection Score (CPIS) combining temperature, WBC, tracheal secretions, PaO2/FiO2, chest X-ray for VAP diagnosis",
      "Quantitative tracheal aspirate (≥ 10^6 CFU/mL) or BAL (≥ 10^4 CFU/mL) with Gram stain for VAP pathogen identification",
      "Blood cultures before antibiotic initiation for suspected VAP",
      "Chest X-ray showing new or progressive infiltrate in a ventilated patient with fever and purulent secretions",
      "Procalcitonin trending to guide antibiotic duration in suspected VAP",
      "TB testing: acid-fast bacillus smear and culture, IGRA or tuberculin skin test for latent TB",
      "Fit testing documentation for N95 respirators — annual fit testing required for all RTs"
    ],
    management: [
      "Implement and maintain VAP prevention bundle for ALL mechanically ventilated patients",
      "Perform hand hygiene before and after EVERY patient contact — alcohol-based hand rub or soap and water for C. difficile",
      "Change ventilator circuits only when visibly soiled or malfunctioning — NOT on a routine schedule",
      "Use closed (inline) suctioning to reduce aerosolization and environmental contamination",
      "Don appropriate PPE before entering isolation rooms: contact (gown/gloves), droplet (surgical mask), airborne (N95/PAPR)",
      "Use subglottic suction ETTs for patients expected to be intubated > 48-72 hours",
      "Apply airborne precautions for ALL aerosol-generating procedures during respiratory infection outbreaks",
      "Process all semicritical equipment with high-level disinfection between patients per Spaulding classification"
    ],
    nursingActions: [
      "Verify VAP bundle compliance with every assessment: HOB 30-45, oral care performed, SBT screening, DVT prophylaxis active",
      "Document oral care with chlorhexidine 0.12% every 4-6 hours — ensure visual assessment of oral cavity for fungal infection",
      "Verify ETT cuff pressure 20-30 cmH2O every 8 hours to prevent subglottic secretion aspiration",
      "Suction subglottic port before cuff deflation and before repositioning to prevent aspiration of pooled secretions",
      "Clean and disinfect stethoscope between patients — stethoscope contamination is a documented source of cross-transmission",
      "Verify negative pressure room is functioning before entering an airborne precautions room (smoke tube test or manometer)",
      "Ensure N95 respirator seal check with every donning — glasses fogging indicates inadequate seal",
      "Dispose of single-use nebulizer equipment after each patient — do not rinse and reuse"
    ],
    signs: [
      "VAP: new infiltrate on CXR + 2 of 3: fever > 38°C, WBC > 12,000 or < 4,000, purulent tracheal secretions",
      "Respiratory equipment contamination: foul-smelling nebulizer, visible biofilm in circuits, culture-positive equipment",
      "Inadequate isolation: door open on airborne precautions room, staff entering without N95, positive pressure in room that should be negative",
      "Successful VAP prevention: low unit VAP rate (benchmark < 1 per 1000 ventilator days), short ventilator duration",
      "Emerging respiratory infection: cluster of respiratory illness in unit requiring investigation and enhanced precautions"
    ],
    medications: [
      { name: "Chlorhexidine 0.12% Oral Rinse", dose: "15 mL swish or oral swab application q4-6h", route: "Oral/Topical", purpose: "Reduce oropharyngeal bacterial colonization to prevent aspiration pneumonia in ventilated patients" },
      { name: "Piperacillin/Tazobactam", dose: "4.5 g IV q6h (adjusted for renal function)", route: "Intravenous", purpose: "Broad-spectrum empiric therapy for suspected VAP covering Pseudomonas and common gram-negative pathogens" },
      { name: "Vancomycin", dose: "15-20 mg/kg IV q8-12h (trough-guided dosing)", route: "Intravenous", purpose: "Empiric MRSA coverage for suspected VAP in units with high MRSA prevalence" }
    ],
    pearls: [
      "Hand hygiene is the SINGLE most effective intervention for preventing healthcare-associated infections — compliance rates remain disappointingly low",
      "Ventilator circuit changes should be done only when visibly soiled — routine changes increase handling, increase cost, and do NOT reduce VAP",
      "Subglottic suction ETTs reduce VAP by 45% — use them for all patients expected to be intubated > 48-72 hours",
      "The VAP prevention bundle works as a BUNDLE — implementing individual elements is less effective than consistent compliance with all elements",
      "N95 respirators protect the wearer from airborne particles; surgical masks protect others from the wearer's respiratory droplets — know the difference",
      "Aerosol-generating procedures are the highest risk for respiratory pathogen transmission — maximize PPE for intubation, bronchoscopy, and open suctioning"
    ],
    quiz: [
      { question: "Which component of the VAP prevention bundle most directly addresses the primary mechanism of VAP pathogenesis?", options: ["DVT prophylaxis", "Stress ulcer prophylaxis", "Subglottic secretion drainage", "Daily sedation vacation"], correct: 2, rationale: "The primary mechanism of VAP is aspiration of bacteria-laden secretions that pool above the ETT cuff into the lower airways. Subglottic secretion drainage removes these pooled secretions before they can leak past the cuff, directly targeting the primary pathogenesis mechanism. Studies show 45% VAP reduction with subglottic suction ETTs." },
      { question: "When should ventilator circuits be changed?", options: ["Every 24 hours", "Every 48 hours", "Every 7 days", "Only when visibly soiled or malfunctioning"], correct: 3, rationale: "Current evidence-based guidelines recommend changing ventilator circuits ONLY when visibly soiled or malfunctioning. Multiple studies have shown that routine circuit changes (every 24-72 hours) do NOT reduce VAP rates and actually increase cost, handling, and potential for contamination. This is a frequently tested fact on respiratory therapy board exams." },
      { question: "Which PPE is required for entering the room of a patient with active pulmonary tuberculosis?", options: ["Surgical mask only", "N95 respirator, in a negative pressure room", "Gown and gloves only", "Face shield and surgical mask"], correct: 1, rationale: "Active pulmonary TB requires airborne precautions: N95 respirator (fit-tested) or PAPR for the healthcare worker, and the patient should be in a negative pressure airborne infection isolation room (AIIR). Surgical masks do NOT filter TB-sized particles (1-5 microns). The patient should wear a surgical mask during transport." }
    ]
  },

  "sleep-disordered-breathing-rrt": {
    title: "Sleep-Disordered Breathing",
    cellular: `Sleep-disordered breathing encompasses a spectrum of conditions characterized by abnormal respiratory patterns during sleep, with obstructive sleep apnea (OSA) being the most prevalent. Respiratory therapists are involved in diagnostic sleep studies, PAP therapy initiation and titration, patient education, and long-term compliance management.

Obstructive sleep apnea occurs when the upper airway collapses repeatedly during sleep despite continued respiratory effort. During sleep, pharyngeal dilator muscle tone decreases. In patients with anatomically narrow or collapsible airways (obesity, retrognathia, macroglossia, tonsillar hypertrophy), the loss of muscle tone allows the soft palate and tongue base to obstruct airflow. The resulting apnea (complete cessation of airflow ≥ 10 seconds) or hypopnea (≥ 30% reduction in airflow for ≥ 10 seconds with ≥ 3% desaturation or arousal) causes intermittent hypoxemia, hypercapnia, intrathoracic pressure swings, sympathetic activation, and sleep fragmentation.

The apnea-hypopnea index (AHI) quantifies OSA severity: normal < 5 events/hour, mild 5-14, moderate 15-29, severe ≥ 30. The respiratory disturbance index (RDI) additionally counts respiratory effort-related arousals (RERAs). Polysomnography (PSG) is the gold standard diagnostic test, recording EEG, EOG, EMG, ECG, nasal airflow, respiratory effort (chest/abdominal bands), SpO2, body position, and snoring microphone. Home sleep apnea testing (HSAT) using portable devices is acceptable for diagnosing moderate-to-severe OSA in patients with high pre-test probability and no significant comorbidities.

Central sleep apnea (CSA) results from failure of the brainstem respiratory center to generate adequate respiratory effort during sleep. Cheyne-Stokes respiration (CSR), a specific CSA pattern with crescendo-decrescendo breathing followed by central apneas, is common in congestive heart failure (present in 30-50% of HF patients with EF < 40%). Other CSA causes: opioid-induced central apnea, high-altitude periodic breathing, and idiopathic CSA.

CPAP therapy is first-line for moderate-to-severe OSA. CPAP provides a pneumatic splint that maintains upper airway patency during sleep. CPAP titration during PSG determines optimal pressure (typically 5-20 cmH2O). Auto-titrating CPAP (APAP) adjusts pressure breath-by-breath based on flow limitation detection, eliminating the need for in-lab titration in most patients. APAP is set with a pressure range (typically 5-20 cmH2O) and self-adjusts during the night.

BiPAP is indicated when CPAP is insufficient or poorly tolerated: patients requiring pressures > 15 cmH2O for comfort, obesity hypoventilation syndrome (OHS) requiring ventilatory support (not just upper airway splinting), and central/complex sleep apnea. Adaptive servo-ventilation (ASV) is used for CSA and treatment-emergent central apnea (complex sleep apnea) but is CONTRAINDICATED in heart failure patients with EF ≤ 45% (SERVE-HF trial showed increased cardiovascular mortality).

Compliance is the single greatest challenge in PAP therapy. Defined as ≥ 4 hours of use per night on ≥ 70% of nights, compliance rates are typically only 50-60%. Strategies to improve adherence: proper mask fitting (try multiple interfaces), heated humidification, ramp feature (gradually increases pressure over 5-45 minutes), EPR/flex settings (reduces pressure during expiration for comfort), behavioral interventions (motivational interviewing, cognitive behavioral therapy), and early follow-up within 1-2 weeks of initiation. Telemedicine monitoring via cloud-connected PAP devices allows remote compliance tracking and troubleshooting.`,
    riskFactors: [
      "Obesity (BMI > 30) as the strongest modifiable risk factor for OSA — 70% of OSA patients are obese",
      "Male sex with 2-3× higher OSA prevalence than females (gap narrows post-menopause)",
      "Craniofacial anatomy: retrognathia, micrognathia, macroglossia, enlarged tonsils, high-arched palate",
      "Untreated OSA increasing risk for hypertension, atrial fibrillation, stroke, heart failure, and type 2 diabetes",
      "Daytime hypersomnolence causing motor vehicle accidents — OSA patients have 2-7× higher accident risk",
      "Perioperative risk: OSA patients have increased sensitivity to sedation and analgesia, higher post-operative airway complications",
      "Heart failure with EF < 40% associated with Cheyne-Stokes respiration and central sleep apnea",
      "Opioid use causing central sleep apnea through respiratory center depression"
    ],
    diagnostics: [
      "In-laboratory polysomnography (PSG) — gold standard for diagnosing all types of sleep-disordered breathing",
      "Home sleep apnea testing (HSAT) for high-probability moderate-severe OSA without significant comorbidities",
      "Apnea-hypopnea index (AHI): mild 5-14, moderate 15-29, severe ≥ 30 events/hour",
      "Epworth Sleepiness Scale (ESS) > 10 suggesting excessive daytime sleepiness (subjective screening)",
      "STOP-BANG questionnaire for OSA screening: ≥ 3 positive = high risk (Snoring, Tired, Observed apnea, Pressure, BMI>35, Age>50, Neck>40cm, Gender male)",
      "PAP compliance data review: download data showing AHI on therapy, leak, usage hours, and pressure needs",
      "ABG or capillary blood gas for CO2 assessment in suspected obesity hypoventilation syndrome"
    ],
    management: [
      "CPAP as first-line for moderate-severe OSA: titrate to eliminate apneas, hypopneas, and flow limitation",
      "APAP (auto-titrating CPAP) with range 5-20 cmH2O for most newly diagnosed OSA patients — eliminates need for in-lab titration",
      "BiPAP for patients requiring high pressures > 15 cmH2O, OHS, or CPAP intolerance",
      "ASV for central/complex sleep apnea — CONTRAINDICATED in HF with EF ≤ 45%",
      "Heated humidification for all PAP devices to reduce nasal dryness, congestion, and improve comfort",
      "Optimize mask interface: nasal mask, nasal pillows, oronasal mask, or full-face mask based on patient anatomy and preference",
      "Weight loss of 10-15% can significantly reduce AHI and may cure mild OSA in some patients",
      "Oral appliance therapy (mandibular advancement device) for mild-moderate OSA or CPAP intolerance — custom-fitted by dentist"
    ],
    nursingActions: [
      "Screen all hospitalized patients for OSA risk using STOP-BANG questionnaire — score ≥ 3 = high risk",
      "Ensure patients bring their own PAP device for hospital admission and continue therapy during hospitalization",
      "Educate on proper mask fitting, cleaning, and daily use — demonstrate correct technique at initiation",
      "Review PAP compliance data at every follow-up visit — address barriers to adherence proactively",
      "Assess for mask-related issues: air leak, skin irritation, pressure sores on nasal bridge, dry mouth from leak",
      "Monitor post-operative OSA patients closely: avoid supine positioning, minimize opioids, use PAP post-operatively",
      "Educate on the cardiovascular consequences of untreated OSA to motivate treatment adherence",
      "Schedule follow-up within 1-2 weeks of PAP initiation — early intervention for problems improves long-term compliance"
    ],
    signs: [
      "OSA symptoms: witnessed apneas, loud snoring, gasping/choking from sleep, excessive daytime sleepiness, morning headaches",
      "Physical exam findings: BMI > 30, neck circumference > 40 cm, crowded oropharynx (Mallampati III-IV), retrognathia",
      "Untreated OSA complications: refractory hypertension, atrial fibrillation, nocturnal desaturation, morning headache from CO2 retention",
      "Effective PAP therapy: resolution of snoring and witnessed apneas, improved daytime alertness, AHI < 5 on therapy data",
      "PAP intolerance: claustrophobia, air leak causing dry eyes, aerophagia (air swallowing), pressure intolerance",
      "Central apnea: periodic breathing pattern on PSG without respiratory effort, common in HF patients"
    ],
    medications: [
      { name: "Modafinil", dose: "200 mg PO daily", route: "Oral", purpose: "Wakefulness-promoting agent for residual excessive daytime sleepiness despite adequate PAP therapy" },
      { name: "Acetazolamide", dose: "250 mg PO BID-TID", route: "Oral", purpose: "Carbonic anhydrase inhibitor for central sleep apnea and high-altitude periodic breathing — stimulates ventilation" },
      { name: "Solriamfetol", dose: "75-150 mg PO daily", route: "Oral", purpose: "Dopamine/norepinephrine reuptake inhibitor for residual excessive daytime sleepiness in OSA on adequate PAP" }
    ],
    pearls: [
      "CPAP compliance is defined as ≥ 4 hours per night on ≥ 70% of nights — this is the minimum for insurance coverage and clinical benefit",
      "ASV is CONTRAINDICATED in heart failure with EF ≤ 45% — the SERVE-HF trial showed increased cardiovascular mortality",
      "STOP-BANG ≥ 3 = high OSA risk — screen ALL surgical patients preoperatively to prevent post-operative respiratory complications",
      "Weight loss of 10-15% can reduce AHI by 50% or more — it is the only treatment that addresses the root cause in obese OSA patients",
      "Heated humidification reduces the most common PAP side effects (nasal dryness, congestion) and improves compliance",
      "Review PAP data at EVERY visit — cloud-connected devices allow remote monitoring to identify compliance problems before they become habitual"
    ],
    quiz: [
      { question: "A patient has AHI of 42 events/hour on polysomnography. What is the severity classification and first-line treatment?", options: ["Moderate OSA — oral appliance therapy", "Severe OSA — CPAP therapy", "Mild OSA — positional therapy", "Severe OSA — surgical correction"], correct: 1, rationale: "AHI ≥ 30 = severe OSA. CPAP is the first-line therapy for moderate-to-severe OSA. It provides a pneumatic splint to maintain upper airway patency during sleep. CPAP has level I evidence for improving symptoms, reducing cardiovascular risk, and improving quality of life in severe OSA." },
      { question: "Which PAP device is CONTRAINDICATED in heart failure patients with ejection fraction ≤ 45%?", options: ["CPAP", "BiPAP", "Adaptive servo-ventilation (ASV)", "APAP"], correct: 2, rationale: "The SERVE-HF trial demonstrated that ASV increased cardiovascular mortality in heart failure patients with EF ≤ 45% and predominant central sleep apnea. ASV is absolutely contraindicated in this population. CPAP remains safe for treating concurrent OSA in these patients." },
      { question: "What defines adequate CPAP compliance for insurance purposes?", options: ["8 hours per night every night", "≥ 4 hours per night on ≥ 70% of nights", "Any use on most nights", "6 hours per night on 50% of nights"], correct: 1, rationale: "Medicare and most insurance define compliance as ≥ 4 hours of PAP use per night on ≥ 70% of nights (approximately 21 out of 30 consecutive nights). This threshold is also associated with meaningful clinical benefit. Compliance data is monitored via device download or cloud-based systems." }
    ]
  },

  "critical-care-monitoring-rrt": {
    title: "Critical Care Monitoring",
    cellular: `Respiratory therapists in critical care must integrate data from multiple monitoring systems to guide ventilator management, detect deterioration, and participate in multidisciplinary clinical decision-making. Advanced monitoring beyond basic vital signs includes waveform analysis, respiratory mechanics measurement, tissue oxygenation assessment, and trending of integrated physiological parameters.

End-tidal CO2 (ETCO2) monitoring via capnography provides real-time ventilation assessment. The normal ETCO2 is 35-45 mmHg, typically 2-5 mmHg lower than PaCO2 due to dead space dilution. The PaCO2-ETCO2 gradient (normally 2-5 mmHg) widens with increased dead space (PE, low cardiac output, overdistention) and narrows with decreased dead space. Capnography waveform morphology provides diagnostic information: the normal waveform shows a rectangular shape with a flat alveolar plateau (phase III). A rising alveolar plateau (shark fin pattern) suggests obstructive disease (asthma, COPD, bronchospasm) with uneven alveolar emptying. Absence of waveform indicates esophageal intubation, cardiac arrest, or total airway obstruction.

Respiratory mechanics monitoring includes compliance (static and dynamic), resistance, work of breathing, and auto-PEEP measurement. Static compliance (Cst = VT / (Pplat - total PEEP)) reflects lung and chest wall elastic properties (normal 50-100 mL/cmH2O). Dynamic compliance (Cdyn = VT / (PIP - total PEEP)) includes resistive forces. The ratio Cdyn/Cst indicates resistive vs elastic abnormalities: when Cdyn drops but Cst is unchanged, the problem is resistance (secretions, bronchospasm).

Transpulmonary pressure monitoring uses an esophageal balloon to estimate pleural pressure. Transpulmonary pressure = airway pressure - pleural pressure. This allows differentiation between lung and chest wall contributions to respiratory mechanics, which is particularly important in obese patients and those with abdominal compartment syndrome where high airway pressures may not translate to high lung-distending pressures. Esophageal pressure-guided PEEP titration (EPVent-2 trial) targets positive transpulmonary pressure at end-expiration, potentially improving outcomes in ARDS.

Stress index analysis examines the pressure-time curve during constant-flow volume-controlled ventilation. A stress index < 1 (concave-up pressure curve) suggests tidal recruitment (alveoli are still opening during inspiration — PEEP may be insufficient). A stress index > 1 (concave-down curve) suggests overdistention (alveoli are being overinflated — PEEP or VT should be reduced). A stress index of 1 (linear pressure rise) suggests appropriate settings.

Volumetric capnography integrates CO2 concentration with expired volume, providing a comprehensive assessment of ventilation. It quantifies dead space (both anatomic and alveolar), measures CO2 elimination (VCO2), and provides the volumetric capnography-derived dead space fraction (VD/VT) as a prognostic indicator in ARDS.

Electrical impedance tomography (EIT) is an emerging bedside imaging modality that measures regional ventilation distribution in real-time by detecting impedance changes across the chest. EIT can guide PEEP titration by visualizing regional recruitment and overdistention, optimize ventilator settings to achieve homogeneous ventilation distribution, and detect pneumothorax or atelectasis without radiation exposure.`,
    riskFactors: [
      "Alarm fatigue from excessive non-actionable alarms leading to delayed response to critical events",
      "Misinterpretation of monitoring data without clinical correlation leading to inappropriate interventions",
      "Equipment malfunction or calibration drift producing inaccurate readings",
      "Over-monitoring creating information overload and distraction from bedside clinical assessment",
      "Esophageal balloon displacement or malfunction providing unreliable transpulmonary pressure data",
      "Artifact in waveform analysis from patient movement, coughing, or circuit leak",
      "Failure to trend data over time — single-point measurements are less meaningful than trends"
    ],
    diagnostics: [
      "Continuous waveform capnography for ventilation monitoring, ETT confirmation, and dead space assessment",
      "Respiratory mechanics: Pplat (inspiratory hold), auto-PEEP (expiratory hold), static compliance, resistance",
      "Stress index analysis from pressure-time waveform during constant-flow VCV",
      "Transpulmonary pressure via esophageal manometry for PEEP optimization in complex cases",
      "Volumetric capnography for VD/VT measurement and CO2 elimination monitoring",
      "P0.1 (airway occlusion pressure at 100 ms) for respiratory drive assessment (normal 1-4 cmH2O)",
      "Diaphragm electrical activity (Edi) monitoring via NAVA catheter for neural drive assessment",
      "EIT for regional ventilation distribution and real-time recruitment/overdistention assessment"
    ],
    management: [
      "Integrate multiple monitoring parameters for clinical decision-making — no single value should drive therapy changes alone",
      "Titrate PEEP using compliance-guided approach, stress index, transpulmonary pressure, or EIT — not empiric tables alone",
      "Use capnography waveform morphology to guide bronchodilator therapy and assess treatment response",
      "Monitor PaCO2-ETCO2 gradient trends as a surrogate for dead space changes without repeated ABG draws",
      "Set appropriate alarm limits based on patient-specific parameters — too narrow = alarm fatigue, too wide = missed events",
      "Assess respiratory mechanics at minimum every 4 hours and with any clinical change or ventilator adjustment",
      "Use trending dashboards when available to visualize parameter trajectories over hours to days",
      "Document monitoring interpretation and clinical correlation in respiratory therapy progress notes"
    ],
    nursingActions: [
      "Verify capnography waveform is present and of normal morphology at start of every shift and after any ETT manipulation",
      "Measure and document Pplat, auto-PEEP, static compliance, and driving pressure every 4 hours minimum",
      "Assess capnography waveform shape: normal rectangular, shark fin (obstruction), absent (displacement/arrest)",
      "Monitor PaCO2-ETCO2 gradient with each ABG — widening gap indicates increasing dead space",
      "Ensure proper esophageal balloon position for transpulmonary pressure monitoring (cardiac oscillation test, Baydur test)",
      "Adjust ventilator alarm limits appropriately for each patient — high and low limits for VT, PIP, RR, ETCO2, and SpO2",
      "Recognize and troubleshoot monitoring artifacts: motion artifact, leak affecting waveforms, calibration drift",
      "Communicate significant monitoring trends to the medical team proactively — don't wait for crisis-level values"
    ],
    signs: [
      "Normal ventilation: rectangular capnography waveform with flat phase III plateau, PaCO2-ETCO2 gap 2-5 mmHg",
      "Bronchospasm: shark fin capnography waveform with rising phase III — treat with bronchodilator and reassess waveform",
      "Increasing dead space: widening PaCO2-ETCO2 gap without change in ventilator settings — investigate for PE, overdistention, or low CO",
      "Alveolar recruitment during inspiration: stress index < 1 (concave-up pressure curve) — may need more PEEP",
      "Alveolar overdistention: stress index > 1 (concave-down pressure curve) — reduce PEEP or VT",
      "Optimal PEEP: stress index = 1 (linear pressure rise) or best static compliance at given PEEP level"
    ],
    medications: [
      { name: "Albuterol (bronchospasm response)", dose: "2.5-5 mg nebulized or 4-8 puffs MDI", route: "Inhaled", purpose: "Treat bronchospasm identified by shark fin capnography waveform — reassess waveform morphology post-treatment" },
      { name: "Heparin (PE-related dead space)", dose: "80 units/kg IV bolus then 18 units/kg/hr", route: "Intravenous", purpose: "Anticoagulation for pulmonary embolism identified by acute widening of PaCO2-ETCO2 gradient" }
    ],
    pearls: [
      "The capnography waveform shape tells you MORE than the ETCO2 number — learn to read waveform morphology",
      "PaCO2-ETCO2 gradient widening is an early indicator of PE, low cardiac output, or overdistention — trend it with every ABG",
      "Stress index analysis (pressure-time curve shape) provides real-time assessment of tidal recruitment vs overdistention without additional equipment",
      "Alarm fatigue kills patients — set patient-appropriate alarm limits and reduce non-actionable alarms",
      "Static compliance is the most useful single respiratory mechanics parameter — trend it to track lung status and guide PEEP titration",
      "Diaphragm ultrasound is emerging as a non-invasive alternative to Edi monitoring for assessing diaphragm function and effort"
    ],
    quiz: [
      { question: "A ventilated patient's capnography waveform shows a rising (sloped) alveolar plateau instead of a flat phase III. What does this indicate?", options: ["Normal ventilation", "Obstructive airways disease (bronchospasm or COPD)", "Esophageal intubation", "Hyperventilation"], correct: 1, rationale: "A rising (sloped) phase III plateau on capnography (shark fin pattern) indicates uneven alveolar emptying, characteristic of obstructive airways disease. Different lung units with different time constants empty sequentially, causing progressive CO2 concentration increase throughout expiration rather than a flat plateau." },
      { question: "The PaCO2 is 45 mmHg and ETCO2 is 28 mmHg. What does this 17 mmHg gradient suggest?", options: ["Normal finding", "Significant dead space ventilation", "Hyperventilation", "Equipment malfunction"], correct: 1, rationale: "A PaCO2-ETCO2 gradient of 17 mmHg (normal is 2-5 mmHg) indicates significant dead space. Dead space gas containing no CO2 dilutes the exhaled CO2 concentration measured at the airway, lowering ETCO2 while arterial CO2 remains elevated. Common causes: pulmonary embolism, alveolar overdistention from excessive PEEP, and low cardiac output states." },
      { question: "During constant-flow volume-controlled ventilation, the pressure-time curve shows a concave-up (stress index < 1) pattern. What does this suggest?", options: ["Alveolar overdistention — reduce PEEP", "Optimal ventilation — no changes needed", "Tidal recruitment — consider increasing PEEP", "Airway resistance increase — suction and bronchodilator"], correct: 2, rationale: "Stress index < 1 (concave-up pressure curve) indicates that compliance is improving during inspiration as previously collapsed alveoli are being recruited by the tidal breath. This suggests PEEP may be insufficient to maintain these alveoli open at end-expiration, and increasing PEEP may improve recruitment and gas exchange." }
    ]
  },

  "tracheostomy-care-rrt": {
    title: "Tracheostomy Care",
    cellular: `Tracheostomy management is a core respiratory therapy competency spanning indications for placement, immediate post-operative care, routine maintenance, decannulation assessment, and emergency management. RTs are often the primary clinicians managing tracheostomy patients across acute care, long-term care, and home settings.

Indications for tracheostomy include prolonged mechanical ventilation (typically considered at 10-14 days if extubation is not anticipated soon), upper airway obstruction not amenable to other interventions (tumor, severe edema, bilateral vocal cord paralysis), facilitation of pulmonary hygiene in patients with chronic secretion retention, and airway protection in patients with chronic aspiration. Early tracheostomy (within 7 days) vs late tracheostomy remains debated — some studies suggest early tracheostomy reduces sedation requirements and facilitates earlier mobilization, but evidence for mortality benefit is inconsistent.

Tracheostomy tube anatomy includes the outer cannula (remains in place, maintains the stoma), inner cannula (removable for cleaning, prevents obstruction from secretion buildup), obturator (used only during insertion to guide placement, removed immediately after), cuff (inflatable balloon preventing air leak and aspiration), pilot balloon (external indicator of cuff inflation status), 15 mm adapter (standard connector to ventilator circuit or speaking valve), and flange (secures the tube at the neck with ties or velcro holder).

Immediate post-tracheostomy care (first 72 hours) requires heightened vigilance because the stoma tract is not yet mature. If accidental decannulation occurs in the first 72 hours, the tract may close rapidly, making reinsertion difficult or impossible. A stay suture may be placed by the surgeon to facilitate emergency reinsertion. The first tracheostomy tube change should not occur until 5-7 days post-insertion to allow tract maturation, unless clinically necessary. Keep the original tube, obturator, and a tube one size smaller at the bedside at all times.

Routine tracheostomy care includes inner cannula removal and cleaning (or replacement if disposable) every 4-8 hours, stoma site care (clean with half-strength hydrogen peroxide, rinse with saline, apply split gauze dressing), tracheostomy tie/holder assessment (one finger width between tie and neck — not too tight causing skin breakdown, not too loose allowing tube displacement), and cuff pressure monitoring (20-30 cmH2O if cuffed tube is in use).

Speaking valve (Passy-Muir valve, PMV) is a one-way valve that allows air to enter through the tracheostomy during inspiration but closes during expiration, redirecting airflow upward through the vocal cords, enabling phonation, improved swallowing, and enhanced secretion management. Prerequisites for speaking valve: cuff MUST be fully deflated (air must be able to pass around the tube and through the upper airway), patient must be alert and able to tolerate airflow redirection, upper airway must be patent (no complete obstruction above the tracheostomy). Speaking valve use with a fully inflated cuff causes inability to exhale and is a life-threatening emergency.

Decannulation assessment follows a systematic approach: the patient must demonstrate ability to protect the airway (adequate cough, minimal secretions, no aspiration), tolerate cuff deflation without distress, tolerate capping trial (occlude the tracheostomy with a cap — patient breathes entirely through the upper airway) for 24-48 hours with stable SpO2 and respiratory rate, and have a patent upper airway (confirmed by downsizing or fiberoptic examination).`,
    riskFactors: [
      "Accidental decannulation in the first 72 hours when the tract is immature — may result in loss of airway",
      "Tracheal stenosis from cuff over-inflation (pressure > 30 cmH2O) causing mucosal ischemia and fibrosis",
      "Tracheo-innominate artery fistula — rare but catastrophic hemorrhage from erosion into the innominate artery",
      "Mucus plugging of the tracheostomy tube causing acute obstruction — prevented by inner cannula care and humidification",
      "Aspiration around or through the tracheostomy despite cuff inflation (micro-aspiration is common)",
      "Stomal infection or granulation tissue formation at the tracheostomy site",
      "Tube displacement into a false tract (pre-tracheal soft tissue) during reinsertion attempts",
      "Tracheomalacia from prolonged cuff pressure or large tracheostomy tube causing tracheal wall weakening"
    ],
    diagnostics: [
      "Cuff pressure measurement every 8 hours using manometer (target 20-30 cmH2O)",
      "Inner cannula patency assessment every 4-8 hours (visual inspection for secretion buildup)",
      "Fiberoptic examination of upper airway patency before capping trial or decannulation",
      "Capping trial: 24-48 hours of tracheostomy occlusion with continuous SpO2 monitoring and RR assessment",
      "Swallowing evaluation (bedside or FEES/modified barium swallow) before cuff deflation in patients at aspiration risk",
      "Chest X-ray to verify tracheostomy tube position if displacement is suspected",
      "Stoma site assessment for signs of infection: erythema, purulent drainage, cellulitis, granulation tissue"
    ],
    management: [
      "First tube change at 5-7 days post-insertion to allow tract maturation — performed by experienced clinician",
      "Keep spare tracheostomy tube (same size AND one size smaller), obturator, and manual resuscitation bag at bedside at ALL times",
      "Clean inner cannula every 4-8 hours or replace with disposable inner cannula per institutional protocol",
      "Maintain cuff pressure 20-30 cmH2O — check every 8 hours with manometer",
      "Provide adequate humidification via trach collar, HME, or heated humidifier to prevent secretion drying and mucus plugging",
      "Deflate cuff completely before placing speaking valve — NEVER use speaking valve with inflated cuff",
      "Progress toward decannulation: downsize tube → cuff deflation → speaking valve → capping trial → decannulation",
      "In emergency decannulation: if < 72 hours and cannot reinsert, cover stoma and bag-mask ventilate via face; if > 72 hours, reinsert through mature tract"
    ],
    nursingActions: [
      "Keep emergency equipment at bedside: spare tracheostomy tube, one size smaller tube, obturator, resuscitation bag, suction",
      "Perform tracheostomy care every 4-8 hours: clean inner cannula, clean stoma, change dressing, assess ties/holder",
      "Monitor cuff pressure with manometer every 8 hours and after any patient repositioning (target 20-30 cmH2O)",
      "Provide humidification at ALL times for tracheostomy patients to prevent drying of secretions and mucus plugging",
      "Suction tracheostomy PRN based on clinical assessment — audible secretions, increased PIP, visible secretions, desaturation",
      "Verify cuff is COMPLETELY deflated before applying speaking valve — confirm with pilot balloon assessment",
      "Assess stoma site every shift for signs of infection, granulation tissue, or skin breakdown from ties",
      "Educate patient and family on tracheostomy care, emergency management, and communication strategies before discharge"
    ],
    signs: [
      "Mucus plug: sudden inability to pass suction catheter, acute respiratory distress, inability to ventilate through tube",
      "Tube displacement: loss of airflow through tube, subcutaneous emphysema around stoma, inability to ventilate, SpO2 decline",
      "Tracheo-innominate fistula: massive hemorrhage from tracheostomy site (sentinel bleed precedes massive hemorrhage) — life-threatening emergency",
      "Tracheal stenosis: progressive dyspnea, stridor, difficulty passing suction catheter after decannulation",
      "Successful capping trial: tolerates 24-48 hours with tracheostomy capped, stable SpO2, comfortable RR, effective cough",
      "Speaking valve tolerance: phonation restored, improved swallowing function, no respiratory distress with cuff deflated"
    ],
    medications: [
      { name: "Normal Saline Instillation (controversial)", dose: "3-5 mL instilled before suctioning", route: "Intratracheal", purpose: "Historical practice to loosen secretions — current evidence does NOT support routine instillation due to infection risk and desaturation" },
      { name: "Mupirocin (Bactroban)", dose: "Apply to stoma site BID", route: "Topical", purpose: "Treat stomal MRSA colonization or superficial stomal infection" },
      { name: "Silver Nitrate", dose: "Application to granulation tissue by trained clinician", route: "Topical", purpose: "Chemical cautery of excess granulation tissue at tracheostomy stoma" }
    ],
    pearls: [
      "NEVER place a speaking valve with an inflated cuff — the patient cannot exhale and will suffocate. This is the #1 speaking valve safety rule",
      "First 72 hours post-tracheostomy: do NOT attempt reinsertion if accidental decannulation occurs without experienced help — the tract is immature and false passage is likely. Bag-mask via face instead",
      "Saline instillation before suctioning is NOT evidence-based — it may dislodge bacterial biofilm deeper into the airway and cause desaturation",
      "Cuff pressure > 30 cmH2O causes tracheal mucosal ischemia — always use a manometer, never estimate by palpation",
      "Inner cannula care is the single most important intervention preventing mucus plugging — clean or replace every 4-8 hours",
      "Decannulation assessment requires patent upper airway, effective cough, manageable secretions, and successful 24-48 hour capping trial"
    ],
    quiz: [
      { question: "A nurse is about to place a Passy-Muir speaking valve on a tracheostomy patient. What MUST be done first?", options: ["Inflate the cuff to prevent air leak", "Deflate the cuff completely", "Suction the patient", "Place the patient in high Fowler's position"], correct: 1, rationale: "The cuff MUST be completely deflated before placing a speaking valve. The speaking valve allows air in during inspiration but closes during expiration, redirecting airflow through the vocal cords and upper airway. If the cuff is inflated, exhaled air cannot pass around the tube and through the upper airway — the patient cannot exhale, causing suffocation." },
      { question: "A tracheostomy patient (day 1 post-insertion) accidentally pulls out the tube. What is the immediate action?", options: ["Attempt to reinsert the tracheostomy tube through the stoma", "Cover the stoma with gauze and ventilate via face mask", "Call a code blue and start CPR", "Insert an endotracheal tube through the stoma"], correct: 1, rationale: "In the first 72 hours post-tracheostomy, the tract is immature and attempting reinsertion risks creating a false passage into pre-tracheal tissue. The safest immediate action is to cover the stoma with occlusive dressing and ventilate the patient via bag-mask through the face/mouth. Call for experienced help (surgery, anesthesia) for definitive airway management." },
      { question: "What cuff pressure range should be maintained for a tracheostomy tube?", options: ["5-10 cmH2O", "10-15 cmH2O", "20-30 cmH2O", "35-40 cmH2O"], correct: 2, rationale: "Cuff pressure should be maintained at 20-30 cmH2O. Below 20 cmH2O allows air leak and aspiration of secretions around the cuff. Above 30 cmH2O exceeds tracheal mucosal capillary perfusion pressure (~25-30 cmH2O), causing ischemia that leads to tracheal stenosis, tracheomalacia, and tracheo-innominate fistula." }
    ]
  },

  "respiratory-pharmacology-rrt": {
    title: "Respiratory Pharmacology",
    cellular: `Respiratory pharmacology encompasses the medications used to treat airway diseases, with bronchodilators, corticosteroids, mucolytics, and antimicrobials constituting the core drug classes. Respiratory therapists must understand mechanism of action, dosing, delivery methods, side effects, contraindications, and clinical application for each drug class.

Beta-2 adrenergic agonists are the most commonly used bronchodilators. Short-acting beta-2 agonists (SABAs) include albuterol (salbutamol) and levalbuterol. Mechanism: stimulate beta-2 receptors on airway smooth muscle, activating adenylyl cyclase → increased cAMP → smooth muscle relaxation → bronchodilation. Onset of action 5-15 minutes, duration 4-6 hours. Side effects: tremor (beta-2 receptor stimulation in skeletal muscle), tachycardia (beta-1 cross-reactivity and reflex tachycardia), hypokalemia (beta-2 mediated intracellular potassium shift), and hyperglycemia. Levalbuterol is the R-isomer of albuterol with purportedly fewer cardiac side effects, though clinical significance is debated. Long-acting beta-2 agonists (LABAs): salmeterol (onset 30-60 min, duration 12 hours), formoterol (onset 5-15 min, duration 12 hours), indacaterol (onset 5 min, duration 24 hours). LABAs should NEVER be used as monotherapy in asthma without ICS — FDA black box warning for increased risk of severe exacerbation and asthma-related death.

Anticholinergic bronchodilators block muscarinic M3 receptors on airway smooth muscle, preventing acetylcholine-mediated bronchoconstriction. Short-acting muscarinic antagonists (SAMAs): ipratropium bromide (onset 15-30 min, duration 4-6 hours). Long-acting muscarinic antagonists (LAMAs): tiotropium (duration 24 hours), umeclidinium, glycopyrrolate. Anticholinergics are particularly effective in COPD where cholinergic tone is the primary reversible component of airway obstruction. Side effects: dry mouth (most common), urinary retention, constipation, increased intraocular pressure (contraindicated in narrow-angle glaucoma — the nebulized drug can contact the eye via mask leak).

Corticosteroids are the most potent anti-inflammatory medications for airway disease. Inhaled corticosteroids (ICS): beclomethasone, budesonide, fluticasone, mometasone, ciclesonide. Mechanism: bind intracellular glucocorticoid receptors → suppress inflammatory gene transcription → reduce eosinophilic inflammation, mucus hypersecretion, and airway hyperresponsiveness. ICS are the cornerstone of persistent asthma management and are added to LAMA/LABA in COPD patients with frequent exacerbations and eosinophils > 300. Local side effects: oral candidiasis, dysphonia (prevented by mouth rinsing and spacer use). Systemic corticosteroids (prednisone, methylprednisolone, dexamethasone) are used for acute exacerbations of asthma and COPD.

Mucoactive agents include mucolytics (break chemical bonds in mucus) and expectorants (increase mucus hydration or volume). N-acetylcysteine (NAC/Mucomyst): breaks disulfide bonds in mucus glycoproteins — can cause bronchospasm (pretreat with bronchodilator). Dornase alfa (Pulmozyme): recombinant DNase that cleaves extracellular DNA in purulent secretions — ONLY effective in cystic fibrosis. Hypertonic saline (3-7%): osmotic agent drawing water into airway lumen to hydrate mucus — effective in CF and bronchiectasis.

Methylxanthines (theophylline, aminophylline) are phosphodiesterase inhibitors causing bronchodilation, respiratory stimulation, and anti-inflammatory effects. Narrow therapeutic index (10-20 mcg/mL) with toxicity causing seizures and arrhythmias. Used only as a last-line therapy due to significant drug interactions and toxicity risk.

Leukotriene modifiers (montelukast, zafirlukast) block leukotriene receptors, reducing inflammation, bronchoconstriction, and mucus production. Used as add-on therapy in asthma (Step 2 alternative to ICS) and in exercise-induced bronchospasm and aspirin-sensitive asthma. Generally well-tolerated but FDA warning for neuropsychiatric side effects (behavioral changes, depression, suicidality).`,
    riskFactors: [
      "Beta-2 agonist overuse masking worsening airway inflammation — patients increase SABA use instead of seeking medical attention",
      "LABA monotherapy in asthma WITHOUT ICS — FDA black box warning for increased severe exacerbation and death risk",
      "ICS-related oral candidiasis from inadequate mouth rinsing — affects 5-10% of ICS users",
      "Anticholinergic side effects: urinary retention in elderly men with BPH, acute angle-closure glaucoma from nebulizer mask leak to eyes",
      "Theophylline toxicity (seizures, arrhythmias) from narrow therapeutic window and drug interactions (erythromycin, ciprofloxacin, cimetidine increase levels)",
      "Systemic corticosteroid complications with frequent/prolonged use: hyperglycemia, osteoporosis, adrenal suppression, immunosuppression",
      "NAC-induced bronchospasm in hyperreactive airways — always pretreat with bronchodilator",
      "Hypokalemia from frequent beta-2 agonist use — monitor potassium in patients on continuous albuterol"
    ],
    diagnostics: [
      "Peak flow and FEV1 measurement before and after bronchodilator to assess response",
      "Theophylline serum level monitoring (therapeutic 10-20 mcg/mL, toxic > 20)",
      "Serum potassium monitoring during continuous albuterol therapy (beta-2 shifts K+ intracellularly)",
      "Blood glucose monitoring in patients on systemic corticosteroids (steroid-induced hyperglycemia)",
      "Eosinophil count to guide ICS addition in COPD (ICS added when eosinophils > 300 cells/mcL)",
      "FeNO measurement (> 50 ppb suggests eosinophilic inflammation responsive to ICS)",
      "Oral cavity inspection for candidiasis in patients on ICS (white patches on buccal mucosa/tongue)",
      "Bone density screening in patients on chronic systemic corticosteroids"
    ],
    management: [
      "SABA PRN as rescue for all obstructive airway diseases — if using > 2 days/week, step up controller therapy",
      "ICS as first-line controller for persistent asthma — always combine with LABA if adding LABA (never LABA alone in asthma)",
      "LAMA (tiotropium) as first-line maintenance bronchodilator for COPD — reduces exacerbations and improves FEV1",
      "Combine SABA + SAMA (albuterol + ipratropium) for acute COPD and severe asthma exacerbations — additive bronchodilation",
      "Systemic corticosteroids for acute exacerbations: prednisone 40 mg × 5 days for COPD, methylprednisolone 125 mg IV then prednisone taper for severe asthma",
      "Pretreat with albuterol before administering NAC or hypertonic saline to prevent bronchospasm",
      "Mouth rinsing after every ICS use — spit out rinse water, do not swallow (reduces systemic absorption)",
      "Monitor theophylline levels closely — multiple drug interactions alter metabolism (CYP1A2 substrate)"
    ],
    nursingActions: [
      "Assess and correct inhaler technique at every patient encounter — incorrect technique is the leading cause of apparent drug failure",
      "Educate patients on the difference between rescue (SABA — for symptoms) and controller (ICS — daily) medications",
      "Monitor heart rate and rhythm during bronchodilator therapy — hold and notify if HR > 120-140 or new arrhythmia",
      "Instruct patients to rinse mouth and spit after every ICS use — demonstrate at time of prescription",
      "Monitor serum potassium in patients receiving continuous or frequent albuterol — replace K+ proactively",
      "Screen for oral candidiasis in ICS users — examine oral cavity at each visit",
      "Verify correct spacer technique with MDI — shake, actuate into spacer, slow deep breath in, hold 10 seconds",
      "Document medication administered, device used, pre/post assessment findings, and patient response"
    ],
    signs: [
      "Effective bronchodilator response: improved air entry, reduced wheezing, decreased RR, improved peak flow/FEV1",
      "Beta-2 agonist toxicity: tachycardia > 120, tremor, palpitations, hypokalemia on labs",
      "Anticholinergic toxicity: dry mouth, urinary retention, blurred vision, tachycardia",
      "ICS local effects: white patches (candidiasis), hoarseness (dysphonia), sore throat",
      "Theophylline toxicity: nausea, vomiting, tachycardia progressing to seizures and arrhythmias at toxic levels",
      "Steroid-induced hyperglycemia: elevated blood glucose requiring insulin adjustment in diabetic patients"
    ],
    medications: [
      { name: "Albuterol (Salbutamol)", dose: "2.5-5 mg nebulized or 2-4 puffs MDI q4-6h PRN", route: "Inhaled", purpose: "SABA for acute bronchospasm relief — first-line rescue medication for asthma and COPD" },
      { name: "Tiotropium (Spiriva)", dose: "18 mcg DPI daily or 2.5 mcg soft mist daily", route: "Inhaled", purpose: "LAMA for COPD maintenance — once-daily dosing, reduces exacerbations, improves FEV1" },
      { name: "Fluticasone/Salmeterol (Advair)", dose: "100/50 to 500/50 mcg DPI BID", route: "Inhaled", purpose: "ICS/LABA combination for persistent asthma and COPD with frequent exacerbations" },
      { name: "Montelukast (Singulair)", dose: "10 mg PO daily (adults), 4-5 mg for children", route: "Oral", purpose: "Leukotriene receptor antagonist for asthma add-on therapy and exercise-induced bronchospasm" }
    ],
    pearls: [
      "LABA monotherapy in asthma (without ICS) carries FDA black box warning for increased severe exacerbation and death — ALWAYS pair LABA with ICS",
      "Ipratropium nebulized via mask can cause acute angle-closure glaucoma if the mist contacts the eye — use mouthpiece or protect eyes",
      "Dornase alfa (Pulmozyme) works ONLY in cystic fibrosis — it has NO benefit in non-CF bronchiectasis, COPD, or other conditions",
      "Theophylline therapeutic window is 10-20 mcg/mL; toxicity causes seizures and arrhythmias — multiple drug interactions alter levels",
      "SABA overuse (> 2 canisters/year or using > 2 days/week) indicates uncontrolled asthma needing step-up of controller therapy",
      "ICS in COPD is added ONLY when eosinophils > 300 or frequent exacerbations despite LABA/LAMA — not all COPD patients need ICS"
    ],
    quiz: [
      { question: "A patient with asthma is prescribed salmeterol (LABA) as monotherapy without an ICS. What is the concern?", options: ["LABA monotherapy is standard first-line for asthma", "LABA monotherapy carries FDA black box warning for increased asthma death risk", "LABA is ineffective without ICS", "LABA causes significant immunosuppression"], correct: 1, rationale: "LABA monotherapy in asthma (without concurrent ICS) carries an FDA black box warning because it may mask underlying inflammation while providing symptomatic bronchodilation, leading to increased risk of severe exacerbations and asthma-related death. LABA must ALWAYS be combined with ICS in asthma treatment." },
      { question: "Which mucolytic agent is effective ONLY in cystic fibrosis and should NOT be used in non-CF bronchiectasis?", options: ["N-acetylcysteine (Mucomyst)", "Hypertonic saline", "Dornase alfa (Pulmozyme)", "Guaifenesin"], correct: 2, rationale: "Dornase alfa (Pulmozyme) is a recombinant DNase that cleaves extracellular DNA from neutrophil debris in CF sputum. This mechanism is specific to CF, where thick, DNA-laden purulent secretions are characteristic. Studies in non-CF bronchiectasis showed no benefit and potential harm, making it contraindicated outside of CF." },
      { question: "A patient on ipratropium nebulizer via face mask develops acute eye pain and blurred vision. What likely occurred?", options: ["Allergic reaction to ipratropium", "Beta-2 receptor stimulation in the eye", "Anticholinergic-induced acute angle-closure glaucoma from nebulizer mist contacting the eye", "Normal transient side effect"], correct: 2, rationale: "Ipratropium nebulized via face mask can cause acute angle-closure glaucoma when the anticholinergic mist contacts the eye, causing mydriasis (pupil dilation) that blocks aqueous humor drainage. This is a medical emergency. Prevention: use mouthpiece instead of mask, or protect eyes with shield when using mask delivery." }
    ]
  },

  "capnography-co2-monitoring-rrt": {
    title: "Capnography and CO2 Monitoring",
    cellular: `Capnography provides continuous, non-invasive monitoring of carbon dioxide concentration in exhaled gas, offering real-time assessment of ventilation, perfusion, and metabolism. For respiratory therapists, capnography is second only to pulse oximetry as a monitoring tool and provides information that oximetry cannot — specifically about ventilation adequacy and airway integrity.

The capnogram waveform has four distinct phases. Phase I (inspiratory baseline): CO2 concentration is zero as inspired gas (containing no CO2) is measured. Phase II (expiratory upstroke): rapid rise in CO2 as dead space gas mixes with alveolar gas — the steepness depends on V/Q heterogeneity. Phase III (alveolar plateau): the plateau represents gas from alveoli — the end of this phase is the ETCO2 value. A flat plateau indicates uniform alveolar emptying; a rising (sloped) plateau indicates uneven emptying from obstructive disease. Phase IV (inspiratory downstroke): rapid drop to zero as fresh inspiratory gas is measured.

ETCO2 reflects PaCO2 minus the contribution of dead space. Normal ETCO2 is 35-45 mmHg, typically 2-5 mmHg below PaCO2. The PaCO2-ETCO2 gradient provides valuable clinical information: a normal gradient (2-5 mmHg) indicates good V/Q matching and minimal dead space. A widened gradient (> 5 mmHg) indicates increased dead space ventilation (PE, overdistention, low cardiac output, right-to-left shunt). A narrowing gradient may occur with exercise (increased CO) or conditions reducing dead space.

Clinical applications of capnography in respiratory therapy include: ETT confirmation (gold standard — persistent waveform confirms tracheal placement), procedural sedation monitoring (earliest indicator of hypoventilation — SpO2 drops much later), CPR quality monitoring (ETCO2 < 10 mmHg during CPR suggests inadequate compressions; sudden rise in ETCO2 during CPR may indicate return of spontaneous circulation — ROSC), ventilator weaning assessment (rising ETCO2 during SBT suggests ventilatory failure), and bronchospasm assessment (shark fin waveform and rising ETCO2 indicate increasing airway obstruction).

Mainstream capnography places the sensor directly in the breathing circuit at the airway, providing faster response time and more accurate waveform. Sidestream capnography aspirates a gas sample from the airway through narrow-bore tubing to a remote sensor — it can be used with nasal cannula for non-intubated patients but has slower response time and can be affected by water vapor and secretion clogging.

Volumetric capnography integrates the CO2 waveform with exhaled volume, providing quantitative assessment of dead space fraction (VD/VT), CO2 elimination per breath (VtCO2), and a slope analysis of phase III that correlates with V/Q heterogeneity. This advanced monitoring technique has prognostic value in ARDS (VD/VT > 0.60 predicts mortality) and can guide PEEP titration (optimal PEEP minimizes dead space and maximizes CO2 elimination per breath).`,
    riskFactors: [
      "False reassurance from normal ETCO2 in the presence of shunt (shunted blood contributes to high PaCO2 but is not reflected in ETCO2)",
      "Sampling line occlusion in sidestream capnography from water condensation or secretions",
      "Capnography not routinely used in non-intubated patients despite proven value in procedural sedation monitoring",
      "Misinterpretation of low ETCO2: may indicate hyperventilation, dead space increase, low cardiac output, or disconnection",
      "Reliance on ETCO2 number alone without analyzing waveform morphology — the shape is often more informative than the number",
      "Equipment calibration drift over time — periodic verification against ABG CO2 values"
    ],
    diagnostics: [
      "Continuous waveform capnography for ventilated patients and during procedural sedation",
      "ETCO2 value trending correlated with PaCO2 from ABG to establish patient-specific PaCO2-ETCO2 gradient",
      "Waveform morphology analysis: rectangular (normal), shark fin (obstruction), absent (displacement/arrest), curare cleft (NMB wearing off)",
      "ETCO2 during CPR: < 10 mmHg = inadequate compressions, sudden rise = possible ROSC",
      "Volumetric capnography for dead space measurement (VD/VT) in mechanically ventilated patients",
      "Sidestream nasal capnography for non-intubated patients during procedural sedation and in emergency department",
      "PaCO2-ETCO2 gradient trending to monitor dead space changes without repeated ABG draws"
    ],
    management: [
      "Apply continuous capnography to ALL intubated patients — gold standard for ETT position monitoring",
      "Use capnography during procedural sedation for ALL patients — earliest detection of hypoventilation",
      "Target ETCO2 during CPR > 10 mmHg by optimizing compression quality — if < 10 despite good technique, consider futility",
      "Investigate sudden ETCO2 drop: check ETT position, circuit integrity, cardiac output, pulmonary embolism",
      "Treat waveform abnormalities: shark fin → bronchodilator; absent waveform → confirm ETT position; rising baseline → rebreathing (check circuit)",
      "Use volumetric capnography-derived VD/VT to guide PEEP titration in ARDS — minimize dead space",
      "Correlate ETCO2 with ABG PaCO2 at least daily and establish patient-specific correction factor",
      "Monitor ETCO2 during ventilator weaning — rising ETCO2 during SBT may indicate impending weaning failure"
    ],
    nursingActions: [
      "Verify capnography waveform is present and displaying correctly at every assessment and after any ETT manipulation",
      "Document ETCO2 value, waveform morphology, and PaCO2-ETCO2 gradient with each ABG",
      "Troubleshoot sidestream capnography issues: water trap maintenance, sampling line patency, connector integrity",
      "Alert provider immediately for any loss of capnography waveform in intubated patient — do NOT assume equipment malfunction",
      "Use capnography waveform improvement (return to rectangular shape) to assess bronchodilator treatment response",
      "Monitor ETCO2 trends during weaning trials — progressive ETCO2 rise suggests inadequate spontaneous ventilation",
      "Apply nasal capnography for procedural sedation monitoring — it detects hypoventilation minutes before SpO2 changes",
      "During CPR: report ETCO2 values every 2 minutes to team leader for compression quality and ROSC assessment"
    ],
    signs: [
      "Normal ventilation: rectangular capnogram, ETCO2 35-45 mmHg, PaCO2-ETCO2 gradient 2-5 mmHg",
      "Hypoventilation: rising ETCO2 above 45 mmHg with preserved waveform morphology",
      "Hyperventilation: falling ETCO2 below 35 mmHg with preserved waveform",
      "Bronchospasm: shark fin (sloped phase III) waveform with elevated ETCO2",
      "ETT displacement: sudden loss of waveform or dramatic ETCO2 drop to near-zero",
      "ROSC during CPR: sudden sustained rise in ETCO2 (often > 40 mmHg) indicating restoration of pulmonary blood flow"
    ],
    medications: [
      { name: "Albuterol (guided by capnography)", dose: "2.5-5 mg nebulized", route: "Inhaled", purpose: "Bronchodilator administered when shark fin capnography waveform indicates obstruction — assess waveform normalization post-treatment" },
      { name: "Epinephrine (during CPR)", dose: "1 mg IV q3-5min per ACLS protocol", route: "Intravenous", purpose: "Vasopressor during cardiac arrest — ETCO2 response to epinephrine may indicate drug circulation and ROSC likelihood" }
    ],
    pearls: [
      "Loss of capnography waveform in an intubated patient = ETT out of the trachea until proven otherwise — act immediately",
      "ETCO2 during CPR is the best indicator of compression quality: < 10 mmHg = improve compressions, > 20 mmHg = adequate technique",
      "The capnography waveform SHAPE is more informative than the ETCO2 number — learn to read morphology, not just values",
      "A sudden PaCO2-ETCO2 gap widening without ventilator changes should prompt investigation for PE, cardiac output decline, or overdistention",
      "Capnography detects hypoventilation minutes before pulse oximetry detects desaturation — it is a LEADING indicator",
      "Rising ETCO2 baseline (CO2 not returning to zero during inspiration) indicates rebreathing — check circuit for malfunction or inadequate fresh gas flow"
    ],
    quiz: [
      { question: "During CPR, ETCO2 suddenly rises from 8 to 42 mmHg. What is the most likely explanation?", options: ["Equipment malfunction", "Return of spontaneous circulation (ROSC)", "Hyperventilation by the bag-mask operator", "Sodium bicarbonate administration"], correct: 1, rationale: "A sudden sustained rise in ETCO2 during CPR indicates return of spontaneous circulation. When the heart begins pumping effectively, CO2-laden blood from the tissues reaches the lungs and is exhaled, causing a dramatic ETCO2 increase. This is often the earliest indicator of ROSC, even before a pulse is palpable." },
      { question: "A mechanically ventilated patient has PaCO2 52 and ETCO2 30. What does the 22 mmHg PaCO2-ETCO2 gradient indicate?", options: ["Normal finding", "Significant dead space ventilation", "Bronchospasm", "Equipment calibration error"], correct: 1, rationale: "A PaCO2-ETCO2 gradient of 22 mmHg (normal 2-5) indicates substantial dead space ventilation. Dead space gas (containing no CO2) dilutes the exhaled alveolar gas, lowering the measured ETCO2 while PaCO2 remains elevated. Causes include pulmonary embolism, alveolar overdistention, and low cardiac output." },
      { question: "What capnography waveform change would you expect after successful albuterol treatment for bronchospasm?", options: ["Waveform disappears", "Shark fin shape normalizes to rectangular with flat phase III plateau", "ETCO2 drops to zero", "Phase II becomes vertical"], correct: 1, rationale: "Bronchospasm causes a shark fin capnography waveform (sloped phase III) from uneven alveolar emptying due to variable airway obstruction. After successful bronchodilator treatment, the obstruction is relieved, alveolar emptying becomes more uniform, and the waveform normalizes to a rectangular shape with a flat phase III plateau." }
    ]
  }
};
