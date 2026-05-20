import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");
function escapeStr(s: string): string { return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n"); }
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
  console.log(`  NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {
  "boerhaave-syndrome-rn": {
    title: "Boerhaave Syndrome",
    cellular: {
      title: "Pathophysiology of Spontaneous Esophageal Perforation",
      content: "Boerhaave syndrome is a transmural perforation of the esophagus caused by a sudden, dramatic increase in intraesophageal pressure against a closed glottis, most commonly occurring during forceful vomiting or retching. Unlike iatrogenic esophageal perforations (which account for the majority of all esophageal perforations and typically occur during endoscopy, dilation, or transesophageal echocardiography), Boerhaave syndrome represents a spontaneous, full-thickness rupture that carries a mortality rate of 20-40% even with treatment, and approaches 100% without surgical intervention. Understanding the anatomy of the esophagus is critical for appreciating why this condition is so dangerous. The esophagus is unique among gastrointestinal structures in that it lacks a serosal layer -- it has only mucosa, submucosa, and muscularis propria (inner circular and outer longitudinal muscle layers) surrounded by adventitia. The absence of a serosa means there is no additional protective barrier to contain a perforation, allowing esophageal contents (gastric acid, digestive enzymes, food particles, and bacteria) to communicate directly with the mediastinum and pleural spaces. The left posterolateral distal esophagus, approximately 2-3 cm above the gastroesophageal junction, is the most common site of rupture (approximately 90% of cases). This location is vulnerable because it represents the weakest point in the esophageal wall, where the left posterolateral aspect transitions from the thoracic esophagus and where the natural anatomical support from surrounding structures is minimal. During forceful vomiting, the intragastric and intraesophageal pressure can rise dramatically (exceeding 200 mmHg) while the cricopharyngeus muscle at the upper esophageal sphincter remains contracted. This creates a hydraulic mechanism: gastric contents are forcefully propelled against a closed outlet, generating a sudden, extreme transmural pressure gradient that exceeds the tensile strength of the esophageal wall. The perforation allows gastric acid (pH 1-2), pepsin, bile, food particles, and oral and gastric bacteria to spill into the mediastinum, causing chemical mediastinitis within hours. The acidic gastric contents produce immediate chemical injury to the mediastinal tissues, triggering an intense inflammatory response with edema, tissue necrosis, and massive fluid sequestration. Bacterial contamination from oral flora and gastric organisms (both aerobic and anaerobic) rapidly superimposes bacterial mediastinitis on the chemical injury, creating a polymicrobial infection that can progress to frank mediastinal abscess formation. The anatomical continuity of the mediastinal fascial planes allows infection to spread rapidly and widely: superiorly to the neck (producing cervical emphysema and crepitus), inferiorly through the diaphragmatic hiatus to the retroperitoneum, and laterally through the mediastinal pleura into one or both pleural spaces, producing empyema (infected pleural effusion). Left-sided pleural effusion is most common due to the preferential left posterolateral location of the rupture. The combination of chemical injury, bacterial infection, massive fluid shifts, and systemic inflammatory response syndrome (SIRS) can rapidly progress to septic shock and multi-organ dysfunction syndrome (MODS) if not recognized and treated emergently. The clinical presentation of Boerhaave syndrome is classically described by Mackler's triad: vomiting (or retching), lower thoracic pain, and subcutaneous emphysema -- however, this complete triad is present in only 14-50% of patients. More commonly, patients present with severe retrosternal or epigastric pain after an episode of forceful vomiting, often accompanied by dyspnea, diaphoresis, and tachycardia. The pain may radiate to the back, left shoulder, or left arm, mimicking myocardial infarction, aortic dissection, or pancreatitis. Subcutaneous emphysema in the neck or chest wall, when present, is a pathognomonic finding that should immediately raise suspicion for esophageal perforation. Hamman sign (mediastinal crunching sound synchronous with the heartbeat, heard on auscultation over the precordium) indicates pneumomediastinum from air tracking along the esophageal perforation into the mediastinal space. The diagnosis is confirmed by contrast esophagography using water-soluble contrast (Gastrografin) initially -- if negative but clinical suspicion remains high, follow with thin barium (more sensitive but causes more severe mediastinal inflammation if it extravasates). CT of the chest with oral contrast has become the imaging modality of choice in many centers, demonstrating mediastinal air, pleural effusions, esophageal wall thickening, extraluminal contrast, and mediastinal fluid collections. The time from perforation to treatment is the single most important prognostic factor: mortality is approximately 10-25% when surgical repair is performed within 24 hours of perforation, but increases to 40-60% when delayed beyond 24 hours, and approaches 100% without treatment. The RN's role is critical in recognizing this surgical emergency: any patient presenting with severe chest pain following vomiting or retching, especially with subcutaneous emphysema, should be emergently evaluated for esophageal perforation. Nursing assessment must include monitoring for signs of rapidly progressive sepsis (escalating tachycardia, hypotension, fever, altered mental status), respiratory compromise (pleural effusion causing dyspnea and hypoxemia), and massive fluid sequestration (requiring aggressive volume resuscitation). The nurse must coordinate rapid diagnostic workup, establish large-bore IV access for volume resuscitation, administer broad-spectrum antibiotics covering gram-positive, gram-negative, and anaerobic organisms, maintain NPO status, and prepare the patient for emergent surgical consultation."
    },
    riskFactors: [
      "Forceful vomiting or retching (most common precipitant -- particularly after heavy meals, alcohol binge drinking, or bulimia)",
      "Alcohol use disorder (associated with forceful vomiting episodes; present in approximately 40% of Boerhaave cases)",
      "Bulimia nervosa (repeated self-induced vomiting increases risk of esophageal injury and perforation)",
      "Straining (heavy lifting, childbirth, seizures, severe coughing -- any Valsalva-type maneuver that increases intraesophageal pressure)",
      "Pre-existing esophageal pathology (Barrett esophagus, eosinophilic esophagitis, esophageal strictures, or pill esophagitis weakening the esophageal wall)",
      "Male sex (Boerhaave syndrome is approximately 5 times more common in men, possibly related to higher rates of alcohol use and more forceful vomiting)",
      "Age 50-70 years (peak incidence; likely reflects cumulative esophageal wall weakening and higher prevalence of predisposing conditions)"
    ],
    diagnostics: [
      "CT chest with oral contrast (imaging modality of choice in most centers -- demonstrates pneumomediastinum, mediastinal fluid, esophageal wall thickening, extraluminal contrast, and pleural effusions with >90% sensitivity)",
      "Water-soluble contrast esophagography (Gastrografin swallow -- demonstrates contrast extravasation at the perforation site; lower sensitivity than CT; follow with thin barium if initial study is negative but suspicion remains high)",
      "Chest X-ray (initial screening -- may show pneumomediastinum, left pleural effusion, pneumothorax, subcutaneous emphysema, or widened mediastinum; normal in up to 12% of confirmed cases early in presentation)",
      "Pleural fluid analysis from thoracentesis (elevated amylase from salivary origin, low pH, food particles, or elevated pleural fluid bilirubin confirm esophageal perforation into pleural space)",
      "Complete blood count (leukocytosis with left shift indicating acute inflammation and emerging infection)",
      "Serum lactate (elevated with tissue hypoperfusion from sepsis and massive third-spacing)",
      "Blood cultures (to identify bacteremia and guide targeted antibiotic therapy; often polymicrobial with oral and GI flora)"
    ],
    management: [
      "Emergent surgical consultation -- primary surgical repair (thoracotomy with primary closure and tissue flap reinforcement) is the gold standard when performed within 24 hours of perforation",
      "Broad-spectrum IV antibiotics covering gram-positive, gram-negative, and anaerobic organisms (piperacillin-tazobactam or meropenem plus vancomycin) initiated immediately upon suspicion of diagnosis",
      "Aggressive IV fluid resuscitation for massive third-space fluid losses and evolving sepsis (may require 6-10 liters in the first 24 hours)",
      "NPO status with nasogastric or nasoenteric decompression to minimize further esophageal contamination",
      "Chest tube thoracostomy for pleural effusion/empyema drainage (typically left-sided)",
      "ICU admission for hemodynamic monitoring, vasopressor support if septic shock develops, and post-operative care"
    ],
    nursingActions: [
      "Assess for Mackler triad: vomiting/retching history, severe thoracic pain, and subcutaneous emphysema -- palpate the neck and chest wall for crepitus (crackling sensation under the skin indicating subcutaneous air)",
      "Establish two large-bore (16-18 gauge) IV lines immediately for aggressive volume resuscitation and anticipate massive fluid requirements",
      "Monitor hemodynamic status continuously (heart rate, blood pressure, MAP, urine output) -- escalating tachycardia and hypotension indicate progressive sepsis and third-spacing",
      "Maintain strict NPO status and prepare for nasogastric tube placement for decompression (the NGT should be placed under direct visualization or fluoroscopic guidance to avoid advancing through the perforation)",
      "Administer broad-spectrum antibiotics within 1 hour of suspected diagnosis per sepsis protocols -- document exact time of first antibiotic dose",
      "Monitor oxygen saturation and respiratory status closely -- large pleural effusions may cause respiratory compromise requiring chest tube insertion",
      "Prepare patient for emergent surgical intervention: consent, surgical site marking, pre-operative labs, type and crossmatch, Foley catheter insertion, and coordination with OR team",
      "Monitor chest tube output if placed: document quantity, color, and character of drainage; report sudden increase in output or presence of food particles or bile-stained fluid"
    ],
    assessmentFindings: [
      "Severe retrosternal or epigastric pain following forceful vomiting or retching (may mimic MI, aortic dissection, or pancreatitis)",
      "Subcutaneous emphysema (crepitus on palpation of neck and chest wall -- pathognomonic for esophageal perforation when present after vomiting)",
      "Hamman sign (mediastinal crunching or crackling sound synchronous with heartbeat heard on auscultation -- indicates pneumomediastinum)",
      "Tachycardia and hypotension (early signs of systemic inflammatory response and sepsis from mediastinal contamination)",
      "Dyspnea with decreased breath sounds on the left (indicating left pleural effusion from perforation communicating with pleural space)",
      "Fever (may be absent initially but develops within hours as bacterial mediastinitis evolves)",
      "Diaphoresis, pallor, and signs of hemodynamic instability (indicate progression toward septic shock)"
    ],
    signs: {
      left: [
        "Mild chest discomfort after vomiting without emphysema",
        "Small pneumomediastinum on CT without significant fluid",
        "Hemodynamically stable with contained perforation",
        "Minimal pleural effusion on imaging",
        "Low-grade fever with mild leukocytosis"
      ],
      right: [
        "Tension pneumothorax from massive air leak into pleural space",
        "Septic shock with multi-organ failure from mediastinitis",
        "Massive bilateral empyema requiring bilateral chest tubes",
        "Esophageal necrosis requiring esophagectomy",
        "Cardiac arrest from mediastinal sepsis and cardiovascular collapse"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-spectrum penicillin/beta-lactamase inhibitor combination (broad-spectrum antibiotic)",
        action: "Piperacillin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), disrupting peptidoglycan cross-linking essential for cell wall integrity. Tazobactam irreversibly inhibits key beta-lactamase enzymes produced by resistant bacteria, protecting piperacillin from enzymatic degradation. The combination provides broad-spectrum coverage against gram-positive organisms (Streptococcus, Staphylococcus), gram-negative organisms (E. coli, Klebsiella, Pseudomonas aeruginosa), and critically important anaerobic bacteria (Bacteroides fragilis), making it ideal empiric coverage for the polymicrobial contamination that occurs when esophageal and gastric flora enter the mediastinum.",
        sideEffects: "Diarrhea, nausea, hypersensitivity reactions (rash to anaphylaxis), Clostridioides difficile-associated diarrhea, thrombocytopenia (especially with prolonged courses), hypokalemia, elevated hepatic transaminases, seizures (rare, primarily with renal impairment and high doses)",
        contra: "Known severe penicillin allergy (anaphylaxis); use with caution in cephalosporin allergy (approximately 1-2% cross-reactivity); dose adjustment required for renal impairment (CrCl <40 mL/min)",
        pearl: "Standard dosing for serious infections: 4.5 g IV every 6 hours; for critically ill patients, consider extended infusion (infuse over 4 hours instead of standard 30 minutes) to maximize time above MIC and improve bacterial killing; covers the polymicrobial flora expected in esophageal perforation (oral streptococci, enteric gram-negatives, and anaerobes); does NOT cover MRSA -- add vancomycin if MRSA risk factors are present"
      },
      {
        name: "Meropenem (Merrem)",
        type: "Carbapenem antibiotic (ultra-broad-spectrum beta-lactam)",
        action: "Binds to penicillin-binding proteins (PBPs 2 and 3), disrupting peptidoglycan synthesis and causing bacterial cell wall lysis. Carbapenems are uniquely resistant to nearly all beta-lactamase enzymes including extended-spectrum beta-lactamases (ESBLs) and AmpC beta-lactamases, providing the broadest beta-lactam coverage available. Effective against gram-positive (except MRSA and Enterococcus faecium), gram-negative (including Pseudomonas and ESBL-producing organisms), and anaerobic bacteria. Used as empiric monotherapy for life-threatening polymicrobial infections like mediastinitis from esophageal perforation.",
        sideEffects: "Diarrhea, nausea and vomiting, headache, injection site reactions, Clostridioides difficile-associated diarrhea, seizures (lower seizure risk than imipenem due to structural differences), thrombocytopenia, elevated hepatic transaminases, rash",
        contra: "Known hypersensitivity to carbapenems; anaphylaxis to penicillins (approximately 1% cross-reactivity with carbapenems -- risk-benefit analysis needed in life-threatening situations); reduces valproic acid levels significantly (contraindicated combination -- can precipitate seizures in epileptic patients by lowering valproate below therapeutic levels)",
        pearl: "Alternative to piperacillin-tazobactam for esophageal perforation when broader coverage is needed or when ESBL-producing organisms are suspected; dose: 1-2 g IV every 8 hours; consider extended infusion (infuse over 3 hours) in critically ill patients to optimize pharmacokinetics; CRITICAL drug interaction: dramatically reduces valproic acid serum concentrations by 60-100% through multiple mechanisms -- this combination should be avoided entirely"
      },
      {
        name: "Pantoprazole (Protonix)",
        type: "Proton pump inhibitor (PPI) for gastric acid suppression",
        action: "Irreversibly inhibits the hydrogen-potassium ATPase (proton pump) on the apical surface of parietal cells in the gastric mucosa, blocking the final step of hydrochloric acid secretion. Reduces both basal and stimulated gastric acid production by >95%. In esophageal perforation, acid suppression is critical to reduce the ongoing chemical injury to the mediastinal tissues caused by continued gastric acid reflux through the perforation site, and to optimize conditions for surgical repair healing.",
        sideEffects: "Headache, diarrhea, nausea, abdominal pain, flatulence; long-term risks include Clostridioides difficile infection, hypomagnesemia, osteoporosis-related fractures, vitamin B12 deficiency, and fundic gland polyps",
        contra: "Known hypersensitivity to PPIs or benzimidazoles; concurrent use with rilpivirine or atazanavir (PPIs significantly reduce absorption of these HIV medications)",
        pearl: "Administer 40 mg IV every 12 hours (or 80 mg IV bolus then 8 mg/hour continuous infusion for maximum acid suppression); IV formulation is essential since patient is NPO; reducing gastric acid output minimizes the chemical injury component of mediastinitis and creates a better environment for surgical repair healing; continue acid suppression therapy throughout the hospital course and transition to oral PPI when oral intake resumes"
      }
    ],
    pearls: [
      "Boerhaave syndrome has a mortality rate approaching 100% without treatment and 20-40% even WITH treatment -- time from perforation to surgical repair is the SINGLE most important prognostic factor; mortality doubles when treatment is delayed beyond 24 hours",
      "Mackler triad (vomiting, chest pain, subcutaneous emphysema) is classic but present in only 14-50% of cases -- subcutaneous emphysema following vomiting should be considered esophageal perforation until proven otherwise",
      "The esophagus is the ONLY GI structure that lacks a serosal layer, which is why perforations communicate freely with the mediastinum and why contained perforations are uncommon",
      "Left posterolateral distal esophagus (2-3 cm above the GEJ) is the location of >90% of spontaneous perforations -- this corresponds to the weakest anatomical point and explains why left pleural effusion is the most common associated finding",
      "Distinguish Boerhaave syndrome (transmural perforation) from Mallory-Weiss tear (partial-thickness mucosal tear at the GEJ that causes upper GI bleeding but does NOT perforate through the esophageal wall and does NOT cause mediastinitis)",
      "Contrast esophagography uses water-soluble contrast (Gastrografin) first because it causes less mediastinal inflammation than barium if it extravasates; however, Gastrografin has only 50-75% sensitivity -- if negative, follow with thin barium which is more sensitive",
      "The nurse must anticipate massive fluid resuscitation requirements (6-10 liters in the first 24 hours) due to severe third-spacing from mediastinal inflammation, and must monitor for signs of fluid overload during aggressive resuscitation"
    ],
    quiz: [
      {
        question: "A 55-year-old man presents to the emergency department with severe retrosternal chest pain that began during forceful vomiting after a large meal. On examination, you palpate crepitus in the neck and supraclavicular area. Which condition should you suspect?",
        options: [
          "Acute myocardial infarction with referred pain to the neck",
          "Mallory-Weiss tear with upper GI hemorrhage",
          "Boerhaave syndrome (spontaneous esophageal perforation) with subcutaneous emphysema",
          "Acute pancreatitis with mediastinal extension"
        ],
        correct: 2,
        rationale: "Subcutaneous emphysema (crepitus in the neck and supraclavicular area) following forceful vomiting is pathognomonic for esophageal perforation (Boerhaave syndrome). Air from the perforated esophagus tracks through the mediastinum and into the subcutaneous tissues of the neck. Mallory-Weiss tears are partial-thickness mucosal tears that cause GI bleeding but do NOT perforate through the esophageal wall and do not produce subcutaneous emphysema. This is a surgical emergency requiring immediate evaluation and intervention."
      },
      {
        question: "The nurse is caring for a patient with confirmed Boerhaave syndrome awaiting surgical repair. Which nursing priority is MOST critical?",
        options: [
          "Encouraging oral fluids to maintain hydration while awaiting surgery",
          "Aggressive IV fluid resuscitation with large-bore IV access and broad-spectrum antibiotics",
          "Positioning the patient flat to minimize esophageal reflux",
          "Administering antiemetics to prevent further vomiting and delaying surgical consultation"
        ],
        correct: 1,
        rationale: "The immediate nursing priorities for Boerhaave syndrome are: strict NPO status (NOT oral fluids), large-bore IV access for aggressive fluid resuscitation (patients may require 6-10 liters in the first 24 hours due to massive third-spacing), and administration of broad-spectrum IV antibiotics. The patient should be positioned with the head of bed elevated, and emergent surgical consultation should NEVER be delayed. The combination of chemical and bacterial mediastinitis causes severe sepsis requiring aggressive resuscitation."
      },
      {
        question: "How does Boerhaave syndrome differ from a Mallory-Weiss tear?",
        options: [
          "Boerhaave syndrome involves only the mucosa while Mallory-Weiss involves all layers",
          "Both conditions are identical in pathology but differ only in location",
          "Boerhaave syndrome is a transmural (full-thickness) perforation causing mediastinitis, while Mallory-Weiss is a partial-thickness mucosal tear causing GI bleeding",
          "Mallory-Weiss tears are more life-threatening because they cause more profuse hemorrhage"
        ],
        correct: 2,
        rationale: "Boerhaave syndrome is a transmural (full-thickness) perforation of all esophageal layers, allowing communication between the esophageal lumen and the mediastinum/pleural spaces, causing chemical and bacterial mediastinitis with high mortality. Mallory-Weiss tear is a partial-thickness mucosal tear at the gastroesophageal junction that causes upper GI bleeding (hematemesis) but does NOT perforate through the muscularis and does NOT cause mediastinitis or subcutaneous emphysema. This distinction is critical because the management differs entirely."
      }
    ]
  },

  "bone-marrow-failure-rn": {
    title: "Bone Marrow Failure Syndromes",
    cellular: {
      title: "Pathophysiology of Aplastic Anemia and Inherited Bone Marrow Failure",
      content: "Bone marrow failure syndromes encompass a heterogeneous group of disorders characterized by the inability of the bone marrow to produce adequate numbers of one or more blood cell lineages, resulting in peripheral cytopenias (anemia, neutropenia, thrombocytopenia, or pancytopenia). These disorders are classified as acquired or inherited, with significantly different pathogenic mechanisms, clinical presentations, and treatment approaches. Acquired aplastic anemia (AA) is the most common bone marrow failure syndrome in adults and serves as the prototype for understanding the pathophysiology of marrow failure. In acquired AA, the fundamental mechanism is immune-mediated destruction of hematopoietic stem cells (HSCs) and progenitor cells by autoreactive cytotoxic T lymphocytes (CD8+ T cells). These aberrant T cells recognize and attack HSC surface antigens through perforin-granzyme-mediated cytotoxicity and Fas-FasL-mediated apoptosis, progressively destroying the bone marrow's regenerative capacity. The T cell attack also releases inhibitory cytokines -- interferon-gamma (IFN-gamma) and tumor necrosis factor-alpha (TNF-alpha) -- that further suppress hematopoiesis by upregulating Fas expression on HSCs (making them more susceptible to apoptosis), inhibiting HSC proliferation, and activating intracellular apoptotic pathways. The net result is progressive replacement of hematopoietic marrow with fatty (adipose) tissue, visible on bone marrow biopsy as hypocellularity (<25% of expected cellularity in severe AA). The triggering events for this autoimmune process are incompletely understood but are associated with: viral infections (hepatitis-associated aplastic anemia occurring 2-3 months after an episode of seronegative hepatitis; parvovirus B19 causing transient aplastic crisis in patients with chronic hemolytic anemias; EBV; HIV; CMV), drug and chemical exposures (chloramphenicol, NSAIDs, anti-epileptics, benzene, pesticides, chemotherapy agents), ionizing radiation, pregnancy (pregnancy-associated aplastic anemia may resolve after delivery), and autoimmune diseases (SLE, eosinophilic fasciitis). In approximately 50-70% of cases, no identifiable trigger is found (idiopathic AA). The severity classification of AA is based on the degree of cytopenias and marrow hypocellularity: non-severe AA (NSAA) has cytopenias that do not meet severity criteria; severe AA (SAA) requires bone marrow cellularity <25% PLUS at least 2 of 3 criteria (absolute neutrophil count <500/mcL, platelet count <20,000/mcL, reticulocyte count <60,000/mcL); very severe AA (VSAA) meets SAA criteria with ANC <200/mcL. The clinical consequences of pancytopenia directly reflect the functions of the deficient cell lines. Anemia (reduced red blood cells) causes fatigue, weakness, exertional dyspnea, pallor, and tachycardia. Neutropenia (reduced neutrophils) dramatically increases infection risk -- the risk of life-threatening bacterial and fungal infections increases sharply when the ANC falls below 500/mcL and becomes critical when below 200/mcL. Febrile neutropenia (fever plus ANC <500/mcL) is a medical emergency requiring immediate blood cultures and empiric broad-spectrum antibiotics because the patient cannot mount an adequate inflammatory response, and infections can progress to fatal sepsis within hours. Thrombocytopenia (reduced platelets) impairs primary hemostasis, causing mucocutaneous bleeding (petechiae, purpura, epistaxis, gingival bleeding, menorrhagia) and increasing the risk of life-threatening hemorrhage (GI hemorrhage, intracranial hemorrhage) when platelet counts fall below 10,000-20,000/mcL. Inherited bone marrow failure syndromes (IBMFs) represent a distinct group of genetic disorders caused by germline mutations affecting HSC maintenance, DNA repair, ribosome biogenesis, or telomere biology. Fanconi anemia (FA) is the most common IBMF, caused by biallelic mutations in one of at least 22 FA genes involved in the Fanconi anemia DNA damage repair pathway. Cells from FA patients are hypersensitive to DNA interstrand crosslinks, leading to chromosomal instability, progressive bone marrow failure (usually developing in childhood), and a dramatically increased risk of myelodysplastic syndrome (MDS), acute myeloid leukemia (AML), and solid tumors (particularly squamous cell carcinomas of the head, neck, and anogenital region). Dyskeratosis congenita (DC) is caused by mutations in genes involved in telomere maintenance (TERT, TERC, DKC1, and others), resulting in critically short telomeres that impair HSC self-renewal capacity. The classic diagnostic triad is abnormal skin pigmentation (reticular hyperpigmentation), nail dystrophy, and oral leukoplakia, but presentations vary widely. Diamond-Blackfan anemia (DBA) is characterized by selective failure of erythropoiesis (pure red cell aplasia) due to mutations in ribosomal protein genes, causing impaired ribosome assembly and p53-mediated apoptosis of erythroid precursors. Shwachman-Diamond syndrome (SDS) is characterized by exocrine pancreatic insufficiency and bone marrow failure (primarily neutropenia) due to mutations in the SBDS gene involved in ribosome maturation. Treatment of acquired aplastic anemia depends on disease severity and patient age. For young patients (under 40) with an HLA-matched sibling donor, allogeneic hematopoietic stem cell transplantation (HSCT) is the preferred first-line treatment, offering cure rates of 75-90%. For patients without a matched donor or those over 40, immunosuppressive therapy (IST) with horse anti-thymocyte globulin (hATG) plus cyclosporine A is the standard first-line treatment, achieving hematologic response in 60-70% of patients. The addition of eltrombopag (a thrombopoietin receptor agonist) to IST has significantly improved response rates to approximately 85-94% in recent clinical trials. Supportive care is essential for all patients: red blood cell transfusions for symptomatic anemia (maintaining hemoglobin above 7-8 g/dL), platelet transfusions for bleeding or platelet counts below 10,000/mcL, antimicrobial prophylaxis during severe neutropenia, growth factor support (G-CSF for neutropenia), and iron chelation therapy for patients developing transfusion-related iron overload. The RN must understand that bone marrow failure patients are profoundly immunocompromised and require meticulous infection prevention, vigilant monitoring for febrile neutropenia (which requires emergent antibiotic administration within 60 minutes), careful blood product administration with monitoring for transfusion reactions, and ongoing psychosocial support for a chronic, life-threatening illness."
    },
    riskFactors: [
      "Drug and chemical exposures (chloramphenicol, sulfonamides, NSAIDs, anti-epileptics, benzene, pesticides, chemotherapy agents -- may trigger immune-mediated marrow destruction)",
      "Viral infections (seronegative hepatitis preceding aplastic anemia in 5-10% of cases; parvovirus B19; EBV; HIV; CMV)",
      "Inherited genetic mutations (Fanconi anemia genes, telomerase complex genes for dyskeratosis congenita, ribosomal protein genes for Diamond-Blackfan anemia)",
      "Autoimmune disorders (SLE, eosinophilic fasciitis, thymoma -- associated with autoimmune-mediated marrow failure)",
      "Ionizing radiation exposure (dose-dependent marrow damage; occupational, therapeutic, or accidental exposure)",
      "Pregnancy (pregnancy-associated aplastic anemia -- rare, may improve or resolve after delivery)",
      "Prior history of paroxysmal nocturnal hemoglobinuria (PNH clones are frequently detected in AA patients, representing a clonal escape from immune-mediated destruction)"
    ],
    diagnostics: [
      "Complete blood count with differential (pancytopenia: anemia, neutropenia, thrombocytopenia with low reticulocyte count indicating inadequate marrow production)",
      "Peripheral blood smear (normocytic or macrocytic anemia, decreased WBCs and platelets, no abnormal cells or blasts in typical aplastic anemia)",
      "Bone marrow biopsy (ESSENTIAL for diagnosis -- demonstrates hypocellular marrow with replacement by fat; cellularity <25% in severe AA; rules out MDS, leukemia, and marrow infiltration)",
      "Flow cytometry for PNH clone (GPI-anchored protein deficiency on granulocytes and red cells -- PNH clones are found in 40-60% of AA patients)",
      "Chromosomal breakage testing with mitomycin C or diepoxybutane (DEB test) to diagnose Fanconi anemia in patients under 40 or with suggestive features",
      "Telomere length measurement (age-adjusted lymphocyte telomere length below the 1st percentile suggests dyskeratosis congenita or telomere biology disorder)",
      "HLA typing of patient and siblings (for potential hematopoietic stem cell transplantation donor identification)"
    ],
    management: [
      "Allogeneic HSCT from HLA-matched sibling donor (first-line for severe AA in patients under 40 with available donor; cure rates 75-90%)",
      "Immunosuppressive therapy with horse anti-thymocyte globulin (hATG) plus cyclosporine A (first-line for patients without matched sibling donor or age >40; response rate 60-70%)",
      "Eltrombopag added to IST (improves response rates to 85-94% in recent trials; stimulates residual hematopoietic stem cell proliferation)",
      "Red blood cell transfusions (leukoreduced and irradiated to prevent alloimmunization and transfusion-associated GVHD; maintain Hgb >7-8 g/dL)",
      "Platelet transfusions for active bleeding or platelet count <10,000/mcL (use single-donor apheresis platelets to reduce alloimmunization risk)",
      "Antimicrobial prophylaxis during severe neutropenia (antifungal: fluconazole or posaconazole; antiviral: acyclovir; consider antibacterial prophylaxis with fluoroquinolone if ANC <200)"
    ],
    nursingActions: [
      "Implement strict neutropenic precautions: private room, rigorous hand hygiene, no fresh flowers or standing water, mask for patient when leaving room, restrict visitors with active infections",
      "Monitor for febrile neutropenia (temperature >38.3C once or >38.0C sustained for 1 hour with ANC <500) -- this is a medical emergency requiring blood cultures and IV antibiotics within 60 minutes",
      "Assess for bleeding at every shift: skin (petechiae, purpura, ecchymoses), gums, nasal mucosa, stool (guaiac testing), urine (hematuria), and neurological status (headache, vision changes suggesting intracranial hemorrhage)",
      "Implement bleeding precautions when platelet count <50,000: soft toothbrush, electric razor only, avoid IM injections, stool softeners to prevent straining, avoid rectal temperatures or suppositories",
      "Administer blood products per protocol with careful pre-transfusion verification (two-patient-identifier check, compare blood type, verify irradiation and leukoreduction) and monitor for transfusion reactions",
      "Monitor for iron overload in chronically transfused patients (serum ferritin >1000 ng/mL indicates need for iron chelation therapy; assess for signs of organ damage from iron deposition)",
      "Educate patients about infection prevention at home: hand hygiene, food safety (avoid raw/undercooked meats, unpasteurized products), avoiding crowded places during severe neutropenia, and recognizing fever as an emergency requiring immediate medical attention",
      "Provide psychosocial support and education about the chronic nature of the illness, treatment options, and prognosis; facilitate referrals to social work, psychology, and support groups"
    ],
    assessmentFindings: [
      "Fatigue, weakness, and exertional dyspnea (from anemia -- may be severe with Hgb <7 g/dL)",
      "Pallor of skin, conjunctivae, and nail beds (reflects decreased hemoglobin and reduced tissue perfusion)",
      "Petechiae, purpura, and easy bruising (from thrombocytopenia -- especially on dependent areas and mucous membranes)",
      "Mucosal bleeding (epistaxis, gingival bleeding, heavy menstrual periods -- from impaired primary hemostasis)",
      "Recurrent or unusual infections (from neutropenia -- patients may present with atypical infections or infections with minimal inflammatory signs due to inability to mount neutrophilic response)",
      "Tachycardia at rest (compensatory mechanism for anemia to maintain tissue oxygen delivery)",
      "Absence of splenomegaly and lymphadenopathy (important negative finding that helps distinguish AA from leukemia and lymphoma)"
    ],
    signs: {
      left: [
        "Mild fatigue and pallor with hemoglobin 9-10 g/dL",
        "Scattered petechiae with platelets 50,000-100,000",
        "Mild neutropenia (ANC 1000-1500) without infections",
        "Stable blood counts not requiring transfusions",
        "Macrocytosis on blood smear without other abnormalities"
      ],
      right: [
        "Febrile neutropenia with ANC <200 (life-threatening infection risk)",
        "Spontaneous intracranial hemorrhage from severe thrombocytopenia (<10,000)",
        "Overwhelming sepsis from invasive fungal infection in prolonged neutropenia",
        "Transfusion-dependent pancytopenia with iron overload and organ damage",
        "Transformation to MDS or AML (clonal evolution, 10-15% risk over 10 years)"
      ]
    },
    medications: [
      {
        name: "Horse Anti-Thymocyte Globulin (hATG/ATGAM)",
        type: "Polyclonal immunoglobulin (immunosuppressive agent)",
        action: "Polyclonal antibody preparation derived from horses immunized with human thymocytes. Contains antibodies directed against multiple T cell surface antigens (CD2, CD3, CD4, CD8, CD25, CD44, CD45), causing profound T cell depletion through complement-mediated lysis, opsonization and phagocytosis, and induction of T cell apoptosis. By eliminating the autoreactive T cells that are destroying hematopoietic stem cells in aplastic anemia, hATG allows surviving stem cells to regenerate and repopulate the bone marrow. The polyclonal nature means it targets multiple T cell epitopes simultaneously, reducing the chance of immune escape.",
        sideEffects: "Serum sickness (fever, rash, arthralgias, proteinuria occurring 7-14 days after administration -- very common, occurring in 85-95% of patients), infusion-related reactions (fever, chills, rigors, hypotension, anaphylaxis), thrombocytopenia (direct anti-platelet antibodies in the preparation), lymphopenia (expected therapeutic effect but increases infection risk)",
        contra: "Known severe allergy to horse proteins (perform intradermal skin test before first dose); active uncontrolled infection (must be treated before initiating immunosuppression); extreme caution in patients with history of anaphylaxis to equine products",
        pearl: "Administered as an IV infusion over 12-18 hours daily for 4 consecutive days through a central venous catheter (highly thrombophlebitic to peripheral veins); ALWAYS premedicate with methylprednisolone, acetaminophen, and diphenhydramine to reduce infusion reactions and serum sickness severity; platelet transfusion support is usually needed during and after hATG administration; skin test with 0.1 mL of 1:1000 dilution intradermally 15-30 minutes before first dose to assess for hypersensitivity; horse-derived ATG (ATGAM) is preferred over rabbit ATG (Thymoglobulin) for first-line aplastic anemia treatment based on randomized trial data"
      },
      {
        name: "Cyclosporine A (Neoral/Sandimmune)",
        type: "Calcineurin inhibitor (T cell-targeted immunosuppressant)",
        action: "Binds to intracellular cyclophilin, and the cyclosporine-cyclophilin complex inhibits calcineurin, a calcium-calmodulin-dependent phosphatase essential for T cell activation. Calcineurin normally dephosphorylates NFAT (nuclear factor of activated T cells), allowing it to translocate to the nucleus and activate transcription of IL-2 and other cytokine genes critical for T cell proliferation and effector function. By blocking this pathway, cyclosporine selectively inhibits T helper cell activation and IL-2 production, suppressing the autoreactive T cell-mediated destruction of hematopoietic stem cells in aplastic anemia. Used in combination with hATG as standard immunosuppressive therapy.",
        sideEffects: "Nephrotoxicity (dose-dependent, most important toxicity -- monitor serum creatinine and maintain therapeutic trough levels of 150-250 ng/mL for AA), hypertension (affects up to 50% of patients), tremor, hirsutism, gingival hyperplasia, hyperkalemia, hypomagnesemia, hepatotoxicity, headache, increased infection risk",
        contra: "Uncontrolled hypertension; active infection; concomitant use with other nephrotoxic agents (aminoglycosides, amphotericin B) increases nephrotoxicity risk; concurrent live vaccines; caution with potassium-sparing diuretics (hyperkalemia risk)",
        pearl: "Therapeutic drug monitoring is ESSENTIAL: target trough levels 150-250 ng/mL for aplastic anemia (draw level 12 hours after last dose, immediately before next dose); usually continued for at least 12-24 months with very slow taper over 6+ months (abrupt discontinuation can trigger disease relapse); Neoral (microemulsion) and Sandimmune (original formulation) are NOT interchangeable -- Neoral has more consistent bioavailability; avoid grapefruit juice (inhibits CYP3A4, increasing cyclosporine levels); many drug interactions via CYP3A4 pathway require careful medication review"
      },
      {
        name: "Eltrombopag (Revolade/Promacta)",
        type: "Thrombopoietin receptor agonist (TPO-RA)",
        action: "Small molecule agonist that binds to the transmembrane domain of the thrombopoietin (TPO) receptor (c-Mpl) on hematopoietic stem cells and megakaryocyte precursors, activating downstream JAK-STAT and MAPK signaling pathways that stimulate cell proliferation, differentiation, and survival. In aplastic anemia, eltrombopag does more than just stimulate platelet production -- it appears to directly stimulate residual hematopoietic stem cells, promoting trilineage hematopoietic recovery (red cells, white cells, AND platelets). When added to standard IST (hATG + cyclosporine), it significantly improves overall and complete response rates.",
        sideEffects: "Hepatotoxicity (elevated ALT/AST -- requires liver function monitoring every 2 weeks during dose titration and monthly thereafter), thrombotic/thromboembolic events, bone marrow fibrosis (reticulin -- reversible on discontinuation, requires periodic bone marrow monitoring), cataracts (baseline and periodic ophthalmologic examination recommended), GI effects (nausea, diarrhea)",
        contra: "Pre-existing hepatic impairment (dose reduction required, avoid in severe hepatic disease); concurrent use with polyvalent cations (calcium, iron, aluminum, magnesium) reduces absorption significantly",
        pearl: "When added to standard IST for treatment-naive severe AA, eltrombopag improved complete response rates from approximately 10% to 44% in the landmark NHLBI trial; oral administration: take on empty stomach (1 hour before or 2 hours after meals) and separate from dairy products, calcium supplements, antacids, and iron by at least 4 hours (polyvalent cations chelate eltrombopag and reduce absorption by 70%); starting dose typically 150 mg daily in aplastic anemia (higher than the 25-50 mg used for ITP); monitor CBC and liver function closely during treatment"
      }
    ],
    pearls: [
      "Febrile neutropenia (fever >38.3C with ANC <500/mcL) is a medical EMERGENCY in bone marrow failure patients -- blood cultures and IV broad-spectrum antibiotics (covering Pseudomonas) MUST be administered within 60 minutes; the patient cannot mount a normal inflammatory response, so infection can progress to fatal sepsis rapidly",
      "Bone marrow biopsy showing <25% cellularity with fat replacement is the hallmark diagnostic finding of aplastic anemia -- peripheral blood findings alone cannot distinguish AA from MDS, leukemia, or other causes of pancytopenia",
      "Blood products for AA patients should ALWAYS be leukoreduced (to prevent HLA alloimmunization that could complicate future HSCT) and irradiated (to prevent transfusion-associated graft-versus-host disease in this immunocompromised population)",
      "Avoid transfusing blood products from family members who may be potential HSCT donors -- this can cause HLA sensitization that increases graft rejection risk; HLA typing of patient and siblings should be performed early in the disease course",
      "Cyclosporine trough levels must be maintained at 150-250 ng/mL for aplastic anemia -- levels below this range are subtherapeutic and levels above increase nephrotoxicity; draw trough 12 hours after last dose, immediately before next dose",
      "Eltrombopag must be taken on an empty stomach separated from dairy, calcium, iron, and antacids by at least 4 hours -- polyvalent cations chelate the drug and reduce absorption by 70%, rendering it ineffective",
      "Aplastic anemia patients have a 10-15% risk of clonal evolution to MDS or AML over 10 years, requiring long-term monitoring with periodic CBC and bone marrow evaluation even after achieving hematologic response"
    ],
    quiz: [
      {
        question: "A patient with severe aplastic anemia has an ANC of 300/mcL and develops a temperature of 38.5C. What is the MOST important nursing action?",
        options: [
          "Administer acetaminophen and recheck the temperature in 2 hours",
          "Obtain blood cultures and ensure IV broad-spectrum antibiotics are administered within 60 minutes",
          "Apply cooling blankets and increase oral fluid intake",
          "Wait for the physician to round and report the finding"
        ],
        correct: 1,
        rationale: "Febrile neutropenia (temperature >38.3C with ANC <500/mcL) is a medical emergency. The patient cannot mount an adequate inflammatory response due to severe neutropenia, meaning infection can progress to fatal sepsis within hours. Blood cultures must be obtained immediately and broad-spectrum IV antibiotics (covering Pseudomonas aeruginosa) must be administered within 60 minutes. This is a time-critical intervention with mortality directly related to delay in antibiotic administration."
      },
      {
        question: "Why must blood products for aplastic anemia patients be both leukoreduced AND irradiated?",
        options: [
          "To reduce the cost of blood products and simplify administration",
          "Leukoreduction prevents HLA alloimmunization that could complicate future HSCT; irradiation prevents transfusion-associated graft-versus-host disease",
          "To increase the shelf life of stored blood products",
          "To reduce the volume of each transfusion and prevent fluid overload"
        ],
        correct: 1,
        rationale: "Leukoreduction removes donor white blood cells from blood products, reducing the risk of HLA alloimmunization (development of antibodies against donor HLA antigens). HLA alloimmunization can cause platelet transfusion refractoriness and, critically, increases the risk of graft rejection if the patient later undergoes hematopoietic stem cell transplantation. Irradiation destroys donor T lymphocytes that could engraft in the immunocompromised AA patient and cause transfusion-associated graft-versus-host disease (TA-GVHD), which is nearly universally fatal."
      },
      {
        question: "Which finding on bone marrow biopsy is diagnostic of aplastic anemia?",
        options: [
          "Hypercellular marrow with increased blasts (>20%)",
          "Hypocellular marrow (<25% cellularity) with replacement by fat tissue",
          "Marrow fibrosis with dry tap and teardrop cells on peripheral smear",
          "Hypercellular marrow with megaloblastic changes"
        ],
        correct: 1,
        rationale: "Aplastic anemia is characterized by a hypocellular bone marrow (<25% cellularity in severe AA) with replacement of hematopoietic tissue by fat (adipose tissue). This reflects the immune-mediated destruction of hematopoietic stem cells. Hypercellular marrow with blasts would suggest leukemia; marrow fibrosis with teardrop cells suggests myelofibrosis; and hypercellular marrow with megaloblastic changes suggests B12 or folate deficiency. Bone marrow biopsy is ESSENTIAL for diagnosis as peripheral blood alone cannot distinguish AA from these other conditions."
      }
    ]
  },

  "brainstem-glioma-rn": {
    title: "Brainstem Gliomas",
    cellular: {
      title: "Neuropathology of Brainstem Tumors and Clinical Significance",
      content: "Brainstem gliomas are a heterogeneous group of central nervous system tumors arising within the brainstem (midbrain, pons, or medulla oblongata). They represent approximately 10-20% of all pediatric brain tumors and 1-2% of adult brain tumors, with a peak incidence between ages 5-10 years. The brainstem is among the most critical anatomical structures in the central nervous system, serving as the conduit for all motor and sensory pathways between the cerebral hemispheres and the spinal cord, housing the cranial nerve nuclei (III through XII), and containing the vital centers that regulate consciousness (reticular activating system), respiration (dorsal and ventral respiratory groups in the medulla), cardiovascular function (vasomotor center, cardiac centers), and autonomic nervous system activity. The critical functional density of the brainstem means that even small tumors can produce devastating neurological deficits, and surgical resection is often impossible without causing unacceptable morbidity. Brainstem gliomas are classified by their growth pattern, location, and histology, which are the primary determinants of prognosis and treatment approach. Diffuse intrinsic pontine glioma (DIPG), now reclassified as diffuse midline glioma H3K27-altered in the WHO 2021 classification, is the most common and most devastating subtype, accounting for approximately 75-80% of pediatric brainstem gliomas. DIPG arises diffusely within the pons, infiltrating between and around normal neural structures rather than displacing them, making surgical resection impossible. Histologically, DIPG typically demonstrates high-grade astrocytic features (WHO grade III or IV), and the defining molecular alteration is a lysine-to-methionine substitution at position 27 of the histone H3 protein (H3K27M mutation), found in approximately 80% of DIPGs. This histone mutation has profound epigenetic consequences: the mutant H3K27M protein acts as a dominant-negative inhibitor of the Polycomb Repressive Complex 2 (PRC2), a key epigenetic regulator that normally trimethylates H3K27 (H3K27me3) to silence gene expression. Loss of H3K27me3 leads to global epigenetic reprogramming with widespread de-repression of genes that promote cell proliferation, stem cell maintenance, and resistance to differentiation and apoptosis. The result is a highly proliferative, treatment-resistant tumor with a median survival of only 9-11 months from diagnosis. The prognosis for DIPG remains among the worst of any pediatric malignancy, with less than 10% survival at 2 years. Focal brainstem gliomas, in contrast, are well-circumscribed tumors that grow as discrete masses, often exophytic (growing outward from the brainstem surface into the surrounding CSF spaces). These are typically low-grade (WHO grade I or II) pilocytic astrocytomas or gangliogliomas, most commonly arising in the midbrain tectum (tectal gliomas) or the cervicomedullary junction. Because they are well-demarcated from surrounding brain tissue, focal brainstem gliomas may be amenable to surgical resection or debulking, and many behave indolently with prolonged survival. Tectal gliomas, in particular, often present with obstructive hydrocephalus (due to compression of the cerebral aqueduct) and may remain stable for years after CSF diversion alone, sometimes never requiring tumor-directed therapy. The clinical presentation of brainstem gliomas depends on the specific location within the brainstem and the cranial nerve nuclei and long tracts affected. The classic triad of DIPG presentation includes cranial nerve palsies (especially CN VI causing lateral rectus palsy with diplopia and CN VII causing facial weakness), long tract signs (hemiparesis or quadriparesis from corticospinal tract involvement, hyperreflexia, positive Babinski sign), and cerebellar signs (ataxia, dysmetria, intention tremor from involvement of cerebellar peduncles). Symptoms typically develop rapidly over weeks (consistent with the aggressive growth of DIPG), in contrast to the more insidious presentation of low-grade focal tumors. Additional presenting symptoms may include headache and vomiting (from hydrocephalus caused by CSF pathway obstruction), swallowing difficulties and dysarthria (from lower cranial nerve involvement), respiratory irregularities (Cheyne-Stokes respiration, apneic episodes from medullary respiratory center involvement), and hearing loss (from CN VIII involvement). The diagnosis of brainstem gliomas relies primarily on MRI findings. DIPG characteristically appears as a diffuse, expansile, T2/FLAIR hyperintense mass centered in the pons, enlarging the pons to more than twice its normal anteroposterior diameter, often with ventral encasement of the basilar artery and extension into adjacent structures (midbrain, medulla, cerebellar peduncles). The MRI appearance is considered sufficiently diagnostic that tissue biopsy has historically not been required for DIPG -- although stereotactic biopsy is increasingly performed to confirm H3K27M mutation status and identify potential molecular targets for clinical trials. Treatment of DIPG remains limited: radiation therapy (conventional fractionated radiation to 54-59.4 Gy over 6 weeks) is the only treatment demonstrated to provide temporary clinical improvement and modest survival prolongation (median survival improvement from 5 months to 9-11 months), but the tumor invariably recurs. No chemotherapy regimen has shown significant survival benefit for DIPG in randomized trials. For focal brainstem gliomas, management depends on histology and resectability: surgical resection is performed when safe, and observation with serial MRI is appropriate for indolent lesions (particularly tectal gliomas after CSF diversion). Chemotherapy (carboplatin/vincristine) is used for progressive low-grade tumors, and radiation therapy is reserved for unresectable or progressive tumors. The RN caring for patients with brainstem gliomas must perform meticulous neurological assessments (including cranial nerve function, motor strength, cerebellar testing, level of consciousness, and vital sign monitoring for brainstem compression), manage complications (aspiration risk from swallowing dysfunction, respiratory compromise, increased intracranial pressure), provide supportive care during radiation therapy (managing fatigue, skin care, steroid side effects), and offer compassionate psychosocial support to families facing a devastating diagnosis, particularly in the pediatric population."
    },
    riskFactors: [
      "Pediatric age (5-10 years peak incidence for DIPG; brainstem gliomas represent 10-20% of all pediatric CNS tumors)",
      "Neurofibromatosis type 1 (NF1 -- associated with increased incidence of low-grade brainstem gliomas, particularly optic pathway gliomas that may extend to the brainstem; NF1-associated gliomas generally have better prognosis)",
      "Prior radiation therapy to the brain (secondary gliomas may develop years after cranial radiation for other conditions)",
      "Li-Fraumeni syndrome (TP53 germline mutations predisposing to various CNS tumors including brainstem gliomas)",
      "No identified environmental or lifestyle risk factors (most brainstem gliomas arise sporadically with no identifiable cause)",
      "H3K27M mutation (defining molecular feature of DIPG/diffuse midline gliomas -- not inherited but arising somatically during tumorigenesis)",
      "Male sex (slight male predominance in pediatric brainstem gliomas, approximately 1.2:1 ratio)"
    ],
    diagnostics: [
      "MRI brain with and without gadolinium contrast (gold standard -- DIPG shows diffuse T2/FLAIR hyperintense pontine expansion; focal gliomas show well-circumscribed lesions often with contrast enhancement)",
      "MR spectroscopy (elevated choline/NAA ratio indicates high cellularity and rapid turnover consistent with high-grade tumor; may help distinguish tumor from other pontine lesions)",
      "Stereotactic biopsy (increasingly performed for DIPG to confirm H3K27M mutation status and identify molecular targets for clinical trials; historically not required when MRI appearance is classic)",
      "CT head (may show hydrocephalus from CSF pathway obstruction and gross mass effect, but MRI provides far superior soft tissue resolution for brainstem lesions)",
      "Ophthalmologic examination (papilledema indicating increased ICP; cranial nerve VI palsy causing lateral rectus weakness; cranial nerve VII involvement)",
      "Comprehensive neurological examination documenting cranial nerve function, motor strength, cerebellar signs, and level of consciousness as baseline for monitoring",
      "CSF cytology (if lumbar puncture is safe -- may show leptomeningeal dissemination, though DIPG rarely disseminates at diagnosis)"
    ],
    management: [
      "Radiation therapy for DIPG (conventional fractionated radiation 54-59.4 Gy over 6 weeks -- the ONLY treatment with demonstrated clinical benefit; provides temporary improvement in 70-80% of patients but tumor invariably recurs)",
      "Dexamethasone for peritumoral edema and increased ICP (reduces vasogenic edema, temporarily improves neurological symptoms; essential during radiation therapy)",
      "Surgical resection for focal, exophytic brainstem gliomas when anatomically feasible (may be curative for well-circumscribed low-grade tumors)",
      "CSF diversion (ventriculostomy or ventriculoperitoneal shunt) for obstructive hydrocephalus (particularly common with tectal gliomas obstructing the cerebral aqueduct)",
      "Chemotherapy for progressive low-grade brainstem gliomas (carboplatin/vincristine first-line; temozolomide or targeted therapies for recurrence)",
      "Clinical trial enrollment (strongly recommended for DIPG given the lack of effective standard therapies; novel agents targeting H3K27M and associated pathways are under investigation)"
    ],
    nursingActions: [
      "Perform comprehensive neurological assessments every 2-4 hours (or as ordered) including level of consciousness (GCS), cranial nerve function (especially CN VI, VII, IX, X for swallowing), motor strength, cerebellar function, and pupillary responses",
      "Monitor for signs of increased ICP (headache, vomiting -- especially morning vomiting, altered consciousness, Cushing triad of hypertension/bradycardia/irregular respirations, papilledema) and report immediately",
      "Assess swallowing function before each oral intake (brainstem tumor involvement of CN IX and X causes dysphagia with aspiration risk); maintain aspiration precautions and coordinate with speech-language pathology",
      "Monitor respiratory pattern and rate closely (brainstem respiratory centers in the medulla may be compromised -- watch for Cheyne-Stokes respiration, apneic episodes, or irregular breathing patterns)",
      "Administer dexamethasone per protocol and monitor for steroid side effects (hyperglycemia, mood changes, insomnia, gastric irritation, immunosuppression, myopathy with prolonged use)",
      "Provide radiation therapy supportive care: skin care to irradiated areas, manage radiation-related fatigue, ensure adequate nutrition (may need NG tube or PEG if swallowing is compromised), and monitor blood counts",
      "Implement fall prevention strategies for patients with cerebellar ataxia and motor weakness (assistive devices, supervised ambulation, padded side rails)",
      "Provide age-appropriate emotional support and family-centered care -- DIPG diagnosis is devastating; facilitate palliative care and psychosocial support referrals early in the disease course"
    ],
    assessmentFindings: [
      "Cranial nerve palsies (CN VI: diplopia and lateral gaze palsy; CN VII: facial asymmetry and weakness; CN IX/X: dysphagia, dysphonia, impaired gag reflex)",
      "Long tract signs (hemiparesis or quadriparesis, hyperreflexia, positive Babinski sign -- from corticospinal tract involvement)",
      "Cerebellar signs (ataxia, dysmetria, intention tremor, wide-based gait -- from cerebellar peduncle involvement)",
      "Signs of increased ICP (headache, vomiting especially in the morning, papilledema, altered level of consciousness)",
      "Respiratory irregularities (apneic episodes, Cheyne-Stokes respiration, or other irregular breathing patterns from medullary involvement)",
      "Rapid symptom progression over weeks (characteristic of DIPG, in contrast to slow progression in low-grade focal tumors)",
      "In DIPG: diffuse pontine enlargement on MRI without clear tumor margins, often with basilar artery encasement"
    ],
    signs: {
      left: [
        "Isolated CN VI palsy with mild diplopia",
        "Small focal tectal glioma with stable hydrocephalus after shunting",
        "Mild unilateral ataxia without other deficits",
        "Incidental finding on MRI with no symptoms",
        "Slow progression over months to years (low-grade focal glioma)"
      ],
      right: [
        "Rapid progression with multiple cranial nerve palsies and quadriparesis",
        "Brainstem herniation with Cushing triad (hypertension, bradycardia, irregular respirations)",
        "Complete loss of protective airway reflexes requiring intubation",
        "Locked-in syndrome (complete paralysis with preserved consciousness)",
        "Cardiorespiratory arrest from medullary compression"
      ]
    },
    medications: [
      {
        name: "Dexamethasone (Decadron)",
        type: "Glucocorticoid (potent synthetic corticosteroid)",
        action: "Potent glucocorticoid with minimal mineralocorticoid activity that reduces peritumoral vasogenic edema by stabilizing the blood-brain barrier, decreasing capillary permeability, and reducing the extravasation of plasma proteins into brain parenchyma. Inhibits phospholipase A2, reducing arachidonic acid production and downstream prostaglandin and leukotriene synthesis. Net effect is significant reduction in tumor-associated edema, leading to decreased intracranial pressure and improved neurological function. In DIPG, dexamethasone often produces dramatic but temporary improvement in cranial nerve function, motor strength, and level of consciousness.",
        sideEffects: "Short-term: hyperglycemia (steroid-induced diabetes requiring glucose monitoring and possible insulin), insomnia, mood changes (euphoria, irritability, psychosis), increased appetite and weight gain, gastric irritation. Long-term: Cushing syndrome (moon facies, central obesity, buffalo hump), osteoporosis, myopathy (proximal muscle weakness that may mimic tumor progression), immunosuppression with increased infection risk, adrenal suppression, growth suppression in children, avascular necrosis of femoral head, skin fragility, poor wound healing",
        contra: "Systemic fungal infections (at immunosuppressive doses); live vaccines during therapy; relative: uncontrolled diabetes, active peptic ulcer, untreated TB",
        pearl: "In DIPG, dexamethasone is used during radiation therapy and for symptomatic episodes of neurological deterioration -- use the lowest effective dose and taper as soon as clinically possible; steroid myopathy can mimic tumor progression (proximal weakness without new cranial nerve deficits suggests myopathy rather than tumor growth); in pediatric patients, monitor growth parameters, glucose, and mood closely; GI prophylaxis with H2 blocker or PPI during steroid therapy; NEVER abruptly discontinue after chronic use (>2 weeks) due to adrenal suppression risk"
      },
      {
        name: "Temozolomide (Temodar)",
        type: "Oral alkylating chemotherapy agent (imidazotetrazine derivative)",
        action: "Prodrug that undergoes spontaneous hydrolysis at physiological pH to form the active metabolite MTIC (5-(3-methyltriazen-1-yl)-imidazole-4-carboxamide), which methylates DNA at the O6 position of guanine, the N7 position of guanine, and the N3 position of adenine. O6-methylguanine is the most cytotoxic lesion, causing mispair with thymine during DNA replication and triggering futile cycles of mismatch repair that lead to DNA strand breaks and cell death. Temozolomide has excellent BBB penetration (approximately 35-40% of plasma concentration in CSF), making it suitable for CNS tumors. However, its efficacy is significantly reduced in tumors expressing MGMT (O6-methylguanine-DNA methyltransferase), which directly repairs O6-methylguanine lesions.",
        sideEffects: "Myelosuppression (dose-limiting -- neutropenia nadir at days 21-28, thrombocytopenia; requires CBC monitoring before each cycle), nausea and vomiting (moderate emetogenic potential -- requires antiemetic prophylaxis), fatigue, constipation, headache, lymphopenia (increases risk of Pneumocystis jirovecii pneumonia -- PCP prophylaxis with TMP-SMX required during and for 4 weeks after treatment)",
        contra: "Known hypersensitivity to dacarbazine (structural analog); severe bone marrow suppression (ANC <1500 or platelets <100,000 before each cycle); pregnancy (Category D teratogen)",
        pearl: "Used concurrently with radiation and as adjuvant therapy for high-grade gliomas (Stupp protocol); despite extensive clinical trial investigation, temozolomide has NOT shown significant survival benefit specifically in DIPG -- it is sometimes used off-label in combination with radiation based on adult glioblastoma data; dose: 75 mg/m2 daily during radiation, then 150-200 mg/m2 on days 1-5 of each 28-day cycle; mandatory PCP prophylaxis with TMP-SMX due to concurrent lymphopenia; take on empty stomach; MGMT promoter methylation status predicts response in adult glioblastoma but is less predictive in pediatric tumors"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Selective 5-HT3 serotonin receptor antagonist (antiemetic)",
        action: "Selectively blocks serotonin (5-HT3) receptors both peripherally on vagal nerve terminals in the GI tract and centrally in the chemoreceptor trigger zone (CTZ) and nucleus tractus solitarius in the brainstem. Prevents serotonin released from enterochromaffin cells in the intestinal mucosa (in response to chemotherapy, radiation, or surgical injury) from activating vagal afferents that trigger the vomiting reflex. Highly effective for chemotherapy-induced nausea and vomiting (CINV) and radiation-induced nausea, and also used for management of nausea from increased intracranial pressure in brain tumor patients.",
        sideEffects: "Headache (most common), constipation (exacerbated in brain tumor patients on opioids and with decreased mobility), QT prolongation (dose-dependent -- avoid in patients with pre-existing long QT syndrome or concurrent QT-prolonging medications), dizziness, transient elevation of hepatic transaminases",
        contra: "Known hypersensitivity; concurrent use with apomorphine (severe hypotension); congenital long QT syndrome; use with caution in patients on other QT-prolonging medications or with electrolyte abnormalities (hypokalemia, hypomagnesemia)",
        pearl: "Administer 30 minutes before chemotherapy or radiation for maximum antiemetic effect; IV dose: 0.15 mg/kg (max 16 mg) for high-emetogenic chemotherapy; oral: 4-8 mg every 8 hours; in brain tumor patients, nausea may be from increased ICP rather than treatment-related -- assess for other signs of elevated ICP (headache, papilledema, altered consciousness) and treat the underlying cause; single IV doses exceeding 16 mg increase QT prolongation risk and are no longer recommended; constipation management (stool softeners, adequate hydration) should be proactive in patients receiving ondansetron"
      }
    ],
    pearls: [
      "DIPG has a median survival of only 9-11 months -- it is one of the deadliest pediatric cancers with less than 10% 2-year survival; the RN must be prepared to provide palliative care support and family-centered end-of-life care",
      "The classic DIPG presentation triad is cranial nerve palsies (especially VI and VII), long tract signs (hemiparesis, hyperreflexia, Babinski), and cerebellar signs (ataxia, dysmetria) -- rapid progression over weeks in a school-age child should prompt urgent MRI",
      "Focal brainstem gliomas have a fundamentally different prognosis from DIPG -- well-circumscribed, low-grade focal tumors (especially tectal gliomas) may have >90% 10-year survival with appropriate management",
      "Swallowing assessment is CRITICAL in brainstem glioma patients -- involvement of CN IX and X causes loss of protective airway reflexes, and silent aspiration may occur without overt signs of coughing or choking during swallowing",
      "Steroid myopathy from chronic dexamethasone can mimic tumor progression (both cause weakness) -- the key distinguishing feature is that steroid myopathy causes PROXIMAL weakness without new cranial nerve deficits, while tumor progression typically shows new cranial nerve palsies or worsening of existing ones",
      "Monitor respiratory status vigilantly -- brainstem tumors can cause sudden respiratory arrest from compression of the medullary respiratory center, and patients may transition from normal breathing to apnea without warning",
      "Early palliative care integration is essential for DIPG -- studies show that early palliative care involvement improves quality of life, reduces emergency department visits, and supports families through the disease trajectory; palliative care is NOT synonymous with end-of-life care and should be initiated at diagnosis"
    ],
    quiz: [
      {
        question: "A 7-year-old child presents with a 3-week history of progressive diplopia, facial asymmetry, and unsteady gait. MRI shows diffuse expansion of the pons. Which diagnosis is most likely?",
        options: [
          "Medulloblastoma arising in the fourth ventricle",
          "Diffuse intrinsic pontine glioma (DIPG)",
          "Bacterial brainstem abscess",
          "Acute disseminated encephalomyelitis (ADEM)"
        ],
        correct: 1,
        rationale: "The classic presentation of DIPG includes the triad of cranial nerve palsies (diplopia from CN VI, facial asymmetry from CN VII), long tract signs, and cerebellar signs (unsteady gait) with rapid progression over weeks in a school-age child. The MRI showing diffuse pontine expansion confirms the diagnosis. Medulloblastoma arises in the posterior fossa (cerebellum/fourth ventricle) not within the pons itself. ADEM would show multifocal demyelinating lesions rather than a single diffuse pontine mass."
      },
      {
        question: "The nurse is caring for a child with DIPG who has difficulty swallowing. Which nursing action has the HIGHEST priority?",
        options: [
          "Encourage the child to eat more quickly before the food gets cold",
          "Place the child supine during meals to prevent aspiration",
          "Assess swallowing function before each oral intake and maintain aspiration precautions",
          "Offer only liquids since they are easier to swallow than solid foods"
        ],
        correct: 2,
        rationale: "Brainstem tumor involvement of cranial nerves IX (glossopharyngeal) and X (vagus) causes dysphagia with significant aspiration risk. The nurse must assess swallowing function before each oral intake, maintain aspiration precautions (upright positioning, thickened liquids as ordered, suction at bedside), and collaborate with speech-language pathology. Thin liquids are actually the HIGHEST aspiration risk for patients with neurological dysphagia. Supine positioning increases aspiration risk. Rushed eating also increases aspiration risk."
      },
      {
        question: "A nurse caring for a DIPG patient on chronic dexamethasone notes new proximal muscle weakness without changes in cranial nerve function. What should the nurse consider?",
        options: [
          "Tumor progression requiring emergent MRI and increased dexamethasone dose",
          "Steroid myopathy from chronic dexamethasone, which causes proximal weakness without new cranial nerve deficits",
          "Guillain-Barre syndrome requiring IVIG administration",
          "Spinal cord compression requiring surgical decompression"
        ],
        correct: 1,
        rationale: "Steroid myopathy is a common complication of chronic dexamethasone use, causing proximal muscle weakness (difficulty rising from a chair, climbing stairs) WITHOUT new cranial nerve deficits. This is distinguished from tumor progression, which typically presents with NEW or worsening cranial nerve palsies. Management of steroid myopathy involves tapering the dexamethasone dose to the lowest effective level. Increasing the steroid dose would worsen myopathy. The absence of new cranial nerve findings makes tumor progression less likely."
      }
    ]
  },

  "brainstem-stroke-syndromes-rn": {
    title: "Brainstem Stroke Syndromes",
    cellular: {
      title: "Vascular Anatomy and Pathophysiology of Brainstem Cerebrovascular Events",
      content: "Brainstem stroke syndromes represent a group of distinct clinical entities caused by ischemic or hemorrhagic events affecting specific regions of the brainstem (midbrain, pons, and medulla oblongata). The brainstem receives its blood supply from the vertebrobasilar arterial system: the two vertebral arteries (arising from the subclavian arteries) ascend through the transverse foramina of the cervical vertebrae and enter the skull through the foramen magnum, coursing along the ventral surface of the medulla. The vertebral arteries give off branches including the posterior inferior cerebellar artery (PICA) and the anterior spinal artery before merging at the pontomedullary junction to form the basilar artery. The basilar artery ascends along the ventral surface of the pons, giving off paired circumferential branches including the anterior inferior cerebellar artery (AICA) and the superior cerebellar artery (SCA), as well as numerous small perforating (paramedian and short circumferential) branches that supply the pontine tegmentum and basis pontis. At the upper border of the pons, the basilar artery bifurcates into the two posterior cerebral arteries (PCAs), completing the posterior circulation contribution to the Circle of Willis. Understanding this vascular anatomy is essential for predicting which brainstem structures will be affected by occlusion of specific arteries, and thus which clinical syndrome will result. Lateral medullary syndrome (Wallenberg syndrome) is the most common brainstem stroke syndrome, caused by occlusion of the PICA or, more commonly, the intracranial vertebral artery. The PICA supplies the lateral medulla, and ischemia to this region produces a characteristic constellation of findings: ipsilateral (same side as the lesion) facial pain and temperature loss (descending trigeminal nucleus and tract involvement), ipsilateral Horner syndrome (disruption of descending sympathetic fibers: miosis, ptosis, anhidrosis), ipsilateral cerebellar ataxia (inferior cerebellar peduncle and/or cerebellar hemisphere involvement), ipsilateral palatal and vocal cord paralysis (nucleus ambiguus involvement causing dysphagia, dysarthria, hoarseness, and absent gag reflex -- representing the most dangerous acute complication due to aspiration risk), and CONTRALATERAL (opposite side) loss of pain and temperature sensation of the body (spinothalamic tract involvement -- the tract has already crossed at the spinal cord level). Critically, the corticospinal tract (which runs in the ventral medullary pyramid) is SPARED in lateral medullary syndrome, so motor strength is preserved -- there is NO hemiparesis. The combination of ipsilateral facial sensory loss with contralateral body sensory loss creates a 'crossed' pattern that is pathognomonic for lateral brainstem lesions. Medial medullary syndrome (Dejerine syndrome) results from occlusion of the anterior spinal artery or paramedian branches of the vertebral artery, affecting the medial medulla. This produces: contralateral hemiparesis (corticospinal tract, which is in the medullary pyramid and has NOT yet crossed -- the decussation of the pyramids occurs at the cervicomedullary junction), contralateral loss of proprioception and vibration (medial lemniscus involvement -- these fibers have already crossed in the lower medulla), and ipsilateral tongue deviation (hypoglossal nerve or nucleus involvement -- the tongue deviates toward the side of the lesion because the ipsilateral genioglossus muscle is paralyzed). Lateral pontine syndrome (affecting the lateral pons from AICA or short circumferential branch occlusion) produces ipsilateral facial paralysis (CN VII nucleus or fascicle), ipsilateral hearing loss (CN VIII cochlear nucleus involvement), ipsilateral cerebellar ataxia (middle cerebellar peduncle), ipsilateral facial pain/temperature loss (trigeminal sensory nucleus), and contralateral body pain/temperature loss (spinothalamic tract). AICA occlusion may also cause labyrinthine artery territory ischemia, producing acute vertigo, nystagmus, and unilateral hearing loss that can mimic peripheral vestibular disease. Medial pontine syndrome (from basilar artery perforating branch occlusion) affects the basis pontis and causes contralateral hemiparesis (corticospinal tract), contralateral loss of proprioception/vibration (medial lemniscus), and ipsilateral lateral rectus palsy (CN VI nucleus or fascicle) with possible internuclear ophthalmoplegia (medial longitudinal fasciculus involvement). The most catastrophic pontine stroke is basilar artery thrombosis producing bilateral pontine infarction, which can cause locked-in syndrome -- complete paralysis of all voluntary muscles except vertical eye movements and blinking, with fully preserved consciousness. Patients with locked-in syndrome are aware and cognitively intact but can only communicate through vertical eye movements or eyelid blinking, representing one of the most devastating neurological conditions. Weber syndrome (midbrain medial syndrome) results from PCA perforating branch or basilar tip occlusion affecting the cerebral peduncle and CN III fascicle, producing ipsilateral CN III palsy (dilated pupil, ptosis, eye deviated down and out) with contralateral hemiparesis. Benedikt syndrome (midbrain tegmentum) adds contralateral tremor and involuntary movements from red nucleus involvement. The diagnostic approach to brainstem stroke begins with emergent neuroimaging. CT head is performed first to exclude hemorrhage but has poor sensitivity for brainstem ischemia in the acute setting. MRI with diffusion-weighted imaging (DWI) is the gold standard for detecting acute brainstem infarction, showing restricted diffusion (bright on DWI, dark on ADC map) within minutes of symptom onset. CT angiography or MR angiography of the head and neck evaluates the vertebrobasilar vasculature for occlusion, stenosis, or dissection. Time-critical treatment decisions follow the same principles as hemispheric stroke: IV alteplase (tPA) within 4.5 hours of symptom onset for ischemic stroke, with endovascular thrombectomy for basilar artery occlusion increasingly supported by trial evidence (ATTENTION and BAOCHE trials demonstrating benefit up to 24 hours from onset). The RN's role in brainstem stroke care is critical: rapid neurological assessment using the NIH Stroke Scale, recognition of posterior circulation stroke symptoms (which may be misdiagnosed as peripheral vestibular disease, intoxication, or psychiatric conditions), immediate airway management (brainstem strokes frequently compromise protective airway reflexes), hemodynamic monitoring (blood pressure management per acute stroke protocols), and coordination of time-sensitive interventions including IV thrombolysis and endovascular therapy. Post-acute nursing care focuses on dysphagia assessment and aspiration prevention (the most common cause of morbidity in lateral medullary syndrome), rehabilitation coordination, secondary stroke prevention, and patient education."
    },
    riskFactors: [
      "Vertebral artery atherosclerosis (most common cause of brainstem strokes; risk factors include hypertension, diabetes, hyperlipidemia, and smoking)",
      "Vertebral or basilar artery dissection (especially in younger patients; may be spontaneous or related to neck trauma, chiropractic manipulation, or connective tissue disorders)",
      "Atrial fibrillation (cardioembolism to the posterior circulation, including the basilar artery and its branches)",
      "Hypertension (both as a risk factor for atherosclerosis and as a direct cause of small vessel disease affecting brainstem perforating arteries)",
      "Diabetes mellitus (accelerated atherosclerosis and small vessel disease increasing risk of lacunar brainstem infarctions)",
      "Vertebrobasilar dolichoectasia (elongation and dilation of the vertebrobasilar arteries, associated with compression of adjacent structures and increased risk of thrombosis)",
      "Hypercoagulable states (antiphospholipid syndrome, factor V Leiden, protein C/S deficiency -- risk of thrombosis in vertebrobasilar system)"
    ],
    diagnostics: [
      "CT head without contrast (FIRST study -- rapidly excludes hemorrhage, but has poor sensitivity for acute brainstem ischemia due to bone artifact in the posterior fossa)",
      "MRI brain with DWI (gold standard for acute brainstem infarction -- diffusion-weighted imaging shows restricted diffusion within minutes of onset; essential when CT is negative but clinical suspicion is high)",
      "CT angiography of head and neck (evaluates vertebral and basilar artery patency, detects occlusion, stenosis, dissection, or aneurysm; faster than MRA in the acute setting)",
      "MR angiography (non-invasive evaluation of vertebrobasilar vasculature; useful for follow-up imaging and in patients with contraindications to iodinated contrast)",
      "NIH Stroke Scale assessment (though originally designed for anterior circulation strokes, it captures some posterior circulation deficits; some brainstem strokes may have deceptively low NIHSS scores despite severe disability)",
      "ECG and cardiac monitoring (detect atrial fibrillation as embolic source; at least 24 hours of continuous cardiac monitoring, extended monitoring if initial workup is non-revealing)",
      "Laboratory studies (CBC, metabolic panel, coagulation studies, lipid panel, HbA1c, ESR/CRP, hypercoagulability workup in younger patients or those without traditional risk factors)"
    ],
    management: [
      "IV alteplase (tPA) within 4.5 hours of symptom onset for acute ischemic brainstem stroke (same criteria as anterior circulation stroke; blood pressure must be <185/110 before administration)",
      "Endovascular thrombectomy for basilar artery occlusion (ATTENTION and BAOCHE trials support thrombectomy up to 24 hours from symptom onset; rapidly evolving standard of care)",
      "Airway protection and intubation for patients with compromised protective reflexes (CN IX/X dysfunction) or decreased level of consciousness (brainstem strokes frequently require airway management)",
      "Blood pressure management per acute stroke protocols (permissive hypertension up to 220/120 in non-thrombolyzed patients; <180/105 for 24 hours after tPA administration)",
      "Antiplatelet therapy (aspirin 325 mg within 24-48 hours for non-cardioembolic stroke; dual antiplatelet with aspirin + clopidogrel for 21 days in minor stroke/TIA per CHANCE/POINT trials)",
      "Anticoagulation with heparin or warfarin/DOAC for cardioembolic stroke or vertebral/basilar artery dissection (timing depends on infarct size and hemorrhagic transformation risk)"
    ],
    nursingActions: [
      "Perform rapid focused neurological assessment: level of consciousness, pupil reactivity, extraocular movements, facial symmetry, limb strength, sensation pattern, cerebellar function (finger-to-nose, heel-to-shin), speech, and swallowing -- document 'last known well' time for thrombolysis eligibility determination",
      "Assess for 'crossed' findings pathognomonic for brainstem lesions: ipsilateral cranial nerve deficits with contralateral body motor or sensory deficits (e.g., ipsilateral facial numbness with contralateral body numbness suggests lateral brainstem infarction)",
      "Maintain airway patency and assess protective reflexes (gag, cough, swallow) -- brainstem strokes frequently compromise CN IX and X, eliminating protective airway reflexes and creating high aspiration risk; keep suction at bedside and prepare for potential intubation",
      "Keep NPO until formal swallowing assessment by speech-language pathology (aspiration is the leading cause of morbidity and mortality in lateral medullary syndrome; silent aspiration may occur without coughing)",
      "Perform neurological checks every 15 minutes during acute phase, every 1 hour for the first 24 hours, then every 2-4 hours -- escalating deficits may indicate stroke progression, re-occlusion, or hemorrhagic conversion requiring emergent intervention",
      "Monitor continuous ECG for atrial fibrillation (detected in 20-25% of cryptogenic strokes with extended monitoring; new AF detection changes management from antiplatelet to anticoagulation)",
      "Monitor blood pressure closely per stroke protocol: permissive hypertension (allow up to 220/120) if no thrombolytics given; strict control (<180/105) for 24 hours post-tPA; avoid precipitous drops that could worsen brainstem ischemia",
      "Educate patient and family about stroke symptoms, secondary prevention (medication adherence, risk factor modification), and rehabilitation expectations"
    ],
    assessmentFindings: [
      "Crossed sensory or motor findings (ipsilateral cranial nerve deficit with contralateral body deficit -- hallmark of brainstem lesion distinguishing it from hemispheric stroke)",
      "Acute vertigo, nystagmus, and ataxia (posterior circulation TIA or stroke -- often misdiagnosed as peripheral vestibular disease; the HINTS exam helps distinguish central from peripheral causes)",
      "Dysphagia and dysarthria (CN IX/X involvement -- most common in lateral medullary syndrome; creates significant aspiration risk)",
      "Horner syndrome (ipsilateral miosis, ptosis, anhidrosis -- from disruption of descending sympathetic tract, classically seen in lateral medullary syndrome)",
      "Diplopia and oculomotor abnormalities (CN III, IV, or VI palsies; internuclear ophthalmoplegia from MLF involvement; one-and-a-half syndrome)",
      "Acute hearing loss with vertigo (AICA territory stroke affecting CN VIII and labyrinthine artery)",
      "Altered level of consciousness or coma (bilateral pontine or extensive brainstem infarction; reticular activating system involvement)"
    ],
    signs: {
      left: [
        "Isolated vertigo and mild ataxia (may represent TIA)",
        "Unilateral Horner syndrome with mild dysphagia",
        "Small perforating artery lacunar infarct with limited deficits",
        "Transient diplopia resolving within hours",
        "Mild dysarthria without airway compromise"
      ],
      right: [
        "Locked-in syndrome (bilateral pontine infarction -- quadriplegia with preserved consciousness)",
        "Basilar artery thrombosis with progressive obtundation and bilateral deficits",
        "Complete loss of protective airway reflexes requiring emergent intubation",
        "Brainstem herniation from cerebellar edema compressing the brainstem",
        "Cardiorespiratory arrest from bilateral medullary infarction"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Recombinant tissue plasminogen activator (fibrinolytic/thrombolytic)",
        action: "Binds to fibrin within the thrombus and converts fibrin-bound plasminogen to plasmin, the active serine protease that degrades fibrin meshwork holding the clot together. This causes dissolution of the occluding thrombus and restoration of blood flow through the affected vessel. Alteplase has relative fibrin specificity, meaning it preferentially activates plasminogen bound to fibrin clots rather than circulating free plasminogen, reducing (but not eliminating) systemic fibrinolysis. In brainstem stroke, timely thrombolysis can restore perfusion to critical brainstem structures and reverse neurological deficits.",
        sideEffects: "Intracranial hemorrhage (most serious -- symptomatic ICH occurs in approximately 6% of treated ischemic stroke patients; risk increases with larger infarct volume, higher NIHSS score, and advanced age), systemic hemorrhage, angioedema (orolingual edema -- more common in patients on ACE inhibitors), allergic reactions",
        contra: "Active internal bleeding; recent (within 3 months) intracranial surgery, serious head trauma, or previous stroke; known intracranial neoplasm, AVM, or aneurysm; bleeding diathesis (INR >1.7, platelet count <100,000, aPTT >40); blood pressure >185/110 despite treatment; blood glucose <50 mg/dL; CT showing hemorrhage or large established infarct",
        pearl: "Dose: 0.9 mg/kg (max 90 mg) IV, with 10% given as bolus over 1 minute and remaining 90% infused over 60 minutes; must be administered within 4.5 hours of symptom onset (last known well time); do NOT administer antiplatelet or anticoagulant therapy for 24 hours after tPA; frequent neurological checks (every 15 minutes during infusion, every 30 minutes for 6 hours, then hourly for 18 hours); any neurological deterioration during or after infusion should prompt IMMEDIATE cessation of infusion and emergent CT to rule out hemorrhagic conversion; blood pressure must be maintained <180/105 for 24 hours after administration"
      },
      {
        name: "Aspirin (Acetylsalicylic Acid)",
        type: "Antiplatelet agent (irreversible cyclooxygenase inhibitor)",
        action: "Irreversibly acetylates cyclooxygenase-1 (COX-1) in platelets, permanently blocking the synthesis of thromboxane A2 (TXA2), a potent platelet aggregator and vasoconstrictor. Since platelets are anucleate and cannot synthesize new COX-1, the antiplatelet effect persists for the entire 7-10 day lifespan of the platelet. Aspirin reduces secondary stroke risk by 15-20% through inhibition of platelet-mediated thrombus formation at sites of atherosclerotic plaque rupture or endothelial injury. In acute ischemic stroke, early aspirin (within 24-48 hours) reduces the risk of early recurrent stroke and improves long-term outcomes.",
        sideEffects: "GI effects (dyspepsia, gastric erosions, GI bleeding -- especially with higher doses), increased bleeding risk, tinnitus (salicylism with toxic levels), Reye syndrome in children with viral illness (contraindicated in children <16 with febrile illness), aspirin-exacerbated respiratory disease (bronchospasm in patients with aspirin-sensitive asthma/nasal polyps/urticaria triad)",
        contra: "Known aspirin allergy or aspirin-exacerbated respiratory disease; active peptic ulcer disease or GI bleeding; within 24 hours of tPA administration for stroke; severe hepatic impairment; last trimester of pregnancy (premature closure of ductus arteriosus)",
        pearl: "For acute ischemic stroke: 160-325 mg within 24-48 hours of onset (but NOT within 24 hours of tPA administration); for long-term secondary prevention: 81-325 mg daily (low-dose 81 mg preferred for long-term use due to lower GI bleeding risk with similar efficacy); dual antiplatelet therapy (aspirin + clopidogrel) for 21 days is recommended for minor stroke or high-risk TIA per CHANCE/POINT trial data, followed by single antiplatelet thereafter; administer with food to reduce GI irritation"
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct oral anticoagulant (DOAC; factor Xa inhibitor)",
        action: "Directly and selectively inhibits both free and clot-bound factor Xa, a serine protease that occupies a pivotal position in the coagulation cascade at the convergence of the intrinsic and extrinsic pathways. Factor Xa is the catalytic component of the prothrombinase complex (Xa-Va-Ca-phospholipid) that converts prothrombin to thrombin. By inhibiting factor Xa, apixaban reduces thrombin generation, decreasing fibrin formation and reducing thrombus growth. Used for stroke prevention in non-valvular atrial fibrillation, which is a common cause of cardioembolic brainstem stroke.",
        sideEffects: "Bleeding (most significant -- GI bleeding, intracranial hemorrhage lower than with warfarin in clinical trials), bruising, anemia, nausea; no routine monitoring required (advantage over warfarin)",
        contra: "Active pathological bleeding; prosthetic heart valves (use warfarin instead); severe hepatic impairment with coagulopathy; concurrent use of strong dual CYP3A4 and P-gp inhibitors (ketoconazole, ritonavir) or inducers (rifampin, carbamazepine, phenytoin)",
        pearl: "Preferred anticoagulant for AF-related stroke prevention over warfarin based on ARISTOTLE trial data (superior efficacy with lower bleeding and mortality); dose: 5 mg BID (reduce to 2.5 mg BID if patient meets 2 of 3 criteria: age >80, weight <60 kg, creatinine >1.5); timing of initiation after stroke depends on infarct size (small stroke: 1-3 days, moderate: 3-7 days, large: 7-14 days; based on hemorrhagic transformation risk); reversal agent andexanet alfa (Andexxa) is available for life-threatening bleeding; unlike warfarin, no dietary restrictions and no routine INR monitoring needed"
      }
    ],
    pearls: [
      "Crossed findings (ipsilateral cranial nerve deficit + contralateral body deficit) are the hallmark of brainstem stroke -- this pattern is impossible with hemispheric lesions and should immediately localize the problem to the brainstem",
      "Lateral medullary syndrome (Wallenberg) is the most common brainstem stroke syndrome -- the most dangerous acute complication is ASPIRATION due to CN IX/X dysfunction; keep the patient NPO until formal swallowing assessment is completed",
      "Acute vertigo, nystagmus, and ataxia may represent posterior circulation stroke rather than benign peripheral vertigo -- the HINTS exam (Head Impulse test, direction-changing Nystagmus, Test of Skew) performed by a trained examiner is more sensitive than MRI in the first 24 hours for distinguishing central from peripheral causes",
      "Locked-in syndrome from bilateral pontine infarction preserves consciousness but eliminates all voluntary movement except vertical eye movements and blinking -- patients are fully aware and cognitively intact; communicate using vertical eye movement-based systems",
      "Basilar artery occlusion is a life-threatening emergency -- endovascular thrombectomy is now supported by trial evidence (ATTENTION, BAOCHE) up to 24 hours from symptom onset and should be considered for all eligible patients",
      "Brainstem strokes may have deceptively low NIH Stroke Scale scores because the NIHSS was designed primarily for anterior circulation strokes -- a patient with severe brainstem dysfunction (bilateral deficits, dysphagia, respiratory compromise) may score only 4-5 on the NIHSS, potentially leading to underestimation of severity",
      "Monitor respiratory status meticulously in brainstem stroke patients -- both the respiratory center (medulla) and the protective airway reflexes (CN IX/X) are at risk; patients may require emergent intubation for airway protection even with preserved consciousness"
    ],
    quiz: [
      {
        question: "A patient presents with acute onset ipsilateral Horner syndrome, ipsilateral facial numbness, contralateral body pain/temperature loss, dysphagia, hoarseness, and ipsilateral ataxia. Motor strength is preserved. Which brainstem stroke syndrome is this?",
        options: [
          "Medial medullary syndrome (Dejerine syndrome) from anterior spinal artery occlusion",
          "Lateral medullary syndrome (Wallenberg syndrome) from PICA or vertebral artery occlusion",
          "Weber syndrome from posterior cerebral artery occlusion",
          "Locked-in syndrome from basilar artery thrombosis"
        ],
        correct: 1,
        rationale: "This is a classic presentation of lateral medullary syndrome (Wallenberg syndrome): ipsilateral Horner syndrome (descending sympathetics), ipsilateral facial numbness (descending trigeminal), contralateral body pain/temperature loss (spinothalamic tract), dysphagia and hoarseness (nucleus ambiguus -- CN IX/X), and ipsilateral ataxia (inferior cerebellar peduncle). Crucially, motor strength is PRESERVED because the corticospinal tract (in the ventral medullary pyramid) is NOT involved in lateral medullary lesions."
      },
      {
        question: "What is the HIGHEST priority nursing action for a patient admitted with lateral medullary syndrome?",
        options: [
          "Initiate physical therapy for gait training due to ataxia",
          "Maintain NPO status and assess swallowing function -- aspiration from CN IX/X dysfunction is the most dangerous acute complication",
          "Apply eye patch for diplopia from CN VI palsy",
          "Administer IV dexamethasone for cerebral edema"
        ],
        correct: 1,
        rationale: "In lateral medullary syndrome, involvement of the nucleus ambiguus (CN IX and X) causes dysphagia and impaired protective airway reflexes, making aspiration the most dangerous acute complication and leading cause of morbidity/mortality. The patient must be kept NPO until a formal swallowing assessment is completed by speech-language pathology. Silent aspiration (aspiration without coughing) may occur because the cough reflex is also impaired. Suction should be at bedside and the head of bed should be elevated."
      },
      {
        question: "A patient with acute basilar artery occlusion has a NIH Stroke Scale score of only 5, but has bilateral motor deficits, dysphagia, and fluctuating consciousness. How should the nurse interpret this finding?",
        options: [
          "The low NIHSS score indicates this is a minor stroke that does not require urgent intervention",
          "The NIHSS underestimates posterior circulation stroke severity -- the clinical findings indicate a life-threatening emergency requiring emergent intervention regardless of the score",
          "The score confirms this is a transient ischemic attack that will resolve spontaneously",
          "The discrepancy suggests the patient is malingering and psychiatry should be consulted"
        ],
        correct: 1,
        rationale: "The NIH Stroke Scale was designed primarily for anterior (carotid) circulation strokes and significantly underestimates the severity of posterior circulation (vertebrobasilar) strokes. A patient with basilar artery occlusion may have life-threatening bilateral deficits, dysphagia, respiratory compromise, and fluctuating consciousness but score low on the NIHSS. Clinical judgment must prevail over the score -- basilar artery occlusion is a neurovascular emergency requiring emergent intervention (thrombolysis and/or thrombectomy) regardless of the NIHSS score."
      }
    ]
  }
};

let ok = 0, fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++; else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} failed`);
