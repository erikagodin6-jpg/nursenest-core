import type { LessonContent } from "./types";

export const npCurriculumBatch1: Record<string, LessonContent> = {

  "acute-liver-failure-np": {
    title: "Acute Liver Failure: NP Diagnostic Workup & Critical Management",
    cellular: {
      title: "Acute Liver Failure Pathophysiology",
      content: "Acute liver failure (ALF) is defined as severe hepatic injury with coagulopathy (INR ≥ 1.5) and hepatic encephalopathy in a patient without preexisting cirrhosis, occurring within 26 weeks of symptom onset. The classification is subdivided by tempo: hyperacute (< 7 days, e.g., acetaminophen), acute (7–21 days), and subacute (> 21 days to 26 weeks). The pathophysiology centers on massive hepatocyte necrosis or apoptosis. In acetaminophen toxicity (the most common cause in the US and Canada), the cytochrome P450 enzyme CYP2E1 converts acetaminophen to the toxic metabolite N-acetyl-p-benzoquinone imine (NAPQI). NAPQI is normally conjugated by glutathione, but when glutathione stores are depleted (overdose, chronic alcohol use, malnutrition), NAPQI binds to hepatocyte mitochondrial proteins, causing oxidative stress, mitochondrial dysfunction, and centrilobular necrosis (zone 3 of the hepatic acinus). In viral hepatitis-induced ALF (hepatitis A, B, rarely E), immune-mediated hepatocyte destruction occurs via cytotoxic CD8+ T cells and NK cells targeting viral antigens on hepatocyte surfaces. The consequences of massive hepatocyte loss include: (1) loss of synthetic function — decreased clotting factor production (II, V, VII, IX, X) causing coagulopathy, decreased albumin production causing ascites and edema; (2) loss of metabolic function — impaired ammonia clearance leading to cerebral edema and encephalopathy (ammonia crosses the blood-brain barrier and is converted to glutamine by astrocytes, causing osmotic swelling), impaired lactate clearance causing lactic acidosis, impaired drug metabolism; (3) loss of immune function — decreased complement production and impaired Kupffer cell function predisposing to sepsis (the leading cause of death in ALF). Cerebral edema is the most feared complication and leading cause of death, resulting from astrocyte swelling due to intracellular glutamine accumulation (osmotic theory) and loss of cerebral autoregulation. The King's College Criteria remain the most widely validated prognostic tool for determining the need for liver transplantation."
    },
    riskFactors: [
      "Acetaminophen overdose: intentional (suicidal) or unintentional (therapeutic misadventure — multiple acetaminophen-containing products, chronic alcohol use enhancing CYP2E1 induction, malnutrition depleting glutathione)",
      "Viral hepatitis: hepatitis B (most common viral cause worldwide), hepatitis A (rare but more common in endemic areas), hepatitis E (especially in pregnancy — 20% mortality rate)",
      "Drug-induced liver injury (DILI): idiosyncratic reactions to anti-TB drugs (isoniazid, rifampin), anticonvulsants (phenytoin, valproic acid), antibiotics (amoxicillin-clavulanate, trimethoprim-sulfamethoxazole), statins, herbal supplements (kava, comfrey, green tea extract)",
      "Autoimmune hepatitis: can present as ALF, particularly in young women; may respond to corticosteroids if identified early",
      "Budd-Chiari syndrome: hepatic vein thrombosis causing acute hepatic congestion and necrosis; associated with hypercoagulable states, myeloproliferative disorders, OCP use",
      "Wilson disease: acute presentation with Coombs-negative hemolytic anemia + liver failure in young adults (age < 40); characteristically low ceruloplasmin and elevated 24-hour urine copper",
      "Amanita phalloides mushroom poisoning: amatoxin inhibits RNA polymerase II causing hepatocyte death; 6–12 hour latency after ingestion before GI symptoms, then hepatic failure at 48–72 hours",
      "Pregnancy-related: acute fatty liver of pregnancy (AFLP — microvesicular steatosis from mitochondrial fatty acid oxidation defects), HELLP syndrome"
    ],
    diagnostics: [
      "Initial labs (STAT): CBC, CMP (AST/ALT often > 3,000 in acetaminophen, may be lower in subacute presentations), PT/INR (INR ≥ 1.5 defines ALF; factor V level < 20% predicts poor prognosis), total and direct bilirubin, ammonia level (correlates with encephalopathy grade), lactate (prognostic — arterial lactate > 3.5 mmol/L after fluid resuscitation predicts poor outcome in acetaminophen ALF)",
      "Acetaminophen level and timing: plot on Rumack-Matthew nomogram if acute ingestion with known time; in staggered overdose or chronic ingestion, level may be low or undetectable despite severe injury — treat based on clinical picture and ALT",
      "Viral hepatitis panel: HAV IgM, HBsAg, HBV DNA, anti-HBc IgM, HCV RNA, HEV IgM (if endemic area or pregnancy)",
      "Autoimmune markers: ANA, anti-smooth muscle antibody (ASMA), IgG levels, anti-LKM-1 — elevated in autoimmune hepatitis",
      "Wilson disease workup (if age < 40 or hemolysis present): ceruloplasmin (low), 24-hour urine copper (elevated), alkaline phosphatase:bilirubin ratio < 4 and AST:ALT ratio > 2.2 suggest Wilson-related ALF",
      "Toxicology screen: urine drug screen, serum ethanol, salicylate level",
      "Imaging: abdominal ultrasound with Doppler (assess hepatic vein patency — Budd-Chiari; liver echotexture; ascites), CT head if encephalopathy grade III–IV (cerebral edema assessment)",
      "King's College Criteria for liver transplant listing — Acetaminophen: arterial pH < 7.30 after fluid resuscitation OR all three of (INR > 6.5 + creatinine > 3.4 mg/dL + grade III–IV encephalopathy). Non-acetaminophen: INR > 6.5 OR any 3 of (age < 10 or > 40, unfavorable etiology, duration > 7 days before encephalopathy, INR > 3.5, bilirubin > 17.5 mg/dL)"
    ],
    management: [
      "N-acetylcysteine (NAC): FIRST-LINE antidote for acetaminophen toxicity — 150 mg/kg IV over 1 hour, then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours (21-hour protocol). Also beneficial in non-acetaminophen ALF (improves transplant-free survival in grades I–II encephalopathy by improving hepatic blood flow and reducing oxidative stress). Continue until INR improving and encephalopathy resolving.",
      "ICU admission: all patients with ALF require ICU-level care; arterial line, central venous access, continuous telemetry, hourly neurological assessment, Foley catheter for strict I&O",
      "Cerebral edema management: elevate head of bed 30°, avoid stimulation, maintain PaCO2 30–35 mmHg (mild hyperventilation), hypertonic saline (3% NaCl) to maintain serum sodium 145–155 mEq/L (osmotic therapy), mannitol 0.5–1 g/kg IV for acute ICP elevation, avoid hyperthermia (target normothermia), consider ICP monitoring for grade III–IV encephalopathy",
      "Coagulopathy: do NOT correct INR prophylactically (INR is a prognostic marker — correcting it obscures disease trajectory); correct only for active bleeding or prior to invasive procedures; FFP 10–15 mL/kg or recombinant factor VIIa for bleeding; vitamin K 10 mg IV × 1 (in case of concurrent deficiency)",
      "Hemodynamic support: goal MAP ≥ 75 mmHg to maintain cerebral perfusion; volume resuscitation with crystalloid; norepinephrine first-line vasopressor (avoid lactated Ringer's — impaired hepatic lactate clearance); vasopressin as adjunct",
      "Infection prevention: blood cultures and empiric broad-spectrum antibiotics (piperacillin-tazobactam or meropenem + vancomycin) if hemodynamic instability or progression of encephalopathy — sepsis is the leading cause of death; antifungal coverage (fluconazole) if not improving on antibacterials",
      "Hepatic encephalopathy: lactulose 30 mL PO/NG q2h titrated to 3–4 stools/day (controversial in ALF — risk of bowel distension; some centers use rifaximin instead); avoid sedatives that worsen encephalopathy; grade III–IV may require intubation for airway protection",
      "Liver transplant evaluation: early referral to transplant center is CRITICAL — contact transplant hepatology as soon as ALF diagnosis is made; list patient if meeting King's College Criteria or MELD score > 30; living donor liver transplant or cadaveric transplant"
    ],
    nursingActions: [
      "Hourly neurological assessment using West Haven encephalopathy grading (Grade I: trivial lack of awareness, shortened attention; Grade II: lethargy, minimal disorientation; Grade III: somnolence, confusion, gross disorientation; Grade IV: coma, no response to stimuli) — rapid progression from grade II to grade IV can occur within hours",
      "NAC infusion monitoring: watch for anaphylactoid reactions (flushing, urticaria, bronchospasm) — most common during the loading dose; slow infusion rate and administer diphenhydramine if reaction occurs; do NOT stop NAC unless severe anaphylaxis",
      "Strict glucose monitoring q1–2h: hypoglycemia is common in ALF (impaired hepatic gluconeogenesis and glycogenolysis); maintain glucose > 70 mg/dL with D10 or D50 infusion; refractory hypoglycemia indicates severe hepatic failure",
      "Coagulation monitoring: INR q6–12h as prognostic marker (rising INR = worsening liver function); do not draw unnecessary blood or perform unnecessary procedures (thrombocytopenia and coagulopathy increase bleeding risk)",
      "Fluid and electrolyte management: strict I&O, daily weights; monitor for hyponatremia (dilutional), hypokalemia (metabolic alkalosis from vomiting/lactulose), hypophosphatemia (refeeding or liver regeneration); replace electrolytes aggressively",
      "Temperature management: fever screening q4h; maintain normothermia (hypothermia can be hepatoprotective but should only be used as directed by transplant team); fever may indicate infection — obtain cultures before empiric antibiotics",
      "ICP precautions for grade III–IV encephalopathy: minimize stimulation, keep room quiet and dark, elevate HOB 30°, avoid Valsalva, avoid hyperthermia, maintain serum sodium 145–155 mEq/L with hypertonic saline",
      "Family communication and transplant coordination: ALF progresses rapidly — early goals-of-care conversations; coordinate with transplant team; ensure blood typing and cross-match completed; social work and chaplain support"
    ],
    signs: {
      left: [
        "Grade I–II encephalopathy: irritability, reversal of sleep-wake cycle, asterixis (liver flap), mild confusion — may still respond to NAC and supportive care",
        "INR 1.5–3.0 with stable or improving trend — suggests early or recovering ALF",
        "AST/ALT trending down with improving synthetic function (albumin, INR) — liver regeneration occurring",
        "Acetaminophen-induced ALF identified within 8–10 hours with early NAC administration — best prognosis (transplant-free survival > 70%)"
      ],
      right: [
        "Grade III–IV encephalopathy with cerebral edema: fixed dilated pupils, decerebrate posturing, loss of brainstem reflexes — herniation risk; URGENT ICP management and transplant evaluation",
        "King's College Criteria met: arterial pH < 7.30 (acetaminophen) or INR > 6.5 (non-acetaminophen) — LIST for liver transplant IMMEDIATELY",
        "Arterial lactate > 3.5 mmol/L after fluid resuscitation in acetaminophen ALF — predicts death without transplant with > 90% sensitivity",
        "Multi-organ failure: renal failure requiring CRRT, ARDS, DIC with active hemorrhage, vasopressor-dependent shock — prognosis grim without transplant"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (NAC, Acetadote)",
        type: "Antidote / Glutathione Precursor",
        action: "Replenishes hepatic glutathione stores to conjugate and detoxify NAPQI (acetaminophen metabolite). Also acts as free radical scavenger, improves hepatic microcirculation, and enhances oxygen delivery. In non-acetaminophen ALF, NAC improves transplant-free survival through anti-inflammatory and antioxidant mechanisms.",
        sideEffects: "Anaphylactoid reactions (dose-related, most common during loading dose): flushing, pruritus, urticaria, angioedema, bronchospasm, tachycardia; nausea and vomiting (especially with oral dosing)",
        contra: "No absolute contraindications in ALF — benefit far outweighs risk. Relative: prior severe anaphylactoid reaction to NAC (premedicate with diphenhydramine and slow infusion rate)",
        pearl: "IV protocol: 150 mg/kg over 1h → 50 mg/kg over 4h → 100 mg/kg over 16h. Continue beyond 21 hours if INR still elevated or encephalopathy persists. Oral protocol (less common in ALF due to vomiting): 140 mg/kg loading then 70 mg/kg q4h × 17 additional doses. NAC is most effective when given within 8 hours of acetaminophen ingestion, but should be started even late (> 24 hours) if ALF is present. In non-acetaminophen ALF, NAC improved transplant-free survival from 30% to 52% in patients with grade I–II encephalopathy (AASLD recommendation)."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia-Lowering Agent",
        action: "Metabolized by colonic bacteria to lactic acid and acetic acid, lowering colonic pH and converting ammonia (NH3) to non-absorbable ammonium (NH4+), which is then excreted in stool. Also acts as osmotic laxative increasing fecal ammonia excretion.",
        sideEffects: "Bloating, flatulence, abdominal cramping, diarrhea (therapeutic effect), hyponatremia, hypokalemia from excessive diarrhea, risk of bowel distension and aspiration in obtunded patients",
        contra: "Galactosemia; use cautiously in ALF — risk of bowel distension and ileus in critically ill patients (some hepatology centers prefer rifaximin instead in ALF setting)",
        pearl: "Dose: 30 mL PO/NG q2h initially, titrated to 3–4 soft stools per day. In ALF, lactulose is more controversial than in chronic liver disease — cerebral edema in ALF is primarily from astrocyte swelling (osmotic mechanism) rather than ammonia alone. Some transplant centers avoid lactulose in grade III–IV encephalopathy due to aspiration risk and use rifaximin 550 mg BID instead. Monitor closely for excessive diarrhea causing dehydration and electrolyte depletion."
      },
      {
        name: "Mannitol (for cerebral edema)",
        type: "Osmotic Diuretic / ICP-Lowering Agent",
        action: "Creates an osmotic gradient across the blood-brain barrier, drawing water from cerebral tissue into the intravascular compartment, reducing intracranial pressure. Also reduces CSF production.",
        sideEffects: "Rebound intracranial hypertension (with repeated dosing), acute kidney injury (osmotic nephrosis), hyponatremia (dilutional), hypokalemia, volume depletion, metabolic acidosis",
        contra: "Severe renal failure (anuria — mannitol cannot be excreted and causes volume overload), pre-existing severe hyponatremia (serum sodium < 120 mEq/L), pulmonary edema",
        pearl: "0.5–1 g/kg IV bolus over 15–20 minutes for acute ICP elevation. Maintain serum osmolality < 320 mOsm/kg (higher levels risk renal damage). In ALF, hypertonic saline (3% NaCl targeting Na 145–155) is increasingly preferred over mannitol for sustained ICP management. Mannitol is best reserved for acute herniation events as a bridge to transplant. Monitor serum osmolality q6h and osmolar gap."
      }
    ],
    pearls: [
      "The most critical decision in ALF is EARLY referral to a liver transplant center — do not wait for King's College Criteria to be fully met; contact transplant hepatology at the time of diagnosis. Transfer delays are a leading cause of preventable death in ALF.",
      "Acetaminophen-induced ALF has a paradoxically BETTER prognosis than most other etiologies (transplant-free survival ~65% vs ~25% for non-acetaminophen ALF) because acetaminophen injury is dose-dependent and potentially reversible with NAC, while other etiologies often cause irreversible damage.",
      "Do NOT correct INR prophylactically in ALF — the INR is the single most important prognostic marker for disease trajectory. Correcting it with FFP masks disease progression and delays transplant listing. Only correct for active hemorrhage or immediately before invasive procedures.",
      "The triad of ALF requiring immediate ICU evaluation: coagulopathy (INR ≥ 1.5) + encephalopathy (any grade) + acute onset (no prior liver disease). Any patient with unexplained coagulopathy and altered mental status should have liver function tests checked emergently.",
      "Wilson disease should be suspected in any patient < 40 years with ALF + Coombs-negative hemolytic anemia. The alkaline phosphatase:total bilirubin ratio < 4 and AST:ALT > 2.2 are highly suggestive. Wilson disease ALF has near 100% mortality without transplant."
    ],
    quiz: [
      {
        question: "A 28-year-old woman presents to the ED with 3 days of nausea, vomiting, and confusion. She reports taking 'extra Tylenol' for headaches over the past week (unknown total dose). Labs: AST 8,200, ALT 6,900, INR 4.2, total bilirubin 5.8, creatinine 2.1, arterial pH 7.28. Acetaminophen level is < 10 mcg/mL. The most appropriate next step is:",
        options: [
          "Withhold NAC since acetaminophen level is undetectable and the drug has been cleared",
          "Administer IV NAC immediately and contact the liver transplant center",
          "Administer fresh frozen plasma to correct INR before further evaluation",
          "Start lactulose 30 mL q2h and recheck labs in 12 hours"
        ],
        correct: 1,
        rationale: "This patient has fulminant acetaminophen-induced ALF (coagulopathy + encephalopathy + massive transaminase elevation). Even though the acetaminophen level is undetectable (expected in staggered overdose — the drug has been metabolized but damage is ongoing), NAC should be started IMMEDIATELY. NAC remains beneficial even late in acetaminophen ALF. The arterial pH < 7.30 meets King's College Criteria for liver transplant listing. FFP should not be given prophylactically as INR is a critical prognostic marker. Lactulose alone is inadequate for this severity."
      },
      {
        question: "A nurse practitioner is managing a patient with grade III hepatic encephalopathy from acute liver failure. The patient's serum sodium is 138 mEq/L and ICP monitoring shows elevated intracranial pressure. Which intervention is most appropriate for ICP management?",
        options: [
          "Administer normal saline (0.9% NaCl) bolus to increase cerebral perfusion pressure",
          "Begin 3% hypertonic saline infusion to target serum sodium 145–155 mEq/L",
          "Administer dexamethasone 10 mg IV to reduce cerebral edema",
          "Perform emergent lumbar puncture to measure opening pressure and drain CSF"
        ],
        correct: 1,
        rationale: "Hypertonic saline (3% NaCl) targeting serum sodium 145–155 mEq/L is the preferred osmotic therapy for cerebral edema in ALF. Unlike mannitol, it provides sustained ICP reduction and avoids rebound intracranial hypertension. Corticosteroids (dexamethasone) are NOT effective for cytotoxic cerebral edema in ALF (they work for vasogenic edema from tumors/abscesses). Lumbar puncture is CONTRAINDICATED with elevated ICP due to herniation risk. Normal saline is isotonic and will not create the osmotic gradient needed to reduce cerebral edema."
      },
      {
        question: "A 22-year-old male presents with acute liver failure, Coombs-negative hemolytic anemia, low ceruloplasmin, and an AST:ALT ratio of 3.1. The alkaline phosphatase:total bilirubin ratio is 2.8. Which diagnosis should the NP suspect, and what is the expected outcome without definitive treatment?",
        options: [
          "Autoimmune hepatitis — likely to respond to high-dose corticosteroids",
          "Wilson disease — near 100% mortality without liver transplantation",
          "Hepatitis B reactivation — antiviral therapy with entecavir will reverse the failure",
          "Drug-induced liver injury — discontinuation of the offending agent will lead to recovery"
        ],
        correct: 1,
        rationale: "This presentation is classic for Wilson disease-related ALF: young patient, Coombs-negative hemolytic anemia (copper-mediated oxidative hemolysis), low ceruloplasmin, AST:ALT ratio > 2.2, and alkaline phosphatase:bilirubin ratio < 4. These ratios are highly specific for Wilson disease in the ALF setting. Wilson disease presenting as ALF has near 100% mortality without liver transplantation — medical therapy (chelation with D-penicillamine or trientine) cannot work fast enough to reverse fulminant hepatic failure. Emergent transplant listing is required."
      },
      {
        question: "The NP is caring for a patient receiving IV NAC for acetaminophen overdose. Twenty minutes into the loading dose (150 mg/kg over 1 hour), the patient develops facial flushing, urticaria, and mild wheezing. What is the appropriate action?",
        options: [
          "Stop NAC immediately and permanently — the patient has a true allergy and cannot receive further doses",
          "Stop NAC, administer epinephrine 0.3 mg IM, and transfer to the ICU for anaphylaxis management",
          "Temporarily pause NAC, administer diphenhydramine 50 mg IV, then resume NAC at a slower infusion rate",
          "Continue NAC at the same rate and administer albuterol nebulizer for the bronchospasm"
        ],
        correct: 2,
        rationale: "NAC-induced anaphylactoid reactions are dose-rate dependent (not true IgE-mediated allergy) and most commonly occur during the loading dose when plasma NAC concentrations are highest. Management: temporarily pause infusion, administer diphenhydramine 50 mg IV (± albuterol for bronchospasm), then resume NAC at a slower infusion rate. NAC should NOT be permanently discontinued in ALF — the benefit far outweighs the risk of anaphylactoid reaction. True anaphylaxis (hypotension, cardiovascular collapse) from NAC is exceedingly rare."
      },
      {
        question: "A patient with non-acetaminophen acute liver failure has an INR of 5.8, grade II encephalopathy, and no active bleeding. The surgical resident requests FFP to correct the INR before placing a central line. The NP should:",
        options: [
          "Administer FFP 15 mL/kg to correct INR to < 1.5 for procedural safety",
          "Administer vitamin K 10 mg IV instead, which will correct the coagulopathy within 2 hours",
          "Advise against routine FFP correction but allow targeted correction (FFP or factor VIIa) immediately before the procedure only",
          "Decline the request entirely — no correction is ever appropriate in ALF regardless of planned procedures"
        ],
        correct: 2,
        rationale: "In ALF, the INR is the single most important prognostic marker for disease trajectory and transplant listing. Routine prophylactic correction with FFP obscures disease progression and delays transplant decisions. However, targeted correction immediately before invasive procedures (central line, ICP monitor placement) IS appropriate. The NP should advise: (1) do not routinely correct INR, but (2) administer FFP or recombinant factor VIIa as a one-time dose immediately before the procedure. Vitamin K can be given as a single 10 mg IV dose (in case of concurrent vitamin K deficiency) but will not adequately correct coagulopathy from hepatocyte necrosis."
      },
      {
        question: "Which laboratory finding most strongly predicts the need for liver transplantation in a patient with acetaminophen-induced acute liver failure after adequate fluid resuscitation?",
        options: [
          "AST > 10,000 IU/L indicating massive hepatocyte necrosis",
          "Arterial lactate > 3.5 mmol/L after fluid resuscitation",
          "Ammonia level > 200 mcg/dL with grade II encephalopathy",
          "Platelet count < 50,000/mcL with evidence of DIC"
        ],
        correct: 1,
        rationale: "Arterial lactate > 3.5 mmol/L after adequate fluid resuscitation is the strongest single predictor of death without transplant in acetaminophen-induced ALF, with > 90% sensitivity and > 80% specificity. Lactate elevation reflects both impaired hepatic lactate clearance AND tissue hypoperfusion from hemodynamic compromise. This has been incorporated into modified King's College Criteria. While extremely elevated AST indicates massive necrosis, AST levels alone do not predict outcome (paradoxically, falling AST with worsening INR suggests loss of viable hepatocytes rather than recovery). Ammonia levels correlate with encephalopathy grade but are less specific for transplant prediction."
      },
      {
        question: "A 35-year-old woman at 36 weeks gestation presents with nausea, vomiting, right upper quadrant pain, and confusion. Labs show: ALT 450, AST 520, INR 2.8, glucose 48, platelets 95,000, fibrinogen 90. The most likely diagnosis and immediate priority is:",
        options: [
          "HELLP syndrome — administer magnesium sulfate and plan delivery within 48 hours",
          "Acute fatty liver of pregnancy (AFLP) — emergent delivery is the definitive treatment",
          "Intrahepatic cholestasis of pregnancy — start ursodiol and monitor bile acids",
          "Viral hepatitis — obtain hepatitis panel and start supportive care"
        ],
        correct: 1,
        rationale: "This presentation is classic AFLP: third trimester, liver failure (elevated transaminases, coagulopathy), hypoglycemia (impaired hepatic gluconeogenesis from microvesicular steatosis), low platelets, and low fibrinogen (suggesting DIC). AFLP is caused by defective mitochondrial fatty acid oxidation (often associated with LCHAD deficiency in the fetus). The definitive treatment is EMERGENT DELIVERY — continuing the pregnancy allows progressive liver failure. HELLP syndrome has similar features but typically presents with higher LDH, hemolysis (elevated bilirubin, schistocytes), and severe hypertension. Cholestasis of pregnancy causes pruritus with elevated bile acids but not liver failure."
      },
      {
        question: "During the management of acute liver failure, the NP notes the patient's blood glucose is 42 mg/dL on routine monitoring. The patient is receiving maintenance IV fluids. What is the most appropriate intervention?",
        options: [
          "Administer D50 50 mL IV push and switch maintenance fluids to D10 at 75 mL/hr",
          "Administer glucagon 1 mg IM and recheck glucose in 15 minutes",
          "Increase the rate of normal saline to 200 mL/hr to improve hepatic perfusion",
          "Hold lactulose as it may be contributing to malabsorption of glucose"
        ],
        correct: 0,
        rationale: "Hypoglycemia in ALF results from impaired hepatic gluconeogenesis and depleted glycogen stores — the liver is the primary organ for maintaining blood glucose homeostasis. D50 bolus (25 g dextrose) provides immediate correction, followed by D10 continuous infusion for sustained glucose maintenance. Glucagon is ineffective in ALF because it works by stimulating hepatic glycogenolysis and gluconeogenesis — both pathways are severely impaired when hepatocytes are necrotic. Normal saline does not address the metabolic cause. Glucose monitoring should be increased to q1h in ALF patients."
      },
      {
        question: "A 45-year-old man with no prior liver disease presents with jaundice, confusion, and INR 3.2. He takes no regular medications and denies alcohol use. ANA is 1:640 and IgG is 2,800 mg/dL (normal < 1,600). What is the recommended treatment approach?",
        options: [
          "Start prednisone 40 mg daily — autoimmune hepatitis may respond to immunosuppression even in ALF",
          "Proceed directly to liver transplant listing without trial of medical therapy",
          "Start azathioprine 50 mg daily as steroid-sparing agent for autoimmune hepatitis",
          "Obtain liver biopsy via transjugular approach before initiating any treatment"
        ],
        correct: 0,
        rationale: "Autoimmune hepatitis (AIH) is one of the few causes of ALF where medical therapy may avert the need for transplant. High-titer ANA and markedly elevated IgG are characteristic. A trial of corticosteroids (prednisone 40–60 mg/day or methylprednisolone 60 mg IV daily) should be initiated while simultaneously pursuing transplant evaluation. Response is assessed within 7 days — if INR and bilirubin improve, continue steroids; if no response, proceed with transplant listing. Azathioprine is contraindicated in ALF (hepatotoxic, myelosuppressive, slow onset). Transjugular biopsy may be considered but should not delay empiric treatment if AIH is strongly suspected."
      },
      {
        question: "The NP is evaluating King's College Criteria in a patient with non-acetaminophen ALF. Which combination of findings meets the criteria for liver transplant listing?",
        options: [
          "INR > 6.5 alone, regardless of other parameters",
          "INR 4.5 + bilirubin 12 mg/dL + age 55 + duration 10 days before encephalopathy",
          "INR 4.0 + bilirubin 20 mg/dL + age 35 + favorable etiology (acetaminophen)",
          "INR 3.0 + bilirubin 8 mg/dL + age 25 + duration 3 days before encephalopathy"
        ],
        correct: 0,
        rationale: "King's College Criteria for non-acetaminophen ALF: INR > 6.5 ALONE meets criteria for transplant listing, OR any 3 of the following 5: (1) age < 10 or > 40, (2) unfavorable etiology (seronegative hepatitis, drug reaction, Wilson disease), (3) duration of jaundice > 7 days before encephalopathy onset, (4) INR > 3.5, (5) bilirubin > 17.5 mg/dL. Option A (INR > 6.5 alone) meets the criteria. Option B has INR 4.5 (> 3.5 ✓), age 55 (> 40 ✓), duration 10 days (> 7 ✓) — this would also meet criteria (3 of 5), but bilirubin 12 is < 17.5. The question asks which combination meets criteria, and INR > 6.5 alone is the clearest single criterion."
      }
    ],
    preTest: [
      {
        question: "What is the most common cause of acute liver failure in the United States and Canada?",
        options: [
          "Hepatitis B virus infection",
          "Acetaminophen overdose",
          "Autoimmune hepatitis",
          "Ischemic hepatitis"
        ],
        correct: 1,
        rationale: "Acetaminophen overdose is the most common cause of ALF in the US and Canada, accounting for approximately 46% of all cases. This includes both intentional overdose and unintentional therapeutic misadventure (patients unknowingly taking multiple acetaminophen-containing products). Hepatitis B is the most common cause worldwide but not in North America."
      },
      {
        question: "Which hepatic encephalopathy grade is characterized by somnolence, confusion, and gross disorientation to time and place?",
        options: [
          "Grade I",
          "Grade II",
          "Grade III",
          "Grade IV"
        ],
        correct: 2,
        rationale: "West Haven Grade III encephalopathy is characterized by somnolence to semi-stupor, responsiveness to stimuli, confusion, and gross disorientation. Grade I = trivial lack of awareness, shortened attention span. Grade II = lethargy, minimal disorientation, inappropriate behavior. Grade IV = coma, no response to verbal or noxious stimuli."
      },
      {
        question: "The primary mechanism of cerebral edema in acute liver failure is:",
        options: [
          "Vasogenic edema from blood-brain barrier disruption",
          "Cytotoxic edema from astrocyte swelling due to intracellular glutamine accumulation",
          "Hydrocephalic edema from impaired CSF absorption",
          "Interstitial edema from increased CSF production"
        ],
        correct: 1,
        rationale: "Cerebral edema in ALF is primarily cytotoxic, caused by ammonia crossing the blood-brain barrier and being converted to glutamine by astrocyte glutamine synthetase. The intracellular glutamine accumulation creates an osmotic gradient that draws water into astrocytes, causing them to swell. This is why corticosteroids (which treat vasogenic edema) are ineffective in ALF-related cerebral edema, while osmotic agents (hypertonic saline, mannitol) are the treatment of choice."
      }
    ],
    postTest: [
      {
        question: "A patient with acetaminophen-induced ALF has the following labs: arterial pH 7.25, INR 7.2, creatinine 3.8 mg/dL, and grade III encephalopathy. According to King's College Criteria, what is the recommendation?",
        options: [
          "Continue NAC and reassess in 24 hours before making transplant decisions",
          "The patient meets King's College Criteria and should be listed for liver transplantation",
          "Correct the acidosis with sodium bicarbonate and reassess pH before listing",
          "The INR should be corrected with FFP before applying King's College Criteria"
        ],
        correct: 1,
        rationale: "This patient meets King's College Criteria for acetaminophen ALF by BOTH pathways: (1) arterial pH < 7.30 after fluid resuscitation (this alone is sufficient), and (2) all three of INR > 6.5, creatinine > 3.4 mg/dL, and grade III–IV encephalopathy. The patient should be listed for liver transplantation immediately while continuing NAC and supportive care. Correcting pH with bicarbonate or INR with FFP would mask the prognostic indicators."
      },
      {
        question: "Which statement about NAC use in non-acetaminophen acute liver failure is correct?",
        options: [
          "NAC is contraindicated in non-acetaminophen ALF as it has no proven benefit",
          "NAC improves transplant-free survival in patients with grade I–II encephalopathy from non-acetaminophen ALF",
          "NAC should only be used if the etiology of ALF cannot be determined",
          "NAC worsens outcomes in autoimmune hepatitis-related ALF due to immunosuppressive effects"
        ],
        correct: 1,
        rationale: "A landmark RCT published in Gastroenterology (Lee et al.) demonstrated that IV NAC improved transplant-free survival from 30% to 52% in non-acetaminophen ALF patients with grade I–II encephalopathy. The benefit was not seen in grade III–IV encephalopathy. NAC's mechanism in non-acetaminophen ALF is likely through antioxidant effects, improved hepatic microcirculation, and free radical scavenging. This is now an AASLD recommendation."
      },
      {
        question: "During ALF management, the NP notices the patient's AST has dropped from 8,000 to 800 IU/L over 24 hours, but the INR has risen from 3.5 to 6.8 and the patient has progressed from grade II to grade III encephalopathy. This pattern suggests:",
        options: [
          "Liver recovery — the falling AST indicates the hepatic injury is resolving",
          "Laboratory error — AST and INR should trend in the same direction",
          "Massive hepatocyte loss — there are insufficient viable hepatocytes to release transaminases, indicating a catastrophic decline",
          "NAC toxicity — the medication is causing paradoxical liver damage"
        ],
        correct: 2,
        rationale: "The 'ominous drop' in transaminases with worsening coagulopathy and encephalopathy is one of the most important prognostic signs in ALF. Falling AST/ALT with rising INR indicates that so many hepatocytes have died that there are not enough viable cells left to release enzymes. This pattern predicts a very poor prognosis and usually indicates the need for emergent liver transplantation. True recovery would show falling transaminases WITH improving INR and clearing encephalopathy."
      }
    ]
  },

  "community-acquired-pneumonia-np": {
    title: "Community-Acquired Pneumonia: NP Evidence-Based Diagnosis & Prescribing",
    cellular: {
      title: "Community-Acquired Pneumonia Pathophysiology",
      content: "Community-acquired pneumonia (CAP) is an acute infection of the lung parenchyma acquired outside of hospital or long-term care settings. The pathophysiology involves microbial invasion of the normally sterile lower respiratory tract after failure of host defense mechanisms. Primary defenses include the epiglottic reflex, mucociliary clearance (ciliated pseudostratified columnar epithelium), secretory IgA in airway secretions, and alveolar macrophages. When these defenses are overwhelmed (viral URI damaging ciliated epithelium, aspiration, immunosuppression), pathogens reach the alveoli and trigger an inflammatory cascade. Alveolar macrophages recognize pathogen-associated molecular patterns (PAMPs) via toll-like receptors (TLRs), releasing pro-inflammatory cytokines (TNF-α, IL-1β, IL-6, IL-8) that recruit neutrophils from the pulmonary vasculature. Neutrophil migration into alveolar spaces, along with fibrin exudation and edema fluid, fills alveoli and creates consolidation — the hallmark radiographic finding. This alveolar filling impairs gas exchange by creating ventilation-perfusion (V/Q) mismatch and intrapulmonary shunting, producing hypoxemia. Streptococcus pneumoniae, the most common typical CAP pathogen, uses pneumolysin (a pore-forming cytolysin that destroys respiratory epithelium and inhibits neutrophil function), autolysin (releases cell wall components that activate complement and inflammation), and polysaccharide capsule (resists phagocytosis). Atypical pathogens (Mycoplasma pneumoniae, Chlamydophila pneumoniae, Legionella pneumophila) cause interstitial rather than alveolar inflammation, producing a different radiographic and clinical pattern. Legionella species replicate within alveolar macrophages by inhibiting phagosome-lysosome fusion, causing a more severe pneumonia often with extrapulmonary manifestations (hyponatremia, diarrhea, elevated transaminases, rhabdomyolysis). Risk stratification uses validated tools: CURB-65 (Confusion, Urea > 7 mmol/L, Respiratory rate ≥ 30, Blood pressure systolic < 90 or diastolic ≤ 60, age ≥ 65) and the Pneumonia Severity Index (PSI/PORT score) to determine outpatient vs inpatient vs ICU-level care."
    },
    riskFactors: [
      "Age ≥ 65 years: declining mucociliary clearance, reduced cough reflex, impaired T-cell function, comorbidity burden",
      "Chronic lung disease: COPD (impaired mucociliary clearance, chronic airway inflammation, frequent corticosteroid use), asthma, bronchiectasis",
      "Smoking: damages ciliated epithelium, impairs alveolar macrophage function, increases mucus production creating stasis",
      "Immunosuppression: HIV/AIDS (PJP, encapsulated organisms), chemotherapy, chronic corticosteroid use (> 10 mg prednisone/day), organ transplant recipients, biological agents (anti-TNF therapy)",
      "Aspiration risk: alcoholism (depressed cough reflex, impaired consciousness), stroke/dysphagia, GERD, tube feeding, sedative/opioid use, poor dental hygiene (polymicrobial oral flora)",
      "Recent viral upper respiratory infection: influenza damages respiratory epithelium creating portal of entry for secondary bacterial pneumonia (S. pneumoniae, S. aureus post-influenza)",
      "Chronic diseases: diabetes mellitus (impaired neutrophil function), heart failure (pulmonary congestion impairs defense), chronic kidney disease, liver cirrhosis (complement deficiency, impaired opsonization)",
      "Institutional living, recent hospitalization within 90 days (exposure to resistant organisms), travel to endemic areas (Coccidioides in Southwest US, Histoplasma in Ohio/Mississippi River valleys)"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral): cornerstone of diagnosis — lobar consolidation (typical pathogens: S. pneumoniae), diffuse bilateral interstitial infiltrates (atypical pathogens: Mycoplasma, PJP), cavitation (S. aureus, Klebsiella, TB, anaerobes), pleural effusion (parapneumonic); radiographic improvement lags behind clinical improvement by 4–8 weeks",
      "Severity assessment — CURB-65: 0–1 = outpatient, 2 = consider hospital, 3–5 = ICU consideration. PSI/PORT score: Class I–II = outpatient, Class III = observation, Class IV–V = inpatient. ATS/IDSA ICU criteria (major): septic shock requiring vasopressors OR mechanical ventilation; (minor): RR ≥ 30, PaO2/FiO2 ≤ 250, multilobar infiltrates, confusion, BUN ≥ 20, WBC < 4,000, platelet < 100,000, hypothermia, hypotension requiring aggressive fluids — 1 major or ≥ 3 minor = ICU",
      "Laboratory: CBC with differential (leukocytosis with left shift — bandemia suggests bacterial; lymphopenia in viral or atypical), BMP (BUN for severity scoring, hyponatremia suggests Legionella or SIADH), procalcitonin (≥ 0.25 ng/mL supports bacterial etiology — useful for antibiotic stewardship; < 0.1 suggests viral), CRP (nonspecific but useful for trending response), lactate (if sepsis suspected)",
      "Sputum culture and Gram stain (inpatient only — collect BEFORE antibiotics if possible): gram-positive diplococci (S. pneumoniae), gram-negative rods (Klebsiella, H. influenzae), quality criteria: > 25 PMNs and < 10 squamous epithelial cells per low-power field",
      "Blood cultures × 2 sets (ICU patients, severe CAP, immunocompromised): positive in only 5–14% of CAP but identifies bacteremia and guides de-escalation; ALWAYS obtain before antibiotics in admitted patients",
      "Legionella urine antigen (detects serogroup 1 only — accounts for 80% of Legionella infections; sensitivity 70–80%): obtain in severe CAP, ICU admission, travel history, hyponatremia, diarrhea, or failure to respond to beta-lactam monotherapy",
      "Pneumococcal urine antigen: sensitivity 50–80%, specificity > 90%; remains positive for weeks after infection; useful when sputum culture is negative or patient already on antibiotics",
      "CT chest: reserved for diagnostic uncertainty, suspected complications (empyema, abscess, necrotizing pneumonia), immunocompromised patients, or atypical presentations"
    ],
    management: [
      "OUTPATIENT (previously healthy, no comorbidities, no antibiotic use in past 90 days): amoxicillin 1 g PO TID × 5 days (ATS/IDSA 2019 preferred) OR doxycycline 100 mg PO BID × 5 days OR azithromycin 500 mg day 1 then 250 mg days 2–5 (ONLY if local pneumococcal macrolide resistance < 25%)",
      "OUTPATIENT (comorbidities: COPD, diabetes, CKD, heart failure, alcoholism, malignancy, asplenia, OR antibiotic use in past 90 days): amoxicillin-clavulanate 2 g/125 mg PO BID (or cefpodoxime 200 mg PO BID) PLUS azithromycin 500 mg day 1 then 250 mg days 2–5 (or doxycycline 100 mg BID) — i.e., beta-lactam + macrolide/doxycycline; OR respiratory fluoroquinolone monotherapy (levofloxacin 750 mg daily OR moxifloxacin 400 mg daily) × 5 days",
      "INPATIENT (non-ICU): IV beta-lactam (ceftriaxone 1–2 g IV daily OR ampicillin-sulbactam 3 g IV q6h) PLUS macrolide (azithromycin 500 mg IV/PO daily) — dual therapy provides atypical coverage; OR respiratory fluoroquinolone monotherapy (levofloxacin 750 mg IV daily); switch to PO when clinically improving (afebrile ≥ 48h, improving WBC, able to take PO, hemodynamically stable)",
      "INPATIENT (ICU, severe CAP): IV beta-lactam (ceftriaxone 2 g IV daily OR ampicillin-sulbactam 3 g IV q6h) PLUS macrolide (azithromycin 500 mg IV daily) — preferred over fluoroquinolone in ICU setting due to better outcomes data; add vancomycin 15–20 mg/kg IV q8–12h if MRSA risk factors (prior MRSA, cavitary infiltrate, post-influenza, empyema)",
      "PSEUDOMONAS risk factors (structural lung disease, frequent antibiotics, recent hospitalization): piperacillin-tazobactam 4.5 g IV q6h OR cefepime 2 g IV q8h OR meropenem 1 g IV q8h, PLUS anti-pseudomonal fluoroquinolone (ciprofloxacin 400 mg IV q8h) or aminoglycoside",
      "ASPIRATION pneumonia: amoxicillin-clavulanate (outpatient) or ampicillin-sulbactam (inpatient) — provides anaerobic coverage; clindamycin alternative if penicillin allergy; metronidazole alone has poor lung penetration and should not be used as sole anaerobic agent for aspiration pneumonia",
      "Duration: 5 days minimum for most CAP (ATS/IDSA 2019 — shortened from previous 7–10 day recommendations); extend if Pseudomonas, MRSA, lung abscess, empyema, or clinical instability at day 5; procalcitonin-guided discontinuation reduces antibiotic exposure",
      "Adjunctive: corticosteroids (dexamethasone 6 mg IV daily × 4 days) in severe CAP reduces mortality and need for mechanical ventilation (CAPE COD trial); influenza-associated CAP: oseltamivir 75 mg BID × 5 days (start even if > 48 hours in hospitalized patients)"
    ],
    nursingActions: [
      "Obtain sputum culture and blood cultures BEFORE first antibiotic dose in hospitalized patients — timing of cultures relative to antibiotics significantly affects yield; document time of first antibiotic dose",
      "Assess oxygenation: SpO2 target ≥ 94% (or ≥ 88–92% in COPD patients at risk for hypercapnic respiratory failure); apply supplemental O2 via nasal cannula, venturi mask, or high-flow nasal cannula as needed; monitor for respiratory fatigue (accessory muscle use, paradoxical breathing, rising PaCO2)",
      "Severity scoring documentation: calculate and document CURB-65 or PSI score at admission to justify level of care; reassess at 48–72 hours to determine clinical stability for IV-to-PO switch and discharge planning",
      "Monitor clinical stability criteria for IV-to-PO antibiotic switch: temperature < 37.8°C for ≥ 48 hours, heart rate < 100, respiratory rate < 24, SpO2 ≥ 90% on room air, ability to take oral medications, normal mentation",
      "Aspiration precautions: elevate HOB ≥ 30°, assess swallowing function before oral intake in elderly or post-stroke patients, oral hygiene with chlorhexidine if mechanically ventilated",
      "Monitor for treatment failure: if no clinical improvement by 72 hours, reassess — consider resistant pathogen, empyema/parapneumonic effusion, incorrect diagnosis (PE, lung cancer, vasculitis), complications (abscess formation); obtain repeat imaging and blood work",
      "Pneumococcal and influenza vaccination status assessment: administer PPSV23 and/or PCV20 to eligible patients before discharge; administer influenza vaccine during flu season; document vaccine administration or patient refusal",
      "Discharge education: complete full antibiotic course even if feeling better; return precautions (worsening dyspnea, fever recurrence, hemoptysis); follow-up chest X-ray at 6–8 weeks to document radiographic resolution and exclude underlying malignancy (especially in smokers > 50 years)"
    ],
    signs: {
      left: [
        "Outpatient-appropriate CAP (CURB-65 0–1): productive cough, low-grade fever, focal crackles on auscultation, SpO2 ≥ 94% on room air, able to tolerate oral medications — treat as outpatient with follow-up in 48–72 hours",
        "Clinical stability for discharge: afebrile ≥ 48h, HR < 100, RR < 24, SpO2 ≥ 90% on RA, taking PO, normal mentation — transition to oral antibiotics and plan discharge",
        "Atypical pneumonia (Mycoplasma): younger patient with gradual onset, dry/hacking cough, mild hypoxia, bilateral interstitial infiltrates, extrapulmonary features (bullous myringitis, erythema multiforme, cold agglutinins)",
        "Responding to treatment: defervescence, improving WBC, declining CRP/procalcitonin, improving oxygenation, clearing infiltrates"
      ],
      right: [
        "Severe CAP meeting ICU criteria: septic shock requiring vasopressors OR requiring mechanical ventilation — START empiric IV beta-lactam + macrolide + consider MRSA coverage immediately",
        "Parapneumonic effusion/empyema: persistent fever despite appropriate antibiotics, new pleural effusion on imaging — requires thoracentesis (pH < 7.2, glucose < 60, LDH > 1000, positive Gram stain = complicated effusion requiring chest tube drainage)",
        "Necrotizing pneumonia/lung abscess: cavitation on imaging, foul-smelling sputum, failure to improve on standard therapy — consider anaerobic coverage, prolonged antibiotic course (4–6 weeks), pulmonology/surgery consultation",
        "Post-obstructive pneumonia: failure to resolve radiographically at 6–8 weeks, especially in smokers > 50 years — CT chest and bronchoscopy to exclude endobronchial malignancy"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (High-Dose for CAP)",
        type: "Aminopenicillin (Beta-Lactam Antibiotic)",
        action: "Binds penicillin-binding proteins (PBPs) in bacterial cell wall, inhibiting transpeptidation and cross-linking of peptidoglycan, leading to cell wall weakening and osmotic lysis. High-dose (1 g TID) overcomes intermediate pneumococcal resistance by achieving higher peak concentrations above the MIC.",
        sideEffects: "Diarrhea (disruption of normal gut flora), nausea, rash (maculopapular — distinguish from true penicillin allergy), C. difficile infection (rare), hypersensitivity reactions",
        contra: "True penicillin allergy (anaphylaxis, angioedema, urticaria — cross-reactivity with cephalosporins is < 2% with advanced-generation cephalosporins); infectious mononucleosis (ampicillin rash — not a true allergy)",
        pearl: "ATS/IDSA 2019 now recommends amoxicillin 1 g PO TID as FIRST-LINE for outpatient CAP in healthy adults without comorbidities — this is a change from prior guidelines that favored macrolides. The high dose (1 g TID vs standard 500 mg TID) is necessary because pneumococcal penicillin resistance breakpoints for non-meningeal infections are higher (MIC ≤ 2 mcg/mL = susceptible), and high-dose amoxicillin achieves the required tissue concentrations. Duration: 5 days minimum (not 7–10 days as previously recommended)."
      },
      {
        name: "Ceftriaxone",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBP-3, disrupting cell wall synthesis. Broad gram-negative coverage plus excellent gram-positive activity against S. pneumoniae (including penicillin-intermediate strains). Good CNS penetration. Long half-life (6–9 hours) allows once-daily dosing.",
        sideEffects: "Biliary sludging/pseudolithiasis (ceftriaxone-calcium precipitates — avoid co-infusion with calcium-containing solutions in neonates), diarrhea, C. difficile colitis, hypersensitivity, injection site reactions",
        contra: "Severe cephalosporin allergy, neonates requiring calcium-containing IV solutions, hyperbilirubinemic neonates (displaces bilirubin from albumin). Cross-reactivity with penicillin allergy: < 2% with third-generation cephalosporins — can generally be used with penicillin allergy UNLESS anaphylaxis to a cephalosporin with a similar R1 side chain (e.g., ceftriaxone and cefotaxime share an R1 side chain with no penicillins).",
        pearl: "1–2 g IV daily for inpatient CAP (paired with azithromycin for atypical coverage). Ceftriaxone + azithromycin is the preferred combination for non-ICU inpatient CAP. The macrolide provides atypical coverage AND has immunomodulatory properties (reduces TNF-α, IL-6, and neutrophil migration independent of antimicrobial activity — this may contribute to improved outcomes in severe CAP). For penicillin-allergic patients (non-anaphylactic), ceftriaxone is safe. For severe penicillin allergy, use respiratory fluoroquinolone instead."
      },
      {
        name: "Azithromycin",
        type: "Macrolide Antibiotic",
        action: "Binds the 50S ribosomal subunit (23S rRNA), blocking translocation of peptidyl-tRNA and inhibiting bacterial protein synthesis. Bacteriostatic at standard doses. Extensive tissue distribution with intracellular accumulation (concentrated in macrophages and neutrophils — delivered directly to infection sites). Covers atypical pathogens (Mycoplasma, Chlamydophila, Legionella) that lack cell walls and are resistant to beta-lactams.",
        sideEffects: "GI disturbances (nausea, diarrhea, abdominal pain — motilin receptor agonism), QT prolongation (risk of torsades de pointes — avoid with other QT-prolonging drugs), hepatotoxicity (rare cholestatic pattern), hearing loss (high doses/prolonged use)",
        contra: "History of cholestatic jaundice/hepatic dysfunction with prior azithromycin use, known QT prolongation or concurrent use of QT-prolonging medications (amiodarone, sotalol, fluoroquinolones), myasthenia gravis (may worsen neuromuscular transmission)",
        pearl: "500 mg PO/IV day 1 then 250 mg PO days 2–5. For outpatient CAP monotherapy, azithromycin should ONLY be used if local pneumococcal macrolide resistance is < 25% (in many US regions, resistance exceeds 30%, making azithromycin monotherapy unreliable). The immunomodulatory effects of macrolides (independent of antimicrobial activity) improve outcomes in severe CAP — they reduce pro-inflammatory cytokines and neutrophil chemotaxis, which may explain why beta-lactam + macrolide outperforms beta-lactam + fluoroquinolone in severe CAP despite equivalent antimicrobial spectra."
      },
      {
        name: "Levofloxacin (Respiratory Fluoroquinolone)",
        type: "Fluoroquinolone Antibiotic",
        action: "Inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, preventing DNA supercoiling, replication, transcription, and repair. Broad-spectrum bactericidal activity against both typical and atypical CAP pathogens. Excellent lung tissue penetration with concentrations exceeding serum levels.",
        sideEffects: "FDA Black Box Warnings: tendon rupture (Achilles tendon — risk increased with corticosteroids, age > 60, renal impairment, organ transplant), peripheral neuropathy (may be irreversible), CNS effects (seizures, dizziness, confusion — lower seizure threshold), aortic dissection/aneurysm (avoid if known aortic disease or risk factors), QT prolongation, C. difficile colitis, photosensitivity, hypoglycemia/hyperglycemia",
        contra: "Known fluoroquinolone hypersensitivity, history of tendon disorder with fluoroquinolone use, myasthenia gravis (FDA contraindication — may cause fatal respiratory failure from neuromuscular blockade), concurrent class IA/III antiarrhythmics, known aortic aneurysm/dissection",
        pearl: "750 mg PO/IV daily × 5 days (high-dose short-course is non-inferior to 500 mg × 10 days). Respiratory fluoroquinolones (levofloxacin 750 mg, moxifloxacin 400 mg) cover BOTH typical and atypical pathogens as monotherapy — making them convenient but should be reserved for patients with comorbidities or beta-lactam allergy due to serious adverse effect profile. ATS/IDSA recommends reserving fluoroquinolones for patients who cannot take beta-lactams. Important drug interactions: chelation with divalent/trivalent cations (calcium, iron, magnesium, aluminum antacids — separate by 2 hours), warfarin (enhanced INR), theophylline (increased levels)."
      }
    ],
    pearls: [
      "The ATS/IDSA 2019 CAP guidelines made three major changes that NPs must know: (1) amoxicillin 1 g TID replaced macrolides as first-line for healthy outpatients, (2) the minimum antibiotic duration is now 5 days (not 7–10), and (3) procalcitonin should NOT be used to withhold antibiotics in patients with clinical and radiographic evidence of CAP — it should be used for de-escalation and discontinuation decisions.",
      "Every patient hospitalized with CAP should be assessed for influenza during flu season with rapid molecular testing (NAAT/PCR) — post-influenza S. aureus pneumonia has high mortality, and oseltamivir should be started even if > 48 hours from symptom onset in hospitalized patients.",
      "Follow-up chest X-ray at 6–8 weeks is essential for smokers > 50 years or patients with an unusual presentation — up to 2% of CAP cases may have an underlying lung malignancy that becomes apparent after the pneumonia resolves.",
      "Macrolide + beta-lactam combination outperforms fluoroquinolone monotherapy in severe CAP due to the immunomodulatory properties of macrolides — they reduce the cytokine storm independently of their antimicrobial activity. This is why azithromycin is preferred over levofloxacin as the companion agent to ceftriaxone in ICU patients.",
      "Hyponatremia in a patient with CAP should raise suspicion for Legionella pneumonia — check Legionella urine antigen. Additional Legionella clues: diarrhea, relative bradycardia, elevated transaminases, rhabdomyolysis (elevated CK), confusion out of proportion to pneumonia severity, and failure to respond to beta-lactam monotherapy."
    ],
    quiz: [
      {
        question: "A 72-year-old man with COPD and diabetes presents with productive cough, fever 39.2°C, and right lower lobe consolidation on chest X-ray. CURB-65 score is 2. He took amoxicillin for sinusitis 6 weeks ago. The most appropriate antibiotic regimen is:",
        options: [
          "Amoxicillin 1 g PO TID × 5 days as outpatient",
          "Azithromycin 500 mg then 250 mg daily × 4 days as outpatient",
          "Amoxicillin-clavulanate 2 g PO BID PLUS azithromycin 500 mg then 250 mg daily, OR levofloxacin 750 mg PO daily",
          "Ceftriaxone 2 g IV daily plus vancomycin 15 mg/kg IV q12h"
        ],
        correct: 2,
        rationale: "This patient has comorbidities (COPD, diabetes) AND recent antibiotic use within 90 days — both factors that increase risk for resistant organisms. ATS/IDSA guidelines recommend: beta-lactam (amoxicillin-clavulanate or cefpodoxime) PLUS macrolide (azithromycin or doxycycline), OR respiratory fluoroquinolone monotherapy. CURB-65 of 2 warrants consideration for hospital admission or close outpatient follow-up. Amoxicillin monotherapy is only for healthy adults without comorbidities or recent antibiotic use. Vancomycin is for MRSA risk, not standard CAP."
      },
      {
        question: "A hospitalized patient with CAP has been afebrile for 48 hours, HR 88, RR 18, SpO2 95% on room air, WBC trending down, and can tolerate oral medications. The NP's priority is to:",
        options: [
          "Continue IV antibiotics for a total of 7 days before considering oral transition",
          "Switch to oral antibiotics and begin discharge planning with follow-up in 48–72 hours",
          "Obtain repeat blood cultures before changing any antibiotics",
          "Order a CT chest to confirm resolution before discharge"
        ],
        correct: 1,
        rationale: "This patient meets clinical stability criteria for IV-to-PO antibiotic switch: afebrile ≥ 48h, HR < 100, RR < 24, SpO2 ≥ 90% on room air, tolerating PO, normal mentation. The 2019 ATS/IDSA guidelines recommend a minimum 5-day course with transition to oral therapy as soon as stability criteria are met. Prolonged IV therapy without clinical indication increases hospital-acquired infection risk, costs, and length of stay. Repeat blood cultures are not necessary if improving. CT chest is reserved for diagnostic uncertainty or complications."
      },
      {
        question: "A 55-year-old man presents with high fever, confusion, diarrhea, serum sodium 128 mEq/L, and bilateral patchy infiltrates on CXR. He recently returned from a hotel conference. What diagnostic test should the NP prioritize?",
        options: [
          "Mycoplasma IgM antibody titer",
          "Legionella urinary antigen",
          "Induced sputum for acid-fast bacilli",
          "Pneumococcal urinary antigen"
        ],
        correct: 1,
        rationale: "The combination of severe pneumonia, confusion, diarrhea, hyponatremia, and hotel/travel exposure is classic for Legionella pneumonia. Legionella urinary antigen detects serogroup 1 (80% of clinical infections) with 70–80% sensitivity. Legionella is associated with water systems (cooling towers, hotel water supplies, cruise ships). The hyponatremia results from SIADH. Legionella does not grow on standard cultures and requires buffered charcoal yeast extract (BCYE) agar. Treatment requires macrolide or fluoroquinolone — beta-lactams alone are ineffective against Legionella."
      },
      {
        question: "When prescribing levofloxacin for CAP, which patient characteristic represents an FDA-labeled contraindication?",
        options: [
          "Age > 65 years with mild renal impairment",
          "Known history of myasthenia gravis",
          "Concurrent use of metformin for type 2 diabetes",
          "History of mild penicillin rash as a child"
        ],
        correct: 1,
        rationale: "Myasthenia gravis is an FDA-labeled contraindication for ALL fluoroquinolones. Fluoroquinolones can exacerbate neuromuscular weakness and have caused fatal respiratory failure in MG patients. Other FDA Black Box warnings include tendon rupture, peripheral neuropathy, CNS effects, aortic dissection, and hypoglycemia — but myasthenia gravis is the only absolute contraindication among the options listed. Age > 65 is a risk factor for tendon rupture (especially with concurrent corticosteroids) but is not an absolute contraindication. Penicillin allergy does not affect fluoroquinolone prescribing."
      },
      {
        question: "The NP is evaluating a patient with CAP who shows no improvement after 72 hours of appropriate empiric antibiotics. Which of the following is the LEAST likely cause of treatment failure?",
        options: [
          "Development of parapneumonic effusion or empyema requiring drainage",
          "Resistant pathogen not covered by the empiric regimen",
          "The pneumonia was actually caused by a virus and antibiotics are unnecessary",
          "Incorrect diagnosis — pulmonary embolism mimicking pneumonia"
        ],
        correct: 2,
        rationale: "While viral pneumonia does occur, a patient who is not improving should NOT simply have antibiotics stopped on the assumption of viral etiology without further investigation. The most common causes of CAP treatment failure include: parapneumonic effusion/empyema (requires thoracentesis and possible chest tube), resistant organisms (MRSA, Pseudomonas — especially if risk factors present), incorrect diagnosis (PE, lung cancer, vasculitis, organizing pneumonia), or anatomic complications (lung abscess, necrotizing pneumonia). The workup for treatment failure should include: repeat imaging, blood cultures, consider CT chest, thoracentesis if effusion present, and broadening antibiotic coverage."
      }
    ],
    preTest: [
      {
        question: "What is the most common bacterial pathogen causing community-acquired pneumonia?",
        options: [
          "Haemophilus influenzae",
          "Streptococcus pneumoniae",
          "Mycoplasma pneumoniae",
          "Staphylococcus aureus"
        ],
        correct: 1,
        rationale: "Streptococcus pneumoniae remains the most common identified bacterial pathogen in CAP across all age groups, though its prevalence has decreased with widespread pneumococcal vaccination. It classically causes lobar consolidation with rust-colored sputum. Gram stain shows gram-positive lancet-shaped diplococci."
      },
      {
        question: "According to the CURB-65 scoring system, which individual criterion is scored?",
        options: [
          "Oxygen saturation < 92%",
          "Temperature > 39°C",
          "Blood urea nitrogen > 7 mmol/L (or > 20 mg/dL)",
          "White blood cell count > 15,000/mcL"
        ],
        correct: 2,
        rationale: "CURB-65 components: Confusion (new-onset), Urea > 7 mmol/L (BUN > 20 mg/dL), Respiratory rate ≥ 30, Blood pressure (systolic < 90 or diastolic ≤ 60), age ≥ 65. Each criterion = 1 point. Score 0–1: outpatient, 2: consider admission, 3–5: consider ICU. Oxygen saturation and temperature are not part of CURB-65."
      }
    ],
    postTest: [
      {
        question: "A 58-year-old woman with a history of aortic aneurysm and moderate COPD has CAP with a CURB-65 score of 1. She is allergic to penicillin (childhood urticaria). Which outpatient regimen is most appropriate?",
        options: [
          "Amoxicillin-clavulanate 2 g BID plus azithromycin 500 mg then 250 mg daily",
          "Levofloxacin 750 mg PO daily × 5 days",
          "Doxycycline 100 mg PO BID × 5 days alone",
          "Cefpodoxime 200 mg PO BID plus azithromycin 500 mg then 250 mg daily"
        ],
        correct: 3,
        rationale: "This patient has comorbidities (COPD) requiring a beta-lactam + macrolide combination. Penicillin allergy with childhood urticaria has a < 2% cross-reactivity with third-generation cephalosporins, so cefpodoxime is safe. Amoxicillin-clavulanate is avoided due to penicillin allergy. Levofloxacin (fluoroquinolone) should be avoided due to the aortic aneurysm — FDA warns of increased risk of aortic dissection. Doxycycline monotherapy lacks the beta-lactam component recommended for patients with comorbidities."
      }
    ]
  },

  "hypothyroidism-management-np": {
    title: "Hypothyroidism: NP Diagnosis, Levothyroxine Prescribing & Monitoring",
    cellular: {
      title: "Hypothyroidism Pathophysiology",
      content: "Hypothyroidism results from insufficient production of thyroid hormones (T4 and T3) by the thyroid gland, affecting virtually every organ system. The hypothalamic-pituitary-thyroid (HPT) axis regulates thyroid hormone production: the hypothalamus secretes thyrotropin-releasing hormone (TRH), which stimulates the anterior pituitary to release thyroid-stimulating hormone (TSH). TSH binds to TSH receptors on thyroid follicular cells, activating the sodium-iodide symporter (NIS) to trap iodide, which is then organified by thyroid peroxidase (TPO) and coupled to thyroglobulin to form T4 (thyroxine, ~80% of production) and T3 (triiodothyronine, ~20%). T4 is a prohormone converted to active T3 by type 1 and type 2 deiodinases in peripheral tissues (liver, kidneys, muscle). T3 binds nuclear thyroid hormone receptors (TR-α and TR-β) to regulate gene transcription controlling basal metabolic rate, thermogenesis, protein synthesis, lipid metabolism, cardiac contractility, and CNS development. In primary hypothyroidism (95% of cases), the thyroid gland itself is impaired — most commonly from Hashimoto thyroiditis (chronic lymphocytic thyroiditis), an autoimmune condition where anti-TPO antibodies and anti-thyroglobulin antibodies mediate lymphocytic infiltration and progressive destruction of thyroid follicular cells, leading to fibrosis and goiter formation (initially) followed by atrophy. Without adequate thyroid hormone: (1) BMR decreases 30–40% causing fatigue, cold intolerance, weight gain; (2) decreased cardiac output and stroke volume with bradycardia (reduced β1-adrenergic receptor expression); (3) elevated LDL cholesterol (reduced hepatic LDL receptor expression); (4) decreased GI motility causing constipation; (5) fluid accumulation in tissues as mucopolysaccharides (glycosaminoglycans) — causing non-pitting myxedema (pretibial, periorbital); (6) impaired renal free water clearance causing dilutional hyponatremia (decreased GFR and impaired ADH suppression). Secondary hypothyroidism (pituitary TSH deficiency) and tertiary hypothyroidism (hypothalamic TRH deficiency) are rare but critical to distinguish because isolated TSH interpretation is misleading — TSH may be low or normal despite inadequate thyroid hormone levels."
    },
    riskFactors: [
      "Hashimoto thyroiditis (chronic autoimmune thyroiditis): most common cause in iodine-sufficient areas; anti-TPO antibodies present in 90–95% of cases; female predominance 7:1; associated with other autoimmune conditions (type 1 diabetes, pernicious anemia, vitiligo, celiac disease, Addison disease — autoimmune polyendocrine syndromes)",
      "Post-ablative: radioactive iodine (I-131) therapy for Graves disease or toxic nodular goiter (hypothyroidism develops in 50–80% within 1 year); post-thyroidectomy (total = permanent hypothyroidism, subtotal = risk varies)",
      "Medications: amiodarone (contains 37% iodine — can cause either hypothyroidism via Wolff-Chaikoff effect or hyperthyroidism via Jod-Basedow effect; monitor TSH q6 months), lithium (inhibits thyroid hormone release; 20–40% develop hypothyroidism), tyrosine kinase inhibitors (sunitinib, sorafenib), immune checkpoint inhibitors (pembrolizumab, nivolumab — thyroiditis in 5–10% of patients), interferon-alpha",
      "Iodine deficiency: most common cause WORLDWIDE (rare in US/Canada due to iodized salt); causes goitrous hypothyroidism with compensatory thyroid enlargement",
      "Subacute thyroiditis (de Quervain's): post-viral granulomatous thyroiditis causing transient thyrotoxicosis (stored hormone release) followed by hypothyroid phase (4–6 weeks) then recovery in most (80%); painful, tender thyroid with elevated ESR",
      "Postpartum thyroiditis: occurs in 5–10% of pregnancies (higher in women with pre-existing anti-TPO antibodies); biphasic: thyrotoxicosis (1–4 months postpartum) then hypothyroidism (4–8 months) then recovery (80%) — 20% develop permanent hypothyroidism",
      "External beam radiation to the head/neck for cancer (Hodgkin lymphoma, head and neck cancers): progressive thyroid failure over years; lifelong TSH monitoring recommended",
      "Central hypothyroidism: pituitary adenoma, pituitary surgery/radiation, Sheehan syndrome (postpartum pituitary necrosis), infiltrative diseases (sarcoidosis, hemochromatosis, histiocytosis)"
    ],
    diagnostics: [
      "TSH (most sensitive initial test for primary hypothyroidism): elevated TSH (> 4.5–5.0 mIU/L depending on assay) is the earliest biochemical change — TSH rises before free T4 falls due to the log-linear relationship between TSH and free T4 (small decreases in T4 cause exponential increases in TSH). Subclinical hypothyroidism: TSH 4.5–10 with normal free T4; overt hypothyroidism: TSH elevated with low free T4",
      "Free T4 (fT4): confirms overt hypothyroidism when low; normal free T4 with elevated TSH = subclinical hypothyroidism; always measure fT4 with TSH to distinguish subclinical from overt disease",
      "Free T3: NOT routinely measured for hypothyroidism diagnosis — T3 is maintained by compensatory upregulation of type 2 deiodinase even in moderate hypothyroidism; only useful for monitoring patients on T3-containing medications (liothyronine, desiccated thyroid)",
      "Anti-TPO antibodies: present in 90–95% of Hashimoto thyroiditis; confirm autoimmune etiology; predict progression from subclinical to overt hypothyroidism (annual conversion rate 2–5% per year with positive antibodies vs < 1% without); useful for determining whether to treat subclinical hypothyroidism",
      "Anti-thyroglobulin antibodies: present in 60–80% of Hashimoto thyroiditis; less specific than anti-TPO; can interfere with thyroglobulin assays (important in thyroid cancer monitoring, not relevant to hypothyroidism management)",
      "Lipid panel: elevated total cholesterol and LDL (reduced hepatic LDL receptor expression); may see elevated triglycerides; lipid abnormalities often improve with adequate thyroid hormone replacement — check lipids 6–8 weeks after achieving euthyroidism before starting statins",
      "CBC: normocytic or macrocytic anemia (reduced erythropoietin production, possible concurrent pernicious anemia from autoimmune polyendocrine syndrome); check B12 and folate if macrocytic",
      "BMP: hyponatremia (impaired free water clearance from reduced GFR and impaired ADH suppression); elevated creatinine (reduced GFR); elevated CK (myopathy, rhabdomyolysis in severe cases)",
      "Special populations — Pregnancy: TSH targets differ by trimester (1st trimester < 2.5, 2nd trimester < 3.0, 3rd trimester < 3.5 mIU/L using trimester-specific reference ranges); Central hypothyroidism: TSH may be low, normal, or slightly elevated — free T4 is the diagnostic marker; must test pituitary function (cortisol, gonadotropins, prolactin, IGF-1)"
    ],
    management: [
      "Levothyroxine (LT4): FIRST-LINE treatment for all hypothyroidism; synthetic T4 identical to endogenous thyroxine with consistent potency; once-daily dosing due to 7-day half-life; GOAL: normalize TSH within the age-appropriate reference range",
      "Starting dose — Full replacement: 1.6 mcg/kg/day (ideal body weight) for young healthy adults; typical starting dose 75–100 mcg/day for most adults. Elderly or cardiac disease: start LOW and go SLOW — 12.5–25 mcg/day, increase by 12.5–25 mcg every 4–6 weeks (rapid correction can precipitate angina, MI, or arrhythmia by increasing myocardial oxygen demand before coronary perfusion can compensate)",
      "Subclinical hypothyroidism treatment decisions — TREAT if: TSH > 10 mIU/L (strong recommendation), pregnant or planning pregnancy (any elevation), symptoms attributable to hypothyroidism, positive anti-TPO antibodies with TSH 4.5–10 (risk of progression), goiter, infertility. OBSERVE if: TSH 4.5–10 without symptoms, negative antibodies, elderly (> 70 years — overtreating increases AF and fracture risk). Recheck TSH in 6–12 months if observing.",
      "Administration counseling: take on EMPTY STOMACH, 30–60 minutes before breakfast or 3–4 hours after dinner at bedtime (food reduces absorption by 20–40%). Separate from calcium supplements, iron supplements, PPIs, aluminum-containing antacids, cholestyramine, and sucralfate by at least 4 hours (all impair absorption). Take at a consistent time daily. Consistency is more important than time of day.",
      "Monitoring: recheck TSH 6–8 weeks after any dose change (TSH requires 5–6 half-lives to reach new steady state; T4 half-life = 7 days → 5–6 weeks). Once stable, check TSH annually. If dose change needed, adjust by 12.5–25 mcg increments. Pregnancy: increase dose by 25–30% (or add 2 extra doses/week) as soon as pregnancy is confirmed; check TSH every 4 weeks during the first trimester.",
      "Target TSH — General population: 0.5–2.5 mIU/L (lower half of normal range for most adults); Elderly > 70 years: 1.0–5.0 mIU/L (higher target acceptable — overtreating increases atrial fibrillation and hip fracture risk); Pregnancy: trimester-specific targets (1st < 2.5, 2nd < 3.0, 3rd < 3.5 or per institutional lab); Thyroid cancer post-thyroidectomy: TSH targets vary by risk (low-risk: 0.5–2.0, intermediate: 0.1–0.5, high-risk: < 0.1 mIU/L)",
      "Combination T4/T3 therapy: NOT recommended as routine by ATA/AACE guidelines; current evidence does not show consistent benefit over LT4 monotherapy. Trial of liothyronine (LT3) or desiccated thyroid extract (DTE) may be considered ONLY for patients with persistent symptoms despite optimal TSH on LT4, AND after excluding other causes (depression, sleep apnea, anemia, vitamin D deficiency). If using: T4:T3 ratio should approximate physiologic ratio (14:1 to 20:1).",
      "Brand vs generic: FDA considers levothyroxine products AB-rated as therapeutically equivalent; however, some patients may experience TSH fluctuations when switching formulations. ATA recommends: if switching brands/generics, recheck TSH in 6–8 weeks. For patients with narrow therapeutic window (thyroid cancer, pregnancy), consistency of formulation is preferred."
    ],
    nursingActions: [
      "Baseline assessment: document symptoms (fatigue scale, cold intolerance, constipation, weight changes, cognitive complaints, depression screening), vital signs (bradycardia, diastolic hypertension common), thyroid palpation (goiter size, nodules — any palpable nodule > 1 cm requires ultrasound evaluation regardless of thyroid function)",
      "Medication reconciliation: identify drugs that impair levothyroxine absorption (calcium, iron, PPIs, antacids, cholestyramine, sucralfate — separate by 4 hours) and drugs that increase levothyroxine metabolism (phenytoin, carbamazepine, phenobarbital, rifampin — may require higher doses)",
      "Patient education: take levothyroxine on empty stomach 30–60 minutes before breakfast with water only; do not crush or chew (use liquid/softgel formulations if swallowing difficulty); do not stop medication without provider guidance — hypothyroidism is a lifelong condition requiring permanent replacement in most cases",
      "Monitoring education: explain that dose adjustments require 6–8 weeks before rechecking TSH; symptoms may take 4–12 weeks to improve after starting or adjusting dose; overtreatment symptoms to report (palpitations, tremor, anxiety, insomnia, diarrhea, weight loss, heat intolerance)",
      "Cardiac monitoring for high-risk patients: elderly and patients with coronary artery disease should be monitored for angina, arrhythmia, and heart failure exacerbation when starting or increasing levothyroxine; obtain baseline ECG; increase dose gradually (12.5–25 mcg every 4–6 weeks)",
      "Pregnancy counseling: women of reproductive age should be counseled that levothyroxine dose typically needs to increase 25–30% during pregnancy; report pregnancy immediately so dose can be adjusted; hypothyroidism in pregnancy increases risk of preeclampsia, placental abruption, preterm birth, and impaired fetal neurodevelopment",
      "Annual screening: TSH annually when stable; lipid panel (expect improvement in LDL); screening for associated autoimmune conditions if Hashimoto's (celiac disease, pernicious anemia, type 1 diabetes); thyroid nodule screening with palpation",
      "Myxedema coma education for severe cases: this is a medical emergency — extreme hypothyroidism with hypothermia, altered mental status, hypoventilation, bradycardia, hypotension; requires IV levothyroxine 200–500 mcg loading dose + IV hydrocortisone 100 mg q8h (empiric stress-dose steroids before ruling out coexistent adrenal insufficiency) + ICU admission"
    ],
    signs: {
      left: [
        "Mild/subclinical hypothyroidism: TSH 4.5–10, normal free T4, fatigue, mild weight gain, slightly elevated cholesterol — may observe or treat based on antibody status and symptoms",
        "Well-controlled on levothyroxine: TSH 0.5–2.5, resolution of symptoms, normalized lipids, stable weight, normal energy and cognition",
        "Postpartum thyroiditis in recovery phase: TSH normalizing, symptoms improving — most (80%) recover thyroid function within 12–18 months; 20% develop permanent hypothyroidism requiring lifelong replacement",
        "Subclinical hypothyroidism in elderly (> 70 years): TSH 5–8, asymptomatic — observation preferred over treatment; overtreating increases risk of atrial fibrillation and hip fracture"
      ],
      right: [
        "Myxedema coma: extreme hypothyroidism with hypothermia (< 35°C), altered mental status/coma, hypoventilation (CO2 retention), bradycardia, hypotension — mortality 20–60% even with treatment; requires IV levothyroxine loading + IV hydrocortisone + ICU",
        "Severe symptomatic hypothyroidism with pericardial effusion: cardiac tamponade risk — large pericardial effusion with low voltage on ECG and electrical alternans; usually accumulates slowly so tamponade is rare but life-threatening when it occurs",
        "Hypothyroid crisis precipitated by acute illness, surgery, or trauma in an undiagnosed/untreated patient — high-risk for respiratory failure (diaphragmatic weakness, decreased ventilatory drive), hypothermia, cardiovascular collapse",
        "Central hypothyroidism with concurrent adrenal insufficiency: replacing thyroid hormone BEFORE cortisol can precipitate adrenal crisis — always give hydrocortisone first if pituitary/hypothalamic disease suspected"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid, Levoxyl, Tirosint)",
        type: "Synthetic Thyroid Hormone (T4)",
        action: "Identical to endogenous thyroxine (T4). Absorbed in the jejunum and ileum; converted to active T3 by type 1 and type 2 deiodinases in peripheral tissues. T3 binds nuclear thyroid hormone receptors to regulate gene transcription controlling BMR, protein synthesis, cardiac function, lipid metabolism, and thermoregulation. 7-day half-life allows once-daily dosing with steady-state plasma levels.",
        sideEffects: "When properly dosed, levothyroxine has minimal side effects (it replaces a physiologic hormone). Overreplacement symptoms: palpitations, tachycardia, atrial fibrillation, tremor, nervousness, insomnia, diarrhea, weight loss, heat intolerance, menstrual irregularity, decreased bone mineral density (especially in postmenopausal women with suppressed TSH).",
        contra: "Untreated adrenal insufficiency (thyroid hormone increases cortisol metabolism — replacing T4 before cortisol can precipitate adrenal crisis), recent acute MI (relative — start at very low dose with cardiac monitoring), thyrotoxicosis (correction of an incorrect diagnosis)",
        pearl: "Full replacement: 1.6 mcg/kg/day (ideal body weight). Elderly/cardiac: start 12.5–25 mcg, titrate q4–6 weeks. Take on empty stomach, 30–60 minutes before food. Separate from calcium/iron by 4 hours. Tirosint (liquid gel capsule) has better absorption and fewer food/drug interactions — consider for patients on PPIs, with GI malabsorption, or inconsistent absorption. Generic levothyroxine is AB-rated to brand but may have slight bioavailability differences — avoid switching formulations in patients with narrow therapeutic windows (thyroid cancer, pregnancy). TSH takes 6–8 weeks to reach new steady state after dose change — do not check TSH too early."
      },
      {
        name: "Liothyronine (Cytomel)",
        type: "Synthetic Thyroid Hormone (T3)",
        action: "Synthetic triiodothyronine identical to endogenous T3. Directly activates nuclear thyroid hormone receptors without requiring peripheral conversion. Faster onset (hours) and shorter half-life (1 day) than T4 (7 days). 3–5 times more potent than T4 per microgram.",
        sideEffects: "Peak-and-trough fluctuations (T3 levels spike 2–4 hours after dose then decline — causes palpitations, anxiety during peaks and fatigue during troughs), tachycardia, arrhythmia, angina in cardiac patients, bone mineral density loss with long-term use, insomnia",
        contra: "Same as levothyroxine plus: cardiovascular disease (T3 is more arrhythmogenic than T4 due to peak-trough swings), uncontrolled adrenal insufficiency",
        pearl: "NOT recommended as routine monotherapy. If used in combination with LT4, give at physiologic T4:T3 ratio (14:1 to 20:1) in divided doses (BID or TID due to short half-life). Typical combination: reduce LT4 dose by 25 mcg and add liothyronine 5–10 mcg daily in divided doses. ATA/AACE guidelines: consider T4/T3 combination only for patients with persistent symptoms despite optimal TSH on LT4 monotherapy, after excluding other causes. Sustained-release T3 formulations are not commercially available but are used by some compounding pharmacies. Monitor free T3 levels (draw trough level before morning dose) in addition to TSH and free T4."
      }
    ],
    pearls: [
      "The single most important prescribing concept for levothyroxine: absorption is dramatically affected by food and medications. Patients who take LT4 with breakfast or with their morning calcium/iron supplement will have subtherapeutic levels despite 'adequate' dosing. Always ask about timing and concurrent medications before increasing the dose.",
      "In elderly patients > 70 years, treating subclinical hypothyroidism (TSH 4.5–10) does NOT improve symptoms, quality of life, or cardiovascular outcomes (TRUST trial). Overtreating with levothyroxine increases atrial fibrillation and hip fracture risk. Observe unless TSH > 10 or significant symptoms.",
      "If a patient on stable levothyroxine develops unexplained TSH elevation, check for: new medications that impair absorption (PPI, calcium, iron, estrogen), dietary changes (high-fiber, soy, coffee interfere), pregnancy (30% dose increase needed), weight gain (dose is weight-based), noncompliance (the most common cause), or medication formulation change.",
      "Central hypothyroidism is diagnosed by LOW free T4 with LOW or inappropriately normal TSH — TSH is unreliable in this setting. Always evaluate the pituitary with MRI and test for concurrent adrenal insufficiency (cortisol) before starting levothyroxine — replacing thyroid hormone accelerates cortisol metabolism and can precipitate adrenal crisis in unrecognized panhypopituitarism.",
      "Myxedema coma is the most extreme manifestation: hypothermia, altered consciousness, hypoventilation, bradycardia, hypotension. Treatment: IV levothyroxine 200–500 mcg loading dose + IV hydrocortisone 100 mg q8h (empiric — must replace cortisol before T4 in case of coexistent adrenal insufficiency) + active rewarming + mechanical ventilation if needed. Mortality 20–60% even with treatment. Precipitants: infection, cold exposure, sedatives, opioids, surgery."
    ],
    quiz: [
      {
        question: "A 45-year-old woman with newly diagnosed overt hypothyroidism (TSH 48, free T4 0.3) is started on levothyroxine. She takes calcium carbonate 600 mg twice daily, omeprazole 20 mg daily, and sertraline 100 mg daily. Which medication counseling point is most critical?",
        options: [
          "Discontinue sertraline as SSRIs interfere with thyroid hormone action",
          "Take levothyroxine at least 4 hours apart from calcium carbonate and consider separating from omeprazole",
          "Take levothyroxine with food to reduce nausea",
          "Start with levothyroxine 200 mcg daily for rapid correction given the severity"
        ],
        correct: 1,
        rationale: "Calcium carbonate significantly reduces levothyroxine absorption by chelation in the gut — they MUST be separated by at least 4 hours. PPIs (omeprazole) reduce gastric acid, which impairs levothyroxine dissolution and absorption (levothyroxine requires acidic pH for dissolution). Separating these medications is critical for achieving therapeutic levels. Levothyroxine should be taken on an EMPTY stomach (not with food). High starting doses are dangerous, especially with severe hypothyroidism — start 50–75 mcg and titrate every 4–6 weeks. SSRIs do not significantly interfere with thyroid hormone."
      },
      {
        question: "A 78-year-old man with a history of coronary artery disease has a TSH of 32 mIU/L and free T4 of 0.5 ng/dL. He reports fatigue and constipation. The appropriate starting dose of levothyroxine is:",
        options: [
          "125 mcg daily (full replacement dose based on his weight of 80 kg)",
          "12.5–25 mcg daily, titrated by 12.5–25 mcg every 4–6 weeks",
          "50 mcg daily with plan to increase to full dose within 2 weeks",
          "No treatment — subclinical hypothyroidism in the elderly should be observed"
        ],
        correct: 1,
        rationale: "This patient has OVERT hypothyroidism (elevated TSH + low free T4 + symptoms), not subclinical, so treatment is indicated. However, in elderly patients with coronary artery disease, the 'start low and go slow' approach is essential: start at 12.5–25 mcg daily and increase by 12.5–25 mcg every 4–6 weeks. Rapid correction increases myocardial oxygen demand, which can precipitate angina, MI, or fatal arrhythmia in patients with underlying CAD. The full replacement dose (1.6 mcg/kg ≈ 128 mcg for 80 kg) would be dangerous as a starting dose."
      },
      {
        question: "A woman at 8 weeks gestation with known hypothyroidism on levothyroxine 100 mcg daily has a TSH of 5.8 mIU/L. Her pre-pregnancy TSH was 1.8. What is the recommended action?",
        options: [
          "Continue current dose and recheck TSH at the second trimester",
          "Increase levothyroxine dose by 25–30% and recheck TSH in 4 weeks",
          "Switch to liothyronine for better fetal brain development",
          "Discontinue levothyroxine — pregnancy-related TSH elevations are physiologic"
        ],
        correct: 1,
        rationale: "In pregnancy, levothyroxine requirements increase by 25–30% due to: (1) increased thyroid-binding globulin from estrogen (decreasing free T4), (2) increased plasma volume, and (3) transplacental T4 transfer to the fetus. TSH target in the first trimester is < 2.5 mIU/L (or below the trimester-specific upper reference limit). Her TSH of 5.8 is above target. The standard approach: increase LT4 by 25–30% (add 2 extra doses per week is a practical alternative) and recheck TSH every 4 weeks during the first trimester, then every 4–6 weeks thereafter. Liothyronine is NOT recommended in pregnancy (shorter half-life, peak-trough fluctuations, less data on fetal safety)."
      },
      {
        question: "A patient on stable levothyroxine therapy for 3 years has a routine TSH of 12.5 mIU/L (previously 1.5 mIU/L). She denies any symptoms and reports consistent medication adherence. The NP's first step should be:",
        options: [
          "Increase levothyroxine dose by 25 mcg and recheck in 6 weeks",
          "Assess for new medications, dietary changes, or formulation switches that could impair absorption",
          "Order anti-TPO antibodies to determine if Hashimoto's has progressed",
          "Switch from generic to brand-name levothyroxine"
        ],
        correct: 1,
        rationale: "Before increasing the dose, the NP should investigate the CAUSE of the unexpected TSH elevation. Common causes: new medications that impair absorption (calcium, iron, PPIs, estrogen, cholestyramine), dietary changes (soy, high-fiber, coffee within 1 hour of LT4), pharmacy switching generic manufacturers (different bioavailability), weight gain, pregnancy, or noncompliance (the most common cause — even one missed dose per week can elevate TSH). Increasing the dose without addressing the root cause may lead to overreplacement when the interfering factor is corrected."
      },
      {
        question: "A previously healthy 55-year-old woman presents with fatigue, weight gain, and constipation. TSH is 7.2 mIU/L, free T4 is 1.1 ng/dL (normal 0.8–1.8), and anti-TPO antibodies are 450 IU/mL (normal < 35). The most appropriate management is:",
        options: [
          "Start levothyroxine 50 mcg daily — she has subclinical hypothyroidism with positive antibodies and symptoms",
          "Observe and recheck TSH in 12 months — subclinical hypothyroidism does not require treatment",
          "Start liothyronine 25 mcg daily for more rapid symptom relief",
          "Start levothyroxine 150 mcg daily for rapid normalization"
        ],
        correct: 0,
        rationale: "This patient has subclinical hypothyroidism (elevated TSH with normal free T4) with three indications for treatment: (1) symptoms attributable to hypothyroidism (fatigue, weight gain, constipation), (2) strongly positive anti-TPO antibodies (indicating Hashimoto thyroiditis with annual 2–5% progression risk to overt hypothyroidism), and (3) TSH > 4.5. Starting dose for subclinical hypothyroidism is lower than for overt disease — typically 25–50 mcg daily with TSH recheck in 6–8 weeks. Liothyronine monotherapy is not recommended. 150 mcg is excessive for subclinical disease."
      }
    ],
    preTest: [
      {
        question: "What is the most common cause of hypothyroidism in iodine-sufficient regions?",
        options: [
          "Iodine deficiency",
          "Hashimoto thyroiditis (chronic autoimmune thyroiditis)",
          "Post-surgical hypothyroidism",
          "Central hypothyroidism from pituitary disease"
        ],
        correct: 1,
        rationale: "Hashimoto thyroiditis is the most common cause of hypothyroidism in iodine-sufficient countries (US, Canada, Europe). It is an autoimmune condition characterized by anti-TPO and anti-thyroglobulin antibodies causing lymphocytic infiltration and destruction of thyroid tissue. Iodine deficiency is the most common cause worldwide but rare in iodine-sufficient regions."
      },
      {
        question: "When is the earliest appropriate time to recheck TSH after starting or adjusting a levothyroxine dose?",
        options: [
          "1–2 weeks",
          "3–4 weeks",
          "6–8 weeks",
          "12 weeks"
        ],
        correct: 2,
        rationale: "TSH requires 6–8 weeks to reach a new steady state after a levothyroxine dose change. Levothyroxine has a 7-day half-life, and TSH requires 5–6 half-lives (35–42 days) to equilibrate at the new hormone level. Checking TSH too early (< 6 weeks) gives inaccurate results and may lead to inappropriate dose adjustments."
      }
    ],
    postTest: [
      {
        question: "Which of the following patients with subclinical hypothyroidism (TSH 6.5, normal free T4) should the NP recommend AGAINST initiating levothyroxine treatment?",
        options: [
          "A 30-year-old woman planning pregnancy with positive anti-TPO antibodies",
          "A 50-year-old man with fatigue, constipation, and TSH confirmed on repeat testing",
          "An 82-year-old asymptomatic woman with negative anti-TPO antibodies",
          "A 40-year-old woman with new goiter and anti-TPO antibodies > 500"
        ],
        correct: 2,
        rationale: "Current evidence (TRUST trial, 2017) shows NO benefit of treating subclinical hypothyroidism in asymptomatic elderly patients (> 70–80 years) with TSH < 10. Treatment increases risks of atrial fibrillation and hip fractures from overreplacement. All other patients have clear indications: pregnancy planning (any TSH elevation in pregnancy is harmful to fetal neurodevelopment), symptomatic disease, and goiter with high antibody titers (high progression risk)."
      }
    ]
  },

  "migraine-management-np": {
    title: "Migraine: NP Differential Diagnosis, Acute Treatment & Prophylaxis Prescribing",
    cellular: {
      title: "Migraine Pathophysiology",
      content: "Migraine is a complex neurovascular disorder characterized by recurrent episodes of moderate-to-severe, typically unilateral, pulsating headache lasting 4–72 hours, associated with nausea, vomiting, photophobia, and phonophobia. The pathophysiology has evolved from the 'vascular theory' (vasoconstriction → vasodilation) to the current 'trigeminovascular theory.' The cascade begins with cortical spreading depression (CSD) — a wave of neuronal depolarization followed by suppression that propagates across the cerebral cortex at 3–5 mm/min. CSD is responsible for the migraine aura (visual scintillations, scotoma, sensory disturbances) and activates trigeminal nerve afferents in the meninges. Activated trigeminal neurons release vasoactive neuropeptides — calcitonin gene-related peptide (CGRP), substance P, and neurokinin A — from perivascular nerve terminals. CGRP is the key mediator: it causes potent meningeal vasodilation, mast cell degranulation, plasma protein extravasation (neurogenic inflammation), and sensitization of trigeminal nociceptors. This peripheral sensitization lowers the activation threshold of trigeminal afferents, making normal pulsatile arterial distension painful (explaining the throbbing quality). Signals travel via the trigeminal ganglion to the trigeminal nucleus caudalis (TNC) in the brainstem, then to the thalamus and cortex for pain perception. Central sensitization develops as the attack progresses, manifesting clinically as cutaneous allodynia (pain from normally non-painful stimuli like combing hair or wearing glasses) — once allodynia develops, triptans become less effective because central sensitization is maintained by brainstem mechanisms independent of peripheral CGRP. The brainstem migraine generator (dorsal raphe nucleus, locus coeruleus, periaqueductal gray) modulates the attack and may explain prodromal symptoms (yawning, food cravings, mood changes, neck stiffness) that occur hours before pain onset. Serotonin (5-HT) plays a central role — 5-HT1B receptors on meningeal blood vessels mediate vasoconstriction, while 5-HT1D receptors on trigeminal nerve terminals inhibit CGRP release; triptans are agonists at both receptor subtypes."
    },
    riskFactors: [
      "Female sex: 3:1 female-to-male ratio after puberty (hormonal influence — estrogen withdrawal triggers attacks; menstrual migraine occurs in 60% of women with migraine, typically days -2 to +3 of menses)",
      "Family history: 50–70% of migraine patients have a first-degree relative with migraine; complex polygenic inheritance with identified susceptibility loci affecting ion channels, neurotransmitter metabolism, and vascular function",
      "Triggers (vary by individual): stress and 'letdown' after stress (most commonly reported), sleep disturbance (too little or too much), hormonal changes (menses, OCP, perimenopause), dietary triggers (alcohol — especially red wine, aged cheese — tyramine, chocolate, MSG, caffeine withdrawal), weather/barometric pressure changes, strong sensory stimuli (bright lights, strong odors, loud noise)",
      "Medication overuse: analgesic use > 15 days/month (simple analgesics) or > 10 days/month (triptans, opioids, combination analgesics) transforms episodic migraine into chronic migraine with medication overuse headache (MOH) — the most modifiable risk factor for chronification",
      "Obesity: BMI > 30 increases migraine frequency and severity; abdominal adiposity produces pro-inflammatory cytokines that lower the migraine threshold",
      "Psychiatric comorbidities: depression and anxiety have bidirectional association with migraine (shared serotonergic pathways); PTSD increases migraine frequency",
      "Concussion/TBI history: post-traumatic headache often has migrainous features and can trigger new-onset chronic migraine",
      "Caffeine overuse: daily caffeine intake > 200 mg sensitizes the adenosine receptor system; abrupt reduction or inconsistent intake triggers withdrawal headaches and lowers the migraine threshold"
    ],
    diagnostics: [
      "Diagnosis is CLINICAL using ICHD-3 criteria — NO routine neuroimaging required for typical migraine with normal neurological exam. Migraine without aura: ≥ 5 attacks lasting 4–72 hours with at least 2 of (unilateral, pulsating, moderate-severe, aggravated by routine physical activity) AND at least 1 of (nausea/vomiting, photophobia AND phonophobia). Migraine with aura: ≥ 2 attacks with fully reversible visual, sensory, or speech/language symptoms developing over 5–60 minutes, followed by headache within 60 minutes.",
      "Red flags requiring neuroimaging (SNOOP mnemonic): Systemic symptoms (fever, weight loss, cancer, HIV, pregnancy), Neurological symptoms (focal deficits, papilledema, seizures, altered consciousness), Onset sudden/thunderclap (< 1 minute to peak — rule out SAH), Onset after age 50 (new primary headache after 50 = secondary cause until proven otherwise), Pattern change (first or worst headache, progressive headache, change in character)",
      "MRI brain with and without contrast (preferred over CT): indicated for red flags, atypical features, focal neurological exam findings, new aura in patient > 40, prolonged aura (> 60 minutes), or failure to respond to appropriate treatment; also consider for migraine with brainstem aura (formerly basilar migraine) or hemiplegic migraine",
      "Headache diary: essential for diagnosis and management — track frequency, duration, severity, triggers, associated symptoms, medication use (including OTC), menstrual cycle; minimum 3 months of data before initiating prophylaxis; helps identify medication overuse headache",
      "MIDAS (Migraine Disability Assessment Scale) or HIT-6 (Headache Impact Test): standardized tools for quantifying migraine-related disability; scores guide treatment intensity — MIDAS ≥ 11 or HIT-6 ≥ 56 supports prophylactic therapy; useful for documenting treatment response and disability for insurance prior authorization",
      "Laboratory: NOT routinely indicated; consider ESR/CRP (giant cell arteritis if > 50 years), TSH (thyroid dysfunction can trigger headaches), CBC (anemia), pregnancy test (before prescribing migraine medications)",
      "LP with opening pressure: ONLY if thunderclap headache (SAH — xanthochromia analysis), suspected meningitis, or suspected idiopathic intracranial hypertension (elevated opening pressure > 25 cm H2O with papilledema)"
    ],
    management: [
      "ACUTE TREATMENT — Mild-moderate attacks (MIDAS I–II): NSAIDs first-line: ibuprofen 400–800 mg, naproxen sodium 500–825 mg, or aspirin 900–1000 mg at onset. Combination: acetaminophen 250 mg + aspirin 250 mg + caffeine 65 mg (Excedrin) — FDA-approved for migraine. KEY: treat early when pain is mild for best efficacy; delayed treatment after allodynia develops reduces response to all acute medications.",
      "ACUTE TREATMENT — Moderate-severe attacks or NSAID failure: Triptans (5-HT1B/1D agonists): sumatriptan 50–100 mg PO (or 6 mg SC — fastest onset, 10 minutes; or 20 mg intranasal), rizatriptan 10 mg PO (fastest oral onset — 30 minutes), eletriptan 40 mg PO (longest duration, lowest recurrence), zolmitriptan 2.5–5 mg PO or nasal spray. Take at the first sign of headache pain (NOT during aura — triptans treat pain, not aura). Can repeat once after 2 hours if partial response. Limit to ≤ 9 days/month to prevent MOH.",
      "ACUTE TREATMENT — Triptan contraindications or failure: Gepants (CGRP receptor antagonists): ubrogepant 50–100 mg PO, rimegepant 75 mg PO/ODT — no cardiovascular contraindications (can use in patients with CAD, uncontrolled HTN, prior stroke); can also be used for prevention. Lasmiditan (5-HT1F agonist, 'ditan'): 50–200 mg PO — no vasoconstrictive properties (safe in cardiovascular disease); causes dizziness/sedation — do not drive for 8 hours.",
      "ACUTE TREATMENT — Severe/ED setting: metoclopramide 10 mg IV + diphenhydramine 25 mg IV (antiemetic + prevents akathisia) OR prochlorperazine 10 mg IV + diphenhydramine 25 mg IV; ketorolac 30 mg IV; dexamethasone 10 mg IV (reduces 24–72 hour recurrence); avoid opioids (promote MOH, nausea, no evidence of superiority, dependency risk); magnesium sulfate 1–2 g IV (especially if migraine with aura).",
      "PROPHYLAXIS indications: ≥ 4 migraine days/month, significant disability (MIDAS ≥ 11), failure or contraindication to acute therapies, medication overuse, menstrual migraine, migraine with brainstem aura or hemiplegic migraine, patient preference",
      "PROPHYLAXIS — First-line oral: propranolol 40–240 mg/day (or metoprolol 50–200 mg) — especially for patients with concurrent HTN, anxiety, or tachycardia; topiramate 25–200 mg/day (weight loss, cognitive 'fog,' teratogen — requires contraception; kidney stones); amitriptyline 10–75 mg at bedtime (especially for concurrent insomnia, tension-type headache, or depression; weight gain, dry mouth, sedation); valproic acid/divalproex 500–1500 mg/day (effective but teratogen, weight gain, hair loss, hepatotoxicity)",
      "PROPHYLAXIS — CGRP monoclonal antibodies (if 2+ oral prophylactics fail): erenumab 70–140 mg SC monthly (targets CGRP receptor), fremanezumab 225 mg SC monthly or 675 mg quarterly, galcanezumab 240 mg loading then 120 mg monthly (targets CGRP ligand). Onset: 1–2 months. Minimal side effects (injection site reactions, constipation with erenumab). No hepatic monitoring or drug interactions. Expensive — require prior authorization documenting failure of 2+ oral preventives.",
      "PROPHYLAXIS — Other options: onabotulinumtoxinA (Botox) 155 units q12 weeks for chronic migraine (≥ 15 headache days/month with ≥ 8 migrainous); candesartan 8–16 mg/day (evidence comparable to propranolol); venlafaxine 75–150 mg/day; magnesium 400–600 mg daily (evidence for menstrual migraine and migraine with aura); riboflavin (B2) 400 mg daily; CoQ10 300 mg daily"
    ],
    nursingActions: [
      "Comprehensive headache history: frequency, duration, location, quality, severity, associated symptoms, triggers, aura characteristics, family history, medication use (including ALL OTC medications and supplements), caffeine intake, menstrual pattern — use standardized questionnaire or headache diary template",
      "Red flag screening (SNOOP criteria): systemic symptoms, neurological deficits, sudden onset, onset after 50, pattern change — ANY red flag requires urgent evaluation; document screening in clinical note",
      "Medication overuse headache screening: calculate total analgesic days per month across ALL products (patients often don't count OTC medications); > 15 days/month of simple analgesics or > 10 days/month of triptans/opioids/combinations = MOH requiring structured withdrawal plus bridge therapy",
      "Acute medication counseling: take acute medications EARLY (within 30–60 minutes of headache onset for best efficacy); counsel on triptan use — not for aura phase, can repeat once after 2 hours, limit to ≤ 9 days/month; cardiovascular contraindication screening before prescribing triptans (uncontrolled HTN, CAD, prior stroke, PVD, Prinzmetal angina, hemiplegic/brainstem aura migraine)",
      "Prophylactic medication counseling: adequate trial is 2–3 months at therapeutic dose before judging efficacy; side effects are dose-dependent and often improve over 2–4 weeks; do not abruptly stop beta-blockers (rebound HTN/tachycardia) or valproic acid (seizure risk); topiramate requires reliable contraception (category X teratogen — orofacial clefts)",
      "Lifestyle modification counseling: regular sleep schedule (same bedtime/wake time including weekends), regular meals (fasting is a common trigger), aerobic exercise (30 minutes × 5 days/week — as effective as topiramate for prevention), stress management (cognitive behavioral therapy, mindfulness), hydration (dehydration triggers attacks), trigger avoidance (personalized based on headache diary)",
      "CGRP monoclonal antibody administration teaching: SC injection technique, injection site rotation (abdomen, thigh, upper arm), storage (refrigerated; allow to reach room temperature before injecting), expected timeline for response (1–2 months), side effects to report",
      "Follow-up plan: return in 4–8 weeks for acute treatment evaluation; return in 2–3 months for prophylactic medication assessment; document MIDAS/HIT-6 scores at baseline and follow-up to track disability improvement; reassess for medication overuse at every visit"
    ],
    signs: {
      left: [
        "Episodic migraine (< 15 headache days/month) responding to acute treatment: consider acute therapy optimization before adding prophylaxis",
        "Migraine with typical visual aura (scintillating scotoma, fortification spectra) lasting 5–60 minutes followed by headache — classic presentation, benign prognosis",
        "Well-controlled on prophylaxis: < 4 migraine days/month, MIDAS < 11, adequate acute treatment response — consider tapering prophylaxis after 6–12 months of good control",
        "Menstrual migraine with predictable pattern: consider short-term prophylaxis with naproxen 500 mg BID or frovatriptan 2.5 mg BID starting 2 days before expected menses through day 3"
      ],
      right: [
        "Thunderclap headache (< 1 minute to peak severity): CANNOT be assumed to be migraine — rule out subarachnoid hemorrhage with STAT CT head and LP if CT negative; do NOT discharge until SAH is excluded",
        "New headache in patient > 50 years: must exclude giant cell arteritis (temporal artery tenderness, jaw claudication, visual changes, elevated ESR/CRP), brain tumor, or subdural hematoma before diagnosing primary headache",
        "Migraine with persistent aura > 60 minutes or new neurological deficits: MRI brain to exclude stroke, AVM, or mass lesion; hemiplegic migraine requires differentiation from TIA/stroke",
        "Chronic migraine (≥ 15 headache days/month for > 3 months) with medication overuse: requires structured analgesic withdrawal (may worsen temporarily), bridge therapy, and initiation of prophylaxis — onabotulinumtoxinA or CGRP mAb are FDA-approved for chronic migraine"
      ]
    },
    medications: [
      {
        name: "Sumatriptan (Imitrex)",
        type: "5-HT1B/1D Receptor Agonist (Triptan)",
        action: "Selective serotonin receptor agonist at 5-HT1B receptors (meningeal vasoconstriction, reducing pulsatile arterial distension) and 5-HT1D receptors (inhibits CGRP and substance P release from trigeminal nerve terminals, blocking neurogenic inflammation). Also acts on 5-HT1D receptors in the trigeminal nucleus caudalis to inhibit central pain transmission.",
        sideEffects: "Triptan sensations: chest tightness/pressure (5–7%, non-cardiac — likely esophageal/skeletal muscle spasm), tingling, warmth, flushing, dizziness, drowsiness, injection site reactions (SC). Coronary vasospasm (rare but potentially fatal in patients with CAD). Serotonin syndrome (rare, when combined with SSRIs/SNRIs at high doses — FDA warning updated to note low but present risk).",
        contra: "ABSOLUTE: coronary artery disease, prior MI, Prinzmetal (vasospastic) angina, uncontrolled hypertension, stroke or TIA history, peripheral vascular disease, hemiplegic migraine, basilar/brainstem aura migraine, use of MAOIs within 14 days, use of ergotamine within 24 hours, use of another triptan within 24 hours. Relative: multiple cardiovascular risk factors (perform cardiovascular risk assessment — consider first dose in clinic with ECG monitoring for patients with borderline risk).",
        pearl: "100 mg PO is most commonly prescribed; 50 mg is effective for many patients and causes fewer side effects. SC 6 mg has fastest onset (10 minutes) — best for severe attacks or attacks with early vomiting. Nasal spray 20 mg for patients who cannot tolerate PO. Can repeat once after 2 hours if initial response is partial (max 200 mg PO or 12 mg SC per 24 hours). Teach patients: take AT ONSET of headache pain (not during aura); if headache recurs within 24 hours (recurrence rate ~30%), a second dose is effective. Eletriptan 40 mg has the lowest 24-hour recurrence rate of all triptans. Limit triptan use to ≤ 9 days/month to prevent MOH."
      },
      {
        name: "Erenumab (Aimovig)",
        type: "CGRP Receptor Monoclonal Antibody (Preventive)",
        action: "Fully human IgG2 monoclonal antibody that binds the calcitonin gene-related peptide (CGRP) receptor, blocking CGRP from activating its receptor on trigeminal neurons and meningeal vasculature. Prevents the CGRP-mediated cascade of vasodilation, neurogenic inflammation, and peripheral sensitization that drives migraine attacks. Does NOT cross the blood-brain barrier — peripheral mechanism only.",
        sideEffects: "Injection site reactions (erythema, pain), constipation (CGRP plays a role in GI motility — most common with erenumab as it targets the receptor), muscle spasms/cramps, antibody development (rare, does not consistently affect efficacy), hypertension (rare but FDA warning added — monitor BP after initiation)",
        contra: "Hypersensitivity to erenumab. No established cardiovascular contraindications (unlike triptans). Caution in severe constipation or patients at risk for impaction. Limited pregnancy data — discontinue at least 5 months before planned conception (long half-life ~28 days, wash-out takes 5 half-lives).",
        pearl: "70 mg SC monthly (may increase to 140 mg monthly if insufficient response at 3 months). Self-administered SC injection using autoinjector pen — store refrigerated, allow to reach room temperature before injecting. Onset of benefit: 50% of responders notice improvement within 1 month, maximum effect at 3–6 months. Minimal drug interactions (no hepatic metabolism — eliminated by proteolysis). Cost: ~$600/month — insurance prior authorization typically requires documented failure of 2+ oral preventive medications. The three available CGRP mAbs differ: erenumab targets the CGRP RECEPTOR, while fremanezumab and galcanezumab target the CGRP LIGAND — switching from one to another can work if the first is ineffective."
      },
      {
        name: "Topiramate (Topamax)",
        type: "Anticonvulsant / Migraine Prophylactic",
        action: "Multiple mechanisms: blocks voltage-gated sodium channels (reducing cortical spreading depression), enhances GABA-A receptor activity (inhibitory), inhibits glutamate at AMPA/kainate receptors (excitatory), inhibits carbonic anhydrase (may contribute to both efficacy and side effects). Net effect: raises the threshold for cortical excitability and reduces the frequency of cortical spreading depression.",
        sideEffects: "Cognitive dysfunction ('brain fog' — word-finding difficulty, reduced processing speed, concentration impairment — most commonly cited reason for discontinuation), paresthesias (tingling in hands/feet — carbonic anhydrase inhibition), weight loss (appetite suppression — may be beneficial or harmful), nephrolithiasis (1.5% — carbonic anhydrase inhibition increases urine pH and decreases citrate excretion), acute angle-closure glaucoma (rare, acute onset — emergency), metabolic acidosis, teratogenicity (Category X — orofacial clefts: cleft lip/palate 10× baseline risk)",
        contra: "Pregnancy or women of reproductive age without reliable contraception (Category X teratogen — NTDs, orofacial clefts), nephrolithiasis history, metabolic acidosis, glaucoma, hepatic failure. Relative: cognitive-demanding occupations (pilots, air traffic controllers, students in demanding academic programs).",
        pearl: "Start 25 mg at bedtime (minimizes cognitive side effects), increase by 25 mg/week to target dose of 50–100 mg BID (200 mg/day max). Adequate trial: 2–3 months at therapeutic dose. The cognitive side effects are dose-dependent and usually improve after 4–6 weeks but are the most common reason for discontinuation. MUST counsel all reproductive-age women on reliable contraception — topiramate reduces efficacy of combined oral contraceptives (enzyme induction at doses > 200 mg). Weight loss averages 3–7% — makes topiramate a preferred choice for migraine patients with obesity. Ensure adequate hydration to reduce kidney stone risk. If stopping, taper over 1–2 weeks to avoid rebound seizures."
      }
    ],
    pearls: [
      "The most important concept in acute migraine treatment is EARLY intervention — treating within 30–60 minutes of headache onset (while pain is mild) significantly improves response to ALL acute medications. Once central sensitization develops (clinically manifested as cutaneous allodynia — pain from combing hair, wearing glasses, tight clothing), triptans become much less effective because the pain is maintained by central brainstem mechanisms rather than peripheral CGRP.",
      "Medication overuse headache (MOH) is the most common reason episodic migraine transforms into chronic migraine. It is also the most preventable and reversible cause. The NP should explicitly count acute medication days per month (including OTC) at every visit: > 10 days/month of triptan/opioid/combination analgesic use or > 15 days/month of simple analgesic use = MOH. Treatment requires structured withdrawal plus preventive initiation.",
      "Triptan 'chest tightness' occurs in 5–7% of patients and is almost always NON-cardiac (esophageal or skeletal muscle origin). However, it should prompt cardiovascular risk assessment before continued prescribing. For patients with cardiovascular disease or multiple risk factors, gepants (ubrogepant, rimegepant) and ditans (lasmiditan) provide effective alternatives WITHOUT vasoconstrictive properties.",
      "CGRP monoclonal antibodies (erenumab, fremanezumab, galcanezumab) represent a paradigm shift in migraine prevention — they are the first medications designed specifically for migraine pathophysiology (not repurposed from epilepsy, depression, or hypertension). They have minimal side effects, no titration required, monthly/quarterly dosing, and no drug interactions. Their main limitation is cost (~$600/month).",
      "For menstrual migraine (attacks occurring day -2 to +3 of menses in > 2 of 3 consecutive cycles), short-term mini-prophylaxis is effective: frovatriptan 2.5 mg BID or naproxen sodium 550 mg BID starting 2 days before expected menses through day 3. For women on combined OCs, continuous cycling (skipping placebo week) can prevent estrogen-withdrawal migraines."
    ],
    quiz: [
      {
        question: "A 32-year-old woman with episodic migraine currently treats attacks with sumatriptan 100 mg, which provides relief within 2 hours. She now reports using sumatriptan 12–15 days per month. She has no significant medical history. The NP's priority action is:",
        options: [
          "Increase sumatriptan dose to 200 mg per attack for better efficacy",
          "Diagnose medication overuse headache and initiate structured triptan withdrawal plus prophylactic medication",
          "Switch from sumatriptan to eletriptan for lower recurrence rate",
          "Add an NSAID to each triptan dose for combination therapy"
        ],
        correct: 1,
        rationale: "Triptan use > 10 days/month constitutes medication overuse headache (MOH). This is the most common cause of transformation from episodic to chronic migraine. Management requires: (1) structured withdrawal of the overused medication (may use bridge therapy with naproxen or steroids for the withdrawal period), (2) initiation of preventive medication (propranolol, topiramate, amitriptyline, or CGRP mAb), and (3) patient education about the medication overuse cycle. Increasing the triptan dose or switching triptans will perpetuate the problem."
      },
      {
        question: "A 58-year-old man with a history of prior MI and stable angina presents with moderate-to-severe migraine attacks 6 times per month. Which acute treatment is CONTRAINDICATED?",
        options: [
          "Ubrogepant 50 mg PO",
          "Sumatriptan 100 mg PO",
          "Naproxen sodium 500 mg PO",
          "Metoclopramide 10 mg IV in the ED"
        ],
        correct: 1,
        rationale: "ALL triptans are absolutely contraindicated in patients with coronary artery disease, prior MI, or Prinzmetal angina due to their 5-HT1B-mediated coronary vasoconstrictive properties. This patient with prior MI and stable angina cannot receive sumatriptan or any triptan. Ubrogepant (CGRP receptor antagonist) has NO vasoconstrictive properties and is safe in cardiovascular disease — this is a key advantage of gepants over triptans. NSAIDs and dopamine antagonists (metoclopramide) are also safe alternatives."
      },
      {
        question: "A patient on topiramate 100 mg BID for migraine prophylaxis reports she is planning to become pregnant in the next 3 months. The most appropriate action is:",
        options: [
          "Continue topiramate — it is safe in pregnancy with adequate folate supplementation",
          "Discontinue topiramate immediately and switch to a pregnancy-safe prophylactic",
          "Taper topiramate gradually over 2–4 weeks and switch to a pregnancy-safe prophylactic",
          "Reduce topiramate to 50 mg daily (minimum effective dose) during pregnancy"
        ],
        correct: 2,
        rationale: "Topiramate is Category X (absolutely contraindicated in pregnancy) — it causes a 10-fold increased risk of orofacial clefts (cleft lip/palate) and is associated with small-for-gestational-age infants. It must be discontinued BEFORE conception. However, abrupt discontinuation can cause rebound seizures (in patients using it for epilepsy) or rebound headaches. Taper over 2–4 weeks. Switch to pregnancy-safe prophylactics: propranolol (preferred — extensive safety data), magnesium 400 mg daily, or riboflavin 400 mg daily. CGRP mAbs should be discontinued at least 5 months before conception."
      },
      {
        question: "A patient presents with sudden-onset thunderclap headache reaching maximum intensity within 30 seconds. She has a history of migraine and says 'this feels different from my usual migraines.' The NP's priority is:",
        options: [
          "Administer sumatriptan 6 mg SC as she likely has a severe migraine variant",
          "Obtain STAT non-contrast CT head to rule out subarachnoid hemorrhage",
          "Prescribe a higher-potency triptan (eletriptan 40 mg) since her usual migraine treatment isn't working",
          "Start prophylactic medication since her migraines are clearly worsening"
        ],
        correct: 1,
        rationale: "Thunderclap headache (reaching peak intensity within seconds to 1 minute) is a RED FLAG that CANNOT be attributed to migraine without first excluding life-threatening causes, regardless of migraine history. Subarachnoid hemorrhage (SAH) must be excluded with STAT non-contrast CT head (sensitivity ~95% within 6 hours, declining after). If CT is negative, lumbar puncture with xanthochromia analysis is required (for the ~5% of SAH missed by CT). Other causes of thunderclap headache: cerebral venous sinus thrombosis, cervical artery dissection, pituitary apoplexy, reversible cerebral vasoconstriction syndrome (RCVS). NEVER give triptans for thunderclap headache — vasoconstrictive effects could worsen vasospasm."
      }
    ],
    preTest: [
      {
        question: "What is the most important neuropeptide mediator in migraine pathophysiology?",
        options: [
          "Substance P",
          "Calcitonin gene-related peptide (CGRP)",
          "Serotonin (5-HT)",
          "Glutamate"
        ],
        correct: 1,
        rationale: "CGRP is the key mediator in migraine pathophysiology. It is released from trigeminal nerve terminals during a migraine attack, causing meningeal vasodilation, mast cell degranulation, neurogenic inflammation, and sensitization of pain pathways. CGRP levels are elevated during migraine attacks and return to baseline with successful treatment. The success of CGRP-targeting therapies (gepants and anti-CGRP monoclonal antibodies) validates its central role."
      }
    ],
    postTest: [
      {
        question: "Which combination of findings should prompt the NP to recommend prophylactic migraine therapy?",
        options: [
          "2 migraine attacks per month with complete relief from OTC analgesics",
          "6 migraine days per month with MIDAS score of 16 and analgesic use 8 days/month",
          "1 migraine attack per month with typical visual aura lasting 20 minutes",
          "3 migraine attacks per month that resolve with sleep and dark room rest"
        ],
        correct: 1,
        rationale: "Prophylaxis indications: ≥ 4 migraine days/month (this patient has 6), significant disability (MIDAS ≥ 11 — this patient scores 16), failure or contraindication of acute therapy, medication overuse risk (approaching 10 days/month threshold at 8 days). The other patients have well-controlled, less frequent migraines that don't meet prophylaxis criteria. A single aura per month without significant disability doesn't require prophylaxis (though it may warrant workup if new-onset in older patients)."
      }
    ]
  },

  "type2-dm-pharmacotherapy-np": {
    title: "Type 2 Diabetes Pharmacotherapy: NP ADA Guidelines, SGLT2/GLP-1 Prescribing & Monitoring",
    cellular: {
      title: "Type 2 Diabetes Mellitus Pathophysiology",
      content: "Type 2 diabetes mellitus (T2DM) is a progressive metabolic disorder characterized by insulin resistance and relative insulin deficiency, resulting in chronic hyperglycemia. The pathophysiology involves DeFronzo's 'ominous octet' — eight pathological mechanisms: (1) Decreased insulin secretion from pancreatic β-cells: glucotoxicity and lipotoxicity cause progressive β-cell apoptosis via oxidative stress, ER stress, and amyloid deposition (IAPP — islet amyloid polypeptide); by the time of diagnosis, 50% of β-cell function is already lost, and β-cell decline continues at 4–5% per year regardless of treatment. (2) Increased hepatic glucose production: insulin resistance in hepatocytes fails to suppress gluconeogenesis and glycogenolysis, particularly overnight — this drives fasting hyperglycemia and is the target of metformin. (3) Decreased peripheral glucose uptake: insulin resistance in skeletal muscle impairs GLUT4 translocation to the cell membrane, reducing glucose uptake by 40–50% — skeletal muscle accounts for 80% of postprandial glucose disposal. (4) Increased lipolysis from adipocytes: insulin resistance fails to suppress hormone-sensitive lipase, releasing excess free fatty acids (FFAs) that cause lipotoxicity in β-cells, liver, and muscle (Randle cycle — FFAs compete with glucose for oxidation). (5) Impaired incretin effect: GLP-1 (glucagon-like peptide-1) and GIP (glucose-dependent insulinotropic polypeptide), released by intestinal L-cells and K-cells respectively, are responsible for 50–70% of postprandial insulin secretion in healthy individuals. In T2DM, GIP action is impaired and GLP-1 secretion is reduced — however, pharmacologic GLP-1 concentrations restore the incretin effect, which is the basis for GLP-1 receptor agonist therapy. (6) Increased glucagon secretion from pancreatic α-cells: paradoxical hyperglucagonemia in T2DM (loss of paracrine inhibition from failing β-cells) drives hepatic glucose output. (7) Increased renal glucose reabsorption: SGLT2 transporters in the proximal tubule reabsorb ~90% of filtered glucose; in T2DM, SGLT2 is upregulated, increasing the renal threshold for glucosuria and maintaining hyperglycemia — SGLT2 inhibitors block this transporter, causing therapeutic glucosuria. (8) CNS insulin resistance/neurotransmitter dysfunction: hypothalamic insulin signaling regulates appetite and hepatic glucose production; dysfunction contributes to obesity and metabolic syndrome."
    },
    riskFactors: [
      "Obesity: BMI ≥ 25 (≥ 23 in Asian Americans) — visceral adiposity releases pro-inflammatory cytokines (TNF-α, IL-6) and adipokines (resistin) that impair insulin receptor signaling via serine phosphorylation of IRS-1; 80% of T2DM patients are overweight or obese",
      "Family history: first-degree relative with T2DM confers 2–6× increased risk; concordance in monozygotic twins is 70–90% (vs 20–37% for T1DM), indicating strong genetic predisposition with over 100 identified susceptibility loci",
      "Ethnicity: African American, Hispanic/Latino, Native American, Asian American, Pacific Islander populations have 1.5–2× higher prevalence than non-Hispanic whites at equivalent BMI — likely due to genetic variants and environmental/socioeconomic factors",
      "Prediabetes: impaired fasting glucose (IFG: FPG 100–125 mg/dL), impaired glucose tolerance (IGT: 2-hour OGTT glucose 140–199 mg/dL), or A1c 5.7–6.4% — annual conversion rate to T2DM is 5–10%; lifestyle intervention reduces conversion by 58% (Diabetes Prevention Program)",
      "Gestational diabetes mellitus (GDM): 50% of women with GDM develop T2DM within 5–10 years postpartum; requires postpartum screening and annual follow-up",
      "Metabolic syndrome: central obesity + 2 or more of (elevated triglycerides ≥ 150, low HDL < 40 men / < 50 women, BP ≥ 130/85, fasting glucose ≥ 100)",
      "Polycystic ovary syndrome (PCOS): insulin resistance is a core pathophysiologic feature; 30–40% of women with PCOS develop T2DM or prediabetes by age 40",
      "Medications: corticosteroids (increase hepatic gluconeogenesis, impair glucose uptake), atypical antipsychotics (olanzapine, clozapine — insulin resistance and weight gain), thiazide diuretics, statins (modest increase in T2DM risk — 9–12% relative increase, but cardiovascular benefit far outweighs risk)"
    ],
    diagnostics: [
      "Diagnostic criteria (ANY of the following on TWO separate occasions unless symptomatic hyperglycemia or hyperglycemic crisis): fasting plasma glucose (FPG) ≥ 126 mg/dL (fasting = no caloric intake ≥ 8 hours); 2-hour plasma glucose ≥ 200 mg/dL during 75 g OGTT; HbA1c ≥ 6.5% (NGSP-certified method); random plasma glucose ≥ 200 mg/dL with classic symptoms (polyuria, polydipsia, polyphagia, weight loss) — does NOT require confirmation",
      "HbA1c: reflects average glucose over 2–3 months (lifespan of red blood cells); falsely LOW in: hemolytic anemia, recent blood loss/transfusion, sickle cell disease (HbS), pregnancy, EPO therapy; falsely HIGH in: iron deficiency anemia, chronic kidney disease, splenectomy, chronic alcoholism. When A1c is unreliable, use FPG or OGTT.",
      "Prediabetes screening (ADA guidelines): all adults ≥ 35 years regardless of weight; adults < 35 with BMI ≥ 25 (≥ 23 in Asian Americans) plus any risk factor (physical inactivity, first-degree relative with T2DM, high-risk ethnicity, GDM history, hypertension, HDL < 35 or TG > 250, PCOS, A1c ≥ 5.7% previously); women with GDM: screen at 4–12 weeks postpartum and every 1–3 years lifelong",
      "Comprehensive metabolic workup at diagnosis: A1c, fasting lipid panel (elevated LDL and TG with low HDL is typical of diabetic dyslipidemia), CMP (renal function for medication selection — eGFR affects metformin, SGLT2i dosing), urinalysis and urine albumin-to-creatinine ratio (UACR — screen for diabetic nephropathy), LFTs, TSH (autoimmune thyroid disease comorbidity)",
      "Cardiovascular risk assessment: 10-year ASCVD risk calculator; most T2DM patients ≥ 40 years should receive statin therapy regardless of calculated risk (ADA/AHA guidelines); obtain baseline ECG; assess for established ASCVD (prior MI, stroke, PAD, coronary revascularization) — dictates medication selection (SGLT2i and GLP-1 RA have cardiovascular mortality benefit)",
      "Annual monitoring: A1c every 3–6 months (quarterly if not at goal, biannually if stable); annual dilated eye exam (diabetic retinopathy screening); annual foot exam (monofilament testing, pedal pulse palpation, visual inspection); annual UACR and eGFR (diabetic kidney disease); dental exam biannually",
      "Continuous glucose monitoring (CGM): time in range (TIR: 70–180 mg/dL) ≥ 70% correlates with A1c < 7%; glucose management indicator (GMI) from CGM data provides real-time A1c estimate; ambulatory glucose profile (AGP) shows glycemic variability, time below range (< 70 mg/dL = hypoglycemia), and overnight patterns"
    ],
    management: [
      "ADA/EASD 2022 consensus: INDIVIDUALIZE A1c target based on patient factors — GENERAL target: < 7% (most adults); LESS STRINGENT: < 8% (elderly, limited life expectancy, extensive comorbidities, hypoglycemia risk, long diabetes duration with established vascular disease); MORE STRINGENT: < 6.5% (younger patients, short duration, no significant CVD, without hypoglycemia risk, pregnancy planning)",
      "FIRST-LINE: Metformin 500 mg PO daily with food → titrate to 1000 mg BID over 2–4 weeks (reduces GI side effects). Mechanism: decreases hepatic glucose production (activates AMPK → suppresses gluconeogenesis), improves insulin sensitivity in skeletal muscle, reduces intestinal glucose absorption. A1c reduction: 1.0–1.5%. Weight neutral. No hypoglycemia as monotherapy. Contraindication: eGFR < 30 (stop), eGFR 30–45 (reduce dose, do not initiate), lactic acidosis risk (hold for 48 hours around iodinated contrast). Side effects: GI (diarrhea, nausea, metallic taste — dose-dependent, improve with ER formulation), B12 deficiency (check annually if on long-term therapy).",
      "SECOND-LINE selection based on clinical priorities — (1) ESTABLISHED ASCVD or HIGH CV RISK: Add GLP-1 RA with proven CV benefit (liraglutide, semaglutide, dulaglutide) OR SGLT2 inhibitor with proven CV benefit (empagliflozin, canagliflozin, dapagliflozin) REGARDLESS of A1c — these medications reduce MACE independent of glucose lowering. (2) HEART FAILURE (HFrEF or HFpEF): Add SGLT2 inhibitor (empagliflozin, dapagliflozin — both have class I heart failure indication). (3) CHRONIC KIDNEY DISEASE (UACR > 200 or eGFR 25–60): Add SGLT2 inhibitor (proven nephroprotective: reduces albuminuria progression and eGFR decline). (4) WEIGHT MANAGEMENT PRIORITY: Add GLP-1 RA (semaglutide: 5–15% weight loss) or tirzepatide (GIP/GLP-1 dual agonist: 15–20% weight loss).",
      "SGLT2 INHIBITORS (empagliflozin, dapagliflozin, canagliflozin): Mechanism: block SGLT2 in proximal tubule → glycosuria (70–80 g glucose/day excreted = 280–320 kcal/day). A1c reduction: 0.5–0.8%. Weight loss: 2–4 kg. BP reduction: 3–5/2 mmHg (natriuresis/osmotic diuresis). CARDIORENAL BENEFITS: reduced MACE (EMPA-REG, CANVAS), reduced HF hospitalization (EMPEROR-Reduced/Preserved, DAPA-HF), reduced CKD progression (CREDENCE, DAPA-CKD). Initiate if eGFR ≥ 20 (though glycemic efficacy decreases below eGFR 45, cardiorenal benefits persist). Side effects: genital mycotic infections (10–15% women, 5% men), UTI, volume depletion/orthostatic hypotension, euglycemic DKA (rare — risk higher with insulin-deficient states, surgery, prolonged fasting).",
      "GLP-1 RECEPTOR AGONISTS (semaglutide, liraglutide, dulaglutide, exenatide): Mechanism: activate GLP-1 receptors → glucose-dependent insulin secretion (no hypoglycemia risk as monotherapy), suppress glucagon, slow gastric emptying (satiety), central appetite suppression. A1c reduction: 1.0–1.8%. Weight loss: semaglutide 1 mg weekly = 5–7 kg (SUSTAIN trials); semaglutide 2.4 mg weekly for obesity = 15% body weight loss (STEP trials). CV benefits: reduced MACE (LEADER — liraglutide, SUSTAIN-6 — semaglutide, REWIND — dulaglutide). Oral semaglutide (Rybelsus): 3 mg → 7 mg → 14 mg PO daily on empty stomach with ≤ 4 oz water, 30 minutes before food. Side effects: GI (nausea, vomiting, diarrhea — dose-dependent, usually improves over 4–8 weeks with slow titration), pancreatitis (rare — monitor for severe abdominal pain), cholelithiasis (weight loss-related), thyroid C-cell tumors (animal studies only — FDA boxed warning; contraindicated in personal/family history of MTC or MEN2).",
      "TIRZEPATIDE (Mounjaro): Dual GIP/GLP-1 receptor agonist — first-in-class. A1c reduction: up to 2.3% (SURPASS trials — most potent glucose-lowering injectable available). Weight loss: up to 20% body weight (SURMOUNT-1). Dose: 2.5 mg SC weekly → titrate every 4 weeks → max 15 mg weekly. Same GI side effects and contraindications as GLP-1 RAs. Likely to become a dominant agent given dual mechanism and superior efficacy.",
      "INSULIN THERAPY: Consider if: A1c > 10%, symptoms of hyperglycemia (polyuria, polydipsia, weight loss), or inadequate control despite oral/injectable non-insulin therapy. Basal insulin: insulin glargine (Lantus — 24h duration, daily injection) or insulin degludec (Tresiba — 42h duration, flexible timing). Starting dose: 10 units/day or 0.1–0.2 units/kg/day. Titrate by 2–4 units every 3 days to fasting glucose target (80–130 mg/dL). If basal insulin > 0.5 units/kg/day without A1c goal, add prandial insulin (insulin lispro or aspart before largest meal) or GLP-1 RA (preferred over prandial insulin — less hypoglycemia, weight loss vs gain).",
      "DEPRESCRIBING/SIMPLIFICATION: Review medications annually. Consider deprescribing sulfonylureas (hypoglycemia risk, weight gain, no CV benefit) when SGLT2i or GLP-1 RA is added. If on basal-bolus insulin and adding GLP-1 RA, reduce basal insulin by 20% to prevent hypoglycemia. If A1c is significantly below target (< 6.5%) in elderly patients on sulfonylureas or insulin, reduce doses to prevent hypoglycemia-related falls and fractures."
    ],
    nursingActions: [
      "Comprehensive diabetes assessment: current A1c and trend, current medications with doses and adherence assessment, home glucose monitoring frequency and results (or CGM data review), hypoglycemia frequency and awareness, dietary habits (carbohydrate counting ability, meal consistency), physical activity level, tobacco/alcohol use, depression screening (PHQ-9 — depression prevalence 2× higher in diabetes), foot exam, dilated eye exam referral status",
      "GLP-1 RA injection training: SC injection technique in abdomen, thigh, or upper arm; rotation of injection sites; pen storage (refrigerated until first use, then room temperature for 28–56 days depending on product); dose titration schedule (start low, increase every 4 weeks); manage expectations for GI side effects (nausea is dose-dependent, usually improves over 4–8 weeks — eat smaller meals, avoid high-fat foods, stay hydrated)",
      "SGLT2 inhibitor counseling: genital hygiene education (increased risk of candidal infections — maintain hygiene, report symptoms promptly), hydration counseling (osmotic diuresis can cause volume depletion — ensure adequate fluid intake, especially in elderly or those on diuretics), sick day rules (HOLD SGLT2i during acute illness, surgery, or prolonged fasting to prevent euglycemic DKA), symptoms of DKA to report (nausea, vomiting, abdominal pain, fatigue, rapid breathing — check ketones even if glucose is normal)",
      "Metformin patient education: take with meals to reduce GI side effects; ER formulation if standard-release intolerable; annual B12 screening; hold 48 hours before and after iodinated contrast; resume when renal function is confirmed stable",
      "Hypoglycemia management education: symptoms (tremor, sweating, tachycardia, confusion, dizziness); treatment: 15-15 rule (15 g fast-acting carbohydrate — 4 oz juice, 3–4 glucose tablets; recheck in 15 minutes; repeat if < 70); glucagon emergency kit teaching for patients on insulin or sulfonylureas — injectable (1 mg IM) or nasal (3 mg intranasal)",
      "Annual comprehensive diabetes care checklist: A1c (q3–6 months), lipid panel (annual), UACR and eGFR (annual), dilated eye exam (annual), comprehensive foot exam (annual), dental exam (biannual), flu vaccine (annual), pneumococcal vaccine (once ≥ 65 or immunocompromised), hepatitis B vaccine (19–59 years unvaccinated), COVID-19 vaccination, depression screening",
      "Cardiovascular risk factor management: statin therapy for most patients ≥ 40 years (high-intensity if ASCVD present); BP target < 130/80 mmHg (ACE inhibitor or ARB preferred — renoprotective); aspirin 81 mg for secondary prevention; smoking cessation counseling",
      "Referral coordination: diabetes self-management education and support (DSMES — covered by Medicare and most insurers), medical nutrition therapy (MNT — 3–4 visits with RD), ophthalmology for dilated eye exam, podiatry for comprehensive foot care (if neuropathy or PAD), endocrinology if complex insulin management or suspected T1DM/LADA"
    ],
    signs: {
      left: [
        "Well-controlled T2DM: A1c at individualized target, stable weight, no hypoglycemia, annual screening up to date, cardiovascular risk factors managed — continue current regimen with annual reassessment",
        "Early T2DM (A1c < 8%) without ASCVD/HF/CKD: metformin monotherapy adequate — focus on lifestyle (5–7% weight loss, 150 min/week moderate activity, Mediterranean or DASH dietary pattern)",
        "Prediabetes (A1c 5.7–6.4%): intensive lifestyle intervention reduces conversion by 58% (Diabetes Prevention Program); consider metformin if BMI ≥ 35, age < 60, or history of GDM",
        "Glycemic variability improving on CGM: TIR > 70%, time below range < 4%, coefficient of variation < 36% — good glycemic stability"
      ],
      right: [
        "T2DM with established ASCVD: MUST be on SGLT2i or GLP-1 RA with proven CV benefit regardless of A1c — these medications reduce MACE and cardiovascular mortality independent of glucose lowering",
        "T2DM with HFrEF or HFpEF: SGLT2 inhibitor is mandatory (Class I indication) — empagliflozin or dapagliflozin reduce HF hospitalization and cardiovascular death even in non-diabetic heart failure; do not delay initiation",
        "T2DM with CKD (UACR > 200 or eGFR 25–60): SGLT2 inhibitor provides nephroprotection independent of glycemic control — reduces albuminuria progression, eGFR decline, and ESKD; ACEi or ARB should already be in place",
        "Hyperglycemic emergency (DKA or HHS): ICU admission, continuous insulin infusion, aggressive IV fluid resuscitation, electrolyte monitoring q2h, identify and treat precipitant (infection, MI, medication noncompliance, new-onset T1DM)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Activates AMP-activated protein kinase (AMPK) in hepatocytes, suppressing mitochondrial complex I and reducing hepatic glucose production (gluconeogenesis is the primary target). Also improves peripheral insulin sensitivity in skeletal muscle (enhances GLUT4 translocation), reduces intestinal glucose absorption, and modulates the gut microbiome (may contribute to GI side effects and metabolic benefits). Does NOT stimulate insulin secretion — no hypoglycemia risk as monotherapy.",
        sideEffects: "GI: diarrhea, nausea, abdominal discomfort, metallic taste (30–50% of patients — dose-dependent, improves with slow titration and ER formulation). Lactic acidosis: extremely rare (< 1 per 100,000 patient-years) — previously overemphasized; occurs only with renal impairment, tissue hypoxia, or hepatic failure. Vitamin B12 deficiency: 5–10% with long-term use (reduced ileal absorption — check annually, supplement if deficient).",
        contra: "eGFR < 30 mL/min (contraindicated — lactic acidosis risk from metformin accumulation); eGFR 30–45 (reduce dose to 500–1000 mg/day, do not initiate); acute or chronic metabolic acidosis; hold 48 hours before and after iodinated contrast or surgery; alcoholism with binge drinking (impairs hepatic lactate clearance); hepatic decompensation",
        pearl: "Start 500 mg daily with dinner → increase by 500 mg weekly to target 1000 mg BID (max 2550 mg/day). Extended-release (ER) formulation reduces GI side effects significantly — should be offered to all patients who cannot tolerate standard-release. Metformin is weight-neutral (slight weight loss of 1–2 kg in some patients) — advantageous compared to sulfonylureas and insulin (which cause weight gain). Check B12 level annually, especially if neuropathy symptoms are present (can mimic diabetic neuropathy). Important: metformin is no longer the 'mandatory first agent' per ADA 2022 — patients with ASCVD, HF, or CKD should START with SGLT2i or GLP-1 RA regardless of A1c, with metformin as add-on."
      },
      {
        name: "Empagliflozin (Jardiance)",
        type: "SGLT2 Inhibitor (Gliflozin)",
        action: "Selectively inhibits sodium-glucose cotransporter 2 (SGLT2) in the proximal renal tubule, blocking reabsorption of approximately 90% of filtered glucose. Causes therapeutic glucosuria (70–80 g glucose/day = 280–320 kcal/day caloric loss). Glucose-lowering is insulin-independent. Additional cardiorenal mechanisms: natriuresis and osmotic diuresis (preload reduction → improved cardiac hemodynamics), decreased intraglomerular pressure (afferent arteriolar vasoconstriction restores tubuloglomerular feedback), ketone body shift (β-hydroxybutyrate as more efficient cardiac fuel), anti-inflammatory and antifibrotic effects.",
        sideEffects: "Genital mycotic infections: vulvovaginal candidiasis in women (10–15%), balanitis in men (5%) — treat with topical antifungals, counsel on hygiene. UTI: modest increase. Volume depletion/orthostatic hypotension: especially in elderly, patients on diuretics — reduce diuretic dose when initiating. Euglycemic DKA: rare (< 1%) — higher risk during fasting, surgery, acute illness, or in insulin-deficient patients; present with DKA symptoms (nausea, vomiting, Kussmaul breathing) with normal or mildly elevated glucose. Fournier's gangrene: extremely rare necrotizing fasciitis of the perineum (FDA warning).",
        contra: "Type 1 diabetes (increased DKA risk — not FDA-approved), eGFR < 20 (no glycemic benefit; however, cardiorenal benefits of dapagliflozin continue to eGFR 15), dialysis, recurrent severe UTIs or genital infections, history of DKA, pregnancy/breastfeeding",
        pearl: "10 mg or 25 mg PO daily (once daily, any time of day, with or without food). LANDMARK TRIALS: EMPA-REG OUTCOME (empagliflozin): 14% MACE reduction, 38% CV death reduction in T2DM with ASCVD. EMPEROR-Reduced/Preserved: reduced HF hospitalization in HFrEF AND HFpEF (with or without T2DM). SICK DAY RULES: HOLD SGLT2i during: acute illness (dehydration, infection), 3–4 days before planned surgery, prolonged fasting, excessive alcohol intake. If patient develops nausea/vomiting/malaise, check blood or urine ketones EVEN IF GLUCOSE IS NORMAL — euglycemic DKA is the diagnostic trap. Restart when eating and drinking normally."
      },
      {
        name: "Semaglutide (Ozempic SC, Rybelsus PO, Wegovy SC)",
        type: "GLP-1 Receptor Agonist",
        action: "Long-acting GLP-1 receptor agonist (94% amino acid homology with native GLP-1). Glucose-dependent insulin secretion (stimulates β-cell insulin release ONLY when glucose is elevated — minimal hypoglycemia risk), suppresses glucagon secretion (reducing hepatic glucose output), slows gastric emptying (enhances satiety, reduces postprandial glucose excursion), central appetite suppression (hypothalamic GLP-1 receptor activation reduces caloric intake by 20–30%).",
        sideEffects: "GI: nausea (most common, 15–20%), vomiting, diarrhea, constipation — dose-dependent, usually improves over 4–8 weeks; slow titration essential (increase every 4 weeks). Pancreatitis: rare but serious — discontinue if severe abdominal pain; caution in prior pancreatitis history. Cholelithiasis: 1–3% (rapid weight loss-related bile stasis). Injection site reactions. FDA Boxed Warning: thyroid C-cell tumors in rodents (not confirmed in humans — 15+ years of market data); contraindicated in personal/family history of MTC or MEN 2A/2B.",
        contra: "Personal or family history of medullary thyroid carcinoma (MTC) or MEN 2A/2B syndrome (FDA boxed warning), prior serious hypersensitivity to semaglutide, history of pancreatitis (relative — use caution), pregnancy (embryotoxic in animal studies — discontinue ≥ 2 months before planned conception)",
        pearl: "Injectable (Ozempic): 0.25 mg SC weekly × 4 weeks → 0.5 mg × 4 weeks → 1 mg weekly (max 2 mg weekly). Oral (Rybelsus): 3 mg daily × 30 days → 7 mg daily → 14 mg daily; take on EMPTY STOMACH with ≤ 4 oz water, 30 minutes before any food/drink/medication (bioavailability is only 0.4–1% — food drastically reduces absorption). Wegovy (2.4 mg weekly) is the obesity-indication formulation. SUSTAIN-6 trial: 26% reduction in MACE vs placebo. SELECT trial (semaglutide 2.4 mg): 20% MACE reduction in overweight/obese patients WITHOUT diabetes — the first obesity medication to show cardiovascular event reduction. Combination with SGLT2i is synergistic and guideline-recommended for T2DM with ASCVD and CKD. Avoid combining with DPP-4 inhibitors (redundant incretin mechanism; no added benefit)."
      }
    ],
    pearls: [
      "The most important paradigm shift in T2DM management: medication selection is no longer 'A1c-centric' — it is 'COMPLICATION-centric.' If a patient has ASCVD, the NP should prescribe a GLP-1 RA or SGLT2i with proven cardiovascular benefit regardless of A1c level. If a patient has heart failure, SGLT2i is mandatory (Class I indication). If CKD, SGLT2i provides nephroprotection. Metformin is no longer the mandatory first drug — cardiorenal-protective agents take priority.",
      "DPP-4 inhibitors (sitagliptin, saxagliptin, linagliptin) are being displaced in clinical practice by GLP-1 RAs — they share the incretin mechanism but GLP-1 RAs are far more potent (A1c reduction: DPP-4i 0.5–0.8% vs GLP-1 RA 1.0–1.8%), provide weight loss (vs weight neutral), and have proven cardiovascular benefit (vs cardiovascular neutrality). DPP-4i should NOT be combined with GLP-1 RA (redundant mechanism, no added benefit).",
      "Sulfonylureas (glipizide, glyburide, glimepiride) are being deprescribed in favor of SGLT2i and GLP-1 RA because they cause hypoglycemia (especially glyburide — avoid in elderly and CKD), weight gain (2–5 kg), and have NO cardiovascular benefit. If a sulfonylurea is already prescribed, consider switching when adding cardiorenal-protective agents.",
      "Euglycemic DKA from SGLT2 inhibitors is the most important safety pitfall NPs must recognize — patients present with DKA symptoms (nausea, vomiting, Kussmaul breathing, metabolic acidosis) but NORMAL or only mildly elevated blood glucose (< 250 mg/dL). The SGLT2i promotes ketogenesis while preventing the usual glucosuria-driven hyperglycemia. Always check ketones (blood or urine) in an SGLT2i patient who is ill, regardless of glucose level. Implement SICK DAY RULES: hold SGLT2i during acute illness, before surgery, during fasting.",
      "Tirzepatide (GIP/GLP-1 dual agonist) is emerging as the most potent glucose-lowering and weight-reducing injectable, with A1c reductions up to 2.3% and weight loss up to 20% body weight. Its dual incretin mechanism (GIP + GLP-1) provides additive β-cell stimulation and superior appetite suppression. It will likely become a first-line injectable for T2DM with obesity pending long-term cardiovascular outcomes data (SURPASS-CVOT is ongoing)."
    ],
    quiz: [
      {
        question: "A 62-year-old man with T2DM (A1c 7.8%) on metformin 1000 mg BID has established ASCVD (prior MI 2 years ago). His eGFR is 65 mL/min and UACR is 350 mg/g. Which medication addition provides the most comprehensive cardiorenal benefit?",
        options: [
          "Sitagliptin 100 mg daily for glycemic control with low hypoglycemia risk",
          "Glipizide 5 mg BID for robust A1c reduction",
          "Empagliflozin 10 mg daily for cardiovascular and renal protection",
          "Pioglitazone 30 mg daily for insulin sensitization"
        ],
        correct: 2,
        rationale: "This patient has THREE compelling indications for SGLT2 inhibitor therapy: (1) established ASCVD (prior MI — empagliflozin reduces MACE and cardiovascular death per EMPA-REG), (2) CKD with albuminuria (UACR 350 — SGLT2i slows albuminuria progression and eGFR decline), and (3) heart failure risk reduction. Empagliflozin provides glycemic control PLUS organ-protective benefits that are independent of glucose lowering. Sitagliptin (DPP-4i) is cardiovascular-neutral. Glipizide causes hypoglycemia and has no CV benefit. Pioglitazone causes fluid retention (dangerous in heart failure risk) and weight gain."
      },
      {
        question: "A patient on empagliflozin 25 mg daily presents to the ED with nausea, vomiting, abdominal pain, and rapid breathing. Point-of-care glucose is 165 mg/dL. ABG shows pH 7.18, bicarbonate 10 mEq/L. The NP should suspect:",
        options: [
          "Gastroenteritis with mild dehydration — administer IV fluids and antiemetics",
          "Euglycemic diabetic ketoacidosis — check serum ketones and start insulin infusion",
          "Lactic acidosis from metformin — discontinue metformin and start hemodialysis",
          "Acute pancreatitis — obtain lipase and CT abdomen"
        ],
        correct: 1,
        rationale: "This is classic euglycemic DKA from SGLT2 inhibitor use: metabolic acidosis (pH 7.18, bicarb 10) with only mildly elevated glucose (165 mg/dL — not the typical > 250 seen in traditional DKA). The SGLT2i promotes ketogenesis while simultaneously causing glucosuria that prevents marked hyperglycemia. Treatment: discontinue SGLT2i immediately, check serum β-hydroxybutyrate (will be markedly elevated), start continuous insulin infusion and D5-containing IV fluids (to allow insulin administration without worsening hypoglycemia), aggressive electrolyte monitoring. This is the key safety pitfall of SGLT2i therapy."
      },
      {
        question: "A 55-year-old woman with T2DM (A1c 9.2%), BMI 38, and hypertension asks about semaglutide. She takes oral semaglutide (Rybelsus) 3 mg daily and reports taking it with her breakfast and morning coffee. After 6 weeks, her A1c has only decreased to 8.9%. The most likely cause of suboptimal response is:",
        options: [
          "The dose is too low — she should be on at least 14 mg daily",
          "Oral semaglutide requires fasting administration with ≤ 4 oz water 30 minutes before food",
          "She needs to switch from oral to injectable semaglutide for adequate absorption",
          "Semaglutide is ineffective at A1c levels > 9%"
        ],
        correct: 1,
        rationale: "Oral semaglutide has very specific absorption requirements that are critical for efficacy: it must be taken on an EMPTY STOMACH with ≤ 4 oz (120 mL) of plain water, and the patient must wait 30 minutes before eating, drinking, or taking any other medications. Food drastically reduces bioavailability (already only 0.4–1% under optimal conditions). Taking it with breakfast and coffee explains the suboptimal response. While the dose will eventually need to be titrated (3 mg → 7 mg → 14 mg), correcting the administration error should be addressed first."
      },
      {
        question: "According to the ADA 2022 Standards of Care, which patient with newly diagnosed T2DM should receive an SGLT2 inhibitor or GLP-1 RA as INITIAL therapy (before or concurrent with metformin)?",
        options: [
          "A 45-year-old with A1c 7.5%, BMI 32, and no cardiovascular disease",
          "A 60-year-old with A1c 7.2%, prior stroke, and eGFR 55 with UACR 280",
          "A 35-year-old with A1c 6.8% and family history of diabetes",
          "A 50-year-old with A1c 8.0%, BMI 28, and prediabetes in a first-degree relative"
        ],
        correct: 1,
        rationale: "The ADA 2022 paradigm shift: in patients with established ASCVD (prior stroke), heart failure, or CKD (eGFR < 60 and/or UACR > 200), SGLT2i or GLP-1 RA with proven organ-protective benefits should be initiated as first-line therapy REGARDLESS of A1c and REGARDLESS of whether metformin is already in use. This patient has prior stroke (ASCVD) AND CKD with albuminuria — two compelling indications. Metformin can be added concurrently but is no longer mandatory as the first drug in these high-risk patients."
      },
      {
        question: "An NP is reviewing the medication list of a 70-year-old with T2DM and A1c 6.2% on glyburide 10 mg BID and metformin 1000 mg BID. He reports two hypoglycemic episodes requiring assistance last month. The most appropriate action is:",
        options: [
          "Continue current regimen — A1c 6.2% is an excellent result",
          "Discontinue glyburide (deprescribe) — the A1c target for this patient should be < 8%, and glyburide is causing dangerous hypoglycemia",
          "Add a bedtime snack to prevent nocturnal hypoglycemia",
          "Switch from glyburide to glipizide, which has less hypoglycemia risk"
        ],
        correct: 1,
        rationale: "This 70-year-old is OVERTREATED: his A1c of 6.2% is well below the recommended target of < 8% for elderly patients with hypoglycemia risk. Glyburide is the worst sulfonylurea choice in the elderly (long-acting active metabolites, highest hypoglycemia risk — should be avoided in patients > 65 and in CKD). Two episodes of severe hypoglycemia requiring assistance is dangerous (falls, fractures, cognitive impairment, cardiac events). The correct action is to deprescribe glyburide entirely (not switch to another sulfonylurea) and relax the A1c target. If glycemic control worsens to > 8%, consider SGLT2i or GLP-1 RA which don't cause hypoglycemia."
      }
    ],
    preTest: [
      {
        question: "Which mechanism of action is unique to SGLT2 inhibitors among diabetes medications?",
        options: [
          "Stimulating insulin secretion from pancreatic beta cells",
          "Blocking renal glucose reabsorption to cause therapeutic glucosuria",
          "Enhancing peripheral insulin sensitivity in skeletal muscle",
          "Inhibiting hepatic gluconeogenesis"
        ],
        correct: 1,
        rationale: "SGLT2 inhibitors work by blocking the sodium-glucose cotransporter 2 in the proximal renal tubule, preventing reabsorption of ~90% of filtered glucose. This causes therapeutic glucosuria (70–80 g glucose/day excreted in urine), lowering blood glucose through an insulin-independent mechanism. No other diabetes drug class uses this renal mechanism."
      },
      {
        question: "What is the primary reason GLP-1 receptor agonists have minimal hypoglycemia risk as monotherapy?",
        options: [
          "They do not affect insulin secretion",
          "Their insulin-stimulating effect is glucose-dependent — it only works when glucose is elevated",
          "They primarily act by reducing appetite and food intake",
          "They are only administered once weekly, limiting continuous drug exposure"
        ],
        correct: 1,
        rationale: "GLP-1 receptor agonists stimulate insulin secretion in a glucose-dependent manner — the incretin effect requires elevated blood glucose to trigger insulin release from beta cells. When glucose is normal or low, the GLP-1 signal does not stimulate insulin secretion, which is why GLP-1 RAs have minimal hypoglycemia risk as monotherapy (unlike sulfonylureas, which stimulate insulin regardless of glucose level)."
      }
    ],
    postTest: [
      {
        question: "A 58-year-old woman with T2DM, A1c 8.5%, HFpEF (EF 55%), and eGFR 35 is on metformin 500 mg BID (reduced dose for CKD). Which medication addition addresses all of her comorbidities?",
        options: [
          "Pioglitazone 30 mg daily for insulin sensitization",
          "Dapagliflozin 10 mg daily for glycemic, cardiac, and renal benefit",
          "Insulin glargine 20 units daily for glycemic control",
          "Glimepiride 4 mg daily for robust A1c reduction"
        ],
        correct: 1,
        rationale: "Dapagliflozin addresses ALL three comorbidities: (1) T2DM glycemic control (A1c reduction 0.5–0.8%), (2) HFpEF (DELIVER trial — dapagliflozin reduces HF hospitalization and cardiovascular death in HFpEF, with or without diabetes; Class I indication), and (3) CKD protection (DAPA-CKD — reduces eGFR decline and progression to ESKD; can be initiated at eGFR ≥ 20 for cardiorenal benefits even though glycemic efficacy diminishes below eGFR 45). Pioglitazone is contraindicated in heart failure (fluid retention). Insulin and glimepiride cause weight gain and hypoglycemia without cardiorenal benefits."
      }
    ]
  }
};
