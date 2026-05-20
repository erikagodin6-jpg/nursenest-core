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
  "intussusception-basics-rpn": {
    title: "Intussusception for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Intussusception",
      content: "Intussusception is a condition in which one segment of the intestine telescopes (invaginates) into an adjacent distal segment, creating a bowel-within-bowel configuration that obstructs the intestinal lumen and compromises mesenteric blood flow. It is the most common cause of intestinal obstruction in children between 3 months and 6 years of age, with peak incidence occurring between 5 and 10 months. The ileocolic type is the most common form, in which the terminal ileum invaginates into the cecum and ascending colon through the ileocecal valve. The telescoping bowel drags its mesentery along with it, compressing mesenteric blood vessels between the layers of invaginated tissue. Venous congestion develops first because veins are thin-walled and compress easily, leading to edema, mucosal hemorrhage, and the production of mucus mixed with blood -- this produces the classic currant jelly stool that contains blood and mucus resembling red currant jelly. If the intussusception is not reduced, arterial supply is eventually compromised, leading to ischemia, necrosis, perforation, and peritonitis. The pathological cascade proceeds from edema to hemorrhage to ischemia to necrosis within hours if untreated, making early recognition and intervention critical. In most pediatric cases, a pathological lead point is not identified and the cause is termed idiopathic, though preceding viral infections (adenovirus, rotavirus) or recent rotavirus vaccination may cause lymphoid hyperplasia of Peyer patches in the terminal ileum, which acts as a lead point. In children older than 2 years and in adults, a pathological lead point such as a Meckel diverticulum, polyp, lymphoma, or duplication cyst is more likely and must be investigated. The practical nurse must recognize the classic triad of sudden severe colicky abdominal pain (the infant draws up the knees and screams), vomiting, and currant jelly stools, though this complete triad is present in fewer than 50 percent of cases. A palpable sausage-shaped mass may be felt in the right upper quadrant or epigastrium, and the right lower quadrant may feel empty on palpation (Dance sign). The child may appear completely normal and comfortable between pain episodes in the early stages, which can falsely reassure caregivers. Ultrasound is the diagnostic imaging modality of choice and reveals a characteristic target sign or doughnut sign on cross-section, representing the layers of telescoped bowel. Air enema or barium enema serves as both a diagnostic and therapeutic procedure: hydrostatic or pneumatic pressure can reduce the intussusception in approximately 80 to 95 percent of uncomplicated cases. Surgical intervention is required when enema reduction fails, when there are signs of perforation, peritonitis, or hemodynamic instability, or when a pathological lead point is suspected. The practical nurse plays a critical role in monitoring the child for signs of shock, maintaining NPO status before the procedure, monitoring post-reduction for recurrence (which occurs in approximately 5 to 10 percent of cases within 72 hours), and providing family education about the signs of recurrence."
    },
    riskFactors: [
      "Age 3 months to 6 years (peak incidence 5-10 months due to lymphoid tissue development)",
      "Recent viral illness (adenovirus, rotavirus causing lymphoid hyperplasia of Peyer patches)",
      "Male sex (male-to-female ratio approximately 3:1)",
      "Recent rotavirus vaccination (slight increased risk within 21 days of first dose)",
      "Meckel diverticulum or intestinal polyps (pathological lead points in older children)",
      "Henoch-Schonlein purpura (IgA vasculitis causing intestinal wall edema and a lead point)",
      "Cystic fibrosis (thick inspissated meconium and intestinal mucosal abnormalities)"
    ],
    diagnostics: [
      "Abdominal ultrasound: first-line diagnostic test; reveals target sign (doughnut sign) on transverse view and pseudo-kidney sign on longitudinal view; sensitivity greater than 98 percent",
      "Abdominal X-ray: may show signs of bowel obstruction including dilated loops, air-fluid levels, and absence of gas in the right lower quadrant; not diagnostic alone but can identify free air if perforation has occurred",
      "Air enema (pneumatic reduction): both diagnostic and therapeutic; air insufflation under fluoroscopic guidance to reduce intussusception; success rate 80-95 percent in uncomplicated cases",
      "Barium enema: alternative diagnostic and therapeutic modality; shows coiled spring sign or meniscus sign; largely replaced by air enema due to lower perforation risk",
      "Complete blood count: may show leukocytosis indicating inflammation or infection; hemoglobin/hematocrit to assess for blood loss from mucosal hemorrhage",
      "Stool guaiac test: positive for occult blood even before gross bloody stools appear; helps confirm mucosal hemorrhage from bowel wall ischemia"
    ],
    management: [
      "Maintain NPO status immediately upon suspicion of intussusception to prepare for enema reduction or possible surgical intervention",
      "Establish IV access and administer isotonic IV fluids (normal saline) as ordered to maintain hydration and support perfusion",
      "Insert nasogastric tube if ordered for gastric decompression in the presence of persistent vomiting or abdominal distension",
      "Prepare the child and family for air or barium enema reduction procedure; explain that the procedure is both diagnostic and therapeutic",
      "Monitor for signs of successful reduction: passage of normal brown stool, resolution of abdominal pain, softening of the abdominal mass",
      "Monitor post-reduction for recurrence for at least 24 to 48 hours: return of colicky pain, vomiting, or bloody stools should be reported immediately",
      "Prepare for surgical intervention if enema reduction fails, perforation is suspected, or the child shows signs of peritonitis or hemodynamic instability"
    ],
    nursingActions: [
      "Perform focused abdominal assessment: palpate gently for sausage-shaped mass in RUQ/epigastrium and assess for Dance sign (empty RLQ)",
      "Monitor vital signs every 15 to 30 minutes during acute episodes; tachycardia and hypotension indicate possible hypovolemic shock from third-spacing and hemorrhage",
      "Assess pain using age-appropriate pain scales (FLACC for infants); document episodic nature of colicky pain with pain-free intervals",
      "Monitor all stools for color, consistency, and presence of blood or mucus; report currant jelly appearance immediately",
      "Maintain strict intake and output records; report urine output less than 1 mL/kg/hour in pediatric patients",
      "Provide family education about the condition, the enema reduction procedure, and signs of recurrence to monitor for after discharge",
      "Report any sudden increase in abdominal distension, bilious vomiting, fever, or signs of peritoneal irritation to the physician immediately"
    ],
    assessmentFindings: [
      "Sudden onset severe colicky abdominal pain: infant screams, draws knees to chest, may appear pale and diaphoretic during episodes",
      "Pain-free intervals between episodes: child may appear comfortable and playful, which can falsely reassure caregivers",
      "Currant jelly stool: mixture of blood and mucus with a dark red, jelly-like appearance; a late sign indicating significant mucosal ischemia",
      "Palpable sausage-shaped mass in the right upper quadrant or epigastrium on abdominal palpation",
      "Dance sign: sensation of emptiness in the right lower quadrant due to the cecum being drawn upward with the intussusception",
      "Bilious vomiting: initially non-bilious, progressing to bilious as obstruction worsens, indicating proximal bowel obstruction",
      "Lethargy and altered level of consciousness: a concerning late sign that may indicate significant dehydration, shock, or sepsis"
    ],
    signs: {
      left: [
        "Intermittent colicky abdominal pain with crying episodes",
        "Non-bilious vomiting",
        "Mild abdominal distension",
        "Irritability or fussiness between episodes",
        "Decreased appetite or refusal to feed",
        "Low-grade temperature"
      ],
      right: [
        "Currant jelly stools (blood and mucus mixture)",
        "Bilious vomiting (green-tinged emesis indicating obstruction)",
        "Rigid, distended abdomen with guarding (possible peritonitis)",
        "Lethargy, altered consciousness, or limp episodes",
        "Signs of hypovolemic shock (tachycardia, weak pulses, mottled skin, delayed capillary refill)",
        "High fever with abdominal rigidity (bowel necrosis or perforation)"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid IV fluid",
        action: "Provides isotonic volume expansion that remains in the extracellular compartment, restoring intravascular volume and supporting organ perfusion; replaces fluid losses from vomiting, third-spacing, and NPO status",
        sideEffects: "Fluid overload (crackles, peripheral edema, increased work of breathing), hyperchloremic metabolic acidosis with large volumes, dilutional hyponatremia",
        contra: "Fluid overload states (decompensated heart failure); monitor closely in patients with renal impairment or pre-existing hypernatremia",
        pearl: "Initial fluid resuscitation bolus in pediatric hypovolemia is 20 mL/kg over 5-20 minutes; reassess after each bolus and report if the child requires more than 3 boluses as this suggests significant ongoing losses"
      },
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system, inhibiting ascending pain pathways and altering the perception and emotional response to pain; provides potent analgesia for the severe colicky pain of intussusception",
        sideEffects: "Respiratory depression (most dangerous), sedation, nausea and vomiting, constipation, urinary retention, hypotension, pruritus",
        contra: "Respiratory depression or compromised airway; known hypersensitivity; use with extreme caution in infants under 3 months due to immature hepatic metabolism",
        pearl: "Administer the lowest effective dose; monitor respiratory rate, oxygen saturation, and sedation level every 5 minutes after IV administration; have naloxone readily available; pain relief after reduction may indicate successful treatment"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 receptor antagonist)",
        action: "Blocks serotonin (5-HT3) receptors in the chemoreceptor trigger zone and vagal nerve terminals in the gastrointestinal tract, preventing nausea and vomiting signals from reaching the vomiting center in the medulla",
        sideEffects: "Headache, constipation, dizziness, QT prolongation (dose-dependent), transient elevation of liver enzymes",
        contra: "Congenital long QT syndrome; concurrent use with other QT-prolonging medications; known hypersensitivity to ondansetron or other 5-HT3 antagonists",
        pearl: "Pediatric dosing is weight-based (0.1-0.15 mg/kg IV, maximum 4 mg per dose); helps control vomiting before enema reduction; check ECG baseline in patients receiving multiple doses or with cardiac history"
      }
    ],
    pearls: [
      "The classic triad of intussusception is sudden colicky abdominal pain, vomiting, and currant jelly stools -- but this complete triad is present in fewer than 50 percent of cases, so do not wait for all three before reporting concern",
      "Currant jelly stool is a LATE sign indicating significant mucosal ischemia and hemorrhage -- earlier signs include intermittent inconsolable crying, vomiting, and a palpable abdominal mass",
      "The child may appear completely normal and comfortable between pain episodes -- this pattern of severe episodic pain with pain-free intervals is characteristic and should raise suspicion",
      "Ultrasound showing a target sign (doughnut sign) is the gold-standard diagnostic imaging for intussusception -- it is fast, non-invasive, radiation-free, and has sensitivity greater than 98 percent",
      "Air enema is both diagnostic AND therapeutic -- it can reduce the intussusception in 80-95 percent of uncomplicated cases without surgery",
      "Recurrence occurs in approximately 5-10 percent of cases within 72 hours of reduction -- educate families to return immediately if colicky pain, vomiting, or bloody stools return",
      "In children older than 2 years, always suspect a pathological lead point (Meckel diverticulum, polyp, lymphoma) -- these cases more frequently require surgical intervention"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 9-month-old infant admitted with suspected intussusception. The infant has sudden episodes of severe crying with knee-drawing, followed by periods of calm. Which stool finding should the nurse report immediately as consistent with this diagnosis?",
        options: [
          "Clay-colored (acholic) stools",
          "Dark red jelly-like stools containing blood and mucus",
          "Ribbon-like thin stools",
          "Pale, bulky, foul-smelling stools"
        ],
        correct: 1,
        rationale: "Currant jelly stools (dark red, jelly-like mixture of blood and mucus) are a hallmark finding of intussusception, indicating mucosal hemorrhage from venous congestion and ischemia of the telescoped bowel wall. Clay-colored stools suggest biliary obstruction, ribbon-like stools suggest Hirschsprung disease, and pale bulky stools suggest malabsorption."
      },
      {
        question: "Which diagnostic test is considered first-line for confirming intussusception in a pediatric patient?",
        options: [
          "Abdominal CT scan with IV contrast",
          "Barium swallow study",
          "Abdominal ultrasound",
          "Colonoscopy"
        ],
        correct: 2,
        rationale: "Abdominal ultrasound is the first-line diagnostic test for intussusception with sensitivity greater than 98 percent. It reveals a characteristic target sign (doughnut sign) on cross-section. It is fast, non-invasive, radiation-free, and widely available. CT may be used in unclear cases but involves radiation exposure."
      },
      {
        question: "A practical nurse is monitoring a child after successful air enema reduction of intussusception. Which finding should be reported immediately as a sign of recurrence?",
        options: [
          "The child is tolerating clear fluids without vomiting",
          "The child is sleeping comfortably with stable vital signs",
          "The child develops sudden episodic screaming with vomiting and bloody stools",
          "The child has a normal bowel movement within 6 hours of the procedure"
        ],
        correct: 2,
        rationale: "Recurrence of intussusception occurs in approximately 5-10 percent of cases within 72 hours. Return of the hallmark symptoms -- sudden episodic crying/screaming, vomiting, and bloody stools -- indicates re-telescoping and requires immediate physician notification for repeat imaging and possible re-reduction or surgery."
      }
    ]
  },

  "ischemic-colitis-rpn": {
    title: "Ischemic Colitis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Ischemic Colitis",
      content: "Ischemic colitis is the most common form of gastrointestinal ischemia, occurring when blood flow to the colon is transiently reduced to a level insufficient to maintain cellular metabolic function, resulting in mucosal injury that ranges from reversible mucosal ischemia to transmural necrosis and gangrene. The colon receives its blood supply from branches of the superior mesenteric artery (SMA), which supplies the right colon and proximal two-thirds of the transverse colon, and the inferior mesenteric artery (IMA), which supplies the distal transverse colon, descending colon, sigmoid colon, and upper rectum. The watershed areas -- regions located at the junction of two arterial territories where collateral flow is weakest -- are the most vulnerable to ischemic injury. The two most clinically significant watershed areas are the splenic flexure (Griffiths point, at the junction of the SMA and IMA territories) and the rectosigmoid junction (Sudeck point, at the junction of the IMA and hypogastric artery territories). The rectum is typically spared because it has dual blood supply from the IMA and the internal iliac (hypogastric) arteries. The pathophysiology involves a reduction in mesenteric blood flow that can be occlusive (caused by thrombosis, embolism, or surgical ligation of mesenteric vessels) or, more commonly, non-occlusive (caused by systemic hypotension, low cardiac output states, vasoconstriction from medications, or atherosclerotic narrowing that reduces flow below the critical threshold during episodes of physiological stress). When oxygen delivery falls below cellular demand, the mucosal layer is injured first because it is the most metabolically active layer with the highest oxygen requirement. The mucosal barrier breaks down, allowing bacterial translocation from the bowel lumen into the damaged tissue, triggering an inflammatory cascade that worsens tissue injury. In mild cases, only the mucosa and submucosa are involved (non-gangrenous ischemic colitis), and the injury is often reversible with supportive care; the mucosa can regenerate within days to weeks. In severe cases, full-thickness (transmural) ischemia leads to gangrene, perforation, and peritonitis, requiring emergent surgical intervention with colonic resection. The typical clinical presentation is an elderly patient with atherosclerotic cardiovascular disease who develops sudden onset of mild-to-moderate crampy left-sided abdominal pain followed by an urgent desire to defecate and passage of bright red or maroon blood mixed with stool within 24 hours. The bleeding is usually mild and self-limited, in contrast to the massive hemorrhage seen with diverticular bleeding or angiodysplasia. Diagnosis is confirmed by colonoscopy performed within 48 hours, which reveals edematous, friable mucosa with segmental hemorrhagic lesions, often with a sharp demarcation between affected and normal segments at the watershed boundary. CT scan with IV contrast may show bowel wall thickening, thumbprinting (submucosal edema and hemorrhage), and stranding of pericolic fat. The majority of cases (approximately 80 percent) are non-gangrenous and resolve with conservative management: bowel rest (NPO), IV fluid resuscitation, broad-spectrum antibiotics to prevent secondary infection of damaged mucosa, and careful monitoring for signs of deterioration. The practical nurse monitors for complications including stricture formation (which occurs in 10-15 percent of cases weeks to months later), progression to gangrene (evidenced by worsening pain, peritoneal signs, sepsis, and lactic acidosis), and recurrence."
    },
    riskFactors: [
      "Age greater than 60 years (atherosclerosis reduces mesenteric arterial flow reserve)",
      "Atherosclerotic cardiovascular disease (coronary artery disease, peripheral vascular disease, aortic disease)",
      "Heart failure or low cardiac output states (reduced mesenteric perfusion during hemodynamic compromise)",
      "Atrial fibrillation (risk of mesenteric artery embolism from cardiac thrombus)",
      "Hypotension or shock (systemic hypoperfusion reduces mesenteric flow below critical threshold)",
      "Vasoconstrictive medications (vasopressors, digitalis, cocaine, ergot alkaloids)",
      "Recent aortic or cardiac surgery (embolization, temporary clamping of aorta, post-operative hypotension)"
    ],
    diagnostics: [
      "Colonoscopy within 48 hours: gold standard diagnostic test; reveals segmental edematous, hemorrhagic, friable mucosa with clear demarcation between affected and normal tissue; biopsies confirm mucosal ischemia",
      "CT abdomen with IV contrast: shows segmental bowel wall thickening (thumbprinting pattern), pericolic fat stranding, and may identify pneumatosis intestinalis (air in bowel wall indicating severe ischemia); also evaluates for mesenteric vessel patency",
      "Abdominal X-ray: may reveal thumbprinting (thickened haustra from submucosal edema and hemorrhage), dilated bowel loops, or free air under the diaphragm if perforation has occurred",
      "Complete blood count: leukocytosis with left shift suggests infection or tissue necrosis; hemoglobin and hematocrit may decrease with ongoing blood loss",
      "Serum lactate: elevated lactate (greater than 2 mmol/L) suggests tissue hypoperfusion and anaerobic metabolism; serial monitoring helps detect progression to gangrenous colitis",
      "Basic metabolic panel: assess for metabolic acidosis (low bicarbonate), renal function (elevated BUN/creatinine from dehydration or hypoperfusion), and electrolyte imbalances"
    ],
    management: [
      "Initiate bowel rest (NPO status) to reduce metabolic demand on the ischemic colonic mucosa and minimize intraluminal bacterial load",
      "Administer isotonic IV fluids (normal saline or lactated Ringers) to restore intravascular volume and support mesenteric perfusion",
      "Administer broad-spectrum IV antibiotics as ordered to prevent secondary bacterial infection of the ischemic mucosa; common regimens include ciprofloxacin plus metronidazole",
      "Discontinue or adjust any medications that may reduce mesenteric blood flow (vasoconstrictors, digitalis, diuretics) in consultation with the physician",
      "Optimize cardiac output and blood pressure to maintain adequate mesenteric perfusion; avoid hypotension",
      "Monitor for signs of gangrenous colitis requiring surgical intervention: worsening peritoneal signs, sepsis, pneumatosis intestinalis, rising lactate",
      "Gradually resume oral intake once symptoms resolve (usually 48-72 hours): begin with clear liquids and advance diet as tolerated"
    ],
    nursingActions: [
      "Monitor vital signs every 2 to 4 hours; report persistent tachycardia, hypotension, or fever as these may indicate progression to gangrenous colitis or sepsis",
      "Assess abdomen every 4 hours: auscultate bowel sounds, assess for distension, tenderness, guarding, and rebound tenderness; report worsening peritoneal signs immediately",
      "Monitor and document all stools: note frequency, volume, color (bright red, maroon, or melanotic), and consistency; report increasing blood loss",
      "Maintain strict intake and output records; report urine output less than 30 mL/hour as this may indicate inadequate renal perfusion",
      "Administer IV fluids and antibiotics as prescribed; monitor IV site for signs of infiltration or phlebitis",
      "Assess pain using a validated scale and administer analgesics as ordered; report sudden worsening or change in pain character (constant severe pain replacing crampy pain suggests progression)",
      "Educate the patient about the importance of NPO status, the expected course of recovery, and signs of complications to report after discharge including recurrent abdominal pain, bloody stools, or fever"
    ],
    assessmentFindings: [
      "Sudden onset crampy left-sided abdominal pain: typically mild to moderate, located in the left lower quadrant or periumbilical region, corresponding to the watershed areas of the colon",
      "Urgent desire to defecate followed by passage of bright red or maroon blood mixed with stool within 24 hours of pain onset",
      "Mild abdominal tenderness over the affected colonic segment, usually without peritoneal signs in non-gangrenous disease",
      "Low-grade fever may be present; high fever with rigors suggests progression to gangrenous colitis or secondary bacterial infection",
      "Abdominal distension with decreased bowel sounds in severe cases indicating ileus or obstruction from edematous bowel wall",
      "Signs of dehydration: dry mucous membranes, decreased skin turgor, concentrated urine, orthostatic hypotension"
    ],
    signs: {
      left: [
        "Mild crampy left-sided abdominal pain",
        "Urgent desire to defecate",
        "Small amount of blood mixed with stool",
        "Mild abdominal tenderness without guarding",
        "Low-grade temperature",
        "Decreased appetite and mild nausea"
      ],
      right: [
        "Severe constant abdominal pain with peritoneal signs (guarding, rigidity, rebound tenderness)",
        "Large-volume bloody diarrhea with hemodynamic instability",
        "High fever with rigors and signs of sepsis (tachycardia, hypotension, altered mental status)",
        "Absent bowel sounds with progressive abdominal distension",
        "Pneumatosis intestinalis on imaging (air in bowel wall indicating gangrene)",
        "Rising serum lactate with metabolic acidosis (tissue necrosis and anaerobic metabolism)"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid IV fluid",
        action: "Provides isotonic volume expansion to restore intravascular volume and improve mesenteric blood flow; the sodium and chloride concentrations approximate plasma osmolality (308 mOsm/L), keeping fluid in the extracellular compartment to support organ perfusion",
        sideEffects: "Fluid overload (pulmonary edema, peripheral edema), hyperchloremic metabolic acidosis with large-volume infusion, dilutional hyponatremia",
        contra: "Decompensated heart failure; monitor closely in patients with renal failure or pre-existing fluid overload",
        pearl: "Aggressive early fluid resuscitation is critical in ischemic colitis to restore mesenteric perfusion; monitor urine output as a marker of adequate resuscitation (goal greater than 0.5 mL/kg/hour); weigh the patient daily to assess fluid balance"
      },
      {
        name: "Heparin Sodium (Unfractionated Heparin)",
        type: "Anticoagulant (indirect thrombin inhibitor)",
        action: "Binds to antithrombin III, accelerating its inhibition of thrombin (factor IIa) and factor Xa by 1000-fold; prevents extension of existing thrombus and formation of new clots in mesenteric vasculature; used when occlusive mesenteric ischemia from thrombosis or embolism is suspected",
        sideEffects: "Bleeding (most significant risk), heparin-induced thrombocytopenia (HIT), osteoporosis with prolonged use, injection site reactions",
        contra: "Active uncontrolled bleeding; heparin-induced thrombocytopenia (HIT) history; severe thrombocytopenia; recent CNS surgery or active intracranial hemorrhage",
        pearl: "Monitor activated partial thromboplastin time (aPTT) every 6 hours and adjust infusion rate per protocol; therapeutic aPTT target is typically 1.5 to 2.5 times control; monitor platelet count every 2-3 days to detect HIT; have protamine sulfate available as the reversal agent"
      },
      {
        name: "Ciprofloxacin (Cipro)",
        type: "Fluoroquinolone antibiotic (DNA gyrase inhibitor)",
        action: "Inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, preventing DNA replication, transcription, repair, and recombination; bactericidal against gram-negative organisms including Escherichia coli, Klebsiella, and Pseudomonas that may translocate across ischemic bowel mucosa",
        sideEffects: "Nausea, diarrhea, headache, dizziness, photosensitivity, tendon rupture (especially Achilles tendon), QT prolongation, Clostridioides difficile-associated diarrhea, peripheral neuropathy",
        contra: "Known hypersensitivity to fluoroquinolones; concurrent use with tizanidine; myasthenia gravis (may exacerbate muscle weakness); use with caution in patients with QT prolongation risk or history of tendon disorders",
        pearl: "Often combined with metronidazole (for anaerobic coverage) in ischemic colitis to provide broad-spectrum coverage against translocating gut flora; advise adequate hydration to prevent crystalluria; monitor for tendon pain and discontinue if suspected tendinitis develops"
      }
    ],
    pearls: [
      "The splenic flexure and rectosigmoid junction are the two most vulnerable watershed areas in the colon because they lie at the boundary between major arterial territories where collateral flow is weakest",
      "The rectum is typically SPARED in ischemic colitis because it receives dual blood supply from the inferior mesenteric artery AND the internal iliac (hypogastric) arteries",
      "Thumbprinting on abdominal X-ray represents submucosal edema and hemorrhage within the colonic haustra and is a classic radiographic sign of ischemic colitis",
      "Approximately 80 percent of ischemic colitis cases are non-gangrenous and resolve with supportive care (bowel rest, IV fluids, antibiotics) within 1-2 weeks",
      "A sudden change from crampy intermittent pain to severe constant pain with peritoneal signs suggests progression from non-gangrenous to gangrenous colitis -- report this immediately as surgical intervention may be required",
      "Rising serum lactate with worsening metabolic acidosis is an ominous sign indicating tissue necrosis and anaerobic metabolism; serial lactate monitoring is essential",
      "Colonoscopy should be performed within 48 hours of symptom onset for definitive diagnosis; it shows segmental involvement with sharp transition between ischemic and normal mucosa"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 72-year-old patient with newly diagnosed ischemic colitis. The patient reports sudden onset of crampy left-sided abdominal pain followed by bloody diarrhea. Which area of the colon is MOST vulnerable to ischemic injury?",
        options: [
          "Cecum and ascending colon",
          "Rectum",
          "Splenic flexure (watershed area)",
          "Duodenum"
        ],
        correct: 2,
        rationale: "The splenic flexure is a watershed area located at the junction of the superior mesenteric artery and inferior mesenteric artery territories, where collateral blood flow is weakest. This makes it the most vulnerable area of the colon to ischemic injury when mesenteric blood flow is compromised."
      },
      {
        question: "The practical nurse is monitoring a patient with ischemic colitis who has been on bowel rest and IV fluids for 24 hours. Which finding should be reported immediately as a sign of progression to gangrenous colitis?",
        options: [
          "Resolution of abdominal pain with improved appetite",
          "Mild tenderness to palpation in the left lower quadrant",
          "Severe constant abdominal pain with rigidity, rebound tenderness, and rising fever",
          "Formed brown stool without visible blood"
        ],
        correct: 2,
        rationale: "Severe constant abdominal pain with peritoneal signs (rigidity, rebound tenderness) and rising fever indicates progression from non-gangrenous to gangrenous colitis, which involves full-thickness bowel wall necrosis. This is a surgical emergency requiring immediate physician notification."
      },
      {
        question: "Which laboratory value should the practical nurse monitor serially to detect worsening tissue ischemia in a patient with ischemic colitis?",
        options: [
          "Serum albumin level",
          "Serum lactate level",
          "Serum calcium level",
          "Serum iron level"
        ],
        correct: 1,
        rationale: "Serum lactate is a marker of tissue hypoperfusion and anaerobic metabolism. Rising lactate levels in a patient with ischemic colitis indicate worsening tissue ischemia and progression toward gangrenous colitis. Serial monitoring helps detect deterioration that may require surgical intervention."
      }
    ]
  },

  "iv-fluid-types-rpn": {
    title: "IV Fluid Types for Practical Nurses",
    cellular: {
      title: "Physiology of Intravenous Fluid Therapy and Osmolarity",
      content: "Intravenous (IV) fluid therapy is one of the most common interventions in clinical practice, used to restore and maintain fluid volume, correct electrolyte imbalances, deliver medications, and provide nutritional support. Understanding fluid physiology is essential for the practical nurse to administer IV fluids safely and monitor for complications. Total body water comprises approximately 60 percent of body weight in adult males and 50 percent in adult females, distributed between two major compartments: the intracellular fluid (ICF, approximately two-thirds of total body water) and the extracellular fluid (ECF, approximately one-third). The ECF is further divided into the intravascular compartment (plasma, approximately 25 percent of ECF) and the interstitial compartment (fluid between cells, approximately 75 percent of ECF). Fluid movement between compartments is governed by osmosis -- the movement of water across a semipermeable membrane from an area of lower solute concentration to an area of higher solute concentration. Osmolarity measures the total concentration of solutes per liter of solution and determines how a fluid will affect cell size and fluid distribution when infused intravenously. Normal serum osmolarity ranges from 275 to 295 mOsm/L. IV fluids are classified by their tonicity relative to blood plasma. Isotonic fluids have an osmolarity similar to plasma (approximately 275-295 mOsm/L) and do not cause net fluid shift between compartments; they expand the ECF volume without altering ICF volume. Examples include 0.9 percent normal saline (NS, 308 mOsm/L) and lactated Ringers (LR, 273 mOsm/L). Isotonic fluids are the first-line choice for volume resuscitation in dehydration, hemorrhage, and shock because they remain in the intravascular space effectively. Hypotonic fluids have an osmolarity lower than plasma (less than 275 mOsm/L), causing water to shift from the ECF into cells by osmosis, thus hydrating cells but potentially reducing intravascular volume. Examples include 0.45 percent normal saline (half-normal saline, 154 mOsm/L) and D5W (dextrose 5 percent in water, which is initially isotonic at 252 mOsm/L but becomes hypotonic after dextrose is metabolized). Hypotonic fluids are used for cellular dehydration (such as hypernatremia) but are CONTRAINDICATED in patients with increased intracranial pressure because water shifting into brain cells worsens cerebral edema. Hypertonic fluids have an osmolarity higher than plasma (greater than 295 mOsm/L), causing water to shift from cells into the ECF, thus expanding intravascular volume by pulling fluid from the intracellular and interstitial spaces. Examples include 3 percent saline (1026 mOsm/L), D5NS (560 mOsm/L), and D10W (505 mOsm/L). Hypertonic saline (3 percent) is used in severe symptomatic hyponatremia and increased intracranial pressure (pulls water out of edematous brain cells). Hypertonic fluids must be administered via a central venous catheter for concentrations above 3 percent and infused at controlled rates to prevent osmotic demyelination syndrome (previously called central pontine myelinolysis). Crystalloid solutions contain electrolytes and/or glucose dissolved in water; they are the most commonly used IV fluids and include all isotonic, hypotonic, and hypertonic solutions described above. Colloid solutions contain large molecules (proteins or synthetic polymers) such as albumin, dextran, and hydroxyethyl starch that remain in the intravascular space longer than crystalloids, providing sustained volume expansion. Colloids are more expensive and carry specific risks (allergic reactions, coagulopathy with synthetic colloids) but may be indicated when crystalloids alone are insufficient for volume resuscitation or when oncotic pressure needs to be restored (as in hypoalbuminemia). The practical nurse must understand these classifications to verify that the prescribed fluid is appropriate for the clinical situation, calculate and set the correct infusion rate, monitor for complications including fluid overload, electrolyte imbalances, and infiltration, and report any adverse effects promptly."
    },
    riskFactors: [
      "Heart failure (fluid overload risk with isotonic or hypertonic solutions)",
      "Renal failure (impaired ability to excrete excess fluid and electrolytes)",
      "Hepatic cirrhosis with ascites (third-spacing and altered albumin production)",
      "Extremes of age (infants and elderly have limited physiological reserve for fluid shifts)",
      "Brain injury or increased intracranial pressure (hypotonic fluids worsen cerebral edema)",
      "Severe hyponatremia (rapid correction with hypertonic saline risks osmotic demyelination syndrome)",
      "Burns or major trauma (massive fluid shifts and third-spacing requiring aggressive resuscitation)"
    ],
    diagnostics: [
      "Serum electrolytes (sodium, potassium, chloride, bicarbonate): baseline and serial monitoring to guide fluid selection and detect imbalances caused by IV therapy",
      "Serum osmolarity: normal 275-295 mOsm/L; helps determine whether the patient needs isotonic, hypotonic, or hypertonic replacement",
      "Blood urea nitrogen (BUN) and creatinine: elevated BUN:creatinine ratio greater than 20:1 suggests prerenal dehydration; monitor renal function during fluid therapy",
      "Urine specific gravity: concentrated urine (greater than 1.030) suggests dehydration; dilute urine (less than 1.005) may indicate fluid overload or excessive hypotonic fluid",
      "Daily weights: the single most accurate measure of fluid balance; 1 kg weight change equals approximately 1 liter of fluid gain or loss",
      "Hemoglobin and hematocrit: elevated levels may indicate hemoconcentration from dehydration; decreased levels during fluid therapy may reflect hemodilution rather than blood loss"
    ],
    management: [
      "Select the appropriate fluid type based on the clinical indication: isotonic for volume resuscitation, hypotonic for cellular dehydration, hypertonic for severe hyponatremia or increased ICP",
      "Calculate the prescribed infusion rate accurately using drops per minute (gtt/min) formula or verify electronic pump settings before initiating therapy",
      "Monitor intake and output strictly every 1 to 2 hours in acute settings; report significant imbalances (output less than 30 mL/hour for adults or less than 1 mL/kg/hour for children)",
      "Weigh the patient daily at the same time, with the same clothing, on the same scale to accurately track fluid balance",
      "Assess for signs of fluid overload every 2 to 4 hours: lung auscultation for crackles, peripheral edema, jugular venous distension, dyspnea, increasing blood pressure",
      "Assess for signs of dehydration: decreased skin turgor, dry mucous membranes, orthostatic hypotension, concentrated urine, tachycardia",
      "Administer hypertonic solutions via infusion pump at a controlled rate; 3 percent saline should increase serum sodium no faster than 8-10 mEq/L in 24 hours to prevent osmotic demyelination"
    ],
    nursingActions: [
      "Verify the fluid type, rate, and route against the physician order before initiating any IV infusion; use two patient identifiers",
      "Inspect the IV solution bag for clarity, expiration date, and integrity of the bag and seal before hanging; do not use if cloudy or expired",
      "Label all IV fluid bags and tubing with the date, time of initiation, and infusion rate; change tubing per facility protocol (typically every 72-96 hours for continuous infusions)",
      "Monitor the IV site every 1 to 2 hours for signs of infiltration (swelling, coolness, pallor, pain at site), phlebitis (redness, warmth, tenderness, palpable venous cord), and extravasation",
      "Assess lung sounds, jugular venous pressure, and peripheral edema before and during IV fluid therapy to detect fluid overload early",
      "Monitor serum sodium levels closely when administering hypertonic saline; report any increase greater than 10-12 mEq/L in 24 hours to prevent osmotic demyelination syndrome",
      "Report any signs of transfusion or fluid reaction: fever, chills, urticaria, dyspnea, chest tightness, or back pain; stop the infusion and notify the physician immediately"
    ],
    assessmentFindings: [
      "Dehydration assessment: poor skin turgor (tenting), dry cracked mucous membranes, sunken eyes, concentrated dark urine, orthostatic hypotension, tachycardia, decreased urine output",
      "Fluid overload assessment: peripheral edema (pitting), pulmonary crackles (bibasilar initially), jugular venous distension, weight gain greater than 1 kg/day, hypertension, bounding pulse, dyspnea",
      "Hyponatremia signs (serum Na less than 135 mEq/L): nausea, headache, confusion, lethargy, muscle cramps, seizures in severe cases (less than 120 mEq/L)",
      "Hypernatremia signs (serum Na greater than 145 mEq/L): intense thirst, dry sticky mucous membranes, restlessness, irritability, muscle twitching, seizures in severe cases",
      "IV site complications: infiltration (edema, coolness, blanching at insertion site), phlebitis (red streak along vein, warmth, tenderness), extravasation (tissue necrosis with vesicant drugs)",
      "Speed shock signs (from too-rapid infusion): facial flushing, headache, irregular pulse, syncope, cardiac arrest"
    ],
    signs: {
      left: [
        "Mild thirst and dry mouth",
        "Slightly decreased urine output",
        "Mild peripheral edema with isotonic fluid infusion",
        "Slight weight change (less than 1 kg/day)",
        "Mild tachycardia",
        "Subtle changes in skin turgor"
      ],
      right: [
        "Pulmonary edema (crackles, dyspnea, pink frothy sputum) from fluid overload",
        "Seizures from rapid sodium correction or severe hyponatremia (less than 120 mEq/L)",
        "Cardiac dysrhythmias from electrolyte imbalances (especially potassium shifts)",
        "Osmotic demyelination syndrome (confusion, quadriplegia, dysarthria from overly rapid sodium correction)",
        "Speed shock (headache, syncope, cardiac arrest from rapid infusion)",
        "Anaphylaxis to colloid solutions (urticaria, bronchospasm, hypotension, cardiac arrest)"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid solution (308 mOsm/L)",
        action: "Provides isotonic volume expansion that remains primarily in the extracellular fluid compartment; does not cause fluid shifts between the ECF and ICF because its osmolarity approximates plasma; replaces sodium, chloride, and water losses",
        sideEffects: "Hyperchloremic metabolic acidosis with large volumes (excess chloride depresses bicarbonate), fluid overload (pulmonary edema, peripheral edema), hypernatremia with excessive administration",
        contra: "Decompensated heart failure; hypernatremia; fluid overload states; use with caution in patients with renal impairment or hepatic cirrhosis with ascites",
        pearl: "First-line fluid for acute volume resuscitation (trauma, hemorrhage, dehydration); approximately 25 percent of infused volume remains intravascular after 1 hour; only compatible IV fluid for blood product administration -- NEVER use lactated Ringers with blood (calcium causes clotting)"
      },
      {
        name: "Lactated Ringers (LR / Hartmann Solution)",
        type: "Isotonic balanced crystalloid solution (273 mOsm/L)",
        action: "Provides isotonic volume expansion similar to normal saline but with a more physiological electrolyte composition including sodium, potassium, calcium, chloride, and lactate; the lactate is converted to bicarbonate by the liver, providing a mild buffering effect that reduces the risk of hyperchloremic acidosis seen with large-volume normal saline",
        sideEffects: "Fluid overload with excessive administration, hyperkalemia risk in patients with renal failure (contains 4 mEq/L potassium), metabolic alkalosis if lactate conversion to bicarbonate is excessive",
        contra: "Severe hepatic failure (impaired lactate-to-bicarbonate conversion may worsen lactic acidosis); hyperkalemia; concurrent blood product infusion (calcium in LR can cause clotting in blood tubing); alkalotic states",
        pearl: "Preferred over normal saline for large-volume resuscitation in surgical and trauma patients because it causes less hyperchloremic acidosis; contraindicated as a carrier for blood products due to calcium content; monitor potassium in renal impairment patients"
      },
      {
        name: "Dextrose 5% in Water (D5W)",
        type: "Isotonic solution that becomes hypotonic in vivo (252 mOsm/L initially)",
        action: "Initially isotonic when infused (252 mOsm/L from dissolved dextrose), but the dextrose is rapidly metabolized by cells, leaving free water that distributes across all body fluid compartments; effectively provides free water for cellular hydration and a small amount of calories (170 kcal/L); used for medication dilution and maintenance of vein patency",
        sideEffects: "Hyperglycemia (especially in diabetic patients), water intoxication and dilutional hyponatremia with excessive administration, cerebral edema if used in patients with increased intracranial pressure",
        contra: "Increased intracranial pressure (free water worsens cerebral edema); diabetic ketoacidosis (worsens hyperglycemia); severe hyponatremia without concurrent sodium replacement; do NOT use for volume resuscitation (free water distributes to all compartments and does not effectively expand intravascular volume)",
        pearl: "D5W becomes HYPOTONIC once dextrose is metabolized -- this is a critical concept for the practical nurse to understand; it should NOT be used for volume resuscitation; monitor blood glucose regularly when infusing dextrose-containing solutions; commonly used as a diluent for IV medications"
      }
    ],
    pearls: [
      "ISOTONIC fluids (NS, LR) stay in the extracellular space and are first-line for volume resuscitation; HYPOTONIC fluids (0.45% NS, D5W after metabolism) shift water INTO cells; HYPERTONIC fluids (3% saline) pull water OUT of cells",
      "D5W is technically isotonic in the bag but becomes HYPOTONIC in vivo once the dextrose is metabolized, leaving only free water -- this is why it should NEVER be used for volume resuscitation",
      "NEVER administer blood products with lactated Ringers -- the calcium in LR causes clotting in the blood tubing; only normal saline is compatible with blood products",
      "Hypotonic fluids are CONTRAINDICATED in patients with increased intracranial pressure because water shifting into brain cells worsens cerebral edema and can lead to brain herniation",
      "Hypertonic saline (3%) must be infused slowly via a pump; serum sodium should not increase faster than 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome (previously called central pontine myelinolysis)",
      "Daily weight is the single most accurate indicator of fluid balance: a 1 kg weight gain equals approximately 1 liter of fluid retention",
      "The drip rate formula for manual IV infusions is: (Volume in mL x Drop factor) / Time in minutes = drops per minute -- always verify pump settings match physician orders before starting an infusion"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with increased intracranial pressure. Which IV fluid type is CONTRAINDICATED for this patient?",
        options: [
          "0.9% Normal Saline (isotonic)",
          "3% Hypertonic Saline",
          "0.45% Half-Normal Saline (hypotonic)",
          "Lactated Ringers (isotonic)"
        ],
        correct: 2,
        rationale: "Hypotonic fluids such as 0.45% half-normal saline are contraindicated in patients with increased intracranial pressure because the lower osmolarity causes water to shift from the extracellular space into cells by osmosis, including brain cells, worsening cerebral edema and potentially leading to brain herniation."
      },
      {
        question: "A practical nurse is preparing to administer a blood transfusion. Which IV fluid should be used to prime the blood tubing and as a concurrent infusion?",
        options: [
          "Lactated Ringers",
          "D5W (Dextrose 5% in Water)",
          "0.9% Normal Saline",
          "D5 0.45% Normal Saline"
        ],
        correct: 2,
        rationale: "Normal saline (0.9% NaCl) is the ONLY IV solution compatible with blood product administration. Lactated Ringers contains calcium which can cause clotting in the blood tubing. D5W and other dextrose-containing solutions can cause hemolysis of red blood cells."
      },
      {
        question: "A practical nurse is monitoring a patient receiving D5W infusion. The nurse understands that D5W is classified as which type of fluid once infused into the body?",
        options: [
          "Isotonic -- it stays isotonic because the dextrose remains in solution",
          "Hypertonic -- the dextrose increases the osmolarity above plasma levels",
          "Hypotonic -- the dextrose is metabolized, leaving free water that dilutes body fluids",
          "Colloid -- the dextrose molecules act as large oncotic particles"
        ],
        correct: 2,
        rationale: "D5W is technically isotonic in the IV bag (252 mOsm/L), but once infused, the dextrose is rapidly metabolized by cells, leaving only free water. This free water distributes across all body fluid compartments, effectively making D5W a hypotonic solution in vivo. This is why it should not be used for volume resuscitation."
      }
    ]
  },

  "iv-therapy-basics-rpn": {
    title: "IV Therapy Basics and Monitoring for Practical Nurses",
    cellular: {
      title: "Principles of Intravenous Access and Fluid Delivery",
      content: "Intravenous (IV) therapy involves the administration of fluids, medications, blood products, and nutritional solutions directly into the venous circulation, providing the most rapid and predictable route for systemic delivery. The practical nurse must understand the anatomy of the peripheral venous system, the principles of catheter selection, site assessment, infusion monitoring, and complication recognition to provide safe IV therapy. Peripheral IV access utilizes superficial veins of the upper extremities, with the hand, forearm, and antecubital fossa being the most common insertion sites. The cephalic vein runs along the lateral (radial) aspect of the forearm and is the preferred first-choice vein due to its large size, accessibility, and lower risk of nerve injury. The basilic vein runs along the medial (ulnar) aspect of the forearm and is an alternative, though it is closer to the brachial artery and median nerve, increasing the risk of inadvertent arterial puncture or nerve damage. The median cubital vein in the antecubital fossa is large and easily palpated, making it ideal for blood draws and short-term infusions, but it limits arm mobility and is prone to dislodgement with movement. The dorsal metacarpal veins of the hand are suitable for short-term therapy in adults but are painful to cannulate and more prone to infiltration. Site selection should consider the patient's activity level, the type and duration of therapy, the osmolarity and pH of the infusate, and patient preference. As a general rule, start distally and work proximally so that if the first site fails, the next proximal site can still be used without risk of extravasation through the previous puncture site. IV catheters are measured by gauge, with the gauge number inversely proportional to the catheter diameter: larger gauge numbers indicate smaller catheters. An 18-gauge catheter (green hub, typically) is the standard for most adult infusions and permits adequate flow rates; a 16-gauge or 14-gauge catheter is required for rapid fluid resuscitation, trauma, or blood product administration; a 20-gauge or 22-gauge catheter is appropriate for maintenance fluids, pediatric patients, or patients with small fragile veins. The flow rate through a catheter is determined by the Poiseuille equation and is proportional to the fourth power of the radius and inversely proportional to the length, meaning that a short, large-bore catheter delivers fluid much faster than a long, narrow one. Central venous catheters (CVCs) provide access to large central veins (subclavian, internal jugular, or femoral) and are used for long-term therapy, vesicant medication administration, total parenteral nutrition (TPN), hemodynamic monitoring, and when peripheral access cannot be obtained. Types of central access include non-tunneled CVCs (short-term), tunneled catheters (Hickman, Broviac), implanted ports (Port-a-Cath), and peripherally inserted central catheters (PICC lines, inserted through a peripheral vein and advanced to the superior vena cava). The practical nurse monitors peripheral IV sites regularly for complications using the phlebitis assessment scale. Phlebitis is inflammation of the vein wall and is graded from 0 (no symptoms) to 4 (pain along the venous path with palpable venous cord greater than 2.5 cm, purulent drainage, and fever). Mechanical phlebitis results from catheter movement or improper stabilization, chemical phlebitis from irritating or hyperosmolar solutions, and bacterial phlebitis from contamination. Infiltration occurs when non-vesicant IV fluid leaks into surrounding tissue, causing swelling, coolness, and pallor; it is graded from 1 (slight edema) to 4 (extensive edema with skin blanching, circulatory compromise, and moderate-to-severe pain). Extravasation is infiltration of a vesicant medication (such as certain chemotherapy agents, vasopressors, or calcium), causing tissue necrosis and requiring immediate intervention with specific antidotes. Other complications include catheter-related bloodstream infection (CRBSI), air embolism, speed shock, and catheter embolism. The practical nurse must maintain aseptic technique during all aspects of IV therapy, perform routine site assessments, flush catheters per protocol to maintain patency, and promptly recognize and report complications."
    },
    riskFactors: [
      "Extremes of age (neonates and elderly have fragile veins, reduced subcutaneous tissue, and impaired skin integrity)",
      "Chronic illness requiring frequent IV access (venous scarring, limited viable access sites)",
      "Diabetes mellitus (peripheral vascular disease, delayed wound healing, increased infection risk)",
      "Immunocompromised state (chemotherapy, HIV, transplant recipients at higher risk for catheter-related infection)",
      "Coagulopathy or anticoagulant therapy (increased bleeding and hematoma formation at insertion site)",
      "Obesity (deep veins difficult to visualize and palpate, requiring longer catheters or ultrasound guidance)",
      "History of IV drug use (venous sclerosis, thrombosis, limited peripheral access)"
    ],
    diagnostics: [
      "Visual inspection and palpation of peripheral veins: assess for vein straightness, bounce, refill, and absence of valves or bifurcations before cannulation",
      "Phlebitis assessment scale (0-4): Grade 0 = no symptoms; Grade 1 = erythema at site with or without pain; Grade 2 = pain with erythema and/or edema; Grade 3 = pain with erythema, streak formation, palpable venous cord; Grade 4 = pain with erythema, streak, palpable cord greater than 2.5 cm, purulent drainage",
      "Infiltration scale (0-4): Grade 1 = skin blanched, edema less than 2.5 cm, cool to touch; Grade 2 = skin blanched, edema 2.5-15 cm; Grade 3 = skin blanched/translucent, gross edema greater than 15 cm, mild-moderate pain; Grade 4 = skin blanched/discolored, tight, pitting edema, circulatory impairment",
      "Blood cultures (peripheral and through catheter): drawn when CRBSI suspected; differential time to positivity greater than 2 hours for catheter sample suggests catheter as the infection source",
      "Chest X-ray: confirms central venous catheter tip position (should be at the cavoatrial junction); identifies complications such as pneumothorax after subclavian or internal jugular CVC insertion",
      "Ultrasound-guided vein assessment: used for difficult IV access; identifies vein depth, diameter, and patency before cannulation attempt"
    ],
    management: [
      "Select the smallest gauge catheter that accommodates the prescribed therapy to minimize vein trauma: 18G for most adult infusions, 16G or 14G for rapid resuscitation and blood, 20-22G for maintenance and fragile veins",
      "Perform hand hygiene and use aseptic technique for all IV insertion, site care, tubing changes, and accessing ports; scrub injection ports with 70 percent alcohol for 15 seconds before access",
      "Secure the catheter with a sterile transparent semipermeable dressing to allow continuous visual assessment of the insertion site; change dressing every 5-7 days or immediately if damp, loosened, or soiled",
      "Flush peripheral IV catheters with 3-10 mL normal saline before and after medication administration and every 8-12 hours for patency using a pulsatile (push-pause) technique",
      "Rotate peripheral IV sites every 72-96 hours per facility protocol or at the first sign of phlebitis, infiltration, or occlusion to prevent complications",
      "Change primary IV administration sets every 72-96 hours for continuous infusions; change sets used for blood products, lipid-containing solutions, or intermittent infusions every 24 hours",
      "Monitor the IV site at a minimum of every 4 hours (every 1-2 hours for critically ill patients or when infusing vesicants); document assessment findings using the phlebitis and infiltration scales"
    ],
    nursingActions: [
      "Perform a systematic IV site assessment at least every 4 hours and with each medication administration: inspect for redness, swelling, tenderness, drainage, and palpate for venous cord or induration",
      "Verify the five rights (right patient, right medication/fluid, right dose/rate, right route, right time) and two patient identifiers before initiating or adjusting any IV therapy",
      "Monitor the infusion rate (drops per minute or pump rate) at the beginning of each shift and after any patient repositioning or ambulation; recalculate if the rate appears altered",
      "Report and document phlebitis Grade 2 or higher immediately; discontinue the catheter, apply warm compresses to the affected area, and establish a new IV at a different site proximal to the previous site or on the opposite extremity",
      "If infiltration is detected, stop the infusion immediately, disconnect the tubing, aspirate any residual fluid through the catheter before removal, elevate the extremity, apply warm or cool compresses based on the infiltrated solution",
      "Maintain accurate intake and output records; document the type and amount of all IV fluids infused, the site location and gauge of the catheter, and any complications",
      "Educate the patient to report any pain, swelling, burning, or leaking at the IV site immediately and to avoid pulling on tubing or submerging the site in water"
    ],
    assessmentFindings: [
      "Normal IV site: insertion site clean and dry, no redness or swelling, catheter secured with intact dressing, IV fluid infusing at prescribed rate, patient denies pain at site",
      "Phlebitis: erythema along the vein path, warmth, tenderness, possible palpable venous cord (hardened vein), pain that increases with infusion; graded 0-4 using the phlebitis scale",
      "Infiltration: swelling at and around the insertion site, skin cool and pale, decreased or absent infusion flow rate, pain or tightness reported by patient; edema does not subside with elevation initially",
      "Extravasation: similar to infiltration but with a vesicant agent; can cause tissue blistering, necrosis, and ulceration; requires immediate intervention with specific antidotes (e.g., hyaluronidase for vinca alkaloids, phentolamine for vasopressor extravasation)",
      "Catheter-related bloodstream infection (CRBSI): fever, chills, erythema and purulent drainage at insertion site, positive blood cultures; systemic signs may include tachycardia, hypotension, and altered mental status",
      "Air embolism: sudden dyspnea, chest pain, hypotension, churning (mill-wheel) heart murmur; medical emergency requiring left lateral Trendelenburg positioning",
      "Speed shock: facial flushing, headache, tightness in chest, irregular pulse, loss of consciousness, cardiac arrest; caused by too-rapid infusion of medication"
    ],
    signs: {
      left: [
        "Mild tenderness at IV insertion site without redness",
        "Slight decrease in infusion flow rate",
        "Minimal edema around the catheter insertion site",
        "Dressing slightly damp or loosened requiring change",
        "Patient reports intermittent discomfort with infusion",
        "Mild erythema at the insertion site (Grade 1 phlebitis)"
      ],
      right: [
        "Purulent drainage from catheter site with fever and chills (CRBSI)",
        "Extensive edema with skin blanching, tissue necrosis (Grade 4 infiltration or extravasation)",
        "Sudden dyspnea, chest pain, and hypotension (air embolism)",
        "Facial flushing, irregular pulse, and syncope (speed shock)",
        "Palpable venous cord with streak formation and purulent drainage (Grade 4 phlebitis)",
        "Signs of sepsis: tachycardia, hypotension, altered mental status, high fever"
      ]
    },
    medications: [
      {
        name: "Heparin Flush (Heparin Lock Flush Solution)",
        type: "Anticoagulant flush solution (10-100 units/mL)",
        action: "Low-concentration heparin solution used to maintain catheter patency by preventing fibrin clot formation within the catheter lumen; binds to antithrombin III which inactivates thrombin and prevents the conversion of fibrinogen to fibrin at the catheter tip",
        sideEffects: "Heparin-induced thrombocytopenia (HIT) even with small flush doses (rare but serious), bleeding at puncture sites, hypersensitivity reactions",
        contra: "History of heparin-induced thrombocytopenia (HIT); active uncontrolled bleeding; known hypersensitivity to heparin or pork products (heparin is derived from porcine intestinal mucosa)",
        pearl: "Many facilities have transitioned to normal saline flushes for peripheral IV catheters (evidence shows equal efficacy); heparin flushes are still used for central venous catheters and implanted ports; always verify concentration (flush solution is 10-100 units/mL versus therapeutic heparin which is 1000-10000 units/mL) to prevent accidental overdose"
      },
      {
        name: "Normal Saline Flush (0.9% NaCl Prefilled Syringe)",
        type: "Isotonic flush solution",
        action: "Isotonic sodium chloride solution used to verify catheter patency, clear the catheter lumen of blood or medication residue, and prevent incompatible medications from mixing within the catheter; the pulsatile flush technique creates turbulence that clears the catheter lumen more effectively than a steady push",
        sideEffects: "Minimal with flush volumes; rare risk of fluid overload with excessive or frequent flushing in fluid-restricted patients or neonates",
        contra: "No absolute contraindications for flush use; use caution with fluid-restricted patients; verify the catheter is patent (no resistance) before flushing to avoid catheter rupture or embolization",
        pearl: "Use the push-pause (pulsatile) technique when flushing: push 1-2 mL, pause, push 1-2 mL -- this creates turbulence that effectively clears the catheter lumen; flush with 3-10 mL before and after each medication; NEVER force a flush against resistance -- this may indicate occlusion or catheter malposition and forcing can cause catheter rupture"
      },
      {
        name: "Chlorhexidine Gluconate (2% CHG with 70% Isopropyl Alcohol)",
        type: "Antiseptic skin preparation solution",
        action: "Disrupts bacterial cell membranes through interaction with negatively charged phospholipid components, causing cell lysis and death; provides broad-spectrum bactericidal activity against gram-positive and gram-negative organisms, fungi, and some viruses; has residual antimicrobial activity that persists on the skin for up to 48 hours after application",
        sideEffects: "Skin irritation, contact dermatitis, rare anaphylactic reactions (especially with repeated mucosal exposure); do not allow to pool under the patient as the alcohol component can cause chemical burns",
        contra: "Known chlorhexidine allergy (use povidone-iodine as alternative); use with caution in neonates less than 2 months of age (immature skin barrier increases absorption risk); avoid contact with eyes, ears, and mucous membranes",
        pearl: "Apply using a back-and-forth friction scrub for at least 30 seconds and allow to dry completely (approximately 2 minutes) before catheter insertion -- the antimicrobial effect is significantly reduced if the skin is not dry; chlorhexidine-impregnated dressings (CHG patches) reduce CRBSI rates and are recommended for central line sites"
      }
    ],
    pearls: [
      "Gauge number is INVERSELY proportional to catheter diameter: a 14G catheter is LARGER than a 22G catheter -- larger bore allows faster flow rates needed for resuscitation and blood products",
      "Start IV cannulation DISTALLY and work PROXIMALLY -- if the first attempt fails, the next proximal site remains viable; starting proximally risks extravasation through the failed distal puncture site",
      "The phlebitis scale ranges from Grade 0 (no symptoms) to Grade 4 (pain, erythema, streak formation, palpable cord greater than 2.5 cm, purulent drainage) -- Grade 2 or higher requires catheter removal and site change",
      "NEVER force a flush against resistance -- resistance indicates catheter occlusion, kinking, or malposition; forcing can rupture the catheter, causing embolization of catheter fragments into the bloodstream",
      "Normal saline is the ONLY IV solution compatible with blood product administration -- lactated Ringers contains calcium that causes blood clotting, and dextrose solutions cause hemolysis",
      "Peripheral IV sites should be rotated every 72-96 hours per facility protocol; central venous catheter dressings should be changed every 5-7 days (transparent) or every 2 days (gauze dressings)",
      "If air embolism is suspected (sudden dyspnea, chest pain, hypotension after IV disconnection), position the patient in LEFT lateral TRENDELENBURG (left side lying, head down) to trap air in the right atrium and prevent it from entering the pulmonary vasculature"
    ],
    quiz: [
      {
        question: "A practical nurse observes redness, warmth, and a palpable venous cord along the vein path at a patient's IV site. The patient reports pain at the site. Using the phlebitis assessment scale, how should this finding be graded?",
        options: [
          "Grade 1 (erythema at site with or without pain)",
          "Grade 2 (pain with erythema and/or edema)",
          "Grade 3 (pain, erythema, streak formation, palpable venous cord)",
          "Grade 4 (all signs plus purulent drainage)"
        ],
        correct: 2,
        rationale: "Grade 3 phlebitis is characterized by pain along the venous path, erythema, streak formation, and a palpable venous cord. Grade 4 would require purulent drainage and/or fever in addition to these findings. The practical nurse should discontinue the IV, apply warm compresses, and restart at a new site."
      },
      {
        question: "A practical nurse is selecting a peripheral IV catheter for an adult patient requiring emergency fluid resuscitation after significant blood loss. Which gauge catheter is most appropriate?",
        options: [
          "22-gauge (smallest common adult gauge)",
          "20-gauge (standard maintenance gauge)",
          "18-gauge (standard adult gauge)",
          "14-gauge or 16-gauge (large bore for rapid resuscitation)"
        ],
        correct: 3,
        rationale: "Emergency fluid resuscitation and blood product administration require large-bore peripheral IV access (14-gauge or 16-gauge) to allow rapid infusion rates. Flow rate is proportional to the fourth power of the catheter radius, meaning a large-bore catheter delivers fluid dramatically faster than a smaller gauge."
      },
      {
        question: "A patient on IV therapy suddenly develops dyspnea, chest pain, and hypotension after the IV tubing was briefly disconnected. The practical nurse suspects an air embolism. What is the priority position for this patient?",
        options: [
          "High Fowler position (sitting upright at 90 degrees)",
          "Right lateral Trendelenburg (right side down, head elevated)",
          "Left lateral Trendelenburg (left side down, head lowered)",
          "Supine with legs elevated (shock position)"
        ],
        correct: 2,
        rationale: "Left lateral Trendelenburg position (left side down, head lowered) is the priority position for suspected air embolism. This position traps the air bubble in the right atrium where it can be gradually absorbed, preventing it from entering the pulmonary vasculature and causing a fatal pulmonary air embolism."
      }
    ]
  },

  "klinefelter-syndrome-rpn": {
    title: "Klinefelter Syndrome for Practical Nurses",
    cellular: {
      title: "Genetics and Pathophysiology of Klinefelter Syndrome",
      content: "Klinefelter syndrome (KS) is the most common sex chromosome aneuploidy in males, occurring in approximately 1 in 500 to 1 in 1000 live male births. It results from the presence of one or more extra X chromosomes, with the classic karyotype being 47,XXY (present in approximately 80-90 percent of cases). Variant karyotypes include 48,XXXY, 48,XXYY, 49,XXXXY, and mosaic forms (46,XY/47,XXY) where some cells have a normal male karyotype and others carry the extra X chromosome. The mosaic form tends to present with milder clinical features because a proportion of cells function normally. The condition arises from nondisjunction during parental meiosis -- the failure of the sex chromosomes (either maternal XX or paternal XY pair) to separate properly during cell division, resulting in a gamete with an extra sex chromosome. Risk factors for nondisjunction include advanced maternal age, though Klinefelter syndrome can occur regardless of parental age. The extra X chromosome is largely inactivated (X-inactivation or lyonization) in each cell, similar to the process in typical females, but some genes on the X chromosome escape inactivation and are expressed from both X chromosomes, contributing to the phenotypic features of the syndrome. The primary pathophysiological consequence of the extra X chromosome is testicular dysgenesis -- the progressive fibrosis and hyalinization of the seminiferous tubules beginning in puberty, which leads to primary hypogonadism. The seminiferous tubules normally contain Sertoli cells (which support spermatogenesis) and germ cells (which produce sperm). In Klinefelter syndrome, the germ cells are progressively lost and the seminiferous tubules become fibrotic, resulting in small, firm testes (typically less than 4 mL volume, compared to the normal adult male testicular volume of 15-25 mL) and azoospermia (absence of sperm in the ejaculate), which causes infertility in the vast majority of affected males. Leydig cells (which produce testosterone) are initially functional but become progressively impaired, leading to testosterone deficiency (hypogonadism) that becomes clinically apparent during and after puberty. The hypothalamic-pituitary-gonadal axis responds to low testosterone by increasing gonadotropin-releasing hormone (GnRH) secretion, which stimulates elevated levels of follicle-stimulating hormone (FSH) and luteinizing hormone (LH) -- this pattern of low testosterone with elevated FSH and LH is termed hypergonadotropic hypogonadism and is the characteristic hormonal profile. The clinical presentation varies widely in severity and timing of recognition. Many affected males are not diagnosed until puberty or adulthood, when they present with incomplete virilization, gynecomastia (breast tissue enlargement in males, occurring in 38-75 percent of cases due to an imbalanced testosterone-to-estrogen ratio), tall stature with disproportionately long legs (eunuchoid body habitus, because testosterone normally promotes epiphyseal closure and its deficiency allows continued long bone growth), sparse facial and body hair, small firm testes, decreased muscle mass, reduced libido, erectile dysfunction, and infertility. Cognitive and behavioral effects can include mild learning disabilities (particularly in language processing, reading, and verbal expression), attention difficulties, and social challenges, though intelligence is usually within the normal range. Boys may present in childhood with delayed speech development, learning difficulties, or behavioral concerns before the physical signs of hypogonadism become apparent. Diagnosis is confirmed by karyotype analysis from a peripheral blood sample. Hormonal testing reveals the characteristic pattern: low serum total and free testosterone, elevated FSH (markedly elevated due to seminiferous tubule failure), and elevated LH. Testosterone replacement therapy (TRT) is the cornerstone of medical management, initiated at the onset of puberty or at the time of diagnosis in adolescents and adults. TRT improves virilization (facial and body hair growth, deepening of voice, increased muscle mass), bone mineral density, energy levels, libido, mood, and cognitive function, but it does NOT restore fertility because testicular tubular fibrosis is irreversible. For those desiring biological children, microsurgical testicular sperm extraction (micro-TESE) combined with intracytoplasmic sperm injection (ICSI) may be successful in some cases, particularly in mosaic forms. The practical nurse plays an important role in supporting patients through the psychological and emotional aspects of a chronic genetic condition, administering and monitoring testosterone replacement therapy, monitoring for metabolic complications (increased risk of metabolic syndrome, type 2 diabetes, cardiovascular disease, osteoporosis, and venous thromboembolism), screening for gynecomastia-related concerns including the slightly increased risk of male breast cancer (20-50 times higher than the general male population, though still rare in absolute terms), and facilitating referrals to endocrinology, genetics, fertility specialists, and mental health professionals."
    },
    riskFactors: [
      "Advanced maternal age at conception (increased risk of meiotic nondisjunction events)",
      "Family history of chromosomal aneuploidies (may indicate familial predisposition to nondisjunction)",
      "Testosterone deficiency (leads to metabolic syndrome, increased visceral fat, insulin resistance, and type 2 diabetes)",
      "Osteoporosis risk due to chronic hypogonadism (testosterone is essential for maintaining bone mineral density in males)",
      "Increased risk of venous thromboembolism (mechanism not fully understood, may relate to altered coagulation factors)",
      "Psychosocial vulnerability (learning disabilities, social challenges, body image concerns related to gynecomastia and incomplete virilization)",
      "Increased risk of autoimmune disorders (systemic lupus erythematosus, rheumatoid arthritis, Sjogren syndrome)"
    ],
    diagnostics: [
      "Karyotype analysis (chromosomal analysis from peripheral blood): definitive diagnostic test; reveals 47,XXY in classic cases or variant/mosaic patterns; results typically available within 1-2 weeks",
      "Serum total and free testosterone: low levels confirm hypogonadism; total testosterone typically below 300 ng/dL in affected adult males; should be drawn in the morning when levels peak",
      "Serum FSH and LH: both markedly elevated (hypergonadotropic hypogonadism); FSH is particularly elevated due to seminiferous tubule failure and loss of inhibin B feedback",
      "Semen analysis: reveals azoospermia (absence of sperm) or severe oligospermia in the majority of cases; critical for fertility counseling",
      "DEXA scan (dual-energy X-ray absorptiometry): assesses bone mineral density; indicated because chronic testosterone deficiency increases osteoporosis and fracture risk",
      "Metabolic screening: fasting glucose, HbA1c, lipid panel, and blood pressure to assess for metabolic syndrome and type 2 diabetes, which occur at higher rates in Klinefelter syndrome"
    ],
    management: [
      "Initiate testosterone replacement therapy (TRT) at puberty onset or at the time of diagnosis in adolescents and adults to promote virilization, maintain bone density, and improve quality of life",
      "Monitor testosterone levels, liver function, lipid profile, hematocrit, and prostate-specific antigen (PSA) at baseline and periodically during TRT as per endocrinology guidelines",
      "Screen for and manage metabolic complications: fasting glucose, HbA1c, and lipid panel annually; refer to endocrinology or internal medicine for diabetes or dyslipidemia management",
      "Refer for DEXA scan at baseline and periodically to monitor bone mineral density; calcium and vitamin D supplementation as indicated for osteoporosis prevention",
      "Refer to fertility specialist early if future biological fatherhood is desired; microsurgical testicular sperm extraction (micro-TESE) with ICSI may be an option before prolonged TRT further suppresses residual spermatogenesis",
      "Refer to mental health professional for psychosocial support related to body image, self-esteem, fertility concerns, and adjustment to a chronic genetic diagnosis",
      "Breast self-examination education and clinical breast examination annually due to the 20-50 times increased risk of male breast cancer compared to the general male population"
    ],
    nursingActions: [
      "Administer testosterone replacement therapy as prescribed (IM injection, transdermal patch, or topical gel) and document administration site, dose, and patient response",
      "Monitor for side effects of testosterone therapy: assess for acne, mood changes, erythrocytosis (elevated hematocrit above 54 percent increases thrombosis risk), liver enzyme elevation, and sleep apnea symptoms",
      "Assess and document gynecomastia: note the degree of breast tissue enlargement, tenderness, and any changes over time; report new breast lumps for further evaluation",
      "Monitor vital signs including blood pressure regularly as TRT can contribute to hypertension; report sustained elevation above patient baseline",
      "Provide patient education regarding the importance of medication adherence for TRT, the expected timeline for therapeutic effects (virilization changes occur gradually over months to years), and the need for regular follow-up laboratory monitoring",
      "Facilitate psychosocial support: assess for signs of depression, anxiety, body image distress, and social isolation; provide referral to counseling services as indicated",
      "Educate the patient about long-term health monitoring: annual metabolic screening, bone density assessment, breast self-examination, and signs of venous thromboembolism to report (calf swelling, warmth, redness, chest pain, shortness of breath)"
    ],
    assessmentFindings: [
      "Small, firm testes (typically less than 4 mL volume, compared to normal 15-25 mL) on palpation; this is the most consistent physical finding",
      "Gynecomastia: palpable breast tissue enlargement, often bilateral, which may be tender; present in 38-75 percent of cases",
      "Tall stature with eunuchoid body habitus: arm span exceeds height, long legs disproportionate to trunk length, due to delayed epiphyseal closure from testosterone deficiency",
      "Sparse facial and body hair with decreased muscle mass; reduced virilization compared to age-matched males",
      "Cognitive and behavioral assessment may reveal difficulty with language processing, reading comprehension, verbal expression, and attention; intelligence typically within normal range",
      "Psychosocial assessment may reveal low self-esteem, body image concerns, anxiety about infertility, or depressive symptoms"
    ],
    signs: {
      left: [
        "Tall stature with long legs relative to trunk",
        "Sparse facial and body hair for age",
        "Mild gynecomastia without tenderness",
        "Decreased energy and reduced exercise tolerance",
        "Learning difficulties or speech delay (childhood)",
        "Mild mood changes or decreased motivation"
      ],
      right: [
        "Significant gynecomastia with new breast lump (evaluate for male breast cancer)",
        "Symptoms of venous thromboembolism (unilateral leg swelling, warmth, pain; chest pain and dyspnea if PE)",
        "Severe depression or suicidal ideation related to diagnosis or body image",
        "Hematocrit above 54 percent during testosterone therapy (polycythemia increasing stroke and thrombosis risk)",
        "Signs of metabolic crisis: uncontrolled hyperglycemia, diabetic ketoacidosis",
        "Pathological fracture from undiagnosed osteoporosis (hip, vertebral, or wrist fracture with minimal trauma)"
      ]
    },
    medications: [
      {
        name: "Testosterone Cypionate (Depo-Testosterone)",
        type: "Androgen hormone replacement (intramuscular depot injection)",
        action: "Synthetic ester of testosterone that is slowly released from the intramuscular depot, providing sustained testosterone levels; binds to androgen receptors in target tissues to promote and maintain male secondary sexual characteristics including facial and body hair growth, voice deepening, muscle mass and strength, bone mineral density, libido, and erythropoiesis",
        sideEffects: "Acne and oily skin, erythrocytosis (elevated hematocrit and hemoglobin increasing thrombosis risk), mood changes (irritability, aggression), fluid retention, sleep apnea exacerbation, gynecomastia (from aromatization of testosterone to estradiol), injection site pain",
        contra: "Known or suspected prostate cancer or breast cancer in males; polycythemia (hematocrit above 54 percent); severe untreated sleep apnea; decompensated heart failure; pregnancy or potential for pregnancy in partner through skin contact with topical formulations",
        pearl: "Administered as deep intramuscular injection every 1-2 weeks (typical dose 100-200 mg every 2 weeks); rotate injection sites between gluteal and vastus lateralis muscles; monitor hematocrit every 3-6 months as erythrocytosis above 54 percent requires dose reduction or temporary discontinuation; does NOT restore fertility -- counsel patients accordingly"
      },
      {
        name: "Calcium Carbonate with Vitamin D (Caltrate + D)",
        type: "Mineral supplement for bone health",
        action: "Provides eleite calcium (the primary mineral component of bone hydroxyapatite) and vitamin D3 (cholecalciferol), which is essential for intestinal calcium absorption, calcium homeostasis, and bone mineralization; together they reduce the rate of bone resorption and support bone formation to prevent osteoporosis in patients with chronic hypogonadism",
        sideEffects: "Constipation, bloating, flatulence, nausea; excessive intake can cause hypercalcemia (fatigue, confusion, polyuria, kidney stones), milk-alkali syndrome with very high doses",
        contra: "Hypercalcemia; hypercalciuria; severe renal impairment (risk of calcium accumulation); known calcium-containing kidney stones; concurrent use with certain medications that interact with calcium (tetracyclines, fluoroquinolones, levothyroxine -- separate administration by 2-4 hours)",
        pearl: "Take calcium carbonate with food for best absorption (stomach acid enhances dissolution); total daily elemental calcium from all sources should not exceed 1000-1200 mg; divide doses (no more than 500-600 mg elemental calcium per dose) for optimal absorption; pair with vitamin D 800-1000 IU daily for osteoporosis prevention"
      },
      {
        name: "Sertraline (Zoloft)",
        type: "Selective serotonin reuptake inhibitor (SSRI) antidepressant",
        action: "Selectively inhibits the presynaptic reuptake of serotonin (5-HT) in the synaptic cleft, increasing serotonin availability at postsynaptic receptors; this enhanced serotonergic transmission over 4-6 weeks produces antidepressant and anxiolytic effects; used in Klinefelter syndrome patients to treat depression, anxiety, and social difficulties that frequently accompany the diagnosis",
        sideEffects: "Nausea, diarrhea, insomnia or somnolence, headache, dizziness, sexual dysfunction (decreased libido, anorgasmia -- particularly relevant in patients already experiencing hypogonadism-related sexual dysfunction), weight changes, serotonin syndrome if combined with other serotonergic agents",
        contra: "Concurrent use with MAOIs (risk of fatal serotonin syndrome -- wait at least 14 days between discontinuation of MAOI and initiation of sertraline); concurrent use with pimozide; known hypersensitivity to sertraline",
        pearl: "Therapeutic effects take 4-6 weeks to fully develop; monitor closely for increased suicidal ideation in the first weeks of treatment, especially in patients under 25 years of age; do not discontinue abruptly -- taper gradually over weeks to prevent discontinuation syndrome (dizziness, nausea, irritability, paresthesias)"
      }
    ],
    pearls: [
      "Klinefelter syndrome (47,XXY) is the MOST COMMON sex chromosome aneuploidy in males, affecting approximately 1 in 500 to 1 in 1000 live male births, yet many cases go undiagnosed until adulthood",
      "The hallmark hormonal profile is hypergonadotropic hypogonadism: LOW testosterone with ELEVATED FSH and LH -- the pituitary increases gonadotropin output in response to inadequate testosterone feedback from the dysgenetic testes",
      "Small firm testes (less than 4 mL volume) are the most consistent physical finding and are present in virtually all affected males -- normal adult male testicular volume is 15-25 mL",
      "Testosterone replacement therapy improves virilization, bone density, energy, mood, and quality of life, but it does NOT restore fertility because seminiferous tubule fibrosis is irreversible",
      "Males with Klinefelter syndrome have a 20-50 times increased risk of male breast cancer compared to the general male population -- teach breast self-examination and report any breast lumps promptly",
      "Monitor hematocrit every 3-6 months during testosterone therapy: erythrocytosis (hematocrit above 54 percent) significantly increases the risk of stroke, deep vein thrombosis, and pulmonary embolism",
      "The condition is underdiagnosed: only about 25 percent of affected males receive a diagnosis in their lifetime, and the average age at diagnosis is mid-30s; early recognition in childhood (speech delay, learning difficulties, tall stature) allows timely intervention"
    ],
    quiz: [
      {
        question: "A practical nurse is reviewing laboratory results for a patient recently diagnosed with Klinefelter syndrome. Which hormonal pattern is characteristic of this condition?",
        options: [
          "Elevated testosterone, low FSH, low LH",
          "Low testosterone, low FSH, low LH",
          "Low testosterone, elevated FSH, elevated LH",
          "Normal testosterone, normal FSH, elevated LH"
        ],
        correct: 2,
        rationale: "Klinefelter syndrome causes primary hypogonadism (hypergonadotropic hypogonadism). The damaged testes produce insufficient testosterone (low), so the pituitary gland increases production of FSH and LH (both elevated) in an attempt to stimulate the testes. FSH is particularly elevated due to seminiferous tubule failure."
      },
      {
        question: "A practical nurse is monitoring a patient receiving testosterone cypionate injections for Klinefelter syndrome. Which laboratory value requires the most vigilant monitoring due to the risk of a serious complication?",
        options: [
          "Serum albumin level",
          "Hematocrit level",
          "Serum calcium level",
          "Serum potassium level"
        ],
        correct: 1,
        rationale: "Testosterone therapy stimulates erythropoiesis, which can cause erythrocytosis (elevated hematocrit). A hematocrit above 54 percent significantly increases the risk of thrombotic events including stroke, deep vein thrombosis, and pulmonary embolism. Hematocrit should be monitored every 3-6 months, and dose adjustment is required if it exceeds 54 percent."
      },
      {
        question: "A patient with Klinefelter syndrome asks the practical nurse whether testosterone therapy will allow him to father biological children. What is the most accurate response?",
        options: [
          "Yes, testosterone therapy restores normal sperm production within 6 months",
          "Testosterone therapy does not restore fertility because the testicular damage is irreversible, but fertility specialists may offer other options such as sperm extraction procedures",
          "Fertility will return if testosterone levels reach the normal range",
          "Testosterone therapy is the only treatment needed for both virilization and fertility"
        ],
        correct: 1,
        rationale: "Testosterone replacement therapy improves virilization, bone density, energy, and quality of life, but it does NOT restore fertility. The seminiferous tubule fibrosis in Klinefelter syndrome is irreversible. For patients desiring biological children, referral to a fertility specialist for microsurgical testicular sperm extraction (micro-TESE) with intracytoplasmic sperm injection (ICSI) may be offered."
      }
    ]
  }
};

let injected = 0;
let failed = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) {
    injected++;
  } else {
    failed++;
  }
}
console.log(`\nDone: ${injected} injected, ${failed} skipped/failed`);
