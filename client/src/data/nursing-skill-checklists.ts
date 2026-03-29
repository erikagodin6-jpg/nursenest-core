export interface NursingSkillChecklist {
  slug: string;
  title: string;
  shortTitle: string;
  category: ChecklistCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  overview: string;
  indications: string[];
  contraindications: string[];
  equipmentNeeded: string[];
  steps: ChecklistStep[];
  safetyAlerts: SafetyAlert[];
  nursingRationale: string;
  examNotes: string[];
  documentationRequirements: string[];
  complications: string[];
  relatedLessonSlugs: string[];
  relatedChecklistSlugs: string[];
  faqs: { question: string; answer: string }[];
  references: { title: string; url: string }[];
}

export interface ChecklistStep {
  stepNumber: number;
  title: string;
  description: string;
  rationale: string;
  criticalPoint?: boolean;
  tips?: string[];
}

export interface SafetyAlert {
  type: "warning" | "danger" | "info";
  title: string;
  description: string;
}

export type ChecklistCategory = "Vascular Access" | "Wound Management" | "Respiratory" | "Transfusion";

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  "Vascular Access",
  "Wound Management",
  "Respiratory",
  "Transfusion",
];

export const nursingSkillChecklists: NursingSkillChecklist[] = [
  {
    slug: "iv-insertion",
    title: "IV Insertion (Peripheral Intravenous Catheter Insertion)",
    shortTitle: "IV Insertion",
    category: "Vascular Access",
    difficulty: "intermediate",
    estimatedTime: "15-30 minutes",
    overview: "A step-by-step procedure guide for inserting a peripheral intravenous (IV) catheter. This essential nursing skill is used to administer fluids, medications, blood products, and parenteral nutrition. Proper technique reduces complications such as infiltration, phlebitis, and catheter-related bloodstream infections.",
    indications: [
      "Administration of IV fluids for hydration",
      "IV medication delivery",
      "Blood product transfusion",
      "Parenteral nutrition administration",
      "Emergency vascular access",
      "Contrast media administration for diagnostic imaging",
    ],
    contraindications: [
      "Extremity with AV fistula or graft (dialysis access)",
      "Arm on the side of a mastectomy with lymph node dissection",
      "Extremity with existing IV infiltration or phlebitis",
      "Area with active skin infection or burns",
      "Limb with lymphedema",
    ],
    equipmentNeeded: [
      "Appropriate-gauge IV catheter (18-24 gauge based on indication)",
      "Tourniquet",
      "Antiseptic swab (chlorhexidine or alcohol)",
      "Transparent semipermeable dressing (Tegaderm)",
      "IV extension set or saline lock",
      "Normal saline flush syringe (10 mL)",
      "Tape and securement device",
      "Clean gloves",
      "Sharps container",
      "Gauze pads",
    ],
    steps: [
      { stepNumber: 1, title: "Verify the Order and Gather Equipment", description: "Review the physician's order for IV access. Gather all necessary supplies and select the appropriate catheter gauge based on the prescribed therapy.", rationale: "Ensures correct therapy is initiated and prevents delays. Larger gauges (18G) are needed for blood products and rapid infusion; smaller gauges (22-24G) are appropriate for medication administration in patients with small veins.", tips: ["Use 18G for blood transfusions and trauma resuscitation", "Use 20G for most adult infusions", "Use 22-24G for elderly patients and small veins"] },
      { stepNumber: 2, title: "Perform Hand Hygiene and Don Gloves", description: "Wash hands thoroughly using alcohol-based hand rub or soap and water for at least 20 seconds. Apply clean non-sterile gloves.", rationale: "Prevents transmission of microorganisms and reduces the risk of catheter-related bloodstream infections (CRBSI).", criticalPoint: true },
      { stepNumber: 3, title: "Identify the Patient and Explain the Procedure", description: "Verify patient identity using two identifiers (name and date of birth). Explain the procedure, purpose, and potential complications. Obtain verbal consent.", rationale: "Ensures correct patient receives treatment. Patient education promotes cooperation and reduces anxiety." },
      { stepNumber: 4, title: "Select the Vein and Apply Tourniquet", description: "Apply the tourniquet 4-6 inches above the intended insertion site. Assess veins by palpation and visual inspection. Select a straight, well-anchored vein. Start distally and move proximally.", rationale: "Starting distally preserves proximal veins for future access. A properly placed tourniquet engorges veins for easier visualization and cannulation.", tips: ["Ask the patient to make a fist to distend veins", "Apply warm compresses for 5-10 minutes if veins are difficult to find", "Avoid areas over joints for better catheter stability"] },
      { stepNumber: 5, title: "Cleanse the Insertion Site", description: "Cleanse the selected site with chlorhexidine using a back-and-forth scrubbing motion for 30 seconds. Allow to dry completely (approximately 2 minutes).", rationale: "Antiseptic preparation reduces bacterial colonization at the insertion site. Allowing the solution to dry ensures maximum antimicrobial effectiveness.", criticalPoint: true },
      { stepNumber: 6, title: "Insert the Catheter", description: "Anchor the vein by applying traction below the insertion site. Insert the catheter at a 10-30 degree angle, bevel up. Observe for blood return (flashback) in the chamber. Once flashback is seen, advance the catheter slightly, then advance the catheter hub off the stylet into the vein. Retract the stylet.", rationale: "Anchoring the vein prevents rolling. The low insertion angle reduces the risk of going through the vein. Advancing the catheter off the stylet ensures the flexible catheter is fully seated in the vein.", criticalPoint: true, tips: ["If no flashback, do not advance — withdraw and reattempt with a new catheter", "Never reinsert the stylet into the catheter (risk of catheter shearing)"] },
      { stepNumber: 7, title: "Release the Tourniquet and Connect the Extension Set", description: "Release the tourniquet. Apply gentle pressure above the catheter tip while removing the stylet. Connect the saline lock or extension set. Flush with 3-5 mL normal saline using a pulsatile technique.", rationale: "Releasing the tourniquet before securing prevents pressure-related complications. Pulsatile flushing creates turbulent flow that clears the catheter and reduces risk of occlusion." },
      { stepNumber: 8, title: "Secure and Dress the Site", description: "Apply a transparent semipermeable dressing over the insertion site. Secure with a commercial securement device or tape. Label the dressing with date, time, gauge, and your initials.", rationale: "Transparent dressing allows continuous visual inspection of the site. Proper labeling facilitates monitoring and timely replacement (CDC recommends peripheral IVs be replaced every 72-96 hours, or per facility policy)." },
      { stepNumber: 9, title: "Document the Procedure", description: "Document catheter gauge, insertion site, number of attempts, patient tolerance, blood return and flush confirmation, and any complications.", rationale: "Complete documentation supports continuity of care, legal protection, and infection surveillance." },
    ],
    safetyAlerts: [
      { type: "danger", title: "Never Reinsert the Stylet", description: "Reinserting the stylet into the catheter can cause catheter shearing, resulting in a catheter embolism — a life-threatening emergency." },
      { type: "warning", title: "Maximum Insertion Attempts", description: "Limit to two attempts per nurse. After two unsuccessful attempts, have a more experienced clinician attempt or consider alternative access (ultrasound-guided, PICC line)." },
      { type: "info", title: "Catheter Replacement", description: "Peripheral IV catheters should be assessed every shift and replaced per facility policy (typically every 72-96 hours) or immediately if signs of phlebitis, infiltration, or infection are present." },
    ],
    nursingRationale: "Peripheral IV insertion is one of the most commonly performed invasive procedures in nursing. Proper technique is essential to minimize patient discomfort, reduce infectious complications, and ensure reliable vascular access for therapy delivery.",
    examNotes: [
      "NCLEX may test knowledge of appropriate catheter gauge selection based on clinical scenario",
      "Recognize signs and symptoms of infiltration (swelling, coolness, pallor) vs. phlebitis (erythema, warmth, pain along the vein)",
      "Know contraindications for IV insertion on specific extremities (mastectomy side, AV fistula)",
      "Understand that transparent dressings allow site assessment without removal",
    ],
    documentationRequirements: [
      "Date and time of insertion",
      "Catheter gauge and length",
      "Insertion site (anatomical location)",
      "Number of attempts",
      "Blood return confirmation and saline flush tolerance",
      "Patient tolerance and education provided",
      "Dressing applied and labeling",
    ],
    complications: [
      "Infiltration — IV fluid leaking into surrounding tissue",
      "Phlebitis — inflammation of the vein (mechanical, chemical, or bacterial)",
      "Hematoma — bruising at the insertion site",
      "Catheter-related bloodstream infection (CRBSI)",
      "Air embolism (rare with peripheral IVs)",
      "Nerve damage (rare, from improper insertion technique)",
    ],
    relatedLessonSlugs: ["iv-therapy", "fluid-management", "infection-control"],
    relatedChecklistSlugs: ["central-line-care", "blood-transfusion"],
    faqs: [
      { question: "What gauge IV catheter should I use?", answer: "Gauge selection depends on the clinical scenario: 18G for blood transfusions and rapid fluid resuscitation, 20G for most adult infusions, 22G for standard medications and elderly patients, and 24G for pediatric patients and fragile veins." },
      { question: "How often should a peripheral IV be changed?", answer: "Per CDC guidelines, peripheral IV catheters should be replaced every 72-96 hours or immediately if signs of complications (phlebitis, infiltration, infection) are present. Always follow your facility's specific policy." },
      { question: "What are the signs of IV infiltration?", answer: "Signs include swelling at or near the insertion site, skin coolness, skin pallor or tightness, decreased IV flow rate, and patient complaints of discomfort. Severe infiltration may cause tissue damage." },
    ],
    references: [
      { title: "CDC Guidelines for Prevention of Intravascular Catheter-Related Infections", url: "https://www.cdc.gov/infection-control/hcp/intravascular-catheter-related/index.html" },
      { title: "Infusion Nurses Society Standards of Practice", url: "https://www.ins1.org/" },
    ],
  },
  {
    slug: "central-line-care",
    title: "Central Line Care and Maintenance",
    shortTitle: "Central Line Care",
    category: "Vascular Access",
    difficulty: "advanced",
    estimatedTime: "20-30 minutes",
    overview: "A comprehensive guide to central venous catheter (CVC) care and maintenance. Central lines provide reliable vascular access for medications, TPN, blood products, and hemodynamic monitoring. Proper care prevents central line-associated bloodstream infections (CLABSI), a leading cause of healthcare-associated infections.",
    indications: [
      "Administration of vesicant or irritant medications",
      "Total parenteral nutrition (TPN)",
      "Long-term IV antibiotic therapy",
      "Hemodynamic monitoring (CVP)",
      "Lack of peripheral venous access",
      "Hemodialysis access",
      "Rapid volume resuscitation",
    ],
    contraindications: [
      "Care should not be performed without proper training and competency verification",
      "Do not use a catheter with visible damage or migration",
      "Avoid accessing ports if signs of infection are present at the site without physician consultation",
    ],
    equipmentNeeded: [
      "Chlorhexidine-impregnated dressing or chlorhexidine swab sticks",
      "Sterile transparent dressing kit",
      "Sterile gloves and mask",
      "Normal saline flush syringes (10 mL)",
      "Heparin flush (if per facility protocol for non-valved catheters)",
      "New needleless connectors (caps)",
      "Alcohol swab pads",
      "Sterile gauze",
      "Label and marker",
    ],
    steps: [
      { stepNumber: 1, title: "Perform Hand Hygiene and Gather Supplies", description: "Perform thorough hand hygiene. Open the dressing change kit using sterile technique. Arrange supplies on a sterile field.", rationale: "Hand hygiene is the single most important intervention to prevent CLABSI. Maintaining a sterile field prevents contamination of supplies." },
      { stepNumber: 2, title: "Apply Mask and Position the Patient", description: "Both the nurse and the patient should wear masks. Position the patient supine with their head turned away from the insertion site.", rationale: "Masks reduce airborne contamination. Head positioning prevents the patient from breathing or coughing onto the insertion site.", criticalPoint: true },
      { stepNumber: 3, title: "Remove the Old Dressing", description: "Stabilize the catheter hub with one hand. Gently remove the old dressing by peeling toward the insertion site. Note: Use non-sterile gloves for this step.", rationale: "Peeling toward the insertion site prevents accidental dislodgement. Stabilizing the hub prevents catheter migration." },
      { stepNumber: 4, title: "Assess the Insertion Site", description: "Inspect the site for signs of infection: erythema, edema, drainage, tenderness, or induration. Assess catheter length markings to confirm the catheter has not migrated.", rationale: "Early detection of infection or displacement prevents serious complications. CLABSI has a mortality rate of 12-25%.", criticalPoint: true, tips: ["If signs of infection are present, notify the physician immediately", "Document the external catheter length at each dressing change"] },
      { stepNumber: 5, title: "Don Sterile Gloves and Cleanse the Site", description: "Apply sterile gloves. Cleanse the insertion site with chlorhexidine using a back-and-forth scrubbing motion for 30 seconds. Allow to dry completely (at least 2 minutes).", rationale: "Chlorhexidine has superior antimicrobial activity against both gram-positive and gram-negative organisms. Complete drying ensures maximum bactericidal effectiveness.", criticalPoint: true },
      { stepNumber: 6, title: "Apply New Dressing", description: "Apply a chlorhexidine-impregnated dressing or transparent semipermeable dressing over the insertion site. Ensure the dressing is occlusive with no gaps or wrinkles.", rationale: "Chlorhexidine-impregnated dressings provide ongoing antimicrobial protection. An occlusive dressing creates a barrier against external contamination." },
      { stepNumber: 7, title: "Change Needleless Connectors and Flush", description: "Scrub each hub for 15 seconds with alcohol. Replace needleless connectors per facility policy (typically every 72-96 hours). Flush each lumen with 10 mL normal saline using a pulsatile push-pause technique.", rationale: "Scrubbing the hub reduces biofilm and microbial contamination (the hub is the most common source of CLABSI). Pulsatile flushing creates turbulent flow that prevents fibrin and drug buildup.", criticalPoint: true },
      { stepNumber: 8, title: "Label and Document", description: "Label the dressing with date, time, and your initials. Document the procedure including site assessment, catheter position, dressing integrity, and any complications.", rationale: "Labeling facilitates timely dressing changes. Documentation supports the central line maintenance bundle compliance monitoring." },
    ],
    safetyAlerts: [
      { type: "danger", title: "CLABSI Prevention Bundle", description: "Follow the evidence-based CLABSI prevention bundle: hand hygiene, chlorhexidine skin antisepsis, optimal catheter site selection, daily assessment of line necessity, and sterile barriers during insertion." },
      { type: "danger", title: "Never Force Flush a Central Line", description: "If resistance is met during flushing, do not force the flush. This could dislodge a clot causing an embolism. Notify the physician and consider tPA instillation per protocol." },
      { type: "warning", title: "Air Embolism Prevention", description: "Always clamp the catheter before disconnecting tubing. Position the patient in Trendelenburg if accidental disconnection occurs. Air embolism is a medical emergency." },
    ],
    nursingRationale: "Central lines provide essential vascular access but carry significant risks. CLABSI is one of the most common and costly healthcare-associated infections. Strict adherence to evidence-based maintenance bundles has been shown to reduce CLABSI rates by up to 70%.",
    examNotes: [
      "Know the components of the CLABSI prevention bundle",
      "Recognize signs and symptoms of CLABSI: fever, chills, hypotension, erythema at the site",
      "Understand air embolism prevention and emergency management (left lateral Trendelenburg)",
      "Know that the subclavian site has the lowest CLABSI risk compared to femoral and internal jugular",
    ],
    documentationRequirements: [
      "Date and time of dressing change",
      "Site assessment findings",
      "External catheter length",
      "Dressing type applied",
      "Needleless connector change",
      "Flush tolerance and blood return from each lumen",
      "Patient tolerance",
    ],
    complications: [
      "Central line-associated bloodstream infection (CLABSI)",
      "Catheter occlusion or thrombosis",
      "Air embolism",
      "Catheter migration or dislodgement",
      "Pneumothorax (insertion complication)",
      "Cardiac arrhythmias from catheter tip migration",
    ],
    relatedLessonSlugs: ["infection-control", "iv-therapy", "critical-care-nursing"],
    relatedChecklistSlugs: ["iv-insertion", "blood-transfusion"],
    faqs: [
      { question: "How often should central line dressings be changed?", answer: "Transparent dressings should be changed every 7 days, or immediately if the dressing becomes damp, loosened, or visibly soiled. Gauze dressings should be changed every 2 days." },
      { question: "What is the CLABSI prevention bundle?", answer: "The CLABSI prevention bundle includes: hand hygiene, full barrier precautions during insertion, chlorhexidine skin antisepsis, optimal catheter site selection (subclavian preferred), and daily review of line necessity with prompt removal when no longer needed." },
      { question: "What should I do if I suspect a CLABSI?", answer: "Notify the physician immediately. Obtain blood cultures (both peripheral and from the central line before antibiotics). Assess vital signs frequently. Anticipate orders for antibiotic therapy and possible catheter removal." },
    ],
    references: [
      { title: "CDC CLABSI Prevention Guidelines", url: "https://www.cdc.gov/infection-control/hcp/intravascular-catheter-related/index.html" },
      { title: "IHI Central Line Bundle", url: "https://www.ihi.org/" },
    ],
  },
  {
    slug: "wound-dressing",
    title: "Wound Dressing Change Procedure",
    shortTitle: "Wound Dressing",
    category: "Wound Management",
    difficulty: "intermediate",
    estimatedTime: "15-30 minutes",
    overview: "A systematic guide to performing wound dressing changes using aseptic technique. Proper wound care promotes healing, prevents infection, and maintains an optimal wound environment. This procedure applies to surgical wounds, pressure injuries, traumatic wounds, and chronic wounds.",
    indications: [
      "Scheduled dressing change per wound care plan",
      "Dressing soiled, saturated, or dislodged",
      "Wound assessment and monitoring",
      "Application of topical wound treatments",
      "Post-surgical wound management",
    ],
    contraindications: [
      "Do not change surgical dressings without an order (first 24-48 hours post-op are typically managed by the surgical team)",
      "Do not use wet-to-dry dressings unless specifically ordered (considered outdated practice)",
    ],
    equipmentNeeded: [
      "Clean gloves (for old dressing removal)",
      "Sterile gloves (for wound care)",
      "Sterile dressing tray or supplies",
      "Wound cleanser (normal saline or prescribed solution)",
      "Appropriate wound dressing (per wound care plan)",
      "Tape or securement",
      "Moisture barrier cream (for surrounding skin if needed)",
      "Wound measurement guide (ruler)",
      "Disposal bag",
    ],
    steps: [
      { stepNumber: 1, title: "Review the Wound Care Order and Gather Supplies", description: "Review the physician's or wound care nurse's order for specific dressing type, cleanser, and frequency. Gather all supplies and check expiration dates on sterile items.", rationale: "Following the prescribed wound care plan ensures evidence-based treatment. Expired sterile supplies may be compromised." },
      { stepNumber: 2, title: "Perform Hand Hygiene and Position the Patient", description: "Wash hands. Position the patient comfortably with adequate lighting and exposure of the wound. Maintain patient dignity and privacy.", rationale: "Proper positioning and lighting allow thorough wound assessment. Patient comfort promotes cooperation." },
      { stepNumber: 3, title: "Remove the Old Dressing", description: "Apply clean gloves. Carefully remove the old dressing, noting the amount, color, and odor of drainage. If the dressing adheres to the wound, moisten with normal saline before removal.", rationale: "Assessing drainage characteristics helps evaluate healing progress and detect infection. Moistening adherent dressings prevents disruption of new granulation tissue.", tips: ["Note: Serosanguineous drainage is normal in early healing", "Purulent drainage with odor may indicate infection — notify the physician"] },
      { stepNumber: 4, title: "Assess the Wound", description: "Measure wound length, width, and depth. Assess wound bed color (red, yellow, black), drainage type and amount, wound edges, surrounding skin condition, and signs of infection (erythema, induration, warmth, increased pain, purulent drainage).", rationale: "Systematic wound assessment guides treatment decisions and tracks healing progress. Early detection of infection prevents systemic complications.", criticalPoint: true, tips: ["Use the wound clock method: 12 o'clock = toward the head", "Document undermining and tunneling with clock positions and depth"] },
      { stepNumber: 5, title: "Cleanse the Wound", description: "Remove soiled gloves, perform hand hygiene, and don sterile gloves. Irrigate the wound with normal saline or prescribed cleanser using gentle pressure. Clean from the center outward or from least contaminated to most contaminated areas.", rationale: "Irrigating from clean to dirty prevents cross-contamination. Gentle pressure (4-15 PSI) effectively removes debris without damaging tissue.", criticalPoint: true },
      { stepNumber: 6, title: "Apply the Prescribed Dressing", description: "Apply any ordered topical medications or wound fillers. Place the primary dressing directly on the wound bed. Apply a secondary dressing for absorption if needed. Secure with tape or securement without tension.", rationale: "The primary dressing creates the optimal wound healing environment (moist wound healing). The secondary dressing absorbs excess drainage and protects the wound." },
      { stepNumber: 7, title: "Document the Procedure", description: "Document wound location, measurements (LxWxD), wound bed characteristics, drainage type and amount, surrounding skin assessment, treatment applied, and patient response including pain level.", rationale: "Thorough documentation enables tracking of wound healing progress and facilitates communication among the healthcare team." },
    ],
    safetyAlerts: [
      { type: "warning", title: "Infection Monitoring", description: "Report any signs of wound infection immediately: increasing erythema, warmth, edema, purulent or malodorous drainage, fever, or increasing pain. Wound infection can lead to sepsis." },
      { type: "info", title: "Moist Wound Healing", description: "Current evidence supports maintaining a moist wound environment for optimal healing. Avoid letting wounds dry out unless specifically ordered. Moist conditions promote cell migration, angiogenesis, and autolytic debridement." },
      { type: "warning", title: "Pain Management", description: "Administer prescribed analgesics 30 minutes before dressing changes for painful wounds. Use non-adherent dressings to minimize pain during removal." },
    ],
    nursingRationale: "Wound dressing changes are a core nursing skill requiring both technical proficiency and clinical judgment. Proper technique promotes healing, prevents healthcare-associated infections, and reduces patient suffering. Evidence-based wound care has been shown to reduce healing time by up to 50%.",
    examNotes: [
      "Know wound color classification: red (granulation — protect), yellow (slough — cleanse), black (eschar — debride)",
      "Understand the principles of moist wound healing",
      "Recognize signs of wound infection vs. normal inflammatory response",
      "Know the difference between primary, secondary, and tertiary wound closure",
      "Pressure injury staging (Stage 1-4, unstageable, deep tissue injury)",
    ],
    documentationRequirements: [
      "Date, time, and frequency of dressing change",
      "Wound location and type",
      "Wound measurements (L x W x D in cm)",
      "Wound bed description (granulation, slough, eschar, epithelialization)",
      "Drainage type, color, odor, and amount",
      "Surrounding skin condition",
      "Treatment applied",
      "Pain assessment before, during, and after",
      "Patient education provided",
    ],
    complications: [
      "Wound infection (local or systemic)",
      "Delayed wound healing",
      "Wound dehiscence (surgical wounds)",
      "Maceration of surrounding skin from excess moisture",
      "Contact dermatitis from tape or dressing materials",
      "Bleeding during dressing change",
    ],
    relatedLessonSlugs: ["wound-care", "infection-control", "surgical-nursing"],
    relatedChecklistSlugs: ["iv-insertion", "central-line-care"],
    faqs: [
      { question: "How often should wound dressings be changed?", answer: "Dressing change frequency depends on the wound type, drainage amount, and specific dressing used. Follow the wound care order — typically every 1-3 days for most wound dressings. Change immediately if the dressing becomes saturated, soiled, or dislodged." },
      { question: "What type of wound dressing should I use?", answer: "Dressing selection depends on the wound characteristics: foam dressings for moderate-to-high drainage, hydrocolloids for low-drainage partial-thickness wounds, alginate dressings for heavily draining wounds, and transparent films for superficial or skin tears." },
      { question: "When should I notify the physician about a wound?", answer: "Notify when: there are signs of infection, wound size is increasing, new tunneling or undermining develops, wound bed deterioration occurs, excessive or change in drainage character, or the patient develops systemic symptoms like fever." },
    ],
    references: [
      { title: "Wound, Ostomy and Continence Nurses Society Guidelines", url: "https://www.wocn.org/" },
      { title: "National Pressure Injury Advisory Panel", url: "https://npiap.com/" },
    ],
  },
  {
    slug: "oxygen-therapy-setup",
    title: "Oxygen Therapy Setup and Management",
    shortTitle: "Oxygen Therapy",
    category: "Respiratory",
    difficulty: "beginner",
    estimatedTime: "10-15 minutes",
    overview: "A comprehensive guide to setting up and managing supplemental oxygen therapy. This fundamental nursing skill ensures patients with hypoxemia receive appropriate oxygen delivery. Covers device selection, flow rate settings, monitoring parameters, and safety considerations.",
    indications: [
      "SpO2 below 94% in most patients (or below 88% in COPD patients)",
      "Acute respiratory distress or dyspnea",
      "Post-operative care",
      "Cardiac emergencies (MI, heart failure)",
      "Carbon monoxide poisoning (100% O2)",
      "Trauma and shock",
      "During procedural sedation",
    ],
    contraindications: [
      "Use caution with COPD patients — high-flow oxygen may suppress hypoxic respiratory drive (maintain SpO2 88-92%)",
      "Paraquat poisoning (oxygen may increase toxicity)",
    ],
    equipmentNeeded: [
      "Oxygen source (wall outlet or portable tank)",
      "Flow meter",
      "Appropriate oxygen delivery device",
      "Humidification bottle (for flow rates >4 L/min)",
      "Pulse oximeter",
      "No Smoking signs",
      "Nasal cannula, simple mask, Venturi mask, or non-rebreather mask",
    ],
    steps: [
      { stepNumber: 1, title: "Verify the Oxygen Order", description: "Review the physician's order for oxygen delivery method, flow rate (L/min), target SpO2, and duration. Clarify any unclear orders before proceeding.", rationale: "Oxygen is considered a medication and requires a physician order. Correct delivery parameters ensure therapeutic benefit and patient safety.", criticalPoint: true },
      { stepNumber: 2, title: "Assess the Patient", description: "Assess respiratory status: respiratory rate, depth, pattern, SpO2, skin color, accessory muscle use, mental status, and lung sounds. Note baseline vital signs.", rationale: "Baseline assessment establishes the severity of hypoxemia and provides comparison data for evaluating therapy effectiveness." },
      { stepNumber: 3, title: "Select the Appropriate Delivery Device", description: "Choose the delivery device based on the ordered flow rate and FiO2:\n- Nasal cannula: 1-6 L/min (FiO2 24-44%)\n- Simple face mask: 6-10 L/min (FiO2 40-60%)\n- Venturi mask: precise FiO2 delivery (24-50%)\n- Non-rebreather mask: 10-15 L/min (FiO2 80-95%)\n- High-flow nasal cannula: up to 60 L/min", rationale: "Device selection matches the level of oxygen support needed. Nasal cannula is best for mild hypoxemia; non-rebreather masks are for severe hypoxemia requiring high FiO2.", tips: ["Simple face masks must run at minimum 5 L/min to prevent CO2 rebreathing", "Non-rebreather bags must be fully inflated before placing on the patient"] },
      { stepNumber: 4, title: "Set Up the Equipment", description: "Connect the flow meter to the oxygen source. Attach humidification if flow rate exceeds 4 L/min. Connect the oxygen tubing to the delivery device. Set the flow rate to the ordered level.", rationale: "Humidification prevents drying and irritation of nasal and oral mucosa at higher flow rates. Dry oxygen can cause nosebleeds, sore throat, and patient discomfort.", criticalPoint: true },
      { stepNumber: 5, title: "Apply the Delivery Device", description: "Place the device on the patient. For nasal cannula: insert prongs into nares, curve up, and loop tubing over ears. For masks: place over the nose and mouth, adjust the metal nose clip, and tighten the elastic strap for a secure fit.", rationale: "Proper fit ensures effective oxygen delivery and patient comfort. Loose masks allow room air entrainment, reducing effective FiO2." },
      { stepNumber: 6, title: "Verify Oxygen Flow and Monitor the Patient", description: "Confirm oxygen is flowing by checking the flow meter and feeling for air flow from the device. Monitor SpO2 continuously or per orders. Reassess respiratory status within 15-30 minutes.", rationale: "Initial monitoring confirms the therapy is effective. SpO2 should improve within minutes of starting oxygen therapy.", criticalPoint: true, tips: ["If SpO2 does not improve, reassess the device placement and patient condition", "Notify the physician if target SpO2 is not achieved"] },
      { stepNumber: 7, title: "Ensure Safety Measures", description: "Post 'No Smoking' and 'Oxygen in Use' signs. Remove potential ignition sources from the room. Educate the patient and family about oxygen safety.", rationale: "Oxygen supports combustion and significantly increases fire risk. Oxygen-enriched environments can cause rapid fire spread.", criticalPoint: true },
      { stepNumber: 8, title: "Document the Procedure", description: "Document the oxygen delivery device, flow rate, patient's SpO2 before and after initiation, respiratory assessment findings, patient tolerance, and education provided.", rationale: "Documentation supports continuity of care and provides a record of the patient's response to therapy." },
    ],
    safetyAlerts: [
      { type: "danger", title: "Fire Safety", description: "Oxygen is an accelerant — it does not burn itself but dramatically increases fire risk. Ensure no open flames, smoking, or electrical sparks near oxygen equipment. Post appropriate signage." },
      { type: "warning", title: "COPD Patients", description: "In patients with chronic CO2 retention (COPD), high-flow oxygen can suppress the hypoxic respiratory drive. Maintain SpO2 at 88-92% and monitor for signs of CO2 narcosis (somnolence, confusion, headache)." },
      { type: "info", title: "Humidification", description: "Apply humidification for flow rates above 4 L/min to prevent mucosal drying. Monitor humidification water levels and replace as needed." },
    ],
    nursingRationale: "Oxygen therapy is a first-line intervention for hypoxemia and one of the most commonly administered treatments in acute care. Understanding device selection, flow rates, and monitoring parameters is essential for safe and effective patient care.",
    examNotes: [
      "Know the FiO2 ranges for each oxygen delivery device",
      "Understand why COPD patients require controlled low-flow oxygen (hypoxic drive theory)",
      "Non-rebreather mask delivers the highest FiO2 of basic oxygen devices",
      "Simple face masks require a minimum of 5 L/min to prevent CO2 rebreathing",
      "Oxygen is considered a medication and requires an order",
    ],
    documentationRequirements: [
      "Oxygen delivery device type",
      "Flow rate in L/min",
      "SpO2 before and after therapy initiation",
      "Respiratory rate and pattern",
      "Patient tolerance and comfort",
      "Safety measures implemented",
      "Patient and family education provided",
    ],
    complications: [
      "Oxygen toxicity (prolonged high FiO2 >60%)",
      "CO2 narcosis in COPD patients",
      "Nasal mucosal drying and epistaxis",
      "Skin breakdown from device straps",
      "Absorption atelectasis",
      "Fire hazard",
    ],
    relatedLessonSlugs: ["respiratory-assessment", "copd-management", "oxygen-therapy"],
    relatedChecklistSlugs: ["iv-insertion", "blood-transfusion"],
    faqs: [
      { question: "What is a normal SpO2 level?", answer: "Normal SpO2 is 95-100% in healthy adults. For COPD patients, the target is typically 88-92%. An SpO2 below 90% is considered hypoxemia and requires intervention." },
      { question: "What is the difference between a nasal cannula and a face mask?", answer: "A nasal cannula delivers 1-6 L/min (FiO2 24-44%) and is suitable for mild hypoxemia. It allows eating and talking. A simple face mask delivers 6-10 L/min (FiO2 40-60%) for moderate hypoxemia but must run at a minimum of 5 L/min." },
      { question: "Why do COPD patients need lower oxygen levels?", answer: "Some COPD patients rely on low oxygen levels (hypoxic drive) to stimulate breathing. Giving too much oxygen can suppress this drive, leading to CO2 retention, respiratory depression, and CO2 narcosis." },
    ],
    references: [
      { title: "British Thoracic Society Guidelines for Oxygen Use", url: "https://www.brit-thoracic.org.uk/" },
      { title: "American Association for Respiratory Care Clinical Practice Guidelines", url: "https://www.aarc.org/" },
    ],
  },
  {
    slug: "blood-transfusion",
    title: "Blood Transfusion Procedure",
    shortTitle: "Blood Transfusion",
    category: "Transfusion",
    difficulty: "advanced",
    estimatedTime: "2-4 hours",
    overview: "A detailed procedural guide for administering blood products safely. Blood transfusion is a high-risk procedure requiring strict adherence to verification protocols to prevent potentially fatal transfusion reactions. This guide covers packed red blood cells (PRBCs), but principles apply to all blood product administration.",
    indications: [
      "Acute blood loss (hemorrhage, surgery)",
      "Symptomatic anemia (hemoglobin <7 g/dL, or <8 g/dL with cardiac disease)",
      "Sickle cell crisis",
      "Coagulation factor replacement",
      "Thrombocytopenia with active bleeding",
    ],
    contraindications: [
      "Patient refusal (including religious beliefs — Jehovah's Witnesses)",
      "Known severe reaction to blood products without premedication protocol",
      "Volume overload in patients who cannot tolerate additional fluid (relative — may use diuretics)",
    ],
    equipmentNeeded: [
      "Blood product (verified from blood bank)",
      "Blood administration set with 170-260 micron filter",
      "0.9% Normal Saline (the ONLY compatible IV solution)",
      "Large-bore IV catheter (18-20 gauge preferred)",
      "Blood warmer (if ordered, for rapid transfusion or hypothermia risk)",
      "Vital signs equipment",
      "Patient identification band and blood bank wristband",
      "Transfusion consent form",
    ],
    steps: [
      { stepNumber: 1, title: "Verify the Order and Obtain Consent", description: "Review the physician's order for blood product type, number of units, rate, and any premedications (acetaminophen, diphenhydramine). Verify the patient has signed a transfusion consent form. Administer premedications if ordered.", rationale: "Informed consent is required for blood transfusion. Premedications reduce the risk of febrile and allergic transfusion reactions." },
      { stepNumber: 2, title: "Obtain Baseline Vital Signs", description: "Record temperature, blood pressure, heart rate, respiratory rate, and SpO2 before the transfusion begins. Note any pre-existing symptoms (fever, chills, itching).", rationale: "Baseline vital signs provide comparison data for detecting transfusion reactions. A temperature >38°C (100.4°F) pre-transfusion should be reported to the physician.", criticalPoint: true },
      { stepNumber: 3, title: "Verify Blood Product at Bedside (Two-Nurse Verification)", description: "With a second qualified nurse at the bedside, verify: patient identity using two identifiers (name and date of birth/MRN), blood type and Rh factor compatibility, unit number matching the blood bank slip, expiration date and time, and visual inspection for abnormalities (clots, discoloration, leaks).", rationale: "Two-nurse bedside verification is the most critical safety step. Mismatched blood transfusion is the leading cause of fatal transfusion reactions and is ALWAYS preventable.", criticalPoint: true, tips: ["NEVER skip the two-nurse verification — this is a non-negotiable safety standard", "If ANY discrepancy is found, do NOT hang the blood — return it to the blood bank"] },
      { stepNumber: 4, title: "Prime the Blood Administration Set", description: "Using aseptic technique, spike the blood bag with the blood administration set (Y-set with inline filter). Prime the tubing with 0.9% Normal Saline. NEVER use Lactated Ringer's, dextrose, or any other solution — they cause hemolysis or clotting.", rationale: "The 170-260 micron filter in the blood set traps clots and debris. Normal saline is the only compatible solution; other solutions can destroy red blood cells or cause clotting in the tubing.", criticalPoint: true },
      { stepNumber: 5, title: "Begin the Transfusion Slowly", description: "Start the transfusion at a slow rate (2 mL/min or per facility protocol) for the first 15 minutes. Remain at the bedside during this critical period. Observe for any signs of transfusion reaction.", rationale: "Most severe transfusion reactions occur within the first 15 minutes. A slow initial rate limits the volume of incompatible blood administered if a reaction occurs.", criticalPoint: true },
      { stepNumber: 6, title: "Monitor Vital Signs", description: "Recheck vital signs at 15 minutes after starting the transfusion. Continue monitoring per facility policy (typically every 30 minutes during transfusion and after completion). Compare all readings to baseline.", rationale: "Vital sign changes may be the first indicator of a transfusion reaction. Fever, tachycardia, hypotension, or hypertension warrant immediate intervention." },
      { stepNumber: 7, title: "Increase Rate and Complete Transfusion", description: "If no reaction occurs after 15 minutes, increase the rate to the ordered infusion rate. Each unit of PRBCs must be completed within 4 hours of removal from blood bank to prevent bacterial contamination.", rationale: "The 4-hour window prevents bacterial proliferation in blood products stored at room temperature. Blood left out >30 minutes cannot be returned to the blood bank.", criticalPoint: true },
      { stepNumber: 8, title: "Post-Transfusion Assessment and Documentation", description: "After the transfusion is complete, flush the line with normal saline. Obtain post-transfusion vital signs. Document: blood product administered, unit number, start and end times, total volume infused, vital signs throughout, patient response, and any adverse reactions.", rationale: "Post-transfusion documentation provides a complete record for quality tracking and enables detection of delayed transfusion reactions (which can occur hours to days later)." },
    ],
    safetyAlerts: [
      { type: "danger", title: "Signs of Acute Hemolytic Reaction", description: "STOP the transfusion immediately if the patient develops: fever, chills, flank or back pain, chest tightness, dark (cola-colored) urine, hypotension, or tachycardia. This is a medical emergency. Disconnect the blood, keep the IV open with NS, and notify the physician and blood bank immediately." },
      { type: "danger", title: "Never Add Medications to Blood Products", description: "No medications should ever be added to or infused through the same line as blood products (except normal saline). Medications can interact with blood components and cause hemolysis or other reactions." },
      { type: "warning", title: "TACO vs. TRALI", description: "Transfusion-associated circulatory overload (TACO) presents with hypertension, dyspnea, and pulmonary edema — slow the rate and administer diuretics. Transfusion-related acute lung injury (TRALI) presents with acute respiratory distress, hypotension, and bilateral pulmonary infiltrates within 6 hours — this requires ICU care." },
      { type: "info", title: "4-Hour Rule", description: "Each unit of blood must be completed within 4 hours of issue from the blood bank. If the transfusion cannot be completed in time, contact the blood bank. Never refrigerate blood on the nursing unit." },
    ],
    nursingRationale: "Blood transfusion is a high-risk, high-consequence procedure. Errors in blood administration are preventable and are considered 'never events.' Strict adherence to verification protocols, monitoring timelines, and reaction management procedures is non-negotiable for patient safety.",
    examNotes: [
      "The ONLY IV solution compatible with blood products is 0.9% Normal Saline",
      "Two-nurse bedside verification is mandatory before every blood transfusion",
      "Most severe transfusion reactions occur in the first 15 minutes",
      "If a reaction occurs: STOP the transfusion, keep the IV open with NS, notify the physician and blood bank",
      "Each unit must be completed within 4 hours of issue from the blood bank",
      "Know the difference between TACO (fluid overload) and TRALI (lung injury)",
    ],
    documentationRequirements: [
      "Two-nurse verification (both nurses' signatures)",
      "Consent verification",
      "Blood product type and unit number",
      "Start and end times",
      "Vital signs: baseline, 15 min, q30min during, and post-transfusion",
      "Total volume infused",
      "Any adverse reactions and interventions",
      "Patient response and tolerance",
    ],
    complications: [
      "Acute hemolytic transfusion reaction (ABO incompatibility)",
      "Febrile non-hemolytic transfusion reaction",
      "Allergic reaction (urticaria to anaphylaxis)",
      "Transfusion-associated circulatory overload (TACO)",
      "Transfusion-related acute lung injury (TRALI)",
      "Bacterial contamination and sepsis",
      "Delayed hemolytic reaction (days to weeks later)",
      "Hyperkalemia (in massive transfusion)",
    ],
    relatedLessonSlugs: ["blood-transfusion", "hematology", "emergency-nursing"],
    relatedChecklistSlugs: ["iv-insertion", "central-line-care"],
    faqs: [
      { question: "Why can only normal saline be used with blood products?", answer: "Normal saline (0.9% NaCl) is isotonic and does not interact with blood components. Lactated Ringer's contains calcium which can cause clotting. Dextrose solutions can cause hemolysis (destruction of red blood cells)." },
      { question: "What should I do if I suspect a transfusion reaction?", answer: "Immediately: 1) STOP the transfusion, 2) Keep the IV open with normal saline, 3) Stay with the patient and assess vitals, 4) Notify the physician, 5) Notify the blood bank, 6) Save the blood bag and tubing for testing, 7) Obtain blood and urine samples as ordered." },
      { question: "How fast should blood be transfused?", answer: "Start slowly (2 mL/min) for the first 15 minutes while monitoring for reactions. Then increase to the ordered rate. A typical unit of PRBCs takes 1.5-2 hours. Each unit must be completed within 4 hours." },
    ],
    references: [
      { title: "AABB Standards for Blood Banks and Transfusion Services", url: "https://www.aabb.org/" },
      { title: "CDC Blood Safety Information", url: "https://www.cdc.gov/blood-safety/" },
    ],
  },
];

export function getChecklistBySlug(slug: string): NursingSkillChecklist | undefined {
  return nursingSkillChecklists.find(c => c.slug === slug);
}

export function getChecklistsByCategory(category: ChecklistCategory | null): NursingSkillChecklist[] {
  if (!category) return nursingSkillChecklists;
  return nursingSkillChecklists.filter(c => c.category === category);
}

export function getRelatedChecklists(slug: string, limit = 4): NursingSkillChecklist[] {
  const current = getChecklistBySlug(slug);
  if (!current) return [];
  const related = current.relatedChecklistSlugs
    .map(s => getChecklistBySlug(s))
    .filter((c): c is NursingSkillChecklist => !!c);
  const sameCategory = nursingSkillChecklists
    .filter(c => c.slug !== slug && c.category === current.category && !current.relatedChecklistSlugs.includes(c.slug));
  return [...related, ...sameCategory].slice(0, limit);
}
