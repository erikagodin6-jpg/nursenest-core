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
  "burn-assessment-rn": {
    title: "Burn Assessment and Management",
    cellular: {
      title: "Pathophysiology of Thermal Injury and Burn Wound Classification",
      content: "Burns are tissue injuries caused by thermal, chemical, electrical, or radiation energy that produce cellular damage ranging from reversible injury to complete tissue destruction. Thermal burns are the most common type, caused by contact with flames, hot liquids (scalds), hot surfaces, or steam. Understanding burn pathophysiology requires knowledge of Jackson's burn wound model, which describes three concentric zones of tissue injury. The zone of coagulation is the central area of the burn wound where temperatures were highest, causing irreversible protein denaturation and coagulative necrosis of all cells. This tissue is non-viable and cannot recover regardless of treatment. The zone of stasis surrounds the zone of coagulation and represents tissue with decreased perfusion and potentially salvageable cells. Cells in this zone have sustained thermal injury but are not yet irreversibly damaged -- they exist in a precarious state where adequate resuscitation and wound care can preserve viability, but inadequate resuscitation, infection, edema, or vasoconstriction can convert this zone to coagulative necrosis (wound deepening). Preventing zone of stasis conversion is a primary goal of burn management. The zone of hyperemia is the outermost zone where tissue has sustained minimal injury but demonstrates increased blood flow (hyperemia) as part of the inflammatory response. This tissue will recover completely unless complicated by severe sepsis or prolonged hypoperfusion. Burns are classified by depth: superficial (first-degree) burns involve only the epidermis (sunburn is the prototype -- erythema, pain, no blistering, heals in 3-7 days without scarring). Superficial partial-thickness (superficial second-degree) burns extend through the epidermis into the superficial (papillary) dermis -- they produce blisters with a moist, pink, painful wound bed that blanches with pressure (indicating intact dermal blood supply); these wounds heal in 7-21 days from surviving epithelial appendages (hair follicles and sweat glands) with minimal scarring. Deep partial-thickness (deep second-degree) burns extend into the deep (reticular) dermis -- the wound appears mottled pink and white, with decreased sensation (damaged nerve endings), sluggish capillary refill, and may or may not blister; healing takes 3-8 weeks with significant risk of hypertrophic scarring. Full-thickness (third-degree) burns destroy the entire epidermis and dermis -- the wound appears white, waxy, brown, or charred, is insensate (destroyed nerve endings), does not blanch with pressure, feels leathery (eschar), and CANNOT heal without skin grafting because all epithelial regenerative structures have been destroyed. Fourth-degree burns extend through the full thickness of skin into underlying subcutaneous tissue, fascia, muscle, or bone. Burn size is assessed using standardized methods. The Rule of Nines divides the adult body surface into regions each representing 9% (or multiples): head 9%, each upper extremity 9%, anterior trunk 18%, posterior trunk 18%, each lower extremity 18%, perineum 1%. For children, the Lund-Browder chart provides more accurate age-adjusted calculations because children have proportionately larger heads and smaller extremities. For scattered or irregular burns, the patient's palm (including fingers) represents approximately 1% of total body surface area (TBSA). Only partial-thickness and full-thickness burns are included in TBSA calculation -- superficial (first-degree) burns are excluded. The systemic response to major burns (>20% TBSA in adults, >10% in children) is a massive, life-threatening physiological derangement. Within minutes of injury, massive release of inflammatory mediators (histamine, prostaglandins, kinins, cytokines including IL-1, IL-6, IL-8, TNF-alpha) from damaged tissues causes a dramatic increase in capillary permeability throughout the body (not just at the burn site). This systemic capillary leak results in massive shifts of intravascular fluid, electrolytes, and plasma proteins into the interstitial space (third-spacing), producing burn shock -- a combination of hypovolemic (from fluid loss) and distributive (from vasodilation and capillary leak) shock. Without aggressive fluid resuscitation, burn shock progresses to cardiovascular collapse and death within hours. Fluid resuscitation is guided by the Parkland (Baxter) formula: 4 mL x body weight (kg) x %TBSA burned of lactated Ringer's solution in the first 24 hours, with half given in the first 8 hours from the TIME OF INJURY (not time of arrival to hospital) and the second half over the next 16 hours. The target of resuscitation is a urine output of 0.5-1 mL/kg/hour in adults (1-2 mL/kg/hour in children), which serves as the primary indicator of adequate end-organ perfusion. Fluid resuscitation is titrated to urine output, not given as a fixed rate -- the Parkland formula provides a starting estimate, but actual requirements may be higher or lower. The capillary leak phase typically resolves by 18-24 hours post-burn, after which capillary integrity is restored and mobilization of third-spaced fluid begins (heralded by a spontaneous diuresis). The RN's role in burn assessment is critical: accurate initial burn size and depth estimation directly determines resuscitation requirements, transfer criteria, and surgical planning. Common errors include overestimating burn size (including erythema/first-degree burns in TBSA), underestimating depth (deep partial-thickness burns may initially appear superficial before wound evolution), and starting the 24-hour clock from hospital arrival rather than from time of injury. The nurse must also perform a systematic primary and secondary trauma survey because burns may coexist with other traumatic injuries (inhalation injury, fractures from falls or explosions, blast injuries)."
    },
    riskFactors: [
      "Extremes of age (children <5 and adults >65 have thinner skin, increased mortality, and higher risk of abuse-related burns; elderly have impaired healing and more comorbidities)",
      "Occupational exposure (firefighters, industrial workers, welders, restaurant workers, electricians -- work environments with fire, chemicals, hot surfaces, and electrical hazards)",
      "Impaired sensation (peripheral neuropathy from diabetes, spinal cord injury, peripheral vascular disease -- inability to perceive thermal injury leading to prolonged contact with heat source)",
      "Alcohol and substance use (impaired judgment, loss of consciousness near heat sources, delayed escape from fires, self-neglect)",
      "Residential factors (absence of smoke detectors, space heaters, cooking hazards, scalding water heater temperature >120F/49C, inadequate fire escape routes)",
      "Pre-existing medical conditions (epilepsy with seizure risk near heat sources, mobility limitations preventing escape, psychiatric disorders)",
      "Intentional injury (non-accidental burns in children -- consider abuse when burn pattern is inconsistent with history; immersion burns with clear demarcation lines and stocking/glove distribution; cigarette burns)"
    ],
    diagnostics: [
      "Burn depth assessment (clinical examination: color, sensation, capillary refill, texture, blistering -- initial depth assessment may change over 48-72 hours as zone of stasis evolves)",
      "TBSA calculation using Rule of Nines (adults), Lund-Browder chart (children), or palm method (scattered burns) -- exclude superficial/first-degree burns from calculation",
      "Carboxyhemoglobin level (if inhalation injury suspected -- COHb >10% indicates significant CO exposure; treat with 100% high-flow oxygen; COHb >25% indicates severe poisoning)",
      "Fiberoptic bronchoscopy (gold standard for diagnosing inhalation injury -- assess airway for edema, erythema, carbonaceous deposits, and mucosal sloughing)",
      "Arterial blood gas (assess oxygenation, ventilation, and acid-base status; metabolic acidosis from tissue hypoperfusion in burn shock; respiratory acidosis in inhalation injury)",
      "Complete metabolic panel (electrolytes to guide resuscitation; renal function to assess adequacy of perfusion; glucose monitoring for stress hyperglycemia)",
      "Complete blood count, type and crossmatch (hemoconcentration initially from fluid loss; later anemia from RBC destruction and hemodilution after resuscitation; type and crossmatch for anticipated surgical needs)"
    ],
    management: [
      "Fluid resuscitation using Parkland formula: 4 mL x kg x %TBSA of lactated Ringer's solution over 24 hours (half in first 8 hours from TIME OF INJURY, half over next 16 hours); titrate to urine output 0.5-1 mL/kg/hour",
      "Airway management (early intubation for suspected inhalation injury -- airway edema can progress rapidly over 12-24 hours, making delayed intubation dangerous or impossible)",
      "Wound care (debridement of non-viable tissue, topical antimicrobials such as silver sulfadiazine or mafenide acetate, sterile dressings, skin grafting for full-thickness burns)",
      "Temperature management (burn patients lose thermoregulation capacity proportional to burn size -- maintain warm environment 85-90F/29-32C, use warming blankets, warm IV fluids)",
      "Pain management (burns are among the most painful injuries -- IV opioids for procedural and background pain, multimodal analgesia including gabapentin, acetaminophen, and anxiolytics for dressing changes)",
      "Transfer to burn center per ABA criteria: >20% TBSA partial-thickness; any full-thickness burn; burns to face, hands, feet, genitalia, perineum, major joints; chemical/electrical/inhalation injury; burns with concomitant trauma"
    ],
    nursingActions: [
      "Perform and document accurate burn assessment: calculate TBSA using appropriate method (Rule of Nines for adults, Lund-Browder for children), assess and document depth at each burn area, and note time of injury for resuscitation timing",
      "Establish large-bore (16-18 gauge) IV access in two sites (through burned skin if necessary -- burned skin is preferable to no IV access); initiate fluid resuscitation per Parkland formula immediately",
      "Monitor urine output hourly via Foley catheter (target 0.5-1 mL/kg/hr in adults, 1-2 mL/kg/hr in children) -- this is the PRIMARY indicator of resuscitation adequacy; report output <0.5 or >1.5 mL/kg/hr for rate adjustment",
      "Assess for inhalation injury: facial burns, singed nasal hairs, carbonaceous sputum, hoarseness, stridor, history of enclosed-space fire -- report immediately as early intubation may be needed before edema worsens",
      "Remove all jewelry, watches, and constrictive clothing from burned areas immediately (progressive edema can cause compartment syndrome or tourniquet effect)",
      "Perform pain assessment using validated tools and administer analgesics proactively -- burn pain is severe and undertreated; anticipate increased requirements during dressing changes and debridement",
      "Maintain strict aseptic technique for wound care; monitor for signs of wound infection (change in wound appearance, increased drainage, foul odor, surrounding cellulitis, fever, elevated WBC)",
      "Monitor for compartment syndrome in circumferential extremity burns (escalating pain, paresthesias, decreased pulses, tense swelling -- emergent escharotomy required)"
    ],
    assessmentFindings: [
      "Superficial burn: erythema, pain, no blisters, skin intact and blanches with pressure (sunburn appearance)",
      "Superficial partial-thickness: blisters with moist, pink, weeping wound bed that is painful and blanches with pressure",
      "Deep partial-thickness: mottled pink and white appearance, decreased sensation, sluggish capillary refill, may or may not blister",
      "Full-thickness: white, waxy, brown, or charred appearance; insensate (no pain in burned area); leathery texture (eschar); does not blanch",
      "Signs of inhalation injury: facial burns, singed eyebrows/nasal hairs, carbonaceous sputum, hoarseness, stridor, dyspnea, tachypnea",
      "Burn shock indicators: tachycardia, hypotension, decreased urine output (<0.5 mL/kg/hr), altered mental status, delayed capillary refill",
      "Circumferential burn complications: tense edema, diminished or absent distal pulses, paresthesias, increasing pain (compartment syndrome requiring escharotomy)"
    ],
    signs: {
      left: [
        "Small superficial partial-thickness burn (<10% TBSA) with intact blisters",
        "Adequate urine output with standard fluid resuscitation",
        "No inhalation injury, alert and oriented",
        "Pain well-controlled with oral analgesics",
        "Burn healing with re-epithelialization within 2 weeks"
      ],
      right: [
        "Major burn >40% TBSA with burn shock requiring massive resuscitation",
        "Inhalation injury with progressive upper airway edema requiring intubation",
        "Circumferential full-thickness extremity burn with compartment syndrome",
        "Burn sepsis with SIRS, bacteremia, and multi-organ dysfunction",
        "Acute kidney injury from inadequate resuscitation or myoglobinuria (electrical burn)"
      ]
    },
    medications: [
      {
        name: "Silver Sulfadiazine (Silvadene) 1% Cream",
        type: "Topical antimicrobial agent for burn wound prophylaxis",
        action: "Combines the bactericidal properties of silver ions with the bacteriostatic activity of sulfadiazine. Silver ions bind to bacterial DNA, inhibiting replication and causing structural damage to bacterial cell membranes and cell walls. Sulfadiazine inhibits bacterial dihydropteroate synthase, blocking folic acid synthesis. Together they provide broad-spectrum coverage against common burn wound pathogens including Staphylococcus aureus, Pseudomonas aeruginosa, E. coli, Klebsiella, Candida albicans, and Proteus. Creates a protective barrier over the burn wound while delivering sustained antimicrobial activity.",
        sideEffects: "Transient leukopenia (occurs in 5-15% of patients, typically 2-3 days after initiation, generally resolves spontaneously even if continued -- monitor CBC); local burning/pain on application; allergic contact dermatitis; delayed wound healing (silver may be cytotoxic to fibroblasts and keratinocytes); rarely: hemolytic anemia in G6PD-deficient patients; pseudoeschar formation (grayish discoloration that can be mistaken for wound infection)",
        contra: "Sulfonamide allergy (cross-reactivity -- use alternative such as mafenide acetate or silver-containing dressings without sulfonamide); pregnancy at term and neonates (theoretical kernicterus risk from sulfonamide displacement of bilirubin from albumin); G6PD deficiency (risk of hemolytic anemia); do NOT use on the FACE (stains skin and may impede cosmetic outcome); avoid around eyes",
        pearl: "Apply 1/16-inch thick layer with sterile gloved hand or tongue blade; re-apply twice daily after gently washing off previous application with mild soap and water; monitor WBC count every 2-3 days during the first 2 weeks of use (transient leukopenia usually resolves spontaneously); does NOT penetrate eschar well (mafenide acetate is preferred for deep burns with thick eschar); keep the cream at room temperature; if the patient has a sulfa allergy, alternatives include mafenide acetate (Sulfamylon -- NOT sulfonamide-based despite name containing 'sulfa'), bacitracin, mupirocin, or silver-containing wound dressings"
      },
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist) for severe burn pain",
        action: "Binds to mu-opioid receptors in the central nervous system (brainstem, thalamus, spinal cord dorsal horn), activating descending inhibitory pain pathways and reducing the transmission of nociceptive signals. Also binds to peripheral opioid receptors in inflamed tissue, providing local analgesia at the burn site. Produces dose-dependent analgesia, sedation, euphoria, and respiratory depression. Burn pain is among the most severe acute pain conditions and typically requires IV opioid analgesia for adequate control, particularly during dressing changes, debridement, and wound care procedures.",
        sideEffects: "Respiratory depression (most dangerous -- monitor respiratory rate, depth, and SpO2 continuously; naloxone must be available), hypotension (histamine release causing vasodilation -- particularly dangerous in already hemodynamically compromised burn patients), nausea and vomiting (activate CTZ in medulla), constipation (universal with opioid use -- initiate bowel regimen prophylactically), pruritus, urinary retention, tolerance and dependence with prolonged use",
        contra: "Known hypersensitivity; severe respiratory depression or acute/severe bronchial asthma in unmonitored setting; paralytic ileus; concurrent MAO inhibitor use within 14 days; use with extreme caution in head injury (masks neurological assessment), hemodynamic instability (hypotension risk), and hepatic/renal impairment (decreased metabolism and clearance)",
        pearl: "IV route preferred for major burns (IM absorption is unreliable due to burn-related fluid shifts and tissue edema); titrate to pain score goal; administer 15-30 minutes before dressing changes and debridement (procedure pain is often more severe than background pain); patient-controlled analgesia (PCA) is effective for adult burn patients who can use the device; always assess respiratory rate (hold if <12/min), level of sedation, and SpO2 before each dose; multimodal analgesia (gabapentin, acetaminophen, NSAIDs if not contraindicated, anxiolytics) reduces total opioid requirements; plan for opioid weaning as wounds heal to prevent withdrawal"
      },
      {
        name: "Lactated Ringer's Solution (LR)",
        type: "Isotonic crystalloid resuscitation fluid for burn shock",
        action: "Isotonic balanced crystalloid solution containing sodium (130 mEq/L), potassium (4 mEq/L), calcium (3 mEq/L), chloride (109 mEq/L), and lactate (28 mEq/L). Lactate is metabolized by the liver to bicarbonate, providing buffering capacity for the metabolic acidosis that accompanies burn shock. LR is the fluid of choice for burn resuscitation because it closely mimics the electrolyte composition of extracellular fluid, minimizes electrolyte disturbances during massive volume administration, and does not contribute to hyperchloremic metabolic acidosis (unlike normal saline). Expands intravascular volume to restore organ perfusion compromised by burn shock's capillary leak and fluid sequestration.",
        sideEffects: "Fluid overload if over-resuscitated (pulmonary edema, abdominal compartment syndrome, orbital compartment syndrome -- all are recognized complications of excessive burn resuscitation/fluid creep), hyponatremia (dilutional, from excessive free water administration), peripheral edema, hypothermia if fluids are not pre-warmed",
        contra: "Known hypersensitivity to any component; caution in renal impairment (potassium content may exacerbate hyperkalemia); monitor closely in patients with congestive heart failure (risk of volume overload once capillary leak resolves)",
        pearl: "Parkland formula: 4 mL x kg x %TBSA burned = total volume over 24 hours; give HALF in first 8 hours from TIME OF INJURY (not arrival to hospital), second half over next 16 hours; titrate rate to urine output 0.5-1.0 mL/kg/hr (1-2 mL/kg/hr in children); WARM all fluids to body temperature before administration to prevent hypothermia; 'fluid creep' (excessive resuscitation beyond Parkland estimates) is a recognized complication -- monitor for abdominal compartment syndrome (bladder pressure >25 mmHg, decreased urine output, elevated peak airway pressures); crystalloid is preferred over colloid in the first 24 hours because capillary leak allows protein solutions to leak into the interstitium"
      }
    ],
    pearls: [
      "The Parkland formula starts from TIME OF INJURY, not time of hospital arrival -- if a patient was burned 3 hours ago and arrives at the ED, the first 8-hour resuscitation window has already started and fluids must be given more rapidly to deliver the calculated volume within the remaining 5 hours",
      "Urine output is the GOLD STANDARD for monitoring burn resuscitation adequacy (0.5-1 mL/kg/hr adults) -- do NOT rely on blood pressure alone because tachycardia and vasoconstriction may maintain BP despite severe hypovolemia; urine output is the best real-time indicator of end-organ perfusion",
      "Full-thickness burns are INSENSATE (no pain) because nerve endings are destroyed -- paradoxically, the most severely burned areas may be the LEAST painful areas; surrounding partial-thickness burns are intensely painful because nerve endings are damaged but still functional",
      "NEVER include first-degree (superficial) burns in TBSA calculation -- only partial-thickness and full-thickness burns are counted; overestimating TBSA leads to excessive fluid resuscitation and increased complications (fluid creep, abdominal compartment syndrome, pulmonary edema)",
      "Early intubation is essential for suspected inhalation injury -- upper airway edema progresses over 12-24 hours and can make delayed intubation difficult or impossible; do not wait for overt respiratory distress; facial burns, singed nasal hairs, carbonaceous sputum, and hoarseness are warning signs requiring proactive airway management",
      "Circumferential full-thickness burns of extremities or chest can cause compartment syndrome -- the inelastic eschar acts as a tourniquet as tissue swelling increases beneath it; monitor distal pulses, sensation, and pain, and report changes immediately for emergent escharotomy",
      "In children, burns with patterns inconsistent with the reported mechanism of injury should raise concern for non-accidental trauma: immersion burns with clear stocking/glove demarcation lines, cigarette burns (small circular full-thickness burns), burns in non-exploratory locations, and multiple burns in various stages of healing"
    ],
    quiz: [
      {
        question: "A 70 kg adult is brought to the ED with 40% TBSA partial-thickness and full-thickness burns sustained 2 hours ago. Using the Parkland formula, what is the total volume of lactated Ringer's for the first 24 hours, and how much should be given in the first 8 hours from injury?",
        options: [
          "Total: 5,600 mL; First 8 hours: 2,800 mL",
          "Total: 11,200 mL; First 8 hours: 5,600 mL",
          "Total: 2,800 mL; First 8 hours: 1,400 mL",
          "Total: 11,200 mL; First 8 hours: 11,200 mL"
        ],
        correct: 1,
        rationale: "Parkland formula: 4 mL x 70 kg x 40% TBSA = 11,200 mL total over 24 hours. Half (5,600 mL) is given in the first 8 hours from TIME OF INJURY. Since the injury occurred 2 hours ago, the 5,600 mL must be infused over the remaining 6 hours of the first 8-hour window (not the full 8 hours). The remaining 5,600 mL is infused over the next 16 hours. The rate is titrated to urine output of 0.5-1 mL/kg/hr."
      },
      {
        question: "During burn wound assessment, the nurse notes an area that appears white, waxy, insensate to pinprick, and has a leathery texture that does not blanch with pressure. What depth of burn does this represent?",
        options: [
          "Superficial partial-thickness (superficial second-degree) burn",
          "Deep partial-thickness (deep second-degree) burn",
          "Full-thickness (third-degree) burn",
          "Superficial (first-degree) burn"
        ],
        correct: 2,
        rationale: "A white, waxy, insensate (painless), leathery burn wound that does not blanch with pressure is a full-thickness (third-degree) burn. All layers of the epidermis and dermis are destroyed, including nerve endings (hence insensate), blood vessels (hence no blanching), and all epithelial regenerative structures (hence the wound CANNOT heal without skin grafting). The leathery texture is the eschar -- necrotic, denatured dermal protein. This contrasts with superficial partial-thickness burns (blisters, moist, pink, painful, blanches) and deep partial-thickness burns (mottled pink/white, decreased sensation, sluggish blanching)."
      },
      {
        question: "A burn patient on resuscitation has a urine output of 15 mL/hour (patient weighs 80 kg). The nurse's assessment reveals tachycardia of 120 bpm and cool extremities. What should the nurse do?",
        options: [
          "Continue the current fluid rate and monitor -- these are expected findings in a burn patient",
          "Decrease the fluid rate because the urine output indicates adequate resuscitation",
          "Increase the IV fluid rate -- urine output of 0.19 mL/kg/hr is below the target of 0.5-1 mL/kg/hr indicating inadequate resuscitation",
          "Administer a vasopressor to increase blood pressure instead of increasing fluids"
        ],
        correct: 2,
        rationale: "The target urine output for adequate burn resuscitation is 0.5-1 mL/kg/hr. For an 80 kg patient, this means 40-80 mL/hour. The actual output of 15 mL/hour (0.19 mL/kg/hr) is significantly below target, indicating inadequate resuscitation. Combined with tachycardia (compensatory response to hypovolemia) and cool extremities (vasoconstriction from decreased cardiac output), this patient is under-resuscitated. The nurse should increase the IV fluid rate and notify the physician. Vasopressors should not replace volume resuscitation in burn shock -- fluids are the primary treatment."
      }
    ]
  },

  "carcinoid-syndrome-rn": {
    title: "Carcinoid Syndrome",
    cellular: {
      title: "Pathophysiology of Neuroendocrine Tumor Secretory Products and Systemic Effects",
      content: "Carcinoid syndrome is a clinical constellation of symptoms caused by the systemic release of vasoactive substances -- primarily serotonin (5-hydroxytryptamine/5-HT), histamine, kallikrein, prostaglandins, and tachykinins -- from neuroendocrine tumors (NETs, formerly called carcinoid tumors). Neuroendocrine tumors arise from enterochromaffin cells, which are part of the diffuse neuroendocrine system scattered throughout the gastrointestinal tract, bronchopulmonary system, and other organs. These cells normally produce and store serotonin and other bioactive amines in dense-core secretory granules. Serotonin synthesis begins with the essential amino acid tryptophan, which is hydroxylated by tryptophan hydroxylase to 5-hydroxytryptophan (5-HTP), then decarboxylated by aromatic L-amino acid decarboxylase (AADC) to serotonin (5-HT). In patients with large tumor burdens, carcinoid tumors can consume up to 60% of dietary tryptophan for serotonin synthesis, potentially causing tryptophan deficiency. Since tryptophan is also the precursor for niacin (vitamin B3) synthesis, tryptophan depletion can produce pellagra (the 4 Ds: dermatitis, diarrhea, dementia, and if untreated, death) -- this is an important but often overlooked complication of advanced carcinoid syndrome. A critical concept for understanding why carcinoid syndrome typically requires hepatic metastases is first-pass hepatic metabolism. Midgut carcinoid tumors (the most common type, arising in the ileum and appendix) drain via the portal venous system directly into the liver. When the tumor is confined to the GI tract without liver metastases, serotonin and other vasoactive substances released into the portal blood are efficiently metabolized by hepatic monoamine oxidase (MAO) and aldehyde dehydrogenase, converting serotonin to its inactive metabolite 5-hydroxyindoleacetic acid (5-HIAA) before it can reach the systemic circulation. Therefore, carcinoid syndrome rarely occurs with primary midgut tumors unless hepatic metastases are present (which bypass first-pass metabolism by releasing serotonin directly into the hepatic veins and systemic circulation) or unless the tumor drains outside the portal system. Exceptions include bronchial and ovarian carcinoid tumors, which drain directly into the systemic venous circulation (not through the portal system) and can cause carcinoid syndrome without liver metastases. The systemic effects of carcinoid syndrome are mediated by the tumor's secretory products acting on specific receptors throughout the body. Serotonin acting on 5-HT receptors in the intestinal wall stimulates intestinal motility and secretion, causing the secretory diarrhea that is the most common symptom (occurring in 70-80% of patients). The diarrhea is typically watery, non-bloody, and may be associated with abdominal cramping; it results from both increased motility (5-HT4 receptor stimulation on enteric neurons) and increased fluid and electrolyte secretion (5-HT3 receptor stimulation on enterocytes). Flushing is the second most common symptom (60-85%), caused by release of kallikrein (which generates vasodilatory bradykinin from kininogen), histamine, prostaglandins, and tachykinins (substance P and neurokinin A). Classic midgut carcinoid flushing is typically brief (1-5 minutes), affects the face and upper trunk, and produces a pink-to-red skin color. In contrast, foregut (bronchial, gastric) carcinoid flushing tends to be more prolonged and severe, with a purplish hue (histamine-mediated), and may be associated with lacrimation, rhinorrhea, and bronchospasm. Flushing episodes can be triggered by stress, alcohol, exercise, certain foods (tyramine-containing cheeses, chocolate), and specific medications (catecholamines, beta-blockers if administered without prior alpha-blockade in pheochromocytoma but relevant as flushing triggers in carcinoid). Carcinoid heart disease (Hedinger syndrome) is the most serious complication, occurring in approximately 50-60% of patients with carcinoid syndrome. Serotonin causes fibrotic thickening and retraction of the right-sided heart valves (tricuspid and pulmonary). The mechanism involves serotonin binding to 5-HT2B receptors on valvular interstitial cells, activating TGF-beta signaling pathways that stimulate myofibroblast proliferation, collagen deposition, and fibrous plaque formation on the endocardial surface of the valves. The right-sided predominance occurs because serotonin in the systemic venous blood reaches the right heart first and is then inactivated by monoamine oxidase in the pulmonary vasculature before reaching the left heart. The resulting valvular dysfunction typically causes tricuspid regurgitation (most common) and pulmonary stenosis, leading to right-sided heart failure (peripheral edema, hepatomegaly, ascites, elevated JVP). Left-sided valvular involvement is rare unless there is a patent foramen ovale (allowing serotonin to bypass pulmonary metabolism) or bronchial carcinoid (serotonin enters pulmonary veins directly). Bronchospasm occurs in approximately 10-20% of patients (primarily with foregut carcinoid tumors producing histamine) and can be severe. Standard beta-agonist bronchodilators should be used cautiously because beta-receptor stimulation may paradoxically worsen flushing and hypotension during carcinoid crisis. Carcinoid crisis is a life-threatening complication characterized by severe, prolonged flushing with profound hypotension, bronchospasm, tachycardia, and potentially cardiovascular collapse. It can be triggered by anesthesia, surgery (particularly tumor manipulation), embolization procedures, and catecholamine administration. Prevention and treatment of carcinoid crisis requires IV octreotide. Diagnosis relies on biochemical confirmation: 24-hour urinary 5-HIAA (5-hydroxyindoleacetic acid, the primary serotonin metabolite) is the gold standard biochemical test, with sensitivity of 70-75% and specificity of 95-100%. Plasma chromogranin A (CgA) is a general neuroendocrine tumor marker that correlates with tumor burden. Imaging with CT, MRI, and somatostatin receptor scintigraphy (OctreoScan) or gallium-68 DOTATATE PET/CT (more sensitive) identifies and stages the tumor and its metastases. Treatment combines tumor-directed therapy (surgical resection when feasible, hepatic-directed therapy for liver metastases) with symptom control using somatostatin analogs (octreotide, lanreotide), which are the cornerstone of carcinoid syndrome management."
    },
    riskFactors: [
      "Metastatic neuroendocrine tumors, particularly hepatic metastases from midgut primary tumors (carcinoid syndrome rarely occurs without liver metastases from GI primaries due to first-pass hepatic metabolism of serotonin)",
      "Foregut neuroendocrine tumors (bronchial, thymic, gastric -- can cause carcinoid syndrome without liver metastases because they drain directly into systemic, not portal, circulation)",
      "Large tumor burden (symptom severity correlates with total tumor volume and serotonin production capacity)",
      "Specific triggers for symptom exacerbation: alcohol, stress, exercise, tyramine-containing foods, catecholamines, certain medications",
      "Family history of multiple endocrine neoplasia type 1 (MEN1 -- associated with foregut carcinoid tumors, especially gastric and thymic)",
      "Chronic atrophic gastritis and pernicious anemia (associated with gastric carcinoid tumors through enterochromaffin-like cell hyperplasia driven by hypergastrinemia)",
      "Surgical manipulation or embolization of carcinoid tumors (can precipitate life-threatening carcinoid crisis from massive serotonin release)"
    ],
    diagnostics: [
      "24-hour urinary 5-HIAA (5-hydroxyindoleacetic acid -- the gold standard biochemical test; sensitivity 70-75%, specificity 95-100%; patient must avoid serotonin-rich foods for 3 days before and during collection: bananas, avocados, plums, tomatoes, walnuts, pineapples, eggplant, kiwi)",
      "Plasma chromogranin A (CgA -- non-specific neuroendocrine tumor marker that correlates with tumor burden; elevated in 60-80% of NETs; false positives with PPI use, renal impairment, atrophic gastritis, heart failure)",
      "CT abdomen and pelvis with contrast (identify primary tumor and liver metastases -- midgut carcinoids may be small and difficult to identify; mesenteric lymph node metastases with characteristic desmoplastic reaction and stellate mesenteric fibrosis)",
      "Gallium-68 DOTATATE PET/CT (most sensitive functional imaging for well-differentiated NETs expressing somatostatin receptors; superior to OctreoScan; identifies primary and metastatic disease)",
      "Echocardiography (screen for carcinoid heart disease -- assess tricuspid and pulmonary valve morphology and function; right-sided valvular thickening, retraction, and regurgitation; should be performed in all patients with carcinoid syndrome at diagnosis and periodically thereafter)",
      "Somatostatin receptor scintigraphy/OctreoScan (In-111 octreotide scan -- identifies somatostatin receptor-expressing tumors; being replaced by DOTATATE PET/CT in many centers)",
      "Serum serotonin level (less specific and less standardized than urinary 5-HIAA; affected by platelet handling during specimen processing)"
    ],
    management: [
      "Somatostatin analogs (octreotide LAR 20-30 mg IM monthly or lanreotide autogel 120 mg SC monthly) -- cornerstone of symptom control; also demonstrated antiproliferative effect in the PROMID and CLARINET trials",
      "Surgical resection of primary tumor and debulking of liver metastases when feasible (cytoreductive surgery can significantly reduce symptom burden even if complete resection is not possible)",
      "Hepatic-directed therapies for liver metastases (hepatic artery embolization, chemoembolization/TACE, radioembolization with Y-90 microspheres, radiofrequency ablation) -- reduce tumor burden and symptom severity",
      "Telotristat ethyl (Xermelo) 250 mg TID -- tryptophan hydroxylase inhibitor that reduces serotonin synthesis; approved for diarrhea inadequately controlled by somatostatin analogs alone",
      "Peptide receptor radionuclide therapy (PRRT) with Lu-177 DOTATATE (Lutathera) -- targeted radionuclide therapy for somatostatin receptor-positive metastatic NETs; significantly improved progression-free survival in the NETTER-1 trial",
      "Carcinoid crisis prevention: IV octreotide 250-500 mcg bolus before any surgical or interventional procedure; continuous octreotide infusion during and after surgery"
    ],
    nursingActions: [
      "Monitor for carcinoid syndrome symptoms: assess frequency and severity of flushing episodes (trigger, duration, distribution), diarrhea (frequency, volume, consistency), wheezing/bronchospasm, and right-sided heart failure signs (peripheral edema, JVD, hepatomegaly)",
      "Ensure dietary education for 24-hour urine 5-HIAA collection: patient must avoid serotonin-rich foods for 3 days before and during the collection (bananas, avocados, plums, tomatoes, walnuts, pineapples, eggplant, kiwi, chocolate) -- these foods can cause false positive results",
      "Administer somatostatin analogs per protocol: octreotide LAR IM injection technique (gluteal muscle, rotate sites), proper storage (refrigerate before use, bring to room temperature 30-60 minutes before injection), and monitoring for side effects (cholelithiasis, steatorrhea, hyperglycemia)",
      "Pre-operative preparation: ensure IV octreotide is ordered and available for any planned surgical or interventional procedure (carcinoid crisis prevention); have additional octreotide doses available for rescue during the procedure",
      "Monitor for carcinoid heart disease progression: assess for new or worsening right-sided heart failure (increasing peripheral edema, hepatomegaly, ascites, elevated JVP, new or changing murmur); coordinate echocardiography as ordered",
      "Assess nutritional status: chronic diarrhea and tryptophan diversion to serotonin synthesis can cause protein-calorie malnutrition, niacin deficiency (pellagra), fat-soluble vitamin deficiency, and dehydration",
      "Monitor for niacin deficiency (pellagra): dermatitis in sun-exposed areas (Casal necklace), diarrhea, cognitive changes -- report findings and administer niacin supplementation as prescribed",
      "Educate patients about symptom triggers: avoid alcohol, stress, strenuous exercise, and tyramine-containing foods; carry an emergency supply of subcutaneous octreotide for breakthrough flushing episodes"
    ],
    assessmentFindings: [
      "Episodic flushing (most distinctive symptom -- sudden onset erythema of face and upper trunk, typically lasting 1-5 minutes for midgut tumors; may be prolonged and purplish for foregut tumors)",
      "Secretory diarrhea (watery, non-bloody, often explosive, 3-30 episodes per day; may cause dehydration, electrolyte depletion, and malnutrition)",
      "Wheezing and bronchospasm (10-20%, more common with foregut tumors producing histamine; may mimic asthma)",
      "Right-sided heart murmurs (tricuspid regurgitation: pansystolic murmur at left lower sternal border increasing with inspiration; pulmonary stenosis: systolic ejection murmur at left upper sternal border)",
      "Signs of right-sided heart failure (peripheral edema, hepatomegaly, ascites, elevated JVP, exercise intolerance -- from carcinoid heart disease)",
      "Pellagra signs (dermatitis in sun-exposed areas with characteristic distribution, diarrhea, cognitive changes -- from tryptophan depletion by tumor serotonin synthesis)",
      "Hepatomegaly (from liver metastases and/or right-sided heart failure; may be palpable and tender)"
    ],
    signs: {
      left: [
        "Mild intermittent flushing triggered by specific foods",
        "Manageable diarrhea (3-5 episodes/day) controlled by octreotide",
        "Normal echocardiogram without valvular changes",
        "Low-grade elevation of urinary 5-HIAA",
        "Stable tumor burden on imaging"
      ],
      right: [
        "Carcinoid crisis (severe flushing, profound hypotension, bronchospasm, cardiovascular collapse -- medical emergency)",
        "Severe right-sided heart failure from carcinoid heart disease requiring valve replacement",
        "Severe refractory diarrhea causing dehydration and malnutrition",
        "Pellagra (dermatitis, diarrhea, dementia) from severe tryptophan depletion",
        "Small bowel obstruction from mesenteric fibrosis and tumor mass effect"
      ]
    },
    medications: [
      {
        name: "Octreotide (Sandostatin/Sandostatin LAR)",
        type: "Somatostatin analog (synthetic octapeptide)",
        action: "Binds to somatostatin receptors (primarily SSTR2 and SSTR5) on neuroendocrine tumor cells and normal tissues, inhibiting the release of serotonin, kallikrein, prostaglandins, tachykinins, and other vasoactive substances from tumor cells. Also has direct antiproliferative effects on tumor cells through inhibition of growth factor signaling, induction of apoptosis, and inhibition of angiogenesis. Reduces carcinoid syndrome symptoms (flushing in 50-80%, diarrhea in 60-80% of patients) and slows tumor growth (demonstrated in the PROMID trial with median time to progression increased from 6 to 14.3 months).",
        sideEffects: "Cholelithiasis (gallstones in 15-30% with long-term use due to decreased gallbladder motility and altered bile composition -- perform baseline gallbladder ultrasound and monitor), steatorrhea and malabsorption (reduced pancreatic enzyme and bile secretion), hyperglycemia (inhibits insulin secretion) or hypoglycemia (inhibits glucagon), injection site reactions (pain, nodules with LAR formulation), nausea, flatulence, abdominal cramping",
        contra: "Known hypersensitivity; use with caution in diabetes (unpredictable glucose effects); caution in patients with gallbladder disease; dose adjustment in hepatic impairment (for LAR formulation); may reduce cyclosporine absorption",
        pearl: "Two formulations: short-acting octreotide (SC/IV) 100-500 mcg 2-3 times daily for acute symptom control and breakthrough episodes; long-acting octreotide LAR 20-30 mg IM every 28 days for maintenance therapy. For carcinoid crisis prevention: 250-500 mcg IV bolus before procedures, with additional 250-500 mcg boluses available for rescue; some centers use continuous IV infusion at 50-100 mcg/hour during high-risk surgeries. LAR injection must be administered deep IM into the GLUTEAL muscle (not deltoid) using the provided needle (must reach the deep intramuscular tissue for proper drug depot formation); bring to room temperature 30-60 minutes before injection to reduce viscosity and pain; rotate injection sites between right and left gluteal areas"
      },
      {
        name: "Telotristat Ethyl (Xermelo)",
        type: "Tryptophan hydroxylase inhibitor (serotonin synthesis inhibitor)",
        action: "Inhibits tryptophan hydroxylase (TPH), the rate-limiting enzyme in serotonin biosynthesis, at the peripheral level within carcinoid tumor cells. By blocking the conversion of tryptophan to 5-hydroxytryptophan (the first step in serotonin synthesis), telotristat reduces serotonin production by the tumor and consequently reduces serotonin-mediated diarrhea. Approved specifically as add-on therapy for carcinoid syndrome diarrhea inadequately controlled by somatostatin analog therapy alone. In the TELESTAR trial, telotristat significantly reduced bowel movement frequency by an average of 1.7 fewer movements per day compared to placebo.",
        sideEffects: "Nausea (most common, 13%), headache, elevated liver enzymes (hepatotoxicity -- monitor LFTs every 2-3 months during treatment), peripheral edema, decreased appetite, flatulence, depression (serotonin synthesis inhibition may affect CNS serotonin levels despite limited BBB penetration)",
        contra: "Known hypersensitivity; use with caution in hepatic impairment (drug is hepatically metabolized); not recommended in patients with normal bowel function (risk of constipation)",
        pearl: "250 mg PO three times daily WITH FOOD (food increases bioavailability); approved as add-on therapy to somatostatin analogs, NOT as monotherapy; monitor LFTs at baseline and every 2-3 months during treatment; monitor for depression (report mood changes); reduces urinary 5-HIAA levels (expected effect, not an adverse reaction -- reflects reduced serotonin synthesis); may also reduce the risk of carcinoid heart disease progression by lowering serotonin exposure to heart valves, though this has not been definitively demonstrated in clinical trials"
      },
      {
        name: "Niacin (Vitamin B3/Nicotinamide)",
        type: "Water-soluble vitamin (niacin supplementation for pellagra prevention)",
        action: "Niacin is an essential B vitamin that serves as the precursor for nicotinamide adenine dinucleotide (NAD) and nicotinamide adenine dinucleotide phosphate (NADP), coenzymes essential for over 400 enzymatic reactions in energy metabolism, DNA repair, cell signaling, and antioxidant defense. The body normally synthesizes approximately 50% of its niacin from dietary tryptophan (60 mg tryptophan produces approximately 1 mg niacin via the kynurenine pathway). In carcinoid syndrome, tumors divert up to 60% of dietary tryptophan to serotonin synthesis, depleting tryptophan availability for niacin production and causing clinical or subclinical niacin deficiency (pellagra).",
        sideEffects: "Flushing (nicotinic acid form causes prostaglandin-mediated cutaneous vasodilation -- can be confused with carcinoid flushing; nicotinamide form does NOT cause flushing and is preferred), GI upset (nausea, diarrhea at high doses), hepatotoxicity (dose-dependent, primarily with sustained-release formulations at doses >2g/day), hyperglycemia and hyperuricemia (at pharmacological doses used for hyperlipidemia, not at supplementation doses)",
        contra: "Active hepatic disease or unexplained persistent elevations of hepatic transaminases (for pharmacological doses); active peptic ulcer disease; known hypersensitivity",
        pearl: "Use NICOTINAMIDE (niacinamide) rather than nicotinic acid to avoid flushing that could be confused with carcinoid flushing or could exacerbate symptoms; supplementation dose: 100-500 mg daily to prevent pellagra; all patients with carcinoid syndrome should be assessed for pellagra (dermatitis in sun-exposed areas with Casal necklace pattern, diarrhea, cognitive changes including confusion and memory impairment) and supplemented prophylactically; pellagra symptoms resolve with niacin repletion but may recur if supplementation is discontinued while serotonin overproduction continues"
      }
    ],
    pearls: [
      "Carcinoid syndrome from midgut tumors requires LIVER METASTASES to manifest because the liver's first-pass metabolism efficiently degrades serotonin before it reaches the systemic circulation; exceptions include bronchial and ovarian carcinoid tumors that drain directly into systemic veins",
      "24-hour urinary 5-HIAA is the gold standard for biochemical diagnosis, but patients MUST avoid serotonin-rich foods (bananas, avocados, plums, tomatoes, walnuts, pineapples, eggplant, kiwi, chocolate) for 3 days before and during collection to prevent false positive results",
      "Carcinoid heart disease affects predominantly RIGHT-sided valves (tricuspid regurgitation is most common) because serotonin in systemic venous blood reaches the right heart first and is then inactivated by MAO in the pulmonary vasculature before reaching the left heart -- left-sided involvement suggests patent foramen ovale or bronchial carcinoid",
      "IV octreotide (250-500 mcg bolus) must be available and administered BEFORE any surgical or interventional procedure in carcinoid syndrome patients to prevent carcinoid crisis -- a life-threatening event with severe flushing, bronchospasm, and cardiovascular collapse",
      "Pellagra (dermatitis, diarrhea, dementia) can complicate advanced carcinoid syndrome because tumors divert up to 60% of dietary tryptophan to serotonin synthesis, depleting niacin precursor availability -- prophylactic niacin (nicotinamide) supplementation is recommended for all patients",
      "Chromogranin A is a useful tumor marker that correlates with tumor burden, but has significant false positives: PPI use (most common cause of false elevation), renal impairment, atrophic gastritis, heart failure, and other neuroendocrine conditions -- always consider these confounders when interpreting results",
      "Octreotide LAR must be injected deep IM into the GLUTEAL muscle (not deltoid) for proper depot formation -- bring to room temperature 30-60 minutes before injection to reduce viscosity and injection site pain; cholelithiasis develops in 15-30% of patients on long-term therapy, requiring periodic gallbladder ultrasound"
    ],
    quiz: [
      {
        question: "A patient with a midgut carcinoid tumor confined to the ileum without liver metastases asks why they are not experiencing flushing or diarrhea. What is the best explanation?",
        options: [
          "Small intestinal tumors do not produce serotonin",
          "The tumor is too small to produce any vasoactive substances",
          "The liver metabolizes serotonin through first-pass metabolism before it reaches the systemic circulation, preventing carcinoid syndrome",
          "Carcinoid syndrome only occurs with tumors larger than 5 cm"
        ],
        correct: 2,
        rationale: "Midgut carcinoid tumors drain via the portal venous system directly into the liver. When the tumor is confined to the GI tract without liver metastases, serotonin and other vasoactive substances released by the tumor are efficiently metabolized by hepatic monoamine oxidase (MAO) during first-pass metabolism, converting serotonin to the inactive metabolite 5-HIAA before it can reach the systemic circulation. Carcinoid syndrome from midgut tumors therefore requires liver metastases (which release serotonin directly into the hepatic veins and systemic circulation, bypassing first-pass metabolism)."
      },
      {
        question: "A patient with carcinoid syndrome is scheduled for surgical debulking of liver metastases. Which pre-operative medication order is ESSENTIAL to prevent carcinoid crisis?",
        options: [
          "Prophylactic broad-spectrum antibiotics 1 hour before incision",
          "IV octreotide 250-500 mcg bolus before the procedure with additional doses available for rescue",
          "Oral dexamethasone 8 mg the morning of surgery for inflammation prevention",
          "IV diphenhydramine 50 mg for histamine blockade"
        ],
        correct: 1,
        rationale: "IV octreotide is ESSENTIAL before any surgical or interventional procedure in carcinoid syndrome patients to prevent carcinoid crisis. Tumor manipulation during surgery can trigger massive release of serotonin and other vasoactive substances, causing severe flushing, life-threatening hypotension, bronchospasm, and cardiovascular collapse. Pre-operative IV octreotide blocks the release of these substances from the tumor. Additional bolus doses should be immediately available during the procedure for rescue if hemodynamic instability or flushing develops."
      },
      {
        question: "Carcinoid heart disease primarily affects which heart valves, and why?",
        options: [
          "Left-sided valves (mitral and aortic) because the left heart receives the highest oxygen content blood",
          "All four valves equally because serotonin circulates throughout the entire cardiovascular system",
          "Right-sided valves (tricuspid and pulmonary) because serotonin reaches the right heart first and is inactivated by MAO in the pulmonary vasculature before reaching the left heart",
          "Right-sided valves because they are structurally weaker than left-sided valves"
        ],
        correct: 2,
        rationale: "Carcinoid heart disease predominantly affects right-sided valves (tricuspid and pulmonary) because serotonin from liver metastases enters the systemic venous circulation and reaches the right heart first, where it stimulates 5-HT2B receptors on valvular interstitial cells causing fibrotic plaque formation. The serotonin is then metabolized by monoamine oxidase (MAO) in the pulmonary vasculature before blood reaches the left heart, protecting the mitral and aortic valves. Left-sided involvement is rare and suggests patent foramen ovale or bronchial carcinoid."
      }
    ]
  }
};

let ok = 0, fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++; else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} failed`);
