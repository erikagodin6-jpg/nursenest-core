import type { LessonContent } from "./types";

export const cbiLessons: Record<string, LessonContent> = {
  "continuous-bladder-irrigation-rpn": {
    title: "Continuous Bladder Irrigation (CBI)",
    cellular: {
      title: "Irrigation Physiology and Fluid Dynamics",
      content: "Continuous bladder irrigation (CBI) involves the instillation of sterile irrigating solution through a three-way urinary catheter to prevent clot formation, maintain catheter patency, and promote hemostasis following genitourinary surgery. The three-way catheter has one lumen for balloon inflation, one for drainage, and a third dedicated irrigation port. Irrigating solution, most commonly normal saline (0.9% NaCl), flows into the bladder by gravity, dilutes blood and tissue debris, and exits through the drainage lumen into a collection bag. The rate of flow is titrated to maintain light pink or clear drainage. When hypotonic solutions such as glycine or sorbitol-mannitol are used (as in monopolar TURP), fluid absorption through open prostatic venous sinuses can cause dilutional hyponatremia, a condition known as TURP syndrome. The bladder mucosa is semi-permeable, and prolonged irrigation with large volumes creates risk for systemic fluid absorption, electrolyte imbalance, and hypothermia if room-temperature solutions are used. The nurse monitors intake and output, observes drainage color and consistency, reports changes in patient status, and ensures the irrigation system remains patent and functioning."
    },
    riskFactors: [
      "Recent transurethral resection of the prostate (TURP)",
      "Bladder surgery or tumor resection",
      "Gross hematuria with clot formation",
      "Coagulopathy or anticoagulant therapy",
      "Large prostate gland (increased resection time and bleeding risk)",
      "Use of hypotonic irrigation solution (glycine-based)",
      "Prolonged operative time with extensive tissue resection",
      "Pre-existing cardiovascular or renal disease (impaired fluid handling)"
    ],
    diagnostics: [
      "Monitor and record urine output color: clear, light pink, dark pink, red, or burgundy with clots",
      "Calculate accurate intake and output by subtracting irrigation volume infused from total drainage collected",
      "Monitor vital signs per post-operative protocol (every 15 minutes initially)",
      "Report decreased or absent catheter output immediately",
      "Report patient complaints of bladder fullness, pain, or pressure",
      "Monitor for signs of fluid overload: dyspnea, crackles, peripheral edema"
    ],
    management: [
      "Maintain CBI at prescribed flow rate to keep drainage light pink to clear",
      "Ensure irrigation bags are changed before running empty to prevent air entering the system",
      "Keep drainage bag below the level of the bladder at all times",
      "Report bright red drainage, large clots, or catheter obstruction to the nurse immediately",
      "Administer prescribed analgesics and antispasmodics as ordered for bladder spasm",
      "Encourage oral fluid intake as permitted to support renal function and dilute urine"
    ],
    nursingActions: [
      "Assess catheter drainage system patency at regular intervals",
      "Document irrigation solution type, volume infused, and total drainage output each shift",
      "Report signs of TURP syndrome: confusion, nausea, vomiting, restlessness, visual changes",
      "Report signs of hemorrhage: bright red or burgundy drainage with large clots, tachycardia, hypotension",
      "Maintain catheter securement to prevent traction on the bladder neck",
      "Monitor for bladder spasms and report if persistent or severe",
      "Ensure patient comfort and reposition as needed without disrupting catheter system",
      "Report temperature elevation or signs of urinary tract infection"
    ],
    signs: {
      left: [
        "Light pink to clear catheter drainage",
        "Stable vital signs within baseline parameters",
        "Adequate urine output with irrigation running",
        "Mild bladder spasms (expected post-operatively)",
        "Patient reports mild discomfort at catheter site",
        "Small tissue fragments in drainage (expected post-TURP)"
      ],
      right: [
        "Bright red or burgundy drainage with large clots",
        "Absent or significantly decreased catheter output (obstruction)",
        "Bladder distension with patient complaints of severe pressure or pain",
        "Confusion, nausea, restlessness, or visual changes (TURP syndrome)",
        "Tachycardia, hypotension, or pallor (hemorrhage)",
        "Fever, chills, or purulent drainage (infection)"
      ]
    },
    medications: [
      { name: "Oxybutynin", type: "Anticholinergic/antispasmodic", action: "Blocks muscarinic receptors on detrusor smooth muscle, reducing involuntary bladder contractions and relieving bladder spasms associated with catheter irritation", sideEffects: "Dry mouth, constipation, blurred vision, urinary retention, drowsiness, confusion in elderly", contra: "Uncontrolled narrow-angle glaucoma, urinary retention (without catheter), severe GI motility disorders", pearl: "Administer as ordered for catheter-related bladder spasms. Monitor for anticholinergic effects, especially in elderly patients. Report if spasms persist despite medication." },
      { name: "Belladonna and Opium (B&O) Suppository", type: "Antispasmodic-opioid combination", action: "Belladonna alkaloids provide anticholinergic smooth muscle relaxation while opium provides analgesia, together reducing severe bladder spasms and catheter-related pain", sideEffects: "Sedation, constipation, urinary retention, respiratory depression, dry mouth", contra: "Respiratory depression, paralytic ileus, severe hepatic disease, glaucoma", pearl: "Reserved for severe bladder spasms not responsive to other antispasmodics. Administer rectally as ordered. Monitor respiratory rate and sedation level. Report effectiveness to the RN." },
      { name: "Aminocaproic Acid", type: "Antifibrinolytic agent", action: "Inhibits plasminogen activation by blocking the lysine-binding site on plasminogen, reducing fibrinolysis and promoting clot stabilization in the surgical bed", sideEffects: "Nausea, diarrhea, dizziness, hypotension, thrombotic events (rare)", contra: "Active intravascular clotting (DIC), upper urinary tract bleeding (risk of ureteral clot obstruction)", pearl: "May be added to irrigation solution or given systemically as ordered for persistent post-operative bleeding. Monitor for signs of clot retention. Report any decrease in urine output." }
    ],
    pearls: [
      "True urine output equals total drainage minus total irrigation fluid infused; always calculate this accurately to detect fluid retention or blood loss",
      "Never clamp a CBI catheter if obstruction is suspected; report immediately so manual irrigation can be performed by the RN",
      "Catheter drainage that changes from light pink to bright red or contains large clots indicates active bleeding and requires immediate notification",
      "TURP syndrome is a medical emergency caused by absorption of hypotonic irrigation solution, leading to dilutional hyponatremia, cerebral edema, and cardiovascular instability"
    ],
    quiz: [
      { question: "The nurse calculates that 3000 mL of irrigation solution was infused and total catheter drainage is 2800 mL. What does this finding suggest?", options: ["Normal findings; the difference is expected", "200 mL of irrigation fluid has been absorbed or retained, requiring reporting", "The catheter is obstructed and needs to be replaced", "The drainage bag has a leak"], correct: 1, rationale: "When total drainage is less than total irrigation infused, the difference represents fluid that has been absorbed systemically or retained in the bladder. A 200 mL deficit should be reported, as significant absorption can lead to dilutional hyponatremia and fluid overload." },
      { question: "A patient with CBI running post-TURP reports increasing lower abdominal pressure and the nurse notes the drainage has slowed significantly. What is the priority action?", options: ["Increase the irrigation flow rate", "Report decreased output and patient symptoms to the nurse immediately", "Clamp the irrigation tubing and wait", "Encourage the patient to bear down to pass clots"], correct: 1, rationale: "Decreased drainage output with increasing abdominal pressure suggests catheter obstruction, likely from blood clots. The nurse should report immediately so the nurse can assess and perform manual irrigation if needed. Never clamp the catheter or encourage straining." }
    ]
  },

  "continuous-bladder-irrigation-rn": {
    title: "Continuous Bladder Irrigation (CBI)",
    cellular: {
      title: "Irrigation Physiology and Complications",
      content: "Continuous bladder irrigation delivers sterile solution through the irrigation port of a three-way Foley catheter at a controlled rate to prevent blood clot accumulation, maintain catheter patency, and promote hemostasis in the post-surgical bladder. The irrigating fluid dilutes blood components and mechanically flushes debris through the drainage lumen. Normal saline (0.9% NaCl) is the preferred irrigant for bipolar electrosurgical procedures because it is isotonic and does not cause electrolyte disturbances if absorbed. Monopolar TURP traditionally uses glycine 1.5% or sorbitol-mannitol solutions because they are non-conductive and non-hemolytic; however, these hypotonic solutions create the risk of TURP syndrome when absorbed through open prostatic venous sinuses during resection. Fluid absorption occurs at a rate of approximately 10-30 mL per minute of resection time, and total absorption volumes exceeding 1000-1500 mL significantly increase the risk of symptomatic hyponatremia. TURP syndrome manifests as dilutional hyponatremia (sodium often less than 120 mEq/L), causing cerebral edema, altered mental status, seizures, cardiovascular instability (bradycardia, hypertension progressing to hypotension), nausea, and visual disturbances (glycine is an inhibitory neurotransmitter in the retina). The nurse manages CBI flow titration, performs manual bladder irrigation for clot evacuation, monitors fluid balance, assesses for complications, and coordinates care with the surgical team."
    },
    riskFactors: [
      "TURP with monopolar electrocautery and hypotonic irrigant",
      "Resection time exceeding 60 minutes",
      "Large prostate gland (>45 grams) requiring extensive resection",
      "Bladder tumor resection with deep tissue involvement",
      "Coagulopathy or concurrent anticoagulant/antiplatelet therapy",
      "Pre-existing cardiac failure or renal insufficiency (reduced fluid tolerance)",
      "Perforation of the prostatic capsule or bladder wall during surgery",
      "Elevated venous pressure (Trendelenburg positioning, increased CVP)"
    ],
    diagnostics: [
      "Perform accurate CBI intake and output calculation every 1-2 hours: true urine output = total drainage minus total irrigation infused",
      "Monitor serum sodium levels post-operatively as ordered (stat sodium if TURP syndrome suspected)",
      "Assess hemoglobin and hematocrit trends for ongoing hemorrhage",
      "Monitor coagulation studies (PT, INR, aPTT) in patients on anticoagulation",
      "Evaluate catheter drainage character: color progression from red to pink to clear indicates normal healing",
      "Assess bladder scan if catheter obstruction suspected and drainage is absent",
      "Monitor serum creatinine and BUN for renal function assessment",
      "Evaluate ECG if bradycardia or arrhythmia develops (hyponatremia-related)"
    ],
    management: [
      "Titrate CBI flow rate to maintain light pink to clear drainage; increase rate if drainage darkens",
      "Perform manual bladder irrigation with 30-60 mL syringe using normal saline if clot obstruction is suspected",
      "Maintain strict intake and output records with hourly CBI fluid balance calculations",
      "Manage TURP syndrome: stop irrigation immediately, elevate head of bed, obtain stat serum sodium, notify provider, prepare for hypertonic saline (3% NaCl) administration",
      "Implement hemorrhage management: increase CBI rate, apply gentle catheter traction as ordered, prepare for possible surgical re-exploration",
      "Manage bladder spasms with prescribed antispasmodics; assess for catheter malposition if spasms are severe and persistent",
      "Coordinate catheter removal timing with provider (typically 24-72 hours post-operatively when drainage is clear)",
      "Implement VTE prophylaxis and early ambulation per post-operative protocol"
    ],
    nursingActions: [
      "Assess CBI system integrity every 1-2 hours: irrigation flow, drainage output, tubing connections, bag volumes",
      "Perform manual irrigation technique: instill 30-60 mL normal saline, aspirate gently, repeat until return is clear of clots",
      "Assess for signs of bladder perforation: severe abdominal pain, rigid abdomen, decreased drainage despite patent catheter",
      "Monitor neurological status every 15 minutes for first 2 hours post-operatively for TURP syndrome detection",
      "Assess pain using validated scale; differentiate between surgical site pain, bladder spasm pain, and distension pain",
      "Educate patient on post-operative expectations: hematuria duration, activity restrictions, catheter care",
      "Coordinate with pharmacy for CBI solution supply to prevent interruption",
      "Document detailed catheter assessment: drainage color, clot presence, irrigation rate, patient tolerance"
    ],
    signs: {
      left: [
        "Progressive lightening of drainage from dark pink to light pink to clear over 24-48 hours",
        "Adequate urine output (true output >0.5 mL/kg/hr after subtracting irrigation volume)",
        "Mild intermittent bladder spasms responsive to antispasmodics",
        "Stable hemoglobin within acceptable post-operative range",
        "Serum sodium within normal limits (135-145 mEq/L)",
        "Patient alert, oriented, and hemodynamically stable"
      ],
      right: [
        "TURP syndrome: confusion, nausea, seizures, bradycardia, hyponatremia (<120 mEq/L), visual disturbances",
        "Hemorrhage: bright red drainage with large clots, falling hemoglobin, tachycardia, hypotension",
        "Catheter obstruction: absent drainage, bladder distension, severe suprapubic pain",
        "Bladder perforation: severe abdominal pain, rigid abdomen, peritoneal signs, free fluid",
        "Hypothermia from large-volume room-temperature irrigation",
        "Sepsis: fever >38.5C, tachycardia, hypotension, altered mental status, bacteruria"
      ]
    },
    medications: [
      { name: "Hypertonic Saline (3% NaCl)", type: "Electrolyte replacement solution", action: "Increases serum sodium concentration by creating an osmotic gradient that draws water from intracellular to extracellular space, correcting dilutional hyponatremia and reducing cerebral edema in TURP syndrome", sideEffects: "Central pontine myelinolysis (osmotic demyelination) if sodium corrected too rapidly, fluid overload, phlebitis at peripheral IV site", contra: "Hypernatremia, severe heart failure without monitoring, correction rate exceeding 8-10 mEq/L per 24 hours", pearl: "Administer via central line when possible. Target sodium correction of 1-2 mEq/L per hour initially, maximum 8-10 mEq/L in 24 hours. Requires ICU-level monitoring with serial sodium levels every 2-4 hours during infusion." },
      { name: "Oxybutynin", type: "Anticholinergic/antispasmodic", action: "Competitively blocks muscarinic M3 receptors on detrusor smooth muscle, inhibiting acetylcholine-mediated bladder contractions and reducing catheter-related bladder spasms", sideEffects: "Dry mouth, constipation, blurred vision, cognitive impairment in elderly, tachycardia, urinary retention", contra: "Uncontrolled narrow-angle glaucoma, GI obstruction, myasthenia gravis, severe ulcerative colitis", pearl: "First-line for CBI-related bladder spasms. IR formulation 5mg PO or per NG every 6-8 hours. If spasms persist, consider catheter repositioning or manual irrigation before escalating dose. Use with caution in elderly due to anticholinergic burden." },
      { name: "Tranexamic Acid", type: "Antifibrinolytic agent", action: "Reversibly blocks lysine-binding sites on plasminogen, preventing its conversion to plasmin and inhibiting fibrinolysis, thereby stabilizing clots at the surgical site and reducing post-operative bleeding", sideEffects: "Nausea, diarrhea, dizziness, thrombotic events (DVT, PE), visual disturbances, seizures at high doses", contra: "Active thromboembolic disease, history of seizures, subarachnoid hemorrhage, acquired color vision disturbance", pearl: "May be administered IV or orally to reduce post-TURP hemorrhage. Can also be added to irrigation fluid in some protocols. Monitor for signs of clot retention if bleeding decreases rapidly. Assess VTE risk before administration." }
    ],
    pearls: [
      "Manual irrigation technique: disconnect drainage tubing from catheter using aseptic technique, instill 30-60 mL normal saline with piston syringe, aspirate gently until return is free of clots, then reconnect to CBI system",
      "TURP syndrome is a clinical emergency: stop irrigation, obtain stat sodium, and prepare for hypertonic saline if sodium is less than 120 mEq/L with neurological symptoms",
      "Hypothermia prevention: use warmed irrigation solution during prolonged CBI, especially in elderly patients or those with cardiac history",
      "If true urine output is negative (more irrigation infused than drained), suspect significant fluid absorption and assess for TURP syndrome or bladder perforation",
      "Bladder spasms that are unresponsive to antispasmodics may indicate catheter balloon malposition against the trigone; assess catheter position before escalating pharmacotherapy",
      "Post-TURP bleeding risk increases 10-14 days post-operatively when the eschar separates from the prostatic fossa (secondary hemorrhage)"
    ],
    quiz: [
      { question: "A post-TURP patient on CBI becomes confused, nauseated, and develops bradycardia with a blood pressure of 168/94 mmHg. Serum sodium is 112 mEq/L. What is the priority nursing action?", options: ["Increase the CBI flow rate to flush the bladder", "Stop the irrigation immediately, notify the provider, and prepare for hypertonic saline administration", "Administer a 500 mL normal saline bolus for volume expansion", "Administer furosemide 40 mg IV to promote fluid excretion"], correct: 1, rationale: "This presentation is classic TURP syndrome with severe hyponatremia (112 mEq/L), cerebral edema symptoms (confusion), and cardiovascular effects (bradycardia, hypertension). The priority is to stop the source of hypotonic fluid absorption, notify the provider, and prepare for hypertonic saline (3% NaCl) to correct the sodium deficit." },
      { question: "During manual bladder irrigation for suspected clot obstruction, the nurse instills 50 mL of normal saline but is unable to aspirate any return. What should the nurse do next?", options: ["Instill another 100 mL of saline with more force", "Reposition the catheter slightly and attempt gentle aspiration again; if still unsuccessful, notify the provider", "Remove the catheter and insert a new one", "Clamp the catheter and wait 30 minutes for clots to dissolve"], correct: 1, rationale: "Inability to aspirate after instillation may indicate a large organized clot or catheter malposition. Gentle repositioning and re-aspiration is attempted first. If unsuccessful, the provider must be notified as the patient may require catheter replacement with a larger bore catheter, cystoscopic clot evacuation, or surgical intervention. Forcing additional fluid increases bladder distension risk." }
    ]
  },

  "continuous-bladder-irrigation-np": {
    title: "Continuous Bladder Irrigation (CBI)",
    cellular: {
      title: "Irrigation Fluid Dynamics, Dilutional",
      content: "Continuous bladder irrigation is a therapeutic intervention ordered to prevent clot retention, maintain catheter patency, and promote hemostasis following transurethral procedures or in cases of severe hematuria. The clinician must understand the pathophysiology of irrigation-related complications to make prescriptive and management decisions. During monopolar TURP, non-electrolyte hypotonic solutions (glycine 1.5%, sorbitol 3.3%, or sorbitol-mannitol 2.7%/0.54%) are used because electrolyte-containing solutions would disperse monopolar electrocautery current. These solutions have osmolalities of 200-230 mOsm/kg, significantly below plasma osmolality of 275-295 mOsm/kg. Absorption occurs through open prostatic venous sinuses at rates proportional to hydrostatic pressure (irrigation bag height), duration of surgery, and number of opened venous channels. Absorbed hypotonic fluid dilutes serum sodium, causing hypo-osmolality and water movement into cells, including brain cells. Cerebral edema manifests as confusion, agitation, seizures, and ultimately herniation if uncorrected. Glycine itself acts as an inhibitory neurotransmitter in the retina and brainstem, producing transient blindness and CNS depression independent of hyponatremia. Cardiovascular effects include initial hypervolemia with hypertension and reflex bradycardia, progressing to myocardial depression and hypotension as sodium falls below 115 mEq/L. Bipolar electrosurgery permits use of isotonic normal saline irrigation, virtually eliminating TURP syndrome risk, and has become the standard of care in most centers. The clinician orders irrigation type and rate, prescribes pharmacotherapy for complications, manages electrolyte correction, and determines when to discontinue CBI or escalate to surgical re-intervention."
    },
    riskFactors: [
      "Monopolar TURP with hypotonic irrigant (primary modifiable risk factor)",
      "Resection time exceeding 60-90 minutes (linear relationship with fluid absorption)",
      "Irrigation bag height greater than 60 cm above the bladder (increased hydrostatic pressure)",
      "Prostate gland greater than 45 grams (larger resection volume, more open sinuses)",
      "Intraoperative prostatic capsule perforation or bladder perforation",
      "Pre-existing hyponatremia (baseline sodium <135 mEq/L)",
      "Heart failure (NYHA class III-IV) or chronic kidney disease (eGFR <30 mL/min)",
      "Concurrent use of anticoagulants or antiplatelet agents increasing hemorrhage risk",
      "Advanced age with reduced physiologic reserve for fluid shifts"
    ],
    diagnostics: [
      "Order serial serum sodium levels every 2-4 hours post-operatively if TURP syndrome risk is present",
      "Order stat basic metabolic panel if TURP syndrome is suspected (sodium, potassium, chloride, glucose, BUN, creatinine, osmolality)",
      "Order serum and urine osmolality to differentiate dilutional hyponatremia from other causes",
      "Order CBC with hemoglobin/hematocrit every 6-8 hours to trend blood loss",
      "Order coagulation panel (PT, INR, aPTT, fibrinogen) if DIC or consumptive coagulopathy is suspected",
      "Order blood type and crossmatch if hemoglobin drops below 7-8 g/dL or active hemorrhage continues",
      "Order ECG for bradycardia, arrhythmia, or QT prolongation associated with electrolyte disturbances",
      "Order CT abdomen/pelvis if bladder perforation is suspected (peritoneal signs, unexplained fluid deficit)"
    ],
    management: [
      "Order CBI with normal saline (0.9% NaCl) at specified flow rate; adjust based on drainage color and output",
      "Prescribe hypertonic saline (3% NaCl) for symptomatic hyponatremia: initial bolus of 100-150 mL over 10-20 minutes for seizures, then infusion targeting correction of 1-2 mEq/L per hour (maximum 8-10 mEq/L in 24 hours)",
      "Order fluid restriction (800-1000 mL/day) for mild asymptomatic hyponatremia (sodium 125-134 mEq/L)",
      "Prescribe tranexamic acid 1g IV every 8 hours or add to irrigation solution for persistent post-operative hemorrhage",
      "Order blood product transfusion (pRBCs) for hemoglobin less than 7 g/dL or symptomatic anemia with ongoing bleeding",
      "Prescribe antimicrobial prophylaxis or treatment based on culture sensitivities for catheter-associated UTI",
      "Determine CBI discontinuation criteria: drainage clear to light yellow for 12-24 hours with stable hemoglobin",
      "Order catheter removal trial with post-void residual assessment 24-72 hours after CBI discontinuation"
    ],
    nursingActions: [
      "Develop CBI management protocol: specify irrigation solution, initial flow rate, titration parameters, and monitoring frequency",
      "Prescribe sodium correction protocol with defined rate limits and monitoring intervals to prevent osmotic demyelination",
      "Order and interpret diagnostic studies to differentiate TURP syndrome from other post-operative complications",
      "Evaluate need for ICU transfer if severe TURP syndrome, uncontrolled hemorrhage, or hemodynamic instability is present",
      "Manage anticoagulation resumption timing: balance thrombotic risk against post-operative bleeding risk",
      "Assess for surgical re-intervention indications: uncontrollable hemorrhage, large organized clot retention requiring cystoscopic evacuation, bladder perforation",
      "Coordinate urology consultation for refractory complications or need for return to operating room",
      "Develop discharge criteria and follow-up plan including voiding trial assessment and outpatient catheter management if needed"
    ],
    signs: {
      left: [
        "Progressive clearing of irrigation drainage within 24-48 hours post-operatively",
        "True urine output exceeding 0.5 mL/kg/hr with balanced CBI fluid accounting",
        "Stable hemoglobin with decreasing transfusion requirements",
        "Serum sodium maintained within 135-145 mEq/L throughout CBI therapy",
        "Successful transition from CBI to gravity catheter drainage",
        "Successful voiding trial with post-void residual less than 100 mL"
      ],
      right: [
        "Severe TURP syndrome: sodium less than 115 mEq/L, seizures, transient blindness (glycine toxicity), cardiovascular collapse",
        "Refractory hemorrhage: persistent bright red drainage despite maximum CBI flow and antifibrinolytic therapy",
        "Disseminated intravascular coagulation (DIC): microangiopathic bleeding, thrombocytopenia, elevated D-dimer, prolonged PT/aPTT",
        "Bladder perforation: intraperitoneal or extraperitoneal fluid extravasation, peritoneal signs, hemodynamic instability",
        "Clot retention requiring cystoscopic evacuation under anesthesia",
        "Sepsis secondary to bacteremia from catheter-associated urinary tract infection"
      ]
    },
    medications: [
      { name: "Hypertonic Saline (3% NaCl)", type: "Electrolyte replacement solution", action: "Increases extracellular osmolality, creating a transcellular osmotic gradient that draws water from edematous brain cells into the vascular compartment, reversing cerebral edema and correcting dilutional hyponatremia from TURP syndrome", sideEffects: "Central pontine myelinolysis (osmotic demyelination syndrome) from overcorrection, volume overload, peripheral vein phlebitis, hyperchloremic metabolic acidosis", contra: "Hypernatremia, overcorrection risk exceeding 8-10 mEq/L per 24 hours, administration via peripheral IV exceeding 3% concentration", pearl: "For acute symptomatic hyponatremia with seizures: 100-150 mL bolus of 3% NaCl over 10-20 minutes, may repeat once if seizures persist. Target initial rise of 4-6 mEq/L in first 6 hours. Monitor sodium every 2 hours during correction. Central venous access preferred. Risk of osmotic demyelination is highest in chronic hyponatremia corrected too rapidly." },
      { name: "Tranexamic Acid", type: "Antifibrinolytic agent", action: "Competitively inhibits the activation of plasminogen to plasmin by blocking the lysine-binding sites, preventing clot lysis at the surgical site and reducing post-operative hemorrhage volume", sideEffects: "Nausea, vomiting, diarrhea, thromboembolic events (DVT, PE, arterial thrombosis), seizures at high doses, visual disturbances", contra: "Active thromboembolic disease, history of seizures or intracranial hemorrhage, subarachnoid hemorrhage, acquired defective color vision, concurrent use with activated prothrombin complex concentrate", pearl: "1g IV every 8 hours for systemic antifibrinolytic effect. Can also be added to irrigation solution (500 mg per 1000 mL NS) for topical effect in some protocols. Assess VTE risk before prescribing. Contraindicated in upper urinary tract bleeding due to risk of ureteral clot obstruction." },
      { name: "Furosemide", type: "Loop diuretic", action: "Inhibits the Na-K-2Cl cotransporter in the thick ascending limb of the loop of Henle, promoting excretion of free water and sodium, used in volume-overloaded patients with TURP syndrome when hyponatremia is associated with hypervolemia", sideEffects: "Hypokalemia, hypomagnesemia, ototoxicity, hypotension, metabolic alkalosis, dehydration", contra: "Anuria, severe hypovolemia, hepatic coma, uncorrected electrolyte depletion", pearl: "Use cautiously in TURP syndrome: furosemide promotes free water excretion which can help correct hypervolemic hyponatremia, but it also causes sodium loss. Best used in conjunction with hypertonic saline in volume-overloaded patients. Always replace potassium concurrently. Not first-line for TURP syndrome; hypertonic saline is the primary treatment for symptomatic hyponatremia." }
    ],
    pearls: [
      "Bipolar TURP using normal saline irrigation has virtually eliminated TURP syndrome in modern practice; when ordering new CBI post-procedure, confirm the electrosurgical modality used to determine appropriate irrigant",
      "Sodium correction in TURP syndrome must not exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis), which causes irreversible neurological damage",
      "Glycine toxicity can cause transient blindness independent of hyponatremia because glycine is an inhibitory neurotransmitter in the retina; visual symptoms should prompt immediate assessment even if sodium is only mildly reduced",
      "CBI discontinuation criteria: drainage clear to light yellow for at least 12 hours, stable hemoglobin on two consecutive measurements, no clot obstruction events in the preceding 12 hours",
      "Secondary hemorrhage occurs 10-14 days post-TURP when the surgical eschar separates from the prostatic fossa; educate patients to seek emergency care if hematuria recurs after discharge",
      "Irrigation fluid absorption can be estimated using the ethanol breath test (1% ethanol added to irrigant, expired ethanol measured) or by pre- and post-operative body weight comparison (each 1 kg increase approximates 1 L absorbed)"
    ],
    quiz: [
      { question: "A patient develops seizures 90 minutes after monopolar TURP. Serum sodium is 108 mEq/L. What is the appropriate initial management?", options: ["Administer normal saline (0.9% NaCl) at 250 mL/hr", "Administer 150 mL bolus of 3% hypertonic saline over 10-20 minutes and repeat if seizures persist", "Administer furosemide 80 mg IV to promote free water excretion", "Restrict fluids and monitor sodium levels every 6 hours"], correct: 1, rationale: "Acute symptomatic hyponatremia (108 mEq/L) with seizures requires emergent treatment with hypertonic saline (3% NaCl). A 150 mL bolus over 10-20 minutes is recommended, with the option to repeat once if seizures continue. The target is an initial rise of 4-6 mEq/L in the first 6 hours. Normal saline alone is insufficient for this degree of hyponatremia, and fluid restriction is inadequate for acute symptomatic presentation." },
      { question: "An NP is determining when to discontinue CBI on a post-TURP patient. Which set of criteria supports safe CBI discontinuation?", options: ["Drainage is dark pink and the patient is tolerating oral fluids", "Drainage has been clear to light yellow for 18 hours, hemoglobin is stable on two consecutive draws, and no clot obstruction has occurred in the past 12 hours", "The irrigation bag is empty and the pharmacy has not sent a replacement", "The patient requests catheter removal and drainage is light pink"], correct: 1, rationale: "Safe CBI discontinuation requires drainage that has been consistently clear to light yellow for at least 12 hours, a stable hemoglobin trend without active blood loss, and no episodes of clot obstruction in the preceding 12 hours. Dark pink drainage or a single clear reading is insufficient to ensure hemostasis. Clinical criteria, not supply issues, should drive the decision." }
    ]
  }
};
