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
    let c = fs.readFileSync(fp, "utf8");
    const marker = `"${id}":`;
    const idx = c.indexOf(marker);
    if (idx === -1) continue;
    if (!c.slice(idx, idx + 300).includes("[WRITE YOUR")) continue;
    let bc = 0, es = idx + marker.length;
    while (es < c.length && c[es] !== "{") es++;
    let start = es;
    for (let i = start; i < c.length; i++) {
      if (c[i] === "{") bc++;
      else if (c[i] === "}") { bc--; if (bc === 0) { es = i + 1; break; } }
    }
    const newBlock = `{\n    ${buildLS(lesson)}\n  }`;
    c = c.slice(0, start) + newBlock + c.slice(es);
    fs.writeFileSync(fp, c, "utf8");
    console.log(`Injected ${id} in ${file}`);
    return true;
  }
  console.log(`NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {

"aplastic-anemia-rpn": {
  title: "Aplastic Anemia",
  cellular: {
    title: "Pathophysiology of Aplastic Anemia",
    content: "Aplastic anemia is a rare but serious bone marrow failure syndrome characterised by pancytopenia (simultaneous reduction of all three blood cell lines: red blood cells, white blood cells, and platelets) resulting from destruction or suppression of haematopoietic stem cells in the bone marrow. The bone marrow, which is normally packed with blood-forming cells, becomes hypocellular and replaced by fat. This results in profoundly inadequate production of all mature blood cells.\n\nThe pathophysiology involves immune-mediated destruction of haematopoietic stem and progenitor cells. In most acquired cases (approximately 70-80%), autoreactive cytotoxic T lymphocytes (CD8+ T cells) attack and destroy bone marrow stem cells through direct cytotoxicity and production of inhibitory cytokines (interferon-gamma, TNF-alpha). These cytokines suppress stem cell proliferation and induce apoptosis. The trigger for this autoimmune attack is often unknown (idiopathic aplastic anemia), but identified triggers include certain medications (chloramphenicol, carbamazepine, phenytoin, sulfonamides, NSAIDs), chemical exposures (benzene, pesticides, organic solvents), viral infections (hepatitis, Epstein-Barr virus, HIV, parvovirus B19), and radiation exposure.\n\nThe consequences of pancytopenia are predictable from each cell line deficiency. Anemia (low red blood cells) causes fatigue, pallor, dyspnoea, tachycardia, and reduced oxygen-carrying capacity. Leukopenia, specifically neutropenia (low neutrophils, the primary defense against bacterial and fungal infections), creates severe infection susceptibility. When the absolute neutrophil count (ANC) falls below 500 cells/microlitre, the patient is considered severely neutropenic and at high risk for life-threatening infections. Thrombocytopenia (low platelets) causes bleeding tendency: petechiae, purpura, ecchymosis, epistaxis, gingival bleeding, menorrhagia, and in severe cases, life-threatening haemorrhage.\n\nSeverity classification is based on the degree of cytopenias: severe aplastic anemia (SAA) is defined as bone marrow cellularity less than 25% PLUS at least two of the following - ANC less than 500, platelet count less than 20,000, and reticulocyte count less than 20,000. Very severe aplastic anemia (VSAA) meets SAA criteria with ANC less than 200. This classification guides treatment decisions.\n\nInherited forms include Fanconi anemia (autosomal recessive DNA repair defect presenting in childhood with congenital anomalies, progressive bone marrow failure, and cancer predisposition) and dyskeratosis congenita (telomere maintenance disorder). These congenital causes are important to distinguish because they require different treatment approaches.\n\nFor the RPN, the critical priorities are: infection prevention and surveillance in neutropenic patients, bleeding precautions for thrombocytopenic patients, safe blood product administration, monitoring for transfusion reactions, supporting patients through potentially lengthy treatment courses (immunosuppressive therapy or bone marrow transplantation), and recognising that even minor infections or bleeding can become life-threatening in these patients."
  },
  riskFactors: [
    "Exposure to toxic chemicals: benzene (industrial solvents, petroleum products), pesticides, herbicides, and organic solvents - occupational history is important",
    "Certain medications: chloramphenicol, carbamazepine, phenytoin, sulfonamides, gold compounds, and some NSAIDs - drug-induced aplastic anemia may be dose-dependent or idiosyncratic",
    "Viral infections: hepatitis (particularly non-A, non-B, non-C seronegative hepatitis), Epstein-Barr virus, HIV, parvovirus B19, cytomegalovirus",
    "Radiation exposure: therapeutic radiation, accidental exposure, or occupational exposure",
    "Autoimmune diseases: systemic lupus erythematosus, rheumatoid arthritis, and other autoimmune conditions (shared immunological mechanisms)",
    "Pregnancy: rare trigger, usually resolves after delivery but may recur in subsequent pregnancies",
    "Inherited conditions: Fanconi anemia (childhood onset with congenital anomalies), dyskeratosis congenita, Shwachman-Diamond syndrome",
    "Age distribution: bimodal peaks in young adults (15-25 years) and older adults (over 60 years)",
    "Geographic variation: 2-3 times higher incidence in Asia compared to Western countries (possibly environmental or genetic factors)"
  ],
  diagnostics: [
    "CBC with differential: pancytopenia - anaemia (low haemoglobin and haematocrit), leukopenia with neutropenia (low ANC is the most critical value), thrombocytopenia; reticulocyte count is inappropriately LOW (the bone marrow is not compensating)",
    "Peripheral blood smear: normocytic normochromic anaemia with decreased reticulocytes; leukopenia with relative lymphocytosis (lymphocyte percentage increases as neutrophils decrease); low platelet count; absence of abnormal cells (blasts would suggest leukaemia)",
    "Bone marrow biopsy (definitive diagnostic test): hypocellular marrow with increased fat spaces replacing normal haematopoietic tissue; cellularity less than 25% for age in severe aplastic anemia; essential to differentiate from myelodysplastic syndrome or leukaemia",
    "Flow cytometry: rules out paroxysmal nocturnal haemoglobinuria (PNH), which can present with pancytopenia and frequently coexists with aplastic anemia",
    "Cytogenetic studies: karyotyping to exclude myelodysplastic syndrome or inherited bone marrow failure syndromes; chromosomal breakage testing for suspected Fanconi anemia",
    "Viral serology: hepatitis A/B/C panel, HIV, EBV, CMV, parvovirus B19 to identify viral triggers",
    "Iron studies, vitamin B12, and folate levels: exclude nutritional deficiencies that can cause pancytopenia",
    "Liver function tests and renal function: baseline organ function assessment and identification of hepatitis-associated aplastic anemia"
  ],
  management: [
    "Haematopoietic stem cell transplantation (HSCT/bone marrow transplant): the only CURATIVE treatment; first-line for severe aplastic anemia in patients under 40 with a matched sibling donor; offers 75-90% long-term survival; requires myeloablative conditioning with cyclophosphamide and anti-thymocyte globulin",
    "Immunosuppressive therapy (IST): first-line for patients who are not transplant candidates (older patients, no matched donor); combination of horse anti-thymocyte globulin (ATG) + cyclosporine A + eltrombopag; overall response rate 60-70%; some patients relapse and may require retreatment or transplant",
    "Supportive care with blood product transfusions: packed red blood cell transfusions for symptomatic anaemia (typically when haemoglobin falls below 70-80 g/L); platelet transfusions for bleeding or prophylactically when platelet count is below 10,000; use leukoreduced and irradiated products for transplant candidates to prevent alloimmunisation",
    "Infection prevention and management: neutropenic precautions, prophylactic antifungals and antivirals, prompt broad-spectrum antibiotics for fever (neutropenic fever is a medical emergency - antibiotics within 1 hour)",
    "Growth factors: eltrombopag (thrombopoietin receptor agonist) stimulates haematopoietic stem cell proliferation and has shown benefit in combination with IST; G-CSF may be used short-term for severe infections but is not standard maintenance therapy",
    "Iron chelation therapy: for patients requiring chronic transfusions who develop iron overload (ferritin consistently above 1000 ng/mL); deferoxamine or deferasirox to prevent iron-related organ damage"
  ],
  nursingActions: [
    "Monitor CBC results daily or as ordered; report critically low values immediately: ANC less than 500 (severe neutropenia), platelets less than 20,000 (high bleeding risk), haemoglobin below 70 g/L (symptomatic anaemia requiring transfusion)",
    "Implement strict neutropenic precautions: private room, rigorous hand hygiene (the single most important intervention), no fresh flowers or plants (harbour Aspergillus), no uncooked fruits/vegetables (neutropenic diet), limit visitors, screen visitors for illness, mask patient when leaving the room",
    "Implement bleeding precautions for thrombocytopenia: soft-bristle toothbrush only, electric razor (no blade razors), no rectal temperatures or suppositories, avoid IM injections, apply pressure to venipuncture sites for 5-10 minutes, assess for petechiae/purpura/ecchymosis daily, monitor stool and urine for occult blood",
    "Monitor temperature at minimum every 4 hours; a single oral temperature of 38.3 C (101 F) or sustained temperature of 38.0 C (100.4 F) for 1 hour in a neutropenic patient constitutes neutropenic fever - a medical emergency requiring blood cultures and IV broad-spectrum antibiotics within 1 hour",
    "Administer blood products safely: verify physician order, check blood product against patient identification and blood bank records with two nurses, use appropriate filter and tubing, monitor vital signs per protocol (baseline, 15 minutes, 30 minutes, then hourly), observe for transfusion reactions",
    "Educate patients about infection prevention at home: hand hygiene, avoiding crowds and sick contacts, food safety (cook all meats thoroughly, wash produce), daily temperature monitoring, recognising signs of infection to report immediately",
    "Provide psychosocial support: aplastic anemia diagnosis is frightening and treatment (transplant or prolonged immunosuppression) is lengthy and uncertain; encourage patient and family to express concerns, connect with support groups, and maintain realistic hope"
  ],
  assessmentFindings: [
    "Fatigue, weakness, dyspnoea on exertion, and pallor from anaemia; tachycardia and orthostatic hypotension in severe anaemia",
    "Frequent or recurrent infections: oral candidiasis, pneumonia, skin infections, urinary tract infections; infections may present atypically in neutropenic patients (absent pus formation due to lack of neutrophils)",
    "Bleeding manifestations from thrombocytopenia: petechiae (pinpoint red spots, especially on lower extremities and pressure points), purpura, ecchymosis, epistaxis, gingival bleeding, heavy menstrual periods, prolonged bleeding from minor cuts",
    "Fever: may be the ONLY sign of infection in neutropenic patients (other classic signs such as pus, localised redness, and swelling may be absent due to insufficient white cells)",
    "Hepatomegaly and splenomegaly: may be present, particularly in cases associated with viral hepatitis",
    "No lymphadenopathy (unlike leukaemia, which often presents with enlarged lymph nodes)"
  ],
  signs: {
    left: [
      "Progressive fatigue and exercise intolerance",
      "Pallor of skin, conjunctivae, and nail beds",
      "Scattered petechiae on extremities",
      "Recurrent minor infections",
      "Mild tachycardia on exertion"
    ],
    right: [
      "Neutropenic fever (ANC less than 500 with temp 38.3 C or higher)",
      "Spontaneous mucosal or intracranial haemorrhage",
      "Severe sepsis with hemodynamic instability",
      "Frank bleeding (GI, GU, or gingival)",
      "Altered mental status from severe anaemia or CNS bleeding"
    ]
  },
  medications: [
    {
      name: "Cyclosporine A (Neoral, Sandimmune)",
      type: "Calcineurin inhibitor / immunosuppressant (oral)",
      action: "Suppresses T-lymphocyte activation by inhibiting calcineurin, a phosphatase required for IL-2 transcription; reduces the autoimmune destruction of haematopoietic stem cells; used in combination with ATG as first-line immunosuppressive therapy for aplastic anemia; typical dose 5-6 mg/kg/day divided into two doses, adjusted to trough levels",
      sideEffects: "Nephrotoxicity (dose-dependent, monitor creatinine and BUN), hypertension, tremor, headache, gingival hyperplasia, hirsutism, hypomagnesaemia, hyperkalaemia, increased infection risk, hepatotoxicity; long-term use increases malignancy risk",
      contra: "Uncontrolled hypertension, severe renal dysfunction, concomitant nephrotoxic drugs; avoid live vaccines during therapy; drug interactions are extensive (metabolised by CYP3A4 - grapefruit juice increases levels)",
      pearl: "Trough level monitoring is ESSENTIAL: draw levels just before the morning dose (12 hours after the previous dose). Target trough 150-250 ng/mL for aplastic anemia. Administer consistently with regard to timing and food. Avoid grapefruit and grapefruit juice as they dramatically increase cyclosporine levels. Monitor blood pressure and renal function at every visit. The Neoral formulation has better absorption than Sandimmune - they are NOT interchangeable."
    },
    {
      name: "Anti-Thymocyte Globulin - Horse (Atgam)",
      type: "Polyclonal immunoglobulin / immunosuppressant (IV infusion)",
      action: "Polyclonal antibodies derived from horses immunised with human thymocytes; causes depletion and modulation of T lymphocytes responsible for immune-mediated bone marrow destruction; administered as IV infusion over 4-6 hours daily for 4 consecutive days as part of first-line IST for aplastic anemia",
      sideEffects: "Anaphylaxis and serum sickness (fever, rash, arthralgias, proteinuria occurring 7-14 days after treatment), chills, rigors, fever during infusion, thrombocytopenia, leukopenia (expected immunosuppressive effect), hypotension",
      contra: "Known hypersensitivity to horse proteins; intradermal skin test MUST be performed before first dose to assess for anaphylaxis risk; must have resuscitation equipment available during infusion",
      pearl: "A skin test (intradermal injection of diluted ATG) MUST be performed before the first dose - observe for 15-30 minutes for a wheal and flare reaction. Pre-medicate with methylprednisolone, diphenhydramine, and acetaminophen to reduce infusion reactions. Administer through a central line or high-flow peripheral IV with an in-line filter. Monitor vital signs every 15 minutes during the first hour, then every 30 minutes. Watch for delayed serum sickness 7-14 days post-treatment."
    },
    {
      name: "Eltrombopag (Revolade/Promacta)",
      type: "Thrombopoietin receptor agonist (oral)",
      action: "Binds to the thrombopoietin receptor on haematopoietic stem cells, stimulating proliferation and differentiation of megakaryocytes (platelet-producing cells) and, importantly in aplastic anemia, also stimulating multi-lineage haematopoiesis (can improve all three cell lines, not just platelets); now included in first-line IST protocols for severe aplastic anemia",
      sideEffects: "Hepatotoxicity (monitor liver function tests every 2 weeks during dose adjustment, then monthly), nausea, diarrhoea, cataracts (regular ophthalmological monitoring recommended), thromboembolic events (rare), bone marrow fibrosis with long-term use (monitor with periodic bone marrow biopsies)",
      contra: "Severe hepatic impairment; use with caution in patients with risk factors for thromboembolism; monitor for cataracts; dose adjustment required for East Asian patients (different pharmacokinetics)",
      pearl: "Must be taken on an EMPTY stomach: at least 1 hour before OR 2 hours after a meal. Do NOT take within 4 hours of calcium-rich foods (dairy), antacids, or minerals containing calcium, iron, magnesium, aluminium, selenium, or zinc as they chelate the drug and dramatically reduce absorption. Monitor liver function closely. In aplastic anemia, this drug has shown the ability to improve not just platelets but also haemoglobin and neutrophil counts, making it a valuable addition to IST."
    }
  ],
  pearls: [
    "Neutropenic fever is a MEDICAL EMERGENCY: a single temperature of 38.3 C (101 F) or sustained 38.0 C (100.4 F) for 1 hour in a patient with ANC less than 500 requires blood cultures and IV broad-spectrum antibiotics (typically piperacillin-tazobactam or cefepime) within 1 HOUR - never delay antibiotics waiting for culture results",
    "Hand hygiene is the SINGLE most important intervention for preventing infection in neutropenic patients - this applies to all healthcare providers, visitors, and the patient themselves",
    "In neutropenic patients, classic signs of infection (pus, redness, swelling) may be ABSENT because these are inflammatory responses mediated by white blood cells that the patient lacks - fever may be the ONLY sign of serious infection",
    "Bleeding precautions for thrombocytopenic patients: soft toothbrush, electric razor, no rectal temperatures or suppositories, apply pressure for at least 5 minutes after venipuncture, avoid IM injections and aspirin/NSAIDs, assess for new petechiae and bruising daily",
    "Blood product safety: always verify patient identity and blood product with two qualified nurses before administration; monitor vital signs at baseline, 15 minutes, 30 minutes, and hourly; most acute transfusion reactions occur within the first 15 minutes - stay with the patient",
    "For transplant candidates, minimise blood product transfusions to reduce alloimmunisation risk; always use leukoreduced and irradiated blood products; avoid transfusions from family members who may be potential donors",
    "Aplastic anemia is distinct from iron-deficiency anaemia: iron supplements are NOT the treatment and can be harmful if the patient is receiving chronic transfusions (risk of iron overload); educate patients and families about this distinction"
  ],
  quiz: [
    {
      question: "A patient with aplastic anemia has an absolute neutrophil count (ANC) of 300 cells/microlitre and develops a temperature of 38.5 C. Which action should the nurse take FIRST?",
      options: [
        "Administer acetaminophen for fever reduction and reassess in 1 hour",
        "Obtain blood cultures and notify the provider for immediate initiation of IV broad-spectrum antibiotics",
        "Increase oral fluid intake and apply cooling measures while monitoring temperature trends",
        "Obtain a chest X-ray and urinalysis before contacting the healthcare provider"
      ],
      correct: 1,
      rationale: "This patient has neutropenic fever (ANC less than 500 with temperature 38.3 C or higher), which is a medical emergency. The priority is to obtain blood cultures (before antibiotics if possible) and initiate IV broad-spectrum antibiotics within 1 hour. Delaying antibiotics for additional diagnostics, administering only antipyretics, or waiting to see if the fever resolves can result in rapidly fatal sepsis in neutropenic patients."
    },
    {
      question: "Which precaution is MOST important for the nurse to implement for a patient with aplastic anemia whose platelet count is 15,000/microlitre?",
      options: [
        "Restrict all physical activity and enforce strict bed rest",
        "Administer iron supplements to promote platelet production",
        "Use a soft-bristle toothbrush, electric razor, and avoid rectal procedures or IM injections",
        "Apply compression stockings to prevent deep vein thrombosis"
      ],
      correct: 2,
      rationale: "A platelet count of 15,000 places the patient at significant risk for spontaneous bleeding. Bleeding precautions include using a soft-bristle toothbrush, electric razor (to prevent cuts), avoiding rectal temperatures, suppositories, and IM injections, applying prolonged pressure after venipuncture, and monitoring for petechiae and bleeding. Iron supplements do not increase platelet production. Strict bed rest is not necessary but activities with injury risk should be avoided."
    },
    {
      question: "The nurse is caring for a patient receiving a packed red blood cell transfusion for aplastic anemia. Fifteen minutes into the transfusion, the patient develops fever, chills, and low back pain. What should the nurse do FIRST?",
      options: [
        "Slow the infusion rate and administer diphenhydramine",
        "Stop the transfusion immediately and keep the IV line open with normal saline",
        "Continue the transfusion and monitor for additional symptoms",
        "Administer acetaminophen and reassess after 30 minutes"
      ],
      correct: 1,
      rationale: "Fever, chills, and low back pain during a blood transfusion are signs of a possible acute haemolytic transfusion reaction - the most serious type of transfusion reaction. The nurse must STOP the transfusion IMMEDIATELY, maintain IV access with normal saline (never flush the blood tubing contents into the patient), monitor vital signs, notify the healthcare provider and blood bank, and return the blood product and tubing for testing. Continuing or slowing the infusion risks fatal complications."
    }
  ]
},

"hemophilia-basics-rpn": {
  title: "Hemophilia Basics",
  cellular: {
    title: "Pathophysiology of Hemophilia",
    content: "Hemophilia is a group of inherited bleeding disorders caused by deficiency or dysfunction of specific clotting factors in the coagulation cascade. The two most common types are hemophilia A (classic hemophilia, deficiency of factor VIII) and hemophilia B (Christmas disease, deficiency of factor IX). Hemophilia A accounts for approximately 80% of cases, while hemophilia B accounts for approximately 20%.\n\nBoth hemophilia A and B are X-linked recessive disorders. The genes for factor VIII and factor IX are located on the X chromosome. Because males have only one X chromosome (XY), a single mutated gene causes disease expression. Females have two X chromosomes (XX), so a mutation on one X is typically compensated by the normal gene on the other - making females carriers rather than affected individuals. However, carrier females can have mildly reduced factor levels and may experience increased bleeding with surgery or trauma. In rare cases, females can be affected through homozygosity, Turner syndrome (45,X), or extreme X-inactivation.\n\nThe normal coagulation cascade involves a sequential activation of clotting factors through the intrinsic and extrinsic pathways, converging at the common pathway to form a stable fibrin clot. Factor VIII (hemophilia A) is a cofactor in the intrinsic pathway that accelerates factor X activation by factor IXa. Factor IX (hemophilia B) is a serine protease in the intrinsic pathway that, together with factor VIIIa, activates factor X. Deficiency of either factor disrupts the intrinsic pathway, impairing thrombin generation and stable fibrin clot formation.\n\nSeverity is classified by the percentage of normal factor activity: severe (less than 1% of normal) causes spontaneous bleeding, particularly into joints (haemarthrosis) and muscles; moderate (1-5% of normal) causes prolonged bleeding after minor trauma and occasional spontaneous bleeding; mild (5-40% of normal) typically causes prolonged bleeding only with significant trauma or surgery, and may not be diagnosed until adulthood.\n\nHaemarthrosis (bleeding into joints) is the hallmark of severe hemophilia and the primary cause of disability. The most commonly affected joints are the knees, elbows, and ankles. Repeated bleeding into the same joint (target joint) causes progressive damage: synovial inflammation (synovitis), cartilage degradation, subchondral bone erosion, and ultimately chronic hemophilic arthropathy with severe pain, deformity, and disability. This is why prophylactic factor replacement to prevent bleeds (rather than only treating bleeds as they occur) has become the standard of care.\n\nIntracranial haemorrhage is the most feared and potentially fatal complication of hemophilia. Any head injury in a patient with hemophilia, no matter how minor it appears, requires immediate factor replacement BEFORE imaging or assessment results are available. This is a treat-first-ask-questions-later situation.\n\nFor the RPN, key responsibilities include: recognising bleeding episodes, administering factor replacement products, understanding that prolonged pressure and ice are first-line interventions for accessible bleeds, implementing safety measures to prevent bleeding, monitoring for complications of treatment (inhibitor development), and teaching families about emergency preparedness and home factor infusion."
  },
  riskFactors: [
    "Family history of hemophilia (X-linked recessive inheritance; approximately 70% of cases have a positive family history; 30% arise from new spontaneous mutations)",
    "Male sex (X-linked inheritance means males are affected; females are typically carriers with variable factor levels)",
    "Severity correlates with factor level: severe hemophilia (less than 1% factor activity) has the highest bleeding risk with spontaneous haemorrhage",
    "History of previous joint bleeds (target joints are predisposed to recurrent bleeding due to synovial inflammation and neovascularisation)",
    "Inadequate prophylactic factor replacement (patients not on regular prophylaxis have significantly more bleeding episodes)",
    "Surgical or dental procedures without appropriate factor replacement coverage",
    "High-risk physical activities, contact sports, and trauma (especially head injuries)",
    "Development of factor inhibitors (alloantibodies against infused factor concentrate, occurring in 25-30% of severe hemophilia A patients and 3-5% of hemophilia B patients, rendering standard factor replacement ineffective)"
  ],
  diagnostics: [
    "Activated partial thromboplastin time (aPTT/PTT): PROLONGED in hemophilia (reflects dysfunction in the intrinsic coagulation pathway where factors VIII and IX function); this is the key screening test",
    "Prothrombin time (PT/INR): NORMAL in hemophilia (the extrinsic pathway is intact because factor VII and tissue factor are unaffected)",
    "Platelet count: NORMAL in hemophilia (platelets are unaffected; the defect is in the coagulation cascade, not in primary haemostasis)",
    "Bleeding time: NORMAL in hemophilia (bleeding time measures platelet plug formation, which is normal; the defect is in secondary haemostasis)",
    "Specific factor assays: measure factor VIII activity (hemophilia A) and factor IX activity (hemophilia B); confirm diagnosis and classify severity: severe (less than 1%), moderate (1-5%), mild (5-40%)",
    "Mixing study: patient plasma is mixed with normal plasma; if the prolonged aPTT corrects, it indicates a factor deficiency (hemophilia); if it does not correct, it suggests the presence of an inhibitor (antibody against the factor)",
    "Inhibitor titre (Bethesda assay): quantifies the level of alloantibodies (inhibitors) against factor VIII or IX; expressed in Bethesda units (BU); high-titre inhibitors (greater than 5 BU) require bypass therapy rather than standard factor replacement",
    "Genetic testing: identifies the specific mutation in the factor VIII or IX gene; important for carrier detection and prenatal diagnosis in affected families"
  ],
  management: [
    "Factor replacement therapy: the cornerstone of hemophilia treatment; factor VIII concentrate for hemophilia A and factor IX concentrate for hemophilia B; can be plasma-derived or recombinant; administered IV as on-demand treatment for acute bleeds or as scheduled prophylaxis to prevent bleeding",
    "Prophylactic factor replacement: standard of care for severe hemophilia - regular IV factor infusions (typically 2-3 times per week for hemophilia A, 1-2 times per week for hemophilia B) to maintain trough factor levels above 1-3%, preventing spontaneous bleeds and protecting joints",
    "Emicizumab (Hemlibra): a bispecific monoclonal antibody that mimics the function of factor VIII by bridging factors IXa and X; administered subcutaneously every 1-4 weeks; revolutionised hemophilia A treatment, especially for patients with inhibitors; does NOT replace factor VIII in the blood, so factor VIII levels will appear low even on therapy",
    "RICE protocol for acute joint or muscle bleeds: Rest the affected area, Ice application (wrapped, 20 minutes on/off), Compression with elastic bandage, Elevation above heart level; combined with prompt factor replacement",
    "Desmopressin (DDAVP): useful for MILD hemophilia A only - releases stored factor VIII from endothelial cells, typically raising factor VIII levels 2-5 fold; NOT effective for hemophilia B; given IV, SC, or intranasally",
    "For patients with inhibitors: bypass therapy using activated prothrombin complex concentrate (FEIBA/aPCC) or recombinant factor VIIa (NovoSeven) to achieve haemostasis through alternative pathways; immune tolerance induction (ITI) protocols attempt to eradicate inhibitors through regular high-dose factor exposure",
    "Avoid aspirin, NSAIDs, and IM injections - these increase bleeding risk; acetaminophen is the preferred analgesic; COX-2 inhibitors may be used cautiously when anti-inflammatory effect is needed"
  ],
  nursingActions: [
    "Recognise and assess bleeding episodes promptly: joint bleeds (haemarthrosis) present as pain, warmth, swelling, and decreased range of motion in the affected joint; muscle bleeds present as pain, swelling, and sometimes compartment syndrome signs; internal bleeding may present only as pain, pallor, and tachycardia",
    "Administer factor replacement products as ordered: verify the correct factor (VIII for hemophilia A, IX for hemophilia B), calculate dose based on patient weight and target level, reconstitute per manufacturer instructions, administer IV at the prescribed rate, document lot number and expiration date",
    "For acute accessible bleeds, implement the RICE protocol immediately while preparing factor replacement: Rest the area, apply Ice (wrapped, never directly on skin), apply Compression with elastic wrap, Elevate the affected extremity above heart level",
    "Implement safety measures to prevent bleeding: pad crib rails for children, remove sharp furniture edges, encourage low-impact activities, soft-bristle toothbrush, electric razor, no rectal temperatures, avoid IM injections (administer vaccines subcutaneously), apply prolonged pressure after any venipuncture",
    "Assess for signs of intracranial haemorrhage, the most life-threatening complication: headache, altered level of consciousness, vomiting, seizures, pupil changes, focal neurological deficits; ANY head injury (even minor) requires immediate factor replacement BEFORE diagnostic imaging",
    "Monitor for inhibitor development: suspect if a patient who previously responded well to factor replacement has a suboptimal response to treatment (bleeding does not stop or recurs quickly despite adequate dosing); report to the healthcare provider for inhibitor testing",
    "Educate families about home factor infusion technique, emergency preparedness (keeping factor concentrate accessible and properly stored), medical alert identification, avoiding aspirin and NSAIDs, and when to seek emergency care (head injury, neck or throat bleeding, abdominal pain, large joint bleeds)"
  ],
  assessmentFindings: [
    "Haemarthrosis: most common clinical manifestation in severe hemophilia - the affected joint is warm, swollen, painful, and held in a flexed position; patient may describe an aura (tingling or tightness) before swelling becomes apparent",
    "Prolonged or excessive bleeding after injuries, dental procedures, or circumcision (may be the presenting sign in previously undiagnosed mild hemophilia)",
    "Easy bruising (ecchymosis), often in unusual locations or out of proportion to the injury",
    "Muscle haematomas: deep, painful swelling in large muscle groups (iliopsoas, quadriceps, forearm); compartment syndrome may develop with significant swelling",
    "Epistaxis, oral mucosal bleeding, and prolonged bleeding from minor cuts",
    "In severe hemophilia: spontaneous bleeding without identifiable trauma, particularly into weight-bearing joints (knees, ankles) and the iliopsoas muscle",
    "Chronic hemophilic arthropathy in inadequately treated patients: joint deformity, chronic pain, limited range of motion, muscle atrophy around affected joints"
  ],
  signs: {
    left: [
      "Warm, swollen, painful joint (early haemarthrosis)",
      "Easy bruising and prolonged bleeding from minor cuts",
      "Tingling or aura in a joint before visible swelling",
      "Prolonged bleeding after dental procedure",
      "Mildly prolonged aPTT on routine bloodwork"
    ],
    right: [
      "Headache and altered consciousness after head injury (ICH)",
      "Expanding muscle haematoma with compartment syndrome",
      "GI or retroperitoneal haemorrhage (severe pain and shock)",
      "Joint deformity from chronic repeated haemarthroses",
      "Factor replacement fails to control bleeding (inhibitor present)"
    ]
  },
  medications: [
    {
      name: "Factor VIII Concentrate (Recombinant)",
      type: "Clotting factor replacement (IV infusion)",
      action: "Replaces deficient factor VIII in hemophilia A, restoring the intrinsic coagulation pathway and enabling normal clot formation; dose calculated based on body weight and desired factor level increase (1 IU/kg raises factor VIII level by approximately 2%); half-life is 8-12 hours, requiring twice-daily dosing for acute management; extended half-life products (e.g., Eloctate) allow less frequent dosing for prophylaxis",
      sideEffects: "Allergic reactions (urticaria, anaphylaxis - rare), injection site reactions, development of inhibitors (neutralising antibodies against factor VIII - occurs in 25-30% of severe hemophilia A patients, most commonly within the first 50 exposure days), headache",
      contra: "Known anaphylaxis to product or its components (e.g., hamster protein for some recombinant products); not effective in patients with high-titre inhibitors (greater than 5 BU) - bypass agents are required instead",
      pearl: "Document the LOT NUMBER and expiration date of every factor product administered - this is essential for traceability and recall purposes. Reconstitute per manufacturer instructions using the diluent provided - do NOT shake, roll gently. Administer at the prescribed rate (typically over 3-5 minutes for IV push). For head trauma or life-threatening bleeds, give factor FIRST, then assess - never delay treatment waiting for imaging. Monitor for inhibitor development if treatment response is suboptimal."
    },
    {
      name: "Emicizumab (Hemlibra)",
      type: "Bispecific monoclonal antibody (subcutaneous injection)",
      action: "Bridges activated factor IX (FIXa) and factor X (FX), mimicking the cofactor function of factor VIII in the intrinsic coagulation pathway; provides continuous haemostatic protection with subcutaneous dosing every 1, 2, or 4 weeks; effective for hemophilia A WITH or WITHOUT inhibitors; does NOT contain factor VIII",
      sideEffects: "Injection site reactions (erythema, pain, pruritus), headache, arthralgia; CRITICAL: thrombotic microangiopathy (TMA) and thrombotic events can occur when used concurrently with activated prothrombin complex concentrate (aPCC/FEIBA) - avoid concurrent use if possible, and if aPCC is required for a breakthrough bleed, use the lowest effective dose",
      contra: "Hypersensitivity to emicizumab; EXTREME caution with concurrent aPCC/FEIBA (risk of TMA and thrombosis); emicizumab interferes with aPTT-based coagulation assays, making aPTT unreliable for monitoring",
      pearl: "Emicizumab is NOT a factor VIII product: standard factor VIII activity assays and aPTT will be MISLEADING in patients on emicizumab (aPTT will appear shortened even if the patient is bleeding). Breakthrough bleeds still require treatment with factor VIII (for patients without inhibitors) or rFVIIa (for patients with inhibitors) - NOT aPCC/FEIBA if avoidable. This drug has transformed hemophilia A management because subcutaneous dosing every 1-4 weeks is far less burdensome than IV factor infusions 2-3 times per week."
    },
    {
      name: "Desmopressin (DDAVP)",
      type: "Synthetic vasopressin analogue (IV, SC, or intranasal)",
      action: "Stimulates release of stored factor VIII and von Willebrand factor from endothelial cell Weibel-Palade bodies, typically raising factor VIII levels 2-5 fold above baseline within 30-60 minutes; used for MILD hemophilia A only (baseline factor VIII must be sufficient for the released amount to be clinically meaningful); NOT effective for hemophilia B (does not affect factor IX levels)",
      sideEffects: "Hyponatraemia from water retention (can cause seizures, especially in children and elderly - restrict fluid intake to 75% of maintenance for 24 hours after dose), facial flushing, headache, tachycardia, mild hypotension; tachyphylaxis (diminished response) occurs with repeated doses within 48 hours due to depletion of endothelial stores",
      contra: "Hemophilia B (ineffective), severe hemophilia A (insufficient stored factor VIII for meaningful release), patients under 2 years (high risk of hyponatraemia and seizures), unstable angina or known coronary artery disease (can precipitate MI), habitual polydipsia (hyponatraemia risk)",
      pearl: "Only useful for MILD hemophilia A with known factor VIII response - perform a DDAVP challenge test before relying on it in clinical situations. Effect diminishes with repeated dosing (tachyphylaxis) due to depletion of endothelial stores - allow 48 hours between doses. CRITICAL: restrict fluids to 75% of maintenance for 24 hours after administration to prevent hyponatraemia and seizures. Monitor sodium levels. The intranasal formulation (Stimate 1.5 mg/mL) is NOT the same as regular DDAVP nasal spray used for diabetes insipidus (different concentration)."
    }
  ],
  pearls: [
    "HEAD INJURY in a patient with hemophilia = administer factor replacement IMMEDIATELY, BEFORE imaging or assessment results - intracranial haemorrhage is the leading cause of death in hemophilia and any delay in treatment can be fatal; treat first, image second",
    "Hemophilia affects the INTRINSIC pathway: aPTT is PROLONGED, but PT/INR, platelet count, and bleeding time are all NORMAL - this distinguishes hemophilia from other bleeding disorders",
    "NEVER administer IM injections or rectal medications to patients with hemophilia - use subcutaneous route for vaccines and oral or IV routes for medications; apply pressure for at least 5 minutes after any venipuncture",
    "Aspirin and NSAIDs are ABSOLUTELY CONTRAINDICATED in hemophilia as they impair platelet function and increase bleeding risk; acetaminophen is the preferred analgesic and antipyretic",
    "Recognise the aura: many patients with hemophilia can sense a joint bleed beginning as tingling, warmth, or tightness before swelling is visible - early treatment at this stage results in better outcomes; always take the patient's report of an aura seriously",
    "Inhibitor development is the most serious treatment complication: suspect when a patient who previously responded to factor replacement has an inadequate response (continued bleeding despite appropriate dosing); occurs in 25-30% of severe hemophilia A patients",
    "Joint protection is lifelong: repeated haemarthroses cause irreversible arthropathy; prophylactic factor replacement starting in early childhood (before joint damage occurs) is the standard of care; encourage low-impact exercise (swimming, cycling) and avoid contact sports"
  ],
  quiz: [
    {
      question: "A 6-year-old child with severe hemophilia A falls and hits his head on the playground. He is alert, oriented, and has no visible external injury. Which action should the nurse take FIRST?",
      options: [
        "Apply ice to the head and monitor neurological status every 15 minutes",
        "Obtain a CT scan of the head to rule out intracranial haemorrhage before initiating treatment",
        "Administer factor VIII concentrate immediately, then assess and image as appropriate",
        "Call the parents to obtain consent for diagnostic imaging and treatment"
      ],
      correct: 2,
      rationale: "In hemophilia, ANY head injury - even one that appears minor - requires IMMEDIATE factor replacement BEFORE diagnostic imaging or further assessment. Intracranial haemorrhage is the leading cause of death in hemophilia, and intracranial bleeding can develop rapidly even without external signs of injury. The principle is treat first, image second. Delaying factor administration for imaging, parental consent, or observation can result in fatal intracranial haemorrhage."
    },
    {
      question: "The nurse is reviewing laboratory results for a patient suspected of having hemophilia. Which combination of results is MOST consistent with hemophilia?",
      options: [
        "Prolonged aPTT, normal PT/INR, normal platelet count",
        "Normal aPTT, prolonged PT/INR, low platelet count",
        "Prolonged aPTT, prolonged PT/INR, normal platelet count",
        "Normal aPTT, normal PT/INR, low platelet count"
      ],
      correct: 0,
      rationale: "Hemophilia (deficiency of factor VIII or IX) affects the INTRINSIC pathway of coagulation, which is measured by the aPTT. The extrinsic pathway (measured by PT/INR) and platelet count are unaffected in hemophilia. Therefore, the classic laboratory finding is a prolonged aPTT with normal PT/INR and normal platelet count. Prolonged PT/INR would suggest extrinsic pathway or common pathway issues (warfarin, vitamin K deficiency, liver disease). Low platelets would suggest thrombocytopenia."
    },
    {
      question: "A patient with hemophilia A develops a right knee haemarthrosis. In addition to administering factor VIII, which intervention should the nurse implement?",
      options: [
        "Apply heat to the affected knee and encourage active range-of-motion exercises",
        "Rest the affected limb, apply ice, use compression, and elevate the leg",
        "Administer aspirin for pain relief and apply an elastic bandage",
        "Encourage weight-bearing on the right leg to maintain mobility and prevent stiffness"
      ],
      correct: 1,
      rationale: "The RICE protocol (Rest, Ice, Compression, Elevation) is the standard first-aid approach for haemarthrosis in hemophilia, implemented alongside factor replacement therapy. Rest prevents further bleeding; ice causes vasoconstriction to reduce blood flow to the area; compression limits swelling; elevation promotes venous return. Heat would increase blood flow and worsen bleeding. Aspirin is absolutely contraindicated in hemophilia. Weight-bearing on an actively bleeding joint causes further damage."
    }
  ]
},

"thalassemia-rpn": {
  title: "Thalassemia",
  cellular: {
    title: "Pathophysiology of Thalassemia",
    content: "Thalassemia is a group of inherited haemoglobin disorders characterised by reduced or absent production of one or more of the globin chains that make up normal haemoglobin. Normal adult haemoglobin (HbA) is a tetramer consisting of two alpha-globin chains and two beta-globin chains. Each globin chain carries a haem group containing iron, which binds and transports oxygen. When one type of globin chain is produced in reduced quantity, the other type accumulates in excess, causing damage to red blood cells.\n\nThere are two major types based on which globin chain is deficient: alpha-thalassemia (reduced alpha-globin production) and beta-thalassemia (reduced beta-globin production). The severity depends on the number of genes affected and the degree of reduced globin synthesis.\n\nBeta-thalassemia results from mutations in the beta-globin gene on chromosome 11. Beta-thalassemia minor (trait/carrier state) involves one mutated gene and one normal gene - patients are usually asymptomatic with mild microcytic anaemia that is commonly mistaken for iron deficiency. Beta-thalassemia intermedia involves moderate reduction in beta-globin with variable clinical severity. Beta-thalassemia major (Cooley anaemia) involves severe or complete absence of beta-globin production and presents in the first year of life with severe transfusion-dependent anaemia.\n\nIn beta-thalassemia major, the absence of beta-globin chains means that alpha-globin chains are produced in excess. These unpaired alpha chains are unstable and precipitate within developing red blood cells in the bone marrow, forming inclusion bodies that damage cell membranes. This causes premature destruction of red cell precursors within the bone marrow itself (ineffective erythropoiesis) and in the peripheral circulation (haemolysis). The resulting profound anaemia triggers massive compensatory expansion of the bone marrow, which can cause skeletal deformities (frontal bossing, maxillary hyperplasia giving the characteristic chipmunk facies, cortical thinning with pathological fractures). Extramedullary haematopoiesis occurs in the liver and spleen, causing hepatosplenomegaly.\n\nAlpha-thalassemia results from gene deletions on chromosome 16. There are four alpha-globin genes (two from each parent). Silent carrier (one gene deleted) is clinically silent. Alpha-thalassemia trait (two genes deleted) causes mild microcytic anaemia. HbH disease (three genes deleted) causes moderate haemolytic anaemia. Hydrops fetalis (all four genes deleted) is incompatible with life and results in stillbirth or death shortly after birth due to complete inability to produce functional haemoglobin.\n\nThe primary treatment for beta-thalassemia major is chronic blood transfusions, typically every 2-4 weeks, to maintain haemoglobin above 90-100 g/L. However, each unit of packed red blood cells contains approximately 200-250 mg of iron, and the human body has no physiological mechanism to excrete iron. Over months and years of transfusion therapy, iron accumulates in vital organs - the heart (cardiomyopathy, heart failure, arrhythmias), liver (fibrosis, cirrhosis), and endocrine glands (diabetes, growth failure, hypogonadism, hypothyroidism). Iron overload is the leading cause of death in chronically transfused thalassemia patients, making iron chelation therapy absolutely essential.\n\nFor the RPN, critical priorities include: understanding the transfusion-dependent nature of severe thalassemia, safe blood product administration and monitoring, iron chelation therapy administration and compliance, monitoring for iron overload complications, providing psychosocial support for patients with a chronic lifelong condition, and distinguishing thalassemia trait from iron deficiency anaemia (a common clinical error)."
  },
  riskFactors: [
    "Mediterranean, Middle Eastern, African, and Southeast Asian heritage (beta-thalassemia is most prevalent in Mediterranean regions - hence the name; alpha-thalassemia is most common in Southeast Asian and African populations)",
    "Family history of thalassemia or carrier status (autosomal recessive inheritance - both parents must carry at least one mutation for a child to have thalassemia major)",
    "Consanguinity (marriage between close relatives increases the likelihood of both parents carrying the same mutation)",
    "Lack of prenatal genetic counselling and carrier screening in high-risk populations",
    "Geographic regions where malaria is or was endemic (thalassemia carrier status confers partial protection against Plasmodium falciparum malaria, which has maintained the mutations in these populations through natural selection)"
  ],
  diagnostics: [
    "CBC with indices: microcytic (low MCV) hypochromic (low MCH) anaemia; red cell count may be normal or elevated (distinctive finding that helps distinguish from iron deficiency where RBC count is low); target cells and nucleated red blood cells on peripheral smear in thalassemia major",
    "Haemoglobin electrophoresis (definitive diagnostic test): identifies the types and proportions of haemoglobin present; in beta-thalassemia trait, HbA2 is elevated (greater than 3.5%); in beta-thalassemia major, HbF (foetal haemoglobin) is markedly elevated (60-90%) with little or no HbA; HbH inclusions visible on supravital staining in alpha-thalassemia HbH disease",
    "Iron studies: serum iron, ferritin, TIBC, and transferrin saturation - critically important to distinguish thalassemia trait from iron deficiency anaemia; in thalassemia trait, iron stores are NORMAL or elevated; in iron deficiency, iron and ferritin are LOW and TIBC is HIGH",
    "Peripheral blood smear: target cells, basophilic stippling, hypochromic microcytic red cells, nucleated red blood cells, tear-drop cells, and Howell-Jolly bodies (if splenectomised)",
    "Reticulocyte count: elevated in thalassemia major (reflecting both haemolysis and compensatory erythropoiesis, though many reticulocytes are destroyed in the marrow from ineffective erythropoiesis)",
    "Genetic testing (DNA analysis): identifies specific alpha or beta-globin gene mutations; essential for genetic counselling, prenatal diagnosis, carrier detection, and preimplantation genetic diagnosis",
    "Serum ferritin: monitored regularly (every 1-3 months) in chronically transfused patients to assess iron burden; levels above 1000 ng/mL indicate significant iron overload requiring chelation; cardiac T2* MRI is the most accurate method for assessing cardiac iron loading"
  ],
  management: [
    "Chronic transfusion therapy for thalassemia major: packed red blood cell transfusions every 2-4 weeks to maintain pre-transfusion haemoglobin above 90-100 g/L; leukoreduced and phenotypically matched blood products to reduce alloimmunisation risk",
    "Iron chelation therapy (ESSENTIAL for all chronically transfused patients): deferoxamine (Desferal, subcutaneous or IV infusion 8-12 hours/day, 5-7 days/week), deferasirox (Jadenu/Exjade, once-daily oral tablet), or deferiprone (Ferriprox, oral three times daily); goal is to maintain serum ferritin below 1000 ng/mL and prevent cardiac iron accumulation",
    "Haematopoietic stem cell transplantation: the only CURATIVE treatment; best outcomes in young patients (under 14) with an HLA-matched sibling donor before significant iron-related organ damage; 80-90% cure rate in optimal candidates",
    "Luspatercept (Reblozyl): a novel erythroid maturation agent for transfusion-dependent beta-thalassemia; reduces transfusion burden by approximately 33% by promoting effective erythropoiesis; administered subcutaneously every 3 weeks",
    "Folic acid supplementation: 1 mg daily to support increased red blood cell production from compensatory erythropoiesis; folate is consumed rapidly due to high bone marrow activity",
    "Splenectomy: considered for patients with significant hypersplenism (excessive splenic red cell destruction increasing transfusion requirements); risk of post-splenectomy sepsis from encapsulated organisms (must vaccinate against Streptococcus pneumoniae, Neisseria meningitidis, Haemophilus influenzae type b before surgery and provide prophylactic penicillin)",
    "Genetic counselling: essential for affected families and carriers; prenatal diagnosis available through chorionic villus sampling or amniocentesis; carrier screening recommended for at-risk populations"
  ],
  nursingActions: [
    "Administer blood transfusions safely per protocol: verify patient identity and blood product with two nurses, use appropriate blood administration set with filter, monitor vital signs (baseline, 15 minutes, 30 minutes, hourly), observe closely for transfusion reactions - particularly in patients receiving chronic transfusions (alloimmunisation risk increases over time)",
    "Administer and monitor iron chelation therapy: for deferoxamine, assess subcutaneous infusion site for local reactions (erythema, swelling, pain); for deferasirox, monitor renal function (creatinine) and liver function tests monthly; for deferiprone, monitor CBC weekly for the first year (risk of agranulocytosis); teach patients and families that chelation compliance is literally life-saving",
    "Monitor serum ferritin levels and trends: report values consistently above 1000 ng/mL to the healthcare provider; educate patients that even when they feel well, iron accumulation is silently damaging organs; cardiac MRI T2* is ordered periodically to assess cardiac iron",
    "Assess for complications of iron overload: signs of heart failure (dyspnoea, oedema, exercise intolerance), diabetes (polyuria, polydipsia, blood glucose monitoring), hypothyroidism (fatigue, cold intolerance, weight gain), growth delay and delayed puberty in children/adolescents, liver dysfunction (jaundice, elevated enzymes)",
    "Monitor growth and development in paediatric patients: plot height, weight, and growth velocity on age-appropriate charts; delayed growth and pubertal development are common from endocrine iron deposition; refer to endocrinology as needed",
    "Provide psychosocial support: thalassemia major requires lifelong treatment with frequent hospital visits, painful infusions, and medication side effects; address body image concerns (skeletal changes, growth delay, skin pigmentation changes from iron deposition); connect families with support groups and mental health resources",
    "Educate about the distinction between thalassemia trait and iron deficiency: thalassemia trait causes mild microcytic anaemia that does NOT respond to iron supplements; giving iron to patients with thalassemia trait and normal iron stores can cause iatrogenic iron overload"
  ],
  assessmentFindings: [
    "Thalassemia trait (minor): usually asymptomatic; incidental finding of mild microcytic anaemia on routine bloodwork; often misdiagnosed as iron deficiency anaemia",
    "Thalassemia major: severe pallor, jaundice (from haemolysis), failure to thrive in infancy, irritability, feeding difficulties; presents between 6-12 months of age as foetal haemoglobin (HbF) is replaced by deficient adult haemoglobin production",
    "Hepatosplenomegaly: enlarged liver and spleen from extramedullary haematopoiesis (bone marrow expands beyond the skeleton to try to compensate for inadequate red cell production) and iron overload",
    "Skeletal changes in inadequately treated patients: frontal bossing (prominent forehead), maxillary hyperplasia (chipmunk facies), widened diploic space on skull X-ray (hair-on-end appearance), cortical thinning with pathological fractures",
    "Signs of iron overload in chronically transfused patients: bronze or slate-grey skin pigmentation, signs of heart failure (dyspnoea, oedema, arrhythmias), signs of diabetes (hyperglycaemia), growth failure and delayed puberty",
    "Chronic fatigue, exercise intolerance, and tachycardia from chronic anaemia"
  ],
  signs: {
    left: [
      "Mild pallor with normal or near-normal energy (trait)",
      "Slightly low haemoglobin with microcytic indices",
      "No splenomegaly or jaundice (trait)",
      "Normal growth and development (trait/mild)",
      "Family history of anaemia in high-risk ethnic group"
    ],
    right: [
      "Severe pallor with marked jaundice and fatigue (major)",
      "Massive hepatosplenomegaly with abdominal distention",
      "Skeletal deformities (frontal bossing, facial changes)",
      "Heart failure from cardiac iron overload",
      "Growth failure and absent pubertal development"
    ]
  },
  medications: [
    {
      name: "Deferasirox (Jadenu/Exjade)",
      type: "Oral iron chelator (once-daily tablet)",
      action: "Binds free iron in the body and promotes its excretion through the faeces (as an iron-chelator complex), preventing and treating iron overload from chronic transfusions; once-daily oral dosing significantly improves compliance compared to deferoxamine infusions; dose adjusted based on serum ferritin levels and transfusion burden, typically 14-28 mg/kg/day for the Jadenu formulation",
      sideEffects: "GI disturbance (nausea, diarrhoea, abdominal pain - most common), renal toxicity (elevated creatinine, proteinuria, renal tubular acidosis - monitor monthly), hepatotoxicity (elevated transaminases), rash, auditory and visual disturbances (high-frequency hearing loss, lens opacities - annual ophthalmological and audiological assessments recommended)",
      contra: "Severe renal impairment (creatinine clearance less than 40 mL/min), severe hepatic impairment, high-risk myelodysplastic syndrome (increased toxicity), platelet count below 50,000; avoid concurrent nephrotoxic agents; pregnancy (teratogenic in animal studies)",
      pearl: "Jadenu tablets are taken ONCE DAILY on an EMPTY stomach or with a light meal (less than 7% fat content). Exjade (older dispersible tablet) must be dissolved in water or juice - do NOT swallow whole. Monitor serum creatinine BEFORE starting therapy and MONTHLY during treatment. Annual hearing and vision assessments are required. Compliance is critical: without consistent chelation, iron overload will cause irreversible cardiac damage, which is the leading cause of death in thalassemia major."
    },
    {
      name: "Deferoxamine (Desferal)",
      type: "Parenteral iron chelator (subcutaneous or IV infusion)",
      action: "Binds free circulating iron and iron stored in ferritin and hemosiderin, forming ferrioxamine which is excreted by the kidneys (giving the urine a characteristic reddish-brown colour); the oldest and most extensively studied chelator; administered as slow subcutaneous infusion over 8-12 hours using a portable pump, typically 5-7 nights per week; dose 25-50 mg/kg/day",
      sideEffects: "Local infusion site reactions (pain, erythema, induration, swelling), high-frequency hearing loss (ototoxicity - annual audiometry required), retinal toxicity (annual ophthalmological examination), growth retardation in children if over-chelated (dose related), Yersinia and Mucor infections (iron chelators can enhance virulence of these organisms)",
      contra: "Severe renal disease, known hypersensitivity; do NOT administer as rapid IV bolus (can cause hypotension, tachycardia, and anaphylactoid reactions); use with caution at high doses in children (risk of growth impairment)",
      pearl: "The prolonged subcutaneous infusion schedule (8-12 hours per night, 5-7 nights per week) is the primary barrier to adherence - compliance rates are often poor, especially in adolescents. Reddish-brown urine is EXPECTED and is a sign that chelation is working (iron excretion). Rotate infusion sites to prevent lipodystrophy. If the patient develops fever with GI symptoms while on deferoxamine, consider Yersinia infection and hold deferoxamine (iron chelation promotes Yersinia growth). Vitamin C (100-200 mg) given at the time of infusion increases iron excretion but ONLY in vitamin C-deficient patients, and excessive doses can worsen cardiac iron toxicity."
    },
    {
      name: "Folic Acid",
      type: "Vitamin supplement / B-vitamin (oral)",
      action: "Essential cofactor for DNA synthesis and red blood cell maturation; the markedly increased erythropoietic activity in thalassemia (both effective and ineffective) rapidly consumes folate stores; supplementation at 1 mg daily prevents megaloblastic changes superimposed on the underlying microcytic anaemia",
      sideEffects: "Generally well tolerated; rare allergic reactions; very high doses may mask vitamin B12 deficiency (not relevant at 1 mg daily dose); GI discomfort uncommon",
      contra: "Known hypersensitivity to folic acid; use with caution in untreated pernicious anaemia (B12 deficiency) as folate supplementation may mask the haematological manifestations while neurological damage progresses - check B12 level before starting long-term folate",
      pearl: "1 mg daily is the standard prophylactic dose for thalassemia patients. This is a simple but important intervention that supports the bone marrow's continuous (though often ineffective) attempt to produce red blood cells. Can be taken with or without food. Ensure patients understand that folic acid supplements do NOT replace the need for transfusions or chelation therapy. Green leafy vegetables, legumes, and fortified cereals are dietary sources that should also be encouraged."
    }
  ],
  pearls: [
    "Do NOT give iron supplements to patients with thalassemia trait unless iron deficiency is CONFIRMED by iron studies - thalassemia trait causes microcytic anaemia that mimics iron deficiency, but iron levels are typically normal; giving iron to these patients causes iatrogenic iron overload",
    "Iron overload from chronic transfusions is the LEADING CAUSE OF DEATH in thalassemia major - iron chelation therapy is not optional, it is life-saving; the heart is the critical organ (cardiac iron overload causes cardiomyopathy, heart failure, and fatal arrhythmias)",
    "Thalassemia trait (minor) is frequently misdiagnosed as iron deficiency anaemia: BOTH cause microcytic hypochromic anaemia, but the key distinction is that thalassemia trait has NORMAL or elevated iron stores and a higher red blood cell count, while iron deficiency has LOW iron and ferritin with LOW red blood cell count",
    "Patients who have had a splenectomy (common in thalassemia) are at lifelong increased risk of overwhelming post-splenectomy infection (OPSI) from encapsulated organisms - ensure vaccinations are current (pneumococcal, meningococcal, Hib) and that patients take prophylactic penicillin as prescribed",
    "Monitor growth, development, and pubertal milestones closely in paediatric thalassemia patients: iron deposition in endocrine glands causes growth hormone deficiency, hypothyroidism, hypogonadism, and delayed puberty; early endocrine intervention can improve outcomes",
    "Genetic counselling is essential: when both parents are carriers (thalassemia trait), there is a 25% chance with each pregnancy of having a child with thalassemia major; carrier screening is recommended for at-risk populations before pregnancy",
    "Compliance with iron chelation therapy is the single most important modifiable factor in long-term survival - address barriers to adherence (pain of infusion, inconvenience of nightly pumps, pill burden) at every visit and explore alternative chelation regimens when compliance is poor"
  ],
  quiz: [
    {
      question: "A patient of Mediterranean heritage presents with mild microcytic anaemia (MCV 68 fL, haemoglobin 105 g/L). The healthcare provider suspects thalassemia trait. Which additional laboratory result would MOST help distinguish thalassemia trait from iron deficiency anaemia?",
      options: [
        "White blood cell count and differential",
        "Serum ferritin and iron studies",
        "Coagulation studies (PT/INR and aPTT)",
        "Blood glucose and HbA1c levels"
      ],
      correct: 1,
      rationale: "Both thalassemia trait and iron deficiency anaemia cause microcytic hypochromic anaemia and can appear identical on CBC. The key distinction is iron status: in thalassemia trait, serum ferritin and iron stores are NORMAL or elevated (the problem is globin chain production, not iron availability). In iron deficiency, ferritin is low, serum iron is low, and TIBC is elevated. Haemoglobin electrophoresis (showing elevated HbA2) would confirm thalassemia trait. This distinction is critical because iron supplementation is harmful in thalassemia trait with normal iron stores."
    },
    {
      question: "The nurse is caring for a 10-year-old child with beta-thalassemia major who receives blood transfusions every 3 weeks. The child's serum ferritin is 2,800 ng/mL. Why is adherence to iron chelation therapy MOST critical for this patient?",
      options: [
        "Iron chelation improves the effectiveness of blood transfusions",
        "Without chelation, excess iron deposits in vital organs, particularly the heart, causing life-threatening cardiomyopathy",
        "Iron chelation increases haemoglobin levels and reduces the frequency of transfusions needed",
        "Chelation therapy prevents the development of new thalassemia mutations"
      ],
      correct: 1,
      rationale: "Chronic blood transfusions lead to progressive iron overload because the human body has no mechanism to excrete excess iron. Iron deposits in vital organs - the heart (cardiomyopathy, heart failure, arrhythmias), liver (fibrosis, cirrhosis), and endocrine glands (diabetes, growth failure). Cardiac iron overload is the LEADING CAUSE OF DEATH in thalassemia major. A ferritin of 2,800 ng/mL indicates significant iron overload (goal is below 1,000). Iron chelation therapy removes excess iron and prevents organ damage. It does not improve transfusion effectiveness, increase haemoglobin, or affect genetic mutations."
    },
    {
      question: "A patient with thalassemia trait asks why they should not take iron supplements that were recommended by their family doctor for their anaemia. What is the nurse's best response?",
      options: [
        "Iron supplements interact with the thalassemia gene and can worsen your anaemia",
        "Your anaemia is caused by how your body makes haemoglobin, not by a lack of iron; taking iron when your levels are already normal can lead to harmful iron buildup in your body",
        "Iron supplements are only dangerous if you take them for more than one year",
        "You can safely take iron supplements but they will not improve your haemoglobin level"
      ],
      correct: 1,
      rationale: "In thalassemia trait, the anaemia is caused by reduced globin chain production, not iron deficiency. Iron stores are typically normal. Supplementing iron when levels are already adequate causes unnecessary iron accumulation in the body, which over time can damage the liver, heart, and other organs (iatrogenic iron overload). This is a very common clinical error - thalassemia trait is frequently misdiagnosed as iron deficiency because both cause microcytic anaemia. Iron studies must be checked before prescribing iron supplements."
    }
  ]
},

"hypoglycemia-vs-dka-rpn": {
  title: "Hypoglycemia vs. DKA",
  cellular: {
    title: "Pathophysiology of Hypoglycemia and Diabetic Ketoacidosis",
    content: "Hypoglycemia and diabetic ketoacidosis (DKA) represent opposite ends of the glucose spectrum in diabetes management, both are medical emergencies, and the RPN must be able to rapidly distinguish between them because the treatments are exactly opposite - giving insulin to a hypoglycaemic patient or glucose to a DKA patient would be life-threatening.\n\nHypoglycemia is defined as a blood glucose level below 4.0 mmol/L (72 mg/dL), though symptoms may begin at slightly higher levels in patients with chronically elevated glucose. It occurs when glucose utilisation or disposal exceeds glucose availability. In diabetic patients, the most common causes are: excess insulin (dosing error, injection into exercising muscle which accelerates absorption), sulfonylurea medications, insufficient carbohydrate intake (skipped or delayed meals), increased physical activity without appropriate carbohydrate compensation, and alcohol intake (alcohol inhibits hepatic gluconeogenesis).\n\nThe pathophysiology of hypoglycemia involves glucose deprivation of the brain and the counter-regulatory hormone response. The brain depends almost exclusively on glucose as its metabolic fuel and has minimal glycogen stores - brain cells begin to malfunction within minutes of glucose deprivation. As blood glucose falls, the body activates counter-regulatory hormones: glucagon (stimulates hepatic glycogenolysis and gluconeogenesis), epinephrine/adrenaline (stimulates glycogenolysis and causes the classic adrenergic symptoms - tremor, diaphoresis, tachycardia, anxiety, pallor, hunger), cortisol, and growth hormone. The symptoms of hypoglycemia are divided into adrenergic/autonomic symptoms (tremor, sweating, tachycardia, anxiety, hunger - caused by epinephrine release) and neuroglycopenic symptoms (confusion, difficulty speaking, blurred vision, behavioural changes, seizures, loss of consciousness - caused by brain glucose deprivation).\n\nHypoglycemia unawareness is a dangerous condition in which patients lose the early warning adrenergic symptoms due to recurrent hypoglycemic episodes, autonomic neuropathy, or use of beta-blockers (which mask adrenergic symptoms). These patients progress directly from feeling normal to severe neuroglycopenia (confusion, seizures, coma) without the warning tremor, sweating, and hunger that normally prompt self-treatment.\n\nDiabetic ketoacidosis (DKA) is a life-threatening metabolic emergency characterised by the triad of hyperglycemia (typically blood glucose above 14 mmol/L / 250 mg/dL), metabolic acidosis (pH less than 7.30, bicarbonate less than 18 mEq/L), and ketonemia/ketonuria. DKA occurs primarily in type 1 diabetes but can occur in type 2 under severe physiological stress.\n\nThe pathophysiology of DKA begins with absolute or relative insulin deficiency combined with excess counter-regulatory hormones (glucagon, cortisol, catecholamines, growth hormone). Without insulin, glucose cannot enter cells for energy production. The body perceives starvation despite hyperglycemia. Counter-regulatory hormones further drive hepatic glucose production (gluconeogenesis and glycogenolysis), worsening hyperglycemia. Blood glucose levels commonly reach 20-40 mmol/L (360-720 mg/dL) or higher.\n\nSeverely elevated blood glucose causes osmotic diuresis: glucose exceeds the renal threshold (approximately 10 mmol/L / 180 mg/dL), spills into urine, and draws water osmotically, causing massive polyuria and progressive dehydration. Patients may lose 5-10 litres of fluid and significant electrolytes (sodium, potassium, phosphate, magnesium). The resulting dehydration reduces renal perfusion, further impairing glucose excretion and worsening hyperglycemia.\n\nWithout insulin, cells cannot utilise glucose and switch to fatty acid oxidation for energy. The liver converts fatty acids to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone) at a rate that overwhelms the body's buffering capacity. Ketone bodies are organic acids, and their accumulation produces metabolic acidosis with an elevated anion gap. The characteristic fruity or acetone odour on the breath comes from acetone (a volatile ketone) being exhaled. Kussmaul respirations (deep, rapid breathing) represent respiratory compensation for metabolic acidosis - the lungs attempt to blow off carbon dioxide to raise pH.\n\nCommon precipitants of DKA include: new-onset type 1 diabetes (DKA may be the presenting event), insulin omission or inadequate dosing, infection (the most common trigger in known diabetics), myocardial infarction, pancreatitis, corticosteroid use, and SGLT2 inhibitor use (can cause euglycemic DKA with normal or near-normal glucose levels).\n\nFor the RPN, the critical skill is rapid assessment and differentiation: hypoglycemia has a rapid onset with cold clammy skin and tremor (adrenergic response), while DKA has a gradual onset over hours to days with warm dry skin, Kussmaul respirations, and fruity breath. Blood glucose testing is the definitive differentiator. Treatment for hypoglycemia is glucose administration. Treatment for DKA is IV fluids, IV insulin, and electrolyte replacement."
  },
  riskFactors: [
    "HYPOGLYCEMIA risk factors: insulin therapy (especially intensive regimens), sulfonylurea or meglitinide medications, skipped or delayed meals, excessive or unplanned physical activity, alcohol consumption (inhibits gluconeogenesis), renal impairment (reduces insulin clearance), older age, history of severe hypoglycemia, hypoglycemia unawareness, beta-blocker use (masks adrenergic warning symptoms)",
    "DKA risk factors: type 1 diabetes (particularly new diagnosis or insulin omission), infection/illness (most common precipitant in known diabetics), insulin pump malfunction, myocardial infarction, pancreatitis, cerebrovascular accident, corticosteroid therapy, SGLT2 inhibitor use (canagliflozin, dapagliflozin - can cause euglycemic DKA), substance abuse (cocaine), pregnancy, surgical stress",
    "Non-adherence to insulin therapy: the most common preventable cause of recurrent DKA, particularly in adolescents and young adults",
    "Inadequate diabetes education: patients who do not understand sick-day management rules, insulin dose adjustments, and when to seek emergency care",
    "Limited access to healthcare, insulin, or glucose monitoring supplies"
  ],
  diagnostics: [
    "Blood glucose (point-of-care capillary or venous): the single most critical test - HYPOGLYCEMIA: below 4.0 mmol/L (72 mg/dL); DKA: typically above 14 mmol/L (250 mg/dL), often 20-40+ mmol/L; note: euglycemic DKA (normal glucose with acidosis and ketones) can occur with SGLT2 inhibitors",
    "Arterial or venous blood gas: DKA shows metabolic acidosis with pH less than 7.30, low bicarbonate (less than 18 mEq/L), low pCO2 (respiratory compensation through Kussmaul respirations); classified as mild (pH 7.25-7.30), moderate (pH 7.00-7.24), or severe (pH less than 7.00)",
    "Serum ketones (beta-hydroxybutyrate): elevated in DKA (greater than 3.0 mmol/L indicates significant ketosis); more reliable than urine ketones because urine testing detects acetoacetate, which may be falsely negative early in DKA when beta-hydroxybutyrate predominates",
    "Serum electrolytes: potassium is CRITICAL in DKA - serum potassium may appear normal or elevated on initial labs despite total body potassium depletion (acidosis shifts potassium out of cells); insulin therapy will rapidly shift potassium back into cells, causing life-threatening hypokalemia; potassium MUST be above 3.3 mEq/L before starting insulin",
    "Anion gap: elevated in DKA (normal 8-12; DKA typically greater than 12); calculated as Na+ minus (Cl- + HCO3-); the gap is created by unmeasured ketoacid anions",
    "CBC: leukocytosis is common in DKA even without infection (stress demargination); does not confirm infection as the cause",
    "Serum osmolality and BUN/creatinine: assess dehydration severity; BUN is typically elevated from prerenal azotaemia",
    "Urinalysis: glucosuria and ketonuria in DKA; may also identify UTI as a precipitant"
  ],
  management: [
    "HYPOGLYCEMIA - Conscious patient (Rule of 15): give 15-20 grams of rapid-acting glucose (4 glucose tablets, 150 mL juice or regular pop, 15 mL honey or sugar); recheck blood glucose in 15 minutes; if still below 4.0 mmol/L, repeat treatment; once glucose is above 4.0, eat a snack with protein and complex carbohydrate to prevent recurrence",
    "HYPOGLYCEMIA - Unconscious or unable to swallow: glucagon 1 mg IM or SC (or 3 mg intranasal); in hospital, dextrose 50% (D50W) 25 mL IV push; position patient on their side (recovery position) to prevent aspiration; NEVER give oral glucose to an unconscious patient (aspiration risk)",
    "DKA - IV fluid resuscitation (first priority): 0.9% normal saline 1-1.5 L/hour for the first 1-2 hours to restore intravascular volume; then switch to 0.45% NS at 250-500 mL/hour; when blood glucose falls to 11-14 mmol/L (200-250 mg/dL), add dextrose 5% to IV fluids to prevent hypoglycemia while continuing insulin",
    "DKA - IV insulin infusion: regular insulin ONLY (not rapid-acting analogues for infusion); typically 0.1-0.14 units/kg/hour continuous infusion AFTER confirming potassium is above 3.3 mEq/L; goal is to reduce blood glucose by 3-4 mmol/L per hour (50-75 mg/dL per hour); too-rapid correction increases risk of cerebral oedema",
    "DKA - Potassium replacement (CRITICAL): if K+ less than 3.3 mEq/L, hold insulin and replace potassium FIRST (20-40 mEq/hour IV); if K+ 3.3-5.3 mEq/L, add 20-30 mEq potassium to each litre of IV fluid; if K+ above 5.3 mEq/L, hold potassium but recheck every 2 hours; monitor ECG for arrhythmias",
    "DKA - Bicarbonate: NOT routinely administered; considered only if pH less than 6.9 (severe acidosis); bicarbonate can worsen intracellular acidosis and hypokalemia",
    "DKA - Identify and treat the precipitating cause: blood cultures if infection suspected, cardiac enzymes if MI suspected, review medication compliance and insulin supply"
  ],
  nursingActions: [
    "Perform blood glucose testing IMMEDIATELY when hypoglycemia or DKA is suspected - do not wait for symptoms to worsen; blood glucose is the fastest and most definitive way to differentiate between the two emergencies",
    "For hypoglycemia in a conscious patient: apply the Rule of 15 - give 15 grams of fast-acting glucose, wait 15 minutes, recheck blood glucose; repeat if still below 4.0 mmol/L; once stable, provide a substantial snack; document the episode, blood glucose readings, and interventions",
    "For hypoglycemia in an unconscious patient: position on their side (recovery position), administer glucagon IM/SC or D50W IV as ordered; NEVER put anything in the mouth of an unconscious patient; monitor for vomiting (common after glucagon); recheck blood glucose every 15 minutes until stable",
    "For DKA: establish large-bore IV access (2 lines preferred); begin rapid normal saline infusion as ordered; connect continuous cardiac monitoring (potassium shifts cause arrhythmias); insert urinary catheter if ordered to monitor urine output accurately; monitor blood glucose hourly; monitor potassium and blood gas every 2-4 hours",
    "Strict intake and output monitoring in DKA: DKA patients are severely dehydrated (5-10 L fluid deficit); document all IV fluids administered and urine output hourly; report urine output less than 0.5 mL/kg/hour (may indicate inadequate resuscitation or renal compromise)",
    "NEVER start insulin in DKA if potassium is below 3.3 mEq/L: insulin drives potassium into cells, which can cause fatal cardiac arrhythmias in the setting of already-depleted total body potassium; replace potassium first, then start insulin",
    "Teach patients about hypoglycemia prevention: carry glucose tablets at all times, do not skip meals, adjust insulin for exercise, wear medical identification, teach family members how to administer glucagon, check blood glucose before driving",
    "Teach sick-day management rules for DKA prevention: NEVER stop insulin during illness (insulin needs typically INCREASE when sick), check blood glucose every 2-4 hours, check urine or blood ketones if glucose above 14 mmol/L, maintain hydration, seek medical attention if vomiting prevents oral intake or ketones are positive"
  ],
  assessmentFindings: [
    "HYPOGLYCEMIA adrenergic symptoms (early): tremor/shakiness, diaphoresis (cold clammy skin), tachycardia, palpitations, anxiety/nervousness, hunger, pallor, perioral numbness or tingling",
    "HYPOGLYCEMIA neuroglycopenic symptoms (progressive): confusion, difficulty concentrating, slurred speech, visual disturbances (blurred or double vision), behavioural changes (irritability, combativeness), incoordination, seizures, loss of consciousness",
    "DKA symptoms (gradual onset over hours to days): polyuria, polydipsia, nausea and vomiting, abdominal pain (can mimic acute abdomen), generalised weakness, fatigue, weight loss",
    "DKA physical findings: warm dry skin (dehydration), poor skin turgor, dry mucous membranes, sunken eyes, Kussmaul respirations (deep rapid breathing - respiratory compensation for acidosis), fruity or acetone odour on the breath, tachycardia, hypotension (from volume depletion), altered level of consciousness ranging from drowsy to comatose",
    "KEY DIFFERENTIATOR - Skin: hypoglycemia = COLD, CLAMMY, diaphoretic (adrenergic/epinephrine response); DKA = WARM, DRY, flushed (dehydration)",
    "KEY DIFFERENTIATOR - Onset: hypoglycemia = RAPID (minutes); DKA = GRADUAL (hours to days)",
    "KEY DIFFERENTIATOR - Breathing: hypoglycemia = normal or slightly rapid; DKA = Kussmaul respirations (deep and rapid) with fruity breath"
  ],
  signs: {
    left: [
      "Cold, clammy, diaphoretic skin",
      "Tremor, shakiness, and anxiety",
      "Tachycardia with normal blood pressure",
      "Hunger and irritability",
      "Blood glucose below 4.0 mmol/L (72 mg/dL)"
    ],
    right: [
      "Warm, dry, flushed skin with poor turgor",
      "Kussmaul respirations (deep, rapid breathing)",
      "Fruity or acetone odour on breath",
      "Nausea, vomiting, and abdominal pain",
      "Blood glucose above 14 mmol/L (250 mg/dL) with positive ketones"
    ]
  },
  medications: [
    {
      name: "Dextrose 50% (D50W)",
      type: "Hypertonic glucose solution (IV push)",
      action: "Provides immediate exogenous glucose to rapidly correct hypoglycemia; 25 mL of D50W provides 12.5 grams of dextrose; administered IV push over 1-3 minutes; blood glucose should begin to rise within minutes; used for severe hypoglycemia in hospitalised patients when IV access is available",
      sideEffects: "Hyperglycemia if excessive dose is administered (monitor blood glucose 15 minutes after administration), local tissue necrosis if extravasated (D50W is very hyperosmolar - ensure IV patency before administration), phlebitis at injection site, rebound hypoglycemia if the underlying cause is not addressed",
      contra: "No absolute contraindications in true hypoglycemia (this is a life-saving medication); ensure IV patency - extravasation of hypertonic dextrose causes severe tissue damage; in neonates, use D10W instead (lower concentration to prevent osmotic complications)",
      pearl: "VERIFY IV PATENCY before administration - D50W is extremely hyperosmolar and causes severe tissue necrosis if it infiltrates. Draw back blood from the IV before pushing. Typical adult dose is 25 mL (one ampule). Recheck blood glucose 15 minutes after administration. If the patient remains hypoglycemic, repeat the dose. Once the patient regains consciousness and can swallow safely, provide oral carbohydrates to sustain blood glucose. Investigate and address the cause of hypoglycemia."
    },
    {
      name: "Glucagon (GlucaGen, Baqsimi)",
      type: "Counter-regulatory hormone (IM, SC, or intranasal)",
      action: "Stimulates hepatic glycogenolysis (breakdown of stored glycogen into glucose), raising blood glucose within 10-20 minutes; used when IV access is not available or in the community setting; IM or SC injection 1 mg for adults; intranasal (Baqsimi) 3 mg in one nostril; effect depends on adequate hepatic glycogen stores",
      sideEffects: "Nausea and vomiting (very common - position patient on their side to prevent aspiration); headache; transient hyperglycemia; ineffective if hepatic glycogen stores are depleted (chronic starvation, alcohol-induced hypoglycemia, adrenal insufficiency)",
      contra: "Pheochromocytoma (glucagon can stimulate catecholamine release); insulinoma (paradoxical insulin release worsening hypoglycemia); known hypersensitivity; less effective in patients with depleted glycogen stores (chronic alcohol use, liver disease, prolonged fasting)",
      pearl: "Glucagon is the RESCUE MEDICATION for severe hypoglycemia when IV access is unavailable - teach family members, caregivers, and school personnel how to administer it. The intranasal formulation (Baqsimi) requires NO reconstitution and is the easiest for untrained caregivers to use. After administering glucagon, ALWAYS position the patient on their side because vomiting is very common and aspiration risk is high in an unconscious patient. The effect is temporary (blood glucose rises for approximately 60-90 minutes), so oral carbohydrates must be given as soon as the patient can safely swallow."
    },
    {
      name: "Regular Insulin (Humulin R, Novolin R) - IV Infusion for DKA",
      type: "Short-acting insulin (continuous IV infusion)",
      action: "Regular insulin is the ONLY insulin type used for continuous IV infusion in DKA management; it enables cellular glucose uptake, suppresses hepatic glucose production, inhibits lipolysis (stopping ketone body production), and promotes potassium movement into cells; dose 0.1-0.14 units/kg/hour as continuous infusion; goal is to reduce blood glucose by 3-4 mmol/L/hour (50-75 mg/dL/hour)",
      sideEffects: "Hypoglycemia (monitor blood glucose hourly and add dextrose to IV fluids when glucose falls to 11-14 mmol/L), hypokalemia (insulin shifts potassium into cells - monitor potassium every 2 hours and replace aggressively), cerebral oedema (rare but potentially fatal complication if glucose is corrected too rapidly, particularly in children)",
      contra: "Hypokalemia (potassium less than 3.3 mEq/L): DO NOT start insulin until potassium is corrected - insulin-driven intracellular potassium shift in the setting of existing hypokalemia can cause fatal cardiac arrhythmias",
      pearl: "CRITICAL RULE: check potassium BEFORE starting insulin. If K+ is below 3.3 mEq/L, replace potassium FIRST and hold insulin until K+ rises above 3.3. Only regular insulin is used for IV infusion (rapid-acting analogues are not approved for this route in most protocols). The insulin infusion should NOT be discontinued until the anion gap has closed AND the patient has eaten a meal AND subcutaneous insulin has been administered (give SC insulin 1-2 hours BEFORE discontinuing the IV drip to prevent rebound ketosis). Monitor blood glucose HOURLY during infusion."
    }
  ],
  pearls: [
    "When in doubt, treat for HYPOGLYCEMIA: giving glucose to a hypoglycemic patient is immediately life-saving, while giving glucose to a DKA patient causes temporary harm that can be corrected; not treating hypoglycemia can cause permanent brain damage or death within minutes",
    "The Rule of 15 for conscious hypoglycemia: 15 grams of fast-acting glucose, wait 15 minutes, recheck - if still below 4.0 mmol/L, repeat; this is the standard treatment protocol that every healthcare provider and diabetic patient should know",
    "NEVER give oral fluids or food to an unconscious hypoglycemic patient - this creates a choking and aspiration risk; use glucagon IM/SC/intranasal or D50W IV instead; position on their side (recovery position)",
    "DKA potassium rule: ALWAYS check potassium before starting insulin; if K+ is below 3.3 mEq/L, replace potassium first and HOLD insulin; insulin drives potassium into cells, and starting insulin with low potassium can cause fatal cardiac arrhythmias",
    "Key differentiators between hypoglycemia and DKA: onset (rapid vs. gradual), skin (cold/clammy vs. warm/dry), breathing (normal vs. Kussmaul), breath odour (normal vs. fruity/acetone), blood glucose (low vs. high)",
    "Teach all diabetic patients sick-day management rules: NEVER stop insulin when sick (illness increases insulin needs), check blood glucose every 2-4 hours, check ketones if glucose above 14 mmol/L, maintain hydration, seek medical attention if unable to keep fluids down or if ketones are moderate-large",
    "Hypoglycemia unawareness is dangerous: patients who have frequent low blood glucose episodes lose their adrenergic warning symptoms (tremor, sweating) and can progress directly to confusion, seizures, or coma without warning; raising glucose targets temporarily can restore hypoglycemia awareness over 2-3 weeks"
  ],
  quiz: [
    {
      question: "A patient with type 1 diabetes is found unresponsive by the nurse. The patient's skin is cold, clammy, and diaphoretic, and a blood glucose check reads 2.1 mmol/L (38 mg/dL). Which action should the nurse take FIRST?",
      options: [
        "Place glucose gel inside the patient's cheek and wait for them to regain consciousness",
        "Administer regular insulin IV as the patient is a type 1 diabetic",
        "Administer dextrose 50% IV push after confirming IV patency",
        "Encourage the patient to drink orange juice to raise blood glucose"
      ],
      correct: 2,
      rationale: "This patient is experiencing severe hypoglycemia (BG 2.1 mmol/L with altered consciousness). The patient is unresponsive and CANNOT safely receive anything orally due to aspiration risk. D50W IV push is the fastest and most reliable treatment for severe hypoglycemia in a hospitalised patient with IV access. Verify IV patency first (D50W causes tissue necrosis if extravasated). Insulin would be contraindicated as it would further lower blood glucose. Glucose gel or oral fluids cannot be given to an unconscious patient."
    },
    {
      question: "A patient presents with blood glucose of 28 mmol/L (504 mg/dL), pH 7.18, Kussmaul respirations, and serum potassium of 3.0 mEq/L. The provider orders an insulin infusion for DKA. What should the nurse do?",
      options: [
        "Start the insulin infusion immediately as ordered since blood glucose is critically elevated",
        "Hold the insulin infusion and notify the provider that potassium must be replaced first before insulin can be started safely",
        "Administer the insulin infusion at half the ordered rate while monitoring potassium",
        "Administer IV bicarbonate first to correct the acidosis, then start insulin"
      ],
      correct: 1,
      rationale: "The potassium level is 3.0 mEq/L, which is below the critical threshold of 3.3 mEq/L. Starting insulin when potassium is below 3.3 will drive potassium further into cells, potentially causing fatal cardiac arrhythmias (ventricular fibrillation, cardiac arrest). The nurse must hold the insulin infusion, notify the provider, and administer IV potassium replacement first. Once potassium rises above 3.3 mEq/L, insulin can be safely initiated. This is a critical safety rule in DKA management."
    },
    {
      question: "The nurse is teaching a patient with diabetes about differentiating hypoglycemia from DKA. Which statement by the patient indicates correct understanding?",
      options: [
        "Both conditions cause warm, flushed skin and require immediate insulin administration",
        "Hypoglycemia comes on suddenly with cold, sweaty skin, while DKA develops gradually with warm, dry skin and deep rapid breathing",
        "DKA causes a rapid drop in blood glucose that requires immediate glucose administration",
        "Hypoglycemia and DKA present the same way, so I should always check my blood glucose"
      ],
      correct: 1,
      rationale: "The patient correctly identifies the key differences: hypoglycemia has a rapid onset with adrenergic symptoms (cold, clammy, diaphoretic skin from epinephrine release) and low blood glucose. DKA develops gradually over hours to days with dehydration signs (warm, dry skin, poor turgor) and Kussmaul respirations (deep, rapid breathing as respiratory compensation for metabolic acidosis). While checking blood glucose is always correct, the presentations are clinically distinguishable. Treatment is opposite: glucose for hypoglycemia, insulin and fluids for DKA."
    }
  ]
},

"dehydration-rpn": {
  title: "Dehydration",
  cellular: {
    title: "Pathophysiology of Dehydration",
    content: "Dehydration refers to a deficit of total body water that disrupts normal physiological processes. It occurs when fluid output exceeds fluid intake over a sustained period. Water comprises approximately 60% of adult body weight (higher in infants at 70-80%, lower in elderly and obese individuals), making fluid balance essential for cellular function, circulatory volume, thermoregulation, and organ perfusion.\n\nDehydration is classified by the relationship between water and sodium loss into three types. Isotonic (isonatraemic) dehydration involves proportional loss of water and sodium, keeping serum sodium within the normal range (135-145 mEq/L). This is the most common type, occurring with GI losses (vomiting, diarrhoea), haemorrhage, and third-spacing. The primary deficit is intravascular volume loss, leading to reduced cardiac output and tissue perfusion. Hypotonic (hyponatraemic) dehydration involves greater sodium loss relative to water (serum sodium less than 135 mEq/L). This creates an osmotic gradient that pulls water from the extracellular space into cells, causing cellular swelling. This is particularly dangerous for brain cells, which can swell within the rigid skull, causing cerebral oedema with neurological symptoms (headache, confusion, seizures). Hypertonic (hypernatraemic) dehydration involves greater water loss relative to sodium (serum sodium greater than 145 mEq/L). The elevated extracellular osmolality draws water OUT of cells, causing cellular shrinkage. This type is seen with insensible water losses (fever, hyperventilation), diabetes insipidus, and inadequate water intake (especially in elderly with impaired thirst mechanism). Hypertonic dehydration is particularly dangerous in infants and elderly.\n\nThe body's compensatory mechanisms for dehydration include: activation of the renin-angiotensin-aldosterone system (RAAS) - reduced renal perfusion triggers renin release, leading to angiotensin II (vasoconstriction) and aldosterone (sodium and water retention in the kidneys); antidiuretic hormone (ADH/vasopressin) release from the posterior pituitary in response to increased plasma osmolality and decreased blood volume, promoting water reabsorption in the renal collecting ducts; sympathetic nervous system activation causing tachycardia and peripheral vasoconstriction to maintain blood pressure; and thirst mechanism activation to promote fluid intake.\n\nWhen compensation fails, hypovolemic shock develops: reduced cardiac output, hypotension, tachycardia, poor tissue perfusion, lactic acidosis, and multi-organ dysfunction. The kidneys are particularly vulnerable to ischaemic injury (acute kidney injury from prerenal azotaemia), manifested by oliguria (urine output less than 0.5 mL/kg/hour) or anuria.\n\nIn clinical practice, certain populations are at highest risk for dehydration and its complications: infants (high body surface area to weight ratio, immature renal concentrating ability, dependent on others for fluid intake), elderly (diminished thirst response, reduced total body water, impaired renal function, medications such as diuretics, mobility limitations affecting access to fluids), and patients with diarrhoea and vomiting (GI losses can be massive and rapid, especially in infectious gastroenteritis).\n\nFor the RPN, critical assessment skills include: recognising early signs of dehydration (tachycardia, decreased urine output, concentrated urine, thirst, dry mucous membranes), monitoring intake and output accurately, calculating fluid replacement needs, administering oral and IV fluids safely, recognising signs of shock, and understanding that dehydration in infants and elderly requires heightened vigilance because compensatory mechanisms are less effective in these populations."
  },
  riskFactors: [
    "Infants and young children: high body surface area to weight ratio (proportionally greater insensible losses), immature renal concentrating ability, rapid respiratory rates increase evaporative losses, dependent on caregivers for fluid access, cannot communicate thirst verbally",
    "Elderly adults: diminished thirst sensation (may not feel thirsty despite significant dehydration), reduced total body water (50% vs. 60% in younger adults), impaired renal concentrating ability, polypharmacy (diuretics, laxatives), mobility limitations affecting access to fluids, cognitive impairment",
    "Gastrointestinal losses: acute diarrhoea and/or vomiting (infectious gastroenteritis, food poisoning), prolonged nasogastric suctioning, ileostomy or high-output stoma, bowel obstruction with vomiting",
    "Renal losses: uncontrolled diabetes mellitus (osmotic diuresis from glycosuria), diabetes insipidus (massive dilute urine output), diuretic therapy (particularly loop diuretics such as furosemide), post-obstructive diuresis, chronic kidney disease with salt-wasting",
    "Increased insensible losses: fever (fluid needs increase by approximately 12% for each degree Celsius above normal), excessive sweating (heat exposure, strenuous exercise), tachypnoea, burns (massive evaporative losses through damaged skin), mechanical ventilation with inadequate humidification",
    "Reduced fluid intake: nil per os (NPO) status without adequate IV replacement, dysphagia, nausea preventing oral intake, depression, dementia, sedation, restricted access to fluids",
    "Third-spacing: pancreatitis, peritonitis, bowel obstruction, burns, sepsis (fluid shifts from intravascular space into interstitial or third spaces, causing intravascular depletion despite possible total body fluid excess)"
  ],
  diagnostics: [
    "Serum sodium and osmolality: classify dehydration type - isotonic (Na 135-145, normal osmolality), hypotonic (Na less than 135, low osmolality), hypertonic (Na greater than 145, high osmolality); guides fluid selection for replacement",
    "BUN and creatinine: elevated BUN:creatinine ratio (greater than 20:1) suggests prerenal azotaemia from volume depletion; creatinine may rise if dehydration is severe enough to cause acute kidney injury",
    "Urine specific gravity and osmolality: concentrated urine (specific gravity greater than 1.030, osmolality greater than 800 mOsm/kg) indicates appropriate renal compensation for dehydration; dilute urine in the setting of dehydration is inappropriate and suggests diabetes insipidus or renal concentrating defect",
    "CBC: haemoconcentration (elevated haemoglobin and haematocrit) from reduced plasma volume; however, haematocrit may be normal or low if dehydration accompanies bleeding",
    "Serum electrolytes panel: assess potassium (GI losses are rich in potassium; hypokalemia is common), bicarbonate (metabolic acidosis from poor perfusion and lactic acid production, or metabolic alkalosis from vomiting), magnesium and phosphate",
    "Lactate level: elevated lactate indicates tissue hypoperfusion; a marker of severity and guides aggressiveness of resuscitation",
    "Urine sodium: less than 20 mEq/L suggests the kidneys are appropriately retaining sodium (prerenal, volume-depleted state); greater than 40 mEq/L suggests renal salt wasting or diuretic effect"
  ],
  management: [
    "Mild dehydration (3-5% body weight loss): oral rehydration therapy (ORT) using oral rehydration solution (ORS) containing glucose and electrolytes; small frequent sips (5-10 mL every 5-10 minutes) if nausea is present; advance to larger volumes as tolerated; ORT is recommended by WHO as first-line for mild-moderate dehydration from diarrhoeal illness",
    "Moderate dehydration (6-9% body weight loss): may attempt ORT if patient can tolerate oral intake; often requires IV fluid resuscitation with 0.9% normal saline or lactated Ringer solution; initial bolus of 20 mL/kg over 30-60 minutes, then assess response and give additional boluses as needed",
    "Severe dehydration (10% or greater body weight loss): IV fluid resuscitation is essential; initial rapid bolus of 20 mL/kg 0.9% NS or LR, repeat as needed to restore perfusion; target urine output 0.5-1 mL/kg/hour in adults, 1-2 mL/kg/hour in children; replace estimated deficit plus ongoing losses over 24-48 hours",
    "Correct electrolyte imbalances: replace potassium (oral or IV as clinically indicated), correct hyponatraemia slowly (no more than 8-10 mEq/L per 24 hours to prevent osmotic demyelination syndrome), correct hypernatraemia gradually (no more than 10-12 mEq/L per 24 hours to prevent cerebral oedema)",
    "Treat underlying cause: antiemetics for vomiting (ondansetron), antimotility agents for non-infectious diarrhoea, antibiotics for bacterial gastroenteritis if indicated, adjustment of diuretic therapy, insulin for diabetic ketoacidosis, desmopressin for diabetes insipidus",
    "Ongoing maintenance fluids: calculate daily requirements (approximately 30-35 mL/kg/day in adults, higher in children using Holliday-Segar method); account for ongoing losses (drain outputs, diarrhoea, fever)"
  ],
  nursingActions: [
    "Maintain strict intake and output (I&O) monitoring: measure and record ALL fluid intake (oral, IV, enteral feeding) and ALL output (urine, stool, emesis, drain output, estimated insensible losses); compare totals every shift and report significant negative fluid balance to the healthcare provider",
    "Assess hydration status systematically: vital signs (tachycardia is often the earliest sign), orthostatic blood pressure and heart rate (positive orthostatic changes indicate volume depletion), skin turgor (test over sternum or forehead in elderly, not dorsum of hand), mucous membrane moisture, capillary refill time, fontanelle assessment in infants (sunken fontanelle indicates dehydration), urine colour and volume",
    "Weigh the patient daily at the same time, in the same clothing, on the same scale: a 1 kg weight loss over 24 hours in the absence of caloric restriction represents approximately 1 litre of fluid loss; daily weights are the most accurate measure of fluid balance",
    "Administer IV fluids as ordered: verify the correct solution (0.9% NS, LR, 0.45% NS, D5W), rate, and total volume; use an infusion pump for precise delivery; assess IV site for infiltration and phlebitis every 1-2 hours during rapid infusion",
    "Encourage oral fluid intake when appropriate: offer small, frequent sips of preferred fluids; provide oral rehydration solution for diarrhoeal dehydration; avoid caffeinated and alcoholic beverages (diuretic effect); ensure fluids are within reach for patients with limited mobility",
    "Monitor for fluid overload during rehydration (especially in elderly and patients with cardiac or renal disease): auscultate lung sounds for crackles, monitor for peripheral oedema, elevated JVP, weight gain exceeding expected fluid replacement, dyspnoea; report signs of overload promptly",
    "Educate patients and families about dehydration prevention: adequate daily fluid intake, increased fluids during illness/fever/hot weather/exercise, early signs of dehydration to watch for, when to seek medical attention (unable to keep fluids down, no urine output for 8+ hours, dizziness or confusion)"
  ],
  assessmentFindings: [
    "Vital sign changes: tachycardia (often the EARLIEST cardiovascular sign), orthostatic hypotension (systolic BP drops more than 20 mmHg or HR rises more than 20 bpm on standing), eventual supine hypotension in severe dehydration",
    "Skin and mucous membranes: dry mucous membranes, dry cracked lips, decreased skin turgor (skin tenting when pinched), sunken eyes, absence of tears (especially significant in children)",
    "Urine changes: decreased urine output (oliguria: less than 0.5 mL/kg/hour), concentrated dark amber urine with high specific gravity (greater than 1.030), strong odour",
    "Neurological: thirst (early sign, may be absent in elderly), irritability, lethargy, confusion, dizziness, headache, altered consciousness in severe dehydration; seizures with rapid sodium changes",
    "Infant-specific findings: sunken anterior fontanelle, absence of tears when crying, dry diaper for more than 6 hours, irritability or lethargy, mottled skin",
    "Weight loss: acute weight loss directly reflects fluid loss - 1 kg lost = approximately 1 litre fluid deficit; mild 3-5% body weight loss, moderate 6-9%, severe 10% or greater",
    "Capillary refill time: prolonged beyond 2-3 seconds indicates reduced peripheral perfusion from intravascular volume depletion"
  ],
  signs: {
    left: [
      "Increased thirst and dry mouth",
      "Slightly decreased urine output with darker colour",
      "Mild tachycardia at rest",
      "Decreased skin turgor (mild tenting)",
      "3-5% body weight loss over 24 hours"
    ],
    right: [
      "Severe hypotension with tachycardia (hypovolemic shock)",
      "Oliguria or anuria (less than 0.5 mL/kg/hour)",
      "Altered level of consciousness (confusion to coma)",
      "Sunken fontanelle in infants with absence of tears",
      "Greater than 10% body weight loss (medical emergency)"
    ]
  },
  medications: [
    {
      name: "0.9% Sodium Chloride (Normal Saline)",
      type: "Isotonic crystalloid IV fluid",
      action: "Isotonic solution that remains primarily in the extracellular fluid compartment (intravascular and interstitial spaces); expands intravascular volume to restore blood pressure, cardiac output, and tissue perfusion; approximately 25-30% of administered volume stays in the intravascular space; the standard initial resuscitation fluid for most types of dehydration",
      sideEffects: "Hyperchloraemic metabolic acidosis with large volumes (high chloride content disrupts acid-base balance), fluid overload (monitor for pulmonary oedema, especially in cardiac and renal patients), peripheral oedema, dilutional coagulopathy with massive resuscitation, hypernatraemia if used as sole replacement in free-water deficit states",
      contra: "No absolute contraindications in acute dehydration/hypovolemia; use with caution in heart failure (volume overload risk), cirrhosis with ascites, and renal failure (impaired ability to excrete sodium and water); avoid large volumes in patients with pre-existing hypernatraemia (worsens sodium elevation)",
      pearl: "Normal saline is the go-to initial resuscitation fluid for most forms of dehydration. For rapid resuscitation, give 20 mL/kg bolus (1-2 L in adults) over 30-60 minutes and reassess. Large-volume NS resuscitation can cause hyperchloraemic acidosis - if large volumes are needed, consider alternating with or switching to lactated Ringer solution. Always use an infusion pump for controlled delivery. Reassess clinical response after each bolus (vital signs, urine output, mental status)."
    },
    {
      name: "Ondansetron (Zofran)",
      type: "Serotonin (5-HT3) receptor antagonist / antiemetic",
      action: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal afferents, providing potent antiemetic effect; enables oral rehydration in patients with vomiting, potentially avoiding IV fluid resuscitation and hospital admission; administered IV, IM, or orally (including orally disintegrating tablet that dissolves on the tongue without water); onset 15-30 minutes",
      sideEffects: "Headache (most common), constipation, dizziness, fatigue, QT prolongation (dose-dependent - avoid in patients with known long QT syndrome or on other QT-prolonging drugs), serotonin syndrome when combined with other serotonergic agents",
      contra: "Known hypersensitivity, congenital long QT syndrome, concurrent use of apomorphine (severe hypotension); use with caution in hepatic impairment (reduced clearance), electrolyte abnormalities (hypokalemia and hypomagnesemia increase QT prolongation risk)",
      pearl: "The orally disintegrating tablet (ODT) formulation is excellent for patients with vomiting as it dissolves on the tongue and can be absorbed even if the patient vomits shortly after. A single dose of ondansetron in children with gastroenteritis reduces vomiting, improves oral rehydration success, and reduces the need for IV fluids and hospital admission. Check potassium and magnesium before IV administration as electrolyte abnormalities increase the risk of QT prolongation and cardiac arrhythmias."
    },
    {
      name: "Oral Rehydration Solution (ORS - e.g., Pedialyte)",
      type: "Oral electrolyte and glucose rehydration solution",
      action: "Contains a precise balance of glucose, sodium, potassium, and base (citrate or bicarbonate) that leverages the sodium-glucose co-transporter (SGLT1) in the small intestine to maximise water absorption even during active diarrhoea; WHO-formulated ORS contains reduced osmolarity (245 mOsm/L) with 75 mEq/L sodium and 75 mmol/L glucose; recommended by WHO as first-line treatment for mild-moderate dehydration from diarrhoeal disease",
      sideEffects: "Vomiting if given too rapidly (give small frequent sips, 5-10 mL every 5-10 minutes); hypernatraemia if concentrated improperly (always mix according to instructions); mild bloating or abdominal discomfort",
      contra: "Severe dehydration requiring IV resuscitation, ileus or bowel obstruction, intractable vomiting preventing any oral intake, altered consciousness (aspiration risk); ORS is an oral therapy and requires a conscious, cooperative patient with intact gag reflex",
      pearl: "ORS is one of the greatest public health interventions ever developed - it has saved millions of lives from diarrhoeal dehydration worldwide. The key to success is small, frequent sips rather than large volumes at once. A teaspoon (5 mL) every 1-2 minutes is well tolerated even in patients with some nausea. Do NOT substitute with fruit juice, sports drinks, or soft drinks - these have excessive sugar and insufficient sodium, which can worsen diarrhoeal fluid losses through osmotic effects. Commercial preparations (Pedialyte) are preferred over homemade solutions for accuracy of electrolyte content."
    }
  ],
  pearls: [
    "Tachycardia is often the EARLIEST cardiovascular sign of dehydration - it occurs before blood pressure changes because the sympathetic nervous system compensates by increasing heart rate to maintain cardiac output; do not wait for hypotension to intervene",
    "In infants, check the anterior fontanelle: a sunken fontanelle is a reliable sign of dehydration; also assess for absence of tears when crying, dry mucous membranes, and decreased wet diapers (fewer than 6 wet diapers in 24 hours in infants is concerning)",
    "Daily weights are the MOST accurate measure of fluid balance: weigh at the same time each day, in similar clothing, on the same scale; 1 kg of acute weight loss = approximately 1 litre of fluid loss",
    "Elderly patients may NOT exhibit typical dehydration signs: thirst sensation is diminished with aging, skin turgor is unreliable (test over the sternum or forehead instead of the hand), and mental status changes may be attributed to dementia rather than dehydration - maintain a high index of suspicion",
    "Orthostatic vital signs are a sensitive assessment tool: a systolic BP drop of 20 mmHg or more OR heart rate increase of 20 bpm or more from lying to standing suggests volume depletion of at least 15-20% of blood volume",
    "Oral rehydration solution is preferred over plain water for rehydration from diarrhoeal illness: the glucose in ORS activates sodium-glucose co-transport, dramatically improving water absorption; plain water lacks electrolytes and can cause hyponatraemia",
    "When rehydrating elderly patients or those with heart failure, monitor closely for fluid overload: auscultate lung sounds for crackles, watch for JVD, peripheral oedema, and dyspnoea; these patients have limited cardiac reserve and can shift from volume-depleted to volume-overloaded rapidly"
  ],
  quiz: [
    {
      question: "A nurse is assessing a 78-year-old patient admitted for dehydration secondary to diarrhoea. Which assessment finding is the EARLIEST indicator of volume depletion the nurse should monitor?",
      options: [
        "Systolic blood pressure below 90 mmHg",
        "Resting heart rate of 105 bpm",
        "Serum creatinine elevation to 2.0 mg/dL",
        "Urine output of 10 mL over 8 hours"
      ],
      correct: 1,
      rationale: "Tachycardia is typically the earliest cardiovascular sign of dehydration. The sympathetic nervous system responds to decreased blood volume by increasing heart rate to maintain cardiac output before blood pressure drops. Hypotension is a LATE sign indicating significant decompensation. Elevated creatinine indicates the kidneys have already sustained injury from poor perfusion. Severely decreased urine output (10 mL over 8 hours is near-anuria) indicates advanced dehydration. The nurse should recognise tachycardia early and intervene before these later signs develop."
    },
    {
      question: "An infant is brought to the emergency department with 3 days of diarrhoea. The nurse notes a sunken anterior fontanelle, absence of tears, dry mucous membranes, and no wet diaper for 8 hours. Which finding is MOST specific to infant dehydration assessment?",
      options: [
        "Dry mucous membranes",
        "Sunken anterior fontanelle",
        "Crying without tears",
        "Decreased oral intake"
      ],
      correct: 1,
      rationale: "A sunken anterior fontanelle is the most specific assessment finding for dehydration in infants because it is unique to this age group (the fontanelle closes by approximately 18 months). The fontanelle reflects intracranial pressure and fluid volume - dehydration reduces CSF volume, causing the fontanelle to become depressed or concave. Dry mucous membranes, absence of tears, and decreased intake can occur in other conditions. All findings listed indicate dehydration, but the fontanelle is the most specific to infant assessment."
    },
    {
      question: "A patient receiving IV fluid resuscitation for moderate dehydration develops crackles in the lung bases, distended neck veins, and dyspnoea. Which action should the nurse take?",
      options: [
        "Increase the IV fluid rate to promote diuresis and clear the fluid from the lungs",
        "Slow or stop the IV infusion, elevate the head of bed, administer oxygen, and notify the provider immediately",
        "Continue the current IV rate since fluid overload is not possible during dehydration treatment",
        "Reposition the patient to the prone position to improve respiratory mechanics"
      ],
      correct: 1,
      rationale: "Crackles (rales) in the lung bases, distended neck veins (JVD), and dyspnoea are classic signs of fluid overload/pulmonary oedema from over-aggressive fluid resuscitation. The nurse should immediately slow or stop the IV infusion, elevate the head of bed to reduce preload and improve breathing, apply oxygen to address hypoxia, and notify the provider. This is a common complication when rehydrating elderly patients or those with pre-existing cardiac or renal disease. Increasing IV fluids would worsen the overload. Fluid overload CAN occur during dehydration treatment."
    }
  ]
}

};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count} / ${Object.keys(lessons).length} lessons injected`);
