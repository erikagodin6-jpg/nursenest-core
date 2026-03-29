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
  "cytomegalovirus-rpn": {
    title: "Cytomegalovirus (CMV) Infection for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Cytomegalovirus Infection",
      content: "Cytomegalovirus (CMV) is a double-stranded DNA virus belonging to the Herpesviridae family, specifically the Betaherpesvirinae subfamily. It is one of the most common viral infections worldwide, with seroprevalence rates ranging from 40 to 100 percent depending on geographic region, socioeconomic status, and age. CMV shares a critical biological property with all herpesviruses: after primary infection, the virus establishes lifelong latency within host cells, primarily monocytes, macrophages, and CD34+ hematopoietic progenitor cells in the bone marrow. The virus can reactivate at any time, particularly during periods of immunosuppression. During primary infection, CMV enters host cells through receptor-mediated endocytosis, utilizing glycoprotein complexes on its viral envelope to bind to cellular receptors including platelet-derived growth factor receptor alpha (PDGFR-alpha) and epidermal growth factor receptor (EGFR). Once inside the cell, the viral DNA is transported to the nucleus where it hijacks the host cell's transcriptional machinery to replicate. CMV has evolved sophisticated immune evasion strategies: it downregulates major histocompatibility complex (MHC) class I and class II molecules on infected cells, interferes with natural killer cell recognition, produces viral cytokines that modulate the host immune response, and encodes proteins that block apoptosis of infected cells. In immunocompetent individuals, primary CMV infection is usually asymptomatic or produces a mild mononucleosis-like syndrome with fever, fatigue, lymphadenopathy, and atypical lymphocytosis. However, in immunocompromised patients -- including organ transplant recipients, patients receiving chemotherapy, and individuals with HIV/AIDS with CD4 counts below 50 cells per microliter -- CMV can cause severe and life-threatening disease affecting virtually every organ system. CMV retinitis is the most common manifestation in AIDS patients, presenting with painless vision loss, floaters, and characteristic retinal hemorrhages and exudates described as a cottage cheese and ketchup appearance on fundoscopic examination. CMV pneumonitis occurs primarily in bone marrow and lung transplant recipients, presenting with progressive dyspnea, dry cough, and bilateral interstitial infiltrates on chest radiography, carrying mortality rates of 30 to 50 percent even with treatment. CMV colitis presents with watery or bloody diarrhea, abdominal pain, fever, and weight loss, with endoscopy revealing characteristic deep mucosal ulcerations. CMV encephalitis causes confusion, personality changes, and focal neurological deficits. Congenital CMV infection is the leading infectious cause of sensorineural hearing loss and intellectual disability worldwide, affecting approximately 0.5 to 2 percent of all live births. Transmission of congenital CMV occurs through transplacental passage of the virus during maternal primary infection (30 to 40 percent transmission rate) or reactivation (1 to 3 percent transmission rate). Approximately 10 to 15 percent of congenitally infected neonates are symptomatic at birth, presenting with petechiae, hepatosplenomegaly, jaundice, microcephaly, periventricular calcifications on cranial imaging, chorioretinitis, and thrombocytopenia. An additional 10 to 15 percent of initially asymptomatic infants will develop late-onset sequelae, primarily sensorineural hearing loss. TORCH screening (Toxoplasmosis, Other agents, Rubella, CMV, Herpes simplex) is performed when congenital infection is suspected. CMV-specific IgM indicates recent or active infection, while CMV IgG indicates past exposure and immunity. Quantitative CMV DNA polymerase chain reaction (PCR) is the gold standard for monitoring viral load in immunocompromised patients and guides decisions about preemptive therapy versus treatment. The practical nurse must understand that CMV is transmitted through direct contact with infectious body fluids including saliva, urine, blood, breast milk, cervical secretions, and semen. Standard precautions are sufficient for hospitalized patients, but meticulous hand hygiene is essential, particularly after contact with diapers, saliva, or other body fluids of young children who are the primary reservoir for CMV in community settings."
    },
    riskFactors: [
      "Immunosuppression (organ transplant recipients on anti-rejection therapy, HIV/AIDS with CD4 below 50)",
      "Pregnancy (primary maternal infection carries 30-40% risk of transplacental transmission to the fetus)",
      "Hematopoietic stem cell transplant recipients (highest risk for CMV pneumonitis, especially with CMV-seropositive donor)",
      "Premature neonates (immature immune system and potential exposure through breast milk or transfusions)",
      "Blood transfusion recipients who are CMV-seronegative (risk of transfusion-transmitted CMV if unscreened products used)",
      "Healthcare workers and daycare providers (frequent exposure to saliva and urine from young children)",
      "Patients receiving high-dose corticosteroids or chemotherapy (iatrogenic immunosuppression enables reactivation)"
    ],
    diagnostics: [
      "CMV quantitative PCR (viral load): gold standard for monitoring in immunocompromised patients; rising viral load indicates active replication and guides preemptive therapy decisions",
      "CMV IgG and IgM serology: IgM suggests recent/active infection; IgG indicates past exposure; seroconversion (IgG negative to positive) confirms primary infection",
      "CMV pp65 antigenemia assay: detects CMV phosphoprotein 65 in peripheral blood leukocytes; rapid results but less sensitive than PCR in neutropenic patients",
      "Tissue biopsy with histopathology: definitive diagnosis of end-organ disease; characteristic owl-eye intranuclear inclusion bodies in infected cells are pathognomonic",
      "Fundoscopic examination: essential for CMV retinitis diagnosis; reveals characteristic cottage cheese and ketchup retinal lesions with hemorrhages and white necrotic areas",
      "Complete blood count with differential: may show atypical lymphocytosis (similar to EBV mononucleosis), thrombocytopenia, and mild transaminase elevation"
    ],
    management: [
      "Initiate antiviral therapy promptly as prescribed for immunocompromised patients with confirmed CMV disease or rising viral loads above treatment threshold",
      "Monitor complete blood count twice weekly during ganciclovir/valganciclovir therapy due to dose-limiting myelosuppression (neutropenia in up to 40% of patients)",
      "Administer CMV-negative or leukoreduced blood products to CMV-seronegative transplant recipients and premature neonates to prevent transfusion-transmitted CMV",
      "Coordinate ophthalmology referrals for dilated fundoscopic examinations in immunocompromised patients with visual complaints or routine CMV surveillance",
      "Implement preemptive therapy strategy when CMV viral load exceeds institutional threshold (typically 1000-5000 copies/mL) before end-organ disease develops",
      "Ensure adequate hydration before and during foscarnet administration to prevent nephrotoxicity; maintain urine output above 30 mL/hour",
      "Educate pregnant patients about CMV prevention: hand hygiene after diaper changes, avoid sharing utensils with young children, avoid kissing children on the mouth"
    ],
    nursingActions: [
      "Monitor and report CMV viral load trends to the healthcare team; rising levels may indicate treatment failure or developing resistance",
      "Perform strict hand hygiene before and after all patient contact; CMV is transmitted through body fluids including saliva, urine, and blood",
      "Assess for signs of CMV end-organ disease: visual changes (retinitis), persistent diarrhea (colitis), progressive dyspnea (pneumonitis), confusion (encephalitis)",
      "Monitor absolute neutrophil count (ANC) during ganciclovir therapy; hold medication and report immediately if ANC falls below 500 cells per microliter",
      "Document and report any new visual complaints in immunocompromised patients immediately as CMV retinitis can progress to irreversible blindness within days",
      "Educate patients and families about CMV transmission routes and the importance of hand hygiene, especially around young children and pregnant women",
      "Monitor renal function (serum creatinine, BUN) during foscarnet therapy and report declining function; ensure pre-hydration protocols are followed"
    ],
    assessmentFindings: [
      "Fever, fatigue, malaise, and myalgias lasting 2-3 weeks (mononucleosis-like syndrome in immunocompetent adults during primary infection)",
      "Visual disturbances including floaters, photophobia, scotomata, and decreased visual acuity (CMV retinitis in immunocompromised patients)",
      "Watery or bloody diarrhea with abdominal cramping, fever, and weight loss (CMV colitis; confirmed by colonoscopy showing deep mucosal ulcers)",
      "Progressive dyspnea, non-productive cough, and hypoxemia with bilateral interstitial infiltrates on chest X-ray (CMV pneumonitis)",
      "Hepatosplenomegaly, petechial rash, jaundice, and microcephaly in neonates (congenital CMV; periventricular calcifications on cranial ultrasound)",
      "Atypical lymphocytosis on complete blood count differential, elevated liver transaminases (AST/ALT), and thrombocytopenia",
      "Sensorineural hearing loss in infants (may be present at birth or develop progressively in first 2-3 years; leading infectious cause of childhood hearing loss)"
    ],
    signs: {
      left: [
        "Low-grade fever and fatigue persisting beyond 2 weeks",
        "Mild lymphadenopathy (cervical, axillary)",
        "Mild hepatosplenomegaly on palpation",
        "Atypical lymphocytes on blood smear",
        "Mild elevation of liver transaminases",
        "Sore throat without exudate"
      ],
      right: [
        "Sudden vision loss or new floaters (CMV retinitis emergency)",
        "Severe bloody diarrhea with dehydration (CMV colitis)",
        "Acute respiratory distress with bilateral infiltrates (CMV pneumonitis)",
        "New-onset seizures or acute confusion (CMV encephalitis)",
        "ANC below 500 during ganciclovir therapy (severe neutropenia)",
        "Neonatal petechiae with hepatosplenomegaly and jaundice (symptomatic congenital CMV)"
      ]
    },
    medications: [
      {
        name: "Ganciclovir (Cytovene) / Valganciclovir (Valcyte)",
        type: "Antiviral (nucleoside analog)",
        action: "Ganciclovir is phosphorylated by CMV-encoded UL97 kinase to its active triphosphate form, which competitively inhibits viral DNA polymerase (UL54) and incorporates into viral DNA, causing chain termination and halting CMV replication; valganciclovir is the oral prodrug with approximately 60% bioavailability",
        sideEffects: "Neutropenia (dose-limiting, up to 40%), thrombocytopenia, anemia, nausea, diarrhea, renal impairment; teratogenic and carcinogenic in animal studies",
        contra: "ANC below 500 cells/microliter; platelet count below 25,000; pregnancy (category X -- teratogenic); concurrent use with zidovudine (additive myelosuppression); severe renal impairment requires dose adjustment",
        pearl: "Monitor CBC with differential twice weekly during induction therapy; dose must be adjusted for renal function (CrCl-based dosing); IV ganciclovir used for severe disease, oral valganciclovir for maintenance and prophylaxis"
      },
      {
        name: "Valganciclovir (Valcyte)",
        type: "Antiviral (oral prodrug of ganciclovir)",
        action: "Rapidly converted to ganciclovir after oral absorption by intestinal and hepatic esterases; the active ganciclovir triphosphate then inhibits CMV DNA polymerase and terminates viral DNA chain elongation",
        sideEffects: "Neutropenia, anemia, thrombocytopenia, diarrhea, nausea, headache, tremor; bone marrow suppression is the most clinically significant adverse effect",
        contra: "Absolute neutrophil count below 500; platelet count below 25,000; pregnancy and breastfeeding; hypersensitivity to ganciclovir or valganciclovir; hemodialysis patients (drug is removed by dialysis)",
        pearl: "Take with food to increase bioavailability by approximately 30%; tablets should not be broken or crushed (hazardous drug precautions); standard prophylaxis dosing is 900 mg once daily, treatment induction is 900 mg twice daily"
      },
      {
        name: "Foscarnet (Foscavir)",
        type: "Antiviral (pyrophosphate analog)",
        action: "Directly inhibits viral DNA polymerase and reverse transcriptase by binding to the pyrophosphate binding site, blocking cleavage of pyrophosphate from deoxynucleoside triphosphates; does NOT require viral kinase activation, making it effective against ganciclovir-resistant CMV strains with UL97 mutations",
        sideEffects: "Nephrotoxicity (dose-limiting, occurs in up to 30%), electrolyte disturbances (hypocalcemia, hypomagnesemia, hypokalemia, hypophosphatemia), seizures, penile ulceration, nausea, fever",
        contra: "Creatinine clearance below 0.4 mL/min/kg; concurrent use with other nephrotoxic drugs (aminoglycosides, amphotericin B); dehydration",
        pearl: "Requires aggressive pre-hydration with 500-1000 mL normal saline before each dose to prevent nephrotoxicity; monitor ionized calcium, magnesium, potassium, and phosphorus twice weekly; infuse slowly over at least 1 hour via infusion pump"
      }
    ],
    pearls: [
      "CMV is the most common congenital infection worldwide and the leading infectious cause of sensorineural hearing loss in children -- hearing screening should continue through age 3 even in initially asymptomatic infants",
      "The characteristic owl-eye intranuclear inclusion bodies seen on tissue biopsy are pathognomonic for CMV infection and represent enlarged cells with large basophilic nuclear inclusions surrounded by a clear halo",
      "CMV retinitis in immunocompromised patients is an ophthalmologic emergency -- delayed treatment can result in irreversible vision loss within days; report any visual complaints immediately",
      "Ganciclovir-induced neutropenia is the most common reason for treatment interruption; colony-stimulating factors (G-CSF) may be used to support neutrophil recovery while continuing antiviral therapy",
      "Foscarnet does NOT require viral kinase activation, making it the drug of choice for ganciclovir-resistant CMV strains; however, nephrotoxicity rates approach 30% and mandate aggressive pre-hydration",
      "Pregnant healthcare workers should practice meticulous hand hygiene after handling diapers, feeding young children, or contact with saliva -- CMV is shed in high concentrations in the urine and saliva of infected toddlers",
      "TORCH screening (Toxoplasmosis, Other, Rubella, CMV, Herpes) is indicated when congenital infection is suspected; CMV-specific IgM in cord blood or neonatal urine CMV PCR within 21 days of birth confirms congenital (not postnatal) infection"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a bone marrow transplant recipient receiving ganciclovir for CMV prophylaxis. Which laboratory value requires the nurse to hold the medication and notify the physician immediately?",
        options: [
          "Hemoglobin 110 g/L",
          "Absolute neutrophil count 400 cells/microliter",
          "Platelet count 140,000/microliter",
          "Serum creatinine 90 micromol/L"
        ],
        correct: 1,
        rationale: "Ganciclovir must be held when the absolute neutrophil count (ANC) falls below 500 cells/microliter due to the risk of severe, life-threatening neutropenia. This is the most common dose-limiting toxicity of ganciclovir therapy. The other values are within acceptable ranges."
      },
      {
        question: "A nurse is caring for a patient with HIV/AIDS who reports new-onset floaters and blurred vision in the right eye. Which action should the nurse take first?",
        options: [
          "Document the finding and reassess at the next scheduled assessment",
          "Report the visual changes immediately and arrange urgent ophthalmology consultation",
          "Administer prescribed analgesics for eye discomfort",
          "Apply warm compresses to the affected eye"
        ],
        correct: 1,
        rationale: "New visual complaints in an immunocompromised patient may indicate CMV retinitis, which is an ophthalmologic emergency. CMV retinitis can progress to irreversible blindness within days without treatment. Immediate reporting and urgent fundoscopic examination are essential."
      },
      {
        question: "Which precaution should a practical nurse reinforce when educating a pregnant woman about preventing cytomegalovirus (CMV) infection?",
        options: [
          "Avoid all contact with children under age 5",
          "Wear an N95 respirator when in public spaces",
          "Wash hands thoroughly after changing diapers and avoid sharing utensils with young children",
          "Receive the CMV vaccine before the second trimester"
        ],
        correct: 2,
        rationale: "CMV is transmitted through direct contact with body fluids, especially saliva and urine of young children who are the primary community reservoir. Hand hygiene after diaper changes and avoiding sharing utensils or kissing children on the mouth are evidence-based prevention strategies. There is currently no approved CMV vaccine."
      }
    ]
  },

  "dengue-basics-rpn": {
    title: "Dengue Fever for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Dengue Fever",
      content: "Dengue fever is caused by the dengue virus (DENV), a single-stranded positive-sense RNA virus belonging to the Flaviviridae family. Four distinct serotypes exist (DENV-1 through DENV-4), and infection with one serotype provides lifelong immunity to that specific serotype but only temporary cross-protection against the others. This is critically important because secondary infection with a different serotype carries a significantly higher risk of severe dengue through a phenomenon called antibody-dependent enhancement (ADE). In ADE, non-neutralizing antibodies from the first infection bind to the new dengue serotype and facilitate viral entry into Fc-receptor-bearing cells (monocytes and macrophages), paradoxically increasing viral replication rather than neutralizing the virus. The primary vector for dengue transmission is the Aedes aegypti mosquito, with Aedes albopictus serving as a secondary vector. These mosquitoes are daytime feeders, with peak biting activity occurring during early morning and late afternoon hours. Aedes aegypti is a peridomestic species that breeds in small collections of standing water including flower pots, discarded tires, rain barrels, and water storage containers. The mosquito acquires the virus by feeding on an infected human during the viremic phase (typically 2 days before symptom onset through 5-7 days after) and becomes infectious after an extrinsic incubation period of 8-12 days, remaining infectious for the remainder of its lifespan. After the infected mosquito bites a susceptible human, the virus replicates in local dendritic cells and macrophages at the site of inoculation, then disseminates through the lymphatic system and bloodstream. The incubation period in humans is 4-10 days. Dengue pathogenesis involves complex interactions between the virus and the host immune system. Infected dendritic cells and macrophages release a cascade of pro-inflammatory cytokines and chemokines, including tumor necrosis factor alpha (TNF-alpha), interleukins (IL-6, IL-8, IL-10), and interferon gamma. This cytokine storm causes increased vascular permeability, the hallmark of severe dengue. The endothelial glycocalyx layer is disrupted, plasma leaks from the intravascular space into the interstitial compartment and serous cavities (pleural effusion, ascites), and intravascular volume decreases. Thrombocytopenia in dengue results from multiple mechanisms: direct viral infection of bone marrow precursor cells suppresses megakaryopoiesis, circulating immune complexes cause peripheral platelet destruction, and activated platelets are consumed in damaged endothelium. The combination of increased vascular permeability, plasma leakage, thrombocytopenia, and coagulopathy creates the conditions for dengue hemorrhagic fever (DHF) and dengue shock syndrome (DSS). The World Health Organization classifies dengue into dengue without warning signs, dengue with warning signs, and severe dengue. Warning signs typically appear during defervescence (when fever breaks, usually days 3-7) and include persistent vomiting, severe abdominal pain, mucosal bleeding, lethargy or restlessness, hepatomegaly, and a rising hematocrit concurrent with a rapidly falling platelet count. The critical phase during defervescence is when plasma leakage peaks and patients are at highest risk for cardiovascular collapse. Severe dengue is defined by severe plasma leakage leading to shock or respiratory distress from fluid accumulation, severe bleeding, or severe organ impairment (liver transaminases above 1000 IU/L, encephalitis, or myocarditis). The tourniquet test (inflating a blood pressure cuff midway between systolic and diastolic for 5 minutes and counting petechiae) is a bedside screening tool; 20 or more petechiae in a 2.5 cm square area is considered positive and suggests capillary fragility associated with dengue. The practical nurse plays a critical role in serial platelet monitoring, fluid balance assessment, recognizing warning signs, and supporting hemodynamic stability through careful fluid management during the critical phase."
    },
    riskFactors: [
      "Residence in or travel to tropical/subtropical endemic regions (Southeast Asia, Central/South America, Caribbean, Africa)",
      "Secondary dengue infection with a different serotype (antibody-dependent enhancement increases risk of severe dengue 40-80 fold)",
      "Age extremes: children under 15 and elderly patients have higher mortality rates from severe dengue",
      "Pregnancy (increased risk of hemorrhage, preterm birth, and adverse fetal outcomes)",
      "Chronic conditions including diabetes, hypertension, and renal disease (associated with worse outcomes)",
      "Blood type O (epidemiological studies suggest higher susceptibility to dengue hemorrhagic fever)",
      "Living conditions with stagnant water sources near dwellings (optimal Aedes aegypti breeding habitat)"
    ],
    diagnostics: [
      "NS1 antigen test: detects non-structural protein 1 during acute viremia; most sensitive in first 0-5 days of illness; positive result confirms dengue in appropriate clinical context",
      "Dengue IgM/IgG serology: IgM detectable by day 4-5 of illness (indicates current/recent infection); IgG rise in secondary infection is rapid and may predominate over IgM",
      "Complete blood count with differential: serial monitoring essential; falling platelet count (below 100,000) and rising hematocrit (more than 20% above baseline) indicate plasma leakage",
      "Tourniquet test (Rumpel-Leede test): inflate BP cuff between systolic and diastolic for 5 minutes; 20 or more petechiae in a 2.5 cm square indicates capillary fragility",
      "Liver function tests: AST and ALT may be mildly to severely elevated; AST typically rises before ALT; transaminases above 1000 indicate severe organ involvement",
      "Dengue RT-PCR: molecular confirmation with serotype identification; most useful in first 5 days of illness during viremia; gold standard but not always available"
    ],
    management: [
      "Administer acetaminophen for fever and pain control; strictly avoid NSAIDs (aspirin, ibuprofen) as they worsen thrombocytopenia and increase bleeding risk",
      "Maintain meticulous fluid balance: oral rehydration for mild cases; IV isotonic crystalloids (normal saline or lactated Ringers) for patients with warning signs or unable to tolerate oral intake",
      "Monitor and document platelet count and hematocrit every 6-12 hours during the critical phase (days 3-7, around defervescence) to detect plasma leakage early",
      "Administer platelet transfusions only for active significant bleeding with platelet count below 10,000 or as ordered; prophylactic transfusion is generally not recommended",
      "Provide bed rest during acute febrile and critical phases; elevate the head of bed 30 degrees to reduce intracranial pressure from potential cerebral edema",
      "Adjust IV fluid rates based on clinical response: reduce or stop IV fluids when hematocrit drops, urine output improves, and patient stabilizes to prevent fluid overload during recovery phase",
      "Implement mosquito precautions for hospitalized patients (bed nets, mosquito repellent) to prevent nosocomial transmission during the viremic period"
    ],
    nursingActions: [
      "Monitor vital signs every 1-2 hours during the critical phase; narrowing pulse pressure (below 20 mmHg) is an early sign of impending dengue shock syndrome",
      "Perform serial platelet counts and hematocrit as ordered; report platelet count below 100,000 or hematocrit rise above 20% from baseline immediately",
      "Maintain strict intake and output documentation; target urine output of 0.5-1 mL/kg/hour; decreasing output may indicate plasma leakage and evolving shock",
      "Assess for warning signs during defervescence: persistent vomiting, severe abdominal pain, mucosal bleeding, lethargy/restlessness, hepatomegaly, rapid hematocrit rise with concurrent platelet drop",
      "Perform the tourniquet test correctly: inflate blood pressure cuff midway between systolic and diastolic for exactly 5 minutes, then count petechiae distal to the cuff",
      "Monitor for bleeding manifestations: petechiae, ecchymoses, epistaxis, gingival bleeding, hematemesis, melena, menorrhagia; document location and severity",
      "Educate patients and families about avoiding aspirin and NSAIDs, importance of hydration, recognition of warning signs requiring emergency care, and mosquito bite prevention"
    ],
    assessmentFindings: [
      "High fever (40-40.5 degrees Celsius) with sudden onset, severe headache, retro-orbital pain worsened by eye movement, and myalgia/arthralgia (break-bone fever)",
      "Maculopapular or morbilliform rash appearing 3-5 days after fever onset, often described as islands of white in a sea of red, with associated pruritus",
      "Thrombocytopenia (platelet count below 100,000) with progressive decline during critical phase; nadir typically occurs on days 5-7 of illness",
      "Rising hematocrit (increase of 20% or more above baseline) indicating hemoconcentration from plasma leakage into interstitial spaces",
      "Positive tourniquet test with 20 or more petechiae in a 2.5 cm area indicating increased capillary fragility and thrombocytopenia",
      "Hepatomegaly (liver palpable 2 cm or more below the costal margin) with tenderness, indicating hepatic involvement",
      "Narrowing pulse pressure (less than 20 mmHg), weak rapid pulse, cool clammy extremities, and delayed capillary refill indicating progression to dengue shock syndrome"
    ],
    signs: {
      left: [
        "Sudden high fever with severe headache and retro-orbital pain",
        "Myalgia, arthralgia, and bone pain (break-bone fever)",
        "Maculopapular rash appearing 3-5 days into illness",
        "Mild thrombocytopenia (platelets 100,000-150,000)",
        "Positive tourniquet test with scattered petechiae",
        "Nausea, anorexia, and mild abdominal discomfort"
      ],
      right: [
        "Platelet count below 20,000 with active mucosal bleeding",
        "Narrowing pulse pressure below 20 mmHg (impending shock)",
        "Massive plasma leakage with pleural effusion and ascites",
        "Hematemesis or melena (severe gastrointestinal hemorrhage)",
        "Altered consciousness or encephalopathy (severe organ involvement)",
        "Dengue shock syndrome: hypotension, tachycardia, cold clammy skin, undetectable pulse"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol/Tempra)",
        type: "Analgesic/Antipyretic (non-NSAID)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center to lower fever; also modulates descending serotonergic pain pathways for analgesic effect without affecting peripheral platelet function",
        sideEffects: "Hepatotoxicity at doses exceeding 4 g/day in adults (lower threshold in patients with liver disease or alcohol use); nausea, rash (rare); overdose causes fulminant hepatic failure",
        contra: "Severe hepatic impairment or active liver disease; alcohol use disorder (increased hepatotoxicity risk); known hypersensitivity; caution with dengue-related hepatic involvement (monitor transaminases)",
        pearl: "The ONLY safe analgesic/antipyretic for dengue patients -- NSAIDs (aspirin, ibuprofen, naproxen) are absolutely contraindicated because they inhibit platelet function, worsen thrombocytopenia, and increase hemorrhagic risk; maximum 4 g/day in healthy adults, reduce to 2 g/day with hepatic involvement"
      },
      {
        name: "Intravenous Crystalloid Solutions (Normal Saline 0.9% / Lactated Ringers)",
        type: "Isotonic fluid replacement",
        action: "Restores intravascular volume lost through plasma leakage by expanding the extracellular fluid compartment; isotonic solutions maintain osmotic equilibrium and support hemodynamic stability during the critical phase of dengue when increased vascular permeability causes plasma extravasation",
        sideEffects: "Fluid overload (pulmonary edema, pleural effusion, ascites) especially during the recovery phase when plasma is reabsorbed; hyperchloremic metabolic acidosis with large volumes of normal saline; electrolyte imbalances",
        contra: "Fluid overload; decompensated heart failure; pulmonary edema; use with extreme caution during recovery phase (post-critical) when reabsorbed plasma may cause volume overload",
        pearl: "Fluid management in dengue requires constant reassessment: increase fluids when hematocrit rises and urine output falls; decrease or stop fluids when hematocrit normalizes and urine output exceeds 1 mL/kg/hour; the recovery phase is the most dangerous time for iatrogenic fluid overload"
      },
      {
        name: "Platelet Transfusion (Pooled Random Donor or Single Donor Apheresis)",
        type: "Blood product replacement",
        action: "Provides exogenous functional platelets to temporarily increase platelet count and support primary hemostasis; transfused platelets adhere to damaged endothelium, aggregate to form a platelet plug, and provide phospholipid surfaces for coagulation cascade activation",
        sideEffects: "Febrile non-hemolytic transfusion reaction, allergic reaction (urticaria, anaphylaxis), transfusion-related acute lung injury (TRALI), bacterial contamination (platelets stored at room temperature), alloimmunization with repeated transfusions",
        contra: "Prophylactic transfusion in stable patients without bleeding (not recommended per WHO guidelines for dengue); thrombotic thrombocytopenic purpura (TTP); heparin-induced thrombocytopenia (HIT)",
        pearl: "In dengue, platelet transfusion is indicated ONLY for active clinically significant bleeding, not for low platelet counts alone; prophylactic transfusion does not prevent hemorrhage and may cause adverse reactions; one unit of random donor platelets raises the count by approximately 5,000-10,000 per microliter"
      }
    ],
    pearls: [
      "The critical phase of dengue occurs during DEFERVESCENCE (when fever breaks, typically days 3-7) -- not during the febrile phase; this is when plasma leakage peaks and patients are at highest risk for shock",
      "NSAIDs (aspirin, ibuprofen, naproxen) are ABSOLUTELY CONTRAINDICATED in dengue because they inhibit platelet function and increase hemorrhagic risk; acetaminophen is the only safe analgesic/antipyretic",
      "Narrowing pulse pressure (difference between systolic and diastolic less than 20 mmHg) is an early and reliable indicator of impending dengue shock syndrome -- report immediately before frank hypotension develops",
      "Rising hematocrit with simultaneously falling platelet count is the hallmark laboratory pattern of plasma leakage in dengue -- these values should be monitored together every 6-12 hours during the critical phase",
      "Fluid overload during the RECOVERY phase (after critical phase) is a leading cause of iatrogenic mortality in dengue -- reduce IV fluids when hematocrit drops and urine output increases",
      "Antibody-dependent enhancement (ADE) explains why SECONDARY dengue infection with a different serotype is more dangerous than primary infection -- pre-existing non-neutralizing antibodies enhance viral entry into macrophages",
      "The tourniquet test is a practical bedside screening tool: inflate BP cuff between systolic and diastolic pressures for 5 minutes; 20 or more petechiae in a 2.5 cm square area is positive for capillary fragility"
    ],
    quiz: [
      {
        question: "A patient admitted with dengue fever becomes afebrile on day 5 of illness. The practical nurse understands that this defervescence phase is significant because:",
        options: [
          "The patient is recovering and can be discharged safely",
          "This is the critical phase when plasma leakage peaks and shock risk is highest",
          "Antiviral therapy should be initiated at this point",
          "The patient is no longer infectious to mosquitoes"
        ],
        correct: 1,
        rationale: "The critical phase of dengue occurs during defervescence (when fever breaks, typically days 3-7), not during the febrile phase. This is when vascular permeability peaks, plasma leakage is maximal, and the risk of dengue shock syndrome is highest. Patients require the closest monitoring during this period."
      },
      {
        question: "A patient with confirmed dengue fever reports severe body aches and requests pain medication. Which medication should the practical nurse administer as prescribed?",
        options: [
          "Ibuprofen 400 mg orally",
          "Acetaminophen 1000 mg orally",
          "Aspirin 650 mg orally",
          "Naproxen 500 mg orally"
        ],
        correct: 1,
        rationale: "Acetaminophen is the ONLY safe analgesic/antipyretic for dengue patients. NSAIDs (ibuprofen, aspirin, naproxen) are absolutely contraindicated because they inhibit platelet function, worsen thrombocytopenia, and significantly increase the risk of hemorrhagic complications."
      },
      {
        question: "During the critical phase of dengue, which combination of laboratory findings should the practical nurse report immediately as an indicator of plasma leakage?",
        options: [
          "Elevated white blood cell count with low hemoglobin",
          "Rising hematocrit with falling platelet count",
          "Elevated serum potassium with low sodium",
          "Elevated blood glucose with low albumin"
        ],
        correct: 1,
        rationale: "Rising hematocrit (hemoconcentration) concurrent with falling platelet count is the hallmark laboratory pattern indicating plasma leakage in dengue. The rising hematocrit reflects loss of plasma volume into interstitial spaces, while thrombocytopenia results from peripheral destruction and bone marrow suppression."
      }
    ]
  },

  "aspergillosis-basics-rpn": {
    title: "Aspergillosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Aspergillosis",
      content: "Aspergillosis is a spectrum of diseases caused by fungi of the genus Aspergillus, with Aspergillus fumigatus being responsible for approximately 90 percent of invasive infections. Aspergillus species are ubiquitous saprophytic molds found in soil, decaying vegetation, compost heaps, air-conditioning systems, and construction/renovation sites. The organism reproduces by releasing conidia (asexual spores) that are 2 to 3 micrometers in diameter, small enough to reach the terminal bronchioles and alveoli when inhaled. Immunocompetent individuals inhale hundreds of Aspergillus conidia daily without developing disease because the innate immune system provides robust protection through multiple layers of defense. Airway epithelial cells trap conidia in the mucociliary blanket, alveolar macrophages phagocytose and kill germinating conidia through oxidative burst mechanisms (reactive oxygen species), and neutrophils destroy hyphal forms through degranulation and extracellular trap formation. Aspergillosis develops when these defense mechanisms are compromised or overwhelmed. The clinical spectrum of aspergillosis includes four major forms: invasive pulmonary aspergillosis (IPA), chronic pulmonary aspergillosis (CPA), allergic bronchopulmonary aspergillosis (ABPA), and aspergilloma. Invasive pulmonary aspergillosis is the most life-threatening form, occurring almost exclusively in severely immunocompromised patients. The primary risk factors include prolonged neutropenia (absolute neutrophil count below 500 for more than 10 days), hematopoietic stem cell transplantation, solid organ transplantation (especially lung), high-dose corticosteroid therapy (equivalent to prednisone 0.3 mg/kg/day for 3 or more weeks), and advanced HIV/AIDS. In IPA, inhaled conidia germinate into hyphae within the lung parenchyma and invade blood vessel walls (angioinvasion), causing thrombosis, infarction, and hemorrhagic necrosis. This angioinvasive behavior produces the characteristic halo sign on computed tomography (CT): a nodular density surrounded by a ground-glass haze representing hemorrhage around the infarcted tissue. As the lesion evolves, necrotic tissue separates from viable lung, creating the air crescent sign on CT, typically appearing 2-3 weeks after the initial lesion. Serum galactomannan is a cell wall polysaccharide released during Aspergillus hyphal growth and serves as a critical biomarker for early diagnosis. The galactomannan enzyme immunoassay (EIA) has a sensitivity of approximately 70-80 percent in hematologic malignancy patients but lower sensitivity in solid organ transplant recipients and patients receiving mold-active antifungal prophylaxis. Beta-D-glucan is another fungal cell wall component that is elevated in aspergillosis but is not specific (also elevated in Candida, Pneumocystis, and other fungal infections). Allergic bronchopulmonary aspergillosis (ABPA) occurs in patients with asthma or cystic fibrosis and represents a hypersensitivity reaction to Aspergillus antigens colonizing the airways. ABPA is characterized by eosinophilia, elevated total IgE (typically above 1000 IU/mL), positive Aspergillus-specific IgE and IgG, and central bronchiectasis on CT. Aspergilloma (fungus ball or mycetoma) develops when Aspergillus colonizes pre-existing lung cavities (from prior tuberculosis, sarcoidosis, or other cavitary lung diseases), forming a mass of tangled hyphae, fibrin, mucus, and cellular debris within the cavity. Aspergillomas are often asymptomatic but can cause life-threatening hemoptysis if they erode into bronchial arteries. The practical nurse must understand infection prevention measures during hospital construction and renovation, as these activities release massive quantities of Aspergillus conidia into the environment. Immunocompromised patients require protected environments with HEPA filtration, positive pressure rooms, and restricted access to construction areas."
    },
    riskFactors: [
      "Prolonged neutropenia (ANC below 500 for more than 10 days, as in chemotherapy for acute leukemia)",
      "Hematopoietic stem cell transplant recipients (especially during engraftment and graft-versus-host disease treatment)",
      "Solid organ transplant recipients on immunosuppressive therapy (lung transplant carries highest risk)",
      "High-dose prolonged corticosteroid therapy (equivalent to prednisone 0.3 mg/kg/day or more for 3 weeks or longer)",
      "Hospital construction or renovation near patient care areas (massive release of Aspergillus conidia into air)",
      "Pre-existing structural lung disease with cavities (tuberculosis, sarcoidosis, COPD with bullae) predisposing to aspergilloma formation",
      "Chronic granulomatous disease (inherited disorder of neutrophil NADPH oxidase resulting in defective oxidative killing of fungi)"
    ],
    diagnostics: [
      "CT chest: halo sign (ground-glass attenuation surrounding a nodular density) is an early finding of invasive aspergillosis; air crescent sign appears later as necrotic tissue separates",
      "Serum galactomannan assay (EIA): fungal cell wall biomarker; index above 0.5 is positive; sensitivity 70-80% in hematologic patients; false positives with piperacillin-tazobactam and some foods",
      "Serum beta-D-glucan: elevated in most invasive fungal infections including aspergillosis; not specific (also positive in Candida, Pneumocystis); supports diagnosis in clinical context",
      "Bronchoalveolar lavage (BAL) with galactomannan and culture: direct sampling of lower airways; BAL galactomannan index above 1.0 is highly specific for invasive aspergillosis",
      "Tissue biopsy with GMS (Grocott methenamine silver) stain: reveals characteristic acute-angle (45-degree) dichotomously branching septate hyphae; definitive diagnosis of invasive disease",
      "Sputum culture for Aspergillus: positive culture in immunocompromised patient is clinically significant; in immunocompetent patients may represent colonization only"
    ],
    management: [
      "Initiate voriconazole as first-line therapy for invasive aspergillosis as soon as diagnosis is suspected; do not wait for culture confirmation in high-risk patients",
      "Monitor voriconazole trough levels (target 1-5.5 mcg/mL) to ensure therapeutic drug concentrations and minimize toxicity; first level at steady state (day 5-7)",
      "Implement environmental controls for immunocompromised patients: HEPA-filtered positive pressure rooms, sealed windows, restriction from construction and renovation areas",
      "Switch to amphotericin B lipid formulation or caspofungin for patients intolerant of or refractory to voriconazole therapy; combination therapy may be considered in refractory cases",
      "Surgical resection may be indicated for aspergilloma with life-threatening hemoptysis or single lesion invasive aspergillosis in patients who can tolerate surgery",
      "Continue antifungal therapy for a minimum of 6-12 weeks for invasive aspergillosis; duration depends on clinical and radiographic response and immune recovery",
      "Reduce immunosuppression when possible: taper corticosteroids, adjust transplant immunosuppression, support neutrophil recovery with colony-stimulating factors"
    ],
    nursingActions: [
      "Monitor and report fever in neutropenic patients immediately; persistent fever despite broad-spectrum antibiotics in neutropenic patients should raise suspicion for invasive fungal infection",
      "Implement and maintain protective environment precautions: HEPA filtration, positive pressure, N95 respirator for patient transport outside protected room, no live plants or flowers in room",
      "Assess respiratory status every 2-4 hours: monitor for progressive dyspnea, pleuritic chest pain, hemoptysis, and declining oxygen saturation that may indicate invasive pulmonary aspergillosis",
      "Administer voriconazole as prescribed and monitor for visual disturbances (blurred vision, photophobia, color changes) which occur in approximately 30% of patients and are usually transient",
      "Monitor liver function tests during voriconazole therapy (hepatotoxicity in 10-20%); report elevated AST/ALT above 3 times the upper limit of normal",
      "Document the absolute neutrophil count daily and report to the healthcare team; immune recovery (ANC above 500) is critical for successful treatment of invasive aspergillosis",
      "Educate patients about avoiding high-risk environments after discharge: gardening, composting, construction areas, moldy buildings, and barns with decaying vegetation"
    ],
    assessmentFindings: [
      "Persistent fever unresponsive to broad-spectrum antibiotics in a neutropenic patient (classic presentation of invasive pulmonary aspergillosis)",
      "Progressive dyspnea, non-productive cough, and pleuritic chest pain developing in an immunocompromised patient",
      "Hemoptysis ranging from blood-streaked sputum to massive life-threatening hemorrhage (particularly with aspergilloma eroding into bronchial artery)",
      "Halo sign on CT chest: nodular density surrounded by ground-glass opacity representing hemorrhagic infarction from angioinvasive Aspergillus",
      "Elevated serum galactomannan index (above 0.5) in the setting of neutropenia and pulmonary symptoms supporting diagnosis of invasive aspergillosis",
      "Visual disturbances in patients receiving voriconazole: altered color perception (seeing green/yellow tinge), photophobia, and blurred vision typically occurring 30 minutes after dosing",
      "Wheezing, productive cough with brown mucus plugs, and peripheral eosinophilia in asthma or cystic fibrosis patients (allergic bronchopulmonary aspergillosis)"
    ],
    signs: {
      left: [
        "Persistent low-grade fever in neutropenic patient despite antibiotics",
        "Mild non-productive cough and dyspnea on exertion",
        "New pulmonary nodule on chest imaging",
        "Mildly elevated galactomannan index (0.5-1.0)",
        "Fatigue and malaise in immunocompromised patient",
        "Sputum culture positive for Aspergillus species"
      ],
      right: [
        "Massive hemoptysis (more than 300 mL in 24 hours) from aspergilloma",
        "Rapidly progressive respiratory failure requiring intubation",
        "Disseminated aspergillosis with CNS involvement (seizures, focal deficits)",
        "Halo sign on CT with progressive cavitation and air crescent sign",
        "Voriconazole-induced hepatotoxicity (transaminases above 5 times normal)",
        "Fungal sepsis with hemodynamic instability in neutropenic patient"
      ]
    },
    medications: [
      {
        name: "Voriconazole (Vfend)",
        type: "Triazole antifungal",
        action: "Inhibits the fungal cytochrome P450-dependent enzyme lanosterol 14-alpha-demethylase (CYP51), blocking the conversion of lanosterol to ergosterol; ergosterol depletion disrupts fungal cell membrane integrity, increasing permeability and causing cell death; first-line treatment for invasive aspergillosis",
        sideEffects: "Visual disturbances (photopsia, altered color perception in 30% of patients, usually transient), hepatotoxicity (elevated transaminases in 10-20%), photosensitivity with risk of skin cancer on long-term use, QT prolongation, hallucinations, periostitis with long-term use",
        contra: "Co-administration with rifampin, carbamazepine, or long-acting barbiturates (potent CYP450 inducers that drastically reduce voriconazole levels); concurrent use with sirolimus (voriconazole increases sirolimus levels 10-fold); severe hepatic impairment",
        pearl: "Therapeutic drug monitoring is MANDATORY: target trough levels 1-5.5 mcg/mL; sub-therapeutic levels cause treatment failure, supra-therapeutic levels increase toxicity; first trough at steady state (day 5-7); oral formulation should be taken 1 hour before or after meals"
      },
      {
        name: "Amphotericin B Lipid Complex (Abelcet/AmBisome)",
        type: "Polyene antifungal",
        action: "Binds to ergosterol in the fungal cell membrane, creating pores that allow leakage of intracellular potassium, sodium, and hydrogen ions, leading to cell death; lipid formulations concentrate in reticuloendothelial tissues and reduce nephrotoxicity compared to conventional amphotericin B deoxycholate",
        sideEffects: "Nephrotoxicity (despite lipid formulation, monitor creatinine closely), infusion-related reactions (fever, rigors, chills, hypotension), hypokalemia, hypomagnesemia, anemia, thrombophlebitis",
        contra: "Known hypersensitivity; concurrent use with other nephrotoxic agents (aminoglycosides, cyclosporine) increases renal damage risk; dehydration",
        pearl: "Pre-medicate with acetaminophen, diphenhydramine, and meperidine to prevent infusion-related reactions; administer a test dose first per institutional protocol; supplement potassium and magnesium aggressively during therapy; use lipid formulations (not conventional) to reduce nephrotoxicity"
      },
      {
        name: "Caspofungin (Cancidas)",
        type: "Echinocandin antifungal",
        action: "Inhibits synthesis of beta-(1,3)-D-glucan, an essential polysaccharide component of the fungal cell wall that is absent in mammalian cells; loss of cell wall integrity results in osmotic instability and fungal cell lysis; used as salvage therapy for aspergillosis refractory to or intolerant of first-line agents",
        sideEffects: "Elevated liver transaminases, histamine-related symptoms (flushing, rash, pruritus) with rapid infusion, fever, phlebitis at IV site, hypokalemia",
        contra: "Known hypersensitivity to any echinocandin; dose reduction required in moderate hepatic impairment (Child-Pugh B); limited data in severe hepatic impairment (Child-Pugh C)",
        pearl: "Echinocandins have the narrowest spectrum of drug interactions among systemic antifungals; infuse over at least 1 hour to prevent histamine-mediated reactions; available only as IV formulation (no oral absorption); loading dose 70 mg on day 1, then 50 mg daily maintenance"
      }
    ],
    pearls: [
      "The halo sign on CT (ground-glass haze surrounding a nodular density) is an EARLY sign of invasive pulmonary aspergillosis representing hemorrhagic infarction from angioinvasion -- do not wait for this finding to initiate empiric therapy in high-risk patients",
      "Aspergillus hyphae branch at characteristic 45-degree acute angles with regular septations -- this distinguishes them from Mucor/Rhizopus (which branch at 90-degree wide angles and are non-septate/pauci-septate)",
      "Hospital construction and renovation are major risk factors for nosocomial aspergillosis outbreaks -- immunocompromised patients must be in HEPA-filtered positive pressure rooms and construction barriers must be maintained",
      "Voriconazole therapeutic drug monitoring is mandatory: trough levels below 1 mcg/mL are associated with treatment failure, while levels above 5.5 mcg/mL are associated with neurotoxicity and hepatotoxicity",
      "Galactomannan false positives can occur with piperacillin-tazobactam administration and certain food products; always interpret in the clinical context and repeat if initial result is borderline",
      "Aspergilloma (fungus ball) in a pre-existing lung cavity can cause life-threatening hemoptysis by eroding into bronchial arteries -- massive hemoptysis (more than 300 mL in 24 hours) requires emergency bronchial artery embolization or surgical resection",
      "Immune recovery is as important as antifungal therapy for survival in invasive aspergillosis -- recovery of the neutrophil count above 500 significantly improves outcomes; advocate for G-CSF and immunosuppression reduction when possible"
    ],
    quiz: [
      {
        question: "A neutropenic patient with acute leukemia has persistent fever despite 5 days of broad-spectrum antibiotics. CT chest reveals a pulmonary nodule surrounded by ground-glass opacity. The practical nurse recognizes this finding as:",
        options: [
          "Tree-in-bud pattern consistent with tuberculosis",
          "Halo sign suggestive of invasive pulmonary aspergillosis",
          "Air-fluid level indicating lung abscess",
          "Pleural effusion requiring thoracentesis"
        ],
        correct: 1,
        rationale: "The halo sign (nodular density surrounded by ground-glass opacity) on CT is a characteristic early finding of invasive pulmonary aspergillosis, representing hemorrhagic infarction from angioinvasive Aspergillus. In a neutropenic patient with persistent fever despite antibiotics, this finding strongly suggests invasive fungal infection."
      },
      {
        question: "A patient receiving voriconazole for invasive aspergillosis reports seeing a yellow-green tinge to objects and increased sensitivity to light. Which nursing action is most appropriate?",
        options: [
          "Hold the medication and prepare for emergency ophthalmology consultation",
          "Document the finding and reassure the patient that visual disturbances occur in approximately 30% of patients and are usually transient",
          "Administer diphenhydramine for an allergic reaction",
          "Reduce the room lighting and restrict all visual activities"
        ],
        correct: 1,
        rationale: "Visual disturbances including altered color perception, photophobia, and blurred vision are common (approximately 30%) with voriconazole therapy and are typically transient, occurring within 30 minutes of dosing and resolving spontaneously. The nurse should document the finding, reassure the patient, and report at the next assessment. These are not emergency findings unless accompanied by vision loss."
      },
      {
        question: "Which environmental precaution is most important for the practical nurse to implement when caring for a neutropenic patient during hospital construction?",
        options: [
          "Place the patient in a negative pressure isolation room",
          "Ensure the patient is in a HEPA-filtered positive pressure room with sealed windows and construction barriers",
          "Transfer the patient to a medical-surgical unit away from the construction",
          "Provide the patient with a surgical mask during mealtimes only"
        ],
        correct: 1,
        rationale: "HEPA-filtered positive pressure rooms with sealed windows and construction barriers are essential to prevent airborne Aspergillus conidia released during construction from reaching immunocompromised patients. Positive pressure ensures air flows out of the room, not in. Negative pressure rooms are used for airborne infection isolation (e.g., tuberculosis), not protective environments."
      }
    ]
  },

  "fungal-infections-overview-rpn": {
    title: "Fungal Infections Overview for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Fungal Infections",
      content: "Fungal infections (mycoses) represent a diverse group of diseases caused by eukaryotic organisms that possess cell walls containing chitin and cell membranes containing ergosterol -- key molecular targets that distinguish fungi from human cells and form the basis for antifungal pharmacotherapy. Fungi are classified into three major morphological groups relevant to clinical practice: yeasts (unicellular organisms that reproduce by budding, such as Candida and Cryptococcus), molds (multicellular organisms that grow as branching filamentous hyphae, such as Aspergillus and Mucor), and dimorphic fungi (organisms that exist as molds in the environment at 25 degrees Celsius and convert to yeast forms at body temperature of 37 degrees Celsius, such as Histoplasma, Blastomyces, and Coccidioides). This thermal dimorphism is remembered by the mnemonic: mold in the cold, yeast in the heat (or beast). Fungal infections are categorized by depth of tissue involvement. Superficial mycoses affect only the outermost layers of skin and hair (tinea versicolor caused by Malassezia furfur). Cutaneous mycoses (dermatophytoses) involve the keratinized layers of skin, hair, and nails, caused by three genera of dermatophytes: Trichophyton, Microsporum, and Epidermophyton. These organisms possess keratinase enzymes that allow them to digest keratin for nutrition. Common dermatophyte infections include tinea corporis (body ringworm), tinea pedis (athlete's foot), tinea cruris (jock itch), tinea capitis (scalp ringworm), and tinea unguium/onychomycosis (nail fungus). Subcutaneous mycoses involve deeper skin layers and subcutaneous tissue, typically introduced through traumatic inoculation (thorn pricks, splinters), including sporotrichosis (rose gardener's disease caused by Sporothrix schenckii) and chromoblastomycosis. Systemic (deep) mycoses affect internal organs and represent the most life-threatening fungal infections. Opportunistic systemic mycoses occur primarily in immunocompromised hosts and include candidiasis, aspergillosis, cryptococcosis, mucormycosis, and Pneumocystis jirovecii pneumonia (PCP). Endemic systemic mycoses are caused by dimorphic fungi with specific geographic distributions and can cause disease in immunocompetent individuals: histoplasmosis (Ohio and Mississippi River Valleys, Central America), blastomycosis (Great Lakes region, Ohio and Mississippi River Valleys), coccidioidomycosis (Southwestern US, Mexico -- San Joaquin Valley fever), and paracoccidioidomycosis (Latin America). Laboratory diagnosis of fungal infections relies on several techniques. The potassium hydroxide (KOH) preparation is the most widely used rapid diagnostic test: skin scrapings, nail clippings, or hair samples are placed on a glass slide with 10-20% KOH solution, which dissolves keratin and other tissue elements while leaving fungal elements intact for microscopic visualization. The Wood lamp (ultraviolet light at 365 nm wavelength) examination causes certain dermatophyte species to fluoresce: Microsporum canis and Microsporum audouinii produce a bright green fluorescence, while Trichophyton species generally do not fluoresce (making the Wood lamp useful for Microsporum but not Trichophyton). Fungal culture on Sabouraud dextrose agar at 25-30 degrees Celsius remains the gold standard for species identification but requires 2-6 weeks for growth. For systemic mycoses, histopathological examination with special stains (GMS -- Grocott methenamine silver, and PAS -- periodic acid-Schiff) demonstrates fungal elements in tissue. The practical nurse must recognize that immunocompromised patients are at significantly elevated risk for fungal infections and that seemingly minor superficial infections in these patients can rapidly progress to life-threatening invasive disease. Risk factors for invasive fungal infections include neutropenia, organ transplantation, HIV/AIDS, prolonged corticosteroid use, broad-spectrum antibiotic therapy (disrupts normal bacterial flora allowing fungal overgrowth), central venous catheter placement, total parenteral nutrition, and diabetes mellitus (especially poorly controlled)."
    },
    riskFactors: [
      "Immunosuppression (HIV/AIDS, organ transplant recipients, chemotherapy-induced neutropenia, high-dose corticosteroids)",
      "Broad-spectrum antibiotic therapy (disrupts normal bacterial flora, allowing fungal overgrowth especially Candida species)",
      "Diabetes mellitus (hyperglycemia impairs neutrophil function and promotes fungal growth; poorly controlled diabetes is a major risk for mucormycosis)",
      "Central venous catheter placement and total parenteral nutrition (risk for candidemia and catheter-related fungal bloodstream infections)",
      "Warm, moist environments and poor skin hygiene (promotes dermatophyte growth; occlusive footwear, communal showers, locker rooms)",
      "Extremes of age (neonates have immature immune systems; elderly have immunosenescence and multiple comorbidities)",
      "Occupational and recreational exposures (farming, gardening, spelunking in bat caves, construction in endemic areas for dimorphic fungi)"
    ],
    diagnostics: [
      "KOH preparation: skin/nail/hair scrapings dissolved in 10-20% potassium hydroxide on a slide; KOH dissolves keratin revealing fungal hyphae or yeast forms under microscopy; rapid bedside diagnostic test",
      "Wood lamp examination (UV light at 365 nm): Microsporum species fluoresce bright green; useful for tinea capitis screening; Trichophyton and Epidermophyton do NOT fluoresce (negative Wood lamp does not rule out dermatophytosis)",
      "Fungal culture on Sabouraud dextrose agar: gold standard for species identification; incubated at 25-30 degrees Celsius; requires 2-6 weeks for growth; essential for determining antifungal susceptibility",
      "Serum beta-D-glucan: pan-fungal biomarker detecting cell wall component; elevated in Candida, Aspergillus, Pneumocystis; NOT elevated in Mucor/Rhizopus (lack beta-D-glucan) or Cryptococcus",
      "Blood cultures (fungal isolator or BACTEC system): essential for diagnosing candidemia; Candida is the fourth most common cause of nosocomial bloodstream infections; species identification guides antifungal choice",
      "Tissue biopsy with GMS and PAS stains: demonstrates fungal morphology in tissue; allows differentiation between yeast (Candida, Cryptococcus), septate hyphae (Aspergillus), and ribbon-like non-septate hyphae (Mucor)"
    ],
    management: [
      "Initiate topical antifungal therapy for uncomplicated superficial and cutaneous fungal infections: clotrimazole, miconazole, or terbinafine cream applied to clean, dry affected area twice daily for 2-4 weeks",
      "Administer systemic antifungal therapy as prescribed for invasive, widespread, or refractory fungal infections; drug selection depends on the organism, site of infection, and patient immune status",
      "Remove or replace central venous catheters in patients with confirmed candidemia; catheter removal is associated with faster clearance of candidemia and improved outcomes",
      "Optimize glycemic control in diabetic patients with fungal infections; hyperglycemia impairs immune function and promotes fungal proliferation",
      "Implement infection prevention measures: keep skin folds clean and dry, use moisture-wicking fabrics, avoid sharing personal items (towels, shoes, nail clippers), wear protective footwear in communal areas",
      "Monitor renal function, liver function, and electrolytes during systemic antifungal therapy; amphotericin B requires monitoring for nephrotoxicity, hypokalemia, and hypomagnesemia",
      "Continue antifungal therapy for the prescribed duration even after symptoms resolve; premature discontinuation leads to relapse and potential resistance development"
    ],
    nursingActions: [
      "Assess skin thoroughly including all skin folds, interdigital spaces, nail beds, and scalp during admission and daily assessments in immunocompromised patients",
      "Collect specimens properly for fungal diagnosis: scrape the ACTIVE BORDER (not the center) of skin lesions for KOH prep; clip affected nail from the proximal edge for onychomycosis testing",
      "Apply topical antifungals to clean, dry skin; instruct patients to wash and thoroughly dry the affected area before application and to continue treatment for the full prescribed course",
      "Monitor and report oral thrush (white plaques on buccal mucosa, palate, or tongue that can be scraped off revealing erythematous base) in immunocompromised patients receiving antibiotics or corticosteroids",
      "Implement contact precautions for tinea infections as per facility protocol; educate patients about preventing transmission through shared personal items",
      "Monitor for signs of systemic fungal dissemination in immunocompromised patients: persistent fever despite antibiotics, new skin lesions, altered mental status, visual changes",
      "Educate patients about environmental risk reduction: wear protective footwear in communal showers, keep feet dry, avoid contact with bird/bat droppings, use HEPA-filtered air in transplant units"
    ],
    assessmentFindings: [
      "Annular (ring-shaped) erythematous plaque with raised, scaly advancing border and central clearing (classic tinea corporis presentation)",
      "White, curd-like plaques on oral mucosa that can be scraped off to reveal an erythematous base (oral candidiasis/thrush)",
      "Pruritic, macerated, fissured skin between toes with scaling and erythema extending to the sole (tinea pedis/athlete's foot)",
      "Thickened, discolored (yellow-brown), brittle nails with subungual debris and onycholysis (tinea unguium/onychomycosis)",
      "Alopecia patches with broken hair shafts (black dot appearance) and possible kerion formation (boggy inflammatory mass) on the scalp (tinea capitis)",
      "Satellite lesions (small papules or pustules surrounding a larger erythematous area) characteristic of cutaneous candidiasis in moist skin folds",
      "Persistent fever unresponsive to broad-spectrum antibiotics in neutropenic patients suggesting invasive fungal infection (Candida, Aspergillus)"
    ],
    signs: {
      left: [
        "Localized pruritic erythematous patch with scaling",
        "White oral plaques (thrush) in patient on antibiotics",
        "Interdigital maceration and scaling (tinea pedis)",
        "Nail discoloration and thickening",
        "Low-grade fever in immunocompromised patient",
        "Mild diaper dermatitis with satellite lesions (candidal)"
      ],
      right: [
        "Candidemia (positive blood cultures for Candida species)",
        "Persistent fever despite antibiotics in neutropenic patient (suspect invasive fungal infection)",
        "Rapidly progressive facial/orbital cellulitis in diabetic patient (suspect mucormycosis emergency)",
        "Black eschar on nasal turbinate or palate (rhinocerebral mucormycosis)",
        "Disseminated skin lesions with central necrosis in immunocompromised patient",
        "Altered mental status with meningeal signs in HIV patient (suspect cryptococcal meningitis)"
      ]
    },
    medications: [
      {
        name: "Fluconazole (Diflucan)",
        type: "Triazole antifungal",
        action: "Inhibits fungal cytochrome P450 enzyme lanosterol 14-alpha-demethylase (CYP51), blocking ergosterol biosynthesis; without ergosterol, the fungal cell membrane becomes permeable and the cell dies; excellent bioavailability (greater than 90%) with both oral and IV formulations achieving equivalent serum levels",
        sideEffects: "Nausea, headache, abdominal pain, diarrhea; hepatotoxicity (monitor LFTs, especially with prolonged use); QT prolongation; alopecia with high doses; teratogenic (pregnancy category D)",
        contra: "Co-administration with terfenadine or cisapride (risk of fatal cardiac arrhythmia); pregnancy (teratogenic, especially first trimester); known hypersensitivity; caution with hepatic disease",
        pearl: "Fluconazole is effective against most Candida species EXCEPT Candida krusei (intrinsically resistant) and Candida glabrata (dose-dependent susceptibility); it does NOT cover Aspergillus or Mucor; drug interactions are significant due to CYP450 inhibition -- check all concurrent medications"
      },
      {
        name: "Terbinafine (Lamisil)",
        type: "Allylamine antifungal",
        action: "Inhibits the fungal enzyme squalene epoxidase, blocking squalene conversion to lanosterol in the ergosterol synthesis pathway; this causes toxic accumulation of squalene within the fungal cell and depletes ergosterol, resulting in fungal cell death; highly concentrated in keratin-rich tissues (skin, nails, hair)",
        sideEffects: "Headache, gastrointestinal disturbances (nausea, diarrhea, dyspepsia), taste disturbance (ageusia or dysgeusia in 1-3%), rash, hepatotoxicity (rare but serious -- monitor LFTs), neutropenia (rare)",
        contra: "Chronic or active liver disease (hepatotoxicity risk); severe renal impairment (CrCl below 50 mL/min); known hypersensitivity; concurrent use with strong CYP2D6 inhibitors",
        pearl: "Oral terbinafine is the most effective treatment for onychomycosis (nail fungus): 250 mg daily for 6 weeks for fingernails, 12 weeks for toenails; nails continue to improve after stopping therapy as drug persists in nail keratin; obtain baseline LFTs and CBC before starting"
      },
      {
        name: "Nystatin (Mycostatin)",
        type: "Polyene antifungal (topical/oral non-absorbed)",
        action: "Binds to ergosterol in the fungal cell membrane, creating pores that allow leakage of intracellular contents (potassium, amino acids) leading to cell death; structurally similar to amphotericin B but too toxic for systemic use; used only topically or as an oral suspension (not absorbed from the GI tract)",
        sideEffects: "Oral suspension: nausea, vomiting, diarrhea (uncommon); topical: local irritation, contact dermatitis (rare); essentially no systemic toxicity because it is not absorbed",
        contra: "Known hypersensitivity to nystatin; not effective for systemic fungal infections (not absorbed from GI tract); not effective against dermatophytes (only active against Candida species)",
        pearl: "For oral thrush: instruct patient to swish the suspension throughout the mouth for as long as possible (2-3 minutes minimum) before swallowing; for denture-related candidiasis, also apply nystatin to the denture surfaces; continue treatment for 48 hours after symptoms resolve to prevent relapse"
      }
    ],
    pearls: [
      "The KOH preparation is the most important rapid diagnostic test for superficial fungal infections -- scrape the ACTIVE ADVANCING BORDER of the lesion (not the center) to collect viable fungal elements",
      "Dimorphic fungi follow the rule: mold in the cold, yeast in the heat (beast) -- they exist as molds in the environment (25C) and convert to pathogenic yeast forms at body temperature (37C)",
      "Wood lamp fluorescence is only useful for Microsporum species (bright green fluorescence); Trichophyton species do NOT fluoresce -- a negative Wood lamp examination does NOT rule out dermatophyte infection",
      "Fluconazole does NOT cover Aspergillus, Mucor, or Candida krusei (intrinsic resistance) -- always verify the causative organism before selecting antifungal therapy",
      "Mucormycosis (Rhizopus, Mucor) is a medical emergency most commonly seen in poorly controlled diabetic patients with ketoacidosis; it presents with rapidly progressive rhinocerebral infection with black necrotic eschars on the nasal turbinates or palate",
      "Candida is the fourth most common cause of nosocomial bloodstream infections; all central venous catheters should be removed in patients with confirmed candidemia to improve outcomes",
      "Nystatin oral suspension must be swished in the mouth for at least 2-3 minutes before swallowing for adequate mucosal contact time; for immunocompromised patients with esophageal candidiasis, systemic therapy (fluconazole) is required because nystatin does not achieve therapeutic levels in the esophagus"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to collect a skin scraping for KOH preparation from a patient with a ring-shaped skin lesion. From which part of the lesion should the nurse collect the specimen?",
        options: [
          "The center of the lesion where clearing has occurred",
          "The active, raised, advancing border of the lesion",
          "Any area of surrounding normal-appearing skin",
          "The most erythematous area in the middle of the rash"
        ],
        correct: 1,
        rationale: "Skin scrapings for KOH preparation should be collected from the active, advancing border of the lesion where the highest concentration of viable fungal elements exists. The center of a dermatophyte lesion typically shows clearing and may yield false-negative results."
      },
      {
        question: "A patient with poorly controlled diabetes presents to the emergency department with facial pain, nasal congestion, and a black eschar visible on the nasal turbinate. The practical nurse should recognize this presentation as potentially indicating:",
        options: [
          "Allergic rhinitis with nasal polyp",
          "Rhinocerebral mucormycosis requiring emergent intervention",
          "Bacterial sinusitis requiring antibiotics",
          "Candida infection of the nasal passages"
        ],
        correct: 1,
        rationale: "A black necrotic eschar on the nasal turbinate or palate in a patient with poorly controlled diabetes (especially with ketoacidosis) is the hallmark presentation of rhinocerebral mucormycosis, a rapidly progressive and life-threatening fungal infection caused by Mucor or Rhizopus species. This is a surgical emergency requiring immediate antifungal therapy and surgical debridement."
      },
      {
        question: "The practical nurse is administering nystatin oral suspension to a patient with oral thrush. Which instruction is most important to include in patient education?",
        options: [
          "Swallow the medication immediately for faster absorption",
          "Swish the suspension throughout the mouth for 2-3 minutes before swallowing",
          "Rinse the mouth with water immediately after taking the medication",
          "Take the medication with food to prevent nausea"
        ],
        correct: 1,
        rationale: "Nystatin oral suspension must be swished throughout the mouth for at least 2-3 minutes before swallowing to ensure adequate contact time with the oral mucosa where the Candida infection resides. Nystatin is not absorbed from the GI tract, so its antifungal effect depends entirely on direct mucosal contact."
      }
    ]
  },

  "histoplasmosis-basics-rpn": {
    title: "Histoplasmosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Histoplasmosis",
      content: "Histoplasmosis is a systemic fungal infection caused by Histoplasma capsulatum, a dimorphic fungus that exists as a mold in the environment (at 25 degrees Celsius) and converts to a pathogenic yeast form at body temperature (37 degrees Celsius). This thermal dimorphism is a key virulence factor: the yeast form can survive and replicate within macrophages by preventing phagolysosome fusion, effectively hiding from the immune system. Histoplasma capsulatum is endemic to the Ohio and Mississippi River Valleys in the United States, Central America, parts of South America, Africa, and Southeast Asia. The fungus thrives in soil enriched with nitrogen from bird droppings (starlings, blackbirds, chickens) and bat guano. Activities that disturb contaminated soil -- demolition of old buildings, excavation, cave exploration (spelunking), cleaning chicken coops, and clearing land near roosting sites -- aerosolize the microconidia (2-5 micrometers in diameter), which are then inhaled into the terminal bronchioles and alveoli. Once inhaled, microconidia are phagocytosed by alveolar macrophages. Within the macrophage phagosome, the temperature shift triggers conversion from mold to yeast form. The yeast form produces several virulence factors that enable intracellular survival: it modulates phagolysosomal pH to prevent acidification, acquires iron from the host through siderophore production, and produces catalase to neutralize the oxidative burst. The infected macrophages disseminate the organism through the reticuloendothelial system (lymph nodes, spleen, liver, bone marrow) via the lymphatic and hematogenous routes. In immunocompetent individuals, cell-mediated immunity (T-helper type 1 response) develops within 2-4 weeks, activating macrophages to kill the intracellular yeast through interferon-gamma and TNF-alpha signaling. This immune response produces granulomatous inflammation: epithelioid macrophages, multinucleated giant cells, and a rim of lymphocytes form organized granulomas that contain but do not completely eradicate the organism. Granulomas may calcify over time, producing the characteristic calcified pulmonary nodules and mediastinal lymph nodes seen on chest radiography in previously infected individuals. Approximately 95 percent of infections in immunocompetent individuals are asymptomatic or produce a mild self-limited flu-like illness (fever, cough, fatigue, myalgias) lasting 2-4 weeks. Acute pulmonary histoplasmosis can occur with heavy inoculum exposure, presenting with fever, non-productive cough, chest pain, and bilateral reticulonodular infiltrates on chest X-ray. Chronic cavitary pulmonary histoplasmosis resembles tuberculosis clinically and radiographically, occurring primarily in patients with underlying emphysema or COPD, presenting with chronic cough, weight loss, night sweats, and upper lobe fibrocavitary disease. Progressive disseminated histoplasmosis (PDH) is the most severe form, occurring almost exclusively in immunocompromised patients (especially HIV/AIDS with CD4 counts below 150 cells/microliter, organ transplant recipients, and patients on TNF-alpha inhibitors). PDH presents with fever, weight loss, hepatosplenomegaly, pancytopenia (from bone marrow involvement), mucocutaneous ulcers (oral and pharyngeal), and adrenal insufficiency (from bilateral adrenal involvement in approximately 50% of disseminated cases). Diagnosis of histoplasmosis employs several modalities. Histoplasma urine and serum antigen testing (enzyme immunoassay) is most useful in disseminated disease and acute pulmonary histoplasmosis with high fungal burden, with sensitivity exceeding 90 percent in disseminated disease. Cross-reactivity with Blastomyces and Paracoccidioides antigens can produce false positives. Histoplasma antibody testing (complement fixation and immunodiffusion) is useful in subacute and chronic forms but may be negative in immunocompromised patients who cannot mount an antibody response. Culture of clinical specimens (blood, bone marrow, respiratory secretions) on Sabouraud agar requires 2-6 weeks for growth. Tissue biopsy with GMS staining reveals characteristic small (2-4 micrometer) oval yeast forms within macrophages. The practical nurse must understand that histoplasmosis can mimic tuberculosis, sarcoidosis, and malignancy on imaging and clinical presentation, making awareness of endemic areas and exposure history essential for accurate diagnosis."
    },
    riskFactors: [
      "Residence in or travel to endemic regions (Ohio and Mississippi River Valleys, Central America, parts of Africa and Southeast Asia)",
      "Exposure to bird droppings (starlings, blackbirds, pigeons) or bat guano through occupational or recreational activities",
      "Spelunking (cave exploration) in areas with bat populations (bat guano is the richest source of Histoplasma in the environment)",
      "Immunosuppression: HIV/AIDS with CD4 below 150, organ transplant recipients, TNF-alpha inhibitor therapy, high-dose corticosteroids",
      "Construction, demolition, or excavation work in endemic areas that disturbs contaminated soil and aerosolizes microconidia",
      "Farming or poultry work (chicken coops accumulate droppings that enrich soil with Histoplasma)",
      "Chronic obstructive pulmonary disease or emphysema (pre-existing structural lung damage predisposes to chronic cavitary histoplasmosis)"
    ],
    diagnostics: [
      "Histoplasma urine antigen (enzyme immunoassay): most sensitive test for acute and disseminated histoplasmosis (sensitivity above 90% in disseminated disease); useful for monitoring treatment response as antigen levels decline with successful therapy",
      "Histoplasma serum antigen: complements urine antigen testing; useful in acute pulmonary and disseminated disease; cross-reactivity with Blastomyces and Paracoccidioides antigens can cause false positives",
      "Histoplasma antibody testing (complement fixation and immunodiffusion): useful in subacute and chronic forms; titers 1:32 or greater suggest active disease; H and M precipitin bands on immunodiffusion have diagnostic significance",
      "Chest radiography and CT: acute infection shows bilateral hilar lymphadenopathy and diffuse reticulonodular infiltrates; chronic form shows upper lobe fibrocavitary disease mimicking tuberculosis; calcified granulomas indicate prior infection",
      "Fungal blood culture and bone marrow culture: gold standard for disseminated disease but requires 2-6 weeks for growth on Sabouraud agar; lysis-centrifugation method improves sensitivity",
      "Tissue biopsy with GMS (Grocott methenamine silver) stain: reveals characteristic small (2-4 micrometer) oval yeast forms with narrow-based budding within macrophages; distinguishes from Blastomyces (larger, broad-based budding)"
    ],
    management: [
      "Mild acute pulmonary histoplasmosis in immunocompetent patients is self-limited and typically requires no antifungal therapy; supportive care with rest, hydration, and symptom management",
      "Moderate to severe acute pulmonary histoplasmosis: initiate itraconazole 200 mg three times daily for 3 days (loading dose), then 200 mg twice daily for 6-12 weeks as prescribed",
      "Disseminated histoplasmosis: initiate amphotericin B lipid formulation for initial 1-2 weeks of induction therapy for severely ill patients, followed by step-down to itraconazole for total 12 months of treatment",
      "Monitor itraconazole serum trough levels (target above 1 mcg/mL) to ensure therapeutic concentrations; sub-therapeutic levels are a common cause of treatment failure",
      "Monitor Histoplasma urine antigen levels during treatment to assess response; declining levels indicate successful therapy; rising levels suggest relapse or treatment failure",
      "Initiate antiretroviral therapy in HIV-positive patients with disseminated histoplasmosis, but delay 4-6 weeks after starting antifungal therapy to reduce risk of immune reconstitution inflammatory syndrome (IRIS)",
      "Screen patients from endemic areas who are about to start immunosuppressive therapy (TNF-alpha inhibitors, transplant medications) for prior Histoplasma exposure; consider antifungal prophylaxis"
    ],
    nursingActions: [
      "Obtain detailed exposure history: ask about residence in endemic areas, occupational activities (farming, construction, demolition), recreational exposures (cave exploration, birdwatching near roosts), and recent travel",
      "Monitor vital signs and respiratory status every 4 hours; report progressive dyspnea, increasing oxygen requirements, or hemoptysis which may indicate worsening pulmonary involvement",
      "Administer itraconazole with a full meal or acidic beverage (cola) to maximize absorption; the capsule form requires gastric acid for absorption -- proton pump inhibitors significantly reduce bioavailability",
      "Monitor and report signs of adrenal insufficiency in disseminated histoplasmosis: unexplained hypotension, weakness, weight loss, hyperpigmentation, hyponatremia, and hyperkalemia",
      "Collect and properly handle specimens for Histoplasma testing: urine antigen (first morning void preferred), blood cultures (lysis-centrifugation tubes), and sputum (induced if necessary)",
      "Assess for hepatosplenomegaly on abdominal assessment; document liver span and splenic size; report increasing organomegaly as it may indicate disease progression or treatment failure",
      "Educate patients about exposure prevention: wear N95 respirators when disturbing soil in endemic areas, wet down surfaces before excavation to reduce aerosolization, avoid entering caves with bat populations"
    ],
    assessmentFindings: [
      "Flu-like illness with fever, non-productive cough, fatigue, myalgias, and chest pain lasting 2-4 weeks (acute pulmonary histoplasmosis in immunocompetent host)",
      "Bilateral hilar lymphadenopathy and diffuse reticulonodular infiltrates on chest X-ray (acute pulmonary histoplasmosis with heavy exposure)",
      "Chronic cough, weight loss, night sweats, and upper lobe fibrocavitary disease on imaging (chronic cavitary histoplasmosis mimicking tuberculosis)",
      "Hepatosplenomegaly, pancytopenia, fever, and oral/pharyngeal ulcers (progressive disseminated histoplasmosis in immunocompromised patients)",
      "Calcified pulmonary nodules and mediastinal lymph nodes on imaging (evidence of prior resolved Histoplasma infection with granuloma calcification)",
      "Adrenal insufficiency findings: hypotension, hyponatremia, hyperkalemia, weakness, and hyperpigmentation (bilateral adrenal involvement in disseminated disease)"
    ],
    signs: {
      left: [
        "Low-grade fever with dry cough lasting more than 2 weeks",
        "Fatigue, malaise, and mild myalgias",
        "Mild hilar lymphadenopathy on chest radiograph",
        "Erythema nodosum (tender red nodules on shins)",
        "Mildly elevated erythrocyte sedimentation rate (ESR)",
        "History of exposure to bird/bat droppings in endemic area"
      ],
      right: [
        "High fever with pancytopenia and hepatosplenomegaly (disseminated disease)",
        "Respiratory failure requiring supplemental oxygen or ventilatory support",
        "Oral or pharyngeal ulcers with painful swallowing (mucocutaneous dissemination)",
        "Hemodynamic instability from adrenal crisis (bilateral adrenal infiltration)",
        "Mediastinal fibrosis causing superior vena cava syndrome (late complication)",
        "CNS histoplasmosis with meningitis, focal neurological deficits, or altered consciousness"
      ]
    },
    medications: [
      {
        name: "Itraconazole (Sporanox)",
        type: "Triazole antifungal",
        action: "Inhibits fungal cytochrome P450-dependent lanosterol 14-alpha-demethylase (CYP51), blocking ergosterol synthesis and disrupting fungal cell membrane integrity; first-line oral therapy for mild to moderate histoplasmosis and step-down therapy after amphotericin B induction for severe disease",
        sideEffects: "Nausea, diarrhea, abdominal pain, headache; hepatotoxicity (monitor LFTs monthly); negative inotropic effect (contraindicated in heart failure); hypokalemia; peripheral neuropathy with prolonged use; edema",
        contra: "Congestive heart failure or ventricular dysfunction (negative inotropic effect can worsen cardiac function); concurrent use with certain statins (simvastatin, lovastatin -- rhabdomyolysis risk); pregnancy (teratogenic); concurrent use with CYP3A4 substrates that prolong QT interval",
        pearl: "CAPSULE formulation requires ACIDIC gastric environment for absorption -- take with a full meal and cola or orange juice; PPIs and H2 blockers dramatically reduce capsule absorption; SOLUTION formulation is better absorbed on an empty stomach; therapeutic drug monitoring (trough above 1 mcg/mL) is essential to ensure efficacy"
      },
      {
        name: "Amphotericin B Lipid Formulation (AmBisome/Abelcet)",
        type: "Polyene antifungal",
        action: "Binds to ergosterol in the fungal cell membrane, creating transmembrane pores that allow leakage of essential intracellular ions (potassium, sodium), leading to osmotic disruption and cell death; lipid formulations deliver higher drug concentrations to reticuloendothelial organs (liver, spleen) while reducing nephrotoxicity compared to conventional amphotericin B deoxycholate",
        sideEffects: "Nephrotoxicity (less than conventional formulation but still requires monitoring), infusion-related reactions (fever, rigors, chills, nausea), hypokalemia, hypomagnesemia, anemia, phlebitis at infusion site",
        contra: "Known hypersensitivity; concurrent use with other nephrotoxic drugs (aminoglycosides, cyclosporine, cisplatin); dehydration (pre-hydrate before infusion); severe electrolyte imbalances",
        pearl: "Reserved for SEVERE or disseminated histoplasmosis as induction therapy (1-2 weeks) before step-down to itraconazole; pre-medicate with acetaminophen and diphenhydramine to reduce infusion reactions; monitor creatinine daily and potassium/magnesium twice weekly; administer 1 L normal saline before each dose to protect kidneys"
      },
      {
        name: "Fluconazole (Diflucan)",
        type: "Triazole antifungal (alternative agent)",
        action: "Inhibits fungal CYP51 (lanosterol 14-alpha-demethylase), blocking ergosterol synthesis; used as an alternative to itraconazole for histoplasmosis in patients who cannot tolerate itraconazole or when drug interactions preclude its use; excellent CNS penetration makes it the preferred agent for Histoplasma meningitis",
        sideEffects: "Nausea, headache, abdominal pain, diarrhea; hepatotoxicity (monitor liver function tests); QT prolongation; alopecia with high doses; teratogenic in first trimester",
        contra: "Concurrent use with QT-prolonging drugs (terfenadine, cisapride); pregnancy (teratogenic); severe hepatic disease; known hypersensitivity to azole antifungals",
        pearl: "Fluconazole is LESS effective than itraconazole for pulmonary and disseminated histoplasmosis but is preferred for Histoplasma MENINGITIS due to excellent CSF penetration (80% of serum levels); higher doses (800 mg daily) are used for CNS disease; unlike itraconazole, absorption is NOT affected by gastric pH"
      }
    ],
    pearls: [
      "Histoplasmosis is endemic to the Ohio and Mississippi River Valleys -- ALWAYS ask about geographic exposure history and occupational/recreational activities involving soil disturbance, bird roosts, or bat caves in patients with compatible symptoms",
      "Histoplasma capsulatum is a dimorphic fungus: mold in the cold (environment at 25C) and yeast in the heat (body temperature at 37C) -- the yeast form survives inside macrophages by preventing phagolysosome fusion",
      "Itraconazole CAPSULES require gastric acid for absorption -- administer with a full meal and acidic beverage (cola); proton pump inhibitors and H2 blockers dramatically reduce absorption and can cause treatment failure",
      "Disseminated histoplasmosis can cause adrenal insufficiency in approximately 50% of cases through bilateral adrenal infiltration -- monitor for unexplained hypotension, hyponatremia, and hyperkalemia",
      "Chronic cavitary histoplasmosis mimics tuberculosis both clinically and radiographically (upper lobe cavitary disease, weight loss, night sweats) -- always consider both diagnoses in patients from endemic areas",
      "Histoplasma urine antigen testing is the most sensitive rapid diagnostic test for disseminated disease (sensitivity above 90%) and is valuable for monitoring treatment response -- declining antigen levels indicate successful therapy",
      "Calcified granulomas in the lungs and mediastinal lymph nodes on imaging indicate prior Histoplasma exposure and do not require treatment, but may reactivate with future immunosuppression -- document this finding for future reference"
    ],
    quiz: [
      {
        question: "A practical nurse is admitting a patient from rural Ohio who presents with fever, dry cough, and bilateral hilar lymphadenopathy on chest X-ray. Which exposure history question is most important to ask?",
        options: [
          "Have you been in contact with anyone who has tuberculosis?",
          "Have you recently been exposed to bird droppings, bat caves, or construction/demolition activities?",
          "Do you own any domestic pets?",
          "Have you recently traveled to a tropical island?"
        ],
        correct: 1,
        rationale: "Histoplasma capsulatum is endemic to the Ohio and Mississippi River Valleys and thrives in soil enriched with bird droppings and bat guano. Activities that disturb contaminated soil (construction, demolition, cave exploration, cleaning chicken coops) aerosolize the infectious microconidia. Obtaining this exposure history is critical for suspecting histoplasmosis."
      },
      {
        question: "A patient with disseminated histoplasmosis is prescribed itraconazole capsules. Which nursing instruction is most important for proper administration?",
        options: [
          "Take on an empty stomach with a glass of water",
          "Take with a full meal and an acidic beverage such as cola to maximize absorption",
          "Take at bedtime with an antacid to prevent nausea",
          "Crush the capsule and mix with applesauce for easier swallowing"
        ],
        correct: 1,
        rationale: "Itraconazole capsules require an acidic gastric environment for proper dissolution and absorption. Taking with a full meal stimulates gastric acid secretion, and an acidic beverage (cola, orange juice) further enhances absorption. Proton pump inhibitors and H2 blockers dramatically reduce capsule absorption and can lead to treatment failure."
      },
      {
        question: "A patient being treated for disseminated histoplasmosis develops unexplained hypotension, weakness, and laboratory findings of hyponatremia and hyperkalemia. The practical nurse should suspect which complication?",
        options: [
          "Drug-induced hepatotoxicity from itraconazole",
          "Adrenal insufficiency from bilateral adrenal infiltration by Histoplasma",
          "Amphotericin B-induced nephrotoxicity",
          "Hypovolemic shock from gastrointestinal fluid losses"
        ],
        correct: 1,
        rationale: "Disseminated histoplasmosis causes bilateral adrenal infiltration in approximately 50% of cases, leading to adrenal insufficiency. The classic presentation includes unexplained hypotension, weakness, hyponatremia (impaired aldosterone and cortisol production), and hyperkalemia (impaired aldosterone-mediated potassium excretion). This requires urgent cortisol level testing and possible corticosteroid replacement."
      }
    ]
  }
};

console.log("Injecting Batch 20 (Infection/Immune) lessons...");
let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`Done. Injected ${count}/${Object.keys(lessons).length} lessons.`);
