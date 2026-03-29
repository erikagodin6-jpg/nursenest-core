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
  "grief-and-loss-rpn": {
    title: "Grief and Loss: Theories, Complicated Grief, and Therapeutic Support",
    cellular: {
      title: "Psychophysiology of Grief and the Stress Response",
      content: "Grief is a complex, multidimensional response to loss that involves psychological, physiological, social, and spiritual dimensions. When a person experiences a significant loss -- whether through death, disability, divorce, or other life-altering events -- the hypothalamic-pituitary-adrenal (HPA) axis is activated, triggering the release of cortisol, catecholamines, and other stress hormones. This neuroendocrine response produces measurable physiological changes including elevated heart rate, increased blood pressure, suppressed immune function, disrupted sleep architecture, and altered appetite regulation. Prolonged or intense grief activates the sympathetic nervous system chronically, which can contribute to cardiovascular events, immunosuppression, and increased susceptibility to illness -- a phenomenon sometimes called the broken heart syndrome or takotsubo cardiomyopathy in extreme cases. At the neurobiological level, functional MRI studies demonstrate that grief activates brain regions associated with pain processing (anterior cingulate cortex), emotional regulation (prefrontal cortex), memory (hippocampus), and reward circuitry (nucleus accumbens). The attachment system, originally described by Bowlby, explains why loss of a significant attachment figure triggers such profound distress: the bereaved person's neurological attachment circuitry continues to search for the lost person, creating persistent yearning and separation distress. Elisabeth Kubler-Ross described five stages of grief -- denial, anger, bargaining, depression, and acceptance -- though modern understanding recognizes these are not linear stages but rather common experiences that may occur in any order, overlap, or recur. William Worden proposed four tasks of mourning that provide a more active framework: accepting the reality of the loss, processing the pain of grief, adjusting to a world without the deceased, and finding an enduring connection with the deceased while embarking on a new life. Complicated grief (also called prolonged grief disorder, now recognized in the DSM-5-TR) occurs when the normal grieving process becomes prolonged and debilitating beyond 12 months, interfering with daily functioning. Risk factors for complicated grief include sudden or traumatic death, loss of a child, pre-existing psychiatric conditions, insecure attachment style, and limited social support. Perinatal loss -- including miscarriage, stillbirth, and neonatal death -- represents a unique form of grief because the loss occurs before or shortly after the anticipated beginning of a relationship, creating disenfranchised grief where society may minimize the significance of the loss. Cultural factors profoundly influence grief expression: some cultures encourage open emotional displays while others value stoicism; mourning periods, rituals, and beliefs about the afterlife vary widely and must be respected without judgment. The practical nurse plays a vital role in recognizing grief responses, providing therapeutic presence, facilitating communication, and identifying individuals who may benefit from referral to specialized bereavement services."
    },
    riskFactors: [
      "Sudden, unexpected, or traumatic death of a loved one (accident, suicide, homicide)",
      "Loss of a child or perinatal loss (miscarriage, stillbirth, neonatal death)",
      "Pre-existing mental health conditions (depression, anxiety, PTSD)",
      "Insecure attachment style or history of childhood trauma or abandonment",
      "Multiple concurrent losses or cumulative grief (serial bereavements)",
      "Limited social support network or social isolation",
      "Ambivalent or dependent relationship with the deceased"
    ],
    diagnostics: [
      "Grief assessment using validated tools: Inventory of Complicated Grief (ICG) or Prolonged Grief Disorder-13 (PG-13) to differentiate normal from complicated grief",
      "Mental health screening: PHQ-9 for depression and GAD-7 for anxiety, as grief can coexist with or trigger clinical depression and anxiety disorders",
      "Functional assessment: evaluate ability to perform activities of daily living, maintain employment, and fulfill role obligations",
      "Nutritional screening: assess for unintentional weight loss or gain, appetite changes, and dehydration secondary to grief-related anorexia",
      "Sleep assessment: document sleep patterns using sleep diary or Pittsburgh Sleep Quality Index; insomnia and hypersomnia are common in grief",
      "Substance use screening: CAGE questionnaire or AUDIT tool to identify alcohol or substance misuse as a maladaptive coping strategy"
    ],
    management: [
      "Provide therapeutic presence: sit with the patient, allow silence, and avoid cliches such as 'they are in a better place' or 'I know how you feel'",
      "Facilitate expression of grief: encourage the patient to share memories, feelings, and concerns at their own pace without judgment or time pressure",
      "Normalize the grief experience: educate that grief is individual, there is no 'right way' to grieve, and grief does not follow a predictable timeline",
      "Support cultural and spiritual practices: accommodate rituals, prayer, visits from religious leaders, and family customs regarding mourning and memorialization",
      "Refer to bereavement counseling or grief support groups when grief is prolonged, complicated, or interfering with daily functioning",
      "Coordinate with social work for practical needs: funeral planning assistance, financial resources, childcare support, and community services",
      "Monitor for suicidal ideation: conduct safety assessments when grief is accompanied by hopelessness, withdrawal, giving away possessions, or statements about wanting to die"
    ],
    nursingActions: [
      "Assess the patient's stage of grief and coping mechanisms using open-ended questions such as 'Can you tell me what you are experiencing right now?'",
      "Use therapeutic communication techniques: active listening, reflection, validation of feelings, open-ended questions, and comfortable silence",
      "Document grief-related assessment findings including emotional state, behavioral changes, sleep patterns, appetite, and functional status",
      "Report signs of complicated grief to the registered nurse or physician: persistent intense yearning beyond 12 months, inability to accept the loss, severe functional impairment",
      "Provide anticipatory guidance to families: explain what to expect during the dying process, what changes may occur after death, and available support resources",
      "Create a safe, private environment for grief expression: offer a quiet space, tissues, and privacy while remaining available and accessible",
      "Support family members and significant others: recognize that each family member may grieve differently and at different paces"
    ],
    assessmentFindings: [
      "Emotional responses: sadness, anger, guilt, anxiety, loneliness, numbness, yearning, relief (especially after prolonged illness of the deceased)",
      "Cognitive changes: difficulty concentrating, forgetfulness, preoccupation with the deceased, sense of disbelief, confusion about identity or purpose",
      "Physical symptoms: fatigue, insomnia or hypersomnia, appetite changes (anorexia or overeating), somatic complaints (chest tightness, headache, GI distress)",
      "Behavioral changes: social withdrawal, crying, restlessness, searching behavior, avoidance of reminders, or seeking out objects/places associated with the deceased",
      "Spiritual distress: questioning faith or meaning, anger at God/higher power, existential crisis, or renewed spiritual commitment",
      "Functional impairment: inability to perform work duties, neglect of self-care or hygiene, difficulty making decisions, withdrawal from previously enjoyed activities"
    ],
    signs: {
      left: [
        "Crying, sadness, and expressions of yearning for the deceased",
        "Insomnia or changes in sleep patterns",
        "Decreased appetite or changes in eating habits",
        "Difficulty concentrating or making decisions",
        "Social withdrawal from friends and usual activities",
        "Fatigue and low energy levels"
      ],
      right: [
        "Suicidal ideation or statements about wanting to die or join the deceased",
        "Severe functional impairment lasting beyond 12 months (complicated grief)",
        "Psychotic features: hallucinations of the deceased beyond brief experiences",
        "Complete refusal to eat or drink with signs of dehydration",
        "Self-harm behaviors or substance abuse as coping mechanism",
        "Severe panic attacks or inability to leave the home"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective serotonin reuptake inhibitor (SSRI) antidepressant",
        action: "Selectively inhibits the reuptake of serotonin at the presynaptic neuronal membrane, increasing serotonin availability in the synaptic cleft. This enhances serotonergic neurotransmission in the central nervous system, which helps regulate mood, anxiety, sleep, and appetite. Sertraline does not treat grief itself but may be prescribed when grief is complicated by a major depressive episode or anxiety disorder.",
        sideEffects: "Nausea, diarrhea, insomnia, sexual dysfunction (decreased libido, anorgasmia), headache, dizziness, dry mouth, weight changes",
        contra: "Concurrent use with MAOIs (risk of serotonin syndrome -- wait 14 days between discontinuation of MAOI and initiation of SSRI); concurrent use with pimozide; caution in patients with bleeding disorders or on anticoagulants",
        pearl: "Takes 4-6 weeks for full therapeutic effect; educate patient that medication will not eliminate grief but may help manage depressive symptoms that interfere with functioning; monitor for increased suicidal ideation in first 2-4 weeks, especially in patients under 25 years"
      },
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine anxiolytic and sedative",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor complex by increasing the frequency of chloride channel opening. This produces anxiolytic, sedative, muscle relaxant, and anticonvulsant effects. In acute grief, it may be prescribed short-term for severe anxiety, panic attacks, or acute insomnia that prevents functioning.",
        sideEffects: "Drowsiness, sedation, dizziness, confusion, respiratory depression (especially combined with opioids or alcohol), anterograde amnesia, paradoxical agitation in elderly",
        contra: "Acute narrow-angle glaucoma; severe respiratory insufficiency; sleep apnea syndrome; concurrent use with opioids (enhanced CNS and respiratory depression); pregnancy (teratogenic risk)",
        pearl: "Prescribe for shortest duration possible (generally less than 2-4 weeks for grief-related anxiety) due to high risk of tolerance, dependence, and withdrawal; use lowest effective dose in elderly patients; do not discontinue abruptly after prolonged use -- taper gradually"
      },
      {
        name: "Trazodone (Desyrel)",
        type: "Serotonin antagonist and reuptake inhibitor (SARI) -- antidepressant used primarily for insomnia",
        action: "Blocks serotonin 5-HT2A receptors and weakly inhibits serotonin reuptake, producing sedative and antidepressant effects. The 5-HT2A antagonism promotes sleep onset and increases slow-wave sleep without the dependence risk associated with benzodiazepines. At low doses (25-100 mg), it is primarily used as a sleep aid rather than an antidepressant.",
        sideEffects: "Morning drowsiness (hangover effect), dizziness, dry mouth, orthostatic hypotension, priapism (rare but requires emergency intervention), blurred vision",
        contra: "Concurrent use with MAOIs; patients recovering from acute myocardial infarction; caution with other QT-prolonging medications",
        pearl: "Commonly prescribed at low doses (25-100 mg at bedtime) for grief-related insomnia as a safer alternative to benzodiazepines; advise patient to take 30 minutes before bedtime with a light snack to reduce dizziness; male patients must be educated about priapism (erection lasting more than 4 hours) as a medical emergency requiring immediate treatment"
      }
    ],
    pearls: [
      "Kubler-Ross stages (denial, anger, bargaining, depression, acceptance) are NOT sequential steps that every person must complete -- they are common grief experiences that can occur in any order, overlap, or be absent entirely",
      "Worden's four tasks of mourning provide a more clinically useful framework: (1) accept the reality of the loss, (2) process the pain of grief, (3) adjust to life without the deceased, (4) find an enduring connection while moving forward",
      "Complicated (prolonged) grief disorder is now a DSM-5-TR diagnosis: persistent, intense yearning and preoccupation with the deceased lasting at least 12 months that significantly impairs daily functioning",
      "Perinatal loss is often disenfranchised grief -- offer the same level of bereavement support as for any death; never minimize the loss by saying 'you can have another baby'",
      "Avoid platitudes such as 'everything happens for a reason,' 'time heals all wounds,' or 'at least they are not suffering' -- these invalidate the person's pain and shut down communication",
      "Cultural grief practices vary enormously: some cultures expect wailing and public mourning while others value quiet composure; assess each patient's cultural background and respect their practices",
      "Always screen grieving patients for suicidal ideation, especially in the first year after loss, after loss of a child, or when the patient expresses feelings of hopelessness or a desire to join the deceased"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient whose spouse died three weeks ago. The patient is crying and says 'I keep expecting to hear the door open and see them walk in.' Which response by the practical nurse is most therapeutic?",
        options: [
          "That feeling will pass with time, try to stay busy",
          "It sounds like you are having a very normal response to your loss. Can you tell me more about what you are experiencing?",
          "You should consider joining a support group right away",
          "Your spouse is in a better place now and would not want you to be sad"
        ],
        correct: 1,
        rationale: "Validating the patient's experience as normal and using an open-ended invitation to share demonstrates therapeutic communication. Searching behavior (expecting the deceased to return) is a common early grief response. Offering platitudes, prescribing activities, or minimizing grief shuts down communication."
      },
      {
        question: "A patient lost their infant to stillbirth two days ago and refuses to hold or look at the baby. The family is insisting the patient should hold the baby for closure. What is the most appropriate action by the practical nurse?",
        options: [
          "Encourage the patient to hold the baby because research shows it helps with closure",
          "Tell the family that the patient should be forced to see the baby before it is too late",
          "Respect the patient's decision, offer memory-making options such as photographs or footprints, and let them know the option remains available",
          "Remove the baby from the room immediately and do not mention it again"
        ],
        correct: 2,
        rationale: "The patient's autonomy and readiness must be respected. Offering alternatives (photographs, footprints, lock of hair) preserves options without forcing participation. Some parents may choose to hold their baby later or may find comfort in other memory-making activities. Forcing contact or avoiding the topic entirely can worsen psychological outcomes."
      },
      {
        question: "Fourteen months after the death of her mother, a patient reports persistent intense yearning, inability to accept the death, avoidance of all reminders, and inability to return to work. The practical nurse recognizes these findings are most consistent with which condition?",
        options: [
          "Normal grief that will resolve without intervention",
          "Major depressive disorder",
          "Prolonged grief disorder (complicated grief)",
          "Post-traumatic stress disorder"
        ],
        correct: 2,
        rationale: "Prolonged grief disorder (complicated grief) is characterized by persistent, intense yearning, difficulty accepting the death, avoidance, and significant functional impairment lasting at least 12 months after the loss. While grief and depression can overlap, the hallmark features of complicated grief are preoccupation with the deceased and inability to accept the reality of the loss."
      }
    ]
  },

  "family-support-eol-rpn": {
    title: "Family Support at End of Life: Anticipatory Grief, Caregiver Burden, and Bereavement Care",
    cellular: {
      title: "Pathophysiology of the Dying Process and Family System Response",
      content: "End-of-life care encompasses the final days to weeks of a patient's life when curative treatment is no longer effective or desired, and the focus shifts to comfort, dignity, and quality of life. As death approaches, predictable physiological changes occur as organ systems progressively fail. The cardiovascular system demonstrates decreasing cardiac output with weakening peripheral pulses, mottling of the extremities (beginning with the knees, feet, and hands), and progressive hypotension. The respiratory system undergoes characteristic changes including Cheyne-Stokes respirations (a cyclical pattern of increasing then decreasing respiratory depth with periods of apnea), terminal congestion or the 'death rattle' caused by accumulation of secretions in the pharynx that the patient can no longer clear, and eventual respiratory failure. Neurological changes include progressive somnolence, withdrawal from environmental stimuli, decreased responsiveness, loss of reflexes, and eventual coma. Hearing is believed to be one of the last senses to be lost, which has important implications for family communication. Renal function declines with decreased urine output progressing to oliguria and anuria as blood flow to the kidneys diminishes. The gastrointestinal system slows dramatically with loss of appetite (anorexia), decreased thirst, dysphagia, and eventual inability to swallow. The family system is profoundly affected during this period. Family systems theory, developed by Murray Bowen, describes how families function as interconnected emotional units where stress on one member affects all members. During end-of-life, families experience anticipatory grief -- mourning that occurs before the actual death in response to awareness of impending loss. Anticipatory grief can serve adaptive functions including gradual emotional preparation, opportunities for life review and closure, and time to address practical matters. However, it can also lead to premature emotional detachment, exhaustion from prolonged grieving, and family conflict about treatment decisions. Caregiver burden is a multidimensional concept encompassing physical exhaustion (sleep deprivation, neglect of own health), emotional strain (anxiety, depression, anticipatory grief), social isolation (withdrawal from work and relationships), financial stress (lost income, medical costs), and spiritual distress. Research demonstrates that caregivers have higher mortality rates, greater incidence of depression, and suppressed immune function compared to non-caregiving peers. Bereavement support does not end at the time of death; evidence-based palliative care programs provide structured bereavement follow-up for at least 13 months following the death, recognizing that grief reactions often intensify at anniversaries, holidays, and significant dates. The practical nurse serves as a critical presence throughout this process, providing symptom management, emotional support, family education, and coordination of interdisciplinary palliative care services."
    },
    riskFactors: [
      "Prolonged caregiving duration (months to years of progressive decline)",
      "Young age of the dying patient (death of a child or young adult is perceived as untimely)",
      "Unresolved family conflict or estrangement between patient and family members",
      "History of complicated grief or mental health disorders in family members",
      "Limited social support network or geographic distance from support systems",
      "Cultural or religious beliefs that conflict with the patient's end-of-life wishes",
      "Financial burden from caregiving (lost income, out-of-pocket medical expenses)"
    ],
    diagnostics: [
      "Palliative Performance Scale (PPS): measures functional status using five dimensions (ambulation, activity, self-care, intake, consciousness); scores below 30% indicate the final days of life",
      "Caregiver burden assessment: Zarit Burden Interview (ZBI) measures subjective burden across physical, emotional, social, and financial domains; scores above 60 indicate severe burden",
      "Family assessment: genogram and ecomap to identify family structure, relationships, resources, and potential sources of conflict or support",
      "Grief risk assessment: use Bereavement Risk Assessment Tool (BRAT) to identify family members at high risk for complicated grief who may need proactive bereavement support",
      "Spiritual assessment: use FICA tool (Faith, Importance, Community, Address) to assess spiritual needs and preferences for the patient and family",
      "Pain and symptom assessment: Edmonton Symptom Assessment System (ESAS) to monitor symptom burden and ensure comfort during the dying process"
    ],
    management: [
      "Manage terminal symptoms: administer medications for pain, dyspnea, nausea, restlessness, and secretions as prescribed to ensure patient comfort",
      "Provide family education about the dying process: explain expected physiological changes (mottling, Cheyne-Stokes breathing, death rattle, decreased consciousness) to reduce fear and anxiety",
      "Facilitate family presence: support family members who wish to be present at the bedside; provide comfortable chairs, blankets, and access to food and beverages",
      "Support advance care planning discussions: ensure goals of care are documented and communicated among all team members; review code status and comfort measures orders",
      "Coordinate spiritual care: arrange visits from chaplains, religious leaders, or spiritual advisors based on patient and family preferences",
      "Arrange family conferences with the interdisciplinary team to address questions, provide updates, and ensure shared understanding of prognosis and care goals",
      "Provide bereavement support after death: offer condolences, allow time with the body, explain post-mortem procedures, and provide bereavement resource information"
    ],
    nursingActions: [
      "Assess family coping and emotional status at each visit; document observations including verbal expressions, behavioral cues, and interaction patterns",
      "Provide education about what to expect in the final hours: decreased responsiveness, irregular breathing patterns, cool and mottled extremities, decreased urine output",
      "Reposition the patient for comfort every 2 hours; elevate the head of bed to reduce secretion pooling; provide mouth care every 1-2 hours",
      "Monitor and report changes in pain and symptom status; administer breakthrough medications as prescribed and evaluate effectiveness within 30 minutes",
      "Create a calm, peaceful environment: dim lighting, minimize unnecessary interventions, allow personal items and music, and keep the environment quiet",
      "Support family members in providing direct care if desired: demonstrate gentle touch, mouth care, and how to speak to the patient even when unresponsive",
      "After death, provide post-mortem care with dignity: bathe the body, remove medical devices per facility policy, and prepare the body for family viewing"
    ],
    assessmentFindings: [
      "Imminent death signs: Cheyne-Stokes respirations, terminal congestion (death rattle), mottling of extremities beginning distally, mandibular breathing (jaw movement with each breath)",
      "Decreased level of consciousness: progressive unresponsiveness, inability to swallow, loss of gag reflex, fixed and dilated pupils",
      "Cardiovascular changes: weak and thready pulse, hypotension, peripheral cyanosis, cool extremities with mottling progressing centrally",
      "Caregiver distress indicators: tearfulness, exhaustion, insomnia, inability to leave the bedside, neglect of personal needs, expressions of guilt or helplessness",
      "Anticipatory grief manifestations: family members rehearsing or planning funeral arrangements, emotional detachment, increased visiting frequency, life review conversations",
      "Family conflict indicators: disagreements about care decisions, avoidance of certain family members, anger directed at healthcare providers, difficulty communicating with each other"
    ],
    signs: {
      left: [
        "Family members expressing sadness, fear, or uncertainty about the dying process",
        "Mild sleep disturbances and appetite changes in caregivers",
        "Questions about expected timeline and what to expect",
        "Emotional lability (alternating between tears and calm composure)",
        "Desire to remain at the bedside continuously",
        "Requests for spiritual support or chaplain visits"
      ],
      right: [
        "Caregiver collapse: severe physical exhaustion, inability to continue providing care",
        "Suicidal ideation or desire to die with the patient",
        "Severe family conflict that prevents safe and consistent patient care",
        "Caregiver refusing to allow comfort medications (e.g., morphine) due to fear of hastening death",
        "Complete emotional shutdown: inability to communicate, make decisions, or engage with reality",
        "Signs of caregiver self-neglect: missed medications, untreated medical conditions, severe weight loss"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system and peripheral tissues, inhibiting ascending pain pathways and altering the perception and emotional response to pain. In end-of-life care, morphine also reduces dyspnea by decreasing the medullary respiratory center's sensitivity to CO2, reducing the sensation of air hunger. Low-dose morphine (1-5 mg SC or sublingual every 4 hours) is the gold standard for managing both pain and dyspnea in the actively dying patient.",
        sideEffects: "Respiratory depression (dose-dependent), constipation, nausea, sedation, urinary retention, pruritus, myoclonus (at high doses or with renal impairment)",
        contra: "Known hypersensitivity; severe respiratory depression without monitoring; paralytic ileus; use with caution in renal impairment (active metabolites accumulate)",
        pearl: "Educate families that appropriately dosed morphine for comfort does NOT hasten death -- this is a common fear that may prevent adequate symptom management; the principle of double effect ethically supports using medications to relieve suffering even if they may secondarily affect the dying process"
      },
      {
        name: "Haloperidol (Haldol)",
        type: "Typical (first-generation) antipsychotic -- butyrophenone class",
        action: "Blocks dopamine D2 receptors in the mesolimbic and mesocortical pathways of the brain. In end-of-life care, haloperidol is the first-line agent for terminal delirium (agitation, restlessness, hallucinations, confusion) and also has antiemetic properties through dopamine blockade in the chemoreceptor trigger zone. It can be administered orally, subcutaneously, or intravenously.",
        sideEffects: "Extrapyramidal symptoms (dystonia, akathisia, parkinsonism), sedation, QT prolongation, neuroleptic malignant syndrome (rare), orthostatic hypotension",
        contra: "Severe CNS depression; Parkinson disease (worsens dopaminergic symptoms); prolonged QT interval; concurrent use with other QT-prolonging agents",
        pearl: "Haloperidol 0.5-2 mg SC or IV every 4-8 hours is the preferred first-line agent for terminal delirium; avoid benzodiazepines as monotherapy for delirium (they can paradoxically worsen confusion in elderly patients); monitor ECG if using IV route due to QT prolongation risk"
      },
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine anxiolytic and sedative",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor complex by increasing the frequency of chloride channel opening, producing anxiolytic, sedative, anticonvulsant, and muscle relaxant effects. In end-of-life care, lorazepam is used for terminal anxiety, seizures, and as an adjunct to haloperidol for refractory terminal agitation. It can be administered sublingually when the patient can no longer swallow.",
        sideEffects: "Sedation, respiratory depression (additive with opioids), paradoxical agitation (especially in elderly), ataxia, confusion, anterograde amnesia",
        contra: "Severe respiratory insufficiency; acute narrow-angle glaucoma; concurrent use with opioids requires dose adjustment and monitoring; sleep apnea",
        pearl: "Sublingual lorazepam (0.5-1 mg) is extremely useful when the patient can no longer swallow oral medications; in combination with haloperidol, it provides effective management of terminal agitation when haloperidol alone is insufficient; always use the lowest effective dose to balance comfort with excessive sedation"
      }
    ],
    pearls: [
      "Hearing is believed to be the last sense lost before death -- always speak to the patient as if they can hear you, and encourage family members to do the same; this provides comfort to both the patient and the family",
      "The 'death rattle' (terminal congestion) is caused by secretions pooling in the pharynx of the unresponsive patient and is typically more distressing to the family than to the patient; reposition the patient on their side and consider glycopyrrolate to reduce secretions",
      "Educate families that decreased oral intake near death is a normal part of the dying process, not starvation -- forcing food or fluids can increase discomfort by causing aspiration, edema, and respiratory congestion",
      "Anticipatory grief is real grief that occurs before the death -- validate it as a normal and important process; families may feel guilty for grieving someone who is still alive",
      "The principle of double effect ethically justifies using medications (such as morphine) to relieve suffering even if they may have the secondary, unintended effect of hastening death -- the primary intention must always be comfort",
      "Bereavement support should extend at least 13 months after the death to cover the first anniversary and all major milestones; provide families with grief resource information before discharge",
      "Mottling of the extremities (livedo reticularis pattern) is one of the most reliable indicators that death is imminent, typically occurring within 24-48 hours; educate the family that this is a normal part of the dying process"
    ],
    quiz: [
      {
        question: "A family member of a dying patient is upset about the loud, gurgling breathing (death rattle) and asks the practical nurse to suction the patient. What is the most appropriate response?",
        options: [
          "Immediately suction the patient to relieve the family's distress",
          "Explain that the sound is caused by secretions the patient cannot clear, that it is typically not distressing to the patient, and reposition the patient on their side to help",
          "Tell the family that nothing can be done about the breathing sounds",
          "Administer morphine to stop the breathing pattern"
        ],
        correct: 1,
        rationale: "Terminal congestion (death rattle) is caused by secretions in the pharynx of an unconscious patient and is generally not distressing to the patient. Deep suctioning can cause trauma and discomfort. Repositioning the patient on their side allows secretions to drain naturally. Medications such as glycopyrrolate can reduce secretion production if needed."
      },
      {
        question: "A caregiver who has been providing 24-hour care for their dying spouse for six months reports severe insomnia, 15-pound weight loss, and says 'I just cannot do this anymore.' The practical nurse recognizes this presentation is most consistent with which condition?",
        options: [
          "Normal anticipatory grief",
          "Prolonged grief disorder",
          "Severe caregiver burden",
          "Major depressive disorder"
        ],
        correct: 2,
        rationale: "Severe caregiver burden is characterized by physical exhaustion, weight loss, insomnia, and feelings of being unable to continue in the caregiving role. While this caregiver may also experience anticipatory grief and depressive symptoms, the cluster of physical deterioration combined with the statement of inability to continue specifically reflects caregiver burden. Immediate interventions include respite care and support services."
      },
      {
        question: "A family member refuses to allow the nurse to administer the prescribed morphine to their dying father, stating 'Morphine will kill him faster.' What is the most appropriate action by the practical nurse?",
        options: [
          "Respect the family's wishes and withhold the morphine without further discussion",
          "Administer the morphine anyway because it is prescribed by the physician",
          "Acknowledge the family's concern, educate about the difference between comfort dosing and euthanasia, explain the principle of double effect, and contact the physician if concerns persist",
          "Tell the family they are wrong and that morphine does not hasten death"
        ],
        correct: 2,
        rationale: "Many families fear that opioids will hasten death. The practical nurse should acknowledge this concern without dismissing it, then educate about appropriate comfort dosing: low-dose morphine used for pain and dyspnea relief does not hasten death when titrated to symptom relief. The principle of double effect supports using medications for comfort even if there is a theoretical secondary risk. Involving the physician helps address persistent concerns."
      }
    ]
  },

  "galactosemia-rpn": {
    title: "Galactosemia: Metabolic Deficiency, Newborn Screening, and Dietary Management",
    cellular: {
      title: "Pathophysiology of Galactose Metabolism and Enzyme Deficiency",
      content: "Galactosemia is an autosomal recessive inborn error of metabolism in which the body cannot properly metabolize galactose, a simple sugar that is a component of lactose (the primary carbohydrate in breast milk and cow's milk formula). Lactose is a disaccharide composed of glucose and galactose; it is broken down by the enzyme lactase in the small intestine into its two component monosaccharides. In normal metabolism, free galactose undergoes a three-step enzymatic conversion known as the Leloir pathway to ultimately be converted to glucose-1-phosphate, which can enter glycolysis for energy production. The three enzymes in this pathway are galactokinase (GALK), galactose-1-phosphate uridylyltransferase (GALT), and UDP-galactose-4-epimerase (GALE). Classic galactosemia, the most severe form, results from a deficiency of the GALT enzyme due to mutations in the GALT gene on chromosome 9p13. When GALT is deficient or absent, galactose-1-phosphate and galactitol (an alternative metabolite produced by aldose reductase) accumulate in tissues throughout the body, producing toxic effects on multiple organ systems. In the liver, galactose-1-phosphate accumulation causes hepatocellular damage leading to hepatomegaly, jaundice, and potentially cirrhosis and liver failure. The accumulation inhibits glucose metabolism by depleting hepatic phosphate and uridine diphosphate, further compromising cellular energy production. In the eyes, galactitol accumulates in the lens through the action of aldose reductase, creating an osmotic gradient that draws water into the lens fibers, causing swelling and opacification -- resulting in bilateral cataracts that can develop within the first few weeks of life. In the brain, galactose-1-phosphate and galactitol interfere with normal myelination and neurotransmitter production, leading to developmental delays and intellectual disability if treatment is delayed. In the kidneys, galactose-1-phosphate disrupts proximal tubular function, producing a Fanconi-like syndrome with aminoaciduria, proteinuria, and galactosuria. Classic galactosemia occurs in approximately 1 in 30,000 to 60,000 live births. Newborn screening programs in all Canadian provinces and US states test for galactosemia using the Beutler fluorescent spot test (which measures GALT enzyme activity in dried blood spots) and/or measurement of total galactose levels. A positive screening result requires immediate intervention: cessation of all lactose-containing feeds and initiation of soy-based or elemental formula. Even with early treatment and lifelong dietary restriction, many individuals with classic galactosemia experience long-term complications including speech and language delays, learning disabilities, motor coordination difficulties, ovarian insufficiency in females (premature ovarian failure occurs in approximately 80-90% of affected females), and decreased bone mineral density. The practical nurse must understand the urgency of dietary intervention, the importance of newborn screening follow-up, and the long-term monitoring needs of affected children."
    },
    riskFactors: [
      "Autosomal recessive inheritance: both parents must be carriers; 25% chance of affected offspring with each pregnancy",
      "Family history of galactosemia or consanguineous marriage (increases likelihood of shared carrier status)",
      "Certain ethnic populations have higher carrier frequencies: Irish Traveller community has the highest known prevalence",
      "Delayed newborn screening results or failure to follow up on abnormal screening results",
      "Breastfeeding or lactose-containing formula feeding before screening results are available (exposes infant to galactose)",
      "Missed or delayed diagnosis (some cases present before newborn screening results return)",
      "Duarte variant galactosemia (partial GALT deficiency): milder presentation but still requires monitoring"
    ],
    diagnostics: [
      "Newborn metabolic screening (heel prick blood spot): Beutler test measures GALT enzyme activity; positive screen requires confirmatory testing within 24-48 hours",
      "Confirmatory GALT enzyme activity assay: quantitative measurement of enzyme activity in red blood cells; classic galactosemia shows less than 1% of normal activity",
      "Galactose-1-phosphate levels in red blood cells: elevated levels confirm the diagnosis; used for ongoing monitoring of dietary compliance (target less than 4 mg/dL)",
      "Urine reducing substances: positive for reducing substances (galactose) with a negative glucose oxidase test (glucose test strips do not detect galactose)",
      "Liver function tests: elevated bilirubin (conjugated and unconjugated), elevated AST and ALT indicating hepatocellular damage, prolonged PT/INR indicating coagulopathy",
      "GALT gene mutation analysis: identifies specific mutations; common mutations include Q188R (most severe, no residual enzyme activity) and N314D (Duarte variant, partial activity)"
    ],
    management: [
      "Immediate cessation of all galactose and lactose-containing feeds upon positive newborn screen -- do NOT wait for confirmatory results to initiate dietary change",
      "Initiate soy-based formula (e.g., Enfamil ProSobee, Similac Soy Isomil): soy protein isolate formulas contain NO lactose; do NOT use soy milk from grocery store as it lacks appropriate infant nutrition",
      "Lifelong galactose-restricted diet: eliminate all milk and dairy products, organ meats (liver contains galactose), certain legumes, and processed foods containing hidden lactose sources",
      "Calcium and vitamin D supplementation: since dairy is eliminated from the diet, supplementation is essential to prevent rickets and osteoporosis",
      "Regular ophthalmology examinations: cataracts may develop rapidly in the first weeks of life and may reverse with early dietary treatment; ongoing monitoring for recurrence",
      "Developmental screening at regular intervals: speech-language assessment by 18 months, neuropsychological testing by school age, motor development monitoring",
      "Endocrine monitoring for females: assess pubertal development and ovarian function; premature ovarian insufficiency occurs in approximately 80-90% of affected females regardless of dietary treatment"
    ],
    nursingActions: [
      "Verify newborn screening results are obtained within the required timeframe (typically 24-48 hours after birth) and that results are communicated to the family and primary care provider",
      "Educate parents immediately upon diagnosis: emphasize that breastfeeding and standard formula must be stopped and soy-based formula initiated without delay",
      "Monitor feeding tolerance: assess for vomiting, diarrhea, weight gain patterns, and signs of formula intolerance when transitioning to soy-based formula",
      "Assess for signs of hepatic involvement: monitor for jaundice (scleral icterus, yellowing of skin), hepatomegaly (palpable liver edge below costal margin), dark urine, and pale stools",
      "Weigh the infant daily during the acute phase and at each visit thereafter; poor weight gain may indicate inadequate caloric intake or ongoing galactose exposure",
      "Report any signs of sepsis immediately: neonates with untreated galactosemia are highly susceptible to Escherichia coli sepsis (galactose-1-phosphate impairs neutrophil function)",
      "Educate family about reading food labels: lactose and galactose are hidden in many processed foods, medications (lactose is a common tablet filler), and supplements"
    ],
    assessmentFindings: [
      "Neonatal presentation (within first days to weeks of life): poor feeding, vomiting, diarrhea, failure to thrive, lethargy, and irritability after initiation of milk feeds",
      "Jaundice: both physiological and pathological; conjugated (direct) hyperbilirubinemia suggests liver involvement rather than benign neonatal jaundice",
      "Hepatomegaly: enlarged liver palpable below the right costal margin; may progress to liver failure with ascites, coagulopathy, and hypoalbuminemia",
      "Cataracts: bilateral lens opacification visible on red reflex examination or ophthalmoscopy; may develop within the first few weeks of life",
      "E. coli sepsis: neonates with galactosemia have a significantly increased risk of gram-negative sepsis; presents with fever or hypothermia, lethargy, poor feeding, and hemodynamic instability",
      "Bleeding diathesis: easy bruising, prolonged bleeding from heel stick or circumcision site due to hepatic coagulopathy (decreased synthesis of clotting factors)"
    ],
    signs: {
      left: [
        "Poor feeding and frequent vomiting after milk feeds",
        "Prolonged or worsening neonatal jaundice",
        "Mild hepatomegaly on abdominal palpation",
        "Failure to regain birth weight by 2 weeks of age",
        "Irritability and excessive crying after feeds",
        "Loose or watery stools"
      ],
      right: [
        "E. coli sepsis: fever/hypothermia, lethargy, hemodynamic instability (life-threatening emergency)",
        "Liver failure: ascites, severe coagulopathy, encephalopathy",
        "Bilateral cataracts: absent or diminished red reflex on examination",
        "Severe hypoglycemia: jitteriness, seizures, apnea, cyanosis",
        "Disseminated intravascular coagulation (DIC): widespread bleeding, petechiae",
        "Renal tubular dysfunction: excessive urinary losses leading to dehydration and electrolyte imbalances"
      ]
    },
    medications: [
      {
        name: "Calcium Carbonate (supplement)",
        type: "Mineral supplement -- calcium replacement",
        action: "Provides elemental calcium for bone mineralization, muscle contraction, nerve conduction, and blood clotting. Children with galactosemia require supplementation because dairy products (the primary dietary source of calcium) are eliminated from the diet. Adequate calcium intake during childhood and adolescence is critical for achieving peak bone mass and preventing osteoporosis.",
        sideEffects: "Constipation, bloating, gas, hypercalcemia (with excessive supplementation), kidney stones (long-term excessive use), decreased absorption of iron and thyroid medications",
        contra: "Hypercalcemia; hyperparathyroidism; renal calculi (calcium-containing stones); concurrent use with certain antibiotics (tetracyclines, fluoroquinolones) -- separate doses by 2 hours",
        pearl: "Administer calcium supplements with food to enhance absorption (except calcium citrate which can be taken without food); do NOT give calcium with iron supplements as they compete for absorption; recommended daily intake varies by age: 200-260 mg for infants, 700 mg for 1-3 years, 1000 mg for 4-8 years"
      },
      {
        name: "Vitamin D3 (Cholecalciferol)",
        type: "Fat-soluble vitamin supplement -- bone health and calcium metabolism",
        action: "Vitamin D3 is converted in the liver to 25-hydroxyvitamin D and then in the kidneys to its active form, 1,25-dihydroxyvitamin D (calcitriol). Active vitamin D promotes intestinal absorption of calcium and phosphorus, supports bone mineralization, and regulates parathyroid hormone secretion. Children on galactose-restricted diets are at high risk for vitamin D deficiency because fortified dairy products are eliminated.",
        sideEffects: "Hypercalcemia (with excessive supplementation), hypercalciuria, nausea, constipation, weakness, kidney damage (with chronic overdose)",
        contra: "Hypercalcemia; hypervitaminosis D; evidence of vitamin D toxicity; malabsorption syndromes may require adjusted dosing; granulomatous diseases (increased conversion to active form)",
        pearl: "All breastfed infants should receive 400 IU of vitamin D daily regardless of galactosemia status; children with galactosemia need ongoing monitoring of 25-hydroxyvitamin D levels (target above 30 ng/mL) and may require higher doses; administer with a fat-containing meal to enhance absorption"
      },
      {
        name: "Iron Supplement (Ferrous Sulfate)",
        type: "Mineral supplement -- iron replacement",
        action: "Provides elemental iron for hemoglobin synthesis, oxygen transport, and cellular metabolism. Iron is an essential component of hemoglobin in red blood cells and myoglobin in muscle cells. Children with galactosemia may be at risk for iron deficiency because their restricted diet may lack iron-fortified dairy alternatives, and hepatic dysfunction can impair iron metabolism.",
        sideEffects: "Constipation, nausea, abdominal cramping, dark/black stools (normal and expected), teeth staining (liquid formulations), diarrhea",
        contra: "Hemochromatosis or other iron overload conditions; hemolytic anemias (unless concurrent iron deficiency is documented); repeated blood transfusions (risk of iatrogenic iron overload)",
        pearl: "Administer on an empty stomach with vitamin C (orange juice or vitamin C supplement) to enhance absorption by converting ferric iron to the more absorbable ferrous form; do NOT give with calcium, antacids, or dairy alternatives as they decrease absorption; liquid iron should be given through a straw or medicine dropper to prevent teeth staining"
      }
    ],
    pearls: [
      "Classic galactosemia is a metabolic EMERGENCY in the newborn period -- if newborn screening is positive, stop ALL lactose-containing feeds immediately and switch to soy-based formula; do NOT wait for confirmatory testing",
      "Breastfeeding is absolutely CONTRAINDICATED in classic galactosemia because breast milk contains lactose (approximately 7 g/dL); this is one of the very few absolute contraindications to breastfeeding",
      "Neonates with galactosemia are particularly susceptible to E. coli sepsis because galactose-1-phosphate accumulation impairs neutrophil bactericidal function; any febrile or ill-appearing neonate with galactosemia should be evaluated for sepsis immediately",
      "Cataracts in galactosemia are caused by galactitol accumulation in the lens creating an osmotic gradient; early dietary treatment (within the first week of life) can reverse early cataracts, but delayed treatment may result in permanent opacity",
      "Even with perfect lifelong dietary compliance, most females with classic galactosemia develop premature ovarian insufficiency (80-90%); families should receive anticipatory guidance about fertility implications",
      "Urine reducing substances will be POSITIVE in galactosemia, but urine glucose dipstick will be NEGATIVE -- this discrepancy is a classic exam clue because glucose oxidase strips are specific for glucose and do not detect galactose",
      "Lactose is a hidden ingredient in many medications (used as tablet filler), processed foods, and even some 'non-dairy' products -- families must become expert label readers and pharmacists should be consulted about medication ingredients"
    ],
    quiz: [
      {
        question: "A newborn's metabolic screening returns positive for galactosemia. The mother is currently breastfeeding. What is the most appropriate IMMEDIATE action by the practical nurse?",
        options: [
          "Continue breastfeeding while awaiting confirmatory testing",
          "Supplement breastfeeding with soy formula",
          "Discontinue breastfeeding immediately and initiate soy-based formula",
          "Switch to a standard cow's milk-based formula"
        ],
        correct: 2,
        rationale: "Breastfeeding must be stopped immediately upon a positive galactosemia screen because breast milk contains lactose, which is broken down into galactose. Soy-based infant formula (not soy milk) is the appropriate substitute. Do NOT wait for confirmatory testing -- continued galactose exposure causes progressive organ damage. Cow's milk formula also contains lactose and is contraindicated."
      },
      {
        question: "A practical nurse is assessing a 5-day-old infant with suspected galactosemia. Which combination of findings would the nurse most expect?",
        options: [
          "Weight gain above birth weight, strong suck reflex, and clear sclera",
          "Vomiting after feeds, jaundice, hepatomegaly, and poor weight gain",
          "Projectile vomiting, olive-shaped mass in the epigastrium, and metabolic alkalosis",
          "Bulging fontanelle, high-pitched cry, and opisthotonos"
        ],
        correct: 1,
        rationale: "Classic galactosemia presents in the first days of life with feeding intolerance (vomiting, diarrhea), jaundice (hepatocellular damage from galactose-1-phosphate accumulation), hepatomegaly, and failure to thrive. The olive-shaped mass describes pyloric stenosis; bulging fontanelle and opisthotonos suggest meningitis or increased intracranial pressure."
      },
      {
        question: "A urine sample from a neonate with suspected galactosemia tests positive for reducing substances but negative on glucose dipstick. The practical nurse understands this result is significant because:",
        options: [
          "The glucose dipstick is likely defective and should be repeated",
          "Galactose is a reducing sugar that is detected by the copper reduction test but NOT by glucose oxidase dipstick, which is specific for glucose",
          "The positive reducing substance indicates a urinary tract infection",
          "Both tests should be positive in galactosemia"
        ],
        correct: 1,
        rationale: "Galactose is a reducing sugar detected by the copper reduction method (Clinitest) but NOT by glucose oxidase dipstick strips, which are specific for glucose only. This discrepancy (positive reducing substances, negative glucose) is a classic finding in galactosemia and galactosuria. It is a frequently tested concept on nursing examinations."
      }
    ]
  },

  "circumcision-care-rpn": {
    title: "Circumcision Care: Surgical Techniques, Post-Procedure Assessment, and Complication Prevention",
    cellular: {
      title: "Anatomy of the Foreskin and Pathophysiology of Circumcision Wound Healing",
      content: "Circumcision is the surgical removal of the prepuce (foreskin), the retractable double fold of skin and mucous membrane that covers the glans penis. The foreskin develops embryologically from the same tissue as the clitoral hood in females and is fully formed by approximately 16 weeks of gestation. At birth, the inner surface of the foreskin is naturally adherent to the glans through physiological adhesions (preputial adhesions); these adhesions gradually separate naturally over the first several years of life and should NOT be forcibly retracted. The foreskin serves several physiological functions: it protects the glans from friction and desiccation, contains a dense concentration of sensory nerve endings (Meissner corpuscles), and produces smegma (a mixture of shed epithelial cells and sebaceous secretions) that has natural lubricating and mild antibacterial properties. Circumcision may be performed for cultural, religious, medical, or personal reasons. The three most common surgical techniques used in neonatal circumcision are the Gomco clamp, the Plastibell device, and the Mogen clamp. The Gomco clamp technique involves placing a bell-shaped device over the glans, drawing the foreskin over the bell, securing it with a clamp that crushes the tissue to achieve hemostasis, and then excising the foreskin with a scalpel. The entire device is removed after the procedure. The Plastibell technique uses a plastic ring placed between the foreskin and glans; a ligature (suture tie) is placed around the foreskin over the ring, compressing the tissue and cutting off blood supply. The excess foreskin is trimmed, and the plastic ring remains in place and falls off spontaneously in 7-10 days as the compressed tissue undergoes necrosis and separates. The Mogen clamp technique uses a flat, hinged metal clamp with a slit; the foreskin is drawn through the slit and the clamp is locked, crushing the tissue for hemostasis before the foreskin is excised. This technique is the fastest but carries a slightly higher risk of glans injury if the glans is inadvertently pulled into the clamp. Wound healing after circumcision follows the standard phases of tissue repair. The inflammatory phase (days 0-3) involves hemostasis through platelet aggregation and fibrin clot formation, followed by vasodilation and inflammatory cell infiltration that produces the expected erythema, edema, and exudate. The proliferative phase (days 3-21) involves granulation tissue formation, epithelialization, and wound contraction. A yellowish-white exudate (fibrin eschar) normally forms over the circumcision site during healing -- this is granulation tissue, NOT pus or infection, and should NOT be removed. The remodeling phase (weeks to months) involves collagen reorganization and scar maturation. Pain management is essential: neonatal pain pathways are fully functional, and unmanaged circumcision pain has been associated with altered pain responses and increased behavioral distress during subsequent painful procedures. Evidence-based pain management includes dorsal penile nerve block (DPNB) or subcutaneous ring block performed before the procedure, topical lidocaine-prilocaine cream (EMLA) applied 60-90 minutes before the procedure, oral sucrose solution (24%) on a pacifier for non-pharmacological comfort, and acetaminophen for post-procedure pain. The practical nurse must be competent in post-circumcision assessment, wound care education, and recognition of complications including hemorrhage, infection, and urinary retention."
    },
    riskFactors: [
      "Prematurity or low birth weight (procedure is typically deferred until the infant is medically stable and gaining weight)",
      "Bleeding disorders: hemophilia, von Willebrand disease, or family history of bleeding disorders (absolute contraindication until evaluated)",
      "Hypospadias or epispadias (the foreskin may be needed for surgical repair; circumcision is contraindicated until urologic evaluation)",
      "Ambiguous genitalia (circumcision is deferred pending diagnostic evaluation and family/surgical team decisions)",
      "Current illness, jaundice requiring treatment, or hemodynamic instability",
      "Micropenis (may indicate underlying endocrine disorder requiring evaluation before surgical intervention)",
      "Family history of poor wound healing or keloid formation"
    ],
    diagnostics: [
      "Pre-procedure assessment: verify gestational age (minimum 37 weeks for elective circumcision), birth weight, and overall medical stability",
      "Bleeding time and coagulation studies: not routine but indicated if there is a family history of bleeding disorders; obtain PT, PTT, and platelet count",
      "Physical examination of the genitalia: assess for hypospadias (urethral meatus on ventral surface), epispadias (meatus on dorsal surface), chordee, or ambiguous genitalia -- any abnormality contraindicates routine circumcision",
      "Bilirubin level: assess if jaundice is present; circumcision is typically deferred if phototherapy is required or bilirubin is rising",
      "Post-procedure wound assessment: inspect the circumcision site at every diaper change for color, edema, discharge characteristics, bleeding, and Plastibell ring position",
      "Urine output monitoring: the infant should void within 12 hours of the procedure; failure to void may indicate urethral obstruction from edema or the Plastibell ring"
    ],
    management: [
      "Apply petroleum jelly (Vaseline) gauze to the Gomco or Mogen circumcision site with each diaper change for 24-48 hours to prevent the wound from adhering to the diaper",
      "For Plastibell circumcision: do NOT apply petroleum gauze; the plastic ring should fall off naturally in 7-10 days; instruct parents to report if the ring has not separated by 14 days",
      "Administer acetaminophen (15 mg/kg) as prescribed for post-procedure pain management; do NOT use ibuprofen in neonates (not approved for infants under 6 months)",
      "Keep the circumcision site clean: gently cleanse with warm water during diaper changes; avoid soap, alcohol, or antiseptic wipes on the wound",
      "Monitor for bleeding: small amount of blood (less than a quarter-sized spot) on the diaper is normal; apply gentle pressure with gauze for persistent oozing; report active bleeding immediately",
      "Ensure the infant voids within 12 hours post-procedure: document first void; inability to void may indicate urethral compression from edema or device malposition",
      "Schedule follow-up assessment: in-office evaluation within 1-2 weeks to assess wound healing and address parental concerns"
    ],
    nursingActions: [
      "Verify informed consent has been obtained from the parent/guardian before the procedure; confirm the parent understands the risks, benefits, and alternatives to circumcision",
      "Ensure nothing by mouth (NPO) status as ordered pre-procedure (typically 1-2 hours for breast milk, longer for formula) to reduce aspiration risk during the procedure",
      "Assist with pain management: apply EMLA cream 60-90 minutes before the procedure as ordered; prepare oral sucrose solution (24%) and pacifier for non-pharmacological comfort",
      "Perform post-procedure assessment within 30 minutes: inspect the site for active bleeding, assess vital signs, offer feeding (the infant should feed well within 1-2 hours)",
      "Educate parents on expected normal findings: mild swelling, redness at the incision line, and a yellowish-white exudate (fibrin/granulation tissue) that is NORMAL and should NOT be removed",
      "Teach parents danger signs requiring immediate medical attention: active bleeding that soaks the diaper, foul-smelling discharge, fever above 38 degrees Celsius, failure to void within 12 hours, or increasing swelling",
      "Document the procedure details: technique used, any complications, infant's tolerance, pain management provided, voiding status, and parental education given"
    ],
    assessmentFindings: [
      "Normal post-circumcision appearance: mild edema and erythema at the incision site, small amount of serous or serosanguineous drainage, yellowish-white fibrin exudate forming over the wound (granulation tissue)",
      "Normal healing progression: edema peaks at 48-72 hours then gradually resolves; fibrin exudate persists for 7-10 days; complete healing typically occurs within 2-3 weeks",
      "Active bleeding: bright red blood actively flowing from the circumcision site; small blood spots (less than quarter-sized) on the diaper are normal, larger amounts require assessment",
      "Signs of infection: purulent (green or yellow) discharge with foul odor, increasing erythema and warmth extending beyond the immediate incision line, fever, and irritability",
      "Urinary retention: no void within 12 hours post-procedure; distended bladder on palpation; infant crying with signs of discomfort but no wet diaper",
      "Plastibell-specific findings: ring positioned at the coronal sulcus; ring should not be displaced proximally onto the shaft (can cause ischemia) or distally (incomplete circumcision)"
    ],
    signs: {
      left: [
        "Mild swelling and redness at the circumcision site",
        "Yellowish-white exudate over the wound (normal granulation/fibrin)",
        "Small amount of blood-tinged discharge on the diaper (less than quarter-sized)",
        "Mild fussiness during diaper changes",
        "Normal feeding pattern resumed within 1-2 hours post-procedure",
        "Voiding within 12 hours of the procedure"
      ],
      right: [
        "Active, persistent bleeding from the circumcision site that does not stop with gentle pressure",
        "Purulent, foul-smelling discharge indicating wound infection",
        "Fever above 38 degrees Celsius (100.4 degrees Fahrenheit)",
        "No voiding within 12 hours post-procedure (urinary retention)",
        "Displaced Plastibell ring causing visible ischemia or necrosis of the glans",
        "Inconsolable crying with refusal to feed suggesting uncontrolled pain or complication"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol Infant)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis involved in pain signaling and thermoregulation. Unlike NSAIDs, acetaminophen has minimal peripheral anti-inflammatory action. It is the first-line analgesic for neonatal post-circumcision pain because it is safe, effective, and does not affect platelet function or increase bleeding risk.",
        sideEffects: "Hepatotoxicity (dose-dependent, rare at therapeutic doses), rash (uncommon), hypothermia (rare at standard doses in neonates)",
        contra: "Severe hepatic impairment; known hypersensitivity; caution in glucose-6-phosphate dehydrogenase (G6PD) deficiency; verify dosing by weight -- neonatal dosing errors are a significant safety concern",
        pearl: "Neonatal dose: 10-15 mg/kg orally every 4-6 hours as needed (maximum 5 doses in 24 hours); ALWAYS dose by weight, never by age alone; use only the calibrated syringe or dropper provided with the product; ibuprofen is NOT recommended for infants under 6 months of age"
      },
      {
        name: "Lidocaine-Prilocaine Cream (EMLA)",
        type: "Topical local anesthetic (amide-type combination)",
        action: "Contains two amide-type local anesthetics (lidocaine 2.5% and prilocaine 2.5%) in a eutectic mixture that penetrates intact skin. Both agents block sodium channels in peripheral nerve membranes, preventing the initiation and conduction of nerve impulses. When applied under an occlusive dressing for 60-90 minutes, it produces local anesthesia to a depth of approximately 3-5 mm, reducing pain during circumcision and other minor procedures.",
        sideEffects: "Local skin reactions (pallor, erythema, edema at application site), methemoglobinemia (risk with prilocaine, especially in neonates with immature methemoglobin reductase systems), systemic toxicity if applied to large areas or mucous membranes",
        contra: "Infants less than 37 weeks gestational age; methemoglobinemia or congenital methemoglobin reductase deficiency; concurrent use of methemoglobin-inducing agents (sulfonamides, dapsone); application to open wounds or mucous membranes",
        pearl: "Apply a thick layer (approximately 1-2 grams for neonates) to the penile shaft and foreskin under an occlusive dressing (adhesive bandage or plastic wrap) 60-90 minutes before the procedure; do NOT apply to the glans itself in uncircumcised infants; maximum application area and duration must be followed strictly to prevent methemoglobinemia"
      },
      {
        name: "Sucrose Solution 24% (oral)",
        type: "Non-pharmacological analgesic -- sweet taste analgesia",
        action: "Oral sucrose activates endogenous opioid pathways when sweet taste receptors on the tongue are stimulated, triggering the release of endorphins in the brainstem. This produces a brief analgesic and calming effect in neonates. The combination of sucrose with non-nutritive sucking (pacifier) provides additive pain relief through both the taste-mediated opioid pathway and the calming effect of rhythmic sucking.",
        sideEffects: "Transient changes in heart rate and oxygen saturation (brief tachycardia followed by settling), theoretical risk of necrotizing enterocolitis in very premature infants (less than 32 weeks), choking risk if administered too rapidly",
        contra: "Infants unable to swallow (intubated without intact gag reflex); suspected necrotizing enterocolitis or intestinal abnormalities; fructose intolerance; caution in infants of diabetic mothers (monitor blood glucose)",
        pearl: "Administer 0.5-1 mL of 24% sucrose solution onto the anterior tongue or pacifier 2 minutes before the painful procedure; the analgesic effect lasts approximately 5-8 minutes; may be repeated for prolonged procedures; most effective when combined with non-nutritive sucking and swaddling"
      }
    ],
    pearls: [
      "The yellowish-white exudate that forms on the circumcision site is normal granulation tissue (fibrin eschar) -- it is NOT pus or infection and should NOT be wiped off; educate parents clearly about this to prevent unnecessary emergency visits",
      "Circumcision is CONTRAINDICATED in hypospadias, epispadias, chordee, or ambiguous genitalia because the foreskin tissue may be needed for future reconstructive surgery; always verify genital anatomy before the procedure",
      "For Gomco/Mogen technique: apply petroleum jelly gauze with each diaper change for 24-48 hours; for Plastibell technique: do NOT apply petroleum gauze, the ring separates naturally in 7-10 days",
      "The infant should void within 12 hours after circumcision -- failure to void requires prompt assessment for urethral obstruction from edema or device malposition and should be reported to the physician immediately",
      "EMLA cream must be applied 60-90 minutes BEFORE the procedure under occlusive dressing to be effective; it is NOT a substitute for dorsal penile nerve block but may be used as adjunctive analgesia",
      "Always assess for bleeding disorders BEFORE circumcision by reviewing family history -- hemophilia, von Willebrand disease, and other coagulopathies are contraindications until hematologic evaluation is complete",
      "Post-circumcision bleeding that saturates more than a quarter-sized area on the diaper or does not stop with 10 minutes of gentle direct pressure requires immediate medical evaluation -- this may indicate a coagulopathy or arterial bleed"
    ],
    quiz: [
      {
        question: "A parent calls the clinic concerned about a yellowish-white film on their 3-day-old infant's circumcision site. The infant is feeding well, afebrile, and has normal voiding. What should the practical nurse advise?",
        options: [
          "Bring the infant to the emergency department immediately for evaluation of wound infection",
          "Gently wipe off the film with a warm washcloth to keep the wound clean",
          "Reassure the parent that the yellowish-white film is normal granulation tissue (fibrin) that forms during healing and should not be removed",
          "Apply antibiotic ointment to the circumcision site to prevent infection"
        ],
        correct: 2,
        rationale: "The yellowish-white exudate on a healing circumcision site is normal fibrin/granulation tissue, not pus. Removing it disrupts the healing process and can cause bleeding. With normal feeding, no fever, and normal voiding, this is expected wound healing. Parents should be educated that this appearance is normal to prevent unnecessary emergency visits."
      },
      {
        question: "A practical nurse is assessing a newborn 8 hours after Plastibell circumcision. The infant has not voided since the procedure. What is the priority nursing action?",
        options: [
          "Continue monitoring because 8 hours is within the expected voiding timeframe",
          "Assess the Plastibell ring position, palpate the bladder, and prepare to notify the physician if no void by 12 hours",
          "Remove the Plastibell ring to relieve potential obstruction",
          "Insert a urinary catheter to empty the bladder"
        ],
        correct: 1,
        rationale: "The infant should void within 12 hours post-circumcision. At 8 hours, continued monitoring is appropriate, but the nurse should also assess for signs of urinary retention (distended bladder, displaced ring). If no void occurs by 12 hours, the physician must be notified. The practical nurse does not remove the Plastibell ring or insert a catheter independently."
      },
      {
        question: "Before applying EMLA cream for a neonatal circumcision, the practical nurse should verify which of the following?",
        options: [
          "The infant is at least 48 hours old and has been NPO for 6 hours",
          "The infant is at least 37 weeks gestational age and does not have a history of methemoglobinemia",
          "The infant has received vitamin K injection and hepatitis B vaccine",
          "The infant's blood glucose level is above 70 mg/dL"
        ],
        correct: 1,
        rationale: "EMLA cream contains prilocaine, which can cause methemoglobinemia, particularly in premature infants with immature methemoglobin reductase enzyme systems. EMLA is contraindicated in infants less than 37 weeks gestational age and in those with a history of methemoglobinemia or concurrent use of methemoglobin-inducing medications."
      }
    ]
  },

  "hearing-screening-rpn": {
    title: "Newborn Hearing Screening: OAE, ABR, Risk Factors, and Developmental Follow-Up",
    cellular: {
      title: "Anatomy and Physiology of the Auditory System in Neonates",
      content: "The auditory system begins developing early in embryonic life, with the cochlea reaching structural maturity by approximately 20 weeks of gestation and functional maturity by 28-30 weeks. By the third trimester, the fetus can respond to sound, demonstrating heart rate changes and motor responses to auditory stimuli. At birth, the peripheral auditory system (outer ear, middle ear, cochlea, and auditory nerve) is structurally mature, although the central auditory pathways (brainstem to auditory cortex) continue to mature throughout the first two years of life, driven by auditory stimulation. Sound travels through the external auditory canal to the tympanic membrane, which vibrates in response to pressure waves. These vibrations are transmitted through the middle ear ossicles (malleus, incus, stapes) to the oval window of the cochlea. Within the cochlea, fluid waves displace the basilar membrane, which activates the inner hair cells (approximately 3,500 cells arranged in a single row). Inner hair cells are the primary sensory receptors that convert mechanical energy into electrical signals transmitted via the cochlear nerve (CN VIII) to the brainstem. The outer hair cells (approximately 12,000 cells in three rows) function as cochlear amplifiers, enhancing the sensitivity and frequency selectivity of the inner hair cells. Outer hair cells contract and expand in response to sound stimulation, a process called electromotility; this active mechanical process produces sounds called otoacoustic emissions (OAEs) that can be measured in the ear canal and serve as the basis for OAE hearing screening. Hearing loss in neonates is classified by location: conductive hearing loss results from problems in the outer or middle ear (cerumen impaction, otitis media with effusion, ossicular malformation); sensorineural hearing loss results from damage to the cochlear hair cells or auditory nerve (genetic mutations, ototoxic medications, congenital infections, hyperbilirubinemia); and auditory neuropathy spectrum disorder results from impaired neural processing despite functioning hair cells. The incidence of congenital hearing loss is approximately 1-3 per 1,000 live births, making it one of the most common congenital conditions. Without screening, the average age of hearing loss identification was historically 24-30 months, well past the critical period for language development (birth to 3 years). Universal newborn hearing screening (UNHS) programs aim to screen by 1 month of age, confirm hearing loss by 3 months, and initiate intervention by 6 months (the 1-3-6 guideline). Two primary screening technologies are used. Otoacoustic emissions (OAE) testing measures sounds produced by the outer hair cells in response to auditory stimulation; a small probe placed in the ear canal delivers clicks or tones and a sensitive microphone records the emissions. OAE testing is quick (1-5 minutes per ear), non-invasive, and does not require sedation, but it can only detect hearing loss originating in the cochlea (sensorineural) and does not detect auditory neuropathy. Auditory brainstem response (ABR) testing measures electrical activity in the auditory nerve and brainstem in response to sound stimuli delivered through earphones. Electrodes placed on the infant's scalp record the neural waveforms. ABR is more comprehensive, detecting both cochlear and neural hearing loss, and is the gold standard confirmatory test for neonatal hearing loss. ABR testing takes longer (15-30 minutes per ear), requires the infant to be sleeping or sedated, and requires trained audiological interpretation. The practical nurse plays a key role in ensuring screening is completed before hospital discharge, educating parents about follow-up for referred (failed) screens, and monitoring developmental milestones related to hearing and language acquisition."
    },
    riskFactors: [
      "Family history of permanent childhood sensorineural hearing loss (first-degree relative with childhood-onset hearing loss)",
      "Neonatal intensive care unit (NICU) admission for more than 5 days or any NICU admission with ototoxic medications, exchange transfusion, or ECMO",
      "In utero infections (TORCH): cytomegalovirus (CMV, most common non-genetic cause), toxoplasmosis, rubella, herpes simplex, syphilis",
      "Craniofacial anomalies involving the pinna, ear canal, ear tags, or temporal bone (e.g., microtia, aural atresia)",
      "Hyperbilirubinemia requiring exchange transfusion (bilirubin is toxic to the auditory nerve at elevated levels)",
      "Ototoxic medication exposure: aminoglycosides (gentamicin, tobramycin) especially in combination with loop diuretics (furosemide); prolonged courses increase risk",
      "Birth weight less than 1,500 grams; very low birth weight infants have a 2-5% incidence of sensorineural hearing loss"
    ],
    diagnostics: [
      "Otoacoustic emissions (OAE): measures sounds generated by outer hair cells; pass/refer result; quick and non-invasive; cannot detect auditory neuropathy spectrum disorder",
      "Auditory brainstem response (ABR): measures electrical activity from cochlea through brainstem auditory pathways; gold standard for confirmation of hearing loss in infants; requires infant to be sleeping",
      "Automated ABR (AABR): a simplified version of ABR used for screening (pass/refer result); combines OAE sensitivity with neural pathway assessment; used in many NICU screening programs",
      "Tympanometry: measures middle ear function and tympanic membrane compliance; identifies middle ear effusion or eustachian tube dysfunction that may cause conductive hearing loss; typically performed in follow-up, not at initial newborn screening",
      "Behavioral audiometry: age-appropriate behavioral hearing assessment performed at 6-9 months (visual reinforcement audiometry) or older; used when ABR confirmation is needed in the context of developmental assessment",
      "CMV screening: urine or saliva PCR for cytomegalovirus within the first 21 days of life if hearing screening is failed or risk factors are present; congenital CMV is the most common non-genetic cause of sensorineural hearing loss"
    ],
    management: [
      "Complete initial hearing screening before hospital discharge or by 1 month of age per the 1-3-6 guideline (screen by 1 month, diagnose by 3 months, intervene by 6 months)",
      "For a referred (failed) screening result: schedule outpatient diagnostic ABR within 2-4 weeks; emphasize to parents that a referred screen does not confirm hearing loss (false positive rate is 2-10%)",
      "If hearing loss is confirmed: refer to pediatric audiology for hearing aid fitting (can be fitted as early as 4-6 weeks of age) and to early intervention services",
      "Enroll in early intervention program: speech-language pathology, auditory-verbal therapy, or sign language instruction based on family preference and degree of hearing loss",
      "Monitor for progressive or late-onset hearing loss: infants with risk factors should have audiologic monitoring at 6, 9, 12, 18, 24, 30, and 36 months even if initial screening was passed",
      "Treat underlying causes when possible: middle ear effusion (ventilation tubes if persistent), congenital CMV (valganciclovir within the first month of life may prevent progressive hearing loss)",
      "Cochlear implant evaluation: refer to cochlear implant team if bilateral severe-to-profound sensorineural hearing loss is confirmed and hearing aids provide insufficient benefit; FDA-approved for children as young as 9-12 months"
    ],
    nursingActions: [
      "Verify hearing screening is completed and documented before hospital discharge; if screening cannot be completed (infant unstable, equipment unavailable), arrange outpatient screening within 2 weeks",
      "Perform screening in a quiet environment with the infant in a natural sleep state (preferably after a feeding); ambient noise reduces OAE accuracy and can cause false referral results",
      "Document screening results accurately: record the type of test performed (OAE, AABR), result for each ear (pass or refer), and any risk factors identified",
      "Educate parents about screening results: explain that a 'pass' means the ears tested responded normally today but does not guarantee normal hearing throughout life; a 'refer' means further testing is needed, not that the baby is deaf",
      "For referred results: schedule follow-up diagnostic testing, provide written instructions for the appointment, and make a follow-up phone call to ensure the family attends",
      "Assess developmental milestones related to hearing at every well-child visit: startle response to loud sounds (newborn), turning toward sound source (4-6 months), responding to name (6-9 months), babbling with consonant sounds (6-9 months), first words (12 months)",
      "Review medication administration records for ototoxic medications (aminoglycosides, loop diuretics); report prolonged courses or combined ototoxic therapy to the physician and ensure audiologic follow-up is planned"
    ],
    assessmentFindings: [
      "Normal auditory behaviors by age: startle/Moro reflex to loud sounds (newborn), quieting to familiar voice (1-3 months), turning head toward sound source (4-6 months), responding to name (6-9 months), following simple verbal commands (12 months)",
      "Failed OAE screening: absence of measurable otoacoustic emissions in one or both ears; may indicate sensorineural hearing loss, middle ear effusion, or debris in the ear canal",
      "Failed ABR screening: absent or abnormal brainstem waveforms at specified intensity levels; indicates possible sensorineural hearing loss or auditory neuropathy",
      "Risk factors for late-onset hearing loss: family history, congenital CMV, ototoxic medication exposure, NICU stay longer than 5 days, hyperbilirubinemia, bacterial meningitis",
      "Speech and language delay indicators: no babbling by 9 months, no first words by 15 months, no two-word phrases by 24 months, loss of previously acquired speech milestones",
      "Behavioral indicators of hearing loss in infants: not startling to loud sounds, not turning toward voice by 6 months, no response to name by 9 months, appearing inattentive or preferring visual stimulation"
    ],
    signs: {
      left: [
        "Failed initial hearing screening (referred result) in one or both ears",
        "Inconsistent responses to auditory stimuli (sometimes responds, sometimes does not)",
        "Mild speech or language delay compared to age-appropriate milestones",
        "Frequent ear infections or persistent middle ear effusion",
        "Turning up television volume or sitting very close to sound sources",
        "Preferring one ear consistently when listening"
      ],
      right: [
        "Complete absence of startle response to loud sounds in a newborn",
        "No babbling or vocalization by 9 months of age",
        "Bilateral failed ABR with absent waveforms at maximum intensity",
        "Signs of meningitis (fever, bulging fontanelle, lethargy) with concurrent hearing screening failure",
        "Loss of previously acquired speech and language milestones (regression)",
        "Vestibular dysfunction: delayed motor milestones, poor balance, abnormal head positioning"
      ]
    },
    medications: [
      {
        name: "Gentamicin",
        type: "Aminoglycoside antibiotic -- bactericidal",
        action: "Binds irreversibly to the 30S ribosomal subunit of susceptible bacteria, inhibiting protein synthesis and causing bacterial cell death. Aminoglycosides are concentration-dependent bactericidal agents effective against gram-negative organisms (E. coli, Klebsiella, Pseudomonas). In neonates, gentamicin is commonly used in combination with ampicillin for empiric treatment of suspected early-onset sepsis. The relevance to hearing screening is that aminoglycosides are ototoxic: they damage the outer hair cells of the cochlea, particularly at the basal turn (high-frequency hearing loss first), and can damage vestibular hair cells.",
        sideEffects: "Ototoxicity (cochlear: hearing loss, vestibular: vertigo/balance problems), nephrotoxicity (acute tubular necrosis), neuromuscular blockade (rare), superinfection",
        contra: "Known aminoglycoside hypersensitivity; concurrent use with other ototoxic agents (loop diuretics, vancomycin) increases ototoxicity risk; renal impairment (requires dose adjustment based on creatinine clearance and drug levels)",
        pearl: "Monitor peak and trough levels: trough level should be less than 2 mcg/mL to minimize toxicity; ototoxicity risk increases with prolonged courses (more than 5 days), concurrent furosemide use, and renal impairment; any infant who receives aminoglycosides should have hearing screening and follow-up audiologic monitoring"
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin antibiotic -- bactericidal",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs) and preventing cross-linking of peptidoglycan chains, leading to cell lysis and death. Amoxicillin is the first-line treatment for acute otitis media (AOM) in children, which is a common cause of conductive hearing loss. By effectively treating middle ear infections, amoxicillin helps restore hearing by resolving middle ear effusion and reducing inflammation.",
        sideEffects: "Diarrhea, nausea, vomiting, rash (maculopapular or urticarial), allergic reactions (anaphylaxis in penicillin-allergic patients), Clostridioides difficile-associated diarrhea",
        contra: "Known penicillin or cephalosporin allergy with anaphylaxis history; infectious mononucleosis (high risk of maculopapular rash with amoxicillin); use caution in renal impairment (dose adjustment required)",
        pearl: "First-line for acute otitis media: 80-90 mg/kg/day divided into two doses for 10 days (children under 2 years) or 5-7 days (children 2-5 years with mild symptoms); persistent middle ear effusion for more than 3 months warrants audiology referral and consideration of ventilation tube placement"
      },
      {
        name: "Dexamethasone",
        type: "Corticosteroid -- anti-inflammatory and immunosuppressant",
        action: "Binds to intracellular glucocorticoid receptors, modulating gene expression to reduce production of inflammatory mediators including prostaglandins, leukotrienes, and cytokines. In the context of hearing, dexamethasone is used adjunctively in bacterial meningitis (particularly Haemophilus influenzae type b) to reduce inflammation in the subarachnoid space and cochlear aqueduct, thereby reducing the risk of post-meningitis sensorineural hearing loss. It may also be used in sudden sensorineural hearing loss (intratympanic injection) in older patients.",
        sideEffects: "Hyperglycemia, immunosuppression (increased infection risk), GI irritation, adrenal suppression (with prolonged use), poor wound healing, mood changes, hypertension",
        contra: "Active systemic fungal infection; live vaccine administration during therapy; uncontrolled diabetes (worsens hyperglycemia); GI perforation or active peptic ulcer disease",
        pearl: "In bacterial meningitis, dexamethasone should be administered 15-20 minutes BEFORE or with the first dose of antibiotics to be most effective in preventing hearing loss; dose: 0.15 mg/kg IV every 6 hours for 2-4 days; proven benefit primarily for H. influenzae meningitis, controversial but commonly used for pneumococcal meningitis"
      }
    ],
    pearls: [
      "The 1-3-6 guideline is the gold standard for newborn hearing screening: screen by 1 month, confirm diagnosis by 3 months, begin intervention by 6 months -- early identification and intervention produce significantly better language outcomes",
      "OAE measures outer hair cell function only; ABR measures the entire auditory pathway from cochlea through brainstem -- ABR is the gold standard for confirming hearing loss in infants and can detect auditory neuropathy that OAE cannot",
      "A 'refer' (failed) result on newborn hearing screening does NOT mean the baby has hearing loss -- false positive rates are 2-10%; the most critical nursing action is ensuring families attend follow-up diagnostic testing rather than assuming permanent hearing loss",
      "Congenital cytomegalovirus (CMV) is the most common non-genetic cause of childhood sensorineural hearing loss; it can cause progressive hearing loss that worsens over time, which is why ongoing monitoring is essential even after a passed initial screen",
      "Aminoglycoside antibiotics (gentamicin, tobramycin) damage cochlear outer hair cells in a dose-dependent and duration-dependent manner; the damage is usually irreversible and affects high frequencies first -- always monitor hearing in infants who received aminoglycosides",
      "Language development has a critical period from birth to 3 years; infants identified and treated for hearing loss by 6 months of age achieve language outcomes comparable to their hearing peers, while delayed identification leads to permanent language deficits",
      "Perform OAE screening in a quiet environment with the infant sleeping or quietly resting -- ambient noise, infant crying, and debris in the ear canal are the most common causes of false referral results"
    ],
    quiz: [
      {
        question: "A newborn fails the initial OAE hearing screening in the left ear before hospital discharge. The practical nurse should take which action?",
        options: [
          "Inform the parents that the baby has hearing loss in the left ear and refer to an audiologist",
          "Repeat the screening before discharge if possible; if still referred, schedule outpatient diagnostic ABR within 2-4 weeks and educate the parents that a failed screen requires follow-up but does not confirm hearing loss",
          "Document the result and assume it was a false positive since the baby appears to respond to sounds",
          "Request an immediate CT scan of the temporal bone to evaluate the cochlea"
        ],
        correct: 1,
        rationale: "A referred (failed) OAE screen requires follow-up diagnostic testing (ABR) but does not confirm hearing loss. False positive rates for OAE screening are 2-10%, often due to middle ear fluid or debris. Rescreening before discharge is appropriate. If still referred, outpatient diagnostic ABR should be scheduled within 2-4 weeks per the 1-3-6 guideline. Parents should be educated that further testing is needed without creating unnecessary alarm."
      },
      {
        question: "A NICU nurse reviews the medication administration record for a premature infant who received gentamicin for 10 days. Which follow-up action is most important related to this medication exposure?",
        options: [
          "No follow-up is needed if the initial hearing screening was passed",
          "Ensure audiologic monitoring is planned due to the ototoxic risk of prolonged aminoglycoside therapy, even if the initial hearing screening was passed",
          "Perform a renal ultrasound to check for gentamicin nephrotoxicity",
          "Discontinue the gentamicin and switch to a non-ototoxic antibiotic"
        ],
        correct: 1,
        rationale: "Aminoglycosides are ototoxic and can cause sensorineural hearing loss, particularly with prolonged courses (more than 5 days). Hearing loss from ototoxic medications can be delayed or progressive, so a passed initial hearing screening does not rule out future hearing loss. Ongoing audiologic monitoring (at 6, 9, 12, 18, 24, 30, and 36 months) is recommended for all infants with ototoxic medication exposure."
      },
      {
        question: "At a 9-month well-child visit, a parent reports that their infant does not turn toward sounds and has not started babbling. The initial newborn hearing screening was passed. What is the most appropriate action by the practical nurse?",
        options: [
          "Reassure the parent that each child develops at their own pace and schedule a follow-up in 3 months",
          "Document the concern and refer for audiologic evaluation and developmental screening; a passed newborn screen does not rule out late-onset or progressive hearing loss",
          "Recommend the parent speak louder and more frequently to stimulate language development",
          "Order a CT scan of the brain to evaluate for neurological causes"
        ],
        correct: 1,
        rationale: "Not turning toward sounds by 6 months and absence of babbling by 9 months are red flags for hearing loss. A passed newborn hearing screening does not rule out late-onset, progressive, or acquired hearing loss. Immediate referral for audiologic evaluation is indicated. Delayed identification beyond the critical language development period (birth to 3 years) significantly impacts long-term language outcomes."
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
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
if (fail > 0) process.exit(1);
