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
  "npwt-basics-rpn": {
    title: "Negative Pressure Wound Therapy Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Wound Healing and Negative Pressure Therapy",
      content: "Wound healing is a complex, dynamic process that proceeds through four overlapping phases: hemostasis, inflammation, proliferation, and remodeling. During hemostasis, platelet aggregation and the coagulation cascade form a fibrin clot that stops bleeding and provides a temporary scaffold. The inflammatory phase begins within hours as neutrophils and macrophages migrate to the wound bed, removing bacteria and devitalized tissue through phagocytosis and releasing cytokines that recruit fibroblasts and endothelial cells. The proliferative phase involves granulation tissue formation, where fibroblasts synthesize collagen and extracellular matrix while new capillaries (angiogenesis) supply oxygen and nutrients. Epithelial cells migrate across the wound surface from the edges (epithelialization). The remodeling phase can last months to years as type III collagen is replaced by stronger type I collagen, though healed tissue only reaches approximately 80% of original tensile strength. Negative pressure wound therapy (NPWT) accelerates wound healing through several mechanisms. The VAC (Vacuum-Assisted Closure) system applies controlled subatmospheric pressure (typically 75 to 125 mmHg) to the wound bed through a sealed dressing connected to a suction device. This negative pressure removes excess exudate and infectious material, reduces edema by drawing interstitial fluid away from the wound, increases local blood flow by up to four times baseline (macrodeformation), and mechanically stimulates cell proliferation through microdeformation of wound bed cells. The foam or gauze filler material is cut to fit the wound dimensions, and an adhesive drape creates an airtight seal. The therapy can be delivered continuously or intermittently. Wound bed preparation is essential before NPWT application, requiring debridement of necrotic tissue and achievement of adequate hemostasis. The practical nurse plays a critical role in monitoring the NPWT system, documenting wound characteristics, and recognizing complications such as bleeding, infection, or loss of seal integrity. Understanding the physiology of wound healing enables the practical nurse to assess healing progress accurately and identify when the wound is not responding to therapy."
    },
    riskFactors: [
      "Diabetes mellitus (impaired microvascular circulation, neuropathy reducing protective sensation, hyperglycemia impairing leukocyte function)",
      "Peripheral vascular disease (reduced arterial blood flow compromises oxygen and nutrient delivery to wound bed)",
      "Malnutrition and protein deficiency (insufficient amino acids for collagen synthesis, impaired immune function)",
      "Immunosuppressive therapy including corticosteroids and chemotherapy (suppresses inflammatory and proliferative phases of healing)",
      "Smoking and tobacco use (nicotine causes vasoconstriction, carbon monoxide reduces oxygen-carrying capacity, impairs fibroblast proliferation)",
      "Advanced age (thinning dermis, decreased collagen production, reduced inflammatory response, slower cell turnover)",
      "Obesity (poor tissue perfusion to adipose tissue, increased wound tension, higher infection risk)"
    ],
    diagnostics: [
      "Wound culture and sensitivity: obtain specimen from viable tissue at wound base (not surface exudate) using Levine technique; identifies causative organisms and guides antibiotic selection",
      "Serum albumin and prealbumin: albumin below 3.0 g/dL indicates malnutrition that impairs wound healing; prealbumin (half-life 2-3 days) reflects more recent nutritional status than albumin (half-life 20 days)",
      "Complete blood count with differential: elevated WBC indicates infection; low hemoglobin impairs oxygen delivery to wound bed; monitor for anemia from chronic wound exudate loss",
      "Wound assessment documentation: measure length, width, and depth in centimeters; document tunneling and undermining using clock-face method; photograph wound with ruler for comparison",
      "Ankle-brachial index (ABI): ratio of ankle to brachial systolic blood pressure; ABI below 0.5 is a contraindication for NPWT due to insufficient arterial perfusion",
      "Serum glucose and HbA1c: hyperglycemia above 200 mg/dL significantly impairs wound healing; target HbA1c below 7% for optimal healing conditions"
    ],
    management: [
      "Apply NPWT foam or gauze filler cut to wound dimensions without overlapping wound edges; ensure filler contacts all wound surfaces for even pressure distribution",
      "Set negative pressure to prescribed level (typically 75-125 mmHg continuous for acute wounds, intermittent for chronic wounds); verify seal integrity by observing foam compression",
      "Change NPWT dressings every 48 to 72 hours for foam dressings, or per facility protocol; document wound bed appearance, exudate color and volume, and wound dimensions at each change",
      "Maintain adequate nutritional support with protein intake of 1.25 to 1.5 g/kg/day and caloric intake of 30 to 35 kcal/kg/day to support wound healing",
      "Administer prescribed antibiotics if wound infection is present; monitor for signs of systemic infection including fever, tachycardia, and elevated WBC",
      "Manage pain before, during, and after NPWT dressing changes; administer prescribed analgesics 30 minutes prior to dressing change",
      "Offload pressure from wound area using positioning, support surfaces, and turning schedules to prevent further tissue damage"
    ],
    nursingActions: [
      "Monitor NPWT canister output every shift: document color, volume, and consistency of exudate; report sudden increase in output or bright red drainage (hemorrhage risk)",
      "Check seal integrity every 2 to 4 hours by ensuring foam remains compressed and no hissing sounds indicate air leaks; troubleshoot leaks by reinforcing drape edges or reapplying seal",
      "Perform wound assessment at each dressing change using standardized wound measurement and documentation tools; compare findings to previous assessments to track healing trajectory",
      "Monitor for signs of wound infection: increased pain, erythema extending beyond wound margins, purulent drainage, wound base color change from red (healthy granulation) to yellow or black (slough/eschar), foul odor",
      "Ensure NPWT tubing is not kinked, clamped, or under the patient; secure tubing to prevent tension on the dressing and accidental dislodgement",
      "Educate patient and family on not disconnecting the NPWT unit without nursing assistance; instruct on recognizing alarm signals and when to call for help",
      "Report to the registered nurse or physician if wound healing is not progressing after 2 weeks of NPWT, or if wound deterioration is observed"
    ],
    assessmentFindings: [
      "Healthy granulation tissue: beefy red, moist, granular wound bed with visible capillary buds indicates adequate healing and good response to NPWT",
      "Wound exudate assessment: serous (clear, thin) is normal healing; serosanguineous (pink) may indicate mild tissue disruption; purulent (thick, yellow-green, malodorous) indicates infection",
      "Periwound skin assessment: maceration (white, soggy skin) from moisture exposure; erythema or induration extending beyond wound margins suggests spreading infection or contact dermatitis",
      "Pain assessment at wound site: increasing pain may indicate infection, tissue ischemia, or foam adherence to wound bed; sudden sharp pain during therapy may indicate hemorrhage",
      "Wound measurement trending: decreasing length, width, and depth over time indicates healing progression; static or increasing dimensions indicate treatment failure",
      "Nutritional status indicators: unintentional weight loss greater than 5% in 30 days, serum albumin below 3.0 g/dL, or prealbumin below 15 mg/dL suggest malnutrition impairing wound healing",
      "Signs of foam adherence or tissue ingrowth: pain with foam removal, tissue fragments on removed foam, and bleeding at wound base during dressing changes"
    ],
    signs: {
      left: [
        "Mild pain at wound site during NPWT therapy",
        "Serous or serosanguineous exudate in canister",
        "Slight periwound erythema within 1 cm of wound edge",
        "Slow but measurable reduction in wound dimensions over time",
        "Moderate exudate requiring canister change every 3 to 5 days",
        "Patient reports discomfort during position changes"
      ],
      right: [
        "Bright red blood in NPWT canister indicating hemorrhage (stop therapy, apply direct pressure, notify physician)",
        "Loss of seal with inability to restore negative pressure (wound exposure to air increases infection risk)",
        "Frank purulent drainage with foul odor and surrounding cellulitis (systemic infection risk)",
        "Sudden increase in wound pain with fever and tachycardia (sepsis screening required)",
        "Exposed blood vessels, organs, or anastomotic sites in wound bed (absolute contraindication for NPWT)",
        "Tissue necrosis or wound deterioration despite 2 weeks of NPWT therapy"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride) for Wound Irrigation",
        type: "Isotonic wound irrigation solution",
        action: "Provides a physiologically compatible, isotonic solution (308 mOsm/L) for wound cleansing that does not damage viable granulation tissue, fibroblasts, or newly formed epithelial cells; mechanically removes surface debris and bacteria through gentle irrigation pressure",
        sideEffects: "Minimal when used correctly; excessive irrigation pressure (above 15 psi) can drive bacteria into deeper tissues; large volumes in enclosed wounds can cause hypothermia",
        contra: "No absolute contraindications for wound irrigation; avoid high-pressure irrigation in wounds with exposed blood vessels or grafts",
        pearl: "Optimal irrigation pressure is 4 to 15 psi, achievable with a 35 mL syringe and 19-gauge angiocatheter; warm solution to body temperature before use to prevent vasoconstriction and patient discomfort; normal saline is preferred over antiseptic solutions for most wound irrigation because it does not impair healing"
      },
      {
        name: "Silver Sulfadiazine (Silvadene/Flamazine)",
        type: "Topical antimicrobial (sulfonamide with silver)",
        action: "Silver ions bind to bacterial DNA and cell membranes, disrupting protein synthesis and cell wall integrity; the sulfonamide component inhibits dihydropteroate synthetase in the folate synthesis pathway; provides broad-spectrum coverage against gram-positive organisms, gram-negative organisms, and Candida species",
        sideEffects: "Transient leukopenia (typically self-resolving within 2-3 days), burning sensation on application, skin discoloration (greyish), allergic contact dermatitis, delayed eschar separation",
        contra: "Sulfonamide allergy; pregnancy at term (risk of kernicterus); premature infants and neonates under 2 months (immature hepatic glucuronidation); glucose-6-phosphate dehydrogenase (G6PD) deficiency",
        pearl: "Apply 1/16 inch thick layer with sterile glove once or twice daily; monitor CBC weekly for leukopenia (WBC nadir typically occurs days 2-4 then recovers); the cream forms a pseudoeschar that should be gently removed before reapplication to assess wound bed underneath"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center (antipyretic effect) and modulating descending serotonergic inhibitory pain pathways; lacks significant peripheral anti-inflammatory activity unlike NSAIDs",
        sideEffects: "Hepatotoxicity at doses exceeding 4 g/day in healthy adults (lower threshold of 2 g/day in hepatic impairment or alcohol use); rare hypersensitivity reactions including Stevens-Johnson syndrome; acute overdose causes hepatic necrosis progressing through four clinical stages over 72 hours",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; caution with chronic alcohol use (3 or more drinks daily); check all combination products for hidden acetaminophen content",
        pearl: "First-line analgesic for mild to moderate wound pain; administer 30 minutes before NPWT dressing changes for procedural pain management; always calculate total daily acetaminophen from ALL sources including combination products (many cold and pain medications contain acetaminophen); N-acetylcysteine (NAC) is the antidote for acetaminophen overdose"
      }
    ],
    pearls: [
      "NPWT is CONTRAINDICATED in wounds with exposed blood vessels, anastomotic sites, unexplored fistulas, necrotic tissue with eschar, untreated osteomyelitis, or malignancy in the wound bed -- always verify wound appropriateness before initiating therapy",
      "The target negative pressure for most wounds is 75 to 125 mmHg; lower pressures (75 mmHg) may be used for painful wounds or newly placed grafts; higher pressures (up to 200 mmHg) may be used for highly exudative wounds",
      "Foam dressings (black polyurethane) promote granulation tissue formation while gauze dressings may be preferred for wounds with tunneling, undermining, or fragile tissue to allow more controlled tissue contact",
      "Always count the number of foam pieces placed into the wound and document this number clearly to prevent retained foreign body -- verify the same number is removed at the next dressing change",
      "NPWT dressing changes can be very painful; premedicate with prescribed analgesics 30 minutes before the procedure and consider instilling 1% lidocaine into the wound 15 to 20 minutes before foam removal if ordered",
      "A properly functioning NPWT system shows compressed foam under the transparent drape, no hissing sounds at seal edges, and consistent canister filling -- if the foam is not compressed, there is an air leak compromising therapy",
      "Wound healing requires adequate nutrition: protein intake of 1.25 to 1.5 g/kg/day, vitamin C (supports collagen synthesis), zinc (supports cell division and immune function), and adequate hydration are all essential for wound healing progression"
    ],
    quiz: [
      {
        question: "A practical nurse is monitoring a patient receiving negative pressure wound therapy. Which finding requires immediate intervention?",
        options: [
          "Serous exudate collecting in the canister",
          "Bright red blood rapidly filling the NPWT canister",
          "Mild discomfort during position changes",
          "Foam compressed under the transparent drape"
        ],
        correct: 1,
        rationale: "Bright red blood rapidly filling the NPWT canister indicates active hemorrhage, which is a medical emergency. The practical nurse must immediately clamp the tubing, turn off the suction, apply direct pressure to the wound, and notify the physician. Serous exudate and compressed foam are normal findings. Mild discomfort is expected but should be assessed and managed."
      },
      {
        question: "The practical nurse is preparing to assist with an NPWT dressing change. Which action is most important to perform before removing the foam dressing?",
        options: [
          "Turn the NPWT unit to maximum suction",
          "Verify the number of foam pieces documented from the previous dressing change",
          "Apply a new transparent drape over the existing dressing",
          "Discontinue the patient's IV fluids"
        ],
        correct: 1,
        rationale: "Verifying the number of foam pieces documented from the previous dressing change is essential to prevent retained foreign body in the wound. Each foam piece placed must be accounted for during removal. Retained foam can serve as a nidus for infection and impair wound healing. The unit should be turned off (not to maximum) before removal, and IV fluids are unrelated to the dressing change."
      },
      {
        question: "A patient on NPWT has a serum albumin level of 2.4 g/dL. The practical nurse recognizes this value most likely indicates which condition affecting wound healing?",
        options: [
          "Adequate nutritional status for wound healing",
          "Malnutrition with impaired protein availability for tissue repair",
          "Fluid overload requiring diuretic therapy",
          "Normal age-related albumin decline"
        ],
        correct: 1,
        rationale: "A serum albumin of 2.4 g/dL (normal 3.5-5.0 g/dL) indicates significant malnutrition. Albumin below 3.0 g/dL impairs wound healing because insufficient protein is available for collagen synthesis, immune cell function, and tissue repair. The practical nurse should report this finding and anticipate nutritional supplementation orders including increased protein intake."
      }
    ]
  },

  "nutritional-screening-rpn": {
    title: "Nutritional Screening Tools and Assessment for Practical Nurses",
    cellular: {
      title: "Physiology of Nutrition and Malnutrition Pathophysiology",
      content: "Nutrition is the process by which the body ingests, digests, absorbs, transports, utilizes, and excretes nutrients necessary for cellular metabolism, tissue repair, growth, and immune function. Macronutrients (carbohydrates, proteins, and fats) provide energy measured in kilocalories: carbohydrates yield 4 kcal/g and serve as the primary energy source; proteins yield 4 kcal/g and provide amino acids essential for tissue synthesis, enzyme production, and immune function; fats yield 9 kcal/g and are critical for cell membrane integrity, hormone synthesis, fat-soluble vitamin absorption (A, D, E, K), and insulation. Micronutrients (vitamins and minerals) serve as cofactors for enzymatic reactions, antioxidant defense, and structural components of tissues. Malnutrition develops when nutrient intake is insufficient to meet metabolic demands, resulting in progressive depletion of body stores. Protein-energy malnutrition manifests in two classic forms: marasmus (chronic caloric deficiency with severe muscle and fat wasting but preserved albumin levels) and kwashiorkor (acute protein deficiency with preserved fat stores, edema from low oncotic pressure, and hypoalbuminemia). In clinical practice, mixed forms are most common. Malnutrition impairs wound healing by reducing collagen synthesis, impairs immune function by decreasing lymphocyte proliferation and antibody production (increasing infection risk), causes muscle wasting including respiratory muscles (increasing pneumonia risk), and prolongs hospital stays. Validated nutritional screening tools provide systematic, evidence-based methods to identify patients at nutritional risk. The Mini Nutritional Assessment (MNA) was developed specifically for elderly populations and evaluates dietary intake, weight changes, mobility, psychological stress, neuropsychological problems, and body mass index. The Malnutrition Universal Screening Tool (MUST) uses three criteria: BMI, unplanned weight loss percentage, and acute disease effect. The Subjective Global Assessment (SGA) is a clinical assessment performed by trained clinicians that evaluates weight change history, dietary intake changes, gastrointestinal symptoms, functional capacity, and physical examination findings (subcutaneous fat loss, muscle wasting, edema). Early identification through screening allows timely nutritional intervention, which has been shown to reduce complications, shorten hospital length of stay, decrease readmission rates, and improve patient outcomes."
    },
    riskFactors: [
      "Advanced age over 65 years (decreased appetite, altered taste and smell, reduced gastric acid secretion, polypharmacy affecting nutrient absorption)",
      "Chronic disease states including cancer, COPD, heart failure, and chronic kidney disease (increased metabolic demands, catabolic state, anorexia)",
      "Recent surgery or critical illness (hypermetabolic state increasing protein and caloric requirements by 1.5 to 2 times baseline)",
      "Dysphagia from stroke, neurological disease, or head and neck conditions (impaired ability to safely swallow food and liquids)",
      "Social isolation and depression (decreased motivation to prepare and consume meals, anorexia of depression)",
      "Poverty and food insecurity (inability to purchase adequate nutritious food consistently)",
      "Substance use disorders including alcohol use disorder (displaces nutritious food intake, impairs absorption of thiamine, folate, and other B vitamins)"
    ],
    diagnostics: [
      "Serum albumin: normal 3.5-5.0 g/dL; half-life 20 days; levels below 3.0 g/dL indicate chronic protein depletion; affected by inflammation, liver disease, and fluid status (not ideal for acute changes)",
      "Serum prealbumin (transthyretin): normal 15-36 mg/dL; half-life 2-3 days; more sensitive indicator of recent nutritional changes and response to nutritional intervention; below 10 mg/dL indicates severe depletion",
      "Body mass index (BMI) calculation: weight (kg) divided by height (m) squared; underweight below 18.5, normal 18.5-24.9, overweight 25-29.9, obese 30 or above; does not distinguish muscle from fat mass",
      "Mini Nutritional Assessment (MNA): 18-item tool for elderly; score 24-30 normal, 17-23.5 at risk of malnutrition, below 17 malnourished; includes dietary, anthropometric, and general assessment components",
      "Malnutrition Universal Screening Tool (MUST): 5-step screening using BMI score (0-2), weight loss score (0-2), and acute disease effect (0-2); total 0 = low risk, 1 = medium risk, 2 or more = high risk",
      "Subjective Global Assessment (SGA): clinician-performed assessment rating patients as SGA-A (well nourished), SGA-B (moderately malnourished or suspected malnutrition), or SGA-C (severely malnourished)"
    ],
    management: [
      "Calculate individualized caloric needs based on condition: baseline 25-30 kcal/kg/day for maintenance, 30-35 kcal/kg/day for wound healing or stress, adjusted for activity level and metabolic state",
      "Ensure protein intake of 0.8 g/kg/day for maintenance, increasing to 1.2-1.5 g/kg/day for wound healing, pressure injuries, or catabolic states; consider renal function when increasing protein",
      "Provide oral nutritional supplements (ONS) between meals for patients unable to meet caloric needs through regular diet; offer high-calorie, high-protein supplements 2 to 3 times daily",
      "Implement dietary modifications as needed: pureed, minced, or soft diet for dysphagia; thickened fluids per speech-language pathology assessment; small frequent meals for anorexia or early satiety",
      "Initiate dietitian referral for comprehensive nutritional assessment and individualized meal planning for all patients identified as moderate or high nutritional risk",
      "Monitor daily weights at same time, same clothing, same scale to accurately track nutritional status; report weight loss greater than 2% in 1 week or 5% in 1 month",
      "Address modifiable contributing factors: treat nausea, manage pain, optimize dentition, provide adaptive utensils, ensure adequate time for meals, create pleasant dining environment"
    ],
    nursingActions: [
      "Perform nutritional screening on all patients within 24 hours of admission using the facility-approved screening tool (MNA, MUST, or SGA) and document results",
      "Monitor and accurately record dietary intake at each meal using percentage consumed (100%, 75%, 50%, 25%, 0%) and report intake below 50% for two or more consecutive meals",
      "Weigh patients on admission and then weekly (or more frequently if ordered) using the same scale, same time of day, and similar clothing for consistency",
      "Position patient upright at 90 degrees during meals and for 30 minutes after eating to reduce aspiration risk; ensure dentures are in place and oral care is completed before meals",
      "Monitor for clinical signs of malnutrition: temporal wasting, hollow cheeks, prominent clavicles and ribs, decreased subcutaneous fat, muscle wasting especially in thenar eminence and interosseous muscles",
      "Reinforce dietary teaching as delegated: importance of adequate protein, fluid intake recommendations, foods high in specific nutrients needed, and timing of supplements between meals",
      "Report to the registered nurse any patient with unintentional weight loss greater than 5% in 30 days, BMI below 18.5, serum albumin below 3.0 g/dL, or consistently poor oral intake"
    ],
    assessmentFindings: [
      "Anthropometric indicators: unintentional weight loss greater than 10% in 6 months indicates severe malnutrition; mid-arm muscle circumference below 5th percentile indicates significant muscle wasting",
      "Physical examination findings of protein depletion: edema (pedal, sacral, periorbital from decreased plasma oncotic pressure), poor wound healing, brittle nails, thinning hair, muscle wasting",
      "Physical examination findings of specific deficiencies: angular cheilitis and glossitis (B vitamin deficiency), petechiae and bleeding gums (vitamin C deficiency), night blindness (vitamin A deficiency)",
      "Functional decline indicators: decreased grip strength, inability to rise from chair without arm support, reduced mobility, increased fatigue with activities of daily living",
      "Oral assessment findings affecting intake: poor dentition, ill-fitting dentures, oral candidiasis (thrush), xerostomia (dry mouth from medications or radiation), mucositis",
      "Gastrointestinal symptoms affecting nutrition: nausea, vomiting, diarrhea, constipation, abdominal pain, early satiety, dysphagia, changes in taste or smell"
    ],
    signs: {
      left: [
        "Mild decrease in appetite or food intake lasting several days",
        "Unintentional weight loss of 1 to 2% over one month",
        "Mild fatigue with usual activities",
        "Dry skin and brittle nails",
        "Reduced interest in meal preparation or dining",
        "BMI between 18.5 and 20 (low-normal range)"
      ],
      right: [
        "Severe unintentional weight loss greater than 10% in 6 months (severe malnutrition)",
        "Significant peripheral edema from hypoalbuminemia (albumin below 2.0 g/dL)",
        "Cachexia with visible muscle wasting and temporal hollowing",
        "Refeeding syndrome (electrolyte shifts when malnourished patient resumes feeding: hypophosphatemia, hypokalemia, hypomagnesemia causing cardiac dysrhythmias)",
        "Aspiration pneumonia from dysphagia with unsafe swallowing",
        "Immunosuppression with recurrent infections from severe protein depletion"
      ]
    },
    medications: [
      {
        name: "Oral Nutritional Supplement (Ensure/Boost/Resource)",
        type: "Complete nutritional supplement",
        action: "Provides a balanced, ready-to-consume liquid supplement containing macronutrients (protein 9-20 g, carbohydrates 30-45 g, fat 6-11 g per 237 mL serving) and micronutrients (25-100% of daily recommended intake of essential vitamins and minerals) to supplement insufficient oral dietary intake",
        sideEffects: "Bloating, early satiety if consumed too close to meals (reduces meal intake), diarrhea (especially in lactose-intolerant patients or with hyperosmolar formulations), hyperglycemia in diabetic patients from carbohydrate content",
        contra: "Galactosemia; severe cow milk protein allergy (most formulations are milk-based); complete bowel obstruction; use with caution in diabetes (choose diabetic-specific low-carbohydrate formulations)",
        pearl: "Administer supplements BETWEEN meals (not with meals) to prevent replacement of regular food intake; serve chilled for better palatability; standard formulations provide 1.0 kcal/mL while concentrated versions provide 1.5-2.0 kcal/mL for fluid-restricted patients; high-protein versions are preferred for wound healing"
      },
      {
        name: "Thiamine (Vitamin B1)",
        type: "Water-soluble vitamin supplement",
        action: "Serves as an essential coenzyme (thiamine pyrophosphate) for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase in carbohydrate metabolism (citric acid cycle); critical for aerobic energy production, neural function, and myocardial contractility; deficiency impairs glucose utilization by neurons and cardiac muscle",
        sideEffects: "Generally well tolerated; rare anaphylaxis with IV administration (more common with rapid injection); mild GI discomfort with oral formulation; warmth or flushing sensation with parenteral administration",
        contra: "Known hypersensitivity to thiamine (extremely rare); no significant drug interactions; administer IV thiamine BEFORE glucose in malnourished patients to prevent precipitating Wernicke encephalopathy",
        pearl: "CRITICAL: In suspected malnutrition or alcohol use disorder, always administer thiamine BEFORE or WITH glucose -- glucose administration without thiamine in a thiamine-depleted patient can precipitate acute Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia), which can progress to irreversible Korsakoff syndrome (permanent anterograde amnesia and confabulation)"
      },
      {
        name: "Multivitamin with Minerals (Daily Multivitamin)",
        type: "Combination vitamin and mineral supplement",
        action: "Provides daily recommended amounts of essential vitamins (A, B-complex, C, D, E, K) and minerals (iron, zinc, selenium, copper, manganese) that serve as cofactors for hundreds of enzymatic reactions including collagen synthesis (vitamin C), bone metabolism (vitamin D and calcium), antioxidant defense (vitamins C, E, and selenium), coagulation (vitamin K), and immune function (zinc, vitamin D, vitamin A)",
        sideEffects: "GI upset (nausea, constipation, metallic taste) most commonly from iron content; dark-colored stools (iron); hypervitaminosis risk with fat-soluble vitamins (A, D, E, K) if taken in excess of recommended doses",
        contra: "Hemochromatosis or iron overload states (formulations containing iron); hypercalcemia (formulations with calcium and vitamin D); Wilson disease (formulations with copper); concurrent individual vitamin supplementation (risk of toxicity from combined dosing)",
        pearl: "Take with food to reduce GI side effects and enhance absorption of fat-soluble vitamins; separate from calcium-containing supplements, antacids, and tetracycline antibiotics by 2 hours (impaired absorption); iron in multivitamins can interfere with levothyroxine and fluoroquinolone absorption -- space these medications 4 hours apart"
      }
    ],
    pearls: [
      "All patients should be screened for nutritional risk within 24 hours of hospital admission using a validated screening tool -- early identification of malnutrition allows timely intervention that reduces complications and length of stay",
      "The MUST tool is a rapid 5-step screening that can be completed in under 5 minutes: Step 1 BMI score, Step 2 unplanned weight loss score, Step 3 acute disease effect, Step 4 add scores for overall risk, Step 5 develop care plan based on risk level",
      "Serum albumin is affected by inflammation (negative acute-phase reactant decreases during infection/surgery), liver disease, and fluid status -- it should NOT be used as the sole indicator of nutritional status; prealbumin with its 2-3 day half-life is more responsive to nutritional changes",
      "REFEEDING SYNDROME is a life-threatening complication when malnourished patients resume feeding too rapidly: insulin surge drives phosphorus, potassium, and magnesium intracellularly causing dangerous electrolyte depletion and potential cardiac arrest -- start feeding at 10-20 kcal/kg/day and advance slowly",
      "Monitor phosphorus, potassium, and magnesium levels daily for the first 3 to 5 days when initiating feeding in severely malnourished patients; replace electrolytes before and during refeeding as needed",
      "Always administer thiamine BEFORE glucose in malnourished patients or those with alcohol use disorder -- glucose without thiamine can precipitate Wernicke encephalopathy (acute neurological emergency with confusion, ataxia, and ophthalmoplegia)",
      "Document nutritional intake using the percentage method (0%, 25%, 50%, 75%, 100%) at each meal and report intake consistently below 50% to the registered nurse for dietary consultation and potential supplementation"
    ],
    quiz: [
      {
        question: "A practical nurse is performing nutritional screening on a newly admitted 78-year-old patient. Which screening tool was specifically developed for use with elderly populations?",
        options: [
          "Glasgow Coma Scale (GCS)",
          "Mini Nutritional Assessment (MNA)",
          "Braden Scale",
          "Norton Scale"
        ],
        correct: 1,
        rationale: "The Mini Nutritional Assessment (MNA) was specifically developed and validated for use with elderly populations aged 65 and older. It evaluates dietary intake, weight changes, mobility, psychological stress, neuropsychological problems, and BMI. The Glasgow Coma Scale measures level of consciousness, while the Braden and Norton scales assess pressure injury risk."
      },
      {
        question: "A malnourished patient is being started on nutritional supplementation. The practical nurse should monitor most closely for which life-threatening complication?",
        options: [
          "Hypernatremia from excess sodium intake",
          "Refeeding syndrome with severe hypophosphatemia",
          "Vitamin A toxicity from supplementation",
          "Hyperproteinemia from oral supplements"
        ],
        correct: 1,
        rationale: "Refeeding syndrome occurs when severely malnourished patients resume feeding too rapidly. The insulin surge from carbohydrate intake drives phosphorus, potassium, and magnesium intracellularly, causing dangerous depletion of these electrolytes. Severe hypophosphatemia can cause respiratory failure, cardiac dysrhythmias, and death. Feeding should be initiated slowly at 10-20 kcal/kg/day."
      },
      {
        question: "A patient has a serum prealbumin of 8 mg/dL (normal 15-36 mg/dL). The practical nurse interprets this result as indicating which condition?",
        options: [
          "Normal nutritional status requiring no intervention",
          "Mild dehydration requiring increased oral fluids",
          "Severe nutritional depletion requiring urgent intervention",
          "Normal age-related protein changes"
        ],
        correct: 2,
        rationale: "A serum prealbumin of 8 mg/dL is significantly below normal (15-36 mg/dL) and below the severe depletion threshold of 10 mg/dL. Prealbumin has a short half-life of 2-3 days, making it a sensitive marker of recent nutritional status. This result indicates severe protein-calorie malnutrition requiring urgent nutritional intervention including dietitian consultation and likely oral or enteral supplementation."
      }
    ]
  },

  "nutrition-elderly-rpn": {
    title: "Nutrition in the Elderly for Practical Nurses",
    cellular: {
      title: "Age-Related Physiological Changes Affecting Nutrition",
      content: "Aging produces significant physiological changes across multiple organ systems that directly impact nutritional status, dietary requirements, and the ability to maintain adequate nutritional intake. In the gastrointestinal system, gastric acid secretion decreases (hypochlorhydria and achlorhydria) beginning around age 50, reducing the absorption of iron, calcium, vitamin B12, and folate. Decreased intrinsic factor production further impairs vitamin B12 absorption, placing elderly individuals at risk for megaloblastic anemia and neurological complications (peripheral neuropathy, dementia-like symptoms). Gastric emptying slows, contributing to early satiety and reduced food intake. Intestinal motility decreases, increasing constipation risk, while the intestinal mucosal surface area decreases, reducing overall absorptive capacity. The liver decreases in size and blood flow by approximately 30 to 40% after age 65, affecting first-pass metabolism of medications and synthesis of albumin and other proteins. Hepatic cytochrome P450 enzyme activity declines, prolonging the half-life of many medications and increasing drug interaction risks. In the renal system, glomerular filtration rate (GFR) decreases approximately 1 mL/min/year after age 40, reducing the kidney's ability to concentrate urine and conserve sodium, increasing dehydration risk. The thirst mechanism becomes blunted with age, meaning elderly individuals may not feel thirsty despite significant fluid deficits. Sarcopenia (age-related loss of skeletal muscle mass and function) begins around age 30 and accelerates after age 60, with muscle mass decreasing by approximately 3 to 8% per decade. This muscle loss reduces basal metabolic rate, decreases functional capacity, impairs balance (increasing fall risk), and reduces protein reserves available during illness or stress. Sensory changes significantly impact food intake: taste bud density decreases by approximately 50% by age 70, particularly for salt and sweet detection; olfactory function declines, reducing appetite since much of taste perception depends on smell; visual changes may make food preparation more difficult and reduce the appeal of meals. These combined physiological changes create a state of increased vulnerability to malnutrition, dehydration, and micronutrient deficiencies that the practical nurse must actively monitor and address through systematic assessment and targeted interventions."
    },
    riskFactors: [
      "Polypharmacy (5 or more medications) causing drug-nutrient interactions, altered taste, dry mouth, nausea, constipation, or appetite suppression",
      "Social isolation and living alone (reduced motivation to prepare meals, lack of social dining stimulation, depression-related anorexia)",
      "Impaired dentition (missing teeth, ill-fitting dentures, periodontal disease) making chewing painful and limiting food variety",
      "Cognitive impairment including dementia (forgetting to eat, inability to prepare meals, difficulty using utensils, pocketing food in cheeks)",
      "Decreased mobility and functional limitations (difficulty shopping, preparing food, feeding self, opening packaging)",
      "Fixed income and poverty (inability to afford nutritious food, choosing between medications and food)",
      "Chronic disease burden including diabetes, heart failure, COPD, and chronic kidney disease (increased metabolic demands, dietary restrictions reducing food choices, disease-related anorexia)"
    ],
    diagnostics: [
      "Serum albumin and prealbumin: albumin below 3.5 g/dL suggests chronic protein depletion; prealbumin below 15 mg/dL reflects recent nutritional decline; interpret cautiously in the presence of inflammation (albumin is a negative acute-phase reactant)",
      "Complete blood count: microcytic anemia (low MCV) suggests iron deficiency; macrocytic anemia (high MCV) suggests B12 or folate deficiency; both are common in elderly with poor dietary intake",
      "Serum vitamin B12 and folate levels: B12 deficiency is common in elderly due to decreased intrinsic factor and gastric acid; levels below 200 pg/mL require supplementation to prevent neurological damage",
      "25-hydroxyvitamin D level: below 30 ng/mL indicates insufficiency; below 20 ng/mL indicates deficiency; elderly are at high risk due to decreased sun exposure, impaired skin synthesis, and reduced dietary intake",
      "Basic metabolic panel including BUN, creatinine, and electrolytes: evaluate renal function and hydration status; BUN/creatinine ratio above 20:1 may indicate dehydration",
      "Mini Nutritional Assessment (MNA): validated specifically for elderly populations; total score below 17 indicates malnutrition, 17-23.5 indicates at risk of malnutrition, 24-30 indicates normal nutritional status"
    ],
    management: [
      "Implement dietary modifications for dysphagia as directed by speech-language pathology: International Dysphagia Diet Standardisation Initiative (IDDSI) levels range from 0 (thin liquids) to 7 (regular); modify texture and fluid consistency per assessment",
      "Provide small, frequent meals (5 to 6 per day) rather than 3 large meals to address early satiety and reduced appetite; offer nutrient-dense foods first before less nutritious items",
      "Ensure adequate protein intake of 1.0 to 1.2 g/kg/day for healthy elderly (higher than younger adults) to counteract sarcopenia; increase to 1.2-1.5 g/kg/day during acute illness or wound healing",
      "Maintain hydration with a minimum fluid intake of 1500 mL/day (or 30 mL/kg/day) unless fluid-restricted; offer fluids frequently as the elderly thirst mechanism is blunted",
      "Supplement calcium (1200 mg/day for adults over 50) and vitamin D (800-1000 IU/day) to prevent osteoporosis; obtain through dietary sources and supplements combined",
      "Address modifiable barriers: ensure dentures fit properly, provide adaptive utensils for arthritis or tremor, create a pleasant dining environment, allow adequate time for meals",
      "Refer to community resources as appropriate: Meals on Wheels, congregate dining programs, food banks, transportation assistance for grocery shopping"
    ],
    nursingActions: [
      "Perform nutritional screening using MNA within 24 hours of admission for all patients aged 65 and older; reassess weekly during hospitalization and at each clinic or home visit",
      "Record accurate daily weights at the same time using the same scale; report unintentional weight loss greater than 5% in 1 month or 10% in 6 months as these indicate clinically significant malnutrition",
      "Document dietary intake using percentage method at each meal; report intake consistently below 50% for 3 or more consecutive days to the registered nurse for dietitian consultation",
      "Assess swallowing ability before offering food or liquids: observe for coughing, throat clearing, wet or gurgling voice quality, pocketing food, or nasal regurgitation during eating; report any swallowing concerns for speech-language pathology evaluation",
      "Position patient upright at 90 degrees during meals and maintain upright position for at least 30 minutes after eating to reduce aspiration risk",
      "Monitor for signs of dehydration: decreased skin turgor (test on forehead or sternum in elderly as forearm turgor is unreliable), dry mucous membranes, concentrated urine, orthostatic hypotension, confusion, elevated BUN/creatinine ratio",
      "Provide oral care before meals to enhance taste perception and appetite; assist with denture placement and ensure they fit properly; address oral pain or lesions that may impair eating"
    ],
    assessmentFindings: [
      "Weight changes: unintentional weight loss greater than 5% in 1 month or 10% in 6 months indicates clinically significant malnutrition requiring intervention",
      "Physical signs of protein-calorie malnutrition: temporal wasting, hollow cheeks, prominent bony landmarks (clavicles, ribs, scapulae), loss of subcutaneous fat on dorsum of hands, muscle wasting in thenar eminence",
      "Dehydration signs in elderly: confusion or acute change in mental status (may be the earliest and most sensitive sign), dry mucous membranes, sunken eyes, decreased urine output, concentrated dark urine, orthostatic hypotension",
      "Oral assessment findings: poor dentition with caries or missing teeth, ill-fitting dentures causing mucosal ulceration, oral candidiasis (white patches on tongue or buccal mucosa), xerostomia (dry mouth)",
      "Skin and hair changes: dry flaky skin, easily bruising skin (vitamin C or K deficiency), poor wound healing, hair loss or thinning, brittle splitting nails (protein and iron deficiency)",
      "Functional assessment: grip strength (measured by dynamometry) is a validated indicator of muscle mass and nutritional status; decreased grip strength correlates with increased mortality in elderly",
      "Cognitive screening: confusion, apathy, or depression may both cause and result from malnutrition; vitamin B12 deficiency can cause reversible cognitive impairment mimicking dementia"
    ],
    signs: {
      left: [
        "Mild decrease in appetite over several weeks",
        "Weight loss of 1 to 2 kg over 3 months",
        "Occasional skipping of meals",
        "Preference for soft or easy-to-prepare foods over balanced meals",
        "Mild fatigue with usual daily activities",
        "Slight decrease in functional ability for meal preparation"
      ],
      right: [
        "Severe cachexia with visible muscle wasting and BMI below 16 (life-threatening malnutrition)",
        "Acute dehydration with confusion, tachycardia, hypotension, and oliguria (requires immediate IV fluid resuscitation)",
        "Refeeding syndrome upon nutritional replenishment (dangerous hypophosphatemia, hypokalemia, hypomagnesemia causing cardiac arrest)",
        "Aspiration pneumonia from unrecognized dysphagia (fever, productive cough, new infiltrate on chest X-ray)",
        "Severe B12 deficiency with subacute combined degeneration of spinal cord (irreversible if untreated)",
        "Wernicke encephalopathy from thiamine deficiency (confusion, ataxia, ophthalmoplegia -- medical emergency)"
      ]
    },
    medications: [
      {
        name: "Calcium Carbonate with Vitamin D (Caltrate D/Os-Cal D)",
        type: "Mineral supplement with fat-soluble vitamin",
        action: "Calcium carbonate provides elemental calcium (40% by weight) that is absorbed primarily in the duodenum and proximal jejunum in the presence of gastric acid; vitamin D3 (cholecalciferol) enhances intestinal calcium absorption by stimulating synthesis of calcium-binding protein (calbindin) in enterocytes and promotes renal calcium reabsorption and bone mineralization through osteoblast activation",
        sideEffects: "Constipation (most common, manage with increased fiber and fluids), bloating, gas, hypercalcemia with excessive intake (nausea, polyuria, confusion, renal stones), milk-alkali syndrome with very high doses",
        contra: "Hypercalcemia, hypercalciuria, renal calculi (calcium stones), severe renal impairment, hyperparathyroidism; caution with concurrent digoxin use (hypercalcemia potentiates digoxin toxicity)",
        pearl: "Calcium carbonate requires gastric acid for absorption so take WITH meals; patients on proton pump inhibitors may absorb calcium carbonate poorly (consider calcium citrate instead which does not require acid); do NOT exceed 500-600 mg elemental calcium per dose as absorption decreases with larger doses; separate from levothyroxine, tetracyclines, and fluoroquinolones by at least 2-4 hours"
      },
      {
        name: "Oral Rehydration Solution (Pedialyte/Hydralyte)",
        type: "Electrolyte and fluid replacement solution",
        action: "Provides water, glucose, sodium, potassium, and chloride in precise concentrations that optimize intestinal absorption through the sodium-glucose cotransport mechanism (SGLT1); glucose presence is essential because it drives sodium and water absorption across the intestinal epithelium even during diarrheal illness when other transport mechanisms are impaired",
        sideEffects: "Nausea or vomiting if consumed too rapidly; hypernatremia if used as sole fluid source without additional free water; hyperglycemia in diabetic patients; unpleasant taste may reduce compliance",
        contra: "Complete intestinal obstruction; severe vomiting precluding oral intake (use IV rehydration); severe hypernatremia; renal failure with anuria (unable to excrete electrolyte load)",
        pearl: "Offer small frequent sips (5-15 mL every 5 minutes) rather than large volumes to reduce vomiting; ORS is preferred over plain water, juice, or sports drinks for dehydration because the precise sodium-glucose ratio optimizes absorption; in elderly patients with mild to moderate dehydration, oral rehydration is preferred over IV fluids when the patient can tolerate oral intake"
      },
      {
        name: "Megestrol Acetate (Megace)",
        type: "Progestational agent (appetite stimulant)",
        action: "Stimulates appetite through mechanisms that are not fully understood but likely involve modulation of neuropeptide Y activity in the hypothalamus, stimulation of cytokine production (interleukin-1), and direct effects on metabolic pathways; increases food intake and promotes weight gain primarily through fat deposition rather than lean muscle mass",
        sideEffects: "Deep vein thrombosis and pulmonary embolism (most serious risk), adrenal insufficiency with prolonged use (suppresses HPA axis), hyperglycemia, fluid retention and edema, breakthrough uterine bleeding",
        contra: "Known or suspected pregnancy (teratogenic); active thromboembolic disease or history of thromboembolism; concurrent use with dofetilide (increased dofetilide levels causing QT prolongation)",
        pearl: "Reserve for patients with significant anorexia and weight loss when other interventions have failed; weight gain is primarily fat rather than muscle so combine with resistance exercise when possible; taper slowly after prolonged use to prevent adrenal crisis from HPA axis suppression; monitor blood glucose closely as hyperglycemia is common; usually reserved for palliative or cancer-related cachexia"
      }
    ],
    pearls: [
      "Skin turgor testing on the forearm is UNRELIABLE in elderly patients due to age-related loss of skin elasticity -- assess turgor on the forehead or sternum instead for accurate dehydration assessment",
      "The elderly thirst mechanism is blunted: patients may not report feeling thirsty despite significant fluid deficits -- offer fluids proactively and regularly rather than waiting for the patient to request them",
      "Vitamin B12 deficiency in the elderly is often caused by decreased intrinsic factor and gastric acid rather than dietary insufficiency -- oral supplementation at high doses (1000-2000 mcg/day) or intramuscular injection may be needed since standard dietary intake cannot compensate for absorption impairment",
      "Calcium carbonate requires gastric acid for absorption -- elderly patients on proton pump inhibitors should take calcium citrate instead, which is absorbed independently of gastric pH",
      "Dysphagia screening must be performed before offering ANY food or fluids to stroke patients or patients with known neurological conditions -- aspiration pneumonia is a leading cause of death in elderly patients with swallowing dysfunction",
      "The MNA (Mini Nutritional Assessment) is the recommended screening tool for elderly patients: a score below 17 indicates established malnutrition requiring urgent nutritional intervention, 17-23.5 indicates risk of malnutrition requiring monitoring and potential supplementation",
      "Confusion or acute change in mental status in an elderly patient may be the EARLIEST sign of dehydration -- always assess hydration status when evaluating new-onset confusion in the elderly before attributing changes to other causes"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing hydration status in an 82-year-old patient. Which assessment technique is most reliable for evaluating skin turgor in this age group?",
        options: [
          "Pinching the skin on the dorsum of the hand",
          "Pinching the skin on the forearm",
          "Pinching the skin on the forehead or sternum",
          "Observing the elasticity of the skin on the lower leg"
        ],
        correct: 2,
        rationale: "In elderly patients, skin turgor testing on extremities (hands, forearms, legs) is unreliable due to age-related loss of skin elasticity (dermal thinning and reduced collagen). The forehead and sternum retain elasticity more consistently with aging and provide a more accurate assessment of hydration status."
      },
      {
        question: "An elderly patient on a proton pump inhibitor requires calcium supplementation. The practical nurse should expect which form of calcium to be prescribed?",
        options: [
          "Calcium carbonate because it is the least expensive",
          "Calcium citrate because it does not require gastric acid for absorption",
          "Calcium gluconate because it has the highest elemental calcium content",
          "Calcium carbonate because it should be taken on an empty stomach"
        ],
        correct: 1,
        rationale: "Calcium citrate is preferred for patients on proton pump inhibitors because it is absorbed independently of gastric pH. Calcium carbonate requires an acidic environment for optimal absorption, and PPIs significantly reduce gastric acid production. Calcium citrate can be taken with or without food and provides reliable absorption regardless of gastric acid levels."
      },
      {
        question: "A practical nurse observes that an 80-year-old patient has consumed less than 25% of meals for the past 3 days. Which action should the practical nurse take first?",
        options: [
          "Document the finding and continue monitoring at the next meal",
          "Report the finding to the registered nurse and anticipate a dietitian referral",
          "Restrict the patient's fluid intake to increase appetite",
          "Administer megestrol acetate to stimulate appetite"
        ],
        correct: 1,
        rationale: "Consistently poor oral intake (below 50% for 3 or more days) should be reported to the registered nurse as this indicates the patient is not meeting nutritional needs. A dietitian referral for comprehensive nutritional assessment and meal planning is appropriate. Simply documenting without action delays intervention. The practical nurse cannot independently prescribe medications. Fluid restriction is inappropriate and potentially dangerous in elderly patients."
      }
    ]
  },

  "nutrition-rpn": {
    title: "Clinical Nutrition and Enteral Feeding Management for Practical Nurses",
    cellular: {
      title: "Physiology of Macronutrient Metabolism and Enteral Nutrition",
      content: "Clinical nutrition encompasses the assessment, planning, and delivery of adequate nutrients to maintain cellular function, support tissue repair, and meet metabolic demands during health and illness. Macronutrients are required in large quantities and serve distinct metabolic roles. Carbohydrates are the body's preferred energy source, yielding 4 kilocalories per gram. Simple carbohydrates (monosaccharides and disaccharides) are rapidly absorbed and can cause blood glucose spikes, while complex carbohydrates (polysaccharides including starch and fiber) are digested more slowly, providing sustained energy and promoting bowel regularity. The brain requires approximately 120 grams of glucose daily as its primary fuel. Proteins yield 4 kilocalories per gram and consist of amino acid chains that serve structural functions (muscle, connective tissue, enzymes, antibodies, transport proteins). Of the 20 amino acids, 9 are essential (must be obtained from diet). Complete proteins (meat, fish, dairy, eggs, soy) contain all essential amino acids, while incomplete proteins (most plant sources) must be combined to provide the full amino acid profile. Nitrogen balance is a key indicator of protein status: positive balance (anabolic state) occurs during growth and recovery, negative balance (catabolic state) occurs during illness, stress, and starvation. Fats yield 9 kilocalories per gram and are essential for cell membrane integrity, hormone synthesis (steroid hormones and prostaglandins), fat-soluble vitamin absorption (vitamins A, D, E, K), nerve insulation (myelin sheaths), and organ protection. Essential fatty acids (linoleic acid and alpha-linolenic acid) cannot be synthesized and must be obtained from diet. Enteral nutrition (tube feeding) delivers nutrients directly into the gastrointestinal tract when patients cannot meet nutritional needs through oral intake but have a functional GI tract. Routes include nasogastric (NG) tube for short-term use (less than 4-6 weeks), nasoduodenal or nasojejunal tube for patients at high aspiration risk, and gastrostomy (PEG) or jejunostomy (PEJ) tubes for long-term use (greater than 4-6 weeks). Parenteral nutrition (PN) delivers nutrients intravenously when the GI tract is nonfunctional (bowel obstruction, severe pancreatitis, short bowel syndrome). Peripheral parenteral nutrition (PPN) provides partial nutritional support through a peripheral IV for short-term use, while total parenteral nutrition (TPN) requires central venous access and can provide complete nutritional support. The practical nurse must understand the principles of enteral feeding management including formula selection, administration methods, complication prevention, and patient monitoring to ensure safe and effective nutritional delivery."
    },
    riskFactors: [
      "Dysphagia from stroke, head and neck cancer, neurological disorders, or mechanical ventilation (inability to safely swallow oral diet)",
      "Altered consciousness or coma (unable to voluntarily eat; aspiration risk with oral feeding)",
      "Major surgery or trauma (increased metabolic demands with potential inability to eat; catabolism increasing protein requirements)",
      "Cancer and cancer treatment (chemotherapy-induced nausea, radiation mucositis, tumor-related obstruction, cachexia)",
      "Inflammatory bowel disease, short bowel syndrome, or malabsorptive conditions (impaired nutrient absorption despite adequate intake)",
      "Burns covering greater than 20% total body surface area (hypermetabolic state with protein and caloric requirements up to twice baseline)",
      "Prolonged NPO status exceeding 5 to 7 days without nutritional supplementation (progressive depletion of glycogen stores, protein catabolism, micronutrient deficiency)"
    ],
    diagnostics: [
      "Gastric residual volume (GRV) measurement: aspirate and measure stomach contents before each bolus feeding or every 4-6 hours with continuous feeds; hold feeding and notify physician if residual exceeds facility threshold (typically 250-500 mL)",
      "Serum glucose monitoring: check every 6 hours during enteral feeding initiation and with TPN; hyperglycemia is common due to dextrose content; hypoglycemia can occur if feeding is abruptly discontinued",
      "Abdominal X-ray: confirms NG/NJ tube placement radiographically (gold standard); identifies tube migration, malposition, or inadvertent pulmonary placement before initiating feeding",
      "Serum electrolytes including phosphorus and magnesium: monitor daily during initiation of feeding in malnourished patients to detect refeeding syndrome (hypophosphatemia, hypokalemia, hypomagnesemia)",
      "Prealbumin level: monitor weekly to assess response to nutritional intervention; rising prealbumin indicates improving nutritional status; values below 10 mg/dL indicate severe depletion",
      "Intake and output with calorie counts: document all nutritional intake (enteral formula volume delivered, oral supplements, parenteral nutrition) and output (urine, stool, emesis, wound drainage) to assess nutritional adequacy and fluid balance"
    ],
    management: [
      "Verify enteral tube placement before every intermittent feeding and at least once per shift with continuous feeds using facility-approved methods: aspirate appearance and pH testing (gastric pH typically 1-5), chest X-ray for initial placement verification",
      "Administer enteral feeding at prescribed rate using an infusion pump for continuous feeds; for bolus feeds, deliver 240-480 mL over 15-30 minutes via gravity or syringe every 4-6 hours as ordered",
      "Elevate head of bed to 30 to 45 degrees during feeding and for 30 to 60 minutes after feeding to reduce aspiration risk; maintain this position for continuous feeds at all times",
      "Flush feeding tube with 30 mL of warm water before and after each medication administration, before and after each intermittent feeding, and every 4 hours during continuous feeds to maintain patency",
      "Advance enteral feeding rate gradually as tolerated: typically start at 10-20 mL/hour and increase by 10-20 mL/hour every 8-12 hours until goal rate is achieved; monitor tolerance at each advancement",
      "Monitor blood glucose every 6 hours during enteral or parenteral nutrition; administer sliding scale insulin as ordered; target glucose 140-180 mg/dL in critically ill patients",
      "Hang enteral feeding formula for no more than 4 hours for open systems or 24 hours for closed (ready-to-hang) systems to prevent bacterial contamination; change administration sets every 24 hours"
    ],
    nursingActions: [
      "Perform enteral tube placement verification before EVERY use: check pH of aspirate (gastric pH 1-5, intestinal pH 6 or above), observe aspirate color and consistency; NEVER rely on auscultation alone as it is unreliable",
      "Monitor for feeding intolerance: assess for abdominal distension, nausea, vomiting, diarrhea (3 or more loose stools per day), cramping, and increased gastric residual volume; hold feeding and report if intolerance suspected",
      "Provide meticulous tube site care: clean around NG tube insertion site daily; rotate NG tube position slightly to prevent nasal pressure injury; for PEG sites, clean around stoma daily with mild soap and water, assess for erythema, drainage, or granulation tissue",
      "Administer medications through feeding tube correctly: use liquid formulations when available; crush tablets to fine powder and dissolve in warm water (never crush enteric-coated or sustained-release medications); flush with 15-30 mL water between each medication",
      "Monitor intake and output accurately: record volume of formula administered, all flush volumes, oral intake, urine output, stool output, and emesis; calculate net fluid balance",
      "Assess bowel function daily: document frequency, consistency, and volume of stools; report diarrhea (which may indicate formula intolerance, rate too fast, or C. difficile infection) or constipation (which may indicate dehydration or inadequate fiber)",
      "Report to the registered nurse any new abdominal distension, absent bowel sounds, new onset of vomiting, respiratory distress during feeding (possible aspiration), or tube displacement"
    ],
    assessmentFindings: [
      "Signs of feeding intolerance: abdominal distension and tympany, nausea, vomiting, diarrhea, cramping, high gastric residual volume; these indicate need to slow or hold feeding",
      "Signs of aspiration: coughing during or after feeding, respiratory distress, new-onset crackles or wheezing on auscultation, fever, oxygen desaturation, tube feeding formula in oral or tracheal secretions",
      "Tube complications: nasal erosion or pressure injury from NG tube, tube obstruction (inability to flush), tube displacement (length marker has changed position), peristomal leakage or infection around PEG site",
      "Metabolic complications: hyperglycemia from dextrose content (especially in diabetic patients and with TPN), electrolyte imbalances, fluid overload or dehydration, refeeding syndrome in malnourished patients",
      "Diarrhea evaluation: assess timing, frequency, and volume; common causes include formula delivery rate too fast, hyperosmolar formula, medication-related (antibiotics, sorbitol-containing liquids), or C. difficile infection",
      "Nutritional response indicators: weight trending toward goal, improving prealbumin levels, positive nitrogen balance, wound healing progression, improving functional status and energy levels",
      "Skin and stoma assessment for PEG/PEJ: intact peristomal skin without erythema, no purulent drainage, external bumper positioned 1-2 cm from skin surface, tube rotates freely (confirms it is not embedded)"
    ],
    signs: {
      left: [
        "Mild abdominal bloating after bolus feeding",
        "Slightly elevated gastric residual below facility threshold",
        "Mild diarrhea (1-2 loose stools per day) during feeding initiation",
        "Low-grade temperature elevation during first 24 hours of feeding",
        "Mild nausea that resolves with rate reduction",
        "Blood glucose 150-180 mg/dL during continuous enteral feeding"
      ],
      right: [
        "Aspiration with acute respiratory distress (coughing, oxygen desaturation, new crackles, tachypnea -- stop feeding immediately, suction, position upright, notify physician)",
        "Tube displacement into airway (respiratory distress, air leak through tube, formula in tracheal secretions -- stop feeding, clamp tube, emergency notification)",
        "Refeeding syndrome (severe hypophosphatemia below 1.0 mg/dL, cardiac dysrhythmias, respiratory failure, seizures -- medical emergency)",
        "Peritonitis from PEG tube dislodgement or perforation (rigid abdomen, severe pain, fever, absent bowel sounds -- surgical emergency)",
        "Severe hyperglycemia above 400 mg/dL with TPN (risk of hyperosmolar state, altered consciousness)",
        "Massive gastric residual with abdominal distension (possible bowel obstruction or ileus)"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic agent and antiemetic (dopamine D2 antagonist)",
        action: "Increases upper gastrointestinal motility by enhancing acetylcholine release from myenteric motor neurons and blocking inhibitory dopamine D2 receptors; accelerates gastric emptying by increasing gastric antral contractions and relaxing the pylorus and duodenal bulb; also acts as an antiemetic by blocking dopamine D2 receptors in the chemoreceptor trigger zone of the area postrema",
        sideEffects: "Drowsiness, restlessness, fatigue, diarrhea; extrapyramidal symptoms (EPS) including acute dystonia, akathisia, and drug-induced parkinsonism; TARDIVE DYSKINESIA with prolonged use (may be irreversible)",
        contra: "GI obstruction, perforation, or hemorrhage; pheochromocytoma (can precipitate hypertensive crisis); seizure disorder; concurrent use with other dopamine antagonists or medications that increase EPS risk; Parkinson disease",
        pearl: "Use for the shortest duration possible, typically no more than 12 weeks due to risk of tardive dyskinesia; commonly prescribed to promote gastric emptying and reduce gastric residuals in tube-fed patients; administer 30 minutes before meals or tube feedings; monitor for involuntary facial movements (lip smacking, tongue protrusion, grimacing) -- report immediately as these may indicate tardive dyskinesia"
      },
      {
        name: "Pancrelipase (Creon/Zenpep)",
        type: "Pancreatic enzyme replacement",
        action: "Contains a combination of lipase, protease, and amylase enzymes that substitute for deficient endogenous pancreatic enzymes; lipase hydrolyzes dietary fats into fatty acids and glycerol, protease breaks proteins into peptides and amino acids, amylase converts starches into simple sugars; the enteric-coated microspheres protect enzymes from gastric acid degradation and release in the alkaline duodenal environment",
        sideEffects: "Nausea, diarrhea, abdominal pain, headache; fibrosing colonopathy with excessively high doses (especially in children with cystic fibrosis); hyperuricemia from nucleic acid content at very high doses; allergic reactions in patients with pork sensitivity",
        contra: "Known hypersensitivity to porcine proteins (enzymes are derived from porcine pancreas); acute pancreatitis or acute exacerbation of chronic pancreatitis (enzymes may worsen inflammation)",
        pearl: "CRITICAL: Capsules should be swallowed whole and NEVER crushed -- the enteric coating protects enzymes from gastric acid destruction; if patient cannot swallow capsules, open and sprinkle microspheres on acidic soft food (applesauce) and swallow immediately without chewing; dose is based on lipase units and adjusted according to fat content of meals; take with every meal and snack containing fat"
      },
      {
        name: "Regular Insulin (Humulin R/Novolin R)",
        type: "Short-acting insulin (blood glucose regulator)",
        action: "Binds to insulin receptors on cell membranes, facilitating glucose uptake into skeletal muscle and adipose tissue via GLUT4 transporter recruitment; suppresses hepatic gluconeogenesis and glycogenolysis; promotes glycogen, protein, and fat synthesis; onset of action 30-60 minutes subcutaneously, 10-15 minutes intravenously; peak action 2-4 hours subcutaneously; duration 6-8 hours subcutaneously",
        sideEffects: "Hypoglycemia (most serious and common: tremors, diaphoresis, tachycardia, confusion, loss of consciousness, seizures); injection site lipodystrophy; hypokalemia (insulin drives potassium intracellularly); weight gain; allergic reactions at injection site",
        contra: "Hypoglycemia (blood glucose below 70 mg/dL); hypokalemia (correct potassium before administering insulin as further intracellular shift can cause fatal dysrhythmias); known hypersensitivity",
        pearl: "Regular insulin is the ONLY insulin that can be administered intravenously; used on sliding scale for blood glucose management during enteral and parenteral nutrition; if enteral feeding is held or interrupted, continue to monitor blood glucose and hold insulin to prevent hypoglycemia; always have glucose source (dextrose 50% for IV, glucose tablets or juice for oral) available when administering insulin"
      }
    ],
    pearls: [
      "NEVER rely on auscultation (air bolus method) alone to verify NG tube placement -- this method is unreliable and has resulted in fatal feeding into the lungs; verify by pH testing of aspirate (gastric pH 1-5) and radiographic confirmation for initial placement",
      "Head of bed must be elevated to 30-45 degrees at ALL times during continuous enteral feeding and for 30-60 minutes after bolus feeding to prevent aspiration -- this is a non-negotiable safety measure",
      "If enteral feeding is interrupted or held for any reason, continue monitoring blood glucose and hold insulin doses as appropriate to prevent hypoglycemia -- the feeding is the patient's glucose source",
      "Flush the feeding tube with 30 mL of warm water before and after each medication, before and after each intermittent feeding, and every 4 hours during continuous feeding -- this simple action prevents the most common complication (tube clogging)",
      "Medications given through feeding tubes require special consideration: use liquid formulations when available; never crush enteric-coated, sustained-release, or sublingual medications; separate phenytoin (Dilantin) administration from tube feeding by 2 hours as formula reduces absorption by up to 70%",
      "Diarrhea during tube feeding has many causes beyond formula intolerance: check for sorbitol content in liquid medications, assess for C. difficile infection (especially in patients on antibiotics), evaluate feeding rate and formula osmolality before changing the formula",
      "Refeeding syndrome risk is highest in the first 72 hours of nutritional replenishment in severely malnourished patients -- monitor phosphorus, potassium, and magnesium daily and replace aggressively before and during feeding initiation"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to administer a bolus feeding through a nasogastric tube. Which action should be performed FIRST?",
        options: [
          "Warm the formula to body temperature",
          "Verify tube placement by checking pH of aspirated contents",
          "Flush the tube with 60 mL of water",
          "Position the patient in a supine position"
        ],
        correct: 1,
        rationale: "Verifying tube placement before EVERY feeding is the priority safety action. The practical nurse should aspirate gastric contents and check pH (gastric pH is typically 1-5). Feeding into a misplaced tube (especially one in the lungs) can be fatal. After confirming placement, the nurse should elevate the head of bed (not supine position) and proceed with the feeding."
      },
      {
        question: "A patient receiving continuous enteral feeding via NG tube develops coughing, oxygen desaturation to 88%, and new-onset crackles on lung auscultation. Which action should the practical nurse take immediately?",
        options: [
          "Increase the feeding rate to finish the formula sooner",
          "Stop the feeding, position the patient upright, and notify the physician",
          "Administer an antitussive medication for the cough",
          "Continue the feeding and recheck oxygen saturation in 30 minutes"
        ],
        correct: 1,
        rationale: "These findings (coughing, oxygen desaturation, new crackles) strongly suggest aspiration of tube feeding formula into the lungs. The immediate actions are to stop the feeding to prevent further aspiration, position the patient upright to facilitate drainage and breathing, suction if needed, apply oxygen as needed, and notify the physician immediately. Continuing the feeding or simply waiting would worsen the aspiration."
      },
      {
        question: "The practical nurse needs to administer crushed medications through a patient's PEG tube. Which medication should the nurse question before crushing?",
        options: [
          "Immediate-release acetaminophen tablet",
          "Enteric-coated aspirin tablet",
          "Regular multivitamin tablet",
          "Immediate-release metoprolol tablet"
        ],
        correct: 1,
        rationale: "Enteric-coated medications should NEVER be crushed because the enteric coating protects the medication from gastric acid degradation (ensuring delivery to the small intestine) and protects the gastric mucosa from irritation. Crushing destroys this protective coating, potentially causing gastric irritation and altering drug absorption. The practical nurse should contact the prescriber to request an alternative formulation."
      }
    ]
  },

  "obstructive-uropathy-rpn": {
    title: "Obstructive Uropathy for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Urinary Tract Obstruction",
      content: "Obstructive uropathy refers to any structural or functional obstruction of urine flow at any level of the urinary tract, from the renal pelvis to the urethral meatus. When urine outflow is blocked, hydrostatic pressure builds retrograde through the urinary system, leading to progressive dilation of the structures proximal to the obstruction. Hydronephrosis is the dilation of the renal pelvis and calyces resulting from urine accumulation when drainage is impaired. The rising intraluminal pressure is transmitted to the renal parenchyma, compressing the renal tubules and peritubular capillaries. This compression reduces glomerular filtration rate and impairs tubular function, including the ability to concentrate urine, reabsorb sodium, and secrete hydrogen and potassium ions. If the obstruction is unrelieved, progressive ischemia and inflammation lead to tubular atrophy, interstitial fibrosis, and irreversible nephron loss. The kidney can sustain significant damage within 24 to 48 hours of complete obstruction. Obstruction may be classified by location (upper tract involving ureter or renal pelvis, or lower tract involving bladder or urethra), by onset (acute or chronic), and by degree (partial or complete). Upper tract obstruction is most commonly caused by ureteral calculi (kidney stones), which form when supersaturated urine precipitates crystalline minerals (calcium oxalate, calcium phosphate, uric acid, struvite, or cystine). Calculi smaller than 5 mm typically pass spontaneously, while those larger than 10 mm usually require intervention. Lower tract obstruction is most commonly caused by benign prostatic hyperplasia (BPH) in males, where hyperplasia of the periurethral glandular tissue compresses the prostatic urethra. Other causes include urethral strictures, neurogenic bladder, tumors (bladder, prostate, cervical), blood clots, and congenital anomalies. Post-obstructive diuresis is a critical phenomenon that occurs after relief of bilateral obstruction or obstruction in a solitary kidney. The kidneys produce large volumes of dilute urine (potentially exceeding 200 mL/hour) due to osmotic diuresis from retained urea and sodium, impaired concentrating ability from tubular damage, and resolution of natriuretic peptide accumulation. This diuresis can cause severe dehydration, hypotension, and electrolyte depletion (hyponatremia, hypokalemia) if not managed with careful fluid and electrolyte replacement. The practical nurse must monitor urine output closely after obstruction relief, replace fluids as ordered (typically matching output mL for mL), and report any signs of hemodynamic instability."
    },
    riskFactors: [
      "History of urolithiasis (kidney stones) with recurrence rate of 50% within 5-10 years; risk increases with dehydration, high-sodium diet, and family history",
      "Benign prostatic hyperplasia (BPH) affecting approximately 50% of males over age 50 and 80% over age 80 (progressive prostatic enlargement compresses urethra)",
      "Chronic dehydration and inadequate fluid intake (concentrated urine promotes crystal formation and stone development)",
      "High dietary sodium intake (increases urinary calcium excretion, promoting calcium stone formation)",
      "Neurogenic bladder from spinal cord injury, multiple sclerosis, or diabetic neuropathy (impaired bladder emptying leads to stasis and recurrent infections)",
      "Pelvic or abdominal malignancy (tumors can compress or invade ureters, bladder, or urethra causing extrinsic obstruction)",
      "Recurrent urinary tract infections with urea-splitting organisms (Proteus, Klebsiella) that create alkaline urine promoting struvite (magnesium ammonium phosphate) stone formation"
    ],
    diagnostics: [
      "Renal ultrasound: first-line imaging for suspected obstruction; identifies hydronephrosis, hydroureter, and bladder distension; non-invasive, no radiation, no contrast needed; sensitivity approximately 90% for moderate to severe hydronephrosis",
      "CT scan without contrast (CT KUB): gold standard for detecting urinary calculi; identifies stone location, size, and degree of obstruction; detects stones as small as 1-2 mm; performed without contrast to avoid obscuring stones",
      "Serum creatinine and BUN: assess renal function; elevated creatinine indicates impaired glomerular filtration; BUN/creatinine ratio above 20:1 may suggest dehydration contributing to obstruction",
      "Urinalysis with microscopy: hematuria (blood in urine) present in 85% of patients with ureteral calculi; WBCs and bacteria suggest concurrent UTI; urine pH helps identify stone type (pH above 7 suggests struvite; pH below 5.5 suggests uric acid)",
      "Serum electrolytes including calcium, phosphorus, and uric acid: hypercalcemia suggests hyperparathyroidism as underlying cause; hyperuricemia suggests uric acid stone formation; potassium monitoring essential after obstruction relief",
      "Post-void residual (PVR) measurement by bladder scan: volume greater than 100-150 mL after voiding suggests incomplete bladder emptying from outlet obstruction or detrusor weakness"
    ],
    management: [
      "Insert urinary catheter (Foley) as ordered for acute urinary retention to decompress the bladder; document initial drainage volume (avoid draining more than 500-1000 mL at once to prevent rapid decompression syndrome causing hematuria and hypotension)",
      "Manage nephrostomy tube if placed: maintain tube patency and drainage; secure tube to prevent accidental dislodgement; monitor output hourly for first 24 hours; never clamp, irrigate, or reposition without physician order",
      "Promote aggressive fluid intake of 2.5 to 3 liters per day (unless contraindicated by heart failure or renal failure) to dilute urine and facilitate stone passage; encourage 24-hour urine output goal of at least 2 liters",
      "Strain ALL urine through a fine-mesh strainer to capture passed stones for laboratory analysis; send any collected stones for chemical composition analysis to guide long-term prevention strategies",
      "Manage post-obstructive diuresis: monitor urine output hourly after obstruction relief; replace IV fluids at a rate matching urine output for the first 24-48 hours; monitor electrolytes every 6-12 hours during active diuresis",
      "Administer prescribed analgesics for renal colic pain; NSAIDs (ketorolac) are first-line for renal colic as they reduce ureteral edema and prostaglandin-mediated smooth muscle spasm; opioids may be needed for severe pain",
      "Implement dietary modifications based on stone type: low-oxalate diet for calcium oxalate stones (limit spinach, rhubarb, nuts, chocolate), adequate calcium intake (dietary calcium binds intestinal oxalate), reduced sodium intake, increased citrate-containing fluids (lemon water)"
    ],
    nursingActions: [
      "Monitor urine output every hour for the first 24 hours after obstruction relief; report output exceeding 200 mL/hour (post-obstructive diuresis) or less than 30 mL/hour (possible re-obstruction or renal failure)",
      "Assess pain using validated tools and administer prescribed analgesics; renal colic typically presents as severe, colicky flank pain radiating to the groin with associated nausea and vomiting; provide comfort measures including warm packs to the flank",
      "Monitor vital signs every 4 hours or more frequently as ordered; tachycardia and hypotension may indicate dehydration from post-obstructive diuresis, sepsis from obstructive pyelonephritis, or hemorrhage",
      "Maintain accurate intake and output records; calculate fluid balance every 8 hours; report significant discrepancies or negative fluid balance during post-obstructive diuresis phase",
      "Inspect urine color, clarity, and volume at every void or catheter assessment: dark concentrated urine suggests dehydration; frank hematuria (bright red) may indicate bleeding from stone passage or catheterization; cloudy malodorous urine suggests infection",
      "Provide nephrostomy tube care: keep drainage bag below the level of the kidney at all times; assess insertion site for erythema, drainage, or displacement; maintain a closed drainage system; never irrigate without a physician order",
      "Reinforce patient education on fluid intake goals (minimum 2.5 liters daily), dietary modifications based on stone type, signs and symptoms of obstruction recurrence (flank pain, decreased urine output, hematuria), and when to seek medical attention"
    ],
    assessmentFindings: [
      "Renal colic: sudden onset of severe, intermittent, colicky flank pain radiating to the lower abdomen, groin, or genitalia; patients are typically restless and unable to find a comfortable position (unlike peritonitis where patients lie still)",
      "Urinary changes: hematuria (gross or microscopic), dysuria, urinary frequency and urgency (lower tract obstruction), oliguria or anuria (complete bilateral obstruction or obstruction in a solitary kidney)",
      "Bladder distension: palpable suprapubic fullness, dullness to percussion over the bladder, sensation of incomplete emptying, overflow incontinence (continuous dribbling with distended bladder)",
      "Systemic signs of obstructive pyelonephritis: high fever with rigors, flank pain and costovertebral angle tenderness, tachycardia, sepsis presentation (combination of fever, obstruction, and infection is a urological emergency)",
      "Post-obstructive diuresis indicators: urine output exceeding 200 mL/hour after catheter placement or nephrostomy, dilute pale urine with low specific gravity, orthostatic hypotension from volume depletion",
      "Chronic obstruction signs: gradually decreasing urine output, peripheral edema, fatigue, nausea, elevated BUN and creatinine trending upward, electrolyte imbalances (hyperkalemia, metabolic acidosis)"
    ],
    signs: {
      left: [
        "Mild flank discomfort or dull aching",
        "Microscopic hematuria on urinalysis without gross blood",
        "Slightly decreased urine output (still above 30 mL/hour)",
        "Urinary frequency or urgency without retention",
        "Mild nausea associated with flank pain",
        "Low-grade fever (below 38.3 degrees Celsius)"
      ],
      right: [
        "Anuria (no urine output) indicating complete bilateral obstruction or obstruction in solitary kidney (emergency requiring immediate decompression)",
        "Obstructive pyelonephritis with sepsis (high fever, rigors, hypotension, tachycardia -- urological emergency requiring drainage and IV antibiotics)",
        "Post-obstructive diuresis exceeding 500 mL/hour with hemodynamic instability (severe dehydration, hypotension, electrolyte depletion)",
        "Acute kidney injury with rapidly rising creatinine, hyperkalemia, and metabolic acidosis (potential cardiac arrest risk from hyperkalemia)",
        "Nephrostomy tube dislodgement with urine leaking into retroperitoneal space (cover site with sterile dressing, notify physician immediately, do NOT attempt to reinsert)",
        "Urosepsis with altered consciousness and multi-organ dysfunction (requires ICU-level care, broad-spectrum antibiotics, and surgical drainage)"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1 adrenergic receptor antagonist (selective for alpha-1A receptors)",
        action: "Selectively blocks alpha-1A adrenergic receptors concentrated in the prostate gland, prostatic urethra, and bladder neck smooth muscle, causing relaxation that reduces urethral resistance and improves urine flow; also relaxes ureteral smooth muscle, which facilitates passage of distal ureteral stones (medical expulsive therapy for stones 5-10 mm)",
        sideEffects: "Orthostatic hypotension and dizziness (most common, especially with first dose), retrograde ejaculation (up to 30%), nasal congestion, headache, asthenia; intraoperative floppy iris syndrome (IFIS) during cataract surgery",
        contra: "Known hypersensitivity; concurrent use with other alpha-1 blockers; use caution with PDE5 inhibitors (additive hypotension); severe hepatic impairment; inform ophthalmologist before any eye surgery due to IFIS risk",
        pearl: "Administer 30 minutes after the SAME meal each day for consistent absorption; take first dose at bedtime to minimize orthostatic hypotension; instruct patient to rise slowly from sitting or lying position; commonly used off-label as medical expulsive therapy to facilitate passage of ureteral stones 5-10 mm in diameter; improvement in urinary symptoms may take 1-2 weeks"
      },
      {
        name: "Ketorolac (Toradol)",
        type: "Non-steroidal anti-inflammatory drug (NSAID) -- parenteral",
        action: "Inhibits cyclooxygenase (COX-1 and COX-2) enzymes, blocking prostaglandin synthesis; reduces pain, inflammation, and fever; in renal colic specifically, reduces ureteral edema and prostaglandin-mediated ureteral smooth muscle spasm, providing both analgesic and therapeutic benefit by reducing obstruction at the stone site",
        sideEffects: "GI bleeding and ulceration (most serious), acute kidney injury (especially in dehydrated patients), platelet dysfunction and increased bleeding risk, hypertension, peripheral edema, headache, dizziness",
        contra: "Active peptic ulcer disease or GI bleeding; severe renal impairment (CrCl below 30 mL/min); coagulopathy or concurrent anticoagulant use; aspirin-sensitive asthma; perioperative use in CABG surgery; age over 65 requires dose reduction",
        pearl: "Ketorolac is FIRST-LINE for renal colic pain because NSAIDs address the underlying pathophysiology (ureteral edema and spasm) unlike opioids which only treat pain perception; LIMITED to maximum 5 days of use due to GI and renal toxicity risk; IV/IM dose should not exceed 30 mg per dose (15 mg in elderly or renal impairment); ensure adequate hydration before administration to protect kidney function"
      },
      {
        name: "Ciprofloxacin (Cipro)",
        type: "Fluoroquinolone antibiotic (bactericidal)",
        action: "Inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, which are essential enzymes for bacterial DNA replication, transcription, repair, and recombination; without functional topoisomerases, the bacterial chromosome cannot uncoil and replicate, leading to bacterial cell death; provides broad-spectrum coverage against gram-negative organisms including E. coli, Klebsiella, Proteus, and Pseudomonas, which are the most common uropathogens",
        sideEffects: "Tendinitis and tendon rupture (especially Achilles tendon, increased risk in patients over 60, concurrent corticosteroid use, and renal transplant recipients), peripheral neuropathy (may be irreversible), QT prolongation, C. difficile-associated diarrhea, photosensitivity, CNS effects (dizziness, confusion, seizures), aortic dissection risk",
        contra: "Known hypersensitivity to fluoroquinolones; concurrent use with tizanidine (dangerous hypotension); myasthenia gravis (may worsen muscle weakness); pregnancy and breastfeeding; pediatric patients (cartilage damage risk); history of tendon disorders with fluoroquinolone use",
        pearl: "FDA black box warnings exist for tendinitis/tendon rupture, peripheral neuropathy, and CNS effects -- reserve for infections where benefits outweigh risks; separate administration from calcium, iron, magnesium, aluminum-containing antacids, and sucralfate by at least 2 hours (chelation reduces absorption); ensure adequate hydration to prevent crystalluria; commonly prescribed for complicated UTI associated with obstruction; obtain urine culture before starting antibiotics"
      }
    ],
    pearls: [
      "Post-obstructive diuresis is a potentially life-threatening complication occurring after relief of bilateral obstruction or obstruction in a solitary kidney -- monitor urine output HOURLY for the first 24-48 hours and replace fluids as ordered to prevent hypovolemic shock",
      "When initially catheterizing a patient with acute urinary retention, avoid draining more than 500 to 1000 mL at once -- rapid bladder decompression can cause reflex hypotension, gross hematuria from mucosal vessels, and vasovagal syncope; clamp the catheter briefly if these occur and drain slowly",
      "Renal colic pain from ureteral stones characteristically causes patients to be RESTLESS (writhing, unable to find comfortable position) -- this is in contrast to peritonitis where patients lie perfectly still to avoid aggravating peritoneal irritation; this distinction aids clinical assessment",
      "Ketorolac (NSAID) is first-line for renal colic because it reduces ureteral edema and smooth muscle spasm at the stone site in addition to providing analgesia -- opioids only address pain perception without treating the underlying pathophysiology",
      "NEVER irrigate, clamp, or reposition a nephrostomy tube without a physician order -- manipulation can cause bleeding, dislodgement, or introduction of infection into the renal pelvis; keep the drainage bag below kidney level at all times",
      "Strain ALL urine for patients with known or suspected urolithiasis -- chemical composition analysis of captured stones guides targeted long-term dietary and pharmacological prevention strategies (80% of stones are calcium-based, 10% uric acid, 5-10% struvite, 1% cystine)",
      "Obstructive pyelonephritis (infected obstruction) is a UROLOGICAL EMERGENCY: the combination of infection and obstruction causes rapid sepsis progression because antibiotics alone cannot sterilize urine proximal to the obstruction -- urgent drainage (catheter, nephrostomy, or ureteral stent) PLUS antibiotics is required"
    ],
    quiz: [
      {
        question: "A practical nurse has inserted a Foley catheter for a patient with acute urinary retention. After draining 800 mL of urine, the patient becomes pale and diaphoretic. What should the practical nurse do?",
        options: [
          "Continue draining until the bladder is completely empty",
          "Clamp the catheter, lower the head of bed, and monitor vital signs",
          "Remove the catheter and encourage the patient to void naturally",
          "Increase the IV fluid rate and continue draining"
        ],
        correct: 1,
        rationale: "Rapid bladder decompression can cause reflex hypotension and vasovagal syncope. When symptoms (pallor, diaphoresis) develop after draining a large volume, the practical nurse should clamp the catheter to stop further drainage, place the patient flat to support blood pressure, monitor vital signs, and notify the physician. The catheter should be unclamped after the patient stabilizes to allow gradual drainage."
      },
      {
        question: "A patient has undergone nephrostomy tube placement for bilateral ureteral obstruction. The practical nurse notes urine output of 350 mL/hour for the past 2 hours. Which condition does this represent?",
        options: [
          "Normal urine output following nephrostomy placement",
          "Post-obstructive diuresis requiring close monitoring and fluid replacement",
          "Nephrostomy tube malfunction requiring irrigation",
          "Urinary tract infection causing increased urine production"
        ],
        correct: 1,
        rationale: "Urine output of 350 mL/hour (exceeding 200 mL/hour) after relief of bilateral obstruction represents post-obstructive diuresis. This occurs due to osmotic diuresis from retained urea and impaired tubular concentrating ability. It requires close monitoring of intake/output, vital signs, and electrolytes, with IV fluid replacement matching urine output to prevent hypovolemic shock and dangerous electrolyte depletion."
      },
      {
        question: "A practical nurse is caring for a patient admitted with renal colic from a ureteral stone. Which observation about the patient's behavior is most consistent with this diagnosis?",
        options: [
          "The patient is lying completely still on the bed avoiding all movement",
          "The patient is restlessly moving in bed and unable to find a comfortable position",
          "The patient is sitting calmly and reading a magazine",
          "The patient is sleeping comfortably without any pain expression"
        ],
        correct: 1,
        rationale: "Renal colic characteristically causes patients to be restless and unable to find a comfortable position, often writhing in bed or pacing. This presentation is distinctly different from peritonitis, where patients lie perfectly still because any movement aggravates peritoneal irritation. This behavioral distinction is an important clinical assessment finding that helps differentiate the source of abdominal/flank pain."
      }
    ]
  }
};

let ok = 0, skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++; else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
