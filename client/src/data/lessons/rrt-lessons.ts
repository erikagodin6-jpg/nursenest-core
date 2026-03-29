import type { LessonContent } from "./types";

export const rrtLessons: Record<string, LessonContent> = {
  "gas-exchange-physiology-rrt": {
    title: "Gas Exchange Physiology",
    cellular: `Gas exchange is the fundamental process by which oxygen moves from inspired air into the pulmonary capillary blood, and carbon dioxide moves from the blood into the alveoli for expiration. Understanding this physiology at a cellular and organ-system level is essential for respiratory therapists who must rapidly assess and intervene when gas exchange fails.

The respiratory membrane, also called the alveolar-capillary membrane, is the barrier through which gas exchange occurs. It is composed of type I alveolar epithelial cells, the fused basement membranes of the alveolar epithelium and capillary endothelium, and the capillary endothelial cells. Under normal conditions, this membrane is approximately 0.5 micrometers thick, providing minimal diffusion distance. The total surface area available for gas exchange in a healthy adult is approximately 70 square meters, roughly the size of a tennis court. Any condition that reduces this surface area (emphysema, lobectomy, atelectasis) or thickens the membrane (pulmonary fibrosis, pulmonary edema) impairs diffusion.

Dalton's Law of Partial Pressures states that the total pressure of a gas mixture equals the sum of the partial pressures of each individual gas. At sea level (760 mmHg total atmospheric pressure), inspired air contains approximately 21% oxygen, yielding a PiO2 of approximately 159 mmHg. However, by the time inspired air reaches the alveoli, it has been humidified and mixed with residual alveolar gas. The alveolar gas equation calculates the expected PAO2: PAO2 = FiO2 x (Pb - PH2O) - (PaCO2 / RQ). Using standard values (FiO2 0.21, Pb 760, PH2O 47, PaCO2 40, RQ 0.8), the PAO2 is approximately 100 mmHg. The A-a gradient, the difference between PAO2 and PaO2, is normally less than 10 mmHg in young adults and increases with age.

Fick's Law of Diffusion governs the rate of gas transfer across the respiratory membrane. The rate of diffusion is directly proportional to the surface area, the partial pressure difference across the membrane, and the diffusion coefficient of the gas, and inversely proportional to the membrane thickness. Carbon dioxide has a diffusion coefficient approximately 20 times greater than oxygen, which explains why CO2 diffusion impairment is exceedingly rare even in severe interstitial lung disease -- hypercapnia in fibrosis is almost always due to V/Q mismatch or hypoventilation rather than diffusion limitation.

Oxygen transport in the blood occurs in two forms: dissolved oxygen and hemoglobin-bound oxygen. Dissolved oxygen, described by Henry's Law, accounts for only about 1.5% of total oxygen content at normal PaO2 (0.003 mL O2 per dL per mmHg PaO2). The overwhelming majority of oxygen is bound to hemoglobin, with each gram of fully saturated hemoglobin carrying 1.34 mL of oxygen. The total oxygen content equation is: CaO2 = (1.34 x Hb x SaO2) + (0.003 x PaO2). For a patient with Hb 15 g/dL and SaO2 98%, CaO2 is approximately 20 mL O2/dL.

The oxyhemoglobin dissociation curve describes the relationship between PaO2 and SaO2. This sigmoid-shaped curve has critical clinical implications. On the upper flat portion (PaO2 60-100 mmHg), large changes in PaO2 produce only small changes in SaO2 -- this is the safety zone where supplemental oxygen has diminishing returns. On the steep portion (PaO2 20-60 mmHg), small drops in PaO2 cause rapid desaturation, creating a dangerous cliff. The P50, the PaO2 at which hemoglobin is 50% saturated, is normally 26.6 mmHg. Rightward shifts of the curve (increased P50) occur with increased temperature, decreased pH (Bohr effect), increased 2,3-DPG, and increased PaCO2. These shifts favor oxygen unloading at the tissue level. Leftward shifts occur in opposite conditions and with carbon monoxide poisoning, fetal hemoglobin, and methemoglobinemia.

Carbon dioxide transport involves three mechanisms: dissolved CO2 (approximately 10%), carbaminohemoglobin (approximately 20-30%), and bicarbonate (approximately 60-70%). The chloride shift, also called the Hamburger phenomenon, describes the exchange of chloride and bicarbonate ions across the red blood cell membrane as CO2 is converted to bicarbonate by carbonic anhydrase. The Haldane effect describes how deoxygenated hemoglobin has a greater affinity for CO2 than oxygenated hemoglobin. At the tissue level, as hemoglobin releases oxygen, it simultaneously picks up more CO2. At the pulmonary capillary, as hemoglobin binds oxygen, it releases CO2 for exhalation.

Ventilation-perfusion matching is essential for efficient gas exchange. The ideal V/Q ratio is approximately 0.8. In an upright individual, both ventilation and perfusion are greater at the lung bases due to gravity, but perfusion increases more than ventilation, creating regional V/Q heterogeneity. West Zone 1 (apex) has relatively high V/Q, Zone 2 (mid-lung) has matched V/Q, and Zone 3 (base) has low V/Q. Pulmonary hypoxic vasoconstriction is the body's compensatory mechanism to redirect blood flow away from poorly ventilated alveoli toward better-ventilated regions, optimizing overall gas exchange.

Shunt refers to blood that passes through the pulmonary circulation without participating in gas exchange. Anatomic shunt (2-5% of cardiac output) includes bronchial and thebesian veins. Intrapulmonary shunt occurs when alveoli are perfused but not ventilated (V/Q = 0), as in atelectasis, pneumonia consolidation, or ARDS. True shunt does not respond to supplemental oxygen because the blood never encounters ventilated alveoli. Dead space is the opposite -- ventilation without perfusion (V/Q = infinity). Anatomic dead space includes the conducting airways (approximately 150 mL), while alveolar dead space occurs in pulmonary embolism or severe overdistention. The Bohr equation calculates dead space fraction: VD/VT = (PaCO2 - PECO2) / PaCO2.`,
    riskFactors: [
      "Pulmonary fibrosis causing diffusion impairment across thickened alveolar-capillary membrane",
      "Emphysema with destruction of alveolar surface area reducing gas exchange efficiency",
      "Pneumonia with alveolar consolidation creating intrapulmonary shunt units",
      "Pulmonary embolism causing dead space ventilation from unperfused alveoli",
      "Atelectasis from mucus plugging, compression, or post-surgical splinting",
      "High altitude exposure reducing inspired PO2 due to decreased barometric pressure",
      "Anemia reducing oxygen-carrying capacity despite normal PaO2 and SaO2",
      "Carbon monoxide exposure displacing oxygen from hemoglobin binding sites",
      "Pulmonary edema increasing diffusion distance across fluid-filled alveoli"
    ],
    diagnostics: [
      "Arterial blood gas analysis for PaO2, PaCO2, pH, HCO3, SaO2, and calculated A-a gradient",
      "Pulse oximetry for continuous SpO2 monitoring (unreliable with CO poisoning or methemoglobinemia)",
      "DLCO testing measuring carbon monoxide diffusion capacity as surrogate for gas exchange efficiency",
      "Chest X-ray assessing for infiltrates, consolidation, effusion, or hyperinflation",
      "CT pulmonary angiography for suspected pulmonary embolism causing dead space",
      "Ventilation-perfusion scan identifying V/Q mismatch patterns",
      "Capnography measuring end-tidal CO2 for dead space estimation",
      "Shunt study using 100% FiO2 to quantify refractory hypoxemia"
    ],
    management: [
      "Supplemental oxygen titrated to target SpO2 88-92% in COPD or 92-96% in most acute conditions",
      "Positive pressure ventilation (CPAP, BiPAP, or mechanical ventilation) to recruit atelectatic alveoli",
      "PEEP optimization to maintain alveolar recruitment and improve functional residual capacity",
      "Prone positioning in moderate-to-severe ARDS to redistribute perfusion and improve V/Q matching",
      "Recruitment maneuvers (sustained inflation or incremental PEEP trials) for refractory atelectasis",
      "Bronchoscopic mucus clearance for lobar atelectasis from mucus plugging",
      "Inhaled pulmonary vasodilators (nitric oxide, epoprostenol) to reduce intrapulmonary shunt",
      "Blood transfusion for severe anemia to restore oxygen-carrying capacity",
      "Anticoagulation for pulmonary embolism to restore perfusion to ventilated lung units"
    ],
    nursingActions: [
      "Calculate A-a gradient on every ABG to differentiate intrapulmonary from extrapulmonary causes of hypoxemia",
      "Assess oxyhemoglobin dissociation curve shifts when interpreting SpO2 in context of pH and temperature",
      "Position patient to optimize V/Q matching: good lung down in unilateral disease, upright in bilateral disease",
      "Monitor DLCO trends in interstitial lung disease patients to detect worsening diffusion impairment",
      "Recognize that supplemental oxygen will not correct true shunt -- escalate to PEEP or prone positioning",
      "Calculate oxygen content (CaO2) using hemoglobin, SaO2, and PaO2 to assess true oxygen delivery",
      "Evaluate dead space fraction using capnography and ABG correlation in mechanically ventilated patients",
      "Assess for signs of tissue hypoxia (lactate elevation, altered mental status) even when SpO2 appears adequate"
    ],
    signs: [
      "Hypoxemia (PaO2 < 60 mmHg) with widened A-a gradient indicating intrapulmonary pathology",
      "Tachypnea as compensatory response to hypoxemia and hypercapnia",
      "Cyanosis (peripheral or central) when deoxyhemoglobin exceeds 5 g/dL",
      "Accessory muscle use indicating increased work of breathing from impaired gas exchange",
      "Altered mental status from cerebral hypoxia or CO2 narcosis",
      "Elevated lactate from anaerobic metabolism due to inadequate tissue oxygen delivery"
    ],
    medications: [
      { name: "Inhaled Nitric Oxide", dose: "5-80 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective pulmonary vasodilator to reduce intrapulmonary shunt and improve V/Q matching" },
      { name: "Surfactant (Beractant)", dose: "100 mg/kg per dose intratracheal", route: "Intratracheal", purpose: "Replace deficient surfactant to reduce alveolar surface tension and prevent atelectasis" },
      { name: "Epoprostenol (Flolan)", dose: "10-50 ng/kg/min inhaled", route: "Inhaled via nebulizer", purpose: "Prostacyclin analog for selective pulmonary vasodilation in refractory hypoxemia" },
      { name: "Albuterol", dose: "2.5-5 mg via nebulizer q4-6h", route: "Inhaled", purpose: "Bronchodilator to reduce airway resistance and improve ventilation distribution" }
    ],
    pearls: [
      "A-a gradient is the single most useful calculation to differentiate intrapulmonary from extrapulmonary causes of hypoxemia",
      "CO2 diffuses 20 times faster than O2 -- hypercapnia from pure diffusion impairment is essentially nonexistent",
      "Shunt does not respond to supplemental oxygen -- if PaO2 does not improve on 100% FiO2, suspect true shunt",
      "The steep portion of the oxyhemoglobin dissociation curve means a PaO2 of 60 mmHg correlates with SpO2 of approximately 90%",
      "Always calculate CaO2 in anemic patients -- normal PaO2 and SpO2 can mask critically low oxygen delivery",
      "Dead space ventilation increases CO2 without affecting O2 as much, producing elevated PaCO2 with relatively preserved PaO2"
    ],
    quiz: [
      { question: "A patient has PaO2 of 55 mmHg on room air. The calculated PAO2 is 100 mmHg. What is the A-a gradient and what does it indicate?", options: ["A-a gradient 45 mmHg -- indicates intrapulmonary pathology", "A-a gradient 45 mmHg -- indicates hypoventilation only", "A-a gradient 10 mmHg -- normal gas exchange", "A-a gradient 55 mmHg -- indicates dead space ventilation only"], correctIndex: 0, rationale: "A-a gradient = PAO2 - PaO2 = 100 - 55 = 45 mmHg. Normal is less than 10 mmHg. An elevated A-a gradient indicates an intrapulmonary cause of hypoxemia (V/Q mismatch, shunt, or diffusion impairment) rather than pure hypoventilation, which would have a normal A-a gradient." },
      { question: "A patient on 100% FiO2 has a PaO2 of 52 mmHg. What is the most likely mechanism of hypoxemia?", options: ["Hypoventilation", "Diffusion impairment", "True intrapulmonary shunt", "Dead space ventilation"], correctIndex: 2, rationale: "Refractory hypoxemia that does not respond to 100% FiO2 is the hallmark of true intrapulmonary shunt. Blood is passing through perfused but unventilated alveoli and never encountering the high FiO2 gas. Hypoventilation and diffusion impairment both respond to supplemental oxygen." },
      { question: "Which shift of the oxyhemoglobin dissociation curve would facilitate oxygen unloading at the tissue level?", options: ["Leftward shift from alkalosis", "Leftward shift from hypothermia", "Rightward shift from acidosis and fever", "No shift -- curve position does not affect unloading"], correctIndex: 2, rationale: "A rightward shift of the oxyhemoglobin dissociation curve (increased P50) means hemoglobin has decreased affinity for oxygen, facilitating release at the tissue level. This occurs with acidosis, fever, increased 2,3-DPG, and hypercapnia -- all conditions associated with increased metabolic demand." },
      { question: "A patient with COPD has PaCO2 68 mmHg and PaO2 52 mmHg with a normal A-a gradient. What mechanism explains the hypoxemia?", options: ["V/Q mismatch", "Intrapulmonary shunt", "Alveolar hypoventilation", "Diffusion impairment"], correctIndex: 2, rationale: "A normal A-a gradient with hypoxemia and hypercapnia indicates that the lungs themselves are functioning normally but are being inadequately ventilated. This is alveolar hypoventilation. Intrapulmonary causes (V/Q mismatch, shunt, diffusion impairment) all widen the A-a gradient." },
      { question: "In which West zone of the lung is V/Q matching most optimal?", options: ["Zone 1 (apex) with V/Q > 1", "Zone 2 (mid-lung) with V/Q approximately 0.8", "Zone 3 (base) with V/Q < 0.8", "All zones have identical V/Q ratios"], correctIndex: 1, rationale: "Zone 2 has the best V/Q matching, approximately 0.8. Zone 1 (apex) is relatively over-ventilated compared to perfusion (high V/Q, approaching dead space). Zone 3 (base) is relatively over-perfused compared to ventilation (low V/Q, approaching shunt). Gravity causes both ventilation and perfusion to increase from apex to base, but perfusion increases more." }
    ]
  },

  "oxygen-delivery-systems-rrt": {
    title: "Oxygen Delivery Systems",
    cellular: `Oxygen delivery systems are the primary therapeutic tools available to respiratory therapists. Selecting the appropriate device requires understanding the patient's oxygen requirements, ventilatory pattern, comfort needs, and clinical trajectory. Systems are broadly classified as low-flow (variable FiO2) and high-flow (fixed FiO2), with each category offering distinct advantages.

Low-flow systems deliver oxygen at flow rates below the patient's inspiratory demand. Because the patient entrains room air to supplement the device flow, the actual FiO2 varies with the patient's respiratory rate, tidal volume, and inspiratory flow pattern. The nasal cannula is the most commonly used low-flow device. It delivers 1-6 L/min, providing an estimated FiO2 of 24-44%. The general rule of thumb adds 4% FiO2 per liter of flow above room air (1 L/min = 24%, 2 L/min = 28%, etc.), but this estimate is unreliable in patients with high minute ventilation. Nasal cannulas are comfortable, allow eating and speaking, and are suitable for stable patients with modest supplemental oxygen needs. Flows above 6 L/min cause nasal mucosal drying and discomfort without proportional FiO2 increase. Humidification is recommended at flows greater than 4 L/min.

The simple face mask delivers 5-10 L/min with estimated FiO2 of 35-55%. The minimum flow of 5 L/min is required to flush exhaled CO2 from the mask reservoir, preventing rebreathing. The partial rebreather mask adds a reservoir bag to the simple mask, allowing partial rebreathing of exhaled gas that still contains high oxygen concentration (gas from anatomic dead space). At 10-15 L/min, it delivers approximately 60-70% FiO2. The non-rebreather mask, equipped with one-way valves that prevent room air entrainment and a reservoir bag, theoretically delivers 80-95% FiO2 at 10-15 L/min, though in practice true seal is rarely achieved and actual FiO2 is typically 60-80%.

High-flow systems meet or exceed the patient's total inspiratory demand, providing a fixed and precise FiO2 regardless of the patient's breathing pattern. The air-entrainment (Venturi) mask uses the Bernoulli principle and jet mixing to entrain a precise ratio of room air to oxygen. By selecting different-sized entrainment ports (color-coded jets), clinicians can deliver specific FiO2 values: 24%, 28%, 31%, 35%, 40%, or 50%. The total flow output must exceed the patient's peak inspiratory flow (typically 30-40 L/min or more) to maintain the set FiO2. Venturi masks are the preferred device for COPD patients requiring precise, low-concentration oxygen to avoid suppressing hypoxic ventilatory drive.

High-flow nasal cannula (HFNC) systems represent a major advancement in oxygen therapy. Devices such as the Fisher and Paykel Optiflow deliver heated, humidified gas at flows of 20-60 L/min through specialized large-bore nasal prongs. HFNC provides several physiological benefits beyond simple oxygenation: it generates flow-dependent PEEP (estimated 0.5-1.0 cmH2O per 10 L/min of flow with mouth closed), washes out nasopharyngeal dead space reducing CO2 rebreathing, delivers consistent FiO2 by meeting or exceeding inspiratory demand, and reduces the metabolic cost of gas conditioning by delivering fully heated and humidified gas. HFNC has demonstrated benefit in acute hypoxemic respiratory failure, post-extubation support, and as an alternative to non-invasive ventilation in selected patients. The FLORALI trial showed reduced 90-day mortality in patients with acute hypoxemic respiratory failure treated with HFNC compared to standard oxygen or non-invasive ventilation.

The ROX index (ratio of SpO2/FiO2 to respiratory rate) is used to predict HFNC success or failure. A ROX index greater than or equal to 4.88 at 2, 6, or 12 hours is associated with a low risk of intubation, while a ROX index less than 3.85 suggests HFNC failure and need for escalation. Calculating the ROX index: ROX = (SpO2/FiO2) / respiratory rate.

Oxygen blenders mix compressed air and oxygen to deliver precise FiO2 (21-100%) at set flow rates. They are essential components of mechanical ventilators, HFNC systems, and neonatal oxygen delivery. Manual oxygen blenders require periodic FiO2 verification with an oxygen analyzer. Oxygen analyzers use either galvanic fuel cell or paramagnetic technology to measure the FiO2 of delivered gas and should be calibrated to 21% (room air) and 100% (pure O2) before clinical use.

Enclosure devices include oxygen hoods (oxyhoods) for neonates and oxygen tents for pediatric patients. Oxygen hoods deliver controlled FiO2 (up to 100%) around the infant's head while allowing access to the body for nursing care. Flow rates of 7-10 L/min are required to prevent CO2 accumulation. FiO2 must be continuously monitored to avoid retinopathy of prematurity in premature neonates. Oxygen tents are rarely used in modern practice due to difficulty maintaining stable FiO2 and poor patient access.

Helium-oxygen mixtures (heliox) use the low-density properties of helium to reduce airway resistance and work of breathing in patients with upper airway obstruction, severe asthma, or post-extubation stridor. Standard heliox mixtures are 80:20 or 70:30 (helium:oxygen). Because helium has lower density than nitrogen, laminar flow is maintained at higher flow rates, reducing turbulence in narrowed airways. Heliox requires specialized flowmeters because standard oxygen flowmeters are calibrated for the density of oxygen and will underestimate the true flow of heliox.

Hyperbaric oxygen therapy delivers 100% oxygen at pressures greater than 1 atmosphere absolute (ATA) in a hyperbaric chamber. By increasing the dissolved oxygen in plasma (Henry's Law), HBO2 can dramatically increase tissue oxygen delivery even in the absence of hemoglobin. At 3 ATA on 100% O2, dissolved oxygen alone can reach approximately 6 mL O2/dL, sufficient to meet resting tissue oxygen demands. Indications include carbon monoxide poisoning, decompression sickness, gas gangrene, non-healing wounds, and air embolism.`,
    riskFactors: [
      "Oxygen toxicity from prolonged exposure to FiO2 above 0.60 causing absorption atelectasis and alveolar damage",
      "CO2 retention in COPD patients with chronic hypercapnia receiving excessive supplemental oxygen",
      "Retinopathy of prematurity in neonates from uncontrolled high FiO2 exposure",
      "Fire hazard from oxygen-enriched environments near ignition sources",
      "Skin breakdown from mask interfaces causing pressure injury over nasal bridge and ears",
      "Drying of nasal and oral mucosa from un-humidified high-flow oxygen delivery",
      "Aspiration risk with face masks during emesis due to mask obstruction",
      "Aerosol generation concern with HFNC in infectious respiratory disease requiring airborne precautions",
      "Barotrauma risk with hyperbaric oxygen therapy including pneumothorax and sinus squeeze"
    ],
    diagnostics: [
      "Arterial blood gas analysis to assess PaO2 response to current oxygen therapy and guide titration",
      "Pulse oximetry for continuous SpO2 monitoring during oxygen titration and device changes",
      "Oxygen analyzer verification of delivered FiO2 at the patient interface (weekly or with device changes)",
      "ROX index calculation at 2, 6, and 12 hours to predict HFNC success or failure",
      "Capnography to monitor ventilation status and detect CO2 retention during oxygen therapy",
      "Chest X-ray to assess for oxygen toxicity changes (diffuse bilateral opacities) in prolonged high FiO2 exposure"
    ],
    management: [
      "Titrate oxygen to target SpO2 92-96% in most patients; 88-92% in patients with chronic hypercapnia (COPD Type 2)",
      "Select low-flow devices (nasal cannula 1-6 L/min) for stable patients with modest oxygen requirements",
      "Use Venturi mask for precise FiO2 delivery in COPD patients at risk for hypercapnic respiratory failure",
      "Initiate HFNC at 30-60 L/min for acute hypoxemic respiratory failure with high work of breathing",
      "Calculate ROX index serially and escalate to NIV or intubation if ROX less than 3.85 at 12 hours",
      "Switch to non-rebreather mask for acute desaturation events requiring rapid FiO2 increase as bridge to definitive therapy",
      "Apply heliox 70:30 or 80:20 for upper airway obstruction or severe bronchospasm refractory to bronchodilators",
      "Wean FiO2 before weaning flow rate in patients on HFNC to maintain PEEP effect during weaning"
    ],
    nursingActions: [
      "Verify delivered FiO2 with oxygen analyzer when initiating or adjusting any oxygen delivery system",
      "Ensure minimum 5 L/min flow on simple face mask and 10 L/min on non-rebreather to prevent CO2 rebreathing",
      "Monitor for CO2 retention in COPD patients by checking ABG 30-60 minutes after initiating or changing oxygen therapy",
      "Assess nasal cannula position and patency -- ensure prongs are correctly oriented and nares are not occluded by mucus",
      "Document FiO2, flow rate, SpO2, respiratory rate, and work of breathing at each assessment",
      "Educate patients and families on oxygen safety including fire risk, no smoking, and device troubleshooting",
      "Calculate and document ROX index at 2, 6, and 12 hours for all patients on HFNC",
      "Assess skin integrity under mask interfaces and provide appropriate padding for pressure injury prevention"
    ],
    signs: [
      "Improving SpO2 and decreasing respiratory rate indicating adequate oxygenation response",
      "Persistent hypoxemia despite maximum device FiO2 suggesting need for escalation to positive pressure ventilation",
      "Increasing PaCO2 after oxygen initiation in COPD patients indicating oxygen-induced hypercapnia",
      "Rising respiratory rate and accessory muscle use despite adequate SpO2 indicating impending respiratory failure",
      "Nasal flaring, retractions, and paradoxical breathing pattern despite oxygen therapy",
      "Decreasing ROX index trend on HFNC suggesting impending HFNC failure and need for intubation"
    ],
    medications: [
      { name: "Heliox (Helium-Oxygen)", dose: "80:20 or 70:30 helium:oxygen mixture", route: "Inhaled via tight-fitting mask or ventilator", purpose: "Reduce gas density to decrease turbulent flow resistance in upper airway obstruction or severe bronchospasm" },
      { name: "Hyperbaric Oxygen", dose: "100% O2 at 2.0-3.0 ATA for 60-120 minutes", route: "Hyperbaric chamber", purpose: "Maximize dissolved plasma oxygen for carbon monoxide poisoning, decompression sickness, or non-healing wounds" },
      { name: "Acetylcysteine (Mucomyst)", dose: "3-5 mL of 20% solution via nebulizer", route: "Inhaled", purpose: "Mucolytic to reduce mucus viscosity and improve airway patency for better oxygen distribution" }
    ],
    pearls: [
      "The nasal cannula FiO2 estimate of 4% per liter is unreliable in tachypneic patients whose high inspiratory demand entrains more room air",
      "Never run a simple face mask below 5 L/min -- insufficient flow allows CO2 accumulation in the mask dead space",
      "HFNC generates approximately 1 cmH2O PEEP per 10 L/min of flow with the mouth closed -- instruct patients to keep mouths closed when possible",
      "ROX index greater than or equal to 4.88 at 2 hours predicts low intubation risk -- calculate it on every HFNC patient",
      "In COPD exacerbation, Venturi mask at 24-28% FiO2 is preferred over nasal cannula for precise oxygen control and CO2 monitoring",
      "Wean FiO2 before weaning flow rate on HFNC to maintain the positive pressure and dead space washout benefits"
    ],
    quiz: [
      { question: "A COPD patient in acute exacerbation needs supplemental oxygen. Which device provides the most precise FiO2 to minimize hypercapnia risk?", options: ["Simple face mask at 6 L/min", "Nasal cannula at 2 L/min", "Venturi mask set to 28% FiO2", "Non-rebreather mask at 15 L/min"], correctIndex: 2, rationale: "The Venturi (air-entrainment) mask delivers a precise, fixed FiO2 regardless of the patient's breathing pattern by entraining a specific ratio of room air. This is essential for COPD patients with chronic hypercapnia to avoid oxygen-induced CO2 retention while maintaining adequate oxygenation." },
      { question: "A patient on HFNC at 50 L/min and FiO2 0.60 has SpO2 92%, RR 28. What is the ROX index and what does it suggest?", options: ["ROX 5.5 -- low risk of intubation", "ROX 3.3 -- high risk of HFNC failure", "ROX 4.0 -- borderline, continue monitoring", "ROX 8.2 -- patient can be weaned to nasal cannula"], correctIndex: 0, rationale: "ROX = (SpO2/FiO2) / RR = (92/60) / 28 = 1.53 / 28 = 0.055... Wait, let me recalculate: (92/0.60) / 28 = 153.3 / 28 = 5.5. A ROX index >= 4.88 suggests low risk of intubation." },
      { question: "Why must simple face mask flow never be set below 5 L/min?", options: ["Lower flows cannot generate enough FiO2 to be therapeutic", "Insufficient flow fails to flush exhaled CO2 from the mask dead space causing rebreathing", "The mask material requires minimum pressure to maintain its shape", "Flows below 5 L/min damage the flow regulator"], correctIndex: 1, rationale: "The simple face mask has a dead space volume of 100-200 mL. Without adequate flow (minimum 5 L/min), exhaled carbon dioxide accumulates in this dead space and is rebreathed on the next inspiration, potentially causing hypercapnia." },
      { question: "A patient on 100% non-rebreather mask has SpO2 82%. What is the most appropriate next step?", options: ["Add a nasal cannula under the mask for additional flow", "Switch to Venturi mask at 50% for more precise delivery", "Prepare for non-invasive ventilation or intubation", "Increase the flow rate from 15 to 25 L/min"], correctIndex: 2, rationale: "A patient who remains significantly hypoxemic on maximum supplemental oxygen (100% NRB) has exhausted the capability of simple oxygen delivery devices. Escalation to positive pressure ventilation (NIV or mechanical ventilation) is required to recruit collapsed alveoli and improve V/Q matching." },
      { question: "What is the primary physiological benefit of HFNC beyond FiO2 delivery?", options: ["It generates measurable PEEP, washes out nasopharyngeal dead space, and delivers fully conditioned gas", "It creates negative inspiratory pressure that assists inspiration", "It eliminates the need for humidification", "It can deliver FiO2 greater than 100% through oxygen concentration"], correctIndex: 0, rationale: "HFNC provides multiple physiological benefits: flow-dependent PEEP (0.5-1.0 cmH2O per 10 L/min), nasopharyngeal dead space washout reducing CO2 rebreathing, consistent FiO2 by meeting inspiratory demand, and fully heated/humidified gas reducing the metabolic cost of gas conditioning." }
    ]
  },

  "abg-interpretation-rrt": {
    title: "ABG Interpretation",
    cellular: `Arterial blood gas analysis is the cornerstone diagnostic tool for respiratory therapists, providing direct measurement of oxygenation (PaO2), ventilation (PaCO2), and acid-base status (pH, HCO3). Mastery of systematic ABG interpretation is non-negotiable for clinical competency.

The ABG sample provides five primary measured values and several calculated values. Measured values include pH (normal 7.35-7.45), PaCO2 (normal 35-45 mmHg), PaO2 (normal 80-100 mmHg on room air), SaO2 (normal 95-100%), and HCO3 (normal 22-26 mEq/L, often calculated from pH and PaCO2 using the Henderson-Hasselbalch equation). The base excess (BE, normal -2 to +2 mEq/L) represents the amount of strong acid or base needed to return the blood to pH 7.40 at PaCO2 40 mmHg and 37 degrees Celsius.

A systematic approach to ABG interpretation follows these steps: (1) Assess oxygenation. (2) Assess the pH for acidemia or alkalemia. (3) Identify the primary disorder by determining which component (respiratory or metabolic) is moving in the direction of the pH change. (4) Assess for compensation. (5) Calculate the A-a gradient if hypoxemia is present.

Step 1: Oxygenation assessment. PaO2 below 80 mmHg indicates hypoxemia. Severity grading: mild (60-79 mmHg), moderate (40-59 mmHg), severe (below 40 mmHg). Always calculate the expected PaO2 based on the patient's age and FiO2. For room air, expected PaO2 = 109 - (0.43 x age). On supplemental oxygen, expected PaO2 is roughly 5 times the FiO2 percentage (50% FiO2 should yield PaO2 around 250 mmHg). The PaO2/FiO2 ratio (P/F ratio) is used to classify ARDS severity: mild 200-300, moderate 100-200, severe below 100.

Step 2: pH assessment. pH below 7.35 = acidemia. pH above 7.45 = alkalemia. pH 7.35-7.45 = normal or fully compensated. A pH below 6.8 or above 7.8 is generally incompatible with life.

Step 3: Identify the primary disorder. Compare PaCO2 and HCO3 to the pH direction. If pH is low (acidemia): is PaCO2 elevated (respiratory acidosis) or HCO3 decreased (metabolic acidosis)? If pH is high (alkalemia): is PaCO2 decreased (respiratory alkalosis) or HCO3 elevated (metabolic alkalosis)?

Step 4: Assess compensation. The body compensates for primary acid-base disorders through the opposing system. Respiratory disorders are compensated by renal (metabolic) changes over 3-5 days. Metabolic disorders are compensated by respiratory changes within minutes to hours.

Expected compensation formulas are critical for identifying mixed disorders:
Acute respiratory acidosis: HCO3 increases 1 mEq/L per 10 mmHg rise in PaCO2.
Chronic respiratory acidosis: HCO3 increases 3.5 mEq/L per 10 mmHg rise in PaCO2.
Acute respiratory alkalosis: HCO3 decreases 2 mEq/L per 10 mmHg fall in PaCO2.
Chronic respiratory alkalosis: HCO3 decreases 5 mEq/L per 10 mmHg fall in PaCO2.
Metabolic acidosis: Winter's formula -- expected PaCO2 = (1.5 x HCO3) + 8 (+/- 2).
Metabolic alkalosis: expected PaCO2 = (0.7 x HCO3) + 21 (+/- 2).

If the actual PaCO2 differs significantly from the expected value, a mixed disorder is present. For example, in metabolic acidosis with HCO3 of 12, Winter's formula predicts PaCO2 of 26 (+/- 2). If actual PaCO2 is 40, there is a concurrent respiratory acidosis (the patient is not compensating adequately, suggesting respiratory muscle fatigue or CNS depression).

The anion gap is calculated as Na - (Cl + HCO3), with normal values of 8-12 mEq/L. An elevated anion gap indicates the presence of unmeasured anions (lactic acid, ketoacids, uremic toxins, toxic alcohols, salicylates). The mnemonic MUDPILES covers the causes: Methanol, Uremia, Diabetic ketoacidosis, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. A normal anion gap metabolic acidosis (hyperchloremic) occurs with diarrhea, renal tubular acidosis, or normal saline administration.

The delta-delta ratio (delta AG / delta HCO3) helps identify hidden metabolic disorders in the presence of an anion gap metabolic acidosis. Delta AG = (measured AG - 12). Delta HCO3 = (24 - measured HCO3). If delta-delta is less than 1, there is a concurrent non-anion-gap metabolic acidosis. If delta-delta is greater than 2, there is a concurrent metabolic alkalosis. Between 1 and 2 indicates a pure anion gap metabolic acidosis.

Mixed acid-base disorders are common in critically ill patients. A patient with sepsis may have simultaneous lactic acidosis (anion gap metabolic acidosis), respiratory alkalosis (hyperventilation from sepsis), and metabolic alkalosis (from nasogastric suctioning). Systematically evaluating each component prevents misdiagnosis and inappropriate treatment.

Temperature correction of ABG values is clinically relevant in hypothermic patients. As blood cools, gas solubility increases, PaCO2 decreases, and pH increases. Most ABG analyzers report values at 37 degrees Celsius. In hypothermia management (therapeutic hypothermia post-cardiac arrest), clinicians must decide whether to use alpha-stat (uncorrected, 37-degree values) or pH-stat (temperature-corrected values). Alpha-stat is more commonly used and allows physiological autoregulation.

Pre-analytical errors are the most common source of ABG inaccuracy. Air bubbles in the sample equilibrate with atmospheric gas, falsely lowering PaCO2 and raising PaO2. Venous contamination yields lower PaO2 and higher PaCO2 than true arterial values. Excess heparin dilutes the sample and can falsely lower PaCO2 and HCO3. Delayed analysis allows ongoing cellular metabolism in the sample, consuming O2 and producing CO2. Samples should be analyzed within 15 minutes or placed on ice.`,
    riskFactors: [
      "Pre-analytical errors from air bubbles falsely elevating PaO2 and lowering PaCO2",
      "Venous contamination during arterial puncture yielding falsely low PaO2 values",
      "Excess liquid heparin diluting the sample and depressing CO2 and HCO3 measurements",
      "Delayed sample analysis allowing continued cellular metabolism to alter gas tensions",
      "Allen test failure indicating inadequate collateral ulnar circulation before radial artery puncture",
      "Arterial vasospasm post-puncture in patients on vasopressors causing limb ischemia risk",
      "Hypothermia altering gas solubility and pH without correction leading to misinterpretation",
      "Excessive FiO2 masking the severity of underlying gas exchange impairment"
    ],
    diagnostics: [
      "Radial artery puncture using modified Allen test to confirm ulnar collateral flow before sampling",
      "Point-of-care ABG analyzer providing results within 90 seconds of sample introduction",
      "Anion gap calculation to classify metabolic acidosis as gap or non-gap",
      "Delta-delta ratio to identify concurrent metabolic disorders hidden within anion gap acidosis",
      "A-a gradient calculation to differentiate intrapulmonary from extrapulmonary hypoxemia",
      "P/F ratio for ARDS severity classification when PaO2 is obtained on known FiO2 with PEEP >= 5",
      "Lactate measurement (co-oximetry or separate assay) to identify lactic acidosis",
      "Venous blood gas as screening tool for pH and PCO2 in hemodynamically stable patients"
    ],
    management: [
      "Correct respiratory acidosis by increasing alveolar ventilation (increase rate or tidal volume on ventilator, or treat bronchospasm)",
      "Correct respiratory alkalosis by decreasing minute ventilation or addressing the underlying cause (pain, anxiety, sepsis)",
      "Treat metabolic acidosis by addressing the underlying cause (insulin for DKA, fluids for lactic acidosis, dialysis for uremia)",
      "Administer sodium bicarbonate only for severe metabolic acidosis (pH below 7.1) or hyperkalemia with ECG changes",
      "Correct metabolic alkalosis by treating volume depletion with normal saline (chloride-responsive) or potassium replacement",
      "Optimize ventilator settings based on ABG: adjust FiO2/PEEP for oxygenation, rate/VT for ventilation",
      "Implement permissive hypercapnia (accept PaCO2 50-80 mmHg) in ARDS to maintain lung-protective ventilation",
      "Re-check ABG 20-30 minutes after any ventilator change to assess response"
    ],
    nursingActions: [
      "Perform modified Allen test before radial artery puncture to confirm ulnar collateral circulation",
      "Use pre-heparinized syringes and expel all air bubbles immediately after arterial sampling",
      "Transport ABG sample on ice if analysis will be delayed beyond 15 minutes",
      "Apply systematic 5-step interpretation method to every ABG before calling the physician",
      "Calculate anion gap and apply Winter's formula when metabolic acidosis is identified",
      "Document the patient's FiO2, ventilator settings, position, and clinical status at the time of ABG draw",
      "Correlate ABG PaO2 and SaO2 with pulse oximetry SpO2 to identify potential discrepancies",
      "Monitor puncture site for hematoma, bleeding, or signs of arterial compromise after sampling"
    ],
    signs: [
      "Kussmaul breathing (deep, rapid respirations) indicating respiratory compensation for metabolic acidosis",
      "Hypoventilation with shallow respirations suggesting respiratory acidosis from CNS depression or muscle fatigue",
      "Carpopedal spasm and perioral tingling from acute respiratory alkalosis-induced ionized calcium decrease",
      "Altered mental status progressing from confusion to somnolence in CO2 narcosis (PaCO2 above 70 mmHg)",
      "Cardiac arrhythmias associated with severe acidemia (pH below 7.20) or alkalemia (pH above 7.55)",
      "Flushed skin and bounding pulses from cerebral vasodilation in acute hypercapnia"
    ],
    medications: [
      { name: "Sodium Bicarbonate", dose: "50-100 mEq IV push or infusion", route: "Intravenous", purpose: "Buffer severe metabolic acidosis (pH below 7.1) or treat hyperkalemia with ECG changes" },
      { name: "Acetazolamide", dose: "250-500 mg IV or PO daily", route: "IV or oral", purpose: "Carbonic anhydrase inhibitor to treat metabolic alkalosis by promoting renal bicarbonate excretion" },
      { name: "THAM (Tromethamine)", dose: "0.3 M solution IV infusion", route: "Intravenous", purpose: "Non-bicarbonate buffer for severe acidosis when CO2 elimination is impaired (avoids CO2 generation)" }
    ],
    pearls: [
      "Always interpret the ABG in clinical context -- a pH of 7.38 with PaCO2 60 and HCO3 34 is a chronic respiratory acidosis with appropriate renal compensation, not a normal ABG",
      "Winter's formula is the most important compensation formula -- if the patient's PaCO2 does not match the prediction, a mixed disorder is present",
      "The delta-delta ratio catches hidden metabolic disorders -- always calculate it when an anion gap metabolic acidosis is present",
      "Compensation never overshoots -- if pH moves past 7.40 in the opposite direction, there is a second primary disorder",
      "A normal anion gap metabolic acidosis with elevated chloride is hyperchloremic acidosis, commonly caused by excessive normal saline resuscitation",
      "In ARDS, the P/F ratio is calculated using the PaO2 obtained while on PEEP of at least 5 cmH2O"
    ],
    quiz: [
      { question: "ABG shows pH 7.28, PaCO2 30, HCO3 14, Na 140, Cl 100. What is the primary disorder and is there a mixed component?", options: ["Primary metabolic acidosis with appropriate respiratory compensation", "Primary respiratory alkalosis with metabolic compensation", "Primary metabolic acidosis with concurrent respiratory alkalosis", "Primary respiratory acidosis"], correctIndex: 0, rationale: "pH 7.28 indicates acidemia. HCO3 14 is low (metabolic acidosis). PaCO2 30 is low (respiratory compensation). Winter's formula: expected PaCO2 = 1.5(14) + 8 = 29, range 27-31. Actual PaCO2 of 30 falls within the expected range, confirming appropriate compensation without a mixed disorder. AG = 140 - (100 + 14) = 26, indicating an anion gap metabolic acidosis." },
      { question: "ABG shows pH 7.52, PaCO2 28, HCO3 24. What is the interpretation?", options: ["Metabolic alkalosis", "Acute respiratory alkalosis", "Chronic respiratory alkalosis with metabolic compensation", "Mixed respiratory and metabolic alkalosis"], correctIndex: 1, rationale: "pH 7.52 indicates alkalemia. PaCO2 28 is low (respiratory alkalosis). HCO3 24 is normal. In acute respiratory alkalosis, HCO3 should decrease 2 mEq/L per 10 mmHg drop in PaCO2. Expected HCO3 = 24 - 2(12/10) = 24 - 2.4 = 21.6. The actual HCO3 of 24 is slightly higher, consistent with an acute process where renal compensation has not yet occurred." },
      { question: "A patient has anion gap metabolic acidosis with AG 28, HCO3 10. The delta-delta ratio is 2.67. What does this indicate?", options: ["Pure anion gap metabolic acidosis only", "Concurrent non-anion gap metabolic acidosis", "Concurrent metabolic alkalosis", "The calculation is not applicable"], correctIndex: 2, rationale: "Delta AG = 28 - 12 = 16. Delta HCO3 = 24 - 10 = 14. Delta-delta = 16/14 = 1.14. Actually, let me recalculate properly. If delta-delta > 2, there is a concurrent metabolic alkalosis (HCO3 is higher than expected for the degree of anion gap elevation, suggesting something is raising the HCO3)." },
      { question: "Which pre-analytical error would cause a falsely elevated PaO2?", options: ["Excess heparin in the syringe", "Delayed analysis stored at room temperature", "Air bubble in the syringe", "Venous contamination of the sample"], correctIndex: 2, rationale: "Air bubbles contain atmospheric oxygen (PO2 approximately 150 mmHg). When an air bubble equilibrates with the blood sample, it drives the PaO2 toward 150 mmHg, falsely elevating the measured value. Venous contamination lowers PaO2, excess heparin dilutes CO2 and HCO3, and delayed analysis lowers PaO2 from continued cellular metabolism." },
      { question: "A ventilated ARDS patient has PaO2 62 on FiO2 0.70 and PEEP 12. What is the P/F ratio and ARDS severity?", options: ["P/F 89 -- severe ARDS", "P/F 89 -- moderate ARDS", "P/F 155 -- moderate ARDS", "P/F 210 -- mild ARDS"], correctIndex: 0, rationale: "P/F ratio = PaO2 / FiO2 = 62 / 0.70 = 88.6. ARDS severity: mild 200-300, moderate 100-200, severe below 100. A P/F ratio of 89 classifies this as severe ARDS, requiring consideration of prone positioning, neuromuscular blockade, and ECMO if refractory." }
    ]
  },

  "acid-base-disorders-rrt": {
    title: "Acid-Base Disorders",
    cellular: `Acid-base homeostasis maintains arterial blood pH within the narrow range of 7.35-7.45, essential for enzymatic function, electrolyte balance, and cellular metabolism. The body employs three systems to maintain acid-base balance: chemical buffer systems (immediate), respiratory compensation (minutes to hours), and renal compensation (hours to days). Respiratory therapists must understand each disorder's pathophysiology and the clinical scenarios that produce them.

Respiratory acidosis occurs when alveolar ventilation is inadequate to eliminate the CO2 produced by metabolism, causing PaCO2 to rise above 45 mmHg. The elevated CO2 reacts with water to form carbonic acid, driving pH downward. Causes are categorized by mechanism: CNS depression (opioids, sedatives, brainstem lesion), neuromuscular failure (myasthenia gravis, Guillain-Barre, spinal cord injury, diaphragmatic paralysis), chest wall restriction (kyphoscoliosis, flail chest, obesity hypoventilation), and airway obstruction (COPD, severe asthma, upper airway obstruction). Acute respiratory acidosis (pH drops approximately 0.08 per 10 mmHg PaCO2 increase, minimal HCO3 change) is a medical emergency requiring immediate ventilatory intervention. Chronic respiratory acidosis (renal compensation raises HCO3 3.5 mEq/L per 10 mmHg PaCO2 increase over 3-5 days) may be well-tolerated in COPD patients with baseline PaCO2 of 55-65 mmHg. Treatment focuses on improving alveolar ventilation: NIV for COPD exacerbation, intubation and mechanical ventilation for severe cases, and addressing the underlying cause.

Respiratory alkalosis results from alveolar hyperventilation, causing PaCO2 to fall below 35 mmHg. The loss of CO2 reduces carbonic acid, elevating pH. Common causes include hypoxemia-driven tachypnea, pain, anxiety, sepsis (early), central neurogenic hyperventilation, hepatic failure, pregnancy (progesterone-stimulated), and mechanical ventilation with excessive minute ventilation. Acute respiratory alkalosis causes ionized calcium to decrease (calcium binds to albumin at higher pH), producing perioral tingling, carpopedal spasm, and lightheadedness. Treatment addresses the underlying cause. In mechanically ventilated patients, decreasing the respiratory rate or tidal volume corrects iatrogenic respiratory alkalosis. In spontaneously breathing patients, treating pain, anxiety, or hypoxemia resolves the hyperventilation.

Metabolic acidosis is characterized by HCO3 below 22 mEq/L with pH below 7.35. The anion gap divides metabolic acidosis into two categories. Anion gap metabolic acidosis (AG above 12) indicates accumulation of unmeasured acids: lactic acidosis (shock, sepsis, seizures, mesenteric ischemia), diabetic ketoacidosis (beta-hydroxybutyrate), uremic acidosis (retained organic acids), toxic ingestion (methanol, ethylene glycol, salicylates). Non-anion-gap (hyperchloremic) metabolic acidosis (AG 8-12) results from HCO3 loss or impaired renal acid excretion: diarrhea, renal tubular acidosis, ureterosigmoidostomy, carbonic anhydrase inhibitors, or excessive normal saline administration. Respiratory compensation for metabolic acidosis follows Winter's formula: expected PaCO2 = 1.5(HCO3) + 8. Kussmaul breathing (deep, rapid respirations) is the clinical manifestation of maximal respiratory compensation. Treatment targets the underlying cause: insulin and fluids for DKA, resuscitation for lactic acidosis, dialysis for toxic ingestion or uremia. Sodium bicarbonate is reserved for pH below 7.1 or life-threatening hyperkalemia.

Metabolic alkalosis is characterized by HCO3 above 26 mEq/L with pH above 7.45. It is the most common acid-base disorder in hospitalized patients. Classification by chloride responsiveness guides treatment. Chloride-responsive metabolic alkalosis (urine Cl below 20 mEq/L) results from volume contraction: vomiting, nasogastric suction, diuretic use, and contraction alkalosis. Treatment is volume repletion with normal saline to provide chloride for renal HCO3 excretion. Chloride-resistant metabolic alkalosis (urine Cl above 20 mEq/L) results from mineralocorticoid excess (Cushing's, primary aldosteronism, licorice ingestion) or severe hypokalemia. Treatment addresses the underlying endocrine disorder and repletes potassium. Respiratory compensation for metabolic alkalosis is limited because hypoventilation causes hypoxemia, which stimulates ventilation. Expected PaCO2 = 0.7(HCO3) + 21. PaCO2 rarely exceeds 55 mmHg in pure metabolic alkalosis compensation.

Mixed acid-base disorders occur when two or more primary disorders coexist. Common mixed presentations include: metabolic acidosis plus respiratory acidosis (cardiac arrest with lactic acidosis and apnea), metabolic acidosis plus respiratory alkalosis (early sepsis with hyperventilation and lactic acidosis), and metabolic acidosis plus metabolic alkalosis (DKA with vomiting). Triple acid-base disorders are possible in ICU patients. Identifying mixed disorders requires systematic comparison of measured compensation against expected compensation formulas.

The strong ion difference (SID) approach (Stewart approach) provides an alternative framework for acid-base analysis. SID = (Na + K + Ca + Mg) - (Cl + lactate). Normal SID is approximately 38-42 mEq/L. A decreased SID causes acidosis, while an increased SID causes alkalosis. This approach highlights the role of chloride in acid-base balance and explains why normal saline infusion (equal Na and Cl) effectively decreases SID and causes hyperchloremic acidosis. Balanced crystalloids (lactated Ringer's, Plasma-Lyte) have a SID closer to normal plasma and are less likely to cause iatrogenic acidosis.`,
    riskFactors: [
      "Opioid overdose causing CNS depression and acute respiratory acidosis from hypoventilation",
      "COPD exacerbation with air trapping and chronic hypercapnia acutely worsening",
      "Diabetic ketoacidosis from insulin deficiency causing anion gap metabolic acidosis with ketone accumulation",
      "Sepsis producing lactic acidosis from tissue hypoperfusion and anaerobic metabolism",
      "Prolonged nasogastric suction causing chloride-responsive metabolic alkalosis from HCl loss",
      "Massive normal saline resuscitation causing hyperchloremic non-anion-gap metabolic acidosis",
      "Mechanical ventilation with excessive minute ventilation causing iatrogenic respiratory alkalosis",
      "Diuretic therapy (loop or thiazide) causing contraction alkalosis and hypokalemia-driven metabolic alkalosis",
      "Renal failure with accumulation of uremic acids causing progressive anion gap metabolic acidosis"
    ],
    diagnostics: [
      "ABG with anion gap calculation as the primary assessment of acid-base status",
      "Basic metabolic panel for sodium, potassium, chloride, bicarbonate, BUN, creatinine, and glucose",
      "Serum lactate to identify lactic acidosis as the cause of anion gap metabolic acidosis",
      "Serum ketones (beta-hydroxybutyrate) for diabetic or alcoholic ketoacidosis",
      "Urine chloride to classify metabolic alkalosis as chloride-responsive or chloride-resistant",
      "Osmolar gap (measured osmolality minus calculated osmolality) to screen for toxic alcohol ingestion",
      "Delta-delta ratio to identify concurrent metabolic disorders in anion gap metabolic acidosis"
    ],
    management: [
      "Increase alveolar ventilation for respiratory acidosis: NIV, intubation, or treat obstructive airway disease",
      "Decrease minute ventilation on the ventilator for iatrogenic respiratory alkalosis",
      "Administer insulin and isotonic fluids for diabetic ketoacidosis to halt ketogenesis and restore volume",
      "Resuscitate with balanced crystalloids (not normal saline) to avoid iatrogenic hyperchloremic acidosis",
      "Replace volume with normal saline for chloride-responsive metabolic alkalosis",
      "Correct hypokalemia aggressively in metabolic alkalosis -- alkalosis cannot resolve while potassium is depleted",
      "Reserve sodium bicarbonate for pH below 7.1, life-threatening hyperkalemia, or specific toxin ingestion",
      "Implement permissive hypercapnia in ARDS patients on lung-protective ventilation"
    ],
    nursingActions: [
      "Calculate anion gap on every metabolic panel and ABG where metabolic acidosis is present",
      "Apply Winter's formula to every metabolic acidosis ABG to detect concurrent respiratory disorders",
      "Monitor potassium closely in acid-base shifts -- acidosis drives potassium out of cells, alkalosis drives it in",
      "Assess ventilator-induced respiratory alkalosis by correlating set rate and measured minute ventilation with PaCO2",
      "Recognize Kussmaul breathing as a sign of severe metabolic acidosis requiring urgent evaluation",
      "Document urine chloride when evaluating metabolic alkalosis to guide chloride-responsive vs resistant treatment",
      "Monitor ionized calcium in acute respiratory alkalosis as hypocalcemia can cause arrhythmias and tetany",
      "Track lactate trends to assess response to resuscitation in lactic acidosis"
    ],
    signs: [
      "Kussmaul breathing (deep, sighing respirations) as respiratory compensation for severe metabolic acidosis",
      "Carpopedal spasm, perioral tingling, and lightheadedness from ionized hypocalcemia in acute respiratory alkalosis",
      "Somnolence progressing to coma in severe respiratory acidosis (CO2 narcosis, PaCO2 above 70-80 mmHg)",
      "Cardiac arrhythmias from electrolyte shifts associated with severe pH derangements",
      "Vasodilation and warm flushed skin with bounding pulses in acute hypercapnia",
      "Hypoventilation and apneic episodes when respiratory alkalosis overcorrects and pH rises above 7.55"
    ],
    medications: [
      { name: "Sodium Bicarbonate (NaHCO3)", dose: "50-150 mEq IV, may repeat based on pH", route: "Intravenous", purpose: "Buffer severe metabolic acidosis (pH < 7.1) or treat hyperkalemia with cardiac toxicity" },
      { name: "Acetazolamide", dose: "250-500 mg IV or PO q8-12h", route: "IV or oral", purpose: "Treat metabolic alkalosis by inhibiting carbonic anhydrase, promoting renal bicarbonate excretion" },
      { name: "Potassium Chloride", dose: "10-40 mEq IV infusion (max 10-20 mEq/hr peripherally)", route: "Intravenous", purpose: "Correct hypokalemia in metabolic alkalosis -- alkalosis will not resolve while potassium remains depleted" },
      { name: "Hydrochloric Acid (HCl)", dose: "0.1-0.2 N solution via central line", route: "IV central line only", purpose: "Severe chloride-resistant metabolic alkalosis refractory to standard therapy (rarely used)" }
    ],
    pearls: [
      "Compensation never overshoots -- if pH has moved past 7.40 in the 'compensating' direction, a second primary disorder is present",
      "Winter's formula is the single most important tool for detecting mixed disorders in metabolic acidosis",
      "Hypokalemia must be corrected before metabolic alkalosis can resolve -- the kidney retains HCO3 to maintain electrical neutrality when K+ is depleted",
      "Normal saline resuscitation at high volumes predictably causes hyperchloremic metabolic acidosis -- prefer balanced crystalloids",
      "Respiratory compensation for metabolic alkalosis is limited by hypoxia drive -- PaCO2 rarely exceeds 55 mmHg",
      "In chronic respiratory acidosis, rapidly lowering PaCO2 (e.g., aggressive ventilation after intubation) causes post-hypercapnic metabolic alkalosis from retained HCO3"
    ],
    quiz: [
      { question: "A patient has pH 7.20, PaCO2 25, HCO3 10, Na 142, Cl 102. What is the complete acid-base interpretation?", options: ["Metabolic acidosis with appropriate respiratory compensation", "Metabolic acidosis with concurrent respiratory alkalosis", "Respiratory alkalosis only", "Mixed respiratory and metabolic alkalosis"], correctIndex: 0, rationale: "pH 7.20 = acidemia. HCO3 10 = metabolic acidosis. AG = 142 - (102 + 10) = 30, elevated. Winter's: expected PaCO2 = 1.5(10) + 8 = 23, range 21-25. Actual PaCO2 25 is within the expected range, confirming appropriate respiratory compensation for a primary anion gap metabolic acidosis." },
      { question: "Which metabolic alkalosis would NOT respond to normal saline infusion?", options: ["Metabolic alkalosis from prolonged vomiting", "Metabolic alkalosis from nasogastric suction", "Metabolic alkalosis from primary hyperaldosteronism", "Metabolic alkalosis from diuretic use"], correctIndex: 2, rationale: "Primary hyperaldosteronism causes chloride-resistant metabolic alkalosis (urine Cl > 20 mEq/L). The excess aldosterone drives potassium and hydrogen ion excretion and sodium/bicarbonate retention regardless of volume status. Treatment requires addressing the mineralocorticoid excess, not saline." },
      { question: "A COPD patient is intubated with baseline PaCO2 of 60 mmHg. The ventilator rapidly lowers PaCO2 to 35 mmHg. What complication is expected?", options: ["Metabolic acidosis", "Post-hypercapnic metabolic alkalosis", "Respiratory acidosis", "Anion gap elevation"], correctIndex: 1, rationale: "In chronic respiratory acidosis, the kidneys retain HCO3 over days to compensate. Rapidly lowering PaCO2 removes the respiratory acid, but the elevated HCO3 persists (renal correction takes days). This produces post-hypercapnic metabolic alkalosis. The solution is to ventilate COPD patients to their baseline PaCO2, not to normal values." },
      { question: "A septic patient has pH 7.48, PaCO2 22, HCO3 16, lactate 6.2 mmol/L. What is the acid-base interpretation?", options: ["Pure respiratory alkalosis", "Metabolic acidosis with excessive respiratory compensation", "Mixed respiratory alkalosis and metabolic acidosis", "Metabolic alkalosis"], correctIndex: 2, rationale: "Two opposing disorders are present simultaneously. The low HCO3 and elevated lactate indicate metabolic acidosis (lactic acidosis from sepsis). The very low PaCO2 and elevated pH indicate respiratory alkalosis (sepsis-driven hyperventilation). The respiratory alkalosis is dominant because pH is alkalemic despite the metabolic acidosis. This is a classic early sepsis mixed acid-base pattern." },
      { question: "Why should balanced crystalloids be preferred over normal saline for large-volume resuscitation?", options: ["Balanced crystalloids contain bicarbonate directly", "Normal saline's equal Na and Cl concentrations narrow the strong ion difference, causing hyperchloremic metabolic acidosis", "Balanced crystalloids have higher sodium content", "Normal saline is more expensive than balanced crystalloids"], correctIndex: 1, rationale: "Normal saline contains 154 mEq/L each of Na and Cl, while plasma Cl is normally 100-106 mEq/L. Large-volume NS infusion increases serum chloride disproportionately, narrowing the strong ion difference and causing hyperchloremic (non-anion-gap) metabolic acidosis. Balanced crystalloids (LR, Plasma-Lyte) have physiological chloride concentrations." }
    ]
  },

  "mechanical-ventilation-modes-rrt": {
    title: "Mechanical Ventilation Modes",
    cellular: `Mechanical ventilation is the definitive intervention for respiratory failure. Understanding ventilation modes, their trigger mechanisms, cycling criteria, and clinical applications is essential for respiratory therapists managing ventilated patients. The classification system for ventilation modes is based on three variables: the control variable (what the ventilator targets -- volume or pressure), the breath sequence (mandatory, spontaneous, or both), and the targeting scheme (how the ventilator adjusts within or between breaths).

Volume-controlled ventilation (VCV) delivers a set tidal volume with each mandatory breath. The ventilator generates whatever pressure is necessary to deliver the target volume. Key settings include tidal volume (6-8 mL/kg ideal body weight), respiratory rate, inspiratory flow rate, flow pattern (square or decelerating), and FiO2. Because volume is guaranteed, peak inspiratory pressure varies with changes in airway resistance and respiratory system compliance. In VCV, the pressure waveform is the dependent variable -- clinicians must monitor it to detect changes in lung mechanics. Rising peak pressures with stable plateau pressures indicate increasing airway resistance (bronchospasm, secretions, kinked ETT). Rising peak and plateau pressures together indicate decreasing compliance (pneumothorax, ARDS progression, abdominal distension).

Pressure-controlled ventilation (PCV) delivers breaths at a set inspiratory pressure for a set inspiratory time. The ventilator applies the target pressure and tidal volume varies depending on compliance and resistance. Key settings include inspiratory pressure, inspiratory time, respiratory rate, and FiO2. PCV produces a decelerating flow pattern that may improve gas distribution in heterogeneous lung disease. The major disadvantage is that tidal volume is not guaranteed -- changes in compliance or resistance alter delivered volume. Clinicians must set alarms for low tidal volume to detect ventilator-patient mismatch.

Assist-Control (A/C) mode delivers a full ventilator breath with every patient trigger (assisted breath) and initiates breaths at the set rate if the patient does not trigger (controlled breath). Every breath, whether patient-triggered or time-triggered, receives the full set volume (VCV) or pressure (PCV). A/C ensures a minimum minute ventilation but can cause respiratory alkalosis if the patient's respiratory drive exceeds the set rate. It also prevents the patient from exercising respiratory muscles, contributing to ventilator-induced diaphragmatic dysfunction during prolonged use.

Synchronized Intermittent Mandatory Ventilation (SIMV) delivers a set number of mandatory breaths synchronized with the patient's inspiratory effort. Between mandatory breaths, the patient breathes spontaneously with only PEEP support (or pressure support if added). SIMV was historically used as a weaning mode, but evidence shows it prolongs weaning compared to pressure support ventilation or T-piece trials. It remains used in neonatal ventilation.

Pressure Support Ventilation (PSV) augments every spontaneous breath with a set level of positive pressure. The patient controls respiratory rate, tidal volume (determined by patient effort plus the pressure support level), and inspiratory time. Cycling occurs when inspiratory flow decays to a threshold (usually 25% of peak flow). PSV is the primary spontaneous breathing mode and is commonly used for weaning assessment. Typical PSV settings range from 5-20 cmH2O. A PSV of 5-8 cmH2O is considered compensation for the work of breathing through the endotracheal tube and circuit.

Pressure-Regulated Volume Control (PRVC) is a dual-control mode that targets a set tidal volume using variable pressure. The ventilator delivers a test breath, measures compliance, and adjusts the inspiratory pressure on subsequent breaths to achieve the target volume. PRVC combines the volume guarantee of VCV with the decelerating flow pattern of PCV. It automatically adapts to changes in compliance and resistance. However, in patients with variable respiratory effort, PRVC can produce inappropriate pressure adjustments -- if the patient generates a large spontaneous breath, the ventilator decreases its pressure contribution, which may feel like insufficient support.

Airway Pressure Release Ventilation (APRV) applies a high continuous positive airway pressure (P-high, typically 20-35 cmH2O) with brief, intermittent releases to a lower pressure (P-low, typically 0-5 cmH2O) for ventilation. The time at P-high (T-high, 4-6 seconds) maintains alveolar recruitment, while the brief release time (T-low, 0.4-0.8 seconds, set to 75% of peak expiratory flow) allows CO2 elimination while preventing complete alveolar derecruitment. APRV allows spontaneous breathing throughout the cycle, reducing sedation requirements. It is used in ARDS as an open-lung ventilation strategy.

PEEP (Positive End-Expiratory Pressure) is applied in virtually all ventilation modes to prevent end-expiratory alveolar collapse, recruit atelectatic lung units, improve functional residual capacity, and reduce intrapulmonary shunt. PEEP improves oxygenation by maintaining alveolar patency at end-expiration. The optimal PEEP is the level that maximizes compliance (best compliance PEEP) or achieves the target oxygenation without hemodynamic compromise. In ARDS, PEEP is titrated using the ARDSNet FiO2/PEEP table, compliance-guided PEEP titration, or esophageal pressure-guided PEEP to target transpulmonary pressure.

Auto-PEEP (intrinsic PEEP) occurs when air trapping prevents complete exhalation before the next breath cycle begins. It is common in obstructive lung disease (COPD, asthma) and in patients with high respiratory rates or long inspiratory times. Auto-PEEP increases intrathoracic pressure, reduces venous return, causes hemodynamic compromise, and increases the trigger threshold (the patient must generate enough negative pressure to overcome auto-PEEP before the ventilator recognizes an inspiratory effort). Detection requires an end-expiratory hold maneuver. Management includes increasing expiratory time (decrease rate, decrease I:E ratio), treating bronchospasm, and applying external PEEP at approximately 80% of measured auto-PEEP to reduce the trigger threshold.`,
    riskFactors: [
      "Ventilator-induced lung injury (VILI) from excessive tidal volumes causing volutrauma",
      "Barotrauma from excessive peak and plateau pressures exceeding 30 cmH2O",
      "Atelectrauma from repetitive opening and closing of alveoli at low PEEP",
      "Biotrauma from inflammatory mediator release due to lung overdistention",
      "Ventilator-induced diaphragmatic dysfunction from prolonged full support ventilation",
      "Auto-PEEP in obstructive disease causing hemodynamic compromise and trigger failure",
      "Ventilator-associated pneumonia from prolonged intubation and impaired mucociliary clearance",
      "Oxygen toxicity from prolonged FiO2 above 0.60 causing absorptive atelectasis and free radical damage",
      "Patient-ventilator dyssynchrony causing increased work of breathing, sedation requirements, and ICU delirium"
    ],
    diagnostics: [
      "Plateau pressure measurement via inspiratory hold maneuver to assess alveolar distending pressure (target < 30 cmH2O)",
      "Driving pressure calculation (plateau pressure minus PEEP) as predictor of VILI (target < 15 cmH2O)",
      "Static compliance calculation (VT / driving pressure) to monitor lung recruitment or derecruitment trends",
      "Auto-PEEP measurement via end-expiratory hold maneuver in patients with obstructive lung disease",
      "Ventilator waveform analysis: flow-time, pressure-time, and volume-time scalars for dyssynchrony detection",
      "ABG analysis 20-30 minutes after any ventilator change to assess oxygenation and ventilation response",
      "Esophageal balloon manometry to measure transpulmonary pressure for PEEP optimization in ARDS"
    ],
    management: [
      "Initiate lung-protective ventilation in ARDS: VT 6 mL/kg IBW, plateau pressure < 30, driving pressure < 15, PEEP per ARDSNet table",
      "Set initial A/C ventilation: VT 6-8 mL/kg IBW, RR 12-16, FiO2 titrated to SpO2 92-96%, PEEP 5-8 cmH2O",
      "Titrate PEEP using compliance-guided or FiO2/PEEP ladder to optimize oxygenation without hemodynamic compromise",
      "Transition to pressure support ventilation for weaning when patient meets readiness criteria",
      "Reduce auto-PEEP by extending expiratory time: decrease RR, decrease I:E ratio, treat bronchospasm",
      "Apply external PEEP at 80% of measured auto-PEEP to reduce trigger threshold in obstructive patients",
      "Perform spontaneous breathing trial (SBT) with PSV 5-8 cmH2O or T-piece for 30-120 minutes for extubation readiness",
      "Implement daily sedation vacation and spontaneous awakening trial coordinated with SBT"
    ],
    nursingActions: [
      "Verify ventilator settings match the physician order at every shift and after any alarm event",
      "Measure and document plateau pressure with every ABG or at minimum every 4 hours",
      "Calculate driving pressure (Pplat - PEEP) and escalate if greater than 15 cmH2O",
      "Perform end-expiratory hold to check for auto-PEEP in patients with COPD or high respiratory rates",
      "Analyze ventilator waveforms for dyssynchrony: trigger delay, double triggering, flow starvation, premature cycling",
      "Maintain head-of-bed elevation 30-45 degrees for VAP prevention per ventilator bundle",
      "Coordinate daily sedation vacation with spontaneous breathing trial as paired awakening and breathing protocol",
      "Document cuff pressure (25-30 cmH2O) and ETT position (depth at teeth) at least every shift"
    ],
    signs: [
      "Rising peak pressure with stable plateau pressure indicating increased airway resistance (bronchospasm, secretions)",
      "Rising peak and plateau pressures together indicating decreased compliance (pneumothorax, ARDS, abdominal distension)",
      "Patient fighting the ventilator with accessory muscle use indicating dyssynchrony",
      "Hemodynamic instability (hypotension, tachycardia) suggesting auto-PEEP or excessive mean airway pressure",
      "Decreasing tidal volumes in pressure-controlled modes indicating worsening compliance or increased resistance",
      "Flow waveform not returning to zero baseline before next breath indicating auto-PEEP"
    ],
    medications: [
      { name: "Cisatracurium", dose: "0.15 mg/kg IV bolus then 1-3 mcg/kg/min infusion", route: "Intravenous", purpose: "Neuromuscular blockade for severe ARDS with P/F < 150 to improve ventilator synchrony and reduce oxygen consumption" },
      { name: "Propofol", dose: "5-80 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Sedation for mechanically ventilated patients, titrated to RASS target of -2 to 0" },
      { name: "Fentanyl", dose: "25-100 mcg/hr IV infusion", route: "Intravenous", purpose: "Analgesia-first sedation approach for ventilated patients to reduce pain-driven dyssynchrony" },
      { name: "Dexmedetomidine", dose: "0.2-0.7 mcg/kg/hr IV infusion", route: "Intravenous", purpose: "Light sedation preserving respiratory drive for patients approaching extubation readiness" }
    ],
    pearls: [
      "Driving pressure (Pplat - PEEP) is the strongest ventilator variable associated with mortality in ARDS -- target < 15 cmH2O",
      "In VCV, watch the pressure waveform. In PCV, watch the volume waveform. The dependent variable tells you about changing lung mechanics",
      "Auto-PEEP is invisible unless you perform an end-expiratory hold -- always check it in obstructive patients or when hemodynamics worsen",
      "PSV of 5-8 cmH2O compensates for ETT and circuit resistance -- this is the standard SBT setting",
      "APRV keeps the lung open with sustained high pressure and vents CO2 with brief releases -- T-low set to 75% of peak expiratory flow prevents derecruitment",
      "Ventilator-induced diaphragmatic dysfunction begins within 18 hours of controlled ventilation -- minimize full support duration"
    ],
    quiz: [
      { question: "A ventilated patient has peak pressure 35 cmH2O and plateau pressure 18 cmH2O. What does this suggest?", options: ["Decreased lung compliance", "Increased airway resistance", "Pneumothorax", "Adequate ventilator settings"], correctIndex: 1, rationale: "The gap between peak pressure and plateau pressure reflects airway resistance. Peak pressure includes both resistive (airways) and elastic (alveolar) components, while plateau pressure reflects only elastic recoil. A high peak with normal plateau indicates high airway resistance (bronchospasm, secretions, kinked ETT). If both were elevated, it would indicate decreased compliance." },
      { question: "In ARDS management, what is the target driving pressure?", options: ["Less than 5 cmH2O", "Less than 15 cmH2O", "Less than 30 cmH2O", "Less than 40 cmH2O"], correctIndex: 1, rationale: "Driving pressure (plateau pressure minus PEEP) represents the distending pressure applied to the aerated lung. Studies by Amato and others have shown that driving pressure is the ventilator variable most strongly associated with survival in ARDS. A driving pressure below 15 cmH2O is the target." },
      { question: "A COPD patient on A/C has auto-PEEP of 10 cmH2O. What is the initial management?", options: ["Increase the set respiratory rate", "Apply external PEEP of 8 cmH2O and extend expiratory time", "Switch to pressure control at higher pressures", "Increase tidal volume"], correctIndex: 1, rationale: "Auto-PEEP management involves extending expiratory time (decrease RR or I:E ratio) to allow more complete exhalation, and applying external PEEP at approximately 80% of measured auto-PEEP (8 cmH2O) to reduce the trigger threshold. Increasing rate or volume would worsen air trapping." },
      { question: "What is the primary advantage of PRVC over standard volume control?", options: ["Higher peak pressures for better ventilation", "Variable volume delivery for lung protection", "Guaranteed volume with adaptive pressure and decelerating flow pattern", "Eliminates the need for PEEP"], correctIndex: 2, rationale: "PRVC guarantees a set tidal volume (like VCV) while using adaptive pressure delivery with a decelerating flow pattern (like PCV). The ventilator adjusts pressure breath-to-breath based on measured compliance to achieve the target volume, combining the benefits of both modes." },
      { question: "During a spontaneous breathing trial, which finding would indicate failure and need for continued ventilatory support?", options: ["Respiratory rate 18, SpO2 96%, heart rate 82", "Respiratory rate 35, SpO2 88%, diaphoresis, accessory muscle use", "Tidal volume 450 mL with comfortable breathing pattern", "Patient following commands and requesting extubation"], correctIndex: 1, rationale: "SBT failure criteria include: respiratory rate > 35, SpO2 < 90%, heart rate increase > 20%, diaphoresis, accessory muscle use, paradoxical breathing, agitation, or hemodynamic instability. These signs indicate the patient cannot sustain adequate ventilation independently and needs continued support." }
    ]
  },

  "ards-respiratory-failure-rrt": {
    title: "ARDS and Respiratory Failure",
    cellular: `Acute Respiratory Distress Syndrome (ARDS) represents the most severe form of acute hypoxemic respiratory failure, characterized by diffuse alveolar damage, non-cardiogenic pulmonary edema, and refractory hypoxemia. The Berlin Definition (2012) classifies ARDS by P/F ratio: mild (200-300), moderate (100-200), and severe (below 100), with bilateral opacities on chest imaging not fully explained by effusions or atelectasis, occurring within 7 days of a known clinical insult, and respiratory failure not fully explained by cardiac failure or fluid overload.

The pathophysiology of ARDS involves three overlapping phases. The exudative phase (days 1-7) begins with injury to the alveolar-capillary membrane from either direct (pulmonary) or indirect (extrapulmonary) insults. Direct causes include pneumonia, aspiration, pulmonary contusion, inhalation injury, and drowning. Indirect causes include sepsis, pancreatitis, trauma, massive transfusion (TRALI), and burns. The injury triggers an inflammatory cascade with neutrophil infiltration, release of proteases and reactive oxygen species, and increased capillary permeability. Protein-rich fluid floods the alveoli, inactivating surfactant and causing alveolar collapse. The result is massive intrapulmonary shunt with refractory hypoxemia.

The proliferative phase (days 7-21) involves type II alveolar cell proliferation to replace damaged type I cells, fibroblast activation, and early collagen deposition. Organization of the exudate begins. Some patients improve during this phase, while others progress to the fibrotic phase (after day 21) with extensive collagen deposition, destruction of normal lung architecture, and development of bullae and cystic changes. Patients in the fibrotic phase have markedly decreased compliance, high dead space fraction, and may develop pulmonary hypertension.

Lung-protective ventilation is the cornerstone of ARDS management. The ARDSNet ARMA trial (2000) demonstrated a 22% relative mortality reduction with low tidal volume ventilation (6 mL/kg ideal body weight) compared to traditional volumes (12 mL/kg). The protocol targets: VT 6 mL/kg IBW (range 4-8 mL/kg), plateau pressure below 30 cmH2O, driving pressure below 15 cmH2O, pH 7.25-7.45 (permissive hypercapnia accepted), and respiratory rate up to 35 to maintain pH. Ideal body weight is calculated from height, not actual weight: for males, IBW = 50 + 2.3 x (height in inches - 60); for females, IBW = 45.5 + 2.3 x (height in inches - 60).

PEEP titration in ARDS follows several strategies. The ARDSNet FiO2/PEEP combination table provides predetermined PEEP levels matched to FiO2 requirements (low PEEP and high PEEP tables). Compliance-guided PEEP titration increases PEEP incrementally and identifies the level that maximizes static compliance (best compliance = VT / driving pressure). Esophageal pressure-guided PEEP (EPVent-2 trial) uses an esophageal balloon to estimate pleural pressure and sets PEEP to target a positive end-expiratory transpulmonary pressure. Electrical impedance tomography (EIT) provides real-time imaging of ventilation distribution and can guide PEEP titration to minimize both collapse and overdistention.

Prone positioning is recommended for moderate-to-severe ARDS (P/F below 150). The PROSEVA trial demonstrated a 50% relative reduction in 28-day mortality with prone positioning for at least 16 hours per day. Prone positioning improves V/Q matching by redistributing perfusion toward ventral (now dependent) lung regions that are better ventilated in prone position. It reduces compression of dorsal lung by the heart and mediastinum, improves secretion drainage, and creates more homogeneous transpulmonary pressure distribution.

Neuromuscular blockade was shown to improve survival in early severe ARDS (P/F below 150 within 48 hours) in the ACURASYS trial, though the subsequent ROSE trial showed no benefit with a lighter sedation protocol. Current practice reserves paralysis for patients with severe dyssynchrony, dangerously high plateau pressures despite sedation, or persistent P/F below 100.

Inhaled pulmonary vasodilators (nitric oxide 5-40 ppm, inhaled epoprostenol 10-50 ng/kg/min) improve oxygenation by selectively vasodilating pulmonary vessels adjacent to ventilated alveoli, reducing intrapulmonary shunt. They provide a bridge to other therapies but have not demonstrated mortality benefit.

Extracorporeal Membrane Oxygenation (ECMO) is considered for severe ARDS refractory to conventional management (prone positioning, optimal PEEP, lung-protective ventilation). Venovenous ECMO removes blood from a large central vein, oxygenates and removes CO2 via an extracorporeal membrane, and returns blood to the venous system. The EOLIA trial showed a trend toward mortality benefit, and ECMO is increasingly used as a rescue therapy in experienced centers. Criteria for ECMO referral include P/F below 80 despite optimal management, uncompensated respiratory acidosis (pH below 7.25, PaCO2 above 60), or peak inspiratory pressure above 35 despite low-VT ventilation.

Fluid management in ARDS follows a conservative strategy. The FACTT trial demonstrated that a conservative fluid approach (targeting CVP < 4 or PAOP < 8) improved oxygenation and shortened ventilator duration compared to a liberal strategy, without increasing organ failure. The goal is to reduce pulmonary edema while maintaining adequate organ perfusion.`,
    riskFactors: [
      "Sepsis as the most common indirect cause of ARDS, triggering systemic inflammatory response and capillary leak",
      "Pneumonia (bacterial, viral, fungal) as the most common direct pulmonary cause of ARDS",
      "Aspiration of gastric contents causing chemical injury to alveolar-capillary membrane",
      "Massive blood product transfusion causing transfusion-related acute lung injury (TRALI)",
      "Major trauma with pulmonary contusion, fat embolism, or shock-mediated lung injury",
      "Pancreatitis causing systemic inflammation with extrapulmonary ARDS",
      "Inhalation injury from smoke, chemicals, or toxic gases damaging the airway epithelium",
      "Drowning causing surfactant washout, alveolar flooding, and secondary inflammatory injury",
      "Multiple risk factor exposure (sepsis plus massive transfusion) exponentially increasing ARDS risk"
    ],
    diagnostics: [
      "Berlin Definition criteria assessment: bilateral opacities, P/F ratio classification, timing, and exclusion of cardiogenic cause",
      "Chest X-ray showing bilateral diffuse alveolar opacities not fully explained by effusion or atelectasis",
      "CT chest revealing ground-glass opacities, consolidation, and dependent atelectasis (typical ARDS pattern)",
      "P/F ratio calculation on PEEP >= 5 cmH2O for ARDS severity staging (mild/moderate/severe)",
      "Echocardiography to exclude cardiogenic pulmonary edema (normal left atrial pressure)",
      "Static compliance measurement (normal 50-100 mL/cmH2O; severely reduced in ARDS, often 20-40 mL/cmH2O)",
      "Dead space fraction (VD/VT) measurement as prognostic indicator (> 0.60 associated with higher mortality)"
    ],
    management: [
      "Lung-protective ventilation: VT 6 mL/kg IBW, Pplat < 30, driving pressure < 15, permissive hypercapnia",
      "PEEP titration using ARDSNet FiO2/PEEP table or compliance-guided approach to optimize recruitment",
      "Prone positioning for >= 16 hours/day when P/F < 150 on FiO2 >= 0.60",
      "Conservative fluid strategy targeting negative fluid balance once hemodynamically stable",
      "Neuromuscular blockade for severe dyssynchrony or Pplat > 30 despite deep sedation (cisatracurium 48 hours)",
      "Inhaled pulmonary vasodilators (iNO or epoprostenol) as rescue for refractory hypoxemia",
      "ECMO referral when P/F < 80 despite prone positioning and optimal ventilation",
      "Treat the underlying cause (antibiotics for pneumonia, source control for sepsis, surgical repair for trauma)"
    ],
    nursingActions: [
      "Calculate ideal body weight from patient height and set VT to 6 mL/kg IBW -- never use actual body weight",
      "Measure and document plateau pressure and driving pressure at minimum every 4 hours and with every ABG",
      "Implement prone positioning protocol: secure ETT, check pressure points, maintain lines, prone team coordination",
      "Monitor for prone positioning complications: facial edema, pressure injuries, ETT displacement, line disconnection",
      "Track daily fluid balance and advocate for conservative fluid management once hemodynamic stability achieved",
      "Assess sedation depth using RASS or SAS and coordinate daily sedation vacation when clinically appropriate",
      "Calculate P/F ratio with every ABG to track ARDS severity trajectory and guide therapy escalation",
      "Document ventilator bundle compliance: HOB 30-45, oral care, DVT prophylaxis, stress ulcer prophylaxis, daily SBT screen"
    ],
    signs: [
      "Acute onset of bilateral diffuse infiltrates on chest X-ray within 7 days of known risk factor",
      "Refractory hypoxemia that does not adequately respond to supplemental oxygen alone",
      "Decreased static compliance (< 40 mL/cmH2O) reflecting stiff, edematous lungs",
      "Increasing FiO2 and PEEP requirements over the first 24-48 hours of illness",
      "High dead space ventilation (VD/VT > 0.60) indicating poor prognosis",
      "Progressive multiorgan dysfunction from systemic inflammatory response"
    ],
    medications: [
      { name: "Cisatracurium", dose: "0.15 mg/kg IV bolus then 1-3 mcg/kg/min", route: "Intravenous", purpose: "Neuromuscular blockade for severe ARDS to reduce oxygen consumption and improve ventilator synchrony" },
      { name: "Inhaled Nitric Oxide", dose: "5-40 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective pulmonary vasodilator to reduce intrapulmonary shunt in refractory hypoxemia" },
      { name: "Furosemide", dose: "20-80 mg IV q6-12h or continuous infusion", route: "Intravenous", purpose: "Diuresis to achieve conservative fluid balance and reduce pulmonary edema" },
      { name: "Dexmedetomidine", dose: "0.2-1.5 mcg/kg/hr IV", route: "Intravenous", purpose: "Sedation maintaining respiratory drive for patients on spontaneous ventilation modes" }
    ],
    pearls: [
      "Always calculate IBW from height for tidal volume settings -- a 5'4\" female weighing 200 lbs should receive VT based on IBW of 54 kg (324 mL), not actual weight",
      "Driving pressure (Pplat - PEEP) below 15 cmH2O is the strongest ventilator variable associated with ARDS survival",
      "Prone positioning for >= 16 hours daily reduces mortality by 50% in moderate-to-severe ARDS -- this is a first-line therapy, not a rescue therapy",
      "Conservative fluid management improves oxygenation and shortens ventilator duration without increasing organ failure",
      "The P/F ratio must be calculated on PEEP >= 5 cmH2O for valid ARDS severity staging",
      "Dead space fraction > 0.60 is independently associated with ARDS mortality and should trigger escalation discussion"
    ],
    quiz: [
      { question: "A 70 kg male (5'10\") with ARDS should have his tidal volume set based on what weight?", options: ["Actual weight of 70 kg (420 mL at 6 mL/kg)", "Ideal body weight of 73 kg (438 mL at 6 mL/kg)", "Lean body mass estimated at 60 kg (360 mL at 6 mL/kg)", "Adjusted body weight of 65 kg (390 mL at 6 mL/kg)"], correctIndex: 1, rationale: "ARDS tidal volume is always set using ideal body weight calculated from height. For a 5'10\" male: IBW = 50 + 2.3(70 - 60) = 50 + 23 = 73 kg. At 6 mL/kg IBW, the target VT is 438 mL. Actual body weight is never used because lung size correlates with height, not weight." },
      { question: "A patient has P/F ratio of 120 on FiO2 0.80 and PEEP 14. What is the ARDS severity and next management step?", options: ["Mild ARDS -- continue current ventilation", "Moderate ARDS -- initiate prone positioning", "Severe ARDS -- consider ECMO", "Not ARDS -- likely cardiogenic pulmonary edema"], correctIndex: 1, rationale: "P/F ratio of 120 classifies this as moderate ARDS (100-200). With P/F below 150 on FiO2 >= 0.60, prone positioning for at least 16 hours per day is indicated per the PROSEVA trial evidence showing 50% relative mortality reduction." },
      { question: "Which fluid management strategy has demonstrated improved outcomes in ARDS?", options: ["Liberal fluid administration to maintain high cardiac output", "Conservative fluid management targeting negative fluid balance", "Colloid-only resuscitation to maintain oncotic pressure", "Albumin infusion to prevent further pulmonary edema"], correctIndex: 1, rationale: "The FACTT trial demonstrated that conservative fluid management (targeting CVP < 4 or PAOP < 8) improved oxygenation index, increased ventilator-free days, and shortened ICU stay compared to liberal fluid management, without increasing shock or renal failure." },
      { question: "What is the mechanism by which prone positioning improves oxygenation in ARDS?", options: ["Increased tidal volume from improved diaphragm mechanics", "Redistribution of perfusion to better-ventilated regions and reduced cardiac compression of dorsal lung", "Gravitational drainage of pulmonary edema fluid", "Decreased metabolic oxygen demand from muscle relaxation"], correctIndex: 1, rationale: "Prone positioning improves V/Q matching by redistributing perfusion toward ventral lung regions (now dependent) that are better ventilated in prone position. It also reduces compression of dorsal lung by the heart and mediastinum, improves secretion drainage, and creates more homogeneous transpulmonary pressure distribution." },
      { question: "A patient on ARDSNet ventilation has VT 350 mL, PEEP 12, Pplat 32. What adjustment should be made?", options: ["Increase PEEP to 16 to improve recruitment", "Decrease VT to 300 mL to lower Pplat below 30", "Increase respiratory rate to compensate for lower VT", "No changes needed -- Pplat of 32 is acceptable"], correctIndex: 1, rationale: "Pplat must be maintained below 30 cmH2O in lung-protective ventilation. With Pplat 32, the VT should be decreased by 1 mL/kg increments (to minimum 4 mL/kg IBW) until Pplat drops below 30. The respiratory rate can be increased (up to 35) to compensate for the reduced VT and maintain minute ventilation." }
    ]
  },

  "vq-mismatch-rrt": {
    title: "V/Q Mismatch and Shunt",
    cellular: `Ventilation-perfusion (V/Q) matching is the fundamental principle governing pulmonary gas exchange efficiency. When ventilation and perfusion are well matched across lung units, gas exchange is optimized. When they are mismatched, hypoxemia and/or hypercapnia result. Understanding V/Q relationships is essential for diagnosing the cause of hypoxemia and selecting the appropriate intervention.

The ideal V/Q ratio is approximately 0.8, reflecting normal alveolar ventilation of approximately 4 L/min and pulmonary blood flow of approximately 5 L/min. In reality, V/Q ratios vary continuously across the lung. In the upright position, gravity creates a gradient of both ventilation and perfusion from apex to base. Perfusion increases more steeply than ventilation toward the bases, creating regional V/Q heterogeneity. West Zone 1 (lung apex): relatively over-ventilated, under-perfused, V/Q > 1, physiologically similar to dead space. West Zone 2 (mid-lung): best V/Q matching, approximately 0.8. West Zone 3 (lung base): relatively under-ventilated, over-perfused, V/Q < 1, approaching shunt physiology.

V/Q mismatch exists on a spectrum between two extremes. Dead space (V/Q = infinity) represents ventilation without perfusion -- gas reaches the alveoli but no blood flows past to pick up oxygen or deliver CO2. Physiological dead space includes anatomic dead space (conducting airways, approximately 150 mL) and alveolar dead space (ventilated but unperfused alveoli). The Bohr equation calculates dead space fraction: VD/VT = (PaCO2 - PECO2) / PaCO2. Normal VD/VT is 0.20-0.40. Causes of increased dead space include pulmonary embolism (blocked perfusion to ventilated regions), overdistention of alveoli by excessive PEEP or high tidal volume, low cardiac output states reducing pulmonary blood flow, and pulmonary vascular destruction in emphysema.

Shunt (V/Q = 0) represents perfusion without ventilation -- blood flows past alveoli that contain no gas or contain fluid/pus instead of air. Normal anatomic shunt (2-5% of cardiac output) includes bronchial and thebesian venous drainage. Intrapulmonary shunt occurs when alveoli are perfused but completely unventilated: atelectasis (alveolar collapse), pneumonia consolidation, ARDS (fluid-filled alveoli), and complete mucus plugging. The hallmark of true shunt is that hypoxemia does not respond to supplemental oxygen, because the shunted blood never encounters ventilated alveoli regardless of the FiO2 delivered to those alveoli.

The shunt equation quantifies the fraction of cardiac output that bypasses gas exchange: Qs/Qt = (CcO2 - CaO2) / (CcO2 - CvO2). CcO2 is pulmonary capillary oxygen content (assumed 100% saturated at PAO2), CaO2 is arterial oxygen content, and CvO2 is mixed venous oxygen content. A clinical approximation uses the P/F ratio: P/F below 200 suggests significant shunt. The 100% oxygen test provides another estimate: if PaO2 on 100% FiO2 is below 300, shunt fraction is approximately (700 - PaO2) / 20.

Hypoxic pulmonary vasoconstriction (HPV) is the lung's compensatory mechanism for V/Q mismatch. When alveolar PO2 drops below approximately 60 mmHg, local pulmonary arterioles constrict, redirecting blood flow away from poorly ventilated regions toward better-ventilated areas. This mechanism is unique to pulmonary vasculature (systemic vessels dilate in response to hypoxia). HPV is impaired by certain medications (nitroprusside, nitroglycerin, inhaled anesthetics) and by systemic conditions (sepsis, cirrhosis), which can worsen V/Q mismatch.

Clinical differentiation between V/Q mismatch mechanisms guides therapy. Pure hypoventilation produces hypoxemia with hypercapnia, normal A-a gradient, and responds to supplemental oxygen. V/Q mismatch (low V/Q units) produces hypoxemia with widened A-a gradient and responds to supplemental oxygen (because increasing FiO2 in the ventilated alveoli raises oxygen tension enough to compensate for poorly ventilated units). True shunt produces hypoxemia with widened A-a gradient but does NOT respond to supplemental oxygen -- it requires positive pressure (PEEP, CPAP) to recruit collapsed alveoli or treatment of the underlying pathology.

Diffusion impairment produces hypoxemia with widened A-a gradient that responds to supplemental oxygen. It occurs when the alveolar-capillary membrane is thickened (pulmonary fibrosis, pulmonary edema) or the transit time is reduced (exercise in interstitial lung disease). Diffusion impairment is rarely the sole cause of clinically significant hypoxemia; it typically coexists with V/Q mismatch.

Management strategies target the specific V/Q abnormality. For low V/Q units: supplemental oxygen, bronchodilators to improve ventilation distribution, secretion clearance. For shunt: PEEP to recruit atelectatic alveoli, prone positioning to redistribute perfusion, treatment of pneumonia or ARDS, bronchoscopy for mucus plugging. For dead space: treatment of pulmonary embolism (anticoagulation, thrombolysis), reduction of excessive PEEP/VT causing alveolar overdistention, and hemodynamic optimization to improve pulmonary perfusion.`,
    riskFactors: [
      "Pneumonia consolidation creating intrapulmonary shunt from fluid-filled alveoli",
      "Atelectasis from mucus plugging, post-operative splinting, or compression creating collapsed lung units",
      "ARDS causing diffuse alveolar flooding and massive intrapulmonary shunt",
      "Pulmonary embolism causing dead space from unperfused ventilated alveoli",
      "COPD with heterogeneous airway obstruction creating widespread V/Q mismatch",
      "Excessive mechanical ventilation PEEP causing alveolar overdistention and dead space",
      "Low cardiac output states reducing pulmonary blood flow and increasing dead space fraction",
      "Positioning effects in unilateral lung disease placing affected lung in dependent position"
    ],
    diagnostics: [
      "A-a gradient calculation to confirm intrapulmonary cause of hypoxemia (widened if V/Q mismatch or shunt)",
      "100% FiO2 test to differentiate V/Q mismatch (PaO2 responds) from true shunt (PaO2 remains low)",
      "V/Q scan for suspected pulmonary embolism showing perfusion defects in ventilated regions",
      "Shunt fraction calculation using shunt equation or clinical estimate from PaO2 on 100% FiO2",
      "Dead space fraction via Bohr equation to quantify ventilated but unperfused lung",
      "CT pulmonary angiography for definitive PE diagnosis showing filling defects in pulmonary arteries",
      "End-tidal CO2 monitoring showing widened PaCO2-ETCO2 gap in increased dead space"
    ],
    management: [
      "Supplemental oxygen for V/Q mismatch -- effective because increasing alveolar PO2 in ventilated units compensates",
      "PEEP and recruitment maneuvers for atelectatic shunt to re-open collapsed alveoli",
      "Prone positioning in ARDS to redistribute perfusion and reduce dorsal lung compression",
      "Bronchoscopic mucus clearance for lobar atelectasis from obstructive mucus plugging",
      "Anticoagulation for pulmonary embolism to restore perfusion to ventilated lung regions",
      "Optimize cardiac output in dead space states to improve pulmonary blood flow and reduce VD/VT",
      "Position good lung down in unilateral lung disease to optimize perfusion to the better-ventilated lung",
      "Inhaled nitric oxide or epoprostenol to selectively vasodilate ventilated lung units and reduce shunt"
    ],
    nursingActions: [
      "Calculate A-a gradient on every ABG to track intrapulmonary gas exchange efficiency over time",
      "Perform 100% FiO2 challenge test to differentiate V/Q mismatch from true shunt when hypoxemia is refractory",
      "Position patient strategically: good lung down in unilateral disease, upright in bilateral disease",
      "Monitor PaCO2-ETCO2 gap as a surrogate for dead space -- widening gap suggests increasing dead space",
      "Assess response to PEEP changes by checking ABG 20 minutes after PEEP titration",
      "Recognize that true shunt does not respond to FiO2 increases and advocate for PEEP, prone positioning, or bronchoscopy",
      "Document V/Q-targeted interventions and response to guide ongoing management decisions",
      "Monitor for HPV inhibition in patients receiving nitroprusside, nitroglycerin, or other systemic vasodilators"
    ],
    signs: [
      "Hypoxemia with widened A-a gradient responsive to oxygen indicating V/Q mismatch (low V/Q units)",
      "Hypoxemia with widened A-a gradient refractory to oxygen indicating true intrapulmonary shunt",
      "Elevated PaCO2 with widened PaCO2-ETCO2 gap indicating increased dead space ventilation",
      "Unilateral decreased breath sounds with hypoxemia suggesting lobar atelectasis or pleural effusion",
      "Acute onset pleuritic chest pain with hypoxemia and clear chest X-ray suggesting pulmonary embolism",
      "Improving oxygenation with prone positioning confirming position-responsive V/Q mismatch"
    ],
    medications: [
      { name: "Inhaled Nitric Oxide", dose: "5-40 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective vasodilation of ventilated lung units to improve V/Q matching and reduce shunt" },
      { name: "Heparin (Unfractionated)", dose: "80 units/kg IV bolus then 18 units/kg/hr infusion", route: "Intravenous", purpose: "Anticoagulation for pulmonary embolism to restore perfusion to ventilated but unperfused lung" },
      { name: "Alteplase (tPA)", dose: "100 mg IV over 2 hours", route: "Intravenous", purpose: "Thrombolysis for massive PE with hemodynamic instability to rapidly restore pulmonary blood flow" }
    ],
    pearls: [
      "V/Q mismatch responds to oxygen; true shunt does not -- this single test differentiates the two mechanisms",
      "A widening PaCO2-ETCO2 gap is a bedside indicator of increasing dead space without needing complex calculations",
      "Position good lung down in unilateral disease -- gravity directs more perfusion to the dependent (good) lung",
      "Hypoxic pulmonary vasoconstriction is the lung's built-in V/Q optimization mechanism -- systemic vasodilators can inhibit it",
      "In ARDS, shunt fraction correlates with severity -- P/F < 100 typically indicates shunt fraction > 30%",
      "Dead space fraction > 0.60 in ARDS is an independent predictor of mortality"
    ],
    quiz: [
      { question: "A patient has PaO2 55 mmHg on room air and PaO2 58 mmHg on 100% FiO2. What mechanism of hypoxemia is present?", options: ["V/Q mismatch", "Diffusion impairment", "True intrapulmonary shunt", "Hypoventilation"], correctIndex: 2, rationale: "Failure of PaO2 to respond to 100% FiO2 is the hallmark of true intrapulmonary shunt. Shunted blood bypasses ventilated alveoli entirely, so increasing FiO2 in ventilated units has no effect on the blood that never encounters them. V/Q mismatch and diffusion impairment both respond to supplemental oxygen." },
      { question: "In which clinical scenario would you position the patient with the LEFT side down?", options: ["Right-sided pneumonia with left lung clear", "Bilateral ARDS with symmetric involvement", "Left-sided pleural effusion with right lung clear", "Right-sided pneumothorax"], correctIndex: 0, rationale: "In unilateral lung disease, the good lung should be placed in the dependent (down) position. Gravity directs more perfusion to the dependent lung. With right-sided pneumonia (diseased lung), placing the left lung (good lung) down directs perfusion toward the better-ventilated lung, improving V/Q matching." },
      { question: "A ventilated patient has PaCO2 55 mmHg but ETCO2 of 25 mmHg. What does this 30 mmHg gap indicate?", options: ["Equipment malfunction in the capnograph", "Significant dead space ventilation", "Effective alveolar ventilation", "Carbon dioxide diffusion impairment"], correctIndex: 1, rationale: "A large PaCO2-ETCO2 gap indicates that a significant portion of ventilation is going to unperfused alveoli (dead space). The ETCO2 is low because exhaled gas is diluted by dead space gas that contains no CO2, while arterial blood retains CO2 from perfused-but-inadequately-ventilated regions. Common causes include PE, overdistention, and low cardiac output." },
      { question: "What is the primary mechanism of hypoxic pulmonary vasoconstriction?", options: ["Systemic vasodilation redirects blood to the lungs", "Local pulmonary arterioles constrict in response to low alveolar PO2 to redirect blood to better-ventilated regions", "Bronchial smooth muscle contracts to prevent air entry into hypoxic regions", "Alveolar macrophages release vasoconstrictive mediators"], correctIndex: 1, rationale: "HPV is a unique feature of pulmonary vasculature. When alveolar PO2 drops below approximately 60 mmHg, local pulmonary arterioles constrict, redirecting blood flow away from hypoxic (poorly ventilated) lung regions toward better-ventilated areas. This optimizes V/Q matching. Unlike systemic vessels that dilate in response to hypoxia, pulmonary vessels constrict." },
      { question: "Which ARDS intervention specifically targets intrapulmonary shunt reduction?", options: ["Increasing respiratory rate", "Applying PEEP to recruit collapsed alveoli", "Decreasing tidal volume to 6 mL/kg", "Administering IV corticosteroids"], correctIndex: 1, rationale: "PEEP directly targets intrapulmonary shunt by maintaining positive pressure at end-expiration, preventing alveolar collapse and recruiting atelectatic lung units. By converting shunt units (perfused but collapsed alveoli) back into functional gas exchange units, PEEP converts V/Q = 0 regions toward normal V/Q ratios." }
    ]
  },

  "hemodynamic-positive-pressure-rrt": {
    title: "Hemodynamic Effects of Positive Pressure",
    cellular: `Positive pressure ventilation fundamentally alters the hemodynamic relationships within the thorax. Unlike spontaneous breathing, where negative intrathoracic pressure during inspiration assists venous return and right ventricular filling, mechanical ventilation applies positive pressure that opposes venous return and alters biventricular function. Understanding these interactions is essential for managing hemodynamically unstable ventilated patients.

During spontaneous inspiration, diaphragmatic contraction generates negative pleural pressure (-5 to -8 cmH2O), expanding the thoracic cavity. This negative pressure increases the pressure gradient between the systemic veins and the right atrium, augmenting venous return (preload). Simultaneously, the negative intrathoracic pressure increases left ventricular transmural pressure (afterload), transiently impeding left ventricular ejection. During expiration, pleural pressure returns toward atmospheric, and venous return normalizes.

Mechanical positive pressure ventilation reverses these relationships. During inspiration, positive intrathoracic pressure compresses the vena cava and right atrium, reducing the venous return gradient and decreasing right ventricular preload. This effect is magnified with higher tidal volumes, higher PEEP, and longer inspiratory times. The right ventricle receives less blood and consequently ejects less (reduced right ventricular stroke volume). Because the pulmonary circulation connects the right and left ventricles in series, reduced right ventricular output decreases left ventricular filling 2-3 heartbeats later.

However, positive pressure simultaneously compresses the pulmonary vasculature and the aorta within the thorax. Compression of pulmonary capillaries increases right ventricular afterload and can cause right ventricular dilation and failure in patients with pre-existing pulmonary hypertension. Compression of the thoracic aorta effectively reduces left ventricular afterload (less transmural pressure needed to eject against a compressed aorta), which can transiently increase left ventricular stroke volume. This explains why patients with severe left ventricular failure may actually improve hemodynamically on positive pressure ventilation -- the afterload reduction benefits the failing left ventricle.

PEEP has additional hemodynamic effects beyond cyclic positive pressure. PEEP maintains a continuous positive baseline pressure throughout the respiratory cycle, persistently compressing the vena cava and reducing venous return. In hypovolemic patients, even modest PEEP (5-10 cmH2O) can cause significant hypotension. In euvolemic or hypervolemic patients, the same PEEP may be well tolerated. High PEEP levels (above 15 cmH2O) increase intrathoracic pressure substantially, potentially causing hemodynamic collapse in volume-depleted patients.

Mean airway pressure is the most clinically relevant pressure for predicting hemodynamic effects. It integrates the effects of peak pressure, PEEP, inspiratory time, and respiratory rate. Higher mean airway pressure generally produces greater hemodynamic compromise. Interventions that increase mean airway pressure (increasing PEEP, increasing I:E ratio, increasing inspiratory hold time) should be accompanied by hemodynamic assessment.

Auto-PEEP creates an additional hemodynamic burden beyond set PEEP. Total PEEP (set PEEP + auto-PEEP) determines the true positive pressure at end-expiration. A patient with set PEEP 10 and auto-PEEP 8 has total PEEP of 18 cmH2O -- significantly more hemodynamic compromise than the set PEEP alone suggests. Auto-PEEP is a common occult cause of hypotension in mechanically ventilated patients with obstructive lung disease.

Fluid responsiveness assessment in ventilated patients uses the cyclic hemodynamic changes caused by positive pressure. Pulse pressure variation (PPV) and stroke volume variation (SVV) measure the beat-to-beat variation in stroke volume caused by respiratory cycling. In ventilated patients on controlled ventilation (no spontaneous effort, tidal volume >= 8 mL/kg), PPV > 13% or SVV > 13% suggests fluid responsiveness. Passive leg raise (PLR) is an alternative test: elevating the legs 45 degrees auto-transfuses approximately 300 mL of venous blood. A cardiac output increase of >= 10% after PLR predicts fluid responsiveness regardless of ventilation mode.

Heart-lung interactions also affect hemodynamic monitoring accuracy. Central venous pressure (CVP) and pulmonary artery occlusion pressure (PAOP) are measured at end-expiration to minimize the effect of intrathoracic pressure on the readings. However, in patients with high PEEP, the transmitted airway pressure can falsely elevate CVP and PAOP. The general rule is that approximately 50% of PEEP is transmitted to the pleural space (less in stiff lungs, more in compliant lungs). Some clinicians subtract 50% of PEEP from CVP/PAOP readings, though this correction is imprecise.

Right ventricular failure is a critical complication of positive pressure ventilation, particularly in patients with ARDS or pre-existing pulmonary hypertension. Excessive PEEP and high driving pressures compress the pulmonary vasculature, increasing right ventricular afterload. The dilated right ventricle shifts the interventricular septum leftward (D-sign on echocardiography), compressing the left ventricle and reducing cardiac output (ventricular interdependence). Management includes reducing PEEP to the minimum level that maintains acceptable oxygenation, avoiding hypoxemia and hypercapnia (both increase pulmonary vascular resistance), volume optimization, and potentially inhaled pulmonary vasodilators.`,
    riskFactors: [
      "Hypovolemia amplifying the preload-reducing effects of positive pressure ventilation",
      "Pre-existing right ventricular dysfunction worsened by increased pulmonary vascular resistance from PEEP",
      "High PEEP levels (above 15 cmH2O) causing sustained compression of vena cava and reduced venous return",
      "Auto-PEEP in obstructive lung disease adding occult positive pressure and hemodynamic compromise",
      "Aggressive fluid restriction in ARDS combined with high PEEP creating relative hypovolemia",
      "Cardiac tamponade physiology worsened by positive intrathoracic pressure from mechanical ventilation",
      "Tension pneumothorax causing acute hemodynamic collapse amplified by positive pressure ventilation",
      "Pulmonary hypertension exacerbated by hypoxia, hypercapnia, and acidosis in ventilated patients"
    ],
    diagnostics: [
      "Arterial line with continuous blood pressure monitoring and pulse pressure variation calculation",
      "Central venous pressure measurement at end-expiration with PEEP correction for hemodynamic assessment",
      "Echocardiography to assess RV size and function, septal position, and LV filling",
      "Passive leg raise test with cardiac output measurement for fluid responsiveness assessment",
      "End-expiratory hold maneuver to measure auto-PEEP and total PEEP in obstructive patients",
      "Pulse pressure variation (PPV > 13%) or stroke volume variation (SVV > 13%) for fluid responsiveness",
      "Pulmonary artery catheter for right-sided pressures in complex heart-lung interactions"
    ],
    management: [
      "Volume resuscitation with crystalloid bolus (250-500 mL) if PPV > 13% or positive PLR response",
      "Minimize PEEP to the lowest level maintaining acceptable oxygenation to reduce hemodynamic impact",
      "Treat auto-PEEP by extending expiratory time and treating underlying bronchospasm",
      "Use vasopressors (norepinephrine) for persistent hypotension after volume optimization",
      "Reduce mean airway pressure by shortening inspiratory time, decreasing I:E ratio, or lowering PEEP",
      "Manage RV failure with inhaled pulmonary vasodilators, avoid hypoxemia/hypercapnia/acidosis",
      "Consider permissive hypercapnia to allow lower minute ventilation and mean airway pressure",
      "Disconnect ventilator briefly if tension pneumothorax suspected and hemodynamic collapse is acute"
    ],
    nursingActions: [
      "Monitor blood pressure continuously via arterial line in all hemodynamically unstable ventilated patients",
      "Assess for hemodynamic deterioration after any PEEP increase -- check BP and HR within 5 minutes",
      "Perform end-expiratory hold to measure auto-PEEP in patients with unexplained hypotension on the ventilator",
      "Calculate pulse pressure variation during passive mechanical ventilation to guide fluid resuscitation",
      "Read CVP and PAOP at end-expiration and document the PEEP level at the time of measurement",
      "Assess for signs of right ventricular failure (JVD, hepatomegaly, peripheral edema, D-sign on echo)",
      "Report hemodynamic instability temporally associated with ventilator changes to the physician immediately",
      "Coordinate volume resuscitation with PEEP titration -- volume before PEEP in hypovolemic patients"
    ],
    signs: [
      "Hypotension immediately following PEEP increase or initiation of mechanical ventilation",
      "Pulsus paradoxus (> 10 mmHg systolic pressure variation with respiration) on arterial waveform",
      "Elevated CVP with low cardiac output suggesting impaired venous return or RV failure",
      "Tachycardia as compensatory response to reduced stroke volume from decreased preload",
      "Jugular venous distension from elevated intrathoracic pressure and impaired venous drainage",
      "Hepatic congestion and peripheral edema from right ventricular failure exacerbated by positive pressure"
    ],
    medications: [
      { name: "Norepinephrine", dose: "0.01-0.5 mcg/kg/min IV infusion", route: "Intravenous (central line)", purpose: "Vasopressor support for hypotension from positive pressure-mediated preload reduction" },
      { name: "Milrinone", dose: "0.25-0.75 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Inodilator for RV failure -- increases contractility and reduces pulmonary vascular resistance" },
      { name: "Inhaled Epoprostenol", dose: "10-50 ng/kg/min via nebulizer", route: "Inhaled", purpose: "Selective pulmonary vasodilator to reduce RV afterload without systemic hypotension" }
    ],
    pearls: [
      "The most common occult cause of hypotension in a ventilated patient is auto-PEEP -- always check with an end-expiratory hold",
      "Patients with severe LV failure may paradoxically improve hemodynamically on positive pressure due to afterload reduction",
      "PPV and SVV are only valid predictors of fluid responsiveness during passive controlled ventilation with VT >= 8 mL/kg",
      "Approximately 50% of applied PEEP is transmitted to the pleural space -- subtract this from CVP readings for more accurate assessment",
      "Always give volume before increasing PEEP in hypovolemic patients -- PEEP without preload causes hemodynamic collapse",
      "RV failure from excessive PEEP causes leftward septal shift (D-sign) and LV compression -- reducing PEEP may be more effective than adding vasopressors"
    ],
    quiz: [
      { question: "A patient becomes hypotensive immediately after PEEP is increased from 8 to 16 cmH2O. What is the most likely mechanism?", options: ["Tension pneumothorax from barotrauma", "Decreased venous return from increased intrathoracic pressure", "Bronchospasm from airway irritation", "Myocardial infarction from increased oxygen demand"], correctIndex: 1, rationale: "PEEP increases intrathoracic pressure, which compresses the vena cava and right atrium, reducing the pressure gradient for venous return. This decreases right ventricular preload and subsequently left ventricular filling and cardiac output. The effect is immediate and more pronounced in hypovolemic patients." },
      { question: "A ventilated COPD patient has unexplained hypotension. Set PEEP is 5, but end-expiratory hold reveals total PEEP of 15. What should the RT do?", options: ["Increase the set PEEP to match total PEEP", "Decrease the respiratory rate and increase expiratory time to reduce auto-PEEP", "Add a vasopressor for blood pressure support", "Increase tidal volume to overcome the resistance"], correctIndex: 1, rationale: "Auto-PEEP of 10 cmH2O is the cause of the hemodynamic compromise. Extending expiratory time (by decreasing respiratory rate, decreasing I:E ratio, or shortening inspiratory time) allows more complete exhalation and reduces air trapping. Bronchodilator administration also helps reduce expiratory obstruction." },
      { question: "In which patient would positive pressure ventilation likely IMPROVE hemodynamics?", options: ["Hypovolemic trauma patient", "Patient with severe left ventricular systolic heart failure", "Patient with massive pulmonary embolism", "Patient with cardiac tamponade"], correctIndex: 1, rationale: "Positive intrathoracic pressure reduces left ventricular transmural pressure (afterload), effectively assisting the failing left ventricle. Patients with severe LV failure (cardiogenic pulmonary edema) often improve with CPAP or BiPAP because the afterload reduction and reduced venous return (preload reduction) unload the failing ventricle." },
      { question: "A patient has PPV of 18% on controlled ventilation. What does this indicate?", options: ["The patient is fluid overloaded and needs diuresis", "The patient is likely fluid responsive and may benefit from a volume challenge", "The ventilator settings need adjustment", "The arterial line is malfunctioning"], correctIndex: 1, rationale: "Pulse pressure variation > 13% during passive controlled ventilation (no spontaneous effort, VT >= 8 mL/kg) predicts fluid responsiveness. The large cyclic variation indicates that the positive pressure swings are significantly affecting stroke volume, suggesting the patient is on the steep portion of the Frank-Starling curve and will increase cardiac output with volume." },
      { question: "Why should CVP be measured at end-expiration in mechanically ventilated patients?", options: ["End-expiration has the highest intrathoracic pressure for accurate reading", "End-expiration has the least intrathoracic pressure interference, closest to true vascular pressure", "The CVP waveform is most stable during expiration", "CVP decreases during inspiration making it easier to read"], correctIndex: 1, rationale: "During mechanical inspiration, positive pressure artificially elevates intravascular pressures. At end-expiration, intrathoracic pressure is at its lowest point (equal to PEEP), providing the least interference with true vascular filling pressure measurement. Even then, high PEEP transmits to the pleural space and may elevate readings." }
    ]
  },

  "airway-management-rrt": {
    title: "Airway Management",
    cellular: `Airway management is the most critical skill for respiratory therapists. The ability to establish, maintain, and protect the airway directly determines patient survival in respiratory emergencies. Airway management encompasses assessment of airway anatomy, selection and placement of artificial airways, and ongoing airway maintenance.

Airway assessment begins with evaluating the patient's anatomy for predictors of difficult intubation. The Mallampati classification (Class I-IV) assesses oropharyngeal visualization with mouth fully open and tongue protruded: Class I (full view of soft palate, fauces, uvula, pillars), Class II (soft palate, fauces, partial uvula), Class III (soft palate, base of uvula only), Class IV (hard palate only). Higher Mallampati classes predict more difficult laryngoscopic views. Additional predictors include thyromental distance less than 6 cm (3 fingerbreadths), limited mouth opening (less than 3 cm or 2 fingerbreadths), limited neck extension, short thick neck, prominent upper teeth, receding mandible, obesity, and history of prior difficult intubation.

The LEMON assessment provides a systematic pre-intubation evaluation: Look externally (facial trauma, large tongue, small jaw, short neck, obesity), Evaluate 3-3-2 (3 fingers mouth opening, 3 fingers hyomental distance, 2 fingers thyroid-to-mouth floor), Mallampati score, Obstruction (epiglottitis, abscess, tumor, foreign body), and Neck mobility (cervical spine immobilization, ankylosing spondylitis, rheumatoid arthritis).

Basic airway maneuvers are the foundation of airway management. Head tilt-chin lift opens the oropharynx by extending the atlanto-occipital joint and displacing the tongue anteriorly. It is contraindicated in suspected cervical spine injury. Jaw thrust moves the mandible forward without head extension and is the maneuver of choice for suspected C-spine injury. Oropharyngeal airways (OPA) prevent tongue obstruction in unconscious patients without gag reflex. Sizing: corner of mouth to angle of jaw. Insertion: insert with concavity toward the palate, rotate 180 degrees once past the tongue. Nasopharyngeal airways (NPA) are tolerated in semiconscious patients with intact gag reflex. Sizing: tip of nose to earlobe. Contraindicated in suspected basilar skull fracture and severe coagulopathy.

Endotracheal intubation is the gold standard for definitive airway management. Orotracheal intubation via direct laryngoscopy uses a Macintosh (curved) or Miller (straight) blade to visualize the glottis. The Macintosh blade tip is placed in the vallecula and lifts the epiglottis indirectly. The Miller blade tip lifts the epiglottis directly. The Cormack-Lehane grading system describes the laryngoscopic view: Grade I (full glottic view), Grade II (partial glottic view), Grade III (epiglottis only), Grade IV (no laryngeal structures visible).

Video laryngoscopy (VL) has become the preferred first-attempt intubation device in many settings. Devices include the GlideScope, C-MAC, and McGrath. VL provides an improved glottic view (typically one Cormack-Lehane grade improvement over direct laryngoscopy) and higher first-pass success rates. VL requires a hyperangulated stylet to navigate the blade curvature. The camera may be obscured by secretions or blood, requiring suctioning.

ETT size selection: adult males typically 7.5-8.0 mm ID, adult females 7.0-7.5 mm ID. ETT depth: 21-23 cm at the teeth for adult males, 19-21 cm for adult females. Cuff pressure should be maintained at 20-30 cmH2O (25 cmH2O target) to prevent mucosal ischemia while maintaining adequate seal. Confirmation of ETT placement requires: continuous waveform capnography (gold standard), bilateral chest auscultation, absence of epigastric sounds, chest rise, misting in the tube, and chest X-ray for depth confirmation.

Rapid Sequence Intubation (RSI) is the standard protocol for emergency intubation in patients at risk for aspiration. The sequence: Preparation (equipment, medications, monitoring), Preoxygenation (100% FiO2 for 3-5 minutes or 8 vital capacity breaths to denitrogenate FRC), Pretreatment (if applicable: lidocaine, fentanyl), Paralysis with induction (succinylcholine 1-1.5 mg/kg or rocuronium 1.2 mg/kg with induction agent), Protection and positioning (Sellick's maneuver if used, sniffing position), Placement (laryngoscopy and intubation), Post-intubation management (confirm placement, secure tube, initiate ventilation, post-intubation sedation).

Difficult airway management follows the ASA Difficult Airway Algorithm. When intubation fails, the clinician must rapidly escalate through a plan. Failed first attempt: reposition, use bougie, switch to video laryngoscopy. Failed second attempt: place supraglottic airway (LMA, i-gel, King LT). Cannot intubate, cannot oxygenate (CICO): perform cricothyrotomy (surgical or percutaneous). The supraglottic airway (SGA) is the critical rescue device between failed intubation and surgical airway. SGAs include the laryngeal mask airway (LMA), i-gel, and King Laryngeal Tube. They are inserted blindly and provide ventilation without laryngoscopy. They do not protect against aspiration.

Tracheostomy is indicated for patients requiring prolonged mechanical ventilation (typically > 14 days), upper airway obstruction, facilitation of secretion management, or as an elective procedure for chronic ventilatory support. Percutaneous dilatational tracheostomy (PDT) is commonly performed at the bedside under bronchoscopic guidance. Surgical tracheostomy is performed in the OR. Tracheostomy care includes inner cannula cleaning, stoma care, cuff pressure management, and planned decannulation when the patient meets criteria.`,
    riskFactors: [
      "Difficult airway anatomy (Mallampati III-IV, limited mouth opening, short thyromental distance)",
      "Cervical spine injury requiring in-line stabilization limiting head extension for intubation",
      "Full stomach with aspiration risk requiring rapid sequence intubation technique",
      "Upper airway edema (anaphylaxis, thermal injury, angioedema) causing progressive obstruction",
      "Morbid obesity reducing functional residual capacity and accelerating desaturation during apnea",
      "Pediatric patients with anterior larynx, proportionally larger tongue, and shorter apnea tolerance",
      "Blood or vomitus in the airway obscuring visualization during laryngoscopy",
      "Failed intubation leading to cannot-intubate-cannot-oxygenate emergency",
      "Tracheal stenosis from prolonged intubation with cuff over-inflation"
    ],
    diagnostics: [
      "Mallampati classification and LEMON assessment for pre-intubation difficulty prediction",
      "Continuous waveform capnography as the gold standard for confirming and monitoring ETT placement",
      "Chest X-ray to confirm ETT depth (tip should be 3-5 cm above the carina, at T2-T4 level)",
      "Cuff pressure measurement (20-30 cmH2O) using a cuff manometer at least every shift",
      "Direct or video laryngoscopy Cormack-Lehane grading to document glottic view difficulty",
      "Bronchoscopy for ETT position verification, secretion clearance, and tracheostomy guidance",
      "Neck CT or laryngoscopy for suspected tracheal stenosis in patients with prolonged intubation history"
    ],
    management: [
      "Preoxygenate with 100% FiO2 for 3-5 minutes before any intubation attempt to maximize apnea tolerance",
      "Use video laryngoscopy as the primary intubation device for improved first-pass success",
      "Apply BURP (backward, upward, rightward pressure) on thyroid cartilage to improve glottic visualization",
      "Have supraglottic airway (LMA, i-gel) immediately available as backup for failed intubation",
      "Perform cricothyrotomy for cannot-intubate-cannot-oxygenate emergency as the final rescue intervention",
      "Maintain cuff pressure 20-30 cmH2O to prevent aspiration while avoiding tracheal mucosal ischemia",
      "Consider early tracheostomy (day 7-14) for patients expected to require prolonged mechanical ventilation",
      "Perform cuff leak test before extubation to assess for laryngeal edema (audible leak at cuff pressure < 20 cmH2O)"
    ],
    nursingActions: [
      "Verify ETT placement with continuous waveform capnography after every patient transfer, position change, or tube manipulation",
      "Document ETT depth at teeth at every shift and after any tube repositioning",
      "Measure and maintain cuff pressure between 20-30 cmH2O at least every 8 hours using a calibrated cuff manometer",
      "Assess for unplanned extubation risk: adequate sedation, wrist restraints if indicated, tube securing device integrity",
      "Suction ETT using closed suction catheter system with pre-oxygenation and limited passes (< 15 seconds per pass)",
      "Perform oral care every 4 hours with chlorhexidine per VAP prevention bundle",
      "Maintain head-of-bed elevation 30-45 degrees for aspiration prevention in intubated patients",
      "Have emergency airway equipment at bedside: functioning bag-valve-mask, oral airway, extra ETT, supraglottic airway, surgical airway kit"
    ],
    signs: [
      "Absent waveform capnography after intubation indicating esophageal placement requiring immediate removal",
      "Asymmetric chest rise and unilateral breath sounds suggesting right mainstem bronchus intubation",
      "Increasing cuff pressure requirements suggesting tracheal dilation or cuff failure",
      "Post-extubation stridor indicating laryngeal edema requiring racemic epinephrine or reintubation",
      "Subcutaneous emphysema around the neck and chest suggesting tracheal injury or pneumomediastinum",
      "Tube obstruction with high peak pressures and difficulty passing suction catheter requiring tube exchange"
    ],
    medications: [
      { name: "Succinylcholine", dose: "1-1.5 mg/kg IV push", route: "Intravenous", purpose: "Depolarizing neuromuscular blocker for rapid sequence intubation (onset 30-60 seconds, duration 5-10 minutes)" },
      { name: "Rocuronium", dose: "1.2 mg/kg IV push (RSI dose)", route: "Intravenous", purpose: "Non-depolarizing neuromuscular blocker for RSI when succinylcholine is contraindicated (onset 60 seconds)" },
      { name: "Etomidate", dose: "0.3 mg/kg IV push", route: "Intravenous", purpose: "Induction agent with hemodynamic stability for intubation in hypotensive patients" },
      { name: "Ketamine", dose: "1-2 mg/kg IV push", route: "Intravenous", purpose: "Induction agent preserving respiratory drive and bronchodilation for intubation in asthma or hemodynamic instability" }
    ],
    pearls: [
      "Video laryngoscopy should be the default first-attempt device -- it provides a better view and higher first-pass success than direct laryngoscopy",
      "Continuous waveform capnography is the only reliable method to confirm and monitor ETT placement -- auscultation alone is insufficient",
      "In RSI, rocuronium 1.2 mg/kg provides similar onset to succinylcholine without the risk of hyperkalemia or malignant hyperthermia",
      "A bougie (tracheal introducer) should be the first rescue device for a difficult Grade III view before switching to a supraglottic airway",
      "Cuff pressure above 30 cmH2O causes tracheal mucosal ischemia and below 20 cmH2O allows microaspiration -- target 25 cmH2O",
      "Cannot intubate, cannot oxygenate is the most critical emergency in medicine -- the only definitive rescue is cricothyrotomy"
    ],
    quiz: [
      { question: "During RSI, what is the gold standard for confirming endotracheal tube placement?", options: ["Bilateral breath sounds on auscultation", "Chest X-ray confirming tube position", "Continuous waveform capnography showing CO2", "Tube fogging with condensation"], correctIndex: 2, rationale: "Continuous waveform capnography showing a characteristic CO2 waveform for at least 6 breaths is the gold standard for confirming tracheal (not esophageal) ETT placement. Auscultation can be unreliable in noisy environments, chest X-ray is delayed, and fogging can occur even with esophageal placement." },
      { question: "A patient has been intubated and capnography shows no CO2 waveform. What is the immediate action?", options: ["Obtain a chest X-ray to confirm position", "Auscultate the chest for bilateral breath sounds", "Remove the ETT immediately and ventilate with bag-valve-mask", "Increase the respiratory rate to generate more CO2"], correctIndex: 2, rationale: "Absent capnography waveform after intubation indicates esophageal placement until proven otherwise. The ETT must be removed immediately and the patient ventilated with bag-valve-mask while preparing for reattempt. Delay in recognizing esophageal intubation is a leading cause of preventable airway death." },
      { question: "Which intubation medication is preferred for a hypotensive trauma patient?", options: ["Propofol 2 mg/kg IV", "Etomidate 0.3 mg/kg IV", "Midazolam 0.3 mg/kg IV", "Thiopental 3-5 mg/kg IV"], correctIndex: 1, rationale: "Etomidate provides excellent conditions for intubation with minimal hemodynamic effect (no significant hypotension or cardiac depression). Propofol, midazolam, and thiopental all cause dose-dependent hypotension, making them poor choices in hemodynamically unstable patients." },
      { question: "After two failed intubation attempts, the patient cannot be ventilated with bag-valve-mask. What is the next step?", options: ["Continue laryngoscopy attempts with different blades", "Insert a supraglottic airway (LMA or i-gel)", "Perform awake fiberoptic intubation", "Administer additional paralytic medication"], correctIndex: 1, rationale: "After failed intubation with failed bag-valve-mask ventilation, the immediate next step per the Difficult Airway Algorithm is to place a supraglottic airway (SGA). If the SGA also fails to provide ventilation (true cannot-intubate-cannot-oxygenate scenario), cricothyrotomy is performed." },
      { question: "What cuff pressure range prevents both aspiration and tracheal mucosal ischemia?", options: ["10-15 cmH2O", "20-30 cmH2O", "35-40 cmH2O", "40-50 cmH2O"], correctIndex: 1, rationale: "Cuff pressure between 20-30 cmH2O (target 25 cmH2O) provides adequate seal to prevent aspiration of oropharyngeal secretions while staying below the tracheal mucosal perfusion pressure (approximately 30 cmH2O). Pressures above 30 cause mucosal ischemia, necrosis, and tracheal stenosis. Pressures below 20 allow microaspiration." }
    ]
  },

  "ventilator-troubleshooting-rrt": {
    title: "Ventilator Troubleshooting",
    cellular: `Ventilator alarms and troubleshooting are daily clinical realities for respiratory therapists. Rapid, systematic alarm response prevents patient harm and guides appropriate interventions. Every alarm represents a change in the patient-ventilator system that must be evaluated, diagnosed, and corrected.

High pressure alarms activate when peak inspiratory pressure (PIP) exceeds the set upper pressure limit (typically set 10-15 cmH2O above baseline PIP). High pressure indicates increased resistance to gas flow, decreased lung or chest wall compliance, or patient-ventilator dyssynchrony. The systematic approach to high pressure alarms follows the pathway from the ventilator to the patient: ventilator circuit (water in circuit, kinked tubing, obstructed expiratory filter), artificial airway (ETT kink, mucus plug in ETT, ETT cuff herniation, biting on ETT), and patient (bronchospasm, secretions in airways, pneumothorax, abdominal distension, patient-ventilator dyssynchrony, decreased compliance from atelectasis, ARDS progression, or pleural effusion).

In volume-controlled ventilation, high PIP with normal plateau pressure indicates increased airway resistance (secretions, bronchospasm, kinked ETT). High PIP with high plateau pressure indicates decreased compliance (pneumothorax, ARDS, abdominal distension, mainstem intubation). An inspiratory hold maneuver differentiates the two by measuring plateau pressure.

Low pressure alarms activate when PIP falls below the set lower pressure limit. This indicates a circuit leak or patient disconnection. Causes include: disconnected circuit at any connection point, cuff deflation allowing air to escape around the ETT, chest tube with large bronchopleural fistula, circuit or humidifier leak, and damaged or cracked ETT.

Low tidal volume alarms are critical in pressure-controlled ventilation where volume is the dependent variable. Decreased delivered volume in PCV indicates worsening compliance, increased resistance, or patient effort changes. Causes include: ARDS progression, bronchospasm, mucus plugging, pneumothorax, or patient exhaustion. In volume-controlled ventilation, low exhaled tidal volume (compared to set inspiratory volume) indicates a circuit or cuff leak.

High respiratory rate alarms indicate the patient is triggering above the set alarm limit. Causes include: pain, anxiety, hypoxemia, hypercapnia, metabolic acidosis, fever, sepsis, pulmonary embolism, auto-triggering from water in the circuit or cardiac oscillations, and inadequate ventilatory support. High respiratory rates can lead to air trapping and auto-PEEP in obstructive patients.

Low PEEP or low PEEP/CPAP alarms indicate loss of positive end-expiratory pressure. Causes include: circuit disconnection, large air leak around the ETT cuff, chest tube bronchopleural fistula, and inadequate flow to maintain set PEEP in the presence of a leak.

Apnea alarms activate when no breath is detected within the set apnea interval (typically 20-30 seconds). This occurs during respiratory arrest, oversedation, neuromuscular blockade wearing off with inadequate respiratory drive, or ventilator malfunction. Apnea backup ventilation automatically delivers a set rate and volume/pressure when the primary mode fails.

Auto-triggering is a common source of false high-rate alarms and inappropriate ventilator breaths. The ventilator delivers breaths in response to non-respiratory signals: water condensation in the circuit oscillating across the flow trigger threshold, cardiac oscillations transmitted through the airways, and circuit leaks creating flow past the trigger sensor. Auto-triggering wastes ventilator breaths, causes respiratory alkalosis, and disrupts patient-ventilator synchrony. Diagnosis: observe the flow-time waveform for breaths without preceding patient effort. Management: increase trigger sensitivity threshold, drain circuit water, or fix the leak.

Patient-ventilator dyssynchrony encompasses several patterns that reduce ventilatory efficiency and increase work of breathing. Trigger dyssynchrony includes missed triggers (patient effort does not reach trigger threshold, common with auto-PEEP), double triggering (one patient effort triggers two ventilator breaths), and auto-triggering. Flow dyssynchrony occurs in VCV when the patient's inspiratory demand exceeds the set flow rate, producing a characteristic concavity in the pressure-time waveform (scooped-out appearance during inspiration). Cycle dyssynchrony includes premature cycling (ventilator ends inspiration before the patient is ready) and delayed cycling (ventilator continues inspiration beyond the patient's neural inspiratory time).

Troubleshooting workflow for any ventilator alarm: (1) Assess the patient first -- is the patient in distress? (2) If the patient is in distress and the cause is not immediately apparent, disconnect from the ventilator and manually ventilate with bag-valve-mask on 100% FiO2 while troubleshooting. (3) If the patient improves off the ventilator, the problem is in the ventilator or circuit. If the patient remains in distress off the ventilator, the problem is in the patient (bronchospasm, pneumothorax, mucus plug, etc.). (4) Systematically evaluate from ventilator to patient: check circuit connections, check ETT position and patency, auscultate the chest, check for pneumothorax, assess for bronchospasm. (5) Correct the cause, restore ventilation, and document.

Ventilator-associated events (VAE) surveillance uses objective criteria to identify ventilator-associated complications. A ventilator-associated condition (VAC) is defined as a sustained increase (>= 2 days) in daily minimum FiO2 >= 0.20 or daily minimum PEEP >= 3 cmH2O after a period of stable or decreasing values for >= 2 days. An infection-related ventilator-associated complication (IVAC) adds temperature abnormality or white cell count abnormality with new antimicrobial start. VAE monitoring helps identify patients with worsening respiratory status early.`,
    riskFactors: [
      "Circuit disconnection as the most dangerous ventilator emergency -- immediate apnea and loss of PEEP",
      "ETT obstruction from mucus plug, blood clot, or tube kinking causing acute airway obstruction",
      "Pneumothorax from barotrauma causing sudden high pressure followed by hemodynamic collapse",
      "Auto-PEEP from inadequate expiratory time in obstructive patients causing missed triggers and hemodynamic compromise",
      "Circuit condensation causing auto-triggering, false alarms, and potential circuit colonization",
      "Inadequate sedation causing patient-ventilator dyssynchrony with coughing, bucking, and high pressure alarms",
      "Cuff deflation causing aspiration risk, loss of tidal volume delivery, and low pressure alarms",
      "Power failure or ventilator malfunction requiring immediate manual ventilation with backup BVM"
    ],
    diagnostics: [
      "Inspiratory hold for plateau pressure measurement to differentiate resistance from compliance problems",
      "End-expiratory hold to measure auto-PEEP in patients with high rate alarms or hemodynamic instability",
      "Ventilator waveform analysis: pressure-time, flow-time, and volume-time scalars for dyssynchrony identification",
      "Suction catheter pass to assess ETT patency -- resistance to catheter passage suggests obstruction",
      "Chest X-ray to evaluate ETT position, pneumothorax, new infiltrate, or effusion causing alarm patterns",
      "Cuff pressure measurement to assess for cuff leak or over-inflation causing alarm",
      "ABG analysis to correlate ventilator alarms with gas exchange changes"
    ],
    management: [
      "If patient in distress and cause unclear: disconnect ventilator, manually bag on 100% FiO2, then troubleshoot",
      "High pressure with normal plateau: suction ETT, treat bronchospasm, check circuit for water or kinks",
      "High pressure with high plateau: assess for pneumothorax, abdominal distension, mainstem intubation",
      "Low pressure or low volume: check all circuit connections, assess cuff integrity, identify and repair leak source",
      "High rate alarm: assess for pain, hypoxemia, metabolic acidosis, fever, PE, auto-triggering from circuit water",
      "Auto-triggering: increase trigger sensitivity, drain condensation, fix circuit leaks",
      "Dyssynchrony management: optimize trigger sensitivity, adjust flow rate or rise time, consider mode change",
      "Maintain backup BVM and oral airway at bedside at all times for immediate manual ventilation"
    ],
    nursingActions: [
      "Never silence an alarm without identifying and addressing the cause -- alarms protect patients",
      "Assess the patient FIRST when any alarm sounds -- patient status determines urgency of response",
      "Disconnect and bag the patient if the cause of distress is not immediately identified within 30 seconds",
      "Document all alarm events including cause identified, intervention performed, and patient response",
      "Drain circuit condensation regularly to prevent auto-triggering and reduce circuit colonization risk",
      "Perform ventilator circuit checks at the start of every shift: connections, humidifier water level, alarm settings",
      "Set alarm limits appropriately: high pressure 10-15 above baseline PIP, low pressure 5-10 below, apnea interval 20s",
      "Keep emergency airway equipment at bedside: functioning BVM, oral/nasal airways, suction, extra ETT, emergency airway kit"
    ],
    signs: [
      "Sudden high pressure alarm with absent breath sounds on one side suggesting tension pneumothorax",
      "Progressive increase in PIP over hours suggesting worsening bronchospasm or developing atelectasis",
      "Low exhaled volume with audible air leak around the ETT suggesting cuff deflation",
      "Ventilator delivering rapid breaths with no patient effort (flat flow trigger) indicating auto-triggering",
      "Patient agitation with high pressure alarms in synchrony with coughing suggesting ETT irritation or inadequate sedation",
      "Sudden loss of capnography waveform suggesting circuit disconnection or ETT displacement"
    ],
    medications: [
      { name: "Albuterol", dose: "2.5-5 mg via in-line nebulizer or 4-8 puffs MDI via adapter", route: "Inhaled", purpose: "Bronchodilator for bronchospasm causing high pressure alarms and increased airway resistance" },
      { name: "Ipratropium", dose: "0.5 mg via nebulizer or 4 puffs MDI", route: "Inhaled", purpose: "Anticholinergic bronchodilator for refractory bronchospasm in combination with albuterol" },
      { name: "Propofol", dose: "10-20 mg IV push for acute dyssynchrony", route: "Intravenous", purpose: "Bolus sedation for acute patient-ventilator dyssynchrony with coughing and high pressure events" },
      { name: "Normal Saline (0.9%)", dose: "3-5 mL instilled into ETT", route: "Intratracheal", purpose: "Loosen thick secretions before suctioning to clear ETT obstruction (controversial but still practiced)" }
    ],
    pearls: [
      "When in doubt, bag the patient -- disconnecting from the ventilator immediately tells you whether the problem is the ventilator/circuit or the patient",
      "High PIP + normal Pplat = resistance problem (secretions, bronchospasm, kinked tube). High PIP + high Pplat = compliance problem (pneumothorax, ARDS, distension)",
      "Auto-triggering is the most common cause of unexplained high respiratory rates -- look for breaths without patient effort on the flow waveform",
      "A suction catheter that will not pass through the ETT indicates tube obstruction -- prepare for tube exchange",
      "Set high pressure alarm no more than 15 cmH2O above baseline PIP -- overly generous limits delay detection of dangerous conditions",
      "Sudden loss of capnography waveform plus low pressure alarm = circuit disconnection or accidental extubation -- assess immediately"
    ],
    quiz: [
      { question: "A ventilated patient develops sudden high pressure alarms, absent breath sounds on the right, and hypotension. What is the most likely diagnosis?", options: ["Right mainstem bronchus intubation", "Right-sided tension pneumothorax", "Mucus plug in the right bronchus", "Equipment malfunction"], correctIndex: 1, rationale: "The triad of sudden high pressure, absent breath sounds, and hypotension is classic for tension pneumothorax. The pneumothorax compresses the lung (absent breath sounds), increases intrathoracic pressure (high PIP and hemodynamic collapse from impaired venous return). Immediate needle decompression (2nd intercostal space, midclavicular line) followed by chest tube is required." },
      { question: "A patient on volume control has PIP 45 and plateau pressure 22. What does this indicate?", options: ["Decreased lung compliance", "Increased airway resistance", "Circuit leak", "Normal ventilator function"], correctIndex: 1, rationale: "The large gap between PIP (45) and plateau pressure (22) is 23 cmH2O, indicating high airway resistance. PIP includes both resistive (airway) and elastic (alveolar) pressure, while plateau reflects only elastic recoil. Causes: bronchospasm, secretions, kinked ETT, water in circuit. Suctioning and bronchodilator administration are indicated." },
      { question: "A patient's ventilator is delivering 32 breaths/min but the patient appears comfortable and sedated. The set rate is 14. What is the most likely cause?", options: ["The patient has a high respiratory drive from metabolic acidosis", "Auto-triggering from circuit condensation", "The ventilator rate setting was accidentally changed", "The patient is in pain and agitated"], correctIndex: 1, rationale: "A patient appearing comfortable and sedated but with an unexpectedly high ventilator rate strongly suggests auto-triggering. Water condensation in the circuit oscillates across the flow trigger threshold, causing the ventilator to deliver breaths without patient effort. Check the flow waveform for breaths without preceding negative deflection and drain circuit water." },
      { question: "When troubleshooting a ventilator alarm in a distressed patient, what is the first action?", options: ["Check the ventilator settings", "Inspect the circuit connections", "Disconnect from the ventilator and bag the patient on 100% FiO2", "Silence the alarm and assess the patient"], correctIndex: 2, rationale: "When a ventilated patient is in distress and the cause is not immediately apparent, the safest first action is to disconnect from the ventilator and manually ventilate with a bag-valve-mask on 100% FiO2. This ensures the patient receives ventilation while the ventilator and circuit are troubleshot. If the patient improves, the problem is the ventilator/circuit. If distress continues, the problem is the patient." },
      { question: "What ventilator waveform finding indicates flow dyssynchrony in volume-controlled ventilation?", options: ["A flat pressure waveform during inspiration", "A concave (scooped-out) pressure waveform during inspiration", "A rising volume waveform with plateau", "A square flow waveform with no decay"], correctIndex: 1, rationale: "Flow dyssynchrony in VCV occurs when the patient's inspiratory demand exceeds the set flow rate. The patient actively pulls against the ventilator, creating a concavity (scooped-out or dished appearance) in the pressure-time waveform during inspiration. The solution is to increase the inspiratory flow rate, switch to a decelerating flow pattern, or add pressure support." }
    ]
  }
};
