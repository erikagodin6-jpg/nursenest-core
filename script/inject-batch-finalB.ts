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
  "suctioning-rpn": {
    title: "Airway Suctioning for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of Airway Clearance",
      content: "The respiratory tract is lined with ciliated pseudostratified columnar epithelium containing goblet cells that produce mucus. This mucociliary escalator is the primary defense mechanism for trapping and clearing inhaled particles, pathogens, and debris from the airways. Mucus is produced at approximately 100 mL per day in healthy adults, with the consistency and volume regulated by hydration status, autonomic nervous system input, and inflammatory mediators. When disease, injury, sedation, or neuromuscular weakness impair the cough reflex or mucociliary clearance, secretions accumulate in the tracheobronchial tree. Retained secretions increase airway resistance, reduce alveolar ventilation, promote bacterial colonization, and can lead to atelectasis, pneumonia, and respiratory failure. Airway suctioning is a sterile or clean invasive procedure that uses negative pressure to mechanically remove secretions from the oropharynx, nasopharynx, or trachea when the patient cannot clear them independently. The procedure stimulates the vagus nerve (cranial nerve X), which innervates the heart and airways. Vagal stimulation during suctioning can cause bradycardia, hypotension, bronchospasm, and laryngospasm. The practical nurse must understand that suctioning itself carries risks including hypoxemia (removal of oxygen along with secretions), mucosal trauma (from excessive suction pressure or prolonged catheter insertion), cardiac dysrhythmias (from vagal stimulation and hypoxemia), and increased intracranial pressure (from coughing and Valsalva response). There are two primary suctioning systems: open suctioning (requires disconnection from the ventilator or oxygen source and uses a single-use sterile catheter) and closed suctioning (uses an inline catheter connected to the ventilator circuit, allowing suctioning without disconnection). The practical nurse performs suctioning as a delegated task within RPN scope, following facility protocols and monitoring the patient throughout the procedure."
    },
    riskFactors: [
      "Altered level of consciousness or sedation (depressed cough and gag reflexes)",
      "Neuromuscular disease (myasthenia gravis, Guillain-Barre syndrome, ALS)",
      "Endotracheal or tracheostomy tube in place (bypasses natural upper airway defenses)",
      "Post-surgical state with general anesthesia (temporary cough suppression)",
      "Chronic respiratory disease with excessive secretion production (COPD, cystic fibrosis, bronchiectasis)",
      "Dehydration (thickened, tenacious secretions that are difficult to clear)",
      "Dysphagia or impaired swallowing (aspiration risk leading to secretion accumulation)"
    ],
    diagnostics: [
      "Pulse oximetry (SpO2): continuous monitoring before, during, and after suctioning; baseline and post-procedure comparison to detect hypoxemia",
      "Chest X-ray: identifies atelectasis, consolidation, or mucus plugging that may indicate need for suctioning or escalation of care",
      "Arterial blood gas (ABG): provides definitive assessment of oxygenation (PaO2), ventilation (PaCO2), and acid-base status in patients with chronic secretion management needs",
      "Sputum culture and sensitivity: collected via suctioning when infection is suspected; proper sterile technique during collection prevents contamination",
      "Respiratory assessment: auscultation of all lung fields to identify adventitious sounds (rhonchi, crackles) indicating secretion presence; performed before and after suctioning to evaluate effectiveness",
      "Capnography (EtCO2): monitors ventilation status in intubated patients; rising EtCO2 may indicate need for suctioning"
    ],
    management: [
      "Hyperoxygenate with 100% FiO2 for 30 to 60 seconds before and after each suctioning pass to prevent desaturation",
      "Limit each suctioning pass to 10 to 15 seconds maximum to minimize hypoxemia, mucosal trauma, and vagal stimulation",
      "Use appropriate suction pressure: adults 100 to 150 mmHg, children 100 to 120 mmHg, infants 60 to 100 mmHg; excessive pressure causes mucosal damage",
      "Select correct catheter size: catheter should not exceed half the internal diameter of the artificial airway to allow air entrainment around the catheter",
      "Apply suction only during catheter withdrawal using a rotating motion; never apply suction during catheter insertion to prevent mucosal grabbing",
      "Allow at least 30 seconds between suctioning passes for the patient to recover and reoxygenate; limit total passes to three per suctioning episode",
      "Maintain adequate systemic hydration and humidification of inspired gases to keep secretions thin and easier to mobilize"
    ],
    nursingActions: [
      "Assess respiratory status before suctioning: auscultate lung fields, monitor SpO2, evaluate work of breathing, and note secretion characteristics",
      "Verify suction equipment is functioning properly before beginning: check wall suction or portable unit, ensure correct pressure setting, confirm catheter size and supplies",
      "Maintain sterile technique for endotracheal and tracheostomy suctioning (open system); clean technique is acceptable for oropharyngeal suctioning",
      "Monitor heart rate and rhythm during suctioning; stop immediately if bradycardia (heart rate below 60 bpm) or significant dysrhythmia occurs",
      "Document suctioning including: time, catheter size, suction pressure, number of passes, secretion amount/color/consistency, patient tolerance, and pre/post SpO2 values",
      "Report any blood-tinged secretions, inability to pass the catheter, persistent desaturation below 90%, or significant changes in secretion characteristics to the registered nurse immediately",
      "Provide oral care after suctioning to maintain oral hygiene and reduce risk of ventilator-associated pneumonia in intubated patients"
    ],
    assessmentFindings: [
      "Audible gurgling, rattling, or coarse breath sounds on auscultation indicating secretion accumulation in the airways",
      "Visible secretions in the endotracheal or tracheostomy tube, or in the oropharynx",
      "Decreased SpO2 from baseline with increased work of breathing (use of accessory muscles, nasal flaring, intercostal retractions)",
      "Restlessness, agitation, or anxiety in a patient who was previously calm, suggesting hypoxemia from airway obstruction by secretions",
      "Ineffective or weak cough effort with inability to mobilize secretions independently",
      "Rising peak inspiratory pressures on the ventilator indicating increased airway resistance from secretion buildup",
      "Tachycardia and tachypnea as compensatory responses to impaired gas exchange from retained secretions"
    ],
    signs: {
      left: [
        "Coarse crackles or rhonchi on auscultation",
        "Mild decrease in SpO2 from baseline (92-94%)",
        "Audible gurgling with respirations",
        "Productive cough with thin white or clear secretions",
        "Slight increase in respiratory rate",
        "Patient requesting suctioning"
      ],
      right: [
        "SpO2 below 88% despite supplemental oxygen",
        "Severe respiratory distress with accessory muscle use and cyanosis",
        "Blood-tinged or frank bloody secretions (mucosal trauma or hemorrhage)",
        "Bradycardia during or after suctioning (vagal stimulation)",
        "Cardiac dysrhythmias during suctioning procedure",
        "Inability to pass suction catheter (obstruction or mucus plug)"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% NaCl) Instillation",
        type: "Mucosal irrigant (controversial practice)",
        action: "Previously used as tracheal instillation to thin secretions before suctioning; the saline was believed to mix with mucus and facilitate removal. Current evidence shows that normal saline does NOT mix effectively with mucus, instead pooling in dependent airways and potentially dislodging bacterial biofilm into lower airways",
        sideEffects: "Decreased SpO2 during instillation, coughing, bronchospasm, increased risk of ventilator-associated pneumonia from bacterial dislodgement, patient discomfort and anxiety",
        contra: "Most current clinical practice guidelines advise AGAINST routine normal saline instillation before suctioning; use only if specifically ordered by the physician",
        pearl: "The evidence-based alternative is to maintain adequate systemic hydration and heated humidification of inspired gases to keep secretions thin rather than instilling saline directly into the airway"
      },
      {
        name: "Atropine Sulfate",
        type: "Anticholinergic / parasympatholytic",
        action: "Blocks acetylcholine at muscarinic receptors, increasing heart rate by inhibiting vagal (parasympathetic) input to the SA node; reduces bronchial secretion production by blocking cholinergic stimulation of goblet cells and submucosal glands",
        sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision, constipation, confusion (especially in elderly patients), hyperthermia from decreased sweating",
        contra: "Narrow-angle glaucoma, obstructive uropathy, tachyarrhythmias, myasthenia gravis (worsens muscle weakness), paralytic ileus",
        pearl: "Keep atropine available at bedside for patients who develop significant bradycardia during suctioning; standard dose for symptomatic bradycardia is 0.5 mg IV push, may repeat every 3-5 minutes to maximum of 3 mg"
      },
      {
        name: "Lidocaine (topical/nebulized)",
        type: "Local anesthetic / sodium channel blocker",
        action: "Blocks sodium channels in sensory nerve endings along the airway mucosa, reducing the cough reflex and gag response; decreases airway reactivity and may reduce the incidence of bronchospasm and laryngospasm during suctioning procedures",
        sideEffects: "Numbness of oropharyngeal mucosa (aspiration risk due to suppressed protective reflexes), metallic taste, dizziness, seizures and cardiac arrest with systemic toxicity from excessive absorption",
        contra: "Known allergy to amide-type local anesthetics, severe hepatic dysfunction (impaired lidocaine metabolism), heart block without pacemaker",
        pearl: "When nebulized lidocaine is used before suctioning, the patient must remain NPO for at least 1 hour after administration because the suppressed gag and cough reflexes increase aspiration risk; monitor for signs of local anesthetic systemic toxicity (LAST): tinnitus, circumoral numbness, metallic taste, seizures"
      }
    ],
    pearls: [
      "The cardinal rule of suctioning: apply suction ONLY during withdrawal, NEVER during insertion -- inserting with suction applied causes mucosal trauma and oxygen depletion",
      "Catheter size rule: the suction catheter should be no larger than half the internal diameter of the endotracheal or tracheostomy tube to prevent occlusion and allow air flow around the catheter",
      "Pre-oxygenate with 100% FiO2 for 30-60 seconds before suctioning and re-oxygenate between passes -- this is the single most important step to prevent hypoxemia during the procedure",
      "Limit each suctioning pass to 10-15 seconds; time starts when the catheter enters the airway, not when suction is applied -- monitor by counting or watching the clock",
      "Normal saline instillation before suctioning is NOT recommended by current evidence -- it does not thin secretions and may increase infection risk by dislodging bacteria into lower airways",
      "Monitor heart rate continuously during suctioning; vagal stimulation from the catheter can cause sudden bradycardia -- stop suctioning immediately if heart rate drops below 60 bpm",
      "Secretion characteristics provide clinical information: clear/white is normal; yellow/green suggests infection; blood-tinged suggests mucosal trauma or coagulopathy; thick/tenacious suggests dehydration"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to suction a patient with a tracheostomy. What is the MOST important action to perform before inserting the suction catheter?",
        options: [
          "Instill normal saline into the tracheostomy tube",
          "Hyperoxygenate the patient with 100% oxygen for 30-60 seconds",
          "Apply suction to test the catheter function",
          "Position the patient in a supine flat position"
        ],
        correct: 1,
        rationale: "Hyperoxygenation with 100% FiO2 for 30-60 seconds before suctioning is the most important preparatory step because suctioning removes oxygen along with secretions. Pre-oxygenation builds an oxygen reserve to prevent hypoxemia during the procedure. Normal saline instillation is not recommended by current evidence."
      },
      {
        question: "During suctioning, the practical nurse notes the patient's heart rate drops from 88 to 52 beats per minute. What is the priority nursing action?",
        options: [
          "Continue suctioning quickly to finish the procedure",
          "Document the finding and continue monitoring",
          "Stop suctioning immediately, withdraw the catheter, and administer oxygen",
          "Increase the suction pressure and reinsert the catheter"
        ],
        correct: 2,
        rationale: "A heart rate drop to 52 bpm indicates significant bradycardia from vagal stimulation caused by the suction catheter. The priority action is to stop suctioning immediately, withdraw the catheter, and administer oxygen. If bradycardia persists, atropine may be needed. Continuing suctioning can worsen the vagal response and lead to cardiac arrest."
      },
      {
        question: "A practical nurse is selecting a suction catheter for a patient with a size 8.0 mm endotracheal tube. Which catheter size is most appropriate?",
        options: [
          "16 French (8.0 mm external diameter)",
          "14 French (4.7 mm external diameter)",
          "12 French (4.0 mm external diameter)",
          "10 French (3.3 mm external diameter)"
        ],
        correct: 2,
        rationale: "The suction catheter should be no larger than half the internal diameter of the endotracheal tube. For an 8.0 mm tube, the maximum catheter size is 4.0 mm external diameter, which corresponds to a 12 French catheter. A catheter that is too large occludes the airway, preventing air entrainment and causing severe hypoxemia."
      }
    ]
  },

  "suctioning-technique-rpn": {
    title: "Suctioning Technique: Oropharyngeal, Nasopharyngeal, and Endotracheal",
    cellular: {
      title: "Anatomy of Suctioning Routes and Technique Principles",
      content: "Understanding the anatomical pathways for each suctioning route is essential for safe and effective airway clearance. Oropharyngeal (Yankauer) suctioning targets the oral cavity and posterior oropharynx, accessing pooled secretions above the glottis. The oropharynx extends from the soft palate to the epiglottis and contains the palatine tonsils, base of the tongue, and posterior pharyngeal wall. Oropharyngeal suctioning uses a rigid Yankauer catheter (tonsil-tip suction) and is considered a clean procedure because the oral cavity is not a sterile environment. This is the most common and least invasive form of suctioning and is within the RPN scope of practice in most jurisdictions. Nasopharyngeal suctioning involves inserting a flexible suction catheter through the nostril, following the floor of the nasal cavity (not upward) along the inferior turbinate into the nasopharynx and potentially to the level of the pharynx. The nasal cavity is lined with highly vascular mucosa (Kiesselbach plexus on the anterior septum), making epistaxis a significant risk. Nasopharyngeal suctioning reaches deeper secretions than oral suctioning and can stimulate a cough reflex to mobilize secretions from lower airways. This route requires a water-soluble lubricant and sterile technique with a flexible catheter. Endotracheal suctioning is performed through an existing endotracheal tube (ETT) or tracheostomy tube. The catheter bypasses the upper airway entirely and enters the trachea and potentially the mainstem bronchi. Because the lower respiratory tract is normally sterile below the larynx, strict sterile technique is mandatory. The catheter should be advanced until resistance is met (carina), then withdrawn 1-2 cm before applying suction to prevent carinal trauma and excessive coughing. Each technique has specific catheter types, pressure settings, insertion depths, and sterility requirements that the practical nurse must follow according to facility protocol and the delegating registered nurse's direction."
    },
    riskFactors: [
      "Artificial airway in place (endotracheal tube or tracheostomy) requiring regular suctioning",
      "Excessive secretion production from pneumonia, bronchitis, COPD exacerbation, or post-extubation",
      "Impaired cough reflex from neurological injury, sedation, or neuromuscular disease",
      "Post-anesthesia recovery with residual effects of muscle relaxants on airway protective reflexes",
      "Aspiration event with need to clear aspirated material from the airway",
      "Coagulopathy or anticoagulant therapy (increased bleeding risk with nasal or tracheal suctioning)",
      "Facial or basilar skull fracture (nasopharyngeal suctioning contraindicated due to risk of intracranial catheter placement)"
    ],
    diagnostics: [
      "Pulse oximetry: continuous SpO2 monitoring is mandatory during all suctioning procedures; document pre-procedure, lowest during procedure, and post-procedure values",
      "Chest auscultation: systematic lung field assessment before and after suctioning to evaluate secretion clearance effectiveness; rhonchi that clear with coughing or suctioning indicate secretion mobilization",
      "Chest X-ray: evaluates for atelectasis, consolidation, or pneumothorax if suctioning complications are suspected; also confirms ETT position",
      "Sputum specimen collection: obtain during suctioning using a sputum trap (Lukens trap) connected inline between the catheter and suction tubing; maintain sterile technique to prevent contamination",
      "Capnography (EtCO2): waveform changes during suctioning may indicate bronchospasm (shark fin waveform) or tube obstruction; rising baseline EtCO2 suggests retained secretions impairing ventilation",
      "Cardiac monitoring: continuous ECG monitoring during endotracheal suctioning to detect vagal-mediated bradycardia or hypoxemia-induced tachycardia and dysrhythmias"
    ],
    management: [
      "Oropharyngeal suctioning: use Yankauer catheter, clean technique, suction pressure 100-150 mmHg for adults; suction along gum line and oropharynx; no time limit per pass but avoid stimulating the gag reflex excessively",
      "Nasopharyngeal suctioning: use flexible catheter with water-soluble lubricant, measure insertion depth from tip of nose to tragus of ear, insert along floor of nasal cavity (not upward), apply suction on withdrawal only, limit pass to 10-15 seconds",
      "Endotracheal suctioning: strict sterile technique (open system) or clean technique (closed inline system), pre-oxygenate with 100% FiO2, insert catheter without suction until resistance, withdraw 1-2 cm, apply intermittent suction while rotating and withdrawing over 10-15 seconds",
      "Closed inline suctioning: does not require disconnection from ventilator, reduces hypoxemia and infection risk, can be performed by one person, catheter is enclosed in a protective sheath and reused per manufacturer guidelines",
      "Position patient appropriately: semi-Fowler position (30-45 degrees) promotes drainage and reduces aspiration risk; turn head to side for oropharyngeal suctioning in unconscious patients",
      "Suction oral cavity BEFORE deflating ETT cuff to prevent pooled subglottic secretions from entering the lower airway",
      "Rinse suction catheter with sterile water or saline between passes to maintain catheter patency and clear secretions from tubing"
    ],
    nursingActions: [
      "Perform pre-suctioning assessment: respiratory rate, depth, pattern; SpO2; lung sounds; presence of visible or audible secretions; patient distress level; cough effectiveness",
      "Gather all equipment before beginning: correct catheter type and size, functioning suction source at prescribed pressure, personal protective equipment (gloves, mask, eye protection), sterile water for rinsing",
      "For open endotracheal suctioning, maintain dominant hand as sterile throughout the procedure; use non-dominant hand to control suction port and manage connections",
      "Never force the catheter if resistance is met during nasopharyngeal suctioning; withdraw and attempt the other nostril -- forcing can cause epistaxis or nasal mucosal damage",
      "Monitor and document secretion characteristics after each suctioning episode: amount (scant, moderate, copious), color (clear, white, yellow, green, blood-tinged, brown), consistency (thin, moderate, thick/tenacious), odor (none, foul)",
      "Perform oral hygiene every 2 hours and PRN for intubated patients using chlorhexidine oral care as ordered; this reduces oral bacterial load and ventilator-associated pneumonia risk",
      "Report to the registered nurse: inability to pass catheter, persistent desaturation, bloody secretions, new cardiac dysrhythmias, signs of respiratory deterioration after suctioning"
    ],
    assessmentFindings: [
      "Oropharyngeal secretion pooling visible in the mouth or pharynx, especially in patients with diminished consciousness or impaired swallowing",
      "Coarse crackles or rhonchi over large airways on auscultation that clear or change character after suctioning, confirming secretion presence",
      "Decreased air entry on auscultation with dullness to percussion over affected lung segments suggesting mucus plugging or atelectasis",
      "Elevated peak inspiratory pressures on the ventilator with secretion-related waveform changes indicating increased airway resistance",
      "Coughing stimulated by catheter insertion, which is a normal vagal response and can help mobilize deeper secretions for removal",
      "Changes in secretion color from clear/white to yellow/green suggesting developing infection or from blood-tinged suggesting mucosal injury",
      "Post-suctioning improvement: clearing of adventitious sounds, improved SpO2, decreased work of breathing, reduced peak airway pressures on ventilator"
    ],
    signs: {
      left: [
        "Audible gurgling or rattling with respirations",
        "Mild SpO2 decrease (92-94%) with visible secretions",
        "Productive but weak cough with partial secretion clearance",
        "Coarse crackles or rhonchi on auscultation",
        "Slight increase in respiratory rate from baseline",
        "Patient verbalizing difficulty clearing throat"
      ],
      right: [
        "SpO2 below 85% during or after suctioning (severe hypoxemia)",
        "Sustained bradycardia below 50 bpm from vagal stimulation",
        "Frank hemoptysis (bright red blood) from suctioning catheter",
        "Pneumothorax signs (sudden unilateral absent breath sounds, subcutaneous emphysema) after aggressive suctioning",
        "Complete airway obstruction from mucus plug that cannot be cleared with suctioning",
        "Laryngospasm or severe bronchospasm triggered by catheter stimulation"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% NaCl) for Catheter Rinsing",
        type: "Irrigating solution",
        action: "Used to flush and clear the suction catheter lumen between suctioning passes, maintaining catheter patency by preventing secretion buildup inside the catheter; also used to rinse connecting tubing after the suctioning procedure is complete",
        sideEffects: "None when used for catheter rinsing only; risks apply only when instilled directly into the airway (see suctioning-rpn lesson for instillation concerns)",
        contra: "Do not instill directly into the airway unless specifically ordered; use sterile normal saline for endotracheal catheter rinsing and clean normal saline for oropharyngeal catheter rinsing",
        pearl: "Keep a container of sterile water or normal saline at bedside for catheter rinsing; discard and replace every 24 hours per facility protocol to prevent bacterial contamination"
      },
      {
        name: "Supplemental Oxygen (100% FiO2)",
        type: "Medical gas / respiratory support",
        action: "Provides maximum inspired oxygen concentration before and after suctioning passes to build alveolar oxygen reserves and prevent desaturation; oxygen diffuses across the alveolar-capillary membrane following a pressure gradient, maintaining arterial oxygen tension during the brief period of suctioning when oxygen delivery is interrupted",
        sideEffects: "Oxygen toxicity with prolonged use at high FiO2 (free radical damage to alveolar epithelium), absorption atelectasis (high oxygen concentration washes out nitrogen that normally keeps alveoli open), retinopathy of prematurity in neonates",
        contra: "Brief pre-oxygenation at 100% FiO2 for suctioning has no significant contraindications; prolonged high FiO2 should be avoided -- return to baseline FiO2 promptly after suctioning is complete",
        pearl: "Most ventilators have a dedicated suction or 100% O2 button that delivers 100% FiO2 for 2 minutes then automatically returns to baseline settings -- use this feature for safe and consistent pre-oxygenation"
      },
      {
        name: "Lidocaine Jelly 2% (topical)",
        type: "Topical local anesthetic / lubricant",
        action: "Applied to the tip of the suction catheter before nasopharyngeal suctioning to reduce pain, discomfort, and reflex coughing during catheter insertion through the nasal passage; blocks sodium channels in sensory nerve endings of the nasal mucosa, decreasing pain signal transmission",
        sideEffects: "Numbness of nasal and pharyngeal mucosa (temporary), local irritation, rare systemic absorption causing dizziness or metallic taste if applied in excessive amounts",
        contra: "Known allergy to amide-type local anesthetics; do not exceed recommended application amount to avoid systemic absorption; avoid in patients with impaired swallowing without ensuring aspiration precautions",
        pearl: "Apply a thin layer to the catheter tip only -- excessive lubricant can be aspirated into the lower airway; after using lidocaine jelly nasally, ensure the patient remains NPO or on aspiration precautions until sensation returns (approximately 30-60 minutes)"
      }
    ],
    pearls: [
      "Oropharyngeal (Yankauer) suctioning is CLEAN technique; nasopharyngeal and endotracheal suctioning require STERILE technique (open system) -- knowing which technique to use for each route is a common exam question",
      "For nasopharyngeal suctioning, measure catheter insertion depth from the tip of the nose to the tragus of the ear -- this estimates the distance to the pharynx and prevents inserting the catheter too deep",
      "Nasopharyngeal suctioning is CONTRAINDICATED in patients with basilar skull fractures, nasal fractures, or coagulopathy -- use oropharyngeal route instead",
      "Always suction the oropharynx BEFORE deflating the ETT cuff -- subglottic secretions pool above the cuff and will flood the lower airway if the cuff is deflated without clearing them first",
      "Closed inline suctioning is preferred for mechanically ventilated patients because it maintains PEEP, reduces infection risk, prevents desaturation, and does not require breaking the ventilator circuit",
      "During endotracheal suctioning, insert the catheter until resistance is met (carina), then withdraw 1-2 cm BEFORE applying suction -- applying suction at the carina causes mucosal trauma, coughing, and potential pneumothorax",
      "Document COLA after every suctioning episode: Color, Odor (if any), amount (scant/moderate/copious), and consistency (thin/moderate/thick) -- this trending data helps identify developing infections or changes in respiratory status"
    ],
    quiz: [
      {
        question: "A practical nurse is performing nasopharyngeal suctioning. Which action demonstrates correct technique?",
        options: [
          "Direct the catheter upward toward the bridge of the nose",
          "Insert the catheter along the floor of the nasal cavity toward the ear",
          "Apply suction continuously during catheter insertion and withdrawal",
          "Force the catheter past any resistance encountered during insertion"
        ],
        correct: 1,
        rationale: "The correct technique for nasopharyngeal suctioning is to insert the catheter along the floor of the nasal cavity (parallel to the hard palate) directed toward the ear, not upward. Directing the catheter upward can cause trauma to the turbinates and lead to epistaxis. Suction is applied only during withdrawal, and the catheter should never be forced past resistance."
      },
      {
        question: "Before deflating an endotracheal tube cuff for any reason, which nursing action is essential?",
        options: [
          "Administer a sedative to the patient",
          "Suction the oropharynx to clear pooled secretions above the cuff",
          "Place the patient in a flat supine position",
          "Remove the nasogastric tube if present"
        ],
        correct: 1,
        rationale: "Before deflating the ETT cuff, the oropharynx must be suctioned to remove secretions that have pooled above the cuff. If the cuff is deflated without clearing these secretions, they will flow past the cuff and into the lower airway, causing aspiration and potentially ventilator-associated pneumonia."
      },
      {
        question: "A practical nurse is caring for a patient who requires frequent endotracheal suctioning. The physician has ordered a closed inline suction system. What is the PRIMARY advantage of this system?",
        options: [
          "It allows deeper catheter insertion than open suctioning",
          "It eliminates the need for pre-oxygenation before suctioning",
          "It maintains ventilator PEEP and reduces infection risk by keeping the circuit closed",
          "It uses higher suction pressures for more effective secretion removal"
        ],
        correct: 2,
        rationale: "The primary advantage of closed inline suctioning is that it maintains positive end-expiratory pressure (PEEP) and keeps the ventilator circuit intact, reducing the risk of alveolar collapse and ventilator-associated pneumonia. It does not allow deeper insertion, does not eliminate the need for pre-oxygenation (still recommended), and does not use higher suction pressures."
      }
    ]
  },

  "surgical-wound-care-rpn": {
    title: "Surgical Wound Care for Practical Nurses",
    cellular: {
      title: "Wound Healing Physiology and Surgical Wound Classification",
      content: "Surgical wounds are classified by their method of closure into three categories of wound healing intention. Primary intention healing occurs when wound edges are directly approximated (sutured, stapled, or taped together) with minimal tissue loss; this produces the fastest healing with the least scar formation and lowest infection risk. Examples include clean surgical incisions, laceration repairs, and cesarean section wounds. Secondary intention healing occurs when wounds are left open to heal from the base upward through granulation tissue formation; these wounds have significant tissue loss and cannot be approximated. Examples include pressure injuries, burns, and wounds left open after abscess drainage. Tertiary intention (delayed primary closure) occurs when a contaminated wound is initially left open for several days to allow infection to resolve or edema to decrease, then surgically closed with sutures. The wound healing process itself follows four overlapping phases: hemostasis (immediate; platelet plug and fibrin clot formation), inflammatory phase (days 1-6; neutrophils and macrophages remove debris and pathogens, vasodilation causes erythema, warmth, and edema), proliferative phase (days 4-24; fibroblasts produce collagen, angiogenesis creates new blood vessels, granulation tissue fills the wound bed, epithelial cells migrate across the surface), and maturation/remodeling phase (day 21 to 2 years; collagen reorganizes along stress lines, scar tissue strengthens to approximately 80% of original tissue tensile strength). The practical nurse must recognize that surgical site infections (SSIs) are among the most common healthcare-associated infections, occurring in approximately 2-5% of clean surgical procedures. SSI risk increases with patient factors (diabetes, obesity, smoking, malnutrition, immunosuppression) and procedural factors (prolonged operative time, inadequate skin preparation, contaminated surgical classification). Two critical surgical wound complications are dehiscence (separation of wound edges, often along a fascial layer) and evisceration (protrusion of abdominal organs through a dehisced abdominal wound). Evisceration is a surgical emergency requiring immediate coverage of exposed organs with sterile saline-moistened dressings, positioning the patient in low Fowler position with knees bent, keeping the patient NPO, and emergency surgical intervention."
    },
    riskFactors: [
      "Diabetes mellitus (hyperglycemia impairs neutrophil function, delays wound healing, increases infection risk; target glucose below 180 mg/dL perioperatively)",
      "Obesity (decreased blood flow to adipose tissue, increased wound tension on closure, longer operative times, higher SSI rates)",
      "Malnutrition and protein deficiency (inadequate amino acids for collagen synthesis, impaired immune function; albumin below 3.0 g/dL significantly delays healing)",
      "Smoking (nicotine causes vasoconstriction reducing wound perfusion, carbon monoxide impairs oxygen delivery, impaired inflammatory cell function)",
      "Immunosuppressive therapy (corticosteroids suppress inflammatory response essential for healing; chemotherapy impairs cell proliferation)",
      "Advanced age (thinner skin, decreased collagen production, reduced immune response, decreased peripheral circulation)",
      "Chronic kidney disease (uremia impairs all phases of wound healing and platelet function)"
    ],
    diagnostics: [
      "Wound culture and sensitivity: obtained when infection is suspected (purulent drainage, erythema, warmth, fever); swab technique using the Levine method (rotate swab over 1 cm squared area with enough pressure to express fluid from wound tissue) provides more accurate results than surface swab",
      "Complete blood count (CBC): elevated WBC with left shift (increased bands/immature neutrophils) indicates acute infection; anemia (low hemoglobin) impairs oxygen delivery to wound tissues",
      "Serum albumin and prealbumin: albumin below 3.0 g/dL indicates malnutrition affecting wound healing; prealbumin (half-life 2-3 days) is a more sensitive marker of recent nutritional status than albumin (half-life 18-20 days)",
      "Blood glucose monitoring: perioperative hyperglycemia (above 180 mg/dL) significantly increases SSI risk; monitor fasting and postprandial glucose in diabetic surgical patients",
      "C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR): nonspecific markers of inflammation; trending values help monitor treatment response in wound infections",
      "Wound photography and measurement: document wound dimensions (length x width x depth in centimeters), tunnel/undermining location and depth, wound bed characteristics (percentage granulation, slough, eschar), and periwound skin condition at each dressing change"
    ],
    management: [
      "Maintain sterile technique during all surgical wound dressing changes; hand hygiene before and after, clean gloves to remove old dressing, sterile gloves for new dressing application",
      "Assess surgical wound at every dressing change using a systematic approach: approximation of wound edges, presence of sutures/staples/adhesive strips, drainage characteristics (serous, sanguineous, serosanguineous, purulent), surrounding skin condition, signs of infection",
      "For primary intention wounds: keep dressing dry and intact for first 24-48 hours per surgeon orders; initial dressing removal often done by or with the surgeon; subsequent dressings per facility protocol",
      "For secondary intention wounds: pack wound loosely with moist dressing material (saline-moistened gauze, hydrogel, alginate) to fill dead space and prevent premature surface closure over an unhealed wound bed",
      "Support nutrition for wound healing: high-protein diet (1.25-1.5 g/kg/day), adequate caloric intake, vitamin C (500-1000 mg/day for wound patients), zinc supplementation if deficient, adequate hydration",
      "Maintain Jackson-Pratt (JP), Hemovac, or Penrose drains as ordered; document drainage amount, color, and consistency every shift; report sudden increase or decrease in drainage output; strip/milk drain tubing per protocol to maintain patency",
      "For dehiscence: notify surgeon immediately, apply sterile saline-moistened dressing, do not attempt to push tissue back; for evisceration: cover exposed organs with sterile saline-moistened towels, position in low Fowler with knees flexed, keep NPO, prepare for emergency return to operating room"
    ],
    nursingActions: [
      "Perform hand hygiene and don PPE before wound assessment and dressing changes; use aseptic technique for all surgical wound care",
      "Assess surgical incision at least every shift and with each dressing change; document using standardized wound assessment terminology (REEDA scale for perineal wounds: Redness, Edema, Ecchymosis, Discharge, Approximation)",
      "Monitor drain output every shift: empty drainage reservoirs when half to two-thirds full to maintain suction; record volume, color (bright red, dark red, serous, serosanguineous), and consistency; report output greater than expected norms or sudden changes",
      "Teach the patient splinting technique: hold a pillow firmly against the abdominal incision during coughing, deep breathing, and position changes to reduce pain and decrease risk of dehiscence",
      "Administer prescribed analgesics 30-60 minutes before dressing changes to optimize pain management and patient cooperation during the procedure",
      "Reinforce patient education on wound care at home: signs of infection to report (increasing redness, warmth, swelling, purulent drainage, fever, wound separation), activity restrictions, dressing change technique if applicable, follow-up appointment schedule",
      "Report to the registered nurse immediately: purulent or foul-smelling drainage, wound edge separation (dehiscence), visible underlying tissue or organs (evisceration), signs of hemorrhage (bright red bleeding soaking through dressing), or fever above 38.3 degrees Celsius"
    ],
    assessmentFindings: [
      "Normal healing incision: well-approximated edges, mild erythema along incision line (inflammatory response), minimal serous or serosanguineous drainage in first 24-48 hours, no warmth or induration beyond incision margins",
      "Surgical site infection (SSI): erythema spreading beyond incision margins, increased warmth and induration, purulent drainage (thick, opaque, yellow/green/gray), fever, elevated WBC, pain increasing after initial improvement",
      "Dehiscence: partial or complete separation of wound edges, often preceded by a sudden gush of serosanguineous drainage (peritoneal fluid); patient may report a popping or tearing sensation; more common 5-10 days post-operatively",
      "Evisceration: protrusion of abdominal contents (usually bowel loops) through a dehisced abdominal incision; SURGICAL EMERGENCY -- exposed organs must be covered immediately with sterile saline-moistened dressings",
      "Seroma: painless, fluctuant swelling beneath the incision caused by accumulation of serous fluid in the surgical dead space; treated with aspiration if large",
      "Hematoma: firm, discolored swelling beneath the incision from bleeding into the surgical site; may require surgical evacuation if expanding or causing wound tension",
      "Normal drain output: Jackson-Pratt and Hemovac output transitions from sanguineous (first 24 hours) to serosanguineous (days 2-3) to serous (day 3 onward); volume gradually decreases; drains typically removed when output is less than 25-30 mL per 24 hours"
    ],
    signs: {
      left: [
        "Mild erythema along incision line (normal inflammatory response)",
        "Small amount of serous or serosanguineous drainage in first 48 hours",
        "Mild incisional pain controlled with prescribed analgesics",
        "Intact wound edges with sutures or staples in place",
        "Decreasing drain output transitioning from sanguineous to serous",
        "Slight periincisional edema in the immediate postoperative period"
      ],
      right: [
        "Wound dehiscence with separation of fascial layer",
        "Evisceration with visible bowel or organs protruding from wound",
        "Purulent drainage with foul odor and expanding cellulitis",
        "Active hemorrhage soaking through surgical dressings",
        "Fever above 38.3 degrees Celsius with systemic signs of sepsis",
        "Sudden large-volume serosanguineous drainage (herald sign of dehiscence)"
      ]
    },
    medications: [
      {
        name: "Cefazolin (Ancef/Kefzol)",
        type: "First-generation cephalosporin (perioperative prophylactic antibiotic)",
        action: "Binds to penicillin-binding proteins (PBPs) on bacterial cell walls, inhibiting transpeptidase-mediated cross-linking of peptidoglycan chains, leading to cell wall instability and bacterial lysis. Effective against common surgical wound pathogens including Staphylococcus aureus (MSSA) and Streptococcus species",
        sideEffects: "Diarrhea, nausea, injection site pain and phlebitis, hypersensitivity reactions (rash, urticaria, anaphylaxis), Clostridioides difficile-associated diarrhea with prolonged use",
        contra: "Known anaphylaxis to cephalosporins; use with caution in patients with penicillin allergy (approximately 1-2% cross-reactivity); dose adjustment required in renal impairment",
        pearl: "Cefazolin is the first-line prophylactic antibiotic for most clean and clean-contaminated surgical procedures; administered IV within 60 minutes before surgical incision for optimal tissue levels; redosed intraoperatively if surgery exceeds 4 hours or blood loss exceeds 1500 mL"
      },
      {
        name: "Mupirocin (Bactroban)",
        type: "Topical antibiotic",
        action: "Inhibits bacterial protein synthesis by reversibly binding to bacterial isoleucyl-tRNA synthetase, preventing incorporation of isoleucine into bacterial proteins. Bactericidal at concentrations achieved with topical application. Effective against Staphylococcus aureus including MRSA and Streptococcus pyogenes",
        sideEffects: "Local burning, stinging, or pruritus at application site; contact dermatitis (rare); headache and nausea with intranasal formulation",
        contra: "Hypersensitivity to mupirocin or polyethylene glycol base; do not apply to large open wounds where significant systemic absorption of polyethylene glycol base could occur (nephrotoxicity risk)",
        pearl: "Intranasal mupirocin is used for MRSA decolonization before elective surgery (applied to each nostril twice daily for 5 days preoperatively) to reduce SSI risk; topical mupirocin ointment is applied to small superficial wound infections 3 times daily for up to 10 days"
      },
      {
        name: "Silver Alginate Dressing (Silvercel, Aquacel Ag)",
        type: "Antimicrobial wound dressing with silver ions",
        action: "Combines calcium alginate fibers (derived from seaweed) with ionic silver. The alginate component absorbs wound exudate and forms a gel that maintains a moist wound healing environment. Silver ions are released in the presence of wound fluid, providing broad-spectrum antimicrobial activity against bacteria (including MRSA and Pseudomonas), fungi, and biofilms by disrupting bacterial cell membranes and denaturing proteins",
        sideEffects: "Transient gray or dark discoloration of wound bed and periwound skin (argyria-like), local sensitivity or irritation, potential for delayed wound assessment due to dressing opacity",
        contra: "Known silver sensitivity; not for use on patients undergoing MRI (metallic component); caution with very dry wounds (alginate requires exudate to form gel and may desiccate dry wound beds); do not use with oil-based products (inactivate silver)",
        pearl: "Silver alginate dressings are indicated for moderate to heavily exudative wounds with signs of infection or high bioburden; they can remain in place for up to 7 days depending on exudate levels; always moisten alginate dressings with sterile saline before removal to prevent trauma to new granulation tissue"
      }
    ],
    pearls: [
      "Primary intention: wound edges approximated (sutured/stapled) with minimal scarring. Secondary intention: wound left open, heals from base up with granulation. Tertiary intention: wound left open initially, then closed later -- know all three for exams",
      "The CRITICAL difference between dehiscence and evisceration: dehiscence is wound edge separation; evisceration is organ protrusion through the open wound. Evisceration is a SURGICAL EMERGENCY requiring immediate sterile saline-moistened dressing coverage",
      "For evisceration: cover exposed organs with sterile saline-moistened towels (NOT dry gauze), position in low Fowler with knees bent to reduce abdominal tension, keep NPO, and prepare for emergency surgery",
      "A sudden gush of serosanguineous (pink/watery) drainage from an abdominal incision 5-10 days post-op is the HERALD SIGN of impending dehiscence -- report immediately and do not leave the patient",
      "Splinting the incision with a pillow during coughing, deep breathing, and position changes reduces pain and mechanical stress on the wound edges, decreasing dehiscence risk",
      "Drain output documentation is critical: record volume, color, and consistency every shift. Normal progression is sanguineous (day 1) to serosanguineous (days 2-3) to serous (day 3+) with decreasing volume. Drains are removed when output is less than 25-30 mL per 24 hours",
      "Nutrition is essential for wound healing: protein provides amino acids for collagen synthesis, vitamin C is required for collagen cross-linking and immune function, and zinc supports cell division and immune response -- assess nutritional status in all surgical patients with delayed healing"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a postoperative patient 7 days after abdominal surgery. The patient reports a sudden 'popping' sensation and the nurse observes loops of bowel protruding through the incision. What is the priority nursing action?",
        options: [
          "Apply sterile dry gauze and elevate the head of bed to 90 degrees",
          "Cover the exposed organs with sterile saline-moistened dressings and position in low Fowler with knees bent",
          "Gently push the bowel back into the abdominal cavity and apply an abdominal binder",
          "Apply an ice pack to the wound and administer prescribed analgesics"
        ],
        correct: 1,
        rationale: "Evisceration (organ protrusion through a dehisced wound) is a surgical emergency. The priority is to cover exposed organs with sterile SALINE-MOISTENED dressings (not dry gauze, which can adhere to and damage organs), position the patient in low Fowler position with knees bent to reduce abdominal pressure, keep the patient NPO, and notify the surgeon for emergency return to the operating room. Never attempt to push organs back in."
      },
      {
        question: "A practical nurse is assessing a surgical wound on postoperative day 3. Which finding suggests a surgical site infection requiring immediate reporting?",
        options: [
          "Mild erythema extending 1 cm from the incision edges",
          "Small amount of clear serous drainage on the dressing",
          "Thick yellow-green purulent drainage with increasing warmth and redness beyond the wound margins",
          "Slight tenderness when palpating near the incision site"
        ],
        correct: 2,
        rationale: "Purulent (thick, yellow-green) drainage with expanding erythema, warmth, and induration beyond the wound margins are hallmark signs of surgical site infection (SSI). Mild erythema close to the incision line, scant serous drainage, and mild tenderness can be normal inflammatory findings in the early postoperative period."
      },
      {
        question: "A patient with a healing abdominal incision has a serum albumin of 2.4 g/dL. Which nutritional intervention should the practical nurse reinforce to promote wound healing?",
        options: [
          "Restrict fluid intake to reduce wound edema",
          "Increase dietary protein intake and consider nutritional supplements",
          "Eliminate all carbohydrates from the diet",
          "Decrease caloric intake to promote weight loss"
        ],
        correct: 1,
        rationale: "A serum albumin of 2.4 g/dL indicates protein malnutrition, which significantly impairs wound healing by reducing collagen synthesis and immune function. The appropriate intervention is to increase dietary protein intake (1.25-1.5 g/kg/day for wound patients) and consider nutritional supplements such as protein shakes. Restricting fluids, eliminating carbohydrates, or decreasing calories would further impair healing."
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
