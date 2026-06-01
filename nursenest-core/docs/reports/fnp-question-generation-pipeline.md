# FNP Question Generation Pipeline

Generated: 2026-06-01T21:00:01.164Z
Mode: apply
Blocker: Database-backed production lesson load failed; static lesson inventory was inspected only. Publish blocked: 
Invalid `prisma.pathwayLesson.findMany()` invocation in
/root/nursenest-core/nursenest-core/scripts/generate-fnp-question-flashcard-pipeline.mts:228:43

  225 }
  226 
  227 async function loadDbLessons(prisma: PrismaClient): Promise<Lesson[]> {
→ 228   const rows = await prisma.pathwayLesson.findMany(
The provided database string is invalid. Error parsing connection string: invalid port number in database URL. Please refer to the documentation in https://www.prisma.io/docs/reference/database-reference/connection-urls for constructing a correct connection string. In some cases, certain characters must be escaped. Please check the string for any illegal characters.

## Targets

- Existing FNP pathway: `us-np-fnp`
- Questions per lesson: 25
- Flashcards per lesson: 20
- Question target: 5000+
- Flashcard target: 2000+
- Production-ready lessons prioritized first: 104

## Blueprint Domains

- assessment
- diagnosis
- planning
- evaluation
- pediatrics
- adult
- women
- geriatrics
- pharmacology
- professional role

## Results

- Lessons selected: 200
- Production-ready first block: 104
- Lessons completed: 0
- Questions created: 0
- Questions updated: 0
- Flashcards created: 0
- Flashcards updated: 0
- Failures: 0

## Selected Lesson Order

1. np-hypertension-diagnosis-and-guideline-based-management - Hypertension Diagnosis and Guideline Based Management: NP Diagnosis and Management
2. np-coronary-artery-disease-risk-stratification-and-management - Coronary Artery Disease Risk Stratification and Management: NP Diagnosis and Management
3. np-heart-failure-with-reduced-and-preserved-ejection-fraction - Heart Failure With Reduced and Preserved Ejection Fraction: NP Diagnosis and Management
4. np-atrial-fibrillation-rate-versus-rhythm-control-decisions - Atrial Fibrillation Rate Versus Rhythm Control Decisions: NP Diagnosis and Management
5. np-stable-angina-diagnostic-workup-and-treatment - Stable Angina Diagnostic Workup and Treatment: NP Diagnosis and Management
6. np-acute-coronary-syndrome-recognition-and-initial-management - Acute Coronary Syndrome Recognition and Initial Management: NP Diagnosis and Management
7. np-valvular-heart-disease-murmur-recognition-and-referral - Valvular Heart Disease Murmur Recognition and Referral: NP Diagnosis and Management
8. np-peripheral-artery-disease-diagnosis-and-management - Peripheral Artery Disease Diagnosis and Management: NP Diagnosis and Management
9. np-deep-vein-thrombosis-and-pulmonary-embolism-management - Deep Vein Thrombosis and Pulmonary Embolism Management: NP Diagnosis and Management
10. np-hyperlipidemia-statin-selection-and-monitoring - Hyperlipidemia Statin Selection and Monitoring: NP Diagnosis and Management
11. np-syncope-differential-diagnosis-and-workup - Syncope Differential Diagnosis and Workup: NP Diagnosis and Management
12. np-palpitations-evaluation-and-management - Palpitations Evaluation and Management: NP Diagnosis and Management
13. np-anticoagulation-management-and-reversal-strategies - Anticoagulation Management and Reversal Strategies: NP Diagnosis and Management
14. np-cardiomyopathy-classification-and-management - Cardiomyopathy Classification and Management: NP Diagnosis and Management
15. np-pericarditis-and-myocarditis-diagnosis - Pericarditis and Myocarditis Diagnosis: NP Diagnosis and Management
16. np-aortic-stenosis-severity-assessment-and-timing-of-intervention - Aortic Stenosis Severity Assessment and Timing of Intervention: NP Diagnosis and Management
17. np-mitral-valve-prolapse-evaluation-and-counseling - Mitral Valve Prolapse Evaluation and Counseling: NP Diagnosis and Management
18. np-hypertensive-urgency-versus-emergency-decision-making - Hypertensive Urgency Versus Emergency Decision Making: NP Diagnosis and Management
19. np-cardiac-biomarker-interpretation-in-acute-settings - Cardiac Biomarker Interpretation in Acute Settings: NP Diagnosis and Management
20. np-ecg-interpretation-for-advanced-practice - ECG Interpretation for Advanced Practice: NP Diagnosis and Management
21. np-stress-test-selection-and-result-interpretation - Stress Test Selection and Result Interpretation: NP Diagnosis and Management
22. np-echocardiogram-findings-and-clinical-correlation - Echocardiogram Findings and Clinical Correlation: NP Diagnosis and Management
23. np-cardiac-ct-and-mri-indications-in-outpatient-practice - Cardiac CT and MRI Indications in Outpatient Practice: NP Diagnosis and Management
24. np-cardiovascular-disease-prevention-strategies - Cardiovascular Disease Prevention Strategies: NP Diagnosis and Management
25. np-post-mi-secondary-prevention-and-rehabilitation - Post MI Secondary Prevention and Rehabilitation: NP Diagnosis and Management
26. np-heart-failure-medication-titration-and-monitoring - Heart Failure Medication Titration and Monitoring: NP Diagnosis and Management
27. np-device-therapy-indications-pacemakers-and-icds - Device Therapy Indications Pacemakers and ICDs: NP Diagnosis and Management
28. np-endocarditis-prophylaxis-guidelines-and-risk-stratification - Endocarditis Prophylaxis Guidelines and Risk Stratification: NP Diagnosis and Management
29. np-asthma-diagnosis-and-stepwise-management - Asthma Diagnosis and Stepwise Management: NP Diagnosis and Management
30. np-copd-diagnosis-gold-staging-and-management - COPD Diagnosis GOLD Staging and Management: NP Diagnosis and Management
31. np-pneumonia-cap-versus-hap-diagnosis-and-treatment - Pneumonia CAP Versus HAP Diagnosis and Treatment: NP Diagnosis and Management
32. np-pulmonary-nodule-evaluation-and-follow-up - Pulmonary Nodule Evaluation and Follow Up: NP Diagnosis and Management
33. np-interstitial-lung-disease-recognition-and-referral - Interstitial Lung Disease Recognition and Referral: NP Diagnosis and Management
34. np-pulmonary-embolism-risk-stratification-and-treatment - Pulmonary Embolism Risk Stratification and Treatment: NP Diagnosis and Management
35. np-sleep-apnea-diagnosis-and-cpap-management - Sleep Apnea Diagnosis and CPAP Management: NP Diagnosis and Management
36. np-pleural-effusion-differential-diagnosis-and-workup - Pleural Effusion Differential Diagnosis and Workup: NP Diagnosis and Management
37. np-hemoptysis-evaluation-and-management - Hemoptysis Evaluation and Management: NP Diagnosis and Management
38. np-chronic-cough-diagnostic-algorithm - Chronic Cough Diagnostic Algorithm: NP Diagnosis and Management
39. np-tuberculosis-screening-and-treatment - Tuberculosis Screening and Treatment: NP Diagnosis and Management
40. np-bronchiectasis-diagnosis-and-management - Bronchiectasis Diagnosis and Management: NP Diagnosis and Management
41. np-pulmonary-function-test-interpretation - Pulmonary Function Test Interpretation: NP Diagnosis and Management
42. np-oxygen-therapy-indications-and-prescribing - Oxygen Therapy Indications and Prescribing: NP Diagnosis and Management
43. np-lung-cancer-screening-criteria-and-follow-up - Lung Cancer Screening Criteria and Follow Up: NP Diagnosis and Management
44. np-allergic-rhinitis-and-sinusitis-management - Allergic Rhinitis and Sinusitis Management: NP Diagnosis and Management
45. np-acute-bronchitis-versus-pneumonia-differentiation - Acute Bronchitis Versus Pneumonia Differentiation: NP Diagnosis and Management
46. np-pulmonary-hypertension-recognition-and-referral - Pulmonary Hypertension Recognition and Referral: NP Diagnosis and Management
47. np-sarcoidosis-diagnosis-and-management - Sarcoidosis Diagnosis and Management: NP Diagnosis and Management
48. np-occupational-lung-disease-evaluation - Occupational Lung Disease Evaluation: NP Diagnosis and Management
49. np-cystic-fibrosis-adult-management-basics - Cystic Fibrosis Adult Management Basics: NP Diagnosis and Management
50. np-respiratory-infection-in-immunocompromised-host - Respiratory Infection in Immunocompromised Host: NP Diagnosis and Management
51. np-thoracentesis-indications-and-complications - Thoracentesis Indications and Complications: NP Diagnosis and Management
52. np-mechanical-ventilation-basics-for-np - Mechanical Ventilation Basics for NP: NP Diagnosis and Management
53. np-asthma-copd-overlap-syndrome-management - Asthma COPD Overlap Syndrome Management: NP Diagnosis and Management
54. np-headache-differential-diagnosis-and-management - Headache Differential Diagnosis and Management: NP Diagnosis and Management
55. np-migraine-prophylaxis-and-abortive-therapy - Migraine Prophylaxis and Abortive Therapy: NP Diagnosis and Management
56. np-tension-type-headache-management - Tension Type Headache Management: NP Diagnosis and Management
57. np-cluster-headache-diagnosis-and-treatment - Cluster Headache Diagnosis and Treatment: NP Diagnosis and Management
58. np-seizure-classification-and-antiepileptic-selection - Seizure Classification and Antiepileptic Selection: NP Diagnosis and Management
59. np-stroke-acute-management-and-secondary-prevention - Stroke Acute Management and Secondary Prevention: NP Diagnosis and Management
60. np-tia-workup-and-risk-stratification - TIA Workup and Risk Stratification: NP Diagnosis and Management
61. np-parkinson-disease-diagnosis-and-management - Parkinson Disease Diagnosis and Management: NP Diagnosis and Management
62. np-essential-tremor-evaluation-and-treatment - Essential Tremor Evaluation and Treatment: NP Diagnosis and Management
63. np-multiple-sclerosis-diagnosis-and-disease-modifying-therapy - Multiple Sclerosis Diagnosis and Disease Modifying Therapy: NP Diagnosis and Management
64. np-peripheral-neuropathy-workup-and-management - Peripheral Neuropathy Workup and Management: NP Diagnosis and Management
65. np-dementia-diagnosis-and-disease-modifying-therapy - Dementia Diagnosis and Disease Modifying Therapy: NP Diagnosis and Management
66. np-delirium-recognition-and-management - Delirium Recognition and Management: NP Diagnosis and Management
67. np-meningitis-and-encephalitis-recognition - Meningitis and Encephalitis Recognition: NP Diagnosis and Management
68. np-myasthenia-gravis-diagnosis-and-management - Myasthenia Gravis Diagnosis and Management: NP Diagnosis and Management
69. np-bell-palsy-evaluation-and-treatment - Bell Palsy Evaluation and Treatment: NP Diagnosis and Management
70. np-carpal-tunnel-syndrome-diagnosis-and-management - Carpal Tunnel Syndrome Diagnosis and Management: NP Diagnosis and Management
71. np-low-back-pain-with-radiculopathy-management - Low Back Pain With Radiculopathy Management: NP Diagnosis and Management
72. np-cervical-radiculopathy-evaluation - Cervical Radiculopathy Evaluation: NP Diagnosis and Management
73. np-vertigo-and-dizziness-differential-diagnosis - Vertigo and Dizziness Differential Diagnosis: NP Diagnosis and Management
74. np-syncope-neurologic-evaluation - Syncope Neurologic Evaluation: NP Diagnosis and Management
75. np-neuroimaging-in-clinical-neurology - Neuroimaging in Clinical Neurology: NP Diagnosis and Management
76. np-neuromuscular-junction-disorders - Neuromuscular Junction Disorders: NP Diagnosis and Management
77. np-movement-disorders-beyond-parkinson-disease - Movement Disorders beyond Parkinson Disease: NP Diagnosis and Management
78. np-neurologic-manifestations-of-systemic-disease - Neurologic Manifestations of Systemic Disease: NP Diagnosis and Management
79. np-type-2-diabetes-diagnosis-and-initial-management - Type 2 Diabetes Diagnosis and Initial Management: NP Diagnosis and Management
80. np-type-1-diabetes-insulin-regimen-selection - Type 1 Diabetes Insulin Regimen Selection: NP Diagnosis and Management
81. np-diabetes-medication-selection-beyond-metformin - Diabetes Medication Selection beyond Metformin: NP Diagnosis and Management
82. np-insulin-initiation-and-titration-protocols - Insulin Initiation and Titration Protocols: NP Diagnosis and Management
83. np-continuous-glucose-monitoring-interpretation - Continuous Glucose Monitoring Interpretation: NP Diagnosis and Management
84. np-diabetic-ketoacidosis-recognition-and-management - Diabetic Ketoacidosis Recognition and Management: NP Diagnosis and Management
85. np-hyperosmolar-hyperglycemic-state-management - Hyperosmolar Hyperglycemic State Management: NP Diagnosis and Management
86. np-hypoglycemia-evaluation-and-prevention - Hypoglycemia Evaluation and Prevention: NP Diagnosis and Management
87. np-hypothyroidism-diagnosis-and-levothyroxine-dosing - Hypothyroidism Diagnosis and Levothyroxine Dosing: NP Diagnosis and Management
88. np-hyperthyroidism-diagnosis-and-management - Hyperthyroidism Diagnosis and Management: NP Diagnosis and Management
89. np-thyroid-nodule-evaluation-and-fna-indications - Thyroid Nodule Evaluation and FNA Indications: NP Diagnosis and Management
90. np-thyroid-cancer-follow-up-and-surveillance - Thyroid Cancer Follow Up and Surveillance: NP Diagnosis and Management
91. np-adrenal-insufficiency-diagnosis-and-management - Adrenal Insufficiency Diagnosis and Management: NP Diagnosis and Management
92. np-cushing-syndrome-evaluation - Cushing Syndrome Evaluation: NP Diagnosis and Management
93. np-pheochromocytoma-recognition-and-workup - Pheochromocytoma Recognition and Workup: NP Diagnosis and Management
94. np-hyperparathyroidism-diagnosis-and-management - Hyperparathyroidism Diagnosis and Management: NP Diagnosis and Management
95. np-hypoparathyroidism-management - Hypoparathyroidism Management: NP Diagnosis and Management
96. np-vitamin-d-deficiency-evaluation-and-treatment - Vitamin D Deficiency Evaluation and Treatment: NP Diagnosis and Management
97. np-osteoporosis-diagnosis-and-pharmacotherapy - Osteoporosis Diagnosis and Pharmacotherapy: NP Diagnosis and Management
98. np-metabolic-bone-disease-evaluation - Metabolic Bone Disease Evaluation: NP Diagnosis and Management
99. np-pituitary-adenoma-recognition-and-management - Pituitary Adenoma Recognition and Management: NP Diagnosis and Management
100. np-polycystic-ovary-syndrome-metabolic-management - Polycystic Ovary Syndrome Metabolic Management: NP Diagnosis and Management
101. np-lipid-disorders-diagnosis-and-management - Lipid Disorders Diagnosis and Management: NP Diagnosis and Management
102. np-obesity-pharmacotherapy-selection - Obesity Pharmacotherapy Selection: NP Diagnosis and Management
103. np-electrolyte-disorders-sodium-and-potassium - Electrolyte Disorders Sodium and Potassium: NP Diagnosis and Management
104. np-calcium-disorders-hypercalcemia-and-hypocalcemia - Calcium Disorders Hypercalcemia and Hypocalcemia: NP Diagnosis and Management
105. np-gastroesophageal-reflux-disease-diagnosis-and-management - Gastroesophageal Reflux Disease Diagnosis and Management: NP Diagnosis and Management
106. np-peptic-ulcer-disease-and-h-pylori-management - Peptic Ulcer Disease and H Pylori Management: NP Diagnosis and Management
107. np-dyspepsia-evaluation-and-management - Dyspepsia Evaluation and Management: NP Diagnosis and Management
108. np-inflammatory-bowel-disease-diagnosis-and-management - Inflammatory Bowel Disease Diagnosis and Management: NP Diagnosis and Management
109. np-irritable-bowel-syndrome-diagnosis-and-management - Irritable Bowel Syndrome Diagnosis and Management: NP Diagnosis and Management
110. np-celiac-disease-diagnosis-and-management - Celiac Disease Diagnosis and Management: NP Diagnosis and Management
111. np-hepatitis-b-and-c-evaluation-and-treatment - Hepatitis B and C Evaluation and Treatment: NP Diagnosis and Management
112. np-nonalcoholic-fatty-liver-disease-management - Nonalcoholic Fatty Liver Disease Management: NP Diagnosis and Management
113. np-alcoholic-liver-disease-evaluation - Alcoholic Liver Disease Evaluation: NP Diagnosis and Management
114. np-cirrhosis-complications-management - Cirrhosis Complications Management: NP Diagnosis and Management
115. np-hepatic-encephalopathy-recognition-and-treatment - Hepatic Encephalopathy Recognition and Treatment: NP Diagnosis and Management
116. np-pancreatitis-diagnosis-and-management - Pancreatitis Diagnosis and Management: NP Diagnosis and Management
117. np-gallbladder-disease-evaluation-and-management - Gallbladder Disease Evaluation and Management: NP Diagnosis and Management
118. np-colorectal-cancer-screening-and-surveillance - Colorectal Cancer Screening and Surveillance: NP Diagnosis and Management
119. np-colorectal-polyp-follow-up-guidelines - Colorectal Polyp Follow Up Guidelines: NP Diagnosis and Management
120. np-chronic-constipation-evaluation-and-management - Chronic Constipation Evaluation and Management: NP Diagnosis and Management
121. np-chronic-diarrhea-workup - Chronic Diarrhea Workup: NP Diagnosis and Management
122. np-gi-bleeding-evaluation-and-management - GI Bleeding Evaluation and Management: NP Diagnosis and Management
123. np-dysphagia-evaluation-and-management - Dysphagia Evaluation and Management: NP Diagnosis and Management
124. np-hemorrhoids-and-anorectal-disorders - Hemorrhoids and Anorectal Disorders: NP Diagnosis and Management
125. np-abdominal-pain-diagnostic-approach - Abdominal Pain Diagnostic Approach: NP Diagnosis and Management
126. np-liver-function-test-interpretation-in-gi-disease - Liver Function Test Interpretation in GI Disease: NP Diagnosis and Management
127. np-tumor-marker-interpretation-in-gi-disease - Tumor Marker Interpretation in GI Disease: NP Diagnosis and Management
128. np-endoscopy-indications-and-follow-up - Endoscopy Indications and Follow Up: NP Diagnosis and Management
129. np-nutritional-assessment-and-supplementation - Nutritional Assessment and Supplementation: NP Diagnosis and Management
130. np-short-bowel-syndrome-management - Short Bowel Syndrome Management: NP Diagnosis and Management
131. np-chronic-kidney-disease-staging-and-management - Chronic Kidney Disease Staging and Management: NP Diagnosis and Management
132. np-acute-kidney-injury-recognition-and-workup - Acute Kidney Injury Recognition and Workup: NP Diagnosis and Management
133. np-proteinuria-evaluation-and-management - Proteinuria Evaluation and Management: NP Diagnosis and Management
134. np-hematuria-workup-and-differential-diagnosis - Hematuria Workup and Differential Diagnosis: NP Diagnosis and Management
135. np-urinary-tract-infection-diagnosis-and-management - Urinary Tract Infection Diagnosis and Management: NP Diagnosis and Management
136. np-pyelonephritis-diagnosis-and-treatment - Pyelonephritis Diagnosis and Treatment: NP Diagnosis and Management
137. np-nephrolithiasis-evaluation-and-prevention - Nephrolithiasis Evaluation and Prevention: NP Diagnosis and Management
138. np-glomerulonephritis-recognition-and-referral - Glomerulonephritis Recognition and Referral: NP Diagnosis and Management
139. np-diabetic-nephropathy-prevention-and-management - Diabetic Nephropathy Prevention and Management: NP Diagnosis and Management
140. np-hypertensive-nephrosclerosis-management - Hypertensive Nephrosclerosis Management: NP Diagnosis and Management
141. np-electrolyte-management-in-ckd - Electrolyte Management in CKD: NP Diagnosis and Management
142. np-anemia-of-ckd-evaluation-and-treatment - Anemia of CKD Evaluation and Treatment: NP Diagnosis and Management
143. np-mineral-bone-disorder-in-ckd - Mineral Bone Disorder in CKD: NP Diagnosis and Management
144. np-dialysis-indications-and-preparation - Dialysis Indications and Preparation: NP Diagnosis and Management
145. np-kidney-transplant-follow-up-basics - Kidney Transplant Follow Up Basics: NP Diagnosis and Management
146. np-drug-dosing-in-renal-impairment - Drug Dosing in Renal Impairment: NP Diagnosis and Management
147. np-benign-prostatic-hyperplasia-management - Benign Prostatic Hyperplasia Management: NP Diagnosis and Management
148. np-urinary-incontinence-evaluation-and-treatment - Urinary Incontinence Evaluation and Treatment: NP Diagnosis and Management
149. np-overactive-bladder-management - Overactive Bladder Management: NP Diagnosis and Management
150. np-erectile-dysfunction-evaluation-and-treatment - Erectile Dysfunction Evaluation and Treatment: NP Diagnosis and Management
151. np-prostatitis-diagnosis-and-management - Prostatitis Diagnosis and Management: NP Diagnosis and Management
152. np-testicular-disorders-evaluation - Testicular Disorders Evaluation: NP Diagnosis and Management
153. np-renal-imaging-interpretation - Renal Imaging Interpretation: NP Diagnosis and Management
154. np-urinalysis-in-renal-disease - Urinalysis in Renal Disease: NP Diagnosis and Management
155. np-acid-base-disorders-evaluation - Acid Base Disorders Evaluation: NP Diagnosis and Management
156. np-acne-vulgaris-diagnosis-and-treatment - Acne Vulgaris Diagnosis and Treatment: NP Diagnosis and Management
157. np-rosacea-diagnosis-and-management - Rosacea Diagnosis and Management: NP Diagnosis and Management
158. np-atopic-dermatitis-management - Atopic Dermatitis Management: NP Diagnosis and Management
159. np-contact-dermatitis-evaluation-and-management - Contact Dermatitis Evaluation and Management: NP Diagnosis and Management
160. np-psoriasis-diagnosis-and-treatment - Psoriasis Diagnosis and Treatment: NP Diagnosis and Management
161. np-seborrheic-dermatitis-management - Seborrheic Dermatitis Management: NP Diagnosis and Management
162. np-bacterial-skin-infections-management - Bacterial Skin Infections Management: NP Diagnosis and Management
163. np-viral-skin-infections-diagnosis-and-treatment - Viral Skin Infections Diagnosis and Treatment: NP Diagnosis and Management
164. np-fungal-skin-infections-diagnosis-and-treatment - Fungal Skin Infections Diagnosis and Treatment: NP Diagnosis and Management
165. np-skin-cancer-screening-and-recognition - Skin Cancer Screening and Recognition: NP Diagnosis and Management
166. np-melanoma-recognition-and-referral - Melanoma Recognition and Referral: NP Diagnosis and Management
167. np-basal-cell-carcinoma-management - Basal Cell Carcinoma Management: NP Diagnosis and Management
168. np-squamous-cell-carcinoma-management - Squamous Cell Carcinoma Management: NP Diagnosis and Management
169. np-actinic-keratosis-treatment - Actinic Keratosis Treatment: NP Diagnosis and Management
170. np-pigmented-lesion-evaluation - Pigmented Lesion Evaluation: NP Diagnosis and Management
171. np-urticaria-and-angioedema-management - Urticaria and Angioedema Management: NP Diagnosis and Management
172. np-drug-eruptions-recognition-and-management - Drug Eruptions Recognition and Management: NP Diagnosis and Management
173. np-autoimmune-blistering-disorders-recognition - Autoimmune Blistering Disorders Recognition: NP Diagnosis and Management
174. np-skin-biopsy-techniques-and-indications - Skin Biopsy Techniques and Indications: NP Diagnosis and Management
175. np-cryotherapy-and-electrosurgery-basics - Cryotherapy and Electrosurgery Basics: NP Diagnosis and Management
176. np-wound-care-and-healing-principles - Wound Care and Healing Principles: NP Diagnosis and Management
177. np-leg-ulcer-evaluation-and-management - Leg Ulcer Evaluation and Management: NP Diagnosis and Management
178. np-hidradenitis-suppurativa-management - Hidradenitis Suppurativa Management: NP Diagnosis and Management
179. np-hair-loss-evaluation-and-treatment - Hair Loss Evaluation and Treatment: NP Diagnosis and Management
180. np-nail-disorders-diagnosis - Nail Disorders Diagnosis: NP Diagnosis and Management
181. np-pediatric-dermatology-common-conditions - Pediatric Dermatology Common Conditions: NP Diagnosis and Management
182. np-osteoarthritis-diagnosis-and-management - Osteoarthritis Diagnosis and Management: NP Diagnosis and Management
183. np-rheumatoid-arthritis-diagnosis-and-management - Rheumatoid Arthritis Diagnosis and Management: NP Diagnosis and Management
184. np-gout-and-pseudogout-diagnosis-and-treatment - Gout and Pseudogout Diagnosis and Treatment: NP Diagnosis and Management
185. np-systemic-lupus-erythematosus-diagnosis-and-management - Systemic Lupus Erythematosus Diagnosis and Management: NP Diagnosis and Management
186. np-polymyalgia-rheumatica-diagnosis-and-treatment - Polymyalgia Rheumatica Diagnosis and Treatment: NP Diagnosis and Management
187. np-fibromyalgia-diagnosis-and-management - Fibromyalgia Diagnosis and Management: NP Diagnosis and Management
188. np-low-back-pain-evaluation-and-management - Low Back Pain Evaluation and Management: NP Diagnosis and Management
189. np-neck-pain-evaluation-and-management - Neck Pain Evaluation and Management: NP Diagnosis and Management
190. np-shoulder-pain-differential-diagnosis - Shoulder Pain Differential Diagnosis: NP Diagnosis and Management
191. np-knee-pain-evaluation-and-management - Knee Pain Evaluation and Management: NP Diagnosis and Management
192. np-hip-pain-evaluation-and-management - Hip Pain Evaluation and Management: NP Diagnosis and Management
193. np-hand-and-wrist-disorders - Hand and Wrist Disorders: NP Diagnosis and Management
194. np-foot-and-ankle-disorders - Foot and Ankle Disorders: NP Diagnosis and Management
195. np-sports-medicine-common-injuries - Sports Medicine Common Injuries: NP Diagnosis and Management
196. np-tendonitis-and-bursitis-management - Tendonitis and Bursitis Management: NP Diagnosis and Management
197. np-ligament-injuries-evaluation - Ligament Injuries Evaluation: NP Diagnosis and Management
198. np-meniscal-tears-diagnosis-and-management - Meniscal Tears Diagnosis and Management: NP Diagnosis and Management
199. np-rotator-cuff-disorders - Rotator Cuff Disorders: NP Diagnosis and Management
200. np-carpal-tunnel-syndrome-management - Carpal Tunnel Syndrome Management: NP Diagnosis and Management

## Quality Gates

- No placeholder text accepted.
- Correct answers must match option text.
- MCQ requires exactly 4 options.
- SATA requires exactly 5 options with 2-4 correct answers.
- Every question and flashcard must include a blueprint domain.
- Questions are linked to `studyLinkPathwayId=us-np-fnp` and the source lesson slug.
