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
  "scabies-rpn": {
    title: "Scabies for Practical Nurses",
    cellular: {
      title: "Pathophysiology and Transmission of Scabies",
      content: "Scabies is a highly contagious parasitic skin infestation caused by the microscopic mite Sarcoptes scabiei var. hominis. The fertilized female mite burrows into the stratum corneum (outermost layer of the epidermis) using proteolytic enzymes that dissolve keratin, creating serpentine tunnels where she deposits two to three eggs per day along with fecal pellets called scybala. The burrowing process itself does not initially produce symptoms; the intense pruritus characteristic of scabies results from a delayed type IV hypersensitivity reaction to mite proteins, eggs, and fecal matter. This immune-mediated response typically develops four to six weeks after initial infestation in a previously unexposed individual, which means a patient can be infested and contagious for weeks before symptoms appear. Upon re-infestation, however, the immune system recognizes the antigens immediately, and symptoms develop within one to three days. The host immune response involves T-lymphocyte activation, eosinophil infiltration, and immunoglobulin E (IgE) production, which together produce the erythematous papular eruption and intense itching. Transmission occurs primarily through prolonged direct skin-to-skin contact lasting approximately 15 to 20 minutes, making household members, sexual partners, and healthcare workers in close-contact care settings particularly vulnerable. Fomite transmission through shared bedding, clothing, or towels is possible but less common in classic scabies because the mite can survive only 48 to 72 hours off the human host. Norwegian scabies (also called crusted scabies) is a severe hyperinfestation variant that occurs in immunocompromised, elderly, or institutionalized patients. In Norwegian scabies, the mite burden can reach millions compared to the typical 10 to 15 mites in classic scabies, making these patients extraordinarily contagious. The thick, hyperkeratotic crusts harbor enormous numbers of mites and can shed into the environment, leading to outbreaks in long-term care facilities and hospitals. The practical nurse must understand that scabies is not a reflection of poor hygiene and affects all socioeconomic groups. Prompt recognition, appropriate treatment of the infested patient and all close contacts simultaneously, and proper environmental decontamination are essential to prevent ongoing transmission cycles."
    },
    riskFactors: [
      "Close-contact living environments (long-term care facilities, dormitories, shelters, correctional facilities)",
      "Immunocompromised status (HIV/AIDS, organ transplant recipients, chronic corticosteroid use) increasing risk for Norwegian/crusted scabies",
      "Elderly patients with decreased immune response and impaired sensory perception",
      "Infants and young children (immature immune system, close physical contact during care)",
      "Healthcare workers providing prolonged direct care without appropriate barrier precautions",
      "Sexual contact with an infested individual (scabies is classified as a sexually transmitted infection in adults)",
      "Overcrowded living conditions with limited access to laundry and hygiene facilities"
    ],
    diagnostics: [
      "Skin scraping with mineral oil preparation: scrape a fresh burrow with a scalpel blade coated in mineral oil, place on a glass slide, and examine under light microscopy for mites, eggs, or fecal pellets (scybala); this is the definitive diagnostic test",
      "Dermoscopy (handheld dermatoscope): visualize the delta-wing jet sign (the dark triangular structure of the mite head at the end of a burrow) without scraping; increasingly used as a non-invasive first-line tool",
      "Ink burrow test: apply washable ink to the suspected area, wipe clean with alcohol; ink tracks remaining in the stratum corneum outline the burrow pathway",
      "Complete blood count (CBC): may show peripheral eosinophilia reflecting the allergic/immune response to the mite infestation",
      "Serum IgE levels: often elevated in scabies due to the type IV hypersensitivity reaction; significantly elevated in Norwegian/crusted scabies",
      "Skin biopsy (rarely needed): shows spongiotic dermatitis with eosinophilic infiltrate; mites or eggs may be visible in the stratum corneum in cross-section"
    ],
    management: [
      "Apply prescribed topical scabicide (permethrin 5% cream) to the entire body from the jawline down, including all skin folds, under fingernails, between fingers and toes, and genital areas; leave on for 8 to 14 hours before washing off",
      "Treat ALL household members and close contacts simultaneously regardless of whether they have symptoms, because asymptomatic incubation can last up to 6 weeks",
      "Launder all clothing, bedding, and towels used within the past 72 hours in hot water (60 degrees Celsius or higher) and dry on high heat for at least 20 minutes",
      "Seal items that cannot be laundered (stuffed animals, pillows, shoes) in a plastic bag for at least 72 hours to allow mites to die from lack of host contact",
      "Repeat the permethrin application in 7 to 14 days as prescribed to kill any newly hatched mites from eggs that survived the first treatment",
      "Educate patient that pruritus may persist for 2 to 4 weeks after successful treatment due to ongoing immune reaction to dead mite debris; this does not indicate treatment failure",
      "For Norwegian/crusted scabies: initiate contact precautions (gown and gloves), administer oral ivermectin in combination with topical permethrin, and coordinate infection control measures for the facility"
    ],
    nursingActions: [
      "Implement contact precautions (gown and gloves) when providing direct care to patients with suspected or confirmed scabies, especially Norwegian/crusted scabies",
      "Perform a thorough skin assessment documenting the distribution of lesions, burrow patterns, and areas of excoriation; pay special attention to interdigital web spaces, wrist flexor surfaces, axillae, periumbilical area, buttocks, and genital region",
      "Administer prescribed antipruritic medications (hydroxyzine) and apply cool compresses to reduce itching and prevent secondary bacterial infection from scratching",
      "Trim patient fingernails short and keep them clean to reduce mite transmission from under the nails and minimize excoriation injuries",
      "Educate the patient and family about the transmission mechanism, treatment protocol, and the critical importance of treating all contacts simultaneously",
      "Document the date and time of scabicide application, the areas covered, duration of application, and the scheduled repeat treatment date",
      "Report confirmed scabies cases to infection control as per facility protocol; in long-term care facilities, mass screening may be required to contain outbreaks"
    ],
    assessmentFindings: [
      "Intense pruritus that characteristically worsens at night (mites are more active in warm environments, and nocturnal scratching is a hallmark feature)",
      "Linear or serpiginous (S-shaped) burrows, 2 to 15 mm long, appearing as thin grey or skin-colored raised lines, most commonly in interdigital web spaces and wrist flexor surfaces",
      "Erythematous papules, vesicles, and nodules distributed in characteristic locations: finger webs, wrists, elbows, axillary folds, periumbilical area, buttocks, and genitalia",
      "Excoriations and secondary impetiginization (crusting, honey-colored exudate) from scratching-induced skin breakdown and bacterial superinfection",
      "In Norwegian/crusted scabies: widespread thick, grey, scaly, hyperkeratotic plaques and crusts covering large body surface areas with minimal pruritus despite massive mite burden",
      "In infants: vesicles and papules on the palms, soles, face, and scalp (areas not typically affected in adults); generalized eczematous eruption may obscure the classic burrow pattern",
      "Scabetic nodules: firm, pruritic, red-brown nodules (2-20 mm) most common on male genitalia, groin, and axillae; these represent a robust inflammatory response and may persist for months after treatment"
    ],
    signs: {
      left: [
        "Pruritus that worsens at night",
        "Linear or S-shaped burrows in web spaces of fingers",
        "Erythematous papules in characteristic distribution",
        "Mild excoriations from scratching",
        "Reports of similar symptoms in household contacts",
        "Restlessness and sleep disruption from itching"
      ],
      right: [
        "Widespread crusted plaques suggesting Norwegian scabies (highly contagious)",
        "Signs of secondary bacterial infection (cellulitis, impetigo, abscess)",
        "Fever and lymphadenopathy indicating systemic infection from skin breakdown",
        "Post-streptococcal glomerulonephritis from secondary Group A Strep infection",
        "Sepsis from extensive secondary bacterial infection in immunocompromised patients",
        "Institutional outbreak with multiple residents affected simultaneously"
      ]
    },
    medications: [
      {
        name: "Permethrin 5% Cream (Nix/Elimite)",
        type: "Topical scabicide (synthetic pyrethroid)",
        action: "Disrupts sodium channel function in the nerve cell membranes of the mite, causing paralysis and death of Sarcoptes scabiei mites and their eggs through neurotoxic effects on the parasitic nervous system",
        sideEffects: "Mild burning or stinging at application site, transient erythema, pruritus (may worsen initially before improving), contact dermatitis in sensitive individuals",
        contra: "Known hypersensitivity to pyrethroids or chrysanthemum flowers (pyrethroids are derived from chrysanthemum); use with caution in infants under 2 months of age",
        pearl: "Apply from the neck down to all body surfaces including under fingernails, between all fingers and toes, skin folds, and genital area; leave on for 8-14 hours (typically applied at bedtime); repeat in 7-14 days to kill newly hatched larvae"
      },
      {
        name: "Ivermectin (Stromectol)",
        type: "Oral antiparasitic (avermectin derivative)",
        action: "Binds to glutamate-gated chloride channels in invertebrate nerve and muscle cells, causing increased cell membrane permeability to chloride ions, resulting in hyperpolarization, paralysis, and death of the parasite",
        sideEffects: "Dizziness, nausea, diarrhea, pruritis (Mazzotti reaction in patients with concurrent filariasis), transient hypotension, elevated liver enzymes",
        contra: "Children weighing less than 15 kg; pregnancy (Category C -- potential teratogenic effects); breastfeeding mothers; concurrent use with drugs that enhance GABA activity (barbiturates, benzodiazepines)",
        pearl: "First-line treatment for Norwegian/crusted scabies in combination with topical permethrin; standard dose is 200 mcg/kg orally as a single dose repeated in 7-14 days; taken on an empty stomach with water; does not kill eggs, so repeat dosing is essential"
      },
      {
        name: "Hydroxyzine (Atarax)",
        type: "Antihistamine (first-generation H1 receptor antagonist) and anxiolytic",
        action: "Competitively blocks histamine H1 receptors in peripheral tissues and the central nervous system, reducing the itch-scratch cycle; also has anticholinergic and sedative properties that help patients sleep through nocturnal pruritus",
        sideEffects: "Drowsiness, dry mouth, urinary retention, constipation, blurred vision, dizziness; excessive sedation in elderly patients",
        contra: "Early pregnancy (first trimester); prolonged QT interval; concurrent use with other CNS depressants (additive sedation); severe hepatic impairment",
        pearl: "Administer at bedtime to take advantage of the sedative effect and provide relief during peak nocturnal pruritus; inform patient that itching may continue for 2-4 weeks after successful scabies treatment due to persistent immune response to dead mite antigens"
      }
    ],
    pearls: [
      "Scabies pruritus characteristically worsens at NIGHT because mites are more active in warm environments -- nocturnal itching that affects multiple household members simultaneously is virtually pathognomonic for scabies",
      "The hallmark burrow is a thin, grey, serpiginous line found in INTERDIGITAL WEB SPACES of the fingers -- always inspect between all fingers carefully during skin assessment",
      "Norwegian (crusted) scabies carries millions of mites compared to 10-15 in classic scabies, making it EXTREMELY contagious -- requires contact precautions, oral ivermectin PLUS topical permethrin, and facility-wide infection control measures",
      "ALL household members and close contacts must be treated SIMULTANEOUSLY regardless of symptoms -- the 4-6 week asymptomatic incubation period means untreated contacts will reinfest the treated patient",
      "Post-treatment pruritus lasting 2-4 weeks is NORMAL and does not indicate treatment failure -- it results from ongoing immune response to dead mite proteins; educate patients to avoid unnecessary retreatment",
      "Permethrin cream must be applied to the ENTIRE body from jawline down, including under fingernails, between toes, skin folds, and genital areas -- missed areas allow surviving mites to perpetuate infestation",
      "In INFANTS, scabies affects the palms, soles, face, and scalp (unlike adults) -- a generalized eczematous eruption in an infant with nocturnal irritability and affected family members should raise suspicion for scabies"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a long-term care resident who reports intense itching that worsens at night. Upon examination, the nurse observes thin, grey, S-shaped lines between the fingers. Which condition should the nurse suspect and report?",
        options: [
          "Contact dermatitis from hand soap",
          "Scabies infestation",
          "Fungal infection (tinea manuum)",
          "Psoriasis of the hands"
        ],
        correct: 1,
        rationale: "The combination of intense nocturnal pruritus and serpiginous (S-shaped) burrows in the interdigital web spaces is the hallmark presentation of scabies infestation caused by Sarcoptes scabiei. The practical nurse should report this finding immediately and initiate contact precautions."
      },
      {
        question: "A patient with confirmed scabies is prescribed permethrin 5% cream. Which instruction should the practical nurse reinforce regarding application?",
        options: [
          "Apply the cream only to the areas where burrows are visible",
          "Apply from the jawline down to the entire body including skin folds, between fingers and toes, and under fingernails",
          "Apply the cream and wash it off after 30 minutes",
          "Apply the cream only at the onset of itching symptoms"
        ],
        correct: 1,
        rationale: "Permethrin 5% cream must be applied to the entire body from the jawline down, covering all skin surfaces including skin folds, interdigital spaces, under fingernails, and genital areas. Applying only to visible lesions leaves surviving mites in untreated areas. The cream should remain on the skin for 8-14 hours before washing off."
      },
      {
        question: "A practical nurse is caring for an immunocompromised patient diagnosed with Norwegian (crusted) scabies. Which infection control measure is MOST important?",
        options: [
          "Standard precautions with hand hygiene only",
          "Airborne precautions with an N95 respirator",
          "Contact precautions with gown and gloves for all direct care",
          "Droplet precautions with a surgical mask"
        ],
        correct: 2,
        rationale: "Norwegian (crusted) scabies requires strict contact precautions because the massive mite burden (millions vs. the typical 10-15) makes the patient highly contagious. Crusts shed into the environment, and mites can survive on fomites. Gown and gloves must be worn for all direct patient contact, and environmental decontamination is essential."
      }
    ]
  },

  "scarlet-fever-rpn": {
    title: "Scarlet Fever for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Scarlet Fever",
      content: "Scarlet fever (scarlatina) is an acute infectious disease caused by Group A beta-hemolytic Streptococcus (GAS), specifically Streptococcus pyogenes strains that produce erythrogenic (pyrogenic) exotoxins. These exotoxins, designated SpeA, SpeB, and SpeC, are the distinguishing factor between a simple streptococcal pharyngitis and scarlet fever; only toxin-producing strains cause the characteristic rash. The exotoxins function as superantigens, meaning they bypass normal antigen processing and directly activate large populations of T-lymphocytes by cross-linking the T-cell receptor with the major histocompatibility complex (MHC) class II molecule on antigen-presenting cells. This non-specific mass activation triggers a cytokine storm with release of interleukin-1 (IL-1), interleukin-2 (IL-2), tumor necrosis factor-alpha (TNF-alpha), and interferon-gamma (IFN-gamma), producing the systemic inflammatory response that manifests as fever, malaise, and the hallmark diffuse erythematous rash. The rash results from capillary damage and erythrocyte extravasation in the dermis caused by the cytokine-mediated inflammatory response. The skin develops a characteristic sandpaper-like texture due to the combination of punctate erythematous papules (1-2 mm) superimposed on a generalized erythematous background. Pastia lines are linear petechial streaks that appear in skin creases (antecubital fossae, axillary folds, inguinal folds) where capillary fragility is greatest. The strawberry tongue progresses through two stages: initially a white strawberry tongue (white coating with edematous red papillae protruding through) evolves into a red strawberry tongue (desquamation of the white coating reveals a beefy red tongue with prominent papillae) by days four to five. Transmission occurs via respiratory droplets from infected individuals or asymptomatic carriers, with an incubation period of two to five days. The disease primarily affects children aged 5 to 15 years, though it can occur at any age. Scarlet fever requires prompt antibiotic treatment not only to resolve the acute infection but critically to prevent serious post-streptococcal sequelae: acute rheumatic fever (ARF), which can cause permanent cardiac valve damage, and post-streptococcal glomerulonephritis (PSGN), which can result in renal impairment. The practical nurse plays a vital role in timely recognition of the characteristic presentation, administration of prescribed antibiotics, monitoring for complications, and educating families about the importance of completing the full antibiotic course."
    },
    riskFactors: [
      "School-age children between 5 and 15 years (peak incidence due to close contact in school settings and developing immune systems)",
      "Close contact with an infected individual or GAS carrier (household members, classmates, daycare contacts)",
      "Crowded living conditions (dormitories, military barracks, shelters) facilitating respiratory droplet transmission",
      "Winter and early spring seasonality (peak GAS transmission periods due to indoor crowding)",
      "History of recent streptococcal pharyngitis without adequate antibiotic treatment",
      "Immunocompromised children (increased susceptibility to toxin-mediated disease)",
      "Lack of previous exposure to the specific erythrogenic exotoxin type (immunity is toxin-type specific, not organism specific)"
    ],
    diagnostics: [
      "Rapid antigen detection test (RADT): point-of-care throat swab detecting GAS carbohydrate antigen; high specificity (95%) but moderate sensitivity (70-90%); negative results in children should be confirmed with throat culture",
      "Throat culture on blood agar: gold standard for GAS identification; demonstrates beta-hemolysis (complete red blood cell lysis); requires 24-48 hours for results; sensitivity approaches 97%",
      "Anti-streptolysin O (ASO) titer: measures antibodies against streptolysin O enzyme; rises 1-3 weeks after infection and peaks at 3-5 weeks; used to confirm recent GAS infection when evaluating for post-streptococcal complications",
      "Complete blood count (CBC): typically shows leukocytosis with left shift (increased neutrophils and band forms) indicating acute bacterial infection; eosinophilia may occur during the convalescent desquamation phase",
      "C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR): elevated inflammatory markers supporting acute bacterial infection; useful for monitoring treatment response",
      "Urinalysis: should be performed 1-3 weeks post-infection to screen for post-streptococcal glomerulonephritis (hematuria, proteinuria, red blood cell casts)"
    ],
    management: [
      "Administer prescribed antibiotic therapy immediately upon clinical diagnosis; do not wait for culture results -- penicillin V orally for 10 days is first-line treatment",
      "Ensure the patient completes the FULL 10-day antibiotic course even if symptoms resolve within 24-48 hours; incomplete treatment increases risk of rheumatic fever",
      "Implement droplet precautions until the patient has completed at least 24 hours of effective antibiotic therapy, after which the patient is considered non-contagious",
      "Provide supportive care: adequate oral hydration (cool fluids, popsicles), soft diet for pharyngeal discomfort, cool-mist humidifier for throat irritation",
      "Administer prescribed antipyretics (acetaminophen) for fever management; avoid aspirin in children due to risk of Reye syndrome",
      "Exclude the child from school or daycare until at least 24 hours of antibiotic therapy have been completed and fever has resolved",
      "Schedule follow-up assessment 2-3 weeks post-treatment to evaluate for post-streptococcal complications (joint pain suggesting rheumatic fever, facial edema or tea-colored urine suggesting glomerulonephritis)"
    ],
    nursingActions: [
      "Perform a focused assessment including inspection of the pharynx (erythema, tonsillar exudate, palatal petechiae), tongue (strawberry tongue appearance), and skin (sandpaper rash distribution, Pastia lines)",
      "Obtain a throat swab specimen for RADT and/or culture using proper technique: swab both tonsillar pillars and the posterior pharynx while avoiding the tongue and buccal mucosa",
      "Monitor temperature every 4 hours; fever typically resolves within 24-48 hours of antibiotic initiation -- persistent fever beyond 48 hours may indicate complications or antibiotic resistance",
      "Assess skin daily during the acute phase and document rash progression; the desquamation phase (skin peeling) begins on the face around day 7-10 and progresses to the trunk and extremities, lasting up to 6 weeks",
      "Monitor fluid intake and encourage oral hydration; assess for signs of dehydration (decreased urine output, dry mucous membranes, poor skin turgor) especially in young children with painful swallowing",
      "Educate family members about the importance of completing the full 10-day antibiotic course and the risk of serious complications (rheumatic fever, glomerulonephritis) from incomplete treatment",
      "Report any new symptoms developing 1-3 weeks after acute illness: joint pain/swelling, chest pain, facial edema, dark or decreased urine output (may indicate post-streptococcal sequelae)"
    ],
    assessmentFindings: [
      "Sandpaper-textured rash: diffuse, fine, erythematous papular eruption that feels like sandpaper on palpation; begins on the trunk and spreads to extremities; blanches with pressure; spares the palms and soles",
      "Strawberry tongue: initially white-coated tongue with red edematous papillae (white strawberry tongue, days 1-2) progressing to a beefy red tongue with prominent papillae (red strawberry tongue, days 4-5)",
      "Pastia lines: linear petechial streaks in skin creases (antecubital fossae, axillary folds, inguinal creases) that do not blanch; result from increased capillary fragility in pressure areas",
      "Circumoral pallor: characteristic pale area around the mouth contrasting with flushed cheeks, creating a distinctive facial appearance",
      "Pharyngeal findings: beefy red pharynx, enlarged erythematous tonsils with or without exudate, palatal petechiae (small red hemorrhagic spots on the soft palate)",
      "Desquamation: skin peeling begins around day 7-10, starting on the face and progressing to the trunk, fingertips, and toes; large sheets of skin may peel from the palms and soles",
      "Systemic symptoms: high fever (38.5-40 degrees Celsius), sore throat with odynophagia, headache, abdominal pain, nausea/vomiting, tender anterior cervical lymphadenopathy"
    ],
    signs: {
      left: [
        "Sore throat and difficulty swallowing",
        "Fever (38.5-40 degrees Celsius)",
        "Sandpaper-textured rash on trunk and extremities",
        "Strawberry tongue appearance",
        "Tender anterior cervical lymphadenopathy",
        "Headache and malaise"
      ],
      right: [
        "Peritonsillar abscess (unilateral tonsillar swelling, trismus, uvular deviation)",
        "Signs of acute rheumatic fever (joint pain/swelling, new heart murmur, chorea)",
        "Signs of post-streptococcal glomerulonephritis (facial/periorbital edema, hypertension, dark urine)",
        "Severe dehydration from inability to swallow and high fever",
        "Invasive GAS disease (necrotizing fasciitis, streptococcal toxic shock syndrome)",
        "Respiratory distress from severe pharyngeal edema or retropharyngeal abscess"
      ]
    },
    medications: [
      {
        name: "Penicillin V (Pen-Vee K)",
        type: "Natural penicillin antibiotic (beta-lactam)",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), preventing cross-linking of peptidoglycan polymers in the cell wall; results in osmotic instability and bacterial cell lysis; GAS remains universally susceptible to penicillin with no documented resistance",
        sideEffects: "Nausea, vomiting, diarrhea, oral candidiasis (thrush), allergic reactions ranging from mild rash to anaphylaxis, Clostridioides difficile-associated diarrhea",
        contra: "History of anaphylaxis or severe hypersensitivity reaction to any penicillin; use with caution in patients with cephalosporin allergy (approximately 1-2% cross-reactivity)",
        pearl: "First-line treatment for scarlet fever: 250 mg orally twice daily for children, 500 mg twice daily for adolescents/adults, for a FULL 10-day course; must complete entire course to prevent rheumatic fever even if symptoms resolve; take on an empty stomach for best absorption"
      },
      {
        name: "Amoxicillin (Amoxil)",
        type: "Aminopenicillin antibiotic (beta-lactam)",
        action: "Extended-spectrum penicillin that inhibits bacterial cell wall synthesis by binding to PBPs with broader gram-negative coverage than penicillin V; better oral bioavailability and more palatable liquid suspension make it the preferred alternative for pediatric patients who refuse penicillin V tablets",
        sideEffects: "Diarrhea (most common), nausea, vomiting, skin rash (non-allergic maculopapular rash occurs in approximately 5-10% of patients), oral candidiasis, hypersensitivity reactions",
        contra: "History of anaphylaxis to penicillin; infectious mononucleosis (high risk of developing non-allergic diffuse maculopapular rash); use with caution in renal impairment (dose adjustment required)",
        pearl: "Acceptable alternative to penicillin V for GAS pharyngitis/scarlet fever at 50 mg/kg/day (max 1000 mg/day) divided twice daily for 10 days; the liquid suspension is better tolerated by young children; once-daily high-dose amoxicillin (750 mg) is an option for improved adherence"
      },
      {
        name: "Azithromycin (Zithromax)",
        type: "Macrolide antibiotic",
        action: "Binds to the 50S ribosomal subunit of bacterial ribosomes, inhibiting translocation of peptidyl-tRNA and blocking protein synthesis; bacteriostatic at standard doses; concentrated intracellularly in phagocytes which transport it to sites of infection",
        sideEffects: "Nausea, diarrhea, abdominal pain, QT prolongation (risk of torsades de pointes), hepatotoxicity (rare), allergic reactions",
        contra: "History of cholestatic jaundice or hepatic dysfunction associated with prior azithromycin use; concurrent use with QT-prolonging medications; known hypersensitivity to macrolides",
        pearl: "Reserved for patients with confirmed penicillin ALLERGY; 5-day course (12 mg/kg day 1, then 6 mg/kg days 2-5, max 500 mg day 1 then 250 mg); increasing macrolide resistance in GAS (up to 15% in some regions) means this is NOT first-line; always document penicillin allergy type before selecting"
      }
    ],
    pearls: [
      "The SANDPAPER RASH is the hallmark of scarlet fever -- if a child with pharyngitis develops a rough-textured erythematous rash that feels like sandpaper, suspect scarlet fever and obtain a throat culture or RADT immediately",
      "STRAWBERRY TONGUE progresses through two stages: white strawberry tongue (days 1-2) with white coating and protruding red papillae, followed by red strawberry tongue (days 4-5) after the coating desquamates",
      "PASTIA LINES are linear petechial streaks in skin folds (antecubital, axillary, inguinal) that do NOT blanch with pressure -- these are pathognomonic for scarlet fever when present with the characteristic rash",
      "The FULL 10-DAY antibiotic course must be completed even if the child feels better within 24-48 hours -- incomplete treatment significantly increases the risk of acute rheumatic fever with potential permanent cardiac valve damage",
      "CIRCUMORAL PALLOR (pale ring around the mouth with flushed cheeks) is a characteristic facial finding that helps differentiate scarlet fever from other childhood exanthems such as measles or roseola",
      "The child can return to school or daycare after completing at least 24 HOURS of antibiotic therapy AND being afebrile -- this timing is critical for infection control while avoiding unnecessary school absence",
      "Monitor for POST-STREPTOCOCCAL complications 1-3 weeks after acute illness: joint pain and new heart murmur suggest rheumatic fever; facial edema, hypertension, and tea-colored urine suggest glomerulonephritis -- report these findings immediately"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a 7-year-old child with fever and sore throat. Which combination of findings is MOST characteristic of scarlet fever?",
        options: [
          "Vesicular rash on the trunk with a centripetal distribution",
          "Sandpaper-textured rash with strawberry tongue and circumoral pallor",
          "Maculopapular rash starting on the face with Koplik spots",
          "Petechial rash on the lower extremities with joint pain"
        ],
        correct: 1,
        rationale: "Scarlet fever presents with a classic triad: sandpaper-textured diffuse erythematous rash, strawberry tongue, and circumoral pallor (pale ring around the mouth with flushed cheeks). Koplik spots are associated with measles. Vesicular rash suggests varicella. Petechial rash with joint pain may suggest Henoch-Schonlein purpura."
      },
      {
        question: "A child diagnosed with scarlet fever is prescribed penicillin V for 10 days. The parent states the child feels better after 3 days and asks if the antibiotic can be stopped. What is the BEST response by the practical nurse?",
        options: [
          "Agree that the antibiotic can be stopped since the child is improving",
          "Reinforce that the full 10-day course must be completed to prevent serious complications such as rheumatic fever",
          "Suggest switching to a shorter course of azithromycin instead",
          "Advise the parent to give the antibiotic only when symptoms return"
        ],
        correct: 1,
        rationale: "The full 10-day penicillin course must be completed to adequately eradicate GAS and prevent post-streptococcal sequelae, particularly acute rheumatic fever which can cause permanent cardiac valve damage. Stopping antibiotics early because symptoms have resolved is a common parental concern that requires clear education about the prevention of serious complications."
      },
      {
        question: "A practical nurse observes linear petechial streaks in the antecubital fossae and axillary folds of a child with scarlet fever. Which term correctly identifies this assessment finding?",
        options: [
          "Koplik spots",
          "Forchheimer spots",
          "Pastia lines",
          "Nikolsky sign"
        ],
        correct: 2,
        rationale: "Pastia lines are linear petechial streaks found in skin creases (antecubital fossae, axillary folds, inguinal creases) that do not blanch with pressure. They are characteristic of scarlet fever and result from increased capillary fragility in areas of skin fold pressure. Koplik spots are associated with measles, and Nikolsky sign is associated with pemphigus vulgaris."
      }
    ]
  },

  "scope-of-practice-rpn": {
    title: "RPN Scope of Practice for Practical Nurses",
    cellular: {
      title: "Regulatory Framework and Scope of Practice Foundations",
      content: "Scope of practice defines the activities, procedures, and processes that a regulated health professional is authorized to perform based on their education, competency, and legislative authority. For the Registered Practical Nurse (RPN) in Canada (known as the Licensed Practical Nurse or LPN in most other provinces and in the United States), scope of practice is established through a multi-layered regulatory framework that includes provincial or territorial legislation (such as the Nursing Act in Ontario), regulations made under that legislation, standards of practice published by the regulatory college (such as the College of Nurses of Ontario), and employer-specific policies that may further define or restrict practice within a particular setting. The RPN scope differs from the Registered Nurse (RN) scope primarily in the complexity and predictability of patient outcomes. The RPN is educated and authorized to provide care to patients whose conditions are generally stable, predictable, and have well-established plans of care. When a patient's condition becomes complex, unpredictable, or rapidly changing, the RPN is expected to recognize these changes, implement immediate safety interventions within their competence, and promptly communicate the situation to the RN or physician for further assessment and decision-making. Controlled acts are specific procedures that carry inherent risk and are authorized only to designated professions under legislation. RPNs may perform certain controlled acts either through direct orders, medical directives, or delegation, depending on the jurisdiction and the specific act. Common controlled acts within RPN scope include performing prescribed procedures below the dermis (injections, venipuncture), administering prescribed medications (including certain controlled substances), and inserting instruments beyond specific anatomical landmarks (urinary catheterization, nasogastric tube insertion). The three-factor framework used by most regulatory colleges to determine appropriateness of an RPN performing a specific activity evaluates: the patient factor (complexity, predictability, and risk of negative outcomes), the nurse factor (individual competence, education, and experience), and the environmental factor (availability of resources, supervision, and consultation). Delegation is the process by which an RN or other authorized professional transfers the authority to perform a specific task to an RPN or unregulated care provider. The RPN must understand that accepting a delegated task means accepting accountability for performing it competently and safely. The RPN has both the right and the responsibility to refuse a delegation if they do not have the competence to perform the task safely. Documentation is fundamental to scope of practice compliance; every assessment, intervention, and communication must be accurately recorded in the patient record to demonstrate adherence to standards of practice and provide a legal record of care provided."
    },
    riskFactors: [
      "Practicing in settings with limited RN or physician availability (rural, remote, or long-term care facilities) where RPNs may be pressured to exceed scope",
      "Inadequate orientation to new practice settings, equipment, or patient populations beyond the RPN's competence level",
      "Employer policies that conflict with or exceed regulatory scope limitations, creating confusion about authorized practice",
      "Failure to maintain current competence through continuing education and professional development activities",
      "Working with unfamiliar patient populations (e.g., RPN experienced in geriatrics assigned to pediatrics without adequate orientation)",
      "Staff shortages leading to pressure to perform activities beyond individual competence or regulatory authorization",
      "Unclear delegation processes where tasks are assigned without proper authorization, supervision, or competence verification"
    ],
    diagnostics: [
      "Documentation Tools: Scope reference guide -- a comprehensive quick-reference tool that outlines the specific controlled acts, authorized activities, and practice limitations for RPNs in the specific jurisdiction; should be accessible to all nursing staff",
      "Documentation Tools: Delegation decision tree -- a structured flowchart used to determine whether accepting a delegated task is appropriate based on the three-factor framework (patient complexity, nurse competence, environmental resources)",
      "Documentation Tools: Competency checklist -- a standardized form documenting an individual RPN's demonstrated competence in specific skills, procedures, and patient care activities; updated annually and whenever new competencies are acquired",
      "Provincial/territorial regulatory college website: primary source for current standards of practice, practice guidelines, and scope of practice documents specific to the jurisdiction",
      "Employer policy and procedure manuals: institutional policies that define practice expectations, delegation protocols, and reporting structures within the specific organization",
      "Incident and near-miss reporting systems: tools for documenting events where scope boundaries were unclear, exceeded, or compromised, enabling systemic improvement"
    ],
    management: [
      "Establish and maintain clear understanding of individual scope of practice by reviewing regulatory college standards, legislation, and employer policies at least annually",
      "Apply the three-factor framework before performing any activity: assess the patient factor (is the patient stable and predictable?), nurse factor (do I have the competence?), and environmental factor (are resources and supports available?)",
      "Communicate clearly with the healthcare team using structured tools (SBAR) when patient complexity exceeds RPN scope, ensuring seamless transfer of accountability to the RN or physician",
      "Decline delegated tasks that exceed individual competence and communicate the rationale clearly and professionally to the delegating professional and nurse manager",
      "Participate in ongoing professional development and maintain a professional portfolio documenting competency acquisition, continuing education, and reflective practice",
      "Report scope-of-practice concerns through appropriate channels (nurse manager, regulatory college, professional association) when systemic issues compromise patient safety",
      "Mentor new RPNs in understanding scope boundaries, delegation acceptance criteria, and the importance of practicing within authorized limits"
    ],
    nursingActions: [
      "Perform a self-assessment of competence before accepting any new patient assignment or delegated task, using the three-factor framework (patient, nurse, environment) to determine appropriateness",
      "Document all assessments, interventions, communications, and patient responses accurately and contemporaneously in the patient record as required by standards of practice",
      "Use SBAR (Situation, Background, Assessment, Recommendation) format when communicating patient status changes to the RN or physician, ensuring critical information is conveyed clearly",
      "Verify that a valid order (direct order, medical directive, or delegation) exists before performing any controlled act, and document the authorization source",
      "Recognize and respond to patient deterioration within RPN scope: implement immediate safety measures (position change, oxygen application, vital signs), then report to the RN or physician for further assessment",
      "Maintain professional boundaries in all patient interactions, recognizing that therapeutic relationships require consistent respect for patient autonomy, dignity, and confidentiality",
      "Participate in interprofessional team communication, contributing RPN-specific observations and assessments to collaborative care planning within appropriate scope"
    ],
    assessmentFindings: [
      "Patient situation requiring immediate assessment: stable vs. unstable -- if the patient's condition is predictable with established outcomes, the RPN can continue to provide care; if unpredictable or rapidly changing, the RPN must notify the RN or physician",
      "Delegation appropriateness indicators: the delegated task matches the RPN's documented competence, the patient's condition is stable enough for the task to be performed safely, and support resources are available",
      "Indicators that a situation exceeds RPN scope: patient deterioration with no established protocol, complex clinical decision-making required, conflicting assessment findings requiring differential diagnosis, or need to initiate new treatment plans",
      "Professional practice red flags: being asked to perform a procedure without prior competency validation, working without an identified RN or physician available for consultation, or feeling pressured to act beyond comfort or competence level",
      "Effective interprofessional communication markers: clear identification of roles, timely sharing of relevant patient information, mutual respect for scope differences, and collaborative problem-solving",
      "Documentation compliance indicators: entries are contemporaneous, objective, complete, legible, and include patient assessments, interventions performed, communications made, and outcomes observed"
    ],
    signs: {
      left: [
        "Patient condition is stable and predictable with established care plan",
        "RPN has documented competence for the required care activities",
        "Adequate resources and support are available in the practice environment",
        "Clear orders or medical directives are in place for required interventions",
        "Effective communication channels exist with RN and physician team members",
        "Regular professional development activities maintain current competence"
      ],
      right: [
        "Patient condition is unstable, unpredictable, or rapidly deteriorating (requires RN/physician assessment)",
        "RPN is being asked to perform activities beyond documented competence (must decline and communicate rationale)",
        "No RN or physician is available for consultation in a situation requiring clinical judgment beyond RPN scope",
        "Employer policies conflict with regulatory scope -- potential patient safety risk requiring formal reporting",
        "Delegation from another professional lacks proper authorization or competence verification process",
        "Systemic staffing shortages are creating pressure to practice beyond safe scope boundaries"
      ]
    },
    medications: [
      {
        name: "Medication Administration Within RPN Scope",
        type: "Documentation Tools (Scope Reference)",
        action: "RPNs administer medications via oral, subcutaneous, intramuscular, topical, rectal, and inhalation routes as prescribed by authorized prescribers; in most jurisdictions RPNs may also administer intravenous medications per medical directive after demonstrated competency and employer authorization",
        sideEffects: "Scope violation risks: administering medications without a valid order, failing to perform independent double-checks for high-alert medications, or administering medications via routes not authorized in the specific practice setting",
        contra: "RPNs must NOT independently prescribe medications, adjust dosages without a valid order or medical directive, or administer medications via routes for which they have not demonstrated competence",
        pearl: "The three rights of delegation apply to medication administration: right task (medication is within RPN scope), right circumstance (patient is stable), right person (RPN has competence), right direction/communication (clear order exists), and right supervision (support available)"
      },
      {
        name: "Controlled Act: Injection Administration",
        type: "Documentation Tools (Competency Framework)",
        action: "Performing a procedure below the dermis (subcutaneous and intramuscular injections, venipuncture) is a controlled act authorized to RPNs in most jurisdictions; requires demonstrated competence through formal education, supervised practice, and documented competency validation",
        sideEffects: "Risk factors for error: incorrect site selection, improper needle gauge or length, failure to aspirate when required by facility policy, inadequate patient identification, and lack of post-injection monitoring for adverse reactions",
        contra: "RPNs must not perform injections for which they have not received competency validation; intradermal injections, intravenous push medications, and certain specialized injections may require additional training and authorization specific to the practice setting",
        pearl: "Maintain a current competency portfolio documenting all injection-related skills; when performing immunizations under a medical directive, ensure the directive is current, the RPN meets all listed criteria, and emergency anaphylaxis supplies are immediately accessible"
      },
      {
        name: "Documentation Standards for Practice",
        type: "Documentation Tools (Legal and Professional Requirements)",
        action: "Accurate, contemporaneous documentation creates a legal record of care provided, demonstrates adherence to standards of practice, facilitates continuity of care among team members, and provides evidence for quality improvement initiatives",
        sideEffects: "Documentation failures include: late entries without proper identification, omission of critical assessment findings, charting by exception without established protocol, and failure to document communications with other healthcare team members",
        contra: "Never document care that was not provided; never alter, delete, or falsify documentation; never document for another healthcare professional; never leave time gaps in documentation during critical events",
        pearl: "Use the FACT framework for clinical documentation: Factual (objective, measurable data), Accurate (correct information and spelling), Complete (all relevant assessments, interventions, and outcomes), and Timely (documented as close to the event as possible)"
      }
    ],
    pearls: [
      "The THREE-FACTOR FRAMEWORK guides every practice decision: Patient factor (stable/predictable?), Nurse factor (competent?), Environmental factor (resources available?) -- if ANY factor is unsatisfactory, consult the RN or physician before proceeding",
      "RPNs care for patients whose conditions are STABLE and PREDICTABLE with established plans of care -- when a patient's condition becomes unstable or unpredictable, the RPN must implement immediate safety measures and PROMPTLY notify the RN or physician",
      "Accepting a DELEGATED task means accepting ACCOUNTABILITY for performing it competently -- RPNs have both the RIGHT and the RESPONSIBILITY to decline tasks that exceed their competence, and must communicate the rationale professionally",
      "CONTROLLED ACTS (procedures below the dermis, administering substances by injection, inserting instruments beyond anatomical landmarks) require a valid order, medical directive, or delegation AND demonstrated individual competence",
      "SBAR (Situation, Background, Assessment, Recommendation) is the standard communication tool for reporting patient changes to the RN or physician -- structured communication reduces errors and ensures critical information is conveyed clearly",
      "Documentation must be CONTEMPORANEOUS (as close to the event as possible), OBJECTIVE (factual data, not opinions), COMPLETE (all relevant information), and LEGIBLE -- documentation creates the legal record that the care was provided",
      "Scope of practice is NOT static -- it evolves with legislation changes, new competency standards, and individual professional development; RPNs must review regulatory college updates at least annually and maintain a current professional portfolio"
    ],
    quiz: [
      {
        question: "A practical nurse is assigned a patient whose condition has become unstable with rapidly changing vital signs. What is the MOST appropriate initial action?",
        options: [
          "Continue monitoring the patient and document findings at the end of the shift",
          "Implement immediate safety measures within RPN scope and promptly notify the registered nurse or physician",
          "Wait for the next scheduled assessment to confirm the changes before reporting",
          "Transfer the patient to another unit independently"
        ],
        correct: 1,
        rationale: "When a patient's condition becomes unstable or unpredictable, the RPN must implement immediate safety interventions within their scope (positioning, oxygen, vital signs) and promptly communicate the situation to the RN or physician for further assessment. Delaying communication or waiting for scheduled assessments compromises patient safety."
      },
      {
        question: "An RN delegates a procedure to a practical nurse. The practical nurse has not performed this procedure before and has no documented competence. What is the MOST appropriate response?",
        options: [
          "Perform the procedure and ask questions afterward if needed",
          "Decline the delegation, explain the lack of competence, and request support or an alternative assignment",
          "Perform the procedure while reading the policy manual simultaneously",
          "Accept the delegation to avoid conflict with the RN"
        ],
        correct: 1,
        rationale: "The RPN has both the right and the responsibility to decline a delegated task when they lack the competence to perform it safely. Accepting a delegation means accepting accountability for competent performance. The RPN should communicate the rationale professionally and request appropriate support or an alternative assignment."
      },
      {
        question: "Which framework does the practical nurse use to determine whether a specific patient care activity is within their scope of practice?",
        options: [
          "The nursing diagnosis taxonomy (NANDA)",
          "The three-factor framework: patient factor, nurse factor, and environmental factor",
          "The medication rights checklist",
          "The Glasgow Coma Scale assessment"
        ],
        correct: 1,
        rationale: "The three-factor framework evaluates patient complexity and predictability (patient factor), individual nurse competence and education (nurse factor), and availability of resources and support (environmental factor). All three factors must be satisfactory for the RPN to proceed with the activity within scope of practice."
      }
    ]
  },

  "screening-programs-rpn": {
    title: "Population Screening Programs for Practical Nurses",
    cellular: {
      title: "Principles and Epidemiology of Population-Based Screening",
      content: "Population-based screening is the systematic application of a test or inquiry to identify individuals at sufficient risk of a specific disorder to benefit from further investigation or direct preventive action, among persons who have not sought medical attention on account of symptoms of that disorder. Screening differs fundamentally from diagnostic testing: screening tests are applied to apparently healthy populations to identify those who may have a disease or precursor condition, while diagnostic tests are used in individuals who already have signs or symptoms to confirm or rule out a specific diagnosis. The effectiveness of any screening program depends on several foundational principles established by Wilson and Jungner: the condition must be an important health problem with a recognizable latent or early stage; there must be a suitable, acceptable test with adequate sensitivity and specificity; there must be an effective treatment that improves outcomes when the condition is detected early; and the overall program must be cost-effective compared to treating the condition after clinical presentation. Sensitivity refers to the ability of a screening test to correctly identify individuals who HAVE the disease (true positive rate). A highly sensitive test produces few false negatives, meaning it rarely misses individuals with the disease. Specificity refers to the ability of a test to correctly identify individuals who do NOT have the disease (true negative rate). A highly specific test produces few false positives, meaning healthy individuals are rarely incorrectly identified as having the disease. The positive predictive value (PPV) represents the probability that a person with a positive screening test actually has the disease, while the negative predictive value (NPV) represents the probability that a person with a negative test truly does not have the disease. PPV is heavily influenced by disease prevalence: even a highly specific test will produce many false positives when screening for a rare condition in a large population. Understanding these statistical concepts helps the practical nurse educate patients about the meaning of screening results and the potential for both false-positive results (causing unnecessary anxiety and follow-up testing) and false-negative results (providing false reassurance). Major national screening programs in Canada include cervical cancer screening (Papanicolaou test or HPV testing), breast cancer screening (mammography), colorectal cancer screening (fecal immunochemical test and colonoscopy), and newborn metabolic screening (heel prick blood spot). Each program has specific age-based eligibility criteria, screening intervals, and follow-up protocols that the practical nurse must understand to provide accurate patient education and facilitate appropriate referrals."
    },
    riskFactors: [
      "Underscreened or never-screened populations (immigrants, refugees, Indigenous communities, individuals without primary care access)",
      "Low health literacy limiting understanding of screening recommendations, test results, and follow-up instructions",
      "Cultural or religious barriers that create reluctance to participate in screening procedures (particularly cervical and breast cancer screening)",
      "Geographic barriers in rural and remote communities with limited access to screening facilities and follow-up services",
      "Socioeconomic factors (lack of transportation, inability to take time from work, no extended health benefits for ancillary costs)",
      "Fear of receiving a positive result leading to avoidance of screening appointments (particularly in patients with family history of cancer)",
      "Age-related factors: individuals at both extremes of age may be missed (too young for established programs or discontinued screening in elderly without clear guidelines)"
    ],
    diagnostics: [
      "Assessment Tools: Screening schedule -- a comprehensive reference tool documenting current evidence-based screening recommendations by age, sex, and risk category for all major screening programs applicable to the practice population",
      "Assessment Tools: Referral form -- a standardized form for documenting screening results and facilitating appropriate referrals for diagnostic follow-up when screening results are abnormal or require further investigation",
      "Assessment Tools: Population health tracker -- a database or tracking system that monitors screening completion rates, overdue screenings, and follow-up status for the patient population; enables proactive outreach to patients who are due or overdue for screening",
      "Cervical cancer screening: Papanicolaou (Pap) test (cytology) or HPV co-testing; recommended starting at age 21-25 (varies by province/state) with screening every 3 years (cytology) or 5 years (HPV primary screening)",
      "Breast cancer screening: mammography recommended for average-risk women aged 50-74 every 2 years; high-risk women may begin at 30-40 with annual mammography plus breast MRI",
      "Colorectal cancer screening: fecal immunochemical test (FIT) every 2 years for average-risk adults aged 50-74; colonoscopy every 10 years or upon positive FIT result; earlier screening for high-risk individuals"
    ],
    management: [
      "Maintain current knowledge of national and provincial/state screening guidelines and communicate these recommendations to patients during routine encounters",
      "Implement reminder systems (clinic-based recall, patient portals, telephone outreach) to identify patients who are due or overdue for recommended screenings",
      "Provide culturally sensitive patient education about the purpose, procedure, benefits, and limitations of each screening test, addressing misconceptions and barriers",
      "Ensure appropriate specimen collection technique for screening tests within RPN scope (e.g., FIT sample collection education, point-of-care screening procedures)",
      "Facilitate timely follow-up for abnormal screening results: schedule diagnostic appointments, coordinate referrals, and ensure patients understand the next steps",
      "Document all screening recommendations made, patient decisions (including informed refusal), results received, and follow-up actions taken in the patient record",
      "Participate in community outreach programs and health fairs to expand screening access to underserved populations and promote awareness of available programs"
    ],
    nursingActions: [
      "Conduct screening eligibility assessments during routine patient encounters: review age, sex, personal and family history, and risk factors to determine which screening programs apply to each individual patient",
      "Educate patients using plain language about screening test procedures, preparation requirements, and expected timelines for receiving results; address common fears and misconceptions",
      "Perform point-of-care screening procedures within RPN scope (blood pressure screening, blood glucose screening, BMI calculation) and document results accurately",
      "Provide written instructions for patient-collected screening specimens (FIT kits for colorectal screening, self-collected HPV swabs where available) and verify understanding through teach-back",
      "Report abnormal screening results to the supervising RN or physician promptly and ensure the patient is notified and appropriate follow-up is arranged within established timeframes",
      "Monitor and track screening completion using population health tools; generate reports identifying patients who are overdue for recommended screenings and initiate outreach contacts",
      "Document informed refusal when patients decline recommended screening, including the information provided about risks and benefits of screening and the patient's stated reason for refusal"
    ],
    assessmentFindings: [
      "Screening eligibility determination: patient meets age, sex, and risk criteria for one or more population-based screening programs based on current guidelines",
      "Barriers to screening participation: patient expresses fear, cultural concerns, financial constraints, transportation difficulties, or lack of understanding about screening purpose and process",
      "Abnormal screening result requiring follow-up: positive FIT (fecal immunochemical test) requiring colonoscopy referral; abnormal Pap smear requiring colposcopy; mammographic abnormality requiring diagnostic imaging",
      "Overdue screening status: patient has not completed recommended screening within the guideline-specified interval (e.g., no mammogram in past 2 years for eligible women aged 50-74)",
      "High-risk indicators requiring modified screening protocols: strong family history of cancer, genetic predisposition (BRCA1/2), personal history of precancerous lesions, or chronic conditions affecting screening intervals",
      "False-positive screening result impact: patient anxiety, unnecessary invasive procedures, financial burden, and potential loss of trust in the screening process; requires empathetic education and support",
      "Informed refusal: patient declines screening after receiving complete information about benefits and risks; RPN documents the discussion and respects patient autonomy while ensuring the decision is revisited at future encounters"
    ],
    signs: {
      left: [
        "Patient is within the recommended age range for screening programs",
        "Patient has risk factors that warrant enhanced screening protocols",
        "Patient is overdue for one or more recommended screening tests",
        "Patient expresses willingness to participate in screening but lacks knowledge about available programs",
        "Screening test result is within normal limits (negative screen)",
        "Patient asks questions about screening preparation and procedures"
      ],
      right: [
        "Abnormal screening result requiring urgent diagnostic follow-up (e.g., high-grade cervical dysplasia, suspicious mammographic mass)",
        "Patient with positive FIT result who fails to complete required colonoscopy follow-up (lost to follow-up creates significant cancer risk)",
        "Screening reveals incidental finding requiring immediate medical evaluation (e.g., hypertensive crisis during routine blood pressure screening)",
        "Community outbreak of a screenable condition requiring expanded or expedited screening protocols",
        "Patient with multiple overdue screenings and high-risk profile requiring comprehensive catch-up screening plan",
        "Systematic screening program failure (broken recall system, expired test kits) requiring immediate quality improvement intervention"
      ]
    },
    medications: [
      {
        name: "Colonoscopy Bowel Preparation (Polyethylene Glycol Solution)",
        type: "Assessment Tools (Screening Preparation Agent)",
        action: "Osmotic laxative solution that draws water into the intestinal lumen through osmotic gradient, producing watery diarrhea to completely evacuate colonic contents and provide clear visualization during colonoscopy; does not cause net fluid or electrolyte absorption or secretion",
        sideEffects: "Nausea, vomiting, bloating, abdominal cramping, electrolyte disturbances (hypokalemia, hyponatremia in elderly patients), aspiration risk if consumed too rapidly, dehydration if fluid intake is inadequate",
        contra: "Known or suspected bowel obstruction, bowel perforation, gastric retention, toxic colitis, or toxic megacolon; severe dehydration; patients unable to maintain adequate oral hydration during preparation",
        pearl: "Educate patients to begin a clear liquid diet 24 hours before the procedure; split-dose prep (half the evening before and half the morning of the procedure) improves bowel cleanliness and patient tolerance; encourage clear fluid intake between doses to prevent dehydration"
      },
      {
        name: "HPV Vaccine (Gardasil 9)",
        type: "Assessment Tools (Primary Prevention Through Vaccination)",
        action: "Recombinant vaccine containing virus-like particles (VLPs) from 9 HPV types (6, 11, 16, 18, 31, 33, 45, 52, 58); VLPs stimulate humoral immune response producing neutralizing antibodies against HPV capsid proteins, preventing initial HPV infection of cervical epithelial cells",
        sideEffects: "Injection site reactions (pain, swelling, erythema), headache, dizziness, syncope (particularly in adolescents -- observe for 15 minutes post-injection), nausea, low-grade fever",
        contra: "Severe allergic reaction (anaphylaxis) to a previous dose or to any vaccine component (including yeast); defer vaccination during moderate to severe acute illness; pregnancy (defer until post-partum)",
        pearl: "Most effective when administered BEFORE sexual debut; recommended for all individuals aged 9-26; two-dose schedule if started before age 15, three-dose schedule if started at age 15 or older; HPV vaccination is PRIMARY prevention (prevents infection), while Pap/HPV screening is SECONDARY prevention (detects precancerous changes)"
      },
      {
        name: "Guaiac/Immunochemical Fecal Occult Blood Test Kit",
        type: "Assessment Tools (Colorectal Screening Device)",
        action: "Fecal immunochemical test (FIT) uses antibodies specific to human hemoglobin to detect occult blood in stool samples; detects lower gastrointestinal bleeding that may indicate colorectal neoplasia; does not react to dietary hemoglobin sources (unlike older guaiac-based tests), improving specificity",
        sideEffects: "False-positive results causing unnecessary anxiety and invasive follow-up procedures (colonoscopy); false-negative results providing false reassurance in patients with non-bleeding or intermittently bleeding lesions",
        contra: "Should not be used as a diagnostic test in patients with known GI bleeding, visible blood in stool, or active hemorrhoidal bleeding (these patients need diagnostic colonoscopy, not screening); not appropriate during menstruation (risk of false positive)",
        pearl: "FIT requires only ONE stool sample (unlike older guaiac tests requiring three); no dietary restrictions needed before collection; store sample at room temperature and submit to laboratory within specified timeframe (usually 7 days); positive FIT ALWAYS requires colonoscopy follow-up regardless of subsequent negative FIT results"
      }
    ],
    pearls: [
      "SENSITIVITY measures a test's ability to correctly identify people WITH the disease (true positive rate) -- a highly sensitive test has few false negatives and is used to RULE OUT disease (mnemonic: SnNOut = Sensitivity/Negative/Out)",
      "SPECIFICITY measures a test's ability to correctly identify people WITHOUT the disease (true negative rate) -- a highly specific test has few false positives and is used to RULE IN disease (mnemonic: SpPIn = Specificity/Positive/In)",
      "POSITIVE PREDICTIVE VALUE (PPV) is heavily influenced by disease PREVALENCE -- even a highly specific test will produce many false positives when screening for a rare condition in a large population; this is why screening programs target high-risk populations",
      "A POSITIVE screening test does NOT equal a diagnosis -- it identifies individuals who need further DIAGNOSTIC testing; educate patients that most abnormal screening results do not confirm disease but require follow-up evaluation",
      "FIT (fecal immunochemical test) is the preferred stool-based colorectal screening test because it is specific to HUMAN hemoglobin, requires no dietary restriction, needs only ONE sample, and has superior sensitivity for colorectal cancer compared to guaiac-based tests",
      "INFORMED REFUSAL must be documented when patients decline recommended screening -- record the information provided about benefits and risks, the patient's stated reason for declining, and plan to revisit the recommendation at future encounters",
      "The practical nurse plays a CRITICAL role in closing screening gaps by proactively identifying patients who are due or overdue for screening during every clinical encounter, regardless of the reason for the visit"
    ],
    quiz: [
      {
        question: "A practical nurse is explaining colorectal cancer screening to a 52-year-old patient. Which statement by the patient indicates a correct understanding of the fecal immunochemical test (FIT)?",
        options: [
          "I need to avoid red meat for three days before collecting the sample",
          "A positive result means I definitely have colon cancer",
          "I need to collect three separate stool samples over three days",
          "A positive result means I need a colonoscopy for further evaluation"
        ],
        correct: 3,
        rationale: "A positive FIT result is a screening finding, not a diagnosis. It indicates the presence of human hemoglobin in the stool, which requires diagnostic follow-up with colonoscopy to determine the source of bleeding. FIT requires only one sample, has no dietary restrictions (unlike guaiac-based tests), and a positive result does not confirm cancer but always requires colonoscopy."
      },
      {
        question: "A practical nurse is reviewing screening concepts. A test with high sensitivity is BEST described as one that:",
        options: [
          "Correctly identifies individuals who DO have the disease, producing few false negatives",
          "Correctly identifies individuals who do NOT have the disease, producing few false positives",
          "Has a high positive predictive value regardless of disease prevalence",
          "Is used primarily to confirm a diagnosis after symptoms appear"
        ],
        correct: 0,
        rationale: "Sensitivity measures the proportion of individuals with the disease who are correctly identified by the test (true positive rate). A highly sensitive test produces few false negatives, meaning it rarely misses individuals who have the disease. High sensitivity is desirable for screening tests because the primary goal is to identify all potential cases (rule out disease -- SnNOut mnemonic)."
      },
      {
        question: "A 55-year-old patient with no risk factors declines recommended colorectal cancer screening after the practical nurse has explained the benefits and risks. What is the MOST appropriate nursing action?",
        options: [
          "Document the refusal without further discussion",
          "Report the patient to the physician as non-compliant",
          "Document the informed refusal including information provided and plan to revisit at future visits",
          "Refuse to provide any further care until the patient agrees to screening"
        ],
        correct: 2,
        rationale: "When a patient makes an informed decision to decline screening, the practical nurse must document the informed refusal, including the information provided about benefits and risks, the patient's stated reason for declining, and the plan to revisit the recommendation at future encounters. Patient autonomy must be respected while ensuring the decision was truly informed."
      }
    ]
  },

  "sensory-changes-rpn": {
    title: "Age-Related Sensory Changes for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Age-Related Sensory Decline",
      content: "Age-related sensory changes represent a progressive decline in the function of all five sensory systems (vision, hearing, taste, smell, and touch) that occurs as a normal part of the aging process. These changes result from cumulative cellular and structural deterioration in sensory organs, neural pathways, and cortical processing centers. In the visual system, presbyopia (age-related farsightedness) develops because the crystalline lens loses its elasticity and the ciliary muscles weaken, reducing the eye's ability to accommodate (change shape) for near vision. This process typically begins in the early 40s and progresses until approximately age 65 when accommodative ability is essentially lost. The lens also undergoes progressive yellowing and increased opacity due to oxidative damage to lens proteins (crystallins), reducing light transmission and altering color perception (particularly difficulty distinguishing blue from green). Pupil diameter decreases with age (senile miosis), reducing the amount of light reaching the retina; an older adult may need three times more light than a younger person to see clearly. Cataracts represent pathological opacification of the lens beyond normal aging changes and are the leading cause of reversible blindness worldwide. In the auditory system, presbycusis (age-related hearing loss) results from degeneration of hair cells in the organ of Corti (sensory presbycusis), atrophy of the stria vascularis (metabolic presbycusis), loss of auditory neurons (neural presbycusis), or stiffening of the basilar membrane (mechanical presbycusis). High-frequency hearing loss occurs first because the hair cells at the base of the cochlea (which detect high-frequency sounds) are most vulnerable to cumulative damage. This pattern affects the ability to hear consonant sounds (s, t, f, th), making speech discrimination difficult even when volume is adequate. The senses of taste and smell decline together because flavor perception depends on both systems. Olfactory receptor neurons decrease in number and regenerative capacity, while taste bud density and sensitivity decline, particularly for salt and bitter tastes. This dual sensory loss contributes to decreased appetite, poor nutritional intake, and inability to detect hazardous odors (natural gas, smoke, spoiled food). Tactile sensation diminishes due to decreased density of Meissner corpuscles (touch), Pacinian corpuscles (pressure/vibration), and free nerve endings in the dermis, combined with reduced peripheral nerve conduction velocity. This creates increased vulnerability to pressure injuries, burns, and falls because the patient may not perceive skin breakdown, temperature extremes, or proprioceptive changes. The practical nurse must understand these normal age-related changes to differentiate them from pathological conditions, implement appropriate safety interventions, modify communication strategies, and provide patient education that promotes functional independence despite sensory limitations."
    },
    riskFactors: [
      "Advanced age (sensory decline accelerates after age 65, with significant functional impact common after age 75)",
      "Chronic noise exposure throughout lifetime (occupational, recreational) accelerating presbycusis beyond normal age-related decline",
      "Diabetes mellitus (accelerates cataract formation, causes diabetic retinopathy, and worsens peripheral neuropathy affecting tactile sensation)",
      "Smoking history (contributes to macular degeneration, accelerates lens opacification, and damages olfactory receptors)",
      "Chronic medication use (ototoxic medications such as aminoglycosides and loop diuretics; anticholinergic medications causing dry eyes and dry mouth)",
      "Social isolation resulting from untreated hearing or vision loss, creating a cycle of withdrawal and further functional decline",
      "Nutritional deficiencies (vitamin A deficiency affecting night vision, vitamin B12 deficiency affecting peripheral nerve function)"
    ],
    diagnostics: [
      "Snellen chart visual acuity screening: tests distance vision with the patient standing 20 feet (6 meters) from the chart; normal is 20/20; refer for ophthalmologic evaluation if acuity is worse than 20/40 or if there is a significant change from baseline",
      "Whisper test and finger rub test: basic bedside hearing screening; stand 2 feet from the patient's ear (out of line of sight), whisper two-syllable words and ask the patient to repeat; inability to hear whispered words suggests hearing loss requiring formal audiometry",
      "Weber and Rinne tuning fork tests: Weber test (tuning fork on vertex of skull) differentiates conductive vs. sensorineural hearing loss by sound lateralization; Rinne test (tuning fork on mastoid then near ear canal) compares bone vs. air conduction; air conduction should be greater than bone conduction normally",
      "Monofilament testing (Semmes-Weinstein): 10-gram monofilament applied to plantar surface of feet; inability to perceive the filament indicates loss of protective sensation and high risk for undetected injuries and pressure ulcers",
      "Formal audiometry: comprehensive hearing evaluation performed by audiologist; establishes type (conductive, sensorineural, mixed), degree, and configuration of hearing loss; required for hearing aid fitting",
      "Ophthalmoscopic examination: direct visualization of the retina, optic disc, and retinal vasculature; performed by physician or NP to evaluate for cataracts, macular degeneration, diabetic retinopathy, and glaucoma"
    ],
    management: [
      "Ensure adequate lighting in the patient's environment: use at least 3 times more light than standard for older adults; position lighting to reduce glare; use nightlights in hallways and bathrooms to prevent falls",
      "Modify communication approach for hearing-impaired patients: face the patient directly, speak clearly at a moderate pace (do NOT shout), reduce background noise, use written communication or communication boards as needed",
      "Implement fall prevention strategies: remove throw rugs and clutter from pathways, ensure handrails are installed and accessible, use contrasting colors on stairs and doorways, assess footwear for proper fit and non-slip soles",
      "Address nutritional concerns related to taste and smell decline: enhance food flavor with herbs and spices (not excess salt), ensure food is visually appealing and served at proper temperature, monitor weight and nutritional intake regularly",
      "Facilitate access to assistive devices: ensure eyeglasses are clean, current prescription, and properly fitted; verify hearing aids are functioning with fresh batteries; provide magnifying glasses for reading; use large-print materials",
      "Perform regular skin assessments with emphasis on pressure points, feet, and areas of decreased sensation; educate patients to inspect their own skin daily using a mirror for areas they cannot see directly",
      "Refer for formal sensory evaluation (ophthalmology, audiology) when screening indicates changes beyond expected age-related decline or when sensory loss significantly impacts daily function and safety"
    ],
    nursingActions: [
      "Assess visual acuity and hearing at admission and regularly thereafter using standardized screening tools; document findings and compare with previous assessments to identify progressive changes",
      "Perform environmental safety assessments: evaluate lighting adequacy, identify fall hazards, check that call bell and essential items are within reach and on the patient's preferred side",
      "Ensure assistive devices are accessible and functioning: clean eyeglasses daily, check hearing aid batteries, verify that prosthetic eyes are properly cared for, and assess fit of corrective devices",
      "Modify nursing care delivery for sensory-impaired patients: announce yourself when entering the room, identify yourself by name and role, describe procedures before performing them, and confirm patient understanding through teach-back",
      "Monitor for safety hazards associated with sensory decline: check water temperature before bathing (patient may not sense extreme temperatures), assess food temperature, inspect skin for injuries the patient may not have noticed",
      "Administer prescribed sensory support medications (artificial tears, cerumenolytic drops) and monitor for therapeutic response and adverse effects",
      "Educate patients and families about normal age-related sensory changes versus signs of pathological conditions requiring medical evaluation (sudden vision loss, sudden hearing loss, asymmetric findings)"
    ],
    assessmentFindings: [
      "Presbyopia: difficulty reading fine print or performing near work, holding reading material at arm's length, squinting, eye strain, headaches during close-up tasks; onset typically in the early 40s",
      "Presbycusis: gradual bilateral high-frequency hearing loss; difficulty understanding speech in noisy environments; frequently asking others to repeat themselves; increasing television volume; social withdrawal",
      "Decreased taste and smell: complaints of food tasting bland, increased use of salt and sugar, decreased appetite, unintentional weight loss, inability to detect spoiled food or gas leaks",
      "Decreased tactile sensation: inability to detect monofilament on plantar surfaces, delayed perception of temperature changes, unnoticed skin injuries or pressure areas, decreased proprioception contributing to balance instability",
      "Visual changes beyond presbyopia: decreased contrast sensitivity (difficulty seeing in low light or distinguishing similar colors), increased sensitivity to glare, decreased peripheral vision, slowed dark adaptation",
      "Compensatory behaviors: tilting head toward the speaker's voice, lip reading during conversations, avoiding social situations, reluctance to drive at night, difficulty navigating unfamiliar environments",
      "Safety-related findings: unexplained bruises or burns (unperceived injuries), pressure injuries in areas of decreased sensation, falls or near-falls, medication errors from inability to read labels"
    ],
    signs: {
      left: [
        "Gradual bilateral high-frequency hearing loss (presbycusis)",
        "Difficulty reading fine print (presbyopia)",
        "Decreased appetite related to taste and smell changes",
        "Mild balance instability from proprioceptive decline",
        "Increased need for lighting and reduced glare tolerance",
        "Compensatory head tilting or lip reading during conversation"
      ],
      right: [
        "Sudden unilateral vision loss (retinal detachment, central retinal artery occlusion -- emergency)",
        "Sudden unilateral hearing loss (acoustic neuroma, stroke, viral labyrinthitis -- requires urgent evaluation)",
        "Falls with injury from uncompensated sensory loss and environmental hazards",
        "Pressure injuries in areas of decreased sensation (sacrum, heels, occiput)",
        "Social isolation, depression, and cognitive decline associated with untreated sensory impairment",
        "Inability to detect safety hazards (smoke, gas leaks, extreme temperatures)"
      ]
    },
    medications: [
      {
        name: "Artificial Tears (Carboxymethylcellulose/Hypromellose)",
        type: "Ophthalmic lubricant (tear substitute)",
        action: "Supplements the tear film by providing viscous lubrication to the ocular surface, reducing friction between the eyelid and cornea, and maintaining corneal hydration; mimics the mucin, aqueous, and lipid layers of natural tears to protect the corneal epithelium from desiccation",
        sideEffects: "Temporary blurred vision immediately after instillation, mild burning or stinging upon application, allergic reaction to preservatives (particularly benzalkonium chloride in multi-dose bottles)",
        contra: "Known hypersensitivity to any component; contact lens wearers should use preservative-free formulations (preservatives can be absorbed by soft contact lenses and cause corneal toxicity)",
        pearl: "For age-related dry eye: instill 1-2 drops in each affected eye 3-4 times daily or as needed; use preservative-free single-dose vials for patients requiring more than 4 applications daily; do not touch the dropper tip to the eye or any surface to prevent contamination"
      },
      {
        name: "Carbamide Peroxide Otic Drops (Debrox)",
        type: "Cerumenolytic agent (earwax softener)",
        action: "Releases oxygen upon contact with cerumen (earwax), creating mechanical foaming action that softens, loosens, and helps displace impacted cerumen from the external auditory canal; the effervescent action also has mild antiseptic properties",
        sideEffects: "Temporary dizziness or fullness sensation in the ear, mild tingling or crackling sound during foaming action, rarely skin irritation in the external ear canal",
        contra: "Perforated tympanic membrane or ear tubes (risk of middle ear damage from solution entering the middle ear); ear drainage, pain, or active infection (otitis externa); recent ear surgery",
        pearl: "Administer 5-10 drops in the affected ear, keep the head tilted for several minutes to allow penetration, then gently irrigate with warm water using a bulb syringe if ordered; cerumen impaction is a common and REVERSIBLE cause of conductive hearing loss in older adults -- always check for cerumen before assuming sensorineural hearing loss"
      },
      {
        name: "Amplification Device Considerations (Hearing Aid Management)",
        type: "Assistive device management (non-pharmacological intervention)",
        action: "Hearing aids amplify environmental sounds and deliver them to the ear canal at increased volume; modern digital devices can be programmed to selectively amplify frequencies where the patient has the greatest hearing loss (typically high frequencies in presbycusis) while reducing background noise amplification",
        sideEffects: "Feedback whistling from poor fit or excessive cerumen, ear canal irritation or pressure sores from ill-fitting molds, acoustic shock from sudden loud sounds if volume is set too high, social stigma leading to non-use",
        contra: "Active ear infection (otitis externa or media); draining ear; undiagnosed sudden hearing loss (requires medical evaluation before amplification); patient cognitively unable to manage device independently without caregiver support",
        pearl: "Check hearing aids DAILY: ensure battery door closes properly, battery is charged or fresh (typical battery life 5-7 days), tubing is free of moisture and cracks, ear mold is clean; store in a dry container at night; remove before showering, swimming, or sleeping; label with patient name in long-term care settings"
      }
    ],
    pearls: [
      "PRESBYOPIA (age-related farsightedness) develops because the lens loses elasticity -- patients hold reading material at arm's length; begins in the early 40s; corrected with reading glasses or bifocals",
      "PRESBYCUSIS (age-related hearing loss) affects HIGH FREQUENCIES first -- patients have difficulty hearing consonant sounds (s, t, f, th), making speech discrimination poor even when volume is adequate; do NOT shout (shouting raises pitch), instead FACE the patient and speak CLEARLY at moderate volume",
      "Older adults need THREE TIMES more light than younger adults due to decreased pupil size (senile miosis) and lens yellowing -- always ensure adequate, glare-free lighting to reduce fall risk",
      "CERUMEN IMPACTION is a common REVERSIBLE cause of hearing loss in older adults -- always inspect the ear canal and check for cerumen before assuming permanent sensorineural hearing loss; simple removal can significantly improve hearing",
      "Decreased taste and smell create SAFETY and NUTRITIONAL risks -- patients cannot detect spoiled food, natural gas leaks, or smoke; they may add excessive salt increasing hypertension risk; enhance flavor with herbs and spices instead of salt",
      "MONOFILAMENT TESTING (10-gram Semmes-Weinstein) on the plantar surfaces identifies loss of protective sensation -- inability to feel the monofilament indicates high risk for undetected injuries, pressure ulcers, and diabetic foot complications",
      "SUDDEN sensory loss is NEVER normal aging and requires URGENT evaluation -- sudden vision loss may indicate retinal detachment or central retinal artery occlusion; sudden hearing loss may indicate acoustic neuroma, stroke, or viral labyrinthitis; report immediately"
    ],
    quiz: [
      {
        question: "An elderly patient in a long-term care facility frequently asks staff to repeat themselves and turns up the television volume. The practical nurse suspects presbycusis. Which communication strategy is MOST appropriate?",
        options: [
          "Speak loudly and quickly to ensure the patient can hear",
          "Face the patient directly, speak clearly at moderate volume, and reduce background noise",
          "Write all communications because verbal communication is no longer effective",
          "Stand behind the patient and speak directly into their ear"
        ],
        correct: 1,
        rationale: "For patients with presbycusis, the practical nurse should face the patient directly (enabling lip reading), speak clearly at a moderate pace and volume, and minimize background noise. Shouting raises pitch and distorts speech. Standing behind the patient eliminates visual cues. Written communication should supplement, not replace, verbal interaction."
      },
      {
        question: "A practical nurse is performing a foot assessment on an 80-year-old patient with diabetes. The patient cannot feel the 10-gram monofilament on the plantar surface of either foot. What does this finding indicate?",
        options: [
          "Normal age-related sensory change requiring no intervention",
          "Loss of protective sensation with high risk for undetected injuries and pressure ulcers",
          "Need for immediate emergency evaluation",
          "Adequate sensory function for the patient's age"
        ],
        correct: 1,
        rationale: "Inability to perceive the 10-gram monofilament on the plantar surface indicates loss of protective sensation. This places the patient at high risk for undetected foot injuries, pressure ulcers, and diabetic foot complications. The practical nurse should report this finding, implement protective foot care measures, and educate the patient about daily foot inspection."
      },
      {
        question: "An older adult patient reports that food tastes bland and has been adding extra salt to all meals. Which nursing intervention is MOST appropriate?",
        options: [
          "Allow unlimited salt use because taste changes are normal with aging",
          "Restrict all seasonings to prevent overconsumption",
          "Suggest enhancing food flavor with herbs and spices instead of excess salt, and monitor nutritional intake",
          "Recommend the patient eat only cold foods because temperature affects taste"
        ],
        correct: 2,
        rationale: "Age-related decline in taste and smell is normal, but excessive salt use can worsen hypertension and fluid retention. The practical nurse should suggest flavor enhancement with herbs, spices, lemon juice, and vinegar as alternatives to salt. Monitoring nutritional intake is important because diminished taste and smell commonly lead to decreased appetite and unintentional weight loss."
      }
    ]
  }
};

let injected = 0;
let total = Object.keys(lessons).length;
console.log(`Injecting ${total} lessons (Batch 49: Derm/Legal/Screening)...`);
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`Done: ${injected}/${total} injected.`);
