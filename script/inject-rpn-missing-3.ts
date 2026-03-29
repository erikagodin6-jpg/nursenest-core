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
  "vaccination-immunity": {
    title: "Vaccination and Immunization Principles",
    cellular: {
      title: "Immunological Basis of Vaccination and Herd Immunity",
      content: "Vaccination is the deliberate administration of antigenic material (a vaccine) to stimulate the adaptive immune system to develop protective immunity against a specific pathogen without causing the disease itself. Vaccination exploits the fundamental property of immunological memory: the ability of the adaptive immune system to mount a faster, stronger, and more effective secondary immune response upon re-exposure to a previously encountered antigen. During natural infection, the immune system encounters pathogenic antigens and mounts a primary immune response over 7 to 14 days, generating antigen-specific T and B lymphocytes, producing antibodies (initially IgM, then IgG through isotype switching), and establishing a population of long-lived memory cells. While this response eventually clears the infection and provides lasting immunity, the patient must endure the disease and its potential complications during the primary response. Vaccination provides the antigenic stimulus needed to generate memory cells and protective antibodies WITHOUT causing disease, essentially giving the immune system a 'preview' of the pathogen. When the vaccinated individual later encounters the actual pathogen, the pre-existing memory B cells and memory T cells are rapidly activated, producing a secondary immune response that is 10 to 100 times stronger than the primary response, dominated by high-affinity IgG antibodies (produced within 1-3 days instead of 7-14 days), and sufficient to neutralize the pathogen before it can cause significant illness. Vaccines are classified by the type of antigenic material they contain. Live attenuated vaccines contain weakened (attenuated) but living forms of the pathogen that can replicate in the host but are unable to cause significant disease in immunocompetent individuals. Because the attenuated organism replicates, it provides prolonged antigenic stimulation that closely mimics natural infection, generating robust cellular and humoral immunity, often with lifelong protection from a single dose or short series. Examples include measles-mumps-rubella (MMR), varicella (chickenpox), rotavirus, intranasal influenza (FluMist), Bacillus Calmette-Guerin (BCG), and oral polio vaccine (OPV, used in some countries). The critical nursing consideration is that live vaccines are CONTRAINDICATED in immunocompromised patients (those receiving chemotherapy, high-dose corticosteroids, immunosuppressive medications for transplant, advanced HIV with CD4 count below 200, or primary immunodeficiency disorders) because the attenuated organism can cause actual disease in individuals who cannot mount an adequate immune response to control its replication. Live vaccines must also be administered simultaneously or separated by at least 28 days to avoid interference between vaccine viruses. Pregnant patients should generally NOT receive live vaccines due to theoretical risk to the fetus. Inactivated (killed) vaccines contain whole pathogens that have been killed by heat, chemicals (formaldehyde, beta-propiolactone), or radiation. Because the organisms cannot replicate, inactivated vaccines are safe for immunocompromised patients but generally produce weaker immune responses requiring multiple doses (primary series) and periodic booster doses to maintain protective antibody levels. Examples include the inactivated influenza vaccine (injection), inactivated polio vaccine (IPV), hepatitis A vaccine, and rabies vaccine. Subunit, recombinant, and conjugate vaccines contain specific purified components of the pathogen rather than the whole organism. These include protein-based subunit vaccines (hepatitis B vaccine containing recombinant HBsAg surface antigen, HPV vaccine containing virus-like particles), polysaccharide vaccines (Pneumovax 23 containing pneumococcal capsular polysaccharides -- effective in adults but poorly immunogenic in children under 2 because their immune systems cannot mount T-cell-independent responses to polysaccharide antigens), and conjugate vaccines (Prevnar 13 and Prevnar 20, where pneumococcal polysaccharides are chemically linked to a protein carrier, converting the T-cell-independent polysaccharide antigen into a T-cell-dependent antigen that is immunogenic in infants and young children). Toxoid vaccines contain inactivated bacterial toxins (toxoids) that have lost their toxicity but retain their antigenicity. The diphtheria and tetanus components of DTaP and Tdap vaccines are toxoids. They stimulate production of antitoxin antibodies that neutralize the toxin upon exposure to the actual bacteria. mRNA vaccines (such as COVID-19 mRNA vaccines) represent a newer platform: they deliver synthetic messenger RNA encoding a pathogen protein (e.g., SARS-CoV-2 spike protein) into host cells, which then produce the protein and display it to the immune system, generating both antibody and T cell responses. The mRNA does not enter the nucleus, cannot integrate into human DNA, and is rapidly degraded after translation. Herd immunity (community immunity) is the indirect protection of susceptible individuals in a population when a sufficient proportion of the population is immune through vaccination or prior infection. The herd immunity threshold varies by pathogen and depends on the basic reproduction number (R0): measles (R0 approximately 12-18) requires approximately 93-95% population immunity, while polio (R0 approximately 5-7) requires approximately 80-86%. When the immune proportion exceeds the threshold, the pathogen cannot sustain transmission chains, effectively protecting individuals who cannot be vaccinated (immunocompromised patients, infants too young for vaccination, pregnant women). The practical nurse plays essential roles in the immunization process: assessing for contraindications and precautions before administration, properly storing and handling vaccines (maintaining cold chain integrity -- most vaccines require refrigeration at 2-8 degrees Celsius; some require freezer storage at -15 to -25 degrees Celsius; temperature excursions can destroy vaccine potency), administering vaccines using correct route and technique (intramuscular injection into the vastus lateralis for infants or deltoid for children and adults; subcutaneous injection at a 45-degree angle; specific sites for intradermal injections like BCG), monitoring for adverse reactions for the recommended observation period (15-30 minutes post-vaccination), documenting vaccination in the patient's record and immunization registry, and educating patients and families about expected side effects versus signs requiring medical attention."
    },
    riskFactors: [
      "Immunocompromised state (chemotherapy, high-dose corticosteroids, organ transplant immunosuppression, advanced HIV) -- contraindication for live vaccines due to risk of vaccine-strain disease",
      "Pregnancy (contraindication for most live vaccines due to theoretical fetal risk; inactivated vaccines including Tdap and influenza are recommended during pregnancy)",
      "History of severe allergic reaction (anaphylaxis) to a previous dose of the vaccine or to a vaccine component (e.g., gelatin, neomycin, egg protein in some formulations)",
      "Moderate to severe acute illness with or without fever (precaution -- defer vaccination until recovered to avoid attributing illness symptoms to the vaccine)",
      "Extremes of age affecting immune response (neonates have immature immune systems limiting vaccine response; elderly have immunosenescence with decreased antibody production after vaccination)",
      "Cold chain disruption (improper vaccine storage or handling destroying vaccine potency without visible change in appearance)",
      "Declining vaccination rates in communities (reduces herd immunity below threshold, allowing outbreaks of vaccine-preventable diseases among susceptible individuals)"
    ],
    diagnostics: [
      "Review immunization history using immunization registries, previous medical records, and patient/family recall to identify needed vaccinations",
      "Assess for contraindications and precautions using CDC screening questionnaire before each vaccination (allergy history, immune status, pregnancy, current illness)",
      "Post-vaccination antibody titers (serological testing) to confirm immune response in high-risk individuals (healthcare workers for hepatitis B immunity, immunocompromised patients)",
      "Temperature monitoring of vaccine storage units twice daily with minimum/maximum thermometer (document and report excursions outside 2-8C for refrigerator or -15 to -25C for freezer)",
      "Tuberculin skin test (TST/PPD) or IGRA before BCG vaccination or to assess baseline TB status (note: BCG vaccination can cause false-positive TST results)",
      "Monitor for vaccine adverse events using the Vaccine Adverse Event Reporting System (VAERS) -- all clinically significant adverse events must be reported",
      "Assess immune status before administering live vaccines (CD4 count in HIV patients, immunoglobulin levels in suspected immunodeficiency)"
    ],
    management: [
      "Administer vaccines according to the recommended immunization schedule (Canadian Immunization Guide or CDC schedule based on jurisdiction)",
      "Use catch-up immunization schedules for patients who are behind on vaccinations, administering multiple vaccines simultaneously at different injection sites when appropriate",
      "Store and handle vaccines according to manufacturer specifications maintaining strict cold chain integrity throughout the process",
      "Administer epinephrine for vaccine-associated anaphylaxis (extremely rare but requires immediate treatment; observation period of 15-30 minutes post-vaccination)",
      "Report all clinically significant adverse events following immunization through VAERS or the Canadian Adverse Events Following Immunization Surveillance System (CAEFISS)",
      "Coordinate with public health for outbreak response vaccination campaigns and contact tracing"
    ],
    nursingActions: [
      "Screen for contraindications and precautions before EVERY vaccination using standardized screening questionnaire (never assume prior screening is current)",
      "Verify vaccine identity, expiration date, lot number, and appearance before administration (some vaccines have specific visual characteristics when properly reconstituted)",
      "Administer vaccines using correct route, site, needle gauge, and needle length (IM: 22-25 gauge, deltoid or vastus lateralis; SC: 25 gauge at 45-degree angle; specific depths based on patient age and size)",
      "Monitor patients for at least 15 minutes after vaccination (30 minutes if history of fainting or using allergen immunotherapy) with epinephrine available",
      "Document vaccine name, manufacturer, lot number, expiration date, dose, route, injection site, date, and administrator name in patient record AND immunization registry",
      "Educate patients about expected local reactions (injection site pain, redness, swelling for 1-3 days) and systemic reactions (low-grade fever, malaise, myalgia) versus signs requiring medical attention",
      "Ensure proper needle disposal in sharps containers immediately after administration and follow standard precautions throughout the vaccination process",
      "Store vaccines at appropriate temperatures and perform twice-daily temperature monitoring of storage units with documentation"
    ],
    assessmentFindings: [
      "Injection site reactions (pain, erythema, swelling, induration -- most common adverse effect, generally self-limiting within 1-3 days)",
      "Mild systemic reactions (low-grade fever, malaise, myalgia, headache -- indicate normal immune activation and typically resolve within 24-48 hours)",
      "Syncope (fainting) -- most common in adolescents and young adults, usually vasovagal; have patients sit or lie down for 15 minutes post-vaccination",
      "Severe allergic reaction/anaphylaxis (rare but life-threatening: urticaria, angioedema, bronchospasm, hypotension -- onset usually within 15-30 minutes of administration)",
      "Febrile seizure in young children (associated with fever following vaccination, generally benign and self-limiting, but requires reporting)",
      "Inadequate seroconversion (failure to develop protective antibody levels after complete vaccination series -- may occur in immunocompromised patients, elderly, or with cold chain breaks)",
      "Documentation of immunization status (up to date, behind schedule, or contraindicated vaccines -- guides future vaccination planning)"
    ],
    signs: {
      left: [
        "Mild injection site soreness and redness",
        "Low-grade fever (37.5-38.5C) within 24-48 hours",
        "Mild fatigue and muscle aches",
        "Small firm nodule at injection site (may persist weeks)",
        "Mild fussiness in infants"
      ],
      right: [
        "Anaphylaxis (urticaria, angioedema, bronchospasm, hypotension)",
        "High fever (>40.5C/105F) within 48 hours",
        "Vaccine-associated paralytic poliomyelitis (OPV only, extremely rare)",
        "Intussusception following rotavirus vaccine (very rare, <1 in 100,000)",
        "Encephalopathy within 7 days (extremely rare, primarily historical concern)"
      ]
    },
    medications: [
      {
        name: "Epinephrine (for vaccine anaphylaxis)",
        type: "Sympathomimetic (adrenergic agonist) for emergency treatment",
        action: "Alpha-1 mediated vasoconstriction reverses hypotension and reduces mucosal edema; beta-1 effects increase heart rate and cardiac output; beta-2 effects cause bronchodilation and stabilize mast cell membranes to prevent further mediator release; rapidly counteracts all pathophysiological mechanisms of anaphylaxis",
        sideEffects: "Tachycardia, tremor, anxiety, palpitations, headache, pallor; effects are transient and far outweighed by life-saving benefit",
        contra: "NO absolute contraindications in anaphylaxis; must be immediately available at all vaccination sites",
        pearl: "Must be available at EVERY vaccination site with trained staff; dose: 0.01 mg/kg IM (max 0.5 mg adults, 0.3 mg children) in anterolateral thigh; repeat every 5-15 minutes as needed; this is the ONLY first-line treatment for anaphylaxis -- antihistamines and corticosteroids are adjunctive only and must never delay epinephrine administration"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Antipyretic/Analgesic for post-vaccination symptom management",
        action: "Inhibits central COX enzymes, reducing prostaglandin E2 synthesis in the hypothalamic thermoregulatory center to lower fever; provides analgesia for injection site pain and systemic myalgia following vaccination",
        sideEffects: "Hepatotoxicity (dose-dependent, maximum 4g/day adults), rare allergic reactions; generally very well-tolerated at recommended doses",
        contra: "Severe hepatic impairment; known hypersensitivity; caution in chronic alcohol use",
        pearl: "Do NOT routinely administer prophylactic antipyretics BEFORE vaccination -- studies show that prophylactic acetaminophen may blunt the antibody response to some vaccines; use only for symptom management AFTER vaccination if fever or discomfort develops; for infants and children, use weight-based dosing (10-15 mg/kg every 4-6 hours as needed)"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "NSAID (non-selective cyclooxygenase inhibitor) for post-vaccination symptom management",
        action: "Inhibits both COX-1 and COX-2 enzymes, reducing prostaglandin synthesis peripherally and centrally; provides anti-inflammatory, analgesic, and antipyretic effects; effective for injection site inflammation, pain, and systemic fever following vaccination",
        sideEffects: "GI upset (nausea, dyspepsia, gastric ulceration), renal impairment (decreased prostaglandin-mediated renal blood flow), platelet inhibition (reversible, unlike aspirin), cardiovascular risk with chronic use",
        contra: "Children under 6 months of age; known NSAID allergy; active GI bleeding or peptic ulcer disease; severe renal impairment; third trimester pregnancy; aspirin-sensitive asthma",
        pearl: "Alternative to acetaminophen for post-vaccination fever and pain management in patients older than 6 months; like acetaminophen, should NOT be given prophylactically before vaccination; take with food to reduce GI side effects; pediatric dosing: 5-10 mg/kg every 6-8 hours as needed; ensure adequate hydration during use"
      }
    ],
    pearls: [
      "Live vaccines (MMR, varicella, rotavirus, intranasal influenza, BCG) are CONTRAINDICATED in immunocompromised patients because the attenuated organism can cause actual disease -- always assess immune status before administering live vaccines",
      "Live vaccines must be given simultaneously at different injection sites or separated by at least 28 days -- administering non-simultaneous live vaccines less than 28 days apart can cause interference and reduced efficacy",
      "Do NOT routinely administer prophylactic antipyretics before vaccination -- evidence shows that prophylactic acetaminophen may reduce the antibody response to some vaccines; use antipyretics only for symptom management after vaccination",
      "Cold chain integrity is essential for vaccine potency -- vaccines exposed to temperatures outside their specified range (freezing for refrigerator-stable vaccines, warming for frozen vaccines) may be permanently inactivated without any visible change in appearance",
      "Herd immunity protects vulnerable individuals who cannot be vaccinated (immunocompromised patients, infants too young, pregnant women) -- when vaccination rates fall below the herd immunity threshold, these individuals lose their indirect protection",
      "The most common reason for vaccine-preventable disease outbreaks is not vaccine failure but failure to vaccinate -- missed opportunities, parental refusal, and access barriers are the primary causes of under-immunization",
      "Epinephrine must be immediately available at EVERY vaccination site and staff must be trained in anaphylaxis recognition and treatment -- although vaccine anaphylaxis is extremely rare (approximately 1 per million doses), it requires immediate intervention to prevent death"
    ],
    quiz: [
      {
        question: "A patient is receiving chemotherapy for breast cancer and asks about getting the annual influenza vaccine. Which influenza vaccine formulation is appropriate for this patient?",
        options: [
          "Intranasal live attenuated influenza vaccine (FluMist) for the most robust immune response",
          "Inactivated influenza injection (standard flu shot) which is safe for immunocompromised patients",
          "No influenza vaccine should be given during active chemotherapy",
          "Either formulation is acceptable since influenza vaccines are safe for all patients"
        ],
        correct: 1,
        rationale: "The inactivated influenza injection is safe and recommended for immunocompromised patients including those receiving chemotherapy. The intranasal live attenuated influenza vaccine (FluMist) is CONTRAINDICATED because it contains live attenuated virus that could potentially cause disease in immunocompromised individuals who cannot mount an adequate immune response to control viral replication. Influenza vaccination IS recommended during chemotherapy, but only with the inactivated formulation."
      },
      {
        question: "A practical nurse is about to administer a routine childhood vaccination. The parent asks if the child should receive acetaminophen before the injection to prevent fever. What is the most appropriate response?",
        options: [
          "Yes, routine prophylactic acetaminophen is recommended before all childhood vaccinations",
          "No, prophylactic antipyretics before vaccination may reduce the antibody response; give only if fever or pain develops after vaccination",
          "Yes, but ibuprofen is preferred over acetaminophen for pre-vaccination use",
          "Antipyretics should never be given to children after vaccination"
        ],
        correct: 1,
        rationale: "Current evidence shows that prophylactic acetaminophen administered before vaccination may blunt the antibody response to some vaccines. Therefore, routine prophylactic antipyretic use is NOT recommended. Antipyretics should be used only for symptom management if fever or pain develops AFTER vaccination. The fever following vaccination is actually part of the normal immune response and indicates immune activation."
      },
      {
        question: "Two live vaccines need to be administered to a child, but only one is given today. When is the earliest the second live vaccine can be administered?",
        options: [
          "The next day, as there is no minimum interval between live vaccines",
          "At least 7 days later",
          "At least 28 days later to avoid interference between vaccine viruses",
          "At least 6 months later for maximum immune response"
        ],
        correct: 2,
        rationale: "When two live vaccines are not administered simultaneously (on the same day at different injection sites), they must be separated by at least 28 days. This is because the innate immune response activated by the first live vaccine (particularly interferon production) can interfere with the replication and immunogenicity of the second live vaccine if given too close together. This rule applies only to live vaccines -- inactivated vaccines can be given at any interval."
      }
    ]
  },

  "autoimmune-basics": {
    title: "Autoimmune Disease Fundamentals",
    cellular: {
      title: "Pathophysiology of Autoimmune Disorders and Self-Tolerance Breakdown",
      content: "Autoimmune diseases occur when the immune system loses its ability to distinguish self from non-self and mounts an immune response against the body's own tissues and organs. Under normal circumstances, the immune system maintains self-tolerance through multiple overlapping mechanisms that prevent immune cells from attacking host tissues. Central tolerance occurs during lymphocyte development: in the thymus, T cells that react strongly to self-antigens presented on MHC molecules are eliminated through negative selection (clonal deletion), and in the bone marrow, B cells that bind self-antigens with high affinity are either deleted, rendered anergic (functionally unresponsive), or undergo receptor editing (replacing their self-reactive receptor with a new, non-self-reactive receptor). Peripheral tolerance mechanisms serve as backup systems for self-reactive lymphocytes that escape central tolerance: regulatory T cells (Tregs, expressing CD4, CD25, and the transcription factor FoxP3) actively suppress autoreactive immune cells through secretion of immunosuppressive cytokines (IL-10, TGF-beta) and direct cell contact; anergy renders T cells that encounter antigen without adequate co-stimulation functionally unresponsive; activation-induced cell death (AICD) eliminates chronically stimulated T cells through Fas-FasL mediated apoptosis; and immune privilege protects certain anatomical sites (eyes, brain, testes) from immune surveillance through physical barriers and local immunosuppressive factors. Autoimmune disease develops when one or more of these tolerance mechanisms fails, allowing self-reactive lymphocytes to become activated, proliferate, and damage host tissues. The pathogenesis of autoimmune diseases is multifactorial, involving genetic susceptibility, environmental triggers, and stochastic (random) events. Genetic factors play a significant role: most autoimmune diseases have strong associations with specific HLA (human leukocyte antigen) alleles -- HLA-B27 is strongly associated with ankylosing spondylitis, HLA-DR4 with rheumatoid arthritis, and HLA-DR3/DR4 with type 1 diabetes. Concordance rates in identical twins (25-50% for most autoimmune diseases) confirm genetic contribution but also demonstrate that genetics alone is insufficient -- environmental factors are necessary to trigger disease in genetically susceptible individuals. Environmental triggers that can initiate autoimmune responses include infections (through molecular mimicry, where microbial antigens share structural similarity with self-antigens, causing cross-reactive immune responses -- for example, Group A Streptococcus M protein shares epitopes with cardiac myosin, leading to rheumatic heart disease; Campylobacter jejuni lipopolysaccharides mimic gangliosides, triggering Guillain-Barre syndrome), medications (drug-induced lupus from hydralazine, procainamide, isoniazid), physical factors (UV radiation can damage cells and expose normally hidden intracellular antigens, triggering lupus flares), hormonal influences (many autoimmune diseases are significantly more common in women -- systemic lupus erythematosus has a 9:1 female-to-male ratio, likely related to estrogen's immunostimulatory effects), and disruption of the microbiome (alteration of gut commensal bacteria may affect immune regulation and promote autoimmunity). Autoimmune diseases are classified by the mechanism of tissue damage using the Gell and Coombs hypersensitivity classification. Type II (antibody-mediated cytotoxic) hypersensitivity involves autoantibodies directed against specific cell surface or extracellular matrix antigens, causing direct tissue damage through complement activation, ADCC, or receptor dysfunction. Examples include Graves disease (stimulatory antibodies against TSH receptors cause hyperthyroidism), myasthenia gravis (blocking antibodies against acetylcholine receptors cause muscle weakness), Goodpasture syndrome (anti-glomerular basement membrane antibodies cause glomerulonephritis and pulmonary hemorrhage), and autoimmune hemolytic anemia (anti-RBC antibodies cause erythrocyte destruction). Type III (immune complex-mediated) hypersensitivity involves formation of antigen-antibody complexes that deposit in tissues, activating complement and recruiting neutrophils that cause inflammatory damage. Systemic lupus erythematosus is the prototype: anti-nuclear antibodies (ANA) form immune complexes with nuclear antigens that deposit in kidneys (lupus nephritis), skin, joints, and blood vessels. Type IV (cell-mediated/delayed-type) hypersensitivity involves direct tissue damage by autoreactive T cells rather than antibodies. Type 1 diabetes is a prototypical example: autoreactive CD8+ cytotoxic T cells infiltrate the pancreatic islets and selectively destroy insulin-producing beta cells, while CD4+ helper T cells recruit and activate macrophages that contribute to islet inflammation (insulitis). Other examples include Hashimoto thyroiditis (T cell-mediated destruction of thyroid follicular cells), multiple sclerosis (T cell-mediated demyelination in the CNS), and rheumatoid arthritis (T cell and cytokine-mediated synovial inflammation). Autoimmune diseases can be organ-specific (targeting a single organ -- Hashimoto thyroiditis targets only the thyroid, type 1 diabetes targets only pancreatic beta cells, Graves disease affects only the thyroid) or systemic (affecting multiple organ systems -- systemic lupus erythematosus can affect skin, joints, kidneys, brain, blood cells, and serous membranes; rheumatoid arthritis primarily affects joints but can also involve lungs, heart, and blood vessels). Laboratory hallmarks of autoimmune disease include autoantibodies (ANA for lupus, anti-dsDNA for lupus nephritis, anti-CCP for rheumatoid arthritis, anti-TPO for Hashimoto thyroiditis), elevated inflammatory markers (ESR, CRP), complement consumption (low C3, C4 in active lupus indicating immune complex formation), and organ-specific markers of damage. Treatment strategies for autoimmune diseases generally involve suppressing the aberrant immune response while managing disease complications: corticosteroids (broad immunosuppression), disease-modifying agents (methotrexate, azathioprine, mycophenolate), targeted biologic therapies (TNF inhibitors like infliximab, B cell depletion with rituximab, T cell co-stimulation blockers like abatacept), and organ-specific replacement therapy (levothyroxine for Hashimoto hypothyroidism, insulin for type 1 diabetes)."
    },
    riskFactors: [
      "Female sex (autoimmune diseases are 2-10 times more common in women than men, likely related to estrogen's immunostimulatory effects and X-chromosome gene dosage effects)",
      "Genetic predisposition (family history of autoimmune disease, specific HLA associations -- HLA-B27, HLA-DR3, HLA-DR4)",
      "Prior infection with molecular mimicry potential (Group A Streptococcus preceding rheumatic fever, Campylobacter jejuni preceding Guillain-Barre syndrome, viral infections preceding type 1 diabetes)",
      "Smoking (increases risk and severity of rheumatoid arthritis, lupus, and multiple sclerosis through epigenetic modifications and inflammatory pathway activation)",
      "Vitamin D deficiency (vitamin D has immunomodulatory effects promoting Treg function; deficiency is associated with increased risk of multiple sclerosis, type 1 diabetes, and rheumatoid arthritis)",
      "Drug exposure (hydralazine, procainamide, isoniazid, and others can cause drug-induced lupus; checkpoint inhibitor immunotherapy can trigger autoimmune complications)",
      "Environmental exposures (UV radiation triggers lupus flares, silica dust exposure increases risk of rheumatoid arthritis and scleroderma)"
    ],
    diagnostics: [
      "Antinuclear antibody (ANA) testing -- positive in many autoimmune diseases, particularly SLE (sensitivity >95%); however, ANA is nonspecific and can be positive in healthy individuals",
      "Disease-specific autoantibodies (anti-dsDNA and anti-Smith for SLE, anti-CCP for rheumatoid arthritis, anti-TPO and anti-thyroglobulin for Hashimoto thyroiditis, anti-acetylcholine receptor for myasthenia gravis)",
      "Complement levels (C3, C4, CH50) -- decreased in active immune complex diseases like SLE due to complement consumption during immune complex formation",
      "Inflammatory markers (ESR and CRP elevated during active autoimmune inflammation; useful for monitoring disease activity and treatment response)",
      "Complete blood count (cytopenias common in autoimmune disease -- anemia, leukopenia, lymphopenia, thrombocytopenia seen in SLE; anemia of chronic disease)",
      "Urinalysis and renal function tests (proteinuria, hematuria, and elevated creatinine indicate renal involvement in lupus or vasculitis)",
      "Tissue biopsy when indicated (renal biopsy for lupus nephritis classification, synovial biopsy for inflammatory arthritis, thyroid biopsy for suspected thyroid autoimmune disease)"
    ],
    management: [
      "Immunosuppressive therapy tailored to disease severity and organ involvement (corticosteroids for acute flares, disease-modifying agents for long-term control)",
      "Biologic therapies targeting specific immune pathways (TNF inhibitors for rheumatoid arthritis and IBD, rituximab for B cell-mediated diseases, belimumab for lupus)",
      "Organ-specific replacement therapy as needed (levothyroxine for Hashimoto hypothyroidism, insulin for type 1 diabetes, pyridostigmine for myasthenia gravis)",
      "Lifestyle modifications to reduce flare triggers (sun protection for lupus, smoking cessation for rheumatoid arthritis, stress management for all autoimmune conditions)",
      "Regular monitoring of disease activity and medication side effects (blood counts, liver/renal function, immunoglobulin levels during immunosuppressive therapy)",
      "Vaccination with inactivated vaccines before starting immunosuppressive therapy when possible; avoid live vaccines during immunosuppression"
    ],
    nursingActions: [
      "Assess for signs and symptoms of disease flares (joint pain, rash, fever, fatigue, new organ involvement) and report changes promptly",
      "Monitor laboratory values related to disease activity and medication effects (CBC, renal function, liver function, inflammatory markers) and report trends",
      "Administer immunosuppressive medications according to protocol and monitor for side effects (infection signs, GI upset, bone marrow suppression, hepatotoxicity)",
      "Educate patients about disease process, medication regimen, and importance of adherence to immunosuppressive therapy even during remission",
      "Implement infection prevention measures for immunosuppressed patients (hand hygiene, avoiding sick contacts, recognizing early signs of infection)",
      "Assess and manage fatigue (pacing activities, energy conservation techniques, adequate rest -- fatigue is the most common and debilitating symptom across autoimmune diseases)",
      "Provide emotional support and referrals for psychosocial services (chronic autoimmune disease is associated with depression, anxiety, and decreased quality of life)",
      "Teach patients to recognize and avoid disease-specific triggers (sun exposure for lupus, smoking for RA, stress for all autoimmune conditions)"
    ],
    assessmentFindings: [
      "Joint symptoms (pain, swelling, stiffness, limited range of motion -- common in rheumatoid arthritis, lupus, psoriatic arthritis)",
      "Skin manifestations (malar butterfly rash in lupus, heliotrope rash in dermatomyositis, psoriatic plaques, sclerodactyly in scleroderma)",
      "Constitutional symptoms (fatigue, malaise, low-grade fever, weight loss -- present in most active autoimmune diseases)",
      "Organ-specific dysfunction (thyroid enlargement in Hashimoto, muscle weakness in myasthenia gravis, proteinuria in lupus nephritis)",
      "Raynaud phenomenon (episodic digital vasospasm with color changes: white to blue to red -- associated with scleroderma, lupus, and mixed connective tissue disease)",
      "Lymphadenopathy and/or splenomegaly (generalized lymph node enlargement in SLE reflects immune system activation)",
      "Abnormal autoantibody profiles on laboratory testing (ANA, disease-specific antibodies, elevated inflammatory markers)"
    ],
    signs: {
      left: [
        "Mild joint stiffness, especially morning stiffness",
        "Intermittent fatigue",
        "Positive ANA without clinical symptoms",
        "Mild Raynaud phenomenon",
        "Low-grade fever"
      ],
      right: [
        "Severe multi-organ involvement (renal failure, pulmonary fibrosis)",
        "Lupus cerebritis (seizures, psychosis)",
        "Myasthenic crisis (respiratory failure from muscle weakness)",
        "Catastrophic antiphospholipid syndrome (multi-organ thrombosis)",
        "Macrophage activation syndrome (life-threatening cytokine storm)"
      ]
    },
    medications: [
      {
        name: "Prednisone (Deltasone)",
        type: "Glucocorticoid (systemic corticosteroid)",
        action: "Binds to intracellular glucocorticoid receptors, modulating gene transcription to suppress multiple inflammatory and immune pathways; inhibits NF-kB (reducing pro-inflammatory cytokine production including IL-1, IL-6, TNF-alpha), suppresses T cell activation and proliferation, inhibits macrophage function, reduces immunoglobulin production, and decreases prostaglandin and leukotriene synthesis; provides rapid broad-spectrum immunosuppression for autoimmune flares",
        sideEffects: "Short-term: hyperglycemia, insomnia, mood changes, fluid retention, increased appetite, GI upset; Long-term: osteoporosis, avascular necrosis, cataracts, glaucoma, adrenal suppression, Cushing habitus (moon facies, buffalo hump, central obesity), thin skin, poor wound healing, immunosuppression with increased infection risk, growth suppression in children",
        contra: "Systemic fungal infections (at immunosuppressive doses); live vaccine administration during high-dose therapy; relative: uncontrolled diabetes, active peptic ulcer, uncontrolled hypertension, osteoporosis",
        pearl: "For autoimmune flares, start high and taper gradually to the lowest effective maintenance dose; NEVER abruptly discontinue after chronic use (>2 weeks) due to HPA axis suppression and risk of adrenal crisis; concurrent calcium/vitamin D supplementation and bisphosphonate therapy for patients on chronic corticosteroids to prevent osteoporosis; monitor blood glucose closely (steroid-induced hyperglycemia is common and may require insulin); PPI co-prescription for GI protection during high-dose or prolonged therapy"
      },
      {
        name: "Methotrexate (Trexall)",
        type: "Disease-modifying antirheumatic drug (DMARD) / antimetabolite",
        action: "Inhibits dihydrofolate reductase (DHFR), blocking conversion of dihydrofolate to tetrahydrofolate, which is essential for purine and pyrimidine synthesis; at the low doses used for autoimmune disease, the primary mechanism is anti-inflammatory rather than cytotoxic: promotes adenosine release (an endogenous anti-inflammatory mediator), suppresses T cell activation, inhibits neutrophil chemotaxis, and reduces production of pro-inflammatory cytokines; gold standard DMARD for rheumatoid arthritis",
        sideEffects: "Hepatotoxicity (monitor liver enzymes regularly, avoid alcohol), bone marrow suppression (pancytopenia -- monitor CBC), pulmonary toxicity (methotrexate pneumonitis -- acute onset dyspnea, cough, fever), GI upset (nausea, stomatitis), teratogenicity (absolute contraindication in pregnancy), increased infection risk, rare lymphoma",
        contra: "Pregnancy and breastfeeding (Category X teratogen -- must confirm negative pregnancy test and ensure reliable contraception); severe hepatic disease or alcoholism; pre-existing bone marrow suppression; severe renal impairment (methotrexate is renally cleared); immunodeficiency syndromes; active infections",
        pearl: "Always co-prescribe folic acid 1 mg daily (or folinic acid/leucovorin) to reduce methotrexate side effects (stomatitis, GI upset, hepatotoxicity) without reducing efficacy; administer weekly (NOT daily -- daily methotrexate dosing is a potentially fatal medication error); monitor CBC, liver function, and renal function every 4-8 weeks; onset of clinical benefit takes 4-8 weeks; must be discontinued at least 3 months before planned conception in both men and women"
      },
      {
        name: "Hydroxychloroquine (Plaquenil)",
        type: "Antimalarial / immunomodulator (DMARD)",
        action: "Accumulates in lysosomes of antigen-presenting cells, raising intracellular pH and inhibiting antigen processing and presentation on MHC class II molecules; reduces Toll-like receptor signaling (TLR7, TLR9), decreasing production of pro-inflammatory cytokines (interferon-alpha, TNF-alpha, IL-6); inhibits platelet aggregation and reduces anti-phospholipid antibody-mediated thrombosis; provides UV photoprotection; reduces total cholesterol and LDL; cornerstone therapy for systemic lupus erythematosus",
        sideEffects: "Retinal toxicity (bull's eye maculopathy with chronic use >5 years -- risk increases with cumulative dose; requires annual ophthalmologic screening starting at 5 years of use or sooner with risk factors), GI upset (nausea, diarrhea), skin hyperpigmentation, neuromyopathy (rare), cardiac toxicity (rare, with prolonged use -- cardiomyopathy, QT prolongation)",
        contra: "Known hypersensitivity; pre-existing macular degeneration or retinal disease; caution with concurrent use of QT-prolonging medications; G6PD deficiency (increased risk of hemolytic anemia)",
        pearl: "ALL patients with systemic lupus should be on hydroxychloroquine unless contraindicated -- it reduces flares, organ damage accrual, and mortality; baseline and annual ophthalmologic examination required for retinal toxicity screening (OCT preferred); maximum dose should not exceed 5 mg/kg actual body weight to minimize retinal toxicity risk; one of the few immunomodulators safe to continue during pregnancy (Category C, but benefits outweigh risks in lupus); takes 2-3 months for full clinical effect"
      }
    ],
    pearls: [
      "Autoimmune diseases disproportionately affect women (female-to-male ratios of 2:1 to 9:1 depending on the disease) -- always consider autoimmune etiology in a woman presenting with unexplained multi-system symptoms, fatigue, and elevated inflammatory markers",
      "A positive ANA test alone does NOT diagnose autoimmune disease -- up to 15-20% of healthy individuals (especially women and elderly) can have a positive ANA; clinical correlation with symptoms and disease-specific antibodies is essential",
      "Methotrexate is dosed WEEKLY for autoimmune disease, NOT daily -- daily methotrexate dosing is a potentially fatal medication error that causes severe pancytopenia and mucositis; always verify dosing frequency when administering or educating patients",
      "All patients on chronic corticosteroids need concurrent osteoporosis prophylaxis (calcium 1000-1200 mg/day, vitamin D 800-1000 IU/day, bisphosphonate if prednisone >7.5 mg/day for >3 months) and should never have corticosteroids abruptly discontinued",
      "Hydroxychloroquine requires annual ophthalmologic screening for retinal toxicity starting at 5 years of use -- it is the only DMARD recommended for ALL lupus patients due to proven mortality benefit, and should be continued even during remission",
      "Patients on immunosuppressive therapy are at increased infection risk -- teach them to recognize early signs of infection (fever, cough, dysuria, skin changes) and seek immediate medical attention; ensure all inactivated vaccinations are current, and AVOID live vaccines during immunosuppression",
      "Fatigue is the most common and often most debilitating symptom across all autoimmune diseases -- validate the patient's experience, teach energy conservation and pacing strategies, screen for contributing factors (anemia, hypothyroidism, depression), and involve the interdisciplinary team"
    ],
    quiz: [
      {
        question: "A patient with rheumatoid arthritis is prescribed methotrexate 15 mg weekly. Which additional medication should the practical nurse expect to be co-prescribed?",
        options: [
          "Vitamin B12 1000 mcg daily to prevent neuropathy",
          "Folic acid 1 mg daily to reduce methotrexate side effects",
          "Iron supplements to prevent methotrexate-induced anemia",
          "Potassium supplements to prevent hypokalemia"
        ],
        correct: 1,
        rationale: "Folic acid (1 mg daily) is always co-prescribed with methotrexate to reduce side effects including stomatitis, GI upset, and hepatotoxicity. Methotrexate inhibits dihydrofolate reductase, depleting folate stores; supplementing with folic acid replenishes these stores and reduces toxicity without diminishing the anti-inflammatory efficacy of methotrexate. This is a standard of care in rheumatology practice."
      },
      {
        question: "A patient with systemic lupus erythematosus (SLE) has been taking hydroxychloroquine for 6 years. Which monitoring is essential for this patient?",
        options: [
          "Monthly liver function tests to detect hepatotoxicity",
          "Annual ophthalmologic examination to screen for retinal toxicity",
          "Quarterly electrocardiograms to monitor for QT prolongation",
          "Weekly blood glucose monitoring for steroid-induced hyperglycemia"
        ],
        correct: 1,
        rationale: "Annual ophthalmologic examination (preferably with OCT) is essential for patients on long-term hydroxychloroquine to screen for retinal toxicity (bull's eye maculopathy). The risk increases with cumulative dose and duration, particularly after 5 years of use. Early detection through regular screening allows discontinuation before irreversible visual loss occurs. Hepatotoxicity and QT prolongation are not primary monitoring concerns with hydroxychloroquine at standard doses."
      },
      {
        question: "Which concept explains how a streptococcal throat infection can lead to rheumatic heart disease?",
        options: [
          "Immune privilege allowing the bacteria to hide in cardiac tissue",
          "Molecular mimicry where streptococcal M protein shares structural similarity with cardiac myosin",
          "Herd immunity failure allowing the infection to spread to the heart",
          "Central tolerance breakdown caused directly by the streptococcal bacteria"
        ],
        correct: 1,
        rationale: "Molecular mimicry is the mechanism by which infection with Group A Streptococcus can lead to rheumatic heart disease. The streptococcal M protein shares structural epitopes (molecular shapes) with cardiac myosin and other heart tissue proteins. The immune response generated against the streptococcal antigen cross-reacts with these similar self-antigens in the heart, causing autoimmune-mediated inflammation and damage to the cardiac valves (rheumatic carditis). This is why prompt treatment of strep throat with antibiotics is important to prevent rheumatic fever."
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
