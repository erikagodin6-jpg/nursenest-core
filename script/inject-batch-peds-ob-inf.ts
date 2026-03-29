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
  "reye-syndrome-rpn": {
    title: "Reye Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Reye Syndrome",
      content: "Reye syndrome is a rare but life-threatening condition characterized by acute noninflammatory encephalopathy and fatty degenerative liver failure, occurring almost exclusively in children and adolescents following a viral illness treated with aspirin (acetylsalicylic acid). The pathophysiology centers on widespread mitochondrial injury that disrupts fatty acid beta-oxidation and the urea cycle. When aspirin metabolites damage mitochondrial membranes in hepatocytes and neurons, the cells lose the ability to perform oxidative phosphorylation efficiently. In the liver, impaired beta-oxidation causes massive accumulation of free fatty acids and triglycerides within hepatocytes (microvesicular steatosis), leading to acute liver failure without significant hepatocellular necrosis or inflammation. The damaged liver cannot adequately convert ammonia to urea through the urea cycle, resulting in hyperammonemia. Elevated blood ammonia crosses the blood-brain barrier and is toxic to astrocytes, which swell as they attempt to detoxify ammonia by converting it to glutamine. This astrocyte swelling produces diffuse cerebral edema with increased intracranial pressure (ICP). The cerebral edema is cytotoxic rather than vasogenic, meaning the blood-brain barrier remains structurally intact but the brain cells themselves swell. Simultaneously, hypoglycemia develops because the liver cannot maintain gluconeogenesis or glycogenolysis, further compromising cerebral metabolism. The combination of hyperammonemia, cerebral edema, hypoglycemia, and coagulopathy (from decreased hepatic synthesis of clotting factors) creates a rapidly progressive clinical picture that can advance from vomiting and lethargy to coma and death within hours if not recognized and treated aggressively. Reye syndrome is staged from I to V based on clinical severity: Stage I involves persistent vomiting and lethargy; Stage II includes disorientation, combativeness, and hyperventilation; Stage III presents with obtundation and decorticate posturing; Stage IV involves deep coma with decerebrate posturing and loss of oculocephalic reflexes; Stage V manifests as flaccidity, absent reflexes, and brain death. The practical nurse must understand that the hallmark association is aspirin use during a viral illness (particularly influenza B, influenza A, or varicella), and that prevention through aspirin avoidance in children under 19 years of age has dramatically reduced the incidence of this condition from hundreds of cases per year to fewer than two annually in North America."
    },
    riskFactors: [
      "Aspirin (acetylsalicylic acid) use during viral illness in children or adolescents -- the single most important modifiable risk factor",
      "Recent viral illness, particularly influenza B, influenza A, or varicella (chickenpox)",
      "Age between 4 and 16 years (peak incidence; rare in adults)",
      "Inborn errors of metabolism (medium-chain acyl-CoA dehydrogenase deficiency can mimic Reye syndrome)",
      "Use of salicylate-containing products (bismuth subsalicylate/Pepto-Bismol, oil of wintergreen, topical salicylates)",
      "Family history of fatty acid oxidation disorders or mitochondrial disease",
      "Concurrent use of antiemetics containing aspirin compounds during prodromal viral illness"
    ],
    diagnostics: [
      "Serum ammonia level: elevated (often greater than 1.5 times normal); correlates with severity of encephalopathy and guides treatment intensity",
      "Liver function tests: AST and ALT markedly elevated (often 3 times or greater above normal) without elevated bilirubin (hallmark pattern); reflects hepatocyte mitochondrial injury without cholestasis",
      "Serum glucose: often low (hypoglycemia), particularly in younger children; blood glucose monitoring every 1-2 hours is essential",
      "Prothrombin time (PT/INR): prolonged due to decreased hepatic synthesis of clotting factors; indicates severity of liver dysfunction",
      "Liver biopsy (definitive but rarely needed): shows microvesicular fatty infiltration of hepatocytes without inflammation or necrosis",
      "CT or MRI of brain: may show diffuse cerebral edema; used to rule out other causes of encephalopathy and guide ICP management decisions"
    ],
    management: [
      "Immediate ICU admission for continuous monitoring of neurological status, ICP, and hemodynamic parameters",
      "Maintain blood glucose above 4.0 mmol/L (72 mg/dL) with IV dextrose 10-25% infusion; hypoglycemia worsens cerebral injury",
      "Reduce cerebral edema and elevated ICP: elevate head of bed 30 degrees, maintain head midline, avoid neck flexion, administer mannitol or hypertonic saline as ordered",
      "Correct coagulopathy with fresh frozen plasma (FFP) or vitamin K as ordered; avoid intramuscular injections due to bleeding risk",
      "Restrict fluids to two-thirds maintenance to reduce cerebral edema while maintaining adequate perfusion",
      "Monitor ammonia levels serially; lactulose may be administered to reduce intestinal ammonia production",
      "Avoid all hepatotoxic medications and aspirin-containing products; ensure the family understands permanent aspirin avoidance"
    ],
    nursingActions: [
      "Perform neurological assessments every 1-2 hours using the Glasgow Coma Scale (GCS) and pupil checks; report any decline immediately",
      "Monitor blood glucose every 1-2 hours; administer IV dextrose as ordered to maintain normoglycemia -- hypoglycemia is a preventable cause of additional brain injury",
      "Monitor for signs of increased ICP: headache, vomiting (without nausea), altered level of consciousness, unequal pupils, Cushing triad (bradycardia, hypertension, irregular respirations)",
      "Maintain strict intake and output; fluid restriction is typically ordered to reduce cerebral edema",
      "Assess for bleeding from all sites (IV punctures, gums, stool) due to coagulopathy; apply pressure to venipuncture sites for extended periods",
      "Educate family that aspirin and all salicylate-containing products must NEVER be given to children or adolescents during febrile illness",
      "Document staging progression accurately; rapid progression through stages indicates worsening prognosis and need for escalated intervention"
    ],
    assessmentFindings: [
      "Persistent, projectile vomiting 1-3 days after viral illness (often the first symptom; occurs in over 90% of cases)",
      "Progressive change in level of consciousness: irritability progressing to lethargy, confusion, combativeness, then stupor and coma",
      "Hepatomegaly without jaundice (liver is enlarged and fatty but not obstructed)",
      "Hyperventilation (central neurogenic pattern) in early stages as cerebral edema develops",
      "Hypoglycemia presenting as diaphoresis, tremors, seizures, or altered consciousness",
      "Signs of increased ICP: bulging fontanelle in infants, papilledema, unequal or fixed dilated pupils, Cushing triad",
      "Abnormal posturing: decorticate (flexion, Stage III) progressing to decerebrate (extension, Stage IV) indicates worsening cerebral involvement"
    ],
    signs: {
      left: [
        "Persistent vomiting following recent viral illness",
        "Irritability or behavioral changes",
        "Mild lethargy or drowsiness",
        "Low-grade fever",
        "Hepatomegaly on palpation",
        "Mild tachycardia"
      ],
      right: [
        "Rapid deterioration in level of consciousness (GCS declining)",
        "Seizures or abnormal posturing (decorticate or decerebrate)",
        "Fixed, dilated pupils (indicating brainstem herniation)",
        "Cushing triad: bradycardia, systolic hypertension, irregular respirations",
        "Severe hypoglycemia (blood glucose below 2.5 mmol/L or 45 mg/dL)",
        "Frank bleeding from multiple sites (coagulopathy with DIC)"
      ]
    },
    medications: [
      {
        name: "Mannitol (Osmitrol)",
        type: "Osmotic diuretic / intracranial pressure-reducing agent",
        action: "Creates an osmotic gradient across the blood-brain barrier by increasing serum osmolality, drawing water out of swollen brain tissue (astrocytes) into the intravascular space, thereby reducing cerebral edema and lowering intracranial pressure",
        sideEffects: "Hypovolemia from excessive diuresis, electrolyte imbalances (hyponatremia, hypokalemia), rebound increased ICP with repeated doses, acute kidney injury at high cumulative doses",
        contra: "Anuria (established renal failure), severe dehydration, active intracranial bleeding, severe pulmonary edema or heart failure",
        pearl: "Administer through an in-line filter to prevent crystallized particles from entering the bloodstream; monitor serum osmolality (hold if above 320 mOsm/L); check urine output hourly -- mannitol is ineffective if the kidneys cannot excrete the osmotic load"
      },
      {
        name: "Dextrose 10-25% IV Solution",
        type: "Carbohydrate / glucose replacement",
        action: "Provides exogenous glucose directly to the bloodstream to correct and prevent hypoglycemia; glucose is the primary energy substrate for the brain, and maintaining normoglycemia is essential to prevent additional neuronal injury in Reye syndrome",
        sideEffects: "Hyperglycemia (with excessive administration), fluid overload, phlebitis at peripheral IV site (concentrations above 12.5% require central venous access), rebound hypoglycemia if discontinued abruptly",
        contra: "Diabetic coma with marked hyperglycemia (not applicable in Reye syndrome context); use caution with fluid-restricted patients -- balance glucose delivery with fluid restriction goals",
        pearl: "Monitor blood glucose every 1-2 hours during acute phase; dextrose concentrations above 12.5% must be infused through a central line to prevent peripheral vein damage; goal is to maintain blood glucose between 4.0-8.0 mmol/L (72-144 mg/dL)"
      },
      {
        name: "Lactulose (Duphalac/Kristalose)",
        type: "Osmotic laxative / ammonia-reducing agent",
        action: "Reaches the colon undigested where colonic bacteria break it down into lactic acid and acetic acid, lowering colonic pH. The acidic environment converts ammonia (NH3) to ammonium (NH4+), which cannot cross the intestinal mucosa back into the blood, effectively trapping ammonia in the colon for fecal excretion and reducing serum ammonia levels",
        sideEffects: "Diarrhea (therapeutic effect but can cause dehydration and electrolyte loss), abdominal cramping, bloating, flatulence, nausea, hypernatremia from fluid losses",
        contra: "Galactosemia (lactulose contains galactose and lactose); use caution in patients with diabetes (contains small amounts of absorbable sugars); bowel obstruction",
        pearl: "Goal is 2-3 soft stools per day; excessive diarrhea causes dehydration and electrolyte depletion which can worsen the clinical picture; monitor serum ammonia levels to gauge effectiveness; may be given orally or as a retention enema"
      }
    ],
    pearls: [
      "The single most important teaching point: NEVER give aspirin or any salicylate-containing product to children or adolescents (under 19 years) during a febrile or viral illness -- this is the primary preventable cause of Reye syndrome",
      "Reye syndrome typically presents 3-5 days after the onset of a viral illness with sudden, persistent vomiting followed by progressive encephalopathy -- the vomiting-then-confusion sequence after a viral illness is the classic red flag",
      "Bismuth subsalicylate (Pepto-Bismol) contains salicylate and must also be avoided in children -- many families do not realize this product contains aspirin-like compounds",
      "The liver in Reye syndrome is enlarged and fatty but NOT jaundiced -- this distinguishes it from hepatitis and biliary obstruction where jaundice is prominent",
      "Hypoglycemia is a major contributor to brain injury in Reye syndrome and is correctable -- maintaining blood glucose with IV dextrose is one of the most impactful nursing interventions",
      "Staging from I to V correlates with prognosis: survival is over 90% if treated at Stage I-II but drops dramatically at Stage IV-V -- early recognition and reporting of neurological changes can be life-saving",
      "Acetaminophen (Tylenol) is the SAFE alternative to aspirin for fever and pain management in children with viral illness -- reinforce this in all pediatric patient and family education"
    ],
    quiz: [
      {
        question: "A parent asks the practical nurse why aspirin should not be given to their 8-year-old child who has influenza. Which response by the nurse is most accurate?",
        options: [
          "Aspirin causes allergic reactions more often in children than adults",
          "Aspirin use during viral illness in children is associated with Reye syndrome, a potentially fatal liver and brain condition",
          "Aspirin is less effective for fever reduction in children compared to adults",
          "Aspirin causes stomach ulcers in all pediatric patients"
        ],
        correct: 1,
        rationale: "Aspirin (acetylsalicylic acid) use during viral illness in children and adolescents is strongly associated with Reye syndrome, a rare but potentially fatal condition causing acute hepatic failure and encephalopathy. Acetaminophen or ibuprofen are safe alternatives for pediatric fever management."
      },
      {
        question: "A practical nurse is monitoring a 6-year-old admitted with suspected Reye syndrome. Which assessment finding requires the MOST urgent notification to the physician?",
        options: [
          "Blood glucose of 4.5 mmol/L (81 mg/dL)",
          "One episode of vomiting after oral intake",
          "Unequal pupils with decreasing level of consciousness",
          "Temperature of 38.2 degrees Celsius (100.8 degrees Fahrenheit)"
        ],
        correct: 2,
        rationale: "Unequal (anisocoric) pupils with decreasing level of consciousness are signs of increasing intracranial pressure and possible brainstem herniation, which is a life-threatening emergency requiring immediate intervention. This finding indicates progression from early to late stages of Reye syndrome."
      },
      {
        question: "A child with Reye syndrome has a blood glucose of 2.8 mmol/L (50 mg/dL). Which intervention does the practical nurse anticipate?",
        options: [
          "Oral glucose gel applied to buccal mucosa",
          "Subcutaneous insulin administration",
          "Intravenous dextrose infusion as prescribed",
          "Withholding fluids to reduce cerebral edema"
        ],
        correct: 2,
        rationale: "Hypoglycemia in Reye syndrome is treated with IV dextrose infusion to rapidly and reliably correct blood glucose. Oral glucose is inappropriate in a child with altered consciousness (aspiration risk), insulin would worsen hypoglycemia, and fluid restriction alone does not address the glucose deficit."
      }
    ]
  },

  "rh-incompatibility-rpn": {
    title: "Rh Incompatibility for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Rh Incompatibility and Isoimmunization",
      content: "Rh incompatibility is a condition that occurs when an Rh-negative (Rh-D negative) mother carries an Rh-positive (Rh-D positive) fetus, creating the potential for maternal isoimmunization (also called alloimmunization or Rh sensitization). The Rh factor refers to the D antigen on the surface of red blood cells; approximately 15% of Caucasian populations and 5-8% of African and Asian populations are Rh-negative, meaning they lack the D antigen. When fetal Rh-positive red blood cells cross the placenta and enter the maternal circulation (fetomaternal hemorrhage), the mother's immune system recognizes the D antigen as foreign and mounts an immune response. During the first exposure (usually the first pregnancy with an Rh-positive fetus), the mother produces IgM antibodies, which are large molecules that cannot cross the placenta and therefore do not harm the first fetus. However, this initial exposure creates memory B cells that are primed to respond rapidly. In subsequent pregnancies with an Rh-positive fetus, even a small amount of fetal blood entering the maternal circulation triggers a rapid secondary immune response producing IgG anti-D antibodies, which are small enough to cross the placenta. These maternal IgG antibodies attach to the D antigen on fetal red blood cells, marking them for destruction by the fetal reticuloendothelial system (primarily the spleen). The resulting hemolysis causes fetal anemia, which stimulates compensatory extramedullary hematopoiesis (red blood cell production in the liver and spleen), leading to hepatosplenomegaly. Severe anemia triggers high-output cardiac failure in the fetus. The breakdown of hemoglobin from destroyed red blood cells produces unconjugated (indirect) bilirubin. While the fetus is in utero, this bilirubin crosses the placenta and is metabolized by the mother's liver; however, after birth, the newborn's immature liver cannot conjugate the massive bilirubin load, resulting in severe hyperbilirubinemia and jaundice within the first 24 hours of life (pathological jaundice). If unconjugated bilirubin levels rise high enough, bilirubin crosses the blood-brain barrier and deposits in the basal ganglia and brainstem nuclei, causing kernicterus (bilirubin encephalopathy) -- an irreversible condition manifesting as cerebral palsy, hearing loss, intellectual disability, and potentially death. The most severe form of Rh hemolytic disease is hydrops fetalis, characterized by generalized edema, ascites, pleural and pericardial effusions, and severe anemia, often resulting in intrauterine or neonatal death if untreated. Prevention through administration of Rho(D) immune globulin (RhoGAM/WinRho) to unsensitized Rh-negative mothers has dramatically reduced the incidence of Rh hemolytic disease from approximately 1% of all pregnancies to fewer than 0.1%."
    },
    riskFactors: [
      "Rh-negative mother with Rh-positive partner (the fetus may inherit the D antigen from the father)",
      "Previous pregnancy with Rh-positive fetus without Rho(D) immune globulin prophylaxis",
      "History of miscarriage, ectopic pregnancy, or elective termination without receiving Rho(D) immune globulin",
      "Invasive prenatal procedures (amniocentesis, chorionic villus sampling, cordocentesis) causing fetomaternal hemorrhage",
      "Placental abruption, placenta previa, or abdominal trauma during pregnancy (increased risk of fetomaternal hemorrhage)",
      "Manual removal of placenta or traumatic delivery causing significant placental disruption",
      "Previous blood transfusion with Rh-positive blood (rare but causes immediate sensitization)"
    ],
    diagnostics: [
      "ABO and Rh typing on mother at first prenatal visit: identifies Rh-negative status requiring prophylaxis and monitoring throughout pregnancy",
      "Indirect Coombs test (indirect antiglobulin test/IAT) on mother: detects presence of anti-D antibodies in maternal serum; positive result indicates sensitization has occurred; performed at 28 weeks and at delivery",
      "Direct Coombs test (direct antiglobulin test/DAT) on newborn cord blood: detects maternal antibodies already attached to fetal red blood cells; positive result confirms hemolytic disease of the newborn",
      "Kleihauer-Betke test (acid elution test): quantifies volume of fetal blood in maternal circulation after a suspected fetomaternal hemorrhage; determines if additional doses of Rho(D) immune globulin are needed",
      "Serial serum bilirubin levels on newborn: total and direct bilirubin; unconjugated (indirect) bilirubin is the neurotoxic fraction; plotted on hour-specific nomogram (Bhutani curve) to determine treatment threshold",
      "Middle cerebral artery (MCA) Doppler ultrasound: noninvasive method to assess fetal anemia in utero; increased peak systolic velocity indicates severe fetal anemia requiring intervention"
    ],
    management: [
      "Administer Rho(D) immune globulin (RhoGAM) 300 mcg intramuscularly at 28 weeks gestation AND within 72 hours after delivery of an Rh-positive infant to prevent sensitization",
      "Administer Rho(D) immune globulin after any sensitizing event: miscarriage, ectopic pregnancy, amniocentesis, abdominal trauma, vaginal bleeding, or manual placental removal",
      "Initiate phototherapy for newborn hyperbilirubinemia as ordered: blue-green light (wavelength 460-490 nm) converts unconjugated bilirubin in the skin into water-soluble photoisomers that can be excreted without hepatic conjugation",
      "Prepare for exchange transfusion if bilirubin levels reach critical thresholds despite phototherapy: removes sensitized red blood cells and circulating antibodies while providing compatible blood",
      "Monitor newborn closely for progressive jaundice, anemia, and neurological signs in the first 24-72 hours of life",
      "Ensure cord blood is sent for blood type, Rh factor, direct Coombs test, and hemoglobin/hematocrit immediately after delivery",
      "Provide Rh-negative blood products if the newborn requires transfusion to avoid introducing additional D antigen"
    ],
    nursingActions: [
      "Verify maternal Rh status at admission to labor and delivery; confirm whether Rho(D) immune globulin was administered at 28 weeks",
      "Ensure cord blood specimens are collected and sent immediately after delivery for type, Rh, direct Coombs test, hemoglobin, and bilirubin",
      "Monitor newborn for jaundice within the first 24 hours of life -- jaundice appearing before 24 hours is ALWAYS pathological and requires immediate investigation",
      "Assess newborn for signs of hemolytic anemia: pallor, tachycardia, hepatosplenomegaly, poor feeding, lethargy",
      "During phototherapy: ensure maximum skin exposure, protect eyes with opaque shields, monitor temperature (risk of hyperthermia), maintain adequate hydration, track stool output (bilirubin excreted in stool)",
      "Educate the Rh-negative mother about the importance of receiving Rho(D) immune globulin with EVERY pregnancy and after every sensitizing event, regardless of pregnancy outcome",
      "Document all Rho(D) immune globulin administration including lot number, dose, injection site, and time; verify correct patient identification before administration"
    ],
    assessmentFindings: [
      "Jaundice appearing within the first 24 hours of life (pathological, NOT physiological -- always requires investigation and reporting)",
      "Pale, edematous newborn at birth (hydrops fetalis in severe cases): generalized edema, ascites, pleural effusions",
      "Hepatosplenomegaly in the newborn due to extramedullary hematopoiesis (liver and spleen producing red blood cells to compensate for hemolysis)",
      "Positive direct Coombs test on cord blood confirming maternal antibodies are attached to fetal red blood cells",
      "Elevated indirect (unconjugated) bilirubin rising at a rate greater than 5 mg/dL per 24 hours (indicates active hemolysis)",
      "Low hemoglobin and hematocrit at birth with elevated reticulocyte count (compensatory response to red blood cell destruction)",
      "High-pitched cry, hypotonia, poor feeding, and opisthotonos (arched back) in the newborn -- late signs of kernicterus indicating bilirubin neurotoxicity"
    ],
    signs: {
      left: [
        "Mild jaundice appearing after 24 hours (may be physiological)",
        "Positive indirect Coombs test in mother (antibodies present but low titer)",
        "Mildly elevated bilirubin with slow rise rate",
        "Newborn feeding well with normal activity level",
        "Slight hepatomegaly on palpation",
        "Mild anemia (hemoglobin 130-150 g/L in newborn)"
      ],
      right: [
        "Jaundice within the first 24 hours of life (always pathological)",
        "Bilirubin rising more than 85 micromol/L (5 mg/dL) per 24 hours",
        "Signs of kernicterus: high-pitched cry, hypotonia, opisthotonos, poor feeding, seizures",
        "Hydrops fetalis: generalized edema, ascites, respiratory distress at birth",
        "Severe anemia with hemoglobin below 100 g/L requiring transfusion",
        "Cardiovascular compromise: tachycardia, poor perfusion, hepatosplenomegaly"
      ]
    },
    medications: [
      {
        name: "Rho(D) Immune Globulin (RhoGAM/WinRho)",
        type: "Immune globulin / passive immunization agent",
        action: "Contains preformed anti-D antibodies that bind to and destroy any Rh-positive fetal red blood cells circulating in the Rh-negative mother's bloodstream BEFORE her own immune system can recognize the D antigen and produce memory B cells. This prevents primary isoimmunization (sensitization), thereby protecting future Rh-positive pregnancies from hemolytic disease",
        sideEffects: "Injection site pain and tenderness, low-grade fever, mild myalgia, headache; rarely allergic reactions or anaphylaxis (contains human plasma proteins)",
        contra: "Rh-positive mother (product is only for Rh-negative individuals); previously sensitized Rh-negative mother with confirmed high anti-D antibody titers (sensitization has already occurred and cannot be reversed); IgA deficiency with known anti-IgA antibodies (risk of anaphylaxis)",
        pearl: "Must be administered within 72 hours of a sensitizing event for maximum effectiveness; standard dose is 300 mcg IM which covers up to 30 mL of fetomaternal hemorrhage; if Kleihauer-Betke test indicates larger hemorrhage, additional doses are required; the medication is a BLOOD PRODUCT -- follow facility blood product administration policies"
      },
      {
        name: "Phototherapy (Bili Lights / Fiber-optic Blanket)",
        type: "Non-pharmacological treatment / bilirubin reduction therapy",
        action: "Blue-green light at wavelength 460-490 nm penetrates the skin and converts unconjugated (indirect) bilirubin into water-soluble structural and configurational photoisomers (lumirubin) that can be excreted by the kidneys and liver without requiring hepatic conjugation, effectively bypassing the newborn's immature glucuronidation pathway",
        sideEffects: "Insensible water loss (dehydration risk), temperature instability (hyperthermia or hypothermia), skin rash (bronze baby syndrome if direct bilirubin is elevated), retinal damage if eyes are not protected, loose green stools (bilirubin excretion), parent-infant bonding disruption",
        contra: "Porphyria (phototherapy can worsen porphyrin-related skin damage); conjugated (direct) hyperbilirubinemia (phototherapy is ineffective and causes bronze baby syndrome); always investigate cause of jaundice before initiating",
        pearl: "Maximize skin exposure by removing clothing (except diaper); keep eyes covered with opaque shields at ALL times during therapy; monitor temperature every 2-4 hours; increase fluid intake by 20-25% to compensate for insensible losses; rebound bilirubin measurement 12-24 hours after discontinuation to ensure levels remain stable"
      },
      {
        name: "Exchange Transfusion (packed RBCs with fresh frozen plasma)",
        type: "Blood product / mechanical bilirubin reduction procedure",
        action: "Removes the newborn's sensitized (antibody-coated) red blood cells, circulating maternal IgG anti-D antibodies, and excess unconjugated bilirubin from the bloodstream while simultaneously replacing with compatible (Rh-negative) packed red blood cells and plasma, rapidly correcting anemia, reducing bilirubin levels, and eliminating the ongoing hemolytic process",
        sideEffects: "Electrolyte imbalances (hypocalcemia from citrate in stored blood, hyperkalemia), cardiac dysrhythmias, thrombocytopenia, infection risk, necrotizing enterocolitis, air embolism, hypothermia from cold blood products, transfusion reactions",
        contra: "Hemodynamically unstable infant who cannot tolerate the procedure; coagulopathy must be corrected before central line placement; facility must have appropriate NICU capabilities and trained personnel",
        pearl: "Performed as a double-volume exchange (twice the newborn's blood volume, approximately 160 mL/kg) to remove approximately 85% of sensitized cells; monitor blood glucose, calcium, and potassium before, during, and after the procedure; keep the infant on continuous cardiac monitoring throughout; this is a last-resort intervention when phototherapy fails to control bilirubin rise"
      }
    ],
    pearls: [
      "Rho(D) immune globulin (RhoGAM) is given at 28 weeks gestation AND within 72 hours postpartum to ALL unsensitized Rh-negative mothers delivering Rh-positive infants -- it is a PREVENTIVE measure and cannot reverse existing sensitization",
      "The indirect Coombs test detects antibodies floating in the mother's SERUM; the direct Coombs test detects antibodies already ATTACHED to the baby's red blood cells -- think Indirect = In mom's blood, Direct = on baby's cells (D = Direct = attached to cells Directly)",
      "Jaundice appearing within the first 24 hours of life is NEVER physiological -- it always indicates a pathological process such as hemolytic disease and must be investigated and reported immediately",
      "Physiological jaundice appears after 24-48 hours and peaks at day 3-5 in term infants; pathological jaundice appears before 24 hours, rises rapidly, and requires treatment",
      "Kernicterus (bilirubin encephalopathy) is PREVENTABLE -- the key is early recognition of rising bilirubin levels and timely initiation of phototherapy before neurotoxic levels are reached",
      "During phototherapy, protect the newborn's eyes with opaque shields, maximize skin exposure, increase fluids by 20-25%, and monitor temperature -- dehydration and temperature instability are common complications",
      "The practical nurse must verify that Rho(D) immune globulin is administered after EVERY sensitizing event (miscarriage, ectopic pregnancy, amniocentesis, abdominal trauma, delivery) -- even if the pregnancy does not continue to term"
    ],
    quiz: [
      {
        question: "An Rh-negative mother delivers an Rh-positive newborn. The practical nurse knows that Rho(D) immune globulin should be administered within what time frame after delivery?",
        options: [
          "Within 24 hours",
          "Within 48 hours",
          "Within 72 hours",
          "Within 7 days"
        ],
        correct: 2,
        rationale: "Rho(D) immune globulin (RhoGAM) must be administered within 72 hours after delivery of an Rh-positive infant to an unsensitized Rh-negative mother. This timing allows the medication to destroy fetal Rh-positive red blood cells in the maternal circulation before the mother's immune system can produce memory B cells and become permanently sensitized."
      },
      {
        question: "A newborn born to an Rh-negative mother develops visible jaundice 12 hours after birth. Which action by the practical nurse is the HIGHEST priority?",
        options: [
          "Place the newborn near a window for natural light exposure",
          "Report the finding immediately because jaundice within 24 hours is always pathological",
          "Document the finding and reassess at the next scheduled assessment",
          "Encourage frequent breastfeeding to promote bilirubin excretion"
        ],
        correct: 1,
        rationale: "Jaundice appearing within the first 24 hours of life is always pathological and never physiological. In the context of Rh incompatibility, early jaundice indicates active hemolysis of fetal red blood cells by maternal antibodies. This finding requires immediate reporting and investigation to prevent dangerously high bilirubin levels and kernicterus."
      },
      {
        question: "A practical nurse is caring for a newborn receiving phototherapy for hyperbilirubinemia. Which intervention is essential during treatment?",
        options: [
          "Apply eye shields to both eyes to protect the retinas from light damage",
          "Dress the newborn in a full outfit to maintain body temperature",
          "Decrease fluid intake to prevent fluid overload",
          "Keep the newborn in a prone position at all times"
        ],
        correct: 0,
        rationale: "Opaque eye shields must be applied to both eyes during phototherapy to prevent retinal damage from the therapeutic light. Maximum skin exposure is needed (clothing removed except diaper), fluids should be INCREASED by 20-25% to compensate for insensible water losses, and the newborn should be repositioned regularly to maximize light exposure to different skin surfaces."
      }
    ]
  },

  "rom-assessment-rpn": {
    title: "Rupture of Membranes Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of the Amniotic Membranes and Rupture Assessment",
      content: "The amniotic membranes consist of two distinct layers that form a continuous, fluid-filled sac surrounding the developing fetus throughout pregnancy. The inner layer is the amnion, a thin, tough, avascular membrane that is in direct contact with the amniotic fluid. The outer layer is the chorion, a thicker membrane that lies adjacent to the decidua (the modified endometrium of pregnancy) and contains blood vessels. Together, these membranes serve critical protective functions: they contain the amniotic fluid that cushions the fetus, maintains a stable temperature, allows fetal movement for musculoskeletal development, prevents infection by creating a sterile barrier between the fetus and the vaginal flora, and prevent compression of the umbilical cord. Normal amniotic fluid volume at term is approximately 800-1000 mL and is primarily composed of fetal urine, lung secretions, and transudation across fetal skin (in early gestation). The fluid is continuously produced and reabsorbed; the fetus swallows approximately 500-1000 mL of amniotic fluid per day and urinates to maintain fluid balance. Amniotic fluid has a characteristic pH of 7.0-7.5, which is alkaline compared to normal vaginal secretions that have a pH of 3.5-4.5. This pH difference forms the basis of the nitrazine test for rupture of membranes. Spontaneous rupture of membranes (SROM) normally occurs during active labor as a result of increased intrauterine pressure from contractions, enzymatic weakening of the membrane at the internal cervical os, and mechanical stretching. Premature rupture of membranes (PROM) is defined as rupture occurring before the onset of labor at any gestational age. Preterm premature rupture of membranes (PPROM) is rupture before 37 weeks gestation and before the onset of labor, and represents a significant obstetric emergency because it simultaneously exposes the preterm fetus to infection risk (chorioamnionitis) and the complications of prematurity. The three major risks following rupture of membranes are ascending infection (chorioamnionitis), umbilical cord prolapse (particularly if the presenting part is not well-engaged in the pelvis), and preterm delivery. Assessment of ruptured membranes relies on clinical history, physical examination, and confirmatory testing. The nitrazine test uses indicator paper that turns blue (positive) when exposed to alkaline amniotic fluid (pH 7.0-7.5); false positives can occur with blood, semen, vaginitis, or alkaline urine. The fern test (arborization test) involves placing dried vaginal fluid on a glass slide and examining under a microscope for a characteristic crystalline ferning pattern produced by the electrolytes (sodium chloride) in amniotic fluid. Definitive testing with AmniSure (placental alpha microglobulin-1 immunoassay) or ROM Plus (placental alpha microglobulin-1 and insulin-like growth factor binding protein-1) provides highly sensitive and specific confirmation when clinical assessment is equivocal."
    },
    riskFactors: [
      "History of previous PROM or PPROM in prior pregnancies (recurrence risk 15-30%)",
      "Genital tract infections: bacterial vaginosis, Group B Streptococcus, chlamydia, gonorrhea (infections weaken membranes through enzymatic degradation)",
      "Polyhydramnios (excessive amniotic fluid increases mechanical stress on membranes)",
      "Multiple gestation (twins, triplets) causing overdistension of the uterine wall and membranes",
      "Cervical insufficiency or history of cervical cerclage or cone biopsy",
      "Cigarette smoking during pregnancy (tobacco metabolites impair collagen synthesis in amniotic membranes)",
      "Low socioeconomic status and inadequate prenatal care (associated with untreated infections and nutritional deficiencies)"
    ],
    diagnostics: [
      "Nitrazine test (pH indicator): amniotic fluid turns nitrazine paper blue (alkaline, pH 7.0-7.5) vs. vaginal secretions which leave paper yellow-green (acidic, pH 3.5-4.5); false positives with blood, semen, or bacterial vaginosis",
      "Ferning test (arborization): vaginal fluid dried on a glass slide and examined under microscope; crystalline fern-like pattern confirms amniotic fluid due to sodium chloride and protein content; false negatives occur with heavy contamination",
      "Sterile speculum examination: direct visualization of fluid pooling in the posterior vaginal fornix; asking patient to cough or bear down (Valsalva) may demonstrate a gush of clear fluid from the cervical os",
      "AmniSure immunoassay (PAMG-1 test): detects placental alpha microglobulin-1 in vaginal secretions; highly sensitive (98.9%) and specific (99.1%) for amniotic fluid; used when nitrazine and fern tests are equivocal",
      "Ultrasound for amniotic fluid index (AFI): oligohydramnios (AFI less than 5 cm or deepest pocket less than 2 cm) supports the diagnosis of ROM when combined with clinical findings",
      "Group B Streptococcus (GBS) vaginal-rectal culture: obtained at time of ROM assessment if GBS status is unknown; positive status requires intrapartum antibiotic prophylaxis"
    ],
    management: [
      "At term (37 weeks or greater) with confirmed ROM: expectant management for up to 12-18 hours if GBS-negative, or immediate induction of labor with oxytocin as ordered; antibiotics for GBS-positive mothers",
      "PPROM (less than 37 weeks): admit for latency antibiotics, antenatal corticosteroids for fetal lung maturation (if 24-34 weeks), continuous fetal monitoring, and expectant management to prolong pregnancy while monitoring for chorioamnionitis",
      "Administer antenatal corticosteroids (betamethasone) as prescribed between 24-34 weeks gestation to accelerate fetal lung surfactant production and reduce neonatal respiratory distress, intraventricular hemorrhage, and necrotizing enterocolitis",
      "Administer latency antibiotics (typically ampicillin IV plus erythromycin for 7 days) to prolong the latency period in PPROM and reduce maternal and neonatal infection",
      "Continuous electronic fetal monitoring to assess fetal heart rate patterns: variable decelerations suggest cord compression (possible cord prolapse), and tachycardia or loss of variability suggests infection",
      "Monitor maternal temperature every 4 hours and report temperature above 38.0 degrees Celsius (100.4 degrees Fahrenheit) with uterine tenderness as these suggest chorioamnionitis",
      "Maintain strict bedrest or activity restriction as ordered; avoid digital vaginal examinations to reduce infection risk -- use sterile speculum examination only"
    ],
    nursingActions: [
      "Document time of membrane rupture, amount, color, and odor of fluid: clear fluid is normal; green or brown fluid suggests meconium staining; foul-smelling or cloudy fluid suggests infection",
      "Perform nitrazine test correctly: use a sterile speculum to collect fluid from the posterior vaginal fornix; touch nitrazine paper to the fluid -- BLUE indicates positive (alkaline/amniotic fluid)",
      "Assess fetal heart rate immediately after ROM confirmation: rule out cord prolapse by checking for variable decelerations, bradycardia, or other non-reassuring patterns",
      "Monitor maternal vital signs every 4 hours with emphasis on temperature: fever (above 38.0 degrees Celsius), tachycardia (above 100 bpm), and uterine tenderness suggest chorioamnionitis",
      "Maintain strict perineal hygiene and use sterile pads to collect ongoing fluid loss for assessment of volume and characteristics",
      "Avoid digital vaginal examinations unless delivery is imminent -- each digital examination introduces bacteria and increases infection risk in the setting of ruptured membranes",
      "Educate the patient to report any change in fluid color (especially green or brown indicating meconium), foul odor, fever, chills, or decreased fetal movement immediately"
    ],
    assessmentFindings: [
      "Patient reports a sudden gush or a persistent slow leak of clear, watery fluid from the vagina that is not controlled by Kegel exercises (distinguishes from urinary incontinence)",
      "Positive nitrazine test: paper turns blue indicating alkaline pH consistent with amniotic fluid (pH 7.0-7.5)",
      "Positive ferning pattern on microscopy: crystalline arborization pattern visible on air-dried vaginal fluid specimen",
      "Visible pooling of clear fluid in the posterior vaginal fornix during sterile speculum examination",
      "Decreased amniotic fluid on ultrasound (oligohydramnios) following reported fluid loss",
      "Normal amniotic fluid characteristics: clear to slightly straw-colored, mild or no odor, not blood-tinged",
      "Abnormal fluid characteristics requiring immediate reporting: meconium-stained (green/brown), foul-smelling (infection), bloody (placental abruption)"
    ],
    signs: {
      left: [
        "Clear, odorless fluid leaking or pooling from the vagina",
        "Positive nitrazine test (blue paper) and positive fern test",
        "Reassuring fetal heart rate pattern after ROM",
        "Maternal temperature within normal range",
        "No uterine tenderness on palpation",
        "Contractions beginning spontaneously after ROM at term"
      ],
      right: [
        "Meconium-stained amniotic fluid (green or brown color indicating fetal distress)",
        "Foul-smelling or cloudy fluid (chorioamnionitis)",
        "Maternal fever above 38.0 degrees Celsius with uterine tenderness and maternal tachycardia",
        "Variable decelerations or fetal bradycardia (suggesting umbilical cord prolapse)",
        "Visible or palpable umbilical cord at the vaginal introitus (cord prolapse emergency)",
        "PPROM at less than 34 weeks gestation (preterm delivery risk with prematurity complications)"
      ]
    },
    medications: [
      {
        name: "Ampicillin IV (with Erythromycin)",
        type: "Aminopenicillin antibiotic (latency antibiotic regimen)",
        action: "Ampicillin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins, disrupting peptidoglycan cross-linking, and causing bacterial cell lysis. In PPROM, the combination with erythromycin provides broad-spectrum coverage against common vaginal and cervical flora (including Group B Streptococcus, E. coli, and anaerobes) to prevent ascending infection and chorioamnionitis, thereby prolonging the latency period between membrane rupture and delivery",
        sideEffects: "Diarrhea, nausea, vomiting, allergic reactions (rash, urticaria, anaphylaxis), Clostridioides difficile-associated diarrhea, yeast infections (vaginal candidiasis)",
        contra: "Known penicillin or cephalosporin allergy (cross-reactivity); history of anaphylaxis to any beta-lactam antibiotic; infectious mononucleosis (ampicillin causes maculopapular rash in mononucleosis)",
        pearl: "Standard PPROM latency regimen: ampicillin 2g IV every 6 hours for 48 hours, then amoxicillin 250mg orally every 8 hours for 5 days, PLUS erythromycin 250mg IV every 6 hours for 48 hours then orally for 5 days; this regimen has been shown to prolong pregnancy by an average of 7 days and reduce neonatal infections"
      },
      {
        name: "Betamethasone (Celestone Soluspan)",
        type: "Antenatal corticosteroid / fetal lung maturation agent",
        action: "Crosses the placenta and binds to glucocorticoid receptors in fetal type II pneumocytes, stimulating the production of pulmonary surfactant (a phospholipid mixture that reduces alveolar surface tension and prevents alveolar collapse). Also promotes maturation of fetal intestinal mucosa, brain vasculature, and skin, reducing the incidence of respiratory distress syndrome (RDS), intraventricular hemorrhage (IVH), and necrotizing enterocolitis (NEC) in premature infants",
        sideEffects: "Transient maternal hyperglycemia (monitor blood glucose, especially in gestational diabetes), transient decrease in fetal heart rate variability and fetal movement (may last 48-72 hours), maternal insomnia, increased appetite",
        contra: "Systemic fungal infection in the mother; active chorioamnionitis (relative contraindication -- delivery may be prioritized over steroid completion); generally avoided after 37 weeks (fetal lungs are mature)",
        pearl: "Given as 12 mg intramuscularly every 24 hours for 2 doses (total 24 mg); maximum benefit occurs 48 hours after the first dose but some benefit begins within hours; a single rescue course may be given if delivery has not occurred within 14 days of the initial course and gestational age is still less than 34 weeks"
      },
      {
        name: "Erythromycin",
        type: "Macrolide antibiotic (latency antibiotic component)",
        action: "Binds to the 50S ribosomal subunit of bacteria, inhibiting translocation of aminoacyl transfer-RNA and blocking protein synthesis. Provides coverage against atypical organisms and gram-positive bacteria including Ureaplasma urealyticum, a common genital tract organism associated with PPROM and chorioamnionitis. Works synergistically with ampicillin to provide comprehensive prophylaxis against ascending infection",
        sideEffects: "Nausea, vomiting, abdominal cramping, diarrhea, QT prolongation (use caution with other QT-prolonging drugs), hepatotoxicity (rare, especially with estolate salt), phlebitis at IV site",
        contra: "Known macrolide allergy; concurrent use with cisapride, pimozide, or ergotamine (CYP3A4 inhibition causing dangerous drug interactions); severe hepatic impairment",
        pearl: "Erythromycin is preferred over azithromycin in the PPROM latency regimen based on the original ORACLE trial evidence; monitor IV site closely for phlebitis when given intravenously; GI side effects can be reduced by administering with food (oral form)"
      }
    ],
    pearls: [
      "Nitrazine test interpretation: BLUE equals positive (alkaline amniotic fluid, pH 7.0-7.5); yellow-green equals negative (normal acidic vaginal secretions, pH 3.5-4.5) -- remember 'Blue = Baby fluid' as a memory aid",
      "The fern test confirms amniotic fluid by the characteristic crystalline arborization pattern when vaginal fluid is air-dried on a glass slide and viewed under a microscope -- no other body fluid produces this pattern reliably",
      "NEVER perform a digital vaginal examination when membranes are ruptured unless delivery is imminent -- each digital exam introduces bacteria through the cervix and increases infection risk significantly",
      "After confirming ROM, the immediate priority is assessing fetal heart rate to rule out umbilical cord prolapse -- variable decelerations or sudden bradycardia after ROM requires emergency intervention",
      "Chorioamnionitis is diagnosed clinically by the combination of maternal fever (above 38.0 degrees Celsius), uterine tenderness, maternal or fetal tachycardia, and foul-smelling amniotic fluid -- report ANY of these findings immediately",
      "Meconium-stained amniotic fluid (green or brown color) indicates fetal stress and requires immediate physician notification -- the delivery team must be prepared for potential meconium aspiration syndrome in the newborn",
      "The goal of latency antibiotics in PPROM is to delay delivery by approximately 7 days, allowing time for antenatal corticosteroids to promote fetal lung maturity and improve neonatal outcomes"
    ],
    quiz: [
      {
        question: "A pregnant patient at 36 weeks reports a sudden gush of clear fluid from the vagina. The practical nurse performs a nitrazine test and the paper turns blue. How should the nurse interpret this result?",
        options: [
          "Negative for amniotic fluid; the fluid is likely urine",
          "Positive for amniotic fluid; the alkaline pH is consistent with rupture of membranes",
          "Inconclusive; the test needs to be repeated in 24 hours",
          "Positive for a urinary tract infection requiring antibiotic treatment"
        ],
        correct: 1,
        rationale: "A blue nitrazine result indicates alkaline pH (7.0-7.5), which is consistent with amniotic fluid. Normal vaginal secretions are acidic (pH 3.5-4.5) and would leave the paper yellow-green. This positive result supports a diagnosis of rupture of membranes and requires further assessment including fetal heart rate monitoring."
      },
      {
        question: "A patient with confirmed premature rupture of membranes at 30 weeks gestation asks why she is receiving betamethasone injections. Which explanation by the practical nurse is most accurate?",
        options: [
          "The injections prevent uterine contractions from starting",
          "The injections help the baby's lungs mature more quickly to reduce breathing problems if born early",
          "The injections treat the infection that caused the membranes to rupture",
          "The injections help the ruptured membranes heal and reseal"
        ],
        correct: 1,
        rationale: "Betamethasone is an antenatal corticosteroid administered between 24-34 weeks gestation to accelerate fetal lung maturation by stimulating surfactant production. This reduces the risk of respiratory distress syndrome, intraventricular hemorrhage, and necrotizing enterocolitis if premature delivery occurs. It does not stop contractions, treat infection, or heal ruptured membranes."
      },
      {
        question: "A practical nurse is caring for a patient with PPROM at 32 weeks. Which assessment finding should be reported MOST urgently?",
        options: [
          "Clear amniotic fluid on the perineal pad",
          "Fetal heart rate baseline of 145 bpm with moderate variability",
          "Maternal temperature of 38.5 degrees Celsius with uterine tenderness",
          "Patient reports mild lower back discomfort rated 2 out of 10"
        ],
        correct: 2,
        rationale: "Maternal fever above 38.0 degrees Celsius combined with uterine tenderness are cardinal signs of chorioamnionitis (intra-amniotic infection), which is a serious complication of PPROM requiring immediate antibiotic therapy and likely expedited delivery. This finding takes priority over clear fluid drainage, reassuring fetal heart tones, or mild discomfort."
      }
    ]
  },

  "rsv-rpn": {
    title: "Respiratory Syncytial Virus (RSV) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Respiratory Syncytial Virus Infection",
      content: "Respiratory syncytial virus (RSV) is an enveloped, single-stranded RNA virus of the family Pneumoviridae and is the most common cause of lower respiratory tract infections in infants and young children worldwide. RSV is transmitted through respiratory droplets and direct contact with contaminated surfaces, where the virus can survive for several hours. The virus enters the respiratory tract through the nose, mouth, or eyes and initially infects the nasopharyngeal epithelium. RSV uses its surface fusion (F) protein to fuse with the host cell membrane and enter the cell, where it replicates and then spreads to adjacent cells by causing them to fuse together into large multinucleated cells called syncytia (hence the name syncytial virus). This cell-to-cell fusion allows the virus to spread without being fully exposed to circulating antibodies. From the upper respiratory tract, the virus descends to the lower airways over 1-3 days, infecting the bronchiolar epithelium. In the bronchioles, the infection causes necrosis and sloughing of the ciliated epithelial cells, edema of the bronchiolar walls, increased mucus production from goblet cells, and peribronchiolar infiltration of inflammatory cells (neutrophils and lymphocytes). The combination of epithelial debris, mucus plugging, and inflammatory edema leads to partial or complete obstruction of the small airways (bronchioles). Because infant bronchioles are already very narrow (approximately 0.1 mm in diameter), even small amounts of edema and mucus can cause significant airflow obstruction. According to Poiseuille law, airway resistance is inversely proportional to the fourth power of the radius, meaning that a 50% reduction in bronchiolar radius causes a 16-fold increase in airway resistance. This explains why RSV bronchiolitis is primarily a disease of infancy. The obstruction creates a ball-valve mechanism: air can enter the bronchioles during inspiration (when negative intrathoracic pressure expands the airways) but becomes trapped during expiration (when positive pressure collapses the inflamed airways), leading to air trapping, hyperinflation, and ventilation-perfusion mismatch. Clinical manifestations include tachypnea, expiratory wheezing, subcostal and intercostal retractions, nasal flaring, and hypoxemia. In severe cases, atelectasis occurs when mucus completely plugs bronchioles, preventing any ventilation to the distal alveoli. RSV bronchiolitis typically peaks in severity around days 3-5 of illness, with gradual improvement over 1-2 weeks, though cough may persist for 2-4 weeks. Premature infants (less than 35 weeks gestation), infants with chronic lung disease (bronchopulmonary dysplasia), infants with hemodynamically significant congenital heart disease, and immunocompromised children are at highest risk for severe disease, respiratory failure, and mechanical ventilation. Apnea can be the presenting symptom in very young infants (less than 2 months) with RSV, even before other respiratory symptoms develop, due to immature central respiratory drive compounded by viral infection."
    },
    riskFactors: [
      "Premature birth (less than 35 weeks gestation) with underdeveloped airways and decreased maternal antibody transfer",
      "Age less than 6 months (small airways, immature immune system, limited maternal antibody protection)",
      "Chronic lung disease of prematurity (bronchopulmonary dysplasia) with pre-existing airway inflammation and structural changes",
      "Hemodynamically significant congenital heart disease (increased pulmonary blood flow, pulmonary edema risk)",
      "Immunodeficiency (primary immunodeficiency, immunosuppressive therapy, organ transplant recipients)",
      "Exposure to household tobacco smoke (impaired mucociliary clearance and increased airway inflammation)",
      "Attendance at daycare or crowded living conditions during RSV season (October to March in the Northern Hemisphere)"
    ],
    diagnostics: [
      "Rapid antigen detection test (nasal aspirate or nasopharyngeal swab): provides results within 15-30 minutes; sensitivity 80-90% in infants; most commonly used bedside test for RSV diagnosis",
      "RT-PCR (reverse transcriptase polymerase chain reaction): most sensitive and specific test for RSV; detects viral RNA; used when rapid antigen test is negative but clinical suspicion remains high",
      "Chest X-ray: may show hyperinflation (flattened diaphragms, widened intercostal spaces), peribronchial thickening, patchy atelectasis, and air trapping; helps rule out pneumonia or foreign body aspiration",
      "Pulse oximetry: continuous monitoring is essential; oxygen saturation below 92% on room air indicates need for supplemental oxygen and possible escalation of care",
      "Complete blood count (CBC): typically shows normal or mildly elevated white blood cell count with lymphocyte predominance; significant elevation suggests bacterial superinfection",
      "Arterial or capillary blood gas: obtained in severe cases to assess for respiratory failure (rising PaCO2 indicates ventilatory failure, falling PaO2 indicates oxygenation failure)"
    ],
    management: [
      "Maintain adequate oxygenation: administer supplemental oxygen via nasal cannula, face mask, or high-flow nasal cannula to maintain SpO2 above 92%; titrate based on continuous pulse oximetry",
      "Aggressive nasal suctioning before feeding and as needed: use bulb syringe or mechanical suction to clear nasal secretions; infants are obligate nose breathers, and nasal congestion significantly worsens respiratory distress",
      "Maintain hydration: oral feeds if tolerated, or IV fluids if respiratory rate exceeds 60-70 breaths per minute (aspiration risk increases with severe tachypnea); monitor intake and output, daily weights",
      "Implement contact precautions PLUS standard precautions: gown and gloves for all patient contact; RSV survives on hands for 30 minutes and on surfaces for up to 6 hours; strict hand hygiene is the single most important infection control measure",
      "Position infant with head of bed elevated 30-45 degrees to reduce work of breathing and improve diaphragmatic excretion",
      "Avoid unnecessary interventions: routine bronchodilators and corticosteroids are NOT recommended for RSV bronchiolitis based on current evidence (American Academy of Pediatrics guidelines)",
      "Admit to ICU if respiratory failure develops: mechanical ventilation or high-flow nasal cannula may be required for severe cases with apnea, rising CO2, or persistent hypoxemia despite supplemental oxygen"
    ],
    nursingActions: [
      "Perform respiratory assessment every 2-4 hours or more frequently: monitor respiratory rate, work of breathing (retractions, nasal flaring, grunting), breath sounds (wheezing, crackles, diminished air entry), and oxygen saturation",
      "Suction nasal secretions using bulb syringe or low-wall suction BEFORE feedings and as needed -- nasal congestion directly impairs the infant's ability to feed and breathe simultaneously",
      "Monitor fluid intake and output meticulously: weigh diapers for accurate urine output, track IV fluid rates, and assess for signs of dehydration (decreased urine output, sunken fontanelle, dry mucous membranes, poor skin turgor)",
      "Monitor for apneic episodes, especially in infants less than 2 months old or premature infants -- apply cardiorespiratory monitor and pulse oximetry continuously; stimulate infant gently if apnea occurs",
      "Implement and maintain CONTACT precautions: gown and gloves for all direct contact; cohort RSV-positive patients when possible; perform hand hygiene before and after every patient encounter",
      "Educate caregivers on hand hygiene, avoiding tobacco smoke exposure, keeping the infant away from individuals with respiratory symptoms, and recognizing signs of worsening respiratory distress requiring emergency care",
      "Report any signs of deterioration immediately: increasing respiratory rate above 60-70 breaths per minute, worsening retractions, grunting, cyanosis, apneic episodes, or oxygen saturation dropping below 90% despite supplemental oxygen"
    ],
    assessmentFindings: [
      "Initial presentation mimics common cold: rhinorrhea (runny nose), mild cough, low-grade fever; progresses over 2-4 days to lower respiratory involvement",
      "Tachypnea (respiratory rate above 60 breaths per minute in infants) with increased work of breathing",
      "Expiratory wheezing on auscultation (hallmark finding) -- may progress to diminished breath sounds if obstruction becomes severe (silent chest is ominous)",
      "Subcostal, intercostal, and suprasternal retractions indicating increased work of breathing to overcome airway obstruction",
      "Nasal flaring and head bobbing in infants (signs of respiratory distress)",
      "Fine inspiratory crackles (from fluid and debris in small airways) mixed with expiratory wheezing",
      "Apnea as presenting symptom in very young infants (less than 2 months) -- may occur before wheezing or cough develop"
    ],
    signs: {
      left: [
        "Mild rhinorrhea and cough with low-grade fever",
        "Mild wheezing with adequate air entry bilaterally",
        "Respiratory rate mildly elevated but below 60 breaths per minute",
        "Oxygen saturation above 92% on room air",
        "Feeding adequately with good hydration status",
        "Alert and interactive with normal muscle tone"
      ],
      right: [
        "Severe retractions (subcostal, intercostal, suprasternal) with nasal flaring and grunting",
        "Oxygen saturation below 90% despite supplemental oxygen",
        "Apneic episodes (cessation of breathing for 20 seconds or longer)",
        "Diminished or absent breath sounds (silent chest indicating severe obstruction)",
        "Cyanosis (central or peripheral) indicating severe hypoxemia",
        "Lethargy, poor feeding, or inability to feed due to respiratory distress"
      ]
    },
    medications: [
      {
        name: "Palivizumab (Synagis)",
        type: "Monoclonal antibody / RSV prophylaxis",
        action: "A humanized monoclonal antibody that binds to the fusion (F) protein on the surface of RSV, preventing the virus from fusing with and entering respiratory epithelial cells. This neutralizes the virus and prevents infection or reduces the severity of illness. It provides passive immunity and does NOT stimulate the infant's own immune system to produce antibodies",
        sideEffects: "Injection site reactions (erythema, pain, swelling), fever, rash, upper respiratory infection symptoms, rarely anaphylaxis or thrombocytopenia",
        contra: "Known hypersensitivity to palivizumab or any component; not used for treatment of active RSV infection (prophylaxis only); re-evaluate need annually based on current AAP/CPS guidelines",
        pearl: "Administered intramuscularly at 15 mg/kg once monthly during RSV season (typically November through March); indicated for high-risk infants including those born before 29 weeks gestation, infants with chronic lung disease or hemodynamically significant congenital heart disease; this is prevention, NOT treatment"
      },
      {
        name: "Albuterol (Salbutamol/Ventolin) nebulization",
        type: "Short-acting beta-2 agonist bronchodilator",
        action: "Selectively stimulates beta-2 adrenergic receptors on bronchial smooth muscle, causing relaxation of the smooth muscle and bronchodilation. In RSV bronchiolitis, the primary pathology is mucosal edema and mucus plugging rather than bronchospasm, which is why bronchodilators have limited evidence of benefit in this population",
        sideEffects: "Tachycardia, tremor, jitteriness, hypokalemia, paradoxical bronchospasm (rare), irritability in infants",
        contra: "Known hypersensitivity; use with caution in infants with tachyarrhythmias or congenital heart disease",
        pearl: "Current AAP guidelines recommend AGAINST routine use of bronchodilators in RSV bronchiolitis; however, a one-time trial may be attempted with objective reassessment -- if no measurable improvement in respiratory status (respiratory rate, oxygen saturation, retractions), the medication should be DISCONTINUED rather than continued routinely"
      },
      {
        name: "Normal Saline (0.9% NaCl) nebulization",
        type: "Isotonic saline / mucosal hydration agent",
        action: "When nebulized and inhaled, normal saline provides direct hydration to the inflamed and edematous bronchiolar mucosa, helps loosen thick mucus secretions, and facilitates mucociliary clearance. Hypertonic saline (3%) nebulization may be used in the inpatient setting and has modest evidence for reducing length of hospitalization by further drawing fluid from edematous airway walls through osmotic gradient",
        sideEffects: "Coughing during nebulization (expected and may assist with secretion clearance), bronchospasm (uncommon with isotonic saline but possible with hypertonic), nasal irritation",
        contra: "No absolute contraindications for isotonic (0.9%) saline nebulization; hypertonic (3%) saline should be administered with a bronchodilator in some protocols to prevent bronchospasm",
        pearl: "Normal saline nebulization combined with thorough nasal suctioning is one of the most effective supportive interventions for RSV bronchiolitis -- it directly addresses the mucus plugging component of the disease without pharmacological side effects; often administered before nasal suctioning to loosen secretions"
      }
    ],
    pearls: [
      "RSV is the most common cause of bronchiolitis and pneumonia in infants under 1 year of age -- peak incidence is between 2 and 6 months of age during RSV season (October to March in the Northern Hemisphere)",
      "Nasal suctioning is one of the most impactful nursing interventions for RSV bronchiolitis -- infants are obligate nose breathers, and clearing nasal congestion directly improves both breathing and feeding ability",
      "Contact precautions (gown and gloves) are required for RSV -- the virus spreads through droplets and direct contact; it survives on hands for 30 minutes and on surfaces for up to 6 hours; hand hygiene is the single most effective infection prevention measure",
      "Apnea may be the FIRST sign of RSV in very young infants (less than 2 months) or premature infants, even before cough or wheezing develop -- cardiorespiratory monitoring is essential in this population",
      "Current evidence-based guidelines recommend AGAINST routine use of bronchodilators and corticosteroids in RSV bronchiolitis -- supportive care (oxygen, hydration, suctioning) is the mainstay of treatment",
      "Palivizumab (Synagis) is for PREVENTION only and is given monthly during RSV season to high-risk infants -- it is NOT a treatment for active RSV infection",
      "The practical nurse should educate families that RSV illness typically peaks around days 3-5 and gradually improves over 1-2 weeks, but cough may persist for 2-4 weeks -- parents should seek emergency care if the infant has difficulty breathing, refuses to feed, develops cyanosis, or has apneic episodes"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 3-month-old infant admitted with RSV bronchiolitis. Which infection control precaution is required for this patient?",
        options: [
          "Airborne precautions with an N95 respirator",
          "Contact precautions with gown and gloves for all direct contact",
          "Droplet precautions with a surgical mask only",
          "Standard precautions only with no additional measures"
        ],
        correct: 1,
        rationale: "RSV requires contact precautions (gown and gloves for all direct patient contact) in addition to standard precautions. RSV is transmitted primarily through direct contact with infected secretions and contaminated surfaces. The virus survives on hands for 30 minutes and on hard surfaces for up to 6 hours, making strict hand hygiene and contact precautions essential."
      },
      {
        question: "Which nursing intervention is MOST effective in improving the respiratory status of an infant with RSV bronchiolitis?",
        options: [
          "Administering scheduled albuterol nebulizations every 4 hours",
          "Performing nasal suctioning to clear secretions before feedings and as needed",
          "Administering oral corticosteroids to reduce airway inflammation",
          "Placing the infant in Trendelenburg position to promote drainage"
        ],
        correct: 1,
        rationale: "Nasal suctioning is one of the most effective interventions for RSV bronchiolitis because infants are obligate nose breathers. Clearing nasal secretions directly improves both breathing and feeding ability. Current guidelines recommend against routine use of bronchodilators and corticosteroids in RSV bronchiolitis as evidence does not support their effectiveness."
      },
      {
        question: "A premature infant born at 28 weeks gestation is being discharged home during RSV season. The practical nurse reinforces teaching about palivizumab (Synagis). Which statement by the parent indicates understanding?",
        options: [
          "I will give my baby this medicine if he gets sick with RSV",
          "My baby will receive a monthly injection during RSV season to help prevent RSV infection",
          "This one injection will protect my baby for the entire winter season",
          "This medication will cure RSV if my baby catches it"
        ],
        correct: 1,
        rationale: "Palivizumab is a monoclonal antibody given intramuscularly once monthly during RSV season for prevention (prophylaxis) of RSV infection in high-risk infants. It is not a treatment for active RSV infection, it does not cure RSV, and it requires monthly administration because it provides passive immunity that wanes over time."
      }
    ]
  },

  "rubella-rpn": {
    title: "Rubella (German Measles) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Rubella and Congenital Rubella Syndrome",
      content: "Rubella is an acute, contagious viral infection caused by the rubella virus, an enveloped, single-stranded RNA virus of the family Matonaviridae (genus Rubivirus). In children and adults, rubella typically causes a mild, self-limiting illness characterized by a fine maculopapular rash, low-grade fever, lymphadenopathy, and arthralgias. However, the critical clinical significance of rubella lies in its devastating teratogenic effects when infection occurs during pregnancy, particularly during the first trimester. The rubella virus is transmitted via respiratory droplets and has an incubation period of 14-21 days. The virus enters through the respiratory mucosa, replicates in the nasopharyngeal lymphoid tissue, and then spreads to regional lymph nodes (postauricular, posterior cervical, and suboccipital lymphadenopathy are characteristic). Viremia develops approximately 5-7 days after initial infection, allowing the virus to disseminate to multiple organs including the skin (causing the characteristic rash), joints (causing arthralgias, especially in adult women), and, critically, the placenta in pregnant women. The infected person is contagious from approximately 7 days before the rash appears until 7 days after rash onset, making transmission possible before the disease is clinically apparent. When rubella virus crosses the placenta during maternal viremia, it infects fetal cells and causes congenital rubella syndrome (CRS). The virus has a particular tropism for rapidly dividing cells and disrupts organogenesis through multiple mechanisms: it inhibits cell mitosis (slowing cell division), induces apoptosis (programmed cell death) in developing organs, damages the endothelium of fetal blood vessels causing ischemia in developing tissues, and triggers a chronic inflammatory response. The risk of CRS is directly related to gestational age at infection: infection during weeks 1-12 carries a greater than 80% risk of congenital defects; weeks 13-16 carries approximately 50% risk; after 20 weeks, the risk drops dramatically. The classic triad of CRS includes sensorineural hearing loss (the most common single defect, present in over 60% of CRS cases), congenital heart defects (patent ductus arteriosus and pulmonary artery stenosis are most frequent), and ocular abnormalities (cataracts, microphthalmos, glaucoma, and pigmentary retinopathy). Additional manifestations include intellectual disability, microcephaly, hepatosplenomegaly, thrombocytopenic purpura (blueberry muffin rash from dermal erythropoiesis), and growth restriction. Infants with CRS shed the virus in their nasopharyngeal secretions and urine for months to over a year after birth, making them a significant infection control concern. A pathognomonic oral finding in rubella is Forchheimer spots -- pinpoint red petechiae on the soft palate that appear during the prodromal phase or early in the illness. These spots, while not present in every case, are distinctive enough to aid clinical diagnosis. Prevention through universal vaccination with the MMR (measles, mumps, rubella) vaccine has dramatically reduced rubella incidence, with endemic rubella declared eliminated in the Americas in 2015. However, maintaining high vaccination coverage is essential because imported cases continue to occur, and susceptible pregnant women remain at risk."
    },
    riskFactors: [
      "Non-immune pregnant women (not vaccinated and no prior rubella infection), especially during the first trimester",
      "Lack of MMR vaccination or incomplete vaccination series (single dose or no documented immunity)",
      "Travel to or immigration from regions with low rubella vaccination coverage (Southeast Asia, Africa, Eastern Europe)",
      "Healthcare workers without documented rubella immunity (occupational exposure risk)",
      "Close contact with infected individuals during the contagious period (7 days before to 7 days after rash onset)",
      "Immunocompromised individuals who cannot receive live vaccines (MMR is a live vaccine)",
      "Outbreaks in unvaccinated communities or populations declining vaccination"
    ],
    diagnostics: [
      "Rubella-specific IgM antibody: positive result indicates acute or recent infection; IgM appears within 4-5 days of rash onset and persists for 6-8 weeks; first-line serological test for suspected acute rubella",
      "Rubella-specific IgG antibody: demonstrates immunity from prior infection or vaccination; a fourfold rise in IgG titer between acute and convalescent sera (drawn 2-4 weeks apart) confirms recent infection",
      "Rubella PCR (polymerase chain reaction): detects viral RNA from nasopharyngeal swab, urine, or blood; most specific test for confirming active infection; useful in outbreak investigations",
      "Prenatal screening: rubella IgG antibody tested at first prenatal visit to determine immune status; non-immune women must avoid rubella exposure and receive MMR vaccination AFTER delivery (live vaccine is contraindicated in pregnancy)",
      "Neonatal testing for CRS: rubella IgM in cord blood or neonatal serum (IgM does not cross the placenta, so presence indicates fetal infection); plus clinical evaluation for classic triad findings",
      "CBC with differential: typically shows leukopenia with relative lymphocytosis and possibly thrombocytopenia; may help differentiate from bacterial infections"
    ],
    management: [
      "Supportive care for postnatal rubella: rest, fluids, and antipyretics (acetaminophen) for fever and discomfort -- rubella is self-limiting with recovery in 3-5 days in most cases",
      "Implement droplet precautions PLUS contact precautions for hospitalized patients: maintain precautions for 7 days after rash onset in postnatal rubella",
      "For infants with confirmed CRS: maintain contact precautions for the first year of life or until nasopharyngeal and urine cultures are negative (infants shed virus for 6-12 months or longer)",
      "Refer non-immune women of childbearing age for MMR vaccination; counsel to avoid pregnancy for at least 28 days (one month) after vaccination",
      "Administer immune globulin (IG) to non-immune pregnant women exposed to rubella if termination of pregnancy is not an option -- IG may reduce clinical symptoms but does NOT reliably prevent fetal infection or CRS",
      "Multidisciplinary management for CRS: ophthalmology (cataracts, glaucoma), cardiology (PDA, pulmonary stenosis), audiology (sensorineural hearing loss), developmental pediatrics, and early intervention services",
      "Report confirmed rubella and CRS cases to public health authorities as required by law -- rubella is a nationally notifiable disease"
    ],
    nursingActions: [
      "Implement appropriate isolation precautions: droplet precautions for postnatal rubella (7 days after rash onset); contact precautions for CRS infants (first year of life or until cultures negative)",
      "Verify rubella immune status of all pregnant women at first prenatal visit by checking rubella IgG; document and communicate non-immune status clearly in the medical record",
      "Educate non-immune pregnant women to avoid contact with individuals who have rash illness and to report any rash or rubella exposure immediately",
      "Assess the characteristic rash pattern: begins on the face and spreads downward to the trunk and extremities over 1-3 days; rash is fine, pink, maculopapular, and discrete (not confluent like measles)",
      "Inspect the oral cavity for Forchheimer spots: pinpoint red petechiae on the soft palate that may appear before or during the rash -- a distinctive finding that supports clinical diagnosis",
      "Ensure that all healthcare workers caring for the patient have documented rubella immunity; non-immune staff should not provide care to rubella patients",
      "Educate families and communities about the importance of MMR vaccination as the primary prevention strategy -- two doses of MMR vaccine provide 97% protection against rubella"
    ],
    assessmentFindings: [
      "Low-grade fever (37.5-38.5 degrees Celsius / 99.5-101.3 degrees Fahrenheit) beginning 1-5 days before rash onset",
      "Lymphadenopathy, characteristically involving postauricular (behind the ear), posterior cervical (back of the neck), and suboccipital (base of the skull) lymph nodes -- this lymph node pattern is highly suggestive of rubella",
      "Fine, pink, maculopapular rash beginning on the face and spreading centrifugally (downward) to the trunk and extremities over 24-48 hours; rash typically lasts 3 days (historically called 3-day measles)",
      "Forchheimer spots: pinpoint red petechiae on the soft palate, present in approximately 20% of cases but highly suggestive when seen",
      "Arthralgias and transient arthritis, particularly in adolescent and adult females, affecting small joints of the hands, wrists, and knees",
      "Mild conjunctivitis and coryza (runny nose) during the prodromal phase",
      "In CRS: congenital cataracts (white pupillary reflex), heart murmur (PDA, pulmonary stenosis), failure to respond to sound (sensorineural hearing loss), blueberry muffin rash (thrombocytopenic purpura), microcephaly"
    ],
    signs: {
      left: [
        "Low-grade fever with mild malaise",
        "Characteristic postauricular and suboccipital lymphadenopathy",
        "Fine maculopapular rash beginning on the face",
        "Mild arthralgias in adults",
        "Forchheimer spots on the soft palate",
        "Mild conjunctivitis"
      ],
      right: [
        "Rubella infection confirmed in first trimester of pregnancy (CRS risk above 80%)",
        "CRS triad: cataracts, congenital heart defects, sensorineural hearing loss in newborn",
        "Blueberry muffin rash in newborn (thrombocytopenic purpura indicating CRS)",
        "Severe thrombocytopenia with active bleeding",
        "Encephalitis (rare complication: altered consciousness, seizures)",
        "Respiratory distress or cardiovascular compromise in CRS infant"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol/Tempra)",
        type: "Analgesic and antipyretic (non-salicylate)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center to lower fever, and modulating pain perception pathways to provide mild to moderate pain relief. Unlike NSAIDs, acetaminophen has minimal peripheral anti-inflammatory activity",
        sideEffects: "Hepatotoxicity at doses exceeding recommended maximum (most significant adverse effect), nausea, rash (rare), allergic reactions (rare)",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use disorder (increased hepatotoxicity risk); known hypersensitivity",
        pearl: "Maximum dose is 75 mg/kg/day in children (not exceeding 4g/day) and 4g/day in adults (2g/day with liver disease); acetaminophen is the preferred antipyretic for rubella -- aspirin must be AVOIDED in children due to the risk of Reye syndrome with viral infections; check all combination products for acetaminophen content to prevent inadvertent overdose"
      },
      {
        name: "MMR Vaccine (Measles, Mumps, Rubella live attenuated vaccine)",
        type: "Live attenuated viral vaccine / active immunization",
        action: "Contains live attenuated rubella virus (RA 27/3 strain) that replicates in the recipient's body at a reduced rate, stimulating both humoral (IgG antibody production) and cell-mediated immune responses without causing clinical disease. This produces long-lasting (likely lifelong) immunity by creating memory B cells and T cells that can rapidly respond to future rubella virus exposure",
        sideEffects: "Injection site pain, low-grade fever 7-12 days post-vaccination, mild rash, transient arthralgias (especially in post-pubertal females), lymphadenopathy, febrile seizures (rare), thrombocytopenia (rare and self-limiting)",
        contra: "Pregnancy (live vaccine is teratogenic; advise avoiding pregnancy for at least 28 days after vaccination); immunocompromised states (active immunosuppressive therapy, severe combined immunodeficiency, AIDS with CD4 count below 200); known anaphylaxis to neomycin or gelatin (vaccine components); recent blood product administration (antibodies may interfere with vaccine efficacy -- wait 3-11 months depending on product)",
        pearl: "Two doses provide approximately 97% protection against rubella; first dose at 12-15 months, second dose at 4-6 years; ALL women of childbearing age should have rubella immunity verified before pregnancy; if non-immune, vaccinate postpartum BEFORE hospital discharge -- this is a critical public health intervention to prevent CRS in future pregnancies"
      },
      {
        name: "Immune Globulin (IG) intramuscular",
        type: "Passive immunization / pooled human immunoglobulin",
        action: "Contains preformed antibodies (primarily IgG) pooled from thousands of donors, providing immediate passive immunity. When given to a non-immune pregnant woman within 72 hours of rubella exposure, the antibodies may neutralize circulating virus and reduce maternal viremia, potentially modifying or preventing clinical disease in the mother",
        sideEffects: "Injection site pain and tenderness, headache, malaise, fever, rarely anaphylaxis (especially in IgA-deficient individuals with anti-IgA antibodies)",
        contra: "IgA deficiency with documented anti-IgA antibodies (anaphylaxis risk); known hypersensitivity to immune globulin products; should not be given within 2 weeks before or 3-11 months after live vaccines (interferes with active immune response)",
        pearl: "Important limitation: immune globulin may reduce maternal symptoms but does NOT reliably prevent fetal infection or congenital rubella syndrome -- it should not provide false reassurance; it is reserved for situations where a non-immune pregnant woman has been exposed to rubella and termination of pregnancy is not being considered; not a substitute for vaccination"
      }
    ],
    pearls: [
      "Rubella itself is a mild disease in children and adults, but its CRITICAL clinical significance is the devastating teratogenic effect when infection occurs during pregnancy -- congenital rubella syndrome (CRS) causes permanent defects",
      "The classic CRS triad is: sensorineural hearing loss (most common single defect), congenital heart defects (PDA and pulmonary artery stenosis), and eye abnormalities (cataracts, microphthalmos) -- these defects are permanent and irreversible",
      "Risk of CRS correlates with gestational age at infection: first trimester infection carries greater than 80% risk of defects; risk decreases significantly after 20 weeks gestation",
      "Forchheimer spots (pinpoint red petechiae on the soft palate) are a distinctive but not pathognomonic finding in rubella -- their presence during rash illness should prompt rubella testing",
      "MMR vaccine is CONTRAINDICATED during pregnancy because it contains live attenuated virus -- non-immune women should be vaccinated AFTER delivery before hospital discharge and counseled to avoid pregnancy for at least 28 days",
      "Infants with CRS shed rubella virus in nasopharyngeal secretions and urine for up to 1 year or longer -- they require contact precautions and should be isolated from pregnant women who are not immune",
      "The practical nurse must verify rubella immune status of ALL pregnant women at the first prenatal visit -- non-immune pregnant women must be counseled to avoid exposure and vaccinated immediately postpartum to protect future pregnancies"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a child with suspected rubella. Which finding is MOST characteristic of rubella infection?",
        options: [
          "High fever (above 40 degrees Celsius) with Koplik spots on buccal mucosa",
          "Postauricular and suboccipital lymphadenopathy with a fine maculopapular rash beginning on the face",
          "Vesicular rash beginning on the trunk in successive crops",
          "Barking cough with inspiratory stridor and steeple sign on X-ray"
        ],
        correct: 1,
        rationale: "Rubella characteristically presents with postauricular (behind the ear) and suboccipital (base of skull) lymphadenopathy accompanied by a fine, pink maculopapular rash that begins on the face and spreads downward. Koplik spots are associated with measles (rubeola), vesicular crops with varicella (chickenpox), and barking cough with croup."
      },
      {
        question: "A non-immune pregnant woman at 8 weeks gestation is exposed to a confirmed rubella case. The practical nurse understands that the primary concern is which of the following?",
        options: [
          "The mother will develop severe pneumonia requiring hospitalization",
          "The fetus is at high risk (above 80%) for congenital rubella syndrome with permanent birth defects",
          "The mother will require antiviral medication therapy throughout pregnancy",
          "The exposure poses no significant risk because rubella is a mild illness"
        ],
        correct: 1,
        rationale: "Rubella infection during the first trimester (weeks 1-12) carries an 80% or greater risk of congenital rubella syndrome (CRS), which includes sensorineural hearing loss, congenital heart defects, and cataracts. While rubella is mild in the mother, the teratogenic effects on the developing fetus are devastating and irreversible. This is why verification of rubella immunity is essential in prenatal care."
      },
      {
        question: "A non-immune woman delivers a healthy infant. The practical nurse plans to administer the MMR vaccine before discharge. Which statement reflects correct practice?",
        options: [
          "The vaccine should be withheld until the infant is 6 months old",
          "The vaccine is safe to administer postpartum and the woman should avoid pregnancy for at least 28 days after vaccination",
          "The vaccine cannot be given to breastfeeding mothers",
          "The vaccine should be delayed until the 6-week postpartum visit"
        ],
        correct: 1,
        rationale: "MMR vaccine should be administered to non-immune women postpartum BEFORE hospital discharge to ensure they are protected before a future pregnancy. Breastfeeding is NOT a contraindication to MMR vaccination. The woman should be counseled to avoid pregnancy for at least 28 days (one month) after vaccination because the vaccine contains live attenuated virus. Delaying vaccination risks the woman becoming pregnant again without immunity."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
