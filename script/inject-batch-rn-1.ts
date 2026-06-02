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
  "abdominal-assessment-rn": {
    title: "Advanced Abdominal Assessment for Registered Nurses",
    cellular: {
      title: "Anatomy, Physiology, and Advanced Assessment of the Abdomen",
      content: "The abdominal assessment is one of the most complex and clinically significant physical examinations performed by the registered nurse. The abdomen houses organs from multiple body systems -- gastrointestinal, hepatobiliary, urinary, reproductive, vascular, and lymphatic -- and advanced assessment skills are essential for early detection of acute surgical emergencies, internal hemorrhage, and organ dysfunction. The registered nurse must integrate anatomical knowledge with systematic assessment techniques to generate accurate clinical findings and initiate appropriate interventions.\n\nThe peritoneal cavity is lined by the peritoneum, a serous membrane consisting of two layers: the parietal peritoneum (lining the abdominal wall, innervated by somatic nerves producing sharp, well-localized pain) and the visceral peritoneum (covering the abdominal organs, innervated by autonomic nerves producing dull, poorly localized pain). This distinction is clinically critical because the transition from vague visceral pain to sharp parietal pain indicates progression from organ inflammation to peritoneal irritation, signaling a potential surgical emergency. The peritoneal cavity normally contains approximately 50 mL of serous fluid that lubricates organ surfaces; significant accumulation constitutes ascites. The retroperitoneal space contains the kidneys, adrenal glands, pancreas (body and tail), aorta, inferior vena cava, and portions of the duodenum and colon. Retroperitoneal pathology produces back pain and flank pain rather than typical anterior abdominal tenderness, which can delay recognition.\n\nFor systematic assessment, the abdomen is divided into four quadrants using the umbilicus as the central reference point. The right upper quadrant (RUQ) contains the liver, gallbladder, hepatic flexure of the colon, right kidney and adrenal gland, and portions of the duodenum and pancreatic head. The left upper quadrant (LUQ) contains the spleen, stomach, splenic flexure of the colon, left kidney and adrenal gland, and the pancreatic tail. The right lower quadrant (RLQ) contains the appendix, cecum, ascending colon, right ovary and fallopian tube in females, and the right ureter. The left lower quadrant (LLQ) contains the sigmoid colon, descending colon, left ovary and fallopian tube, and the left ureter. The suprapubic region contains the urinary bladder and, in females, the uterus.\n\nThe abdominal assessment follows a unique sequence that differs from all other body system examinations: inspection, auscultation, percussion, and palpation. This sequence is mandatory because percussion and palpation can stimulate or inhibit peristalsis, altering bowel sounds and producing false auscultatory findings. Inspection evaluates the contour (flat, rounded, protuberant, scaphoid), symmetry, skin integrity (scars, striae, ecchymoses, spider angiomata, caput medusae), visible pulsations (aortic pulsation in thin patients is normal; visible pulsation in other patients may indicate abdominal aortic aneurysm), visible peristalsis (abnormal in adults, suggests bowel obstruction), and distension.\n\nAuscultation requires a warm stethoscope diaphragm placed gently on the abdomen. Normal bowel sounds occur every 5 to 15 seconds and are characterized as high-pitched clicks and gurgles produced by the movement of gas and fluid through the intestines during peristalsis. The registered nurse must auscultate all four quadrants, listening for a minimum of 5 minutes in each quadrant before documenting absent bowel sounds. Hyperactive bowel sounds (loud, frequent, high-pitched, rushing sounds called borborygmi) indicate increased peristaltic activity and occur in early mechanical bowel obstruction, gastroenteritis, and with laxative use. Hypoactive bowel sounds (infrequent, diminished sounds) occur postoperatively, with peritonitis, and with electrolyte imbalances such as hypokalemia. Absent bowel sounds indicate paralytic ileus or late-stage mechanical obstruction and require immediate physician notification. Vascular sounds must also be assessed: bruits over the aorta (midline, above umbilicus), renal arteries (bilateral flank), and iliac arteries (bilateral lower quadrants) indicate turbulent blood flow from stenosis or aneurysm.\n\nPercussion produces tympany over gas-filled structures (stomach, intestines) and dullness over solid organs (liver, spleen) or fluid collections. The liver span is assessed by percussing in the right midclavicular line from resonance (lung) to dullness (liver) to tympany (bowel); normal span is 6 to 12 cm. An enlarged liver span suggests hepatomegaly from heart failure, hepatitis, or malignancy. Shifting dullness is a percussion technique used to detect ascites: with the patient supine, fluid gravitates to the flanks (dull) while gas-filled bowel floats centrally (tympanic); when the patient turns to one side, the dullness shifts to the dependent side.\n\nPalpation begins with light palpation (1-2 cm depth) using the fingerpads in a systematic clockwise or quadrant-by-quadrant approach, assessing for superficial tenderness, muscle resistance, and masses. Deep palpation (4-6 cm depth) follows, using one or two hands to assess organ size, deep masses, and deep tenderness. The registered nurse must differentiate voluntary guarding (conscious muscle tensing due to anxiety, cold hands, or ticklishness, which can be overcome with relaxation techniques) from involuntary guarding (reflex muscle rigidity that persists regardless of relaxation efforts, indicating peritoneal irritation). A rigid, board-like abdomen with involuntary guarding is a hallmark of generalized peritonitis and constitutes a surgical emergency requiring immediate physician notification.\n\nSpecial assessment techniques extend the basic examination. Murphy sign is elicited by placing fingers under the right costal margin at the midclavicular line and asking the patient to inhale deeply; a positive Murphy sign occurs when the patient abruptly stops inspiration due to pain as the inflamed gallbladder descends and contacts the examining fingers, strongly suggesting acute cholecystitis. McBurney point tenderness is assessed at a point one-third of the distance from the right anterior superior iliac spine (ASIS) to the umbilicus; localized tenderness at this point is classic for acute appendicitis. Rovsing sign is positive when palpation of the LLQ produces referred pain in the RLQ, further supporting appendicitis. The psoas sign is elicited by having the patient extend the right hip against resistance (or by passive hyperextension of the right thigh); pain suggests a retrocecal appendix irritating the psoas muscle. The obturator sign is elicited by flexing the right hip and knee to 90 degrees and internally rotating the hip; pain suggests a pelvic appendix irritating the obturator internus muscle.\n\nRebound tenderness (Blumberg sign) is assessed by slowly depressing the abdomen and then rapidly releasing pressure; pain that worsens on release indicates peritoneal irritation. This test should be performed last and only once, as repeated testing causes unnecessary pain and does not improve diagnostic accuracy. Grey Turner sign (ecchymosis of the flanks) and Cullen sign (ecchymosis around the umbilicus) are late signs of retroperitoneal hemorrhage, most commonly associated with hemorrhagic pancreatitis, ruptured abdominal aortic aneurysm, or ruptured ectopic pregnancy. These signs typically appear 24 to 48 hours after the hemorrhagic event and indicate significant blood loss (at least 500 mL).\n\nThe registered nurse must also assess for referred pain patterns. Diaphragmatic irritation (from subphrenic abscess, splenic rupture, or ruptured ectopic pregnancy) produces referred pain to the shoulder via the phrenic nerve (C3-C5), known as Kehr sign. Ureteral colic produces pain radiating from the flank to the groin along the course of the ureter. Biliary colic produces pain radiating to the right scapular region. Understanding these referral patterns enables the registered nurse to correlate apparently unrelated symptoms with their intra-abdominal source."
    },
    riskFactors: [
      "Advanced age with altered pain perception and decreased abdominal muscle tone masking acute pathology",
      "History of abdominal surgery creating adhesions that alter anatomy and increase obstruction risk",
      "Chronic NSAID, anticoagulant, or corticosteroid use increasing risk of GI bleeding and perforation",
      "Alcohol use disorder predisposing to liver cirrhosis, pancreatitis, portal hypertension, and esophageal varices",
      "Immunosuppression from chemotherapy, transplant medications, or HIV/AIDS masking inflammatory signs",
      "Obesity complicating palpation accuracy and obscuring physical examination findings",
      "Chronic opioid use causing decreased bowel motility, constipation, and narcotic bowel syndrome"
    ],
    diagnostics: [
      "Abdominal CT with IV contrast: gold standard for evaluating acute abdominal pathology including appendicitis, diverticulitis, bowel obstruction, and vascular emergencies; verify renal function (eGFR above 30) and contrast allergy status before scan",
      "Focused Assessment with Sonography for Trauma (FAST exam): bedside ultrasound evaluating four windows (hepatorenal/Morrison pouch, splenorenal, suprapubic, subxiphoid/pericardial) for free fluid; performed by RN with advanced training in trauma settings",
      "Abdominal X-ray (KUB -- kidneys, ureters, bladder): identifies bowel obstruction (air-fluid levels, dilated loops), pneumoperitoneum (free air under diaphragm on upright film), and calcifications",
      "Complete blood count with differential: leukocytosis with left shift (bandemia) suggests acute infection; hemoglobin/hematocrit trending downward indicates ongoing hemorrhage",
      "Serum lipase: preferred over amylase for diagnosing pancreatitis; elevation greater than 3 times the upper limit of normal is diagnostic; lipase remains elevated longer than amylase",
      "Serum lactate: elevated lactate (above 2 mmol/L) indicates tissue hypoperfusion and is a critical marker for mesenteric ischemia, sepsis, and bowel infarction; serial trending guides resuscitation adequacy"
    ],
    management: [
      "Establish large-bore IV access (two 18-gauge or larger) immediately in patients with suspected acute abdomen; initiate crystalloid resuscitation with lactated Ringer or normal saline for hemodynamic instability",
      "Maintain strict NPO status for patients with suspected surgical abdomen, bowel obstruction, or pending diagnostic imaging to prevent aspiration and allow surgical planning",
      "Insert nasogastric tube to low intermittent suction for bowel decompression in obstruction; verify placement with pH testing (pH below 5.5) or X-ray confirmation per facility protocol before instilling anything",
      "Administer analgesics as prescribed; current evidence supports early analgesia in acute abdominal pain as it does not mask physical findings or delay surgical diagnosis",
      "Initiate broad-spectrum antibiotics as prescribed for suspected peritonitis, perforated viscus, or intra-abdominal abscess; obtain blood cultures before first antibiotic dose",
      "Position patient in semi-Fowler position (30-45 degrees) to reduce diaphragmatic pressure from abdominal distension and promote respiratory function",
      "Prepare for emergency surgical consultation if assessment reveals peritoneal signs (involuntary guarding, rigidity, rebound tenderness) or hemodynamic instability with suspected intra-abdominal hemorrhage"
    ],
    nursingActions: [
      "Perform systematic abdominal assessment using the mandatory sequence of inspect, auscultate, percuss, palpate; document findings in all four quadrants with specific descriptors rather than vague terms",
      "Auscultate each quadrant for a full 5 minutes before documenting bowel sounds as absent; premature documentation of absent bowel sounds can lead to unnecessary interventions",
      "Measure abdominal girth at the level of the umbilicus using a consistent technique and marking the measurement site on the skin with a marker to ensure reproducibility across shifts",
      "Monitor hemodynamic status every 15 minutes in acute abdomen: heart rate, blood pressure, MAP (target above 65 mmHg), urine output (target above 0.5 mL/kg/hr); escalate if trending toward shock",
      "Assess and document pain using standardized framework (PQRST or OPQRST): Onset, Provoking/Palliating factors, Quality, Region/Radiation, Severity, Timing; reassess after interventions",
      "Delegate vital sign monitoring and intake/output recording to LPN/UAP with clear parameters for immediate RN notification; retain assessment, IV medication administration, and NG tube management",
      "Communicate critical findings using SBAR format to physician: rigid abdomen, absent bowel sounds, hemodynamic instability, Grey Turner/Cullen signs, or new-onset peritoneal signs"
    ],
    assessmentFindings: [
      "Involuntary guarding and board-like rigidity: reflex abdominal wall muscle contraction that persists despite relaxation techniques; indicates peritoneal irritation and potential surgical emergency",
      "Rebound tenderness (Blumberg sign): pain that intensifies upon rapid release of abdominal pressure; indicates peritoneal inflammation from appendicitis, perforated viscus, or other peritoneal irritants",
      "Positive Murphy sign: inspiratory arrest during RUQ palpation as the inflamed gallbladder descends onto the examiner's fingers; sensitivity of 65% and specificity of 87% for acute cholecystitis",
      "McBurney point tenderness with positive Rovsing, psoas, and obturator signs: constellation of findings strongly suggestive of acute appendicitis requiring urgent surgical evaluation",
      "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis): late signs appearing 24-48 hours after retroperitoneal hemorrhage; indicate blood loss of at least 500 mL",
      "Shifting dullness on percussion: fluid wave and dull percussion note that shifts with position change; indicates ascites from liver cirrhosis, heart failure, or peritoneal carcinomatosis",
      "Visible peristalsis with high-pitched metallic bowel sounds: visible intestinal contractions through the abdominal wall with characteristic rushing sounds; pathognomonic for mechanical small bowel obstruction"
    ],
    signs: {
      left: [
        "Abdominal distension with tympany on percussion",
        "Voluntary guarding with palpation",
        "Hyperactive or hypoactive bowel sounds",
        "Localized tenderness in one quadrant without radiation",
        "Mild nausea without hemodynamic changes",
        "Low-grade fever (below 38.3 degrees Celsius)"
      ],
      right: [
        "Rigid board-like abdomen with involuntary guarding (peritonitis)",
        "Absent bowel sounds after 5 minutes of auscultation per quadrant",
        "Rebound tenderness with hemodynamic instability (tachycardia, hypotension)",
        "Grey Turner or Cullen sign indicating retroperitoneal hemorrhage",
        "Hematemesis, hematochezia, or melena with dropping hemoglobin",
        "Sudden severe abdominal pain with rigidity and signs of shock (cool, clammy, altered LOC)"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system and peripheral tissues, inhibiting ascending pain pathways, altering pain perception at the cortical level, and modulating the emotional response to pain; provides effective analgesia for severe acute abdominal pain",
        sideEffects: "Respiratory depression (monitor respiratory rate below 12), hypotension, nausea and vomiting, constipation, urinary retention, pruritus, sedation, miosis (pinpoint pupils)",
        contra: "Severe respiratory depression or acute bronchospasm; paralytic ileus (may worsen bowel dysmotility); concurrent use with MAO inhibitors within 14 days; known hypersensitivity; head injury with increased ICP (masks neurological assessment)",
        pearl: "Current evidence-based practice supports early opioid analgesia for acute abdominal pain -- withholding pain relief does NOT improve diagnostic accuracy and causes unnecessary suffering; always assess respiratory rate and sedation level before each dose; have naloxone (0.4 mg IV) at bedside"
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-spectrum penicillin with beta-lactamase inhibitor (broad-spectrum antibiotic)",
        action: "Piperacillin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), disrupting peptidoglycan cross-linking; tazobactam irreversibly inhibits beta-lactamase enzymes produced by resistant bacteria, restoring piperacillin activity against beta-lactamase-producing organisms; provides coverage against gram-positive, gram-negative, and anaerobic organisms common in intra-abdominal infections",
        sideEffects: "Diarrhea (including Clostridioides difficile-associated diarrhea), rash, nausea, thrombocytopenia, elevated hepatic transaminases, injection site reactions, seizures at very high doses or in renal impairment",
        contra: "Known hypersensitivity to penicillins, cephalosporins (cross-reactivity approximately 1-2%), or beta-lactamase inhibitors; history of cholestatic jaundice with piperacillin-tazobactam",
        pearl: "First-line empiric therapy for community-acquired intra-abdominal infections; administer as extended infusion (over 4 hours) for critically ill patients to optimize time above MIC and improve bacterial killing; requires renal dose adjustment when CrCl is below 40 mL/min"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (selective 5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors at vagal nerve terminals in the GI tract and in the chemoreceptor trigger zone (CTZ) of the area postrema in the medulla oblongata, preventing serotonin-mediated activation of the vomiting reflex; highly effective for nausea and vomiting associated with acute abdominal conditions",
        sideEffects: "Headache (most common), constipation, dizziness, fatigue, dose-dependent QT prolongation, serotonin syndrome when combined with other serotonergic agents",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine (profound hypotension risk); severe hepatic impairment (maximum 8 mg/day); caution with other QT-prolonging medications",
        pearl: "Maximum single IV dose is 16 mg due to dose-dependent QT prolongation risk; obtain baseline ECG in patients with cardiac history or electrolyte abnormalities; does not improve gastric motility (unlike metoclopramide) so will not address gastroparesis or ileus"
      }
    ],
    pearls: [
      "The mandatory abdominal assessment sequence is Inspect-Auscultate-Percuss-Palpate; performing palpation before auscultation alters peristalsis and produces false bowel sound findings -- this is a frequent examination error",
      "A rigid, board-like abdomen with involuntary guarding that cannot be overcome with relaxation techniques indicates peritoneal irritation and is a surgical emergency requiring immediate physician notification and preparation for potential operative intervention",
      "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) are late signs of retroperitoneal hemorrhage appearing 24-48 hours after the event; their presence indicates blood loss of at least 500 mL and warrants immediate type and crossmatch",
      "Murphy sign has a sensitivity of approximately 65% and specificity of 87% for acute cholecystitis; a positive sonographic Murphy sign (pain elicited when the ultrasound probe compresses the gallbladder) has even higher diagnostic accuracy",
      "Referred pain patterns are critical for abdominal assessment: Kehr sign (left shoulder pain from splenic rupture or diaphragmatic irritation), right scapular pain from biliary colic, and flank-to-groin pain from ureteral colic",
      "Current evidence supports administering analgesia early in acute abdominal pain; the outdated practice of withholding opioids until a diagnosis is established has been disproven by multiple studies showing no negative impact on diagnostic accuracy",
      "Delegate vital sign measurement, I&O documentation, and positioning to LPN/UAP but ALWAYS retain the abdominal assessment, interpretation of findings, IV medication administration, and communication of critical findings to the interprofessional team"
    ],
    quiz: [
      {
        question: "A registered nurse is assessing a patient with acute abdominal pain. The patient demonstrates pain that worsens when the nurse rapidly releases deep abdominal pressure. Which finding does this represent?",
        options: [
          "Murphy sign indicating acute cholecystitis",
          "Blumberg sign (rebound tenderness) indicating peritoneal irritation",
          "Rovsing sign indicating acute appendicitis",
          "McBurney point tenderness indicating appendiceal inflammation"
        ],
        correct: 1,
        rationale: "Rebound tenderness (Blumberg sign) is pain that intensifies when deep abdominal pressure is rapidly released, indicating peritoneal irritation. Murphy sign involves inspiratory arrest during RUQ palpation. Rovsing sign is referred RLQ pain with LLQ palpation. McBurney point is a specific anatomical location of tenderness."
      },
      {
        question: "A nurse notes bluish discoloration around the flanks of a patient admitted 36 hours ago with severe epigastric pain and elevated lipase. Which condition does this finding most likely indicate?",
        options: [
          "Liver cirrhosis with portal hypertension",
          "Hemorrhagic pancreatitis with retroperitoneal bleeding",
          "Small bowel obstruction with strangulation",
          "Acute cholecystitis with gallbladder perforation"
        ],
        correct: 1,
        rationale: "Grey Turner sign (flank ecchymosis) appearing 24-48 hours after severe epigastric pain with elevated lipase is a classic late sign of hemorrhagic pancreatitis with retroperitoneal bleeding. This indicates significant blood loss (at least 500 mL) and requires immediate intervention including type and crossmatch."
      },
      {
        question: "Which task can the registered nurse appropriately delegate to unlicensed assistive personnel (UAP) when caring for a patient with an acute abdomen?",
        options: [
          "Performing the abdominal assessment and documenting findings",
          "Administering IV morphine for pain management",
          "Recording intake and output measurements and reporting values outside set parameters",
          "Interpreting the trend in serial abdominal girth measurements"
        ],
        correct: 2,
        rationale: "Recording intake and output measurements is a task that can be delegated to UAP with clear parameters for reporting abnormal values to the RN. Abdominal assessment, IV medication administration, and interpretation of clinical findings are within the RN scope and cannot be delegated."
      }
    ]
  },

  "acute-chest-syndrome-rn": {
    title: "Acute Chest Syndrome in Sickle Cell Disease for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Acute Chest Syndrome in Sickle Cell Disease",
      content: "Acute chest syndrome (ACS) is the leading cause of death and the second most common reason for hospitalization in patients with sickle cell disease (SCD). It is defined as a new pulmonary infiltrate on chest radiograph involving at least one complete lung segment, accompanied by one or more of the following: fever (temperature above 38.5 degrees Celsius), respiratory symptoms (cough, dyspnea, tachypnea, chest pain), or hypoxemia. Understanding the complex pathophysiology of ACS requires a thorough knowledge of sickle cell hemoglobin polymerization, vaso-occlusion, and the interplay between infection, fat embolism, and pulmonary vascular dysfunction.\n\nSickle cell disease results from a point mutation in the beta-globin gene on chromosome 11, where valine replaces glutamic acid at position 6, producing hemoglobin S (HbS). Under conditions of deoxygenation, acidosis, dehydration, hypothermia, or infection, HbS molecules polymerize into rigid rod-like fibers that distort the normally flexible biconcave erythrocyte into a rigid sickle (crescent) shape. These sickled erythrocytes have several pathological properties: they are rigid and unable to deform through narrow capillaries, they are sticky and adhere to the vascular endothelium via adhesion molecules (VCAM-1, P-selectin, and thrombospondin), they activate the coagulation cascade promoting microthrombus formation, and they have a shortened lifespan (10-20 days versus 120 days for normal erythrocytes), causing chronic hemolytic anemia.\n\nThe pathogenesis of ACS involves multiple overlapping mechanisms. Pulmonary infection is the most common trigger in children, with Chlamydia pneumoniae, Mycoplasma pneumoniae, and respiratory viruses (respiratory syncytial virus, influenza, parvovirus B19) being the most frequent pathogens. In adults, fat embolism from bone marrow necrosis during vaso-occlusive crisis (VOC) is the most common cause. During a VOC, sickling within the bone marrow microvasculature causes infarction of bone marrow tissue, releasing fat droplets and necrotic cellular debris into the venous circulation. These fat emboli travel to the pulmonary vasculature, where phospholipase A2 converts the fat into free fatty acids that cause direct injury to the pulmonary endothelium, triggering an intense inflammatory response.\n\nOnce ACS is initiated, a vicious cycle of pulmonary pathology develops. The initial insult (infection, fat embolism, or pulmonary infarction) causes regional hypoxia within the lung parenchyma. This regional hypoxia promotes further HbS polymerization and sickling within the pulmonary microvasculature, extending the area of vaso-occlusion. The sickling causes endothelial damage, activating neutrophils and platelets that release inflammatory mediators including interleukin-8, tumor necrosis factor-alpha, and vascular endothelial growth factor. These mediators increase vascular permeability, causing pulmonary edema and further impairing gas exchange. The resulting ventilation-perfusion (V/Q) mismatch and intrapulmonary shunting worsen hypoxemia, which in turn promotes more sickling. This positive feedback loop can rapidly progress from a localized process to diffuse bilateral disease resembling acute respiratory distress syndrome (ARDS), with mortality rates approaching 9% in adults.\n\nPulmonary hypertension develops in approximately 30% of adults with SCD due to chronic hemolysis-mediated nitric oxide depletion (free hemoglobin scavenges nitric oxide), recurrent ACS episodes causing pulmonary vascular remodeling, and chronic thromboembolism. Tricuspid regurgitant jet velocity above 2.5 m/s on echocardiography screens for pulmonary hypertension and is associated with increased mortality. Chronic lung disease from recurrent ACS episodes leads to progressive restrictive lung disease and pulmonary fibrosis.\n\nSecretory phospholipase A2 (sPLA2) is an enzyme released during ACS that serves as both a pathogenic mediator and a biomarker. Elevated sPLA2 levels precede the clinical development of ACS by 24 to 48 hours during vaso-occlusive crisis, making it a potential predictive marker. sPLA2 generates free fatty acids and lysophospholipids from pulmonary surfactant, directly damaging alveolar epithelial cells and reducing surfactant function, which promotes alveolar collapse and atelectasis.\n\nThe registered nurse must understand that ACS frequently develops during hospitalization for vaso-occlusive crisis. Approximately 50% of ACS episodes develop 1 to 3 days after admission for VOC, often heralded by worsening pain, rising fever, declining oxygen saturation, and increasing opioid requirements. This progression pattern mandates vigilant respiratory monitoring in all patients admitted with sickle cell pain crisis, with particular attention to incentive spirometry compliance, which has been shown to reduce ACS incidence by preventing atelectasis from chest wall splinting due to pain."
    },
    riskFactors: [
      "Sickle cell genotype HbSS (homozygous) carries highest risk; HbSC and HbS-beta-thalassemia have lower but significant risk",
      "History of previous acute chest syndrome episodes (recurrence rate 40-80% in children, 50% in adults)",
      "Active vaso-occlusive crisis (VOC), especially involving the chest, ribs, or sternum; ACS develops in 10-20% of hospitalizations for VOC",
      "Recent surgical procedure requiring general anesthesia (hypoventilation, atelectasis, and splinting increase risk 10-fold)",
      "Concurrent pulmonary infection (Chlamydia, Mycoplasma, RSV, influenza) triggering regional hypoxia and sickling cascade",
      "Cold exposure, dehydration, or high altitude causing deoxygenation and promoting HbS polymerization",
      "Higher baseline hemoglobin level paradoxically increases ACS risk due to greater blood viscosity promoting vaso-occlusion"
    ],
    diagnostics: [
      "Chest radiograph (posteroanterior and lateral): new pulmonary infiltrate involving at least one complete lung segment is required for diagnosis; lower lobes most commonly affected; multilobar involvement indicates severe disease",
      "Arterial blood gas (ABG): PaO2 below 60 mmHg or SpO2 below 90% on room air indicates severe hypoxemia requiring aggressive intervention; A-a gradient elevation quantifies gas exchange impairment",
      "Complete blood count with reticulocyte count: hemoglobin drop of 2 g/dL or more from baseline indicates accelerated hemolysis or sequestration; reticulocyte count reflects bone marrow response",
      "Secretory phospholipase A2 (sPLA2): elevated levels precede ACS by 24-48 hours; rising trend during VOC admission warrants prophylactic transfusion consideration",
      "Blood and sputum cultures: obtain before antibiotic initiation; identifies bacterial pathogens (Chlamydia, Mycoplasma, Streptococcus pneumoniae, Haemophilus influenzae)",
      "CT pulmonary angiography: indicated when pulmonary embolism is suspected; SCD patients have increased thrombotic risk; differentiates PE from ACS when clinical picture is unclear"
    ],
    management: [
      "Initiate supplemental oxygen to maintain SpO2 above 95% (or above baseline for the individual patient); use high-flow nasal cannula, Venturi mask, or non-rebrebreather as needed based on severity",
      "Administer empiric antibiotics covering typical and atypical organisms: cephalosporin (ceftriaxone 2g IV daily) PLUS macrolide (azithromycin 500mg IV/PO daily) to cover Chlamydia and Mycoplasma",
      "Provide aggressive pain management with IV opioids (morphine or hydromorphone via PCA) titrated to adequate analgesia while monitoring for respiratory depression; chest wall splinting from undertreated pain promotes atelectasis and worsens ACS",
      "Initiate simple red blood cell transfusion to target hemoglobin of 10 g/dL in mild-moderate ACS; exchange transfusion (erythrocytapheresis) for severe ACS with rapidly progressive infiltrates, PaO2 below 60 mmHg, or multilobar disease to reduce HbS percentage below 30%",
      "Implement aggressive incentive spirometry (10 breaths every 2 hours while awake) to prevent and reverse atelectasis; this is the single most important nursing intervention to prevent ACS progression",
      "Administer IV fluids at maintenance rate (avoid aggressive hydration which causes pulmonary edema and fluid overload in patients with baseline anemia); target euvolemia with isotonic crystalloid",
      "Consult hematology for exchange transfusion and ICU for mechanical ventilation if PaO2 remains below 60 mmHg despite high-flow oxygen or if patient shows signs of respiratory failure"
    ],
    nursingActions: [
      "Monitor SpO2 continuously and respiratory status (rate, depth, work of breathing, use of accessory muscles) every 2 hours; report any decline in SpO2 below 95% or increase in oxygen requirements immediately",
      "Enforce incentive spirometry protocol: 10 maximal inspiratory breaths every 2 hours while awake; document volumes achieved and compare to baseline; this intervention reduces ACS incidence by up to 50% during VOC hospitalization",
      "Assess pain systematically using a validated scale every 1-2 hours; inadequate pain control leads to chest wall splinting, shallow breathing, atelectasis, and ACS progression; advocate for adequate analgesia",
      "Monitor for transfusion complications during simple or exchange transfusion: acute hemolytic reaction (fever, flank pain, dark urine), delayed hemolytic transfusion reaction (7-14 days post-transfusion with new hemolysis), and transfusion-related acute lung injury (TRALI)",
      "Maintain accurate intake and output with fluid balance assessment every 8 hours; avoid fluid overload (lungs are already compromised) while ensuring adequate hydration to prevent further sickling",
      "Assess for clinical deterioration indicating progression to ARDS: bilateral infiltrates, worsening hypoxemia despite increasing oxygen, increasing respiratory rate, and hemodynamic instability; prepare for possible ICU transfer",
      "Delegate positioning (elevate head of bed 30-45 degrees), ambulation assistance, and vital sign measurement to UAP; retain respiratory assessment, SpO2 interpretation, medication administration, and transfusion monitoring"
    ],
    assessmentFindings: [
      "New-onset fever (above 38.5 degrees C), cough (productive or dry), pleuritic chest pain, and dyspnea developing 1-3 days after admission for vaso-occlusive crisis",
      "Declining oxygen saturation (SpO2 below 95% or dropping 4% or more from baseline) with increasing supplemental oxygen requirements",
      "Tachypnea (respiratory rate above 20), use of accessory muscles, nasal flaring, and intercostal retractions indicating increased work of breathing",
      "Auscultation revealing decreased breath sounds, crackles, bronchial breath sounds, or egophony over the affected lung segment (most commonly lower lobes)",
      "Hemoglobin drop of 2 g/dL or more from baseline indicating acute hemolysis, splenic sequestration, or aplastic crisis",
      "Signs of fat embolism syndrome: petechial rash (chest, axillae, conjunctivae), confusion or altered mental status, and respiratory distress developing during VOC",
      "Progressive bilateral infiltrates on serial chest radiographs with worsening hypoxemia suggesting evolution toward ARDS (most severe and life-threatening presentation)"
    ],
    signs: {
      left: [
        "Low-grade fever with mild cough and normal oxygen saturation",
        "Mild chest pain controlled with oral analgesics",
        "Unilateral infiltrate on chest radiograph with stable hemoglobin",
        "SpO2 94-95% on room air with no accessory muscle use",
        "Adequate incentive spirometry volumes at or near baseline",
        "Mild tachycardia (heart rate 90-100) without hypotension"
      ],
      right: [
        "SpO2 below 90% or PaO2 below 60 mmHg despite supplemental oxygen",
        "Bilateral or multilobar infiltrates with rapid radiographic progression",
        "Hemoglobin drop greater than 2 g/dL with evidence of accelerated hemolysis",
        "Altered mental status, confusion, or lethargy (fat embolism or hypoxia)",
        "Signs of respiratory failure: severe tachypnea, accessory muscle use, paradoxical breathing",
        "Hemodynamic instability (hypotension, tachycardia above 120) suggesting sepsis or massive sickling"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea/Siklos)",
        type: "Antineoplastic/disease-modifying agent for sickle cell disease",
        action: "Increases fetal hemoglobin (HbF) production by reactivating gamma-globin gene expression; HbF inhibits HbS polymerization by physically interrupting the sickle fiber formation, reducing the proportion of sickling erythrocytes; also reduces neutrophil and platelet counts (decreasing adhesion and vaso-occlusion), increases red blood cell hydration and mean corpuscular volume, and generates nitric oxide as a vasodilator",
        sideEffects: "Myelosuppression (neutropenia, thrombocytopenia, reticulocytopenia -- requires regular CBC monitoring every 4-8 weeks), nausea, skin hyperpigmentation, nail changes, teratogenicity (pregnancy category X), leg ulcers, megaloblastic changes",
        contra: "Pregnancy or planned pregnancy (teratogenic); severe myelosuppression (ANC below 2000 or platelets below 80,000); severe renal impairment requires dose reduction; breastfeeding",
        pearl: "Takes 3-6 months to achieve therapeutic HbF levels (target above 15-20%); proven to reduce ACS episodes by 50%, reduce VOC frequency, reduce transfusion requirements, and decrease mortality; hold dose if ANC drops below 2000 or platelets below 80,000 and resume at lower dose when counts recover"
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-generation cephalosporin antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs) and disrupting peptidoglycan cross-linking, causing cell lysis and death; broad-spectrum activity against gram-positive organisms (Streptococcus pneumoniae) and gram-negative organisms (Haemophilus influenzae, Moraxella catarrhalis) most commonly implicated in ACS; long half-life allows once-daily dosing",
        sideEffects: "Diarrhea, rash, injection site pain, eosinophilia, elevated hepatic transaminases, biliary sludging and pseudolithiasis (especially in children and with prolonged use), Clostridioides difficile-associated diarrhea, drug interactions with calcium-containing solutions (do not co-infuse)",
        contra: "Known hypersensitivity to cephalosporins or severe penicillin allergy (1-2% cross-reactivity); neonates with hyperbilirubinemia (displaces bilirubin from albumin); must not be co-administered with IV calcium-containing solutions in neonates (fatal precipitates)",
        pearl: "First-line empiric antibiotic for ACS combined with a macrolide for atypical coverage; in SCD patients with functional asplenia, pneumococcal sepsis risk is 400-fold higher than the general population, making broad-spectrum coverage critical; do not mix or co-infuse with calcium-containing IV solutions"
      },
      {
        name: "Azithromycin (Zithromax)",
        type: "Macrolide antibiotic",
        action: "Binds to the 50S ribosomal subunit of susceptible bacteria, inhibiting translocation of peptides during protein synthesis; bacteriostatic at standard doses; provides essential coverage for atypical organisms (Chlamydia pneumoniae, Mycoplasma pneumoniae) that are leading causes of ACS, especially in older children and adults; also has anti-inflammatory properties that may reduce pulmonary inflammation",
        sideEffects: "GI disturbance (nausea, diarrhea, abdominal pain -- most common), QT prolongation (risk increases with electrolyte abnormalities), hepatotoxicity (rare cholestatic hepatitis), hearing loss (reversible, with high doses), Clostridioides difficile infection",
        contra: "Known hypersensitivity to macrolides; history of cholestatic jaundice with prior azithromycin use; concurrent use with QT-prolonging medications (increased risk of torsades de pointes); severe hepatic impairment",
        pearl: "Combined with ceftriaxone as the standard empiric regimen for ACS (covers typical and atypical bacteria); anti-inflammatory properties may provide additional benefit beyond antimicrobial activity; obtain ECG baseline if patient has cardiac history or is on other QT-prolonging agents"
      }
    ],
    pearls: [
      "ACS develops in 10-20% of hospitalizations for vaso-occlusive crisis, typically 1-3 days after admission; the most important preventive nursing intervention is aggressive incentive spirometry (10 breaths every 2 hours while awake) to prevent atelectasis from chest wall splinting",
      "The triad of new pulmonary infiltrate on CXR plus fever and/or respiratory symptoms and/or hypoxemia defines ACS; do not wait for all three -- report any component promptly as early intervention improves outcomes significantly",
      "Exchange transfusion (erythrocytapheresis) is indicated for severe ACS: PaO2 below 60 mmHg, multilobar disease, rapid deterioration, or failure to improve with simple transfusion; the goal is to reduce HbS percentage below 30% while keeping hemoglobin at 10 g/dL",
      "Simple transfusion should NOT raise hemoglobin above 10 g/dL in SCD patients because higher hemoglobin levels paradoxically increase blood viscosity and worsen vaso-occlusion; this is a critical difference from transfusion targets in other anemias",
      "Undertreated pain is a direct cause of ACS progression: chest wall splinting from pain leads to shallow breathing, atelectasis, regional hypoxia, and further sickling; the nurse must advocate for adequate analgesia while monitoring for respiratory depression",
      "Fat embolism from bone marrow necrosis is the most common cause of ACS in adults; the classic triad of petechial rash, respiratory distress, and neurological changes may not be fully present; suspect fat embolism when ACS develops during VOC with rapidly progressive bilateral infiltrates",
      "Delegate positioning, ambulation assistance, vital sign measurement, and documenting incentive spirometry usage to UAP; retain assessment of respiratory status, SpO2 interpretation, blood transfusion monitoring, pain assessment, and communication of clinical deterioration to the medical team"
    ],
    quiz: [
      {
        question: "A patient with sickle cell disease admitted for vaso-occlusive crisis develops a new cough, fever of 38.8 degrees C, and SpO2 of 91% on day 2 of hospitalization. Chest X-ray shows a new left lower lobe infiltrate. Which nursing intervention is MOST critical?",
        options: [
          "Increase IV fluids to 200 mL/hour to improve hydration",
          "Initiate incentive spirometry 10 breaths every 2 hours and apply supplemental oxygen",
          "Withhold opioid analgesics to prevent respiratory depression",
          "Administer aspirin for its anti-inflammatory effects on pulmonary tissue"
        ],
        correct: 1,
        rationale: "This presentation meets the criteria for ACS (new infiltrate + fever + hypoxemia). Incentive spirometry prevents further atelectasis and supplemental oxygen corrects hypoxemia. Aggressive IV fluids risk pulmonary edema. Opioids should be continued for pain to prevent splinting. Aspirin is contraindicated in sickle cell disease."
      },
      {
        question: "During a simple blood transfusion for acute chest syndrome, the target hemoglobin for a sickle cell disease patient should NOT exceed which value?",
        options: [
          "8 g/dL",
          "10 g/dL",
          "12 g/dL",
          "14 g/dL"
        ],
        correct: 1,
        rationale: "In SCD, hemoglobin should not exceed 10 g/dL because higher levels paradoxically increase blood viscosity, promoting further vaso-occlusion and potentially worsening the acute chest syndrome. This differs from transfusion targets in other types of anemia."
      },
      {
        question: "A registered nurse is caring for a sickle cell disease patient admitted with vaso-occlusive crisis. Which assessment finding should trigger immediate concern for developing acute chest syndrome?",
        options: [
          "Steady pain scores with stable analgesic requirements",
          "Declining SpO2 with new-onset cough and increasing oxygen requirements",
          "Hemoglobin stable at baseline with normal reticulocyte count",
          "Temperature of 37.2 degrees C with clear bilateral breath sounds"
        ],
        correct: 1,
        rationale: "Declining SpO2 with new respiratory symptoms during VOC hospitalization is the hallmark early presentation of developing ACS. Stable pain, stable hemoglobin, and low-grade temperature without respiratory symptoms do not suggest ACS progression."
      }
    ]
  },

  "acute-compartment-syndrome-rn": {
    title: "Acute Compartment Syndrome for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Acute Compartment Syndrome",
      content: "Acute compartment syndrome (ACS) is a limb-threatening and potentially life-threatening surgical emergency that occurs when pressure within a closed osseofascial compartment rises to a level that compromises the perfusion and viability of the tissues within that compartment. The pathophysiology involves a cascade of events that, if not interrupted by timely fasciotomy, leads to irreversible muscle necrosis (within 6-8 hours), nerve damage, rhabdomyolysis, renal failure, and potential limb loss or death. The registered nurse plays a pivotal role in early detection through serial neurovascular assessments, as compartment syndrome can progress from reversible ischemia to irreversible necrosis within hours.\n\nThe osseofascial compartment is an anatomical space bounded by bone and dense, inelastic fascia. The fascia's inability to expand is the fundamental problem in compartment syndrome -- it converts any increase in compartment volume or any decrease in compartment size into increased intracompartmental pressure (ICP). The lower leg has four compartments (anterior, lateral, superficial posterior, and deep posterior), the forearm has three compartments (volar/flexor, dorsal/extensor, and mobile wad), and the thigh has three compartments (anterior, posterior, and medial). The anterior compartment of the lower leg is the most commonly affected because it is the most tightly enclosed by fascial boundaries.\n\nNormal intracompartmental pressure ranges from 0 to 8 mmHg. When ICP rises above 30 mmHg (or within 30 mmHg of the diastolic blood pressure, known as the delta pressure), the microcirculation within the compartment becomes compromised. It is critical to understand that compartment syndrome occurs at the capillary level, not at the level of major arteries. Arterial inflow continues even when compartment pressures are elevated because systolic arterial pressure (typically 120 mmHg) far exceeds the ICP. This is why distal pulses may remain palpable even in established compartment syndrome -- the absence of a distal pulse is a very late finding indicating complete vascular compromise. The pathology occurs at the arteriolar and capillary level: as ICP approaches the arteriolar pressure (approximately 30-40 mmHg), the arterioles collapse, eliminating perfusion to the capillary beds. Without capillary flow, oxygen delivery ceases, and the tissues within the compartment become ischemic.\n\nThe ischemia-reperfusion cascade proceeds through several stages. As capillary perfusion drops, endothelial cells become hypoxic and release inflammatory mediators. The endothelial cell junctions loosen, increasing capillary permeability and allowing plasma proteins and fluid to leak into the interstitial space, further increasing compartment volume and pressure (a positive feedback loop). Simultaneously, the ischemic muscle cells begin anaerobic metabolism, producing lactic acid and lowering local pH. The cellular sodium-potassium ATPase pumps fail as ATP is depleted, causing sodium and water to enter cells (cytotoxic edema), further swelling the compartment contents. Intracellular calcium rises as calcium ATPase pumps fail, activating calcium-dependent proteases and phospholipases that degrade cellular membranes. Myocyte death releases myoglobin, potassium, phosphate, creatine kinase (CK), and lactate dehydrogenase (LDH) into the circulation.\n\nRhabdomyolysis is the systemic consequence of massive myocyte necrosis. The released myoglobin is filtered by the kidneys but precipitates in the renal tubules, especially in acidic urine, causing acute tubular necrosis and acute kidney injury (AKI). Myoglobin also generates reactive oxygen species that cause direct tubular cell damage. The released potassium can cause life-threatening hyperkalemia with cardiac dysrhythmias (peaked T waves, widened QRS, sine wave pattern progressing to ventricular fibrillation). The released phosphate binds calcium, causing hypocalcemia that can produce tetany and cardiac instability.\n\nNerve tissue is more sensitive to ischemia than muscle, with irreversible nerve damage beginning within 30 minutes of complete ischemia. This is why paresthesia (numbness, tingling) and pain with passive stretch are among the earliest clinical findings. Motor nerve function is more resistant than sensory function, so weakness and paralysis are later findings. The classic teaching of the 6 Ps (Pain, Pressure, Paresthesia, Paralysis, Pallor, Pulselessness) must be understood with important caveats: pain out of proportion to the injury and pain with passive stretch of the muscles in the affected compartment are the earliest and most reliable clinical signs; pallor and pulselessness are late, ominous findings indicating that ischemia has progressed beyond the microcirculation to affect major vessels.\n\nThe most common causes of acute compartment syndrome include tibial fractures (the single most common cause, responsible for approximately 36% of cases), forearm fractures, crush injuries, tight circumferential casts or dressings, prolonged limb compression during surgery or unconsciousness (found-down patients), reperfusion after vascular repair or restoration of flow to an ischemic limb, burns (circumferential eschar acts like inelastic fascia), and high-pressure fluid injection injuries. In the absence of fracture, any situation causing increased compartment contents (hemorrhage, edema, fluid resuscitation) or decreased compartment size (tight cast, circumferential burn eschar, external compression) can trigger compartment syndrome.\n\nThe definitive treatment is emergent fasciotomy -- surgical incision of the fascia to decompress the compartment. Fasciotomy is a time-critical intervention: muscle undergoes irreversible necrosis after 6-8 hours of ischemia, and the degree of functional recovery is directly related to the time from onset to decompression. Fasciotomy within 6 hours generally produces good functional outcomes; fasciotomy after 12 hours is associated with high rates of amputation, permanent nerve damage, and death from rhabdomyolysis complications. The fasciotomy wound is left open (to allow continued decompression) and covered with a vacuum-assisted closure (VAC) device or wet dressings, with delayed primary closure or skin grafting performed 3-7 days later once swelling resolves."
    },
    riskFactors: [
      "Tibial shaft fracture (most common single cause, especially high-energy fractures in young adults; accounts for 36% of all ACS cases)",
      "Forearm fracture (supracondylar fracture in children is classic for Volkmann ischemic contracture -- the dreaded complication of untreated forearm compartment syndrome)",
      "Crush injury or prolonged compression (found-down patient, prolonged surgical positioning, heavy limb compression during unconsciousness from overdose or intoxication)",
      "Circumferential cast, splint, or tight dressing compressing a post-injury edematous limb (nurse must assess neurovascular status and advocate for cast splitting or bivalving)",
      "Reperfusion injury after vascular repair or revascularization of an ischemic limb (ischemia-reperfusion edema rapidly increases compartment pressure)",
      "Massive fluid resuscitation in burn or trauma patients causing third-spacing edema into muscle compartments",
      "Anticoagulant therapy causing compartmental hemorrhage after minor injury; patients on warfarin or direct oral anticoagulants have elevated risk"
    ],
    diagnostics: [
      "Intracompartmental pressure (ICP) measurement using a Stryker device or arterial line transducer: absolute ICP above 30 mmHg or delta pressure (diastolic BP minus ICP) less than 30 mmHg confirms the diagnosis and mandates emergent fasciotomy",
      "Serial neurovascular assessments (the 6 Ps): Pain (out of proportion, with passive stretch), Pressure (tense compartment), Paresthesia (early nerve ischemia), Paralysis (late motor nerve damage), Pallor (late vascular compromise), Pulselessness (very late and ominous)",
      "Serum creatine kinase (CK): markedly elevated (often above 10,000 U/L) indicating rhabdomyolysis from muscle necrosis; serial CK levels trending upward confirm ongoing muscle damage",
      "Serum potassium: hyperkalemia from potassium release from necrotic myocytes; obtain stat level and continuous cardiac monitoring for dysrhythmia; potassium above 6.0 mEq/L requires emergent treatment",
      "Serum myoglobin and urine myoglobin: positive urine myoglobin causes dark brown (cola-colored) urine; serum myoglobin confirms rhabdomyolysis; myoglobin is nephrotoxic and requires aggressive hydration",
      "Basic metabolic panel and renal function: BUN and creatinine elevation indicates acute kidney injury from myoglobinuria; monitor serial values every 6-12 hours in established rhabdomyolysis"
    ],
    management: [
      "Emergent fasciotomy is the definitive treatment and is TIME-CRITICAL: decompression within 6 hours preserves muscle function; delay beyond 6 hours significantly increases morbidity; beyond 12 hours, amputation rates and mortality increase dramatically",
      "Remove ALL circumferential dressings, casts, or splints immediately if compartment syndrome is suspected; this alone can reduce ICP by 40-60% and may restore perfusion in early cases; bivalve the cast and cut through all padding layers to skin",
      "Maintain the affected limb at heart level (NOT elevated above the heart, which decreases arterial perfusion pressure and worsens ischemia; NOT dependent, which increases edema) to optimize perfusion pressure to the compartment",
      "Initiate aggressive IV crystalloid resuscitation (normal saline at 200-400 mL/hour initially) for rhabdomyolysis to maintain urine output above 200 mL/hour and prevent myoglobin precipitation in renal tubules",
      "Treat hyperkalemia emergently if potassium exceeds 6.0 mEq/L: calcium gluconate 10% IV (cardiac membrane stabilization), regular insulin 10 units IV with dextrose 50% 25g IV (intracellular potassium shift), sodium bicarbonate (alkalinizes urine and shifts potassium), kayexalate or patiromer (potassium elimination)",
      "Administer IV sodium bicarbonate to alkalinize urine (target urine pH above 6.5), which increases myoglobin solubility and reduces renal tubular precipitation and nephrotoxicity",
      "Prepare patient for post-fasciotomy wound management: fasciotomy wounds are left open with VAC device or wet dressings; delayed primary closure or split-thickness skin grafting occurs 3-7 days later once swelling resolves"
    ],
    nursingActions: [
      "Perform serial neurovascular assessments every 1-2 hours (or more frequently in high-risk patients): assess and document the 6 Ps with emphasis on pain quality and response to passive stretch; compare bilateral findings; escalate immediately if any component worsens",
      "Assess pain characteristics carefully: pain out of proportion to the injury that is unrelieved by opioids and worsened by passive stretch of muscles in the affected compartment is the EARLIEST and most reliable sign of compartment syndrome; do not dismiss escalating pain",
      "Remove or loosen all circumferential dressings, casts, or bandages immediately if compartment syndrome is suspected; do not wait for a physician order if signs are progressing -- this is an emergency nursing intervention to prevent irreversible tissue loss",
      "Position the affected extremity at heart level; correct any elevation above the heart (which decreases arterial inflow) or dependent positioning (which increases edema); document limb position each assessment",
      "Monitor urine output hourly via Foley catheter in patients with rhabdomyolysis; report output below 200 mL/hour; assess urine color (dark brown/cola-colored indicates myoglobinuria); document urine color and specific gravity",
      "Monitor continuous cardiac telemetry for hyperkalemia-related dysrhythmias: peaked T waves (earliest ECG change), prolonged PR interval, widened QRS, loss of P waves, sine wave pattern; have calcium gluconate and insulin/dextrose at bedside",
      "Delegate vital sign monitoring and urine output measurement to LPN/UAP with specific parameters for immediate RN notification; retain neurovascular assessment, pain assessment interpretation, cast removal decision, and communication of findings to surgeon"
    ],
    assessmentFindings: [
      "Pain out of proportion to the visible injury that escalates despite adequate opioid analgesia -- the earliest and most sensitive clinical indicator of developing compartment syndrome",
      "Pain with passive stretch of the muscles within the affected compartment (e.g., pain with passive extension of toes indicates anterior compartment syndrome of the leg) -- highly specific for compartment syndrome",
      "Tense, firm, woody-feeling compartment on palpation compared to the unaffected contralateral limb; the compartment feels like a tightly inflated tire",
      "Paresthesia (numbness, tingling, burning) in the distribution of nerves traversing the affected compartment; sensory deficit indicates nerve ischemia has been present for at least 30 minutes",
      "Weakness or paralysis of muscles within the affected compartment (inability to dorsiflex foot in anterior leg compartment syndrome); this is a LATE finding indicating prolonged ischemia",
      "Distal pulses present in early compartment syndrome (compartment syndrome is a microvascular problem; major arterial flow is maintained until very late stages); absence of pulse is an ominous late sign",
      "Dark brown (cola-colored) urine indicating myoglobinuria from rhabdomyolysis; signals ongoing muscle necrosis and renal injury risk"
    ],
    signs: {
      left: [
        "Mild pain at fracture or injury site controlled with prescribed analgesics",
        "Intact sensation and motor function in all nerve distributions",
        "Soft compartment on palpation without tension",
        "Clear, yellow urine with adequate output",
        "Mild edema at injury site without circumferential swelling",
        "Pain does not worsen with passive stretch of affected muscles"
      ],
      right: [
        "Pain out of proportion to injury unrelieved by opioids and worsened by passive stretch",
        "Tense, firm, non-compressible compartment on palpation",
        "Paresthesia or numbness in nerve distribution (numbness between first and second toes in anterior compartment)",
        "Weakness or inability to dorsiflex foot or extend toes (motor deficit is a late sign)",
        "Dark cola-colored urine indicating myoglobinuria with CK above 10,000 U/L",
        "ICP measurement above 30 mmHg or delta pressure less than 30 mmHg (absolute indication for fasciotomy)"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate 10%",
        type: "Electrolyte supplement / cardiac membrane stabilizer",
        action: "Directly antagonizes the membrane effects of hyperkalemia on cardiac myocytes by increasing the threshold potential for depolarization, stabilizing the cardiac membrane and reducing the risk of fatal dysrhythmias; does NOT lower serum potassium but provides immediate cardiac protection while potassium-lowering therapies take effect",
        sideEffects: "Bradycardia (with rapid IV push), hypotension, tissue necrosis with extravasation (calcium chloride is more caustic than calcium gluconate), hypercalcemia with repeated doses, digitalis toxicity if patient is on digoxin",
        contra: "Concurrent digoxin therapy (calcium potentiates digitalis toxicity and can cause fatal cardiac arrest); hypercalcemia; known hypersensitivity; calcium chloride preferred over calcium gluconate for central line administration",
        pearl: "First-line EMERGENCY treatment for hyperkalemia with ECG changes -- administer over 2-3 minutes with continuous cardiac monitoring; effect begins within 1-3 minutes and lasts 30-60 minutes; may repeat once if ECG changes persist; always follow with potassium-lowering therapy (insulin/dextrose, sodium bicarbonate)"
      },
      {
        name: "Ketorolac (Toradol)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID) -- parenteral analgesic",
        action: "Non-selectively inhibits cyclooxygenase (COX-1 and COX-2) enzymes, blocking the conversion of arachidonic acid to prostaglandins and thromboxanes; reduces inflammation, pain, and fever; provides opioid-sparing analgesia that reduces the need for narcotics in musculoskeletal trauma; does NOT cause respiratory depression or sedation",
        sideEffects: "GI bleeding and peptic ulceration (highest NSAID GI risk), acute kidney injury (prostaglandin-mediated renal perfusion impaired), platelet dysfunction and bleeding risk, cardiovascular events with prolonged use, injection site pain",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment (CrCl below 30); perioperative use in CABG surgery; coagulopathy or concurrent anticoagulant therapy; use limited to 5 days maximum for IV/IM administration",
        pearl: "Provides excellent opioid-sparing analgesia for musculoskeletal pain BUT use with extreme caution in compartment syndrome patients with rhabdomyolysis -- NSAIDs can worsen renal injury from myoglobinuria; contraindicated once rhabdomyolysis is established; maximum 5 days of parenteral use"
      },
      {
        name: "Hydromorphone (Dilaudid)",
        type: "Opioid analgesic (semi-synthetic mu-opioid receptor agonist)",
        action: "Binds mu-opioid receptors in the CNS and peripheral tissues with approximately 5-7 times the potency of morphine; inhibits ascending pain pathways and modulates emotional response to pain; provides potent analgesia for severe pain from compartment syndrome and fasciotomy; shorter duration than morphine with more predictable pharmacokinetics in renal impairment",
        sideEffects: "Respiratory depression (monitor rate and depth), sedation, nausea and vomiting, constipation, pruritus, hypotension, urinary retention, physical dependence with prolonged use",
        contra: "Severe respiratory depression; paralytic ileus; concurrent MAO inhibitor use within 14 days; known hypersensitivity; use with caution in head injury (masks neurological changes)",
        pearl: "Preferred over morphine in patients with renal impairment because morphine's active metabolite (morphine-6-glucuronide) accumulates in renal failure causing prolonged sedation; in compartment syndrome with rhabdomyolysis-induced AKI, hydromorphone is the safer opioid choice; escalating pain requirements despite adequate dosing is a RED FLAG for worsening compartment pressure"
      }
    ],
    pearls: [
      "Pain out of proportion to the injury that is unrelieved by opioids and worsened by passive stretch of the affected muscles is the EARLIEST and most reliable clinical sign of compartment syndrome; never dismiss escalating pain in a patient with an extremity injury",
      "Distal pulses are typically PRESENT in compartment syndrome because it is a microvascular (capillary-level) problem; waiting for pulselessness means ischemia has progressed far beyond the point of salvageability -- absence of pulse is a very late and ominous finding",
      "The 6-hour window: muscle necrosis becomes irreversible after approximately 6-8 hours of ischemia; fasciotomy within 6 hours generally produces good functional outcomes; beyond 12 hours, expect high rates of amputation, permanent disability, and systemic complications",
      "Remove ALL circumferential dressings, casts, and splints IMMEDIATELY when compartment syndrome is suspected -- this single action can reduce intracompartmental pressure by 40-60% and is within the RN scope of practice as an emergency intervention",
      "Position the limb at HEART LEVEL -- not elevated (decreases arterial perfusion pressure and worsens ischemia) and not dependent (increases venous congestion and edema); this is a commonly misunderstood principle",
      "Cola-colored urine (myoglobinuria) signals rhabdomyolysis and imminent renal injury; target urine output above 200 mL/hour with aggressive crystalloid resuscitation and urine alkalinization with sodium bicarbonate to prevent myoglobin precipitation in renal tubules",
      "Delegate vital sign monitoring and urine output measurement to UAP with clear escalation parameters; the neurovascular assessment, pain interpretation, decision to remove casts, and surgeon communication are RN responsibilities that cannot be delegated"
    ],
    quiz: [
      {
        question: "A patient with a tibial fracture reports severe pain that is not relieved by IV morphine. The nurse assesses the affected leg and finds pain increases significantly when passively extending the patient's toes. Which action should the nurse take FIRST?",
        options: [
          "Elevate the affected leg above the level of the heart to reduce swelling",
          "Notify the surgeon immediately and prepare for possible emergent fasciotomy",
          "Apply ice packs to the affected compartment to reduce inflammation",
          "Increase the IV morphine dose as the current dose is clearly inadequate"
        ],
        correct: 1,
        rationale: "Pain out of proportion to injury unrelieved by opioids combined with pain on passive stretch of affected muscles is the hallmark presentation of acute compartment syndrome. The surgeon must be notified immediately as emergent fasciotomy may be required. Elevation would decrease arterial perfusion. Ice causes vasoconstriction and worsens ischemia."
      },
      {
        question: "Which assessment finding in a patient with suspected acute compartment syndrome indicates the MOST advanced stage of tissue ischemia?",
        options: [
          "Pain with passive stretch of the muscles in the affected compartment",
          "Paresthesia in the nerve distribution of the affected compartment",
          "Absence of palpable distal pulses in the affected extremity",
          "Tense and firm compartment on palpation"
        ],
        correct: 2,
        rationale: "Absence of distal pulses is the latest and most ominous finding in compartment syndrome, indicating ischemia has progressed beyond the microvascular level to affect major arterial flow. Pain with passive stretch and paresthesia are early findings. Tense compartment is an intermediate finding. Waiting for pulselessness means irreversible damage has likely occurred."
      },
      {
        question: "A nurse caring for a patient with rhabdomyolysis from compartment syndrome notes dark brown urine output of 50 mL/hour. Which intervention is MOST important?",
        options: [
          "Restrict IV fluids to prevent fluid overload",
          "Increase IV crystalloid infusion rate to achieve urine output above 200 mL/hour",
          "Administer furosemide to increase urine output",
          "Obtain a urinalysis to confirm the urine color is from myoglobin"
        ],
        correct: 1,
        rationale: "Dark brown urine indicates myoglobinuria, and output of 50 mL/hour is inadequate to prevent myoglobin precipitation in the renal tubules. Aggressive IV crystalloid resuscitation targeting urine output above 200 mL/hour is the primary intervention to prevent acute kidney injury. Fluid restriction would worsen renal damage. Furosemide can worsen acidic urine pH."
      }
    ]
  },

  "acute-hemolytic-reaction-rn": {
    title: "Acute Hemolytic Transfusion Reaction for Registered Nurses",
    cellular: {
      title: "Immunopathophysiology of Acute Hemolytic Transfusion Reactions",
      content: "An acute hemolytic transfusion reaction (AHTR) is the most serious and potentially fatal complication of blood transfusion, occurring when pre-formed recipient antibodies (most commonly anti-A or anti-B isohemagglutinins) attack and rapidly destroy transfused donor red blood cells. The vast majority of AHTRs result from ABO incompatibility due to clerical or identification errors -- the wrong blood given to the wrong patient. The mortality rate ranges from 1 in 600,000 to 1 in 1,800,000 transfusions, but when AHTR occurs, the fatality rate approaches 10-44% depending on the volume transfused and the speed of recognition and intervention. The registered nurse is the final safety barrier in the transfusion chain and bears primary responsibility for verifying patient identity, confirming blood compatibility at the bedside, and recognizing the earliest signs of hemolysis.\n\nABO blood group antigens are carbohydrate structures (oligosaccharides) expressed on the surface of red blood cells, determined by the ABO gene on chromosome 9. Type A individuals have A antigens and naturally occurring anti-B antibodies (IgM class). Type B individuals have B antigens and anti-A antibodies. Type O individuals have neither A nor B antigens but carry both anti-A and anti-B antibodies (making type O the universal donor for red blood cells but the MOST DANGEROUS recipient -- they will hemolyze any non-O blood). Type AB individuals have both A and B antigens with no ABO antibodies (universal recipient). These naturally occurring ABO antibodies are IgM class, which is significant because IgM is an extremely potent activator of the classical complement cascade.\n\nWhen ABO-incompatible red blood cells are transfused, the recipient's preformed IgM antibodies immediately bind to the foreign ABO antigens on the transfused cells. This antigen-antibody complex activates the classical complement cascade, beginning with C1q binding to the Fc portion of the IgM antibody. The cascade proceeds through C1, C4, C2, and C3, generating the anaphylatoxins C3a and C5a (which cause vasodilation, increased vascular permeability, mast cell degranulation, and neutrophil activation), and culminating in assembly of the membrane attack complex (MAC, C5b-C9) on the surface of the transfused red blood cells. The MAC creates transmembrane pores that cause rapid intravascular hemolysis -- the transfused cells literally explode, releasing their contents directly into the plasma.\n\nThe consequences of massive intravascular hemolysis are devastating and multisystemic. Free hemoglobin released into the plasma overwhelms the scavenging capacity of haptoglobin (which normally binds free hemoglobin) and hemopexin (which binds free heme). The excess free hemoglobin is filtered by the glomerulus and precipitates in the renal tubules, causing acute tubular necrosis and acute kidney injury (hemoglobinuric nephropathy). Free hemoglobin also scavenges nitric oxide (a potent vasodilator), causing vasoconstriction, hypertension initially, and then renal vasoconstriction that further impairs renal perfusion. The hemolyzed red blood cells release massive amounts of thromboplastin (tissue factor) and phospholipids that activate the coagulation cascade, triggering disseminated intravascular coagulation (DIC). DIC causes simultaneous widespread microvascular thrombosis (consuming clotting factors and platelets) and hemorrhage (from depleted clotting factors), creating the paradox of concurrent clotting and bleeding.\n\nThe anaphylatoxins C3a and C5a generated by complement activation cause systemic vasodilation, increased capillary permeability, bronchospasm, and activation of the inflammatory cascade. C5a is a potent neutrophil chemotaxin, recruiting activated neutrophils that release reactive oxygen species and proteolytic enzymes, causing widespread endothelial damage. Mast cell degranulation releases histamine, causing urticaria, pruritus, flushing, and contributing to hypotension. The massive cytokine release (tumor necrosis factor-alpha, interleukin-1, interleukin-6) produces the systemic inflammatory response that drives fever, tachycardia, and distributive shock.\n\nThe clinical presentation of AHTR typically begins within minutes of starting the transfusion (often within the first 15 mL), which is why the registered nurse must remain at the bedside for at minimum the first 15 minutes of any transfusion. The earliest symptoms are often subtle: anxiety, a sense of impending doom, restlessness, chest tightness, or pain at the infusion site. These rapidly progress to fever, chills (rigors), flank pain (from renal capsule distension), low back pain, hemoglobinuria (dark red or cola-colored urine), hypotension, tachycardia, dyspnea, and diffuse bleeding from DIC. In anesthetized or unconscious patients, the first signs may be hemoglobinuria, unexplained hypotension, diffuse oozing from surgical sites (DIC), or fever.\n\nThe differential diagnosis includes febrile non-hemolytic transfusion reaction (FNHTR, caused by recipient antibodies against donor leukocyte antigens or cytokines accumulated in stored blood; presents with fever and chills but WITHOUT hemoglobinuria, hypotension, or DIC), allergic/anaphylactic transfusion reaction (urticaria, bronchospasm, angioedema from IgE-mediated allergy to donor plasma proteins; more common in IgA-deficient recipients), transfusion-related acute lung injury (TRALI, non-cardiogenic pulmonary edema from donor antibodies against recipient leukocytes causing neutrophil-mediated lung injury), and bacterial contamination of blood products (gram-negative sepsis with endotoxic shock, more common with platelet transfusion due to room-temperature storage).\n\nThe nursing response to suspected AHTR follows an established protocol that must be executed immediately and in the correct order: (1) STOP the transfusion immediately, (2) maintain IV access with normal saline via new tubing (do not flush the blood-contaminated tubing), (3) notify the physician and blood bank simultaneously, (4) verify the patient identity against the blood product label and transfusion tag (clerical check), (5) send the blood bag with attached tubing, post-transfusion blood samples (EDTA tube for DAT/Coombs, and clotted tube), and a fresh urine specimen to the blood bank for investigation, and (6) initiate supportive care as ordered (aggressive IV fluids for renal perfusion, vasopressors for shock, DIC management)."
    },
    riskFactors: [
      "Clerical or identification errors in blood sampling, labeling, or bedside verification -- responsible for the vast majority of ABO-incompatible transfusions; represents a failure in the final nurse safety check",
      "History of prior transfusions creating alloantibodies to minor red blood cell antigens (Rh, Kell, Duffy, Kidd systems) that may not be detected on standard crossmatch",
      "History of pregnancy (exposure to fetal red blood cell antigens during delivery can stimulate maternal antibody production against paternal antigens)",
      "Sickle cell disease patients who require frequent transfusions and develop alloantibodies at rates of 25-30% due to antigen disparity between predominantly Caucasian donor pools and African American recipients",
      "Emergency transfusion of uncrossmatched blood (type O negative) where complete compatibility testing has not been performed",
      "Multiple myeloma or other conditions with paraprotein production that may interfere with compatibility testing",
      "Immunosuppressed patients whose attenuated immune response may delay clinical recognition of hemolysis"
    ],
    diagnostics: [
      "Direct antiglobulin test (DAT/direct Coombs test): detects antibodies or complement bound to the patient's (transfused) red blood cells; positive DAT is the hallmark laboratory finding of immune-mediated hemolysis; a negative DAT does not rule out hemolysis if cells have already been completely destroyed",
      "Post-transfusion hemoglobin and hematocrit: failure of hemoglobin to rise appropriately after transfusion (expected rise of 1 g/dL per unit of PRBCs) suggests hemolysis or ongoing blood loss",
      "Plasma free hemoglobin: elevated in intravascular hemolysis; normal plasma is straw-colored; pink or red plasma (hemoglobinemia) is visible evidence of hemolysis",
      "Haptoglobin level: decreased or undetectable because haptoglobin binds free hemoglobin and the complex is rapidly cleared by the reticuloendothelial system; haptoglobin below 25 mg/dL strongly suggests hemolysis",
      "Lactate dehydrogenase (LDH): markedly elevated from release of intracellular LDH during red blood cell lysis; LDH is a sensitive but non-specific marker of hemolysis",
      "DIC panel: fibrinogen (decreased from consumption), D-dimer (elevated from fibrin degradation), PT/INR and aPTT (prolonged from clotting factor consumption), platelet count (decreased from consumption) -- the classic DIC triad of low fibrinogen, high D-dimer, and low platelets"
    ],
    management: [
      "STOP the transfusion IMMEDIATELY upon suspicion of AHTR -- even small volumes of incompatible blood can trigger fatal DIC and renal failure; do not pause and reassess, do not slow the rate -- STOP completely",
      "Maintain IV access with NEW tubing and infuse 0.9% normal saline at a rate to achieve urine output above 100 mL/hour; do NOT flush blood through the existing tubing as this forces additional incompatible blood into the patient",
      "Initiate aggressive IV fluid resuscitation (normal saline or lactated Ringer) to maintain renal perfusion and promote diuresis; target urine output of 100-200 mL/hour for the first 24 hours to prevent hemoglobin precipitation in renal tubules",
      "Administer vasopressors (norepinephrine first-line) as ordered for refractory hypotension after adequate fluid resuscitation; distributive shock from complement activation and cytokine release may require vasopressor support",
      "Treat DIC with component therapy as ordered: fresh frozen plasma (FFP) to replace consumed clotting factors, cryoprecipitate for fibrinogen below 100 mg/dL, platelet transfusion for platelet count below 50,000 with active bleeding; do NOT administer heparin without hematology consultation",
      "Administer IV furosemide (20-40 mg) or mannitol (12.5-25g) as ordered if oliguria develops despite adequate fluid resuscitation; forced diuresis prevents hemoglobin cast formation in renal tubules",
      "Send all required specimens to the blood bank IMMEDIATELY: the implicated blood bag with attached tubing, post-transfusion EDTA blood sample (for DAT/repeat crossmatch), clotted blood sample (for free hemoglobin, haptoglobin), first-void urine specimen (for hemoglobinuria)"
    ],
    nursingActions: [
      "Verify patient identity using TWO independent identifiers (name and date of birth or medical record number) matched against the blood product label AND the transfusion tag at the bedside IMMEDIATELY before starting every transfusion -- this is the most critical safety step in all of nursing practice regarding transfusion",
      "Remain at the bedside for the first 15 minutes of each unit transfused and obtain vital signs at baseline (pre-transfusion), 15 minutes after start, then every 30-60 minutes during transfusion, and upon completion; most fatal reactions manifest within the first 15-50 mL",
      "Upon suspecting AHTR: STOP transfusion, disconnect blood tubing from IV catheter, connect new tubing with NS, keep blood bag and tubing intact for return to blood bank; document time transfusion was stopped and volume infused",
      "Assess for early signs of hemolysis that may be subtle: patient complaint of anxiety or sense of impending doom, pain at infusion site, restlessness, chest tightness, low back pain; do not dismiss these symptoms during active transfusion",
      "Monitor urine output hourly via Foley catheter; assess urine color for hemoglobinuria (dark red, cola-colored, or port wine-colored urine); send initial specimen for urinalysis and urine hemoglobin to blood bank",
      "Monitor for DIC: assess all IV sites, surgical sites, and mucous membranes for unexpected or excessive bleeding; report petechiae, ecchymoses, oozing from puncture sites, or gingival bleeding immediately",
      "Document the transfusion reaction thoroughly: time reaction was identified, signs and symptoms, time transfusion was stopped, volume infused, interventions performed, specimens sent, physician notification with time and orders received; complete the transfusion reaction report per facility protocol"
    ],
    assessmentFindings: [
      "Fever with rigors (shaking chills) developing within minutes of starting transfusion; temperature rise of 1 degree C or more from baseline -- although also seen in febrile non-hemolytic reactions, must be treated as AHTR until proven otherwise",
      "Flank pain and low back pain from renal capsule distension as hemoglobin precipitates in renal tubules; this finding is highly specific for hemolytic reaction and should trigger immediate action",
      "Hemoglobinuria: dark red, cola-colored, or port wine-colored urine indicating free hemoglobin filtration by the kidneys; obtain and send specimen immediately to the blood bank",
      "Hypotension and tachycardia from distributive shock caused by complement activation, histamine release, and massive cytokine release; may progress rapidly to cardiovascular collapse",
      "Diffuse bleeding from IV sites, surgical wounds, and mucous membranes indicating disseminated intravascular coagulation (DIC) from tissue factor release by hemolyzed red blood cells",
      "Chest pain, dyspnea, and wheezing from complement-mediated bronchospasm and pulmonary leukosequestration (neutrophil trapping in pulmonary capillaries)",
      "In anesthetized or unconscious patients: unexplained hypotension, hemoglobinuria (dark urine in Foley bag), diffuse oozing from surgical field, and unexpected temperature elevation may be the only identifiable signs"
    ],
    signs: {
      left: [
        "Mild fever (temperature rise less than 1 degree C) without chills or rigors",
        "Urticaria or mild pruritus without respiratory symptoms",
        "Mild anxiety or restlessness that resolves with reassurance",
        "Slight tachycardia (heart rate 90-100) with stable blood pressure",
        "Clear yellow urine without discoloration",
        "Mild discomfort at infusion site without other systemic symptoms"
      ],
      right: [
        "Rigors with temperature above 39 degrees C developing during transfusion",
        "Hemoglobinuria (dark red or cola-colored urine) indicating intravascular hemolysis",
        "Severe hypotension (systolic below 90) with tachycardia (above 120) and signs of shock",
        "Flank or low back pain with concurrent hypotension (renal involvement)",
        "Diffuse bleeding from multiple sites indicating DIC (oozing, petechiae, ecchymoses)",
        "Chest pain with dyspnea and oxygen desaturation (pulmonary involvement)"
      ]
    },
    medications: [
      {
        name: "Epinephrine (Adrenaline)",
        type: "Catecholamine (non-selective alpha and beta adrenergic agonist)",
        action: "Alpha-1 receptor activation causes peripheral vasoconstriction, increasing systemic vascular resistance and blood pressure, and reducing mucosal edema (airway protection); beta-1 activation increases heart rate and contractility (cardiac output); beta-2 activation causes bronchodilation, relieving bronchospasm, and stabilizes mast cell membranes preventing further histamine and mediator release; the only medication that addresses ALL components of anaphylaxis simultaneously",
        sideEffects: "Tachycardia, palpitations, hypertension, tremor, anxiety, headache, ventricular dysrhythmias (especially in cardiac patients or with excessive doses), myocardial ischemia, hyperglycemia",
        contra: "No absolute contraindications in true anaphylaxis (the benefit always outweighs the risk); relative cautions include coronary artery disease, uncontrolled hypertension, and concurrent beta-blocker therapy (may cause paradoxical hypertension from unopposed alpha stimulation)",
        pearl: "For anaphylaxis: IM injection 0.3-0.5 mg (1:1000 concentration) in the anterolateral thigh is first-line; for cardiovascular collapse: IV epinephrine 0.1 mg (1:10,000 concentration) titrated to response; NEVER give 1:1000 concentration IV as it can cause fatal ventricular fibrillation; in transfusion reactions with anaphylaxis features, give IM epinephrine without delay"
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic (inhibits Na-K-2Cl cotransporter in thick ascending limb of loop of Henle)",
        action: "Blocks the sodium-potassium-2 chloride (NKCC2) cotransporter in the thick ascending limb of the loop of Henle, preventing sodium, potassium, and chloride reabsorption; produces potent diuresis that increases urine flow rate through the renal tubules, reducing contact time between nephrotoxic free hemoglobin and the tubular epithelium, thereby preventing hemoglobin cast formation and acute tubular necrosis",
        sideEffects: "Hypovolemia and dehydration, hypokalemia (monitor closely), hyponatremia, hypocalcemia, hypomagnesemia, ototoxicity (especially with rapid IV push or concurrent aminoglycosides), metabolic alkalosis, hyperuricemia",
        contra: "Anuria unresponsive to initial fluid challenge (indicates established renal failure requiring dialysis rather than diuretic therapy); severe hypovolemia (must ensure adequate fluid resuscitation BEFORE administering diuretic); sulfonamide allergy (cross-sensitivity possible); hepatic encephalopathy with electrolyte imbalance",
        pearl: "Administer ONLY after adequate IV fluid resuscitation has been initiated -- giving furosemide to a hypovolemic patient will worsen renal perfusion and exacerbate kidney injury; IV push should not exceed 4 mg/min to prevent ototoxicity; monitor potassium and replace aggressively as furosemide causes significant potassium wasting"
      },
      {
        name: "Diphenhydramine (Benadryl)",
        type: "First-generation antihistamine (H1 receptor antagonist)",
        action: "Competitively blocks histamine H1 receptors on vascular smooth muscle, bronchial smooth muscle, and sensory nerve endings, reversing histamine-mediated vasodilation, increased capillary permeability, bronchospasm, and pruritus; in transfusion reactions, counteracts the histamine released by mast cell degranulation triggered by complement-generated anaphylatoxins (C3a, C5a)",
        sideEffects: "Sedation and drowsiness (most common -- crosses blood-brain barrier), dry mouth, urinary retention, blurred vision, constipation, tachycardia, confusion in elderly patients (anticholinergic delirium)",
        contra: "Narrow-angle glaucoma; urinary retention from prostatic hypertrophy; concurrent MAO inhibitor use; premature neonates; caution in elderly patients (Beers criteria -- high anticholinergic burden increases fall risk and delirium)",
        pearl: "Used as ADJUNCTIVE therapy in transfusion reactions -- NOT a substitute for stopping the transfusion and initiating definitive management; commonly administered prophylactically before transfusion in patients with history of mild allergic reactions; IV administration should be slow (over 1-2 minutes) to prevent hypotension"
      }
    ],
    pearls: [
      "The MOST CRITICAL nursing responsibility in blood transfusion is bedside verification of patient identity using TWO independent identifiers matched against the blood product label and transfusion tag; the majority of fatal AHTRs result from identification errors that the bedside nurse is the last person to catch",
      "The first 15 minutes and first 50 mL of each transfusion are the highest-risk period; the nurse must remain at the bedside, not leave the room, during this critical window; most fatal reactions manifest within this period",
      "When AHTR is suspected: STOP-DISCONNECT-SALINE -- stop the transfusion immediately, disconnect the blood tubing from the IV catheter (do not flush), connect new NS tubing; save the blood bag and all tubing for blood bank investigation",
      "Hemoglobinuria (dark red or cola-colored urine) is the hallmark sign that distinguishes AHTR from other transfusion reactions; its presence mandates aggressive IV fluid resuscitation to maintain urine output above 100 mL/hour to protect the kidneys",
      "DIC is a life-threatening complication of AHTR: monitor for the classic triad of decreased fibrinogen, elevated D-dimer, and decreased platelet count; assess ALL access sites and mucous membranes for unexpected bleeding; DIC can cause simultaneous clotting and hemorrhage",
      "In anesthetized or unconscious patients who cannot report subjective symptoms, hemoglobinuria in the Foley catheter bag, unexplained hypotension, diffuse surgical field oozing, and fever may be the ONLY detectable signs of AHTR",
      "Delegate vital sign measurement to LPN/UAP during transfusion but NEVER delegate the bedside identity verification, the first-15-minute bedside monitoring, transfusion initiation, or recognition and management of transfusion reactions -- these are non-delegable RN responsibilities"
    ],
    quiz: [
      {
        question: "A registered nurse is transfusing packed red blood cells when the patient develops fever, rigors, flank pain, and dark red urine 10 minutes after starting the transfusion. What is the nurse's FIRST action?",
        options: [
          "Slow the transfusion rate and administer diphenhydramine",
          "Stop the transfusion immediately and disconnect the blood tubing from the IV catheter",
          "Obtain a post-transfusion blood specimen and send it to the lab",
          "Notify the blood bank and request a repeat crossmatch"
        ],
        correct: 1,
        rationale: "The combination of fever, rigors, flank pain, and hemoglobinuria (dark red urine) during transfusion is the classic presentation of an acute hemolytic transfusion reaction. The FIRST action is to STOP the transfusion and disconnect the blood tubing. Do not slow the rate or flush the line. After stopping, connect new NS tubing and notify the physician and blood bank."
      },
      {
        question: "Which laboratory finding is MOST specific for confirming an acute hemolytic transfusion reaction?",
        options: [
          "Elevated white blood cell count with neutrophilia",
          "Positive direct antiglobulin test (direct Coombs test) with decreased haptoglobin",
          "Elevated procalcitonin level",
          "Prolonged bleeding time with normal platelet count"
        ],
        correct: 1,
        rationale: "A positive direct antiglobulin test (DAT) indicates antibodies or complement bound to the patient's red blood cells, confirming immune-mediated hemolysis. Combined with decreased haptoglobin (consumed by binding free hemoglobin), this provides the most specific laboratory confirmation of AHTR."
      },
      {
        question: "A patient is receiving a blood transfusion in the operating room under general anesthesia. Which finding should alert the nurse to a possible acute hemolytic transfusion reaction?",
        options: [
          "Gradual increase in urine output to 100 mL/hour",
          "Mild increase in peak inspiratory pressure on the ventilator",
          "Dark red or cola-colored urine appearing in the Foley catheter bag with unexplained hypotension",
          "Slight decrease in end-tidal CO2 concentration"
        ],
        correct: 2,
        rationale: "In anesthetized patients who cannot report subjective symptoms like back pain or anxiety, hemoglobinuria (dark red/cola-colored urine visible in the Foley bag) combined with unexplained hypotension is the key objective finding indicating AHTR. The patient cannot verbalize pain or anxiety under anesthesia, making urine color and hemodynamic monitoring critical."
      }
    ]
  }
};

console.log("RN Batch 1: Injecting 4 lessons...");
let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`Done: ${count} lessons injected`);
