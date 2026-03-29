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
  "hemolytic-uremic-syndrome-rpn": {
    title: "Hemolytic Uremic Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hemolytic Uremic Syndrome: Thrombotic Microangiopathy",
      content: "Hemolytic uremic syndrome (HUS) is a life-threatening condition characterized by a triad of microangiopathic hemolytic anemia, thrombocytopenia, and acute kidney injury. The most common form, typical HUS, is triggered by infection with Shiga toxin-producing Escherichia coli (STEC), particularly serotype O157:H7. This bacterium colonizes the intestinal mucosa and releases Shiga toxin (Stx), which enters the bloodstream and binds to globotriaosylceramide (Gb3) receptors concentrated on the surface of renal glomerular endothelial cells. Once internalized, Shiga toxin inhibits protein synthesis by cleaving ribosomal RNA, causing direct endothelial cell injury and death. The damaged endothelium triggers a cascade of thrombotic microangiopathy: platelets aggregate on the injured vascular surfaces forming microthrombi within small arterioles and capillaries, particularly in the renal glomeruli. These microthrombi partially occlude the vessel lumen, creating turbulent blood flow that mechanically shears red blood cells as they pass through the narrowed vessels, producing fragmented red blood cells called schistocytes. This mechanical destruction of red blood cells is the hallmark of microangiopathic hemolytic anemia. The platelet consumption in forming microthrombi leads to thrombocytopenia, while the occlusion of renal microvessels produces ischemic injury to the glomeruli and tubules, resulting in acute kidney injury with oliguria or anuria. In children, HUS is the most common cause of acute kidney injury requiring dialysis. Atypical HUS (aHUS) is a distinct condition caused by dysregulation of the complement system, specifically uncontrolled activation of the alternative complement pathway due to genetic mutations in complement regulatory proteins such as factor H, factor I, or membrane cofactor protein. This complement-mediated form causes ongoing endothelial damage without a preceding STEC infection. The practical nurse must understand that HUS requires urgent recognition because early supportive care, particularly aggressive fluid management and dialysis when indicated, significantly improves outcomes. Antibiotic use during STEC infection is contraindicated because bacterial lysis releases additional Shiga toxin, potentially worsening HUS."
    },
    riskFactors: [
      "Exposure to undercooked ground beef or contaminated produce (primary source of E. coli O157:H7)",
      "Age under 5 years (highest incidence and greatest density of Gb3 receptors on immature renal endothelium)",
      "Contact with farm animals or petting zoos (cattle are primary STEC reservoir)",
      "Consumption of unpasteurized milk, juice, or contaminated water sources",
      "Exposure to infected individuals in daycare or institutional settings (person-to-person fecal-oral transmission)",
      "Advanced age over 65 years (higher mortality risk due to reduced renal reserve and comorbidities)",
      "Genetic complement pathway mutations (predisposition to atypical HUS)"
    ],
    diagnostics: [
      "Complete blood count (CBC): decreased hemoglobin and hematocrit (hemolytic anemia), decreased platelet count (thrombocytopenia below 150,000/microL), elevated reticulocyte count (bone marrow response to anemia)",
      "Peripheral blood smear: presence of schistocytes (fragmented red blood cells) confirms microangiopathic hemolytic anemia -- this is the hallmark finding",
      "Serum creatinine and BUN: elevated in acute kidney injury; creatinine trends are essential for monitoring renal function decline",
      "Stool culture and Shiga toxin assay: identifies STEC O157:H7; stool should be collected early as bacteria may clear within days",
      "Lactate dehydrogenase (LDH): markedly elevated due to red blood cell and tissue destruction; used to monitor disease activity",
      "Serum haptoglobin: decreased or undetectable (consumed by binding free hemoglobin released from lysed red blood cells)",
      "Urinalysis: proteinuria, hematuria, and casts indicating glomerular damage; monitor urine output closely for oliguria or anuria"
    ],
    management: [
      "Aggressive intravenous fluid resuscitation with isotonic crystalloid (normal saline) to maintain renal perfusion and prevent further kidney injury",
      "Strict intake and output monitoring with hourly urine output measurement; report urine output below 0.5 mL/kg/hour immediately",
      "Hemodialysis or peritoneal dialysis initiation when indicated for severe oliguria/anuria, fluid overload, hyperkalemia, or metabolic acidosis unresponsive to medical management",
      "Packed red blood cell transfusion for severe anemia (hemoglobin below 6-7 g/dL or symptomatic anemia); avoid platelet transfusion unless active life-threatening hemorrhage as it may worsen microthrombi",
      "Blood pressure monitoring and management with antihypertensives as prescribed; hypertension is common due to fluid overload and renal injury",
      "Eculizumab (Soliris) for confirmed atypical HUS; this monoclonal antibody blocks terminal complement activation",
      "Avoid antibiotics and antimotility agents during acute STEC infection as these increase Shiga toxin release and worsen HUS risk"
    ],
    nursingActions: [
      "Monitor urine output hourly using indwelling catheter if ordered; report output below 0.5 mL/kg/hour as this indicates worsening renal function",
      "Assess for signs of fluid overload every 2-4 hours: periorbital and peripheral edema, crackles on lung auscultation, elevated blood pressure, weight gain exceeding 0.5 kg/day",
      "Monitor laboratory values (CBC, creatinine, BUN, potassium, LDH) at least daily and report critical values immediately",
      "Perform neurological assessments every 4 hours; seizures, altered level of consciousness, and irritability may indicate CNS involvement (a serious complication)",
      "Implement contact precautions and strict hand hygiene for patients with confirmed STEC infection to prevent nosocomial transmission",
      "Monitor for signs of bleeding: petechiae, purpura, oozing from IV sites, melena, hematuria -- thrombocytopenia increases hemorrhage risk",
      "Provide family education about the disease process, expected course (typically 1-3 weeks), and importance of follow-up for long-term renal monitoring"
    ],
    assessmentFindings: [
      "Bloody diarrhea (hemorrhagic colitis) preceding HUS onset by 5-10 days; initially watery, becoming frankly bloody",
      "Pallor and fatigue (anemia from red blood cell destruction); jaundice may be present due to hemoglobin breakdown",
      "Decreased urine output progressing from oliguria to anuria; urine may appear dark or cola-colored",
      "Petechiae and purpura (thrombocytopenia); spontaneous bruising even without trauma",
      "Peripheral edema and periorbital puffiness (fluid retention from acute kidney injury)",
      "Hypertension (fluid overload and renin-angiotensin activation from renal ischemia)",
      "Irritability, lethargy, or seizures in children (CNS involvement occurs in 25% of cases)"
    ],
    signs: {
      left: [
        "Watery diarrhea progressing to bloody stools",
        "Mild pallor and fatigue",
        "Decreased appetite and nausea",
        "Low-grade fever",
        "Mild abdominal cramping and tenderness",
        "Decreased urine output from baseline"
      ],
      right: [
        "Anuria (no urine output) indicating severe renal failure",
        "Seizures or altered level of consciousness (CNS involvement)",
        "Severe hypertension unresponsive to initial treatment",
        "Active hemorrhage (GI bleeding, hematuria, petechiae with oozing)",
        "Respiratory distress from pulmonary edema (fluid overload)",
        "Hemoglobin below 6 g/dL with cardiovascular compromise"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid / volume expander",
        action: "Provides isotonic fluid replacement that remains primarily in the extracellular space, expanding intravascular volume and maintaining renal perfusion pressure to support glomerular filtration and prevent further ischemic kidney injury during the acute phase of HUS",
        sideEffects: "Fluid overload (pulmonary edema, peripheral edema), hypernatremia, hyperchloremic metabolic acidosis with large volumes, dilutional coagulopathy",
        contra: "Established fluid overload with pulmonary edema; severe hypernatremia; anuria unresponsive to fluid challenge (indicates need for dialysis rather than additional fluids)",
        pearl: "Early aggressive hydration before oliguria develops significantly reduces the need for dialysis; monitor daily weights and lung sounds every 4 hours during IV fluid administration; adjust rate based on urine output and fluid balance"
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2-chloride (Na-K-2Cl) cotransporter in the thick ascending limb of the loop of Henle, blocking reabsorption of sodium, potassium, and chloride; promotes excretion of water and electrolytes to manage fluid overload and may help convert oliguric renal failure to non-oliguric",
        sideEffects: "Hypokalemia (monitor potassium closely), hyponatremia, hypotension, ototoxicity with rapid IV administration, dehydration, metabolic alkalosis",
        contra: "Anuria unresponsive to test dose (indicates need for dialysis); severe hypovolemia; hepatic coma; known sulfonamide allergy (cross-reactivity possible)",
        pearl: "In HUS, furosemide is used cautiously and only after adequate fluid resuscitation; a test dose may be given to assess renal responsiveness; if no diuretic response occurs, dialysis is indicated rather than escalating diuretic doses; monitor potassium before and after each dose"
      },
      {
        name: "Calcium Gluconate",
        type: "Electrolyte replacement / membrane stabilizer",
        action: "Provides ionized calcium that stabilizes cardiac cell membranes by raising the threshold potential, protecting against the cardiotoxic effects of hyperkalemia (tall peaked T waves, widened QRS, cardiac arrest); also replaces calcium depleted by renal failure and metabolic derangement",
        sideEffects: "Bradycardia and hypotension with rapid IV administration, tissue necrosis if extravasation occurs, hypercalcemia (nausea, constipation, confusion), cardiac arrest if given too rapidly",
        contra: "Hypercalcemia; concurrent digitalis therapy (calcium potentiates digoxin toxicity and can cause fatal cardiac arrest); severe hyperphosphatemia (calcium-phosphate precipitation in tissues)",
        pearl: "Given IV for emergency hyperkalemia management in HUS patients with acute kidney injury; infuse slowly over 10-20 minutes with continuous cardiac monitoring; does NOT lower potassium levels -- it protects the heart while other treatments (insulin-glucose, kayexalate, dialysis) remove potassium"
      }
    ],
    pearls: [
      "The classic triad of HUS is microangiopathic hemolytic anemia, thrombocytopenia, and acute kidney injury -- all three must be present for diagnosis",
      "Schistocytes (fragmented red blood cells) on peripheral blood smear are the hallmark laboratory finding that confirms microangiopathic hemolytic anemia",
      "NEVER give antibiotics to patients with suspected E. coli O157:H7 infection -- antibiotic-induced bacterial lysis releases additional Shiga toxin and significantly increases HUS risk",
      "Avoid platelet transfusion in HUS unless there is active life-threatening hemorrhage -- transfused platelets may be consumed by ongoing microthrombi formation, worsening organ damage",
      "Early aggressive IV fluid hydration before oliguria develops is the single most important intervention to reduce the severity of renal injury and need for dialysis",
      "HUS is the most common cause of acute kidney injury requiring dialysis in children under 5 years; approximately 50-70% of typical HUS patients require dialysis during the acute phase",
      "Long-term follow-up is essential because 25-30% of HUS survivors develop chronic kidney disease, hypertension, or proteinuria years after the acute episode"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 3-year-old child admitted with bloody diarrhea and suspected E. coli O157:H7 infection. The physician has NOT prescribed antibiotics. The parent asks why. Which response by the nurse is most appropriate?",
        options: [
          "Antibiotics are not effective against this type of bacteria",
          "Killing the bacteria with antibiotics can release more toxin and increase the risk of kidney damage",
          "The child is too young for antibiotic therapy",
          "Antibiotics will be started once culture results confirm the diagnosis"
        ],
        correct: 1,
        rationale: "Antibiotics are contraindicated in STEC infection because bacterial lysis releases additional Shiga toxin into the bloodstream, significantly increasing the risk of developing HUS. This is a critical safety principle that the practical nurse must understand and communicate to families."
      },
      {
        question: "Which laboratory finding on a peripheral blood smear is the hallmark of hemolytic uremic syndrome?",
        options: [
          "Spherocytes",
          "Schistocytes",
          "Target cells",
          "Sickle cells"
        ],
        correct: 1,
        rationale: "Schistocytes (fragmented red blood cells) are the hallmark finding of microangiopathic hemolytic anemia in HUS. They form when red blood cells are mechanically sheared as they pass through narrowed, thrombi-laden microvessels. Spherocytes are seen in hereditary spherocytosis or autoimmune hemolytic anemia."
      },
      {
        question: "A child with HUS has a potassium level of 6.8 mEq/L and peaked T waves on the cardiac monitor. The practical nurse anticipates which medication will be administered FIRST?",
        options: [
          "Furosemide IV",
          "Sodium polystyrene sulfonate (Kayexalate)",
          "Calcium gluconate IV",
          "Regular insulin with dextrose"
        ],
        correct: 2,
        rationale: "Calcium gluconate is given first in hyperkalemia with ECG changes because it immediately stabilizes the cardiac cell membrane, protecting against fatal cardiac arrhythmias. It does not lower potassium levels but provides critical cardioprotection while other treatments (insulin-glucose, Kayexalate, dialysis) work to remove potassium from the blood."
      }
    ]
  },

  "hepatitis-bc-rpn": {
    title: "Hepatitis B and C for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hepatitis B and C: Viral Hepatotropism and Chronic Liver Disease",
      content: "Hepatitis B virus (HBV) and hepatitis C virus (HCV) are blood-borne pathogens that cause inflammation and destruction of hepatocytes (liver cells), with significant potential for chronic infection and progressive liver disease. HBV is a partially double-stranded DNA virus of the Hepadnaviridae family. It enters hepatocytes by binding to the sodium taurocholate cotransporting polypeptide (NTCP) receptor on the cell surface. Once inside the cell, the viral DNA is transported to the nucleus where it forms covalently closed circular DNA (cccDNA) that serves as a template for viral replication. The immune-mediated destruction of infected hepatocytes, rather than direct viral cytotoxicity, causes the liver damage seen in hepatitis B. Cytotoxic T lymphocytes (CD8+ T cells) recognize viral antigens expressed on the surface of infected hepatocytes and destroy them. When the immune response is vigorous and coordinated, the infection is cleared (acute hepatitis with recovery). When the immune response is insufficient to clear the virus but strong enough to cause ongoing liver damage, chronic hepatitis develops. HBV transmission occurs through blood, sexual contact, and vertical (mother-to-child) transmission during birth. The chronicity rate is inversely related to age at infection: approximately 90% of infected neonates develop chronic infection versus only 5% of immunocompetent adults. HCV is a single-stranded RNA virus of the Flaviviridae family. It enters hepatocytes primarily through the CD81 receptor and claudin-1 tight junction protein. HCV is notable for its extremely high genetic variability, with six major genotypes and numerous quasispecies within a single infected individual. This genetic diversity allows the virus to evade immune surveillance and is the primary reason no effective vaccine exists. Approximately 75-85% of HCV-infected individuals develop chronic infection regardless of age at exposure, making it far more likely than HBV to cause chronic disease. HCV transmission occurs primarily through percutaneous blood exposure (sharing needles, needle-stick injuries, pre-1992 blood transfusions). Sexual and vertical transmission are less efficient than with HBV but can occur. Both chronic HBV and HCV cause progressive liver fibrosis through ongoing hepatocyte destruction and stellate cell activation. Hepatic stellate cells, when activated by chronic inflammation, transform from quiescent vitamin A-storing cells into myofibroblast-like cells that produce excessive extracellular matrix proteins, particularly collagen. This progressive fibrosis distorts the normal hepatic architecture, impairs blood flow through the liver sinusoids, and eventually leads to cirrhosis. Cirrhosis is characterized by regenerative nodules surrounded by fibrous bands, portal hypertension, and loss of hepatic synthetic and detoxification functions. Both chronic HBV and HCV significantly increase the risk of hepatocellular carcinoma, with HBV being capable of direct oncogenic transformation through integration of viral DNA into the host genome."
    },
    riskFactors: [
      "Injection drug use with shared needles or equipment (highest risk for HCV; significant risk for HBV)",
      "Unprotected sexual contact with infected partners (primary transmission route for HBV in adults; less efficient for HCV)",
      "Healthcare workers with occupational needlestick injuries (risk varies: 6-30% for HBV if unvaccinated, 1.8% for HCV)",
      "Born to HBV-positive mother (vertical transmission; 90% chronicity rate in untreated neonates)",
      "Recipients of blood products or organ transplants before 1992 (before universal HCV screening of blood supply)",
      "Chronic kidney disease patients on hemodialysis (repeated vascular access, shared equipment risk)",
      "Tattoos or body piercings performed with non-sterile equipment"
    ],
    diagnostics: [
      "Hepatitis B surface antigen (HBsAg): marker of active HBV infection (acute or chronic); persistence beyond 6 months defines chronic infection",
      "Hepatitis B surface antibody (anti-HBs): marker of immunity (from vaccination or recovered infection); protective level is 10 mIU/mL or greater",
      "Hepatitis B core antibody (anti-HBc): total anti-HBc indicates past or present infection; IgM anti-HBc indicates acute infection within the past 6 months",
      "HBV DNA viral load (quantitative PCR): measures active viral replication; used to guide treatment decisions and monitor antiviral therapy response",
      "Anti-HCV antibody (screening test): indicates exposure to HCV (past or present); does not distinguish active from resolved infection",
      "HCV RNA viral load (quantitative PCR): confirms active HCV infection; used to confirm positive antibody tests and monitor treatment response; undetectable RNA 12 weeks after treatment completion defines sustained virologic response (cure)",
      "Liver function tests (AST, ALT, bilirubin, albumin, INR): ALT is most specific for hepatocyte damage; elevated ALT indicates active liver inflammation; albumin and INR assess synthetic function"
    ],
    management: [
      "Hepatitis B (chronic): antiviral therapy with entecavir or tenofovir to suppress viral replication; treatment goal is sustained suppression of HBV DNA to undetectable levels",
      "Hepatitis C: direct-acting antiviral (DAA) therapy with sofosbuvir-based regimens for 8-12 weeks; cure rates exceed 95% with sustained virologic response (SVR)",
      "Interferon alfa (pegylated): historically used for both HBV and HCV; still used in select HBV cases; largely replaced by DAAs for HCV due to superior efficacy and tolerability",
      "Vaccination for hepatitis B: three-dose series (0, 1, 6 months) is the most effective prevention; recommended for all infants, healthcare workers, and high-risk populations; no vaccine exists for HCV",
      "Post-exposure prophylaxis for HBV: hepatitis B immune globulin (HBIG) plus vaccine series within 24 hours of exposure for unvaccinated individuals",
      "Liver fibrosis staging with FibroScan (transient elastography) or liver biopsy to assess disease progression and guide treatment decisions",
      "Hepatocellular carcinoma screening with abdominal ultrasound and alpha-fetoprotein (AFP) every 6 months for patients with cirrhosis or chronic HBV"
    ],
    nursingActions: [
      "Implement standard precautions with all patients; use personal protective equipment when handling blood or body fluids; dispose of sharps in puncture-resistant containers immediately after use",
      "Administer hepatitis B vaccine using the correct schedule (0, 1, 6 months) and verify immunity with anti-HBs titer 1-2 months after the third dose",
      "Educate patients on transmission prevention: avoid sharing razors, toothbrushes, or personal items that may have blood on them; use barrier methods during sexual contact",
      "Monitor liver function tests and viral load as ordered; report rising ALT levels or increasing viral load promptly as these indicate disease progression or treatment failure",
      "Assess for signs and symptoms of liver failure: jaundice, ascites, peripheral edema, altered mental status (hepatic encephalopathy), spider angiomas, palmar erythema",
      "Educate patients to avoid hepatotoxic substances: alcohol (complete abstinence is essential), acetaminophen (limit to 2 g/day or less with liver disease), herbal supplements with hepatotoxic potential",
      "Coordinate screening of household contacts and sexual partners for HBV; ensure vaccination of susceptible contacts"
    ],
    assessmentFindings: [
      "Acute hepatitis: fatigue, malaise, anorexia, nausea, right upper quadrant pain, low-grade fever -- these prodromal symptoms may precede jaundice by 1-2 weeks",
      "Jaundice (icteric phase): yellowing of skin and sclera due to elevated bilirubin; dark (tea-colored) urine from conjugated bilirubin excretion; clay-colored (acholic) stools from absent stercobilin",
      "Hepatomegaly with tenderness on palpation of the right upper quadrant",
      "Chronic hepatitis: often asymptomatic for years or decades; fatigue and malaise may be the only symptoms during this silent phase",
      "Cirrhosis findings: jaundice, ascites, peripheral edema, spider angiomas on upper body, palmar erythema, gynecomastia in males, caput medusae (dilated periumbilical veins)",
      "Portal hypertension manifestations: splenomegaly, esophageal varices (risk of hemorrhage), hemorrhoids, ascites",
      "Hepatic encephalopathy: confusion, asterixis (flapping tremor of hands), fetor hepaticus (sweet musty breath odor), lethargy progressing to coma"
    ],
    signs: {
      left: [
        "Fatigue and malaise persisting beyond normal illness duration",
        "Anorexia, nausea, and mild right upper quadrant discomfort",
        "Low-grade fever during acute phase",
        "Mild jaundice of sclera or skin",
        "Dark urine and clay-colored stools",
        "Mild hepatomegaly on palpation"
      ],
      right: [
        "Severe jaundice with coagulopathy (INR above 1.5) suggesting fulminant hepatic failure",
        "Asterixis and altered mental status (hepatic encephalopathy)",
        "Hematemesis or melena (esophageal variceal hemorrhage)",
        "Tense ascites with respiratory compromise",
        "Spontaneous bacterial peritonitis (fever, abdominal pain, altered mental status in cirrhosis)",
        "Hepatorenal syndrome (rising creatinine with oliguria in advanced cirrhosis)"
      ]
    },
    medications: [
      {
        name: "Entecavir (Baraclude)",
        type: "Nucleoside analogue reverse transcriptase inhibitor (antiviral)",
        action: "Selectively inhibits HBV DNA polymerase by competing with the natural substrate deoxyguanosine triphosphate; blocks all three activities of the viral polymerase: base priming, reverse transcription of the negative strand from pregenomic mRNA, and synthesis of the positive strand; suppresses viral replication to undetectable levels",
        sideEffects: "Headache, fatigue, dizziness, nausea, elevated ALT (hepatitis flare may occur on discontinuation), lactic acidosis (rare but serious)",
        contra: "Co-infection with HIV unless the patient is also receiving a fully suppressive antiretroviral regimen (monotherapy can induce HIV resistance); caution in renal impairment (dose adjustment required based on creatinine clearance)",
        pearl: "Must be taken on an empty stomach (2 hours before or after a meal) for optimal absorption; abrupt discontinuation can cause severe hepatitis flare due to immune reconstitution -- taper under physician supervision; long-term therapy is typically required as HBV is rarely cured"
      },
      {
        name: "Sofosbuvir (Sovaldi)",
        type: "Nucleotide analogue NS5B polymerase inhibitor (direct-acting antiviral)",
        action: "Converted intracellularly to its active triphosphate form (GS-461203), which acts as a defective substrate for the HCV NS5B RNA-dependent RNA polymerase; once incorporated into the growing viral RNA chain, it acts as a chain terminator, halting viral RNA replication; effective against all HCV genotypes (pan-genotypic)",
        sideEffects: "Fatigue, headache, nausea, insomnia; when combined with ribavirin: hemolytic anemia, rash; symptomatic bradycardia when co-administered with amiodarone (contraindicated combination)",
        contra: "Co-administration with amiodarone (risk of fatal bradycardia); strong P-glycoprotein inducers (rifampin, carbamazepine, phenytoin) significantly reduce sofosbuvir levels rendering it ineffective; pregnancy when used with ribavirin (ribavirin is teratogenic -- Category X)",
        pearl: "Usually given in combination with other DAAs (ledipasvir, velpatasvir, or daclatasvir) for 8-12 weeks; cure rates exceed 95%; verify HCV genotype before selecting combination regimen; check HCV RNA at 12 weeks post-treatment -- undetectable RNA confirms sustained virologic response (cure)"
      },
      {
        name: "Interferon Alfa-2b (Intron A) / Peginterferon Alfa-2a (Pegasys)",
        type: "Immunomodulatory cytokine (antiviral and antiproliferative)",
        action: "Binds to type I interferon receptors on cell surfaces, activating the JAK-STAT signaling pathway that induces expression of interferon-stimulated genes (ISGs); these gene products inhibit viral protein synthesis, degrade viral RNA, and enhance immune surveillance by increasing MHC class I expression, natural killer cell activity, and cytotoxic T lymphocyte function against infected hepatocytes",
        sideEffects: "Flu-like symptoms (fever, chills, myalgia, fatigue -- nearly universal), depression and suicidal ideation, bone marrow suppression (neutropenia, thrombocytopenia), autoimmune thyroiditis, alopecia, injection site reactions",
        contra: "Decompensated cirrhosis (Child-Pugh B or C); autoimmune hepatitis; severe psychiatric disorders (uncontrolled depression); pregnancy (teratogenic); severe cytopenias",
        pearl: "Pegylated formulation (Pegasys) is administered once weekly by subcutaneous injection, improving compliance over standard interferon (three times weekly); monitor CBC every 2-4 weeks for bone marrow suppression; screen for depression at every visit; largely replaced by DAAs for HCV but still used in select HBV cases where finite therapy duration is desired"
      }
    ],
    pearls: [
      "HBsAg positive = active infection (acute or chronic); anti-HBs positive = immune (vaccinated or recovered); IgM anti-HBc positive = acute infection within past 6 months -- these three markers are the foundation of HBV serology interpretation",
      "The 'window period' in acute HBV occurs when HBsAg has cleared but anti-HBs has not yet appeared; during this period, IgM anti-HBc is the ONLY positive marker -- total anti-HBc fills this diagnostic gap",
      "Chronic HCV infection is confirmed by detectable HCV RNA (viral load) after a positive anti-HCV antibody screen; antibody alone does not distinguish active from resolved infection",
      "Hepatitis C is now curable in over 95% of patients with 8-12 weeks of direct-acting antiviral therapy; hepatitis B is controllable but rarely curable due to persistence of cccDNA in hepatocyte nuclei",
      "Healthcare workers who sustain a needlestick injury from an HBV-positive source should receive hepatitis B immune globulin (HBIG) AND begin the vaccine series within 24 hours if not previously vaccinated or if non-responder",
      "All patients with chronic HBV or HCV-related cirrhosis require hepatocellular carcinoma surveillance with abdominal ultrasound and alpha-fetoprotein every 6 months -- early detection dramatically improves survival",
      "Complete alcohol abstinence is essential for all patients with chronic viral hepatitis; alcohol accelerates fibrosis progression and significantly increases cirrhosis and liver cancer risk"
    ],
    quiz: [
      {
        question: "A practical nurse reviews the hepatitis B serology results for a patient: HBsAg negative, anti-HBs positive, anti-HBc negative. What do these results indicate?",
        options: [
          "Acute hepatitis B infection",
          "Chronic hepatitis B infection",
          "Immunity from hepatitis B vaccination",
          "Immunity from prior hepatitis B infection"
        ],
        correct: 2,
        rationale: "HBsAg negative (no active infection), anti-HBs positive (immunity present), and anti-HBc negative (no prior natural infection) indicates immunity acquired through vaccination. If anti-HBc were positive, it would indicate immunity from recovered natural infection rather than vaccination."
      },
      {
        question: "A patient with chronic hepatitis C asks the practical nurse whether hepatitis C can be cured. Which response is most accurate?",
        options: [
          "There is no cure, but medications can slow liver damage",
          "A liver transplant is the only cure for hepatitis C",
          "Current antiviral medications cure hepatitis C in over 95% of patients with 8-12 weeks of treatment",
          "Hepatitis C resolves on its own in most patients within 1-2 years"
        ],
        correct: 2,
        rationale: "Direct-acting antiviral (DAA) therapy achieves sustained virologic response (SVR), which is considered a cure, in over 95% of patients with 8-12 weeks of treatment. SVR is defined as undetectable HCV RNA 12 weeks after completing treatment. This represents a major advancement in hepatitis C management."
      },
      {
        question: "A practical nurse is educating a patient taking entecavir for chronic hepatitis B. Which instruction is most important to include?",
        options: [
          "Take the medication with a high-fat meal for better absorption",
          "It is safe to stop the medication once you feel better",
          "Take the medication on an empty stomach and never stop it abruptly without physician guidance",
          "This medication will cure your hepatitis B within 12 weeks"
        ],
        correct: 2,
        rationale: "Entecavir must be taken on an empty stomach (2 hours before or after meals) for optimal absorption. Abrupt discontinuation can cause a severe hepatitis flare due to immune reconstitution and viral rebound, potentially leading to hepatic decompensation. Entecavir suppresses but rarely cures HBV, so long-term therapy is typically required."
      }
    ]
  },

  "herpes-simplex-rpn": {
    title: "Herpes Simplex Virus Infection for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Herpes Simplex Virus: Viral Latency and Reactivation",
      content: "Herpes simplex virus (HSV) belongs to the Herpesviridae family and exists as two distinct serotypes: HSV-1 and HSV-2. Both are large, double-stranded DNA viruses with an icosahedral nucleocapsid surrounded by a lipid envelope containing viral glycoproteins (gB, gC, gD, gH, gL) essential for host cell attachment and entry. HSV-1 historically causes orolabial infections (cold sores, fever blisters) and is typically acquired in childhood through salivary contact, while HSV-2 primarily causes genital herpes and is transmitted through sexual contact. However, either serotype can infect either anatomical site, and HSV-1 is an increasingly common cause of genital herpes, particularly in young adults. The virus initiates infection by binding to heparan sulfate proteoglycans on the surface of epithelial cells, followed by interaction between viral glycoprotein D (gD) and specific cellular receptors including nectin-1 and herpesvirus entry mediator (HVEM). Following membrane fusion and entry, the viral capsid is transported to the nucleus where viral DNA is released and begins immediate-early gene expression, hijacking the host cell's transcription and translation machinery for viral replication. Newly assembled virions lyse the infected epithelial cell, causing the characteristic vesicular lesions on an erythematous base. The hallmark of HSV pathobiology is the establishment of lifelong latency. After primary infection of mucocutaneous epithelium, viral particles travel retrogradely along sensory nerve axons to the corresponding sensory nerve ganglia: the trigeminal ganglion for orolabial HSV-1 and the sacral dorsal root ganglia (S2-S5) for genital HSV-2. Within the neuronal cell body, the viral genome persists as a circular episome in the nucleus, expressing only latency-associated transcripts (LATs) that prevent apoptosis of the infected neuron and maintain the viral genome in a dormant state. Periodically, the virus reactivates from latency in response to triggers such as physiological stress, immunosuppression, fever, ultraviolet light exposure, hormonal changes, or local tissue trauma. During reactivation, the virus travels anterogradely down the sensory nerve axon back to the mucocutaneous surface, producing recurrent lesions near the original site of infection. Many reactivation episodes involve asymptomatic viral shedding, where infectious virus is present on mucosal surfaces without visible lesions, representing a significant mode of transmission. Neonatal herpes is the most serious complication, occurring when an infant is exposed to HSV (usually HSV-2) during passage through an infected birth canal. Neonates have immature immune systems and can develop disseminated disease affecting the liver, lungs, and brain (herpes encephalitis) with mortality rates exceeding 30% without treatment. The risk is highest when the mother acquires a primary HSV infection near the time of delivery."
    },
    riskFactors: [
      "Sexual contact with infected partner (genital HSV); many transmissions occur during asymptomatic viral shedding",
      "Immunosuppression from HIV/AIDS, chemotherapy, organ transplant medications, or chronic corticosteroid use (increases frequency and severity of outbreaks)",
      "Neonates born vaginally to mothers with active genital HSV lesions (highest risk with primary maternal infection near delivery)",
      "Healthcare workers with direct patient contact (herpetic whitlow from ungloved contact with oral or genital lesions)",
      "Close personal contact in childhood (HSV-1 orolabial transmission through kissing, shared utensils)",
      "Physiological triggers for reactivation: emotional stress, fever, menstruation, ultraviolet sun exposure, dental procedures, physical trauma to the affected dermatome",
      "Eczema or disrupted skin barrier (eczema herpeticum -- widespread HSV infection on eczematous skin is a dermatologic emergency)"
    ],
    diagnostics: [
      "Viral culture from vesicle fluid: gold standard for HSV identification; sensitivity highest when lesions are sampled within 48-72 hours of onset during the vesicular stage",
      "PCR (polymerase chain reaction) for HSV DNA: most sensitive diagnostic method; preferred for CSF testing in suspected herpes encephalitis; can distinguish HSV-1 from HSV-2",
      "Tzanck smear: rapid bedside test performed by scraping the base of an unroofed vesicle and staining with Wright or Giemsa stain; positive result shows multinucleated giant cells; does NOT distinguish HSV from varicella-zoster virus",
      "Type-specific serology (IgG antibodies to glycoprotein G): HSV-1 gG1 antibody and HSV-2 gG2 antibody; detects prior infection but cannot determine timing or anatomical site of infection; IgG appears 2-12 weeks after primary infection",
      "Direct fluorescent antibody (DFA) testing: rapid antigen detection from lesion swab; less sensitive than PCR but provides results within hours",
      "CSF analysis for herpes encephalitis: elevated protein, lymphocytic pleocytosis, positive HSV PCR; MRI shows temporal lobe involvement"
    ],
    management: [
      "Antiviral therapy initiated within 72 hours of symptom onset provides greatest benefit; earlier treatment shortens duration of lesions, reduces viral shedding, and decreases pain",
      "Primary genital herpes: acyclovir 400 mg three times daily for 7-10 days, OR valacyclovir 1 g twice daily for 7-10 days, OR famciclovir 250 mg three times daily for 7-10 days",
      "Recurrent genital herpes (episodic therapy): shorter course of same antivirals for 3-5 days, initiated at first prodromal symptoms (tingling, burning, itching)",
      "Suppressive therapy for frequent recurrences (6 or more per year): daily antiviral therapy (valacyclovir 500 mg or 1 g daily) reduces outbreak frequency by 70-80% and decreases asymptomatic shedding by 50%",
      "Neonatal herpes: high-dose IV acyclovir (60 mg/kg/day divided every 8 hours) for 14-21 days depending on disease classification (skin/eye/mouth vs. disseminated vs. CNS)",
      "Cesarean delivery recommended when active genital HSV lesions or prodromal symptoms are present at the time of labor to prevent neonatal transmission",
      "Herpes keratitis: topical antiviral (trifluridine or ganciclovir ophthalmic gel) with urgent ophthalmology referral; corticosteroids are contraindicated as they worsen corneal viral replication"
    ],
    nursingActions: [
      "Assess lesions for stage of development: prodrome (tingling/burning without visible lesion), vesicles (fluid-filled blisters on erythematous base), ulcers (ruptured vesicles), crusting (healing stage)",
      "Implement contact precautions when caring for patients with active HSV lesions; wear gloves when handling lesions, linens, or contaminated items; instruct patients to avoid touching lesions and wash hands immediately if contact occurs",
      "Educate patients that HSV transmission can occur even without visible lesions (asymptomatic viral shedding) and that consistent condom use reduces but does not eliminate transmission risk",
      "Monitor neonates born to HSV-positive mothers for signs of neonatal herpes: vesicular skin lesions, temperature instability, lethargy, poor feeding, seizures -- symptoms may appear 2-12 days after birth",
      "Assess for and report signs of herpes encephalitis: fever, headache, altered mental status, focal neurological deficits, seizures -- this is a neurological emergency requiring immediate IV acyclovir",
      "Provide emotional support and education to reduce stigma; address concerns about relationships, disclosure to partners, and long-term management",
      "Educate patients on prodromal symptoms (tingling, burning, itching at the site of future outbreak) and the importance of initiating episodic antiviral therapy at the first prodromal sign"
    ],
    assessmentFindings: [
      "Primary infection: grouped vesicles on an erythematous base that progress to painful shallow ulcers; may be accompanied by fever, malaise, tender inguinal lymphadenopathy (genital HSV), and dysuria",
      "Orolabial herpes (HSV-1): vesicles and ulcers on lips, perioral skin, gingiva, or hard palate; gingivostomatitis with diffuse oral ulcers is common in primary childhood infection",
      "Genital herpes: painful vesicles and ulcers on vulva, vagina, cervix, penis, perianal area, or buttocks; bilateral involvement is common in primary infection",
      "Prodromal symptoms preceding recurrence: localized tingling, burning, itching, or shooting pain along the affected dermatome hours to days before lesion appearance",
      "Recurrent infections are typically shorter in duration (5-10 days), less painful, and involve fewer lesions than primary infection; often unilateral",
      "Herpetic whitlow: painful vesicles on the fingers or nail beds; occurs in healthcare workers exposed to oral or genital secretions",
      "Eczema herpeticum: widespread vesiculopustular eruption on eczematous skin; fever, lymphadenopathy, punched-out erosions -- this is a dermatologic emergency"
    ],
    signs: {
      left: [
        "Prodromal tingling, burning, or itching at the site of future outbreak",
        "Grouped vesicles on an erythematous base",
        "Mild pain and tenderness at lesion sites",
        "Low-grade fever and malaise (primary infection)",
        "Tender regional lymphadenopathy",
        "Mild dysuria with genital lesions"
      ],
      right: [
        "Altered mental status, fever, and seizures (herpes encephalitis -- neurological emergency)",
        "Neonatal vesicular lesions with temperature instability, lethargy, and poor feeding",
        "Widespread vesiculopustular eruption on eczematous skin (eczema herpeticum)",
        "Dendritic corneal ulcer with eye pain and visual changes (herpes keratitis -- ophthalmologic emergency)",
        "Disseminated HSV in immunocompromised patient (hepatitis, pneumonitis, DIC)",
        "Urinary retention from sacral nerve involvement (HSV-related autonomic neuropathy)"
      ]
    },
    medications: [
      {
        name: "Acyclovir (Zovirax)",
        type: "Nucleoside analogue antiviral (guanosine analogue)",
        action: "Selectively phosphorylated by viral thymidine kinase (an enzyme present only in HSV-infected cells) to acyclovir monophosphate, then further phosphorylated by host cellular kinases to acyclovir triphosphate; the active triphosphate form competitively inhibits viral DNA polymerase and is incorporated into the growing viral DNA chain where it acts as a chain terminator due to the absence of a 3'-hydroxyl group needed for chain elongation",
        sideEffects: "Nausea, vomiting, diarrhea, headache; IV: phlebitis at infusion site, crystalline nephropathy (ensure adequate hydration), neurotoxicity (tremor, confusion, seizures) especially with renal impairment",
        contra: "Known hypersensitivity to acyclovir or valacyclovir; dose adjustment required in renal impairment (drug is renally excreted); ensure adequate hydration with IV formulation to prevent crystalline nephropathy",
        pearl: "Most effective when initiated within 72 hours of symptom onset; IV acyclovir is the treatment of choice for herpes encephalitis, neonatal herpes, and severe disseminated disease; maintain adequate urine output (at least 75 mL/hour during IV infusion) to prevent renal crystal precipitation"
      },
      {
        name: "Valacyclovir (Valtrex)",
        type: "Prodrug of acyclovir (L-valyl ester)",
        action: "Rapidly converted to acyclovir by first-pass intestinal and hepatic metabolism via the enzyme valacyclovir hydrolase; provides 3-5 times higher oral bioavailability than oral acyclovir, allowing less frequent dosing while achieving therapeutic acyclovir levels; the resulting acyclovir follows the same mechanism of action -- selective activation by viral thymidine kinase, inhibition of viral DNA polymerase, and chain termination",
        sideEffects: "Headache, nausea, abdominal pain, dizziness; thrombotic thrombocytopenic purpura/hemolytic uremic syndrome (TTP/HUS) reported in immunocompromised patients at high doses",
        contra: "Known hypersensitivity; dose adjustment in renal impairment; caution in immunocompromised patients (higher risk of TTP/HUS at high doses)",
        pearl: "Preferred over oral acyclovir for patient compliance due to less frequent dosing (twice daily vs. three to five times daily); for suppressive therapy, 500 mg once daily is effective for patients with fewer than 10 recurrences per year; educate patients to begin treatment at the first sign of prodromal symptoms for episodic therapy"
      },
      {
        name: "Famciclovir (Famvir)",
        type: "Prodrug of penciclovir (nucleoside analogue antiviral)",
        action: "Converted to penciclovir by first-pass metabolism and intracellular phosphorylation; penciclovir triphosphate (the active form) competitively inhibits HSV DNA polymerase with a much longer intracellular half-life than acyclovir triphosphate (10-20 hours vs. 1-2 hours), allowing sustained antiviral activity and less frequent dosing; however, penciclovir is a less potent inhibitor of viral DNA polymerase than acyclovir",
        sideEffects: "Headache, nausea, diarrhea, fatigue, dizziness; less commonly: elevated liver enzymes, pruritus",
        contra: "Known hypersensitivity to famciclovir or penciclovir; dose adjustment required in renal impairment and hepatic impairment (prodrug conversion may be affected)",
        pearl: "The long intracellular half-life of penciclovir triphosphate means antiviral activity persists even after plasma drug levels decline; particularly useful for recurrent genital herpes where a single-day treatment option exists (1000 mg twice daily for 1 day); educate patients to carry the medication and initiate at first prodromal symptom"
      }
    ],
    pearls: [
      "HSV establishes lifelong latency in sensory nerve ganglia: trigeminal ganglion for orolabial HSV-1 and sacral dorsal root ganglia (S2-S5) for genital HSV-2 -- the virus can NEVER be fully eliminated from the body",
      "Tzanck smear shows multinucleated giant cells and is a rapid bedside diagnostic test; however, it cannot distinguish HSV from varicella-zoster virus -- PCR is the most sensitive and specific confirmatory test",
      "Asymptomatic viral shedding (infectious virus present without visible lesions) accounts for a significant proportion of HSV transmissions -- patients must understand that transmission can occur even between outbreaks",
      "Neonatal herpes carries a mortality rate exceeding 30% in disseminated disease without treatment; the highest risk occurs when the mother acquires primary genital HSV near the time of delivery (30-50% transmission rate vs. 1-3% with recurrent infection)",
      "The prodrome (tingling, burning, itching) before an outbreak represents viral reactivation traveling down the nerve axon -- initiating antiviral therapy at this stage can abort or shorten the outbreak",
      "Eczema herpeticum (Kaposi varicelliform eruption) is a dermatologic emergency: widespread HSV infection on eczematous skin causes punched-out erosions, fever, and risk of systemic dissemination -- requires IV acyclovir",
      "Herpes encephalitis has a predilection for the temporal lobes; any patient with fever, altered mental status, and temporal lobe abnormalities on MRI should receive IV acyclovir empirically while awaiting CSF HSV PCR results"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient who reports tingling and burning on the lip for the past few hours but has no visible lesions. The patient has a history of recurrent cold sores. Which action by the nurse is most appropriate?",
        options: [
          "Reassure the patient that no treatment is needed until lesions appear",
          "Recommend initiating prescribed antiviral medication immediately",
          "Apply topical corticosteroid cream to the affected area",
          "Instruct the patient to apply ice packs to prevent lesion development"
        ],
        correct: 1,
        rationale: "The prodromal symptoms (tingling, burning) indicate viral reactivation along the sensory nerve before visible lesion formation. Initiating antiviral therapy at the first prodromal sign provides the greatest benefit in shortening outbreak duration and reducing viral shedding. Waiting until lesions appear reduces antiviral effectiveness."
      },
      {
        question: "A practical nurse is caring for a neonate whose mother has a history of genital herpes. On day 5 of life, the nurse observes clustered vesicles on the infant's scalp. Which action should the nurse take FIRST?",
        options: [
          "Apply topical acyclovir cream to the lesions",
          "Document the finding and reassess at the next scheduled assessment",
          "Notify the physician immediately for urgent evaluation",
          "Cleanse the lesions with normal saline and apply a dry dressing"
        ],
        correct: 2,
        rationale: "Vesicular lesions in a neonate born to an HSV-positive mother strongly suggest neonatal herpes, which is a life-threatening emergency. The physician must be notified immediately because IV acyclovir (60 mg/kg/day) must be initiated urgently. Neonatal herpes carries a mortality rate exceeding 30% in disseminated disease if untreated. Topical treatment alone is completely insufficient."
      },
      {
        question: "Which diagnostic test provides the most sensitive and specific identification of herpes simplex virus and can distinguish between HSV-1 and HSV-2?",
        options: [
          "Tzanck smear",
          "Viral culture",
          "Polymerase chain reaction (PCR)",
          "Direct fluorescent antibody (DFA)"
        ],
        correct: 2,
        rationale: "PCR (polymerase chain reaction) for HSV DNA is the most sensitive and specific diagnostic test and can reliably distinguish between HSV-1 and HSV-2. It is the preferred test for CSF analysis in suspected herpes encephalitis. Tzanck smear is rapid but cannot differentiate HSV from varicella-zoster virus. Viral culture is the traditional gold standard but is less sensitive than PCR."
      }
    ]
  },

  "hemorrhoids-rpn": {
    title: "Hemorrhoids for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hemorrhoids: Vascular Cushion Displacement and Venous Engorgement",
      content: "Hemorrhoids are normal anatomical structures consisting of submucosal vascular cushions composed of arterioles, venules, smooth muscle fibers, and connective tissue located in the anal canal. These cushions serve important physiological functions: they contribute to anal continence by providing a compressible seal that helps maintain closure of the anal canal at rest, and they protect the anal sphincter mechanism during defecation. Hemorrhoidal disease occurs when these vascular cushions become pathologically enlarged, displaced, and symptomatic due to engorgement of the hemorrhoidal venous plexus and deterioration of the supporting connective tissue. Internal hemorrhoids arise from the superior hemorrhoidal venous plexus above the dentate (pectinate) line and are covered by columnar epithelium with visceral innervation -- they are therefore painless but can cause significant bleeding. The dentate line is a critical anatomical landmark that separates the upper two-thirds of the anal canal (visceral innervation, insensate to pain) from the lower one-third (somatic innervation via the inferior rectal nerve, highly sensitive to pain). External hemorrhoids arise from the inferior hemorrhoidal venous plexus below the dentate line and are covered by anoderm (modified squamous epithelium) with somatic innervation -- they are therefore painful, especially when thrombosed. The pathogenesis involves several interrelated mechanisms. Chronic straining during defecation increases intra-abdominal pressure, which is transmitted to the hemorrhoidal venous plexus, causing venous engorgement and distension. Simultaneously, the supporting connective tissue matrix (Treitz muscle and Parks ligament) that anchors the vascular cushions to the internal anal sphincter undergoes progressive fragmentation and deterioration with aging and repeated straining, allowing the cushions to prolapse downward. Portal hypertension, while not a primary cause of typical hemorrhoids, can contribute to hemorrhoidal venous congestion through the portosystemic anastomosis at the anorectal junction, where the superior rectal vein (portal system) communicates with the middle and inferior rectal veins (systemic venous system). In patients with cirrhosis and portal hypertension, these portosystemic collaterals may become engorged, contributing to anorectal varices that can be difficult to distinguish from internal hemorrhoids. Internal hemorrhoids are graded by degree of prolapse: Grade I (no prolapse, bleeding only), Grade II (prolapse with defecation but spontaneously reduces), Grade III (prolapse requiring manual reduction), and Grade IV (irreducible prolapse, incarcerated). Thrombosed external hemorrhoids occur when blood within an external hemorrhoidal vein clots, producing an acutely painful, tense, bluish perianal nodule. The practical nurse must be able to distinguish hemorrhoidal disease from more concerning anorectal conditions including colorectal malignancy, inflammatory bowel disease, and anal fissure."
    },
    riskFactors: [
      "Chronic constipation with prolonged straining during defecation (single most common modifiable risk factor)",
      "Low dietary fiber intake (less than 25-30 grams per day results in harder stools requiring more straining)",
      "Prolonged sitting on the toilet (reading, phone use -- increases venous pressure in hemorrhoidal plexus)",
      "Pregnancy (increased intra-abdominal pressure from gravid uterus, hormonal effects on venous walls, constipation, and increased blood volume)",
      "Portal hypertension from cirrhosis (portosystemic venous anastomoses at the anorectal junction become engorged)",
      "Obesity (increased intra-abdominal pressure and sedentary lifestyle)",
      "Advanced age (progressive weakening of connective tissue supporting the vascular cushions)"
    ],
    diagnostics: [
      "Digital rectal examination (DRE): palpates for internal hemorrhoids (Grade III-IV may be palpable as soft, compressible masses), external hemorrhoids, thrombosed hemorrhoids (firm, tender nodule), and excludes rectal masses",
      "Anoscopy: direct visualization of the anal canal and lower rectum; gold standard for diagnosing internal hemorrhoids; reveals engorged, bluish-red vascular cushions that may prolapse with straining",
      "Flexible sigmoidoscopy or colonoscopy: recommended for patients with rectal bleeding who are over 40 years or have risk factors for colorectal cancer to exclude malignancy as the cause of bleeding",
      "Complete blood count (CBC): may reveal iron-deficiency anemia (microcytic, hypochromic) from chronic hemorrhoidal bleeding",
      "Fecal occult blood test (FOBT): positive with hemorrhoidal bleeding, but a positive result in patients over 45 warrants colonoscopy to exclude colorectal malignancy",
      "Liver function tests and INR: indicated if portal hypertension-related hemorrhoids are suspected; assess hepatic synthetic function in patients with known liver disease"
    ],
    management: [
      "Conservative management (first-line for Grade I-II): high-fiber diet (25-30 g/day), adequate fluid intake (8-10 glasses/day), stool softeners, avoid straining, limit toilet time to 5 minutes",
      "Sitz baths: warm water (40-42 degrees C) immersion of the perianal area for 10-15 minutes, 2-3 times daily and after bowel movements; promotes blood flow and relaxes the internal anal sphincter",
      "Topical therapy: hydrocortisone cream/suppository for inflammation and itching; topical lidocaine for pain relief; witch hazel pads for cooling and astringent effect",
      "Rubber band ligation (office procedure for Grade I-III internal hemorrhoids): elastic band placed around the base of the hemorrhoid, causing ischemic necrosis and sloughing within 5-7 days; most common non-surgical treatment",
      "Infrared coagulation or sclerotherapy: office-based procedures for Grade I-II hemorrhoids that have not responded to conservative measures",
      "Hemorrhoidectomy (surgical excision): reserved for Grade III-IV hemorrhoids, failed conservative/procedural management, or thrombosed external hemorrhoids not responsive to conservative treatment",
      "Thrombosed external hemorrhoid: excision (incision and removal of clot) within 48-72 hours of onset provides fastest relief; after 72 hours, conservative management (sitz baths, analgesics, stool softeners) is preferred as the clot begins to organize and reabsorb"
    ],
    nursingActions: [
      "Educate patients on proper bowel habits: respond promptly to the urge to defecate, avoid straining, limit toilet sitting to 5 minutes, elevate feet on a stool to approximate a squatting position",
      "Assess perianal area for external hemorrhoids (visible, skin-covered swelling at anal verge), thrombosed hemorrhoids (tense, bluish, painful nodule), skin tags, and fissures",
      "Monitor for signs of complications after rubber band ligation: severe pain (may indicate band placed too close to dentate line), fever, urinary retention, and excessive bleeding (occurs in 1-2% of cases)",
      "Provide postoperative care for hemorrhoidectomy patients: pain management (multimodal analgesia), sitz baths beginning 24 hours post-op, stool softeners to prevent straining, monitor for bleeding and urinary retention",
      "Assess and document characteristics of rectal bleeding: bright red blood on toilet tissue or surface of stool (typical hemorrhoidal pattern) versus melena or blood mixed within stool (suggests more proximal source)",
      "Report any rectal bleeding in patients over 40 years or those with family history of colorectal cancer for physician evaluation and colonoscopy referral",
      "Monitor for signs of incarcerated hemorrhoids (Grade IV): irreducible prolapse with severe pain, edema, ulceration, and potential for strangulation -- report immediately as surgical intervention may be required"
    ],
    assessmentFindings: [
      "Painless bright red rectal bleeding (internal hemorrhoids): blood on toilet paper, dripping into toilet bowl after defecation, or streaking on surface of stool",
      "Prolapse of tissue through the anus during defecation (Grade II-IV internal hemorrhoids): patient may report a soft, moist protrusion that requires manual reduction or is irreducible",
      "Acute severe perianal pain with a firm, tender, bluish nodule at the anal verge (thrombosed external hemorrhoid)",
      "Perianal itching (pruritus ani) from mucous discharge and moisture from prolapsing internal hemorrhoids",
      "Sensation of incomplete evacuation or rectal fullness from prolapsing internal hemorrhoids occupying the anal canal",
      "Perianal skin tags: soft, non-tender skin folds at the anal verge, often residual from previously thrombosed external hemorrhoids",
      "Iron-deficiency anemia symptoms (fatigue, pallor, dyspnea on exertion) in patients with chronic hemorrhoidal bleeding"
    ],
    signs: {
      left: [
        "Bright red blood on toilet tissue after defecation",
        "Mild perianal itching or discomfort",
        "Sensation of incomplete evacuation",
        "Visible external hemorrhoid at anal verge",
        "Small amount of prolapse that reduces spontaneously",
        "Mucous discharge causing perianal moisture"
      ],
      right: [
        "Severe acute perianal pain with firm bluish nodule (thrombosed external hemorrhoid)",
        "Irreducible prolapse with ulceration and severe edema (incarcerated Grade IV hemorrhoid)",
        "Heavy rectal bleeding requiring emergency intervention",
        "Signs of strangulation (severe pain, dusky/necrotic tissue, fever)",
        "Symptomatic anemia (hemoglobin below 7 g/dL, tachycardia, dyspnea) from chronic blood loss",
        "Fever and perianal cellulitis suggesting secondary infection"
      ]
    },
    medications: [
      {
        name: "Hydrocortisone rectal (Anusol-HC / Proctosol-HC)",
        type: "Topical corticosteroid (anti-inflammatory)",
        action: "Reduces inflammation, edema, and itching by inhibiting phospholipase A2, decreasing prostaglandin and leukotriene synthesis in the perianal tissues; suppresses the inflammatory cascade at the level of the hemorrhoidal tissue, reducing swelling of the vascular cushions and providing symptomatic relief of pruritus and discomfort",
        sideEffects: "Local: perianal skin thinning and atrophy with prolonged use, contact dermatitis, secondary fungal infection; rarely systemic absorption with prolonged or excessive topical use",
        contra: "Local fungal or bacterial infection at application site; perianal abscess; prolonged use beyond 7 days without physician reassessment (risk of skin atrophy)",
        pearl: "Limit topical corticosteroid use to 7 days maximum to prevent perianal skin atrophy and thinning; apply a thin layer after sitz bath and gentle drying of the perianal area; suppository form is used for internal hemorrhoids; educate patients that this treats symptoms, not the underlying cause"
      },
      {
        name: "Docusate Sodium (Colace)",
        type: "Stool softener (surfactant laxative)",
        action: "Acts as a surfactant (detergent) that lowers the surface tension at the interface between stool and water in the intestinal lumen, allowing water and lipids to penetrate and soften the fecal mass; does not stimulate peristalsis directly but produces softer stools that pass with less straining, reducing the mechanical force on hemorrhoidal tissues during defecation",
        sideEffects: "Mild abdominal cramping, diarrhea (if dose excessive), nausea; bitter taste with liquid formulation; rarely: throat irritation with liquid form",
        contra: "Known hypersensitivity; intestinal obstruction; fecal impaction (stool softeners cannot resolve existing impaction); concurrent use with mineral oil (increased mineral oil absorption and potential hepatotoxicity)",
        pearl: "Takes 24-72 hours for full effect -- not appropriate for acute constipation relief; most effective when combined with adequate fluid intake (at least 8 glasses per day); educate patients that this is a preventive measure to keep stools soft and reduce straining, not a rescue medication for existing constipation"
      },
      {
        name: "Lidocaine topical (Lidocaine 5% ointment / RectiCare)",
        type: "Local anesthetic (amide type)",
        action: "Blocks voltage-gated sodium channels in sensory nerve fibers in the perianal skin and mucosa, preventing the initiation and conduction of pain impulses; provides temporary numbing of the affected area, reducing the acute pain associated with thrombosed external hemorrhoids, anal fissures, and post-procedural discomfort",
        sideEffects: "Local: burning or stinging sensation on application, contact sensitization; systemic toxicity (rare with topical use): dizziness, perioral numbness, tinnitus, metallic taste, seizures, cardiac arrhythmias (only with excessive application or mucosal absorption)",
        contra: "Known sensitivity to amide-type local anesthetics; application to large denuded or ulcerated areas (increased systemic absorption risk); severe hepatic disease (impaired lidocaine metabolism)",
        pearl: "Apply a thin layer to the external perianal area up to 6 times daily; do NOT apply to internal hemorrhoids or insert deep into the anal canal due to increased mucosal absorption risk; onset of action within 3-5 minutes, duration 30-60 minutes; often used before and after sitz baths and prior to bowel movements for pain relief"
      }
    ],
    pearls: [
      "The dentate (pectinate) line is the key anatomical landmark: internal hemorrhoids arise ABOVE it (visceral innervation, painless but bleed), external hemorrhoids arise BELOW it (somatic innervation, painful especially when thrombosed)",
      "Bright red blood on toilet tissue or dripping into the bowl after defecation is the hallmark presentation of internal hemorrhoids -- blood mixed WITHIN the stool suggests a more proximal source and warrants further investigation",
      "Thrombosed external hemorrhoids are most effectively treated with excision within 48-72 hours of symptom onset; after 72 hours, conservative management is preferred because the clot begins to organize and symptoms typically improve",
      "High-fiber diet (25-30 g/day) combined with adequate fluid intake (8-10 glasses/day) is the cornerstone of hemorrhoid prevention and first-line treatment -- reducing straining reduces the mechanical force that causes hemorrhoidal disease",
      "Any patient over 40 years with new-onset rectal bleeding should be referred for colonoscopy to exclude colorectal malignancy, even if hemorrhoids are identified on examination -- hemorrhoids and colon cancer can coexist",
      "After rubber band ligation, patients should be warned about delayed bleeding (usually occurring 7-10 days post-procedure when the banded tissue sloughs) and should report heavy bleeding or fever immediately",
      "Portal hypertension from cirrhosis causes engorgement of the portosystemic venous anastomoses at the anorectal junction -- anorectal varices in cirrhotic patients can mimic hemorrhoids but carry a higher risk of life-threatening hemorrhage"
    ],
    quiz: [
      {
        question: "A practical nurse is educating a patient diagnosed with Grade II internal hemorrhoids. Which dietary recommendation is MOST important for managing this condition?",
        options: [
          "Reduce fluid intake to decrease stool bulk",
          "Increase dietary fiber to 25-30 grams per day with adequate fluid intake",
          "Follow a low-residue diet to minimize bowel movements",
          "Eliminate all dairy products from the diet"
        ],
        correct: 1,
        rationale: "High-fiber diet (25-30 g/day) combined with adequate fluid intake (8-10 glasses/day) is the cornerstone of hemorrhoid management. Fiber increases stool bulk and softness, reducing the need for straining during defecation. Straining is the primary modifiable risk factor for hemorrhoidal disease progression. Low-residue diets would worsen constipation and straining."
      },
      {
        question: "A patient presents to the clinic with a firm, bluish, extremely painful nodule at the anal verge that developed 18 hours ago. The practical nurse recognizes this finding as which condition?",
        options: [
          "Prolapsed internal hemorrhoid",
          "Perianal abscess",
          "Thrombosed external hemorrhoid",
          "Anal fissure"
        ],
        correct: 2,
        rationale: "A firm, bluish (from clotted blood), acutely painful nodule at the anal verge is the classic presentation of a thrombosed external hemorrhoid. The acute onset within 18 hours is characteristic. External hemorrhoids below the dentate line have somatic innervation, making thrombosis extremely painful. Treatment within 48-72 hours typically involves excision for fastest relief."
      },
      {
        question: "A practical nurse is providing post-procedure education to a patient who underwent rubber band ligation for internal hemorrhoids. Which instruction should be included?",
        options: [
          "Heavy rectal bleeding is expected and normal for the first 48 hours",
          "Report any heavy bleeding or fever, especially around 7-10 days when the banded tissue sloughs",
          "Complete bed rest for 72 hours is required after the procedure",
          "A low-fiber diet should be followed for 2 weeks after the procedure"
        ],
        correct: 1,
        rationale: "After rubber band ligation, delayed bleeding may occur 7-10 days post-procedure when the necrotic banded tissue sloughs off. Patients should be instructed to report heavy bleeding or fever immediately. A high-fiber diet and stool softeners should be continued to prevent straining, not discontinued. Mild discomfort and spotting are normal, but heavy bleeding indicates a complication."
      }
    ]
  },

  "esophageal-stricture-rpn": {
    title: "Esophageal Stricture for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Esophageal Stricture: GERD-Related Fibrosis and Dysphagia",
      content: "An esophageal stricture is a narrowing of the esophageal lumen caused by fibrotic scar tissue formation within the esophageal wall, resulting in progressive difficulty swallowing (dysphagia). The most common cause is chronic gastroesophageal reflux disease (GERD), which accounts for approximately 70-80% of benign esophageal strictures. In GERD, the lower esophageal sphincter (LES) fails to maintain adequate resting tone, allowing retrograde flow of gastric acid, pepsin, and bile salts into the distal esophagus. Under normal physiological conditions, the esophageal mucosa is lined by non-keratinized stratified squamous epithelium, which is not designed to withstand repeated exposure to the acidic gastric contents (pH 1.0-2.0). Chronic acid exposure damages the epithelial barrier through direct hydrogen ion penetration, activation of pepsin at low pH (which degrades epithelial proteins), and bile salt-mediated disruption of cell membrane integrity. The initial injury produces reflux esophagitis, characterized by superficial mucosal erosions, inflammation, and edema. When acid exposure is severe, prolonged, or repetitive over months to years, the inflammatory process extends deeper into the submucosa and muscularis propria. The tissue repair process involves activation of fibroblasts and myofibroblasts within the esophageal wall, which deposit excessive collagen and extracellular matrix proteins (primarily collagen types I and III). Transforming growth factor-beta (TGF-beta) is the key cytokine driving this fibrogenic response. Over time, the accumulating fibrotic tissue contracts and narrows the esophageal lumen, creating a stricture. Peptic strictures typically develop at the squamocolumnar junction in the distal esophagus where acid exposure is greatest. Other causes of esophageal strictures include eosinophilic esophagitis (proximal and mid-esophageal rings and strictures from eosinophilic inflammation), caustic ingestion (alkali or acid burns producing extensive fibrosis), radiation therapy to the chest or neck (radiation-induced fibrosis), prolonged nasogastric tube placement, post-surgical anastomotic strictures, and pill esophagitis from medications lodging in the esophagus (bisphosphonates, doxycycline, potassium chloride, NSAIDs). Malignant strictures from esophageal carcinoma (squamous cell carcinoma or adenocarcinoma) must always be excluded in any patient presenting with progressive dysphagia, particularly those over 50 years with alarm symptoms (weight loss, anemia, odynophagia). The practical nurse must understand that dysphagia is a progressive symptom: patients initially have difficulty swallowing solids (because the narrowed lumen can still accommodate liquids), then progress to difficulty with both solids and liquids as the stricture tightens. The esophageal lumen must be narrowed to approximately 13 mm or less before dysphagia for solids typically occurs, and to less than 9 mm before dysphagia for liquids develops."
    },
    riskFactors: [
      "Chronic gastroesophageal reflux disease (GERD) -- the most common cause, especially untreated or undertreated reflux lasting years",
      "Barrett esophagus (intestinal metaplasia from chronic GERD increases stricture risk and carries premalignant potential for esophageal adenocarcinoma)",
      "Caustic ingestion (alkali more commonly causes deep burns and strictures than acid ingestion; typically seen in children or suicidal ingestion)",
      "History of radiation therapy to the chest, mediastinum, or neck (radiation-induced fibrosis develops weeks to months after treatment)",
      "Prolonged nasogastric tube placement (mechanical irritation and acid pooling around the tube)",
      "Eosinophilic esophagitis (chronic eosinophilic infiltration causes subepithelial fibrosis and ring formation)",
      "Pill esophagitis from medications that erode the esophageal mucosa: bisphosphonates (alendronate), doxycycline, potassium chloride tablets, NSAIDs, iron supplements"
    ],
    diagnostics: [
      "Barium swallow (esophagram): radiographic study where the patient swallows barium contrast while fluoroscopic images are obtained; reveals location, length, and degree of stricture narrowing; smooth, tapered narrowing suggests benign peptic stricture; irregular, shelf-like narrowing suggests malignancy",
      "Upper endoscopy (esophagogastroduodenoscopy/EGD): direct visualization of the stricture allowing assessment of mucosal changes, tissue biopsy for histology (excludes malignancy and eosinophilic esophagitis), and therapeutic dilation in the same procedure",
      "Endoscopic biopsy: multiple biopsies taken from the stricture margins and surrounding mucosa to exclude malignancy (esophageal carcinoma) and identify eosinophilic esophagitis (15 or more eosinophils per high-power field)",
      "Esophageal manometry: measures esophageal motility and LES function; identifies underlying motility disorders that may contribute to dysphagia (achalasia, diffuse esophageal spasm)",
      "24-hour esophageal pH monitoring: confirms pathological acid exposure in patients with suspected GERD-related stricture; documents the temporal relationship between acid reflux episodes and symptoms",
      "CT scan of the chest with contrast: evaluates for extrinsic compression, mediastinal lymphadenopathy, and staging if malignant stricture is suspected"
    ],
    management: [
      "Esophageal dilation: primary treatment for symptomatic strictures; performed during endoscopy using either bougie dilators (Savary-Gilliard, Maloney) passed through the stricture or balloon dilators inflated within the stricture; multiple sessions may be required at 2-4 week intervals",
      "Aggressive acid suppression with high-dose proton pump inhibitor (PPI) therapy: essential both before and after dilation to reduce recurrent inflammation and re-stricturing; typically twice-daily PPI dosing",
      "Endoscopic corticosteroid injection: triamcinolone injected into the stricture site during dilation to inhibit collagen deposition and reduce recurrence of refractory strictures",
      "Dietary modification: progression from clear liquids to full liquids to soft solids to regular diet based on degree of stricture and post-dilation status; small bites, thorough chewing, upright positioning during and 30 minutes after meals",
      "Surgical fundoplication (Nissen or partial wrap): anti-reflux surgery may be indicated for strictures refractory to medical management to mechanically restore LES competence and prevent ongoing acid exposure",
      "Esophageal stent placement: self-expanding metal or plastic stents for malignant strictures or refractory benign strictures to maintain luminal patency",
      "Medication review: identify and discontinue or modify medications associated with pill esophagitis; instruct patients to take all oral medications with a full glass of water and remain upright for 30 minutes"
    ],
    nursingActions: [
      "Assess swallowing function at each meal: observe for signs of dysphagia including coughing during eating, food pocketing, wet or gurgling voice quality after swallowing, prolonged chewing, and avoidance of solid foods",
      "Maintain NPO status as ordered before esophageal procedures (EGD with dilation requires minimum 6-8 hours fasting); verify informed consent is obtained",
      "Monitor for complications after esophageal dilation: chest pain (mild is expected, severe suggests perforation), fever, subcutaneous crepitus in the neck (indicates esophageal perforation with mediastinal air), hematemesis, or dyspnea",
      "Position patient upright (30-45 degrees) during and for 30 minutes after meals to use gravity to assist esophageal transit and reduce reflux",
      "Educate patients on proper medication administration: take all pills with a full glass of water (at least 240 mL), remain upright for 30 minutes after taking medications, never crush enteric-coated or sustained-release formulations without pharmacist approval",
      "Monitor nutritional status: daily weights, calorie counts, serum albumin and prealbumin if ordered; patients with severe strictures may have significant weight loss from inadequate oral intake",
      "Report signs of esophageal perforation immediately: sudden severe chest pain, tachycardia, fever, subcutaneous emphysema (crepitus on palpation of the neck), or new-onset pleural effusion -- this is a surgical emergency"
    ],
    assessmentFindings: [
      "Progressive dysphagia: difficulty swallowing solids initially, then progression to both solids and liquids as the stricture tightens; patients often report food 'getting stuck' in the chest",
      "Odynophagia (painful swallowing): sharp or burning pain during swallowing, particularly with hot liquids, acidic foods, or pills",
      "Unintentional weight loss: from reduced oral intake due to dysphagia and fear of eating (sitophobia)",
      "Regurgitation of undigested food: food that has not reached the stomach may be regurgitated shortly after swallowing; lacks the sour/acidic taste of true gastric reflux",
      "Heartburn and acid reflux symptoms: burning epigastric or retrosternal pain, worse after meals, when lying down, or bending forward",
      "Chest pain or pressure during eating: may mimic cardiac pain; always rule out cardiac etiology in patients with chest pain",
      "Aspiration-related findings: recurrent cough after eating, hoarseness, recurrent pneumonia from aspiration of food material above the stricture"
    ],
    signs: {
      left: [
        "Intermittent difficulty swallowing solid foods",
        "Mild heartburn or acid reflux symptoms",
        "Sensation of food 'sticking' in the chest",
        "Mild weight loss over weeks to months",
        "Need to eat more slowly and chew food more thoroughly",
        "Occasional regurgitation of undigested food"
      ],
      right: [
        "Complete inability to swallow solids or liquids (complete obstruction)",
        "Sudden severe chest pain, fever, and tachycardia after dilation (esophageal perforation)",
        "Subcutaneous emphysema (crepitus in the neck) indicating esophageal perforation with mediastinal air",
        "Hematemesis (vomiting blood) suggesting mucosal tear or ulceration",
        "Recurrent aspiration pneumonia from chronic dysphagia",
        "Rapid progressive weight loss with anemia (alarm symptoms suggesting malignant stricture)"
      ]
    },
    medications: [
      {
        name: "Pantoprazole (Pantoloc / Protonix)",
        type: "Proton pump inhibitor (PPI)",
        action: "Irreversibly binds to and inhibits the hydrogen-potassium ATPase enzyme system (proton pump) on the apical membrane of gastric parietal cells, blocking the final common pathway of gastric acid secretion; reduces basal and stimulated acid secretion by up to 97%, raising intragastric pH and allowing esophageal mucosal healing; reduces ongoing acid-mediated inflammation that drives fibrosis and stricture formation",
        sideEffects: "Headache, nausea, diarrhea, abdominal pain; long-term risks: Clostridioides difficile infection, hypomagnesemia, vitamin B12 deficiency, calcium malabsorption (increased fracture risk), fundic gland polyps",
        contra: "Known hypersensitivity to PPIs; concurrent use with rilpivirine or atazanavir (acid suppression reduces absorption of these HIV medications); caution with clopidogrel (potential reduced antiplatelet effect, though pantoprazole has the least interaction)",
        pearl: "For esophageal stricture management, twice-daily dosing (40 mg before breakfast and before dinner) provides superior acid suppression compared to once-daily dosing; oral PPI should be taken 30-60 minutes before meals on an empty stomach for optimal activation; long-term PPI therapy is essential after dilation to prevent re-stricturing"
      },
      {
        name: "Sucralfate (Carafate / Sulcrate)",
        type: "Mucosal protectant (cytoprotective agent)",
        action: "In the acidic environment of the GI tract (pH below 4), sucralfate undergoes cross-linking and polymerization to form a viscous, sticky paste that selectively binds to ulcerated and eroded mucosal surfaces through electrostatic interaction between the negatively charged sucralfate polymer and positively charged proteins in the damaged tissue; this adherent barrier physically protects the mucosa from further acid, pepsin, and bile salt exposure for up to 6 hours; also stimulates local prostaglandin synthesis, bicarbonate secretion, and epidermal growth factor production to promote mucosal healing",
        sideEffects: "Constipation (most common, occurs in 2-3% of patients), dry mouth, nausea, bezoar formation (rare, with long-term use in patients with gastroparesis); aluminum absorption (minimal but caution in renal failure)",
        contra: "Chronic renal failure (risk of aluminum accumulation and toxicity); intestinal obstruction; do not administer concurrently with fluoroquinolones, phenytoin, digoxin, or tetracyclines (sucralfate binds these drugs and reduces their absorption -- separate by 2 hours)",
        pearl: "Must be taken on an empty stomach (1 hour before meals and at bedtime) for optimal mucosal adherence; must be separated from PPIs and other medications by at least 2 hours because sucralfate binds to other drugs in the GI tract; shake suspension well before administration; may be particularly useful for pill esophagitis and radiation-induced esophagitis"
      },
      {
        name: "Metoclopramide (Reglan / Maxeran)",
        type: "Prokinetic agent and antiemetic (dopamine D2 antagonist / 5-HT4 agonist)",
        action: "Enhances upper GI motility by blocking dopamine D2 receptors on myenteric neurons (removing dopamine's inhibitory effect on acetylcholine release) and stimulating 5-HT4 serotonin receptors (directly enhancing acetylcholine release); accelerates gastric emptying, increases LES tone, and improves esophageal peristaltic coordination; also blocks dopamine D2 receptors in the chemoreceptor trigger zone, providing antiemetic effect",
        sideEffects: "Drowsiness, restlessness, fatigue, diarrhea; extrapyramidal symptoms (dystonia, akathisia -- especially in young adults); tardive dyskinesia with prolonged use (potentially irreversible involuntary facial movements); hyperprolactinemia (galactorrhea, gynecomastia, menstrual irregularities)",
        contra: "GI obstruction, perforation, or hemorrhage; pheochromocytoma (may precipitate hypertensive crisis); seizure disorder (lowers seizure threshold); concurrent use with other dopamine antagonists or drugs causing extrapyramidal symptoms; Parkinson disease (dopamine antagonism worsens symptoms)",
        pearl: "Use for the shortest duration possible and NOT exceeding 12 weeks due to cumulative risk of tardive dyskinesia; administer 30 minutes before meals and at bedtime; monitor for involuntary movements of the face, tongue, and extremities at every visit; the FDA has placed a black box warning regarding tardive dyskinesia risk"
      }
    ],
    pearls: [
      "Progressive dysphagia (solids before liquids) is the hallmark symptom of esophageal stricture -- when a patient reports food 'getting stuck,' always consider stricture as a diagnosis requiring endoscopic evaluation",
      "The esophageal lumen must narrow to 13 mm or less before dysphagia for solids occurs and to less than 9 mm before dysphagia for liquids develops -- significant narrowing can occur silently before symptoms appear",
      "Barium swallow reveals the stricture pattern: smooth, tapered narrowing suggests BENIGN peptic stricture; irregular, asymmetric, shelf-like narrowing with mucosal destruction raises concern for MALIGNANT stricture requiring biopsy",
      "After esophageal dilation, monitor for the three critical signs of perforation: sudden severe chest pain, subcutaneous emphysema (crepitus in the neck), and fever -- perforation is a surgical emergency with high mortality if delayed",
      "Long-term twice-daily PPI therapy is essential after dilation to prevent re-stricturing; patients who discontinue PPI therapy have significantly higher rates of stricture recurrence requiring repeat dilation",
      "All oral medications should be taken with a full glass of water (240 mL minimum) while sitting upright to prevent pill esophagitis -- bisphosphonates, doxycycline, potassium chloride, and NSAIDs are the most common offending medications",
      "Any patient over 50 years presenting with new-onset dysphagia, weight loss, or anemia should be evaluated urgently with endoscopy and biopsy to exclude esophageal carcinoma -- these alarm symptoms should never be attributed to benign disease without investigation"
    ],
    quiz: [
      {
        question: "A patient with a history of chronic GERD reports that solid foods have been 'getting stuck' in the chest over the past 3 months, but liquids pass without difficulty. The practical nurse recognizes this pattern is most consistent with which condition?",
        options: [
          "Esophageal motility disorder",
          "Esophageal stricture",
          "Gastric outlet obstruction",
          "Esophageal spasm"
        ],
        correct: 1,
        rationale: "Progressive dysphagia for solids with preserved ability to swallow liquids is the hallmark of a mechanical obstruction such as an esophageal stricture. The narrowed lumen allows liquids to pass but obstructs solid food. In contrast, motility disorders (achalasia, diffuse esophageal spasm) typically cause dysphagia for both solids AND liquids from the onset."
      },
      {
        question: "A practical nurse is monitoring a patient 2 hours after esophageal dilation. The patient develops sudden severe chest pain, tachycardia, and subcutaneous crepitus is palpated in the neck. Which action should the nurse take FIRST?",
        options: [
          "Administer prescribed analgesics for post-procedure pain",
          "Notify the physician immediately as these findings suggest esophageal perforation",
          "Position the patient flat and apply ice to the neck",
          "Offer clear fluids to assess swallowing ability"
        ],
        correct: 1,
        rationale: "Sudden severe chest pain, tachycardia, and subcutaneous emphysema (crepitus in the neck from air escaping through the perforation into the mediastinum and subcutaneous tissue) are classic signs of esophageal perforation, the most serious complication of dilation. This is a surgical emergency requiring immediate physician notification. The patient should be kept NPO, not offered fluids."
      },
      {
        question: "A practical nurse is educating a patient with an esophageal stricture about taking pantoprazole. Which instruction is correct?",
        options: [
          "Take the medication with food for best absorption",
          "Take the medication 30-60 minutes before breakfast on an empty stomach",
          "Take the medication at bedtime with a full meal",
          "Take the medication only when heartburn symptoms occur"
        ],
        correct: 1,
        rationale: "Pantoprazole (and all PPIs) should be taken 30-60 minutes before a meal on an empty stomach. PPIs are prodrugs that require activation by acid in the parietal cell canaliculus, which is maximally stimulated during a meal. Taking the PPI before eating ensures peak drug levels coincide with maximal proton pump activation. For stricture prevention, continuous daily dosing is required, not as-needed use."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
