import type { OSCESkillStation } from "./osce-skills-data";

export const osceSkillStations4: OSCESkillStation[] = [
  {
    id: "wound-dressing-change",
    title: "Wound Dressing Change",
    category: "Procedure",
    difficulty: "Intermediate",
    icon: "Bandage",
    description: "Perform a sterile wound dressing change on a surgical wound, assessing healing progress and documenting wound characteristics.",
    scenarioIntro: "You are a nurse on a surgical unit. Your patient is a 48-year-old who underwent an open cholecystectomy two days ago. The surgeon has ordered daily dressing changes with normal saline wound cleansing and a dry sterile dressing. The current dressing has a small amount of serous drainage.",
    equipment: [
      "Sterile dressing kit or sterile gloves and supplies",
      "Normal saline for irrigation",
      "Sterile gauze pads",
      "ABD pads (if needed)",
      "Adhesive tape or transparent dressing",
      "Clean gloves (for removing old dressing)",
      "Sterile gloves (for applying new dressing)",
      "Waste bag or biohazard bag",
      "Hand sanitizer",
      "Wound measurement guide/ruler (disposable)",
      "Documentation tools"
    ],
    steps: [
      { id: "wdc-1", instruction: "Perform hand hygiene and gather all necessary supplies.", rationale: "Prevents infection transmission and ensures an efficient, uninterrupted procedure.", criticalStep: true },
      { id: "wdc-2", instruction: "Identify the patient using two identifiers and explain the procedure.", rationale: "Patient safety standard and reduces anxiety by informing the patient about the process.", criticalStep: true },
      { id: "wdc-3", instruction: "Administer prescribed analgesic 20-30 minutes prior if the patient reports pain during dressing changes.", rationale: "Pre-medication allows peak analgesic effect during the procedure, improving patient comfort and cooperation.", criticalStep: false },
      { id: "wdc-4", instruction: "Position the patient comfortably with the wound site fully exposed and ensure adequate lighting.", rationale: "Proper positioning provides optimal visualization and access to the wound.", criticalStep: false },
      { id: "wdc-5", instruction: "Don clean gloves and carefully remove the old dressing, noting the type and amount of drainage.", rationale: "Clean gloves protect the nurse from wound drainage. Assessing the old dressing provides information about wound healing.", criticalStep: false },
      { id: "wdc-6", instruction: "Assess the wound: size, depth, color, wound bed characteristics, drainage (type, color, amount, odor), wound edges, and periwound skin.", rationale: "Comprehensive wound assessment identifies signs of healing, infection, or complications requiring intervention.", criticalStep: true },
      { id: "wdc-7", instruction: "Remove and discard soiled gloves and perform hand hygiene.", rationale: "Prevents cross-contamination before opening sterile supplies.", criticalStep: true },
      { id: "wdc-8", instruction: "Open the sterile dressing supplies using aseptic technique, creating a sterile field.", rationale: "Maintaining a sterile field prevents introduction of microorganisms into the wound.", criticalStep: true },
      { id: "wdc-9", instruction: "Don sterile gloves.", rationale: "Sterile gloves are required to handle sterile supplies and make contact with the wound.", criticalStep: true },
      { id: "wdc-10", instruction: "Cleanse the wound with normal saline using a center-to-outward technique or as prescribed.", rationale: "Cleaning from the least contaminated area (wound center) to the most contaminated (surrounding skin) prevents introducing bacteria into the wound.", criticalStep: true },
      { id: "wdc-11", instruction: "Pat the periwound skin dry with sterile gauze.", rationale: "Moisture on surrounding skin can lead to maceration and breakdown, and adhesive will not adhere to wet skin.", criticalStep: false },
      { id: "wdc-12", instruction: "Apply the appropriate sterile dressing as prescribed, ensuring the wound is fully covered.", rationale: "The correct dressing promotes an optimal wound healing environment while protecting from external contamination.", criticalStep: true },
      { id: "wdc-13", instruction: "Secure the dressing with adhesive tape or transparent film, labeling with date, time, and initials.", rationale: "Proper securing prevents dressing displacement. Labeling ensures timely dressing changes.", criticalStep: false },
      { id: "wdc-14", instruction: "Remove gloves, perform hand hygiene, and assist the patient to a comfortable position.", rationale: "Hand hygiene after glove removal prevents cross-contamination. Patient comfort promotes healing.", criticalStep: true },
      { id: "wdc-15", instruction: "Document wound assessment findings, interventions performed, and patient tolerance.", rationale: "Documentation ensures continuity of care and allows tracking of wound healing progress.", criticalStep: false }
    ],
    commonErrors: [
      "Breaking sterile technique when opening supplies or donning gloves",
      "Cleaning the wound from the outside toward the center instead of center outward",
      "Not assessing the wound before applying the new dressing",
      "Using the same pair of gloves to remove old dressing and apply the new one",
      "Failing to document wound characteristics including size measurement",
      "Not pre-medicating the patient for pain before a dressing change",
      "Leaving wound edges exposed or applying dressing too loosely"
    ],
    passingCriteria: "All critical steps must be performed correctly with maintained sterile technique throughout. Student must demonstrate proper wound assessment, aseptic cleansing technique, and sterile dressing application.",
    clinicalPearls: [
      "Always assess the old dressing before discarding it — drainage color, amount, and odor provide valuable clinical data.",
      "Red, beefy wound bed = healthy granulation tissue. Yellow = slough. Black = necrotic tissue (eschar).",
      "MEASURE the wound at each dressing change to objectively track healing or deterioration.",
      "Wound edges that are rolled (epibole) may indicate the wound will not close and may require debridement.",
      "Signs of wound infection include increased pain, warmth, erythema, purulent drainage, and foul odor."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are caring for a post-surgical patient requiring a dressing change. Perform a sterile wound dressing change, assessing the wound thoroughly and maintaining sterile technique throughout.",
    patientActorScript: "You are a 48-year-old recovering from abdominal surgery. You rate your pain at 4/10 at rest. You are cooperative but express mild anxiety about the dressing change. If asked about pain, say it increases slightly when the dressing is removed.",
    examinerChecklist: [
      { action: "Performs hand hygiene before procedure", marks: 2 },
      { action: "Identifies patient with two identifiers", marks: 2 },
      { action: "Removes old dressing with clean gloves", marks: 1 },
      { action: "Assesses wound characteristics thoroughly", marks: 3 },
      { action: "Performs hand hygiene between glove changes", marks: 2 },
      { action: "Opens sterile supplies with aseptic technique", marks: 2 },
      { action: "Dons sterile gloves correctly", marks: 2 },
      { action: "Cleanses wound center-to-outward", marks: 3 },
      { action: "Applies sterile dressing appropriately", marks: 2 },
      { action: "Labels dressing with date/time/initials", marks: 1 }
    ],
    criticalFailCriteria: [
      "Breaks sterile technique and does not correct it",
      "Fails to perform hand hygiene between removing old dressing and applying new one",
      "Cleans wound from outside inward, introducing contamination",
      "Does not assess the wound at all before covering"
    ],
    examinerQuestions: [
      { question: "What are the signs of wound infection?", answer: "Increased pain, erythema, warmth, purulent or foul-smelling drainage, fever, elevated WBC, and wound dehiscence." },
      { question: "Why do we clean from center to outward?", answer: "The wound center is considered the cleanest area. Cleaning outward moves contaminants away from the wound, reducing the risk of introducing bacteria." },
      { question: "What is the difference between dehiscence and evisceration?", answer: "Dehiscence is the separation of wound layers. Evisceration is when internal organs protrude through the wound opening — this is a surgical emergency requiring sterile saline-soaked dressings and immediate surgical intervention." }
    ],
    teachingPoints: [
      "Wound healing phases: hemostasis, inflammation (days 1-4), proliferation (days 4-21), and remodeling (21 days to 2 years).",
      "Moist wound healing is superior to dry wound healing for most wound types.",
      "Malnutrition (especially protein and vitamin C deficiency) significantly impairs wound healing.",
      "Diabetic patients are at higher risk for poor wound healing and infection.",
      "Documenting wound characteristics using a consistent framework (e.g., MEASURE) improves communication across the care team."
    ]
  },
  {
    id: "sterile-field-setup",
    title: "Sterile Field Setup",
    category: "Procedure",
    difficulty: "Beginner",
    icon: "Square",
    description: "Establish and maintain a sterile field using proper aseptic technique, including opening sterile packages and adding sterile items.",
    scenarioIntro: "You are a nurse preparing to assist with a minor bedside procedure that requires sterile supplies. You need to set up a sterile field on the overbed table using a sterile drape, add sterile instruments and supplies, and pour sterile solution into a sterile container.",
    equipment: [
      "Sterile drape or sterile kit with built-in drape",
      "Sterile gloves",
      "Sterile instrument set",
      "Sterile gauze pads",
      "Sterile solution (e.g., normal saline)",
      "Sterile container or basin",
      "Clean, dry overbed table",
      "Hand sanitizer"
    ],
    steps: [
      { id: "sfs-1", instruction: "Perform hand hygiene thoroughly.", rationale: "Hand hygiene is the foundation of infection prevention before any sterile procedure.", criticalStep: true },
      { id: "sfs-2", instruction: "Clear the overbed table and ensure it is clean and dry at waist height.", rationale: "A sterile field must be established on a clean, dry surface at or above waist level. Below waist level is considered contaminated.", criticalStep: true },
      { id: "sfs-3", instruction: "Check the sterile package for integrity: ensure the package is intact, dry, and not expired.", rationale: "Event-related sterility means a package is considered sterile only if the packaging is intact and dry. Moisture or tears allow microbial penetration.", criticalStep: true },
      { id: "sfs-4", instruction: "Open the outermost flap of the sterile package away from you.", rationale: "Opening away from you first prevents reaching over the sterile field, which would contaminate it.", criticalStep: true },
      { id: "sfs-5", instruction: "Open the side flaps of the sterile package, pulling each to the side.", rationale: "Side flaps are opened next to continue exposing the sterile contents without reaching over them.", criticalStep: false },
      { id: "sfs-6", instruction: "Open the final (nearest) flap toward you.", rationale: "The last flap is opened toward you so that the sterile field is fully exposed without any contamination from reaching across.", criticalStep: true },
      { id: "sfs-7", instruction: "Add sterile items to the field by opening their packages and dropping them onto the sterile field without reaching over it.", rationale: "Items should be dropped from the package edge to avoid the arm passing over the sterile surface.", criticalStep: true },
      { id: "sfs-8", instruction: "Pour sterile solution into a sterile container on the field: hold the bottle with the label facing your palm, pour from a height of 10-15 cm without splashing.", rationale: "Label up prevents solution from dripping over the label and obscuring it. Pouring from the correct height prevents splashing, which creates a pathway for contamination.", criticalStep: false },
      { id: "sfs-9", instruction: "Don sterile gloves using the open or closed gloving technique.", rationale: "Only sterile-gloved hands should touch items on the sterile field.", criticalStep: true },
      { id: "sfs-10", instruction: "Arrange items on the sterile field as needed for the procedure.", rationale: "Organized arrangement ensures efficient access during the procedure.", criticalStep: false },
      { id: "sfs-11", instruction: "Maintain awareness of the sterile field at all times — do not turn your back on it, reach across it, or allow unsterile items to contact it.", rationale: "A sterile field must be continuously monitored. Any breach requires discarding the field and starting over.", criticalStep: true },
      { id: "sfs-12", instruction: "If contamination is suspected, discard the sterile field and set up a new one.", rationale: "When in doubt, it is contaminated. Patient safety takes priority over convenience.", criticalStep: true }
    ],
    commonErrors: [
      "Opening the nearest flap first instead of the farthest flap",
      "Reaching over the sterile field to add items",
      "Allowing a non-sterile item or ungloved hand to touch the field",
      "Not checking the expiration date or package integrity before opening",
      "Turning away from the sterile field",
      "Placing the sterile field below waist level",
      "Spilling solution and not recognizing moisture as contamination"
    ],
    passingCriteria: "Student must establish a sterile field without any contamination. All flaps must be opened in the correct order, items added without reaching over the field, and the field must be maintained continuously.",
    clinicalPearls: [
      "Remember: The 1-inch border around the sterile drape is considered non-sterile.",
      "If you turn your back on a sterile field, consider it contaminated.",
      "Moisture is the enemy of sterility — a wet sterile field is a contaminated field (strike-through contamination).",
      "When in doubt, throw it out. Never assume something is still sterile if there is any question.",
      "Open sterile packages just before the procedure, not far in advance — prolonged exposure increases contamination risk."
    ],
    examLevel: "RPN/RN",
    timeLimit: "10 minutes",
    candidateInstructions: "Set up a sterile field on the overbed table using the supplies provided. Add sterile items and pour sterile solution. Maintain sterile technique throughout. Verbalize any contamination if it occurs.",
    patientActorScript: "No patient actor is needed for this station. This is a skills demonstration station.",
    examinerChecklist: [
      { action: "Performs hand hygiene", marks: 2 },
      { action: "Checks package integrity and expiration", marks: 2 },
      { action: "Opens flaps in correct order (away, sides, toward)", marks: 3 },
      { action: "Adds items without reaching over the field", marks: 3 },
      { action: "Pours solution correctly without splashing", marks: 2 },
      { action: "Dons sterile gloves correctly", marks: 2 },
      { action: "Maintains sterile field awareness throughout", marks: 3 },
      { action: "Recognizes and corrects any contamination", marks: 3 }
    ],
    criticalFailCriteria: [
      "Reaches over the sterile field with unsterile arm or item",
      "Does not recognize obvious contamination of the field",
      "Opens flaps in wrong order causing contamination",
      "Touches sterile field with ungloved hands"
    ],
    examinerQuestions: [
      { question: "What is the 1-inch border rule?", answer: "The outer 1-inch border of a sterile drape is considered non-sterile because it is in contact with the unsterile surface beneath it." },
      { question: "What would you do if you suspected contamination?", answer: "I would discard the entire sterile field and set up a new one. When in doubt, it is contaminated." },
      { question: "What is event-related sterility?", answer: "Event-related sterility means that a package remains sterile indefinitely as long as the packaging is intact, dry, and not damaged — regardless of how long ago it was sterilized." }
    ],
    teachingPoints: [
      "Sterile technique is used for any procedure that enters sterile body cavities or involves surgical wounds.",
      "The principle of 'when in doubt, throw it out' protects patients from healthcare-associated infections.",
      "Strike-through contamination occurs when moisture from an unsterile surface penetrates through a sterile barrier.",
      "Sterile items below waist level, behind you, or out of your line of sight are considered contaminated.",
      "Healthcare-associated infections (HAIs) are a leading cause of preventable harm — proper sterile technique is a critical nursing competency."
    ]
  },
  {
    id: "nasogastric-tube-insertion",
    title: "Nasogastric Tube Insertion",
    category: "Procedure",
    difficulty: "Advanced",
    icon: "ArrowDown",
    description: "Insert a nasogastric (NG) tube for gastric decompression or enteral feeding, verifying correct placement before use.",
    scenarioIntro: "You are a nurse on a surgical unit. Your patient is a 65-year-old who developed a small bowel obstruction and has been vomiting. The physician has ordered insertion of a nasogastric tube to low intermittent suction for gastric decompression. The patient is alert and cooperative but nauseated.",
    equipment: [
      "Nasogastric tube (appropriate size: 14-18 Fr for adults)",
      "Water-soluble lubricant",
      "60 mL catheter-tip syringe",
      "Stethoscope",
      "pH indicator strips",
      "Tape or commercial NG tube holder",
      "Emesis basin",
      "Glass of water with straw (if patient can swallow)",
      "Towel or drape",
      "Suction equipment (if ordered for decompression)",
      "Clean gloves",
      "Penlight",
      "Safety pin and rubber band (for securing to gown)"
    ],
    steps: [
      { id: "ngt-1", instruction: "Perform hand hygiene and gather all equipment.", rationale: "Infection prevention and ensures all supplies are available.", criticalStep: true },
      { id: "ngt-2", instruction: "Identify the patient using two identifiers and explain the procedure, including what to expect.", rationale: "Patient identification is a safety standard. Explanation reduces anxiety and improves cooperation during an uncomfortable procedure.", criticalStep: true },
      { id: "ngt-3", instruction: "Position the patient upright at 45-90 degrees with head slightly flexed forward.", rationale: "Upright position uses gravity to guide tube passage and reduces aspiration risk. Neck flexion closes the trachea and opens the esophagus.", criticalStep: true },
      { id: "ngt-4", instruction: "Inspect the nares for patency and select the most patent nostril.", rationale: "Checking for deviated septum, polyps, or obstruction ensures the tube can pass smoothly.", criticalStep: false },
      { id: "ngt-5", instruction: "Measure the tube: from the tip of the nose to the earlobe, then from the earlobe to the xiphoid process. Mark the measurement point on the tube.", rationale: "NEX measurement (Nose-Ear-Xiphoid) estimates the length needed to reach the stomach. Marking ensures you insert to the correct depth.", criticalStep: true },
      { id: "ngt-6", instruction: "Lubricate the first 10-15 cm of the tube with water-soluble lubricant.", rationale: "Lubrication reduces friction and mucosal trauma during insertion. Water-soluble lubricant is used because oil-based lubricants can cause lipoid pneumonia if aspirated.", criticalStep: true },
      { id: "ngt-7", instruction: "Insert the tube gently into the selected nostril, directing it along the floor of the nasal passage toward the ear on the same side.", rationale: "The floor of the nasal passage provides the most direct path. Directing toward the ear follows the natural anatomy.", criticalStep: true },
      { id: "ngt-8", instruction: "When the tube reaches the nasopharynx (resistance may be felt), ask the patient to tilt their chin to chest and begin sipping water through a straw.", rationale: "Chin tuck closes the airway and opens the esophagus. Swallowing water helps advance the tube into the esophagus rather than the trachea.", criticalStep: true },
      { id: "ngt-9", instruction: "Advance the tube to the pre-measured mark as the patient swallows. Stop immediately if the patient coughs forcefully, becomes cyanotic, or cannot speak.", rationale: "Coughing, cyanosis, or inability to speak indicates the tube may have entered the trachea. The tube must be withdrawn and reattempted.", criticalStep: true },
      { id: "ngt-10", instruction: "Verify tube placement using pH testing: aspirate gastric contents and test with pH indicator strip. Gastric pH should be 1-5.", rationale: "pH testing is the recommended bedside method for confirming gastric placement. X-ray confirmation may be required per facility policy.", criticalStep: true },
      { id: "ngt-11", instruction: "Secure the tube to the nose using tape or a commercial holder. Avoid pressure on the nares.", rationale: "Proper securing prevents tube migration or accidental removal. Pressure on the nares can cause skin breakdown.", criticalStep: false },
      { id: "ngt-12", instruction: "Connect the tube to suction as ordered (low intermittent suction for decompression) or cap if for feeding.", rationale: "Low intermittent suction prevents mucosal damage. Continuous suction can adhere to the gastric wall.", criticalStep: false },
      { id: "ngt-13", instruction: "Secure the tube to the patient's gown with a safety pin and rubber band to prevent pulling.", rationale: "Allows some movement without tension on the tube, preventing accidental dislodgement.", criticalStep: false },
      { id: "ngt-14", instruction: "Provide nasal and oral hygiene. Ensure the patient is comfortable.", rationale: "NG tubes cause mouth breathing and dryness. Oral care prevents mucous membrane breakdown.", criticalStep: false },
      { id: "ngt-15", instruction: "Perform hand hygiene and document: tube type, size, nostril used, insertion depth, verification method, patient tolerance, and drainage characteristics.", rationale: "Thorough documentation ensures continuity of care and legal record of the procedure.", criticalStep: true }
    ],
    commonErrors: [
      "Not measuring the tube before insertion (NEX measurement)",
      "Using oil-based lubricant instead of water-soluble lubricant",
      "Continuing to advance the tube when the patient is coughing or unable to speak",
      "Relying solely on auscultation (air bolus) for placement verification — this method is unreliable",
      "Not checking pH of aspirate to verify gastric placement",
      "Applying continuous instead of intermittent suction",
      "Not securing the tube properly, leading to migration or accidental removal"
    ],
    passingCriteria: "All critical steps must be performed correctly. Student must correctly measure the tube, insert using proper technique, verify placement with pH testing, and document the procedure.",
    clinicalPearls: [
      "The air bolus (auscultation) method alone is NOT reliable for confirming placement — pH testing or X-ray is required.",
      "Gastric pH is typically 1-5. Intestinal pH is 6-7. Respiratory aspirate pH is >7.",
      "If the patient is coughing, gagging excessively, or becomes cyanotic, STOP and withdraw the tube.",
      "Never force the tube against resistance — this could cause perforation.",
      "For patients who cannot swallow, advance the tube during exhalation when the epiglottis is most likely open."
    ],
    examLevel: "RN",
    timeLimit: "15 minutes",
    candidateInstructions: "Insert a nasogastric tube for gastric decompression. Demonstrate proper measurement, insertion technique, placement verification, and securing. Verbalize key safety checks throughout.",
    patientActorScript: "You are a 65-year-old who is nauseated and has been vomiting. You understand the tube is necessary but are anxious about the procedure. When the tube reaches the back of your throat, you gag slightly. Follow instructions to swallow water when asked. You do not cough persistently or become distressed.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 2 },
      { action: "Positions patient correctly (upright, chin flex)", marks: 2 },
      { action: "Measures NEX distance and marks tube", marks: 3 },
      { action: "Lubricates tube with water-soluble lubricant", marks: 2 },
      { action: "Inserts tube along nasal floor", marks: 2 },
      { action: "Instructs patient to swallow during advancement", marks: 2 },
      { action: "Stops if signs of respiratory placement occur", marks: 3 },
      { action: "Verifies placement with pH testing", marks: 3 },
      { action: "Secures tube without nasal pressure", marks: 1 }
    ],
    criticalFailCriteria: [
      "Continues advancing the tube despite signs of respiratory placement (persistent coughing, cyanosis)",
      "Fails to verify tube placement before use",
      "Uses oil-based lubricant",
      "Does not measure the tube before insertion"
    ],
    examinerQuestions: [
      { question: "Why is the auscultation method alone unreliable for confirming NG tube placement?", answer: "Air injected into a misplaced tube in the lung or esophagus can transmit sounds that mimic gastric placement. pH testing or X-ray provides reliable confirmation." },
      { question: "What pH range confirms gastric placement?", answer: "A pH of 1-5 is consistent with gastric placement. pH of 6 or higher may indicate intestinal or respiratory placement." },
      { question: "What complications can occur with NG tube insertion?", answer: "Nasal mucosal trauma, epistaxis, aspiration, esophageal or gastric perforation (rare), sinusitis, and tube displacement into the trachea." }
    ],
    teachingPoints: [
      "NEX measurement (Nose-Ear-Xiphoid) is the standard method for estimating insertion length.",
      "Water-soluble lubricant ONLY — oil-based lubricants can cause lipoid pneumonia if aspirated.",
      "Placement must be verified before every use: before feeding, before medication administration, and at least once per shift.",
      "Low intermittent suction is preferred for decompression to prevent mucosal damage from continuous suction.",
      "Monitor electrolytes in patients with NG suction — they lose hydrochloric acid, sodium, potassium, and water, which can cause metabolic alkalosis."
    ]
  },
  {
    id: "tracheostomy-suctioning",
    title: "Tracheostomy Suctioning",
    category: "Procedure",
    difficulty: "Advanced",
    icon: "Wind",
    description: "Perform endotracheal suctioning of a tracheostomy tube using sterile technique to maintain airway patency.",
    scenarioIntro: "You are caring for a 70-year-old patient with a tracheostomy placed one week ago following prolonged intubation. The patient has audible gurgling sounds and visible secretions at the tracheostomy opening. Oxygen saturation has dropped from 96% to 91%. You need to perform tracheostomy suctioning.",
    equipment: [
      "Sterile suction catheter kit (appropriate size)",
      "Suction machine with connecting tubing",
      "Sterile normal saline (for rinsing catheter)",
      "Sterile gloves",
      "Clean gloves",
      "Pulse oximeter",
      "Ambu bag with tracheostomy adapter",
      "Supplemental oxygen source",
      "Eye protection/face shield",
      "Documentation tools"
    ],
    steps: [
      { id: "ts-1", instruction: "Perform hand hygiene and gather all equipment.", rationale: "Infection prevention and preparation for an emergency procedure that must be done efficiently.", criticalStep: true },
      { id: "ts-2", instruction: "Identify the patient using two identifiers and explain the procedure.", rationale: "Patient safety standard. Even if the patient cannot speak, explanation provides reassurance.", criticalStep: true },
      { id: "ts-3", instruction: "Position the patient in semi-Fowler's position (30-45 degrees) with the neck slightly extended.", rationale: "Semi-Fowler's position facilitates lung expansion and makes the tracheostomy more accessible.", criticalStep: false },
      { id: "ts-4", instruction: "Apply pulse oximeter and note baseline oxygen saturation.", rationale: "Continuous monitoring during suctioning allows detection of desaturation requiring immediate intervention.", criticalStep: true },
      { id: "ts-5", instruction: "Pre-oxygenate the patient with 100% oxygen for at least 30 seconds using the ventilator or Ambu bag.", rationale: "Pre-oxygenation prevents hypoxia during suctioning, which temporarily removes air and oxygen from the airway.", criticalStep: true },
      { id: "ts-6", instruction: "Set suction pressure: adult 100-150 mmHg, child 100 mmHg, infant 60-80 mmHg.", rationale: "Excessive suction pressure causes mucosal damage and atelectasis. The minimum effective pressure should be used.", criticalStep: true },
      { id: "ts-7", instruction: "Open the sterile suction catheter kit using aseptic technique. Don sterile glove on the dominant hand and clean glove on the non-dominant hand.", rationale: "The dominant hand handles the sterile catheter. The non-dominant hand handles the non-sterile suction tubing.", criticalStep: true },
      { id: "ts-8", instruction: "Connect the catheter to the suction tubing using the non-dominant (clean) hand.", rationale: "The non-dominant hand manages the suction connection while the dominant hand keeps the catheter sterile.", criticalStep: false },
      { id: "ts-9", instruction: "Insert the suction catheter gently into the tracheostomy WITHOUT applying suction, until resistance is felt, then withdraw 1-2 cm.", rationale: "Suctioning during insertion causes mucosal trauma and removes oxygen. Withdrawing 1-2 cm moves the catheter off the carina, preventing mucosal damage.", criticalStep: true },
      { id: "ts-10", instruction: "Apply intermittent suction while slowly withdrawing the catheter in a rotating motion over no more than 10-15 seconds.", rationale: "Intermittent suction and rotation prevent mucosal damage. Limiting to 10-15 seconds prevents hypoxia.", criticalStep: true },
      { id: "ts-11", instruction: "Re-oxygenate the patient with 100% oxygen for at least 30 seconds between suction passes.", rationale: "Reoxygenation prevents cumulative hypoxia from multiple suction passes.", criticalStep: true },
      { id: "ts-12", instruction: "Repeat suctioning if needed (maximum 3 passes). Rinse the catheter with sterile saline between passes.", rationale: "More than 3 passes increases the risk of hypoxia, mucosal damage, and vagal stimulation (bradycardia).", criticalStep: false },
      { id: "ts-13", instruction: "Assess the patient after suctioning: breath sounds, SpO2, respiratory effort, and secretion characteristics.", rationale: "Post-suctioning assessment determines if the airway is clear and identifies complications.", criticalStep: true },
      { id: "ts-14", instruction: "Discard the catheter and gloves. Perform hand hygiene.", rationale: "Proper disposal prevents cross-contamination. The suction catheter is single-use.", criticalStep: true },
      { id: "ts-15", instruction: "Document: reason for suctioning, number of passes, secretion characteristics (color, consistency, amount), patient tolerance, and post-procedure assessment.", rationale: "Documentation tracks airway status and communicates findings to the care team.", criticalStep: false }
    ],
    commonErrors: [
      "Applying suction while inserting the catheter",
      "Suctioning for longer than 10-15 seconds per pass",
      "Not pre-oxygenating the patient before suctioning",
      "Using excessive suction pressure",
      "Not monitoring oxygen saturation during the procedure",
      "Breaking sterile technique with the dominant hand",
      "Performing more than 3 suction passes without reassessment",
      "Instilling normal saline into the tracheostomy before suctioning (this practice is no longer recommended)"
    ],
    passingCriteria: "All critical steps must be performed correctly. Student must pre-oxygenate, insert without suction, limit each pass to 10-15 seconds, reoxygenate between passes, and maintain sterile technique.",
    clinicalPearls: [
      "The maximum suction catheter size should be no more than half the internal diameter of the tracheostomy tube to prevent occlusion.",
      "Routine normal saline instillation before suctioning is NO longer recommended — evidence shows it dislodges bacterial biofilm deeper into the airways.",
      "Vagal stimulation during suctioning can cause bradycardia — have emergency equipment nearby.",
      "Green or yellow-green secretions suggest infection. Frank blood or blood-tinged secretions may indicate mucosal trauma from aggressive suctioning.",
      "Suction only when clinically indicated (audible secretions, visible secretions, desaturation), not on a rigid schedule."
    ],
    examLevel: "RN",
    timeLimit: "10 minutes",
    candidateInstructions: "Your patient has a tracheostomy and requires suctioning due to audible secretions and declining oxygen saturation. Perform tracheostomy suctioning using sterile technique. Verbalize your assessments and rationale throughout.",
    patientActorScript: "You are a 70-year-old with a tracheostomy who cannot speak. You appear slightly anxious but cooperative. You may cough when the suction catheter is inserted. You remain stable throughout the procedure.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 2 },
      { action: "Applies pulse oximeter and monitors SpO2", marks: 2 },
      { action: "Pre-oxygenates with 100% O2 for 30 seconds", marks: 3 },
      { action: "Sets appropriate suction pressure", marks: 2 },
      { action: "Maintains sterile technique with dominant hand", marks: 3 },
      { action: "Inserts catheter WITHOUT suction", marks: 3 },
      { action: "Limits suction pass to 10-15 seconds", marks: 3 },
      { action: "Reoxygenates between passes", marks: 2 }
    ],
    criticalFailCriteria: [
      "Applies suction during catheter insertion",
      "Fails to pre-oxygenate before suctioning",
      "Suctions for more than 15 seconds continuously",
      "Breaks sterile technique and does not recognize it",
      "Instills saline into the tracheostomy before suctioning"
    ],
    examinerQuestions: [
      { question: "Why should you NOT apply suction during catheter insertion?", answer: "Applying suction during insertion causes mucosal trauma to the airway lining and removes oxygen from the lungs, increasing the risk of hypoxia." },
      { question: "Why is saline instillation no longer recommended before suctioning?", answer: "Research shows that saline instillation does not loosen secretions but instead dislodges bacterial biofilm from the tube wall and pushes it deeper into the airways, increasing infection risk." },
      { question: "What complication can suctioning cause through vagal nerve stimulation?", answer: "Suctioning can stimulate the vagus nerve, causing bradycardia. In severe cases, this can lead to cardiac arrest. If bradycardia occurs, stop suctioning immediately and reoxygenate." }
    ],
    teachingPoints: [
      "Suction catheter size rule: divide the tracheostomy tube internal diameter by 2 and select the next smallest French size.",
      "Pre-oxygenation is mandatory before every suction attempt.",
      "Suction only when assessed as needed — unnecessary suctioning increases mucosal trauma risk.",
      "Closed (in-line) suction systems are preferred for mechanically ventilated patients as they maintain ventilation during suctioning.",
      "Always have emergency equipment at the bedside for tracheostomy patients: spare tracheostomy tube (same size and one size smaller), obturator, Ambu bag, and suction."
    ]
  },
  {
    id: "enteral-feeding",
    title: "Enteral Feeding Administration",
    category: "Procedure",
    difficulty: "Intermediate",
    icon: "Utensils",
    description: "Administer an enteral feeding via nasogastric or gastrostomy tube, including verification of tube placement and residual volume assessment.",
    scenarioIntro: "You are caring for a 72-year-old patient with dysphagia following a stroke. The patient has a nasogastric tube in place for enteral nutrition. The dietitian has ordered a bolus feeding of 240 mL of Jevity at room temperature, to be administered over 30 minutes. You need to verify tube placement, check residual volume, and administer the feeding.",
    equipment: [
      "Prescribed enteral formula (at room temperature)",
      "60 mL catheter-tip syringe",
      "Stethoscope",
      "pH indicator strips",
      "Feeding pump or gravity bag (depending on method)",
      "Clean gloves",
      "Towel or drape",
      "Water for flushing (30-50 mL)",
      "Documentation tools"
    ],
    steps: [
      { id: "ef-1", instruction: "Perform hand hygiene and gather supplies.", rationale: "Infection prevention and efficient procedure preparation.", criticalStep: true },
      { id: "ef-2", instruction: "Identify the patient using two identifiers and verify the feeding order (type, amount, rate, and frequency).", rationale: "Patient safety standard. Verifying the order prevents medication and nutrition errors.", criticalStep: true },
      { id: "ef-3", instruction: "Position the patient upright at 30-45 degrees (semi-Fowler's position).", rationale: "Upright positioning prevents aspiration by using gravity to keep formula in the stomach.", criticalStep: true },
      { id: "ef-4", instruction: "Verify tube placement before feeding: aspirate gastric contents and test pH (should be 1-5 for gastric placement).", rationale: "Confirming tube placement before every feeding prevents administering formula into the lungs.", criticalStep: true },
      { id: "ef-5", instruction: "Check gastric residual volume (GRV) by aspirating stomach contents with a 60 mL syringe.", rationale: "High residual volume may indicate delayed gastric emptying, increasing aspiration risk.", criticalStep: true },
      { id: "ef-6", instruction: "If GRV is less than 250-500 mL (per facility policy), return the aspirate to the stomach and proceed with feeding.", rationale: "Returning aspirate prevents loss of electrolytes and gastric acid. GRV thresholds vary by facility.", criticalStep: true },
      { id: "ef-7", instruction: "Flush the tube with 30 mL of water before the feeding.", rationale: "Flushing ensures tube patency and clears any residual from previous feedings or medications.", criticalStep: false },
      { id: "ef-8", instruction: "Administer the formula at the prescribed rate using a feeding pump or gravity method.", rationale: "Administering at the correct rate prevents abdominal distension, cramping, and dumping syndrome.", criticalStep: true },
      { id: "ef-9", instruction: "For bolus feeding via syringe, allow formula to flow by gravity — do not push the plunger.", rationale: "Gravity administration prevents rapid gastric distension and reduces nausea, cramping, and aspiration risk.", criticalStep: true },
      { id: "ef-10", instruction: "Flush the tube with 30-50 mL of water after the feeding is complete.", rationale: "Post-feeding flushing prevents tube clogging and provides additional hydration.", criticalStep: true },
      { id: "ef-11", instruction: "Keep the patient in an upright position (30-45 degrees) for at least 30-60 minutes after feeding.", rationale: "Upright positioning after feeding prevents aspiration of gastric contents.", criticalStep: true },
      { id: "ef-12", instruction: "Cap or clamp the tube after feeding is complete.", rationale: "Prevents air entry and leakage of gastric contents.", criticalStep: false },
      { id: "ef-13", instruction: "Perform hand hygiene and document: tube placement verification, GRV, formula type, volume administered, patient tolerance, and position maintained.", rationale: "Documentation ensures continuity of care and tracks nutritional intake.", criticalStep: false }
    ],
    commonErrors: [
      "Not verifying tube placement before feeding",
      "Not checking gastric residual volume",
      "Administering cold formula straight from the refrigerator",
      "Pushing the plunger during bolus syringe feeding instead of allowing gravity flow",
      "Laying the patient flat during or immediately after feeding",
      "Not flushing the tube before and after the feeding",
      "Not returning gastric aspirate to the stomach"
    ],
    passingCriteria: "All critical steps must be performed correctly. Student must verify tube placement, check residual volume, administer formula at the correct rate, flush the tube, and maintain upright positioning.",
    clinicalPearls: [
      "Always verify tube placement before EVERY feeding — tubes can migrate between feedings.",
      "Formula should be at room temperature — cold formula can cause cramping and diarrhea.",
      "If GRV exceeds the facility threshold (typically 250-500 mL), hold the feeding and notify the provider.",
      "Never add blue food coloring to formula to detect aspiration — this practice has been discontinued due to toxicity.",
      "Keep the head of bed elevated for 30-60 minutes after feeding to prevent aspiration."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "Administer a bolus enteral feeding to a patient with a nasogastric tube. Demonstrate tube placement verification, residual volume check, formula administration, and post-feeding care. Verbalize key safety checks.",
    patientActorScript: "You are a 72-year-old stroke patient who cannot swallow safely. You have a nasogastric tube. You are alert but have difficulty speaking. You tolerate the feeding without discomfort. If asked about nausea or pain, indicate you feel fine.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 2 },
      { action: "Verifies feeding order", marks: 1 },
      { action: "Positions patient at 30-45 degrees", marks: 2 },
      { action: "Verifies tube placement with pH testing", marks: 3 },
      { action: "Checks gastric residual volume", marks: 3 },
      { action: "Returns aspirate to stomach", marks: 1 },
      { action: "Flushes tube before and after feeding", marks: 2 },
      { action: "Administers formula by gravity (not pushing)", marks: 3 },
      { action: "Maintains upright position after feeding", marks: 2 },
      { action: "Documents procedure completely", marks: 1 }
    ],
    criticalFailCriteria: [
      "Administers feeding without verifying tube placement",
      "Does not check gastric residual volume",
      "Pushes bolus feeding rapidly with syringe plunger",
      "Positions patient flat during or immediately after feeding"
    ],
    examinerQuestions: [
      { question: "What is the significance of a high gastric residual volume?", answer: "High GRV indicates delayed gastric emptying, which increases aspiration risk. If GRV exceeds the facility threshold, the feeding should be held and the provider notified. Prokinetic agents may be ordered." },
      { question: "Why should formula be at room temperature?", answer: "Cold formula can cause gastric cramping, diarrhea, and patient discomfort. Formula should be removed from the refrigerator 30 minutes before feeding." },
      { question: "How do you manage a clogged feeding tube?", answer: "Attempt to flush with warm water using gentle pressure. If unsuccessful, use pancreatic enzyme solution or cola as per facility protocol. Never use excessive force as this can rupture the tube." }
    ],
    teachingPoints: [
      "Tube placement must be verified before every feeding, medication administration, and at least once per shift.",
      "Continuous feedings should be hung for no more than 4-8 hours (closed system up to 24 hours) to prevent bacterial growth.",
      "Free water flushes are essential for tube-fed patients to prevent dehydration — the formula alone may not meet fluid needs.",
      "Monitor for aspiration signs: cough, tachypnea, wheezing, fever, and elevated WBC.",
      "Medication administration through feeding tubes requires proper formulation — never crush enteric-coated or sustained-release medications."
    ]
  },
  {
    id: "respiratory-distress",
    title: "Acute Respiratory Distress",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "Wind",
    description: "Recognize and manage acute respiratory distress in an adult patient, including rapid assessment, oxygen administration, and escalation of care.",
    scenarioIntro: "You are a nurse on a medical unit. You enter the room of a 68-year-old patient with a history of heart failure who was admitted for pneumonia. The patient is sitting bolt upright, using accessory muscles, and appears anxious. Respiratory rate is 32, SpO2 is 86% on 2L nasal cannula, and the patient is unable to speak in full sentences.",
    equipment: [
      "Oxygen delivery devices (nasal cannula, simple mask, non-rebreather mask)",
      "Pulse oximeter",
      "Stethoscope",
      "Suction equipment",
      "Blood pressure cuff",
      "Cardiac monitor (if available)",
      "IV access supplies",
      "Emergency medications (as ordered)",
      "Ambu bag with mask",
      "Documentation tools"
    ],
    steps: [
      { id: "rd-1", instruction: "Rapidly assess the scene for safety and note the patient's general appearance, position, and distress level.", rationale: "Initial rapid assessment identifies the severity of respiratory distress and guides immediate interventions.", criticalStep: true },
      { id: "rd-2", instruction: "Call for help and activate the rapid response team if criteria are met.", rationale: "Respiratory distress can deteriorate rapidly. Early activation of the rapid response team improves outcomes.", criticalStep: true },
      { id: "rd-3", instruction: "Position the patient upright (high Fowler's position, 60-90 degrees) with legs dangling if tolerated.", rationale: "Upright positioning maximizes lung expansion and decreases venous return, reducing pulmonary congestion.", criticalStep: true },
      { id: "rd-4", instruction: "Immediately increase oxygen delivery: apply non-rebreather mask at 10-15 L/min to achieve target SpO2 of 94-98%.", rationale: "The patient is hypoxic (SpO2 86%). A non-rebreather mask delivers 80-95% FiO2 and is indicated for acute hypoxia.", criticalStep: true },
      { id: "rd-5", instruction: "Assess airway patency: look, listen, and feel. Suction if secretions are present.", rationale: "Airway obstruction from secretions, tongue, or foreign body must be cleared immediately.", criticalStep: true },
      { id: "rd-6", instruction: "Assess breathing: respiratory rate, depth, pattern, accessory muscle use, and bilateral chest expansion.", rationale: "Detailed breathing assessment identifies the type and severity of respiratory failure.", criticalStep: true },
      { id: "rd-7", instruction: "Auscultate lung sounds bilaterally.", rationale: "Auscultation differentiates causes: crackles (pulmonary edema), wheezes (bronchospasm), diminished sounds (effusion/pneumothorax).", criticalStep: true },
      { id: "rd-8", instruction: "Assess circulation: heart rate, blood pressure, capillary refill, and skin color.", rationale: "Tachycardia and hypotension may indicate cardiovascular decompensation secondary to respiratory failure.", criticalStep: false },
      { id: "rd-9", instruction: "Obtain IV access if not already in place.", rationale: "IV access allows rapid administration of emergency medications.", criticalStep: false },
      { id: "rd-10", instruction: "Continuously monitor SpO2, vital signs, and level of consciousness.", rationale: "Continuous monitoring detects deterioration. Decreasing LOC in respiratory distress is an ominous sign indicating impending respiratory failure.", criticalStep: true },
      { id: "rd-11", instruction: "Administer prescribed medications: bronchodilators, diuretics, or corticosteroids as ordered.", rationale: "Medication choice depends on the cause: bronchodilators for bronchospasm, diuretics for pulmonary edema, corticosteroids for inflammation.", criticalStep: false },
      { id: "rd-12", instruction: "Prepare for possible intubation by having an Ambu bag, suction, and intubation equipment readily available.", rationale: "Patients in severe respiratory distress may require mechanical ventilation. Being prepared saves critical time.", criticalStep: false },
      { id: "rd-13", instruction: "Communicate findings to the physician using SBAR format.", rationale: "SBAR provides structured communication that conveys critical information efficiently during emergencies.", criticalStep: true },
      { id: "rd-14", instruction: "Document the event: timeline, interventions, patient response, and notifications.", rationale: "Accurate documentation of a rapid deterioration event is critical for continuity and legal purposes.", criticalStep: false }
    ],
    commonErrors: [
      "Delaying oxygen administration while completing a full assessment",
      "Not escalating care quickly enough — waiting too long to call the rapid response team",
      "Laying the patient flat for examination during respiratory distress",
      "Using a nasal cannula at high flow rates when a non-rebreather mask is indicated",
      "Not reassessing after interventions to evaluate response",
      "Failing to recognize decreasing level of consciousness as a sign of impending respiratory failure",
      "Not preparing intubation equipment when the patient is deteriorating"
    ],
    passingCriteria: "Student must rapidly recognize respiratory distress, position the patient upright, escalate oxygen delivery, call for help, and communicate using SBAR. All critical steps must be performed in a timely manner.",
    clinicalPearls: [
      "SpO2 below 90% corresponds to a PaO2 of approximately 60 mmHg — this is the critical threshold where the oxyhemoglobin dissociation curve becomes steep.",
      "A silent chest in respiratory distress is ominous — it indicates air movement is so poor that breath sounds cannot be heard.",
      "Increasing confusion or drowsiness in a patient with respiratory distress suggests CO2 retention and impending respiratory failure.",
      "Tripod positioning (sitting forward with hands on knees) is a compensatory mechanism to maximize diaphragmatic excursion.",
      "In COPD patients, target SpO2 is 88-92% — high-flow oxygen can suppress hypoxic drive."
    ],
    examLevel: "RN",
    timeLimit: "10 minutes",
    candidateInstructions: "You enter the room of a patient in acute respiratory distress. Perform a rapid assessment, initiate appropriate interventions, and escalate care. Prioritize your actions and verbalize your clinical reasoning.",
    patientActorScript: "You are a 68-year-old struggling to breathe. You are sitting upright and leaning forward. You can only speak 2-3 words at a time between breaths. You appear anxious and scared. Your breathing is labored and fast.",
    examinerChecklist: [
      { action: "Recognizes severity of respiratory distress immediately", marks: 2 },
      { action: "Calls for help/activates rapid response", marks: 3 },
      { action: "Positions patient upright", marks: 2 },
      { action: "Escalates oxygen delivery appropriately", marks: 3 },
      { action: "Assesses airway patency", marks: 2 },
      { action: "Auscultates lung sounds bilaterally", marks: 2 },
      { action: "Monitors SpO2 continuously", marks: 2 },
      { action: "Communicates using SBAR", marks: 2 },
      { action: "Prepares for possible intubation", marks: 2 }
    ],
    criticalFailCriteria: [
      "Delays oxygen administration while completing other assessments",
      "Does not call for help or activate rapid response",
      "Lays the patient flat during respiratory distress",
      "Fails to recognize signs of impending respiratory failure"
    ],
    examinerQuestions: [
      { question: "What oxygen delivery device provides the highest concentration of oxygen?", answer: "A non-rebreather mask delivers 80-95% FiO2 at 10-15 L/min. For higher concentrations, mechanical ventilation with 100% FiO2 is required." },
      { question: "What are the signs of impending respiratory failure?", answer: "Decreasing level of consciousness, increasing fatigue, paradoxical breathing (seesaw pattern), bradycardia (replacing tachycardia), cyanosis, and a silent chest." },
      { question: "Why is the target SpO2 different for COPD patients?", answer: "COPD patients may rely on hypoxic drive for breathing stimulus. Excessive oxygen can suppress this drive, leading to hypoventilation, CO2 retention, and respiratory arrest. Target SpO2 is 88-92%." }
    ],
    teachingPoints: [
      "ABC prioritization: Airway first, then Breathing, then Circulation. In respiratory distress, airway and breathing are the immediate priorities.",
      "Oxygen is a medication — it should be titrated to a target SpO2 and ordered appropriately.",
      "Early recognition and intervention for respiratory distress prevents respiratory arrest.",
      "The rapid response team should be activated when a patient meets trigger criteria, including SpO2 <90%, RR >30, or acute change in mental status.",
      "SBAR communication during emergencies: Situation, Background, Assessment, Recommendation."
    ]
  },
  {
    id: "acute-asthma",
    title: "Acute Asthma Attack",
    category: "Acute Care",
    difficulty: "Intermediate",
    icon: "Wind",
    description: "Recognize and manage an acute asthma exacerbation, including assessment of severity, bronchodilator administration, and monitoring of response to treatment.",
    scenarioIntro: "You are a nurse in the emergency department. A 28-year-old patient arrives via ambulance with an acute asthma attack. The patient is sitting upright, using accessory muscles, and can speak only 1-2 words at a time. Peak expiratory flow rate (PEFR) is 35% of predicted. SpO2 is 89% on room air.",
    equipment: [
      "Nebulizer with mask or mouthpiece",
      "Metered-dose inhaler (MDI) with spacer",
      "Prescribed bronchodilators (salbutamol/albuterol)",
      "Prescribed corticosteroids (oral or IV)",
      "Oxygen delivery devices",
      "Pulse oximeter",
      "Stethoscope",
      "Peak flow meter",
      "IV access supplies",
      "Cardiac monitor",
      "Documentation tools"
    ],
    steps: [
      { id: "aa-1", instruction: "Rapidly assess the severity of the asthma exacerbation: ability to speak, respiratory rate, accessory muscle use, and SpO2.", rationale: "Severity classification guides treatment intensity. This patient shows signs of a severe or life-threatening attack.", criticalStep: true },
      { id: "aa-2", instruction: "Apply supplemental oxygen immediately to maintain SpO2 ≥ 94%.", rationale: "Hypoxemia during an acute asthma attack indicates severe bronchospasm and must be corrected immediately.", criticalStep: true },
      { id: "aa-3", instruction: "Position the patient upright (high Fowler's) or in whatever position they find most comfortable for breathing.", rationale: "Upright positioning maximizes lung expansion. Forcing a position may worsen anxiety and dyspnea.", criticalStep: true },
      { id: "aa-4", instruction: "Administer rapid-acting bronchodilator (salbutamol/albuterol) via nebulizer as prescribed.", rationale: "Short-acting beta-2 agonists are the first-line treatment for acute bronchospasm, causing smooth muscle relaxation in the airways.", criticalStep: true },
      { id: "aa-5", instruction: "Auscultate lung sounds before and after bronchodilator administration.", rationale: "Pre-treatment auscultation provides a baseline. Post-treatment improvement in wheezing or air entry indicates response to therapy.", criticalStep: true },
      { id: "aa-6", instruction: "Administer ipratropium bromide via nebulizer if prescribed (often combined with salbutamol in severe attacks).", rationale: "Ipratropium is an anticholinergic bronchodilator that provides additional bronchodilation when used with a beta-2 agonist in severe exacerbations.", criticalStep: false },
      { id: "aa-7", instruction: "Administer systemic corticosteroids as prescribed (oral prednisone or IV methylprednisolone).", rationale: "Corticosteroids reduce airway inflammation and should be given early in moderate-to-severe exacerbations to prevent worsening.", criticalStep: true },
      { id: "aa-8", instruction: "Establish IV access.", rationale: "IV access allows administration of emergency medications (IV magnesium sulfate, epinephrine) if the patient deteriorates.", criticalStep: false },
      { id: "aa-9", instruction: "Monitor vital signs, SpO2, and respiratory status continuously.", rationale: "Continuous monitoring detects improvement or deterioration. A patient who becomes silent may be worsening, not improving.", criticalStep: true },
      { id: "aa-10", instruction: "Reassess peak expiratory flow rate (PEFR) after bronchodilator administration.", rationale: "PEFR provides objective measurement of airway obstruction. An improving PEFR confirms response to treatment.", criticalStep: false },
      { id: "aa-11", instruction: "Assess for signs of a life-threatening attack: silent chest, cyanosis, exhaustion, confusion, bradycardia.", rationale: "Life-threatening signs require immediate escalation including possible intubation and ICU admission.", criticalStep: true },
      { id: "aa-12", instruction: "Provide emotional support and encourage slow, pursed-lip breathing if the patient is able.", rationale: "Anxiety worsens bronchospasm. Calm reassurance and breathing techniques can reduce respiratory distress.", criticalStep: false },
      { id: "aa-13", instruction: "Notify the physician of treatment response and prepare for escalation if the patient is not improving.", rationale: "Non-responsive severe asthma may require IV magnesium sulfate, IV aminophylline, or mechanical ventilation.", criticalStep: true },
      { id: "aa-14", instruction: "Document: initial assessment, severity classification, treatments administered, response to treatment, and ongoing monitoring.", rationale: "Documentation tracks the clinical trajectory and supports treatment decisions.", criticalStep: false }
    ],
    commonErrors: [
      "Delaying bronchodilator administration while completing a full assessment",
      "Interpreting a quiet or silent chest as improvement when it indicates worsening obstruction",
      "Not administering systemic corticosteroids early",
      "Failing to reassess after bronchodilator treatment",
      "Not monitoring for life-threatening signs during treatment",
      "Forgetting to check PEFR as an objective measure of improvement",
      "Providing sedatives or anxiolytics (respiratory depressants) to calm the patient"
    ],
    passingCriteria: "Student must rapidly classify severity, administer oxygen, give bronchodilator therapy, auscultate before and after treatment, and monitor for signs of deterioration. All critical steps must be performed in the correct priority sequence.",
    clinicalPearls: [
      "A SILENT CHEST during an asthma attack is a RED FLAG — it means air movement is so poor that wheezing cannot be produced. This is life-threatening.",
      "Do NOT sedate an asthmatic patient in distress — sedatives and anxiolytics are respiratory depressants.",
      "Pulsus paradoxus (drop in systolic BP >10 mmHg during inspiration) is a sign of severe asthma.",
      "PEFR classification: >80% = mild, 50-80% = moderate, <50% = severe, <25% = life-threatening.",
      "Corticosteroids take 4-6 hours to reach peak effect — give them early, not as a last resort."
    ],
    examLevel: "RPN/RN",
    timeLimit: "12 minutes",
    candidateInstructions: "A patient presents with an acute asthma exacerbation. Assess severity, initiate treatment, and monitor response. Verbalize your clinical reasoning and prioritization throughout.",
    patientActorScript: "You are a 28-year-old having a severe asthma attack. You are struggling to breathe and can only speak 1-2 words at a time. You are anxious and scared. After nebulizer treatment, your breathing gradually improves and you can speak in short sentences. You remain slightly wheezy.",
    examinerChecklist: [
      { action: "Rapidly assesses severity of exacerbation", marks: 2 },
      { action: "Applies oxygen immediately", marks: 3 },
      { action: "Positions patient upright", marks: 1 },
      { action: "Administers bronchodilator promptly", marks: 3 },
      { action: "Auscultates lung sounds pre and post treatment", marks: 3 },
      { action: "Administers corticosteroids as prescribed", marks: 2 },
      { action: "Monitors for life-threatening signs", marks: 3 },
      { action: "Communicates response to physician", marks: 2 },
      { action: "Provides emotional support", marks: 1 }
    ],
    criticalFailCriteria: [
      "Delays bronchodilator treatment while performing non-urgent tasks",
      "Interprets a silent chest as improvement",
      "Administers sedative or anxiolytic medication",
      "Does not apply supplemental oxygen to a hypoxic patient"
    ],
    examinerQuestions: [
      { question: "What does a silent chest indicate during an asthma attack?", answer: "A silent chest indicates such severe bronchospasm that there is insufficient air movement to generate wheeze sounds. This is a life-threatening sign requiring immediate escalation." },
      { question: "Why are corticosteroids given in acute asthma?", answer: "Corticosteroids reduce the inflammatory component of asthma. They reduce airway edema, mucus production, and inflammatory cell infiltration. They take 4-6 hours for peak effect, so early administration is essential." },
      { question: "When would you escalate to IV magnesium sulfate?", answer: "IV magnesium sulfate is indicated in severe acute asthma that is not responding to initial bronchodilator therapy. It acts as a smooth muscle relaxant and bronchodilator." }
    ],
    teachingPoints: [
      "Asthma severity classification determines the level of treatment required.",
      "The three pillars of acute asthma management: bronchodilators, oxygen, and systemic corticosteroids.",
      "Beta-2 agonists (salbutamol) work within 5-15 minutes; corticosteroids take 4-6 hours for peak anti-inflammatory effect.",
      "Always reassess after every intervention — treatment response determines next steps.",
      "Discharge planning after acute asthma must include action plan review, inhaler technique, and trigger avoidance education."
    ]
  },
  {
    id: "pulmonary-embolism",
    title: "Pulmonary Embolism Recognition",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "AlertTriangle",
    description: "Recognize the signs and symptoms of pulmonary embolism, perform rapid assessment, initiate emergency interventions, and escalate care appropriately.",
    scenarioIntro: "You are a nurse on a post-surgical unit. Your patient is a 52-year-old who underwent a total knee replacement 3 days ago. The patient suddenly develops acute dyspnea, sharp pleuritic chest pain, tachycardia (HR 118), and is anxious. SpO2 is 88% on room air. The patient's left calf is slightly swollen and warm.",
    equipment: [
      "Oxygen delivery devices",
      "Pulse oximeter",
      "Cardiac monitor",
      "Stethoscope",
      "Blood pressure cuff",
      "IV access supplies",
      "Emergency cart",
      "Documentation tools"
    ],
    steps: [
      { id: "pe-1", instruction: "Recognize the constellation of symptoms: sudden dyspnea, pleuritic chest pain, tachycardia, and desaturation in a post-surgical patient.", rationale: "This presentation is classic for pulmonary embolism. Post-surgical immobility is a major risk factor for venous thromboembolism.", criticalStep: true },
      { id: "pe-2", instruction: "Call for help and notify the physician immediately — state suspicion of pulmonary embolism.", rationale: "PE is a life-threatening emergency. Early physician notification expedites diagnostic imaging and anticoagulation therapy.", criticalStep: true },
      { id: "pe-3", instruction: "Apply high-flow oxygen via non-rebreather mask to maintain SpO2 ≥ 94%.", rationale: "The patient is acutely hypoxic due to ventilation-perfusion mismatch caused by the embolism.", criticalStep: true },
      { id: "pe-4", instruction: "Position the patient in a high Fowler's position to optimize ventilation.", rationale: "Upright positioning maximizes lung expansion and reduces the work of breathing.", criticalStep: true },
      { id: "pe-5", instruction: "Obtain IV access if not already in place (large-bore preferred).", rationale: "IV access allows rapid administration of fluids, anticoagulants, and emergency medications.", criticalStep: true },
      { id: "pe-6", instruction: "Apply continuous cardiac monitoring and monitor for dysrhythmias.", rationale: "PE can cause right heart strain, leading to dysrhythmias such as sinus tachycardia, right bundle branch block, or S1Q3T3 pattern.", criticalStep: true },
      { id: "pe-7", instruction: "Obtain vital signs and assess hemodynamic stability.", rationale: "Massive PE can cause hemodynamic instability (hypotension, shock), which changes the treatment urgency.", criticalStep: true },
      { id: "pe-8", instruction: "Assess the lower extremities for signs of deep vein thrombosis: unilateral swelling, warmth, tenderness, positive Homans sign.", rationale: "DVT is the most common source of pulmonary embolism. Finding DVT signs supports the clinical suspicion.", criticalStep: false },
      { id: "pe-9", instruction: "Anticipate and prepare for diagnostic testing: CT pulmonary angiography (CTPA), D-dimer, ABG, CBC, coagulation studies.", rationale: "CTPA is the gold standard for PE diagnosis. D-dimer is a screening test — a negative result helps rule out PE, but a positive result is non-specific.", criticalStep: false },
      { id: "pe-10", instruction: "Administer anticoagulation therapy as ordered (IV heparin or LMWH).", rationale: "Anticoagulation prevents clot extension and new clot formation. Unfractionated heparin IV is preferred in acute massive PE.", criticalStep: true },
      { id: "pe-11", instruction: "Keep the patient calm and minimize activity. Do NOT massage the affected extremity.", rationale: "Reducing activity decreases oxygen demand. Massaging a leg with DVT can dislodge clot fragments, worsening the PE.", criticalStep: true },
      { id: "pe-12", instruction: "Monitor for signs of massive PE: hypotension, distended neck veins, altered consciousness, cardiac arrest.", rationale: "Massive PE causes obstructive shock. Thrombolytics or surgical embolectomy may be required.", criticalStep: true },
      { id: "pe-13", instruction: "Provide emotional support and reassurance to the patient.", rationale: "Patients experiencing PE are often terrified. Anxiety increases oxygen consumption and heart rate.", criticalStep: false },
      { id: "pe-14", instruction: "Document: symptoms, timeline, interventions, patient response, and communications with the medical team.", rationale: "Accurate documentation of the acute event is critical for continuity of care and legal records.", criticalStep: false }
    ],
    commonErrors: [
      "Not recognizing the classic triad of PE: dyspnea, chest pain, and tachycardia in a high-risk patient",
      "Delaying physician notification while completing a full assessment",
      "Not applying high-flow oxygen to a hypoxic patient",
      "Massaging or manipulating a swollen extremity suspected of DVT",
      "Failing to apply cardiac monitoring",
      "Not anticipating the need for anticoagulation",
      "Attributing symptoms to anxiety or pain without considering PE"
    ],
    passingCriteria: "Student must recognize PE symptoms, immediately notify the physician, apply high-flow oxygen, establish cardiac monitoring, and initiate anticoagulation as ordered. All critical steps must be performed promptly.",
    clinicalPearls: [
      "Virchow's triad of PE risk: venous stasis (immobility), vessel injury (surgery), and hypercoagulability.",
      "The classic triad of PE (dyspnea, chest pain, tachycardia) is present in only about 20% of cases — maintain a high index of suspicion.",
      "NEVER massage a swollen extremity with suspected DVT — this can dislodge the clot and worsen PE.",
      "D-dimer is useful for ruling out PE (high negative predictive value) but is non-specific — elevated D-dimer alone does not confirm PE.",
      "Massive PE with hemodynamic instability may require thrombolytic therapy (tPA) or surgical embolectomy."
    ],
    examLevel: "RN",
    timeLimit: "12 minutes",
    candidateInstructions: "Your post-surgical patient suddenly develops dyspnea, chest pain, and tachycardia. Recognize the likely diagnosis, initiate appropriate interventions, and escalate care. Verbalize your clinical reasoning.",
    patientActorScript: "You are a 52-year-old, 3 days after knee surgery. You suddenly feel very short of breath and have a sharp chest pain that worsens when you breathe in. You are scared and anxious. Your left leg feels swollen and sore. You can speak in short sentences with effort.",
    examinerChecklist: [
      { action: "Recognizes symptoms consistent with PE", marks: 3 },
      { action: "Calls for help and notifies physician immediately", marks: 3 },
      { action: "Applies high-flow oxygen", marks: 2 },
      { action: "Positions patient upright", marks: 1 },
      { action: "Establishes IV access", marks: 2 },
      { action: "Applies cardiac monitoring", marks: 2 },
      { action: "Assesses lower extremities for DVT", marks: 2 },
      { action: "Does NOT massage swollen extremity", marks: 2 },
      { action: "Anticipates anticoagulation therapy", marks: 2 },
      { action: "Monitors for hemodynamic instability", marks: 1 }
    ],
    criticalFailCriteria: [
      "Fails to recognize signs of PE in a high-risk patient",
      "Does not notify physician or escalate care",
      "Massages or manipulates the swollen extremity",
      "Does not apply supplemental oxygen to a desaturating patient"
    ],
    examinerQuestions: [
      { question: "What is Virchow's triad and how does it apply to this patient?", answer: "Virchow's triad includes venous stasis (post-surgical immobility), vessel wall injury (surgical trauma), and hypercoagulability (stress response to surgery). All three increase the risk of DVT and subsequent PE." },
      { question: "What is the gold standard diagnostic test for PE?", answer: "CT Pulmonary Angiography (CTPA) is the gold standard. It provides direct visualization of the clot in the pulmonary vasculature." },
      { question: "What is the difference between massive and submassive PE?", answer: "Massive PE presents with hemodynamic instability (systolic BP <90 mmHg) and may require thrombolytics. Submassive PE shows right ventricular dysfunction without hypotension and is treated with anticoagulation alone." }
    ],
    teachingPoints: [
      "PE prevention is a nursing priority: early ambulation, sequential compression devices, and anticoagulant prophylaxis.",
      "Post-surgical patients are at highest risk for PE in the first 2 weeks, with peak incidence around days 3-7.",
      "Acute right heart failure in PE presents with: JVD, hypotension, and tachycardia — this is obstructive shock.",
      "Therapeutic anticoagulation with heparin does NOT dissolve the existing clot — it prevents further clot formation while the body's fibrinolytic system dissolves the existing clot.",
      "INR and aPTT monitoring are essential for patients on warfarin and heparin, respectively."
    ]
  },
  {
    id: "pneumonia-assessment",
    title: "Pneumonia Assessment",
    category: "Acute Care",
    difficulty: "Intermediate",
    icon: "Stethoscope",
    description: "Perform a comprehensive assessment of a patient with community-acquired pneumonia, including respiratory evaluation, risk stratification, and monitoring.",
    scenarioIntro: "You are a nurse on a medical unit. Your patient is a 78-year-old admitted with community-acquired pneumonia. The patient has a productive cough with yellow-green sputum, fever of 38.9°C, and reports pleuritic chest pain. Current SpO2 is 92% on 2L nasal cannula.",
    equipment: [
      "Stethoscope",
      "Pulse oximeter",
      "Thermometer",
      "Blood pressure cuff",
      "Sputum collection container",
      "Oxygen delivery devices",
      "IV access supplies",
      "Documentation tools"
    ],
    steps: [
      { id: "pna-1", instruction: "Perform hand hygiene and don appropriate PPE based on isolation precautions.", rationale: "Pneumonia may require droplet precautions depending on the pathogen. Hand hygiene prevents cross-contamination.", criticalStep: true },
      { id: "pna-2", instruction: "Identify the patient using two identifiers and explain the assessment.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "pna-3", instruction: "Obtain a complete set of vital signs including temperature, heart rate, blood pressure, respiratory rate, and SpO2.", rationale: "Vital signs establish baseline severity. Fever, tachycardia, tachypnea, and hypoxia are common in pneumonia.", criticalStep: true },
      { id: "pna-4", instruction: "Assess respiratory status: rate, depth, pattern, work of breathing, accessory muscle use, and ability to speak in full sentences.", rationale: "Respiratory assessment quantifies the degree of respiratory compromise.", criticalStep: true },
      { id: "pna-5", instruction: "Auscultate lung sounds bilaterally, comparing side to side from apex to base.", rationale: "Pneumonia produces adventitious sounds: crackles (consolidation), bronchial breath sounds over affected areas, and may have diminished sounds if effusion is present.", criticalStep: true },
      { id: "pna-6", instruction: "Assess cough: frequency, productivity, and sputum characteristics (color, consistency, amount, odor).", rationale: "Yellow-green sputum suggests bacterial infection. Rust-colored sputum is classic for pneumococcal pneumonia. Foul-smelling sputum suggests anaerobic infection.", criticalStep: true },
      { id: "pna-7", instruction: "Assess pain using a standardized pain scale. Note pleuritic characteristics (sharp, worsens with inspiration).", rationale: "Pleuritic chest pain from pneumonia worsens with deep breathing and coughing, which can impair ventilation if untreated.", criticalStep: false },
      { id: "pna-8", instruction: "Assess hydration status: skin turgor, mucous membranes, urine output, and fluid intake.", rationale: "Fever and tachypnea cause insensible fluid losses. Dehydration thickens secretions, making them harder to clear.", criticalStep: false },
      { id: "pna-9", instruction: "Assess mental status and orientation, especially in elderly patients.", rationale: "Confusion may be the only presenting symptom of pneumonia in elderly patients. Altered mental status also indicates severe pneumonia (CURB-65 criterion).", criticalStep: true },
      { id: "pna-10", instruction: "Review and collect prescribed diagnostic specimens: sputum culture, blood cultures, and blood work (CBC, CRP, procalcitonin).", rationale: "Cultures guide antibiotic therapy. Procalcitonin helps differentiate bacterial from viral infection.", criticalStep: false },
      { id: "pna-11", instruction: "Ensure prescribed antibiotics are administered within the ordered timeframe.", rationale: "Early antibiotic administration (ideally within 4 hours of admission) is associated with improved outcomes in pneumonia.", criticalStep: true },
      { id: "pna-12", instruction: "Encourage deep breathing, coughing, and use of incentive spirometry every 1-2 hours while awake.", rationale: "Deep breathing and coughing mobilize secretions and prevent atelectasis in unaffected lung tissue.", criticalStep: false },
      { id: "pna-13", instruction: "Monitor oxygen saturation and adjust supplemental oxygen as ordered to maintain target SpO2.", rationale: "Titrating oxygen ensures adequate oxygenation without risk of oxygen toxicity.", criticalStep: true },
      { id: "pna-14", instruction: "Document assessment findings, interventions, and patient response.", rationale: "Documentation ensures continuity of care and tracks clinical trajectory.", criticalStep: false }
    ],
    commonErrors: [
      "Not auscultating all lung fields bilaterally for comparison",
      "Failing to recognize altered mental status as a sign of severe pneumonia in elderly patients",
      "Not assessing sputum characteristics for clinical clues",
      "Delaying antibiotic administration",
      "Not encouraging deep breathing exercises and incentive spirometry",
      "Overlooking dehydration from fever and tachypnea",
      "Not applying appropriate isolation precautions"
    ],
    passingCriteria: "Student must perform a thorough respiratory assessment including bilateral auscultation, assess sputum characteristics, recognize severity indicators, and ensure timely antibiotic administration. All critical steps must be completed.",
    clinicalPearls: [
      "In elderly patients, pneumonia may present atypically: confusion, falls, or decreased appetite may be the ONLY symptoms — fever and cough may be absent.",
      "CURB-65 severity scoring: Confusion, Urea >7 mmol/L, Respiratory rate ≥30, Blood pressure <90/60, age ≥65. Score ≥3 = high severity.",
      "Sputum culture should be collected BEFORE starting antibiotics for accurate pathogen identification.",
      "Aspiration pneumonia is common in stroke patients, those with dysphagia, and patients with decreased LOC.",
      "Crackles in pneumonia typically do NOT clear with coughing (unlike atelectasis), and bronchial breath sounds may be heard over consolidated lung tissue."
    ],
    examLevel: "RPN/RN",
    timeLimit: "12 minutes",
    candidateInstructions: "Perform a comprehensive assessment of a patient admitted with community-acquired pneumonia. Assess respiratory status, identify severity indicators, and verbalize your clinical reasoning and nursing priorities.",
    patientActorScript: "You are a 78-year-old admitted with pneumonia. You have a productive cough with thick yellow-green sputum. You have a fever and feel weak. You have sharp chest pain when you take a deep breath. You are oriented but somewhat confused about the date.",
    examinerChecklist: [
      { action: "Performs hand hygiene and dons appropriate PPE", marks: 2 },
      { action: "Obtains complete vital signs", marks: 2 },
      { action: "Assesses respiratory status comprehensively", marks: 2 },
      { action: "Auscultates lung sounds bilaterally", marks: 3 },
      { action: "Assesses sputum characteristics", marks: 2 },
      { action: "Assesses mental status (especially in elderly)", marks: 3 },
      { action: "Ensures timely antibiotic administration", marks: 2 },
      { action: "Encourages deep breathing/incentive spirometry", marks: 1 },
      { action: "Monitors and adjusts oxygen therapy", marks: 2 },
      { action: "Documents findings", marks: 1 }
    ],
    criticalFailCriteria: [
      "Fails to auscultate lung sounds",
      "Does not assess mental status in an elderly patient with pneumonia",
      "Delays antibiotic administration without clinical justification",
      "Does not recognize or report hypoxia"
    ],
    examinerQuestions: [
      { question: "What is the CURB-65 score and what does it assess?", answer: "CURB-65 is a severity scoring tool for community-acquired pneumonia: Confusion, Urea >7 mmol/L, Respiratory rate ≥30, Blood pressure <90/60, and age ≥65. Each criterion scores 1 point. Score 0-1 = outpatient treatment, 2 = hospital admission, ≥3 = ICU consideration." },
      { question: "Why might an elderly patient with pneumonia not have a fever?", answer: "Elderly patients often have a blunted immune response (immunosenescence), which may prevent the typical febrile response. Atypical presentations are common." },
      { question: "Why should sputum cultures be collected before starting antibiotics?", answer: "Antibiotics can kill or inhibit bacterial growth, making it difficult to identify the causative organism. Pre-antibiotic specimens provide the most accurate pathogen identification." }
    ],
    teachingPoints: [
      "Pneumonia is a leading cause of death in the elderly. Early recognition and treatment are critical.",
      "Atypical pneumonia presentations in the elderly: confusion, falls, incontinence, decreased appetite — often WITHOUT classic respiratory symptoms.",
      "Incentive spirometry: 10 repetitions every 1-2 hours while awake helps prevent atelectasis and promotes lung expansion.",
      "Aspiration prevention: HOB elevated ≥30 degrees, assess swallowing before oral intake, and provide oral care.",
      "Pneumococcal and influenza vaccinations are key prevention strategies, especially for patients over 65."
    ]
  },
  {
    id: "sepsis-recognition",
    title: "Sepsis Recognition",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "Thermometer",
    description: "Recognize early signs of sepsis using screening criteria, initiate the sepsis bundle, and escalate care according to evidence-based guidelines.",
    scenarioIntro: "You are a nurse on a medical unit. Your patient is a 64-year-old admitted two days ago for a urinary tract infection. During your assessment, you notice the patient has become confused, with a temperature of 38.8°C, heart rate of 112, respiratory rate of 24, and blood pressure of 88/56 mmHg. SpO2 is 93% on room air.",
    equipment: [
      "Sepsis screening tool",
      "Blood culture collection supplies (2 sets)",
      "IV access supplies (large-bore)",
      "IV crystalloid fluids (normal saline or lactated Ringer's)",
      "Broad-spectrum antibiotics (as prescribed)",
      "Lactate blood draw supplies",
      "Oxygen delivery devices",
      "Continuous monitoring equipment",
      "Urinary catheter (for output monitoring)",
      "Documentation tools"
    ],
    steps: [
      { id: "sr-1", instruction: "Recognize the clinical picture: infection source (UTI) plus systemic signs (tachycardia, tachypnea, fever, hypotension, altered mental status).", rationale: "This presentation meets SIRS criteria and qSOFA criteria (altered mentation, SBP ≤100, RR ≥22), strongly suggesting sepsis.", criticalStep: true },
      { id: "sr-2", instruction: "Call for help immediately and notify the physician. State: 'I suspect sepsis in my patient.'", rationale: "Sepsis is a time-critical emergency. Every hour delay in treatment increases mortality. Early physician notification triggers the sepsis bundle.", criticalStep: true },
      { id: "sr-3", instruction: "Apply supplemental oxygen to maintain SpO2 ≥ 94%.", rationale: "Tissue hypoxia in sepsis is caused by both poor perfusion and respiratory compromise. Supplemental oxygen addresses the respiratory component.", criticalStep: true },
      { id: "sr-4", instruction: "Draw blood cultures (2 sets from 2 different sites) BEFORE starting antibiotics.", rationale: "Blood cultures identify the causative organism and guide targeted antibiotic therapy. Drawing before antibiotics increases the yield.", criticalStep: true },
      { id: "sr-5", instruction: "Draw a serum lactate level.", rationale: "Lactate is a biomarker for tissue hypoperfusion. Lactate ≥2 mmol/L in sepsis indicates tissue hypoxia. Lactate ≥4 mmol/L indicates severe sepsis/septic shock.", criticalStep: true },
      { id: "sr-6", instruction: "Establish large-bore IV access (18-gauge or larger) and begin rapid fluid resuscitation: 30 mL/kg of crystalloid within the first hour.", rationale: "Aggressive fluid resuscitation restores intravascular volume and improves tissue perfusion. 30 mL/kg is the Surviving Sepsis Campaign recommendation.", criticalStep: true },
      { id: "sr-7", instruction: "Administer broad-spectrum IV antibiotics within 1 hour of sepsis recognition.", rationale: "Each hour delay in antibiotic administration in sepsis increases mortality by approximately 7.6%. The 1-hour target is a critical performance metric.", criticalStep: true },
      { id: "sr-8", instruction: "Insert a urinary catheter to monitor urine output hourly.", rationale: "Urine output is a sensitive indicator of renal perfusion. Target is ≥0.5 mL/kg/hr. Oliguria indicates ongoing hypoperfusion.", criticalStep: false },
      { id: "sr-9", instruction: "Apply continuous cardiac monitoring and monitor vital signs every 15 minutes.", rationale: "Septic patients can deteriorate rapidly. Frequent monitoring detects changes requiring intervention.", criticalStep: true },
      { id: "sr-10", instruction: "Reassess after initial fluid bolus: blood pressure, heart rate, mental status, urine output, and lactate.", rationale: "Reassessment determines if the patient is responding to treatment or progressing to septic shock requiring vasopressors.", criticalStep: true },
      { id: "sr-11", instruction: "If hypotension persists despite fluid resuscitation, anticipate vasopressor initiation (norepinephrine is first-line).", rationale: "Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP ≥65 mmHg despite adequate fluid resuscitation.", criticalStep: false },
      { id: "sr-12", instruction: "Reassess lactate within 2-4 hours to evaluate response to treatment.", rationale: "Lactate clearance (decrease by ≥10% from baseline) indicates improving tissue perfusion and is associated with better outcomes.", criticalStep: false },
      { id: "sr-13", instruction: "Document the timeline of the sepsis bundle: time of recognition, cultures drawn, antibiotics administered, fluids started, and lactate drawn.", rationale: "Sepsis bundle compliance is a quality metric. Accurate documentation of timing is critical for quality improvement.", criticalStep: true }
    ],
    commonErrors: [
      "Not recognizing sepsis in a patient with an existing infection who develops systemic signs",
      "Starting antibiotics BEFORE drawing blood cultures (reduces culture sensitivity)",
      "Delaying fluid resuscitation while waiting for laboratory results",
      "Not calculating the correct fluid bolus (30 mL/kg)",
      "Failing to reassess after initial interventions",
      "Not monitoring lactate as a marker of treatment response",
      "Not documenting the timeline of the sepsis bundle"
    ],
    passingCriteria: "Student must recognize sepsis, activate the sepsis bundle within the appropriate timeframe (cultures before antibiotics, 30 mL/kg fluids, antibiotics within 1 hour), and reassess after initial interventions. All critical steps must be performed.",
    clinicalPearls: [
      "The Surviving Sepsis Campaign 1-Hour Bundle: Measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥4, apply vasopressors if hypotensive during/after resuscitation.",
      "qSOFA at the bedside: RR ≥22, altered mentation, SBP ≤100. Two or more = high risk for poor outcomes.",
      "Each HOUR delay in antibiotics increases mortality by approximately 7.6% in sepsis.",
      "Lactate is produced when tissues switch to anaerobic metabolism due to poor perfusion — it is NOT specific to sepsis but is a critical marker.",
      "Warm septic shock (vasodilatory): warm, flushed skin with bounding pulses. Cold septic shock (cardiogenic component): cool, clammy skin with weak pulses."
    ],
    examLevel: "RN",
    timeLimit: "12 minutes",
    candidateInstructions: "Your patient with a known UTI is deteriorating. Recognize the likely diagnosis, initiate the sepsis bundle, and escalate care. Verbalize the time-critical components and your clinical reasoning.",
    patientActorScript: "You are a 64-year-old who was admitted for a urinary tract infection. You are now confused and don't know where you are. You feel very weak and your skin is warm and flushed. You are shivering. You respond to questions but are slow and disoriented.",
    examinerChecklist: [
      { action: "Recognizes signs of sepsis", marks: 3 },
      { action: "Calls for help and notifies physician immediately", marks: 3 },
      { action: "Applies supplemental oxygen", marks: 1 },
      { action: "Draws blood cultures BEFORE antibiotics", marks: 3 },
      { action: "Orders/draws serum lactate", marks: 2 },
      { action: "Initiates fluid resuscitation (30 mL/kg)", marks: 3 },
      { action: "Ensures antibiotics within 1 hour", marks: 3 },
      { action: "Applies continuous monitoring", marks: 1 },
      { action: "Reassesses after initial interventions", marks: 2 },
      { action: "Documents timeline accurately", marks: 1 }
    ],
    criticalFailCriteria: [
      "Fails to recognize sepsis in a patient with known infection and systemic signs",
      "Administers antibiotics before drawing blood cultures",
      "Does not initiate fluid resuscitation",
      "Delays physician notification or does not escalate care"
    ],
    examinerQuestions: [
      { question: "What is the difference between sepsis and septic shock?", answer: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock is a subset of sepsis with persistent hypotension requiring vasopressors to maintain MAP ≥65 mmHg AND serum lactate >2 mmol/L despite adequate fluid resuscitation." },
      { question: "Why must blood cultures be drawn before antibiotics?", answer: "Antibiotics can kill or suppress bacteria in the blood, reducing the chance of identifying the causative organism. Pre-antibiotic cultures maximize diagnostic yield and guide targeted therapy." },
      { question: "Why is the 1-hour antibiotic target so critical?", answer: "Research shows that each hour delay in antibiotic administration in sepsis increases mortality by approximately 7.6%. The 1-hour target is a Surviving Sepsis Campaign recommendation that directly impacts patient survival." }
    ],
    teachingPoints: [
      "Sepsis is the body's dysregulated response to infection — it can rapidly progress to multi-organ failure and death.",
      "The 1-Hour Bundle: Lactate, Blood cultures, Broad-spectrum antibiotics, 30 mL/kg crystalloid, Vasopressors — all initiated within 1 hour.",
      "Nurses are the first line of sepsis recognition — screening tools and clinical vigilance save lives.",
      "MAP target in septic shock is ≥65 mmHg. Norepinephrine is the first-line vasopressor.",
      "Sepsis can present without fever — hypothermia (<36°C) in the setting of infection is actually a worse prognostic sign than fever."
    ]
  },
  {
    id: "hypovolemic-shock",
    title: "Hypovolemic Shock Management",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "AlertTriangle",
    description: "Recognize and manage hypovolemic shock from hemorrhage, including rapid assessment, fluid resuscitation, and hemodynamic monitoring.",
    scenarioIntro: "You are a nurse on a surgical unit. Your patient is a 45-year-old who underwent an exploratory laparotomy 6 hours ago. You notice the patient's abdominal dressing is saturated with blood. The patient is restless and anxious, with cool, clammy skin. Vital signs: HR 128, BP 82/48, RR 28, SpO2 94%. Urine output in the last hour was 15 mL.",
    equipment: [
      "Large-bore IV catheters (14-16 gauge)",
      "IV crystalloid fluids (normal saline, lactated Ringer's)",
      "Blood transfusion supplies",
      "Pressure infusion bags",
      "Oxygen delivery devices",
      "Cardiac monitor",
      "Pulse oximeter",
      "Blood pressure cuff",
      "Urinary catheter (if not in place)",
      "Type and crossmatch blood draw supplies",
      "ABD pads and pressure dressings",
      "Documentation tools"
    ],
    steps: [
      { id: "hs-1", instruction: "Recognize the signs of hypovolemic shock: tachycardia, hypotension, tachypnea, cool/clammy skin, decreased urine output, and restlessness in a post-surgical patient with visible hemorrhage.", rationale: "Early recognition of hemorrhagic shock is critical. This patient shows signs of Class III hemorrhage (30-40% blood volume loss).", criticalStep: true },
      { id: "hs-2", instruction: "Call for help immediately — activate the rapid response team and notify the surgeon.", rationale: "Hemorrhagic shock requires surgical intervention to stop the bleeding. The rapid response team provides immediate hemodynamic support.", criticalStep: true },
      { id: "hs-3", instruction: "Apply direct pressure to the bleeding site with ABD pads or pressure dressing.", rationale: "Direct pressure is the first intervention to control external hemorrhage while awaiting surgical intervention.", criticalStep: true },
      { id: "hs-4", instruction: "Apply high-flow oxygen via non-rebreather mask.", rationale: "In hemorrhagic shock, fewer red blood cells are available to carry oxygen. Maximizing inspired oxygen concentration compensates partially.", criticalStep: true },
      { id: "hs-5", instruction: "Position the patient in modified Trendelenburg (legs elevated 20-30 degrees) if no contraindications.", rationale: "Leg elevation promotes venous return to the heart, temporarily improving cardiac output and blood pressure.", criticalStep: false },
      { id: "hs-6", instruction: "Establish two large-bore (14-16 gauge) IV access sites.", rationale: "Two large-bore IVs allow rapid, simultaneous fluid and blood product administration. Flow rate is proportional to the fourth power of the catheter radius.", criticalStep: true },
      { id: "hs-7", instruction: "Initiate rapid IV fluid resuscitation with warmed crystalloid (normal saline or lactated Ringer's).", rationale: "Crystalloid replaces intravascular volume. Warmed fluids prevent hypothermia, which worsens coagulopathy.", criticalStep: true },
      { id: "hs-8", instruction: "Draw blood for stat labs: type and crossmatch, CBC, coagulation studies, lactate, and basic metabolic panel.", rationale: "Type and crossmatch enables blood product administration. Lactate assesses tissue perfusion. Coagulation studies monitor for coagulopathy.", criticalStep: true },
      { id: "hs-9", instruction: "Apply continuous cardiac monitoring and monitor vital signs every 5 minutes.", rationale: "Hemorrhagic shock causes hemodynamic instability. Frequent monitoring detects deterioration requiring immediate intervention.", criticalStep: true },
      { id: "hs-10", instruction: "Monitor urine output hourly — target ≥0.5 mL/kg/hr.", rationale: "Urine output reflects renal perfusion and is a sensitive indicator of resuscitation adequacy.", criticalStep: true },
      { id: "hs-11", instruction: "Administer blood products as ordered (packed red blood cells, fresh frozen plasma, platelets).", rationale: "Blood products restore oxygen-carrying capacity (PRBCs), coagulation factors (FFP), and platelet function.", criticalStep: true },
      { id: "hs-12", instruction: "Prevent the lethal triad of trauma: hypothermia, acidosis, and coagulopathy. Keep the patient warm with blankets and warmed fluids.", rationale: "Hypothermia impairs clotting and worsens acidosis. The lethal triad creates a self-reinforcing cycle that increases mortality.", criticalStep: true },
      { id: "hs-13", instruction: "Reassess frequently: mental status, skin color and temperature, heart rate, blood pressure, and urine output.", rationale: "Serial reassessment determines if the patient is responding to resuscitation or continuing to hemorrhage.", criticalStep: true },
      { id: "hs-14", instruction: "Prepare the patient for possible return to the operating room for surgical hemostasis.", rationale: "Ongoing hemorrhage despite resuscitation requires surgical intervention to identify and control the bleeding source.", criticalStep: false },
      { id: "hs-15", instruction: "Document: estimated blood loss, vital sign trends, fluids administered, blood products given, and patient response.", rationale: "Documentation of the resuscitation timeline is critical for surgical decision-making and legal records.", criticalStep: false }
    ],
    commonErrors: [
      "Not recognizing early signs of hemorrhagic shock (compensated stage: tachycardia with normal blood pressure)",
      "Delaying notification of the surgeon when active hemorrhage is identified",
      "Using small-bore IV catheters for fluid resuscitation",
      "Not warming IV fluids and blood products",
      "Failing to apply direct pressure to the bleeding site",
      "Not monitoring urine output as a measure of resuscitation adequacy",
      "Forgetting to draw type and crossmatch early in the resuscitation"
    ],
    passingCriteria: "Student must recognize hemorrhagic shock, immediately control bleeding and call for help, establish large-bore IV access, initiate fluid resuscitation, and monitor response. All critical steps must be performed in the correct priority sequence.",
    clinicalPearls: [
      "Hemorrhagic shock classification: Class I (<15% loss, asymptomatic), Class II (15-30%, tachycardia), Class III (30-40%, hypotension), Class IV (>40%, lethal).",
      "Tachycardia is the EARLIEST sign of hemorrhagic shock — blood pressure may remain normal until 30-40% of blood volume is lost (compensatory mechanisms).",
      "The lethal triad of trauma (hypothermia, acidosis, coagulopathy) creates a death spiral — preventing hypothermia is a nursing priority.",
      "Massive transfusion protocol typically follows a 1:1:1 ratio of PRBCs:FFP:Platelets.",
      "Urine output is the best real-time indicator of resuscitation adequacy — target ≥0.5 mL/kg/hr."
    ],
    examLevel: "RN",
    timeLimit: "12 minutes",
    candidateInstructions: "Your post-surgical patient is showing signs of hemorrhagic shock with a saturated abdominal dressing. Recognize the emergency, initiate life-saving interventions, and escalate care. Verbalize your priorities and clinical reasoning.",
    patientActorScript: "You are a 45-year-old who had abdominal surgery earlier today. You feel very cold, dizzy, and anxious. Your stomach area feels wet. You are restless and confused. You may drift in and out of awareness as the scenario progresses.",
    examinerChecklist: [
      { action: "Recognizes signs of hemorrhagic shock", marks: 3 },
      { action: "Calls for help and notifies surgeon immediately", marks: 3 },
      { action: "Applies direct pressure to bleeding site", marks: 2 },
      { action: "Applies high-flow oxygen", marks: 2 },
      { action: "Establishes two large-bore IV access sites", marks: 3 },
      { action: "Initiates rapid crystalloid infusion", marks: 2 },
      { action: "Draws type and crossmatch", marks: 2 },
      { action: "Applies continuous cardiac monitoring", marks: 1 },
      { action: "Monitors urine output", marks: 1 },
      { action: "Takes measures to prevent hypothermia", marks: 2 },
      { action: "Reassesses frequently", marks: 1 }
    ],
    criticalFailCriteria: [
      "Fails to recognize hemorrhagic shock",
      "Does not apply pressure to the bleeding site",
      "Does not call for help or notify the surgeon",
      "Uses small-bore IV for resuscitation",
      "Does not initiate fluid resuscitation"
    ],
    examinerQuestions: [
      { question: "What is the lethal triad of trauma?", answer: "Hypothermia, acidosis, and coagulopathy. Hypothermia impairs clotting enzymes, acidosis impairs coagulation factor function, and coagulopathy leads to more bleeding — creating a self-reinforcing cycle that dramatically increases mortality." },
      { question: "Why is tachycardia an earlier sign than hypotension in hemorrhagic shock?", answer: "Compensatory mechanisms (sympathetic activation, vasoconstriction) maintain blood pressure despite volume loss. Tachycardia occurs as the heart compensates by increasing rate. Blood pressure drops only after these mechanisms are overwhelmed, typically after 30-40% blood volume loss." },
      { question: "What is a massive transfusion protocol?", answer: "A massive transfusion protocol is activated when a patient requires large volumes of blood products (typically ≥10 units of PRBCs in 24 hours). It uses a balanced ratio of PRBCs:FFP:Platelets (1:1:1) to maintain hemostasis and prevent dilutional coagulopathy." }
    ],
    teachingPoints: [
      "The primary survey (ABCDE) is the framework for managing any acutely deteriorating patient.",
      "In hemorrhagic shock, treat the cause (stop the bleeding) while resuscitating the patient.",
      "Permissive hypotension (target SBP 80-90 mmHg) may be used in uncontrolled hemorrhage to avoid disrupting clot formation.",
      "Two large-bore (14-16 gauge) peripheral IVs can deliver fluid faster than a central line due to catheter length and diameter physics.",
      "Monitor for transfusion reactions: fever, chills, urticaria, dyspnea, hypotension, and hemoglobinuria."
    ]
  }
];
