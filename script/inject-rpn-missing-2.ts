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
  console.log(`  NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {
  "abdominal-assessment": {
    title: "Abdominal Assessment Fundamentals",
    cellular: {
      title: "Anatomy, Physiology, and Systematic Assessment of the Abdomen",
      content: "Abdominal assessment is a core clinical skill that requires a systematic approach different from all other body system assessments. The abdomen contains organs from the gastrointestinal, urinary, reproductive, and vascular systems, making comprehensive assessment essential for identifying a wide range of pathologies. The abdominal cavity extends from the diaphragm superiorly to the pelvic brim inferiorly and is lined by the peritoneum, a serous membrane consisting of parietal (lining the abdominal wall) and visceral (covering the organs) layers. The potential space between these layers contains a small amount of serous fluid that reduces friction during organ movement. Inflammation of the peritoneum (peritonitis) is a surgical emergency that produces severe abdominal rigidity, rebound tenderness, and absent bowel sounds. For clinical assessment, the abdomen is divided into four quadrants using two imaginary perpendicular lines intersecting at the umbilicus. The right upper quadrant (RUQ) contains the liver, gallbladder, duodenum, head of pancreas, right kidney and adrenal gland, and hepatic flexure of the colon. The left upper quadrant (LUQ) contains the stomach, spleen, tail of pancreas, left kidney and adrenal gland, and splenic flexure of the colon. The right lower quadrant (RLQ) contains the cecum, appendix, ascending colon, right ovary and fallopian tube in females, and right ureter. The left lower quadrant (LLQ) contains the sigmoid colon, descending colon, left ovary and fallopian tube in females, and left ureter. Alternatively, nine regions (right and left hypochondriac, epigastric, right and left lumbar, umbilical, right and left iliac, and hypogastric/suprapubic) provide more precise anatomical localization for documentation. The critical distinction of abdominal assessment is the sequence: inspection, auscultation, percussion, and palpation -- abbreviated as IAPP. This sequence differs from all other body system assessments (which follow inspection, palpation, percussion, auscultation). Auscultation MUST be performed BEFORE percussion and palpation because physical manipulation of the abdomen stimulates peristalsis and can alter bowel sounds, producing false findings. This sequence must never be violated. Inspection begins with the patient supine, arms at sides, knees slightly flexed to relax the abdominal musculature. The practical nurse observes the abdomen from the side (tangential view) and from above, noting contour (flat, rounded, scaphoid/concave, or distended), symmetry, visible peristalsis (may indicate bowel obstruction if visible in adults), pulsations (visible aortic pulsation may suggest abdominal aortic aneurysm), skin changes (striae, scars, ecchymoses, spider angiomata, caput medusae), hernias, and the umbilicus (normally midline, inverted; eversion may indicate ascites or increased intra-abdominal pressure). Grey Turner sign (bluish discoloration of the flanks) and Cullen sign (periumbilical bluish discoloration) indicate retroperitoneal hemorrhage, classically associated with hemorrhagic pancreatitis but also seen with ruptured abdominal aortic aneurysm or ruptured ectopic pregnancy. Auscultation is performed using the diaphragm of the stethoscope in all four quadrants. Normal bowel sounds occur every 5 to 15 seconds and are described as intermittent, high-pitched gurgling or clicking sounds. The practical nurse should listen for at least 2 to 5 minutes in each quadrant before documenting absent bowel sounds, as premature documentation of absent sounds is a common error. Hyperactive bowel sounds (loud, frequent, high-pitched rushing sounds called borborygmi) may indicate early bowel obstruction, gastroenteritis, diarrhea, or the onset of hunger. Hypoactive bowel sounds (infrequent, diminished sounds) may indicate post-surgical ileus, peritonitis, or late bowel obstruction. Absent bowel sounds (no sounds heard after 5 minutes of continuous listening in each quadrant) suggest paralytic ileus or peritonitis. Bruits (vascular sounds caused by turbulent blood flow) should be assessed over the aorta (epigastric region) and renal arteries (slightly lateral to the midline); their presence may indicate aortic aneurysm, renal artery stenosis, or other vascular abnormalities. Percussion is performed systematically in all quadrants to assess organ size, detect fluid, and identify masses. Normal abdominal percussion produces tympany (a hollow, drum-like sound) over gas-filled structures (stomach, intestines) and dullness over solid organs (liver, spleen) and fluid-filled structures (full bladder). Shifting dullness and fluid wave tests are used to detect ascites (free peritoneal fluid): in shifting dullness, tympany is noted centrally with dullness in the flanks that shifts when the patient is turned to the side. Liver span is assessed by percussing along the right midclavicular line, identifying the transition from lung resonance to liver dullness superiorly and from liver dullness to bowel tympany inferiorly; normal liver span is 6 to 12 cm. Splenic percussion is performed at the lowest left intercostal space in the anterior axillary line; dullness suggests splenomegaly. Palpation is performed last, beginning with light palpation (using fingerpads with approximately 1 cm depth) in all four quadrants to assess surface tenderness, muscle resistance, and superficial masses. The practical nurse should always begin palpation AWAY from the area of reported pain to avoid causing guarding that would limit the examination. Deep palpation (4-5 cm depth) follows to assess deeper structures and organ borders. Key findings include guarding (voluntary or involuntary muscle contraction in response to palpation -- voluntary guarding can be overcome with relaxation techniques, while involuntary guarding/rigidity suggests peritoneal irritation), rebound tenderness (sharp pain when the examiner quickly releases pressure -- positive Blumberg sign indicates peritoneal inflammation), and specific point tenderness. Several named clinical signs are assessed during abdominal palpation: Murphy sign (inspiratory arrest during RUQ palpation suggesting acute cholecystitis), McBurney point tenderness (pain at one-third the distance from the anterior superior iliac spine to the umbilicus suggesting appendicitis), Rovsing sign (palpation of the LLQ produces pain in the RLQ, suggesting appendicitis), psoas sign (pain with passive extension of the right hip suggesting retrocecal appendicitis), and obturator sign (pain with internal rotation of the flexed right hip suggesting pelvic appendicitis). Accurate documentation of abdominal assessment findings using precise anatomical terminology is essential for communicating clinical information and tracking changes over time."
    },
    riskFactors: [
      "Inaccurate assessment sequence (performing palpation before auscultation alters bowel sounds and produces unreliable findings)",
      "Patient anxiety or inability to relax abdominal muscles (cold hands, failure to warm stethoscope, inadequate patient positioning)",
      "Obesity (limits ability to palpate deep structures and may obscure visual findings during inspection)",
      "Previous abdominal surgery (adhesions alter normal anatomy, scars may indicate surgical history relevant to current assessment)",
      "Acute abdominal pain (may limit examination due to guarding; always palpate the painful area LAST)",
      "Ascites (large fluid volumes distort normal findings, may mask underlying masses or organomegaly)",
      "Premature documentation of absent bowel sounds (must listen continuously for 5 minutes per quadrant before concluding sounds are absent)"
    ],
    diagnostics: [
      "Systematic four-quadrant auscultation with documentation of bowel sound character and frequency (normal 5-15 sounds per minute; listen minimum 2-5 minutes before concluding absent)",
      "Percussion mapping of liver span along right midclavicular line (normal 6-12 cm; enlarged liver suggests hepatomegaly from multiple etiologies)",
      "Light and deep palpation in all four quadrants documenting tenderness location, guarding type (voluntary versus involuntary), and any masses",
      "Special maneuvers as indicated: Murphy sign (cholecystitis), McBurney point (appendicitis), Rovsing sign (appendicitis), shifting dullness and fluid wave (ascites)",
      "Measurement of abdominal girth at the umbilicus with consistent positioning (serial measurements track ascites progression or resolution)",
      "Visual inspection for Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) indicating retroperitoneal hemorrhage",
      "Assessment of bowel sounds post-operatively to monitor return of peristalsis (indicator for advancement of diet)"
    ],
    management: [
      "Report abnormal findings promptly to the physician or nurse practitioner using SBAR communication format",
      "Position patient supine with knees slightly flexed and arms at sides to optimize abdominal muscle relaxation during assessment",
      "Perform serial abdominal assessments at prescribed intervals for patients with acute abdominal conditions (document changes from baseline)",
      "Maintain NPO status as ordered for patients with absent bowel sounds, suspected bowel obstruction, or peritonitis",
      "Implement comfort measures for patients with abdominal pain (positioning, ice/heat application as ordered, pain medication administration)",
      "Monitor and document intake and output including nasogastric tube output, drain output, and stool characteristics"
    ],
    nursingActions: [
      "Perform abdominal assessment using correct IAPP sequence: Inspection, Auscultation, Percussion, Palpation -- NEVER palpate or percuss before auscultating",
      "Warm hands and stethoscope before beginning assessment to prevent voluntary guarding from cold stimulus",
      "Begin palpation away from reported pain to avoid inducing guarding that limits the entire examination",
      "Document findings using precise anatomical quadrant terminology (RUQ, LUQ, RLQ, LLQ) rather than vague descriptions",
      "Measure and document abdominal girth at the umbilicus with patient supine, marking the measurement site with a skin marker for consistency",
      "Assess bowel sounds postoperatively every 4 hours and report return of bowel sounds (indicator for diet progression)",
      "Report and document any new findings of guarding, rigidity, rebound tenderness, or distension immediately as these may indicate surgical emergency",
      "Ensure bladder is empty before abdominal assessment (full bladder creates suprapubic dullness and tenderness that may be misinterpreted)"
    ],
    assessmentFindings: [
      "Bowel sound character and frequency in all four quadrants (normal: 5-15 per minute; hyperactive: loud, frequent, rushing; hypoactive: infrequent, quiet; absent: none after 5 minutes per quadrant)",
      "Abdominal contour on inspection (flat, rounded, scaphoid, or distended -- new distension is a significant finding)",
      "Presence or absence of voluntary and involuntary guarding on palpation (involuntary guarding/rigidity = peritoneal irritation = urgent finding)",
      "Rebound tenderness (Blumberg sign) positive or negative (indicates peritoneal inflammation)",
      "Specific point tenderness with anatomical location documented (e.g., McBurney point tenderness in RLQ)",
      "Percussion findings (tympany versus dullness distribution, liver span measurement, evidence of shifting dullness for ascites)",
      "Presence of bruits over aorta or renal arteries on auscultation"
    ],
    signs: {
      left: [
        "Mild tenderness to palpation in one quadrant",
        "Slightly hyperactive bowel sounds",
        "Mild abdominal distension",
        "Voluntary guarding (overcomes with relaxation)",
        "Positive Murphy sign on deep palpation"
      ],
      right: [
        "Board-like rigidity (involuntary guarding) across abdomen",
        "Absent bowel sounds (after 5 minutes per quadrant)",
        "Severe rebound tenderness (peritonitis)",
        "Grey Turner or Cullen sign (retroperitoneal hemorrhage)",
        "Visible peristaltic waves in adult (bowel obstruction)"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (selective 5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors at vagal nerve terminals in the GI tract and in the chemoreceptor trigger zone of the medulla oblongata, preventing serotonin-mediated activation of the vomiting reflex; effective for nausea and vomiting associated with acute abdominal conditions without affecting GI motility assessment",
        sideEffects: "Headache (most common), constipation, dizziness, dose-dependent QT prolongation, serotonin syndrome when combined with other serotonergic agents",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine; severe hepatic impairment (maximum 8 mg/day); caution with other QT-prolonging medications",
        pearl: "Maximum single IV dose is 16 mg due to dose-dependent QT prolongation risk; does NOT affect gastric motility (unlike metoclopramide) so it will not mask assessment findings related to bowel function; obtain baseline ECG in patients with cardiac history before initiating"
      },
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system, inhibiting ascending pain pathways and altering perception and emotional response to pain; provides effective analgesia for severe acute abdominal pain allowing more thorough physical examination",
        sideEffects: "Respiratory depression (monitor rate <12), hypotension, nausea and vomiting, constipation, urinary retention, pruritus, sedation, miosis",
        contra: "Severe respiratory depression or acute bronchospasm; paralytic ileus; concurrent MAO inhibitor use within 14 days; known hypersensitivity; head injury with increased ICP",
        pearl: "Current evidence supports early opioid analgesia for acute abdominal pain -- withholding pain relief does NOT improve diagnostic accuracy and causes unnecessary suffering; always assess respiratory rate and sedation level before each dose; have naloxone (0.4 mg IV) at bedside as reversal agent"
      },
      {
        name: "Simethicone (Gas-X)",
        type: "Antiflatulent (surfactant/defoaming agent)",
        action: "Reduces surface tension of gas bubbles in the GI tract, allowing smaller bubbles to coalesce into larger ones that are more easily expelled through belching or passage; acts locally within the GI lumen without systemic absorption; relieves bloating, pressure, and discomfort from excess gas accumulation",
        sideEffects: "Essentially none -- simethicone is not absorbed systemically; very rarely may cause mild diarrhea or nausea",
        contra: "No known absolute contraindications; generally recognized as safe (GRAS) even in pregnancy and lactation; avoid in known hypersensitivity to any component",
        pearl: "Safe to administer before abdominal imaging (reduces gas artifact) and before endoscopic procedures; can be given with antacids for combined acid and gas relief; chewable tablets should be chewed thoroughly before swallowing for maximum effectiveness; available over-the-counter but document administration when given in clinical settings"
      }
    ],
    pearls: [
      "The abdominal assessment sequence IAPP (Inspect, Auscultate, Percuss, Palpate) is different from every other body system -- auscultation MUST come before percussion and palpation to avoid stimulating peristalsis and producing false bowel sound findings",
      "You must listen for a MINIMUM of 5 continuous minutes in each quadrant before documenting absent bowel sounds -- premature documentation of absent sounds is one of the most common assessment errors",
      "Always begin palpation AWAY from the area of reported pain and work toward it last -- starting at the painful area causes guarding that will limit the entire remaining examination",
      "Grey Turner sign (flank bruising) and Cullen sign (periumbilical bruising) are late signs of retroperitoneal hemorrhage -- classically associated with hemorrhagic pancreatitis but also seen with ruptured AAA and ectopic pregnancy; these are urgent findings requiring immediate reporting",
      "Board-like rigidity (involuntary guarding that cannot be overcome) with rebound tenderness and absent bowel sounds is the classic triad of peritonitis -- this is a surgical emergency requiring immediate physician notification",
      "Murphy sign (inspiratory arrest during RUQ palpation) is 97% specific for acute cholecystitis -- ask the patient to take a deep breath while palpating the RUQ; positive when the patient suddenly stops inspiring due to pain as the inflamed gallbladder contacts the examiner's hand",
      "Post-operative bowel sound return follows a predictable pattern: small bowel motility returns within 6-12 hours, gastric motility within 12-24 hours, and colonic motility within 24-72 hours -- the presence of flatus is the most reliable indicator that colonic motility has returned"
    ],
    quiz: [
      {
        question: "A practical nurse is performing an abdominal assessment on a patient complaining of right lower quadrant pain. What is the CORRECT sequence for the abdominal assessment?",
        options: [
          "Inspection, palpation, percussion, auscultation",
          "Inspection, auscultation, percussion, palpation",
          "Auscultation, inspection, percussion, palpation",
          "Inspection, percussion, auscultation, palpation"
        ],
        correct: 1,
        rationale: "The correct abdominal assessment sequence is Inspection, Auscultation, Percussion, Palpation (IAPP). This sequence is UNIQUE to abdominal assessment -- all other body system assessments use inspection, palpation, percussion, auscultation. Auscultation must be performed before percussion and palpation because physical manipulation of the abdomen can stimulate peristalsis and alter bowel sounds, producing inaccurate findings."
      },
      {
        question: "During abdominal assessment, a nurse observes bluish discoloration around the patient's umbilicus. This finding is known as:",
        options: [
          "Murphy sign, suggesting acute cholecystitis",
          "Cullen sign, suggesting retroperitoneal hemorrhage",
          "Rovsing sign, suggesting appendicitis",
          "Blumberg sign, suggesting peritonitis"
        ],
        correct: 1,
        rationale: "Cullen sign is periumbilical ecchymosis (bluish discoloration around the umbilicus) indicating retroperitoneal hemorrhage. It is classically associated with hemorrhagic pancreatitis but can also be seen with ruptured abdominal aortic aneurysm or ruptured ectopic pregnancy. Grey Turner sign (flank ecchymosis) is a related finding. Murphy sign is inspiratory arrest during RUQ palpation. Rovsing sign is referred RLQ pain with LLQ palpation. Blumberg sign is rebound tenderness."
      },
      {
        question: "A post-surgical patient has no bowel sounds detected after listening for 30 seconds in each quadrant. What should the practical nurse do?",
        options: [
          "Document absent bowel sounds and notify the physician immediately",
          "Continue listening for a minimum of 5 minutes per quadrant before concluding sounds are absent",
          "Proceed directly to deep palpation to check for peritonitis",
          "Administer a prescribed prokinetic medication to stimulate peristalsis"
        ],
        correct: 1,
        rationale: "The nurse must listen for a MINIMUM of 5 continuous minutes in each quadrant before documenting absent bowel sounds. Listening for only 30 seconds is insufficient and may lead to incorrect documentation of absent sounds when bowel sounds are actually present but infrequent. Premature documentation of absent bowel sounds is one of the most common assessment errors and can lead to unnecessary diagnostic procedures or delays in diet advancement."
      }
    ]
  },

  "antibody-types": {
    title: "Antibody Types and Functions",
    cellular: {
      title: "Structure and Function of the Five Immunoglobulin Classes",
      content: "Antibodies (immunoglobulins) are Y-shaped glycoprotein molecules produced by plasma cells (differentiated B lymphocytes) that play a central role in humoral adaptive immunity. Each antibody molecule consists of four polypeptide chains: two identical heavy chains and two identical light chains, connected by disulfide bonds to form the characteristic Y-shaped structure. The two arms of the Y form the antigen-binding fragments (Fab regions), each containing a variable region at the tip that provides antigen specificity -- the complementarity-determining regions (CDRs) within the variable domains create a unique three-dimensional binding pocket that recognizes a specific epitope (antigenic determinant) with extraordinary precision, much like a lock and key. The stem of the Y is the crystallizable fragment (Fc region), which determines the antibody's biological effector functions: complement activation, opsonization, antibody-dependent cellular cytotoxicity (ADCC), placental transfer, and binding to Fc receptors on immune cells. The class (isotype) of an antibody is determined by the type of heavy chain it contains, and there are five classes of immunoglobulins in humans, each with distinct structures and biological functions. Immunoglobulin G (IgG) is the most abundant immunoglobulin in serum, comprising approximately 75-80% of total circulating antibodies. It is a monomer with four subclasses (IgG1, IgG2, IgG3, IgG4), each with slightly different effector functions. IgG is the primary antibody of the secondary (anamnestic) immune response -- its presence in serum indicates past infection or successful vaccination and long-term immunity. IgG has the longest serum half-life of all immunoglobulins (approximately 21-23 days), providing sustained protection. Critically, IgG is the ONLY immunoglobulin that crosses the placenta (via neonatal Fc receptors, FcRn, on placental syncytiotrophoblasts), providing passive immunity to the fetus and newborn. This transplacental transfer begins at approximately 13 weeks of gestation, increases significantly during the third trimester, and provides the neonate with protective antibody levels for approximately 3-6 months after birth, until the infant's own immune system matures sufficiently to produce its own antibodies. IgG efficiently opsonizes pathogens (coating them to enhance phagocytosis), activates complement via the classical pathway (IgG1 and IgG3 are the most efficient complement activators), and mediates ADCC through Fc receptor binding on NK cells. Immunoglobulin M (IgM) is the largest immunoglobulin, existing primarily as a pentamer (five monomeric units joined by J-chain), giving it 10 antigen-binding sites and extraordinary avidity (strength of multivalent binding) despite relatively low individual binding affinity. IgM is the FIRST antibody produced during a primary immune response -- its detection in serum indicates ACUTE or RECENT infection, making it invaluable for serological diagnosis. IgM is produced before the B cell undergoes isotype switching (the process by which a B cell changes from producing IgM to producing IgG, IgA, IgE, or IgD without changing antigen specificity). IgM is the most efficient complement activator among all immunoglobulin classes -- a single pentameric IgM molecule bound to an antigen surface can initiate the classical complement pathway, whereas multiple IgG molecules must be clustered together. IgM also exists as a surface-bound monomer on mature naive B cells, serving as the B cell receptor (BCR) for initial antigen recognition. Due to its large pentameric size, IgM does NOT cross the placenta and is not found in significant quantities in mucosal secretions. If IgM is detected in a newborn's serum, it indicates the neonate produced it themselves in response to an intrauterine infection (TORCH infections), as maternal IgM cannot cross the placenta -- this is a critical diagnostic principle. Immunoglobulin A (IgA) exists in two forms: serum IgA (monomeric, comprising 10-15% of circulating antibodies) and secretory IgA (sIgA, a dimer joined by J-chain and wrapped in a secretory component produced by mucosal epithelial cells). Secretory IgA is the predominant antibody class in mucosal secretions including saliva, tears, nasal secretions, bronchial secretions, gastrointestinal secretions, breast milk (especially colostrum), and genitourinary secretions. sIgA provides mucosal immunity by a mechanism called immune exclusion: it coats pathogens and toxins on mucosal surfaces, preventing their adhesion to and penetration of epithelial cells without activating complement or triggering inflammatory responses (this non-inflammatory protection is important because mucosal surfaces are constantly exposed to foreign antigens, and widespread inflammation would be destructive). sIgA in breast milk provides crucial passive mucosal immunity to the nursing infant, protecting the infant's immature gastrointestinal tract from enteric pathogens. Selective IgA deficiency is the most common primary immunodeficiency (affecting approximately 1 in 500 individuals), and while many patients are asymptomatic, some develop recurrent sinopulmonary and gastrointestinal infections. Immunoglobulin E (IgE) is present in the lowest concentration of all immunoglobulins in serum (less than 0.001% of total antibodies) but plays an outsized role in two clinical contexts: allergic reactions and parasitic infections. IgE binds with extremely high affinity to Fc-epsilon receptors (FcepsilonRI) on mast cells and basophils, essentially arming these cells with antigen-specific receptors. When a previously sensitized individual re-encounters the allergen, the allergen cross-links IgE molecules on the mast cell surface, triggering rapid degranulation and release of preformed mediators (histamine, tryptase, heparin) and newly synthesized mediators (prostaglandins, leukotrienes, cytokines). This IgE-mediated mast cell degranulation is the mechanism of Type I (immediate) hypersensitivity reactions, ranging from localized allergic rhinitis and urticaria to systemic anaphylaxis. In parasitic infections, IgE-coated helminths are attacked by eosinophils through ADCC, with eosinophil-released major basic protein and eosinophil cationic protein damaging the parasite surface. Elevated total serum IgE levels are seen in atopic conditions (allergic rhinitis, asthma, atopic dermatitis), parasitic infections, and certain immunodeficiency states. Allergen-specific IgE testing (RAST or ImmunoCAP) identifies sensitization to particular allergens. Immunoglobulin D (IgD) is found primarily on the surface of mature naive B cells as a co-receptor alongside IgM, forming part of the B cell receptor complex. Surface IgD appears to play a role in B cell activation and maturation, though its precise function remains less well understood than other immunoglobulin classes. Serum levels of IgD are very low, and its clinical significance is primarily in the diagnosis of hyper-IgD syndrome, a rare autoinflammatory disorder."
    },
    riskFactors: [
      "Primary immunoglobulin deficiencies (X-linked agammaglobulinemia, common variable immunodeficiency, selective IgA deficiency -- genetic defects in B cell development or immunoglobulin production)",
      "Secondary immunoglobulin loss (nephrotic syndrome -- IgG lost in urine; protein-losing enteropathy -- antibodies lost through GI tract; burns -- immunoglobulin loss through damaged skin)",
      "Medications that suppress B cell function and antibody production (rituximab depletes B cells; corticosteroids and chemotherapy impair lymphocyte function)",
      "Extremes of age (neonates rely on passive maternal IgG and have limited own antibody production; elderly have decreased antibody responses to vaccination)",
      "Malnutrition (protein deficiency impairs immunoglobulin synthesis; zinc and vitamin A deficiency impair B cell function)",
      "HIV/AIDS (progressive B cell dysfunction with abnormal immunoglobulin production despite hypergammaglobulinemia)",
      "Allergic predisposition (atopy) increases IgE production and risk of Type I hypersensitivity reactions"
    ],
    diagnostics: [
      "Quantitative immunoglobulin levels (serum IgG, IgA, IgM -- low levels indicate humoral immunodeficiency; elevated levels may indicate chronic infection, autoimmune disease, or myeloma)",
      "IgG subclass analysis (IgG1, IgG2, IgG3, IgG4 -- subclass deficiency may cause recurrent infections even with normal total IgG)",
      "Serum protein electrophoresis (SPEP) -- identifies monoclonal immunoglobulin peaks (M-spike) suggesting multiple myeloma or monoclonal gammopathy",
      "Specific antibody titers to vaccine antigens (measures functional antibody response -- inability to mount adequate titers after vaccination indicates immunodeficiency)",
      "Total serum IgE and allergen-specific IgE (RAST/ImmunoCAP) for evaluating allergic conditions and identifying specific allergen sensitivities",
      "Flow cytometry for B cell counts (CD19+, CD20+ cells -- absent or very low B cells in X-linked agammaglobulinemia)",
      "Neonatal IgM levels (elevated IgM in neonate suggests intrauterine infection since maternal IgM does not cross placenta)"
    ],
    management: [
      "Immunoglobulin replacement therapy (IVIG or subcutaneous IG) for patients with documented antibody deficiency and recurrent infections",
      "Allergen avoidance strategies for patients with IgE-mediated allergic conditions (environmental controls, dietary modifications)",
      "Desensitization (allergen immunotherapy) for appropriate candidates with IgE-mediated allergies (gradually increases allergen tolerance)",
      "Emergency preparedness for anaphylaxis (epinephrine auto-injectors for patients with history of IgE-mediated systemic reactions)",
      "Vaccination optimization (ensure all recommended vaccines are administered; live vaccines contraindicated in severe immunodeficiency)",
      "Monitor immunoglobulin trough levels in patients on replacement therapy to ensure adequate protection"
    ],
    nursingActions: [
      "Administer immunoglobulin infusions per protocol with appropriate premedication and monitoring for infusion reactions",
      "Educate patients with immunodeficiency about infection prevention measures (hand hygiene, avoiding sick contacts, food safety)",
      "Recognize and respond to anaphylaxis symptoms immediately (administer epinephrine IM, maintain airway, call for emergency assistance)",
      "Properly label and handle blood specimens for immunoglobulin testing (ensure correct tubes, proper handling, timely transport to laboratory)",
      "Monitor patients receiving blood products for transfusion reactions related to antibody incompatibility",
      "Educate breastfeeding mothers about the immune benefits of breast milk (IgA protection for infant GI tract)",
      "Document allergy history thoroughly including specific allergens, type of reaction, and severity for medication safety",
      "Assess injection site reactions and systemic symptoms during and after immunoglobulin administration"
    ],
    assessmentFindings: [
      "Recurrent sinopulmonary infections (may indicate IgA or IgG deficiency -- impaired mucosal and systemic antibody protection)",
      "History of severe or recurrent allergic reactions (elevated IgE with mast cell activation)",
      "Chronic diarrhea or malabsorption (may indicate IgA deficiency affecting GI mucosal immunity or protein-losing enteropathy)",
      "Poor response to vaccinations (functional antibody deficiency -- titers fail to rise after immunization)",
      "Neonatal infections with elevated IgM (suggests congenital TORCH infection)",
      "Urticaria, angioedema, or anaphylaxis after allergen exposure (IgE-mediated hypersensitivity)",
      "Lymphadenopathy or splenomegaly (may indicate chronic immune activation or lymphoproliferative disorder)"
    ],
    signs: {
      left: [
        "Recurrent upper respiratory infections",
        "Seasonal allergy symptoms (rhinitis, conjunctivitis)",
        "Mild urticaria after allergen exposure",
        "Borderline low immunoglobulin levels",
        "Chronic sinusitis"
      ],
      right: [
        "Anaphylaxis (hypotension, bronchospasm, urticaria, angioedema)",
        "Overwhelming sepsis from encapsulated organisms",
        "Severe bronchiectasis from chronic infections",
        "Hemolytic transfusion reaction (antibody-mediated)",
        "Hemolytic disease of the newborn (maternal IgG against fetal RBC antigens)"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Sympathomimetic (non-selective adrenergic agonist) for anaphylaxis",
        action: "Stimulates alpha-1 receptors (vasoconstriction reversing hypotension and mucosal edema), beta-1 receptors (increased heart rate and contractility), and beta-2 receptors (bronchodilation and mast cell stabilization); directly counteracts IgE-mediated anaphylaxis pathophysiology by reversing vasodilation, bronchospasm, and reducing further mediator release",
        sideEffects: "Tachycardia, palpitations, anxiety, tremor, headache, transient hypertension; effects are brief and far outweighed by life-saving benefit in anaphylaxis",
        contra: "NO absolute contraindications in true anaphylaxis -- must NEVER be withheld; relative cautions include coronary artery disease and concurrent MAO inhibitor use",
        pearl: "Administer IM in anterolateral thigh (vastus lateralis) for fastest absorption; dose 0.3-0.5 mg (1:1000) for adults; may repeat every 5-15 minutes; prescribe EpiPen for any patient with history of anaphylaxis and educate on proper use and storage"
      },
      {
        name: "Diphenhydramine (Benadryl)",
        type: "First-generation H1 antihistamine",
        action: "Competitively blocks H1 histamine receptors on smooth muscle, vascular endothelium, and sensory nerve endings, reducing histamine-mediated effects including vasodilation, increased vascular permeability, pruritus, and bronchoconstriction; crosses blood-brain barrier causing sedation; used as adjunctive therapy in allergic reactions and anaphylaxis (NOT a substitute for epinephrine in anaphylaxis)",
        sideEffects: "Sedation and drowsiness (most common), anticholinergic effects (dry mouth, urinary retention, constipation, blurred vision), dizziness, paradoxical excitation in children and elderly",
        contra: "Neonates and premature infants; concurrent MAO inhibitor use; acute asthma attack (as sole treatment); angle-closure glaucoma; urinary retention from prostatic hypertrophy; caution in elderly (Beers criteria -- increased fall risk and anticholinergic burden)",
        pearl: "Adjunctive therapy only in anaphylaxis -- NEVER delays or replaces epinephrine; onset of action is 15-30 minutes (too slow for acute anaphylaxis management); newer second-generation antihistamines (cetirizine, loratadine) are preferred for chronic allergic conditions because they do not cross BBB and cause less sedation; IV administration should be slow to prevent hypotension"
      },
      {
        name: "Omalizumab (Xolair)",
        type: "Monoclonal anti-IgE antibody (biologic immunomodulator)",
        action: "Humanized monoclonal antibody that selectively binds to free circulating IgE at the same site where IgE binds to FcepsilonRI on mast cells and basophils, preventing IgE from attaching to and sensitizing these cells; reduces free IgE levels by 95-99%, downregulates FcepsilonRI expression on mast cells and basophils, and decreases the sensitivity of these cells to allergen-triggered degranulation; indicated for moderate-to-severe persistent allergic asthma and chronic spontaneous urticaria",
        sideEffects: "Injection site reactions (pain, erythema, swelling), headache, upper respiratory infections, sinusitis, pharyngitis, rare anaphylaxis (0.1-0.2% -- paradoxically, an anti-IgE drug can cause anaphylaxis through non-IgE mechanisms)",
        contra: "Known hypersensitivity to omalizumab; NOT for acute bronchospasm or status asthmaticus; not recommended in children under 6 years for asthma",
        pearl: "Administered subcutaneously every 2-4 weeks based on body weight and baseline total serum IgE level; patients must be observed for at least 2 hours after the first 3 injections and 30 minutes thereafter due to anaphylaxis risk; do NOT abruptly discontinue inhaled corticosteroids when starting omalizumab -- taper gradually; total serum IgE levels will be elevated during treatment and cannot be used to monitor response; clinical response is assessed by symptom improvement and reduction in exacerbations"
      }
    ],
    pearls: [
      "IgM is the FIRST antibody produced in a primary immune response (indicates acute/recent infection) while IgG is the predominant antibody of the secondary response (indicates past infection or immunity) -- this IgM-to-IgG transition is the basis for serological timing of infections",
      "IgG is the ONLY immunoglobulin that crosses the placenta -- it provides passive immunity to the neonate for 3-6 months; if IgM is detected in a newborn, it was produced by the neonate (not transferred from mother) and indicates intrauterine infection",
      "Secretory IgA is the guardian of mucosal surfaces -- it prevents pathogen adhesion without triggering inflammation; IgA in breast milk provides critical passive mucosal immunity to nursing infants, which is one reason breastfeeding is encouraged",
      "IgE in very small serum concentrations drives the entire spectrum of allergic disease -- from mild allergic rhinitis to life-threatening anaphylaxis; IgE arms mast cells and basophils, and allergen cross-linking triggers immediate degranulation releasing histamine and other mediators",
      "IgM is the most efficient complement activator -- a single pentameric IgM molecule can initiate the classical complement cascade, while multiple IgG molecules must cluster together to achieve the same effect; this makes IgM highly effective at opsonization and pathogen clearance during early infection",
      "Selective IgA deficiency is the most common primary immunodeficiency (1 in 500 people) -- many are asymptomatic, but some develop recurrent sinopulmonary and GI infections; importantly, some IgA-deficient patients develop anti-IgA antibodies that can cause anaphylaxis if given IgA-containing blood products",
      "Always document allergy information including the specific allergen, type of reaction (IgE-mediated vs non-immune), and severity -- this distinction is crucial because a true IgE-mediated allergy to penicillin requires avoidance of all penicillins, while a non-immune adverse effect may not"
    ],
    quiz: [
      {
        question: "A newborn's blood work shows elevated IgM levels. What is the clinical significance of this finding?",
        options: [
          "Normal finding due to maternal IgM transfer across the placenta",
          "Indicates the neonate produced IgM in response to an intrauterine infection",
          "Suggests the infant is allergic to breast milk",
          "Indicates the infant has received passive immunity from vaccination"
        ],
        correct: 1,
        rationale: "IgM does NOT cross the placenta due to its large pentameric size. Therefore, IgM detected in a newborn's blood was produced by the neonate's own immune system, indicating the infant mounted an immune response to an antigen encountered in utero. Elevated neonatal IgM strongly suggests a congenital intrauterine infection (TORCH infections: Toxoplasmosis, Other, Rubella, Cytomegalovirus, Herpes simplex). Only IgG crosses the placenta to provide passive maternal immunity."
      },
      {
        question: "Which immunoglobulin class is primarily responsible for mucosal immunity and is found in high concentrations in breast milk?",
        options: [
          "IgG (provides systemic protection and crosses the placenta)",
          "IgM (first antibody produced in primary immune response)",
          "IgA (secretory form protects mucosal surfaces)",
          "IgE (mediates allergic reactions and parasitic defense)"
        ],
        correct: 2,
        rationale: "Secretory IgA (sIgA) is the predominant antibody in mucosal secretions including breast milk (especially colostrum), saliva, tears, and GI secretions. It provides mucosal immunity through immune exclusion, preventing pathogen adhesion to epithelial surfaces without triggering inflammation. sIgA in breast milk protects the nursing infant's immature GI tract from enteric pathogens, which is one of the immune benefits of breastfeeding."
      },
      {
        question: "A patient with a history of seasonal allergies has elevated total serum IgE. Which type of immune cells does IgE primarily bind to in preparation for an allergic response?",
        options: [
          "Cytotoxic T cells (CD8+) for cell-mediated killing",
          "Neutrophils for phagocytosis of allergens",
          "Mast cells and basophils for degranulation and mediator release",
          "Natural killer cells for antibody-dependent cellular cytotoxicity"
        ],
        correct: 2,
        rationale: "IgE binds with very high affinity to FcepsilonRI receptors on mast cells and basophils, essentially arming these cells with allergen-specific receptors. When the allergen is re-encountered and cross-links surface-bound IgE molecules, it triggers mast cell and basophil degranulation, releasing preformed mediators (histamine, tryptase) and newly synthesized mediators (prostaglandins, leukotrienes) that produce the clinical manifestations of allergic reactions."
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
console.log(`\nDone: ${ok} injected, ${fail} failed`);
