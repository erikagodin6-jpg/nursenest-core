import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "acute-silicosis-rpn": {
    title: "Acute Silicosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Silicosis",
      content: "Silicosis is a chronic, irreversible occupational lung disease caused by the inhalation of crystalline silica dust (silicon dioxide, SiO2). Silica particles smaller than 10 micrometers penetrate deep into the terminal bronchioles and alveoli, where they are engulfed by alveolar macrophages. However, silica is cytotoxic to macrophages: the sharp, crystalline structure of the particles disrupts lysosomal membranes within the macrophage, releasing proteolytic enzymes and inflammatory mediators (interleukin-1, tumor necrosis factor-alpha, and reactive oxygen species) into the surrounding lung tissue. This triggers a sustained inflammatory response that recruits additional macrophages, lymphocytes, and fibroblasts to the site. The fibroblasts deposit excessive collagen around the silica particles, forming characteristic silicotic nodules -- small, round, well-circumscribed areas of fibrosis typically 2-4 millimeters in diameter. These nodules are most concentrated in the upper lobes and hilar regions. Over time, individual nodules may coalesce into larger masses of fibrosis called progressive massive fibrosis (PMF), which destroys functional lung parenchyma and severely restricts gas exchange. The fibrotic process stiffens the lung tissue, reducing lung compliance and total lung capacity, producing a restrictive pattern on pulmonary function testing. A hallmark radiographic finding is eggshell calcification of the hilar lymph nodes, in which calcium deposits form a ring-like pattern around the periphery of enlarged lymph nodes. Silicosis also significantly increases the risk of tuberculosis because silica impairs macrophage bactericidal function; this combination is termed silicotuberculosis. There are three clinical forms based on exposure intensity and duration: chronic silicosis (develops after 10-30 years of low-level exposure), accelerated silicosis (develops within 5-10 years of moderate exposure), and acute silicosis (develops within weeks to 5 years of intense exposure). Acute silicosis, also called silicoproteinosis, presents with rapid onset of dyspnea and resembles pulmonary alveolar proteinosis, with alveoli filling with proteinaceous fluid rather than forming typical nodules. There is no cure for silicosis; lung damage is permanent and progressive even after exposure ceases."
    },
    riskFactors: [
      "Occupational silica exposure: sandblasting, mining, quarrying, stone cutting, tunneling, foundry work, ceramic manufacturing",
      "Duration and intensity of exposure: cumulative dose is the primary determinant of disease severity",
      "Lack of respiratory protective equipment or inadequate workplace ventilation systems",
      "Concurrent cigarette smoking (synergistic damage to airways and impaired mucociliary clearance)",
      "Pre-existing lung disease such as COPD or asthma (reduced pulmonary reserve accelerates functional decline)",
      "Working with materials containing high quartz content (granite, sandstone, flint have highest silica concentrations)",
      "Immunocompromised status (increases susceptibility to silicotuberculosis and opportunistic pulmonary infections)"
    ],
    diagnostics: [
      "Chest X-ray: reveals small rounded opacities predominantly in upper lobes; eggshell calcification of hilar lymph nodes is pathognomonic; progressive massive fibrosis appears as bilateral upper lobe masses greater than 1 cm",
      "High-resolution CT scan (HRCT): more sensitive than chest X-ray for early nodular disease; demonstrates silicotic nodules, lymphadenopathy, and early confluence of fibrosis",
      "Pulmonary function tests (PFTs): restrictive pattern (reduced FVC, reduced TLC, normal or increased FEV1/FVC ratio); mixed obstructive-restrictive pattern may occur with concurrent COPD",
      "Arterial blood gas (ABG): may show hypoxemia (decreased PaO2) with normal or low PaCO2 in early disease; hypercapnia develops in advanced disease",
      "Tuberculin skin test (TST) or interferon-gamma release assay (IGRA): mandatory screening because silicosis increases TB risk 3-fold; positive results require further workup",
      "Bronchoalveolar lavage (BAL): in acute silicosis, reveals milky or proteinaceous fluid with birefringent silica particles under polarized light microscopy"
    ],
    management: [
      "Remove patient from further silica exposure immediately; this is the single most important intervention to slow disease progression",
      "Administer supplemental oxygen therapy as prescribed to maintain SpO2 above 92%; titrate based on ABG results and clinical response",
      "Administer bronchodilators (albuterol via nebulizer or MDI) as prescribed for symptomatic relief of airway obstruction and dyspnea",
      "Administer corticosteroids (prednisone) as prescribed to reduce pulmonary inflammation in acute or accelerated silicosis",
      "Implement pulmonary rehabilitation program including breathing exercises, energy conservation techniques, and graded physical activity",
      "Administer annual influenza vaccine and pneumococcal vaccine to prevent respiratory infections that exacerbate lung function decline",
      "Screen and treat for tuberculosis if indicated; administer isoniazid prophylaxis as prescribed for latent TB infection in silicosis patients"
    ],
    nursingActions: [
      "Monitor respiratory status every 4 hours: rate, depth, rhythm, SpO2, use of accessory muscles, and work of breathing; report SpO2 below 92% or increasing dyspnea",
      "Auscultate lung sounds bilaterally: fine inspiratory crackles (velcro-like) suggest fibrosis; wheezing suggests bronchospasm; diminished breath sounds indicate consolidated or fibrotic areas",
      "Position patient in high-Fowler position (60-90 degrees) to maximize diaphragmatic excursion and reduce work of breathing",
      "Teach and reinforce pursed-lip breathing technique: inhale slowly through the nose for 2 counts, exhale through pursed lips for 4 counts to prevent airway collapse",
      "Monitor sputum characteristics: color, amount, consistency, and presence of blood; report hemoptysis or purulent sputum immediately",
      "Educate patient on energy conservation: plan activities with rest periods, use assistive devices, prioritize essential tasks during peak energy times",
      "Document and report any new-onset fever, increased sputum production, or worsening dyspnea as these may indicate superimposed infection or disease progression"
    ],
    assessmentFindings: [
      "Progressive dyspnea on exertion that worsens over months to years, eventually occurring at rest in advanced disease",
      "Chronic dry cough that may become productive with superimposed infection; hemoptysis suggests cavitation or tuberculosis",
      "Fine inspiratory crackles (velcro rales) on auscultation, predominantly over upper lung fields",
      "Digital clubbing in advanced disease indicating chronic hypoxemia",
      "Decreased chest expansion bilaterally due to fibrotic stiffening of lung tissue",
      "Cyanosis (central and peripheral) in advanced disease with significant gas exchange impairment",
      "Weight loss, fatigue, and exercise intolerance due to increased metabolic demand of labored breathing"
    ],
    signs: {
      left: [
        "Mild dyspnea on exertion with normal resting respiratory rate",
        "Occasional dry nonproductive cough",
        "Fine inspiratory crackles in upper lung fields",
        "Mild fatigue with decreased exercise tolerance",
        "SpO2 94-96% at rest with desaturation on exertion",
        "Chest tightness reported during physical activity"
      ],
      right: [
        "Severe dyspnea at rest with accessory muscle use and nasal flaring",
        "Central cyanosis (bluish discoloration of lips and mucous membranes)",
        "SpO2 below 88% despite supplemental oxygen",
        "Hemoptysis (blood-tinged or frank bloody sputum)",
        "Signs of right-sided heart failure (cor pulmonale): jugular vein distension, peripheral edema, hepatomegaly",
        "Acute respiratory distress with tachypnea greater than 30 breaths per minute"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the inflammatory cascade by inhibiting phospholipase A2, reducing production of prostaglandins, leukotrienes, and pro-inflammatory cytokines (TNF-alpha, IL-1); decreases macrophage activation and fibroblast proliferation in the lungs to slow fibrotic progression",
        sideEffects: "Hyperglycemia, immunosuppression, osteoporosis with long-term use, adrenal suppression, weight gain, mood changes, peptic ulcer, Cushing syndrome features (moon face, buffalo hump, striae)",
        contra: "Active untreated systemic fungal infection; live vaccine administration during therapy; uncontrolled diabetes mellitus (relative); active peptic ulcer disease (relative)",
        pearl: "Administer with food in the morning to mimic natural cortisol rhythm and reduce GI irritation; never discontinue abruptly after prolonged use (taper gradually to prevent adrenal crisis); monitor blood glucose closely in diabetic patients as corticosteroids cause significant hyperglycemia"
      },
      {
        name: "Acetylcysteine (Mucomyst)",
        type: "Mucolytic agent",
        action: "Breaks disulfide bonds in mucus glycoproteins, reducing mucus viscosity and promoting clearance of thick, tenacious secretions from the airways; also possesses antioxidant properties by serving as a precursor to glutathione, which may help reduce oxidative damage in fibrotic lung tissue",
        sideEffects: "Bronchospasm (most significant -- can worsen airway obstruction), nausea, vomiting, stomatitis, rhinorrhea, unpleasant sulfur taste and odor",
        contra: "Active bronchospasm (pre-treat with bronchodilator); status asthmaticus; hypersensitivity to acetylcysteine",
        pearl: "Always administer a bronchodilator (albuterol) 15-20 minutes BEFORE inhaled acetylcysteine to prevent bronchospasm; the medication has a strong sulfur odor (rotten eggs) that may cause nausea; suction equipment should be available as loosened secretions may need to be cleared"
      },
      {
        name: "Albuterol (Ventolin/Proventil)",
        type: "Short-acting beta-2 adrenergic agonist (SABA) bronchodilator",
        action: "Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, activating adenylyl cyclase to increase intracellular cyclic AMP, causing rapid bronchial smooth muscle relaxation and bronchodilation; also inhibits mast cell mediator release and improves mucociliary clearance",
        sideEffects: "Tachycardia, palpitations, tremor (especially hands), nervousness, headache, hypokalemia with frequent use, paradoxical bronchospasm (rare)",
        contra: "Known hypersensitivity to albuterol; use with caution in patients with cardiac dysrhythmias, hyperthyroidism, or severe cardiovascular disease",
        pearl: "Onset of action is 5-15 minutes with peak effect at 30-60 minutes; duration 4-6 hours; teach proper MDI technique (shake, exhale fully, coordinate actuation with slow deep inhalation, hold breath 10 seconds); if using both albuterol and a corticosteroid inhaler, always use albuterol FIRST to open airways before the steroid"
      }
    ],
    pearls: [
      "Eggshell calcification of hilar lymph nodes on chest X-ray is pathognomonic for silicosis -- calcium deposits form a characteristic ring pattern around the periphery of enlarged lymph nodes.",
      "The correct sequence of abdominal assessment (inspect, auscultate, percuss, palpate) does NOT apply to respiratory assessment -- for lungs, the standard sequence is inspect, palpate, percuss, auscultate.",
      "Silicosis patients have a 3-fold increased risk of developing tuberculosis because silica particles impair macrophage killing ability -- screen annually with TST or IGRA.",
      "Progressive massive fibrosis (PMF) occurs when silicotic nodules coalesce into large fibrotic masses greater than 1 cm, typically in the upper lobes, severely compromising gas exchange.",
      "Always administer a bronchodilator BEFORE mucolytic therapy (acetylcysteine) to prevent bronchospasm -- loosened secretions combined with airway reactivity can cause acute respiratory distress.",
      "There is no cure for silicosis and lung damage continues to progress even after removal from silica exposure -- early detection and exposure cessation are the most important interventions.",
      "Cor pulmonale (right-sided heart failure) develops in advanced silicosis because chronic hypoxemia causes pulmonary vasoconstriction, increasing pulmonary artery pressure and right ventricular workload."
    ],
    quiz: [
      {
        question: "A practical nurse is reviewing the chest X-ray report of a patient with a 25-year history of sandblasting. Which radiographic finding is most characteristic of silicosis?",
        options: [
          "Bilateral lower lobe infiltrates with air bronchograms",
          "Eggshell calcification of hilar lymph nodes with upper lobe nodules",
          "Unilateral pleural effusion with mediastinal shift",
          "Bilateral hilar lymphadenopathy with bilateral lower lobe consolidation"
        ],
        correct: 1,
        rationale: "Eggshell calcification of hilar lymph nodes (calcium deposits forming a ring pattern around lymph node periphery) combined with small rounded opacities predominantly in the upper lobes is pathognomonic for silicosis. This pattern is virtually diagnostic and distinguishes silicosis from other occupational lung diseases."
      },
      {
        question: "A patient with silicosis is prescribed inhaled acetylcysteine for mucus clearance. Which nursing action should the practical nurse perform BEFORE administering this medication?",
        options: [
          "Administer a bronchodilator such as albuterol 15-20 minutes prior",
          "Withhold all oral fluids for 2 hours before treatment",
          "Administer an antihistamine to prevent allergic reaction",
          "Position the patient flat in a supine position for optimal drug distribution"
        ],
        correct: 0,
        rationale: "A bronchodilator (such as albuterol) must be administered 15-20 minutes BEFORE inhaled acetylcysteine because acetylcysteine can cause bronchospasm. Opening the airways first with a bronchodilator ensures the mucolytic can be delivered safely and effectively without triggering dangerous airway constriction."
      },
      {
        question: "A practical nurse is caring for a patient newly diagnosed with chronic silicosis. Which screening test should be performed annually for this patient?",
        options: [
          "Serum alpha-fetoprotein for liver cancer screening",
          "Tuberculin skin test or interferon-gamma release assay",
          "Fasting blood glucose for diabetes screening",
          "Prostate-specific antigen for prostate cancer screening"
        ],
        correct: 1,
        rationale: "Patients with silicosis have a significantly increased risk (approximately 3-fold) of developing tuberculosis because silica particles impair alveolar macrophage function and bactericidal capacity. Annual TB screening with TST or IGRA is recommended for all silicosis patients, with treatment of latent TB infection to prevent active disease."
      }
    ]
  },

  "asbestosis-rpn": {
    title: "Asbestosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Asbestosis",
      content: "Asbestosis is a chronic, progressive interstitial lung disease caused by the inhalation and retention of asbestos fibers in the lung parenchyma. Asbestos is a naturally occurring silicate mineral that was widely used in construction, insulation, shipbuilding, automotive brakes, and industrial manufacturing due to its heat resistance, tensile strength, and insulating properties. When asbestos-containing materials are disturbed, microscopic fibers become airborne and can be inhaled deep into the respiratory tract. There are two main fiber types: serpentine fibers (chrysotile, which is curved and more easily cleared) and amphibole fibers (amosite, crocidolite, tremolite, which are straight, needle-like, and more pathogenic). The inhaled fibers penetrate to the terminal bronchioles and alveoli, where alveolar macrophages attempt to engulf them. However, amphibole fibers are too long (greater than 20 micrometers) for complete phagocytosis, a phenomenon called frustrated phagocytosis. The macrophages release reactive oxygen species, proteolytic enzymes, and fibrogenic growth factors (transforming growth factor-beta, platelet-derived growth factor) in an attempt to destroy the fibers. This persistent inflammatory response activates fibroblasts, which deposit excessive collagen in the alveolar interstitium, causing progressive interstitial fibrosis. The fibrosis thickens the alveolar-capillary membrane, impairing gas diffusion and producing the characteristic restrictive lung disease pattern. Fibrosis typically begins in the lower lobes and progresses upward, distinguishing asbestosis from silicosis (which affects upper lobes first). Asbestos bodies (golden-brown, dumbbell-shaped structures visible on microscopy) form when macrophages coat asbestos fibers with iron-containing protein (ferritin and hemosiderin) and are considered a hallmark pathological finding. Pleural plaques -- discrete areas of hyalinized collagen on the parietal pleura, often calcified -- are the most common manifestation of asbestos exposure and serve as a radiographic marker, though they themselves rarely cause symptoms. The latency period between initial exposure and disease manifestation is typically 15-20 years or longer. Critically, asbestos exposure significantly increases the risk of malignant mesothelioma (a cancer of the pleural or peritoneal mesothelium that is almost exclusively caused by asbestos, with a latency of 20-40 years) and bronchogenic carcinoma (lung cancer risk is multiplicative when combined with smoking: asbestos alone increases risk 5-fold, smoking alone 10-fold, but the combination increases risk 50-fold). There is no cure for asbestosis; treatment is supportive, focusing on symptom management, prevention of complications, and surveillance for malignancy."
    },
    riskFactors: [
      "Occupational asbestos exposure: construction workers, shipyard workers, insulation installers, automotive brake mechanics, demolition workers, plumbers, electricians",
      "Duration and intensity of asbestos exposure: cumulative fiber dose determines disease severity; even brief intense exposures can cause disease decades later",
      "Amphibole fiber exposure (crocidolite, amosite): straight needle-like fibers are more pathogenic than serpentine chrysotile fibers",
      "Concurrent cigarette smoking: multiplicative risk for lung cancer (50-fold increased risk with combined asbestos exposure and smoking)",
      "Environmental or household exposure: family members of asbestos workers exposed through contaminated clothing brought home (paraoccupational exposure)",
      "Living near asbestos mines or processing facilities (environmental exposure through contaminated air and soil)",
      "Lack of respiratory protective equipment during exposure period (many exposures occurred before modern safety regulations)"
    ],
    diagnostics: [
      "Chest X-ray: bilateral lower lobe interstitial fibrosis (irregular linear opacities), pleural plaques (often calcified) on lateral chest wall and diaphragm, ground-glass opacities in early disease",
      "High-resolution CT scan (HRCT): most sensitive imaging for early asbestosis; demonstrates subpleural curvilinear lines, parenchymal bands, honeycombing in advanced disease, and calcified pleural plaques",
      "Pulmonary function tests (PFTs): restrictive pattern with reduced FVC, reduced TLC, reduced DLCO (diffusing capacity); FEV1/FVC ratio is normal or increased",
      "Arterial blood gas (ABG): hypoxemia (decreased PaO2) initially on exertion only, progressing to resting hypoxemia; increased alveolar-arterial oxygen gradient",
      "Bronchoalveolar lavage (BAL): asbestos bodies (golden-brown dumbbell-shaped structures) visible on microscopy confirm asbestos exposure; elevated neutrophil and eosinophil counts",
      "CT-guided biopsy or surgical lung biopsy: definitive diagnosis in atypical cases; shows interstitial fibrosis with asbestos bodies; not routinely needed when imaging and exposure history are consistent"
    ],
    management: [
      "Permanent removal from further asbestos exposure; even brief additional exposure accelerates fibrotic progression in sensitized lungs",
      "Smoking cessation is critical: combined asbestos and smoking increases lung cancer risk 50-fold; provide pharmacological and behavioral cessation support",
      "Supplemental oxygen therapy as prescribed: titrate to maintain SpO2 above 92% at rest and during activity; may require continuous oxygen in advanced disease",
      "Pulmonary rehabilitation program: supervised exercise training, breathing retraining (diaphragmatic breathing, pursed-lip breathing), energy conservation education",
      "Administer corticosteroids (prednisone) as prescribed in patients with significant inflammatory component; evidence for efficacy is limited but may slow progression in some cases",
      "Annual low-dose CT screening for lung cancer in patients with significant asbestos exposure history, particularly those with concurrent smoking history",
      "Administer annual influenza vaccine and pneumococcal vaccine to prevent respiratory infections that can cause acute deterioration in compromised lungs"
    ],
    nursingActions: [
      "Monitor respiratory status systematically: respiratory rate, depth, pattern, SpO2 at rest and with activity, use of accessory muscles, breath sounds bilaterally every 4 hours",
      "Auscultate lung bases carefully: bilateral basilar fine inspiratory crackles (velcro rales) are the earliest and most characteristic physical finding of asbestosis",
      "Monitor for signs of right-sided heart failure (cor pulmonale): jugular vein distension, peripheral edema, hepatomegaly, weight gain -- report promptly",
      "Encourage and reinforce smoking cessation at every encounter; document smoking status and cessation interventions provided",
      "Teach proper oxygen safety: no smoking near oxygen, keep away from open flames, secure tanks properly, use only water-based lubricants on nasal cannula",
      "Monitor nutritional status and weight: increased work of breathing raises caloric expenditure; consult dietitian for high-calorie, nutrient-dense meal planning",
      "Document and report any new symptoms: chest pain (may indicate mesothelioma), unintentional weight loss, persistent pleuritic pain, or new pleural effusion"
    ],
    assessmentFindings: [
      "Progressive dyspnea on exertion, initially subtle, becoming the dominant symptom over years; eventually dyspnea at rest in advanced disease",
      "Bilateral basilar fine inspiratory crackles (velcro rales) -- the earliest and most characteristic physical finding, heard best at the lung bases posteriorly",
      "Dry, nonproductive cough that persists and may worsen with disease progression",
      "Digital clubbing in 30-40% of patients, indicating chronic hypoxemia and fibrotic lung disease",
      "Decreased chest expansion and decreased diaphragmatic excursion due to lower lobe fibrosis and pleural restriction",
      "Pleuritic chest pain from pleural plaque formation or pleural thickening",
      "Fatigue, exercise intolerance, and weight loss due to increased energy expenditure from labored breathing"
    ],
    signs: {
      left: [
        "Mild dyspnea on exertion with normal resting respiratory rate",
        "Bilateral basilar fine inspiratory crackles (velcro rales)",
        "Dry nonproductive cough",
        "Mild exercise intolerance with gradual onset",
        "SpO2 93-96% at rest with mild desaturation on exertion",
        "Chest tightness with deep inspiration"
      ],
      right: [
        "Severe dyspnea at rest with accessory muscle use and tachypnea",
        "Central cyanosis indicating severe hypoxemia",
        "Signs of cor pulmonale: JVD, dependent edema, hepatomegaly",
        "SpO2 below 88% despite supplemental oxygen therapy",
        "Significant unintentional weight loss (may indicate malignancy)",
        "New pleural effusion or persistent pleuritic chest pain (suspect mesothelioma)"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the inflammatory response by inhibiting phospholipase A2, reducing production of inflammatory mediators (prostaglandins, leukotrienes), decreasing macrophage activation and fibroblast proliferation in the pulmonary interstitium; may slow the rate of fibrotic progression in patients with active inflammation",
        sideEffects: "Hyperglycemia, immunosuppression (increased infection risk), osteoporosis, adrenal suppression, weight gain, mood changes, peptic ulcer disease, cataracts, thin fragile skin",
        contra: "Active systemic fungal infections; live vaccine administration; uncontrolled diabetes (relative); active peptic ulcer disease (relative); severe osteoporosis (relative)",
        pearl: "Evidence for corticosteroid efficacy in asbestosis is limited; use is typically reserved for patients with documented inflammatory activity on BAL or biopsy; administer in the morning with food; never discontinue abruptly after prolonged use -- taper gradually to prevent adrenal crisis"
      },
      {
        name: "Ipratropium Bromide (Atrovent)",
        type: "Anticholinergic bronchodilator (muscarinic antagonist)",
        action: "Blocks muscarinic (M3) acetylcholine receptors in bronchial smooth muscle, preventing acetylcholine-mediated bronchoconstriction and reducing mucus hypersecretion; provides sustained bronchodilation particularly effective in the larger airways",
        sideEffects: "Dry mouth (most common), urinary retention, constipation, blurred vision (if sprayed in eyes), cough, headache, dizziness",
        contra: "Known hypersensitivity to ipratropium or atropine derivatives; use with caution in narrow-angle glaucoma (may increase intraocular pressure) and benign prostatic hyperplasia (may worsen urinary retention)",
        pearl: "Onset of action is 15-30 minutes with peak effect at 1-2 hours and duration of 4-6 hours; can be combined with albuterol (Combivent) for synergistic bronchodilation; teach patients to avoid spraying in eyes as it can precipitate acute angle-closure glaucoma; rinse mouth after use to reduce dry mouth"
      },
      {
        name: "Supplemental Oxygen Therapy",
        type: "Medical gas / respiratory support",
        action: "Increases the fraction of inspired oxygen (FiO2) to compensate for impaired gas diffusion across the fibrosed alveolar-capillary membrane; corrects hypoxemia by increasing the oxygen concentration gradient driving diffusion from alveoli to pulmonary capillary blood",
        sideEffects: "Oxygen toxicity with prolonged high-concentration use (greater than 60% FiO2 for over 24 hours causes alveolar damage), absorption atelectasis, dry mucous membranes, skin breakdown from nasal cannula or mask",
        contra: "No absolute contraindications for life-sustaining oxygen; use caution with high-flow oxygen in COPD patients who rely on hypoxic drive (may suppress respiratory drive)",
        pearl: "Titrate oxygen to maintain SpO2 above 92% (or as prescribed); nasal cannula at 1-6 L/min provides approximately 24-44% FiO2; humidify oxygen delivered at flows greater than 4 L/min to prevent mucosal drying; assess for skin breakdown behind ears and under nostrils from prolonged cannula use"
      }
    ],
    pearls: [
      "Bilateral basilar fine inspiratory crackles (velcro rales) are the EARLIEST and most characteristic physical finding of asbestosis -- always auscultate the posterior lung bases carefully in patients with asbestos exposure history.",
      "Asbestosis affects the LOWER lobes first and progresses upward, which distinguishes it from silicosis (upper lobe predominance) and helps differentiate these two occupational lung diseases.",
      "The combination of asbestos exposure and cigarette smoking produces a MULTIPLICATIVE (not just additive) lung cancer risk: asbestos alone = 5x risk, smoking alone = 10x risk, both together = 50x risk.",
      "Pleural plaques are the most common manifestation of asbestos exposure and serve as a radiographic marker of prior exposure, but they are usually asymptomatic and do not themselves cause significant lung function impairment.",
      "Malignant mesothelioma is almost exclusively caused by asbestos exposure with a latency period of 20-40 years -- report any new pleuritic pain, unexplained pleural effusion, or weight loss in asbestosis patients immediately.",
      "The latency period between asbestos exposure and disease onset is typically 15-20 years or longer -- patients presenting with asbestosis today were often exposed decades ago before modern workplace safety regulations.",
      "Diffusing capacity (DLCO) on pulmonary function testing is often the earliest abnormality in asbestosis because fibrosis thickens the alveolar-capillary membrane, impairing gas diffusion before significant volume restriction develops."
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a retired shipyard worker diagnosed with asbestosis. During auscultation, which finding is most characteristic of this condition?",
        options: [
          "Bilateral apical wheezing on expiration",
          "Bilateral basilar fine inspiratory crackles (velcro rales)",
          "Unilateral absent breath sounds with hyperresonance",
          "Bilateral coarse crackles clearing with coughing"
        ],
        correct: 1,
        rationale: "Bilateral basilar fine inspiratory crackles (often described as velcro rales because they sound like velcro being separated) are the earliest and most characteristic physical finding of asbestosis. These crackles are heard best at the posterior lung bases and result from the opening of fibrotic, collapsed alveoli during inspiration. Asbestosis characteristically affects the lower lobes first."
      },
      {
        question: "A patient with a 30-year history of asbestos exposure asks the practical nurse why smoking cessation is so important. Which response best explains the combined risk?",
        options: [
          "Smoking adds a small additional risk of about 5% to the existing asbestos-related cancer risk",
          "Smoking and asbestos exposure together create a multiplicative lung cancer risk approximately 50 times greater than normal",
          "Smoking only affects the upper lobes while asbestos affects the lower lobes, so the risks are independent",
          "Smoking and asbestos together only increase the risk of mesothelioma, not lung cancer"
        ],
        correct: 1,
        rationale: "The combined effect of asbestos exposure and cigarette smoking on lung cancer risk is multiplicative, not additive. Asbestos exposure alone increases lung cancer risk approximately 5-fold, smoking alone increases it 10-fold, but the combination produces approximately a 50-fold increase. This makes smoking cessation one of the most impactful interventions for asbestos-exposed individuals."
      },
      {
        question: "A patient with asbestosis develops new-onset pleuritic chest pain, a unilateral pleural effusion, and unintentional weight loss. Which condition should the practical nurse suspect and report immediately?",
        options: [
          "Community-acquired pneumonia",
          "Acute exacerbation of asbestosis",
          "Malignant mesothelioma",
          "Pulmonary embolism"
        ],
        correct: 2,
        rationale: "The triad of new pleuritic chest pain, unilateral pleural effusion, and weight loss in a patient with asbestos exposure history is highly suspicious for malignant mesothelioma, a cancer of the pleural mesothelium that is almost exclusively caused by asbestos. The latency period is 20-40 years. This requires immediate reporting for urgent diagnostic workup."
      }
    ]
  },

  "black-lung-disease-rpn": {
    title: "Black Lung Disease (Coal Workers' Pneumoconiosis) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Coal Workers' Pneumoconiosis",
      content: "Coal workers' pneumoconiosis (CWP), commonly known as black lung disease, is an occupational lung disease caused by prolonged inhalation of coal mine dust. Coal dust is a complex mixture of carbon particles, silica, kaolin, ite, and other minerals. When inhaled, particles smaller than 5 micrometers penetrate to the terminal bronchioles and alveoli, where they are phagocytosed by alveolar macrophages. The carbon-laden macrophages, called dust macrophages, accumulate around respiratory bronchioles and form coal macules -- small (1-5 mm) aggregates of dust-laden macrophages surrounded by a small amount of reticulin and collagen fibers. These coal macules are the fundamental pathological lesion of simple CWP. The associated dilatation of respiratory bronchioles surrounding coal macules is termed focal emphysema. Simple CWP is characterized by numerous small coal macules (less than 10 mm) distributed predominantly in the upper lobes of the lungs. Simple CWP typically causes minimal functional impairment and may be asymptomatic, detected only on routine screening chest X-rays. However, in approximately 1-5% of cases, simple CWP progresses to complicated CWP, also known as progressive massive fibrosis (PMF). PMF is defined by the development of large fibrotic masses (greater than 10 mm in diameter, often several centimeters) in the upper lobes, composed of dense collagen, necrotic tissue, and black pigment. These massive lesions destroy and replace functional lung parenchyma, cause significant restrictive and obstructive lung disease, and may cavitate (forming cavities that can become secondarily infected or fill with black fluid called melanoptysis). The progression from simple CWP to PMF is influenced by the total cumulative dust dose, the silica content of the coal dust (higher silica content increases fibrogenic risk), and the presence of concurrent infections such as tuberculosis. CWP also increases the risk of Caplan syndrome (rheumatoid pneumoconiosis), in which large necrobiotic nodules develop in the lungs of patients with concurrent rheumatoid arthritis. There is no specific treatment that reverses the fibrotic damage of CWP; management is entirely supportive, focused on preventing further exposure, managing symptoms, preserving remaining lung function, and monitoring for complications."
    },
    riskFactors: [
      "Underground coal mining with prolonged exposure to respirable coal mine dust (greatest risk with 20+ years of mining)",
      "High cumulative dust exposure: risk increases proportionally with total lifetime dust dose; surface miners have lower risk than underground miners",
      "High silica content in coal seam: coal dust mixed with significant silica is more fibrogenic and accelerates disease progression",
      "Concurrent cigarette smoking: compounds airway damage, accelerates functional decline, and increases risk of chronic bronchitis",
      "Working in poorly ventilated mining areas or during drilling and blasting operations (highest dust concentrations)",
      "Pre-existing respiratory conditions such as asthma or chronic bronchitis (reduced baseline pulmonary reserve)",
      "Failure to use or improper use of respiratory protective equipment (dust masks, respirators) during mining operations"
    ],
    diagnostics: [
      "Chest X-ray: simple CWP shows small rounded opacities (less than 10 mm) predominantly in the upper lung zones; PMF shows large opacities greater than 10 mm, typically bilateral upper lobes; ILO classification system grades severity",
      "High-resolution CT scan (HRCT): more sensitive than chest X-ray; demonstrates coal macules, centrilobular emphysema, and large fibrotic masses in PMF; useful for early detection",
      "Pulmonary function tests (PFTs): simple CWP may show normal or mildly reduced values; PMF shows mixed obstructive-restrictive pattern with reduced FEV1, FVC, and DLCO",
      "Arterial blood gas (ABG): may be normal in simple CWP; PMF shows progressive hypoxemia and eventual hypercapnia in advanced disease",
      "Sputum analysis: black-pigmented sputum (melanoptysis) is characteristic of complicated CWP; culture for tuberculosis and other infections if productive cough develops",
      "Rheumatoid factor and anti-CCP antibodies: ordered if Caplan syndrome (rheumatoid pneumoconiosis) is suspected -- large necrobiotic lung nodules in a patient with coal dust exposure and rheumatoid arthritis"
    ],
    management: [
      "Permanent removal from coal dust exposure: this is the most important intervention; even continued low-level exposure accelerates progression from simple CWP to PMF",
      "Smoking cessation with comprehensive support: pharmacological therapy (nicotine replacement, varenicline, bupropion) combined with behavioral counseling",
      "Administer bronchodilators (albuterol, ipratropium) as prescribed for symptomatic relief of dyspnea and airflow obstruction",
      "Administer systemic corticosteroids (prednisone) as prescribed during acute exacerbations or in patients with significant inflammatory component",
      "Supplemental oxygen therapy: titrate to maintain SpO2 above 92% at rest and during activity; continuous oxygen may be required in advanced PMF",
      "Pulmonary rehabilitation: structured program including supervised exercise training, breathing retraining, nutritional counseling, and psychosocial support",
      "Annual influenza and pneumococcal vaccination to prevent respiratory infections that cause acute decompensation in compromised lungs"
    ],
    nursingActions: [
      "Monitor respiratory status every 4 hours: rate, depth, pattern, SpO2, work of breathing, and use of accessory muscles; report increasing dyspnea or SpO2 below 92%",
      "Auscultate lung sounds bilaterally with attention to upper lobes: diminished breath sounds suggest fibrosis or consolidation; wheezing suggests bronchospasm; crackles suggest fluid or fibrosis",
      "Monitor sputum production: document color, amount, consistency; black-tinged sputum (melanoptysis) is characteristic; purulent sputum suggests superimposed infection",
      "Administer bronchodilators as prescribed and assess patient response: improvement in dyspnea, SpO2, and breath sounds; monitor for side effects (tachycardia, tremor)",
      "Teach and reinforce pursed-lip breathing and diaphragmatic breathing techniques to improve ventilation efficiency and reduce air trapping",
      "Monitor weight and nutritional intake: patients with advanced CWP have increased caloric needs due to labored breathing; small frequent meals reduce diaphragmatic pressure",
      "Provide emotional support and referral to support groups: coal workers with black lung disease often experience grief, loss of livelihood, and financial stress related to occupational disability"
    ],
    assessmentFindings: [
      "Progressive dyspnea on exertion: may be minimal in simple CWP but becomes significant and eventually present at rest in PMF",
      "Chronic productive cough with black-tinged sputum (melanoptysis) characteristic of coal dust deposition in the airways",
      "Diminished breath sounds over upper lung zones where fibrosis and large opacities are most concentrated",
      "Barrel chest configuration in patients with concurrent emphysema (increased anteroposterior diameter from chronic air trapping)",
      "Digital clubbing in advanced disease indicating chronic hypoxemia",
      "Decreased exercise tolerance with progressive functional limitation affecting activities of daily living",
      "Signs of right-sided heart failure in advanced PMF: jugular vein distension, peripheral edema, hepatomegaly (cor pulmonale)"
    ],
    signs: {
      left: [
        "Mild dyspnea on exertion with normal resting respiratory status",
        "Chronic cough with occasional black-tinged sputum",
        "Mildly diminished breath sounds in upper lung fields",
        "Mild exercise intolerance noticed during heavy exertion",
        "SpO2 93-96% at rest with mild desaturation on activity",
        "Fatigue with decreased stamina during daily activities"
      ],
      right: [
        "Severe dyspnea at rest with accessory muscle use and tachypnea greater than 28 breaths per minute",
        "Massive hemoptysis or copious melanoptysis (large volume of black sputum)",
        "SpO2 below 88% despite supplemental oxygen administration",
        "Signs of cor pulmonale: JVD, severe peripheral edema, hepatomegaly",
        "Acute respiratory failure requiring emergent intervention",
        "Fever with purulent sputum indicating acute superimposed infection requiring immediate treatment"
      ]
    },
    medications: [
      {
        name: "Albuterol (Ventolin/Proventil)",
        type: "Short-acting beta-2 adrenergic agonist (SABA) bronchodilator",
        action: "Selectively stimulates beta-2 adrenergic receptors on bronchial smooth muscle cells, activating adenylyl cyclase and increasing cyclic AMP, which causes rapid relaxation of bronchial smooth muscle, relieving bronchospasm and improving airflow; also enhances mucociliary clearance and inhibits mast cell mediator release",
        sideEffects: "Tachycardia, palpitations, skeletal muscle tremor (especially hands), nervousness, headache, hypokalemia with frequent use, paradoxical bronchospasm (rare)",
        contra: "Hypersensitivity to albuterol; use with caution in patients with cardiac dysrhythmias, coronary artery disease, hyperthyroidism, or diabetes mellitus (may cause hyperglycemia)",
        pearl: "Onset of action 5-15 minutes, peak 30-60 minutes, duration 4-6 hours; teach proper MDI technique -- shake canister, exhale completely, actuate at beginning of slow deep inhalation, hold breath for 10 seconds, wait 1 minute between puffs; use a spacer device to improve drug delivery to lower airways"
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses inflammatory and immune responses by inhibiting phospholipase A2 (reducing prostaglandin and leukotriene synthesis), decreasing inflammatory cytokine production, stabilizing lysosomal membranes, and reducing capillary permeability; in CWP, may reduce airway inflammation and bronchospasm during acute exacerbations",
        sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, adrenal suppression with prolonged use, weight gain, fluid retention, mood changes, insomnia, peptic ulceration, cataracts, poor wound healing",
        contra: "Active systemic fungal infections; live vaccine administration; uncontrolled diabetes (relative); active GI bleeding or peptic ulcer (relative)",
        pearl: "Used primarily during acute exacerbations of CWP with significant bronchospasm or inflammation; short courses (5-14 days) preferred to minimize long-term side effects; administer with food in the morning; taper doses gradually after courses longer than 7-10 days to prevent adrenal crisis"
      },
      {
        name: "Guaifenesin (Mucinex/Robitussin)",
        type: "Expectorant (mucokinetic agent)",
        action: "Increases the volume and reduces the viscosity of respiratory tract secretions by stimulating the secretion of respiratory tract fluids from submucosal glands and goblet cells; the increased hydration of mucus makes it easier to mobilize and expectorate, improving airway clearance",
        sideEffects: "Nausea, vomiting, dizziness, headache, GI upset, drowsiness (usually mild and dose-related); kidney stones with extremely high doses (very rare)",
        contra: "Known hypersensitivity to guaifenesin; use with caution in patients with persistent cough lasting more than 7 days (evaluate for underlying cause); not recommended as sole treatment for productive cough in serious lung disease",
        pearl: "Most effective when taken with a full glass of water (240 mL) and with increased overall fluid intake (at least 8 glasses per day) to maximize hydration of secretions; extended-release formulations should be swallowed whole and not crushed, chewed, or broken; assess cough effectiveness before administering to ensure patient can clear mobilized secretions"
      }
    ],
    pearls: [
      "Simple CWP is distinguished from complicated CWP (progressive massive fibrosis) by lesion size: simple CWP has opacities less than 10 mm, while PMF has opacities greater than 10 mm -- PMF carries significantly worse prognosis.",
      "Black-tinged sputum (melanoptysis) is characteristic of coal workers' pneumoconiosis and results from coal dust pigment deposited in the airways being cleared by mucociliary mechanisms.",
      "CWP primarily affects the UPPER lobes, similar to silicosis -- this upper lobe predominance helps distinguish these pneumoconioses from asbestosis (which affects lower lobes first).",
      "Caplan syndrome (rheumatoid pneumoconiosis) occurs when CWP coexists with rheumatoid arthritis, producing large necrobiotic lung nodules that can cavitate -- check rheumatoid factor if large lung nodules develop.",
      "The single most important intervention for CWP is permanent removal from coal dust exposure -- even minimal continued exposure can trigger progression from simple CWP to the much more severe progressive massive fibrosis.",
      "Guaifenesin is most effective when patients maintain adequate hydration (at least 8 glasses of fluid daily) -- the drug works by increasing respiratory secretion volume, which requires adequate systemic hydration.",
      "Patients with CWP have significantly increased risk of tuberculosis and atypical mycobacterial infections due to impaired macrophage function from coal dust burden -- screen for TB with any new or changing respiratory symptoms."
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a retired coal miner who presents with chronic cough producing black-tinged sputum. Which term describes this finding?",
        options: [
          "Hemoptysis",
          "Melanoptysis",
          "Purulent sputum",
          "Hematemesis"
        ],
        correct: 1,
        rationale: "Melanoptysis refers to the expectoration of black-tinged or black sputum, which is characteristic of coal workers' pneumoconiosis (black lung disease). The black color results from coal dust pigment (carbon particles) that has been deposited in the airways and is being cleared through mucociliary mechanisms. Hemoptysis refers to blood-tinged sputum, not coal-colored sputum."
      },
      {
        question: "A practical nurse is reviewing the chest X-ray of a coal miner with CWP. Which finding indicates progression from simple CWP to complicated CWP (progressive massive fibrosis)?",
        options: [
          "Small rounded opacities less than 5 mm scattered throughout both lungs",
          "Large opacities greater than 10 mm in the upper lung zones bilaterally",
          "Bilateral pleural effusions with costophrenic angle blunting",
          "Unilateral hilar lymphadenopathy with eggshell calcification"
        ],
        correct: 1,
        rationale: "Progressive massive fibrosis (PMF, or complicated CWP) is defined by the development of large fibrotic masses greater than 10 mm in diameter, typically located in the upper lung zones bilaterally. These large opacities represent the coalescence of coal macules into dense fibrotic masses that destroy functional lung tissue. Small opacities less than 10 mm characterize simple CWP."
      },
      {
        question: "A patient with CWP is prescribed guaifenesin for mucus clearance. Which instruction should the practical nurse include in patient teaching?",
        options: [
          "Take the medication on an empty stomach and restrict fluid intake",
          "Take the medication with a full glass of water and maintain high fluid intake throughout the day",
          "Crush the extended-release tablets for faster absorption",
          "Take the medication only at bedtime for maximum overnight effectiveness"
        ],
        correct: 1,
        rationale: "Guaifenesin works by increasing the volume and reducing the viscosity of respiratory secretions, making them easier to expectorate. This mechanism requires adequate systemic hydration to be effective. Patients should take guaifenesin with a full glass of water (240 mL) and maintain high fluid intake (at least 8 glasses daily). Extended-release tablets should never be crushed."
      }
    ]
  },

  "assessment-rpn": {
    title: "Comprehensive Nursing Assessment for Practical Nurses",
    cellular: {
      title: "Foundations of Comprehensive Nursing Assessment",
      content: "The comprehensive nursing assessment is the systematic and continuous process of collecting, organizing, validating, and documenting data about a patient's health status. It is the first and most critical step of the nursing process and forms the foundation for all subsequent nursing diagnoses, care planning, interventions, and evaluations. Assessment data is classified into two categories: subjective data (symptoms) -- information reported by the patient about their own experience, including pain, nausea, dizziness, anxiety, and fatigue, which cannot be independently verified by the examiner; and objective data (signs) -- observable, measurable findings obtained through physical examination, vital signs, laboratory values, and diagnostic tests, which can be verified by another clinician. The systematic approach to comprehensive assessment follows a head-to-toe format organized by body systems. This begins with general survey (overall appearance, level of consciousness, posture, gait, hygiene, affect) and vital signs (temperature, pulse, respirations, blood pressure, oxygen saturation, and pain as the fifth vital sign), then proceeds systematically through neurological (level of consciousness, orientation, pupil response, cranial nerves, motor and sensory function), cardiovascular (heart sounds, peripheral pulses, capillary refill, edema, jugular vein distension), respiratory (breath sounds, respiratory rate and pattern, chest expansion, cough, sputum), gastrointestinal (bowel sounds, abdominal contour, tenderness, last bowel movement, nutritional intake), genitourinary (urine output, color, characteristics, bladder distension), musculoskeletal (range of motion, strength, mobility, fall risk), and integumentary (skin color, turgor, temperature, moisture, integrity, wounds, pressure injury risk) systems. Gordon's Functional Health Patterns provide an alternative assessment framework organized around 11 patterns: health perception/management, nutritional/metabolic, elimination, activity/exercise, sleep/rest, cognitive/perceptual, self-perception/self-concept, role/relationship, sexuality/reproductive, coping/stress tolerance, and value/belief. The practical nurse must understand the difference between a comprehensive assessment (performed on admission and at designated intervals), a focused assessment (targeted examination of a specific body system or complaint), and ongoing assessment (continuous monitoring throughout the shift). Documentation of assessment findings must be accurate, timely, objective, and complete using standardized terminology. The SBAR (Situation, Background, Assessment, Recommendation) communication framework ensures that assessment findings are communicated effectively and efficiently to other members of the healthcare team, reducing the risk of errors related to miscommunication."
    },
    riskFactors: [
      "Inadequate or incomplete assessment: missed findings can delay diagnosis and treatment, leading to patient harm and adverse outcomes",
      "Communication barriers: language differences, hearing impairment, cognitive impairment, and cultural differences can impede accurate data collection",
      "Unconscious or sedated patients: inability to provide subjective data requires reliance on objective findings, family reports, and medical history",
      "Complex comorbidities: multiple interacting conditions make assessment more challenging and increase the risk of attributing new symptoms to existing conditions",
      "Time pressure and high patient ratios: competing demands may lead to abbreviated assessments and missed clinical deterioration",
      "Incomplete documentation: assessment findings not documented are legally considered not performed and cannot inform subsequent care decisions",
      "Bias and assumptions: personal biases regarding age, gender, ethnicity, or socioeconomic status may influence assessment thoroughness and interpretation"
    ],
    diagnostics: [
      "Vital signs measurement: temperature (oral, tympanic, temporal, axillary, rectal), pulse (rate, rhythm, quality), respirations (rate, depth, pattern), blood pressure (systolic, diastolic, pulse pressure), SpO2, pain scale",
      "Glasgow Coma Scale (GCS): standardized assessment of consciousness measuring eye opening (1-4), verbal response (1-5), and motor response (1-6); total score 3-15; score below 8 indicates coma and need for airway protection",
      "Braden Scale: standardized tool for predicting pressure injury risk; assesses sensory perception, moisture, activity, mobility, nutrition, and friction/shear; scores range from 6-23; lower score indicates higher risk",
      "Morse Fall Scale: standardized fall risk assessment; evaluates history of falling, secondary diagnosis, ambulatory aid, IV therapy, gait, and mental status; score 45 or higher indicates high fall risk",
      "Pain assessment scales: numeric rating scale (0-10), Wong-Baker FACES scale (pediatric and nonverbal patients), FLACC scale (infants and nonverbal), PAINAD (dementia patients); use PQRST for comprehensive pain assessment",
      "Nutritional screening tools: Malnutrition Screening Tool (MST), Mini Nutritional Assessment (MNA); assess dietary intake, weight changes, BMI, serum albumin and prealbumin levels"
    ],
    management: [
      "Perform comprehensive head-to-toe assessment on admission and at the beginning of each shift; perform focused assessments as indicated by patient condition changes",
      "Establish baseline vital signs and assessment findings immediately upon assuming care; compare all subsequent findings to this baseline to detect trends and changes",
      "Prioritize assessment based on patient acuity: unstable patients require more frequent monitoring; follow facility protocols for assessment frequency",
      "Validate subjective data by correlating with objective findings: if patient reports no pain but is guarding, diaphoretic, and tachycardic, investigate further",
      "Implement appropriate screening tools at designated intervals: Braden Scale for pressure injury risk, Morse Fall Scale for fall risk, pain scales at every assessment",
      "Use SBAR format to communicate all significant assessment findings to the registered nurse or physician: Situation (what is happening), Background (relevant history), Assessment (your clinical findings), Recommendation (what you think should happen)",
      "Document all assessment findings accurately and promptly in the electronic health record using objective, measurable terminology; avoid subjective interpretations"
    ],
    nursingActions: [
      "Introduce yourself, verify patient identity using two identifiers, explain the assessment procedure, and ensure privacy before beginning any assessment",
      "Perform hand hygiene before and after every patient contact; use appropriate personal protective equipment based on isolation precautions",
      "Conduct the general survey first: observe level of consciousness, orientation (person, place, time, event), appearance, posture, gait, speech, affect, and overall hygiene",
      "Measure and record vital signs using calibrated equipment and proper technique: wait 5 minutes after activity for accurate resting values; use appropriate cuff size for blood pressure",
      "Auscultate heart sounds (S1, S2; note any murmurs, gallops, or extra sounds), lung sounds bilaterally (anterior and posterior; note adventitious sounds), and bowel sounds in all four quadrants",
      "Assess peripheral circulation: palpate pulses bilaterally (radial, pedal), assess capillary refill (normal less than 3 seconds), check for edema (grade 1+ to 4+), note skin temperature and color",
      "Compare bilateral findings: asymmetry in pulses, strength, sensation, or extremity size may indicate vascular compromise, neurological deficit, or deep vein thrombosis"
    ],
    assessmentFindings: [
      "Normal vital sign ranges for adults: temperature 36.1-37.8 C (97-100 F), pulse 60-100 bpm, respirations 12-20/min, systolic BP 90-120 mmHg, diastolic BP 60-80 mmHg, SpO2 95-100%",
      "Level of consciousness progression from most alert to least responsive: alert, verbal (responds to voice), pain (responds to painful stimuli), unresponsive (AVPU scale)",
      "Normal breath sounds: vesicular (soft, low-pitched over peripheral lung fields), bronchovesicular (moderate pitch over major bronchi), bronchial (loud, high-pitched over trachea)",
      "Abnormal breath sounds: crackles (fine or coarse -- fluid or fibrosis), wheezes (high-pitched -- bronchospasm), rhonchi (low-pitched -- mucus in large airways), stridor (high-pitched inspiratory -- upper airway obstruction, EMERGENCY)",
      "Edema grading: 1+ (2 mm depression, rebounds immediately), 2+ (4 mm, rebounds in 10-15 seconds), 3+ (6 mm, rebounds in 30+ seconds), 4+ (8 mm, rebounds in 2+ minutes with visible distortion)",
      "Capillary refill: normal less than 3 seconds; prolonged refill (greater than 3 seconds) suggests decreased peripheral perfusion, dehydration, or shock",
      "Pupil assessment (PERRLA): pupils equal, round, reactive to light and accommodation; normal pupil size 2-5 mm; unequal pupils (anisocoria) may indicate neurological emergency"
    ],
    signs: {
      left: [
        "Vital signs within normal limits with stable trends",
        "Alert and oriented to person, place, time, and event",
        "Clear bilateral breath sounds without adventitious sounds",
        "Regular heart rate and rhythm without murmurs or extra sounds",
        "Skin warm, dry, intact with normal turgor and color",
        "Patient reports pain adequately managed (rated 3/10 or less)"
      ],
      right: [
        "Sudden change in level of consciousness or new neurological deficit",
        "Vital sign instability: hypotension, severe tachycardia, respiratory distress",
        "Absent or diminished pulses in an extremity (possible vascular emergency)",
        "Stridor (high-pitched inspiratory sound indicating upper airway obstruction)",
        "Unilateral pupil dilation (possible increased intracranial pressure)",
        "Acute onset unilateral weakness, facial droop, or slurred speech (possible stroke)"
      ]
    },
    medications: [
      {
        name: "Assessment Documentation Form",
        type: "Documentation Tool",
        action: "Standardized template for recording systematic head-to-toe assessment findings including vital signs, neurological status, cardiovascular, respiratory, gastrointestinal, genitourinary, musculoskeletal, and integumentary system findings; ensures completeness and consistency across all nursing assessments",
        sideEffects: "Incomplete documentation if sections are skipped; time-consuming if overly detailed for routine assessments; potential for checkbox fatigue leading to inaccurate recording",
        contra: "Should not replace clinical judgment -- documentation tools guide but do not substitute for critical thinking; avoid using only checkboxes without narrative description of significant or abnormal findings",
        pearl: "Complete all sections of the assessment form even when findings are normal (document normal findings to establish baseline); use objective, measurable language; timestamp all entries; document assessment findings before leaving the patient room to ensure accuracy"
      },
      {
        name: "SBAR Communication Tool",
        type: "Documentation Tool",
        action: "Structured communication framework (Situation, Background, Assessment, Recommendation) designed to organize and standardize the transfer of critical patient information between healthcare providers; reduces communication errors and ensures all relevant assessment data is conveyed during handoff, escalation, or consultation",
        sideEffects: "May feel rigid or scripted to new users; requires practice to use efficiently; critical information may be omitted if the user does not thoroughly prepare before initiating SBAR communication",
        contra: "Should not delay emergency intervention -- in life-threatening situations, call for help immediately and provide SBAR details as the team assembles; not a substitute for a complete nursing assessment",
        pearl: "Prepare SBAR before calling the physician or charge nurse: write down key vital signs, relevant lab values, and your specific concern; the Recommendation component empowers the practical nurse to suggest a course of action based on assessment findings"
      },
      {
        name: "Nursing Process Framework",
        type: "Documentation Tool",
        action: "Systematic five-step clinical decision-making framework (Assessment, Diagnosis, Planning, Implementation, Evaluation -- ADPIE) that guides the practical nurse through patient care delivery; assessment provides the data foundation for all subsequent steps; ensures evidence-based, individualized, and goal-directed nursing care",
        sideEffects: "Can become routine and mechanical if not applied with critical thinking; documentation burden may feel excessive; risk of focusing on completing steps rather than on patient-centered care",
        contra: "Should not be applied rigidly in emergency situations where simultaneous assessment and intervention are required; the nursing process is cyclical and continuous, not strictly linear",
        pearl: "Assessment is both the FIRST step and a CONTINUOUS step of the nursing process -- reassessment occurs throughout all phases; the practical nurse contributes to the nursing process within scope of practice by collecting and reporting data, implementing assigned interventions, and evaluating patient responses"
      }
    ],
    pearls: [
      "The comprehensive assessment follows a systematic head-to-toe approach to ensure no body system is missed -- developing and consistently using a personal assessment sequence reduces the risk of omitting critical findings.",
      "Subjective data (symptoms reported by the patient) and objective data (measurable findings observed by the nurse) must both be collected and documented; when they contradict each other (patient denies pain but is guarding and tachycardic), further investigation is needed.",
      "SBAR (Situation, Background, Assessment, Recommendation) is the gold standard communication framework for reporting assessment findings -- prepare your SBAR before calling to ensure clear, concise, and complete communication.",
      "The Glasgow Coma Scale (GCS) is scored on three components: Eye opening (1-4), Verbal response (1-5), Motor response (1-6); a score of 8 or below indicates coma and the need for airway protection.",
      "Capillary refill greater than 3 seconds indicates decreased peripheral perfusion and may signal dehydration, shock, peripheral vascular disease, or hypothermia -- always assess in the context of the overall clinical picture.",
      "Always compare bilateral findings during assessment: asymmetry in pulses, muscle strength, sensation, or extremity circumference may indicate vascular occlusion, deep vein thrombosis, or neurological deficit requiring urgent evaluation.",
      "Documentation of assessment findings must be accurate, timely, objective, and complete -- if it was not documented, it was legally not done; use standardized terminology and avoid subjective interpretations."
    ],
    quiz: [
      {
        question: "A practical nurse is performing a comprehensive assessment on a newly admitted patient. The patient states, 'I feel dizzy and nauseous.' Which type of data does this represent?",
        options: [
          "Objective data",
          "Subjective data",
          "Diagnostic data",
          "Validated data"
        ],
        correct: 1,
        rationale: "The patient's report of dizziness and nausea is subjective data (symptoms) because it represents the patient's own perception and experience of their condition. Subjective data cannot be independently measured or verified by the examiner. Objective data (signs) would include measurable findings such as vital signs, physical examination findings, and laboratory values."
      },
      {
        question: "A practical nurse needs to communicate a significant change in patient condition to the physician. Which communication framework should be used?",
        options: [
          "RACE (Rescue, Alarm, Contain, Extinguish)",
          "SBAR (Situation, Background, Assessment, Recommendation)",
          "ADPIE (Assessment, Diagnosis, Planning, Implementation, Evaluation)",
          "ABCDE (Airway, Breathing, Circulation, Disability, Exposure)"
        ],
        correct: 1,
        rationale: "SBAR (Situation, Background, Assessment, Recommendation) is the standardized communication framework designed to organize the transfer of critical patient information between healthcare providers. It ensures clear, concise, and complete communication of the current situation, relevant history, clinical assessment findings, and the nurse's recommendation for action."
      },
      {
        question: "A practical nurse assesses a patient and finds capillary refill of 5 seconds in the right hand. Which interpretation is correct?",
        options: [
          "This is a normal finding and requires no further action",
          "This indicates adequate peripheral perfusion",
          "This indicates decreased peripheral perfusion and should be reported and further assessed",
          "This finding is only significant in pediatric patients"
        ],
        correct: 2,
        rationale: "Normal capillary refill is less than 3 seconds. A capillary refill time of 5 seconds indicates decreased peripheral perfusion, which may result from dehydration, shock, peripheral vascular disease, arterial occlusion, or hypothermia. The practical nurse should report this finding, assess the contralateral extremity for comparison, and evaluate peripheral pulses, skin temperature, and color."
      }
    ]
  },

  "aging-changes-rpn": {
    title: "Normal Aging Changes for Practical Nurses",
    cellular: {
      title: "Physiology of Normal Aging Across Body Systems",
      content: "Aging is a universal, progressive, and irreversible biological process characterized by the gradual decline of physiological function across all organ systems. At the cellular level, aging involves the accumulation of oxidative damage to DNA, proteins, and lipids from reactive oxygen species (free radicals); progressive telomere shortening with each cell division (the Hayflick limit, after which cells enter senescence); decreased mitochondrial efficiency (reducing cellular energy production); accumulation of lipofuscin (a wear-and-tear pigment) in postmitotic cells such as neurons and cardiac myocytes; and decreased capacity for cellular repair and regeneration. These cellular changes manifest as organ-specific functional decline that the practical nurse must understand to distinguish normal aging from pathological conditions. In the cardiovascular system, the myocardium thickens (left ventricular hypertrophy), the aorta and large arteries stiffen (arteriosclerosis, not atherosclerosis), systolic blood pressure tends to increase (isolated systolic hypertension), cardiac output decreases at rest by approximately 1% per year after age 30, and the conduction system degenerates (increased risk of dysrhythmias, especially atrial fibrillation). In the respiratory system, chest wall compliance decreases due to calcification of costal cartilage, the diaphragm weakens, residual volume increases, vital capacity decreases, and gas exchange efficiency declines (PaO2 decreases approximately 1 mmHg per decade after age 20). In the renal system, the number of functional nephrons decreases by 30-50% by age 80, glomerular filtration rate (GFR) declines approximately 1 mL/min per year after age 40, the kidney's ability to concentrate urine decreases, and drug clearance is impaired (critical for medication dosing in older adults). In the neurological system, brain mass decreases 5-10% between ages 20 and 90, neurotransmitter production declines, reaction time slows, short-term memory may decline while long-term memory is generally preserved, and sleep architecture changes (less deep sleep, more nighttime awakenings). Sensory changes include presbyopia (loss of lens accommodation for near vision, typically noticed around age 40), presbycusis (bilateral sensorineural hearing loss beginning with high-frequency sounds), decreased taste and smell acuity (may reduce appetite), and decreased proprioception (contributing to fall risk). In the musculoskeletal system, bone density decreases (osteopenia/osteoporosis), skeletal muscle mass declines approximately 3-8% per decade after age 30 (sarcopenia), joint cartilage thins and ligaments lose elasticity, and height decreases approximately 1-2 cm per decade after age 40 due to vertebral compression and disc dehydration. In the integumentary system, the dermis thins, subcutaneous fat redistributes, collagen and elastin decrease, wound healing slows, thermoregulatory capacity declines, and skin becomes more susceptible to injury and pressure damage. In the gastrointestinal system, salivary production decreases, esophageal motility slows, gastric acid production decreases (affecting drug absorption and B12 absorption), hepatic metabolism slows (affecting first-pass drug metabolism), and colonic motility decreases (increasing constipation risk). A critical concept in geriatric nursing is polypharmacy -- the concurrent use of five or more medications -- which is common in older adults and increases the risk of drug-drug interactions, adverse drug reactions, falls, confusion, and medication nonadherence. The practical nurse must understand these normal aging changes to provide safe, age-appropriate care and to recognize when changes exceed the expected aging trajectory and may indicate pathology."
    },
    riskFactors: [
      "Advanced chronological age: the primary risk factor for all age-related physiological changes; severity increases with each decade after age 60",
      "Sedentary lifestyle and physical inactivity: accelerates sarcopenia, bone loss, cardiovascular deconditioning, and functional decline",
      "Poor nutritional status: inadequate protein intake accelerates sarcopenia; calcium and vitamin D deficiency accelerates osteoporosis; malnutrition impairs wound healing and immune function",
      "Polypharmacy (5 or more concurrent medications): older adults are at highest risk for adverse drug reactions due to decreased hepatic metabolism and renal clearance",
      "Social isolation and depression: associated with cognitive decline, malnutrition, medication nonadherence, and decreased functional independence",
      "Chronic diseases (diabetes, hypertension, heart failure, COPD, arthritis): accelerate age-related organ decline and compound functional impairment",
      "Environmental hazards: poor lighting, loose rugs, cluttered pathways, lack of grab bars increase fall risk in the context of age-related balance, vision, and proprioception changes"
    ],
    diagnostics: [
      "Comprehensive geriatric assessment (CGA): multidimensional evaluation of physical function, cognition, mood, nutrition, social support, polypharmacy, and fall risk; guides individualized care planning",
      "Dual-energy X-ray absorptiometry (DEXA scan): measures bone mineral density; diagnoses osteopenia (T-score -1.0 to -2.5) and osteoporosis (T-score below -2.5); recommended for all women over 65 and men over 70",
      "Serum creatinine and estimated GFR (eGFR): monitors renal function decline; GFR below 60 mL/min indicates chronic kidney disease; critical for medication dose adjustments",
      "Vitamin D level (25-hydroxyvitamin D): deficiency is common in older adults (insufficient less than 30 ng/mL, deficient less than 20 ng/mL); contributes to osteoporosis, falls, and muscle weakness",
      "Mini-Mental State Examination (MMSE) or Montreal Cognitive Assessment (MoCA): standardized screening tools for cognitive impairment; establishes baseline and detects changes over time",
      "Complete metabolic panel and CBC: screens for anemia (common in older adults), electrolyte imbalances, renal and hepatic function, and nutritional deficiencies"
    ],
    management: [
      "Implement fall prevention measures: ensure adequate lighting, remove tripping hazards, install grab bars in bathrooms, use non-slip footwear, keep call bell within reach, perform fall risk screening on admission and regularly",
      "Conduct medication reconciliation at every care transition: review all medications (prescription, over-the-counter, supplements) for appropriateness, interactions, and duplications; use Beers Criteria to identify potentially inappropriate medications in older adults",
      "Promote physical activity within patient capabilities: weight-bearing exercise for bone health, resistance training for sarcopenia prevention, balance exercises for fall prevention, flexibility exercises for joint mobility",
      "Ensure adequate nutritional support: high-protein diet to combat sarcopenia (1.0-1.2 g protein/kg/day), calcium intake 1200 mg/day, vitamin D supplementation as prescribed, adequate hydration (dehydration risk is elevated due to decreased thirst sensation)",
      "Schedule regular sensory screenings: annual vision examination (cataracts, glaucoma, macular degeneration), hearing assessment (presbycusis), dental examination (oral health affects nutrition)",
      "Promote cognitive stimulation and social engagement: mental activities, social interaction, and purpose-driven routines help maintain cognitive function and reduce depression risk",
      "Ensure adequate sleep hygiene: maintain consistent sleep-wake schedule, limit daytime napping, reduce evening fluid intake, address pain management for improved sleep quality"
    ],
    nursingActions: [
      "Perform age-appropriate assessment recognizing that vital sign norms differ in older adults: resting heart rate may be lower (on beta-blockers), baseline blood pressure may be higher, respiratory rate may be slightly elevated, and temperature response to infection may be blunted (afebrile sepsis)",
      "Assess functional status using standardized tools: Activities of Daily Living (ADLs -- bathing, dressing, toileting, transferring, feeding, continence) and Instrumental Activities of Daily Living (IADLs -- cooking, cleaning, shopping, medications, finances, transportation)",
      "Monitor for atypical disease presentations in older adults: myocardial infarction may present without chest pain (silent MI); infection may present without fever (afebrile sepsis); depression may present as somatic complaints; UTI may present as confusion",
      "Implement pressure injury prevention: reposition every 2 hours, use pressure-redistributing surfaces, maintain adequate nutrition, keep skin clean and dry, assess skin integrity with each repositioning",
      "Allow extra time for patient interactions: older adults may process information more slowly, have hearing or vision deficits, and benefit from clear, simple instructions with written reinforcement",
      "Monitor intake and output carefully: older adults have decreased thirst sensation and are at risk for dehydration; encourage regular fluid intake; monitor for signs of overhydration in patients with heart or renal disease",
      "Educate patients and caregivers about normal aging changes versus signs of illness: help distinguish expected changes (mild forgetfulness, slower reaction time) from concerning changes (sudden confusion, new incontinence, falls) that require medical evaluation"
    ],
    assessmentFindings: [
      "Cardiovascular: widened pulse pressure, systolic hypertension, decreased resting heart rate response, diminished peripheral pulses, dependent edema, orthostatic hypotension (check lying, sitting, standing blood pressures)",
      "Respiratory: decreased chest expansion, increased anteroposterior diameter, decreased breath sounds at bases, decreased cough effectiveness, increased susceptibility to respiratory infections",
      "Neurological: decreased reaction time, mild short-term memory changes (benign senescent forgetfulness), decreased proprioception, reduced deep tendon reflexes, altered sleep patterns with frequent nighttime awakenings",
      "Musculoskeletal: decreased height, kyphosis (thoracic spine curvature), decreased range of motion, decreased grip strength, slow and cautious gait pattern, joint crepitus",
      "Sensory: presbyopia (difficulty reading fine print), presbycusis (difficulty hearing high-frequency sounds and speech in noisy environments), decreased taste and smell, decreased pain perception",
      "Integumentary: thin, dry, fragile skin (senile purpura, skin tears); decreased turgor (check over sternum or forehead, not hand, in older adults); slow wound healing; decreased sweating",
      "Renal/GU: decreased bladder capacity, increased urinary frequency and nocturia, decreased GFR (affects drug clearance), stress or urge incontinence"
    ],
    signs: {
      left: [
        "Gradual decline in exercise tolerance with preserved ability to perform ADLs",
        "Mild short-term memory lapses (forgetting names, misplacing objects) with intact long-term memory",
        "Decreased visual acuity for near objects requiring reading glasses (presbyopia)",
        "Mild joint stiffness and decreased flexibility, especially in the morning",
        "Decreased appetite with gradual weight change",
        "Increased need for nighttime urination (nocturia, 1-2 times per night)"
      ],
      right: [
        "Sudden change in mental status or new confusion (delirium, NOT normal aging)",
        "New onset urinary or fecal incontinence (requires evaluation, NOT normal aging)",
        "Unexplained falls or sudden gait instability (evaluate for stroke, medication effect, or cardiac cause)",
        "Sudden severe pain (older adults may underreport pain; acute pain warrants urgent evaluation)",
        "Rapid unintentional weight loss greater than 5% in 30 days (evaluate for malignancy, depression, or thyroid disease)",
        "New onset fever may be absent even with serious infection in older adults (evaluate with WBC, cultures if infection suspected)"
      ]
    },
    medications: [
      {
        name: "Calcium Carbonate (Tums/Caltrate)",
        type: "Mineral supplement / calcium replacement",
        action: "Provides elemental calcium essential for maintaining bone mineral density, neuromuscular function, cardiac conduction, and blood coagulation; in older adults, supplementation helps offset decreased intestinal calcium absorption and increased bone resorption that accelerate osteoporosis risk",
        sideEffects: "Constipation (most common in older adults), bloating, flatulence, hypercalcemia with excessive intake, kidney stones with prolonged high-dose use, drug interactions (decreases absorption of levothyroxine, tetracyclines, fluoroquinolones, iron)",
        contra: "Hypercalcemia; severe renal impairment; history of calcium-containing kidney stones; hyperparathyroidism",
        pearl: "Take calcium carbonate WITH meals because it requires stomach acid for absorption (calcium citrate can be taken without food and is better absorbed in patients on PPIs or with achlorhydria); do not exceed 500-600 mg elemental calcium per dose (higher single doses have diminished absorption); separate from levothyroxine, iron, and certain antibiotics by at least 2 hours"
      },
      {
        name: "Vitamin D3 (Cholecalciferol)",
        type: "Fat-soluble vitamin / bone metabolism regulator",
        action: "Converted in the liver to 25-hydroxyvitamin D and then in the kidneys to active 1,25-dihydroxyvitamin D (calcitriol), which increases intestinal calcium and phosphorus absorption, promotes bone mineralization, supports immune function, and enhances muscle strength and balance; deficiency is extremely common in older adults due to decreased skin synthesis, reduced sun exposure, and impaired renal activation",
        sideEffects: "Hypercalcemia (with excessive supplementation), nausea, vomiting, constipation, weakness, polyuria, nephrolithiasis (rare at recommended doses); toxicity risk increases with concurrent thiazide diuretics",
        contra: "Hypercalcemia; hypervitaminosis D; severe renal impairment (may require calcitriol instead of cholecalciferol); granulomatous diseases (sarcoidosis -- unregulated activation of vitamin D)",
        pearl: "Recommended dose for adults over 70 is 800-1000 IU daily (many patients require higher doses based on serum levels); take with a meal containing fat to enhance absorption (fat-soluble vitamin); monitor 25-hydroxyvitamin D levels and aim for 30-50 ng/mL; vitamin D plus calcium reduces fracture risk more effectively than either supplement alone"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the thermoregulatory center (antipyretic effect) and pain perception pathways (analgesic effect); does not have significant anti-inflammatory activity; preferred first-line analgesic in older adults because it does not cause GI bleeding, renal impairment, or platelet dysfunction associated with NSAIDs",
        sideEffects: "Hepatotoxicity (dose-dependent, most significant risk); rare: rash, hypersensitivity reaction, blood dyscrasias; chronic use at high doses may contribute to analgesic nephropathy",
        contra: "Severe hepatic impairment or active liver disease; alcohol use disorder (3 or more alcoholic drinks per day increases hepatotoxicity risk); known hypersensitivity",
        pearl: "PREFERRED first-line analgesic for older adults with osteoarthritis and chronic pain because it avoids the GI bleeding, renal toxicity, and cardiovascular risks of NSAIDs; maximum dose is 3000 mg/day in older adults (reduced from 4000 mg); check ALL medication labels for acetaminophen content as it is present in many combination products (cold remedies, sleep aids, opioid combinations); schedule regular dosing rather than PRN for chronic pain for consistent pain control"
      }
    ],
    pearls: [
      "Normal aging changes should NEVER include sudden confusion, new incontinence, unexplained falls, or rapid functional decline -- these always warrant urgent medical evaluation for acute illness, medication effects, or new pathology.",
      "Atypical disease presentation is the RULE, not the exception, in older adults: MI may present without chest pain, infection may present without fever, depression may present as physical complaints, and UTI may present as acute confusion.",
      "The Beers Criteria is an evidence-based list of potentially inappropriate medications for older adults -- the practical nurse should be aware of high-risk medications including benzodiazepines, anticholinergics, NSAIDs, and first-generation antihistamines.",
      "Skin turgor in older adults should be assessed over the sternum or forehead, NOT on the dorsum of the hand -- decreased skin elasticity on the hand is a normal aging change and is not a reliable indicator of hydration status.",
      "Presbycusis (age-related hearing loss) typically affects HIGH-frequency sounds first, making it difficult to hear consonant sounds (s, f, th) and to understand speech in noisy environments -- speak in lower tones, face the patient, reduce background noise.",
      "Polypharmacy (5 or more medications) is the leading modifiable risk factor for adverse drug reactions in older adults -- medication reconciliation at every care transition is essential for patient safety.",
      "Older adults have decreased thirst sensation and are at significant risk for dehydration -- do not rely on the patient reporting thirst; proactively encourage and offer fluids throughout the day."
    ],
    quiz: [
      {
        question: "A practical nurse is assessing an 80-year-old patient and notes decreased skin turgor when testing the dorsum of the hand. Which action is most appropriate?",
        options: [
          "Immediately start IV fluid replacement for dehydration",
          "Reassess skin turgor over the sternum or forehead for a more accurate finding in older adults",
          "Document the finding as evidence of severe dehydration",
          "Restrict oral fluid intake and monitor urine output"
        ],
        correct: 1,
        rationale: "Decreased skin turgor on the dorsum of the hand is a NORMAL aging change due to loss of subcutaneous tissue and decreased skin elasticity, and is NOT a reliable indicator of hydration in older adults. The practical nurse should reassess skin turgor over the sternum or forehead, which provides more accurate information about hydration status in elderly patients."
      },
      {
        question: "An 85-year-old patient in a long-term care facility suddenly becomes confused and agitated. The patient was alert and oriented yesterday. Which response by the practical nurse is most appropriate?",
        options: [
          "Document the confusion as a normal aging change and continue routine care",
          "Administer a sedative to reduce agitation",
          "Report the sudden change in mental status immediately as it may indicate acute illness",
          "Attribute the confusion to dementia and implement safety measures only"
        ],
        correct: 2,
        rationale: "Sudden confusion (delirium) is NEVER a normal aging change and always requires urgent evaluation. Common causes in older adults include urinary tract infection, medication effects, dehydration, hypoxia, pain, constipation, and electrolyte imbalances. The practical nurse should report this sudden change immediately so the cause can be identified and treated. Dementia develops gradually, not suddenly."
      },
      {
        question: "A practical nurse is reviewing medications for a 78-year-old patient taking 8 different medications. Which concern should be prioritized?",
        options: [
          "The patient is taking too few medications for their age",
          "Polypharmacy increases the risk of adverse drug reactions, drug interactions, and falls",
          "Older adults metabolize medications faster and need higher doses",
          "Multiple medications are always necessary and do not pose additional risks in older adults"
        ],
        correct: 1,
        rationale: "Polypharmacy (5 or more concurrent medications) is a significant safety concern in older adults. Age-related decreases in hepatic metabolism and renal clearance cause medications to accumulate, increasing the risk of adverse drug reactions, drug-drug interactions, falls, confusion, and hospitalization. Medication reconciliation using tools like the Beers Criteria helps identify potentially inappropriate medications."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  console.log(`Processing: ${id}`);
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
if (fail > 0) process.exit(1);
