import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency8Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 52-year-old male presents with acute onset of complete right-sided weakness and global aphasia. He was last seen well 2 hours ago. CT head shows early ischemic changes in the left MCA territory. Door-to-CT time was 12 minutes. What is the target door-to-needle time for IV alteplase administration?",
    options: [
      "60 minutes or less from ED arrival to alteplase bolus administration",
      "90 minutes or less from ED arrival",
      "30 minutes or less from ED arrival",
      "120 minutes or less from symptom onset"
    ],
    correctAnswer: 0,
    rationaleLong: "The AHA/ASA target for door-to-needle time (DTN) - the interval from ED arrival to the start of IV alteplase administration - is 60 minutes or less. This benchmark was established because every minute of delay in treatment results in approximately 1.9 million neurons lost, and earlier treatment is associated with better functional outcomes and lower mortality. Studies have shown that DTN times under 60 minutes are associated with significantly improved outcomes compared to longer times. Achieving this target requires a streamlined stroke protocol with several key components: (1) Pre-notification by EMS with stroke team activation, (2) Immediate triage and assessment (2-5 minutes), (3) Rapid CT imaging (CT within 25 minutes of arrival), (4) Prompt CT interpretation (within 45 minutes of arrival), (5) Lab results (particularly glucose) available rapidly (point-of-care testing preferred), (6) Neurological assessment and NIHSS scoring concurrent with other evaluations, (7) Alteplase mixing and preparation concurrent with CT review, (8) Informed consent (often streamlined or waived in emergent situations per institutional policy). The emergency nurse plays critical roles in this process: rapid IV access and blood draws during transport to CT, weight measurement for alteplase dosing (0.9 mg/kg), point-of-care glucose testing, blood pressure management to achieve <185/110 mmHg, and having alteplase prepared and ready for immediate administration. Many centers now aim for DTN times under 45 minutes. The 30-minute target is aspirational and not the current standard benchmark. The 90 and 120-minute times are too slow and associated with worse outcomes.",
    learningObjective: "Identify the 60-minute door-to-needle target for IV alteplase and the nurse's role in achieving it",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 1,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Door-to-needle target: ≤60 minutes; every minute of delay = 1.9 million neurons lost",
    clinicalPearls: [
      "DTN target: ≤60 minutes (many centers aim for <45 minutes)",
      "CT should be completed within 25 minutes of ED arrival",
      "Use point-of-care glucose testing to avoid lab delays",
      "Start alteplase preparation concurrent with CT review"
    ],
    safetyNote: "The only lab result needed BEFORE alteplase is blood glucose - do not delay for other labs unless clinically indicated",
    distractorRationales: [
      "60-minute DTN is the established AHA/ASA benchmark",
      "90 minutes exceeds the target and is associated with worse outcomes",
      "30 minutes is aspirational but not the current standard benchmark",
      "120 minutes from symptom onset is not the correct metric for DTN"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 65-year-old male presents with sudden onset of bilateral leg weakness, urinary retention, and saddle anesthesia developing over 12 hours. He has a history of lumbar disc disease. MRI shows a large central disc herniation at L4-L5 compressing the cauda equina. What constitutes cauda equina syndrome and what is the surgical urgency?",
    options: [
      "Compression of the cauda equina nerve roots causing bilateral leg weakness, saddle anesthesia, and bladder dysfunction - requires decompressive surgery within 24-48 hours for best outcomes",
      "Compression of the spinal cord requiring surgery within 6 hours",
      "Peripheral nerve injury that can be managed conservatively with physical therapy",
      "Sciatic nerve compression requiring epidural steroid injection"
    ],
    correctAnswer: 0,
    rationaleLong: "Cauda equina syndrome (CES) is a surgical emergency caused by compression of the cauda equina nerve roots (the bundle of nerve roots extending below the conus medullaris, typically at L1-L2 level). The cauda equina contains the lumbosacral nerve roots (L2-S5) that innervate the lower extremities, perineum, bladder, and bowel. CES is characterized by the clinical triad of: (1) Bilateral lower extremity weakness and/or radiculopathy (variable severity), (2) Saddle anesthesia (sensory loss in the perineum, buttocks, and inner thighs - the dermatomes innervated by S2-S5), (3) Bladder and bowel dysfunction (urinary retention is the most common bladder finding, with post-void residual >200 mL being suggestive; fecal incontinence and decreased rectal tone also occur). CES is classified as: CES-Incomplete (CESI) - urinary difficulties without retention, and CES-Retention (CESR) - painless urinary retention with overflow incontinence. The most common cause is large central lumbar disc herniation (as in this case), but other causes include spinal stenosis, tumor, abscess, hematoma, and trauma. The surgical urgency is debated, but current evidence suggests: decompressive laminectomy and discectomy should be performed within 24-48 hours of symptom onset for optimal outcomes. Some evidence suggests better outcomes with surgery within 24 hours, particularly for patients with CES-Incomplete who may still recover bladder function. Delays beyond 48 hours are associated with significantly worse neurological outcomes, particularly for bladder recovery. This is NOT a spinal cord injury (the cord ends at L1-L2) - it is a lower motor neuron/peripheral nerve root compression, which has better recovery potential than cord injury.",
    learningObjective: "Identify cauda equina syndrome and the 24-48 hour surgical window for optimal outcomes",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CES: saddle anesthesia + urinary retention + bilateral weakness = surgery within 24-48 hours; this is nerve roots, not spinal cord",
    clinicalPearls: [
      "CES triad: bilateral weakness + saddle anesthesia + bladder dysfunction",
      "Check post-void residual: >200 mL suggests CES-Retention",
      "Surgery within 24-48 hours for best outcomes; <24 hours ideal",
      "Cauda equina = nerve roots (LMN), not spinal cord (UMN)"
    ],
    safetyNote: "Urinary retention in CES may be painless - always check post-void residual volume in suspected cases",
    distractorRationales: [
      "CES requires decompressive surgery within 24-48 hours for optimal recovery",
      "This is cauda equina (nerve roots), not spinal cord compression",
      "Conservative management risks permanent bladder and bowel dysfunction",
      "Epidural steroids do not address nerve root compression of this severity"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A 38-year-old female presents with new-onset seizure. She has a known brain tumor and has been on dexamethasone. She also reports progressive headache and blurred vision over 2 days. MRI shows significant peritumoral vasogenic edema with 6 mm midline shift. What is the role of dexamethasone in this presentation?",
    options: [
      "Dexamethasone reduces vasogenic edema around brain tumors by restoring blood-brain barrier integrity and should be increased in dose",
      "Dexamethasone treats the tumor directly by reducing tumor cell proliferation",
      "Dexamethasone prevents seizures and can replace anticonvulsant therapy",
      "Dexamethasone reduces cytotoxic edema from acute ischemia"
    ],
    correctAnswer: 0,
    rationaleLong: "Dexamethasone is the primary pharmacological treatment for vasogenic edema associated with brain tumors. Its mechanism of action involves: (1) Restoring blood-brain barrier (BBB) integrity: Brain tumors disrupt the BBB by producing vascular endothelial growth factor (VEGF) and other permeability factors, leading to leakage of plasma proteins and water into the extracellular space (vasogenic edema). Dexamethasone reduces VEGF expression and restores tight junction integrity in the BBB endothelium. (2) Reducing cerebral edema volume: By restoring BBB function, dexamethasone reduces the accumulation of edema fluid around the tumor, decreasing mass effect and ICP. (3) Clinical improvement: Patients often show dramatic improvement within 24-48 hours of starting or increasing dexamethasone, with reduction in headache, improvement in neurological deficits, and decreased midline shift on follow-up imaging. The typical dose for significant peritumoral edema is dexamethasone 4-10 mg IV every 6 hours (higher doses for severe edema with herniation risk). In this patient with worsening symptoms despite current dexamethasone therapy, the dose should be increased. It is crucial to understand that dexamethasone is effective for vasogenic edema (tumor, abscess) but NOT for cytotoxic edema (ischemic stroke). Dexamethasone does NOT treat the tumor itself and does NOT have anticonvulsant properties - a separate antiepileptic drug (levetiracetam is preferred due to fewer drug interactions) should be prescribed for seizure management. Long-term steroid side effects (hyperglycemia, myopathy, immunosuppression, GI bleeding, osteoporosis) should be monitored.",
    learningObjective: "Understand the mechanism and role of dexamethasone in managing vasogenic edema around brain tumors",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Elevated Intracranial Pressure",
    difficulty: 3,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Dexamethasone works on VASOGENIC edema (tumors) NOT cytotoxic edema (stroke); it has NO anticonvulsant properties",
    clinicalPearls: [
      "Dexamethasone restores BBB integrity and reduces VEGF expression",
      "Effective for vasogenic edema (tumors, abscesses); NOT for cytotoxic edema (stroke)",
      "Clinical improvement typically within 24-48 hours",
      "Not an anticonvulsant - add levetiracetam separately for seizures"
    ],
    safetyNote: "Monitor blood glucose closely on dexamethasone - can cause significant steroid-induced hyperglycemia",
    distractorRationales: [
      "Dexamethasone reduces vasogenic edema by restoring BBB integrity",
      "It does not treat the tumor directly or reduce tumor cell proliferation",
      "It has no anticonvulsant properties and cannot replace seizure medications",
      "It is ineffective for cytotoxic edema from ischemia"
    ],
    lessonLink: "/emergency/lessons/elevated-intracranial-pressure"
  },
  {
    stem: "A 30-year-old female with systemic lupus erythematosus presents with headache, seizures, and confusion. MRI shows bilateral thalamic hyperintensities. CT venography reveals deep cerebral venous thrombosis involving the straight sinus and vein of Galen. What makes deep CVST different from superficial CVST in terms of presentation and prognosis?",
    options: [
      "Deep CVST causes bilateral thalamic infarction with worse prognosis, higher rates of coma and mortality compared to superficial CVST",
      "Deep CVST has better prognosis because the deep veins have more collateral drainage",
      "Deep CVST presents identically to superficial CVST with no clinical differences",
      "Deep CVST does not require anticoagulation unlike superficial CVST"
    ],
    correctAnswer: 0,
    rationaleLong: "Deep cerebral venous sinus thrombosis (deep CVST) involving the straight sinus, vein of Galen, and internal cerebral veins has a significantly worse prognosis compared to superficial CVST (superior sagittal sinus, transverse sinus, sigmoid sinus). The key differences are: (1) Bilateral thalamic involvement: The internal cerebral veins and vein of Galen drain the deep brain structures, particularly the bilateral thalami and deep white matter. Thrombosis of these veins causes bilateral thalamic venous infarction, which produces a characteristic clinical presentation of: altered consciousness progressing rapidly to coma (thalami are critical components of the ascending reticular activating system), bilateral neurological deficits, seizures, and often devastating outcomes. (2) Limited collateral drainage: Unlike the superficial venous system which has extensive collateral pathways, the deep venous system has fewer collateral routes, making it more vulnerable to the consequences of thrombosis. (3) Higher mortality and morbidity: Deep CVST mortality is approximately 30-50% compared to 5-15% for superficial CVST. Survivors often have significant neurological sequelae. (4) MRI findings: Bilateral thalamic T2 hyperintensity is characteristic and should immediately raise suspicion for deep venous thrombosis. (5) CT venography or MR venography confirms the diagnosis by demonstrating absence of flow in the deep venous structures. Treatment is the same as superficial CVST: therapeutic anticoagulation with IV heparin, even in the presence of hemorrhagic venous infarction. Decompressive surgery may be considered for large hemorrhages with herniation. SLE is a known risk factor for CVST due to the prothrombotic state associated with antiphospholipid antibodies.",
    learningObjective: "Differentiate deep from superficial CVST and recognize bilateral thalamic infarction as a hallmark of deep CVST",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cerebral Venous Thrombosis",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Bilateral thalamic lesions on MRI = think deep CVST (straight sinus/vein of Galen); worse prognosis than superficial CVST",
    clinicalPearls: [
      "Deep CVST: bilateral thalamic infarction from internal cerebral vein thrombosis",
      "Deep CVST mortality 30-50% vs 5-15% for superficial CVST",
      "Thalamic involvement causes rapid consciousness decline to coma",
      "Treatment remains anticoagulation despite hemorrhagic infarction"
    ],
    safetyNote: "Bilateral thalamic lesions on MRI should prompt urgent CT/MR venography to rule out deep CVST",
    distractorRationales: [
      "Deep CVST causes bilateral thalamic infarction with significantly worse outcomes",
      "Deep veins have FEWER collateral pathways, not more",
      "Deep CVST has a distinct clinical presentation and worse prognosis",
      "Deep CVST requires the same anticoagulation treatment as superficial CVST"
    ],
    lessonLink: "/emergency/lessons/cerebral-venous-thrombosis"
  },
  {
    stem: "A 60-year-old male presents with sudden onset of unilateral facial pain and ipsilateral Horner syndrome (ptosis, miosis, anhidrosis) after chiropractic neck manipulation. CTA shows a vertebral artery dissection. What is the mechanism and appropriate initial treatment?",
    options: [
      "Intimal tear from mechanical trauma causing dissection with intramural hematoma - initial treatment is anticoagulation or antiplatelet therapy",
      "Atherosclerotic plaque rupture - initial treatment is dual antiplatelet therapy and statin",
      "Vasospasm from manipulation - initial treatment is calcium channel blockers",
      "Vertebral artery aneurysm - initial treatment is endovascular coiling"
    ],
    correctAnswer: 0,
    rationaleLong: "Vertebral artery dissection (VAD) after cervical manipulation (chiropractic, osteopathic) results from mechanical trauma to the vertebral artery as it traverses the transverse foramina of the cervical vertebrae. The mechanism involves: (1) The rotational and extensional forces applied during manipulation cause an intimal tear in the vertebral artery wall, (2) Blood enters the intimal tear and dissects into the media, creating an intramural hematoma, (3) The hematoma can narrow or occlude the arterial lumen (causing ischemic stroke), or can rupture through the adventitia causing subarachnoid hemorrhage (if the dissection is intracranial). The ipsilateral Horner syndrome occurs because the sympathetic plexus travels along the vertebral and internal carotid arteries - the intramural hematoma compresses these sympathetic fibers. The facial pain is caused by the dissection itself irritating the arterial wall and surrounding structures. The initial treatment is antithrombotic therapy to prevent thrombus formation on the exposed subintimal surface and subsequent embolization. Two main options exist: (1) Anticoagulation with IV heparin transitioning to warfarin (INR 2-3) for 3-6 months, or (2) Antiplatelet therapy (aspirin or clopidogrel). The CADISS trial (2015) showed no significant difference between anticoagulation and antiplatelet therapy for cervical artery dissection, and current guidelines consider either acceptable as initial treatment. Endovascular stenting is reserved for cases with hemodynamic failure despite medical therapy or progressive neurological deficits. Most dissections heal spontaneously within 3-6 months with medical therapy alone.",
    learningObjective: "Recognize vertebral artery dissection from cervical manipulation and initiate appropriate antithrombotic therapy",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cerebrovascular Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Horner syndrome + neck pain after manipulation = arterial dissection; CADISS trial: anticoagulation ≈ antiplatelet therapy",
    clinicalPearls: [
      "Vertebral artery traverses transverse foramina - vulnerable to rotational forces",
      "Horner syndrome from sympathetic plexus compression by intramural hematoma",
      "CADISS trial: anticoagulation and antiplatelet therapy equally effective",
      "Most dissections heal spontaneously within 3-6 months"
    ],
    safetyNote: "Young stroke patients should be evaluated for cervical artery dissection - ask about recent neck trauma or manipulation",
    distractorRationales: [
      "Intimal tear with dissection is the correct mechanism requiring antithrombotic therapy",
      "This is not atherosclerotic disease but traumatic dissection",
      "Vasospasm does not explain the imaging findings or clinical course",
      "This is a dissection with intramural hematoma, not an aneurysm"
    ],
    lessonLink: "/emergency/lessons/cerebrovascular-emergencies"
  },
  {
    stem: "A 48-year-old male presents with acute confusion and agitation. His wife reports he was recently prescribed a new antidepressant (sertraline) in addition to his existing tramadol prescription. He has temperature 39.5°C, heart rate 120, BP 160/95, clonus, hyperreflexia, mydriasis, and diaphoresis. What is the diagnosis?",
    options: [
      "Serotonin syndrome from the combination of sertraline and tramadol - both increase serotonergic activity",
      "Neuroleptic malignant syndrome from antipsychotic exposure",
      "Sympathomimetic toxidrome from stimulant use",
      "Anticholinergic toxidrome from medication interaction"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with serotonin syndrome (SS), a potentially life-threatening condition caused by excessive serotonergic activity in the central and peripheral nervous systems. The diagnosis is clinical, based on the Hunter Serotonin Toxicity Criteria: in the presence of a serotonergic agent, the patient must have ONE of: (1) spontaneous clonus, (2) inducible clonus PLUS agitation or diaphoresis, (3) ocular clonus PLUS agitation or diaphoresis, (4) tremor PLUS hyperreflexia, (5) hypertonia PLUS temperature >38°C PLUS ocular or inducible clonus. This patient meets criteria with clonus, hyperreflexia, agitation, diaphoresis, and hyperthermia. The precipitating drug combination is sertraline (an SSRI - selective serotonin reuptake inhibitor) plus tramadol (which has serotonin reuptake inhibition properties in addition to its opioid effects). Other common serotonergic drug combinations causing SS include: SSRIs + MAOIs (most dangerous), SSRIs + triptans, SSRIs + linezolid, SSRIs + St. John's Wort, and SSRIs + dextromethorphan. Key distinguishing features from NMS include: SS has clonus and hyperreflexia (NMS has rigidity and bradyreflexia), SS develops rapidly within hours of drug change (NMS develops over days), SS has mydriasis (NMS has normal pupils), and SS has hyperactive bowel sounds (NMS has decreased bowel sounds). Treatment includes: (1) Discontinue ALL serotonergic agents, (2) Cyproheptadine 12 mg PO/NG initial dose (a serotonin antagonist), then 2 mg every 2 hours as needed, (3) Active cooling for hyperthermia, (4) IV benzodiazepines for agitation and to reduce muscle hyperactivity, (5) Avoid antipyretics (hyperthermia is from muscle hyperactivity, not hypothalamic), (6) ICU admission for severe cases.",
    learningObjective: "Diagnose serotonin syndrome and differentiate it from neuroleptic malignant syndrome based on clinical features",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Drug-Induced Neurological Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "SS: clonus + hyperreflexia + mydriasis + rapid onset; NMS: rigidity + bradyreflexia + normal pupils + slow onset",
    clinicalPearls: [
      "Serotonin syndrome: clonus is the KEY distinguishing feature",
      "SS develops within hours; NMS develops over days",
      "Cyproheptadine 12 mg PO/NG is the specific antidote for SS",
      "Tramadol has serotonergic properties often overlooked in drug interaction screening"
    ],
    safetyNote: "SSRI + tramadol is a commonly missed serotonergic drug combination - always screen for interactions",
    distractorRationales: [
      "Serotonin syndrome from sertraline + tramadol combination",
      "NMS has rigidity and bradyreflexia, not clonus and hyperreflexia",
      "Sympathomimetic toxidrome lacks clonus and hyperreflexia",
      "Anticholinergic toxidrome has dry skin and decreased bowel sounds, not diaphoresis"
    ],
    lessonLink: "/emergency/lessons/drug-induced-neurological-emergencies"
  },
  {
    stem: "A 72-year-old female presents with acute onset of left facial droop and left arm weakness. CT head shows a right thalamic hemorrhage measuring 2 cm with intraventricular hemorrhage (IVH) extension. She is on dabigatran for atrial fibrillation. What specific reversal agent should be administered?",
    options: [
      "IV idarucizumab (Praxbind) 5 grams given as two consecutive 2.5 g IV infusions",
      "IV andexanet alfa (Andexxa) as a factor Xa decoy",
      "4-factor prothrombin complex concentrate 50 units/kg",
      "IV vitamin K 10 mg for sustained clotting factor production"
    ],
    correctAnswer: 0,
    rationaleLong: "Idarucizumab (Praxbind) is the specific FDA-approved reversal agent for dabigatran (Pradaxa), a direct thrombin inhibitor. This patient with a thalamic ICH with IVH on dabigatran requires immediate reversal to minimize hematoma expansion. Idarucizumab is a humanized monoclonal antibody fragment (Fab) that binds free and thrombin-bound dabigatran with an affinity approximately 350 times greater than dabigatran's affinity for thrombin. This effectively neutralizes dabigatran's anticoagulant effect within minutes. The dose is 5 grams total, administered as two consecutive 2.5 gram IV infusions (each over 5-10 minutes) or as a bolus injection. Key points about idarucizumab: (1) Complete reversal of dabigatran effect occurs within minutes and lasts at least 24 hours, (2) It does NOT reverse other anticoagulants - it is specific to dabigatran only, (3) No dose adjustment needed for renal or hepatic impairment, (4) The RE-VERSE AD trial showed 100% reversal of dabigatran anticoagulant effect in minutes. Andexanet alfa is the reversal agent for factor Xa inhibitors (apixaban, rivaroxaban), NOT for dabigatran. 4-factor PCC may be used as an alternative if idarucizumab is unavailable, but it is less effective and not FDA-approved for dabigatran reversal. Vitamin K reverses warfarin (a vitamin K antagonist) and has no role in reversing direct oral anticoagulants. The thalamic location of this hemorrhage carries additional significance: the thalamus is adjacent to the third ventricle, making IVH extension common. IVH is associated with worse outcomes and may require EVD placement if obstructive hydrocephalus develops.",
    learningObjective: "Administer idarucizumab as the specific reversal agent for dabigatran-associated intracranial hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Intracerebral Hemorrhage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Dabigatran → idarucizumab; Apixaban/rivaroxaban → andexanet alfa; Warfarin → PCC + vitamin K",
    clinicalPearls: [
      "Idarucizumab: 5 g IV (two 2.5 g doses) reverses dabigatran within minutes",
      "Binds dabigatran with 350x greater affinity than thrombin",
      "RE-VERSE AD trial: 100% reversal of anticoagulant effect",
      "Thalamic hemorrhage commonly extends into ventricles (IVH)"
    ],
    safetyNote: "Idarucizumab should be immediately available in all EDs - dabigatran ICH is a time-critical emergency",
    distractorRationales: [
      "Idarucizumab is the specific reversal agent for dabigatran",
      "Andexanet alfa reverses factor Xa inhibitors, not dabigatran",
      "4-factor PCC is an alternative but less effective and not FDA-approved for dabigatran",
      "Vitamin K reverses warfarin only and has no effect on DOACs"
    ],
    lessonLink: "/emergency/lessons/intracerebral-hemorrhage"
  },
  {
    stem: "A 25-year-old male presents with severe headache after a sports injury. He initially had loss of consciousness for 30 seconds, appeared to recover completely (lucid interval of 2 hours), then rapidly deteriorated with decreasing consciousness and ipsilateral pupil dilation. CT head shows a biconvex lens-shaped hyperdense extra-axial collection. What type of hemorrhage is this?",
    options: [
      "Epidural hematoma (EDH) from middle meningeal artery rupture - the lucid interval and lens-shaped morphology are classic",
      "Subdural hematoma from bridging vein rupture",
      "Subarachnoid hemorrhage from aneurysm rupture",
      "Intraparenchymal hemorrhage from hypertension"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for epidural hematoma (EDH), which is characterized by: (1) The lucid interval: A period of apparent clinical improvement after initial loss of consciousness, followed by rapid neurological deterioration. This occurs because the initial impact causes brief concussion (LOC), the patient recovers as the concussion resolves, but the middle meningeal artery continues to bleed into the epidural space. As the hematoma volume increases and exceeds the brain's compensatory capacity, ICP rises rapidly, causing deterioration. The lucid interval is present in approximately 20-30% of EDH cases. (2) CT appearance: Biconvex (lens-shaped or lenticular) hyperdense collection that does NOT cross suture lines (because the dura is firmly attached to the skull at suture lines, limiting the spread of epidural blood). This contrasts with subdural hematoma, which is crescent-shaped and crosses suture lines. (3) Etiology: 85% of EDH cases are caused by rupture of the middle meningeal artery due to temporal bone fracture. The arterial pressure source explains the rapid accumulation and clinical deterioration. (4) Ipsilateral pupil dilation: Indicates uncal herniation from mass effect compressing CN III on the same side as the hematoma. This is one of the most surgically curable neurosurgical emergencies - craniotomy for hematoma evacuation and middle meningeal artery ligation can be lifesaving with excellent neurological outcomes if performed before irreversible brainstem damage occurs. Mortality with timely surgery is 5-10%, but without surgery in the presence of herniation, it approaches 100%.",
    learningObjective: "Recognize the classic presentation and CT appearance of epidural hematoma and understand the lucid interval phenomenon",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Lucid interval + biconvex/lens-shaped CT + doesn't cross sutures = EDH (middle meningeal artery); crescent + crosses sutures = SDH",
    clinicalPearls: [
      "EDH: biconvex (lens), doesn't cross sutures, arterial (MMA)",
      "SDH: crescent-shaped, crosses sutures, venous (bridging veins)",
      "Lucid interval present in ~20-30% of EDH cases",
      "Most surgically curable neurosurgical emergency with excellent outcomes"
    ],
    safetyNote: "A patient with TBI who 'recovers' may have an EDH with a lucid interval - monitor closely for delayed deterioration",
    distractorRationales: [
      "EDH: lucid interval + biconvex + temporal fracture + MMA rupture",
      "SDH is crescent-shaped from bridging vein rupture, crosses sutures",
      "SAH from aneurysm presents with thunderclap headache, not trauma with lucid interval",
      "Intraparenchymal hemorrhage is within the brain tissue, not extra-axial"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 55-year-old male with chronic liver disease presents with progressive confusion, asterixis, and fetor hepaticus over 3 days. Serum ammonia is 185 μmol/L (normal <35). CT head is normal. What is the initial treatment?",
    options: [
      "Oral lactulose 30 mL every 1-2 hours until bowel movement, then titrated to 2-3 soft stools daily, PLUS IV rifaximin consideration",
      "IV mannitol for cerebral edema reduction",
      "Emergent hemodialysis for ammonia removal",
      "IV dexamethasone for brain edema"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with hepatic encephalopathy (HE), a neuropsychiatric complication of liver disease caused primarily by hyperammonemia. The clinical features are characteristic: progressive confusion (ranging from mild disorientation to coma, graded by the West Haven criteria from Grade I to Grade IV), asterixis (flapping tremor or negative myoclonus of the hands when wrists are dorsiflexed - caused by intermittent loss of postural tone), and fetor hepaticus (a distinctive musty, sweet breath odor from dimethyl sulfide). The serum ammonia of 185 μmol/L is significantly elevated (normal <35 μmol/L). Treatment centers on reducing ammonia levels: (1) Lactulose (first-line): A non-absorbable disaccharide that works through multiple mechanisms: (a) osmotic laxative effect increases fecal nitrogen excretion, (b) bacterial metabolism of lactulose to lactic acid lowers colonic pH, converting ammonia (NH3) to ammonium (NH4+) which is non-absorbable and trapped in the colon for excretion, (c) promotes growth of non-urease-producing bacteria. The dose is 30 mL every 1-2 hours until a bowel movement occurs, then titrated to achieve 2-3 soft stools per day. (2) Rifaximin (adjunctive): A non-absorbable antibiotic that reduces ammonia-producing gut bacteria. Used in combination with lactulose for prevention of recurrence and is increasingly used in acute episodes. The nurse should also: identify and treat precipitating factors (GI bleeding, infection/SBP, constipation, dehydration, hypokalemia, excessive protein intake, medications - benzodiazepines, opioids), ensure fall precautions (encephalopathic patients are at high fall risk), monitor for aspiration (altered consciousness + vomiting), and avoid hepatotoxic medications. Mannitol is used for acute cerebral edema in fulminant hepatic failure, not chronic HE. Hemodialysis removes ammonia but is not standard for HE. Dexamethasone treats vasogenic edema, not metabolic encephalopathy.",
    learningObjective: "Initiate lactulose as first-line treatment for hepatic encephalopathy and identify precipitating factors",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Metabolic Neurological Emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "HE treatment: lactulose to 2-3 stools/day + rifaximin + identify precipitants (GI bleed, infection, constipation)",
    clinicalPearls: [
      "Lactulose lowers colonic pH, trapping ammonia as non-absorbable ammonium",
      "Target 2-3 soft stools per day with lactulose titration",
      "Identify precipitants: GI bleeding, SBP, constipation, hypokalemia",
      "West Haven criteria: Grade I (mild confusion) to Grade IV (coma)"
    ],
    safetyNote: "Hepatic encephalopathy patients are at high aspiration and fall risk - implement appropriate precautions",
    distractorRationales: [
      "Lactulose is the established first-line treatment for hepatic encephalopathy",
      "Mannitol is for acute cerebral edema in fulminant hepatic failure, not chronic HE",
      "Hemodialysis is not standard treatment for hepatic encephalopathy",
      "Dexamethasone treats vasogenic edema around tumors, not metabolic encephalopathy"
    ],
    lessonLink: "/emergency/lessons/metabolic-neurological-emergencies"
  },
  {
    stem: "A 42-year-old female presents with sudden onset of the worst headache of her life. CT head shows subarachnoid hemorrhage. CTA identifies a 5 mm aneurysm of the middle cerebral artery bifurcation. What are the two definitive treatment options for securing the ruptured aneurysm?",
    options: [
      "Surgical clipping (craniotomy with clip placement across the aneurysm neck) OR endovascular coiling (platinum coils deployed into the aneurysm sac via catheter)",
      "IV nimodipine alone for vasospasm prevention and observation",
      "Stereotactic radiosurgery to ablate the aneurysm",
      "External ventricular drain placement as definitive treatment"
    ],
    correctAnswer: 0,
    rationaleLong: "The two definitive treatment options for a ruptured cerebral aneurysm are: (1) Surgical clipping: A neurosurgical procedure involving craniotomy (opening the skull), microdissection to expose the aneurysm, and placement of a titanium clip across the aneurysm neck to exclude it from the circulation while preserving the parent artery. Advantages include: complete and durable exclusion of the aneurysm, ability to remove associated hematoma, and direct visualization of surrounding anatomy. Disadvantages include: more invasive, longer recovery, and higher immediate complication rate. (2) Endovascular coiling: A minimally invasive procedure performed by a neurointerventionalist in which a microcatheter is navigated through the femoral artery, up through the cerebral vasculature, and into the aneurysm sac. Platinum coils are then deployed to fill the aneurysm, promoting thrombosis within the sac and excluding it from the circulation. Advantages include: less invasive, shorter recovery, and lower immediate complication rate. Disadvantages include: higher recurrence rate (requiring follow-up angiography and potential retreatment), and some aneurysm morphologies are not suitable for coiling. The ISAT trial (2002) compared clipping vs coiling and found that endovascular coiling was associated with better outcomes at 1 year for aneurysms amenable to either treatment. However, the choice between the two depends on: aneurysm location and morphology (wide-neck aneurysms may favor clipping), patient factors, associated hematoma requiring evacuation, and institutional expertise. Regardless of the method chosen, the aneurysm should ideally be secured within 24-72 hours of rupture to prevent rebleeding (rebleeding risk is 4% in the first 24 hours, then 1-2% per day). The emergency nurse should prepare the patient for either procedure, maintain strict BP control (SBP <160 mmHg), ensure nimodipine is initiated, and provide clear explanation to the family about the treatment plan.",
    learningObjective: "Compare surgical clipping and endovascular coiling as definitive treatments for ruptured cerebral aneurysms",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 3,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Two options: surgical clipping (craniotomy) or endovascular coiling (catheter); ISAT trial favored coiling when both applicable",
    clinicalPearls: [
      "Surgical clipping: durable exclusion but more invasive",
      "Endovascular coiling: less invasive but higher recurrence rate",
      "ISAT trial: coiling had better 1-year outcomes when both options feasible",
      "Aneurysm should be secured within 24-72 hours to prevent rebleeding"
    ],
    safetyNote: "Rebleeding risk is 4% in first 24 hours - maintain SBP <160 mmHg until the aneurysm is secured",
    distractorRationales: [
      "Clipping and coiling are the two definitive options for aneurysm treatment",
      "Nimodipine prevents vasospasm but does not secure the aneurysm",
      "Stereotactic radiosurgery is not used for ruptured aneurysms",
      "EVD manages hydrocephalus but does not treat the aneurysm itself"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 58-year-old male with acute ischemic stroke is being evaluated for IV alteplase. Which of the following is an ABSOLUTE contraindication to alteplase administration?",
    options: [
      "Active internal bleeding or known intracranial neoplasm",
      "Blood glucose of 180 mg/dL",
      "History of well-controlled hypertension on medication",
      "Age greater than 80 years old"
    ],
    correctAnswer: 0,
    rationaleLong: "Absolute contraindications to IV alteplase for acute ischemic stroke represent situations where the risk of life-threatening hemorrhage clearly outweighs any potential benefit. Active internal bleeding indicates an existing hemorrhagic source that would be catastrophically worsened by the fibrinolytic effects of alteplase. Known intracranial neoplasm is contraindicated because brain tumors have abnormal vasculature (neovasculature without normal endothelial integrity) that is highly susceptible to hemorrhage, and the tumor itself may be friable. Other absolute contraindications include: evidence of intracranial hemorrhage on CT, history of intracranial hemorrhage, aortic arch dissection, active internal bleeding (excluding menses), significant head trauma or ischemic stroke in the preceding 3 months, intracranial or spinal surgery within 3 months, symptoms suggesting subarachnoid hemorrhage, known or suspected aortic dissection, and severe uncontrolled hypertension (>185/110 that cannot be reduced with treatment). Blood glucose of 180 mg/dL is not a contraindication (blood glucose <50 mg/dL is a relative contraindication because hypoglycemia can mimic stroke). Well-controlled hypertension is not a contraindication. Age >80 years is NOT an absolute contraindication - the AHA/ASA guidelines specifically state that alteplase can be given to patients >80 years within the 3-hour window. The extended window (3-4.5 hours) originally excluded patients >80 in the ECASS III trial, but subsequent data and practice have relaxed this restriction.",
    learningObjective: "Identify absolute contraindications to IV alteplase for acute ischemic stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Absolute contraindications: active bleeding, intracranial neoplasm, recent ICH/surgery; age >80 is NOT an absolute contraindication",
    clinicalPearls: [
      "Active internal bleeding and intracranial neoplasm are absolute contraindications",
      "Age >80 is NOT an absolute contraindication to alteplase",
      "Hypoglycemia (<50 mg/dL) is a relative contraindication (mimics stroke)",
      "BP must be reducible to <185/110 before alteplase administration"
    ],
    safetyNote: "Review ALL absolute and relative contraindications systematically before alteplase administration",
    distractorRationales: [
      "Active internal bleeding and intracranial neoplasm are absolute contraindications",
      "Glucose of 180 mg/dL is not a contraindication to alteplase",
      "Well-controlled hypertension is not a contraindication",
      "Age >80 years is not an absolute contraindication per current guidelines"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 65-year-old female is diagnosed with acute ischemic stroke. Neurological examination reveals she can understand commands and follow simple instructions but cannot produce any meaningful speech, only single syllables with great effort. Her speech is non-fluent. What type of aphasia does she have and where is the lesion located?",
    options: [
      "Broca's aphasia (expressive/non-fluent) - lesion in the left inferior frontal gyrus (Broca's area)",
      "Wernicke's aphasia (receptive/fluent) - lesion in the left superior temporal gyrus",
      "Global aphasia - large left hemisphere infarction affecting both language areas",
      "Conduction aphasia - lesion in the arcuate fasciculus"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient demonstrates Broca's aphasia (also called expressive, non-fluent, or motor aphasia), characterized by: (1) Non-fluent speech output: The patient speaks with great effort, producing only single words or short phrases, often with incorrect grammar (agrammatism). Speech is halting, labored, and telegraphic. (2) Preserved comprehension: The patient can understand spoken language and follow commands, indicating that the language comprehension areas (Wernicke's area) are intact. (3) Impaired repetition: Cannot accurately repeat phrases. The lesion is in Broca's area, located in the left inferior frontal gyrus (Brodmann areas 44 and 45) of the dominant hemisphere (left hemisphere in 95% of right-handed individuals). Broca's area is responsible for speech production and motor programming of speech. Because of its anterior location, Broca's aphasia is typically associated with LEFT MCA superior division occlusion and often accompanied by right hemiparesis (the motor cortex is adjacent). This contrasts with Wernicke's aphasia (fluent/receptive), where speech is fluent but meaningless (word salad, neologisms, paraphasic errors) and comprehension is severely impaired. The lesion in Wernicke's aphasia is in the left superior temporal gyrus (Wernicke's area, Brodmann area 22), supplied by the left MCA inferior division. Global aphasia involves severe impairment of both expression AND comprehension, indicating a large lesion affecting both Broca's and Wernicke's areas. Conduction aphasia has fluent speech and preserved comprehension but severely impaired repetition, with a lesion in the arcuate fasciculus connecting the two language areas.",
    learningObjective: "Classify aphasia type based on fluency, comprehension, and repetition to localize the stroke",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Broca's: non-fluent + preserved comprehension + impaired repetition = left inferior frontal gyrus (MCA superior division)",
    clinicalPearls: [
      "Broca's: non-fluent speech, preserved comprehension (anterior)",
      "Wernicke's: fluent but meaningless speech, impaired comprehension (posterior)",
      "Global: both expression and comprehension impaired (large lesion)",
      "95% of right-handed people have left hemisphere language dominance"
    ],
    safetyNote: "Aphasic patients may appear confused but may have intact cognition - communicate with patience and simple yes/no questions",
    distractorRationales: [
      "Broca's aphasia: non-fluent with preserved comprehension localizes to left frontal",
      "Wernicke's has fluent speech, which this patient does not have",
      "Global aphasia would impair both expression AND comprehension",
      "Conduction aphasia has fluent speech with impaired repetition"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  },
  {
    stem: "A 50-year-old male is brought to the ED by EMS after witnessed cardiac arrest with ROSC achieved after 22 minutes of CPR. He remains comatose (GCS 3T). What neurological prognostic tool should the emergency nurse understand will be used to predict outcomes at 72 hours post-arrest?",
    options: [
      "Multimodal prognostication including neurological examination (pupillary and corneal reflexes, motor response), EEG patterns, somatosensory evoked potentials, and serum biomarkers (neuron-specific enolase)",
      "A single CT head scan within the first 6 hours",
      "Glasgow Coma Scale score at 24 hours as the sole predictor",
      "Brain death testing within the first 24 hours"
    ],
    correctAnswer: 0,
    rationaleLong: "Neurological prognostication after cardiac arrest is one of the most consequential clinical decisions in neurocritical care. Current AHA guidelines recommend a MULTIMODAL approach to prognostication, performed NO EARLIER than 72 hours after return of spontaneous circulation (ROSC) - or 72 hours after rewarming if targeted temperature management (TTM) was performed. This delay is essential because: (1) residual effects of sedation, neuromuscular blockade, and hypothermia can confound neurological examination in the first 72 hours, (2) neurological recovery can continue for days to weeks after cardiac arrest. The multimodal approach includes: (1) Clinical neurological examination: Bilaterally absent pupillary light reflexes and corneal reflexes at ≥72 hours are the most specific predictors of poor outcome (false positive rate <1%). Motor response (GCS Motor score) of 1-2 at ≥72 hours is suggestive but less specific. (2) Electroencephalography (EEG): Persistent burst-suppression, status epilepticus, or unreactive background are associated with poor outcomes. (3) Somatosensory evoked potentials (SSEPs): Bilaterally absent N20 cortical responses are highly specific for poor outcome (false positive rate <1%). (4) Serum biomarkers: Neuron-specific enolase (NSE) >33 μg/L at 48-72 hours suggests poor outcome, though thresholds vary. (5) Neuroimaging: Brain CT showing diffuse cerebral edema or MRI showing widespread restricted diffusion indicates severe hypoxic-ischemic injury. No single test should be used in isolation - at least two concordant unfavorable predictors from different modalities are recommended before determining poor prognosis.",
    learningObjective: "Understand the multimodal approach to post-cardiac arrest neurological prognostication and the 72-hour waiting period",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Post-Cardiac Arrest Neurological Care",
    difficulty: 4,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Prognostication NOT before 72 hours post-ROSC; use multimodal approach - no single test determines outcome",
    clinicalPearls: [
      "Wait ≥72 hours (or 72h after rewarming) before prognosticating",
      "Absent pupillary/corneal reflexes at 72h = most specific poor outcome predictor",
      "Bilaterally absent N20 on SSEPs = highly specific for poor outcome",
      "At least 2 concordant unfavorable predictors from different modalities needed"
    ],
    safetyNote: "Premature prognostication leads to self-fulfilling prophecy through withdrawal of care - ALWAYS wait ≥72 hours",
    distractorRationales: [
      "Multimodal prognostication at ≥72 hours is the current standard",
      "A single CT scan is insufficient for comprehensive prognostication",
      "GCS alone at 24 hours is too early and too limited for reliable prediction",
      "Brain death testing requires specific clinical criteria and should not be performed prematurely"
    ],
    lessonLink: "/emergency/lessons/post-cardiac-arrest-neurological-care"
  },
  {
    stem: "A 35-year-old male presents with progressive bilateral hand weakness and wasting. He also has fasciculations in the upper extremities and hyperreflexia in the lower extremities. Sensation is intact. Which motor neuron disease is suggested by the combination of upper and lower motor neuron signs?",
    options: [
      "Amyotrophic lateral sclerosis (ALS) - combined upper and lower motor neuron disease with preserved sensation",
      "Multiple sclerosis - purely upper motor neuron disease",
      "Myasthenia gravis - neuromuscular junction disease with fatigable weakness",
      "Peripheral neuropathy - purely lower motor neuron disease"
    ],
    correctAnswer: 0,
    rationaleLong: "The combination of upper motor neuron (UMN) and lower motor neuron (LMN) signs in the SAME patient with PRESERVED sensation is the hallmark of amyotrophic lateral sclerosis (ALS), also known as Lou Gehrig's disease. ALS is a progressive neurodegenerative disease that affects both upper motor neurons (in the motor cortex, corticospinal tract) and lower motor neurons (in the anterior horn cells of the spinal cord and brainstem motor nuclei). The clinical findings reflect this dual pathology: LMN signs: muscle weakness, atrophy (wasting), fasciculations (visible muscle twitching from spontaneous firing of denervated motor units), and decreased reflexes in affected muscles. UMN signs: spasticity, hyperreflexia, Babinski sign (upgoing plantar response), and clonus in regions where LMN loss has not yet predominated. In this patient: bilateral hand weakness and wasting = LMN signs in upper extremities, fasciculations = LMN signs, hyperreflexia in lower extremities = UMN signs. The PRESERVED SENSATION is crucial - ALS does NOT affect sensory neurons, distinguishing it from conditions like peripheral neuropathy (which affects both motor and sensory nerves) and multiple sclerosis (which affects sensory pathways in the CNS). The El Escorial criteria for ALS diagnosis require: UMN AND LMN signs in multiple body regions, progressive course, and absence of evidence for other diseases. While ALS is not typically a primary ED diagnosis, emergency nurses may encounter ALS patients presenting with: respiratory failure (from diaphragm weakness), aspiration pneumonia (from bulbar weakness), falls (from limb weakness), or acute-on-chronic respiratory decompensation.",
    learningObjective: "Recognize the combination of UMN and LMN signs with preserved sensation as the hallmark of ALS",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Neuromuscular Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "UMN + LMN signs + preserved sensation = ALS; sensation preserved because ALS spares sensory neurons",
    clinicalPearls: [
      "ALS: combined UMN (hyperreflexia, spasticity) + LMN (weakness, atrophy, fasciculations)",
      "Sensation is PRESERVED - distinguishes from peripheral neuropathy",
      "Mean survival 3-5 years from diagnosis; respiratory failure is usual cause of death",
      "ED presentations: respiratory failure, aspiration pneumonia, falls"
    ],
    safetyNote: "ALS patients with respiratory compromise may need BiPAP or intubation - discuss advance directives early",
    distractorRationales: [
      "ALS shows combined UMN and LMN signs with preserved sensation",
      "MS is primarily CNS demyelination with UMN signs and sensory involvement",
      "Myasthenia has fatigable weakness without UMN signs or atrophy",
      "Peripheral neuropathy shows only LMN signs with sensory involvement"
    ],
    lessonLink: "/emergency/lessons/neuromuscular-emergencies"
  },
  {
    stem: "A 60-year-old male with acute left MCA stroke has an NIHSS score of 22. During the first 48 hours, his neurological status worsens with decreasing consciousness and new pupillary asymmetry. CT shows massive left MCA territory infarction with 10 mm midline shift and uncal herniation. What surgical intervention may be life-saving?",
    options: [
      "Decompressive hemicraniectomy to allow the edematous brain to expand externally and reduce ICP",
      "Craniotomy with infarct tissue resection",
      "Emergent VP shunt placement for ICP management",
      "Bilateral frontal burr holes for ICP monitoring only"
    ],
    correctAnswer: 0,
    rationaleLong: "Malignant MCA infarction (defined as infarction of >50% of the MCA territory) is a devastating complication of large MCA stroke, occurring in approximately 10% of MCA strokes. It develops as cytotoxic edema peaks at 48-72 hours, causing progressive cerebral swelling, midline shift, and uncal herniation with a mortality rate of 80% with medical management alone. Decompressive hemicraniectomy (DHC) is the surgical removal of a large portion of the skull overlying the infarcted hemisphere (typically >12 cm in diameter) with duraplasty (opening the dura to allow further expansion). This allows the edematous brain to swell outward rather than causing transtentorial herniation. Three landmark European trials (DECIMAL, DESTINY, HAMLET) demonstrated that decompressive hemicraniectomy within 48 hours of stroke onset in patients <60 years old significantly reduces mortality (from 78% to 29%) and increases favorable functional outcomes. The DESTINY II trial extended the evidence to patients 61-82 years old, showing mortality reduction but with less favorable functional outcomes. Current AHA/ASA guidelines recommend considering DHC for: (1) malignant MCA infarction, (2) age consideration (strongest evidence <60 years), (3) surgery within 48 hours of stroke onset, (4) after informed discussion with family about expected functional outcomes. The bone flap is typically stored in a subcutaneous pocket in the abdomen or cryopreserved, and cranioplasty (replacing the bone) is performed 6-12 weeks later. Infarct tissue resection is not performed as it would remove viable brain tissue. VP shunting does not address the mass effect from the infarcted tissue. Burr holes for monitoring alone do not provide the needed decompression.",
    learningObjective: "Recognize malignant MCA infarction and prepare for decompressive hemicraniectomy as a life-saving intervention",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Stroke Management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Malignant MCA infarction: 80% mortality with medical therapy alone; DHC within 48 hours reduces mortality to 29%",
    clinicalPearls: [
      "Malignant MCA infarction: >50% MCA territory with herniation",
      "DHC reduces mortality from 78% to 29% (DECIMAL, DESTINY, HAMLET trials)",
      "Strongest evidence for age <60; consider for 60-82 with family discussion",
      "Surgery ideally within 48 hours of stroke onset"
    ],
    safetyNote: "Discuss realistic functional outcomes with family - survival may come with significant disability",
    distractorRationales: [
      "DHC allows external brain expansion and prevents fatal herniation",
      "Infarcted tissue resection would remove potentially recoverable brain tissue",
      "VP shunt does not address the mass effect from swollen infarcted tissue",
      "Burr holes alone provide monitoring but not therapeutic decompression"
    ],
    lessonLink: "/emergency/lessons/stroke-management"
  }
];
