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
  "pemphigus-rpn": {
    title: "Pemphigus: Autoimmune Blistering Disease for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Pemphigus Vulgaris",
      content: "Pemphigus is a group of rare, potentially life-threatening autoimmune blistering diseases characterized by the production of immunoglobulin G (IgG) autoantibodies directed against desmogleins, which are transmembrane glycoproteins essential for cell-to-cell adhesion in the epidermis. Desmogleins are components of desmosomes, the intercellular junctions that hold keratinocytes together. In pemphigus vulgaris (PV), the most common and clinically significant form, IgG autoantibodies target desmoglein 3 (found predominantly in mucosal epithelium) and desmoglein 1 (found in the superficial epidermis). When these autoantibodies bind to desmogleins, they disrupt desmosomal adhesion through a process called acantholysis -- the loss of intercellular connections between keratinocytes. This results in intraepidermal blister formation, meaning the separation occurs within the epidermis rather than at the dermal-epidermal junction. The blisters in pemphigus are characteristically flaccid (soft and easily ruptured) because they form within the thin epidermal layers, unlike the tense blisters of bullous pemphigoid which form at the basement membrane zone. A hallmark clinical sign is the positive Nikolsky sign: when lateral pressure is applied to apparently normal skin adjacent to a blister, the superficial epidermis separates and slides away, confirming the fragility of intercellular connections. The oral mucosa is frequently the first site affected, with painful erosions appearing weeks to months before skin involvement. The disease follows a chronic relapsing course and, before the advent of corticosteroid therapy, carried a mortality rate exceeding 75 percent, primarily from secondary infection and fluid/electrolyte losses through denuded skin. The pathogenesis involves both genetic susceptibility (particularly HLA-DRB1 alleles) and environmental triggers. The practical nurse plays a critical role in monitoring skin integrity, managing wound care for denuded areas, preventing secondary infection, administering immunosuppressive therapy as ordered, and reporting changes in lesion extent or signs of complications such as sepsis."
    },
    riskFactors: [
      "Middle-aged adults (40-60 years) with highest incidence; rare in children",
      "Ashkenazi Jewish and Mediterranean descent (genetic predisposition via HLA-DRB1 alleles)",
      "Use of certain medications that can trigger drug-induced pemphigus (penicillamine, captopril, rifampin)",
      "Concurrent autoimmune conditions (myasthenia gravis, thymoma, lupus erythematosus)",
      "Physical triggers including burns, ultraviolet radiation, and surgical procedures at wound sites",
      "Emotional and physiological stress as potential disease flare triggers",
      "Immunocompromised states that may unmask latent autoimmune processes"
    ],
    diagnostics: [
      "Skin biopsy with histopathology: demonstrates intraepidermal acantholysis (separation of keratinocytes within the epidermis) with intact basal layer; suprabasal cleft formation is characteristic of pemphigus vulgaris",
      "Direct immunofluorescence (DIF) of perilesional skin: gold standard diagnostic test showing intercellular IgG and C3 deposits in a characteristic 'chicken-wire' or 'fishnet' pattern between keratinocytes",
      "Indirect immunofluorescence: detects circulating anti-desmoglein antibodies in serum; titer correlates with disease activity and can be used to monitor treatment response",
      "ELISA (enzyme-linked immunosorbent assay) for anti-desmoglein 1 and anti-desmoglein 3 antibodies: quantitative measurement used for diagnosis and disease monitoring",
      "Complete blood count: may show leukocytosis from secondary infection or eosinophilia; baseline needed before immunosuppressive therapy",
      "Wound culture and sensitivity: obtained from denuded areas when secondary bacterial infection is suspected; Staphylococcus aureus is the most common pathogen"
    ],
    management: [
      "High-dose systemic corticosteroids (prednisone 1-2 mg/kg/day) as initial treatment to suppress autoantibody production and halt blister formation",
      "Steroid-sparing immunosuppressive agents added early to allow corticosteroid dose reduction and minimize long-term steroid side effects",
      "Meticulous wound care for denuded areas using non-adherent dressings, gentle cleansing with sterile saline, and application of prescribed topical agents",
      "Pain management before wound care procedures and meals (oral lesions cause significant pain during eating)",
      "Nutritional support with high-protein, high-calorie diet; soft foods and liquid supplements when oral erosions limit intake",
      "Infection prevention with strict hand hygiene, sterile wound care technique, and monitoring for signs of secondary bacterial infection",
      "Fluid and electrolyte monitoring with strict intake and output documentation; large denuded areas cause significant fluid and protein loss similar to burn patients"
    ],
    nursingActions: [
      "Perform comprehensive skin assessment every shift documenting location, size, number of blisters and erosions, and percentage of body surface area affected",
      "Test for Nikolsky sign by applying gentle lateral pressure to skin adjacent to a blister; report positive finding (epidermal separation) to the physician",
      "Administer prescribed immunosuppressive medications on schedule and monitor for side effects including infection, hyperglycemia, and bone marrow suppression",
      "Provide gentle wound care using non-adherent dressings; avoid adhesive tape directly on fragile skin; use rolled gauze or tubular netting to secure dressings",
      "Monitor oral mucosa before each meal and provide prescribed oral rinses (such as viscous lidocaine) to facilitate nutrition",
      "Weigh patient daily at the same time using the same scale to monitor fluid status and nutritional adequacy",
      "Report signs of secondary infection (increased erythema, purulent drainage, fever, elevated WBC) immediately to the supervising nurse or physician"
    ],
    assessmentFindings: [
      "Flaccid (soft, easily ruptured) blisters on skin and mucous membranes that rupture spontaneously leaving painful, raw, denuded erosions that are slow to heal",
      "Positive Nikolsky sign: gentle lateral pressure on apparently normal skin causes the epidermis to separate and slide, confirming loss of intercellular adhesion",
      "Oral erosions: painful, irregular, shallow ulcerations on buccal mucosa, palate, tongue, and gingiva; often the first manifestation appearing weeks before skin lesions",
      "Asboe-Hansen sign (bulla spread sign): gentle pressure on top of an existing blister causes it to extend laterally into adjacent uninvolved skin",
      "Pain assessment: patients report significant pain especially with oral lesions that interfere with eating, drinking, and oral hygiene",
      "Weight loss and malnutrition from decreased oral intake due to painful mucosal erosions",
      "Signs of secondary infection: increased erythema surrounding erosions, purulent exudate, fever, and foul odor from wounds"
    ],
    signs: {
      left: [
        "New blister formation on previously unaffected skin",
        "Mild pain at erosion sites",
        "Difficulty eating due to oral erosions",
        "Slow healing of existing erosions",
        "Mild perilesional erythema",
        "Decreased oral intake with stable weight"
      ],
      right: [
        "Rapidly spreading blisters affecting more than 20 percent body surface area",
        "Positive Nikolsky sign on widespread skin areas",
        "Signs of sepsis (fever, tachycardia, hypotension, altered mental status)",
        "Purulent drainage from denuded areas indicating secondary infection",
        "Significant weight loss exceeding 5 percent in one week",
        "Electrolyte imbalances from extensive fluid and protein loss through denuded skin"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic corticosteroid / immunosuppressant",
        action: "Suppresses the immune response by inhibiting nuclear factor-kappa B (NF-kB) and reducing production of pro-inflammatory cytokines, prostaglandins, and leukotrienes. In pemphigus, high doses suppress autoantibody production against desmogleins and reduce the inflammatory cascade driving acantholysis and blister formation.",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), immunosuppression (increased infection risk), osteoporosis (long-term), hypertension, cushingoid features (moon face, buffalo hump, central obesity), peptic ulcer disease, mood changes, cataracts, adrenal suppression",
        contra: "Active systemic fungal infection; live vaccine administration; uncontrolled diabetes mellitus; active peptic ulcer disease without concurrent gastroprotection",
        pearl: "Never discontinue abruptly after prolonged use due to risk of adrenal crisis; must be tapered gradually. Administer with food and concurrent proton pump inhibitor for gastroprotection. Monitor blood glucose at least four times daily during initial high-dose therapy."
      },
      {
        name: "Rituximab (Rituxan)",
        type: "Monoclonal antibody / anti-CD20 B-cell depleting agent",
        action: "Binds to CD20 antigen on the surface of pre-B and mature B lymphocytes, causing B-cell depletion through complement-dependent cytotoxicity, antibody-dependent cellular cytotoxicity, and direct apoptosis. By depleting B cells, it reduces production of the pathogenic anti-desmoglein autoantibodies responsible for acantholysis in pemphigus.",
        sideEffects: "Infusion reactions (fever, chills, rigors, hypotension, bronchospasm -- most common during first infusion), severe immunosuppression with increased risk of opportunistic infections, progressive multifocal leukoencephalopathy (rare but fatal), hepatitis B reactivation, hypogammaglobulinemia",
        contra: "Active severe infection; severe immunodeficiency; hepatitis B carriers without antiviral prophylaxis; known hypersensitivity to murine proteins",
        pearl: "Screen for hepatitis B and tuberculosis before initiating therapy. Premedicate with acetaminophen, diphenhydramine, and methylprednisolone to reduce infusion reactions. Monitor vital signs every 15 minutes during infusion. Hold live vaccines for at least 12 months after last dose."
      },
      {
        name: "Mycophenolate Mofetil (CellCept)",
        type: "Immunosuppressant / antimetabolite (inosine monophosphate dehydrogenase inhibitor)",
        action: "Inhibits inosine monophosphate dehydrogenase (IMPDH), blocking the de novo synthesis of guanosine nucleotides required for lymphocyte proliferation. Because T and B lymphocytes depend almost exclusively on the de novo pathway (unlike other cell types that can use salvage pathways), mycophenolate selectively suppresses lymphocyte proliferation and autoantibody production.",
        sideEffects: "GI disturbances (nausea, vomiting, diarrhea -- most common reason for dose adjustment), leukopenia, anemia, thrombocytopenia, increased infection risk, teratogenicity (pregnancy category X)",
        contra: "Pregnancy and breastfeeding (teratogenic); hypersensitivity to mycophenolic acid; concurrent use with azathioprine (overlapping mechanism increases toxicity)",
        pearl: "Obtain pregnancy test before starting in women of childbearing age; two forms of contraception required. Monitor CBC every 2 weeks for the first 3 months then monthly. Take on an empty stomach for optimal absorption. Report persistent diarrhea or signs of infection immediately."
      }
    ],
    pearls: [
      "Pemphigus blisters are FLACCID (soft, easily ruptured) and form WITHIN the epidermis (intraepidermal) -- this distinguishes them from bullous pemphigoid blisters which are TENSE and form at the dermal-epidermal junction (subepidermal)",
      "Nikolsky sign is a hallmark: lateral pressure on normal-appearing skin causes the epidermis to separate and slide -- always report a positive Nikolsky sign as it confirms active disease and epidermal fragility",
      "Oral mucosa is typically the FIRST site affected in pemphigus vulgaris -- painful oral erosions may precede skin blisters by weeks to months; inspect the oral cavity at every assessment",
      "Treat denuded skin like a burn wound: use non-adherent dressings, maintain strict asepsis, monitor fluid and protein losses, and ensure adequate nutritional support with high-protein diet",
      "Never use adhesive tape directly on pemphigus skin -- the adhesive will strip the fragile epidermis and extend the wound; use rolled gauze, tubular netting, or self-adherent wraps instead",
      "Patients on high-dose corticosteroids require glucose monitoring at least every 6 hours -- steroid-induced hyperglycemia is extremely common and may require sliding scale insulin coverage",
      "Rituximab has become a first-line treatment for moderate-to-severe pemphigus; infusion reactions are most common during the FIRST infusion and can be minimized with premedication"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with pemphigus vulgaris. Which assessment finding is most characteristic of this condition?",
        options: [
          "Tense, fluid-filled blisters that are difficult to rupture",
          "Flaccid blisters that rupture easily leaving painful denuded erosions",
          "Raised, scaly plaques with silvery scales on extensor surfaces",
          "Small, grouped vesicles on an erythematous base in a dermatomal pattern"
        ],
        correct: 1,
        rationale: "Pemphigus vulgaris produces flaccid (soft) blisters that rupture very easily because they form within the epidermis (intraepidermal acantholysis). The ruptured blisters leave painful, raw, denuded erosions. Tense blisters are characteristic of bullous pemphigoid (subepidermal), scaly plaques describe psoriasis, and dermatomal vesicles describe herpes zoster."
      },
      {
        question: "The practical nurse applies gentle lateral pressure to skin adjacent to a blister on a patient with suspected pemphigus, and the epidermis separates and slides. Which clinical sign has been demonstrated?",
        options: [
          "Trousseau sign",
          "Brudzinski sign",
          "Nikolsky sign",
          "Homans sign"
        ],
        correct: 2,
        rationale: "Nikolsky sign is positive when gentle lateral pressure on apparently normal skin causes the superficial epidermis to separate and slide, confirming the loss of intercellular adhesion (acantholysis) characteristic of pemphigus. Trousseau sign relates to hypocalcemia, Brudzinski sign relates to meningeal irritation, and Homans sign (unreliable) was historically associated with deep vein thrombosis."
      },
      {
        question: "A patient with pemphigus vulgaris is receiving high-dose prednisone therapy. Which monitoring action is most important for the practical nurse to perform?",
        options: [
          "Check serum calcium levels weekly",
          "Monitor blood glucose at least every 6 hours",
          "Assess for signs of hypothyroidism daily",
          "Obtain daily serum potassium levels"
        ],
        correct: 1,
        rationale: "High-dose corticosteroid therapy commonly causes steroid-induced hyperglycemia by increasing hepatic gluconeogenesis and decreasing peripheral glucose uptake. Blood glucose should be monitored at least every 6 hours during initial high-dose therapy, and sliding scale insulin may be required. While electrolyte monitoring is also important, hyperglycemia is the most immediate and common complication requiring frequent monitoring."
      }
    ]
  },

  "peritoneal-dialysis-basics-rpn": {
    title: "Peritoneal Dialysis Basics for Practical Nurses",
    cellular: {
      title: "Physiology of Peritoneal Dialysis",
      content: "Peritoneal dialysis (PD) is a renal replacement therapy that uses the peritoneal membrane as a natural semipermeable dialyzer to remove waste products, excess fluid, and electrolytes from the blood in patients with end-stage renal disease (ESRD). The peritoneal membrane lines the abdominal cavity and covers the abdominal organs, providing a surface area of approximately 1 to 2 square meters. This membrane consists of three layers: the mesothelium (a single layer of mesothelial cells), the interstitium (connective tissue containing blood vessels), and the capillary endothelium. Dialysis occurs when sterile dialysate solution is instilled into the peritoneal cavity through a surgically placed catheter (typically a Tenckhoff catheter). Three physiological processes drive peritoneal dialysis: diffusion, osmosis, and ultrafiltration. Diffusion moves uremic waste products (urea, creatinine, potassium) from the peritoneal capillary blood across the membrane into the dialysate, driven by the concentration gradient between blood and fresh dialysate. Osmosis moves water from the blood into the dialysate, driven by the osmotic gradient created by the dextrose (glucose) concentration in the dialysate -- higher dextrose concentrations (1.5%, 2.5%, or 4.25%) create greater osmotic pull and remove more fluid. Ultrafiltration refers to the net fluid removal achieved through this osmotic gradient. The peritoneal dialysis cycle consists of three phases: fill (instillation of 1.5 to 3 liters of dialysate into the peritoneal cavity over approximately 10 minutes), dwell (the period during which dialysate remains in the peritoneal cavity and solute exchange occurs, typically 4 to 8 hours for continuous ambulatory peritoneal dialysis), and drain (gravity drainage of the spent dialysate, which should take approximately 20 to 30 minutes). There are two primary modalities: continuous ambulatory peritoneal dialysis (CAPD), performed manually by the patient with 4 to 5 exchanges per day, and automated peritoneal dialysis (APD), which uses a cycler machine to perform multiple exchanges overnight while the patient sleeps. The most serious complication is peritonitis, infection of the peritoneal cavity, which presents with cloudy effluent, abdominal pain, and fever. The practical nurse must be proficient in catheter site assessment, effluent assessment, aseptic technique during exchanges, and recognition of complications to ensure safe and effective treatment."
    },
    riskFactors: [
      "End-stage renal disease (ESRD) with GFR below 15 mL/min requiring renal replacement therapy",
      "Diabetes mellitus as the leading cause of ESRD and a risk factor for peritonitis due to hyperglycemia-related immune dysfunction",
      "Hypertension as the second most common cause of ESRD and ongoing cardiovascular risk factor during dialysis",
      "Prior abdominal surgery with adhesions that reduce effective peritoneal membrane surface area",
      "Immunocompromised state increasing susceptibility to peritonitis and exit-site infections",
      "Poor hand hygiene technique or contaminated exchange procedure increasing peritonitis risk",
      "Obesity complicating catheter placement, increasing intra-abdominal pressure, and reducing dialysis efficiency"
    ],
    diagnostics: [
      "Peritoneal effluent cell count and differential: normal effluent is clear and straw-colored; WBC count greater than 100 cells/microL with more than 50% neutrophils is diagnostic for peritonitis",
      "Effluent culture and Gram stain: identifies causative organism in peritonitis; most common pathogens are coagulase-negative staphylococci and Staphylococcus aureus from touch contamination",
      "Peritoneal equilibration test (PET): determines peritoneal membrane transport characteristics (high, high-average, low-average, low transporter) to guide prescription individualization",
      "Blood urea nitrogen (BUN) and serum creatinine: monitored regularly to assess adequacy of dialysis; trending values guide prescription adjustments",
      "Serum albumin: indicator of nutritional status and predictor of outcomes; protein losses through the peritoneal membrane contribute to hypoalbuminemia in PD patients",
      "Serum glucose: must be monitored closely because dextrose in dialysate is absorbed systemically, causing hyperglycemia especially with higher concentration solutions"
    ],
    management: [
      "Perform CAPD exchanges using strict aseptic technique: 4-5 exchanges daily with typical dwell times of 4-6 hours during the day and 8-10 hours overnight",
      "Select appropriate dialysate dextrose concentration based on fluid removal needs: 1.5% (isotonic, minimal fluid removal), 2.5% (moderate fluid removal), 4.25% (maximum fluid removal for fluid overload)",
      "Maintain meticulous exit-site care per facility protocol: daily cleansing with chlorhexidine or prescribed antiseptic, application of mupirocin or gentamicin cream as ordered to prevent exit-site infection",
      "Weigh patient daily before the first exchange at the same time using the same scale; compare to target dry weight to assess fluid status",
      "Monitor and document each exchange: volume instilled, dwell time, volume drained, effluent appearance (clarity, color), and net ultrafiltration (drain volume minus instill volume)",
      "Maintain accurate fluid balance records including all oral intake, IV fluids, and peritoneal dialysis net ultrafiltration volumes",
      "Administer intraperitoneal (IP) medications as ordered: antibiotics for peritonitis are typically added directly to the dialysate bag using aseptic technique"
    ],
    nursingActions: [
      "Assess the peritoneal catheter exit site every shift for signs of infection: erythema, edema, tenderness, purulent drainage, or crusting around the catheter",
      "Inspect effluent with EVERY drain cycle: normal effluent is clear and pale yellow (straw-colored); report cloudy effluent immediately as it is the hallmark sign of peritonitis",
      "Warm dialysate to body temperature (37 degrees Celsius) before instillation to prevent abdominal cramping, pain, and hypothermia; never use a microwave (creates hot spots)",
      "Maintain strict aseptic technique during all connections and disconnections: perform hand hygiene, wear a mask, and close windows/doors to minimize airborne contamination",
      "Monitor vital signs before, during, and after exchanges; report hypotension (may indicate excessive fluid removal) or hypertension (may indicate inadequate fluid removal)",
      "Position the patient to optimize drainage: elevating the head of bed, turning side to side, or ambulating can improve drain flow if drainage is slow or incomplete",
      "Document net ultrafiltration for each exchange (drain volume minus fill volume) and report if consistently less than expected, which may indicate membrane failure"
    ],
    assessmentFindings: [
      "Normal effluent: clear, straw-colored (pale yellow) fluid; volume drained should equal or exceed volume instilled (positive ultrafiltration)",
      "Cloudy effluent: the cardinal sign of peritonitis; accompanied by abdominal pain, fever, and tenderness -- requires immediate effluent sampling and empiric antibiotic therapy",
      "Bloody or blood-tinged effluent: may occur with menstruation in women, after catheter placement, or with bowel perforation; persistent bloody effluent requires investigation",
      "Exit-site infection: erythema, tenderness, swelling, or purulent drainage at the catheter exit site; may progress to tunnel infection or peritonitis if untreated",
      "Slow or incomplete drainage: may indicate catheter malposition, omental wrapping, constipation (stool impaction displaces catheter), or fibrin clot obstruction",
      "Abdominal distension and discomfort during fill phase: assess for correct fill volume, proper fluid temperature, and catheter position",
      "Peripheral edema, weight gain exceeding 1 kg in 24 hours, or shortness of breath: suggest inadequate fluid removal requiring adjustment of dialysate concentration or exchange frequency"
    ],
    signs: {
      left: [
        "Mild abdominal fullness during dwell phase",
        "Slight weight fluctuations between exchanges",
        "Minor exit-site erythema without drainage",
        "Slow drainage requiring position changes",
        "Mild constipation affecting drain efficiency",
        "Decreased appetite related to abdominal fullness during dwell"
      ],
      right: [
        "Cloudy effluent with abdominal pain (peritonitis)",
        "Fever with rigors and hemodynamic instability",
        "Purulent drainage from catheter exit site",
        "Significant shortness of breath with crackles (fluid overload)",
        "Brown or fecal-colored effluent (possible bowel perforation)",
        "Absent or severely reduced drainage output with abdominal distension (catheter obstruction)"
      ]
    },
    medications: [
      {
        name: "Heparin (added to dialysate)",
        type: "Anticoagulant (unfractionated heparin added intraperitoneally)",
        action: "Binds to antithrombin III, potentiating its ability to inactivate thrombin and factor Xa. When added to peritoneal dialysate, heparin prevents fibrin clot formation within the peritoneal cavity and catheter lumen, which can obstruct dialysate flow and reduce dialysis efficiency. The intraperitoneal dose (typically 500-1000 units per liter of dialysate) achieves local anticoagulation without significant systemic absorption.",
        sideEffects: "Minimal systemic effects at intraperitoneal doses; theoretical risk of intra-abdominal bleeding if membrane is inflamed; heparin-induced thrombocytopenia (HIT) is rare with IP administration but should be considered",
        contra: "Active intra-abdominal bleeding; known heparin-induced thrombocytopenia; severe thrombocytopenia (platelet count below 50,000)",
        pearl: "Routinely added to dialysate when effluent contains fibrin strands or after peritonitis episodes to prevent catheter occlusion. Not needed for every routine exchange in uncomplicated patients. Always verify the concentration and mix thoroughly in the dialysate bag before instillation."
      },
      {
        name: "Icodextrin (Extraneal)",
        type: "Osmotic agent / colloid peritoneal dialysis solution",
        action: "Icodextrin is a glucose polymer (starch-derived) that acts as a colloid osmotic agent in peritoneal dialysate. Unlike dextrose-based solutions that are rapidly absorbed across the peritoneal membrane (reducing the osmotic gradient over time), icodextrin is absorbed slowly via lymphatic drainage, maintaining a sustained osmotic gradient throughout long dwell periods (8-16 hours). This provides continuous ultrafiltration during overnight dwells in CAPD or the daytime dwell in APD patients.",
        sideEffects: "Skin rash (sterile peritonitis-like reaction in some patients), falsely elevated blood glucose readings on glucose dehydrogenase-based (GDH) glucometers (icodextrin metabolites cross-react), hypoglycemia risk if insulin is dosed based on falsely elevated glucose readings",
        contra: "Known hypersensitivity to icodextrin or cornstarch; glycogen storage disease; maltose or isomaltose intolerance",
        pearl: "CRITICAL: Icodextrin causes FALSE ELEVATIONS on glucose dehydrogenase (GDH) based glucometers. Only use glucose oxidase-based or glucose hexokinase-based glucometers for patients on icodextrin. This is a major patient safety concern -- incorrect glucometer type can lead to insulin overdose and fatal hypoglycemia. Limited to ONE icodextrin exchange per day (long dwell only)."
      },
      {
        name: "Vancomycin (intraperitoneal)",
        type: "Glycopeptide antibiotic (administered intraperitoneally for PD-related peritonitis)",
        action: "Inhibits bacterial cell wall synthesis by binding to the D-alanyl-D-alanine terminus of peptidoglycan precursors, preventing cross-linking of the cell wall. Intraperitoneal administration delivers the antibiotic directly to the site of infection in peritoneal dialysis-related peritonitis, achieving high local concentrations while minimizing systemic toxicity. Effective against gram-positive organisms including methicillin-resistant Staphylococcus aureus (MRSA) and coagulase-negative staphylococci.",
        sideEffects: "Ototoxicity (hearing loss, tinnitus), nephrotoxicity (less relevant in ESRD patients already on dialysis), red man syndrome (histamine-mediated flushing and hypotension with rapid IV administration -- less common with IP route), thrombocytopenia",
        contra: "Known hypersensitivity to vancomycin; use with caution when combining with other ototoxic or nephrotoxic agents (aminoglycosides)",
        pearl: "For PD peritonitis, vancomycin is typically given as an intermittent IP dose (every 5-7 days with dwell time of at least 6 hours) because its long half-life in PD patients allows extended dosing intervals. Monitor vancomycin trough levels to guide redosing (target trough above 15 mcg/mL). Empiric therapy for PD peritonitis covers gram-positive (vancomycin or cefazolin IP) AND gram-negative (gentamicin or ceftazidime IP) organisms."
      }
    ],
    pearls: [
      "CLOUDY EFFLUENT is the number one sign of peritonitis in peritoneal dialysis patients -- assume peritonitis until proven otherwise; collect effluent for cell count, culture, and Gram stain immediately and notify the physician",
      "The three phases of every PD exchange are FILL (instill dialysate), DWELL (allow time for solute exchange), and DRAIN (remove spent dialysate) -- strict aseptic technique must be maintained during connections and disconnections",
      "Higher dextrose concentrations remove more fluid: 1.5% for minimal removal, 2.5% for moderate removal, 4.25% for maximum removal -- but higher concentrations also cause more peritoneal membrane damage over time and contribute to hyperglycemia",
      "ALWAYS warm dialysate to body temperature (37 degrees C) before instillation using a dry heating pad or commercial warmer -- cold dialysate causes abdominal cramping, pain, vasoconstriction, and hypothermia; NEVER use a microwave",
      "Patients on icodextrin (Extraneal) require glucose-OXIDASE-based glucometers ONLY -- glucose dehydrogenase (GDH) meters give falsely elevated readings that could lead to insulin overdose and fatal hypoglycemia",
      "Constipation is a common cause of poor drainage in PD patients because stool-filled bowel displaces the catheter tip; maintain a bowel regimen and report persistently poor drainage",
      "Weigh the patient daily at the same time, before the first exchange, using the same scale -- weight gain exceeding 1 kg in 24 hours suggests inadequate fluid removal and may require increased dialysate concentration or additional exchanges"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing peritoneal dialysis effluent and notes it appears cloudy. What is the most appropriate immediate action?",
        options: [
          "Document the finding and continue with the next exchange",
          "Notify the physician immediately and collect an effluent sample for cell count and culture",
          "Add heparin to the next dialysate bag and repeat the exchange",
          "Warm the next dialysate bag to a higher temperature and reinstill"
        ],
        correct: 1,
        rationale: "Cloudy effluent is the cardinal sign of peritonitis in peritoneal dialysis patients. The practical nurse must notify the physician immediately and collect an effluent sample for cell count, differential, Gram stain, and culture. Peritonitis requires prompt empiric antibiotic therapy. Delaying notification risks progression to sepsis."
      },
      {
        question: "A patient on peritoneal dialysis using icodextrin (Extraneal) has a blood glucose reading of 350 mg/dL on a glucose dehydrogenase (GDH) glucometer. The patient is alert, oriented, and denies symptoms. What should the practical nurse consider?",
        options: [
          "Administer sliding scale insulin immediately based on the reading",
          "The reading may be falsely elevated due to icodextrin and a glucose oxidase meter should be used to verify",
          "The patient is in diabetic ketoacidosis and needs emergency treatment",
          "Discontinue icodextrin permanently and switch to dextrose-based dialysate"
        ],
        correct: 1,
        rationale: "Icodextrin metabolites (maltose, maltotriose) cause cross-reactivity with glucose dehydrogenase (GDH) based glucometers, producing falsely elevated glucose readings. A glucose oxidase-based glucometer must be used for accurate measurement. Administering insulin based on a falsely elevated reading could cause life-threatening hypoglycemia. This is a critical patient safety concern for all patients on icodextrin."
      },
      {
        question: "During a peritoneal dialysis exchange, the patient reports that the dialysate is draining very slowly. Which nursing action should the practical nurse try first?",
        options: [
          "Flush the catheter with a heparin bolus",
          "Reposition the patient by elevating the head of bed or turning to the side",
          "Remove the catheter and insert a new one immediately",
          "Increase the dextrose concentration of the dialysate"
        ],
        correct: 1,
        rationale: "Slow drainage during peritoneal dialysis often results from catheter position relative to the fluid collection in the peritoneal cavity. Repositioning the patient (elevating the head of bed, turning side to side, or ambulating) uses gravity and shifts abdominal contents to optimize catheter tip position and improve flow. If repositioning is unsuccessful, assess for constipation (common cause) and notify the physician for further evaluation."
      }
    ]
  },

  "pertussis-management-rpn": {
    title: "Pertussis (Whooping Cough) Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Pertussis Infection",
      content: "Pertussis, commonly known as whooping cough, is a highly contagious respiratory infection caused by the gram-negative coccobacillus Bordetella pertussis. The organism is transmitted via respiratory droplets and has an incubation period of 7 to 21 days (average 10 days). Bordetella pertussis adheres specifically to ciliated epithelial cells of the upper respiratory tract using adhesins including filamentous hemagglutinin (FHA) and pertactin. Once attached, the bacteria produce several virulence factors and toxins that drive the disease process. Pertussis toxin (PT) is the most clinically significant virulence factor; it catalyzes ADP-ribosylation of inhibitory G proteins (Gi) in host cells, disrupting intracellular signaling pathways. This results in lymphocytosis (a hallmark laboratory finding), increased insulin secretion (causing hypoglycemia in infants), and sensitization of the respiratory tract to histamine. Tracheal cytotoxin destroys the ciliated epithelial cells, paralyzing the mucociliary escalator and causing accumulation of thick, tenacious mucus that triggers the characteristic paroxysmal coughing episodes. Adenylate cyclase toxin impairs neutrophil and macrophage function, allowing the bacteria to evade innate immune defenses. The disease progresses through three distinct clinical stages: the catarrhal stage (1-2 weeks), which resembles a common upper respiratory infection with rhinorrhea, mild cough, and low-grade fever -- this is the most contagious period and when antibiotics are most effective at reducing transmission; the paroxysmal stage (2-8 weeks), characterized by severe repetitive coughing fits (paroxysms) followed by a forceful inspiratory effort that produces the classic high-pitched 'whoop' sound as air rushes through a partially closed glottis, frequently followed by post-tussive vomiting and exhaustion; and the convalescent stage (weeks to months), during which coughing gradually diminishes in frequency and severity but can be re-triggered by subsequent respiratory infections for months. Infants younger than 6 months are at highest risk for complications including apnea, pneumonia, seizures, encephalopathy, and death. The practical nurse must recognize the clinical stages, maintain droplet precautions, administer prescribed antibiotics, monitor respiratory status, and provide family education about isolation requirements and close contact prophylaxis."
    },
    riskFactors: [
      "Infants younger than 6 months who have not completed the primary vaccination series (highest morbidity and mortality)",
      "Unvaccinated or incompletely vaccinated children and adolescents",
      "Waning immunity in adolescents and adults (pertussis vaccine protection decreases approximately 5-10 years after last dose)",
      "Close household contact with an infected individual (secondary attack rate exceeds 80% in susceptible household contacts)",
      "Healthcare workers, childcare providers, and teachers with frequent exposure to respiratory secretions",
      "Pregnant women in the third trimester who have not received Tdap vaccination (risk of transmitting to the newborn)",
      "Immunocompromised individuals with impaired humoral or cellular immune responses"
    ],
    diagnostics: [
      "Nasopharyngeal (NP) culture on Bordet-Gengou or Regan-Lowe agar: gold standard for diagnosis but requires 7-10 days for growth; highest sensitivity during catarrhal and early paroxysmal stages",
      "Polymerase chain reaction (PCR) of nasopharyngeal specimen: rapid, highly sensitive, and specific; preferred diagnostic method in clinical practice; can detect organism even after antibiotic therapy has begun",
      "Complete blood count (CBC): absolute lymphocytosis (WBC 20,000-100,000 with 60-80% lymphocytes) is a hallmark finding especially in infants and young children; severely elevated WBC in infants is a poor prognostic indicator",
      "Chest X-ray: may show perihilar infiltrates, atelectasis, or a characteristic 'shaggy heart' sign (perihilar opacification); pneumonia is a common complication especially in infants",
      "Serum pertussis antibody titers (IgG, IgA): useful for epidemiological surveillance and diagnosis in later stages when culture and PCR may be negative; single elevated IgG titer in unvaccinated individual supports diagnosis",
      "Pulse oximetry: continuous monitoring during paroxysmal stage to detect hypoxemia during coughing episodes, especially in infants who may develop apnea"
    ],
    management: [
      "Initiate droplet precautions immediately upon suspicion: place patient in private room, wear surgical mask within 3 feet, maintain precautions until 5 days of appropriate antibiotic therapy completed",
      "Administer macrolide antibiotics as prescribed within the catarrhal stage when possible to reduce severity and limit transmission; antibiotics given during paroxysmal stage reduce contagion but may not alter disease course",
      "Provide respiratory support: humidified oxygen as ordered, gentle suctioning of nasal secretions, continuous pulse oximetry monitoring in infants and young children",
      "Maintain hydration and nutrition: offer small frequent meals to reduce post-tussive vomiting; IV fluids may be required if oral intake is inadequate due to vomiting",
      "Ensure close contacts receive post-exposure prophylaxis (PEP) with macrolide antibiotics regardless of vaccination status to prevent secondary cases",
      "Administer age-appropriate pertussis-containing vaccines to close contacts who are not up to date (DTaP for children, Tdap for adolescents and adults)",
      "Monitor for complications in infants: apnea, cyanosis during paroxysms, seizures, pneumonia, and encephalopathy requiring immediate escalation of care"
    ],
    nursingActions: [
      "Maintain droplet precautions: surgical mask for anyone within 3 feet, private room, limit transport; continue for 5 days after initiation of appropriate antibiotic therapy",
      "Monitor respiratory status continuously during paroxysmal stage: respiratory rate, oxygen saturation, presence and severity of coughing paroxysms, occurrence of apneic episodes in infants",
      "Administer prescribed macrolide antibiotics at the correct dose and frequency; document administration time and monitor for GI side effects (nausea, vomiting, diarrhea, abdominal cramping)",
      "Assess hydration status: monitor intake and output, skin turgor, mucous membrane moisture, urine specific gravity, and daily weights; report signs of dehydration promptly",
      "Suction nasopharyngeal secretions gently as needed using bulb syringe or low-wall suction to maintain airway patency; avoid vigorous suctioning that may trigger paroxysms",
      "Provide a calm, quiet environment to minimize triggers for coughing paroxysms: reduce stimulation, group care activities, avoid unnecessary interventions during rest periods",
      "Educate family on droplet precautions, medication administration, when to seek emergency care (cyanosis, apnea, inability to feed), and the importance of prophylaxis for close contacts"
    ],
    assessmentFindings: [
      "Catarrhal stage (weeks 1-2): rhinorrhea, lacrimation, mild cough, sneezing, low-grade fever or afebrile; clinically indistinguishable from a common cold; MOST contagious period",
      "Paroxysmal stage (weeks 2-8): severe repetitive coughing fits (paroxysms) of 5-10 rapid coughs in a single expiration, followed by a sudden forceful inspiration producing the characteristic high-pitched 'whoop' sound",
      "Post-tussive vomiting: vomiting immediately following a coughing paroxysm due to increased intrathoracic and intra-abdominal pressure during the violent cough; common in children and adults",
      "Post-tussive exhaustion: patient appears fatigued and may become diaphoretic after paroxysmal episodes; infants may become limp and apneic rather than whooping",
      "Subconjunctival hemorrhage and periorbital petechiae: caused by increased venous pressure during prolonged violent coughing episodes",
      "Convalescent stage (weeks to months): gradual reduction in frequency and severity of coughing episodes; paroxysms may be re-triggered by subsequent viral upper respiratory infections for months",
      "Infant-specific findings: apnea (may be the ONLY manifestation in young infants -- whooping may be absent), cyanosis during episodes, poor feeding, failure to thrive"
    ],
    signs: {
      left: [
        "Mild cough with rhinorrhea (catarrhal stage)",
        "Low-grade fever or afebrile status",
        "Intermittent coughing paroxysms with adequate recovery between episodes",
        "Post-tussive vomiting with maintained oral intake overall",
        "Mild conjunctival injection from coughing effort",
        "Fatigue between paroxysms with normal level of consciousness"
      ],
      right: [
        "Apnea in infants (cessation of breathing during or after coughing episodes)",
        "Cyanosis during coughing paroxysms not resolving with supplemental oxygen",
        "Inability to maintain oral hydration due to persistent post-tussive vomiting",
        "Oxygen saturation below 92% despite supplemental oxygen",
        "Seizures or signs of encephalopathy (altered consciousness, irritability)",
        "WBC count exceeding 100,000 in infants (associated with pulmonary hypertension and death)"
      ]
    },
    medications: [
      {
        name: "Azithromycin (Zithromax)",
        type: "Macrolide antibiotic (first-line treatment and prophylaxis for pertussis)",
        action: "Binds to the 50S ribosomal subunit of bacterial ribosomes, inhibiting protein synthesis by blocking translocation of peptidyl-tRNA. Bacteriostatic at standard concentrations. Highly effective against Bordetella pertussis and achieves excellent concentrations in respiratory tract tissues. Preferred macrolide for infants under 1 month due to lower risk of infantile hypertrophic pyloric stenosis compared to erythromycin.",
        sideEffects: "GI disturbances (nausea, vomiting, diarrhea, abdominal pain -- most common), QT prolongation (risk of torsades de pointes), hepatotoxicity (cholestatic jaundice), allergic reactions",
        contra: "Known hypersensitivity to macrolides; history of cholestatic jaundice associated with prior macrolide use; concurrent use with QT-prolonging medications (increased risk of fatal cardiac arrhythmia)",
        pearl: "Preferred first-line agent for all age groups including neonates. Dosing: infants under 6 months: 10 mg/kg/day for 5 days; children 6 months and older: 10 mg/kg day 1 (max 500mg), then 5 mg/kg days 2-5 (max 250mg); adults: 500mg day 1, then 250mg days 2-5. Also used for post-exposure prophylaxis of close contacts."
      },
      {
        name: "Erythromycin (Erythrocin)",
        type: "Macrolide antibiotic (alternative treatment for pertussis)",
        action: "Binds to the 50S ribosomal subunit, inhibiting bacterial protein synthesis by blocking aminoacyl translocation. Bacteriostatic against Bordetella pertussis. Was historically the first-line treatment for pertussis before azithromycin became preferred due to fewer doses, shorter course, and better GI tolerability.",
        sideEffects: "GI disturbances (nausea, vomiting, abdominal cramps, diarrhea -- more frequent than azithromycin), hepatotoxicity (cholestatic hepatitis), QT prolongation, infantile hypertrophic pyloric stenosis (IHPS) in infants under 2 weeks of age",
        contra: "Known macrolide hypersensitivity; concurrent use with cisapride, pimozide, or ergotamine (risk of fatal arrhythmia); hepatic impairment; infants under 2 weeks (increased risk of pyloric stenosis)",
        pearl: "If used in infants under 6 weeks, parents must be counseled to watch for signs of pyloric stenosis: projectile vomiting, palpable olive-shaped mass in the epigastrium, visible gastric peristalsis. Due to this risk, azithromycin is now preferred in this age group. Dosing for pertussis: 40-50 mg/kg/day divided into 4 doses for 14 days."
      },
      {
        name: "Trimethoprim-Sulfamethoxazole (TMP-SMX, Bactrim/Septra)",
        type: "Sulfonamide-diaminopyrimidine combination antibiotic (alternative for macrolide-intolerant patients)",
        action: "Sequential blockade of folate synthesis: sulfamethoxazole inhibits dihydropteroate synthase (competes with PABA), and trimethoprim inhibits dihydrofolate reductase. This dual mechanism blocks two sequential steps in bacterial folate synthesis, producing a synergistic bactericidal effect. Used as second-line therapy for pertussis in patients who cannot tolerate macrolides.",
        sideEffects: "GI disturbances (nausea, vomiting, anorexia), hypersensitivity reactions (rash, Stevens-Johnson syndrome, toxic epidermal necrolysis), bone marrow suppression (leukopenia, thrombocytopenia, megaloblastic anemia), hyperkalemia, photosensitivity, crystalluria",
        contra: "Infants under 2 months of age (risk of kernicterus from bilirubin displacement); known sulfonamide allergy; severe renal or hepatic impairment; megaloblastic anemia due to folate deficiency; pregnancy at term (risk of neonatal kernicterus)",
        pearl: "Reserved for patients with macrolide allergy or intolerance. Not recommended for infants under 2 months. Encourage adequate fluid intake (at least 1.5 liters per day in adults) to prevent crystalluria. Monitor CBC for bone marrow suppression during therapy. Advise patients to avoid prolonged sun exposure due to photosensitivity."
      }
    ],
    pearls: [
      "Pertussis progresses through THREE distinct stages: CATARRHAL (cold-like symptoms, most contagious), PAROXYSMAL (severe coughing fits with characteristic whoop), and CONVALESCENT (gradual recovery over weeks to months)",
      "The CATARRHAL stage is the most contagious period AND the time when antibiotics are most effective at reducing transmission -- by the paroxysmal stage, antibiotics reduce contagion but may not change the disease course",
      "Infants under 6 months may NOT produce the classic 'whoop' -- apnea may be the only manifestation of pertussis in young infants, making recognition more difficult",
      "Post-tussive vomiting is a hallmark feature: vomiting that occurs immediately after a coughing paroxysm should always raise suspicion for pertussis, especially during outbreaks",
      "Azithromycin is the preferred first-line treatment for ALL age groups including neonates because of once-daily dosing, shorter course (5 days vs 14 days for erythromycin), and lower risk of pyloric stenosis in infants",
      "ALL close contacts of a confirmed pertussis case require post-exposure prophylaxis with a macrolide antibiotic REGARDLESS of vaccination status -- vaccination does not provide complete protection",
      "Droplet precautions must be maintained until the patient has completed 5 FULL days of appropriate antibiotic therapy -- the patient remains contagious until this point"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for an infant admitted with suspected pertussis. During which clinical stage is the patient MOST contagious?",
        options: [
          "Paroxysmal stage when coughing is most severe",
          "Catarrhal stage when symptoms resemble a common cold",
          "Convalescent stage when the cough is gradually resolving",
          "Incubation period before any symptoms appear"
        ],
        correct: 1,
        rationale: "The catarrhal stage (first 1-2 weeks) is the most contagious period of pertussis. During this stage, symptoms resemble a common cold with rhinorrhea and mild cough, making clinical recognition difficult. This is also when antibiotic therapy is most effective at reducing transmission. By the paroxysmal stage, contagiousness has decreased."
      },
      {
        question: "A 3-week-old infant with confirmed pertussis has episodes of apnea but does not produce a whooping sound. The practical nurse understands this presentation because:",
        options: [
          "The infant likely has a different respiratory infection, not pertussis",
          "Young infants may not generate enough airflow to produce the classic whoop; apnea may be the primary manifestation",
          "Whooping only occurs in adults with pertussis",
          "The absence of whooping means the infection is resolving"
        ],
        correct: 1,
        rationale: "Infants younger than 6 months often lack the muscular strength and airway size to generate the forceful inspiratory effort that produces the classic high-pitched whoop. In young infants, apnea (cessation of breathing) may be the primary or sole manifestation of pertussis, which makes recognition more challenging and increases the risk of complications."
      },
      {
        question: "Which antibiotic is the preferred first-line treatment for pertussis in a 2-month-old infant?",
        options: [
          "Erythromycin for 14 days",
          "Amoxicillin for 10 days",
          "Azithromycin for 5 days",
          "Trimethoprim-sulfamethoxazole for 14 days"
        ],
        correct: 2,
        rationale: "Azithromycin is the preferred first-line macrolide for pertussis treatment in all age groups, including infants. It offers once-daily dosing, a shorter treatment course (5 days), better GI tolerability, and a lower risk of infantile hypertrophic pyloric stenosis compared to erythromycin. TMP-SMX is contraindicated in infants under 2 months, and amoxicillin is not effective against Bordetella pertussis."
      }
    ]
  },

  "pharmacology-rpn": {
    title: "Pharmacology Foundations for Practical Nurses",
    cellular: {
      title: "Fundamentals of Pharmacokinetics and Pharmacodynamics",
      content: "Pharmacology is the scientific study of drug action on living systems, encompassing how drugs affect the body (pharmacodynamics) and how the body affects drugs (pharmacokinetics). Understanding these fundamental concepts is essential for safe medication administration, which is a core competency of practical nursing practice. Pharmacokinetics describes the four processes by which the body handles a drug, collectively known as ADME: Absorption, Distribution, Metabolism, and Excretion. Absorption is the movement of a drug from its site of administration into the bloodstream. The route of administration significantly affects absorption: oral medications must pass through the gastrointestinal mucosa and undergo first-pass metabolism in the liver before reaching systemic circulation, which reduces bioavailability (the percentage of administered drug that reaches the bloodstream in active form). Intravenous administration bypasses absorption entirely, providing 100% bioavailability and immediate onset. Sublingual and rectal routes partially bypass first-pass metabolism. Factors affecting oral absorption include gastric pH, food interactions, gut motility, and drug formulation. Distribution is the transport of drug molecules from the bloodstream to target tissues and organs. Distribution is influenced by blood flow to tissues, protein binding (drugs bound to plasma proteins like albumin are pharmacologically inactive; only free/unbound drug exerts effects), lipid solubility (determines ability to cross cell membranes and the blood-brain barrier), and body composition (age, obesity, edema, and dehydration alter distribution volumes). Metabolism (biotransformation) is the chemical alteration of drug molecules, primarily occurring in the liver through cytochrome P450 (CYP450) enzyme systems. Metabolism typically converts lipid-soluble drugs into water-soluble metabolites for renal excretion. Phase I reactions (oxidation, reduction, hydrolysis) may produce active or inactive metabolites. Phase II reactions (conjugation) generally produce inactive, water-soluble metabolites. First-pass metabolism refers to the extensive hepatic processing of orally administered drugs before they reach systemic circulation, which can significantly reduce bioavailability. Excretion is the elimination of drugs and their metabolites from the body, primarily through the kidneys (glomerular filtration, tubular secretion) but also through bile/feces, lungs (volatile anesthetics), sweat, and breast milk. Renal impairment decreases drug excretion, leading to drug accumulation and toxicity. Pharmacodynamics describes how drugs produce their effects through interactions with biological targets. Most drugs act by binding to specific receptors (proteins on cell surfaces or within cells) to either activate them (agonists) or block them (antagonists). The therapeutic index is the ratio between the toxic dose and the therapeutic dose; drugs with a narrow therapeutic index (such as digoxin, warfarin, lithium, phenytoin, and aminoglycosides) require careful dosing and frequent monitoring because the difference between therapeutic and toxic blood levels is small. Drug interactions occur when one drug alters the pharmacokinetics or pharmacodynamics of another: enzyme inducers (such as rifampin and carbamazepine) increase CYP450 activity and accelerate metabolism of other drugs (reducing their effectiveness), while enzyme inhibitors (such as erythromycin, ketoconazole, and grapefruit juice) decrease CYP450 activity and slow metabolism (increasing drug levels and toxicity risk). The practical nurse must understand these principles to administer medications safely, recognize adverse effects, anticipate drug interactions, and educate patients on proper medication use."
    },
    riskFactors: [
      "Extremes of age: neonates have immature hepatic and renal function affecting metabolism and excretion; elderly patients have decreased organ function, altered body composition, and polypharmacy risk",
      "Hepatic impairment (cirrhosis, hepatitis) reducing drug metabolism capacity and increasing risk of drug accumulation and toxicity",
      "Renal impairment (chronic kidney disease, acute kidney injury) reducing drug excretion and necessitating dose adjustments for renally cleared medications",
      "Polypharmacy (use of 5 or more medications simultaneously) increasing the risk of drug-drug interactions, adverse effects, and medication errors",
      "Genetic polymorphisms in CYP450 enzymes (poor metabolizers accumulate drugs faster; ultra-rapid metabolizers may not achieve therapeutic levels at standard doses)",
      "Low serum albumin (malnutrition, liver disease, nephrotic syndrome) increasing the free fraction of highly protein-bound drugs and intensifying drug effects",
      "Non-adherence to prescribed medication regimens due to cost, side effects, complexity, or lack of understanding"
    ],
    diagnostics: [
      "Therapeutic drug monitoring (TDM): serum drug levels measured for narrow therapeutic index drugs (digoxin: 0.5-2.0 ng/mL; lithium: 0.6-1.2 mEq/L; phenytoin: 10-20 mcg/mL; vancomycin trough: 10-20 mcg/mL) to ensure efficacy and prevent toxicity",
      "Peak and trough levels: peak (highest concentration, drawn 30-60 minutes after IV dose) assesses adequacy of dose; trough (lowest concentration, drawn just before next dose) assesses risk of toxicity -- timing of blood draw is critical for accurate results",
      "Hepatic function tests (AST, ALT, ALP, bilirubin, albumin): baseline and periodic monitoring for hepatotoxic medications; elevated values may necessitate dose reduction or drug discontinuation",
      "Renal function tests (serum creatinine, BUN, estimated GFR): baseline and ongoing monitoring for renally excreted drugs; GFR below 60 mL/min often requires dose adjustment",
      "Complete blood count (CBC): monitors for bone marrow suppression from medications such as methotrexate, azathioprine, carbamazepine, and clozapine",
      "International normalized ratio (INR): monitors anticoagulant effect of warfarin; therapeutic range typically 2.0-3.0 for most indications; drawn before morning dose"
    ],
    management: [
      "Implement the Rights of Medication Administration: right patient, right drug, right dose, right route, right time, right documentation, right reason, right response, right to refuse",
      "Perform independent double-check for high-alert medications (insulin, heparin, opioids, chemotherapy, concentrated electrolytes) with a second licensed provider before administration",
      "Verify allergies and previous adverse drug reactions before administering any medication; document allergy type (true allergy vs. intolerance) and reaction details",
      "Calculate doses accurately using dimensional analysis or ratio-proportion method; verify weight-based doses using current documented weight in kilograms",
      "Administer medications within the prescribed time window (generally within 30 minutes before or after the scheduled time for routine medications)",
      "Monitor for therapeutic effects (is the drug working?) and adverse effects (is the drug causing harm?) after each medication administration",
      "Educate patients on each medication: name, purpose, expected effects, potential side effects to report, proper administration technique, food/drug interactions, and importance of adherence"
    ],
    nursingActions: [
      "Verify patient identity using two identifiers (name and date of birth or medical record number) before EVERY medication administration",
      "Assess appropriateness of each medication before administration: check vital signs (hold antihypertensives if BP below parameters, hold digoxin if heart rate below 60 bpm, hold opioids if respiratory rate below 12)",
      "Monitor for adverse drug reactions and document using facility reporting system; report serious reactions through the proper channels",
      "Administer medications using correct technique for each route: oral (assess swallowing ability), sublingual (under tongue, no swallowing until dissolved), topical (clean site, apply as directed), intramuscular (correct needle length and angle for patient size)",
      "Time drug level draws correctly: trough levels drawn within 30 minutes BEFORE the next dose; peak levels drawn at specified time after administration depending on the drug and route",
      "Report and withhold medications when clinical parameters fall outside safe ranges (apical pulse below 60 for digoxin, systolic BP below 100 for antihypertensives, respiratory rate below 12 for opioids)",
      "Document medication administration immediately after giving the drug, including drug name, dose, route, time, site (for injections), and patient response"
    ],
    assessmentFindings: [
      "Therapeutic response: measurable improvement in the target condition (reduced blood pressure with antihypertensives, decreased pain with analgesics, controlled blood glucose with insulin, reduced fever with antipyretics)",
      "Adverse drug reaction (ADR): any unintended, harmful response to a medication at normal therapeutic doses; ranges from mild (nausea, drowsiness) to severe (anaphylaxis, organ damage)",
      "Allergic reaction signs: urticaria (hives), pruritus (itching), angioedema (facial/lip swelling), bronchospasm, hypotension, anaphylaxis (requires immediate epinephrine administration)",
      "Drug toxicity: signs that drug levels have exceeded the therapeutic range; examples include digoxin toxicity (bradycardia, visual disturbances, nausea), lithium toxicity (tremor, confusion, seizures), aminoglycoside toxicity (tinnitus, hearing loss, elevated creatinine)",
      "Drug-drug interaction effects: unexpected increase or decrease in drug effect when combined with another medication, herbal supplement, or food (grapefruit juice inhibits CYP3A4, increasing levels of many drugs)",
      "Medication non-adherence indicators: uncontrolled symptoms despite adequate prescriptions, inconsistent drug levels, missed refills, patient reports of skipping doses or altering dosing schedule"
    ],
    signs: {
      left: [
        "Expected therapeutic effects within normal time frame",
        "Mild, tolerable side effects (slight drowsiness, mild GI upset)",
        "Drug levels within therapeutic range on monitoring",
        "Patient reports understanding of medication regimen",
        "Stable vital signs within prescribed parameters",
        "Minor drug interaction requiring monitoring but not discontinuation"
      ],
      right: [
        "Anaphylaxis (urticaria, angioedema, bronchospasm, hypotension, tachycardia)",
        "Drug toxicity signs (bradycardia with digoxin, bleeding with warfarin, respiratory depression with opioids)",
        "Supratherapeutic drug levels on laboratory monitoring",
        "Severe adverse drug reaction (Stevens-Johnson syndrome, agranulocytosis, hepatotoxicity)",
        "Respiratory depression (rate below 8, oxygen saturation below 90%) with opioid or sedative use",
        "Seizures or altered consciousness from drug toxicity or interaction"
      ]
    },
    medications: [
      {
        name: "Medication Administration Record (MAR) / Drug Reference Guide / Adverse Reaction Reporting Form",
        type: "Documentation Tools",
        action: "The Medication Administration Record (MAR) provides a comprehensive, real-time record of all medications administered to a patient, including drug name, dose, route, time, and the nurse's initials or signature. It serves as the legal documentation of medication administration and is used to verify that all ordered medications have been given correctly and on time. The drug reference guide (pharmacopeia or electronic formulary) provides evidence-based information on indications, dosing, contraindications, interactions, and adverse effects for clinical decision support. The adverse reaction reporting form documents and communicates unexpected drug reactions to facilitate pharmacovigilance, patient safety, and regulatory reporting.",
        sideEffects: "Documentation errors including wrong time recorded, omitted documentation (given but not charted or charted but not given), incomplete allergy documentation, failure to document patient response, and illegible entries in paper-based systems",
        contra: "Administration of medication without verifying the order against the MAR; failure to document medication refusal, held doses, or waste of controlled substances; bypassing the double-check process for high-alert medications",
        pearl: "NEVER pre-chart medications before administration -- document AFTER giving the drug. If a dose is held, document the reason (vital sign parameters, patient refusal, NPO status). For PRN medications, document the indication, time given, and effectiveness assessment within the required time frame (typically 30-60 minutes)."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist / reversal agent",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors, displacing opioid agonists (morphine, fentanyl, hydromorphone, oxycodone) from receptor binding sites and rapidly reversing opioid effects including respiratory depression, sedation, and hypotension. Onset of action is 1-2 minutes IV and 2-5 minutes IM/SQ/intranasal. Duration of action is 30-90 minutes, which is typically SHORTER than the duration of most opioid agonists.",
        sideEffects: "Acute opioid withdrawal (agitation, nausea, vomiting, diaphoresis, tachycardia, hypertension, pain), pulmonary edema (rare), seizures (rare), cardiac arrhythmias in patients with pre-existing cardiac disease",
        contra: "Known hypersensitivity to naloxone; use with extreme caution in patients physically dependent on opioids (can precipitate severe withdrawal); caution in patients with cardiovascular disease",
        pearl: "Because naloxone's duration (30-90 minutes) is SHORTER than most opioids, the patient may re-sedate after the naloxone wears off -- continuous monitoring for at least 2 hours after administration is essential. Titrate dose to restore adequate respirations (rate above 12) without fully reversing analgesia when possible. May need to be repeated every 2-3 minutes. Keep emergency equipment available."
      },
      {
        name: "Epinephrine (Adrenaline)",
        type: "Sympathomimetic / catecholamine (alpha and beta adrenergic agonist)",
        action: "Stimulates alpha-1, beta-1, and beta-2 adrenergic receptors, producing multiple physiological effects: alpha-1 stimulation causes peripheral vasoconstriction (increases blood pressure and reduces mucosal edema); beta-1 stimulation increases heart rate and contractility (increases cardiac output); beta-2 stimulation causes bronchodilation (relieves bronchospasm) and stabilizes mast cell membranes (reduces further histamine release). These combined actions make epinephrine the FIRST-LINE drug for anaphylaxis.",
        sideEffects: "Tachycardia, palpitations, hypertension, anxiety, tremor, headache, nausea, cardiac arrhythmias (especially at high doses or in patients with cardiac disease)",
        contra: "No absolute contraindications in life-threatening anaphylaxis (benefit always outweighs risk); relative contraindications include severe cardiovascular disease, uncontrolled hypertension, and concurrent use of MAO inhibitors or beta-blockers (may reduce effectiveness)",
        pearl: "For anaphylaxis: administer IM into the LATERAL THIGH (vastus lateralis) -- NOT the deltoid and NOT IV for field/non-ICU use. Adult dose: 0.3-0.5 mg of 1:1000 (1 mg/mL) concentration IM. May repeat every 5-15 minutes if needed. Position patient supine with legs elevated unless contraindicated by respiratory distress. Always call for emergency assistance after administration."
      }
    ],
    pearls: [
      "ADME is the foundation of pharmacokinetics: Absorption (drug enters blood), Distribution (drug reaches tissues), Metabolism (liver transforms drug), Excretion (kidneys eliminate drug) -- impairment at any step alters drug levels and effects",
      "First-pass metabolism means orally administered drugs are partially metabolized by the liver BEFORE reaching systemic circulation, reducing bioavailability -- this is why some drugs require higher oral doses compared to IV doses to achieve the same effect",
      "Narrow therapeutic index (NTI) drugs require the most careful monitoring because the difference between therapeutic and toxic levels is small: remember DLWPA -- Digoxin, Lithium, Warfarin, Phenytoin, Aminoglycosides",
      "Before giving digoxin, ALWAYS check the apical pulse for a full 60 seconds; HOLD and notify the physician if heart rate is below 60 bpm in adults or below 100 bpm in infants",
      "Naloxone (Narcan) reverses opioid effects but has a SHORTER duration than most opioids -- the patient can re-sedate after naloxone wears off, so continuous monitoring for at least 2 hours is mandatory",
      "Epinephrine is ALWAYS the FIRST drug given for anaphylaxis -- administer IM in the lateral thigh (vastus lateralis); do NOT delay epinephrine to give antihistamines or steroids, as these are adjunctive, not life-saving",
      "Two patient identifiers must be verified BEFORE every medication administration -- never rely on room number alone; ask the patient to state their name and date of birth and compare to the medication administration record"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to administer an oral medication. The nurse understands that first-pass metabolism refers to which pharmacokinetic process?",
        options: [
          "The drug is absorbed through the intestinal wall into the portal vein",
          "The drug is partially metabolized by the liver before reaching systemic circulation",
          "The drug is distributed to target tissues after absorption",
          "The drug is excreted by the kidneys after metabolism"
        ],
        correct: 1,
        rationale: "First-pass metabolism (also called first-pass effect) refers to the hepatic processing of an orally administered drug as it passes through the liver via the portal circulation BEFORE reaching systemic circulation. This metabolism reduces the amount of active drug available (bioavailability). Some drugs have very high first-pass metabolism, requiring higher oral doses or alternative routes (sublingual, transdermal, IV) to achieve therapeutic levels."
      },
      {
        question: "A patient receiving IV morphine has a respiratory rate of 8 breaths per minute and is difficult to arouse. Which medication should the practical nurse anticipate administering?",
        options: [
          "Flumazenil (Romazicon)",
          "Naloxone (Narcan)",
          "Epinephrine (Adrenaline)",
          "Atropine"
        ],
        correct: 1,
        rationale: "Naloxone (Narcan) is a competitive opioid antagonist that rapidly reverses opioid-induced respiratory depression by displacing the opioid from receptor binding sites. A respiratory rate of 8 with decreased level of consciousness indicates opioid overdose requiring immediate reversal. Flumazenil reverses benzodiazepines, epinephrine treats anaphylaxis and cardiac arrest, and atropine treats symptomatic bradycardia."
      },
      {
        question: "The practical nurse is reviewing a patient's medication list and identifies that the patient takes warfarin (Coumadin). Which laboratory value is most important to monitor for this medication?",
        options: [
          "Serum potassium level",
          "Hemoglobin A1C",
          "International normalized ratio (INR)",
          "Thyroid-stimulating hormone (TSH)"
        ],
        correct: 2,
        rationale: "Warfarin is an anticoagulant with a narrow therapeutic index. The INR (International Normalized Ratio) measures the anticoagulant effect of warfarin. The therapeutic range is typically 2.0-3.0 for most indications. An INR below 2.0 indicates insufficient anticoagulation (risk of clot formation), while an INR above 3.0 indicates excessive anticoagulation (increased bleeding risk). Regular INR monitoring is essential for safe warfarin therapy."
      }
    ]
  },

  "phenylketonuria-rpn": {
    title: "Phenylketonuria (PKU) Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Phenylketonuria",
      content: "Phenylketonuria (PKU) is an autosomal recessive inborn error of metabolism caused by a deficiency or absence of the hepatic enzyme phenylalanine hydroxylase (PAH), which is responsible for converting the essential amino acid phenylalanine (Phe) into tyrosine. This enzymatic deficiency is caused by mutations in the PAH gene located on chromosome 12. When PAH activity is absent or severely reduced, phenylalanine accumulates in the blood and tissues to neurotoxic levels while tyrosine becomes conditionally deficient. The normal blood phenylalanine level is 1 to 2 mg/dL; in untreated classic PKU, levels can exceed 20 mg/dL. The pathological consequences of phenylalanine accumulation are most devastating to the developing central nervous system. Excess phenylalanine competes with other large neutral amino acids (tryptophan, tyrosine, leucine, isoleucine, valine) for transport across the blood-brain barrier via the large neutral amino acid transporter (LAT1). This competitive inhibition reduces brain uptake of these essential amino acids, impairing the synthesis of critical neurotransmitters: serotonin (from tryptophan), dopamine and norepinephrine (from tyrosine), and myelin-associated proteins. The result, if untreated, is severe and irreversible intellectual disability, seizures, behavioral disturbances, and impaired myelination of the central nervous system. Excess phenylalanine is shunted through alternative metabolic pathways, producing phenylpyruvic acid, phenylacetic acid, and phenyllactic acid -- collectively called phenylketones. These metabolites are excreted in the urine and sweat, producing the characteristic musty or mousy body odor that was historically the first clinical clue to the diagnosis. Tyrosine deficiency results in decreased melanin production (tyrosine is the precursor for melanin), giving affected individuals characteristically fair skin, light hair, and blue eyes regardless of ethnic background. PKU is the most successful example of newborn metabolic screening: the Guthrie test (bacterial inhibition assay) or tandem mass spectrometry performed on a heel-stick blood sample obtained 24 to 48 hours after birth (after the infant has consumed protein) can detect elevated phenylalanine before clinical symptoms develop. Early initiation of a phenylalanine-restricted diet within the first 2 weeks of life prevents intellectual disability and allows normal neurocognitive development. The practical nurse plays a vital role in supporting families with dietary management, monitoring growth and development, reinforcing the lifelong nature of dietary restrictions (especially during pregnancy, where maternal PKU poses severe teratogenic risk to the fetus), and ensuring adherence to metabolic clinic follow-up."
    },
    riskFactors: [
      "Autosomal recessive inheritance pattern: both parents must be carriers (heterozygous) of a PAH gene mutation; 25% risk with each pregnancy when both parents are carriers",
      "Certain ethnic populations with higher carrier frequency: individuals of Northern European, Irish, and Turkish descent have higher incidence",
      "Consanguineous (related) parents increasing the probability of both carrying the same recessive mutation",
      "Maternal PKU (elevated maternal phenylalanine levels during pregnancy) causing teratogenic effects on the fetus: microcephaly, congenital heart defects, intrauterine growth restriction, and intellectual disability -- even if the fetus does not have PKU",
      "Delayed newborn screening (screening before 24 hours of age may yield false-negative results if insufficient protein has been ingested)",
      "Non-adherence to phenylalanine-restricted diet, especially during adolescence and young adulthood when dietary control often lapses",
      "Intercurrent illness or physiological stress increasing protein catabolism and transiently elevating blood phenylalanine levels"
    ],
    diagnostics: [
      "Newborn screening (Guthrie test or tandem mass spectrometry): performed on heel-stick blood sample collected on filter paper 24-48 hours after birth (after protein feeding has begun); detects elevated blood phenylalanine levels; this is the cornerstone of early detection and prevention",
      "Quantitative plasma phenylalanine level: diagnostic confirmation test; classic PKU defined as blood Phe greater than 20 mg/dL on unrestricted diet; mild/moderate PKU (hyperphenylalaninemia) defined as Phe between 2-20 mg/dL",
      "Plasma tyrosine level: typically low or low-normal in PKU due to deficient conversion from phenylalanine; helps distinguish PKU from other causes of hyperphenylalaninemia",
      "BH4 (tetrahydrobiopterin) loading test: determines responsiveness to sapropterin therapy; approximately 20-50% of PKU patients have BH4-responsive forms where phenylalanine levels decrease significantly after BH4 administration",
      "PAH gene mutation analysis: identifies specific mutations for genotype-phenotype correlation, family counseling, prenatal diagnosis in subsequent pregnancies, and prediction of BH4 responsiveness",
      "Neurodevelopmental assessments: regular developmental screening (Denver II or equivalent) and formal neuropsychological testing to monitor cognitive function and detect subtle deficits early"
    ],
    management: [
      "Initiate lifelong phenylalanine-restricted diet as early as possible (ideally within first 7-10 days of life) to prevent irreversible neurological damage; target blood Phe level 2-6 mg/dL for children and 2-10 mg/dL for adults",
      "Provide phenylalanine-free medical formula as the primary protein source: specialized formulas contain all essential amino acids EXCEPT phenylalanine, plus supplemental tyrosine, vitamins, and minerals",
      "Restrict high-protein foods that contain phenylalanine: meat, fish, poultry, eggs, dairy products, nuts, legumes, and products containing aspartame (artificial sweetener that is metabolized to phenylalanine)",
      "Allow measured amounts of natural protein from low-phenylalanine foods (most fruits, most vegetables, some grains) to meet phenylalanine requirements for growth without exceeding safe blood levels",
      "Monitor blood phenylalanine levels regularly: weekly in infancy, biweekly to monthly in childhood, at least monthly in adults; adjust dietary phenylalanine intake based on levels",
      "Administer sapropterin (Kuvan) as prescribed for BH4-responsive patients; this can increase phenylalanine tolerance and allow a less restrictive diet",
      "Provide preconception counseling for women with PKU: strict dietary control must be achieved BEFORE conception (Phe below 6 mg/dL) and maintained throughout pregnancy to prevent maternal PKU syndrome in the fetus"
    ],
    nursingActions: [
      "Educate parents on proper heel-stick blood collection technique for home phenylalanine monitoring: collect on filter paper card, dry at room temperature, mail to metabolic laboratory on the same day",
      "Reinforce dietary restrictions with age-appropriate education: teach families to read food labels for protein and phenylalanine content, avoid aspartame (found in diet sodas and sugar-free products), and use phenylalanine exchange lists",
      "Monitor growth parameters (weight, length/height, head circumference) at every visit and plot on growth charts; poor growth may indicate excessive dietary restriction or inadequate caloric intake",
      "Assess developmental milestones at each clinic visit using standardized screening tools; delayed milestones may indicate inadequate dietary control or need for early intervention services",
      "Administer prescribed supplements: iron (restricted diets may be deficient), phenylalanine-free formula (ensure correct preparation and volume), and sapropterin if prescribed",
      "Support family coping and dietary adherence: connect with metabolic dietitian, PKU support groups, and respite resources; acknowledge the significant burden of lifelong dietary management",
      "Document and report blood phenylalanine levels, dietary intake assessments, growth measurements, developmental screening results, and any concerns about adherence to the metabolic team"
    ],
    assessmentFindings: [
      "Newborn: appears normal at birth because the placenta cleared excess phenylalanine during fetal life; symptoms develop gradually over weeks to months if untreated",
      "Musty or mousy odor of urine, sweat, and skin: caused by accumulation of phenylacetic acid (a phenylalanine metabolite) -- historically the first clinical clue before newborn screening was implemented",
      "Fair complexion: light skin, blonde hair, and blue eyes due to decreased melanin production (tyrosine deficiency reduces melanin synthesis) -- this coloring may be lighter than expected for the family's ethnic background",
      "Untreated PKU (historical, rarely seen due to newborn screening): severe intellectual disability (IQ below 50), seizures (25% of untreated patients), hyperactivity, irritability, self-injurious behavior, eczema-like skin rash, microcephaly",
      "Treated PKU with good dietary control: normal intelligence and development; mild executive function difficulties (attention, processing speed) may be present even with adequate treatment",
      "Elevated blood phenylalanine level on laboratory monitoring: levels above 6 mg/dL in children or above 10 mg/dL in adults indicate need for dietary adjustment",
      "Maternal PKU effects on fetus (when maternal Phe is poorly controlled during pregnancy): microcephaly, congenital heart defects, facial dysmorphism, intrauterine growth restriction, intellectual disability in the offspring -- even if the baby does not have PKU"
    ],
    signs: {
      left: [
        "Blood phenylalanine level within target range (2-6 mg/dL for children)",
        "Normal growth parameters on age-appropriate growth charts",
        "Meeting developmental milestones on schedule",
        "Adequate caloric intake with appropriate medical formula consumption",
        "Good family understanding of dietary restrictions and monitoring",
        "Mild musty odor during intercurrent illness (transient elevation)"
      ],
      right: [
        "Blood phenylalanine level persistently above 10 mg/dL indicating dietary non-adherence or metabolic decompensation",
        "Regression of developmental milestones or new-onset seizures",
        "Failure to thrive with weight loss or growth deceleration crossing percentile lines",
        "Severe behavioral changes (irritability, self-injurious behavior, hyperactivity) suggesting toxic phenylalanine levels",
        "Maternal PKU with Phe above 6 mg/dL during pregnancy (immediate referral required)",
        "Eczematous skin rash unresponsive to topical treatment (may indicate poor metabolic control)"
      ]
    },
    medications: [
      {
        name: "Sapropterin (Kuvan)",
        type: "Phenylalanine hydroxylase cofactor / BH4 analogue",
        action: "Sapropterin dihydrochloride is a synthetic form of tetrahydrobiopterin (BH4), the essential cofactor required by phenylalanine hydroxylase (PAH) to convert phenylalanine to tyrosine. In BH4-responsive PKU patients (those with residual PAH enzyme activity and specific mutations), exogenous BH4 supplementation enhances the residual enzyme activity, increasing phenylalanine metabolism and lowering blood phenylalanine levels. This allows patients to tolerate more dietary phenylalanine while maintaining safe blood levels.",
        sideEffects: "Headache (most common), rhinorrhea, pharyngolaryngeal pain, diarrhea, vomiting, upper respiratory infection, cough; generally well tolerated",
        contra: "Known hypersensitivity to sapropterin or any excipients; patients who are non-responsive to BH4 (approximately 50-80% of classic PKU patients do not respond); concurrent levodopa use (BH4 may enhance levodopa effects)",
        pearl: "A BH4 loading test must be performed BEFORE initiating sapropterin to confirm responsiveness -- response is defined as a 30% or greater reduction in blood phenylalanine after a test dose. Dissolve tablets in water or apple juice and take with food to enhance absorption. Continue to monitor blood phenylalanine levels regularly even with sapropterin therapy; dietary phenylalanine liberalization should be gradual and guided by blood levels."
      },
      {
        name: "Phenylalanine-Free Medical Formula",
        type: "Medical nutrition therapy / amino acid supplement",
        action: "Phenylalanine-free medical formula provides a complete amino acid profile with all essential amino acids EXCEPT phenylalanine, plus supplemental tyrosine (which becomes conditionally essential in PKU), vitamins, minerals, and calories. This formula serves as the primary protein source for individuals with PKU, allowing adequate protein intake for growth and maintenance while avoiding the phenylalanine found in natural protein sources. Different formulations are available for infants (powdered formula), children (flavored drinks and bars), and adults (capsules, powders, and ready-to-drink products).",
        sideEffects: "Poor palatability (taste and odor can be challenging, reducing adherence especially in adolescents and adults), gastrointestinal discomfort (bloating, osmotic diarrhea if concentrated), micronutrient excesses or deficiencies if not taken as directed",
        contra: "Known allergy to specific formula components; formula must NOT be the sole protein source -- small amounts of natural phenylalanine are essential for growth (complete phenylalanine elimination is harmful)",
        pearl: "Formula compliance is the single greatest challenge in PKU management, especially during adolescence. Strategies to improve adherence include offering age-appropriate formats (ready-to-drink vs powder), chilling the formula, mixing with allowed flavored beverages, and distributing intake throughout the day. The formula provides 80-90% of total protein needs; the remaining 10-20% comes from measured amounts of low-phenylalanine natural foods."
      },
      {
        name: "Iron Supplement (Ferrous Sulfate)",
        type: "Mineral supplement / hematopoietic agent",
        action: "Provides elemental iron for hemoglobin synthesis, oxygen transport, and cellular metabolic processes. Individuals with PKU on phenylalanine-restricted diets are at increased risk of iron deficiency because many iron-rich foods (red meat, poultry, fish, legumes) are restricted or eliminated from the diet. Iron is absorbed primarily in the duodenum in the ferrous (Fe2+) form; absorption is enhanced by vitamin C and inhibited by calcium, antacids, and phytates.",
        sideEffects: "GI disturbances (nausea, constipation, abdominal cramping, dark/black stools -- normal color change), metallic taste, staining of teeth with liquid formulation",
        contra: "Iron overload conditions (hemochromatosis, hemosiderosis); active GI bleeding (may mask melena); concurrent IV iron administration; known hypersensitivity",
        pearl: "Administer on an empty stomach with vitamin C-containing juice (orange juice) to enhance absorption by converting ferric iron to the more absorbable ferrous form. If GI upset occurs, may be taken with a small amount of food (but NOT with dairy products, tea, or antacids which inhibit absorption). Liquid formulations should be given through a straw or medicine dropper to the back of the mouth to prevent tooth staining. Monitor serum ferritin and hemoglobin levels periodically."
      }
    ],
    pearls: [
      "PKU is detected by NEWBORN SCREENING (Guthrie test or tandem mass spectrometry) performed on a heel-stick blood sample collected 24-48 hours after birth -- this is the most important point because early detection and dietary treatment prevent irreversible intellectual disability",
      "The characteristic MUSTY or MOUSY ODOR of urine and sweat is caused by phenylacetic acid (a phenylalanine metabolite) and is a clinical hallmark of untreated or poorly controlled PKU",
      "PKU patients have characteristically FAIR skin, LIGHT hair, and BLUE eyes because tyrosine deficiency (from blocked phenylalanine-to-tyrosine conversion) reduces melanin synthesis -- these features may be lighter than expected for the family",
      "ASPARTAME (NutraSweet) is absolutely CONTRAINDICATED in PKU because it is metabolized to phenylalanine in the body -- teach families to read all food and beverage labels for aspartame content, especially diet sodas and sugar-free products",
      "The Phe-restricted diet is LIFELONG -- although dietary relaxation was historically permitted after childhood, current evidence shows that elevated phenylalanine levels at any age impair executive function, attention, and mood; lifelong dietary adherence is now recommended",
      "MATERNAL PKU is a critical concept: women with PKU who have elevated phenylalanine during pregnancy can cause severe birth defects in their baby (microcephaly, heart defects, intellectual disability) even if the baby does NOT have PKU -- strict Phe control (below 6 mg/dL) must be achieved BEFORE conception",
      "Sapropterin (Kuvan) only works in BH4-RESPONSIVE patients (those with residual PAH enzyme activity) -- approximately 20-50% of PKU patients respond; a loading test must confirm responsiveness before initiating long-term therapy"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a newborn whose newborn screening reveals elevated phenylalanine levels. The nurse understands that this finding is most consistent with which condition?",
        options: [
          "Galactosemia",
          "Phenylketonuria (PKU)",
          "Congenital hypothyroidism",
          "Maple syrup urine disease"
        ],
        correct: 1,
        rationale: "Elevated blood phenylalanine levels on newborn screening are diagnostic of phenylketonuria (PKU), an autosomal recessive disorder caused by deficiency of phenylalanine hydroxylase (PAH). Galactosemia involves galactose metabolism, congenital hypothyroidism involves thyroid hormone production, and maple syrup urine disease involves branched-chain amino acid metabolism."
      },
      {
        question: "The parents of a child with PKU ask the practical nurse if their child can drink diet soda. What is the most appropriate response?",
        options: [
          "Diet soda is safe because it contains no sugar",
          "Diet soda containing aspartame must be avoided because aspartame is metabolized to phenylalanine",
          "Diet soda is allowed in small quantities with meals",
          "Only caffeine-free diet soda should be avoided"
        ],
        correct: 1,
        rationale: "Aspartame (NutraSweet) is an artificial sweetener found in many diet sodas and sugar-free products. When metabolized in the body, aspartame produces phenylalanine, which cannot be properly metabolized by individuals with PKU. Consumption of aspartame-containing products will elevate blood phenylalanine to potentially neurotoxic levels. All products must be checked for aspartame content."
      },
      {
        question: "A woman with PKU is planning to become pregnant. The practical nurse reinforces which critical teaching point?",
        options: [
          "PKU dietary restrictions can be relaxed during pregnancy to ensure adequate nutrition",
          "Blood phenylalanine levels must be strictly controlled (below 6 mg/dL) BEFORE conception and throughout pregnancy to prevent birth defects in the baby",
          "The baby will automatically have PKU if the mother has PKU",
          "Sapropterin should be discontinued before pregnancy"
        ],
        correct: 1,
        rationale: "Maternal PKU is a critical concept. Elevated maternal phenylalanine levels during pregnancy are teratogenic to the developing fetus, causing microcephaly, congenital heart defects, intrauterine growth restriction, and intellectual disability -- even if the fetus does not have PKU. Strict phenylalanine control (below 6 mg/dL) must be achieved BEFORE conception and maintained throughout pregnancy. The baby will have PKU only if it inherits two mutated PAH genes (one from each parent)."
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
if (fail > 0) process.exit(1);
