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
  "gastrointestinal-rpn": {
    title: "Gastrointestinal System for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of the Gastrointestinal System",
      content: "The gastrointestinal (GI) system is a continuous muscular tube extending from the mouth to the anus, approximately 9 meters in length, responsible for the ingestion, digestion, absorption, and elimination of nutrients and waste products. The GI tract is divided into the upper GI tract (mouth, pharynx, esophagus, stomach, and duodenum) and the lower GI tract (jejunum, ileum, cecum, ascending colon, transverse colon, descending colon, sigmoid colon, rectum, and anus). The wall of the GI tract consists of four layers: the mucosa (innermost layer containing epithelial cells, glands, and the lamina propria), the submucosa (connective tissue with blood vessels, lymphatics, and the submucosal nerve plexus of Meissner), the muscularis (smooth muscle responsible for peristalsis, innervated by the myenteric nerve plexus of Auerbach), and the serosa or adventitia (outermost protective layer). Peristalsis is the coordinated wave-like contraction of smooth muscle that propels contents through the GI tract; it is regulated by the enteric nervous system, often referred to as the second brain, which operates semi-independently from the central nervous system. The stomach produces hydrochloric acid (HCl) from parietal cells, which activates pepsinogen to pepsin for protein digestion and maintains a pH of 1.5 to 3.5. Chief cells secrete pepsinogen, while mucous cells produce a bicarbonate-rich mucus layer that protects the gastric mucosa from acid autodigestion. The small intestine is the primary site of nutrient absorption: the duodenum receives bile from the gallbladder and pancreatic enzymes from the pancreas through the ampulla of Vater; the jejunum is the primary site of carbohydrate and protein absorption; and the ileum absorbs vitamin B12 and bile salts. The large intestine absorbs water and electrolytes, forms and stores feces, and houses the gut microbiome, which plays critical roles in vitamin K synthesis, immune modulation, and protection against pathogenic organisms. The liver performs over 500 functions including bile production, drug metabolism (cytochrome P450 system), albumin synthesis, clotting factor production, bilirubin conjugation, and glycogen storage. The gallbladder stores and concentrates bile, releasing it into the duodenum in response to cholecystokinin (CCK) when fatty foods enter the duodenum. The pancreas has both exocrine functions (secreting digestive enzymes including lipase, amylase, and trypsin) and endocrine functions (insulin and glucagon secretion from the islets of Langerhans). Common GI disorders that the practical nurse will encounter include gastroesophageal reflux disease (GERD), peptic ulcer disease, inflammatory bowel disease (Crohn disease and ulcerative colitis), irritable bowel syndrome, bowel obstruction, appendicitis, cholecystitis, pancreatitis, hepatitis, and cirrhosis. The practical nurse must be proficient in GI assessment techniques, including the correct sequence of inspect, auscultate, percuss, and palpate, recognizing that auscultation must precede palpation and percussion to avoid altering bowel sounds."
    },
    riskFactors: [
      "Chronic NSAID use (disrupts prostaglandin-mediated mucosal protection, increasing ulcer and GI bleeding risk)",
      "Helicobacter pylori infection (responsible for approximately 80% of gastric ulcers and 90% of duodenal ulcers)",
      "Alcohol use disorder (gastritis, hepatitis, cirrhosis, pancreatitis, and esophageal varices)",
      "Smoking (reduces lower esophageal sphincter pressure, impairs mucosal blood flow, delays ulcer healing)",
      "High-fat, low-fiber diet (increases risk of GERD, constipation, diverticular disease, and colorectal cancer)",
      "Immobility and bedrest (decreased peristalsis, increased constipation and ileus risk)",
      "Opioid analgesic use (decreases GI motility by binding to mu-opioid receptors in the myenteric plexus)"
    ],
    diagnostics: [
      "Esophagogastroduodenoscopy (EGD): direct visualization of upper GI mucosa; used to diagnose GERD, ulcers, varices, and tumors; patient must be NPO for 6-8 hours; monitor for perforation and bleeding post-procedure",
      "Colonoscopy: visualization of the entire colon; used for cancer screening, polyp removal, and IBD evaluation; requires bowel preparation; monitor for perforation and hemorrhage post-procedure",
      "Abdominal X-ray (KUB): identifies bowel obstruction, free air under diaphragm (perforation), and fecal loading; no patient preparation required",
      "CT abdomen with contrast: evaluates abdominal masses, abscess, appendicitis, and diverticulitis; check for contrast allergy and renal function before exam",
      "Liver function tests (AST, ALT, ALP, GGT, bilirubin, albumin): ALT is most specific for hepatocellular damage; elevated ALP and GGT suggest cholestatic disease; low albumin indicates impaired hepatic synthetic function",
      "Stool occult blood test (guaiac or FIT): screens for microscopic GI bleeding; avoid red meat, vitamin C supplements, and NSAIDs for 3 days before guaiac-based testing"
    ],
    management: [
      "Maintain NPO status as ordered for patients with acute GI bleeding, bowel obstruction, or pending surgical intervention",
      "Administer proton pump inhibitors (PPIs) as prescribed for GERD and peptic ulcer disease; give 30-60 minutes before the first meal of the day",
      "Insert and maintain nasogastric tube (NGT) for gastric decompression as ordered; verify placement by pH testing (pH less than 5.5) or X-ray before use",
      "Administer antiemetics as prescribed for nausea and vomiting; assess for dehydration and electrolyte imbalances",
      "Implement a structured bowel management program for patients at risk for constipation: encourage fluids (2-3 liters per day unless restricted), high-fiber diet, ambulation, and stool softeners as ordered",
      "Monitor stool output including frequency, consistency (Bristol Stool Scale), color, and presence of blood or mucus",
      "Assess for signs of GI bleeding: hematemesis (bright red or coffee-ground emesis), melena (black tarry stools), and hematochezia (bright red blood per rectum)"
    ],
    nursingActions: [
      "Perform GI assessment using the correct sequence: inspect, auscultate, percuss, palpate -- auscultation must precede percussion and palpation to avoid altering bowel sounds",
      "Auscultate all four quadrants for at least 5 minutes total before documenting absent bowel sounds; normal bowel sounds occur every 5-15 seconds",
      "Monitor strict intake and output; report urine output less than 30 mL/hour as it may indicate hypovolemia from GI fluid losses",
      "Assess and document abdominal girth at the level of the umbilicus using consistent technique to detect changes in distension",
      "Position patients with GERD or post-EGD in semi-Fowler position (30-45 degrees) to reduce aspiration risk and promote comfort",
      "Monitor for signs of peritonitis: rigid board-like abdomen, absent bowel sounds, rebound tenderness, fever, and tachycardia -- report immediately",
      "Educate patients on dietary modifications: small frequent meals, avoidance of trigger foods (spicy, acidic, fatty foods for GERD/ulcers), and adequate fiber intake for bowel regularity"
    ],
    assessmentFindings: [
      "Hyperactive bowel sounds (high-pitched, frequent, rushing): early bowel obstruction, gastroenteritis, or diarrhea",
      "Hypoactive or absent bowel sounds: paralytic ileus, peritonitis, post-operative state, or opioid-induced decreased motility",
      "Abdominal distension with tympany on percussion: gas accumulation, bowel obstruction, or ascites (shifting dullness with fluid wave)",
      "Murphy sign positive: inspiratory arrest during right upper quadrant palpation; classic for acute cholecystitis",
      "Rebound tenderness (Blumberg sign): pain worsens when pressure is released, suggesting peritoneal irritation",
      "Hepatomegaly (liver palpable more than 2 cm below the right costal margin): may indicate hepatitis, cirrhosis, heart failure, or malignancy",
      "Spider angiomata, palmar erythema, and jaundice: signs of chronic liver disease and portal hypertension"
    ],
    signs: {
      left: [
        "Changes in appetite or early satiety",
        "Mild nausea or intermittent vomiting",
        "Altered bowel habits (constipation or diarrhea)",
        "Mild abdominal tenderness localized to one quadrant",
        "Bloating and flatulence after meals",
        "Heartburn or epigastric discomfort"
      ],
      right: [
        "Hematemesis (vomiting bright red blood or coffee-ground material)",
        "Melena (black tarry stools indicating upper GI bleed)",
        "Rigid board-like abdomen with absent bowel sounds (peritonitis)",
        "Sudden severe abdominal pain with guarding and rebound tenderness",
        "Projectile vomiting with visible peristalsis (pyloric obstruction)",
        "Signs of hypovolemic shock: tachycardia, hypotension, pale cool skin, altered mental status"
      ]
    },
    medications: [
      {
        name: "Pantoprazole (Pantoloc/Protonix)",
        type: "Proton pump inhibitor (PPI)",
        action: "Irreversibly binds to the hydrogen-potassium ATPase enzyme (proton pump) on gastric parietal cells, blocking the final common pathway of acid secretion and reducing gastric acid output by up to 95%, thereby raising intragastric pH and promoting mucosal healing",
        sideEffects: "Headache, diarrhea, nausea, abdominal pain; long-term use (greater than 1 year) associated with vitamin B12 deficiency, hypomagnesemia, increased risk of Clostridioides difficile infection, and decreased calcium absorption with potential osteoporosis risk",
        contra: "Known hypersensitivity to PPIs; concurrent use with rilpivirine or atazanavir (decreased absorption due to raised gastric pH); caution in patients with severe hepatic impairment",
        pearl: "Administer oral form 30-60 minutes before breakfast on an empty stomach for maximum acid suppression; IV form is used in acute GI bleeding (continuous infusion of 8 mg/hour after 80 mg bolus); reassess need for continued PPI therapy regularly as prolonged use carries cumulative risks"
      },
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic agent and antiemetic (dopamine D2 receptor antagonist)",
        action: "Enhances upper GI motility by increasing acetylcholine release from myenteric motor neurons and simultaneously blocks dopamine D2 receptors in the chemoreceptor trigger zone (CTZ) of the medulla, providing both prokinetic and antiemetic effects; accelerates gastric emptying and increases lower esophageal sphincter tone",
        sideEffects: "Drowsiness, fatigue, restlessness, diarrhea, extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism), and tardive dyskinesia with prolonged use (may be irreversible); galactorrhea and menstrual irregularities from prolactin elevation",
        contra: "GI obstruction, perforation, or hemorrhage (increased motility is dangerous); pheochromocytoma (may cause hypertensive crisis); seizure disorder; concurrent use with other dopamine antagonists or phenothiazines",
        pearl: "Use for the shortest duration possible, generally no more than 12 weeks; monitor closely for involuntary facial movements (lip smacking, tongue protrusion) which may indicate tardive dyskinesia; administer 30 minutes before meals and at bedtime; risk of extrapyramidal symptoms is higher in young women and elderly patients"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors at vagal nerve terminals in the GI tract and in the chemoreceptor trigger zone (CTZ) of the medulla, preventing serotonin-mediated activation of the vomiting reflex; particularly effective against chemotherapy-induced, post-operative, and radiation-induced nausea and vomiting",
        sideEffects: "Headache (most common), constipation, dizziness, fatigue; dose-dependent QT prolongation on ECG; rare serotonin syndrome when combined with other serotonergic medications",
        contra: "Congenital long QT syndrome; caution with concurrent use of QT-prolonging medications (amiodarone, haloperidol, certain antibiotics); severe hepatic impairment (reduce dose)",
        pearl: "Maximum single IV dose is 16 mg to minimize QT prolongation risk; check baseline ECG in patients with cardiac history or those on multiple QT-prolonging drugs; can be given IV, IM, or orally (including orally disintegrating tablet for patients unable to swallow); does not cause extrapyramidal symptoms unlike metoclopramide"
      }
    ],
    pearls: [
      "The correct sequence for abdominal assessment is Inspect, Auscultate, Percuss, Palpate -- auscultation must precede palpation because physical manipulation of the abdomen alters peristaltic activity and produces false findings",
      "Normal bowel sounds occur every 5-15 seconds and are described as high-pitched gurgling or clicking; listen for a full 5 minutes before documenting absent bowel sounds -- premature documentation leads to inaccurate assessment",
      "Melena (black tarry stool with distinct foul odor) indicates upper GI bleeding above the ligament of Treitz; hematochezia (bright red blood per rectum) typically indicates lower GI bleeding but can occur with massive upper GI hemorrhage",
      "Murphy sign is performed by palpating the RUQ while asking the patient to inhale deeply; a positive sign (patient abruptly stops inspiration due to pain) is highly suggestive of acute cholecystitis and warrants immediate physician notification",
      "Coffee-ground emesis indicates blood that has been exposed to gastric acid, transforming hemoglobin to acid hematin; this finding indicates active or recent upper GI bleeding and requires urgent assessment",
      "Patients receiving long-term PPI therapy should be monitored for vitamin B12 deficiency, hypomagnesemia, and Clostridioides difficile infection; serum magnesium and B12 levels should be checked annually",
      "The Bristol Stool Scale provides a standardized method for documenting stool consistency: Type 1-2 (constipation), Type 3-4 (normal), Type 5-7 (diarrhea) -- using standardized language improves interprofessional communication"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient with suspected bowel obstruction. Which assessment sequence should be used for the abdominal examination?",
        options: [
          "Inspect, palpate, percuss, auscultate",
          "Auscultate, inspect, percuss, palpate",
          "Inspect, auscultate, percuss, palpate",
          "Inspect, percuss, auscultate, palpate"
        ],
        correct: 2,
        rationale: "The correct sequence for abdominal assessment is inspect, auscultate, percuss, palpate. Auscultation must be performed before percussion and palpation because physical manipulation of the abdomen can stimulate or inhibit peristalsis, producing false bowel sound findings."
      },
      {
        question: "A patient reports burning epigastric pain that worsens after eating and is taking pantoprazole 40 mg daily. The practical nurse should instruct the patient to take this medication at which time?",
        options: [
          "Immediately after dinner with a full glass of water",
          "At bedtime with a snack",
          "30-60 minutes before breakfast on an empty stomach",
          "With the largest meal of the day"
        ],
        correct: 2,
        rationale: "Proton pump inhibitors like pantoprazole should be taken 30-60 minutes before the first meal of the day on an empty stomach. PPIs are activated by acid secretion that occurs with eating; taking the medication before the meal ensures maximum proton pumps are blocked during acid production."
      },
      {
        question: "A practical nurse observes black, tarry, foul-smelling stools during a patient's bowel movement. Which action should the nurse take first?",
        options: [
          "Document the finding and continue routine monitoring",
          "Obtain a dietary history for the past 48 hours",
          "Report the finding to the physician immediately and assess vital signs",
          "Administer a stool softener as per the bowel protocol"
        ],
        correct: 2,
        rationale: "Black, tarry, foul-smelling stools (melena) indicate upper GI bleeding and require immediate physician notification. The nurse should also assess vital signs for signs of hemodynamic instability (tachycardia, hypotension). Melena results from blood being digested by gastric acid and intestinal enzymes as it passes through the GI tract."
      }
    ]
  },

  "heent-skin-rpn": {
    title: "HEENT and Skin Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of HEENT and Integumentary Assessment",
      content: "The head, eyes, ears, nose, throat (HEENT), and skin assessment is a foundational component of the comprehensive nursing assessment that evaluates structures critical to sensory function, airway patency, neurological integrity, and protective barrier function. The head assessment includes evaluation of the skull for symmetry, tenderness, and lesions, as well as assessment of the temporal arteries and temporomandibular joint (TMJ). The twelve cranial nerves originate from the brainstem and provide motor and sensory innervation to the head and neck structures; the practical nurse must be able to perform a basic cranial nerve screening, particularly nerves II (optic, visual acuity), III, IV, VI (oculomotor, trochlear, abducens -- extraocular movements), V (trigeminal, facial sensation and mastication), VII (facial, facial expression and taste), VIII (vestibulocochlear, hearing and balance), IX and X (glossopharyngeal and vagus, swallowing and gag reflex), XI (accessory, shoulder shrug and head turning), and XII (hypoglossal, tongue movement). Eye assessment includes evaluation of visual acuity using a Snellen chart (normal vision is 20/20), visual fields by confrontation testing, pupil assessment using the PERRLA documentation system (Pupils Equal, Round, Reactive to Light and Accommodation), and inspection of the conjunctiva, sclera, and cornea. The pupillary light reflex is mediated by cranial nerves II and III; when light is shone into one eye, both pupils should constrict equally (consensual response). Anisocoria (unequal pupils) may be a normal variant in approximately 20% of the population or may indicate serious neurological pathology such as increased intracranial pressure, stroke, or oculomotor nerve compression. Ear assessment includes inspection of the external ear (pinna) for lesions and tenderness, otoscopic examination of the external auditory canal and tympanic membrane, and hearing assessment using the whisper test, Weber test (tuning fork on vertex of skull), and Rinne test (tuning fork on mastoid process then near ear canal). The Weber test lateralizes to the affected ear in conductive hearing loss and to the unaffected ear in sensorineural hearing loss. The nose and throat assessment includes inspection of the nasal mucosa for color, swelling, and discharge; the oral cavity for lesions, dental hygiene, and hydration status; the pharynx for erythema, exudate, and tonsillar enlargement; and the neck for lymphadenopathy, thyroid enlargement, and jugular venous distension. The skin is the body's largest organ and serves as the first line of defense against infection, regulates body temperature, prevents fluid loss, provides sensory reception, and synthesizes vitamin D. The integumentary assessment evaluates skin color, temperature, moisture, turgor, integrity, and the presence of lesions. Skin turgor is assessed by pinching the skin over the sternum or forearm; delayed return (tenting) suggests dehydration, particularly significant in elderly patients where assessment over the sternum or forehead is more reliable than the hand dorsum due to age-related loss of skin elasticity. Wound assessment follows a standardized approach documenting location, size (length x width x depth in centimeters), wound bed appearance (granulation tissue is beefy red, slough is yellow, eschar is black), surrounding skin condition, drainage characteristics (serous, sanguineous, serosanguineous, purulent), and odor. The Braden Scale is the most widely used tool for predicting pressure injury risk, scoring six subscales: sensory perception, moisture, activity, mobility, nutrition, and friction/shear, with scores ranging from 6 (highest risk) to 23 (lowest risk); a score of 18 or below indicates increased risk for pressure injury development."
    },
    riskFactors: [
      "Advanced age (presbycusis, presbyopia, decreased skin elasticity, thinning epidermis, reduced sebaceous gland activity)",
      "Diabetes mellitus (diabetic retinopathy, cataracts, peripheral neuropathy affecting wound healing, increased infection risk)",
      "Immunosuppression (increased susceptibility to oral candidiasis, skin infections, delayed wound healing)",
      "Prolonged corticosteroid use (skin thinning, easy bruising, delayed wound healing, increased infection risk, cataracts and glaucoma)",
      "Immobility and reduced sensation (pressure injury development, inability to detect tissue damage)",
      "Malnutrition and dehydration (impaired skin integrity, poor wound healing, decreased immune function)",
      "Occupational noise exposure (sensorineural hearing loss from sustained exposure above 85 decibels)"
    ],
    diagnostics: [
      "Snellen chart: measures visual acuity; normal is 20/20; 20/200 or worse in the better eye with best correction is legal blindness; test each eye separately at 20 feet (6 meters)",
      "Otoscopic examination: visualizes external auditory canal and tympanic membrane; normal TM is pearly grey, translucent, and intact with visible cone of light; pull pinna up and back in adults, down and back in children under 3",
      "Weber and Rinne tests: differentiate conductive from sensorineural hearing loss using a 512 Hz tuning fork; Weber lateralizes to affected ear in conductive loss; Rinne shows bone conduction greater than air conduction in conductive loss",
      "Wound culture and sensitivity: identifies causative organism and effective antibiotics; obtain specimen from wound bed (not surface drainage) using aseptic technique before starting antibiotics",
      "Braden Scale assessment: standardized pressure injury risk tool scored every shift or per facility protocol; score of 18 or below indicates at-risk status requiring preventive interventions",
      "Fluorescein staining with Wood lamp: detects corneal abrasions and ulcers; fluorescein dye pools in corneal defects and fluoresces bright green under blue light"
    ],
    management: [
      "Implement fall prevention measures for patients with visual or hearing impairment: orient to environment, remove clutter, ensure call light within reach, provide adequate lighting",
      "Apply artificial tears (lubricating eye drops) as prescribed for dry eye syndrome; instruct patient to avoid touching the dropper tip to the eye or any surface",
      "Perform wound care using aseptic technique per facility protocol; document wound assessment at each dressing change including size, wound bed appearance, drainage, and periwound skin",
      "Implement pressure injury prevention bundle for at-risk patients (Braden score 18 or below): reposition every 2 hours, use pressure-redistribution surfaces, maintain nutrition, manage moisture",
      "Administer prescribed ear medications by pulling the pinna up and back in adults; instill drops along the canal wall; have patient remain on the side for 5 minutes",
      "Provide oral care every 2 hours for intubated or NPO patients using chlorhexidine mouthwash as ordered to reduce ventilator-associated pneumonia risk",
      "Apply sunscreen (SPF 30 or higher) education for patients on photosensitizing medications (tetracyclines, fluoroquinolones, amiodarone, sulfonamides)"
    ],
    nursingActions: [
      "Perform PERRLA assessment: shine penlight from the temporal side into each eye separately; both pupils should constrict equally and briskly; document size in millimeters, shape, symmetry, and reactivity",
      "Assess cranial nerves systematically during the neurological component of the HEENT exam; report any new deficits immediately as they may indicate stroke or increased intracranial pressure",
      "Evaluate skin turgor by gently pinching skin over the sternum or forearm; tenting (delayed return to normal) lasting more than 2 seconds suggests dehydration",
      "Stage pressure injuries accurately: Stage 1 (non-blanchable erythema, intact skin), Stage 2 (partial thickness with exposed dermis), Stage 3 (full thickness, subcutaneous tissue visible), Stage 4 (full thickness with exposed bone, tendon, or muscle), Unstageable (obscured by slough or eschar)",
      "Document wound measurements consistently using length (head-to-toe) x width (side-to-side) x depth in centimeters; use clock position to describe undermining and tunneling",
      "Assess for signs of infection in wounds: increased erythema, warmth, edema, purulent drainage, foul odor, and increasing pain; report findings promptly",
      "Screen hearing using the whisper test: stand 2 feet behind the patient, occlude one ear, whisper a combination of numbers and letters; the patient should correctly repeat at least 50% of the words"
    ],
    assessmentFindings: [
      "Anisocoria (unequal pupil size): may be physiological (20% of population) or pathological; new-onset anisocoria with other neurological changes requires immediate physician notification",
      "Papilledema (optic disc swelling seen on fundoscopic exam): indicates increased intracranial pressure; associated with headache, visual changes, and nausea",
      "Battle sign (postauricular ecchymosis) and raccoon eyes (periorbital ecchymosis): late signs of basilar skull fracture; do not pack ears or nose if CSF leak is suspected",
      "Oral candidiasis (thrush): white, cottage-cheese-like patches on oral mucosa that bleed when scraped; common in immunocompromised patients and those on inhaled corticosteroids or antibiotics",
      "Cyanosis: central cyanosis (tongue, mucous membranes) indicates hypoxemia; peripheral cyanosis (nail beds, fingers) may indicate poor circulation; assess in patients with dark skin by examining oral mucosa and conjunctiva",
      "Jaundice (icterus): yellow discoloration of sclera, skin, and mucous membranes from elevated bilirubin; scleral icterus is often the earliest sign and visible at bilirubin levels above 2.5 mg/dL"
    ],
    signs: {
      left: [
        "Mild conjunctival redness or tearing",
        "Slightly decreased hearing or tinnitus",
        "Dry, flaky skin or mild pruritis",
        "Small superficial skin lesion or abrasion",
        "Mild nasal congestion or clear discharge",
        "Slightly sluggish pupil response"
      ],
      right: [
        "Fixed, dilated pupil (blown pupil) indicating possible herniation or CN III compression",
        "Sudden vision loss or visual field deficit (possible stroke or retinal detachment)",
        "Battle sign or raccoon eyes (basilar skull fracture)",
        "Rapidly expanding wound with crepitus and foul drainage (necrotizing fasciitis)",
        "Stridor or inability to swallow (airway compromise)",
        "New-onset facial droop with slurred speech (acute stroke, facial nerve palsy)"
      ]
    },
    medications: [
      {
        name: "Artificial Tears (Carboxymethylcellulose/Hypromellose)",
        type: "Ophthalmic lubricant / ocular protectant",
        action: "Supplements the natural tear film by providing a viscous aqueous layer that moisturizes and lubricates the corneal surface, stabilizes the tear film, and protects corneal epithelial cells from desiccation; reduces friction between the eyelid and corneal surface during blinking",
        sideEffects: "Temporary blurred vision immediately after instillation, mild stinging or burning sensation, eyelid crusting with ointment formulations; very rare allergic reaction with preservative-containing formulations",
        contra: "Known hypersensitivity to any component; contact lens wearers should use preservative-free formulations; remove contact lenses before instilling preserved drops and wait 15 minutes before reinserting",
        pearl: "Instruct patients to pull down the lower eyelid to create a pocket and instill one drop without touching the dropper tip to the eye; preservative-free single-use vials are preferred for patients requiring drops more than 4 times daily to avoid preservative toxicity to the corneal epithelium"
      },
      {
        name: "Fluorescein Sodium (ophthalmic diagnostic stain)",
        type: "Diagnostic ophthalmic dye / assessment tool",
        action: "A water-soluble fluorescent dye that pools in areas of corneal epithelial disruption; when illuminated by cobalt blue light (Wood lamp), areas of corneal damage fluoresce bright green, allowing visualization of abrasions, ulcers, foreign body tracks, and contact lens fitting assessment",
        sideEffects: "Temporary yellow-orange discoloration of tears and skin around the eye; mild stinging on application; may discolor soft contact lenses permanently; very rarely causes allergic conjunctivitis",
        contra: "Known hypersensitivity to fluorescein; soft contact lenses must be removed before application (dye permanently stains soft lenses); caution in patients with known dye allergies",
        pearl: "Use fluorescein strips (touched to the lower conjunctival sac with a drop of saline) rather than fluorescein drops to minimize contamination risk; always examine with cobalt blue light after instillation; document any staining pattern including location, size, and shape of the corneal defect"
      },
      {
        name: "Ciprofloxacin Otic (Cetraxal)",
        type: "Topical fluoroquinolone antibiotic (otic preparation)",
        action: "Inhibits bacterial DNA gyrase and topoisomerase IV enzymes, preventing bacterial DNA replication, transcription, and repair; provides broad-spectrum bactericidal activity against common otitis externa pathogens including Pseudomonas aeruginosa and Staphylococcus aureus directly at the site of infection",
        sideEffects: "Local pruritis, ear discomfort or pain during instillation, dizziness, headache; fungal superinfection with prolonged use; very rare ototoxicity",
        contra: "Known hypersensitivity to fluoroquinolones; perforated tympanic membrane (unless specifically indicated by physician, as drops may enter middle ear and cause ototoxicity); viral or fungal ear infections (antibacterial drops are ineffective)",
        pearl: "Warm the bottle to body temperature by holding in hands for 1-2 minutes before instilling to reduce vertigo and discomfort; have patient lie with affected ear up, pull pinna up and back (adults) or down and back (children under 3), instill prescribed drops along canal wall, and maintain position for 5 minutes; pump the tragus gently to facilitate drop penetration"
      }
    ],
    pearls: [
      "PERRLA documentation is a nursing standard: Pupils Equal, Round, Reactive to Light and Accommodation -- always assess from the temporal side and document pupil size in millimeters; a difference greater than 1 mm between pupils is significant",
      "When performing otoscopic examination in adults, pull the pinna up and back to straighten the ear canal; in children under 3 years, pull the pinna down and back because the pediatric canal is shorter and more horizontal",
      "Skin turgor is best assessed over the sternum or forearm in elderly patients because the dorsum of the hand loses elasticity with aging, producing false-positive tenting results even in well-hydrated older adults",
      "The Braden Scale is the gold standard for pressure injury risk assessment: a total score of 18 or below indicates at-risk status; the six subscales (sensory perception, moisture, activity, mobility, nutrition, friction/shear) should each be scored individually to guide targeted interventions",
      "Central cyanosis (tongue, oral mucosa) indicates true hypoxemia and requires immediate oxygen therapy; peripheral cyanosis (nail beds, fingers) may indicate vasoconstriction or poor circulation without systemic hypoxemia",
      "Battle sign (bruising behind the ear) and raccoon eyes (periorbital bruising) are late signs of basilar skull fracture; if CSF leak is suspected (clear fluid from ears or nose that tests positive for glucose), do not pack or suction and report immediately",
      "When documenting wound measurements, always use the anatomical clock orientation: 12 o'clock is toward the head, 6 o'clock is toward the feet; measure length (12-to-6), width (3-to-9), and depth using a sterile cotton-tipped applicator"
    ],
    quiz: [
      {
        question: "A practical nurse is performing a pupil assessment and documents PERRLA. Which finding would be inconsistent with this documentation?",
        options: [
          "Both pupils are 4 mm in size",
          "Pupils constrict when a light is shone into either eye",
          "One pupil is 3 mm and the other is 6 mm",
          "Pupils constrict when the patient focuses on a near object"
        ],
        correct: 2,
        rationale: "PERRLA stands for Pupils Equal, Round, Reactive to Light and Accommodation. A significant size difference between pupils (3 mm vs. 6 mm) indicates anisocoria, which is inconsistent with the 'Equal' component of PERRLA. This finding requires immediate further assessment and physician notification as it may indicate neurological compromise."
      },
      {
        question: "A practical nurse is performing an otoscopic examination on a 2-year-old child. In which direction should the pinna be pulled to straighten the ear canal?",
        options: [
          "Up and back",
          "Down and back",
          "Up and forward",
          "Down and forward"
        ],
        correct: 1,
        rationale: "In children under 3 years of age, the pinna should be pulled down and back to straighten the ear canal for otoscopic examination. This is because the pediatric ear canal is shorter and more horizontally positioned than the adult canal. In adults and children over 3, the pinna is pulled up and back."
      },
      {
        question: "A practical nurse assesses a patient's Braden Scale score as 14. Which intervention is the highest priority based on this finding?",
        options: [
          "Apply moisturizing lotion to dry skin areas once daily",
          "Implement a repositioning schedule every 2 hours and use a pressure-redistribution mattress",
          "Encourage the patient to increase oral fluid intake",
          "Document the score and reassess in one week"
        ],
        correct: 1,
        rationale: "A Braden Scale score of 14 indicates the patient is at moderate-to-high risk for pressure injury development (at-risk is 18 or below). The highest priority intervention is implementing a repositioning schedule every 2 hours combined with a pressure-redistribution surface. While moisturizing, hydration, and documentation are important, preventing tissue ischemia through pressure relief is the most critical intervention."
      }
    ]
  },

  "hirschsprung-disease-basics-rpn": {
    title: "Hirschsprung Disease Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hirschsprung Disease",
      content: "Hirschsprung disease (congenital aganglionic megacolon) is a developmental disorder of the enteric nervous system characterized by the absence of ganglion cells (parasympathetic nerve cells) in the submucosal (Meissner) and myenteric (Auerbach) plexuses of the distal bowel. During normal embryonic development, neural crest cells migrate craniocaudally (from mouth to anus) through the developing gut between weeks 5 and 12 of gestation, forming the enteric nervous system that controls peristalsis. In Hirschsprung disease, this migration arrests prematurely, resulting in an aganglionic segment that typically begins at the internal anal sphincter and extends proximally for a variable distance. The most common form is short-segment disease (approximately 80% of cases), affecting the rectum and sigmoid colon. Long-segment disease extends beyond the sigmoid and may involve the entire colon (total colonic aganglionosis, approximately 5% of cases). The aganglionic segment is unable to relax and remains in a state of tonic contraction because normal peristalsis requires coordinated contraction above and relaxation below a bolus of intestinal contents, mediated by ganglion cells releasing nitric oxide and vasoactive intestinal peptide. Without ganglion cells, the affected segment cannot produce the relaxation wave, creating a functional obstruction. Stool accumulates proximal to the aganglionic segment, causing massive dilation of the normally innervated bowel (the megacolon), while the aganglionic segment itself appears narrow and contracted on imaging studies. This produces a characteristic transition zone visible on barium enema between the dilated proximal normal bowel and the narrow distal aganglionic segment. Hirschsprung disease affects approximately 1 in 5,000 live births, with a male-to-female ratio of 4:1. It is associated with Down syndrome (trisomy 21) in approximately 2-10% of cases, and mutations in the RET proto-oncogene are the most commonly identified genetic abnormality. The hallmark clinical presentation in newborns is failure to pass meconium within the first 24-48 hours of life (normally, 90% of full-term neonates pass meconium within 24 hours). Additional findings include abdominal distension, bilious vomiting, and reluctance to feed. The most dangerous complication is Hirschsprung-associated enterocolitis (HAEC), which occurs in 20-30% of patients and can develop before or after surgical correction. HAEC presents with explosive, foul-smelling diarrhea, abdominal distension, fever, and lethargy, and can rapidly progress to toxic megacolon, intestinal perforation, sepsis, and death if not recognized and treated promptly. Definitive diagnosis requires rectal suction biopsy demonstrating absence of ganglion cells in the submucosa, with hypertrophied nerve trunks and increased acetylcholinesterase staining. Definitive treatment is surgical: the pull-through procedure removes the aganglionic segment and anastomoses normally innervated bowel to the anus. The practical nurse plays a critical role in post-operative monitoring, stool pattern assessment, and parent education regarding signs of enterocolitis that require emergency medical attention."
    },
    riskFactors: [
      "Male sex (male-to-female ratio of 4:1 for short-segment disease)",
      "Family history of Hirschsprung disease (increased recurrence risk of 3-5% in siblings)",
      "Down syndrome (trisomy 21) -- present in approximately 2-10% of Hirschsprung cases",
      "Other neurocristopathies (Waardenburg syndrome, congenital central hypoventilation syndrome, multiple endocrine neoplasia type 2)",
      "RET proto-oncogene mutations (identified in approximately 50% of familial and 15-20% of sporadic cases)",
      "Prematurity (may mask typical presentation due to delayed feeding initiation)",
      "Other congenital anomalies (cardiac defects, genitourinary anomalies, craniofacial abnormalities)"
    ],
    diagnostics: [
      "Rectal suction biopsy: gold standard diagnostic test; demonstrates absence of ganglion cells in the submucosal plexus with hypertrophied nerve trunks; increased acetylcholinesterase activity on histochemical staining confirms diagnosis",
      "Barium enema (contrast enema): shows characteristic transition zone between the narrow aganglionic distal segment and the dilated proximal normally innervated bowel; obtain lateral view; do NOT perform bowel preparation before the study as it obscures findings",
      "Anorectal manometry: measures internal anal sphincter relaxation in response to rectal distension; absence of the rectoanal inhibitory reflex (RAIR) supports the diagnosis; used in older children and as a screening tool",
      "Abdominal X-ray: shows dilated loops of bowel with absence of air in the rectum; may demonstrate air-fluid levels suggesting obstruction; in neonates, the distal bowel appears gasless",
      "Complete blood count with differential: monitor for leukocytosis suggesting enterocolitis or infection; baseline evaluation before surgical intervention",
      "Serum electrolytes and blood gas: assess for dehydration, metabolic alkalosis from vomiting, or metabolic acidosis from sepsis/enterocolitis; monitor during acute illness"
    ],
    management: [
      "Pre-operative rectal irrigations (washouts) with warm normal saline to decompress the dilated bowel and prevent enterocolitis; perform using a soft rectal tube, instilling 10-20 mL/kg body weight",
      "Maintain NPO status as ordered during acute obstruction episodes; provide IV fluid resuscitation with isotonic crystalloids to correct dehydration",
      "Surgical management: definitive pull-through procedure (Soave, Duhamel, or Swenson technique) removes the aganglionic segment and connects normally innervated bowel to the anus",
      "Post-operative anal dilatations as ordered to prevent anastomotic stricture; educate parents on technique, frequency, and proper dilator sizing per surgeon instructions",
      "Administer antibiotics as prescribed for Hirschsprung-associated enterocolitis (HAEC): typical regimen includes metronidazole for anaerobic coverage combined with broad-spectrum coverage",
      "Initiate gradual feeding advancement post-operatively as ordered; monitor tolerance and assess for abdominal distension, vomiting, or changes in stool pattern",
      "Provide ostomy care education if a temporary diverting colostomy or ileostomy is created; teach proper stoma assessment, appliance changes, and skin care"
    ],
    nursingActions: [
      "Monitor for failure to pass meconium within the first 24-48 hours of life in newborns; report delayed meconium passage promptly as this is the hallmark early sign of Hirschsprung disease",
      "Assess abdomen every 4 hours: measure abdominal girth at the umbilicus, auscultate bowel sounds, and palpate for distension; document and report increasing girth",
      "Monitor for signs of Hirschsprung-associated enterocolitis (HAEC): explosive foul-smelling diarrhea, fever, abdominal distension, lethargy, and bloody stools -- this is a life-threatening emergency",
      "Perform rectal irrigations as ordered using warm normal saline (body temperature 37 degrees Celsius); document the amount instilled, amount returned, and characteristics of effluent",
      "Monitor strict intake and output including all IV fluids, oral intake, nasogastric output, stool output, and urine output; weigh diapers (1 gram equals 1 mL) for accurate measurement",
      "Assess stool pattern post-operatively: document frequency, consistency, volume, and presence of blood; report persistent constipation or diarrhea to the surgeon",
      "Educate parents on long-term bowel management: signs of enterocolitis requiring emergency care, importance of follow-up appointments, toilet training expectations (may be delayed), and dietary strategies to promote regular bowel movements"
    ],
    assessmentFindings: [
      "Failure to pass meconium within 24-48 hours of life (present in approximately 90% of neonates with Hirschsprung disease)",
      "Abdominal distension that progresses over the first days of life with visible dilated bowel loops",
      "Bilious (green) vomiting indicating intestinal obstruction distal to the ampulla of Vater",
      "Poor feeding, irritability, and failure to thrive in infants who are not diagnosed early",
      "Explosive, foul-smelling stool passage after digital rectal examination (blast sign) -- pathognomonic finding as the examiner's finger relaxes the internal sphincter allowing trapped stool to evacuate",
      "Ribbon-like or pellet stools in older children with chronic constipation who are diagnosed later",
      "Empty rectal vault on digital examination despite abdominal distension -- a key distinguishing feature from functional constipation where the rectum is full of stool"
    ],
    signs: {
      left: [
        "Mild abdominal distension in the neonate",
        "Delayed passage of meconium beyond 24 hours",
        "Poor feeding or formula intolerance",
        "Intermittent constipation with hard stools",
        "Visible abdominal distension in older infant",
        "Mild irritability during feeding"
      ],
      right: [
        "Bilious (green) projectile vomiting (intestinal obstruction)",
        "Explosive foul-smelling diarrhea with fever (enterocolitis -- HAEC)",
        "Grossly distended, tense abdomen with absent bowel sounds (toxic megacolon)",
        "Bloody stools with signs of sepsis: tachycardia, fever, lethargy (perforated bowel)",
        "Respiratory distress from severe abdominal distension compressing the diaphragm",
        "Shock: poor perfusion, mottled skin, weak pulses, altered consciousness (septic shock from HAEC)"
      ]
    },
    medications: [
      {
        name: "Metronidazole (Flagyl)",
        type: "Antibiotic / antiprotozoal (nitroimidazole class)",
        action: "Enters bacterial and protozoal cells where it is reduced to a cytotoxic intermediate that damages DNA by causing strand breakage, inhibiting nucleic acid synthesis and leading to cell death; highly effective against anaerobic bacteria including Bacteroides fragilis, Clostridium species, and Fusobacterium, which are common in enterocolitis-associated gut infections",
        sideEffects: "Metallic taste in mouth, nausea, vomiting, diarrhea, dark or reddish-brown urine (harmless discoloration), peripheral neuropathy with prolonged use (tingling, numbness in extremities), seizures at high doses",
        contra: "First trimester of pregnancy (teratogenic risk); concurrent alcohol consumption (disulfiram-like reaction causing severe nausea, vomiting, flushing, tachycardia); concurrent use with disulfiram; severe hepatic impairment",
        pearl: "Absolutely no alcohol during treatment and for 48-72 hours after the last dose due to disulfiram-like reaction; the dark urine is a harmless metabolite and parents should be informed before treatment begins to prevent unnecessary alarm; complete the full prescribed course even if symptoms improve"
      },
      {
        name: "Polyethylene Glycol 3350 (PEG, Lax-A-Day/MiraLAX)",
        type: "Osmotic laxative",
        action: "A large, inert polymer that is not absorbed from the GI tract; it exerts an osmotic effect by retaining water in the intestinal lumen, increasing stool water content, softening stool consistency, and stimulating peristalsis through increased luminal volume; does not undergo bacterial fermentation, reducing gas and bloating compared to other osmotic agents",
        sideEffects: "Bloating, cramping, flatulence, nausea, diarrhea (dose-dependent); electrolyte imbalances with excessive use (especially in renal impairment); very rare reports of allergic reactions",
        contra: "Known or suspected bowel obstruction (would worsen obstruction); bowel perforation; toxic megacolon; hypersensitivity to polyethylene glycol; use with caution in patients with renal impairment due to potential fluid and electrolyte shifts",
        pearl: "Mix powder in 240 mL (8 oz) of water, juice, or other clear liquid; onset of action is typically 24-72 hours; commonly used for post-operative bowel management in Hirschsprung disease patients after the pull-through procedure; does not cause electrolyte-related cramping like lactulose; adjust dose to achieve soft formed stools without diarrhea"
      },
      {
        name: "Normal Saline Irrigation (0.9% Sodium Chloride)",
        type: "Isotonic irrigation solution",
        action: "Provides an isotonic physiological solution for rectal washouts that mechanically evacuates retained stool and gas from the dilated colon proximal to the aganglionic segment; the isotonic concentration prevents fluid and electrolyte shifts across the colonic mucosa during the irrigation procedure, maintaining hemodynamic stability",
        sideEffects: "Abdominal cramping during irrigation, mild rectal irritation from catheter insertion, risk of rectal perforation if technique is improper (use soft catheter, never force), hypothermia if solution is not warmed to body temperature",
        contra: "Known bowel perforation or peritonitis (irrigation would spread contamination); toxic megacolon; rectal bleeding of unknown origin; immediately post-operative without surgeon approval",
        pearl: "Warm the solution to body temperature (37 degrees Celsius) before instilling to prevent vagal stimulation, hypothermia, and patient discomfort; use a soft rectal catheter and never force past resistance; instill 10-20 mL/kg body weight per irrigation cycle; document volume instilled versus volume returned and characteristics of effluent; parents must be taught this technique for home management before discharge"
      }
    ],
    pearls: [
      "Failure to pass meconium within the first 24-48 hours of life is the hallmark early sign of Hirschsprung disease -- approximately 90% of normal full-term neonates pass meconium within the first 24 hours; delayed passage warrants investigation",
      "The barium enema should be performed WITHOUT prior bowel preparation in suspected Hirschsprung disease because bowel prep would decompress the colon and obscure the characteristic transition zone between dilated proximal normal bowel and narrow distal aganglionic segment",
      "The blast sign (explosive evacuation of stool and gas when a finger is withdrawn from the rectum during digital examination) is considered pathognomonic for Hirschsprung disease and results from the release of trapped contents above the tonically contracted aganglionic segment",
      "Hirschsprung-associated enterocolitis (HAEC) is the most dangerous complication and can be fatal if not recognized early; explosive foul-smelling diarrhea, abdominal distension, and fever in a patient with known or suspected Hirschsprung disease is a medical emergency requiring immediate treatment",
      "An empty rectal vault on digital rectal examination despite significant abdominal distension distinguishes Hirschsprung disease from functional constipation, where the rectum is typically loaded with stool",
      "Post-operative anal dilatations are essential to prevent stricture formation at the anastomotic site; parents must be taught the correct technique, schedule, and dilator size by the surgical team before discharge",
      "Toilet training may be delayed in children after pull-through surgery; parents should be counseled that continence development may take longer and that soiling episodes are common during the training period -- this anticipatory guidance reduces parental anxiety"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a newborn who has not passed meconium 36 hours after birth and has a progressively distending abdomen. Which condition should the nurse suspect?",
        options: [
          "Pyloric stenosis",
          "Hirschsprung disease",
          "Intussusception",
          "Gastroesophageal reflux"
        ],
        correct: 1,
        rationale: "Failure to pass meconium within the first 24-48 hours of life combined with progressive abdominal distension is the hallmark presentation of Hirschsprung disease (congenital aganglionic megacolon). Pyloric stenosis presents with projectile non-bilious vomiting at 2-6 weeks of age. Intussusception presents with intermittent colicky abdominal pain and currant jelly stools in older infants."
      },
      {
        question: "The physician orders a barium enema for a neonate with suspected Hirschsprung disease. Which instruction from the nurse is correct regarding preparation for this procedure?",
        options: [
          "Administer a Fleet enema 2 hours before the procedure",
          "Give polyethylene glycol solution the evening before the procedure",
          "No bowel preparation should be performed before the procedure",
          "Administer bisacodyl suppository 1 hour before the procedure"
        ],
        correct: 2,
        rationale: "Bowel preparation should NOT be performed before a barium enema in suspected Hirschsprung disease. Bowel prep would decompress the dilated proximal colon and obscure the characteristic transition zone between the narrow aganglionic segment and the dilated normally innervated bowel, which is the key diagnostic finding on contrast enema."
      },
      {
        question: "A child with a history of Hirschsprung disease pull-through surgery develops explosive, foul-smelling diarrhea, fever of 38.9 degrees Celsius, and increasing abdominal distension. Which action should the practical nurse take first?",
        options: [
          "Administer an antidiarrheal medication",
          "Encourage increased oral fluid intake",
          "Notify the physician immediately as these findings suggest enterocolitis",
          "Apply a warm compress to the abdomen for comfort"
        ],
        correct: 2,
        rationale: "These findings are classic for Hirschsprung-associated enterocolitis (HAEC), which is a life-threatening emergency requiring immediate medical intervention. HAEC can rapidly progress to toxic megacolon, bowel perforation, and sepsis. The physician must be notified immediately for urgent treatment including rectal irrigations, IV antibiotics, and fluid resuscitation. Antidiarrheal medications are contraindicated."
      }
    ]
  },

  "home-care-nursing-rpn": {
    title: "Home Care Nursing for Practical Nurses",
    cellular: {
      title: "Foundations of Home Health Nursing Practice",
      content: "Home care nursing is a specialized practice setting in which nursing care is delivered to patients in their own residences, including private homes, assisted living facilities, group homes, and supportive housing environments. This practice setting requires the practical nurse to function with a high degree of autonomy, clinical judgment, and adaptability, as resources immediately available in acute care facilities (emergency equipment, on-site laboratory, pharmacy, and specialist consultation) are not accessible in the home environment. The philosophical foundation of home care nursing centers on promoting patient independence, preventing hospital readmission, supporting family caregivers, and enabling patients to receive quality health care in the least restrictive environment. The practical nurse in home care must be proficient in comprehensive health assessment, wound care management, medication administration and reconciliation, patient and family education, infection prevention and control adapted to the home setting, and accurate documentation that meets regulatory requirements. Home health assessment differs from hospital-based assessment because the nurse must evaluate not only the patient's physical condition but also the home environment for safety hazards (fall risks, fire hazards, medication storage, food safety, pest infestation, and structural integrity), the availability and adequacy of utilities (running water, electricity, heating and cooling, refrigeration for medications), and the psychosocial context including caregiver availability, burden, and competence. The Outcome and Assessment Information Set (OASIS) is a standardized comprehensive assessment instrument required by regulatory bodies for home health patients; it covers demographics, clinical status, functional abilities, service utilization, and patient outcomes. OASIS data directly affects reimbursement under the Home Health Prospective Payment System and is used for quality measurement and outcome comparison across home health agencies. Infection control in the home setting follows the same principles as institutional settings but requires adaptation: hand hygiene remains the single most important infection prevention measure, but the nurse may need to bring hand sanitizer and supplies when running water or soap is unavailable. Clean technique (modified aseptic technique) is used for most procedures in the home setting rather than strict sterile technique, except for central line care, urinary catheterization, and wound care involving deep or surgical wounds, which still require sterile technique. Sharps disposal in the home requires a puncture-resistant container (commercial sharps container or rigid plastic container such as a laundry detergent bottle); the nurse must educate patients and caregivers about proper disposal methods and local regulations for sharps waste. Personal protective equipment (PPE) must be brought to the home visit and used according to standard and transmission-based precautions. The bag technique is a systematic method of organizing the nursing bag and supplies to prevent cross-contamination between patients: the bag is placed on a clean barrier (paper or plastic), supplies needed for the visit are removed, the bag is closed, and all contaminated items are disposed of properly before repacking the bag. Caregiver education and support is a central component of home care nursing, as family members and informal caregivers often provide the majority of daily care. The practical nurse assesses caregiver knowledge, skills, willingness, and capacity to provide care; identifies signs of caregiver burnout (fatigue, irritability, social withdrawal, neglect of own health); and facilitates referrals to respite care, support groups, and community resources. Falls prevention in the home environment requires a systematic assessment including adequate lighting (especially nighttime pathway lighting), removal of loose rugs and clutter, installation of grab bars in bathrooms, appropriate footwear, medication review for fall-risk medications (sedatives, antihypertensives, diuretics), and assessment of assistive device use and condition."
    },
    riskFactors: [
      "Advanced age with multiple comorbidities (polypharmacy, functional decline, cognitive impairment, increased fall risk)",
      "Recent hospital discharge (highest readmission risk in first 30 days; medication changes, incomplete understanding of discharge instructions)",
      "Living alone without adequate social support (delayed emergency response, medication non-adherence, nutritional deficits)",
      "Cognitive impairment or dementia (inability to manage medications independently, wandering risk, impaired safety awareness)",
      "Limited financial resources (inability to afford medications, medical supplies, nutritious food, or home modifications)",
      "Caregiver burnout and inadequate caregiver training (increased risk of patient neglect, medication errors, and delayed recognition of complications)",
      "Inadequate home environment (lack of running water, unsafe electrical wiring, pest infestation, structural hazards, extreme temperatures)"
    ],
    diagnostics: [
      "OASIS assessment (Outcome and Assessment Information Set): comprehensive standardized assessment required for all home health patients; covers demographics, clinical status, functional ability, and service utilization; completed at start of care, recertification, and discharge",
      "Home safety assessment: systematic evaluation of the physical environment including fall hazards (loose rugs, clutter, poor lighting, absent grab bars), fire safety (smoke detectors, escape routes), medication storage, food safety, and emergency access",
      "Medication reconciliation: compare all medications the patient is taking (including over-the-counter and supplements) with the current physician orders; identify discrepancies, duplications, interactions, and adherence barriers",
      "Fall risk assessment: evaluate gait, balance, vision, medication side effects, environmental hazards, history of falls, and use of assistive devices; use standardized tools such as the Timed Up and Go (TUG) test",
      "Caregiver assessment: evaluate caregiver knowledge, skills, physical and emotional capacity, willingness to provide care, and signs of burnout; identify need for respite services and additional support",
      "Wound assessment documentation: standardized wound measurement (length x width x depth in centimeters), wound bed description, periwound skin assessment, drainage characteristics, and photographic documentation per agency protocol"
    ],
    management: [
      "Implement individualized care plans based on OASIS assessment findings, physician orders, and patient and family goals; reassess and modify plans as patient condition changes",
      "Perform comprehensive medication management: set up medication organizers (pill boxes), provide medication education, monitor adherence and side effects, and report concerns to the physician",
      "Deliver wound care according to physician orders using appropriate technique (clean or sterile as indicated); document wound progression or deterioration at each visit with standardized measurements",
      "Coordinate care with the interprofessional team including the physician, physical therapist, occupational therapist, speech-language pathologist, social worker, and dietitian as needed",
      "Implement fall prevention strategies: recommend home modifications (grab bars, improved lighting, removal of tripping hazards), review medications for fall-risk contributors, and refer to physical therapy for balance and strength training",
      "Provide caregiver education and support: teach proper body mechanics for transfers, medication administration, wound care, signs and symptoms requiring emergency care, and self-care strategies for caregiver wellness",
      "Arrange for community resource referrals: Meals on Wheels, transportation services, adult day programs, respite care, home modification programs, and financial assistance programs"
    ],
    nursingActions: [
      "Practice proper bag technique to prevent cross-contamination: place bag on clean barrier, remove only needed supplies, close bag before patient care, dispose of contaminated items properly, clean hands before repacking",
      "Perform hand hygiene before and after every patient contact using soap and water or alcohol-based hand sanitizer (minimum 60% alcohol); bring hand hygiene supplies when running water may not be available",
      "Assess the home environment at every visit for new safety hazards: check smoke detectors, assess lighting adequacy, identify fall risks, verify medication storage (including refrigeration requirements and expiration dates)",
      "Educate patients and caregivers on proper sharps disposal: use puncture-resistant containers, never recap used needles by hand, label container appropriately, and follow local disposal regulations",
      "Document all care provided, patient responses, teaching completed, and any changes in patient status using standardized agency documentation; ensure OASIS data accuracy as it affects reimbursement and quality metrics",
      "Assess for signs of elder abuse or neglect at every visit: unexplained injuries, poor hygiene, malnutrition, dehydration, fearfulness, inappropriate clothing for weather, caregiver refusal to allow private conversation; report suspected abuse according to mandatory reporting requirements",
      "Implement infection control measures adapted to the home: bring PPE as needed, use clean technique for most procedures, use sterile technique for central lines and catheterization, properly dispose of all biomedical waste"
    ],
    assessmentFindings: [
      "Medication discrepancies: patient taking medications not on the current order list, missing prescribed medications, using expired medications, or storing medications improperly (insulin not refrigerated, nitroglycerin not in original container)",
      "Fall risk indicators: unsteady gait, use of furniture for support (furniture walking), history of recent falls, loose rugs, poor lighting, clutter on floors, absent grab bars in bathroom, inappropriate footwear",
      "Caregiver burnout signs: fatigue, irritability, social isolation, neglect of own health and hygiene, expressed feelings of being overwhelmed, rough handling of the patient, or expressed wish that the patient would die",
      "Wound healing indicators: granulation tissue (beefy red, healthy healing), epithelialization (pink tissue at wound edges, indicates closure), or deterioration signs (increased size, new necrotic tissue, purulent drainage, foul odor)",
      "Nutritional deficits: weight loss, empty refrigerator or expired food, ill-fitting dentures, difficulty swallowing, poor skin turgor, and muscle wasting",
      "Environmental hazards: non-functioning smoke detectors, exposed electrical wiring, pest infestation, excessive clutter preventing emergency egress, absence of heating or cooling in extreme weather"
    ],
    signs: {
      left: [
        "Mild non-adherence to medication regimen",
        "Minor home safety hazards (loose rug, dim lighting)",
        "Mild caregiver fatigue or stress",
        "Small wound with slow but progressive healing",
        "Slight weight change (1-2 pounds over one week)",
        "Mild social isolation or decreased activity level"
      ],
      right: [
        "Acute change in mental status or new confusion (possible stroke, infection, medication toxicity)",
        "Signs of elder abuse: unexplained injuries, fearfulness, severe malnutrition, pressure injuries in a supervised patient",
        "Wound with signs of systemic infection: fever, chills, red streaking from wound site (lymphangitis), purulent drainage",
        "Severe medication non-adherence resulting in uncontrolled symptoms (blood glucose over 300, blood pressure over 180/110)",
        "Caregiver unable or unwilling to provide essential care leaving patient in unsafe condition",
        "Home environment posing immediate danger: no heat in winter, gas leak, structural collapse risk"
      ]
    },
    medications: [
      {
        name: "Wound Care Supplies (Hydrocolloid/Alginate/Foam Dressings)",
        type: "Home Care Supplies",
        action: "Wound dressings maintain a moist wound healing environment that promotes cellular migration, angiogenesis, and autolytic debridement while protecting the wound from contamination; hydrocolloids absorb light exudate and are self-adhesive; alginates are derived from seaweed and absorb heavy exudate; foam dressings provide cushioning and moderate absorption for pressure injuries",
        sideEffects: "Skin maceration from prolonged contact with moisture if dressing is not changed appropriately; allergic contact dermatitis to adhesive components; wound bed damage if dressing is removed too aggressively (moisten adherent dressings with saline before removal)",
        contra: "Hydrocolloids are contraindicated in infected wounds (they create an anaerobic environment that may promote anaerobic bacterial growth); alginate dressings should not be used on dry wounds (they require moisture to form a gel); avoid occlusive dressings on clinically infected wounds unless used with antimicrobial agents",
        pearl: "Select dressing based on wound characteristics: dry wounds need moisture-donating dressings (hydrogels), heavily exudative wounds need absorptive dressings (alginates, foams), and wounds with necrotic tissue may benefit from hydrocolloids for autolytic debridement; teach caregivers proper dressing change technique, hand hygiene, and signs of infection requiring nurse notification"
      },
      {
        name: "Alcohol-Based Hand Sanitizer (60-95% ethanol or isopropanol)",
        type: "Home Care Supplies",
        action: "Denatures proteins and disrupts the cell membranes of most bacteria, viruses (including influenza and coronaviruses), and fungi on contact, providing rapid antimicrobial action within 15-30 seconds; considered the most practical and effective hand hygiene method in the home setting when hands are not visibly soiled",
        sideEffects: "Skin dryness, irritation, and contact dermatitis with frequent use; flammable (store away from heat sources); less effective on visibly soiled hands; does not eliminate bacterial spores (Clostridioides difficile) or certain non-enveloped viruses (norovirus)",
        contra: "Not effective when hands are visibly soiled with dirt, blood, or body fluids (soap and water must be used); not effective against Clostridioides difficile spores (mechanical removal with soap and water required); avoid near open flames or heat sources; caution with cracked or broken skin on hands",
        pearl: "Hand sanitizer must contain at least 60% alcohol to be effective; apply a palmful (approximately 3 mL), rub all surfaces of hands including between fingers and around nail beds for at least 20 seconds until dry; always bring hand sanitizer to home visits as running water may not be accessible; soap and water is preferred when hands are visibly soiled or after caring for patients with C. difficile or norovirus"
      },
      {
        name: "Sharps Container (puncture-resistant disposal system)",
        type: "Home Care Supplies",
        action: "Provides a rigid, puncture-resistant, leak-proof container for the safe containment and disposal of used needles, lancets, syringes, and other sharp medical devices, preventing needlestick injuries to patients, caregivers, household members, and waste handlers; proper sharps disposal breaks the chain of infection by safely containing blood-contaminated devices",
        sideEffects: "Overfilling the container beyond the designated fill line increases the risk of needlestick injury during disposal; improper closure may lead to spills of contaminated sharps; unauthorized access by children or others if container is not stored securely",
        contra: "Do not use thin-walled plastic containers (water bottles, aluminum cans) as substitute sharps containers as they can be punctured; never place sharps in regular household garbage bags; do not attempt to recap, bend, or break needles before disposal as this increases needlestick injury risk",
        pearl: "Educate patients and caregivers to fill sharps containers only to the designated fill line (usually three-quarters full), seal securely, and follow local municipal guidelines for disposal; if a commercial sharps container is not available, a rigid plastic laundry detergent bottle with a screw-top lid is an acceptable alternative; label the container clearly; store in a location inaccessible to children and pets"
      }
    ],
    pearls: [
      "The bag technique is the cornerstone of infection control in home care nursing: place bag on a clean barrier, remove only needed supplies, close the bag before starting patient care, dispose of all contaminated items properly, and clean hands thoroughly before repacking the bag",
      "Hand hygiene is the single most important infection prevention measure in home care -- bring alcohol-based hand sanitizer (minimum 60% alcohol) to every visit because running water may not be consistently available in all home settings",
      "OASIS documentation accuracy directly affects agency reimbursement and quality ratings; complete each assessment item carefully and update at required intervals (start of care, resumption of care, recertification, transfer, and discharge)",
      "Assess for signs of elder abuse or neglect at every home visit: unexplained bruises, pressure injuries in supervised patients, malnutrition, dehydration, unkempt appearance, fearfulness, caregiver hostility -- mandatory reporting is required by law in all jurisdictions",
      "Fall prevention in the home requires a systematic environmental assessment: remove loose rugs, improve lighting (especially nighttime pathways to bathroom), install grab bars, ensure assistive devices are appropriate size and in good condition, and review medications for fall-risk contributors",
      "Caregiver burnout is a significant risk factor for patient neglect and abuse; assess caregiver wellbeing at every visit, recognize signs of burnout (exhaustion, irritability, social withdrawal, neglect of own health), and facilitate referrals to respite care and community support services",
      "Medication reconciliation at every home visit is essential: compare what the patient is actually taking with the current physician orders, check expiration dates, verify proper storage (insulin refrigerated, nitroglycerin in original amber container), and identify any over-the-counter medications or supplements that may interact with prescribed drugs"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing for a home visit. Which action demonstrates proper bag technique to prevent cross-contamination between patients?",
        options: [
          "Place the nursing bag directly on the patient's kitchen table and open it fully",
          "Place the bag on a clean barrier, remove only needed supplies, and close the bag before starting care",
          "Keep the bag open throughout the visit for easy access to supplies",
          "Place the bag on the floor near the patient's bed for convenience"
        ],
        correct: 1,
        rationale: "Proper bag technique requires placing the nursing bag on a clean barrier (clean paper or plastic surface), removing only the supplies needed for that visit, and closing the bag before beginning patient care. This systematic approach prevents contamination of the bag contents and reduces the risk of cross-contamination between patients. The bag should never be placed on the floor or left open during patient care."
      },
      {
        question: "During a home visit, a practical nurse notices that the patient has multiple bruises in various stages of healing on the upper arms, appears fearful when the caregiver enters the room, and has lost 10 pounds since the last visit. What is the nurse's priority action?",
        options: [
          "Document the findings and plan to reassess at the next visit",
          "Confront the caregiver about the injuries",
          "Report suspected elder abuse to the appropriate authorities as required by mandatory reporting laws",
          "Suggest the patient increase caloric intake to address the weight loss"
        ],
        correct: 2,
        rationale: "The combination of unexplained bruises in various stages of healing, fearfulness around the caregiver, and significant weight loss are concerning indicators of potential elder abuse. The practical nurse is a mandatory reporter and is legally obligated to report suspected abuse to the appropriate authorities (adult protective services or local equivalent). The nurse should not confront the caregiver, as this may put the patient at further risk."
      },
      {
        question: "A patient in home care is performing daily insulin injections. The practical nurse should educate the patient to dispose of used needles in which type of container?",
        options: [
          "A regular household garbage bag",
          "A puncture-resistant container such as a commercial sharps container or rigid plastic detergent bottle",
          "An empty glass jar with a lid",
          "A paper bag labeled as biohazardous waste"
        ],
        correct: 1,
        rationale: "Used needles and sharps must be disposed of in a puncture-resistant container. A commercial sharps container is ideal, but if unavailable, a rigid plastic container with a secure screw-top lid (such as a laundry detergent bottle) is an acceptable alternative. Regular garbage bags, glass jars, and paper bags are not puncture-resistant and pose needlestick injury risks to the patient, household members, and waste handlers."
      }
    ]
  },

  "immune-system-rpn": {
    title: "Immune System for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of the Immune System",
      content: "The immune system is a complex network of cells, tissues, organs, and chemical mediators that protects the body from pathogenic organisms (bacteria, viruses, fungi, parasites), abnormal cells (cancer), and foreign substances. It is broadly divided into two interconnected systems: innate (nonspecific) immunity and adaptive (specific) immunity. Innate immunity provides the first and second lines of defense and is present from birth. The first line of defense consists of physical and chemical barriers: the skin (intact epidermis with its acidic pH of 4-6 and antimicrobial peptides called defensins), mucous membranes (trapping pathogens in sticky mucus), secretions (lysozyme in tears and saliva, hydrochloric acid in the stomach, sebum on the skin), and normal flora (commensal bacteria that compete with pathogens for nutrients and attachment sites). The second line of defense activates when pathogens breach the physical barriers and includes phagocytic cells (neutrophils, monocytes/macrophages), natural killer (NK) cells, the inflammatory response, the complement system, and fever. Inflammation is a nonspecific protective response characterized by the five cardinal signs: rubor (redness), calor (heat), tumor (swelling), dolor (pain), and functio laesa (loss of function). The inflammatory cascade begins when tissue damage triggers the release of chemical mediators including histamine (from mast cells and basophils), prostaglandins, leukotrienes, and cytokines. These mediators cause vasodilation and increased capillary permeability, allowing plasma proteins and white blood cells to migrate to the site of injury (diapedesis). The complement system consists of approximately 30 plasma proteins that activate in a cascade fashion, resulting in opsonization (marking pathogens for phagocytosis), chemotaxis (attracting phagocytes), and formation of the membrane attack complex (MAC) that lyses pathogen cell membranes. Adaptive immunity is the third line of defense, characterized by specificity (targets specific antigens), memory (faster and stronger response upon re-exposure), and self/non-self recognition. It is divided into humoral immunity (mediated by B lymphocytes that produce antibodies/immunoglobulins) and cell-mediated immunity (mediated by T lymphocytes). B lymphocytes mature in the bone marrow and differentiate into plasma cells that produce antibodies and memory B cells that provide long-term immunity. There are five classes of immunoglobulins: IgG (most abundant, crosses the placenta providing passive immunity to the neonate, responsible for secondary immune response), IgA (found in secretions such as breast milk, saliva, and tears, protecting mucosal surfaces), IgM (largest antibody, first produced in primary immune response, responsible for ABO blood group reactions), IgE (mediates allergic reactions and parasitic defense by binding to mast cells and basophils, triggering histamine release), and IgD (found on B cell surfaces, functions in B cell activation). T lymphocytes mature in the thymus gland and differentiate into several subsets: cytotoxic T cells (CD8+, directly kill virus-infected cells and tumor cells), helper T cells (CD4+, coordinate the immune response by releasing cytokines that activate other immune cells), and regulatory T cells (suppress immune responses to prevent autoimmunity). Immunodeficiency occurs when any component of the immune system is absent, deficient, or dysfunctional, and may be primary (congenital, such as severe combined immunodeficiency or SCID) or secondary (acquired, such as HIV/AIDS, immunosuppressive therapy, malnutrition, or aging-related immunosenescence). The practical nurse must understand immune function to recognize signs of immune compromise, implement appropriate infection prevention measures, administer immunomodulating medications safely, and educate patients about immune health."
    },
    riskFactors: [
      "Extremes of age (neonates have immature immune systems; elderly patients experience immunosenescence with decreased T cell function and impaired antibody response)",
      "HIV infection and AIDS (progressive destruction of CD4+ helper T cells leads to profound immunosuppression; opportunistic infections occur when CD4 count falls below 200 cells/mm3)",
      "Immunosuppressive therapy (corticosteroids, chemotherapy, transplant rejection medications suppress immune cell function and increase infection susceptibility)",
      "Malnutrition and protein-calorie deficiency (impaired immune cell production, decreased antibody synthesis, and impaired wound healing)",
      "Chronic diseases (diabetes mellitus with impaired neutrophil function, chronic kidney disease with uremia-related immune suppression, liver cirrhosis with impaired complement production)",
      "Surgical procedures and invasive devices (disruption of skin barrier, indwelling catheters, surgical drains providing direct pathogen entry)",
      "Stress and sleep deprivation (elevated cortisol suppresses immune function, decreased NK cell activity, impaired cytokine production)"
    ],
    diagnostics: [
      "Complete blood count with differential (CBC with diff): total WBC count (normal 4,500-11,000/mm3), neutrophil count (neutropenia defined as ANC below 1,500/mm3; severe neutropenia below 500/mm3), lymphocyte count (lymphopenia may indicate HIV, immunosuppression, or corticosteroid use)",
      "Immunoglobulin levels (IgG, IgA, IgM, IgE): quantifies antibody production; low levels may indicate primary or secondary immunodeficiency; elevated IgE suggests allergic response or parasitic infection",
      "CD4+ T cell count: critical for monitoring HIV disease progression; normal 500-1,500 cells/mm3; below 200 cells/mm3 defines AIDS and indicates need for opportunistic infection prophylaxis",
      "C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR): nonspecific inflammatory markers; elevated values indicate acute inflammation or infection but do not identify the source",
      "Complement levels (C3, C4, CH50): decreased in autoimmune diseases (systemic lupus erythematosus), certain infections, and hereditary complement deficiencies",
      "Allergy testing (skin prick test, serum-specific IgE/RAST): identifies specific allergens triggering IgE-mediated hypersensitivity reactions; skin prick testing should not be performed while patient is taking antihistamines"
    ],
    management: [
      "Implement neutropenic precautions for patients with ANC below 1,000/mm3: private room, strict hand hygiene, no fresh flowers or raw fruits/vegetables, avoid invasive procedures when possible, monitor temperature every 4 hours",
      "Administer immunoglobulin replacement therapy (IVIG or subcutaneous IG) as prescribed for patients with primary or secondary immunodeficiency; monitor for infusion reactions (headache, chills, fever, hypotension, anaphylaxis)",
      "Maintain current immunization status according to recommended schedules; live vaccines (MMR, varicella, BCG) are contraindicated in immunocompromised patients",
      "Implement infection prevention measures: meticulous hand hygiene, aseptic technique for invasive procedures, daily central line care, indwelling catheter care per protocol",
      "Administer prescribed prophylactic antibiotics, antifungals, or antivirals for immunocompromised patients as ordered (e.g., trimethoprim-sulfamethoxazole for Pneumocystis prophylaxis when CD4 below 200)",
      "Monitor for signs of opportunistic infections in immunocompromised patients: oral candidiasis, Pneumocystis jirovecii pneumonia, cytomegalovirus, herpes zoster reactivation",
      "Support nutritional optimization: adequate protein intake (1.2-1.5 g/kg/day for immune recovery), vitamins A, C, D, and zinc supplementation as ordered, caloric intake to meet increased metabolic demands"
    ],
    nursingActions: [
      "Perform meticulous hand hygiene before and after every patient contact using either soap and water (20 seconds minimum) or alcohol-based hand sanitizer (60% alcohol minimum); this is the single most important infection prevention measure",
      "Monitor temperature every 4 hours in immunocompromised patients; fever (38 degrees Celsius or 100.4 degrees Fahrenheit or higher) in a neutropenic patient is a medical emergency requiring immediate blood cultures and empiric antibiotic therapy",
      "Assess for signs of infection systematically: inspect skin and mucous membranes, auscultate lungs, assess IV sites and surgical wounds, review urinalysis results; note that immunocompromised patients may not mount a typical inflammatory response (absent fever, minimal erythema, absent purulent drainage)",
      "Administer IVIG according to facility protocol: verify physician order and patient identity, begin infusion at a slow rate (0.5-1 mL/kg/hour) and increase gradually as tolerated, monitor vital signs every 15 minutes during the first hour then hourly",
      "Educate patients on infection prevention at home: hand hygiene, food safety (avoid raw meats, unpasteurized dairy, raw eggs), crowd avoidance during peak illness seasons, pet hygiene, and when to seek medical attention",
      "Monitor laboratory results and report critical values: WBC below 2,000/mm3 or above 30,000/mm3, ANC below 500/mm3 (severe neutropenia), CD4 below 200/mm3 (AIDS-defining)",
      "Administer epinephrine immediately for anaphylaxis (severe type I hypersensitivity reaction): epinephrine 0.3-0.5 mg IM into the lateral thigh; repeat every 5-15 minutes if needed; position patient supine with legs elevated unless respiratory distress present"
    ],
    assessmentFindings: [
      "Neutropenia (ANC below 1,500/mm3): patient may present with fever as the only sign of infection because diminished neutrophil response prevents formation of typical inflammatory signs (pus, erythema, swelling)",
      "Lymphadenopathy: enlarged, palpable lymph nodes indicating active immune response; assess for tenderness, mobility, and consistency; fixed, hard, non-tender nodes suggest malignancy",
      "Splenomegaly: enlarged spleen palpable below the left costal margin; may indicate infection (mononucleosis), hemolytic anemia, or lymphoproliferative disorders; avoid vigorous palpation due to rupture risk",
      "Oral candidiasis (thrush): white adherent plaques on oral mucosa, tongue, and pharynx that bleed when scraped; indicator of immune suppression; common in patients on inhaled corticosteroids, antibiotics, or with HIV/AIDS",
      "Anaphylaxis symptoms: urticaria, angioedema, bronchospasm, stridor, hypotension, tachycardia, anxiety, feeling of impending doom -- this is a medical emergency requiring immediate epinephrine administration",
      "Opportunistic infection signs: persistent oral or esophageal candidiasis, Pneumocystis pneumonia (dry cough, progressive dyspnea, fever), herpes zoster in dermatomal distribution, Kaposi sarcoma lesions (purple/red skin lesions)"
    ],
    signs: {
      left: [
        "Low-grade fever or temperature elevation",
        "Mild fatigue and malaise",
        "Slightly enlarged lymph nodes",
        "Minor recurrent infections (frequent colds, slow wound healing)",
        "Mild skin rash or urticaria",
        "Slightly decreased WBC on laboratory results"
      ],
      right: [
        "Anaphylaxis: urticaria, angioedema, bronchospasm, stridor, hypotension (administer epinephrine immediately)",
        "Neutropenic fever: temperature 38 degrees Celsius or higher with ANC below 500/mm3 (medical emergency)",
        "Sepsis: fever or hypothermia, tachycardia, tachypnea, altered mental status, hypotension (activate sepsis protocol)",
        "Severe allergic reaction with airway compromise (stridor, drooling, inability to speak)",
        "Disseminated herpes zoster crossing dermatomes (indicates severe immunosuppression)",
        "Opportunistic infections in HIV/AIDS: PCP pneumonia, cryptococcal meningitis, CMV retinitis"
      ]
    },
    medications: [
      {
        name: "Intravenous Immunoglobulin (IVIG)",
        type: "Immunomodulator / passive immunization (pooled human immunoglobulin concentrate)",
        action: "Provides exogenous pooled IgG antibodies collected from thousands of healthy donors, temporarily supplementing the patient's humoral immune system with a broad spectrum of protective antibodies; modulates immune function through multiple mechanisms including Fc receptor blockade, complement inhibition, and cytokine modulation; used in primary immunodeficiency (replacement), autoimmune conditions (immunomodulation), and certain infections",
        sideEffects: "Headache (most common), chills, fever, nausea, myalgia during infusion (rate-related); aseptic meningitis (severe headache, neck stiffness, photophobia); renal toxicity (especially sucrose-containing products); thromboembolic events (stroke, DVT, PE); rarely anaphylaxis in patients with IgA deficiency who have anti-IgA antibodies",
        contra: "Selective IgA deficiency with anti-IgA antibodies (risk of anaphylaxis); known hypersensitivity to immunoglobulin products; severe renal impairment (use caution with sucrose-containing formulations); hypercoagulable states (increased thrombosis risk)",
        pearl: "Begin infusion at a slow rate and increase gradually as tolerated; premedicate with acetaminophen, diphenhydramine, and IV hydration as ordered to prevent infusion reactions; monitor vital signs every 15 minutes for the first hour, then every 30-60 minutes; ensure patient is well-hydrated before, during, and after infusion to protect renal function; IgA-deficient patients require IgA-depleted IVIG products"
      },
      {
        name: "Epinephrine (Adrenaline/EpiPen)",
        type: "Sympathomimetic / adrenergic agonist (alpha and beta receptor agonist)",
        action: "Stimulates alpha-1 adrenergic receptors causing peripheral vasoconstriction (reverses hypotension and reduces mucosal edema), beta-1 receptors increasing heart rate and contractility (improves cardiac output), and beta-2 receptors causing bronchodilation and inhibiting mast cell mediator release (reverses bronchospasm and suppresses further histamine release); this combined action makes it the first-line treatment for anaphylaxis",
        sideEffects: "Tachycardia, palpitations, anxiety, tremor, headache, nausea, dizziness, pallor; hypertension (from vasoconstriction); cardiac dysrhythmias (rare at standard anaphylaxis doses); tissue necrosis if inadvertently injected intravenously or intra-arterially",
        contra: "There are NO absolute contraindications to epinephrine in anaphylaxis -- the benefit always outweighs the risk in a life-threatening allergic reaction; use with caution in patients with coronary artery disease, uncontrolled hypertension, or those taking beta-blockers (may require higher doses)",
        pearl: "Administer 0.3-0.5 mg (0.01 mg/kg in children) intramuscularly into the anterolateral thigh (vastus lateralis) -- this site provides the fastest absorption; may repeat every 5-15 minutes if symptoms persist; NEVER delay epinephrine administration in anaphylaxis for antihistamines or corticosteroids, as epinephrine is the only medication that directly reverses the life-threatening cardiovascular and respiratory effects; auto-injectors (EpiPen) should be carried at all times by patients with known anaphylaxis risk"
      },
      {
        name: "Diphenhydramine (Benadryl)",
        type: "First-generation antihistamine (H1 receptor antagonist)",
        action: "Competitively blocks histamine H1 receptors on smooth muscle, blood vessels, and sensory nerves, preventing histamine-mediated vasodilation, increased capillary permeability, bronchospasm, and pruritis; crosses the blood-brain barrier and blocks central H1 receptors, producing sedation and antiemetic effects; used as adjunctive therapy (not a replacement for epinephrine) in allergic reactions and anaphylaxis",
        sideEffects: "Drowsiness and sedation (most common, due to central H1 blockade), dry mouth, urinary retention, constipation, blurred vision (anticholinergic effects), paradoxical excitation in children and elderly patients, thickened bronchial secretions",
        contra: "Narrow-angle glaucoma (anticholinergic mydriasis increases intraocular pressure); urinary retention or benign prostatic hyperplasia (anticholinergic effects worsen obstruction); concurrent use with other CNS depressants (additive sedation); neonates (increased sensitivity to anticholinergic effects); use caution in elderly patients due to increased fall risk and confusion (included in Beers Criteria for potentially inappropriate medications in older adults)",
        pearl: "Diphenhydramine is an ADJUNCT to epinephrine in anaphylaxis, not a substitute -- it relieves urticaria and pruritis but does not reverse bronchospasm, hypotension, or airway edema; administer 25-50 mg IV or IM (1 mg/kg in children) after epinephrine has been given; warn patients about drowsiness and impaired driving ability; in elderly patients, consider second-generation antihistamines (cetirizine, loratadine) which cause less sedation and have fewer anticholinergic effects"
      }
    ],
    pearls: [
      "The immune system has three lines of defense: first line (physical and chemical barriers -- skin, mucous membranes, secretions), second line (innate immune response -- inflammation, phagocytosis, complement, fever), and third line (adaptive immune response -- B cells/antibodies and T cells) -- understanding this hierarchy helps predict infection risk based on which defenses are compromised",
      "IgG is the ONLY immunoglobulin that crosses the placenta, providing passive immunity to the neonate for approximately the first 3-6 months of life; this is why live vaccines (MMR, varicella) are delayed until 12 months of age when maternal antibodies have declined",
      "IgM is the first antibody produced in a primary immune response and is the largest immunoglobulin (pentamer); elevated IgM levels indicate acute or recent infection; IgG elevation indicates past infection or secondary immune response -- this distinction is clinically important for interpreting serology results",
      "Neutropenic fever (temperature 38 degrees Celsius or higher with ANC below 500/mm3) is a medical emergency requiring immediate blood cultures from two sites and empiric broad-spectrum antibiotic therapy within 1 hour -- delayed treatment significantly increases mortality",
      "Immunocompromised patients may not mount a typical inflammatory response: absence of fever, erythema, pus formation, or elevated WBC does not rule out serious infection; the practical nurse must maintain a high index of suspicion for infection in these patients",
      "Epinephrine is the ONLY first-line medication for anaphylaxis -- antihistamines and corticosteroids are adjunctive treatments that do not reverse bronchospasm, hypotension, or laryngeal edema; never delay epinephrine to administer diphenhydramine or hydrocortisone",
      "Live vaccines (MMR, varicella, BCG, oral polio, live influenza nasal spray) are contraindicated in immunocompromised patients because the attenuated organisms can cause active disease in patients with insufficient immune function; inactivated vaccines are generally safe but may produce a suboptimal immune response"
    ],
    quiz: [
      {
        question: "A patient with an absolute neutrophil count (ANC) of 400 cells/mm3 develops a temperature of 38.3 degrees Celsius. Which action should the practical nurse take first?",
        options: [
          "Administer acetaminophen and recheck the temperature in 30 minutes",
          "Apply cooling measures and continue routine monitoring",
          "Notify the physician immediately as this represents a neutropenic fever emergency",
          "Obtain a urine culture and begin oral antibiotics"
        ],
        correct: 2,
        rationale: "Neutropenic fever (temperature 38 degrees Celsius or higher with ANC below 500/mm3) is a medical emergency. The nurse must notify the physician immediately so that blood cultures can be obtained and empiric broad-spectrum IV antibiotics can be started within 1 hour. Delaying treatment significantly increases mortality risk. Acetaminophen alone is insufficient, and oral antibiotics are inappropriate for severe neutropenia."
      },
      {
        question: "A practical nurse is preparing to administer an IVIG infusion. Which nursing action is most important during the first hour of the infusion?",
        options: [
          "Infuse at the maximum rate to complete the infusion quickly",
          "Monitor vital signs every 15 minutes and begin at a slow infusion rate",
          "Administer a bolus of normal saline simultaneously through a separate line",
          "Restrict oral fluids during the infusion to prevent fluid overload"
        ],
        correct: 1,
        rationale: "IVIG infusions should begin at a slow rate and be increased gradually as tolerated. Vital signs should be monitored every 15 minutes during the first hour of infusion because infusion reactions (headache, chills, fever, hypotension, anaphylaxis) are most likely to occur early. Adequate hydration before, during, and after infusion is important to protect renal function, not restricted."
      },
      {
        question: "A patient experiencing anaphylaxis has received epinephrine. The practical nurse administers diphenhydramine 50 mg IV as ordered. Which statement about diphenhydramine's role in anaphylaxis is correct?",
        options: [
          "Diphenhydramine is the primary treatment and can replace epinephrine if needed",
          "Diphenhydramine reverses bronchospasm and restores blood pressure",
          "Diphenhydramine is an adjunctive treatment that relieves urticaria and pruritis but does not reverse life-threatening symptoms",
          "Diphenhydramine should always be administered before epinephrine in anaphylaxis"
        ],
        correct: 2,
        rationale: "Diphenhydramine is an adjunctive treatment in anaphylaxis that helps relieve urticaria (hives) and pruritis by blocking H1 histamine receptors. However, it does NOT reverse the life-threatening components of anaphylaxis (bronchospasm, laryngeal edema, and hypotension). Epinephrine is the only first-line treatment for anaphylaxis and should never be delayed to administer antihistamines."
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
