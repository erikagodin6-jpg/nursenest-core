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
  "alopecia-rpn": {
    title: "Alopecia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Alopecia",
      content: "Alopecia refers to partial or complete loss of hair from areas of the body where it normally grows. The hair follicle is a complex mini-organ embedded in the dermis that undergoes a continuous cycle of growth (anagen phase, lasting 2-7 years), regression (catagen phase, lasting 2-3 weeks), and rest (telogen phase, lasting approximately 3 months). At any given time, roughly 85-90% of scalp hairs are in the anagen phase. Normal hair loss is approximately 50-100 hairs per day. Alopecia areata is an autoimmune condition in which CD8+ T-lymphocytes attack the hair follicle bulb during the anagen phase, causing the hair to prematurely enter the catagen and telogen phases and fall out. The immune system specifically targets the hair follicle's immune privilege -- a mechanism that normally protects the follicle from immune attack. The result is well-circumscribed, smooth, round patches of complete hair loss without scarring or skin changes. Alopecia totalis involves complete scalp hair loss, while alopecia universalis involves loss of all body hair. Androgenetic alopecia (pattern baldness) is the most common form of hair loss, affecting both males and females. In this condition, dihydrotestosterone (DHT), a potent androgen converted from testosterone by the enzyme 5-alpha reductase, binds to androgen receptors in genetically susceptible hair follicles, causing progressive follicular miniaturization. Over successive hair cycles, the follicle produces thinner, shorter, less pigmented vellus hairs until it eventually ceases production entirely. In males this manifests as temporal recession and vertex thinning; in females it presents as diffuse thinning along the central part while maintaining the frontal hairline. Other causes of alopecia include telogen effluvium (diffuse shedding 2-3 months after a physiological stressor such as surgery, high fever, childbirth, or emotional trauma), traction alopecia (chronic tension on hair from tight hairstyles causing follicular damage), trichotillomania (compulsive hair pulling disorder), cicatricial (scarring) alopecia (inflammatory destruction of the follicle with permanent hair loss), and medication-induced alopecia (chemotherapy agents, anticoagulants, retinoids, antithyroid drugs). The psychological impact of hair loss is significant and often underestimated: patients may experience depression, anxiety, social withdrawal, decreased self-esteem, and impaired quality of life. The practical nurse plays a critical role in providing compassionate assessment, monitoring treatment response, educating patients about their condition and treatment options, and offering emotional support throughout the process."
    },
    riskFactors: [
      "Family history of alopecia areata or androgenetic alopecia (strong genetic component with polygenic inheritance)",
      "Autoimmune conditions (thyroid disease, vitiligo, lupus, rheumatoid arthritis -- associated with alopecia areata)",
      "Hormonal changes (pregnancy, postpartum, menopause, polycystic ovary syndrome, thyroid disorders)",
      "Physical or emotional stress (telogen effluvium occurs 2-3 months after major physiological or psychological stressor)",
      "Nutritional deficiencies (iron deficiency, zinc deficiency, biotin deficiency, protein malnutrition)",
      "Medications (chemotherapy agents, anticoagulants such as heparin and warfarin, retinoids, beta-blockers, lithium)",
      "Chronic traction on hair (tight ponytails, braids, weaves, hair extensions causing traction alopecia)"
    ],
    diagnostics: [
      "Scalp examination: assess distribution pattern (patchy vs diffuse), presence of exclamation point hairs (short broken hairs that taper at the base -- pathognomonic for alopecia areata), and scalp skin changes",
      "Hair pull test: gently pull on a cluster of 40-60 hairs; more than 6 hairs extracted suggests active shedding (positive pull test); helps differentiate telogen effluvium from alopecia areata",
      "Dermoscopy (trichoscopy): non-invasive magnified examination of the scalp revealing yellow dots, black dots, broken hairs, and dystrophic hair patterns specific to different alopecia types",
      "Scalp biopsy: performed when diagnosis is uncertain; histopathology reveals peribulbar lymphocytic infiltrate (swarm of bees pattern) in alopecia areata; miniaturized follicles in androgenetic alopecia",
      "Thyroid function tests (TSH, free T4): both hypothyroidism and hyperthyroidism cause diffuse hair loss; must be ruled out in all new-onset alopecia",
      "Complete blood count, serum ferritin, and iron studies: iron deficiency (ferritin below 30 ng/mL) is a common reversible cause of hair loss; serum zinc and vitamin D levels may also be assessed"
    ],
    management: [
      "Alopecia areata (limited patches): intralesional corticosteroid injections (triamcinolone acetonide) every 4-6 weeks as first-line therapy; topical corticosteroids for maintenance",
      "Alopecia areata (extensive): topical immunotherapy (diphenylcyclopropenone or squaric acid dibutylester) to redirect immune response; JAK inhibitors (baricitinib) for severe cases",
      "Androgenetic alopecia: topical minoxidil 2% (females) or 5% (males) applied twice daily; oral finasteride 1 mg daily for males (5-alpha reductase inhibitor); takes 3-6 months for visible results",
      "Telogen effluvium: identify and treat underlying cause (correct nutritional deficiency, manage thyroid disorder, reduce stress); reassure patient that hair regrowth typically occurs within 6-12 months",
      "Nutritional support: ensure adequate protein intake (0.8 g/kg/day minimum), supplement iron if ferritin below 30 ng/mL, consider biotin supplementation",
      "Psychological support: screen for depression and anxiety using validated tools; refer to mental health professional or support groups; discuss wig/hairpiece options if desired",
      "Scalp protection: advise sunscreen or head covering for areas of hair loss to prevent sunburn; gentle hair care practices to minimize further mechanical damage"
    ],
    nursingActions: [
      "Perform systematic scalp assessment documenting hair density, distribution of loss, scalp skin condition, and presence of exclamation point hairs or scarring",
      "Administer intralesional corticosteroid injections as ordered using proper technique (0.1 mL injections spaced 1 cm apart into the mid-dermis)",
      "Monitor for local side effects of corticosteroid injections including skin atrophy, depigmentation, and pain at injection site; report if persistent",
      "Educate patient on proper application of topical minoxidil: apply to dry scalp, allow to dry completely before styling, wash hands thoroughly after application",
      "Assess psychological impact using open-ended questions about self-image, social functioning, and coping strategies; document and report significant distress",
      "Teach patients to avoid harsh chemical treatments (perms, relaxers, excessive heat styling), tight hairstyles, and vigorous towel drying that can worsen hair loss",
      "Document response to treatment at each visit by photographing affected areas and measuring patch sizes using a consistent measurement technique"
    ],
    assessmentFindings: [
      "Alopecia areata: smooth, round, well-demarcated patches of complete hair loss without scarring; exclamation point hairs at patch margins; nail pitting may be present",
      "Androgenetic alopecia in males: progressive frontal hairline recession (temporal M-pattern) and vertex (crown) thinning; Hamilton-Norwood classification stages I-VII",
      "Androgenetic alopecia in females: diffuse thinning along the central part with preservation of frontal hairline; Ludwig classification grades I-III; widening part line",
      "Telogen effluvium: diffuse, generalized thinning without distinct patches; positive hair pull test; history of physiological stressor 2-3 months prior to onset",
      "Traction alopecia: hair loss along the hairline margins or wherever chronic tension is applied; follicular papules or pustules in early stages; scarring in late stages",
      "Cicatricial (scarring) alopecia: smooth, shiny, atrophic skin replacing follicles; loss of follicular ostia (pore openings); permanent hair loss in affected areas",
      "Psychological findings: expressed distress about appearance, social avoidance, decreased self-care behaviors, sleep disturbance, or depressive symptoms related to hair loss"
    ],
    signs: {
      left: [
        "Gradual increase in hair shedding noticed on pillow or in shower drain",
        "Thinning of hair density without complete bald patches",
        "Increased visibility of scalp through hair (widening part line)",
        "Exclamation point hairs at margins of new patches",
        "Mild scalp tenderness or tingling (trichodynia)",
        "Nail changes including pitting, ridging, or brittleness (associated with alopecia areata)"
      ],
      right: [
        "Rapid progression to alopecia totalis (complete scalp hair loss) within weeks",
        "Ophiasis pattern (band-like hair loss along temporal and occipital regions -- treatment resistant)",
        "Signs of secondary infection in areas of scarring alopecia (erythema, purulent drainage, fever)",
        "Severe psychological distress including suicidal ideation related to hair loss",
        "Anaphylactic reaction to topical immunotherapy (dyspnea, urticaria, hypotension)",
        "Systemic signs suggesting underlying autoimmune disease (joint pain, butterfly rash, thyroid enlargement)"
      ]
    },
    medications: [
      {
        name: "Minoxidil (Rogaine)",
        type: "Vasodilator / hair growth stimulant",
        action: "Opens potassium channels in vascular smooth muscle cells surrounding hair follicles, increasing local blood flow and delivering more oxygen and nutrients to the follicular papilla. Prolongs the anagen (growth) phase and stimulates follicle transition from telogen (rest) to anagen, promoting thicker terminal hair growth from miniaturized vellus follicles",
        sideEffects: "Scalp irritation and dryness (contact dermatitis), initial increased hair shedding during first 2-4 weeks (paradoxical shedding as telogen hairs are pushed out by new anagen hairs), unwanted facial hair growth (hypertrichosis) if applied to face or transferred by contact, headache, dizziness",
        contra: "Hypersensitivity to minoxidil or propylene glycol (vehicle); pregnancy and breastfeeding (Category C -- potential fetal harm); pheochromocytoma; caution in patients with cardiovascular disease",
        pearl: "Patients must be counseled that initial shedding in the first 2-4 weeks is normal and indicates the medication is working; results take 3-6 months and treatment must be continued indefinitely or hair loss resumes; apply only to dry scalp for optimal absorption"
      },
      {
        name: "Finasteride (Propecia/Proscar)",
        type: "5-alpha reductase inhibitor (Type II)",
        action: "Competitively inhibits the Type II 5-alpha reductase enzyme, which converts testosterone to dihydrotestosterone (DHT) in the hair follicle. Reduces scalp DHT levels by approximately 60-70%, slowing follicular miniaturization and allowing partially miniaturized follicles to recover and produce thicker terminal hairs",
        sideEffects: "Decreased libido (1.8%), erectile dysfunction (1.3%), decreased ejaculate volume, gynecomastia (breast enlargement and tenderness), depression or mood changes, and potential post-finasteride syndrome (persistent sexual side effects after discontinuation -- rare but reported)",
        contra: "Women of childbearing potential (teratogenic -- Category X; causes feminization of male fetus genitalia); pregnant women should not handle crushed or broken tablets due to transdermal absorption risk; hepatic impairment (hepatically metabolized)",
        pearl: "Approved only for male androgenetic alopecia at 1 mg daily dose; women of childbearing age must NEVER take finasteride or handle broken tablets; PSA levels decrease by approximately 50% during therapy -- inform urologist to double PSA values for accurate prostate cancer screening"
      },
      {
        name: "Triamcinolone Acetonide (Kenalog)",
        type: "Intermediate-acting corticosteroid (intralesional injection)",
        action: "Suppresses the peribulbar T-lymphocyte inflammatory infiltrate that attacks the hair follicle bulb in alopecia areata. Inhibits cytokine production (interferon-gamma, interleukin-2), reduces lymphocyte proliferation, and restores the hair follicle immune privilege, allowing the follicle to re-enter the anagen growth phase",
        sideEffects: "Local skin atrophy (thinning and depression of skin at injection sites), hypopigmentation (lightening of skin at injection sites -- more visible in darker skin), transient pain at injection site, telangiectasia (visible small blood vessels), rarely systemic effects if large areas treated (adrenal suppression, hyperglycemia)",
        contra: "Active skin infection at injection site (bacterial, viral, or fungal); widespread alopecia totalis or universalis (impractical to inject entire scalp); known hypersensitivity to corticosteroids; caution in patients with diabetes (may elevate blood glucose)",
        pearl: "Concentration of 2.5-10 mg/mL is used for scalp injections (typically 5 mg/mL); injections are spaced 1 cm apart, 0.05-0.1 mL per injection into the mid-dermis; maximum 3 mL per session; treatments repeated every 4-6 weeks; hair regrowth typically appears within 4-8 weeks if treatment is effective"
      }
    ],
    pearls: [
      "Exclamation point hairs (short hairs that taper at the base and are thicker at the distal end) at the margins of bald patches are pathognomonic for active alopecia areata -- their presence indicates ongoing immune attack",
      "The hair pull test is a simple bedside screening tool: gently pull 40-60 hairs between thumb and forefinger from base to tip; extracting more than 6 hairs (greater than 10%) indicates active hair loss requiring further investigation",
      "Minoxidil causes paradoxical increased shedding during the first 2-4 weeks of use -- educate patients that this is expected and indicates the medication is pushing telogen hairs out to make way for new anagen growth",
      "Finasteride is absolutely contraindicated in women of childbearing potential -- even handling crushed or broken tablets poses a teratogenic risk through transdermal absorption that can feminize a male fetus",
      "Nail pitting (small depressions in the nail plate) occurs in approximately 10-20% of patients with alopecia areata and correlates with disease severity -- always examine the nails during scalp assessment",
      "Psychological assessment is essential: hair loss significantly impacts quality of life, self-esteem, and mental health -- screen for depression and anxiety at every visit and refer to mental health services when indicated",
      "Iron deficiency is one of the most common correctable causes of hair loss in women -- check serum ferritin in all female patients presenting with new-onset diffuse hair loss; target ferritin above 30 ng/mL for optimal hair growth"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient with newly diagnosed alopecia areata. Which assessment finding is most characteristic of this condition?",
        options: [
          "Diffuse thinning across the entire scalp with a positive hair pull test",
          "Smooth, round patches of complete hair loss with exclamation point hairs at the margins",
          "Hair loss along the frontal hairline with follicular papules",
          "Scarred, shiny patches with permanent loss of follicular openings"
        ],
        correct: 1,
        rationale: "Alopecia areata presents with smooth, well-circumscribed, round patches of complete hair loss without scarring. Exclamation point hairs (short hairs that taper at the base) at the margins of patches are pathognomonic for this condition and indicate active immune-mediated follicular attack."
      },
      {
        question: "A patient prescribed topical minoxidil reports increased hair shedding after 2 weeks of use and wants to discontinue the medication. What is the most appropriate nursing response?",
        options: [
          "Discontinue the medication immediately and report to the prescriber",
          "Increase the application frequency to twice the prescribed dose",
          "Educate the patient that initial shedding is expected and indicates the medication is working",
          "Switch to an alternative hair loss treatment"
        ],
        correct: 2,
        rationale: "Paradoxical shedding during the first 2-4 weeks of minoxidil use is a normal and expected pharmacological response. The medication pushes telogen (resting) hairs out of the follicle to make room for new anagen (growing) hairs. Patients should be counseled about this expected effect before starting therapy to promote adherence."
      },
      {
        question: "A practical nurse is caring for a female patient of childbearing age with hair loss. Which medication must the nurse verify is NOT prescribed for this patient?",
        options: [
          "Topical minoxidil 2%",
          "Iron supplementation",
          "Finasteride",
          "Topical corticosteroids"
        ],
        correct: 2,
        rationale: "Finasteride is classified as Category X and is absolutely contraindicated in women of childbearing potential. It inhibits 5-alpha reductase and can cause feminization of a male fetus genitalia. Women of childbearing age should not take finasteride or even handle crushed or broken tablets due to transdermal absorption risk."
      }
    ]
  },

  "bullous-pemphigoid-rpn": {
    title: "Bullous Pemphigoid for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Bullous Pemphigoid",
      content: "Bullous pemphigoid (BP) is a chronic autoimmune blistering disease that primarily affects older adults, with a peak incidence in individuals over 70 years of age. It is the most common autoimmune blistering disease, occurring more frequently than pemphigus vulgaris. The pathogenesis involves the production of IgG autoantibodies directed against two hemidesmosomal proteins at the dermal-epidermal junction: BP180 (also called type XVII collagen or BPAG2) and BP230 (also called BPAG1). These hemidesmosomes normally function as anchoring structures that attach the basal keratinocytes of the epidermis to the underlying basement membrane zone and dermis, maintaining the structural integrity of the skin. When IgG autoantibodies bind to BP180 and BP230, they activate the complement cascade (particularly C3 and C5a) at the basement membrane zone. This complement activation recruits inflammatory cells, primarily eosinophils and neutrophils, to the dermal-epidermal junction. These inflammatory cells release proteolytic enzymes (matrix metalloproteinases, elastase, and gelatinase) that degrade the structural proteins anchoring the epidermis to the dermis. The result is a subepidermal split -- the epidermis separates from the dermis BELOW the basal cell layer, creating tense, fluid-filled bullae (blisters). Because the blister roof consists of the full thickness of the epidermis (all layers intact), the bullae in bullous pemphigoid are characteristically tense and difficult to rupture, in contrast to the flaccid, easily ruptured bullae of pemphigus vulgaris where the split occurs within the epidermis itself. The Nikolsky sign is NEGATIVE in bullous pemphigoid -- lateral pressure on uninvolved skin adjacent to a blister does not cause the epidermis to shear off, because the intra-epidermal cell-to-cell adhesion (desmosomes) remains intact. This is a critical distinguishing feature from pemphigus vulgaris, where the Nikolsky sign is positive. The bullae arise on either normal-appearing skin or on erythematous, urticarial (hive-like) plaques. Common sites include the lower abdomen, inner thighs, groin, axillae, and flexural surfaces of the arms. Mucosal involvement (oral, ocular, or genital) occurs in approximately 10-30% of cases but is much less prominent than in pemphigus vulgaris. The disease course is typically chronic with periods of exacerbation and remission. Without treatment, BP causes significant morbidity from pain, pruritus, secondary infection of denuded skin, fluid loss, and impaired mobility. Mortality is increased in elderly patients, primarily due to complications of immunosuppressive therapy (infection, sepsis) rather than the disease itself."
    },
    riskFactors: [
      "Advanced age (peak incidence over 70 years; incidence increases significantly with each decade of life)",
      "Neurological disorders (dementia, Parkinson disease, stroke, multiple sclerosis -- strong epidemiological association suggesting shared neuronal and epidermal antigens)",
      "Medications (loop diuretics such as furosemide, ACE inhibitors, antibiotics such as penicillin and fluoroquinolones, PD-1/PD-L1 checkpoint inhibitors in immunotherapy)",
      "Immobility and prolonged bed rest (pressure and friction may trigger blister formation on vulnerable skin)",
      "Other autoimmune conditions (rheumatoid arthritis, Hashimoto thyroiditis, ulcerative colitis)",
      "Recent vaccination or UV radiation exposure (reported as triggering factors in predisposed individuals)",
      "Diabetes mellitus (impaired wound healing increases complication risk; DPP-4 inhibitors such as vildagliptin linked to BP development)"
    ],
    diagnostics: [
      "Skin biopsy (perilesional -- from edge of a fresh blister): histopathology shows subepidermal blister with eosinophilic infiltrate in the dermis; intact epidermis forming the blister roof confirms subepidermal split",
      "Direct immunofluorescence (DIF) of perilesional skin: gold standard for diagnosis; shows linear deposition of IgG and C3 along the basement membrane zone in a continuous, uninterrupted line",
      "Indirect immunofluorescence on salt-split skin: patient's serum tested against human skin substrate split at the lamina lucida; antibodies bind to the epidermal (roof) side in BP, distinguishing it from epidermolysis bullosa acquisita (dermal side binding)",
      "ELISA for anti-BP180 and anti-BP230 antibodies: quantitative measurement of circulating autoantibodies; anti-BP180 titers correlate with disease activity and can be used to monitor treatment response",
      "Complete blood count: peripheral eosinophilia is common and supports the diagnosis; also monitors for bone marrow suppression during immunosuppressive therapy",
      "Nikolsky sign testing: apply lateral pressure to uninvolved skin adjacent to a blister -- NEGATIVE in bullous pemphigoid (epidermis does not shear off); positive Nikolsky sign suggests pemphigus vulgaris instead"
    ],
    management: [
      "Mild to moderate disease (localized): potent topical corticosteroids (clobetasol propionate 0.05%) applied to affected areas twice daily; shown to be as effective as systemic corticosteroids with fewer side effects",
      "Moderate to severe disease (widespread): systemic corticosteroids (prednisone 0.5-1 mg/kg/day) with gradual taper over weeks to months as blisters resolve; always initiate steroid-sparing agent concurrently",
      "Steroid-sparing immunosuppressants: dapsone, mycophenolate mofetil, azathioprine, or methotrexate used to allow corticosteroid dose reduction and prevent relapse during taper",
      "Wound care for denuded bullae: clean with sterile normal saline, apply non-adherent dressings (petrolatum-impregnated gauze), change dressings daily or as ordered; maintain moist wound healing environment",
      "Blister management: large tense bullae may be aspirated with sterile needle (leaving the roof intact as a biological dressing) to promote comfort and reduce rupture risk",
      "Infection prevention: monitor for signs of secondary bacterial infection (increased erythema, purulent drainage, fever); obtain wound cultures if infection suspected; administer prescribed antibiotics",
      "Nutritional support: high-protein diet (1.2-1.5 g/kg/day) to support wound healing; supplement vitamin C and zinc; monitor albumin and prealbumin levels"
    ],
    nursingActions: [
      "Perform daily comprehensive skin assessment documenting number, size, location, and characteristics of bullae (tense vs ruptured), surrounding skin condition, and signs of infection",
      "Handle the patient gently during positioning, transfers, and hygiene care -- minimize friction and shearing forces that can precipitate new blister formation or rupture existing bullae",
      "Perform Nikolsky sign assessment as directed: apply lateral pressure to perilesional skin -- document as negative (expected in BP) and report if positive (suggests pemphigus vulgaris and requires diagnostic revision)",
      "Administer prescribed corticosteroids and immunosuppressants; monitor for adverse effects including hyperglycemia, hypertension, osteoporosis, cushingoid features, and signs of infection",
      "Provide meticulous wound care using aseptic technique: cleanse denuded areas gently with normal saline, apply prescribed topical agents, and cover with non-adherent dressings to promote healing",
      "Monitor fluid and electrolyte balance in patients with extensive bullae: large areas of denuded skin can lead to significant protein and fluid loss similar to burn patients",
      "Educate patient and caregivers about the chronic nature of BP, medication adherence importance, signs of flare (new blister formation, increased pruritus), and when to seek medical attention"
    ],
    assessmentFindings: [
      "Tense, fluid-filled bullae (1-7 cm in diameter) arising on erythematous or urticarial plaques or on normal-appearing skin; bullae are difficult to rupture due to full-thickness epidermal roof",
      "Predilection for lower abdomen, inner thighs, groin, axillae, and flexural surfaces; may also involve trunk and proximal extremities",
      "Intense pruritus (often the presenting and most distressing symptom); may precede blister formation by weeks to months as urticarial plaques",
      "Nikolsky sign NEGATIVE: lateral pressure on perilesional uninvolved skin does not cause epidermal separation (distinguishes BP from pemphigus vulgaris)",
      "Ruptured bullae leave superficial erosions that tend to heal without scarring but may develop secondary crusting; erosions less extensive than in pemphigus vulgaris",
      "Oral mucosal involvement (erythema, erosions, intact vesicles on buccal mucosa or palate) in approximately 10-30% of patients; less severe than in pemphigus vulgaris"
    ],
    signs: {
      left: [
        "Urticarial (hive-like) plaques preceding blister formation",
        "Intense pruritus without visible skin changes (prodromal phase)",
        "Small, scattered tense bullae on trunk or extremities",
        "Mild erythema surrounding intact bullae",
        "Superficial erosions at sites of ruptured bullae healing without scarring",
        "Mild peripheral eosinophilia on blood work"
      ],
      right: [
        "Widespread bullae covering greater than 50% of body surface area with extensive denuded skin",
        "Signs of secondary bacterial infection (purulent drainage, expanding erythema, fever, elevated WBC)",
        "Sepsis in elderly immunosuppressed patients (tachycardia, hypotension, altered mental status, fever or hypothermia)",
        "Significant hypoalbuminemia from protein loss through denuded skin (edema, poor wound healing)",
        "Corticosteroid complications (uncontrolled hyperglycemia, GI bleeding, pathologic fractures)",
        "Oral mucosal involvement impairing adequate nutrition and fluid intake"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the autoimmune inflammatory response by inhibiting T-cell activation, reducing IgG autoantibody production against BP180/BP230, blocking complement activation at the basement membrane zone, and reducing eosinophil and neutrophil recruitment to the dermal-epidermal junction. This halts the enzymatic degradation of hemidesmosomes and allows the subepidermal split to heal",
        sideEffects: "Hyperglycemia (monitor blood glucose in all patients, especially diabetics), weight gain and cushingoid features, osteoporosis (especially in elderly -- the primary population affected), hypertension, immunosuppression with increased infection risk, peptic ulcer disease, adrenal suppression with prolonged use, mood changes and insomnia, cataracts and glaucoma",
        contra: "Active untreated systemic infection (immunosuppression worsens infection); poorly controlled diabetes without glucose monitoring plan; active peptic ulcer disease without gastroprotection; live vaccines during therapy",
        pearl: "Start at 0.5-1 mg/kg/day for moderate-severe BP; begin taper once no new blisters have formed for 2 weeks; taper slowly (reduce by no more than 10-20% every 2-4 weeks) to prevent rebound flare; always co-prescribe calcium, vitamin D, and consider bisphosphonate for osteoporosis prevention in elderly patients"
      },
      {
        name: "Dapsone (Diaminodiphenyl sulfone)",
        type: "Anti-inflammatory sulfonamide / steroid-sparing agent",
        action: "Inhibits neutrophil and eosinophil chemotaxis, adherence, and degranulation at the dermal-epidermal junction. Blocks the myeloperoxidase-halide cytotoxic system in neutrophils and suppresses the release of inflammatory mediators (prostaglandins and leukotrienes) that drive tissue damage in the subepidermal blister formation of BP",
        sideEffects: "Dose-dependent hemolytic anemia (occurs in ALL patients to some degree), methemoglobinemia (cyanosis with normal PaO2), peripheral neuropathy (motor more than sensory), agranulocytosis (rare but potentially fatal -- first 3 months highest risk), hepatotoxicity, dapsone hypersensitivity syndrome (fever, rash, hepatitis -- within first 6 weeks)",
        contra: "Glucose-6-phosphate dehydrogenase (G6PD) deficiency (severe hemolytic crisis -- must screen before starting); severe anemia (hemoglobin below 8 g/dL); severe hepatic or renal impairment; sulfonamide allergy (possible cross-reactivity)",
        pearl: "G6PD level MUST be checked before initiating dapsone therapy -- G6PD-deficient patients develop severe hemolytic anemia; monitor CBC weekly for first month, then monthly; reticulocyte count rises as bone marrow compensates for hemolysis; monitor methemoglobin levels if patient develops cyanosis"
      },
      {
        name: "Mycophenolate Mofetil (CellCept)",
        type: "Immunosuppressant (inosine monophosphate dehydrogenase inhibitor) / steroid-sparing agent",
        action: "Selectively inhibits inosine monophosphate dehydrogenase (IMPDH), the rate-limiting enzyme in the de novo synthesis of guanosine nucleotides. Because lymphocytes (B-cells and T-cells) depend exclusively on the de novo pathway for purine synthesis, mycophenolate selectively suppresses lymphocyte proliferation while sparing other cell types. This reduces autoantibody production (anti-BP180/BP230 IgG) and T-cell mediated inflammation driving BP",
        sideEffects: "GI disturbances (nausea, vomiting, diarrhea, abdominal pain -- most common dose-limiting effects), increased infection risk (particularly opportunistic infections such as CMV and herpes), bone marrow suppression (leukopenia, anemia, thrombocytopenia), hepatotoxicity, teratogenicity (Category D)",
        contra: "Pregnancy and breastfeeding (teratogenic -- Category D; effective contraception required for women of childbearing potential); severe active infection; concomitant live vaccine administration; hypersensitivity to mycophenolate or mycophenolic acid",
        pearl: "Takes 4-8 weeks to reach full therapeutic effect -- must overlap with corticosteroid therapy during this period; monitor CBC every 2 weeks for the first 3 months then monthly; administer on an empty stomach (1 hour before or 2 hours after meals) for optimal absorption; do not crush or open capsules"
      }
    ],
    pearls: [
      "The Nikolsky sign is NEGATIVE in bullous pemphigoid -- lateral pressure on uninvolved perilesional skin does NOT cause epidermal separation; a positive Nikolsky sign points to pemphigus vulgaris where the intra-epidermal split allows the epidermis to shear",
      "Bullous pemphigoid bullae are TENSE and difficult to rupture because the split is subepidermal (full-thickness epidermis forms the roof); pemphigus vulgaris bullae are FLACCID and rupture easily because the split is intra-epidermal (thin, fragile roof)",
      "The strongest epidemiological association for BP is with neurological disorders -- patients with dementia, Parkinson disease, and stroke have a significantly higher incidence; this is thought to relate to shared antigen expression between neural tissue and epidermal hemidesmosomes",
      "Pruritus is often the earliest and most distressing symptom -- it may precede visible blister formation by weeks to months and can be initially misdiagnosed as eczema, urticaria, or scabies",
      "G6PD testing is MANDATORY before starting dapsone therapy -- G6PD-deficient patients will develop severe, potentially fatal hemolytic anemia; this is a critical patient safety checkpoint",
      "Handle BP patients with extreme gentleness during all care activities -- friction and shearing forces can precipitate new blister formation on fragile perilesional skin; use lift sheets for repositioning and avoid adhesive tape directly on skin",
      "Large intact bullae can be aspirated using a sterile needle at the lowest point while leaving the blister roof intact -- the roof serves as a natural biological dressing that promotes healing and reduces pain and infection risk"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with suspected blistering skin disease. The nurse performs the Nikolsky sign test and finds it is negative. Which condition is this finding most consistent with?",
        options: [
          "Pemphigus vulgaris",
          "Bullous pemphigoid",
          "Toxic epidermal necrolysis",
          "Staphylococcal scalded skin syndrome"
        ],
        correct: 1,
        rationale: "A negative Nikolsky sign is characteristic of bullous pemphigoid, where the split is subepidermal and the intra-epidermal cell adhesion (desmosomes) remains intact. In pemphigus vulgaris, toxic epidermal necrolysis, and staphylococcal scalded skin syndrome, the Nikolsky sign is positive because the split is within or just below the epidermis."
      },
      {
        question: "Before initiating dapsone therapy for a patient with bullous pemphigoid, which laboratory test must the practical nurse verify has been completed?",
        options: [
          "Hepatitis B surface antigen",
          "Glucose-6-phosphate dehydrogenase (G6PD) level",
          "Antinuclear antibody (ANA) titer",
          "Serum creatine kinase level"
        ],
        correct: 1,
        rationale: "G6PD level must be checked before initiating dapsone therapy. Patients with G6PD deficiency are at extreme risk for severe hemolytic anemia when given dapsone because G6PD is essential for protecting red blood cells from oxidative damage. This is a mandatory safety screening that must be documented before the first dose."
      },
      {
        question: "A practical nurse is providing skin care for a patient with extensive bullous pemphigoid. Which nursing action is most appropriate when managing large intact bullae?",
        options: [
          "Remove the blister roof completely to allow air exposure and drying",
          "Apply adhesive tape directly over the bullae to prevent rupture",
          "Aspirate the fluid with a sterile needle while leaving the blister roof intact",
          "Vigorously scrub the bullae with antiseptic solution during wound care"
        ],
        correct: 2,
        rationale: "Large tense bullae should be aspirated at the lowest point using a sterile needle while leaving the blister roof (full-thickness epidermis) intact. The intact roof serves as a natural biological dressing that protects the underlying dermis, promotes healing, reduces pain, and decreases infection risk. Removing the roof exposes raw dermis; adhesive tape and scrubbing can damage fragile perilesional skin."
      }
    ]
  },

  "car-seat-safety-rpn": {
    title: "Car Seat Safety for Practical Nurses",
    cellular: {
      title: "Developmental Anatomy and Injury Biomechanics in Pediatric Motor Vehicle Safety",
      content: "Understanding pediatric car seat safety requires knowledge of how the developing anatomy of infants and children differs from adults and how these differences affect injury patterns and restraint requirements. The pediatric spine and head-body proportions are fundamentally different from adults: an infant's head constitutes approximately 25% of total body length (compared to 14% in adults), and the cervical spine is relatively underdeveloped with horizontally oriented facet joints, underdeveloped ligamentous structures, and incomplete vertebral ossification. The fulcrum of cervical spine flexion in children under 2 years is at C2-C3 (compared to C5-C6 in adults), making the upper cervical spine highly vulnerable to flexion-distraction injuries in frontal impacts. In a frontal collision, an improperly restrained infant or forward-facing toddler experiences massive forward flexion of the heavy head relative to the weak neck, generating forces that can cause cervical spinal cord injury, internal decapitation (atlanto-occipital dislocation), or traumatic brain injury. Rear-facing car seats distribute crash forces across the entire posterior surface of the child's head, neck, and torso (the strongest part of the body), reducing cervical spine stress by up to 75% compared to forward-facing position. This biomechanical principle is why current guidelines mandate rear-facing position until the child exceeds the seat manufacturer's height or weight limits (typically 2 years or older). The pediatric skeletal system has growth plates (physeal plates) at the ends of long bones that are weaker than the surrounding bone, making children vulnerable to growth plate fractures during motor vehicle crashes. The pediatric thorax is more compliant (flexible ribs) than the adult thorax, allowing greater internal organ compression during impact. The liver and spleen are proportionally larger in children and less protected by the rib cage, increasing vulnerability to abdominal solid organ injury. Proper harness positioning addresses these anatomical vulnerabilities: the harness straps must be positioned at or below the child's shoulders in rear-facing seats (to prevent upward movement during impact) and at or above the shoulders in forward-facing seats (to prevent forward ejection). The chest clip must be positioned at armpit level to distribute forces across the strong clavicles and sternum rather than the vulnerable abdomen. Improper chest clip placement over the abdomen can cause hepatic laceration, splenic rupture, or intestinal perforation during a crash. The practical nurse plays a critical role in educating parents and caregivers about proper car seat selection, installation, and use during well-child visits, hospital discharge planning, and community health education programs."
    },
    riskFactors: [
      "Age-inappropriate car seat selection (using a forward-facing seat for an infant who should be rear-facing, or transitioning to a booster seat too early)",
      "Improper installation of car seat (loose fit allowing greater than 1 inch of movement at the belt path; incorrect use of LATCH vs seat belt)",
      "Incorrect harness positioning (straps too loose, chest clip at abdomen level, straps at incorrect shoulder height relative to seat orientation)",
      "Premature transition from car seat to seat belt only (child under 4 feet 9 inches or under age 8-12 using adult seat belt without booster)",
      "Bulky clothing or aftermarket accessories (winter coats create gap between harness and child's body; aftermarket inserts not crash-tested with seat)",
      "Placement of car seat in front passenger seat with active airbag (airbag deployment can cause fatal injuries to a rear-facing infant)",
      "Used or expired car seats (beyond manufacturer expiration date, unknown crash history, missing components, recalled models)"
    ],
    diagnostics: [
      "Car seat inspection checklist: verify seat type matches child's age, weight, and height; check manufacturer expiration date; confirm no recall status using NHTSA recall database",
      "Installation assessment: check that the seat moves less than 1 inch side-to-side and front-to-back when tested at the belt path; verify correct angle for rear-facing seats (45-degree recline for newborns)",
      "Harness fit test: pinch test on harness straps at the collarbone -- if you can pinch excess webbing between thumb and forefinger, the harness is too loose; straps should lie flat without twisting",
      "Chest clip position check: verify clip is positioned at armpit level (nipple line) across the sternum; position over the abdomen increases risk of abdominal organ injury in a crash",
      "Growth milestone monitoring: track child's weight and height against car seat manufacturer limits (not just age) to determine appropriate seat transitions",
      "Seat belt fit test for booster transition: verify lap belt rests low and flat across the upper thighs (not the abdomen), shoulder belt crosses mid-shoulder and chest (not neck or face), and child can sit with back against vehicle seat with knees bent at seat edge"
    ],
    management: [
      "Stage 1 -- Rear-facing infant seat: birth until child exceeds maximum height or weight limit of rear-facing seat (at minimum 2 years); install at 45-degree angle for newborns; use harness slots at or below shoulders",
      "Stage 2 -- Rear-facing convertible seat: continue rear-facing as long as possible up to the seat's maximum rear-facing weight/height limit; provides extended rear-facing protection (many seats accommodate 40-50 lbs rear-facing)",
      "Stage 3 -- Forward-facing with harness: when child exceeds rear-facing limits, transition to forward-facing position with 5-point harness and top tether; use harness slots at or above shoulders; continue until child reaches seat's maximum forward-facing weight/height limit",
      "Stage 4 -- Belt-positioning booster seat: when child exceeds forward-facing harness limits (typically 40-65 lbs); booster raises child so vehicle seat belt fits correctly; use until child passes the seat belt fit test (typically 4 feet 9 inches tall, ages 8-12)",
      "Stage 5 -- Vehicle seat belt only: when child passes seat belt fit test; lap belt low and flat across upper thighs, shoulder belt across mid-shoulder and chest; all children under 13 should ride in the back seat",
      "LATCH system education: Lower Anchors and Tethers for Children; lower anchors have weight limits (usually combined child + seat weight of 65 lbs); top tether should ALWAYS be used with forward-facing seats regardless of installation method",
      "Community resources: refer families to certified Child Passenger Safety Technician (CPST) inspection stations; many fire departments, police stations, and hospitals offer free car seat inspections"
    ],
    nursingActions: [
      "Assess current car seat use at every well-child visit using standardized screening questions: type of seat, child's position (rear vs forward-facing), installation method, and caregiver knowledge",
      "Provide anticipatory guidance on upcoming car seat transitions based on the child's growth trajectory -- prepare parents for the next stage before the child outgrows the current seat",
      "Demonstrate proper harness adjustment and chest clip positioning using a demonstration car seat during prenatal education classes and at hospital discharge for newborns",
      "Educate caregivers to remove bulky winter clothing before buckling the harness -- instead, buckle child in thin layers and place blanket or coat over the harness after securing",
      "Verify car seat is installed in the back seat (preferably center rear position for maximum crash protection) and NOT in the front passenger seat with an active airbag",
      "Document car seat education provided, family's current car seat use, and any safety concerns identified; include referral to car seat inspection station if installation issues are noted",
      "Screen for socioeconomic barriers to car seat access; refer eligible families to car seat distribution programs (public health departments, Safe Kids coalitions, hospital programs provide seats to qualifying families)"
    ],
    assessmentFindings: [
      "Proper rear-facing installation: seat reclined at correct angle (level indicator in safe zone), moves less than 1 inch at belt path, harness at or below shoulders, chest clip at armpit level",
      "Proper forward-facing installation: seat upright, secured with LATCH or seat belt PLUS top tether attached and tightened, harness at or above shoulders, chest clip at armpit level",
      "Proper booster seat use: child sitting upright with back against vehicle seat back, lap belt low across upper thighs, shoulder belt across mid-shoulder and mid-chest",
      "Common errors identified: car seat installed too loosely (excess movement), harness straps twisted or too loose (fails pinch test), chest clip positioned on abdomen, expired or recalled seat in use",
      "Growth assessment findings: child has exceeded current seat's maximum rear-facing limits (height: head within 1 inch of top of seat shell; weight: exceeded posted maximum) requiring seat transition",
      "Risk factor identification: front seat installation with active airbag, bulky coat worn under harness creating dangerous slack, use of aftermarket products not crash-tested with the seat"
    ],
    signs: {
      left: [
        "Car seat harness slightly loose but child contained within seat during normal driving",
        "Car seat at correct stage but minor installation errors (slight excess movement at belt path)",
        "Chest clip positioned slightly below armpit level but above the abdomen",
        "Child approaching but has not yet exceeded current seat weight or height limits",
        "Caregiver demonstrates partial knowledge of car seat safety with correctable gaps",
        "Minor wear on car seat straps or cover from normal use (no structural compromise)"
      ],
      right: [
        "Infant in rear-facing seat installed in front passenger seat with active airbag (risk of fatal airbag injury)",
        "Child restrained by vehicle seat belt only when too small for proper belt fit (lap belt riding over abdomen)",
        "Car seat not secured to vehicle (sitting loosely on seat without LATCH or seat belt installation)",
        "Evidence of crash-related injuries in improperly restrained child (cervical spine injury, abdominal organ damage, traumatic brain injury)",
        "Expired or recalled car seat with structural defects (cracked shell, frayed harness, broken buckle mechanism)",
        "No car seat available for discharge (newborn or child cannot be safely transported without appropriate restraint)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol/Tempra)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center (antipyretic effect) and raising pain threshold through interaction with serotonergic descending pain pathways (analgesic effect). Does not possess significant anti-inflammatory properties at therapeutic doses",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (single dose exceeding 150 mg/kg in children; cumulative doses exceeding maximum daily dose), nausea, rash; chronic use may cause renal impairment",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; caution in patients with G6PD deficiency; avoid doses exceeding 75 mg/kg/day in children",
        pearl: "Maximum daily dose in children is 75 mg/kg/day (not to exceed 4 g/day); dose every 4-6 hours as needed; weight-based dosing is more accurate than age-based dosing; educate parents to use the measuring device provided with the medication (not a kitchen teaspoon); always check ALL medications for acetaminophen content to prevent accidental overdose"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Non-steroidal anti-inflammatory drug (NSAID)",
        action: "Non-selectively inhibits cyclooxygenase enzymes (COX-1 and COX-2) in peripheral tissues, reducing prostaglandin synthesis. This decreases inflammation, pain, and fever. Prostaglandin inhibition reduces sensitization of peripheral pain receptors (analgesic), resets the hypothalamic set point (antipyretic), and decreases inflammatory mediator production (anti-inflammatory)",
        sideEffects: "GI irritation (nausea, abdominal pain, ulceration, GI bleeding), renal impairment (decreased renal blood flow from prostaglandin inhibition), platelet inhibition (increased bleeding time), hypersensitivity reactions (bronchospasm in aspirin-sensitive patients)",
        contra: "Infants under 6 months of age; known NSAID or aspirin hypersensitivity; active GI bleeding or peptic ulcer disease; severe renal impairment; perioperative period of coronary artery bypass grafting; dehydration (increased nephrotoxicity risk)",
        pearl: "NOT recommended for infants under 6 months of age (unlike acetaminophen which can be given from birth); dose is 5-10 mg/kg every 6-8 hours; can be alternated with acetaminophen for more sustained fever/pain control; administer with food to reduce GI irritation; ensure adequate hydration before and during use to protect renal function"
      },
      {
        name: "Dimenhydrinate (Gravol/Dramamine)",
        type: "Antihistamine / antiemetic (H1 receptor antagonist)",
        action: "Blocks histamine H1 receptors and muscarinic acetylcholine receptors in the vomiting center of the medulla and the vestibular system. Reduces vestibular stimulation and inhibits the emetic reflex arc, preventing motion sickness-related nausea and vomiting during travel. Also has mild sedative effects due to CNS H1 receptor blockade",
        sideEffects: "Drowsiness and sedation (most common), dry mouth, blurred vision, urinary retention, constipation, paradoxical excitation in young children (hyperactivity, irritability instead of sedation), tachycardia",
        contra: "Children under 2 years of age (risk of respiratory depression and paradoxical CNS effects); concurrent use with other CNS depressants; acute asthma (thickens bronchial secretions); angle-closure glaucoma; urinary obstruction",
        pearl: "Administer 30-60 minutes before travel for optimal motion sickness prevention; NOT approved for children under 2 years; weight-based dosing for children 2-12 years; warn parents about paradoxical excitation (hyperactivity instead of drowsiness) which is more common in young children; do not use as a sleep aid in children"
      }
    ],
    pearls: [
      "Rear-facing is the SAFEST position for all infants and toddlers -- it distributes crash forces across the entire head, neck, and torso; children should remain rear-facing until they exceed the seat manufacturer's maximum height or weight limit, not just until age 2",
      "The pinch test determines proper harness tightness: after buckling the harness, attempt to pinch the strap webbing at the child's collarbone between your thumb and index finger -- if you can pinch a fold of excess strap, the harness is too loose and must be tightened",
      "The chest clip MUST be positioned at armpit level (nipple line) across the sternum -- placement over the abdomen can cause liver laceration, splenic rupture, or intestinal perforation during a crash as the clip concentrates impact forces on soft abdominal organs",
      "Bulky winter clothing creates dangerous hidden slack in the harness -- in a crash, the coat compresses and the child can be ejected from the loose straps; always buckle the child in thin layers first, then place blankets or coats OVER the harness",
      "NEVER place a rear-facing car seat in the front passenger seat of a vehicle with an active frontal airbag -- airbag deployment strikes the back of the car seat with tremendous force and can cause fatal head and neck injuries to the infant",
      "Car seats have manufacturer expiration dates (typically 6-10 years from manufacture date) -- plastic degrades over time from temperature fluctuations and UV exposure, compromising structural integrity in a crash; always check the date stamped on the seat shell",
      "The top tether is the most commonly misused component -- it MUST be attached and tightened for all forward-facing installations regardless of whether the seat is installed with LATCH or seat belt; the tether limits forward head excursion by up to 4-6 inches during a crash"
    ],
    quiz: [
      {
        question: "A practical nurse is providing discharge education for parents of a newborn. Which instruction about car seat safety is most important to include?",
        options: [
          "The infant should be placed in a forward-facing car seat with a 5-point harness",
          "The car seat should be installed in the front passenger seat for easy monitoring",
          "The infant must ride rear-facing in the back seat with the harness at or below shoulder level",
          "A booster seat is appropriate for newborns if the vehicle has side airbags"
        ],
        correct: 2,
        rationale: "Newborns must ride in a rear-facing car seat installed in the back seat (never in front of an active airbag). The harness straps must be positioned at or below the infant's shoulders in the rear-facing position to prevent upward ejection during a crash. This position distributes crash forces across the strongest part of the infant's body."
      },
      {
        question: "During a well-child visit, a parent reports that their 18-month-old child is getting too tall for the rear-facing position and wants to turn the seat forward-facing. What is the most appropriate nursing response?",
        options: [
          "Agree with the parent and provide instructions for forward-facing installation",
          "Advise the parent to check the seat's rear-facing height and weight limits before switching, as rear-facing is safest until those limits are exceeded",
          "Recommend transitioning directly to a belt-positioning booster seat",
          "Suggest removing the car seat and using the vehicle seat belt with a lap pad"
        ],
        correct: 1,
        rationale: "Current guidelines recommend keeping children rear-facing until they exceed the car seat manufacturer's maximum rear-facing height or weight limit. Many convertible seats accommodate children up to 40-50 pounds rear-facing. The nurse should verify the child has actually exceeded the seat's limits before recommending a transition, as rear-facing provides superior protection for the immature cervical spine."
      },
      {
        question: "A practical nurse is performing a car seat safety check and identifies that the chest clip on the child's car seat is positioned over the abdomen. What is the primary safety concern with this positioning?",
        options: [
          "The chest clip may become unfastened during normal driving",
          "The child may develop skin irritation from the clip rubbing on the abdomen",
          "Impact forces during a crash would be concentrated on abdominal organs, risking liver or splenic injury",
          "The harness straps will become twisted and difficult to tighten"
        ],
        correct: 2,
        rationale: "The chest clip must be positioned at armpit level across the sternum to distribute crash forces across the strong bony structures of the clavicles and rib cage. When positioned over the abdomen, the clip concentrates impact forces on the unprotected abdominal organs (liver, spleen, intestines), which can cause life-threatening internal injuries including hepatic laceration, splenic rupture, or intestinal perforation."
      }
    ]
  },

  "erythema-multiforme-rpn": {
    title: "Erythema Multiforme for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Erythema Multiforme",
      content: "Erythema multiforme (EM) is an acute, immune-mediated hypersensitivity reaction that primarily targets the skin and sometimes the mucous membranes. The hallmark lesion is the target (iris) lesion -- a concentric ring pattern consisting of three distinct zones: a central dusky or vesicular area (epidermal necrosis), a middle pale edematous ring (vasoconstriction and edema), and an outer ring of erythema (vasodilation and inflammation). These target lesions are pathognomonic for EM and distinguish it from other dermatological conditions. The pathogenesis of EM involves a cell-mediated immune response (Type IV hypersensitivity reaction). In the most common form (EM associated with herpes simplex virus), HSV DNA fragments are transported to the skin by peripheral blood mononuclear cells. These viral fragments are processed and presented by keratinocytes, triggering a CD4+ Th1 lymphocyte response that produces interferon-gamma (IFN-gamma). IFN-gamma activates cytotoxic CD8+ T lymphocytes and natural killer cells, which attack and destroy keratinocytes expressing viral antigens through the perforin-granzyme pathway and Fas-FasL apoptotic pathway. This keratinocyte apoptosis causes the satellite cell necrosis seen histologically and produces the clinical findings of the target lesion. EM is classified into two forms: EM minor (skin involvement only, with typical target lesions on the extremities, particularly the dorsal hands and feet, extensor surfaces, and sometimes face) and EM major (skin involvement plus mucosal involvement of at least one mucosal surface -- oral, genital, or ocular). EM minor is most commonly triggered by infections, particularly herpes simplex virus (HSV-1 and HSV-2) which accounts for approximately 70-80% of recurrent EM cases. EM major can be triggered by infections (HSV, Mycoplasma pneumoniae) or less commonly by medications. The relationship between EM and Stevens-Johnson syndrome (SJS) has been debated. Current consensus considers them distinct entities on a spectrum of severity: EM is infection-triggered with typical target lesions and limited body surface area involvement (less than 10%), while SJS is predominantly drug-triggered with atypical target lesions or macules and more extensive skin detachment. SJS involves greater than 10% body surface area detachment and carries significant morbidity and mortality, progressing to toxic epidermal necrolysis (TEN) when detachment exceeds 30% body surface area. The practical nurse must differentiate between these conditions and recognize when EM is progressing toward the more severe SJS/TEN spectrum, as this requires immediate escalation of care including potential transfer to a burn unit."
    },
    riskFactors: [
      "Herpes simplex virus infection (HSV-1 or HSV-2 -- the most common trigger, responsible for 70-80% of recurrent EM; reactivation precedes EM by 10-14 days)",
      "Mycoplasma pneumoniae infection (most common infectious trigger in children; causes EM major with prominent mucosal involvement)",
      "Medications (sulfonamides, penicillins, cephalosporins, anticonvulsants such as phenytoin and carbamazepine, NSAIDs, allopurinol -- more commonly associated with SJS/TEN spectrum)",
      "Young adult age group (peak incidence 20-40 years; male predominance with male-to-female ratio of 3:2)",
      "Immunocompromised state (HIV/AIDS patients have increased risk and more severe presentations)",
      "History of previous EM episodes (recurrence rate approximately 30-40%, usually HSV-related; recurrent EM may occur with each HSV reactivation)",
      "Upper respiratory tract infections and other viral illnesses (Epstein-Barr virus, cytomegalovirus, hepatitis viruses)"
    ],
    diagnostics: [
      "Clinical examination: identify pathognomonic target (iris) lesions with three distinct concentric zones; lesions typically symmetric, acral distribution (hands, feet, elbows, knees), may involve face",
      "Skin biopsy: histopathology shows interface dermatitis with satellite cell necrosis (individual keratinocyte apoptosis), lymphocytic infiltrate at the dermal-epidermal junction, and epidermal spongiosis; subepidermal blistering in severe cases",
      "Direct immunofluorescence (DIF): typically negative or nonspecific in EM (helps distinguish from autoimmune blistering diseases such as bullous pemphigoid or linear IgA disease)",
      "HSV PCR or viral culture: from active herpetic lesion (if present) or from skin biopsy of EM lesion; HSV DNA can be detected in EM lesions confirming the etiologic relationship",
      "Mycoplasma pneumoniae testing: IgM serology or PCR from nasopharyngeal swab in children or young adults with EM major and respiratory symptoms",
      "Complete blood count and metabolic panel: assess for systemic involvement; eosinophilia may suggest drug reaction; elevated inflammatory markers (ESR, CRP) indicate systemic inflammation"
    ],
    management: [
      "Identify and treat the underlying trigger: if HSV-related, initiate antiviral therapy (acyclovir or valacyclovir); if drug-related, immediately discontinue the suspected causative medication",
      "EM minor (skin only, mild): symptomatic treatment with oral antihistamines for pruritus, topical corticosteroids for inflammation, and cool compresses for comfort; most cases self-resolve in 2-4 weeks",
      "EM major (mucosal involvement): systemic corticosteroids (prednisone) may be considered for severe mucosal disease; ophthalmology consultation for ocular involvement; oral care with magic mouthwash for oral erosions",
      "Recurrent HSV-associated EM: prophylactic antiviral suppression (acyclovir 400 mg twice daily or valacyclovir 500 mg daily) for 6-12 months to prevent HSV reactivation and subsequent EM episodes",
      "Oral mucosal management: soft bland diet, topical anesthetics (lidocaine viscous) before meals, adequate fluid intake, avoid acidic/spicy foods; monitor for dehydration if oral intake is impaired",
      "Pain management: acetaminophen or NSAIDs for mild-moderate pain; short-course opioids may be needed for severe mucosal pain; topical agents for localized discomfort",
      "Monitor for progression to SJS/TEN: watch for rapid expansion of skin involvement, confluent erythema, positive Nikolsky sign, extensive epidermal detachment, or systemic symptoms (high fever, sepsis) -- immediate escalation required"
    ],
    nursingActions: [
      "Perform thorough skin assessment documenting number, distribution, and characteristics of target lesions; photograph lesions for comparison; calculate approximate body surface area involvement using the Rule of Nines or Lund-Browder chart",
      "Assess all mucosal surfaces (oral cavity, conjunctivae, nasal passages, genital/perianal area) for erosions, ulceration, or blistering to classify as EM minor or EM major",
      "Monitor for signs of progression to SJS/TEN: increasing body surface area involvement, positive Nikolsky sign on uninvolved skin, confluent erythema, systemic toxicity (high fever, tachycardia, hypotension)",
      "Provide meticulous oral care: gentle mouth rinses with saline or prescribed mouthwash before meals, apply topical anesthetic (lidocaine viscous) 15 minutes before eating, offer soft bland foods at room temperature",
      "Assess pain level using appropriate validated tools; administer prescribed analgesics and evaluate effectiveness; report uncontrolled pain for therapy adjustment",
      "Monitor fluid intake and output closely, especially in patients with oral mucosal involvement; assess for signs of dehydration (decreased urine output, dry mucous membranes, tachycardia, orthostatic hypotension)",
      "Review the patient's complete medication list to identify potential drug triggers; report any recently started medications (within 1-4 weeks of onset) to the prescriber for evaluation as possible causative agents"
    ],
    assessmentFindings: [
      "Pathognomonic target (iris) lesions: concentric rings with central dusky/vesicular zone, middle pale edematous ring, and outer erythematous ring; typically 1-3 cm in diameter; sharply demarcated borders",
      "Acral and symmetric distribution: target lesions predominantly on dorsal hands and feet, extensor surfaces of forearms and legs, elbows, knees; may spread centrally but remains more prominent distally",
      "Oral mucosal erosions (EM major): painful erosions, ulcers, or hemorrhagic crusting on lips, buccal mucosa, tongue, and palate; may impair eating, drinking, and speaking",
      "Ocular involvement (EM major): conjunctival injection (redness), chemosis (conjunctival edema), corneal erosions, photophobia, excessive tearing; ophthalmology evaluation essential to prevent permanent scarring",
      "Prodromal symptoms: mild fever, malaise, myalgia, and arthralgias may precede skin lesions by 1-7 days; history of cold sore (herpes labialis) 10-14 days before rash onset",
      "Genital mucosal involvement: painful erosions on vulvar, vaginal, penile, or perianal mucosa; may cause dysuria and urinary retention",
      "Nikolsky sign assessment: NEGATIVE in EM minor and early EM major (epidermis does not shear with lateral pressure); positive Nikolsky sign suggests progression toward SJS/TEN spectrum and requires immediate escalation"
    ],
    signs: {
      left: [
        "Scattered target lesions on hands and feet with intact skin between lesions",
        "Mild pruritus or burning sensation at lesion sites",
        "Low-grade fever and mild malaise",
        "Mild lip swelling or crusting without extensive oral erosions",
        "History of recent herpes simplex outbreak (cold sore) 10-14 days prior",
        "Lesion count less than 20 with no mucosal involvement (EM minor)"
      ],
      right: [
        "Rapid spread of lesions with greater than 10% body surface area involvement (suggests SJS spectrum)",
        "Positive Nikolsky sign on uninvolved skin (epidermal detachment indicating SJS/TEN progression)",
        "Severe oral mucosal erosions preventing oral intake (dehydration and malnutrition risk)",
        "Ocular involvement with corneal erosions or ulceration (risk of permanent vision impairment)",
        "High fever (above 38.5 C), tachycardia, and hemodynamic instability suggesting systemic toxicity",
        "Confluent erythema with large areas of epidermal detachment (TEN -- requires burn unit transfer)"
      ]
    },
    medications: [
      {
        name: "Acyclovir (Zovirax)",
        type: "Antiviral (nucleoside analogue)",
        action: "Selectively phosphorylated by viral thymidine kinase (present only in HSV-infected cells) to its active triphosphate form. Acyclovir triphosphate competitively inhibits viral DNA polymerase and is incorporated into the growing viral DNA chain, causing chain termination. This halts HSV replication without significantly affecting host cell DNA synthesis, treating the underlying HSV trigger of erythema multiforme",
        sideEffects: "Nausea, vomiting, diarrhea, headache; IV formulation can cause nephrotoxicity (crystalluria in renal tubules -- prevent with adequate hydration), phlebitis at IV site; rarely neurotoxicity (tremors, confusion, seizures) in renal impairment",
        contra: "Known hypersensitivity to acyclovir or valacyclovir; dose adjustment required in renal impairment (excreted renally); adequate hydration must be maintained during IV therapy to prevent crystal nephropathy",
        pearl: "For acute HSV-triggered EM: 200 mg five times daily or 400 mg three times daily for 5-10 days; for prophylaxis against recurrent HSV-associated EM: 400 mg twice daily continuously for 6-12 months; must be started within 48-72 hours of HSV outbreak for maximum efficacy; encourage 2-3 liters of fluid daily during IV therapy"
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the cell-mediated immune response (Type IV hypersensitivity) driving keratinocyte destruction in EM. Inhibits T-lymphocyte proliferation and cytokine production (interferon-gamma, interleukin-2), reduces cytotoxic CD8+ T-cell and NK cell activity against viral antigen-expressing keratinocytes, and decreases inflammatory cell recruitment to the dermal-epidermal junction",
        sideEffects: "Hyperglycemia (monitor blood glucose), immunosuppression with increased infection risk, GI irritation (take with food; consider gastroprotection), fluid retention and hypertension, mood changes (insomnia, anxiety, euphoria), weight gain, adrenal suppression with prolonged use, osteoporosis risk",
        contra: "Active systemic infection without antimicrobial coverage; poorly controlled diabetes without glucose monitoring; active peptic ulcer disease; use in EM is controversial -- avoid in drug-triggered EM as it may worsen SJS/TEN progression",
        pearl: "Use of systemic corticosteroids in EM is debated: may be beneficial in severe EM major with prominent mucosal involvement but is generally avoided if drug-triggered (risk of masking SJS/TEN progression); if used, short course (0.5-1 mg/kg for 5-7 days with rapid taper); always treat underlying HSV with antivirals concurrently"
      },
      {
        name: "Diphenhydramine (Benadryl)",
        type: "First-generation antihistamine (H1 receptor antagonist)",
        action: "Competitively blocks histamine H1 receptors on sensory nerve endings, blood vessels, and inflammatory cells, reducing histamine-mediated pruritus, erythema, and urticaria. Also crosses the blood-brain barrier and blocks central H1 receptors, producing sedation, and has anticholinergic properties that reduce secretions and may provide additional antipruritic benefit",
        sideEffects: "Drowsiness and sedation (most common and dose-limiting), dry mouth, urinary retention, constipation, blurred vision, paradoxical excitation in children (hyperactivity instead of sedation), tachycardia, thickened bronchial secretions",
        contra: "Concurrent use with other CNS depressants (additive sedation); angle-closure glaucoma; urinary retention or prostatic hyperplasia; severe hepatic impairment; use cautiously in elderly (increased fall risk from sedation and anticholinergic effects -- Beers Criteria)",
        pearl: "Oral dosing: 25-50 mg every 6-8 hours for adults; 1.25 mg/kg every 6 hours for children (maximum 300 mg/day for adults); warn patients about drowsiness and impaired driving/operating machinery; second-generation antihistamines (cetirizine, loratadine) are preferred for daytime use as they cause less sedation; topical diphenhydramine should be avoided on large areas or broken skin (systemic absorption risk)"
      }
    ],
    pearls: [
      "The pathognomonic target (iris) lesion of EM has THREE distinct concentric zones: central dusky/vesicular area (keratinocyte necrosis), middle pale ring (edema and vasoconstriction), and outer red ring (active inflammation) -- this three-zone pattern distinguishes true EM from other conditions with round lesions",
      "HSV is the most common trigger for recurrent EM (70-80% of cases) -- HSV reactivation typically occurs 10-14 days before EM lesions appear; patients with recurrent EM should be evaluated for HSV suppressive therapy",
      "EM minor (skin only) and EM major (skin plus mucosal involvement) are primarily infection-triggered, while SJS/TEN is primarily drug-triggered -- this distinction is clinically important because management differs significantly",
      "A NEGATIVE Nikolsky sign is expected in EM -- if the Nikolsky sign becomes positive (epidermis shears with lateral pressure on uninvolved skin), this suggests progression toward SJS/TEN and requires immediate escalation including potential burn unit transfer",
      "Oral mucosal involvement in EM major can be severe enough to prevent adequate oral intake -- assess hydration status at every evaluation, provide topical anesthetics before meals, and consider IV fluid therapy if oral intake is insufficient",
      "Review ALL medications started within 1-4 weeks of EM onset to identify potential drug triggers -- common culprits include sulfonamides, penicillins, anticonvulsants (phenytoin, carbamazepine), and allopurinol; discontinue suspected agents immediately",
      "Recurrent HSV-associated EM can be effectively prevented with continuous antiviral suppression (acyclovir 400 mg twice daily) for 6-12 months -- this breaks the cycle of HSV reactivation followed by EM episodes and significantly improves quality of life"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient with a new rash. Which description is most consistent with the pathognomonic target lesion of erythema multiforme?",
        options: [
          "A flat, uniformly red macule with irregular borders and central clearing",
          "A raised, concentric ring pattern with a central dusky area, middle pale ring, and outer red ring",
          "A fluid-filled vesicle on an erythematous base without surrounding ring pattern",
          "A scaly, silver plaque with well-defined borders on extensor surfaces"
        ],
        correct: 1,
        rationale: "The pathognomonic target (iris) lesion of erythema multiforme consists of three distinct concentric zones: a central dusky or vesicular area (representing keratinocyte necrosis), a middle pale edematous ring, and an outer erythematous ring. This three-zone concentric pattern is unique to EM and is the key diagnostic feature."
      },
      {
        question: "A patient with recurrent erythema multiforme reports a history of frequent cold sores preceding each episode. Which medication would the practical nurse anticipate being prescribed for long-term prevention?",
        options: [
          "Prednisone daily for immunosuppression",
          "Diphenhydramine daily for antihistamine coverage",
          "Acyclovir prophylaxis for herpes simplex virus suppression",
          "Methotrexate weekly for immune modulation"
        ],
        correct: 2,
        rationale: "HSV is the most common trigger for recurrent EM (70-80% of cases). Continuous antiviral suppression with acyclovir (400 mg twice daily) or valacyclovir (500 mg daily) for 6-12 months prevents HSV reactivation and breaks the cycle of recurrent EM episodes. This is the evidence-based approach for preventing recurrent HSV-associated EM."
      },
      {
        question: "A practical nurse caring for a patient with erythema multiforme major notices that lateral pressure on uninvolved skin causes the epidermis to separate. What should the nurse do FIRST?",
        options: [
          "Document the finding and continue routine monitoring",
          "Apply topical antibiotic ointment to the area",
          "Report immediately as this positive Nikolsky sign suggests possible progression to Stevens-Johnson syndrome",
          "Administer an additional dose of prescribed antihistamine"
        ],
        correct: 2,
        rationale: "A positive Nikolsky sign (epidermal separation with lateral pressure on uninvolved skin) in a patient with EM major is an alarming finding that suggests progression toward Stevens-Johnson syndrome or toxic epidermal necrolysis. This represents a medical emergency requiring immediate physician notification and potential transfer to a burn center. The Nikolsky sign should be negative in EM; its development indicates worsening epidermal detachment."
      }
    ]
  },

  "hidradenitis-suppurativa-rpn": {
    title: "Hidradenitis Suppurativa for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hidradenitis Suppurativa",
      content: "Hidradenitis suppurativa (HS) is a chronic, recurrent, inflammatory disease of the hair follicle that primarily affects apocrine gland-bearing skin regions including the axillae (underarms), inguinal folds (groin), perineum, perianal region, inframammary folds (under breasts), and gluteal region. Despite its historical classification as an apocrine gland disorder, current understanding recognizes HS as primarily a disease of follicular occlusion -- it begins with hyperkeratosis (abnormal thickening) of the follicular infundibulum (the upper portion of the hair follicle). The pathogenesis proceeds through a well-characterized sequence: first, the follicular epithelium undergoes hyperkeratinization, plugging the follicular opening with keratinous debris. This occlusion traps sebum, keratin, and bacteria (particularly anaerobic species) within the follicle, creating a distended, inflamed follicular cyst. As the cyst enlarges, the follicular wall ruptures into the surrounding dermis and subcutaneous tissue, releasing keratin, sebum, and bacterial antigens into the perifollicular tissue. This triggers an intense foreign body-type inflammatory response with massive neutrophilic and lymphocytic infiltration, abscess formation, and tissue destruction. The inflammatory cascade involves elevated levels of tumor necrosis factor-alpha (TNF-alpha), interleukin-1-beta, interleukin-17, and interleukin-23 -- cytokines that perpetuate chronic inflammation and tissue remodeling. Over repeated cycles of inflammation and healing, the dermis and subcutis develop extensive fibrosis (scarring) and sinus tract (tunnel) formation. These tunnels are epithelium-lined connections between deep abscess cavities that track through the subcutaneous tissue, often extending for considerable distances and communicating with the skin surface through multiple draining openings. The tunnels harbor persistent bacterial biofilms that resist antibiotic penetration and perpetuate chronic infection and inflammation. The Hurley staging system classifies disease severity: Stage I involves isolated abscess formation without scarring or sinus tracts (most patients present at this stage). Stage II features recurrent abscesses with sinus tract formation and scarring in one or more areas but with normal skin between lesions. Stage III represents diffuse involvement across an entire anatomical region with multiple interconnected sinus tracts and scarring, with little or no normal skin remaining in the affected area. HS causes profound physical and psychosocial disability including chronic pain, malodorous drainage, restricted mobility, depression, social isolation, and impaired sexual function. It has a significant association with metabolic syndrome, obesity, smoking, inflammatory bowel disease, and spondyloarthropathy. The practical nurse must provide comprehensive wound care, pain management, emotional support, and patient education while monitoring for disease progression and complications."
    },
    riskFactors: [
      "Obesity (BMI greater than 30 -- mechanical friction, heat, and moisture in skin folds promote follicular occlusion; weight reduction improves disease severity)",
      "Tobacco smoking (nicotine promotes follicular plugging, alters immune function, and worsens inflammatory response; smoking cessation is a key modifiable risk factor)",
      "Family history of HS (approximately 40% of patients report a first-degree relative with HS; autosomal dominant pattern with variable penetrance involving gamma-secretase gene mutations)",
      "Female sex (female-to-male ratio of approximately 3:1; hormonal influence suggested by flares during menstruation and improvement during pregnancy in some patients)",
      "Post-pubertal age group (onset typically after puberty, peak incidence in second and third decades; apocrine gland activity correlates with disease onset)",
      "Metabolic syndrome components (insulin resistance, dyslipidemia, hypertension -- associated with increased HS severity and poorer treatment response)",
      "Mechanical friction from tight clothing, shaving, or use of antiperspirants/deodorants in affected areas (exacerbates follicular occlusion and inflammation)"
    ],
    diagnostics: [
      "Clinical diagnosis based on three criteria (Dessau criteria): typical lesion morphology (deep-seated nodules, abscesses, sinus tracts, scarring), typical anatomical distribution (axillae, groin, perineum, inframammary), and chronicity/recurrence (at least 2 episodes in 6 months)",
      "Hurley staging assessment: Stage I (isolated abscess without scarring or sinus tracts), Stage II (recurrent abscesses with sinus tracts and scarring, separated by normal skin), Stage III (diffuse involvement with interconnected sinus tracts across entire region)",
      "Wound culture: obtain cultures from deep tissue or aspirate (not surface swab) to identify organisms driving secondary infection; common organisms include Staphylococcus aureus, anaerobes, and mixed flora",
      "Ultrasound of affected area: high-frequency ultrasound can reveal subclinical sinus tracts, fluid collections, and depth of involvement not visible on surface examination; useful for surgical planning",
      "Inflammatory markers (CRP, ESR): typically elevated during active flares; useful for monitoring disease activity and treatment response",
      "Metabolic screening: fasting glucose or HbA1c, lipid panel, blood pressure measurement to screen for metabolic syndrome components; BMI calculation and waist circumference"
    ],
    management: [
      "Lifestyle modifications (all stages): weight loss if BMI above 30, smoking cessation, loose-fitting breathable clothing, gentle cleansing with antiseptic wash (chlorhexidine or benzoyl peroxide), avoid shaving affected areas",
      "Hurley Stage I (mild): topical clindamycin 1% lotion or gel applied twice daily to affected areas; warm compresses to promote drainage of superficial abscesses; zinc gluconate supplementation (90 mg/day) may reduce flares",
      "Hurley Stage II (moderate): systemic antibiotics -- clindamycin 300 mg twice daily PLUS rifampin 300 mg twice daily for 10-12 weeks (most effective combination); oral doxycycline or tetracycline as alternatives",
      "Hurley Stage II-III (moderate-severe): biologic therapy with adalimumab (the only FDA/Health Canada-approved biologic for HS) -- 160 mg initial dose, 80 mg at week 2, then 40 mg weekly",
      "Hurley Stage III (severe): surgical excision of affected tissue (wide local excision with healing by secondary intention or skin grafting); deroofing of individual sinus tracts; CO2 laser excision",
      "Acute abscess management: incision and drainage (I&D) provides temporary relief but does NOT prevent recurrence; pack wound loosely and change packing daily; prescribe appropriate antibiotics if cellulitis present",
      "Pain management: multimodal approach including acetaminophen, NSAIDs, topical lidocaine, and short-course opioids for severe flares; address chronic pain with referral to pain management if needed"
    ],
    nursingActions: [
      "Perform comprehensive skin assessment of all apocrine gland-bearing areas (axillae, groin, perineum, inframammary, gluteal) at each visit; document lesion count, stage (Hurley), drainage characteristics, and signs of tunneling",
      "Provide wound care for draining lesions: cleanse with normal saline or prescribed antiseptic wash, apply absorbent non-adherent dressings, change dressings as needed based on drainage volume (may require multiple daily changes)",
      "Administer prescribed medications including topical clindamycin (apply thin layer to affected areas), oral antibiotics (monitor for GI side effects of clindamycin, orange discoloration of bodily fluids with rifampin), and biologics (adalimumab -- proper subcutaneous injection technique)",
      "Assess pain using validated pain scale at each encounter; document pain location, quality (throbbing, burning, aching), severity, and impact on daily activities; administer prescribed analgesics and evaluate effectiveness",
      "Monitor for complications: secondary bacterial infection (expanding erythema, increased purulence, fever), squamous cell carcinoma in chronic sinus tracts (rare but serious -- new growth or bleeding from long-standing lesion), anemia of chronic disease, amyloidosis",
      "Provide psychosocial support and assess for depression, anxiety, social isolation, and impaired quality of life; validate the patient's experience; refer to mental health services and patient support groups (HS Foundation)",
      "Educate patient on modifiable risk factors: smoking cessation resources, weight management strategies, appropriate skin care (avoid tight clothing, use antiseptic washes, do not squeeze or pick at lesions), and importance of medication adherence"
    ],
    assessmentFindings: [
      "Deep-seated, painful inflammatory nodules (firm, tender, erythematous, 0.5-2 cm) in apocrine gland-bearing regions that persist for weeks and may spontaneously rupture or require incision and drainage",
      "Recurrent abscesses with purulent, often malodorous drainage (mixture of pus, serous fluid, and blood); the characteristic foul odor is caused by anaerobic bacterial colonization within sinus tracts",
      "Sinus tracts (tunnels): palpable cord-like structures beneath the skin connecting deep abscess cavities; may have multiple surface openings with intermittent drainage; tunnel formation indicates Hurley Stage II or higher",
      "Scarring: hypertrophic rope-like scars, contracture bands, and fibrotic tissue replacing normal skin; scarring may restrict range of motion (particularly in axillae) and cause functional impairment",
      "Double-ended comedones (tombstone comedones): paired, open blackhead-like lesions connected by an underlying epithelialized sinus tract; characteristic feature of chronic HS not seen in simple acne",
      "Psychological assessment findings: expressed distress about odor and drainage, avoidance of social situations and intimate relationships, work absenteeism, depression screening positive (PHQ-9), chronic pain affecting sleep and daily function"
    ],
    signs: {
      left: [
        "Isolated inflammatory nodule in axilla or groin without drainage or tunneling",
        "Mild tenderness and erythema at affected site",
        "Intermittent small-volume drainage from established sinus tract",
        "Stable disease with infrequent flares (fewer than 2 per 6 months)",
        "Mild psychological distress managed with supportive care",
        "Body mass index elevated but patient engaged in weight management"
      ],
      right: [
        "Expanding cellulitis surrounding HS lesion with systemic signs of infection (fever, tachycardia, elevated WBC)",
        "Sepsis from secondary infection of deep sinus tracts (hypotension, altered mental status, lactic acidosis)",
        "New firm, rapidly growing mass arising within chronic sinus tract (concern for squamous cell carcinoma transformation)",
        "Severe contracture of axillary or inguinal region restricting mobility and function",
        "Severe depression with suicidal ideation related to chronic pain, disfigurement, and social isolation",
        "Diffuse Stage III disease with confluent sinus tracts, constant drainage, and incapacitating pain unresponsive to medical therapy"
      ]
    },
    medications: [
      {
        name: "Adalimumab (Humira)",
        type: "Biologic immunomodulator (anti-TNF-alpha monoclonal antibody)",
        action: "Binds specifically to tumor necrosis factor-alpha (TNF-alpha), the dominant pro-inflammatory cytokine driving the chronic inflammatory cascade in HS. By neutralizing both soluble and membrane-bound TNF-alpha, adalimumab reduces neutrophil recruitment, suppresses abscess and sinus tract formation, decreases inflammatory tissue destruction, and promotes resolution of existing inflammatory nodules. It is the ONLY biologic with FDA and Health Canada approval specifically for hidradenitis suppurativa",
        sideEffects: "Injection site reactions (redness, pain, swelling), increased infection risk (serious infections including tuberculosis reactivation, invasive fungal infections, and opportunistic infections), hepatotoxicity, exacerbation of heart failure, demyelinating disorders (rare), lymphoma risk (rare, long-term), formation of anti-drug antibodies reducing efficacy",
        contra: "Active serious infection (sepsis, tuberculosis, invasive fungal infection); latent tuberculosis without concurrent prophylaxis (must screen with TB test before initiation); moderate-to-severe heart failure (NYHA Class III/IV); concurrent live vaccine administration; known hypersensitivity",
        pearl: "HS-specific dosing differs from other indications: loading dose 160 mg (4 injections on day 1), 80 mg on day 15, then 40 mg weekly (NOT every 2 weeks as in rheumatoid arthritis); TB screening (TST or IGRA) and hepatitis B screening MUST be completed before starting; clinical response assessed at week 12 -- if inadequate response, discontinue; teach patients proper subcutaneous injection technique and rotation of injection sites"
      },
      {
        name: "Clindamycin (Dalacin/Cleocin)",
        type: "Lincosamide antibiotic (topical and oral formulations)",
        action: "Binds to the 50S ribosomal subunit of bacterial ribosomes, inhibiting bacterial protein synthesis by blocking peptide bond formation during translation. Effective against gram-positive cocci (Staphylococcus aureus, Streptococcus) and anaerobic bacteria (Bacteroides, Peptostreptococcus) commonly colonizing HS sinus tracts. Also has anti-inflammatory properties independent of its antimicrobial action, reducing neutrophil chemotaxis and cytokine production",
        sideEffects: "Oral: Clostridioides difficile-associated diarrhea (CDAD -- most serious; can range from mild diarrhea to life-threatening pseudomembranous colitis), nausea, abdominal pain, metallic taste. Topical: local irritation, dryness, contact dermatitis. Both: superinfection with resistant organisms",
        contra: "History of Clostridioides difficile infection (high recurrence risk); known hypersensitivity to clindamycin or lincomycin; concurrent use with neuromuscular blocking agents (enhanced blockade); hepatic impairment (reduced clearance)",
        pearl: "Most effective in HS when used in combination with rifampin (clindamycin 300 mg BID + rifampin 300 mg BID for 10-12 weeks -- the gold standard antibiotic regimen for moderate HS); monitor for diarrhea at every visit -- instruct patient to report ANY diarrhea immediately as C. difficile colitis can develop even after therapy completion; topical clindamycin 1% is first-line for Hurley Stage I disease"
      },
      {
        name: "Rifampin (Rifadin/Rofact)",
        type: "Rifamycin antibiotic (RNA polymerase inhibitor)",
        action: "Inhibits bacterial DNA-dependent RNA polymerase, blocking RNA transcription and ultimately halting bacterial protein synthesis and replication. Highly effective against intracellular organisms and bacteria within biofilms (which are prevalent in HS sinus tracts). Has excellent tissue penetration and achieves high concentrations in abscesses and inflamed tissue. In HS, used synergistically with clindamycin for broad-spectrum coverage of the polymicrobial flora colonizing sinus tracts",
        sideEffects: "Orange-red discoloration of all bodily fluids (urine, tears, sweat, saliva -- must warn patient beforehand; stains contact lenses permanently), hepatotoxicity (monitor liver function tests), GI disturbances (nausea, vomiting, diarrhea), flu-like syndrome, thrombocytopenia, potent CYP450 enzyme inducer (reduces levels of many co-administered medications)",
        contra: "Severe hepatic impairment or active hepatitis; concurrent use with protease inhibitors for HIV (dramatically reduced levels); jaundice; known hypersensitivity to rifamycins; caution with hormonal contraceptives (rifampin reduces efficacy -- must use alternative/additional contraception)",
        pearl: "CRITICAL drug interaction: rifampin is one of the most potent CYP450 inducers known and reduces levels of hormonal contraceptives (patients MUST use alternative birth control), warfarin (INR drops -- needs dose adjustment), methadone (may precipitate withdrawal), and many other medications; warn patients about orange discoloration of bodily fluids BEFORE starting therapy; baseline and monthly liver function tests during treatment; the clindamycin-rifampin combination for 10-12 weeks achieves clinical response in approximately 60% of moderate HS cases"
      }
    ],
    pearls: [
      "HS is a disease of follicular occlusion, NOT a primary infection -- antibiotics work in HS primarily through anti-inflammatory properties rather than antimicrobial effects; this is why standard short-course antibiotics for skin infection are ineffective",
      "The Hurley staging system guides treatment: Stage I (topical clindamycin, lifestyle modifications), Stage II (systemic antibiotics -- clindamycin + rifampin combination, consider biologics), Stage III (adalimumab and/or surgical excision) -- assess and document Hurley stage at every visit",
      "Smoking cessation and weight loss are the two most impactful modifiable risk factors -- nicotine directly promotes follicular plugging and inflammation; obesity increases friction, moisture, and systemic inflammation; both should be addressed at every visit",
      "Rifampin causes orange-red discoloration of ALL bodily fluids (urine, tears, sweat, saliva, stool) -- patients MUST be warned about this before starting therapy; it will permanently stain contact lenses, and patients should switch to glasses during treatment",
      "Adalimumab dosing for HS is DIFFERENT from other indications -- HS requires 40 mg weekly (not every 2 weeks as in rheumatoid arthritis); TB screening and hepatitis B screening must be completed before initiating any anti-TNF therapy",
      "Double-ended comedones (paired blackheads connected by a subcutaneous sinus tract) are a characteristic feature of chronic HS that distinguishes it from simple acne, furuncles, or other skin infections -- their presence strongly supports the diagnosis",
      "Psychosocial assessment is essential at every visit -- HS patients have depression and anxiety rates comparable to cancer patients; the chronic pain, malodorous drainage, and disfigurement profoundly impact relationships, employment, and self-worth; validate their experience and connect with support resources"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient newly prescribed rifampin as part of combination antibiotic therapy for hidradenitis suppurativa. Which patient education point is most important to address before starting therapy?",
        options: [
          "The medication should be taken on an empty stomach for best absorption",
          "All bodily fluids will turn orange-red in color, and alternative contraception is needed if using hormonal birth control",
          "The medication will cause increased sun sensitivity requiring daily sunscreen use",
          "Hair loss is a common side effect that reverses after completing therapy"
        ],
        correct: 1,
        rationale: "Rifampin causes orange-red discoloration of all bodily fluids (urine, tears, sweat, saliva) which can alarm patients if they are not warned in advance. It will permanently stain contact lenses. Critically, rifampin is a potent CYP450 enzyme inducer that significantly reduces the effectiveness of hormonal contraceptives, requiring patients to use alternative or additional contraception methods during treatment."
      },
      {
        question: "A patient with hidradenitis suppurativa presents with recurrent abscesses in the axillae connected by palpable cord-like tracts under the skin, with scarring between lesions but some normal skin remaining. Which Hurley stage does this presentation represent?",
        options: [
          "Hurley Stage I -- isolated abscess formation",
          "Hurley Stage II -- recurrent abscesses with sinus tracts and scarring",
          "Hurley Stage III -- diffuse involvement with no normal skin remaining",
          "Hurley Stage IV -- systemic disease with internal organ involvement"
        ],
        correct: 1,
        rationale: "Hurley Stage II is characterized by recurrent abscesses with sinus tract (tunnel) formation and scarring, but with normal skin present between the involved areas. Stage I has isolated abscesses without sinus tracts or scarring. Stage III has diffuse involvement across an entire region with multiple interconnected sinus tracts and little or no normal skin remaining. There is no Stage IV."
      },
      {
        question: "A practical nurse is educating a patient with hidradenitis suppurativa about lifestyle modifications that can reduce disease severity. Which recommendation is most important?",
        options: [
          "Apply fragrant deodorant to affected areas daily to control odor",
          "Wear tight compression garments to reduce drainage",
          "Quit smoking and pursue gradual weight loss if overweight",
          "Shave affected areas regularly to prevent follicular occlusion"
        ],
        correct: 2,
        rationale: "Smoking cessation and weight loss are the two most impactful modifiable risk factors for HS. Nicotine directly promotes follicular plugging and worsens the inflammatory response, while obesity increases friction, moisture, and systemic inflammation in skin folds. Shaving, tight clothing, and irritating products (fragranced deodorants) can worsen HS by increasing follicular irritation and mechanical friction."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
