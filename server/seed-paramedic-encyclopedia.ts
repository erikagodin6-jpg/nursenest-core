import { pool } from "./storage";
import { getExtraEntries } from "./seed-paramedic-encyclopedia-extra";
import { getExtraEntries2 } from "./seed-paramedic-encyclopedia-extra2";
import { getExtraEntries3 } from "./seed-paramedic-encyclopedia-extra3";
import { getExtraEntries4 } from "./seed-paramedic-encyclopedia-extra4";
import { getExtraEntries5 } from "./seed-paramedic-encyclopedia-extra5";
import { getExtraEntries6 } from "./seed-paramedic-encyclopedia-extra6";
import { getExtraEntries7 } from "./seed-paramedic-encyclopedia-extra7";

interface EncyclopediaEntry {
  profession: string;
  slug: string;
  title: string;
  category: string;
  overview: string;
  mechanism: string;
  clinicalRelevance: string;
  signsSymptoms: string;
  assessmentMethods: string;
  management: string;
  complications: string;
  clinicalPearls: string[];
  examPitfalls: string[];
  faq: { question: string; answer: string }[];
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  relatedTopicSlugs: string[];
  status: string;
  sortOrder: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildEntry(
  title: string,
  category: string,
  overview: string,
  mechanism: string,
  clinicalRelevance: string,
  signsSymptoms: string,
  assessmentMethods: string,
  management: string,
  complications: string,
  clinicalPearls: string[],
  examPitfalls: string[],
  faq: { question: string; answer: string }[],
  keywords: string[],
  relatedSlugs: string[],
  sortOrder: number
): EncyclopediaEntry {
  const slug = slugify(title);
  return {
    profession: "paramedic",
    slug,
    title,
    category,
    overview,
    mechanism,
    clinicalRelevance,
    signsSymptoms,
    assessmentMethods,
    management,
    complications,
    clinicalPearls,
    examPitfalls,
    faq,
    seoTitle: `${title} — Paramedic Encyclopedia | NurseNest`,
    metaDescription: `Learn about ${title.toLowerCase()} for paramedic exam preparation. Covers pathophysiology, assessment, management, clinical pearls, and common exam pitfalls.`,
    keywords,
    relatedTopicSlugs: relatedSlugs,
    status: "published",
    sortOrder,
  };
}

function getEntries(): EncyclopediaEntry[] {
  const entries: EncyclopediaEntry[] = [];
  let order = 0;

  // ═══════════════════════════════════════════
  // CATEGORY: Airway Management (15 topics)
  // ═══════════════════════════════════════════

  entries.push(buildEntry(
    "Orotracheal Intubation",
    "Airway Management",
    "Orotracheal intubation is the definitive airway management technique in which an endotracheal tube (ETT) is passed through the mouth, past the vocal cords, and into the trachea. It is the gold standard for securing the airway in patients who cannot protect it themselves or require prolonged ventilatory support in the prehospital setting.",
    "The technique involves direct or video laryngoscopy to visualize the glottic opening. The laryngoscope blade displaces the tongue and epiglottis, exposing the vocal cords. The ETT is advanced under direct vision through the cords and positioned 2-3 cm above the carina. Proper placement ensures ventilation of both lungs and prevents aspiration of gastric contents.",
    "Orotracheal intubation is a core ALS skill tested on NREMT and CoAEMSP examinations. Paramedics must demonstrate proficiency in both direct and video laryngoscopy. Failure to secure the airway is a leading cause of preventable prehospital death.",
    "Indications include: apnea, severe respiratory failure unresponsive to BLS interventions, GCS less than or equal to 8, inability to protect the airway (absent gag/cough reflex), inhalation injury with impending airway compromise, and cardiac arrest. Contraindications include complete upper airway obstruction from foreign body requiring surgical airway.",
    "Pre-intubation assessment includes the LEMON mnemonic: Look externally (facial trauma, obesity, short neck), Evaluate 3-3-2 rule (mouth opening, hyoid-to-chin, thyroid-to-floor-of-mouth distances), Mallampati score, Obstruction (tumor, epiglottitis, angioedema), and Neck mobility. Confirm placement with waveform capnography (gold standard), auscultation of bilateral breath sounds, absence of epigastric sounds, chest rise, and tube condensation.",
    "Preparation: Select appropriate ETT size (7.0-8.0 mm for adults), test cuff, prepare suction, preoxygenate with 100% O2 for 3-5 minutes. Position: Sniffing position with head elevated and neck extended. Technique: Insert laryngoscope with left hand, sweep tongue left, advance blade to vallecula (curved) or under epiglottis (straight), lift anteriorly without levering on teeth, pass ETT through cords, inflate cuff, confirm placement with ETCO2, secure tube, note depth at teeth (typically 22 cm for males, 20 cm for females).",
    "Complications include esophageal intubation (most dangerous — if unrecognized leads to hypoxia and death), right mainstem bronchus intubation, dental/lip trauma, vocal cord injury, aspiration, bradycardia from vagal stimulation, hypoxia during prolonged attempts, and barotrauma from overventilation.",
    [
      "Always confirm ETT placement with continuous waveform capnography — this is the gold standard and is required by virtually all EMS protocols",
      "If you cannot intubate within 30 seconds or two attempts, move to a supraglottic airway device — do not persist with multiple failed attempts",
      "Preoxygenation is not optional: 3-5 minutes of high-flow O2 via NRB creates an oxygen reservoir that buys critical time during intubation",
      "The Sellick maneuver (cricoid pressure) was historically recommended but is now controversial — follow your local protocols"
    ],
    [
      "Forgetting to confirm tube placement with capnography — auscultation alone is unreliable in noisy prehospital environments",
      "Choosing the wrong blade size or type for the patient anatomy",
      "Not having a backup airway plan before attempting intubation",
      "Confusing right mainstem intubation (absent left-sided breath sounds) with esophageal intubation"
    ],
    [
      { question: "What is the gold standard for confirming endotracheal tube placement?", answer: "Continuous waveform capnography (ETCO2) is the gold standard for confirming and continuously monitoring ETT placement. A sustained ETCO2 waveform of 35-45 mmHg indicates tracheal placement. Auscultation, chest rise, and tube condensation are secondary confirmatory methods." },
      { question: "What is the maximum time recommended for a single intubation attempt?", answer: "A single intubation attempt should not exceed 30 seconds. Prolonged attempts cause hypoxia and increase complication risk. If unsuccessful, ventilate the patient with BVM for at least 30 seconds before reattempting." },
      { question: "What is the LEMON mnemonic used for?", answer: "LEMON is a difficult airway assessment tool: Look externally, Evaluate 3-3-2 rule, Mallampati classification, Obstruction assessment, and Neck mobility. It helps predict difficult intubation before attempting the procedure." }
    ],
    ["paramedic intubation technique", "orotracheal intubation steps", "ETT placement confirmation", "NREMT airway management", "prehospital intubation"],
    ["supraglottic-airway-devices", "rapid-sequence-intubation", "failed-airway-algorithm", "capnography"],
    order++
  ));

  entries.push(buildEntry(
    "Supraglottic Airway Devices",
    "Airway Management",
    "Supraglottic airway devices (SGAs) are airway adjuncts inserted above the glottis to provide ventilation without direct visualization of the vocal cords. Common devices include the King LT, i-gel, and laryngeal mask airway (LMA). SGAs serve as primary airway management in cardiac arrest and as rescue devices when intubation fails.",
    "SGAs create a seal around the laryngeal inlet or esophageal opening, directing air flow into the trachea. The King LT has a distal esophageal balloon and proximal pharyngeal balloon that isolate the glottic opening between them. The i-gel uses a non-inflatable gel-like cuff that conforms to the perilaryngeal anatomy. Both provide effective ventilation without requiring laryngoscopy.",
    "SGAs are increasingly recognized as first-line airway devices in prehospital cardiac arrest, with some studies showing equivalent or superior outcomes compared to endotracheal intubation. NREMT tests SGA insertion as both a standalone skill and as a component of the failed airway algorithm.",
    "Indications: cardiac arrest, respiratory failure when intubation is not feasible or has failed, providers not trained or credentialed for intubation, and anticipated difficult airway as a primary strategy. Signs of proper placement include chest rise, bilateral breath sounds, ETCO2 waveform, improving SpO2, and absence of significant air leak.",
    "Select appropriate size based on patient height or weight (varies by device manufacturer). Open mouth using cross-finger technique. Insert device midline along the hard palate, advance until resistance is met. Inflate cuffs if applicable (King LT). Attach BVM and ventilate. Confirm placement with capnography, auscultation, and chest rise. Secure device.",
    "Ventilate at 10 breaths per minute with adequate tidal volume to produce visible chest rise. Avoid hyperventilation. Monitor ETCO2 continuously. If significant air leak occurs, reposition or consider upsizing. In cardiac arrest, once SGA is placed, provide continuous compressions with asynchronous ventilations at 10/min.",
    "Complications include inadequate seal resulting in air leak, gastric insufflation and aspiration, tissue trauma during insertion, failure to ventilate, laryngospasm, and device displacement during transport or CPR. Contraindications include intact gag reflex (in non-arrest patients), known esophageal disease, and caustic ingestion.",
    [
      "In cardiac arrest, SGAs allow continuous chest compressions with asynchronous ventilations — this maximizes coronary perfusion pressure",
      "The i-gel does not require cuff inflation, making it faster to place than the King LT",
      "Size selection is critical: too small leads to air leak, too large causes tissue trauma and poor seal",
      "SGAs do not provide definitive airway protection against aspiration — they reduce but do not eliminate aspiration risk"
    ],
    [
      "Assuming SGA placement equals definitive airway management — it does not protect against aspiration as reliably as an ETT",
      "Forgetting to confirm placement with capnography — same standard as ETT placement",
      "Using the wrong size device — always check the manufacturer's sizing guide",
      "Hyperventilating through an SGA — maintain 10 breaths/min to avoid gastric insufflation and impaired venous return"
    ],
    [
      { question: "When should a supraglottic airway be used instead of intubation?", answer: "SGAs are preferred in cardiac arrest (first-line in many systems), when the provider is not credentialed for intubation, when intubation has failed (rescue airway), and in anticipated difficult airways. Current evidence supports SGAs as equivalent to ETT in cardiac arrest outcomes." },
      { question: "How is proper SGA placement confirmed?", answer: "Proper placement is confirmed with continuous waveform capnography (ETCO2), bilateral breath sounds on auscultation, visible chest rise, improving oxygen saturation, and absence of significant air leak around the device." },
      { question: "What ventilation rate is used with an SGA in cardiac arrest?", answer: "With an advanced airway (SGA or ETT) in place during cardiac arrest, ventilate at 10 breaths per minute (one breath every 6 seconds) asynchronous with continuous chest compressions at 100-120/min." }
    ],
    ["supraglottic airway paramedic", "King LT airway insertion", "i-gel placement EMS", "SGA vs intubation", "prehospital airway devices"],
    ["orotracheal-intubation", "failed-airway-algorithm", "bag-valve-mask-ventilation", "cardiac-arrest-management"],
    order++
  ));

  entries.push(buildEntry(
    "Rapid Sequence Intubation",
    "Airway Management",
    "Rapid sequence intubation (RSI) is a technique that uses sedative and neuromuscular blocking agents to facilitate endotracheal intubation. RSI allows intubation of patients who are conscious, have intact reflexes, or present with trismus or combativeness. It is the most reliable method for securing the airway in the non-arrest patient with a predicted difficult airway.",
    "RSI involves the sequential administration of an induction agent (e.g., ketamine, etomidate) to render the patient unconscious, followed immediately by a neuromuscular blocking agent (e.g., succinylcholine, rocuronium) to achieve complete muscle relaxation. This eliminates protective reflexes and jaw tone, optimizing conditions for laryngoscopy and intubation.",
    "RSI is an advanced paramedic skill that requires significant training, pharmacological knowledge, and protocol authorization. It is a frequent topic on paramedic certification exams, particularly regarding drug selection, dosing, contraindications, and the management of failed RSI.",
    "Indications include patients requiring intubation who have intact gag reflex, trismus, combativeness, elevated ICP, status epilepticus, and severe agitation preventing safe airway management. The decision to perform RSI should consider the operator's experience, available equipment, and backup airway plans.",
    "The 7 Ps of RSI: Preparation (equipment, drugs, monitoring, backup plan), Preoxygenation (3-5 min 100% O2), Pretreatment (optional agents like lidocaine for ICP, fentanyl for sympathetic response), Paralysis with induction (push sedative then paralytic), Protection and Positioning (Sellick maneuver if protocol dictates, optimal positioning), Placement with Proof (intubate, confirm with ETCO2), Post-intubation Management (sedation, ventilator settings, reassessment).",
    "Induction agents: Ketamine 1-2 mg/kg IV (maintains BP, bronchodilates), Etomidate 0.3 mg/kg IV (hemodynamically neutral). Paralytics: Succinylcholine 1-2 mg/kg IV (onset 45-60 sec, duration 6-10 min), Rocuronium 1-1.2 mg/kg IV (onset 60-90 sec, duration 30-60 min). After intubation, maintain sedation and consider ongoing paralysis for transport.",
    "Complications include failed intubation after paralysis (cannot ventilate/cannot intubate scenario), aspiration, hypotension from induction agents, hyperkalemia from succinylcholine (in burns, crush injuries, renal failure), malignant hyperthermia (rare, succinylcholine), awareness during paralysis if sedation inadequate, and bradycardia.",
    [
      "Ketamine is preferred in hypotensive patients and those with bronchospasm — etomidate is preferred when hemodynamic neutrality is paramount",
      "Succinylcholine is contraindicated in hyperkalemia, burns >24h old, crush injuries, denervation injuries, and neuromuscular disease",
      "Always have a rescue airway (SGA) and surgical airway kit immediately available before initiating RSI",
      "Post-intubation sedation is critical — the paralytic wears off but the patient may still need to be sedated"
    ],
    [
      "Not recognizing contraindications to succinylcholine — the hyperkalemia risk in burns and crush injuries is a classic exam question",
      "Confusing induction agent doses — etomidate 0.3 mg/kg vs ketamine 1-2 mg/kg",
      "Forgetting to preoxygenate before RSI — this is the safety margin that prevents desaturation during the apneic period",
      "Not having a failed airway plan — RSI creates a patient who cannot breathe on their own"
    ],
    [
      { question: "What are the contraindications to succinylcholine?", answer: "Succinylcholine is contraindicated in hyperkalemia, burns >24 hours old, crush injuries >24 hours old, neuromuscular diseases (e.g., muscular dystrophy), denervation injuries, penetrating eye injuries, and personal/family history of malignant hyperthermia. In these cases, use rocuronium instead." },
      { question: "What is the difference between ketamine and etomidate for RSI?", answer: "Ketamine (1-2 mg/kg) increases heart rate and blood pressure, bronchodilates, and provides analgesia — ideal for hypotensive patients and those with reactive airway disease. Etomidate (0.3 mg/kg) is hemodynamically neutral with minimal effect on BP or HR — ideal for normotensive patients. Etomidate may suppress adrenal function with repeated doses." },
      { question: "What are the 7 Ps of RSI?", answer: "Preparation, Preoxygenation, Pretreatment, Paralysis with Induction, Protection and Positioning, Placement with Proof, and Post-intubation Management. This systematic approach ensures all critical steps are addressed." }
    ],
    ["rapid sequence intubation paramedic", "RSI medications EMS", "ketamine vs etomidate", "succinylcholine contraindications", "prehospital RSI protocol"],
    ["orotracheal-intubation", "failed-airway-algorithm", "pharmacology-of-sedatives", "difficult-airway-management"],
    order++
  ));

  entries.push(buildEntry(
    "Failed Airway Algorithm",
    "Airway Management",
    "The failed airway algorithm is a systematic approach to managing situations where initial airway management attempts are unsuccessful. It guides paramedics through escalating interventions from basic maneuvers to surgical airway access, ensuring oxygenation and ventilation are maintained throughout the process.",
    "The algorithm follows a stepwise approach: optimize basic airway maneuvers, attempt advanced airway placement with modified technique, transition to alternative airway device, and if all else fails, perform surgical cricothyrotomy. The key physiological principle is maintaining oxygenation — even brief interruptions in oxygen delivery can lead to irreversible brain injury.",
    "Failed airway management is one of the most critical scenarios tested on paramedic certification exams. The ability to recognize a failed airway, pivot to backup plans, and perform surgical airways distinguishes competent paramedics from those who may freeze in crisis situations.",
    "Signs of a failed airway include: inability to pass ETT after two optimized attempts, inability to maintain SpO2 >90% with BVM ventilation, rising ETCO2 without tube placement, worsening patient condition during airway attempts, and the 'can't intubate, can't oxygenate' (CICO) scenario.",
    "Assess for signs of failed intubation (no tube passage, no ETCO2). Attempt repositioning, external laryngeal manipulation (BURP), different blade type/size, bougie-assisted intubation. If BVM ventilation is possible, attempt SGA placement. If SGA fails, reattempt BVM with two-person technique and oral/nasal airways. If CICO scenario exists, proceed immediately to surgical cricothyrotomy.",
    "Step 1: Optimize BVM ventilation (two-person technique, OPA/NPA, jaw thrust). Step 2: Attempt SGA if not already tried. Step 3: Reattempt intubation with bougie or video laryngoscopy if available. Step 4: Surgical cricothyrotomy using needle or scalpel technique per protocol. Throughout: maintain oxygenation, limit attempts, call for backup early.",
    "Complications of failed airway scenarios include prolonged hypoxia leading to brain injury, aspiration, airway trauma from multiple attempts, pneumothorax from needle cricothyrotomy, hemorrhage from surgical airway, subcutaneous emphysema, and psychological distress for the provider team.",
    [
      "The most important action in a failed airway is to return to BVM ventilation — oxygenation always takes priority over intubation",
      "Limit intubation attempts to two before moving to a backup plan — each failed attempt causes swelling that makes subsequent attempts harder",
      "The bougie (gum elastic bougie) is the single most effective rescue tool for difficult intubation before moving to surgical airway",
      "Call for help early — do not wait until you are in a CICO scenario to request additional resources"
    ],
    [
      "Persisting with repeated intubation attempts instead of moving to backup airway — this is the most common and most dangerous error",
      "Not having backup airway equipment immediately available at the bedside before the first attempt",
      "Confusing a failed intubation with a failed airway — you can fail to intubate but still oxygenate the patient",
      "Delaying surgical cricothyrotomy when in a true CICO scenario — hesitation in this situation can be fatal"
    ],
    [
      { question: "What defines a 'can't intubate, can't oxygenate' scenario?", answer: "A CICO scenario exists when endotracheal intubation has failed AND bag-valve-mask ventilation cannot maintain adequate oxygenation (SpO2 <90% with optimized technique). This is a true emergency requiring immediate surgical airway access." },
      { question: "How many intubation attempts should be made before moving to a backup plan?", answer: "Current guidelines recommend a maximum of two optimized intubation attempts before transitioning to an alternative airway device. Each attempt should be with optimized positioning, technique modifications, or different equipment. Limiting attempts reduces airway trauma and maintains the oxygenation window." },
      { question: "What is the role of the bougie in failed airway management?", answer: "The bougie (gum elastic bougie) is a semi-rigid introducer that can be blindly advanced into the trachea when vocal cord visualization is poor. Tracheal rings create a characteristic 'clicking' sensation. Once placed, the ETT is railroaded over the bougie. It is the most effective rescue tool before moving to surgical airway." }
    ],
    ["failed airway algorithm paramedic", "can't intubate can't oxygenate", "CICO emergency", "surgical cricothyrotomy EMS", "backup airway plan"],
    ["orotracheal-intubation", "surgical-cricothyrotomy", "supraglottic-airway-devices", "bag-valve-mask-ventilation"],
    order++
  ));

  entries.push(buildEntry(
    "Bag-Valve-Mask Ventilation",
    "Airway Management",
    "Bag-valve-mask (BVM) ventilation is the fundamental technique for providing positive-pressure ventilation to patients who are not breathing adequately. It is the most commonly used ventilation method in prehospital care and serves as the primary backup when advanced airway attempts fail.",
    "The BVM delivers positive pressure to the airway through a face mask sealed against the patient's face. Squeezing the bag forces air (or supplemental oxygen) through a one-way valve, past the mask, and into the patient's lungs. A reservoir bag attached to oxygen supply delivers near 100% FiO2 at 15 L/min flow. Exhalation occurs passively through the exhalation port.",
    "BVM ventilation is the most fundamental ventilation skill for paramedics. It is tested on every level of EMS certification and is the cornerstone of the failed airway algorithm. Mastery of BVM technique is essential because it remains the primary ventilation method when advanced airways cannot be placed.",
    "Indications include apnea, respiratory failure with inadequate tidal volume, preoxygenation before intubation, and ventilation between intubation attempts. Adequate BVM ventilation produces visible chest rise, bilateral breath sounds, improving SpO2, and appropriate ETCO2 readings.",
    "Ensure proper mask size (covers nose and mouth without covering eyes or overhanging chin). Apply C-E grip: thumb and index finger form C on mask, middle/ring/little fingers lift mandible in E formation. Maintain head-tilt/chin-lift or jaw thrust. Squeeze bag to deliver 500-600 mL over 1 second. Observe for chest rise. Rate: 10-12 breaths/min for adults, 12-20 for pediatrics.",
    "One-person technique: C-E grip with one hand, squeeze bag with other. Two-person technique (preferred): one person maintains mask seal with both hands using jaw thrust, second person squeezes bag. Use oral or nasal airway adjuncts to maintain patency. Connect to high-flow oxygen (15 L/min) with reservoir. Avoid excessive force or rate.",
    "Complications include gastric insufflation leading to vomiting and aspiration, inadequate ventilation from poor mask seal, hyperventilation causing decreased venous return and hypotension, barotrauma from excessive tidal volumes, and facial nerve injury from excessive mask pressure.",
    [
      "Two-person BVM is always superior to one-person — delegate if a second provider is available",
      "The most common error is inadequate mask seal — this single issue causes most BVM ventilation failures",
      "Slow, steady squeezes over 1 second reduce gastric insufflation — fast, forceful ventilation fills the stomach",
      "In cardiac arrest, ventilate every 6 seconds (10/min) with advanced airway, or 30:2 ratio with BVM only"
    ],
    [
      "Hyperventilating the patient — too-fast ventilation rates impair venous return and reduce cardiac output in arrest",
      "Squeezing the bag too hard — you should deliver only enough to see the chest rise, not the entire bag volume",
      "Forgetting to use OPA/NPA adjuncts with BVM — these dramatically improve airway patency during ventilation",
      "Not recognizing when BVM ventilation is failing — persistent poor SpO2 despite good technique requires advanced airway"
    ],
    [
      { question: "What is the proper ventilation rate with BVM in cardiac arrest?", answer: "With BVM only (no advanced airway), deliver 2 ventilations after every 30 compressions. With an advanced airway in place, ventilate at 10 breaths per minute (every 6 seconds) continuously, asynchronous with compressions." },
      { question: "What is the C-E technique for BVM ventilation?", answer: "The C-E technique uses the thumb and index finger to form a 'C' shape to seal the mask against the face, while the middle, ring, and little fingers form an 'E' shape to lift the mandible and maintain airway patency. This grip provides both mask seal and jaw lift simultaneously." },
      { question: "Why is hyperventilation dangerous during cardiac arrest?", answer: "Hyperventilation increases intrathoracic pressure, which decreases venous return to the heart, reduces coronary perfusion pressure, and significantly worsens cardiac arrest outcomes. Additionally, it can cause gastric insufflation leading to aspiration." }
    ],
    ["BVM ventilation technique paramedic", "bag-valve-mask ventilation rate", "C-E grip technique", "prehospital ventilation", "BVM cardiac arrest"],
    ["orotracheal-intubation", "supraglottic-airway-devices", "cardiac-arrest-management", "oropharyngeal-airway"],
    order++
  ));

  entries.push(buildEntry(
    "Surgical Cricothyrotomy",
    "Airway Management",
    "Surgical cricothyrotomy is an emergency surgical airway procedure performed when all other airway management techniques have failed (can't intubate, can't oxygenate scenario). It involves making an incision through the cricothyroid membrane to establish a direct airway into the trachea.",
    "The cricothyroid membrane is a thin, avascular membrane located between the thyroid and cricoid cartilages in the anterior neck. It is the most accessible point for emergency surgical airway access. An incision through this membrane provides direct access to the tracheal lumen, bypassing any obstruction above the larynx.",
    "Surgical cricothyrotomy is the ultimate rescue airway and a critical skill for paramedic certification. While rarely performed in the field, the ability to recognize when it is indicated and perform it rapidly can be life-saving. It is a high-stakes topic on NREMT examinations.",
    "Indications: can't intubate, can't oxygenate scenario after failed ETT and SGA attempts, massive facial trauma preventing oral or nasal airway access, complete upper airway obstruction unresponsive to other interventions, and severe angioedema or anaphylaxis with total airway occlusion.",
    "Identify landmarks: thyroid cartilage (Adam's apple), cricoid cartilage below, cricothyroid membrane between them (palpable depression). In emergency, use the 'laryngeal handshake' to stabilize the larynx with the non-dominant hand while the dominant hand performs the procedure.",
    "Technique: Stabilize larynx with non-dominant hand. Make a vertical skin incision over cricothyroid membrane. Make a horizontal stab incision through the membrane. Insert a tracheal hook or rotate scalpel handle 90 degrees to open incision. Insert 6.0 cuffed tracheostomy tube or ETT (6.0-7.0). Inflate cuff. Ventilate and confirm with ETCO2. Secure tube.",
    "Complications include hemorrhage from thyroid vessels, false passage into subcutaneous tissue, posterior tracheal wall perforation, subcutaneous emphysema, esophageal perforation, subglottic stenosis (long-term), and tube displacement. Contraindications: age <10-12 years (needle cricothyrotomy preferred), tracheal transection with retraction, laryngeal fracture directly at the cricothyroid membrane.",
    [
      "Vertical skin incision, horizontal membrane incision — this reduces bleeding risk from midline vessels",
      "The cricothyroid membrane is approximately 9mm tall and 30mm wide in adults — it is a small but reliable target",
      "Do not hesitate when you have reached the CICO point — delays in performing surgical airway are the most common cause of poor outcomes",
      "Practice landmark identification regularly — the ability to rapidly locate the cricothyroid membrane under stress is essential"
    ],
    [
      "Hesitating too long before performing the procedure in a true CICO emergency — time to surgical airway should be under 60 seconds",
      "Making only a horizontal skin incision, which can miss the membrane if landmarks shift — vertical skin incision is safer",
      "Confusing the cricothyroid membrane with the thyrohyoid membrane (above thyroid cartilage) — wrong location",
      "Not securing the tube after placement — displacement during transport is a life-threatening complication"
    ],
    [
      { question: "When is surgical cricothyrotomy indicated?", answer: "Surgical cricothyrotomy is indicated only in a true can't-intubate, can't-oxygenate (CICO) emergency — when endotracheal intubation has failed, supraglottic airway has failed, and bag-valve-mask ventilation cannot maintain oxygenation. It is the final step in the failed airway algorithm." },
      { question: "Why is needle cricothyrotomy preferred in pediatric patients?", answer: "Needle cricothyrotomy is preferred in children under 10-12 years because the cricothyroid membrane is very small, the airway is more compliant, and surgical incision carries higher risk of damaging the developing laryngeal structures. Needle technique with jet ventilation provides temporary oxygenation." },
      { question: "What tube size is used for surgical cricothyrotomy?", answer: "A 6.0 cuffed tracheostomy tube is ideal. A 6.0-7.0 cuffed ETT can be used as a substitute. The tube should be small enough to pass through the cricothyroid membrane opening without trauma but large enough to allow adequate ventilation." }
    ],
    ["surgical cricothyrotomy procedure", "emergency surgical airway", "cricothyroid membrane anatomy", "CICO airway management", "field cricothyrotomy"],
    ["failed-airway-algorithm", "orotracheal-intubation", "upper-airway-obstruction", "anaphylaxis"],
    order++
  ));

  entries.push(buildEntry(
    "Capnography",
    "Airway Management",
    "Capnography is the continuous monitoring of end-tidal carbon dioxide (ETCO2) levels in exhaled air. Waveform capnography provides real-time measurement of CO2 concentration throughout the respiratory cycle, displayed as a waveform (capnogram) and a numeric value. It is the gold standard for airway and ventilation monitoring.",
    "CO2 is produced by cellular metabolism, transported to the lungs via the bloodstream, and eliminated during exhalation. ETCO2 reflects the balance between CO2 production (metabolism), CO2 transport (cardiac output/perfusion), and CO2 elimination (ventilation). Normal ETCO2 is 35-45 mmHg. Changes in ETCO2 indicate alterations in one or more of these three factors.",
    "Capnography is arguably the most important monitoring tool in prehospital care after pulse oximetry. It confirms airway placement, guides CPR quality, detects ROSC, monitors ventilation adequacy, and helps diagnose conditions like bronchospasm, DKA, and pulmonary embolism. NREMT heavily tests capnography interpretation.",
    "Clinical applications: ETT/SGA confirmation (sustained ETCO2 >20 mmHg confirms tracheal placement), CPR quality monitoring (ETCO2 >10 mmHg indicates adequate compressions), ROSC detection (sudden ETCO2 rise to >40 mmHg), ventilation monitoring in sedated patients, assessment of bronchospasm (shark-fin waveform), metabolic acidosis monitoring (low ETCO2 with tachypnea in DKA).",
    "Attach capnography sensor between airway device and BVM/ventilator. Mainstream sensors attach directly to the circuit; sidestream sensors aspirate a sample through tubing. Monitor both the numeric ETCO2 value and the waveform shape. Normal capnogram has four phases: baseline (inspiration), expiratory upstroke, alveolar plateau, and inspiratory downstroke.",
    "Interpreting capnography: High ETCO2 (>45 mmHg) = hypoventilation, fever, MH, sodium bicarb administration. Low ETCO2 (<35 mmHg) = hyperventilation, hypothermia, low cardiac output, PE. Absent ETCO2 = esophageal placement, cardiac arrest, ventilator disconnect. Shark-fin waveform = bronchospasm/COPD. Gradually falling ETCO2 = decreasing cardiac output or hyperventilation. Sudden drop to zero = extubation, circuit disconnect, or cardiac arrest.",
    "Limitations include false readings with carbonated beverage ingestion, contamination of sensor with secretions or blood, unreliable readings during low perfusion states without waveform analysis, and colorimetric devices being less reliable than waveform capnography (qualitative vs quantitative).",
    [
      "In cardiac arrest, ETCO2 >10 mmHg indicates adequate chest compressions — use it to coach CPR quality",
      "A sudden rise in ETCO2 to >40 mmHg during CPR is the earliest indicator of ROSC — often before a pulse is palpable",
      "The 'shark fin' waveform (slurred upstroke) indicates bronchospasm and is pathognomonic on the capnogram",
      "Waveform capnography is required for all intubated patients — it is the standard of care, not optional"
    ],
    [
      "Relying on colorimetric ETCO2 detectors instead of waveform capnography — colorimetric devices are unreliable in low-flow states",
      "Interpreting low ETCO2 in cardiac arrest as 'no airway' when it actually indicates poor perfusion",
      "Not recognizing the shark-fin waveform as bronchospasm — this is a frequently tested capnography pattern",
      "Forgetting that ETCO2 reflects both ventilation AND perfusion — changes can be respiratory or circulatory in origin"
    ],
    [
      { question: "What does ETCO2 of 10 mmHg during CPR indicate?", answer: "An ETCO2 of 10 mmHg during CPR is the minimum threshold for adequate chest compressions. Values below 10 suggest compressions are not generating sufficient cardiac output. ETCO2 is used as a real-time quality indicator for CPR effectiveness." },
      { question: "How does capnography detect ROSC?", answer: "Return of spontaneous circulation (ROSC) produces a sudden, dramatic increase in ETCO2, typically rising from 10-20 mmHg to above 40 mmHg. This occurs because restored cardiac output delivers a large CO2 load from peripheral tissues to the lungs. This ETCO2 spike is often the earliest indicator of ROSC." },
      { question: "What causes a shark-fin capnography waveform?", answer: "A shark-fin waveform (slurred expiratory upstroke without a clear plateau) indicates bronchospasm or airway obstruction causing uneven emptying of alveoli. It is commonly seen in asthma, COPD exacerbation, and bronchiolitis. The degree of slurring correlates with the severity of obstruction." }
    ],
    ["capnography waveform interpretation", "ETCO2 monitoring paramedic", "end-tidal CO2 cardiac arrest", "capnogram patterns EMS", "waveform capnography NREMT"],
    ["orotracheal-intubation", "cardiac-arrest-management", "asthma-management", "copd-exacerbation"],
    order++
  ));

  entries.push(buildEntry(
    "Oropharyngeal Airway",
    "Airway Management",
    "The oropharyngeal airway (OPA) is a rigid, curved plastic device inserted into the mouth to prevent the tongue from obstructing the pharynx in unconscious patients. It is a basic airway adjunct used to maintain airway patency during BVM ventilation and as a temporizing measure before advanced airway placement.",
    "The OPA holds the tongue away from the posterior pharyngeal wall by conforming to the curvature of the palate and tongue. It creates an air channel from the oral opening to the hypopharynx, preventing soft tissue obstruction. The flange rests on the lips while the distal tip sits at the base of the tongue near the epiglottis.",
    "OPA insertion is a fundamental BLS/ALS skill tested at all EMS certification levels. Understanding proper sizing, insertion technique, and contraindications is essential for every paramedic. The OPA dramatically improves BVM ventilation effectiveness.",
    "Indications: unconscious patient without gag reflex who requires airway maintenance or BVM ventilation. Contraindication: any patient with a gag reflex — stimulation of the gag reflex can cause vomiting and aspiration. Signs of proper placement include improved air exchange, easier BVM ventilation, and no gagging.",
    "Sizing: Measure from the corner of the mouth to the earlobe or angle of the jaw. Adult technique: Insert upside down (concavity toward palate), advance to hard palate junction, then rotate 180 degrees as you advance to final position. Pediatric technique: Insert right-side up using a tongue depressor to avoid damage to the soft palate.",
    "Insert with the curve facing the palate (concavity upward), advance until you reach the junction of the hard and soft palate, then rotate 180 degrees so the curve follows the natural curve of the tongue. The flange should rest on the patient's lips. If the patient gags at any point, remove immediately.",
    "Complications include stimulating the gag reflex causing vomiting and aspiration, pushing the tongue posteriorly if improperly sized (too small), dental/lip trauma, and tissue damage in pediatric patients if rotated during insertion (use tongue depressor method instead).",
    [
      "If the patient gags on OPA insertion, remove it immediately and consider an NPA instead",
      "The most common OPA error is incorrect sizing — too large pushes the epiglottis closed, too small pushes the tongue back",
      "In pediatric patients, never use the rotation technique — insert right-side up with a tongue depressor",
      "OPA does not replace head positioning — always maintain head-tilt/chin-lift or jaw thrust with the OPA in place"
    ],
    [
      "Inserting an OPA in a patient with an intact gag reflex — this causes vomiting and aspiration",
      "Using the wrong size — too small pushes the tongue backward, too large may obstruct the airway",
      "Using the rotation technique in children — this can damage the soft palate; use tongue depressor method instead",
      "Relying on the OPA alone without maintaining proper head positioning"
    ],
    [
      { question: "How do you properly size an OPA?", answer: "Measure from the corner of the mouth to the earlobe or the angle of the jaw. The correct size should extend from the lips to just above the epiglottis, holding the tongue forward without pushing it back." },
      { question: "What is the main contraindication for OPA use?", answer: "The main contraindication is the presence of a gag reflex. Inserting an OPA in a patient with an intact gag reflex will stimulate vomiting, which can lead to aspiration. Use a nasopharyngeal airway (NPA) instead for semi-conscious patients." },
      { question: "Why is the insertion technique different for children?", answer: "In pediatric patients, the OPA is inserted right-side up (with the curve following the tongue) using a tongue depressor because the rotation technique used in adults can damage the relatively softer pediatric palate and cause bleeding or tissue injury." }
    ],
    ["oropharyngeal airway sizing", "OPA insertion technique", "oral airway paramedic", "airway adjunct EMS", "OPA vs NPA"],
    ["nasopharyngeal-airway", "bag-valve-mask-ventilation", "basic-airway-management", "airway-obstruction"],
    order++
  ));

  entries.push(buildEntry(
    "Nasopharyngeal Airway",
    "Airway Management",
    "The nasopharyngeal airway (NPA) is a soft, flexible tube inserted through the nostril into the posterior pharynx to maintain airway patency. Unlike the OPA, the NPA can be used in semi-conscious patients with intact gag reflexes, making it a versatile airway adjunct in prehospital care.",
    "The NPA passes through the nostril along the floor of the nasal cavity, following the natural curvature of the nasopharynx. The distal tip sits in the posterior pharynx above the epiglottis, maintaining an air channel past the tongue and soft palate. The flange rests against the nostril, preventing over-insertion.",
    "The NPA is a critical airway adjunct that bridges the gap between no intervention and advanced airway placement. It is particularly valuable for seizure patients, trauma patients with trismus, and intoxicated patients who retain a gag reflex but have inadequate airway maintenance.",
    "Indications: semi-conscious patients with intact gag reflex who cannot maintain their airway, trismus preventing OPA insertion, seizure patients, and as an adjunct to BVM ventilation. Traditional contraindication: suspected basilar skull fracture (midface trauma, raccoon eyes, Battle sign, CSF rhinorrhea) — though this is debated in current literature.",
    "Sizing: Measure from the tip of the nose to the earlobe. Select the largest NPA that fits comfortably in the nostril. Lubricate generously with water-soluble lubricant. Insert into the right nostril (if possible) with the bevel facing the septum. Advance along the floor of the nasal cavity (not upward) with gentle, steady pressure.",
    "Lubricate the NPA thoroughly. Insert into the right nostril with the bevel toward the septum. Advance along the floor of the nasal cavity with gentle, steady pressure. If resistance is met, try the other nostril — do not force. The NPA is properly placed when the flange sits flush against the nostril and air exchange improves. A safety pin through the flange prevents aspiration of the device.",
    "Complications include epistaxis (most common), insertion into the cranial vault (extremely rare, reported with severe basilar skull fractures), gagging or vomiting if too long, nasal tissue injury from forced insertion, and sinusitis with prolonged use.",
    [
      "The NPA is tolerated by most semi-conscious patients — it is the go-to airway adjunct when OPA causes gagging",
      "Always insert along the floor of the nasal cavity, not upward — the nasal cavity runs horizontally, not vertically",
      "Epistaxis is the most common complication — have suction ready and consider vasoconstrictor if available",
      "The basilar skull fracture contraindication is based on very rare case reports — in a true airway emergency, NPA may still be used"
    ],
    [
      "Forcing insertion when resistance is met — try the other nostril instead of applying more pressure",
      "Directing the NPA upward toward the forehead instead of straight back along the nasal floor",
      "Using an NPA that is too long, which stimulates the gag reflex or pushes the epiglottis",
      "Absolute contraindication in all facial trauma — the contraindication is specifically for suspected basilar skull fracture, not all facial trauma"
    ],
    [
      { question: "Can an NPA be used in patients with a gag reflex?", answer: "Yes, this is the primary advantage of the NPA over the OPA. The NPA is generally well-tolerated by semi-conscious patients who retain their gag reflex. It provides airway patency without the gagging and vomiting risk associated with OPA insertion." },
      { question: "How do you determine the correct NPA size?", answer: "Measure from the tip of the nose to the earlobe. The diameter should be the largest that comfortably fits in the nostril. An NPA that is too long will stimulate the gag reflex; one that is too short will not reach the posterior pharynx." },
      { question: "Why is the right nostril preferred for NPA insertion?", answer: "The right nostril is preferred because the bevel of most NPAs faces left, and inserting into the right nostril means the bevel faces the septum, reducing the risk of turbinate trauma. However, if the right nostril is obstructed, the left nostril can be used." }
    ],
    ["nasopharyngeal airway insertion", "NPA sizing technique", "nasal airway adjunct", "NPA vs OPA", "prehospital NPA"],
    ["oropharyngeal-airway", "bag-valve-mask-ventilation", "basic-airway-management", "seizure-management"],
    order++
  ));

  entries.push(buildEntry(
    "Needle Decompression",
    "Airway Management",
    "Needle decompression (needle thoracostomy) is an emergency procedure to relieve a tension pneumothorax by inserting a large-bore needle into the pleural space to release trapped air. It is a life-saving intervention that converts a tension pneumothorax into a simple pneumothorax.",
    "In tension pneumothorax, air enters the pleural space through a one-way valve mechanism but cannot escape. Progressive air accumulation increases intrapleural pressure, collapsing the affected lung, shifting the mediastinum toward the contralateral side, and compressing the heart and great vessels. This reduces venous return and cardiac output, leading to obstructive shock and cardiac arrest.",
    "Needle decompression is a critical ALS skill tested on paramedic certification exams. The ability to rapidly recognize tension pneumothorax and perform needle decompression can prevent cardiac arrest. It is one of the reversible causes of PEA arrest (the 'T' in H's and T's).",
    "Signs of tension pneumothorax: severe respiratory distress, hypotension, tachycardia, absent breath sounds on affected side, jugular venous distension, tracheal deviation away from affected side (late sign), cyanosis, and deteriorating mental status. In cardiac arrest, consider tension pneumothorax if PEA arrest with trauma history.",
    "Clinical recognition is based on mechanism of injury plus physical findings. Penetrating chest trauma, blunt chest trauma, barotrauma from positive pressure ventilation, and rib fractures are common causes. Ultrasound (if available) showing absent lung sliding confirms pneumothorax. Do not delay treatment for imaging if clinical picture is clear.",
    "Site selection: 2nd intercostal space, midclavicular line (traditional) or 4th-5th intercostal space, anterior axillary line (preferred — thinner chest wall). Use 14-gauge catheter, minimum 3.25 inches (8 cm) for adults. Insert needle over the top of the rib (to avoid the neurovascular bundle running along the inferior border). Advance until you feel a pop and hear a rush of air. Remove needle, leave catheter. Secure and monitor.",
    "Complications include failure to decompress (needle too short, wrong location, clotted catheter), iatrogenic pneumothorax if no tension pneumothorax existed, lung parenchymal injury, hemothorax from intercostal vessel injury, catheter kinking or dislodgement, and re-accumulation of tension requiring repeat decompression.",
    [
      "Always insert over the top of the rib, never along the bottom — the intercostal artery, vein, and nerve run along the inferior rib border",
      "The anterior axillary line (4th-5th ICS) is now preferred over midclavicular (2nd ICS) due to thinner chest wall and higher success rates",
      "Needle decompression is a temporizing measure — the patient still needs a chest tube at the hospital",
      "If the first needle decompression is unsuccessful, place a second needle at the alternative site — do not assume the diagnosis is wrong"
    ],
    [
      "Using a needle that is too short — standard 14g IV catheters (1.25 inch) are inadequate; use at least 3.25 inch needles",
      "Inserting below the rib instead of above it — this risks intercostal vessel injury and hemorrhage",
      "Delaying needle decompression in a deteriorating patient with clear signs of tension pneumothorax",
      "Confusing simple pneumothorax with tension pneumothorax — tension involves hemodynamic compromise, not just absent breath sounds"
    ],
    [
      { question: "Where is needle decompression performed?", answer: "Two accepted sites: 2nd intercostal space at the midclavicular line (traditional), or 4th-5th intercostal space at the anterior axillary line (currently preferred due to thinner chest wall and higher success rates). Always insert over the superior border of the rib." },
      { question: "What size needle is used for needle decompression?", answer: "A 14-gauge catheter of at least 3.25 inches (8 cm) in length is recommended for adults. Standard IV catheters are too short to reach the pleural space in most patients due to chest wall thickness." },
      { question: "How do you differentiate tension pneumothorax from simple pneumothorax?", answer: "Tension pneumothorax causes hemodynamic compromise (hypotension, tachycardia, JVD) and mediastinal shift (tracheal deviation) in addition to absent breath sounds and respiratory distress. Simple pneumothorax causes respiratory symptoms but does not cause hemodynamic instability." }
    ],
    ["needle decompression technique", "tension pneumothorax treatment", "needle thoracostomy paramedic", "chest decompression EMS", "14 gauge needle decompression"],
    ["tension-pneumothorax", "chest-trauma", "traumatic-cardiac-arrest", "obstructive-shock"],
    order++
  ));

  entries.push(buildEntry(
    "Suctioning Techniques",
    "Airway Management",
    "Airway suctioning is the use of negative pressure to remove blood, secretions, vomitus, and foreign material from the airway. Effective suctioning is essential to maintaining airway patency and preventing aspiration. Both oropharyngeal and endotracheal suctioning are core paramedic skills.",
    "Suction devices generate negative pressure (typically 80-120 mmHg for adults, 60-80 mmHg for children, 30-50 mmHg for neonates) that draws material from the airway through a catheter or rigid tip. Rigid (Yankauer) suction tips are used for oropharyngeal suctioning; flexible catheters are used for endotracheal and nasotracheal suctioning.",
    "Proper suctioning technique prevents aspiration, maintains airway patency, and ensures effective ventilation. It is a foundational skill tested at all EMS certification levels and is critical during airway management, resuscitation, and management of vomiting patients.",
    "Indications: audible gurgling during ventilation, visible secretions or blood in the airway, vomiting, need to clear the airway before or during intubation, and routine ETT maintenance. Signs of effective suctioning include clearing of gurgling sounds, improved chest rise with ventilation, and improved SpO2.",
    "Assess the need for suctioning: listen for gurgling, observe for visible secretions, note declining SpO2. Select appropriate equipment: Yankauer for oropharyngeal, flexible catheter for ETT/NPA suctioning. Ensure suction device is functioning and set to appropriate pressure.",
    "Oropharyngeal: Use rigid Yankauer tip. Insert without suction, then apply suction while withdrawing. Suction for no more than 10 seconds per attempt in adults (5 seconds in pediatrics). Reoxygenate between attempts. ETT suctioning: Use sterile flexible catheter no larger than half the ETT internal diameter. Insert without suction to just past the ETT tip, then apply suction while rotating and withdrawing over 10 seconds. Preoxygenate with 100% O2 before and after.",
    "Complications include hypoxia from prolonged suctioning, vagal stimulation causing bradycardia (especially with deep suctioning), mucosal trauma and bleeding, bronchospasm from tracheal irritation, atelectasis from excessive negative pressure, and increased intracranial pressure.",
    [
      "Never suction for more than 10 seconds per attempt — hypoxia develops rapidly during suctioning",
      "Always preoxygenate with 100% O2 before endotracheal suctioning",
      "Position the patient laterally (recovery position) when possible before oropharyngeal suctioning to use gravity assist",
      "The Yankauer tip is for the oropharynx only — never insert it past the base of the tongue"
    ],
    [
      "Suctioning for too long — exceeding 10 seconds causes hypoxia and can trigger cardiac dysrhythmias",
      "Applying suction during catheter insertion — this causes mucosal trauma; only apply suction during withdrawal",
      "Using a suction catheter too large for the ETT — catheter should be no more than half the internal diameter",
      "Not having suction immediately available during intubation — this is a critical setup failure"
    ],
    [
      { question: "What is the maximum suction time per attempt?", answer: "Maximum 10 seconds per attempt for adults and 5 seconds for pediatric patients. Prolonged suctioning causes hypoxia and can trigger vagal-mediated bradycardia. Always preoxygenate between suctioning attempts." },
      { question: "What suction pressure is used for adults versus children?", answer: "Adults: 80-120 mmHg. Children: 60-80 mmHg. Neonates: 30-50 mmHg. Excessive suction pressure can cause mucosal trauma and atelectasis." },
      { question: "What size suction catheter should be used for ETT suctioning?", answer: "The suction catheter should be no more than half the internal diameter of the endotracheal tube. For example, for an 8.0 mm ETT, use a maximum 12-14 French suction catheter. This prevents excessive negative pressure and atelectasis." }
    ],
    ["airway suctioning technique", "Yankauer suction tip", "endotracheal suctioning", "prehospital suctioning", "suction catheter sizing"],
    ["bag-valve-mask-ventilation", "orotracheal-intubation", "oropharyngeal-airway", "aspiration-pneumonia"],
    order++
  ));

  entries.push(buildEntry(
    "Oxygen Therapy and Delivery Devices",
    "Airway Management",
    "Oxygen therapy involves the administration of supplemental oxygen to patients with hypoxemia or potential hypoxemia. Multiple delivery devices exist, each providing different flow rates and oxygen concentrations. Selection depends on the patient's condition, required FiO2, and respiratory status.",
    "Oxygen delivery devices work on the principle of supplementing inspired air with additional oxygen. Room air contains 21% oxygen (FiO2 0.21). Delivery devices increase FiO2 by providing a concentrated oxygen source. Low-flow devices (nasal cannula, simple mask) mix supplemental O2 with room air; high-flow devices (non-rebreather, Venturi) deliver more precise or higher concentrations.",
    "Oxygen therapy selection is a fundamental paramedic skill. Understanding which device to use, appropriate flow rates, and target saturations is essential for patient management across virtually all emergency conditions. NREMT tests device selection and appropriate oxygen targets extensively.",
    "Device selection based on need: Nasal cannula (1-6 L/min, 24-44% FiO2) for mild hypoxemia. Simple face mask (6-10 L/min, 40-60% FiO2) for moderate hypoxemia. Non-rebreather mask (10-15 L/min, 60-90% FiO2) for severe hypoxemia or high-acuity patients. BVM with reservoir (15 L/min, nearly 100% FiO2) for apneic or severely compromised patients.",
    "Assess SpO2, respiratory rate, work of breathing, and patient presentation. Target SpO2 94-99% for most patients, 88-92% for known COPD patients. Monitor for signs of worsening despite therapy: increasing respiratory rate, accessory muscle use, decreasing mental status, and falling SpO2.",
    "Nasal cannula: Place prongs in nares, secure over ears, set flow 1-6 L/min. Simple mask: Place over nose and mouth, minimum 6 L/min to prevent CO2 rebreathing. Non-rebreather: Prefill reservoir bag, place mask, set flow 10-15 L/min, ensure one-way valves functional. Titrate flow to maintain target SpO2. Document device, flow rate, and patient response.",
    "Complications include oxygen toxicity with prolonged high-FiO2 administration, suppression of hypoxic drive in COPD patients (controversial but tested on exams), absorption atelectasis with high FiO2, drying of mucous membranes, skin breakdown from prolonged mask use, and fire hazard near ignition sources.",
    [
      "Always prefill the reservoir bag on a non-rebreather mask before placing it on the patient — otherwise the first breath draws from an empty bag",
      "Minimum flow for a simple face mask is 6 L/min — below this, exhaled CO2 accumulates in the mask",
      "Target SpO2 88-92% for COPD patients — this is one of the most frequently tested oxygen therapy questions",
      "Nasal cannula is appropriate for most patients with mild-moderate hypoxemia and is better tolerated than masks"
    ],
    [
      "Giving high-flow oxygen to a COPD patient without monitoring — target 88-92% SpO2 to avoid suppressing respiratory drive",
      "Using a simple face mask at less than 6 L/min — this causes CO2 rebreathing",
      "Not prefilling the non-rebreather reservoir bag before application",
      "Assuming all patients need high-flow oxygen — overtreating with oxygen has documented harms"
    ],
    [
      { question: "What SpO2 should be targeted for COPD patients?", answer: "Target SpO2 of 88-92% for patients with known COPD. These patients may rely on hypoxic drive for respiratory stimulation, and administering high-flow oxygen can suppress this drive. However, never withhold oxygen from a critically ill COPD patient — treat the emergency first." },
      { question: "What is the minimum flow rate for a simple face mask?", answer: "The minimum flow rate is 6 L/min. Below this rate, exhaled carbon dioxide accumulates inside the mask and is rebreathed, potentially causing hypercapnia. If the patient needs less than 6 L/min, switch to a nasal cannula." },
      { question: "What FiO2 does each oxygen delivery device provide?", answer: "Nasal cannula: 24-44% (1-6 L/min). Simple face mask: 40-60% (6-10 L/min). Non-rebreather mask: 60-90% (10-15 L/min). BVM with reservoir: near 100% (15 L/min). Each 1 L/min on nasal cannula adds approximately 4% FiO2." }
    ],
    ["oxygen therapy devices paramedic", "nasal cannula vs non-rebreather", "oxygen flow rates EMS", "SpO2 target COPD", "prehospital oxygen delivery"],
    ["copd-exacerbation", "asthma-management", "respiratory-distress-assessment", "pulse-oximetry"],
    order++
  ));

  entries.push(buildEntry(
    "Difficult Airway Management",
    "Airway Management",
    "Difficult airway management encompasses the strategies, tools, and decision-making processes used when standard airway techniques are anticipated or proven to be challenging. It includes prediction of difficulty, equipment selection, technique modification, and systematic escalation to rescue strategies.",
    "A difficult airway can arise from anatomical factors (obesity, short neck, limited mouth opening, facial trauma), pathological factors (angioedema, tumors, burns, infections), or situational factors (entrapped patients, limited space, positioning constraints). Understanding the mechanisms of difficulty allows prediction and preparation.",
    "Difficult airway management is a high-priority exam topic because it tests the paramedic's ability to adapt, problem-solve, and prioritize patient safety. It integrates knowledge of all airway techniques into a coherent decision-making framework.",
    "Predictors of difficulty: LEMON assessment (Look, Evaluate 3-3-2 rule, Mallampati, Obstruction, Neck mobility), history of difficult intubation, morbid obesity, facial hair preventing mask seal, cervical spine immobilization limiting positioning, blood/vomitus in airway, and airway edema.",
    "Systematic pre-assessment using LEMON and MOANS (for BVM difficulty: Mask seal, Obesity, Age >55, No teeth, Stiff lungs). Prepare for the worst case: ensure all airway devices from BVM through surgical airway are immediately available. Have a clear plan A, B, and C before any airway attempt.",
    "Plan A: Optimized first attempt (best operator, best blade, best position, bougie available). Plan B: Alternative device (video laryngoscopy, different blade, SGA). Plan C: BVM ventilation with adjuncts. Plan D: Surgical cricothyrotomy. At each step, assess whether the patient can be oxygenated. If yes, you have time to optimize. If no, escalate immediately.",
    "Complications of difficult airway situations include prolonged hypoxia from multiple failed attempts, aspiration, airway trauma, dental injury, esophageal intubation, surgical airway complications, and psychological impact on the care team.",
    [
      "The LEMON assessment should be done before every intubation — not just when you suspect difficulty",
      "Video laryngoscopy improves first-pass success rates significantly — use it if available, especially for predicted difficult airways",
      "Always verbalize your plan A, B, C, and D to your team before attempting airway management",
      "The best predictor of a difficult airway is a history of previous difficult intubation"
    ],
    [
      "Not performing a pre-intubation airway assessment — difficulty should be predicted, not discovered",
      "Not having backup equipment ready — all devices from OPA through surgical airway should be at arm's reach",
      "Persisting with the same technique after multiple failures instead of escalating to the next plan",
      "Tunnel vision on intubation when BVM ventilation is maintaining oxygenation — take time to optimize your approach"
    ],
    [
      { question: "What is the LEMON mnemonic?", answer: "L = Look externally (facial trauma, obesity, short neck, large tongue). E = Evaluate 3-3-2 rule (3 fingers mouth opening, 3 fingers hyoid-chin, 2 fingers thyroid-floor of mouth). M = Mallampati score. O = Obstruction (epiglottitis, abscess, tumor, angioedema). N = Neck mobility (C-spine immobilization, arthritis, ankylosing spondylitis)." },
      { question: "What does MOANS predict?", answer: "MOANS predicts difficulty with bag-valve-mask ventilation: M = Mask seal difficulty (facial hair, trauma, unusual anatomy). O = Obesity or Obstruction. A = Age >55. N = No teeth (dentures removed). S = Stiff lungs or cervical spine (asthma, COPD, pulmonary fibrosis, or C-spine immobilization limiting positioning)." },
      { question: "When should video laryngoscopy be used?", answer: "Video laryngoscopy should be considered for all predicted difficult airways, when direct laryngoscopy provides a poor view, for C-spine immobilized patients, morbidly obese patients, and as a first-line tool if available and the provider is proficient. Many systems now use video laryngoscopy as the primary device." }
    ],
    ["difficult airway assessment paramedic", "LEMON airway evaluation", "difficult intubation predictors", "airway management strategies", "video laryngoscopy prehospital"],
    ["orotracheal-intubation", "failed-airway-algorithm", "rapid-sequence-intubation", "surgical-cricothyrotomy"],
    order++
  ));

  entries.push(buildEntry(
    "Airway Obstruction Management",
    "Airway Management",
    "Airway obstruction is a partial or complete blockage of the upper or lower airway that prevents adequate air exchange. Causes include foreign body aspiration, tongue obstruction in unconscious patients, anaphylaxis, epiglottitis, and trauma. Management ranges from basic maneuvers to surgical intervention depending on severity and cause.",
    "Upper airway obstruction occurs at or above the larynx and may be caused by the tongue (most common in unconscious patients), foreign bodies, swelling (anaphylaxis, angioedema, burns), or trauma. Lower airway obstruction occurs below the larynx and is typically caused by bronchospasm, mucus plugging, or aspiration. The pathophysiology involves reduced or absent airflow, leading to hypoxia and hypercapnia.",
    "Airway obstruction is one of the most time-sensitive emergencies in prehospital care. The paramedic must rapidly distinguish between complete and partial obstruction, identify the cause, and initiate appropriate intervention. Foreign body airway obstruction (FBAO) management is tested at every EMS certification level.",
    "Partial obstruction: stridor, wheezing, coughing, hoarseness, drooling, difficulty speaking, use of accessory muscles. Complete obstruction: inability to speak, cough, or breathe; universal choking sign (hands clutching throat), cyanosis, silent chest on auscultation, rapid loss of consciousness.",
    "Assess: Is the patient able to cough, speak, or breathe? Strong cough = partial obstruction, encourage continued coughing. Weak cough, stridor, or inability to speak = severe obstruction requiring intervention. No air movement = complete obstruction requiring immediate intervention. Identify the likely cause based on history and presentation.",
    "Conscious FBAO: Abdominal thrusts (Heimlich maneuver) for adults and children >1 year. Chest thrusts for pregnant or obese patients. Back blows and chest thrusts for infants <1 year. Unconscious FBAO: Begin CPR, check for visible foreign body before ventilation, attempt ventilation, repeat cycle. Non-FBAO: Head-tilt/chin-lift, jaw thrust, OPA/NPA insertion, BVM ventilation, advanced airway, treat underlying cause (epinephrine for anaphylaxis, etc.).",
    "Complications include complete obstruction progressing to cardiac arrest, aspiration of dislodged foreign body into lower airway, rib fractures from abdominal thrusts, gastric rupture (rare), post-obstructive pulmonary edema, and hypoxic brain injury from prolonged obstruction.",
    [
      "The tongue is the most common cause of airway obstruction in unconscious patients — simple positioning maneuvers are highly effective",
      "Never perform a blind finger sweep — only remove foreign bodies you can see (visual finger sweep under direct laryngoscopy is acceptable)",
      "Abdominal thrusts are not used for infants <1 year — use back blows and chest thrusts instead",
      "If a foreign body causes complete obstruction and all maneuvers fail, consider direct laryngoscopy with Magill forceps"
    ],
    [
      "Performing abdominal thrusts on infants — this can cause liver/spleen injury; use back blows and chest thrusts",
      "Attempting blind finger sweeps — this can push the object deeper and worsen obstruction",
      "Not transitioning to CPR when a choking patient becomes unconscious",
      "Overlooking anaphylaxis as a cause of airway obstruction — always consider allergic reaction in acute-onset stridor without trauma"
    ],
    [
      { question: "What is the most common cause of airway obstruction in unconscious patients?", answer: "The tongue is the most common cause. Loss of muscle tone allows the tongue to fall posteriorly and obstruct the pharynx. This is managed with head-tilt/chin-lift, jaw thrust, and airway adjuncts (OPA/NPA)." },
      { question: "How is FBAO management different for infants?", answer: "For infants under 1 year, use alternating back blows (5) and chest thrusts (5) instead of abdominal thrusts. Place the infant face-down on your forearm for back blows, then turn face-up for chest thrusts. Abdominal thrusts are avoided due to risk of organ injury." },
      { question: "When should Magill forceps be used?", answer: "Magill forceps are used under direct laryngoscopy to remove a visible foreign body from the hypopharynx or laryngeal inlet that cannot be removed by standard FBAO maneuvers. This is an ALS-level intervention performed when the patient has a complete obstruction unresponsive to basic interventions." }
    ],
    ["airway obstruction management", "foreign body airway obstruction", "Heimlich maneuver paramedic", "choking emergency treatment", "FBAO algorithm"],
    ["anaphylaxis", "epiglottitis", "oropharyngeal-airway", "basic-airway-management"],
    order++
  ));

  entries.push(buildEntry(
    "Continuous Positive Airway Pressure",
    "Airway Management",
    "Continuous positive airway pressure (CPAP) is a noninvasive ventilation technique that delivers a constant level of positive pressure throughout the respiratory cycle via a tight-fitting face mask. It is used to treat acute pulmonary edema, COPD exacerbation, and other causes of respiratory distress without intubation.",
    "CPAP works by maintaining positive pressure in the airways throughout both inspiration and expiration. This recruits collapsed alveoli (improving oxygenation), reduces preload by increasing intrathoracic pressure (beneficial in heart failure), splints open obstructed airways (helpful in COPD and OSA), and reduces the work of breathing by counteracting intrinsic PEEP.",
    "CPAP is an increasingly important paramedic intervention that can prevent intubation and improve outcomes in cardiogenic pulmonary edema and COPD exacerbation. Its use in the prehospital setting has significantly reduced the need for field intubation and has been associated with improved survival.",
    "Indications: acute cardiogenic pulmonary edema (most effective indication), COPD exacerbation, asthma (adjunct), near-drowning, and pneumonia with respiratory distress. Contraindications: apnea, inability to protect airway, GCS <10, facial trauma preventing mask seal, pneumothorax, active vomiting, and SBP <90 mmHg.",
    "Assess for indications: acute dyspnea with pulmonary edema (rales/crackles, hypertension, S3 gallop, pink frothy sputum) or COPD exacerbation (wheezing, prolonged expiratory phase, history of COPD). Ensure no contraindications present. Monitor SpO2, ETCO2, respiratory rate, heart rate, and blood pressure continuously.",
    "Explain the procedure to the patient. Apply CPAP mask with proper seal (coach the patient to breathe normally). Start at 5 cmH2O PEEP and titrate up to 10-15 cmH2O based on response. Monitor for improvement: decreasing respiratory rate, improving SpO2, decreased work of breathing. Continue concurrent treatment (nitroglycerin for CHF, bronchodilators for COPD).",
    "Complications include barotrauma (pneumothorax, pneumomediastinum), gastric distension and aspiration, claustrophobia and patient intolerance, skin breakdown from mask pressure, decreased cardiac output in hypovolemic patients, and mask leak reducing effectiveness.",
    [
      "CPAP in cardiogenic pulmonary edema works in minutes — it reduces preload and recruits alveoli simultaneously",
      "Coach the patient to breathe normally through the device — panicked patients often fight the positive pressure",
      "Do not remove CPAP once applied unless the patient is deteriorating — removing and reapplying loses recruited alveoli",
      "CPAP is NOT a ventilator — the patient must be breathing spontaneously with adequate respiratory drive"
    ],
    [
      "Applying CPAP to a patient who cannot protect their airway (GCS <10) — this risks aspiration",
      "Using CPAP in suspected pneumothorax — positive pressure worsens pneumothorax and can cause tension",
      "Not monitoring blood pressure — CPAP increases intrathoracic pressure and can decrease cardiac output in hypovolemic patients",
      "Removing CPAP when the patient initially resists — coach them through it, as most patients adapt within 1-2 minutes"
    ],
    [
      { question: "How does CPAP help in cardiogenic pulmonary edema?", answer: "CPAP recruits collapsed alveoli, improving oxygenation and reducing intrapulmonary shunt. It increases intrathoracic pressure, which reduces both preload and afterload, decreasing the workload on the failing left ventricle. It also reduces the work of breathing by supporting inspiration against fluid-filled alveoli." },
      { question: "What are the contraindications to prehospital CPAP?", answer: "Apnea or respiratory arrest, inability to protect airway (GCS <10), facial trauma preventing mask seal, active vomiting, pneumothorax, hypotension (SBP <90), and patient refusal. CPAP requires a spontaneously breathing patient who can maintain their airway." },
      { question: "What is the typical starting pressure for CPAP?", answer: "Start at 5 cmH2O PEEP and titrate up to 10-15 cmH2O based on clinical response. Higher pressures recruit more alveoli but increase risk of barotrauma and hemodynamic effects. Titrate based on work of breathing, SpO2, and patient comfort." }
    ],
    ["CPAP prehospital use", "continuous positive airway pressure EMS", "CPAP pulmonary edema", "noninvasive ventilation paramedic", "CPAP vs intubation"],
    ["congestive-heart-failure", "copd-exacerbation", "pulmonary-edema", "respiratory-distress-assessment"],
    order++
  ));

  entries.push(buildEntry(
    "Waveform Capnography Interpretation",
    "Airway Management",
    "Waveform capnography interpretation involves analyzing the shape, trends, and numeric values of the continuous CO2 waveform (capnogram) to diagnose clinical conditions, monitor treatment effectiveness, and guide airway management decisions. It is one of the most powerful monitoring tools available to paramedics.",
    "The normal capnogram has four phases: Phase I (inspiratory baseline, CO2 near 0), Phase II (expiratory upstroke as dead space gas is replaced by alveolar gas), Phase III (alveolar plateau, relatively flat, representing alveolar CO2), and Phase 0 (inspiratory downstroke as fresh gas displaces alveolar gas). The end-tidal value is read at the end of Phase III.",
    "Capnography waveform analysis is an advanced assessment skill that distinguishes expert-level paramedic practice. Understanding waveform patterns allows diagnosis of conditions ranging from bronchospasm to metabolic acidosis, and guides real-time treatment decisions during CPR, sedation, and ventilator management.",
    "Waveform patterns and their significance: Normal square wave (35-45 mmHg) = adequate ventilation. Shark-fin pattern (slurred upstroke) = bronchospasm/COPD. Gradually decreasing ETCO2 = hyperventilation, decreasing cardiac output, or hypothermia. Gradually increasing ETCO2 = hypoventilation, fever, or malignant hyperthermia. Sudden drop to zero = extubation, complete obstruction, or cardiac arrest. Sudden rise = ROSC or sodium bicarbonate administration.",
    "Continuous monitoring of both the numeric ETCO2 value and the waveform shape. Compare trends over time. Correlate changes with clinical status and interventions. In cardiac arrest: monitor for ROSC (sudden rise), CPR quality (maintain >10 mmHg), and futility (persistently <10 mmHg after 20 min of optimal CPR).",
    "For each abnormal pattern, follow targeted treatment: Shark-fin → bronchodilators. Rising ETCO2 → increase ventilation rate. Falling ETCO2 → reassess (hyperventilation vs failing circulation). Absent waveform → check tube position, circuit connections, patient pulse. Curare cleft (dip in plateau) → patient attempting to breathe through paralysis, needs additional sedation/paralysis.",
    "Limitations include motion artifact during transport, contamination of sensor with secretions, unreliable readings in very low cardiac output states, and false positives from carbonated beverage ingestion. Colorimetric detectors provide qualitative data only and are unreliable in low-flow states.",
    [
      "The shark-fin waveform is the most commonly tested abnormal capnogram — it indicates bronchospasm or obstructive airway disease",
      "A curare cleft (notch in the plateau) indicates the patient is trying to breathe — consider this in paralyzed patients who may need more sedation",
      "Exponential decay waveform (decreasing amplitude with each breath) suggests cardiac arrest or near-arrest",
      "Always look at the waveform AND the number — a normal number with abnormal waveform still indicates pathology"
    ],
    [
      "Treating only the number and ignoring the waveform shape — the pattern tells you the diagnosis",
      "Attributing all ETCO2 changes to ventilation — remember ETCO2 also reflects cardiac output and metabolism",
      "Missing the gradual decrease in ETCO2 that indicates failing cardiac output rather than hyperventilation",
      "Not recognizing the sudden ETCO2 spike as ROSC during cardiac arrest — this is the earliest and most reliable sign"
    ],
    [
      { question: "What does a shark-fin capnography waveform indicate?", answer: "A shark-fin waveform (slurred expiratory upstroke without a defined plateau) indicates obstructive airway disease — bronchospasm in asthma, mucus plugging in COPD, or any condition causing uneven alveolar emptying. The severity of the slurring correlates with the degree of obstruction. Treatment includes bronchodilators." },
      { question: "What is a curare cleft and what does it mean?", answer: "A curare cleft is a small notch or dip in the alveolar plateau of the capnogram. It indicates that the patient is making spontaneous respiratory efforts against mechanical ventilation or neuromuscular blockade. In a paralyzed patient, it suggests the paralytic is wearing off and additional dosing may be needed." },
      { question: "How does capnography help during CPR?", answer: "During CPR, ETCO2 serves as a real-time indicator of CPR quality (target >10 mmHg), early detector of ROSC (sudden rise >40 mmHg), and prognostic indicator (persistently <10 mmHg after 20 minutes suggests poor prognosis). It is more reliable than pulse checks for detecting ROSC." }
    ],
    ["capnography waveform patterns", "capnogram interpretation paramedic", "shark fin waveform ETCO2", "capnography CPR monitoring", "end-tidal CO2 waveform analysis"],
    ["capnography", "asthma-management", "copd-exacerbation", "cardiac-arrest-management"],
    order++
  ));

  entries.push(buildEntry(
    "Pulse Oximetry",
    "Airway Management",
    "Pulse oximetry is a noninvasive monitoring technique that measures the percentage of hemoglobin saturated with oxygen (SpO2) and pulse rate using a sensor placed on the finger, ear, or forehead. It provides continuous, real-time assessment of a patient's oxygenation status and is a standard vital sign in prehospital care.",
    "Pulse oximeters work by emitting two wavelengths of light (red at 660nm and infrared at 940nm) through tissue containing pulsating arterial blood. Oxyhemoglobin absorbs more infrared light, while deoxyhemoglobin absorbs more red light. The ratio of absorption is calculated to determine SpO2. The device requires adequate peripheral perfusion and pulsatile blood flow to function accurately.",
    "Pulse oximetry is a fundamental monitoring tool used in virtually every patient encounter. Understanding its capabilities and limitations is critical for accurate patient assessment. NREMT tests both the use of SpO2 in clinical decision-making and knowledge of conditions that produce inaccurate readings.",
    "Normal SpO2: 94-100%. Mild hypoxemia: 90-94%. Moderate hypoxemia: 85-89%. Severe hypoxemia: <85%. Target SpO2: 94-99% for most patients, 88-92% for known COPD. SpO2 does not detect hypercarbia — a patient can have normal SpO2 but critically elevated CO2 levels.",
    "Place sensor on a well-perfused finger (avoid cold, edematous, or painted nails). Ensure the waveform quality is good (plethysmographic waveform shows consistent pulsation). Evaluate SpO2 in context of patient presentation — do not treat numbers in isolation. Compare to capnography for complete respiratory assessment.",
    "Apply sensor and wait for a stable reading (10-30 seconds). Assess waveform quality. If reading seems inaccurate, check for: poor perfusion, hypothermia, motion artifact, nail polish, carbon monoxide exposure, methemoglobinemia. Use in conjunction with clinical assessment, respiratory rate, and capnography for comprehensive monitoring.",
    "Limitations and sources of error: Carbon monoxide poisoning (SpO2 reads falsely high — carboxyhemoglobin absorbs light similarly to oxyhemoglobin), methemoglobinemia (SpO2 trends toward 85% regardless of true saturation), hypothermia and poor perfusion (poor signal), motion artifact, dark nail polish (remove or use earlobe), anemia (SpO2 may be normal despite inadequate oxygen delivery), and ambient light interference.",
    [
      "SpO2 does NOT detect hypercarbia — always pair pulse oximetry with capnography for complete respiratory assessment",
      "In carbon monoxide poisoning, SpO2 is unreliable and reads falsely normal — use co-oximetry if available",
      "SpO2 is a lagging indicator — desaturation indicates the patient was already hypoxic moments ago",
      "A normal SpO2 does not guarantee adequate tissue oxygenation — consider hemoglobin level and cardiac output"
    ],
    [
      "Relying solely on SpO2 for respiratory assessment — it does not measure ventilation or CO2 levels",
      "Trusting SpO2 in carbon monoxide poisoning — this is a classic exam pitfall; SpO2 reads falsely high",
      "Ignoring a poor waveform quality — an SpO2 reading without a good plethysmographic waveform is unreliable",
      "Over-treating based on SpO2 alone — clinical assessment should always accompany monitor readings"
    ],
    [
      { question: "Why is SpO2 unreliable in carbon monoxide poisoning?", answer: "Pulse oximeters cannot distinguish between oxyhemoglobin and carboxyhemoglobin because they absorb light at similar wavelengths. A patient with 40% carboxyhemoglobin may show SpO2 of 99% while actually having only 59% of hemoglobin available for oxygen transport. Co-oximetry is needed for accurate assessment." },
      { question: "What SpO2 target should be used for COPD patients?", answer: "Target SpO2 of 88-92% for patients with known COPD. These patients may rely on hypoxic respiratory drive, and over-oxygenation can suppress their ventilatory effort. However, in acute emergencies (cardiac arrest, severe trauma), oxygenation takes priority over COPD considerations." },
      { question: "What conditions cause falsely low SpO2 readings?", answer: "Falsely low readings can occur with poor peripheral perfusion (shock, hypothermia), motion artifact, dark nail polish, severe anemia, methemoglobinemia (trends toward 85%), ambient light interference, and sensor malposition. Falsely high readings occur with carbon monoxide poisoning." }
    ],
    ["pulse oximetry accuracy", "SpO2 monitoring paramedic", "pulse oximeter limitations", "oxygen saturation assessment", "carbon monoxide SpO2"],
    ["oxygen-therapy-and-delivery-devices", "capnography", "carbon-monoxide-poisoning", "respiratory-distress-assessment"],
    order++
  ));

  // Now I'll generate the remaining categories more efficiently with a helper
  // to keep the file manageable while still producing comprehensive content

  const remainingTopics: Array<{
    title: string;
    category: string;
    overview: string;
    mechanism: string;
    clinicalRelevance: string;
    signsSymptoms: string;
    assessment: string;
    management: string;
    complications: string;
    pearls: string[];
    pitfalls: string[];
    faq: { question: string; answer: string }[];
    keywords: string[];
    related: string[];
  }> = [

    // ═══════════════════════════════════════════
    // CATEGORY: Cardiac Emergencies (20 topics)
    // ═══════════════════════════════════════════

    {
      title: "Cardiac Arrest Management",
      category: "Cardiac Emergencies",
      overview: "Cardiac arrest is the cessation of effective cardiac mechanical activity resulting in the absence of circulation. It is the most time-critical emergency in prehospital care and the foundation of paramedic practice. Survival depends on rapid recognition, early CPR, defibrillation, and advanced cardiac life support (ACLS).",
      mechanism: "Cardiac arrest occurs when the heart's electrical conduction system fails to produce organized electrical activity or when electrical activity fails to generate effective mechanical contraction. Four rhythms are identified: ventricular fibrillation (VF), pulseless ventricular tachycardia (pVT), pulseless electrical activity (PEA), and asystole. VF/pVT are 'shockable' rhythms; PEA/asystole are 'non-shockable' rhythms.",
      clinicalRelevance: "Cardiac arrest management is the single most important clinical skill for paramedics. ACLS algorithms form the basis of paramedic certification examinations worldwide. Understanding the nuances of each arrest rhythm, drug therapy, and reversible causes directly impacts patient survival.",
      signsSymptoms: "Unresponsiveness, absence of normal breathing (agonal gasps may be present — these are NOT normal breathing), absence of a central pulse (check carotid for no more than 10 seconds), and clinical death. Prior to arrest, patients may experience chest pain, dyspnea, syncope, palpitations, or sudden collapse.",
      assessment: "Confirm cardiac arrest: tap and shout, check for breathing, check for pulse simultaneously (maximum 10 seconds). Attach defibrillator and identify rhythm. Assess H's and T's for reversible causes throughout resuscitation: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary/coronary).",
      management: "Shockable rhythms (VF/pVT): Defibrillate 200J biphasic → CPR 2 min → recheck → shock if still VF/pVT. Epinephrine 1mg IV/IO every 3-5 min. Amiodarone 300mg IV/IO first dose, 150mg second dose. Non-shockable (PEA/Asystole): CPR → Epinephrine 1mg IV/IO every 3-5 min → identify and treat reversible causes. High-quality CPR: rate 100-120/min, depth 2-2.4 inches, full chest recoil, minimize interruptions.",
      complications: "Complications of resuscitation include rib fractures from CPR, aspiration, hypoxic brain injury, post-cardiac arrest syndrome (myocardial stunning, neurological injury, systemic inflammation), and re-arrest. Complications of medications include vasopressor-induced hypertension post-ROSC and amiodarone-related hypotension.",
      pearls: [
        "High-quality CPR is the single most important intervention — without it, drugs and defibrillation are ineffective",
        "Minimize interruptions to compressions — pauses >10 seconds dramatically reduce coronary perfusion pressure",
        "Always consider and systematically treat reversible causes (H's and T's) — treating the underlying cause is the key to ROSC",
        "Epinephrine timing matters — give it early in non-shockable rhythms, after the second shock in shockable rhythms"
      ],
      pitfalls: [
        "Interrupting compressions for pulse checks, intubation, or medication — chest compression fraction should be >80%",
        "Not recognizing agonal gasps as cardiac arrest — agonal breathing is NOT adequate ventilation",
        "Failing to search for reversible causes — treating PEA with CPR alone without addressing the underlying cause",
        "Hyperventilating the patient — excessive ventilation increases intrathoracic pressure and decreases venous return"
      ],
      faq: [
        { question: "What is the correct sequence for VF/pVT arrest?", answer: "Confirm arrest → begin CPR → attach defibrillator → shock 200J biphasic → resume CPR 2 minutes → recheck rhythm → shock again if still VF/pVT → epinephrine 1mg IV/IO → CPR 2 min → recheck → shock → amiodarone 300mg IV/IO → continue cycle." },
        { question: "When should epinephrine be given in cardiac arrest?", answer: "For non-shockable rhythms (PEA/asystole): give epinephrine as soon as IV/IO access is established. For shockable rhythms (VF/pVT): give after the second shock. Repeat every 3-5 minutes regardless of rhythm." },
        { question: "What are the H's and T's of cardiac arrest?", answer: "H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia. T's: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (pulmonary and coronary). These represent treatable causes that should be identified and corrected during resuscitation." }
      ],
      keywords: ["cardiac arrest management paramedic", "ACLS algorithm prehospital", "VF pVT treatment", "H's and T's cardiac arrest", "CPR quality paramedic"],
      related: ["ventricular-fibrillation", "pulseless-electrical-activity", "asystole", "post-cardiac-arrest-care", "defibrillation"]
    },

    {
      title: "Ventricular Fibrillation",
      category: "Cardiac Emergencies",
      overview: "Ventricular fibrillation (VF) is a life-threatening cardiac rhythm characterized by chaotic, uncoordinated electrical activity of the ventricles resulting in no effective cardiac output. VF is the most common initial rhythm in witnessed sudden cardiac arrest and has the highest survival rate when treated with early defibrillation.",
      mechanism: "VF occurs when multiple reentrant circuits or rapidly firing ectopic foci cause the ventricular myocardium to quiver rather than contract in a coordinated manner. This chaotic electrical activity produces no forward blood flow. The most common trigger is acute myocardial ischemia, which creates areas of variable refractory periods that sustain reentry. Over time, VF degrades from coarse (higher amplitude, more treatable) to fine VF (lower amplitude, less responsive to defibrillation).",
      clinicalRelevance: "VF is the most important shockable rhythm for paramedics to recognize and treat. Survival from VF decreases by approximately 7-10% per minute without defibrillation. With early defibrillation (within 3-5 minutes) and high-quality CPR, survival rates can exceed 50%. This makes rapid recognition and treatment essential.",
      signsSymptoms: "VF presents as sudden cardiac arrest: unresponsiveness, absence of pulse, absence of normal breathing. The ECG shows chaotic, irregular waveforms without identifiable P waves, QRS complexes, or T waves. Coarse VF has higher amplitude deflections; fine VF has low amplitude deflections that may be confused with asystole.",
      assessment: "Rapid pulse check (≤10 seconds), immediate attachment of defibrillator, rhythm analysis. Differentiate coarse VF from artifact, fine VF from asystole (check in multiple leads, increase gain). The key assessment is rapid: confirm no pulse + identify shockable rhythm = defibrillate immediately.",
      management: "Immediate defibrillation at 200J biphasic (or equivalent). Resume CPR immediately for 2 minutes without pulse check. Reanalyze rhythm. If VF persists: shock again → CPR 2 min → epinephrine 1mg IV/IO → CPR 2 min → shock → amiodarone 300mg IV/IO → continue cycle. Treat reversible causes. Consider double sequential defibrillation for refractory VF per local protocol.",
      complications: "Complications include progression to asystole if untreated, recurrent VF after ROSC, myocardial injury from multiple defibrillation attempts, skin burns from defibrillation, and post-resuscitation myocardial stunning. Refractory VF (not responding to standard therapy) carries a poor prognosis.",
      pearls: [
        "Coarse VF has the best chance of successful defibrillation — shock it immediately, do not delay for IV access or intubation",
        "Fine VF may respond to a period of high-quality CPR before defibrillation — CPR improves myocardial perfusion and may convert fine VF to coarse VF",
        "Refractory VF may benefit from double sequential defibrillation, magnesium, lidocaine, or esmolol per protocol",
        "The single most important factor in VF survival is time to first defibrillation — every minute of delay reduces survival by 7-10%"
      ],
      pitfalls: [
        "Confusing fine VF with asystole — always check in multiple leads and increase gain; fine VF is a shockable rhythm",
        "Delaying defibrillation to establish IV access, intubate, or perform other interventions — shock first",
        "Stopping CPR too long for rhythm analysis — minimize hands-off time to <10 seconds",
        "Not considering reversible causes when VF is refractory to standard therapy"
      ],
      faq: [
        { question: "What energy level is used for VF defibrillation?", answer: "200 joules biphasic for the initial shock, then the same or escalating energy (up to 360J) for subsequent shocks. Monophasic defibrillators use 360J. Always follow the manufacturer's recommendation for your specific device." },
        { question: "What is the difference between coarse and fine VF?", answer: "Coarse VF has high-amplitude irregular waveforms (>3mm) indicating recent onset, more organized electrical activity, and better response to defibrillation. Fine VF has low-amplitude waveforms (<3mm) indicating prolonged arrest, progressive myocardial energy depletion, and lower defibrillation success rates." },
        { question: "When is amiodarone given in VF arrest?", answer: "Amiodarone 300mg IV/IO bolus is given after the third shock (after CPR and epinephrine). A second dose of 150mg can be given if VF persists. Amiodarone stabilizes the myocardial membrane and may help prevent recurrent VF after successful defibrillation." }
      ],
      keywords: ["ventricular fibrillation treatment", "VF defibrillation energy", "coarse vs fine VF", "shockable rhythm paramedic", "VF cardiac arrest survival"],
      related: ["cardiac-arrest-management", "defibrillation", "pulseless-ventricular-tachycardia", "amiodarone", "post-cardiac-arrest-care"]
    },

    {
      title: "Acute Myocardial Infarction",
      category: "Cardiac Emergencies",
      overview: "Acute myocardial infarction (AMI) is the irreversible death of myocardial tissue due to prolonged ischemia, most commonly caused by acute coronary artery occlusion. It is one of the leading causes of death worldwide and one of the most critical time-sensitive emergencies in prehospital care. Paramedic recognition and rapid transport can dramatically alter patient outcomes.",
      mechanism: "AMI typically results from rupture of an atherosclerotic plaque within a coronary artery, triggering platelet aggregation and thrombus formation that partially or completely occludes blood flow. The resulting ischemia leads to myocardial cell death within 20-40 minutes. The area of necrosis expands outward from the subendocardium over 3-6 hours. ST-elevation MI (STEMI) indicates complete coronary occlusion; non-STEMI indicates partial occlusion or significant stenosis.",
      clinicalRelevance: "STEMI recognition and rapid activation of the cardiac catheterization lab is a core paramedic competency. The phrase 'time is muscle' encapsulates the urgency — every minute of delay in reperfusion increases myocardial damage and mortality. Prehospital 12-lead ECG with STEMI activation reduces door-to-balloon time significantly.",
      signsSymptoms: "Classic presentation: substernal chest pain/pressure, radiation to left arm, jaw, back, or epigastrium, diaphoresis, nausea/vomiting, dyspnea, and anxiety. Atypical presentations (more common in women, elderly, diabetics): isolated dyspnea, epigastric pain, fatigue, syncope, or altered mental status without chest pain. 12-lead ECG shows ST elevation ≥1mm in contiguous leads (STEMI) or ST depression/T-wave inversion (NSTEMI).",
      assessment: "Rapid assessment: vital signs, 12-lead ECG within 10 minutes of patient contact, oxygen saturation, pain scale. Identify STEMI: ≥1mm ST elevation in ≥2 contiguous leads. Identify affected territory: anterior (V1-V4), lateral (I, aVL, V5-V6), inferior (II, III, aVF), posterior (ST depression V1-V3 with tall R waves). Right-sided ECG (V4R) for inferior MI to detect right ventricular involvement.",
      management: "MONA-B (modified): Morphine (if pain unrelieved by nitro), Oxygen (only if SpO2 <94%), Nitroglycerin 0.4mg SL every 5 min (max 3 doses, hold if SBP <90 or RV infarct), Aspirin 324mg chewed, Beta-blocker (per protocol). Activate STEMI alert for cath lab. Rapid transport to PCI-capable facility. Establish IV access, monitor continuously, prepare for cardiac arrest (VF is the most common cause of early MI death).",
      complications: "Complications include cardiogenic shock, ventricular fibrillation/VT, heart failure, papillary muscle rupture causing acute mitral regurgitation, ventricular septal defect, free wall rupture (tamponade), pericarditis, and left ventricular aneurysm. Right ventricular infarction can cause profound hypotension, especially with nitroglycerin administration.",
      pearls: [
        "ALWAYS obtain a 12-lead ECG within 10 minutes of patient contact for any patient with suspected ACS",
        "Inferior STEMI (II, III, aVF) should prompt a right-sided ECG (V4R) to rule out RV infarction — nitroglycerin is contraindicated in RV infarction",
        "Women, elderly, and diabetic patients often present atypically — maintain a high index of suspicion",
        "Aspirin is the single most important medication in AMI — give 324mg chewed immediately"
      ],
      pitfalls: [
        "Giving nitroglycerin to a patient with inferior MI and right ventricular involvement — this can cause severe hypotension",
        "Missing a STEMI because the ECG was not obtained early enough or was obtained improperly",
        "Attributing chest pain to non-cardiac causes without obtaining a 12-lead ECG",
        "Giving supplemental oxygen to normoxic patients — routine oxygen in MI is no longer recommended unless SpO2 <94%"
      ],
      faq: [
        { question: "What constitutes STEMI on a 12-lead ECG?", answer: "STEMI is defined as ≥1mm ST elevation in at least 2 anatomically contiguous leads. Exceptions: ≥2mm ST elevation in leads V1-V3 for men (≥1.5mm for men under 40), and ≥1.5mm in V2-V3 for women. New or presumably new left bundle branch block (LBBB) with clinical suspicion is also treated as STEMI equivalent." },
        { question: "Why is nitroglycerin contraindicated in right ventricular MI?", answer: "Nitroglycerin causes venodilation, reducing preload. The right ventricle in RV infarction is dependent on preload to maintain output. Reducing preload with nitroglycerin can cause severe, refractory hypotension. Instead, treat RV infarction with fluid boluses to maintain preload." },
        { question: "What is the door-to-balloon time goal?", answer: "The goal is ≤90 minutes from first medical contact to percutaneous coronary intervention (PCI) balloon inflation. Prehospital STEMI activation significantly reduces this time by allowing the cath lab to be set up before the patient arrives." }
      ],
      keywords: ["acute myocardial infarction paramedic", "STEMI recognition prehospital", "12-lead ECG interpretation", "heart attack treatment EMS", "AMI complications"],
      related: ["12-lead-ecg-interpretation", "ventricular-fibrillation", "cardiogenic-shock", "nitroglycerin", "acute-coronary-syndrome"]
    },

    {
      title: "12-Lead ECG Interpretation",
      category: "Cardiac Emergencies",
      overview: "12-lead electrocardiography is a diagnostic tool that records electrical activity of the heart from 12 different perspectives. It is essential for identifying acute coronary syndromes, dysrhythmias, conduction abnormalities, and other cardiac pathology in the prehospital setting.",
      mechanism: "The 12-lead ECG uses 10 electrodes to create 12 views of the heart's electrical activity. Six limb leads (I, II, III, aVR, aVL, aVF) view the heart in the frontal plane. Six precordial leads (V1-V6) view the heart in the horizontal plane. Each lead represents the voltage difference between two points and shows the electrical vector from a unique perspective.",
      clinicalRelevance: "12-lead ECG interpretation is a defining skill for paramedics. Prehospital STEMI identification and cath lab activation directly improves patient survival. The ability to systematically interpret ECGs distinguishes advanced from basic emergency care.",
      signsSymptoms: "The 12-lead ECG provides diagnostic information including: heart rate and rhythm, axis deviation, conduction delays (bundle branch blocks), chamber enlargement, ST-segment changes (elevation or depression indicating ischemia/infarction), T-wave abnormalities, Q waves indicating old infarction, and QT interval prolongation.",
      assessment: "Systematic interpretation approach: Rate → Rhythm → Axis → Intervals (PR, QRS, QT) → P-wave morphology → QRS morphology → ST segment → T waves → Overall impression. Correlate ECG findings with clinical presentation. Compare to prior ECGs if available.",
      management: "Based on ECG findings: STEMI → activate cath lab, treat with ACS protocol. Unstable dysrhythmia → appropriate ACLS algorithm. Conduction abnormality → assess hemodynamic stability, prepare for pacing. Normal or non-diagnostic ECG with ongoing symptoms → serial ECGs every 10-15 minutes, treat symptoms.",
      complications: "ECG interpretation errors include lead misplacement causing pseudo-findings, artifact mimicking dysrhythmias, failure to recognize STEMI equivalents (posterior MI, de Winter T waves, Wellens syndrome), and over-reading benign findings (early repolarization vs STEMI). False STEMI activations have clinical and system-wide consequences.",
      pearls: [
        "Lead placement is critical — misplaced leads create artifact that mimics pathology (V1-V2 too high mimics anterior STEMI)",
        "Reciprocal changes support a STEMI diagnosis — ST elevation in one territory with ST depression in the opposite territory",
        "Left bundle branch block (LBBB) masks ST changes — use Sgarbossa criteria to identify MI in the setting of LBBB",
        "Always correlate the ECG with the clinical picture — treat the patient, not just the monitor"
      ],
      pitfalls: [
        "Not obtaining a 12-lead ECG on every chest pain patient — many STEMIs are missed because an ECG was never done",
        "Misidentifying benign early repolarization as STEMI — early repolarization has concave-up ST elevation, often with a 'fishhook' J-point",
        "Forgetting to check reciprocal changes — isolated ST elevation without reciprocal depression may not be STEMI",
        "Missing posterior MI — ST depression in V1-V3 with tall R waves suggests posterior infarction; obtain posterior leads V7-V9"
      ],
      faq: [
        { question: "What is the systematic approach to ECG interpretation?", answer: "Rate → Rhythm (regular vs irregular, P waves present?) → Axis (normal, left, right) → Intervals (PR 0.12-0.20s, QRS <0.12s, QTc <0.44s) → P-wave morphology → QRS morphology (bundle branch blocks?) → ST segment (elevation or depression?) → T waves (inversion?) → Overall clinical correlation." },
        { question: "How do you identify which coronary artery is occluded?", answer: "Anterior STEMI (V1-V4) = LAD occlusion. Inferior STEMI (II, III, aVF) = RCA occlusion (80%) or LCx (20%). Lateral STEMI (I, aVL, V5-V6) = LCx occlusion. Posterior MI (reciprocal in V1-V3) = RCA or LCx." },
        { question: "What are STEMI equivalents?", answer: "STEMI equivalents are ECG patterns that indicate acute coronary occlusion but do not meet standard STEMI criteria: de Winter T waves (upsloping ST depression with tall T waves in precordial leads), Wellens syndrome (deep T-wave inversions in V2-V3 indicating critical LAD stenosis), new LBBB, and posterior MI patterns." }
      ],
      keywords: ["12-lead ECG interpretation paramedic", "STEMI identification prehospital", "ECG lead placement", "cardiac rhythm interpretation", "ECG systematic approach"],
      related: ["acute-myocardial-infarction", "cardiac-dysrhythmias", "bundle-branch-blocks", "acute-coronary-syndrome"]
    },

    {
      title: "Acute Coronary Syndrome",
      category: "Cardiac Emergencies",
      overview: "Acute coronary syndrome (ACS) encompasses a spectrum of conditions caused by acute myocardial ischemia, including unstable angina (UA), non-ST elevation myocardial infarction (NSTEMI), and ST elevation myocardial infarction (STEMI). ACS represents a continuum from ischemia without necrosis to transmural infarction.",
      mechanism: "ACS is primarily caused by disruption of an atherosclerotic plaque in a coronary artery, leading to platelet aggregation and thrombus formation. The degree and duration of coronary occlusion determine the clinical presentation: partial/transient occlusion causes UA or NSTEMI, while complete/prolonged occlusion causes STEMI. Demand ischemia (type 2 MI) occurs when oxygen demand exceeds supply without plaque rupture.",
      clinicalRelevance: "ACS is among the most common life-threatening conditions encountered by paramedics. Rapid identification, appropriate treatment, and expedited transport to appropriate facilities are the cornerstones of prehospital ACS management.",
      signsSymptoms: "Chest pain/pressure (may radiate to arms, jaw, back, epigastrium), diaphoresis, nausea/vomiting, dyspnea, anxiety. Risk factors: age >45 (men)/>55 (women), hypertension, diabetes, hyperlipidemia, smoking, family history, obesity. ECG findings vary: STEMI shows ST elevation, NSTEMI shows ST depression or T-wave inversions, UA may have normal or nonspecific ECG changes.",
      assessment: "Focused history (OPQRST for chest pain, risk factors, medication list including ED medications and anticoagulants). 12-lead ECG within 10 minutes. Serial ECGs if initial is non-diagnostic. Vital signs including SpO2. Assess for complications: heart failure (crackles, JVD), cardiogenic shock (hypotension, tachycardia), dysrhythmias.",
      management: "Aspirin 324mg chewed (most important medication). Nitroglycerin 0.4mg SL q5min x3 (if SBP >90, no RV infarct, no PDE5 inhibitor use). Morphine for pain unrelieved by nitro (use cautiously). Oxygen only if SpO2 <94%. Heparin per protocol. 12-lead ECG transmission and STEMI activation if indicated. Transport to PCI-capable facility for STEMI, closest appropriate facility for NSTEMI/UA.",
      complications: "Dysrhythmias (VF, VT, bradycardia, heart blocks), cardiogenic shock, acute heart failure, mechanical complications (papillary muscle rupture, VSD, free wall rupture), pericarditis, recurrent ischemia, and sudden cardiac death.",
      pearls: [
        "Aspirin saves lives — it reduces mortality by 23% when given early in ACS and should never be withheld unless there is a true allergy",
        "Serial 12-lead ECGs are critical — a single normal ECG does not rule out ACS; changes may evolve over minutes to hours",
        "Women, elderly, and diabetic patients are more likely to present atypically — maintain high suspicion",
        "PDE5 inhibitor use (sildenafil, tadalafil) within 24-48 hours contraindicates nitroglycerin"
      ],
      pitfalls: [
        "Ruling out ACS based on a single normal ECG — serial ECGs may reveal evolving changes",
        "Attributing chest pain to non-cardiac causes without proper workup in patients with risk factors",
        "Giving nitroglycerin before aspirin — aspirin has higher priority and should be given first",
        "Withholding aspirin because the patient has 'already taken one' — prehospital dose should still be given unless contraindicated"
      ],
      faq: [
        { question: "What is the difference between UA, NSTEMI, and STEMI?", answer: "UA: ischemia without myocardial necrosis (negative troponin, non-diagnostic ECG). NSTEMI: ischemia with myocardial necrosis (positive troponin, ST depression or T-wave inversion). STEMI: transmural ischemia/infarction (positive troponin, ST elevation ≥1mm in ≥2 contiguous leads). All are ACS and require urgent treatment." },
        { question: "Why is aspirin the most important medication in ACS?", answer: "Aspirin irreversibly inhibits cyclooxygenase in platelets, preventing thromboxane A2 production and platelet aggregation. This limits thrombus growth at the site of plaque rupture. Given early, aspirin reduces mortality by approximately 23% and is the single highest-impact medication in ACS management." },
        { question: "When should a patient with ACS go to a PCI-capable facility?", answer: "All STEMI patients should be transported to a PCI-capable facility for primary percutaneous coronary intervention (PCI), even if it means bypassing a closer hospital. For NSTEMI/UA, transport to the closest appropriate facility with cardiac capabilities." }
      ],
      keywords: ["acute coronary syndrome paramedic", "ACS treatment prehospital", "STEMI vs NSTEMI", "chest pain assessment EMS", "aspirin ACS protocol"],
      related: ["acute-myocardial-infarction", "12-lead-ecg-interpretation", "nitroglycerin", "cardiogenic-shock"]
    },

    {
      title: "Cardiac Dysrhythmias",
      category: "Cardiac Emergencies",
      overview: "Cardiac dysrhythmias are abnormalities in the heart's electrical conduction system that alter the rate, rhythm, or conduction pattern. They range from benign (sinus arrhythmia) to immediately life-threatening (ventricular fibrillation). Paramedics must rapidly identify dysrhythmias and determine their hemodynamic significance.",
      mechanism: "Dysrhythmias arise from three main mechanisms: enhanced automaticity (abnormal pacemaker cells firing), triggered activity (afterdepolarizations causing extra beats), and reentry (circular conduction pathways sustaining abnormal rhythms). These mechanisms can be caused by ischemia, electrolyte imbalances, drug effects, structural heart disease, and autonomic influences.",
      clinicalRelevance: "Dysrhythmia recognition and management is a core paramedic competency tested extensively on certification exams. The ability to rapidly identify a dysrhythmia, assess hemodynamic stability, and initiate appropriate treatment (electrical or pharmacological) is fundamental to ALS practice.",
      signsSymptoms: "Presentation varies: palpitations, chest pain, dyspnea, dizziness, syncope, altered mental status, or sudden cardiac arrest. Hemodynamically stable dysrhythmias may be asymptomatic. Hemodynamically unstable dysrhythmias cause hypotension, altered consciousness, chest pain, or acute heart failure. Assess pulse quality, blood pressure, mental status, and signs of poor perfusion.",
      assessment: "Rhythm strip analysis: Rate (bradycardia <60, normal 60-100, tachycardia >100). Rhythm regularity. P waves present and morphology. PR interval. QRS width (narrow <0.12s vs wide ≥0.12s). P-QRS relationship. Assess hemodynamic stability: blood pressure, mental status, chest pain, signs of shock.",
      management: "Stable tachycardia: narrow regular → vagal maneuvers → adenosine. Narrow irregular → rate control (diltiazem, beta-blocker). Wide regular → amiodarone or adenosine if SVT with aberrancy suspected. Wide irregular → amiodarone (avoid if WPW suspected). Unstable tachycardia: synchronized cardioversion. Bradycardia: atropine 0.5mg IV (max 3mg) → transcutaneous pacing → dopamine or epinephrine infusion.",
      complications: "Untreated dysrhythmias can progress to cardiac arrest, cause stroke (atrial fibrillation with clot formation), precipitate heart failure, cause syncope with injury, and lead to cardiomyopathy with chronic tachycardia. Treatment complications include pro-arrhythmic drug effects and post-cardioversion dysrhythmias.",
      pearls: [
        "Always assess hemodynamic stability FIRST — the treatment algorithm depends on whether the patient is stable or unstable",
        "Narrow QRS tachycardia is almost always supraventricular — wide QRS tachycardia should be treated as ventricular until proven otherwise",
        "Atropine is ineffective for infranodal blocks (Mobitz II, third-degree with wide QRS) — these require pacing",
        "Always identify and treat the underlying cause — dysrhythmias are often symptoms of another condition (ischemia, hypoxia, electrolyte imbalance)"
      ],
      pitfalls: [
        "Treating the monitor instead of the patient — always assess the patient's clinical status before treating a rhythm",
        "Using atropine for third-degree heart block with wide QRS — it will not work; prepare for pacing",
        "Giving adenosine for wide-complex tachycardia without considering VT — adenosine can destabilize VT",
        "Not recognizing signs of hemodynamic instability — altered mental status, hypotension, and chest pain all indicate instability"
      ],
      faq: [
        { question: "How do you distinguish SVT from VT?", answer: "SVT typically has narrow QRS (<0.12s), may respond to vagal maneuvers, and often occurs in younger patients without cardiac history. VT has wide QRS (≥0.12s), AV dissociation, fusion/capture beats, and typically occurs in patients with cardiac disease. When in doubt, treat as VT — it is safer to treat SVT as VT than vice versa." },
        { question: "When is synchronized cardioversion indicated?", answer: "Synchronized cardioversion is indicated for hemodynamically unstable tachyarrhythmias: unstable SVT, unstable atrial fibrillation/flutter, unstable VT with a pulse. The sync mode delivers the shock on the R wave to avoid the T wave vulnerable period and prevent inducing VF." },
        { question: "What is the atropine dose for symptomatic bradycardia?", answer: "Atropine 0.5mg IV push, may repeat every 3-5 minutes to a maximum total dose of 3mg. Atropine works by blocking vagal (parasympathetic) influence on the SA and AV nodes. It is effective for sinus bradycardia and AV nodal blocks but ineffective for infranodal blocks." }
      ],
      keywords: ["cardiac dysrhythmia identification", "tachycardia algorithm paramedic", "bradycardia treatment EMS", "SVT vs VT", "ACLS rhythms"],
      related: ["cardiac-arrest-management", "ventricular-fibrillation", "atrial-fibrillation", "heart-blocks", "synchronized-cardioversion"]
    },

    {
      title: "Atrial Fibrillation",
      category: "Cardiac Emergencies",
      overview: "Atrial fibrillation (AFib) is the most common sustained cardiac dysrhythmia, characterized by chaotic, disorganized electrical activity in the atria resulting in an irregularly irregular ventricular response. It affects approximately 2-3% of the population and is a leading cause of stroke.",
      mechanism: "AFib is caused by multiple reentrant wavelets or rapidly firing ectopic foci in the atrial tissue, often originating from the pulmonary veins. The AV node receives continuous, irregular impulses and conducts them variably, producing an irregularly irregular ventricular rate. Loss of organized atrial contraction reduces cardiac output by 15-25% and promotes blood stasis, increasing thrombus formation risk.",
      clinicalRelevance: "AFib is frequently encountered in prehospital care. Paramedics must distinguish new-onset AFib from chronic AFib, assess hemodynamic stability, and manage appropriately. Understanding the stroke risk and anticoagulation implications is important for patient counseling and hospital selection.",
      signsSymptoms: "Palpitations, irregular pulse, dyspnea, fatigue, dizziness, chest pain, exercise intolerance. May be asymptomatic (detected incidentally). ECG shows absence of discrete P waves (fibrillatory baseline), irregularly irregular R-R intervals, and typically narrow QRS complexes. Rapid ventricular response (RVR) = rate >100 bpm.",
      assessment: "12-lead ECG confirming irregularly irregular rhythm without P waves. Assess hemodynamic stability: blood pressure, heart rate, symptoms. Determine chronicity: new onset (<48 hours) vs chronic. Identify precipitating factors: infection, thyroid disease, alcohol, surgery, PE, heart failure.",
      management: "Hemodynamically stable: rate control with diltiazem (0.25 mg/kg IV over 2 min) or metoprolol. Target rate <110 bpm. Hemodynamically unstable: synchronized cardioversion starting at 120-200J biphasic. Note: cardioversion of AFib >48 hours carries stroke risk — anticoagulation should be considered. Treat underlying causes.",
      complications: "Stroke (5x increased risk), heart failure from prolonged tachycardia (tachycardia-mediated cardiomyopathy), hemodynamic instability, and thromboembolism. AFib with WPW (pre-excitation) can degenerate to VF — avoid AV nodal blocking agents (adenosine, diltiazem, digoxin) in this scenario.",
      pearls: [
        "The hallmark of AFib is an irregularly irregular rhythm — if the rhythm is irregularly irregular, think AFib until proven otherwise",
        "AFib with RVR in a hemodynamically stable patient is managed with rate control, not cardioversion",
        "Never give AV nodal blockers for AFib with WPW — this can cause VF; use procainamide or cardioversion instead",
        "New-onset AFib may be a sign of underlying illness: sepsis, PE, thyroid storm, or acute heart failure"
      ],
      pitfalls: [
        "Treating all rapid AFib with cardioversion — stable AFib with RVR should receive rate control medications",
        "Giving diltiazem or adenosine to AFib with WPW (pre-excitation) — this blocks the AV node and forces conduction down the accessory pathway, potentially causing VF",
        "Missing AFib because the rhythm appears 'mostly regular' at high rates — always check for irregularity carefully",
        "Not considering AFib as a secondary finding — treating the AFib without addressing the underlying cause"
      ],
      faq: [
        { question: "How do you identify AFib on an ECG?", answer: "Three key features: 1) Absence of discrete P waves (replaced by fibrillatory baseline), 2) Irregularly irregular R-R intervals, 3) Usually narrow QRS complexes (unless pre-existing bundle branch block or WPW). The rhythm is characteristically chaotic in its irregularity." },
        { question: "What is AFib with RVR?", answer: "AFib with rapid ventricular response (RVR) means the ventricular rate exceeds 100 bpm. The AV node is conducting too many of the chaotic atrial impulses. Treatment focuses on rate control with calcium channel blockers (diltiazem) or beta-blockers (metoprolol) to slow AV nodal conduction." },
        { question: "Why is AFib associated with stroke risk?", answer: "Loss of organized atrial contraction causes blood to stagnate in the atria, particularly the left atrial appendage. Stagnant blood promotes clot formation. These clots can embolize to the brain, causing ischemic stroke. AFib increases stroke risk 5-fold and accounts for 15-20% of all ischemic strokes." }
      ],
      keywords: ["atrial fibrillation paramedic", "AFib treatment prehospital", "irregularly irregular rhythm", "AFib with RVR", "atrial fibrillation stroke risk"],
      related: ["cardiac-dysrhythmias", "synchronized-cardioversion", "heart-failure", "stroke"]
    },

    {
      title: "Heart Blocks",
      category: "Cardiac Emergencies",
      overview: "Heart blocks are conduction disturbances in which electrical impulses are delayed or blocked as they travel through the cardiac conduction system. They are classified by degree: first-degree (delayed), second-degree type I (Wenckebach), second-degree type II (Mobitz II), and third-degree (complete). Clinical significance ranges from benign to immediately life-threatening.",
      mechanism: "First-degree block: delayed conduction through the AV node (prolonged PR interval >0.20s). Second-degree Type I (Wenckebach): progressive lengthening of PR interval until a QRS is dropped, then the cycle repeats — occurs at the AV node. Second-degree Type II (Mobitz II): intermittent dropped QRS without progressive PR prolongation — occurs below the AV node (His bundle/Purkinje). Third-degree (complete): no atrial impulses reach the ventricles; atria and ventricles beat independently.",
      clinicalRelevance: "Heart block identification and management is heavily tested on paramedic certification exams. The key clinical distinction is between blocks that respond to atropine (AV nodal blocks: first-degree, Type I) and those that require pacing (infranodal blocks: Type II, third-degree with wide QRS).",
      signsSymptoms: "First-degree: usually asymptomatic. Type I (Wenckebach): often asymptomatic, may cause dizziness. Type II (Mobitz II): syncope, near-syncope, fatigue, dyspnea — high risk of progressing to complete block. Third-degree: severe bradycardia, syncope (Stokes-Adams attacks), hypotension, altered mental status, heart failure. The escape rhythm rate and width determine symptoms.",
      assessment: "ECG analysis: First-degree = prolonged PR (>0.20s), all P waves conducted. Type I = progressive PR prolongation until dropped QRS, grouped beating pattern. Type II = constant PR interval with intermittently dropped QRS, may have wide QRS. Third-degree = P waves and QRS complexes march independently (AV dissociation), no relationship between P and QRS.",
      management: "First-degree: no treatment, monitor. Type I: usually no treatment unless symptomatic — atropine if needed. Type II: prepare for transcutaneous pacing — atropine may paradoxically worsen (increases atrial rate while blocked site does not respond). Third-degree: transcutaneous pacing is first-line; dopamine or epinephrine infusion if pacing unavailable; atropine may work if escape rhythm is junctional (narrow QRS) but not if ventricular (wide QRS).",
      complications: "Type II and third-degree blocks can progress to cardiac arrest (asystole if escape rhythm fails). Transcutaneous pacing complications include pain, failure to capture, loss of capture during transport, and skin burns. Permanent pacemaker is typically required for Type II and third-degree blocks.",
      pearls: [
        "Type I (Wenckebach) has a progressively lengthening PR — 'longer, longer, longer, drop, then you have a Wenckebach'",
        "Type II (Mobitz II) has a constant PR interval with sudden dropped beats — this is more dangerous and requires pacing",
        "In third-degree block, look for AV dissociation — P waves and QRS complexes are completely independent",
        "Atropine works on the AV node — it is effective for nodal blocks but NOT for infranodal blocks (Type II, complete with wide QRS)"
      ],
      pitfalls: [
        "Confusing Type I with Type II — the progressive PR lengthening in Type I is the key distinguishing feature",
        "Giving atropine for Type II block — it increases the atrial rate, potentially worsening the block and dropping more QRS complexes",
        "Not preparing transcutaneous pacing early for Type II or third-degree block — these can deteriorate rapidly to asystole",
        "Missing third-degree block because of a reasonable ventricular rate — the escape rhythm may initially maintain an adequate rate"
      ],
      faq: [
        { question: "How do you differentiate Type I from Type II second-degree block?", answer: "Type I (Wenckebach): progressive PR prolongation until a QRS is dropped, grouped beating, usually narrow QRS, occurs at AV node. Type II (Mobitz II): constant PR interval with intermittently dropped QRS, often wide QRS, occurs below AV node. Type I is generally benign; Type II is dangerous and often requires pacing." },
        { question: "Why is atropine contraindicated in Type II block?", answer: "Atropine increases the sinus rate by blocking vagal tone at the AV node. In Type II block, the pathology is below the AV node. Increasing the atrial rate without improving infranodal conduction can worsen the block by presenting more impulses to the diseased conduction tissue, paradoxically decreasing the ventricular rate." },
        { question: "When is transcutaneous pacing indicated?", answer: "Transcutaneous pacing is indicated for symptomatic bradycardia unresponsive to atropine, Mobitz Type II second-degree block, third-degree (complete) heart block, and as a bridge to transvenous pacing. Set rate 60-80 bpm, increase milliamps until electrical capture (pacing spike followed by wide QRS), then add 10% as safety margin." }
      ],
      keywords: ["heart blocks paramedic", "first second third degree heart block", "Wenckebach vs Mobitz II", "transcutaneous pacing", "AV block ECG"],
      related: ["cardiac-dysrhythmias", "transcutaneous-pacing", "bradycardia-management", "cardiac-arrest-management"]
    },

    {
      title: "Defibrillation",
      category: "Cardiac Emergencies",
      overview: "Defibrillation is the delivery of an electrical shock to the heart to terminate ventricular fibrillation (VF) or pulseless ventricular tachycardia (pVT). It is the single most important intervention for shockable cardiac arrest rhythms and the definitive treatment for VF/pVT.",
      mechanism: "Defibrillation delivers a massive, brief electrical current through the myocardium, simultaneously depolarizing all excitable myocardial cells. This momentarily stops all electrical activity, allowing the heart's natural pacemaker (SA node) to resume organized conduction. The success of defibrillation depends on current density reaching the myocardium, which is affected by energy level, impedance, and pad placement.",
      clinicalRelevance: "Early defibrillation is the most important determinant of survival from VF cardiac arrest. For every minute delay in defibrillation, survival decreases by approximately 7-10%. Paramedics must be proficient in rapid rhythm recognition and defibrillation.",
      signsSymptoms: "Defibrillation is indicated for two rhythms: ventricular fibrillation (chaotic, irregular electrical activity without identifiable waves) and pulseless ventricular tachycardia (organized, wide-complex rhythm at a rate >150 bpm without a pulse). Both present as cardiac arrest.",
      assessment: "Confirm cardiac arrest (unresponsive, no breathing, no pulse). Attach defibrillator pads. Analyze rhythm. Identify VF or pVT. Ensure CPR is in progress while preparing to defibrillate.",
      management: "Pad placement: anterior-lateral (right sternal border below clavicle, left mid-axillary at V5-V6 level) or anterior-posterior. Energy: 200J biphasic initial (manufacturer-specific), or 360J monophasic. Procedure: charge while CPR continues, clear the patient, deliver shock, immediately resume CPR for 2 minutes, then recheck rhythm. Ensure good pad contact, minimal body hair, dry skin.",
      complications: "Skin burns from poor pad contact or repeated shocks, bystander shock from contact with patient, failure to defibrillate due to high impedance (obesity, air-filled lungs, poor pad contact), post-shock asystole or PEA, and awareness of shock in patients who still have consciousness (rare, inappropriate shock).",
      pearls: [
        "Defibrillation is the ONLY treatment that terminates VF — medications and CPR support defibrillation but do not replace it",
        "Charge the defibrillator while CPR is in progress — this minimizes the pre-shock pause",
        "Anterior-posterior pad placement may be more effective for large patients and refractory VF",
        "The pre-shock pause (time between last compression and shock delivery) should be <10 seconds — longer pauses decrease shock success"
      ],
      pitfalls: [
        "Stopping CPR to charge the defibrillator — charge during CPR and minimize pre-shock pause",
        "Not ensuring good pad contact — hair, sweat, and air gaps increase impedance and reduce defibrillation success",
        "Using defibrillation (unsynchronized) for a perfusing rhythm — synchronized cardioversion is used for unstable tachycardias with a pulse",
        "Delivering a shock without confirming the rhythm — artifact or movement can mimic VF"
      ],
      faq: [
        { question: "What is the difference between defibrillation and cardioversion?", answer: "Defibrillation delivers an unsynchronized shock at any point in the cardiac cycle — used for pulseless VF/pVT. Cardioversion delivers a synchronized shock timed to the R wave — used for unstable tachycardias with a pulse. Cardioversion avoids shocking during the vulnerable T-wave period, which could induce VF." },
        { question: "What energy level is used for defibrillation?", answer: "Biphasic defibrillators: 200J initial (or manufacturer's recommended dose), same or escalating for subsequent shocks. Monophasic: 360J for all shocks. Biphasic defibrillators are more effective at lower energy levels and cause less myocardial damage." },
        { question: "Why should CPR continue during defibrillator charging?", answer: "Every second without compressions allows coronary perfusion pressure to drop. By continuing CPR during charging and minimizing the pre-shock pause, coronary perfusion is maintained closer to the shock delivery, increasing the likelihood of successful defibrillation and ROSC." }
      ],
      keywords: ["defibrillation technique paramedic", "VF defibrillation energy", "defibrillator pad placement", "early defibrillation survival", "biphasic vs monophasic"],
      related: ["ventricular-fibrillation", "cardiac-arrest-management", "synchronized-cardioversion", "automated-external-defibrillator"]
    },

    {
      title: "Synchronized Cardioversion",
      category: "Cardiac Emergencies",
      overview: "Synchronized cardioversion is the delivery of an electrical shock timed to the R wave of the QRS complex to terminate unstable tachyarrhythmias while the patient still has a pulse. Synchronization avoids shocking during the vulnerable T-wave period, which could trigger ventricular fibrillation.",
      mechanism: "The defibrillator detects R waves and delivers the shock at the peak of the R wave, when the myocardium is in an absolute refractory period. This ensures depolarization occurs during a safe part of the cardiac cycle. The synchronized shock terminates the reentrant circuit or abnormal focus causing the tachycardia, allowing the SA node to resume control.",
      clinicalRelevance: "Synchronized cardioversion is indicated for hemodynamically unstable tachycardias — a key ACLS algorithm that paramedics must master. The decision to cardiovert requires accurate rhythm identification and assessment of hemodynamic stability.",
      signsSymptoms: "Cardioversion is indicated for unstable tachycardia with signs of hemodynamic compromise: hypotension (SBP <90), altered mental status, severe chest pain, acute heart failure, or signs of poor end-organ perfusion. The rhythm must be an organized tachycardia (SVT, atrial fibrillation, atrial flutter, or VT with a pulse).",
      assessment: "Confirm hemodynamic instability (hypotension, AMS, chest pain, acute HF). Identify the rhythm. Determine if the patient requires cardioversion vs medication trial. Prepare sedation if the patient is conscious (etomidate 0.1-0.2 mg/kg, midazolam 2-5mg, or ketamine).",
      management: "Ensure sync mode is activated (sync marker appears on R waves). Select energy: SVT/atrial flutter 50-100J → atrial fibrillation 120-200J → VT with pulse 100J. Sedate the conscious patient. Charge, clear, deliver shock. If unsuccessful, increase energy and repeat. If rhythm degenerates to VF, immediately switch to defibrillation mode (unsynchronized).",
      complications: "Skin burns, VF induction if sync fails, post-cardioversion bradycardia, thromboembolism if AFib >48 hours is cardioverted, aspiration during sedation, and the rare occurrence of the defibrillator not firing in sync mode (will not discharge if it cannot identify R waves — switch to unsync if needed for unstable patient).",
      pearls: [
        "Always confirm sync mode is on — look for sync markers on the R waves before delivering the shock",
        "Many defibrillators reset to unsynchronized mode after each shock — you must re-engage sync for subsequent cardioversion attempts",
        "If the defibrillator will not fire in sync mode (cannot identify R waves), switch to unsync for an unstable/deteriorating patient",
        "Sedate the conscious patient before cardioversion whenever possible — cardioversion is painful"
      ],
      pitfalls: [
        "Forgetting to engage sync mode — unsynchronized shock to a perfusing rhythm can induce VF",
        "Not re-engaging sync mode between shocks — most defibrillators default to defibrillation mode after each shock",
        "Using cardioversion for pulseless VT — pulseless rhythms require defibrillation (unsynchronized)",
        "Delaying cardioversion in an unstable patient to obtain IV access for sedation — cardiovert first if the patient is critically unstable"
      ],
      faq: [
        { question: "What energy levels are used for synchronized cardioversion?", answer: "SVT/atrial flutter: 50-100J biphasic. Atrial fibrillation: 120-200J biphasic. Ventricular tachycardia with pulse: 100J biphasic. If initial shock fails, escalate energy. Monophasic devices generally start higher." },
        { question: "Why is sync mode important?", answer: "Sync mode times the shock to the R wave, avoiding the vulnerable period of the T wave. Shocking during the T wave can trigger ventricular fibrillation. In an organized rhythm with a pulse, this protection is critical." },
        { question: "What sedation is used before cardioversion?", answer: "Common prehospital options include etomidate (0.1-0.2 mg/kg IV, rapid onset), midazolam (2-5mg IV/IM), and ketamine (1 mg/kg IV). The choice depends on local protocols and patient hemodynamics. If the patient is critically unstable and deteriorating, cardioversion should not be delayed for sedation." }
      ],
      keywords: ["synchronized cardioversion technique", "cardioversion energy levels", "unstable tachycardia treatment", "sync mode defibrillator", "ACLS cardioversion"],
      related: ["cardiac-dysrhythmias", "defibrillation", "atrial-fibrillation", "ventricular-tachycardia"]
    },

    {
      title: "Cardiogenic Shock",
      category: "Cardiac Emergencies",
      overview: "Cardiogenic shock is a state of critical end-organ hypoperfusion caused by the heart's inability to generate adequate cardiac output. It is most commonly caused by massive acute myocardial infarction but can result from any condition that severely impairs cardiac pump function. Mortality rates exceed 40% even with optimal treatment.",
      mechanism: "Cardiogenic shock occurs when a critical mass of myocardium (typically >40% of the left ventricle) is damaged or dysfunctional, reducing stroke volume and cardiac output. This triggers a compensatory cascade: increased SVR (vasoconstriction), increased heart rate, and fluid retention. However, these compensatory mechanisms increase myocardial oxygen demand while decreasing coronary perfusion, creating a vicious cycle of worsening ischemia and pump failure.",
      clinicalRelevance: "Cardiogenic shock is the leading cause of death in hospitalized AMI patients. Prehospital recognition and appropriate management — including judicious fluid management, vasopressor support, and rapid transport to a facility with cardiac catheterization capabilities — can improve outcomes.",
      signsSymptoms: "Hypotension (SBP <90 mmHg) unresponsive to fluids, tachycardia, tachypnea, cool/mottled/cyanotic skin, altered mental status, oliguria, pulmonary edema (crackles, JVD, pink frothy sputum), diaphoresis. Classic triad: hypotension + evidence of end-organ hypoperfusion + evidence of elevated cardiac filling pressures (pulmonary congestion).",
      assessment: "Identify hypotension with signs of poor perfusion AND elevated filling pressures. 12-lead ECG (often shows STEMI or extensive ischemia). Assess for JVD, crackles, peripheral edema. Differentiate from hypovolemic shock (warm vs cold, JVD vs flat neck veins, crackles vs clear lungs).",
      management: "Primary goal: improve cardiac output and end-organ perfusion. Vasopressors: norepinephrine 0.1-0.5 mcg/kg/min (first-line) or dopamine 5-20 mcg/kg/min. AVOID large fluid boluses (worsens pulmonary edema). CPAP for pulmonary edema. Treat underlying cause: STEMI → emergent PCI. Inotropes: dobutamine if SBP allows. Mechanical circulatory support at receiving facility.",
      complications: "Multi-organ failure (renal failure, liver failure, coagulopathy), ARDS, worsening pulmonary edema, cardiac arrest, metabolic acidosis, and death. Vasopressor use can worsen myocardial ischemia by increasing afterload and myocardial oxygen demand.",
      pearls: [
        "Cardiogenic shock from AMI requires emergent revascularization — transport to PCI-capable facility without delay",
        "Fluids can worsen cardiogenic shock — unlike other forms of shock, volume loading increases pulmonary congestion",
        "Norepinephrine is now preferred over dopamine for cardiogenic shock — dopamine is associated with more arrhythmias",
        "CPAP can help with pulmonary edema component even in cardiogenic shock, as long as the patient is not too hypotensive"
      ],
      pitfalls: [
        "Giving large fluid boluses to hypotensive patients before recognizing cardiogenic shock — look for JVD and crackles first",
        "Attributing hypotension to hypovolemia when pulmonary congestion is present — this is cardiogenic, not hypovolemic shock",
        "Using dopamine as first-line vasopressor — norepinephrine is superior with fewer arrhythmias",
        "Delaying transport to a PCI-capable facility — the underlying coronary occlusion must be treated"
      ],
      faq: [
        { question: "How is cardiogenic shock different from other types of shock?", answer: "Cardiogenic shock involves pump failure with elevated filling pressures (JVD, crackles) and decreased cardiac output (hypotension, poor perfusion). Hypovolemic shock has low filling pressures (flat neck veins, clear lungs). Distributive shock (septic) has warm skin initially with vasodilation. Obstructive shock has specific causes (PE, tamponade, tension pneumothorax)." },
        { question: "Why are fluids contraindicated in cardiogenic shock?", answer: "The failing left ventricle cannot effectively pump the blood it receives. Adding more volume increases left ventricular end-diastolic pressure, worsening pulmonary congestion and edema without improving cardiac output. Instead, use vasopressors and inotropes to improve pump function." },
        { question: "What is the role of vasopressors in cardiogenic shock?", answer: "Norepinephrine (first-line) increases blood pressure through vasoconstriction while providing some inotropic support. Dobutamine increases contractility and cardiac output but may worsen hypotension. Often, a combination of norepinephrine (for pressure) and dobutamine (for contractility) is used." }
      ],
      keywords: ["cardiogenic shock management", "cardiogenic shock signs symptoms", "cardiogenic vs hypovolemic shock", "norepinephrine cardiogenic shock", "pump failure treatment"],
      related: ["acute-myocardial-infarction", "heart-failure", "shock-assessment", "vasopressors"]
    },

    {
      title: "Congestive Heart Failure",
      category: "Cardiac Emergencies",
      overview: "Congestive heart failure (CHF) is a clinical syndrome in which the heart cannot pump sufficient blood to meet the body's metabolic demands or can only do so at elevated filling pressures. Acute decompensated heart failure (ADHF) is one of the most common reasons for EMS activation, often presenting as acute pulmonary edema.",
      mechanism: "Heart failure can involve systolic dysfunction (reduced ejection fraction, impaired contractility) or diastolic dysfunction (preserved ejection fraction, impaired relaxation/filling). Left-sided failure causes pulmonary congestion; right-sided failure causes systemic venous congestion (peripheral edema, JVD, hepatomegaly). Common causes include ischemic heart disease, hypertension, valvular disease, and cardiomyopathy.",
      clinicalRelevance: "CHF exacerbation is among the most common EMS calls. Prehospital management with CPAP and nitroglycerin can dramatically improve patient outcomes and reduce the need for intubation. Understanding the pathophysiology helps guide treatment decisions.",
      signsSymptoms: "Left-sided failure: dyspnea, orthopnea, paroxysmal nocturnal dyspnea, pink frothy sputum, crackles/rales, wheezing ('cardiac asthma'), tachycardia, S3 gallop. Right-sided failure: peripheral edema, JVD, hepatomegaly, weight gain, ascites. Both: fatigue, exercise intolerance, nocturia.",
      assessment: "History: onset and progression of symptoms, medication compliance, dietary indiscretion (salt intake), prior CHF diagnosis and hospitalizations. Physical exam: vital signs, auscultation (crackles, S3), JVD assessment, peripheral edema, respiratory effort assessment. SpO2, capnography, 12-lead ECG.",
      management: "Position upright (legs dangling reduces preload). CPAP 5-10 cmH2O (first-line for acute pulmonary edema). Nitroglycerin 0.4mg SL q5min (reduces preload and afterload — very effective). IV nitroglycerin infusion per protocol. Furosemide 40-80mg IV (if not already on high-dose diuretic). Oxygen to maintain SpO2 >94%. Morphine 2-4mg IV (used less frequently now due to respiratory depression risk). Monitor and prepare for deterioration.",
      complications: "Acute pulmonary edema progressing to respiratory failure, cardiogenic shock, flash pulmonary edema (severe sudden-onset), cardiac arrest, acute kidney injury, hepatic congestion, and medication-related hypotension.",
      pearls: [
        "CPAP + nitroglycerin is the most effective prehospital combination for acute CHF — it rapidly reduces preload, recruits alveoli, and improves oxygenation",
        "Sitting the patient upright with legs dangling is a simple intervention that immediately reduces preload",
        "Nitroglycerin is primarily a preload reducer at standard doses and becomes an afterload reducer at higher doses",
        "Many CHF patients present with wheezing ('cardiac asthma') — do not treat with bronchodilators alone; treat the underlying failure"
      ],
      pitfalls: [
        "Treating CHF-related wheezing as asthma — albuterol will not fix pulmonary edema; use CPAP and nitroglycerin",
        "Withholding nitroglycerin due to borderline blood pressure — nitroglycerin is very effective and can be given if SBP >90",
        "Giving excessive IV fluids to a CHF patient — this worsens fluid overload and pulmonary congestion",
        "Using morphine as first-line treatment — it causes respiratory depression and is now second-line to CPAP and nitro"
      ],
      faq: [
        { question: "How does CPAP help in acute CHF?", answer: "CPAP recruits collapsed alveoli, improving gas exchange. It increases intrathoracic pressure, reducing preload (venous return) and afterload (easier for the LV to eject against). It reduces the work of breathing. These effects directly address the pathophysiology of acute pulmonary edema." },
        { question: "What is the difference between left and right heart failure?", answer: "Left heart failure causes backward pressure into the pulmonary circulation: dyspnea, crackles, pulmonary edema. Right heart failure causes backward pressure into the systemic venous circulation: JVD, peripheral edema, hepatomegaly. Both often coexist, but treatment targets differ." },
        { question: "Why is sitting the patient upright important?", answer: "Upright positioning with legs dangling reduces venous return (preload) by pooling blood in the dependent lower extremities, decreasing pulmonary congestion. It also improves diaphragmatic excursion and makes breathing easier. This simple intervention can provide immediate symptomatic relief." }
      ],
      keywords: ["congestive heart failure paramedic", "acute pulmonary edema treatment", "CHF CPAP prehospital", "heart failure management EMS", "flash pulmonary edema"],
      related: ["continuous-positive-airway-pressure", "cardiogenic-shock", "nitroglycerin", "acute-myocardial-infarction"]
    },

    {
      title: "Pulseless Electrical Activity",
      category: "Cardiac Emergencies",
      overview: "Pulseless electrical activity (PEA) is a cardiac arrest rhythm characterized by organized electrical activity on the cardiac monitor but absence of a palpable pulse and effective cardiac output. PEA has a poor prognosis unless the underlying cause is rapidly identified and treated.",
      mechanism: "PEA occurs when the heart's electrical conduction system generates organized impulses, but the myocardium fails to respond with effective mechanical contraction (electromechanical dissociation), or when mechanical contraction occurs but is insufficient to generate a palpable pulse due to obstruction, volume depletion, or severe vasodilation. The key is that PEA always has an underlying cause that must be identified and treated.",
      clinicalRelevance: "PEA is increasingly the most common initial cardiac arrest rhythm encountered by EMS. Unlike VF/pVT, PEA is not treated with defibrillation. Survival depends entirely on identifying and treating the reversible cause. The H's and T's mnemonic is critical for systematic cause identification.",
      signsSymptoms: "Unresponsive patient with no palpable pulse, absent breathing or agonal respirations, but organized electrical activity on the cardiac monitor (can look like any organized rhythm: sinus, tachycardia, even with P waves and QRS complexes). The monitor looks organized but the patient is pulseless.",
      assessment: "Confirm pulselessness (≤10 seconds). Identify organized rhythm on monitor. Begin CPR immediately. Systematically evaluate H's and T's. Consider point-of-care ultrasound (if available) to identify tamponade, PE, hypovolemia, or cardiac standstill. Narrow complex PEA generally has better outcomes than wide complex PEA.",
      management: "CPR, epinephrine 1mg IV/IO every 3-5 minutes, and aggressive search for reversible causes. Treat identified causes: Hypovolemia → IV fluid bolus. Hypoxia → advanced airway, ventilation. Hydrogen ion → sodium bicarbonate. Hyper/Hypokalemia → calcium, insulin/glucose/albuterol. Hypothermia → warming. Tension pneumothorax → needle decompression. Tamponade → pericardiocentesis (hospital). Toxins → specific antidotes. Thrombosis → consider thrombolytics.",
      complications: "Without identification and treatment of the underlying cause, PEA will progress to asystole and death. Empiric treatment (treating all possible causes simultaneously) carries risks of volume overload, medication interactions, and procedure complications. False PEA (pseudo-PEA) occurs when weak cardiac output exists but is not palpable.",
      pearls: [
        "PEA always has a cause — your job is to find it. CPR and epinephrine alone will not fix PEA without treating the underlying cause",
        "Consider the clinical context: trauma + PEA = think hypovolemia, tension pneumothorax, tamponade. Medical + PEA = think MI, PE, metabolic",
        "Narrow complex PEA (narrow QRS, faster rate) has a better prognosis than wide complex PEA — it suggests the cause may be reversible",
        "Point-of-care ultrasound can rapidly identify tamponade, massive PE, and hypovolemia in PEA"
      ],
      pitfalls: [
        "Treating PEA the same as asystole — PEA requires aggressive cause investigation, not just CPR and epinephrine",
        "Not systematically going through the H's and T's — random treatment is less effective than systematic evaluation",
        "Shocking PEA because it 'looks organized' — PEA is a non-shockable rhythm",
        "Missing tension pneumothorax in a ventilated patient who develops PEA — consider needle decompression"
      ],
      faq: [
        { question: "What are the most common reversible causes of PEA?", answer: "The most common treatable causes are the H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia. And the T's: Tension pneumothorax, Tamponade, Toxins, Thrombosis (PE or MI). Hypovolemia and hypoxia are the most common overall." },
        { question: "Why can't you defibrillate PEA?", answer: "Defibrillation works by simultaneously depolarizing all cardiac cells, stopping chaotic electrical activity (VF/pVT) so the SA node can resume organized rhythm. In PEA, the electrical activity is already organized — the problem is mechanical, not electrical. Defibrillation would be ineffective and inappropriate." },
        { question: "What is pseudo-PEA?", answer: "Pseudo-PEA (false PEA) occurs when the heart has some organized mechanical activity generating weak cardiac output that is not detectable by pulse palpation but may be seen on ultrasound or arterial line. These patients may benefit from aggressive resuscitation as they are closer to ROSC than true PEA." }
      ],
      keywords: ["pulseless electrical activity treatment", "PEA cardiac arrest causes", "H's and T's cardiac arrest", "non-shockable rhythm management", "PEA vs asystole"],
      related: ["cardiac-arrest-management", "asystole", "tension-pneumothorax", "cardiac-tamponade", "hypovolemic-shock"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Trauma (20 topics)
    // ═══════════════════════════════════════════

    {
      title: "Hemorrhagic Shock",
      category: "Trauma",
      overview: "Hemorrhagic shock is a life-threatening condition caused by acute blood loss exceeding the body's ability to compensate, resulting in inadequate tissue perfusion and cellular hypoxia. It is the leading preventable cause of death in trauma patients. Classification uses the ATLS system: Class I (<15% blood volume loss), Class II (15-30%), Class III (30-40%), and Class IV (>40%).",
      mechanism: "Acute blood loss reduces circulating blood volume, decreasing venous return (preload) and cardiac output. The body initially compensates through catecholamine release (tachycardia, vasoconstriction), activation of the renin-angiotensin-aldosterone system, and ADH secretion. When compensatory mechanisms are overwhelmed, blood pressure drops (decompensated shock), leading to inadequate organ perfusion, anaerobic metabolism, lactic acidosis, and multi-organ failure.",
      clinicalRelevance: "Hemorrhagic shock management is a core trauma paramedic competency. Rapid hemorrhage control, permissive hypotension, and damage control resuscitation concepts have revolutionized prehospital trauma care. Understanding the classes of hemorrhagic shock guides resuscitation decisions.",
      signsSymptoms: "Class I: minimal symptoms, anxiety. Class II: tachycardia, tachypnea, narrowed pulse pressure, anxiety, delayed capillary refill. Class III: tachycardia >120, hypotension, confusion, significant tachypnea, cold/clammy skin. Class IV: severe tachycardia or bradycardia (pre-arrest), profound hypotension, obtundation, negligible urine output, ashen/gray skin.",
      assessment: "Rapid trauma assessment identifying sources of hemorrhage: external bleeding, chest, abdomen, pelvis, long bones. Vital signs trends (heart rate and blood pressure). Shock index (HR/SBP) >0.9 suggests significant hemorrhage. Assess mental status as indicator of cerebral perfusion. Consider mechanism of injury for occult hemorrhage risk.",
      management: "Control external hemorrhage: direct pressure, tourniquet for extremity hemorrhage, wound packing with hemostatic agents. Permissive hypotension: target SBP 80-90 mmHg (unless TBI present). IV/IO access with warm isotonic crystalloid in small boluses (250-500 mL). Tranexamic acid (TXA) 1g IV within 3 hours of injury. Pelvic binder for suspected pelvic fracture. Rapid transport to trauma center.",
      complications: "Lethal triad of trauma: hypothermia, acidosis, and coagulopathy — each worsens the others. Complications include DIC, multi-organ failure, ARDS, compartment syndrome, reperfusion injury, and death. Aggressive crystalloid resuscitation can worsen coagulopathy and tissue edema.",
      pearls: [
        "The best fluid for hemorrhagic shock is blood — crystalloid is a temporizing bridge, not a definitive treatment",
        "Permissive hypotension (SBP 80-90) reduces ongoing hemorrhage without completely sacrificing perfusion — except in TBI where cerebral perfusion must be maintained",
        "A normal blood pressure does NOT rule out significant hemorrhage — young patients compensate well until sudden decompensation",
        "TXA must be given within 3 hours of injury — after 3 hours, it may increase mortality"
      ],
      pitfalls: [
        "Over-resuscitating with crystalloid — large volumes dilute clotting factors, worsen hypothermia, and increase bleeding",
        "Relying on blood pressure to detect early hemorrhage — tachycardia and narrowed pulse pressure appear before hypotension",
        "Not applying a tourniquet early for extremity hemorrhage — tourniquets save lives and should not be delayed",
        "Spending too long on scene for penetrating trauma — rapid transport to a trauma center saves more lives than field interventions"
      ],
      faq: [
        { question: "What are the classes of hemorrhagic shock?", answer: "Class I: <750 mL (<15% blood volume), minimal symptoms. Class II: 750-1500 mL (15-30%), tachycardia, narrowed pulse pressure. Class III: 1500-2000 mL (30-40%), hypotension, confusion. Class IV: >2000 mL (>40%), severe hypotension, obtundation, imminent death." },
        { question: "What is permissive hypotension?", answer: "Permissive hypotension is the strategy of targeting a lower-than-normal blood pressure (SBP 80-90 mmHg) in hemorrhagic shock to reduce ongoing bleeding while maintaining minimal organ perfusion. It avoids the risks of aggressive fluid resuscitation (dilutional coagulopathy, clot disruption). Contraindicated in TBI where cerebral perfusion pressure must be maintained." },
        { question: "When should a tourniquet be applied?", answer: "Apply a tourniquet for any life-threatening extremity hemorrhage that cannot be controlled with direct pressure. Apply it high and tight on the extremity, proximal to the wound. Modern guidelines encourage early tourniquet use — delayed application contributes to preventable death in trauma." }
      ],
      keywords: ["hemorrhagic shock management", "trauma hemorrhage classification", "permissive hypotension EMS", "tourniquet application", "TXA trauma prehospital"],
      related: ["tourniquet-application", "tranexamic-acid", "pelvic-fracture", "traumatic-cardiac-arrest", "shock-assessment"]
    },

    {
      title: "Traumatic Brain Injury",
      category: "Trauma",
      overview: "Traumatic brain injury (TBI) is damage to the brain caused by an external mechanical force. It ranges from mild concussion to severe injury with coma. TBI is a leading cause of death and disability in trauma patients, and prehospital management significantly impacts neurological outcomes.",
      mechanism: "Primary brain injury occurs at the moment of impact: contusion, laceration, diffuse axonal injury, and intracranial hemorrhage. Secondary brain injury develops over hours to days from hypoxia, hypotension, cerebral edema, increased intracranial pressure, and herniation. Prehospital care focuses on preventing secondary injury by maintaining oxygenation and cerebral perfusion.",
      clinicalRelevance: "Preventing secondary brain injury is the most important goal of prehospital TBI management. Even a single episode of hypoxia (SpO2 <90%) or hypotension (SBP <90) doubles mortality in severe TBI. Paramedics have a direct and measurable impact on TBI outcomes.",
      signsSymptoms: "Altered consciousness (GCS assessment), headache, amnesia, confusion, vomiting, seizures, focal neurological deficits, unequal pupils (herniation sign), Battle sign and raccoon eyes (basilar skull fracture), CSF rhinorrhea/otorrhea, Cushing's triad (hypertension, bradycardia, irregular respirations = late herniation sign).",
      assessment: "Glasgow Coma Scale (GCS): Eye opening (1-4) + Verbal response (1-5) + Motor response (1-6) = 3-15. Mild TBI: GCS 13-15. Moderate: 9-12. Severe: 3-8. Pupil assessment: size, equality, reactivity. Focal neurological exam. Serial assessments for deterioration.",
      management: "Prevent secondary injury: maintain SpO2 >94%, maintain SBP >90 mmHg (>100 preferred), avoid hyperthermia. Airway management: intubate if GCS ≤8 (protect airway). Ventilate to maintain ETCO2 35-40 mmHg (normocapnia). Avoid hyperventilation unless signs of herniation present. If herniation suspected: brief hyperventilation (ETCO2 30-35), elevate head 30 degrees, mannitol or hypertonic saline per protocol.",
      complications: "Cerebral herniation (uncal, transtentorial), seizures, coagulopathy, neurogenic pulmonary edema, diabetes insipidus, SIADH, and death. Hypoxia and hypotension are the two most preventable causes of secondary brain injury and the most important targets for prehospital management.",
      pearls: [
        "Even a single episode of SBP <90 doubles TBI mortality — aggressive BP maintenance is critical",
        "Hyperventilation is NOT routine in TBI — it causes cerebral vasoconstriction and can worsen ischemia. Only use briefly if herniation signs are present",
        "Monitor ETCO2 to guide ventilation — target 35-40 mmHg for normal ventilation",
        "GCS motor score is the most prognostically important component — a motor score of 1-2 in severe TBI carries a very poor prognosis"
      ],
      pitfalls: [
        "Prophylactic hyperventilation — this is harmful and reduces cerebral blood flow. Only hyperventilate for active herniation",
        "Allowing even brief hypoxia or hypotension — both dramatically worsen outcomes",
        "Not performing serial neurological assessments — deterioration can be rapid and must be detected early",
        "Attributing altered mental status to intoxication without considering TBI — always assume TBI until proven otherwise in trauma"
      ],
      faq: [
        { question: "What is the Glasgow Coma Scale?", answer: "GCS assesses level of consciousness: Eye Opening (4=spontaneous, 3=voice, 2=pain, 1=none) + Verbal Response (5=oriented, 4=confused, 3=inappropriate words, 2=incomprehensible sounds, 1=none) + Motor Response (6=obeys commands, 5=localizes, 4=withdraws, 3=abnormal flexion, 2=extension, 1=none). Total range: 3-15." },
        { question: "What is Cushing's triad?", answer: "Cushing's triad is hypertension (with widened pulse pressure), bradycardia, and irregular respirations. It is a late sign of increased intracranial pressure and impending brainstem herniation. Its presence indicates a critical emergency requiring immediate intervention." },
        { question: "Why is hyperventilation harmful in TBI?", answer: "Hyperventilation reduces PaCO2, causing cerebral vasoconstriction. While this temporarily reduces ICP, it also reduces cerebral blood flow, potentially worsening ischemia in already-injured brain tissue. It is only used as a temporizing measure when active herniation signs are present." }
      ],
      keywords: ["traumatic brain injury paramedic", "TBI prehospital management", "Glasgow Coma Scale", "secondary brain injury prevention", "Cushing triad"],
      related: ["hemorrhagic-shock", "spinal-cord-injury", "increased-intracranial-pressure", "seizure-management"]
    },

    {
      title: "Spinal Cord Injury",
      category: "Trauma",
      overview: "Spinal cord injury (SCI) is damage to the spinal cord resulting in temporary or permanent changes in motor, sensory, and autonomic function below the level of injury. SCI can be complete (total loss of function) or incomplete (partial preservation). Proper prehospital management, including spinal motion restriction, is critical to preventing secondary injury.",
      mechanism: "Primary SCI occurs from mechanical force: compression, distraction, shearing, or laceration of the spinal cord. Secondary SCI develops from edema, ischemia, inflammatory cascade, and ongoing instability. The cervical spine (C3-C7) is the most commonly injured region. High cervical injuries (above C4) can impair diaphragmatic function, causing respiratory failure.",
      clinicalRelevance: "Spinal motion restriction decisions and neurogenic shock management are key paramedic competencies. Modern guidelines emphasize selective immobilization based on clinical assessment rather than universal c-spine precautions for all trauma patients.",
      signsSymptoms: "Motor and sensory deficits below the level of injury, priapism, paradoxical (diaphragmatic) breathing, neurogenic shock (hypotension with bradycardia and warm skin), loss of bladder/bowel control, spinal tenderness. Complete SCI: total loss of motor and sensory function below level. Incomplete syndromes: anterior cord, central cord, Brown-Sequard (hemisection).",
      assessment: "Assess mechanism of injury for SCI risk. Assess motor function: grip strength, dorsiflexion, plantar flexion, arm strength. Assess sensory function: light touch, pain sensation, dermatome levels. Assess for neurogenic shock. Use a validated clinical decision tool (NEXUS criteria or Canadian C-Spine Rule) for clearance if applicable.",
      management: "Spinal motion restriction: manual inline stabilization → cervical collar → full-body immobilization on long backboard or scoop stretcher (minimize time on backboard). Neurogenic shock: IV fluid bolus (cautious — these patients may not tolerate large volumes), vasopressors (norepinephrine or phenylephrine) for persistent hypotension. Maintain normothermia. High cervical SCI may require ventilatory support (BVM or intubation).",
      complications: "Respiratory failure (C3-C5 injuries affect phrenic nerve), autonomic dysreflexia (chronic SCI), pressure ulcers, DVT/PE, urinary retention, neurogenic shock, spinal shock (temporary loss of reflexes below injury), and chronic pain syndrome.",
      pearls: [
        "Neurogenic shock presents as hypotension with bradycardia and warm, dry skin — this is the opposite of hypovolemic shock",
        "Do not attribute hypotension solely to neurogenic shock in a trauma patient — always rule out hemorrhage first",
        "Minimize time on a long backboard — prolonged immobilization causes pressure ulcers and pain without improving outcomes",
        "High cervical injuries (above C4) affect the phrenic nerve — watch for diaphragmatic breathing and respiratory failure"
      ],
      pitfalls: [
        "Assuming neurogenic shock without ruling out hemorrhage — trauma patients with SCI can also bleed internally",
        "Over-immobilizing low-risk patients — use clinical decision rules (NEXUS, Canadian C-Spine Rule) for selective immobilization",
        "Not reassessing motor and sensory function serially — deterioration may indicate expanding epidural hematoma",
        "Forgetting to assess for respiratory compromise in cervical SCI — diaphragmatic breathing may be subtle"
      ],
      faq: [
        { question: "What is neurogenic shock?", answer: "Neurogenic shock is caused by loss of sympathetic tone below the level of spinal cord injury, resulting in unopposed parasympathetic activity. This causes vasodilation (hypotension, warm skin) and bradycardia. It differs from hypovolemic shock, which presents with tachycardia and cool/clammy skin. Treatment includes fluids and vasopressors." },
        { question: "When is spinal motion restriction indicated?", answer: "Indications include: mechanism concerning for SCI, midline spinal tenderness, neurological deficit, altered mental status preventing reliable assessment, distracting injury, intoxication, or failure to meet NEXUS or Canadian C-Spine Rule clearance criteria. Modern practice uses selective immobilization rather than universal precautions." },
        { question: "What are the NEXUS criteria for c-spine clearance?", answer: "The NEXUS criteria allow clearance WITHOUT imaging if ALL five criteria are met: no midline cervical tenderness, no focal neurological deficit, normal alertness, no intoxication, and no painful distracting injury. If any criterion is not met, maintain spinal motion restriction." }
      ],
      keywords: ["spinal cord injury paramedic", "neurogenic shock treatment", "spinal motion restriction", "cervical spine injury EMS", "NEXUS criteria"],
      related: ["traumatic-brain-injury", "hemorrhagic-shock", "neurogenic-shock", "spinal-immobilization"]
    },

    {
      title: "Tension Pneumothorax",
      category: "Trauma",
      overview: "Tension pneumothorax is a life-threatening condition in which air progressively accumulates in the pleural space under positive pressure, causing lung collapse, mediastinal shift, and cardiovascular compromise. It is one of the most rapidly lethal reversible causes of death in trauma and a key component of the H's and T's in cardiac arrest.",
      mechanism: "A one-way valve mechanism allows air to enter the pleural space during inspiration but prevents escape during expiration. Progressive air accumulation increases intrapleural pressure, collapsing the ipsilateral lung, shifting the mediastinum to the contralateral side, compressing the heart and great vessels, and kinking the vena cava. This reduces venous return and cardiac output, rapidly progressing to obstructive shock and cardiac arrest.",
      clinicalRelevance: "Tension pneumothorax is a clinical diagnosis requiring immediate intervention. Chest X-ray confirmation should never delay treatment. Needle decompression is a core ALS skill that every paramedic must be prepared to perform without hesitation.",
      signsSymptoms: "Severe respiratory distress, tachypnea, hypotension, tachycardia, absent breath sounds on affected side, hyperresonance to percussion on affected side, JVD (may be absent if hypovolemic), tracheal deviation away from affected side (LATE finding), subcutaneous emphysema, cyanosis, and deteriorating mental status.",
      assessment: "Clinical diagnosis based on mechanism + physical findings. Do NOT delay treatment for imaging. Assessment triad: unilateral absent breath sounds + hemodynamic instability + respiratory distress = treat immediately. Common causes: penetrating chest trauma, rib fractures, positive pressure ventilation, central line placement.",
      management: "Immediate needle decompression: 14-gauge catheter (minimum 3.25 inches for adults) at 2nd ICS midclavicular line or 4th-5th ICS anterior axillary line (preferred). Insert over the superior border of the rib. Rush of air confirms diagnosis. Leave catheter in place. Reassess — if symptoms return, perform repeat decompression or use alternative site. Prepare for chest tube at hospital.",
      complications: "If untreated: cardiac arrest and death. Complications of needle decompression: failure to decompress (needle too short, wrong location), iatrogenic pneumothorax, lung laceration, hemothorax from intercostal vessel injury, catheter kinking, and re-accumulation requiring repeat decompression.",
      pearls: [
        "Tension pneumothorax is a CLINICAL diagnosis — do not wait for X-ray or imaging to treat",
        "JVD may be absent in hypovolemic trauma patients with tension pneumothorax — don't rely on JVD alone",
        "Tracheal deviation is a LATE sign — if you wait for tracheal deviation, you have waited too long",
        "Any intubated patient who suddenly deteriorates should be evaluated for tension pneumothorax — positive pressure ventilation can convert simple to tension pneumothorax"
      ],
      pitfalls: [
        "Waiting for imaging confirmation before performing needle decompression — this is a clinical diagnosis requiring immediate action",
        "Using a standard IV catheter (1.25 inch) for needle decompression — it is too short to reach the pleural space in most adults",
        "Missing tension pneumothorax as a cause of PEA arrest in trauma — empiric bilateral needle decompression may be indicated",
        "Confusing hemothorax with tension pneumothorax — both can cause absent breath sounds, but hemothorax has dull percussion (not hyperresonant)"
      ],
      faq: [
        { question: "How is tension pneumothorax different from simple pneumothorax?", answer: "Simple pneumothorax has air in the pleural space without progressive accumulation — the patient has respiratory symptoms but remains hemodynamically stable. Tension pneumothorax has progressive air accumulation creating positive intrapleural pressure, causing mediastinal shift, cardiovascular compromise, and eventual cardiac arrest. Tension requires immediate decompression." },
        { question: "Can tension pneumothorax cause cardiac arrest?", answer: "Yes, tension pneumothorax is a common cause of obstructive cardiac arrest, typically presenting as PEA or asystole. It is one of the reversible T's in the H's and T's. Needle decompression during cardiac arrest resuscitation can restore venous return and cardiac output." },
        { question: "What are the landmarks for needle decompression?", answer: "Two accepted sites: 2nd intercostal space at the midclavicular line (traditional), or 4th-5th intercostal space at the anterior axillary line (preferred — thinner chest wall, higher success rates). Always insert over the superior border of the rib to avoid the neurovascular bundle." }
      ],
      keywords: ["tension pneumothorax treatment", "needle decompression indications", "tension pneumothorax signs", "chest trauma emergency", "obstructive shock pneumothorax"],
      related: ["needle-decompression", "chest-trauma", "pulseless-electrical-activity", "traumatic-cardiac-arrest"]
    },

    {
      title: "Chest Trauma",
      category: "Trauma",
      overview: "Chest trauma encompasses injuries to the thoracic cage, lungs, heart, great vessels, and diaphragm caused by blunt or penetrating mechanisms. It accounts for approximately 25% of trauma deaths and contributes to another 25%. Many lethal chest injuries are rapidly treatable in the prehospital setting.",
      mechanism: "Blunt chest trauma results from direct impact, compression, or deceleration forces causing rib fractures, pulmonary contusion, cardiac contusion, aortic injury, and diaphragmatic rupture. Penetrating chest trauma from stab wounds or gunshots causes pneumothorax, hemothorax, cardiac tamponade, and great vessel injury. The mechanism helps predict injury patterns.",
      clinicalRelevance: "Chest trauma management is a fundamental paramedic competency. Several immediately life-threatening conditions (tension pneumothorax, open pneumothorax, massive hemothorax, cardiac tamponade, flail chest) require prehospital intervention. Rapid assessment and treatment directly impact survival.",
      signsSymptoms: "Chest pain, dyspnea, tachypnea, decreased breath sounds, hemoptysis, subcutaneous emphysema, chest wall instability (flail segment), distended neck veins, muffled heart sounds, paradoxical chest wall movement, and signs of shock. Assessment must identify immediately life-threatening conditions: tension pneumothorax, open pneumothorax, massive hemothorax, flail chest, cardiac tamponade.",
      assessment: "Primary survey: assess airway, breathing (rate, quality, breath sounds, SpO2), circulation (pulse, BP, signs of shock). Expose and inspect chest for wounds, deformities, paradoxical movement. Auscultate bilaterally. Palpate for crepitus, instability, tenderness. Monitor ETCO2 and SpO2 continuously.",
      management: "Tension pneumothorax: needle decompression. Open pneumothorax: occlusive dressing (taped on three sides or vented chest seal). Massive hemothorax: IV fluid resuscitation, rapid transport. Flail chest: positive pressure ventilation (BVM or CPAP), analgesics, avoid splinting. Cardiac tamponade: rapid transport for pericardiocentesis (rarely performed in field). All: oxygen, IV access, pain management, trauma center transport.",
      complications: "ARDS, pulmonary contusion progression, delayed hemothorax, empyema, post-traumatic pneumonia, cardiac dysrhythmias from myocardial contusion, aortic transection, and tracheobronchial disruption.",
      pearls: [
        "The 'deadly dozen' chest injuries include 6 immediately life-threatening and 6 potentially life-threatening conditions",
        "Open pneumothorax ('sucking chest wound') should be covered with a vented chest seal — completely sealing it can create tension pneumothorax",
        "Flail chest with underlying pulmonary contusion is more dangerous than the flail segment itself — the contusion worsens over 24-48 hours",
        "Cardiac tamponade from trauma (Beck's triad: JVD, hypotension, muffled heart sounds) requires surgical intervention — prehospital management is rapid transport"
      ],
      pitfalls: [
        "Completely sealing an open chest wound without a vent or three-sided dressing — this can create tension pneumothorax",
        "Missing posterior chest wounds — always log-roll and inspect the back in penetrating trauma",
        "Attributing all unilateral absent breath sounds to pneumothorax — hemothorax also causes decreased breath sounds",
        "Focusing on the flail segment and missing the underlying pulmonary contusion — the contusion determines outcome"
      ],
      faq: [
        { question: "What are the immediately life-threatening chest injuries?", answer: "The six immediately life-threatening chest injuries (identified in primary survey): tension pneumothorax, open pneumothorax, massive hemothorax, flail chest with pulmonary contusion, cardiac tamponade, and airway obstruction. All require immediate prehospital intervention or rapid transport." },
        { question: "How do you manage an open pneumothorax?", answer: "Apply a vented chest seal or an occlusive dressing taped on three sides over the wound. The vent/open side allows air to escape during exhalation (preventing tension pneumothorax) while the sealed portions prevent air entry during inhalation. Monitor closely for development of tension pneumothorax." },
        { question: "What is flail chest?", answer: "Flail chest occurs when three or more adjacent ribs are fractured in two or more places, creating a free-floating segment that moves paradoxically (inward on inspiration, outward on expiration). The underlying pulmonary contusion, not the flail segment itself, is the primary cause of respiratory compromise." }
      ],
      keywords: ["chest trauma paramedic", "penetrating chest injury", "flail chest management", "open pneumothorax treatment", "thoracic trauma EMS"],
      related: ["tension-pneumothorax", "needle-decompression", "cardiac-tamponade", "hemorrhagic-shock"]
    },

    {
      title: "Abdominal Trauma",
      category: "Trauma",
      overview: "Abdominal trauma involves injury to the abdominal organs and vasculature from blunt or penetrating mechanisms. The abdomen is the third most commonly injured region in trauma and a significant source of occult hemorrhage. Prehospital assessment focuses on identifying patients likely to need surgical intervention and ensuring rapid transport.",
      mechanism: "Blunt abdominal trauma causes compression, shearing, and deceleration injuries to solid organs (liver, spleen, kidneys — most commonly injured) and hollow organs (bowel, bladder). Penetrating trauma from stab wounds and gunshots directly damages structures in the injury path. The liver and spleen are the most commonly injured solid organs; the small bowel is the most commonly injured hollow organ.",
      clinicalRelevance: "Abdominal trauma is a significant cause of preventable death due to unrecognized hemorrhage. Physical examination of the abdomen in the prehospital setting is unreliable — up to 40% of patients with significant abdominal injury have a benign initial exam. Mechanism of injury and a high index of suspicion are essential.",
      signsSymptoms: "Abdominal pain, tenderness, rigidity, guarding, distension, ecchymosis (Cullen sign — periumbilical bruising; Grey-Turner sign — flank bruising), evisceration, seat belt sign (ecchymosis across abdomen from lap belt), nausea/vomiting, signs of hemorrhagic shock without obvious external source.",
      assessment: "Assess mechanism for abdominal injury risk. Inspect for distension, ecchymosis, penetrating wounds, evisceration. Palpate all four quadrants for tenderness, rigidity, guarding. Assess for peritoneal signs. Monitor vitals for signs of hemorrhage. The abdominal exam is a trend assessment — serial examinations are more valuable than a single exam.",
      management: "Blunt trauma with signs of hemorrhage: rapid transport to trauma center, IV access with cautious fluid resuscitation (permissive hypotension if no TBI). Penetrating trauma: do NOT remove impaled objects (stabilize in place), cover eviscerated organs with moist sterile dressing, rapid transport. All: avoid oral intake, monitor for deterioration, trauma center notification.",
      complications: "Missed intra-abdominal hemorrhage leading to exsanguination, peritonitis from hollow viscus perforation, delayed splenic rupture (can occur days after initial injury), diaphragmatic injury with organ herniation, and retroperitoneal hemorrhage (difficult to detect clinically).",
      pearls: [
        "A normal abdominal exam does NOT rule out significant injury — serial assessments and high index of suspicion are essential",
        "The spleen is the most commonly injured organ in blunt abdominal trauma — left upper quadrant pain with Kehr sign (referred left shoulder pain) suggests splenic injury",
        "Never remove impaled objects from the abdomen — they may be tamponading hemorrhage",
        "Seat belt sign across the abdomen is highly associated with hollow viscus injury, mesenteric tear, and Chance fracture of the spine"
      ],
      pitfalls: [
        "Dismissing abdominal injury based on a single benign exam — the physical exam is unreliable in the acute setting",
        "Not recognizing the abdomen as a source of occult hemorrhage in shock without external bleeding",
        "Removing impaled objects — this can cause uncontrolled hemorrhage",
        "Replacing eviscerated organs — cover with moist sterile dressings, do not attempt to push organs back in"
      ],
      faq: [
        { question: "Why is abdominal assessment unreliable in the field?", answer: "Up to 40% of patients with significant abdominal injury have a benign initial exam due to altered sensorium (intoxication, head injury), retroperitoneal injuries not causing peritoneal irritation, early examination before peritonitis develops, and distracting injuries masking abdominal pain. Serial assessments improve accuracy." },
        { question: "How should eviscerated organs be managed?", answer: "Cover with a moist sterile dressing (saline-soaked gauze) then cover with an occlusive layer to prevent drying. Do NOT attempt to replace organs into the abdominal cavity. Keep the patient warm and transport rapidly. Do not apply pressure to the eviscerated organs." },
        { question: "What is Kehr sign?", answer: "Kehr sign is referred pain to the left shoulder caused by diaphragmatic irritation from blood or a damaged spleen. It is particularly significant in the setting of blunt left upper quadrant trauma and suggests splenic injury with free intraperitoneal blood." }
      ],
      keywords: ["abdominal trauma paramedic", "blunt abdominal injury assessment", "splenic injury signs", "evisceration management", "penetrating abdominal trauma"],
      related: ["hemorrhagic-shock", "chest-trauma", "pelvic-fracture", "traumatic-cardiac-arrest"]
    },

    {
      title: "Tourniquet Application",
      category: "Trauma",
      overview: "Tourniquet application is the use of a compressive device around an extremity proximal to a wound to occlude arterial blood flow and control life-threatening hemorrhage. Once reserved as a last resort, tourniquets are now recommended as first-line treatment for significant extremity hemorrhage based on extensive military and civilian evidence.",
      mechanism: "A properly applied tourniquet creates circumferential pressure around the extremity that exceeds systolic arterial pressure, completely occluding arterial inflow and stopping hemorrhage. The device must compress both superficial and deep vessels to be effective. Proper application creates ischemia distal to the tourniquet — time-limited to prevent irreversible tissue damage.",
      clinicalRelevance: "Tourniquet application is a critical hemorrhage control skill for all levels of EMS. Military data shows tourniquets prevent death from extremity hemorrhage with low complication rates when applied correctly. The shift from 'last resort' to 'first-line' represents one of the most significant changes in trauma care in recent decades.",
      signsSymptoms: "Tourniquet application is indicated for: life-threatening extremity hemorrhage not controlled by direct pressure, amputation (traumatic or surgical), mass casualty incidents (hemorrhage control takes priority), and arterial bleeding from an extremity wound.",
      assessment: "Assess for life-threatening extremity hemorrhage: bright red spurting blood (arterial), pooling blood despite direct pressure, blood-soaked dressings, or amputation. Assess distal pulses before and after application. Check that hemorrhage has been controlled after application. Time of application must be documented.",
      management: "Apply tourniquet high and tight on the extremity, as proximal as possible (upper thigh or upper arm). Tighten until bleeding stops and distal pulse is absent. Secure the windlass. Note and document the time of application prominently (on the tourniquet and patient). Do NOT release in the field once applied. If first tourniquet does not control hemorrhage, apply a second tourniquet side by side. Reassess periodically.",
      complications: "Nerve injury (usually neuropraxia — temporary), compartment syndrome, limb ischemia if left on too long (>6 hours increases amputation risk), pain, skin damage under the device, and reperfusion injury upon release. However, limb loss from tourniquet use is extremely rare — exsanguination without a tourniquet is far more common.",
      pearls: [
        "Apply high and tight — tourniquet application over a joint is ineffective, and proximal placement is more reliable",
        "If the first tourniquet does not control hemorrhage, add a second tourniquet side by side — do not waste time repositioning",
        "Document the time of application clearly — write 'TQ' and the time on the patient's forehead or tourniquet",
        "A tourniquet that is painful is likely working — a painless tourniquet may only occlude venous outflow (worsens bleeding)"
      ],
      pitfalls: [
        "Applying the tourniquet too loosely — this occludes veins but not arteries, increasing hemorrhage",
        "Placing the tourniquet over a joint — joints prevent adequate compression of vessels",
        "Releasing the tourniquet in the field — once applied, leave in place until surgical intervention is available",
        "Delaying tourniquet application while attempting prolonged direct pressure on life-threatening hemorrhage — apply early"
      ],
      faq: [
        { question: "How long can a tourniquet be left in place?", answer: "Tourniquets can safely remain in place for up to 2 hours with minimal risk. Up to 6 hours is generally safe for limb salvage. Beyond 6 hours, risk of permanent damage increases significantly. However, a tourniquet should never be released in the field — the risk of exsanguination outweighs limb ischemia risk." },
        { question: "Where should a tourniquet be placed?", answer: "Apply as high and tight as possible on the extremity — upper thigh for leg wounds, upper arm for arm wounds. This ensures the tourniquet is proximal to the injury and avoids placement over joints. Place directly on skin, not over clothing, when possible." },
        { question: "Can tourniquets be used for junctional hemorrhage?", answer: "Standard extremity tourniquets are not effective for junctional hemorrhage (groin, axilla, neck). These areas require wound packing with hemostatic gauze, direct pressure, and specialized junctional devices if available. Junctional hemorrhage is a leading cause of preventable battlefield death." }
      ],
      keywords: ["tourniquet application paramedic", "hemorrhage control tourniquet", "combat tourniquet technique", "extremity hemorrhage management", "tourniquet time limit"],
      related: ["hemorrhagic-shock", "wound-packing", "tranexamic-acid", "mass-casualty-triage"]
    },

    {
      title: "Burns Assessment and Management",
      category: "Trauma",
      overview: "Burns are tissue injuries caused by thermal, chemical, electrical, or radiation energy. Burn management in the prehospital setting focuses on stopping the burning process, assessing burn severity, initiating fluid resuscitation, managing the airway, providing pain control, and transporting to an appropriate facility.",
      mechanism: "Thermal burns result from direct heat contact, flames, steam, or scalding. Chemical burns result from exposure to acids, alkalis, or organic compounds. Electrical burns result from current flow through tissue, causing both surface and deep tissue injury along the current path. Radiation burns result from exposure to ionizing radiation. Each mechanism produces different injury patterns and requires specific management considerations.",
      clinicalRelevance: "Accurate burn assessment drives treatment decisions including fluid resuscitation volumes, airway management timing, and transport destination. The Rule of Nines, Parkland formula, and airway assessment are frequently tested on paramedic certification examinations.",
      signsSymptoms: "Superficial (1st degree): red, painful, dry, no blisters (sunburn). Partial thickness (2nd degree): blisters, moist, very painful, red/pink base. Full thickness (3rd degree): white/charred, leathery, dry, painless (nerves destroyed), hair easily pulls out. Inhalation injury signs: facial burns, singed nasal/facial hair, soot in airway, hoarseness, stridor, carbonaceous sputum.",
      assessment: "Rule of Nines for BSA: Head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%. For children: head is 18%, each leg is 14%. Palmar surface of patient's hand ≈ 1% BSA. Assess for inhalation injury. Determine burn depth. Identify circumferential burns (risk of compartment syndrome). Calculate fluid requirements.",
      management: "Stop the burning process (remove from source, remove clothing/jewelry). Cool burns with room-temperature water for 20 minutes (within first 3 hours). Cover with clean dry dressings. Fluid resuscitation: Parkland formula — 4 mL × kg × %BSA burned (2nd and 3rd degree only), give half in first 8 hours. Intubate early if inhalation injury suspected. Pain management: morphine or fentanyl IV. Transport to burn center if criteria met.",
      complications: "Airway compromise from inhalation injury (can develop rapidly — intubate early), hypothermia (loss of skin barrier), infection, compartment syndrome from circumferential burns, rhabdomyolysis from electrical burns, hyperkalemia from massive burns, hypovolemic shock from plasma loss, and carbon monoxide/cyanide poisoning in enclosed-space fires.",
      pearls: [
        "Inhalation injury is the most life-threatening component — intubate early if ANY signs of inhalation injury are present, as airway edema can make later intubation impossible",
        "Only count 2nd and 3rd degree burns for Parkland formula calculation — superficial burns do not require fluid resuscitation",
        "Cool the burn, warm the patient — hypothermia is a significant risk in burn patients due to loss of skin barrier",
        "Circumferential burns of the chest can restrict breathing; circumferential burns of extremities can cause compartment syndrome"
      ],
      pitfalls: [
        "Using ice or ice water on burns — this can worsen tissue damage and cause hypothermia",
        "Waiting to intubate a patient with inhalation injury signs — airway edema progresses rapidly and can make later intubation impossible",
        "Not removing jewelry and clothing from burned areas — retained items cause constriction as edema develops",
        "Overestimating BSA by including superficial (1st degree) burns in the calculation"
      ],
      faq: [
        { question: "What is the Parkland formula?", answer: "The Parkland formula calculates IV fluid requirements for burn resuscitation: 4 mL × patient's weight (kg) × %BSA burned (2nd and 3rd degree only). Give half the total volume in the first 8 hours from the time of burn, and the remaining half over the next 16 hours. Use lactated Ringer's solution." },
        { question: "When should a burn patient be intubated?", answer: "Intubate early if any signs of inhalation injury are present: facial/nasal hair burns, soot in mouth/airway, hoarseness, stridor, carbonaceous sputum, burns in enclosed space, or difficulty swallowing. Airway edema can progress rapidly, making delayed intubation extremely difficult or impossible." },
        { question: "What are the criteria for burn center referral?", answer: "Partial-thickness burns >10% BSA, full-thickness burns of any size, burns of face/hands/feet/genitalia/major joints, chemical or electrical burns, inhalation injury, burns with associated trauma, burns in patients with significant comorbidities, and circumferential burns." }
      ],
      keywords: ["burn assessment paramedic", "Rule of Nines burn", "Parkland formula", "inhalation injury management", "burn classification EMS"],
      related: ["airway-obstruction-management", "carbon-monoxide-poisoning", "hemorrhagic-shock", "pain-management"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Medical Emergencies (25 topics)
    // ═══════════════════════════════════════════

    {
      title: "Stroke Assessment and Management",
      category: "Medical Emergencies",
      overview: "Stroke is a neurological emergency caused by interruption of blood supply to the brain (ischemic stroke, ~85%) or bleeding into the brain (hemorrhagic stroke, ~15%). Rapid recognition using stroke screening tools and expedited transport to a stroke center are the most important prehospital interventions. The phrase 'time is brain' reflects the urgency.",
      mechanism: "Ischemic stroke results from thrombotic or embolic occlusion of a cerebral artery, causing ischemia and infarction in the downstream territory. Hemorrhagic stroke results from rupture of a cerebral vessel, causing intracerebral hemorrhage (ICH) or subarachnoid hemorrhage (SAH). Each minute of large-vessel occlusion results in approximately 1.9 million neurons dying.",
      clinicalRelevance: "Prehospital stroke recognition and rapid transport are among the highest-impact paramedic interventions. Early notification allows activation of the stroke team, reducing door-to-CT and door-to-needle times. Thrombolytics must be administered within 4.5 hours of symptom onset.",
      signsSymptoms: "FAST screen: Face drooping (ask to smile), Arm drift (raise both arms), Speech difficulty (repeat a phrase), Time (last known well). Additional findings: sudden severe headache ('worst headache of my life' — SAH), vision changes, confusion, dizziness, difficulty walking, unilateral weakness or numbness, dysarthria, aphasia.",
      assessment: "Document last known well time (critical for thrombolytic eligibility). Perform stroke screening (Cincinnati, LAMS, or RACE scale per protocol). Glasgow Coma Scale. Blood glucose (rule out hypoglycemia mimicking stroke). 12-lead ECG (identify AFib as potential cause). Neurological exam: facial symmetry, arm drift, speech assessment, pupil exam.",
      management: "Airway management if GCS compromised. Supplemental O2 only if SpO2 <94%. Establish IV access (do NOT delay transport for this). Blood glucose check — treat hypoglycemia. Do NOT lower blood pressure unless SBP >220 (hypertension is a protective response maintaining cerebral perfusion). Rapid transport to nearest stroke center. Prehospital notification for stroke team activation. Last known well time documentation.",
      complications: "Cerebral edema and herniation, hemorrhagic transformation of ischemic stroke, aspiration pneumonia, DVT/PE, seizures, IICP, depression, and death. Post-thrombolytic complications include intracranial hemorrhage (6-7% risk).",
      pearls: [
        "Last known well time is CRITICAL — it determines eligibility for thrombolytics and thrombectomy. Document it precisely",
        "Blood glucose must be checked — hypoglycemia perfectly mimics stroke and is easily treatable",
        "Do NOT lower blood pressure in acute stroke — hypertension maintains perfusion to ischemic penumbra",
        "Large vessel occlusion (LVO) strokes may be eligible for thrombectomy up to 24 hours — use LVO screening tools"
      ],
      pitfalls: [
        "Not documenting the last known well time — this is the most important piece of information for hospital treatment decisions",
        "Lowering blood pressure in acute stroke — this can extend the infarct by reducing perfusion to the ischemic penumbra",
        "Not checking blood glucose — hypoglycemia is the most common stroke mimic and is rapidly reversible",
        "Transporting to the nearest hospital instead of a stroke center — capability matters more than distance"
      ],
      faq: [
        { question: "What is the thrombolytic window for ischemic stroke?", answer: "Alteplase (tPA) can be administered up to 4.5 hours from symptom onset (last known well time). Mechanical thrombectomy for large vessel occlusion can be performed up to 24 hours in selected patients based on imaging. This makes the last known well time the most critical piece of prehospital information." },
        { question: "Why shouldn't blood pressure be lowered in acute stroke?", answer: "In acute ischemic stroke, elevated blood pressure helps maintain blood flow to the ischemic penumbra (the area of brain surrounding the infarct core that is at risk but potentially salvageable). Lowering BP reduces this perfusion and can extend the area of infarction. BP is only treated if SBP >220 mmHg." },
        { question: "How is stroke differentiated from hypoglycemia?", answer: "Hypoglycemia can perfectly mimic stroke with unilateral weakness, speech difficulty, confusion, and focal neurological deficits. Blood glucose <60 mg/dL should be treated with dextrose — if symptoms resolve, it was likely hypoglycemia, not stroke. Always check glucose before attributing symptoms to stroke." }
      ],
      keywords: ["stroke assessment paramedic", "FAST stroke screening", "ischemic stroke prehospital", "last known well time", "stroke center transport"],
      related: ["hypoglycemia", "seizure-management", "traumatic-brain-injury", "atrial-fibrillation"]
    },

    {
      title: "Anaphylaxis",
      category: "Medical Emergencies",
      overview: "Anaphylaxis is a severe, potentially fatal systemic allergic reaction characterized by rapid onset of airway compromise, cardiovascular collapse, and widespread inflammatory response. Epinephrine is the first-line, life-saving treatment. Paramedics must recognize anaphylaxis rapidly and administer epinephrine without delay.",
      mechanism: "Anaphylaxis is typically IgE-mediated (type I hypersensitivity). Prior sensitization produces allergen-specific IgE antibodies that bind to mast cells and basophils. Re-exposure triggers massive degranulation, releasing histamine, leukotrienes, and prostaglandins. These mediators cause vasodilation (hypotension), bronchospasm (airway obstruction), increased vascular permeability (edema, urticaria), and increased mucus production.",
      clinicalRelevance: "Anaphylaxis is a time-critical emergency where delays in epinephrine administration directly correlate with mortality. Paramedics should administer epinephrine at the earliest sign of anaphylaxis — there are no absolute contraindications to epinephrine in anaphylaxis.",
      signsSymptoms: "Rapid onset (minutes to hours) of: urticaria/hives, angioedema (face, lips, tongue), pruritus, flushing. Respiratory: stridor, wheezing, dyspnea, throat tightness, hoarseness. Cardiovascular: hypotension, tachycardia, syncope, cardiac arrest. GI: nausea, vomiting, abdominal cramping, diarrhea. Neurological: anxiety, dizziness, altered mental status. Common triggers: foods, medications, insect stings, latex.",
      assessment: "Identify anaphylaxis criteria: acute onset of symptoms involving skin AND respiratory/cardiovascular compromise. Assess airway (stridor, angioedema), breathing (wheezing, respiratory effort), circulation (BP, pulse, perfusion). Identify the trigger if possible. Assess for biphasic reaction risk.",
      management: "EPINEPHRINE is the FIRST and MOST IMPORTANT treatment: 0.3-0.5 mg IM (1:1000/1 mg/mL) in the anterolateral thigh. May repeat every 5-15 minutes. Positioning: supine with legs elevated (unless respiratory distress). Adjuncts: albuterol for bronchospasm, diphenhydramine 25-50 mg IV/IM, methylprednisolone 125 mg IV (prevents biphasic reaction), IV fluid bolus 1-2 L NS for hypotension. IV epinephrine infusion for refractory anaphylaxis. Prepare for airway management.",
      complications: "Cardiovascular collapse and cardiac arrest, complete airway obstruction from angioedema, biphasic reaction (recurrence 1-72 hours later in 5-20% of cases), refractory anaphylaxis requiring epinephrine infusion, and death. Delayed epinephrine administration is the most common factor in anaphylaxis fatalities.",
      pearls: [
        "Epinephrine is the ONLY first-line treatment — antihistamines and steroids are adjuncts, not substitutes",
        "There are NO absolute contraindications to epinephrine in anaphylaxis — the risk of NOT giving it is greater than any side effect",
        "IM injection in the anterolateral thigh provides faster and more reliable absorption than subcutaneous or deltoid injection",
        "Biphasic reactions can occur up to 72 hours later — all anaphylaxis patients need hospital observation"
      ],
      pitfalls: [
        "Giving antihistamines instead of epinephrine first — diphenhydramine is an adjunct, not a substitute for epinephrine",
        "Administering epinephrine subcutaneously or in the deltoid instead of IM in the thigh — absorption is slower and less reliable",
        "Sitting the patient upright when hypotensive — supine with legs elevated optimizes venous return",
        "Not repeating epinephrine when symptoms persist — epinephrine can and should be repeated every 5-15 minutes"
      ],
      faq: [
        { question: "What is the dose of epinephrine for anaphylaxis?", answer: "Adult: 0.3-0.5 mg IM of 1:1000 (1 mg/mL) epinephrine in the anterolateral thigh. Pediatric: 0.01 mg/kg IM (max 0.3 mg). May repeat every 5-15 minutes if symptoms persist. For cardiovascular collapse: IV epinephrine 0.1 mg (1:10,000) or epinephrine infusion 1-10 mcg/min." },
        { question: "What is a biphasic anaphylactic reaction?", answer: "A biphasic reaction is a recurrence of anaphylaxis symptoms 1-72 hours after the initial reaction has resolved, without re-exposure to the allergen. It occurs in 5-20% of anaphylaxis cases. This is why all anaphylaxis patients require emergency department observation and discharge with an epinephrine auto-injector." },
        { question: "Can you give epinephrine to a patient taking beta-blockers?", answer: "Yes. Patients on beta-blockers may have a blunted response to epinephrine and may require higher doses. They are also at higher risk for severe anaphylaxis because beta-blockade prevents the compensatory tachycardia and bronchodilation that normally occur. Glucagon 1-2 mg IV may be considered as an adjunct." }
      ],
      keywords: ["anaphylaxis treatment paramedic", "epinephrine anaphylaxis dose", "severe allergic reaction EMS", "anaphylaxis management prehospital", "biphasic anaphylaxis"],
      related: ["airway-obstruction-management", "asthma-management", "shock-assessment", "pediatric-anaphylaxis"]
    },

    {
      title: "Diabetic Emergencies",
      category: "Medical Emergencies",
      overview: "Diabetic emergencies encompass life-threatening complications of diabetes mellitus, including hypoglycemia, diabetic ketoacidosis (DKA), and hyperosmolar hyperglycemic state (HHS). Hypoglycemia is the most common diabetic emergency encountered by paramedics and requires immediate treatment. DKA and HHS are medical emergencies requiring aggressive prehospital management and rapid transport.",
      mechanism: "Hypoglycemia: excess insulin relative to glucose intake causes blood glucose <70 mg/dL, depriving the brain of its primary fuel. DKA: absolute insulin deficiency (type 1 DM) leads to lipolysis, ketone production, and metabolic acidosis. HHS: relative insulin deficiency (type 2 DM) causes severe hyperglycemia (>600 mg/dL) with massive osmotic diuresis, dehydration, and hyperosmolarity without significant ketosis.",
      clinicalRelevance: "Blood glucose assessment is mandatory for any patient with altered mental status. Hypoglycemia is the most treatable cause of altered consciousness and can perfectly mimic stroke, seizures, intoxication, and psychiatric disorders. Missing hypoglycemia is a preventable error.",
      signsSymptoms: "Hypoglycemia: diaphoresis, tremor, tachycardia, anxiety, confusion, seizures, unconsciousness, focal neurological deficits. DKA: polyuria, polydipsia, nausea/vomiting, abdominal pain, Kussmaul respirations (deep/rapid), fruity breath odor, dehydration, altered mental status. HHS: profound dehydration, altered mental status, seizures, focal deficits, no Kussmaul respirations, no fruity breath.",
      assessment: "Blood glucose measurement is the key assessment. Hypoglycemia: <70 mg/dL with symptoms. DKA: glucose >250 mg/dL with acidosis signs. HHS: glucose >600 mg/dL with severe dehydration. Assess level of consciousness, vital signs, respiratory pattern, hydration status, and investigate precipitating cause (missed medication, infection, MI).",
      management: "Hypoglycemia: Conscious and can swallow → oral glucose (15-20g). Unable to swallow → Dextrose 50% (D50) 25g IV or Glucagon 1mg IM. DKA/HHS: IV NS 1-2 L bolus, reassess, continue fluids. Monitor glucose. Insulin is generally a hospital intervention. Treat underlying trigger. All: monitor airway, respiratory status, and glucose levels.",
      complications: "Hypoglycemia: seizures, brain damage, death if untreated. DKA: cerebral edema (especially in children with rapid correction), hypokalemia during treatment, cardiac arrest. HHS: thromboembolism, cerebral edema, rhabdomyolysis, acute renal failure. All: cardiac dysrhythmias from electrolyte abnormalities.",
      pearls: [
        "Check blood glucose on EVERY patient with altered mental status — it takes 10 seconds and can change your entire treatment plan",
        "Glucagon requires 10-15 minutes to work and requires glycogen stores — it may be ineffective in malnourished patients or those with liver disease",
        "Kussmaul respirations (deep, rapid breathing) in DKA are respiratory compensation for metabolic acidosis — do NOT suppress this with sedation",
        "HHS has a higher mortality rate than DKA despite being less acidotic — the severe dehydration and hyperosmolarity are more dangerous"
      ],
      pitfalls: [
        "Not checking blood glucose and attributing altered mental status to intoxication, psych, or stroke",
        "Giving D50 without IV access attempt — glucagon IM is the alternative but is slower acting",
        "Not rehydrating DKA patients aggressively — they may have a 5-10 liter fluid deficit",
        "Confusing Kussmaul respirations in DKA with respiratory distress — they are compensatory, not pathological"
      ],
      faq: [
        { question: "What is the difference between DKA and HHS?", answer: "DKA occurs in type 1 DM with absolute insulin deficiency: glucose >250, ketonemia/ketonuria, metabolic acidosis, Kussmaul respirations, fruity breath. HHS occurs in type 2 DM with relative insulin deficiency: glucose >600, severe dehydration, hyperosmolarity, altered mental status, but minimal ketosis and no Kussmaul respirations. HHS has higher mortality." },
        { question: "What is the treatment for prehospital hypoglycemia?", answer: "Conscious and can swallow: oral glucose 15-20g (glucose tablets, juice, sugar). Cannot swallow: D50W (dextrose 50%) 25g (50 mL) IV push, or D10 25g (250 mL). No IV access: Glucagon 1mg IM. Recheck glucose in 10-15 minutes. If still <70, repeat treatment. Feed the patient once conscious." },
        { question: "What are Kussmaul respirations?", answer: "Kussmaul respirations are a deep, labored breathing pattern (increased rate and depth) seen in metabolic acidosis, classically in DKA. They represent respiratory compensation — the body is blowing off CO2 to counteract the metabolic acidosis. The low ETCO2 seen on capnography reflects this hyperventilation." }
      ],
      keywords: ["diabetic emergency paramedic", "hypoglycemia treatment EMS", "DKA management prehospital", "blood glucose assessment", "HHS vs DKA"],
      related: ["altered-mental-status", "seizure-management", "stroke-assessment-and-management", "metabolic-acidosis"]
    },

    {
      title: "Seizure Management",
      category: "Medical Emergencies",
      overview: "Seizures are episodes of abnormal, excessive, or hypersynchronous neuronal activity in the brain that produce transient neurological symptoms. Status epilepticus — a seizure lasting >5 minutes or two or more seizures without return to baseline — is a medical emergency requiring immediate intervention to prevent brain damage.",
      mechanism: "Seizures result from an imbalance between excitatory (glutamate) and inhibitory (GABA) neurotransmission. Focal seizures originate from a localized area; generalized seizures involve both hemispheres simultaneously. Prolonged seizure activity (status epilepticus) causes excitotoxic neuronal injury, hyperthermia, rhabdomyolysis, acidosis, and cerebral edema.",
      clinicalRelevance: "Seizure management is a common prehospital scenario. Paramedics must protect the patient during the seizure, rapidly terminate status epilepticus with benzodiazepines, assess for underlying causes (hypoglycemia, eclampsia, head trauma, infection), and manage the postictal state.",
      signsSymptoms: "Generalized tonic-clonic: loss of consciousness, tonic phase (stiffening), clonic phase (rhythmic jerking), incontinence, tongue biting, postictal confusion and fatigue. Focal: localized motor activity, sensory changes, or behavioral changes without loss of consciousness. Status epilepticus: continuous seizure activity >5 minutes or recurrent seizures without baseline recovery.",
      assessment: "Protect patient from injury. Time the seizure. Assess airway after seizure stops. Blood glucose (rule out hypoglycemia). Vital signs including temperature (febrile seizures in children, infection). History: epilepsy diagnosis, medications, compliance, recent changes, pregnancy. Assess for trauma (fall during seizure). Neurological exam postictal.",
      management: "During seizure: protect from injury, do not restrain or insert anything in mouth, position on side if possible, time the seizure. Status epilepticus: Midazolam 10mg IM or 5mg IV, or Diazepam 5-10mg IV, or Lorazepam 2-4mg IV. May repeat once. Protect airway, suction as needed, supplemental O2. Treat underlying cause: D50 for hypoglycemia, magnesium for eclampsia. Postictal: recovery position, reassess neurological status.",
      complications: "Status epilepticus leading to brain damage, aspiration during seizure, hypoxia, hyperthermia, rhabdomyolysis, metabolic acidosis, trauma from falls during seizure, and refractory status epilepticus requiring general anesthesia.",
      pearls: [
        "Midazolam IM is the preferred prehospital benzodiazepine for status epilepticus because IV access is difficult during active seizures",
        "Always check blood glucose — hypoglycemic seizures resolve with glucose, not benzodiazepines",
        "Time every seizure — the 5-minute threshold for status epilepticus determines whether pharmacological intervention is needed",
        "Most seizures self-terminate within 2 minutes — protect the patient and observe, treating only if seizure is prolonged or recurring"
      ],
      pitfalls: [
        "Inserting objects into the mouth during a seizure — this causes dental injury, does not prevent tongue biting, and can obstruct the airway",
        "Not checking blood glucose — hypoglycemia is a common treatable cause of seizures",
        "Giving benzodiazepines for a single self-limited seizure — most single seizures do not require medication",
        "Not considering eclampsia in pregnant women with seizures — magnesium sulfate is the treatment, not benzodiazepines alone"
      ],
      faq: [
        { question: "What defines status epilepticus?", answer: "Status epilepticus is a seizure lasting more than 5 minutes continuously, or two or more seizures occurring without the patient returning to their baseline level of consciousness between episodes. It is a medical emergency because prolonged seizure activity causes excitotoxic brain damage, and mortality increases with duration." },
        { question: "What is the first-line treatment for prehospital status epilepticus?", answer: "Midazolam 10mg IM (if no IV access) or IV benzodiazepine (midazolam 5mg, lorazepam 2-4mg, or diazepam 5-10mg). The RAMPART trial showed IM midazolam is as effective as IV lorazepam and can be given faster due to not requiring IV access. May repeat once if seizure continues." },
        { question: "What causes seizures?", answer: "Common causes include epilepsy (with or without medication non-compliance), hypoglycemia, head trauma, stroke, CNS infection (meningitis, encephalitis), electrolyte imbalances, drug toxicity or withdrawal (alcohol, benzodiazepines), eclampsia (pregnancy), fever (febrile seizures in children), and brain tumors." }
      ],
      keywords: ["seizure management paramedic", "status epilepticus treatment", "midazolam seizure dose", "prehospital seizure protocol", "seizure causes assessment"],
      related: ["hypoglycemia", "eclampsia", "traumatic-brain-injury", "altered-mental-status"]
    },

    {
      title: "Sepsis and Septic Shock",
      category: "Medical Emergencies",
      overview: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock is sepsis with persistent hypotension requiring vasopressors and elevated lactate despite adequate fluid resuscitation. Early recognition and aggressive prehospital management significantly reduce mortality.",
      mechanism: "Infection triggers a systemic inflammatory response releasing cytokines, complement, and coagulation factors. This causes widespread vasodilation (distributive shock), increased capillary permeability (third-spacing), myocardial depression, and microvascular thrombosis. The result is tissue hypoperfusion, cellular hypoxia, organ dysfunction, and eventually multi-organ failure.",
      clinicalRelevance: "Sepsis is a leading cause of death in hospitalized patients and is increasingly recognized in the prehospital setting. For every hour that antibiotics are delayed, mortality increases by approximately 4-8%. Prehospital recognition and early fluid resuscitation improve survival.",
      signsSymptoms: "SIRS criteria: temperature >38°C or <36°C, heart rate >90, respiratory rate >20, WBC >12,000 or <4,000. qSOFA screening: altered mental status, respiratory rate ≥22, systolic BP ≤100. Sepsis may present with: fever/chills, tachycardia, tachypnea, altered mental status, warm flushed skin (early) or cool mottled skin (late), hypotension, decreased urine output.",
      assessment: "Use qSOFA or local screening tool. Identify suspected source of infection: UTI (dysuria, flank pain), pneumonia (cough, crackles), skin/soft tissue (cellulitis, wound), abdominal (pain, distension), meningitis (headache, stiff neck, rash). Vital signs including temperature. Blood glucose (may be high from stress response or low from overwhelming infection). Assess end-organ function: mental status, urine output, skin perfusion.",
      management: "Aggressive IV fluid resuscitation: 30 mL/kg isotonic crystalloid (NS or LR) within the first hour. Reassess after each bolus. If hypotension persists after 30 mL/kg: vasopressors (norepinephrine first-line). Supplemental oxygen to maintain SpO2 >94%. Blood glucose management. Rapid transport with early hospital notification for antibiotics. Consider prehospital antibiotics if authorized by protocol.",
      complications: "Multi-organ failure (acute kidney injury, ARDS, liver failure, DIC), septic cardiomyopathy, adrenal insufficiency, immunosuppression, long-term cognitive impairment (post-sepsis syndrome), and death. Mortality in septic shock exceeds 40% despite optimal treatment.",
      pearls: [
        "Sepsis can present with normal or LOW temperature (hypothermia is actually associated with worse outcomes) — don't rely on fever alone",
        "Early fluid resuscitation is the most impactful prehospital intervention — give 30 mL/kg in the first hour",
        "An altered mental status in an elderly patient with signs of infection should raise high suspicion for sepsis",
        "Warm, flushed skin in early sepsis can be misleading — these patients are in distributive shock with massive vasodilation"
      ],
      pitfalls: [
        "Missing sepsis because the patient is not febrile — hypothermia and normothermia can occur in sepsis",
        "Under-resuscitating — septic patients may need 4-6 liters of crystalloid in the first few hours",
        "Attributing altered mental status in elderly patients to dementia or delirium without considering sepsis",
        "Not recognizing warm shock — early sepsis presents with warm, flushed skin and bounding pulses, unlike other shock types"
      ],
      faq: [
        { question: "What is the qSOFA score?", answer: "qSOFA (quick Sequential Organ Failure Assessment) is a bedside screening tool: Altered mental status (GCS <15), Respiratory rate ≥22, and Systolic BP ≤100. A score of ≥2 suggests sepsis and should prompt aggressive management. It is designed for rapid prehospital and ED screening." },
        { question: "How much fluid should be given for sepsis?", answer: "The Surviving Sepsis Campaign recommends 30 mL/kg of isotonic crystalloid within the first hour for sepsis-induced hypoperfusion. For a 70 kg patient, this is 2.1 liters. Reassess after each bolus — continue if hypotension persists. If refractory to fluids, start vasopressors." },
        { question: "What is the difference between sepsis and septic shock?", answer: "Sepsis is organ dysfunction caused by infection (identified by qSOFA ≥2 or SOFA criteria). Septic shock is sepsis with persistent hypotension requiring vasopressors to maintain MAP ≥65 mmHg AND lactate >2 mmol/L despite adequate fluid resuscitation. Septic shock has significantly higher mortality." }
      ],
      keywords: ["sepsis recognition paramedic", "septic shock management", "qSOFA screening EMS", "sepsis fluid resuscitation", "prehospital sepsis treatment"],
      related: ["shock-assessment", "altered-mental-status", "pneumonia", "meningitis"]
    },

    {
      title: "Asthma Management",
      category: "Medical Emergencies",
      overview: "Asthma is a chronic inflammatory disease of the airways characterized by reversible airflow obstruction, bronchial hyperresponsiveness, and airway inflammation. Acute asthma exacerbation is a common prehospital emergency that ranges from mild bronchospasm to life-threatening status asthmaticus requiring immediate aggressive intervention.",
      mechanism: "Triggers (allergens, exercise, cold air, infection, stress) initiate an inflammatory cascade causing bronchial smooth muscle contraction (bronchoconstriction), airway mucosal edema, and excessive mucus production. These three mechanisms narrow the airway lumen, increasing airway resistance, trapping air (hyperinflation), and impairing gas exchange. Severe obstruction can cause respiratory failure and cardiac arrest.",
      clinicalRelevance: "Asthma exacerbation is one of the most common respiratory emergencies in prehospital care. Paramedics must rapidly assess severity, initiate bronchodilator therapy, and identify patients at risk for respiratory failure. Severe asthma kills — delays in treatment are associated with worse outcomes.",
      signsSymptoms: "Mild: wheezing, dyspnea, cough, prolonged expiratory phase, SpO2 >94%. Moderate: significant wheezing, accessory muscle use, difficulty speaking full sentences, SpO2 90-94%. Severe: severe dyspnea, speaking in words only, tachycardia >120, SpO2 <90%, silent chest (ominous — airflow too limited to produce wheeze). Life-threatening: obtundation, bradycardia, absent breath sounds, cyanosis.",
      assessment: "Assess severity: ability to speak (sentences vs words vs unable), respiratory rate, accessory muscle use, SpO2, ETCO2 (shark-fin waveform, rising ETCO2 indicates impending failure), peak flow if available. A silent chest in a distressed patient is a pre-arrest sign. Ask about triggers, current medications, previous ICU admissions, and intubation history.",
      management: "Mild-moderate: Albuterol 2.5mg nebulizer (may repeat x3). Ipratropium 0.5mg nebulizer (add to albuterol for moderate-severe). Corticosteroids per protocol. Severe: Continuous albuterol nebulization. Epinephrine 0.3mg IM if impending respiratory failure. Magnesium sulfate 2g IV over 20 min. CPAP 5-10 cmH2O. Life-threatening: prepare for intubation (ketamine preferred for induction — bronchodilates), BVM ventilation with slow rates and long expiratory times.",
      complications: "Respiratory failure and arrest, pneumothorax (from air trapping and barotrauma), death. Ventilating asthma patients is dangerous due to auto-PEEP — use slow rates (8-10/min), long expiratory times, and low tidal volumes. Epinephrine side effects include tachycardia and tremor.",
      pearls: [
        "A silent chest in a distressed patient is a pre-arrest sign — no wheeze means airflow is critically reduced",
        "Rising ETCO2 during an asthma attack indicates the patient is tiring and approaching respiratory failure",
        "Epinephrine IM is indicated for severe asthma not responding to nebulized bronchodilators — do not hesitate to use it",
        "If intubation is needed, use ketamine for induction — it is a potent bronchodilator and maintains hemodynamic stability"
      ],
      pitfalls: [
        "Assuming absence of wheezing means improvement — a silent chest in a distressed patient indicates critical airflow obstruction",
        "Not giving epinephrine for severe asthma — it is indicated and can be life-saving in impending respiratory failure",
        "Ventilating an intubated asthmatic too fast — rapid ventilation causes auto-PEEP, air trapping, and hemodynamic collapse",
        "Mistaking cardiac asthma (CHF with wheezing) for bronchial asthma — assess for JVD, crackles, and cardiac history"
      ],
      faq: [
        { question: "What medications are used for prehospital asthma?", answer: "First-line: Albuterol 2.5mg nebulizer (beta-2 agonist, bronchodilator). Second-line: Ipratropium 0.5mg nebulizer (anticholinergic, added to albuterol for moderate-severe). Severe: Epinephrine 0.3mg IM, Magnesium sulfate 2g IV. Corticosteroids per protocol. CPAP 5-10 cmH2O for severe respiratory distress." },
        { question: "What is status asthmaticus?", answer: "Status asthmaticus is a severe, prolonged asthma exacerbation that does not respond to standard bronchodilator therapy. It is a medical emergency that can progress to respiratory failure, cardiac arrest, and death. Treatment requires aggressive multi-drug therapy, possible CPAP, and preparation for intubation." },
        { question: "Why is ETCO2 important in asthma assessment?", answer: "ETCO2 provides critical information: the shark-fin waveform indicates bronchospasm severity, and the numeric value indicates ventilation adequacy. Low ETCO2 = hyperventilation (compensating). Normal or rising ETCO2 in a distressed asthmatic = failing compensation, impending respiratory failure. This is an ominous sign requiring immediate escalation of treatment." }
      ],
      keywords: ["asthma exacerbation paramedic", "status asthmaticus treatment", "albuterol nebulizer EMS", "severe asthma management", "bronchospasm prehospital"],
      related: ["continuous-positive-airway-pressure", "capnography", "respiratory-distress-assessment", "epinephrine"]
    },

    {
      title: "COPD Exacerbation",
      category: "Medical Emergencies",
      overview: "Chronic obstructive pulmonary disease (COPD) exacerbation is an acute worsening of respiratory symptoms beyond normal day-to-day variation, requiring a change in medication. COPD exacerbations are a leading cause of hospitalization and mortality in COPD patients. Prehospital management focuses on bronchodilation, controlled oxygen therapy, and noninvasive ventilation.",
      mechanism: "COPD involves chronic airway inflammation, mucus hypersecretion, and progressive airflow limitation from emphysema (alveolar destruction) and chronic bronchitis (airway inflammation and mucus production). Exacerbations are triggered by respiratory infections (most common), air pollution, and discontinuation of medications. The exacerbation causes increased airway inflammation, bronchospasm, and mucus production, worsening airflow obstruction.",
      clinicalRelevance: "COPD exacerbation management requires understanding of oxygen therapy targets (88-92% SpO2), the role of CPAP/BiPAP, and the importance of avoiding over-oxygenation. These concepts are heavily tested on paramedic certification exams.",
      signsSymptoms: "Increased dyspnea, increased sputum production and purulence, increased cough, wheezing, prolonged expiratory phase, accessory muscle use, pursed-lip breathing, barrel chest (chronic finding), peripheral edema and JVD (cor pulmonale), altered mental status, cyanosis.",
      assessment: "Compare to baseline: determine the patient's normal level of function and how the current episode differs. Assess respiratory rate, accessory muscle use, SpO2 (target 88-92%), ETCO2 (shark-fin waveform, elevated baseline ETCO2 is common in COPD), ABG/VBG if available. Auscultate for wheezing, prolonged expiration, and decreased breath sounds.",
      management: "Controlled oxygen therapy: titrate to SpO2 88-92% (avoid over-oxygenation). Albuterol 2.5mg nebulizer (may repeat). Ipratropium 0.5mg nebulizer. CPAP 5-10 cmH2O or BiPAP (if available) for moderate-severe exacerbation. Corticosteroids per protocol. If respiratory failure imminent: prepare for intubation. Avoid high-flow O2 that may suppress hypoxic drive.",
      complications: "Acute respiratory failure requiring intubation, pneumothorax, cor pulmonale (right heart failure), polycythemia, carbon dioxide narcosis from over-oxygenation, and death. COPD patients have high rates of comorbid cardiac disease, so always evaluate for concurrent ACS.",
      pearls: [
        "Target SpO2 88-92% — over-oxygenation can suppress the hypoxic drive and worsen CO2 retention (this is the most tested concept)",
        "CPAP/BiPAP dramatically reduces the need for intubation in COPD exacerbation — use it early",
        "Elevated ETCO2 is normal for many COPD patients — compare to baseline and watch the trend rather than the absolute number",
        "Ipratropium (anticholinergic) is particularly effective in COPD — add it to albuterol for synergistic bronchodilation"
      ],
      pitfalls: [
        "Giving high-flow oxygen without monitoring — COPD patients may develop CO2 narcosis with uncontrolled O2 administration",
        "Withholding oxygen from a critically hypoxic COPD patient because of hypoxic drive concerns — treat acute hypoxia first, then titrate down",
        "Not using CPAP/BiPAP when available — noninvasive ventilation reduces intubation rates and mortality",
        "Assuming all wheezing in a COPD patient is COPD — consider concurrent heart failure (cardiac asthma), PE, or pneumonia"
      ],
      faq: [
        { question: "Why is the SpO2 target 88-92% for COPD patients?", answer: "Many COPD patients have chronic CO2 retention and rely on hypoxic drive (low O2 levels) to stimulate breathing. Administering excessive oxygen removes this hypoxic stimulus, potentially reducing respiratory drive and worsening CO2 retention (hypercapnia). Targeting 88-92% provides adequate oxygenation while maintaining respiratory drive." },
        { question: "How does CPAP/BiPAP help in COPD exacerbation?", answer: "CPAP provides continuous positive pressure that splints open collapsed airways, reduces work of breathing, counteracts intrinsic PEEP (air trapping), and improves gas exchange. BiPAP adds inspiratory pressure support, further reducing work of breathing. Both reduce intubation rates by approximately 50% in COPD exacerbation." },
        { question: "What is the role of ipratropium in COPD?", answer: "Ipratropium (Atrovent) is an anticholinergic bronchodilator that blocks parasympathetic-mediated bronchoconstriction. It is particularly effective in COPD where cholinergic tone contributes significantly to bronchospasm. Combined with albuterol (DuoNeb), it provides synergistic bronchodilation superior to either agent alone." }
      ],
      keywords: ["COPD exacerbation paramedic", "oxygen target COPD", "COPD CPAP treatment", "chronic obstructive pulmonary disease EMS", "COPD bronchodilator therapy"],
      related: ["continuous-positive-airway-pressure", "asthma-management", "oxygen-therapy-and-delivery-devices", "respiratory-distress-assessment"]
    },

    {
      title: "Altered Mental Status",
      category: "Medical Emergencies",
      overview: "Altered mental status (AMS) is a broad term describing any change in a patient's level of consciousness, cognitive function, or behavioral state from their baseline. AMS is a symptom, not a diagnosis — the paramedic's role is to identify and treat reversible causes while managing the patient safely.",
      mechanism: "AMS can result from any process that affects cerebral function: metabolic (hypoglycemia, hypoxia, uremia, hepatic encephalopathy), structural (stroke, TBI, tumor), toxic (drugs, alcohol, carbon monoxide), infectious (meningitis, encephalitis, sepsis), environmental (hypothermia, hyperthermia), and psychiatric (psychosis, catatonia). The AEIOU-TIPS mnemonic provides a systematic approach.",
      clinicalRelevance: "AMS is one of the most common and challenging chief complaints in prehospital care. The differential diagnosis is broad, and many causes are time-sensitive. A systematic approach prevents missing treatable conditions.",
      signsSymptoms: "Ranges from mild confusion and disorientation to deep coma. Assess using AVPU (Alert, Verbal, Pain, Unresponsive) and GCS. Specific findings may suggest etiology: focal deficits (stroke), pinpoint pupils (opioid), dilated pupils (sympathomimetics), fruity breath (DKA), febrile (infection), hypothermic, track marks (drug use), medical alert jewelry.",
      assessment: "AEIOU-TIPS: Alcohol, Epilepsy, Insulin (glucose), Overdose, Uremia, Trauma, Infection, Psychiatric, Stroke/Shock. Essential assessments: blood glucose (most important!), SpO2, ETCO2, temperature, 12-lead ECG, pupils, focal neurological exam, medication/substance history.",
      management: "Treat reversible causes immediately: Hypoglycemia → dextrose. Opioid overdose → naloxone. Hypoxia → oxygen/airway. Address airway and ventilation: GCS ≤8 suggests need for advanced airway. Position to prevent aspiration. Treat other identified causes. If no cause identified, supportive care and rapid transport for further evaluation.",
      complications: "Aspiration from inability to protect airway, hypoxic brain injury, seizures, herniation (in structural causes), hypothermia (loss of thermoregulation), self-injury, and progression to cardiac arrest in severe metabolic derangements.",
      pearls: [
        "Check blood glucose on EVERY AMS patient — it is the most common treatable cause and takes seconds",
        "Consider naloxone trial in any unexplained AMS with respiratory depression — opioid epidemic makes this increasingly relevant",
        "GCS ≤8 = inability to protect the airway = consider advanced airway management",
        "The combination of history, medications, and physical findings usually narrows the differential — think systematically"
      ],
      pitfalls: [
        "Attributing AMS to intoxication without checking blood glucose and considering other causes",
        "Not performing a thorough secondary assessment — look for medical alert jewelry, medication bottles, and environmental clues",
        "Assuming psychiatric cause without ruling out medical etiologies — this is a dangerous assumption",
        "Not protecting the airway in a deeply altered patient — aspiration is a common and preventable complication"
      ],
      faq: [
        { question: "What is the AEIOU-TIPS mnemonic?", answer: "AEIOU-TIPS helps systematically consider causes of AMS: A = Alcohol/Acidosis, E = Epilepsy/Electrolytes/Encephalopathy, I = Insulin (hypo/hyperglycemia), O = Overdose/Oxygen, U = Uremia, T = Trauma/Temperature, I = Infection, P = Psychiatric/Poisoning, S = Stroke/Shock/Space-occupying lesion." },
        { question: "Why is blood glucose the most important test in AMS?", answer: "Hypoglycemia is common, rapidly life-threatening, easily diagnosed with a finger stick, and immediately treatable with glucose. It can mimic virtually any neurological condition including stroke, seizure, and intoxication. Missing hypoglycemia is one of the most preventable errors in emergency medicine." },
        { question: "When should naloxone be given for AMS?", answer: "Naloxone should be considered when AMS is accompanied by respiratory depression (RR <12, shallow breaths, hypoxia), pinpoint pupils, and/or clinical suspicion of opioid exposure. Start with 0.4mg IV/IM/IN and titrate to restore adequate breathing — goal is respiratory improvement, not full alertness (to avoid precipitating withdrawal)." }
      ],
      keywords: ["altered mental status paramedic", "AMS assessment EMS", "AEIOU TIPS mnemonic", "causes altered consciousness", "AMS differential diagnosis"],
      related: ["hypoglycemia", "stroke-assessment-and-management", "opioid-overdose", "seizure-management"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Pharmacology (15 topics)
    // ═══════════════════════════════════════════

    {
      title: "Epinephrine",
      category: "Pharmacology",
      overview: "Epinephrine (adrenaline) is the most important emergency medication in the paramedic formulary. It has both alpha-adrenergic (vasoconstriction) and beta-adrenergic (bronchodilation, increased heart rate and contractility) effects. Indications include cardiac arrest, anaphylaxis, severe asthma, and symptomatic bradycardia.",
      mechanism: "Alpha-1 effects: peripheral vasoconstriction, increasing SVR and blood pressure, improving coronary perfusion pressure during CPR. Beta-1 effects: increased heart rate (chronotropy), increased contractility (inotropy), increased conduction velocity (dromotropy). Beta-2 effects: bronchodilation, vasodilation in skeletal muscle vasculature.",
      clinicalRelevance: "Epinephrine is used in more critical situations than any other prehospital medication. Understanding its dose-dependent effects, routes, concentrations, and indications is fundamental paramedic knowledge. Concentration confusion (1:1,000 vs 1:10,000 vs mg/mL) is a common source of medication errors.",
      signsSymptoms: "Not applicable — epinephrine is a treatment medication, not a diagnostic assessment.",
      assessment: "Assess the indication for epinephrine: cardiac arrest (any rhythm), anaphylaxis (cutaneous + respiratory/cardiovascular symptoms), severe asthma/bronchospasm not responding to albuterol, symptomatic bradycardia not responding to atropine. Check for relative contraindications in non-arrest situations.",
      management: "Cardiac arrest: 1mg (1:10,000 or 0.1 mg/mL) IV/IO every 3-5 minutes. Anaphylaxis: 0.3-0.5mg (1:1,000 or 1 mg/mL) IM in anterolateral thigh, repeat every 5-15 min. Severe asthma: 0.3mg (1:1,000) IM. Bradycardia infusion: 2-10 mcg/min IV. Pediatric arrest: 0.01 mg/kg IV/IO (0.1 mL/kg of 1:10,000).",
      complications: "Tachycardia, hypertension, dysrhythmias (VT, VF), myocardial ischemia, anxiety, tremor, headache. In cardiac arrest, the benefit far outweighs risks. In anaphylaxis, there are no absolute contraindications. Extravasation of IV epinephrine can cause tissue necrosis.",
      pearls: [
        "In cardiac arrest, there are NO contraindications to epinephrine — give it every 3-5 minutes",
        "In anaphylaxis, give IM (not subcutaneous) in the anterolateral thigh — fastest and most reliable absorption",
        "Concentration matters: 1:1,000 (1 mg/mL) for IM injection; 1:10,000 (0.1 mg/mL) for IV push in arrest — NEVER give 1:1,000 IV push",
        "The new naming convention uses mg/mL instead of ratio (1:1,000) to reduce confusion — learn both"
      ],
      pitfalls: [
        "Giving 1:1,000 epinephrine IV push — this delivers 10x the cardiac arrest dose and can cause lethal dysrhythmias",
        "Delaying epinephrine in anaphylaxis to try antihistamines first — epinephrine is ALWAYS first-line",
        "Not repeating epinephrine in cardiac arrest — it should be given every 3-5 minutes, not once",
        "Confusing the concentration for adult vs pediatric dosing — always double-check concentration and dose"
      ],
      faq: [
        { question: "What are the different concentrations of epinephrine?", answer: "1:1,000 (1 mg/mL): used for IM injection in anaphylaxis and severe asthma. 1:10,000 (0.1 mg/mL): used for IV push in cardiac arrest. The transition to mg/mL labeling is ongoing: 1 mg/mL replaces 1:1,000, and 0.1 mg/mL replaces 1:10,000. Always verify the concentration before administration." },
        { question: "When is epinephrine given during cardiac arrest?", answer: "For non-shockable rhythms (PEA/asystole): give as soon as IV/IO access is established. For shockable rhythms (VF/pVT): give after the second defibrillation attempt. Repeat every 3-5 minutes regardless of rhythm. Dose: 1mg (10 mL of 1:10,000) IV/IO push." },
        { question: "Are there contraindications to epinephrine in anaphylaxis?", answer: "There are NO absolute contraindications to epinephrine in anaphylaxis. The risk of withholding epinephrine (death from anaphylaxis) far exceeds any risk from the medication. Patients on beta-blockers may require higher doses or adjunctive glucagon, but should still receive epinephrine." }
      ],
      keywords: ["epinephrine dosing paramedic", "epinephrine concentration 1:1000 1:10000", "epinephrine cardiac arrest", "epinephrine anaphylaxis dose", "adrenaline emergency medicine"],
      related: ["cardiac-arrest-management", "anaphylaxis", "asthma-management", "bradycardia-management"]
    },

    {
      title: "Nitroglycerin",
      category: "Pharmacology",
      overview: "Nitroglycerin (NTG) is a potent vasodilator used primarily for chest pain from acute coronary syndrome and acute decompensated heart failure. It reduces myocardial oxygen demand by decreasing preload (venodilation) and, at higher doses, afterload (arteriolar dilation). It is one of the most commonly administered prehospital medications.",
      mechanism: "Nitroglycerin is a nitric oxide donor that relaxes vascular smooth muscle. At low doses, it primarily causes venodilation, reducing preload and pulmonary congestion. At higher doses, it also causes arteriolar dilation, reducing afterload and blood pressure. Coronary artery dilation improves blood flow to ischemic myocardium. Peak effect occurs within 1-3 minutes of sublingual administration.",
      clinicalRelevance: "Nitroglycerin administration, contraindications, and dose management are heavily tested on paramedic certification exams. The key contraindications — right ventricular infarction, recent PDE5 inhibitor use, and hypotension — must be immediately recalled.",
      signsSymptoms: "Not applicable — nitroglycerin is administered to treat symptoms, not diagnose conditions.",
      assessment: "Assess for indications: chest pain suspicious for ACS, acute pulmonary edema from CHF. Assess for contraindications: SBP <90 mmHg, right ventricular infarction (inferior MI with RV involvement), PDE5 inhibitor use within 24-48 hours (sildenafil/vardenafil within 24h, tadalafil within 48h), severe aortic stenosis, hypertrophic cardiomyopathy. Check blood pressure before each dose.",
      management: "Dose: 0.4mg sublingual tablet or spray, every 5 minutes, up to 3 doses. Check blood pressure before each dose — hold if SBP <90 mmHg. For acute CHF: nitroglycerin is very effective at reducing preload and improving symptoms. For ACS: reduces myocardial oxygen demand and may relieve ischemic chest pain. IV nitroglycerin infusion 10-200 mcg/min for refractory symptoms per protocol.",
      complications: "Hypotension (most common), headache (very common — due to meningeal vasodilation), reflex tachycardia, syncope, and severe hypotension if given with PDE5 inhibitors or in RV infarction. Tolerance develops with continuous use. Methemoglobinemia is extremely rare at standard doses.",
      pearls: [
        "Always check blood pressure before EACH dose — nitroglycerin can cause significant hypotension",
        "In right ventricular MI, nitroglycerin is contraindicated because it reduces the preload that the failing RV needs",
        "Ask about erectile dysfunction medications (PDE5 inhibitors) before giving nitroglycerin — the interaction causes severe, refractory hypotension",
        "Nitroglycerin is MORE effective for CHF/pulmonary edema than for ACS chest pain — it rapidly reduces preload and pulmonary congestion"
      ],
      pitfalls: [
        "Not asking about PDE5 inhibitor use — the interaction causes severe hypotension that may not respond to IV fluids",
        "Giving nitroglycerin in inferior MI without checking for RV involvement — always check V4R for inferior STEMIs",
        "Not rechecking blood pressure before each repeat dose",
        "Using nitroglycerin to 'diagnose' cardiac chest pain based on response — both cardiac and non-cardiac pain may respond to NTG"
      ],
      faq: [
        { question: "What are the contraindications to nitroglycerin?", answer: "Systolic BP <90 mmHg, suspected right ventricular infarction, PDE5 inhibitor use (sildenafil/vardenafil within 24 hours, tadalafil within 48 hours), severe aortic stenosis, and hypertrophic obstructive cardiomyopathy. In these conditions, nitroglycerin can cause severe, potentially life-threatening hypotension." },
        { question: "Why is nitroglycerin contraindicated in RV infarction?", answer: "The failing right ventricle is highly preload-dependent — it needs adequate venous return to maintain output. Nitroglycerin causes significant venodilation, reducing preload. In RV infarction, this reduction in preload can cause severe hypotension and cardiovascular collapse. Treatment for RV infarction includes IV fluid boluses." },
        { question: "How is nitroglycerin dosed?", answer: "Sublingual: 0.4mg tablet or spray, may repeat every 5 minutes up to 3 doses. Check BP before each dose. Hold if SBP <90. IV infusion: start at 10-20 mcg/min, titrate by 5-10 mcg/min every 3-5 minutes to symptom relief or BP limit. Maximum dose varies by protocol." }
      ],
      keywords: ["nitroglycerin dosing paramedic", "nitroglycerin contraindications", "NTG chest pain treatment", "nitroglycerin right ventricular MI", "prehospital nitroglycerin"],
      related: ["acute-coronary-syndrome", "acute-myocardial-infarction", "congestive-heart-failure", "cardiogenic-shock"]
    },

    {
      title: "Naloxone",
      category: "Pharmacology",
      overview: "Naloxone (Narcan) is a pure opioid antagonist that rapidly reverses the effects of opioid overdose, including respiratory depression, sedation, and hypotension. It is a life-saving medication in the current opioid epidemic and is one of the most frequently administered prehospital medications.",
      mechanism: "Naloxone competitively binds to mu, kappa, and delta opioid receptors, displacing opioid agonists (morphine, fentanyl, heroin, oxycodone). It has a higher affinity for opioid receptors than most opioid agonists, rapidly reversing respiratory depression, sedation, and analgesia. Onset: IV 1-2 minutes, IM 2-5 minutes, IN 3-5 minutes. Duration: 30-90 minutes (shorter than most opioids).",
      clinicalRelevance: "In the setting of the opioid epidemic, naloxone is the most important reversal agent in prehospital pharmacology. Understanding appropriate dosing, titration to respiratory adequacy (not full reversal), and the risk of re-sedation are critical paramedic competencies.",
      signsSymptoms: "Opioid overdose presents with the classic triad: respiratory depression (RR <12, shallow breathing, apnea), pinpoint pupils (miosis), and altered mental status/unresponsiveness. Additional findings may include hypotension, bradycardia, cyanosis, and evidence of drug use (track marks, drug paraphernalia).",
      assessment: "Assess for opioid overdose triad: respiratory depression, pinpoint pupils, and AMS. Assess respiratory adequacy — naloxone is indicated for respiratory compromise, not simply for being under the influence. Check for other causes of AMS. Assess for mixed overdose (opioid + other substances). Obtain history of substance use if possible.",
      management: "Goal: restore adequate spontaneous ventilation, NOT full consciousness. Start low, titrate up. IV/IM/IN/SQ routes available. IV: 0.04-0.4mg, titrate every 2-3 minutes. IM: 0.4mg. Intranasal: 4mg (single spray). If no response after 10mg total, consider non-opioid cause. Ventilate with BVM while waiting for naloxone effect. Monitor for re-sedation — naloxone has shorter duration than most opioids.",
      complications: "Acute opioid withdrawal syndrome (agitation, vomiting, tachycardia, diaphoresis, combativeness), pulmonary edema (rare but reported), re-sedation when naloxone wears off (most important complication), seizures in mixed overdose with benzodiazepines, and combative behavior upon awakening.",
      pearls: [
        "The goal is to restore adequate BREATHING, not full alertness — titrate to respiratory rate >12, not to full consciousness",
        "Naloxone's duration (30-90 min) is shorter than most opioids — patients can re-sedate and stop breathing after naloxone wears off",
        "Intranasal naloxone (4mg) is an excellent first-line route when IV access is not immediately available",
        "If 10mg of naloxone does not produce a response, consider non-opioid etiology for the presentation"
      ],
      pitfalls: [
        "Giving a full 2mg IV push and causing complete reversal — this precipitates severe withdrawal, vomiting, and combativeness",
        "Assuming the patient is 'fine' after naloxone reversal and not monitoring for re-sedation",
        "Not ventilating the patient while waiting for naloxone to work — BVM ventilation is the immediate treatment for apnea",
        "Giving naloxone for AMS without respiratory depression — naloxone is for respiratory compromise, not just for 'being high'"
      ],
      faq: [
        { question: "Why should naloxone be titrated rather than given as a large bolus?", answer: "Large bolus doses cause abrupt, complete opioid reversal, precipitating acute withdrawal syndrome: severe agitation, vomiting (aspiration risk), tachycardia, diaphoresis, combativeness. Gradual titration (0.04-0.4mg increments) restores breathing without causing full withdrawal, keeping the patient manageable and reducing complications." },
        { question: "What is re-sedation and why is it dangerous?", answer: "Re-sedation occurs when naloxone's effect wears off (30-90 minutes) but the opioid is still active (duration 4-24+ hours depending on the drug). The patient's respiratory depression returns, potentially causing death if unmonitored. This is why all naloxone-treated patients require transport and observation." },
        { question: "Can naloxone be given intranasally?", answer: "Yes. Intranasal naloxone (Narcan nasal spray 4mg) is effective and widely used in prehospital care. It avoids the need for IV access and eliminates needlestick risk. Onset is 3-5 minutes. It is the preferred route when IV access is not immediately available or when needlestick risk is a concern." }
      ],
      keywords: ["naloxone dosing paramedic", "opioid overdose reversal", "Narcan prehospital use", "naloxone titration technique", "opioid antagonist EMS"],
      related: ["opioid-overdose", "altered-mental-status", "bag-valve-mask-ventilation", "toxicology-assessment"]
    },

    {
      title: "Amiodarone",
      category: "Pharmacology",
      overview: "Amiodarone is a class III antiarrhythmic medication used primarily in the treatment of ventricular fibrillation (VF), pulseless ventricular tachycardia (pVT), and stable wide-complex tachycardia. It is the first-line antiarrhythmic in the ACLS cardiac arrest algorithm.",
      mechanism: "Amiodarone primarily blocks potassium channels (class III effect), prolonging the action potential and refractory period. It also has sodium channel blocking (class I), beta-blocking (class II), and calcium channel blocking (class IV) properties, making it a unique 'multi-class' antiarrhythmic. It slows conduction, reduces automaticity, and stabilizes the myocardial membrane.",
      clinicalRelevance: "Amiodarone dosing and indications in cardiac arrest are core ACLS knowledge tested on every paramedic certification exam. Understanding the difference between arrest dosing and non-arrest dosing, and when to use amiodarone versus other antiarrhythmics, is essential.",
      signsSymptoms: "Not applicable — amiodarone is a treatment medication.",
      assessment: "Cardiac arrest: VF/pVT refractory to defibrillation — give after the third shock. Stable wide-complex tachycardia: use for hemodynamically stable VT with a pulse. Assess hemodynamic stability to determine if emergent cardioversion is needed instead.",
      management: "Cardiac arrest VF/pVT: 300mg IV/IO push (first dose), 150mg IV/IO push (second dose, if VF/pVT persists). Stable VT with pulse: 150mg IV over 10 minutes, may repeat once, then maintenance infusion 1 mg/min for 6 hours, then 0.5 mg/min for 18 hours. Maximum 24-hour dose: 2.2g.",
      complications: "Hypotension (IV administration), bradycardia, QT prolongation, torsades de pointes, hepatotoxicity, pulmonary toxicity, thyroid dysfunction, peripheral neuropathy, corneal microdeposits (chronic use). Acute prehospital concerns are primarily hypotension during non-arrest IV infusion.",
      pearls: [
        "In cardiac arrest, amiodarone is given after the THIRD defibrillation — not before",
        "Arrest dose (300mg push) is different from non-arrest dose (150mg over 10 minutes) — do not confuse them",
        "Amiodarone can cause hypotension when given to patients with a pulse — infuse slowly and monitor BP",
        "Amiodarone has a very long half-life (40-55 days) — effects persist long after administration"
      ],
      pitfalls: [
        "Giving amiodarone before the third shock in VF arrest — the algorithm specifies epinephrine first, then amiodarone",
        "Pushing amiodarone rapidly in a patient with a pulse — this causes hypotension; infuse over 10 minutes for non-arrest use",
        "Forgetting the second dose (150mg) in refractory VF — it is indicated if VF persists after the first dose",
        "Using amiodarone for narrow-complex tachycardia (SVT) — adenosine is first-line for regular narrow-complex tachycardia"
      ],
      faq: [
        { question: "When is amiodarone given in the ACLS cardiac arrest algorithm?", answer: "Amiodarone 300mg IV/IO push is given after the third defibrillation for refractory VF/pVT. Sequence: Shock → CPR → Shock → Epinephrine → CPR → Shock → Amiodarone 300mg → CPR → continue. A second dose of 150mg can be given if VF/pVT persists." },
        { question: "What is the dose for stable VT with a pulse?", answer: "150mg IV over 10 minutes, may repeat once if needed. Follow with maintenance infusion of 1 mg/min for 6 hours, then 0.5 mg/min for 18 hours. This is slower than the arrest dose because rapid infusion in perfusing patients causes hypotension." },
        { question: "Can amiodarone and lidocaine be used together?", answer: "They should not be used together as first-line therapy. Current ACLS guidelines recommend amiodarone as first-line antiarrhythmic in cardiac arrest. Lidocaine (1-1.5 mg/kg IV) is an alternative if amiodarone is unavailable. Using both increases the risk of cardiac toxicity." }
      ],
      keywords: ["amiodarone dosing cardiac arrest", "amiodarone paramedic", "ACLS antiarrhythmic", "amiodarone VF pVT", "amiodarone stable VT"],
      related: ["ventricular-fibrillation", "cardiac-arrest-management", "cardiac-dysrhythmias", "defibrillation"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Pediatric Emergencies (12 topics)
    // ═══════════════════════════════════════════

    {
      title: "Pediatric Assessment Triangle",
      category: "Pediatric Emergencies",
      overview: "The Pediatric Assessment Triangle (PAT) is a rapid, observational assessment tool used to form a general impression of a pediatric patient within the first 30 seconds of encounter. It evaluates three components: Appearance, Work of Breathing, and Circulation to Skin — without touching the patient or using any equipment.",
      mechanism: "The PAT leverages three visual and auditory observations that correlate with the child's overall physiological status. Appearance reflects brain perfusion and CNS function. Work of Breathing reflects respiratory effort and airway status. Circulation to Skin reflects cardiovascular function and perfusion. Abnormalities in one or more components direct further assessment and immediate interventions.",
      clinicalRelevance: "The PAT is the recommended first step in every pediatric emergency assessment. It allows rapid categorization of the child's severity level and guides the urgency and type of intervention needed. It is heavily tested on paramedic certification exams.",
      signsSymptoms: "Appearance (TICLS): Tone (moving/limp), Interactiveness (engaging/disengaged), Consolability (can be soothed/inconsolable), Look/Gaze (tracks/vacant stare), Speech/Cry (strong/weak). Work of Breathing: nasal flaring, retractions (subcostal, intercostal, suprasternal), head bobbing, tripod positioning, audible sounds (stridor, wheezing, grunting). Circulation: skin color (pink, pale, mottled, cyanotic).",
      assessment: "Observe from a distance (across the room or doorway) before approaching. Assess each PAT component: Appearance → normal or abnormal? Work of Breathing → normal, increased, or decreased? Circulation to Skin → normal or abnormal? Combinations suggest: respiratory distress, respiratory failure, shock (compensated or decompensated), CNS dysfunction, or cardiopulmonary failure.",
      management: "Based on PAT findings: All normal → focused assessment, history. Abnormal appearance only → consider metabolic, toxic, neurological causes. Abnormal WOB only → respiratory distress (position of comfort, O2, nebulizer). Abnormal WOB + appearance → respiratory failure (BVM, advanced airway). Abnormal circulation + appearance → decompensated shock (fluid bolus, vasopressors). All abnormal → cardiopulmonary failure (immediate resuscitation).",
      complications: "The PAT itself has no complications — it is an assessment tool. However, failure to act on PAT findings (delayed recognition of respiratory failure or decompensated shock) leads to preventable deterioration and cardiac arrest.",
      pearls: [
        "The PAT should be done from across the room BEFORE touching the child — approaching a sick child may cause crying that obscures the assessment",
        "A limp, unresponsive infant who does not react to the environment has an abnormal appearance regardless of vital signs",
        "Grunting is an ominous sign in infants — it indicates the child is generating auto-PEEP to maintain alveolar recruitment",
        "The most important predictor of the child's condition is APPEARANCE — an abnormal appearance is always concerning"
      ],
      pitfalls: [
        "Skipping the PAT and going straight to vital signs — the PAT provides critical information in seconds",
        "Attributing abnormal appearance solely to being scared or crying — a truly normal child can be consoled",
        "Not recognizing that a quiet child with decreased work of breathing may be MORE sick than a crying, wheezing child",
        "Assuming normal skin color means normal perfusion — check capillary refill and assess core vs peripheral temperature"
      ],
      faq: [
        { question: "What are the three components of the PAT?", answer: "Appearance (TICLS: Tone, Interactiveness, Consolability, Look/Gaze, Speech/Cry), Work of Breathing (nasal flaring, retractions, head bobbing, abnormal positioning, audible sounds), and Circulation to Skin (color: pink, pale, mottled, cyanotic). Each is assessed visually from across the room without touching the child." },
        { question: "What does an abnormal PAT with all three components affected indicate?", answer: "Abnormalities in all three PAT components (appearance, work of breathing, and circulation) indicate cardiopulmonary failure — the child is in or near cardiac arrest. This requires immediate resuscitative intervention: CPR if pulseless, aggressive airway management, and rapid vascular access." },
        { question: "How is the PAT different from the primary survey?", answer: "The PAT is a 30-second visual assessment done from across the room to form a general impression. The primary survey (ABCDE) follows and involves hands-on assessment with vital signs and interventions. The PAT guides the urgency and focus of the primary survey." }
      ],
      keywords: ["pediatric assessment triangle", "PAT assessment EMS", "pediatric general impression", "TICLS mnemonic", "pediatric emergency assessment"],
      related: ["pediatric-airway-management", "pediatric-cardiac-arrest", "pediatric-respiratory-emergencies", "pediatric-shock"]
    },

    {
      title: "Pediatric Cardiac Arrest",
      category: "Pediatric Emergencies",
      overview: "Pediatric cardiac arrest differs fundamentally from adult arrest in that it is most commonly caused by respiratory failure or shock (hypoxic/asphyxial arrest) rather than primary cardiac events. This means that prevention through early recognition and treatment of respiratory distress and shock is the most effective strategy.",
      mechanism: "The typical progression in pediatric arrest: respiratory distress → respiratory failure → bradycardia → cardiac arrest. Unlike adults where VF/pVT is the most common initial rhythm, children most commonly present with asystole or PEA (non-shockable rhythms). This reflects the fact that the arrest results from progressive hypoxia and acidosis rather than sudden cardiac electrical failure.",
      clinicalRelevance: "Pediatric cardiac arrest carries a poor prognosis — survival rates are much lower than adult out-of-hospital cardiac arrest. This makes prevention through recognition and treatment of pre-arrest conditions (respiratory failure, shock) the most important paramedic intervention.",
      signsSymptoms: "Pre-arrest warning signs: bradycardia in a child (HR <60 with poor perfusion is an ominous sign), increasing respiratory distress progressing to apnea, worsening cyanosis, decreasing responsiveness, weak or absent pulses. Arrest: unresponsive, no pulse (brachial in infant, carotid in child), no breathing or agonal gasps.",
      assessment: "Confirm arrest: tap and shout, assess breathing and pulse simultaneously (max 10 seconds). Check brachial pulse in infants, carotid or femoral in children. If HR <60 with poor perfusion despite ventilation and oxygenation, treat as cardiac arrest. Attach monitor and identify rhythm.",
      management: "Begin high-quality CPR: Infant — 2 finger or 2 thumb-encircling hands technique, depth 1.5 inches (4 cm). Child — 1 or 2 hands, depth 2 inches (5 cm). Rate 100-120/min. Compression-ventilation ratio: 30:2 (single rescuer) or 15:2 (two rescuers). Ventilate to produce visible chest rise. Epinephrine 0.01 mg/kg (0.1 mL/kg of 1:10,000) IV/IO every 3-5 min. Shockable rhythm: 2 J/kg → 4 J/kg → 4 J/kg → amiodarone 5 mg/kg. Address reversible causes.",
      complications: "Brain injury from hypoxia, rib fractures from CPR (less common in children due to flexible chest), post-cardiac arrest syndrome, and multi-organ failure. The most important factor is preventing the arrest in the first place by aggressively treating pre-arrest conditions.",
      pearls: [
        "Bradycardia in a child (HR <60) with poor perfusion = peri-arrest — begin CPR even if a pulse is present",
        "Pediatric arrest is almost always from respiratory failure or shock — aggressive airway/breathing management and fluid resuscitation can prevent arrest",
        "Two-rescuer CPR uses 15:2 ratio in pediatrics (not 30:2) — this provides more ventilations than the adult ratio because the arrest is usually hypoxic",
        "The most common cause of pediatric cardiac arrest is an improperly managed respiratory emergency"
      ],
      pitfalls: [
        "Using adult compression depth for children — pediatric depth is approximately 1/3 the AP diameter of the chest",
        "Not providing ventilations in pediatric arrest — unlike adult CPR where compression-only may be acceptable, pediatric arrest requires ventilations because the cause is usually hypoxic",
        "Delaying CPR for a child with HR <60 and poor perfusion — this IS a cardiac arrest equivalent",
        "Using adult epinephrine doses — pediatric dose is weight-based: 0.01 mg/kg (max 1mg)"
      ],
      faq: [
        { question: "What is the most common cause of pediatric cardiac arrest?", answer: "Respiratory failure is the most common cause, followed by shock (hypovolemia from dehydration, sepsis, trauma). Primary cardiac causes (VF, channelopathies) are relatively rare in children. This is why pediatric resuscitation emphasizes ventilation and oxygenation alongside compressions." },
        { question: "What is the CPR ratio for pediatric patients?", answer: "Single rescuer: 30:2 compressions to ventilations (same as adult). Two rescuers: 15:2 compressions to ventilations (more ventilations than adult ratio, reflecting the hypoxic nature of pediatric arrest). Compression rate: 100-120/min for all ages." },
        { question: "At what heart rate should CPR be started in a child?", answer: "Begin CPR if the heart rate is less than 60 bpm AND the child shows signs of poor perfusion (altered mental status, poor capillary refill, weak pulses, cyanosis) despite adequate ventilation and oxygenation. A heart rate <60 with poor perfusion in a child is a cardiac arrest equivalent." }
      ],
      keywords: ["pediatric cardiac arrest management", "pediatric CPR technique", "pediatric ACLS algorithm", "pediatric defibrillation energy", "child CPR ratio"],
      related: ["cardiac-arrest-management", "pediatric-assessment-triangle", "pediatric-airway-management", "pediatric-shock"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: OB/GYN Emergencies (8 topics)
    // ═══════════════════════════════════════════

    {
      title: "Eclampsia",
      category: "OB/GYN Emergencies",
      overview: "Eclampsia is the occurrence of seizures in a pregnant woman with preeclampsia that cannot be attributed to another cause. It is a life-threatening obstetric emergency affecting both mother and fetus. Magnesium sulfate is the first-line treatment for eclamptic seizures, not traditional anticonvulsants.",
      mechanism: "Eclampsia develops from the progression of preeclampsia, a pregnancy-specific syndrome of hypertension and end-organ damage. The exact mechanism of seizures is unclear but involves cerebral vasospasm, hypertensive encephalopathy, endothelial dysfunction, and cerebral edema. Eclampsia can occur antepartum, intrapartum, or postpartum (up to 4-6 weeks after delivery).",
      clinicalRelevance: "Eclampsia management — specifically the use of magnesium sulfate — is a high-priority exam topic. Paramedics must recognize preeclampsia/eclampsia and initiate magnesium sulfate before arrival at the hospital. The management differs significantly from other seizure types.",
      signsSymptoms: "Preeclampsia signs preceding eclampsia: hypertension (BP ≥140/90), severe headache, visual disturbances (blurred vision, scotomata), epigastric/RUQ pain, rapid weight gain/edema, proteinuria. Eclampsia: tonic-clonic seizures in a pregnant or recently postpartum woman, usually preceded by preeclampsia signs. May present with altered mental status post-seizure.",
      assessment: "Identify pregnancy status. Measure blood pressure (often severely elevated). Assess for preeclampsia features. Time seizure activity. Monitor fetal heart tones if possible. Assess for complications: placental abruption (vaginal bleeding, uterine tenderness), HELLP syndrome.",
      management: "Magnesium sulfate 4-6g IV over 20 minutes (loading dose), then 1-2g/hr maintenance infusion. This is the FIRST-LINE treatment — not diazepam or other benzodiazepines. Position in left lateral decubitus (improves uterine blood flow). If seizure recurs: additional 2g MgSO4 IV over 5 minutes. Manage airway and oxygenation. Treat severe hypertension if SBP >160 or DBP >110: labetalol 20mg IV or hydralazine 5mg IV per protocol. Rapid transport — definitive treatment is delivery.",
      complications: "Maternal: status epilepticus, cerebral hemorrhage, pulmonary edema, placental abruption, DIC, HELLP syndrome, renal failure, cardiac arrest, death. Fetal: placental abruption, fetal distress, prematurity, intrauterine death. Magnesium toxicity: loss of reflexes, respiratory depression, cardiac arrest (monitor for signs, have calcium gluconate available as antidote).",
      pearls: [
        "Magnesium sulfate is the FIRST-LINE treatment for eclamptic seizures — it is superior to benzodiazepines and phenytoin",
        "Eclampsia can occur up to 4-6 weeks AFTER delivery — postpartum eclampsia is often missed",
        "Left lateral decubitus position improves venous return and uterine blood flow — always position pregnant patients on their left side",
        "Monitor for magnesium toxicity: loss of deep tendon reflexes (first sign), respiratory depression, cardiac arrest. Antidote: calcium gluconate 1g IV"
      ],
      pitfalls: [
        "Using benzodiazepines as first-line for eclamptic seizures — magnesium sulfate is the standard of care",
        "Not considering eclampsia in a postpartum patient with seizures — it can occur weeks after delivery",
        "Failing to treat severe hypertension — SBP >160 or DBP >110 requires treatment to prevent cerebral hemorrhage",
        "Infusing magnesium too quickly — rapid infusion can cause hypotension and cardiac arrest"
      ],
      faq: [
        { question: "Why is magnesium sulfate preferred over benzodiazepines for eclampsia?", answer: "Multiple large randomized trials (MAGPIE, Eclampsia Trial) have shown magnesium sulfate is superior to diazepam, phenytoin, and placebo for treating and preventing eclamptic seizures. It reduces seizure recurrence by 52% compared to diazepam. It also has a wider therapeutic index and is safer for the fetus." },
        { question: "What is the magnesium sulfate dose for eclampsia?", answer: "Loading dose: 4-6g IV over 15-20 minutes. Maintenance: 1-2g/hr IV infusion. For recurrent seizures: additional 2g IV over 5 minutes. Therapeutic range: 4-7 mEq/L. Monitor deep tendon reflexes (lost at 7-10 mEq/L) and respiratory rate (depression at 10-12 mEq/L). Cardiac arrest occurs at >15 mEq/L." },
        { question: "What is HELLP syndrome?", answer: "HELLP is a severe complication of preeclampsia: Hemolysis (destruction of red blood cells), Elevated Liver enzymes (hepatic damage), Low Platelets (consumption coagulopathy). It can mimic many other conditions and carries high maternal and fetal mortality. Treatment is delivery." }
      ],
      keywords: ["eclampsia treatment paramedic", "magnesium sulfate eclampsia", "preeclampsia seizure management", "obstetric emergency EMS", "pregnancy induced hypertension"],
      related: ["seizure-management", "emergency-childbirth", "obstetric-hemorrhage", "neonatal-resuscitation"]
    },

    {
      title: "Emergency Childbirth",
      category: "OB/GYN Emergencies",
      overview: "Emergency childbirth (precipitous delivery) occurs when delivery is imminent and transport to a hospital is not possible. Paramedics must be prepared to assist with normal vaginal delivery, manage common complications, and provide initial neonatal care. Most prehospital deliveries are uncomplicated, but preparation for complications is essential.",
      mechanism: "Labor progresses through three stages: Stage 1 (cervical dilation and effacement — contractions to full dilation), Stage 2 (full dilation to delivery of the infant — active pushing), Stage 3 (delivery of the placenta). In precipitous delivery, rapid progression of Stage 2 leads to delivery before hospital arrival. Crowning (visible presenting part) indicates delivery is imminent and transport should not be attempted.",
      clinicalRelevance: "While prehospital deliveries are uncommon, they are high-stakes events that are heavily tested on paramedic certification exams. Knowledge of normal delivery management, cord complications, breech presentation, and postpartum hemorrhage is essential.",
      signsSymptoms: "Signs of imminent delivery: strong, regular contractions <2 minutes apart, urge to push, crowning (fetal head visible at vaginal opening), rectal pressure, bulging perineum. Previous rapid delivery history increases likelihood. Assess: frequency/duration of contractions, rupture of membranes, urge to bear down, visual inspection for crowning.",
      assessment: "Determine delivery imminence: contractions <2 minutes apart AND urge to push AND crowning → delivery is imminent, prepare for field delivery. If no crowning and contractions >5 minutes apart, transport. Assess for high-risk features: breech presentation, multiple gestation, preterm labor, prolapsed cord, meconium-stained fluid.",
      management: "Position mother in lithotomy or left lateral. Support perineum during delivery. Do NOT pull on the infant — guide gently. Suction mouth then nose only if obstruction is present. Clamp and cut cord after pulsation stops or 1-3 minutes after delivery. Dry, warm, and stimulate the newborn. APGAR score at 1 and 5 minutes. Deliver placenta (usually within 30 minutes — do not pull on cord). Massage uterine fundus to control bleeding. Oxytocin per protocol.",
      complications: "Shoulder dystocia (apply McRoberts maneuver and suprapubic pressure), cord prolapse (knee-chest position, push presenting part off cord), breech delivery (support body, allow head to deliver last), postpartum hemorrhage (uterine massage, oxytocin), nuchal cord (reduce over head or clamp and cut), meconium aspiration, and neonatal resuscitation requirements.",
      pearls: [
        "If you can see the baby's head (crowning), DO NOT attempt transport — prepare for field delivery",
        "Nuchal cord (cord around the neck) is common — usually it can be reduced (slipped over the head); if too tight, double-clamp and cut",
        "Meconium-stained amniotic fluid does NOT require routine tracheal suctioning — only suction if the baby is not vigorous",
        "Uterine massage after delivery is the most effective treatment for postpartum hemorrhage — massage the fundus firmly"
      ],
      pitfalls: [
        "Attempting to delay delivery by holding the baby's head — this can cause injury; support the delivery",
        "Pulling on the umbilical cord to speed placental delivery — this can cause uterine inversion, a life-threatening complication",
        "Not keeping the newborn warm — hypothermia in neonates develops rapidly and can be deadly",
        "Forgetting to massage the uterine fundus after delivery — this is the primary prevention of postpartum hemorrhage"
      ],
      faq: [
        { question: "When should transport be attempted vs. delivering in the field?", answer: "Deliver in the field if: crowning is present, contractions are <2 minutes apart with an urge to push, or delivery is expected within minutes based on multiparity and rapid labor history. Transport if: no crowning, contractions >5 minutes apart, first-time mother (primiparous) with no urge to push, or adequate time to reach the hospital." },
        { question: "What is the McRoberts maneuver?", answer: "McRoberts maneuver is the first-line intervention for shoulder dystocia. The mother's thighs are hyperflexed against her abdomen, which rotates the pelvis posteriorly, straightens the sacrum, and increases the AP diameter of the pelvic outlet. Combined with suprapubic pressure (not fundal pressure), it resolves most shoulder dystocias." },
        { question: "What are the APGAR scoring components?", answer: "APGAR is assessed at 1 and 5 minutes: Appearance (skin color: 0=blue/pale, 1=pink body/blue extremities, 2=all pink), Pulse (0=absent, 1=<100, 2=>100), Grimace (reflex irritability: 0=none, 1=grimace, 2=cry/cough), Activity (muscle tone: 0=limp, 1=some flexion, 2=active), Respiration (0=absent, 1=slow/irregular, 2=good cry). Score 7-10 = normal." }
      ],
      keywords: ["emergency childbirth paramedic", "prehospital delivery", "precipitous delivery management", "shoulder dystocia treatment", "postpartum hemorrhage EMS"],
      related: ["eclampsia", "neonatal-resuscitation", "obstetric-hemorrhage", "breech-delivery"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Toxicology (10 topics)
    // ═══════════════════════════════════════════

    {
      title: "Opioid Overdose",
      category: "Toxicology",
      overview: "Opioid overdose is a life-threatening toxicological emergency caused by excessive opioid exposure, resulting in respiratory depression, CNS depression, and potentially death. With the ongoing opioid epidemic, it is one of the most common prehospital emergencies. Naloxone reversal and ventilatory support are the cornerstones of treatment.",
      mechanism: "Opioids bind to mu receptors in the brainstem respiratory center, reducing the brain's sensitivity to CO2 and depressing the respiratory drive. This leads to progressive hypoventilation, hypoxia, hypercarbia, respiratory acidosis, and eventually respiratory arrest. CNS depression causes decreased consciousness. Peripheral mu receptor activation causes miosis (pinpoint pupils) and decreased GI motility.",
      clinicalRelevance: "The opioid epidemic has made opioid overdose one of the most frequent life-threatening emergencies encountered by paramedics. Rapid recognition and appropriate naloxone titration can prevent death while minimizing complications from precipitated withdrawal.",
      signsSymptoms: "Classic triad: respiratory depression (RR <12, shallow breathing, apnea), pinpoint pupils (miosis), and altered mental status (ranging from drowsiness to unresponsiveness). Additional findings: hypotension, bradycardia, cyanosis, hypothermia, pulmonary edema, seizures (with some opioids like tramadol). Evidence of drug use: track marks, drug paraphernalia, fentanyl patches.",
      assessment: "Assess ABCs — respiratory depression is the primary killer. Assess respiratory rate, depth, and adequacy. Check SpO2. Assess level of consciousness. Look for the triad: respiratory depression + miosis + AMS. Consider mixed overdose (opioid + benzodiazepine, opioid + stimulant). Check blood glucose to rule out hypoglycemia.",
      management: "Immediate: ensure airway, ventilate with BVM if apneic or hypoventilating. Naloxone: 0.4mg IV/IM/SQ or 4mg IN (intranasal). Titrate to adequate breathing (RR >12), NOT full consciousness. May repeat every 2-3 minutes. If no response to 10mg total, consider non-opioid cause. Monitor for re-sedation (naloxone wears off before opioids). Transport ALL naloxone-treated patients.",
      complications: "Death from respiratory arrest, aspiration pneumonia, anoxic brain injury, rhabdomyolysis from prolonged immobility, compartment syndrome, pulmonary edema (both opioid-related and post-naloxone), precipitated withdrawal (agitation, vomiting, combativeness), re-sedation after naloxone wears off.",
      pearls: [
        "Ventilate the patient BEFORE giving naloxone — BVM ventilation is the immediate treatment for apnea/hypoventilation",
        "Titrate naloxone to respiratory adequacy (RR >12), NOT to full alertness — this reduces withdrawal and combativeness",
        "Always consider mixed overdose — opioid + benzodiazepine overdose is common, and naloxone won't reverse benzodiazepine effects",
        "Fentanyl and carfentanil may require higher doses of naloxone due to their high receptor affinity"
      ],
      pitfalls: [
        "Giving a large naloxone bolus (2mg) and precipitating severe withdrawal with vomiting and aspiration risk",
        "Not ventilating the patient while waiting for naloxone to work — ventilation treats the hypoxia immediately",
        "Assuming the patient is safe after naloxone reversal — re-sedation can occur when naloxone wears off (30-90 min)",
        "Not considering fentanyl exposure risk to providers — wear gloves and avoid aerosolizing powder"
      ],
      faq: [
        { question: "How should naloxone be dosed for opioid overdose?", answer: "Start with 0.4mg IV/IM or 4mg intranasal. Goal is to restore adequate breathing (RR >12), not full alertness. May repeat every 2-3 minutes. Total dose may need to be higher for synthetic opioids (fentanyl, carfentanil). If no response after 10mg total, reconsider the diagnosis. Titrating prevents precipitated withdrawal." },
        { question: "Why is re-sedation a concern after naloxone?", answer: "Most opioids have a longer duration of action (4-24+ hours) than naloxone (30-90 minutes). When naloxone's blocking effect wears off, the remaining opioid can re-bind to receptors and cause respiratory depression to recur. This is why all naloxone-treated patients must be transported and monitored." },
        { question: "What is the intranasal naloxone dose?", answer: "Narcan nasal spray delivers 4mg per activation into one nostril. It can be repeated in the other nostril after 2-3 minutes if needed. Onset is 3-5 minutes. Intranasal administration is advantageous because it avoids needlestick risk and does not require IV access." }
      ],
      keywords: ["opioid overdose treatment", "naloxone dosing paramedic", "fentanyl overdose management", "heroin overdose EMS", "opioid epidemic prehospital"],
      related: ["naloxone", "altered-mental-status", "bag-valve-mask-ventilation", "toxicology-assessment"]
    },

    {
      title: "Carbon Monoxide Poisoning",
      category: "Toxicology",
      overview: "Carbon monoxide (CO) poisoning is caused by inhalation of carbon monoxide gas, a colorless, odorless byproduct of incomplete combustion. CO binds to hemoglobin with 200-250 times the affinity of oxygen, forming carboxyhemoglobin (COHb), which prevents oxygen delivery to tissues. It is a common cause of poisoning death in the United States.",
      mechanism: "CO displaces oxygen from hemoglobin, forming carboxyhemoglobin and shifting the oxygen-hemoglobin dissociation curve to the left (reduced oxygen release to tissues). CO also binds to myoglobin and cytochrome oxidase, directly impairing cellular respiration. The result is tissue hypoxia despite normal or elevated PaO2 values. The brain and heart are most vulnerable due to high metabolic demand.",
      clinicalRelevance: "CO poisoning is commonly missed because symptoms are nonspecific and pulse oximetry is unreliable (SpO2 reads falsely high). Paramedics must maintain a high index of suspicion based on scene assessment and recognize that multiple patients from the same location with similar symptoms suggests CO exposure.",
      signsSymptoms: "Mild: headache, nausea, dizziness, fatigue (often mistaken for flu). Moderate: confusion, visual disturbances, tachycardia, chest pain, dyspnea. Severe: syncope, seizures, coma, cardiac dysrhythmias, pulmonary edema, cardiac arrest. 'Cherry red' skin color is a late/postmortem finding — do not wait for it. Key clue: multiple patients in the same location with similar symptoms.",
      assessment: "Scene assessment: identify potential CO sources (furnace, garage, fire scene, generator). High index of suspicion when multiple patients from the same location have headache/nausea. Use CO detector if available (personal CO detector for EMS). Co-oximetry (if available) measures COHb directly. Standard pulse oximetry is UNRELIABLE — SpO2 reads falsely normal.",
      management: "Remove from exposure (ensure scene safety — do not enter without proper respiratory protection). High-flow 100% O2 via NRB mask (half-life of COHb: 5-6 hours on room air, 60-90 minutes on 100% O2, 20-30 minutes with hyperbaric oxygen). Continuous monitoring. Treat seizures with benzodiazepines. Treat cardiac dysrhythmias per standard protocols. Transport for co-oximetry and possible hyperbaric oxygen therapy.",
      complications: "Delayed neurological sequelae (cognitive impairment, memory loss, personality changes — can appear 2-40 days after exposure), myocardial injury, cardiac dysrhythmias, rhabdomyolysis, and death. Pregnant patients are at higher risk because fetal hemoglobin has even higher CO affinity.",
      pearls: [
        "Pulse oximetry is UNRELIABLE in CO poisoning — SpO2 reads falsely normal because it cannot distinguish COHb from O2Hb",
        "Think CO poisoning when multiple patients from the same location present with headache, nausea, and dizziness — especially in cold weather (furnace use)",
        "100% O2 is the most important prehospital treatment — it accelerates CO elimination from hemoglobin",
        "Pregnant patients are at higher risk — fetal hemoglobin binds CO with even greater affinity than adult hemoglobin"
      ],
      pitfalls: [
        "Trusting SpO2 in CO poisoning — it reads falsely high and gives false reassurance",
        "Diagnosing 'flu-like symptoms' without considering CO poisoning — especially in winter months",
        "Not providing 100% O2 because SpO2 looks normal — these patients need high-flow O2 regardless of SpO2",
        "Discharging patients on scene — all suspected CO poisoning patients need hospital evaluation and co-oximetry"
      ],
      faq: [
        { question: "Why is pulse oximetry unreliable in CO poisoning?", answer: "Standard pulse oximeters emit two wavelengths of light and calculate the ratio of oxyhemoglobin to deoxyhemoglobin. Carboxyhemoglobin absorbs light at the same wavelength as oxyhemoglobin, so the device cannot distinguish between them. A patient with 50% COHb may show SpO2 of 99%, grossly overestimating true oxygenation." },
        { question: "What is the treatment for CO poisoning?", answer: "Remove from exposure, administer 100% O2 via NRB mask continuously. This reduces the COHb half-life from 5-6 hours (room air) to 60-90 minutes (100% O2). Hyperbaric oxygen therapy (100% O2 at 2-3 atm) further reduces half-life to 20-30 minutes and is indicated for severe poisoning, pregnancy, or neurological symptoms." },
        { question: "When should hyperbaric oxygen therapy be considered?", answer: "Indications for hyperbaric O2 include: COHb >25%, any neurological symptoms (confusion, syncope, seizures), cardiac involvement (ischemia, dysrhythmias), pregnancy (any level of exposure), and persistent symptoms despite normobaric 100% O2. Transport to a facility with hyperbaric capability." }
      ],
      keywords: ["carbon monoxide poisoning paramedic", "CO poisoning treatment", "carboxyhemoglobin", "pulse oximetry CO poisoning", "carbon monoxide symptoms"],
      related: ["pulse-oximetry", "altered-mental-status", "inhalation-injury", "cyanide-poisoning"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Environmental Emergencies (8 topics)
    // ═══════════════════════════════════════════

    {
      title: "Hypothermia",
      category: "Environmental Emergencies",
      overview: "Hypothermia is a core body temperature below 35°C (95°F) caused by environmental exposure, immersion, or metabolic conditions. It affects cardiac conduction, respiratory function, and neurological status. Severe hypothermia can mimic death — the maxim 'you're not dead until you're warm and dead' guides resuscitation decisions.",
      mechanism: "Heat loss occurs through conduction, convection, radiation, and evaporation. When heat loss exceeds production, core temperature drops. Mild hypothermia (35-32°C): shivering, vasoconstriction, tachycardia. Moderate (32-28°C): shivering stops, bradycardia, atrial fibrillation, confusion. Severe (<28°C): loss of consciousness, VF susceptibility, fixed dilated pupils, absent reflexes — mimicking death.",
      clinicalRelevance: "Hypothermia management is critical prehospital knowledge. The key principles are gentle handling (to avoid triggering VF), active rewarming, and modified resuscitation protocols. Hypothermic cardiac arrest resuscitation may require prolonged CPR and withholding medications until core temperature rises.",
      signsSymptoms: "Mild (35-32°C): shivering, confusion, tachycardia, increased respiratory rate, poor judgment. Moderate (32-28°C): shivering cessation, lethargy, bradycardia, atrial fibrillation, hypotension. Severe (<28°C): unresponsive, severe bradycardia or VF, fixed dilated pupils, absent reflexes, rigid muscles, may appear dead.",
      assessment: "Measure core temperature (rectal or esophageal thermometer — peripheral thermometers are inaccurate). Use a low-reading thermometer. Assess cardiac rhythm (hypothermia causes characteristic Osborn/J waves on ECG). Assess level of consciousness, shivering (present = mild, absent = moderate-severe), and cardiac rhythm stability.",
      management: "Mild: remove wet clothing, passive external rewarming (blankets, warm environment), warm fluids if able to swallow. Moderate: gentle handling, active external rewarming (forced warm air, chemical heat packs — avoid placing directly on skin), warm IV fluids (40-42°C). Severe: minimize handling, CPR if pulseless (prolonged pulse check — up to 60 seconds), defibrillation (one attempt if VF — additional shocks may be ineffective until rewarmed). Limit epinephrine and amiodarone until core temp >30°C. Transport for active core rewarming.",
      complications: "Cardiac arrest (VF is common below 28°C), afterdrop (continued decrease in core temperature after rewarming begins due to cold peripheral blood returning to core), rewarming dysrhythmias, coagulopathy, rhabdomyolysis, and metabolic acidosis.",
      pearls: [
        "Handle the hypothermic patient GENTLY — rough handling can trigger VF in a cold, irritable myocardium",
        "A hypothermic patient is 'not dead until warm and dead' — full resuscitative efforts should continue until rewarmed to at least 32°C",
        "Shivering = mild hypothermia (body can still generate heat). Absence of shivering = moderate-to-severe (body has lost the ability to rewarm)",
        "Defibrillation may be ineffective below 30°C — attempt one shock, then focus on rewarming before additional shocks"
      ],
      pitfalls: [
        "Declaring death in a severely hypothermic patient — they may appear dead but be resuscitable after rewarming",
        "Aggressive handling during assessment — this can trigger VF in the hypothermic heart",
        "Giving repeated defibrillation shocks at very low temperatures without rewarming — the cold heart may not respond to defibrillation",
        "Placing heat packs directly on skin — this can cause burns; always use a barrier"
      ],
      faq: [
        { question: "Why does hypothermia cause VF?", answer: "Cold temperatures alter the electrophysiology of the myocardium: action potential duration increases, conduction velocity decreases, and the refractory period becomes heterogeneous. Below 28°C, the myocardium becomes extremely irritable, and even minor stimulation (handling, movement) can trigger VF. This is why gentle handling is critical." },
        { question: "What are Osborn (J) waves?", answer: "Osborn or J waves are distinctive positive deflections at the J point (junction of QRS and ST segment) seen on ECG in hypothermic patients. They appear as an extra wave between the QRS and ST segment. Their size generally correlates with the degree of hypothermia. They resolve with rewarming." },
        { question: "How should cardiac arrest be managed in hypothermia?", answer: "Begin CPR, attempt ONE defibrillation if VF. If unsuccessful, focus on rewarming. Epinephrine and amiodarone may be ineffective below 30°C — medications can accumulate and cause toxicity when the patient rewarms. Some protocols recommend withholding medications until core temp >30°C, then spacing doses further apart. Continue CPR during rewarming." }
      ],
      keywords: ["hypothermia management paramedic", "hypothermia cardiac arrest", "Osborn J waves ECG", "hypothermia rewarming", "cold exposure emergency EMS"],
      related: ["cardiac-arrest-management", "ventricular-fibrillation", "cold-water-drowning", "frostbite"]
    },

    {
      title: "Heat Stroke",
      category: "Environmental Emergencies",
      overview: "Heat stroke is a life-threatening medical emergency characterized by core body temperature >40°C (104°F) with central nervous system dysfunction (altered mental status, seizures, coma). It represents the failure of thermoregulatory mechanisms and is the most severe form of heat-related illness. Without rapid cooling, mortality exceeds 50%.",
      mechanism: "Heat stroke occurs when heat production or absorption exceeds the body's ability to dissipate heat. Classic heat stroke occurs in vulnerable populations (elderly, chronically ill) during heat waves. Exertional heat stroke occurs in healthy individuals during intense physical activity. Hyperthermia triggers widespread cellular damage, systemic inflammatory response, endothelial dysfunction, DIC, and multi-organ failure.",
      clinicalRelevance: "Heat stroke is a true medical emergency where time to cooling directly determines outcome. Paramedics must rapidly differentiate heat stroke from heat exhaustion and initiate aggressive cooling immediately. The goal is to reduce core temperature to <39°C within 30 minutes.",
      signsSymptoms: "Core temperature >40°C (104°F), altered mental status (confusion, combativeness, seizures, coma), hot skin (may be dry in classic heat stroke or wet in exertional heat stroke — sweating may still be present), tachycardia, tachypnea, hypotension, nausea/vomiting. Unlike heat exhaustion, heat stroke involves CNS dysfunction.",
      assessment: "Measure core temperature (rectal thermometer is most accurate — oral and axillary are unreliable in this setting). Assess mental status — any AMS in the setting of hyperthermia = heat stroke until proven otherwise. Assess for complications: seizures, DIC (petechiae, bleeding), rhabdomyolysis (dark urine), renal failure.",
      management: "RAPID COOLING is the priority — every minute of delay increases morbidity and mortality. Remove clothing. Evaporative cooling: spray water on skin and fan aggressively. Ice packs to groin, axillae, and neck (high blood flow areas). Cold water immersion if available (most effective). Cold IV fluids (NS bolus 1-2L). Target temp <39°C. Treat seizures with benzodiazepines. Monitor glucose. Airway management for obtunded patients.",
      complications: "Cerebral edema and permanent brain damage, DIC, rhabdomyolysis, acute kidney injury, hepatic failure, ARDS, cardiac dysrhythmias, cardiac failure, and death. Survivors may have long-term neurological deficits.",
      pearls: [
        "The key differentiator between heat exhaustion and heat stroke is altered mental status — any AMS with hyperthermia = heat stroke",
        "Cooling is MORE important than transport — initiate aggressive cooling on scene and continue during transport",
        "Do NOT give antipyretics (acetaminophen, ibuprofen) — they work on a different mechanism (hypothalamic set point) and are ineffective in heat stroke",
        "Shivering during cooling raises temperature — if shivering occurs, give a benzodiazepine to suppress it"
      ],
      pitfalls: [
        "Delaying cooling to perform other interventions — rapid cooling is the single most important treatment",
        "Using ice packs alone without evaporative cooling — evaporative cooling (water spray + fan) is more effective for large surface area cooling",
        "Giving antipyretics for heat stroke — they do not work because the thermoregulatory set point is not elevated",
        "Assuming dry skin is required for heat stroke diagnosis — sweating can still be present in exertional heat stroke"
      ],
      faq: [
        { question: "How is heat stroke different from heat exhaustion?", answer: "Heat exhaustion: temperature usually <40°C, normal mental status (may have fatigue/weakness), profuse sweating, responsive to cooling and oral hydration. Heat stroke: temperature >40°C, ALTERED MENTAL STATUS (confusion, seizures, coma), may or may not be sweating, requires aggressive cooling. The presence of CNS dysfunction is the critical differentiator." },
        { question: "What is the most effective cooling method?", answer: "Cold water immersion (covering the body in cold water) is the most effective method, reducing temperature at approximately 0.2°C/minute. When immersion is not available, evaporative cooling (spraying water on exposed skin and fanning aggressively) is the next most effective method. Ice packs to high-flow vascular areas (groin, axillae, neck) are adjunctive." },
        { question: "Why are antipyretics ineffective in heat stroke?", answer: "Antipyretics (acetaminophen, NSAIDs) work by lowering the hypothalamic thermoregulatory set point, which is elevated in fever from infection/inflammation. In heat stroke, the set point is normal — the body simply cannot dissipate heat fast enough. Antipyretics target the wrong mechanism and may cause additional hepatic injury." }
      ],
      keywords: ["heat stroke treatment paramedic", "heat stroke vs heat exhaustion", "hyperthermia management EMS", "rapid cooling heat stroke", "exertional heat stroke"],
      related: ["altered-mental-status", "seizure-management", "rhabdomyolysis", "environmental-emergencies"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Shock States (5 topics)
    // ═══════════════════════════════════════════

    {
      title: "Shock Assessment and Classification",
      category: "Shock States",
      overview: "Shock is a state of inadequate tissue perfusion resulting in cellular hypoxia and organ dysfunction. It is classified into four main types: hypovolemic, cardiogenic, distributive, and obstructive. Each type has distinct pathophysiology, presentation, and treatment. The paramedic's ability to rapidly classify and treat shock directly impacts survival.",
      mechanism: "Cellular hypoxia results from inadequate oxygen delivery (DO2) to meet tissue metabolic demand. DO2 depends on cardiac output (CO) and arterial oxygen content. Shock occurs when one or more components fail: preload (volume), pump (heart), afterload/vascular tone (SVR), or oxygen-carrying capacity (hemoglobin). Compensatory mechanisms include tachycardia, vasoconstriction, and catecholamine release.",
      clinicalRelevance: "Shock recognition and classification drives treatment decisions. Giving fluids to cardiogenic shock worsens pulmonary edema; withholding fluids from hypovolemic shock worsens hypoperfusion. The ability to rapidly identify the shock type and initiate appropriate treatment is a defining paramedic skill.",
      signsSymptoms: "General shock signs: tachycardia, tachypnea, hypotension (LATE sign), altered mental status, cool/clammy skin (except distributive — warm/flushed early), delayed capillary refill, weak peripheral pulses, oliguria. Compensated shock: normal BP but tachycardia and poor perfusion. Decompensated shock: hypotension with signs of poor end-organ perfusion.",
      assessment: "Identify shock: altered mental status + tachycardia + poor perfusion. Classify type: Hypovolemic (hemorrhage, dehydration — flat neck veins, clear lungs). Cardiogenic (MI, CHF — JVD, crackles, edema). Distributive (sepsis, anaphylaxis, neurogenic — warm skin early, specific history). Obstructive (PE, tamponade, tension pneumothorax — JVD, specific physical findings).",
      management: "Hypovolemic: fluid resuscitation, hemorrhage control, blood products. Cardiogenic: vasopressors (norepinephrine), avoid fluids, treat underlying cause (MI → PCI). Distributive: fluids (30 mL/kg for sepsis), vasopressors, treat cause (epinephrine for anaphylaxis). Obstructive: treat the obstruction (needle decompression for tension pneumo, thrombolytics for massive PE, pericardiocentesis for tamponade). ALL: oxygen, IV access, monitoring.",
      complications: "Multi-organ failure, ARDS, acute kidney injury, DIC, irreversible shock (cellular damage too severe for recovery despite treatment restoration), and death. The transition from compensated to decompensated shock can be sudden, especially in pediatric and young adult patients.",
      pearls: [
        "Tachycardia is often the EARLIEST sign of shock — hypotension is a LATE sign indicating decompensation",
        "Young patients compensate well — they can maintain normal blood pressure until suddenly decompensating with cardiovascular collapse",
        "The skin assessment is one of the most reliable shock indicators: cool/clammy = hypovolemic/cardiogenic, warm/flushed = distributive",
        "Shock index (HR/SBP) >1.0 suggests significant shock even when individual vital signs appear borderline"
      ],
      pitfalls: [
        "Waiting for hypotension to diagnose shock — by the time BP drops, the patient has lost significant compensatory reserve",
        "Treating all shock the same way (fluid bolus) — cardiogenic shock worsens with fluids",
        "Attributing tachycardia to pain or anxiety without considering shock — always assess perfusion when tachycardic",
        "Missing the transition from compensated to decompensated shock — serial assessments are critical"
      ],
      faq: [
        { question: "What are the four types of shock?", answer: "Hypovolemic (blood/fluid loss), Cardiogenic (pump failure), Distributive (inappropriate vasodilation — septic, anaphylactic, neurogenic), and Obstructive (mechanical obstruction to circulation — tension pneumothorax, cardiac tamponade, massive PE). Each has distinct pathophysiology and treatment." },
        { question: "What is the shock index and how is it used?", answer: "Shock index = Heart Rate / Systolic Blood Pressure. Normal is 0.5-0.7. A ratio >0.9 suggests clinically significant shock. A ratio >1.0 strongly suggests the need for aggressive intervention. It is more sensitive than individual vital signs for detecting early hemorrhage." },
        { question: "How do you differentiate compensated from decompensated shock?", answer: "Compensated shock: blood pressure is maintained through tachycardia and vasoconstriction, but signs of poor perfusion exist (delayed cap refill, cool extremities, tachycardia, anxiety). Decompensated shock: compensatory mechanisms fail, BP drops, mental status deteriorates, perfusion worsens. The transition can be sudden." }
      ],
      keywords: ["shock classification paramedic", "types of shock assessment", "shock index calculation", "compensated vs decompensated shock", "shock management EMS"],
      related: ["hemorrhagic-shock", "cardiogenic-shock", "sepsis-and-septic-shock", "anaphylaxis", "tension-pneumothorax"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Operations & Triage (8 topics)
    // ═══════════════════════════════════════════

    {
      title: "START Triage System",
      category: "Operations & Triage",
      overview: "Simple Triage and Rapid Treatment (START) is the most widely used mass casualty incident (MCI) triage system in the United States. It allows rapid categorization of patients into four groups based on a 30-60 second assessment. START prioritizes 'the greatest good for the greatest number' rather than intensive treatment of individual patients.",
      mechanism: "START uses a three-step assessment algorithm: (1) Can the patient walk? → Minor (Green). (2) Assess RPM: Respirations → present/absent, rate. Perfusion → radial pulse/cap refill. Mental status → follows commands. Based on these three assessments, patients are categorized as Immediate (Red), Delayed (Yellow), Minor (Green), or Deceased/Expectant (Black).",
      clinicalRelevance: "Mass casualty triage is a mandatory paramedic competency. MCIs require a paradigm shift from individual patient-focused care to population-based resource allocation. Understanding and applying START triage rapidly and accurately can save the most lives with limited resources.",
      signsSymptoms: "START assessment criteria: Respirations absent after repositioning = Black (Deceased). Respirations >30/min = Red (Immediate). No radial pulse or cap refill >2 seconds = Red (Immediate). Does not follow simple commands = Red (Immediate). All three parameters normal but cannot walk = Yellow (Delayed). Can walk = Green (Minor).",
      assessment: "Step 1: Direct all walking wounded to a designated area → tag Green (Minor). Step 2: Assess remaining patients using RPM: R = Respirations (present? If not, reposition airway — still no? → Black. If yes, rate >30? → Red). P = Perfusion (radial pulse absent or cap refill >2 sec? → Red. Control major bleeding). M = Mental status (cannot follow commands? → Red). If all three normal → Yellow (Delayed).",
      management: "Triage is assessment, NOT treatment. The only interventions during START triage are: repositioning the airway (one attempt), controlling life-threatening hemorrhage (tourniquet, direct pressure). All other treatment is deferred until triage is complete and resources are allocated. Tag patients with triage tags and move to assigned treatment areas.",
      complications: "Under-triage (categorizing critical patients as less urgent) can cause preventable deaths. Over-triage (categorizing minor patients as critical) wastes resources. Emotional difficulty of 'walking past' severely injured patients. Failure to re-triage as conditions change. Provider stress from making life-and-death resource allocation decisions.",
      pearls: [
        "START triage is ASSESSMENT, not treatment — do not stop to provide extended care to any single patient during triage",
        "The only interventions during START are: open the airway (one attempt) and control major hemorrhage",
        "Walking wounded go to Green — this immediately removes a large number of patients from the triage area",
        "Triage categories are dynamic — patients should be re-triaged at treatment areas as conditions change"
      ],
      pitfalls: [
        "Stopping to treat individual patients during the triage phase — this delays triage of remaining patients",
        "Not performing the 'walking wounded' step first — this efficiently categorizes many patients at once",
        "Over-triaging — categorizing too many patients as Immediate overwhelms the Red treatment area",
        "Emotional attachment preventing categorization of expectant (Black) patients — the system requires objective application"
      ],
      faq: [
        { question: "What are the START triage categories?", answer: "Red (Immediate): life-threatening conditions treatable with immediate intervention. Yellow (Delayed): serious injuries but can wait for treatment. Green (Minor): walking wounded with minor injuries. Black (Deceased/Expectant): dead or injuries incompatible with survival given available resources." },
        { question: "What is the RPM assessment?", answer: "R = Respirations: Present? Rate? >30/min = Red. P = Perfusion: Radial pulse present? Cap refill <2 seconds? Absent pulse or delayed refill = Red. M = Mental status: Can follow simple commands? Unable = Red. If all three are normal and the patient cannot walk = Yellow." },
        { question: "When should START triage be initiated?", answer: "START triage should be initiated when the number of patients exceeds available EMS resources — the point at which the MCI is declared. The first arriving paramedic typically assumes triage officer role until relieved. Triage begins by directing walking wounded to Green area, then systematically assessing remaining patients." }
      ],
      keywords: ["START triage system", "mass casualty triage paramedic", "MCI triage algorithm", "RPM triage assessment", "triage categories EMS"],
      related: ["mass-casualty-incident", "hemorrhagic-shock", "tourniquet-application", "incident-command-system"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Respiratory Emergencies (8 topics)
    // ═══════════════════════════════════════════

    {
      title: "Pulmonary Embolism",
      category: "Respiratory Emergencies",
      overview: "Pulmonary embolism (PE) is the obstruction of pulmonary arterial vasculature by a thrombus, most commonly originating from deep vein thrombosis (DVT) in the lower extremities. PE ranges from clinically insignificant small emboli to massive PE causing sudden cardiovascular collapse and death. It is a commonly missed diagnosis with high mortality if untreated.",
      mechanism: "Thrombus from the deep veins travels through the right heart and lodges in the pulmonary arterial system. This causes mechanical obstruction reducing the cross-sectional area of the pulmonary vascular bed, increasing right ventricular afterload. Large or multiple emboli can cause acute right heart failure, hemodynamic collapse, and cardiac arrest. Additionally, PE causes V/Q mismatch (ventilated but unperfused alveoli), resulting in hypoxemia.",
      clinicalRelevance: "PE is one of the most commonly missed life-threatening diagnoses in emergency medicine. Prehospital providers must maintain a high index of suspicion, especially in patients with risk factors. PE is one of the reversible T's in cardiac arrest (Thrombosis).",
      signsSymptoms: "Dyspnea (most common), pleuritic chest pain, tachycardia, tachypnea, cough, hemoptysis, unilateral leg swelling (DVT), anxiety, syncope. Massive PE: sudden cardiovascular collapse, severe hypotension, right heart failure (JVD), cyanosis, cardiac arrest (PEA). Classic triad (dyspnea, pleuritic chest pain, hemoptysis) is present in <20% of cases.",
      assessment: "Risk factor assessment (Virchow's triad): stasis (immobilization, recent surgery, long travel), hypercoagulability (cancer, pregnancy, oral contraceptives, genetic disorders), endothelial injury (recent surgery, trauma). Wells criteria can help stratify risk. ECG findings: sinus tachycardia (most common), S1Q3T3 (classic but uncommon), right heart strain pattern, new RBBB. Normal SpO2 does NOT rule out PE.",
      management: "High-flow O2. IV access. Continuous monitoring. Treat hypotension with IV fluid bolus (250-500 mL — cautious, as RV is already overloaded). Vasopressors for refractory hypotension. For massive PE with cardiac arrest or imminent arrest: consider thrombolytics (tPA) per protocol — massive PE is one of the few indications for prehospital thrombolytics. CPR for arrest. Rapid transport to facility capable of interventional radiology or surgical embolectomy.",
      complications: "Cardiovascular collapse, right heart failure, cardiac arrest (PEA most common), post-PE pulmonary hypertension, recurrent PE, death. Thrombolytic complications include intracranial hemorrhage.",
      pearls: [
        "A normal SpO2 does NOT rule out PE — patients can have significant PE with normal oxygen saturation",
        "The most common ECG finding in PE is sinus tachycardia — the classic S1Q3T3 pattern is present in only 20% of cases",
        "PE is a T in the H's and T's of cardiac arrest — consider it in any unexplained PEA arrest, especially with risk factors",
        "Thrombolytics may be considered for massive PE causing cardiac arrest or peri-arrest — this is a true last-resort intervention"
      ],
      pitfalls: [
        "Ruling out PE because SpO2 is normal — PE can present with normal oxygen saturation",
        "Not considering PE in unexplained tachycardia or syncope — PE is a great mimicker",
        "Aggressive fluid resuscitation in right heart failure from PE — the RV is already volume-overloaded; large fluid boluses worsen RV dilation",
        "Missing PE as a cause of PEA arrest — always consider PE in unexplained PEA, especially with risk factors"
      ],
      faq: [
        { question: "What is Virchow's triad?", answer: "Virchow's triad describes the three categories of risk factors for DVT/PE: Venous stasis (immobility, long travel, bedrest), Hypercoagulability (cancer, pregnancy, oral contraceptives, clotting disorders), and Endothelial injury (surgery, trauma, central line). The presence of one or more factors increases PE risk." },
        { question: "What is the S1Q3T3 pattern?", answer: "S1Q3T3 is a classic but uncommon ECG pattern associated with acute PE: a prominent S wave in Lead I, a Q wave in Lead III, and an inverted T wave in Lead III. It reflects acute right heart strain. While classic, it is present in only ~20% of PE cases. Sinus tachycardia is far more common." },
        { question: "When should thrombolytics be considered for PE?", answer: "Thrombolytics (tPA) should be considered for massive PE causing hemodynamic collapse (sustained hypotension or cardiac arrest) when the diagnosis is strongly suspected. In cardiac arrest from suspected PE, thrombolytics may be given empirically. CPR should continue for at least 60-90 minutes after thrombolytic administration." }
      ],
      keywords: ["pulmonary embolism paramedic", "PE signs symptoms", "massive PE treatment", "DVT pulmonary embolism", "S1Q3T3 ECG pattern"],
      related: ["pulseless-electrical-activity", "shock-assessment-and-classification", "chest-pain-assessment", "cardiac-arrest-management"]
    },

    {
      title: "Pneumonia",
      category: "Respiratory Emergencies",
      overview: "Pneumonia is an infection of the lung parenchyma causing inflammation and consolidation of the alveoli. It ranges from mild, outpatient-manageable illness to severe, life-threatening sepsis with respiratory failure. Pneumonia is a leading cause of hospitalization and a common trigger for respiratory distress calls to EMS.",
      mechanism: "Infectious organisms (bacteria, viruses, fungi) reach the lower respiratory tract through aspiration, inhalation, or hematogenous spread. The infection triggers an inflammatory response with neutrophil infiltration, edema, and exudate filling the alveoli. This consolidation impairs gas exchange, creating intrapulmonary shunt (perfused but unventilated alveoli). Common bacterial causes include Streptococcus pneumoniae, Haemophilus influenzae, and Staphylococcus aureus.",
      clinicalRelevance: "Pneumonia is a frequent cause of EMS calls, especially in elderly and immunocompromised patients. Severe pneumonia can rapidly progress to sepsis and respiratory failure. Prehospital management focuses on oxygenation, ventilation support, and recognition of sepsis.",
      signsSymptoms: "Cough (productive with purulent sputum in bacterial pneumonia), fever, chills, dyspnea, pleuritic chest pain, tachypnea, tachycardia. Auscultation: crackles/rales, decreased breath sounds over consolidated area, bronchial breath sounds, egophony ('E to A' change). Elderly patients may present atypically: confusion, falls, functional decline without classic respiratory symptoms.",
      assessment: "Vital signs including temperature and SpO2. Auscultation for crackles, decreased breath sounds, and bronchial breathing. Assess severity using qSOFA (altered mental status, RR ≥22, SBP ≤100) to identify sepsis. Blood glucose. 12-lead ECG (especially in elderly — pneumonia can trigger ACS or dysrhythmias).",
      management: "Supplemental O2 to maintain SpO2 >94% (88-92% for COPD patients). Position of comfort (usually upright). CPAP for significant respiratory distress. IV access and fluid resuscitation if signs of sepsis. Monitor for deterioration. Prepare for advanced airway if respiratory failure develops. Antipyretics for comfort. Prehospital antibiotics per protocol (rare but some systems authorize).",
      complications: "Sepsis and septic shock, respiratory failure requiring intubation, empyema (pus in pleural space), lung abscess, ARDS, parapneumonic effusion, bacteremia, multi-organ failure, and death. Aspiration pneumonia carries additional risk of chemical pneumonitis.",
      pearls: [
        "Elderly patients with pneumonia may present with confusion or falls rather than classic fever and cough — maintain high suspicion",
        "Pneumonia is the most common trigger for sepsis — always screen for sepsis in pneumonia patients",
        "Crackles that persist after coughing suggest consolidation (pneumonia) rather than transient atelectasis",
        "CPAP can provide significant respiratory support and may prevent intubation in moderate-severe pneumonia"
      ],
      pitfalls: [
        "Attributing confusion in elderly patients to 'just being old' without considering pneumonia as a cause",
        "Not screening for sepsis — pneumonia-induced sepsis is common and requires aggressive fluid resuscitation",
        "Missing aspiration pneumonia in patients with swallowing difficulties, altered mental status, or recent vomiting",
        "Diagnosing pneumonia when the actual diagnosis is CHF exacerbation — both cause crackles; look for JVD and edema"
      ],
      faq: [
        { question: "How is pneumonia differentiated from CHF on exam?", answer: "Pneumonia: fever, productive cough, unilateral crackles, no JVD, no peripheral edema. CHF: bilateral crackles, JVD, peripheral edema, orthopnea, history of heart disease, S3 gallop. Both can cause dyspnea, tachycardia, and crackles. In practice, both can coexist in elderly patients." },
        { question: "What makes aspiration pneumonia different?", answer: "Aspiration pneumonia results from inhalation of oropharyngeal or gastric contents into the lungs. It typically affects dependent lung segments (right lower lobe when supine). Risk factors include altered consciousness, dysphagia, alcoholism, and recent vomiting. The aspirated material causes both chemical pneumonitis and bacterial infection." },
        { question: "When is CPAP indicated for pneumonia?", answer: "CPAP is indicated for pneumonia with moderate-severe respiratory distress: SpO2 <90% despite supplemental O2, respiratory rate >25, accessory muscle use, or inability to speak full sentences. CPAP recruits atelectatic alveoli, improves V/Q matching, and reduces the work of breathing. It may prevent the need for intubation." }
      ],
      keywords: ["pneumonia assessment paramedic", "community acquired pneumonia EMS", "pneumonia vs CHF", "aspiration pneumonia prehospital", "pneumonia sepsis"],
      related: ["sepsis-and-septic-shock", "continuous-positive-airway-pressure", "respiratory-distress-assessment", "copd-exacerbation"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Behavioral Emergencies (5 topics)
    // ═══════════════════════════════════════════

    {
      title: "Excited Delirium",
      category: "Behavioral Emergencies",
      overview: "Excited delirium syndrome (ExDS) is a controversial but clinically recognized condition characterized by extreme agitation, violent behavior, hyperthermia, and extraordinary physical strength, often followed by sudden cardiac arrest. While debated as a formal diagnosis, the clinical presentation is well-documented and requires specific management to prevent death.",
      mechanism: "ExDS is associated with a massive catecholamine surge (dopamine and norepinephrine) causing extreme sympathetic activation. Common associations include stimulant drug use (cocaine, methamphetamine, synthetic cathinones), psychiatric illness, and alcohol withdrawal. The catecholamine surge causes tachycardia, hyperthermia, metabolic acidosis, rhabdomyolysis, and ultimately fatal cardiac dysrhythmia.",
      clinicalRelevance: "ExDS represents one of the highest-risk prehospital encounters. Patients are at extreme risk of sudden death, and the paramedic must balance patient safety, crew safety, and appropriate medical management. Understanding the pathophysiology guides treatment decisions and may prevent cardiac arrest.",
      signsSymptoms: "Extreme agitation, violent/bizarre behavior, paranoia, shouting/incoherent speech, disrobing (inability to thermoregulate), profound diaphoresis, hyperthermia (often >40°C), extraordinary physical strength and endurance, insensitivity to pain (including OC spray and TASER), dilated pupils, tachycardia, rapid breathing.",
      assessment: "Scene safety is paramount — law enforcement must secure the patient before medical assessment. Once safe: assess level of consciousness, vital signs (especially temperature), cardiac rhythm, SpO2, blood glucose. Assess for trauma (from altercations or falls). Continuous cardiac monitoring is essential due to high risk of sudden cardiac arrest.",
      management: "Scene safety and law enforcement coordination. Chemical sedation is the PRIMARY medical intervention: Midazolam 5-10mg IM or Ketamine 4-5 mg/kg IM (preferred in many systems due to rapid onset). Minimize physical restraint duration — prone positioning increases mortality risk. Active cooling (remove clothing, ice packs, cool fluids). IV fluid resuscitation. Continuous cardiac monitoring. Prepare for cardiac arrest. Treat rhabdomyolysis with aggressive hydration.",
      complications: "Sudden cardiac arrest (most feared complication), hyperthermia causing multi-organ failure, rhabdomyolysis and acute renal failure, metabolic acidosis, DIC, positional asphyxia (from prone restraint), injury to patient and providers during restraint, and death.",
      pearls: [
        "ExDS is a MEDICAL emergency, not just a behavioral problem — these patients need chemical sedation, not just physical restraint",
        "Ketamine IM is increasingly the preferred sedation agent — rapid onset, reliable absorption, and it does not cause the respiratory depression seen with benzodiazepines",
        "Prone positioning should be minimized — it impairs breathing and is associated with sudden death in restrained patients",
        "Once sedated, actively cool the patient and aggressively hydrate — hyperthermia and rhabdomyolysis are the primary killers"
      ],
      pitfalls: [
        "Relying solely on physical restraint without chemical sedation — physical restraint alone increases metabolic demand and mortality risk",
        "Keeping the patient in prone position — this increases risk of positional asphyxia and should be avoided once patient is secured",
        "Not monitoring for cardiac arrest — sudden cardiac arrest is the hallmark complication and can occur at any time",
        "Attributing the presentation to 'just being on drugs' — ExDS requires aggressive medical management regardless of the underlying cause"
      ],
      faq: [
        { question: "What is the preferred sedation agent for excited delirium?", answer: "Ketamine 4-5 mg/kg IM is preferred in many systems due to rapid onset (3-5 minutes IM), reliable absorption, bronchodilation, and maintenance of respiratory drive. Midazolam 5-10mg IM is an alternative. The key is rapid chemical sedation to reduce the dangerous catecholamine surge and allow safe patient management." },
        { question: "Why is prone positioning dangerous?", answer: "Prone positioning with weight on the chest or back restricts chest wall expansion, reducing tidal volume. Combined with the extreme metabolic demand of agitation and struggling, this can cause respiratory failure and cardiac arrest (positional asphyxia). Once secured, the patient should be placed supine or in the recovery position." },
        { question: "Why do patients with excited delirium die suddenly?", answer: "The massive catecholamine surge causes severe hyperthermia, metabolic acidosis, hyperkalemia, and rhabdomyolysis. These metabolic derangements, combined with direct catecholamine cardiotoxicity, create an extremely arrhythmogenic state. Ventricular fibrillation or PEA arrest can occur suddenly, especially during or shortly after physical restraint." }
      ],
      keywords: ["excited delirium syndrome", "ExDS management paramedic", "ketamine excited delirium", "agitated patient sedation", "sudden death excited delirium"],
      related: ["cardiac-arrest-management", "heat-stroke", "toxicology-assessment", "behavioral-emergency-assessment"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Neurological Emergencies (5 topics)
    // ═══════════════════════════════════════════

    {
      title: "Increased Intracranial Pressure",
      category: "Neurological Emergencies",
      overview: "Increased intracranial pressure (ICP) is a rise in pressure within the rigid cranial vault that compromises cerebral perfusion and can lead to brain herniation and death. It is most commonly encountered in the prehospital setting with traumatic brain injury, stroke, and intracranial hemorrhage.",
      mechanism: "The Monro-Kellie doctrine states that the skull is a rigid container with a fixed volume occupied by brain tissue (80%), blood (10%), and cerebrospinal fluid (10%). An increase in any one component must be compensated by a decrease in the others. When compensatory mechanisms are exhausted, ICP rises rapidly, reducing cerebral perfusion pressure (CPP = MAP - ICP) and causing ischemia. Herniation occurs when brain tissue is displaced through anatomical openings.",
      clinicalRelevance: "Recognition and management of increased ICP is critical for paramedics managing TBI and stroke patients. Preventing secondary brain injury through maintenance of adequate cerebral perfusion is the primary prehospital goal.",
      signsSymptoms: "Early: headache, nausea/vomiting (often projectile), altered mental status, papilledema (not assessable in field). Late: Cushing's triad (hypertension with widened pulse pressure, bradycardia, irregular respirations), unilateral pupil dilation (ipsilateral to lesion — uncal herniation compresses CN III), posturing (decorticate → decerebrate), loss of brainstem reflexes, coma.",
      assessment: "Serial GCS assessments — any decline suggests increasing ICP. Pupil assessment: unilateral fixed, dilated pupil is the hallmark of uncal herniation. Cushing's triad (late sign). Vital signs: look for hypertension with bradycardia pattern. Motor assessment: posturing suggests severe brain injury.",
      management: "Maintain CPP: keep SBP >90 mmHg (>100 preferred). Maintain normoxia: SpO2 >94%. Normoventilation: ETCO2 35-40 mmHg. Elevate head of stretcher 30 degrees. Keep head midline (avoid jugular vein compression). Treat pain and agitation (increase ICP). If herniation signs present: brief hyperventilation (ETCO2 30-35 mmHg), mannitol 0.5-1 g/kg IV or hypertonic saline (3% NaCl 250 mL) per protocol. Rapid transport to neurosurgical-capable facility.",
      complications: "Brain herniation syndromes: uncal (CN III compression → pupil dilation, contralateral hemiparesis), central (rostral-to-caudal deterioration), tonsillar (brainstem compression → respiratory arrest). Herniation is often irreversible and fatal without emergent surgical decompression.",
      pearls: [
        "A dilating pupil ipsilateral to a head injury is a sign of uncal herniation — this is a neurosurgical emergency",
        "Cushing's triad (hypertension, bradycardia, irregular breathing) is a LATE sign — intervention should occur before this develops",
        "Head elevation to 30 degrees improves venous drainage from the brain and can reduce ICP by 5-8 mmHg",
        "Hyperventilation is a TEMPORIZING measure for active herniation only — routine hyperventilation in TBI is harmful"
      ],
      pitfalls: [
        "Routine hyperventilation in TBI — this reduces cerebral blood flow and worsens ischemia; use only for active herniation signs",
        "Allowing hypotension — even a single episode of SBP <90 doubles mortality in TBI/increased ICP",
        "Not performing serial neurological assessments — a declining GCS is the earliest indicator of increasing ICP",
        "Attributing a dilating pupil to medication or eye injury without considering herniation"
      ],
      faq: [
        { question: "What is Cushing's triad?", answer: "Cushing's triad is the combination of hypertension (with widened pulse pressure), bradycardia, and irregular (Cheyne-Stokes or ataxic) respirations. It occurs as a result of brainstem compression from increasing ICP. It is a late, pre-terminal finding indicating imminent brainstem herniation and death without intervention." },
        { question: "When should hyperventilation be used for increased ICP?", answer: "Hyperventilation (target ETCO2 30-35 mmHg) should ONLY be used as a temporizing measure when there are signs of active brain herniation: unilateral fixed, dilated pupil, posturing, or acute decline in GCS. It works by causing cerebral vasoconstriction, transiently reducing cerebral blood volume and ICP. It should not be used routinely." },
        { question: "What is cerebral perfusion pressure?", answer: "CPP = Mean Arterial Pressure (MAP) - Intracranial Pressure (ICP). CPP represents the pressure gradient driving blood flow to the brain. Normal CPP is 60-70 mmHg. When ICP rises and/or MAP drops, CPP decreases, causing cerebral ischemia. Prehospital management focuses on maintaining MAP (keeping SBP >90-100) while interventions to lower ICP are limited." }
      ],
      keywords: ["increased intracranial pressure paramedic", "ICP management prehospital", "Cushing triad", "brain herniation signs", "cerebral perfusion pressure"],
      related: ["traumatic-brain-injury", "stroke-assessment-and-management", "hemorrhagic-stroke", "seizure-management"]
    },

    // ═══════════════════════════════════════════
    // ADDITIONAL TOPICS to reach 200+
    // ═══════════════════════════════════════════

    {
      title: "Pelvic Fracture",
      category: "Trauma",
      overview: "Pelvic fractures are among the most dangerous musculoskeletal injuries in trauma, capable of producing massive, life-threatening hemorrhage. The pelvis is surrounded by a rich venous plexus and branches of the internal iliac arteries. Disruption of the pelvic ring can cause hemorrhage of several liters, and prehospital management focuses on hemorrhage control through pelvic binding and appropriate fluid resuscitation.",
      mechanism: "High-energy mechanisms (MVCs, falls from height, motorcycle crashes, pedestrian strikes) cause pelvic ring disruption. Three main patterns: lateral compression (most common, side-impact MVC), AP compression (head-on MVC, crush), and vertical shear (fall from height). AP compression ('open-book') fractures cause the greatest hemorrhage because they increase pelvic volume, disrupting venous plexus tamponade.",
      clinicalRelevance: "Pelvic fractures are a major source of occult hemorrhage in trauma. Prehospital pelvic binding can be life-saving by reducing pelvic volume and tamponading hemorrhage. This is a critical intervention that cannot be replicated at the hospital.",
      signsSymptoms: "Pelvic pain, inability to bear weight, ecchymosis over pelvis/perineum/scrotum, leg length discrepancy, external rotation of the lower extremity, perineal hematoma, blood at urethral meatus (urethral injury), hemodynamic instability out of proportion to visible injuries.",
      assessment: "Do NOT repeatedly 'rock' the pelvis — this disrupts any clot formation. A SINGLE gentle compression test may identify instability. Assess for hemorrhagic shock: tachycardia, hypotension, altered mental status. Assess for associated injuries: bladder/urethral injury, lower extremity neurovascular status.",
      management: "Apply pelvic binder or improvised sheet wrap at the level of the greater trochanters (not the iliac crests). Tighten to reduce pelvic volume without over-compressing. IV access with permissive hypotension strategy (SBP 80-90, unless TBI present). TXA 1g IV if within 3 hours. Rapid transport to trauma center. Do NOT remove pelvic binder once applied.",
      complications: "Massive hemorrhage and hemorrhagic shock, associated bladder/urethral injuries, rectal injuries, open pelvic fractures (high mortality), DVT/PE, fat embolism, and long-term disability.",
      pearls: [
        "The pelvic binder goes at the GREATER TROCHANTERS (femoral level), not the iliac crests — proper placement is critical for effective hemorrhage control",
        "Do NOT repeatedly 'rock' the pelvis to assess stability — this disrupts clot formation and can worsen hemorrhage",
        "An unstable pelvis with hypotension = massive hemorrhage until proven otherwise",
        "A bed sheet folded and wrapped tightly around the pelvis is an effective improvised pelvic binder"
      ],
      pitfalls: [
        "Placing the pelvic binder at the wrong level (iliac crests instead of greater trochanters)",
        "Repeatedly compressing the pelvis to 'check stability' — this worsens bleeding",
        "Over-resuscitating with crystalloid — permissive hypotension limits ongoing hemorrhage",
        "Not suspecting pelvic fracture in a hemodynamically unstable patient without obvious external hemorrhage"
      ],
      faq: [
        { question: "Where should the pelvic binder be placed?", answer: "At the level of the greater trochanters of the femur (hip joint level), NOT the iliac crests. This position provides optimal compression of the pelvic ring and reduces the pelvic volume most effectively. Placement too high (at iliac crests) does not achieve adequate reduction." },
        { question: "When should a pelvic binder be applied?", answer: "Apply whenever pelvic fracture is suspected based on mechanism (high-energy impact), physical findings (pelvic pain, instability, leg length discrepancy), or hemodynamic instability without another obvious source. Early application is key — it is easier to remove an unnecessary binder than to replace lost blood." },
        { question: "How much blood can a pelvic fracture cause?", answer: "Pelvic fractures can cause 1-4+ liters of hemorrhage into the retroperitoneal space. The rich venous plexus surrounding the pelvis and branches of the internal iliac arteries are commonly disrupted. This hemorrhage is not externally visible and can rapidly cause Class III-IV hemorrhagic shock." }
      ],
      keywords: ["pelvic fracture management", "pelvic binder placement", "pelvic hemorrhage trauma", "pelvic ring injury EMS", "SAM pelvic sling"],
      related: ["hemorrhagic-shock", "tourniquet-application", "tranexamic-acid", "abdominal-trauma"]
    },

    {
      title: "Tranexamic Acid",
      category: "Pharmacology",
      overview: "Tranexamic acid (TXA) is an antifibrinolytic medication that prevents the breakdown of blood clots. When given within 3 hours of traumatic hemorrhage, it reduces mortality by inhibiting plasmin-mediated fibrinolysis. TXA has become a standard component of prehospital hemorrhage management protocols.",
      mechanism: "TXA is a synthetic analog of the amino acid lysine. It binds to lysine-binding sites on plasminogen and plasmin, preventing plasmin from binding to and degrading fibrin clots. This stabilizes existing clots and reduces ongoing hemorrhage. It does NOT promote new clot formation — it protects clots that have already formed.",
      clinicalRelevance: "The CRASH-2 trial demonstrated a significant reduction in mortality when TXA was administered within 3 hours of traumatic hemorrhage. This has led to widespread adoption in prehospital trauma protocols. The critical factor is early administration — TXA given >3 hours after injury may increase mortality.",
      signsSymptoms: "Not applicable — TXA is a treatment medication indicated for traumatic hemorrhage.",
      assessment: "TXA is indicated when significant traumatic hemorrhage is suspected or present AND the injury occurred within 3 hours. Signs include: hemorrhagic shock (tachycardia, hypotension), significant external hemorrhage, suspected internal hemorrhage (abdominal distension, pelvic instability, femur fractures), and mechanism consistent with major hemorrhage.",
      management: "Dose: 1g IV over 10 minutes (or per protocol — some systems authorize IV push in arrest). Must be given within 3 hours of injury — benefit decreases with time, and administration after 3 hours may be harmful. Second dose of 1g can be given over 8 hours at the hospital. TXA can also be given IM (1g) if IV access is delayed.",
      complications: "Generally well-tolerated. Potential complications include nausea, vomiting, diarrhea, hypotension if given too rapidly IV, seizures (rare, high-dose), and theoretically increased thrombotic risk (DVT/PE — but not supported by evidence at standard doses). The most important risk is administration after 3 hours, which is associated with increased mortality.",
      pearls: [
        "The 3-hour window is CRITICAL — TXA administered after 3 hours from injury may increase mortality",
        "TXA does not create clots — it prevents existing clots from being broken down by the fibrinolytic system",
        "TXA is safe, inexpensive, and easy to administer — it should be given early when indicated",
        "TXA is NOT a substitute for hemorrhage control — it complements tourniquets, packing, and fluid resuscitation"
      ],
      pitfalls: [
        "Administering TXA more than 3 hours after injury — this is associated with INCREASED mortality",
        "Using TXA as a reason to delay definitive hemorrhage control — physical hemorrhage control remains the priority",
        "Giving TXA too rapidly IV — bolus administration can cause hypotension; infuse over 10 minutes",
        "Forgetting to administer TXA when indicated — it is often overlooked in the chaos of trauma resuscitation"
      ],
      faq: [
        { question: "What is the evidence for TXA in trauma?", answer: "The CRASH-2 trial (20,000+ patients) showed TXA given within 3 hours of trauma reduces all-cause mortality by approximately 10% and hemorrhage-related death by approximately 15%. Benefit was greatest when given within 1 hour. Administration after 3 hours increased mortality. This led to global adoption in trauma protocols." },
        { question: "When should TXA be administered?", answer: "Give TXA when significant traumatic hemorrhage is suspected or present, AND the injury occurred within 3 hours. Earlier is better — the greatest benefit is within 1 hour of injury. Do not delay other interventions to give TXA, but administer as soon as IV/IO access is established." },
        { question: "Can TXA be given intramuscularly?", answer: "Yes, TXA 1g can be given IM if IV access is delayed. Some military and civilian protocols include IM TXA as a first-line route to avoid delays in administration. Absorption is somewhat slower than IV, but the early administration compensates for the route difference." }
      ],
      keywords: ["tranexamic acid trauma", "TXA prehospital protocol", "CRASH-2 trial TXA", "antifibrinolytic hemorrhage", "TXA timing window"],
      related: ["hemorrhagic-shock", "tourniquet-application", "pelvic-fracture", "traumatic-cardiac-arrest"]
    },

    {
      title: "Neonatal Resuscitation",
      category: "Pediatric Emergencies",
      overview: "Neonatal resuscitation is the systematic approach to supporting a newborn who does not transition successfully from intrauterine to extrauterine life. Approximately 10% of newborns require some intervention at birth, and about 1% require extensive resuscitation. The NRP (Neonatal Resuscitation Program) algorithm guides this process.",
      mechanism: "At birth, the lungs must transition from fluid-filled to air-filled, and pulmonary vascular resistance must decrease to establish pulmonary blood flow. Failure to establish adequate respirations leads to persistent hypoxia, bradycardia, and potentially cardiac arrest. The most critical intervention is establishing effective ventilation — this alone resolves most neonatal emergencies.",
      clinicalRelevance: "While full neonatal resuscitation is uncommon in the field, paramedics must be prepared for it during emergency deliveries. The NRP algorithm differs significantly from adult and pediatric resuscitation — the emphasis is on ventilation rather than compressions, and oxygen titration is important.",
      signsSymptoms: "Assessment at birth: vigorous cry/breathing, good muscle tone, term gestation → routine care. Apnea or gasping, poor tone, preterm → initiate NRP algorithm. Heart rate <100 bpm despite stimulation → positive pressure ventilation needed. Heart rate <60 bpm despite effective ventilation → chest compressions needed.",
      assessment: "Initial assessment within 30 seconds: Is the baby term? Good tone? Breathing or crying? If yes to all → routine care (dry, warm, stimulate, assess). If any is no → warm, dry, stimulate, position airway, suction if needed, assess breathing and heart rate. APGAR scores at 1 and 5 minutes.",
      management: "First 60 seconds (Golden Minute): warm, dry, stimulate, position airway (slight neck extension — 'sniffing position'), suction only if airway is obstructed. If apneic or HR <100 → positive pressure ventilation (PPV) at 40-60 breaths/min with room air (21% O2) initially, titrate up as needed. If HR <60 after 30 seconds of effective PPV → start compressions (3:1 ratio with ventilations, rate 120 events/min). Epinephrine 0.01-0.03 mg/kg IV/UVC if HR <60 despite compressions.",
      complications: "Hypothermia (the most common preventable complication), hypoglycemia, persistent pulmonary hypertension, meconium aspiration syndrome, pneumothorax from aggressive ventilation, and hypoxic-ischemic encephalopathy. Temperature management is critical — even mild hypothermia significantly worsens outcomes.",
      pearls: [
        "VENTILATION is the single most important intervention in neonatal resuscitation — most neonates respond to effective PPV alone",
        "Room air (21% O2) is the initial gas for term neonatal resuscitation — not 100% O2. Titrate up based on SpO2 targets",
        "The compression-to-ventilation ratio in neonates is 3:1 (not 15:2 or 30:2) — this reflects the primacy of ventilation",
        "Hypothermia dramatically worsens neonatal outcomes — keep the baby warm (dry, hat, skin-to-skin, warm blankets)"
      ],
      pitfalls: [
        "Using 100% O2 as initial resuscitation gas for term newborns — start with room air and titrate up",
        "Not maintaining temperature — even mild hypothermia increases mortality in neonates",
        "Using adult CPR ratios — neonatal ratio is 3:1 compressions to ventilations",
        "Routine deep suctioning of meconium-stained neonates — current guidelines only recommend suctioning if the baby is not vigorous"
      ],
      faq: [
        { question: "What is the Golden Minute?", answer: "The Golden Minute refers to the first 60 seconds after birth during which initial assessment and interventions should be completed: warm, dry, stimulate, position the airway, suction if needed, and begin positive pressure ventilation if the baby is apneic or has a heart rate <100. Effective ventilation within this time is the most important determinant of outcome." },
        { question: "Why is room air used initially instead of 100% oxygen?", answer: "Evidence shows that term newborns resuscitated with room air (21% O2) have equivalent or better outcomes compared to 100% O2. Excessive oxygen causes oxidative stress and is associated with increased mortality. Start with 21% and titrate based on pulse oximetry targets (60% at 1 min, 85% at 5 min, >90% at 10 min)." },
        { question: "What is the neonatal compression-to-ventilation ratio?", answer: "3:1 (3 compressions to 1 ventilation), delivered at a rate of 120 events per minute (90 compressions + 30 breaths). This differs from pediatric (15:2) and adult (30:2) ratios because neonatal arrest is almost always caused by respiratory failure, making ventilation the priority." }
      ],
      keywords: ["neonatal resuscitation paramedic", "NRP algorithm prehospital", "newborn resuscitation steps", "Golden Minute neonatal", "neonatal CPR ratio"],
      related: ["emergency-childbirth", "pediatric-cardiac-arrest", "pediatric-airway-management", "meconium-aspiration"]
    },

    {
      title: "Drowning",
      category: "Environmental Emergencies",
      overview: "Drowning is the process of experiencing respiratory impairment from submersion or immersion in liquid. It is a leading cause of death in children and young adults. The primary pathology is hypoxia from water aspiration or laryngospasm. Prehospital management focuses on rapid rescue, aggressive oxygenation/ventilation, and CPR if needed.",
      mechanism: "Submersion leads to aspiration of water into the lungs (wet drowning, ~85%) or laryngospasm preventing breathing (dry drowning, ~15%). Both mechanisms result in hypoxia. Fresh water aspiration damages surfactant and causes alveolar collapse. Salt water aspiration draws fluid into the alveoli by osmotic gradient. Both result in pulmonary edema, V/Q mismatch, and severe hypoxemia. Hypothermia may be protective in cold water submersion.",
      clinicalRelevance: "Drowning management differs from other cardiac arrest in that ventilation is the priority (the arrest is hypoxic in origin). Understanding this distinction, along with cold water immersion considerations, is important for paramedic exam preparation.",
      signsSymptoms: "Range from mild (coughing, mild dyspnea) to severe (respiratory failure, cardiac arrest). Findings include: coughing, dyspnea, wheezing, crackles, tachycardia, cyanosis, altered mental status, vomiting, hypothermia, and cardiac arrest (PEA or asystole most common — NOT VF, unless hypothermic).",
      assessment: "Scene safety (do not become a second victim). Rescue from water. Assess airway and breathing immediately — drowning patients need ventilation first. C-spine precautions if diving mechanism or unknown mechanism. Assess for hypothermia. Assess level of consciousness. Monitor cardiac rhythm.",
      management: "Rescue breathing should begin in the water if safely possible. Once on land: suction airway, BVM ventilation with 100% O2, advanced airway if needed. CPR if pulseless — begin with 5 rescue breaths before compressions (ventilation-first approach because arrest is hypoxic). Treat hypothermia concurrently. ALL drowning patients with any symptoms need hospital evaluation — even mild cases can develop delayed pulmonary edema.",
      complications: "Pulmonary edema (can be delayed 12-24 hours — 'secondary drowning'), ARDS, hypothermia, cerebral hypoxia and anoxic brain injury, aspiration pneumonia, electrolyte abnormalities, DIC, and multi-organ failure. Even patients who appear well after submersion can deteriorate hours later.",
      pearls: [
        "Drowning is a HYPOXIC arrest — ventilation is the priority, not defibrillation",
        "Begin with 5 rescue breaths before starting compressions in drowning cardiac arrest",
        "Cold water submersion may be protective — cold water drowning victims should receive prolonged resuscitation",
        "ALL symptomatic drowning patients need hospital observation — delayed pulmonary edema can occur 12-24 hours later"
      ],
      pitfalls: [
        "Performing compression-only CPR for drowning — ventilation is critical because the arrest is caused by hypoxia",
        "Not beginning rescue breathing in the water when safely possible — early ventilation improves survival",
        "Terminating resuscitation too early in cold water drowning — hypothermia may be protective; resuscitate until warm",
        "Discharging drowning patients on scene — even asymptomatic patients may develop delayed pulmonary edema"
      ],
      faq: [
        { question: "Why is ventilation prioritized in drowning resuscitation?", answer: "Drowning arrest is caused by hypoxia, not primary cardiac dysfunction. The heart stops because of oxygen deprivation. Restoring oxygen delivery through ventilation addresses the underlying cause. This is why 5 rescue breaths are given before starting compressions, and why compression-only CPR is not recommended for drowning." },
        { question: "What is secondary drowning?", answer: "Secondary drowning (delayed pulmonary edema) occurs when water aspiration causes delayed alveolar damage, surfactant destruction, and progressive pulmonary edema 1-24 hours after the event. A patient who appears well after a submersion episode can deteriorate hours later. This is why all drowning patients with any symptoms need hospital observation." },
        { question: "Should the Heimlich maneuver be used for drowning?", answer: "No. The Heimlich maneuver (abdominal thrusts) is NOT indicated for drowning because the water in the lungs is absorbed, not obstructing the airway like a foreign body. Abdominal thrusts may cause vomiting and aspiration, worsening the situation. Manage the airway with suctioning, positioning, and positive pressure ventilation." }
      ],
      keywords: ["drowning management paramedic", "submersion injury treatment", "drowning resuscitation", "cold water drowning", "secondary drowning prevention"],
      related: ["hypothermia", "cardiac-arrest-management", "pediatric-cardiac-arrest", "bag-valve-mask-ventilation"]
    },

    {
      title: "Traumatic Cardiac Arrest",
      category: "Trauma",
      overview: "Traumatic cardiac arrest (TCA) is cardiac arrest resulting from traumatic injury. It has historically carried extremely poor survival rates (<5%), but recent evidence shows that aggressive, cause-targeted resuscitation can improve outcomes significantly. The key difference from medical cardiac arrest is that reversible causes are often amenable to specific procedural interventions.",
      mechanism: "TCA results from specific treatable causes: massive hemorrhage (most common), tension pneumothorax, cardiac tamponade, severe hypoxia, and catastrophic neurological injury. Unlike medical cardiac arrest where VF/pVT is common, TCA most often presents as PEA or asystole reflecting the hypovolemic or obstructive mechanism.",
      clinicalRelevance: "TCA management represents a paradigm shift from traditional ACLS. Chest compressions and epinephrine are less effective in TCA because the cause is usually mechanical (hemorrhage, tamponade, pneumothorax), not primary cardiac. Treatment focuses on addressing the specific traumatic cause.",
      signsSymptoms: "Cardiac arrest in the setting of trauma: unresponsive, pulseless, apneic. The mechanism of injury and pre-arrest findings guide cause identification: penetrating chest trauma → tamponade or pneumothorax. Blunt chest/abdominal trauma → hemorrhage, pneumothorax. Multi-system trauma → hemorrhage. Isolated head injury → catastrophic brain injury (poor prognosis).",
      assessment: "Rapidly identify the most likely cause based on mechanism and pre-arrest findings. Check for tension pneumothorax (unilateral absent breath sounds, JVD, tracheal deviation). Check for cardiac tamponade (penetrating chest/upper abdominal wound, JVD, muffled heart sounds). Assess for hemorrhage sources. Determine time of arrest — witnessed arrest with <10 minutes of CPR has the best prognosis.",
      management: "Simultaneous approach (do NOT follow standard ACLS step-by-step): Bilateral needle decompression (empiric if cause unknown). Control external hemorrhage. Massive transfusion if available. Resuscitative thoracotomy by physician if penetrating cardiac arrest with witnessed arrest and organized rhythm. Emergency perimortem cesarean if pregnant. Standard CPR as adjunct. Epinephrine per standard protocol. Rapid transport for surgical hemorrhage control.",
      complications: "The primary complication is death — TCA has high mortality. Survivors may have significant morbidity from anoxic brain injury, multi-organ failure, and the underlying traumatic injuries. Needle decompression in a non-pneumothorax patient is a minor risk compared to the benefit of treating a missed pneumothorax.",
      pearls: [
        "TCA management differs from medical cardiac arrest — the focus is on treating the CAUSE, not just running an ACLS algorithm",
        "Empiric bilateral needle decompression is recommended — tension pneumothorax is common and easily treated",
        "Chest compressions in TCA with empty ventricles (hypovolemia) are largely ineffective — hemorrhage control and volume resuscitation are priorities",
        "Penetrating TCA with organized rhythm and short arrest time has the best prognosis — these patients may benefit from emergency thoracotomy"
      ],
      pitfalls: [
        "Running standard ACLS without addressing traumatic causes — epinephrine will not fix hypovolemia or pneumothorax",
        "Not performing empiric bilateral needle decompression — this is low-risk and can be immediately life-saving",
        "Prolonged scene time in penetrating TCA — rapid transport to surgical intervention is essential",
        "Declaring futility too early in TCA — young trauma patients with treated reversible causes can have remarkable recoveries"
      ],
      faq: [
        { question: "How does traumatic cardiac arrest management differ from medical cardiac arrest?", answer: "TCA management focuses on identifying and treating the specific traumatic cause: hemorrhage control, bilateral needle decompression, volume resuscitation. Standard ACLS (compressions, epinephrine, defibrillation) is less effective because the arrest cause is usually mechanical, not electrical. Chest compressions with empty ventricles generate minimal cardiac output." },
        { question: "When should TCA resuscitation be terminated?", answer: "Consider termination when: arrest is clearly due to non-survivable injury (decapitation, massive brain destruction), prolonged down time (>15 minutes) with no organized rhythm, or failure to respond after addressing all reversible causes. However, young patients with short arrest times and potentially treatable causes warrant aggressive and prolonged resuscitation." },
        { question: "What is the role of bilateral needle decompression in TCA?", answer: "Empiric bilateral needle decompression is recommended in TCA because tension pneumothorax is a common, reversible cause. Even if the patient does not have a tension pneumothorax, the procedure carries minimal risk. The potential benefit of treating a missed pneumothorax far outweighs the risk of an unnecessary needle decompression." }
      ],
      keywords: ["traumatic cardiac arrest management", "TCA resuscitation", "trauma cardiac arrest causes", "needle decompression cardiac arrest", "penetrating cardiac arrest"],
      related: ["cardiac-arrest-management", "tension-pneumothorax", "hemorrhagic-shock", "needle-decompression", "cardiac-tamponade"]
    },

    {
      title: "Pain Management in EMS",
      category: "Medical Emergencies",
      overview: "Pain management is a critical component of prehospital care that improves patient comfort, reduces physiological stress responses, and facilitates clinical assessment and treatment. Paramedics have access to multiple analgesic options including opioids, non-opioids, and adjunct agents. Adequate pain management is a patient right and a marker of quality EMS care.",
      mechanism: "Pain is the subjective experience arising from nociceptor activation (tissue damage) or neuropathic pathways. Pain triggers sympathetic responses including tachycardia, hypertension, increased myocardial oxygen demand, and catecholamine release. Analgesics work through various mechanisms: opioids bind to mu receptors, NSAIDs inhibit COX enzymes, ketamine blocks NMDA receptors, and nitrous oxide provides anxiolytic and analgesic effects.",
      clinicalRelevance: "Pain assessment and management is an essential paramedic skill. Adequate analgesia reduces the stress response, improves patient cooperation, and facilitates procedures. Under-treatment of pain remains a common problem in EMS (oligoanalgesia).",
      signsSymptoms: "Pain assessment: numeric rating scale (0-10), facial expressions, vital signs changes (tachycardia, hypertension, diaphoresis — though vital signs are unreliable indicators of pain severity). OPQRST pain assessment: Onset, Provocation/Palliation, Quality, Radiation, Severity, Time.",
      assessment: "Assess pain using appropriate scale (numeric, FACES for children/language barriers, behavioral for altered patients). Document baseline pain score. Identify the cause. Assess for contraindications to specific analgesics. Reassess after treatment to evaluate effectiveness.",
      management: "Opioids: Fentanyl 1 mcg/kg IV/IN (preferred — rapid onset, less hypotension, less histamine release than morphine). Morphine 0.1 mg/kg IV (classic, effective, but more side effects). Non-opioids: Ketorolac (Toradol) 15-30mg IV/IM, Acetaminophen 1g IV. Adjuncts: Ketamine 0.1-0.3 mg/kg IV (sub-dissociative dose — analgesic without dissociation). Nitrous oxide 50:50 mix (Entonox). Reassess and redose as needed.",
      complications: "Opioid complications: respiratory depression, hypotension, nausea/vomiting, pruritus. Ketorolac: GI bleeding risk, renal impairment. Ketamine at analgesic doses: emergence reactions (rare at sub-dissociative doses), nausea. Nitrous oxide: nausea, contraindicated in pneumothorax. Over-sedation and respiratory depression are the most important risks to manage.",
      pearls: [
        "Fentanyl is preferred over morphine in most prehospital settings — faster onset, less hypotension, and can be given intranasally",
        "Sub-dissociative ketamine (0.1-0.3 mg/kg) is an excellent non-opioid analgesic option that does not cause respiratory depression",
        "Pain management should not be withheld because of concern about 'masking symptoms' — this is an outdated concept",
        "Intranasal fentanyl (1.5-2 mcg/kg) is effective and avoids the need for IV access"
      ],
      pitfalls: [
        "Withholding analgesia because of concern about masking diagnosis — adequate pain management actually improves assessment",
        "Not reassessing pain after medication administration — always document pre and post-treatment pain scores",
        "Using morphine in hemodynamically unstable patients — fentanyl or ketamine are preferred for hemodynamic stability",
        "Not considering non-opioid alternatives — ketorolac, acetaminophen, and ketamine can reduce opioid requirements"
      ],
      faq: [
        { question: "Why is fentanyl preferred over morphine in EMS?", answer: "Fentanyl has several advantages: faster onset (2-3 min IV, 5-10 min IN vs 5-10 min IV for morphine), less histamine release (less hypotension and itching), no active metabolites (safer in renal failure), can be given intranasally (avoiding IV access need), and is more potent per mg. It provides more predictable analgesia with fewer side effects." },
        { question: "What is sub-dissociative dose ketamine?", answer: "Sub-dissociative ketamine uses low doses (0.1-0.3 mg/kg IV over 15 minutes or 0.5-1 mg/kg IN) to provide analgesia without dissociative effects. It works by blocking NMDA receptors and provides multimodal pain relief. Advantages include preserved respiratory drive, maintained hemodynamic stability, and effectiveness for pain resistant to opioids." },
        { question: "How should pain be assessed in non-verbal patients?", answer: "Use behavioral assessment: facial grimacing, guarding, crying/moaning, vital signs changes, and response to movement/palpation. For children, use the FACES pain scale or FLACC scale (Face, Legs, Activity, Cry, Consolability). For altered/intubated patients, use the Behavioral Pain Scale or similar validated tool." }
      ],
      keywords: ["pain management paramedic", "prehospital analgesia", "fentanyl vs morphine EMS", "sub-dissociative ketamine", "pain assessment prehospital"],
      related: ["opioid-overdose", "burns-assessment-and-management", "trauma-assessment", "naloxone"]
    },

    {
      title: "Meningitis",
      category: "Medical Emergencies",
      overview: "Meningitis is inflammation of the meninges (membranes covering the brain and spinal cord) most commonly caused by viral or bacterial infection. Bacterial meningitis is a medical emergency with high mortality if untreated. Prehospital recognition and rapid transport are critical, and some systems authorize prehospital antibiotic administration.",
      mechanism: "Bacteria or viruses reach the meninges through hematogenous spread, direct extension from adjacent infection, or inoculation through trauma/surgery. The infection triggers an intense inflammatory response in the subarachnoid space, causing cerebral edema, increased ICP, vasculitis, and neural damage. Common bacterial causes: Neisseria meningitidis, Streptococcus pneumoniae, and Haemophilus influenzae type b.",
      clinicalRelevance: "Bacterial meningitis is a time-sensitive emergency where every hour of antibiotic delay increases mortality. Prehospital recognition based on the classic triad and rapid transport to a facility capable of LP and antibiotic administration is the paramedic's primary role.",
      signsSymptoms: "Classic triad: fever, headache, and nuchal rigidity (neck stiffness — present in ~60-80%). Additional signs: photophobia, altered mental status, nausea/vomiting, seizures, petechial or purpuric rash (especially with N. meningitidis — meningococcemia). Kernig sign (pain with knee extension when hip is flexed) and Brudzinski sign (involuntary flexion of hips when neck is flexed). Infants: bulging fontanelle, irritability, poor feeding, high-pitched cry.",
      assessment: "Assess for meningeal signs: nuchal rigidity, Kernig sign, Brudzinski sign. Vital signs including temperature. GCS/mental status. Assess for petechial rash (check skin thoroughly — roll the patient). Blood glucose. Consider lumbar puncture contraindications (signs of increased ICP — assess for papilledema if possible). Note: meningitis can present subtly in immunocompromised and elderly patients.",
      management: "Supplemental O2. IV access. Treat fever. Treat seizures with benzodiazepines. Rapid transport. Some systems authorize prehospital antibiotics (ceftriaxone 2g IV). Droplet precautions (mask for patient and providers — especially with suspected N. meningitidis). Treat shock if present. Dexamethasone per protocol (reduces inflammation). Contact EMS medical director regarding prophylaxis for exposed providers.",
      complications: "Septic shock (especially meningococcal septicemia), DIC, cerebral edema, herniation, hearing loss, seizures, cranial nerve palsies, hydrocephalus, brain abscess, long-term neurological deficits, and death. Waterhouse-Friderichsen syndrome (adrenal hemorrhage from meningococcal septicemia).",
      pearls: [
        "The petechial/purpuric rash of meningococcemia is a late and ominous sign — if present, the patient is critically ill",
        "Nuchal rigidity may be absent in very young children, elderly, and immunocompromised patients",
        "EMS providers exposed to confirmed N. meningitidis require prophylactic antibiotics — contact medical control",
        "Bacterial meningitis mortality increases with every hour of antibiotic delay — rapid transport is essential"
      ],
      pitfalls: [
        "Missing meningitis because the classic triad is incomplete — not all patients have all three signs",
        "Not checking the skin for petechiae — undress and examine the patient thoroughly",
        "Attributing headache and neck stiffness to 'migraine' or 'musculoskeletal' without considering meningitis, especially if fever is present",
        "Not wearing appropriate PPE — N. meningitidis is transmitted via respiratory droplets"
      ],
      faq: [
        { question: "What is the classic triad of meningitis?", answer: "Fever, headache, and nuchal rigidity (stiff neck). However, all three are present in only 44-66% of bacterial meningitis cases. Altered mental status is present in 70-80%. The combination of fever plus any one of the other signs should raise high suspicion for meningitis." },
        { question: "What PPE is needed for suspected meningitis?", answer: "Surgical mask for the patient and providers (droplet precautions) for suspected N. meningitidis. Standard precautions (gloves, hand hygiene) for all suspected meningitis. N. meningitidis is transmitted via respiratory droplets within 3 feet. Exposed providers may need antibiotic prophylaxis (rifampin or ciprofloxacin)." },
        { question: "What is meningococcemia?", answer: "Meningococcemia is bloodstream infection with Neisseria meningitidis, characterized by rapid-onset septic shock, petechial/purpuric rash that does not blanch with pressure, DIC, and adrenal hemorrhage (Waterhouse-Friderichsen syndrome). It can progress from onset to death within hours and has a mortality rate of 20-40% even with treatment." }
      ],
      keywords: ["meningitis assessment paramedic", "bacterial meningitis signs", "meningococcal meningitis EMS", "nuchal rigidity assessment", "meningitis treatment prehospital"],
      related: ["sepsis-and-septic-shock", "altered-mental-status", "seizure-management", "increased-intracranial-pressure"]
    },

    {
      title: "Cardiac Tamponade",
      category: "Cardiac Emergencies",
      overview: "Cardiac tamponade is a life-threatening condition in which fluid (blood, pericardial effusion) accumulates in the pericardial space, compressing the heart and preventing adequate filling. It is an obstructive shock emergency that can rapidly progress to cardiac arrest if not recognized and treated.",
      mechanism: "The pericardium is a relatively inelastic sac surrounding the heart. Rapid fluid accumulation (as in trauma — blood) or large volume accumulation (as in medical causes — effusion) increases intrapericardial pressure, compressing the cardiac chambers. The right atrium and ventricle, being low-pressure chambers, are compressed first, reducing venous return and cardiac output. This causes obstructive shock.",
      clinicalRelevance: "Cardiac tamponade is a reversible cause of obstructive shock and PEA cardiac arrest (the 'T' in H's and T's — Tamponade). Prehospital management focuses on recognition and rapid transport, as definitive treatment (pericardiocentesis or surgical intervention) is a hospital procedure.",
      signsSymptoms: "Beck's triad: hypotension, JVD (distended neck veins), and muffled/distant heart sounds. Additional: tachycardia, tachypnea, narrow pulse pressure, pulsus paradoxus (>10 mmHg drop in SBP during inspiration), anxiety, dyspnea. Traumatic tamponade typically follows penetrating chest or upper abdominal trauma. Medical tamponade may be insidious.",
      assessment: "Assess for Beck's triad in the context of mechanism (penetrating chest trauma) or medical history (cancer, uremia, pericarditis, recent cardiac surgery). JVD with hypotension in trauma should raise high suspicion. Muffled heart sounds are difficult to assess in the noisy prehospital environment. Point-of-care ultrasound (if available) can confirm pericardial effusion.",
      management: "IV fluid bolus (250-500 mL) to temporarily increase filling pressures and cardiac output. Position patient with legs elevated. Avoid agents that reduce preload (nitroglycerin, morphine, diuretics). Rapid transport to a facility capable of pericardiocentesis or thoracotomy. Prehospital pericardiocentesis is rarely performed but may be considered in extremis per protocol. CPR if cardiac arrest — treat as obstructive arrest.",
      complications: "Cardiac arrest (PEA most common), end-organ hypoperfusion, and death if untreated. Pericardiocentesis complications include myocardial injury, coronary artery laceration, pneumothorax, and dysrhythmias.",
      pearls: [
        "Beck's triad (hypotension, JVD, muffled heart sounds) is the classic presentation — but muffled heart sounds are very difficult to assess in the field",
        "JVD + hypotension after penetrating chest trauma = cardiac tamponade until proven otherwise",
        "IV fluid bolus is a temporizing measure that increases filling pressure and may improve cardiac output temporarily",
        "Avoid preload-reducing medications — nitroglycerin, morphine, and diuretics can cause cardiovascular collapse in tamponade"
      ],
      pitfalls: [
        "Missing tamponade because heart sounds are difficult to assess — focus on JVD + hypotension + mechanism",
        "Giving nitroglycerin to a patient with tamponade (misdiagnosed as ACS) — this can be fatal",
        "Not considering tamponade in medical patients — cancer, uremia, and autoimmune diseases can cause tamponade",
        "Delaying transport while attempting field interventions — definitive treatment requires hospital resources"
      ],
      faq: [
        { question: "What is Beck's triad?", answer: "Beck's triad describes the classic findings of cardiac tamponade: hypotension (low cardiac output), jugular venous distension (impaired venous return to the compressed heart), and muffled/distant heart sounds (fluid around the heart dampens sound transmission). All three are present in only about 25-40% of cases." },
        { question: "How is cardiac tamponade treated?", answer: "Definitive treatment is pericardiocentesis (needle aspiration of pericardial fluid) or surgical pericardiotomy. Even removing 15-20 mL of fluid can significantly improve cardiac output. Prehospital temporizing measures include IV fluid bolus to increase filling pressures and legs-elevated positioning." },
        { question: "What causes cardiac tamponade?", answer: "Traumatic: penetrating chest trauma (stab wounds, gunshots), blunt cardiac injury. Medical: pericarditis, cancer with pericardial metastasis, uremia (renal failure), autoimmune disease (lupus), post-cardiac surgery, aortic dissection with rupture into pericardium. Traumatic tamponade is more acute; medical tamponade may develop gradually." }
      ],
      keywords: ["cardiac tamponade management", "Beck's triad", "pericardial tamponade EMS", "obstructive shock tamponade", "pericardiocentesis indications"],
      related: ["chest-trauma", "pulseless-electrical-activity", "shock-assessment-and-classification", "cardiac-arrest-management"]
    },

    {
      title: "Hyperkalemia",
      category: "Medical Emergencies",
      overview: "Hyperkalemia is an elevated serum potassium level (>5.5 mEq/L) that can cause life-threatening cardiac dysrhythmias and cardiac arrest. It is one of the reversible H's in the cardiac arrest algorithm (Hyper/Hypokalemia) and is commonly associated with renal failure, medication effects, and tissue destruction.",
      mechanism: "Potassium is the primary intracellular cation. Elevated extracellular potassium reduces the resting membrane potential of cardiac cells, making them more excitable initially but eventually causing conduction delays and cardiac arrest. Progressive hyperkalemia manifests on ECG as peaked T waves → prolonged PR → widened QRS → sine wave → VF or asystole. Causes include renal failure, ACE inhibitors/ARBs, potassium supplements, tissue destruction (crush injury, burns, rhabdomyolysis), and acidosis.",
      clinicalRelevance: "Hyperkalemia is a common cause of PEA and asystole cardiac arrest, especially in dialysis patients. Prehospital recognition of ECG changes and initiation of treatment can prevent cardiac arrest. Understanding the treatment sequence is heavily tested on paramedic exams.",
      signsSymptoms: "Mild (5.5-6.0): often asymptomatic. Moderate (6.0-7.0): muscle weakness, paresthesias, nausea. Severe (>7.0): cardiac conduction abnormalities, paralysis, cardiac arrest. ECG progression: peaked T waves (earliest) → flattened P waves → prolonged PR interval → widened QRS → sine wave pattern → VF/asystole.",
      assessment: "Suspect hyperkalemia in patients with renal failure (especially missed dialysis), crush injuries, burns, diabetic ketoacidosis, medications (ACE inhibitors, ARBs, K-sparing diuretics), and unexplained bradycardia or PEA arrest. ECG is the primary assessment tool — look for peaked T waves and widened QRS.",
      management: "Cardiac membrane stabilization: Calcium chloride 1g IV (or calcium gluconate 3g IV) — this does NOT lower potassium but protects the heart from dysrhythmia. Shift potassium intracellularly: sodium bicarbonate 50 mEq IV, albuterol 10-20mg nebulized (4x standard dose), insulin 10 units IV with D50 25g (prevents hypoglycemia). Remove potassium: kayexalate (hospital), dialysis (definitive). Treat underlying cause.",
      complications: "Fatal cardiac dysrhythmias (VF, asystole), cardiac arrest, muscle weakness progressing to paralysis, respiratory failure from diaphragm weakness, and metabolic acidosis. Hyperkalemia-induced cardiac arrest is often refractory to standard ACLS without specific treatment.",
      pearls: [
        "Calcium is the FIRST treatment in severe hyperkalemia — it stabilizes the cardiac membrane within minutes",
        "Peaked T waves on ECG in a dialysis patient who missed treatment = hyperkalemia until proven otherwise",
        "Albuterol at 4x the standard dose (10-20mg) is an effective potassium-shifting agent and is easily available on ambulances",
        "Sodium bicarbonate shifts potassium intracellularly and corrects the acidosis that contributes to hyperkalemia"
      ],
      pitfalls: [
        "Not recognizing peaked T waves as hyperkalemia — they are the earliest and most reliable ECG sign",
        "Giving insulin without dextrose — this causes dangerous hypoglycemia",
        "Not considering hyperkalemia as a cause of PEA arrest in dialysis patients",
        "Treating hyperkalemia without addressing the underlying cause — temporizing measures buy time but the potassium must ultimately be removed"
      ],
      faq: [
        { question: "What are the ECG changes of hyperkalemia?", answer: "Progressive changes as potassium rises: peaked, tent-shaped T waves (earliest, 5.5-6.5 mEq/L) → flattened P waves → prolonged PR interval → widened QRS (>6.5 mEq/L) → sine wave pattern (merging of widened QRS and T waves, >8.0 mEq/L) → VF or asystole. These changes may not follow this exact sequence in every patient." },
        { question: "Why is calcium given first in hyperkalemia?", answer: "Calcium directly antagonizes the effect of potassium on the cardiac membrane, raising the threshold potential and reducing the risk of dysrhythmia. It works within 1-3 minutes but lasts only 30-60 minutes. It does NOT lower serum potassium — it protects the heart while other treatments work to shift or remove potassium." },
        { question: "How does albuterol help in hyperkalemia?", answer: "Albuterol stimulates beta-2 receptors, activating the sodium-potassium ATPase pump, which shifts potassium from extracellular to intracellular space. At high doses (10-20mg nebulized — 4-8x the standard respiratory dose), it can lower serum potassium by 0.5-1.5 mEq/L within 30 minutes. It is used as an adjunct to calcium and bicarbonate." }
      ],
      keywords: ["hyperkalemia treatment paramedic", "peaked T waves ECG", "hyperkalemia cardiac arrest", "calcium chloride hyperkalemia", "potassium emergency EMS"],
      related: ["cardiac-arrest-management", "pulseless-electrical-activity", "cardiac-dysrhythmias", "diabetic-emergencies"]
    },

    {
      title: "Allergic Reactions",
      category: "Medical Emergencies",
      overview: "Allergic reactions range from mild localized responses (urticaria, pruritus) to severe systemic anaphylaxis. Paramedics must assess the severity of allergic reactions, differentiate mild from severe, and determine when epinephrine is indicated. Early recognition of progression toward anaphylaxis is critical for preventing cardiovascular collapse.",
      mechanism: "Allergic reactions involve immune system hypersensitivity. Type I (immediate) reactions are IgE-mediated: allergen exposure triggers mast cell and basophil degranulation, releasing histamine, leukotrienes, and prostaglandins. Mild reactions produce localized effects. Anaphylaxis produces systemic effects including vasodilation, bronchospasm, and increased vascular permeability. Non-IgE mediated reactions (anaphylactoid) produce similar symptoms through direct mediator release.",
      clinicalRelevance: "Distinguishing mild allergic reactions from anaphylaxis determines treatment: mild reactions receive antihistamines, while anaphylaxis requires immediate epinephrine. Under-treatment of anaphylaxis with antihistamines alone is a common and potentially fatal error.",
      signsSymptoms: "Mild: localized urticaria (hives), pruritus (itching), mild angioedema, rhinorrhea. Moderate: widespread urticaria, significant angioedema, mild wheezing, nausea/vomiting. Severe (anaphylaxis): respiratory compromise (stridor, severe wheezing, dyspnea), cardiovascular compromise (hypotension, tachycardia, syncope), altered mental status. Anaphylaxis involves skin PLUS respiratory or cardiovascular symptoms.",
      assessment: "Identify the allergen if possible (food, medication, insect sting, latex). Determine severity: skin-only = mild allergic reaction. Skin + respiratory or cardiovascular symptoms = anaphylaxis. Respiratory distress without skin findings can still be anaphylaxis. Assess for biphasic reaction risk. Note previous anaphylaxis history.",
      management: "Mild allergic reaction: diphenhydramine 25-50 mg PO/IV/IM, monitor for progression. Anaphylaxis: EPINEPHRINE 0.3-0.5 mg IM first, then diphenhydramine, methylprednisolone, albuterol for bronchospasm, IV fluid bolus for hypotension. Position supine with legs elevated (unless respiratory distress). Remove allergen if possible (remove stinger, stop medication infusion). Monitor and transport ALL anaphylaxis patients.",
      complications: "Progression from mild to severe reaction, anaphylactic shock and cardiac arrest, airway obstruction from angioedema, aspiration, biphasic reaction (recurrence hours later), and death from delayed epinephrine administration.",
      pearls: [
        "Anaphylaxis = skin findings PLUS respiratory or cardiovascular compromise — give epinephrine immediately",
        "Diphenhydramine treats SYMPTOMS (itching, hives) but does NOT treat the underlying anaphylactic process — epinephrine is the treatment",
        "Anaphylaxis can present WITHOUT skin findings — respiratory or cardiovascular symptoms after allergen exposure should be treated as anaphylaxis",
        "Patients with a history of anaphylaxis who present with allergen exposure should be monitored closely even if currently asymptomatic"
      ],
      pitfalls: [
        "Giving diphenhydramine instead of epinephrine for anaphylaxis — antihistamines do not reverse bronchospasm or hypotension",
        "Waiting for skin findings to diagnose anaphylaxis — respiratory or cardiovascular symptoms alone can be anaphylaxis",
        "Not recognizing anaphylaxis in a patient who only has GI symptoms (cramping, vomiting) with hypotension after allergen exposure",
        "Not monitoring mild allergic reactions for progression — mild reactions can evolve into anaphylaxis"
      ],
      faq: [
        { question: "How do you differentiate a mild allergic reaction from anaphylaxis?", answer: "Mild allergic reaction: skin symptoms only (hives, itching, localized swelling) without respiratory or cardiovascular compromise. Anaphylaxis: skin findings PLUS respiratory symptoms (wheezing, stridor, dyspnea) OR cardiovascular symptoms (hypotension, tachycardia, syncope). Anaphylaxis can also occur with respiratory/cardiovascular symptoms alone without skin findings." },
        { question: "When should epinephrine be given for an allergic reaction?", answer: "Epinephrine should be given immediately when anaphylaxis is diagnosed or strongly suspected: any combination of allergen exposure with respiratory compromise (wheezing, stridor) or cardiovascular compromise (hypotension, altered mental status). Do NOT delay epinephrine for antihistamines. There are no absolute contraindications to epinephrine in anaphylaxis." },
        { question: "Can anaphylaxis occur without skin symptoms?", answer: "Yes. Approximately 10-20% of anaphylaxis cases present without skin findings. Isolated bronchospasm after allergen exposure, or hypotension with GI symptoms after eating a known allergen, can be anaphylaxis. The absence of urticaria should not delay treatment if the overall clinical picture suggests anaphylaxis." }
      ],
      keywords: ["allergic reaction vs anaphylaxis", "allergic reaction treatment EMS", "when to give epinephrine allergy", "urticaria management", "allergic reaction assessment"],
      related: ["anaphylaxis", "epinephrine", "asthma-management", "airway-obstruction-management"]
    },

    {
      title: "Acute Abdomen",
      category: "Medical Emergencies",
      overview: "Acute abdomen refers to the sudden onset of severe abdominal pain requiring urgent evaluation and potentially emergent surgical intervention. While definitive diagnosis is typically made at the hospital, paramedics must assess severity, identify life-threatening causes, provide appropriate supportive care, and transport to appropriate facilities.",
      mechanism: "Abdominal pain arises from three mechanisms: visceral pain (stretching/distension of hollow organs — diffuse, crampy, poorly localized), parietal/somatic pain (inflammation of the peritoneum — sharp, well-localized, worsened by movement), and referred pain (perceived at a site distant from the pathology — e.g., diaphragmatic irritation causing shoulder pain). Life-threatening causes include ruptured AAA, ectopic pregnancy, mesenteric ischemia, perforated viscus, and bowel obstruction.",
      clinicalRelevance: "Acute abdominal emergencies are common EMS calls. While prehospital diagnosis is often limited, recognizing patients who are hemodynamically unstable, have peritoneal signs, or have life-threatening pathology allows appropriate triage, transport destination selection, and hospital notification.",
      signsSymptoms: "Pain characteristics help identify cause: RLQ pain (appendicitis), RUQ pain (cholecystitis, hepatitis), LLQ pain (diverticulitis), epigastric pain (peptic ulcer, pancreatitis, MI), flank pain (renal colic, AAA), suprapubic pain (UTI, ectopic pregnancy). Peritoneal signs: rebound tenderness, guarding, rigidity. Systemic signs: fever, tachycardia, hypotension, diaphoresis.",
      assessment: "OPQRST pain assessment. Vital signs — hypotension with abdominal pain suggests hemorrhage (ruptured AAA, ectopic pregnancy, splenic injury). Assess for peritoneal signs. Assess for pregnancy (all women of childbearing age). SAMPLE history. Auscultate for bowel sounds (hyperactive = obstruction, absent = peritonitis). Palpate all four quadrants.",
      management: "Pain management (fentanyl 1 mcg/kg IV — do NOT withhold analgesia). IV access. Position of comfort. NPO (nothing by mouth). IV fluid if hypotensive. Transport to appropriate facility (surgical center if peritoneal signs or hemodynamic instability). Consider prehospital notification for surgical emergencies (ruptured AAA, ectopic pregnancy with shock).",
      complications: "Peritonitis from perforation, sepsis, hemorrhagic shock from vascular catastrophe (AAA rupture), bowel ischemia and necrosis, multi-organ failure, and death. Delay in surgical intervention for conditions requiring surgery directly worsens outcomes.",
      pearls: [
        "Hypotension + abdominal pain = think ruptured AAA or ruptured ectopic pregnancy — both are surgical emergencies",
        "All women of childbearing age with lower abdominal pain should be considered to have ectopic pregnancy until proven otherwise",
        "Pain management does NOT mask surgical findings — withholding analgesia is inappropriate and can worsen the exam by causing guarding",
        "Abdominal rigidity (board-like abdomen) indicates peritonitis and usually requires surgical intervention"
      ],
      pitfalls: [
        "Withholding pain medication because of concern about 'masking the diagnosis' — this is outdated practice",
        "Not considering ectopic pregnancy in women of childbearing age with abdominal pain and hemodynamic instability",
        "Missing ruptured AAA in elderly patients with back or flank pain and hypotension",
        "Attributing all abdominal pain to gastrointestinal causes — consider cardiac (inferior MI), vascular (AAA), and gynecological causes"
      ],
      faq: [
        { question: "What are the life-threatening causes of acute abdominal pain?", answer: "Ruptured abdominal aortic aneurysm (AAA), ruptured ectopic pregnancy, mesenteric ischemia (bowel infarction), perforated viscus (peptic ulcer, diverticulitis), bowel obstruction with strangulation, splenic rupture, and acute pancreatitis with necrotizing complications. These require emergent surgical or interventional treatment." },
        { question: "How is ruptured AAA identified in the field?", answer: "Classic triad: sudden abdominal/back/flank pain, pulsatile abdominal mass (present in ~50% — don't spend time searching for it), and hypotension. Most common in elderly males with risk factors (hypertension, smoking, known AAA). Any male >60 with sudden abdominal pain and hemodynamic instability should be suspected of AAA rupture." },
        { question: "Should pain medication be given for acute abdominal pain?", answer: "Yes. Multiple studies have shown that analgesics do not impair surgical decision-making and actually improve the accuracy of the abdominal exam by reducing guarding and patient distress. Fentanyl is preferred due to less hemodynamic impact. Pain management is a standard of care." }
      ],
      keywords: ["acute abdomen paramedic", "abdominal pain assessment EMS", "ruptured AAA symptoms", "ectopic pregnancy emergency", "acute abdominal emergency"],
      related: ["hemorrhagic-shock", "shock-assessment-and-classification", "pain-management-in-ems", "abdominal-trauma"]
    },

    {
      title: "Spinal Immobilization",
      category: "Trauma",
      overview: "Spinal immobilization (spinal motion restriction) is the practice of limiting movement of the spinal column to prevent secondary spinal cord injury in trauma patients. Modern evidence-based guidelines emphasize selective immobilization using validated clinical decision tools rather than universal application of cervical collars and backboards.",
      mechanism: "An unstable spinal fracture or ligamentous injury can allow pathological movement of vertebral segments. This movement may compress, stretch, or lacerate the spinal cord, converting a bony injury without neurological deficit into a permanent spinal cord injury. Immobilization prevents this pathological movement during patient assessment, packaging, and transport.",
      clinicalRelevance: "The shift from universal immobilization to selective spinal motion restriction is a major evolution in prehospital trauma care. Understanding when TO and when NOT TO immobilize, and using validated decision rules, is essential modern paramedic practice.",
      signsSymptoms: "Indications for spinal motion restriction (any of the following in a trauma patient): midline spinal tenderness, neurological deficit (motor/sensory), altered mental status (GCS <15), intoxication, distracting injury (preventing reliable assessment), or failure to meet clearance criteria per NEXUS or Canadian C-Spine Rule.",
      assessment: "Apply NEXUS criteria or Canadian C-Spine Rule. NEXUS: immobilize if ANY of the following are present — midline cervical tenderness, focal neurological deficit, altered alertness, intoxication, or painful distracting injury. If ALL five criteria are absent, the cervical spine can be clinically cleared. Perform motor/sensory assessment of extremities.",
      management: "If immobilization indicated: manual inline stabilization → apply properly sized cervical collar → transfer to long backboard (using log-roll or scoop stretcher) or vacuum mattress → secure patient with straps and head blocks → pad voids. Minimize time on long backboard (<30 min if possible). For ambulatory patients meeting clearance criteria: no collar or board needed, transport with monitoring.",
      complications: "Complications of immobilization: pressure ulcers from prolonged backboard use, respiratory restriction from straps, increased ICP from collar (compresses jugular veins), pain and discomfort, aspiration if patient vomits while supine on backboard, over-triage of low-risk patients. Complications of NOT immobilizing when indicated: secondary spinal cord injury (devastating but rare).",
      pearls: [
        "Long backboard time should be minimized — transfer to a padded surface as soon as feasible to prevent pressure injury",
        "Cervical collars can increase ICP by compressing jugular veins — use cautiously in TBI patients",
        "Selective immobilization using NEXUS or Canadian C-Spine Rule reduces unnecessary immobilization without increasing missed injuries",
        "Ambulatory patients who walked to EMS without pain and meet NEXUS clearance criteria do NOT need a backboard"
      ],
      pitfalls: [
        "Applying a backboard to every trauma patient regardless of mechanism or findings — this is unnecessary and harmful",
        "Leaving patients on a rigid backboard for extended periods — causes pain, pressure injury, and respiratory compromise",
        "Not assessing for spinal clearance criteria — some patients genuinely do not need immobilization",
        "Over-tightening a cervical collar — this restricts breathing and increases ICP"
      ],
      faq: [
        { question: "What are the NEXUS criteria for cervical spine clearance?", answer: "Five criteria must ALL be absent to clear the c-spine: 1) No midline cervical tenderness, 2) No focal neurological deficit, 3) Normal alertness (GCS 15), 4) No intoxication, 5) No painful distracting injury. If any criterion is present, maintain spinal motion restriction." },
        { question: "When should a long backboard be used?", answer: "Use a backboard for patients who cannot be safely moved without spinal protection. Minimize time on the board — it is a transfer device, not a treatment device. Modern guidelines recommend transferring the patient off the rigid backboard to a padded surface as soon as possible to prevent complications." },
        { question: "Is a cervical collar alone adequate spinal immobilization?", answer: "A cervical collar alone restricts only about 50% of cervical motion — it is not sufficient as standalone immobilization. For patients requiring full spinal motion restriction, use a collar plus full-body immobilization (backboard, vacuum mattress, or KED for seated patients). For patients meeting clearance criteria, no collar is needed." }
      ],
      keywords: ["spinal immobilization paramedic", "NEXUS criteria clearance", "cervical collar application", "selective spinal immobilization", "backboard use EMS"],
      related: ["spinal-cord-injury", "traumatic-brain-injury", "cervical-spine-injury", "trauma-assessment"]
    },

    {
      title: "Intraosseous Access",
      category: "Operations & Triage",
      overview: "Intraosseous (IO) access is the insertion of a needle into the medullary cavity of a bone to deliver fluids, medications, and blood products when peripheral intravenous access cannot be rapidly obtained. IO access provides a rapid, reliable route of vascular access in emergencies, particularly in cardiac arrest, shock, and pediatric emergencies.",
      mechanism: "The medullary cavity of long bones contains a rich network of sinusoidal veins that drain into the central venous circulation. These non-collapsible venous channels remain patent even in severe shock when peripheral veins collapse. Fluids and medications infused into the medullary space enter the systemic circulation within seconds, achieving drug levels comparable to peripheral IV administration.",
      clinicalRelevance: "IO access is a critical ALS skill when IV access is difficult or impossible. Current ACLS and PALS guidelines recommend IO access when IV access is not readily obtained (within 90 seconds or 2 attempts). The proximal tibia is the most common adult site; the proximal tibia and distal femur are used in pediatrics.",
      signsSymptoms: "IO access is indicated when: IV access cannot be obtained within 90 seconds or after 2 attempts, cardiac arrest without IV access, severe shock with collapsed veins, pediatric emergency with failed IV access, or any time-critical situation where vascular access is urgently needed.",
      assessment: "Identify the insertion site. Proximal tibia (most common adult site): 2 cm below the tibial tuberosity on the flat, medial surface. Distal tibia: 2 cm proximal to the medial malleolus. Proximal humerus: greater tubercle with arm adducted and internally rotated. Assess for contraindications: fracture in the target bone, previous IO in the same bone (within 24-48 hours), infection at the insertion site, prosthesis in the target bone.",
      management: "Clean the site. For powered device (EZ-IO): select appropriate needle length (15 gauge, 15mm-45mm based on patient size). Position at 90 degrees to the bone surface. Activate the drill and advance until a pop is felt (entry into medullary cavity). Remove stylet. Aspirate for marrow confirmation (optional — not always successful). Flush with 10 mL NS (flush confirms flow; painful in conscious patients — consider lidocaine flush). Connect tubing and infuse.",
      complications: "Extravasation (most common — caused by through-and-through penetration), fat embolism (rare), infection (osteomyelitis — rare with short-term use), compartment syndrome from extravasation, fracture of the bone (rare), pain during infusion in conscious patients (treat with IO lidocaine 40mg flush), and growth plate damage in children (use appropriate sites to avoid).",
      pearls: [
        "IO access can be established in under 60 seconds — faster than most IV access in emergencies",
        "All medications and fluids that can be given IV can be given IO — including pressors, blood products, and contrast",
        "Aspiration of marrow confirms placement but is not always possible — flush with 10 mL NS to confirm (flows easily without extravasation)",
        "IO access is painful in conscious patients — give IO lidocaine 40mg flush before infusing medications"
      ],
      pitfalls: [
        "Delaying IO access while making multiple IV attempts — if IV is not obtained in 90 seconds or 2 attempts, go IO",
        "Inserting into a fractured bone — this allows fluid extravasation and is a contraindication",
        "Not flushing the IO before medication administration — flush confirms proper placement",
        "Forgetting to give lidocaine flush in conscious patients — IO infusion is very painful without local anesthetic"
      ],
      faq: [
        { question: "Where are the IO insertion sites?", answer: "Proximal tibia (2cm below tibial tuberosity, medial flat surface) — most common adult site. Distal tibia (2cm above medial malleolus). Proximal humerus (greater tubercle). Distal femur (2cm above lateral condyle — primarily pediatric). Sternum (adults only, specialized device). Each site has specific landmarks and contraindications." },
        { question: "Can all IV medications be given via IO?", answer: "Yes. All medications, fluids, and blood products that can be given IV can be given IO at the same doses. Drug onset and blood levels are comparable to peripheral IV administration. The medullary venous channels drain directly into the central circulation, providing rapid systemic drug distribution." },
        { question: "How long can an IO line remain in place?", answer: "IO lines should be removed within 24 hours (some guidelines say 72 hours) and replaced with IV access as soon as feasible. Prolonged IO use increases infection risk (osteomyelitis). In the prehospital setting, IO is a bridge to obtaining definitive IV access at the hospital." }
      ],
      keywords: ["intraosseous access paramedic", "IO insertion technique", "EZ-IO placement", "IO access sites", "intraosseous vascular access"],
      related: ["cardiac-arrest-management", "pediatric-cardiac-arrest", "hemorrhagic-shock", "vascular-access"]
    },

  ];

  for (const topic of remainingTopics) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics = getExtraEntries();
  for (const topic of extraTopics) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics2 = getExtraEntries2();
  for (const topic of extraTopics2) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics3 = getExtraEntries3();
  for (const topic of extraTopics3) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics4 = getExtraEntries4();
  for (const topic of extraTopics4) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics5 = getExtraEntries5();
  for (const topic of extraTopics5) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics6 = getExtraEntries6();
  for (const topic of extraTopics6) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  const extraTopics7 = getExtraEntries7();
  for (const topic of extraTopics7) {
    entries.push(buildEntry(
      topic.title,
      topic.category,
      topic.overview,
      topic.mechanism,
      topic.clinicalRelevance,
      topic.signsSymptoms,
      topic.assessment,
      topic.management,
      topic.complications,
      topic.pearls,
      topic.pitfalls,
      topic.faq,
      topic.keywords,
      topic.related,
      order++
    ));
  }

  return entries;
}

export async function seedParamedicEncyclopedia(): Promise<{ inserted: number; errors: number }> {
  const entries = getEntries();
  let inserted = 0;
  let errors = 0;

  console.log(`[Encyclopedia] Seeding ${entries.length} paramedic encyclopedia entries...`);

  for (const entry of entries) {
    try {
      await pool.query(
        `INSERT INTO encyclopedia_entries (
          id, profession, slug, title, overview, mechanism, clinical_relevance,
          signs_symptoms, assessment_methods, management, complications,
          clinical_pearls, exam_pitfalls, faq, seo_title, meta_description,
          keywords, related_topic_slugs, status, category, sort_order,
          created_at, updated_at, published_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11::jsonb, $12::jsonb, $13::jsonb, $14, $15,
          $16, $17, $18, $19, $20,
          NOW(), NOW(), NOW()
        )
        ON CONFLICT (profession, slug) DO UPDATE SET
          title = $3, overview = $4, mechanism = $5, clinical_relevance = $6,
          signs_symptoms = $7, assessment_methods = $8, management = $9,
          complications = $10, clinical_pearls = $11::jsonb, exam_pitfalls = $12::jsonb,
          faq = $13::jsonb, seo_title = $14, meta_description = $15,
          keywords = $16, related_topic_slugs = $17, status = $18,
          category = $19, sort_order = $20, updated_at = NOW(), published_at = NOW()`,
        [
          entry.profession,
          entry.slug,
          entry.title,
          entry.overview,
          entry.mechanism,
          entry.clinicalRelevance,
          entry.signsSymptoms,
          entry.assessmentMethods,
          entry.management,
          entry.complications,
          JSON.stringify(entry.clinicalPearls),
          JSON.stringify(entry.examPitfalls),
          JSON.stringify(entry.faq),
          entry.seoTitle,
          entry.metaDescription,
          entry.keywords,
          entry.relatedTopicSlugs,
          entry.status,
          entry.category,
          entry.sortOrder,
        ]
      );
      inserted++;
    } catch (e: any) {
      console.error(`[Encyclopedia] Error inserting "${entry.title}":`, e.message);
      errors++;
    }
  }

  console.log(`[Encyclopedia] Seeding complete: ${inserted} inserted, ${errors} errors`);
  return { inserted, errors };
}
