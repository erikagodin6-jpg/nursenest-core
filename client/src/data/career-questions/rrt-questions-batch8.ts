import type { CareerQuestion } from "./rrt-questions";

export const rrtQuestionsBatch8: CareerQuestion[] = [
  {
    id: "rrt-2250",
    stem: "Which pulmonary function test measurement is defined as the maximum volume of air that can be exhaled after a maximal inspiration?",
    options: [
      "Forced vital capacity (FVC)",
      "Tidal volume (VT)",
      "Functional residual capacity (FRC)",
      "Residual volume (RV)"
    ],
    correctIndex: 0,
    rationale: "FVC is the total volume of air that can be forcefully exhaled after a maximal inhalation. Tidal volume is the volume of a normal breath. FRC is the volume remaining after a normal exhalation. RV is the volume remaining after maximal exhalation and cannot be measured by spirometry alone.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "spirometry basics"
  },
  {
    id: "rrt-2251",
    stem: "A patient performs spirometry and the FEV1/FVC ratio is 0.82. This value is considered:",
    options: [
      "Normal",
      "Indicative of obstruction",
      "Indicative of restriction",
      "Indicative of a mixed defect"
    ],
    correctIndex: 0,
    rationale: "A normal FEV1/FVC ratio is typically ≥0.70 (or ≥ lower limit of normal). A ratio of 0.82 falls within normal limits. Obstructive defects show a reduced ratio (<0.70). Restriction typically shows a normal or increased ratio with reduced volumes.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "spirometry interpretation"
  },
  {
    id: "rrt-2252",
    stem: "What is the name of the volume of air remaining in the lungs after a normal passive exhalation?",
    options: [
      "Functional residual capacity (FRC)",
      "Residual volume (RV)",
      "Expiratory reserve volume (ERV)",
      "Inspiratory capacity (IC)"
    ],
    correctIndex: 0,
    rationale: "FRC is the volume of air remaining in the lungs after a normal tidal exhalation. It consists of ERV + RV. RV is the air remaining after maximal exhalation. ERV is the additional air that can be exhaled beyond tidal volume. IC is the maximum volume that can be inhaled from FRC.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "lung volumes"
  },
  {
    id: "rrt-2253",
    stem: "During a pulmonary function test, which gas is most commonly used to measure diffusing capacity (DLCO)?",
    options: [
      "Carbon monoxide (CO)",
      "Helium (He)",
      "Nitrogen (N2)",
      "Oxygen (O2)"
    ],
    correctIndex: 0,
    rationale: "Carbon monoxide is used for DLCO testing because it has a very high affinity for hemoglobin, making it ideal for measuring the gas transfer across the alveolar-capillary membrane. Helium is used for lung volume measurements. Nitrogen washout is used for FRC determination. Oxygen is not used for diffusion testing.",
    difficulty: 5,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2254",
    stem: "During a nitrogen washout test for FRC measurement, the patient breathes 100% oxygen. What principle is used to calculate the trapped gas volume?",
    options: [
      "Open-circuit nitrogen dilution based on total exhaled nitrogen",
      "Boyle's law pressure-volume relationship",
      "Fick principle of gas exchange",
      "Henry's law of gas solubility"
    ],
    correctIndex: 0,
    rationale: "Nitrogen washout is an open-circuit method: the patient breathes 100% O2 while exhaled N2 is collected and measured. Since room air is ~78% N2, the total volume of N2 washed out equals the FRC multiplied by the initial N2 concentration, allowing FRC calculation.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "FRC measurement"
  },
  {
    id: "rrt-2255",
    stem: "A flow-volume loop showing a scooped-out appearance on the expiratory limb is characteristic of:",
    options: [
      "Obstructive lung disease",
      "Restrictive lung disease",
      "Upper airway obstruction",
      "Normal lung function"
    ],
    correctIndex: 0,
    rationale: "The concave or scooped-out expiratory limb on a flow-volume loop is characteristic of obstructive disease such as COPD or asthma, reflecting decreased expiratory flow rates at lower lung volumes. Restrictive disease shows a narrowed but normal-shaped loop. Upper airway obstruction shows flattening of the inspiratory or expiratory limb.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "flow-volume loops"
  },
  {
    id: "rrt-2256",
    stem: "What does peak expiratory flow rate (PEFR) measure?",
    options: [
      "The maximum flow rate achieved during a forced exhalation",
      "The average flow during the middle half of an FVC maneuver",
      "The volume of air exhaled in the first second",
      "The total lung capacity minus residual volume"
    ],
    correctIndex: 0,
    rationale: "PEFR is the highest flow rate attained during a forced expiratory maneuver starting from total lung capacity. FEF25-75% measures the average flow during the middle portion of exhalation. FEV1 is the volume exhaled in the first second. TLC minus RV equals the vital capacity.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "spirometry basics"
  },
  {
    id: "rrt-2257",
    stem: "Which of the following is the standard criterion for a positive bronchodilator response during spirometry?",
    options: [
      "≥12% and ≥200 mL increase in FEV1 or FVC",
      "≥5% increase in FEV1",
      "≥20% decrease in FEV1",
      "≥10% increase in PEFR"
    ],
    correctIndex: 0,
    rationale: "Per ATS/ERS guidelines, a positive bronchodilator response is defined as an increase of ≥12% AND ≥200 mL in FEV1 or FVC from baseline. A 5% change is not significant. A 20% decrease in FEV1 would indicate bronchial hyperreactivity (methacholine challenge). PEFR alone is not the standard measure.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "bronchodilator response"
  },
  {
    id: "rrt-2258",
    stem: "In a nitrogen washout test, the patient breathes 100% oxygen to wash out nitrogen from the lungs. This test is used primarily to measure:",
    options: [
      "Functional residual capacity (FRC)",
      "Forced vital capacity (FVC)",
      "Peak expiratory flow (PEF)",
      "Maximum voluntary ventilation (MVV)"
    ],
    correctIndex: 0,
    rationale: "The nitrogen washout test measures FRC by having the patient breathe 100% O2 until all nitrogen is washed out of the lungs. The total nitrogen collected is used to calculate FRC. FVC and PEF are measured by spirometry. MVV is measured by rapid breathing over a set time period.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "lung volume measurement"
  },
  {
    id: "rrt-2259",
    stem: "Total lung capacity (TLC) is the sum of which of the following?",
    options: [
      "Vital capacity (VC) + residual volume (RV)",
      "Tidal volume (VT) + expiratory reserve volume (ERV)",
      "Inspiratory capacity (IC) + expiratory reserve volume (ERV)",
      "Functional residual capacity (FRC) + tidal volume (VT)"
    ],
    correctIndex: 0,
    rationale: "TLC = VC + RV, which represents the total volume of air the lungs can hold at maximal inflation. VT + ERV does not include IRV or RV. IC + ERV does not include RV. FRC + VT does not include IRV.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "lung volumes"
  },
  {
    id: "rrt-2260",
    stem: "A patient with suspected asthma undergoes a methacholine challenge test. A positive test is defined as a PC20 of:",
    options: [
      "≤16 mg/mL",
      "≤50 mg/mL",
      "≥20 mg/mL",
      "≥100 mg/mL"
    ],
    correctIndex: 0,
    rationale: "A positive methacholine challenge is defined as a PC20 (provocative concentration causing a 20% fall in FEV1) of ≤16 mg/mL, indicating bronchial hyperresponsiveness. Higher thresholds would not indicate significant airway reactivity. The lower the PC20, the more reactive the airways.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "bronchoprovocation testing"
  },
  {
    id: "rrt-2261",
    stem: "Which pulmonary function parameter is most sensitive for detecting early small airway disease?",
    options: [
      "FEF25-75%",
      "FEV1",
      "FVC",
      "PEFR"
    ],
    correctIndex: 0,
    rationale: "FEF25-75% (forced expiratory flow at 25-75% of FVC) reflects flow in the small airways and is the most sensitive spirometric parameter for early small airway obstruction. FEV1 and FVC are effort-dependent and may remain normal in early disease. PEFR primarily reflects large airway function.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "spirometry interpretation"
  },
  {
    id: "rrt-2262",
    stem: "Body plethysmography measures thoracic gas volume based on which gas law?",
    options: [
      "Boyle's law",
      "Dalton's law",
      "Henry's law",
      "Charles's law"
    ],
    correctIndex: 0,
    rationale: "Body plethysmography uses Boyle's law (P1V1 = P2V2), which states that at constant temperature the volume of a gas varies inversely with pressure. By measuring pressure changes at the mouth and in the box, thoracic gas volume can be calculated. Dalton's law relates to partial pressures, Henry's law to gas solubility, and Charles's law to temperature-volume relationships.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "body plethysmography"
  },
  {
    id: "rrt-2263",
    stem: "A patient's spirometry shows FVC 60% predicted, FEV1 65% predicted, and FEV1/FVC ratio 0.88. This pattern is most consistent with:",
    options: [
      "Restrictive lung disease",
      "Obstructive lung disease",
      "Mixed obstructive-restrictive disease",
      "Normal spirometry"
    ],
    correctIndex: 0,
    rationale: "A reduced FVC with a normal or elevated FEV1/FVC ratio is the hallmark of restrictive lung disease. In obstruction, the FEV1/FVC ratio would be reduced (<0.70). Mixed disease shows both a reduced ratio and reduced volumes. Normal spirometry would show values within predicted ranges.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "spirometry interpretation"
  },
  {
    id: "rrt-2264",
    stem: "During a DLCO test, which of the following conditions would cause a decreased diffusing capacity?",
    options: [
      "Emphysema",
      "Polycythemia",
      "Pulmonary hemorrhage",
      "Exercise"
    ],
    correctIndex: 0,
    rationale: "Emphysema destroys alveolar-capillary surface area, reducing DLCO. Polycythemia increases DLCO due to more hemoglobin available to bind CO. Pulmonary hemorrhage can falsely increase DLCO because blood in the alveoli absorbs CO. Exercise increases DLCO by recruiting more capillaries.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2265",
    stem: "Which of the following represents the volume of air that can be inhaled after a normal tidal exhalation?",
    options: [
      "Inspiratory capacity (IC)",
      "Inspiratory reserve volume (IRV)",
      "Vital capacity (VC)",
      "Total lung capacity (TLC)"
    ],
    correctIndex: 0,
    rationale: "Inspiratory capacity is the maximum volume of air that can be inhaled from the end-tidal expiratory level (FRC). It equals tidal volume + inspiratory reserve volume. IRV is only the additional air above tidal volume. VC is the maximum volume from full inspiration to full exhalation. TLC includes RV.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "lung volumes"
  },
  {
    id: "rrt-2266",
    stem: "An obese patient's spirometry shows proportional reductions in all lung volumes with a normal FEV1/FVC ratio. The most likely explanation is:",
    options: [
      "Reduced chest wall compliance from obesity",
      "Chronic obstructive pulmonary disease",
      "Asthma with air trapping",
      "Equipment malfunction"
    ],
    correctIndex: 0,
    rationale: "Obesity reduces chest wall compliance, leading to proportional reductions in lung volumes (a restrictive pattern) with a preserved FEV1/FVC ratio. COPD would show a reduced ratio. Asthma with air trapping would show increased RV and reduced ratio. Equipment malfunction is unlikely to produce a consistent pattern.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "restrictive patterns"
  },
  {
    id: "rrt-2267",
    stem: "Maximum voluntary ventilation (MVV) is reduced in patients with which of the following conditions?",
    options: [
      "Severe COPD",
      "Mild allergic rhinitis",
      "Anemia",
      "Anxiety disorder"
    ],
    correctIndex: 0,
    rationale: "MVV is significantly reduced in severe COPD because airflow limitation prevents rapid breathing. MVV requires rapid, deep breathing for 12-15 seconds and is very effort-dependent. Allergic rhinitis has no significant effect on MVV. Anemia affects gas exchange but not ventilatory mechanics. Anxiety may actually increase MVV due to hyperventilation.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "maximum voluntary ventilation"
  },
  {
    id: "rrt-2268",
    stem: "A helium dilution test to measure FRC yields results lower than body plethysmography in the same patient. The most likely explanation is:",
    options: [
      "The patient has trapped gas that helium cannot reach",
      "The body box is malfunctioning",
      "The helium analyzer is over-reading",
      "The patient has restrictive lung disease"
    ],
    correctIndex: 0,
    rationale: "Helium dilution measures only communicating gas volume. In obstructive disease with air trapping, gas trapped behind closed airways is not reached by helium, resulting in underestimation of FRC. Body plethysmography measures all thoracic gas including trapped gas. This discrepancy is characteristic of obstructive disease with air trapping.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "lung volume measurement"
  },
  {
    id: "rrt-2269",
    stem: "For spirometry results to be acceptable, the ATS/ERS standards require at least how many acceptable maneuvers?",
    options: [
      "3",
      "1",
      "5",
      "8"
    ],
    correctIndex: 0,
    rationale: "ATS/ERS standards require a minimum of 3 acceptable FVC maneuvers to ensure reliability. The two best FVC values and two best FEV1 values should be within 150 mL of each other for repeatability. One maneuver is insufficient for reliability. Five and eight exceed the minimum requirement.",
    difficulty: 5,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2270",
    stem: "A 45-year-old patient has the following PFT results: TLC 120% predicted, RV 160% predicted, FEV1/FVC 0.55. These findings are most consistent with:",
    options: [
      "COPD with hyperinflation",
      "Pulmonary fibrosis",
      "Neuromuscular weakness",
      "Pleural effusion"
    ],
    correctIndex: 0,
    rationale: "Increased TLC and markedly increased RV indicate hyperinflation and air trapping, while a reduced FEV1/FVC ratio confirms obstruction. This combination is classic for COPD. Pulmonary fibrosis would show reduced TLC. Neuromuscular weakness shows reduced volumes with normal ratio. Pleural effusion causes restriction.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "obstructive patterns"
  },
  {
    id: "rrt-2271",
    stem: "Which of the following conditions would cause an INCREASED DLCO?",
    options: [
      "Polycythemia vera",
      "Pulmonary fibrosis",
      "Anemia",
      "Emphysema"
    ],
    correctIndex: 0,
    rationale: "Polycythemia vera increases hemoglobin concentration, providing more binding sites for carbon monoxide and thus increasing DLCO. Pulmonary fibrosis thickens the alveolar membrane, decreasing DLCO. Anemia decreases DLCO due to fewer hemoglobin molecules. Emphysema destroys alveolar surface area, reducing DLCO.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2272",
    stem: "The single-breath nitrogen washout test can be used to evaluate:",
    options: [
      "Distribution of ventilation",
      "Airway resistance",
      "Cardiac output",
      "Oxygen consumption"
    ],
    correctIndex: 0,
    rationale: "The single-breath nitrogen washout test (SBN2) evaluates the uniformity of ventilation distribution by analyzing the nitrogen concentration during a slow vital capacity exhalation after a single breath of 100% O2. Airway resistance is measured by body plethysmography. Cardiac output and oxygen consumption are not PFT measurements.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "ventilation distribution"
  },
  {
    id: "rrt-2273",
    stem: "During spirometry, a patient's expiratory effort lasts only 3 seconds before stopping. According to ATS/ERS criteria, this maneuver is:",
    options: [
      "Unacceptable due to insufficient exhalation time",
      "Acceptable if FVC is reproducible",
      "Acceptable for all patients",
      "Only acceptable for pediatric patients"
    ],
    correctIndex: 0,
    rationale: "ATS/ERS criteria require a minimum exhalation time of 6 seconds for adults (or until a plateau is reached) for the maneuver to be acceptable. Three seconds is insufficient. While some patients with severe obstruction may need longer times, the 6-second minimum applies to adults. Pediatric patients may have shorter acceptable times.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2274",
    stem: "A fixed upper airway obstruction on a flow-volume loop would demonstrate:",
    options: [
      "Flattening of both inspiratory and expiratory limbs",
      "Flattening of only the inspiratory limb",
      "Flattening of only the expiratory limb",
      "A scooped-out expiratory limb"
    ],
    correctIndex: 0,
    rationale: "A fixed upper airway obstruction (e.g., tracheal stenosis from a fixed lesion) limits flow equally during both inspiration and expiration, producing flattening of both limbs on the flow-volume loop. A variable extrathoracic obstruction flattens only the inspiratory limb. A variable intrathoracic obstruction flattens only the expiratory limb. A scooped-out pattern indicates lower airway obstruction.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "flow-volume loops"
  },
  {
    id: "rrt-2275",
    stem: "What is the primary purpose of a cardiopulmonary exercise test (CPET)?",
    options: [
      "To evaluate exercise capacity and identify causes of exercise limitation",
      "To measure resting lung volumes",
      "To assess bronchodilator responsiveness",
      "To diagnose sleep-disordered breathing"
    ],
    correctIndex: 0,
    rationale: "CPET evaluates exercise capacity by measuring gas exchange, ventilation, and cardiovascular parameters during incremental exercise. It helps differentiate cardiac, pulmonary, and deconditioning causes of dyspnea. Resting lung volumes are measured by static PFTs. Bronchodilator responsiveness uses pre/post spirometry. Sleep disorders require polysomnography.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  },
  {
    id: "rrt-2276",
    stem: "A spirometry report shows the back-extrapolated volume (BEV) exceeds 5% of the FVC. This indicates:",
    options: [
      "A slow or hesitant start to the forced exhalation",
      "Early termination of the maneuver",
      "An air leak in the system",
      "A cough artifact in the first second"
    ],
    correctIndex: 0,
    rationale: "Back-extrapolated volume (BEV) >5% of FVC or >150 mL indicates the patient did not start the forced exhalation with adequate effort or speed. This results in an inaccurate time-zero point and falsely reduced FEV1. Early termination would affect FVC. Air leaks would reduce all volumes. Cough artifacts affect flow patterns.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2277",
    stem: "Airway resistance is measured in a pulmonary function laboratory using which device?",
    options: [
      "Body plethysmograph",
      "Pneumotachometer",
      "Wright peak flow meter",
      "Pulse oximeter"
    ],
    correctIndex: 0,
    rationale: "Airway resistance (Raw) is measured using a body plethysmograph by simultaneously recording mouth pressure (alveolar pressure) and airflow. A pneumotachometer measures flow but not resistance. A Wright peak flow meter only measures PEFR. A pulse oximeter measures oxygen saturation, not airway mechanics.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "airway resistance"
  },
  {
    id: "rrt-2278",
    stem: "The closing volume test provides information about:",
    options: [
      "The lung volume at which small airways begin to close",
      "The maximum volume a patient can exhale",
      "The oxygen diffusion capacity",
      "The total compliance of the respiratory system"
    ],
    correctIndex: 0,
    rationale: "Closing volume is the lung volume at which dependent small airways begin to close during exhalation. An increased closing volume (encroaching on tidal breathing) can lead to V/Q mismatch and hypoxemia. It is particularly relevant in elderly patients and those with early small airway disease.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "closing volume"
  },
  {
    id: "rrt-2279",
    stem: "Which of the following is the normal range for airway resistance (Raw) in adults?",
    options: [
      "0.6-2.4 cmH2O/L/sec",
      "5-10 cmH2O/L/sec",
      "10-15 cmH2O/L/sec",
      "0.01-0.05 cmH2O/L/sec"
    ],
    correctIndex: 0,
    rationale: "Normal airway resistance in adults is approximately 0.6-2.4 cmH2O/L/sec. Values above this range indicate increased airway resistance, seen in obstructive diseases. Values of 5-10 or 10-15 would indicate significantly elevated resistance. Values of 0.01-0.05 are unrealistically low.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "airway resistance"
  },
  {
    id: "rrt-2280",
    stem: "A patient's DLCO is reported as 50% of predicted. After correction for hemoglobin, the adjusted DLCO is 75% of predicted. The most likely explanation is:",
    options: [
      "The patient has anemia",
      "The patient has polycythemia",
      "The patient has emphysema",
      "The patient has pulmonary fibrosis"
    ],
    correctIndex: 0,
    rationale: "When DLCO is low but corrects significantly upward after hemoglobin adjustment, anemia is the cause of the reduced DLCO rather than a true diffusion impairment. Anemia reduces hemoglobin available to bind CO. Polycythemia would increase DLCO. Emphysema and fibrosis cause true diffusion impairment that does not correct with hemoglobin adjustment.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2281",
    stem: "Which of the following is a contraindication to performing spirometry?",
    options: [
      "Recent pneumothorax",
      "Mild upper respiratory infection",
      "Controlled hypertension",
      "History of asthma"
    ],
    correctIndex: 0,
    rationale: "Recent pneumothorax is an absolute contraindication to spirometry because the forced expiratory maneuver could worsen the pneumothorax. Mild URI may affect results but is a relative contraindication. Controlled hypertension does not preclude testing. Asthma history is actually an indication for testing.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "contraindications"
  },
  {
    id: "rrt-2282",
    stem: "During a 6-minute walk test (6MWT), which parameter is the primary outcome measure?",
    options: [
      "Total distance walked in 6 minutes",
      "Heart rate at peak exercise",
      "Maximum oxygen consumption (VO2 max)",
      "Respiratory rate at rest"
    ],
    correctIndex: 0,
    rationale: "The primary outcome of the 6MWT is the total distance walked in 6 minutes, which is a submaximal exercise test that correlates with functional capacity. Heart rate is monitored but is not the primary outcome. VO2 max is measured during CPET, not 6MWT. Resting respiratory rate is not an exercise parameter.",
    difficulty: 1,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  },
  {
    id: "rrt-2283",
    stem: "In a patient with asthma, which finding on pulmonary function testing best supports the diagnosis?",
    options: [
      "Significant improvement in FEV1 after bronchodilator administration",
      "Decreased total lung capacity",
      "Decreased DLCO",
      "Increased airway resistance that does not respond to bronchodilators"
    ],
    correctIndex: 0,
    rationale: "Reversible airflow obstruction (≥12% and ≥200 mL improvement in FEV1 post-bronchodilator) is a hallmark of asthma. Decreased TLC suggests restriction. Decreased DLCO suggests parenchymal disease. Fixed airway resistance unresponsive to bronchodilators is more suggestive of COPD or fixed obstruction.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "bronchodilator response"
  },
  {
    id: "rrt-2284",
    stem: "The FEV1/FVC ratio is sometimes referred to as the:",
    options: [
      "Tiffeneau-Pinelli index",
      "Bohr equation",
      "Henderson-Hasselbalch index",
      "Poiseuille coefficient"
    ],
    correctIndex: 0,
    rationale: "The FEV1/FVC ratio is historically known as the Tiffeneau-Pinelli index, named after the French physicians who first described its utility. The Bohr equation calculates dead space. Henderson-Hasselbalch relates pH to bicarbonate and CO2. Poiseuille's law relates to flow through tubes.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "spirometry basics"
  },
  {
    id: "rrt-2285",
    stem: "A variable extrathoracic upper airway obstruction (e.g., vocal cord paralysis) would show which pattern on a flow-volume loop?",
    options: [
      "Flattening of the inspiratory limb with a normal expiratory limb",
      "Flattening of both inspiratory and expiratory limbs",
      "Flattening of the expiratory limb with a normal inspiratory limb",
      "A scooped-out expiratory pattern"
    ],
    correctIndex: 0,
    rationale: "A variable extrathoracic obstruction causes greater limitation during inspiration when negative intraluminal pressure draws the lesion inward. During expiration, positive intraluminal pressure pushes the lesion open. This produces inspiratory limb flattening with a relatively preserved expiratory limb. Fixed obstruction flattens both limbs.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "flow-volume loops"
  },
  {
    id: "rrt-2286",
    stem: "Exhaled nitric oxide (FeNO) testing is primarily used to assess:",
    options: [
      "Eosinophilic airway inflammation",
      "Airway resistance",
      "Lung volumes",
      "Gas exchange efficiency"
    ],
    correctIndex: 0,
    rationale: "FeNO is a biomarker of eosinophilic airway inflammation and is elevated in allergic/eosinophilic asthma. It helps guide inhaled corticosteroid therapy and distinguish eosinophilic from non-eosinophilic airway disease. Airway resistance is measured by plethysmography. Lung volumes use spirometry or gas dilution. Gas exchange is assessed by DLCO or ABG.",
    difficulty: 2,
    category: "Pulmonary Diagnostics",
    topic: "exhaled nitric oxide"
  },
  {
    id: "rrt-2287",
    stem: "A patient completes a spirometry maneuver. The technician notes a cough during the first second of exhalation. The correct action is to:",
    options: [
      "Discard the maneuver and repeat the test",
      "Accept the maneuver if the FVC is within normal limits",
      "Use only the FVC value and discard the FEV1",
      "Average this result with the other maneuvers"
    ],
    correctIndex: 0,
    rationale: "A cough during the first second of exhalation invalidates the FEV1 measurement and the maneuver should be discarded per ATS/ERS quality criteria. The maneuver cannot be accepted even if FVC appears normal because the cough artifact affects the flow-time relationship. The test should be repeated to obtain valid data.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2288",
    stem: "Specific airway conductance (sGaw) is the reciprocal of:",
    options: [
      "Specific airway resistance (sRaw)",
      "Total lung capacity (TLC)",
      "Functional residual capacity (FRC)",
      "Diffusing capacity (DLCO)"
    ],
    correctIndex: 0,
    rationale: "Specific airway conductance (sGaw) is the reciprocal of specific airway resistance (sRaw). Conductance measures how easily air flows through the airways. Higher conductance indicates less resistance. sGaw normalizes conductance for lung volume, making it useful for comparing patients of different sizes.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "airway resistance"
  },
  {
    id: "rrt-2289",
    stem: "A patient with pulmonary fibrosis would be expected to have which DLCO finding?",
    options: [
      "Decreased DLCO",
      "Increased DLCO",
      "Normal DLCO",
      "DLCO cannot be measured in fibrosis"
    ],
    correctIndex: 0,
    rationale: "Pulmonary fibrosis thickens the alveolar-capillary membrane (interstitial thickening), which impedes gas diffusion and results in a decreased DLCO. This is one of the earliest abnormalities detected in interstitial lung disease. DLCO can be measured in fibrosis and serves as an important monitoring tool.",
    difficulty: 1,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2290",
    stem: "During a bronchoprovocation test with methacholine, testing should be stopped immediately if:",
    options: [
      "FEV1 falls by 20% or more from baseline",
      "FEV1 falls by 5% from baseline",
      "The patient sneezes",
      "Heart rate increases by 10 bpm"
    ],
    correctIndex: 0,
    rationale: "The endpoint of a methacholine challenge is a 20% fall in FEV1 from baseline (the PC20). Testing must stop at this point or if the highest concentration has been administered. A 5% decline is within normal variability. Sneezing and mild heart rate changes do not mandate stopping the test.",
    difficulty: 2,
    category: "Pulmonary Diagnostics",
    topic: "bronchoprovocation testing"
  },
  {
    id: "rrt-2291",
    stem: "In the context of PFT interpretation, what does a reduced FVC with a normal FEV1/FVC ratio suggest?",
    options: [
      "Restrictive ventilatory defect",
      "Obstructive ventilatory defect",
      "Mixed ventilatory defect",
      "Poor patient effort"
    ],
    correctIndex: 0,
    rationale: "A reduced FVC with a preserved (normal or elevated) FEV1/FVC ratio is the spirometric pattern of restriction. However, lung volume measurements (TLC) are needed to confirm true restriction. Obstruction shows a reduced ratio. Mixed defects show both. While poor effort can mimic restriction, the pattern itself suggests restriction.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "spirometry interpretation"
  },
  {
    id: "rrt-2292",
    stem: "Impulse oscillometry (IOS) is a pulmonary function technique that measures:",
    options: [
      "Respiratory impedance using sound waves during tidal breathing",
      "Gas exchange using carbon monoxide",
      "Lung volumes using helium dilution",
      "Bronchial reactivity using methacholine"
    ],
    correctIndex: 0,
    rationale: "IOS applies small pressure oscillations at the mouth during tidal breathing and measures respiratory system impedance (resistance and reactance). It is effort-independent, making it useful for children and patients unable to perform spirometry. CO is used for DLCO. Helium for lung volumes. Methacholine for bronchoprovocation.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "oscillometry"
  },
  {
    id: "rrt-2293",
    stem: "A patient with myasthenia gravis undergoes PFTs. Which pattern is expected?",
    options: [
      "Reduced lung volumes with normal FEV1/FVC ratio and normal DLCO",
      "Increased lung volumes with reduced FEV1/FVC ratio",
      "Reduced DLCO with normal lung volumes",
      "Increased airway resistance with normal volumes"
    ],
    correctIndex: 0,
    rationale: "Neuromuscular diseases like myasthenia gravis cause respiratory muscle weakness leading to reduced lung volumes (restrictive pattern) with a preserved FEV1/FVC ratio. DLCO is typically normal because the lung parenchyma is unaffected. The problem is mechanical (muscle weakness), not airway obstruction or diffusion impairment.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "neuromuscular disease"
  },
  {
    id: "rrt-2294",
    stem: "The DLCO/VA ratio (also known as KCO) represents:",
    options: [
      "The diffusing capacity per unit of alveolar volume",
      "The total carbon monoxide absorbed per minute",
      "The ratio of dead space to tidal volume",
      "The ventilation-perfusion ratio"
    ],
    correctIndex: 0,
    rationale: "DLCO/VA (KCO) normalizes diffusing capacity for the volume of lung ventilated. It helps distinguish between conditions where DLCO is low due to loss of lung volume (KCO normal or increased, as in pneumonectomy) versus loss of alveolar-capillary membrane (KCO decreased, as in emphysema).",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2295",
    stem: "What is the purpose of administering a bronchodilator during pulmonary function testing?",
    options: [
      "To assess the reversibility of airway obstruction",
      "To increase the patient's pain tolerance",
      "To sedate the patient for the procedure",
      "To increase oxygen delivery to tissues"
    ],
    correctIndex: 0,
    rationale: "Bronchodilator administration during PFT assesses reversibility of airway obstruction. A significant response (≥12% and ≥200 mL increase in FEV1) suggests reversible airway disease such as asthma. Bronchodilators do not affect pain tolerance, sedation, or directly increase tissue oxygen delivery.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "bronchodilator response"
  },
  {
    id: "rrt-2296",
    stem: "A patient's maximum inspiratory pressure (MIP) is -25 cmH2O. This value indicates:",
    options: [
      "Significant inspiratory muscle weakness",
      "Normal inspiratory muscle strength",
      "Excessive inspiratory muscle strength",
      "Airway obstruction"
    ],
    correctIndex: 0,
    rationale: "Normal MIP (also called PImax or NIF) is typically more negative than -60 cmH2O in women and -80 cmH2O in men. A MIP of -25 cmH2O indicates significant inspiratory muscle weakness, which may compromise ventilation. This test is important in evaluating neuromuscular disease and weaning readiness.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "respiratory muscle strength"
  },
  {
    id: "rrt-2297",
    stem: "The predicted values for pulmonary function tests are based on which patient characteristics?",
    options: [
      "Age, height, sex, and race/ethnicity",
      "Weight, heart rate, and blood pressure",
      "Smoking history and occupation",
      "Medication use and exercise habits"
    ],
    correctIndex: 0,
    rationale: "PFT predicted values are derived from reference equations that use age, height, sex, and race/ethnicity. These are the primary determinants of normal lung function. Weight, while affecting some values, is not typically used in standard reference equations. Smoking history and medications are clinical context but not prediction variables.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "reference values"
  },
  {
    id: "rrt-2298",
    stem: "What is the significance of an increased RV/TLC ratio?",
    options: [
      "It indicates air trapping",
      "It indicates pulmonary fibrosis",
      "It indicates normal lung function",
      "It indicates reduced chest wall compliance"
    ],
    correctIndex: 0,
    rationale: "An elevated RV/TLC ratio indicates air trapping, as a disproportionately large amount of gas remains in the lungs after maximal exhalation. This is characteristic of obstructive lung diseases. In fibrosis, both RV and TLC are reduced proportionally. Normal RV/TLC is approximately 20-35% in young adults, increasing with age.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "air trapping"
  },
  {
    id: "rrt-2299",
    stem: "During a CPET, the anaerobic threshold (AT) represents the point at which:",
    options: [
      "Lactate production begins to exceed clearance",
      "Oxygen consumption reaches maximum",
      "Heart rate reaches its predicted maximum",
      "Ventilation becomes limited by airway resistance"
    ],
    correctIndex: 0,
    rationale: "The anaerobic threshold is the exercise intensity at which anaerobic metabolism supplements aerobic metabolism, causing lactate accumulation. It is identified by a disproportionate increase in VCO2 relative to VO2 (V-slope method). VO2 max is reached at peak exercise. Maximum predicted heart rate is a different parameter. Ventilatory limitation is a separate concept.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  },
  {
    id: "rrt-2300",
    stem: "Which spirometric value is MOST reproducible and effort-independent?",
    options: [
      "FEF25-75%",
      "FEV1",
      "PEFR",
      "FVC"
    ],
    correctIndex: 1,
    rationale: "FEV1 is the most reproducible spirometric measurement because once maximal effort is achieved at the start of expiration, flow during the first second is relatively effort-independent due to dynamic airway compression. PEFR is highly effort-dependent. FEF25-75% is variable and effort-dependent. FVC requires complete exhalation.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "spirometry basics"
  },
  {
    id: "rrt-2301",
    stem: "A coal miner presents for PFTs. Which pattern would be expected in advanced coal workers' pneumoconiosis?",
    options: [
      "Restrictive pattern with decreased DLCO",
      "Obstructive pattern with increased DLCO",
      "Normal spirometry with increased lung volumes",
      "Isolated decrease in PEFR"
    ],
    correctIndex: 0,
    rationale: "Advanced coal workers' pneumoconiosis (progressive massive fibrosis) typically produces a restrictive pattern with decreased lung volumes and reduced DLCO due to interstitial fibrosis and destruction of the alveolar-capillary membrane. Some patients may also show a mixed obstructive-restrictive pattern.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "occupational lung disease"
  },
  {
    id: "rrt-2302",
    stem: "The most appropriate PFT maneuver to assess a patient's ability to be weaned from mechanical ventilation is:",
    options: [
      "Maximum inspiratory pressure (MIP/NIF)",
      "Forced vital capacity (FVC)",
      "Diffusing capacity (DLCO)",
      "Methacholine challenge"
    ],
    correctIndex: 0,
    rationale: "MIP (or NIF) directly assesses inspiratory muscle strength, which is critical for successful ventilator weaning. A MIP more negative than -20 to -25 cmH2O generally suggests adequate strength for weaning. FVC may be helpful but is harder to perform on ventilated patients. DLCO and methacholine challenge are not relevant to weaning assessment.",
    difficulty: 2,
    category: "Pulmonary Diagnostics",
    topic: "respiratory muscle strength"
  },
  {
    id: "rrt-2303",
    stem: "A flow-volume loop showing flattening of the expiratory limb with a normal inspiratory limb is characteristic of:",
    options: [
      "Variable intrathoracic upper airway obstruction",
      "Variable extrathoracic upper airway obstruction",
      "Fixed upper airway obstruction",
      "Lower airway obstruction (COPD)"
    ],
    correctIndex: 0,
    rationale: "A variable intrathoracic obstruction (e.g., tracheomalacia in the intrathoracic trachea) causes greater limitation during expiration when positive pleural pressure compresses the airway around the lesion. During inspiration, negative pleural pressure opens the airway. This produces expiratory flattening with a preserved inspiratory limb.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "flow-volume loops"
  },
  {
    id: "rrt-2304",
    stem: "Which of the following is used to calibrate a spirometer?",
    options: [
      "A 3-liter calibration syringe",
      "A 1-liter graduated cylinder",
      "A mercury manometer",
      "A balloon catheter"
    ],
    correctIndex: 0,
    rationale: "Per ATS/ERS standards, spirometers must be calibrated daily using a 3-liter calibration syringe. The volume should be accurate within ±3.5% (2.90-3.10 L). A graduated cylinder is not used for spirometer calibration. Mercury manometers calibrate pressure devices. Balloon catheters are used for esophageal pressure measurement.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "equipment calibration"
  },
  {
    id: "rrt-2305",
    stem: "Slow vital capacity (SVC) may be LARGER than forced vital capacity (FVC) in patients with:",
    options: [
      "Obstructive lung disease",
      "Pulmonary fibrosis",
      "Neuromuscular weakness",
      "Chest wall deformity"
    ],
    correctIndex: 0,
    rationale: "In obstructive disease, the forced maneuver causes dynamic airway compression and air trapping, resulting in a lower FVC. During a slow maneuver, there is less dynamic compression, allowing more air to be exhaled. This SVC-FVC difference is characteristic of air trapping in obstructive disease. In restrictive conditions, SVC and FVC are usually similar.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "spirometry interpretation"
  },
  {
    id: "rrt-2306",
    stem: "A 70-year-old former smoker has the following results: FEV1 45% predicted, FVC 78% predicted, FEV1/FVC 0.45, TLC 110% predicted, RV 175% predicted, DLCO 40% predicted. The severity of obstruction according to GOLD criteria is:",
    options: [
      "Severe (GOLD 3)",
      "Mild (GOLD 1)",
      "Moderate (GOLD 2)",
      "Very severe (GOLD 4)"
    ],
    correctIndex: 0,
    rationale: "GOLD classification of COPD severity is based on post-bronchodilator FEV1 % predicted: GOLD 1 (mild) ≥80%, GOLD 2 (moderate) 50-79%, GOLD 3 (severe) 30-49%, GOLD 4 (very severe) <30%. An FEV1 of 45% predicted falls in the GOLD 3 (severe) category.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "COPD classification"
  },
  {
    id: "rrt-2307",
    stem: "During helium dilution testing, equilibrium is typically reached when the helium concentration is stable for:",
    options: [
      "2 minutes",
      "30 seconds",
      "10 minutes",
      "5 seconds"
    ],
    correctIndex: 0,
    rationale: "During helium dilution, equilibrium is considered reached when the helium concentration change is less than 0.02% over 30 seconds, which typically occurs within 2-3 minutes in normal subjects. Patients with severe obstruction may require longer. Thirty seconds is too short. Ten minutes is excessive for most patients.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "lung volume measurement"
  },
  {
    id: "rrt-2308",
    stem: "Eucapnic voluntary hyperventilation (EVH) is a bronchoprovocation test used primarily to diagnose:",
    options: [
      "Exercise-induced bronchoconstriction",
      "COPD",
      "Pulmonary fibrosis",
      "Vocal cord dysfunction"
    ],
    correctIndex: 0,
    rationale: "EVH is considered the gold standard for diagnosing exercise-induced bronchoconstriction (EIB). The patient hyperventilates dry air containing 5% CO2 to maintain eucapnia. A ≥10% fall in FEV1 is positive. It simulates the airway drying and cooling that triggers EIB during exercise. COPD and fibrosis use different diagnostic approaches.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "bronchoprovocation testing"
  },
  {
    id: "rrt-2309",
    stem: "What does the term 'lower limit of normal' (LLN) refer to in PFT interpretation?",
    options: [
      "The 5th percentile of the predicted value distribution",
      "80% of the predicted value",
      "The mean minus one standard deviation",
      "The median predicted value"
    ],
    correctIndex: 0,
    rationale: "The LLN is statistically defined as the 5th percentile of the reference population distribution, meaning 95% of healthy individuals would have values above this point. Using fixed cutoffs like 80% predicted can lead to misclassification, especially in elderly patients. The LLN is preferred by ATS/ERS for defining abnormality.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "reference values"
  },
  {
    id: "rrt-2310",
    stem: "Lung compliance is defined as:",
    options: [
      "Change in volume per unit change in pressure",
      "Change in pressure per unit change in volume",
      "Maximum volume at maximum pressure",
      "Flow rate divided by driving pressure"
    ],
    correctIndex: 0,
    rationale: "Compliance (C) = ΔV/ΔP, measuring the distensibility of the lung. Higher compliance means the lung expands more easily for a given pressure change. The inverse (ΔP/ΔV) is elastance. Flow rate divided by driving pressure is the reciprocal of resistance. Compliance is reduced in fibrosis and increased in emphysema.",
    difficulty: 1,
    category: "Pulmonary Diagnostics",
    topic: "lung mechanics"
  },
  {
    id: "rrt-2311",
    stem: "A patient with scoliosis undergoes PFTs. The most likely finding is:",
    options: [
      "Reduced TLC with normal FEV1/FVC ratio",
      "Increased TLC with reduced FEV1/FVC ratio",
      "Normal PFTs in all parameters",
      "Isolated reduction in DLCO"
    ],
    correctIndex: 0,
    rationale: "Scoliosis restricts chest wall expansion, resulting in reduced lung volumes (restrictive pattern) with a preserved FEV1/FVC ratio. The lung parenchyma itself is normal, so DLCO is typically preserved unless the restriction is severe enough to cause atelectasis. Scoliosis does not cause airway obstruction.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "restrictive patterns"
  },
  {
    id: "rrt-2312",
    stem: "Which of the following medications should be withheld before pulmonary function testing?",
    options: [
      "Short-acting bronchodilators (4-6 hours prior)",
      "Antihypertensive medications",
      "Antibiotics",
      "Proton pump inhibitors"
    ],
    correctIndex: 0,
    rationale: "Short-acting bronchodilators should be withheld 4-6 hours before baseline PFT to avoid masking reversible airway obstruction. Long-acting bronchodilators should be held for 12-24 hours. Antihypertensives, antibiotics, and proton pump inhibitors do not significantly affect PFT results and need not be withheld.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "test preparation"
  },
  {
    id: "rrt-2313",
    stem: "A patient has an FEV1/FVC ratio of 0.62 and FEV1 of 55% predicted. After bronchodilator administration, the FEV1 increases to 58% predicted. This response is:",
    options: [
      "Not significant (negative bronchodilator response)",
      "A significant positive bronchodilator response",
      "Indicative of restrictive disease",
      "Indicative of a measurement error"
    ],
    correctIndex: 0,
    rationale: "A positive bronchodilator response requires both ≥12% AND ≥200 mL improvement in FEV1 or FVC. An increase from 55% to 58% predicted represents approximately a 5% change, which does not meet the threshold for significance. This suggests fixed or poorly reversible obstruction, more consistent with COPD than asthma.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "bronchodilator response"
  },
  {
    id: "rrt-2314",
    stem: "The respiratory exchange ratio (RER) during CPET is calculated as:",
    options: [
      "VCO2/VO2",
      "VO2/VCO2",
      "VE/VO2",
      "VE/VCO2"
    ],
    correctIndex: 0,
    rationale: "RER (or respiratory quotient at the mouth) is VCO2/VO2, the ratio of carbon dioxide production to oxygen consumption. At rest on a mixed diet, RER is approximately 0.8. At peak exercise, RER >1.0 indicates significant anaerobic metabolism. VE/VO2 and VE/VCO2 are ventilatory equivalents.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  },
  {
    id: "rrt-2315",
    stem: "In a patient with idiopathic pulmonary fibrosis (IPF), which PFT parameter typically declines first?",
    options: [
      "DLCO",
      "FEV1",
      "PEFR",
      "MVV"
    ],
    correctIndex: 0,
    rationale: "DLCO is often the first and most sensitive PFT abnormality in IPF, declining before significant changes in lung volumes or spirometry. The interstitial inflammation and fibrosis impair gas transfer across the alveolar-capillary membrane early in the disease course. FEV1 and lung volumes decline as disease progresses.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "interstitial lung disease"
  },
  {
    id: "rrt-2316",
    stem: "Which device is used to measure tidal volume and respiratory rate at the bedside?",
    options: [
      "Respirometer (Wright respirometer)",
      "Body plethysmograph",
      "Nitrogen analyzer",
      "Carbon monoxide analyzer"
    ],
    correctIndex: 0,
    rationale: "A Wright respirometer is a portable, bedside device used to measure exhaled tidal volume and minute ventilation. Body plethysmography is a laboratory-based test for lung volumes and airway resistance. Nitrogen and carbon monoxide analyzers are used for specific PFT measurements in the laboratory setting.",
    difficulty: 1,
    category: "Pulmonary Diagnostics",
    topic: "bedside assessment"
  },
  {
    id: "rrt-2317",
    stem: "During a DLCO test, the breath-hold time is typically:",
    options: [
      "10 seconds",
      "3 seconds",
      "30 seconds",
      "60 seconds"
    ],
    correctIndex: 0,
    rationale: "The standard single-breath DLCO technique requires a breath-hold time of approximately 10 seconds (±2 seconds is acceptable). This allows sufficient time for CO to diffuse across the alveolar-capillary membrane. Three seconds is too short for adequate gas transfer. Thirty and sixty seconds are unnecessarily long.",
    difficulty: 1,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2318",
    stem: "A patient with amyotrophic lateral sclerosis (ALS) has the following PFT results: FVC sitting 65% predicted, FVC supine 40% predicted. This significant postural drop suggests:",
    options: [
      "Diaphragmatic weakness",
      "Upper airway obstruction",
      "Pulmonary embolism",
      "Pleural effusion"
    ],
    correctIndex: 0,
    rationale: "A significant drop in FVC (>20%) from sitting to supine position is a hallmark of diaphragmatic weakness. In the supine position, abdominal contents push against the weakened diaphragm, reducing ventilatory capacity. This is an important monitoring parameter in ALS. Upper airway obstruction, PE, and pleural effusion do not typically show this postural pattern.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "neuromuscular disease"
  },
  {
    id: "rrt-2319",
    stem: "The primary gas mixture used in the single-breath DLCO test contains:",
    options: [
      "0.3% CO, 10% helium, 21% O2, balance nitrogen",
      "5% CO2, 21% O2, balance nitrogen",
      "100% oxygen",
      "50% helium, 50% oxygen"
    ],
    correctIndex: 0,
    rationale: "The standard DLCO test gas contains approximately 0.3% CO (for diffusion measurement), 10% helium (as a tracer gas for alveolar volume), 21% O2, and balance nitrogen. The CO concentration is low enough to be safe. CO2 mixtures are used for ventilatory response testing. Pure O2 is used for nitrogen washout. Heliox is used for airway resistance assessment.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "diffusion capacity"
  },
  {
    id: "rrt-2320",
    stem: "Maximum expiratory pressure (MEP) tests the strength of which muscles?",
    options: [
      "Expiratory muscles (abdominals and internal intercostals)",
      "Inspiratory muscles (diaphragm and external intercostals)",
      "Upper airway muscles",
      "Smooth muscle of the bronchi"
    ],
    correctIndex: 0,
    rationale: "MEP (PEmax) measures the strength of expiratory muscles, primarily the abdominals and internal intercostals. It is performed by having the patient exhale forcefully against an occluded airway from TLC. MIP measures inspiratory muscle strength. Upper airway and bronchial smooth muscles are not assessed by MEP.",
    difficulty: 2,
    category: "Pulmonary Diagnostics",
    topic: "respiratory muscle strength"
  },
  {
    id: "rrt-2321",
    stem: "In a patient with suspected asthma who has normal baseline spirometry, the next appropriate diagnostic test would be:",
    options: [
      "Bronchoprovocation (methacholine challenge) test",
      "High-resolution CT scan",
      "Pulmonary angiography",
      "Cardiac catheterization"
    ],
    correctIndex: 0,
    rationale: "When baseline spirometry is normal in a patient with suspected asthma, a bronchoprovocation test (methacholine or exercise challenge) can unmask airway hyperresponsiveness. A negative test has high negative predictive value for asthma. CT scan assesses lung parenchyma, not airway reactivity. Pulmonary angiography and cardiac catheterization are unrelated.",
    difficulty: 2,
    category: "Pulmonary Diagnostics",
    topic: "bronchoprovocation testing"
  },
  {
    id: "rrt-2322",
    stem: "The repeatability criterion for FEV1 measurements in spirometry requires the two largest values to be within:",
    options: [
      "150 mL of each other",
      "500 mL of each other",
      "50 mL of each other",
      "1000 mL of each other"
    ],
    correctIndex: 0,
    rationale: "ATS/ERS repeatability criteria require that the two largest FEV1 values (and FVC values) be within 150 mL of each other. If this criterion is not met, additional maneuvers should be performed (up to 8 attempts). This ensures measurement reliability and reduces the chance of reporting inaccurate values.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2323",
    stem: "A pneumonectomy patient undergoes PFT. Expected findings include:",
    options: [
      "Reduced TLC with normal DLCO/VA (KCO)",
      "Increased TLC with reduced FEV1/FVC ratio",
      "Normal lung volumes with reduced DLCO",
      "Increased RV with air trapping"
    ],
    correctIndex: 0,
    rationale: "After pneumonectomy, lung volumes are reduced approximately 50% (restrictive pattern). However, KCO (DLCO/VA) is typically normal or even slightly elevated because the remaining lung has normal alveolar-capillary membrane function; the total DLCO is low only because of reduced alveolar volume. There is no obstruction or air trapping.",
    difficulty: 4,
    category: "Pulmonary Function Testing",
    topic: "post-surgical assessment"
  },
  {
    id: "rrt-2324",
    stem: "The sniff nasal inspiratory pressure (SNIP) test measures:",
    options: [
      "Inspiratory muscle strength via a nasal plug",
      "Nasal airway resistance",
      "Olfactory nerve function",
      "Sinus pressure during Valsalva maneuver"
    ],
    correctIndex: 0,
    rationale: "SNIP is a noninvasive test of inspiratory muscle strength performed by placing a plug in one nostril and measuring pressure during a maximal sniff through the contralateral nostril. It is an alternative to MIP, particularly useful in patients who have difficulty performing the MIP maneuver (e.g., patients with facial weakness or neuromuscular disease).",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "respiratory muscle strength"
  },
  {
    id: "rrt-2325",
    stem: "When interpreting PFTs, which of the following sequences is recommended?",
    options: [
      "Spirometry → lung volumes → DLCO → bronchodilator response",
      "DLCO → bronchodilator response → spirometry → lung volumes",
      "Bronchodilator response → DLCO → lung volumes → spirometry",
      "Lung volumes → DLCO → bronchodilator response → spirometry"
    ],
    correctIndex: 0,
    rationale: "The recommended approach to PFT interpretation starts with spirometry (to identify obstruction or possible restriction), then lung volumes (to confirm restriction if suspected), then DLCO (to assess gas exchange), and finally bronchodilator response (to assess reversibility if obstruction is present). This systematic approach ensures accurate classification.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "PFT interpretation strategy"
  },
  {
    id: "rrt-2326",
    stem: "A patient with sarcoidosis has the following PFTs: TLC 75% predicted, FEV1/FVC 0.72, DLCO 55% predicted. This pattern is best described as:",
    options: [
      "Restrictive defect with impaired gas exchange",
      "Obstructive defect with normal gas exchange",
      "Mixed obstructive-restrictive defect",
      "Normal PFTs"
    ],
    correctIndex: 0,
    rationale: "Reduced TLC confirms restriction. The FEV1/FVC ratio is normal (≥0.70), ruling out obstruction. A significantly reduced DLCO indicates impaired gas exchange, consistent with sarcoidosis affecting the lung parenchyma and causing interstitial inflammation. Sarcoidosis is a common cause of restrictive lung disease with reduced DLCO.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "interstitial lung disease"
  },
  {
    id: "rrt-2327",
    stem: "Oscillometry measures resistance at different frequencies. Resistance at 5 Hz (R5) reflects:",
    options: [
      "Total respiratory system resistance including peripheral airways",
      "Only central airway resistance",
      "Alveolar distensibility",
      "Chest wall elastance"
    ],
    correctIndex: 0,
    rationale: "In oscillometry, low-frequency oscillations (5 Hz) penetrate to the lung periphery and measure total respiratory system resistance, including peripheral (small) airway resistance. Higher frequencies (20 Hz) reflect primarily central airway resistance. The difference R5-R20 estimates peripheral airway resistance. Alveolar distensibility and chest wall elastance are separate measurements.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "oscillometry"
  },
  {
    id: "rrt-2328",
    stem: "Which of the following spirometry findings would indicate a need for full lung volume measurement to confirm restriction?",
    options: [
      "Low FVC with normal FEV1/FVC ratio",
      "Low FEV1/FVC ratio with normal FVC",
      "Normal FVC with normal FEV1/FVC ratio",
      "Low PEFR with normal FVC"
    ],
    correctIndex: 0,
    rationale: "A low FVC with a normal or elevated FEV1/FVC ratio on spirometry suggests restriction but cannot confirm it, as air trapping in obstructive disease can also reduce FVC. Measuring TLC (which is reduced only in restriction) is necessary to confirm true restriction. A low ratio with normal FVC confirms obstruction. Normal values need no further testing.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "spirometry interpretation"
  },
  {
    id: "rrt-2329",
    stem: "The phase III slope of the single-breath nitrogen washout test is increased in:",
    options: [
      "Patients with uneven ventilation distribution",
      "Healthy young adults",
      "Patients after successful lung transplant",
      "Patients breathing supplemental oxygen"
    ],
    correctIndex: 0,
    rationale: "An increased phase III (alveolar plateau) slope indicates uneven ventilation distribution, where different lung regions have varying nitrogen concentrations due to differences in ventilation. This is seen in small airway disease and aging. Healthy lungs have a minimal slope. Transplant and supplemental oxygen do not directly affect the slope.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "ventilation distribution"
  },
  {
    id: "rrt-2330",
    stem: "Which condition would most likely produce a mixed obstructive-restrictive pattern on PFTs?",
    options: [
      "COPD combined with obesity",
      "Mild asthma alone",
      "Isolated pleural effusion",
      "Vocal cord dysfunction"
    ],
    correctIndex: 0,
    rationale: "A mixed pattern shows both obstruction (reduced FEV1/FVC) and restriction (reduced TLC). COPD with obesity combines airflow obstruction from COPD with volume restriction from obesity. Mild asthma alone typically shows obstruction only. Pleural effusion causes restriction. Vocal cord dysfunction produces upper airway obstruction patterns.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "mixed patterns"
  },
  {
    id: "rrt-2331",
    stem: "Before performing DLCO testing, the patient should refrain from smoking for at least:",
    options: [
      "24 hours",
      "1 hour",
      "1 week",
      "30 days"
    ],
    correctIndex: 0,
    rationale: "Patients should not smoke for at least 24 hours before DLCO testing. Smoking increases carboxyhemoglobin levels, which reduces the amount of hemoglobin available to bind the test gas CO, resulting in a falsely decreased DLCO. One hour is insufficient for carboxyhemoglobin to clear. One week and 30 days exceed the necessary abstinence period.",
    difficulty: 1,
    category: "Pulmonary Diagnostics",
    topic: "test preparation"
  },
  {
    id: "rrt-2332",
    stem: "The ventilatory reserve during CPET is calculated as:",
    options: [
      "1 - (peak VE / MVV)",
      "Peak VO2 / predicted VO2 max",
      "Peak heart rate / predicted maximum heart rate",
      "VD/VT at peak exercise"
    ],
    correctIndex: 0,
    rationale: "Ventilatory reserve = 1 - (peak VE/MVV), expressing how much ventilatory capacity remains unused at peak exercise. Normal individuals typically use <70-80% of their MVV. A low ventilatory reserve (<15-20%) suggests ventilatory limitation to exercise. VO2 ratio assesses metabolic capacity. Heart rate ratio assesses cardiac reserve. VD/VT assesses dead space.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  },
  {
    id: "rrt-2333",
    stem: "A patient performing spirometry demonstrates good effort but the end-of-test volume plateau is not achieved. The technician should:",
    options: [
      "Encourage the patient to continue exhaling and repeat if necessary",
      "Accept the maneuver as is",
      "Stop testing to prevent injury",
      "Report only the FEV1 value"
    ],
    correctIndex: 0,
    rationale: "If the volume-time curve does not show a plateau (indicating exhalation is complete), the patient should be coached to continue blowing until a plateau is reached or 15 seconds have elapsed. Without a plateau, the FVC may be underestimated. The maneuver should be repeated with better coaching if needed.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2334",
    stem: "Which PFT finding differentiates emphysema from chronic bronchitis?",
    options: [
      "Reduced DLCO in emphysema; normal or near-normal DLCO in chronic bronchitis",
      "Increased TLC in chronic bronchitis; normal TLC in emphysema",
      "Reduced FEV1/FVC in emphysema; normal FEV1/FVC in chronic bronchitis",
      "Elevated MVV in emphysema; reduced MVV in chronic bronchitis"
    ],
    correctIndex: 0,
    rationale: "Emphysema destroys alveolar walls and capillaries, significantly reducing DLCO. In chronic bronchitis, the airway inflammation does not destroy the alveolar-capillary membrane, so DLCO may be normal or only mildly reduced. Both conditions show reduced FEV1/FVC and may have increased TLC. MVV is reduced in both.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "COPD subtypes"
  },
  {
    id: "rrt-2335",
    stem: "Expiratory reserve volume (ERV) is defined as:",
    options: [
      "The additional volume of air that can be exhaled after a normal tidal exhalation",
      "The volume of air remaining after maximal exhalation",
      "The total volume of air the lungs can hold",
      "The volume of a normal breath"
    ],
    correctIndex: 0,
    rationale: "ERV is the volume of air that can be exhaled beyond the end-tidal expiratory level by active effort. It is one component of FRC (FRC = ERV + RV). RV is the air remaining after maximal exhalation. TLC is the total lung capacity. Tidal volume is the volume of a normal breath.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "lung volumes"
  },
  {
    id: "rrt-2336",
    stem: "Mannitol challenge testing is an indirect bronchoprovocation test that causes bronchoconstriction by:",
    options: [
      "Increasing airway surface osmolarity, triggering mediator release from mast cells",
      "Directly stimulating muscarinic receptors on smooth muscle",
      "Blocking beta-2 adrenergic receptors",
      "Inhibiting surfactant production"
    ],
    correctIndex: 0,
    rationale: "Inhaled mannitol is a hyperosmolar agent that draws water from the airway surface, increasing osmolarity. This triggers mast cell degranulation and release of bronchoconstrictor mediators (histamine, leukotrienes). This is an indirect mechanism, unlike methacholine which directly stimulates muscarinic receptors. Mannitol is more specific for active airway inflammation.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "bronchoprovocation testing"
  },
  {
    id: "rrt-2337",
    stem: "A patient has an FEV1 of 2.5 L pre-bronchodilator and 2.9 L post-bronchodilator. The percent change in FEV1 is:",
    options: [
      "16%",
      "10%",
      "8%",
      "20%"
    ],
    correctIndex: 0,
    rationale: "The percent change is calculated as: [(post - pre) / pre] × 100 = [(2.9 - 2.5) / 2.5] × 100 = 16%. The absolute change is 400 mL, which exceeds 200 mL, and 16% exceeds 12%, so this meets criteria for a significant bronchodilator response.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "bronchodilator response"
  },
  {
    id: "rrt-2338",
    stem: "Transdiaphragmatic pressure (Pdi) is measured using:",
    options: [
      "Esophageal and gastric balloon catheters",
      "A mouth pressure transducer",
      "A body plethysmograph",
      "A pneumotachometer"
    ],
    correctIndex: 0,
    rationale: "Pdi is the difference between gastric pressure (reflecting abdominal pressure) and esophageal pressure (reflecting pleural pressure), measured using balloon catheters placed in the esophagus and stomach. It is the gold standard for assessing diaphragmatic function. Mouth pressure and plethysmography measure different parameters.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "diaphragm assessment"
  },
  {
    id: "rrt-2339",
    stem: "The normal range for total lung capacity (TLC) as a percentage of predicted is:",
    options: [
      "80-120% predicted",
      "50-70% predicted",
      "130-150% predicted",
      "60-80% predicted"
    ],
    correctIndex: 0,
    rationale: "Normal TLC is generally within 80-120% of predicted values. Values below 80% suggest restriction. Values above 120% suggest hyperinflation, as seen in obstructive lung disease. The exact range may vary slightly depending on the reference equations used and the laboratory's standards.",
    difficulty: 1,
    category: "Pulmonary Function Testing",
    topic: "reference values"
  },
  {
    id: "rrt-2340",
    stem: "A patient with alpha-1 antitrypsin deficiency would be expected to show which PFT pattern?",
    options: [
      "Obstructive pattern with reduced DLCO and increased RV",
      "Restrictive pattern with increased DLCO",
      "Normal PFTs with isolated reduced MVV",
      "Mixed pattern with increased DLCO"
    ],
    correctIndex: 0,
    rationale: "Alpha-1 antitrypsin deficiency causes panacinar emphysema, producing an obstructive pattern (reduced FEV1/FVC) with decreased DLCO (due to alveolar destruction) and increased RV (due to air trapping). The emphysema pattern is similar to smoking-related emphysema but often affects lower lobes preferentially.",
    difficulty: 3,
    category: "Pulmonary Diagnostics",
    topic: "obstructive patterns"
  },
  {
    id: "rrt-2341",
    stem: "Quality control for a pulmonary function testing laboratory should include biological control testing performed:",
    options: [
      "Weekly using a healthy nonsmoking subject",
      "Once a year during annual inspection",
      "Only when equipment is repaired",
      "Monthly using a COPD patient"
    ],
    correctIndex: 0,
    rationale: "Biological controls involve testing a healthy nonsmoking subject weekly (or at minimum monthly) to verify the accuracy and consistency of the PFT equipment over time. This subject's results should remain within ±5% of their established baseline. Annual testing is insufficient. Testing only after repair misses drift. COPD patients have variable results.",
    difficulty: 2,
    category: "Pulmonary Function Testing",
    topic: "quality control"
  },
  {
    id: "rrt-2342",
    stem: "During CPET, a VE/VCO2 slope >34 is associated with:",
    options: [
      "Increased dead space ventilation or poor cardiac output",
      "Normal exercise capacity",
      "Superior athletic fitness",
      "Airway hyperreactivity"
    ],
    correctIndex: 0,
    rationale: "The VE/VCO2 slope reflects ventilatory efficiency. A slope >34 indicates excessive ventilation for a given CO2 output, seen with increased dead space (pulmonary vascular disease), elevated chemosensitivity, or poor cardiac output (heart failure). Normal slope is typically <30. An elevated slope is a poor prognostic marker in heart failure.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  },
  {
    id: "rrt-2343",
    stem: "A patient with bilateral diaphragm paralysis would show which of the following on PFT?",
    options: [
      "Marked reduction in FVC supine compared to upright",
      "Increased DLCO",
      "Obstructive pattern with air trapping",
      "Increased TLC"
    ],
    correctIndex: 0,
    rationale: "Bilateral diaphragm paralysis causes marked FVC reduction in the supine position (>30% drop) because abdominal contents push against the paralyzed diaphragm when supine. Upright FVC is supported by gravity pulling abdominal contents down. DLCO is unaffected by diaphragm paralysis. TLC is decreased, not increased.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "neuromuscular disease"
  },
  {
    id: "rrt-2344",
    stem: "The coefficient of retraction (CR) is calculated from PFTs and represents:",
    options: [
      "Maximum elastic recoil pressure at TLC",
      "Total compliance of the chest wall",
      "Airway conductance at FRC",
      "Resistance to airflow at peak expiratory flow"
    ],
    correctIndex: 0,
    rationale: "The coefficient of retraction is the maximal static recoil pressure measured at TLC. It reflects lung elastic recoil and is decreased in emphysema (loss of elastic tissue) and increased in fibrosis (stiff lungs). It is measured from the static pressure-volume curve during stepwise deflation from TLC.",
    difficulty: 5,
    category: "Pulmonary Diagnostics",
    topic: "lung mechanics"
  },
  {
    id: "rrt-2345",
    stem: "What is the normal value for dead space to tidal volume ratio (VD/VT) at rest?",
    options: [
      "0.20-0.40",
      "0.60-0.80",
      "0.01-0.05",
      "0.80-1.00"
    ],
    correctIndex: 0,
    rationale: "Normal VD/VT ratio at rest is approximately 0.20-0.40, meaning 20-40% of each breath is wasted in dead space. This ratio normally decreases with exercise as tidal volume increases. Values >0.40 at rest suggest increased dead space, as seen in pulmonary embolism, COPD, or pulmonary hypertension.",
    difficulty: 2,
    category: "Pulmonary Diagnostics",
    topic: "dead space assessment"
  },
  {
    id: "rrt-2346",
    stem: "In spirometry, FEV6 (forced expiratory volume in 6 seconds) has been proposed as a surrogate for:",
    options: [
      "FVC",
      "FEV1",
      "PEFR",
      "MVV"
    ],
    correctIndex: 0,
    rationale: "FEV6 has been proposed as a surrogate for FVC because many patients (especially elderly and those with obstruction) have difficulty achieving a true end-of-test plateau. FEV6 provides a reproducible endpoint at exactly 6 seconds and correlates well with FVC. The FEV1/FEV6 ratio can substitute for FEV1/FVC in screening.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "spirometry alternatives"
  },
  {
    id: "rrt-2347",
    stem: "A pre-operative patient's predicted post-operative (PPO) FEV1 is calculated before lung resection surgery. The minimum acceptable PPO FEV1 for lobectomy is generally:",
    options: [
      "≥40% predicted (or ≥0.8 L)",
      "≥80% predicted",
      "≥20% predicted",
      "≥10% predicted (or ≥0.5 L)"
    ],
    correctIndex: 0,
    rationale: "A PPO FEV1 ≥40% predicted (approximately ≥0.8 L) is generally considered the minimum for lobectomy with acceptable surgical risk. Values below this threshold indicate high risk for postoperative respiratory complications. PPO DLCO should also be ≥40% predicted. Values of 80% would exclude many surgical candidates unnecessarily.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "pre-operative assessment"
  },
  {
    id: "rrt-2348",
    stem: "The GLI-2012 (Global Lung Initiative) reference equations differ from older reference equations primarily because they:",
    options: [
      "Use the lower limit of normal (LLN) and cover ages 3-95 across multiple ethnic groups",
      "Only apply to Caucasian adults",
      "Use fixed cutoff values of 80% predicted",
      "Exclude pediatric populations"
    ],
    correctIndex: 0,
    rationale: "GLI-2012 equations are multi-ethnic, cover ages 3-95 years, and use statistically derived LLN (z-scores) rather than fixed percentage cutoffs. They provide more accurate classification across diverse populations and age ranges. Older equations often used fixed 80% cutoffs and were derived from limited ethnic groups.",
    difficulty: 3,
    category: "Pulmonary Function Testing",
    topic: "reference values"
  },
  {
    id: "rrt-2349",
    stem: "A patient undergoing cardiopulmonary exercise testing reaches a peak VO2 of 10 mL/kg/min with an RER of 1.15 and a heart rate of 95% predicted maximum. This peak VO2 indicates:",
    options: [
      "Severe exercise limitation",
      "Normal exercise capacity",
      "Mild exercise limitation",
      "Submaximal effort"
    ],
    correctIndex: 0,
    rationale: "A peak VO2 of 10 mL/kg/min indicates severe exercise limitation (normal is >20 mL/kg/min for sedentary adults). The RER >1.0 and HR near predicted maximum confirm adequate effort, ruling out submaximal performance. This degree of limitation is significant and may indicate advanced cardiac or pulmonary disease. Mild limitation would be VO2 15-20 mL/kg/min.",
    difficulty: 4,
    category: "Pulmonary Diagnostics",
    topic: "exercise testing"
  }
];
