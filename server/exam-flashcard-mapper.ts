import crypto from "crypto";
import { pool } from "./storage";

interface ExamQuestion {
  id: string;
  tier: string;
  exam: string;
  stem: string;
  options: any[];
  correct_answer: any[];
  rationale: string;
  body_system: string | null;
  topic: string | null;
  subtopic: string | null;
  difficulty: number;
  question_type: string;
  clinical_pearl: string | null;
  exam_strategy: string | null;
  distractor_rationales: any;
  region_scope: string;
  career_type: string;
  tags: string[] | null;
  memory_hook: string | null;
  mnemonic: string | null;
  labs: any;
  vitals: any;
  medication_naming_variant: string | null;
  lab_unit_variant: string | null;
  key_takeaway: string | null;
}

interface InfographicMatch {
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  imageDescription: string;
  sortOrder: number;
}

interface LessonMatch {
  lessonTitle: string;
  lessonUrl: string;
  relevanceNote: string;
}

const IMAGE_KEYWORD_MAP: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "cardiac tamponade": [{ file: "cardiactamponade", alt: "Cardiac tamponade illustration", caption: "Cardiac Tamponade", description: "Beck's triad: hypotension, muffled heart sounds, JVD" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes management infographic", caption: "Diabetes Overview", description: "Key concepts in diabetes management and monitoring" }],
  "renal calculi": [{ file: "renalcalculus_1773375303320.png", alt: "Renal calculus illustration showing kidney stone types and management", caption: "Renal Calculi", description: "Kidney stones: types, symptoms, and management" }],
  "kidney stone": [{ file: "renalcalculus_1773375303320.png", alt: "Renal calculus illustration showing kidney stone types and management", caption: "Renal Calculi", description: "Kidney stones: types, symptoms, and management" }],
  "renal calculus": [{ file: "renalcalculus_1773375303320.png", alt: "Renal calculus illustration showing kidney stone types and management", caption: "Renal Calculus", description: "Kidney stones: types, symptoms, and management" }],
  "nephrolithiasis": [{ file: "renalcalculus_1773375303320.png", alt: "Renal calculus illustration showing kidney stone types and management", caption: "Renal Calculus", description: "Kidney stones: nephrolithiasis types, symptoms, and management" }],
  "abg": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "arterial blood gas": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "acid-base": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "neonatal feeding": [{ file: "neonatalfeeding", alt: "Neonatal feeding illustration", caption: "Neonatal Feeding", description: "Key concepts in neonatal feeding assessment and management" }],
  "neonatal hypoglycemia": [{ file: "neonatalhypoglycemia", alt: "Neonatal hypoglycemia illustration", caption: "Neonatal Hypoglycemia", description: "Signs, risk factors, and management of neonatal hypoglycemia" }],
  "neonatal jaundice": [{ file: "neonataljaundice", alt: "Neonatal jaundice illustration", caption: "Neonatal Jaundice", description: "Pathophysiology and management of neonatal jaundice and hyperbilirubinemia" }],
  "hyperbilirubinemia": [{ file: "neonataljaundice", alt: "Neonatal jaundice illustration", caption: "Neonatal Jaundice", description: "Pathophysiology and management of hyperbilirubinemia" }],
  "neonatal sepsis": [{ file: "neonatalsepsis", alt: "Neonatal sepsis illustration", caption: "Neonatal Sepsis", description: "Recognition and management of neonatal sepsis" }],
  "neuroblastoma": [{ file: "neuroblastoma", alt: "Neuroblastoma illustration", caption: "Neuroblastoma", description: "Most common extracranial solid tumor in children, arising from neural crest cells" }],
  "infant of diabetic mother": [{ file: "newbornofdiabetic", alt: "Newborn of diabetic mother illustration", caption: "Infant of Diabetic Mother", description: "Complications and management of infants born to diabetic mothers" }],
  "newborn of diabetic mother": [{ file: "newbornofdiabetic", alt: "Newborn of diabetic mother illustration", caption: "Newborn of Diabetic Mother", description: "Complications and management of newborns of diabetic mothers" }],
  "osteogenesis imperfecta": [{ file: "osteogenesis", alt: "Osteogenesis imperfecta illustration", caption: "Osteogenesis Imperfecta", description: "Brittle bone disease: types, signs, and management" }],
  "ovarian hyperstimulation": [{ file: "ovarianhyperstimulation", alt: "Ovarian hyperstimulation illustration", caption: "Ovarian Hyperstimulation Syndrome", description: "OHSS pathophysiology, risk factors, and management" }],
  "ohss": [{ file: "ovarianhyperstimulation", alt: "Ovarian hyperstimulation illustration", caption: "OHSS", description: "Ovarian hyperstimulation syndrome management" }],
  "patent ductus arteriosus": [{ file: "patentductusarteriosus_1773375118294", alt: "Patent ductus arteriosus illustration", caption: "Patent Ductus Arteriosus", description: "PDA: machinery murmur, left-to-right shunt, indomethacin treatment" }],
  "pda": [{ file: "patentductusarteriosus_1773375118294", alt: "Patent ductus arteriosus illustration", caption: "PDA", description: "Patent ductus arteriosus: diagnosis and management" }],
  "pavlik harness": [{ file: "pavlik_1773375118294", alt: "Pavlik harness illustration", caption: "Pavlik Harness", description: "Pavlik harness for developmental hip dysplasia treatment in infants" }],
  "pediatric vital signs": [{ file: "pediatric_vitals_chart_fixed", alt: "Pediatric vital signs chart", caption: "Pediatric Vital Signs", description: "Age-specific vital sign ranges for pediatric patients" }],
  "pediatric dehydration": [{ file: "pediatricdehydration_1773375118294", alt: "Pediatric dehydration illustration", caption: "Pediatric Dehydration", description: "Assessment and management of dehydration in pediatric patients" }],
  "pinworm": [{ file: "pinworms_1773375118294", alt: "Pinworms illustration", caption: "Pinworms", description: "Enterobiasis: tape test, mebendazole treatment, hygiene measures" }],
  "pinworms": [{ file: "pinworms_1773375118294", alt: "Pinworms illustration", caption: "Pinworms", description: "Enterobiasis: tape test, mebendazole treatment, hygiene measures" }],
  "phenylketonuria": [{ file: "pku_1773375118294", alt: "PKU illustration", caption: "Phenylketonuria", description: "PKU: newborn screening, phenylalanine-restricted diet, management" }],
  "pku": [{ file: "pku_1773375118294", alt: "PKU illustration", caption: "PKU", description: "Phenylketonuria: screening, dietary management, and monitoring" }],
  "placental abruption": [{ file: "placentalabruption_1773375118294", alt: "Placental abruption illustration", caption: "Placental Abruption", description: "Premature placental separation: painful bleeding, rigid abdomen, emergency management" }],
  "placenta previa": [{ file: "placentaprevia", alt: "Placenta previa illustration", caption: "Placenta Previa", description: "Placenta covering cervical os: painless bright red bleeding, no vaginal exam" }],
  "postpartum hemorrhage": [{ file: "postpartumhemorrhage", alt: "Postpartum hemorrhage illustration", caption: "Postpartum Hemorrhage", description: "PPH: uterine atony, 4 T's, fundal massage, uterotonics" }],
  "pyloric stenosis": [{ file: "pyloricstenosis_1773375303320.png", alt: "Pyloric stenosis illustration showing hypertrophied pylorus and projectile vomiting", caption: "Pyloric Stenosis", description: "Non-bilious projectile vomiting, olive-shaped mass, pyloromyotomy" }],
  "pyloromyotomy": [{ file: "pyloricstenosis_1773375303320.png", alt: "Pyloric stenosis illustration showing hypertrophied pylorus and projectile vomiting", caption: "Pyloric Stenosis", description: "Non-bilious projectile vomiting, olive-shaped mass, pyloromyotomy" }],
  "congenital hypothyroidism": [{ file: "congenitalhypothyroidism", alt: "Congenital hypothyroidism illustration", caption: "Congenital Hypothyroidism", description: "Newborn screening, thyroid hormone deficiency, and early treatment to prevent intellectual disability" }],
  "epstein-barr": [{ file: "EBV", alt: "Epstein-Barr virus illustration", caption: "Epstein-Barr Virus (EBV)", description: "Infectious mononucleosis: transmission, symptoms, and management" }],
  "mononucleosis": [{ file: "EBV", alt: "Epstein-Barr virus illustration", caption: "Epstein-Barr Virus (EBV)", description: "Infectious mononucleosis: transmission, symptoms, and management" }],
  "ebv": [{ file: "EBV", alt: "Epstein-Barr virus illustration", caption: "Epstein-Barr Virus (EBV)", description: "Infectious mononucleosis: transmission, symptoms, and management" }],
  "ectopic pregnancy": [{ file: "ectopicpregnancy", alt: "Ectopic pregnancy illustration", caption: "Ectopic Pregnancy", description: "Tubal implantation, risk factors, and emergency management" }],
  "ectopic": [{ file: "ectopicpregnancy", alt: "Ectopic pregnancy illustration", caption: "Ectopic Pregnancy", description: "Tubal implantation, risk factors, and emergency management" }],
  "encephalitis": [{ file: "encephalitis", alt: "Encephalitis illustration", caption: "Encephalitis", description: "Brain inflammation: viral causes, symptoms, and nursing management" }],
  "episiotomy": [{ file: "episiotomy", alt: "Episiotomy illustration", caption: "Episiotomy", description: "Perineal incision during delivery: types, care, and healing assessment" }],
  "fetal monitoring": [{ file: "fetalmonitoring", alt: "Fetal monitoring illustration", caption: "Fetal Monitoring", description: "Electronic fetal heart rate monitoring: categories, decelerations, and interventions" }],
  "fetal heart rate": [{ file: "fetalmonitoring", alt: "Fetal monitoring illustration", caption: "Fetal Monitoring", description: "Electronic fetal heart rate monitoring: categories, decelerations, and interventions" }],
  "fetal oxygenation": [{ file: "fetaloxygenation", alt: "Fetal oxygenation illustration", caption: "Fetal Oxygenation", description: "Uteroplacental gas exchange and fetal oxygen supply" }],
  "general adaptation syndrome": [{ file: "GAS", alt: "General adaptation syndrome illustration", caption: "General Adaptation Syndrome (GAS)", description: "Selye's stress response: alarm, resistance, and exhaustion stages" }],
  "gas": [{ file: "GAS", alt: "General adaptation syndrome illustration", caption: "General Adaptation Syndrome (GAS)", description: "Selye's stress response: alarm, resistance, and exhaustion stages" }],
  "gestational diabetes": [{ file: "gestationaldiabetes", alt: "Gestational diabetes illustration", caption: "Gestational Diabetes", description: "Glucose intolerance in pregnancy: screening, management, and fetal effects" }],
  "hellp syndrome": [{ file: "HELLP", alt: "HELLP syndrome illustration", caption: "HELLP Syndrome", description: "Hemolysis, Elevated Liver enzymes, Low Platelets: severe preeclampsia variant" }],
  "hellp": [{ file: "HELLP", alt: "HELLP syndrome illustration", caption: "HELLP Syndrome", description: "Hemolysis, Elevated Liver enzymes, Low Platelets: severe preeclampsia variant" }],
  "hepatitis b": [{ file: "hepatitisb", alt: "Hepatitis B illustration", caption: "Hepatitis B", description: "Blood-borne viral hepatitis: transmission, serology, vaccination, and chronic management" }],
  "hbv": [{ file: "hepatitisb", alt: "Hepatitis B illustration", caption: "Hepatitis B", description: "Blood-borne viral hepatitis: transmission, serology, vaccination, and chronic management" }],
  "hepatitis c": [{ file: "hepatitisc", alt: "Hepatitis C illustration", caption: "Hepatitis C", description: "Blood-borne viral hepatitis: screening, direct-acting antivirals, and cure" }],
  "hcv": [{ file: "hepatitisc", alt: "Hepatitis C illustration", caption: "Hepatitis C", description: "Blood-borne viral hepatitis: screening, direct-acting antivirals, and cure" }],
  "hand foot mouth": [{ file: "HFM", alt: "Hand foot and mouth disease illustration", caption: "Hand, Foot, and Mouth Disease", description: "Coxsackievirus infection: vesicular rash, fever, and supportive care" }],
  "hand-foot-mouth": [{ file: "HFM", alt: "Hand foot and mouth disease illustration", caption: "Hand, Foot, and Mouth Disease", description: "Coxsackievirus infection: vesicular rash, fever, and supportive care" }],
  "coxsackievirus": [{ file: "HFM", alt: "Hand foot and mouth disease illustration", caption: "Hand, Foot, and Mouth Disease", description: "Coxsackievirus infection: vesicular rash, fever, and supportive care" }],
  "histoplasmosis": [{ file: "histoplasmosis", alt: "Histoplasmosis illustration", caption: "Histoplasmosis", description: "Fungal respiratory infection from Histoplasma capsulatum in bird/bat droppings" }],
  "hyperemesis gravidarum": [{ file: "hyperemesisgravidarum", alt: "Hyperemesis gravidarum illustration", caption: "Hyperemesis Gravidarum", description: "Severe pregnancy nausea: dehydration, electrolyte imbalance, and thiamine deficiency risk" }],
  "hyperemesis": [{ file: "hyperemesisgravidarum", alt: "Hyperemesis gravidarum illustration", caption: "Hyperemesis Gravidarum", description: "Severe pregnancy nausea: dehydration, electrolyte imbalance, and thiamine deficiency risk" }],
  "impetigo": [{ file: "impetigo", alt: "Impetigo illustration", caption: "Impetigo", description: "Superficial bacterial skin infection with honey-colored crusted lesions" }],
  "infant reflexes": [{ file: "infantreflexes", alt: "Infant reflexes illustration", caption: "Infant Reflexes", description: "Primitive reflexes: Moro, rooting, sucking, Babinski, grasp, and tonic neck" }],
  "newborn reflexes": [{ file: "infantreflexes", alt: "Infant reflexes illustration", caption: "Infant Reflexes", description: "Primitive reflexes: Moro, rooting, sucking, Babinski, grasp, and tonic neck" }],
  "intestinal malrotation": [{ file: "intestinalmalrotation_1773374939606", alt: "NurseNest intestinal malrotation illustration", caption: "Intestinal Malrotation", description: "Congenital abnormal bowel rotation with volvulus risk" }],
  "malrotation": [{ file: "intestinalmalrotation_1773374939606", alt: "NurseNest intestinal malrotation illustration", caption: "Intestinal Malrotation", description: "Congenital abnormal bowel rotation with volvulus risk" }],
  "ckd": [{ file: "CKD.png", alt: "Chronic kidney disease illustration", caption: "Chronic Kidney Disease (CKD)", description: "CKD stages, nephron damage, uremia, and fluid retention" }],
  "chronic kidney disease": [{ file: "CKD.png", alt: "Chronic kidney disease illustration", caption: "Chronic Kidney Disease (CKD)", description: "CKD stages, nephron damage, uremia, and fluid retention" }],
  "clubfoot": [{ file: "clubfoot.png", alt: "Clubfoot illustration", caption: "Clubfoot (Talipes Equinovarus)", description: "Congenital foot deformity: inversion, forefoot adduction, and Ponseti casting method" }],
  "talipes equinovarus": [{ file: "clubfoot.png", alt: "Clubfoot illustration", caption: "Clubfoot (Talipes Equinovarus)", description: "Congenital foot deformity: inversion, forefoot adduction, and Ponseti casting method" }],
  "cmv": [{ file: "CMV.png", alt: "Cytomegalovirus illustration", caption: "Cytomegalovirus (CMV)", description: "Congenital CMV: maternal transmission, microcephaly, hearing loss, and antiviral management" }],
  "cytomegalovirus": [{ file: "CMV.png", alt: "Cytomegalovirus illustration", caption: "Cytomegalovirus (CMV)", description: "Congenital CMV: maternal transmission, microcephaly, hearing loss, and antiviral management" }],
  "carbon monoxide": [{ file: "co.png", alt: "Carbon monoxide poisoning illustration", caption: "Carbon Monoxide Poisoning", description: "CO binds hemoglobin, causing hypoxia: headache, dizziness, cherry-red skin, high-flow oxygen treatment" }],
  "co poisoning": [{ file: "co.png", alt: "Carbon monoxide poisoning illustration", caption: "Carbon Monoxide Poisoning", description: "CO binds hemoglobin, causing hypoxia: headache, dizziness, cherry-red skin, high-flow oxygen treatment" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome illustration", caption: "Compartment Syndrome", description: "Increased pressure within muscle compartment: 5 P's, fasciotomy, and neurovascular assessment" }],
  "concussion": [{ file: "concussion.png", alt: "Concussion illustration", caption: "Concussion", description: "Mild traumatic brain injury: headache, confusion, memory disturbance, and return-to-activity protocol" }],
  "constipation": [{ file: "constipation.png", alt: "Constipation illustration", caption: "Constipation", description: "Slow colonic transit, hard stool formation, and management with fiber, fluids, and activity" }],
  "contracture": [{ file: "contracture.png", alt: "Contracture illustration", caption: "Contracture", description: "Joint contracture: muscle fibrosis, limited range of motion, splinting, and stretching prevention" }],
  "covid": [{ file: "covid19.png", alt: "COVID-19 illustration", caption: "COVID-19", description: "SARS-CoV-2 infection: respiratory symptoms, transmission prevention, and vaccination" }],
  "covid-19": [{ file: "covid19.png", alt: "COVID-19 illustration", caption: "COVID-19", description: "SARS-CoV-2 infection: respiratory symptoms, transmission prevention, and vaccination" }],
  "sars-cov-2": [{ file: "covid19.png", alt: "COVID-19 illustration", caption: "COVID-19", description: "SARS-CoV-2 infection: respiratory symptoms, transmission prevention, and vaccination" }],
  "cranial nerve": [{ file: "cranialnerves.png", alt: "Cranial nerves illustration", caption: "Cranial Nerves", description: "Twelve cranial nerves: pathways, functions, and clinical assessment" }],
  "cranial nerves": [{ file: "cranialnerves.png", alt: "Cranial nerves illustration", caption: "Cranial Nerves", description: "Twelve cranial nerves: pathways, functions, and clinical assessment" }],
  "crohn": [{ file: "crohns.png", alt: "Crohn's disease illustration", caption: "Crohn's Disease", description: "Inflammatory bowel disease: skip lesions, transmural inflammation, fistulas, and strictures" }],
  "crohns disease": [{ file: "crohns.png", alt: "Crohn's disease illustration", caption: "Crohn's Disease", description: "Inflammatory bowel disease: skip lesions, transmural inflammation, fistulas, and strictures" }],
  "crohn's disease": [{ file: "crohns.png", alt: "Crohn's disease illustration", caption: "Crohn's Disease", description: "Inflammatory bowel disease: skip lesions, transmural inflammation, fistulas, and strictures" }],
  "cushing syndrome": [{ file: "cushing.png", alt: "Cushing syndrome illustration", caption: "Cushing Syndrome", description: "Cortisol excess: moon face, buffalo hump, central obesity, purple striae, and thin extremities" }],
  "cushing's syndrome": [{ file: "cushing.png", alt: "Cushing syndrome illustration", caption: "Cushing Syndrome", description: "Cortisol excess: moon face, buffalo hump, central obesity, purple striae, and thin extremities" }],
  "cushings": [{ file: "cushing.png", alt: "Cushing syndrome illustration", caption: "Cushing Syndrome", description: "Cortisol excess: moon face, buffalo hump, central obesity, purple striae, and thin extremities" }],
  "delirium": [{ file: "delirium.png", alt: "Delirium illustration", caption: "Delirium", description: "Acute brain dysfunction: sudden onset, fluctuating consciousness, and reversible causes" }],
  "dementia": [{ file: "dementia.png", alt: "Dementia illustration", caption: "Dementia", description: "Progressive cognitive decline: memory loss, disorientation, and supportive care strategies" }],
  "dengue": [{ file: "dengue.png", alt: "Dengue fever illustration", caption: "Dengue Fever", description: "Mosquito-borne viral illness: high fever, hemorrhagic complications, and supportive management" }],
  "dengue fever": [{ file: "dengue.png", alt: "Dengue fever illustration", caption: "Dengue Fever", description: "Mosquito-borne viral illness: high fever, hemorrhagic complications, and supportive management" }],
  "diabetes insipidus": [{ file: "diabetesinsipidus.png", alt: "Diabetes insipidus illustration", caption: "Diabetes Insipidus", description: "ADH deficiency or resistance: massive dilute urine output, dehydration, and desmopressin treatment" }],
  "diabetic nephropathy": [{ file: "diabeticnephropathy.png", alt: "Diabetic nephropathy illustration", caption: "Diabetic Nephropathy", description: "Diabetes-related kidney damage: microalbuminuria, glomerular changes, and ACE inhibitor protection" }],
  "diarrhea": [{ file: "diarrhea.png", alt: "Diarrhea illustration", caption: "Diarrhea", description: "Increased stool frequency and fluidity: causes, dehydration risk, and fluid replacement" }],
  "multiple sclerosis": [{ file: "MS", alt: "Multiple sclerosis illustration", caption: "Multiple Sclerosis", description: "Autoimmune demyelinating disease: relapsing-remitting, progressive forms, and disease-modifying therapies" }],
  "ms ": [{ file: "MS", alt: "Multiple sclerosis illustration", caption: "Multiple Sclerosis", description: "Autoimmune demyelinating disease affecting central nervous system myelin" }],
  "mumps": [{ file: "mumps", alt: "Mumps illustration", caption: "Mumps", description: "Viral parotitis: parotid gland swelling, fever, and orchitis risk" }],
  "parotitis": [{ file: "mumps", alt: "Mumps illustration", caption: "Mumps", description: "Viral parotitis: parotid gland swelling, complications, and MMR vaccination" }],
  "myasthenia gravis": [{ file: "myastheniagravis", alt: "Myasthenia gravis illustration", caption: "Myasthenia Gravis", description: "Autoimmune neuromuscular junction disorder: ptosis, diplopia, and cholinergic crisis" }],
  "narcolepsy": [{ file: "narcolepsy", alt: "Narcolepsy illustration", caption: "Narcolepsy", description: "Sleep disorder with excessive daytime sleepiness, cataplexy, and sleep attacks" }],
  "necrotizing enterocolitis": [{ file: "nec", alt: "Necrotizing enterocolitis illustration", caption: "Necrotizing Enterocolitis (NEC)", description: "Neonatal bowel necrosis: abdominal distension, bloody stools, and pneumatosis intestinalis" }],
  "nec": [{ file: "nec", alt: "Necrotizing enterocolitis illustration", caption: "NEC", description: "Necrotizing enterocolitis: most common GI emergency in neonates" }],
  "neonatal reflexes": [{ file: "neonatalreflex", alt: "Neonatal reflexes illustration", caption: "Neonatal Reflexes", description: "Primitive reflexes assessment: Moro, rooting, sucking, Babinski, and tonic neck" }],
  "ng tube": [{ file: "ngtube", alt: "NG tube illustration", caption: "Nasogastric Tube", description: "NG tube insertion, placement verification, and management" }],
  "nasogastric": [{ file: "ngtube", alt: "NG tube illustration", caption: "Nasogastric Tube", description: "Nasogastric tube: insertion technique, placement confirmation, and care" }],
  "obstructive uropathy": [{ file: "obstructiveuropathy", alt: "Obstructive uropathy illustration", caption: "Obstructive Uropathy", description: "Urinary tract obstruction: hydronephrosis, causes, and management" }],
  "urinary obstruction": [{ file: "obstructiveuropathy", alt: "Obstructive uropathy illustration", caption: "Obstructive Uropathy", description: "Urinary tract obstruction: hydronephrosis, causes, and management" }],
  "opioid overdose": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Opioid Overdose", description: "Opioid toxicity: respiratory depression, pinpoint pupils, and naloxone reversal" }],
  "naloxone": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Naloxone Administration", description: "Opioid antagonist for overdose reversal: dosing, monitoring, and re-sedation risk" }],
  "narcan": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Narcan (Naloxone)", description: "Opioid antagonist for overdose reversal" }],
  "osteoporosis": [{ file: "osteoporosis", alt: "Osteoporosis illustration", caption: "Osteoporosis", description: "Bone density loss: DEXA screening, bisphosphonates, and fall prevention" }],
  "otitis media": [{ file: "otitismedia", alt: "Otitis media illustration", caption: "Otitis Media", description: "Middle ear infection: ear pain, bulging tympanic membrane, and antibiotic therapy" }],
  "ear infection": [{ file: "otitismedia", alt: "Otitis media illustration", caption: "Otitis Media", description: "Acute otitis media: symptoms, treatment, and tympanostomy tubes" }],
  "pancreatic pseudocyst": [{ file: "pancreaticpseudocyst", alt: "Pancreatic pseudocyst illustration", caption: "Pancreatic Pseudocyst", description: "Encapsulated fluid collection after pancreatitis: monitoring and drainage" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration", caption: "Pancreatitis", description: "Pancreatic inflammation: Cullen's sign, Grey Turner's sign, and supportive care" }],
  "papilledema": [{ file: "papilledema", alt: "Papilledema illustration", caption: "Papilledema", description: "Optic disc swelling from increased intracranial pressure" }],
  "hypothermia": [{ file: "hypothermja_1773374939606", alt: "NurseNest hypothermia illustration", caption: "Hypothermia", description: "Core temperature < 35°C: stages, shivering, and passive/active rewarming" }],
  "hypothyroidism": [{ file: "hypothyroidism_1773374939606", alt: "NurseNest hypothyroidism illustration", caption: "Hypothyroidism", description: "Decreased thyroid hormone: weight gain, fatigue, cold intolerance, elevated TSH" }],
  "myxedema": [{ file: "hypothyroidism_1773374939606", alt: "NurseNest hypothyroidism illustration", caption: "Myxedema Coma", description: "Severe hypothyroidism emergency: hypothermia, bradycardia, altered consciousness" }],
  "ibs": [{ file: "IBS_1773374939606", alt: "NurseNest IBS illustration", caption: "Irritable Bowel Syndrome", description: "Altered bowel motility, visceral hypersensitivity, and dietary management" }],
  "irritable bowel syndrome": [{ file: "IBS_1773374939606", alt: "NurseNest IBS illustration", caption: "Irritable Bowel Syndrome", description: "Altered bowel motility, visceral hypersensitivity, and dietary management" }],
  "irritable bowel": [{ file: "IBS_1773374939606", alt: "NurseNest IBS illustration", caption: "IBS", description: "Irritable bowel syndrome: Rome criteria, FODMAP diet, stress management" }],
  "intracranial pressure": [{ file: "ICP_1773374939606", alt: "NurseNest ICP illustration", caption: "Increased Intracranial Pressure", description: "Cushing triad: hypertension, bradycardia, irregular respirations" }],
  "icp": [{ file: "ICP_1773374939606", alt: "NurseNest ICP illustration", caption: "ICP", description: "Increased intracranial pressure: monitoring, interventions, and herniation prevention" }],
  "iicp": [{ file: "IICP_1773374939606", alt: "NurseNest IICP illustration", caption: "Increased ICP", description: "Increased intracranial pressure signs, cerebral perfusion, and management" }],
  "iron deficiency anemia": [{ file: "IDA_1773374939606", alt: "NurseNest iron deficiency anemia illustration", caption: "Iron Deficiency Anemia", description: "Microcytic hypochromic anemia: low ferritin, iron supplementation, dietary sources" }],
  "iron deficiency": [{ file: "IDA_1773374939606", alt: "NurseNest iron deficiency anemia illustration", caption: "Iron Deficiency Anemia", description: "Microcytic hypochromic anemia: fatigue, pallor, spoon nails (koilonychia)" }],
  "intussusception": [{ file: "intussusception_1773374939606", alt: "NurseNest intussusception illustration", caption: "Intussusception", description: "Telescoping bowel: currant jelly stool, sausage-shaped mass, air enema reduction" }],
  "ischemic colitis": [{ file: "ischemiccolitis_1773374939606", alt: "NurseNest ischemic colitis illustration", caption: "Ischemic Colitis", description: "Reduced blood flow to colon: abdominal pain, bloody diarrhea, watershed areas" }],
  "klinefelter": [{ file: "klinefelter_1773374939606", alt: "NurseNest Klinefelter syndrome illustration", caption: "Klinefelter Syndrome", description: "47,XXY: tall stature, gynecomastia, small testes, infertility" }],
  "klinefelter syndrome": [{ file: "klinefelter_1773374939606", alt: "NurseNest Klinefelter syndrome illustration", caption: "Klinefelter Syndrome", description: "47,XXY karyotype: hypogonadism, learning difficulties, testosterone replacement" }],
  "korsakoff": [{ file: "Korsakoff_1773374939606", alt: "NurseNest Korsakoff syndrome illustration", caption: "Korsakoff Syndrome", description: "Thiamine deficiency: confabulation, anterograde amnesia, chronic memory impairment" }],
  "korsakoff syndrome": [{ file: "Korsakoff_1773374939606", alt: "NurseNest Korsakoff syndrome illustration", caption: "Korsakoff Syndrome", description: "Wernicke-Korsakoff progression: thiamine replacement, memory support, safety" }],
  "wernicke-korsakoff": [{ file: "Korsakoff_1773374939606", alt: "NurseNest Korsakoff syndrome illustration", caption: "Wernicke-Korsakoff Syndrome", description: "Thiamine deficiency spectrum: ataxia, ophthalmoplegia, confusion to chronic amnesia" }],
  "labyrinthitis": [{ file: "labyrinthitis_1773374939606", alt: "NurseNest labyrinthitis illustration", caption: "Labyrinthitis", description: "Inner ear inflammation: vertigo WITH hearing loss, distinguishing from vestibular neuritis" }],
  "infertility": [{ file: "infertility_1773374939606", alt: "NurseNest infertility illustration", caption: "Infertility", description: "Causes, evaluation, and assisted reproductive technology options" }],
  "influenza": [{ file: "influenza_1773374939606", alt: "NurseNest influenza illustration", caption: "Influenza", description: "Respiratory viral infection: oseltamivir, vaccination, and complications" }],
  "flu": [{ file: "influenza_1773374939606", alt: "NurseNest influenza illustration", caption: "Influenza", description: "Flu: rapid onset fever, myalgia, cough, and antiviral management" }],
  "intimate partner violence": [{ file: "intimatepartnerviolence_1773374939606", alt: "NurseNest intimate partner violence illustration", caption: "Intimate Partner Violence", description: "IPV screening, safety assessment, mandatory reporting, and intervention" }],
  "ipv": [{ file: "intimatepartnerviolence_1773374939606", alt: "NurseNest IPV illustration", caption: "IPV", description: "Intimate partner violence: screening tools, safety planning, documentation" }],
  "domestic violence": [{ file: "intimatepartnerviolence_1773374939606", alt: "NurseNest domestic violence illustration", caption: "Domestic Violence", description: "Recognition, screening, safety planning, and mandatory reporting protocols" }],
  "feeding tube irrigation": [{ file: "irrigation_1773374939606", alt: "NurseNest feeding tube irrigation illustration", caption: "Feeding Tube Irrigation", description: "Tube patency maintenance: flushing technique, water amount, and frequency" }],
  "tube irrigation": [{ file: "irrigation_1773374939606", alt: "NurseNest tube irrigation illustration", caption: "Tube Irrigation", description: "Enteral feeding tube irrigation: proper technique and clog prevention" }],
  "parkinson": [{ file: "parkinson_1773375118294", alt: "Parkinson's disease illustration", caption: "Parkinson's Disease", description: "Dopaminergic neuron degeneration: tremor, rigidity, bradykinesia, postural instability" }],
  "parkinsons": [{ file: "parkinson_1773375118294", alt: "Parkinson's disease illustration", caption: "Parkinson's Disease", description: "Dopaminergic neuron degeneration: tremor, rigidity, bradykinesia, postural instability" }],
  "levodopa": [{ file: "parkinson_1773375118294", alt: "Parkinson's disease illustration", caption: "Parkinson's Disease", description: "Levodopa/carbidopa therapy for Parkinson's disease" }],
  "pcos": [{ file: "pcos_1773375118294", alt: "PCOS illustration", caption: "Polycystic Ovary Syndrome", description: "Rotterdam criteria: oligo/anovulation, hyperandrogenism, polycystic ovaries" }],
  "polycystic ovary": [{ file: "pcos_1773375118294", alt: "PCOS illustration", caption: "Polycystic Ovary Syndrome", description: "PCOS diagnosis, fertility management, and hormonal treatment" }],
  "bronchopulmonary dysplasia": [{ file: "PD_1773375118294", alt: "Bronchopulmonary dysplasia illustration", caption: "Bronchopulmonary Dysplasia (BPD)", description: "Chronic lung disease of prematurity from prolonged ventilation and oxygen exposure" }],
  "bpd": [{ file: "PD_1773375118294", alt: "Bronchopulmonary dysplasia illustration", caption: "BPD", description: "Bronchopulmonary dysplasia in premature infants" }],
  "pediatric seizure": [{ file: "pediatricseizures_1773375118294", alt: "Pediatric seizures illustration", caption: "Pediatric Seizures", description: "Seizure types, febrile seizures, and emergency management in children" }],
  "febrile seizure": [{ file: "pediatricseizures_1773375118294", alt: "Pediatric seizures illustration", caption: "Febrile Seizures", description: "Temperature-triggered seizures in children 6 months to 5 years" }],
  "absence seizure": [{ file: "pediatricseizures_1773375118294", alt: "Pediatric seizures illustration", caption: "Absence Seizures", description: "Brief staring spells treated with ethosuximide or valproic acid" }],
  "pemphigus": [{ file: "pemphigus_1773375118294", alt: "Pemphigus vulgaris illustration", caption: "Pemphigus Vulgaris", description: "Autoimmune blistering disorder with intraepidermal blister formation" }],
  "pemphigus vulgaris": [{ file: "pemphigus_1773375118294", alt: "Pemphigus vulgaris illustration", caption: "Pemphigus Vulgaris", description: "Autoimmune blistering skin disorder affecting mucous membranes" }],
  "peptic ulcer": [{ file: "pepticulcer_1773375118294", alt: "Peptic ulcer illustration", caption: "Peptic Ulcer Disease", description: "Gastric and duodenal ulcers: H. pylori, NSAIDs, PPI therapy" }],
  "duodenal ulcer": [{ file: "pepticulcer_1773375118294", alt: "Peptic ulcer illustration", caption: "Duodenal Ulcer", description: "Pain relieved by eating, H. pylori triple therapy" }],
  "gastric ulcer": [{ file: "pepticulcer_1773375118294", alt: "Peptic ulcer illustration", caption: "Gastric Ulcer", description: "Pain worsened by eating, risk of gastric cancer" }],
  "peripheral neuropathy": [{ file: "peripheralneuropathy_1773375118294", alt: "Peripheral neuropathy illustration", caption: "Peripheral Neuropathy", description: "Nerve damage causing numbness, tingling, and pain in extremities" }],
  "diabetic neuropathy": [{ file: "peripheralneuropathy_1773375118294", alt: "Peripheral neuropathy illustration", caption: "Diabetic Neuropathy", description: "Diabetes-related nerve damage and neuropathic pain management" }],
  "phimosis": [{ file: "phimosis_1773375118294", alt: "Phimosis illustration", caption: "Phimosis", description: "Tight foreskin unable to retract: treatment and management" }],
  "polycystic kidney": [{ file: "polycystickidneydisease_1773375118294", alt: "Polycystic kidney disease illustration", caption: "Polycystic Kidney Disease", description: "Genetic disorder with multiple renal cysts progressing to ESRD" }],
  "polycystic kidney disease": [{ file: "polycystickidneydisease_1773375118294", alt: "Polycystic kidney disease illustration", caption: "Polycystic Kidney Disease", description: "Autosomal dominant PKD: flank pain, HTN, hematuria, enlarged kidneys" }],
  "polycythemia": [{ file: "polycythemia_1773375118294", alt: "Polycythemia vera illustration", caption: "Polycythemia Vera", description: "Overproduction of RBCs: phlebotomy, aspirin, hydroxyurea" }],
  "polycythemia vera": [{ file: "polycythemia_1773375118294", alt: "Polycythemia vera illustration", caption: "Polycythemia Vera", description: "JAK2 mutation with excess RBC production and hyperviscosity" }],
  "endometrial polyp": [{ file: "polyp_1773375118294", alt: "Endometrial polyp illustration", caption: "Endometrial Polyp", description: "Uterine polyps causing abnormal bleeding and infertility" }],
  "uterine polyp": [{ file: "polyp_1773375118294", alt: "Endometrial polyp illustration", caption: "Uterine Polyp", description: "Endometrial polyps: diagnosis and hysteroscopic removal" }],
  "pressure injury": [{ file: "pressureinjurystages_1773375303320.png", alt: "Pressure injury stages illustration showing Stage I through Stage IV tissue damage", caption: "Pressure Injury Stages", description: "Pressure injury staging: erythema, blister, fat exposure, bone exposure, necrosis, and ischemia" }],
  "pressure injury stages": [{ file: "pressureinjurystages_1773375303320.png", alt: "Pressure injury stages illustration showing Stage I through Stage IV tissue damage", caption: "Pressure Injury Stages", description: "Pressure injury staging: erythema, blister, fat exposure, bone exposure, necrosis, and ischemia" }],
  "pressure ulcer": [{ file: "pressureinjurystages_1773375303320.png", alt: "Pressure injury stages illustration showing Stage I through Stage IV tissue damage", caption: "Pressure Injury Stages", description: "Pressure injury staging: erythema, blister, fat exposure, bone exposure, necrosis, and ischemia" }],
  "decubitus": [{ file: "pressureinjurystages_1773375303320.png", alt: "Pressure injury stages illustration showing Stage I through Stage IV tissue damage", caption: "Pressure Injury Stages", description: "Pressure ulcer staging from Stage 1 to unstageable" }],
  "decubitus ulcer": [{ file: "pressureinjurystages_1773375303320.png", alt: "Pressure injury stages illustration showing Stage I through Stage IV tissue damage", caption: "Pressure Injury Stages", description: "Pressure injury staging: erythema, blister, fat exposure, bone exposure, necrosis, and ischemia" }],
  "prostate cancer": [{ file: "prostatecancer_1773375303320.png", alt: "Prostate cancer illustration showing tumor, PSA testing, biopsy, and bone metastasis", caption: "Prostate Cancer", description: "Prostate cancer: tumor growth, PSA screening, digital rectal exam, biopsy, and metastasis" }],
  "prostate": [{ file: "prostatecancer_1773375303320.png", alt: "Prostate cancer illustration showing tumor, PSA testing, biopsy, and bone metastasis", caption: "Prostate Cancer", description: "Prostate cancer: tumor growth, PSA screening, digital rectal exam, biopsy, and metastasis" }],
  "psa": [{ file: "prostatecancer_1773375303320.png", alt: "Prostate cancer illustration showing tumor, PSA testing, biopsy, and bone metastasis", caption: "Prostate Cancer", description: "Prostate cancer: PSA screening, digital rectal exam, and management" }],
  "pulse assessment": [{ file: "pulseassessment_1773375303320.png", alt: "Peripheral pulse assessment illustration showing pulse sites, rate, rhythm, and amplitude", caption: "Peripheral Pulse Assessment", description: "Pulse assessment: radial, brachial, femoral, popliteal, dorsalis pedis, posterior tibial sites" }],
  "peripheral pulse": [{ file: "pulseassessment_1773375303320.png", alt: "Peripheral pulse assessment illustration showing pulse sites, rate, rhythm, and amplitude", caption: "Peripheral Pulse Assessment", description: "Peripheral pulse assessment: pulse sites, rate, rhythm, strength, and circulation" }],
  "pulse sites": [{ file: "pulseassessment_1773375303320.png", alt: "Peripheral pulse assessment illustration showing pulse sites, rate, rhythm, and amplitude", caption: "Peripheral Pulse Assessment", description: "Pulse sites: radial, brachial, femoral, popliteal, dorsalis pedis, posterior tibial" }],
  "pupil assessment": [{ file: "pupilassessment_1773375303320.png", alt: "Pupil assessment illustration showing PERRLA, consensual response, and neurological findings", caption: "Pupil Assessment", description: "Pupil assessment: PERRLA, direct and consensual light response, fixed and dilated pupils" }],
  "perrla": [{ file: "pupilassessment_1773375303320.png", alt: "Pupil assessment illustration showing PERRLA, consensual response, and neurological findings", caption: "Pupil Assessment", description: "PERRLA: Pupils Equal, Round, Reactive to Light and Accommodation" }],
  "pupil reaction": [{ file: "pupilassessment_1773375303320.png", alt: "Pupil assessment illustration showing PERRLA, consensual response, and neurological findings", caption: "Pupil Assessment", description: "Pupil reaction assessment: direct and consensual light response, neurological evaluation" }],
  "rheumatoid arthritis": [{ file: "ra_1773375303320.png", alt: "Rheumatoid arthritis illustration showing joint inflammation, synovium destruction, and hand deformity", caption: "Rheumatoid Arthritis", description: "Rheumatoid arthritis: autoimmune joint inflammation, pannus formation, cartilage erosion, and ulnar deviation" }],
  "ra": [{ file: "ra_1773375303320.png", alt: "Rheumatoid arthritis illustration showing joint inflammation, synovium destruction, and hand deformity", caption: "Rheumatoid Arthritis", description: "RA: autoimmune joint inflammation, pannus formation, cartilage erosion, and ulnar deviation" }],
  "rabies": [{ file: "rabies_1773375303320.png", alt: "Rabies illustration showing animal bite transmission, neural spread, encephalitis, and post-exposure prophylaxis", caption: "Rabies", description: "Rabies: viral transmission via animal bite, neural spread, hydrophobia, encephalitis, and vaccination" }],
  "rabies virus": [{ file: "rabies_1773375303320.png", alt: "Rabies illustration showing animal bite transmission, neural spread, encephalitis, and post-exposure prophylaxis", caption: "Rabies", description: "Rabies virus: transmission, incubation, CNS involvement, and post-exposure prophylaxis" }],
  "ramsay hunt": [{ file: "ramsayhunt_1773375303320.png", alt: "Ramsay Hunt syndrome illustration showing facial paralysis, ear vesicles, and cranial nerve VII involvement", caption: "Ramsay Hunt Syndrome", description: "Ramsay Hunt syndrome: VZV reactivation, facial nerve paralysis, ear vesicles, hearing loss, and vertigo" }],
  "ramsay hunt syndrome": [{ file: "ramsayhunt_1773375303320.png", alt: "Ramsay Hunt syndrome illustration showing facial paralysis, ear vesicles, and cranial nerve VII involvement", caption: "Ramsay Hunt Syndrome", description: "Ramsay Hunt syndrome: VZV reactivation, facial nerve paralysis, ear vesicles, hearing loss, and vertigo" }],
  "rectal medication": [{ file: "rectalmedication_1773375303320.png", alt: "Rectal medication administration illustration showing suppository insertion technique", caption: "Rectal Medication Administration", description: "Rectal medication: suppository insertion, positioning, absorption, and nursing considerations" }],
  "suppository": [{ file: "rectalmedication_1773375303320.png", alt: "Rectal medication administration illustration showing suppository insertion technique", caption: "Rectal Medication Administration", description: "Suppository administration: rectal insertion technique, patient positioning, and retention" }],
  "rectal administration": [{ file: "rectalmedication_1773375303320.png", alt: "Rectal medication administration illustration showing suppository insertion technique", caption: "Rectal Medication Administration", description: "Rectal administration: suppository insertion, medication absorption, and patient education" }],
  "restless leg syndrome": [{ file: "restlessleg_1773375303320.png", alt: "Restless leg syndrome illustration showing leg discomfort and movement urge", caption: "Restless Leg Syndrome", description: "Restless leg syndrome: uncomfortable leg sensations, urge to move, sleep disruption, and dopamine agonist treatment" }],
  "rls": [{ file: "restlessleg_1773375303320.png", alt: "Restless leg syndrome illustration showing leg discomfort and movement urge", caption: "Restless Leg Syndrome", description: "RLS: uncomfortable leg sensations, sleep disruption, and dopaminergic treatment" }],
  "restless legs": [{ file: "restlessleg_1773375303320.png", alt: "Restless leg syndrome illustration showing leg discomfort and movement urge", caption: "Restless Leg Syndrome", description: "Restless legs: uncomfortable sensations, movement relief, and management" }],
  "retinal detachment": [{ file: "retinaldetachment_1773375303320.png", alt: "Retinal detachment illustration showing retinal layer separation and visual symptoms", caption: "Retinal Detachment", description: "Retinal detachment: separation of retinal layers, floaters, flashes, curtain-like vision loss, and surgical repair" }],
  "reye syndrome": [{ file: "reye_1773375303320.png", alt: "Reye syndrome illustration showing liver and brain involvement after viral illness", caption: "Reye Syndrome", description: "Reye syndrome: acute encephalopathy, hepatic failure, aspirin association, and supportive management" }],
  "reye's syndrome": [{ file: "reye_1773375303320.png", alt: "Reye syndrome illustration showing liver and brain involvement after viral illness", caption: "Reye Syndrome", description: "Reye's syndrome: acute encephalopathy, hepatic failure, aspirin association in children" }],
  "reyes": [{ file: "reye_1773375303320.png", alt: "Reye syndrome illustration showing liver and brain involvement after viral illness", caption: "Reye Syndrome", description: "Reye syndrome: aspirin-related encephalopathy and liver failure in children" }],
  "rh incompatibility": [{ file: "rhincompatibility_1773375303320.png", alt: "Rh incompatibility illustration showing maternal-fetal blood type conflict and RhoGAM prophylaxis", caption: "Rh Incompatibility", description: "Rh incompatibility: Rh-negative mother, Rh-positive fetus, antibody formation, hemolytic disease, and RhoGAM" }],
  "rhig": [{ file: "rhincompatibility_1773375303320.png", alt: "Rh incompatibility illustration showing maternal-fetal blood type conflict and RhoGAM prophylaxis", caption: "Rh Incompatibility", description: "RhIG (RhoGAM): prevention of Rh sensitization in Rh-negative mothers" }],
  "rh factor": [{ file: "rhincompatibility_1773375303320.png", alt: "Rh incompatibility illustration showing maternal-fetal blood type conflict and RhoGAM prophylaxis", caption: "Rh Incompatibility", description: "Rh factor incompatibility: maternal-fetal blood type conflict and isoimmunization prevention" }],
  "rh negative": [{ file: "rhincompatibility_1773375303320.png", alt: "Rh incompatibility illustration showing maternal-fetal blood type conflict and RhoGAM prophylaxis", caption: "Rh Incompatibility", description: "Rh-negative mother: risk of isoimmunization, hemolytic disease, and RhoGAM prophylaxis" }],
  "rhinosinusitis": [{ file: "rhinosinusitis_1773375303320.png", alt: "Rhinosinusitis illustration showing sinus inflammation, congestion, and drainage obstruction", caption: "Rhinosinusitis", description: "Rhinosinusitis: sinus inflammation, mucosal swelling, congestion, and treatment" }],
  "sinusitis": [{ file: "rhinosinusitis_1773375303320.png", alt: "Rhinosinusitis illustration showing sinus inflammation, congestion, and drainage obstruction", caption: "Rhinosinusitis", description: "Sinusitis: sinus infection, facial pain, nasal congestion, and antibiotic therapy" }],
  "rib fracture": [{ file: "ribfracture_1773375303320.png", alt: "Rib fracture illustration showing fractured ribs, pain with breathing, and complications", caption: "Rib Fractures", description: "Rib fractures: pain with inspiration, splinting, flail chest risk, and pulmonary complications" }],
  "rib fractures": [{ file: "ribfracture_1773375303320.png", alt: "Rib fracture illustration showing fractured ribs, pain with breathing, and complications", caption: "Rib Fractures", description: "Rib fractures: pain with inspiration, splinting, flail chest risk, and pulmonary complications" }],
  "flail chest": [{ file: "ribfracture_1773375303320.png", alt: "Rib fracture illustration showing fractured ribs, pain with breathing, and complications", caption: "Rib Fractures", description: "Flail chest: multiple rib fractures, paradoxical chest movement, and respiratory compromise" }],
  "rickets": [{ file: "rickets_1773375303320.png", alt: "Rickets illustration showing bone softening, bowed legs, and vitamin D deficiency", caption: "Rickets", description: "Rickets: vitamin D deficiency, calcium malabsorption, bone softening, bowed legs, and growth plate changes" }],
  "vitamin d deficiency": [{ file: "rickets_1773375303320.png", alt: "Rickets illustration showing bone softening, bowed legs, and vitamin D deficiency", caption: "Rickets", description: "Vitamin D deficiency: rickets in children, osteomalacia, and calcium metabolism" }],
  "retinopathy of prematurity": [{ file: "ROP_1773375303320.jpeg", alt: "Retinopathy of prematurity illustration showing abnormal retinal vessel development in preterm infants", caption: "Retinopathy of Prematurity (ROP)", description: "ROP: abnormal retinal vascularization in preterm infants, oxygen exposure risk, and screening" }],
  "rop": [{ file: "ROP_1773375303320.jpeg", alt: "Retinopathy of prematurity illustration showing abnormal retinal vessel development in preterm infants", caption: "Retinopathy of Prematurity (ROP)", description: "ROP: abnormal retinal vascularization in preterm infants, oxygen exposure risk, and screening" }],
  "retinopathy prematurity": [{ file: "ROP_1773375303320.jpeg", alt: "Retinopathy of prematurity illustration showing abnormal retinal vessel development in preterm infants", caption: "Retinopathy of Prematurity (ROP)", description: "Retinopathy of prematurity: preterm infant eye disease, screening, and laser treatment" }],
  "prostatitis": [{ file: "rostatitis_1773375229956", alt: "Prostatitis illustration", caption: "Prostatitis", description: "Inflammation of the prostate gland: acute vs chronic, symptoms, and treatment" }],
  "rotavirus": [{ file: "rotavirus_1773375229956", alt: "Rotavirus illustration", caption: "Rotavirus", description: "Leading cause of severe diarrhea in children: dehydration prevention and oral rehydration" }],
  "rubella": [{ file: "rubella_1773375229956", alt: "Rubella illustration", caption: "Rubella", description: "German measles: congenital rubella syndrome, MMR vaccination, and pregnancy considerations" }],
  "german measles": [{ file: "rubella_1773375229956", alt: "Rubella illustration", caption: "Rubella", description: "German measles: congenital rubella syndrome, MMR vaccination, and pregnancy considerations" }],
  "erythema multiforme": [{ file: "rythemamultiforme_1773375229956", alt: "Erythema multiforme illustration", caption: "Erythema Multiforme", description: "Immune-mediated skin condition with target lesions, often triggered by HSV or medications" }],
  "scabies": [{ file: "scabies_1773375229956", alt: "Scabies illustration", caption: "Scabies", description: "Sarcoptes scabiei infestation: burrows, intense itching, permethrin treatment" }],
  "scarlet fever": [{ file: "scarletfever_1773375229956", alt: "Scarlet fever illustration", caption: "Scarlet Fever", description: "Group A streptococcal infection: sandpaper rash, strawberry tongue, penicillin treatment" }],
  "scarlatina": [{ file: "scarletfever_1773375229956", alt: "Scarlet fever illustration", caption: "Scarlet Fever", description: "Scarlatina: streptococcal exotoxin, desquamation, antibiotic treatment" }],
  "scoliosis": [{ file: "scoli_1773375229956", alt: "Scoliosis illustration", caption: "Scoliosis", description: "Lateral curvature of the spine: screening, Cobb angle, bracing and surgery" }],
  "short bowel syndrome": [{ file: "shortbowelsyndrome_1773375229956", alt: "Short bowel syndrome illustration", caption: "Short Bowel Syndrome", description: "Malabsorption after bowel resection: TPN dependence, fluid/electrolyte management" }],
  "short bowel": [{ file: "shortbowelsyndrome_1773375229956", alt: "Short bowel syndrome illustration", caption: "Short Bowel Syndrome", description: "Malabsorption after bowel resection: TPN dependence, fluid/electrolyte management" }],
  "siadh": [{ file: "SIADH_1773375229956", alt: "SIADH illustration", caption: "SIADH", description: "Syndrome of inappropriate ADH: dilutional hyponatremia, fluid restriction, demeclocycline" }],
  "syndrome of inappropriate antidiuretic hormone": [{ file: "SIADH_1773375229956", alt: "SIADH illustration", caption: "SIADH", description: "Excess ADH secretion: water retention, hyponatremia, concentrated urine" }],
  "sickle cell": [{ file: "sicklecell_1773375229956", alt: "Sickle cell disease illustration", caption: "Sickle Cell Disease", description: "Hemoglobin S polymerization: vaso-occlusive crisis, splenic sequestration, hydroxyurea" }],
  "sickle cell disease": [{ file: "sicklecell_1773375229956", alt: "Sickle cell disease illustration", caption: "Sickle Cell Disease", description: "Hemoglobin S polymerization: vaso-occlusive crisis, splenic sequestration, hydroxyurea" }],
  "sickle cell crisis": [{ file: "sicklecell_1773375229956", alt: "Sickle cell disease illustration", caption: "Sickle Cell Crisis", description: "Vaso-occlusive crisis: severe pain, IV fluids, oxygen, opioid analgesia" }],
  "stevens-johnson syndrome": [{ file: "SJS_1773375229956", alt: "Stevens-Johnson syndrome illustration", caption: "Stevens-Johnson Syndrome", description: "Severe drug reaction: mucocutaneous blistering, BSA <10%, burn unit care" }],
  "sjs": [{ file: "SJS_1773375229956", alt: "Stevens-Johnson syndrome illustration", caption: "SJS", description: "Stevens-Johnson syndrome: medication-induced skin and mucous membrane detachment" }],
  "toxic epidermal necrolysis": [{ file: "SJS_1773375229956", alt: "Stevens-Johnson syndrome / TEN illustration", caption: "TEN / SJS", description: "Severe skin detachment: SJS (<10% BSA) vs TEN (>30% BSA)" }],
  "skin assessment": [{ file: "skinassesssment_1773375229956", alt: "Skin assessment illustration", caption: "Skin Assessment", description: "Systematic skin assessment: turgor, color, moisture, lesion identification" }],
  "skin turgor": [{ file: "skinassesssment_1773375229956", alt: "Skin assessment illustration", caption: "Skin Turgor Assessment", description: "Evaluating skin turgor for dehydration: tenting, edema, and tissue integrity" }],
  "spinal stenosis": [{ file: "spinalstenosis_1773375229956", alt: "Spinal stenosis illustration", caption: "Spinal Stenosis", description: "Narrowing of the spinal canal: neurogenic claudication, laminectomy" }],
  "sprain": [{ file: "sprain_1773375229956", alt: "Sprain illustration", caption: "Sprain", description: "Ligament injury: RICE therapy, grading system, and rehabilitation" }],
  "strain": [{ file: "sprain_1773375229956", alt: "Sprain/strain illustration", caption: "Sprain and Strain", description: "Musculoligamentous injury: RICE, immobilization, and rehabilitation" }],
  "stages of labor": [{ file: "stages_1773375229956", alt: "Stages of labor illustration", caption: "Stages of Labor", description: "Labor progression: latent, active, transition, delivery, and placental stages" }],
  "labor stages": [{ file: "stages_1773375229956", alt: "Stages of labor illustration", caption: "Stages of Labor", description: "Four stages of labor and their characteristics" }],
  "stoma care": [{ file: "stoma_1773375229956", alt: "Stoma care illustration", caption: "Stoma Care", description: "Ostomy management: stoma assessment, pouching system, skin protection" }],
  "ostomy": [{ file: "stoma_1773375229956", alt: "Stoma care illustration", caption: "Ostomy Care", description: "Colostomy/ileostomy management: stoma assessment and patient education" }],
  "colostomy": [{ file: "stoma_1773375229956", alt: "Stoma care illustration", caption: "Colostomy Care", description: "Colostomy management: output assessment, pouching, and diet" }],
  "esophageal stricture": [{ file: "stricture_1773375229956", alt: "Esophageal stricture illustration", caption: "Esophageal Stricture", description: "Narrowing of the esophagus: dysphagia, dilation, and management" }],
  "stricture": [{ file: "stricture_1773375229956", alt: "Esophageal stricture illustration", caption: "Esophageal Stricture", description: "Esophageal narrowing: causes, symptoms, and treatment" }],
  "stroke": [{ file: "stroke_1773375229956", alt: "Stroke illustration", caption: "Stroke", description: "FAST assessment: facial drooping, arm weakness, speech difficulty, time to call 911" }],
  "cerebrovascular accident": [{ file: "stroke_1773375229956", alt: "Stroke illustration", caption: "CVA / Stroke", description: "Ischemic vs hemorrhagic stroke: tPA, thrombectomy, and nursing management" }],
  "cva": [{ file: "stroke_1773375229956", alt: "Stroke illustration", caption: "Stroke / CVA", description: "Cerebrovascular accident: recognition, treatment, and rehabilitation" }],
  "tpa": [{ file: "stroke_1773375229956", alt: "Stroke illustration", caption: "tPA / Stroke", description: "Alteplase for ischemic stroke: 4.5-hour window, bleeding precautions" }],
  "sucralfate": [{ file: "sucralfate", alt: "Sucralfate illustration", caption: "Sucralfate", description: "GI protectant: coats ulcer base, take on empty stomach, avoid antacids" }],
  "carafate": [{ file: "sucralfate", alt: "Sucralfate illustration", caption: "Sucralfate (Carafate)", description: "GI protectant: coats ulcer base, take on empty stomach, avoid antacids" }],
  "syndactyly": [{ file: "syndactyly", alt: "Syndactyly illustration", caption: "Syndactyly", description: "Congenital fusion of fingers or toes: surgical separation and post-op care" }],
  "syringomyelia": [{ file: "syringomyelia", alt: "Syringomyelia illustration", caption: "Syringomyelia", description: "Fluid-filled cavity in spinal cord: cape-like pain/temperature loss, muscle wasting" }],
  "tardive dyskinesia": [{ file: "tardivedyskinesia", alt: "Tardive dyskinesia illustration", caption: "Tardive Dyskinesia", description: "Involuntary repetitive movements from long-term antipsychotic use" }],
  "tetanus": [{ file: "tetanus", alt: "Tetanus illustration", caption: "Tetanus", description: "Clostridium tetani infection: lockjaw, muscle spasms, DTaP/Tdap immunization" }],
  "lockjaw": [{ file: "tetanus", alt: "Tetanus illustration", caption: "Tetanus", description: "Clostridium tetani infection: lockjaw, muscle spasms, DTaP/Tdap immunization" }],
  "thalassemia": [{ file: "thalassemia", alt: "Thalassemia illustration", caption: "Thalassemia", description: "Inherited hemoglobin disorder: microcytic anemia, iron overload from transfusions" }],
  "thermoregulation": [{ file: "thermoregulation", alt: "Thermoregulation illustration", caption: "Neonatal Thermoregulation", description: "Newborn temperature regulation: heat loss mechanisms, warming interventions" }],
  "thrombocytopenia": [{ file: "thrombocytopenia", alt: "Thrombocytopenia illustration", caption: "Thrombocytopenia", description: "Low platelet count: bleeding precautions, petechiae, bruising, platelet transfusion" }],
  "low platelets": [{ file: "thrombocytopenia", alt: "Thrombocytopenia illustration", caption: "Thrombocytopenia", description: "Low platelet count: bleeding precautions, petechiae, bruising" }],
  "thyroid storm": [{ file: "thyroidstorm", alt: "Thyroid storm illustration", caption: "Thyroid Storm", description: "Thyrotoxic crisis: PTU, propranolol, cooling, corticosteroids" }],
  "thyrotoxic crisis": [{ file: "thyroidstorm", alt: "Thyroid storm illustration", caption: "Thyroid Storm", description: "Thyrotoxic crisis: PTU, propranolol, cooling, corticosteroids" }],
  "tinnitus": [{ file: "tinnitus", alt: "Tinnitus illustration", caption: "Tinnitus", description: "Ringing in ears: causes include ototoxic drugs, Meniere's, noise exposure" }],
  "tonsillectomy": [{ file: "tonsillectomy", alt: "Tonsillectomy illustration", caption: "Tonsillectomy Post-Op Care", description: "Side-lying position, cool liquids, monitor for bleeding/frequent swallowing" }],
  "traction": [{ file: "traction", alt: "Traction illustration", caption: "Traction", description: "Musculoskeletal traction: weights hanging freely, neurovascular checks, pin care" }],
  "trigeminal neuralgia": [{ file: "trigeminalneuralgia", alt: "Trigeminal neuralgia illustration", caption: "Trigeminal Neuralgia", description: "CN V facial pain: carbamazepine, avoid triggers, microvascular decompression" }],
  "tic douloureux": [{ file: "trigeminalneuralgia", alt: "Trigeminal neuralgia illustration", caption: "Trigeminal Neuralgia", description: "CN V facial pain: carbamazepine, avoid triggers, microvascular decompression" }],
  "trisomy 21": [{ file: "trisomy21", alt: "Trisomy 21 illustration", caption: "Trisomy 21 (Down Syndrome)", description: "Chromosomal disorder: flat facial profile, simian crease, cardiac defects" }],
  "down syndrome": [{ file: "trisomy21", alt: "Trisomy 21 illustration", caption: "Trisomy 21 (Down Syndrome)", description: "Chromosomal disorder: flat facial profile, simian crease, cardiac defects" }],
  "toxic shock syndrome": [{ file: "TSS", alt: "Toxic shock syndrome illustration", caption: "Toxic Shock Syndrome", description: "TSS: high fever, diffuse rash, hypotension, multiorgan involvement" }],
  "tss": [{ file: "TSS", alt: "Toxic shock syndrome illustration", caption: "Toxic Shock Syndrome", description: "TSS: high fever, diffuse rash, hypotension, multiorgan involvement" }],
  "tumor marker": [{ file: "tumormarkers", alt: "Tumor markers illustration", caption: "Tumor Markers", description: "PSA, CA-125, CEA, AFP, beta-hCG: screening and monitoring" }],
  "tumor markers": [{ file: "tumormarkers", alt: "Tumor markers illustration", caption: "Tumor Markers", description: "PSA, CA-125, CEA, AFP, beta-hCG: screening and monitoring" }],
  "turner syndrome": [{ file: "turner", alt: "Turner syndrome illustration", caption: "Turner Syndrome", description: "45,X monosomy: short stature, webbed neck, coarctation of aorta, infertility" }],
  "turner": [{ file: "turner", alt: "Turner syndrome illustration", caption: "Turner Syndrome", description: "45,X monosomy: short stature, webbed neck, coarctation of aorta, infertility" }],
  "turp": [{ file: "TURP", alt: "TURP illustration", caption: "TURP", description: "Transurethral resection of prostate: CBI, monitor for TURP syndrome/hyponatremia" }],
  "transurethral resection": [{ file: "TURP", alt: "TURP illustration", caption: "TURP", description: "Transurethral resection of prostate: CBI, monitor for TURP syndrome/hyponatremia" }],
};


const LESSON_SYSTEM_MAP: Record<string, string[]> = {
  "Cardiovascular": ["cardiovascular", "cardiac", "heart", "hypertension", "angina", "mi", "arrhythmia", "heart-failure", "dvt", "aaa"],
  "Respiratory": ["respiratory", "copd", "asthma", "pneumonia", "chest-tube", "ventilator", "oxygen-therapy", "pulmonary"],
  "Neurological": ["neurological", "stroke", "seizure", "icp", "spinal-cord", "meningitis", "cranial-nerve", "gcs"],
  "GI": ["gastrointestinal", "gi", "bowel", "liver", "hepatitis", "cholecystitis", "pancreatitis", "peptic-ulcer"],
  "Renal": ["renal", "kidney", "ckd", "dialysis", "uti", "nephrotic", "electrolyte"],
  "Endocrine": ["endocrine", "diabetes", "thyroid", "adrenal", "cushing", "addison", "pituitary"],
  "Hematology": ["hematology", "anemia", "sickle-cell", "leukemia", "transfusion", "coagulation", "dic"],
  "Pediatrics": ["pediatrics", "peds", "child", "kawasaki", "pyloric", "intussusception", "cystic-fibrosis"],
  "Maternal": ["maternity", "maternal", "labor", "delivery", "preeclampsia", "placenta", "postpartum", "obstetric"],
  "Neonatal": ["neonatal", "newborn", "neonate", "apgar", "jaundice", "nec", "surfactant"],
  "Oncology": ["oncology", "cancer", "chemo", "neutropenic", "tumor-lysis"],
  "Pharmacology": ["pharmacology", "medication", "drug", "antidote", "dosage"],
  "Mental Health": ["mental-health", "psychiatric", "anxiety", "depression", "bipolar", "schizophrenia", "lithium", "antipsychotic"],
  "Infection": ["infection-control", "isolation", "precautions", "mrsa", "tb", "c-diff", "sepsis"],
  "Procedures": ["procedures", "foley", "chest-tube", "tracheostomy", "ventilator", "iv", "blood-transfusion"],
  "Fundamentals": ["fundamentals", "nursing-process", "vital-signs", "documentation", "assessment", "prioritization"],
  "Safety & Ethics": ["safety", "ethics", "hipaa", "restraint", "informed-consent", "delegation"],
  "Skin": ["skin", "wound", "burns", "pressure-ulcer", "dermatology"],
  "Musculoskeletal": ["musculoskeletal", "orthopedic", "fracture", "traction", "osteoporosis", "arthritis"],
};

function generateContentHash(stem: string, tier: string): string {
  return crypto.createHash("sha256").update(`cat-exam:${tier}:${stem}`).digest("hex").slice(0, 32);
}

function matchImages(question: ExamQuestion): InfographicMatch[] {
  const matches: InfographicMatch[] = [];
  const searchText = `${question.stem} ${question.rationale || ""} ${question.body_system || ""} ${question.topic || ""}`.toLowerCase();

  for (const [keyword, images] of Object.entries(IMAGE_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
            sortOrder: matches.length,
          });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

function matchLessons(question: ExamQuestion): LessonMatch[] {
  const matches: LessonMatch[] = [];
  const searchText = `${question.stem} ${question.rationale || ""} ${question.body_system || ""} ${question.topic || ""} ${question.subtopic || ""}`.toLowerCase();
  const bodySystem = question.body_system || "";

  const systemKeywords = LESSON_SYSTEM_MAP[bodySystem] || [];
  if (systemKeywords.length > 0) {
    const mainKeyword = systemKeywords[0];
    matches.push({
      lessonTitle: `${bodySystem} Lessons`,
      lessonUrl: `/lessons?category=${mainKeyword}`,
      relevanceNote: `Core ${bodySystem.toLowerCase()} content related to this question`,
    });
  }

  const topicKeywords: Record<string, { title: string; url: string; note: string }> = {
    "heart failure": { title: "Heart Failure Management", url: "/lessons/heart-failure", note: "Directly relevant to heart failure assessment and interventions" },
    "diabetes": { title: "Diabetes Management", url: "/lessons/diabetes-management", note: "Covers diabetes assessment, insulin, and complications" },
    "shock": { title: "Types of Shock", url: "/lessons/shock-management", note: "Comprehensive shock recognition and management" },
    "electrolyte": { title: "Electrolyte Imbalances", url: "/lessons/electrolyte-imbalances", note: "Electrolyte normal ranges, symptoms, and nursing interventions" },
    "medication": { title: "Pharmacology Review", url: "/lessons?category=pharmacology", note: "Drug classes, mechanisms, and nursing considerations" },
    "preeclampsia": { title: "Preeclampsia & Eclampsia", url: "/lessons/preeclampsia", note: "Hypertensive disorders of pregnancy" },
    "seizure": { title: "Seizure Management", url: "/lessons/seizure-disorders", note: "Seizure types, medications, and nursing care" },
    "stroke": { title: "Stroke Assessment", url: "/lessons/stroke", note: "Stroke recognition, tPA criteria, and nursing management" },
    "infection control": { title: "Infection Control", url: "/lessons?category=infection-control", note: "Isolation precautions and infection prevention" },
    "wound": { title: "Wound Care", url: "/lessons/wound-care", note: "Wound assessment, staging, and management" },
    "prostatitis": { title: "Prostatitis", url: "/lessons/prostatitis", note: "Prostate inflammation: acute vs chronic, assessment and treatment" },
    "rotavirus": { title: "Rotavirus", url: "/lessons/rotavirus", note: "Rotavirus infection: dehydration prevention in pediatric patients" },
    "rubella": { title: "Rubella", url: "/lessons/rubella", note: "German measles: congenital rubella syndrome and vaccination" },
    "scarlet fever": { title: "Scarlet Fever", url: "/lessons/scarlet-fever", note: "Streptococcal infection with characteristic sandpaper rash" },
    "scoliosis": { title: "Scoliosis", url: "/lessons/scoliosis", note: "Lateral spinal curvature: screening, bracing, and surgical management" },
    "short bowel": { title: "Short Bowel Syndrome", url: "/lessons/short-bowel-syndrome", note: "Malabsorption after bowel resection and nutritional management" },
    "siadh": { title: "SIADH", url: "/lessons/siadh-di", note: "Syndrome of inappropriate ADH: fluid restriction and hyponatremia management" },
    "sickle cell": { title: "Sickle Cell Disease", url: "/lessons/sickle-cell-crisis", note: "Sickle cell crisis prevention and management" },
    "stevens-johnson": { title: "Stevens-Johnson Syndrome", url: "/lessons/stevens-johnson-syndrome", note: "Severe drug reaction: immediate discontinuation and burn care" },
    "spinal stenosis": { title: "Spinal Stenosis", url: "/lessons/spinal-stenosis", note: "Spinal canal narrowing: neurogenic claudication and management" },
    "scabies": { title: "Scabies", url: "/lessons/scabies", note: "Mite infestation: permethrin treatment and contact precautions" },
    "stoma": { title: "Stoma Care", url: "/lessons/stoma-care", note: "Ostomy management: stoma assessment and pouching systems" },
    "esophageal stricture": { title: "Esophageal Stricture", url: "/lessons/esophageal-stricture", note: "Esophageal narrowing: dysphagia management and dilation" },
    "erythema multiforme": { title: "Erythema Multiforme", url: "/lessons/erythema-multiforme", note: "Target lesions triggered by HSV or medications" },
    "skin assessment": { title: "Skin Assessment", url: "/lessons/skin-assessment", note: "Systematic skin assessment: turgor, color, moisture, lesion identification" },
    "skin turgor": { title: "Skin Assessment", url: "/lessons/skin-assessment", note: "Evaluating skin turgor for hydration status" },
    "sprain": { title: "Sprains and Strains", url: "/lessons/sprain", note: "Ligament and muscle injuries: RICE therapy and rehabilitation" },
    "stages of labor": { title: "Stages of Labor", url: "/lessons/stages-of-labor", note: "Labor progression: latent, active, transition, delivery stages" },
    "labor and delivery": { title: "Stages of Labor", url: "/lessons/stages-of-labor", note: "Intrapartum nursing care and labor management" },
  };

  for (const [keyword, lesson] of Object.entries(topicKeywords)) {
    if (searchText.includes(keyword) && !matches.find(m => m.lessonUrl === lesson.url)) {
      matches.push({
        lessonTitle: lesson.title,
        lessonUrl: lesson.url,
        relevanceNote: lesson.note,
      });
    }
  }

  return matches.slice(0, 3);
}

function buildFront(q: ExamQuestion): string {
  return q.stem;
}

function buildBack(q: ExamQuestion): string {
  const parts: string[] = [];
  const correctIdx = Array.isArray(q.correct_answer) ? q.correct_answer[0] : q.correct_answer;
  const opts = Array.isArray(q.options) ? q.options : [];
  
  if (opts.length > 0 && correctIdx !== undefined && correctIdx !== null) {
    const correctOption = typeof opts[correctIdx] === "object" ? (opts[correctIdx] as any).text || opts[correctIdx] : opts[correctIdx];
    parts.push(`✅ Correct Answer: ${correctOption}`);
  }
  
  if (q.rationale) {
    parts.push(`\n📋 Rationale: ${q.rationale}`);
  }
  
  if (q.clinical_pearl) {
    parts.push(`\n💎 Clinical Pearl: ${q.clinical_pearl}`);
  }
  
  if (q.exam_strategy) {
    parts.push(`\n🎯 Exam Strategy: ${q.exam_strategy}`);
  }

  const memoryAid = q.memory_hook || q.mnemonic || null;
  if (memoryAid) {
    parts.push(`\n🧠 Memory Aid: ${memoryAid}`);
  }

  if (q.labs && typeof q.labs === "object") {
    try {
      const labEntries = Array.isArray(q.labs) ? q.labs : Object.entries(q.labs);
      if (labEntries.length > 0) {
        const labStr = Array.isArray(q.labs)
          ? q.labs.map((l: any) => typeof l === "string" ? l : `${l.name || l.label || ""}: ${l.value || l.result || ""}`).join(", ")
          : Object.entries(q.labs).map(([k, v]) => `${k}: ${v}`).join(", ");
        if (labStr.trim()) parts.push(`\n🔬 Lab Values: ${labStr}`);
      }
    } catch {}
  }

  if (q.medication_naming_variant) {
    parts.push(`\n💊 Medication: ${q.medication_naming_variant}`);
  }

  if (q.key_takeaway) {
    parts.push(`\n📌 Key Takeaway: ${q.key_takeaway}`);
  }
  
  return parts.join("\n");
}

function getExamTagsForQuestion(q: ExamQuestion): string[] {
  const tags: string[] = [];
  const tier = (q.tier || "").toLowerCase();
  const exam = (q.exam || "").toUpperCase();

  tags.push(`tier:${tier}`);

  if (exam) {
    tags.push(`exam:${exam}`);
  }

  if (tier === "np" || exam.includes("NP")) {
    if (!tags.includes("exam:NP-CAT")) tags.push("tier:np");
    if (exam.includes("PMHNP")) tags.push("specialty:pmhnp");
    else if (exam.includes("FNP")) tags.push("specialty:fnp");
    else if (exam.includes("AGNP") || exam.includes("AG-NP")) tags.push("specialty:agnp");
    else if (exam.includes("PNP")) tags.push("specialty:pnp");
    else if (exam.includes("WHNP")) tags.push("specialty:whnp");
    else if (exam.includes("ENP")) tags.push("specialty:enp");
    else if (exam.includes("ACNP")) tags.push("specialty:acnp");
  } else if (tier === "rpn" || tier === "pn" || exam.includes("PN") || exam.includes("REX-PN") || exam.includes("NCLEX-PN")) {
    if (!tags.some(t => t.startsWith("exam:"))) tags.push("exam:REx-PN");
  } else if (tier === "rn" || exam.includes("RN") || exam.includes("NCLEX-RN")) {
    if (!tags.some(t => t.startsWith("exam:"))) tags.push("exam:NCLEX-RN");
  }

  if (q.body_system) tags.push(`system:${q.body_system}`);
  if (q.topic) tags.push(`topic:${q.topic}`);

  if (q.tags && Array.isArray(q.tags)) {
    for (const t of q.tags) {
      if (t && !tags.includes(t)) tags.push(t);
    }
  }

  return tags;
}

export async function mapExamQuestionsToFlashcards(): Promise<{
  total: number;
  created: number;
  updated: number;
  skipped: number;
  perTier: Record<string, number>;
  missingData: number;
}> {
  const result = {
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    perTier: {} as Record<string, number>,
    missingData: 0,
  };

  const { rows: [{ eq_count, fb_count }] } = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM exam_questions WHERE status='published' AND career_type='nursing') AS eq_count,
       (SELECT COUNT(*)::int FROM flashcard_bank WHERE status='published') AS fb_count`
  );
  if (fb_count >= eq_count && eq_count > 0) {
    console.log(`[ExamFlashcardMapper] Fast-path: ${fb_count} flashcards >= ${eq_count} nursing questions, skipping`);
    return result;
  }

  const { rows: questions } = await pool.query(
    `SELECT id, tier, exam, stem, options, correct_answer, rationale, body_system, topic, subtopic, 
            difficulty, question_type, clinical_pearl, exam_strategy, distractor_rationales,
            region_scope, career_type, tags, memory_hook
     FROM exam_questions 
     WHERE status = 'published' AND career_type = 'nursing'
     ORDER BY tier, created_at`
  );

  result.total = questions.length;

  for (const q of questions) {
    const question = q as ExamQuestion;
    const contentHash = generateContentHash(question.stem, question.tier);
    
    if (!question.stem || !question.options) {
      result.missingData++;
      continue;
    }

    const images = matchImages(question);
    const lessons = matchLessons(question);
    const front = buildFront(question);
    const back = buildBack(question);
    const examTags = getExamTagsForQuestion(question);

    const correctIdx = Array.isArray(question.correct_answer) ? question.correct_answer[0] : question.correct_answer;
    const opts = Array.isArray(question.options) ? question.options : [];
    let rationaleCorrect = question.rationale || "";
    
    let distractorRationales = question.distractor_rationales;
    if (!distractorRationales && opts.length > 0) {
      const drs: Record<string, string> = {};
      opts.forEach((opt: any, idx: number) => {
        if (idx !== correctIdx) {
          const optText = typeof opt === "object" ? (opt as any).text || String(opt) : String(opt);
          drs[optText] = "This option is incorrect for this clinical scenario.";
        }
      });
      distractorRationales = drs;
    }

    const { rows: existing } = await pool.query(
      `SELECT id FROM flashcard_bank WHERE content_hash = $1`,
      [contentHash]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE flashcard_bank SET
          front = $1, back = $2, options = $3, correct_answer = $4,
          rationale_correct = $5, distractor_rationales = $6,
          clinical_takeaway = $7, exam_pearl = $8,
          rationale_media = $9, lesson_links = $10,
          difficulty = $11, body_system = $12, topic = $13, subtopic = $14,
          region_scope = $15, flashcard_enabled = true, source_type = 'cat_exam',
          source_question_id = $16, question_type = $17, category = $18,
          status = 'published', updated_at = NOW(),
          tags_json = $20, topic_tag = $21
        WHERE id = $19`,
        [
          front, back, JSON.stringify(question.options), JSON.stringify(question.correct_answer),
          rationaleCorrect, JSON.stringify(distractorRationales),
          question.clinical_pearl || null, question.exam_strategy || null,
          JSON.stringify(images), JSON.stringify(lessons),
          question.difficulty, question.body_system, question.topic, question.subtopic,
          question.region_scope || "BOTH", question.id, question.question_type || "mcq",
          question.body_system || "General",
          existing[0].id,
          JSON.stringify(examTags),
          question.topic || question.body_system || "General"
        ]
      );
      result.updated++;
    } else {
      await pool.query(
        `INSERT INTO flashcard_bank (
          tier, front, back, content_hash, status, source_type, source_question_id,
          question_type, options, correct_answer, rationale_correct, distractor_rationales,
          clinical_takeaway, exam_pearl, rationale_media, lesson_links,
          difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
          category, career_type, tags_json, topic_tag
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
        [
          question.tier, front, back, contentHash, "published", "cat_exam", question.id,
          question.question_type || "mcq", JSON.stringify(question.options), JSON.stringify(question.correct_answer),
          rationaleCorrect, JSON.stringify(distractorRationales),
          question.clinical_pearl || null, question.exam_strategy || null,
          JSON.stringify(images), JSON.stringify(lessons),
          question.difficulty, question.body_system, question.topic, question.subtopic,
          question.region_scope || "BOTH", true,
          question.body_system || "General", question.career_type || "nursing",
          JSON.stringify(examTags),
          question.topic || question.body_system || "General"
        ]
      );
      result.created++;
    }

    result.perTier[question.tier] = (result.perTier[question.tier] || 0) + 1;
  }

  return result;
}

export async function generateAlignedFlashcardsFromQuestions(options?: {
  tierFilter?: string;
  examFilter?: string;
  batchSize?: number;
}): Promise<{
  total: number;
  created: number;
  updated: number;
  skipped: number;
  perTier: Record<string, number>;
  perExam: Record<string, number>;
}> {
  const result = {
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    perTier: {} as Record<string, number>,
    perExam: {} as Record<string, number>,
  };

  const tierFilter = options?.tierFilter || null;
  const examFilter = options?.examFilter || null;
  const batchSize = options?.batchSize || 500;

  let whereClause = `eq.status = 'published'`;
  const params: any[] = [];
  let paramIdx = 1;

  if (tierFilter) {
    whereClause += ` AND eq.tier = $${paramIdx}`;
    params.push(tierFilter);
    paramIdx++;
  }
  if (examFilter) {
    whereClause += ` AND eq.exam ILIKE $${paramIdx}`;
    params.push(`%${examFilter}%`);
    paramIdx++;
  }

  const { rows: questions } = await pool.query(
    `SELECT eq.id, eq.tier, eq.exam, eq.stem, eq.options, eq.correct_answer, eq.rationale,
            eq.body_system, eq.topic, eq.subtopic, eq.difficulty, eq.question_type,
            eq.clinical_pearl, eq.exam_strategy, eq.distractor_rationales,
            eq.region_scope, eq.career_type, eq.tags,
            eq.memory_hook
     FROM exam_questions eq
     LEFT JOIN flashcard_bank fb ON fb.source_question_id = eq.id
     WHERE ${whereClause} AND fb.id IS NULL
     ORDER BY eq.tier, eq.exam, eq.created_at
     LIMIT $${paramIdx}`,
    [...params, batchSize]
  );

  result.total = questions.length;

  if (questions.length === 0) {
    console.log(`[FlashcardAlignment] No unlinked questions found for tier=${tierFilter || "all"}, exam=${examFilter || "all"}`);
    return result;
  }

  console.log(`[FlashcardAlignment] Processing ${questions.length} unlinked questions...`);

  for (const q of questions) {
    const question = q as ExamQuestion;

    if (!question.stem || !question.options) {
      result.skipped++;
      continue;
    }

    const baseContentHash = generateContentHash(question.stem, question.tier);
    const questionSpecificHash = crypto.createHash("sha256").update(`aligned:${question.id}`).digest("hex").slice(0, 32);
    const images = matchImages(question);
    const lessons = matchLessons(question);
    const front = buildFront(question);
    const back = buildBack(question);
    const examTags = getExamTagsForQuestion(question);

    const correctIdx = Array.isArray(question.correct_answer) ? question.correct_answer[0] : question.correct_answer;
    const opts = Array.isArray(question.options) ? question.options : [];
    let rationaleCorrect = question.rationale || "";

    let distractorRationales = question.distractor_rationales;
    if (!distractorRationales && opts.length > 0) {
      const drs: Record<string, string> = {};
      opts.forEach((opt: any, idx: number) => {
        if (idx !== correctIdx) {
          const optText = typeof opt === "object" ? (opt as any).text || String(opt) : String(opt);
          drs[optText] = "This option is incorrect for this clinical scenario.";
        }
      });
      distractorRationales = drs;
    }

    const { rows: existingBySource } = await pool.query(
      `SELECT id FROM flashcard_bank WHERE source_question_id = $1`,
      [question.id]
    );

    const { rows: existingByHash } = await pool.query(
      `SELECT id, source_question_id FROM flashcard_bank WHERE content_hash = $1`,
      [baseContentHash]
    );

    const insertValues = [
      front, back, JSON.stringify(question.options), JSON.stringify(question.correct_answer),
      rationaleCorrect, JSON.stringify(distractorRationales),
      question.clinical_pearl || null, question.exam_strategy || null,
      JSON.stringify(images), JSON.stringify(lessons),
      question.difficulty, question.body_system, question.topic, question.subtopic,
      question.region_scope || "BOTH", question.id, question.question_type || "mcq",
      question.body_system || "General",
      JSON.stringify(examTags),
      question.topic || question.body_system || "General"
    ];

    if (existingBySource.length > 0) {
      await pool.query(
        `UPDATE flashcard_bank SET
          front = $1, back = $2, options = $3, correct_answer = $4,
          rationale_correct = $5, distractor_rationales = $6,
          clinical_takeaway = $7, exam_pearl = $8,
          rationale_media = $9, lesson_links = $10,
          difficulty = $11, body_system = $12, topic = $13, subtopic = $14,
          region_scope = $15, flashcard_enabled = true, source_type = 'exam_aligned',
          source_question_id = $16, question_type = $17, category = $18,
          status = 'published', updated_at = NOW(),
          tags_json = $19, topic_tag = $20
        WHERE id = $21`,
        [...insertValues, existingBySource[0].id]
      );
      result.updated++;
    } else if (existingByHash.length > 0 && !existingByHash[0].source_question_id) {
      await pool.query(
        `UPDATE flashcard_bank SET
          front = $1, back = $2, options = $3, correct_answer = $4,
          rationale_correct = $5, distractor_rationales = $6,
          clinical_takeaway = $7, exam_pearl = $8,
          rationale_media = $9, lesson_links = $10,
          difficulty = $11, body_system = $12, topic = $13, subtopic = $14,
          region_scope = $15, flashcard_enabled = true, source_type = 'exam_aligned',
          source_question_id = $16, question_type = $17, category = $18,
          status = 'published', updated_at = NOW(),
          tags_json = $19, topic_tag = $20
        WHERE id = $21`,
        [...insertValues, existingByHash[0].id]
      );
      result.updated++;
    } else {
      try {
        await pool.query(
          `INSERT INTO flashcard_bank (
            tier, front, back, content_hash, status, source_type, source_question_id,
            question_type, options, correct_answer, rationale_correct, distractor_rationales,
            clinical_takeaway, exam_pearl, rationale_media, lesson_links,
            difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
            category, career_type, tags_json, topic_tag
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
          ON CONFLICT (content_hash) DO NOTHING`,
          [
            question.tier, front, back, questionSpecificHash, "published", "exam_aligned", question.id,
            question.question_type || "mcq", JSON.stringify(question.options), JSON.stringify(question.correct_answer),
            rationaleCorrect, JSON.stringify(distractorRationales),
            question.clinical_pearl || null, question.exam_strategy || null,
            JSON.stringify(images), JSON.stringify(lessons),
            question.difficulty, question.body_system, question.topic, question.subtopic,
            question.region_scope || "BOTH", true,
            question.body_system || "General", question.career_type || "nursing",
            JSON.stringify(examTags),
            question.topic || question.body_system || "General"
          ]
        );
        result.created++;
      } catch (err: any) {
        if (err.code === "23505") {
          result.skipped++;
        } else {
          throw err;
        }
      }
    }

    result.perTier[question.tier] = (result.perTier[question.tier] || 0) + 1;
    const examKey = question.exam || "unknown";
    result.perExam[examKey] = (result.perExam[examKey] || 0) + 1;
  }

  console.log(`[FlashcardAlignment] Complete: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped`);
  console.log(`[FlashcardAlignment] Per tier:`, result.perTier);
  console.log(`[FlashcardAlignment] Per exam:`, result.perExam);

  return result;
}

async function exhaustiveAlignForTier(tier: string, batchSize: number = 500): Promise<{
  total: number; created: number; updated: number; skipped: number; perExam: Record<string, number>;
}> {
  const cumulative = { total: 0, created: 0, updated: 0, skipped: 0, perExam: {} as Record<string, number> };
  const maxIterations = 20;

  for (let i = 0; i < maxIterations; i++) {
    const batch = await generateAlignedFlashcardsFromQuestions({ tierFilter: tier, batchSize });
    cumulative.total += batch.total;
    cumulative.created += batch.created;
    cumulative.updated += batch.updated;
    cumulative.skipped += batch.skipped;
    for (const [exam, count] of Object.entries(batch.perExam)) {
      cumulative.perExam[exam] = (cumulative.perExam[exam] || 0) + count;
    }
    if (batch.total === 0) break;
  }

  return cumulative;
}

export async function bulkGenerateAlignedFlashcards(): Promise<{
  np: { total: number; created: number; updated: number; skipped: number; perExam: Record<string, number> };
  rpn: { total: number; created: number; updated: number; skipped: number; perExam: Record<string, number> };
  rn: { total: number; created: number; updated: number; skipped: number; perExam: Record<string, number> };
  summary: { totalProcessed: number; totalCreated: number; totalUpdated: number; totalSkipped: number };
}> {
  console.log("[FlashcardAlignment] Starting bulk aligned flashcard generation for all tiers...");

  const npResult = await exhaustiveAlignForTier("np");
  const rpnResult = await exhaustiveAlignForTier("rpn");
  const rnResult = await exhaustiveAlignForTier("rn");

  const pnResult = await exhaustiveAlignForTier("pn");
  rpnResult.total += pnResult.total;
  rpnResult.created += pnResult.created;
  rpnResult.updated += pnResult.updated;
  rpnResult.skipped += pnResult.skipped;
  for (const [exam, count] of Object.entries(pnResult.perExam)) {
    rpnResult.perExam[exam] = (rpnResult.perExam[exam] || 0) + count;
  }

  const summary = {
    totalProcessed: npResult.total + rpnResult.total + rnResult.total,
    totalCreated: npResult.created + rpnResult.created + rnResult.created,
    totalUpdated: npResult.updated + rpnResult.updated + rnResult.updated,
    totalSkipped: npResult.skipped + rpnResult.skipped + rnResult.skipped,
  };

  console.log(`[FlashcardAlignment] Bulk generation complete:`, summary);

  return {
    np: { total: npResult.total, created: npResult.created, updated: npResult.updated, skipped: npResult.skipped, perExam: npResult.perExam },
    rpn: { total: rpnResult.total, created: rpnResult.created, updated: rpnResult.updated, skipped: rpnResult.skipped, perExam: rpnResult.perExam },
    rn: { total: rnResult.total, created: rnResult.created, updated: rnResult.updated, skipped: rnResult.skipped, perExam: rnResult.perExam },
    summary,
  };
}

export async function getExamFlashcardStats(): Promise<{
  totalExamFlashcards: number;
  perTier: Record<string, number>;
  withImages: number;
  withLessons: number;
  missingImages: number;
  missingLessons: number;
}> {
  const { rows: tierCounts } = await pool.query(
    `SELECT tier, COUNT(*)::int as count FROM flashcard_bank 
     WHERE source_type = 'cat_exam' AND flashcard_enabled = true 
     GROUP BY tier`
  );

  const { rows: imageCounts } = await pool.query(
    `SELECT 
      COUNT(CASE WHEN rationale_media::text != '[]' THEN 1 END)::int as with_images,
      COUNT(CASE WHEN rationale_media::text = '[]' OR rationale_media IS NULL THEN 1 END)::int as missing_images,
      COUNT(CASE WHEN lesson_links::text != '[]' THEN 1 END)::int as with_lessons,
      COUNT(CASE WHEN lesson_links::text = '[]' OR lesson_links IS NULL THEN 1 END)::int as missing_lessons
     FROM flashcard_bank WHERE source_type = 'cat_exam' AND flashcard_enabled = true`
  );

  const perTier: Record<string, number> = {};
  let total = 0;
  for (const r of tierCounts) {
    perTier[r.tier] = r.count;
    total += r.count;
  }

  return {
    totalExamFlashcards: total,
    perTier,
    withImages: imageCounts[0]?.with_images || 0,
    withLessons: imageCounts[0]?.with_lessons || 0,
    missingImages: imageCounts[0]?.missing_images || 0,
    missingLessons: imageCounts[0]?.missing_lessons || 0,
  };
}
