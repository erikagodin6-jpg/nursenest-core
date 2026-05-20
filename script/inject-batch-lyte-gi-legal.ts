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
  "magnesium-imbalance-rpn": {
    title: "Magnesium Imbalance for Practical Nurses",
    cellular: {
      title: "Physiology and Pathophysiology of Magnesium Balance",
      content: "Magnesium is the fourth most abundant cation in the body and the second most abundant intracellular cation after potassium. Approximately 50 to 60 percent of total body magnesium is stored in bone, 39 percent resides within cells (primarily skeletal muscle and soft tissue), and only about 1 percent circulates in the blood. The normal serum magnesium level ranges from 0.70 to 1.05 mmol/L (1.7 to 2.1 mg/dL in some references). Because such a small fraction of total body magnesium is measurable in serum, a patient can have significant intracellular magnesium depletion while still maintaining a serum level that appears low-normal. Magnesium serves as a cofactor for more than 300 enzymatic reactions in the body, including those involved in protein synthesis, neuromuscular function, blood glucose regulation, and blood pressure control. It plays a critical role in maintaining the stability of cell membranes and is essential for the proper function of the sodium-potassium ATPase pump, which maintains the electrochemical gradient across cell membranes. In the neuromuscular system, magnesium acts as a natural calcium channel blocker at the neuromuscular junction, competing with calcium for binding sites and thereby modulating nerve impulse transmission and muscle contraction. When magnesium levels fall (hypomagnesemia), the neuromuscular junction becomes hyperexcitable because the inhibitory effect of magnesium is lost, leading to increased nerve firing, muscle twitching, tremors, and in severe cases, tetany and seizures. Conversely, when magnesium levels rise (hypermagnesemia), neuromuscular transmission is depressed, leading to hyporeflexia, muscle weakness, respiratory depression, and potentially cardiac arrest. Magnesium also directly affects cardiac electrophysiology by stabilizing the resting membrane potential of cardiac cells. Hypomagnesemia prolongs the cardiac action potential and can trigger potentially fatal dysrhythmias, including torsades de pointes, ventricular tachycardia, and ventricular fibrillation. Hypermagnesemia slows cardiac conduction, widens the QRS complex, and can cause heart block and asystole. The kidneys are the primary regulators of magnesium homeostasis, reabsorbing approximately 95 percent of filtered magnesium in the tubules. The loop of Henle is responsible for 60 to 70 percent of magnesium reabsorption, which is why loop diuretics (furosemide) are a major cause of magnesium wasting. The gastrointestinal tract absorbs dietary magnesium primarily in the jejunum and ileum, and conditions that impair GI absorption (chronic diarrhea, malabsorption syndromes, chronic alcohol use) are significant risk factors for hypomagnesemia. There is a critical interrelationship between magnesium and other electrolytes: hypomagnesemia frequently coexists with hypokalemia because magnesium is required for the proper function of the renal potassium channel (ROMK), and hypokalemia is often refractory to correction until magnesium is repleted. Similarly, hypomagnesemia can cause hypocalcemia by impairing parathyroid hormone (PTH) secretion and reducing the skeletal response to PTH."
    },
    riskFactors: [
      "Chronic alcohol use disorder (impaired GI absorption and increased renal magnesium excretion)",
      "Loop diuretic therapy (furosemide, bumetanide -- inhibit magnesium reabsorption in the loop of Henle)",
      "Proton pump inhibitor use for longer than one year (impaired intestinal magnesium absorption)",
      "Chronic diarrhea or malabsorption syndromes (celiac disease, inflammatory bowel disease, short bowel syndrome)",
      "Diabetic ketoacidosis (osmotic diuresis causes significant magnesium wasting)",
      "Chronic kidney disease stages 4-5 (impaired renal magnesium excretion leads to hypermagnesemia)",
      "Excessive magnesium-containing antacid or laxative use (risk of hypermagnesemia especially with renal impairment)"
    ],
    diagnostics: [
      "Serum magnesium level: normal 0.70-1.05 mmol/L; hypomagnesemia below 0.70 mmol/L; hypermagnesemia above 1.05 mmol/L; draw without tourniquet prolonged clenching to avoid hemolysis",
      "12-lead ECG: hypomagnesemia may show prolonged QT interval, ST depression, T wave flattening, torsades de pointes; hypermagnesemia shows prolonged PR interval, widened QRS, heart block",
      "Serum potassium level: hypokalemia frequently accompanies hypomagnesemia and is refractory to potassium replacement until magnesium is corrected",
      "Serum calcium level: hypocalcemia may coexist with hypomagnesemia due to impaired PTH secretion; ionized calcium is more accurate than total calcium",
      "24-hour urine magnesium: distinguishes renal losses (greater than 24 mg/day suggests renal wasting) from GI losses (low urine magnesium with low serum magnesium suggests GI cause)",
      "Serum creatinine and BUN: assess renal function; impaired renal function increases risk of hypermagnesemia with magnesium administration"
    ],
    management: [
      "Hypomagnesemia (mild): oral magnesium oxide 400 mg twice daily or magnesium gluconate; administer with food to minimize GI side effects (diarrhea)",
      "Hypomagnesemia (severe or symptomatic): IV magnesium sulfate 1-2 grams diluted in 100 mL normal saline infused over 1 hour with continuous cardiac monitoring",
      "Hypermagnesemia (mild): discontinue all magnesium-containing medications (antacids, laxatives, supplements) and increase IV fluid administration to promote renal excretion",
      "Hypermagnesemia (severe): IV calcium gluconate 1-2 grams over 5-10 minutes to antagonize cardiac and neuromuscular effects of magnesium; calcium does not lower magnesium levels but counteracts toxicity",
      "Correct concurrent electrolyte abnormalities: replace potassium and calcium as indicated; potassium replacement is often ineffective until magnesium is restored",
      "Monitor strict intake and output; maintain adequate hydration to support renal magnesium excretion in hypermagnesemia",
      "Implement seizure precautions for patients with severe hypomagnesemia (magnesium below 0.50 mmol/L)"
    ],
    nursingActions: [
      "Assess deep tendon reflexes (DTRs) before and during IV magnesium administration -- absent DTRs indicate magnesium toxicity and infusion must be stopped immediately",
      "Monitor respiratory rate every 15 minutes during IV magnesium infusion; hold infusion and notify physician if respiratory rate falls below 12 breaths per minute",
      "Place patient on continuous cardiac monitoring during IV magnesium therapy; report new dysrhythmias, prolonged QT, or widened QRS immediately",
      "Assess for Chvostek sign (facial nerve tapping produces facial twitching) and Trousseau sign (carpal spasm with BP cuff inflation) as indicators of neuromuscular irritability in hypomagnesemia",
      "Ensure calcium gluconate is readily available at the bedside as the antidote for magnesium toxicity before initiating IV magnesium infusion",
      "Monitor urine output hourly during IV magnesium therapy; magnesium is renally excreted and accumulates rapidly if urine output falls below 30 mL/hour",
      "Implement fall precautions for patients with hypermagnesemia due to muscle weakness and sedation, and seizure precautions for patients with severe hypomagnesemia"
    ],
    assessmentFindings: [
      "Hypomagnesemia: muscle cramps, tremors, hyperactive deep tendon reflexes, positive Chvostek and Trousseau signs, paresthesias (tingling and numbness)",
      "Hypomagnesemia: cardiac findings including premature ventricular contractions (PVCs), atrial fibrillation, torsades de pointes, and prolonged QT interval on ECG",
      "Hypomagnesemia: central nervous system irritability manifesting as agitation, confusion, insomnia, hallucinations, and seizures in severe cases",
      "Hypermagnesemia: decreased deep tendon reflexes progressing to absent reflexes (areflexia) as levels rise above 4 mEq/L",
      "Hypermagnesemia: progressive muscle weakness, lethargy, drowsiness, facial flushing, sensation of warmth, nausea and vomiting",
      "Hypermagnesemia: respiratory depression (shallow, slow breathing) progressing to respiratory arrest at very high levels (above 6 mEq/L)",
      "Hypermagnesemia: cardiovascular effects including hypotension, bradycardia, prolonged PR interval, and cardiac arrest in severe cases"
    ],
    signs: {
      left: [
        "Muscle cramps, twitching, or tremors (hypomagnesemia)",
        "Nausea, vomiting, or anorexia",
        "Fatigue and generalized weakness",
        "Paresthesias (tingling in fingers and around mouth)",
        "Mood changes including irritability and confusion",
        "Mild constipation (hypermagnesemia) or diarrhea (oral magnesium therapy)"
      ],
      right: [
        "Seizures (severe hypomagnesemia below 0.50 mmol/L)",
        "Torsades de pointes or ventricular fibrillation (hypomagnesemia)",
        "Absent deep tendon reflexes (magnesium toxicity)",
        "Respiratory depression or arrest (magnesium above 6 mEq/L)",
        "Complete heart block or cardiac arrest (severe hypermagnesemia)",
        "Profound hypotension unresponsive to fluid resuscitation (hypermagnesemia)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate IV (MgSO4)",
        type: "Electrolyte replacement / anticonvulsant",
        action: "Provides exogenous magnesium to restore intracellular and extracellular magnesium stores; stabilizes nerve cell membranes by competing with calcium at the neuromuscular junction, reducing acetylcholine release and decreasing neuromuscular excitability; also used in pre-eclampsia to prevent seizures",
        sideEffects: "Flushing, hypotension, bradycardia, respiratory depression, loss of deep tendon reflexes, diarrhea with oral formulation, hypermagnesemia with excessive dosing",
        contra: "Heart block; myocardial damage; severe renal impairment (GFR below 30 mL/min) without dose adjustment; use with extreme caution in patients receiving concurrent neuromuscular blocking agents",
        pearl: "Always check deep tendon reflexes, respiratory rate (must be above 12), and urine output (must be above 30 mL/hr) before each dose; keep calcium gluconate at bedside as the antidote for magnesium toxicity; IV push must be given slowly (no faster than 150 mg/min) to prevent cardiac arrest"
      },
      {
        name: "Calcium Gluconate",
        type: "Electrolyte replacement / magnesium antagonist",
        action: "Provides calcium ions that directly antagonize the neuromuscular and cardiac effects of excess magnesium by competing for binding sites on cell membranes; restores normal membrane excitability in magnesium toxicity; also treats hypocalcemia that frequently accompanies hypomagnesemia",
        sideEffects: "Hypercalcemia with excessive administration, bradycardia, nausea, tingling sensation, tissue necrosis if extravasation occurs (though less caustic than calcium chloride)",
        contra: "Hypercalcemia; digitalis toxicity (calcium potentiates digoxin effects and may precipitate fatal dysrhythmias); severe hyperphosphatemia (risk of metastatic calcification)",
        pearl: "First-line antidote for magnesium toxicity -- administer 1-2 grams IV over 5-10 minutes; calcium gluconate is preferred over calcium chloride for peripheral IV access because it causes less tissue necrosis if extravasation occurs; does not lower magnesium levels but counteracts toxic effects"
      },
      {
        name: "Aluminum Hydroxide (Amphojel)",
        type: "Antacid / phosphate binder",
        action: "Neutralizes gastric acid and binds dietary phosphate in the GI tract preventing absorption; in the context of hypermagnesemia, used as an alternative to magnesium-containing antacids (Maalox, Milk of Magnesia) in patients with renal impairment who require antacid therapy without adding exogenous magnesium",
        sideEffects: "Constipation (most common), hypophosphatemia with prolonged use leading to bone demineralization, aluminum accumulation in renal failure (risk of aluminum toxicity, encephalopathy, osteomalacia)",
        contra: "Severe renal impairment (risk of aluminum accumulation and toxicity); hypophosphatemia; should not be used long-term in dialysis patients due to aluminum toxicity risk",
        pearl: "When a patient with renal impairment needs an antacid, AVOID magnesium-containing products (Maalox, Milk of Magnesia) and choose aluminum hydroxide instead; monitor phosphorus levels during extended use; administer 1-3 hours after meals for optimal acid neutralization"
      }
    ],
    pearls: [
      "Check deep tendon reflexes (patellar reflex) BEFORE every dose of IV magnesium sulfate -- absent reflexes are the earliest clinical sign of magnesium toxicity and the infusion must be stopped immediately",
      "Hypokalemia that does not respond to potassium replacement is a classic clinical clue to coexisting hypomagnesemia -- always check magnesium when potassium correction fails",
      "Magnesium sulfate is the first-line treatment for torsades de pointes regardless of the patient's magnesium level -- administer 1-2 grams IV over 1-2 minutes in a pulseless patient",
      "The triad of absent deep tendon reflexes, respiratory depression, and hypotension is the hallmark of magnesium toxicity -- respiratory rate below 12 breaths per minute mandates immediate infusion cessation",
      "Chvostek sign (facial twitching when tapping cranial nerve VII in front of the ear) and Trousseau sign (carpal spasm after 3 minutes of blood pressure cuff inflation above systolic pressure) indicate neuromuscular irritability from low magnesium or low calcium",
      "Patients on long-term proton pump inhibitor therapy (longer than one year) should have magnesium levels monitored periodically because PPIs impair intestinal magnesium absorption through a mechanism independent of vitamin D",
      "Calcium gluconate is the antidote for magnesium toxicity -- it does NOT lower magnesium levels but antagonizes the neuromuscular and cardiac depressant effects by competing with magnesium at membrane binding sites"
    ],
    quiz: [
      {
        question: "A practical nurse is administering IV magnesium sulfate to a patient with severe hypomagnesemia. Before administering the next scheduled dose, which assessment finding would require the nurse to withhold the medication and notify the physician?",
        options: [
          "Blood pressure of 128/78 mmHg",
          "Deep tendon reflexes rated 2+ (normal)",
          "Respiratory rate of 10 breaths per minute",
          "Urine output of 45 mL in the past hour"
        ],
        correct: 2,
        rationale: "A respiratory rate below 12 breaths per minute indicates magnesium toxicity and the infusion must be withheld immediately. Deep tendon reflexes must also be present before each dose. The nurse should have calcium gluconate available as the antidote and notify the physician immediately."
      },
      {
        question: "A patient receiving IV potassium chloride for persistent hypokalemia shows no improvement after two days of replacement. The practical nurse should anticipate which additional laboratory test?",
        options: [
          "Serum sodium level",
          "Serum magnesium level",
          "Serum phosphorus level",
          "Serum chloride level"
        ],
        correct: 1,
        rationale: "Hypokalemia that is refractory to potassium replacement is a classic indicator of concurrent hypomagnesemia. Magnesium is required for proper function of the renal potassium channel (ROMK), and potassium levels often cannot be corrected until magnesium stores are replenished."
      },
      {
        question: "A practical nurse assesses a patient with chronic kidney disease who has been using magnesium-containing antacids. Which clinical finding is most consistent with hypermagnesemia?",
        options: [
          "Hyperactive deep tendon reflexes and muscle twitching",
          "Positive Chvostek sign and carpopedal spasm",
          "Decreased deep tendon reflexes and facial flushing",
          "Increased heart rate and elevated blood pressure"
        ],
        correct: 2,
        rationale: "Hypermagnesemia depresses the neuromuscular junction, causing decreased or absent deep tendon reflexes. Facial flushing and a sensation of warmth are characteristic vasodilatory effects of elevated magnesium. Hyperactive reflexes, Chvostek sign, and carpopedal spasm are signs of hypomagnesemia."
      }
    ]
  },

  "malabsorption-syndromes-rpn": {
    title: "Malabsorption Syndromes for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Malabsorption Syndromes",
      content: "Malabsorption syndromes encompass a diverse group of disorders characterized by impaired absorption of nutrients, vitamins, minerals, and fluids from the gastrointestinal tract. To understand malabsorption, it is essential to understand normal absorption. The small intestine is the primary site of nutrient absorption, with a total surface area of approximately 200 square meters due to the presence of circular folds (plicae circulares), villi, and microvilli that form the brush border. The duodenum absorbs iron, calcium, and folate. The jejunum is the primary site for absorption of carbohydrates, proteins, fats, fat-soluble vitamins (A, D, E, K), and water-soluble vitamins. The ileum absorbs vitamin B12 (bound to intrinsic factor), bile salts, and remaining nutrients. Malabsorption occurs when any component of the digestive and absorptive process is disrupted. Celiac disease (celiac sprue, gluten-sensitive enteropathy) is an autoimmune disorder triggered by ingestion of gluten, a protein found in wheat, barley, and rye. In genetically susceptible individuals (carrying HLA-DQ2 or HLA-DQ8 genes), gluten triggers an immune response that damages the intestinal mucosa, causing villous atrophy, crypt hyperplasia, and intraepithelial lymphocyte infiltration. The resulting loss of absorptive surface area leads to malabsorption of virtually all nutrients, with iron and folate deficiency being among the earliest manifestations because these nutrients are absorbed in the proximal small intestine where damage is most severe. Tropical sprue is a malabsorption disorder of unknown etiology that occurs in residents of or travelers to tropical regions. It is thought to involve chronic bacterial infection of the small bowel, causing inflammation and villous atrophy similar to celiac disease but affecting the entire length of the small intestine, with particularly prominent ileal involvement (unlike celiac disease). This ileal involvement explains why vitamin B12 deficiency and megaloblastic anemia are more prominent in tropical sprue than in celiac disease. Whipple disease is a rare systemic infection caused by the bacterium Tropheryma whipplei that infiltrates the small intestinal mucosa (and other organs) with periodic acid-Schiff (PAS)-positive macrophages, distending the villi and blocking lymphatic drainage. This leads to fat malabsorption (steatorrhea) and malabsorption of other nutrients. Whipple disease can also affect joints (migratory polyarthralgia), the central nervous system (dementia, ophthalmoplegia), and the cardiovascular system (endocarditis). Common to all malabsorption syndromes is steatorrhea -- the passage of bulky, pale, foul-smelling, greasy stools that float in the toilet bowl and are difficult to flush. Steatorrhea results from fat malabsorption and is often the presenting symptom. The clinical consequences of malabsorption depend on which nutrients are poorly absorbed: iron deficiency causes microcytic anemia, folate and B12 deficiency cause megaloblastic anemia, calcium and vitamin D malabsorption cause osteoporosis and tetany, protein malabsorption causes edema and muscle wasting, and fat-soluble vitamin deficiency causes a range of specific syndromes (vitamin A deficiency causes night blindness, vitamin D deficiency causes rickets and osteomalacia, vitamin E deficiency causes neuropathy, and vitamin K deficiency causes bleeding disorders)."
    },
    riskFactors: [
      "Family history of celiac disease or autoimmune disorders (first-degree relatives have 10-15% risk of celiac disease)",
      "European descent (celiac disease is most prevalent in Northern European populations)",
      "Travel to or residence in tropical regions (tropical sprue is endemic in Caribbean, South Asia, and Southeast Asia)",
      "Chronic alcohol use (damages intestinal mucosa, impairs pancreatic enzyme secretion, and depletes nutritional reserves)",
      "Prior gastrointestinal surgery (gastric bypass, ileal resection reduce absorptive surface area)",
      "Chronic inflammatory bowel disease, particularly Crohn disease affecting the ileum (disrupts B12 and bile salt absorption)",
      "Pancreatic insufficiency from chronic pancreatitis or cystic fibrosis (inadequate digestive enzyme production causes fat malabsorption)"
    ],
    diagnostics: [
      "Tissue transglutaminase IgA antibody (tTG-IgA): first-line serological test for celiac disease; sensitivity and specificity above 95 percent; must be tested while patient is consuming gluten-containing diet",
      "Small bowel biopsy via upper endoscopy: gold standard for celiac disease diagnosis showing villous atrophy, crypt hyperplasia, and increased intraepithelial lymphocytes; also used for Whipple disease (PAS-positive macrophages)",
      "72-hour fecal fat collection: quantitative measurement of fat malabsorption; greater than 7 grams of fat per day on a 100-gram fat diet confirms steatorrhea",
      "Complete blood count with differential: may show microcytic anemia (iron deficiency), megaloblastic anemia (B12 or folate deficiency), or both (mixed picture common in celiac disease)",
      "Serum vitamin levels: vitamin B12, folate, iron studies, vitamin D (25-hydroxyvitamin D), vitamins A, E, K; deficiency patterns help localize the site of malabsorption",
      "D-xylose absorption test: differentiates mucosal malabsorption from pancreatic insufficiency; low urinary D-xylose after oral dose indicates mucosal disease (celiac, tropical sprue)"
    ],
    management: [
      "Celiac disease: lifelong strict gluten-free diet eliminating all wheat, barley, and rye products; oats may be tolerated by most patients if uncontaminated",
      "Tropical sprue: antibiotic therapy with tetracycline or trimethoprim-sulfamethoxazole for 3-6 months combined with folate supplementation",
      "Whipple disease: prolonged antibiotic therapy, typically ceftriaxone IV for 2 weeks followed by trimethoprim-sulfamethoxazole orally for 1 year or longer",
      "Nutritional rehabilitation: replace deficient vitamins and minerals (iron, folate, B12, calcium, vitamin D, fat-soluble vitamins) based on laboratory results",
      "Pancreatic enzyme replacement therapy (pancrelipase) with meals for patients with pancreatic insufficiency causing fat malabsorption",
      "High-calorie, high-protein diet with small frequent meals to maximize nutrient absorption; medium-chain triglycerides (MCT oil) as a fat source because MCTs are absorbed directly into the portal circulation without requiring bile salts",
      "Refer to registered dietitian for comprehensive nutritional assessment and individualized meal planning; provide ongoing dietary education and support"
    ],
    nursingActions: [
      "Monitor daily weight using the same scale at the same time each day; report weight loss exceeding 1 kg per week as it may indicate worsening malabsorption or inadequate nutritional intake",
      "Assess stool characteristics every shift: document frequency, consistency, color, odor, and presence of visible fat or oil; report steatorrhea (bulky, pale, foul-smelling, greasy stools) to the supervising nurse",
      "Administer pancreatic enzyme replacement (pancrelipase) with meals and snacks as prescribed; ensure capsules are swallowed whole and not crushed; verify timing -- enzymes must be taken at the beginning of each meal",
      "Monitor for signs of nutritional deficiency: assess skin integrity (poor wound healing, dermatitis), oral mucosa (glossitis, angular stomatitis), hair quality (brittle, thin), and neurological status (peripheral neuropathy from B12 deficiency)",
      "Obtain and report serial laboratory results including hemoglobin, iron studies, vitamin B12, folate, calcium, vitamin D, albumin, and prealbumin as indicators of nutritional status",
      "Reinforce dietary teaching for celiac disease patients: emphasize strict avoidance of wheat, barley, and rye; educate about hidden sources of gluten in sauces, processed foods, medications, and communion wafers",
      "Monitor fluid and electrolyte balance; chronic diarrhea from malabsorption can cause dehydration and electrolyte depletion (potassium, magnesium, sodium)"
    ],
    assessmentFindings: [
      "Steatorrhea: bulky, pale, foul-smelling, greasy stools that float and are difficult to flush; the hallmark finding of fat malabsorption across all malabsorption syndromes",
      "Weight loss and muscle wasting despite adequate caloric intake; abdominal distension and bloating from fermentation of unabsorbed carbohydrates",
      "Iron deficiency anemia: pallor, fatigue, tachycardia, koilonychia (spoon nails), pica; or megaloblastic anemia from B12/folate deficiency with glossitis and paresthesias",
      "Dermatitis herpetiformis: intensely pruritic, vesicular skin eruption on extensor surfaces (elbows, knees, buttocks) pathognomonic for celiac disease; occurs in 15-25% of celiac patients",
      "Peripheral edema from hypoalbuminemia secondary to protein malabsorption; may progress to ascites in severe cases",
      "Bone pain, pathologic fractures, and tetany from calcium and vitamin D malabsorption leading to osteomalacia and secondary hyperparathyroidism",
      "Peripheral neuropathy with numbness, tingling, and loss of proprioception from vitamin B12 and vitamin E deficiency; cognitive changes may occur with prolonged B12 deficiency"
    ],
    signs: {
      left: [
        "Chronic diarrhea with occasional steatorrhea",
        "Mild abdominal bloating and flatulence after meals",
        "Fatigue and decreased energy levels",
        "Mild weight loss over weeks to months",
        "Intermittent nausea and poor appetite",
        "Brittle nails and thinning hair"
      ],
      right: [
        "Severe dehydration with electrolyte imbalance (hypokalemia, hypomagnesemia)",
        "Tetany and carpopedal spasm from severe hypocalcemia",
        "Severe anemia (hemoglobin below 70 g/L) with symptomatic tachycardia",
        "Signs of hemorrhage from vitamin K deficiency (prolonged bleeding, ecchymosis)",
        "Neurological deterioration from B12 deficiency (subacute combined degeneration)",
        "Severe malnutrition with cachexia and hypoalbuminemia below 20 g/L"
      ]
    },
    medications: [
      {
        name: "Pancrelipase (Creon, Zenpep)",
        type: "Pancreatic enzyme replacement (lipase, protease, amylase)",
        action: "Provides exogenous pancreatic enzymes (lipase, protease, and amylase) to supplement or replace deficient endogenous enzyme production; lipase breaks down triglycerides into fatty acids and glycerol, protease breaks down proteins into amino acids, and amylase breaks down starches into simple sugars, thereby restoring normal digestion and nutrient absorption",
        sideEffects: "Nausea, abdominal cramping, diarrhea, hyperuricemia (elevated uric acid), fibrosing colonopathy (rare, with very high doses in cystic fibrosis patients), perianal irritation",
        contra: "Known hypersensitivity to porcine-derived products (pancrelipase is derived from porcine pancreas); acute pancreatitis or acute exacerbation of chronic pancreatitis",
        pearl: "Must be taken at the BEGINNING of every meal and snack -- not after the meal; capsules must be swallowed whole, not crushed or chewed, to protect the enteric coating that prevents enzyme destruction by stomach acid; dose is adjusted based on fat content of the meal and stool characteristics"
      },
      {
        name: "Cholestyramine (Questran)",
        type: "Bile acid sequestrant / bile salt binder",
        action: "Binds bile acids in the intestinal lumen forming an insoluble complex that is excreted in the stool; used in malabsorption when bile salt malabsorption (due to ileal resection or ileal Crohn disease) causes bile acid-induced secretory diarrhea; by binding excess bile acids, it reduces the cathartic effect on the colonic mucosa",
        sideEffects: "Constipation (most common), abdominal bloating and cramping, nausea, impaired absorption of fat-soluble vitamins (A, D, E, K) and many medications, hypertriglyceridemia",
        contra: "Complete biliary obstruction (no bile acids to bind); bowel obstruction; phenylketonuria (some formulations contain phenylalanine); severe hypertriglyceridemia",
        pearl: "Must be administered separately from other medications -- take other drugs 1 hour before or 4-6 hours after cholestyramine because it binds and inactivates many drugs including warfarin, digoxin, thyroid hormones, and thiazide diuretics; mix powder with water or juice, never take dry"
      },
      {
        name: "Ferrous Sulfate (Iron Supplement)",
        type: "Oral iron replacement / hematenic",
        action: "Provides elemental iron (ferrous form) for incorporation into hemoglobin, myoglobin, and iron-containing enzymes; ferrous iron (Fe2+) is absorbed in the duodenum and proximal jejunum; it restores depleted iron stores and corrects iron deficiency anemia that commonly accompanies malabsorption syndromes, particularly celiac disease",
        sideEffects: "GI distress (nausea, constipation, abdominal cramping), black tarry stools (normal finding, not melena), teeth staining with liquid formulations, iron overload with excessive supplementation",
        contra: "Hemochromatosis or other iron overload conditions; hemolytic anemias (iron is not deficient); peptic ulcer disease (may worsen GI irritation); concurrent IV iron therapy",
        pearl: "Take on an empty stomach with vitamin C (orange juice) to enhance absorption; avoid taking with calcium, antacids, dairy products, coffee, or tea as these reduce absorption by 40-60%; stools will turn black (reassure patient this is expected and not blood); expect reticulocyte count to rise within 5-10 days as the first sign of therapeutic response"
      }
    ],
    pearls: [
      "Steatorrhea (bulky, pale, foul-smelling, greasy, floating stools) is the hallmark of fat malabsorption and should prompt investigation for malabsorption syndrome regardless of the suspected etiology",
      "Celiac disease requires a LIFELONG strict gluten-free diet -- even small amounts of gluten (crumbs, cross-contamination) can reactivate mucosal damage; patients must be on a gluten-containing diet when tested or serology and biopsy may be falsely negative",
      "Dermatitis herpetiformis (intensely itchy blistering rash on elbows, knees, and buttocks) is pathognomonic for celiac disease and resolves with a gluten-free diet -- if you see this rash, think celiac disease",
      "Pancrelipase must be taken at the START of every meal and snack, not after -- this ensures enzymes are present when food enters the duodenum; capsules must never be crushed because the enteric coating protects enzymes from stomach acid destruction",
      "Iron deficiency anemia that does not respond to oral iron replacement should raise suspicion for celiac disease, especially in young women -- the damaged proximal small bowel cannot absorb iron effectively",
      "Tropical sprue differs from celiac disease in two key ways: it occurs in tropical regions and responds to antibiotics, and it predominantly affects the ileum causing B12 deficiency and megaloblastic anemia rather than iron deficiency",
      "When administering cholestyramine, space all other medications at least 1 hour before or 4-6 hours after because this bile acid binder avidly binds many drugs, reducing their absorption and effectiveness"
    ],
    quiz: [
      {
        question: "A patient newly diagnosed with celiac disease asks the practical nurse what foods must be avoided. Which response is most accurate?",
        options: [
          "Avoid dairy products, eggs, and soy for at least 6 months",
          "Eliminate wheat, barley, and rye from the diet permanently",
          "Follow a low-fat diet until symptoms improve, then resume normal diet",
          "Avoid all grains including rice, corn, and quinoa"
        ],
        correct: 1,
        rationale: "Celiac disease requires lifelong strict elimination of gluten, which is found in wheat, barley, and rye. Rice, corn, quinoa, and oats (if uncontaminated) are gluten-free and safe. The diet is permanent, not temporary, and dairy restriction is not required unless there is concurrent lactose intolerance."
      },
      {
        question: "A practical nurse is caring for a patient with chronic pancreatitis who is prescribed pancrelipase (Creon) with meals. When should the nurse instruct the patient to take the medication?",
        options: [
          "30 minutes before each meal on an empty stomach",
          "At the beginning of each meal and snack",
          "One hour after each meal with a full glass of water",
          "At bedtime with a small snack"
        ],
        correct: 1,
        rationale: "Pancrelipase must be taken at the beginning of each meal and snack to ensure that the digestive enzymes are present in the duodenum when food arrives. Taking enzymes after the meal or on an empty stomach reduces effectiveness and does not adequately support digestion."
      },
      {
        question: "A practical nurse observes that a patient with malabsorption syndrome has bulky, pale, foul-smelling stools that float in the toilet. Which type of malabsorption does this finding most specifically suggest?",
        options: [
          "Carbohydrate malabsorption",
          "Protein malabsorption",
          "Fat malabsorption (steatorrhea)",
          "Vitamin B12 malabsorption"
        ],
        correct: 2,
        rationale: "Steatorrhea (bulky, pale, foul-smelling, greasy, floating stools) is the hallmark finding of fat malabsorption. The pale color results from unabsorbed fat, the foul odor from bacterial degradation of unabsorbed fatty acids, and the floating from gas produced during fat fermentation."
      }
    ]
  },

  "malaria-basics-rpn": {
    title: "Malaria Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Malaria Infection",
      content: "Malaria is a life-threatening parasitic disease caused by Plasmodium species and transmitted to humans through the bite of an infected female Anopheles mosquito. Five Plasmodium species cause malaria in humans: Plasmodium falciparum, Plasmodium vivax, Plasmodium ovale, Plasmodium malariae, and Plasmodium knowlesi. Of these, P. falciparum is the most virulent and causes the majority of malaria-related deaths worldwide, while P. vivax is the most geographically widespread. The life cycle of the malaria parasite involves two hosts: the mosquito (definitive host where sexual reproduction occurs) and the human (intermediate host where asexual reproduction occurs). When an infected female Anopheles mosquito bites a human, it injects sporozoites into the bloodstream. These sporozoites travel to the liver within 30 minutes and invade hepatocytes, where they undergo asexual multiplication (exo-erythrocytic schizogony) over 7 to 30 days, producing thousands of merozoites. P. vivax and P. ovale can also form dormant liver stages called hypnozoites, which can reactivate weeks to years later causing relapse -- this is a critical distinction because treatment of P. vivax and P. ovale requires primaquine to eliminate hypnozoites and prevent relapse. The merozoites are released from the liver into the bloodstream, where they invade red blood cells (erythrocytes) and undergo further asexual multiplication (erythrocytic schizogony). Inside the red blood cell, the parasite progresses through ring stage, trophozoite stage, and schizont stage before the red blood cell ruptures, releasing 8 to 32 new merozoites that invade fresh red blood cells, continuing the cycle. The synchronous rupture of infected red blood cells releases merozoites, hemozoin (malaria pigment), and cellular debris into the bloodstream, triggering a massive inflammatory response with release of tumor necrosis factor (TNF), interleukin-1, and other pyrogenic cytokines. This synchronized release produces the characteristic cyclical fevers of malaria: every 48 hours for P. falciparum, P. vivax, and P. ovale (tertian malaria), and every 72 hours for P. malariae (quartan malaria). P. falciparum is uniquely dangerous because infected red blood cells express adhesion molecules (PfEMP1) on their surface that cause them to stick to the endothelium of small blood vessels (cytoadherence) and to uninfected red blood cells (rosetting). This leads to microvascular obstruction, tissue hypoxia, and organ damage. Cerebral malaria occurs when parasitized red blood cells obstruct cerebral microvasculature, causing altered consciousness, seizures, and coma. Other severe manifestations include severe anemia (from massive red blood cell destruction), acute respiratory distress syndrome (ARDS), acute kidney injury, metabolic acidosis, and hypoglycemia (the parasite consumes glucose, and quinine stimulates insulin release)."
    },
    riskFactors: [
      "Travel to or residence in malaria-endemic regions (sub-Saharan Africa, South Asia, Southeast Asia, Central and South America, Oceania)",
      "Lack of chemoprophylaxis or non-adherence to prophylactic antimalarial regimen during travel to endemic areas",
      "Pregnancy (increased susceptibility due to altered immune response; placental sequestration of parasitized red blood cells causes maternal anemia and low birth weight)",
      "Young children under 5 years in endemic areas (lack acquired immunity)",
      "Immunocompromised status including HIV/AIDS (increased malaria severity and mortality)",
      "Absence of sickle cell trait (heterozygous sickle cell trait HbAS confers partial protection against severe P. falciparum malaria)",
      "Living near standing water or in areas with poor mosquito control measures (stagnant water provides breeding habitat for Anopheles mosquitoes)"
    ],
    diagnostics: [
      "Thick blood smear: gold standard screening test; concentrates parasites from a large volume of blood for detection; higher sensitivity for detecting low-level parasitemia; determines presence or absence of malaria parasites",
      "Thin blood smear: allows species identification and quantification of parasitemia (percentage of infected red blood cells); P. falciparum shows characteristic banana-shaped gametocytes, multiple ring forms per cell, and Maurer clefts",
      "Rapid diagnostic test (RDT): immunochromatographic test detecting parasite antigens (HRP-2 for P. falciparum, pLDH for all species); results in 15-20 minutes; useful when microscopy is not available; false negatives can occur with low parasitemia",
      "Complete blood count: typically shows normocytic or hemolytic anemia, thrombocytopenia (very common in malaria), and variable white blood cell count (often normal or low, NOT elevated as in bacterial infections)",
      "Serum glucose: hypoglycemia is common in severe malaria, especially in children and pregnant women; P. falciparum consumes glucose and quinine stimulates insulin release",
      "Lactate dehydrogenase (LDH) and haptoglobin: markers of hemolysis; elevated LDH and decreased haptoglobin confirm red blood cell destruction from parasite invasion"
    ],
    management: [
      "Uncomplicated P. falciparum malaria: artemisinin-based combination therapy (ACT) such as artemether-lumefantrine (Coartem) as first-line treatment per WHO guidelines; complete the full course even if symptoms improve",
      "Severe malaria (any species with danger signs): IV artesunate is the first-line treatment; switch to oral ACT once patient can tolerate oral medications; admit to intensive care unit",
      "P. vivax and P. ovale: chloroquine for acute blood-stage infection PLUS primaquine for 14 days to eliminate hypnozoites in the liver and prevent relapse; test for G6PD deficiency BEFORE giving primaquine",
      "Supportive care: aggressive IV fluid resuscitation, correct hypoglycemia with IV dextrose, transfuse packed red blood cells for severe anemia (hemoglobin below 50 g/L), monitor and treat seizures with benzodiazepines",
      "Prevention: insecticide-treated bed nets (ITNs), indoor residual spraying, chemoprophylaxis for travelers (atovaquone-proguanil, doxycycline, or mefloquine), and environmental mosquito control",
      "Monitor parasitemia by repeated blood smears at 12-24 hour intervals during treatment to confirm parasite clearance; persistent or rising parasitemia suggests treatment failure",
      "Monitor for complications of severe malaria: cerebral malaria (altered consciousness, seizures), ARDS, acute kidney injury, severe anemia, metabolic acidosis, and disseminated intravascular coagulation (DIC)"
    ],
    nursingActions: [
      "Monitor temperature every 4 hours and document fever patterns; note the cyclical pattern (every 48 or 72 hours) as it helps confirm diagnosis and identify the Plasmodium species",
      "Monitor blood glucose every 4-6 hours, especially in patients receiving quinine or quinidine; treat hypoglycemia immediately with IV dextrose as prescribed",
      "Assess neurological status every 2-4 hours using Glasgow Coma Scale; report any decline in consciousness, new-onset seizures, or signs of cerebral malaria immediately",
      "Maintain strict intake and output monitoring; report urine output below 30 mL/hour as it may indicate acute kidney injury from hemoglobinuria or renal microvascular obstruction",
      "Administer antimalarial medications at prescribed intervals and monitor for adverse effects; ensure artemether-lumefantrine is taken with fatty food to enhance absorption",
      "Implement universal precautions; malaria is NOT transmitted person-to-person through casual contact but can be transmitted through blood (needle stick, transfusion)",
      "Educate patient and family about mosquito bite prevention: use insecticide-treated bed nets, wear long-sleeved clothing at dusk and dawn (peak Anopheles feeding time), apply DEET-containing repellent"
    ],
    assessmentFindings: [
      "Classic malarial paroxysm occurring in three stages: cold stage (rigors, shaking chills lasting 15-60 minutes), hot stage (high fever 39-41 degrees Celsius, headache, flushing, tachycardia lasting 2-6 hours), and sweating stage (profuse diaphoresis, temperature drops, exhaustion)",
      "Splenomegaly (enlarged spleen from clearance of parasitized red blood cells) palpable in the left upper quadrant; may be tender; risk of splenic rupture if palpated aggressively",
      "Hepatomegaly with elevated liver enzymes and mild jaundice from hemolysis and hepatocyte damage",
      "Pallor, fatigue, and tachycardia indicating anemia from red blood cell destruction; dark or cola-colored urine (hemoglobinuria) indicates severe hemolysis -- called blackwater fever",
      "Thrombocytopenia manifesting as petechiae, easy bruising, or mucosal bleeding; platelet count below 150,000 is present in 60-80% of malaria cases",
      "Altered mental status, confusion, seizures, and coma in cerebral malaria (P. falciparum); retinal hemorrhages may be visible on fundoscopic examination"
    ],
    signs: {
      left: [
        "Cyclical fevers with chills and sweating (malarial paroxysm)",
        "Headache, myalgia, and general malaise",
        "Mild nausea, vomiting, and diarrhea",
        "Fatigue and pallor suggesting early anemia",
        "Mild splenomegaly on abdominal palpation",
        "Low-grade thrombocytopenia on laboratory results"
      ],
      right: [
        "High fever exceeding 40 degrees Celsius with hemodynamic instability",
        "Altered level of consciousness, seizures, or coma (cerebral malaria)",
        "Severe anemia with hemoglobin below 50 g/L requiring transfusion",
        "Dark cola-colored urine (blackwater fever from massive hemolysis)",
        "Respiratory distress and hypoxia (ARDS)",
        "Oliguria or anuria indicating acute kidney injury"
      ]
    },
    medications: [
      {
        name: "Chloroquine (Aralen)",
        type: "Aminoquinoline antimalarial / blood schizonticide",
        action: "Concentrates within the acidic food vacuole of the Plasmodium parasite inside red blood cells and inhibits heme polymerase, preventing the conversion of toxic heme (a byproduct of hemoglobin digestion) into non-toxic hemozoin; the resulting accumulation of toxic heme kills the parasite; effective against blood-stage P. vivax, P. ovale, P. malariae, and chloroquine-sensitive P. falciparum",
        sideEffects: "GI disturbance (nausea, vomiting, diarrhea), headache, dizziness, pruritus (especially in dark-skinned individuals), retinal toxicity with prolonged use (bull's-eye maculopathy), QT prolongation",
        contra: "Chloroquine-resistant P. falciparum (widespread in Africa, Southeast Asia, South America); known retinal or visual field changes from prior chloroquine use; hypersensitivity to 4-aminoquinolines",
        pearl: "Chloroquine is still first-line for P. vivax in most regions but must NEVER be used alone for P. falciparum in areas with known resistance; take with food to minimize GI side effects; annual eye examinations recommended for patients on long-term prophylaxis"
      },
      {
        name: "Artemether-Lumefantrine (Coartem)",
        type: "Artemisinin-based combination therapy (ACT)",
        action: "Artemether is an artemisinin derivative that generates free radicals within the parasite, damaging parasite proteins and membranes and rapidly killing blood-stage parasites (fastest-acting antimalarial available); lumefantrine is a long-acting partner drug that eliminates remaining parasites and prevents recrudescence; the combination exploits rapid parasite killing plus prolonged clearance",
        sideEffects: "Headache, dizziness, nausea, vomiting, abdominal pain, arthralgia, myalgia, palpitations, QT prolongation (rare at standard doses)",
        contra: "Known hypersensitivity; concurrent use with strong CYP3A4 inhibitors or inducers; first trimester of pregnancy (limited safety data); patients with cardiac conduction abnormalities",
        pearl: "Must be taken with fatty food or whole milk to increase lumefantrine absorption by up to 16-fold -- instruct patients to eat before each dose; the standard adult course is 6 doses over 3 days (initial dose, then at 8, 24, 36, 48, and 60 hours); this is the WHO-recommended first-line ACT for uncomplicated P. falciparum malaria"
      },
      {
        name: "Primaquine",
        type: "8-aminoquinoline antimalarial / tissue schizonticide and hypnozoitocide",
        action: "Acts on the exo-erythrocytic (liver) stage parasites, including dormant hypnozoites of P. vivax and P. ovale; generates reactive oxygen intermediates that damage parasite mitochondria; also has gametocytocidal activity against P. falciparum, reducing transmission to mosquitoes; it is the ONLY drug that eliminates hypnozoites and prevents relapse",
        sideEffects: "Hemolytic anemia in patients with G6PD deficiency (potentially fatal), methemoglobinemia, GI distress (nausea, abdominal cramps), leukopenia",
        contra: "G6PD deficiency (must test for G6PD level BEFORE prescribing -- primaquine causes oxidative stress that triggers massive hemolysis in G6PD-deficient individuals); pregnancy (risk of hemolysis in G6PD-deficient fetus); concurrent bone marrow suppressants",
        pearl: "G6PD testing is MANDATORY before prescribing primaquine -- administering primaquine to a G6PD-deficient patient can cause life-threatening hemolytic anemia; it is the only drug that prevents relapse of P. vivax and P. ovale by killing dormant liver hypnozoites; take with food to reduce nausea"
      }
    ],
    pearls: [
      "The classic malarial paroxysm follows three stages: cold stage (rigors and shaking chills), hot stage (high fever and flushing), and sweating stage (profuse diaphoresis with temperature drop) -- this cyclical pattern repeating every 48-72 hours is highly suggestive of malaria",
      "P. falciparum is the most dangerous species because parasitized red blood cells adhere to blood vessel walls (cytoadherence), causing microvascular obstruction that leads to cerebral malaria, organ failure, and death -- always treat P. falciparum as a medical emergency",
      "G6PD testing is MANDATORY before administering primaquine -- this drug causes oxidative hemolysis in G6PD-deficient patients that can be fatal; G6PD deficiency is common in malaria-endemic populations because it provides partial protection against malaria",
      "Thrombocytopenia is present in 60-80 percent of malaria cases and is one of the most consistent laboratory findings -- a febrile traveler returning from an endemic area with thrombocytopenia should be tested for malaria even without classic symptoms",
      "Artemether-lumefantrine (Coartem) MUST be taken with fatty food to ensure adequate absorption of lumefantrine -- without fat, drug levels may be subtherapeutic and treatment may fail",
      "Blackwater fever (dark cola-colored urine from massive hemolysis and hemoglobinuria) is a life-threatening complication of severe P. falciparum malaria that can cause acute kidney injury from hemoglobin precipitation in renal tubules",
      "Malaria prevention for travelers relies on the ABCDs: Awareness of risk, Bite prevention (bed nets, DEET repellent, long sleeves at dusk/dawn), Chemoprophylaxis (atovaquone-proguanil, doxycycline, or mefloquine), and early Diagnosis and treatment if febrile"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with Plasmodium vivax malaria. The physician orders primaquine to prevent relapse. Which laboratory test must be performed before this medication is administered?",
        options: [
          "Serum creatinine and BUN",
          "Liver function tests (AST and ALT)",
          "Glucose-6-phosphate dehydrogenase (G6PD) level",
          "Prothrombin time and INR"
        ],
        correct: 2,
        rationale: "G6PD testing is mandatory before administering primaquine because this drug causes oxidative stress that triggers severe hemolytic anemia in G6PD-deficient patients. P. vivax and P. ovale form dormant liver hypnozoites that cause relapse, and primaquine is the only drug that eliminates these hypnozoites."
      },
      {
        question: "A patient recently returned from sub-Saharan Africa presents with cyclical high fevers, rigors, and diaphoresis. Laboratory findings show thrombocytopenia and normocytic anemia. Which diagnostic test is the gold standard for confirming malaria?",
        options: [
          "Blood culture and sensitivity",
          "Thick and thin blood smear for malaria parasites",
          "Serum procalcitonin level",
          "Rapid streptococcal antigen test"
        ],
        correct: 1,
        rationale: "Thick and thin blood smears are the gold standard for malaria diagnosis. The thick smear concentrates parasites for detection (screening), while the thin smear allows species identification and quantification of parasitemia. Cyclical fevers with thrombocytopenia in a traveler from an endemic area should always raise suspicion for malaria."
      },
      {
        question: "A practical nurse is administering artemether-lumefantrine (Coartem) to a patient with uncomplicated Plasmodium falciparum malaria. Which instruction is most important to include in patient teaching?",
        options: [
          "Take the medication on an empty stomach first thing in the morning",
          "Take each dose with a fatty meal or whole milk to ensure proper absorption",
          "Crush the tablets and mix with water if swallowing is difficult",
          "Discontinue the medication as soon as fever resolves"
        ],
        correct: 1,
        rationale: "Artemether-lumefantrine must be taken with fatty food or whole milk because lumefantrine absorption increases up to 16-fold with fat intake. Without adequate fat, drug levels may be subtherapeutic leading to treatment failure. The full course must be completed even if symptoms resolve."
      }
    ]
  },

  "mandatory-reporting-rpn": {
    title: "Mandatory Reporting Obligations for Practical Nurses",
    cellular: {
      title: "Legal and Ethical Framework of Mandatory Reporting",
      content: "Mandatory reporting refers to the legal obligation of designated professionals, including practical nurses, to report suspected cases of abuse, neglect, or harm to the appropriate authorities. These laws exist to protect vulnerable populations who may be unable to protect themselves or seek help independently. The duty to report is enshrined in provincial, territorial, and state legislation across Canada and the United States, and failure to report can result in professional discipline, fines, and in some jurisdictions, criminal charges. Mandatory reporting laws are rooted in the ethical principles of beneficence (acting in the best interest of the vulnerable person), non-maleficence (preventing harm), and justice (ensuring equitable protection under the law). The practical nurse must understand that the duty to report is a LEGAL obligation that supersedes other professional obligations, including the duty of confidentiality. When a practical nurse has reasonable grounds to suspect abuse or neglect, the report must be made regardless of whether the victim consents or whether the nurse believes the report will result in substantive action. The standard for reporting is reasonable suspicion, NOT certainty -- the nurse does not need to prove abuse occurred but must report when indicators suggest it may have occurred. Child abuse and neglect reporting is mandated in every Canadian province and territory and in all US states. Child abuse encompasses four categories: physical abuse (non-accidental physical injury), emotional or psychological abuse (chronic belittlement, intimidation, rejection), sexual abuse (any sexual activity involving a child), and neglect (failure to provide basic necessities including food, shelter, clothing, medical care, supervision, and education). Physical indicators of child abuse include injuries inconsistent with the developmental stage (spiral fractures in non-ambulatory infants), patterned injuries (loop marks from cords, parallel lines from belts, circular burns from cigarettes), injuries in various stages of healing (suggesting repeated abuse), and unexplained or poorly explained injuries. Behavioral indicators include extreme withdrawal or aggression, age-inappropriate sexual knowledge, fear of specific adults, and regression to earlier developmental behaviors. Elder abuse encompasses physical abuse, emotional abuse, sexual abuse, financial exploitation, and neglect (including self-neglect). Financial exploitation is the most common form of elder abuse and may involve unauthorized use of funds, forged signatures, sudden changes to wills or powers of attorney, or coerced transfer of assets. Risk factors for elder abuse include social isolation, cognitive impairment, caregiver stress, financial dependency, and substance abuse by the caregiver. Domestic violence (intimate partner violence) affects individuals across all ages, genders, socioeconomic levels, and cultural backgrounds. The practical nurse should screen for domestic violence using validated tools and in a private setting, never in the presence of the suspected abuser. Documentation of mandatory reports must be thorough, objective, and factual. The nurse should document exactly what was observed or reported using the patient's own words in quotation marks, the date, time, and location of observations, and the name and contact information of the authority to whom the report was made. The nurse should NOT include subjective opinions about who may be responsible for the abuse, as this is the role of the investigating authority."
    },
    riskFactors: [
      "Social isolation of the victim (limited contact with friends, family, or community reduces detection opportunities and increases vulnerability)",
      "Caregiver stress and burnout (physical and emotional exhaustion increases risk of neglect and abuse, particularly in elder care settings)",
      "Substance abuse by the caregiver or family member (impaired judgment and disinhibition increase risk of violence and neglect)",
      "Cognitive impairment in the victim (dementia, intellectual disability reduces ability to self-report and increases dependency on caregivers)",
      "Financial dependency of the victim on the abuser (economic control is a tool of coercion in both elder abuse and domestic violence)",
      "History of family violence (intergenerational cycle of abuse; childhood exposure to violence increases risk of perpetrating or experiencing violence as an adult)",
      "Unwanted pregnancy or unplanned caregiver responsibilities (increased stress and resentment may precipitate child abuse or neglect)"
    ],
    diagnostics: [
      "Comprehensive physical assessment: document all injuries with precise descriptions (size, shape, color, location, stage of healing); use body diagrams to map injury locations; photograph injuries per facility protocol with patient consent",
      "Developmental screening in children: injuries inconsistent with the child's developmental stage (e.g., spiral fractures in a non-ambulatory infant) are highly suspicious for non-accidental injury",
      "Skeletal survey (X-ray of entire skeleton): ordered for children under 2 years with suspected physical abuse to detect occult fractures in various stages of healing; corner fractures (bucket-handle fractures) and posterior rib fractures are highly specific for child abuse",
      "Validated screening tools for domestic violence: HITS (Hurt, Insult, Threaten, Scream), SAFE (Stress/Safety, Afraid/Abused, Friend/Family, Emergency Plan), or institutional screening questionnaire administered in private",
      "Elder abuse screening: Elder Abuse Suspicion Index (EASI) or institutional screening protocol; assess for signs of neglect (malnutrition, dehydration, poor hygiene, pressure injuries) and financial exploitation",
      "Laboratory studies when abuse is suspected: coagulation profile to rule out bleeding disorders as an alternative explanation for bruising; toxicology screen if poisoning is suspected; nutritional markers (albumin, prealbumin) if neglect is suspected"
    ],
    management: [
      "Make the mandatory report to the designated authority immediately: child protective services (CPS) for child abuse/neglect, adult protective services (APS) for elder abuse, law enforcement for immediate safety threats",
      "Ensure immediate safety of the victim: if the patient is in danger, implement safety measures (move to safe area, remove alleged perpetrator from bedside, request security presence, contact law enforcement)",
      "Document all findings objectively and thoroughly using factual, non-judgmental language: describe observations exactly as seen, use patient's own words in quotation marks, avoid conclusions about perpetrator identity",
      "Complete the mandatory report form per facility and jurisdictional requirements: include reporter information, victim information, description of suspected abuse/neglect, actions taken, and authority notified",
      "Provide emotional support and trauma-informed care to the victim: create a safe, private environment; use active listening; avoid victim-blaming language; validate the victim's feelings and right to safety",
      "Collaborate with the interdisciplinary team: social worker, physician, child life specialist (pediatric cases), victim advocate, legal counsel as appropriate; participate in case conferences",
      "Know that the reporter is protected by law: good-faith reporters are protected from civil and criminal liability even if the investigation does not substantiate abuse; failure to report when required is a legal and professional offense"
    ],
    nursingActions: [
      "Screen all patients for abuse and neglect using validated tools during admission and at regular intervals per facility policy; conduct screening in a private setting, NEVER in the presence of the suspected abuser",
      "Report suspected abuse immediately through the proper channels -- do NOT wait for certainty; the legal standard is reasonable suspicion, not proof; delayed reporting may expose the victim to continued harm",
      "Document assessment findings using objective, factual language: record exact quotes from the patient, use body diagrams to map injuries, note the size, shape, color, and location of all injuries, and describe the patient's affect and demeanor",
      "Preserve evidence per facility protocol: do not wash the patient before forensic examination if sexual assault is suspected; place clothing in paper bags (not plastic), and maintain chain of custody for all collected evidence",
      "Provide patient education about available resources: domestic violence hotlines, emergency shelter information, safety planning, legal advocacy services, and community support organizations",
      "Maintain confidentiality of the reporter's identity: in most jurisdictions, the identity of the person making the mandatory report is protected by law and should not be disclosed to the alleged perpetrator",
      "Debrief with a supervisor or peer support after making a mandatory report; reporting abuse can be emotionally distressing and the nurse should access available support resources"
    ],
    assessmentFindings: [
      "Physical indicators of child abuse: injuries inconsistent with stated mechanism, patterned injuries (belt marks, cigarette burns, loop marks), injuries in various stages of healing, unexplained bruises in unusual locations (torso, back, buttocks, face in infants)",
      "Behavioral indicators of child abuse: extreme withdrawal or aggression, flinching at sudden movements, age-inappropriate sexual behavior or knowledge, fear of going home, regression to earlier developmental behaviors (bedwetting, thumb-sucking)",
      "Elder abuse indicators: unexplained bruises or fractures, poor hygiene and malnutrition despite adequate resources, pressure injuries in a supervised setting, dehydration, medication non-adherence due to caregiver withholding",
      "Financial exploitation of elders: sudden changes in banking patterns, unexplained disappearance of personal belongings or funds, new acquaintance asserting control over financial decisions, forced changes to will or power of attorney",
      "Domestic violence indicators: injuries in various stages of healing, injuries inconsistent with explanation given, frequent emergency department visits, partner who is overly controlling or refuses to leave the room during assessment",
      "Neglect indicators: children or elders who appear malnourished, have untreated medical conditions, wear inappropriate clothing for weather, have poor dental hygiene, or live in unsafe environmental conditions"
    ],
    signs: {
      left: [
        "Unexplained bruises or minor injuries with inconsistent explanations",
        "Social withdrawal, fearfulness, or decreased eye contact",
        "Poor hygiene, weight loss, or signs of inadequate nutrition",
        "Patient appears anxious or watchful around specific caregivers",
        "Vague or inconsistent history of injuries",
        "Reluctance to undress or be examined in specific body areas"
      ],
      right: [
        "Injuries in multiple stages of healing suggesting repeated abuse",
        "Patterned injuries (belt marks, cord marks, cigarette burns, bite marks)",
        "Head injuries or subdural hematomas in infants (shaken baby syndrome)",
        "Genital or rectal injuries, sexually transmitted infections in children",
        "Severe malnutrition, dehydration, or untreated medical conditions indicating gross neglect",
        "Patient expresses fear for their life or discloses ongoing abuse"
      ]
    },
    medications: [
      {
        name: "Incident Report Form (Documentation Tool)",
        type: "Facility-specific documentation form for reporting adverse events and suspected abuse",
        action: "Provides a standardized template for documenting incidents including suspected abuse, neglect, or harm; captures essential information (date, time, location, persons involved, description of incident, actions taken, authorities notified) in a format that meets legal and regulatory requirements; creates an official record that may be used in legal proceedings",
        sideEffects: "Incomplete documentation may result in inadequate investigation; overly subjective documentation may introduce bias; failure to complete may result in professional discipline",
        contra: "Should never be used as a substitute for making the verbal mandatory report to the designated authority; the report must be made regardless of whether the form is completed",
        pearl: "Complete the incident report as soon as possible after the event while details are fresh; use factual, objective language; avoid opinions about who is responsible; document what you SAW and what the patient SAID (using direct quotes); keep a copy per facility policy"
      },
      {
        name: "Abuse Screening Tool (Assessment Documentation Tool)",
        type: "Validated clinical screening instrument for identifying suspected abuse or neglect",
        action: "Standardized questionnaire or assessment guide used to systematically screen for physical abuse, emotional abuse, sexual abuse, financial exploitation, and neglect; validated tools (HITS, SAFE, EASI) provide evidence-based screening criteria that improve detection rates; results guide clinical decision-making regarding mandatory reporting obligations",
        sideEffects: "False-positive screening results may cause unnecessary distress and investigation; false-negative results may give false reassurance; screening without a private and safe environment may endanger the victim",
        contra: "Never administer screening questions in the presence of the suspected abuser; do not screen in a language the patient does not understand; do not rely solely on screening tools -- clinical judgment and observation remain essential",
        pearl: "Screen every patient at admission and at regular intervals per policy; always screen in a private setting; if using a translator, use a professional medical interpreter, NEVER a family member or friend of the patient; document screening results and actions taken in the patient chart"
      },
      {
        name: "Mandatory Report Form (Legal Documentation Tool)",
        type: "Jurisdiction-specific legal form for filing mandatory reports of suspected abuse or neglect",
        action: "Official document required by provincial/territorial/state law for reporting suspected child abuse, elder abuse, or domestic violence to the designated investigating authority (child protective services, adult protective services, or law enforcement); the form captures reporter information, victim demographics, type of suspected abuse, description of indicators, and immediate safety concerns",
        sideEffects: "Failure to complete and file the mandatory report form within the required timeframe (usually 24-48 hours after initial verbal report) may result in professional discipline, fines, or criminal charges; inaccurate information may misdirect the investigation",
        contra: "The mandatory report must be made regardless of whether the victim consents to the report; consent is NOT required for mandatory reporting; the obligation to report cannot be delegated to another professional (the nurse who has the suspicion must make the report)",
        pearl: "Make the initial report by TELEPHONE immediately upon suspicion, then follow up with the written mandatory report form within the timeframe specified by your jurisdiction (typically 24-48 hours); document in the patient chart that the report was made, including the date, time, authority contacted, and reference number if provided; good-faith reporters are legally protected from liability"
      }
    ],
    pearls: [
      "The legal standard for mandatory reporting is REASONABLE SUSPICION, not proof or certainty -- if the nurse suspects abuse or neglect based on observations, statements, or clinical findings, the report MUST be made regardless of whether the nurse believes the investigation will be substantiated",
      "Mandatory reporting supersedes the duty of confidentiality -- the nurse cannot withhold a report because the patient asks them not to report; the legal duty to protect vulnerable persons overrides the patient's wish for confidentiality in these situations",
      "Screen for abuse in a PRIVATE setting, NEVER in the presence of the suspected abuser -- victims may deny abuse if the abuser is present due to fear of retaliation; use professional interpreters, never family members",
      "Document using objective, factual language and direct quotes: write 'patient states my husband hit me with a belt' NOT 'patient is a domestic violence victim' -- the nurse documents observations and statements, not conclusions or diagnoses",
      "Patterned injuries (loop marks, parallel lines, circular burns, bite marks) and injuries in various stages of healing are highly suspicious for repeated non-accidental trauma and must be reported immediately",
      "Good-faith reporters are legally protected from civil and criminal liability in all Canadian provinces/territories and US states -- even if the investigation does not substantiate the report, the reporter cannot be held liable for reporting in good faith",
      "The obligation to report CANNOT be delegated -- the nurse who suspects abuse must make the report personally; telling a supervisor does not fulfill the legal obligation unless the nurse also personally contacts the designated reporting authority"
    ],
    quiz: [
      {
        question: "A practical nurse notices multiple bruises in various stages of healing on an elderly patient's arms and torso. The patient's caregiver explains the bruises are from the patient falling. What is the nurse's FIRST action?",
        options: [
          "Accept the caregiver's explanation and document the findings",
          "Confront the caregiver and demand a more detailed explanation",
          "Report the suspected elder abuse to the designated authority as required by mandatory reporting law",
          "Wait until the physician completes a full assessment before taking action"
        ],
        correct: 2,
        rationale: "Multiple bruises in various stages of healing are a red flag for repeated physical abuse. The practical nurse has a legal obligation to report suspected elder abuse to the designated authority (adult protective services) based on reasonable suspicion. The nurse does not need proof of abuse and should not wait for others to make the determination."
      },
      {
        question: "A patient who is a victim of domestic violence asks the practical nurse not to report the abuse, stating 'I don't want anyone to know.' What is the most appropriate nursing action?",
        options: [
          "Respect the patient's wishes and maintain confidentiality",
          "Explain that mandatory reporting laws require the nurse to report regardless of patient consent",
          "Document the patient's request and defer the decision to the physician",
          "Tell the patient that a report will only be made if injuries are life-threatening"
        ],
        correct: 1,
        rationale: "Mandatory reporting is a legal obligation that supersedes the duty of confidentiality. The nurse must explain this to the patient compassionately but clearly. The report must be made regardless of the patient's consent. The nurse should provide emotional support and information about available resources while fulfilling the legal reporting requirement."
      },
      {
        question: "When documenting a suspected case of child abuse, which documentation approach is most appropriate for the practical nurse?",
        options: [
          "Write 'child is clearly being abused by the father' based on clinical impression",
          "Record objective findings and the child's exact statements using direct quotation marks",
          "Omit details about injuries to protect the family's privacy",
          "Summarize findings briefly without specific details to avoid legal complications"
        ],
        correct: 1,
        rationale: "Documentation of suspected abuse must be objective, factual, and detailed. The nurse should record exactly what was observed (injury descriptions with size, shape, color, location) and what the patient or child stated using direct quotes. Subjective conclusions about perpetrator identity are inappropriate. Thorough documentation supports the investigation and may be used in legal proceedings."
      }
    ]
  },

  "masd-rpn": {
    title: "Moisture-Associated Skin Damage for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Moisture-Associated Skin Damage",
      content: "Moisture-associated skin damage (MASD) is a broad term encompassing skin injury caused by prolonged exposure to various sources of moisture, including urine, stool, perspiration, wound exudate, stomal effluent, and saliva. MASD represents a significant and preventable source of patient discomfort, increased infection risk, and healthcare costs. Understanding the pathophysiology of MASD requires knowledge of normal skin structure and function. The skin is the body's largest organ and serves as the primary barrier against the external environment. The stratum corneum (outermost layer of the epidermis) consists of flattened, keratinized cells (corneocytes) embedded in a lipid matrix, often described as a brick-and-mortar arrangement. This structure provides the critical barrier function that prevents water loss, protects against chemical penetration, and inhibits microbial invasion. The skin maintains a normal acidic pH of 4.0 to 6.5, often called the acid mantle, which inhibits bacterial and fungal colonization and supports the activity of enzymes essential for lipid barrier maintenance. When skin is exposed to excessive moisture, several pathological processes occur simultaneously. First, overhydration (maceration) causes the stratum corneum to absorb water and swell, weakening intercellular connections and disrupting the brick-and-mortar arrangement. Macerated skin appears waterlogged, white, wrinkled, and soft, and is significantly more susceptible to friction and mechanical damage. Second, the alkaline pH of urine (pH 6-8) and stool (pH 7-8) neutralizes the protective acid mantle, impairing antimicrobial defenses and activating fecal enzymes (lipases and proteases) that directly digest skin proteins and lipids. Liquid stool is more damaging than formed stool because it contains higher concentrations of active digestive enzymes and has a larger surface area of skin contact. Third, friction from wet skin against surfaces (linens, diapers, containment devices) causes mechanical stripping of the weakened epidermis, accelerating damage. There are four recognized categories of MASD. Incontinence-associated dermatitis (IAD) is the most common form, resulting from urinary and/or fecal incontinence. It presents as erythema, skin erosion, and denudation in areas exposed to urine and stool, predominantly the perineum, buttocks, posterior thighs, and lower abdomen. IAD must be differentiated from pressure injuries, though they frequently coexist. Key distinguishing features: IAD follows the pattern of moisture exposure (diffuse, irregular borders) while pressure injuries occur over bony prominences (localized, regular borders); IAD is typically superficial (partial-thickness) while pressure injuries can extend to deep tissue. Peristomal moisture-associated skin damage occurs around ostomy sites when effluent leaks beneath the pouching system and contacts peristomal skin. Intertriginous dermatitis (intertrigo) results from perspiration trapped in skin folds (under breasts, in groin creases, between abdominal pannus and thighs) where skin-on-skin contact prevents evaporation. Periwound moisture-associated skin damage results from wound exudate or drainage macerating the skin surrounding a wound. Secondary fungal infection with Candida albicans is a frequent complication of all forms of MASD because the warm, moist, alkaline environment created by moisture exposure provides ideal conditions for fungal proliferation. Satellite lesions (small papules or pustules surrounding the main area of erythema) are the hallmark finding of secondary candidal infection."
    },
    riskFactors: [
      "Urinary incontinence (functional, stress, urge, or overflow incontinence exposes perineal skin to alkaline urine that disrupts the acid mantle)",
      "Fecal incontinence, particularly liquid stool (contains active digestive enzymes -- lipases and proteases -- that chemically digest the skin; liquid stool is more damaging than formed stool)",
      "Dual incontinence of urine and stool combined (the most damaging combination; alkaline urine activates fecal enzymes, amplifying skin destruction)",
      "Obesity with redundant skin folds (intertriginous areas trap perspiration and prevent evaporation, creating warm moist environments ideal for MASD and fungal infection)",
      "Diaphoresis from fever, medication effects, or environmental factors (prolonged moisture exposure in skin folds and on bedding-contact areas)",
      "Presence of ostomy with effluent leakage (stomal output, particularly ileostomy effluent with high enzyme content, causes rapid chemical skin damage when it contacts peristomal skin)",
      "Immobility and inability to self-toilet (bedridden patients have prolonged exposure to incontinence because they cannot independently manage toileting)"
    ],
    diagnostics: [
      "Visual skin assessment: systematic inspection of all skin surfaces at risk (perineum, buttocks, inner thighs, skin folds, peristomal area, periwound skin) at least every shift and with each incontinence episode; document using a validated skin assessment tool",
      "Incontinence-Associated Dermatitis Intervention Tool (IAD-IT) or similar validated classification tool: categorizes severity (Category 1: intact skin with erythema; Category 2: skin loss with erosion, denudation, or secondary infection)",
      "Differentiation from pressure injury: IAD has diffuse erythema following moisture pattern with irregular borders and is superficial; pressure injury is localized over bony prominence with regular borders and may extend deep; BOTH can coexist and each must be documented separately",
      "Assessment for secondary Candida infection: look for satellite lesions (papules or pustules surrounding the main erythematous area), bright beefy red color with sharp borders, and involvement of skin fold creases -- clinical diagnosis; KOH preparation confirms if needed",
      "Moisture source identification: determine the specific moisture source (urine, stool, perspiration, wound exudate, stomal effluent) as this guides targeted prevention and treatment strategies",
      "Nutritional assessment: assess albumin, prealbumin, and dietary intake; malnutrition impairs skin integrity and wound healing; protein intake of at least 1.2-1.5 g/kg/day is recommended for skin repair"
    ],
    management: [
      "Implement structured skin care regimen using the CLEANSE, PROTECT, RESTORE approach: gently cleanse with pH-balanced perineal cleanser (avoid soap and water which further disrupts acid mantle), apply moisture barrier cream after each cleansing, and allow skin to heal between episodes",
      "Apply moisture barrier products prophylactically and therapeutically: dimethicone-based barriers for prevention and mild MASD; zinc oxide-based barriers for moderate to severe MASD (thicker barrier, longer lasting); petrolatum for skin fold protection",
      "Treat secondary Candida infection with topical antifungal powder (nystatin powder) applied to affected area before barrier cream application; allow powder to dry before applying barrier cream over top (crusting technique)",
      "Address the underlying moisture source: implement a structured toileting program for incontinence, optimize ostomy pouching system fit to prevent leakage, manage diaphoresis with environmental and pharmacological interventions, optimize wound dressing to contain exudate",
      "Use appropriate containment devices: external catheter (condom catheter) for male urinary incontinence, fecal management system for liquid stool incontinence in appropriate candidates; avoid indwelling urinary catheter solely for skin protection due to CAUTI risk",
      "Turn and reposition immobile patients at least every 2 hours; use moisture-wicking incontinence pads (not plastic-backed pads that trap moisture); keep skin folds separated with wicking fabric",
      "Consult wound care specialist or enterostomal therapy (ET) nurse for severe or refractory MASD, complex peristomal skin issues, or when standard interventions fail to improve skin condition within 5-7 days"
    ],
    nursingActions: [
      "Perform comprehensive skin assessment on admission and at least every shift, with focused assessment of at-risk areas (perineum, buttocks, skin folds, peristomal area) after each incontinence episode or moisture exposure",
      "Cleanse soiled skin gently using a pH-balanced no-rinse perineal cleanser and soft cloths; avoid harsh rubbing, standard bar soap, and hot water which strip natural oils and further damage the compromised acid mantle",
      "Apply barrier cream using gentle dabbing motions (not rubbing) to create a protective layer between the skin and moisture source; do NOT remove barrier cream with each cleansing unless visibly soiled -- reapply over existing barrier to avoid mechanical stripping",
      "Document all MASD findings accurately using validated tools: location, size, severity (Category 1 or 2), presence of satellite lesions indicating Candida infection, interventions implemented, and skin response to treatment",
      "Differentiate between MASD and pressure injury in documentation: both conditions can coexist on the same patient; IAD is documented as moisture-associated skin damage, NOT as a pressure injury; misclassification affects treatment approach and quality metrics",
      "Educate patient and family caregivers on MASD prevention: prompt cleansing after incontinence, proper barrier cream application technique, appropriate skin care products, and when to notify the nursing team",
      "Monitor and report treatment effectiveness: if MASD does not improve within 5-7 days of appropriate intervention, notify the supervising nurse and request wound care consultation for further assessment and management"
    ],
    assessmentFindings: [
      "IAD Category 1 (early): persistent erythema that may or may not blanch with pressure; skin is intact but appears pink to red in light skin tones or darker/purple in dark skin tones; may have mild warmth and patient reports discomfort, burning, or itching",
      "IAD Category 2 (advanced): partial-thickness skin loss with erosion, denudation (raw exposed dermis), or blister formation; bright red moist base; may have associated secondary infection with Candida",
      "Maceration: skin appears white, waterlogged, wrinkled, and softened from excessive moisture exposure; particularly evident at wound edges and in skin folds; macerated skin is highly vulnerable to mechanical damage from friction",
      "Secondary Candida infection: bright beefy-red erythema with well-defined borders, SATELLITE LESIONS (small papules or pustules extending beyond the main affected area), skin fold involvement, and often intense pruritus",
      "Peristomal MASD: erythema, erosion, and denudation of skin immediately surrounding the ostomy stoma; caused by effluent undermining the pouching system seal; may show pattern matching the area of appliance leak",
      "Intertriginous dermatitis (intertrigo): erythema, maceration, and potential erosion in skin fold areas (submammary, inguinal, abdominal pannus); mirror-image pattern on opposing skin surfaces; musty odor suggests secondary fungal or bacterial colonization"
    ],
    signs: {
      left: [
        "Mild perineal erythema with intact skin after incontinence episode",
        "Patient reports burning or discomfort in affected area",
        "Early maceration (white, softened skin) at wound edges or in skin folds",
        "Mild intertrigo in skin folds with erythema but no skin breakdown",
        "Slight peristomal skin redness without erosion",
        "Patient scratching or expressing discomfort in moisture-exposed areas"
      ],
      right: [
        "Extensive skin denudation with raw, weeping dermis exposed (Category 2 IAD)",
        "Satellite lesions indicating secondary Candida infection requiring antifungal treatment",
        "Skin breakdown extending to subcutaneous tissue with signs of secondary bacterial infection (purulent drainage, cellulitis)",
        "Severe peristomal skin erosion preventing ostomy appliance adherence",
        "Full-thickness skin loss in moisture-exposed area raising concern for concurrent pressure injury",
        "Signs of systemic infection (fever, elevated WBC) secondary to extensive skin breakdown"
      ]
    },
    medications: [
      {
        name: "Zinc Oxide Barrier Cream (Desitin, Ihle paste)",
        type: "Topical skin protectant / moisture barrier",
        action: "Forms a thick, occlusive physical barrier on the skin surface that repels moisture (urine, stool, perspiration) and prevents chemical contact between skin and irritants; zinc oxide has mild antiseptic and astringent properties that help reduce inflammation and promote healing of damaged skin; the paste formulation provides longer-lasting protection than dimethicone-based products",
        sideEffects: "Difficulty of removal may lead to mechanical stripping of fragile skin if rubbed off aggressively; thick application can obscure skin assessment; potential for zinc absorption through severely denuded skin (rare with topical use)",
        contra: "Known zinc allergy (rare); do not use on infected wounds without concurrent antimicrobial therapy; do not apply to deep or full-thickness wounds",
        pearl: "Apply a THICK layer (like icing on a cake) after each cleansing; do NOT remove the entire barrier cream with each incontinence episode -- gently remove soiled cream and reapply over the existing layer to avoid mechanical stripping of fragile skin; only remove completely when performing a thorough skin assessment"
      },
      {
        name: "Dimethicone-Based Moisture Barrier (3M Cavilon, Proshield)",
        type: "Topical skin protectant / silicone-based moisture barrier",
        action: "Forms a transparent, breathable, waterproof film on the skin surface that protects against moisture exposure while allowing oxygen and carbon dioxide exchange through the barrier; dimethicone (a silicone polymer) creates a hydrophobic surface that repels water, urine, and liquid stool without occluding the skin; gentler on intact skin than zinc oxide",
        sideEffects: "May not provide adequate protection for severe or prolonged moisture exposure (thinner barrier than zinc oxide); some patients may develop contact sensitivity to product ingredients; transparent film may make it difficult to assess underlying skin redness",
        contra: "Known hypersensitivity to dimethicone or product components; not recommended as sole protectant for severe IAD with skin denudation (zinc oxide provides superior protection for denuded skin)",
        pearl: "Best used for PREVENTION and mild MASD (Category 1 IAD with intact skin); easier to apply and remove than zinc oxide; some formulations come as no-sting barrier film sprays or wipes for easier application; reapply after each cleansing; upgrade to zinc oxide if skin does not improve within 48 hours"
      },
      {
        name: "Nystatin Powder (Mycostatin)",
        type: "Topical polyene antifungal",
        action: "Binds to ergosterol in the fungal cell membrane of Candida species, creating pores that alter membrane permeability and cause leakage of intracellular contents, leading to fungal cell death; nystatin powder is the preferred formulation for MASD with secondary Candida infection because it absorbs excess moisture while delivering antifungal medication directly to the affected skin surface",
        sideEffects: "Local skin irritation, contact dermatitis (rare), burning sensation on application to denuded skin; nystatin is not absorbed systemically from intact skin so systemic side effects do not occur",
        contra: "Known hypersensitivity to nystatin or product components; not effective against dermatophyte infections (tinea) -- only effective against Candida species",
        pearl: "Use the CRUSTING TECHNIQUE for MASD with secondary Candida: apply nystatin powder to the affected area, gently brush off excess, then apply zinc oxide or dimethicone barrier cream over the powder; this creates a protective antifungal barrier layer; satellite lesions (papules surrounding the main rash) are the clinical hallmark of Candida infection and indicate need for antifungal treatment"
      }
    ],
    pearls: [
      "MASD and pressure injuries are DIFFERENT conditions that require different prevention and treatment strategies but frequently coexist on the same patient -- IAD follows moisture exposure patterns with irregular borders while pressure injuries occur over bony prominences with regular borders",
      "The CRUSTING TECHNIQUE for Candida-complicated MASD: apply nystatin antifungal powder first, gently brush off excess, then apply barrier cream (zinc oxide) over top -- this creates a medicated protective barrier that treats infection while protecting from further moisture damage",
      "Do NOT remove barrier cream with every incontinence episode -- gently cleanse soiled cream only and reapply fresh barrier over the remaining layer; completely removing and reapplying barrier cream each time causes mechanical stripping that worsens skin damage",
      "Liquid stool is MORE damaging to skin than formed stool because it contains higher concentrations of active digestive enzymes (lipases and proteases) and covers a larger skin surface area -- patients with liquid stool incontinence need more aggressive skin protection",
      "Satellite lesions (small papules or pustules extending beyond the border of the main rash) are the hallmark clinical sign of secondary Candida infection in MASD -- when you see satellites, initiate antifungal treatment with nystatin powder",
      "Use pH-balanced no-rinse perineal cleansers instead of soap and water for incontinence-related cleansing -- standard soap is alkaline (pH 9-10) and further disrupts the skin's protective acid mantle (normal pH 4.0-6.5), worsening MASD",
      "For intertriginous dermatitis in skin folds, keep opposing skin surfaces separated using moisture-wicking fabric or absorbent textile between folds; avoid corn starch as it provides a food source for Candida and can worsen fungal infections"
    ],
    quiz: [
      {
        question: "A practical nurse observes bright beefy-red erythema with satellite lesions in a patient's perineal area who has been experiencing fecal incontinence. Which intervention should the nurse implement?",
        options: [
          "Apply a thick layer of zinc oxide cream only and monitor",
          "Apply nystatin antifungal powder followed by barrier cream (crusting technique)",
          "Wash the area with standard bar soap and hot water to remove organisms",
          "Apply hydrocortisone cream to reduce the inflammation"
        ],
        correct: 1,
        rationale: "Satellite lesions are the hallmark of secondary Candida infection complicating MASD. The crusting technique (nystatin powder applied first, excess brushed off, then barrier cream applied over top) provides both antifungal treatment and moisture protection. Soap and hot water would worsen the condition by further disrupting the acid mantle."
      },
      {
        question: "A practical nurse is educating a care aide about perineal care for a patient with incontinence-associated dermatitis. Which instruction is most important for preventing further skin damage?",
        options: [
          "Remove all barrier cream completely with each incontinence episode and reapply fresh cream",
          "Gently cleanse soiled barrier cream only and reapply over the existing protective layer",
          "Use standard bar soap and hot water to ensure thorough cleaning of the perineal area",
          "Apply corn starch to the perineal area to absorb excess moisture"
        ],
        correct: 1,
        rationale: "Completely removing barrier cream with each episode causes mechanical stripping of fragile skin, worsening MASD. The correct technique is to gently remove only the soiled portion and reapply fresh barrier over the remaining protective layer. Bar soap disrupts the acid mantle, and corn starch promotes Candida growth."
      },
      {
        question: "A practical nurse is assessing a patient with a new area of skin redness on the buttocks. Which finding would best help differentiate incontinence-associated dermatitis from a pressure injury?",
        options: [
          "The patient reports pain at the affected site",
          "The affected area has diffuse erythema following the pattern of moisture exposure with irregular borders",
          "The skin is warm to touch in the affected area",
          "The affected area shows partial-thickness skin loss"
        ],
        correct: 1,
        rationale: "IAD follows the pattern of moisture exposure and has diffuse, irregular borders, while pressure injuries occur over bony prominences and have well-defined, regular borders. Pain, warmth, and partial-thickness skin loss can occur in both conditions and do not reliably differentiate them. Correct identification determines the appropriate treatment strategy."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
