/**
 * 125 distinct UK ACP / advanced nursing practice long-tail topic labels.
 * Slugs are derived in the generator as uk-acp-{slugify(label)} with collision suffixes if needed.
 */
export const UK_ACP_EXTRA_LABELS_RAW = `
Hyperkalaemia emergency coordination and bedside monitoring themes for UK acute wards
Hypoglycaemia recognition and inpatient safety checks for advanced nursing learners
Insulin safety human factors double-check governance and exam-style prioritisation
Fluid responsiveness assessment basics without invasive monitoring for ACP coursework
Hyponatraemia assessment cautions and syndrome of inappropriate antidiuresis study angles
Post-operative fever differential nursing lens for UK acute surgical pathways
Surgical site infection surveillance escalation and IPC documentation expectations
Enhanced recovery after surgery nursing review points for UK perioperative education
Preoperative assessment documentation and risk flag communication for ward nurses
Acute pain multimodal analgesia education and opioid respiratory depression monitoring
Patient-controlled analgesia safety checks and education scripts for exam practice
NSAID renal risk messaging during AKI prevention and medicines reconciliation teaching
Antibiotic stewardship audit conversations nursing contributions to quality improvement
Clostridioides difficile infection prevention bundle and isolation communication basics
Neutropenic sepsis vigilance in oncology day unit and inpatient nursing contexts
Immunotherapy toxicity awareness red flag phrases for liaison escalation study notes
Chemotherapy extravasation immediate actions awareness for non-specialist ward nurses
Transfusion reaction recognition framework nursing immediate actions education only
Group and save versus crossmatch concepts for UK transfusion safety teaching
Major haemorrhage protocol activation triggers nursing communication drill themes
Trauma primary survey nursing contributions in UK major trauma centre education
Rib fracture pulmonary toilet and analgesia safety for respiratory splinting teaching
Pneumothorax recognition decompression escalation and post-procedure monitoring study
Pleural effusion assessment positioning and physiotherapy liaison for breathlessness
Asthma acute attack severity markers and peak flow interpretation teaching for exams
Pulmonary embolism Wells score data gathering without overcalling low-risk stems
Pneumonia severity scoring CURB-65 nursing documentation and oxygen titration themes
Legionella risk factor history questions for community-acquired pneumonia exam stems
Tuberculosis contact tracing role boundaries for ward nurses and advanced students
HIV confidentiality acute assessment ethics study for UK healthcare encounters
Needlestick injury immediate steps UK occupational health pathways awareness
Sharps injury reporting systems learning and systems safety for nursing leadership
Manual handling bariatric care planning and equipment escalation for ward safety
Pain assessment tools for patients with communication barriers and learning disabilities
Capacity and best interests rapid review themes for acute decision-making coursework
Deprivation of liberty safeguards awareness for ward nurses without legal advice
Mental capacity assessment second opinion triggers and documentation phrasing study
Eating disorders physical risk RED-S flags nursing assessment education for acute care
Self-harm ligature risk environmental review basics for inpatient mental health units
Rapid tranquilisation governance nursing observations post-administration study themes
Alcohol withdrawal monitoring scales UK adaptation and benzodiazepine safety education
Substance intoxication acute assessment safety and de-escalation for emergency nurses
Parkinson's disease omission of dopaminergic medications inpatient risk teaching
Neuroleptic malignant syndrome recognition nursing monitoring clusters for exam stems
Serotonin toxicity polypharmacy clues for advanced pharmacology exam preparation
Status epilepticus pre-hospital to emergency nursing priority scaffolding study
Raised intracranial pressure warning signs positioning cautions education only
Spinal immobilisation controversy nursing exam angle for UK trauma teaching
Cauda equina syndrome red flag history documentation and urgent imaging escalation
Acute urinary retention assessment catheter governance basics for advanced learners
Bowel obstruction assessment NG tube governance and aspiration risk teaching points
Upper gastrointestinal bleeding risk scoring nursing data collection for MDT review
Lower gastrointestinal bleeding stable versus unstable assessment prioritisation
Acute pancreatitis severity markers nursing review and escalation language study
Acute cholangitis recognition bundles and sepsis overlap for advanced exam learners
Hepatic encephalopathy assessment lactulose governance themes without dosing advice
Ascites care before and after paracentesis nursing monitoring education for UK wards
Variceal bleed pathway awareness nursing role in activation and documentation study
Acute limb ischaemia six Ps assessment and time-critical escalation teaching
Deep vein thrombosis diagnosis pathway nursing pre-test probability gathering study
Heart failure with reduced versus preserved ejection fraction bedside clue comparison
Cardiogenic shock early recognition nursing monitoring and escalation for acute exams
Infective endocarditis history clues Duke criteria awareness for nursing data gathering
Pericarditis versus acute coronary syndrome differentials for exam-style chest pain
Aortic dissection ripping pain red flags and urgent imaging activation teaching
Pulmonary hypertension gradual deterioration assessment and MDT referral language
Venous thromboembolism prophylaxis education mechanical versus pharmacological themes
Medicines reconciliation at admission transfer and discharge for UK patient safety
Medicines reconciliation errors common causes nursing mitigation strategies study
Antimicrobial allergy documentation penicillin allergy delabelling awareness themes
Drug interaction clinical decision support nursing advocacy for pharmacy review
High dose opioid governance naloxone availability awareness for inpatient settings
Sedation scoring monitoring for ventilated patients nursing safety teaching UK context
Tracheostomy emergency management awareness for ward nurses without specialist scope
Chest drain observation nursing cues for air leak and respiratory distress study
Acute stroke FAST recognition hyperacute pathway time metrics nursing awareness
Transient ischaemic attack ABCD2 nursing relevance for risk communication teaching
Post-stroke swallow screening and aspiration prevention governance for ward nurses
Delirium prevention bundle sleep hydration orientation for older adult inpatients
Falls risk assessment multifactorial interventions and post-fall review documentation
Pressure ulcer staging escalation and nutrition liaison for tissue viability teaching
Care home acute deterioration NEWS2 application and GP out-of-hours interface study
Ambulatory emergency care patient selection nursing triage safety for UK systems
Same day emergency care streaming and frailty considerations for advanced learners
Clinical frailty scale application and goals of care conversations teaching for exams
Comprehensive geriatric assessment overview for ward nurses supporting ACP students
Polypharmacy review STOPP START awareness without individual deprescribing advice
Deprescribing conversation skills for advanced nurse practitioners within governance
Palliative care anticipatory prescribing governance awareness for ward nurses study
Syringe driver medicines education symptom control module for community interfaces
End-of-life breathlessness non-pharmacologic measures and positioning teaching themes
Verification of expected death process awareness UK variance study without procedure
Organ donation referral sensitivity awareness for nursing communication coursework
Major incident triage sort principles awareness for non-field nursing exam contexts
Isolation precautions droplet contact airborne nursing education for IPC compliance
C difficile sporicidal cleaning awareness for ward staff and domestic services liaison
Multidrug-resistant organism alert handling nursing cohorting basics for acute exams
Carbapenemase-producing enterobacterales cohort nursing education for UK IPC policy
Blood culture collection contamination reduction teaching for phlebotomy-linked roles
Lumbar puncture consent and aftercare nursing support study for neurology placements
Acute kidney injury urine output monitoring bundle elements for nursing documentation
Contrast-induced acute kidney injury risk communication themes for radiology interface
Perioperative fluid balance charts interpretation and escalation for surgical nurses
Enhanced observations for NEWS2 step-ups nursing workload and safety trade-offs study
Endocrine storm recognition thyrotoxicosis nursing monitoring themes for acute care
Addisonian crisis suspicion hypotension hyponatraemia hyperkalaemia exam clustering
Sickle cell acute chest syndrome recognition and oxygenation themes for UK learners
Thalassaemia transfusion iron chelation awareness for liaison nursing exam notes only
Iron deficiency anaemia investigation themes nursing history gathering for primary care
B12 folate deficiency neurological clues nursing assessment for exam case practice
Coeliac disease malabsorption clues nursing dietary liaison and GP referral teaching
Inflammatory bowel disease flare assessment dehydration and pain escalation study
Acute abdomen gynaecological emergencies ectopic pregnancy awareness for ED nurses
Antepartum haemorrhage recognition escalation and major haemorrhage call themes
Pre-eclampsia severe features magnesium observations study without infusion titration
Eclampsia emergency response nursing framework note for simulation exam preparation
Postpartum haemorrhage quantification escalation and warming measures teaching study
Neonatal jaundice threshold awareness for nurses working at maternity interfaces
Paediatric fever sepsis vigilance without over-medicalising low-risk exam stems
Child safeguarding immediate escalation steps UK acute trust policy awareness
Domestic abuse disclosure sensitive questioning nursing application for ACP ethics
Modern slavery indicators in healthcare encounters documentation and referral study
Female genital mutilation mandatory reporting awareness UK safeguarding coursework
Honour-based abuse risk flags clinical encounters without stereotyping exam guidance
Professional accountability Duty of Candour principles study for UK registrants
Freedom to Speak Up referral routes awareness for nursing students and new staff
Clinical human factors aviation parallels for handover quality improvement teaching
Situational awareness drills for deteriorating patient in situ simulation exam prep
Team resource management principles for nurses preparing for advanced practice OSCEs
Quality improvement PDSA cycles for small ward projects ACP assignment framing
Clinical audit cycle basics for service evaluation versus research distinctions study
Leadership without authority influencing MDT decisions nursing exam narratives
Conflict resolution between nursing and medical teams restorative practice awareness
Coaching and supervision models for advanced practitioners reflective practice study
Appraisal and revalidation reflection documentation themes for UK NMC portfolios
Continuing professional development portfolio evidence gathering for ACP programmes
Refusing tasks outside competence accountability language for UK advanced roles
Advanced clinical practice four pillars mapping clinical education leadership research
Education pillar bedside teaching skills for senior nursing roles exam preparation
Research pillar literature search CASP basics for coursework without statistics depth
Leadership pillar service improvement governance for nursing project write-ups study
Digital health remote monitoring equity risks for UK population health interfaces
Telehealth consent documentation UK themes for advanced nursing triage coursework
`.trim();

export function ukAcpExtraLabels(): string[] {
  return UK_ACP_EXTRA_LABELS_RAW.split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}
