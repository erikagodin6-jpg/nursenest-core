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
  "hyperparathyroidism-rpn": {
    title: "Hyperparathyroidism for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hyperparathyroidism",
      content: "Hyperparathyroidism is an endocrine disorder characterized by excessive secretion of parathyroid hormone (PTH) from one or more of the four parathyroid glands located on the posterior surface of the thyroid gland. PTH is the primary regulator of calcium homeostasis, and its overproduction leads to persistent hypercalcemia through three principal mechanisms: increased osteoclastic bone resorption releasing calcium and phosphorus from the skeletal matrix, enhanced renal tubular reabsorption of calcium in the distal convoluted tubule, and stimulation of 1,25-dihydroxyvitamin D (calcitriol) synthesis in the proximal renal tubule which increases intestinal calcium absorption. Primary hyperparathyroidism is the most common form and is caused in approximately 80-85% of cases by a single parathyroid adenoma, a benign neoplasm that autonomously secretes PTH independent of serum calcium feedback. Less commonly, primary disease results from parathyroid hyperplasia (involving all four glands, often associated with multiple endocrine neoplasia syndromes MEN type 1 or MEN type 2A) or rarely parathyroid carcinoma (less than 1% of cases). Secondary hyperparathyroidism develops as a compensatory response to chronic hypocalcemia, most frequently in chronic kidney disease where impaired phosphorus excretion and reduced calcitriol synthesis drive persistent PTH elevation. Tertiary hyperparathyroidism occurs when chronically stimulated parathyroid glands develop autonomous function, continuing to oversecrete PTH even after the underlying cause (such as post-renal transplant) has been corrected. The classic clinical presentation of primary hyperparathyroidism is remembered by the mnemonic 'bones, stones, groans, and moans' -- referring to skeletal complications (osteoporosis, pathologic fractures, osteitis fibrosa cystica with characteristic brown tumors and subperiosteal bone resorption), renal complications (nephrolithiasis from calcium-phosphate or calcium-oxalate stones, nephrocalcinosis, polyuria from impaired renal concentrating ability), gastrointestinal complaints (anorexia, nausea, vomiting, constipation, peptic ulcer disease, pancreatitis), and neuropsychiatric manifestations (depression, fatigue, cognitive dysfunction, psychosis). Osteitis fibrosa cystica is the hallmark skeletal manifestation, characterized by replacement of normal bone with fibrous tissue and formation of cystic lesions (brown tumors) due to excessive osteoclast-mediated bone resorption stimulated by chronically elevated PTH. Hypercalcemia affects virtually every organ system: in the cardiovascular system it shortens the QT interval on ECG and can cause hypertension and cardiac calcification; in the renal system it impairs the kidney's ability to concentrate urine leading to polyuria and polydipsia (nephrogenic diabetes insipidus pattern); in the neuromuscular system it decreases neuronal excitability causing muscle weakness, hyporeflexia, and fatigue; and in the gastrointestinal system it slows motility causing constipation and can stimulate gastrin secretion leading to peptic ulcer disease. The practical nurse plays a critical role in monitoring calcium levels, recognizing signs and symptoms of hypercalcemia, promoting adequate hydration to prevent renal stone formation, implementing fall precautions due to muscle weakness and bone fragility, and reporting changes in mental status or cardiac rhythm to the supervising nurse or physician. Post-parathyroidectomy monitoring is equally important, as the sudden drop in PTH can lead to 'hungry bone syndrome' where calcium rapidly deposits back into demineralized bone, causing potentially severe hypocalcemia requiring close monitoring of serum calcium every 6-8 hours in the immediate postoperative period."
    },
    riskFactors: [
      "Female sex and postmenopausal status (primary hyperparathyroidism occurs 2-3 times more frequently in women)",
      "History of radiation exposure to the head and neck region (increases parathyroid adenoma risk)",
      "Chronic kidney disease stages 3-5 (secondary hyperparathyroidism from impaired phosphorus excretion and vitamin D activation)",
      "Lithium therapy (alters calcium-sensing receptor set point, promoting PTH secretion)",
      "Family history of multiple endocrine neoplasia (MEN type 1 or MEN type 2A syndromes)",
      "Vitamin D deficiency (stimulates compensatory PTH elevation)",
      "Advanced age over 50 years (increased incidence of parathyroid adenoma)"
    ],
    diagnostics: [
      "Serum calcium (total and ionized): elevated in primary hyperparathyroidism; ionized calcium is more accurate in patients with altered albumin levels; normal total calcium 2.12-2.62 mmol/L",
      "Intact PTH level: elevated or inappropriately normal in the presence of hypercalcemia; the combination of elevated calcium with elevated PTH is diagnostic of primary hyperparathyroidism",
      "Serum phosphorus: typically low in primary hyperparathyroidism (PTH promotes renal phosphorus excretion); elevated in secondary hyperparathyroidism from renal failure",
      "24-hour urine calcium: elevated in primary hyperparathyroidism; helps distinguish from familial hypocalciuric hypercalcemia (FHH) where urine calcium is low",
      "DEXA bone density scan: evaluates for osteoporosis, particularly at the distal one-third radius which is the site most affected by PTH-mediated cortical bone loss",
      "Sestamibi parathyroid scan: nuclear medicine study to localize parathyroid adenoma before surgery; the adenoma retains radiotracer longer than surrounding thyroid tissue"
    ],
    management: [
      "Parathyroidectomy: definitive treatment for primary hyperparathyroidism; indications include serum calcium more than 0.25 mmol/L above normal, age under 50, osteoporosis, renal stones, or reduced kidney function",
      "Aggressive IV hydration with normal saline (0.9% NaCl) at 200-300 mL/hour initially for acute hypercalcemia to promote renal calcium excretion",
      "Monitor serum calcium, phosphorus, magnesium, and creatinine levels every 6-12 hours during acute management",
      "Implement fall precautions due to muscle weakness, fatigue, and potential for pathologic fractures from demineralized bone",
      "Encourage oral fluid intake of 2-3 liters per day (unless contraindicated) to prevent renal stone formation and promote calcium excretion",
      "Strain all urine to detect and collect kidney stones for composition analysis",
      "Post-parathyroidectomy: monitor for signs of hypocalcemia (Chvostek sign, Trousseau sign, perioral tingling, muscle cramping) every 4-6 hours for first 48 hours"
    ],
    nursingActions: [
      "Monitor serum calcium levels and report values above 3.0 mmol/L (12 mg/dL) immediately as this indicates severe hypercalcemia requiring urgent intervention",
      "Assess for signs and symptoms of hypercalcemia using the 'bones, stones, groans, moans' framework at each shift assessment",
      "Maintain accurate intake and output records; ensure adequate hydration to promote renal calcium clearance and prevent nephrolithiasis",
      "Monitor cardiac rhythm on telemetry; report shortened QT interval, bradycardia, or heart block patterns that indicate cardiac effects of hypercalcemia",
      "Implement seizure precautions and maintain a safe environment; hypercalcemia can cause neuromuscular changes and altered mental status",
      "Administer prescribed medications (calcitonin, bisphosphonates, IV fluids) on schedule and monitor for therapeutic response and adverse effects",
      "Educate patient on dietary modifications: avoid excessive calcium and vitamin D supplements, limit dairy intake during active hypercalcemia, and maintain adequate but not excessive protein intake"
    ],
    assessmentFindings: [
      "Muscle weakness, fatigue, and decreased deep tendon reflexes from hypercalcemia-induced reduction in neuromuscular excitability",
      "Polyuria and polydipsia from impaired renal concentrating ability (nephrogenic diabetes insipidus pattern caused by calcium interfering with ADH action)",
      "Constipation, anorexia, nausea, and vomiting from hypercalcemia-induced decreased gastrointestinal motility",
      "Bone pain, particularly in the back and extremities, from osteoclastic bone resorption and possible pathologic fractures",
      "Cognitive changes including confusion, poor concentration, depression, and lethargy from calcium effects on neuronal function",
      "Shortened QT interval on ECG; in severe cases, widened QRS and heart block patterns",
      "Flank pain or hematuria indicating possible nephrolithiasis from calcium stone formation"
    ],
    signs: {
      left: [
        "Mild fatigue and generalized weakness",
        "Subtle cognitive changes (poor concentration, forgetfulness)",
        "Increased thirst and urinary frequency",
        "Mild constipation",
        "Vague bone or joint aches",
        "Decreased appetite"
      ],
      right: [
        "Serum calcium above 3.5 mmol/L (14 mg/dL) -- hypercalcemic crisis",
        "Cardiac dysrhythmias (heart block, asystole risk)",
        "Severe altered mental status, confusion, or coma",
        "Acute renal failure from nephrocalcinosis",
        "Pathologic fracture from severe bone demineralization",
        "Acute pancreatitis with severe abdominal pain"
      ]
    },
    medications: [
      {
        name: "Calcitonin (Miacalcin)",
        type: "Calcium-lowering hormone (thyroid C-cell hormone analog)",
        action: "Directly inhibits osteoclast-mediated bone resorption, reducing the release of calcium from bone into the bloodstream; also promotes renal calcium excretion by decreasing tubular reabsorption; onset of action within 2-4 hours making it useful for acute hypercalcemia management",
        sideEffects: "Facial flushing, nausea, nasal congestion (with nasal spray formulation), injection site reactions, rhinitis, tachyphylaxis (reduced effectiveness) typically develops within 48-72 hours of continuous use",
        contra: "Known hypersensitivity to calcitonin-salmon; perform skin test before first dose in some facilities due to risk of allergic reaction to salmon-derived protein",
        pearl: "Calcitonin provides the fastest onset of calcium lowering (2-4 hours) but its effect is modest (typically lowers calcium by 0.3-0.5 mmol/L) and temporary due to tachyphylaxis; used as a bridge therapy while waiting for bisphosphonates to take effect (which require 2-4 days)"
      },
      {
        name: "Alendronate (Fosamax)",
        type: "Bisphosphonate (osteoclast inhibitor)",
        action: "Binds to hydroxyapatite crystals on bone surfaces and is internalized by osteoclasts during bone resorption; inhibits the mevalonate pathway enzyme farnesyl pyrophosphate synthase within osteoclasts, disrupting their cytoskeletal organization and inducing apoptosis; this reduces bone resorption and lowers serum calcium over 2-4 days",
        sideEffects: "Esophageal irritation and ulceration (most common), musculoskeletal pain, hypocalcemia, osteonecrosis of the jaw (rare, primarily with IV bisphosphonates), atypical femoral fractures with prolonged use exceeding 5 years",
        contra: "Esophageal disorders (stricture, achalasia, inability to remain upright for 30 minutes); hypocalcemia (must correct before starting); severe renal impairment with creatinine clearance below 35 mL/min",
        pearl: "Patient must take on an empty stomach with a full glass of plain water (not mineral water or juice) first thing in the morning, then remain upright (sitting or standing) for at least 30 minutes and avoid eating, drinking, or taking other medications to prevent esophageal injury"
      },
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid IV fluid",
        action: "Expands intravascular volume and increases renal blood flow, promoting glomerular filtration and urinary calcium excretion (calciuresis); sodium competes with calcium for reabsorption in the renal tubule, so increased sodium delivery enhances calcium clearance; corrects dehydration that is universally present in hypercalcemic patients due to polyuria",
        sideEffects: "Fluid overload (pulmonary edema, peripheral edema), hypernatremia, hyperchloremic metabolic acidosis with large volumes, dilutional hypokalemia and hypomagnesemia",
        contra: "Decompensated heart failure (use with extreme caution, slower rates, and close monitoring); severe hypernatremia; monitor closely in patients with renal insufficiency",
        pearl: "First-line treatment for acute hypercalcemia: initial bolus of 200-300 mL/hour with goal of 3-4 liters in first 24 hours; monitor intake and output hourly; assess lung sounds every 2-4 hours for signs of fluid overload; loop diuretics (furosemide) should NOT be added routinely -- only if signs of volume overload develop"
      }
    ],
    pearls: [
      "The classic mnemonic for hyperparathyroidism symptoms is 'bones, stones, groans, and moans' -- bones (osteoporosis, fractures), stones (kidney stones), groans (GI symptoms including constipation, nausea, pancreatitis), moans (neuropsychiatric symptoms including depression, fatigue, confusion)",
      "Primary hyperparathyroidism shows elevated calcium WITH elevated PTH -- this combination is the diagnostic hallmark because PTH should be suppressed when calcium is high; if PTH is appropriately suppressed, the hypercalcemia has a non-parathyroid cause",
      "IV normal saline is ALWAYS the first intervention for significant hypercalcemia -- dehydration from polyuria worsens calcium levels, and volume expansion promotes renal calcium excretion; target urine output of 200-300 mL/hour initially",
      "After parathyroidectomy, monitor closely for 'hungry bone syndrome' -- rapid uptake of calcium into previously demineralized bone causes potentially severe hypocalcemia; highest risk in patients with preoperative bone disease or vitamin D deficiency",
      "Calcitonin works fast (2-4 hours) but develops tachyphylaxis within 48-72 hours; bisphosphonates work slowly (2-4 days) but have sustained effect -- use calcitonin as a bridge while bisphosphonates take effect in acute hypercalcemia management",
      "Shortened QT interval on ECG is the characteristic cardiac finding of hypercalcemia -- monitor telemetry continuously in patients with calcium above 3.0 mmol/L as severe hypercalcemia can progress to heart block and asystole",
      "Post-parathyroidectomy patients should be taught to recognize signs of hypocalcemia (numbness/tingling around the mouth and fingertips, muscle twitching, cramping) and report immediately -- have IV calcium gluconate available at the bedside"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with primary hyperparathyroidism. The patient reports increased thirst, frequent urination, constipation, and bone pain. Which mnemonic best describes these clinical manifestations?",
        options: [
          "ABCDE (Airway, Breathing, Circulation, Disability, Exposure)",
          "MUDPILES (Methanol, Uremia, DKA, Propylene glycol, Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates)",
          "Bones, stones, groans, and moans",
          "SBAR (Situation, Background, Assessment, Recommendation)"
        ],
        correct: 2,
        rationale: "The mnemonic 'bones, stones, groans, and moans' describes the classic manifestations of hyperparathyroidism: bones (bone pain, fractures, osteoporosis), stones (kidney stones from hypercalciuria), groans (GI symptoms including constipation), and moans (neuropsychiatric symptoms including fatigue and depression). The patient's symptoms of bone pain, polyuria/polydipsia, and constipation fit this pattern."
      },
      {
        question: "A patient with severe hypercalcemia (serum calcium 3.8 mmol/L) is admitted to the unit. Which intervention should the practical nurse anticipate as the FIRST priority?",
        options: [
          "Administer oral alendronate with breakfast",
          "Initiate IV normal saline infusion at 200-300 mL/hour",
          "Restrict all oral fluid intake",
          "Administer oral calcium supplements to prevent rebound"
        ],
        correct: 1,
        rationale: "IV normal saline is the first-line treatment for acute hypercalcemia. Volume expansion corrects dehydration (caused by hypercalcemia-induced polyuria), increases renal blood flow, and promotes urinary calcium excretion. Fluids should not be restricted, calcium supplements would worsen hypercalcemia, and alendronate requires an empty stomach and upright positioning."
      },
      {
        question: "Following parathyroidectomy, a patient develops perioral tingling and muscle twitching. The practical nurse taps the facial nerve anterior to the ear and observes ipsilateral facial muscle contraction. What does this finding indicate?",
        options: [
          "Hypercalcemia recurrence requiring IV fluids",
          "Positive Chvostek sign indicating hypocalcemia",
          "Normal postoperative healing response",
          "Hypermagnesemia from IV fluid administration"
        ],
        correct: 1,
        rationale: "Chvostek sign (facial muscle contraction when the facial nerve is tapped anterior to the ear) is a clinical indicator of hypocalcemia. Post-parathyroidectomy hypocalcemia occurs because PTH levels drop suddenly, and calcium may be rapidly taken up by demineralized bone (hungry bone syndrome). The practical nurse should report this finding immediately and anticipate orders for IV calcium gluconate."
      }
    ]
  },

  "hypoparathyroidism-rpn": {
    title: "Hypoparathyroidism for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hypoparathyroidism",
      content: "Hypoparathyroidism is an endocrine disorder characterized by deficient secretion or impaired action of parathyroid hormone (PTH), resulting in hypocalcemia and hyperphosphatemia. The parathyroid glands, typically four small glands located on the posterior surface of the thyroid, are responsible for maintaining calcium homeostasis through PTH secretion. When PTH is deficient, three critical calcium-regulating mechanisms fail: osteoclastic bone resorption decreases (reducing calcium release from skeletal stores), renal tubular calcium reabsorption diminishes (increasing urinary calcium loss), and renal conversion of 25-hydroxyvitamin D to active 1,25-dihydroxyvitamin D (calcitriol) is impaired (reducing intestinal calcium absorption). Simultaneously, phosphorus levels rise because PTH normally promotes renal phosphorus excretion; without adequate PTH, the kidneys retain phosphorus, and the elevated phosphorus further depresses ionized calcium through calcium-phosphate complex formation. The most common cause of hypoparathyroidism is iatrogenic injury during thyroid surgery (thyroidectomy), parathyroid surgery, or radical neck dissection, accounting for approximately 75% of all cases. During thyroidectomy, the parathyroid glands may be inadvertently removed, devascularized, or damaged because of their small size (each approximately 3-5 mm) and variable anatomic location. Post-surgical hypoparathyroidism may be transient (resolving within weeks to months as remaining parathyroid tissue recovers) or permanent (persisting beyond 6-12 months). Autoimmune hypoparathyroidism occurs when the immune system destroys parathyroid tissue, often as part of autoimmune polyendocrine syndrome type 1 (APS-1), which also includes adrenal insufficiency and mucocutaneous candidiasis. Congenital causes include DiGeorge syndrome (22q11.2 deletion), characterized by absent or hypoplastic parathyroid glands along with thymic aplasia and cardiac defects. Hypomagnesemia is an important and often overlooked cause of functional hypoparathyroidism: magnesium is required for both PTH secretion and PTH receptor function, so severe magnesium deficiency (below 0.4 mmol/L) impairs PTH release and causes resistance to PTH action at target organs. The hallmark clinical manifestations of hypoparathyroidism result from hypocalcemia-induced increased neuromuscular excitability. Calcium normally stabilizes voltage-gated sodium channels on nerve and muscle cell membranes; when extracellular calcium falls, these channels become hyperexcitable, opening at lower thresholds and causing spontaneous depolarization. This manifests as paresthesias (tingling and numbness, particularly perioral and in the fingertips), muscle cramps and spasms, carpopedal spasm (involuntary hand and foot contraction), and in severe cases, laryngospasm (potentially fatal upper airway obstruction from vocal cord spasm) and generalized tonic-clonic seizures. Two classic bedside tests assess for latent tetany: Chvostek sign (tapping the facial nerve anterior to the ear produces ipsilateral facial muscle twitching) and Trousseau sign (inflating a blood pressure cuff above systolic pressure for 3 minutes produces carpopedal spasm of the ipsilateral hand -- this is the more reliable and specific of the two signs). Cardiac effects of hypocalcemia include prolonged QT interval on ECG (due to lengthened ST segment), which predisposes to torsades de pointes ventricular tachycardia, and decreased myocardial contractility potentially leading to heart failure. Chronic hypocalcemia can cause basal ganglia calcification (leading to extrapyramidal movement disorders), cataracts from calcium deposition in the lens, dry skin, brittle nails, and dental enamel hypoplasia. The practical nurse must be prepared to recognize the early warning signs of hypocalcemia, maintain emergency calcium replacement at the bedside for post-surgical patients, monitor cardiac rhythm for QT prolongation, and implement seizure and airway precautions."
    },
    riskFactors: [
      "Recent thyroid, parathyroid, or radical neck surgery (most common cause, approximately 75% of cases due to inadvertent parathyroid gland removal or devascularization)",
      "Autoimmune polyendocrine syndrome type 1 (autoimmune destruction of parathyroid glands, often with adrenal insufficiency and mucocutaneous candidiasis)",
      "Severe hypomagnesemia from alcoholism, malnutrition, or prolonged proton pump inhibitor use (magnesium required for PTH secretion and action)",
      "Family history of DiGeorge syndrome or 22q11.2 chromosomal deletion (congenital absence of parathyroid glands)",
      "Iron overload conditions including hemochromatosis or repeated blood transfusions (iron deposition damages parathyroid tissue)",
      "History of radiation therapy to the neck region (radiation-induced parathyroid gland damage)",
      "Wilson disease or copper storage disorders (copper deposition in parathyroid tissue impairs function)"
    ],
    diagnostics: [
      "Serum calcium (total and ionized): low total calcium (below 2.12 mmol/L) and low ionized calcium (below 1.12 mmol/L); ionized calcium is the physiologically active form and more accurate in patients with hypoalbuminemia",
      "Intact PTH level: low or inappropriately normal in the context of hypocalcemia; PTH should be elevated when calcium is low, so a normal PTH with low calcium indicates parathyroid dysfunction",
      "Serum phosphorus: elevated (above 1.45 mmol/L) because PTH normally promotes renal phosphorus excretion; the combination of low calcium with high phosphorus points to hypoparathyroidism",
      "Serum magnesium: must be checked in all patients with hypocalcemia; hypomagnesemia (below 0.7 mmol/L) causes functional hypoparathyroidism and must be corrected before calcium will normalize",
      "25-hydroxyvitamin D and 1,25-dihydroxyvitamin D levels: 1,25-dihydroxyvitamin D is typically low in hypoparathyroidism because PTH stimulates its renal synthesis; 25-hydroxyvitamin D may be normal",
      "ECG (12-lead): prolonged QT interval from lengthened ST segment is the characteristic finding of hypocalcemia; monitor for risk of torsades de pointes"
    ],
    management: [
      "Acute symptomatic hypocalcemia: administer IV calcium gluconate 10% (10-20 mL) slowly over 10-20 minutes with continuous cardiac monitoring; never give as rapid IV push due to cardiac arrest risk",
      "Correct hypomagnesemia first if present: administer IV magnesium sulfate as prescribed; hypocalcemia will not respond to calcium replacement until magnesium is normalized",
      "Chronic management: oral calcium carbonate or calcium citrate supplements (1-3 grams elemental calcium daily in divided doses) plus calcitriol (active vitamin D) since PTH-dependent renal activation of vitamin D is impaired",
      "Implement seizure precautions: padded side rails, suction equipment at bedside, quiet environment, dim lighting to reduce stimulation in patients with severe hypocalcemia",
      "Maintain airway management equipment at bedside (laryngoscope, endotracheal tube, bag-valve mask) for patients at risk of laryngospasm from severe hypocalcemia",
      "Monitor serum calcium levels every 6-8 hours during acute management and adjust IV calcium infusion rate based on levels and symptom resolution",
      "Dietary teaching: high-calcium foods (dairy products, fortified foods, leafy greens) and phosphorus restriction (limit processed foods, cola beverages, organ meats) to help manage chronic hypoparathyroidism"
    ],
    nursingActions: [
      "Assess for Chvostek sign (tap facial nerve anterior to ear -- positive if ipsilateral facial muscles twitch) and Trousseau sign (inflate BP cuff above systolic for 3 minutes -- positive if carpopedal spasm develops) every 4 hours in at-risk patients",
      "Monitor cardiac rhythm continuously on telemetry; measure and report QT interval prolongation (corrected QT above 500 ms increases torsades de pointes risk significantly)",
      "Keep IV calcium gluconate (10% solution) available at the bedside for all post-thyroidectomy patients; ensure the IV site is patent and without infiltration before administration",
      "Administer IV calcium gluconate through a large-bore peripheral IV or central line; calcium is a vesicant and extravasation causes severe tissue necrosis -- stop infusion immediately if swelling, pain, or redness develops at the site",
      "Assess respiratory status including voice quality every 2-4 hours post-thyroidectomy; hoarseness, stridor, or voice changes may indicate laryngeal nerve injury or laryngospasm from hypocalcemia",
      "Monitor for signs of digitalis toxicity in patients on digoxin: hypocalcemia increases sensitivity to digoxin; report nausea, visual changes, or new dysrhythmias immediately",
      "Report serum calcium below 1.9 mmol/L (7.5 mg/dL) or any symptomatic hypocalcemia (tetany, seizures, stridor) as a medical emergency requiring immediate physician notification"
    ],
    assessmentFindings: [
      "Perioral numbness and tingling (circumoral paresthesias) and fingertip tingling -- often the earliest symptoms of hypocalcemia reported by patients",
      "Muscle cramps, spasms, and carpopedal spasm (involuntary flexion of the wrists and metacarpophalangeal joints with extension of interphalangeal joints and adduction of the thumb)",
      "Positive Chvostek sign (facial muscle twitching with nerve tapping) -- present in approximately 10-25% of normocalcemic individuals, so sensitivity is limited",
      "Positive Trousseau sign (carpopedal spasm with BP cuff inflation) -- more specific than Chvostek sign and considered the more reliable bedside test for latent tetany",
      "Prolonged QT interval on ECG with risk of torsades de pointes ventricular tachycardia; decreased myocardial contractility",
      "Dry, scaly skin; brittle nails with transverse ridges; coarse, brittle hair; and dental enamel defects in chronic hypoparathyroidism",
      "Anxiety, irritability, depression, and cognitive impairment from effects of chronic hypocalcemia on central nervous system function"
    ],
    signs: {
      left: [
        "Perioral and fingertip tingling or numbness",
        "Mild muscle cramping in extremities",
        "Fatigue and irritability",
        "Positive Chvostek sign on assessment",
        "Mild anxiety or emotional lability",
        "Dry skin and brittle nails"
      ],
      right: [
        "Laryngospasm with stridor (airway emergency)",
        "Generalized tonic-clonic seizures",
        "Cardiac arrest from severe hypocalcemia",
        "Prolonged QT with torsades de pointes",
        "Severe carpopedal spasm and tetany",
        "Bronchospasm with respiratory failure"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate 10% IV",
        type: "Electrolyte replacement (parenteral calcium)",
        action: "Provides exogenous ionized calcium directly into the bloodstream, rapidly increasing serum calcium concentration and restoring normal neuromuscular excitability; calcium stabilizes voltage-gated sodium channels on nerve and muscle cell membranes, reducing the hyperexcitability that causes tetany and seizures",
        sideEffects: "Bradycardia and cardiac arrest if administered too rapidly (must infuse over 10-20 minutes); hypercalcemia with overcorrection; tissue necrosis if extravasation occurs (calcium is a vesicant); flushing, warmth, and tingling during infusion",
        contra: "Concurrent digoxin therapy requires extreme caution (calcium potentiates digoxin toxicity -- use with continuous cardiac monitoring); hypercalcemia; ventricular fibrillation; do not mix with bicarbonate solutions (precipitates)",
        pearl: "Calcium gluconate is preferred over calcium chloride for peripheral IV administration because it is less irritating to veins and causes less tissue damage if extravasation occurs; calcium chloride contains 3 times more elemental calcium per gram but should only be given through a central line; always use an infusion pump and cardiac monitoring during IV calcium administration"
      },
      {
        name: "Calcitriol (Rocaltrol)",
        type: "Active vitamin D analog (1,25-dihydroxyvitamin D3)",
        action: "Bypasses the PTH-dependent renal hydroxylation step that is impaired in hypoparathyroidism; directly increases intestinal calcium and phosphorus absorption, promotes renal calcium reabsorption, and facilitates bone mineralization; onset of action within 1-3 days with peak effect at 2 weeks",
        sideEffects: "Hypercalcemia (most common adverse effect with over-replacement), hypercalciuria leading to kidney stones, hyperphosphatemia, nausea, vomiting, constipation, weakness, polyuria",
        contra: "Hypercalcemia; vitamin D toxicity; known hypersensitivity; use with caution in patients with renal impairment or those taking thiazide diuretics (which reduce renal calcium excretion)",
        pearl: "Calcitriol is the preferred vitamin D preparation in hypoparathyroidism because it does not require renal 1-alpha-hydroxylation (which is PTH-dependent and impaired); monitor serum calcium weekly during dose titration, then monthly once stable; target serum calcium at the low-normal range to avoid hypercalciuria and kidney stones"
      },
      {
        name: "Magnesium Sulfate IV",
        type: "Electrolyte replacement (parenteral magnesium)",
        action: "Replaces deficient magnesium stores, restoring normal PTH secretion and PTH receptor responsiveness; magnesium is an essential cofactor for adenylyl cyclase in parathyroid cells (required for PTH release) and for PTH receptor signal transduction in target organs; correcting hypomagnesemia allows the calcium-PTH axis to function normally",
        sideEffects: "Flushing, warmth, diaphoresis, hypotension, bradycardia, respiratory depression (at serum levels above 5 mmol/L), loss of deep tendon reflexes (early sign of toxicity), cardiac arrest at very high levels",
        contra: "Severe renal impairment (magnesium is renally excreted -- risk of accumulation and toxicity); heart block; myasthenia gravis (may worsen neuromuscular weakness)",
        pearl: "Always check magnesium level in any patient with refractory hypocalcemia -- calcium will NOT normalize until magnesium is corrected; monitor deep tendon reflexes (patellar reflex) before each dose as loss of reflexes is the earliest sign of magnesium toxicity; have calcium gluconate available as the antidote for magnesium toxicity (it reverses the cardiac and respiratory depression)"
      }
    ],
    pearls: [
      "Chvostek sign (facial twitch with nerve tapping) and Trousseau sign (carpopedal spasm with BP cuff inflation) are the two bedside tests for latent tetany -- Trousseau sign is more specific and more reliable; a positive Trousseau sign in the context of post-thyroidectomy is a clinical emergency",
      "Hypocalcemia will NOT correct until hypomagnesemia is treated -- always check magnesium in patients with refractory hypocalcemia; magnesium is required for both PTH secretion and PTH receptor function",
      "IV calcium gluconate must NEVER be given as a rapid IV push -- infuse over 10-20 minutes with continuous cardiac monitoring; rapid administration causes severe bradycardia and cardiac arrest",
      "Post-thyroidectomy patients are at highest risk for hypocalcemia in the first 24-72 hours -- keep IV calcium gluconate at the bedside and check serum calcium every 6-8 hours; teach patients to report perioral tingling immediately",
      "Prolonged QT interval is the hallmark ECG finding of hypocalcemia -- this predisposes to torsades de pointes ventricular tachycardia, which is a life-threatening dysrhythmia requiring immediate intervention",
      "Calcium gluconate is preferred over calcium chloride for peripheral IV use because calcium chloride is 3 times more concentrated and causes severe tissue necrosis if it extravasates; calcium chloride is reserved for central line administration or cardiac arrest",
      "In chronic hypoparathyroidism, the treatment goal is to maintain serum calcium at the LOW end of normal (not high-normal) to prevent hypercalciuria and kidney stone formation -- monitor 24-hour urine calcium periodically"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient 12 hours after total thyroidectomy. The patient reports tingling around the mouth and numbness in the fingertips. What is the PRIORITY nursing action?",
        options: [
          "Document the findings and reassess in 4 hours",
          "Notify the physician immediately and prepare IV calcium gluconate",
          "Administer an oral calcium supplement with meals",
          "Apply a warm compress to the neck incision site"
        ],
        correct: 1,
        rationale: "Perioral tingling and fingertip numbness in a post-thyroidectomy patient are classic early signs of hypocalcemia from hypoparathyroidism (inadvertent parathyroid gland damage during surgery). This requires immediate physician notification and preparation of IV calcium gluconate, as hypocalcemia can rapidly progress to tetany, laryngospasm, seizures, and cardiac arrest."
      },
      {
        question: "A patient with hypoparathyroidism has a serum calcium of 1.6 mmol/L and a serum magnesium of 0.3 mmol/L. Despite receiving IV calcium gluconate, the calcium level remains critically low. What should the practical nurse anticipate as the next intervention?",
        options: [
          "Increase the calcium gluconate infusion rate",
          "Administer IV magnesium sulfate",
          "Administer oral vitamin D supplements",
          "Discontinue all IV fluids"
        ],
        correct: 1,
        rationale: "Severe hypomagnesemia (0.3 mmol/L, normal 0.7-1.0 mmol/L) causes functional hypoparathyroidism because magnesium is required for PTH secretion and PTH receptor function. Hypocalcemia will NOT respond to calcium replacement alone until magnesium is corrected. IV magnesium sulfate must be administered to restore normal PTH axis function."
      },
      {
        question: "The practical nurse inflates a blood pressure cuff on a patient's arm above the systolic pressure and maintains inflation for 3 minutes. Carpopedal spasm develops in the hand. Which clinical finding does this represent?",
        options: [
          "Chvostek sign indicating hypercalcemia",
          "Trousseau sign indicating hypocalcemia",
          "Homans sign indicating deep vein thrombosis",
          "Kernig sign indicating meningeal irritation"
        ],
        correct: 1,
        rationale: "Trousseau sign is elicited by inflating a blood pressure cuff above systolic pressure for 3 minutes; a positive result (carpopedal spasm) indicates latent tetany from hypocalcemia. Trousseau sign is more specific than Chvostek sign for hypocalcemia. Chvostek sign involves tapping the facial nerve, Homans sign tests for DVT, and Kernig sign tests for meningeal irritation."
      }
    ]
  },

  "hypothermia-rpn": {
    title: "Hypothermia Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hypothermia",
      content: "Hypothermia is defined as a core body temperature below 35 degrees Celsius (95 degrees Fahrenheit) and occurs when heat loss exceeds the body's capacity for heat production and conservation. The hypothalamus serves as the body's thermoregulatory center, receiving input from peripheral and central thermoreceptors and initiating compensatory responses through the sympathetic nervous system, somatic motor system, and endocrine pathways. When core temperature begins to fall, the hypothalamus activates vasoconstriction of peripheral blood vessels (redirecting blood to the core), stimulates shivering thermogenesis (involuntary rhythmic skeletal muscle contraction that generates heat through ATP hydrolysis), increases metabolic rate through thyroid hormone and catecholamine release, and triggers behavioral responses (seeking warmth, adding clothing). Heat loss occurs through four physical mechanisms: conduction (direct transfer of heat through physical contact with a cooler surface -- responsible for significant heat loss in immersion or contact with cold ground), convection (heat carried away by moving air or water currents -- wind chill dramatically increases convective heat loss), radiation (emission of infrared electromagnetic waves from the body surface -- the largest source of heat loss in normal conditions, accounting for approximately 60% of total heat loss), and evaporation (heat consumed in converting liquid water to vapor from the skin and respiratory tract -- significant during perspiration and in humid environments). Hypothermia is classified by severity based on core temperature: mild hypothermia (32-35 degrees C) where shivering is vigorous, tachycardia and tachypnea are present, and the patient shows poor judgment and impaired coordination; moderate hypothermia (28-32 degrees C) where shivering ceases (a dangerous sign indicating exhaustion of thermogenic capacity), heart rate decreases, atrial fibrillation commonly develops, and consciousness becomes progressively impaired with confusion, slurred speech, and paradoxical undressing (the patient removes clothing due to perceived warmth from failing thermoregulation); and severe hypothermia (below 28 degrees C) where the patient appears clinically dead with fixed dilated pupils, absent reflexes, severe bradycardia, ventricular fibrillation or asystole risk, and undetectable vital signs. The J-wave (Osborn wave) is a pathognomonic ECG finding in hypothermia, appearing as a positive deflection at the junction of the QRS complex and ST segment (J-point); its amplitude increases as core temperature decreases. Cardiac dysrhythmias in hypothermia follow a predictable progression: sinus tachycardia transitions to atrial fibrillation (typically at 32-33 degrees C), then to ventricular fibrillation (typically below 28 degrees C), and finally to asystole. The myocardium becomes increasingly irritable as temperature drops, and physical stimulation (rough handling, jarring movements, central line insertion) can trigger lethal ventricular fibrillation in the severely hypothermic heart. This is the basis for the critical nursing principle of gentle handling -- minimize all physical manipulation of severely hypothermic patients. Rewarming strategies are categorized as passive external rewarming (removing wet clothing, insulating with blankets, allowing the body's own heat production to gradually increase temperature -- appropriate for mild hypothermia in patients who can still shiver), active external rewarming (applying external heat sources including warm blankets, forced-air warming devices such as Bair Hugger, warm water immersion, and heating pads -- used for moderate hypothermia), and active core rewarming (warming the core directly through warmed IV fluids at 40-42 degrees C, warmed humidified oxygen, peritoneal lavage with warmed fluid, thoracic cavity lavage, or extracorporeal blood rewarming via cardiopulmonary bypass -- reserved for severe hypothermia and cardiac arrest). A critical rewarming complication is 'afterdrop' -- a further decline in core temperature that occurs during the initial rewarming period as cold, acidotic blood from the peripheral tissues returns to the central circulation; this can trigger cardiac dysrhythmias and cardiovascular collapse. Rewarming shock can also occur as peripheral vasodilation during rewarming leads to relative hypovolemia and hypotension. The practical nurse must understand the principles of gradual rewarming, continuous cardiac monitoring, gentle handling protocols, and recognition of rewarming complications."
    },
    riskFactors: [
      "Extremes of age: elderly (impaired thermoregulation, decreased metabolic rate, reduced subcutaneous fat) and neonates (high surface-area-to-body-mass ratio, immature thermoregulation)",
      "Environmental exposure including cold water immersion, inadequate shelter, and prolonged outdoor exposure in cold weather",
      "Alcohol intoxication (causes peripheral vasodilation increasing heat loss, impairs shivering response, impairs judgment regarding cold avoidance)",
      "Endocrine disorders including hypothyroidism (decreased metabolic heat production), hypoglycemia (inadequate substrate for thermogenesis), and adrenal insufficiency",
      "Neurological conditions affecting thermoregulation including spinal cord injury, stroke, and traumatic brain injury",
      "Medications that impair thermoregulation including sedatives, opioids, antipsychotics (phenothiazines), and general anesthesia",
      "Malnutrition and cachexia (decreased subcutaneous insulating fat, reduced metabolic substrate for heat production)"
    ],
    diagnostics: [
      "Core temperature measurement: rectal, esophageal, or bladder probe thermometry (standard oral or axillary thermometers are inaccurate below 35 degrees C); esophageal probe is gold standard for continuous monitoring during rewarming",
      "12-lead ECG: J-wave (Osborn wave) is pathognomonic; also assess for prolonged PR, QRS, and QT intervals, atrial fibrillation, ventricular fibrillation, or asystole",
      "Arterial blood gas (ABG): reveals acid-base disturbances; metabolic acidosis is common from lactic acid accumulation due to impaired tissue perfusion and shivering; ABG results should be interpreted at actual patient temperature",
      "Complete blood count: hemoconcentration (elevated hematocrit) occurs due to cold-induced diuresis and fluid shifts; thrombocytopenia and coagulopathy develop as temperature drops",
      "Basic metabolic panel: hyperkalemia is common in severe hypothermia (cellular potassium shifts); serum potassium above 12 mmol/L in hypothermic cardiac arrest generally indicates non-survivable cellular death",
      "Coagulation studies (PT, INR, PTT): coagulopathy develops as temperature drops because coagulation enzymes function optimally at 37 degrees C; standard lab values may appear falsely normal because samples are warmed to 37 degrees C for testing"
    ],
    management: [
      "Mild hypothermia (32-35 degrees C): passive external rewarming -- remove wet clothing, apply dry insulating layers, provide warm environment, offer warm oral fluids if patient is alert and can swallow safely",
      "Moderate hypothermia (28-32 degrees C): active external rewarming -- forced-air warming blankets (Bair Hugger) applied to trunk only, warmed IV fluids (40-42 degrees C via fluid warmer), warmed humidified oxygen",
      "Severe hypothermia (below 28 degrees C): active core rewarming -- warmed IV fluids, warmed humidified oxygen, peritoneal lavage, thoracic lavage, or extracorporeal rewarming (cardiopulmonary bypass) for cardiac arrest",
      "Handle patient gently at all times -- rough handling can trigger ventricular fibrillation in the irritable hypothermic myocardium; minimize patient repositioning, avoid jarring movements, and use log-roll technique",
      "Initiate continuous cardiac monitoring immediately; have defibrillator accessible but recognize that defibrillation may be ineffective until core temperature exceeds 30 degrees C",
      "Monitor and rewarm at a rate of 1-2 degrees C per hour to minimize afterdrop and rewarming complications",
      "Administer warmed IV normal saline (40-42 degrees C) through a blood warmer; avoid lactated Ringers because the hypothermic liver cannot metabolize lactate effectively"
    ],
    nursingActions: [
      "Obtain and monitor core temperature using appropriate method (rectal or esophageal probe); document temperature trends every 15-30 minutes during active rewarming",
      "Handle the patient with extreme gentleness -- avoid unnecessary repositioning, rough log-rolls, or jarring movements that could precipitate ventricular fibrillation",
      "Remove all wet clothing carefully by cutting if necessary rather than pulling over extremities; apply dry blankets and insulation while minimizing body exposure",
      "Monitor cardiac rhythm continuously on telemetry; immediately report new atrial fibrillation, ventricular ectopy, widening QRS, or any ventricular dysrhythmia",
      "Maintain patent large-bore IV access and administer warmed IV fluids as prescribed; monitor intake and output closely as cold-induced diuresis can cause significant fluid losses",
      "Assess level of consciousness using Glasgow Coma Scale every 30 minutes during rewarming; hypothermia mimics brain death so neurological assessment should not be used to determine prognosis until patient is rewarmed",
      "Monitor blood glucose frequently (every 1-2 hours) and treat hypoglycemia promptly with IV dextrose as prescribed; shivering depletes glycogen stores rapidly"
    ],
    assessmentFindings: [
      "Mild hypothermia (32-35 degrees C): vigorous shivering, tachycardia, tachypnea, cold and pale skin, poor coordination, confusion, slurred speech, impaired judgment",
      "Moderate hypothermia (28-32 degrees C): shivering CEASES (ominous sign), bradycardia, hypotension, atrial fibrillation, decreased level of consciousness, muscle rigidity, dilated pupils",
      "Severe hypothermia (below 28 degrees C): appears clinically dead, fixed dilated pupils, absent reflexes, undetectable pulse and blood pressure, ventricular fibrillation or asystole, coma",
      "J-wave (Osborn wave) on ECG: distinctive positive deflection at the J-point (QRS-ST junction); amplitude increases with decreasing temperature",
      "Paradoxical undressing: patient removes clothing despite extreme cold -- occurs in moderate hypothermia when failing thermoregulation creates a false sensation of warmth",
      "Cold-induced diuresis: increased urine output despite fluid deficit; occurs because peripheral vasoconstriction shifts blood centrally, increasing renal perfusion pressure and suppressing ADH"
    ],
    signs: {
      left: [
        "Shivering and cold, pale skin",
        "Mild confusion and impaired coordination",
        "Tachycardia and tachypnea",
        "Slurred speech",
        "Poor judgment and apathy",
        "Fatigue and muscle stiffness"
      ],
      right: [
        "Cessation of shivering (thermogenic exhaustion)",
        "Ventricular fibrillation or asystole",
        "Fixed, dilated pupils with absent reflexes",
        "Undetectable pulse and blood pressure",
        "Severe bradycardia progressing to cardiac arrest",
        "Core temperature below 28 degrees C"
      ]
    },
    medications: [
      {
        name: "Warm IV Normal Saline (0.9% NaCl at 40-42 degrees C)",
        type: "Isotonic crystalloid / core rewarming fluid",
        action: "Provides exogenous heat directly to the central circulation through warmed fluid infusion, gradually raising core temperature while simultaneously expanding intravascular volume to counteract cold-induced diuresis and rewarming vasodilation; normal saline is preferred over lactated Ringers because the hypothermic liver cannot metabolize lactate, which would worsen metabolic acidosis",
        sideEffects: "Fluid overload if infused too rapidly (especially in elderly or cardiac patients), hypernatremia and hyperchloremic metabolic acidosis with large volumes, local discomfort if fluid is too warm",
        contra: "Decompensated heart failure (use with caution and slower rates); IV fluid temperature must not exceed 42 degrees C as this can cause hemolysis of red blood cells",
        pearl: "Use a dedicated blood/fluid warmer device to heat fluids to 40-42 degrees C; never microwave IV fluids as this causes uneven heating and potential hemolysis; warmed IV fluids alone produce modest core temperature increase (approximately 0.5-1 degrees C per liter) so they are adjunctive to other rewarming methods"
      },
      {
        name: "Atropine Sulfate",
        type: "Anticholinergic / parasympatholytic agent",
        action: "Blocks muscarinic acetylcholine receptors at the sinoatrial and atrioventricular nodes, reducing vagal tone and increasing heart rate and AV conduction velocity; used in hypothermic bradycardia though effectiveness is significantly reduced when core temperature is below 30 degrees C because the hypothermic heart is poorly responsive to pharmacologic interventions",
        sideEffects: "Tachycardia, dry mouth, urinary retention, mydriasis (pupil dilation), blurred vision, constipation, hyperthermia (at therapeutic doses in normothermic patients), confusion in elderly patients",
        contra: "Narrow-angle glaucoma; obstructive uropathy; myasthenia gravis; tachyarrhythmias; recognize that atropine may be ineffective in severe hypothermia (below 30 degrees C) and rewarming is the definitive treatment for hypothermic bradycardia",
        pearl: "In severe hypothermia (below 30 degrees C), ACLS medications including atropine, epinephrine, and amiodarone may be withheld or given at extended intervals because drug metabolism is dramatically slowed and the hypothermic myocardium is poorly responsive; focus on rewarming as the primary intervention; medications begin to work more effectively once core temperature exceeds 30 degrees C"
      },
      {
        name: "Dextrose 50% (D50W) IV",
        type: "Hypertonic glucose solution",
        action: "Provides immediate exogenous glucose substrate to correct hypoglycemia, which is common in hypothermia due to depletion of hepatic glycogen stores from prolonged shivering thermogenesis and impaired hepatic gluconeogenesis at low temperatures; glucose is the primary metabolic fuel for shivering and brain function",
        sideEffects: "Hyperglycemia with rapid or excessive administration, phlebitis and tissue necrosis if extravasation occurs (D50W is hyperosmolar and very irritating to peripheral veins), fluid shifts, rebound hypoglycemia",
        contra: "Hyperglycemia; administer through large-bore peripheral IV or central line due to high osmolarity; avoid in patients with known diabetic hyperglycemia unless confirmed hypoglycemic",
        pearl: "Always check blood glucose before administering D50W; hypothermic patients frequently develop hypoglycemia because shivering consumes glucose rapidly; if the patient cannot shiver (moderate-severe hypothermia), hepatic glycogen stores may already be depleted; give 25-50 mL (12.5-25 grams dextrose) IV push and recheck glucose in 15 minutes; thiamine should be given before or with dextrose in malnourished or alcoholic patients to prevent Wernicke encephalopathy"
      }
    ],
    pearls: [
      "The cardinal rule of hypothermia resuscitation: 'No one is dead until they are warm and dead' -- do NOT pronounce death in a hypothermic patient until core temperature has been rewarmed to at least 32-35 degrees C and resuscitation efforts have failed; hypothermia provides neuroprotective effects that can allow survival even after prolonged cardiac arrest",
      "Cessation of shivering is an OMINOUS sign indicating progression from mild to moderate hypothermia -- shivering stops when the body's thermogenic capacity is exhausted (typically below 30-32 degrees C) and the patient can no longer generate metabolic heat",
      "Handle severely hypothermic patients with EXTREME GENTLENESS -- the cold, irritable myocardium can be triggered into ventricular fibrillation by rough handling, jarring movements, or even central line insertion; use log-roll technique and minimize all manipulation",
      "J-wave (Osborn wave) on ECG is pathognomonic for hypothermia -- this positive deflection at the J-point increases in amplitude as temperature decreases; its presence should prompt immediate core temperature measurement",
      "Rewarm at 1-2 degrees C per hour to avoid 'afterdrop' (further core temperature decline as cold peripheral blood returns to central circulation) and rewarming shock (hypotension from peripheral vasodilation outpacing volume resuscitation)",
      "Normal saline is preferred over lactated Ringers for IV fluids in hypothermia because the cold liver cannot metabolize lactate, and accumulated lactate worsens metabolic acidosis",
      "Defibrillation is generally ineffective when core temperature is below 30 degrees C -- up to three defibrillation attempts may be made, but if unsuccessful, focus on active core rewarming and reattempt defibrillation once temperature exceeds 30 degrees C"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient rescued from cold water immersion. The patient's core temperature is 29 degrees C, and shivering has stopped. The patient is confused and bradycardic. Which classification of hypothermia does this represent?",
        options: [
          "Mild hypothermia requiring passive rewarming only",
          "Moderate hypothermia requiring active external and core rewarming",
          "Heat exhaustion requiring cooling measures",
          "Normothermia requiring routine monitoring"
        ],
        correct: 1,
        rationale: "A core temperature of 29 degrees C falls in the moderate hypothermia range (28-32 degrees C). Cessation of shivering, confusion, and bradycardia are characteristic findings of moderate hypothermia. This patient requires active external rewarming (forced-air warming) and active core rewarming (warmed IV fluids, warmed humidified oxygen). Passive rewarming alone is insufficient for moderate hypothermia."
      },
      {
        question: "While reviewing the ECG of a hypothermic patient, the practical nurse notices a distinctive positive deflection at the junction of the QRS complex and ST segment. What is this finding called?",
        options: [
          "Delta wave (Wolff-Parkinson-White syndrome)",
          "J-wave or Osborn wave (hypothermia)",
          "U-wave (hypokalemia)",
          "ST elevation (myocardial infarction)"
        ],
        correct: 1,
        rationale: "The J-wave (Osborn wave) is a pathognomonic ECG finding in hypothermia, appearing as a positive deflection at the J-point (the junction of the QRS complex and ST segment). The amplitude of the J-wave increases as core temperature decreases. A delta wave is seen in Wolff-Parkinson-White syndrome, U-waves suggest hypokalemia, and ST elevation indicates myocardial injury."
      },
      {
        question: "A severely hypothermic patient (core temperature 26 degrees C) needs to be repositioned. Which nursing principle is MOST important during this intervention?",
        options: [
          "Reposition quickly to minimize heat loss from exposed skin",
          "Handle the patient with extreme gentleness to avoid triggering ventricular fibrillation",
          "Vigorously rub the extremities to promote circulation and warming",
          "Apply warm heating pads directly to all extremities"
        ],
        correct: 1,
        rationale: "The hypothermic myocardium is extremely irritable, and rough handling, jarring movements, or vigorous manipulation can trigger lethal ventricular fibrillation. Gentle handling with log-roll technique is essential. Vigorous rubbing of extremities is contraindicated as it can cause peripheral vasodilation, afterdrop, and tissue damage. Heating pads should be applied to the trunk, not extremities, to avoid rewarming shock."
      }
    ]
  },

  "hypovolemic-shock-basics-rpn": {
    title: "Hypovolemic Shock Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hypovolemic Shock",
      content: "Hypovolemic shock is a life-threatening condition resulting from inadequate circulating blood volume or plasma volume, leading to decreased cardiac output, inadequate tissue perfusion, and ultimately cellular hypoxia and organ dysfunction. It is the most common type of shock encountered in clinical practice and can be classified as hemorrhagic (caused by blood loss) or non-hemorrhagic (caused by fluid loss without bleeding). Hemorrhagic causes include trauma (the leading cause of hemorrhagic shock), gastrointestinal bleeding (upper GI from peptic ulcers, esophageal varices; lower GI from diverticular bleeding, malignancy), surgical bleeding, obstetric hemorrhage (placenta previa, placental abruption, postpartum hemorrhage), and ruptured aneurysm. Non-hemorrhagic causes include severe dehydration from vomiting, diarrhea, or inadequate fluid intake; extensive burns (plasma loss through damaged capillary beds into interstitial space -- third-spacing); severe pancreatitis (massive third-space fluid shifts); diabetic ketoacidosis (osmotic diuresis); excessive diuretic use; and adrenal crisis. The pathophysiology of hypovolemic shock follows a predictable progression driven by the relationship between blood volume and cardiac output. According to the Frank-Starling mechanism, cardiac output is directly proportional to ventricular preload (the volume of blood returning to the heart). When circulating volume decreases, venous return drops, ventricular filling decreases (reduced preload), stroke volume falls, and cardiac output declines. The body activates powerful compensatory mechanisms to maintain blood pressure and vital organ perfusion. The sympathetic nervous system responds within seconds, releasing catecholamines (epinephrine and norepinephrine) that increase heart rate (chronotropic effect), increase myocardial contractility (inotropic effect), and cause selective vasoconstriction of peripheral, splanchnic, and renal vascular beds to redirect blood to the heart and brain. The renin-angiotensin-aldosterone system (RAAS) is activated by decreased renal perfusion, producing angiotensin II (a potent vasoconstrictor) and aldosterone (which promotes sodium and water retention in the distal tubule). Antidiuretic hormone (ADH/vasopressin) is released from the posterior pituitary in response to decreased blood volume detected by baroreceptors and increased plasma osmolality, promoting water reabsorption in the renal collecting ducts. Hypovolemic shock is staged by the American College of Surgeons based on the volume of blood loss in hemorrhagic shock: Class I (up to 750 mL or less than 15% blood volume) where vital signs are essentially normal and compensatory mechanisms are fully effective; Class II (750-1500 mL or 15-30% blood volume) where tachycardia develops, pulse pressure narrows (diastolic pressure rises from vasoconstriction while systolic drops slightly), mild anxiety appears, and urine output decreases to 20-30 mL/hour; Class III (1500-2000 mL or 30-40% blood volume) where significant tachycardia occurs (heart rate above 120), systolic blood pressure falls, confusion develops, capillary refill exceeds 2 seconds, and urine output drops below 15-20 mL/hour; and Class IV (greater than 2000 mL or more than 40% blood volume) where lethal hemorrhage produces profound hypotension, tachycardia above 140, altered consciousness or obtundation, negligible urine output, cold mottled extremities, and absent peripheral pulses. Mean arterial pressure (MAP) is the key hemodynamic parameter for assessing tissue perfusion adequacy: MAP equals diastolic pressure plus one-third of the pulse pressure (systolic minus diastolic), and a MAP below 65 mmHg indicates inadequate organ perfusion requiring immediate intervention. The shock index (heart rate divided by systolic blood pressure) is another rapid assessment tool: a value greater than 1.0 suggests significant hypovolemia. The practical nurse must recognize early compensatory signs of hypovolemic shock (tachycardia, narrowed pulse pressure, anxiety, cool extremities) before decompensation occurs, because hypotension is a LATE sign indicating that compensatory mechanisms have been overwhelmed and approximately 30% or more of blood volume has been lost."
    },
    riskFactors: [
      "Trauma with hemorrhage (motor vehicle accidents, penetrating injuries, falls -- the leading cause of hemorrhagic hypovolemic shock)",
      "Gastrointestinal bleeding (peptic ulcer disease, esophageal varices, diverticular bleeding, malignancy)",
      "Obstetric complications (placenta previa, placental abruption, uterine atony causing postpartum hemorrhage)",
      "Severe dehydration from prolonged vomiting, diarrhea, or inadequate oral intake (particularly in elderly and pediatric populations)",
      "Major burns exceeding 20% total body surface area (massive plasma fluid loss through damaged capillary beds)",
      "Anticoagulant or antiplatelet therapy (warfarin, heparin, DOACs, aspirin, clopidogrel increase hemorrhage risk and severity)",
      "Recent surgery or invasive procedures (risk of surgical bleeding, hematoma formation, or occult hemorrhage)"
    ],
    diagnostics: [
      "Complete blood count (CBC): hemoglobin and hematocrit may initially be NORMAL in acute hemorrhage (hemodilution has not yet occurred); serial measurements every 4-6 hours are essential to detect downward trends",
      "Type and crossmatch: essential for blood transfusion preparation in hemorrhagic shock; type O-negative (universal donor) used in emergency when crossmatch is not available",
      "Arterial blood gas (ABG): metabolic acidosis with elevated lactate indicates anaerobic metabolism from tissue hypoperfusion; base deficit correlates with severity of shock",
      "Serum lactate level: elevated lactate (above 2 mmol/L) is an early marker of tissue hypoperfusion and anaerobic metabolism; lactate clearance (decrease over time) is used to monitor response to resuscitation",
      "Basic metabolic panel (BMP): BUN and creatinine evaluate renal perfusion; BUN-to-creatinine ratio above 20:1 suggests prerenal azotemia (decreased renal blood flow); potassium may be elevated from tissue ischemia",
      "Coagulation studies (PT, INR, PTT, fibrinogen): assess for coagulopathy, particularly in massive hemorrhage; disseminated intravascular coagulation (DIC) can develop from tissue injury and hypoperfusion"
    ],
    management: [
      "Establish two large-bore IV access sites (14-16 gauge) immediately; large-bore access is essential for rapid fluid resuscitation -- flow rate is determined by catheter diameter, not vein size",
      "Initiate crystalloid resuscitation with normal saline or lactated Ringers: initial bolus of 1-2 liters warmed to 37-40 degrees C in adults, reassess after each bolus; persistent hypotension after 2-3 liters of crystalloid suggests need for blood products",
      "Control the source of hemorrhage: apply direct pressure to external wounds, assist with tourniquet application for extremity hemorrhage, and prepare for surgical intervention for internal hemorrhage",
      "Administer packed red blood cells (PRBCs) as prescribed for hemorrhagic shock; in massive transfusion protocols, blood products are given in balanced ratios (1:1:1 ratio of PRBCs to fresh frozen plasma to platelets)",
      "Position patient in modified Trendelenburg (legs elevated 20-30 degrees with trunk flat) to promote venous return; avoid full Trendelenburg as it impairs diaphragmatic excursion",
      "Monitor MAP continuously; target MAP greater than or equal to 65 mmHg to ensure adequate organ perfusion; report MAP below 65 mmHg immediately",
      "Insert indwelling urinary catheter as ordered to monitor hourly urine output; minimum acceptable output is 0.5 mL/kg/hour (approximately 30 mL/hour in adults) -- urine output is the best indicator of renal perfusion and end-organ function"
    ],
    nursingActions: [
      "Assess vital signs every 5-15 minutes during active shock; recognize tachycardia as the EARLIEST sign of hypovolemic shock (occurs before blood pressure drops due to compensatory sympathetic activation)",
      "Monitor level of consciousness using AVPU scale (Alert, Voice responsive, Pain responsive, Unresponsive) or Glasgow Coma Scale every 15-30 minutes; deterioration indicates worsening cerebral perfusion",
      "Monitor and document hourly urine output; report output below 0.5 mL/kg/hour (approximately 30 mL/hour) as this indicates inadequate renal perfusion and failing compensation",
      "Assess skin color, temperature, moisture, and capillary refill: cool, pale, clammy skin with capillary refill exceeding 2 seconds indicates peripheral vasoconstriction and inadequate perfusion",
      "Monitor hemoglobin, hematocrit, and lactate trends rather than single values; a dropping hemoglobin trend confirms ongoing blood loss even if initial values appeared normal",
      "Keep patient warm with warmed blankets and warmed IV fluids; hypothermia worsens coagulopathy (the 'lethal triad' in trauma is hypothermia, acidosis, and coagulopathy)",
      "Prepare for and assist with blood transfusion: verify blood product with two identifiers, monitor for transfusion reactions (fever, chills, urticaria, dyspnea, back pain), take vital signs per protocol (baseline, 15 minutes, 30 minutes, hourly, and completion)"
    ],
    assessmentFindings: [
      "Tachycardia (earliest vital sign change in hypovolemic shock) with weak, thready peripheral pulses; narrowed pulse pressure as compensatory vasoconstriction raises diastolic pressure",
      "Cool, pale, clammy skin from peripheral vasoconstriction; mottled or cyanotic extremities in advanced shock; capillary refill greater than 2 seconds",
      "Hypotension (systolic blood pressure below 90 mmHg or MAP below 65 mmHg) -- this is a LATE sign indicating decompensation and at least 30% blood volume loss",
      "Decreased level of consciousness progressing from anxiety and restlessness (early) to confusion and lethargy (moderate) to obtundation and unresponsiveness (severe)",
      "Oliguria (urine output below 0.5 mL/kg/hour) from decreased renal perfusion; anuria indicates severe renal hypoperfusion",
      "Tachypnea (respiratory rate above 20/min) from metabolic acidosis stimulating chemoreceptors and from compensatory hyperventilation to maintain oxygen delivery",
      "Thirst and dry mucous membranes; flat jugular veins (low central venous pressure); collapsed peripheral veins"
    ],
    signs: {
      left: [
        "Tachycardia with narrowed pulse pressure",
        "Cool, pale skin with delayed capillary refill",
        "Restlessness and mild anxiety",
        "Increased thirst and dry mucous membranes",
        "Mild decrease in urine output",
        "Tachypnea (respiratory rate 20-30/min)"
      ],
      right: [
        "Systolic blood pressure below 80 mmHg (decompensated shock)",
        "MAP below 65 mmHg with organ dysfunction",
        "Unresponsive or obtunded mental status",
        "Anuria (no urine output)",
        "Cardiac arrest (pulseless electrical activity or asystole)",
        "Disseminated intravascular coagulation (DIC) with uncontrollable bleeding"
      ]
    },
    medications: [
      {
        name: "Normal Saline 0.9% (NS) or Lactated Ringers (LR)",
        type: "Isotonic crystalloid resuscitation fluid",
        action: "Expands intravascular volume by providing isotonic fluid that distributes throughout the extracellular compartment; approximately 25% of infused crystalloid remains in the intravascular space while 75% shifts to the interstitial space; restores preload, improves venous return and cardiac output through the Frank-Starling mechanism, and supports blood pressure and organ perfusion",
        sideEffects: "Fluid overload (pulmonary edema, peripheral edema); NS: hyperchloremic metabolic acidosis with large volumes; LR: avoid in hyperkalemia (contains potassium), avoid in severe liver disease (lactate metabolism impaired); dilutional coagulopathy with massive crystalloid resuscitation; hypothermia if not warmed before infusion",
        contra: "Decompensated heart failure (use cautiously with frequent reassessment); avoid LR in patients with hyperkalemia or severe hepatic failure; warm all fluids to 37-40 degrees C before infusion to prevent hypothermia",
        pearl: "Lactated Ringers is generally preferred for large-volume resuscitation because it is more physiologic and causes less hyperchloremic acidosis than NS; however, NS is preferred when hyperkalemia is present; warmed fluids are essential to prevent hypothermia which worsens the lethal triad (hypothermia, acidosis, coagulopathy)"
      },
      {
        name: "Norepinephrine (Levophed)",
        type: "Vasopressor (alpha-1 and beta-1 adrenergic agonist)",
        action: "Potent alpha-1 adrenergic agonist causing peripheral vasoconstriction that increases systemic vascular resistance and raises blood pressure; also has beta-1 agonist effects that increase myocardial contractility and heart rate; used as a vasopressor when adequate fluid resuscitation alone cannot maintain MAP above 65 mmHg",
        sideEffects: "Severe hypertension if dose is excessive, reflex bradycardia, tissue ischemia from excessive vasoconstriction (mesenteric, renal, and digital ischemia), cardiac dysrhythmias, extravasation causes severe tissue necrosis (administer via central line whenever possible)",
        contra: "Hypovolemia (volume resuscitation must be initiated before or concurrently with vasopressors -- vasopressors alone in hypovolemia worsen tissue ischemia by constricting already underperfused vascular beds); mesenteric or peripheral vascular thrombosis",
        pearl: "Norepinephrine is the first-line vasopressor for shock states when fluid resuscitation alone is insufficient to maintain MAP above 65 mmHg; MUST be given through a central venous catheter whenever possible because extravasation from a peripheral IV causes severe tissue necrosis; if peripheral administration is necessary, use a large proximal vein and monitor the site continuously; phentolamine is the antidote for norepinephrine extravasation"
      },
      {
        name: "Packed Red Blood Cells (PRBCs)",
        type: "Blood product (oxygen-carrying capacity replacement)",
        action: "Replaces lost red blood cells to restore oxygen-carrying capacity; each unit of PRBCs (approximately 300 mL) raises hemoglobin by approximately 10 g/L (1 g/dL) and hematocrit by approximately 3%; restores oxygen delivery to hypoxic tissues that are metabolizing anaerobically in hemorrhagic shock",
        sideEffects: "Transfusion reactions (acute hemolytic, febrile non-hemolytic, allergic/urticarial, transfusion-related acute lung injury [TRALI], transfusion-associated circulatory overload [TACO]); hypothermia if not warmed; hyperkalemia from stored blood; citrate toxicity with massive transfusion (citrate binds calcium causing hypocalcemia)",
        contra: "Must verify ABO/Rh compatibility (fatal hemolytic reaction if incompatible); Jehovah's Witness patients (respect patient refusal of blood products); in non-hemorrhagic hypovolemic shock, crystalloid and colloid solutions are preferred",
        pearl: "In massive hemorrhage (Class III-IV shock), follow massive transfusion protocol with balanced 1:1:1 ratio of PRBCs to fresh frozen plasma to platelets to prevent dilutional coagulopathy; always use blood warmer for rapid transfusion; monitor for hypocalcemia (from citrate in stored blood) and treat with IV calcium if ionized calcium drops; two-nurse verification of patient identity and blood product is MANDATORY before transfusion"
      }
    ],
    pearls: [
      "Tachycardia is the EARLIEST vital sign change in hypovolemic shock -- it occurs as a compensatory mechanism before blood pressure drops; do not wait for hypotension to intervene, because hypotension indicates decompensation and at least 30% volume loss",
      "Urine output is the BEST clinical indicator of renal perfusion and end-organ function in shock -- minimum acceptable output is 0.5 mL/kg/hour (approximately 30 mL/hour in adults); decreasing urine output is an early sign of inadequate resuscitation",
      "The 'lethal triad' in hemorrhagic shock is hypothermia, acidosis, and coagulopathy -- each worsens the others in a vicious cycle; keep the patient warm, correct acidosis with adequate resuscitation, and monitor coagulation studies closely",
      "Initial hemoglobin and hematocrit may be NORMAL in acute hemorrhage because both red blood cells and plasma are lost proportionally; hemodilution has not yet occurred; serial measurements every 4-6 hours are essential to detect the true extent of blood loss",
      "Two large-bore peripheral IVs (14-16 gauge) provide faster flow rates than a central venous catheter -- flow rate is determined by catheter length and diameter (Poiseuille's law), not by vein size; short, wide-bore peripheral IVs are ideal for rapid volume resuscitation",
      "Vasopressors (norepinephrine) should NEVER be the sole treatment for hypovolemic shock -- fluid volume must be replaced first; vasopressors in unresuscitated hypovolemia worsen tissue ischemia by constricting already underperfused vascular beds",
      "MAP (mean arterial pressure) below 65 mmHg indicates inadequate organ perfusion -- calculate MAP as: diastolic pressure + 1/3 (systolic minus diastolic); or use the electronic monitor value; report MAP below 65 mmHg immediately and prepare for escalation of resuscitation"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a trauma patient who is anxious, with a heart rate of 118 beats/min, blood pressure 108/86 mmHg, and cool, clammy skin. The blood pressure appears relatively stable. What is the MOST important vital sign finding that suggests early hypovolemic shock?",
        options: [
          "Blood pressure of 108/86 mmHg",
          "Tachycardia of 118 beats/min with narrowed pulse pressure",
          "Normal respiratory rate of 18 breaths/min",
          "Oral temperature of 36.8 degrees C"
        ],
        correct: 1,
        rationale: "Tachycardia is the earliest vital sign change in hypovolemic shock, occurring before hypotension due to compensatory sympathetic nervous system activation. The narrowed pulse pressure (108-86 = 22 mmHg, normal is 30-40 mmHg) indicates peripheral vasoconstriction raising diastolic pressure. Hypotension is a LATE sign, so waiting for blood pressure to drop would delay critical intervention."
      },
      {
        question: "A patient in hypovolemic shock has received 2 liters of warmed normal saline but remains hypotensive with a MAP of 58 mmHg. The hemoglobin is 62 g/L. Which intervention should the practical nurse anticipate NEXT?",
        options: [
          "Continue crystalloid infusion at the same rate",
          "Prepare for packed red blood cell transfusion",
          "Restrict all IV fluids to prevent fluid overload",
          "Administer oral rehydration solution"
        ],
        correct: 1,
        rationale: "Persistent hypotension after 2-3 liters of crystalloid in hemorrhagic shock with a hemoglobin of 62 g/L (critically low, normal 120-160 g/L) indicates the need for blood product transfusion. PRBCs restore oxygen-carrying capacity that crystalloid cannot provide. Continuing crystalloid alone will cause dilutional coagulopathy and cannot address the oxygen-carrying deficit."
      },
      {
        question: "The practical nurse is monitoring urine output in a patient being resuscitated for hypovolemic shock. Which hourly urine output would indicate INADEQUATE resuscitation and require immediate reporting?",
        options: [
          "45 mL/hour",
          "60 mL/hour",
          "15 mL/hour",
          "35 mL/hour"
        ],
        correct: 2,
        rationale: "Minimum acceptable urine output is 0.5 mL/kg/hour (approximately 30 mL/hour in a 70 kg adult). A urine output of 15 mL/hour indicates inadequate renal perfusion and failing resuscitation, requiring immediate escalation of interventions. Urine output of 35, 45, and 60 mL/hour all meet the minimum threshold."
      }
    ]
  },

  "hyperemesis-gravidarum-rpn": {
    title: "Hyperemesis Gravidarum for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hyperemesis Gravidarum",
      content: "Hyperemesis gravidarum (HG) is a severe, debilitating form of nausea and vomiting during pregnancy that extends beyond the typical 'morning sickness' experienced by 70-80% of pregnant women. While normal pregnancy-related nausea and vomiting (NVP) typically resolves by 12-14 weeks of gestation and does not cause significant weight loss or metabolic derangement, hyperemesis gravidarum is characterized by persistent, intractable vomiting that leads to weight loss exceeding 5% of pre-pregnancy body weight, dehydration, electrolyte imbalances, nutritional deficiencies, and ketonuria. HG affects approximately 0.3-3% of pregnancies and is the most common indication for hospitalization in the first trimester. The exact etiology of hyperemesis gravidarum is multifactorial and not fully understood, but the primary driver is believed to be elevated levels of human chorionic gonadotropin (hCG), which peaks between 8-12 weeks of gestation and directly stimulates the chemoreceptor trigger zone (CTZ) in the area postrema of the medulla oblongata. Conditions associated with higher hCG levels -- molar pregnancy (gestational trophoblastic disease), multiple gestations (twins, triplets), and female fetus -- carry increased HG risk. Estrogen and progesterone also contribute to nausea by relaxing the lower esophageal sphincter (promoting gastroesophageal reflux), decreasing gastric motility, and altering olfactory sensitivity (heightened sense of smell triggers nausea). Thyroid stimulation occurs because the alpha subunit of hCG is structurally similar to thyroid-stimulating hormone (TSH), so very high hCG levels can stimulate thyroid receptors, causing transient gestational thyrotoxicosis (elevated free T4 with suppressed TSH) in up to 60% of HG patients. Helicobacter pylori infection has also been associated with increased HG severity in some studies. The metabolic consequences of hyperemesis gravidarum are significant and cascade through multiple organ systems. Persistent vomiting causes loss of hydrochloric acid (HCl) from the stomach, resulting in metabolic alkalosis, hypochloremia, and hypokalemia (the kidneys excrete potassium in exchange for hydrogen ions to compensate for alkalosis). Severe dehydration leads to hemoconcentration (elevated hematocrit), prerenal azotemia (elevated BUN with normal creatinine), concentrated urine with ketonuria (the body catabolizes fat for energy when oral intake is inadequate, producing ketone bodies), and orthostatic hypotension. Nutritional deficiencies develop from prolonged inability to eat or retain food. The most dangerous nutritional consequence is thiamine (vitamin B1) deficiency, which can cause Wernicke encephalopathy -- a neurological emergency characterized by the classic triad of confusion (encephalopathy), ophthalmoplegia (eye movement paralysis, particularly lateral rectus palsy causing nystagmus), and ataxia (gait instability). Wernicke encephalopathy is a medical emergency because untreated cases can progress to Korsakoff syndrome, a permanent and irreversible condition characterized by severe anterograde amnesia and confabulation. Therefore, thiamine supplementation is MANDATORY before administering any glucose-containing IV fluids (dextrose) to malnourished HG patients, because glucose metabolism consumes thiamine, and administering dextrose without thiamine in a thiamine-depleted patient can precipitate acute Wernicke encephalopathy. Other nutritional deficiencies in prolonged HG include vitamin B6 (pyridoxine), vitamin B12, folate, and zinc. The Pregnancy-Unique Quantification of Emesis (PUQE) scoring system is used to assess HG severity, incorporating the number of hours of nausea per day, number of vomiting episodes per day, and number of retching episodes per day. The practical nurse plays a critical role in maintaining accurate intake and output records, monitoring weight trends, assessing hydration status, testing urine for ketones, administering antiemetics safely (considering teratogenic risk), ensuring thiamine is given before dextrose, providing emotional support, and reporting signs of Wernicke encephalopathy immediately."
    },
    riskFactors: [
      "Previous pregnancy complicated by hyperemesis gravidarum (recurrence rate approximately 15-20%)",
      "Molar pregnancy (gestational trophoblastic disease) producing very high hCG levels",
      "Multiple gestation (twins, triplets) with proportionally higher hCG production",
      "Female fetus (associated with higher hCG levels compared to male fetus pregnancies)",
      "History of motion sickness or migraine headaches (suggests increased vestibular and CTZ sensitivity)",
      "Family history of hyperemesis gravidarum in mother or sisters (genetic predisposition component)",
      "Helicobacter pylori infection (associated with increased severity of nausea and vomiting in pregnancy)"
    ],
    diagnostics: [
      "Urinalysis: ketonuria (ketones in urine indicate that the body is catabolizing fat stores due to inadequate carbohydrate intake), specific gravity elevated (above 1.030 indicating concentrated urine from dehydration)",
      "Basic metabolic panel: hypokalemia (from vomiting and renal compensation for metabolic alkalosis), hypochloremia (loss of HCl in vomitus), elevated BUN with normal creatinine (prerenal azotemia from dehydration, BUN:creatinine ratio above 20:1)",
      "Complete blood count: elevated hematocrit from hemoconcentration; evaluate for anemia from nutritional deficiency in prolonged HG",
      "Thyroid function tests: transient gestational thyrotoxicosis (suppressed TSH, elevated free T4) occurs in up to 60% of HG patients due to hCG cross-reactivity with TSH receptors; this is self-limiting and does not require antithyroid treatment",
      "Liver function tests (AST, ALT): mildly elevated transaminases occur in approximately 50% of hospitalized HG patients; significant elevation should prompt evaluation for other hepatic pathology",
      "Obstetric ultrasound: rules out molar pregnancy (gestational trophoblastic disease) and identifies multiple gestation; both conditions are associated with very high hCG levels and increased HG risk"
    ],
    management: [
      "IV fluid resuscitation with normal saline or lactated Ringers to correct dehydration; add potassium chloride (20-40 mEq/L) once urine output is established to correct hypokalemia",
      "Administer thiamine (vitamin B1) 100 mg IV BEFORE giving any dextrose-containing IV fluids to prevent Wernicke encephalopathy in malnourished patients -- this is a critical safety step",
      "Antiemetic therapy in stepwise approach: first-line pyridoxine-doxylamine (Diclectin/Diclegis), then ondansetron, then metoclopramide; severity determines route (IV for patients who cannot tolerate oral medications)",
      "NPO initially with gradual reintroduction of clear liquids, then bland foods in small frequent meals; the BRAT diet (bananas, rice, applesauce, toast) is well tolerated during recovery",
      "Monitor daily weight, strict intake and output, and urine ketones every void to assess response to treatment and guide fluid management",
      "Emotional support and reassurance: HG causes significant psychological distress, depression, and anxiety; validate the patient's experience and provide referrals to support resources",
      "Consider enteral nutrition (nasogastric tube feeding) or parenteral nutrition (total parenteral nutrition via PICC line) if oral intake remains inadequate after 48-72 hours of IV antiemetic therapy"
    ],
    nursingActions: [
      "Maintain strict intake and output records; measure and document all oral intake, IV fluids administered, emesis volume, and urine output every shift",
      "Test urine for ketones with each void using urine dipstick; report persistent ketonuria as it indicates ongoing starvation physiology and inadequate caloric intake",
      "Weigh patient daily at the same time, wearing the same clothing, using the same scale; report weight loss exceeding 5% of pre-pregnancy weight",
      "Administer thiamine IV or IM BEFORE any dextrose-containing fluids; this is a critical safety measure to prevent precipitating Wernicke encephalopathy in a thiamine-depleted patient",
      "Assess for signs of Wernicke encephalopathy: confusion or altered mental status, nystagmus or ophthalmoplegia (inability to move eyes laterally), ataxia (unsteady gait) -- report any of these findings as a medical emergency",
      "Provide a calm, odor-free environment: remove food trays promptly, avoid strong-smelling foods, ensure adequate ventilation, and minimize noxious stimuli that trigger nausea",
      "Monitor fetal heart tones as ordered; dehydration and metabolic derangement can affect fetal well-being; report non-reassuring fetal heart rate patterns immediately"
    ],
    assessmentFindings: [
      "Persistent vomiting exceeding 3-4 times daily that does not respond to standard dietary modifications; inability to keep any food or fluids down for 24+ hours",
      "Weight loss exceeding 5% of pre-pregnancy body weight; sunken eyes, dry mucous membranes, decreased skin turgor indicating moderate-to-severe dehydration",
      "Ketonuria on urine dipstick (indicates fat catabolism from carbohydrate deficit); concentrated dark urine with elevated specific gravity",
      "Orthostatic hypotension and tachycardia from intravascular volume depletion; dizziness and lightheadedness upon standing",
      "Ptyalism (excessive salivation) often accompanies severe nausea; the patient may carry a container to spit into because swallowing saliva triggers further nausea",
      "Emotional distress, crying, feelings of helplessness, and withdrawal from social activities; HG significantly impacts quality of life and maternal mental health",
      "Epigastric pain or tenderness from repeated vomiting, esophageal irritation, or Mallory-Weiss tear (mucosal tear at the gastroesophageal junction from forceful retching)"
    ],
    signs: {
      left: [
        "Nausea and vomiting exceeding normal pregnancy pattern",
        "Mild weight loss (2-5% of pre-pregnancy weight)",
        "Mild dehydration (dry lips, thirst, concentrated urine)",
        "Fatigue and inability to maintain normal activities",
        "Food aversions and heightened sense of smell",
        "Mild ketonuria (trace to small on urine dipstick)"
      ],
      right: [
        "Wernicke encephalopathy (confusion, ophthalmoplegia, ataxia)",
        "Severe dehydration with hemodynamic instability (tachycardia, hypotension)",
        "Severe hypokalemia causing cardiac dysrhythmias",
        "Mallory-Weiss tear with hematemesis (vomiting blood)",
        "Esophageal rupture (Boerhaave syndrome) from violent retching",
        "Non-reassuring fetal heart rate patterns from maternal dehydration"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone (CTZ) of the area postrema and on vagal afferent nerve terminals in the gastrointestinal tract, preventing serotonin-mediated activation of the vomiting reflex; does not cross the blood-brain barrier significantly, so it has minimal sedating and extrapyramidal effects compared to dopamine antagonist antiemetics",
        sideEffects: "Headache (most common), constipation, dizziness, dose-dependent QT prolongation (risk of torsades de pointes at high doses); potential slight increase in cleft palate risk when used in first trimester (debated in literature)",
        contra: "Congenital long QT syndrome; concurrent use with other QT-prolonging medications; use in first trimester requires careful risk-benefit discussion (second-line after pyridoxine-doxylamine); maximum single IV dose 16 mg",
        pearl: "Ondansetron is commonly used as second-line antiemetic in HG when pyridoxine-doxylamine is insufficient; available in oral, sublingual (ODT), and IV formulations; the ODT (orally disintegrating tablet) dissolves on the tongue without water, making it useful when patients cannot swallow pills; obtain baseline ECG before IV administration in patients with cardiac history"
      },
      {
        name: "Pyridoxine-Doxylamine (Diclectin/Diclegis)",
        type: "Antiemetic combination (vitamin B6 + antihistamine)",
        action: "Pyridoxine (vitamin B6) is a cofactor in amino acid metabolism and neurotransmitter synthesis; its exact antiemetic mechanism is unclear but may involve modulation of serotonin pathways in the CTZ. Doxylamine is an H1-antihistamine that blocks histamine receptors in the vestibular system and vomiting center, reducing nausea signals; the combination is synergistic and is the only FDA/Health Canada approved medication specifically indicated for nausea and vomiting of pregnancy",
        sideEffects: "Drowsiness and sedation (most common, from the antihistamine component), dry mouth, blurred vision, constipation, urinary retention; drowsiness typically diminishes after several days of use",
        contra: "Known hypersensitivity to either component; concurrent use with monoamine oxidase inhibitors (MAOIs); use caution in patients with urinary retention, narrow-angle glaucoma, or asthma",
        pearl: "This is the FIRST-LINE antiemetic for nausea and vomiting of pregnancy because it has the most extensive safety data and is the only combination specifically approved for this indication; the delayed-release tablet should be taken at bedtime (2 tablets), with 1 tablet in the morning and 1 at mid-afternoon if needed; maximum 4 tablets per day; advise patients that drowsiness is common initially but usually improves"
      },
      {
        name: "Thiamine (Vitamin B1) IV",
        type: "Water-soluble B-complex vitamin (essential cofactor)",
        action: "Serves as an essential cofactor for three critical enzymes in carbohydrate metabolism: pyruvate dehydrogenase (converts pyruvate to acetyl-CoA for entry into the citric acid cycle), alpha-ketoglutarate dehydrogenase (citric acid cycle enzyme), and transketolase (pentose phosphate pathway for nucleotide synthesis); without thiamine, cells cannot perform aerobic glucose metabolism, leading to energy failure particularly in the brain (which is highly dependent on glucose oxidation), mammillary bodies, thalamus, and cerebellum -- the areas affected in Wernicke encephalopathy",
        sideEffects: "Generally well tolerated; rare anaphylaxis with IV administration (more common with rapid injection); warmth, flushing, and mild discomfort at injection site; IV administration should be slow (over 30 minutes) in a dilute solution",
        contra: "Known hypersensitivity to thiamine (extremely rare); no significant drug interactions; considered safe in pregnancy (Category A)",
        pearl: "CRITICAL SAFETY RULE: Thiamine MUST be administered BEFORE any dextrose-containing IV fluids in patients with prolonged vomiting, malnutrition, or alcohol use disorder; administering glucose to a thiamine-depleted patient causes acute depletion of remaining thiamine stores because glucose metabolism consumes thiamine, and this can precipitate acute Wernicke encephalopathy; give 100 mg IV thiamine before D5W or any dextrose infusion; this applies to ALL malnourished patients, not only those with alcohol use disorder"
      }
    ],
    pearls: [
      "Hyperemesis gravidarum is distinguished from normal pregnancy nausea by weight loss exceeding 5% of pre-pregnancy weight, ketonuria, and inability to maintain adequate oral intake -- it is NOT simply 'bad morning sickness' but a potentially dangerous condition requiring medical intervention",
      "CRITICAL SAFETY RULE: Always administer thiamine (vitamin B1) BEFORE any dextrose-containing IV fluids in HG patients -- administering glucose without thiamine in a thiamine-depleted patient can precipitate Wernicke encephalopathy, which can progress to permanent brain damage (Korsakoff syndrome)",
      "Wernicke encephalopathy triad: confusion, ophthalmoplegia (nystagmus, lateral rectus palsy), and ataxia -- if a vomiting pregnant patient develops ANY of these neurological findings, report immediately as this is a medical emergency requiring urgent thiamine replacement",
      "Pyridoxine-doxylamine (Diclectin/Diclegis) is the FIRST-LINE antiemetic for pregnancy nausea because it has the most extensive safety data of any antiemetic studied in pregnancy; ondansetron is second-line",
      "Always test urine for ketones in HG patients -- ketonuria indicates the body is catabolizing fat stores for energy because carbohydrate intake is insufficient; persistent ketonuria despite treatment indicates the patient needs more aggressive nutritional support",
      "Transient gestational thyrotoxicosis (elevated free T4, suppressed TSH) occurs in up to 60% of HG patients due to structural similarity between hCG and TSH molecules -- this is self-limiting and does NOT require antithyroid medication; it resolves as hCG levels decline",
      "Provide emotional support: HG significantly impacts maternal mental health, social functioning, and quality of life; patients may feel dismissed or told their symptoms are psychological; validate their experience and screen for depression and anxiety"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing IV fluids for a patient with hyperemesis gravidarum who has been unable to eat for 5 days. The physician orders D5NS (5% dextrose in normal saline). Which medication must be administered BEFORE starting the dextrose-containing fluid?",
        options: [
          "Ondansetron (Zofran) to prevent further vomiting",
          "Thiamine (vitamin B1) to prevent Wernicke encephalopathy",
          "Calcium gluconate to prevent hypocalcemia",
          "Metoclopramide (Reglan) to increase gastric motility"
        ],
        correct: 1,
        rationale: "Thiamine (vitamin B1) must ALWAYS be given before dextrose-containing IV fluids in malnourished patients. After 5 days of inability to eat, thiamine stores are likely depleted. Administering glucose without thiamine causes acute consumption of remaining thiamine, potentially precipitating Wernicke encephalopathy (confusion, ophthalmoplegia, ataxia), which can progress to permanent Korsakoff syndrome."
      },
      {
        question: "A pregnant patient at 10 weeks gestation has been vomiting 8-10 times daily, has lost 4 kg (8% of pre-pregnancy weight), and has 3+ ketonuria. Which finding BEST differentiates hyperemesis gravidarum from normal pregnancy nausea and vomiting?",
        options: [
          "Nausea occurring primarily in the morning hours",
          "Vomiting that began during the first trimester",
          "Weight loss exceeding 5% of pre-pregnancy weight with ketonuria",
          "Food aversions and heightened sense of smell"
        ],
        correct: 2,
        rationale: "Weight loss exceeding 5% of pre-pregnancy weight combined with ketonuria distinguishes hyperemesis gravidarum from normal pregnancy nausea and vomiting. Normal NVP does not cause significant weight loss or metabolic derangement. Morning timing, first-trimester onset, and food aversions are common in normal pregnancy nausea and are not specific to HG."
      },
      {
        question: "The practical nurse is caring for a patient with hyperemesis gravidarum and notices the patient has developed nystagmus (abnormal eye movements), is confused, and has an unsteady gait. What is the PRIORITY nursing action?",
        options: [
          "Administer the next scheduled dose of ondansetron",
          "Offer the patient clear liquids and crackers",
          "Report immediately -- these are signs of Wernicke encephalopathy",
          "Document the findings and continue routine monitoring"
        ],
        correct: 2,
        rationale: "Confusion, nystagmus/ophthalmoplegia, and ataxia (unsteady gait) are the classic triad of Wernicke encephalopathy, a neurological emergency caused by thiamine deficiency. This requires immediate reporting and urgent IV thiamine administration. Delayed treatment can result in progression to permanent Korsakoff syndrome (irreversible amnesia and confabulation). This is not a routine finding that can wait."
      }
    ]
  }
};

console.log("Injecting Batch 21 (Endocrine/Emergency) lessons...");
let ok = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
}
console.log(`Done: ${ok}/${Object.keys(lessons).length} injected.`);
