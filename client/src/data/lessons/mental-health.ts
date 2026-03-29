import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgSubstanceAbuse = getAssetUrl("substanceabuse_1773340545537.png");

export const mentalHealthLessons: Record<string, LessonContent> = {
  "schizophrenia": {
    title: "Schizophrenia",
    cellular: {
      title: "Dopamine Dysregulation",
      content: "Schizophrenia results from excessive dopaminergic activity in the mesolimbic pathway, producing positive symptoms such as hallucinations and delusions, while dopamine deficiency in the mesocortical pathway drives negative symptoms including flat affect and avolition. Glutamate hypofunction at NMDA receptors compounds cortical dysfunction, impairing working memory and executive function. Structural changes include enlarged lateral ventricles and reduced prefrontal cortical volume, reflecting neuronal loss and impaired synaptic pruning during adolescent brain maturation. Serotonin dysregulation at 5-HT2A receptors further modulates dopaminergic tone, which is why second-generation antipsychotics targeting both D2 and 5-HT2A receptors address a broader symptom profile."
    },
    riskFactors: [
      "Family history of schizophrenia or psychotic disorders",
      "Prenatal exposure to infections or malnutrition",
      "Cannabis use during adolescence accelerating dopamine sensitization",
      "Urban environment and social isolation",
      "Advanced paternal age increasing de novo genetic mutations",
      "Childhood trauma and adverse childhood experiences",
      "Obstetric complications including hypoxia at birth",
      "Migration and minority stress"
    ],
    diagnostics: [
      "Two or more characteristic symptoms (delusions, hallucinations, disorganized speech, grossly disorganized behavior, negative symptoms) for at least one month",
      "Continuous disturbance lasting six months or longer including prodromal or residual periods",
      "CT/MRI showing enlarged ventricles and cortical atrophy",
      "Neuropsychological testing revealing impaired executive function and working memory",
      "Urine toxicology to rule out substance-induced psychosis"
    ],
    management: [
      "First-line second-generation antipsychotics (risperidone, olanzapine) to reduce positive symptoms",
      "Clozapine reserved for treatment-resistant schizophrenia after two failed antipsychotic trials",
      "Cognitive behavioral therapy for psychosis (CBTp) to challenge delusional thinking",
      "Social skills training and supported employment programs",
      "Long-acting injectable antipsychotics (paliperidone palmitate) for nonadherence",
      "Family psychoeducation to reduce expressed emotion and relapse rates"
    ],
    nursingActions: [
      "Establish trust using consistent, brief, honest interactions - avoid whispering near the patient as this may reinforce paranoid ideation",
      "Assess for command auditory hallucinations and determine if voices instruct self-harm or harm to others",
      "Monitor for extrapyramidal symptoms (EPS): acute dystonia, akathisia, pseudoparkinsonism",
      "Administer AIMS (Abnormal Involuntary Movement Scale) assessment every six months for patients on antipsychotics",
      "Ensure medication adherence by observing oral intake and monitoring for cheeking",
      "Provide structured daily routines to reduce disorganization and anxiety",
      "Assess metabolic panel and weight regularly because second-generation antipsychotics cause metabolic syndrome"
    ],
    signs: {
      left: [
        "Auditory hallucinations - patient appears to be listening or talking to unseen others",
        "Persecutory delusions - belief that others are plotting harm",
        "Disorganized speech - loose associations, tangential responses, word salad",
        "Flat or blunted affect - diminished emotional expression and monotone voice"
      ],
      right: [
        "Social withdrawal and avolition - inability to initiate goal-directed activity",
        "Anosognosia - lack of insight into illness, refuses treatment",
        "Concrete thinking - inability to interpret proverbs or abstract concepts",
        "Impaired self-care - poor hygiene, disheveled appearance, inappropriate clothing for weather"
      ]
    },
    medications: [
      {
        name: "Risperidone",
        type: "Second-Generation (Atypical) Antipsychotic",
        action: "Blocks D2 dopamine receptors in the mesolimbic pathway to reduce positive symptoms, and antagonizes 5-HT2A serotonin receptors to improve negative symptoms and reduce EPS risk",
        sideEffects: "Weight gain, hyperprolactinemia causing gynecomastia and amenorrhea, metabolic syndrome, orthostatic hypotension, sedation",
        contra: "Prolonged QT interval, concurrent use of CNS depressants in elderly patients with dementia-related psychosis (black box warning for increased mortality)",
        pearl: "Risperidone is the most likely atypical antipsychotic to cause hyperprolactinemia because it has the highest D2 binding affinity among second-generation agents"
      },
      {
        name: "Clozapine",
        type: "Second-Generation (Atypical) Antipsychotic",
        action: "Weak D2 blockade with strong 5-HT2A and D4 antagonism, uniquely effective for treatment-resistant schizophrenia and reducing suicidality",
        sideEffects: "Agranulocytosis (1-2%), seizures, myocarditis, severe metabolic syndrome, excessive salivation, sedation",
        contra: "Absolute neutrophil count below 1500/mm3, uncontrolled seizure disorder, history of clozapine-induced agranulocytosis",
        pearl: "Clozapine requires mandatory ANC monitoring - weekly for the first six months, biweekly for months six through twelve, then monthly thereafter through the REMS program"
      }
    ],
    pearls: [
      "Never argue with a patient's delusions - instead acknowledge feelings ('I can see that is frightening for you') and redirect to reality-based topics",
      "The prodromal phase of schizophrenia often presents with social withdrawal, declining academic performance, and unusual perceptual experiences years before frank psychosis - early intervention services improve long-term outcomes",
      "Neuroleptic malignant syndrome (NMS) is a life-threatening emergency caused by dopamine blockade presenting with hyperthermia, lead-pipe rigidity, altered mental status, and autonomic instability - stop the antipsychotic immediately and administer dantrolene"
    ],
    quiz: [
      {
        question: "A patient on haloperidol develops a temperature of 41C (105.8F), severe muscle rigidity, diaphoresis, and altered consciousness. What is the priority nursing action?",
        options: [
          "Administer benztropine to reverse extrapyramidal symptoms",
          "Discontinue the antipsychotic and notify the provider immediately",
          "Apply cooling blankets and administer acetaminophen",
          "Increase IV fluid rate and monitor intake and output"
        ],
        correct: 1,
        rationale: "These findings indicate neuroleptic malignant syndrome (NMS), a potentially fatal reaction to dopamine-blocking agents. The priority action is to discontinue the causative medication immediately because continued D2 blockade will worsen hypothalamic thermoregulation failure and skeletal muscle rigidity. Benztropine treats EPS, not NMS. Cooling measures and fluids are supportive but secondary to removing the cause."
      }
    ]
  },

  "major-depressive-disorder": {
    title: "Major Depressive Disorder",
    cellular: {
      title: "Monoamine Depletion",
      content: "Major depressive disorder involves depletion of serotonin, norepinephrine, and dopamine at synaptic clefts due to increased monoamine oxidase activity and impaired vesicular reuptake. Reduced serotonin in raphe nuclei projections disrupts mood regulation, sleep architecture, and appetite control. Chronic cortisol elevation from HPA axis hyperactivity causes hippocampal neuronal atrophy and reduced brain-derived neurotrophic factor (BDNF), impairing neuroplasticity and memory consolidation. Inflammatory cytokines (IL-6, TNF-alpha) further reduce tryptophan availability by shunting it toward kynurenine pathways instead of serotonin synthesis, explaining the high comorbidity between chronic inflammatory conditions and depression."
    },
    riskFactors: [
      "Family history of mood disorders indicating genetic vulnerability",
      "Female sex - lifetime prevalence approximately twice that of males due to hormonal fluctuations",
      "Chronic medical illness (diabetes, cardiovascular disease, hypothyroidism)",
      "History of childhood abuse or neglect altering stress-response circuits",
      "Social isolation and lack of meaningful relationships",
      "Substance use disorders - alcohol is a CNS depressant that depletes monoamines",
      "Recent significant loss (bereavement, divorce, job loss)",
      "Postpartum hormonal shifts (estrogen and progesterone withdrawal)"
    ],
    diagnostics: [
      "Five or more symptoms present during the same two-week period including depressed mood or anhedonia (DSM-5 criteria)",
      "PHQ-9 screening tool score of 10 or greater indicating moderate depression",
      "Thyroid function tests to rule out hypothyroidism mimicking depression",
      "CBC and metabolic panel to exclude anemia and electrolyte imbalances as contributing factors",
      "Columbia Suicide Severity Rating Scale (C-SSRS) to assess suicidal ideation and plan"
    ],
    management: [
      "SSRI therapy (sertraline, escitalopram) as first-line pharmacotherapy - therapeutic effect takes 4-6 weeks",
      "Cognitive behavioral therapy (CBT) as effective as medication for mild to moderate depression",
      "Electroconvulsive therapy (ECT) for severe, treatment-resistant depression or acute suicidality",
      "Regular aerobic exercise (30 minutes, 5 days per week) increases BDNF and serotonin synthesis",
      "Safety planning for suicidal patients including lethal means restriction",
      "Collaborative care model integrating psychiatric and primary care"
    ],
    nursingActions: [
      "Assess suicide risk at every encounter using a standardized tool - highest risk occurs 2-3 weeks after starting antidepressants when energy returns before mood improves",
      "Monitor for serotonin syndrome when SSRIs are combined with MAOIs, tramadol, or triptans",
      "Educate patient that SSRIs must not be abruptly discontinued due to discontinuation syndrome (dizziness, nausea, electric shock sensations)",
      "Implement one-to-one observation for actively suicidal patients and remove all sharps, belts, and cords from the environment",
      "Encourage structured daily activities and social engagement to counter psychomotor retardation",
      "Assess sleep patterns and morning worsening of symptoms (diurnal variation is characteristic)",
      "Monitor weight and appetite changes as both weight loss and gain are diagnostic criteria"
    ],
    signs: {
      left: [
        "Persistent sad or empty mood most of the day, nearly every day",
        "Anhedonia - loss of interest or pleasure in previously enjoyed activities",
        "Psychomotor retardation - slowed speech, movement, and cognitive processing",
        "Insomnia (early morning awakening) or hypersomnia"
      ],
      right: [
        "Feelings of worthlessness or excessive inappropriate guilt",
        "Diminished concentration and indecisiveness",
        "Significant unintentional weight change (greater than 5% in one month)",
        "Recurrent thoughts of death or suicidal ideation with or without a plan"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Selectively blocks serotonin reuptake transporters in presynaptic neurons, increasing serotonin availability in the synaptic cleft to enhance mood-regulating neurotransmission",
        sideEffects: "Sexual dysfunction (most common reason for nonadherence), GI disturbances (nausea, diarrhea), insomnia, headache, weight gain with long-term use",
        contra: "Concurrent MAOI use (must allow 14-day washout), concurrent use with pimozide, known hypersensitivity",
        pearl: "SSRIs take 4-6 weeks for full therapeutic effect - warn patients about this delay and monitor closely for suicidality during initial weeks because energy may return before mood improves, increasing capacity to act on suicidal thoughts"
      }
    ],
    pearls: [
      "The period of greatest suicide risk is 2-3 weeks after starting antidepressant therapy - the medication restores psychomotor energy before lifting depressed mood, giving patients the energy to act on suicidal plans they previously lacked motivation to execute",
      "Always ask about bipolar history before prescribing an antidepressant alone - SSRIs given without a mood stabilizer can trigger a manic episode in undiagnosed bipolar disorder",
      "Tyramine-rich foods (aged cheese, cured meats, red wine) must be avoided with MAOIs because tyramine potentiates norepinephrine release, causing hypertensive crisis"
    ],
    quiz: [
      {
        question: "A patient started on fluoxetine two weeks ago reports improved energy but still feels hopeless. The nurse's priority assessment is:",
        options: [
          "Evaluating the patient for serotonin syndrome",
          "Assessing for suicidal ideation with plan and intent",
          "Checking adherence to the medication regimen",
          "Recommending the provider increase the SSRI dose"
        ],
        correct: 1,
        rationale: "When a patient on a new antidepressant reports improved energy but persistent hopelessness, this is the highest-risk period for suicide. The SSRI has restored psychomotor energy (enabling action) but has not yet lifted the depressive mood. The priority is to assess suicidal ideation because the patient now has the energy to act on suicidal thoughts. Serotonin syndrome presents with neuromuscular excitability, not improved energy alone."
      }
    ]
  },

  "ptsd": {
    title: "Post-Traumatic Stress Disorder",
    cellular: {
      title: "Amygdala Hyperactivation",
      content: "PTSD develops when traumatic memory encoding bypasses normal hippocampal contextualization and becomes stored as fragmented, sensory-driven imprints in the amygdala. The amygdala remains hyperactivated, triggering exaggerated fear responses to trauma-associated cues even in safe environments. Chronic HPA axis dysregulation paradoxically produces low baseline cortisol with exaggerated cortisol reactivity to stress, impairing the normal negative feedback loop that should terminate the stress response. Prefrontal cortex hypoactivation reduces top-down inhibitory control over the amygdala, explaining why patients cannot rationally suppress flashbacks and hyperarousal. Noradrenergic hyperactivity in the locus coeruleus drives hypervigilance, exaggerated startle, and nightmares."
    },
    riskFactors: [
      "Direct exposure to combat, sexual assault, natural disaster, or life-threatening event",
      "Prior history of childhood trauma or abuse",
      "Female sex - approximately twice the prevalence of males",
      "Peritraumatic dissociation (dissociating during the traumatic event)",
      "Lack of social support following the trauma",
      "Pre-existing anxiety or depressive disorders",
      "Repeated occupational trauma exposure (first responders, military)",
      "Traumatic brain injury co-occurring with psychological trauma"
    ],
    diagnostics: [
      "Exposure to actual or threatened death, serious injury, or sexual violence",
      "Intrusion symptoms persisting beyond one month (flashbacks, nightmares, physiological reactivity to cues)",
      "Avoidance of trauma-associated stimuli (places, people, conversations)",
      "Negative alterations in cognition and mood (persistent negative beliefs, emotional numbing, detachment)",
      "Marked alterations in arousal and reactivity (hypervigilance, exaggerated startle, sleep disturbance)"
    ],
    management: [
      "Trauma-focused cognitive behavioral therapy (TF-CBT) as first-line psychotherapy",
      "Eye movement desensitization and reprocessing (EMDR) to facilitate traumatic memory reprocessing",
      "Sertraline or paroxetine (only two FDA-approved SSRIs for PTSD)",
      "Prazosin for trauma-related nightmares by blocking noradrenergic activation during sleep",
      "Grounding techniques for dissociative episodes (5-4-3-2-1 sensory method)",
      "Avoidance of benzodiazepines - they impair fear extinction learning and worsen long-term outcomes"
    ],
    nursingActions: [
      "Approach the patient calmly, announce your presence, and avoid startling - hypervigilance makes unexpected touch or noise triggering",
      "Provide a sense of safety and control by offering choices and explaining procedures before performing them",
      "Assess for dissociative episodes - patient may appear dazed, unresponsive, or 'frozen' and is re-experiencing the trauma",
      "Use grounding techniques during flashbacks: instruct patient to name 5 things they see, 4 they hear, 3 they touch, 2 they smell, 1 they taste",
      "Screen for comorbid substance use - over 50% of PTSD patients self-medicate with alcohol or drugs",
      "Monitor for suicidal ideation as PTSD significantly increases suicide risk",
      "Document triggers identified by the patient and communicate them to the care team to prevent retraumatization"
    ],
    signs: {
      left: [
        "Intrusive flashbacks with physiological reactivity (tachycardia, diaphoresis, trembling)",
        "Recurrent distressing nightmares related to the traumatic event",
        "Hypervigilance - constantly scanning the environment for threats",
        "Exaggerated startle response to unexpected stimuli"
      ],
      right: [
        "Emotional numbing and detachment from others",
        "Avoidance of people, places, and activities associated with the trauma",
        "Persistent negative beliefs ('The world is completely dangerous,' 'I am permanently damaged')",
        "Dissociative episodes - the patient appears to mentally 'leave' the present moment"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Increases serotonin availability to modulate amygdala hyperreactivity and restore prefrontal cortex inhibitory control over fear circuits",
        sideEffects: "Sexual dysfunction, GI disturbances, insomnia, headache, initial anxiety exacerbation",
        contra: "Concurrent MAOI use (14-day washout required), concurrent pimozide or thioridazine",
        pearl: "Sertraline and paroxetine are the only two FDA-approved medications for PTSD - start low and titrate slowly as patients with PTSD are more sensitive to medication side effects"
      },
      {
        name: "Prazosin",
        type: "Alpha-1 Adrenergic Antagonist",
        action: "Blocks noradrenergic activation in the CNS during REM sleep, reducing trauma-related nightmares by dampening the exaggerated norepinephrine surge that drives nocturnal re-experiencing",
        sideEffects: "Orthostatic hypotension (especially first dose), dizziness, syncope, nasal congestion",
        contra: "Hypotension, concurrent use of PDE-5 inhibitors (sildenafil), known hypersensitivity",
        pearl: "Give the first dose at bedtime with the patient seated - 'first-dose syncope' from orthostatic hypotension is the most dangerous side effect; titrate slowly from 1mg"
      }
    ],
    pearls: [
      "Benzodiazepines are contraindicated in PTSD because they impair fear extinction learning, increase dissociation risk, and have high abuse potential in this population - they worsen long-term outcomes despite short-term anxiety relief",
      "Trauma-informed care means asking 'What happened to you?' rather than 'What is wrong with you?' - always allow the patient to maintain control over the pace of disclosure",
      "Peritraumatic dissociation (dissociating during the actual traumatic event) is the strongest predictor of developing PTSD - these patients fail to integrate the memory through normal hippocampal processing"
    ],
    quiz: [
      {
        question: "A combat veteran with PTSD is prescribed prazosin for nightmares. Which nursing instruction is most important?",
        options: [
          "Take the medication in the morning with food to improve absorption",
          "Rise slowly from sitting or lying positions, especially after the first dose",
          "Avoid grapefruit juice while taking this medication",
          "Report any improvement in nightmares within the first 24 hours"
        ],
        correct: 1,
        rationale: "Prazosin is an alpha-1 adrenergic antagonist that causes orthostatic hypotension, particularly with the first dose ('first-dose syncope'). The most important instruction is to change positions slowly to prevent falls from sudden blood pressure drops. Prazosin is taken at bedtime, not in the morning. Grapefruit interaction is not a concern. Therapeutic effects take days to weeks, not 24 hours."
      }
    ]
  },

  "panic-disorder": {
    title: "Panic Disorder",
    cellular: {
      title: "Autonomic Nervous System Hyperactivation",
      content: "Panic disorder involves dysregulation of the brain's alarm system centered in the locus coeruleus, which inappropriately triggers massive noradrenergic discharge in the absence of actual danger. This activates the sympathetic nervous system fight-or-flight response, producing surge-like release of epinephrine and norepinephrine from the adrenal medulla. The resulting physiological cascade includes tachycardia, hyperventilation, vasoconstriction, and diaphoresis. Hyperventilation causes respiratory alkalosis (decreased CO2), which produces paresthesias, dizziness, and lightheadedness that patients catastrophically misinterpret as a heart attack, stroke, or impending death. This cognitive misinterpretation creates a positive feedback loop where fear of bodily sensations intensifies sympathetic activation, perpetuating the panic cycle. GABA-ergic inhibitory tone in the amygdala is reduced, lowering the threshold for panic activation."
    },
    riskFactors: [
      "Family history of panic disorder or anxiety disorders",
      "Female sex - twice as common as in males",
      "History of childhood separation anxiety",
      "Major life stressors or transitions",
      "Excessive caffeine or stimulant use lowering panic threshold",
      "History of childhood physical or sexual abuse",
      "Comorbid depression or other anxiety disorders",
      "Smoking - nicotine alters respiratory chemoreceptor sensitivity"
    ],
    diagnostics: [
      "Recurrent unexpected panic attacks with four or more somatic or cognitive symptoms peaking within minutes",
      "At least one month of persistent concern about additional attacks or maladaptive behavioral change",
      "12-lead ECG to rule out cardiac arrhythmia mimicking panic symptoms",
      "Thyroid function tests to exclude hyperthyroidism",
      "Urine toxicology to rule out stimulant-induced panic (cocaine, amphetamines)"
    ],
    management: [
      "SSRI therapy (paroxetine, sertraline) as first-line long-term pharmacotherapy",
      "Cognitive behavioral therapy focusing on interoceptive exposure and cognitive restructuring of catastrophic thoughts",
      "Short-term benzodiazepines (lorazepam) for acute panic episodes only - not for chronic management",
      "Breathing retraining to counteract hyperventilation-induced respiratory alkalosis",
      "Progressive muscle relaxation and mindfulness-based stress reduction",
      "Gradual exposure to feared bodily sensations (interoceptive exposure therapy)"
    ],
    nursingActions: [
      "Remain calm and stay with the patient during a panic attack - your calm demeanor reduces the patient's fear escalation",
      "Coach slow diaphragmatic breathing: inhale for 4 seconds, hold for 4, exhale for 6 to activate the parasympathetic nervous system",
      "Use brief, simple statements during acute panic - cognitive processing is impaired; avoid lengthy explanations",
      "After the attack resolves, educate the patient that panic attacks are not medically dangerous and cannot cause heart attacks or death",
      "Assess for agoraphobic avoidance behaviors that develop secondary to fear of having panic attacks in public",
      "Monitor for benzodiazepine dependence in patients using PRN anxiolytics frequently"
    ],
    signs: {
      left: [
        "Sudden onset tachycardia and palpitations - sympathetic activation of cardiac beta-1 receptors",
        "Chest tightness and dyspnea from intercostal muscle tension and hyperventilation",
        "Diaphoresis and trembling from epinephrine surge",
        "Dizziness and lightheadedness from hyperventilation-induced hypocapnia"
      ],
      right: [
        "Paresthesias (tingling in hands, feet, perioral area) from respiratory alkalosis shifting calcium binding",
        "Derealization or depersonalization - feeling detached from reality or one's body",
        "Intense fear of dying, 'going crazy,' or losing control",
        "Nausea and abdominal distress from parasympathetic rebound in the GI tract"
      ]
    },
    medications: [
      {
        name: "Paroxetine (Paxil)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Blocks serotonin reuptake to enhance serotonergic tone in the amygdala and prefrontal cortex, gradually reducing panic attack frequency and severity by restoring inhibitory control over fear circuits",
        sideEffects: "Sexual dysfunction, weight gain (highest among SSRIs), drowsiness, dry mouth, discontinuation syndrome (worst among SSRIs due to short half-life)",
        contra: "Concurrent MAOIs, concurrent thioridazine or pimozide, pregnancy (Category D - highest teratogenic risk among SSRIs)",
        pearl: "Paroxetine has the shortest half-life of SSRIs and the worst discontinuation syndrome - must be tapered very gradually over weeks; never stop abruptly"
      }
    ],
    pearls: [
      "A panic attack peaks within 10 minutes and typically resolves within 20-30 minutes - if symptoms persist beyond 30 minutes, reassess for an actual medical emergency such as myocardial infarction or pulmonary embolism",
      "Hyperventilation during panic causes respiratory alkalosis, which reduces ionized calcium and produces tetany-like symptoms (paresthesias, carpopedal spasm) - this is why patients feel they are 'dying' even though they are medically stable",
      "Avoid paper bag rebreathing in panic attacks - while it corrects hypocapnia, it can worsen hypoxia if the patient has an underlying pulmonary or cardiac condition causing the dyspnea"
    ],
    quiz: [
      {
        question: "During a panic attack, a patient reports tingling in both hands and around the mouth. The nurse understands this is caused by:",
        options: [
          "Myocardial ischemia reducing peripheral perfusion",
          "Hyperventilation causing respiratory alkalosis and decreased ionized calcium",
          "Excessive sympathetic stimulation causing peripheral vasoconstriction",
          "Conversion disorder with somatic symptom presentation"
        ],
        correct: 1,
        rationale: "Hyperventilation during panic attacks blows off CO2, causing respiratory alkalosis. The elevated pH increases protein binding of calcium, decreasing ionized (free) calcium levels. This relative hypocalcemia produces neuromuscular excitability manifesting as paresthesias (tingling) in the extremities and perioral area. This is not cardiac ischemia, as bilateral hand tingling with perioral involvement indicates a systemic process."
      }
    ]
  },

  "antisocial-personality-disorder": {
    title: "Antisocial Personality Disorder",
    cellular: {
      title: "Prefrontal Cortex Hypofunction",
      content: "Antisocial personality disorder (ASPD) involves structural and functional deficits in the prefrontal cortex, particularly the orbitofrontal and ventromedial regions responsible for impulse control, moral reasoning, and consequence evaluation. Reduced amygdala volume and reactivity impair fear conditioning and empathy - the person fails to generate appropriate emotional responses to others' distress. Low baseline cortisol and reduced autonomic reactivity (low resting heart rate) reflect a hypoactive stress-response system, driving sensation-seeking behavior to achieve normal arousal levels. Serotonergic deficiency in prefrontal circuits further disinhibits aggressive impulses. These neurobiological deficits interact with environmental factors such as childhood conduct disorder, abuse, and inconsistent parenting to produce a persistent pattern of violation of others' rights."
    },
    riskFactors: [
      "Conduct disorder diagnosed before age 15",
      "History of childhood abuse, neglect, or unstable home environment",
      "Male sex - three to five times more common in males",
      "Parental antisocial behavior or substance abuse",
      "Low socioeconomic status and peer delinquency",
      "Traumatic brain injury affecting frontal lobe function",
      "Substance use disorders (especially alcohol and stimulants)",
      "Callous-unemotional traits in childhood"
    ],
    diagnostics: [
      "Pervasive pattern of disregard for and violation of others' rights since age 15",
      "Must be at least 18 years old with evidence of conduct disorder before age 15",
      "Pattern of deceitfulness, impulsivity, irritability, aggression, reckless disregard for safety",
      "Failure to conform to social norms and lawful behaviors",
      "Lack of remorse for harmful actions - rationalizes or is indifferent to having hurt others"
    ],
    management: [
      "Firm, consistent limit-setting with clear consequences for behavior violations",
      "Dialectical behavior therapy (DBT) modified for antisocial traits focusing on distress tolerance and interpersonal effectiveness",
      "Contingency management rewarding prosocial behaviors",
      "Treatment of comorbid substance use disorders",
      "Pharmacotherapy targeting specific symptoms (SSRIs for impulsive aggression, mood stabilizers for emotional lability)"
    ],
    nursingActions: [
      "Set firm, consistent limits with clear, enforceable consequences - document all agreements in writing",
      "Avoid power struggles - use matter-of-fact communication without emotional reactivity",
      "Be aware of manipulation tactics including flattery, splitting staff, and feigning symptoms for secondary gain",
      "Maintain consistent boundaries across all staff through team communication - prevent splitting by ensuring uniform responses",
      "Do not personalize hostile or provocative behavior - maintain professional detachment",
      "Monitor for substance use and contraband on the unit",
      "Document all behavioral observations objectively without subjective judgment"
    ],
    signs: {
      left: [
        "Superficial charm and glib communication used to manipulate others",
        "Repeated lying, use of aliases, and conning for personal profit or pleasure",
        "Impulsivity and failure to plan ahead - acts without considering consequences",
        "Irritability and physical aggressiveness (repeated fights, assaults)"
      ],
      right: [
        "Reckless disregard for personal and others' safety",
        "Consistent irresponsibility - failure to sustain work or honor financial obligations",
        "Lack of remorse - indifference to or rationalization of harming, mistreating, or stealing from others",
        "Exploitation of others for personal gain without guilt or empathy"
      ]
    },
    medications: [
      {
        name: "Carbamazepine",
        type: "Mood Stabilizer/Anticonvulsant",
        action: "Stabilizes voltage-gated sodium channels and reduces kindling in limbic structures, decreasing impulsive aggression and emotional volatility in personality disorders",
        sideEffects: "Aplastic anemia, agranulocytosis (monitor CBC), Stevens-Johnson syndrome, hepatotoxicity, diplopia, ataxia",
        contra: "Concurrent MAOI use, bone marrow suppression, known hypersensitivity to tricyclic compounds, concurrent use with nonnucleoside reverse transcriptase inhibitors",
        pearl: "Carbamazepine is a potent CYP450 inducer that reduces the effectiveness of oral contraceptives, warfarin, and many other medications - always review drug interactions"
      }
    ],
    pearls: [
      "ASPD cannot be diagnosed before age 18, but conduct disorder in childhood is a prerequisite - look for the triad of fire-setting, cruelty to animals, and bedwetting (MacDonald triad) as warning signs",
      "Patients with ASPD are highly skilled at manipulating staff through flattery, intimidation, or splitting - maintain consistent limits across all team members and communicate openly about patient interactions",
      "There is no medication that treats ASPD itself - pharmacotherapy targets specific symptoms (impulsive aggression, emotional dysregulation, comorbid depression) rather than the core personality pathology"
    ],
    quiz: [
      {
        question: "A patient with ASPD tells the day nurse, 'You're the only one who understands me. The night nurse is terrible and should be fired.' The best nursing response is:",
        options: [
          "Thank the patient for the feedback and report the night nurse to the supervisor",
          "Acknowledge the statement neutrally and discuss it with the treatment team as a potential splitting behavior",
          "Confront the patient directly about attempting to manipulate staff",
          "Ignore the comment to avoid reinforcing attention-seeking behavior"
        ],
        correct: 1,
        rationale: "This is a classic splitting behavior - idealizing one staff member while devaluing another to create conflict and manipulate the team. The appropriate response is to acknowledge the statement without being flattered or reactive, then discuss it with the entire treatment team to maintain consistent boundaries. Confronting directly may escalate the interaction, while ignoring misses an opportunity to address the behavior therapeutically."
      }
    ]
  },

  "conversion-disorder": {
    title: "Conversion Disorder (Functional Neurological",
    cellular: {
      title: "Psychogenic Neural Circuit Disruption",
      content: "Conversion disorder involves unconscious disruption of voluntary motor or sensory neural pathways in response to psychological stress, without identifiable structural or neurological damage. Functional neuroimaging reveals altered connectivity between the limbic system (amygdala, anterior cingulate cortex) and motor/sensory cortices - emotional distress bypasses conscious awareness and directly inhibits voluntary motor output. The prefrontal cortex fails to integrate emotional processing with motor planning, resulting in genuine neurological deficits that do not follow anatomical nerve distributions. Unlike malingering, the patient is not consciously producing symptoms; unlike somatic symptom disorder, there are demonstrable neurological findings on examination that are inconsistent with known neurological diseases. The concept of primary gain refers to the unconscious reduction of anxiety through symptom production, while secondary gain involves external benefits such as attention or avoidance of responsibilities."
    },
    riskFactors: [
      "Recent significant psychological stressor or trauma",
      "History of physical or sexual abuse",
      "Female sex - two to three times more common",
      "Comorbid anxiety, depression, or dissociative disorders",
      "History of other somatic symptom or functional neurological disorders",
      "Family environment modeling illness behavior",
      "Lower socioeconomic status and limited health literacy",
      "Alexithymia - difficulty identifying and expressing emotions"
    ],
    diagnostics: [
      "Neurological symptoms incompatible with recognized neurological or medical conditions",
      "Clinical findings demonstrating internal inconsistency (e.g., Hoover sign for functional leg weakness)",
      "Normal neuroimaging (MRI, CT) and electrodiagnostic studies (EMG, nerve conduction) ruling out organic pathology",
      "Symptom onset temporally associated with a psychosocial stressor",
      "La belle indifference - inappropriate lack of concern about serious neurological symptoms (not always present)"
    ],
    management: [
      "Validation of symptoms as real and distressing - never tell the patient 'it is all in your head'",
      "Education about functional neurological disorders using the brain software vs. hardware analogy",
      "Physical therapy with task-specific retraining to retrain functional motor pathways",
      "Cognitive behavioral therapy addressing the connection between stress and physical symptoms",
      "Treatment of comorbid psychiatric conditions (depression, anxiety, PTSD)",
      "Gradual reduction of secondary gains by encouraging independence"
    ],
    nursingActions: [
      "Accept the symptoms as real to the patient - the deficit is genuine and not consciously produced",
      "Avoid excessive attention to the symptom while maintaining therapeutic engagement",
      "Encourage independence and participation in activities of daily living without reinforcing disability",
      "Monitor for safety hazards related to functional deficits (fall risk with functional gait disorder)",
      "Assess for underlying stressors and facilitate referral to psychiatric services",
      "Document neurological findings objectively, noting any inconsistencies without labeling the patient",
      "Coordinate multidisciplinary care between neurology, psychiatry, and physical therapy"
    ],
    signs: {
      left: [
        "Functional limb weakness or paralysis that does not follow anatomical nerve distributions",
        "Non-epileptic seizures (psychogenic) with preserved awareness, asynchronous limb movements, and eyes tightly closed",
        "Functional tremor that changes frequency with distraction or contralateral movement",
        "Functional gait disorder - bizarre, inconsistent gait patterns that improve with distraction"
      ],
      right: [
        "Sensory loss with sharp midline splitting (anatomically impossible as dermatomes overlap at midline)",
        "Functional blindness with intact pupillary reflexes and optokinetic nystagmus",
        "La belle indifference - calm indifference to apparently severe neurological symptoms",
        "Positive Hoover sign - involuntary hip extension of the 'weak' leg when flexing the opposite hip against resistance"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Treats comorbid depression and anxiety that commonly underlie conversion disorder; enhances serotonergic modulation of limbic-motor cortex connectivity",
        sideEffects: "Sexual dysfunction, GI disturbances, insomnia, headache, weight changes",
        contra: "Concurrent MAOI use (14-day washout), concurrent pimozide",
        pearl: "No medication directly treats conversion disorder - SSRIs are used to address the underlying anxiety and depression that drive the functional neurological symptoms"
      }
    ],
    pearls: [
      "Conversion disorder symptoms are NOT consciously produced (unlike malingering) and NOT imagined (unlike factitious disorder) - the neural circuit disruption is real, but functional rather than structural",
      "The Hoover sign is the most reliable bedside test for functional leg weakness: ask the patient to flex the strong hip against resistance while observing involuntary extension of the 'paralyzed' leg, proving the motor pathway is intact",
      "Avoid using the term 'psychogenic' with patients as it implies the symptoms are not real - use 'functional neurological disorder' and explain that the brain's software (function) is disrupted while the hardware (structure) is intact"
    ],
    quiz: [
      {
        question: "A patient presents with sudden bilateral leg paralysis after a car accident but MRI, CT, and nerve conduction studies are all normal. The nurse notes the patient appears calm and unconcerned. Which finding would confirm functional weakness?",
        options: [
          "Absent deep tendon reflexes in both lower extremities",
          "Positive Hoover sign showing involuntary hip extension of the 'paralyzed' leg",
          "Positive Babinski sign bilaterally",
          "Muscle atrophy consistent with prolonged immobilization"
        ],
        correct: 1,
        rationale: "A positive Hoover sign demonstrates that the motor pathway is intact despite apparent paralysis. When the patient flexes the unaffected hip against resistance, involuntary extension of the 'paralyzed' leg occurs, proving the motor neurons and pathways are functional. Absent DTRs and Babinski signs would suggest upper or lower motor neuron disease. Muscle atrophy would indicate prolonged denervation, not a functional disorder."
      }
    ]
  },

  "alcohol-withdrawal": {
    title: "Alcohol Withdrawal",
    image: imgSubstanceAbuse,
    cellular: {
      title: "GABA Downregulation",
      content: "Chronic alcohol consumption enhances inhibitory GABA-A receptor activity and suppresses excitatory NMDA glutamate receptors, creating a neurochemical equilibrium dependent on alcohol's presence. When alcohol is abruptly removed, the brain is left with downregulated (desensitized) GABA receptors providing insufficient inhibition and upregulated glutamate receptors producing excessive excitation. This excitatory-inhibitory imbalance causes CNS hyperexcitability manifesting as autonomic hyperactivity (tachycardia, hypertension, diaphoresis, hyperthermia), psychomotor agitation, tremors, and seizures. In severe cases, unopposed glutamate excitotoxicity and noradrenergic storm produce delirium tremens (DTs), characterized by global confusion, visual and tactile hallucinations, and life-threatening autonomic instability occurring 48-96 hours after the last drink. Kindling phenomenon means each successive withdrawal episode becomes more severe than the previous."
    },
    riskFactors: [
      "History of heavy prolonged alcohol use (typically greater than 10 years)",
      "Previous episodes of alcohol withdrawal or delirium tremens",
      "Concurrent acute illness or infection during withdrawal",
      "Older age with longer duration of alcohol dependence",
      "Elevated blood alcohol level at presentation indicating high tolerance",
      "History of withdrawal seizures (kindling effect increases severity with each episode)",
      "Concurrent benzodiazepine or sedative dependence",
      "Hepatic dysfunction impairing alcohol and medication metabolism"
    ],
    diagnostics: [
      "Clinical Institute Withdrawal Assessment for Alcohol (CIWA-Ar) score - scores above 20 indicate severe withdrawal requiring aggressive pharmacotherapy",
      "Blood alcohol level to determine current intoxication status and expected withdrawal timeline",
      "Comprehensive metabolic panel revealing hypomagnesemia, hypokalemia, hypophosphatemia",
      "Elevated liver enzymes (AST:ALT ratio greater than 2:1 suggesting alcoholic hepatitis)",
      "Serum ammonia if hepatic encephalopathy is suspected",
      "Thiamine level assessment before glucose administration"
    ],
    management: [
      "Benzodiazepines (lorazepam, chlordiazepoxide) as first-line agents using CIWA-Ar protocol-driven dosing to enhance GABA activity",
      "Thiamine 100mg IV/IM BEFORE glucose administration to prevent Wernicke encephalopathy",
      "Aggressive electrolyte replacement (magnesium, potassium, phosphate)",
      "Seizure precautions with padded side rails, suction at bedside, oxygen available",
      "ICU-level monitoring for patients with CIWA-Ar scores above 20 or history of DTs",
      "Folate supplementation for megaloblastic anemia from alcohol-related folate depletion"
    ],
    nursingActions: [
      "Assess CIWA-Ar score every 1-2 hours and administer benzodiazepines per protocol based on symptom severity",
      "Administer thiamine BEFORE any glucose-containing fluids - glucose metabolism consumes thiamine and can precipitate Wernicke encephalopathy in thiamine-depleted patients",
      "Maintain a quiet, well-lit environment to reduce sensory stimulation and minimize hallucination triggers",
      "Implement continuous cardiac monitoring - dysrhythmias occur from electrolyte imbalances and autonomic instability",
      "Monitor for withdrawal seizures, which typically occur 12-48 hours after last drink and may progress to status epilepticus",
      "Maintain aspiration precautions - patients with altered mental status and vomiting are at high risk",
      "Assess orientation frequently - progression from tremulousness to confusion to frank delirium indicates worsening withdrawal requiring escalation of care"
    ],
    signs: {
      left: [
        "Coarse tremors of hands and tongue within 6-12 hours of last drink",
        "Tachycardia, hypertension, and diaphoresis from sympathetic nervous system hyperactivity",
        "Nausea, vomiting, and anorexia",
        "Generalized tonic-clonic seizures occurring 12-48 hours post-cessation"
      ],
      right: [
        "Visual and tactile hallucinations (seeing insects, feeling bugs crawling on skin) occurring 12-24 hours after last drink",
        "Delirium tremens (48-96 hours): global confusion, severe agitation, autonomic instability, life-threatening hyperthermia",
        "Severe psychomotor agitation and combativeness",
        "Marked insomnia and anxiety progressing to frank disorientation"
      ]
    },
    medications: [
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine",
        action: "Enhances GABA-A receptor activity by increasing chloride channel opening frequency, compensating for downregulated GABA receptors during alcohol withdrawal and reducing CNS hyperexcitability",
        sideEffects: "Respiratory depression, excessive sedation, paradoxical agitation, hypotension, risk of dependence with prolonged use",
        contra: "Severe respiratory depression, acute narrow-angle glaucoma, sleep apnea (relative), concurrent opioid use increasing respiratory depression risk",
        pearl: "Lorazepam is preferred in patients with hepatic dysfunction because it undergoes glucuronidation (Phase II metabolism) rather than oxidative Phase I metabolism, making it safer in liver disease than chlordiazepoxide or diazepam"
      }
    ],
    pearls: [
      "ALWAYS give thiamine BEFORE glucose - glucose metabolism requires thiamine as a cofactor, and administering glucose to a thiamine-depleted alcoholic patient will consume remaining thiamine stores, precipitating acute Wernicke encephalopathy (confusion, ataxia, ophthalmoplegia)",
      "The kindling phenomenon means each successive alcohol withdrawal episode is more severe than the last - a patient who had mild tremors in a previous withdrawal may progress to seizures or DTs in the current episode",
      "Delirium tremens has a 5-15% mortality rate if untreated - the most common cause of death is cardiovascular collapse from autonomic instability, not seizures"
    ],
    quiz: [
      {
        question: "A patient admitted for alcohol withdrawal has a CIWA-Ar score of 25 and begins to seize. After ensuring safety, what should the nurse administer first?",
        options: [
          "IV dextrose 50% to correct potential hypoglycemia",
          "IV lorazepam to stop the seizure and reduce CNS excitability",
          "IV thiamine to prevent Wernicke encephalopathy",
          "IV phenytoin for seizure prophylaxis"
        ],
        correct: 1,
        rationale: "The immediate priority during an active seizure in alcohol withdrawal is IV benzodiazepine (lorazepam) to terminate the seizure and reduce glutamatergic excitotoxicity. Alcohol withdrawal seizures respond to benzodiazepines, not phenytoin, because the mechanism is GABA/glutamate imbalance rather than focal epileptiform activity. Thiamine should be given before glucose but is not the priority during active seizure. Dextrose should follow thiamine administration."
      }
    ]
  },

  "opioid-withdrawal": {
    title: "Opioid Withdrawal",
    cellular: {
      title: "Mu-Receptor Dependence",
      content: "Chronic opioid use causes downregulation and desensitization of mu-opioid receptors in the locus coeruleus, dorsal raphe nucleus, and periaqueductal gray matter. Opioids normally suppress noradrenergic neurons in the locus coeruleus through mu-receptor activation. When opioids are abruptly removed, these suppressed noradrenergic neurons fire unopposed, producing a massive norepinephrine surge (noradrenergic rebound) that drives the characteristic withdrawal symptoms: mydriasis, piloerection, diaphoresis, tachycardia, hypertension, lacrimation, rhinorrhea, and GI hypermotility. Unlike alcohol or benzodiazepine withdrawal, opioid withdrawal is intensely uncomfortable but not directly life-threatening in healthy adults - however, severe dehydration from vomiting and diarrhea, and aspiration risk, can cause death if untreated. Loss of opioid tolerance during abstinence creates extreme overdose risk if the patient relapses at their previous dose."
    },
    riskFactors: [
      "Chronic opioid use for more than two weeks at therapeutic or supratherapeutic doses",
      "Abrupt discontinuation of long-acting opioids or methadone",
      "Administration of opioid antagonists (naloxone) to opioid-dependent patients",
      "History of injection drug use",
      "Concurrent polysubstance dependence",
      "Lack of access to medication-assisted treatment (MAT) programs",
      "Co-occurring mental health disorders (depression, PTSD, anxiety)"
    ],
    diagnostics: [
      "Clinical Opiate Withdrawal Scale (COWS) score to objectively grade withdrawal severity",
      "Urine drug screen confirming opioid use and identifying specific substances",
      "Vital signs showing tachycardia, hypertension, and mild hyperthermia",
      "Physical examination revealing mydriasis, piloerection, yawning, lacrimation, rhinorrhea",
      "Comprehensive metabolic panel assessing dehydration and electrolyte status from GI losses"
    ],
    management: [
      "Buprenorphine/naloxone (Suboxone) as first-line medication-assisted treatment - must wait for moderate withdrawal (COWS score 13+) before initiating to avoid precipitated withdrawal",
      "Methadone for severe opioid use disorder through federally regulated opioid treatment programs",
      "Clonidine (alpha-2 agonist) to suppress locus coeruleus noradrenergic hyperactivity and reduce autonomic symptoms",
      "Aggressive IV fluid resuscitation and electrolyte replacement for dehydration from vomiting and diarrhea",
      "Loperamide for diarrhea, ondansetron for nausea and vomiting, dicyclomine for abdominal cramping",
      "Naltrexone after complete detoxification for relapse prevention"
    ],
    nursingActions: [
      "Assess withdrawal severity using COWS scoring every 2-4 hours to guide medication timing",
      "Do NOT initiate buprenorphine too early - starting before moderate withdrawal (COWS 13+) will displace remaining opioids from receptors and cause precipitated withdrawal",
      "Monitor intake and output closely - severe vomiting and diarrhea cause dangerous dehydration and electrolyte depletion",
      "Provide non-judgmental, empathetic care - stigma is a major barrier to treatment engagement",
      "Educate about reduced tolerance after abstinence - the greatest overdose risk occurs when patients relapse and use their pre-withdrawal dose",
      "Connect patient with medication-assisted treatment (MAT) and peer recovery support before discharge",
      "Monitor for aspiration risk in patients with active vomiting and altered consciousness"
    ],
    signs: {
      left: [
        "Mydriasis (dilated pupils) from unopposed sympathetic activation",
        "Piloerection ('goosebumps'), diaphoresis, and yawning",
        "Lacrimation (tearing) and rhinorrhea (runny nose) from parasympathetic rebound",
        "Severe muscle aches, bone pain, and restlessness"
      ],
      right: [
        "Nausea, vomiting, and severe diarrhea from GI hypermotility",
        "Tachycardia and hypertension from noradrenergic surge",
        "Severe insomnia and intense drug craving",
        "Abdominal cramping and involuntary leg movements ('kicking')"
      ]
    },
    medications: [
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu-Opioid Agonist/Antagonist",
        action: "Buprenorphine is a partial agonist at mu-opioid receptors providing enough activation to suppress withdrawal and craving without full euphoria, while its ceiling effect reduces overdose risk; naloxone deters IV misuse by precipitating withdrawal if injected",
        sideEffects: "Headache, nausea, constipation, precipitated withdrawal if given too early, sublingual irritation, dizziness",
        contra: "Active opioid intoxication, initiating before adequate withdrawal (COWS less than 13), severe hepatic impairment, concurrent full agonist opioid use",
        pearl: "Buprenorphine must be started only after the patient is in moderate withdrawal (COWS 13+) because as a partial agonist with high receptor affinity, it will displace the remaining full agonist opioid from receptors and trigger severe precipitated withdrawal"
      },
      {
        name: "Clonidine",
        type: "Central Alpha-2 Adrenergic Agonist",
        action: "Stimulates presynaptic alpha-2 receptors in the locus coeruleus, reducing noradrenergic firing and sympathetic outflow to alleviate autonomic withdrawal symptoms (tachycardia, hypertension, diaphoresis, anxiety)",
        sideEffects: "Hypotension, bradycardia, drowsiness, dry mouth, rebound hypertension with abrupt discontinuation",
        contra: "Symptomatic hypotension, bradycardia, concurrent use of beta-blockers (additive bradycardia risk)",
        pearl: "Clonidine treats the autonomic symptoms of withdrawal (sweating, tachycardia, hypertension) but does NOT reduce craving or GI symptoms - it is adjunctive therapy, not a replacement for medication-assisted treatment"
      }
    ],
    pearls: [
      "Opioid withdrawal is extremely uncomfortable but NOT directly life-threatening in healthy adults, unlike alcohol and benzodiazepine withdrawal which can cause fatal seizures - however, dehydration from GI losses can be dangerous",
      "The most dangerous period is AFTER withdrawal when tolerance has been lost - patients who relapse and use their previous dose are at extreme risk for fatal respiratory depression because their receptors have resensitized",
      "Never administer naloxone to manage withdrawal symptoms - naloxone is an antagonist that will precipitate severe, sudden withdrawal; it is reserved for acute opioid overdose with respiratory depression"
    ],
    quiz: [
      {
        question: "A nurse is preparing to start buprenorphine/naloxone for a patient in opioid withdrawal. The patient's COWS score is 8. What is the appropriate nursing action?",
        options: [
          "Administer the first dose immediately to relieve withdrawal symptoms",
          "Wait until the COWS score reaches 13 or higher before initiating buprenorphine",
          "Administer naloxone first to accelerate the withdrawal process",
          "Start methadone instead because the COWS score is too low for buprenorphine"
        ],
        correct: 1,
        rationale: "Buprenorphine must not be started until the COWS score is 13 or higher (moderate withdrawal). Because buprenorphine is a partial mu-agonist with very high receptor binding affinity, it displaces remaining full agonist opioids from receptors. If given too early when significant opioid is still receptor-bound, this displacement triggers precipitated withdrawal - a sudden, severe, and distressing withdrawal syndrome far worse than natural withdrawal."
      }
    ]
  },

  "insomnia": {
    title: "Insomnia",
    cellular: {
      title: "Sleep-Wake Cycle Disruption and Hyperarousal",
      content: "Insomnia involves dysfunction of the flip-flop switch model between wake-promoting and sleep-promoting circuits. The ventrolateral preoptic nucleus (VLPO), which normally inhibits the ascending reticular activating system (ARAS) to initiate sleep, is underactive, while the ARAS and hypothalamic orexin/hypocretin neurons maintain excessive wakefulness. Chronic hyperarousal of the hypothalamic-pituitary-adrenal (HPA) axis produces elevated evening cortisol levels that oppose melatonin secretion from the pineal gland, disrupting circadian rhythm entrainment. GABAergic inhibitory tone in the basal forebrain is reduced, preventing the normal dampening of cortical arousal needed for sleep onset. This chronic hyperarousal state produces cognitive hyperactivation (racing thoughts), physiological activation (elevated heart rate, increased metabolic rate during intended sleep), and emotional reactivity that perpetuates the insomnia through conditioned arousal to the sleep environment."
    },
    riskFactors: [
      "Female sex - hormonal fluctuations during menstrual cycle, pregnancy, and menopause disrupt sleep architecture",
      "Advancing age - decreased melatonin production and reduced slow-wave sleep",
      "Psychiatric disorders (depression, anxiety, PTSD) causing hyperarousal",
      "Shift work or irregular schedules disrupting circadian rhythm",
      "Excessive caffeine, nicotine, or alcohol use (alcohol fragments sleep architecture)",
      "Chronic pain conditions preventing sustained sleep",
      "Screen exposure before bedtime suppressing melatonin via blue light",
      "Obstructive sleep apnea or restless leg syndrome causing frequent awakenings"
    ],
    diagnostics: [
      "Sleep history documenting difficulty initiating or maintaining sleep, or early morning awakening, at least 3 nights per week for 3 months",
      "Pittsburgh Sleep Quality Index (PSQI) score greater than 5 indicating poor sleep quality",
      "Sleep diary for at least 2 weeks tracking bedtime, wake time, sleep latency, and nighttime awakenings",
      "Polysomnography to rule out obstructive sleep apnea, periodic limb movement disorder, or narcolepsy",
      "Actigraphy for objective measurement of sleep-wake patterns over extended periods"
    ],
    management: [
      "Cognitive behavioral therapy for insomnia (CBT-I) as first-line treatment - more effective than medications long-term",
      "Sleep restriction therapy to consolidate sleep by limiting time in bed to actual sleep time",
      "Stimulus control: use the bed only for sleep and intimacy, leave the bedroom if not asleep within 20 minutes",
      "Sleep hygiene education: consistent wake time, cool dark room, no screens 1 hour before bed",
      "Short-term pharmacotherapy (zolpidem, suvorexant) when CBT-I alone is insufficient",
      "Melatonin receptor agonist (ramelteon) for sleep-onset insomnia without abuse potential"
    ],
    nursingActions: [
      "Assess sleep pattern using a standardized tool and identify contributing factors (pain, medications, environment, anxiety)",
      "Educate on sleep hygiene: consistent wake time (even on weekends), avoid napping after 3pm, limit caffeine after noon",
      "Promote a quiet, dark, cool environment at bedtime - minimize nighttime disruptions for vitals and medications when possible",
      "Assess current medications for sleep-disrupting side effects (corticosteroids, beta-blockers, SSRIs, decongestants)",
      "Implement relaxation techniques: progressive muscle relaxation, guided imagery, deep breathing",
      "Caution against alcohol as a sleep aid - while it induces sedation, it fragments REM sleep and worsens insomnia long-term",
      "Monitor for fall risk with sedative-hypnotic use, especially in elderly patients"
    ],
    signs: {
      left: [
        "Difficulty initiating sleep (sleep-onset latency greater than 30 minutes)",
        "Frequent nighttime awakenings with difficulty returning to sleep",
        "Early morning awakening with inability to return to sleep",
        "Daytime fatigue, irritability, and impaired concentration despite adequate sleep opportunity"
      ],
      right: [
        "Anxiety and dread about bedtime (conditioned arousal to the sleep environment)",
        "Excessive time spent in bed trying to force sleep (counterproductive behavior that worsens insomnia)",
        "Cognitive impairment including poor memory, difficulty focusing, and slowed reaction time",
        "Physical symptoms of sleep deprivation: tension headaches, GI disturbance, increased pain sensitivity"
      ]
    },
    medications: [
      {
        name: "Zolpidem (Ambien)",
        type: "Non-Benzodiazepine Hypnotic (Z-drug)",
        action: "Selectively binds GABA-A receptors at the alpha-1 subunit to promote sedation without the anxiolytic, muscle relaxant, or anticonvulsant effects of benzodiazepines",
        sideEffects: "Complex sleep behaviors (sleepwalking, sleep-driving, sleep-eating), next-day drowsiness, amnesia, dizziness, headache",
        contra: "History of complex sleep behaviors on zolpidem, concurrent alcohol or CNS depressant use, severe hepatic impairment",
        pearl: "FDA recommends lower initial doses for women (5mg vs 10mg for men) because women metabolize zolpidem more slowly and are at higher risk for next-morning impairment and motor vehicle accidents"
      }
    ],
    pearls: [
      "CBT-I is first-line treatment for chronic insomnia and is MORE effective than medications long-term because it addresses the underlying behavioral and cognitive perpetuating factors rather than just inducing sedation",
      "Sleep restriction therapy sounds counterintuitive but works by building homeostatic sleep drive - limit time in bed to match actual sleep time, then gradually extend as sleep efficiency improves above 85%",
      "Alcohol is the most commonly used 'sleep aid' but actually worsens insomnia - it suppresses REM sleep, causes rebound wakefulness in the second half of the night, and produces fragmented, non-restorative sleep"
    ],
    quiz: [
      {
        question: "A patient with chronic insomnia asks the nurse why the provider recommended CBT-I instead of a sleeping pill. The best response is:",
        options: [
          "Sleeping pills are too dangerous and addictive for long-term use",
          "CBT-I addresses the underlying causes of insomnia and produces more lasting improvement than medications alone",
          "The provider wants to try non-drug therapy first before considering medications",
          "CBT-I works faster than medications and has fewer side effects"
        ],
        correct: 1,
        rationale: "CBT-I is the gold standard first-line treatment for chronic insomnia because it addresses the perpetuating cognitive and behavioral factors (conditioned arousal, maladaptive sleep habits, catastrophic thinking about sleep) that maintain insomnia. Unlike medications that only induce sedation while taken, CBT-I produces durable improvement that persists after treatment ends. It is not necessarily faster (typically 4-8 sessions), but its effects are more lasting."
      }
    ]
  },

  "narcolepsy": {
    title: "Narcolepsy",
    cellular: {
      title: "Orexin/Hypocretin Deficiency",
      content: "Type 1 narcolepsy results from autoimmune destruction of approximately 70,000 orexin (hypocretin)-producing neurons in the lateral hypothalamus. Orexin normally stabilizes the flip-flop switch between wakefulness and sleep by reinforcing wake-promoting signals from the ascending reticular activating system. Without orexin, the boundary between wakefulness and REM sleep becomes unstable, causing inappropriate intrusions of REM phenomena into wakefulness. Cataplexy occurs when REM-associated muscle atonia is triggered during wakefulness by strong emotions (laughter, surprise, anger), because orexin deficiency removes the normal inhibition of pontine REM-on neurons. Hypnagogic hallucinations and sleep paralysis represent other REM intrusions occurring at sleep-wake transitions. The autoimmune mechanism involves HLA-DQB1*06:02 predisposition and likely T-cell-mediated destruction of orexin neurons, possibly triggered by streptococcal infection or H1N1 influenza vaccination."
    },
    riskFactors: [
      "HLA-DQB1*06:02 haplotype (present in 98% of Type 1 narcolepsy patients)",
      "Family history of narcolepsy (though most cases are sporadic)",
      "Post-streptococcal autoimmune response targeting orexin neurons",
      "H1N1 influenza or H1N1 vaccination (Pandemrix) as potential autoimmune trigger",
      "Adolescent or young adult onset (typical peak onset 10-20 years of age)",
      "Traumatic brain injury affecting hypothalamic structures"
    ],
    diagnostics: [
      "Overnight polysomnography followed by Multiple Sleep Latency Test (MSLT) showing mean sleep latency of 8 minutes or less with 2 or more sleep-onset REM periods (SOREMPs)",
      "CSF orexin/hypocretin levels below 110 pg/mL (diagnostic for Type 1 narcolepsy)",
      "Epworth Sleepiness Scale score indicating excessive daytime sleepiness",
      "HLA-DQB1*06:02 typing (supportive but not diagnostic alone as it is present in 25% of the general population)",
      "Actigraphy documenting irregular sleep-wake patterns and daytime napping"
    ],
    management: [
      "Scheduled short daytime naps (15-20 minutes) to manage excessive daytime sleepiness",
      "Modafinil or armodafinil as first-line wake-promoting agents",
      "Sodium oxybate (Xyrem) for cataplexy and disrupted nighttime sleep - taken at bedtime and again 2.5-4 hours later",
      "Stimulants (methylphenidate, amphetamine) for refractory excessive daytime sleepiness",
      "SSRIs or venlafaxine to suppress REM sleep and reduce cataplexy, hypnagogic hallucinations, and sleep paralysis",
      "Consistent sleep-wake schedule with adequate nocturnal sleep opportunity"
    ],
    nursingActions: [
      "Prioritize safety: assess for cataplexy triggers and implement fall precautions during emotional situations",
      "Educate about the need for consistent sleep schedules and strategic planned naps during the day",
      "Counsel against driving and operating heavy machinery during peak sleepiness periods until symptoms are controlled",
      "Monitor sodium oxybate administration: the patient takes the first dose at bedtime and sets an alarm for the second dose 2.5-4 hours later while remaining in bed",
      "Educate that narcolepsy is a lifelong neurological condition, not laziness, and advocate for workplace and school accommodations",
      "Screen for comorbid depression and sleep apnea, which commonly co-occur with narcolepsy"
    ],
    signs: {
      left: [
        "Excessive daytime sleepiness with irresistible sleep attacks despite adequate nighttime sleep",
        "Cataplexy - sudden bilateral loss of muscle tone triggered by strong emotions (laughter, surprise), ranging from jaw dropping to full postural collapse",
        "Hypnagogic hallucinations - vivid, often frightening visual or auditory hallucinations at sleep onset",
        "Sleep paralysis - temporary inability to move or speak during sleep-wake transitions, lasting seconds to minutes"
      ],
      right: [
        "Automatic behaviors - performing routine tasks (writing, driving) in a semi-conscious state with no memory of the activity",
        "Fragmented nocturnal sleep despite excessive daytime sleepiness",
        "Rapid onset of REM sleep (within minutes of sleep onset rather than the normal 90-minute delay)",
        "Sudden emotional triggers causing partial or complete muscle weakness (cataplexy episodes)"
      ]
    },
    medications: [
      {
        name: "Modafinil (Provigil)",
        type: "Wake-Promoting Agent",
        action: "Promotes wakefulness by inhibiting dopamine reuptake in the prefrontal cortex and activating orexin-dependent arousal pathways, without the peripheral sympathomimetic effects of traditional stimulants",
        sideEffects: "Headache, nausea, anxiety, insomnia, dizziness, reduced effectiveness of hormonal contraceptives (CYP3A4 induction)",
        contra: "Known hypersensitivity, history of Stevens-Johnson syndrome with modafinil, concurrent use with hormonal contraceptives without backup method",
        pearl: "Modafinil reduces the effectiveness of oral contraceptives by inducing CYP3A4 metabolism - female patients of childbearing age need an alternative or additional contraceptive method"
      },
      {
        name: "Sodium Oxybate (Xyrem)",
        type: "CNS Depressant / GABA-B Agonist",
        action: "Consolidates nocturnal sleep and suppresses cataplexy by enhancing slow-wave sleep through GABA-B receptor activation, reducing the daytime sleep pressure and REM sleep intrusions",
        sideEffects: "Respiratory depression, nausea, enuresis, sleepwalking, confusion, weight loss, sodium load (important in heart failure patients)",
        contra: "Concurrent sedative-hypnotic or alcohol use, succinic semialdehyde dehydrogenase deficiency, concurrent use of opioids or benzodiazepines",
        pearl: "Sodium oxybate is a Schedule III controlled substance (it is the sodium salt of GHB) with a strict REMS program - it is the only medication that addresses both excessive daytime sleepiness AND cataplexy"
      }
    ],
    pearls: [
      "Cataplexy is pathognomonic for Type 1 narcolepsy - if a patient reports sudden muscle weakness triggered by laughing or emotional situations, think narcolepsy first",
      "Narcolepsy is NOT just 'being tired' - it is an autoimmune-mediated loss of orexin neurons that destabilizes the sleep-wake boundary, causing REM sleep phenomena to intrude into wakefulness",
      "The MSLT must follow a normal overnight polysomnography to rule out sleep deprivation as a cause of daytime sleepiness - two or more SOREMPs (sleep-onset REM periods) with mean sleep latency under 8 minutes is diagnostic"
    ],
    quiz: [
      {
        question: "A patient with narcolepsy suddenly collapses while laughing at a joke but remains fully conscious. This episode represents:",
        options: [
          "A vasovagal syncope episode triggered by the Valsalva maneuver",
          "Cataplexy caused by orexin deficiency allowing emotional triggers to activate REM-associated muscle atonia",
          "A narcoleptic sleep attack with loss of consciousness",
          "An absence seizure triggered by photic stimulation"
        ],
        correct: 1,
        rationale: "Cataplexy is the sudden loss of voluntary muscle tone triggered by strong emotions (especially laughter) while the patient remains fully conscious. It occurs because orexin deficiency allows REM-associated muscle atonia circuits to activate during wakefulness. The key differentiator is preserved consciousness - in syncope the patient loses consciousness, in sleep attacks the patient falls asleep, and in seizures there is altered awareness. Cataplexy is pathognomonic for Type 1 narcolepsy."
      }
    ]
  },

  "agoraphobia": {
    title: "Agoraphobia",
    cellular: {
      title: "Fear Circuit Sensitization",
      content: "Agoraphobia involves pathological sensitization of the brain's fear circuitry, particularly the amygdala, anterior insula, and periaqueductal gray, leading to disproportionate fear responses in situations where escape might be difficult or help unavailable. Repeated pairing of environmental contexts (crowds, open spaces, public transport) with panic-like bodily sensations creates conditioned fear responses through amygdala-hippocampal associative learning. The anterior insula becomes hyperresponsive to interoceptive signals (heart rate, breathing), generating exaggerated threat predictions. Prefrontal cortex hypoactivation impairs extinction of these conditioned fear responses, meaning that even after safe exposures, the fear association is not properly unlearned. Anticipatory anxiety activates the HPA axis before the feared situation is encountered, producing preemptive sympathetic arousal that reinforces avoidance behavior through negative reinforcement (avoidance reduces anxiety, strengthening the avoidance pattern)."
    },
    riskFactors: [
      "History of panic disorder (agoraphobia frequently develops secondary to panic attacks)",
      "Traumatic experience in a public place or enclosed space",
      "Female sex - twice as prevalent as in males",
      "Childhood separation anxiety or behavioral inhibition temperament",
      "Family history of agoraphobia or panic disorder",
      "Comorbid anxiety or depressive disorders",
      "Substance use as a coping mechanism for anxiety"
    ],
    diagnostics: [
      "Marked fear or anxiety about two or more of five situations: public transportation, open spaces, enclosed places, standing in line or crowds, being outside the home alone",
      "Fear is out of proportion to actual danger and persists for six months or more",
      "Situations are actively avoided, require a companion, or are endured with intense fear",
      "Fear causes clinically significant distress or functional impairment",
      "Exclusion of other medical or psychiatric causes (hyperthyroidism, cardiac arrhythmia, other anxiety disorders)"
    ],
    management: [
      "Cognitive behavioral therapy with systematic graduated exposure as first-line treatment",
      "In vivo exposure therapy: gradually approaching feared situations in a hierarchical fashion",
      "SSRIs (sertraline, paroxetine) as first-line pharmacotherapy to reduce anticipatory anxiety and panic",
      "Virtual reality exposure therapy for patients unable to engage in real-world exposures initially",
      "Interoceptive exposure to reduce sensitivity to bodily sensations (intentionally inducing dizziness, rapid heart rate in safe settings)",
      "Avoidance of benzodiazepines for chronic management due to dependence risk and interference with exposure learning"
    ],
    nursingActions: [
      "Validate the patient's fear as real and distressing while encouraging gradual exposure to feared situations",
      "Collaborate with the patient to create an anxiety hierarchy ranking feared situations from least to most anxiety-provoking",
      "Accompany the patient during initial exposure exercises when appropriate, gradually reducing support as confidence builds",
      "Teach and practice relaxation techniques (diaphragmatic breathing, progressive muscle relaxation) before exposure sessions",
      "Monitor for panic attacks during exposure therapy and provide grounding techniques",
      "Assess for social isolation and functional impairment resulting from avoidance behaviors",
      "Screen for comorbid depression, substance use, and suicidal ideation which are common in severe agoraphobia"
    ],
    signs: {
      left: [
        "Active avoidance of situations where escape is perceived as difficult (crowded stores, bridges, public transport)",
        "Inability to leave home alone - requires a companion for any outing",
        "Panic symptoms (tachycardia, dyspnea, diaphoresis) when confronted with feared situations",
        "Anticipatory anxiety - becoming anxious hours or days before planned exposure to a feared situation"
      ],
      right: [
        "Progressive narrowing of comfortable environments, eventually becoming housebound",
        "Fear of experiencing a panic attack in public with no available help or escape route",
        "Significant occupational and social impairment due to avoidance behavior",
        "Dependence on 'safety behaviors' (sitting near exits, always having phone charged, carrying medications)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Enhances serotonergic transmission in the amygdala and prefrontal cortex, gradually reducing the intensity of the fear response and anticipatory anxiety associated with agoraphobic situations",
        sideEffects: "Sexual dysfunction, GI disturbances, insomnia, initial anxiety exacerbation in first 1-2 weeks, headache",
        contra: "Concurrent MAOI use, concurrent pimozide or thioridazine use",
        pearl: "SSRIs may initially worsen anxiety for the first 1-2 weeks before improvement begins - warn patients about this to prevent premature discontinuation and start at half the usual dose"
      }
    ],
    pearls: [
      "Agoraphobia can exist without panic disorder (DSM-5 separated them) - the core fear is about being in situations where escape is difficult or help is unavailable, not just about having panic attacks",
      "Avoidance is the maintaining factor in agoraphobia - each avoided situation reinforces the belief that the situation is dangerous, strengthening the fear through negative reinforcement; exposure therapy breaks this cycle",
      "The most functionally impaired agoraphobia patients become completely housebound - assess for secondary complications including depression, deconditioning, vitamin D deficiency, and social isolation"
    ],
    quiz: [
      {
        question: "A patient with agoraphobia has been prescribed an SSRI and referred for CBT. During the first week of medication, the patient reports worsening anxiety. The nurse should:",
        options: [
          "Recommend the patient stop the medication and contact the provider",
          "Explain that initial anxiety increase is expected with SSRIs and should improve in 2-4 weeks, and assess safety",
          "Administer a PRN benzodiazepine and monitor for sedation",
          "Reassure the patient that anxiety is a normal part of recovery and offer no intervention"
        ],
        correct: 1,
        rationale: "SSRIs commonly cause an initial increase in anxiety during the first 1-2 weeks of treatment due to acute serotonergic activation before receptor adaptation occurs. The nurse should educate the patient that this is an expected, temporary phenomenon and assess for safety (suicidal ideation). Abruptly stopping the medication is premature; this transient worsening does not indicate treatment failure. The patient should be supported through this period and reassessed at 2-4 weeks."
      }
    ]
  },

  "intimate-partner-violence": {
    title: "Intimate Partner Violence",
    cellular: {
      title: "Neurobiological Impact of Chronic Trauma",
      content: "Intimate partner violence (IPV) produces chronic activation of the HPA axis and sympatho-adrenal-medullary system, resulting in sustained elevated cortisol and catecholamine levels that damage multiple organ systems over time. Chronic stress exposure causes hippocampal atrophy (impairing memory and contextual processing), prefrontal cortex thinning (reducing executive function and decision-making capacity), and amygdala sensitization (heightening threat detection and fear responses). These neurobiological changes explain why victims often appear confused, have difficulty making decisions, or seem unable to 'just leave' - their cognitive and emotional processing centers have been physiologically altered by sustained trauma. Learned helplessness develops through repeated unpredictable cycles of abuse and reconciliation, depleting dopaminergic reward circuits and producing a state of passive resignation. The traumatic bonding (Stockholm syndrome) mechanism involves intermittent reinforcement creating powerful attachment to the abuser during 'honeymoon' phases."
    },
    riskFactors: [
      "Previous history of IPV victimization or childhood exposure to domestic violence",
      "Social isolation from family and friends (often enforced by the abuser)",
      "Financial dependence on the abuser or shared financial resources",
      "Pregnancy and the postpartum period (violence often escalates during pregnancy)",
      "Substance use by either partner lowering inhibitory control",
      "Low self-esteem and history of depression or anxiety",
      "Cultural or religious beliefs discouraging separation",
      "Immigration status dependency on the abuser"
    ],
    diagnostics: [
      "Universal screening with validated tools: HITS (Hurt, Insult, Threaten, Scream) or SAFE (Stress, Afraid, Friend, Emergency) questionnaire",
      "Physical examination findings inconsistent with reported mechanism of injury",
      "Pattern injuries: bruising in various stages of healing, defensive wounds on forearms, injuries to areas typically covered by clothing",
      "Screening conducted in private with the patient alone, never in the presence of the partner",
      "Assessment for strangulation indicators: petechiae above the clavicles, hoarse voice, difficulty swallowing, subconjunctival hemorrhage"
    ],
    management: [
      "Safety planning: identify safe places, pack an emergency bag, establish code words with trusted contacts",
      "Provide crisis hotline numbers (National Domestic Violence Hotline: 1-800-799-7233) in a way the abuser will not discover",
      "Mandatory reporting per state law for child abuse, elder abuse, and in some states, IPV itself",
      "Forensic evidence collection and documentation with patient consent",
      "Referral to victim advocacy services, legal aid, and shelter resources",
      "Treat physical injuries and screen for traumatic brain injury from repeated head trauma or strangulation"
    ],
    nursingActions: [
      "Screen ALL patients for IPV using a validated screening tool in a private setting without the partner present",
      "Use empathetic, non-judgmental language: 'You do not deserve to be hurt. This is not your fault. Help is available when you are ready.'",
      "Never pressure the patient to leave the relationship - premature departure without a safety plan increases homicide risk; respect the patient's autonomy and timeline",
      "Document injuries objectively using body maps, photographs (with consent), and direct quotes - 'Patient states partner struck left side of face with closed fist'",
      "Assess lethality risk factors: access to firearms, escalating frequency/severity of violence, strangulation history, threats to kill",
      "Provide safety planning resources in a discreet format (small card, written inside a prescription label) that the abuser is unlikely to find",
      "Know your state's mandatory reporting laws - all states require reporting child abuse, most require reporting elder/dependent adult abuse, some require reporting IPV"
    ],
    signs: {
      left: [
        "Injuries inconsistent with the reported mechanism - 'walked into a door' but has bilateral orbital bruising",
        "Injuries in various stages of healing suggesting repeated episodes",
        "Partner who refuses to leave the patient alone with healthcare providers",
        "Frequent emergency department visits for vague complaints or injuries"
      ],
      right: [
        "Anxiety, hypervigilance, and startled response when the partner speaks or moves",
        "Minimizing or denying injuries while appearing fearful",
        "Delayed presentation for medical care suggesting restricted access to healthcare",
        "Signs of strangulation: petechiae on face/neck, hoarseness, difficulty swallowing, bloodshot eyes"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Treats comorbid PTSD, depression, and anxiety disorders that commonly develop in IPV survivors by enhancing serotonergic neurotransmission and modulating amygdala hyperreactivity",
        sideEffects: "Sexual dysfunction, GI disturbances, insomnia, headache, initial anxiety exacerbation",
        contra: "Concurrent MAOI use, concurrent pimozide",
        pearl: "Medication alone does not address IPV - pharmacotherapy for PTSD and depression must be combined with safety planning, advocacy services, and trauma-focused therapy; never prescribe medications that the abuser could use to sedate or poison the victim"
      }
    ],
    pearls: [
      "The most dangerous time for a victim is when they attempt to leave the relationship - homicide risk increases significantly at separation; this is why a detailed safety plan is essential BEFORE leaving",
      "Strangulation is the single most important risk factor for IPV homicide - any history of strangulation by the partner means the victim is 7 times more likely to be killed; assess for delayed airway swelling and refer for imaging",
      "Never write 'IPV' or 'domestic violence' on discharge paperwork that the abuser might see - document safety resources given in a way that does not endanger the patient (e.g., include hotline number inside a medication instruction sheet)"
    ],
    quiz: [
      {
        question: "A nurse suspects intimate partner violence. The patient's partner is in the room and refuses to leave. The most appropriate nursing action is:",
        options: [
          "Ask the partner directly if abuse is occurring in the relationship",
          "Document suspicions in the chart and contact security to remove the partner",
          "Create a legitimate reason to be alone with the patient (e.g., provide urine sample, radiograph) and screen privately",
          "Provide written domestic violence resources to the patient in front of the partner"
        ],
        correct: 2,
        rationale: "The nurse must screen for IPV in a private setting WITHOUT the partner present, as the patient cannot disclose safely with the abuser in the room. Creating a clinical pretext (urine specimen, examination, imaging) provides a natural, non-suspicious reason to separate the patient from the partner. Directly confronting the partner may escalate danger. Providing visible resources in front of the abuser puts the patient at risk for retaliation."
      }
    ]
  },

  "bulimia-nervosa": {
    title: "Bulimia Nervosa",
    cellular: {
      title: "Electrolyte Derangement",
      content: "Bulimia nervosa involves cycles of binge eating followed by compensatory purging behaviors (self-induced vomiting, laxative/diuretic abuse, excessive exercise) that produce severe metabolic and electrolyte disturbances. Repeated vomiting causes loss of hydrochloric acid from the stomach, producing hypochloremic hypokalemic metabolic alkalosis. The kidneys attempt to correct alkalosis by excreting bicarbonate but concurrently lose potassium, worsening hypokalemia. Severe hypokalemia disrupts cardiac myocyte repolarization, prolonging the QT interval and predisposing to fatal ventricular dysrhythmias (torsades de pointes). Chronic exposure of dental enamel to gastric acid causes perimolysis (erosion of the lingual surfaces of teeth). Repeated forced vomiting traumatizes the esophageal mucosa, risking Mallory-Weiss tears and rarely, Boerhaave syndrome (esophageal rupture). Parotid gland hypertrophy develops from chronic stimulation, producing chipmunk-like facial swelling."
    },
    riskFactors: [
      "Female sex - approximately 10:1 female to male ratio",
      "Adolescent or young adult onset (peak 18-25 years)",
      "History of dieting or weight-related teasing",
      "Participation in appearance-focused activities (gymnastics, dance, modeling, wrestling)",
      "Family history of eating disorders, mood disorders, or substance abuse",
      "Perfectionism and low self-esteem with self-worth tied to body shape and weight",
      "History of childhood sexual abuse or trauma",
      "Comorbid depression, anxiety, or borderline personality disorder"
    ],
    diagnostics: [
      "Recurrent binge eating (eating a large amount in a discrete period with a sense of loss of control) followed by compensatory purging behaviors at least once weekly for 3 months",
      "Serum potassium decreased (hypokalemia from purging-induced renal/GI losses)",
      "ABG showing metabolic alkalosis (elevated bicarbonate, elevated pH) from HCl loss through vomiting",
      "ECG showing prolonged QT interval, ST depression, U waves, or dysrhythmias from hypokalemia",
      "Dental examination revealing enamel erosion on lingual (inner) surfaces of teeth (perimolysis)",
      "Elevated serum amylase from parotid gland hypertrophy (salivary amylase, not pancreatic)"
    ],
    management: [
      "Cognitive behavioral therapy specifically designed for eating disorders (CBT-E) as first-line treatment",
      "Fluoxetine (the only FDA-approved medication for bulimia) at higher doses (60-80mg) than used for depression",
      "Structured meal planning with a registered dietitian to normalize eating patterns",
      "Aggressive potassium and electrolyte replacement monitoring ECG throughout",
      "Medical stabilization of cardiac dysrhythmias if present",
      "Dental referral for enamel erosion assessment and treatment"
    ],
    nursingActions: [
      "Monitor electrolytes daily during acute treatment - hypokalemia is the most immediately dangerous finding due to cardiac dysrhythmia risk",
      "Implement bathroom supervision for 1-2 hours after meals to prevent purging behavior",
      "Observe for Russell sign (calluses on the knuckles from repeated self-induced vomiting) as evidence of purging",
      "Monitor cardiac rhythm continuously if potassium is critically low - watch for U waves, prolonged QT, and ventricular dysrhythmias",
      "Provide non-judgmental, empathetic care - shame and secrecy are core features of bulimia and confrontational approaches increase resistance",
      "Assess for ipecac abuse which can cause irreversible cardiomyopathy",
      "Educate that BMI in bulimia is often normal or slightly above normal, unlike anorexia nervosa - a normal weight does not rule out a serious eating disorder"
    ],
    signs: {
      left: [
        "Russell sign - calluses or scarring on the dorsum of the hand/knuckles from repeated contact with teeth during self-induced vomiting",
        "Parotid gland hypertrophy ('chipmunk cheeks') from chronic stimulation of salivary glands",
        "Dental enamel erosion (perimolysis) on lingual surfaces of teeth from repeated acid exposure",
        "Esophageal irritation - chronic sore throat, hoarseness, hematemesis (Mallory-Weiss tear)"
      ],
      right: [
        "Metabolic alkalosis with hypokalemia from repeated vomiting of gastric acid",
        "Cardiac dysrhythmias (prolonged QT, U waves) from potassium depletion",
        "Normal or near-normal BMI despite severe eating disorder",
        "Menstrual irregularities and subconjunctival hemorrhage from forceful vomiting"
      ]
    },
    medications: [
      {
        name: "Fluoxetine (Prozac)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Reduces binge-purge frequency by enhancing serotonergic activity in hypothalamic appetite centers and prefrontal cortex impulse-control circuits; the only FDA-approved medication for bulimia nervosa",
        sideEffects: "Sexual dysfunction, insomnia, nausea, headache, anxiety, weight changes",
        contra: "Concurrent MAOI use (14-day washout), concurrent pimozide or thioridazine",
        pearl: "Fluoxetine for bulimia requires higher doses (60-80mg) than for depression (20mg) - the mechanism in eating disorders involves serotonergic regulation of satiety and impulse control at different receptor thresholds"
      }
    ],
    pearls: [
      "Hypokalemia is the most dangerous acute complication of bulimia nervosa - it can cause fatal cardiac dysrhythmias (torsades de pointes) and must be corrected aggressively with cardiac monitoring",
      "Unlike anorexia nervosa, patients with bulimia typically maintain a normal or near-normal BMI, which can delay recognition and diagnosis - severity is determined by purging frequency, not weight",
      "Russell sign (knuckle calluses) is a hallmark physical finding but may be absent in patients who use instruments rather than fingers for emesis induction, or who primarily use laxatives or diuretics as compensatory behaviors"
    ],
    quiz: [
      {
        question: "A patient with bulimia nervosa is admitted with a serum potassium of 2.8 mEq/L. The nurse's priority intervention is:",
        options: [
          "Implement bathroom supervision after meals to prevent purging",
          "Initiate continuous cardiac monitoring and potassium replacement",
          "Obtain a psychiatric consultation for eating disorder treatment",
          "Begin nutritional counseling and structured meal planning"
        ],
        correct: 1,
        rationale: "A potassium of 2.8 mEq/L is dangerously low and places the patient at immediate risk for fatal cardiac dysrhythmias (torsades de pointes, ventricular fibrillation). The priority is cardiac monitoring and aggressive potassium replacement because cardiac arrest is the most immediate life threat. Bathroom supervision, psychiatric consultation, and nutritional counseling are all important but are secondary to correcting the life-threatening electrolyte imbalance."
      }
    ]
  },

  "dsm5-personality-disorders": {
    title: "DSM-5 Personality Disorders (Cluster A/B/C",
    cellular: {
      title: "Neurodevelopmental Origins of Personality",
      content: "Personality disorders represent enduring patterns of inner experience and behavior that deviate markedly from cultural expectations, are pervasive across contexts, and trace back to adolescence or early adulthood. Neurobiologically, these disorders involve structural and functional abnormalities in circuits governing emotion regulation, impulse control, social cognition, and self-identity. Cluster A (odd/eccentric) disorders involve dopaminergic dysregulation in mesolimbic pathways and social cognition deficits related to reduced theory-of-mind capacity. Cluster B (dramatic/emotional/erratic) disorders show amygdala hyperreactivity, prefrontal cortex hypofunction reducing impulse control, and serotonergic deficiency driving impulsive aggression. Cluster C (anxious/fearful) disorders involve excessive amygdala threat signaling, HPA axis hyperactivity, and GABAergic deficiency producing chronic anxiety and avoidance. Gene-environment interactions are critical - genetic temperament interacts with early attachment disruption, childhood adversity, and invalidating environments to produce the characteristic inflexible personality patterns."
    },
    riskFactors: [
      "Childhood abuse, neglect, or invalidating family environment",
      "Insecure or disorganized attachment with primary caregivers",
      "Genetic predisposition (family history of personality disorders or related psychiatric conditions)",
      "Temperamental extremes in childhood (behavioral inhibition, emotional reactivity, callous-unemotional traits)",
      "Traumatic brain injury affecting frontal lobe development",
      "Substance abuse during critical neurodevelopmental periods",
      "Chronic peer victimization or bullying during childhood and adolescence",
      "Parental psychopathology (personality disorders, substance use, mood disorders)"
    ],
    diagnostics: [
      "Enduring pattern of inner experience and behavior deviating markedly from cultural expectations in 2+ areas: cognition, affectivity, interpersonal functioning, impulse control",
      "Pattern is inflexible and pervasive across a broad range of personal and social situations",
      "Pattern leads to clinically significant distress or functional impairment",
      "Pattern is stable and of long duration traceable to adolescence or early adulthood",
      "Structured Clinical Interview for DSM-5 Personality Disorders (SCID-5-PD) for formal assessment"
    ],
    management: [
      "Dialectical behavior therapy (DBT) as gold standard for borderline personality disorder",
      "Schema-focused therapy addressing early maladaptive schemas across personality disorder types",
      "Mentalization-based therapy (MBT) improving capacity to understand one's own and others' mental states",
      "Pharmacotherapy targeting specific symptoms (mood stabilizers for emotional lability, SSRIs for impulsivity, low-dose antipsychotics for transient psychosis)",
      "Long-term psychotherapy with consistent therapeutic boundaries",
      "Treatment of comorbid conditions (depression, anxiety, substance use disorders)"
    ],
    nursingActions: [
      "Maintain consistent, firm, and predictable boundaries across all interactions and shifts",
      "Communicate behavioral expectations clearly and follow through with consequences uniformly",
      "Avoid personalizing hostile, manipulative, or seductive behavior - maintain therapeutic neutrality",
      "Document all behavioral contracts and communicate them to the entire treatment team to prevent splitting",
      "Identify and manage countertransference reactions (frustration, rescue fantasies, punitive impulses)",
      "Provide validation of emotional experiences while maintaining limits on destructive behavior",
      "Use clear, direct communication - avoid sarcasm, ambiguity, or double messages"
    ],
    signs: {
      left: [
        "Cluster A (Odd/Eccentric): Paranoid (pervasive distrust), Schizoid (social detachment, restricted affect), Schizotypal (eccentric behavior, magical thinking, ideas of reference)",
        "Cluster B (Dramatic/Emotional): Antisocial (disregard for others' rights, deceitfulness), Borderline (unstable relationships, self-image, and affect; impulsivity, self-harm)",
        "Cluster B continued: Histrionic (excessive emotionality, attention-seeking), Narcissistic (grandiosity, need for admiration, lack of empathy)",
        "Cluster C (Anxious/Fearful): Avoidant (social inhibition, feelings of inadequacy, hypersensitivity to criticism)"
      ],
      right: [
        "Cluster C continued: Dependent (excessive need for care, submissive, clinging behavior, fear of separation), Obsessive-Compulsive PD (preoccupation with orderliness, perfectionism, control)",
        "Splitting (Borderline PD) - alternating between idealizing and devaluing staff and caregivers",
        "Pervasive interpersonal dysfunction across relationships, work, and social contexts",
        "Ego-syntonic nature - patients often view their traits as normal parts of their personality rather than symptoms of a disorder"
      ]
    },
    medications: [
      {
        name: "Lamotrigine",
        type: "Mood Stabilizer/Anticonvulsant",
        action: "Stabilizes neuronal membranes by blocking voltage-gated sodium channels and modulating glutamate release, reducing emotional reactivity and impulsive behavior in borderline personality disorder",
        sideEffects: "Stevens-Johnson syndrome (life-threatening rash requiring immediate discontinuation), headache, dizziness, diplopia, nausea",
        contra: "History of hypersensitivity to lamotrigine, requirement for very slow dose titration to prevent Stevens-Johnson syndrome",
        pearl: "Lamotrigine must be titrated extremely slowly (starting 25mg, increasing by 25mg every 2 weeks) to minimize Stevens-Johnson syndrome risk - any new rash requires immediate discontinuation and medical evaluation"
      }
    ],
    pearls: [
      "Remember the clusters using the mnemonic: Cluster A is 'weird' (odd/eccentric), Cluster B is 'wild' (dramatic/emotional/erratic), and Cluster C is 'worried' (anxious/fearful)",
      "Borderline personality disorder is the most commonly tested personality disorder on nursing exams - key features are unstable relationships, fear of abandonment, identity disturbance, impulsivity, chronic emptiness, and self-harm; DBT is the gold-standard treatment",
      "Personality disorders are ego-syntonic (the person sees their behavior as normal) unlike most Axis I disorders which are ego-dystonic (the person recognizes something is wrong) - this makes engagement in treatment extremely challenging"
    ],
    quiz: [
      {
        question: "A patient with borderline personality disorder tells the day nurse 'you are the best nurse I have ever had' and tells the night nurse 'you are the worst nurse on this unit and I will report you.' This behavior is known as:",
        options: [
          "Projection - attributing one's own feelings to others",
          "Splitting - alternating between idealization and devaluation of others",
          "Reaction formation - expressing the opposite of true feelings",
          "Displacement - redirecting emotions from the real source to a substitute target"
        ],
        correct: 1,
        rationale: "Splitting is a primitive defense mechanism characteristic of borderline personality disorder in which the patient perceives people as all good or all bad, alternating between idealization (the day nurse is perfect) and devaluation (the night nurse is terrible). This reflects the inability to integrate positive and negative qualities of others into a unified, nuanced view. The clinical strategy is team communication and consistency to prevent staff conflict and maintain unified treatment boundaries."
      }
    ]
  },

  "postmortem-care": {
    title: "Postmortem Care",
    cellular: {
      title: "Physiological Changes After Death",
      content: "Following circulatory cessation, cellular death progresses in a predictable sequence driven by adenosine triphosphate (ATP) depletion. Without oxygen delivery, mitochondrial oxidative phosphorylation stops, and cells shift to anaerobic glycolysis until glycogen stores are exhausted. Intracellular pH drops as lactic acid accumulates, causing lysosomal membrane rupture and release of hydrolytic enzymes that begin autolysis (cellular self-digestion). Rigor mortis develops 2-4 hours after death as actin-myosin cross-bridges become fixed in the contracted position due to ATP depletion - ATP is required to release the myosin head from actin, so without it, muscles become rigid. Rigor mortis begins in smaller muscles (jaw, eyelids) and progresses to larger muscle groups. Livor mortis (dependent lividity) occurs as blood pools in dependent tissues by gravity, producing non-blanchable reddish-purple discoloration. Algor mortis refers to the gradual cooling of the body toward ambient temperature at approximately 1.5 degrees F per hour."
    },
    riskFactors: [
      "Not applicable in the traditional sense - postmortem care applies to all deceased patients",
      "Consideration of religious and cultural practices affecting care timing",
      "Infectious disease precautions (hepatitis B/C, HIV, tuberculosis, COVID-19)",
      "Pending autopsy or forensic investigation requiring evidence preservation",
      "Organ or tissue donation status affecting care procedures",
      "Family availability and emotional readiness for viewing",
      "Legal documentation requirements varying by jurisdiction"
    ],
    diagnostics: [
      "Verification of death by a licensed provider: absence of pulse, respirations, blood pressure, and reflexes",
      "Documentation of time of death, persons present, and any resuscitation efforts",
      "Assessment for organ donation eligibility and notification of organ procurement organization",
      "Determination of whether autopsy is required (coroner/medical examiner cases: unexpected death, trauma, suspected foul play)",
      "Identification of religious or cultural practices requiring specific timing or procedures"
    ],
    management: [
      "Notify the attending physician or provider to pronounce death and certify cause of death",
      "Contact organ procurement organization per hospital policy before discontinuing any support in potential donors",
      "Notify the family and provide private time for grieving",
      "Contact the chaplain or spiritual care provider based on family preferences",
      "Complete death certificate documentation and notify appropriate agencies (funeral home, coroner if required)",
      "Arrange for transport to morgue or funeral home per facility protocol"
    ],
    nursingActions: [
      "Position the body supine with arms at sides or folded across the abdomen before rigor mortis sets in (within 2-4 hours of death)",
      "Close the eyes by gently pressing eyelids down and placing moist gauze if they will not remain closed",
      "Place a rolled towel under the chin to keep the mouth closed until rigor mortis stabilizes the jaw",
      "Remove all tubes, lines, and drains UNLESS an autopsy is pending (leave all devices in place for forensic cases)",
      "Cleanse the body, apply clean linens, and prepare for family viewing - focus on maintaining dignity and a peaceful appearance",
      "Apply identification tags per hospital policy - one on the body (wrist or ankle) and one on the outside of the body bag or shroud",
      "Document all postmortem care provided, personal belongings inventory, and to whom belongings were released"
    ],
    signs: {
      left: [
        "Absence of pulse, respirations, and blood pressure",
        "Fixed, dilated pupils unresponsive to light",
        "Absence of brainstem reflexes (corneal, gag, oculocephalic)",
        "Rigor mortis beginning in small muscles 2-4 hours after death"
      ],
      right: [
        "Algor mortis - gradual body cooling toward ambient temperature",
        "Livor mortis - dependent lividity (non-blanchable reddish-purple discoloration in dependent areas)",
        "Loss of skin turgor and pallor as blood circulation ceases",
        "Relaxation of sphincters may cause incontinence of urine and stool"
      ]
    },
    medications: [
      {
        name: "No medications applicable",
        type: "Not applicable",
        action: "Postmortem care does not involve medication administration; however, all previously administered medications should be documented in the death note",
        sideEffects: "Not applicable",
        contra: "Not applicable",
        pearl: "Document the last medications administered before death, including any narcotics that must be wasted per controlled substance protocol with a witness"
      }
    ],
    pearls: [
      "If an autopsy or forensic investigation is pending, do NOT remove any tubes, IVs, catheters, endotracheal tubes, or drains - leave everything in place as they are considered evidence; removing them could compromise the investigation",
      "Contact the organ procurement organization BEFORE discontinuing life-sustaining measures in potential donors - timing is critical for organ viability, and the nurse should never assume a patient is not eligible for donation",
      "Allow family members as much private time with the body as they need - cultural and religious practices vary widely (some require immediate care, others prohibit touching the body) and the nurse should ask the family about their preferences and accommodate them"
    ],
    quiz: [
      {
        question: "A patient is pronounced dead and the family requests to view the body. The nurse suspects the case may require a coroner's investigation. What is the priority nursing action?",
        options: [
          "Prepare the body by removing all tubes and IV lines to present a peaceful appearance",
          "Leave all tubes, lines, and devices in place and notify the coroner before allowing family viewing",
          "Allow the family to view the body while removing equipment to maintain dignity",
          "Wait for the funeral home to arrive before allowing any family visitation"
        ],
        correct: 1,
        rationale: "When a coroner's investigation is possible (unexpected death, trauma, suspicious circumstances), all tubes, lines, IV access, endotracheal tubes, and medical devices must remain in place as they constitute forensic evidence. The coroner must be notified to determine if an autopsy is required. Family viewing can proceed with the devices in place - the nurse should explain why equipment cannot be removed. Removing devices could compromise the forensic investigation."
      }
    ]
  },

  "serotonin-syndrome": {
    title: "Serotonin Syndrome",
    cellular: {
      title: "Serotonergic Excess",
      content: "Serotonin syndrome results from excessive serotonergic agonism at both central and peripheral serotonin receptors (primarily 5-HT1A and 5-HT2A) due to drug interactions or overdose. Excessive postsynaptic 5-HT1A receptor stimulation in the brainstem produces altered mental status and autonomic instability, while 5-HT2A receptor overstimulation in the spinal cord and peripheral nervous system drives neuromuscular hyperexcitability manifesting as clonus, hyperreflexia, and muscle rigidity. Autonomic dysfunction occurs because serotonin modulates the hypothalamic thermoregulatory center, sympathetic nervous system, and gastrointestinal tract - excess serotonin causes hyperthermia, tachycardia, diaphoresis, and diarrhea. The most common drug combination causing serotonin syndrome is concurrent use of an SSRI with a monoamine oxidase inhibitor (MAOI), which prevents serotonin breakdown while simultaneously blocking reuptake. Other precipitants include adding tramadol, linezolid (which has MAOI activity), triptans, or dextromethorphan to an existing serotonergic medication."
    },
    riskFactors: [
      "Concurrent use of two or more serotonergic medications (most common cause)",
      "SSRI combined with MAOI (most dangerous combination - requires 14-day washout between medications)",
      "Addition of tramadol or meperidine to SSRI therapy",
      "Linezolid (antibiotic with MAOI activity) added to an SSRI",
      "SSRI combined with triptans for migraine treatment",
      "Illicit drug use: MDMA (ecstasy) or LSD with serotonergic medications",
      "High-dose SSRI therapy or recent dose escalation",
      "Over-the-counter dextromethorphan combined with serotonergic medications"
    ],
    diagnostics: [
      "Hunter Serotonin Toxicity Criteria: requires a serotonergic agent PLUS clonus (spontaneous or inducible), agitation, diaphoresis, tremor, hyperreflexia",
      "Clinical triad: altered mental status, autonomic instability, neuromuscular hyperactivity",
      "Rapid onset (typically within 24 hours of medication change or drug interaction)",
      "Elevated creatine kinase (CK) from muscle hyperactivity and rigidity",
      "Differentiation from neuroleptic malignant syndrome: serotonin syndrome has rapid onset (hours), clonus, hyperreflexia, and mydriasis vs. NMS which has gradual onset (days), lead-pipe rigidity, and bradyreflexia"
    ],
    management: [
      "Discontinue ALL serotonergic agents immediately - this is the most critical intervention",
      "Cyproheptadine (serotonin antagonist) as the specific antidote for moderate-to-severe cases",
      "Aggressive cooling measures for hyperthermia (cooling blankets, ice packs, evaporative cooling)",
      "Benzodiazepines (lorazepam) for agitation, seizures, and muscle rigidity",
      "IV fluid resuscitation to prevent myoglobin-induced renal failure from rhabdomyolysis",
      "Avoid antipyretics (acetaminophen) - hyperthermia is caused by muscle hyperactivity, not prostaglandin-mediated fever"
    ],
    nursingActions: [
      "Assess for the clinical triad: altered mental status (agitation, confusion), autonomic instability (hyperthermia, tachycardia, diaphoresis), and neuromuscular excitability (clonus, hyperreflexia, tremor)",
      "Obtain a complete medication reconciliation including over-the-counter drugs, supplements (St. John's Wort), and illicit substances",
      "Implement continuous cardiac and temperature monitoring - hyperthermia above 41C (106F) is life-threatening",
      "Administer cyproheptadine as ordered (only available in oral form - crush and give via NG tube if patient cannot swallow)",
      "Monitor for rhabdomyolysis: dark urine, elevated CK, acute kidney injury from myoglobin deposition",
      "Apply external cooling measures and discontinue if shivering occurs (shivering generates more heat)",
      "Differentiate from NMS: serotonin syndrome has RAPID onset (hours), CLONUS and HYPERREFLEXIA, and responds to serotonin antagonists; NMS has GRADUAL onset (days), LEAD-PIPE RIGIDITY, and is treated with dantrolene"
    ],
    signs: {
      left: [
        "Agitation, restlessness, and confusion (altered mental status from 5-HT1A overstimulation)",
        "Hyperthermia - often exceeding 40C (104F) from uncontrolled muscle hyperactivity",
        "Tachycardia, hypertension, and profuse diaphoresis (autonomic instability)",
        "Mydriasis (dilated pupils) from serotonergic activation of the iris dilator muscle"
      ],
      right: [
        "Clonus (rhythmic, involuntary muscle contractions, especially in lower extremities) - the hallmark neuromuscular finding",
        "Hyperreflexia and muscle rigidity (greater in lower extremities than upper)",
        "Tremor and myoclonus (involuntary muscle jerking)",
        "Diarrhea, nausea, and abdominal cramping from serotonin stimulation of GI 5-HT3/5-HT4 receptors"
      ]
    },
    medications: [
      {
        name: "Cyproheptadine (Periactin)",
        type: "Serotonin Antagonist / Antihistamine",
        action: "Non-selective 5-HT1A and 5-HT2A receptor antagonist that directly blocks excess serotonin binding at postsynaptic receptors, reversing the neuromuscular excitability, autonomic instability, and altered mental status",
        sideEffects: "Sedation, dry mouth, increased appetite, weight gain, urinary retention",
        contra: "Narrow-angle glaucoma, concurrent MAOI use, urinary retention, neonates",
        pearl: "Cyproheptadine is ONLY available as an oral formulation - for patients who cannot swallow, crush the tablet and administer via nasogastric tube; there is no IV form"
      }
    ],
    pearls: [
      "The key differentiator between serotonin syndrome and neuroleptic malignant syndrome (NMS): serotonin syndrome has RAPID onset (hours), CLONUS and HYPERREFLEXIA, and MYDRIASIS; NMS has GRADUAL onset (days-weeks), LEAD-PIPE RIGIDITY, BRADYREFLEXIA, and is associated with antipsychotics, not serotonergic drugs",
      "The most commonly tested drug interactions causing serotonin syndrome on nursing exams: SSRI + MAOI (most dangerous), SSRI + tramadol, SSRI + linezolid, SSRI + St. John's Wort, SSRI + dextromethorphan",
      "Antipyretics (acetaminophen, NSAIDs) are ineffective for serotonin syndrome hyperthermia because the fever is generated by excessive skeletal muscle contraction, not by prostaglandin-mediated hypothalamic set-point elevation - cooling measures and muscle relaxation (benzodiazepines) are needed"
    ],
    quiz: [
      {
        question: "A patient on sertraline is prescribed linezolid for a wound infection. Within 6 hours, the patient develops agitation, temperature of 40.2C (104.4F), clonus in both legs, and profuse sweating. The nurse suspects serotonin syndrome. What is the priority action?",
        options: [
          "Administer acetaminophen for the fever and continue monitoring",
          "Discontinue both sertraline and linezolid immediately and notify the provider",
          "Administer dantrolene for the muscle rigidity",
          "Obtain blood cultures to rule out sepsis before discontinuing antibiotics"
        ],
        correct: 1,
        rationale: "This presentation (rapid onset after adding linezolid to an SSRI, agitation, hyperthermia, clonus, diaphoresis) is classic serotonin syndrome. Linezolid has MAOI activity and combined with sertraline creates serotonergic excess. The priority is to discontinue ALL serotonergic agents immediately. Acetaminophen is ineffective for this type of hyperthermia. Dantrolene is for NMS, not serotonin syndrome. Delaying treatment to obtain blood cultures is inappropriate when the clinical picture clearly points to serotonin syndrome."
      }
    ]
  },

  "tardive-dyskinesia": {
    title: "Tardive Dyskinesia",
    cellular: {
      title: "D2 Receptor Supersensitivity from Chronic",
      content: "Tardive dyskinesia (TD) results from chronic blockade of D2 dopamine receptors by antipsychotic medications, leading to compensatory postsynaptic D2 receptor upregulation and supersensitivity. When dopamine receptors proliferate and become hypersensitive in the nigrostriatal pathway (which normally controls fine motor movements), they overrespond to normal dopamine levels, producing involuntary hyperkinetic movements. This is analogous to denervation supersensitivity - just as a denervated muscle becomes hyper-responsive to acetylcholine, chronically blocked dopamine receptors become hyper-responsive to dopamine. The basal ganglia, particularly the caudate nucleus and putamen, lose the ability to properly modulate motor output through the direct and indirect pathways, resulting in involuntary choreiform and athetoid movements. First-generation (typical) antipsychotics have higher TD risk because of their stronger D2 binding affinity. The condition may become irreversible even after discontinuation of the causative agent because the receptor changes can become permanent."
    },
    riskFactors: [
      "Prolonged use of first-generation (typical) antipsychotics (haloperidol, chlorpromazine)",
      "Higher cumulative antipsychotic dose and longer duration of treatment",
      "Older age - elderly patients are more susceptible to nigrostriatal dopamine receptor changes",
      "Female sex - higher incidence, especially postmenopausal women",
      "Comorbid mood disorders (depression, bipolar disorder) treated with antipsychotics",
      "Pre-existing extrapyramidal symptoms or movement disorders",
      "African American descent (higher incidence possibly related to pharmacogenomic differences in D2 receptor density)",
      "Concurrent anticholinergic medication use masking early TD symptoms"
    ],
    diagnostics: [
      "Abnormal Involuntary Movement Scale (AIMS) assessment performed every 6 months for patients on antipsychotics - scores movements in face, lips, tongue, jaw, extremities, and trunk",
      "Characteristic involuntary movements: lip smacking, tongue protrusion, facial grimacing, choreiform movements of extremities",
      "Onset after at least 3 months of antipsychotic use (or 1 month in patients over 60)",
      "Exclusion of other movement disorders (Huntington disease, Wilson disease, Sydenham chorea)",
      "Medication history review documenting total antipsychotic exposure duration and dosing"
    ],
    management: [
      "Switch from first-generation to second-generation antipsychotic (if continued antipsychotic treatment is needed) as atypicals have lower D2 binding affinity",
      "Valbenazine or deutetrabenazine (VMAT2 inhibitors) - FDA-approved treatments specifically for tardive dyskinesia",
      "Gradual dose reduction of the causative antipsychotic if clinically feasible (avoid abrupt discontinuation which can worsen TD)",
      "Consider clozapine which has the lowest risk of TD among antipsychotics",
      "Discontinue anticholinergic medications that may mask TD symptoms"
    ],
    nursingActions: [
      "Perform AIMS assessment every 6 months for all patients on antipsychotic medications - document baseline before starting therapy",
      "Educate patients and families to report any new involuntary movements, especially of the face, lips, or tongue",
      "Assess for functional impact: TD affecting eating, swallowing, speaking, or breathing requires urgent intervention",
      "Monitor for withdrawal dyskinesia when antipsychotics are tapered - movements may temporarily worsen before improving",
      "Advocate for the lowest effective antipsychotic dose to minimize cumulative D2 blockade",
      "Assess psychosocial impact - facial movements can cause stigma, social withdrawal, and reduced quality of life"
    ],
    signs: {
      left: [
        "Involuntary repetitive movements of the tongue - protrusion, rolling, worm-like movements (vermicular movements)",
        "Lip smacking, puckering, and pursing movements",
        "Facial grimacing and jaw movements (lateral jaw movements, clenching)",
        "Rapid eye blinking and blepharospasm"
      ],
      right: [
        "Choreiform (dance-like, irregular) movements of the fingers, hands, and arms",
        "Truncal rocking and pelvic thrusting movements",
        "Foot tapping and lower extremity restlessness",
        "Respiratory dyskinesia - irregular breathing patterns from involuntary diaphragmatic movement (rare but serious)"
      ]
    },
    medications: [
      {
        name: "Valbenazine (Ingrezza)",
        type: "Vesicular Monoamine Transporter 2 (VMAT2) Inhibitor",
        action: "Inhibits VMAT2, reducing dopamine packaging into synaptic vesicles and thereby decreasing dopamine release in the nigrostriatal pathway, which reduces the excessive dopaminergic stimulation of supersensitized D2 receptors causing involuntary movements",
        sideEffects: "Somnolence, QT prolongation, akathisia, depression, suicidal ideation, parkinsonism from excessive dopamine depletion",
        contra: "Concurrent MAOI use, concurrent tetrabenazine or deutetrabenazine use, hepatic impairment (CYP3A4-mediated metabolism), prolonged QT interval",
        pearl: "Valbenazine is the first FDA-approved medication specifically for tardive dyskinesia - it reduces dopamine release without blocking receptors, addressing the root cause of TD rather than adding more D2 blockade"
      }
    ],
    pearls: [
      "Tardive dyskinesia may be IRREVERSIBLE even after stopping the causative antipsychotic - this is why prevention through lowest effective dose and regular AIMS monitoring is critical; early detection improves the chance of reversibility",
      "Do NOT increase the antipsychotic dose to suppress TD movements - while higher doses may temporarily mask TD by increasing D2 blockade, they worsen the underlying receptor supersensitivity and guarantee worse TD when the medication is eventually reduced",
      "The AIMS examination must be performed at baseline before starting antipsychotics, then every 6 months during treatment - it systematically scores involuntary movements in 7 body regions (face, lips, jaw, tongue, upper extremities, lower extremities, trunk) on a 0-4 severity scale"
    ],
    quiz: [
      {
        question: "A patient who has taken haloperidol for 2 years develops involuntary lip smacking and tongue protrusion. The nurse performs an AIMS assessment. Which intervention should the nurse anticipate?",
        options: [
          "Increasing the haloperidol dose to suppress the involuntary movements",
          "Adding benztropine to treat the extrapyramidal symptoms",
          "Switching to a second-generation antipsychotic and considering valbenazine for TD",
          "Administering diphenhydramine PRN for the movement disorder"
        ],
        correct: 2,
        rationale: "Involuntary lip smacking and tongue protrusion after prolonged antipsychotic use are hallmarks of tardive dyskinesia, caused by D2 receptor supersensitivity. The appropriate interventions are switching to a second-generation antipsychotic with lower D2 affinity (reducing further receptor damage) and considering a VMAT2 inhibitor like valbenazine (FDA-approved for TD). Increasing the dose would worsen the underlying pathology. Anticholinergics (benztropine, diphenhydramine) treat acute EPS, not tardive dyskinesia - they may actually worsen TD."
      }
    ]
  }
};
