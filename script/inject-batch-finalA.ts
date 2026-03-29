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
  "spinal-stenosis-rpn": {
    title: "Spinal Stenosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Spinal Stenosis",
      content: "Spinal stenosis is the narrowing of the spinal canal, nerve root canals (lateral recesses), or intervertebral foramina, resulting in compression of the spinal cord or spinal nerve roots. The condition most commonly occurs in the lumbar spine (L3-L5) and the cervical spine (C4-C7). The spinal canal is bounded anteriorly by the vertebral bodies and intervertebral discs, laterally by the pedicles and facet joints, and posteriorly by the laminae and ligamentum flavum. Degenerative changes are the most common cause in adults over age 50. As the spine ages, intervertebral discs lose water content and height (desiccation), leading to disc bulging into the spinal canal. Osteophytes (bone spurs) form at the vertebral body margins and facet joints as a compensatory response to increased mechanical stress. The ligamentum flavum, which connects adjacent laminae, undergoes hypertrophy and thickening with age, further encroaching on the spinal canal from the posterior aspect. In lumbar stenosis, the hallmark symptom is neurogenic claudication (pseudoclaudication): bilateral leg pain, heaviness, and weakness that worsens with walking or standing upright (spinal extension) and improves with sitting or leaning forward (spinal flexion). This occurs because spinal extension further narrows the already compromised canal, while flexion opens the canal slightly and improves blood flow to compressed nerve roots. This distinguishes neurogenic claudication from vascular claudication, where symptoms improve with standing still (not necessarily sitting). In cervical stenosis, compression of the cervical spinal cord can produce cervical myelopathy, characterized by upper extremity weakness, hand clumsiness, gait instability, hyperreflexia, and Hoffmann sign (involuntary flexion of the thumb and index finger when the distal phalanx of the middle finger is flicked). Cervical myelopathy is a more serious condition because it involves the spinal cord itself rather than peripheral nerve roots. The practical nurse should understand that spinal stenosis is a chronic, progressive condition that may require conservative management (physical therapy, medications, epidural injections) or surgical intervention (laminectomy, spinal fusion) depending on severity."
    },
    riskFactors: [
      "Advanced age over 50 years (degenerative disc disease and facet joint arthropathy)",
      "Obesity (increased axial loading on the spine accelerates degeneration)",
      "History of spinal trauma or repetitive occupational stress on the spine",
      "Congenital narrow spinal canal (predisposes to earlier symptom onset)",
      "Osteoarthritis (facet joint hypertrophy contributes to canal narrowing)",
      "Spondylolisthesis (forward slipping of one vertebra over another further narrows the canal)",
      "Smoking (impairs disc nutrition through decreased blood supply to vertebral endplates)"
    ],
    diagnostics: [
      "MRI of the spine: gold standard for visualizing spinal stenosis; shows disc herniation, ligamentum flavum hypertrophy, facet joint enlargement, and degree of neural compression without radiation exposure",
      "X-ray of the spine (AP and lateral views): identifies osteophytes, disc space narrowing, spondylolisthesis, and alignment abnormalities; first-line imaging for initial evaluation",
      "CT scan of the spine: best for visualizing bony anatomy; used when MRI is contraindicated (pacemaker, metallic implants); CT myelography provides additional detail of neural compression",
      "Electromyography (EMG) and nerve conduction studies: differentiate spinal stenosis from peripheral neuropathy; identify which nerve roots are affected",
      "Complete blood count and inflammatory markers (ESR, CRP): rule out infection (spinal abscess) or inflammatory conditions (ankylosing spondylitis) as alternative causes of back pain"
    ],
    management: [
      "Conservative management first: physical therapy focusing on lumbar flexion exercises (Williams flexion exercises) to open the spinal canal and strengthen core musculature",
      "Administer analgesics as prescribed: acetaminophen or NSAIDs for mild to moderate pain; gabapentin or pregabalin for neuropathic pain component",
      "Epidural corticosteroid injections (performed by physician or specialist): provide temporary relief by reducing inflammation around compressed nerve roots; may allow participation in physical therapy",
      "Encourage activity modification: teach patients that forward-leaning positions (using a shopping cart, riding a stationary bicycle) reduce symptoms by increasing spinal canal diameter",
      "Surgical referral (laminectomy or spinal fusion) when conservative management fails after 3-6 months, or when progressive neurological deficits develop (cauda equina syndrome is a surgical emergency)",
      "Post-laminectomy care: log-roll technique for positioning, monitor surgical site for signs of CSF leak (clear drainage on dressing), neurological checks every 2-4 hours, progressive ambulation as tolerated"
    ],
    nursingActions: [
      "Assess pain using a validated tool (numeric rating scale 0-10) including location, quality, radiation pattern, and aggravating/relieving factors at each shift",
      "Perform and document focused neurological assessment: lower extremity strength, sensation, deep tendon reflexes, and gait assessment for lumbar stenosis",
      "Monitor for signs of cauda equina syndrome (a surgical emergency): new-onset urinary retention or incontinence, saddle anesthesia, bilateral leg weakness, and decreased rectal tone -- report immediately",
      "Assist with safe mobility: provide assistive devices (walker, cane) as needed; supervise ambulation especially during initial mobilization after periods of rest",
      "Reinforce prescribed exercise program as delegated: lumbar flexion exercises, core stabilization, and aquatic therapy adherence",
      "Report any new or worsening neurological deficits to the registered nurse or physician immediately, including changes in bowel or bladder function"
    ],
    assessmentFindings: [
      "Neurogenic claudication: bilateral leg pain, heaviness, and numbness that worsens with walking or standing upright and improves with sitting or leaning forward",
      "Positive shopping cart sign: patient reports reduced symptoms when leaning forward on a shopping cart (increases lumbar flexion and opens spinal canal)",
      "Decreased lumbar range of motion, particularly with extension; pain reproduced or worsened with lumbar extension maneuvers",
      "Lower extremity weakness (difficulty with heel walking or toe walking), diminished or absent deep tendon reflexes at the knee (L3-L4) or ankle (S1)",
      "Cervical myelopathy findings (in cervical stenosis): hand clumsiness, difficulty with fine motor tasks (buttoning, writing), wide-based gait, hyperreflexia, positive Hoffmann sign",
      "Sensory changes following dermatomal patterns: numbness, tingling, or paresthesias in the affected nerve root distribution"
    ],
    signs: {
      left: [
        "Intermittent low back pain that worsens with prolonged standing or walking",
        "Mild bilateral leg fatigue or heaviness with activity",
        "Decreased lumbar range of motion",
        "Mild paresthesias (tingling) in the legs relieved by rest or sitting",
        "Muscle stiffness in the morning that improves with movement",
        "Difficulty walking long distances without needing to stop and rest"
      ],
      right: [
        "Sudden onset of urinary retention or bowel incontinence (cauda equina syndrome)",
        "Saddle anesthesia (numbness in perineal area) -- surgical emergency",
        "Progressive bilateral lower extremity weakness",
        "Foot drop (inability to dorsiflex the foot) indicating severe nerve root compression",
        "Cervical myelopathy with upper extremity dysfunction and gait instability",
        "Loss of deep tendon reflexes with rapidly progressing neurological deficit"
      ]
    },
    medications: [
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant / neuropathic pain agent",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the central nervous system, reducing excitatory neurotransmitter release and decreasing neuropathic pain signal transmission; does not interact with GABA receptors despite its name",
        sideEffects: "Drowsiness, dizziness, peripheral edema, weight gain, ataxia (unsteady gait)",
        contra: "Severe renal impairment (requires dose adjustment based on creatinine clearance); avoid abrupt discontinuation (taper over at least one week to prevent seizures)",
        pearl: "Start at a low dose and titrate slowly (start low, go slow); full analgesic effect may take 2-4 weeks; take at bedtime initially to minimize daytime sedation; renal dosing is critical in older adults"
      },
      {
        name: "Naproxen (Naprosyn/Aleve)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits both cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, reducing prostaglandin synthesis and thereby decreasing inflammation, pain, and fever; longer half-life than ibuprofen allows twice-daily dosing",
        sideEffects: "GI upset, peptic ulcer disease, GI bleeding, increased blood pressure, renal impairment, fluid retention, increased cardiovascular risk with prolonged use",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment (CrCl less than 30 mL/min); third trimester of pregnancy (premature closure of ductus arteriosus); post-CABG surgery; aspirin-sensitive asthma",
        pearl: "Take with food to reduce GI irritation; use the lowest effective dose for the shortest duration; monitor renal function and blood pressure in older adults; co-administer with a PPI if prolonged NSAID use is necessary"
      },
      {
        name: "Methylprednisolone (Solu-Medrol / Depo-Medrol)",
        type: "Corticosteroid (glucocorticoid)",
        action: "Potent anti-inflammatory and immunosuppressive agent that inhibits phospholipase A2 (via lipocortin), reducing arachidonic acid release and subsequent prostaglandin, leukotriene, and thromboxane synthesis; reduces edema and inflammation around compressed neural structures",
        sideEffects: "Hyperglycemia (monitor blood glucose especially in diabetics), immunosuppression, fluid retention, hypertension, osteoporosis with long-term use, gastric irritation, mood changes, insomnia",
        contra: "Systemic fungal infections; live vaccine administration during therapy; untreated bacterial infections; use with caution in diabetes, hypertension, peptic ulcer disease, and osteoporosis",
        pearl: "Epidural methylprednisolone injections provide localized anti-inflammatory effect at the site of nerve root compression; oral burst-taper courses may be used for acute flares; never stop abruptly after prolonged use (taper to avoid adrenal crisis); monitor blood glucose closely for 48-72 hours after injection in diabetic patients"
      }
    ],
    pearls: [
      "Neurogenic claudication (spinal stenosis) vs. vascular claudication (peripheral arterial disease): neurogenic improves with sitting/flexion; vascular improves with standing still -- pedal pulses are normal in neurogenic claudication",
      "The shopping cart sign is a clinical clue for lumbar stenosis: patients lean forward on a shopping cart to increase lumbar flexion, which temporarily enlarges the spinal canal and reduces nerve root compression",
      "Cauda equina syndrome is a SURGICAL EMERGENCY: new-onset urinary retention, saddle anesthesia, and bilateral leg weakness require emergent MRI and surgical decompression within 24-48 hours to prevent permanent neurological damage",
      "Lumbar stenosis is most symptomatic with spinal extension (standing, walking downhill) and least symptomatic with flexion (sitting, walking uphill, cycling) -- this is the opposite of disc herniation pain patterns",
      "Gabapentin requires renal dose adjustment and should be tapered when discontinuing -- abrupt cessation can precipitate seizures even in patients without a seizure history",
      "Post-laminectomy patients must be assessed for CSF leak (clear, glucose-positive drainage from the incision site) and new neurological deficits every 2-4 hours in the immediate postoperative period"
    ],
    quiz: [
      {
        question: "A patient with lumbar spinal stenosis reports bilateral leg pain and heaviness that worsens with walking and improves when sitting down. The practical nurse recognizes this symptom pattern as which of the following?",
        options: [
          "Vascular claudication",
          "Neurogenic claudication",
          "Sciatica from disc herniation",
          "Peripheral neuropathy"
        ],
        correct: 1,
        rationale: "Neurogenic claudication is the hallmark of lumbar spinal stenosis. It is characterized by bilateral leg pain, heaviness, and weakness that worsens with walking or standing (spinal extension) and improves with sitting or leaning forward (spinal flexion). Vascular claudication from peripheral arterial disease improves with standing still and is associated with diminished pedal pulses."
      },
      {
        question: "A patient with known spinal stenosis suddenly develops urinary retention, numbness in the perineal area, and bilateral leg weakness. What is the priority nursing action?",
        options: [
          "Administer gabapentin as prescribed for neuropathic pain",
          "Assist the patient to a seated position to relieve symptoms",
          "Report findings immediately as a possible surgical emergency",
          "Apply ice packs to the lower back and document the findings"
        ],
        correct: 2,
        rationale: "These findings (urinary retention, saddle anesthesia, bilateral leg weakness) are classic signs of cauda equina syndrome, which is a surgical emergency. Immediate notification of the physician is required because surgical decompression within 24-48 hours is necessary to prevent permanent neurological damage including paralysis and loss of bladder/bowel function."
      },
      {
        question: "A practical nurse is reinforcing discharge teaching for a patient with lumbar spinal stenosis. Which statement by the patient indicates correct understanding of activity modification?",
        options: [
          "I should sleep on my stomach to keep my spine straight",
          "Walking uphill and riding a stationary bike are good exercises for me",
          "I should avoid bending forward because it will make my pain worse",
          "Standing for long periods will help strengthen my back muscles"
        ],
        correct: 1,
        rationale: "Walking uphill and riding a stationary bicycle promote lumbar flexion, which increases spinal canal diameter and reduces nerve root compression in lumbar stenosis. Standing for long periods and spinal extension worsen symptoms. Patients should be encouraged to perform activities that promote a slightly flexed lumbar posture."
      }
    ]
  },

  "stevens-johnson-basics-rpn": {
    title: "Stevens-Johnson Syndrome Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Stevens-Johnson Syndrome and Toxic Epidermal Necrolysis",
      content: "Stevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN) represent a spectrum of severe, potentially life-threatening mucocutaneous reactions that are most commonly drug-induced. SJS involves less than 10% body surface area (BSA) detachment of the epidermis, SJS-TEN overlap involves 10-30% BSA, and TEN involves greater than 30% BSA detachment. The pathophysiology involves a cytotoxic immune-mediated reaction directed against keratinocytes (the primary cells of the epidermis). Drug-reactive cytotoxic T lymphocytes (CD8+ T cells) and natural killer cells infiltrate the epidermis and release cytotoxic molecules including granulysin, perforin, and granzyme B, which trigger massive keratinocyte apoptosis (programmed cell death). Fas ligand (FasL) and tumor necrosis factor-alpha (TNF-alpha) also contribute to keratinocyte death by activating the caspase cascade. The result is full-thickness epidermal necrosis with separation of the epidermis from the dermis at the dermal-epidermal junction, producing the characteristic findings: widespread erythematous or purpuric macules that rapidly progress to flaccid blisters and sheets of denuded skin. The Nikolsky sign is positive (gentle lateral pressure on uninvolved skin causes the epidermis to separate and slide off), indicating active epidermal detachment. Mucosal involvement occurs in over 90% of cases, affecting the oral mucosa, conjunctivae, genitalia, and respiratory and gastrointestinal tracts. The most common causative medications include allopurinol, sulfonamide antibiotics (trimethoprim-sulfamethoxazole), aromatic anticonvulsants (carbamazepine, phenytoin, lamotrigine), and NSAIDs (piroxicam). Symptoms typically begin 1-3 weeks after initiation of the offending drug. Prodromal symptoms include fever, malaise, sore throat, and burning eyes, followed by rapid onset of painful skin lesions. The mortality rate for SJS is approximately 5-10% and for TEN is 25-35%, with death most commonly resulting from sepsis, multiorgan failure, or fluid and electrolyte derangements. Management is similar to burn care: the patient requires immediate transfer to a burn unit or intensive care unit, aggressive fluid resuscitation, wound care, pain management, and identification and immediate discontinuation of the causative drug."
    },
    riskFactors: [
      "Current use of high-risk medications: allopurinol, sulfonamide antibiotics, carbamazepine, phenytoin, lamotrigine, nevirapine, piroxicam",
      "HIV/AIDS (100-fold increased risk due to immune dysregulation and polypharmacy)",
      "Genetic predisposition: HLA-B*5801 allele (allopurinol-induced SJS, more common in Southeast Asian and African American populations)",
      "HLA-B*1502 allele (carbamazepine-induced SJS, more common in Han Chinese, Thai, and Malaysian populations)",
      "Immunocompromised states: organ transplant recipients, active malignancy, systemic lupus erythematosus",
      "Prior history of SJS or TEN (high recurrence risk with re-exposure to the same or structurally related drug)",
      "Slow acetylator metabolizer status (impaired drug metabolism increases reactive metabolite accumulation)"
    ],
    diagnostics: [
      "Clinical diagnosis based on skin and mucosal findings: characteristic targetoid lesions with central necrosis, positive Nikolsky sign, mucosal erosions involving at least two mucosal surfaces",
      "Skin biopsy (punch biopsy of lesional skin): shows full-thickness epidermal necrosis with subepidermal blister formation and sparse lymphocytic infiltrate at the dermal-epidermal junction; distinguishes SJS/TEN from other blistering disorders",
      "SCORTEN severity score (calculated within first 24 hours): predicts mortality using 7 parameters -- age over 40, malignancy, heart rate over 120, BSA detachment over 10%, serum BUN over 10 mmol/L, serum bicarbonate less than 20 mmol/L, serum glucose over 14 mmol/L",
      "Complete blood count: may show leukopenia (poor prognostic sign) or leukocytosis; anemia from blood loss through denuded skin",
      "Comprehensive metabolic panel: monitor for renal impairment (elevated creatinine), electrolyte derangements (hyponatremia, hypokalemia from fluid loss), and metabolic acidosis (low bicarbonate)",
      "Blood cultures: obtain if sepsis is suspected; denuded skin provides a portal of entry for bacteria (Staphylococcus aureus, Pseudomonas aeruginosa most common)"
    ],
    management: [
      "IMMEDIATELY discontinue the suspected causative drug -- early drug withdrawal is the single most important intervention and directly correlates with survival",
      "Transfer to a burn unit or intensive care unit for management; treat denuded skin with sterile wound care protocols identical to burn management",
      "Aggressive IV fluid resuscitation: crystalloid solution (Ringer lactate) at a rate based on percentage of BSA involvement; typically lower volume than burn formula (approximately two-thirds of the Parkland formula)",
      "Pain management: IV opioid analgesics (morphine) scheduled and PRN; oral care with viscous lidocaine for mucosal pain; avoid NSAID analgesics if NSAIDs are the suspected cause",
      "Wound care: non-adherent dressings (petroleum-impregnated gauze or silicone mesh), gentle debridement of necrotic tissue, topical antimicrobials (silver sulfadiazine or mupirocin) to prevent wound infection",
      "Ophthalmology consultation within 24 hours for all patients: ocular involvement (conjunctival inflammation, corneal erosions) can progress to symblepharon (adhesion of eyelid to eyeball), corneal scarring, and permanent vision loss",
      "Nutritional support: high-calorie, high-protein diet via nasogastric tube if oral intake is impaired by mucosal involvement; caloric needs are similar to burn patients"
    ],
    nursingActions: [
      "Perform hourly skin assessment documenting percentage of BSA affected, progression of lesions, presence of new blisters, and Nikolsky sign status; use the Rule of Nines or Lund and Browder chart",
      "Maintain strict aseptic technique during wound care; denuded skin is a direct portal of entry for infection -- wear sterile gloves, mask, and gown for dressing changes",
      "Monitor temperature every 4 hours; note that patients with extensive skin loss may have impaired thermoregulation (hypothermia is common due to loss of the skin barrier) -- use warming devices and warm IV fluids",
      "Maintain strict intake and output; monitor for signs of fluid deficit: decreased urine output (less than 0.5 mL/kg/hr), tachycardia, hypotension, and rising serum creatinine",
      "Provide meticulous oral care every 2 hours with soft swabs and prescribed mouthwash; mucosal involvement can severely impair nutrition and hydration",
      "Monitor for signs of sepsis (the leading cause of death): fever or hypothermia, tachycardia, hypotension, altered mental status, rising WBC or new-onset leukopenia, positive blood cultures",
      "Document all medications the patient received in the 1-4 weeks before symptom onset to help identify the causative drug; report findings to the physician"
    ],
    assessmentFindings: [
      "Prodromal phase (1-3 days before skin lesions): fever (often over 39C), malaise, myalgia, sore throat, burning or stinging eyes, painful swallowing",
      "Skin lesions: erythematous to purpuric macules with dusky centers (atypical targetoid lesions) that rapidly coalesce; flaccid blisters that rupture easily; sheets of denuded skin revealing moist, erythematous dermis",
      "Positive Nikolsky sign: gentle lateral pressure on uninvolved or erythematous skin causes the epidermis to separate and slide off -- indicates active epidermal detachment",
      "Mucosal erosions: hemorrhagic crusting of the lips, oral ulcerations, conjunctival injection and erosions, genital erosions, urethral involvement causing dysuria",
      "Signs of hypovolemia from transepidermal fluid loss: tachycardia, hypotension, decreased urine output, poor skin turgor in unaffected areas",
      "Pain disproportionate to clinical appearance: patients often describe severe burning pain in the skin before blisters appear"
    ],
    signs: {
      left: [
        "Fever and malaise during prodromal phase",
        "Localized erythematous macules or patches",
        "Burning sensation of the eyes, lips, or skin",
        "Mild oral discomfort or sore throat",
        "Limited skin involvement (less than 10% BSA)",
        "Stable vital signs with adequate urine output"
      ],
      right: [
        "Positive Nikolsky sign with active epidermal detachment",
        "Greater than 10% BSA skin detachment (TEN classification)",
        "Respiratory distress from bronchial mucosal sloughing",
        "Signs of sepsis: fever, tachycardia, hypotension, altered mental status",
        "Corneal erosions or visual changes (risk of permanent vision loss)",
        "Hemodynamic instability from massive fluid and protein loss"
      ]
    },
    medications: [
      {
        name: "Cyclosporine (Neoral/Sandimmune)",
        type: "Calcineurin inhibitor / immunosuppressant",
        action: "Inhibits calcineurin in T lymphocytes, blocking the nuclear factor of activated T cells (NFAT) pathway and suppressing production of interleukin-2 (IL-2) and other pro-inflammatory cytokines; reduces the cytotoxic T-cell-mediated keratinocyte destruction that drives SJS/TEN",
        sideEffects: "Nephrotoxicity (dose-dependent, monitor serum creatinine), hypertension, hyperkalemia, hypomagnesemia, tremor, hirsutism, gingival hyperplasia, increased infection risk",
        contra: "Uncontrolled hypertension; concurrent use of other nephrotoxic drugs without close monitoring; active serious infections; use with caution in renal impairment",
        pearl: "Emerging evidence supports cyclosporine as the most effective systemic therapy for SJS/TEN, reducing mortality and halting disease progression; typical dose is 3-5 mg/kg/day for 7-14 days; monitor renal function daily; trough levels may be drawn to guide therapy"
      },
      {
        name: "Intravenous Immunoglobulin (IVIG)",
        type: "Immunomodulatory agent / pooled human immunoglobulins",
        action: "Contains anti-Fas antibodies that block the Fas-FasL interaction on keratinocytes, potentially reducing keratinocyte apoptosis; also modulates cytotoxic T-cell activity and provides passive immunity against secondary infections",
        sideEffects: "Headache, fever, chills (infusion-related reactions), nausea, aseptic meningitis, thrombotic events (stroke, DVT, PE), acute renal failure (especially with sucrose-containing formulations), anaphylaxis in IgA-deficient patients",
        contra: "IgA deficiency with anti-IgA antibodies (risk of anaphylaxis); severe renal impairment (use non-sucrose formulations); caution in patients with cardiovascular risk factors due to thrombotic risk",
        pearl: "IVIG is used as adjunctive therapy in SJS/TEN though evidence remains debated; administer slowly with premedication (acetaminophen, diphenhydramine); monitor for infusion reactions; ensure adequate hydration to protect renal function; high doses (2-4 g/kg total over 3-5 days) may be required"
      },
      {
        name: "Silver Sulfadiazine (Flamazine/Silvadene)",
        type: "Topical antimicrobial agent",
        action: "Silver ions bind to bacterial DNA, disrupting replication and cell wall synthesis; effective against a broad spectrum of organisms including Staphylococcus aureus, Pseudomonas aeruginosa, Escherichia coli, and Candida species; provides a moist wound healing environment",
        sideEffects: "Transient leukopenia (typically resolves with continued use), local burning or stinging on application, skin discoloration (greyish), rare hypersensitivity reactions",
        contra: "Sulfonamide allergy (cross-sensitivity due to sulfa component); premature infants or neonates under 2 months (risk of kernicterus); pregnancy at term (may displace bilirubin); caution if sulfonamide was the causative drug for SJS/TEN -- use alternative topical antimicrobial",
        pearl: "Apply a thin layer (1-2 mm) to denuded areas with sterile technique; reapply every 12-24 hours after gentle wound cleansing; monitor CBC weekly for leukopenia; do NOT use if the causative drug is a sulfonamide -- use alternative such as mupirocin or bacitracin instead"
      }
    ],
    pearls: [
      "The MOST IMPORTANT intervention in SJS/TEN management is IMMEDIATE discontinuation of the suspected causative drug -- mortality increases with every day of delayed drug withdrawal",
      "SJS involves less than 10% BSA epidermal detachment; SJS-TEN overlap is 10-30% BSA; TEN is greater than 30% BSA -- higher BSA involvement correlates directly with higher mortality",
      "Nikolsky sign (epidermis slides off with gentle lateral pressure on uninvolved skin) is a key physical finding that distinguishes SJS/TEN from other blistering conditions",
      "Ophthalmology must be consulted within 24 hours for ALL SJS/TEN patients -- ocular complications (symblepharon, corneal scarring, dry eye) can cause permanent vision loss if not treated early",
      "Thermoregulation is impaired due to loss of the epidermal barrier -- monitor temperature closely and use warming measures; hypothermia is more common than fever in extensive skin loss",
      "Do NOT use silver sulfadiazine if the causative drug is a sulfonamide -- cross-reactivity can worsen the reaction; use alternative topical antimicrobials (mupirocin, bacitracin) instead",
      "Survivors of SJS/TEN must carry a medical alert identifying the causative drug and ALL structurally related drugs to prevent re-exposure, which carries a very high risk of recurrence and potentially more severe reaction"
    ],
    quiz: [
      {
        question: "A patient is admitted with fever, oral erosions, and widespread skin blistering involving 8% body surface area after starting allopurinol two weeks ago. The practical nurse recognizes this presentation is most consistent with which condition?",
        options: [
          "Contact dermatitis",
          "Stevens-Johnson syndrome",
          "Pemphigus vulgaris",
          "Erythema multiforme minor"
        ],
        correct: 1,
        rationale: "Stevens-Johnson syndrome involves less than 10% BSA epidermal detachment with mucosal involvement, typically occurring 1-3 weeks after initiation of a causative drug. Allopurinol is one of the most common drug triggers for SJS. Contact dermatitis does not cause mucosal involvement or epidermal detachment."
      },
      {
        question: "What is the MOST important initial nursing intervention for a patient diagnosed with SJS/TEN?",
        options: [
          "Apply silver sulfadiazine to all affected areas",
          "Administer intravenous corticosteroids as ordered",
          "Ensure the suspected causative medication has been discontinued",
          "Obtain wound cultures from all denuded areas"
        ],
        correct: 2,
        rationale: "Immediate discontinuation of the suspected causative drug is the single most important intervention in SJS/TEN management. Each day of delayed drug withdrawal is associated with increased mortality. While wound care and other treatments are important, drug discontinuation takes highest priority."
      },
      {
        question: "The practical nurse is performing a skin assessment on a patient with suspected SJS. When gentle lateral pressure is applied to an erythematous area, the epidermis slides off. Which finding does this represent?",
        options: [
          "Cullen sign",
          "Nikolsky sign",
          "Brudzinski sign",
          "Trousseau sign"
        ],
        correct: 1,
        rationale: "A positive Nikolsky sign occurs when gentle lateral pressure on uninvolved or erythematous skin causes the epidermis to separate and slide off, indicating active epidermal detachment. This is a characteristic finding in SJS/TEN and pemphigus vulgaris. Cullen sign is periumbilical bruising, Brudzinski sign is a meningeal sign, and Trousseau sign is related to hypocalcemia."
      }
    ]
  },

  "stoma-care-rpn": {
    title: "Stoma Care for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of Ostomy Stomas",
      content: "An ostomy is a surgically created opening (stoma) on the abdominal wall through which a portion of the gastrointestinal or urinary tract is diverted to the body surface. The stoma is created by bringing a segment of bowel or ureter through the abdominal wall and suturing the mucosal surface to the skin (mucocutaneous junction). A healthy stoma appears beefy red and moist, similar in color and texture to the oral buccal mucosa, because it is composed of intestinal or urothelial mucosa with a rich vascular supply. There are three main types of ostomy. A colostomy involves diversion of a portion of the colon: ascending colostomy produces semi-liquid stool, transverse colostomy produces semi-formed stool, and descending or sigmoid colostomy produces formed stool most similar to normal bowel movements. An ileostomy involves diversion of the ileum (the last portion of the small intestine): output is liquid to semi-liquid and contains active digestive enzymes, making peristomal skin protection critical because the effluent is highly irritating and corrosive to skin. A urostomy (ileal conduit) is a urinary diversion in which a segment of ileum is used to create a conduit for urine drainage; both ureters are anastomosed to the ileal segment, which is then brought through the abdominal wall as a stoma. Urostomy output is continuous liquid urine. Understanding the type of ostomy determines nursing care priorities: ileostomy requires meticulous skin protection due to enzymatic effluent, colostomy care varies based on the location of the diversion and stool consistency, and urostomy requires management of continuous urine flow and prevention of urinary tract infections. Stoma assessment includes evaluating color (should be pink to beefy red), moisture (should be moist), size (expected to decrease over the first 6-8 weeks postoperatively as edema resolves), and peristomal skin integrity. The practical nurse must recognize and report complications including stoma necrosis (dusky, dark, or black discoloration indicating compromised blood supply), retraction (stoma sinks below skin level), prolapse (stoma protrudes excessively beyond the abdominal surface), parastomal hernia (bulging around the stoma), mucocutaneous separation (detachment of the stoma from surrounding skin), and peristomal skin breakdown from effluent contact."
    },
    riskFactors: [
      "Colorectal cancer (most common indication for permanent colostomy after abdominoperineal resection)",
      "Inflammatory bowel disease: Crohn disease or ulcerative colitis requiring bowel resection or fecal diversion",
      "Bladder cancer requiring radical cystectomy with urinary diversion (urostomy/ileal conduit)",
      "Bowel obstruction, perforation, or trauma requiring emergency fecal diversion",
      "Diverticular disease complicated by abscess, fistula, or perforation",
      "Obesity (increased difficulty with stoma management, higher risk of parastomal hernia)",
      "Diabetes mellitus (impaired wound healing, increased risk of peristomal skin breakdown and infection)"
    ],
    diagnostics: [
      "Direct visual assessment of stoma: evaluate color (pink to beefy red is normal), moisture (should be glistening and moist), edema (normal in first 6-8 weeks postoperatively), and function (passage of effluent)",
      "Peristomal skin assessment using a validated tool (DET score or SACS classification): document erythema, erosion, ulceration, maceration, or fungal infection around the stoma",
      "Stoma measurement: use a stoma measuring guide to size the pouching system accurately; remeasure every 1-2 weeks during the first 6-8 weeks as postoperative edema resolves and stoma size decreases",
      "Complete blood count: monitor for anemia (blood loss), leukocytosis (infection), and nutritional status indicators",
      "Serum electrolytes (especially potassium, sodium, magnesium, bicarbonate): ileostomy patients are at high risk for dehydration and electrolyte depletion due to high-volume liquid output",
      "Urine culture and sensitivity (for urostomy patients): mucus in the pouch is normal due to the ileal conduit, but cloudy, foul-smelling urine may indicate UTI"
    ],
    management: [
      "Select appropriate pouching system: one-piece or two-piece system with the stoma opening cut to within 1/8 inch (3 mm) of the stoma edge to protect peristomal skin while avoiding stoma constriction",
      "Empty the pouch when it is one-third to one-half full to prevent leakage from the weight of accumulated output and to maintain the pouch seal integrity",
      "Change the entire pouching system every 3-5 days for colostomy and ileostomy, or sooner if leakage occurs; urostomy pouches are typically changed every 3-5 days with overnight drainage connected to a bedside bag",
      "Protect peristomal skin with skin barrier products: stoma paste to fill skin creases and irregularities, skin barrier powder for denuded areas, and skin barrier rings (moldable rings) to create a level pouching surface",
      "Ileostomy patients: maintain adequate hydration (at least 8-10 glasses of fluid daily); monitor daily output (normal is 500-1000 mL/day; report if output exceeds 1500 mL/day or if signs of dehydration develop)",
      "Dietary modifications: ileostomy patients should chew food thoroughly, avoid high-fiber and stringy foods initially (risk of food bolus obstruction), and gradually reintroduce foods one at a time; colostomy patients may identify gas-producing foods to avoid"
    ],
    nursingActions: [
      "Assess stoma every shift in the immediate postoperative period: document color, size, moisture, edema, output characteristics, and peristomal skin condition; report any dusky, dark, or black discoloration immediately (indicates ischemia or necrosis)",
      "Perform pouching system changes using proper technique: cleanse peristomal skin with warm water only (no soap with moisturizers as it interferes with barrier adhesion), pat dry, apply skin barrier products as needed, and apply pouch with gentle pressure",
      "Monitor and document ostomy output: amount, color, consistency, and odor each shift; report absence of output for more than 6 hours (colostomy) or 4 hours (ileostomy) as this may indicate obstruction",
      "Assess for common complications: retraction (stoma below skin level), prolapse (excessive protrusion), parastomal hernia (bulging around stoma), mucocutaneous separation (stoma detaching from skin), and stenosis (narrowing of stoma opening)",
      "Provide patient education on self-care: demonstrate pouch emptying and changing technique, signs and symptoms to report, dietary guidance, activity modifications, and community resources (ostomy support groups, ostomy supply vendors)",
      "Reinforce teaching on when to seek medical attention: no ostomy output for 4-6 hours with cramping (possible obstruction), stoma color changes (dusky/black), peristomal skin breakdown not responding to basic interventions, signs of dehydration"
    ],
    assessmentFindings: [
      "Normal stoma appearance: beefy red to pink, moist, glistening, slightly edematous in the first 6-8 weeks postoperatively; bleeds slightly when touched (normal due to rich vascular supply)",
      "Normal colostomy output: varies by location -- ascending colostomy (liquid to semi-liquid), transverse (semi-formed to mushy), descending/sigmoid (soft to formed stool)",
      "Normal ileostomy output: liquid to semi-liquid, green to yellow-brown, contains digestive enzymes (highly irritating to skin), typically 500-1000 mL per day after adaptation",
      "Normal urostomy output: continuous urine drainage with small amounts of mucus (normal from the ileal conduit segment); urine should be clear to pale yellow",
      "Peristomal skin breakdown: erythema, erosion, maceration, or ulceration of the skin surrounding the stoma caused by effluent contact, adhesive trauma, or fungal infection",
      "Stoma necrosis: dusky, dark purple, brown, or black discoloration indicating compromised arterial blood supply to the stoma -- requires immediate physician notification"
    ],
    signs: {
      left: [
        "Mild peristomal erythema (redness) around the stoma base",
        "Normal postoperative stoma edema (swelling) that decreases over 6-8 weeks",
        "Small amount of bleeding when cleaning the stoma (normal due to vascular mucosa)",
        "Mild skin irritation from adhesive removal or effluent contact",
        "Temporary change in output consistency related to diet or medication changes",
        "Flatulence through the stoma (expected, especially postoperatively)"
      ],
      right: [
        "Stoma necrosis: dusky, dark, or black stoma color indicating ischemia",
        "No ostomy output for more than 4-6 hours with abdominal cramping and distension (possible obstruction)",
        "Stoma prolapse with inability to reduce (stoma protrudes significantly and cannot be gently pushed back)",
        "Mucocutaneous separation with purulent drainage (infection at the stoma-skin junction)",
        "Signs of dehydration in ileostomy patients: decreased urine output, tachycardia, orthostatic hypotension, elevated BUN/creatinine",
        "Severe peristomal skin breakdown with exposed subcutaneous tissue"
      ]
    },
    medications: [
      {
        name: "Stoma Powder (Stomahesive Protective Powder)",
        type: "Topical skin barrier / protective powder",
        action: "Absorbs moisture from denuded or weeping peristomal skin, creating a dry surface that allows the pouching system skin barrier to adhere; forms a protective layer over irritated or eroded skin to promote healing while maintaining pouch seal integrity",
        sideEffects: "Minimal systemic effects; excessive application may interfere with pouch adhesion; may cause minor irritation if applied to intact skin unnecessarily",
        contra: "Deep wounds or full-thickness skin breakdown (requires wound care consultation); known hypersensitivity to product components; should not be used as the sole intervention for infected peristomal skin",
        pearl: "Apply a light dusting to weeping or denuded peristomal skin, brush off excess powder, then seal with skin barrier spray or wipe (crusting technique: powder-seal-powder-seal for 2-3 layers); this creates a protective crust that promotes healing while maintaining pouch adhesion"
      },
      {
        name: "Skin Barrier Paste (Stomahesive Paste / Adapt Paste)",
        type: "Ostomy accessory / peristomal skin protectant",
        action: "Fills in skin creases, folds, and irregularities around the stoma to create a level pouching surface; contains pectin and karaya-based compounds that protect the skin from effluent contact and extend the wear time of the pouching system by improving the seal",
        sideEffects: "Contains alcohol (may sting on application to denuded skin); potential allergic contact dermatitis in sensitive individuals; may cause skin maceration if applied too thickly",
        contra: "Known allergy to product ingredients; deep or infected wounds (requires appropriate wound care first); should not be used as a standalone skin treatment without a pouching system",
        pearl: "Apply a thin bead around the stoma base or in skin creases to fill irregular contours; allow to set briefly before applying the pouching system; newer alcohol-free paste formulations are available and preferred for patients with denuded peristomal skin to reduce stinging"
      },
      {
        name: "Zinc Oxide Barrier Cream",
        type: "Topical skin protectant",
        action: "Creates a physical moisture barrier on the peristomal skin that repels liquid effluent; has mild astringent and antiseptic properties that soothe irritated skin and promote healing of superficial peristomal dermatitis",
        sideEffects: "May interfere with pouching system adhesion if applied too thickly under the barrier wafer; can be difficult to completely remove from skin; rare allergic reactions",
        contra: "Should not be applied under the pouching system adhesive barrier (interferes with adhesion); deep or infected wounds; known hypersensitivity",
        pearl: "Use zinc oxide cream on peristomal skin OUTSIDE the wafer adhesion area to protect skin from effluent that bypasses the pouch; for use UNDER the barrier, use stoma powder and barrier spray/wipe instead (crusting technique); zinc oxide can also be applied to the skin between the stoma and the pouch opening if using a two-piece system with a moldable ring"
      }
    ],
    pearls: [
      "A healthy stoma should look like the inside of your cheek -- beefy red, moist, and glistening; any color change toward dusky, purple, brown, or black indicates ischemia and must be reported immediately",
      "The stoma has no sensory nerve endings, so touching or cleaning it does not cause pain; however, peristomal skin IS innervated and will be painful if damaged by effluent contact",
      "The key difference between ileostomy and colostomy care: ileostomy effluent contains active digestive enzymes that will rapidly erode peristomal skin, making skin protection the highest priority; colostomy output is less caustic",
      "Empty the pouch when one-third to one-half full -- a heavy pouch pulls on the skin barrier seal, causing leakage and subsequent skin breakdown",
      "Ileostomy patients are at HIGH risk for dehydration and electrolyte imbalances because the colon (where most water absorption occurs) has been bypassed; teach patients to monitor for signs of dehydration and maintain high fluid intake",
      "The crusting technique (powder-seal-powder-seal) is essential for managing denuded peristomal skin: apply stoma powder to weeping skin, brush off excess, seal with skin barrier spray or wipe, and repeat for 2-3 layers before applying the pouching system",
      "Post-operative stoma size changes significantly during the first 6-8 weeks as edema resolves; patients must remeasure and resize their pouching system regularly to maintain proper fit and prevent skin exposure to effluent"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient's colostomy stoma on postoperative day 2 and notes that it appears dark purple in color. What is the priority nursing action?",
        options: [
          "Document the finding and reassess in 4 hours",
          "Apply a warm compress to improve circulation to the stoma",
          "Report the finding to the registered nurse or physician immediately",
          "Irrigate the stoma with normal saline to improve blood flow"
        ],
        correct: 2,
        rationale: "A dark purple stoma indicates compromised blood supply (ischemia) and potential necrosis, which is a serious surgical complication requiring immediate physician notification. A healthy stoma should be beefy red and moist. Delaying reporting could result in tissue death and the need for stoma revision surgery."
      },
      {
        question: "A patient with a new ileostomy asks why their peristomal skin is red and irritated. Which explanation by the practical nurse is most accurate?",
        options: [
          "Ileostomy output contains digestive enzymes that damage the skin on contact",
          "The pouch adhesive is causing an allergic reaction",
          "Some skin irritation is expected and does not require intervention",
          "The stoma is infected and requires antibiotic treatment"
        ],
        correct: 0,
        rationale: "Ileostomy effluent contains active digestive enzymes (from the small intestine) that are highly irritating and corrosive to peristomal skin. This is why skin protection is the highest priority in ileostomy care. The pouching system must be fitted accurately (within 1/8 inch of the stoma edge) to minimize skin exposure to effluent."
      },
      {
        question: "When should the practical nurse empty a patient's ostomy pouch?",
        options: [
          "When the pouch is completely full",
          "Only during scheduled dressing change times",
          "When the pouch is one-third to one-half full",
          "Every hour regardless of the amount of output"
        ],
        correct: 2,
        rationale: "The ostomy pouch should be emptied when it is one-third to one-half full. A full or overly heavy pouch places tension on the skin barrier seal, which can cause it to detach and result in leakage and peristomal skin breakdown. Waiting until the pouch is completely full increases the risk of pouch failure."
      }
    ]
  },

  "subacute-thyroiditis-rpn": {
    title: "Subacute Thyroiditis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Subacute (De Quervain) Thyroiditis",
      content: "Subacute thyroiditis, also known as De Quervain thyroiditis, subacute granulomatous thyroiditis, or giant cell thyroiditis, is a self-limiting inflammatory disorder of the thyroid gland most commonly triggered by a viral upper respiratory infection. It is the most common cause of a painful thyroid gland. The condition occurs when a viral infection (most commonly Coxsackievirus, adenovirus, mumps, influenza, or Epstein-Barr virus) triggers an inflammatory immune response within the thyroid gland. The inflammatory infiltrate consists of multinucleated giant cells, lymphocytes, and macrophages that form characteristic granulomas within the thyroid follicles. This inflammatory destruction of thyroid follicles causes the release of preformed thyroid hormones (T3 and T4) and thyroglobulin from damaged follicular cells into the bloodstream. The disease follows a classic TRIPHASIC course. Phase 1 (Thyrotoxic phase, lasting 3-6 weeks): Destruction of thyroid follicles releases stored thyroid hormones, causing elevated serum T3 and T4 with suppressed thyroid-stimulating hormone (TSH). Patients experience symptoms of thyrotoxicosis (tachycardia, anxiety, tremor, heat intolerance, weight loss) along with a painful, tender, and enlarged thyroid gland. The pain often radiates to the jaw, ear, or throat and may be mistaken for pharyngitis or dental pain. Phase 2 (Hypothyroid phase, lasting 2-8 weeks): After the stored hormones are depleted and the damaged follicles cannot produce new thyroid hormones, patients develop transient hypothyroidism with elevated TSH and low T3/T4. Symptoms include fatigue, cold intolerance, constipation, weight gain, and dry skin. Phase 3 (Recovery phase): The thyroid gland gradually regenerates and resumes normal hormone production. Approximately 90-95% of patients recover full thyroid function within 6-12 months. However, 5-10% of patients develop permanent hypothyroidism requiring lifelong levothyroxine replacement. A key diagnostic feature is a markedly elevated erythrocyte sedimentation rate (ESR), often greater than 50 mm/hr, which is unusual for other thyroid conditions. Radioactive iodine uptake (RAIU) is characteristically LOW (less than 5%) during the thyrotoxic phase because the thyroid follicles are damaged and cannot trap iodine -- this distinguishes subacute thyroiditis from Graves disease, where RAIU is elevated. Treatment is supportive and directed at symptom management: NSAIDs or corticosteroids (prednisone) for thyroid pain and inflammation, beta-blockers (propranolol) for thyrotoxic symptoms in Phase 1, and levothyroxine replacement if symptomatic hypothyroidism develops in Phase 2."
    },
    riskFactors: [
      "Recent viral upper respiratory infection (most common trigger, typically 2-6 weeks before onset)",
      "Female sex (4:1 female-to-male ratio, peak incidence age 30-50 years)",
      "HLA-Bw35 genetic marker (associated with increased susceptibility)",
      "Summer and fall seasons (correlate with peaks in enteroviral infections)",
      "History of autoimmune thyroid disease (Hashimoto or Graves -- increases susceptibility to thyroid inflammation)",
      "COVID-19 infection (emerging as a recognized trigger for subacute thyroiditis)"
    ],
    diagnostics: [
      "Erythrocyte sedimentation rate (ESR): markedly elevated, often greater than 50 mm/hr; the most characteristic laboratory finding -- an elevated ESR in the setting of thyrotoxicosis with thyroid pain strongly suggests subacute thyroiditis",
      "C-reactive protein (CRP): elevated, confirming systemic inflammation; used alongside ESR to monitor treatment response",
      "Thyroid function tests: Phase 1 shows elevated free T4 and free T3 with suppressed TSH (thyrotoxicosis); Phase 2 shows low free T4 with elevated TSH (hypothyroidism); Phase 3 shows normalized values",
      "Thyroglobulin level: elevated due to release from damaged thyroid follicles; helps confirm destructive thyroiditis",
      "Radioactive iodine uptake (RAIU): characteristically LOW (less than 5%) during the thyrotoxic phase because damaged follicles cannot trap iodine -- this distinguishes subacute thyroiditis from Graves disease (where RAIU is elevated)",
      "Thyroid ultrasound: shows diffusely hypoechoic areas corresponding to inflammation; reduced vascularity on Doppler (unlike Graves disease which shows increased vascularity)"
    ],
    management: [
      "Mild cases: NSAIDs (naproxen 500 mg twice daily or ibuprofen 600 mg three times daily) for pain and inflammation; usually sufficient for mild thyroid tenderness",
      "Moderate to severe cases: prednisone 40 mg daily with gradual taper over 4-6 weeks for significant thyroid pain unresponsive to NSAIDs; pain relief within 24-48 hours of starting prednisone (characteristic response that supports the diagnosis)",
      "Thyrotoxic phase (Phase 1): propranolol 20-40 mg three to four times daily to manage tachycardia, tremor, anxiety, and palpitations; antithyroid drugs (methimazole, PTU) are NOT effective because thyrotoxicosis is caused by hormone release from damaged tissue, not by new hormone synthesis",
      "Hypothyroid phase (Phase 2): levothyroxine replacement only if the patient is symptomatic; dose is typically lower than standard replacement (25-50 mcg daily); may be discontinued once thyroid function recovers",
      "Follow-up thyroid function tests every 4-6 weeks to monitor progression through the triphasic course and guide treatment adjustments",
      "Patient education: reassure patients that the condition is self-limiting in 90-95% of cases with full recovery expected within 6-12 months; discuss the triphasic course so patients understand changing symptoms"
    ],
    nursingActions: [
      "Assess thyroid gland tenderness: note location (often begins unilateral then migrates), severity using a pain scale, and radiation pattern (jaw, ear, or throat); document changes each shift",
      "Monitor vital signs with particular attention to heart rate: tachycardia during the thyrotoxic phase and bradycardia during the hypothyroid phase; report significant deviations from baseline",
      "Monitor for symptoms of thyrotoxicosis during Phase 1: tachycardia, palpitations, anxiety, tremor, diaphoresis, heat intolerance, weight loss, and insomnia; reinforce teaching about expected symptom timeline",
      "Monitor for symptoms of hypothyroidism during Phase 2: fatigue, cold intolerance, constipation, weight gain, dry skin, and decreased energy; report to the physician for potential levothyroxine initiation",
      "Administer medications as ordered and monitor effectiveness: assess pain level before and after NSAID or prednisone administration; assess heart rate before and after propranolol administration (hold if heart rate less than 60 bpm)",
      "Reinforce teaching about medication compliance: prednisone must be tapered gradually (never stopped abruptly to avoid adrenal crisis); propranolol should not be stopped abruptly (risk of rebound tachycardia)"
    ],
    assessmentFindings: [
      "Thyroid pain and tenderness: the hallmark finding; pain is often severe, located in the anterior neck, and may radiate to the jaw, ears, or throat; the thyroid gland is firm and tender on palpation",
      "Thyrotoxic symptoms (Phase 1): tachycardia (heart rate over 100 bpm), fine hand tremor, anxiety, heat intolerance, diaphoresis, weight loss despite normal appetite, insomnia",
      "Fever: low-grade to moderate fever (38-39C) is common during the acute phase, reflecting the underlying inflammatory process",
      "Hypothyroid symptoms (Phase 2): fatigue, cold intolerance, constipation, dry skin, periorbital edema, weight gain, bradycardia, depressed mood",
      "Dysphagia or odynophagia (painful swallowing): occurs when thyroid inflammation and swelling compress or irritate the esophagus",
      "Recent history of upper respiratory infection: patients often report a viral illness (sore throat, cough, myalgias) 2-6 weeks before the onset of thyroid pain"
    ],
    signs: {
      left: [
        "Mild anterior neck discomfort or tenderness",
        "Low-grade fever following a recent viral illness",
        "Mild fatigue or malaise",
        "Slight tachycardia during the thyrotoxic phase",
        "Mild anxiety or irritability",
        "Mildly elevated ESR on laboratory testing"
      ],
      right: [
        "Severe thyrotoxicosis: heart rate over 120 bpm with palpitations and chest pain",
        "Thyroid storm symptoms (rare): high fever, severe tachycardia, altered mental status, vomiting",
        "Airway compromise from significant thyroid swelling (very rare)",
        "Severe dysphagia preventing adequate oral intake",
        "Symptomatic hypotension during hypothyroid phase",
        "Prolonged hypothyroid phase suggesting permanent thyroid failure"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Potent anti-inflammatory agent that suppresses the inflammatory cascade in the thyroid gland by inhibiting phospholipase A2, reducing prostaglandin and leukotriene synthesis, suppressing cytokine production, and decreasing inflammatory cell migration into the thyroid tissue; dramatically reduces thyroid pain and tenderness, typically within 24-48 hours",
        sideEffects: "Hyperglycemia (especially in diabetic patients), immunosuppression, fluid retention, hypertension, insomnia, mood changes (euphoria, irritability, depression), increased appetite, weight gain, gastric irritation, osteoporosis with prolonged use",
        contra: "Active untreated systemic infections; live vaccine administration during therapy; uncontrolled diabetes (relative); peptic ulcer disease (use with PPI protection); use with caution in hypertension and heart failure",
        pearl: "Dramatic pain relief within 24-48 hours of starting prednisone is so characteristic of subacute thyroiditis that it serves as a diagnostic clue; typical starting dose is 40 mg daily tapered over 4-6 weeks; relapse of thyroid pain during taper occurs in approximately 20% of patients (may require re-escalation of dose); NEVER stop abruptly after more than 7-10 days of use (risk of adrenal crisis)"
      },
      {
        name: "Propranolol (Inderal)",
        type: "Non-selective beta-adrenergic blocker",
        action: "Blocks beta-1 receptors in the heart (reducing heart rate, contractility, and cardiac output) and beta-2 receptors in peripheral tissues; also inhibits peripheral conversion of T4 to the more active T3; provides symptomatic relief of thyrotoxic symptoms without affecting the underlying thyroid disease process",
        sideEffects: "Bradycardia, hypotension, fatigue, dizziness, bronchospasm (in patients with asthma or COPD), cold extremities, masking of hypoglycemia symptoms in diabetic patients, depression, vivid dreams",
        contra: "Asthma or severe COPD (bronchospasm risk from beta-2 blockade); symptomatic bradycardia (heart rate less than 60 bpm); second- or third-degree heart block; decompensated heart failure; severe peripheral arterial disease",
        pearl: "Used during the thyrotoxic phase (Phase 1) ONLY for symptomatic relief; dose is 20-40 mg three to four times daily; always check heart rate and blood pressure before administration -- hold if heart rate is less than 60 bpm or systolic BP less than 90 mmHg; discontinue once thyrotoxic phase resolves; taper gradually if used for more than 2 weeks (risk of rebound tachycardia)"
      },
      {
        name: "Levothyroxine (Synthroid/Eltroxin)",
        type: "Synthetic thyroid hormone (T4) replacement",
        action: "Provides exogenous thyroxine (T4) to replace deficient endogenous thyroid hormone production during the hypothyroid phase; T4 is peripherally converted to the active form T3 by deiodinase enzymes; restores metabolic rate, thermoregulation, and normal physiological function",
        sideEffects: "Symptoms of iatrogenic hyperthyroidism if dose is too high: tachycardia, palpitations, weight loss, insomnia, heat intolerance, tremor, anxiety, diarrhea; chronic overreplacement increases risk of atrial fibrillation and osteoporosis",
        contra: "Untreated adrenal insufficiency (must correct cortisol deficiency before starting thyroid replacement to avoid adrenal crisis); recent myocardial infarction; thyrotoxicosis (do not add thyroid hormone during Phase 1)",
        pearl: "Only indicated during the hypothyroid phase (Phase 2) IF the patient is symptomatic; use a low dose (25-50 mcg daily) since the hypothyroidism is expected to be transient; take on an empty stomach 30-60 minutes before breakfast; separate from calcium, iron, and antacids by at least 4 hours; recheck TSH every 6-8 weeks; attempt to discontinue after 6-12 months to assess for thyroid recovery"
      }
    ],
    pearls: [
      "Subacute thyroiditis follows a TRIPHASIC course: Phase 1 (thyrotoxicosis with pain, 3-6 weeks) -> Phase 2 (hypothyroidism, 2-8 weeks) -> Phase 3 (recovery, full function returns in 90-95% of patients)",
      "The combination of a PAINFUL thyroid gland + elevated ESR + thyrotoxicosis is the classic triad of subacute thyroiditis -- this presentation is highly specific",
      "Radioactive iodine uptake (RAIU) is LOW in subacute thyroiditis because damaged follicles cannot trap iodine; this is the key distinction from Graves disease, where RAIU is elevated",
      "Antithyroid drugs (methimazole, PTU) are NOT effective in subacute thyroiditis because the thyrotoxicosis is caused by RELEASE of preformed hormones from damaged tissue, not by increased hormone SYNTHESIS",
      "Dramatic pain relief within 24-48 hours of starting prednisone is so characteristic that it essentially confirms the diagnosis -- if pain does not respond to prednisone, reconsider the diagnosis",
      "Approximately 20% of patients experience a relapse of thyroid pain during prednisone taper; this does not indicate treatment failure -- re-escalate the dose and taper more slowly",
      "5-10% of patients develop permanent hypothyroidism requiring lifelong levothyroxine -- follow-up thyroid function tests at 6 and 12 months are essential to identify these patients"
    ],
    quiz: [
      {
        question: "A patient presents with severe anterior neck pain radiating to the jaw, fever, and tachycardia three weeks after an upper respiratory infection. Laboratory results show elevated ESR, elevated free T4, and suppressed TSH. Which condition does the practical nurse recognize?",
        options: [
          "Graves disease",
          "Hashimoto thyroiditis",
          "Subacute (De Quervain) thyroiditis",
          "Thyroid carcinoma"
        ],
        correct: 2,
        rationale: "The classic presentation of subacute thyroiditis includes a painful, tender thyroid gland following a viral illness, with markedly elevated ESR and thyrotoxic laboratory values (elevated free T4, suppressed TSH). Graves disease causes painless thyrotoxicosis. Hashimoto thyroiditis is typically painless and causes hypothyroidism. Thyroid carcinoma usually presents as a painless nodule."
      },
      {
        question: "A patient with subacute thyroiditis is in Phase 1 (thyrotoxic phase). The physician orders propranolol. Before administering the medication, which assessment is MOST important for the practical nurse to perform?",
        options: [
          "Assess thyroid gland size and tenderness",
          "Check heart rate and blood pressure",
          "Review the most recent ESR result",
          "Assess the patient's temperature"
        ],
        correct: 1,
        rationale: "Propranolol is a beta-blocker that reduces heart rate. Before administration, the practical nurse must check the heart rate and blood pressure. The medication should be held if the heart rate is less than 60 bpm or systolic blood pressure is less than 90 mmHg to prevent symptomatic bradycardia and hypotension."
      },
      {
        question: "A patient with subacute thyroiditis is being discharged on a prednisone taper. Which statement by the patient indicates the need for further teaching?",
        options: [
          "I will take this medication with food to reduce stomach irritation",
          "I can stop taking this medication whenever my pain goes away",
          "I will monitor my blood sugar more frequently while on this medication",
          "I should report any signs of infection while taking this medication"
        ],
        correct: 1,
        rationale: "Prednisone must be tapered gradually and should never be stopped abruptly, even if symptoms improve. Abrupt discontinuation after more than 7-10 days of use can cause adrenal crisis because the hypothalamic-pituitary-adrenal (HPA) axis has been suppressed by exogenous corticosteroid use. The patient should follow the prescribed taper schedule."
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
