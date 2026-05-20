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
  "wound-healing-phases-rpn": {
    title: "Wound Healing Phases for Practical Nurses",
    cellular: {
      title: "Physiology of Wound Healing Phases",
      content: "Wound healing is a complex, overlapping biological process that occurs in four distinct but interrelated phases: hemostasis, inflammation, proliferation, and maturation (remodeling). Hemostasis begins immediately upon tissue injury and lasts approximately 5 to 10 minutes. When a blood vessel is damaged, vasoconstriction occurs as the first response to reduce blood loss. Platelets adhere to exposed collagen in the vessel wall, aggregate together, and form a platelet plug. The coagulation cascade is activated, converting fibrinogen to fibrin, which stabilizes the platelet plug into a clot. This clot serves as a temporary matrix for cell migration in subsequent phases. The inflammatory phase begins within hours of injury and typically lasts 1 to 6 days. Neutrophils are the first white blood cells to arrive at the wound site (within 6 to 8 hours), where they phagocytize bacteria and debris. Macrophages follow within 24 to 48 hours and are considered the most critical cells in wound healing because they not only continue phagocytosis but also release growth factors (such as platelet-derived growth factor, transforming growth factor-beta, and vascular endothelial growth factor) that recruit fibroblasts and stimulate angiogenesis. Cardinal signs of inflammation include redness (rubor), heat (calor), swelling (tumor), pain (dolor), and loss of function (functio laesa). The proliferative phase spans approximately day 4 through day 21 and involves three key processes: granulation tissue formation, wound contraction, and epithelialization. Fibroblasts migrate into the wound and synthesize collagen, the primary structural protein of the extracellular matrix. New capillaries sprout from existing blood vessels (angiogenesis), creating the characteristic red, granular appearance of healthy granulation tissue. Myofibroblasts contract and pull wound edges closer together. Epithelial cells migrate across the wound surface from the wound margins, a process called epithelialization. The maturation (remodeling) phase begins around day 21 and can continue for up to 2 years. During this phase, type III collagen is gradually replaced by stronger type I collagen through a balance of collagen synthesis and degradation by matrix metalloproteinases. The tensile strength of the wound increases but never exceeds approximately 80% of the original tissue strength. The scar becomes less vascular and transitions from red or purple to a paler color as blood vessels regress. Nutritional status significantly impacts healing: vitamin C is essential for collagen synthesis and immune function; zinc is required for cell division and protein synthesis; iron is necessary for oxygen transport to the wound bed; and adequate protein intake (1.25 to 1.5 g/kg/day for healing wounds) provides the amino acids needed for tissue repair."
    },
    riskFactors: [
      "Advanced age (decreased inflammatory response, reduced collagen synthesis, slower epithelialization)",
      "Diabetes mellitus (impaired microcirculation, neuropathy, hyperglycemia inhibits neutrophil function)",
      "Malnutrition or protein deficiency (inadequate amino acids for collagen synthesis, impaired immune function)",
      "Smoking and tobacco use (nicotine causes vasoconstriction, carbon monoxide reduces oxygen-carrying capacity)",
      "Chronic corticosteroid use (suppresses inflammatory phase, inhibits fibroblast proliferation and collagen synthesis)",
      "Peripheral vascular disease (reduced blood flow and oxygen delivery to wound bed)",
      "Obesity (poor vascularity of adipose tissue, increased wound tension, higher infection risk)"
    ],
    diagnostics: [
      "Serum albumin and prealbumin: albumin less than 3.5 g/dL indicates malnutrition; prealbumin less than 15 mg/dL reflects acute nutritional deficiency; both impair wound healing",
      "Complete blood count (CBC): WBC elevation suggests infection; hemoglobin below 10 g/dL impairs oxygen transport to wound bed",
      "Blood glucose and HbA1c: hyperglycemia (above 200 mg/dL) impairs neutrophil function and delays healing; HbA1c above 7% indicates poor long-term glycemic control",
      "Wound culture and sensitivity: obtain if signs of infection present; collect specimen from wound base after cleansing, not from surface exudate",
      "Serum vitamin C and zinc levels: deficiency in either delays collagen synthesis and impairs immune function",
      "Ankle-brachial index (ABI): values below 0.9 indicate peripheral arterial disease; values above 1.3 suggest arterial calcification; guides compression therapy decisions"
    ],
    management: [
      "Maintain moist wound healing environment using appropriate dressings selected for wound characteristics (hydrogels for dry wounds, foams or alginates for exudative wounds)",
      "Ensure adequate nutritional intake: protein 1.25-1.5 g/kg/day, vitamin C 250-500 mg twice daily, zinc 220 mg daily, and adequate caloric intake for healing",
      "Offload pressure from wound sites using repositioning every 2 hours, pressure redistribution surfaces, and appropriate positioning devices",
      "Optimize glycemic control in diabetic patients; blood glucose below 180 mg/dL promotes effective wound healing",
      "Address modifiable risk factors: smoking cessation support, medication review for wound-impairing drugs, activity optimization",
      "Implement wound cleansing with normal saline or prescribed wound cleanser at each dressing change; avoid cytotoxic agents such as hydrogen peroxide or povidone-iodine on healing wounds",
      "Monitor and document wound progress weekly using standardized tools to track healing trajectory"
    ],
    nursingActions: [
      "Assess wound at each dressing change and document size, depth, wound bed characteristics (granulation, slough, eschar), exudate, and periwound skin condition",
      "Perform wound cleansing using gentle irrigation with normal saline at 4-15 psi (using a 35 mL syringe with a 19-gauge angiocatheter provides approximately 8 psi)",
      "Apply appropriate dressing based on wound phase: dry wounds need moisture donation (hydrogels), exudative wounds need absorption (foams, alginates), granulating wounds need protection",
      "Reinforce nutritional teaching: importance of protein, vitamin C, zinc, iron, and adequate hydration for wound healing",
      "Monitor for signs of delayed healing: wound not progressing through expected phases, wound bed pallor, increased size after initial improvement",
      "Report wound deterioration or signs of infection to the registered nurse or physician immediately",
      "Educate patient and family on wound care, signs of infection, nutritional requirements, and when to seek medical attention"
    ],
    assessmentFindings: [
      "Hemostasis phase: active bleeding that is controlled by clot formation; wound edges approximated or gaping depending on injury mechanism",
      "Inflammatory phase (days 1-6): redness, warmth, swelling, and pain surrounding the wound; serous or serosanguineous exudate is normal",
      "Proliferative phase (days 4-21): beefy red granulation tissue filling the wound base; wound edges contracting inward; epithelial cells migrating across the surface",
      "Maturation phase (day 21 to 2 years): scar tissue forming and remodeling; scar color changing from red/purple to pale pink or white; wound closed but may be raised or depressed",
      "Delayed healing indicators: wound bed is pale pink or yellow (slough); wound size not decreasing as expected; friable granulation tissue that bleeds easily",
      "Healthy healing indicators: wound size decreasing measurably each week; wound bed is moist and beefy red; wound edges are migrating inward; minimal serous exudate"
    ],
    signs: {
      left: [
        "Mild redness and warmth at wound margins (normal inflammatory response)",
        "Serous or serosanguineous exudate in moderate amounts",
        "Gradual wound contraction and size reduction",
        "Mild pain or tenderness at the wound site",
        "Intact periwound skin with slight erythema",
        "Thin layer of slough present in early healing stages"
      ],
      right: [
        "Purulent or foul-smelling exudate (indicates infection)",
        "Wound dehiscence or evisceration (surgical emergency if viscera exposed)",
        "Rapidly expanding erythema or cellulitis beyond wound margins",
        "Fever with wound deterioration (systemic infection sign)",
        "Black necrotic tissue (eschar) covering wound bed (impedes healing)",
        "Signs of sepsis: fever, tachycardia, hypotension, altered mental status"
      ]
    },
    medications: [
      {
        name: "Ascorbic Acid (Vitamin C)",
        type: "Water-soluble vitamin / essential cofactor for collagen synthesis",
        action: "Serves as a required cofactor for prolyl hydroxylase and lysyl hydroxylase enzymes, which are essential for hydroxylation of proline and lysine residues in collagen molecules; without adequate vitamin C, collagen fibers cannot form stable triple-helix structures, leading to weak, fragile tissue and impaired wound healing; also enhances neutrophil and macrophage function for immune defense",
        sideEffects: "GI upset (nausea, abdominal cramps, diarrhea) at high doses; kidney stones (oxalate) with chronic high-dose use; false-negative results on fecal occult blood tests",
        contra: "History of oxalate kidney stones; hemochromatosis or other iron overload conditions (vitamin C enhances iron absorption); glucose-6-phosphate dehydrogenase (G6PD) deficiency at very high doses",
        pearl: "Recommended dose for wound healing is 250-500 mg twice daily; deficiency (scurvy) causes poor wound healing, gum bleeding, and petechiae; water-soluble so excess is excreted renally but megadoses should be avoided"
      },
      {
        name: "Zinc Sulfate",
        type: "Essential trace mineral / cofactor for cell division and protein synthesis",
        action: "Functions as a cofactor for more than 300 enzymes involved in cell division, DNA synthesis, protein synthesis, and immune function; essential for fibroblast proliferation and collagen synthesis during the proliferative phase of wound healing; supports T-lymphocyte function and natural killer cell activity for wound infection defense",
        sideEffects: "Nausea, vomiting, metallic taste, abdominal cramps, diarrhea; copper deficiency with chronic use (zinc competes with copper for absorption); headache",
        contra: "Copper deficiency (zinc supplementation will worsen it); severe renal impairment; concurrent use with certain antibiotics (tetracyclines, fluoroquinolones -- zinc chelates and reduces their absorption)",
        pearl: "Standard dose for wound healing is 220 mg daily (containing 50 mg elemental zinc); take with food to reduce GI side effects; separate from tetracycline or fluoroquinolone antibiotics by at least 2 hours; supplementation is most beneficial when serum zinc is low"
      },
      {
        name: "Ferrous Sulfate (Iron)",
        type: "Essential mineral / oxygen transport cofactor",
        action: "Provides elemental iron for incorporation into hemoglobin molecules in red blood cells, enabling adequate oxygen delivery to wound tissue; tissue hypoxia from iron-deficiency anemia impairs all phases of wound healing because oxygen is required for collagen synthesis, neutrophil bacterial killing (oxidative burst), and cellular proliferation",
        sideEffects: "Constipation (most common), nausea, abdominal pain, dark/black stools, metallic taste; GI irritation; accidental pediatric overdose can be fatal",
        contra: "Hemochromatosis or hemosiderosis; hemolytic anemias not due to iron deficiency; repeated blood transfusions (risk of iron overload); concurrent IV iron therapy",
        pearl: "Take on an empty stomach with vitamin C (enhances absorption by converting ferric to ferrous iron); avoid taking with calcium, antacids, dairy, tea, or coffee (all reduce absorption); separate from tetracyclines and fluoroquinolones by 2 hours; stool may turn dark or black (expected, not harmful)"
      }
    ],
    pearls: [
      "The four phases of wound healing are hemostasis (seconds to minutes), inflammation (days 1-6), proliferation (days 4-21), and maturation/remodeling (day 21 to 2 years) -- these phases overlap and are not strictly sequential",
      "Macrophages are the single most important cell type in wound healing -- they phagocytize debris AND release growth factors that recruit fibroblasts and stimulate new blood vessel formation",
      "Wounds never regain full original tissue strength -- maximum tensile strength of a healed wound is approximately 80% of unwounded tissue",
      "Moist wound healing is superior to dry wound healing -- a moist environment promotes epithelial cell migration, reduces pain, and accelerates healing by up to 50% compared to air-exposed wounds",
      "Malnutrition is the most common systemic cause of delayed wound healing -- protein, vitamin C, zinc, and iron are the four nutrients most critical for healing",
      "Granulation tissue that is beefy red and moist indicates healthy healing; pale pink, dusky, or friable granulation tissue indicates compromised blood supply or infection",
      "Avoid using cytotoxic agents such as full-strength hydrogen peroxide, povidone-iodine, or Dakin solution directly on healing wound beds -- these destroy fibroblasts and delay healing"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a wound on day 5 post-injury that shows beefy red tissue with small blood vessels filling the wound base. Which wound healing phase does this finding represent?",
        options: [
          "Hemostasis phase",
          "Inflammatory phase",
          "Proliferative phase",
          "Maturation phase"
        ],
        correct: 2,
        rationale: "Beefy red granulation tissue with new blood vessel formation (angiogenesis) is characteristic of the proliferative phase, which typically occurs from day 4 through day 21. During this phase, fibroblasts produce collagen and new capillaries form to supply the healing tissue."
      },
      {
        question: "A patient with a chronic wound has a serum albumin of 2.8 g/dL. The practical nurse recognizes this value most likely contributes to delayed healing because of which mechanism?",
        options: [
          "Excessive collagen production causing hypertrophic scarring",
          "Inadequate protein for collagen synthesis and immune function",
          "Increased platelet aggregation causing microthrombi",
          "Excessive inflammatory response causing tissue destruction"
        ],
        correct: 1,
        rationale: "Serum albumin below 3.5 g/dL indicates protein malnutrition. Protein is essential for collagen synthesis during the proliferative phase and for immune cell function during the inflammatory phase. Malnutrition is the most common systemic cause of delayed wound healing."
      },
      {
        question: "Which cell type is considered the most critical for wound healing because it both removes debris and releases growth factors that stimulate tissue repair?",
        options: [
          "Neutrophils",
          "Macrophages",
          "Fibroblasts",
          "Platelets"
        ],
        correct: 1,
        rationale: "Macrophages are considered the single most important cell in wound healing. They arrive within 24-48 hours, continue the phagocytosis started by neutrophils, and release growth factors (PDGF, TGF-beta, VEGF) that recruit fibroblasts and stimulate angiogenesis, driving the transition from inflammation to proliferation."
      }
    ]
  },

  "wound-infection-signs-rpn": {
    title: "Wound Infection Signs for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Wound Infection",
      content: "Wound infection occurs when microorganisms invade wound tissue, overwhelm host defenses, and cause tissue damage. Understanding the wound infection continuum is essential for practical nurses. All open wounds contain microorganisms, but their presence does not automatically constitute infection. The continuum progresses through four stages: contamination (microorganisms present but not replicating), colonization (microorganisms replicating but not causing tissue damage), local infection (microorganisms invading tissue and causing local tissue damage), and systemic infection/sepsis (organisms or their toxins spreading beyond the wound to cause systemic illness). Two validated clinical frameworks help identify wound infection at different stages. The NERDS criteria identify superficial (localized) wound infection: Non-healing wound despite appropriate care, Exudate that is increasing in volume or changing character, Red and friable granulation tissue that bleeds easily, Debris or dead cells on the wound surface, and Smell or unpleasant odor from the wound. When three or more NERDS criteria are present, topical antimicrobial therapy is indicated. The STONES criteria identify deep and surrounding tissue infection: Size increasing despite appropriate care, Temperature elevated in surrounding tissue, Os (Latin for bone) -- probing to bone suggests osteomyelitis, New or satellite areas of tissue breakdown, Exudate that is purulent or has changed, and Smell from the wound. When three or more STONES criteria are present, systemic antibiotic therapy is indicated. Biofilm is a significant barrier to wound healing and is present in an estimated 60-90% of chronic wounds. Biofilm consists of communities of bacteria encased in a self-produced extracellular polymeric substance (EPS) that protects them from antibiotics and host immune defenses. Biofilm bacteria can tolerate antibiotic concentrations up to 1000 times higher than planktonic (free-floating) bacteria. Biofilm appears clinically as a shiny, gel-like coating on the wound surface or as a dull, slimy layer that reforms quickly after debridement. Wound infection triggers an excessive and prolonged inflammatory response that increases levels of matrix metalloproteinases (MMPs), which degrade the extracellular matrix and growth factors needed for healing. This creates a destructive cycle: infection prolongs inflammation, inflammation increases tissue destruction, and tissue destruction provides more substrate for bacterial growth. The practical nurse must differentiate normal inflammatory signs (expected in acute wounds for the first 3-5 days) from infection signs (progressive, worsening, or occurring beyond the expected inflammatory timeframe). Classic signs of wound infection include the cardinal signs of inflammation that are disproportionate, progressive, or occur beyond the normal inflammatory period: increasing erythema extending beyond wound margins (cellulitis), increasing warmth, increasing edema, increasing pain (especially if previously improving then worsening), purulent or malodorous exudate, delayed healing or wound deterioration, and systemic signs such as fever, elevated WBC count, and malaise."
    },
    riskFactors: [
      "Diabetes mellitus (hyperglycemia impairs neutrophil phagocytosis and chemotaxis, peripheral neuropathy masks pain cues)",
      "Immunosuppression (corticosteroids, chemotherapy, HIV/AIDS reduce immune cell function and number)",
      "Malnutrition (protein-calorie deficiency impairs immune cell production and antibody formation)",
      "Poor wound perfusion (peripheral vascular disease, smoking reduce oxygen and immune cell delivery)",
      "Foreign bodies in wound (sutures, debris provide surfaces for bacterial adhesion and biofilm formation)",
      "Large wound surface area or deep wound cavities (greater surface for bacterial colonization, anaerobic environment in deep wounds)",
      "Prolonged hospitalization (exposure to nosocomial pathogens including MRSA, VRE, and multidrug-resistant organisms)"
    ],
    diagnostics: [
      "Wound culture and sensitivity: obtain from wound base after cleansing (not surface exudate); use Levine technique (rotate swab over 1 cm squared area with sufficient pressure to express fluid from wound tissue); results guide targeted antibiotic therapy",
      "Complete blood count with differential: WBC above 11,000/mcL suggests systemic infection; left shift (increased bands/immature neutrophils above 10%) indicates acute bacterial infection",
      "C-reactive protein (CRP): acute-phase reactant that rises within 6-8 hours of infection onset; useful for monitoring infection response to treatment; levels above 10 mg/L are elevated",
      "Erythrocyte sedimentation rate (ESR): nonspecific inflammatory marker; elevated in infection but slower to rise and fall than CRP; useful for monitoring chronic wound infections",
      "Blood cultures (2 sets from separate sites): obtain before initiating antibiotics if systemic infection or sepsis suspected; identifies causative organism in bloodstream",
      "Wound biopsy: gold standard for diagnosing wound infection; quantitative tissue culture greater than 100,000 (10 to the 5th power) organisms per gram of tissue confirms infection"
    ],
    management: [
      "Obtain wound culture before initiating antimicrobial therapy when infection is suspected; use proper collection technique (Levine method) to ensure accurate results",
      "Apply topical antimicrobials as ordered for superficial wound infection (NERDS criteria met): silver dressings, cadexomer iodine, or medical-grade honey",
      "Administer systemic antibiotics as prescribed for deep wound infection (STONES criteria met): ensure timely first dose, complete full course, monitor for adverse effects",
      "Perform wound debridement as ordered to remove necrotic tissue, biofilm, and debris that harbor bacteria and impede healing",
      "Maintain moist wound environment with appropriate antimicrobial dressings; change dressings per prescribed frequency or when saturated",
      "Monitor vital signs every 4 hours or more frequently if systemic infection suspected; report temperature above 38.3 degrees Celsius (101 degrees Fahrenheit) or other sepsis criteria",
      "Implement contact precautions if multidrug-resistant organism (MDRO) infection confirmed; proper hand hygiene, gown, and gloves for wound care"
    ],
    nursingActions: [
      "Assess wound at every dressing change for NERDS and STONES criteria; document findings using standardized wound assessment tools",
      "Monitor and trend wound characteristics: compare current size, exudate volume/color/odor, wound bed appearance, and periwound skin to previous assessments",
      "Perform wound cleansing with normal saline or prescribed wound cleanser using appropriate irrigation pressure (4-15 psi) before applying antimicrobial dressings",
      "Administer antibiotics at scheduled times to maintain therapeutic blood levels; monitor for adverse effects including allergic reactions, GI symptoms, and Clostridioides difficile infection",
      "Report worsening wound signs, new-onset fever, or systemic infection signs to the registered nurse or physician immediately using SBAR format",
      "Reinforce patient education on signs of wound infection to watch for at home: increasing redness, warmth, swelling, pain, drainage changes, or fever",
      "Practice strict aseptic technique during wound care; proper hand hygiene before and after wound contact; use sterile supplies for wounds healing by secondary intention"
    ],
    assessmentFindings: [
      "Superficial infection (NERDS): wound not progressing despite appropriate care, increasing exudate, red friable granulation tissue, wound surface debris, foul odor",
      "Deep infection (STONES): wound increasing in size, periwound warmth elevated, probe-to-bone positive, new satellite wounds or breakdown areas, purulent exudate, foul odor",
      "Cellulitis: spreading erythema beyond wound margins that is warm, tender, and may have indistinct borders; may present with red streaking (lymphangitis) tracking toward regional lymph nodes",
      "Biofilm presence: shiny, slimy coating on wound surface that reforms within 24-48 hours after debridement; wound fails to progress despite appropriate therapy",
      "Systemic infection signs: fever above 38.3 degrees Celsius, tachycardia (heart rate above 90), tachypnea (respiratory rate above 20), elevated WBC, malaise, confusion in elderly",
      "Osteomyelitis indicators: probe-to-bone test positive (sterile probe reaches bone through wound), exposed bone, persistent deep wound over bony prominence not responding to treatment"
    ],
    signs: {
      left: [
        "Mild erythema confined to wound margins (normal inflammatory response)",
        "Serous or serosanguineous exudate in expected amounts",
        "Mild warmth at wound site during acute inflammatory phase",
        "Slight wound tenderness that is stable or improving",
        "Thin biofilm that responds to single debridement",
        "Wound progressing through healing phases at expected rate"
      ],
      right: [
        "Purulent, green, or foul-smelling exudate (indicates active infection)",
        "Cellulitis with spreading erythema, warmth, and induration beyond wound margins",
        "Fever above 38.3 degrees Celsius with wound deterioration (systemic infection)",
        "Crepitus in periwound tissue (may indicate gas gangrene -- surgical emergency)",
        "Wound increasing in size with exposed bone (possible osteomyelitis)",
        "Sepsis signs: fever, tachycardia, hypotension, altered mental status, elevated WBC"
      ]
    },
    medications: [
      {
        name: "Silver Sulfadiazine Cream (Flamazine/Silvadene)",
        type: "Topical antimicrobial (silver compound with sulfonamide)",
        action: "Silver ions bind to bacterial DNA and disrupt hydrogen bonding, inhibiting DNA replication and transcription; the sulfonamide component inhibits dihydropteroate synthetase, blocking folic acid synthesis; provides broad-spectrum coverage against gram-positive and gram-negative bacteria, including Pseudomonas aeruginosa, as well as some fungi",
        sideEffects: "Transient leukopenia (monitor CBC weekly during prolonged use), local burning or stinging upon application, skin discoloration (grey-brown), allergic contact dermatitis, delayed eschar separation",
        contra: "Sulfonamide allergy (cross-reactivity); premature infants or neonates under 2 months (risk of kernicterus from sulfonamide displacing bilirubin); pregnancy near term; glucose-6-phosphate dehydrogenase (G6PD) deficiency",
        pearl: "Apply 1/16-inch thick layer with sterile gloved hand or tongue depressor; commonly used for burn wounds; monitor WBC count weekly as transient leukopenia typically resolves even with continued use; do NOT use on face (risk of permanent skin discoloration)"
      },
      {
        name: "Cadexomer Iodine (Iodosorb)",
        type: "Topical antimicrobial / wound debridement agent",
        action: "Consists of modified starch microspheres containing 0.9% iodine; as the microspheres absorb wound exudate they swell and slowly release iodine into the wound bed over 72 hours; the sustained low-concentration iodine release kills bacteria including biofilm organisms while the swelling microspheres physically absorb exudate, debris, and bacteria from the wound surface",
        sideEffects: "Transient stinging upon application, local erythema, iodine sensitivity reactions; rarely may cause systemic iodine absorption with prolonged use on large wounds affecting thyroid function",
        contra: "Iodine or shellfish allergy; thyroid disorders (Hashimoto thyroiditis, Graves disease); concurrent lithium therapy (lithium plus iodine increases hypothyroidism risk); children under 2 years; pregnancy and breastfeeding; dry or minimally exudative wounds (requires moisture to activate)",
        pearl: "Particularly effective against biofilm -- disrupts the extracellular polymeric substance matrix; apply to moist wounds only and change every 2-3 days; do not use continuously for more than 3 months; effective against MRSA"
      },
      {
        name: "Metronidazole Gel (MetroGel/Flagyl topical)",
        type: "Topical antimicrobial (nitroimidazole antibiotic)",
        action: "Enters bacterial and protozoal cells where it is reduced by intracellular electron transport proteins to form cytotoxic compounds that damage DNA and inhibit nucleic acid synthesis; particularly effective against anaerobic bacteria that thrive in deep or necrotic wound environments; also has anti-inflammatory properties that reduce wound odor by eliminating anaerobic bacteria that produce volatile fatty acids and amines responsible for malodorous wounds",
        sideEffects: "Local skin irritation, dryness, burning sensation at application site; minimal systemic absorption with topical use; metallic taste if applied near mouth",
        contra: "Hypersensitivity to metronidazole or other nitroimidazoles; first trimester of pregnancy (systemic form -- topical absorption is minimal but caution advised)",
        pearl: "Primary indication in wound care is for malodorous wounds -- controls odor within 24-48 hours by eliminating anaerobic bacteria; apply thin layer to wound bed or saturate gauze and pack into wound cavity; available as 0.75% or 1% gel; can also be used as crushed oral metronidazole tablets mixed with hydrogel as a cost-effective alternative"
      }
    ],
    pearls: [
      "NERDS criteria identify SUPERFICIAL wound infection (Non-healing, Exudate increasing, Red friable granulation, Debris, Smell) -- three or more present indicates need for TOPICAL antimicrobial therapy",
      "STONES criteria identify DEEP wound infection (Size increasing, Temperature elevated, Os/probe-to-bone, New breakdown areas, Exudate purulent, Smell) -- three or more present indicates need for SYSTEMIC antibiotic therapy",
      "Biofilm is present in 60-90% of chronic wounds and is a major cause of delayed healing -- it appears as a shiny, slimy coating that reforms quickly after debridement; requires repeated debridement combined with antimicrobial therapy",
      "Obtain wound cultures BEFORE starting antibiotics using the Levine technique: cleanse wound first, then rotate swab over 1 cm squared area of viable tissue with pressure to express fluid -- do NOT culture surface exudate, pus, or necrotic tissue",
      "Normal inflammatory signs (redness, warmth, swelling) are EXPECTED in acute wounds for the first 3-5 days -- infection is suspected when these signs are disproportionate, worsening, or occur beyond the expected inflammatory timeframe",
      "Crepitus (crackling sensation on palpation of periwound tissue) may indicate gas gangrene (Clostridium perfringens) and constitutes a surgical emergency requiring immediate notification",
      "Elderly and immunocompromised patients may not mount a typical inflammatory response -- wound infection in these populations may present atypically with minimal erythema, no fever, or only subtle changes in wound appearance"
    ],
    quiz: [
      {
        question: "A practical nurse assesses a chronic wound and documents: wound has not decreased in size in 3 weeks, exudate has increased and is now yellow-green, granulation tissue is dark red and bleeds easily when touched, and the wound has an unpleasant odor. Using the NERDS criteria, what type of wound infection do these findings suggest?",
        options: [
          "Deep wound infection requiring systemic antibiotics",
          "Superficial wound infection requiring topical antimicrobial therapy",
          "Normal wound colonization requiring no change in treatment",
          "Wound contamination requiring only wound cleansing"
        ],
        correct: 1,
        rationale: "The NERDS criteria (Non-healing, Exudate increasing, Red friable granulation, Debris, Smell) identify superficial (localized) wound infection. This patient meets at least 4 NERDS criteria. Superficial infection is managed with topical antimicrobial therapy. STONES criteria would indicate deep infection requiring systemic antibiotics."
      },
      {
        question: "A practical nurse is collecting a wound culture specimen. Which technique ensures the most accurate culture results?",
        options: [
          "Swab the purulent drainage on the wound surface before cleansing",
          "Cleanse the wound first, then rotate the swab with pressure over viable wound tissue",
          "Collect the specimen from the necrotic tissue in the wound base",
          "Swab the periwound skin surrounding the wound margins"
        ],
        correct: 1,
        rationale: "The Levine technique provides the most accurate wound culture results: cleanse the wound first to remove surface contaminants, then rotate the swab over a 1 cm squared area of viable (not necrotic) wound tissue with sufficient pressure to express fluid from the tissue. Surface drainage, necrotic tissue, and periwound skin do not represent the organisms causing wound infection."
      },
      {
        question: "A patient's chronic leg wound has a shiny, gel-like coating that reforms within 24 hours after the wound is debrided. The practical nurse recognizes this finding is most consistent with which condition?",
        options: [
          "Normal wound granulation tissue",
          "Wound biofilm formation",
          "Allergic reaction to wound dressing",
          "Healthy epithelialization"
        ],
        correct: 1,
        rationale: "Biofilm appears as a shiny, slimy, or gel-like coating on the wound surface that characteristically reforms quickly (within 24-48 hours) after debridement. Biofilm is present in 60-90% of chronic wounds and is a major barrier to healing because it protects bacteria from both antibiotics and host immune defenses."
      }
    ]
  },

  "wound-measurement-rpn": {
    title: "Wound Measurement and Documentation for Practical Nurses",
    cellular: {
      title: "Principles of Wound Measurement and Documentation",
      content: "Accurate wound measurement and documentation are foundational nursing skills that directly impact treatment decisions, healing trajectory monitoring, and interprofessional communication. Wound measurement provides objective data that allows the healthcare team to determine whether a wound is healing, stalled, or deteriorating. A wound that does not show measurable improvement within 2-4 weeks of appropriate care should trigger a comprehensive reassessment of the treatment plan. The clock method (also called the face-of-the-clock method) is the standardized approach for wound measurement and orientation. The patient's head is positioned at 12 o'clock and the feet at 6 o'clock, regardless of the wound's actual anatomical location. Length is measured from the 12 o'clock to 6 o'clock position (head to toe), and width is measured from the 3 o'clock to 9 o'clock position (side to side), using the longest measurement in each axis. All measurements are recorded in centimeters. Depth is measured by gently inserting a sterile cotton-tipped applicator (or wound probe) perpendicular to the wound surface at the deepest point and marking the applicator at the level of the surrounding skin; the applicator is then measured against a centimeter ruler. Undermining is tissue destruction that occurs under intact wound margins, creating a pocket or shelf under the skin surrounding the wound. It is measured by gently inserting a cotton-tipped applicator under the wound edge and measuring the distance from the wound edge to the furthest extent of the undermining. Undermining location is documented using the clock method (for example, undermining extends 2.5 cm from 2 o'clock to 5 o'clock). Tunneling (also called sinus tracts) refers to narrow, channel-like extensions that extend from the wound bed into surrounding tissue. Unlike undermining (which runs parallel to the skin surface under wound edges), tunneling extends in a specific direction away from the wound. Tunneling is measured by inserting a cotton-tipped applicator into the tunnel opening and gently advancing until resistance is met; the depth is measured and the location documented using the clock method (for example, tunneling at 3 o'clock position extending 4.0 cm). Wound bed assessment uses color to describe tissue types: red (granulation tissue -- healthy), yellow (slough -- devitalized but not necrotic), black (eschar -- necrotic/dead tissue), and pink (epithelial tissue -- new skin formation). The percentage of each tissue type covering the wound bed should be estimated and documented. Exudate (wound drainage) is assessed for type (serous/clear, sanguineous/bloody, serosanguineous/pink, purulent/pus), amount (none, scant, small, moderate, large -- described relative to dressing saturation), color, and odor. Periwound skin (the tissue surrounding the wound within 4 cm of the wound edge) is assessed for color, temperature, moisture, integrity, induration (firmness), maceration (white, soggy, softened skin from excess moisture), and edema. The MEASURE framework provides a comprehensive wound assessment structure: Measure (length, width, depth), Exudate (type, amount, odor), Appearance (wound bed, tissue type percentages), Suffering (pain level), Undermining/tunneling, Re-evaluate (compare to previous assessments), and Edge (wound edges and periwound skin)."
    },
    riskFactors: [
      "Inconsistent measurement technique (different clinicians using different landmarks or methods leading to unreliable data)",
      "Irregular wound shapes (asymmetric wounds are more difficult to measure accurately using linear measurements alone)",
      "Deep wounds with undermining or tunneling (structures hidden beneath intact skin are easily missed without thorough assessment)",
      "Patient factors limiting assessment (pain, positioning limitations, cognitive impairment affecting cooperation)",
      "Wound location in areas difficult to visualize (sacrum, perineum, between toes, posterior surfaces)",
      "Presence of periwound maceration or callus obscuring true wound margins",
      "Documentation gaps (inconsistent recording frequency, incomplete wound descriptors, non-standardized terminology)"
    ],
    diagnostics: [
      "Serial wound measurements: compare length, width, depth, and surface area at consistent intervals (weekly minimum) to track healing trajectory; a wound should show 20-40% reduction in surface area within 2 weeks of appropriate treatment",
      "Wound photography: standardized digital photos with ruler included for scale, taken at consistent angle and distance at each assessment; provides visual record supplementing written measurements",
      "Wound tracing: place transparent film over wound and trace wound margins with permanent marker; provides wound shape documentation and can be used to calculate surface area",
      "Wound assessment tools: validated instruments such as the Pressure Ulcer Scale for Healing (PUSH tool), Bates-Jensen Wound Assessment Tool (BWAT), or Wound Bed Score provide standardized scoring",
      "Tissue biopsy or culture: indicated when wound is not progressing as expected; quantitative culture greater than 100,000 organisms per gram confirms infection as cause of non-healing",
      "Vascular assessment (ABI, toe pressures): performed when lower extremity wound is not healing to determine if inadequate blood supply is contributing to non-healing"
    ],
    management: [
      "Establish baseline wound measurements at initial assessment using the clock method: document length (12-6 o'clock), width (3-9 o'clock), depth, and any undermining or tunneling with location and extent",
      "Perform wound measurements at every dressing change or at minimum weekly; use consistent technique, positioning, and landmarks for reliable comparison",
      "Select appropriate wound measurement tools based on wound type: disposable rulers for linear measurements, cotton-tipped applicators for depth and tunneling, transparent film for wound tracing",
      "Document wound bed using percentage of tissue types: estimate and record percentage of red (granulation), yellow (slough), black (eschar), and pink (epithelial) tissue",
      "Assess and document exudate characteristics at each dressing change: type, amount, color, odor, and dressing saturation level",
      "Evaluate healing trajectory: wounds should decrease approximately 20-40% in surface area within 2 weeks; if not progressing, report to registered nurse or physician for treatment plan reassessment",
      "Use standardized wound assessment tools (PUSH tool or Bates-Jensen) as directed by facility protocol to provide consistent, reproducible wound scoring"
    ],
    nursingActions: [
      "Position patient consistently for wound measurement -- use the same body position at each assessment to minimize measurement variability caused by tissue shifting",
      "Use the clock method consistently: patient's head is always 12 o'clock, feet at 6 o'clock; measure length head-to-toe (12-6 o'clock) and width side-to-side (3-9 o'clock)",
      "Measure wound depth at the deepest point by gently inserting a sterile cotton-tipped applicator perpendicular to the wound bed and marking at skin level; measure against a centimeter ruler",
      "Assess for undermining by gently inserting a cotton-tipped applicator under wound edges around the entire wound circumference; document extent and location using the clock method",
      "Assess for tunneling by inserting a cotton-tipped applicator into any tunnel openings and gently advancing until resistance is met; document depth and clock position of each tunnel",
      "Document all wound characteristics using the MEASURE framework: Measure, Exudate, Appearance, Suffering, Undermining, Re-evaluate, Edge",
      "Report any wound deterioration (increased size, depth, new tunneling or undermining, change in exudate, new odor) to the registered nurse or physician immediately"
    ],
    assessmentFindings: [
      "Healing wound: progressive decrease in length, width, and depth over serial measurements; wound bed predominantly red granulation tissue; wound edges migrating inward; decreasing exudate volume",
      "Stalled wound: no measurable change in wound dimensions over 2-4 weeks despite appropriate care; wound bed may show mixture of granulation and slough; exudate amount stable",
      "Deteriorating wound: increasing wound dimensions; new undermining or tunneling; wound bed tissue changing from red to yellow or black; increasing or changing exudate; new or worsening odor",
      "Undermining: tissue destruction under intact wound margins; detected by gently probing under wound edges; documented by location (clock positions) and extent (centimeters from wound edge)",
      "Tunneling: narrow channel extending from wound bed into surrounding tissue; detected by gentle probing with cotton-tipped applicator; documented by clock position and depth in centimeters",
      "Periwound changes: maceration (white, soggy skin from moisture), erythema (redness suggesting inflammation or pressure), induration (firmness suggesting cellulitis), callus formation (hyperkeratotic edges)"
    ],
    signs: {
      left: [
        "Wound dimensions decreasing on serial measurements (healing progression)",
        "Wound bed predominantly red granulation tissue (healthy healing)",
        "Wound edges migrating inward with epithelial tissue advancing (epithelialization)",
        "Serous or serosanguineous exudate in decreasing amounts",
        "Periwound skin intact with normal color and temperature",
        "Stable or improving wound assessment tool scores"
      ],
      right: [
        "Wound dimensions increasing on serial measurements (wound deterioration)",
        "New undermining or tunneling not previously present (tissue destruction extending)",
        "Wound bed predominantly yellow slough or black eschar (devitalized tissue)",
        "Purulent or foul-smelling exudate (indicates infection)",
        "Periwound cellulitis with spreading erythema, warmth, and induration",
        "Wound edges rolled (epibole) or undermined (unable to epithelialize)"
      ]
    },
    medications: [
      {
        name: "Normal Saline 0.9% (Wound Irrigation)",
        type: "Isotonic wound cleansing solution",
        action: "Provides a physiologically compatible irrigation solution with osmolarity similar to body fluids (308 mOsm/L), allowing effective wound cleansing without damaging viable wound tissue, granulation tissue, or migrating epithelial cells; removes loose debris, surface bacteria, and residual dressing material from the wound bed without cytotoxic effects",
        sideEffects: "Generally well tolerated with no cytotoxic effects; may cause transient cooling of wound bed if not warmed to body temperature (cold irrigation can slow cellular activity and delay healing); no systemic side effects with topical wound irrigation use",
        contra: "No absolute contraindications for wound irrigation; however, high-pressure irrigation (above 15 psi) should be avoided in wounds with exposed blood vessels, tendons, or bone to prevent tissue trauma; do not use in wounds communicating with body cavities unless specifically ordered",
        pearl: "Optimal irrigation pressure is 4-15 psi (a 35 mL syringe with a 19-gauge angiocatheter delivers approximately 8 psi); warm to body temperature before use to prevent wound bed cooling; preferred over cytotoxic agents (hydrogen peroxide, povidone-iodine) for routine wound cleansing"
      },
      {
        name: "Silver Alginate Dressing",
        type: "Antimicrobial wound dressing (silver-impregnated calcium alginate)",
        action: "Calcium alginate fibers derived from seaweed form a soft gel when they absorb wound exudate through ion exchange (calcium ions in the dressing exchange with sodium ions in the wound fluid); this gel maintains a moist wound healing environment while conforming to wound contours including undermining and tunneling; the ionic silver released from the dressing disrupts bacterial cell membranes and inhibits DNA replication, providing sustained broad-spectrum antimicrobial activity for up to 7 days",
        sideEffects: "Transient stinging on application; rare silver sensitivity reaction (local erythema, pruritus); argyria (permanent grey skin discoloration) is extremely rare with modern silver dressings but possible with prolonged large-area use; dressing may adhere if wound bed becomes too dry",
        contra: "Known silver allergy or sensitivity; use with caution during MRI (silver is conductive -- remove before imaging); dry or minimally exudative wounds (requires moisture to gel and release silver); do not use with topical enzymatic debriding agents (silver inactivates the enzyme)",
        pearl: "Ideal for moderately to heavily exudative wounds with infection risk; can be packed into tunnels and undermined areas to provide antimicrobial action in difficult-to-reach spaces; requires a secondary dressing; change every 1-7 days depending on exudate level and product specifications"
      },
      {
        name: "Hydrogel (Intrasite Gel/DuoDERM Hydroactive Gel)",
        type: "Moisture-donating wound dressing",
        action: "Composed of water-based polymer gel (70-90% water content) that donates moisture to dry wound beds, rehydrating necrotic tissue and eschar to facilitate autolytic debridement; the moist environment promotes epithelial cell migration and granulation tissue formation; also provides a cooling effect that can reduce wound pain; does not adhere to the wound bed, allowing atraumatic dressing removal",
        sideEffects: "Periwound maceration if applied too liberally or if wound is already exudative (excess moisture softens and damages intact periwound skin); may promote bacterial growth in infected wounds if used without concurrent antimicrobial therapy",
        contra: "Moderate to heavily exudative wounds (will cause maceration); infected wounds without concurrent antimicrobial treatment; wounds with active heavy bleeding (gel may be displaced); third-degree burns with eschar requiring surgical debridement",
        pearl: "Apply a thin layer directly to dry wound bed or to wounds with slough or eschar to promote autolytic debridement; protect periwound skin with barrier film or zinc oxide before application; requires a secondary cover dressing; change every 1-3 days; amorphous gel can be applied to shallow and irregular wound surfaces"
      }
    ],
    pearls: [
      "The clock method uses the patient's head as 12 o'clock and feet as 6 o'clock -- ALWAYS use this orientation regardless of wound location to ensure consistency between clinicians",
      "Length is measured from 12 o'clock to 6 o'clock (head to toe) and width from 3 o'clock to 9 o'clock (side to side) -- measure the greatest distance in each axis using centimeters",
      "Undermining runs PARALLEL to the skin surface under wound edges (like a shelf or cave); tunneling extends in a SPECIFIC DIRECTION away from the wound bed (like a channel or tube) -- both are measured using clock positions and centimeters",
      "A wound that does not show a 20-40% reduction in surface area within 2 weeks of appropriate treatment should be reassessed -- this is a validated indicator that the current treatment plan may need modification",
      "Wound bed tissue colors: RED (granulation = healthy), YELLOW (slough = devitalized), BLACK (eschar = necrotic), PINK (epithelial = new skin) -- document percentage of each at every assessment",
      "The MEASURE framework ensures comprehensive wound documentation: Measure (L x W x D), Exudate (type, amount), Appearance (wound bed), Suffering (pain), Undermining/tunneling, Re-evaluate (compare to previous), Edge (periwound skin)",
      "Consistent measurement technique is as important as the measurements themselves -- use the same positioning, landmarks, and tools at each assessment to generate reliable trending data"
    ],
    quiz: [
      {
        question: "A practical nurse is measuring a wound using the clock method. The patient is lying supine in bed. Where should 12 o'clock be positioned for wound measurement?",
        options: [
          "At the right side of the wound",
          "At the left side of the wound",
          "Toward the patient's head",
          "Toward the patient's feet"
        ],
        correct: 2,
        rationale: "In the clock method for wound measurement, 12 o'clock is always positioned toward the patient's head and 6 o'clock toward the feet, regardless of the wound's anatomical location or the patient's position. Length is measured from 12 to 6 o'clock and width from 3 to 9 o'clock."
      },
      {
        question: "A practical nurse discovers tissue destruction under intact skin along the wound edges that extends 2.0 cm from the wound margin between the 7 o'clock and 11 o'clock positions. This finding is documented as which wound characteristic?",
        options: [
          "Tunneling",
          "Undermining",
          "Wound depth",
          "Sinus tract"
        ],
        correct: 1,
        rationale: "Undermining is tissue destruction that occurs under intact wound margins, creating a pocket or shelf under the skin. It runs parallel to the skin surface along the wound edge. Undermining is documented using the clock method (location) and centimeters (extent from wound edge). Tunneling, in contrast, extends in a specific direction away from the wound bed like a narrow channel."
      },
      {
        question: "A practical nurse has been tracking wound measurements weekly. At week 1, the wound measured 4.0 cm x 3.0 cm (surface area 12 cm squared). At week 2, the wound measures 3.5 cm x 2.5 cm (surface area 8.75 cm squared). What does this represent?",
        options: [
          "Wound deterioration requiring immediate intervention",
          "Expected healing trajectory with approximately 27% surface area reduction",
          "Stalled wound requiring treatment plan reassessment",
          "Measurement error requiring remeasurement"
        ],
        correct: 1,
        rationale: "The wound surface area decreased from 12.0 to 8.75 cm squared, a reduction of approximately 27%. This falls within the expected healing trajectory of 20-40% surface area reduction within 2 weeks. A wound that does not achieve at least 20% reduction in 2 weeks should trigger reassessment of the treatment plan."
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
