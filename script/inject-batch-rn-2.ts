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
  "acute-intermittent-porphyria-rn": {
    title: "Acute Intermittent Porphyria for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Acute Intermittent Porphyria",
      content: "Acute intermittent porphyria (AIP) is the most common and most clinically significant of the acute hepatic porphyrias, a group of inherited metabolic disorders caused by defects in the heme biosynthesis pathway. AIP results from an autosomal dominant mutation in the gene encoding porphobilinogen deaminase (PBG deaminase, also called hydroxymethylbilane synthase or uroporphyrinogen I synthase), the third enzyme in the heme biosynthetic pathway. This enzyme normally catalyzes the conversion of porphobilinogen (PBG) to hydroxymethylbilane. When the enzyme is deficient, porphobilinogen and its precursor delta-aminolevulinic acid (ALA) accumulate to toxic levels during acute attacks, producing the characteristic neurovisceral symptoms.\n\nThe heme biosynthesis pathway consists of eight enzymatic steps, beginning with the condensation of glycine and succinyl-CoA to form delta-aminolevulinic acid (ALA) in the mitochondria (catalyzed by ALA synthase, the rate-limiting enzyme) and ending with the insertion of iron into protoporphyrin IX to form heme. Heme serves as the prosthetic group for hemoglobin, myoglobin, cytochrome P450 enzymes, and catalase. Under normal conditions, heme production is tightly regulated by negative feedback inhibition of ALA synthase -- when heme levels are adequate, ALA synthase activity is suppressed. In AIP, the partial deficiency of PBG deaminase (approximately 50% of normal activity) is usually compensated under basal conditions, and most carriers remain asymptomatic throughout life. Acute attacks are triggered when demand for hepatic heme production increases, upregulating ALA synthase (the rate-limiting enzyme) and flooding the pathway with ALA and PBG that cannot be adequately processed by the deficient PBG deaminase.\n\nCommon triggers for acute attacks include medications that induce hepatic cytochrome P450 enzymes (barbiturates, phenytoin, carbamazepine, sulfonamides, rifampin, oral contraceptives, progesterone), fasting or caloric restriction (which depletes hepatic heme stores used for glucose metabolism enzymes), hormonal fluctuations (attacks are more common in women of reproductive age, often premenstrual, due to progesterone's induction of ALA synthase), alcohol consumption, smoking, infection, stress, and surgery. The accumulated ALA and PBG are neurotoxic. ALA is structurally similar to gamma-aminobutyric acid (GABA) and may interfere with GABA-ergic neurotransmission. Both ALA and PBG cause oxidative damage to neurons and may impair axonal transport and myelin integrity. This neurotoxicity produces the three cardinal clinical manifestations of AIP.\n\nAbdominal pain is the most common symptom, occurring in over 90% of acute attacks. The pain is severe, colicky, poorly localized, and often accompanied by nausea, vomiting, and constipation. The pain is caused by autonomic neuropathy affecting the visceral nervous system and smooth muscle dysfunction in the gastrointestinal tract. Critically, the abdomen is typically soft and non-tender on physical examination despite severe pain, which helps differentiate AIP from surgical acute abdomen. However, many AIP patients undergo unnecessary exploratory laparotomy before the correct diagnosis is made.\n\nNeuropsychiatric symptoms result from both central and peripheral nervous system involvement. Peripheral motor neuropathy presents as progressive weakness beginning proximally and descending (unlike Guillain-Barre syndrome which typically ascends), potentially progressing to respiratory paralysis requiring mechanical ventilation if untreated. Autonomic neuropathy causes tachycardia, hypertension (in 40-50% of attacks), postural hypotension, urinary retention, and excessive sweating. Central nervous system involvement manifests as anxiety, confusion, hallucinations, psychosis, seizures, and posterior reversible encephalopathy syndrome (PRES). Hyponatremia from syndrome of inappropriate antidiuretic hormone secretion (SIADH) complicates 25-40% of acute attacks and can cause or worsen seizures.\n\nThe diagnosis of AIP during an acute attack is confirmed by markedly elevated urinary porphobilinogen (PBG) -- a spot urine PBG level greater than 5 times the upper limit of normal is diagnostic. A simple bedside clue is the observation that the patient's urine darkens to a port wine or deep brown color upon standing in light, due to non-enzymatic oxidation of PBG and ALA to porphobilin and other pigmented compounds. Watson-Schwartz test or Hoesch test can provide rapid qualitative screening. Between attacks, PBG levels may return to normal or remain mildly elevated.\n\nTreatment of acute attacks centers on two pharmacological interventions: intravenous hemin (Panhematin) and intravenous glucose loading. Hemin provides exogenous heme that replenishes the regulatory heme pool, restoring negative feedback inhibition of ALA synthase and rapidly reducing ALA and PBG production. Glucose loading (10% dextrose infusion at 300-500g/day) also suppresses ALA synthase activity through a carbohydrate-mediated mechanism, although less effectively than hemin. Glucose loading is used for mild attacks or while awaiting hemin preparation. Seizure management is complicated because most standard antiepileptic drugs (phenytoin, carbamazepine, valproate, phenobarbital) are porphyrinogenic and will worsen the attack; gabapentin, levetiracetam, and magnesium sulfate are considered safe alternatives."
    },
    riskFactors: [
      "Female sex with reproductive-age hormonal fluctuations (attacks are 5 times more common in women than men, often premenstrual due to progesterone-mediated ALA synthase induction)",
      "Use of porphyrinogenic medications: barbiturates, phenytoin, carbamazepine, sulfonamides, rifampin, oral contraceptives, progesterone-containing hormonal therapy",
      "Fasting, caloric restriction, or crash dieting depleting hepatic heme stores and removing the negative feedback on ALA synthase",
      "Alcohol consumption and tobacco smoking both induce hepatic cytochrome P450 enzymes and deplete heme stores",
      "Physiological stress from infection, surgery, or emotional distress increasing hepatic heme demand",
      "Family history of AIP (autosomal dominant inheritance with incomplete penetrance -- approximately 80-90% of gene carriers remain asymptomatic throughout life)",
      "Hormonal changes during pregnancy, menstrual cycle (luteal phase), or hormone replacement therapy"
    ],
    diagnostics: [
      "Spot urine porphobilinogen (PBG): markedly elevated during acute attack (greater than 5 times upper limit of normal); the single most important diagnostic test; rapid qualitative screening with Watson-Schwartz or Hoesch test",
      "Spot urine delta-aminolevulinic acid (ALA): elevated during acute attack; ALA is neurotoxic and correlates with disease severity; measured concurrently with PBG",
      "Urine porphyrins: total urinary porphyrins elevated; uroporphyrins increased; urine may darken to port wine color upon standing in light due to porphobilin formation",
      "Serum sodium: hyponatremia (below 130 mEq/L) from SIADH complicates 25-40% of acute attacks; must be monitored closely as it worsens seizure risk",
      "Erythrocyte PBG deaminase activity: reduced to approximately 50% of normal; used to confirm diagnosis between attacks and for family screening; not reliable during acute attacks when enzyme may be consumed",
      "Genetic testing for HMBS gene mutations: definitive confirmation of AIP; identifies asymptomatic carriers for presymptomatic counseling and trigger avoidance"
    ],
    management: [
      "Administer IV hemin (Panhematin 3-4 mg/kg/day for 4 days) as the definitive treatment for moderate-to-severe acute attacks; hemin provides exogenous heme, restoring negative feedback on ALA synthase and rapidly reducing toxic ALA/PBG levels within 24-48 hours",
      "Initiate IV glucose loading (10% dextrose at 300-500g/day) for mild attacks or while awaiting hemin preparation; glucose suppresses ALA synthase activity through carbohydrate-mediated mechanisms; less effective than hemin but immediately available",
      "Correct hyponatremia cautiously: fluid restriction for SIADH-related hyponatremia; if severe (below 120 mEq/L with seizures), administer 3% hypertonic saline at 1-2 mL/kg/hour with maximum correction of 8 mEq/L in 24 hours to prevent osmotic demyelination syndrome",
      "Manage pain aggressively with opioids (morphine, hydromorphone are safe); avoid NSAIDs and mixed agonist-antagonists; acetaminophen is safe for mild pain; ensure adequate pain relief to reduce physiological stress that perpetuates the attack",
      "Treat seizures with SAFE antiepileptics only: gabapentin, levetiracetam, or IV magnesium sulfate; AVOID phenytoin, carbamazepine, phenobarbital, and valproate as they are porphyrinogenic and will worsen the attack catastrophically",
      "Discontinue ALL porphyrinogenic medications immediately: cross-reference all current medications against the safe/unsafe drug list for porphyria (available at the American Porphyria Foundation or EPNET databases)",
      "Provide adequate caloric intake (minimum 300g carbohydrate/day) to suppress ALA synthase; avoid fasting, NPO status, and caloric restriction; if patient cannot eat, continue IV glucose infusion"
    ],
    nursingActions: [
      "Assess and document pain using a validated scale every 2 hours during acute attacks; advocate for adequate opioid analgesia as undertreated pain increases physiological stress and worsens ALA/PBG production",
      "Perform comprehensive neurological assessment every 4 hours: motor strength (proximal weakness is an early sign of motor neuropathy), deep tendon reflexes (diminished or absent in neuropathy), respiratory muscle strength (measure negative inspiratory force if weakness progresses), cranial nerve function",
      "Monitor for respiratory compromise from progressive motor neuropathy: assess respiratory rate, depth, use of accessory muscles, ability to cough and clear secretions; respiratory paralysis can develop rapidly; keep intubation equipment at bedside for patients with progressive weakness",
      "Monitor serum sodium every 6-8 hours during acute attacks; SIADH-related hyponatremia is common and worsens seizure risk; implement fluid restriction as ordered; report sodium below 130 mEq/L or rapid drops",
      "Administer hemin (Panhematin) through a large-bore peripheral IV or central line; reconstitute with human albumin (NOT sterile water, which causes phlebitis); infuse over at least 15 minutes; monitor for infusion-related reactions",
      "Maintain accurate intake and output with strict caloric intake monitoring; ensure minimum 300g carbohydrate intake daily; if NPO is required for any reason, ensure 10% dextrose infusion is running continuously",
      "Educate patient about trigger avoidance: provide written list of safe/unsafe medications, emphasize avoidance of fasting and crash diets, counsel on alcohol and tobacco cessation, recommend MedicAlert identification"
    ],
    assessmentFindings: [
      "Severe colicky abdominal pain (present in over 90% of attacks) with a SOFT, NON-TENDER abdomen on physical examination -- this dissociation between severe pain and benign abdominal exam is a hallmark of AIP",
      "Tachycardia and hypertension from autonomic neuropathy (present in 40-50% of attacks); some patients develop labile blood pressure with alternating hypertension and postural hypotension",
      "Dark urine that turns port wine or deep brown color upon standing in light (non-enzymatic oxidation of PBG to porphobilin); patient may report dark urine at home before presenting to the emergency department",
      "Progressive proximal muscle weakness beginning in the upper extremities and descending (unlike ascending GBS pattern); may progress to respiratory muscle weakness requiring ventilatory support",
      "Psychiatric symptoms: anxiety, agitation, confusion, hallucinations, insomnia, or frank psychosis; these often precede recognition of AIP and may lead to misdiagnosis as a primary psychiatric disorder",
      "Seizures (in 10-20% of attacks) that may be caused by direct neurotoxicity of ALA/PBG or by SIADH-related hyponatremia; treatment is complicated by the need to avoid porphyrinogenic antiepileptic drugs",
      "Constipation, nausea, and vomiting from autonomic neuropathy affecting the gastrointestinal tract; ileus may develop; urinary retention from bladder autonomic dysfunction"
    ],
    signs: {
      left: [
        "Mild abdominal discomfort with normal vital signs",
        "Urine slightly darker than usual without other symptoms",
        "Mild anxiety or insomnia during luteal phase of menstrual cycle",
        "Stable neurological examination with intact motor strength",
        "Normal serum sodium level",
        "Known carrier with no active symptoms (latent AIP)"
      ],
      right: [
        "Severe colicky abdominal pain with tachycardia and hypertension (acute attack)",
        "Progressive proximal muscle weakness with diminishing respiratory effort (motor neuropathy)",
        "Seizures or altered mental status (neurotoxicity or severe hyponatremia)",
        "Respiratory failure requiring intubation (bulbar and diaphragmatic neuropathy)",
        "Severe hyponatremia below 120 mEq/L from SIADH",
        "Port wine-colored urine with markedly elevated PBG levels"
      ]
    },
    medications: [
      {
        name: "Hemin (Panhematin)",
        type: "Heme replacement / enzyme inhibitor",
        action: "Provides exogenous heme that replenishes the intracellular regulatory heme pool in hepatocytes; this restores negative feedback inhibition of ALA synthase (the rate-limiting enzyme in heme biosynthesis), rapidly reducing the overproduction of neurotoxic delta-aminolevulinic acid (ALA) and porphobilinogen (PBG); clinical improvement in pain and neurological symptoms typically begins within 24-48 hours",
        sideEffects: "Phlebitis and thrombophlebitis at the infusion site (significantly reduced by reconstituting with human albumin instead of sterile water), coagulopathy (transient prolongation of PT/INR due to heme-mediated inhibition of clotting factor synthesis), iron overload with repeated courses, infusion reactions (fever, malaise)",
        contra: "Known hypersensitivity to hemin; porphyria cutanea tarda (PCT is not an acute porphyria and does not benefit from hemin); caution in patients on anticoagulants due to additive coagulopathy risk",
        pearl: "Must be reconstituted with 25% human albumin (NOT sterile water, which causes severe phlebitis and renal damage); administer through a large-bore peripheral IV or central venous catheter over at least 15 minutes; check PT/INR before and after each infusion; course is typically 3-4 mg/kg/day for 4 days"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Selective 5-HT3 serotonin receptor antagonist (antiemetic)",
        action: "Selectively blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone (CTZ) of the area postrema and at vagal nerve terminals in the gastrointestinal tract, preventing serotonin-mediated activation of the vomiting reflex; critically important in AIP because ondansetron is SAFE in porphyria (non-porphyrinogenic) unlike many other antiemetics",
        sideEffects: "Headache, constipation (may worsen AIP-related constipation from autonomic neuropathy), dizziness, dose-dependent QT prolongation, serotonin syndrome with concurrent serotonergic agents",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine; severe hepatic impairment (maximum 8 mg/day); patients on other QT-prolonging drugs require ECG monitoring",
        pearl: "One of the few antiemetics confirmed SAFE for use in acute porphyria; metoclopramide and prochlorperazine have uncertain safety profiles in porphyria; always verify medication safety against a porphyria drug database before administering ANY drug during an acute attack"
      },
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant / analgesic (calcium channel alpha-2-delta subunit ligand)",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the central nervous system, reducing excitatory neurotransmitter release; provides anticonvulsant activity for porphyria-related seizures and adjunctive neuropathic pain relief; critically, gabapentin is NON-PORPHYRINOGENIC and safe in all acute porphyrias, unlike phenytoin, carbamazepine, phenobarbital, and valproate which are all dangerous",
        sideEffects: "Drowsiness and sedation, dizziness, ataxia, peripheral edema, weight gain, blurred vision, withdrawal seizures if discontinued abruptly",
        contra: "Severe renal impairment (requires significant dose reduction as gabapentin is renally excreted without hepatic metabolism); hypersensitivity; abrupt discontinuation (taper over 1 week minimum)",
        pearl: "First-line anticonvulsant for seizures in acute porphyria along with levetiracetam and IV magnesium sulfate; NEVER give phenytoin, carbamazepine, phenobarbital, or valproate as these are porphyrinogenic and will catastrophically worsen the acute attack by inducing ALA synthase; maintain a bedside list of safe/unsafe drugs"
      }
    ],
    pearls: [
      "The hallmark clinical clue for AIP is severe colicky abdominal pain with a SOFT, NON-TENDER abdomen on examination -- this pain-examination dissociation should trigger consideration of AIP and prevent unnecessary exploratory surgery",
      "Dark (port wine-colored) urine that darkens further upon standing in light is a bedside clue to porphyria; always assess urine color in patients presenting with unexplained abdominal pain, especially young women",
      "MEDICATION SAFETY is the most critical nursing concern in AIP: many common drugs are porphyrinogenic and can trigger or worsen acute attacks; always check EVERY medication against a porphyria drug safety database (American Porphyria Foundation or European Porphyria Network) before administration",
      "Seizures in AIP must be treated with SAFE antiepileptics only: gabapentin, levetiracetam, or IV magnesium sulfate; phenytoin, carbamazepine, phenobarbital, and valproate are all porphyrinogenic and will worsen the attack",
      "Monitor for respiratory failure from progressive motor neuropathy: assess respiratory rate, negative inspiratory force, and ability to cough; respiratory paralysis can develop rapidly and is the leading cause of death in AIP attacks; keep intubation equipment at bedside",
      "NEVER allow an AIP patient to fast or become NPO without continuous IV glucose infusion (10% dextrose); fasting depletes hepatic heme stores, removes the negative feedback on ALA synthase, and can precipitate or worsen an acute attack",
      "Hyponatremia from SIADH complicates 25-40% of acute attacks and can cause seizures; monitor sodium every 6-8 hours; correct cautiously (maximum 8 mEq/L per 24 hours) to prevent osmotic demyelination syndrome"
    ],
    quiz: [
      {
        question: "A 28-year-old woman presents to the emergency department with severe abdominal pain, vomiting, and dark reddish-brown urine. Physical examination reveals a soft, non-tender abdomen. Urinary porphobilinogen is markedly elevated. Which medication should the nurse question if prescribed?",
        options: [
          "Morphine sulfate for pain management",
          "Phenytoin for seizure prophylaxis",
          "Ondansetron for nausea and vomiting",
          "Gabapentin for neuropathic pain"
        ],
        correct: 1,
        rationale: "Phenytoin is porphyrinogenic (induces hepatic cytochrome P450 enzymes and ALA synthase) and will catastrophically worsen an acute porphyria attack. The nurse must question this order. Morphine, ondansetron, and gabapentin are all confirmed safe in acute porphyria."
      },
      {
        question: "A patient with acute intermittent porphyria is receiving hemin (Panhematin) infusion. Which assessment finding should the nurse report immediately?",
        options: [
          "Mild redness at the IV insertion site",
          "Prolonged PT/INR with bleeding from venipuncture sites",
          "Mild headache after infusion completion",
          "Darkened stool color"
        ],
        correct: 1,
        rationale: "Hemin can cause transient coagulopathy by inhibiting clotting factor synthesis, leading to prolonged PT/INR and bleeding risk. Active bleeding from venipuncture sites indicates clinically significant coagulopathy requiring immediate intervention. The nurse should check PT/INR before and after each hemin infusion."
      },
      {
        question: "Which nursing intervention is MOST important when caring for a patient during an acute porphyria attack who is unable to tolerate oral intake?",
        options: [
          "Maintain NPO status and wait for physician orders",
          "Ensure continuous IV infusion of 10% dextrose to provide at least 300g carbohydrate daily",
          "Administer IV normal saline at 125 mL/hour",
          "Insert a nasogastric tube for enteral feeding"
        ],
        correct: 1,
        rationale: "Fasting is a known trigger for acute porphyria attacks because it depletes hepatic heme stores and removes negative feedback on ALA synthase. Continuous IV glucose loading (10% dextrose providing at least 300g carbohydrate/day) is essential to suppress ALA synthase activity and prevent worsening of the attack. The patient must NEVER be without a carbohydrate source."
      }
    ]
  },

  "acute-mesenteric-ischemia-rn": {
    title: "Acute Mesenteric Ischemia for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Acute Mesenteric Ischemia",
      content: "Acute mesenteric ischemia (AMI) is a vascular emergency caused by sudden reduction or cessation of blood flow to the small intestine and/or colon, resulting in intestinal ischemia, infarction, and potentially fatal bowel necrosis with peritonitis and sepsis. AMI carries a mortality rate of 60-80% largely because of delayed diagnosis -- the classic clinical presentation of severe abdominal pain out of proportion to physical findings is frequently misdiagnosed or attributed to other causes, allowing ischemia to progress to irreversible transmural infarction. The registered nurse's role in early recognition through systematic assessment and high clinical suspicion is critical for improving outcomes in this time-sensitive condition.\n\nThe mesenteric circulation supplies blood to the entire gastrointestinal tract through three major vessels. The celiac artery (celiac trunk) supplies the foregut structures: esophagus, stomach, duodenum (proximal), liver, spleen, and pancreas. The superior mesenteric artery (SMA) is the largest and most clinically significant, supplying the midgut structures: duodenum (distal), jejunum, ileum, cecum, ascending colon, and transverse colon (proximal two-thirds). The inferior mesenteric artery (IMA) supplies the hindgut: transverse colon (distal one-third), descending colon, sigmoid colon, and rectum. These three vessels are interconnected by collateral arcades (marginal artery of Drummond, arc of Riolan) that provide alternative pathways for blood flow when one vessel is gradually occluded. However, acute occlusion overwhelms collateral capacity, leading to rapid ischemia.\n\nFour distinct mechanisms cause AMI, and their recognition guides specific treatment. Arterial embolism accounts for 40-50% of cases. The embolus typically originates from a cardiac source: left atrial thrombus in atrial fibrillation (most common), left ventricular mural thrombus after myocardial infarction, valvular vegetations in endocarditis, or aortic atherosclerotic plaque. The SMA is the most commonly embolized mesenteric vessel because its takeoff angle from the aorta is nearly parallel, directing embolic material into its lumen. Emboli typically lodge 3-10 cm distal to the SMA origin, beyond the takeoff of the middle colic artery, sparing the proximal jejunum and colon.\n\nArterial thrombosis accounts for 20-35% of cases. Thrombosis typically occurs at the origin of a severely atherosclerotic SMA (or less commonly the celiac artery), superimposed on a pre-existing high-grade stenosis. These patients often have a history of chronic mesenteric ischemia (intestinal angina) with postprandial abdominal pain and weight loss from food avoidance (sitophobia). The acute presentation represents thrombotic occlusion of a critically stenosed vessel that had previously maintained marginal perfusion through collateral development.\n\nMesenteric venous thrombosis (MVT) accounts for 5-15% of cases. Thrombosis of the superior mesenteric vein (SMV) or portal vein impairs venous drainage from the intestine, causing venous congestion, intestinal wall edema, and eventually hemorrhagic infarction. MVT is associated with hypercoagulable states (Factor V Leiden, protein C and S deficiency, antithrombin deficiency, malignancy, oral contraceptive use), portal hypertension, intra-abdominal inflammation (pancreatitis, diverticulitis, appendicitis), and prior abdominal surgery. MVT has a more gradual onset and better prognosis than arterial AMI.\n\nNonocclusive mesenteric ischemia (NOMI) accounts for 20-30% of cases. It results from mesenteric vasoconstriction without mechanical vessel occlusion, typically in the setting of low cardiac output states (cardiogenic shock, heart failure, post-cardiac surgery), critical illness with vasopressor use (especially high-dose norepinephrine and vasopressin), severe dehydration, or cocaine/ergotamine use. The splanchnic vasculature is particularly susceptible to sympathetic-mediated vasoconstriction because it receives 25% of cardiac output at rest and serves as a reservoir that the body sacrifices to maintain perfusion to the heart and brain during shock.\n\nThe ischemic cascade in the intestinal wall progresses from mucosa to serosa. The intestinal mucosa is the most metabolically active layer with the highest oxygen demand and is the first to become ischemic. Within 30 minutes of complete ischemia, mucosal epithelial cells begin to slough, disrupting the intestinal barrier and allowing translocation of bacteria and endotoxin from the gut lumen into the portal circulation and peritoneal cavity. This bacterial translocation drives the systemic inflammatory response syndrome (SIRS) and sepsis that account for much of the mortality. Within 2-4 hours, full-thickness mucosal necrosis develops. Within 6-12 hours, ischemia extends through the submucosa and muscularis to the serosa, producing transmural infarction. Transmural infarction leads to perforation, fecal peritonitis, septic shock, and multi-organ dysfunction syndrome (MODS). Serum lactate rises progressively as ischemic tissue switches to anaerobic metabolism, and markedly elevated lactate (above 4 mmol/L) with metabolic acidosis indicates advanced ischemia or infarction.\n\nThe classic clinical presentation of AMI is severe, acute-onset abdominal pain that is out of proportion to the physical examination findings. In the early stages (the ischemic phase, first 0-6 hours), the patient reports excruciating, diffuse, periumbilical pain, but the abdomen remains soft, non-distended, and non-tender to palpation. This pain-examination dissociation is the most important clinical clue. As ischemia progresses to infarction (6-12 hours), the abdomen becomes distended and tender with diminishing bowel sounds. In the late stage (beyond 12 hours), transmural necrosis produces peritoneal signs (guarding, rigidity, rebound tenderness), and the patient develops septic shock with altered mental status, hypotension, tachycardia, and metabolic acidosis. By this stage, mortality exceeds 90% even with surgical intervention."
    },
    riskFactors: [
      "Atrial fibrillation (most common source of arterial embolism to the SMA; responsible for approximately 50% of embolic AMI cases)",
      "Recent myocardial infarction with left ventricular mural thrombus or akinetic wall segment",
      "Severe atherosclerotic disease (peripheral arterial disease, coronary artery disease, carotid stenosis) predisposing to SMA thrombosis",
      "Low cardiac output states: cardiogenic shock, decompensated heart failure, post-cardiac surgery, cardiac arrest with resuscitation",
      "High-dose vasopressor therapy (norepinephrine, vasopressin, phenylephrine) causing mesenteric vasoconstriction (NOMI)",
      "Hypercoagulable states: Factor V Leiden, protein C/S deficiency, antithrombin III deficiency, malignancy, oral contraceptive use (risk for mesenteric venous thrombosis)",
      "History of chronic mesenteric ischemia (postprandial abdominal pain, food avoidance, weight loss) indicating pre-existing mesenteric arterial stenosis at risk for acute thrombotic occlusion"
    ],
    diagnostics: [
      "CT angiography (CTA) of the abdomen with IV contrast: gold standard for diagnosis with sensitivity and specificity above 95%; identifies arterial occlusion (filling defect in SMA), venous thrombosis, bowel wall thickening or pneumatosis (air in bowel wall indicating infarction), portal venous gas, and free fluid",
      "Serum lactate: elevated lactate (above 2 mmol/L) indicates tissue hypoperfusion; markedly elevated lactate (above 4 mmol/L) with metabolic acidosis suggests advanced ischemia or established infarction; serial trending guides clinical decisions",
      "Complete blood count: leukocytosis with left shift (bandemia) develops as ischemia progresses; hemoconcentration may occur from third-spacing; thrombocytopenia may indicate DIC from sepsis",
      "Basic metabolic panel with arterial blood gas: metabolic acidosis with elevated anion gap (from lactic acid accumulation); hyperkalemia from tissue necrosis; elevated BUN/creatinine from dehydration and renal hypoperfusion",
      "D-dimer: elevated in mesenteric arterial embolism and venous thrombosis; sensitive but not specific; a normal D-dimer has a high negative predictive value for vascular occlusion",
      "Conventional mesenteric angiography: used therapeutically for catheter-directed thrombolysis or papaverine infusion in selected cases; also provides definitive anatomical information about the mesenteric vasculature"
    ],
    management: [
      "Obtain EMERGENT CT angiography in any patient with acute abdominal pain out of proportion to examination, especially those with atrial fibrillation, recent MI, or low cardiac output states; delays in imaging directly increase mortality",
      "Initiate aggressive IV fluid resuscitation with crystalloid (lactated Ringer or normal saline) to restore intravascular volume, correct metabolic acidosis, and optimize mesenteric perfusion; target MAP above 65 mmHg and urine output above 0.5 mL/kg/hour",
      "Administer broad-spectrum IV antibiotics immediately (piperacillin-tazobactam or meropenem) to cover enteric organisms including gram-negatives and anaerobes; bacterial translocation from the ischemic gut occurs early and drives sepsis",
      "Initiate IV anticoagulation with unfractionated heparin (UFH) bolus and continuous infusion for arterial embolism and mesenteric venous thrombosis; heparin prevents clot propagation while definitive management is organized",
      "Prepare for emergent surgical exploration and possible bowel resection: laparotomy with SMA embolectomy, thrombectomy, or bypass for arterial causes; resection of non-viable bowel with second-look laparotomy in 24-48 hours to reassess viability of remaining bowel",
      "For NOMI: optimize cardiac output, reduce vasopressor doses if possible, consider catheter-directed papaverine infusion (60 mg/hour via SMA catheter) to relieve mesenteric vasospasm; surgical intervention only if peritoneal signs develop",
      "Correct metabolic acidosis with IV sodium bicarbonate if pH is below 7.1; treat hyperkalemia aggressively; monitor for DIC and manage with blood component therapy as needed"
    ],
    nursingActions: [
      "Maintain HIGH clinical suspicion for AMI in patients presenting with severe abdominal pain out of proportion to physical findings, especially those with atrial fibrillation, recent cardiac events, or hemodynamic instability; communicate urgency using SBAR",
      "Perform serial abdominal assessments every 1-2 hours: document pain severity, location, quality; assess bowel sounds (diminishing sounds indicate progression); palpate for guarding, rigidity, rebound tenderness (indicating transmural infarction and peritonitis)",
      "Monitor serial serum lactate levels every 4-6 hours (or more frequently in unstable patients); trending lactate is more informative than a single value; rising lactate despite resuscitation indicates ongoing ischemia or infarction and requires immediate surgical consultation",
      "Administer IV fluid resuscitation as prescribed and monitor hemodynamic response: MAP, urine output (target above 0.5 mL/kg/hour via Foley catheter), heart rate, lactate clearance; massive third-spacing may require substantial fluid volumes",
      "Initiate and manage IV heparin infusion per protocol: obtain baseline aPTT, monitor aPTT every 6 hours and adjust rate to therapeutic range (1.5-2.5 times control); monitor for bleeding complications; have protamine sulfate available for reversal",
      "Prepare patient for emergent CT angiography or surgical intervention: verify IV contrast allergy status and renal function, obtain consent, ensure type and crossmatch is sent, place second large-bore IV, coordinate with surgery and interventional radiology",
      "After bowel resection, monitor for anastomotic leak (fever, abdominal pain, elevated WBC on postoperative days 5-7), short bowel syndrome complications (high-output stoma, dehydration, electrolyte abnormalities, nutritional deficiencies), and prepare for planned second-look laparotomy"
    ],
    assessmentFindings: [
      "Severe, acute-onset periumbilical or diffuse abdominal pain OUT OF PROPORTION to physical examination findings: the abdomen is soft and non-tender despite excruciating pain (early ischemic phase -- the most critical clinical clue)",
      "Rapid gut emptying: forceful vomiting and explosive watery or bloody diarrhea (initially from hyperperistalsis in response to ischemia, later bloody from mucosal sloughing)",
      "Elevated serum lactate with metabolic acidosis (anion gap elevation) indicating tissue hypoperfusion and anaerobic metabolism in ischemic bowel",
      "Progressive abdominal distension with diminishing bowel sounds as ischemia advances to infarction and ileus develops",
      "Development of peritoneal signs (involuntary guarding, rigidity, rebound tenderness) indicating transmural infarction and peritonitis -- this is a LATE and ominous finding",
      "Septic shock presentation: fever or hypothermia, tachycardia, hypotension, altered mental status, leukocytosis with left shift -- indicating bacterial translocation from ischemic gut",
      "CT angiography findings: SMA filling defect (embolism), bowel wall thickening, pneumatosis intestinalis (air in bowel wall indicating infarction), portal venous gas, mesenteric stranding, free fluid"
    ],
    signs: {
      left: [
        "Mild periumbilical discomfort with soft abdomen and normal bowel sounds",
        "Normal serum lactate (below 2 mmol/L) and normal metabolic panel",
        "Stable vital signs without tachycardia or hypotension",
        "Mild nausea without vomiting or diarrhea",
        "No peritoneal signs on palpation",
        "Normal CT findings without evidence of vascular occlusion"
      ],
      right: [
        "Severe abdominal pain out of proportion to examination with metabolic acidosis (classic AMI presentation)",
        "Markedly elevated lactate (above 4 mmol/L) with rising trend despite resuscitation",
        "Peritoneal signs (guarding, rigidity, rebound tenderness) indicating transmural infarction",
        "Septic shock: fever, hypotension, tachycardia, altered mental status (bacterial translocation)",
        "Pneumatosis intestinalis or portal venous gas on CT (intestinal infarction -- often irreversible)",
        "Bloody diarrhea with hemodynamic instability (mucosal sloughing and hemorrhagic infarction)"
      ]
    },
    medications: [
      {
        name: "Heparin Sodium (Unfractionated Heparin)",
        type: "Anticoagulant (indirect thrombin inhibitor via antithrombin III activation)",
        action: "Binds to and activates antithrombin III (AT-III), which then inactivates thrombin (factor IIa), factor Xa, and other serine proteases in the coagulation cascade; prevents clot propagation in arterial embolism and mesenteric venous thrombosis; maintains vessel patency after surgical embolectomy; short half-life (60-90 minutes) allows rapid dose adjustment and reversibility with protamine",
        sideEffects: "Hemorrhage (most significant), heparin-induced thrombocytopenia (HIT -- immune-mediated type II is most dangerous, typically days 5-14), osteoporosis with prolonged use, hypersensitivity reactions, hyperkalemia (aldosterone suppression)",
        contra: "Active major hemorrhage; severe thrombocytopenia (platelet count below 50,000); history of heparin-induced thrombocytopenia (HIT type II); recent craniotomy or spinal surgery; uncontrolled severe hypertension",
        pearl: "First-line anticoagulant for mesenteric ischemia because of rapid onset, short half-life, and reversibility with protamine sulfate (1 mg protamine per 100 units heparin); monitor aPTT every 6 hours targeting 1.5-2.5 times control; obtain baseline platelet count and monitor every 2-3 days for HIT"
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-spectrum penicillin with beta-lactamase inhibitor",
        action: "Piperacillin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins; tazobactam inhibits beta-lactamase enzymes restoring activity against resistant organisms; provides broad-spectrum coverage against gram-positive, gram-negative, and anaerobic bacteria that translocate across the ischemic intestinal barrier, including Escherichia coli, Klebsiella, Enterococcus, and Bacteroides fragilis",
        sideEffects: "Diarrhea, nausea, rash, Clostridioides difficile-associated diarrhea, thrombocytopenia, elevated hepatic transaminases, seizures (in renal impairment at high doses), injection site reactions",
        contra: "Known hypersensitivity to penicillins or beta-lactamase inhibitors; severe penicillin allergy with anaphylaxis history; caution with cephalosporin allergy (1-2% cross-reactivity)",
        pearl: "First-line empiric antibiotic for suspected mesenteric ischemia due to excellent coverage of enteric flora; administer as extended infusion (over 4 hours) in critically ill patients to optimize time above MIC; bacterial translocation from ischemic gut occurs EARLY, so antibiotics should be initiated immediately upon clinical suspicion, not delayed until confirmation"
      },
      {
        name: "Papaverine",
        type: "Smooth muscle relaxant / direct vasodilator (phosphodiesterase inhibitor)",
        action: "Inhibits phosphodiesterase in vascular smooth muscle cells, increasing intracellular cAMP and causing direct relaxation of arteriolar smooth muscle; when infused directly into the SMA via angiographic catheter, produces selective mesenteric vasodilation that reverses the vasospasm responsible for nonocclusive mesenteric ischemia (NOMI); does not depend on endothelial function (unlike nitric oxide-dependent vasodilators)",
        sideEffects: "Systemic hypotension (usually minimal with selective intra-arterial infusion), tachycardia, flushing, hepatotoxicity with prolonged use, cardiac dysrhythmias at high doses",
        contra: "Complete AV block; concomitant use with levodopa (papaverine may reduce levodopa effectiveness); use with caution in patients with coronary artery disease or hepatic impairment",
        pearl: "Used specifically for NONOCCLUSIVE mesenteric ischemia (NOMI) via catheter-directed infusion into the SMA at 30-60 mg/hour; NOT effective for embolic or thrombotic AMI where mechanical revascularization is required; the catheter remains in place for 24-48 hours with serial angiograms to confirm resolution of vasospasm; heparin must be added to the infusion to prevent catheter thrombosis"
      }
    ],
    pearls: [
      "The hallmark of AMI is severe abdominal PAIN OUT OF PROPORTION to physical examination findings -- excruciating pain with a soft, non-tender abdomen in the early ischemic phase; this dissociation should trigger immediate consideration of mesenteric ischemia",
      "Atrial fibrillation is the single most common risk factor for embolic AMI; any patient with AF who presents with acute severe abdominal pain should be considered to have mesenteric ischemia until proven otherwise",
      "Serum lactate is the most useful laboratory marker: normal lactate does not exclude early AMI, but markedly elevated lactate (above 4 mmol/L) with metabolic acidosis indicates advanced ischemia or established infarction with poor prognosis",
      "CT angiography is the diagnostic gold standard with greater than 95% sensitivity and specificity; do NOT delay imaging for plain radiographs or other studies -- time to diagnosis is the strongest predictor of survival",
      "Pneumatosis intestinalis (air in the bowel wall) and portal venous gas on CT are signs of established intestinal infarction and carry a very poor prognosis; however, they are NOT absolute contraindications to surgery as some patients with localized findings can be salvaged",
      "The golden window for intervention in AMI is approximately 6-12 hours from symptom onset; after transmural infarction develops, mortality exceeds 80-90% even with surgical intervention; early recognition and rapid imaging are paramount",
      "Delegate vital sign monitoring and urine output recording to UAP; retain serial abdominal assessments, lactate trend interpretation, heparin infusion management, and communication of deterioration to the surgical and critical care teams"
    ],
    quiz: [
      {
        question: "A 72-year-old patient with atrial fibrillation presents with sudden onset of severe periumbilical pain rated 10/10. Physical examination reveals a soft, non-tender abdomen with normal bowel sounds. Which condition should the nurse suspect?",
        options: [
          "Acute appendicitis",
          "Acute mesenteric ischemia",
          "Acute pancreatitis",
          "Small bowel obstruction"
        ],
        correct: 1,
        rationale: "Severe abdominal pain out of proportion to physical examination findings (soft, non-tender abdomen despite 10/10 pain) in a patient with atrial fibrillation (embolic risk) is the classic presentation of acute mesenteric ischemia. Appendicitis has localized RLQ tenderness, pancreatitis has epigastric tenderness, and SBO has distension with hyperactive bowel sounds."
      },
      {
        question: "A nurse is caring for a patient with suspected acute mesenteric ischemia. Which diagnostic study should the nurse anticipate as the PRIORITY?",
        options: [
          "Abdominal X-ray (KUB series)",
          "CT angiography of the abdomen with IV contrast",
          "Abdominal ultrasound with Doppler",
          "Upper GI series with barium"
        ],
        correct: 1,
        rationale: "CT angiography (CTA) is the gold standard diagnostic study for acute mesenteric ischemia with sensitivity and specificity above 95%. It identifies the site and type of vascular occlusion, bowel wall changes, and complications. Plain radiographs are insensitive for early AMI. Barium studies are contraindicated."
      },
      {
        question: "A patient with acute mesenteric ischemia has a serum lactate of 6.2 mmol/L that has risen from 3.8 mmol/L over 4 hours despite aggressive fluid resuscitation. What does this trend indicate?",
        options: [
          "The fluid resuscitation is adequate and should be continued at the current rate",
          "Ongoing intestinal ischemia or infarction requiring immediate surgical consultation",
          "A normal response to volume resuscitation that will resolve spontaneously",
          "Lactic acidosis from excessive IV fluid administration"
        ],
        correct: 1,
        rationale: "A rising serum lactate despite aggressive fluid resuscitation indicates ongoing tissue ischemia or established intestinal infarction. This trend mandates immediate surgical consultation for possible laparotomy and bowel resection, as medical management alone has failed to restore adequate mesenteric perfusion."
      }
    ]
  },

  "adem-rn": {
    title: "Acute Disseminated Encephalomyelitis (ADEM) for Registered Nurses",
    cellular: {
      title: "Immunopathophysiology of Acute Disseminated Encephalomyelitis",
      content: "Acute disseminated encephalomyelitis (ADEM) is an immune-mediated inflammatory demyelinating disease of the central nervous system (CNS) that typically occurs following a viral infection or, rarely, vaccination. It predominantly affects children aged 5 to 8 years, although it can occur at any age. ADEM is characterized by a monophasic (single-episode) course of widespread demyelination affecting the brain and spinal cord, producing multifocal neurological deficits, encephalopathy (altered consciousness), and often dramatic clinical presentations that require urgent neurological evaluation and aggressive immunosuppressive therapy.\n\nThe pathogenesis of ADEM involves molecular mimicry and post-infectious autoimmunity. During a preceding viral infection (most commonly upper respiratory tract infections, influenza, Epstein-Barr virus, cytomegalovirus, herpes simplex virus, measles, mumps, rubella, or varicella), the immune system generates T-lymphocytes and antibodies directed against viral antigens. Due to structural similarity (molecular mimicry) between certain viral epitopes and myelin proteins (particularly myelin basic protein [MBP], myelin oligodendrocyte glycoprotein [MOG], and proteolipid protein [PLP]), these immune cells cross-react with the host's own myelin sheaths. The activated autoreactive T-cells cross the blood-brain barrier, recruit macrophages and additional inflammatory cells, and initiate a widespread inflammatory attack on CNS myelin.\n\nThe histopathology of ADEM reveals perivenous (around small veins and venules) sleeves of demyelination with dense inflammatory infiltrates consisting of activated T-lymphocytes, macrophages laden with myelin debris, and reactive astrocytes. Unlike multiple sclerosis (MS), which produces well-demarcated plaques of demyelination at different stages (some old, some new), ADEM lesions are characteristically all of the same age (reflecting a single immunological event) and are widely distributed throughout the white matter of both cerebral hemispheres, brainstem, cerebellum, and spinal cord. Gray matter involvement (basal ganglia, thalamus, cortex) can also occur in ADEM, which helps distinguish it from MS where gray matter involvement is less prominent on MRI.\n\nMOG antibody-associated disease (MOGAD) has emerged as an important entity within the ADEM spectrum. Approximately 30-60% of children with ADEM test positive for antibodies against myelin oligodendrocyte glycoprotein (MOG-IgG). MOG is expressed on the outermost surface of the myelin sheath and on the surface of oligodendrocytes, making it accessible to circulating antibodies. MOG-IgG positive ADEM tends to have a distinct clinical profile: more prominent involvement of the deep gray matter structures (basal ganglia, thalamus), more frequent bilateral optic neuritis, and a generally favorable prognosis compared to MOG-negative ADEM. However, MOG-IgG positive patients have a higher risk of relapsing disease (recurrent ADEM or conversion to MOGAD with relapsing optic neuritis or transverse myelitis).\n\nThe clinical presentation of ADEM is characteristically polysymptomatic and multifocal, reflecting widespread CNS demyelination. Encephalopathy (defined as altered consciousness ranging from lethargy and irritability to stupor and coma) is the defining clinical feature that distinguishes ADEM from a clinically isolated syndrome (CIS) or a first episode of MS. The encephalopathy is caused by diffuse cerebral white matter inflammation and edema. Additional neurological deficits depend on the location and extent of demyelination and may include hemiparesis or quadriparesis, cranial nerve palsies (particularly optic neuritis causing visual loss, and bulbar dysfunction causing dysarthria and dysphagia), cerebellar ataxia, seizures (in 10-35% of cases), spinal cord involvement producing myelopathy with sensory levels, weakness, and sphincter dysfunction, and meningeal signs (headache, neck stiffness, photophobia).\n\nMRI of the brain and spinal cord is the cornerstone diagnostic study. ADEM characteristically shows large (often greater than 1-2 cm), poorly demarcated, bilateral but asymmetric T2/FLAIR hyperintense lesions in the cerebral white matter, deep gray matter (basal ganglia and thalami), brainstem, cerebellum, and spinal cord. These lesions typically enhance with gadolinium contrast, indicating active inflammation with blood-brain barrier breakdown. The key MRI distinction from MS is that ADEM lesions are all of the same age and tend to be larger, more poorly defined, and more diffusely distributed, whereas MS shows well-defined lesions of different ages (some enhancing, some not) with predilection for periventricular, juxtacortical, and infratentorial white matter.\n\nCerebrospinal fluid (CSF) analysis in ADEM typically shows lymphocytic pleocytosis (elevated white cells, predominantly lymphocytes), elevated protein, normal glucose, and the ABSENCE of oligoclonal bands (present in greater than 95% of MS cases). The absence of CSF oligoclonal bands strongly favors ADEM over MS and is an important diagnostic distinction. CSF MOG-IgG testing may be positive and supports the diagnosis.\n\nThe standard treatment algorithm begins with high-dose IV methylprednisolone (30 mg/kg/day, maximum 1g/day, for 3-5 days) followed by an oral prednisone taper over 4-6 weeks. Most patients (50-80%) respond well to corticosteroid therapy with significant clinical improvement within 48-72 hours. For patients who fail to respond to steroids, second-line therapies include IV immunoglobulin (IVIG, 2g/kg divided over 2-5 days) and therapeutic plasma exchange (plasmapheresis, typically 5-7 exchanges over 10-14 days). IVIG modulates the immune response through multiple mechanisms including Fc receptor blockade, anti-idiotypic antibody effects, and complement inhibition. Plasma exchange physically removes circulating autoantibodies, complement components, and cytokines."
    },
    riskFactors: [
      "Preceding viral infection within 1-4 weeks (upper respiratory infection, influenza, EBV, CMV, measles, varicella, mumps, rubella -- measles historically carried the highest ADEM risk)",
      "Age between 5-8 years (peak incidence; ADEM is predominantly a pediatric disease, though it can occur at any age including adulthood)",
      "Recent vaccination (rare; historically associated with rabies vaccine using neural tissue preparation and older formulations of measles/smallpox vaccines; current vaccines carry extremely low risk)",
      "Male sex (slight male predominance with male-to-female ratio of approximately 1.3:1)",
      "Winter and spring months (coinciding with peak viral infection seasons)",
      "MOG-IgG seropositivity (associated with increased risk of ADEM and, importantly, risk of relapsing disease)",
      "Geographic regions with lower vaccination rates (higher incidence of measles-related ADEM in developing countries where measles remains endemic)"
    ],
    diagnostics: [
      "MRI brain and spinal cord with gadolinium contrast: large (greater than 1-2 cm), bilateral asymmetric T2/FLAIR hyperintense lesions in white matter, deep gray matter (basal ganglia, thalami), brainstem, cerebellum, and spinal cord; lesions all of the same age; gadolinium enhancement indicates active inflammation",
      "Cerebrospinal fluid (CSF) analysis via lumbar puncture: lymphocytic pleocytosis (typically 10-100 cells/mm3), elevated protein, normal glucose, ABSENCE of oligoclonal bands (presence favors MS); CSF cultures to exclude infectious meningoencephalitis",
      "MOG-IgG antibody testing (serum cell-based assay): positive in 30-60% of pediatric ADEM; identifies MOG antibody-associated disease (MOGAD) which has implications for relapse risk and treatment duration",
      "Serum and CSF viral studies: PCR for HSV, EBV, CMV, enterovirus, influenza; viral serology panels; identifies the preceding infection but does not alter acute treatment",
      "EEG: diffuse background slowing consistent with encephalopathy; may show epileptiform activity if seizures are a feature; helps differentiate ADEM from non-convulsive status epilepticus",
      "Complete blood count, ESR, CRP: may show mild leukocytosis and elevated inflammatory markers; used to monitor treatment response and exclude other diagnoses"
    ],
    management: [
      "Administer high-dose IV methylprednisolone 30 mg/kg/day (maximum 1g/day) for 3-5 days as first-line therapy; this is the cornerstone of ADEM treatment and most patients show clinical improvement within 48-72 hours",
      "Follow IV methylprednisolone with oral prednisone taper over 4-6 weeks (starting at 1-2 mg/kg/day); tapering too rapidly increases relapse risk; do NOT stop steroids abruptly",
      "For steroid-refractory ADEM (no improvement after 3-5 days of IV methylprednisolone): initiate IVIG 2g/kg total dose divided over 2-5 days as second-line therapy",
      "For patients failing both steroids and IVIG: therapeutic plasma exchange (plasmapheresis) with 5-7 exchanges over 10-14 days to remove circulating autoantibodies and inflammatory mediators",
      "Manage seizures with appropriate anticonvulsants: levetiracetam is first-line; phenytoin or valproate as alternatives; continuous EEG monitoring if seizures are refractory or if clinical encephalopathy makes seizure detection difficult",
      "Provide supportive care: maintain airway and ventilatory support (intubation if GCS drops below 8 or if bulbar dysfunction impairs airway protection), prevent aspiration (elevate head of bed, NPO until swallowing assessment completed), manage cerebral edema (mannitol or hypertonic saline if signs of increased ICP)",
      "Initiate early rehabilitation: physical therapy, occupational therapy, speech-language pathology (particularly if dysphagia or dysarthria present); most children make a full or near-full recovery within 1-6 months"
    ],
    nursingActions: [
      "Perform comprehensive neurological assessment every 2-4 hours using Glasgow Coma Scale (GCS) and detailed cranial nerve, motor, sensory, and cerebellar examination; document and trend findings; report any deterioration immediately (declining GCS, new focal deficits, respiratory compromise)",
      "Monitor for signs of increased intracranial pressure (ICP): declining level of consciousness, headache with vomiting (projectile), pupil asymmetry (unilateral dilation indicates transtentorial herniation), Cushing triad (hypertension, bradycardia, irregular respirations), papilledema; elevate head of bed 30 degrees and maintain midline head position",
      "Assess respiratory function every 2-4 hours: rate, depth, pattern, oxygen saturation, ability to cough and clear secretions; bulbar dysfunction and brainstem involvement can compromise airway protection; keep suction and intubation equipment at bedside",
      "Administer IV methylprednisolone as prescribed: infuse over 30-60 minutes; monitor for hyperglycemia (check blood glucose every 6 hours during IV steroid pulse), hypertension, mood changes, insomnia, GI upset; administer with H2 blocker or PPI for GI prophylaxis",
      "Perform swallowing assessment before allowing oral intake (dysphagia from brainstem involvement is common); collaborate with speech-language pathology; maintain NPO status until swallowing safety is confirmed; provide nutritional support via NG tube if needed",
      "Monitor for IVIG adverse reactions if administered: headache, fever, chills during infusion (slow rate), aseptic meningitis (severe headache with nuchal rigidity 24-48 hours post-infusion), renal impairment (monitor BUN/creatinine), thrombotic events (rare)",
      "Provide age-appropriate psychosocial support for the child and family: explain the diagnosis and expected recovery trajectory, address parental anxiety about long-term neurological outcome, facilitate child life services in pediatric settings"
    ],
    assessmentFindings: [
      "Encephalopathy (the DEFINING feature of ADEM): altered level of consciousness ranging from lethargy, irritability, and confusion to obtundation and coma; distinguishes ADEM from clinically isolated syndrome and first MS attack",
      "Multifocal neurological deficits reflecting widespread CNS demyelination: hemiparesis, quadriparesis, ataxia, cranial nerve palsies, visual loss (optic neuritis), dysarthria, dysphagia",
      "Seizures occurring in 10-35% of cases: may be focal or generalized; can be the presenting symptom; refractory seizures or subtle seizures may require continuous EEG monitoring",
      "Fever and meningeal signs (headache, neck stiffness, photophobia) overlapping with infectious meningoencephalitis; requires CSF analysis to differentiate",
      "Preceding viral illness 1-4 weeks before neurological onset (identified in 50-75% of cases): history of upper respiratory infection, gastroenteritis, or exanthem",
      "Bilateral optic neuritis causing visual loss (more common in MOG-IgG positive ADEM): assess visual acuity, pupillary response (relative afferent pupillary defect), visual fields, and fundoscopic examination",
      "Spinal cord involvement (transverse myelitis component): weakness or paralysis below the level of the lesion, sensory level, urinary retention or incontinence, bowel dysfunction"
    ],
    signs: {
      left: [
        "Mild headache and low-grade fever with history of recent URI",
        "Mild irritability with intact orientation and normal neurological examination",
        "Slight ataxia or unsteady gait without focal weakness",
        "Mild visual blurring without objective visual acuity deficit",
        "Normal MRI or small isolated white matter lesion",
        "CSF with mild pleocytosis and normal protein"
      ],
      right: [
        "Obtundation or coma with GCS below 10 (severe encephalopathy)",
        "Rapidly progressive multifocal neurological deficits (hemiplegia, bilateral visual loss, bulbar dysfunction)",
        "Refractory seizures or status epilepticus requiring ICU management",
        "Respiratory failure from brainstem dysfunction or diaphragmatic weakness requiring intubation",
        "Signs of increased ICP: pupil asymmetry, Cushing triad, papilledema",
        "Failure to improve after 3-5 days of high-dose IV methylprednisolone (steroid-refractory ADEM)"
      ]
    },
    medications: [
      {
        name: "Methylprednisolone Sodium Succinate (Solu-Medrol)",
        type: "Systemic corticosteroid (glucocorticoid with potent anti-inflammatory and immunosuppressive properties)",
        action: "Suppresses the immune-mediated inflammatory demyelination by multiple mechanisms: inhibits T-lymphocyte proliferation and activation, reduces pro-inflammatory cytokine production (IL-1, IL-6, TNF-alpha), decreases blood-brain barrier permeability (reducing inflammatory cell infiltration into the CNS), promotes anti-inflammatory cytokine production, induces apoptosis of activated T-cells, and reduces cerebral edema; rapid onset of immunosuppression makes it first-line for acute demyelinating emergencies",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), hypertension, insomnia, mood changes (agitation, euphoria, psychosis), GI irritation and ulceration, increased infection risk, adrenal suppression (requires tapering -- never stop abruptly), fluid retention, hypokalemia, avascular necrosis with prolonged use",
        contra: "Systemic fungal infection; live vaccine administration during therapy; untreated bacterial infection (steroids mask signs of infection); uncontrolled diabetes (relative); active tuberculosis",
        pearl: "Infuse IV pulse dose over 30-60 minutes (rapid push can cause cardiac arrhythmias and hypotension); follow 3-5 day IV pulse with oral prednisone taper over 4-6 weeks -- premature steroid withdrawal increases relapse risk; always check blood glucose before and during therapy; administer PPI or H2 blocker for GI prophylaxis"
      },
      {
        name: "Intravenous Immunoglobulin (IVIG)",
        type: "Immunomodulatory agent (pooled human IgG antibodies from thousands of donors)",
        action: "Modulates the immune response through multiple mechanisms: Fc receptor blockade on macrophages (reducing phagocytosis of antibody-coated cells), anti-idiotypic antibodies that neutralize pathogenic autoantibodies, complement pathway inhibition, modulation of T-cell and B-cell function, and enhancement of regulatory T-cell activity; used as second-line therapy for ADEM when corticosteroids fail to produce adequate improvement",
        sideEffects: "Headache (most common, can be severe -- aseptic meningitis in 1-10%), fever and chills during infusion (rate-related), nausea, myalgias, hypertension, acute kidney injury (especially with sucrose-containing products), thrombotic events (DVT, PE, stroke -- particularly in elderly or immobilized patients), anaphylaxis in IgA-deficient patients",
        contra: "Selective IgA deficiency with anti-IgA antibodies (anaphylaxis risk); severe renal impairment (use non-sucrose formulations); known hypersensitivity to human immunoglobulin products; caution in patients with thrombotic risk factors",
        pearl: "Total dose 2g/kg divided over 2-5 days; pre-medicate with acetaminophen and diphenhydramine to reduce infusion reactions; start at slow rate and advance per protocol; check IgA level before first dose if IgA deficiency is suspected; monitor renal function and ensure adequate hydration; headache and fever during infusion are managed by slowing the rate"
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Anticonvulsant (synaptic vesicle protein SV2A modulator)",
        action: "Binds to synaptic vesicle protein SV2A in the presynaptic terminal, modulating neurotransmitter release and reducing neuronal excitability; provides broad-spectrum anticonvulsant activity against focal and generalized seizures; preferred in ADEM because it has minimal drug interactions, does not affect hepatic cytochrome P450 metabolism, does not require therapeutic drug monitoring, and has a favorable side effect profile in children",
        sideEffects: "Behavioral changes (irritability, agitation, aggression -- particularly in children), somnolence, dizziness, headache, nasopharyngitis; rarely: suicidal ideation (FDA black box warning for all anticonvulsants), Stevens-Johnson syndrome",
        contra: "Known hypersensitivity; severe renal impairment requires dose adjustment (levetiracetam is primarily renally excreted); use with caution in patients with psychiatric comorbidities (may worsen behavioral symptoms)",
        pearl: "First-line anticonvulsant for ADEM-related seizures because of broad spectrum, rapid IV loading capability, minimal drug interactions, and no hepatic metabolism; loading dose 20-30 mg/kg IV (maximum 1500 mg) followed by maintenance 10-30 mg/kg/day divided twice daily; monitor for behavioral side effects especially in pediatric patients; can be discontinued if seizure-free for 6-12 months after ADEM resolution"
      }
    ],
    pearls: [
      "Encephalopathy (altered level of consciousness) is the DEFINING clinical feature of ADEM that distinguishes it from clinically isolated syndrome (CIS) and a first attack of multiple sclerosis; a child with multifocal neurological deficits WITHOUT encephalopathy does not meet ADEM criteria",
      "ADEM is a monophasic disease by definition (single episode); if a patient has a second demyelinating event after 3 months, consider alternative diagnoses: multiple sclerosis, neuromyelitis optica spectrum disorder (NMOSD), or MOG antibody-associated disease (MOGAD)",
      "The ABSENCE of CSF oligoclonal bands strongly favors ADEM over multiple sclerosis (oligoclonal bands are present in greater than 95% of MS cases but are typically absent in ADEM); this is one of the most useful diagnostic distinctions",
      "MOG-IgG testing should be obtained in all children with ADEM; positive MOG-IgG identifies a distinct entity (MOGAD) with specific relapse risk and treatment implications requiring longer-term follow-up",
      "Most children (60-80%) make a full neurological recovery within 1-6 months; residual cognitive and behavioral deficits may persist even when motor recovery is complete; neuropsychological assessment should be performed after recovery",
      "High-dose IV methylprednisolone is first-line: 30 mg/kg/day (max 1g) for 3-5 days followed by oral taper over 4-6 weeks; stopping steroids too quickly risks relapse; monitor blood glucose every 6 hours during IV pulse therapy",
      "Delegate vital sign measurement and positioning to UAP; retain neurological assessment (GCS trending, pupil checks, motor/sensory examination), seizure recognition and management, steroid/IVIG infusion monitoring, and swallowing assessment coordination"
    ],
    quiz: [
      {
        question: "A 6-year-old child presents with acute onset of left-sided weakness, ataxia, and progressive drowsiness 2 weeks after an upper respiratory infection. MRI shows large, bilateral white matter lesions and basal ganglia involvement. CSF shows lymphocytic pleocytosis and absence of oligoclonal bands. Which diagnosis is MOST likely?",
        options: [
          "Multiple sclerosis",
          "Bacterial meningitis",
          "Acute disseminated encephalomyelitis (ADEM)",
          "Brain tumor with metastases"
        ],
        correct: 2,
        rationale: "This presentation is classic for ADEM: post-infectious onset (2 weeks after URI), multifocal neurological deficits (hemiparesis, ataxia), encephalopathy (drowsiness), bilateral white matter and deep gray matter lesions on MRI, CSF pleocytosis WITHOUT oligoclonal bands. MS would typically show oligoclonal bands and lesions of different ages."
      },
      {
        question: "A child with ADEM is receiving IV methylprednisolone. Which nursing assessment is MOST important during this therapy?",
        options: [
          "Monitoring urine specific gravity every 4 hours",
          "Checking blood glucose every 6 hours",
          "Assessing bowel sounds every 8 hours",
          "Measuring daily weight"
        ],
        correct: 1,
        rationale: "High-dose IV methylprednisolone frequently causes significant hyperglycemia due to glucocorticoid-mediated insulin resistance and hepatic gluconeogenesis. Blood glucose should be monitored every 6 hours during pulse steroid therapy, with insulin coverage administered as needed. Severe hyperglycemia can worsen neurological outcomes."
      },
      {
        question: "A nurse is caring for a child with ADEM who has brainstem involvement. Which assessment finding requires IMMEDIATE intervention?",
        options: [
          "Mild unsteady gait requiring assistance to walk",
          "Inability to swallow secretions with pooling saliva and decreasing oxygen saturation",
          "Mild headache responding to acetaminophen",
          "Mild visual blurring in one eye"
        ],
        correct: 1,
        rationale: "Inability to swallow secretions with oxygen desaturation indicates severe bulbar dysfunction from brainstem demyelination, creating immediate aspiration risk and potential airway compromise. This requires emergency intervention: suction, positioning, NPO status, and preparation for possible intubation. The other findings require monitoring but are not immediately life-threatening."
      }
    ]
  },

  "aflp-rn": {
    title: "Acute Fatty Liver of Pregnancy (AFLP) for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Acute Fatty Liver of Pregnancy",
      content: "Acute fatty liver of pregnancy (AFLP) is a rare but life-threatening obstetric emergency that occurs exclusively in the third trimester of pregnancy (typically between 30-38 weeks gestation), characterized by microvesicular fatty infiltration of hepatocytes leading to acute liver failure. The estimated incidence is 1 in 7,000 to 1 in 16,000 pregnancies, but the mortality rate has historically been 75-85% and, even with modern intensive care and prompt delivery, remains 7-18% for the mother and 9-23% for the fetus. The registered nurse must recognize the often subtle and nonspecific early symptoms of AFLP to facilitate rapid diagnosis and emergency delivery, which is the only definitive treatment.\n\nThe underlying pathogenesis of AFLP is linked to a defect in mitochondrial fatty acid oxidation, specifically a deficiency of long-chain 3-hydroxyacyl-CoA dehydrogenase (LCHAD) in the fetus. LCHAD is a key enzyme in the mitochondrial beta-oxidation pathway that breaks down long-chain fatty acids into acetyl-CoA for energy production. When the fetus is homozygous for an LCHAD mutation (the most common being the G1528C mutation in the HADHA gene), it cannot properly oxidize long-chain fatty acids. These unmetabolized fatty acid intermediates (long-chain 3-hydroxyacyl metabolites) accumulate in the fetal and placental circulation and are shunted into the maternal bloodstream. The mother, who is typically heterozygous for the same LCHAD mutation (carrier state with approximately 50% enzyme activity), has reduced capacity to metabolize these additional fatty acid intermediates, particularly during the third trimester when metabolic demands are highest.\n\nThe accumulating long-chain fatty acid metabolites are directly toxic to maternal hepatocytes. They are taken up by the liver and deposited as microvesicular fat droplets within the hepatocyte cytoplasm (as opposed to the macrovesicular steatosis seen in alcoholic liver disease or NAFLD, where a single large fat droplet displaces the nucleus). Microvesicular steatosis reflects mitochondrial dysfunction -- the hepatocytes have functioning rough endoplasmic reticulum and protein synthesis apparatus but their mitochondria cannot perform beta-oxidation. The accumulated fatty acids also impair mitochondrial oxidative phosphorylation, disrupting ATP production and further compromising hepatocyte function. As hepatocyte dysfunction progresses, all major hepatic functions deteriorate simultaneously.\n\nHepatic synthetic failure manifests as coagulopathy: decreased production of clotting factors (especially factors V, VII, and fibrinogen), leading to prolonged PT/INR, prolonged aPTT, and decreased fibrinogen levels. Fibrinogen levels below 300 mg/dL in pregnancy are abnormal (normal pregnancy elevates fibrinogen to 400-600 mg/dL) and fibrinogen below 150 mg/dL indicates severe coagulopathy. Many AFLP patients develop overt disseminated intravascular coagulation (DIC), with the combination of hepatic synthetic failure and consumptive coagulopathy creating a devastating hemorrhagic diathesis.\n\nHepatic metabolic failure produces hypoglycemia (the liver cannot maintain gluconeogenesis or glycogenolysis), hyperammonemia (the liver cannot convert ammonia to urea via the urea cycle), and lactic acidosis (impaired hepatic lactate clearance). Hypoglycemia can be profound and life-threatening, requiring continuous dextrose infusion. Hyperammonemia causes hepatic encephalopathy with progressive confusion, somnolence, asterixis (flapping tremor), and eventually coma.\n\nHepatic excretory failure causes conjugated (direct) hyperbilirubinemia and jaundice as the liver cannot excrete bilirubin into bile. Serum transaminases (AST, ALT) are elevated but typically only modestly (300-500 U/L, rarely above 1000), which is disproportionately low compared to the severity of liver dysfunction. This is because microvesicular steatosis causes hepatocyte dysfunction rather than massive hepatocyte necrosis (which produces very high transaminase levels in conditions like acetaminophen toxicity or viral hepatitis). The relatively modest transaminase elevation despite severe liver failure is a characteristic feature of AFLP.\n\nRenal failure complicates 50-60% of AFLP cases through multiple mechanisms: hepatorenal syndrome (functional renal failure from splanchnic vasodilation and renal vasoconstriction), direct fatty acid toxicity to renal tubular cells, hypovolemia from hemorrhage and third-spacing, and DIC-mediated renal microvascular thrombosis.\n\nThe Swansea criteria provide a standardized diagnostic framework for AFLP, requiring six or more of the following features in the absence of another explanation: vomiting, abdominal pain, polydipsia/polyuria, encephalopathy, elevated bilirubin (above 14 micromol/L), hypoglycemia (below 4 mmol/L), elevated uric acid (above 340 micromol/L), leukocytosis (above 11 x 10^9/L), ascites or bright liver on ultrasound, elevated transaminases (above 42 U/L), elevated ammonia (above 47 micromol/L), renal impairment (creatinine above 150 micromol/L), coagulopathy (PT above 14 seconds), and microvesicular steatosis on liver biopsy. Liver biopsy, while histologically definitive, is rarely performed due to coagulopathy risk and is not required for clinical diagnosis.\n\nAFLP exists on a spectrum with two other third-trimester hepatic disorders: HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) and severe preeclampsia with hepatic involvement. These conditions share some pathophysiological mechanisms (endothelial dysfunction, microangiopathy) and clinical features, making differentiation challenging. Key distinguishing features of AFLP include more prominent hypoglycemia, lower fibrinogen, more severe coagulopathy, higher ammonia levels, and the characteristic microvesicular steatosis pattern. In practice, the clinical management is similar for all three: immediate delivery.\n\nThe definitive treatment for AFLP is immediate delivery of the fetus and placenta, which removes the source of toxic fatty acid metabolites. Vaginal delivery is preferred if maternal and fetal conditions allow rapid delivery, but cesarean section is often necessary due to maternal instability, fetal distress, or unfavorable cervical status. After delivery, hepatic function typically begins to improve within 48-72 hours, although complete recovery may take weeks to months. Some patients develop fulminant liver failure requiring liver transplantation despite delivery."
    },
    riskFactors: [
      "Primigravida (first pregnancy) -- AFLP is more common in first pregnancies, possibly due to higher metabolic demands and lack of prior metabolic adaptation",
      "Male fetus (AFLP occurs more frequently when the fetus is male, though the mechanism is not fully understood)",
      "Multiple gestation (twin or higher-order pregnancies) increasing the metabolic load of fatty acid intermediates from multiple placentas",
      "Fetal LCHAD deficiency (homozygous G1528C mutation in HADHA gene) with maternal heterozygous carrier status -- the primary pathogenic mechanism",
      "Pre-eclampsia or HELLP syndrome (may coexist with or predispose to AFLP; shared endothelial dysfunction pathways)",
      "Low maternal body mass index (reduced hepatic fat storage capacity may increase susceptibility to fatty acid metabolite toxicity)",
      "Third trimester beyond 30 weeks gestation (AFLP almost never occurs before 26 weeks; peak incidence 34-37 weeks)"
    ],
    diagnostics: [
      "Swansea diagnostic criteria: six or more of 14 clinical and laboratory features (vomiting, abdominal pain, polydipsia/polyuria, encephalopathy, elevated bilirubin, hypoglycemia, elevated uric acid, leukocytosis, ascites/bright liver on US, elevated AST/ALT, elevated ammonia, renal impairment, coagulopathy, microvesicular steatosis on biopsy)",
      "Liver function tests: AST/ALT elevated but typically modest (300-500 U/L, rarely above 1000); total bilirubin elevated (conjugated predominant); albumin decreased; this pattern of moderate transaminase elevation with severe synthetic dysfunction is characteristic of AFLP",
      "Coagulation studies: PT/INR prolonged, aPTT prolonged, fibrinogen critically low (below 300 mg/dL in pregnancy is abnormal; below 150 mg/dL indicates severe coagulopathy); D-dimer markedly elevated indicating DIC",
      "Blood glucose: hypoglycemia may be profound and life-threatening; check bedside glucose every 1-2 hours; maintain continuous dextrose infusion if glucose falls below 60 mg/dL",
      "Serum ammonia: elevated due to impaired urea cycle function; correlates with hepatic encephalopathy severity; levels above 100 micromol/L indicate severe hepatic failure",
      "Abdominal ultrasound: may show bright (echogenic) liver consistent with fatty infiltration, ascites, and normal hepatic vasculature (excludes Budd-Chiari syndrome); however, sensitivity of ultrasound for AFLP is only 50-60% -- a normal ultrasound does NOT exclude AFLP"
    ],
    management: [
      "IMMEDIATE DELIVERY is the definitive treatment: the fetus and placenta must be delivered as soon as the diagnosis is made or strongly suspected, regardless of gestational age; delay increases maternal and fetal mortality; vaginal delivery if cervix is favorable and condition permits, otherwise emergent cesarean section",
      "Correct coagulopathy aggressively before and during delivery: fresh frozen plasma (FFP) to replace clotting factors (target INR below 1.5), cryoprecipitate for fibrinogen below 150 mg/dL (target above 200 mg/dL), platelet transfusion for platelets below 50,000; have massive transfusion protocol activated",
      "Treat hypoglycemia with continuous IV dextrose infusion: 10% dextrose at rate sufficient to maintain blood glucose above 60 mg/dL; monitor bedside glucose every 1-2 hours; hypoglycemia can be refractory and severe, requiring high dextrose concentrations via central line",
      "Manage hepatic encephalopathy: lactulose 30 mL every 4-6 hours to reduce ammonia absorption; rifaximin 550 mg twice daily as adjunctive therapy; avoid hepatotoxic medications and sedatives that are hepatically metabolized; frequent neurological assessments",
      "Provide aggressive supportive care in ICU setting: continuous hemodynamic monitoring, mechanical ventilation if encephalopathy compromises airway protection, renal replacement therapy (CRRT) for oliguric renal failure, vasopressor support for hemodynamic instability",
      "Initiate continuous fetal monitoring during stabilization and delivery preparation: non-stress test, biophysical profile; fetal distress (late decelerations, absent variability) may necessitate emergent cesarean section before maternal stabilization is complete",
      "Post-delivery monitoring: hepatic function should begin improving within 48-72 hours; if liver function continues to deteriorate after delivery, evaluate for fulminant liver failure requiring transplant evaluation; screen the newborn for LCHAD deficiency"
    ],
    nursingActions: [
      "Assess neurological status every 1-2 hours using GCS and assess for hepatic encephalopathy signs: asterixis (flapping tremor of extended wrists), confusion, disorientation, somnolence, slurred speech; report any deterioration immediately as it may indicate worsening liver failure or need for intubation",
      "Monitor blood glucose at bedside every 1-2 hours; maintain continuous dextrose infusion as prescribed; hypoglycemia in AFLP can be profound, rapid in onset, and fatal -- this is one of the most critical monitoring parameters",
      "Assess for bleeding from ALL sites every 1-2 hours: IV sites, surgical incision, vaginal bleeding (postpartum hemorrhage risk is extremely high due to DIC), gingival bleeding, epistaxis, hematuria, petechiae, ecchymoses; report any new or worsening bleeding immediately",
      "Monitor urine output hourly via Foley catheter; report output below 0.5 mL/kg/hour indicating renal failure; assess urine color (dark amber/cola suggests hemoglobinuria from microangiopathic hemolysis); send specimens for urinalysis as ordered",
      "Administer blood products as prescribed for coagulopathy: FFP through blood warmer, cryoprecipitate, platelets; verify compatibility per transfusion protocol; monitor for transfusion reactions; keep massive transfusion protocol supplies readily available",
      "Coordinate with obstetric, anesthesia, neonatal, and hepatology/ICU teams for delivery planning; ensure operating room is prepared for emergent cesarean section with massive transfusion protocol activated; prepare for potential ICU admission postpartum",
      "After delivery, continue intensive monitoring: liver function should improve within 48-72 hours; if worsening, escalate to hepatology for transplant evaluation; support breastfeeding if maternal condition allows; provide emotional support for family as AFLP is a frightening diagnosis with significant morbidity"
    ],
    assessmentFindings: [
      "Nonspecific early symptoms that are easily dismissed: persistent nausea and vomiting, malaise, anorexia, abdominal pain (especially RUQ or epigastric), and fatigue in the third trimester -- these symptoms should raise suspicion for AFLP when they are new-onset and progressive",
      "Jaundice (present in 70% of cases) with dark urine and pale stools indicating conjugated hyperbilirubinemia; jaundice may develop rapidly over days",
      "Encephalopathy ranging from subtle confusion and personality changes to asterixis, somnolence, and coma; encephalopathy indicates advanced hepatic failure and mandates immediate delivery",
      "Polydipsia and polyuria (from transient diabetes insipidus, which occurs in 5-10% of AFLP cases due to impaired hepatic clearance of placental vasopressinase)",
      "Signs of DIC: petechiae, ecchymoses, oozing from venipuncture sites, gingival bleeding, hematuria, and postpartum hemorrhage; DIC complicates 50-70% of AFLP cases",
      "Hypoglycemia symptoms: tremor, diaphoresis, confusion, seizures; may be masked by concurrent encephalopathy; requires frequent bedside glucose monitoring",
      "Signs of preeclampsia overlap (present in 50% of AFLP cases): hypertension, proteinuria, edema; the coexistence of preeclampsia features with hepatic failure and hypoglycemia should prompt evaluation for AFLP"
    ],
    signs: {
      left: [
        "Mild nausea with normal liver function tests in late third trimester",
        "Mild fatigue and malaise without jaundice or encephalopathy",
        "Normal blood glucose and normal coagulation studies",
        "Mild RUQ tenderness without hepatomegaly",
        "Normal fetal heart tracing with reassuring variability",
        "Mild elevation of uric acid with normal renal function"
      ],
      right: [
        "Jaundice with encephalopathy and asterixis (liver failure triad)",
        "Profound hypoglycemia (below 40 mg/dL) requiring continuous dextrose infusion",
        "DIC with active hemorrhage: fibrinogen below 100 mg/dL, INR above 2.0, platelets below 50,000",
        "Oliguric renal failure (urine output below 0.5 mL/kg/hour despite adequate resuscitation)",
        "Non-reassuring fetal heart tracing with late decelerations and absent variability",
        "Progressive encephalopathy with declining GCS requiring airway protection"
      ]
    },
    medications: [
      {
        name: "Dextrose 10% (D10W) Continuous Infusion",
        type: "Hypertonic glucose solution / metabolic support",
        action: "Provides exogenous glucose to maintain blood glucose levels in patients with severe hypoglycemia from hepatic failure; the failing liver cannot perform gluconeogenesis (conversion of amino acids and lactate to glucose) or glycogenolysis (breakdown of glycogen stores to glucose); continuous infusion maintains a steady blood glucose level and prevents the dangerous glucose fluctuations that occur with bolus dosing",
        sideEffects: "Hyperglycemia (with excessive infusion rate), fluid overload, hyponatremia (dilutional from free water in dextrose solutions), phlebitis and vein sclerosis with peripheral infusion of higher concentrations, hyperinsulinemia rebound if discontinued abruptly",
        contra: "Hyperglycemia (titrate rate to maintain glucose 70-150 mg/dL); diabetic ketoacidosis (requires insulin, not dextrose); severe fluid overload or pulmonary edema (assess fluid status before increasing rate)",
        pearl: "In AFLP, hypoglycemia can be PROFOUND and REFRACTORY -- may require D10W at high rates (100-200 mL/hour) or D50W boluses (25-50 mL) for rescue; monitor bedside glucose every 1-2 hours; concentrations above 12.5% require central venous access to prevent phlebitis; never discontinue dextrose infusion abruptly in AFLP patients"
      },
      {
        name: "Vitamin K (Phytonadione)",
        type: "Fat-soluble vitamin / coagulation factor cofactor",
        action: "Serves as an essential cofactor for hepatic gamma-carboxylation of vitamin K-dependent clotting factors (Factors II, VII, IX, X, and proteins C and S); in AFLP, vitamin K supplementation supports whatever residual hepatic synthetic capacity remains; however, efficacy is limited because the primary problem is hepatocyte failure rather than vitamin K deficiency -- the liver may be too damaged to synthesize clotting factors even with adequate vitamin K substrate",
        sideEffects: "Anaphylactoid reactions with IV administration (rare but potentially fatal; administer slowly over 30 minutes and monitor), pain at injection site (IM/SubQ), flushing, altered taste, transient hypotension",
        contra: "Known hypersensitivity; IV route carries higher risk of anaphylactoid reactions than SubQ or IM routes; IM injection is contraindicated in severe coagulopathy (hematoma risk)",
        pearl: "Administer IV slowly (over 30 minutes minimum) due to risk of anaphylactoid reaction; onset of action is 6-12 hours (time required for hepatic synthesis of new clotting factors); in AFLP with severe coagulopathy, vitamin K alone is INSUFFICIENT -- FFP and cryoprecipitate are needed for immediate correction; give SubQ if mild coagulopathy without active bleeding"
      },
      {
        name: "Lactulose",
        type: "Osmotic laxative / ammonia-reducing agent",
        action: "Metabolized by colonic bacteria to lactic acid and acetic acid, which lower colonic pH; the acidic environment converts ammonia (NH3, which freely crosses the blood-brain barrier) to ammonium (NH4+, which is charged and trapped in the gut lumen), preventing systemic absorption; also acts as an osmotic laxative that increases stool frequency, reducing the time available for ammonia production and absorption from the colon; reduces serum ammonia levels and improves hepatic encephalopathy",
        sideEffects: "Diarrhea (dose-dependent, therapeutic goal is 2-3 soft bowel movements per day), abdominal bloating and cramping, flatulence, nausea, hypernatremia and dehydration from excessive diarrhea, electrolyte imbalances",
        contra: "Galactosemia (lactulose contains galactose); bowel obstruction (osmotic effect could worsen obstruction); use with caution in diabetes (contains small amounts of galactose and lactose)",
        pearl: "Target 2-3 soft bowel movements per day; titrate dose to achieve this goal; excessive dosing causes severe diarrhea leading to dehydration and electrolyte imbalances that can worsen encephalopathy; in obtunded patients, lactulose can be administered rectally as a retention enema (300 mL in 700 mL water); monitor and trend serum ammonia levels to assess response"
      }
    ],
    pearls: [
      "AFLP is a medical AND obstetric emergency: the ONLY definitive treatment is IMMEDIATE DELIVERY of the fetus and placenta, which removes the source of toxic fatty acid metabolites; every hour of delay increases maternal and fetal mortality",
      "The hallmark laboratory pattern of AFLP is moderate transaminase elevation (300-500 U/L) with DISPROPORTIONATELY severe liver synthetic failure (high INR, low fibrinogen, hypoglycemia, elevated ammonia) -- this pattern of moderate enzymes with severe dysfunction distinguishes AFLP from viral hepatitis or acetaminophen toxicity",
      "Hypoglycemia is the most dangerous metabolic derangement in AFLP and can cause seizures, coma, and death; monitor bedside glucose every 1-2 hours and maintain continuous dextrose infusion; never leave an AFLP patient without IV glucose access",
      "Fibrinogen below 300 mg/dL in pregnancy is ABNORMAL (normal pregnancy elevates fibrinogen to 400-600 mg/dL); in AFLP with DIC, fibrinogen may fall below 100 mg/dL; target fibrinogen above 200 mg/dL with cryoprecipitate before delivery to reduce hemorrhage risk",
      "AFLP coexists with preeclampsia in approximately 50% of cases; when third-trimester liver dysfunction occurs with hypertension, the clinician must consider both diagnoses and their overlap with HELLP syndrome",
      "After delivery, liver function should begin improving within 48-72 hours; if liver function continues to deteriorate, the patient may have progressed to fulminant liver failure requiring transplant evaluation; continued monitoring in ICU is essential",
      "The newborn of an AFLP mother should be screened for LCHAD deficiency (heel-prick blood spot for acylcarnitine profile); early identification allows dietary management (avoidance of long-chain fatty acids) that prevents metabolic crises and sudden death in the infant"
    ],
    quiz: [
      {
        question: "A 34-week pregnant patient presents with nausea, vomiting, RUQ pain, and jaundice. Lab results show AST 380, ALT 420, INR 2.3, fibrinogen 120 mg/dL, and blood glucose 42 mg/dL. Which condition should the nurse suspect?",
        options: [
          "Acute viral hepatitis A",
          "Acute fatty liver of pregnancy (AFLP)",
          "Cholelithiasis with cholecystitis",
          "Hyperemesis gravidarum"
        ],
        correct: 1,
        rationale: "This presentation is classic AFLP: third trimester, moderate transaminase elevation (300-500 range) with disproportionately severe synthetic failure (INR 2.3, fibrinogen 120), and profound hypoglycemia (42 mg/dL). Viral hepatitis would show much higher transaminases. Cholecystitis would not cause coagulopathy or hypoglycemia. Hyperemesis occurs in the first trimester."
      },
      {
        question: "A nurse is caring for a patient diagnosed with AFLP. Which nursing intervention has the HIGHEST priority?",
        options: [
          "Administering antiemetics for nausea and vomiting",
          "Monitoring blood glucose every 1-2 hours and maintaining continuous dextrose infusion",
          "Applying compression stockings for DVT prevention",
          "Providing comfort measures and emotional support"
        ],
        correct: 1,
        rationale: "Hypoglycemia is the most immediately life-threatening metabolic complication of AFLP and can cause seizures, coma, and death. Frequent blood glucose monitoring with continuous dextrose infusion is the highest priority nursing intervention. While all other interventions are appropriate, preventing and treating hypoglycemia takes precedence."
      },
      {
        question: "What is the definitive treatment for acute fatty liver of pregnancy?",
        options: [
          "High-dose IV corticosteroids to reduce hepatic inflammation",
          "Liver transplantation",
          "Immediate delivery of the fetus and placenta",
          "Therapeutic plasma exchange to remove toxic metabolites"
        ],
        correct: 2,
        rationale: "Immediate delivery is the ONLY definitive treatment for AFLP. Delivery removes the fetus and placenta, which are the source of the toxic long-chain fatty acid metabolites that are causing maternal liver damage. After delivery, liver function typically begins to improve within 48-72 hours. Liver transplant is reserved for rare cases of fulminant failure that do not improve after delivery."
      }
    ]
  }
};

console.log("RN Batch 2: Injecting 4 lessons...");
let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`Done: ${count} lessons injected`);
