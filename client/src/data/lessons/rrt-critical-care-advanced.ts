import type { LessonContent } from "./types";

export const rrtCriticalCareAdvancedLessons: Record<string, LessonContent> = {
  "prone-positioning-recruitment-rrt": {
    title: "Prone Positioning & Recruitment Maneuvers",
    cellular: `Prone positioning and recruitment maneuvers are advanced ventilatory strategies used in moderate-to-severe ARDS to improve oxygenation, redistribute ventilation and perfusion, and reduce mortality. Respiratory therapists are central to implementing these interventions safely and effectively.

Prone positioning involves turning the mechanically ventilated patient from supine to face-down (prone) position. The physiological benefits are multifactorial: (1) Redistribution of ventilation — in the supine position, dependent (dorsal) lung regions are compressed by the heart, mediastinal structures, and abdominal contents, promoting atelectasis. Turning prone redistributes these gravitational forces, allowing previously dependent regions to recruit while the now-dependent ventral regions (which have less tissue mass overlying them) maintain aeration. (2) Improved V/Q matching — perfusion is relatively gravity-independent and remains preferentially directed to the dorsal lung regions. When the patient is turned prone, ventilation is redistributed dorsally where perfusion is highest, improving V/Q matching. (3) More uniform pleural pressure gradient — prone positioning creates a more homogeneous pleural pressure distribution, leading to more uniform alveolar recruitment and reducing the "baby lung" zones of overdistention adjacent to collapsed areas. (4) Improved secretion drainage — gravitational drainage of secretions from dorsal lung segments.

The PROSEVA trial (2013) is the landmark study demonstrating mortality benefit: early prone positioning (within 36 hours of ARDS onset) for ≥16 hours/day in moderate-to-severe ARDS (P/F <150 on FiO2 ≥0.60 and PEEP ≥5 cmH2O) reduced 28-day mortality from 32.8% to 16.0% — a number needed to treat (NNT) of 6. This is one of the most impactful interventions in ARDS management.

Indications for prone positioning: P/F ratio <150 with FiO2 ≥0.60 and PEEP ≥5 cmH2O despite 12-24 hours of optimal conventional ventilation. Continue prone positioning for ≥16 consecutive hours per session. Discontinue when P/F >150 on FiO2 ≤0.60 and PEEP ≤10 cmH2O in the supine position (measured 4 hours after returning supine).

Recruitment maneuvers (RMs) are transient increases in transpulmonary pressure intended to open collapsed alveoli. Types include: (1) Sustained inflation: 30-40 cmH2O for 30-40 seconds; (2) Incremental PEEP trial (staircase maneuver): PEEP increased in steps of 3-5 cmH2O every 2-3 minutes while monitoring compliance and oxygenation, then decreased incrementally to identify the optimal PEEP (point of best compliance). Recent evidence (ART trial, 2017) suggests routine recruitment maneuvers with high PEEP may increase mortality in ARDS — use judiciously and with careful hemodynamic monitoring.

US Protocol Notes (NBRC): Prone positioning in ARDS is increasingly tested on NBRC exams. Key concepts include the PROSEVA criteria (P/F <150), the 16-hour minimum duration, the mortality benefit, and contraindications. Recruitment maneuvers are less commonly tested but understanding the concept of opening collapsed alveoli is important.

Canadian Protocol Notes (CBRC): Canadian ICUs have widely adopted prone positioning following PROSEVA. Canadian guidelines follow the same criteria. Canadian RTs should be familiar with the team-based approach to safe proning, including coordination with nursing, physiotherapy, and medical staff.`,
    riskFactors: [
      "Accidental extubation during proning maneuver — the most feared complication; secure all lines and ETT",
      "Pressure injuries: facial (forehead, chin, cheeks), chest, and anterior shoulder pressure points",
      "Hemodynamic instability during position change — transient hypotension from venous pooling shifts",
      "Loss of vascular access: arterial lines, central lines, and dialysis catheters can dislodge",
      "Enteral feeding intolerance: increased gastric residuals and aspiration risk in prone position",
      "Facial and periorbital edema from prolonged prone positioning (gravity-dependent)",
      "Brachial plexus injury from improper arm positioning during prone",
      "Cardiac arrhythmias during position change — vagal stimulation",
      "Recruitment maneuver complications: hemodynamic collapse from increased intrathoracic pressure, pneumothorax"
    ],
    diagnostics: [
      "P/F ratio assessment: calculate before and 1-2 hours after proning to evaluate response",
      "ABG before and 1-2 hours after prone initiation — P/F improvement >20% indicates positive response",
      "Hemodynamic monitoring during position change: MAP, HR, CVP trending",
      "Ventilator waveform analysis: assess compliance changes after recruitment maneuver",
      "SpO2 monitoring: continuous — observe for desaturation during position change (brief is expected)",
      "Chest X-ray: assess for ETT position after proning (may migrate with position change)",
      "Static compliance measurement (Cstat = VT / [Pplat - PEEP]) before and after recruitment maneuver to identify optimal PEEP"
    ],
    management: [
      "Initiate prone positioning early (within 36 hours of ARDS onset) for P/F <150 with FiO2 ≥0.60, PEEP ≥5",
      "Maintain prone position for ≥16 consecutive hours per session (PROSEVA protocol)",
      "Team-based proning: minimum 4-5 staff members; one dedicated to securing ETT and head positioning",
      "Pre-proning checklist: secure all lines/tubes, verify ETT position, suction ETT, hold enteral feeds 1 hour before",
      "Post-proning assessment: verify ETT position (bilateral breath sounds, ETCO2), check all lines, assess hemodynamics",
      "Arm positioning: swimmer's position alternating q2h to prevent brachial plexus injury",
      "Recruitment maneuver (if used): incremental PEEP in 3-5 cmH2O steps q2-3 min to 35-40 cmH2O, then decremental to find optimal PEEP",
      "Discontinue prone when sustained P/F >150 on FiO2 ≤0.60 and PEEP ≤10 in supine (check 4 hours after supination)"
    ],
    nursingActions: [
      "Coordinate prone positioning with full team: RT (secures ETT and manages ventilator), nurses, and additional staff",
      "Pre-proning: suction ETT, verify cuff pressure, note ETT depth, pause enteral feeds, apply eye lubrication and tape eyes closed",
      "During turn: one person dedicated to maintaining ETT and head in alignment; synchronized team movement on count of three",
      "Post-proning: verify ETT position (bilateral breath sounds, ETCO2 waveform), check arterial line waveform, assess all vascular access",
      "Position face in padded headrest with eyes free from pressure — check eye position every 2 hours",
      "Alternate arm position (swimmer's position) every 2 hours to prevent brachial plexus injury",
      "Assess pressure points (forehead, chin, chest, hips, knees) and provide padding every 2 hours",
      "Document turn times, ABG response, and complications — communicate P/F ratio trend to medical team"
    ],
    signs: [
      "Positive prone response: improved P/F ratio (>20% improvement), decreased FiO2 requirement, improved SpO2",
      "Persistent responder: oxygenation improvement maintained after returning supine — lung recruitment is sustained",
      "Non-responder: no improvement in P/F ratio after 1-2 hours of prone positioning — consider ECMO evaluation",
      "Hemodynamic instability during proning: transient hypotension (usually resolves within minutes); sustained hypotension requires evaluation",
      "Pressure injury development: skin breakdown on face, chest, anterior pelvis despite preventive measures",
      "ETT complications: unplanned extubation, ETT migration, cuff leak — all require immediate assessment and intervention"
    ],
    medications: [
      { name: "Cisatracurium", dose: "0.15 mg/kg bolus then 1-3 mcg/kg/min infusion", route: "Intravenous", purpose: "Neuromuscular blockade often used concurrently with prone positioning in severe ARDS to prevent dyssynchrony and patient-generated lung injury" },
      { name: "Propofol", dose: "5-80 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Deep sedation during prone positioning — adequate sedation prevents agitation-induced complications during proning" },
      { name: "Fentanyl", dose: "25-200 mcg/hr IV infusion", route: "Intravenous", purpose: "Analgesia during prone positioning — facial pressure points and position create discomfort" }
    ],
    pearls: [
      "PROSEVA trial: prone positioning ≥16 hours/day in moderate-severe ARDS reduced mortality from 32.8% to 16% — NNT of 6; one of the most impactful interventions in critical care",
      "The most feared complication of prone positioning is accidental extubation — dedicate one team member solely to securing the ETT during the turn",
      "P/F ratio improvement should be assessed 1-2 hours after proning; if no response, the patient may need ECMO evaluation",
      "Prone positioning works by redistributing ventilation to match the relatively gravity-independent perfusion pattern — NOT by draining secretions (though this helps)",
      "The ART trial showed harm from aggressive recruitment maneuvers with high PEEP in ARDS — use RMs judiciously with hemodynamic monitoring",
      "Prone positioning improves mortality in ARDS; recruitment maneuvers improve oxygenation but have NOT shown mortality benefit"
    ],
    preTest: [
      { question: "What P/F ratio threshold triggers consideration of prone positioning in ARDS?", options: ["P/F <300", "P/F <200", "P/F <150 with FiO2 ≥0.60 and PEEP ≥5", "P/F <50"], correct: 2, rationale: "PROSEVA criteria: P/F <150 on FiO2 ≥0.60 and PEEP ≥5 cmH2O despite 12-24 hours of optimal conventional ventilation." },
      { question: "What is the recommended minimum duration of prone positioning per session?", options: ["4 hours", "8 hours", "16 hours", "24 hours continuous"], correct: 2, rationale: "The PROSEVA trial used ≥16 consecutive hours of prone positioning per session, demonstrating significant mortality benefit." }
    ],
    postTest: [
      { question: "After 2 hours of prone positioning, a patient's P/F ratio has improved from 85 to 165. When should prone positioning be discontinued?", options: ["Immediately since P/F is now >150", "When P/F >150 on FiO2 ≤0.60 and PEEP ≤10 measured 4 hours after returning SUPINE", "After exactly 16 hours regardless of P/F", "When the patient requests it"], correct: 1, rationale: "Prone positioning is discontinued when the patient maintains P/F >150 on FiO2 ≤0.60 and PEEP ≤10 in the SUPINE position, assessed 4 hours after turning supine. Improvement while prone does not mean the patient can sustain improvement supine." },
      { question: "What is the primary mechanism by which prone positioning improves oxygenation in ARDS?", options: ["Improved secretion drainage", "Redistribution of ventilation to match perfusion (improved V/Q matching)", "Increased cardiac output", "Reduced work of breathing"], correct: 1, rationale: "Prone positioning redistributes ventilation toward the dorsal lung regions where perfusion is highest (perfusion is relatively gravity-independent), dramatically improving V/Q matching. This is the primary mechanism; secretion drainage is a secondary benefit." }
    ],
    quiz: [
      { question: "What was the mortality reduction in the PROSEVA trial with early prone positioning in moderate-severe ARDS?", options: ["From 50% to 40% (10% absolute reduction)", "From 32.8% to 16% (16.8% absolute reduction, NNT 6)", "From 25% to 20% (5% absolute reduction)", "No mortality benefit was demonstrated"], correct: 1, rationale: "PROSEVA demonstrated a dramatic mortality reduction from 32.8% to 16.0% with early prone positioning ≥16 hours/day in moderate-to-severe ARDS — an NNT of approximately 6, making it one of the most effective interventions in ARDS management." },
      { question: "What is the most feared complication during the prone positioning maneuver?", options: ["Facial edema", "Pressure injury", "Accidental extubation", "Hemodynamic instability"], correct: 2, rationale: "Accidental extubation during the proning maneuver is the most feared complication. One team member should be exclusively dedicated to securing the ETT and managing the head during the turn." },
      { question: "Which trial demonstrated potential HARM from aggressive recruitment maneuvers in ARDS?", options: ["PROSEVA trial", "ART trial", "ARDS Network trial", "ACURASYS trial"], correct: 1, rationale: "The ART trial (2017) showed that routine recruitment maneuvers with titrated PEEP increased mortality compared to a low PEEP strategy in ARDS patients. This tempered enthusiasm for aggressive recruitment maneuvers." }
    ]
  },

  "ards-protocols-advanced-rrt": {
    title: "ARDS Protocols: Advanced Strategies",
    cellular: `Acute respiratory distress syndrome (ARDS) management has evolved significantly since the landmark ARDS Network ARMA trial (2000). This lesson covers the current evidence-based protocolized approach to ARDS, integrating lung-protective ventilation, PEEP optimization, adjunctive therapies, and the RT's role in protocol implementation.

The Berlin Definition (2012) classifies ARDS by severity: Mild (P/F 200-300 on PEEP ≥5), Moderate (P/F 100-200 on PEEP ≥5), and Severe (P/F <100 on PEEP ≥5). Additional criteria: acute onset within 1 week of clinical insult, bilateral opacities on CXR/CT not fully explained by effusions/atelectasis/nodules, and respiratory failure not fully explained by cardiac failure or fluid overload.

The ARDSNet protocol (ARMA trial) established lung-protective ventilation as the standard of care: VT 6 mL/kg IBW (range 4-8 mL/kg), Pplat ≤30 cmH2O, pH goal 7.30-7.45, with permissive hypercapnia to pH floor of 7.15. This strategy reduced mortality from 39.8% to 31% — a 22% relative reduction.

PEEP optimization strategies: (1) ARDSNet PEEP-FiO2 tables (low and high PEEP approaches): systematic pairing of PEEP and FiO2 levels; (2) Best compliance PEEP titration: decremental PEEP trial after recruitment maneuver, selecting the PEEP level with the best static compliance; (3) Esophageal pressure-guided PEEP (EPVent-2): using esophageal balloon catheter to estimate transpulmonary pressure and set PEEP to maintain positive end-expiratory transpulmonary pressure. No single PEEP strategy has proven superior for mortality.

Driving pressure (DP = Pplat - PEEP) has emerged as the ventilator variable most strongly associated with ARDS mortality (Amato et al., 2015 NEJM meta-analysis). Driving pressure <15 cmH2O is the target. Importantly, DP is the only ventilator variable where changes (increases in PEEP or decreases in VT) that reduced DP were associated with improved survival. This has shifted the PEEP optimization paradigm: increases in PEEP are only beneficial if they reduce driving pressure (i.e., the recruited lung volume exceeds the PEEP increase, improving compliance).

Adjunctive therapies in ARDS: (1) Prone positioning (PROSEVA: P/F <150, ≥16 hours/day); (2) Neuromuscular blockade (ACURASYS: cisatracurium 48 hours in severe ARDS, though ROSE trial showed conflicting results); (3) Conservative fluid strategy (FACTT trial: conservative fluid management improved oxygenation and reduced ventilator days vs liberal strategy); (4) Corticosteroids (dexamethasone in COVID-ARDS [RECOVERY trial] reduced mortality; role in non-COVID ARDS remains debated).

US Protocol Notes (NBRC): ARDSNet protocol, lung-protective ventilation, PEEP-FiO2 tables, driving pressure, and the Berlin definition are all heavily tested on TMC and CSE. Understanding the evidence hierarchy (VT 6 mL/kg, Pplat <30, driving pressure <15) and being able to apply ARDSNet PEEP tables is essential.

Canadian Protocol Notes (CBRC): Canadian ICUs follow ARDSNet protocol with Canadian Thoracic Society endorsement. PROSEVA-based prone positioning has been widely adopted. Canadian guidelines emphasize the same evidence base for ARDS management. RTs in Canadian practice should be familiar with the driving pressure concept and its application in bedside PEEP titration.`,
    riskFactors: [
      "Sepsis — most common cause of ARDS (40% of cases)",
      "Pneumonia — second most common cause; bacterial, viral (COVID-19, influenza), and fungal",
      "Aspiration of gastric contents — chemical pneumonitis progressing to ARDS",
      "Trauma with massive transfusion — transfusion-related acute lung injury (TRALI)",
      "Pancreatitis — systemic inflammatory response with pulmonary involvement",
      "Near-drowning — direct alveolar injury with inflammatory cascade",
      "Smoke inhalation — thermal and chemical injury to alveolar-capillary membrane",
      "Drug overdose (opioids, salicylates) — neurogenic or aspiration-related pulmonary edema"
    ],
    diagnostics: [
      "Berlin Definition criteria: acute onset, bilateral opacities, P/F ratio classification, cardiac failure ruled out",
      "P/F ratio: Mild 200-300, Moderate 100-200, Severe <100 (all on PEEP ≥5 cmH2O)",
      "Chest X-ray: bilateral opacities not fully explained by effusions, lobar collapse, or nodules",
      "CT chest: diffuse ground-glass opacities, consolidation, and heterogeneous distribution of disease",
      "Plateau pressure measurement: target <30 cmH2O — measure via inspiratory hold maneuver",
      "Driving pressure calculation: Pplat - PEEP; target <15 cmH2O",
      "Static compliance: VT / (Pplat - total PEEP); decreasing compliance indicates worsening ARDS",
      "Echocardiography: rule out cardiogenic pulmonary edema (PAWP <18 mmHg equivalent)"
    ],
    management: [
      "Lung-protective ventilation (ARDSNet): VT 6 mL/kg IBW (range 4-8), Pplat ≤30 cmH2O, driving pressure <15",
      "ARDSNet PEEP-FiO2 table: systematic PEEP/FiO2 pairing (lower or higher PEEP strategy)",
      "Permissive hypercapnia: accept elevated PaCO2 if pH >7.20 (consider NaHCO3 if pH 7.15-7.20)",
      "Prone positioning: P/F <150, FiO2 ≥0.60, PEEP ≥5 for ≥16 hours/day (PROSEVA criteria)",
      "Conservative fluid strategy (FACTT): target CVP <4, PAOP <8 after initial resuscitation — improves oxygenation and reduces vent days",
      "Neuromuscular blockade: cisatracurium for 48 hours in severe ARDS with refractory dyssynchrony",
      "iNO or inhaled epoprostenol for refractory hypoxemia as bridge to improvement or ECMO",
      "ECMO: consider when OI >40 or P/F <80 despite prone positioning and maximal conventional therapy",
      "Corticosteroids: dexamethasone 20 mg IV x 5 days then 10 mg x 5 days in COVID-ARDS (RECOVERY); methylprednisolone for non-COVID ARDS debated"
    ],
    nursingActions: [
      "Calculate IBW from height and post target VT (6 mL/kg IBW) and VT range (4-8 mL/kg IBW) at bedside",
      "Measure Pplat every 4 hours and with each ABG — if Pplat >30, decrease VT in 1 mL/kg increments to minimum 4 mL/kg",
      "Calculate and document driving pressure (Pplat - PEEP) — alert if >15 cmH2O",
      "Apply ARDSNet PEEP-FiO2 table: adjust PEEP and FiO2 in paired combinations per protocol",
      "Monitor for auto-PEEP in ARDS patients: perform expiratory hold every 4 hours to check total PEEP",
      "Screen daily for prone positioning eligibility: P/F <150 on FiO2 ≥0.60 and PEEP ≥5 triggers proning",
      "Implement conservative fluid strategy after initial resuscitation: target negative fluid balance with diuretics",
      "Document ventilator parameters, ABG results, P/F ratio, and compliance trends in flowsheet"
    ],
    signs: [
      "ARDS onset: acute hypoxemic respiratory failure with bilateral CXR opacities within 1 week of insult",
      "Worsening ARDS: declining P/F ratio, rising FiO2/PEEP requirements, decreasing static compliance",
      "Improving ARDS: improving P/F ratio, ability to wean FiO2 and PEEP, increasing compliance",
      "Ventilator dyssynchrony: double-triggering, breath stacking, reverse triggering — may indicate need for deeper sedation or NMBAs",
      "Barotrauma: pneumothorax, pneumomediastinum, subcutaneous emphysema — from overdistention",
      "ARDS resolution: sustained P/F >200 on PEEP ≤8 and FiO2 ≤0.40 — begin weaning protocol"
    ],
    medications: [
      { name: "Dexamethasone (COVID-ARDS)", dose: "6 mg IV daily x 10 days (RECOVERY trial dose)", route: "Intravenous", purpose: "Corticosteroid reducing inflammation in COVID-19 ARDS — NNT 8 for mortality reduction in ventilated patients" },
      { name: "Cisatracurium", dose: "0.15 mg/kg bolus then 1-3 mcg/kg/min x 48 hours", route: "Intravenous", purpose: "Neuromuscular blockade for severe ARDS with refractory dyssynchrony — allows consistent lung-protective ventilation" },
      { name: "Furosemide", dose: "20-80 mg IV PRN to achieve negative fluid balance", route: "Intravenous", purpose: "Conservative fluid management per FACTT — reducing extravascular lung water improves oxygenation and reduces vent days" },
      { name: "Sodium Bicarbonate", dose: "150 mEq in 1L D5W infusion or 50-100 mEq IV bolus", route: "Intravenous", purpose: "Buffer for severe acidosis (pH <7.15) from permissive hypercapnia when VT cannot be increased without exceeding Pplat 30" }
    ],
    pearls: [
      "ARDSNet protocol reduced ARDS mortality by 22% — VT 6 mL/kg IBW and Pplat ≤30 are the most evidence-based ventilator settings in medicine",
      "Driving pressure (Pplat - PEEP) <15 cmH2O is the ventilator variable most strongly associated with ARDS survival",
      "Increasing PEEP is only beneficial if it REDUCES driving pressure — if DP increases with higher PEEP, the PEEP is causing overdistention without adequate recruitment",
      "Conservative fluid strategy (FACTT) reduces ventilator days and ICU stay — after initial resuscitation, aim for negative fluid balance",
      "The Berlin Definition replaced the AECC definition in 2012 — classify ARDS by P/F ratio: Mild (200-300), Moderate (100-200), Severe (<100)",
      "ARDS management is a package: lung-protective ventilation + prone positioning + conservative fluids + appropriate adjuncts = best outcomes"
    ],
    preTest: [
      { question: "What tidal volume does the ARDSNet protocol recommend?", options: ["10-12 mL/kg actual body weight", "6 mL/kg ideal body weight", "8-10 mL/kg ideal body weight", "Any volume that normalizes PaCO2"], correct: 1, rationale: "ARDSNet recommends VT 6 mL/kg ideal body weight (range 4-8 mL/kg) to minimize volutrauma. Always use IBW calculated from height, never actual body weight." },
      { question: "What is the Berlin Definition P/F ratio cutoff for severe ARDS?", options: ["P/F <300", "P/F <200", "P/F <150", "P/F <100"], correct: 3, rationale: "Berlin Definition: Mild ARDS P/F 200-300, Moderate P/F 100-200, Severe P/F <100, all on PEEP ≥5 cmH2O." }
    ],
    postTest: [
      { question: "An ARDS patient has VT 6 mL/kg IBW with Pplat 28 cmH2O and PEEP 12 cmH2O. The driving pressure is:", options: ["28 cmH2O", "16 cmH2O", "12 cmH2O", "6 cmH2O"], correct: 1, rationale: "Driving pressure = Pplat - PEEP = 28 - 12 = 16 cmH2O. This exceeds the target of <15 cmH2O. Consider reducing VT to 5 mL/kg or adjusting PEEP to optimize driving pressure." },
      { question: "PEEP is increased from 10 to 14 cmH2O. Pplat increases from 26 to 32 cmH2O. Driving pressure changes from 16 to 18 cmH2O. What does this indicate?", options: ["Successful recruitment — PEEP increase is beneficial", "Failed recruitment — the PEEP increase caused overdistention without adequate recruitment; driving pressure increased", "Normal expected response to PEEP increase", "Equipment malfunction"], correct: 1, rationale: "When increasing PEEP raises driving pressure (from 16 to 18), it indicates the PEEP is causing overdistention without recruiting enough new lung to improve compliance. The PEEP increase is harmful and should be reversed. Beneficial PEEP increases reduce driving pressure." }
    ],
    quiz: [
      { question: "What ventilator variable is most strongly associated with ARDS mortality?", options: ["Tidal volume", "PEEP level", "Driving pressure (Pplat - PEEP)", "FiO2"], correct: 2, rationale: "Amato et al. (2015 NEJM) demonstrated that driving pressure <15 cmH2O is the ventilator variable most strongly associated with ARDS survival. Changes in PEEP or VT that reduced driving pressure were associated with improved outcomes." },
      { question: "What is the P/F ratio for an ARDS patient with PaO2 75 mmHg on FiO2 0.50?", options: ["75", "150", "37.5", "300"], correct: 1, rationale: "P/F ratio = PaO2 / FiO2 = 75 / 0.50 = 150. This classifies as moderate ARDS (P/F 100-200) per the Berlin Definition and meets PROSEVA criteria for prone positioning." },
      { question: "According to the FACTT trial, what fluid management strategy improves outcomes in ARDS after initial resuscitation?", options: ["Liberal fluid administration targeting high CVP", "Conservative fluid management targeting negative fluid balance", "Equal fluid input and output", "No fluid management protocol is needed"], correct: 1, rationale: "The FACTT trial demonstrated that conservative fluid management (targeting CVP <4, PAOP <8 with diuretics) after initial resuscitation improved oxygenation and reduced ventilator days compared to a liberal strategy, without increasing organ failure." },
      { question: "An ARDS patient has P/F 90 on FiO2 0.80 and PEEP 14. Pplat is 29 cmH2O, driving pressure is 15. The patient has been optimally ventilated for 24 hours. What adjunctive therapy should be initiated?", options: ["Increase PEEP to 20 cmH2O", "Prone positioning (PROSEVA criteria met: P/F <150, FiO2 ≥0.60, PEEP ≥5)", "High-frequency oscillatory ventilation", "Decrease PEEP to reduce driving pressure"], correct: 1, rationale: "This patient meets PROSEVA criteria for prone positioning: P/F <150 (P/F 90) on FiO2 ≥0.60 (FiO2 0.80) and PEEP ≥5 (PEEP 14). Prone positioning for ≥16 hours/day has the strongest mortality benefit of any ARDS adjunctive therapy." }
    ]
  }
};
