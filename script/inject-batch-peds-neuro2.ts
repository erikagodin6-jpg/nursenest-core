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
  "pupil-assessment-rpn": {
    title: "Pupil Assessment for Practical Nurses",
    cellular: {
      title: "Neuroanatomy and Physiology of Pupillary Response",
      content: "The pupil is the circular opening in the center of the iris that regulates the amount of light entering the eye. Pupil size is controlled by two sets of smooth muscles within the iris: the sphincter pupillae (parasympathetic innervation via cranial nerve III, the oculomotor nerve) which constricts the pupil (miosis), and the dilator pupillae (sympathetic innervation via the cervical sympathetic chain) which dilates the pupil (mydriasis). The pupillary light reflex is a critical neurological assessment that tests the integrity of both the afferent pathway (cranial nerve II, the optic nerve, which carries light signals from the retina to the pretectal nucleus in the midbrain) and the efferent pathway (cranial nerve III, which carries the motor signal from the Edinger-Westphal nucleus to the sphincter pupillae muscle). When light is directed into one eye, the ipsilateral pupil constricts (direct response) and the contralateral pupil also constricts (consensual response) because the pretectal nucleus sends signals bilaterally to both Edinger-Westphal nuclei. This bilateral response is why both pupils are tested individually -- a defect in the consensual response helps localize pathology. The accommodation reflex occurs when the eyes shift focus from a distant to a near object: the pupils constrict, the lenses thicken (accommodation), and the eyes converge (vergence). Pupil assessment is documented using the mnemonic PERRLA: Pupils Equal, Round, Reactive to Light and Accommodation. Normal pupil size ranges from 2 to 5 millimeters and should be equal bilaterally, with a difference of less than 1 mm considered physiological (physiological anisocoria, present in approximately 20% of the population). The practical nurse must understand that pupil changes can indicate life-threatening conditions including increased intracranial pressure (unilateral fixed dilated pupil from CN III compression), brainstem herniation (bilateral fixed dilated pupils), opioid overdose (bilateral pinpoint pupils), and anticholinergic toxicity (bilateral dilated pupils). A pupil gauge (a card with printed circles of graduated sizes from 1 to 9 mm) is used to measure pupil diameter objectively. Assessment should always be performed in a dimly lit room to allow natural dilation, and each eye should be tested independently with the other eye shielded. The speed of pupillary response is graded as brisk (normal), sluggish (delayed constriction suggesting early pathology), or fixed/nonreactive (no response, indicating severe neurological compromise). Changes in pupil reactivity often precede other signs of neurological deterioration, making accurate pupil assessment one of the most time-sensitive neurological monitoring skills for the practical nurse."
    },
    riskFactors: [
      "Traumatic brain injury or head trauma (direct compression of cranial nerve III)",
      "Intracranial hemorrhage or expanding mass lesion (uncal herniation compresses CN III)",
      "Post-neurosurgical procedure (manipulation near optic or oculomotor nerves)",
      "Opioid or sedative medication use (bilateral miosis from mu-receptor activation)",
      "Anticholinergic medication use (bilateral mydriasis from parasympathetic blockade)",
      "Diabetes mellitus (autonomic neuropathy affecting pupillary reflexes)",
      "Glaucoma or history of eye surgery (structural changes affecting iris mobility)"
    ],
    diagnostics: [
      "Pupil gauge measurement: objective documentation of pupil diameter in millimeters using a standardized pupil gauge card; measure each eye independently in dim ambient light",
      "Penlight examination: direct light into each eye individually while observing both direct (ipsilateral) and consensual (contralateral) responses; grade speed as brisk, sluggish, or fixed",
      "Glasgow Coma Scale (GCS): pupil assessment is performed alongside GCS scoring; a GCS score of 8 or below with pupil changes indicates severe neurological compromise",
      "CT scan of the head: ordered when pupil changes suggest increased intracranial pressure, hemorrhage, or mass effect; the practical nurse reports findings and prepares the patient for transport",
      "Neurological vital signs (neuro checks): serial assessments of pupil size, reactivity, and symmetry performed at intervals ordered by the physician (every 15 minutes to every 4 hours)",
      "Swinging flashlight test: alternating light between eyes to detect a relative afferent pupillary defect (Marcus Gunn pupil); the affected pupil paradoxically dilates when light swings to it"
    ],
    management: [
      "Perform pupil assessment as part of every neurological check using a standardized pupil gauge and penlight in a dimly lit environment",
      "Report any new pupil asymmetry (anisocoria greater than 1 mm), loss of reactivity, or change from baseline immediately to the registered nurse and physician",
      "Maintain head of bed elevation at 30 degrees for patients with suspected increased intracranial pressure to promote venous drainage from the brain",
      "Keep the environment dim during assessment but ensure adequate documentation lighting afterward; avoid prolonged bright light exposure that could cause pupil fatigue",
      "Document pupil findings using standardized terminology: size in mm (right and left), shape (round vs irregular), reactivity (brisk/sluggish/fixed), and equality (equal vs unequal)",
      "For patients receiving opioid medications, monitor for bilateral pinpoint pupils and correlate with respiratory rate and level of consciousness",
      "Prepare emergency equipment (oxygen, suction, bag-valve mask) at bedside for patients with deteriorating pupil responses as this may precede respiratory or cardiac arrest"
    ],
    nursingActions: [
      "Assess pupils at the beginning of every shift and compare to previous documented findings to establish trending data",
      "Use PERRLA documentation: Pupils Equal, Round, Reactive to Light and Accommodation -- document any deviation from this standard",
      "Dim the room lights before assessment to allow pupils to dilate naturally; shine the penlight from the lateral side of each eye to observe direct and consensual responses",
      "Report a unilateral fixed and dilated pupil immediately -- this is the hallmark sign of uncal herniation and CN III compression, which is a neurosurgical emergency",
      "Monitor patients receiving mydriatic eye drops (atropine, tropicamide) separately from neurological pupil assessment; document which eye received drops to prevent false alarms",
      "Correlate pupil changes with other neurological findings including level of consciousness, motor response, and vital signs (Cushing triad: hypertension, bradycardia, irregular respirations)",
      "Never delay reporting abnormal pupil findings -- changes in pupil reactivity can precede clinical deterioration by minutes to hours, and early detection saves lives"
    ],
    assessmentFindings: [
      "Normal findings (PERRLA): pupils 2-5 mm, equal bilaterally (within 1 mm), round, brisk constriction to light with both direct and consensual response intact",
      "Unilateral fixed dilated pupil (blown pupil): ipsilateral pupil 6-9 mm, nonreactive to light; indicates CN III compression from uncal herniation -- neurosurgical emergency",
      "Bilateral pinpoint pupils (miosis less than 2 mm): seen in opioid overdose, pontine hemorrhage, or cholinergic medication effects; check respiratory rate immediately",
      "Bilateral fixed dilated pupils (mydriasis greater than 6 mm): may indicate severe brainstem damage, cardiac arrest, anticholinergic toxicity, or sympathomimetic drugs",
      "Sluggish pupil response: delayed or incomplete constriction to light; early sign of increased intracranial pressure or CN III compression before complete fixation",
      "Hippus (pupillary hippus): rhythmic oscillation of the pupil between constriction and dilation when light is held steady; may be normal or indicate early neurological changes",
      "Argyll Robertson pupils: small irregular pupils that accommodate (constrict with near focus) but do not react to light; classically associated with neurosyphilis"
    ],
    signs: {
      left: [
        "Slight pupil asymmetry (less than 1 mm difference -- may be physiological)",
        "Sluggish but present light response bilaterally",
        "Pupil constriction to accommodation intact",
        "Mild headache reported by patient",
        "Pupil size at upper limit of normal (5 mm) in bright light",
        "Bilateral miosis with known opioid administration"
      ],
      right: [
        "Unilateral fixed dilated pupil (blown pupil -- CN III compression emergency)",
        "Bilateral fixed and dilated pupils (brainstem herniation or cardiac arrest)",
        "Rapidly progressive anisocoria (increasing asymmetry over minutes)",
        "Loss of direct and consensual light reflexes",
        "Pupil changes accompanied by decreased level of consciousness",
        "Cushing triad (hypertension, bradycardia, irregular respirations) with pupil changes"
      ]
    },
    medications: [
      {
        name: "Atropine Sulfate (ophthalmic)",
        type: "Anticholinergic / Mydriatic agent",
        action: "Blocks acetylcholine at muscarinic receptors in the sphincter pupillae and ciliary muscle of the iris, causing sustained pupil dilation (mydriasis) and paralysis of accommodation (cycloplegia); used diagnostically for fundoscopic examination and therapeutically for uveitis",
        sideEffects: "Blurred vision (may last 7-14 days), photophobia, increased intraocular pressure, stinging on instillation, dry mouth, tachycardia (from systemic absorption especially in children)",
        contra: "Narrow-angle (angle-closure) glaucoma (can precipitate acute attack by blocking aqueous humor drainage); known hypersensitivity; use extreme caution in infants and elderly due to systemic absorption risk",
        pearl: "Always apply gentle pressure to the nasolacrimal duct (punctal occlusion) for 1-2 minutes after instillation to minimize systemic absorption; document which eye received the drop so neurological pupil assessments are not falsely interpreted"
      },
      {
        name: "Mannitol (Osmitrol)",
        type: "Osmotic diuretic",
        action: "Creates an osmotic gradient in the blood that draws water from the brain parenchyma and cerebrospinal fluid into the intravascular space, reducing cerebral edema and intracranial pressure; also reduces intraocular pressure by similar osmotic mechanism",
        sideEffects: "Fluid and electrolyte imbalances (hyponatremia, hypokalemia), dehydration, hypotension, rebound increased intracranial pressure, pulmonary edema if given too rapidly, crystallization in IV line at low temperatures",
        contra: "Severe renal failure (anuria), active intracranial hemorrhage (can worsen bleeding by reducing tamponade effect), severe dehydration, pulmonary edema, severe heart failure",
        pearl: "Use an in-line filter (5-micron) for IV administration to prevent crystallized particles from entering the bloodstream; warm the solution if crystals are visible; monitor serum osmolality (hold if greater than 320 mOsm/kg); monitor urine output hourly -- expect significant diuresis"
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist",
        action: "Competitively binds to mu, kappa, and delta opioid receptors, displacing opioid agonists and rapidly reversing their effects including respiratory depression, sedation, and miosis (pinpoint pupils); onset within 1-2 minutes IV",
        sideEffects: "Acute opioid withdrawal symptoms (agitation, nausea, vomiting, diaphoresis, tachycardia, hypertension, tremor), seizures (rare), pulmonary edema (rare with high doses)",
        contra: "Known hypersensitivity; use with caution in patients with chronic opioid dependence (will precipitate withdrawal); use with caution in patients with cardiovascular disease (withdrawal-induced sympathetic surge)",
        pearl: "Duration of action is 30-90 minutes, which is shorter than most opioids -- monitor for re-sedation and repeat dosing may be necessary; when bilateral pinpoint pupils are observed with respiratory depression, administer naloxone as ordered and monitor continuously"
      }
    ],
    pearls: [
      "PERRLA is the standard documentation format: Pupils Equal, Round, Reactive to Light and Accommodation -- any deviation from this standard must be immediately documented and reported",
      "A unilateral fixed dilated pupil (blown pupil) is the hallmark sign of uncal herniation compressing cranial nerve III -- this is a neurosurgical emergency requiring immediate notification",
      "Always assess pupils in a dimly lit room and shine the penlight from the lateral side of the eye to get the most accurate response -- direct overhead light causes the pupil to be already partially constricted",
      "Bilateral pinpoint pupils with decreased respiratory rate and decreased level of consciousness form the classic triad of opioid overdose -- correlate pupil findings with medication administration records",
      "Physiological anisocoria (pupil difference less than 1 mm) is present in approximately 20% of the healthy population -- always compare to baseline assessment before reporting as abnormal",
      "The consensual response (contralateral pupil constricting when light is shone in the opposite eye) tests the integrity of the bilateral neural pathway through the pretectal nucleus -- absence indicates specific localized pathology",
      "Pupil changes often precede other signs of neurological deterioration by minutes to hours -- accurate, timely pupil assessment is one of the most important early warning assessments the practical nurse performs"
    ],
    quiz: [
      {
        question: "A practical nurse shines a penlight into a patient's right eye. The left pupil constricts simultaneously. This response is known as which type of pupillary reflex?",
        options: [
          "Direct light reflex",
          "Consensual light reflex",
          "Accommodation reflex",
          "Corneal reflex"
        ],
        correct: 1,
        rationale: "The consensual light reflex occurs when the contralateral (opposite) pupil constricts in response to light directed into the other eye. This occurs because the pretectal nucleus sends signals bilaterally to both Edinger-Westphal nuclei. The direct reflex is constriction of the ipsilateral (same side) pupil."
      },
      {
        question: "A patient with a head injury has a right pupil measuring 7 mm that is fixed and nonreactive to light, while the left pupil is 3 mm and reactive. The practical nurse should recognize this finding as indicating which condition?",
        options: [
          "Opioid overdose",
          "Physiological anisocoria",
          "Uncal herniation with CN III compression",
          "Anticholinergic toxicity"
        ],
        correct: 2,
        rationale: "A unilateral fixed dilated pupil in a patient with a head injury is the hallmark sign of uncal herniation causing compression of the ipsilateral oculomotor nerve (CN III). This is a neurosurgical emergency. Opioid overdose causes bilateral pinpoint pupils, physiological anisocoria involves less than 1 mm difference, and anticholinergic toxicity causes bilateral dilation."
      },
      {
        question: "A patient receiving morphine via patient-controlled analgesia (PCA) is found with bilateral pinpoint pupils, respiratory rate of 6 breaths per minute, and is difficult to arouse. Which medication should the practical nurse anticipate being administered?",
        options: [
          "Atropine sulfate",
          "Mannitol",
          "Naloxone",
          "Diphenhydramine"
        ],
        correct: 2,
        rationale: "Bilateral pinpoint pupils, respiratory depression, and decreased level of consciousness are the classic triad of opioid overdose. Naloxone (Narcan) is the opioid antagonist that rapidly reverses these effects by competitively binding to opioid receptors. The practical nurse should also stop the PCA infusion and maintain the airway."
      }
    ]
  },

  "pyloric-stenosis-basics-rpn": {
    title: "Hypertrophic Pyloric Stenosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hypertrophic Pyloric Stenosis",
      content: "Hypertrophic pyloric stenosis (HPS) is a condition characterized by progressive hypertrophy and hyperplasia of the circular smooth muscle layer of the pylorus, the muscular valve between the stomach and the duodenum. This thickening narrows the pyloric channel, creating a functional gastric outlet obstruction that progressively worsens over the first weeks of life. The pylorus normally functions as a sphincter that regulates the passage of gastric contents (chyme) from the stomach into the duodenum. In HPS, the pyloric muscle thickens to two to three times its normal size, elongates, and becomes firm and cartilaginous in consistency, forming a palpable mass in the right upper quadrant or epigastric region often described as an olive-shaped mass. The exact etiology remains unclear, but evidence suggests a multifactorial inheritance pattern with both genetic and environmental components. HPS is four times more common in males than females, with firstborn males at highest risk. The incidence is approximately 2-5 per 1,000 live births, making it one of the most common conditions requiring surgical intervention in infancy. Symptoms typically present between 2 and 8 weeks of age, with a peak incidence at 3 to 5 weeks. The hallmark presentation is progressive, projectile, non-bilious vomiting that occurs immediately after feeding. The vomiting is non-bilious (contains no bile -- the vomitus appears like curdled milk) because the obstruction is proximal to the ampulla of Vater where bile enters the duodenum. As the obstruction worsens, the infant becomes progressively dehydrated and develops a characteristic metabolic alkalosis with hypochloremia and hypokalemia. This metabolic derangement occurs because the infant loses large amounts of hydrochloric acid (HCl) through vomiting: loss of hydrogen ions (H+) causes alkalosis, loss of chloride ions (Cl-) causes hypochloremia, and the kidneys compensate by retaining H+ in exchange for potassium (K+), causing hypokalemia. Despite vomiting, infants with HPS are characteristically hungry and want to feed immediately after vomiting (hungry vomiter). Physical examination may reveal visible gastric peristaltic waves moving from left to right across the upper abdomen after feeding, and the olive-shaped mass may be palpable in the right upper quadrant during or immediately after a feeding attempt. Definitive treatment is the Ramstedt pyloromyotomy, a surgical procedure in which the hypertrophied pyloric muscle is incised longitudinally down to the submucosa without penetrating the mucosa, relieving the obstruction. Before surgery, correction of dehydration and electrolyte imbalances is the immediate priority."
    },
    riskFactors: [
      "Male sex (4:1 male-to-female ratio; firstborn males at highest risk)",
      "Family history of pyloric stenosis (genetic predisposition with multifactorial inheritance)",
      "Macrolide antibiotic exposure in first 2 weeks of life (erythromycin increases risk significantly)",
      "Maternal macrolide use during late pregnancy or breastfeeding",
      "Bottle feeding (some studies suggest higher incidence compared to exclusively breastfed infants)",
      "Preterm birth (higher incidence in premature infants)",
      "Caucasian ethnicity (higher incidence compared to other racial groups)"
    ],
    diagnostics: [
      "Abdominal ultrasound: gold standard diagnostic test; pyloric muscle thickness greater than 3 mm and pyloric channel length greater than 15 mm are diagnostic; non-invasive with no radiation exposure",
      "Serum electrolytes: reveals hypochloremic, hypokalemic metabolic alkalosis from persistent vomiting of gastric acid (HCl); must be corrected before surgery",
      "Blood gas analysis: metabolic alkalosis (pH above 7.45, elevated HCO3-) with possible respiratory compensation (increased PaCO2 from shallow breathing)",
      "Physical examination: palpation of olive-shaped mass in the right upper quadrant or epigastric region; visible gastric peristaltic waves moving left to right across the upper abdomen",
      "Upper GI series (barium swallow): if ultrasound is inconclusive; shows string sign (elongated narrow pyloric channel) and shoulder sign (impression of hypertrophied pylorus on the duodenal bulb)",
      "BUN and creatinine: elevated BUN with normal creatinine (prerenal azotemia) indicates significant dehydration from fluid losses"
    ],
    management: [
      "NPO status: nothing by mouth once diagnosis is suspected; insert and maintain nasogastric tube for gastric decompression to prevent further vomiting and aspiration risk",
      "IV fluid resuscitation: administer normal saline (0.9% NaCl) with potassium chloride supplementation as ordered to correct dehydration and electrolyte imbalances BEFORE surgery",
      "Electrolyte correction is the surgical priority: surgery is NOT performed until serum chloride is above 100 mEq/L, potassium is above 3.5 mEq/L, and bicarbonate is below 30 mEq/L",
      "Ramstedt pyloromyotomy: definitive surgical treatment; the hypertrophied muscle is split longitudinally without cutting the mucosa; may be performed open or laparoscopically",
      "Postoperative feeding: initiate small, frequent feedings (pedialyte first, then half-strength formula, then full-strength) gradually starting 4-6 hours after surgery as ordered",
      "Monitor for postoperative vomiting: some vomiting is expected in the first 24-48 hours after pyloromyotomy due to edema at the surgical site; persistent vomiting may indicate incomplete myotomy",
      "Maintain strict intake and output with daily weights: weigh diapers (1 gram equals 1 mL of urine output); goal urine output is 1-2 mL/kg/hour in infants"
    ],
    nursingActions: [
      "Weigh the infant daily at the same time on the same scale with minimal clothing to accurately track hydration status and weight recovery",
      "Monitor for signs of dehydration: sunken anterior fontanelle, decreased skin turgor, dry mucous membranes, decreased urine output (fewer than 6 wet diapers per day), and no tears when crying",
      "Position the infant upright or on the right side after feeding to promote gastric emptying and reduce vomiting risk",
      "Assess the surgical incision site for signs of infection (redness, swelling, drainage, dehiscence) and keep the incision clean and dry per surgeon orders",
      "Monitor IV site hourly in infants (infiltration risk is higher due to small fragile veins); use a volumetric infusion pump for all pediatric IV fluids",
      "Provide parental education and emotional support: explain the condition, surgical procedure, and expected recovery; reassure parents that the prognosis after pyloromyotomy is excellent with full cure expected",
      "Report any bilious (green) vomiting immediately -- this is NOT consistent with pyloric stenosis and suggests a different, potentially more serious condition such as intestinal malrotation with volvulus"
    ],
    assessmentFindings: [
      "Projectile, non-bilious vomiting after feeding: vomiting occurs forcefully (can travel several feet) and contains no bile (curdled milk appearance); progressively worsens over days to weeks",
      "Olive-shaped mass palpable in the right upper quadrant or epigastric region: best palpated during or immediately after a feeding attempt with the infant's abdomen relaxed",
      "Visible gastric peristaltic waves: wave-like movement visible across the upper abdomen from left to right after feeding, representing the stomach contracting against the obstructed pylorus",
      "Signs of dehydration: sunken fontanelle, decreased skin turgor, dry mucous membranes, concentrated urine, decreased urine output, weight loss",
      "Hungry infant despite vomiting: the classic hungry vomiter -- the infant eagerly feeds immediately after vomiting because the stomach is empty",
      "Failure to gain weight or weight loss: inadequate nutrition from persistent vomiting leads to caloric deficit and growth failure",
      "Metabolic alkalosis on laboratory results: elevated pH, elevated bicarbonate, low chloride, low potassium from loss of gastric acid"
    ],
    signs: {
      left: [
        "Occasional spitting up after feeds (may be normal regurgitation)",
        "Mild fussiness or irritability after feeding",
        "Slightly decreased urine output noted on diaper count",
        "Infant appears hungry after feeding episodes",
        "Mild weight plateauing (not yet losing weight)",
        "Soft, non-distended abdomen on palpation"
      ],
      right: [
        "Projectile vomiting that is forceful and worsening in frequency",
        "Severe dehydration (sunken fontanelle, tenting skin turgor, no tears)",
        "Palpable olive-shaped mass in the right upper quadrant",
        "Visible peristaltic waves across the upper abdomen",
        "Significant weight loss (more than 5% birth weight lost)",
        "Electrolyte derangement: hypochloremic, hypokalemic metabolic alkalosis"
      ]
    },
    medications: [
      {
        name: "Atropine Sulfate (IV/oral)",
        type: "Anticholinergic / Antispasmodic agent",
        action: "Blocks acetylcholine at muscarinic receptors in the pyloric smooth muscle, reducing pyloric spasm and allowing partial relaxation of the hypertrophied pylorus; used as a non-surgical alternative in some cases where surgery is contraindicated or as a temporizing measure",
        sideEffects: "Tachycardia, facial flushing, decreased secretions (dry mouth), urinary retention, constipation, irritability, fever (impaired thermoregulation in infants)",
        contra: "Complete pyloric obstruction (atropine only works for incomplete obstruction); tachyarrhythmias; intestinal obstruction distal to pylorus; myasthenia gravis",
        pearl: "Atropine therapy is rarely used in North America as pyloromyotomy is the standard of care; when used, monitor heart rate closely -- withhold dose if heart rate exceeds 200 bpm in infants; therapy requires weeks to months of administration"
      },
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid IV fluid",
        action: "Provides sodium (154 mEq/L) and chloride (154 mEq/L) to replace both the extracellular fluid deficit from dehydration and the specific chloride losses from vomiting of hydrochloric acid; restores intravascular volume and corrects hypochloremia",
        sideEffects: "Fluid overload (crackles, edema, tachycardia), hyperchloremic metabolic acidosis with excessive administration, dilutional hyponatremia if combined with free water",
        contra: "Hypernatremia, fluid overload, congestive heart failure; use caution in renal impairment",
        pearl: "Normal saline is the initial resuscitation fluid of choice for pyloric stenosis because it specifically replaces the chloride lost through vomiting; add potassium chloride (KCl) to the infusion ONLY after urine output is confirmed (verify renal function before supplementing potassium)"
      },
      {
        name: "Potassium Chloride (KCl)",
        type: "Electrolyte replacement",
        action: "Replaces potassium losses that occur through two mechanisms in pyloric stenosis: direct loss of potassium in vomited gastric fluid, and renal potassium wasting as the kidneys attempt to compensate for metabolic alkalosis by excreting potassium in exchange for hydrogen ion reabsorption",
        sideEffects: "Hyperkalemia (cardiac arrest risk -- peaked T waves, widened QRS, ventricular fibrillation), phlebitis at IV site, GI irritation (nausea, vomiting) with oral form, cardiac dysrhythmias",
        contra: "Hyperkalemia, severe renal impairment (unable to excrete potassium), anuria or oliguria (must confirm urine output before administration), Addison disease (adrenal insufficiency causes potassium retention)",
        pearl: "NEVER administer IV potassium as a bolus -- always dilute and infuse via pump; in pediatric patients, maximum concentration is typically 40 mEq/L for peripheral IV and infusion rate should not exceed 0.5 mEq/kg/hour; always verify urine output BEFORE adding KCl to IV fluids"
      }
    ],
    pearls: [
      "The classic presentation of pyloric stenosis is a 3 to 5 week old firstborn male with progressive, projectile, NON-BILIOUS vomiting who is a hungry vomiter -- commits these three features to memory for exam questions",
      "Non-bilious vomiting is the key differentiator: the obstruction is ABOVE the ampulla of Vater (where bile enters), so bile cannot be present in the vomitus -- bilious (green) vomiting suggests a different and potentially more dangerous diagnosis",
      "The olive-shaped mass is pathognomonic for pyloric stenosis and is best palpated in the right upper quadrant during or immediately after a feeding attempt when the abdomen is relaxed",
      "Correct the electrolytes BEFORE surgery: surgery is delayed until chloride is above 100 mEq/L, potassium is above 3.5 mEq/L, and bicarbonate is below 30 mEq/L -- operating on an alkalotic infant increases anesthesia risk",
      "The metabolic derangement follows a predictable pattern: vomiting HCl causes loss of H+ (alkalosis) and Cl- (hypochloremia); the kidneys compensate by retaining H+ and excreting K+ (hypokalemia) -- this is hypochloremic, hypokalemic metabolic alkalosis",
      "Confirm urine output BEFORE adding potassium to IV fluids -- administering potassium to an anuric or oliguric infant can cause fatal hyperkalemia",
      "Postoperative vomiting after pyloromyotomy is common in the first 24-48 hours and does NOT necessarily indicate surgical failure -- feed slowly with small volumes and advance gradually as tolerated"
    ],
    quiz: [
      {
        question: "A 4-week-old male infant presents with progressively worsening projectile vomiting after every feeding. The vomitus appears like curdled milk with no green color. The infant eagerly feeds again after vomiting. Which condition does the practical nurse suspect?",
        options: [
          "Gastroesophageal reflux disease (GERD)",
          "Hypertrophic pyloric stenosis",
          "Intestinal malrotation with volvulus",
          "Intussusception"
        ],
        correct: 1,
        rationale: "Progressive projectile non-bilious vomiting in a 3-5 week old male who is a hungry vomiter (feeds eagerly after vomiting) is the classic presentation of hypertrophic pyloric stenosis. Bilious (green) vomiting would suggest malrotation with volvulus. GERD causes effortless spitting up rather than projectile vomiting."
      },
      {
        question: "Before a scheduled pyloromyotomy, the practical nurse reviews the infant's laboratory results: pH 7.52, bicarbonate 34 mEq/L, potassium 2.9 mEq/L, chloride 88 mEq/L. Which action is the priority?",
        options: [
          "Prepare the infant for immediate surgery",
          "Notify the physician that electrolytes need correction before surgery",
          "Begin oral rehydration therapy",
          "Administer sodium bicarbonate intravenously"
        ],
        correct: 1,
        rationale: "Surgery for pyloric stenosis is NOT performed until electrolyte imbalances are corrected: chloride must be above 100 mEq/L, potassium above 3.5 mEq/L, and bicarbonate below 30 mEq/L. This infant has severe hypochloremic, hypokalemic metabolic alkalosis that must be corrected with IV normal saline and potassium chloride before surgery can proceed safely."
      },
      {
        question: "The practical nurse is caring for an infant diagnosed with pyloric stenosis. The physician orders IV fluids with potassium chloride. Which assessment must the practical nurse confirm BEFORE adding potassium to the IV fluid?",
        options: [
          "The infant's blood glucose level",
          "The infant's weight in kilograms",
          "Adequate urine output",
          "The infant's temperature"
        ],
        correct: 2,
        rationale: "Urine output must be confirmed before administering potassium chloride because the kidneys are the primary route of potassium excretion. If the infant is anuric or oliguric (from severe dehydration), potassium cannot be excreted and will accumulate, potentially causing fatal hyperkalemia and cardiac arrest."
      }
    ]
  },

  "rabies-post-exposure-rpn": {
    title: "Rabies Post-Exposure Prophylaxis for Practical Nurses",
    cellular: {
      title: "Virology and Pathophysiology of Rabies Infection",
      content: "Rabies is an acute viral encephalomyelitis caused by the rabies virus, a single-stranded RNA virus belonging to the family Rhabdoviridae, genus Lyssavirus. The virus has a distinctive bullet-shaped morphology and is one of the most lethal viral infections known, with a case fatality rate approaching 100% once clinical symptoms develop. Rabies is a zoonotic disease transmitted to humans through the saliva of infected animals, most commonly through bites but also through scratches, open wounds, or mucous membrane exposure to infected saliva. In North America, the primary reservoir species are bats (most common cause of human rabies in the United States and Canada), raccoons, skunks, and foxes. Domestic dogs remain the most common source of human rabies globally, particularly in developing countries. After inoculation through a bite wound, the rabies virus enters peripheral nerve endings at the wound site. Unlike most viruses, rabies does not spread through the bloodstream -- it travels exclusively via retrograde axonal transport along peripheral nerves toward the central nervous system at a rate of approximately 12-24 mm per day. This slow neural transport creates the characteristically long and variable incubation period of 1 to 3 months (range: days to years), with bites closer to the brain (face, head) having shorter incubation periods. Once the virus reaches the dorsal root ganglia and spinal cord, it rapidly ascends to the brain where it causes severe encephalitis. The virus has a particular tropism for the limbic system (causing aggression and behavioral changes) and the hippocampus. After CNS infection, the virus spreads centrifugally (outward) along peripheral nerves to multiple organs including the salivary glands (enabling transmission through saliva), the cornea, skin, and other tissues. Clinical rabies presents in two forms: furious (encephalitic) rabies (80% of cases), characterized by hyperactivity, hydrophobia (painful spasms of the throat and diaphragm triggered by swallowing or even seeing water), aerophobia, confusion, and agitation; and paralytic (dumb) rabies (20%), characterized by ascending paralysis similar to Guillain-Barre syndrome. The pathognomonic finding on histology is the Negri body, an eosinophilic intracytoplasmic inclusion found in neurons, particularly in the hippocampus and Purkinje cells of the cerebellum. Post-exposure prophylaxis (PEP) is critically effective when administered before the virus reaches the CNS, making immediate wound care and timely PEP the cornerstone of rabies prevention. PEP includes thorough wound cleansing, administration of human rabies immunoglobulin (HRIG) for passive immunity, and a series of rabies vaccine doses for active immunity."
    },
    riskFactors: [
      "Animal bite or scratch from a wild or unvaccinated domestic animal (bats, raccoons, skunks, foxes, feral dogs and cats)",
      "Bat exposure even without visible bite (bat bites can be imperceptible due to small teeth; PEP is recommended for any bat exposure including waking to find a bat in the room)",
      "Occupational exposure (veterinarians, animal control officers, wildlife rehabilitators, laboratory workers handling rabies virus)",
      "Travel to rabies-endemic regions where canine rabies is prevalent (Africa, Asia, Central and South America)",
      "Wound location on the head, face, or neck (shorter distance to brain, faster viral progression, shorter incubation period)",
      "Immunocompromised status (may have diminished response to vaccine; requires antibody titer confirmation after vaccination series)",
      "Delayed wound cleansing or delayed initiation of post-exposure prophylaxis"
    ],
    diagnostics: [
      "Clinical history assessment: detailed exposure history is critical -- type of animal, provocation status, vaccination status of animal, geographic location, whether the animal can be observed or tested",
      "Animal observation or testing: if the biting animal is a healthy domestic dog, cat, or ferret, it can be observed for 10 days; if the animal develops rabies symptoms or dies, its brain is tested using direct fluorescent antibody (DFA) testing",
      "Wound assessment: document wound type (bite vs scratch vs mucous membrane exposure), location, depth, and extent; note proximity to head/face as this affects urgency of PEP initiation",
      "Rabies antibody titer (post-vaccination): drawn 7-14 days after completing the vaccine series in immunocompromised patients to confirm adequate immune response; titer of 0.5 IU/mL or greater indicates adequate response",
      "Direct fluorescent antibody (DFA) testing of animal brain tissue: the gold standard for diagnosing rabies in animals; requires euthanasia of the animal and brain tissue submission to a reference laboratory",
      "Nuchal skin biopsy or saliva PCR (in suspected human rabies): used only when clinical rabies is suspected in a human patient; not part of the routine PEP decision process"
    ],
    management: [
      "Immediate wound care: thoroughly wash the wound with soap and water for a minimum of 15 minutes -- this single intervention reduces rabies risk by up to 90% by mechanically removing and inactivating the virus",
      "Apply povidone-iodine (Betadine) or 70% alcohol solution to the wound after washing; do NOT suture the wound primarily (leave open to allow drainage and reduce viral inoculation into deeper tissues)",
      "Administer human rabies immunoglobulin (HRIG) at 20 IU/kg body weight: infiltrate as much as anatomically feasible directly into and around the wound site; inject the remainder intramuscularly at a site distant from the vaccine injection",
      "Administer rabies vaccine (HDCV or PCECV) intramuscularly in the deltoid (adults) or anterolateral thigh (children): 4-dose schedule on days 0, 3, 7, and 14 for immunocompetent patients; 5-dose schedule (adding day 28) for immunocompromised patients",
      "Administer tetanus prophylaxis (tetanus toxoid or Tdap) if the patient's tetanus immunization is not current (last booster more than 5 years ago for contaminated wounds)",
      "Report the animal bite to local public health authorities as required by law; coordinate with animal control for animal observation or testing",
      "Provide follow-up care: ensure the patient returns for all scheduled vaccine doses; document each dose administered including lot number, site, and date"
    ],
    nursingActions: [
      "Initiate immediate wound irrigation with soap and water for a minimum of 15 minutes -- this is the single most important first aid measure and must not be delayed while awaiting physician assessment",
      "Obtain a detailed exposure history: type of animal, animal behavior (provoked vs unprovoked attack), vaccination status of animal, whether the animal is available for observation or testing, time of exposure",
      "Administer HRIG by infiltrating the maximum feasible volume directly into and around the wound -- this provides immediate passive antibody protection at the site of viral entry while the patient's immune system responds to the vaccine",
      "Administer the rabies vaccine intramuscularly in the deltoid muscle (NEVER in the gluteal muscle, as absorption from gluteal fat is unreliable and may result in treatment failure)",
      "Educate the patient on the importance of completing the entire vaccine series: missed or delayed doses may result in inadequate immune response and treatment failure",
      "Monitor the patient for 30 minutes after each vaccine and HRIG administration for signs of anaphylaxis or severe allergic reaction (urticaria, angioedema, respiratory distress, hypotension)",
      "Document the bite incident thoroughly: date/time of exposure, type and description of animal, wound location and characteristics, all treatments administered, and the PEP schedule with return dates"
    ],
    assessmentFindings: [
      "Wound assessment: bite wound with tissue damage ranging from superficial puncture to deep laceration; note anatomical location, depth, number of wounds, and presence of foreign material",
      "Signs of wound infection (developing 24-72 hours post-bite): erythema, warmth, swelling, purulent drainage, streaking (lymphangitis), fever -- animal bite wounds have a high infection rate",
      "Prodromal symptoms of rabies (if PEP is delayed): tingling, burning, or pain at the bite site (pathognomonic early symptom), fever, malaise, headache, appearing 1-3 months after exposure",
      "Furious rabies symptoms: hydrophobia (involuntary pharyngeal spasms when attempting to swallow), aerophobia (spasms triggered by air drafts), agitation, confusion, hallucinations, autonomic dysfunction",
      "Paralytic rabies symptoms: ascending flaccid paralysis starting at the bitten extremity, progressive weakness, respiratory failure",
      "Emotional assessment: anxiety, fear, and distress are common after animal bites, especially in children; the patient may be fearful of the injection series",
      "Allergic reaction to vaccine or HRIG: urticaria, pruritus, angioedema, wheezing, hypotension -- monitor for 30 minutes after each administration"
    ],
    signs: {
      left: [
        "Superficial wound with intact neurovascular status",
        "Mild anxiety about the exposure and treatment process",
        "Localized wound pain and minor swelling at bite site",
        "Intact tetanus immunization status",
        "Known domestic animal with current vaccination records",
        "Patient cooperative and understanding of the PEP schedule"
      ],
      right: [
        "Deep bite wound to the head, face, or neck (high-risk location, urgent PEP needed)",
        "Bat exposure with no visible bite (PEP indicated -- bat bites are often imperceptible)",
        "Signs of wound infection: spreading erythema, purulent drainage, fever",
        "Tingling or paresthesias at the bite site (early rabies symptom -- PEP may be too late)",
        "Anaphylaxis symptoms after vaccine or HRIG administration",
        "Unknown or unvaccinated animal that cannot be observed or tested"
      ]
    },
    medications: [
      {
        name: "Human Rabies Immune Globulin (HRIG -- HyperRAB/Imogam)",
        type: "Passive immunization / Immune globulin",
        action: "Provides immediate preformed neutralizing antibodies (passive immunity) against the rabies virus at the wound site, bridging the gap until the patient's own immune system produces antibodies in response to the rabies vaccine (approximately 7-10 days); antibodies neutralize the virus before it enters peripheral nerve endings",
        sideEffects: "Injection site pain, redness, and swelling; headache; low-grade fever; rarely: hypersensitivity reaction or anaphylaxis",
        contra: "Do NOT administer to patients who have previously completed a full pre-exposure or post-exposure rabies vaccination series (these patients already have active immunity); do NOT administer more than 7 days after the first vaccine dose (antibodies from the vaccine are already developing and HRIG may interfere)",
        pearl: "Dose is 20 IU/kg body weight; infiltrate as much as anatomically feasible directly into the wound and around it; inject the remainder IM at a site DISTANT from the vaccine injection site (to avoid antibody interference with vaccine antigen); NEVER administer in the same syringe as the vaccine"
      },
      {
        name: "Rabies Vaccine (HDCV/PCECV -- Imovax/RabAvert)",
        type: "Active immunization / Inactivated viral vaccine",
        action: "Contains inactivated rabies virus that stimulates the patient's adaptive immune system to produce rabies-specific neutralizing antibodies and memory B cells (active immunity); adequate antibody titers typically develop within 7-10 days after the first dose",
        sideEffects: "Injection site pain, redness, induration; headache; nausea; dizziness; myalgia; rarely: Guillain-Barre syndrome, severe allergic reaction",
        contra: "No absolute contraindications for post-exposure prophylaxis (rabies is virtually 100% fatal, so the benefit always outweighs the risk); for pre-exposure prophylaxis, defer in severe febrile illness; use with caution in patients with egg protein allergy (PCECV is grown in chick embryo fibroblasts)",
        pearl: "Administer IM in the deltoid (adults) or anterolateral thigh (children under 2) -- NEVER in the gluteal muscle; the 4-dose schedule is days 0, 3, 7, and 14; previously vaccinated persons receive only 2 doses (days 0 and 3) and do NOT receive HRIG"
      },
      {
        name: "Tetanus Toxoid / Tdap (Adacel/Boostrix)",
        type: "Active immunization / Toxoid vaccine",
        action: "Contains inactivated tetanus toxin (toxoid) that stimulates production of antitoxin antibodies against Clostridium tetani exotoxin (tetanospasmin); animal bite wounds are tetanus-prone wounds due to contamination with animal oral flora and soil organisms",
        sideEffects: "Injection site pain, redness, swelling; low-grade fever; headache; fatigue; myalgia; rarely: peripheral neuropathy, severe allergic reaction",
        contra: "History of severe allergic reaction (anaphylaxis) to a previous dose or vaccine component; history of encephalopathy within 7 days of a previous pertussis-containing vaccine (for Tdap specifically)",
        pearl: "Administer tetanus prophylaxis for animal bite wounds if the last booster was more than 5 years ago (for tetanus-prone wounds) or more than 10 years ago (for clean wounds); Tdap is preferred over Td to also provide pertussis boosting; can be administered simultaneously with rabies vaccine at a different injection site"
      }
    ],
    pearls: [
      "Immediate wound washing with soap and water for at least 15 minutes is the single most critical first aid measure -- this alone can reduce rabies risk by up to 90% by mechanically removing the virus from the wound",
      "Rabies PEP has NO contraindications in a true exposure because rabies is virtually 100% fatal once symptoms develop -- the benefit of PEP always outweighs any risk of adverse reaction",
      "Any bat exposure warrants PEP initiation unless the bat is captured and tests negative -- bat bites can be imperceptible (tiny teeth) and a sleeping person, unattended child, or cognitively impaired individual may not realize they were bitten",
      "HRIG and rabies vaccine must NEVER be administered at the same anatomical site or in the same syringe -- HRIG antibodies can neutralize vaccine antigen and reduce the immune response if they are mixed",
      "The rabies vaccine must be given in the DELTOID muscle (adults) or anterolateral thigh (children) -- NEVER in the gluteal muscle because absorption from gluteal fat tissue is unreliable and may result in PEP failure",
      "A healthy domestic dog, cat, or ferret that bites a person can be observed for 10 days -- if the animal remains healthy after 10 days, it was not shedding rabies virus at the time of the bite and PEP can be discontinued",
      "Rabies has the longest incubation period of any infectious disease (typically 1-3 months but can be up to 1 year or more) -- PEP can still be effective weeks after exposure if symptoms have not yet developed"
    ],
    quiz: [
      {
        question: "A patient presents to the clinic after being bitten by a stray dog 2 hours ago. The wound has not been cleaned. What is the practical nurse's FIRST priority action?",
        options: [
          "Administer the rabies vaccine immediately",
          "Call animal control to capture the dog",
          "Thoroughly wash the wound with soap and water for at least 15 minutes",
          "Apply a sterile dressing to the wound"
        ],
        correct: 2,
        rationale: "Immediate and thorough wound washing with soap and water for a minimum of 15 minutes is the single most important first aid measure for rabies prevention. This mechanical cleansing can reduce rabies risk by up to 90% by removing and inactivating the virus at the wound site. This should be done before any other intervention."
      },
      {
        question: "The physician orders human rabies immune globulin (HRIG) for a patient receiving post-exposure prophylaxis. The practical nurse understands that HRIG should be administered by which method?",
        options: [
          "Intravenously as a single bolus",
          "Infiltrated into and around the wound site with the remainder given IM at a site distant from the vaccine",
          "Intramuscularly in the same arm as the rabies vaccine",
          "Subcutaneously in the abdomen"
        ],
        correct: 1,
        rationale: "HRIG is infiltrated directly into and around the wound site to provide immediate local antibody neutralization of the virus. Any remaining volume is administered intramuscularly at a site DISTANT from the rabies vaccine injection site. HRIG and vaccine must never be given at the same site because HRIG antibodies can neutralize vaccine antigen."
      },
      {
        question: "A parent reports finding a bat in their sleeping child's bedroom. The child has no visible bite marks. Which recommendation is most appropriate?",
        options: [
          "No treatment is needed since there is no visible bite wound",
          "Observe the child for symptoms of rabies over the next month",
          "Initiate rabies post-exposure prophylaxis because bat bites can be imperceptible",
          "Apply antibiotic ointment to the child's exposed skin"
        ],
        correct: 2,
        rationale: "Bat bites can be imperceptible due to their small teeth, and a sleeping child may not be aware of being bitten. Any bat exposure where a bite cannot be reliably excluded (sleeping person, unattended child, cognitively impaired individual) warrants initiation of rabies PEP. Waiting for symptoms is not appropriate because rabies is virtually 100% fatal once symptoms develop."
      }
    ]
  },

  "radiation-therapy-basics-rpn": {
    title: "Radiation Therapy Nursing Care for Practical Nurses",
    cellular: {
      title: "Physics and Biology of Radiation Therapy",
      content: "Radiation therapy (radiotherapy) is a cancer treatment modality that uses high-energy ionizing radiation to damage the DNA of cancer cells, preventing their ability to replicate and leading to cell death. The therapeutic effect of radiation relies on the difference in radiosensitivity between normal cells and cancer cells: cancer cells generally have impaired DNA repair mechanisms, making them more susceptible to radiation-induced DNA damage than normal cells that can repair sublethal damage between treatment fractions. Ionizing radiation damages cellular DNA through two primary mechanisms: direct action, where radiation directly strikes and breaks DNA strands (primarily double-strand breaks which are lethal to the cell), and indirect action, where radiation interacts with intracellular water molecules to produce highly reactive free radicals (hydroxyl radicals) that subsequently damage DNA. Approximately two-thirds of radiation-induced DNA damage occurs through the indirect mechanism. The unit of radiation dose is the Gray (Gy), defined as the absorption of 1 joule of energy per kilogram of tissue. Therapeutic radiation is delivered in fractionated doses (typically 1.8-2.0 Gy per fraction, 5 days per week, over several weeks) to exploit the four Rs of radiobiology: Repair (normal cells repair sublethal damage between fractions better than cancer cells), Redistribution (cells cycle into more radiosensitive phases between fractions), Reoxygenation (tumor hypoxia decreases between fractions, increasing radiosensitivity), and Repopulation (normal tissues regenerate between fractions). External beam radiation therapy (EBRT) uses a linear accelerator to deliver radiation from outside the body, with the beam precisely targeted to the tumor volume while minimizing dose to surrounding normal tissues. Treatment planning involves CT-based simulation to map the tumor and critical structures, with the radiation oncologist prescribing the total dose and fractionation schedule. Brachytherapy is an internal radiation therapy in which a sealed radioactive source is placed directly into or adjacent to the tumor (intracavitary, interstitial, or intraluminal placement), delivering a high dose of radiation to a small volume while sparing surrounding tissues. Patients with sealed brachytherapy sources emit radiation and require radiation safety precautions based on the principles of time (minimize time near the source), distance (maximize distance from the source -- radiation intensity decreases with the square of the distance), and shielding (use lead barriers when available). The practical nurse must understand the side effects of radiation therapy, which are primarily local to the treatment field: radiation dermatitis (skin erythema, dry desquamation, moist desquamation), mucositis (when the treatment field includes mucosal surfaces), fatigue (the most common systemic side effect, thought to be caused by the metabolic demands of tissue repair and cytokine release), and site-specific effects such as esophagitis, enteritis, cystitis, or pneumonitis depending on the treatment location."
    },
    riskFactors: [
      "Concurrent chemotherapy (radiosensitizing agents increase both therapeutic effect and side effects of radiation)",
      "Large treatment field or high total radiation dose (greater volume of normal tissue exposed increases side effect severity)",
      "Treatment of head and neck region (high risk for mucositis, xerostomia, dental caries, and dysphagia)",
      "Treatment of thoracic region (risk of radiation pneumonitis, esophagitis, and pericarditis)",
      "Treatment of pelvic region (risk of radiation cystitis, proctitis, and sexual dysfunction)",
      "Pre-existing skin conditions or autoimmune connective tissue disorders (scleroderma, lupus -- increased risk of severe radiation dermatitis)",
      "Poor nutritional status or low body weight (impaired tissue healing between radiation fractions)"
    ],
    diagnostics: [
      "Complete blood count (CBC) with differential: monitored weekly during radiation therapy; radiation to large bone marrow-containing fields (pelvis, spine, sternum) can cause myelosuppression with decreased WBC, RBC, and platelets",
      "Skin assessment of the treatment field: performed before every treatment session; graded using CTCAE (Common Terminology Criteria for Adverse Events) scale from Grade 1 (faint erythema) to Grade 4 (skin necrosis or ulceration)",
      "Nutritional assessment: weekly weight monitoring and dietary intake evaluation, especially for patients receiving radiation to the head/neck, esophagus, or abdomen where mucositis and dysphagia impair oral intake",
      "CT simulation scan: performed during treatment planning to create a 3D map of the tumor and surrounding anatomy; the practical nurse may assist with patient positioning and marking during simulation",
      "Portal verification imaging: X-ray or CT images taken at the linear accelerator to verify treatment setup accuracy before each fraction; ensures the radiation beam is precisely aligned to the planned target",
      "Radiation dose monitoring: the radiation therapist tracks cumulative dose delivered; the practical nurse monitors for dose-related side effects that typically emerge at predictable cumulative dose thresholds"
    ],
    management: [
      "Skin care for radiation dermatitis: wash the treatment area gently with lukewarm water and mild soap (pH neutral, fragrance-free); pat dry without rubbing; apply prescribed moisturizers (aloe vera-based or aqueous cream) to dry skin",
      "Avoid irritants to the treatment field: no adhesive tape, no heating pads or ice packs, no tight or restrictive clothing, no sun exposure, no swimming in chlorinated pools, no perfumed products, no shaving with a blade razor (electric razor only)",
      "Do NOT wash off skin markings: permanent tattoo dots or semi-permanent ink marks delineate the treatment field and are essential for accurate daily positioning; loss of markings requires re-simulation",
      "Manage radiation fatigue: encourage energy conservation techniques (prioritize activities, take short rest periods, maintain moderate activity as tolerated); fatigue typically peaks 2-3 weeks after treatment completion and may persist for months",
      "Nutritional support: high-calorie, high-protein diet to support tissue repair; small frequent meals for patients with nausea or early satiety; soft, bland diet for patients with mucositis or esophagitis; may require nutritional supplements or enteral feeding",
      "Antiemetic therapy as prescribed for patients with nausea from radiation to the abdomen, pelvis, or whole brain",
      "Oral care protocol for head/neck radiation: soft-bristle toothbrush, fluoride rinses, bland mouth rinses (baking soda and water or prescribed solutions), avoid alcohol-based mouthwash, dental evaluation before treatment begins"
    ],
    nursingActions: [
      "Assess the skin within the radiation treatment field before and after each treatment session: document erythema, dry desquamation (peeling), moist desquamation (open weeping areas), and any signs of infection",
      "Monitor for site-specific radiation side effects based on the treatment field: dysphagia and mucositis (head/neck), cough and dyspnea (thorax), nausea and diarrhea (abdomen/pelvis), urinary frequency and dysuria (pelvis)",
      "Reinforce radiation safety principles for patients with brachytherapy implants: time (limit visitor time to 30 minutes per visit), distance (visitors stay at least 6 feet from the patient), shielding (lead barriers when available)",
      "Pregnant women and children under 18 must NOT visit patients with active brachytherapy implants due to the increased radiosensitivity of developing tissues",
      "Monitor for signs of radiation pneumonitis in patients receiving thoracic radiation: dry non-productive cough, dyspnea on exertion, low-grade fever occurring 1-6 months after treatment completion",
      "Educate patients that radiation side effects are cumulative and typically worsen as treatment progresses, peak 1-2 weeks after treatment ends, and then gradually improve over weeks to months",
      "If a sealed brachytherapy source becomes dislodged, do NOT touch it with bare hands -- use long-handled forceps to place it in a lead-lined container and notify the radiation safety officer immediately"
    ],
    assessmentFindings: [
      "Radiation dermatitis progression: Grade 1 (faint erythema, mild skin tightness), Grade 2 (moderate erythema, dry desquamation with peeling and pruritus), Grade 3 (moist desquamation with open weeping areas, pain), Grade 4 (skin necrosis or ulceration)",
      "Radiation fatigue: the most common side effect; progressive tiredness that is not fully relieved by rest; affects approximately 80-90% of patients undergoing radiation therapy",
      "Mucositis (head/neck radiation): erythema progressing to painful ulceration of oral mucosa, difficulty swallowing, altered taste sensation (dysgeusia), weight loss from decreased oral intake",
      "Radiation esophagitis (thoracic radiation): dysphagia (difficulty swallowing), odynophagia (painful swallowing), heartburn, weight loss",
      "Radiation cystitis (pelvic radiation): urinary frequency, urgency, dysuria, hematuria; symptoms may appear during treatment or months to years later (late effect)",
      "Myelosuppression (large-field radiation): decreased WBC (increased infection risk), decreased platelets (bleeding risk), decreased RBC (fatigue and anemia); nadir typically occurs 2-3 weeks after treatment",
      "Alopecia: hair loss occurs ONLY within the radiation treatment field (unlike chemotherapy which causes diffuse alopecia); may be temporary or permanent depending on dose"
    ],
    signs: {
      left: [
        "Mild skin erythema within the treatment field (Grade 1 dermatitis)",
        "Moderate fatigue that is managed with rest periods",
        "Mild dry desquamation (flaking skin) in the treatment area",
        "Slight decrease in appetite without significant weight loss",
        "Mild nausea managed with antiemetics",
        "Stable blood counts with minor decreases within normal range"
      ],
      right: [
        "Moist desquamation with open weeping areas (Grade 3 dermatitis -- risk of infection)",
        "Signs of radiation pneumonitis (dry cough, progressive dyspnea, fever)",
        "Severe mucositis preventing oral intake (requires IV fluids or enteral nutrition)",
        "WBC below 2,000/mm3 (severe neutropenia -- infection precautions needed)",
        "Dislodged brachytherapy source (radiation safety emergency)",
        "Weight loss greater than 10% of pre-treatment weight (severe malnutrition)"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 receptor antagonist)",
        action: "Blocks serotonin (5-HT3) receptors in the chemoreceptor trigger zone of the medulla and vagal nerve terminals in the gastrointestinal tract, preventing radiation-induced nausea and vomiting; serotonin is released from enterochromaffin cells in the intestinal mucosa when damaged by radiation",
        sideEffects: "Headache (most common), constipation, dizziness, fatigue, QT prolongation (dose-dependent risk of cardiac dysrhythmia)",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine; use caution with other QT-prolonging medications and in patients with electrolyte imbalances (hypokalemia, hypomagnesemia)",
        pearl: "Administer 30-60 minutes before radiation treatment for maximum prophylactic effect; for patients receiving abdominal or pelvic radiation, scheduled dosing is more effective than PRN; monitor ECG in patients receiving multiple daily doses"
      },
      {
        name: "Amifostine (Ethyol)",
        type: "Cytoprotective / Radioprotective agent",
        action: "A prodrug that is dephosphorylated by alkaline phosphatase in normal tissues (which have higher blood flow and pH than tumors) to its active metabolite (free thiol WR-1065), which scavenges free radicals generated by radiation and binds to reactive forms of alkylating agents; selectively protects normal tissues without protecting the tumor",
        sideEffects: "Hypotension (dose-limiting -- occurs in up to 60% of patients), nausea and vomiting, flushing, chills, dizziness, somnolence, hiccups, sneezing, hypocalcemia",
        contra: "Hypotension (systolic BP below 100 mmHg); dehydration; concurrent antihypertensive therapy that cannot be held; known hypersensitivity; pregnancy",
        pearl: "Administer IV over 15 minutes, 15-30 minutes before each radiation fraction; hold antihypertensive medications 24 hours before administration; keep the patient supine during infusion and monitor blood pressure every 5 minutes; primarily used to prevent xerostomia (dry mouth) in head and neck radiation patients"
      },
      {
        name: "Silver Sulfadiazine (Silvadene/Flamazine)",
        type: "Topical antimicrobial / Sulfonamide antibiotic",
        action: "Silver ions bind to bacterial DNA and cell membranes, causing bactericidal activity against a broad spectrum of organisms including Pseudomonas aeruginosa and Staphylococcus aureus; the sulfonamide component inhibits bacterial folic acid synthesis; used to prevent and treat infection in moist desquamation wounds from radiation dermatitis",
        sideEffects: "Transient burning or stinging on application, skin discoloration (grey-brown), leukopenia (with prolonged use on large surface areas due to systemic absorption), allergic contact dermatitis, delayed wound healing (some evidence suggests it may impair epithelialization)",
        contra: "Sulfonamide allergy; pregnancy at term (risk of kernicterus in the neonate); infants under 2 months of age; glucose-6-phosphate dehydrogenase (G6PD) deficiency (hemolytic anemia risk)",
        pearl: "Apply a thin layer (1-2 mm) to moist desquamation areas using sterile technique; cover with a non-adherent dressing; reapply every 12-24 hours after gentle wound cleansing; monitor CBC weekly if applied to large areas due to risk of leukopenia from systemic silver absorption"
      }
    ],
    pearls: [
      "Radiation side effects are LOCAL to the treatment field -- if the patient is receiving pelvic radiation, do not expect oral mucositis; if receiving head and neck radiation, do not expect diarrhea (unless the treatment field includes abdominal structures)",
      "The three cardinal principles of radiation safety for brachytherapy are TIME (minimize exposure duration), DISTANCE (maximize distance from the source -- inverse square law means doubling the distance reduces exposure to one-quarter), and SHIELDING (use lead barriers)",
      "Pregnant women and children under 18 must NEVER visit patients with active brachytherapy implants because developing tissues are highly radiosensitive and even low-dose radiation exposure can cause birth defects or childhood cancer",
      "If a sealed brachytherapy source becomes dislodged, NEVER touch it with bare hands -- use long-handled forceps, place it in the lead-lined container kept at bedside, and immediately notify the radiation safety officer",
      "Radiation dermatitis follows a predictable progression: erythema develops first, followed by dry desquamation (peeling, flaking), then moist desquamation (open weeping areas) in severe cases -- skin care interventions should be proactive, not reactive",
      "Do NOT apply any products to the skin within the treatment field within 4 hours before a radiation treatment session -- creams and ointments can create a bolus effect that increases radiation dose to the skin surface",
      "Radiation fatigue is cumulative, typically worsening throughout the treatment course, peaking 1-2 weeks after the final treatment, and may persist for weeks to months -- patients should be counseled that this is expected and not a sign of disease progression"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with a sealed brachytherapy implant. A visitor who is 8 months pregnant wants to visit the patient. What is the appropriate nursing action?",
        options: [
          "Allow the visit but limit it to 30 minutes",
          "Allow the visit if the visitor wears a lead apron",
          "Explain that pregnant women cannot visit patients with active brachytherapy implants",
          "Allow the visit if the visitor stands at least 6 feet from the patient"
        ],
        correct: 2,
        rationale: "Pregnant women must NOT visit patients with active brachytherapy implants under any circumstances. The developing fetus is highly radiosensitive, and even low-dose radiation exposure can cause birth defects, growth restriction, or childhood cancer. No amount of distance or shielding in a patient room can ensure zero exposure."
      },
      {
        question: "A patient receiving radiation therapy to the chest develops a dry non-productive cough, mild dyspnea on exertion, and a low-grade fever 6 weeks after completing treatment. The practical nurse suspects which complication?",
        options: [
          "Radiation dermatitis",
          "Radiation pneumonitis",
          "Radiation cystitis",
          "Radiation mucositis"
        ],
        correct: 1,
        rationale: "Radiation pneumonitis typically develops 1-6 months after thoracic radiation and presents with dry non-productive cough, dyspnea on exertion, and low-grade fever. This is an inflammatory reaction in the lung tissue within the treatment field. Dermatitis is a skin reaction, cystitis is a bladder reaction from pelvic radiation, and mucositis is an oral/GI mucosal reaction."
      },
      {
        question: "A patient receiving external beam radiation therapy to the abdomen asks why they need to come for treatment every weekday for 6 weeks instead of receiving all the radiation in one session. The practical nurse's best response addresses which principle?",
        options: [
          "Radiation machines can only deliver small doses at a time",
          "Fractionation allows normal cells to repair between treatments while cancer cells cannot repair as effectively",
          "The total dose is too large to measure accurately in one session",
          "Insurance requires daily treatments for coverage"
        ],
        correct: 1,
        rationale: "Fractionation exploits the difference in DNA repair capacity between normal cells and cancer cells. Normal cells repair sublethal radiation damage between fractions more effectively than cancer cells. The four Rs of radiobiology (Repair, Redistribution, Reoxygenation, Repopulation) explain why fractionation improves the therapeutic ratio."
      }
    ]
  },

  "rectal-medication-rpn": {
    title: "Rectal Medication Administration for Practical Nurses",
    cellular: {
      title: "Anatomy, Physiology, and Pharmacology of Rectal Drug Absorption",
      content: "The rectum is the terminal segment of the large intestine, approximately 15-20 cm in length, extending from the sigmoid colon to the anal canal. The rectal mucosa is lined with columnar epithelium in the upper rectum and transitions to stratified squamous epithelium near the dentate (pectinate) line in the anal canal. The rectal mucosa is highly vascularized with an extensive venous plexus that provides the anatomical basis for rectal drug absorption. The venous drainage of the rectum is clinically significant for drug administration because it determines whether absorbed medications undergo first-pass hepatic metabolism: the superior rectal vein drains into the portal system (and therefore through the liver), while the middle and inferior rectal veins drain into the systemic circulation via the internal iliac veins, bypassing the liver. When a suppository is inserted correctly (approximately 2.5-4 cm beyond the internal anal sphincter), the medication is primarily absorbed through the middle and inferior rectal veins, avoiding approximately 50-70% of first-pass hepatic metabolism. This is a significant pharmacological advantage for medications that are extensively metabolized by the liver when taken orally. Rectal absorption occurs through passive diffusion across the rectal mucosa. The relatively small surface area of the rectum (compared to the small intestine) means that absorption is slower and less complete than oral absorption, but it is adequate for many medications. Factors affecting rectal absorption include the formulation of the suppository (lipophilic bases like cocoa butter melt at body temperature to release the drug, while water-soluble bases like polyethylene glycol dissolve in rectal fluid), the presence or absence of stool in the rectum (stool impairs absorption by creating a physical barrier), rectal pH (approximately 7.0-8.0, which is slightly alkaline), and the retention time of the medication (longer retention improves absorption). Suppositories are solid dosage forms designed to melt, soften, or dissolve at body temperature. They are torpedo or bullet shaped to facilitate insertion and retention. Common medications administered rectally include bisacodyl (stimulant laxative), acetaminophen (antipyretic/analgesic for patients who cannot take oral medications), promethazine (antiemetic), and diazepam rectal gel (for acute seizure management in patients with epilepsy). Rectal medication administration is indicated when the oral route is unavailable (vomiting, NPO status, unconsciousness, dysphagia, oral surgery), when local rectal or colonic effects are desired (laxatives, anti-inflammatory agents for ulcerative colitis), or when partial avoidance of first-pass metabolism is beneficial. Contraindications include recent rectal or bowel surgery, active rectal bleeding, severe neutropenia (risk of rectal mucosal trauma introducing bacteria into the bloodstream), thrombocytopenia (risk of bleeding from insertion), and diarrhea (medication will not be retained). The practical nurse must use proper technique including glove use, adequate lubrication, correct insertion depth, and patient positioning to ensure safe and effective administration."
    },
    riskFactors: [
      "Recent rectal, anal, or lower bowel surgery (risk of perforation, dehiscence, or disruption of surgical site)",
      "Severe neutropenia (absolute neutrophil count below 500/mm3 -- rectal insertion can cause mucosal micro-tears introducing bacteria and causing bacteremia or sepsis)",
      "Thrombocytopenia (platelet count below 20,000/mm3 -- risk of rectal bleeding from mucosal trauma during insertion)",
      "Active rectal bleeding or hemorrhoids (may worsen bleeding; absorption is unpredictable with active hemorrhage)",
      "Inflammatory bowel disease with active rectal inflammation (Crohn disease or ulcerative colitis flare -- painful and may worsen mucosal damage)",
      "Diarrhea or fecal incontinence (medication will not be retained long enough for adequate absorption)",
      "Cardiac conditions that predispose to vagal response (rectal stimulation can trigger vasovagal reflex causing bradycardia and hypotension)"
    ],
    diagnostics: [
      "Verify the medication order: confirm the correct medication, dose, route (rectal/PR), and frequency; verify the patient has no contraindications to rectal administration",
      "Assess the patient's ability to retain the medication: evaluate for diarrhea, fecal incontinence, or rectal pathology that would impair retention; the suppository must be retained for a minimum of 15-20 minutes for absorption",
      "Review medication interactions and timing: some rectal medications should not be administered concurrently (e.g., laxative suppositories should not be given with medications intended for systemic absorption as the laxative will reduce retention time)",
      "Assess vital signs before administration: particularly for medications with cardiovascular effects; monitor heart rate for medications that may trigger vagal response during insertion",
      "Review complete blood count: check for neutropenia and thrombocytopenia which are contraindications to rectal administration; verify platelet count and ANC before proceeding",
      "Rectal assessment: if ordered, perform a gentle digital rectal examination to assess for fecal impaction, masses, or tenderness that would affect medication placement and absorption"
    ],
    management: [
      "Patient positioning: place the patient in the left lateral (Sims) position with the upper knee flexed toward the chest -- this position follows the natural anatomical curve of the rectum and sigmoid colon and facilitates insertion",
      "Hand hygiene and glove use: perform hand hygiene and apply clean gloves; lubricate the rounded tip of the suppository with water-soluble lubricant (do NOT use petroleum-based lubricant as it can interfere with suppository dissolution)",
      "Insertion technique: gently insert the suppository rounded-tip first, approximately 2.5-4 cm (1-1.5 inches in adults, 1-2 cm in children) beyond the internal anal sphincter; push the suppository along the rectal wall, not into stool",
      "Post-insertion: instruct the patient to remain in the left lateral position for 15-20 minutes and to resist the urge to defecate; for laxative suppositories, the urge to defecate is expected and should be acted upon when it occurs",
      "For diazepam rectal gel (Diastat): the caregiver or nurse administers the gel via the pre-filled rectal delivery system during an active seizure; the patient should be placed on their side; monitor respirations and level of consciousness after administration",
      "Documentation: record the medication name, dose, route (PR), time of administration, patient's tolerance, and whether the suppository was retained; note the time the patient reports a bowel movement if a laxative was administered",
      "Monitor for therapeutic effect: assess pain relief or temperature reduction (acetaminophen), bowel movement (bisacodyl), resolution of nausea (promethazine), or seizure cessation (diazepam) at appropriate intervals"
    ],
    nursingActions: [
      "Verify two patient identifiers and perform the six rights of medication administration (right patient, right medication, right dose, right route, right time, right documentation) before any rectal medication",
      "Assess for contraindications BEFORE insertion: recent rectal surgery, active rectal bleeding, neutropenia (ANC below 500), thrombocytopenia (platelets below 20,000), or diarrhea -- report contraindications and request an alternative route",
      "Provide privacy and maintain dignity: close the door, pull the curtain, drape the patient appropriately; explain the procedure clearly before beginning and obtain verbal consent",
      "Use proper insertion technique: lubricate adequately, insert gently beyond the internal sphincter, avoid forcing against resistance; if resistance is met, stop and reassess",
      "Monitor for vasovagal response during and after insertion: rectal stimulation can activate the vagus nerve causing bradycardia, hypotension, diaphoresis, and syncope; have the patient remain supine and monitor vital signs if symptoms occur",
      "For pediatric patients: use the correct suppository size (pediatric formulation); insertion depth is approximately 1-2 cm; hold the buttocks gently together for 5-10 minutes after insertion to prevent expulsion",
      "If the patient expels the suppository within 15 minutes of insertion, assess whether it is intact or partially dissolved; if intact, reinsert with physician authorization; if partially dissolved, do NOT reinsert -- notify the physician for guidance on re-dosing"
    ],
    assessmentFindings: [
      "Successful insertion: patient reports mild pressure sensation during insertion that resolves quickly; no pain, bleeding, or resistance during the procedure",
      "Vasovagal response: bradycardia (heart rate drops below 60 bpm), hypotension, diaphoresis, pallor, lightheadedness, nausea, or syncope during or immediately after rectal insertion",
      "Rectal irritation or trauma: patient reports sharp pain during insertion, visible blood on the glove after insertion, or continued rectal discomfort after the procedure",
      "Therapeutic effect of laxative suppository: patient reports urge to defecate within 15-60 minutes after bisacodyl insertion; bowel movement occurs within 15 minutes to 1 hour",
      "Therapeutic effect of antipyretic suppository: temperature decrease observed within 30-60 minutes after acetaminophen rectal administration",
      "Failed retention: patient expels the suppository before adequate absorption (less than 15-20 minutes after insertion); may occur with diarrhea, impaired anal sphincter tone, or improper insertion depth",
      "Allergic or sensitivity reaction: rectal itching, burning, or rash around the anus after medication administration; may indicate allergy to the medication or suppository base"
    ],
    signs: {
      left: [
        "Mild transient discomfort or pressure during insertion",
        "Urge to defecate after laxative suppository (expected therapeutic response)",
        "Mild rectal fullness sensation that resolves within minutes",
        "Successful medication retention for more than 20 minutes",
        "Gradual onset of therapeutic effect (pain relief, temperature reduction)",
        "Patient comfortable and tolerating the procedure well"
      ],
      right: [
        "Vasovagal response: sudden bradycardia, hypotension, diaphoresis, pallor during insertion",
        "Rectal bleeding visible on glove or reported by patient after insertion",
        "Severe pain during insertion suggesting rectal pathology or improper technique",
        "Inability to retain suppository (expelled within minutes, repeatedly)",
        "Signs of rectal perforation: sudden severe abdominal pain, rigid abdomen, fever (rare but life-threatening)",
        "Respiratory depression after diazepam rectal gel administration"
      ]
    },
    medications: [
      {
        name: "Bisacodyl Suppository (Dulcolax)",
        type: "Stimulant laxative (diphenylmethane derivative)",
        action: "Directly stimulates the myenteric nerve plexus (Auerbach plexus) in the colonic wall, increasing peristaltic contractions; also stimulates fluid and electrolyte secretion into the colon by inhibiting water absorption, increasing the volume and softness of stool; onset of action via rectal route is 15-60 minutes",
        sideEffects: "Abdominal cramping, rectal irritation or burning sensation, diarrhea (if overused), electrolyte imbalances with chronic use (hypokalemia), rectal mucosal inflammation with frequent use",
        contra: "Intestinal obstruction (stimulating peristalsis against an obstruction can cause perforation), acute surgical abdomen, severe dehydration, active inflammatory bowel disease flare, rectal fissures or hemorrhoids (suppository insertion may worsen symptoms)",
        pearl: "Remove the foil wrapper completely before insertion; moisten the suppository with water (not petroleum jelly) before insertion; onset is much faster rectally (15-60 minutes) than orally (6-12 hours); instruct the patient to retain the suppository for at least 15 minutes before attempting a bowel movement for maximum effect"
      },
      {
        name: "Acetaminophen Suppository (Tylenol Rectal)",
        type: "Analgesic / Antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center (antipyretic effect) and raising the pain threshold (analgesic effect); rectal absorption partially bypasses first-pass hepatic metabolism via the middle and inferior rectal veins",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (rectal bioavailability is approximately 30-40% of oral, so dosing may differ), rectal irritation, allergic reaction (rare)",
        contra: "Severe hepatic impairment or active liver disease, known hypersensitivity, concurrent use of maximum-dose oral acetaminophen (total daily dose from ALL sources must not exceed 4g/day in healthy adults, 2g/day in patients with liver disease or alcohol use)",
        pearl: "Rectal bioavailability is lower and more variable than oral -- rectal doses may be 25-50% higher than equivalent oral doses as prescribed; onset of action is slower rectally (30-60 minutes vs 15-30 minutes orally); must retain for at least 20-30 minutes for adequate absorption; check ALL medication sources for acetaminophen to prevent inadvertent overdose"
      },
      {
        name: "Diazepam Rectal Gel (Diastat)",
        type: "Benzodiazepine / Anticonvulsant",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at GABA-A receptors in the central nervous system by increasing chloride channel opening frequency, resulting in neuronal hyperpolarization and inhibition of seizure activity; rectal gel allows rapid absorption through the rectal mucosa with onset of action within 5-15 minutes",
        sideEffects: "Sedation, drowsiness, respiratory depression (dose-related and the most dangerous adverse effect), ataxia, hypotension, paradoxical agitation (especially in children and elderly), dependence with chronic use",
        contra: "Severe respiratory insufficiency, sleep apnea syndrome, acute narrow-angle glaucoma, known hypersensitivity to benzodiazepines, severe hepatic insufficiency, myasthenia gravis",
        pearl: "Diastat is prescribed for home or institutional use as rescue therapy for acute repetitive seizures; caregivers and nurses must be trained on proper administration technique; monitor respiratory rate and oxygen saturation after administration; if seizure activity does not stop within 15 minutes, activate emergency medical services; do NOT administer a second dose unless specifically authorized by the prescriber"
      }
    ],
    pearls: [
      "The left lateral (Sims) position with the upper knee flexed is the standard position for rectal medication administration -- this follows the natural anatomical S-curve of the rectum and sigmoid colon and uses gravity to facilitate retention",
      "Insert the suppository approximately 2.5-4 cm beyond the INTERNAL anal sphincter in adults (1-2 cm in children) -- insufficient insertion depth is the most common cause of premature expulsion because the suppository sits at the anal verge where the defecation reflex is easily triggered",
      "Rectal medication administration is CONTRAINDICATED in severely neutropenic patients (ANC below 500/mm3) because micro-tears in the rectal mucosa during insertion can introduce bacteria into the bloodstream, causing life-threatening bacteremia or sepsis",
      "The rectal route partially bypasses first-pass hepatic metabolism because the middle and inferior rectal veins drain into the systemic circulation -- this is why some medications have different dosing when given rectally versus orally",
      "Use ONLY water-soluble lubricant for suppository insertion -- petroleum-based lubricants (Vaseline) can coat the suppository and interfere with dissolution and drug release from the suppository base",
      "Monitor for vasovagal response during rectal insertion: the vagus nerve can be stimulated during rectal manipulation, causing sudden bradycardia and hypotension -- this is especially important in elderly patients and those with cardiac conditions",
      "If a patient expels an intact suppository within 15 minutes, it may be reinserted with physician authorization; if the suppository is partially dissolved, do NOT reinsert and do NOT re-dose without consulting the physician because a partial dose may have been absorbed"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to administer a rectal suppository to an adult patient. In which position should the practical nurse place the patient?",
        options: [
          "Supine with knees flexed",
          "Right lateral with legs extended",
          "Left lateral (Sims) with upper knee flexed toward the chest",
          "Prone with a pillow under the abdomen"
        ],
        correct: 2,
        rationale: "The left lateral (Sims) position with the upper knee flexed toward the chest is the standard position for rectal medication administration. This position follows the natural anatomical curve of the sigmoid colon and rectum, facilitates insertion, and uses gravity to promote retention of the medication."
      },
      {
        question: "A patient with acute leukemia has an absolute neutrophil count (ANC) of 300/mm3 and a fever of 39.2 degrees Celsius. The physician orders acetaminophen. The practical nurse should question which route of administration?",
        options: [
          "Oral",
          "Intravenous",
          "Rectal",
          "Sublingual"
        ],
        correct: 2,
        rationale: "Rectal medication administration is contraindicated in severely neutropenic patients (ANC below 500/mm3) because insertion of a suppository can cause micro-tears in the rectal mucosa, providing a portal of entry for bacteria into the bloodstream and potentially causing life-threatening bacteremia or sepsis. The oral or intravenous route should be used instead."
      },
      {
        question: "After inserting a bisacodyl suppository, the patient reports an urge to defecate within 5 minutes. What is the most appropriate nursing action?",
        options: [
          "Assist the patient to the bathroom immediately",
          "Encourage the patient to retain the suppository for at least 15 minutes before attempting a bowel movement",
          "Remove the suppository and reinsert it later",
          "Administer a second suppository"
        ],
        correct: 1,
        rationale: "The patient should be encouraged to retain the bisacodyl suppository for at least 15 minutes to allow adequate contact with the rectal mucosa for stimulation of the myenteric nerve plexus. Premature expulsion will reduce the therapeutic effect. The urge to defecate is a normal response but acting on it too quickly may result in expulsion of the suppository before it has exerted its full effect."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
