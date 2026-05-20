import type { ExamQuestion } from "./types";

export const npExamBatch23Questions: ExamQuestion[] = [
  {
    q: "A 45-year-old non-smoking female presents with progressive dyspnea over 2 years. CT chest shows ground-glass opacities and traction bronchiectasis in the lower lobes. PFTs show FVC 62% predicted, DLCO 48% predicted. ANA is negative. What is the most likely diagnosis and management?",
    o: ["Idiopathic pulmonary fibrosis (IPF); initiate antifibrotic therapy (pirfenidone or nintedanib) and refer for transplant evaluation", "Sarcoidosis; start prednisone 40 mg daily", "Hypersensitivity pneumonitis; remove environmental exposure", "Organizing pneumonia; prescribe corticosteroids"],
    a: 0,
    r: "Lower-lobe predominant fibrotic pattern with traction bronchiectasis, restrictive PFTs, and markedly reduced DLCO in the absence of autoimmune markers is characteristic of IPF, even in non-smokers and women (though less common). Antifibrotic agents (pirfenidone, nintedanib) slow progression. Early transplant referral is indicated for DLCO below 40% or rapid decline. Sarcoidosis favors upper lobes. HP requires exposure history.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old female with asthma has an FEV1 of 95% predicted but reports cough predominantly at night. She uses a low-dose ICS/formoterol combination inhaler as both maintenance and reliever (MART therapy). She notes increased reliever use to 6 times in the past week. What action should the NP take?",
    o: ["Assess inhaler technique and adherence; if adequate, step up to medium-dose ICS/formoterol MART", "Switch to a LABA-only inhaler", "Add oral montelukast without changing current therapy", "Prescribe a short course of oral prednisone"],
    a: 0,
    r: "Increased reliever use (more than 2 times/week) indicates worsening asthma control. With MART (maintenance and reliever therapy), increasing reliever use signals the need to step up maintenance. First assess inhaler technique and adherence (the most common causes of poor control). If technique is correct, step up to medium-dose ICS/formoterol. LABA-only therapy is never appropriate. Montelukast alone is unlikely to provide sufficient control. Oral steroids are for exacerbations.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old male with COPD (FEV1 45% predicted) develops cor pulmonale with right heart failure. He has peripheral edema and elevated JVP. What is the primary treatment for this complication?",
    o: ["Long-term oxygen therapy targeting SpO2 88-92% to reduce pulmonary vascular resistance, plus diuretics for fluid overload", "Right heart catheterization and pulmonary vasodilator therapy", "High-dose inhaled corticosteroids", "Left ventricular assist device placement"],
    a: 0,
    r: "Cor pulmonale in COPD is primarily caused by hypoxic pulmonary vasoconstriction leading to pulmonary hypertension and right heart failure. Long-term oxygen therapy (LTOT) is the only intervention shown to reduce mortality in hypoxemic COPD by reducing pulmonary vascular resistance. Diuretics manage fluid overload. Pulmonary vasodilators used for PAH may worsen V/Q mismatch in COPD. LVAD is for left heart failure.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old male who works in a shipyard presents with progressive dyspnea and bilateral pleural thickening on chest CT. He has a history of asbestos exposure 25 years ago. There is a large unilateral pleural effusion. Cytology from thoracentesis shows malignant cells. What is the most likely diagnosis?",
    o: ["Malignant pleural mesothelioma", "Benign asbestos pleural effusion", "Lung adenocarcinoma", "Tuberculosis"],
    a: 0,
    r: "Occupational asbestos exposure with a long latency period (20-50 years), bilateral pleural thickening, and unilateral malignant pleural effusion is classic for malignant pleural mesothelioma. It arises from mesothelial cells lining the pleura. Diagnosis requires immunohistochemical staining (calretinin, WT-1 positive). Prognosis is poor (median survival 12-18 months). Lung adenocarcinoma is also asbestos-related but arises from lung parenchyma.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old female with a history of recurrent pneumothoraces presents with a tall, thin body habitus. CT chest shows bilateral apical blebs. She just recovered from her third spontaneous pneumothorax. What definitive management should the NP recommend?",
    o: ["Video-assisted thoracoscopic surgery (VATS) with bleb resection and mechanical pleurodesis", "Observation and avoid strenuous activity indefinitely", "Repeated chest tube placement as needed", "Prophylactic bilateral chest tubes"],
    a: 0,
    r: "Recurrent primary spontaneous pneumothorax (3 or more episodes, or 2 ipsilateral episodes) is an indication for definitive surgical management. VATS with bleb resection and pleurodesis (mechanical abrasion or chemical) reduces recurrence to less than 5% (compared to 50-60% after the second episode with conservative management). The patient's tall thin habitus and apical blebs are typical risk factors.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old male presents with progressive bilateral lower extremity weakness, absent ankle reflexes, and glove-stocking sensory loss ascending over 3 weeks. He had a viral illness 4 weeks ago. CSF shows elevated protein with normal cell count (albuminocytologic dissociation). What is the diagnosis and treatment?",
    o: ["Guillain-Barre syndrome; initiate IV immunoglobulin (IVIG) or plasma exchange and monitor respiratory function closely", "Multiple sclerosis; start IV methylprednisolone", "Myasthenia gravis; start pyridostigmine", "Chronic inflammatory demyelinating polyneuropathy; long-term immunosuppression"],
    a: 0,
    r: "Ascending weakness, areflexia, sensory loss following viral illness, and CSF albuminocytologic dissociation (elevated protein, normal cells) is classic for Guillain-Barre syndrome (acute inflammatory demyelinating polyradiculoneuropathy). Treatment is IVIG or plasmapheresis (equally effective). Respiratory monitoring is critical as 30% require ventilatory support. FVC should be monitored every 4-6 hours. Steroids are NOT effective for GBS (unlike CIDP).",
    s: "Neurology"
  },
  {
    q: "A 25-year-old female presents with optic neuritis (painful vision loss in the left eye). MRI brain shows 4 periventricular white matter lesions. MRI spine shows a cervical cord lesion. Visual evoked potentials are prolonged. What criteria does this presentation meet?",
    o: ["McDonald criteria for multiple sclerosis (dissemination in space and can establish dissemination in time with follow-up or CSF findings)", "Neuromyelitis optica spectrum disorder", "Acute disseminated encephalomyelitis", "Clinically isolated syndrome only"],
    a: 0,
    r: "The 2017 McDonald criteria for MS require dissemination in space (DIS) and dissemination in time (DIT). DIS is met by lesions in 2 or more typical CNS areas (periventricular, juxtacortical, infratentorial, spinal cord). This patient has periventricular and spinal cord lesions. DIT can be met by a new lesion on follow-up MRI, simultaneous gadolinium-enhancing and non-enhancing lesions, or CSF-specific oligoclonal bands. NMOSD should be excluded with aquaporin-4 antibody testing.",
    s: "Neurology"
  },
  {
    q: "A 70-year-old male with Parkinson disease has been on carbidopa-levodopa for 8 years. He now experiences peak-dose dyskinesias (involuntary movements 1-2 hours after each dose). How should the NP adjust therapy?",
    o: ["Reduce individual levodopa doses but increase dosing frequency; consider adding amantadine for dyskinesia", "Increase each levodopa dose to overcome the dyskinesias", "Add a second dopamine agonist", "Switch entirely to anticholinergic therapy"],
    a: 0,
    r: "Peak-dose dyskinesias indicate excessive dopaminergic stimulation at peak plasma levels. The strategy is to reduce each individual dose of levodopa while increasing the frequency of doses to maintain more stable plasma levels. Amantadine (NMDA receptor antagonist) is the only medication specifically shown to reduce levodopa-induced dyskinesias. Increasing doses worsens dyskinesias. Anticholinergics are ineffective for advanced PD and cause cognitive side effects in elderly.",
    s: "Neurology"
  },
  {
    q: "A 40-year-old male presents with sudden onset of the worst headache of his life, neck stiffness, and photophobia. CT head without contrast is negative. What is the next diagnostic step?",
    o: ["Lumbar puncture to evaluate for xanthochromia and elevated RBC count", "CT angiography of the head", "MRI brain with gadolinium", "Prescribe sumatriptan for presumed severe migraine"],
    a: 0,
    r: "Thunderclap headache (sudden onset worst headache of life) mandates evaluation for subarachnoid hemorrhage (SAH) even with a negative CT. CT sensitivity for SAH declines from 98% at 6 hours to 86% at 72 hours. Lumbar puncture is the next step to detect xanthochromia (bilirubin from RBC breakdown, present after 12 hours) and elevated RBCs. If LP is also negative, CT angiography evaluates for unruptured aneurysm. Treating empirically as migraine risks missing a fatal diagnosis.",
    s: "Neurology"
  },
  {
    q: "A 55-year-old female presents with bilateral carpal tunnel syndrome. She also has macroglossia, coarsened facial features, and shoe size increase over 5 years. What underlying condition should the NP investigate?",
    o: ["Acromegaly (growth hormone excess from pituitary adenoma)", "Hypothyroidism", "Rheumatoid arthritis", "Amyloidosis"],
    a: 0,
    r: "Bilateral carpal tunnel syndrome with macroglossia, coarsened facial features, and acral enlargement (increased shoe/ring size) is classic for acromegaly. GH excess causes soft tissue overgrowth compressing the median nerve. Screening is with serum IGF-1 level, confirmed by oral glucose tolerance test (failure to suppress GH below 1 ng/mL). MRI pituitary identifies the adenoma. Treatment is typically transsphenoidal surgery. Hypothyroidism can cause CTS but lacks the acral enlargement.",
    s: "Neurology"
  }
];
