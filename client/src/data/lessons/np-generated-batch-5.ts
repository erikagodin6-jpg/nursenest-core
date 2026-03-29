import type { LessonContent } from "./types";

export const npGeneratedBatch5: Record<string, LessonContent> = {
  "parkinson-meds-np": {
    title: "Parkinson Medications",
    cellular: {
      title: "Pathophysiology of Parkinson Medications",
      content: "Parkinson disease results from progressive loss of dopaminergic neurons in substantia nigra pars compacta with alpha-synuclein Lewy body accumulation. Loss of >60-80% of neurons produces motor features. Levodopa crosses BBB via large neutral amino acid transporter, converted to dopamine. Carbidopa blocks peripheral conversion. Motor complications develop in 40-50% after 5 years."
    },
    riskFactors: [
      "Age >65 with progressive neurodegenerative risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Prior head trauma or TBI history",
      "Hypertension (leading modifiable risk for stroke)",
      "Diabetes with peripheral and autonomic neuropathy",
      "Family history of neurological disease (first-degree relative)"
    ],
    diagnostics: [
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)"
    ],
    management: [
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Seizure precautions and driving restriction counseling",
      "Blood pressure management per AHA stroke guidelines",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Parkinson Medications requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with parkinson medications. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for parkinson medications."
      }
    ]
  },
  "neuropathic-pain-meds-np": {
    title: "Neuropathic Pain Medications",
    cellular: {
      title: "Pathophysiology of Neuropathic Pain Medications",
      content: "Neuropathic Pain Medications involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Neuropathic Pain Medications pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Diabetes with peripheral and autonomic neuropathy",
      "Age >65 with progressive neurodegenerative risk",
      "Hypertension (leading modifiable risk for stroke)",
      "Sleep deprivation or circadian rhythm disruption",
      "Tobacco use with cerebrovascular disease risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Atrial fibrillation with cardioembolic stroke risk"
    ],
    diagnostics: [
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Carotid duplex ultrasound for extracranial stenosis",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Glasgow Coma Scale (GCS) for consciousness level assessment"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Neuropathic Pain Medications requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with neuropathic pain medications. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for neuropathic pain medications."
      }
    ]
  },
  "cerebral-venous-sinus-thrombosis-np-np": {
    title: "Cerebral Venous Sinus Thrombosis",
    cellular: {
      title: "Pathophysiology of Cerebral Venous Sinus Thrombosis",
      content: "Cerebral Venous Sinus Thrombosis involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Cerebral Venous Sinus Thrombosis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Atrial fibrillation with cardioembolic stroke risk",
      "Family history of neurological disease (first-degree relative)",
      "Prior head trauma or TBI history",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Sleep deprivation or circadian rhythm disruption",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)"
    ],
    diagnostics: [
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Carotid duplex ultrasound for extracranial stenosis",
      "Visual field testing and fundoscopic exam for papilledema",
      "MRA or CTA for intracranial vascular evaluation"
    ],
    management: [
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Blood pressure management per AHA stroke guidelines",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "DVT prophylaxis with SCDs and pharmacologic when safe"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Cerebral Venous Sinus Thrombosis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with cerebral venous sinus thrombosis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for cerebral venous sinus thrombosis."
      }
    ]
  },
  "adaptive-immunity-molecular-mechanisms-and-clinical-np": {
    title: "Adaptive Immunity: Molecular Mechanisms",
    cellular: {
      title: "Pathophysiology of Adaptive Immunity",
      content: "Adaptive Immunity: Molecular Mechanisms involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in adaptive immunity."
    },
    riskFactors: [
      "Environmental allergen sensitization",
      "Immunosuppressive therapy increasing infection susceptibility",
      "Genetic variants in HLA, complement, or immune pathways",
      "Occupational chemical/biological exposure",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Stress and sleep deprivation impairing immune function",
      "Family history of autoimmune disease or immunodeficiency"
    ],
    diagnostics: [
      "Tryptase level (elevated in mast cell activation, anaphylaxis)",
      "Specific IgE testing or skin prick testing for allergen identification",
      "Lymphocyte proliferation assays for cellular immunity",
      "Vaccine response titers to assess humoral immune function",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Genetic testing for primary immunodeficiency disorders",
      "Complete blood count with differential (lymphocyte subsets)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to adaptive immunity",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Adaptive Immunity requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with adaptive immunity with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "ischemic-and-hemorrhagic-stroke-np": {
    title: "Ischemic and Hemorrhagic Stroke",
    cellular: {
      title: "Pathophysiology of Ischemic and Hemorrhagic Stroke",
      content: "Ischemic stroke results from cerebral artery occlusion (thrombotic or embolic) causing neuronal death from ATP depletion. The ischemic penumbra (tissue at risk surrounding the core infarct) is salvageable with reperfusion. IV alteplase within 4.5 hours (NINDS, ECASS III) or mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN, DEFUSE 3). NIHSS quantifies severity. Door-to-needle time target <60 minutes."
    },
    riskFactors: [
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Tobacco use with cerebrovascular disease risk",
      "Atrial fibrillation with cardioembolic stroke risk",
      "Prior CNS infection (increased seizure risk)",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Hypertension (leading modifiable risk for stroke)",
      "Obesity and metabolic syndrome with neuroinflammation"
    ],
    diagnostics: [
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "Genetic testing when hereditary neurological condition suspected",
      "Visual field testing and fundoscopic exam for papilledema",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Neuropsychological testing for cognitive domain assessment"
    ],
    management: [
      "Seizure precautions and driving restriction counseling",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Palliative care and goals of care discussion for progressive diseases",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Ischemic and Hemorrhagic Stroke requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with ischemic and hemorrhagic stroke. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for ischemic and hemorrhagic stroke."
      }
    ]
  },
  "precocious-puberty-molecular-mechanisms-and-gnrh-np": {
    title: "Precocious Puberty: Molecular Mechanisms",
    cellular: {
      title: "Pathophysiology of Precocious Puberty",
      content: "Precocious Puberty: Molecular Mechanisms involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting precocious puberty physiology."
    },
    riskFactors: [
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Age-related hormonal decline (menopause, andropause)",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "MEN syndrome family history"
    ],
    diagnostics: [
      "Prolactin level for pituitary evaluation",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "24-hour urine free cortisol for Cushing confirmation"
    ],
    management: [
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Diabetes self-management education and support (DSMES)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Precocious Puberty management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected precocious puberty. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for precocious puberty",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for precocious puberty while being cost-effective."
      }
    ]
  },
  "separation-anxiety-disorder-np-advanced-psychopharmacology-np": {
    title: "Separation Anxiety Disorder",
    cellular: {
      title: "Pharmacology of Separation Anxiety Disorder",
      content: "Separation Anxiety Disorder encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to separation anxiety disorder."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Separation Anxiety Disorder management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to separation anxiety disorder. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "vaginitis-vaginal-microbiome-and-resistance-mechanisms-np": {
    title: "Vaginitis: Vaginal Microbiome",
    cellular: {
      title: "Pathophysiology of Vaginitis",
      content: "Vaginitis: Vaginal Microbiome involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to vaginitis."
    },
    riskFactors: [
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Crowded living conditions (TB, meningococcal disease)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "IV drug use with bacteremia risk",
      "Splenectomy with encapsulated organism susceptibility"
    ],
    diagnostics: [
      "Procalcitonin for bacterial infection likelihood",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CT with contrast for abscess, collection, or source identification",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)"
    ],
    management: [
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Immunization update for preventable infections",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Repeat cultures at 48-72h to document clearance"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Vaginitis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected vaginitis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "hematopoiesis-np": {
    title: "Hematopoiesis",
    cellular: {
      title: "Pathophysiology of Hematopoiesis",
      content: "Hematopoiesis involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to hematopoiesis."
    },
    riskFactors: [
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Malignancy with bone marrow infiltration or DIC",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)"
    ],
    diagnostics: [
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation"
    ],
    management: [
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Hematopoiesis management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with hematopoiesis presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of hematopoiesis."
      }
    ]
  },
  "coagulation-cascade-np": {
    title: "Coagulation Cascade",
    cellular: {
      title: "Pathophysiology of Coagulation Cascade",
      content: "Coagulation Cascade involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to coagulation cascade."
    },
    riskFactors: [
      "Chemotherapy-induced myelosuppression",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Chronic kidney disease with decreased erythropoietin",
      "Malignancy with bone marrow infiltration or DIC",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Chronic disease states causing anemia of inflammation"
    ],
    diagnostics: [
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "CBC with differential and peripheral blood smear review",
      "Reticulocyte count (production index) for bone marrow response"
    ],
    management: [
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Folate supplementation: 1mg PO daily",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Coagulation Cascade management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with coagulation cascade presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of coagulation cascade."
      }
    ]
  },
  "iron-metabolism-np": {
    title: "Iron Metabolism",
    cellular: {
      title: "Pathophysiology of Iron Metabolism",
      content: "Iron Metabolism involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to iron metabolism."
    },
    riskFactors: [
      "Chronic kidney disease with decreased erythropoietin",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic disease states causing anemia of inflammation",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Splenomegaly with hypersplenism"
    ],
    diagnostics: [
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "CBC with differential and peripheral blood smear review",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Reticulocyte count (production index) for bone marrow response",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Hemoglobin electrophoresis for hemoglobinopathy screening"
    ],
    management: [
      "Folate supplementation: 1mg PO daily",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Iron Metabolism management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with iron metabolism presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of iron metabolism."
      }
    ]
  },
  "cbc-interpretation-np": {
    title: "CBC Interpretation",
    cellular: {
      title: "Pathophysiology of CBC Interpretation",
      content: "CBC Interpretation involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to cbc interpretation."
    },
    riskFactors: [
      "Chemotherapy-induced myelosuppression",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Chronic kidney disease with decreased erythropoietin",
      "Malignancy with bone marrow infiltration or DIC",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Chronic disease states causing anemia of inflammation"
    ],
    diagnostics: [
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "CBC with differential and peripheral blood smear review",
      "Reticulocyte count (production index) for bone marrow response"
    ],
    management: [
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Folate supplementation: 1mg PO daily",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "CBC Interpretation management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with cbc interpretation presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of cbc interpretation."
      }
    ]
  },
  "iron-studies-np": {
    title: "Iron Studies",
    cellular: {
      title: "Pathophysiology of Iron Studies",
      content: "Iron Studies involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to iron studies."
    },
    riskFactors: [
      "Liver disease with coagulopathy and thrombocytopenia",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Splenomegaly with hypersplenism",
      "Malignancy with bone marrow infiltration or DIC",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Chronic kidney disease with decreased erythropoietin"
    ],
    diagnostics: [
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "B12 and folate levels (methylmalonic acid if B12 borderline)"
    ],
    management: [
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Folate supplementation: 1mg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Iron Studies management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with iron studies presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of iron studies."
      }
    ]
  },
  "pt-inr-aptt-np": {
    title: "PT/INR/aPTT Interpretation",
    cellular: {
      title: "Pathophysiology of PT/INR/aPTT Interpretation",
      content: "PT/INR/aPTT Interpretation involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to pt/inr/aptt interpretation."
    },
    riskFactors: [
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic kidney disease with decreased erythropoietin",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Antiphospholipid syndrome with thrombotic risk",
      "Iron deficiency (most common cause of anemia worldwide)"
    ],
    diagnostics: [
      "Fibrinogen level for DIC or consumption coagulopathy",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "CBC with differential and peripheral blood smear review"
    ],
    management: [
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Folate supplementation: 1mg PO daily",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "PT/INR/aPTT Interpretation management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with pt/inr/aptt interpretation presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of pt/inr/aptt interpretation."
      }
    ]
  },
  "d-dimer-logic-np": {
    title: "D-Dimer Logic",
    cellular: {
      title: "Pathophysiology of D-Dimer Logic",
      content: "D-Dimer Logic involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to d-dimer logic."
    },
    riskFactors: [
      "Malignancy with bone marrow infiltration or DIC",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Antiphospholipid syndrome with thrombotic risk"
    ],
    diagnostics: [
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Flow cytometry for leukemia/lymphoma immunophenotyping"
    ],
    management: [
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Hematology referral for unexplained cytopenias or suspected malignancy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "D-Dimer Logic management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with d-dimer logic presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of d-dimer logic."
      }
    ]
  },
  "b12-deficiency-np": {
    title: "B12 Deficiency",
    cellular: {
      title: "Pathophysiology of B12 Deficiency",
      content: "B12 Deficiency involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to b12 deficiency."
    },
    riskFactors: [
      "Chronic disease states causing anemia of inflammation",
      "Recent surgery or trauma with blood loss",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chemotherapy-induced myelosuppression",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)"
    ],
    diagnostics: [
      "Reticulocyte count (production index) for bone marrow response",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia"
    ],
    management: [
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "B12 Deficiency management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with b12 deficiency presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of b12 deficiency."
      }
    ]
  },
  "anemia-chronic-disease-np": {
    title: "Anemia of Chronic Disease",
    cellular: {
      title: "Pathophysiology of Anemia of Chronic Disease",
      content: "Anemia of Chronic Disease involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to anemia of chronic disease."
    },
    riskFactors: [
      "Chronic kidney disease with decreased erythropoietin",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic disease states causing anemia of inflammation",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Splenomegaly with hypersplenism"
    ],
    diagnostics: [
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "CBC with differential and peripheral blood smear review",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Reticulocyte count (production index) for bone marrow response",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Hemoglobin electrophoresis for hemoglobinopathy screening"
    ],
    management: [
      "Folate supplementation: 1mg PO daily",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Anemia of Chronic Disease management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with anemia of chronic disease presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of anemia of chronic disease."
      }
    ]
  },
  "sickle-cell-np": {
    title: "Sickle Cell Disease",
    cellular: {
      title: "Pathophysiology of Sickle Cell Disease",
      content: "Sickle cell disease results from HbS (glutamic acid to valine at position 6 of beta-globin). Deoxygenated HbS polymerizes causing RBC sickling, hemolytic anemia, and vaso-occlusion. Complications: acute chest syndrome, stroke, splenic sequestration, avascular necrosis. Hydroxyurea increases HbF reducing sickling. Voxelotor inhibits HbS polymerization. L-glutamine reduces oxidative stress."
    },
    riskFactors: [
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Chronic disease states causing anemia of inflammation",
      "Malignancy with bone marrow infiltration or DIC",
      "Iron deficiency (most common cause of anemia worldwide)",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Recent surgery or trauma with blood loss"
    ],
    diagnostics: [
      "PT/INR and aPTT for coagulation pathway assessment",
      "Reticulocyte count (production index) for bone marrow response",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "CBC with differential and peripheral blood smear review",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy"
    ],
    management: [
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "FFP or PCC for urgent warfarin reversal with active bleeding"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Sickle Cell Disease management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with sickle cell disease presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of sickle cell disease."
      }
    ]
  },
  "thrombocytopenia-np": {
    title: "Thrombocytopenia",
    cellular: {
      title: "Pathophysiology of Thrombocytopenia",
      content: "Immune thrombocytopenia (ITP) involves autoantibody-mediated platelet destruction (anti-GPIIb/IIIa) and impaired megakaryopoiesis. Diagnosis of exclusion: isolated thrombocytopenia without other causes. Treatment: observation if platelets >30K and asymptomatic. First-line: corticosteroids (dexamethasone 40mg x4 days or prednisone 1mg/kg). IVIG for rapid count increase. Second-line: TPO-RA (eltrombopag, romiplostim), rituximab, splenectomy."
    },
    riskFactors: [
      "Malignancy with bone marrow infiltration or DIC",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Antiphospholipid syndrome with thrombotic risk"
    ],
    diagnostics: [
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Flow cytometry for leukemia/lymphoma immunophenotyping"
    ],
    management: [
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Hematology referral for unexplained cytopenias or suspected malignancy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Thrombocytopenia management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with thrombocytopenia presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of thrombocytopenia."
      }
    ]
  },
  "coagulopathies-basics-np": {
    title: "Coagulopathies Basics",
    cellular: {
      title: "Pathophysiology of Coagulopathies Basics",
      content: "Coagulopathies Basics involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to coagulopathies basics."
    },
    riskFactors: [
      "Chronic disease states causing anemia of inflammation",
      "Recent surgery or trauma with blood loss",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chemotherapy-induced myelosuppression",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)"
    ],
    diagnostics: [
      "Reticulocyte count (production index) for bone marrow response",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia"
    ],
    management: [
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Coagulopathies Basics management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with coagulopathies basics presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of coagulopathies basics."
      }
    ]
  },
  "obstetric-hemorrhage-massive-transfusion-np": {
    title: "Obstetric Hemorrhage: Massive Transfusion",
    cellular: {
      title: "Pathophysiology of Obstetric Hemorrhage",
      content: "Obstetric Hemorrhage: Massive Transfusion involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to obstetric hemorrhage."
    },
    riskFactors: [
      "Splenomegaly with hypersplenism",
      "Chemotherapy-induced myelosuppression",
      "Recent surgery or trauma with blood loss",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Chronic kidney disease with decreased erythropoietin",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk"
    ],
    diagnostics: [
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "PT/INR and aPTT for coagulation pathway assessment"
    ],
    management: [
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Folate supplementation: 1mg PO daily",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Obstetric Hemorrhage management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with obstetric hemorrhage presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of obstetric hemorrhage."
      }
    ]
  },
  "transfusion-reactions-hemolytic-vs-febrile-np": {
    title: "Transfusion Reactions: Hemolytic vs Febrile",
    cellular: {
      title: "Pathophysiology of Transfusion Reactions",
      content: "Transfusion Reactions: Hemolytic vs Febrile involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to transfusion reactions."
    },
    riskFactors: [
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Chronic disease states causing anemia of inflammation",
      "Malignancy with bone marrow infiltration or DIC",
      "Iron deficiency (most common cause of anemia worldwide)",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Recent surgery or trauma with blood loss"
    ],
    diagnostics: [
      "PT/INR and aPTT for coagulation pathway assessment",
      "Reticulocyte count (production index) for bone marrow response",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "CBC with differential and peripheral blood smear review",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy"
    ],
    management: [
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "FFP or PCC for urgent warfarin reversal with active bleeding"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Transfusion Reactions management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with transfusion reactions presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of transfusion reactions."
      }
    ]
  },
  "vaginal-hematoma-advanced-np-management-np": {
    title: "Vaginal Hematoma",
    cellular: {
      title: "Pathophysiology of Vaginal Hematoma",
      content: "Vaginal Hematoma involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Vaginal Hematoma pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for vaginal hematoma",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for vaginal hematoma",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for vaginal hematoma",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of vaginal hematoma",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to vaginal hematoma",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of vaginal hematoma",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for vaginal hematoma. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Vaginal Hematoma requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of vaginal hematoma"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with vaginal hematoma. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for vaginal hematoma."
      }
    ]
  },
  "host-pathogen-interaction-core-np": {
    title: "Host-Pathogen Interaction",
    cellular: {
      title: "Pathophysiology of Host-Pathogen Interaction",
      content: "Host-Pathogen Interaction involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to host-pathogen interaction."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Host-Pathogen Interaction management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected host-pathogen interaction has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "antimicrobial-stewardship-np": {
    title: "Antimicrobial Stewardship",
    cellular: {
      title: "Pathophysiology of Antimicrobial Stewardship",
      content: "Antimicrobial Stewardship involves alterations in airway structure, gas exchange, or pulmonary vascular function. Antimicrobial Stewardship pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Family history of alpha-1 antitrypsin deficiency",
      "Connective tissue disease with ILD predisposition",
      "Radiation therapy to chest",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Childhood asthma with persistent airway hyperreactivity",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Obesity with restrictive physiology and OSA"
    ],
    diagnostics: [
      "CT chest high-resolution for interstitial/parenchymal disease",
      "6-minute walk test for functional capacity assessment",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Sputum culture, Gram stain, and AFB stain",
      "CT pulmonary angiography for PE evaluation",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Pulse oximetry and continuous SpO2 monitoring"
    ],
    management: [
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Step-up/step-down approach based on asthma control assessment",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Antibiotic therapy based on local resistance patterns and severity scoring"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Antimicrobial Stewardship management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with antimicrobial stewardship develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for antimicrobial stewardship."
      }
    ]
  },
  "resistance-mechanisms-np": {
    title: "Resistance Mechanisms",
    cellular: {
      title: "Pathophysiology of Resistance Mechanisms",
      content: "Resistance Mechanisms involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to resistance mechanisms."
    },
    riskFactors: [
      "Diabetes mellitus with impaired neutrophil function",
      "Crowded living conditions (TB, meningococcal disease)",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Chronic liver disease with impaired immune function",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Chronic skin breakdown or wounds",
      "IV drug use with bacteremia risk"
    ],
    diagnostics: [
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Procalcitonin for bacterial infection likelihood",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Chest X-ray for pneumonia evaluation",
      "CT with contrast for abscess, collection, or source identification"
    ],
    management: [
      "Source control: drainage, debridement, device removal",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Infectious disease consultation for complex or resistant infections",
      "Immunization update for preventable infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Resistance Mechanisms management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected resistance mechanisms has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "uti-primary-care-np": {
    title: "UTI: Primary Care Management",
    cellular: {
      title: "Pathophysiology of UTI",
      content: "UTI pathogenesis involves uropathogenic E. coli (80% of uncomplicated UTIs) with P-fimbriae and type 1 pili adhesins. Uncomplicated cystitis: nitrofurantoin 100mg BID x5 days or TMP-SMX x3 days (if resistance <20%). Pyelonephritis: fluoroquinolone x7 days or IV ceftriaxone. Complicated UTI: IV antibiotics with imaging to rule out obstruction/abscess. CAUTI: remove/replace catheter + antibiotics based on culture."
    },
    riskFactors: [
      "Diabetes mellitus with impaired neutrophil function",
      "Crowded living conditions (TB, meningococcal disease)",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Chronic liver disease with impaired immune function",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Chronic skin breakdown or wounds",
      "IV drug use with bacteremia risk"
    ],
    diagnostics: [
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Procalcitonin for bacterial infection likelihood",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Chest X-ray for pneumonia evaluation",
      "CT with contrast for abscess, collection, or source identification"
    ],
    management: [
      "Source control: drainage, debridement, device removal",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Infectious disease consultation for complex or resistant infections",
      "Immunization update for preventable infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "UTI management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected uti has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "sti-management-core-np": {
    title: "STI Management",
    cellular: {
      title: "Pathophysiology of STI Management",
      content: "STI Management involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to sti management."
    },
    riskFactors: [
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Splenectomy with encapsulated organism susceptibility",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "IV drug use with bacteremia risk",
      "Chronic liver disease with impaired immune function",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Malnutrition with impaired immune cell production"
    ],
    diagnostics: [
      "Sensitivity testing for targeted antimicrobial therapy",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CT with contrast for abscess, collection, or source identification",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Wound/tissue/fluid cultures with Gram stain",
      "Urinalysis with urine culture and sensitivity"
    ],
    management: [
      "Immunization update for preventable infections",
      "Repeat cultures at 48-72h to document clearance",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Infectious disease consultation for complex or resistant infections",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "STI Management management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected sti management has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "cellulitis-np": {
    title: "Cellulitis",
    cellular: {
      title: "Pathophysiology of Cellulitis",
      content: "Cellulitis involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to cellulitis."
    },
    riskFactors: [
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Crowded living conditions (TB, meningococcal disease)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)"
    ],
    diagnostics: [
      "Wound/tissue/fluid cultures with Gram stain",
      "Procalcitonin for bacterial infection likelihood",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Sensitivity testing for targeted antimicrobial therapy"
    ],
    management: [
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Immunization update for preventable infections"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Cellulitis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected cellulitis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "sinusitis-np": {
    title: "Sinusitis",
    cellular: {
      title: "Pathophysiology of Sinusitis",
      content: "Sinusitis involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "pharyngitis-np": {
    title: "Pharyngitis",
    cellular: {
      title: "Pathophysiology of Pharyngitis",
      content: "Pharyngitis involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "gi-infections-np": {
    title: "GI Infections",
    cellular: {
      title: "Pathophysiology of GI Infections",
      content: "GI Infections involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. GI Infections pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for gi infections",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for gi infections",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for gi infections",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of gi infections",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to gi infections",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of gi infections",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for gi infections. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "GI Infections requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of gi infections"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with gi infections. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for gi infections."
      }
    ]
  },
  "hiv-basics-np": {
    title: "HIV Basics",
    cellular: {
      title: "Pathophysiology of HIV Basics",
      content: "HIV is a retrovirus targeting CD4+ T cells via gp120 binding to CD4 and CCR5/CXCR4 co-receptors. Reverse transcriptase converts RNA to DNA integrated into host genome. CD4 <200 = AIDS. ART: INSTI-based regimen (bictegravir/emtricitabine/TAF) preferred. Start ART on day of diagnosis. PrEP: emtricitabine/TDF or TAF for high-risk individuals. Monitor: CD4 count, viral load, resistance testing."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "HIV Basics management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected hiv basics has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "hepatitis-basics-np": {
    title: "Hepatitis Basics",
    cellular: {
      title: "Pathophysiology of Hepatitis Basics",
      content: "Hepatitis Basics involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Hepatitis Basics pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Alcohol use disorder with chronic mucosal injury",
      "Immunosuppression increasing infectious GI complications",
      "Chronic liver disease with portal hypertension",
      "Chronic PPI use >8 weeks without reassessment",
      "Pancreatic insufficiency with malabsorption",
      "High-fat diet with cholelithiasis predisposition",
      "Chronic constipation with diverticular disease risk"
    ],
    diagnostics: [
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Anti-tTG IgA with total IgA for celiac disease screening"
    ],
    management: [
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Cholecystectomy for symptomatic cholelithiasis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to hepatitis basics)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Hepatitis Basics evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of hepatitis basics"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hepatitis basics. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for hepatitis basics."
      }
    ]
  },
  "adult-immunizations-np": {
    title: "Adult Immunizations",
    cellular: {
      title: "Pathophysiology of Adult Immunizations",
      content: "Adult Immunizations involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Adult Immunizations pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for adult immunizations",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for adult immunizations",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for adult immunizations",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of adult immunizations",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to adult immunizations",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of adult immunizations",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for adult immunizations. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Adult Immunizations requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of adult immunizations"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with adult immunizations. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for adult immunizations."
      }
    ]
  },
  "pediatric-vaccine-schedule-np": {
    title: "Pediatric Vaccine Schedule",
    cellular: {
      title: "Pathophysiology of Pediatric Vaccine Schedule",
      content: "Pediatric Vaccine Schedule involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Pediatric Vaccine Schedule in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for pediatric vaccine schedule per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Pediatric Vaccine Schedule requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Pediatric Vaccine Schedule management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with pediatric vaccine schedule. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of pediatric vaccine schedule."
      }
    ]
  },
  "acute-postinfectious-glomerulonephritis-advanced-immunopathology-np-np": {
    title: "Acute Postinfectious Glomerulonephritis",
    cellular: {
      title: "Pathophysiology of Acute Postinfectious Glomerulonephritis",
      content: "Acute Postinfectious Glomerulonephritis involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to acute postinfectious glomerulonephritis."
    },
    riskFactors: [
      "Age >60 with age-related GFR decline",
      "Multiple myeloma with cast nephropathy",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Sickle cell disease with papillary necrosis"
    ],
    diagnostics: [
      "Urinalysis with microscopy (casts, crystals, cells)",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Complement levels (C3, C4) for glomerulonephritis workup"
    ],
    management: [
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Nephrology referral when eGFR <30 or rapidly declining"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Acute Postinfectious Glomerulonephritis management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with acute postinfectious glomerulonephritis has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "advanced-infectious-disease-management-np-np": {
    title: "Advanced Infectious Disease Management",
    cellular: {
      title: "Pathophysiology of Advanced Infectious Disease Management",
      content: "Advanced Infectious Disease Management involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Advanced Infectious Disease Management pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for advanced infectious disease management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for advanced infectious disease management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for advanced infectious disease management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of advanced infectious disease management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to advanced infectious disease management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of advanced infectious disease management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for advanced infectious disease management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Advanced Infectious Disease Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of advanced infectious disease management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with advanced infectious disease management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for advanced infectious disease management."
      }
    ]
  },
  "infective-endocarditis-advanced-np-np": {
    title: "Infective Endocarditis Advanced",
    cellular: {
      title: "Pathophysiology of Infective Endocarditis Advanced",
      content: "Infective Endocarditis Advanced involves specific alterations in infective endocarditis advanced physiology. The pathophysiology of Infective Endocarditis Advanced encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of infective endocarditis advanced."
    },
    riskFactors: [
      "Chronic kidney disease (eGFR <60 mL/min)",
      "History of preeclampsia or gestational hypertension",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Left ventricular hypertrophy on ECG or echo",
      "Chronic hypertension with end-organ damage"
    ],
    diagnostics: [
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "HbA1c for glycemic control assessment in diabetic patients",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation"
    ],
    management: [
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "Guideline-directed medical therapy per ACC/AHA recommendations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      },
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      }
    ],
    pearls: [
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in infective endocarditis advanced?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of infective endocarditis advanced."
      }
    ]
  },
  "sepsis-cytokine-storm-and-sofa-np": {
    title: "Sepsis: Cytokine Storm & SOFA",
    cellular: {
      title: "Pathophysiology of Sepsis",
      content: "Sepsis is life-threatening organ dysfunction from dysregulated host response to infection (Sepsis-3). qSOFA: AMS, SBP <=100, RR >=22. SOFA score >=2 from baseline. Septic shock: sepsis + vasopressors for MAP >=65 + lactate >2 despite adequate fluid. Hour-1 bundle: blood cultures, lactate, broad-spectrum antibiotics, 30 mL/kg crystalloid for hypotension or lactate >=4. Norepinephrine first-line vasopressor."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Sepsis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected sepsis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "tb-management-advanced-np-np": {
    title: "TB Management Advanced",
    cellular: {
      title: "Pathophysiology of TB Management Advanced",
      content: "TB management: LTBI treatment prevents progression to active TB (5-10% lifetime risk). LTBI regimens: 3HP (isoniazid + rifapentine weekly x12 weeks, preferred), 4R (rifampin daily x4 months), 9H (isoniazid daily x9 months). Active TB: RIPE therapy (Rifampin, Isoniazid, Pyrazinamide, Ethambutol) x2 months intensive, then RI x4 months continuation. DOT (directly observed therapy) is standard of care. Isoniazid: supplement with pyridoxine (B6) 25-50mg to prevent peripheral neuropathy. Monitor LFTs monthly. Sputum AFB cultures at 2 months for conversion."
    },
    riskFactors: [
      "Condition-specific predisposing factors for tb management advanced",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for tb management advanced",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for tb management advanced",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of tb management advanced",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to tb management advanced",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of tb management advanced",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for tb management advanced. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "TB Management Advanced requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of tb management advanced"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with tb management advanced. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for tb management advanced."
      }
    ]
  },
  "hypothalamic-pituitary-axis-np": {
    title: "Hypothalamic-Pituitary Axis",
    cellular: {
      title: "Pathophysiology of Hypothalamic-Pituitary Axis",
      content: "Hypothalamic-Pituitary Axis involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hypothalamic-pituitary axis physiology."
    },
    riskFactors: [
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Obesity (BMI >30) with insulin resistance",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Iodine deficiency or excess affecting thyroid function",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)"
    ],
    diagnostics: [
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Prolactin level for pituitary evaluation"
    ],
    management: [
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hypothalamic-Pituitary Axis management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hypothalamic-pituitary axis. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hypothalamic-pituitary axis",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hypothalamic-pituitary axis while being cost-effective."
      }
    ]
  },
  "insulin-glucose-dynamics-np": {
    title: "Insulin-Glucose Dynamics",
    cellular: {
      title: "Pathophysiology of Insulin-Glucose Dynamics",
      content: "Insulin-Glucose Dynamics involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting insulin-glucose dynamics physiology."
    },
    riskFactors: [
      "MEN syndrome family history",
      "Chronic corticosteroid use with HPA axis suppression",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis"
    ],
    diagnostics: [
      "24-hour urine free cortisol for Cushing confirmation",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)"
    ],
    management: [
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Diabetes self-management education and support (DSMES)",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Continuous glucose monitoring for insulin-dependent diabetes"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Insulin-Glucose Dynamics management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected insulin-glucose dynamics. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for insulin-glucose dynamics",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for insulin-glucose dynamics while being cost-effective."
      }
    ]
  },
  "thyroid-regulation-np": {
    title: "Thyroid Regulation",
    cellular: {
      title: "Pathophysiology of Thyroid Regulation",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Obesity (BMI >30) with insulin resistance",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Chronic corticosteroid use with HPA axis suppression",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Iodine deficiency or excess affecting thyroid function",
      "Age-related hormonal decline (menopause, andropause)"
    ],
    diagnostics: [
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis"
    ],
    management: [
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Diabetes self-management education and support (DSMES)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Regulation management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid regulation. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid regulation",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid regulation while being cost-effective."
      }
    ]
  },
  "tsh-interpretation-np": {
    title: "TSH Interpretation",
    cellular: {
      title: "Pathophysiology of TSH Interpretation",
      content: "TSH Interpretation involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. TSH Interpretation pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for tsh interpretation",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for tsh interpretation",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for tsh interpretation",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of tsh interpretation",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to tsh interpretation",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of tsh interpretation",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for tsh interpretation. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "TSH Interpretation requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of tsh interpretation"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with tsh interpretation. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for tsh interpretation."
      }
    ]
  },
  "a1c-interpretation-np": {
    title: "A1C Interpretation",
    cellular: {
      title: "Pathophysiology of A1C Interpretation",
      content: "A1C Interpretation involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. A1C Interpretation pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for a1c interpretation",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for a1c interpretation",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for a1c interpretation",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of a1c interpretation",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to a1c interpretation",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of a1c interpretation",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for a1c interpretation. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "A1C Interpretation requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of a1c interpretation"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with a1c interpretation. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for a1c interpretation."
      }
    ]
  },
  "cortisol-testing-np": {
    title: "Cortisol Testing Basics",
    cellular: {
      title: "Pathophysiology of Cortisol Testing Basics",
      content: "Cortisol Testing Basics involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to cortisol testing basics."
    },
    riskFactors: [
      "Chronic skin breakdown or wounds",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Diabetes mellitus with impaired neutrophil function"
    ],
    diagnostics: [
      "Chest X-ray for pneumonia evaluation",
      "CRP and ESR for inflammatory response quantification",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Wound/tissue/fluid cultures with Gram stain",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CBC with differential (left shift, leukocytosis, lymphopenia)"
    ],
    management: [
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Source control: drainage, debridement, device removal"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Cortisol Testing Basics management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected cortisol testing basics has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "type1-vs-type2-dm-np": {
    title: "Type 1 vs Type 2 Diabetes",
    cellular: {
      title: "Pathophysiology of Type 1 vs Type 2 Diabetes",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Age-related hormonal decline (menopause, andropause)",
      "Obesity (BMI >30) with insulin resistance",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)"
    ],
    diagnostics: [
      "TSH (most sensitive for primary thyroid dysfunction)",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "HbA1c for 3-month glycemic control (target <7% for most adults)"
    ],
    management: [
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Type 1 vs Type 2 Diabetes management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected type 1 vs type 2 diabetes. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for type 1 vs type 2 diabetes",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for type 1 vs type 2 diabetes while being cost-effective."
      }
    ]
  },
  "dka-hhs-basics-np": {
    title: "DKA vs HHS Basics",
    cellular: {
      title: "Pathophysiology of DKA vs HHS Basics",
      content: "DKA: absolute/relative insulin deficiency causing lipolysis, ketogenesis. Triad: glucose >250, pH <7.3, bicarb <18, ketonemia. HHS: extreme hyperglycemia (>600), hyperosmolality (>320) without significant ketosis. DKA treatment: NS 15-20 mL/kg/hr, insulin drip 0.1-0.14 U/kg/hr, K+ replacement when <5.3. Transition to SC insulin when glucose <200, bicarb >=15, pH >7.3, AG closed."
    },
    riskFactors: [
      "Iodine deficiency or excess affecting thyroid function",
      "Obesity (BMI >30) with insulin resistance",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "MEN syndrome family history",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)"
    ],
    diagnostics: [
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Prolactin level for pituitary evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "IGF-1 for growth hormone excess or deficiency screening"
    ],
    management: [
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Calcium + vitamin D supplementation for hypoparathyroidism"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "DKA vs HHS Basics management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected dka vs hhs basics. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for dka vs hhs basics",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for dka vs hhs basics while being cost-effective."
      }
    ]
  },
  "hypothyroidism-core-np": {
    title: "Hypothyroidism",
    cellular: {
      title: "Pathophysiology of Hypothyroidism",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hypothyroidism management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hypothyroidism. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hypothyroidism",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hypothyroidism while being cost-effective."
      }
    ]
  },
  "hyperthyroidism-core-np": {
    title: "Hyperthyroidism",
    cellular: {
      title: "Pathophysiology of Hyperthyroidism",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hyperthyroidism management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hyperthyroidism. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hyperthyroidism",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hyperthyroidism while being cost-effective."
      }
    ]
  },
  "thyroid-nodules-np": {
    title: "Thyroid Nodules",
    cellular: {
      title: "Pathophysiology of Thyroid Nodules",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Age-related hormonal decline (menopause, andropause)",
      "Chronic corticosteroid use with HPA axis suppression",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "MEN syndrome family history",
      "Eating disorders with hypothalamic amenorrhea",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)"
    ],
    diagnostics: [
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Plasma metanephrines for pheochromocytoma screening",
      "PTH with calcium and phosphorus for parathyroid evaluation"
    ],
    management: [
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Medical nutrition therapy with carbohydrate counting",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Nodules management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid nodules. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid nodules",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid nodules while being cost-effective."
      }
    ]
  },
  "adrenal-disorders-basics-np": {
    title: "Adrenal Disorders Basics",
    cellular: {
      title: "Pathophysiology of Adrenal Disorders Basics",
      content: "Adrenal Disorders Basics involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting adrenal disorders basics physiology."
    },
    riskFactors: [
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Iodine deficiency or excess affecting thyroid function",
      "Eating disorders with hypothalamic amenorrhea",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency"
    ],
    diagnostics: [
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Plasma metanephrines for pheochromocytoma screening",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)"
    ],
    management: [
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Medical nutrition therapy with carbohydrate counting",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Diabetes self-management education and support (DSMES)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Adrenal Disorders Basics management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected adrenal disorders basics. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for adrenal disorders basics",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for adrenal disorders basics while being cost-effective."
      }
    ]
  },
  "pcos-core-np": {
    title: "PCOS",
    cellular: {
      title: "Pathophysiology of PCOS",
      content: "PCOS involves hyperandrogenism, oligo-anovulation, and polycystic ovarian morphology (Rotterdam criteria: 2 of 3). Insulin resistance drives excess androgen production. Metabolic consequences: T2DM (50% by age 40), dyslipidemia, endometrial hyperplasia. Treatment: OCPs for menstrual regulation and hyperandrogenism, metformin for insulin resistance, letrozole for ovulation induction (preferred over clomiphene per NICE guidelines)."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for pcos",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "PCOS management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with pcos. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for pcos."
      }
    ]
  },
  "osteoporosis-core-np": {
    title: "Osteoporosis",
    cellular: {
      title: "Pathophysiology of Osteoporosis",
      content: "Osteoporosis involves imbalanced bone remodeling with osteoclast resorption exceeding osteoblast formation. DEXA T-score: normal (>-1), osteopenia (-1 to -2.5), osteoporosis (=<-2.5). FRAX calculator estimates 10-year fracture probability. Treatment threshold: T-score =<-2.5 or FRAX hip fracture >=3% or major osteoporotic fracture >=20%. First-line: oral bisphosphonates (alendronate 70mg weekly, risedronate 35mg weekly). Alternative: denosumab (RANKL inhibitor) 60mg SC q6 months. Teriparatide (PTH analog) for severe osteoporosis or bisphosphonate failure. Calcium 1200mg + vitamin D 800-1000 IU daily. Fall prevention strategies."
    },
    riskFactors: [
      "Condition-specific predisposing factors for osteoporosis",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for osteoporosis",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for osteoporosis",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of osteoporosis",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to osteoporosis",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of osteoporosis",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for osteoporosis. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Osteoporosis requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of osteoporosis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with osteoporosis. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for osteoporosis."
      }
    ]
  },
  "insulin-types-np": {
    title: "Insulin Types",
    cellular: {
      title: "Pathophysiology of Insulin Types",
      content: "Insulin Types involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting insulin types physiology."
    },
    riskFactors: [
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Age-related hormonal decline (menopause, andropause)",
      "Obesity (BMI >30) with insulin resistance",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)"
    ],
    diagnostics: [
      "TSH (most sensitive for primary thyroid dysfunction)",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "HbA1c for 3-month glycemic control (target <7% for most adults)"
    ],
    management: [
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Insulin Types management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected insulin types. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for insulin types",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for insulin types while being cost-effective."
      }
    ]
  },
  "thyroid-hormone-therapy-np": {
    title: "Thyroid Hormone Therapy",
    cellular: {
      title: "Pathophysiology of Thyroid Hormone Therapy",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Age-related hormonal decline (menopause, andropause)",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "MEN syndrome family history"
    ],
    diagnostics: [
      "Prolactin level for pituitary evaluation",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "24-hour urine free cortisol for Cushing confirmation"
    ],
    management: [
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Diabetes self-management education and support (DSMES)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Hormone Therapy management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid hormone therapy. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid hormone therapy",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid hormone therapy while being cost-effective."
      }
    ]
  },
  "androgen-insensitivity-syndrome-np-advanced-molecular-np": {
    title: "Androgen Insensitivity Syndrome",
    cellular: {
      title: "Pathophysiology of Androgen Insensitivity Syndrome",
      content: "Androgen Insensitivity Syndrome involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in androgen insensitivity syndrome. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for androgen insensitivity syndrome per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Androgen Insensitivity Syndrome requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Androgen Insensitivity Syndrome management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with androgen insensitivity syndrome. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of androgen insensitivity syndrome."
      }
    ]
  },
  "antidiabetic-medications-np": {
    title: "Antidiabetic Medications",
    cellular: {
      title: "Pathophysiology of Antidiabetic Medications",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Eating disorders with hypothalamic amenorrhea",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Age-related hormonal decline (menopause, andropause)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Chronic corticosteroid use with HPA axis suppression"
    ],
    diagnostics: [
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Plasma metanephrines for pheochromocytoma screening",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Prolactin level for pituitary evaluation",
      "Morning cortisol (8 AM) and ACTH for adrenal function"
    ],
    management: [
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Diabetes self-management education and support (DSMES)",
      "Medical nutrition therapy with carbohydrate counting",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Antidiabetic Medications management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected antidiabetic medications. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for antidiabetic medications",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for antidiabetic medications while being cost-effective."
      }
    ]
  },
  "diabetes-mellitus-types-1-and-2-np": {
    title: "Diabetes Mellitus Types 1 and 2",
    cellular: {
      title: "Pathophysiology of Diabetes Mellitus Types 1 and 2",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Obesity (BMI >30) with insulin resistance",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Iodine deficiency or excess affecting thyroid function",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)"
    ],
    diagnostics: [
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Prolactin level for pituitary evaluation"
    ],
    management: [
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Diabetes Mellitus Types 1 and 2 management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected diabetes mellitus types 1 and 2. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for diabetes mellitus types 1 and 2",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for diabetes mellitus types 1 and 2 while being cost-effective."
      }
    ]
  },
  "diabetic-ketoacidosis-np": {
    title: "Diabetic Ketoacidosis",
    cellular: {
      title: "Pathophysiology of Diabetic Ketoacidosis",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Obesity (BMI >30) with insulin resistance",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Chronic corticosteroid use with HPA axis suppression",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Iodine deficiency or excess affecting thyroid function",
      "Age-related hormonal decline (menopause, andropause)"
    ],
    diagnostics: [
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis"
    ],
    management: [
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Diabetes self-management education and support (DSMES)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Diabetic Ketoacidosis management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected diabetic ketoacidosis. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for diabetic ketoacidosis",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for diabetic ketoacidosis while being cost-effective."
      }
    ]
  },
  "thyroid-dysfunction-np": {
    title: "Thyroid Dysfunction",
    cellular: {
      title: "Pathophysiology of Thyroid Dysfunction",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Age-related hormonal decline (menopause, andropause)",
      "Chronic corticosteroid use with HPA axis suppression",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "MEN syndrome family history",
      "Eating disorders with hypothalamic amenorrhea",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)"
    ],
    diagnostics: [
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Plasma metanephrines for pheochromocytoma screening",
      "PTH with calcium and phosphorus for parathyroid evaluation"
    ],
    management: [
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Medical nutrition therapy with carbohydrate counting",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Dysfunction management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid dysfunction. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid dysfunction",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid dysfunction while being cost-effective."
      }
    ]
  },
  "fluid-and-electrolytes-3-np": {
    title: "Fluid & Electrolytes (3)",
    cellular: {
      title: "Pathophysiology of Fluid & Electrolytes (3)",
      content: "Fluid & Electrolytes (3) involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to fluid & electrolytes (3)."
    },
    riskFactors: [
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "IV contrast administration (contrast-induced nephropathy)",
      "Recurrent UTIs or urinary tract obstruction",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Hypertension (second leading cause of CKD)"
    ],
    diagnostics: [
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "CBC for anemia of CKD evaluation",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)"
    ],
    management: [
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Fluid & Electrolytes (3) management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with fluid & electrolytes (3) has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "advanced-fluid-electrolyte-and-acid-base-np": {
    title: "Fluid, Electrolyte, and Acid-Base Management",
    cellular: {
      title: "Pathophysiology of Fluid, Electrolyte, and Acid-Base Management",
      content: "Fluid, Electrolyte, and Acid-Base Management involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to fluid, electrolyte, and acid-base management."
    },
    riskFactors: [
      "IV contrast administration (contrast-induced nephropathy)",
      "Hypertension (second leading cause of CKD)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Age >60 with age-related GFR decline",
      "Volume depletion from any cause",
      "Rhabdomyolysis from trauma, statins, or extreme exertion"
    ],
    diagnostics: [
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "CBC for anemia of CKD evaluation",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI"
    ],
    management: [
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Blood pressure target <130/80 with ACEi/ARB as first-line"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Fluid, Electrolyte, and Acid-Base Management management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with fluid, electrolyte, and acid-base management has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "amniotic-fluid-embolism-dic-pathway-np": {
    "title": "Amniotic Fluid Embolism: DIC Pathway",
    "cellular": {
      "title": "DIC Cascade in Amniotic Fluid Embolism",
      "content": "Amniotic fluid embolism (AFE) triggers disseminated intravascular coagulation (DIC) through a two-phase pathological cascade. In Phase 1, amniotic fluid containing fetal squamous cells, lanugo hair, vernix caseosa, mucin, and tissue factor enters the maternal circulation via disrupted endocervical veins, placental implantation site, or uterine lacerations. This material activates the extrinsic coagulation pathway: fetal tissue factor binds Factor VII, forming the TF-VIIa complex that activates Factor X, generating massive thrombin (Factor IIa). Simultaneously, amniotic fluid activates complement (C3a, C5a) and triggers an anaphylactoid immune response with mast cell degranulation, histamine release, and leukotriene production, causing acute pulmonary vasospasm, right ventricular failure, and cardiovascular collapse. In Phase 2, the consumptive coagulopathy develops: widespread microvascular thrombi consume circulating fibrinogen, platelets, and clotting factors (V, VIII, XIII) faster than the liver can replace them. Secondary fibrinolysis activates as plasmin breaks down the deposited fibrin, generating elevated D-dimer and fibrin degradation products (FDPs) that further inhibit fibrin polymerization and platelet aggregation, creating a vicious cycle of coagulation failure. The resulting DIC produces simultaneous thrombosis (organ ischemia) and hemorrhage (coagulation factor depletion). Thromboelastography (TEG) or rotational thromboelastometry (ROTEM) provides real-time assessment of clot formation, strength, and lysis, guiding component-specific blood product replacement. The mortality rate for AFE with DIC ranges from 20-60%, with survivors at risk for multi-organ failure, Sheehan syndrome (pituitary necrosis from hemorrhagic shock), and long-term neurological sequelae."
    },
    "riskFactors": [
      "Rapid or tumultuous labor with strong, frequent contractions (precipitous labor)",
      "Cesarean section or operative delivery (disrupts uteroplacental interface)",
      "Advanced maternal age (>35 years)",
      "Multiparity (especially grand multiparity >5)",
      "Placental abruption (exposes amniotic fluid to disrupted vasculature)",
      "Amniotomy or intrauterine pressure catheter placement",
      "Eclampsia or pre-eclampsia (endothelial dysfunction primes coagulation cascade)",
      "Cervical lacerations providing entry for amniotic fluid into venous circulation",
      "Meconium-stained amniotic fluid (higher tissue factor concentration)",
      "Induction of labor with oxytocin or prostaglandins (uterine hyperstimulation)"
    ],
    "diagnostics": [
      "Order STAT DIC panel: fibrinogen (<200 mg/dL confirms consumption), D-dimer (markedly elevated), PT/INR (prolonged >1.5x), aPTT (prolonged), platelet count (falling <100,000/μL)",
      "Order thromboelastography (TEG) or ROTEM for real-time clot kinetics: R-time (clotting factor activity), K-time (clot formation), MA (maximum amplitude = platelet/fibrinogen contribution), LY30 (fibrinolysis at 30 minutes)",
      "Order ABG: expect severe metabolic acidosis (pH <7.25, lactate >4 mmol/L) and hypoxemia (PaO2 <60 mmHg)",
      "Order serial fibrinogen levels every 30-60 minutes (target >200 mg/dL with replacement therapy)",
      "Order CBC with peripheral smear: look for schistocytes (microangiopathic hemolytic anemia from fibrin strand shearing of RBCs), falling hematocrit",
      "Order BNP and troponin for right heart strain and myocardial injury assessment",
      "Order echocardiogram: assess for acute right ventricular dilation, tricuspid regurgitation, and left ventricular dysfunction",
      "Order chest X-ray: bilateral pulmonary edema pattern in non-cardiogenic distribution"
    ],
    "management": [
      "Activate massive transfusion protocol immediately: target 1:1:1 ratio of PRBCs:FFP:platelets; do not wait for lab confirmation to begin transfusion",
      "Administer cryoprecipitate 10 units (each unit raises fibrinogen ~5-10 mg/dL) to maintain fibrinogen >200 mg/dL; repeat every 30 minutes guided by serial levels or TEG",
      "Administer tranexamic acid (TXA) 1 g IV over 10 minutes within 3 hours of hemorrhage onset to inhibit plasmin-mediated fibrinolysis (WOMAN trial evidence)",
      "If cardiac arrest occurs, initiate ACLS with left uterine displacement (15-30 degrees) and perform perimortem cesarean delivery within 4-5 minutes to improve venous return and maternal/fetal outcomes",
      "Prescribe vasopressor support: norepinephrine 0.1-0.5 mcg/kg/min first-line for hemodynamic instability; add vasopressin 0.04 units/min if refractory",
      "Order Factor VIIa (recombinant, NovoSeven) 90 mcg/kg IV as rescue therapy for refractory hemorrhage unresponsive to conventional blood product replacement",
      "Intubate and mechanically ventilate for respiratory failure (lung-protective settings: TV 6 mL/kg IBW, PEEP 5-10 cmH2O)",
      "Consider ECMO (extracorporeal membrane oxygenation) for refractory cardiopulmonary failure unresponsive to conventional resuscitation",
      "Consult hematology urgently for DIC management and interventional radiology for uterine artery embolization if surgical hemorrhage control is inadequate",
      "Post-resuscitation: ICU admission with continuous hemodynamic monitoring, serial coagulation studies every 2-4 hours, and assessment for multi-organ dysfunction"
    ],
    "nursingActions": [
      "Recognize the classic triad of sudden cardiovascular collapse, respiratory distress, and coagulopathy during labor/delivery as potential AFE-DIC",
      "Establish two large-bore (14-16 gauge) IV lines and rapid infuser setup immediately; draw STAT labs including DIC panel before initiating transfusion",
      "Administer blood products via rapid infuser per massive transfusion protocol; document each unit transfused with time, vital signs, and any transfusion reaction",
      "Monitor for signs of DIC progression: oozing from IV sites, gingival bleeding, petechiae, ecchymosis, hematuria, and uncontrolled surgical bleeding",
      "Perform continuous electronic fetal monitoring until delivery; communicate fetal heart rate abnormalities immediately to the obstetric team",
      "Maintain left uterine displacement (manual or wedge) in all peripartum resuscitation to prevent aortocaval compression",
      "Coordinate simultaneous maternal resuscitation and neonatal resuscitation teams; ensure NICU team is present at delivery",
      "Document timeline of events meticulously including onset of symptoms, interventions, blood products administered, and response to treatment for medicolegal purposes",
      "Monitor urine output hourly via Foley catheter (target >0.5 mL/kg/hr); report oliguria as sign of renal hypoperfusion from DIC microvascular thrombosis",
      "Provide ongoing emotional support and clear communication to family members during and after the emergency; involve social work and chaplaincy services"
    ],
    "signs": {
      "left": [
        "Sudden severe dyspnea and hypoxemia (SpO2 <90%)",
        "Acute cardiovascular collapse with hypotension (SBP <90 mmHg)",
        "Seizure activity or altered mental status",
        "Chest pain and acute right heart failure symptoms"
      ],
      "right": [
        "DIC hemorrhage: oozing from IV sites, surgical incisions, gingival bleeding, petechiae",
        "Massive postpartum hemorrhage unresponsive to uterotonic agents",
        "Cardiac arrest (PEA or asystole most common rhythms)",
        "Fetal bradycardia (<110 bpm sustained) from uteroplacental hypoperfusion"
      ]
    },
    medications: [
      {
        "name": "Cryoprecipitate",
        "type": "Blood Product (Coagulation Factor Replacement)",
        "action": "Provides concentrated fibrinogen, Factor VIII, Factor XIII, von Willebrand factor, and fibronectin to replace consumed coagulation factors in DIC",
        "sideEffects": "Transfusion reaction (febrile, allergic), volume overload, TRALI (rare)",
        "contra": "No absolute contraindication in life-threatening DIC hemorrhage",
        "pearl": "Each unit raises fibrinogen ~5-10 mg/dL; administer 10 units initially, target fibrinogen >200 mg/dL; recheck level 30 minutes post-infusion and repeat as needed."
      },
      {
        "name": "Tranexamic Acid (TXA)",
        "type": "Antifibrinolytic",
        "action": "Competitively inhibits plasminogen activation to plasmin, preventing fibrin clot degradation and reducing hemorrhage from secondary hyperfibrinolysis in DIC",
        "sideEffects": "Nausea, diarrhea, seizures (rare at high doses), thromboembolic risk (theoretical)",
        "contra": "Active thromboembolic disease, severe renal impairment (dose adjust); use with caution in DIC where thrombosis and hemorrhage coexist",
        "pearl": "Administer 1 g IV over 10 minutes within 3 hours of hemorrhage onset (WOMAN trial); may repeat 1 g if bleeding continues after 30 minutes; most effective when given early."
      },
      {
        "name": "Norepinephrine",
        "type": "Vasopressor (Alpha-1 > Beta-1 Agonist)",
        "action": "Potent peripheral vasoconstriction restoring mean arterial pressure; mild inotropic effect supports cardiac output in cardiogenic component of AFE",
        "sideEffects": "Peripheral ischemia, arrhythmia, tissue necrosis with extravasation",
        "contra": "Hypovolemia (correct volume deficit before or concurrently with vasopressor initiation)",
        "pearl": "First-line vasopressor for AFE-related shock; start 0.1 mcg/kg/min and titrate to MAP >65 mmHg; administer via central line when possible to prevent extravasation injury."
      }
    ],
    "pearls": [
      "AFE-DIC is a two-phase emergency: Phase 1 (cardiovascular collapse from pulmonary vasospasm) transitions to Phase 2 (consumptive coagulopathy with massive hemorrhage) within minutes to hours",
      "Do NOT wait for DIC panel results to activate massive transfusion protocol — clinical recognition of coagulopathic bleeding mandates immediate empiric blood product replacement",
      "TEG/ROTEM at the bedside provides real-time coagulation assessment superior to conventional labs (PT/aPTT/fibrinogen) which have 45-60 minute turnaround and may not reflect the rapidly evolving DIC state",
      "Perimortem cesarean delivery within 4-5 minutes of cardiac arrest improves maternal survival by relieving aortocaval compression and improving venous return — it is performed for MATERNAL benefit, not solely fetal",
      "Fibrinogen is the first clotting factor depleted in obstetric DIC; a level <200 mg/dL has a positive predictive value of 100% for severe postpartum hemorrhage"
    ],
    quiz: [
      {
        "question": "A 32-year-old G3P2 at 39 weeks presents with sudden cardiovascular collapse during active labor followed by oozing from IV sites and uncontrolled vaginal bleeding. Labs show fibrinogen 85 mg/dL, platelets 62,000, PT 22 seconds, D-dimer >10,000 ng/mL. Which intervention takes priority?",
        "options": [
          "Order CT pulmonary angiography to confirm diagnosis before treatment",
          "Activate massive transfusion protocol and administer cryoprecipitate 10 units",
          "Administer heparin to prevent further microvascular thrombosis",
          "Perform emergent hysterectomy as definitive hemorrhage control"
        ],
        "correct": 1,
        "rationale": "In AFE with established DIC (critically low fibrinogen, thrombocytopenia, prolonged PT, elevated D-dimer), immediate activation of massive transfusion protocol with cryoprecipitate to replace consumed fibrinogen is the priority intervention. CT angiography would delay treatment of a clinical diagnosis. Heparin is contraindicated in acute hemorrhagic DIC. Hysterectomy may be needed but only after coagulation factor replacement to prevent uncontrollable surgical bleeding."
      },
      {
        "question": "Which bedside test provides the most rapid and actionable assessment of coagulation status in AFE-associated DIC?",
        "options": [
          "Prothrombin time (PT) and activated partial thromboplastin time (aPTT)",
          "Fibrinogen level via Clauss method",
          "Thromboelastography (TEG) or rotational thromboelastometry (ROTEM)",
          "D-dimer quantitative assay"
        ],
        "correct": 2,
        "rationale": "TEG/ROTEM provides real-time, point-of-care assessment of the entire coagulation cascade — from initial clot formation (R-time/CT reflecting clotting factor activity) through clot strength (MA/MCF reflecting platelet and fibrinogen contribution) to fibrinolysis (LY30/ML reflecting clot stability). This allows component-specific blood product replacement within minutes, whereas conventional labs (PT, aPTT, fibrinogen) have a 45-60 minute turnaround that cannot keep pace with rapidly evolving DIC."
      }
    ]
  },
  "sodium-disorders-osmoregulation-np": {
    title: "Sodium Disorders: Osmoregulation",
    cellular: {
      title: "Pathophysiology of Sodium Disorders",
      content: "Sodium Disorders: Osmoregulation involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to sodium disorders."
    },
    riskFactors: [
      "Age >60 with age-related GFR decline",
      "Multiple myeloma with cast nephropathy",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Sickle cell disease with papillary necrosis"
    ],
    diagnostics: [
      "Urinalysis with microscopy (casts, crystals, cells)",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Complement levels (C3, C4) for glomerulonephritis workup"
    ],
    management: [
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Nephrology referral when eGFR <30 or rapidly declining"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Sodium Disorders management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with sodium disorders has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "chronic-stress-and-disease-np": {
    title: "Chronic Stress and Disease",
    cellular: {
      title: "Pathophysiology of Chronic Stress and Disease",
      content: "Chronic Stress and Disease involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Chronic Stress and Disease pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for chronic stress and disease",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for chronic stress and disease",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for chronic stress and disease",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of chronic stress and disease",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to chronic stress and disease",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of chronic stress and disease",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for chronic stress and disease. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Chronic Stress and Disease requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of chronic stress and disease"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chronic stress and disease. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for chronic stress and disease."
      }
    ]
  },
  "dkahhs-anion-gap-and-osmolality-np": {
    title: "DKA/HHS: Anion Gap & Osmolality",
    cellular: {
      title: "Pathophysiology of DKA/HHS",
      content: "DKA: absolute/relative insulin deficiency causing lipolysis, ketogenesis. Triad: glucose >250, pH <7.3, bicarb <18, ketonemia. HHS: extreme hyperglycemia (>600), hyperosmolality (>320) without significant ketosis. DKA treatment: NS 15-20 mL/kg/hr, insulin drip 0.1-0.14 U/kg/hr, K+ replacement when <5.3. Transition to SC insulin when glucose <200, bicarb >=15, pH >7.3, AG closed."
    },
    riskFactors: [
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Eating disorders with hypothalamic amenorrhea",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion"
    ],
    diagnostics: [
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Prolactin level for pituitary evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Plasma metanephrines for pheochromocytoma screening",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Pituitary MRI for sellar/suprasellar mass evaluation"
    ],
    management: [
      "Diabetes self-management education and support (DSMES)",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Medical nutrition therapy with carbohydrate counting",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "DKA/HHS management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected dka/hhs. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for dka/hhs",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for dka/hhs while being cost-effective."
      }
    ]
  },
  "hpa-axis-and-stress-response-np": {
    title: "HPA Axis and Stress Response",
    cellular: {
      title: "Pathophysiology of HPA Axis and Stress Response",
      content: "The HPA axis regulates cortisol secretion through CRH (hypothalamus) stimulating ACTH (anterior pituitary) stimulating cortisol (adrenal cortex) with negative feedback. Chronic stress dysregulates the axis causing sustained cortisol elevation, immune suppression, metabolic derangements, and psychiatric effects. Exogenous glucocorticoid use >2-3 weeks suppresses the HPA axis requiring gradual taper to prevent adrenal crisis."
    },
    riskFactors: [
      "Eating disorders with hypothalamic amenorrhea",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "MEN syndrome family history",
      "Obesity (BMI >30) with insulin resistance",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Age-related hormonal decline (menopause, andropause)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)"
    ],
    diagnostics: [
      "Plasma metanephrines for pheochromocytoma screening",
      "IGF-1 for growth hormone excess or deficiency screening",
      "24-hour urine free cortisol for Cushing confirmation",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "TSH (most sensitive for primary thyroid dysfunction)"
    ],
    management: [
      "Medical nutrition therapy with carbohydrate counting",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "HPA Axis and Stress Response management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hpa axis and stress response. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hpa axis and stress response",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hpa axis and stress response while being cost-effective."
      }
    ]
  },
  "hypothalamic-pituitary-ovarian-axis-np": {
    title: "Hypothalamic-Pituitary-Ovarian Axis",
    cellular: {
      title: "Pathophysiology of Hypothalamic-Pituitary-Ovarian Axis",
      content: "Hypothalamic-Pituitary-Ovarian Axis involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hypothalamic-pituitary-ovarian axis physiology."
    },
    riskFactors: [
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Eating disorders with hypothalamic amenorrhea",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Age-related hormonal decline (menopause, andropause)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Chronic corticosteroid use with HPA axis suppression"
    ],
    diagnostics: [
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Plasma metanephrines for pheochromocytoma screening",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Prolactin level for pituitary evaluation",
      "Morning cortisol (8 AM) and ACTH for adrenal function"
    ],
    management: [
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Diabetes self-management education and support (DSMES)",
      "Medical nutrition therapy with carbohydrate counting",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hypothalamic-Pituitary-Ovarian Axis management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hypothalamic-pituitary-ovarian axis. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hypothalamic-pituitary-ovarian axis",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hypothalamic-pituitary-ovarian axis while being cost-effective."
      }
    ]
  },
  "post-traumatic-stress-disorder-np": {
    title: "Post-Traumatic Stress Disorder",
    cellular: {
      title: "Pathophysiology of Post-Traumatic Stress Disorder",
      content: "Post-Traumatic Stress Disorder involves multi-system pathophysiology requiring integration of knowledge across organ systems for post-traumatic stress disorder."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Post-Traumatic Stress Disorder management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with post-traumatic stress disorder arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for post-traumatic stress disorder."
      }
    ]
  },
  "gfr-physiology-np": {
    title: "GFR Physiology",
    cellular: {
      title: "Pathophysiology of GFR Physiology",
      content: "GFR Physiology involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to gfr physiology."
    },
    riskFactors: [
      "Hypertension (second leading cause of CKD)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Age >60 with age-related GFR decline",
      "Volume depletion from any cause",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Recurrent UTIs or urinary tract obstruction"
    ],
    diagnostics: [
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "24-hour urine collection for proteinuria quantification and CrCl"
    ],
    management: [
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "GFR Physiology management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with gfr physiology has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "raas-np": {
    title: "RAAS",
    cellular: {
      title: "Pathophysiology of RAAS",
      content: "RAAS involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. RAAS pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for raas",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for raas",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for raas",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of raas",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to raas",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of raas",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for raas. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "RAAS requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of raas"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with raas. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for raas."
      }
    ]
  },
  "fluid-balance-np": {
    title: "Fluid Balance",
    cellular: {
      title: "Pathophysiology of Fluid Balance",
      content: "Fluid Balance involves multi-system pathophysiology requiring integration of knowledge across organ systems for fluid balance."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Fluid Balance management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with fluid balance arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for fluid balance."
      }
    ]
  },
  "cmp-interpretation-np": {
    title: "CMP Interpretation",
    cellular: {
      title: "Pathophysiology of CMP Interpretation",
      content: "CMP Interpretation involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. CMP Interpretation pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for cmp interpretation",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for cmp interpretation",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for cmp interpretation",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of cmp interpretation",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to cmp interpretation",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of cmp interpretation",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for cmp interpretation. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "CMP Interpretation requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of cmp interpretation"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cmp interpretation. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for cmp interpretation."
      }
    ]
  },
  "egfr-np": {
    title: "eGFR",
    cellular: {
      title: "Pathophysiology of eGFR",
      content: "eGFR involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to egfr."
    },
    riskFactors: [
      "Multiple myeloma with cast nephropathy",
      "Sickle cell disease with papillary necrosis",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Volume depletion from any cause",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Family history of polycystic kidney disease or Alport syndrome"
    ],
    diagnostics: [
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "CBC for anemia of CKD evaluation",
      "Renal ultrasound for size, echogenicity, obstruction, masses"
    ],
    management: [
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "eGFR management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with egfr has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "urinalysis-interpretation-np": {
    title: "Urinalysis Interpretation",
    cellular: {
      title: "Pathophysiology of Urinalysis Interpretation",
      content: "Urinalysis Interpretation involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in urinalysis interpretation. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for urinalysis interpretation per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Urinalysis Interpretation requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Urinalysis Interpretation management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with urinalysis interpretation. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of urinalysis interpretation."
      }
    ]
  },
  "urine-culture-logic-np": {
    title: "Urine Culture Logic",
    cellular: {
      title: "Pathophysiology of Urine Culture Logic",
      content: "Urine Culture Logic involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in urine culture logic. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for urine culture logic per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Urine Culture Logic requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Urine Culture Logic management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with urine culture logic. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of urine culture logic."
      }
    ]
  },
  "aki-vs-ckd-np": {
    title: "AKI vs CKD",
    cellular: {
      title: "Pathophysiology of AKI vs CKD",
      content: "AKI KDIGO staging: Stage 1 (Cr 1.5-1.9x baseline or >=0.3 increase in 48h), Stage 2 (2-2.9x), Stage 3 (>=3x or Cr >4.0 or dialysis initiation). Prerenal (60-70%): decreased perfusion (FENa <1%, BUN:Cr >20:1). Intrinsic (25-30%): ATN (muddy brown casts, FENa >2%), GN (RBC casts), AIN (eosinophils, WBC casts). Postrenal (5-10%): obstruction (hydronephrosis on ultrasound)."
    },
    riskFactors: [
      "Multiple myeloma with cast nephropathy",
      "Sickle cell disease with papillary necrosis",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Volume depletion from any cause",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Family history of polycystic kidney disease or Alport syndrome"
    ],
    diagnostics: [
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "CBC for anemia of CKD evaluation",
      "Renal ultrasound for size, echogenicity, obstruction, masses"
    ],
    management: [
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "AKI vs CKD management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with aki vs ckd has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "electrolyte-abnormalities-np": {
    title: "Electrolyte Abnormalities",
    cellular: {
      title: "Pathophysiology of Electrolyte Abnormalities",
      content: "Electrolyte Abnormalities involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to electrolyte abnormalities."
    },
    riskFactors: [
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Age >60 with age-related GFR decline",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Multiple myeloma with cast nephropathy"
    ],
    diagnostics: [
      "CBC for anemia of CKD evaluation",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "PTH and vitamin D levels for renal osteodystrophy assessment"
    ],
    management: [
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Electrolyte Abnormalities management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with electrolyte abnormalities has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "bph-np": {
    title: "BPH",
    cellular: {
      title: "Pathophysiology of BPH",
      content: "BPH involves testosterone-dependent prostatic stromal and epithelial hyperplasia causing bladder outlet obstruction. DHT (via 5-alpha reductase) is the primary hormonal driver. IPSS quantifies symptom severity. Management: watchful waiting for mild (IPSS <8), alpha-blockers (tamsulosin) for moderate, 5-alpha reductase inhibitors (finasteride/dutasteride) for large prostates (>40g), combination therapy for moderate-severe. Surgical: TURP for refractory symptoms."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for bph",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "BPH evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with bph presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for bph."
      }
    ]
  },
  "nephrolithiasis-np": {
    title: "Nephrolithiasis",
    cellular: {
      title: "Pathophysiology of Nephrolithiasis",
      content: "Nephrolithiasis involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to nephrolithiasis."
    },
    riskFactors: [
      "Volume depletion from any cause",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Recurrent UTIs or urinary tract obstruction",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "IV contrast administration (contrast-induced nephropathy)"
    ],
    diagnostics: [
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)"
    ],
    management: [
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Nephrolithiasis management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with nephrolithiasis has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "adrenal-disorders-cushing-and-addison-np": {
    title: "Adrenal Disorders: Cushing and Addison",
    cellular: {
      title: "Pathophysiology of Adrenal Disorders",
      content: "Cushing syndrome results from chronic glucocorticoid excess. Exogenous (most common: iatrogenic steroids) or endogenous (ACTH-dependent: pituitary adenoma 70%, ectopic ACTH 15%; ACTH-independent: adrenal adenoma/carcinoma 15%). Screening: 24h urine free cortisol, late-night salivary cortisol, 1mg overnight dexamethasone suppression test. Clinical features: central obesity, moon face, buffalo hump, striae, proximal weakness, glucose intolerance."
    },
    riskFactors: [
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Iodine deficiency or excess affecting thyroid function",
      "Eating disorders with hypothalamic amenorrhea",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency"
    ],
    diagnostics: [
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Plasma metanephrines for pheochromocytoma screening",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)"
    ],
    management: [
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Medical nutrition therapy with carbohydrate counting",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Diabetes self-management education and support (DSMES)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Adrenal Disorders management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected adrenal disorders. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for adrenal disorders",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for adrenal disorders while being cost-effective."
      }
    ]
  },
  "advanced-hemodialysis-and-renal-replacement-therapy-np": {
    title: "Hemodialysis and Renal Replacement Therapy",
    cellular: {
      title: "Pathophysiology of Hemodialysis and Renal Replacement Therapy",
      content: "Hemodialysis and Renal Replacement Therapy involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to hemodialysis and renal replacement therapy."
    },
    riskFactors: [
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Age >60 with age-related GFR decline",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Multiple myeloma with cast nephropathy"
    ],
    diagnostics: [
      "CBC for anemia of CKD evaluation",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "PTH and vitamin D levels for renal osteodystrophy assessment"
    ],
    management: [
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Hemodialysis and Renal Replacement Therapy management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with hemodialysis and renal replacement therapy has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "aki-rifle-criteria-and-dialysis-np": {
    title: "AKI: RIFLE Criteria & Dialysis",
    cellular: {
      title: "Pathophysiology of AKI",
      content: "AKI KDIGO staging: Stage 1 (Cr 1.5-1.9x baseline or >=0.3 increase in 48h), Stage 2 (2-2.9x), Stage 3 (>=3x or Cr >4.0 or dialysis initiation). Prerenal (60-70%): decreased perfusion (FENa <1%, BUN:Cr >20:1). Intrinsic (25-30%): ATN (muddy brown casts, FENa >2%), GN (RBC casts), AIN (eosinophils, WBC casts). Postrenal (5-10%): obstruction (hydronephrosis on ultrasound)."
    },
    riskFactors: [
      "IV contrast administration (contrast-induced nephropathy)",
      "Hypertension (second leading cause of CKD)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Age >60 with age-related GFR decline",
      "Volume depletion from any cause",
      "Rhabdomyolysis from trauma, statins, or extreme exertion"
    ],
    diagnostics: [
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "CBC for anemia of CKD evaluation",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI"
    ],
    management: [
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Blood pressure target <130/80 with ACEi/ARB as first-line"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "AKI management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with aki has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "benign-prostatic-hyperplasia-np": {
    title: "Benign Prostatic Hyperplasia",
    cellular: {
      title: "Pathophysiology of Benign Prostatic Hyperplasia",
      content: "Benign Prostatic Hyperplasia involves male reproductive, urological, or andrological pathophysiology specific to benign prostatic hyperplasia."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for benign prostatic hyperplasia",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Benign Prostatic Hyperplasia evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with benign prostatic hyperplasia presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for benign prostatic hyperplasia."
      }
    ]
  },
  "prostatitis-syndromes-np": {
    title: "Prostatitis Syndromes",
    cellular: {
      title: "Pathophysiology of Prostatitis Syndromes",
      content: "Prostatitis Syndromes involves male reproductive, urological, or andrological pathophysiology specific to prostatitis syndromes."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for prostatitis syndromes",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Prostatitis Syndromes evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with prostatitis syndromes presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for prostatitis syndromes."
      }
    ]
  },
  "liver-function-np": {
    title: "Liver Function",
    cellular: {
      title: "Pathophysiology of Liver Function",
      content: "Liver Function involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Liver Function pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Chronic PPI use >8 weeks without reassessment",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Pancreatic insufficiency with malabsorption",
      "Family history of GI malignancy (first-degree relative)",
      "NSAID use >2 weeks without gastroprotection",
      "Alcohol use disorder with chronic mucosal injury"
    ],
    diagnostics: [
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "MRCP for biliary and pancreatic duct evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "EGD with biopsy for upper GI pathology evaluation",
      "Capsule endoscopy for obscure small bowel bleeding"
    ],
    management: [
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to liver function)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Liver Function evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of liver function"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with liver function. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for liver function."
      }
    ]
  },
  "bilirubin-metabolism-np": {
    title: "Bilirubin Metabolism",
    cellular: {
      title: "Pathophysiology of Bilirubin Metabolism",
      content: "Bilirubin Metabolism involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Bilirubin Metabolism pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for bilirubin metabolism",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for bilirubin metabolism",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for bilirubin metabolism",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of bilirubin metabolism",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to bilirubin metabolism",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of bilirubin metabolism",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for bilirubin metabolism. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Bilirubin Metabolism requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of bilirubin metabolism"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with bilirubin metabolism. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for bilirubin metabolism."
      }
    ]
  },
  "gi-motility-np": {
    title: "GI Motility",
    cellular: {
      title: "Pathophysiology of GI Motility",
      content: "GI Motility involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. GI Motility pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for gi motility",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for gi motility",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for gi motility",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of gi motility",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to gi motility",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of gi motility",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for gi motility. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "GI Motility requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of gi motility"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with gi motility. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for gi motility."
      }
    ]
  },
  "lft-interpretation-np": {
    title: "LFT Interpretation",
    cellular: {
      title: "Pathophysiology of LFT Interpretation",
      content: "LFT Interpretation involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. LFT Interpretation pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for lft interpretation",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for lft interpretation",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for lft interpretation",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of lft interpretation",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to lft interpretation",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of lft interpretation",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for lft interpretation. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "LFT Interpretation requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of lft interpretation"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with lft interpretation. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for lft interpretation."
      }
    ]
  },
  "lipase-amylase-np": {
    title: "Lipase/Amylase Interpretation",
    cellular: {
      title: "Pathophysiology of Lipase/Amylase Interpretation",
      content: "Lipase/Amylase Interpretation involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Lipase/Amylase Interpretation pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for lipase/amylase interpretation",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for lipase/amylase interpretation",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for lipase/amylase interpretation",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of lipase/amylase interpretation",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to lipase/amylase interpretation",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of lipase/amylase interpretation",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for lipase/amylase interpretation. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Lipase/Amylase Interpretation requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of lipase/amylase interpretation"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with lipase/amylase interpretation. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for lipase/amylase interpretation."
      }
    ]
  },
  "stool-testing-np": {
    title: "Stool Testing",
    cellular: {
      title: "Pathophysiology of Stool Testing",
      content: "Stool Testing involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to stool testing."
    },
    riskFactors: [
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Chronic liver disease with impaired immune function",
      "Diabetes mellitus with impaired neutrophil function",
      "Splenectomy with encapsulated organism susceptibility",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "Chronic skin breakdown or wounds"
    ],
    diagnostics: [
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "Chest X-ray for pneumonia evaluation"
    ],
    management: [
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Infectious disease consultation for complex or resistant infections",
      "Source control: drainage, debridement, device removal",
      "Repeat cultures at 48-72h to document clearance",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Stool Testing management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected stool testing has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "gerd-core-np": {
    title: "GERD",
    cellular: {
      title: "Pathophysiology of GERD",
      content: "GERD results from transient lower esophageal sphincter relaxation allowing gastric acid reflux, causing esophageal mucosal injury. Chronic acid exposure can lead to Barrett esophagus (intestinal metaplasia replacing squamous epithelium), a premalignant condition with 0.5% annual progression to esophageal adenocarcinoma. Los Angeles classification grades erosive esophagitis (A-D). Management: PPI therapy (8-week course), lifestyle modifications, endoscopic surveillance for Barrett."
    },
    riskFactors: [
      "H. pylori infection (most common cause of PUD worldwide)",
      "Chronic PPI use >8 weeks without reassessment",
      "Family history of GI malignancy (first-degree relative)",
      "Chronic liver disease with portal hypertension",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "History of C. difficile infection (recurrence risk 20%)",
      "Immunosuppression increasing infectious GI complications"
    ],
    diagnostics: [
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "EGD with biopsy for upper GI pathology evaluation",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "MRCP for biliary and pancreatic duct evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "RUQ ultrasound for gallbladder and hepatic assessment"
    ],
    management: [
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to gerd)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "GERD evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of gerd"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with gerd. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for gerd."
      }
    ]
  },
  "pud-np": {
    title: "PUD",
    cellular: {
      title: "Pathophysiology of PUD",
      content: "PUD involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. PUD pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for pud",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for pud",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for pud",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of pud",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to pud",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of pud",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for pud. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "PUD requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of pud"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pud. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for pud."
      }
    ]
  },
  "ibs-ibd-np": {
    title: "IBS vs IBD",
    cellular: {
      title: "Pathophysiology of IBS vs IBD",
      content: "Crohn disease involves transmural granulomatous inflammation affecting any GI segment (terminal ileum most common). Skip lesions, cobblestone mucosa, and non-caseating granulomas are characteristic. Driven by Th1/Th17 cytokine imbalance (TNF-alpha, IL-12, IL-23). Complications: strictures, fistulae, abscesses. Treat with corticosteroids for induction, then maintenance with immunomodulators (azathioprine) or biologics (anti-TNF, anti-IL-12/23)."
    },
    riskFactors: [
      "Chronic constipation with diverticular disease risk",
      "Age >65 with declining mucosal defenses",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Alcohol use disorder with chronic mucosal injury",
      "Chronic PPI use >8 weeks without reassessment",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "Family history of GI malignancy (first-degree relative)"
    ],
    diagnostics: [
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "EGD with biopsy for upper GI pathology evaluation",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "MRCP for biliary and pancreatic duct evaluation"
    ],
    management: [
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to ibs vs ibd)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "IBS vs IBD evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of ibs vs ibd"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with ibs vs ibd. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for ibs vs ibd."
      }
    ]
  },
  "hepatitis-core-np": {
    title: "Hepatitis",
    cellular: {
      title: "Pathophysiology of Hepatitis",
      content: "Hepatitis involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Hepatitis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "History of C. difficile infection (recurrence risk 20%)",
      "NSAID use >2 weeks without gastroprotection",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Radiation therapy to abdomen causing enteritis",
      "Prior abdominal surgery with adhesion formation",
      "Alcohol use disorder with chronic mucosal injury",
      "Tobacco use (impairs mucosal healing)"
    ],
    diagnostics: [
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "MRCP for biliary and pancreatic duct evaluation",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Abdominal X-ray: obstruction, free air, calcifications"
    ],
    management: [
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Surgical consultation for acute abdomen with peritoneal signs"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to hepatitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Hepatitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of hepatitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hepatitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for hepatitis."
      }
    ]
  },
  "cirrhosis-core-np": {
    title: "Cirrhosis",
    cellular: {
      title: "Pathophysiology of Cirrhosis",
      content: "Cirrhosis involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Cirrhosis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Immunosuppression increasing infectious GI complications",
      "Alcohol use disorder with chronic mucosal injury",
      "Pancreatic insufficiency with malabsorption",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Chronic liver disease with portal hypertension",
      "Tobacco use (impairs mucosal healing)",
      "Age >65 with declining mucosal defenses"
    ],
    diagnostics: [
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "H. pylori testing: urea breath test, stool antigen, or biopsy"
    ],
    management: [
      "Bowel rest with IV fluids for acute pancreatitis",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cirrhosis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Cirrhosis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cirrhosis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cirrhosis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cirrhosis."
      }
    ]
  },
  "gallbladder-disease-np": {
    title: "Gallbladder Disease",
    cellular: {
      title: "Pathophysiology of Gallbladder Disease",
      content: "Gallbladder Disease involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Gallbladder Disease pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for gallbladder disease",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for gallbladder disease",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for gallbladder disease",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of gallbladder disease",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to gallbladder disease",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of gallbladder disease",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for gallbladder disease. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Gallbladder Disease requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of gallbladder disease"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with gallbladder disease. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for gallbladder disease."
      }
    ]
  },
  "pancreatitis-basics-np": {
    title: "Pancreatitis Basics",
    cellular: {
      title: "Pathophysiology of Pancreatitis Basics",
      content: "Acute pancreatitis results from premature trypsinogen activation within acinar cells, triggering autodigestive cascade. Gallstones (40%) and alcohol (40%) are most common causes. Severity: Revised Atlanta classification (mild, moderate-severe, severe). Ranson criteria and BISAP score predict severity. Management: aggressive IV fluids (LR preferred, 250-500 mL/hr initially), pain control, NPO then early enteral feeding."
    },
    riskFactors: [
      "Age >65 with declining mucosal defenses",
      "Chronic constipation with diverticular disease risk",
      "Chronic PPI use >8 weeks without reassessment",
      "Immunosuppression increasing infectious GI complications",
      "H. pylori infection (most common cause of PUD worldwide)",
      "IBD family history (10-25% have affected first-degree relative)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)"
    ],
    diagnostics: [
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "EGD with biopsy for upper GI pathology evaluation",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "Colonoscopy with polypectomy for lower GI assessment"
    ],
    management: [
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Bowel rest with IV fluids for acute pancreatitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to pancreatitis basics)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Pancreatitis Basics evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of pancreatitis basics"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pancreatitis basics. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for pancreatitis basics."
      }
    ]
  },
  "hellp-syndrome-hepatic-cascade-np": {
    title: "HELLP Syndrome: Hepatic Cascade",
    cellular: {
      title: "Pathophysiology of HELLP Syndrome",
      content: "HELLP Syndrome: Hepatic Cascade involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. HELLP Syndrome pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "H. pylori infection (most common cause of PUD worldwide)",
      "Chronic PPI use >8 weeks without reassessment",
      "Family history of GI malignancy (first-degree relative)",
      "Chronic liver disease with portal hypertension",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "History of C. difficile infection (recurrence risk 20%)",
      "Immunosuppression increasing infectious GI complications"
    ],
    diagnostics: [
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "MRCP for biliary and pancreatic duct evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "EGD with biopsy for upper GI pathology evaluation",
      "Capsule endoscopy for obscure small bowel bleeding"
    ],
    management: [
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to hellp syndrome)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "HELLP Syndrome evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of hellp syndrome"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hellp syndrome. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for hellp syndrome."
      }
    ]
  },
  "rotavirus-gastroenteritis-np-advanced-practice-np": {
    title: "Rotavirus Gastroenteritis",
    cellular: {
      title: "Pathophysiology of Rotavirus Gastroenteritis",
      content: "Rotavirus Gastroenteritis involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Rotavirus Gastroenteritis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Immunosuppression increasing infectious GI complications",
      "Alcohol use disorder with chronic mucosal injury",
      "Pancreatic insufficiency with malabsorption",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Chronic liver disease with portal hypertension",
      "Tobacco use (impairs mucosal healing)",
      "Age >65 with declining mucosal defenses"
    ],
    diagnostics: [
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Anti-tTG IgA with total IgA for celiac disease screening"
    ],
    management: [
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Cholecystectomy for symptomatic cholelithiasis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to rotavirus gastroenteritis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Rotavirus Gastroenteritis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of rotavirus gastroenteritis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with rotavirus gastroenteritis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for rotavirus gastroenteritis."
      }
    ]
  },
  "biliary-atresia-advanced-np-np": {
    title: "Biliary Atresia",
    cellular: {
      title: "Pathophysiology of Biliary Atresia",
      content: "Biliary Atresia involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Biliary Atresia pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for biliary atresia",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for biliary atresia",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for biliary atresia",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of biliary atresia",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to biliary atresia",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of biliary atresia",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for biliary atresia. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Biliary Atresia requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of biliary atresia"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with biliary atresia. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for biliary atresia."
      }
    ]
  },
  "cholecystectomy-np-advanced-biliary-management-np": {
    title: "Cholecystectomy",
    cellular: {
      title: "Pathophysiology of Cholecystectomy",
      content: "Cholecystectomy involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Cholecystectomy pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Prior abdominal surgery with adhesion formation",
      "Tobacco use (impairs mucosal healing)",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "High-fat diet with cholelithiasis predisposition",
      "Chronic liver disease with portal hypertension",
      "Diabetes with gastroparesis and motility dysfunction"
    ],
    diagnostics: [
      "Capsule endoscopy for obscure small bowel bleeding",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "EGD with biopsy for upper GI pathology evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "ERCP for therapeutic biliary/pancreatic duct intervention"
    ],
    management: [
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Nutritional support: enteral preferred over parenteral when feasible"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cholecystectomy)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Cholecystectomy evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cholecystectomy"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cholecystectomy. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cholecystectomy."
      }
    ]
  },
  "eosinophilic-esophagitis-advanced-np-np": {
    title: "Eosinophilic Esophagitis",
    cellular: {
      title: "Pathophysiology of Eosinophilic Esophagitis",
      content: "Eosinophilic Esophagitis involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Eosinophilic Esophagitis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Pancreatic insufficiency with malabsorption",
      "Chronic liver disease with portal hypertension",
      "Age >65 with declining mucosal defenses",
      "Family history of GI malignancy (first-degree relative)",
      "Chronic constipation with diverticular disease risk",
      "Diabetes with gastroparesis and motility dysfunction",
      "Chronic PPI use >8 weeks without reassessment"
    ],
    diagnostics: [
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "FibroScan or FIB-4 score for hepatic fibrosis staging"
    ],
    management: [
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to eosinophilic esophagitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Eosinophilic Esophagitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of eosinophilic esophagitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with eosinophilic esophagitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for eosinophilic esophagitis."
      }
    ]
  },
  "primary-secondary-lesions-np": {
    title: "Primary vs Secondary Lesions",
    cellular: {
      title: "Pathophysiology of Primary vs Secondary Lesions",
      content: "Primary vs Secondary Lesions involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Primary vs Secondary Lesions pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for primary vs secondary lesions",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for primary vs secondary lesions",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for primary vs secondary lesions",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of primary vs secondary lesions",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to primary vs secondary lesions",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of primary vs secondary lesions",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for primary vs secondary lesions. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Primary vs Secondary Lesions requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of primary vs secondary lesions"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with primary vs secondary lesions. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for primary vs secondary lesions."
      }
    ]
  },
  "abcde-melanoma-rule-np": {
    title: "ABCDE Melanoma Rule",
    cellular: {
      title: "Pathophysiology of ABCDE Melanoma Rule",
      content: "Melanoma arises from malignant melanocyte transformation driven by UV-induced DNA damage and BRAF (50%), NRAS (25%), or NF1 mutations. BRAF V600E constitutively activates MAPK cascade. Breslow depth is the strongest prognostic factor: <1mm = 95% 5-year survival; >4mm = 45%. SLNB recommended for >0.8mm or ulcerated tumors. Immunotherapy (anti-PD-1, anti-CTLA-4) and BRAF/MEK inhibitors have revolutionized advanced melanoma treatment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for abcde melanoma rule",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "ABCDE Melanoma Rule management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of abcde melanoma rule?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "eczema-np": {
    title: "Eczema",
    cellular: {
      title: "Pathophysiology of Eczema",
      content: "Eczema involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for eczema",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Eczema management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of eczema?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "psoriasis-core-np": {
    title: "Psoriasis",
    cellular: {
      title: "Pathophysiology of Psoriasis",
      content: "Psoriasis is driven by the IL-23/Th17 axis. IL-23 from dendritic cells activates Th17 cells releasing IL-17A/F and IL-22, causing keratinocyte hyperproliferation (cycle 28 to 3-4 days), neutrophil recruitment (Munro microabscesses), and neoangiogenesis. PASI quantifies severity. Biologics (IL-17, IL-23, TNF-alpha inhibitors) achieve PASI 90-100 in 40-70%."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for psoriasis",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Psoriasis management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of psoriasis?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "acne-np": {
    title: "Acne",
    cellular: {
      title: "Pathophysiology of Acne",
      content: "Acne involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for acne",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Acne management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of acne?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "fungal-infections-np": {
    title: "Fungal Infections",
    cellular: {
      title: "Pathophysiology of Fungal Infections",
      content: "Fungal Infections involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to fungal infections."
    },
    riskFactors: [
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Chronic liver disease with impaired immune function",
      "Diabetes mellitus with impaired neutrophil function",
      "Splenectomy with encapsulated organism susceptibility",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "Chronic skin breakdown or wounds"
    ],
    diagnostics: [
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "Chest X-ray for pneumonia evaluation"
    ],
    management: [
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Infectious disease consultation for complex or resistant infections",
      "Source control: drainage, debridement, device removal",
      "Repeat cultures at 48-72h to document clearance",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Fungal Infections management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected fungal infections has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "skin-cancers-basics-np": {
    title: "Skin Cancers Basics",
    cellular: {
      title: "Pathophysiology of Skin Cancers Basics",
      content: "Skin Cancers Basics involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for skin cancers basics",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Skin Cancers Basics management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of skin cancers basics?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "rashes-differentiation-np": {
    title: "Rashes Differentiation",
    cellular: {
      title: "Pathophysiology of Rashes Differentiation",
      content: "Rashes Differentiation involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for rashes differentiation",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Rashes Differentiation management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of rashes differentiation?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "sclerodermasystemic-sclerosis-np-np": {
    title: "Scleroderma/Systemic Sclerosis",
    cellular: {
      title: "Pathophysiology of Scleroderma/Systemic Sclerosis",
      content: "Scleroderma/Systemic Sclerosis involves specific alterations in scleroderma/systemic sclerosis physiology. The pathophysiology of Scleroderma/Systemic Sclerosis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of scleroderma/systemic sclerosis."
    },
    riskFactors: [
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Peripheral artery disease (ABI <0.9)",
      "Chronic hypertension with end-organ damage",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)"
    ],
    diagnostics: [
      "CBC with differential (anemia worsens cardiac ischemia)",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN"
    ],
    management: [
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Referral for surgical intervention when medical therapy insufficient"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with scleroderma/systemic sclerosis on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "advanced-dermatologic-assessment-and-management-np-np": {
    title: "Dermatologic Assessment and Management",
    cellular: {
      title: "Pathophysiology of Dermatologic Assessment and Management",
      content: "Dermatologic Assessment and Management involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for dermatologic assessment and management",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Dermatologic Assessment and Management management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of dermatologic assessment and management?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "icp-cerebral-perfusion-pressure-np": {
    title: "ICP: Cerebral Perfusion Pressure",
    cellular: {
      title: "Pathophysiology of ICP",
      content: "Central pontine myelinolysis (osmotic demyelination syndrome) results from overly rapid correction of chronic hyponatremia (>8-10 mEq/L/24h). Osmotic stress causes oligodendrocyte apoptosis with demyelination in the central pons and extrapontine structures. Prevention: limit sodium correction to <=8 mEq/L/day. Treatment is supportive. PRES (posterior reversible encephalopathy syndrome) involves vasogenic edema from endothelial dysfunction due to severe hypertension, eclampsia, or immunosuppressive agents. MRI shows bilateral white matter edema in parieto-occipital regions. Management: aggressive blood pressure control and removal of inciting agent."
    },
    riskFactors: [
      "Prior CNS infection (increased seizure risk)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Family history of neurological disease (first-degree relative)",
      "Age >65 with progressive neurodegenerative risk",
      "Chronic alcohol use with neurotoxicity",
      "Hypertension (leading modifiable risk for stroke)"
    ],
    diagnostics: [
      "Genetic testing when hereditary neurological condition suspected",
      "MRA or CTA for intracranial vascular evaluation",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "EEG for seizure characterization and localization",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)"
    ],
    management: [
      "Palliative care and goals of care discussion for progressive diseases",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "ICP requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with icp. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for icp."
      }
    ]
  },
  "integumentary-pathophysiology-epidermal-barrier-and-atopic-np": {
    title: "Integumentary Pathophysiology: Epidermal",
    cellular: {
      title: "Pathophysiology of Integumentary Pathophysiology",
      content: "Integumentary Pathophysiology: Epidermal involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for integumentary pathophysiology",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Integumentary Pathophysiology management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of integumentary pathophysiology?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "negative-pressure-wound-therapy-np": {
    title: "Negative Pressure Wound Therapy",
    cellular: {
      title: "Pathophysiology of Negative Pressure Wound Therapy",
      content: "Negative Pressure Wound Therapy involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Negative Pressure Wound Therapy pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for negative pressure wound therapy",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for negative pressure wound therapy",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for negative pressure wound therapy",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of negative pressure wound therapy",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to negative pressure wound therapy",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of negative pressure wound therapy",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for negative pressure wound therapy. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Negative Pressure Wound Therapy requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of negative pressure wound therapy"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with negative pressure wound therapy. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for negative pressure wound therapy."
      }
    ]
  },
  "growth-development-milestones-np": {
    title: "Growth & Development Milestones",
    cellular: {
      title: "Pathophysiology of Growth & Development Milestones",
      content: "Growth & Development Milestones involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Growth & Development Milestones in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for growth & development milestones per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Growth & Development Milestones requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Growth & Development Milestones management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with growth & development milestones. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of growth & development milestones."
      }
    ]
  },
  "pediatric-dosing-logic-np": {
    title: "Pediatric Dosing Logic",
    cellular: {
      title: "Pharmacology of Pediatric Dosing Logic",
      content: "Pediatric Dosing Logic encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to pediatric dosing logic."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Pediatric Dosing Logic management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to pediatric dosing logic. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "pediatric-red-flags-np": {
    title: "Pediatric Red Flags",
    cellular: {
      title: "Pharmacology of Pediatric Red Flags",
      content: "Pediatric Red Flags encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to pediatric red flags."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Pediatric Red Flags management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to pediatric red flags. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "otitis-media-np": {
    title: "Otitis Media",
    cellular: {
      title: "Pathophysiology of Otitis Media",
      content: "Otitis Media involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "bronchiolitis-np": {
    title: "Bronchiolitis",
    cellular: {
      title: "Pathophysiology of Bronchiolitis",
      content: "Bronchiolitis involves alterations in airway structure, gas exchange, or pulmonary vascular function. Bronchiolitis pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Connective tissue disease with ILD predisposition",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "GERD with chronic microaspiration",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Radiation therapy to chest",
      "Family history of alpha-1 antitrypsin deficiency",
      "Current or former tobacco use (pack-year calculation)"
    ],
    diagnostics: [
      "6-minute walk test for functional capacity assessment",
      "Bronchoscopy with BAL for diagnostic sampling",
      "D-dimer (high sensitivity, low specificity for PE)",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO"
    ],
    management: [
      "Step-up/step-down approach based on asthma control assessment",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Bronchiolitis management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with bronchiolitis develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for bronchiolitis."
      }
    ]
  },
  "croup-np": {
    title: "Croup",
    cellular: {
      title: "Pathophysiology of Croup",
      content: "Croup involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Croup in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for croup per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Croup requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Croup management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with croup. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of croup."
      }
    ]
  },
  "adhd-basics-np": {
    title: "ADHD Basics",
    cellular: {
      title: "Pathophysiology of ADHD Basics",
      content: "ADHD Basics involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to adhd basics."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "ADHD Basics management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with adhd basics. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of adhd basics."
      }
    ]
  },
  "kawasaki-disease-np": {
    title: "Kawasaki Disease",
    cellular: {
      title: "Pathophysiology of Kawasaki Disease",
      content: "AKI KDIGO staging: Stage 1 (Cr 1.5-1.9x baseline or >=0.3 increase in 48h), Stage 2 (2-2.9x), Stage 3 (>=3x or Cr >4.0 or dialysis initiation). Prerenal (60-70%): decreased perfusion (FENa <1%, BUN:Cr >20:1). Intrinsic (25-30%): ATN (muddy brown casts, FENa >2%), GN (RBC casts), AIN (eosinophils, WBC casts). Postrenal (5-10%): obstruction (hydronephrosis on ultrasound)."
    },
    riskFactors: [
      "Sickle cell disease with papillary necrosis",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Volume depletion from any cause",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Age >60 with age-related GFR decline",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)"
    ],
    diagnostics: [
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "CBC for anemia of CKD evaluation",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)"
    ],
    management: [
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Kawasaki Disease management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with kawasaki disease has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "intussusception-np": {
    title: "Intussusception",
    cellular: {
      title: "Pathophysiology of Intussusception",
      content: "Intussusception involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Intussusception pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for intussusception",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for intussusception",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for intussusception",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of intussusception",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to intussusception",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of intussusception",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for intussusception. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Intussusception requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of intussusception"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with intussusception. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for intussusception."
      }
    ]
  },
  "tetralogy-of-fallot-np": {
    title: "Tetralogy of Fallot",
    cellular: {
      title: "Pathophysiology of Tetralogy of Fallot",
      content: "Tetralogy of Fallot involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Tetralogy of Fallot pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for tetralogy of fallot",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for tetralogy of fallot",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for tetralogy of fallot",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of tetralogy of fallot",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to tetralogy of fallot",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of tetralogy of fallot",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for tetralogy of fallot. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Tetralogy of Fallot requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of tetralogy of fallot"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with tetralogy of fallot. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for tetralogy of fallot."
      }
    ]
  },
  "vaccine-catchup-schedules-np": {
    title: "Vaccine Catch-Up Schedules: CDC",
    cellular: {
      title: "Pathophysiology of Vaccine Catch-Up Schedules",
      content: "Vaccine Catch-Up Schedules: CDC involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Vaccine Catch-Up Schedules pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for vaccine catch-up schedules",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for vaccine catch-up schedules",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for vaccine catch-up schedules",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of vaccine catch-up schedules",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to vaccine catch-up schedules",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of vaccine catch-up schedules",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for vaccine catch-up schedules. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Vaccine Catch-Up Schedules requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of vaccine catch-up schedules"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with vaccine catch-up schedules. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for vaccine catch-up schedules."
      }
    ]
  },
  "pediatric-growth-disorders-np": {
    title: "Pediatric Growth Disorders: Short Stature",
    cellular: {
      title: "Pathophysiology of Pediatric Growth Disorders",
      content: "Pediatric Growth Disorders: Short Stature involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Pediatric Growth Disorders in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for pediatric growth disorders per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Pediatric Growth Disorders requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Pediatric Growth Disorders management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with pediatric growth disorders. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of pediatric growth disorders."
      }
    ]
  },
  "autism-screening-np": {
    title: "Autism Screening: M-CHAT",
    cellular: {
      title: "Pathophysiology of Autism Screening",
      content: "UTI pathogenesis involves uropathogenic E. coli (80% of uncomplicated UTIs) with P-fimbriae and type 1 pili adhesins. Uncomplicated cystitis: nitrofurantoin 100mg BID x5 days or TMP-SMX x3 days (if resistance <20%). Pyelonephritis: fluoroquinolone x7 days or IV ceftriaxone. Complicated UTI: IV antibiotics with imaging to rule out obstruction/abscess. CAUTI: remove/replace catheter + antibiotics based on culture."
    },
    riskFactors: [
      "Splenectomy with encapsulated organism susceptibility",
      "Malnutrition with impaired immune cell production",
      "Chronic liver disease with impaired immune function",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Chronic skin breakdown or wounds",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)"
    ],
    diagnostics: [
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Urinalysis with urine culture and sensitivity",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Wound/tissue/fluid cultures with Gram stain",
      "Chest X-ray for pneumonia evaluation",
      "Procalcitonin for bacterial infection likelihood",
      "Lactate level for sepsis severity (>2 mmol/L concerning)"
    ],
    management: [
      "Repeat cultures at 48-72h to document clearance",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Infectious disease consultation for complex or resistant infections",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "De-escalation to narrow-spectrum based on culture and sensitivity results"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Autism Screening management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected autism screening has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "failure-to-thrive-np": {
    title: "Failure to Thrive Workup: Organic vs",
    cellular: {
      title: "Pathophysiology of Failure to Thrive Workup",
      content: "Failure to Thrive Workup: Organic vs involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Failure to Thrive Workup pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for failure to thrive workup",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for failure to thrive workup",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for failure to thrive workup",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of failure to thrive workup",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to failure to thrive workup",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of failure to thrive workup",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for failure to thrive workup. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Failure to Thrive Workup requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of failure to thrive workup"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with failure to thrive workup. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for failure to thrive workup."
      }
    ]
  },
  "pediatric-obesity-management-np": {
    title: "Pediatric Obesity Management: BMI Percentiles",
    cellular: {
      title: "Pathophysiology of Pediatric Obesity Management",
      content: "Pediatric Obesity Management: BMI Percentiles involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Pediatric Obesity Management in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for pediatric obesity management per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Pediatric Obesity Management requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Pediatric Obesity Management management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with pediatric obesity management. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of pediatric obesity management."
      }
    ]
  },
  "febrile-infant-algorithm-np": {
    title: "Febrile Infant Algorithm: Rochester",
    cellular: {
      title: "Pathophysiology of Febrile Infant Algorithm",
      content: "Febrile Infant Algorithm: Rochester involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Febrile Infant Algorithm in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for febrile infant algorithm per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Febrile Infant Algorithm requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Febrile Infant Algorithm management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with febrile infant algorithm. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of febrile infant algorithm."
      }
    ]
  },
  "neonatal-jaundice-workup-np": {
    title: "Neonatal Jaundice Workup: Bhutani Nomogram",
    cellular: {
      title: "Pathophysiology of Neonatal Jaundice Workup",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Liver disease with coagulopathy and thrombocytopenia"
    ],
    diagnostics: [
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "CBC with differential and peripheral blood smear review",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)"
    ],
    management: [
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "IVIG for severe ITP with active bleeding or preprocedural"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Neonatal Jaundice Workup management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with neonatal jaundice workup presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of neonatal jaundice workup."
      }
    ]
  },
  "febrile-seizures-np": {
    title: "Febrile Seizures: Workup, Prophylaxis",
    cellular: {
      title: "Pathophysiology of Febrile Seizures",
      content: "Seizures result from excitatory/inhibitory neurotransmission imbalance. Status epilepticus: continuous seizure >=5 min. First-line: IV lorazepam 0.1mg/kg (max 4mg), repeat once. Second-line: IV fosphenytoin or levetiracetam. AEDs: sodium channel blockade (phenytoin, carbamazepine, lamotrigine), GABA enhancement (benzodiazepines, phenobarbital), SV2A binding (levetiracetam)."
    },
    riskFactors: [
      "Sleep deprivation or circadian rhythm disruption",
      "Prior head trauma or TBI history",
      "Chronic alcohol use with neurotoxicity",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)"
    ],
    diagnostics: [
      "Carotid duplex ultrasound for extracranial stenosis",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "EEG for seizure characterization and localization",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "MRA or CTA for intracranial vascular evaluation",
      "Neuropsychological testing for cognitive domain assessment",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening"
    ],
    management: [
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Blood pressure management per AHA stroke guidelines",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Seizure precautions and driving restriction counseling",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Rehabilitation: PT, OT, speech therapy for functional recovery"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Febrile Seizures requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with febrile seizures. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for febrile seizures."
      }
    ]
  },
  "pediatric-dehydration-np": {
    title: "Pediatric Dehydration: Dysnatremia Correction",
    cellular: {
      title: "Pathophysiology of Pediatric Dehydration",
      content: "Pediatric Dehydration: Dysnatremia Correction involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Pediatric Dehydration in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for pediatric dehydration per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Pediatric Dehydration requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Pediatric Dehydration management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with pediatric dehydration. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of pediatric dehydration."
      }
    ]
  },
  "infant-reflexes-np-advanced-assessment-np": {
    title: "Infant Reflexes",
    cellular: {
      title: "Pathophysiology of Infant Reflexes",
      content: "Infant Reflexes involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Infant Reflexes in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for infant reflexes per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Infant Reflexes requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Infant Reflexes management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with infant reflexes. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of infant reflexes."
      }
    ]
  },
  "np-maternal-newborn-and-reproductive-health-np": {
    title: "Maternal-Newborn and Reproductive Health",
    cellular: {
      title: "Pathophysiology of Maternal-Newborn and Reproductive Health",
      content: "Maternal-Newborn and Reproductive Health involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Maternal-Newborn and Reproductive Health pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for maternal-newborn and reproductive health",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for maternal-newborn and reproductive health",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for maternal-newborn and reproductive health",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of maternal-newborn and reproductive health",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to maternal-newborn and reproductive health",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of maternal-newborn and reproductive health",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for maternal-newborn and reproductive health. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Maternal-Newborn and Reproductive Health requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of maternal-newborn and reproductive health"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with maternal-newborn and reproductive health. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for maternal-newborn and reproductive health."
      }
    ]
  },
  "menstrual-physiology-np": {
    title: "Menstrual Physiology",
    cellular: {
      title: "Pathophysiology of Menstrual Physiology",
      content: "Menstrual Physiology involves reproductive, obstetric, or gynecologic pathophysiology specific to menstrual physiology."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for menstrual physiology",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Menstrual Physiology management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with menstrual physiology. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for menstrual physiology."
      }
    ]
  },
  "contraception-np": {
    title: "Contraception",
    cellular: {
      title: "Pathophysiology of Contraception",
      content: "Contraception involves reproductive, obstetric, or gynecologic pathophysiology specific to contraception."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for contraception",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Contraception management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with contraception. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for contraception."
      }
    ]
  },
  "pregnancy-basics-np": {
    title: "Pregnancy Basics",
    cellular: {
      title: "Pathophysiology of Pregnancy Basics",
      content: "Pregnancy Basics involves reproductive, obstetric, or gynecologic pathophysiology specific to pregnancy basics."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for pregnancy basics",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Pregnancy Basics management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with pregnancy basics. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for pregnancy basics."
      }
    ]
  },
  "amenorrhea-np": {
    title: "Amenorrhea",
    cellular: {
      title: "Pathophysiology of Amenorrhea",
      content: "Amenorrhea involves reproductive, obstetric, or gynecologic pathophysiology specific to amenorrhea."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for amenorrhea",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Amenorrhea management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with amenorrhea. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for amenorrhea."
      }
    ]
  },
  "prenatal-screening-np": {
    title: "Prenatal Screening",
    cellular: {
      title: "Pathophysiology of Prenatal Screening",
      content: "Prenatal Screening involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Prenatal Screening pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for prenatal screening",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for prenatal screening",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for prenatal screening",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of prenatal screening",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to prenatal screening",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of prenatal screening",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for prenatal screening. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Prenatal Screening requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of prenatal screening"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with prenatal screening. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for prenatal screening."
      }
    ]
  },
  "sti-screening-np": {
    title: "STI Screening",
    cellular: {
      title: "Pathophysiology of STI Screening",
      content: "STI Screening involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to sti screening."
    },
    riskFactors: [
      "Chronic skin breakdown or wounds",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Diabetes mellitus with impaired neutrophil function"
    ],
    diagnostics: [
      "Chest X-ray for pneumonia evaluation",
      "CRP and ESR for inflammatory response quantification",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Wound/tissue/fluid cultures with Gram stain",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CBC with differential (left shift, leukocytosis, lymphopenia)"
    ],
    management: [
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Source control: drainage, debridement, device removal"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "STI Screening management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected sti screening has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "menopause-management-np": {
    title: "Menopause Management",
    cellular: {
      title: "Pathophysiology of Menopause Management",
      content: "Menopause Management involves reproductive, obstetric, or gynecologic pathophysiology specific to menopause management."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for menopause management",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Menopause Management management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with menopause management. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for menopause management."
      }
    ]
  },
  "abnormal-uterine-bleeding-palm-coein-and-np": {
    title: "Abnormal Uterine Bleeding: PALM-COEIN",
    cellular: {
      title: "Pathophysiology of Abnormal Uterine Bleeding",
      content: "Abnormal Uterine Bleeding: PALM-COEIN involves reproductive, obstetric, or gynecologic pathophysiology specific to abnormal uterine bleeding."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for abnormal uterine bleeding",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Abnormal Uterine Bleeding management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with abnormal uterine bleeding. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for abnormal uterine bleeding."
      }
    ]
  },
  "bacterial-vaginosis-molecular-microbiome-ecology-and-np": {
    title: "Bacterial Vaginosis: Molecular Microbiome",
    cellular: {
      title: "Pathophysiology of Bacterial Vaginosis",
      content: "Bacterial Vaginosis: Molecular Microbiome involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Bacterial Vaginosis pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for bacterial vaginosis",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for bacterial vaginosis",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for bacterial vaginosis",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of bacterial vaginosis",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to bacterial vaginosis",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of bacterial vaginosis",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for bacterial vaginosis. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Bacterial Vaginosis requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of bacterial vaginosis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with bacterial vaginosis. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for bacterial vaginosis."
      }
    ]
  },
  "cervicitis-pathogen-molecular-biology-and-cdc-np": {
    title: "Cervicitis: Pathogen Molecular Biology",
    cellular: {
      title: "Pathophysiology of Cervicitis",
      content: "Cervicitis: Pathogen Molecular Biology involves reproductive, obstetric, or gynecologic pathophysiology specific to cervicitis."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for cervicitis",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Cervicitis management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with cervicitis. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for cervicitis."
      }
    ]
  },
  "delayed-puberty-molecular-and-prescriptive-management-np": {
    title: "Delayed Puberty: Molecular",
    cellular: {
      title: "Pathophysiology of Delayed Puberty",
      content: "Delayed Puberty: Molecular involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Delayed Puberty pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for delayed puberty",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for delayed puberty",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for delayed puberty",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of delayed puberty",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to delayed puberty",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of delayed puberty",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for delayed puberty. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Delayed Puberty requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of delayed puberty"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with delayed puberty. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for delayed puberty."
      }
    ]
  },
  "dysmenorrhea-cox-2-pathways-and-advanced-np": {
    title: "Dysmenorrhea: COX-2 Pathways",
    cellular: {
      title: "Pathophysiology of Dysmenorrhea",
      content: "Dysmenorrhea: COX-2 Pathways involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Dysmenorrhea pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for dysmenorrhea",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for dysmenorrhea",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for dysmenorrhea",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of dysmenorrhea",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to dysmenorrhea",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of dysmenorrhea",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for dysmenorrhea. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Dysmenorrhea requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of dysmenorrhea"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with dysmenorrhea. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for dysmenorrhea."
      }
    ]
  },
  "eclampsia-endothelial-dysfunction-np": {
    title: "Eclampsia: Endothelial Dysfunction",
    cellular: {
      title: "Pathophysiology of Eclampsia",
      content: "Eclampsia: Endothelial Dysfunction involves reproductive, obstetric, or gynecologic pathophysiology specific to eclampsia."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for eclampsia",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Eclampsia management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with eclampsia. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for eclampsia."
      }
    ]
  },
  "endometrial-polyps-molecular-proliferation-and-hysteroscopic-np": {
    title: "Endometrial Polyps: Molecular Proliferation",
    cellular: {
      title: "Pathophysiology of Endometrial Polyps",
      content: "Endometrial Polyps: Molecular Proliferation involves reproductive, obstetric, or gynecologic pathophysiology specific to endometrial polyps."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for endometrial polyps",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Endometrial Polyps management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with endometrial polyps. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for endometrial polyps."
      }
    ]
  },
  "endometriosis-np-advanced-np": {
    title: "Endometriosis",
    cellular: {
      title: "Pathophysiology of Endometriosis",
      content: "Endometriosis involves reproductive, obstetric, or gynecologic pathophysiology specific to endometriosis."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for endometriosis",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Endometriosis management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with endometriosis. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for endometriosis."
      }
    ]
  },
  "erectile-dysfunction-np": {
    title: "Erectile Dysfunction",
    cellular: {
      title: "Pathophysiology of Erectile Dysfunction",
      content: "Erectile Dysfunction involves male reproductive, urological, or andrological pathophysiology specific to erectile dysfunction."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for erectile dysfunction",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Erectile Dysfunction evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with erectile dysfunction presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for erectile dysfunction."
      }
    ]
  },
  "galactorrhea-np-advanced-np": {
    title: "Galactorrhea",
    cellular: {
      title: "Pathophysiology of Galactorrhea",
      content: "Galactorrhea involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Galactorrhea pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for galactorrhea",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for galactorrhea",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for galactorrhea",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of galactorrhea",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to galactorrhea",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of galactorrhea",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for galactorrhea. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Galactorrhea requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of galactorrhea"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with galactorrhea. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for galactorrhea."
      }
    ]
  },
  "gynecologic-conditions-vaginitis-pid-endometriosis-pcos-np": {
    title: "Gynecologic Conditions: Vaginitis, PID",
    cellular: {
      title: "Pathophysiology of Gynecologic Conditions",
      content: "Gynecologic Conditions: Vaginitis, PID involves reproductive, obstetric, or gynecologic pathophysiology specific to gynecologic conditions."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for gynecologic conditions",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Gynecologic Conditions management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with gynecologic conditions. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for gynecologic conditions."
      }
    ]
  },
  "infertility-np-advanced-np": {
    title: "Infertility",
    cellular: {
      title: "Pathophysiology of Infertility",
      content: "Infertility involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Infertility pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for infertility",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for infertility",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for infertility",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of infertility",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to infertility",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of infertility",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for infertility. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Infertility requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of infertility"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with infertility. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for infertility."
      }
    ]
  },
  "male-infertility-2-np": {
    title: "Male Infertility",
    cellular: {
      title: "Pathophysiology of Male Infertility",
      content: "Male infertility contributes to ~50% of infertile couples. Evaluation: semen analysis (WHO criteria: volume >1.5mL, concentration >15M/mL, motility >40%, morphology >4% normal). Common causes: varicocele (35-40%, most correctable cause), hypogonadism, genetic (Klinefelter 47,XXY, Y-microdeletion), obstructive (CBAVD associated with CFTR mutations). Workup: 2 semen analyses, FSH/LH/testosterone, scrotal ultrasound. Varicocele repair improves semen parameters in 60-70%."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for male infertility",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Male Infertility evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with male infertility presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for male infertility."
      }
    ]
  },
  "mastitis-np-advanced-practice-np": {
    title: "Mastitis",
    cellular: {
      title: "Pathophysiology of Mastitis",
      content: "Mastitis involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to mastitis."
    },
    riskFactors: [
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Crowded living conditions (TB, meningococcal disease)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "IV drug use with bacteremia risk",
      "Splenectomy with encapsulated organism susceptibility"
    ],
    diagnostics: [
      "Procalcitonin for bacterial infection likelihood",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CT with contrast for abscess, collection, or source identification",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)"
    ],
    management: [
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Immunization update for preventable infections",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Repeat cultures at 48-72h to document clearance"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Mastitis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected mastitis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "polypharmacy-np": {
    title: "Polypharmacy",
    cellular: {
      title: "Pharmacology of Polypharmacy",
      content: "Polypharmacy encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to polypharmacy."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Polypharmacy management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to polypharmacy. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "frailty-np": {
    title: "Frailty",
    cellular: {
      title: "Pathophysiology of Frailty",
      content: "Frailty involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Frailty pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for frailty",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for frailty",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for frailty",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of frailty",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to frailty",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of frailty",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for frailty. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Frailty requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of frailty"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with frailty. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for frailty."
      }
    ]
  },
  "fall-risk-np": {
    title: "Fall Risk",
    cellular: {
      title: "Pathophysiology of Fall Risk",
      content: "Fall Risk involves systematic clinical evaluation skills essential for NP practice. Fall Risk requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for fall risk per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Fall Risk requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Fall Risk management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with fall risk. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of fall risk."
      }
    ]
  },
  "cognitive-decline-np": {
    title: "Cognitive Decline",
    cellular: {
      title: "Pathophysiology of Cognitive Decline",
      content: "Cognitive Decline involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Cognitive Decline pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for cognitive decline",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for cognitive decline",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for cognitive decline",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of cognitive decline",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to cognitive decline",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of cognitive decline",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for cognitive decline. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Cognitive Decline requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of cognitive decline"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cognitive decline. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for cognitive decline."
      }
    ]
  },
  "advanced-gerontology-np-scope-np": {
    title: "Advanced Gerontology",
    cellular: {
      title: "Pathophysiology of Advanced Gerontology",
      content: "Advanced Gerontology encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Advanced Gerontology requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for advanced gerontology per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Advanced Gerontology requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Advanced Gerontology management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with advanced gerontology. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of advanced gerontology."
      }
    ]
  },
  "community-health-nursing-np-scope-np": {
    title: "Community Health Nursing",
    cellular: {
      title: "Pathophysiology of Community Health Nursing",
      content: "Community Health Nursing encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Community Health Nursing requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for community health nursing per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Community Health Nursing requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Community Health Nursing management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with community health nursing. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of community health nursing."
      }
    ]
  },
  "depression-core-np": {
    title: "Depression",
    cellular: {
      title: "Pathophysiology of Depression",
      content: "Major depressive disorder involves monoamine deficiency (serotonin, norepinephrine, dopamine), HPA axis dysregulation, neuroinflammation, and altered neuroplasticity. DSM-5: >=5 of 9 SIGECAPS criteria for >=2 weeks. First-line: SSRIs (sertraline, escitalopram). Black box warning: suicidality monitoring in age <25. PHQ-9 for screening and monitoring. Adequate trial: 6-8 weeks at therapeutic dose."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Depression management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with depression. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of depression."
      }
    ]
  },
  "anxiety-disorders-core-np": {
    title: "Anxiety Disorders",
    cellular: {
      title: "Pathophysiology of Anxiety Disorders",
      content: "Anxiety Disorders involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to anxiety disorders."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Anxiety Disorders management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with anxiety disorders. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of anxiety disorders."
      }
    ]
  },
  "bipolar-disorder-core-np": {
    title: "Bipolar Disorder",
    cellular: {
      title: "Pathophysiology of Bipolar Disorder",
      content: "Bipolar disorder involves mood cycling between mania/hypomania and depression. Bipolar I: at least one manic episode (7+ days or hospitalization). Bipolar II: hypomania + major depression. Mood stabilizers are cornerstone: lithium (gold standard, therapeutic level 0.6-1.2), valproate, lamotrigine (depression prevention). Antidepressant monotherapy contraindicated (can trigger mania). Lithium monitoring: renal function, thyroid, levels q3-6 months."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Bipolar Disorder management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with bipolar disorder. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of bipolar disorder."
      }
    ]
  },
  "schizophrenia-basics-np": {
    title: "Schizophrenia Basics",
    cellular: {
      title: "Pathophysiology of Schizophrenia Basics",
      content: "Schizophrenia involves dopamine hypothesis: mesolimbic hyperactivity (positive symptoms: hallucinations, delusions, disorganized speech/behavior) and mesocortical hypoactivity (negative symptoms: flat affect, alogia, avolition, anhedonia). Glutamate (NMDA receptor hypofunction) and serotonin pathways also involved. Treatment: second-generation antipsychotics first-line (risperidone, olanzapine, aripiprazole). Clozapine for treatment-resistant schizophrenia (requires ANC monitoring for agranulocytosis)."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Schizophrenia Basics management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with schizophrenia basics. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of schizophrenia basics."
      }
    ]
  },
  "substance-use-disorders-np": {
    title: "Substance Use Disorders",
    cellular: {
      title: "Pathophysiology of Substance Use Disorders",
      content: "Substance Use Disorders involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to substance use disorders."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Substance Use Disorders management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with substance use disorders. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of substance use disorders."
      }
    ]
  },
  "ssris-np": {
    title: "SSRIs",
    cellular: {
      title: "Pathophysiology of SSRIs",
      content: "SSRIs involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. SSRIs pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for ssris",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for ssris",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for ssris",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of ssris",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to ssris",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of ssris",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for ssris. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "SSRIs requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of ssris"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with ssris. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for ssris."
      }
    ]
  },
  "snris-np": {
    title: "SNRIs",
    cellular: {
      title: "Pathophysiology of SNRIs",
      content: "SNRIs involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. SNRIs pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for snris",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for snris",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for snris",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of snris",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to snris",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of snris",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for snris. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "SNRIs requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of snris"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with snris. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for snris."
      }
    ]
  },
  "antipsychotics-core-np": {
    title: "Antipsychotics",
    cellular: {
      title: "Pathophysiology of Antipsychotics",
      content: "Antipsychotics involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Antipsychotics pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Prior abdominal surgery with adhesion formation",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "High-fat diet with cholelithiasis predisposition",
      "IBD family history (10-25% have affected first-degree relative)",
      "Tobacco use (impairs mucosal healing)",
      "Pancreatic insufficiency with malabsorption",
      "Radiation therapy to abdomen causing enteritis"
    ],
    diagnostics: [
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Anti-tTG IgA with total IgA for celiac disease screening"
    ],
    management: [
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Cholecystectomy for symptomatic cholelithiasis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to antipsychotics)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Antipsychotics evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of antipsychotics"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with antipsychotics. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for antipsychotics."
      }
    ]
  },
  "mood-stabilizers-core-np": {
    title: "Mood Stabilizers",
    cellular: {
      title: "Pathophysiology of Mood Stabilizers",
      content: "Mood Stabilizers involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to mood stabilizers."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Mood Stabilizers management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with mood stabilizers. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of mood stabilizers."
      }
    ]
  },
  "tuberculosis-fundamentals-np": {
    title: "Tuberculosis Fundamentals",
    cellular: {
      title: "Pathophysiology of Tuberculosis Fundamentals",
      content: "Tuberculosis Fundamentals involves alterations in airway structure, gas exchange, or pulmonary vascular function. Tuberculosis Fundamentals pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Cystic fibrosis genotype (CFTR mutations)",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Age >65 with declining mucociliary clearance",
      "Radiation therapy to chest",
      "Prematurity with bronchopulmonary dysplasia history",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Connective tissue disease with ILD predisposition"
    ],
    diagnostics: [
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Sputum culture, Gram stain, and AFB stain",
      "Peak expiratory flow rate monitoring for asthma",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "6-minute walk test for functional capacity assessment"
    ],
    management: [
      "Annual influenza and pneumococcal vaccination",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Inhaler technique assessment and spacer use education",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Step-up/step-down approach based on asthma control assessment"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Tuberculosis Fundamentals management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with tuberculosis fundamentals develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for tuberculosis fundamentals."
      }
    ]
  },
  "evidence-based-practice-np": {
    title: "Evidence-Based Practice",
    cellular: {
      title: "Pathophysiology of Evidence-Based Practice",
      content: "Evidence-Based Practice encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Evidence-Based Practice requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for evidence-based practice per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Evidence-Based Practice requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Evidence-Based Practice management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with evidence-based practice. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of evidence-based practice."
      }
    ]
  },
  "screening-guidelines-uspstf-np": {
    title: "Screening Guidelines: USPSTF-Style Logic",
    cellular: {
      title: "Pathophysiology of Screening Guidelines",
      content: "Screening Guidelines: USPSTF-Style Logic involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Screening Guidelines pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for screening guidelines",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for screening guidelines",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for screening guidelines",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of screening guidelines",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to screening guidelines",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of screening guidelines",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for screening guidelines. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Screening Guidelines requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of screening guidelines"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with screening guidelines. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for screening guidelines."
      }
    ]
  },
  "preventive-care-np": {
    title: "Preventive Care",
    cellular: {
      title: "Pathophysiology of Preventive Care",
      content: "Preventive Care involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Preventive Care pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for preventive care",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for preventive care",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for preventive care",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of preventive care",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to preventive care",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of preventive care",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for preventive care. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Preventive Care requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of preventive care"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with preventive care. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for preventive care."
      }
    ]
  },
  "risk-stratification-np": {
    title: "Risk Stratification",
    cellular: {
      title: "Pathophysiology of Risk Stratification",
      content: "Risk Stratification involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Risk Stratification pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for risk stratification",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for risk stratification",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for risk stratification",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of risk stratification",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to risk stratification",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of risk stratification",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for risk stratification. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Risk Stratification requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of risk stratification"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with risk stratification. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for risk stratification."
      }
    ]
  },
  "shared-decision-making-np": {
    title: "Shared Decision-Making",
    cellular: {
      title: "Pathophysiology of Shared Decision-Making",
      content: "AKI KDIGO staging: Stage 1 (Cr 1.5-1.9x baseline or >=0.3 increase in 48h), Stage 2 (2-2.9x), Stage 3 (>=3x or Cr >4.0 or dialysis initiation). Prerenal (60-70%): decreased perfusion (FENa <1%, BUN:Cr >20:1). Intrinsic (25-30%): ATN (muddy brown casts, FENa >2%), GN (RBC casts), AIN (eosinophils, WBC casts). Postrenal (5-10%): obstruction (hydronephrosis on ultrasound)."
    },
    riskFactors: [
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Recurrent UTIs or urinary tract obstruction",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)"
    ],
    diagnostics: [
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "CBC for anemia of CKD evaluation"
    ],
    management: [
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Shared Decision-Making management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with shared decision-making has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "documentation-standards-np": {
    title: "Documentation Standards",
    cellular: {
      title: "Pathophysiology of Documentation Standards",
      content: "Documentation Standards involves alterations in airway structure, gas exchange, or pulmonary vascular function. Documentation Standards pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Immunocompromised state increasing pneumonia susceptibility",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Indoor air pollution and biomass fuel exposure",
      "GERD with chronic microaspiration",
      "Age >65 with declining mucociliary clearance",
      "Cystic fibrosis genotype (CFTR mutations)",
      "Environmental allergen sensitization (dust mites, mold, pollen)"
    ],
    diagnostics: [
      "Sputum culture, Gram stain, and AFB stain",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Peak expiratory flow rate monitoring for asthma",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Bronchoscopy with BAL for diagnostic sampling"
    ],
    management: [
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Annual influenza and pneumococcal vaccination",
      "Chest tube placement for pneumothorax or empyema drainage"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Documentation Standards management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with documentation standards develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for documentation standards."
      }
    ]
  },
  "scope-of-practice-np": {
    title: "Scope of Practice",
    cellular: {
      title: "Pathophysiology of Scope of Practice",
      content: "Scope of Practice encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Scope of Practice requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for scope of practice per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Scope of Practice requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Scope of Practice management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with scope of practice. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of scope of practice."
      }
    ]
  },
  "ethics-practice-np": {
    title: "Ethics",
    cellular: {
      title: "Pathophysiology of Ethics",
      content: "Ethics encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Ethics requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for ethics per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Ethics requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Ethics management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with ethics. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of ethics."
      }
    ]
  },
  "np-advanced-legal-and-regulatory-practice-np": {
    title: "Advanced Legal and Regulatory Practice",
    cellular: {
      title: "Pathophysiology of Advanced Legal and Regulatory Practice",
      content: "Advanced Legal and Regulatory Practice encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Advanced Legal and Regulatory Practice requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for advanced legal and regulatory practice per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Advanced Legal and Regulatory Practice requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Advanced Legal and Regulatory Practice management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with advanced legal and regulatory practice. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of advanced legal and regulatory practice."
      }
    ]
  },
  "np-delegation-and-interprofessional-authority-np": {
    title: "Delegation and Interprofessional Authority",
    cellular: {
      title: "Pathophysiology of Delegation and Interprofessional Authority",
      content: "Delegation and Interprofessional Authority encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Delegation and Interprofessional Authority requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for delegation and interprofessional authority per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Delegation and Interprofessional Authority requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Delegation and Interprofessional Authority management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with delegation and interprofessional authority. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of delegation and interprofessional authority."
      }
    ]
  },
  "advanced-heent-diagnostics-and-management-np-np": {
    title: "Advanced HEENT Diagnostics and Management",
    cellular: {
      title: "Pathophysiology of Advanced HEENT Diagnostics and Management",
      content: "Advanced HEENT Diagnostics and Management involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to advanced heent diagnostics and management."
    },
    riskFactors: [
      "Chronic liver disease with impaired immune function",
      "Chronic skin breakdown or wounds",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)"
    ],
    diagnostics: [
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Chest X-ray for pneumonia evaluation",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "CRP and ESR for inflammatory response quantification"
    ],
    management: [
      "Infectious disease consultation for complex or resistant infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Advanced HEENT Diagnostics and Management management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected advanced heent diagnostics and management has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "advanced-practice-procedures-np-np": {
    title: "Advanced Practice Procedures",
    cellular: {
      title: "Pathophysiology of Advanced Practice Procedures",
      content: "Advanced Practice Procedures encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Advanced Practice Procedures requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for advanced practice procedures per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Advanced Practice Procedures requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Advanced Practice Procedures management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with advanced practice procedures. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of advanced practice procedures."
      }
    ]
  },
  "comprehensive-history-and-physical-advanced-np": {
    title: "Comprehensive History and Physical",
    cellular: {
      title: "Pathophysiology of Comprehensive History and Physical",
      content: "Comprehensive History and Physical involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Comprehensive History and Physical pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for comprehensive history and physical",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for comprehensive history and physical",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for comprehensive history and physical",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of comprehensive history and physical",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to comprehensive history and physical",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of comprehensive history and physical",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for comprehensive history and physical. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Comprehensive History and Physical requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of comprehensive history and physical"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with comprehensive history and physical. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for comprehensive history and physical."
      }
    ]
  },
  "cystic-fibrosis-adult-management-np-np": {
    title: "Cystic Fibrosis Adult Management",
    cellular: {
      title: "Pathophysiology of Cystic Fibrosis Adult Management",
      content: "Cystic Fibrosis Adult Management involves alterations in airway structure, gas exchange, or pulmonary vascular function. Cystic Fibrosis Adult Management pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Indoor air pollution and biomass fuel exposure",
      "Prematurity with bronchopulmonary dysplasia history",
      "Connective tissue disease with ILD predisposition",
      "Obesity with restrictive physiology and OSA",
      "Family history of alpha-1 antitrypsin deficiency",
      "Age >65 with declining mucociliary clearance",
      "Childhood asthma with persistent airway hyperreactivity"
    ],
    diagnostics: [
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "6-minute walk test for functional capacity assessment",
      "Pulse oximetry and continuous SpO2 monitoring",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Peak expiratory flow rate monitoring for asthma",
      "CT pulmonary angiography for PE evaluation"
    ],
    management: [
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Inhaler technique assessment and spacer use education",
      "Step-up/step-down approach based on asthma control assessment",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Cystic Fibrosis Adult Management management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with cystic fibrosis adult management develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for cystic fibrosis adult management."
      }
    ]
  },
  "differential-diagnosis-formulation-advanced-np": {
    title: "Differential Diagnosis Formulation",
    cellular: {
      title: "Pathophysiology of Differential Diagnosis Formulation",
      content: "Differential Diagnosis Formulation involves systematic clinical evaluation skills essential for NP practice. Differential Diagnosis Formulation requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for differential diagnosis formulation per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Differential Diagnosis Formulation requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Differential Diagnosis Formulation management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with differential diagnosis formulation. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of differential diagnosis formulation."
      }
    ]
  },
  "long-qt-syndrome-np-np": {
    title: "Long QT Syndrome",
    cellular: {
      title: "Pathophysiology of Long QT Syndrome",
      content: "Long QT Syndrome involves specific alterations in long qt syndrome physiology. The pathophysiology of Long QT Syndrome encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of long qt syndrome."
    },
    riskFactors: [
      "Family history of premature CVD (<55 males, <65 females)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Peripheral artery disease (ABI <0.9)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Age >65 with cardiovascular degeneration",
      "Sedentary lifestyle with deconditioning",
      "History of preeclampsia or gestational hypertension"
    ],
    diagnostics: [
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "HbA1c for glycemic control assessment in diabetic patients"
    ],
    management: [
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of long qt syndrome has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "lumbar-puncture-and-csf-analysis-np": {
    title: "Lumbar Puncture & CSF Analysis",
    cellular: {
      title: "Pathophysiology of Lumbar Puncture & CSF Analysis",
      content: "Lumbar Puncture & CSF Analysis involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Lumbar Puncture & CSF Analysis pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for lumbar puncture & csf analysis",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for lumbar puncture & csf analysis",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for lumbar puncture & csf analysis",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of lumbar puncture & csf analysis",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to lumbar puncture & csf analysis",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of lumbar puncture & csf analysis",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for lumbar puncture & csf analysis. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Lumbar Puncture & CSF Analysis requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of lumbar puncture & csf analysis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with lumbar puncture & csf analysis. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for lumbar puncture & csf analysis."
      }
    ]
  },
  "marfan-syndrome-np-np": {
    title: "Marfan Syndrome",
    cellular: {
      title: "Pathophysiology of Marfan Syndrome",
      content: "Marfan syndrome is autosomal dominant connective tissue disorder from FBN1 (fibrillin-1) gene mutations on chromosome 15. Ghent nosology for diagnosis. Clinical features: skeletal (tall stature, arachnodactyly, pectus, scoliosis), ocular (lens subluxation upward, myopia, retinal detachment), cardiovascular (aortic root dilation, MVP, aortic dissection). Aortic root monitoring with annual echo. Beta-blockers or ARBs to reduce aortic wall stress. Prophylactic aortic root replacement when diameter reaches 5.0cm (or 4.5cm with risk factors). Avoid contact sports, isometric exercise."
    },
    riskFactors: [
      "Condition-specific predisposing factors for marfan syndrome",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for marfan syndrome",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for marfan syndrome",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of marfan syndrome",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to marfan syndrome",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of marfan syndrome",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for marfan syndrome. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Marfan Syndrome requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of marfan syndrome"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with marfan syndrome. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for marfan syndrome."
      }
    ]
  },
  "mechanical-ventilation-management-np": {
    title: "Mechanical Ventilation Management",
    cellular: {
      title: "Pathophysiology of Mechanical Ventilation Management",
      content: "Mechanical Ventilation Management involves alterations in airway structure, gas exchange, or pulmonary vascular function. Mechanical Ventilation Management pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Prematurity with bronchopulmonary dysplasia history",
      "Age >65 with declining mucociliary clearance",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Current or former tobacco use (pack-year calculation)",
      "Connective tissue disease with ILD predisposition",
      "Indoor air pollution and biomass fuel exposure",
      "Radiation therapy to chest"
    ],
    diagnostics: [
      "Thoracentesis with Light criteria for pleural effusion classification",
      "Peak expiratory flow rate monitoring for asthma",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "6-minute walk test for functional capacity assessment",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Methacholine challenge for suspected asthma with normal spirometry"
    ],
    management: [
      "Inhaler technique assessment and spacer use education",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Step-up/step-down approach based on asthma control assessment",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Mechanical Ventilation Management management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with mechanical ventilation management develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for mechanical ventilation management."
      }
    ]
  },
  "meckels-diverticulum-advanced-np-np": {
    title: "Meckel's Diverticulum",
    cellular: {
      title: "Pathophysiology of Meckel's Diverticulum",
      content: "Meckel's Diverticulum involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Meckel's Diverticulum pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Age >65 with declining mucosal defenses",
      "Chronic constipation with diverticular disease risk",
      "Chronic PPI use >8 weeks without reassessment",
      "Immunosuppression increasing infectious GI complications",
      "H. pylori infection (most common cause of PUD worldwide)",
      "IBD family history (10-25% have affected first-degree relative)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)"
    ],
    diagnostics: [
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "EGD with biopsy for upper GI pathology evaluation",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "Colonoscopy with polypectomy for lower GI assessment"
    ],
    management: [
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Bowel rest with IV fluids for acute pancreatitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to meckel's diverticulum)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Meckel's Diverticulum evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of meckel's diverticulum"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with meckel's diverticulum. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for meckel's diverticulum."
      }
    ]
  },
  "meconium-ileus-np-advanced-pathophysiology-np": {
    title: "Meconium Ileus",
    cellular: {
      title: "Pathophysiology of Meconium Ileus",
      content: "Meconium Ileus involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Meconium Ileus pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Prior abdominal surgery with adhesion formation",
      "Tobacco use (impairs mucosal healing)",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "High-fat diet with cholelithiasis predisposition",
      "Chronic liver disease with portal hypertension",
      "Diabetes with gastroparesis and motility dysfunction"
    ],
    diagnostics: [
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Anti-tTG IgA with total IgA for celiac disease screening"
    ],
    management: [
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Cholecystectomy for symptomatic cholelithiasis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to meconium ileus)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Meconium Ileus evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of meconium ileus"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with meconium ileus. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for meconium ileus."
      }
    ]
  },
  "menopause-and-hormone-therapy-np": {
    title: "Menopause and Hormone Therapy",
    cellular: {
      title: "Pathophysiology of Menopause and Hormone Therapy",
      content: "Menopause and Hormone Therapy involves reproductive, obstetric, or gynecologic pathophysiology specific to menopause and hormone therapy."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for menopause and hormone therapy",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Menopause and Hormone Therapy management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with menopause and hormone therapy. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for menopause and hormone therapy."
      }
    ]
  },
  "nas-opioid-withdrawal-scoring-np": {
    title: "NAS: Opioid Withdrawal Scoring",
    cellular: {
      title: "Pathophysiology of NAS",
      content: "NAS: Opioid Withdrawal Scoring involves systematic clinical evaluation skills essential for NP practice. NAS requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for nas per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "NAS requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "NAS management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with nas. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of nas."
      }
    ]
  },
  "non-invasive-ventilation-modes-np-np": {
    title: "Non-Invasive Ventilation Modes",
    cellular: {
      title: "Pathophysiology of Non-Invasive Ventilation Modes",
      content: "Non-Invasive Ventilation Modes involves alterations in airway structure, gas exchange, or pulmonary vascular function. Non-Invasive Ventilation Modes pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Childhood asthma with persistent airway hyperreactivity",
      "Radiation therapy to chest",
      "Current or former tobacco use (pack-year calculation)",
      "Age >65 with declining mucociliary clearance",
      "Obesity with restrictive physiology and OSA",
      "GERD with chronic microaspiration",
      "Immunocompromised state increasing pneumonia susceptibility"
    ],
    diagnostics: [
      "CT pulmonary angiography for PE evaluation",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "Peak expiratory flow rate monitoring for asthma",
      "Pulse oximetry and continuous SpO2 monitoring",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Sputum culture, Gram stain, and AFB stain"
    ],
    management: [
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      },
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Non-Invasive Ventilation Modes management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with non-invasive ventilation modes develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for non-invasive ventilation modes."
      }
    ]
  }
};
