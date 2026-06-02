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
  "narcolepsy-rpn": {
    title: "Narcolepsy for Practical Nurses",
    cellular: {
      title: "Neurobiology of Narcolepsy and Orexin Deficiency",
      content: "Narcolepsy is a chronic neurological disorder of sleep-wake regulation caused by the loss of orexin-producing (hypocretin-producing) neurons in the lateral hypothalamus. Orexin is a neuropeptide that plays a critical role in maintaining wakefulness and regulating transitions between sleep and wake states. In narcolepsy type 1 (formerly narcolepsy with cataplexy), approximately 90% of orexin-producing neurons are destroyed, most likely through an autoimmune process. This results in profoundly low or undetectable cerebrospinal fluid (CSF) orexin levels (less than 110 pg/mL). Narcolepsy type 2 (without cataplexy) may involve partial orexin loss or dysfunction without complete neuronal destruction.\n\nNormal sleep architecture follows a predictable pattern: wakefulness transitions to non-rapid eye movement (NREM) sleep through stages N1, N2, and N3, followed by rapid eye movement (REM) sleep approximately 90 minutes after sleep onset. In narcolepsy, the loss of orexin destabilizes the boundaries between wake and sleep states, causing the brain to transition rapidly and inappropriately into REM sleep. This explains the hallmark features of narcolepsy: patients may enter REM sleep within minutes of falling asleep (sleep-onset REM periods, or SOREMPs), and elements of REM sleep intrude into wakefulness.\n\nCataplexy, the most specific symptom of narcolepsy type 1, occurs when the muscle atonia normally restricted to REM sleep intrudes into wakefulness. Strong emotions (laughter, surprise, anger) trigger sudden bilateral loss of voluntary muscle tone while consciousness is preserved. Episodes may be partial (jaw dropping, head bobbing, knee buckling) or complete (full body collapse). Cataplexy is pathognomonic for narcolepsy type 1.\n\nSleep paralysis occurs when the REM-associated muscle atonia persists into the transition between sleep and wakefulness. The patient is conscious but temporarily unable to move or speak, lasting seconds to minutes. Hypnagogic hallucinations (occurring at sleep onset) and hypnopompic hallucinations (occurring upon awakening) represent REM dream imagery intruding into the waking state. These vivid, often frightening, visual or auditory experiences occur because the dreaming component of REM activates while the patient is partially awake.\n\nExcessive daytime sleepiness (EDS) is the universal and usually first symptom of narcolepsy. Patients experience an irresistible urge to sleep that occurs in waves, often at inappropriate times (during conversation, meals, or driving). Brief naps (10 to 20 minutes) are typically refreshing, distinguishing narcolepsy from other causes of hypersomnia. Automatic behaviors may occur when patients continue routine activities (writing, driving, eating) during microsleep episodes without conscious awareness, creating significant safety hazards.\n\nThe autoimmune hypothesis for narcolepsy type 1 is supported by its strong association with HLA-DQB1*06:02 (present in over 98% of narcolepsy type 1 patients compared to 25% of the general population), seasonal onset patterns following H1N1 influenza or streptococcal infections, and the selective destruction of orexin neurons with preservation of neighboring hypothalamic cells. The practical nurse must understand that narcolepsy is a lifelong condition requiring ongoing medication management, safety planning, and psychosocial support."
    },
    riskFactors: [
      "Genetic predisposition (HLA-DQB1*06:02 allele present in over 98% of narcolepsy type 1 patients)",
      "Family history of narcolepsy (10 to 40 times higher risk in first-degree relatives)",
      "Autoimmune triggers including H1N1 influenza infection and streptococcal pharyngitis",
      "Age of onset typically between 10 and 30 years (bimodal peak at 15 and 35 years)",
      "History of H1N1 vaccination with AS03 adjuvant (Pandemrix) in European studies",
      "Traumatic brain injury affecting the hypothalamus",
      "Other autoimmune conditions (multiple sclerosis, type 1 diabetes, thyroid disease)"
    ],
    diagnostics: [
      "Nocturnal polysomnography (PSG): overnight sleep study to rule out other sleep disorders (obstructive sleep apnea, periodic limb movements); documents baseline sleep architecture and identifies SOREMPs",
      "Multiple Sleep Latency Test (MSLT): performed the day after PSG; patient takes 5 scheduled nap opportunities at 2-hour intervals; positive if mean sleep latency is 8 minutes or less with 2 or more SOREMPs",
      "CSF orexin (hypocretin-1) level: low or undetectable levels (less than 110 pg/mL) are diagnostic for narcolepsy type 1; obtained via lumbar puncture when MSLT results are equivocal",
      "Epworth Sleepiness Scale (ESS): validated subjective questionnaire measuring daytime sleepiness; scores above 10 indicate excessive sleepiness; useful for tracking treatment response",
      "HLA typing: HLA-DQB1*06:02 supports diagnosis but is not diagnostic alone (present in 25% of general population); absence makes narcolepsy type 1 very unlikely",
      "Sleep diary: 2-week sleep log documenting sleep-wake patterns, nap times, and symptom frequency to establish baseline and rule out insufficient sleep syndrome"
    ],
    management: [
      "Administer wake-promoting medications as prescribed at consistent times; modafinil is typically given in the morning and may require a second dose at noon",
      "Implement scheduled nap strategy: two to three brief planned naps (15 to 20 minutes) during the day to reduce sleep pressure and minimize unplanned sleep attacks",
      "Maintain strict sleep hygiene: consistent bedtime and wake time (including weekends), cool dark room, avoidance of caffeine after noon, and regular exercise (not within 3 hours of bedtime)",
      "Implement safety precautions: no driving during periods of excessive sleepiness, avoid operating heavy machinery, remove hazards from environment to prevent injury during cataplexy episodes",
      "Coordinate with interdisciplinary team for psychological support: narcolepsy is associated with depression, social isolation, and academic or occupational difficulties",
      "Educate patient about medication interactions: avoid alcohol and sedating medications that worsen daytime sleepiness",
      "Report changes in symptom frequency or severity, medication side effects, and new onset of cataplexy episodes to the supervising nurse or physician"
    ],
    nursingActions: [
      "Monitor and document frequency, duration, and triggers of excessive daytime sleepiness episodes and cataplexy attacks",
      "Administer modafinil, sodium oxybate, or other prescribed medications on schedule and document time of administration and patient response",
      "Assess for medication side effects: monitor heart rate and blood pressure with stimulant medications; monitor for confusion, enuresis, or respiratory depression with sodium oxybate",
      "Implement fall prevention measures for patients with cataplexy: padded side rails, low bed position, clear pathways, non-slip footwear",
      "Educate patient about the importance of consistent medication timing and the difference between narcolepsy type 1 (with cataplexy) and type 2 (without cataplexy)",
      "Report any new onset of depressive symptoms, suicidal ideation, or significant changes in sleep-wake patterns to the physician immediately",
      "Document the patient's response to planned nap interventions and whether the naps provide temporary relief of sleepiness"
    ],
    assessmentFindings: [
      "Excessive daytime sleepiness (EDS): irresistible sleep attacks occurring multiple times daily, partially relieved by brief naps; patients may fall asleep during conversations or meals",
      "Cataplexy (narcolepsy type 1 only): sudden bilateral loss of muscle tone triggered by strong emotions; ranges from jaw dropping and head nodding to complete collapse; consciousness is preserved",
      "Sleep paralysis: temporary inability to move or speak during the transition between sleep and wakefulness; episodes last seconds to minutes and resolve spontaneously",
      "Hypnagogic hallucinations: vivid, often frightening visual or auditory hallucinations occurring at sleep onset; patients may see figures, hear voices, or feel a presence in the room",
      "Hypnopompic hallucinations: similar hallucinations occurring upon awakening; patient is partially awake and aware the experiences are not real",
      "Automatic behaviors: continuation of routine activities during microsleep episodes without conscious awareness; patient may write gibberish, drive off course, or place objects in unusual locations",
      "Fragmented nocturnal sleep: frequent awakenings during the night despite excessive daytime sleepiness; paradoxically, total sleep time over 24 hours may be normal"
    ],
    signs: {
      left: [
        "Excessive daytime sleepiness with irresistible sleep attacks",
        "Brief refreshing naps followed by return of sleepiness",
        "Difficulty concentrating and memory lapses",
        "Mild mood changes including irritability",
        "Fragmented nighttime sleep with frequent awakenings",
        "Hypnagogic or hypnopompic hallucinations"
      ],
      right: [
        "Complete cataplexy with full body collapse (injury risk)",
        "Sleep attack while driving or operating machinery",
        "Severe depression with suicidal ideation",
        "Status cataplecticus (prolonged or continuous cataplexy episodes)",
        "Respiratory depression from sodium oxybate overdose",
        "Automatic behaviors causing dangerous situations (wandering, cooking without awareness)"
      ]
    },
    medications: [
      {
        name: "Modafinil (Alertec/Provigil)",
        type: "Wake-promoting agent (non-amphetamine stimulant)",
        action: "Promotes wakefulness through multiple mechanisms including inhibition of dopamine reuptake, increased histamine release in the tuberomammillary nucleus, and activation of orexin neurons; exact mechanism not fully understood but does not cause the peripheral sympathomimetic effects of traditional amphetamines",
        sideEffects: "Headache (most common), nausea, anxiety, insomnia, dizziness, dry mouth; rare but serious: Stevens-Johnson syndrome (discontinue immediately if rash develops), angioedema",
        contra: "Known hypersensitivity; severe hepatic impairment; use caution with cardiac conditions (can increase heart rate and blood pressure); reduces effectiveness of hormonal contraceptives",
        pearl: "First-line treatment for excessive daytime sleepiness in narcolepsy; typically dosed 200 mg in the morning; may add a second 100-200 mg dose at noon if needed; advise patients using oral contraceptives to use an additional barrier method"
      },
      {
        name: "Sodium Oxybate (Xyrem)",
        type: "Central nervous system depressant (gamma-hydroxybutyrate/GHB analogue)",
        action: "Binds to GABA-B receptors and specific GHB receptors in the brain, consolidating nocturnal sleep, increasing slow-wave sleep, and reducing REM sleep intrusions; the exact mechanism for reducing cataplexy is not fully understood but may involve modulation of dopaminergic and noradrenergic systems",
        sideEffects: "Nausea, dizziness, headache, enuresis (bedwetting), somnambulism (sleepwalking), confusion upon awakening; serious: respiratory depression (especially with concurrent CNS depressants), abuse potential (Schedule III controlled substance)",
        contra: "Concurrent use of sedative-hypnotics or alcohol (life-threatening respiratory depression); succinic semialdehyde dehydrogenase deficiency; use caution in patients with respiratory disorders",
        pearl: "The only medication approved to treat BOTH excessive daytime sleepiness AND cataplexy in narcolepsy; given in two doses -- first dose at bedtime and second dose 2.5 to 4 hours later (set alarm); high sodium content requires monitoring in patients on sodium-restricted diets; available only through a restricted REMS program"
      },
      {
        name: "Venlafaxine (Effexor)",
        type: "Serotonin-norepinephrine reuptake inhibitor (SNRI) antidepressant",
        action: "Inhibits reuptake of both serotonin and norepinephrine in the synaptic cleft, increasing their availability; in narcolepsy, the norepinephrine reuptake inhibition suppresses REM sleep and reduces cataplexy, sleep paralysis, and hypnagogic hallucinations by stabilizing REM-wake transitions",
        sideEffects: "Nausea, headache, dizziness, dry mouth, insomnia, increased blood pressure (dose-dependent), diaphoresis; discontinuation syndrome with abrupt withdrawal (dizziness, nausea, irritability, electric shock sensations)",
        contra: "Concurrent use with MAOIs (wait 14 days); uncontrolled hypertension; severe hepatic or renal impairment; use caution in patients with seizure disorder or narrow-angle glaucoma",
        pearl: "Used off-label for cataplexy when sodium oxybate is not tolerated or available; must be tapered gradually over 2 to 4 weeks to avoid discontinuation syndrome; abrupt withdrawal can cause rebound cataplexy (sudden worsening); monitor blood pressure regularly during treatment"
      }
    ],
    pearls: [
      "The classic narcolepsy pentad is: excessive daytime sleepiness, cataplexy, sleep paralysis, hypnagogic/hypnopompic hallucinations, and disrupted nocturnal sleep -- only about 10-15% of patients have all five symptoms at diagnosis",
      "Cataplexy is pathognomonic for narcolepsy type 1 -- no other condition causes sudden loss of muscle tone triggered by emotions with preserved consciousness; its presence confirms the diagnosis",
      "Brief naps (15-20 minutes) are characteristically refreshing in narcolepsy, unlike naps in other causes of hypersomnia such as obstructive sleep apnea or depression where naps are unrefreshing",
      "Sodium oxybate is the ONLY medication that treats both excessive daytime sleepiness AND cataplexy; it is given in two doses at night and requires a REMS program due to abuse potential",
      "Modafinil reduces hormonal contraceptive effectiveness -- female patients of childbearing age must use an additional barrier method of contraception during treatment and for one month after discontinuation",
      "Never abruptly stop venlafaxine or other anticataplectic medications as this can cause rebound cataplexy -- a dangerous surge in cataplexy frequency and severity that can result in status cataplecticus",
      "Narcolepsy patients should never be accused of laziness -- excessive daytime sleepiness is caused by the loss of orexin neurons and is not under voluntary control; psychosocial support and workplace accommodations are essential components of care"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient newly diagnosed with narcolepsy type 1. The patient asks what makes their diagnosis different from narcolepsy type 2. Which response by the practical nurse is most accurate?",
        options: [
          "Narcolepsy type 1 involves excessive daytime sleepiness while type 2 does not",
          "Narcolepsy type 1 includes cataplexy caused by the loss of orexin-producing neurons, while type 2 does not have cataplexy",
          "Narcolepsy type 2 is more severe and requires more aggressive treatment",
          "Narcolepsy type 1 only occurs in children while type 2 occurs in adults"
        ],
        correct: 1,
        rationale: "Narcolepsy type 1 is distinguished from type 2 by the presence of cataplexy (sudden loss of muscle tone triggered by emotions) and very low CSF orexin levels due to destruction of orexin-producing neurons. Both types have excessive daytime sleepiness. Type 2 does not have cataplexy."
      },
      {
        question: "A patient with narcolepsy is prescribed sodium oxybate (Xyrem). Which instruction should the practical nurse reinforce regarding this medication?",
        options: [
          "Take the medication with a large meal to improve absorption",
          "Take both doses at bedtime for convenience",
          "Set an alarm to take the second dose 2.5 to 4 hours after the first bedtime dose",
          "This medication only needs to be taken when cataplexy symptoms are present"
        ],
        correct: 2,
        rationale: "Sodium oxybate is given in two divided doses at night: the first at bedtime and the second 2.5 to 4 hours later (patient must set an alarm). Taking it with food decreases absorption. It is taken nightly regardless of symptoms for consistent therapeutic effect."
      },
      {
        question: "A patient with narcolepsy taking modafinil reports using oral contraceptive pills. Which nursing action is most important?",
        options: [
          "No action needed as modafinil does not interact with other medications",
          "Reinforce that modafinil decreases the effectiveness of hormonal contraceptives and an additional barrier method should be used",
          "Instruct the patient to double the dose of oral contraceptives",
          "Discontinue modafinil and switch to a different wake-promoting agent"
        ],
        correct: 1,
        rationale: "Modafinil induces hepatic enzymes (CYP3A4) that accelerate the metabolism of hormonal contraceptives, reducing their effectiveness. Patients should use an additional barrier method of contraception during treatment and for one month after stopping modafinil."
      }
    ]
  },

  "neonatal-abstinence-basics-rpn": {
    title: "Neonatal Abstinence Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neonatal Abstinence Syndrome and Opioid Withdrawal",
      content: "Neonatal Abstinence Syndrome (NAS), also called Neonatal Opioid Withdrawal Syndrome (NOWS), is a constellation of withdrawal signs and symptoms that occur in newborns who were exposed to opioids or other addictive substances during intrauterine development. When a pregnant person uses opioids (prescription or illicit), these lipophilic substances readily cross the placenta and blood-brain barrier, binding to mu-opioid receptors in the fetal central nervous system. The fetus develops physical dependence on the continuous opioid exposure, and after birth, when the drug supply is abruptly discontinued via separation from the placenta, the neonate experiences withdrawal.\n\nThe pathophysiology of opioid withdrawal involves a sudden increase in norepinephrine release from the locus coeruleus, a brainstem nucleus that is normally inhibited by opioids. When opioid stimulation is removed, the locus coeruleus becomes hyperactive, flooding the central and autonomic nervous systems with norepinephrine. This catecholamine surge produces the characteristic signs of NAS: autonomic instability (temperature dysregulation, sweating, yawning, sneezing, nasal stuffiness), central nervous system excitability (high-pitched cry, tremors, increased muscle tone, seizures), gastrointestinal dysfunction (poor feeding, uncoordinated suck, vomiting, diarrhea, excessive weight loss), and metabolic stress (increased caloric expenditure, dehydration).\n\nThe timing of NAS onset depends on the specific opioid used. Short-acting opioids (heroin, oxycodone, hydromorphone) typically produce withdrawal symptoms within 24 to 48 hours after birth. Long-acting opioids (methadone, buprenorphine) may delay onset to 48 to 72 hours or even up to 5 to 7 days after birth. This is why neonates exposed to methadone or buprenorphine in utero require extended hospital observation (minimum 5 to 7 days) before safe discharge.\n\nPolysubstance exposure is common and complicates the clinical picture. Concurrent exposure to benzodiazepines, selective serotonin reuptake inhibitors (SSRIs), nicotine, or alcohol can alter the timing, severity, and duration of withdrawal symptoms. Nicotine exposure alone can cause irritability and feeding difficulties that mimic or exacerbate NAS. The Finnegan Neonatal Abstinence Scoring System is the most widely used standardized tool for assessing NAS severity. It assigns numerical scores to 21 signs across four domains (central nervous system, metabolic/vasomotor/respiratory, gastrointestinal, and general) assessed every 2 to 4 hours. Scores of 8 or higher on three consecutive assessments typically trigger pharmacological intervention. The modified Finnegan scoring tool, the Eat Sleep Console (ESC) approach, is gaining acceptance as a function-based assessment focusing on the neonate's ability to eat adequately, sleep undisturbed for at least one hour, and be consoled within 10 minutes.\n\nThe practical nurse plays a critical role in NAS management by performing consistent, accurate scoring assessments, implementing non-pharmacological comfort measures as first-line interventions, administering pharmacological therapy as ordered, supporting maternal-infant bonding (which itself reduces NAS severity), and educating caregivers about the expected course and duration of withdrawal. NAS is not a reflection of parenting ability, and a non-judgmental, supportive approach is essential for both the neonate and the family."
    },
    riskFactors: [
      "Maternal opioid use during pregnancy (prescription or illicit -- heroin, methadone, buprenorphine, oxycodone, fentanyl)",
      "Maternal opioid maintenance therapy (methadone or buprenorphine -- therapeutic but still causes fetal dependence)",
      "Polysubstance exposure (concurrent benzodiazepines, SSRIs, nicotine, or alcohol use worsens NAS severity)",
      "Late or no prenatal care (delayed identification of substance use and intervention)",
      "Higher maternal opioid doses in the third trimester (greater fetal exposure near delivery)",
      "Maternal cigarette smoking (nicotine exposure independently increases NAS severity scores)",
      "Prematurity (preterm neonates may have less severe NAS due to fewer opioid receptors but are more physiologically vulnerable)"
    ],
    diagnostics: [
      "Finnegan Neonatal Abstinence Scoring System: standardized 21-item tool scored every 2-4 hours; scores 8 or higher on 3 consecutive assessments indicate need for pharmacological intervention; requires trained scorers for reliability",
      "Eat Sleep Console (ESC) assessment: function-based approach evaluating whether neonate can eat 1 or more ounces (or breastfeed well), sleep undisturbed for 1 hour or more, and be consoled within 10 minutes; guides treatment based on functional capacity rather than individual symptoms",
      "Urine toxicology screen (neonate): detects recent drug exposure; may miss substances used earlier in pregnancy; collect first voided urine",
      "Meconium drug testing: detects substance exposure from approximately the second trimester onward; more sensitive than urine for identifying chronic exposure; must be collected before meconium passes",
      "Umbilical cord tissue testing: detects substance exposure from approximately the third trimester; easily collected at delivery; growing evidence supports reliability comparable to meconium",
      "Maternal urine drug screen and history: identifies substances of exposure to predict NAS timing and guide observation period; self-report should be obtained in a non-judgmental manner"
    ],
    management: [
      "Implement non-pharmacological interventions as first-line therapy: swaddling, dim lighting, reduced environmental stimulation, skin-to-skin contact (kangaroo care), small frequent feedings, non-nutritive sucking (pacifier)",
      "Encourage rooming-in (keeping neonate with parent at bedside): evidence shows rooming-in reduces NAS severity scores, shortens length of stay, decreases need for pharmacological treatment, and promotes bonding",
      "Administer morphine or methadone as prescribed based on Finnegan scores: start at lowest effective dose and titrate based on scoring trends; goal is symptom control, not complete elimination of all withdrawal signs",
      "Monitor weight daily: NAS neonates are at risk for excessive weight loss due to poor feeding, vomiting, diarrhea, and increased metabolic demand; report weight loss exceeding 10% of birth weight",
      "Provide high-calorie formula (22-24 kcal/oz) if prescribed to compensate for increased caloric expenditure; support breastfeeding if mother is on stable maintenance therapy and not using illicit substances",
      "Plan for gradual pharmacological weaning: once NAS scores are consistently below 8 for 24-48 hours, begin dose reduction per protocol (typically 10-20% every 24-48 hours); monitor for rebound withdrawal",
      "Coordinate discharge planning with social work, public health nursing, and community resources; ensure follow-up appointments and caregiver education are in place before discharge"
    ],
    nursingActions: [
      "Perform Finnegan scoring every 2 to 4 hours using standardized technique; score 30 minutes to 1 hour after feeding when the neonate is awake; document scores accurately and trend over time",
      "Implement swaddling, gentle rocking, pacifier use, and skin-to-skin contact as comfort measures before and between pharmacological interventions",
      "Administer morphine or methadone precisely as prescribed based on scoring protocol; verify dose calculation by weight (mg/kg); document time, dose, and neonate response",
      "Monitor for signs of overmedication: excessive sedation, respiratory rate below 30 breaths per minute, poor feeding due to drowsiness; hold dose and notify physician if respiratory depression is suspected",
      "Protect skin integrity: NAS neonates are prone to excoriation from excessive movements and loose stools; apply barrier cream to diaper area, use soft sheets, and pad crib surfaces",
      "Maintain accurate intake and output records: document volume of each feeding, number of stools (noting consistency), urine output, and emesis; report signs of dehydration (dry mucous membranes, depressed fontanelle, poor skin turgor)",
      "Provide non-judgmental family support: educate caregivers about NAS, expected timeline (may take 2 to 6 weeks for complete resolution), and importance of continued follow-up; connect with social work and community resources"
    ],
    assessmentFindings: [
      "Central nervous system excitability: high-pitched or inconsolable crying, tremors (disturbed or undisturbed), increased muscle tone (hypertonia), exaggerated Moro reflex, myoclonic jerks, seizures (in severe cases)",
      "Gastrointestinal dysfunction: poor or uncoordinated suck, excessive sucking, regurgitation or vomiting, loose or watery stools, abdominal distension",
      "Autonomic instability: nasal stuffiness, sneezing (often in clusters), yawning, mottling, temperature instability (fever or hypothermia), sweating",
      "Skin excoriation: friction rubs on knees, elbows, nose, and chin from excessive movement; diaper dermatitis from frequent loose stools",
      "Feeding difficulties: frantic rooting but poor latch, gulping or gagging during feeds, frequent small-volume feedings with emesis",
      "Sleep disturbance: inability to achieve restful sleep, sleeping less than 1 hour after feeding, startling easily",
      "Weight loss exceeding normal physiologic parameters (greater than 7% in first 3 days or greater than 10% total) due to increased metabolic demand and poor caloric intake"
    ],
    signs: {
      left: [
        "Mild tremors when disturbed or handled",
        "Sneezing and nasal stuffiness",
        "Yawning and hiccups",
        "Poor feeding with frequent small volumes",
        "Increased muscle tone (mild hypertonia)",
        "Restlessness and difficulty settling"
      ],
      right: [
        "Seizures (tonic-clonic or myoclonic movements)",
        "Severe dehydration (depressed fontanelle, absent tears, poor skin turgor)",
        "Fever above 38.5 degrees Celsius with autonomic instability",
        "Inconsolable crying lasting more than 30 minutes despite comfort measures",
        "Respiratory distress (tachypnea above 60, nasal flaring, retractions)",
        "Weight loss exceeding 10% of birth weight"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate (oral solution)",
        type: "Opioid agonist (pharmacological treatment for NAS)",
        action: "Binds to mu-opioid receptors in the neonatal central nervous system, partially replacing the opioid stimulation lost after delivery; reduces CNS excitability, decreases gastrointestinal hypermotility, and controls autonomic instability; allows the neonatal nervous system to gradually adapt to functioning without opioids",
        sideEffects: "Respiratory depression (most critical), excessive sedation, constipation, urinary retention, feeding difficulties due to oversedation, delayed gastric emptying",
        contra: "Respiratory depression or rate below 30 breaths per minute; known hypersensitivity; use with extreme caution in preterm neonates due to immature hepatic metabolism",
        pearl: "First-line pharmacological treatment for NAS; dosed at 0.04-0.1 mg/kg every 3-4 hours based on Finnegan scores; always assess respiratory rate and effort BEFORE each dose; hold dose and notify physician if respiratory rate is below 30 or neonate is excessively sedated"
      },
      {
        name: "Methadone (oral solution)",
        type: "Long-acting opioid agonist",
        action: "Binds to mu-opioid receptors with a longer half-life than morphine (24-36 hours in neonates compared to 4-6 hours for morphine); provides more consistent opioid receptor coverage, reducing symptom fluctuations between doses; also has NMDA receptor antagonist properties that may provide additional benefit in withdrawal management",
        sideEffects: "Respiratory depression, QT prolongation (cardiac monitoring required), excessive sedation, constipation, feeding difficulties, longer treatment duration compared to morphine protocols",
        contra: "QT prolongation or family history of long QT syndrome; severe respiratory depression; concurrent use of other QT-prolonging medications; use caution with hepatic impairment (prolonged half-life)",
        pearl: "Alternative to morphine for NAS; advantage of less frequent dosing (every 8-12 hours) but disadvantage of longer weaning period due to extended half-life; cardiac monitoring recommended due to QT prolongation risk; some protocols use methadone when maternal exposure was methadone-based"
      },
      {
        name: "Clonidine (oral)",
        type: "Central alpha-2 adrenergic agonist",
        action: "Stimulates alpha-2 adrenergic receptors in the locus coeruleus, reducing norepinephrine release and counteracting the catecholamine surge that drives opioid withdrawal symptoms; reduces autonomic instability (tachycardia, sweating, temperature dysregulation) and CNS excitability without opioid receptor effects",
        sideEffects: "Hypotension, bradycardia, sedation, dry mouth, rebound hypertension if discontinued abruptly, hypothermia",
        contra: "Hemodynamically significant bradycardia or hypotension; sick sinus syndrome; use caution with renal impairment (renally excreted); must be tapered gradually to avoid rebound hypertension",
        pearl: "Used as adjunctive therapy when opioid monotherapy is insufficient to control NAS symptoms; particularly effective for autonomic symptoms (sweating, temperature instability, tachycardia); monitor heart rate and blood pressure before each dose; must be weaned slowly over 2-3 days to prevent rebound hypertension"
      }
    ],
    pearls: [
      "Non-pharmacological interventions are FIRST-LINE treatment for NAS -- swaddling, dim lighting, minimal handling, skin-to-skin contact, and non-nutritive sucking should be implemented before and alongside any pharmacological therapy",
      "Finnegan scoring must be performed consistently by trained staff using standardized technique -- inter-rater reliability is critical because treatment decisions (starting, increasing, weaning medication) are based directly on these scores",
      "Rooming-in (keeping the neonate with the parent at bedside) is evidence-based practice that reduces NAS severity, decreases length of stay by an average of 8 days, and reduces the need for pharmacological treatment by up to 50%",
      "NAS onset timing depends on the substance: short-acting opioids (heroin) cause withdrawal within 24-48 hours; long-acting opioids (methadone, buprenorphine) may delay onset to 48-72 hours or up to 5-7 days -- this determines the minimum observation period",
      "Always assess respiratory rate and effort BEFORE administering each dose of morphine or methadone -- respiratory rate below 30 breaths per minute or excessive sedation requires holding the dose and notifying the physician",
      "Breastfeeding is generally encouraged for mothers on stable methadone or buprenorphine maintenance who are not using illicit substances -- the small amount of opioid transferred through breast milk may reduce NAS severity and promote bonding",
      "Approach NAS families with compassion and without judgment -- substance use disorder is a medical condition, and the parent's willingness to engage in treatment should be supported; punitive attitudes reduce trust and harm outcomes"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 2-day-old neonate with a Finnegan score of 10 on three consecutive assessments. The neonate is tremulous, has a high-pitched cry, and is having loose stools. Which nursing action is the priority?",
        options: [
          "Continue observation and reassess in 4 hours",
          "Notify the physician of the elevated Finnegan scores as pharmacological intervention is likely indicated",
          "Increase the feeding volume to address the loose stools",
          "Discharge the neonate with follow-up instructions"
        ],
        correct: 1,
        rationale: "A Finnegan score of 8 or higher on three consecutive assessments indicates the need for pharmacological intervention. The practical nurse should notify the physician promptly so that medication (morphine or methadone) can be initiated. Continued observation alone is insufficient at this score level."
      },
      {
        question: "A neonate with NAS is prescribed oral morphine. Before administering the dose, which assessment is MOST critical for the practical nurse to perform?",
        options: [
          "Weigh the neonate",
          "Assess the diaper area for excoriation",
          "Count the respiratory rate and assess breathing effort",
          "Check the Finnegan score from the previous shift"
        ],
        correct: 2,
        rationale: "Respiratory depression is the most serious adverse effect of opioid administration in neonates. The practical nurse must assess respiratory rate and effort before EVERY dose. If the respiratory rate is below 30 breaths per minute or the neonate shows signs of respiratory depression, the dose must be held and the physician notified immediately."
      },
      {
        question: "Which non-pharmacological intervention has the strongest evidence for reducing NAS severity and decreasing the length of hospital stay?",
        options: [
          "Playing classical music in the nursery",
          "Rooming-in with the parent combined with skin-to-skin contact",
          "Placing the neonate in a private room away from the parent",
          "Providing formula feeding exclusively to ensure caloric intake"
        ],
        correct: 1,
        rationale: "Rooming-in (keeping the neonate with the parent at bedside) combined with skin-to-skin contact is the strongest evidence-based non-pharmacological intervention for NAS. It reduces NAS severity scores, decreases length of stay by an average of 8 days, reduces the need for pharmacological treatment, and promotes maternal-infant bonding."
      }
    ]
  },

  "neonatal-hypoglycemia-basics-rpn": {
    title: "Neonatal Hypoglycemia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neonatal Glucose Regulation and Hypoglycemia",
      content: "Neonatal hypoglycemia is defined as a blood glucose level below 2.6 mmol/L (47 mg/dL) in a newborn, though some guidelines use operational thresholds as low as 2.0 mmol/L for intervention in the first hours of life. Glucose is the primary energy substrate for the neonatal brain, and unlike adults, neonates have limited ability to produce alternative fuels (ketone bodies) during hypoglycemia. Prolonged or severe neonatal hypoglycemia can cause permanent neurological injury including seizures, cognitive impairment, and developmental delay.\n\nDuring fetal life, glucose is supplied continuously across the placenta via facilitated diffusion. The fetus maintains blood glucose levels approximately 60-70% of maternal levels. At birth, this continuous glucose supply is abruptly terminated when the umbilical cord is clamped. The neonate must rapidly transition from continuous placental glucose delivery to intermittent enteral feeding and endogenous glucose production.\n\nNormal metabolic transition involves several hormonal changes. Plasma glucagon rises within minutes of birth, while insulin levels fall. This hormonal shift activates hepatic glycogenolysis (breakdown of glycogen stores to release glucose) and gluconeogenesis (de novo glucose production from amino acids, lactate, and glycerol). Additionally, lipolysis releases free fatty acids that can be oxidized for energy and converted to ketone bodies in the liver, providing alternative fuel for the brain.\n\nNeonatal hypoglycemia occurs when there is an imbalance between glucose supply (feeding, glycogenolysis, gluconeogenesis) and glucose demand (metabolic rate, brain consumption, thermoregulation). Several categories of at-risk neonates are identified. Large for gestational age (LGA) and infants of diabetic mothers (IDM) have hyperinsulinism: chronic maternal hyperglycemia causes fetal pancreatic beta-cell hyperplasia, resulting in excessive insulin production that persists after birth. Insulin is the most potent glucose-lowering hormone and simultaneously suppresses glycogenolysis, gluconeogenesis, lipolysis, and ketogenesis, making these neonates particularly vulnerable to hypoglycemia and unable to mount a normal counter-regulatory response.\n\nSmall for gestational age (SGA) neonates and those with intrauterine growth restriction (IUGR) are at risk because they have diminished glycogen and fat stores from chronic placental insufficiency. Preterm neonates are vulnerable due to immature hepatic enzyme systems for gluconeogenesis, smaller glycogen stores (glycogen deposition occurs primarily in the third trimester), and higher brain-to-body weight ratio (greater proportional glucose demand). Cold-stressed neonates consume glucose rapidly through non-shivering thermogenesis in brown adipose tissue.\n\nThe practical nurse must understand the screening protocols for at-risk neonates: glucose monitoring begins within 1 hour of birth (or before the first feed) and continues every 1-3 hours for the first 12-24 hours. Point-of-care glucose testing using heel-stick blood samples provides rapid results but may underestimate true plasma glucose by 10-15%. Any critically low reading (below 1.8 mmol/L) should be confirmed with a venous plasma glucose while treatment is simultaneously initiated -- never delay treatment to wait for confirmation."
    },
    riskFactors: [
      "Infant of diabetic mother (IDM) -- gestational, type 1, or type 2 diabetes (fetal hyperinsulinism from maternal hyperglycemia)",
      "Large for gestational age (LGA) -- birth weight above 90th percentile or above 4000 grams (associated with hyperinsulinism)",
      "Small for gestational age (SGA) -- birth weight below 10th percentile (depleted glycogen and fat stores)",
      "Preterm birth (less than 37 weeks gestation) -- immature hepatic enzymes and limited glycogen reserves",
      "Cold stress or hypothermia (increased glucose consumption through non-shivering thermogenesis)",
      "Perinatal asphyxia or birth stress (anaerobic metabolism rapidly depletes glucose stores)",
      "Delayed or inadequate feeding in the first hours of life"
    ],
    diagnostics: [
      "Point-of-care blood glucose (heel stick): first-line screening tool; obtained within 30-60 minutes of birth for at-risk neonates and before the first feed; may underestimate true plasma glucose by 10-15%",
      "Venous plasma glucose: confirmatory test for critically low point-of-care readings; more accurate than capillary samples; send to laboratory if point-of-care glucose is below 2.0 mmol/L",
      "Serial glucose monitoring: check every 1-3 hours for at-risk neonates; continue until at least 3 consecutive pre-feed values are above 2.6 mmol/L and the neonate is feeding well",
      "Serum insulin level: if hypoglycemia is persistent or recurrent despite adequate feeding (beyond 48 hours), elevated insulin levels suggest congenital hyperinsulinism; critical sample should be drawn during a hypoglycemic episode",
      "Newborn metabolic screen: standard screening identifies inborn errors of metabolism (fatty acid oxidation defects, glycogen storage diseases) that can cause persistent hypoglycemia",
      "Serum cortisol and growth hormone: ordered if hypoglycemia is persistent; low levels suggest hormonal deficiency (adrenal insufficiency or growth hormone deficiency) as the underlying cause"
    ],
    management: [
      "Initiate early and frequent feeding within 1 hour of birth for all at-risk neonates: breastfeeding or formula every 2-3 hours with glucose monitoring before each feed",
      "For asymptomatic hypoglycemia (glucose 1.8-2.5 mmol/L): feed immediately with breast milk or formula (glucose gel 40% may be applied to buccal mucosa as ordered) and recheck glucose within 30-60 minutes",
      "For symptomatic or severe hypoglycemia (glucose below 1.8 mmol/L or symptomatic at any level): administer IV dextrose 10% (D10W) bolus of 2 mL/kg over 10-15 minutes followed by continuous infusion at glucose infusion rate (GIR) of 5-8 mg/kg/min",
      "Monitor glucose every 30 minutes during IV dextrose therapy until stable, then every 1-3 hours; adjust infusion rate based on glucose response",
      "Maintain thermoneutral environment: prevent cold stress through skin-to-skin contact, radiant warmer, or incubator as needed; cold stress increases glucose consumption through non-shivering thermogenesis",
      "Wean IV dextrose gradually (decrease GIR by 1-2 mg/kg/min every 6-12 hours) once oral feeding is established and glucose levels are consistently above 2.6 mmol/L for at least 12 hours",
      "Report persistent hypoglycemia (lasting beyond 48 hours despite adequate feeding and IV glucose) to the physician as it may indicate congenital hyperinsulinism or metabolic disorder requiring further workup"
    ],
    nursingActions: [
      "Perform heel-stick glucose screening within 30-60 minutes of birth for all at-risk neonates; use correct technique (warm the heel, use lateral aspect, wipe first drop, apply sample to test strip)",
      "Assess for signs of hypoglycemia: jitteriness, tremors, poor feeding, weak or high-pitched cry, lethargy, temperature instability, apnea, cyanosis, seizures",
      "Facilitate early breastfeeding or provide formula within the first hour of life; document time, volume, and tolerance of each feeding",
      "Administer buccal glucose gel (40% dextrose gel) as ordered: massage 0.5 mL/kg into the inner cheek mucosa followed by immediate feeding; recheck glucose 30 minutes later",
      "Monitor IV dextrose infusion rate and site: check glucose infusion rate (GIR) calculation, assess IV site for infiltration every hour (dextrose causes tissue damage if extravasated)",
      "Maintain thermoneutral environment and perform axillary temperature checks every 3-4 hours; report temperature below 36.5 degrees Celsius as cold stress increases glucose consumption",
      "Document all glucose values, feeding times and volumes, medications administered, and neonate's clinical response; report any glucose below 2.0 mmol/L or any symptomatic episode immediately"
    ],
    assessmentFindings: [
      "Jitteriness and tremors: fine, rapid rhythmic movements of the extremities or jaw; most common early sign; differentiate from seizures by gently holding the affected limb (jitteriness stops with gentle restraint, seizures do not)",
      "Poor feeding: weak or uncoordinated suck, refusal to feed, gagging, or early fatigue during feeds; the neonate may initially feed eagerly then quickly lose interest",
      "Lethargy and hypotonia: decreased activity, floppiness, difficult to arouse for feeds, weak cry; progressive lethargy indicates worsening hypoglycemia",
      "Temperature instability: hypothermia (below 36.5 degrees Celsius) is both a cause and consequence of hypoglycemia; cold-stressed neonates deplete glucose stores rapidly",
      "Apnea and cyanosis: periodic breathing pauses lasting more than 20 seconds or associated with bradycardia or oxygen desaturation; cyanosis may be central (lips, trunk) or peripheral",
      "Seizures: tonic, clonic, or subtle (lip smacking, eye deviation, bicycling movements); indicate severe or prolonged hypoglycemia with neurological injury risk",
      "High-pitched or weak cry: altered cry quality may be the first sign noticed by caregivers or nurses; should prompt immediate glucose check"
    ],
    signs: {
      left: [
        "Jitteriness or mild tremors when handled",
        "Poor feeding or weak suck",
        "Mild hypothermia (36.0-36.4 degrees Celsius)",
        "Irritability or restlessness",
        "Pallor or mild diaphoresis",
        "Tachypnea (respiratory rate above 60)"
      ],
      right: [
        "Seizures (tonic, clonic, or subtle seizure activity)",
        "Apnea with bradycardia (respiratory pauses with heart rate drop)",
        "Central cyanosis (blue lips, trunk, and mucous membranes)",
        "Unresponsive or difficult to arouse (severe lethargy)",
        "Blood glucose below 1.0 mmol/L (severe hypoglycemia with high risk of brain injury)",
        "Persistent hypoglycemia despite IV dextrose infusion (suspect hyperinsulinism)"
      ]
    },
    medications: [
      {
        name: "Dextrose 10% in Water (D10W) IV",
        type: "Intravenous glucose replacement",
        action: "Provides exogenous glucose directly to the bloodstream, rapidly raising blood glucose levels; a 2 mL/kg bolus delivers 200 mg/kg of glucose; continuous infusion maintains steady glucose delivery at a controlled glucose infusion rate (GIR) to prevent rebound hypoglycemia",
        sideEffects: "Rebound hypoglycemia if infusion is stopped abruptly (stimulates insulin release), hyperglycemia if infusion rate is too high, tissue necrosis if extravasation occurs, fluid overload with excessive volumes",
        contra: "Use D10W only (not higher concentrations) through peripheral IV in neonates; D12.5W or higher requires central venous access due to hyperosmolarity and vein sclerosis risk; never give undiluted D50W to neonates",
        pearl: "The bolus dose is 2 mL/kg of D10W (200 mg/kg glucose) given IV push over 10-15 minutes (never rapid bolus as it can cause dangerous hyperglycemia and reactive hypoglycemia); follow with continuous infusion starting at GIR 5-8 mg/kg/min; ALWAYS recheck glucose 30 minutes after bolus"
      },
      {
        name: "Glucagon (intramuscular)",
        type: "Pancreatic hormone / glycogenolysis stimulant",
        action: "Binds to glucagon receptors on hepatocytes, activating adenylyl cyclase and increasing cyclic AMP, which stimulates glycogenolysis (breakdown of stored glycogen to glucose) and gluconeogenesis; raises blood glucose within 10-20 minutes of intramuscular injection",
        sideEffects: "Nausea, vomiting, transient hyperglycemia followed by rebound hypoglycemia, tachycardia; less effective in growth-restricted or preterm neonates with depleted glycogen stores",
        contra: "Pheochromocytoma; insulinoma (may cause paradoxical initial insulin release); known hypersensitivity; limited effectiveness in neonates with depleted glycogen reserves (SGA, IUGR, preterm)",
        pearl: "Used as a temporary bridge when IV access cannot be established; dose 0.02-0.03 mg/kg IM (maximum 1 mg); effect depends on adequate hepatic glycogen stores -- will NOT work in SGA or preterm neonates with depleted glycogen; always establish IV access and begin D10W infusion as soon as possible"
      },
      {
        name: "Diazoxide (oral)",
        type: "Potassium channel activator / insulin secretion inhibitor",
        action: "Opens ATP-sensitive potassium channels (K-ATP channels) on pancreatic beta cells, preventing calcium influx and inhibiting insulin secretion; reduces endogenous insulin levels, allowing blood glucose to rise; used specifically for congenital hyperinsulinism when hypoglycemia persists despite IV glucose",
        sideEffects: "Fluid retention and edema (often requires concurrent diuretic), hypertrichosis (excessive hair growth -- reversible), hyperuricemia, cardiac effects (tachycardia, hypotension), neutropenia (rare)",
        contra: "Functional hypoglycemia (appropriate insulin response to carbohydrate intake); severe coronary artery disease; concurrent use with thiazide diuretics (additive hyperglycemic effect); known hypersensitivity to sulfonamides (structural similarity)",
        pearl: "Reserved for persistent hyperinsulinemic hypoglycemia (usually congenital hyperinsulinism) that does not respond to IV glucose and feeding management; dose 5-15 mg/kg/day divided every 8 hours; often used with chlorothiazide diuretic to counteract fluid retention; response usually seen within 5 days; hypertrichosis is cosmetically concerning to families but is reversible upon discontinuation"
      }
    ],
    pearls: [
      "The most critical window for neonatal brain protection from hypoglycemia is the first 48 hours of life -- glucose screening for at-risk neonates must begin within 1 hour of birth and continue every 1-3 hours until values are consistently above 2.6 mmol/L",
      "NEVER use D50W (50% dextrose) in neonates -- it is hyperosmolar and can cause severe rebound hypoglycemia, brain hemorrhage, and vein sclerosis; always use D10W for peripheral IV glucose replacement in neonates",
      "Jitteriness is the most common sign of neonatal hypoglycemia but can be differentiated from seizures by gently holding the extremity -- jitteriness stops with gentle restraint while seizure activity does not",
      "Buccal glucose gel (40% dextrose gel, 0.5 mL/kg massaged into inner cheek) is an effective first-line treatment for asymptomatic mild hypoglycemia; it is absorbed through the buccal mucosa and should be followed immediately by feeding",
      "Infants of diabetic mothers are at highest risk in the first 1-2 hours of life due to hyperinsulinism from fetal beta-cell hyperplasia -- early feeding within 30-60 minutes of birth is essential to prevent hypoglycemia",
      "Cold stress depletes glucose stores rapidly through non-shivering thermogenesis in brown adipose tissue -- maintaining thermoneutral environment (skin-to-skin contact, radiant warmer) is a critical component of hypoglycemia prevention",
      "IV dextrose infusion must be weaned gradually (decrease GIR by 1-2 mg/kg/min every 6-12 hours) -- abrupt discontinuation can cause rebound hypoglycemia because the continuous glucose infusion stimulates insulin secretion"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 1-hour-old neonate born to a mother with gestational diabetes. The heel-stick blood glucose is 1.5 mmol/L and the neonate is lethargic and has a weak cry. What is the priority nursing action?",
        options: [
          "Offer breastfeeding and recheck glucose in 1 hour",
          "Apply buccal glucose gel and offer a feeding",
          "Notify the physician immediately for IV D10W administration as the neonate is symptomatic with severe hypoglycemia",
          "Wrap the neonate in warm blankets and observe for improvement"
        ],
        correct: 2,
        rationale: "A glucose of 1.5 mmol/L with symptoms (lethargy, weak cry) represents severe symptomatic hypoglycemia requiring immediate IV D10W. Oral feeding alone is insufficient for symptomatic or severe hypoglycemia (below 1.8 mmol/L). The practical nurse should notify the physician immediately while preparing for IV access and dextrose administration."
      },
      {
        question: "Which neonate is at HIGHEST risk for developing hypoglycemia in the first hours of life?",
        options: [
          "A full-term neonate with an Apgar score of 9/9 and birth weight at the 50th percentile",
          "A large-for-gestational-age neonate born to a mother with poorly controlled type 2 diabetes",
          "A full-term neonate born via uncomplicated vaginal delivery with immediate skin-to-skin contact",
          "A neonate born at 39 weeks with birth weight of 3200 grams"
        ],
        correct: 1,
        rationale: "An LGA neonate born to a mother with poorly controlled diabetes has the highest risk due to fetal hyperinsulinism. Chronic maternal hyperglycemia causes fetal pancreatic beta-cell hyperplasia, resulting in excessive insulin production that persists after birth and rapidly drops blood glucose. These neonates need glucose screening within 1 hour of birth."
      },
      {
        question: "A practical nurse is preparing to administer IV dextrose to a hypoglycemic neonate. Which concentration of dextrose is appropriate for peripheral IV administration in neonates?",
        options: [
          "D50W (50% dextrose in water)",
          "D25W (25% dextrose in water)",
          "D10W (10% dextrose in water)",
          "D5W (5% dextrose in water)"
        ],
        correct: 2,
        rationale: "D10W is the standard concentration for peripheral IV glucose replacement in neonates. D50W and D25W are hyperosmolar and can cause vein sclerosis, rebound hypoglycemia, and brain hemorrhage in neonates. Higher concentrations (D12.5W or above) require central venous access. D5W is generally insufficient to treat hypoglycemia."
      }
    ]
  },

  "neonatal-pain-rpn": {
    title: "Neonatal Pain Recognition for Practical Nurses",
    cellular: {
      title: "Neurobiology of Neonatal Pain Perception and Assessment",
      content: "Neonates are fully capable of perceiving pain, and research demonstrates that repeated painful experiences in the neonatal period can cause lasting alterations in pain processing, stress responses, and neurodevelopment. This understanding has transformed neonatal care from the outdated belief that neonates do not experience pain to current evidence-based practice requiring systematic pain assessment and management for every neonate.\n\nPain transmission in the neonate involves the same basic neuroanatomical pathways as in adults but with important developmental differences. Nociceptors (free nerve endings that detect painful stimuli) are present and functional throughout the body by 20 weeks gestation. A-delta fibers (which transmit sharp, localized pain) and C-fibers (which transmit dull, diffuse pain) carry nociceptive signals from the periphery to the dorsal horn of the spinal cord. In the dorsal horn, substance P and glutamate are released, transmitting the pain signal to ascending pathways that project to the thalamus and somatosensory cortex.\n\nCritically, neonates have an ENHANCED pain response compared to older children and adults due to several developmental factors. First, descending inhibitory pathways from the brainstem that normally modulate and dampen pain signals are immature at birth and do not fully mature until several months of age. This means neonates have less ability to suppress or modulate incoming pain signals. Second, neonates have lower thresholds for pain sensitization: repeated painful stimuli cause more pronounced hyperalgesia (increased pain response to painful stimuli) and allodynia (pain response to normally non-painful stimuli) in neonates compared to adults. Third, cutaneous nerve fiber density is higher in neonates, meaning more pain receptors per unit area of skin. Fourth, myelination of pain-transmitting fibers is incomplete, which slows transmission speed but does not reduce pain perception -- it simply means the neonate's pain response may be slightly delayed but is no less intense.\n\nThe physiological consequences of unmanaged neonatal pain are significant. Acute pain triggers a stress response with cortisol and catecholamine release, causing tachycardia, hypertension, increased intracranial pressure, oxygen desaturation, and metabolic acidosis. In preterm neonates, this stress response can precipitate intraventricular hemorrhage. Chronic or repeated pain exposure causes epigenetic changes in pain-processing genes, altering the hypothalamic-pituitary-adrenal (HPA) axis and potentially leading to lifelong alterations in pain sensitivity, stress responses, and behavior.\n\nBecause neonates cannot self-report pain, valid and reliable behavioral pain assessment tools are essential. The Neonatal Infant Pain Scale (NIPS) evaluates six behavioral indicators: facial expression, cry, breathing pattern, arm movement, leg movement, and state of arousal, scored 0-7 (pain indicated by scores of 4 or higher). The CRIES scale (Crying, Requires oxygen, Increased vital signs, Expression, Sleeplessness) is designed for postoperative pain, scored 0-10. The Premature Infant Pain Profile (PIPP or PIPP-R) incorporates gestational age and behavioral state as modifying factors, making it particularly appropriate for preterm neonates, scored 0-21 with scores above 6 indicating pain.\n\nThe practical nurse must integrate pain assessment into every neonate encounter, implement non-pharmacological comfort measures as first-line interventions for procedural and mild pain, administer pharmacological agents as prescribed for moderate to severe pain, and document pain scores and treatment responses systematically."
    },
    riskFactors: [
      "Prematurity (immature descending inhibitory pain pathways, higher vulnerability to pain sensitization)",
      "Repeated procedural pain (heel sticks, IV insertions, blood draws, tape removal -- NICU neonates may experience 10-14 painful procedures per day)",
      "Surgical procedures (circumcision, PDA ligation, NEC surgery, abdominal procedures)",
      "Mechanical ventilation (endotracheal tube insertion, suctioning, tape changes)",
      "Necrotizing enterocolitis or other inflammatory conditions causing visceral pain",
      "Birth trauma (cephalohematoma, clavicle fracture, brachial plexus injury, vacuum extraction or forceps marks)",
      "Inadequate pain assessment due to inability to self-report (pain is undertreated when not systematically assessed)"
    ],
    diagnostics: [
      "Neonatal Infant Pain Scale (NIPS): 6-item behavioral assessment (facial expression, cry, breathing patterns, arm movement, leg movement, state of arousal); scored 0-7; scores of 4 or higher indicate pain requiring intervention",
      "CRIES scale: 5-item assessment designed for postoperative neonatal pain (Crying, Requires oxygen for saturation above 95%, Increased vital signs, Expression, Sleeplessness); scored 0-10; scores above 4 indicate significant pain",
      "Premature Infant Pain Profile-Revised (PIPP-R): 7-item multidimensional tool incorporating gestational age and behavioral state as modifying factors; scored 0-21; scores above 6 indicate clinically significant pain; validated for preterm neonates",
      "Vital sign monitoring: pain causes tachycardia (heart rate above 160-180), hypertension, tachypnea, and oxygen desaturation; vital signs alone are not reliable pain indicators but support behavioral assessment findings",
      "Salivary cortisol levels: elevated cortisol reflects the stress response to pain; used primarily in research settings; not routinely used for clinical decision-making",
      "Skin conductance monitoring: measures sympathetic nervous system activation through palmar sweating; emerging technology for objective pain assessment in neonates; not yet widely adopted"
    ],
    management: [
      "Implement non-pharmacological comfort measures as first-line therapy for procedural and mild pain: non-nutritive sucking, sucrose solution, skin-to-skin contact, swaddling, facilitated tucking, breastfeeding during procedures",
      "Administer oral sucrose solution (24% or 33%) 2 minutes before painful procedures: place 0.1-0.5 mL on the anterior tongue; combine with non-nutritive sucking (pacifier) for maximum analgesic effect; effective for heel sticks, venipuncture, and immunizations",
      "Cluster care to minimize the number of painful and disruptive interventions: coordinate blood draws, assessments, and procedures to allow for rest periods between handling episodes",
      "Administer prescribed analgesics for moderate to severe pain: acetaminophen (oral or rectal) for mild-moderate pain; fentanyl IV for procedural or postoperative pain as ordered",
      "Assess pain using a validated tool before, during, and after painful procedures and at regular intervals (every 3-4 hours for hospitalized neonates); document scores and interventions",
      "Minimize environmental stressors that amplify pain response: dim lighting, reduce noise, limit handling to necessary care, provide boundaries and nesting in the crib or incubator",
      "Educate parents on recognizing pain cues and participating in comfort measures (skin-to-skin contact, breastfeeding, gentle touch, quiet voice) to enhance pain management and promote bonding"
    ],
    nursingActions: [
      "Perform systematic pain assessment using NIPS, CRIES, or PIPP-R at regular intervals and before/after all painful procedures; document scores consistently",
      "Administer oral sucrose (24%) 2 minutes before anticipated painful procedures; position drops on the anterior tongue and offer pacifier simultaneously; document administration and neonate response",
      "Implement facilitated tucking during procedures: gently hold the neonate in a flexed, contained position with hands on head and feet; this activates proprioceptive and tactile soothing pathways",
      "Monitor vital signs before, during, and after painful procedures: document heart rate, respiratory rate, oxygen saturation, and blood pressure changes as physiological indicators of pain",
      "Report pain scores consistently above threshold (NIPS 4 or higher, CRIES 4 or higher, PIPP-R above 6) to the supervising nurse or physician for pharmacological intervention if non-pharmacological measures are insufficient",
      "Promote skin-to-skin contact (kangaroo care) as both a pain-reducing intervention and a developmental care practice; document duration and neonate response",
      "Advocate for the neonate by ensuring all care providers use pain assessment tools and comfort measures before, during, and after procedures; do not allow the outdated belief that neonates do not feel pain to influence care"
    ],
    assessmentFindings: [
      "Facial expression changes: brow bulging, eye squeeze, nasolabial furrow deepening, open mouth with taut tongue; these are the most reliable behavioral indicators of neonatal pain",
      "Cry characteristics: high-pitched, tense, harsh cry that is sustained and difficult to console; preterm neonates may have a weak or absent cry despite experiencing significant pain",
      "Motor responses: limb withdrawal, rigid body posture, fist clenching, finger splaying, arching; preterm neonates may demonstrate flaccidity rather than rigidity with severe pain",
      "Physiological changes: tachycardia (heart rate increase of 10-30 bpm above baseline), oxygen desaturation (SpO2 drop below 90%), tachypnea, blood pressure elevation, palmar sweating",
      "State changes: difficulty transitioning to quiet sleep, hyperalertness with wide eyes, or conversely, withdrawal with flat affect and decreased responsiveness (chronic pain sign)",
      "Feeding disruption: refusal to feed, disorganized suck-swallow-breathe pattern, gagging, or arching away from the breast or bottle during or after painful procedures"
    ],
    signs: {
      left: [
        "Facial grimacing with brow bulge and nasolabial furrow",
        "Fussiness and difficulty settling after routine procedures",
        "Mild tachycardia (10-20 bpm above baseline)",
        "Brief oxygen desaturation recovering spontaneously",
        "Increased motor activity with finger splaying",
        "Disrupted sleep-wake pattern"
      ],
      right: [
        "Sustained high-pitched inconsolable cry",
        "Persistent tachycardia with oxygen desaturation below 85%",
        "Apnea or bradycardia episodes during or after painful procedures",
        "Seizure-like activity from severe uncontrolled pain",
        "Complete withdrawal and flat affect (chronic unmanaged pain)",
        "Hemodynamic instability (significant blood pressure changes, poor perfusion)"
      ]
    },
    medications: [
      {
        name: "Sucrose Solution (24% oral)",
        type: "Non-pharmacological analgesic / sweet taste analgesia",
        action: "Activates endogenous opioid pathways when sweet taste receptors on the tongue are stimulated; triggers the release of beta-endorphins in the brainstem, modulating pain signal transmission through descending inhibitory pathways; the analgesic effect begins within seconds and lasts approximately 5-8 minutes",
        sideEffects: "Minimal at recommended doses; potential for brief choking if administered too rapidly; theoretical concern for altered gut flora with repeated high-volume doses in preterm neonates; does not cause significant hyperglycemia at standard doses",
        contra: "Neonates unable to swallow safely (absent gag reflex, severe respiratory distress requiring intubation); necrotizing enterocolitis (NEC) or suspected NEC (nothing by mouth status); fructose intolerance (rare); use with caution in extremely preterm neonates (less than 28 weeks)",
        pearl: "Most effective when given 2 minutes before the painful stimulus and combined with non-nutritive sucking (pacifier); standard dose 0.1-0.5 mL placed on the anterior tongue; can be repeated once during the same procedure; effective for heel sticks, venipuncture, immunizations, and NG tube insertion; NOT sufficient alone for moderate-severe pain"
      },
      {
        name: "Acetaminophen (Tylenol oral/rectal)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis and raising the pain threshold; also activates descending serotonergic inhibitory pathways contributing to analgesic effect; provides mild to moderate pain relief without anti-inflammatory effects",
        sideEffects: "Hepatotoxicity at high doses (neonatal liver has reduced glucuronidation capacity, increasing vulnerability); rash (rare); overdose can cause acute liver failure",
        contra: "Severe hepatic impairment or liver disease; known hypersensitivity; use caution in neonates with jaundice (competes for glucuronidation pathways); premature neonates may require dose adjustment due to immature hepatic metabolism",
        pearl: "Neonatal dose is 10-15 mg/kg orally or rectally every 6-8 hours (NOT every 4 hours as in older children); maximum daily dose in neonates is 40-60 mg/kg/day depending on gestational age; effective for post-circumcision pain, minor procedural pain, and as an adjunct to non-pharmacological measures; onset 30-60 minutes (plan timing before anticipated procedures)"
      },
      {
        name: "Fentanyl (IV)",
        type: "Synthetic opioid analgesic (mu-opioid receptor agonist)",
        action: "Binds to mu-opioid receptors in the brain and spinal cord with high affinity, blocking pain signal transmission in ascending pathways and activating descending inhibitory pathways; 50-100 times more potent than morphine with rapid onset (1-2 minutes IV) and shorter duration (30-60 minutes); provides profound analgesia for moderate to severe pain",
        sideEffects: "Respiratory depression (most critical -- have naloxone and resuscitation equipment immediately available), chest wall rigidity (wooden chest syndrome, especially with rapid IV bolus), bradycardia, hypotension, urinary retention, ileus, physical dependence with prolonged use",
        contra: "Severe respiratory depression without mechanical ventilation; known hypersensitivity; concurrent use with MAOIs; use extreme caution in neonates with increased intracranial pressure, hepatic or renal impairment",
        pearl: "Used for significant procedural pain (chest tube insertion, central line placement) and postoperative analgesia; administer slowly IV over 3-5 minutes to prevent chest wall rigidity; continuous infusion at 1-2 mcg/kg/hour for sustained postoperative pain; always have naloxone drawn up and readily available; tolerance develops with prolonged use requiring gradual weaning to prevent withdrawal"
      }
    ],
    pearls: [
      "Neonates feel pain MORE intensely than older children and adults because their descending inhibitory pain pathways are immature -- this means pain signals reach the brain without the normal dampening effect that develops later in life",
      "Facial expression (brow bulging, eye squeeze, nasolabial furrow) is the MOST reliable behavioral indicator of neonatal pain -- even when cry is absent (as in intubated neonates), facial expression changes are consistently present during painful stimuli",
      "Oral sucrose is most effective when administered 2 minutes BEFORE the painful stimulus and combined with non-nutritive sucking -- the analgesic effect depends on sweet taste receptor activation on the tongue and lasts only 5-8 minutes",
      "NICU neonates may experience 10 to 14 painful procedures per day -- clustering care and minimizing unnecessary procedures is a fundamental nursing responsibility to reduce cumulative pain exposure and its long-term developmental consequences",
      "A quiet, unresponsive neonate is NOT necessarily comfortable -- chronic or severe unmanaged pain can cause withdrawal, flat affect, and decreased responsiveness that may be misinterpreted as sleep or contentment",
      "Chest wall rigidity (wooden chest syndrome) is a life-threatening complication of rapid IV fentanyl administration -- always push fentanyl slowly over 3-5 minutes and have naloxone and ventilation equipment immediately available",
      "Pain assessment must be documented as the fifth vital sign in neonatal care -- use validated tools (NIPS, CRIES, PIPP-R) at regular intervals and before/after every painful procedure, and always document the intervention provided and the neonate's response"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to assist with a heel stick on a 3-day-old neonate. Which intervention should be implemented FIRST to manage procedural pain?",
        options: [
          "Administer IV fentanyl 2 minutes before the procedure",
          "Place 0.1-0.5 mL of 24% sucrose solution on the anterior tongue 2 minutes before the heel stick and offer a pacifier",
          "Apply a topical anesthetic cream to the heel 30 minutes before the procedure",
          "Restrain the neonate's limbs to prevent movement during the procedure"
        ],
        correct: 1,
        rationale: "Oral sucrose solution (24%) administered 2 minutes before the procedure combined with non-nutritive sucking (pacifier) is the evidence-based first-line intervention for minor procedural pain such as heel sticks. It activates endogenous opioid pathways through sweet taste receptors. IV fentanyl is reserved for more significant pain."
      },
      {
        question: "A practical nurse is assessing a neonate using the NIPS (Neonatal Infant Pain Scale) and obtains a score of 5. What does this score indicate?",
        options: [
          "The neonate is comfortable and no intervention is needed",
          "The neonate is in pain and non-pharmacological and/or pharmacological interventions should be implemented",
          "The neonate needs only repositioning and no further assessment",
          "The NIPS score is invalid and a different tool should be used"
        ],
        correct: 1,
        rationale: "A NIPS score of 4 or higher indicates pain requiring intervention. A score of 5 confirms the neonate is experiencing clinically significant pain. The practical nurse should implement comfort measures (swaddling, facilitated tucking, sucrose, skin-to-skin) and notify the supervising nurse if pharmacological intervention may be needed."
      },
      {
        question: "Why do neonates have an ENHANCED pain response compared to older children and adults?",
        options: [
          "Neonates have fewer nociceptors than adults, making each receptor more sensitive",
          "Neonates have immature descending inhibitory pathways that normally dampen pain signals, resulting in less modulation of incoming pain",
          "Neonates have fully myelinated pain fibers that transmit signals faster than adults",
          "Neonates produce more endogenous opioids than adults, causing a paradoxical pain increase"
        ],
        correct: 1,
        rationale: "Neonates have immature descending inhibitory pathways from the brainstem that normally modulate and reduce pain signal transmission. Without this dampening effect, pain signals reach the brain with less modulation, resulting in enhanced pain perception. Additionally, neonates have lower thresholds for pain sensitization and higher cutaneous nerve fiber density."
      }
    ]
  },

  "neonatal-reflexes-rpn": {
    title: "Neonatal Reflexes for Practical Nurses",
    cellular: {
      title: "Neurological Basis of Neonatal Primitive Reflexes",
      content: "Neonatal reflexes, also called primitive or infantile reflexes, are involuntary motor responses to specific stimuli that are mediated by the brainstem and spinal cord. These reflexes are present at birth (or shortly after) in neurologically intact neonates and follow a predictable developmental timeline of emergence and disappearance. Their presence at the expected age indicates normal brainstem and spinal cord function, while their absence, asymmetry, or persistence beyond the expected age signals potential neurological pathology requiring further evaluation.\n\nPrimitive reflexes are generated by neural circuits in the brainstem and spinal cord that operate independently of cortical (higher brain) control. As the cerebral cortex matures during the first year of life, cortical pathways develop the ability to inhibit these lower-level reflexes. This cortical inhibition causes the gradual disappearance of primitive reflexes, which is replaced by voluntary, purposeful motor behaviors. The persistence of primitive reflexes beyond their expected disappearance age suggests that cortical maturation is delayed or disrupted, as seen in conditions such as cerebral palsy, hypoxic-ischemic encephalopathy, or chromosomal abnormalities.\n\nThe Moro reflex (startle reflex) is elicited by allowing the neonate's head to drop back slightly (approximately 30 degrees) while supporting the body. The normal response has two phases: first, the arms abduct with fingers extended and the back arches (extension phase), followed by arm adduction with flexion as if embracing (flexion phase). This reflex appears at birth, peaks at 1 month, and disappears by 3-6 months. An asymmetric Moro reflex (present on one side but absent or diminished on the other) is a significant finding suggesting brachial plexus injury (Erb palsy if the upper arm is affected, Klumpke palsy if the hand is affected), clavicle fracture, or hemiplegia.\n\nThe rooting reflex is triggered by stroking the neonate's cheek or corner of the mouth, causing the neonate to turn toward the stimulus and open the mouth in preparation for feeding. The sucking reflex is activated when an object touches the roof of the mouth (hard palate), initiating rhythmic sucking movements. These feeding-related reflexes are present at birth (rooting appears around 32 weeks gestation, sucking around 34 weeks) and gradually diminish by 3-4 months as voluntary feeding behaviors develop. Absent or weak rooting and sucking reflexes in a full-term neonate may indicate neurological depression from birth asphyxia, sedating medications, or congenital neurological conditions.\n\nThe palmar grasp reflex is elicited by placing a finger or object in the neonate's palm, causing the fingers to flex and grasp the object. This reflex is present from birth and disappears by 4-6 months as voluntary grasping develops. The plantar grasp reflex is elicited by pressing on the ball of the foot, causing the toes to curl downward; it disappears by 9-12 months.\n\nThe Babinski reflex (plantar reflex) is assessed by firmly stroking the lateral sole of the foot from heel to toe. In neonates and infants up to approximately 12-24 months, the normal response is dorsiflexion (upward fanning) of the great toe with fanning of the remaining toes. This is a NORMAL finding in neonates because the corticospinal tracts are not yet fully myelinated. After 2 years of age, a positive Babinski sign (upgoing toe) becomes abnormal and suggests upper motor neuron disease.\n\nThe tonic neck reflex (fencing reflex) is observed when the neonate's head is turned to one side while supine: the arm and leg on the side the head faces extend while the opposite arm and leg flex (fencer's posture). This appears around 2 months, becomes most prominent at 2-4 months, and disappears by 6 months. Persistent tonic neck reflex beyond 6 months interferes with rolling, sitting, and midline hand use and is associated with cerebral palsy.\n\nThe stepping reflex is demonstrated by holding the neonate upright with feet touching a flat surface, producing alternating stepping movements. Present at birth, it disappears by 2 months and re-emerges as voluntary walking around 12 months. The practical nurse must understand each reflex's normal presentation, expected timeline, and clinical significance of abnormal findings in order to perform accurate neurological assessments and report deviations promptly."
    },
    riskFactors: [
      "Prematurity (reflexes may be diminished or absent before expected gestational age of emergence)",
      "Birth asphyxia or hypoxic-ischemic encephalopathy (depressed or absent reflexes at birth)",
      "Birth trauma including brachial plexus injury, clavicle fracture, or cephalohematoma (asymmetric reflexes)",
      "Maternal medications during labor (magnesium sulfate, opioids, general anesthesia can temporarily depress neonatal reflexes)",
      "Congenital neurological conditions (cerebral palsy, Down syndrome, spinal muscular atrophy, neural tube defects)",
      "Neonatal sepsis or meningitis (altered reflexes due to CNS infection)",
      "Kernicterus or severe neonatal jaundice (bilirubin neurotoxicity affecting brainstem and basal ganglia)"
    ],
    diagnostics: [
      "Systematic neonatal reflex assessment: evaluate all primitive reflexes during the newborn physical examination within 24 hours of birth; document presence, strength, symmetry, and any abnormalities",
      "Gestational age assessment (Ballard or Dubowitz score): correlate reflex findings with gestational maturity; reflexes emerge at predictable gestational ages (rooting at 32 weeks, sucking at 34 weeks, Moro at 28-32 weeks)",
      "Cranial ultrasound: if abnormal reflex findings suggest intracranial pathology (absent Moro, persistent seizures); evaluates for intraventricular hemorrhage, periventricular leukomalacia, or structural abnormalities",
      "MRI of the brain: gold standard imaging for evaluating suspected neurological injury or malformation when reflex abnormalities persist; typically performed after initial stabilization",
      "Developmental screening at well-child visits: ongoing monitoring for appropriate reflex disappearance and emergence of voluntary motor milestones; Denver Developmental Screening Test (DDST) or Ages and Stages Questionnaire (ASQ)",
      "Electromyography (EMG) and nerve conduction studies: performed if asymmetric reflexes suggest peripheral nerve injury (brachial plexus injury, spinal cord lesion); determines location and severity of nerve damage"
    ],
    management: [
      "Document baseline reflex assessment within 24 hours of birth using standardized assessment form; note each reflex as present, absent, weak, exaggerated, or asymmetric",
      "Report absent, asymmetric, or exaggerated reflexes to the physician or nurse practitioner immediately for further neurological evaluation",
      "For asymmetric Moro reflex: assess for clavicle fracture (crepitus, swelling over clavicle) and brachial plexus injury (arm positioning, spontaneous movement); immobilize affected arm as ordered and handle gently",
      "Support feeding in neonates with weak rooting or sucking reflexes: positioning assistance, paced bottle feeding, supplemental feeding devices, and occupational therapy consultation as needed",
      "Educate parents about normal reflex behaviors: explain that the Moro (startle) reflex is normal and decreases with age, that the palmar grasp is not intentional but reflexive, and that Babinski response (toe fanning) is normal in infants",
      "Schedule follow-up developmental assessments: ensure reflexes are disappearing on the expected timeline; persistent primitive reflexes beyond 6 months require physician referral",
      "Implement developmental care: provide appropriate sensory stimulation (visual, auditory, tactile, vestibular) that supports neurological maturation and the transition from reflexive to voluntary motor behaviors"
    ],
    nursingActions: [
      "Perform complete primitive reflex assessment during the newborn exam: test Moro, rooting, sucking, palmar grasp, plantar grasp, Babinski, tonic neck, and stepping reflexes; document presence, strength, and symmetry of each",
      "Use correct technique for each reflex: Moro (support head and body, allow head to drop back 30 degrees); rooting (stroke cheek near mouth); sucking (place gloved finger on hard palate); Babinski (stroke lateral sole firmly from heel to toe)",
      "Immediately report asymmetric Moro reflex to the physician -- this may indicate brachial plexus injury or clavicle fracture requiring imaging and orthopedic consultation",
      "Assess rooting and sucking reflexes before each feeding to evaluate the neonate's readiness and ability to feed safely; report weak or absent feeding reflexes as they may indicate neurological depression",
      "Monitor for reflex persistence at well-child follow-up visits: document that primitive reflexes are disappearing on schedule and voluntary motor milestones are emerging appropriately",
      "Handle the neonate gently and avoid sudden movements that trigger exaggerated Moro responses, which can cause distress; when repositioning, support the head and body together to minimize startle",
      "Educate parents on the significance of reflexes: explain what each reflex indicates, the expected disappearance timeline, and which changes should prompt medical attention (persistence beyond expected age, new asymmetry, or loss of previously present reflexes)"
    ],
    assessmentFindings: [
      "Moro reflex (startle): arms abduct with fingers extended then adduct in embracing motion; present at birth, disappears by 3-6 months; asymmetry suggests brachial plexus injury or clavicle fracture",
      "Rooting reflex: neonate turns head toward stimulus when cheek is stroked and opens mouth; present at birth (32 weeks gestation), disappears by 3-4 months; absence in full-term neonate suggests CNS depression",
      "Sucking reflex: rhythmic sucking when object touches hard palate; present at birth (34 weeks gestation), transitions to voluntary sucking by 3-4 months; weak or absent suck indicates neurological compromise",
      "Palmar grasp reflex: fingers flex and grip when object placed in palm; present at birth, disappears by 4-6 months; persistence beyond 6 months suggests upper motor neuron pathology",
      "Babinski reflex: dorsiflexion of great toe with fanning of other toes when sole is stroked; NORMAL in neonates until 12-24 months; positive Babinski after age 2 is abnormal and indicates upper motor neuron disease",
      "Tonic neck reflex (fencing): arm and leg extend on the side head faces while opposite side flexes; appears at 2 months, disappears by 6 months; persistence beyond 6 months is associated with cerebral palsy",
      "Stepping reflex: alternating stepping movements when feet touch flat surface; present at birth, disappears by 2 months; re-emerges as voluntary walking around 12 months"
    ],
    signs: {
      left: [
        "Mild asymmetry of Moro reflex requiring further observation",
        "Weak but present sucking reflex in a near-term neonate",
        "Slightly exaggerated startle response to environmental stimuli",
        "Mild hypotonia with reduced but present grasp reflexes",
        "Transient tremors during reflex testing that resolve quickly",
        "Delayed but emerging feeding reflexes in a premature neonate"
      ],
      right: [
        "Completely absent Moro reflex in a full-term neonate (severe CNS depression)",
        "Asymmetric Moro with unilateral arm extension failure (brachial plexus injury or fracture)",
        "Absent rooting and sucking reflexes with inability to feed (brainstem dysfunction)",
        "Persistent primitive reflexes beyond 6 months of age (cerebral palsy or cortical injury)",
        "Opisthotonus (arched back) with exaggerated reflexes (kernicterus or meningitis)",
        "Loss of previously present reflexes (progressive neurological deterioration)"
      ]
    },
    medications: [
      {
        name: "Reflex Assessment Form",
        type: "Assessment Tool",
        action: "Standardized documentation tool for systematically recording the presence, absence, strength, and symmetry of all primitive reflexes during the neonatal neurological examination; provides a baseline against which future assessments can be compared to identify changes or delays",
        sideEffects: "Not applicable -- this is a documentation tool, not a medication; however, inconsistent use or improper technique during reflex testing can lead to inaccurate findings and missed diagnoses",
        contra: "Not applicable as a documentation tool; reflex testing should be deferred in medically unstable neonates until they are physiologically stable enough to tolerate the assessment without distress",
        pearl: "Complete the reflex assessment form within 24 hours of birth and at every subsequent well-child visit; always compare bilateral responses for symmetry; note the gestational age when interpreting findings as preterm neonates have age-appropriate differences in reflex presentation"
      },
      {
        name: "Developmental Screening Tool (Denver II / ASQ)",
        type: "Assessment Tool",
        action: "Validated screening instruments used to monitor developmental milestones including the expected disappearance of primitive reflexes and emergence of voluntary motor skills; the Denver Developmental Screening Test (Denver II) evaluates four domains (gross motor, fine motor-adaptive, language, personal-social) and the Ages and Stages Questionnaire (ASQ) is a parent-completed screening tool",
        sideEffects: "Not applicable as a screening tool; false-positive results may cause unnecessary parental anxiety; false-negative results may delay identification of developmental concerns",
        contra: "Not applicable; however, screening results must be interpreted in the context of gestational age (use corrected age for preterm infants until 24-36 months), cultural factors, and overall clinical picture",
        pearl: "Developmental screening should be performed at 9, 18, and 24-30 months per recommended guidelines; persistent primitive reflexes (Moro beyond 6 months, palmar grasp beyond 6 months, tonic neck beyond 6 months) detected during screening require immediate referral for comprehensive neurological evaluation"
      },
      {
        name: "Neurological Checklist",
        type: "Assessment Tool",
        action: "Comprehensive checklist that guides the practical nurse through a systematic neonatal neurological assessment including muscle tone evaluation (resting posture, pull-to-sit, ventral suspension), primitive reflex testing (all major reflexes), cranial nerve assessment (pupil response, facial symmetry, gag reflex), and behavioral state observation (alertness, consolability, habituation)",
        sideEffects: "Not applicable as an assessment tool; incomplete assessments may miss neurological abnormalities; documentation must include all components for clinical value",
        contra: "Not applicable; defer comprehensive neurological assessment in critically ill or hemodynamically unstable neonates until medical stability is achieved; perform abbreviated assessment of key reflexes (Moro, sucking, grasp) even in NICU setting",
        pearl: "The neurological checklist should be completed at birth, before discharge, and at follow-up visits; always assess in a warm, quiet environment when the neonate is in a quiet alert state for the most reliable results; a hungry or overstimulated neonate will produce unreliable reflex responses"
      }
    ],
    pearls: [
      "An asymmetric Moro reflex is NEVER normal -- if one arm fails to abduct and extend during the Moro test, suspect clavicle fracture (palpate for crepitus and swelling) or brachial plexus injury (Erb palsy affects C5-C6 causing waiter's tip posture; Klumpke palsy affects C8-T1 causing claw hand)",
      "The Babinski reflex (upgoing great toe with fanning) is a NORMAL finding in neonates and infants up to 12-24 months because the corticospinal tracts are not yet fully myelinated -- it only becomes a pathological sign after age 2 years",
      "Persistence of ANY primitive reflex beyond its expected disappearance age is a red flag for cerebral palsy or other upper motor neuron pathology -- the most clinically significant is persistence of the tonic neck reflex beyond 6 months, which prevents midline hand use and rolling",
      "Rooting and sucking reflexes emerge at 32 and 34 weeks gestation respectively -- their absence in a full-term neonate is abnormal and suggests CNS depression from birth asphyxia, maternal medications, or infection",
      "Always test reflexes when the neonate is in a quiet alert state (Brazelton state 4) -- testing during deep sleep, active crying, or immediately after feeding produces unreliable results and may lead to false conclusions about neurological status",
      "Loss of a previously present reflex is MORE concerning than initial absence -- if a neonate had a normal Moro at birth but loses it at 48 hours, this suggests progressive neurological deterioration (intracranial hemorrhage, meningitis, metabolic crisis) and requires urgent evaluation",
      "Parent education about reflexes reduces anxiety and promotes bonding -- explain that the Moro reflex is a normal startle response that will disappear by 6 months, the palmar grasp is reflexive (not intentional holding), and stepping movements do not mean the baby is ready to walk"
    ],
    quiz: [
      {
        question: "During a newborn assessment, a practical nurse observes that when the Moro reflex is tested, the left arm abducts and extends normally but the right arm remains limp at the neonate's side. Which finding should the nurse suspect?",
        options: [
          "Normal variation in reflex strength between sides",
          "Right-sided brachial plexus injury or clavicle fracture",
          "The neonate is too sleepy for accurate testing and should be reassessed later",
          "Left-sided neurological injury causing exaggerated left arm response"
        ],
        correct: 1,
        rationale: "An asymmetric Moro reflex is never normal. When one arm fails to respond while the other abducts and extends normally, the non-responding side should be evaluated for clavicle fracture (palpate for crepitus and swelling) or brachial plexus injury (Erb palsy from C5-C6 injury causes waiter's tip posture with the arm adducted and internally rotated). This finding must be reported immediately."
      },
      {
        question: "A parent asks the practical nurse why the baby's toes fan upward when the sole of the foot is stroked. Which response by the practical nurse is most accurate?",
        options: [
          "This is an abnormal finding called a positive Babinski sign and indicates neurological damage",
          "This is a normal reflex in newborns called the Babinski reflex; it occurs because the nerve pathways in the spinal cord are not yet fully developed and will disappear by age 1-2 years",
          "This means the baby has strong reflexes and will walk earlier than expected",
          "This response indicates the baby is in pain and needs analgesic medication"
        ],
        correct: 1,
        rationale: "The Babinski reflex (dorsiflexion of the great toe with fanning of other toes) is a normal finding in neonates and infants up to 12-24 months. It occurs because the corticospinal tracts are not yet fully myelinated. After approximately 2 years of age, a positive Babinski sign becomes abnormal and suggests upper motor neuron disease."
      },
      {
        question: "At a 9-month well-child visit, a practical nurse notes that a previously healthy infant still demonstrates a strong palmar grasp reflex and tonic neck reflex. Which action is most appropriate?",
        options: [
          "Reassure the parent that these reflexes are normal at 9 months and will disappear soon",
          "Document the findings as normal developmental variation",
          "Report the persistent primitive reflexes to the physician as they should have disappeared by 6 months and may indicate neurological pathology",
          "Instruct the parent to perform reflex exercises at home to help the reflexes disappear"
        ],
        correct: 2,
        rationale: "The palmar grasp reflex normally disappears by 4-6 months and the tonic neck reflex by 6 months. Persistence of these primitive reflexes at 9 months is abnormal and suggests delayed cortical maturation, which is associated with conditions such as cerebral palsy. The practical nurse should report this finding to the physician for comprehensive neurological evaluation."
      }
    ]
  }
};

let injected = 0;
let total = Object.keys(lessons).length;
console.log(`\nInjecting ${total} Neuro/Neonatal lessons (Batch 34)...\n`);
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: ${injected}/${total} lessons injected.\n`);
if (injected < total) process.exit(1);
