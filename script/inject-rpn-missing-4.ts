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
  "complement-system": {
    title: "Complement System",
    cellular: {
      title: "Pathophysiology of the Complement System and Its Clinical Significance",
      content: "The complement system is a complex network of over 30 plasma proteins and cell surface receptors that serves as a critical bridge between innate and adaptive immunity. These proteins are primarily synthesized by hepatocytes in the liver and circulate in the blood in inactive precursor (zymogen) forms. Upon activation, they undergo sequential proteolytic cleavage in an enzymatic cascade, with each activated component catalyzing the activation of the next, producing a rapid amplification of the immune response. The complement system performs three essential immune functions: opsonization (coating pathogen surfaces with complement fragments to enhance phagocytosis), inflammation (generating anaphylatoxins that recruit immune cells and increase vascular permeability), and direct pathogen killing (forming the membrane attack complex that lyses target cells). The complement system can be activated through three distinct pathways that converge at a common point. The classical pathway is activated by antigen-antibody (immune) complexes -- specifically, when IgG or IgM antibodies bind to antigens on a pathogen surface, the Fc regions of the clustered antibodies bind C1q (the recognition subunit of the C1 complex), initiating the cascade. C1q binding activates C1r and C1s (serine proteases), which cleave C4 into C4a and C4b, and C2 into C2a and C2b. C4b and C2a combine on the pathogen surface to form C3 convertase (C4b2a), which cleaves C3 into C3a and C3b. Because the classical pathway requires antibody-antigen complexes to initiate, it represents an important link between adaptive (antibody-mediated) and innate immunity. The alternative pathway provides antibody-independent complement activation, making it a purely innate immune mechanism. It is constitutively active at low levels through spontaneous hydrolysis of C3 (called C3 tickover), where small amounts of C3 continuously undergo spontaneous conformational change, exposing a reactive thioester bond that can bind directly to nearby surfaces. On host cell surfaces, regulatory proteins (factor H, MCP/CD46, DAF/CD55) rapidly inactivate deposited C3b, preventing complement-mediated damage to self tissues. On pathogen surfaces, which lack these regulatory proteins, C3b persists and binds factor B, which is then cleaved by factor D to form the alternative pathway C3 convertase (C3bBb), stabilized by properdin (factor P). This convertase generates more C3b, creating a positive feedback amplification loop that rapidly coats the pathogen surface. The lectin pathway is activated when mannose-binding lectin (MBL) or ficolins recognize specific carbohydrate patterns (particularly mannose and N-acetylglucosamine) on microbial surfaces. These carbohydrate patterns are common on bacteria, fungi, and some viruses but are not typically exposed on mammalian cell surfaces, providing innate discrimination between self and non-self. MBL-associated serine proteases (MASP-1 and MASP-2) are activated upon MBL binding and cleave C4 and C2 to form the same C3 convertase (C4b2a) as the classical pathway. All three pathways converge at C3 convertase, which is the central amplification point of the entire complement cascade. C3 convertase cleaves C3 into C3a (an anaphylatoxin) and C3b (an opsonin). C3b deposits on the pathogen surface, marking it for phagocytosis -- this opsonization is arguably the most important function of complement. Phagocytes (neutrophils and macrophages) express complement receptors (CR1, CR3, CR4) that bind C3b and its degradation products, dramatically enhancing pathogen ingestion and destruction. The addition of C3b to C3 convertase creates C5 convertase, which cleaves C5 into C5a (the most potent anaphylatoxin and chemotactic factor) and C5b. C5b initiates the assembly of the membrane attack complex (MAC): C5b sequentially binds C6, C7, C8, and multiple copies of C9 to form a transmembrane pore (C5b-6-7-8-9n) that inserts into the pathogen's cell membrane. The MAC pore disrupts membrane integrity, allowing uncontrolled ion and water influx, leading to osmotic swelling and lysis of the target cell. The MAC is particularly effective against gram-negative bacteria and enveloped viruses. The anaphylatoxins C3a, C4a, and C5a are small fragments generated during complement activation that serve as potent inflammatory mediators. C5a is the most potent: it is a powerful chemotactic factor that recruits neutrophils and monocytes to the site of infection, activates phagocytes and endothelial cells, causes mast cell degranulation (releasing histamine), increases vascular permeability, and triggers the release of pro-inflammatory cytokines. C3a has similar but less potent effects. These anaphylatoxins are essential for mounting an effective inflammatory response but can cause tissue damage when complement is inappropriately or excessively activated. Complement deficiencies have specific clinical consequences that reflect the functions of the missing components. Deficiency of early classical pathway components (C1q, C2, C4) paradoxically predisposes to systemic lupus erythematosus rather than recurrent infections, because complement-mediated clearance of immune complexes and apoptotic cells is impaired, leading to accumulation of nuclear antigens that drive autoimmune responses. C2 deficiency is the most common hereditary complement deficiency. C3 deficiency causes severe recurrent infections with encapsulated bacteria (Streptococcus pneumoniae, Haemophilus influenzae, Neisseria meningitidis) due to loss of opsonization. Terminal complement component deficiencies (C5-C9) specifically predispose to recurrent Neisseria infections (N. meningitidis and N. gonorrhoeae) because the MAC is essential for killing these gram-negative diplococci. Clinically, complement levels are used diagnostically: low C3 and C4 levels during active SLE indicate complement consumption by immune complexes, and serial complement levels help monitor disease activity and treatment response."
    },
    riskFactors: [
      "Hereditary complement component deficiencies (autosomal recessive inheritance for most; C2 deficiency is the most common, affecting approximately 1 in 20,000 individuals)",
      "Autoimmune diseases that consume complement (SLE, immune complex-mediated vasculitis -- low C3/C4 indicates active disease with complement consumption)",
      "Liver disease (hepatocytes produce most complement proteins; severe hepatic dysfunction reduces complement synthesis and increases infection risk)",
      "Nephrotic syndrome (urinary loss of complement proteins along with other plasma proteins, particularly C3 and factor B)",
      "Malnutrition (protein-calorie deficiency impairs hepatic complement synthesis)",
      "Age-related decline in complement function (reduced synthesis and activity in elderly contributing to increased infection susceptibility)",
      "Use of complement-targeting medications (eculizumab/ravulizumab block C5, preventing MAC formation and increasing Neisseria infection risk)"
    ],
    diagnostics: [
      "CH50 (total hemolytic complement) -- screens for deficiency of ANY classical pathway component; a value of zero suggests complete deficiency of one or more components",
      "AH50 (alternative pathway hemolytic complement) -- screens for deficiency of alternative pathway components",
      "Individual complement component levels (C3 and C4 most commonly measured clinically)",
      "C3 and C4 levels for SLE monitoring (both low = classical pathway activation by immune complexes; low C3 with normal C4 = alternative pathway activation; low C4 with normal C3 = C4 deficiency or cryoglobulinemia)",
      "Anti-C1q antibodies (associated with hypocomplementemic urticarial vasculitis and severe lupus nephritis)",
      "Complement split products (C3d, C4d, Bb) -- elevated levels indicate active complement activation even when total levels appear normal",
      "Genetic testing for suspected hereditary complement deficiency (particularly in patients with recurrent Neisseria infections or early-onset SLE)"
    ],
    management: [
      "Vaccination against encapsulated organisms for complement-deficient patients (pneumococcal, meningococcal, and Haemophilus influenzae type b vaccines are essential)",
      "Prophylactic antibiotics for patients with terminal complement deficiency (daily penicillin or amoxicillin for Neisseria meningitidis prophylaxis)",
      "Meningococcal vaccination is MANDATORY before starting eculizumab/ravulizumab therapy (administer at least 2 weeks before first dose)",
      "Monitor complement levels serially in SLE to track disease activity and guide treatment intensity",
      "Treat underlying autoimmune disease causing complement consumption (immunosuppressive therapy for active lupus)",
      "Fresh frozen plasma infusion for acute complement deficiency in emergency situations (temporary, provides missing complement components)"
    ],
    nursingActions: [
      "Verify meningococcal vaccination status before administering complement inhibitor medications (eculizumab, ravulizumab)",
      "Monitor for signs of meningococcal infection in patients on complement inhibitors (fever, headache, stiff neck, petechial rash -- medical emergency requiring immediate intervention)",
      "Educate patients with complement deficiency about their increased infection risk and the importance of seeking immediate medical attention for fever or signs of infection",
      "Ensure proper specimen handling for complement testing (specimens must be processed promptly and kept on ice to prevent in vitro complement degradation that produces falsely low results)",
      "Document complement levels and trends to assist in monitoring autoimmune disease activity",
      "Administer complement inhibitor infusions according to protocol with appropriate monitoring for infusion reactions",
      "Assess for signs of complement-mediated conditions (hemolytic anemia, thrombotic microangiopathy, angioedema)",
      "Provide patient education regarding medical alert identification for complement-deficient patients"
    ],
    assessmentFindings: [
      "Recurrent infections with encapsulated bacteria (S. pneumoniae, H. influenzae, N. meningitidis) -- hallmark of C3 deficiency",
      "Recurrent Neisseria infections (meningococcal meningitis, disseminated gonococcal infection) -- hallmark of terminal complement deficiency (C5-C9)",
      "Early-onset lupus-like syndrome (particularly with C1q, C2, or C4 deficiency)",
      "Low C3 and C4 levels during active autoimmune disease (indicates complement consumption)",
      "Hereditary angioedema (C1 inhibitor deficiency) -- recurrent episodes of non-pruritic, non-urticarial angioedema affecting face, extremities, GI tract, and potentially larynx",
      "Hemolytic anemia from complement-mediated red blood cell destruction (positive direct Coombs test, elevated LDH, low haptoglobin)",
      "Signs of infection in patients on complement inhibitor therapy (fever, rash, meningeal signs)"
    ],
    signs: {
      left: [
        "Recurrent upper respiratory infections",
        "Mildly low complement levels on routine testing",
        "Minor skin infections requiring antibiotics",
        "Borderline positive ANA with low C4",
        "Mild fatigue with joint discomfort"
      ],
      right: [
        "Fulminant meningococcal sepsis (purpura fulminans, DIC, shock)",
        "Severe hereditary angioedema with laryngeal edema (airway emergency)",
        "Lupus nephritis with complement consumption (declining C3/C4, proteinuria)",
        "Thrombotic microangiopathy (aHUS with complement dysregulation)",
        "Overwhelming post-splenectomy infection with encapsulated organisms"
      ]
    },
    medications: [
      {
        name: "Eculizumab (Soliris)",
        type: "Monoclonal anti-C5 antibody (complement inhibitor)",
        action: "Humanized monoclonal antibody that binds to complement protein C5, preventing its cleavage by C5 convertase into C5a (anaphylatoxin) and C5b (initiator of MAC assembly); this blocks formation of the membrane attack complex while preserving upstream complement functions (C3b opsonization); approved for paroxysmal nocturnal hemoglobinuria (PNH), atypical hemolytic uremic syndrome (aHUS), and generalized myasthenia gravis",
        sideEffects: "Increased risk of meningococcal infections (most serious -- patients are 1000-2000 times more likely to develop meningococcal disease), headache, upper respiratory infections, infusion-related reactions, anemia, diarrhea, nausea",
        contra: "Unresolved Neisseria meningitidis infection; patients not currently vaccinated against N. meningitidis (must receive meningococcal vaccine at least 2 weeks before starting therapy unless risk of delaying treatment outweighs risk of meningococcal infection); known hypersensitivity",
        pearl: "REMS (Risk Evaluation and Mitigation Strategy) program MANDATORY -- meningococcal vaccination required before starting therapy; patients must carry a safety card alerting emergency providers of their increased meningococcal risk; some providers also prescribe prophylactic antibiotics (penicillin or ciprofloxacin) despite vaccination due to residual meningococcal risk; administered IV every 2 weeks; newer agent ravulizumab (Ultomiris) is a longer-acting anti-C5 requiring infusion only every 8 weeks"
      },
      {
        name: "Penicillin V (prophylactic)",
        type: "Natural penicillin antibiotic (prophylaxis for complement-deficient patients)",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins, disrupting peptidoglycan cross-linking during cell wall assembly; used prophylactically in complement-deficient patients to prevent infections with encapsulated bacteria, particularly Neisseria meningitidis and Streptococcus pneumoniae, which require complement-mediated opsonization and MAC-mediated killing for effective clearance",
        sideEffects: "Allergic reactions (rash, urticaria, rare anaphylaxis), GI upset (nausea, diarrhea), Clostridioides difficile-associated diarrhea with prolonged use, oral candidiasis",
        contra: "Known severe penicillin allergy (use macrolide alternative such as azithromycin); caution with concurrent methotrexate (reduced renal clearance of methotrexate)",
        pearl: "Prophylactic dosing: 250-500 mg twice daily orally; essential for asplenic patients and those with terminal complement deficiency (C5-C9); does not replace vaccination but provides additional protection; in penicillin-allergic patients, azithromycin or erythromycin can be substituted; prophylaxis may be lifelong in complement deficiency unlike the time-limited course sometimes used post-splenectomy"
      },
      {
        name: "Icatibant (Firazyr)",
        type: "Bradykinin B2 receptor antagonist (for hereditary angioedema)",
        action: "Selectively and competitively blocks bradykinin B2 receptors on endothelial cells, preventing bradykinin-mediated vasodilation and increased vascular permeability; hereditary angioedema (HAE) is caused by C1 inhibitor deficiency or dysfunction, leading to uncontrolled activation of the kallikrein-kinin system and excessive bradykinin generation; unlike allergic angioedema (histamine-mediated), HAE angioedema is bradykinin-mediated and does NOT respond to antihistamines, corticosteroids, or epinephrine",
        sideEffects: "Injection site reactions (erythema, swelling, pain at SC injection site -- almost universal but transient), nausea, headache, nasopharyngitis, dizziness",
        contra: "Known hypersensitivity; not studied in children under 2 years; use with caution in patients with acute ischemic heart disease or unstable angina",
        pearl: "Administered as a single 30 mg subcutaneous injection in the abdominal area for acute HAE attacks; can be self-administered by trained patients for early treatment at home; onset of symptom relief within approximately 45 minutes; may repeat dose every 6 hours if symptoms persist (maximum 3 doses per 24 hours); CRITICAL: HAE angioedema does NOT respond to epinephrine, antihistamines, or corticosteroids -- these drugs target histamine-mediated pathways which are not involved in bradykinin-mediated angioedema"
      }
    ],
    pearls: [
      "Patients with terminal complement deficiency (C5-C9) are uniquely susceptible to Neisseria infections (meningococcal meningitis and disseminated gonococcal infection) -- any patient with recurrent Neisseria infections should be evaluated for complement deficiency",
      "Low C3 and C4 levels together during active SLE indicate complement consumption by immune complexes through the classical pathway -- serial complement levels are used to monitor lupus disease activity and guide treatment decisions",
      "Eculizumab (anti-C5 therapy) carries a 1000-2000 fold increased risk of meningococcal disease -- meningococcal vaccination is MANDATORY before starting treatment, and patients must carry a safety card for emergency providers",
      "Complement specimens must be handled properly for accurate results: blood must be placed on ice immediately after collection and processed within 1 hour, because complement proteins degrade at room temperature producing falsely low results",
      "Hereditary angioedema (C1 inhibitor deficiency) causes bradykinin-mediated angioedema that does NOT respond to epinephrine, antihistamines, or corticosteroids -- it requires specific treatments targeting the bradykinin pathway (icatibant, C1 inhibitor concentrate, or ecallantide)",
      "C2 deficiency is the most common hereditary complement deficiency and is paradoxically associated with an SLE-like syndrome rather than increased infections, because complement-mediated immune complex clearance is impaired",
      "The complement system is essential for clearing encapsulated bacteria because their polysaccharide capsules resist phagocytosis -- complement opsonization (C3b coating) overcomes this antiphagocytic defense and is why complement-deficient and asplenic patients are at high risk for these organisms"
    ],
    quiz: [
      {
        question: "A patient is being started on eculizumab for atypical hemolytic uremic syndrome. What MUST be completed before initiating therapy?",
        options: [
          "Baseline liver function tests and hepatitis screening",
          "Meningococcal vaccination at least 2 weeks before the first dose",
          "Bone marrow biopsy to rule out malignancy",
          "Tuberculin skin test and chest X-ray"
        ],
        correct: 1,
        rationale: "Meningococcal vaccination is MANDATORY before starting eculizumab therapy. Eculizumab blocks C5, preventing formation of the membrane attack complex (MAC), which is essential for killing Neisseria meningitidis. Without MAC function, patients are at 1000-2000 fold increased risk of meningococcal disease. The vaccine must be administered at least 2 weeks before the first dose to allow adequate antibody development. This is part of the REMS (Risk Evaluation and Mitigation Strategy) program required for eculizumab prescribing."
      },
      {
        question: "A patient with active systemic lupus erythematosus has the following complement levels: C3 45 mg/dL (low), C4 8 mg/dL (low). What do these results indicate?",
        options: [
          "Normal complement levels consistent with inactive disease",
          "Complement consumption by immune complexes indicating active classical pathway activation",
          "Complement overproduction suggesting an acute infection",
          "Terminal complement deficiency requiring genetic testing"
        ],
        correct: 1,
        rationale: "Low C3 AND low C4 in a patient with SLE indicates complement consumption through the classical pathway, which is activated by antigen-antibody immune complexes. The immune complexes formed in active SLE (anti-dsDNA antibodies binding nuclear antigens) activate the classical pathway, consuming C4 (the first component cleaved) and C3 (the central amplification point). Low complement levels correlate with disease activity, particularly lupus nephritis, and serial monitoring helps guide treatment decisions."
      },
      {
        question: "A patient presents with recurrent episodes of non-pruritic angioedema affecting the face and hands. Antihistamines and epinephrine have been ineffective. The C4 level is chronically low. Which condition should be suspected?",
        options: [
          "Chronic idiopathic urticaria with angioedema",
          "Hereditary angioedema due to C1 inhibitor deficiency",
          "ACE inhibitor-induced angioedema",
          "Anaphylaxis from an unidentified allergen"
        ],
        correct: 1,
        rationale: "Hereditary angioedema (HAE) due to C1 inhibitor deficiency causes recurrent non-pruritic angioedema that is BRADYKININ-mediated, not histamine-mediated. This is why antihistamines and epinephrine are ineffective -- they target histamine pathways. A chronically low C4 is a hallmark screening finding because C1 inhibitor normally regulates C1, and without it, C1 continuously cleaves C4. Treatment requires specific agents targeting the bradykinin pathway (icatibant, C1 inhibitor concentrate) or the kallikrein pathway (ecallantide)."
      }
    ]
  },

  "iron-deficiency-anemia": {
    title: "Iron Deficiency Anemia",
    cellular: {
      title: "Pathophysiology of Iron Deficiency and Its Effect on Erythropoiesis",
      content: "Iron deficiency anemia (IDA) is the most common nutritional deficiency and the most common cause of anemia worldwide, affecting an estimated 1.2 billion people globally. It occurs when the body's iron stores are depleted to the point that hemoglobin synthesis is impaired, resulting in the production of abnormally small (microcytic) red blood cells with reduced hemoglobin content (hypochromic). Understanding the pathophysiology of IDA requires knowledge of normal iron metabolism. The adult body contains approximately 3-4 grams of total iron, distributed among several compartments: approximately 65-70% is incorporated into hemoglobin in circulating red blood cells, 10% is in myoglobin (muscle oxygen storage protein), 1-5% is in iron-containing enzymes (cytochromes, catalase, peroxidase), and 20-30% is stored as ferritin and hemosiderin primarily in the liver, bone marrow, and spleen. Dietary iron exists in two forms: heme iron (found in animal products such as meat, poultry, and fish -- derived from hemoglobin and myoglobin, absorbed directly by enterocytes in the duodenum with approximately 15-35% bioavailability) and non-heme iron (found in plant sources, fortified foods, and supplements -- must be reduced from ferric (Fe3+) to ferrous (Fe2+) form by duodenal cytochrome b (Dcytb) before absorption by the divalent metal transporter 1 (DMT1) on enterocyte brush border membranes, with only 2-20% bioavailability). Vitamin C (ascorbic acid) enhances non-heme iron absorption by maintaining iron in the reduced ferrous state and by chelating iron in the acidic gastric environment. Conversely, tannins (in tea and coffee), phytates (in whole grains and legumes), calcium, and antacids inhibit non-heme iron absorption. Once absorbed into the enterocyte, iron can be stored intracellularly as ferritin or exported into the plasma through ferroportin, the only known iron export channel. In the plasma, ferrous iron is oxidized to ferric iron by hephaestin and ceruloplasmin, then bound to transferrin (the iron transport protein) for delivery to tissues throughout the body. Each transferrin molecule can bind two ferric iron atoms. Iron homeostasis is regulated primarily by hepcidin, a peptide hormone produced by hepatocytes. Hepcidin is the master regulator of iron metabolism: it binds to ferroportin on enterocytes, macrophages, and hepatocytes, causing ferroportin internalization and degradation, thereby blocking iron absorption from the gut and iron release from storage cells. Hepcidin production is regulated by iron status (increased when iron stores are adequate, decreased when stores are low), erythropoietic activity (decreased during active red blood cell production to ensure iron supply), inflammation (increased by IL-6 during infection and inflammation -- this is the mechanism of anemia of chronic disease, where elevated hepcidin inappropriately sequesters iron), and hypoxia (decreased to promote iron availability for increased erythropoiesis). Iron deficiency develops through three progressive stages. Stage 1 (iron depletion): body iron stores become depleted as evidenced by a declining serum ferritin level (the most sensitive and specific early marker of iron deficiency); ferritin falls below 30 ng/mL; hemoglobin and MCV remain normal because sufficient iron is still available for current hemoglobin synthesis. Stage 2 (iron-deficient erythropoiesis): iron supply to erythroid precursors in the bone marrow becomes insufficient; serum iron decreases, total iron-binding capacity (TIBC, reflecting transferrin levels) increases (the body produces more transferrin trying to capture limited available iron), transferrin saturation falls below 20%, and zinc protoporphyrin levels rise (zinc substitutes for iron in the protoporphyrin ring when iron is unavailable); hemoglobin may begin to decrease. Stage 3 (iron deficiency anemia): frank anemia develops with hemoglobin below normal ranges (less than 12 g/dL in women, less than 13 g/dL in men); red blood cells become microcytic (MCV less than 80 fL) and hypochromic (MCH less than 27 pg, MCHC less than 32 g/dL); the peripheral blood smear shows microcytic hypochromic red cells, target cells, pencil cells (elliptocytes), and increased red cell distribution width (RDW greater than 14.5%, reflecting variation in red cell size called anisocytosis). The clinical manifestations of IDA reflect impaired oxygen-carrying capacity and tissue iron deficiency. Reduced hemoglobin decreases oxygen delivery to tissues, producing fatigue, exercise intolerance, exertional dyspnea, and tachycardia (compensatory response to maintain tissue oxygenation). Tissue iron deficiency causes additional specific symptoms: pica (craving for non-food items such as ice/pagophagia, clay/geophagia, or starch -- the mechanism is unclear but resolves with iron repletion), restless leg syndrome (iron is a cofactor for tyrosine hydroxylase, involved in dopamine synthesis in the CNS), koilonychia (spoon-shaped nails from impaired nail bed keratinization), angular cheilitis (cracking at the corners of the mouth), glossitis (smooth, swollen tongue from atrophy of filiform papillae), and in severe chronic cases, Plummer-Vinson syndrome (dysphagia from esophageal web formation with iron deficiency and glossitis). IDA in children impairs cognitive development and school performance, and in pregnant women increases the risk of preterm birth, low birth weight, and perinatal mortality. The practical nurse must identify the underlying cause of iron deficiency, as treatment of the anemia without addressing the cause is incomplete care. In premenopausal women, the most common cause is menstrual blood loss (particularly with menorrhagia). In postmenopausal women and men, the most important cause to rule out is gastrointestinal blood loss from colorectal cancer, peptic ulcer disease, or other GI lesions -- all postmenopausal women and men with new IDA should be referred for GI evaluation including colonoscopy."
    },
    riskFactors: [
      "Menstrual blood loss (especially menorrhagia -- the most common cause of IDA in premenopausal women)",
      "Pregnancy and lactation (increased iron demand: pregnancy requires approximately 1000 mg additional iron for expanded blood volume, placental development, and fetal growth)",
      "Inadequate dietary iron intake (vegetarian/vegan diets without adequate non-heme iron sources and vitamin C, restrictive diets, food insecurity)",
      "Gastrointestinal blood loss (peptic ulcer disease, colorectal cancer, inflammatory bowel disease, NSAID use, esophageal varices -- most important cause in men and postmenopausal women)",
      "Malabsorption (celiac disease, inflammatory bowel disease, gastric bypass surgery, chronic antacid/PPI use reducing gastric acid needed for iron absorption)",
      "Rapid growth periods (infancy, adolescence -- increased iron demand for expanding blood volume and tissue growth)",
      "Chronic kidney disease (reduced erythropoietin production, frequent blood sampling, dialysis-related blood loss)"
    ],
    diagnostics: [
      "Serum ferritin (MOST sensitive and specific test for iron deficiency -- less than 30 ng/mL confirms depleted iron stores; less than 15 ng/mL is diagnostic; note: ferritin is an acute phase reactant that may be falsely elevated in infection, inflammation, and malignancy)",
      "Complete blood count (decreased hemoglobin, decreased MCV <80 fL indicating microcytosis, decreased MCH and MCHC indicating hypochromia, elevated RDW >14.5% indicating anisocytosis)",
      "Serum iron and total iron-binding capacity (low serum iron with elevated TIBC; transferrin saturation <20% indicates iron-deficient erythropoiesis)",
      "Peripheral blood smear (microcytic hypochromic red cells, target cells, pencil cells/elliptocytes, increased central pallor)",
      "Reticulocyte count (low or inappropriately normal for degree of anemia -- bone marrow cannot produce adequate reticulocytes without iron)",
      "Stool guaiac/fecal occult blood test (screening for GI blood loss as potential cause of IDA)",
      "Referral for GI evaluation (colonoscopy and/or upper endoscopy for all men and postmenopausal women with new IDA to rule out malignancy)"
    ],
    management: [
      "Oral iron supplementation (ferrous sulfate 325 mg containing 65 mg elemental iron, typically 1-3 times daily -- first-line treatment for uncomplicated IDA)",
      "Optimize iron absorption (take on empty stomach or with vitamin C; separate from calcium, antacids, dairy, tea, and coffee by at least 2 hours)",
      "IV iron therapy for patients who cannot tolerate or absorb oral iron (iron sucrose, ferric carboxymaltose, iron dextran) or who require rapid repletion",
      "Identify and treat the underlying cause (treat menorrhagia, discontinue NSAIDs, evaluate GI tract for bleeding source, manage celiac disease, optimize nutrition)",
      "Blood transfusion for severe symptomatic anemia (hemoglobin <7 g/dL with symptoms of hemodynamic compromise) -- transfusion treats symptoms acutely but does not address the underlying iron deficiency",
      "Monitor response to therapy: reticulocyte count should increase within 7-10 days, hemoglobin should rise 1-2 g/dL every 2-3 weeks, continue iron therapy for 3-6 months after hemoglobin normalizes to replete stores"
    ],
    nursingActions: [
      "Administer oral iron supplements on an empty stomach (1 hour before or 2 hours after meals) with vitamin C source to maximize absorption",
      "Educate patients that oral iron causes black/dark stools (normal and expected, not a sign of GI bleeding) and may cause constipation, nausea, and abdominal discomfort",
      "Monitor for GI side effects of oral iron and teach mitigation strategies (take with small amount of food if GI distress is intolerable, though this reduces absorption by 40-50%)",
      "Assess for signs and symptoms of anemia at each visit (fatigue, pallor, tachycardia, dyspnea on exertion, dizziness, pica)",
      "Monitor hemoglobin, reticulocyte count, and ferritin at appropriate intervals to track treatment response",
      "Administer IV iron per protocol with monitoring for infusion reactions (test dose for iron dextran; monitor vital signs during and 30 minutes after all IV iron infusions)",
      "Educate about dietary iron sources (heme iron: red meat, poultry, fish; non-heme iron: fortified cereals, beans, spinach, tofu) and absorption enhancers/inhibitors",
      "Assess for underlying cause of iron deficiency and ensure appropriate referrals are made (GI evaluation for men and postmenopausal women)"
    ],
    assessmentFindings: [
      "Fatigue and exercise intolerance (most common presenting symptom, due to decreased oxygen-carrying capacity)",
      "Pallor (conjunctival, palmar, and nail bed pallor -- conjunctival pallor is the most reliable clinical indicator)",
      "Tachycardia (compensatory mechanism to maintain tissue oxygen delivery despite reduced hemoglobin)",
      "Koilonychia (spoon-shaped nails -- specific but late finding of severe chronic iron deficiency)",
      "Pica (craving non-food items, especially ice/pagophagia -- a specific symptom of iron deficiency that resolves with iron repletion)",
      "Angular cheilitis and glossitis (cracking at mouth corners and smooth, painful tongue from epithelial changes due to iron deficiency)",
      "Laboratory findings: low ferritin, low serum iron, high TIBC, low transferrin saturation, microcytic hypochromic anemia on CBC"
    ],
    signs: {
      left: [
        "Mild fatigue with exertion",
        "Slight pallor of conjunctivae",
        "Mild tachycardia at rest",
        "Ice craving (pagophagia)",
        "Borderline low ferritin (15-30 ng/mL)"
      ],
      right: [
        "Severe anemia (Hgb <7 g/dL) with hemodynamic compromise",
        "High-output heart failure from chronic severe anemia",
        "Plummer-Vinson syndrome (dysphagia from esophageal webs)",
        "Severe koilonychia with nail bed changes",
        "Concurrent GI malignancy as the underlying cause"
      ]
    },
    medications: [
      {
        name: "Ferrous Sulfate",
        type: "Oral iron supplement (ferrous iron salt)",
        action: "Provides elemental iron (65 mg per 325 mg tablet) in the ferrous (Fe2+) form for absorption by divalent metal transporter 1 (DMT1) in the duodenal enterocytes; absorbed iron is incorporated into transferrin for transport to the bone marrow, where it is used for hemoglobin synthesis in developing red blood cells; repletes depleted iron stores (ferritin) and corrects microcytic hypochromic anemia over weeks to months",
        sideEffects: "GI side effects (nausea, constipation, abdominal cramping, diarrhea -- most common reason for non-adherence), black/tarry stools (normal, from unabsorbed iron oxidation in GI tract), metallic taste, teeth staining with liquid preparations (use straw and rinse mouth)",
        contra: "Hemochromatosis or other iron overload disorders; hemolytic anemias where iron is not deficient (may worsen iron overload); known hypersensitivity; concurrent parenteral iron therapy",
        pearl: "Take on empty stomach 1 hour before or 2 hours after meals for maximum absorption; co-administer with vitamin C (250 mg) to enhance absorption; separate from calcium, antacids, dairy products, tea, coffee, and whole grains by at least 2 hours (these inhibit absorption); if GI intolerance limits adherence, alternate-day dosing (every other day) may be equally effective with fewer side effects based on recent evidence; continue therapy for 3-6 months AFTER hemoglobin normalizes to fully replete iron stores"
      },
      {
        name: "Ferric Carboxymaltose (Injectafer)",
        type: "Intravenous iron replacement (iron-carbohydrate complex)",
        action: "Provides elemental iron in a carbohydrate shell complex that is taken up by macrophages in the reticuloendothelial system; iron is released intracellularly and either stored as ferritin or transferred to transferrin for transport to the bone marrow for hemoglobin synthesis; allows rapid repletion of iron stores with high single-dose capacity (up to 750 mg per infusion), avoiding the absorption limitations and GI side effects of oral iron",
        sideEffects: "Hypophosphatemia (can be severe and symptomatic with repeated doses -- monitor phosphate levels), injection site reactions, headache, nausea, hypertension, flushing, dizziness, rare anaphylactoid reactions",
        contra: "Known hypersensitivity to ferric carboxymaltose or any component; hemochromatosis or iron overload; first trimester of pregnancy",
        pearl: "Does NOT require test dose (unlike iron dextran); can administer up to 750 mg in a single 15-minute infusion (maximum 2 doses separated by at least 7 days for total of 1500 mg); monitor serum phosphate levels especially with repeated courses due to risk of symptomatic hypophosphatemia; have resuscitation equipment available during infusion although anaphylaxis is very rare; expect temporary brown discoloration of infusion site"
      },
      {
        name: "Ascorbic Acid (Vitamin C)",
        type: "Water-soluble vitamin (iron absorption enhancer)",
        action: "Reduces ferric iron (Fe3+) to ferrous iron (Fe2+) in the gastric lumen, the form required for absorption by DMT1 in the duodenum; chelates iron in the acidic stomach environment, keeping it soluble and bioavailable as it passes into the higher pH duodenum; also enhances iron mobilization from ferritin stores; co-administration with oral iron supplements can increase absorption by 2-3 fold",
        sideEffects: "GI upset at high doses (nausea, diarrhea, abdominal cramping), kidney stone formation (oxalate stones) with chronic high doses (>2g/day), false-negative fecal occult blood test results",
        contra: "Known hypersensitivity; history of oxalate kidney stones (relative); hemochromatosis (enhances iron absorption in patients who already have iron overload)",
        pearl: "Recommend 250 mg of vitamin C taken simultaneously with each oral iron dose to significantly enhance absorption; a glass of orange juice (approximately 125 mg vitamin C) provides a practical dietary alternative; particularly important for patients taking non-heme iron supplements as the absorption benefit is greatest for non-heme iron; avoid taking vitamin C with iron if the patient also has hemochromatosis"
      }
    ],
    pearls: [
      "Serum ferritin is the MOST sensitive and specific test for iron deficiency -- it reflects total body iron stores and falls before any other iron parameter; however, ferritin is also an acute phase reactant that rises during inflammation, infection, and malignancy, potentially masking concurrent iron deficiency",
      "All men and postmenopausal women with new iron deficiency anemia MUST be evaluated for GI blood loss with colonoscopy (and often upper endoscopy) to rule out colorectal cancer -- treating the anemia without investigating the cause is incomplete care and may delay cancer diagnosis",
      "Oral iron causes black/dark stools -- educate patients that this is NORMAL and expected (from oxidized unabsorbed iron) and is NOT a sign of GI bleeding; this is the most common cause of unnecessary patient anxiety and emergency visits during iron therapy",
      "Take oral iron on an empty stomach with vitamin C for maximum absorption; separate from calcium, dairy, antacids, tea, coffee, and PPIs by at least 2 hours -- these substances significantly reduce non-heme iron absorption",
      "Continue iron supplementation for 3-6 months AFTER hemoglobin normalizes to fully replete iron stores (ferritin >50 ng/mL); many patients and providers stop iron too early when hemoglobin normalizes, leading to recurrent anemia",
      "Pica (especially pagophagia -- ice craving) is a specific symptom of iron deficiency that resolves with iron repletion; always ask about unusual cravings during assessment of anemia as patients may not volunteer this information",
      "Recent evidence supports alternate-day iron dosing (every other day) as equally effective as daily dosing with significantly fewer GI side effects -- hepcidin levels rise after each iron dose, reducing absorption from subsequent doses taken within 24 hours"
    ],
    quiz: [
      {
        question: "A 62-year-old man presents with fatigue and is found to have hemoglobin of 9.5 g/dL, MCV 72 fL, and ferritin 8 ng/mL. In addition to starting iron supplementation, what is the MOST important next step?",
        options: [
          "Prescribe a high-iron diet and schedule follow-up in 3 months",
          "Order a reticulocyte count to confirm the bone marrow is responding",
          "Refer for colonoscopy and upper endoscopy to evaluate for GI blood loss and malignancy",
          "Obtain a peripheral blood smear to confirm microcytosis"
        ],
        correct: 2,
        rationale: "In a man of any age or a postmenopausal woman with new iron deficiency anemia, the most important step (beyond initiating treatment) is to evaluate for gastrointestinal blood loss, particularly colorectal cancer. This patient's microcytic anemia (MCV 72) with very low ferritin (8 ng/mL) confirms iron deficiency, and in a 62-year-old man, chronic GI blood loss is the most likely cause until proven otherwise. Delaying GI evaluation risks missing a potentially curable malignancy."
      },
      {
        question: "A patient taking ferrous sulfate for iron deficiency anemia reports that the medication causes significant nausea and constipation. Which advice is MOST appropriate?",
        options: [
          "Discontinue the iron supplement permanently and rely on dietary iron alone",
          "Take the iron with a full glass of milk to reduce GI irritation",
          "Try taking the iron every other day instead of daily, which may reduce side effects while maintaining efficacy",
          "Switch to IV iron therapy as the first alternative"
        ],
        correct: 2,
        rationale: "Recent evidence supports alternate-day oral iron dosing as equally effective as daily dosing with significantly fewer GI side effects. This approach works because each iron dose triggers a rise in hepcidin (the iron regulatory hormone) that reduces absorption from doses taken within 24 hours; spacing doses 48 hours apart allows hepcidin levels to normalize between doses. Taking iron with milk would reduce absorption (calcium inhibits iron absorption). IV iron is reserved for patients who truly cannot tolerate or absorb oral iron."
      },
      {
        question: "Which assessment finding is most specific for iron deficiency rather than other types of anemia?",
        options: [
          "Fatigue and exercise intolerance",
          "Pallor of the conjunctivae",
          "Pica with ice craving (pagophagia)",
          "Tachycardia at rest"
        ],
        correct: 2,
        rationale: "Pica, particularly pagophagia (ice craving), is a specific symptom of iron deficiency that is not seen in other types of anemia. The mechanism is not fully understood but likely involves altered neurological function due to iron's role as a cofactor in neurotransmitter synthesis. Pica resolves with iron repletion, confirming the causal relationship. Fatigue, pallor, and tachycardia are nonspecific symptoms that occur in all types of anemia regardless of cause."
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
