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
  "short-bowel-syndrome-rpn": {
    title: "Short Bowel Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Short Bowel Syndrome",
      content: "Short bowel syndrome (SBS) occurs when the functional length of the small intestine is insufficient to maintain adequate nutrient and fluid absorption. The condition most commonly results from massive surgical resection of the small bowel, although congenital short bowel and functional motility disorders can produce a similar clinical picture. The small intestine in adults normally measures approximately 600 to 800 centimeters (roughly 20 feet), and SBS typically develops when less than 200 centimeters of functional small bowel remains. The jejunum is the primary site for carbohydrate, protein, fat, water-soluble vitamin, and mineral absorption. The ileum is uniquely responsible for bile salt reabsorption and vitamin B12 absorption via intrinsic factor-mediated endocytosis in the terminal ileum. Loss of the ileum is generally more debilitating than loss of the jejunum because the jejunum cannot assume ileal-specific functions, whereas the ileum can adapt to absorb nutrients normally handled by the jejunum. The ileocecal valve plays a critical role in slowing intestinal transit and preventing bacterial reflux from the colon into the small intestine; resection of this valve significantly worsens malabsorption. Following massive resection, the remaining bowel undergoes a process called intestinal adaptation over 1 to 2 years. During adaptation, the villi undergo hypertrophy (increasing in height and surface area), crypt depth increases, and the bowel diameter enlarges, all of which enhance absorptive capacity. Intestinal adaptation is stimulated by enteral nutrition (luminal nutrients), pancreaticobiliary secretions, and trophic hormones such as glucagon-like peptide 2 (GLP-2). The colon becomes an important absorptive organ in SBS, capable of absorbing water, electrolytes, and short-chain fatty acids produced by bacterial fermentation of unabsorbed carbohydrates. Patients with an intact colon in continuity with the remaining small bowel have significantly better outcomes than those with an end-jejunostomy. The pathophysiology of SBS produces several cascading problems: malabsorption of macronutrients (leading to weight loss and malnutrition), fluid and electrolyte losses (leading to dehydration and electrolyte imbalances), fat malabsorption (leading to steatorrhea and fat-soluble vitamin deficiency of vitamins A, D, E, and K), bile salt malabsorption (leading to cholerheic diarrhea and gallstone formation), gastric acid hypersecretion (which occurs in the early postoperative period and further impairs digestion), and D-lactic acidosis (from bacterial fermentation of unabsorbed carbohydrates in patients with intact colon). Many patients with SBS require long-term or permanent parenteral nutrition (PN) to survive, making them dependent on central venous access and susceptible to catheter-related bloodstream infections, hepatobiliary complications, and metabolic bone disease. The practical nurse plays a vital role in monitoring nutritional status, fluid balance, central line care, and recognizing complications of both the disease and its treatment."
    },
    riskFactors: [
      "Massive small bowel resection (Crohn disease flares requiring repeated surgeries, mesenteric ischemia, volvulus, trauma)",
      "Loss of the ileocecal valve (accelerates transit time and allows bacterial overgrowth)",
      "Crohn disease (most common cause of SBS in adults due to repeated resections)",
      "Necrotizing enterocolitis in neonates (most common cause of SBS in pediatric population)",
      "Mesenteric vascular events (arterial thrombosis, venous thrombosis, strangulated hernia causing bowel necrosis)",
      "Radiation enteritis (chronic radiation damage to small bowel reducing functional absorptive surface)",
      "Absence of colon in continuity (end-jejunostomy patients have worse fluid/electrolyte losses than those with intact colon)"
    ],
    diagnostics: [
      "Operative report review: determines length and location of remaining bowel, presence of ileocecal valve and colon; this is the most critical document for predicting SBS severity",
      "Serum electrolytes (sodium, potassium, magnesium, calcium, phosphorus): frequently deranged due to intestinal losses; monitor at least twice weekly during acute phase",
      "Serum albumin and prealbumin: albumin reflects chronic nutritional status (half-life 18-21 days); prealbumin reflects acute changes (half-life 2-3 days) and is more useful for monitoring response to nutrition support",
      "Complete blood count: microcytic anemia (iron deficiency from duodenal/jejunal loss) or macrocytic anemia (B12 deficiency from ileal loss or folate deficiency)",
      "Vitamin levels (B12, folate, A, D, E, K, zinc, copper, selenium): assess for specific deficiencies based on location of resection; B12 deficiency develops within 2-5 years of terminal ileum resection",
      "24-hour urine output and urine sodium: urine sodium less than 20 mEq/L indicates salt and water depletion even when urine volume appears adequate",
      "D-xylose absorption test: assesses absorptive capacity of remaining small bowel; low urinary excretion indicates malabsorption"
    ],
    management: [
      "Parenteral nutrition (PN) initiation: provides complete macronutrient and micronutrient support via central venous catheter when enteral absorption is insufficient; composition individualized based on losses and labs",
      "Gradual enteral feeding advancement: begin oral or enteral feeds as soon as possible to stimulate intestinal adaptation; start with small frequent meals, isotonic formulas, and advance slowly",
      "Fluid and electrolyte replacement: oral rehydration solutions (ORS) with sodium concentration of 90-120 mEq/L are more effective than hypotonic fluids (water, juice, tea) which worsen sodium losses",
      "Anti-diarrheal therapy: loperamide and codeine slow intestinal transit; administered 30-60 minutes before meals for maximum benefit",
      "Proton pump inhibitor therapy: controls gastric acid hypersecretion that occurs in the first 6-12 months post-resection and impairs pancreatic enzyme function",
      "Bile salt-binding therapy: cholestyramine for cholerheic diarrhea in patients with limited ileal resection (less than 100 cm); contraindicated with extensive ileal resection where bile salt depletion predominates",
      "Monitor for and manage central line complications: catheter-related bloodstream infection (CRBSI), central line-associated thrombosis, and intestinal failure-associated liver disease (IFALD)"
    ],
    nursingActions: [
      "Perform daily weight measurement at the same time, with the same scale, in similar clothing to accurately track fluid and nutritional status",
      "Monitor strict intake and output including all oral intake, IV fluids, parenteral nutrition, stomal output or stool output, and urine; report output exceeding intake or high ostomy output (greater than 1.5 L/day)",
      "Perform central venous catheter care using strict aseptic technique per facility protocol; inspect exit site every shift for redness, swelling, drainage, or tenderness",
      "Administer parenteral nutrition via infusion pump at the prescribed rate; verify solution against the order before hanging; monitor blood glucose every 6 hours during PN infusion",
      "Assess for signs of dehydration: dry mucous membranes, poor skin turgor, tachycardia, orthostatic hypotension, concentrated urine, and decreased urine output",
      "Administer prescribed medications at appropriate times relative to meals (loperamide 30-60 minutes before meals, PPIs before breakfast)",
      "Provide meticulous peristomal skin care for patients with ostomy; assess for skin breakdown from high-output alkaline effluent which is caustic to skin"
    ],
    assessmentFindings: [
      "High-volume watery diarrhea or high ostomy output (greater than 1.5-2 L/day): indicates significant malabsorption and fluid losses requiring aggressive replacement",
      "Steatorrhea (pale, bulky, foul-smelling, greasy stools that float): indicates fat malabsorption from bile salt deficiency or reduced absorptive surface",
      "Progressive weight loss despite adequate oral intake: hallmark of SBS indicating insufficient absorptive capacity for caloric needs",
      "Signs of specific nutrient deficiencies: angular cheilitis and glossitis (B-vitamin deficiency), night blindness (vitamin A), bone pain and fractures (vitamin D and calcium), easy bruising and prolonged bleeding (vitamin K), peripheral neuropathy (B12 and E deficiency)",
      "Dehydration signs: decreased skin turgor, sunken eyes, dry mucous membranes, tachycardia, hypotension, dark concentrated urine, elevated BUN-to-creatinine ratio",
      "Metabolic acidosis symptoms (confusion, Kussmaul respirations): may indicate D-lactic acidosis from bacterial fermentation in patients with intact colon",
      "Central line infection signs: fever, chills, rigors, erythema or purulent drainage at catheter exit site, elevated WBC count"
    ],
    signs: {
      left: [
        "Increased stool frequency or ostomy output above baseline",
        "Mild weight fluctuations (1-2 kg)",
        "Fatigue and generalized weakness",
        "Mild abdominal cramping with meals",
        "Flatulence and borborygmi (rumbling bowel sounds)",
        "Dry lips and mild thirst"
      ],
      right: [
        "Ostomy output exceeding 2 liters per day (severe dehydration risk)",
        "Rapid weight loss exceeding 5% of body weight in one week",
        "Signs of severe dehydration (hypotension, tachycardia, oliguria)",
        "Fever with rigors in patient with central venous catheter (possible CRBSI)",
        "Metabolic acidosis (confusion, Kussmaul respirations, pH below 7.35)",
        "Seizures or tetany from severe electrolyte imbalances (hypocalcemia, hypomagnesemia)"
      ]
    },
    medications: [
      {
        name: "Loperamide (Imodium)",
        type: "Antidiarrheal (opioid receptor agonist -- peripheral only)",
        action: "Acts on mu-opioid receptors in the intestinal wall to slow peristalsis, increase intestinal transit time, and enhance water and electrolyte absorption from the intestinal lumen. Unlike other opioids, loperamide does not cross the blood-brain barrier at standard doses, so it reduces diarrhea without producing central nervous system effects or dependence.",
        sideEffects: "Constipation (dose-dependent), abdominal cramping, nausea, dizziness. At very high doses or with P-glycoprotein inhibitors, cardiac arrhythmias (QT prolongation, torsades de pointes) have been reported.",
        contra: "Acute dysentery (bloody diarrhea with fever), acute ulcerative colitis, Clostridioides difficile colitis, children under 2 years of age, abdominal distension or suspected ileus",
        pearl: "In SBS, administer 30-60 minutes before meals to maximize transit time during nutrient absorption. Doses in SBS patients are often much higher than standard OTC dosing (up to 16-24 mg/day under physician direction). Monitor for abdominal distension that could indicate ileus."
      },
      {
        name: "Octreotide (Sandostatin)",
        type: "Somatostatin analog",
        action: "Mimics the action of natural somatostatin by inhibiting the release of multiple gastrointestinal hormones (gastrin, secretin, vasoactive intestinal peptide, motilin). This reduces gastric acid secretion, pancreatic and biliary secretion volume, splanchnic blood flow, and intestinal motility. The net effect is decreased intestinal secretion and reduced stool/ostomy output.",
        sideEffects: "Gallstone formation (reduces gallbladder motility and bile flow), injection site pain, nausea, abdominal pain, hyperglycemia or hypoglycemia (alters insulin and glucagon secretion), steatorrhea (suppresses pancreatic lipase), vitamin B12 malabsorption",
        contra: "Hypersensitivity to octreotide; use with caution in diabetes mellitus (alters glucose regulation), gallbladder disease, renal impairment (dose adjustment required)",
        pearl: "Reserved for patients with very high ostomy output (greater than 2-3 L/day) that does not respond to loperamide alone. May impair intestinal adaptation because it reduces trophic hormone release; therefore, use is generally short-term. Monitor gallbladder with periodic ultrasound during prolonged use. Subcutaneous injection is rotated between sites."
      },
      {
        name: "Teduglutide (Gattex/Revestive)",
        type: "Glucagon-like peptide 2 (GLP-2) analog",
        action: "Teduglutide is a recombinant analog of human GLP-2 with an extended half-life. GLP-2 is a naturally occurring intestinotrophic hormone that promotes intestinal mucosal growth by stimulating crypt cell proliferation, increasing villus height, enhancing intestinal blood flow, and reducing gastric emptying and intestinal motility. This increases the absorptive surface area and functional capacity of the remaining small bowel.",
        sideEffects: "Abdominal pain, injection site reactions, nausea, headache, abdominal distension, upper respiratory tract infection. Theoretical risk of accelerating growth of intestinal neoplasms (colorectal polyps or cancer).",
        contra: "Active gastrointestinal malignancy; colonoscopy required within 6 months before starting therapy and every 5 years thereafter to screen for polyps. Not for use in patients with active Crohn disease flare or bowel obstruction.",
        pearl: "Teduglutide is the first disease-modifying therapy for SBS that can reduce or eliminate parenteral nutrition dependence by enhancing intestinal adaptation. Administer as a once-daily subcutaneous injection. Response is monitored by tracking reductions in parenteral nutrition volume requirements over 6-12 months. Rotate injection sites and store reconstituted solution refrigerated."
      }
    ],
    pearls: [
      "The location of bowel resection matters more than the length removed -- loss of the terminal ileum (B12 and bile salt absorption) and ileocecal valve is more devastating than equivalent jejunal loss because the ileum has unique absorptive functions the jejunum cannot replicate",
      "Patients with intact colon in continuity absorb significantly more fluid and electrolytes than those with end-jejunostomy -- the colon can absorb up to 5 liters of fluid daily through bacterial fermentation of unabsorbed carbohydrates into absorbable short-chain fatty acids",
      "Oral rehydration solutions (ORS) with high sodium content (90-120 mEq/L) are superior to plain water, juice, or tea for SBS patients -- hypotonic fluids actually WORSEN sodium and water losses by creating an osmotic gradient that pulls sodium into the gut lumen",
      "Parenteral nutrition-dependent patients require meticulous central line care because catheter-related bloodstream infection (CRBSI) is the most common life-threatening complication -- use maximal sterile barriers during insertion and strict hand hygiene before any line access",
      "Intestinal adaptation takes 1 to 2 years and is maximized by enteral feeding -- even small amounts of enteral nutrition stimulate villus hypertrophy, so oral feeding should begin as early as possible alongside parenteral support",
      "D-lactic acidosis is a unique complication of SBS in patients with intact colon -- bacteria ferment unabsorbed carbohydrates into D-lactate (not measured by standard lactate assays), causing encephalopathy, ataxia, and slurred speech that mimics intoxication",
      "Monitor urine sodium (not just urine output) to detect hidden salt depletion -- a patient may produce adequate urine volume while urine sodium falls below 20 mEq/L, indicating the kidneys are maximally conserving sodium and the patient is salt depleted"
    ],
    quiz: [
      {
        question: "A patient with short bowel syndrome and an end-jejunostomy has an ostomy output of 2.5 liters in 24 hours. The practical nurse should recognize that the priority intervention is:",
        options: [
          "Encouraging the patient to drink more water and fruit juice to replace losses",
          "Notifying the physician and anticipating orders for intravenous fluid replacement and oral rehydration solution with high sodium content",
          "Administering a tap water enema to stimulate absorption",
          "Restricting all oral intake until output decreases below 1 liter"
        ],
        correct: 1,
        rationale: "Ostomy output exceeding 1.5-2 L/day requires aggressive replacement. Hypotonic fluids (water, juice) worsen sodium losses by creating an osmotic gradient. The correct approach is IV fluid replacement and oral rehydration solutions with sodium concentration of 90-120 mEq/L. Tap water enemas are not appropriate, and restricting oral intake entirely would worsen dehydration and impair intestinal adaptation."
      },
      {
        question: "A practical nurse caring for a patient receiving parenteral nutrition through a central venous catheter notes sudden onset of fever (39.2 C), chills, and rigors. The exit site shows no redness. What is the most appropriate initial action?",
        options: [
          "Apply a warm compress to the catheter exit site and continue the infusion",
          "Increase the rate of parenteral nutrition to support the increased metabolic demands of fever",
          "Stop the parenteral nutrition infusion, notify the physician, and anticipate orders for blood cultures (peripheral and from the central line)",
          "Administer acetaminophen and reassess in 4 hours"
        ],
        correct: 2,
        rationale: "Fever with rigors in a patient with a central venous catheter must be treated as a presumed catheter-related bloodstream infection (CRBSI) until proven otherwise. The PN infusion should be stopped (it could be the contaminated source), the physician notified immediately, and blood cultures obtained from both a peripheral site and through the central line before antibiotics are started. Delaying action or continuing the infusion could lead to sepsis."
      },
      {
        question: "Which finding in a patient with short bowel syndrome following ileal resection should the practical nurse report as indicating a specific nutrient deficiency requiring medical attention?",
        options: [
          "Mild flatulence after meals",
          "Numbness and tingling in the hands and feet with macrocytic anemia",
          "Preference for small frequent meals",
          "Occasional loose stools in the morning"
        ],
        correct: 1,
        rationale: "Numbness and tingling (peripheral neuropathy) combined with macrocytic anemia is the classic presentation of vitamin B12 deficiency. The terminal ileum is the exclusive absorption site for the B12-intrinsic factor complex. Following ileal resection, B12 deficiency develops within 2-5 years as hepatic stores are depleted. This requires lifelong intramuscular B12 replacement since oral supplementation cannot be absorbed. Flatulence, small meals, and occasional loose stools are expected adaptations in SBS."
      }
    ]
  },

  "skin-assessment-rpn": {
    title: "Comprehensive Skin Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy, Physiology, and Clinical Framework of Skin Assessment",
      content: "The integumentary system is the largest organ of the body, comprising approximately 16% of total body weight and covering an average surface area of 1.5 to 2 square meters in adults. The skin consists of three primary layers: the epidermis (outermost layer), the dermis (middle layer), and the hypodermis or subcutaneous tissue (deepest layer). The epidermis is an avascular, stratified squamous epithelium that provides the primary barrier against infection, fluid loss, and environmental injury. Keratinocytes make up approximately 90% of epidermal cells and produce keratin, which waterproofs the skin. Melanocytes produce melanin, which protects against ultraviolet radiation damage. The Fitzpatrick Skin Type classification system categorizes skin into six types (I through VI) based on the skin's response to ultraviolet exposure, ranging from Type I (very fair, always burns, never tans) to Type VI (deeply pigmented, never burns). This classification is clinically important because it influences assessment techniques -- in darker skin tones, color changes such as erythema, cyanosis, and jaundice are assessed differently. Erythema in darker skin appears as increased warmth and a deeper brown or purple hue rather than redness. Cyanosis is best assessed in the oral mucosa, conjunctivae, and nail beds rather than the skin surface. The dermis contains blood vessels, nerve endings, hair follicles, sweat glands, sebaceous glands, and collagen fibers that provide structural support and elasticity. With aging, dermal collagen decreases by approximately 1% per year, leading to thinning, wrinkling, and increased fragility. The Braden Scale is the most widely used validated tool for predicting pressure injury risk in clinical settings. It evaluates six subscales: sensory perception (ability to respond to pressure-related discomfort), moisture (degree of skin exposure to moisture), activity (degree of physical activity), mobility (ability to change and control body position), nutrition (usual food intake pattern), and friction and shear (amount of assistance required with movement). Total Braden scores range from 6 to 23, with lower scores indicating higher risk: 19-23 indicates no risk, 15-18 indicates mild risk, 13-14 indicates moderate risk, 10-12 indicates high risk, and 9 or below indicates very high risk. The ABCDE criteria for melanoma screening guide assessment of suspicious skin lesions: Asymmetry (one half does not match the other), Border irregularity (edges are ragged, notched, or blurred), Color variation (multiple shades of brown, black, red, white, or blue), Diameter greater than 6 mm (larger than a pencil eraser), and Evolving (any change in size, shape, color, elevation, or new symptoms such as bleeding or itching). Wound documentation requires systematic measurement and description. Length is measured as the longest measurement in the head-to-toe direction, width as the widest measurement perpendicular to length, and depth as the deepest measurement using a sterile cotton-tipped applicator. Undermining is tissue destruction under intact wound edges measured using a clock-face orientation with 12 o'clock toward the patient's head. Accurate, consistent documentation of wound characteristics enables the healthcare team to track healing progress and modify treatment plans appropriately."
    },
    riskFactors: [
      "Advanced age (decreased collagen production, skin thinning, reduced elasticity, impaired immune response, decreased sebaceous gland activity)",
      "Immobility or limited mobility (sustained pressure on bony prominences reduces capillary perfusion, leading to tissue ischemia and pressure injury)",
      "Malnutrition and dehydration (inadequate protein, vitamin C, and zinc impair collagen synthesis and wound healing; albumin below 3.5 g/dL increases skin breakdown risk)",
      "Incontinence (chronic moisture exposure from urine or feces macerates skin, disrupts acid mantle, and increases friction; fecal incontinence is more damaging than urinary due to digestive enzymes)",
      "Diabetes mellitus (peripheral neuropathy reduces sensation, peripheral vascular disease impairs blood flow, hyperglycemia impairs immune function and wound healing)",
      "Chronic steroid use (thins the epidermis and dermis, impairs collagen synthesis, increases skin fragility and bruising)",
      "Peripheral vascular disease (arterial insufficiency reduces oxygen delivery, venous insufficiency causes edema and hemosiderin staining)"
    ],
    diagnostics: [
      "Braden Scale assessment: perform on admission and reassess per facility protocol (typically every shift in acute care, weekly in long-term care); document total score and individual subscale scores to identify specific risk areas",
      "Wound measurement and documentation: measure length, width, and depth in centimeters using consistent technique; photograph wounds per facility protocol with a measuring ruler in frame for objective comparison",
      "Wound culture (if infection suspected): cleanse wound with normal saline before obtaining specimen; use Levine technique (rotate swab over 1 cm squared area with sufficient pressure to express fluid from wound tissue) rather than swabbing surface exudate",
      "Serum albumin and prealbumin: albumin below 3.5 g/dL indicates malnutrition and impaired healing capacity; prealbumin below 15 mg/dL indicates acute protein depletion affecting wound repair",
      "Hemoglobin A1C (diabetic patients): values above 7% indicate poor glycemic control that impairs wound healing and increases infection risk",
      "Ankle-brachial index (ABI): ratio of ankle systolic pressure to brachial systolic pressure; normal is 1.0-1.3; values below 0.9 indicate peripheral arterial disease; below 0.5 indicates severe ischemia; compression therapy is contraindicated if ABI is below 0.8"
    ],
    management: [
      "Implement pressure redistribution strategies: reposition immobile patients at least every 2 hours in bed and every 1 hour in chair; use pressure-redistributing mattresses and cushions; keep head of bed elevation at 30 degrees or less when clinically possible to minimize shear",
      "Maintain skin hygiene and moisture management: use gentle pH-balanced cleansers (avoid soap), pat skin dry rather than rubbing, apply barrier creams to areas exposed to moisture (perineal area, skin folds), and use absorbent incontinence products",
      "Optimize nutrition for skin integrity and wound healing: ensure adequate protein intake (1.25-1.5 g/kg/day for patients with wounds), vitamin C (250-500 mg twice daily), zinc (40 mg daily), and adequate hydration",
      "Manage existing wounds according to wound bed preparation principles: remove nonviable tissue (debridement as ordered), manage bacterial burden (antimicrobial dressings), maintain moisture balance (moist wound healing), and protect wound edges (skin protectants)",
      "Apply appropriate wound dressings based on wound characteristics: hydrocolloids for shallow wounds with minimal exudate, foam dressings for moderate exudate, alginate or hydrofiber dressings for heavy exudate, hydrogels for dry wound beds requiring moisture donation",
      "Ensure proper offloading of pressure injuries: use heel suspension devices for heel ulcers, appropriate wheelchair cushions for sacral/ischial pressure injuries, and avoid positioning directly on existing pressure injuries or bony prominences"
    ],
    nursingActions: [
      "Perform systematic head-to-toe skin assessment on admission and every shift; inspect all skin surfaces including posterior body, skin folds, between toes, behind ears, and under medical devices (oxygen tubing, splints, stockings)",
      "Complete Braden Scale scoring on admission and at regular intervals per facility policy; communicate scores to the care team and implement appropriate prevention interventions based on risk level",
      "Document wound characteristics using standardized terminology: location, size (L x W x D in cm), wound bed description (percentage of granulation tissue, slough, eschar), exudate (type, color, amount, odor), periwound skin condition, and pain level",
      "Use body map diagrams to document location and distribution of skin findings; mark all lesions, wounds, bruises, and skin abnormalities on the body map for visual communication across shifts",
      "Assess all skin lesions using the ABCDE criteria for melanoma screening; report any suspicious lesions meeting one or more criteria to the physician or nurse practitioner for dermatologic evaluation",
      "Monitor skin under and around medical devices (pulse oximeter probes, blood pressure cuffs, oxygen masks, urinary catheters, compression stockings) every shift; reposition devices regularly to prevent device-related pressure injuries",
      "Educate patients and caregivers on skin self-inspection techniques, importance of repositioning, proper nutrition for skin health, signs of skin breakdown to report, and sun protection measures"
    ],
    assessmentFindings: [
      "Pressure injury staging: Stage 1 (intact skin with non-blanchable erythema), Stage 2 (partial-thickness skin loss with exposed dermis, may present as intact or ruptured blister), Stage 3 (full-thickness skin loss with visible subcutaneous fat, bone/tendon not visible), Stage 4 (full-thickness tissue loss with exposed bone, tendon, or muscle), Unstageable (full-thickness tissue loss obscured by slough or eschar), Deep tissue pressure injury (intact skin with localized area of persistent non-blanchable deep red, maroon, or purple discoloration)",
      "Wound infection signs: erythema extending beyond wound edges (cellulitis), increased warmth, increased pain or tenderness, purulent drainage, foul odor, elevated WBC count, fever; in chronic wounds, subtle signs include failure to progress, friable granulation tissue, and increased exudate",
      "Moisture-associated skin damage (MASD): irritant contact dermatitis from incontinence (redness, erosion in perineal area), intertriginous dermatitis (skin fold inflammation), and periwound moisture damage (maceration appearing as white, waterlogged tissue around wound edges)",
      "Arterial insufficiency skin changes: thin shiny skin, hair loss on lower extremities, thickened toenails, pallor on elevation (elevation pallor), dependent rubor (reddish-purple discoloration when legs are dependent), and cool skin temperature",
      "Venous insufficiency skin changes: hemosiderin staining (brown discoloration of lower legs), stasis dermatitis (eczematous changes), lipodermatosclerosis (hardening and browning of skin above ankles), and edema; venous ulcers typically located at medial malleolus with irregular borders and shallow bed",
      "Normal skin findings in dark skin tones: assess for color changes using mucous membranes, conjunctivae, palms, and soles; erythema presents as deeper warmth and purple/brown hue rather than redness; petechiae and ecchymosis may appear darker than in lighter skin"
    ],
    signs: {
      left: [
        "Mild dryness or flaking of skin (xerosis)",
        "Stage 1 pressure injury (non-blanchable erythema, intact skin)",
        "Minor skin fold redness (intertriginous dermatitis)",
        "Small stable skin tear with approximated edges",
        "Mild edema in dependent areas",
        "Sun-damaged skin with actinic keratosis (rough, scaly patches)"
      ],
      right: [
        "Stage 3 or Stage 4 pressure injury with exposed tissue (full-thickness loss)",
        "Rapidly expanding wound erythema with fever (cellulitis or sepsis risk)",
        "New skin lesion meeting multiple ABCDE melanoma criteria (asymmetry, border irregularity, color variation, diameter greater than 6 mm, evolving)",
        "Signs of necrotizing fasciitis (severe pain disproportionate to appearance, crepitus, rapid spread of erythema, systemic toxicity)",
        "Large full-thickness skin avulsion with exposed underlying structures",
        "Uncontrolled hemorrhage from skin wound or existing ulcer"
      ]
    },
    medications: [
      {
        name: "Silver Sulfadiazine (Flamazine/Silvadene)",
        type: "Topical antimicrobial (sulfonamide with silver)",
        action: "Silver ions bind to bacterial DNA, disrupting replication and cellular metabolism. The sulfonamide component inhibits folic acid synthesis in susceptible organisms. Together, they provide broad-spectrum antimicrobial coverage against gram-positive and gram-negative bacteria, as well as Candida species. Applied topically to wound beds to prevent and treat wound infection.",
        sideEffects: "Transient leukopenia (monitor CBC -- typically resolves without discontinuation), local burning or stinging on application, skin discoloration (grey-brown), rare allergic reaction, and potential for silver absorption with prolonged use on large surface areas",
        contra: "Sulfonamide allergy (cross-reactivity), pregnancy at or near term (risk of kernicterus in the neonate), infants under 2 months of age, glucose-6-phosphate dehydrogenase (G6PD) deficiency (risk of hemolytic anemia)",
        pearl: "Apply a thin layer (1-2 mm) with a sterile gloved hand or tongue depressor; remove old cream and wound debris before reapplication. Check CBC weekly during prolonged use to monitor for leukopenia. Not typically used for facial burns due to silver staining. Requires a physician order for application."
      },
      {
        name: "Zinc Oxide Barrier Cream",
        type: "Skin protectant and moisture barrier",
        action: "Creates a physical barrier on the skin surface that repels moisture (urine, feces, wound exudate) and prevents direct contact between irritants and the epidermis. Zinc oxide also has mild astringent and antiseptic properties that promote skin healing. It reduces transepidermal water loss and maintains the skin's acid mantle.",
        sideEffects: "Rarely causes adverse effects when used topically; occasional contact sensitivity in susceptible individuals; may be difficult to remove if applied too thickly (use mineral oil-based cleanser rather than rubbing)",
        contra: "Known hypersensitivity to zinc oxide; avoid application to infected wounds (traps bacteria under the barrier); do not apply over topical medications unless directed (may block absorption)",
        pearl: "Apply to clean, dry skin in perineal area for incontinence-associated dermatitis prevention. Do not completely remove between diaper changes -- cleanse soiled areas and reapply to thin spots. Use alongside structured incontinence management (timed voiding, absorbent products) for best outcomes. Document skin condition under the barrier cream each shift."
      },
      {
        name: "Mupirocin (Bactroban)",
        type: "Topical antibiotic (monoxycarbolic acid derivative)",
        action: "Inhibits bacterial protein synthesis by binding to bacterial isoleucyl-tRNA synthetase, preventing incorporation of isoleucine into bacterial proteins. This mechanism is unique among antibiotics, giving mupirocin activity against organisms that may be resistant to other antibiotics. It is primarily effective against gram-positive organisms including methicillin-resistant Staphylococcus aureus (MRSA) and Streptococcus pyogenes.",
        sideEffects: "Local burning or stinging at application site, pruritus, rash, dry skin, nausea (if applied intranasally and swallowed). Prolonged use beyond 10 days increases risk of bacterial resistance.",
        contra: "Known hypersensitivity; do not use on large open wounds or burns (polyethylene glycol base may be absorbed and cause renal toxicity); avoid concurrent use with other topical products at the same site",
        pearl: "Apply a thin layer to the affected area three times daily for 5-10 days as prescribed. Used for impetigo, small infected wounds, and MRSA nasal decolonization (intranasal formulation). Do not use longer than 10 days to prevent resistance development. Report wounds that do not improve within 3-5 days of treatment."
      }
    ],
    pearls: [
      "The Braden Scale total score determines risk level, but the individual subscale scores identify WHICH specific interventions are needed -- a patient scoring low on moisture needs aggressive moisture management, while one scoring low on nutrition needs dietary optimization and possible supplementation",
      "In patients with dark skin tones, do NOT rely on visual redness to identify Stage 1 pressure injuries -- instead palpate for localized warmth, firmness (induration), or bogginess compared to adjacent tissue, and assess for pain or tenderness at the site",
      "Wound measurement must follow a consistent technique every time: length is always the longest measurement in the head-to-toe direction, width is perpendicular to length -- switching measurement orientation between assessments creates false data suggesting the wound is growing or shrinking",
      "The gold standard for wound culture is the Levine technique (rotate swab over 1 cm squared of clean wound bed with enough pressure to express tissue fluid), NOT swabbing surface exudate or pus -- surface swabs grow contaminants rather than true wound pathogens",
      "Pressure injury prevention requires repositioning every 2 hours at minimum, but repositioning alone is insufficient -- you must also address nutrition (protein, vitamin C, zinc), moisture management, friction/shear reduction, and pressure redistribution surfaces",
      "Medical device-related pressure injuries are the second most common type in acute care settings -- check under every device (oxygen masks, tubing, pulse oximeter probes, cervical collars, splints) every shift and reposition or pad as needed",
      "Never stage pressure injuries in reverse -- a Stage 4 that heals does NOT become Stage 3 then Stage 2; instead, document as 'Stage 4 pressure injury, healing' because the tissue that fills the wound is scar tissue (not regenerated dermis and epidermis)"
    ],
    quiz: [
      {
        question: "A practical nurse completes a Braden Scale assessment on a newly admitted patient and obtains a total score of 12. How should the nurse interpret and act on this score?",
        options: [
          "The score indicates no risk; standard skin care is sufficient",
          "The score indicates high risk for pressure injury; implement pressure redistribution, repositioning every 2 hours, nutritional optimization, and moisture management immediately",
          "The score indicates the patient already has a pressure injury that needs wound care",
          "The score is invalid and needs to be repeated by a registered nurse"
        ],
        correct: 1,
        rationale: "A Braden Scale score of 10-12 indicates high risk for pressure injury development. The practical nurse should implement a comprehensive prevention plan including pressure redistribution surfaces, repositioning at minimum every 2 hours, nutritional assessment and optimization, moisture management, and friction/shear reduction. The Braden Scale predicts risk; it does not diagnose existing injuries. Practical nurses are trained to perform Braden Scale assessments."
      },
      {
        question: "A practical nurse is assessing a dark-skinned patient for pressure injuries over the sacrum. Which assessment technique is most appropriate?",
        options: [
          "Visually inspect for redness and document as Stage 1 if redness is observed",
          "Palpate the area for localized warmth, firmness, bogginess, or tenderness compared to surrounding tissue, and assess the patient for pain at the site",
          "Use a glass slide to apply pressure and check for blanching",
          "Apply a moisture barrier cream prophylactically without performing assessment"
        ],
        correct: 1,
        rationale: "In patients with dark skin tones, visual detection of redness (erythema) is unreliable for identifying Stage 1 pressure injuries. The most appropriate technique is palpation for localized warmth, induration (firmness), bogginess, or tenderness compared to adjacent and contralateral tissue. Additionally, asking the patient about pain or discomfort at the area is essential. The glass slide (diascopy) technique is used to differentiate erythema from purpura in lighter skin and is not the primary method for pressure injury detection in dark skin."
      },
      {
        question: "During a routine skin assessment, the practical nurse identifies a mole on a patient's back that has an irregular border, two different shades of brown, and measures 8 mm in diameter. What is the most appropriate action?",
        options: [
          "Document the finding and reassess at the next annual physical examination",
          "Apply sunscreen to the lesion and advise the patient to monitor it at home",
          "Document the lesion characteristics, report findings to the physician or nurse practitioner, and recommend dermatologic evaluation",
          "Remove the lesion using sterile scissors and send it for pathology"
        ],
        correct: 2,
        rationale: "This lesion meets three ABCDE melanoma criteria: Border irregularity, Color variation (two shades), and Diameter greater than 6 mm. Any lesion meeting one or more ABCDE criteria requires prompt physician or nurse practitioner notification and dermatologic evaluation for possible biopsy. The practical nurse should document the findings thoroughly (location, size, characteristics) and communicate urgently. Waiting for an annual exam could delay diagnosis of melanoma. Lesion removal is outside the practical nurse scope of practice."
      }
    ]
  },

  "skin-tears-rpn": {
    title: "Skin Tear Prevention and Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Skin Tears and Age-Related Skin Fragility",
      content: "Skin tears are traumatic wounds caused by mechanical forces including friction, shear, or blunt trauma that separate the epidermis from the dermis (partial-thickness) or separate both the epidermis and dermis from underlying structures (full-thickness). Unlike other acute wounds, skin tears occur in skin that is already compromised by intrinsic aging changes, chronic disease, or medication effects, making them one of the most common yet underreported wound types in older adults and chronically ill populations. The International Skin Tear Advisory Panel (ISTAP) defines a skin tear as a wound caused by shear, friction, or blunt force resulting in separation of skin layers. The ISTAP classification system categorizes skin tears into three types: Type 1 (no skin loss -- a linear or flap tear where the flap can be repositioned to cover the wound bed), Type 2 (partial flap loss -- the skin flap cannot be repositioned to fully cover the wound bed), and Type 3 (total flap loss -- the skin flap is completely absent, exposing the entire wound bed). The older Payne-Martin classification uses similar categories: Category I (linear tears without tissue loss), Category II (partial-thickness with partial tissue loss of the skin flap), and Category III (full flap loss with entire dermis exposed). Intrinsic aging causes several structural changes that predispose to skin tears. Epidermal turnover rate decreases from approximately 21 days in young adults to 30-40 days in those over 65 years. The dermal-epidermal junction flattens with age, reducing the surface area of attachment between these layers by approximately 50%. This flattening of the rete ridges means less mechanical interlocking between the epidermis and dermis, so even minimal friction or shear can cause separation. Dermal collagen decreases by approximately 1% per year after age 30, and elastin fibers undergo progressive degeneration, reducing skin elasticity and tensile strength. The dermis thins by approximately 20% between ages 20 and 80. Subcutaneous fat redistributes with aging, decreasing over the extremities and hands (areas most prone to skin tears) while increasing centrally. Sebaceous gland output decreases, leading to xerosis (dry skin) that increases friction and reduces skin suppleness. Sweat gland activity decreases, reducing skin moisture. These combined changes produce the characteristic paper-thin, fragile skin that tears easily with minimal mechanical stress. Medications that contribute to skin fragility include systemic corticosteroids (inhibit collagen synthesis and thin the dermis), anticoagulants (increase bruising and hematoma formation under skin flaps), and immunosuppressants. Topical corticosteroids applied long-term cause localized skin atrophy. The practical nurse must recognize that skin tears are largely preventable through environmental modification, careful patient handling techniques, and skin protection strategies, and that proper management of existing tears significantly impacts healing outcomes."
    },
    riskFactors: [
      "Age 75 years and older (progressive loss of dermal collagen, flattened rete ridges, decreased subcutaneous fat on extremities)",
      "History of previous skin tears (indicates established skin fragility; prior tear sites heal with scar tissue that is weaker than original skin)",
      "Chronic corticosteroid use (systemic or long-term topical steroids thin the dermis and inhibit collagen synthesis, creating paper-thin skin)",
      "Anticoagulant therapy (warfarin, heparin, DOACs increase risk of hematoma formation under skin flaps, expanding tear size)",
      "Cognitive impairment or agitation (patients with dementia may resist care, scratch, or bump into environmental hazards)",
      "Dependence on others for activities of daily living (mechanical forces from lifting, turning, transferring, and applying/removing adhesive products are common causes)",
      "Xerosis (dry skin) (lack of moisture increases friction coefficient between skin and environmental surfaces, predisposing to tear formation)"
    ],
    diagnostics: [
      "ISTAP classification: assess and classify skin tear as Type 1 (no skin loss, flap repositionable), Type 2 (partial flap loss), or Type 3 (total flap loss); classification determines management approach",
      "Wound bed assessment: evaluate wound bed color (pink/red granulation is healthy; yellow indicates slough; black indicates eschar; pale indicates ischemia), moisture level, and presence of hematoma under the skin flap",
      "Skin flap viability assessment: evaluate color, capillary refill, and thickness of the skin flap; a pale, dusky, or blue-grey flap suggests compromised blood supply and may not survive reapproximation",
      "Periwound skin assessment: evaluate surrounding skin for additional tears, ecchymosis, edema, xerosis, and fragility to determine overall skin vulnerability and guide prevention strategies",
      "Nutritional screening: assess albumin (below 3.5 g/dL impairs healing), prealbumin, BMI, and dietary intake; malnutrition is both a risk factor for tears and a barrier to healing",
      "Medication review: identify medications contributing to skin fragility (corticosteroids, anticoagulants, immunosuppressants) and document for the care team to consider modification if clinically appropriate"
    ],
    management: [
      "Control bleeding with gentle direct pressure using a non-adherent pad; avoid using hemostatic agents that may cause additional tissue trauma to fragile surrounding skin",
      "Cleanse the wound and skin flap gently with normal saline or prescribed wound cleanser using low-pressure irrigation; do not scrub the wound bed or skin flap as this causes additional damage",
      "Realign the skin flap if viable (Type 1 and some Type 2 tears): use a moistened cotton-tipped applicator or gloved finger to gently roll the flap back into anatomical position; do not force a flap that has contracted or dried",
      "Secure the skin flap using Steri-Strips or adhesive skin closures applied WITHOUT tension; place strips parallel to the wound edge to approximate without stretching the fragile skin; allow the flap edges to meet naturally",
      "Apply an appropriate secondary dressing: use a non-adherent contact layer (silicone-based dressings are preferred) covered by a light absorbent layer and secured with tubular bandage or self-adherent wrap -- NEVER use adhesive tape directly on fragile skin",
      "Remove dressings gently at each change: moisten adherent dressings with normal saline before removal; support surrounding skin with one hand while lifting the dressing with the other; peel dressings in the direction of hair growth",
      "Implement a comprehensive skin tear prevention program for at-risk patients: padded side rails, long sleeves and shin guards, emollient application twice daily, gentle handling techniques, and environmental hazard removal"
    ],
    nursingActions: [
      "Assess all skin tear risk factors on admission using a standardized risk assessment and implement individualized prevention interventions based on identified risks",
      "Apply emollients (fragrance-free, pH-balanced moisturizers) to all extremities at least twice daily, especially after bathing, to combat xerosis and reduce friction -- this is the single most effective preventive measure",
      "Use gentle handling techniques when providing care: avoid pulling or dragging during repositioning (use lift sheets), support extremities during transfers, and allow adequate time for patient movement to prevent rushing-related injuries",
      "Remove adhesive products carefully: use silicone-based adhesive removers when available, peel adhesive in the direction of hair growth while supporting the skin, and minimize adhesive product use on fragile skin (use tubular bandages, self-adherent wraps, or stockinette instead of tape)",
      "Pad potential environmental hazards: apply protective padding to wheelchair armrests, bed rails, and transfer surfaces; ensure adequate lighting to prevent bumps and collisions",
      "Document skin tears accurately using the ISTAP classification, wound dimensions, flap viability, wound bed characteristics, and surrounding skin condition; photograph with a ruler for objective tracking",
      "Educate patients, families, and caregiving staff on skin tear prevention strategies, proper handling techniques, the importance of moisturizer application, and when to seek medical attention for new skin tears"
    ],
    assessmentFindings: [
      "Type 1 skin tear (ISTAP): linear or flap tear where the epidermis and/or dermis are separated but the skin flap remains intact and can be repositioned to cover the wound bed; may present as a thin flap that rolls back easily",
      "Type 2 skin tear (ISTAP): partial flap loss where the skin flap cannot be repositioned to completely cover the wound bed; partial wound bed exposure visible with remaining flap covering a portion",
      "Type 3 skin tear (ISTAP): complete absence of the skin flap with the entire wound bed exposed; may result from the flap being avulsed at the time of injury or removed inadvertently during first aid",
      "Hematoma under skin flap: dark purple or black discoloration under an intact or partially intact flap indicating blood collection; large hematomas may compromise flap viability by elevating the flap away from its blood supply",
      "Infected skin tear: increasing pain, expanding erythema beyond wound margins (cellulitis), warmth, purulent drainage, foul odor, and delayed healing; fever and elevated WBC indicate systemic infection",
      "Evidence of skin fragility: paper-thin transparent skin (especially on dorsal forearms and hands), visible subcutaneous vasculature, senile purpura (large purple ecchymotic areas from minor trauma), and multiple healed skin tear scars"
    ],
    signs: {
      left: [
        "Small superficial skin tear with intact flap that reapproximates easily (Type 1)",
        "Mild ecchymosis around the tear site",
        "Xerosis (dry, flaky skin) on extremities",
        "Minor serous drainage from wound bed",
        "Mild discomfort at the tear site",
        "Slight skin flap edema that resolves within 24-48 hours"
      ],
      right: [
        "Large Type 3 skin tear with significant tissue loss and exposed deep structures",
        "Expanding erythema, warmth, and purulent drainage indicating infection (report immediately)",
        "Rapidly expanding hematoma under skin flap compromising tissue viability",
        "Uncontrolled bleeding from skin tear site (especially in patients on anticoagulants)",
        "Multiple new skin tears appearing simultaneously (investigate for potential abuse or neglect)",
        "Signs of systemic infection (fever, tachycardia, elevated WBC) originating from skin tear"
      ]
    },
    medications: [
      {
        name: "Petrolatum-Impregnated Gauze (Vaseline Gauze/Adaptic)",
        type: "Non-adherent wound contact layer",
        action: "Provides a moist wound healing environment by maintaining moisture at the wound-dressing interface while preventing the dressing material from adhering to the wound bed and newly forming epithelial tissue. The petrolatum coating acts as a physical barrier that allows wound exudate to pass through into the absorbent secondary dressing while protecting the fragile wound bed and skin flap from mechanical disruption during dressing changes.",
        sideEffects: "Potential for maceration of surrounding skin if excessive exudate accumulates (change dressing if periwound skin becomes white and waterlogged); rarely, contact sensitivity to petrolatum or the gauze material",
        contra: "Heavily draining wounds where petrolatum may trap excessive moisture (use a more absorbent non-adherent alternative); known sensitivity to petrolatum or paraffin-based products; wounds requiring antimicrobial coverage (petrolatum alone has no antimicrobial properties)",
        pearl: "Ideal first-line contact layer for skin tears because it minimizes adherence and trauma during dressing changes. Cut to fit the wound size plus a small margin to overlap wound edges. Change every 24-72 hours depending on exudate level. Always moisten with normal saline before removing if any adherence is noted."
      },
      {
        name: "Skin Protectant Spray/Wipe (Cavilon/No-Sting Barrier Film)",
        type: "Skin protectant (cyanoacrylate-based or acrylate terpolymer barrier)",
        action: "Forms a transparent, breathable protective film on the skin surface that shields against moisture (urine, feces, wound exudate), friction, and adhesive trauma. The barrier film does not interfere with wound healing or adhesion of secondary dressings. It reduces transepidermal water loss and protects the periwound skin from maceration and irritant contact dermatitis.",
        sideEffects: "Mild transient stinging on application to denuded skin (alcohol-free formulations minimize this); rare contact dermatitis in sensitive individuals; may alter adhesion of some dressing products",
        contra: "Do not apply directly into open wound beds (apply to surrounding intact skin only); known hypersensitivity to product ingredients; deep full-thickness wounds where product could be trapped in tissue",
        pearl: "Apply to periwound skin before applying any dressing or adhesive product to protect fragile skin from adhesive trauma. Also apply to skin under medical devices that cause friction. Allow the film to dry completely (30-60 seconds) before applying dressings. Reapply with each dressing change. Alcohol-free formulations (such as Cavilon No-Sting) are preferred for patients with very sensitive or denuded skin."
      },
      {
        name: "Calcium Alginate Dressing (Kaltostat/Algicell)",
        type: "Absorbent hemostatic wound dressing (derived from seaweed calcium-sodium alginate fibers)",
        action: "Calcium alginate fibers absorb wound exudate and exchange calcium ions for sodium ions from the wound fluid, forming a hydrophilic gel that maintains a moist wound healing environment. The calcium ion exchange also promotes hemostasis by activating the clotting cascade at the wound surface. The gel formation conforms to the wound bed shape, maintaining contact with irregular wound surfaces.",
        sideEffects: "May cause mild drying if used on minimally exudative wounds (leading to adherence and pain on removal); should not be packed tightly into wound cavities as it expands with absorption; rarely, foreign body sensation if fibers remain in wound",
        contra: "Dry wounds or wounds with minimal exudate (alginate requires moisture to form gel -- using on dry wounds causes adherence and tissue damage on removal); third-degree burns; surgical implantation sites; known sensitivity to alginate",
        pearl: "Excellent choice for Type 2 and Type 3 skin tears with moderate to heavy exudate or for skin tears that are bleeding because the calcium ion exchange promotes hemostasis. Place dry alginate directly on the moist wound bed and cover with a non-adherent secondary dressing. Change when the dressing is saturated (typically every 1-3 days). Irrigate with normal saline to loosen gel before removal to prevent trauma."
      }
    ],
    pearls: [
      "Twice-daily emollient application to extremities is the single most effective preventive measure for skin tears -- moisturized skin has a lower friction coefficient and greater resistance to mechanical forces than dry skin",
      "NEVER use adhesive tape directly on fragile or at-risk skin -- instead secure dressings with tubular bandage (Tubifast), self-adherent wrap (Coban), or stockinette; if adhesive products must be used, apply a barrier film (such as Cavilon) to the skin first",
      "When a skin flap is present, always attempt to realign it to its anatomical position using a moistened applicator -- even a non-viable flap serves as a biological dressing that protects the wound bed, reduces pain, and promotes healing better than a fully exposed wound",
      "Skin tears in older adults should be classified using the ISTAP system (Type 1, 2, or 3) rather than described generically as a laceration or abrasion -- correct classification guides treatment decisions and enables outcome tracking",
      "Multiple unexplained skin tears, especially in unusual locations (inner arms, trunk, face), should raise concern for elder abuse or neglect -- document findings objectively, photograph with patient consent, and report per facility policy and mandatory reporting requirements",
      "Remove dressings in the direction of hair growth while gently supporting the surrounding skin with your other hand -- pulling against hair growth increases the risk of creating a new skin tear adjacent to the original wound",
      "Corticosteroid-induced skin fragility is cumulative and may persist for months after discontinuation -- patients with a history of long-term steroid use remain at elevated risk even after the medication is stopped, and prevention measures should continue"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for an 84-year-old resident with a skin tear on the forearm. The skin flap is present and can be repositioned to cover the wound bed. Using the ISTAP classification, this skin tear is categorized as:",
        options: [
          "Type 1 -- no skin loss, flap can be repositioned to cover wound bed",
          "Type 2 -- partial flap loss, wound bed partially exposed",
          "Type 3 -- total flap loss, entire wound bed exposed",
          "Stage 2 pressure injury"
        ],
        correct: 0,
        rationale: "A skin tear where the skin flap is present and can be repositioned to cover the wound bed is classified as ISTAP Type 1 (no skin loss). Type 2 involves partial flap loss where the flap cannot fully cover the wound. Type 3 involves total absence of the skin flap. Skin tears are not staged like pressure injuries -- they use a separate classification system."
      },
      {
        question: "Which intervention is most effective for preventing skin tears in elderly residents with fragile skin?",
        options: [
          "Applying adhesive tape reinforcement to all extremities each morning",
          "Restricting physical activity to minimize movement-related injury risk",
          "Applying fragrance-free emollient moisturizer to extremities at least twice daily",
          "Wrapping all extremities in gauze bandages during waking hours"
        ],
        correct: 2,
        rationale: "Regular emollient application (at least twice daily) is the single most effective preventive measure for skin tears. Moisturized skin has reduced friction and improved pliability, making it more resistant to mechanical forces. Adhesive tape should be avoided on fragile skin. Activity restriction leads to deconditioning without addressing the root cause. Bandage wrapping is impractical and does not address skin dryness."
      },
      {
        question: "A practical nurse needs to secure a dressing over a skin tear on the forearm of a patient with paper-thin skin. Which method of securing the dressing is most appropriate?",
        options: [
          "Apply medical adhesive tape circumferentially around the forearm",
          "Use a tubular bandage (such as Tubifast) or self-adherent wrap to hold the dressing in place",
          "Apply a tight elastic bandage to ensure the dressing does not shift",
          "Use transparent film dressing adhesive directly on the fragile skin"
        ],
        correct: 1,
        rationale: "Tubular bandage or self-adherent wrap (such as Coban) secures dressings without adhering to the skin surface, preventing adhesive-related skin tears upon dressing removal. Adhesive tape applied directly to fragile skin commonly causes new skin tears when removed. Tight elastic bandages can compromise circulation. Transparent film adhesive on fragile skin will cause additional tears at the next dressing change."
      }
    ]
  },

  "sodium-imbalance-rpn": {
    title: "Sodium Imbalance: Hyponatremia and Hypernatremia for Practical Nurses",
    cellular: {
      title: "Physiology of Sodium Balance and Pathophysiology of Sodium Disorders",
      content: "Sodium is the most abundant cation in the extracellular fluid (ECF) and is the primary determinant of serum osmolality and extracellular fluid volume. The normal serum sodium concentration ranges from 135 to 145 mEq/L (mmol/L). Sodium balance is regulated primarily by antidiuretic hormone (ADH, also called vasopressin) and the renin-angiotensin-aldosterone system (RAAS). ADH is released from the posterior pituitary gland in response to increased serum osmolality (detected by hypothalamic osmoreceptors) or decreased blood volume (detected by baroreceptors). ADH acts on the collecting ducts of the kidney to increase water reabsorption, thereby diluting the serum sodium concentration. Aldosterone is released from the adrenal cortex in response to angiotensin II stimulation or hyperkalemia. Aldosterone acts on the distal nephron to increase sodium reabsorption and potassium excretion. The thirst mechanism also plays a critical role -- osmoreceptors in the hypothalamus stimulate thirst when serum osmolality rises above approximately 295 mOsm/kg, prompting water intake to dilute sodium concentration. Hyponatremia (serum sodium below 135 mEq/L) is the most common electrolyte disorder in hospitalized patients, occurring in up to 30% of hospitalized patients. It develops when there is a relative excess of water compared to sodium in the extracellular fluid. The most dangerous consequence of hyponatremia is cerebral edema. Because the blood-brain barrier is freely permeable to water, hypo-osmolar plasma causes water to shift into brain cells by osmosis, causing them to swell. The rigid skull cannot accommodate brain expansion, so cerebral edema leads to increased intracranial pressure, producing headache, confusion, seizures, and potentially brainstem herniation and death. Chronic hyponatremia (developing over 48 hours or more) is better tolerated because brain cells adapt by extruding intracellular solutes (a process called regulatory volume decrease). This adaptation, while protective against cerebral edema, creates a critical treatment consideration: if chronic hyponatremia is corrected too rapidly, the now-adapted brain cells shrink as water moves out, causing osmotic demyelination syndrome (ODS, formerly called central pontine myelinolysis). ODS produces devastating and often irreversible neurological damage including quadriplegia, pseudobulbar palsy, locked-in syndrome, and death. Therefore, the rate of sodium correction in chronic hyponatremia must not exceed 8-10 mEq/L in 24 hours. Hypernatremia (serum sodium above 145 mEq/L) occurs when there is a relative deficit of water compared to sodium. Hypernatremia always indicates hyperosmolality of the ECF. The hyperosmolar extracellular environment draws water out of cells by osmosis, causing cellular dehydration (crenation). In the brain, this cellular shrinkage can rupture bridging veins between the cortex and dural sinuses, causing subdural hemorrhage, subarachnoid hemorrhage, or intracranial bleeding. Symptoms of hypernatremia are primarily neurological and progress from lethargy and irritability to confusion, seizures, and coma. Hypernatremia most commonly occurs in patients who cannot access or respond to thirst: elderly patients with cognitive impairment, infants, intubated or sedated patients, and those with altered consciousness. In the clinical setting, the practical nurse must understand that sodium disorders are really water disorders -- hyponatremia usually reflects too much water relative to sodium, and hypernatremia usually reflects too little water relative to sodium. This understanding guides the treatment approach: hyponatremia is often managed by water restriction (not sodium administration), and hypernatremia is usually managed by water replacement (not sodium restriction)."
    },
    riskFactors: [
      "Age extremes: elderly patients (impaired thirst mechanism, reduced renal concentrating ability, multiple medications) and neonates (immature renal function, reliance on caregivers for fluid access)",
      "Diuretic therapy especially thiazide diuretics (hydrochlorothiazide is the most common medication cause of hyponatremia because it impairs urinary dilution without affecting concentrating ability)",
      "Heart failure and cirrhosis (dilutional hyponatremia from decreased effective arterial blood volume triggering excessive ADH release and water retention)",
      "Syndrome of inappropriate ADH secretion (SIADH): caused by CNS disorders, pulmonary disease, malignancies, and medications (SSRIs, carbamazepine, NSAIDs); produces euvolemic hyponatremia",
      "Diabetes insipidus (central or nephrogenic): causes hypernatremia from excessive free water loss in dilute urine due to ADH deficiency or renal resistance to ADH",
      "Altered mental status or intubation (inability to access water in response to thirst leads to hypernatremia from free water deficit)",
      "Excessive hypotonic fluid administration (iatrogenic hyponatremia from excessive D5W or free water infusion) or hypertonic fluid administration (iatrogenic hypernatremia from excessive 3% saline or sodium bicarbonate)"
    ],
    diagnostics: [
      "Serum sodium: the primary diagnostic value; hyponatremia (below 135 mEq/L) classified as mild (130-134), moderate (125-129), or severe (below 125); hypernatremia (above 145 mEq/L) classified as mild (146-150), moderate (151-159), or severe (above 160)",
      "Serum osmolality: normal 275-295 mOsm/kg; low osmolality with hyponatremia confirms hypotonic hyponatremia (the clinically significant type); high osmolality confirms hypernatremia; helps differentiate true hyponatremia from pseudohyponatremia (caused by elevated lipids or proteins)",
      "Urine sodium and urine osmolality: urine sodium above 20 mEq/L with hyponatremia suggests renal sodium wasting (SIADH, diuretics, renal disease); urine sodium below 20 mEq/L suggests extrarenal losses (GI losses, third-spacing); urine osmolality helps differentiate SIADH (inappropriately concentrated urine) from psychogenic polydipsia (maximally dilute urine)",
      "Volume status assessment: clinical assessment of fluid volume (skin turgor, mucous membranes, JVP, edema, orthostatic vital signs, daily weight) is essential because hyponatremia management differs based on whether the patient is hypovolemic, euvolemic, or hypervolemic",
      "Basic metabolic panel: BUN and creatinine for renal function; glucose (hyperglycemia causes pseudohyponatremia -- for every 100 mg/dL rise in glucose above normal, sodium drops approximately 1.6 mEq/L); potassium (often deranged concurrently with sodium disorders)",
      "Thyroid function tests and cortisol level: hypothyroidism and adrenal insufficiency (Addison disease) are treatable causes of hyponatremia that must be excluded before diagnosing SIADH"
    ],
    management: [
      "Hypovolemic hyponatremia: restore volume with isotonic (0.9%) normal saline; as volume is replaced, the stimulus for ADH release decreases and the kidneys excrete excess water, gradually normalizing sodium",
      "Euvolemic hyponatremia (SIADH): primary treatment is fluid restriction (typically 800-1200 mL/day); if fluid restriction fails, consider demeclocycline or vasopressin receptor antagonists (vaptans) as ordered",
      "Hypervolemic hyponatremia (heart failure, cirrhosis): fluid restriction (typically 1-1.5 L/day) combined with sodium restriction and loop diuretics (furosemide) to promote free water excretion",
      "Severe symptomatic hyponatremia (seizures, severe confusion, coma): administer 3% hypertonic saline via central line and infusion pump; target correction of 1-2 mEq/L per hour for the first 2-3 hours until symptoms improve; total correction must NOT exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome",
      "Hypernatremia management: calculate free water deficit and replace gradually with hypotonic fluids (D5W, 0.45% NaCl, or oral water); correct sodium by no more than 10-12 mEq/L per 24 hours to prevent cerebral edema; faster correction is acceptable for acute hypernatremia (developed within 24 hours)",
      "Monitor serum sodium levels every 2-4 hours during active correction of either hyponatremia or hypernatremia; adjust infusion rates based on serial sodium levels to prevent overcorrection",
      "Identify and treat underlying cause: discontinue offending medications (thiazides, SSRIs), treat SIADH, replace hormones in adrenal insufficiency or hypothyroidism, manage diabetes insipidus with desmopressin"
    ],
    nursingActions: [
      "Monitor neurological status every 1-2 hours during acute sodium correction: level of consciousness, orientation, pupil response, speech clarity, muscle strength, reflexes, and seizure activity",
      "Maintain strict intake and output measurement; for patients on fluid restriction, distribute the allowed volume across the entire 24-hour period and include all fluid sources (medications, flushes, ice chips)",
      "Administer 3% hypertonic saline ONLY via infusion pump through a central line as prescribed; never administer hypertonic saline as a bolus or through a peripheral line (risk of severe phlebitis and tissue necrosis if extravasation occurs)",
      "Implement fall precautions and seizure precautions for patients with moderate to severe hyponatremia: padded side rails, suction at bedside, supplemental oxygen available, bed in lowest position",
      "Weigh the patient daily at the same time, same scale, same clothing to track fluid balance; sudden weight changes reflect fluid shifts (1 kg weight change equals approximately 1 liter of fluid)",
      "Monitor for signs of osmotic demyelination syndrome (ODS) during hyponatremia correction: dysarthria (slurred speech), dysphagia (difficulty swallowing), quadriparesis, behavioral changes -- symptoms typically appear 2-6 days after overcorrection",
      "Provide oral care every 2 hours for patients on fluid restriction to manage thirst and maintain mucosal integrity; offer ice chips (count as fluid intake), hard candy, or moist swabs"
    ],
    assessmentFindings: [
      "Hyponatremia -- mild to moderate (125-134 mEq/L): headache, nausea, vomiting, muscle cramps, fatigue, anorexia, malaise, difficulty concentrating",
      "Hyponatremia -- severe (below 125 mEq/L): confusion, disorientation, lethargy progressing to obtundation, seizures (often the presenting symptom of acute severe hyponatremia), respiratory arrest from brainstem herniation",
      "Hypernatremia -- mild to moderate (146-159 mEq/L): intense thirst (if thirst mechanism intact), dry sticky mucous membranes, decreased skin turgor, lethargy, irritability, restlessness, low-grade fever",
      "Hypernatremia -- severe (above 160 mEq/L): delirium, hallucinations, high-pitched cry in infants, hyperreflexia, muscle rigidity, seizures, coma; signs of severe dehydration (tachycardia, hypotension, oliguria, sunken fontanels in infants)",
      "Volume status findings in hypovolemic hyponatremia: poor skin turgor, flat neck veins, orthostatic hypotension, tachycardia, dry mucous membranes, decreased urine output",
      "Volume status findings in hypervolemic hyponatremia: peripheral edema, ascites, jugular venous distension, crackles on lung auscultation, dyspnea, weight gain",
      "Osmotic demyelination syndrome (ODS) from overcorrection: initially asymptomatic for 2-6 days after correction, then dysarthria, dysphagia, flaccid quadriplegia, altered consciousness -- damage is often irreversible"
    ],
    signs: {
      left: [
        "Mild headache and nausea",
        "Muscle cramps and generalized weakness",
        "Mild confusion or difficulty concentrating",
        "Fatigue and anorexia",
        "Mild thirst with slightly dry mucous membranes",
        "Subtle personality changes or irritability"
      ],
      right: [
        "New-onset seizure activity (severe hyponatremia below 120 mEq/L)",
        "Rapidly deteriorating level of consciousness (impending brainstem herniation)",
        "Sodium correction rate exceeding 8-10 mEq/L in 24 hours (osmotic demyelination risk)",
        "Severe dehydration with hypernatremia (tachycardia, hypotension, oliguria)",
        "Respiratory distress in hypervolemic hyponatremia (pulmonary edema)",
        "Signs of ODS appearing 2-6 days after correction (dysarthria, dysphagia, quadriparesis)"
      ]
    },
    medications: [
      {
        name: "3% Hypertonic Saline (3% NaCl)",
        type: "Hypertonic crystalloid solution (sodium concentration 513 mEq/L)",
        action: "Provides a concentrated sodium load that raises serum osmolality and draws water out of swollen brain cells by creating an osmotic gradient from the intracellular to the extracellular compartment. This reduces cerebral edema and lowers intracranial pressure in severe symptomatic hyponatremia. Each 100 mL of 3% saline raises serum sodium by approximately 1-2 mEq/L depending on body weight.",
        sideEffects: "Osmotic demyelination syndrome (ODS) if correction is too rapid (exceeding 8-10 mEq/L in 24 hours), fluid overload and pulmonary edema, hypernatremia from overcorrection, severe phlebitis and tissue necrosis if extravasation occurs through a peripheral line",
        contra: "Hypernatremia, decompensated heart failure (risk of volume overload), peripheral IV administration without central access (risk of severe phlebitis); must be used with extreme caution in patients with chronic hyponatremia",
        pearl: "ALWAYS administer via infusion pump through a CENTRAL venous catheter. Monitor serum sodium every 2 hours during infusion. Target initial correction of 1-2 mEq/L per hour for the first 2-3 hours until seizures stop or symptoms improve, then slow correction rate. Total 24-hour correction must NOT exceed 8-10 mEq/L. If overcorrection occurs, desmopressin can be administered to re-lower sodium."
      },
      {
        name: "Normal Saline (0.9% NaCl)",
        type: "Isotonic crystalloid solution (sodium concentration 154 mEq/L)",
        action: "Provides isotonic volume expansion that restores intravascular volume in hypovolemic hyponatremia. As volume is repleted, the hypovolemic stimulus for ADH release is removed, allowing the kidneys to excrete excess free water and gradually correct the sodium concentration. Normal saline is isotonic relative to plasma, so it expands the extracellular fluid compartment without causing significant osmotic shifts.",
        sideEffects: "Hyperchloremic metabolic acidosis with large-volume infusion (high chloride content 154 mEq/L), fluid overload in patients with heart failure or renal impairment, dilutional effects on other electrolytes, peripheral edema",
        contra: "Hypervolemic hyponatremia (heart failure, cirrhosis -- will worsen volume overload and edema); hypernatremia (will worsen sodium elevation); euvolemic hyponatremia (SIADH -- will be rapidly excreted and may paradoxically worsen hyponatremia)",
        pearl: "First-line treatment for hypovolemic hyponatremia from GI losses, diuretic use, or adrenal insufficiency. Monitor sodium every 4-6 hours during infusion. In SIADH, normal saline should NOT be used as it can worsen hyponatremia because the kidneys retain the water component while excreting the sodium (a phenomenon called desalination)."
      },
      {
        name: "Desmopressin (DDAVP)",
        type: "Synthetic vasopressin (ADH) analog (selective V2 receptor agonist)",
        action: "Acts on vasopressin V2 receptors in the renal collecting duct to increase insertion of aquaporin-2 water channels, promoting water reabsorption and producing concentrated urine. In central diabetes insipidus, it replaces the missing or deficient ADH. In the context of hyponatremia overcorrection, it is used to re-lower sodium by promoting water retention and halting the rapid rise in serum sodium.",
        sideEffects: "Hyponatremia (therapeutic intent in overcorrection management, but a risk in other uses), water intoxication, headache, nausea, facial flushing, abdominal cramps. Hyponatremia can cause seizures if fluid intake is not monitored.",
        contra: "Type IIB von Willebrand disease (may cause platelet aggregation), habitual or psychogenic polydipsia (risk of severe hyponatremia), moderate to severe renal impairment (impaired response), hyponatremia (unless being used therapeutically to prevent overcorrection)",
        pearl: "In diabetes insipidus treatment, monitor urine specific gravity and urine output to assess effectiveness (target output 1-2 L/day and specific gravity above 1.010). In hyponatremia overcorrection rescue, desmopressin is given with D5W infusion to re-lower sodium that has been corrected too quickly. Teach patients to limit fluid intake during desmopressin therapy to prevent water intoxication."
      }
    ],
    pearls: [
      "Sodium disorders are fundamentally WATER disorders: hyponatremia usually means too much water relative to sodium (treat by restricting water), and hypernatremia usually means too little water relative to sodium (treat by replacing water) -- this concept guides all management decisions",
      "The rate of sodium correction is more dangerous than the imbalance itself in chronic hyponatremia -- correcting chronic hyponatremia faster than 8-10 mEq/L in 24 hours can cause osmotic demyelination syndrome (ODS), which produces irreversible brain damage; the mnemonic is 'low and slow'",
      "Thiazide diuretics (hydrochlorothiazide, chlorthalidone) are the most common medication cause of hyponatremia -- they impair the kidney's ability to dilute urine while maintaining concentrating ability, trapping water in the body; loop diuretics (furosemide) cause hyponatremia less frequently because they impair both dilution and concentration",
      "SIADH produces euvolemic hyponatremia with inappropriately concentrated urine (urine osmolality above 100 mOsm/kg) and elevated urine sodium (above 40 mEq/L) -- the first-line treatment is fluid restriction to 800-1200 mL/day, NOT normal saline (which can worsen SIADH hyponatremia through desalination)",
      "Always assess volume status when evaluating hyponatremia because treatment depends entirely on the volume category -- hypovolemic hyponatremia gets normal saline, euvolemic gets fluid restriction, and hypervolemic gets fluid restriction plus diuretics",
      "In hypernatremia, thirst is the most powerful protective mechanism -- patients who develop hypernatremia almost always have impaired access to water (altered consciousness, intubation, cognitive impairment, infancy) or impaired thirst mechanism (hypothalamic lesions, elderly)",
      "Monitor for osmotic demyelination syndrome (ODS) 2-6 days after hyponatremia correction -- initial symptoms are dysarthria and dysphagia, progressing to quadriplegia and locked-in syndrome; this delayed presentation means vigilance must continue well after the acute correction period"
    ],
    quiz: [
      {
        question: "A patient with chronic hyponatremia (serum sodium 118 mEq/L) is being treated with 3% hypertonic saline. The serum sodium has risen from 118 to 129 mEq/L in 12 hours. The practical nurse should recognize this situation as:",
        options: [
          "Expected and therapeutic -- the sodium level is normalizing appropriately",
          "Dangerously rapid overcorrection -- the rate exceeds 8-10 mEq/L in 24 hours, placing the patient at risk for osmotic demyelination syndrome",
          "Too slow -- the sodium level should be corrected to normal (140 mEq/L) within 24 hours",
          "Insignificant -- the sodium level is still below normal so no action is needed"
        ],
        correct: 1,
        rationale: "The sodium has risen 11 mEq/L in only 12 hours, exceeding the safe correction rate of 8-10 mEq/L per 24 hours. This overcorrection places the patient at serious risk for osmotic demyelination syndrome (ODS). The nurse should immediately report this finding, anticipate orders to stop hypertonic saline, and expect possible desmopressin and D5W administration to re-lower the sodium. ODS causes irreversible neurological damage."
      },
      {
        question: "A practical nurse is caring for an elderly patient with a serum sodium of 158 mEq/L. Which assessment finding is most consistent with this laboratory value?",
        options: [
          "Peripheral edema and jugular venous distension",
          "Intense thirst, dry sticky mucous membranes, and decreased skin turgor",
          "Moist crackles on lung auscultation and frothy sputum",
          "Muscle cramps and hyperactive bowel sounds"
        ],
        correct: 1,
        rationale: "Hypernatremia (sodium 158 mEq/L) indicates a hyperosmolar state with relative water deficit. Classic findings include intense thirst (if the thirst mechanism is intact), dry sticky mucous membranes, decreased skin turgor (especially on the sternum or forehead in elderly), lethargy, and irritability. Peripheral edema and JVD suggest fluid overload (hypervolemia). Crackles suggest pulmonary edema. These findings are associated with hypervolemic states, not the dehydration typical of hypernatremia."
      },
      {
        question: "A patient with heart failure has a serum sodium of 128 mEq/L and presents with peripheral edema and crackles on lung auscultation. The practical nurse should anticipate which primary treatment approach?",
        options: [
          "Administer 3% hypertonic saline via central line",
          "Administer a 1000 mL normal saline bolus to correct the sodium deficit",
          "Implement fluid restriction (1-1.5 L/day) and administer loop diuretics as ordered",
          "Encourage unrestricted oral fluid intake to improve hydration status"
        ],
        correct: 2,
        rationale: "This patient has hypervolemic hyponatremia from heart failure. The hyponatremia is dilutional -- there is excess total body water. Treatment involves fluid restriction (1-1.5 L/day) and loop diuretics (furosemide) to promote free water excretion. Normal saline would worsen volume overload. Hypertonic saline is reserved for severe symptomatic hyponatremia (seizures, coma). Encouraging oral fluids would further dilute the sodium."
      }
    ]
  },

  "specimen-collection-rpn": {
    title: "Specimen Collection Techniques for Practical Nurses",
    cellular: {
      title: "Principles of Specimen Collection and Laboratory Science Fundamentals",
      content: "Accurate specimen collection is a fundamental nursing competency that directly impacts diagnostic accuracy, treatment decisions, and patient outcomes. Pre-analytical errors (errors occurring before the specimen reaches the laboratory analyzer) account for approximately 46% to 68% of all laboratory errors, making the collection phase the most error-prone step in the laboratory testing cycle. The practical nurse must understand the principles governing each specimen type to ensure results are reliable and clinically actionable. Blood specimen collection follows a specific order of draw when multiple tubes are collected from a single venipuncture or through a butterfly needle. The Clinical and Laboratory Standards Institute (CLSI) established the standardized order of draw to prevent cross-contamination of additives between tubes: blood culture bottles (yellow top or separate bottles -- always collected first to minimize contamination risk), citrate tube (light blue top -- for coagulation studies such as PT, INR, PTT; must be filled to the exact fill line because the anticoagulant-to-blood ratio is critical), serum separator tube or SST (gold or red/grey tiger top -- for chemistry panels, allows clotting then separates serum), heparin tube (green top -- for stat chemistry, ABG analysis), EDTA tube (lavender/purple top -- for CBC, hemoglobin A1C, blood type), oxalate/fluoride tube (grey top -- for glucose and lactate levels, prevents glycolysis), and other tubes as needed. Failure to follow the correct order of draw can produce clinically significant errors: for example, drawing a lavender (EDTA) tube before a blue (citrate) tube can contaminate the citrate tube with EDTA, falsely prolonging clotting times and potentially leading to inappropriate anticoagulation therapy changes. Urine specimen collection techniques vary based on the test ordered. A clean-catch midstream specimen requires the patient to cleanse the urethral meatus, begin voiding into the toilet, then collect the midstream portion in a sterile container. This technique minimizes contamination from periurethral flora. For catheterized specimens, urine is aspirated from the designated sampling port on the catheter using a sterile syringe after clamping the drainage tubing for 15-30 minutes to allow urine to accumulate -- never collect from the drainage bag as this specimen is stagnant and colonized with bacteria. Twenty-four-hour urine collection requires discarding the first morning void, then collecting ALL subsequent urine for exactly 24 hours including the final void at the end of the collection period. Missing even one void invalidates the entire collection. Sputum specimens should be collected in the early morning before eating or drinking, when secretions have accumulated overnight. The patient should rinse the mouth with water (not mouthwash, which has bactericidal properties) to reduce oral flora contamination, then deep cough to produce sputum from the lower respiratory tract. Sputum differs from saliva -- it is thicker, more opaque, and may be colored (yellow, green, rust-colored, or blood-tinged). A minimum of 5 to 10 mL of sputum is typically needed for culture and sensitivity testing. Wound culture specimens require proper technique to yield meaningful results. The wound should first be cleansed with normal saline to remove surface contaminants and debris. The Levine technique (rotating a swab over a 1 cm squared area of clean wound bed with enough pressure to express tissue fluid from the wound) produces a more accurate specimen than simply swabbing surface pus or exudate, which grows contaminants rather than the true pathogenic organisms. Stool specimens may be collected for occult blood testing (guaiac-based or immunochemical), culture and sensitivity, ova and parasites, or Clostridioides difficile toxin testing. Specimen labeling is a critical patient safety step: every specimen must be labeled at the bedside immediately after collection with the patient's full name, date of birth, medical record number, date and time of collection, collector's initials, and specimen source. Two patient identifiers must be verified before collection. Chain of custody documentation is required for forensic specimens (blood alcohol, drug screens) where the specimen must be continuously tracked from collection through analysis."
    },
    riskFactors: [
      "Failure to verify patient identification before specimen collection (risk of specimen mislabeling, leading to wrong results attributed to wrong patient -- a critical safety event)",
      "Incorrect order of draw during phlebotomy (additive cross-contamination producing false laboratory results that may lead to inappropriate treatment changes)",
      "Improper site selection for blood draw (drawing above an active IV infusion dilutes the specimen with IV fluid, producing falsely low values for most analytes and falsely elevated values for infused substances)",
      "Prolonged tourniquet application exceeding 1 minute (causes hemoconcentration, falsely elevating proteins, lipids, potassium, calcium, and cell counts)",
      "Hemolysis from traumatic collection technique (falsely elevates potassium, LDH, AST, and bilirubin; most common pre-analytical error in blood specimen collection)",
      "Inadequate patient preparation (failure to observe fasting requirements for glucose and lipid panels, failure to hold medications that interfere with test results, timing errors for trough/peak drug levels)",
      "Delayed transport or improper storage of specimens (prolonged exposure to room temperature causes glycolysis in glucose specimens, potassium leakage from red blood cells, and degradation of labile analytes)"
    ],
    diagnostics: [
      "Blood culture collection: collect 2 sets (2 bottles each -- aerobic and anaerobic) from 2 separate venipuncture sites; cleanse skin with chlorhexidine scrub for 30 seconds and allow to dry for 30 seconds before puncture; always collected FIRST in the order of draw; collect before antibiotic administration when possible",
      "Complete blood count (CBC) collection: draw into EDTA tube (lavender/purple top); gently invert 8-10 times to mix anticoagulant; do not shake vigorously (causes hemolysis); specimen stable at room temperature for up to 24 hours but should be processed within 4 hours for accurate platelet count",
      "Coagulation studies (PT/INR, PTT): draw into citrate tube (light blue top); critical that tube is filled to the exact fill line (9:1 blood-to-anticoagulant ratio); underfilled tubes produce falsely prolonged results; gently invert 3-4 times; process within 4 hours",
      "Clean-catch midstream urine: instruct patient on proper periurethral cleansing technique, void initial stream into toilet, collect midstream into sterile container, void remainder into toilet; transport to laboratory within 30 minutes or refrigerate to prevent bacterial overgrowth",
      "Sputum culture: collect early morning specimen before eating; rinse mouth with water only; deep cough from lower airways (not saliva); minimum 5-10 mL in sterile container; transport promptly; if patient cannot produce sputum, nebulized hypertonic saline (sputum induction) may be ordered",
      "Wound culture (Levine technique): cleanse wound with normal saline first; rotate swab over 1 cm squared area of clean granulating wound bed with enough pressure to express tissue fluid; place in appropriate transport medium; label with exact wound location"
    ],
    management: [
      "Implement standardized specimen labeling at the bedside: print labels containing patient full name, date of birth, medical record number, date and time of collection, collector's initials, and specimen source; verify against patient armband using two identifiers before labeling",
      "Follow facility-specific transport requirements: maintain specimens at appropriate temperature (room temperature, refrigerated, or on ice as required by the test), transport within specified time frames, and use pneumatic tube system or laboratory courier as designated",
      "Communicate critical results immediately: when laboratory results fall outside critical (panic) values, the laboratory notifies the nursing unit; the practical nurse must receive the result, read back the value for verification, document the notification time, and report to the physician or nurse practitioner within the facility-required time frame",
      "Manage patient preparation for fasting specimens: confirm fasting status (8-12 hours for glucose and lipid panels), hold medications as ordered prior to collection, schedule fasting specimens for early morning to minimize patient discomfort",
      "Coordinate timing of drug level collections: trough levels are drawn immediately before the next dose (lowest drug concentration); peak levels are drawn at the time of maximum drug concentration after administration (varies by medication and route); document exact time of last dose and time of draw",
      "Ensure chain of custody for forensic specimens: maintain continuous possession documentation from collection to laboratory; have the patient identify the specimen, seal the container with tamper-evident tape, obtain required signatures, and document each transfer of custody"
    ],
    nursingActions: [
      "Verify two patient identifiers (typically name and date of birth or name and medical record number) against the patient armband immediately before specimen collection; ask the patient to state their name and date of birth rather than asking confirming yes/no questions",
      "Assess the collection site before venipuncture: palpate for veins (do not rely on sight alone), avoid areas with IV infusions (draw from the opposite arm), avoid sites with AV fistulas or shunts, mastectomy side (lymphedema risk), areas of edema, hematoma, or thrombosis",
      "Follow the standardized order of draw for multiple tube collection: blood cultures, light blue (citrate), gold/red (SST), green (heparin), lavender (EDTA), grey (fluoride/oxalate); this sequence prevents additive cross-contamination",
      "Apply the tourniquet no longer than 1 minute before venipuncture to prevent hemoconcentration; if vein access takes longer, release the tourniquet for 2 minutes before reapplying",
      "Gently invert blood tubes immediately after collection (do not shake) to mix the blood with the tube additive: citrate tubes 3-4 inversions, EDTA tubes 8-10 inversions, SST tubes 5-6 inversions; shaking causes hemolysis",
      "Label all specimens at the bedside immediately after collection, never pre-label or batch-label tubes; discard any unlabeled specimens and recollect rather than attempting to match unlabeled tubes to patients",
      "Document the specimen collection in the patient record: type of specimen, collection site, date and time, patient tolerance of the procedure, and any difficulties encountered (multiple attempts, patient refusal, hemolysis)"
    ],
    assessmentFindings: [
      "Signs of difficult venous access: scarred or fibrosed veins from repeated venipuncture, dehydration (flat veins, poor turgor), obesity (veins difficult to palpate), peripheral vascular disease, chemotherapy-related vein damage",
      "Signs of hemolysis in the specimen: serum or plasma appears pink to red (ruptured red blood cells release hemoglobin); causes include traumatic draw technique, vigorous shaking of tubes, small-gauge needle use, drawing through an IV line, or forcing blood through a small syringe opening",
      "Signs of specimen contamination: urine culture growing multiple organisms (more than 3 species suggests contamination rather than true infection), blood culture growing common skin contaminants (coagulase-negative staphylococci in only one of two sets suggests contamination), sputum with many squamous epithelial cells (indicates saliva rather than lower respiratory tract specimen)",
      "Signs of improper specimen handling: clotted coagulation tube (underfilled or inadequate mixing), hemolyzed chemistry specimen, delayed transport visible as changes in glucose values (decreases approximately 7 mg/dL per hour at room temperature from continued glycolysis)",
      "Patient assessment before specimen collection: anxiety level and need for preparation/distraction, presence of bleeding disorders or anticoagulant therapy (need for extended pressure after venipuncture), allergy to latex or antiseptic solutions, history of vasovagal reactions during blood draws",
      "Post-collection site assessment: bleeding control verified (pressure applied for minimum 3-5 minutes, 10 minutes if on anticoagulants), absence of hematoma formation, circulation distal to the site intact (pulses, sensation, capillary refill)"
    ],
    signs: {
      left: [
        "Mild anxiety before blood draw (provide reassurance and distraction)",
        "Small hematoma at venipuncture site (apply pressure and ice)",
        "Slight hemolysis in specimen requiring recollection",
        "Patient difficulty producing sputum specimen (may need sputum induction)",
        "Mildly lipemic specimen affecting some test results",
        "Single contaminated blood culture requiring repeat collection"
      ],
      right: [
        "Vasovagal syncope during or after blood draw (loss of consciousness, bradycardia, hypotension)",
        "Arterial puncture during venipuncture (bright red pulsatile blood -- apply firm pressure for minimum 10 minutes)",
        "Nerve injury from venipuncture (sudden sharp shooting pain, numbness, or tingling radiating down the arm -- withdraw needle immediately)",
        "Severe allergic reaction to antiseptic solution (anaphylaxis)",
        "Specimen mislabeling discovered after results reported (critical safety event requiring immediate investigation)",
        "Uncontrolled bleeding at venipuncture site in patient on anticoagulants (hematoma expansion, compartment syndrome risk)"
      ]
    },
    medications: [
      {
        name: "Chlorhexidine Gluconate 2% Antiseptic Solution (ChloraPrep)",
        type: "Topical antiseptic (biguanide antimicrobial)",
        action: "Disrupts the bacterial cell membrane by binding to negatively charged components of the microbial cell wall, causing leakage of intracellular contents and cell death. Provides broad-spectrum antimicrobial activity against gram-positive bacteria, gram-negative bacteria, and fungi. Has significant residual antimicrobial activity that persists on the skin for up to 48 hours after application, providing ongoing protection against bacterial regrowth at the puncture site.",
        sideEffects: "Skin irritation or contact dermatitis (uncommon), rare anaphylactic reactions (more common with mucosal exposure), skin discoloration at application site, ototoxicity if introduced into the middle ear (do not use near otic procedures)",
        contra: "Known hypersensitivity to chlorhexidine; neonates under 2 months of age (risk of chemical skin burns due to immature skin barrier); do not use on mucous membranes, near the eyes or ears, or in the ear canal; lumbar puncture sites (some facilities restrict use due to chemical meningitis risk)",
        pearl: "Apply using a back-and-forth scrubbing motion for at least 30 seconds, then allow to air dry completely for 30 seconds before skin puncture. The drying time is essential -- the antiseptic effect is not complete until the solution dries. For blood cultures, chlorhexidine is preferred over povidone-iodine because it provides superior and longer-lasting antimicrobial activity. Always ask about chlorhexidine allergy before use."
      },
      {
        name: "Povidone-Iodine 10% Solution (Betadine)",
        type: "Topical antiseptic (iodophor complex)",
        action: "Slowly releases free iodine when applied to the skin. Free iodine penetrates microbial cell walls and disrupts protein synthesis and cellular metabolism through oxidation reactions. Effective against gram-positive and gram-negative bacteria, viruses, fungi, spores, and protozoa. Provides broad-spectrum antimicrobial coverage but has less residual activity than chlorhexidine.",
        sideEffects: "Skin irritation, staining of skin and clothing (brown discoloration), allergic contact dermatitis, rare systemic absorption with large surface area application (thyroid dysfunction), interference with thyroid function tests if absorbed systemically",
        contra: "Known iodine allergy or sensitivity, thyroid disorders (Hashimoto thyroiditis, Graves disease -- systemic absorption may exacerbate), neonates (risk of transient hypothyroidism from iodine absorption through immature skin), concurrent use with mercury-containing antiseptics (produces caustic compound)",
        pearl: "Apply in concentric circles from the center of the puncture site outward. Must be allowed to dry for a full 2 minutes (longer than chlorhexidine) for maximum antimicrobial effect. If the patient has a chlorhexidine allergy, povidone-iodine is the primary alternative for blood culture skin preparation. Can interfere with thyroid function tests -- document application site and time if thyroid labs are ordered."
      },
      {
        name: "EMLA Cream (Eutectic Mixture of Lidocaine 2.5% and Prilocaine 2.5%)",
        type: "Topical anesthetic (amide local anesthetic combination)",
        action: "Lidocaine and prilocaine form a eutectic mixture that melts at room temperature, allowing deep penetration through the stratum corneum. Both agents reversibly block sodium channels in sensory nerve fibers, preventing depolarization and transmission of pain signals from the skin surface. The combination provides anesthesia to a depth of approximately 3-5 mm, sufficient for venipuncture and superficial procedures. Maximum effect occurs after 60 minutes of application under an occlusive dressing.",
        sideEffects: "Local skin blanching (vasoconstriction) followed by erythema, mild edema at application site, rare methemoglobinemia (especially in infants under 3 months or with concurrent oxidizing agents), allergic contact dermatitis",
        contra: "Known sensitivity to amide local anesthetics, methemoglobinemia or concurrent use of methemoglobin-inducing drugs (sulfonamides, dapsone, nitrates), application to mucous membranes or open wounds (increased systemic absorption), infants under 37 weeks gestational age",
        pearl: "Apply a thick layer (approximately 2.5 grams over 20-25 cm squared area) under an occlusive dressing 60 minutes before venipuncture for full anesthetic effect. Maximum application area varies by age and weight -- follow pediatric dosing guidelines carefully. Wipe off completely and cleanse skin with antiseptic before venipuncture. Particularly useful for pediatric patients and adults with needle phobia. Requires a physician order in most facilities."
      }
    ],
    pearls: [
      "The order of draw is the most critical rule in phlebotomy: blood cultures FIRST, then light blue (citrate), gold/red (SST), green (heparin), lavender (EDTA), grey (fluoride) -- the mnemonic 'Boys Love Girls who Have Lovely Grey eyes' or 'Blood Cultures, Light Blue, Gold, Green, Lavender, Grey' can help recall the sequence",
      "NEVER draw blood from an arm with an active IV infusion -- draw from the opposite arm or a site below (distal to) the IV; if no alternative site exists, stop the IV for 2 minutes before drawing and discard the first 5 mL to prevent dilution contamination; document the IV and site on the lab requisition",
      "The citrate (light blue top) tube for coagulation studies MUST be filled to the exact fill line -- an underfilled tube alters the 9:1 blood-to-anticoagulant ratio and produces falsely prolonged PT/INR and PTT results that may lead to inappropriate changes in anticoagulation therapy",
      "For blood cultures, ALWAYS use chlorhexidine antiseptic (unless allergic), scrub for 30 seconds, let dry for 30 seconds, and collect 2 sets from 2 different sites to distinguish true bacteremia (both sets positive with same organism) from contamination (only one set positive)",
      "Urine specimens for culture MUST be transported to the laboratory within 30 minutes or refrigerated immediately -- bacteria in the specimen continue to multiply at room temperature, producing falsely elevated colony counts that may result in unnecessary antibiotic treatment",
      "The Levine technique for wound cultures (rotating the swab with pressure over a 1 cm squared area of clean wound bed) is the ONLY acceptable method for wound swab culture -- simply swabbing surface exudate or pus grows contaminants rather than the pathogenic organisms causing the wound infection",
      "Label every specimen at the patient's bedside immediately after collection using two patient identifiers verified against the armband -- NEVER pre-label tubes, batch-label multiple patients' specimens, or attempt to match unlabeled specimens after the fact; discard unlabeled specimens and recollect"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to collect blood specimens from a patient who needs a CBC, PT/INR, and blood cultures. In what order should the tubes be drawn?",
        options: [
          "Lavender top (CBC), light blue top (PT/INR), blood culture bottles",
          "Light blue top (PT/INR), blood culture bottles, lavender top (CBC)",
          "Blood culture bottles, light blue top (PT/INR), lavender top (CBC)",
          "Blood culture bottles, lavender top (CBC), light blue top (PT/INR)"
        ],
        correct: 2,
        rationale: "The correct order of draw is blood cultures first (to minimize contamination risk), followed by light blue top (citrate for PT/INR), then lavender top (EDTA for CBC). Drawing blood cultures first prevents additive contamination from other tubes. The citrate tube is drawn before EDTA because EDTA contamination would falsely prolong coagulation results."
      },
      {
        question: "A practical nurse collects a light blue top (citrate) tube for PT/INR testing and notices the tube is only half filled. What is the most appropriate action?",
        options: [
          "Send the tube to the laboratory as collected since any amount of blood is acceptable",
          "Discard the tube and redraw using a new tube, ensuring it is filled to the designated fill line",
          "Add normal saline to the tube to bring it to the fill line",
          "Shake the tube vigorously to ensure proper mixing with the reduced blood volume"
        ],
        correct: 1,
        rationale: "A citrate tube for coagulation studies must be filled to the exact fill line to maintain the critical 9:1 blood-to-anticoagulant ratio. An underfilled tube has excess citrate relative to blood, which binds additional calcium and produces falsely prolonged PT/INR and PTT results. This could lead to inappropriate adjustment of anticoagulation therapy. The specimen must be discarded and recollected. Never add any solution to a blood specimen tube."
      },
      {
        question: "A practical nurse is collecting a wound culture from a patient with a chronic leg ulcer. Which technique will produce the most accurate specimen for identifying the causative pathogen?",
        options: [
          "Swab the surface pus and exudate without cleaning the wound first",
          "Cleanse the wound with normal saline, then rotate the swab over a 1 cm squared area of clean wound bed with enough pressure to express tissue fluid (Levine technique)",
          "Insert the swab deeply into the wound tunnel and collect drainage from the deepest point",
          "Collect wound drainage from the dressing that was removed during the dressing change"
        ],
        correct: 1,
        rationale: "The Levine technique is the gold standard for wound swab culture. It involves first cleansing the wound with normal saline to remove surface contaminants, then rotating the swab over a 1 cm squared area of clean granulating wound bed with sufficient pressure to express tissue fluid. This technique captures organisms from the viable tissue rather than surface colonizers or contaminants. Swabbing surface pus, tunnels, or old dressings produces specimens contaminated with colonizing organisms that do not represent the true wound pathogen."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
