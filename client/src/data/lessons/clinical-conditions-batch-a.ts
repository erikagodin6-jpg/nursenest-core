import type { LessonContent } from "./types";

export const clinicalConditionsBatchALessons: Record<string, LessonContent> = {
  "aaa-rupture-rpn": {
    title: "Abdominal Aortic Aneurysm",
    cellular: {
      title: "Vessel Wall Weakening",
      content: "An abdominal aortic aneurysm (AAA) develops when chronic damage from hypertension, atherosclerosis, and smoking weakens the elastic fibers and smooth muscle of the aortic wall, causing progressive dilation. When the wall tension exceeds structural integrity, the aneurysm ruptures, causing massive hemorrhage into the retroperitoneal space. The nurse must recognize early signs of rupture, maintain hemodynamic monitoring as delegated, and report changes immediately."
    },
    riskFactors: ["Age >65 years", "Male sex (6:1 ratio)", "Smoking history", "Hypertension", "Family history of AAA", "Atherosclerosis", "COPD", "Connective tissue disorders"],
    diagnostics: ["Monitor vital signs as directed, reporting hypotension or tachycardia", "Measure and document abdominal girth as ordered", "Monitor urine output and report if <30 mL/hr", "Report changes in peripheral pulse quality", "Monitor hemoglobin and hematocrit trends as reported"],
    management: ["Maintain bed rest as ordered", "Keep environment calm to minimize BP spikes", "Maintain large-bore IV access as directed", "Avoid Valsalva maneuver", "Follow blood pressure parameters as ordered", "Prepare patient for possible emergency surgery as directed"],
    nursingActions: ["Monitor vital signs every 15 minutes during acute phase as directed", "Report sudden severe back or abdominal pain immediately to the RN", "Assess and document peripheral pulses (pedal, popliteal)", "Measure abdominal girth and report increases", "Monitor urine output hourly and report <30 mL/hr", "Report signs of shock: tachycardia, hypotension, pallor, diaphoresis"],
    signs: {
      left: ["Pulsatile abdominal mass", "Abdominal bruit on auscultation", "Dull back or flank pain", "Incidental finding on imaging"],
      right: ["Sudden tearing back/abdominal pain", "Hypovolemic shock signs", "Grey Turner sign (flank ecchymosis)", "Cullen sign (periumbilical ecchymosis)"]
    },
    medications: [{ name: "Sodium Nitroprusside", type: "Vasodilator", action: "Rapid IV blood pressure reduction", sideEffects: "Thiocyanate toxicity, reflex tachycardia", contra: "Severe hepatic disease", pearl: "Target SBP 100-120 mmHg pre-operatively. Administer as ordered and report BP outside parameters." }],
    pearls: ["Report any sudden severe pain immediately as it may indicate rupture", "A pulsatile abdominal mass should never be palpated aggressively", "Post-operative monitoring includes hourly urine output and peripheral pulses"],
    quiz: [{ question: "Which finding should the nurse report immediately in a patient with a known AAA?", options: ["Blood pressure of 130/80 mmHg", "Sudden severe back pain with diaphoresis", "Mild abdominal bloating after meals", "Heart rate of 78 bpm"], correct: 1, rationale: "Sudden severe back pain with diaphoresis may indicate AAA rupture, a life-threatening emergency requiring immediate notification." }]
  },

  "mi-management-rpn": {
    title: "Myocardial Infarction",
    cellular: {
      title: "Myocardial Ischemia and Necrosis",
      content: "A myocardial infarction occurs when coronary artery occlusion (usually from plaque rupture and thrombus formation) interrupts blood supply to the myocardium. Without oxygen, myocytes undergo irreversible injury within 20-40 minutes, releasing cardiac biomarkers (troponin, CK-MB) into the bloodstream. The nurse assists with monitoring, administers medications as ordered, and reports changes in the patient's condition."
    },
    riskFactors: ["Coronary artery disease", "Hypertension", "Diabetes mellitus", "Smoking", "Hyperlipidemia", "Obesity", "Family history of premature CAD", "Sedentary lifestyle"],
    diagnostics: ["Monitor continuous cardiac telemetry as directed", "Report changes in rhythm or new ST changes to the RN", "Monitor serial troponin results as reported", "Record vital signs per ordered frequency", "Monitor oxygen saturation continuously"],
    management: ["Administer oxygen as ordered to maintain SpO2 >94%", "Administer MONA protocol medications as ordered (Morphine, Oxygen, Nitroglycerin, Aspirin)", "Maintain bed rest during acute phase as ordered", "Keep emergency cart accessible", "Follow activity restrictions as ordered"],
    nursingActions: ["Assess chest pain using PQRST and report changes immediately", "Monitor vital signs every 15 minutes during acute phase", "Administer nitroglycerin SL as ordered (up to 3 doses, 5 minutes apart)", "Report unrelieved chest pain after nitroglycerin to the nurse immediately", "Monitor for signs of cardiogenic shock and report", "Provide emotional support and maintain a calm environment"],
    signs: {
      left: ["Substernal crushing chest pain", "Pain radiating to left arm, jaw, back", "Diaphoresis and pallor", "Nausea and vomiting"],
      right: ["Dyspnea", "Anxiety and sense of impending doom", "Tachycardia or bradycardia", "Hypotension (cardiogenic shock)"]
    },
    medications: [
      { name: "Nitroglycerin", type: "Vasodilator", action: "Dilates coronary arteries and reduces preload", sideEffects: "Headache, hypotension, reflex tachycardia", contra: "SBP <90, recent PDE5 inhibitor use, right ventricular MI", pearl: "Administer SL every 5 minutes x3 doses as ordered. Hold and report if SBP <90 mmHg." },
      { name: "Aspirin", type: "Antiplatelet", action: "Inhibits platelet aggregation via COX-1 inhibition", sideEffects: "GI bleeding, tinnitus", contra: "Active GI bleeding, aspirin allergy", pearl: "Chewed 325 mg given immediately in acute MI. This is a standing order in most cardiac protocols." }
    ],
    pearls: ["Never administer nitroglycerin if the patient has taken a PDE5 inhibitor (sildenafil) within 24-48 hours", "Morphine is used cautiously; may cause hypotension and respiratory depression", "Troponin levels peak 12-24 hours after MI onset"],
    quiz: [{ question: "After administering 3 doses of sublingual nitroglycerin, the patient still reports chest pain. What should the nurse do?", options: ["Administer a fourth dose of nitroglycerin", "Report to the nurse immediately for further intervention", "Apply a nitroglycerin patch", "Encourage deep breathing exercises"], correct: 1, rationale: "After 3 doses of SL nitroglycerin without relief, the nurse must report to the nurse immediately. Further interventions such as IV nitroglycerin or morphine may be needed." }]
  },

  "cholecystitis-rpn": {
    title: "Cholecystitis",
    cellular: {
      title: "Gallbladder Inflammation",
      content: "Cholecystitis is inflammation of the gallbladder, most commonly caused by gallstone obstruction of the cystic duct. Bile stasis leads to distension, mucosal ischemia, bacterial invasion, and potential perforation. The cardinal presentation is right upper quadrant (RUQ) pain after fatty meals, often radiating to the right scapula (Murphy's sign positive). The nurse monitors pain, vital signs, and dietary intake, reporting changes to the nursing team."
    },
    riskFactors: ["Female sex (4 Fs: Fat, Forty, Female, Fertile)", "Age >40", "Obesity", "Rapid weight loss", "Oral contraceptives or estrogen therapy", "High-fat diet", "Family history of gallstones", "Diabetes mellitus"],
    diagnostics: ["Monitor vital signs for fever or tachycardia", "Report escalating RUQ pain", "Monitor for jaundice (scleral icterus, dark urine, clay-colored stools)", "Report nausea and vomiting patterns", "Monitor dietary tolerance"],
    management: ["Maintain NPO status as ordered prior to surgery", "Administer pain medications as ordered", "Administer IV fluids as ordered", "Administer antiemetics as ordered", "Provide low-fat diet education when oral intake resumes", "Assist with post-cholecystectomy care as directed"],
    nursingActions: ["Assess pain characteristics and location, report RUQ pain worsening or spreading", "Monitor vital signs and report fever >38.3C", "Maintain NPO status and IV fluid therapy as ordered", "Position patient comfortably (semi-Fowler's)", "Monitor for signs of biliary obstruction: jaundice, clay stools, dark urine", "Provide post-operative wound care for laparoscopic sites"],
    signs: {
      left: ["RUQ pain after fatty meals", "Positive Murphy's sign", "Nausea and vomiting", "Low-grade fever"],
      right: ["Jaundice (if CBD obstruction)", "Clay-colored stools", "Dark amber urine", "Rebound tenderness (perforation)"]
    },
    medications: [{ name: "Ketorolac", type: "NSAID", action: "Inhibits prostaglandin synthesis for pain relief", sideEffects: "GI bleeding, renal impairment", contra: "Active GI bleed, renal failure, perioperative CABG", pearl: "Limited to 5 days of use. Effective for biliary colic pain. Administer as ordered." }],
    pearls: ["Murphy's sign: inspiratory arrest during RUQ palpation is classic for cholecystitis", "Post-cholecystectomy patients may experience shoulder pain from residual CO2 gas: encourage ambulation", "Report any signs of bile leak post-op: increasing abdominal pain, fever, tachycardia"],
    quiz: [{ question: "Which dietary instruction should the nurse reinforce for a patient recovering from cholecystitis?", options: ["Increase dietary fat for calorie needs", "Follow a low-fat diet to reduce gallbladder stimulation", "Eliminate all protein from the diet", "Increase dairy intake"], correct: 1, rationale: "A low-fat diet reduces gallbladder contraction and bile release, minimizing symptoms." }]
  },

  "cholecystitis-rn": {
    title: "Cholecystitis",
    cellular: {
      title: "Biliary Pathophysiology",
      content: "Cholecystitis results from gallstone impaction in the cystic duct causing bile stasis, gallbladder distension, and inflammation. Persistent obstruction leads to mucosal ischemia, secondary bacterial infection (E. coli, Klebsiella), and risk of empyema, gangrene, or perforation with bile peritonitis. Acalculous cholecystitis occurs in critically ill patients from bile stasis without stones. The nurse must perform comprehensive pain assessment, manage fluid resuscitation, administer antibiotics and analgesics, monitor for surgical complications, and coordinate perioperative care."
    },
    riskFactors: ["Cholelithiasis (90% of cases)", "Female sex, age >40, obesity", "Rapid weight loss or prolonged fasting", "TPN administration", "Critical illness (acalculous cholecystitis)", "Pregnancy", "Oral contraceptives", "Sickle cell disease"],
    diagnostics: ["Interpret RUQ ultrasound findings: gallstones, wall thickening >3mm, pericholecystic fluid, sonographic Murphy's sign", "Evaluate WBC count for leukocytosis (>11,000)", "Monitor liver function tests: elevated ALP and GGT suggest biliary involvement", "Assess lipase and amylase to rule out pancreatitis", "Evaluate bilirubin levels: elevated direct bilirubin suggests common bile duct obstruction", "Order HIDA scan if ultrasound is equivocal"],
    management: ["Implement NPO status and initiate IV fluid resuscitation", "Administer IV antibiotics as prescribed for acute cholecystitis", "Manage pain with scheduled and PRN analgesics per protocol", "Coordinate with surgical team for laparoscopic cholecystectomy", "Insert NG tube if patient has persistent vomiting or ileus", "Monitor for post-operative complications: bile leak, retained stone, wound infection"],
    nursingActions: ["Perform comprehensive abdominal assessment including Murphy's sign", "Implement pain management protocol and evaluate effectiveness", "Monitor I&O and assess hydration status", "Assess surgical incision sites for infection, drainage, or bile leak", "Educate patient on post-cholecystectomy dietary modifications", "Monitor for complications: pancreatitis, CBD obstruction, peritonitis"],
    signs: {
      left: ["RUQ pain radiating to right scapula", "Positive Murphy's sign", "Nausea, vomiting, anorexia", "Low-grade fever", "Guarding"],
      right: ["High fever with rigors (empyema)", "Jaundice with pruritus", "Peritoneal signs (perforation)", "Charcot's triad: fever, jaundice, RUQ pain", "Reynolds' pentad adds AMS + hypotension"]
    },
    medications: [
      { name: "Piperacillin-Tazobactam", type: "Extended-spectrum penicillin", action: "Broad-spectrum coverage for biliary pathogens (gram-negatives, anaerobes)", sideEffects: "Diarrhea, rash, thrombocytopenia", contra: "Penicillin allergy", pearl: "First-line empiric antibiotic for moderate-severe acute cholecystitis. Adjust based on culture results." },
      { name: "Ursodiol", type: "Bile acid", action: "Dissolves small cholesterol gallstones by reducing cholesterol saturation in bile", sideEffects: "Diarrhea, nausea", contra: "Calcified or pigmented stones, acute cholecystitis", pearl: "Used for patients who are poor surgical candidates. Takes 6-24 months. Not effective for acute disease." }
    ],
    pearls: ["Charcot's triad (fever, jaundice, RUQ pain) suggests ascending cholangitis and requires emergent ERCP", "Post-cholecystectomy syndrome: persistent RUQ pain may indicate retained CBD stone or sphincter of Oddi dysfunction", "Acalculous cholecystitis in ICU patients has higher morbidity: maintain high clinical suspicion"],
    quiz: [{ question: "A patient presents with fever, jaundice, and RUQ pain. The nurse recognizes this as:", options: ["Simple biliary colic", "Charcot's triad suggesting ascending cholangitis", "Appendicitis with atypical presentation", "Pancreatitis"], correct: 1, rationale: "Charcot's triad (fever, jaundice, RUQ pain) is the classic presentation of ascending cholangitis, which requires emergent intervention." }]
  },

  "cholecystitis-np": {
    title: "Cholecystitis",
    cellular: {
      title: "Advanced Biliary Pathology",
      content: "Cholecystitis pathogenesis involves gallstone impaction in the cystic duct (90% of cases) leading to bile stasis, intraluminal pressure elevation, mucosal ischemia, and inflammatory cascade activation. Prostaglandins and lysolecithin released from damaged mucosa propagate inflammation. Secondary bacterial infection occurs in 50-75% of cases. Complications include empyema (pus-filled gallbladder), gangrenous cholecystitis, perforation with peritonitis, cholecystoenteric fistula, and gallstone ileus. The clinician must formulate the differential diagnosis, order and interpret imaging and labs, prescribe empiric antibiotics, manage pain, and coordinate surgical timing."
    },
    riskFactors: ["Cholelithiasis", "Female sex, multiparity, obesity", "Age >40", "Hemolytic disorders (pigment stones)", "Cirrhosis", "Crohn's disease (ileal resection disrupts enterohepatic circulation)", "Prolonged TPN", "Ceftriaxone use (biliary sludge)"],
    diagnostics: ["Order RUQ ultrasound as first-line imaging: sensitivity >95% for gallstones", "Order HIDA scan (cholescintigraphy) if US equivocal: non-filling of gallbladder confirms cystic duct obstruction", "Order CBC with differential: leukocytosis >12,000 with left shift", "Order CMP including LFTs: elevated ALP, GGT; elevated direct bilirubin if CBD involvement", "Order lipase to rule out concurrent gallstone pancreatitis", "Consider MRCP or EUS if CBD stone suspected before surgical referral", "Order blood cultures if sepsis suspected"],
    management: ["Prescribe empiric IV antibiotics: piperacillin-tazobactam or ceftriaxone + metronidazole", "Order IV fluid resuscitation with crystalloid", "Prescribe multimodal analgesia: ketorolac + opioid PRN", "Consult general surgery for early laparoscopic cholecystectomy (within 72 hours preferred)", "Order ERCP pre-operatively if CBD stone suspected on imaging", "Prescribe antiemetics: ondansetron 4mg IV q6h PRN", "For high-risk surgical patients: order percutaneous cholecystostomy tube placement"],
    nursingActions: ["Formulate differential diagnosis: cholecystitis vs choledocholithiasis vs cholangitis vs pancreatitis vs hepatitis", "Risk-stratify using Tokyo Guidelines severity grading (Grade I mild, II moderate, III severe)", "Determine surgical timing based on severity and patient comorbidities", "Prescribe and adjust antibiotic regimen based on culture and sensitivity results", "Manage post-operative complications: bile leak, wound infection, retained stone", "Provide discharge planning: dietary counseling, activity restrictions, follow-up"],
    signs: {
      left: ["RUQ tenderness with positive Murphy's sign", "Nausea, vomiting, food intolerance", "Low-grade fever", "RUQ pain referred to right shoulder/scapula"],
      right: ["Fever with rigors (complicated cholecystitis)", "Palpable gallbladder (empyema)", "Jaundice (CBD obstruction)", "Peritoneal signs (perforation)", "Sepsis with hemodynamic instability"]
    },
    medications: [
      { name: "Ceftriaxone + Metronidazole", type: "Antibiotic combination", action: "Broad gram-negative and anaerobic coverage for biliary sepsis", sideEffects: "Diarrhea, biliary sludge (ceftriaxone), metallic taste (metronidazole)", contra: "Cephalosporin allergy, alcohol use (metronidazole)", pearl: "Alternative to piperacillin-tazobactam. Ceftriaxone itself can cause biliary sludge with prolonged use." },
      { name: "Morphine", type: "Opioid analgesic", action: "Mu-receptor agonist for severe pain", sideEffects: "Respiratory depression, constipation, sphincter of Oddi spasm", contra: "Respiratory depression, paralytic ileus", pearl: "Historically avoided in biliary colic due to sphincter of Oddi spasm, but evidence is weak. Hydromorphone is an alternative." }
    ],
    pearls: ["Tokyo Guidelines classify cholecystitis severity: Grade I (mild, no organ dysfunction), Grade II (moderate, elevated WBC or palpable mass), Grade III (severe, organ dysfunction)", "Early cholecystectomy within 72 hours reduces total hospital stay and complication rate vs. delayed surgery", "Mirizzi syndrome: large stone in cystic duct or Hartmann's pouch compresses the common hepatic duct causing obstructive jaundice"],
    quiz: [{ question: "An NP evaluates a patient with RUQ pain, fever, and elevated WBC. RUQ ultrasound shows gallstones with wall thickening and pericholecystic fluid. What is the most appropriate next step?", options: ["Prescribe oral antibiotics and discharge home", "Admit, start IV antibiotics, and consult surgery for early cholecystectomy", "Order a HIDA scan before any treatment", "Prescribe ursodiol for gallstone dissolution"], correct: 1, rationale: "Ultrasound findings confirm acute cholecystitis. Management includes admission, IV antibiotics, and surgical consultation for early laparoscopic cholecystectomy within 72 hours." }]
  },

  "appendicitis-rpn": {
    title: "Appendicitis",
    cellular: {
      title: "Appendiceal Inflammation",
      content: "Appendicitis occurs when the appendiceal lumen becomes obstructed (by fecalith, lymphoid hyperplasia, or foreign body), leading to bacterial overgrowth, mucosal inflammation, increased intraluminal pressure, and ischemia. Without intervention, the appendix can perforate within 24-72 hours, causing peritonitis. The nurse monitors for classic signs (periumbilical pain migrating to RLQ), maintains NPO status, and reports changes promptly."
    },
    riskFactors: ["Age 10-30 (peak incidence)", "Male sex (slightly higher risk)", "Low-fiber diet", "Family history", "Fecalith obstruction"],
    diagnostics: ["Monitor vital signs for fever and tachycardia", "Report pain migration from periumbilical to RLQ (McBurney's point)", "Report rebound tenderness or guarding", "Monitor for signs of perforation: sudden pain relief followed by diffuse pain"],
    management: ["Maintain NPO status as ordered", "Administer IV fluids as ordered", "Administer analgesics as ordered", "Avoid applying heat to the abdomen", "Position for comfort (right side-lying with knees flexed)", "Prepare for appendectomy as directed"],
    nursingActions: ["Assess pain location and character every 1-2 hours and report changes", "Report sudden relief of pain followed by diffuse abdominal pain (possible perforation)", "Maintain NPO status strictly", "Do not administer enemas or laxatives (risk of perforation)", "Monitor post-operative incision for signs of infection", "Report fever >38.3C or increasing WBC"],
    signs: {
      left: ["Periumbilical pain migrating to RLQ", "Anorexia", "Nausea and vomiting", "Low-grade fever"],
      right: ["McBurney's point tenderness", "Rebound tenderness", "Rovsing's sign (LLQ pressure causes RLQ pain)", "Perforation: sudden diffuse pain, high fever, rigidity"]
    },
    medications: [{ name: "Cefazolin", type: "Cephalosporin antibiotic", action: "Prophylactic coverage against surgical site infection", sideEffects: "Allergic reaction, diarrhea", contra: "Cephalosporin allergy", pearl: "Given as surgical prophylaxis within 60 minutes of incision. Administer as ordered." }],
    pearls: ["Never apply heat to the abdomen in suspected appendicitis (may cause perforation)", "Pain migration from periumbilical to RLQ is the classic appendicitis pattern", "Sudden relief of pain may indicate perforation, not improvement"],
    quiz: [{ question: "A patient with appendicitis suddenly reports that their pain has resolved. What should the nurse do?", options: ["Document improvement and continue monitoring", "Report immediately as this may indicate perforation", "Discontinue pain medication", "Prepare for discharge"], correct: 1, rationale: "Sudden pain relief in appendicitis may indicate perforation. The appendix has ruptured, temporarily relieving pressure, but diffuse peritonitis will follow." }]
  },

  "appendicitis-rn": {
    title: "Appendicitis",
    cellular: {
      title: "Appendiceal Pathophysiology",
      content: "Appendicitis begins with luminal obstruction (fecalith 40%, lymphoid hyperplasia 60%) leading to mucus accumulation, bacterial overgrowth, and increased intraluminal pressure. Venous congestion progresses to arterial compromise, causing transmural ischemia and necrosis. Perforation occurs in 20-30% of cases, typically within 36-72 hours of symptom onset, leading to localized abscess or diffuse peritonitis. The nurse must perform serial abdominal assessments, manage perioperative care, administer antibiotics and analgesics per protocol, and monitor for post-operative complications including abscess, wound infection, and ileus."
    },
    riskFactors: ["Peak age 10-30 years", "Male sex (1.4:1 ratio)", "Low dietary fiber", "Family history of appendicitis", "Fecalith or calcified appendicolith"],
    diagnostics: ["Perform serial abdominal assessments documenting pain migration pattern", "Interpret WBC with differential: leukocytosis >10,000 with neutrophilia", "Evaluate CT abdomen/pelvis findings: appendiceal diameter >6mm, periappendiceal fat stranding, appendicolith", "Interpret urinalysis to rule out UTI (may show mild pyuria from appendiceal inflammation)", "Evaluate CRP (elevated supports inflammatory process)", "Assess Alvarado Score components for clinical decision-making"],
    management: ["Implement NPO status and IV fluid resuscitation", "Administer IV antibiotics pre-operatively as prescribed", "Implement multimodal pain management protocol", "Coordinate with surgical team for appendectomy timing", "For perforated appendicitis: anticipate drain placement and extended antibiotic course", "Monitor for post-operative ileus: auscultate bowel sounds, assess for flatus/BM"],
    nursingActions: ["Perform comprehensive abdominal assessment: auscultate, then palpate (auscultate before palpation)", "Assess for peritoneal signs: rebound tenderness, involuntary guarding, board-like rigidity", "Evaluate special signs: Rovsing's (RLQ pain with LLQ palpation), Psoas sign, Obturator sign", "Monitor for signs of sepsis in perforated appendicitis", "Implement surgical safety checklist pre-operatively", "Manage post-operative wound care: assess for SSI, manage drain if present"],
    signs: {
      left: ["Periumbilical pain migrating to RLQ over 12-24 hours", "Anorexia (almost universal)", "Nausea and vomiting (follows pain onset)", "Low-grade fever (37.5-38.5C)"],
      right: ["McBurney's point tenderness", "Positive Rovsing's, Psoas, Obturator signs", "Rebound tenderness and guarding", "High fever, tachycardia, rigidity (perforation)"]
    },
    medications: [
      { name: "Cefoxitin", type: "Second-generation cephalosporin", action: "Provides aerobic and anaerobic coverage for intra-abdominal pathogens", sideEffects: "Diarrhea, rash, C. difficile risk", contra: "Cephalosporin allergy", pearl: "Single-agent option for non-perforated appendicitis. For complicated cases, broader coverage with piperacillin-tazobactam may be used." },
      { name: "Metronidazole", type: "Nitroimidazole antibiotic", action: "Anaerobic coverage for intra-abdominal pathogens (Bacteroides fragilis)", sideEffects: "Metallic taste, nausea, peripheral neuropathy", contra: "First trimester pregnancy, alcohol use (disulfiram reaction)", pearl: "Often paired with a cephalosporin for adequate aerobic + anaerobic coverage in complicated appendicitis." }
    ],
    pearls: ["Always auscultate the abdomen before palpating to avoid altering bowel sounds", "Atypical presentations are common: retrocecal appendix causes flank pain, pelvic appendix causes suprapubic pain", "In elderly patients, appendicitis presents with vague symptoms and higher perforation rates (>50%)"],
    quiz: [{ question: "Which physical examination finding is most specific for appendicitis?", options: ["Diffuse abdominal tenderness", "Positive Rovsing's sign (RLQ pain with LLQ palpation)", "Hyperactive bowel sounds", "Suprapubic tenderness"], correct: 1, rationale: "Rovsing's sign (pain in the RLQ when pressure is applied to the LLQ) indicates peritoneal irritation localized to the appendix area and is relatively specific for appendicitis." }]
  },

  "bowel-obstruction-rpn": {
    title: "Bowel Obstruction",
    cellular: {
      title: "Intestinal Obstruction Pathophysiology",
      content: "Bowel obstruction occurs when the normal passage of intestinal contents is blocked, either mechanically (adhesions, hernias, tumors) or functionally (paralytic ileus). Proximal to the obstruction, the bowel dilates with gas and fluid, increasing intraluminal pressure, compromising blood supply, and risking perforation. Fluid sequestration in the bowel leads to dehydration and electrolyte imbalances. The nurse monitors for signs of obstruction, maintains NG tube function as directed, and reports changes."
    },
    riskFactors: ["Previous abdominal surgery (adhesions are #1 cause of SBO)", "Hernias (incarcerated or strangulated)", "Colon cancer (#1 cause of large bowel obstruction)", "Crohn's disease", "Diverticulitis", "Volvulus", "Intussusception", "Fecal impaction"],
    diagnostics: ["Monitor vital signs for signs of dehydration or shock", "Auscultate bowel sounds: high-pitched tinkling (early SBO) or absent (late/ileus)", "Monitor NG tube output: color, amount, and consistency", "Report abdominal distension changes", "Monitor I&O strictly"],
    management: ["Maintain NPO status as ordered", "Maintain NG tube to low intermittent suction as ordered", "Administer IV fluids as ordered", "Monitor and document NG tube output", "Assist with position changes to promote comfort", "Report increasing distension or pain"],
    nursingActions: ["Assess abdomen every 2-4 hours: distension, bowel sounds, tenderness", "Maintain NG tube patency and suction as directed", "Provide mouth care every 2 hours (NPO and NG tube drying)", "Monitor for signs of strangulation: severe constant pain, fever, tachycardia", "Report vomiting (feculent vomiting is a late sign)", "Monitor for return of bowel function: flatus, bowel movement"],
    signs: {
      left: ["Cramping abdominal pain (colicky, intermittent)", "Abdominal distension", "High-pitched tinkling bowel sounds", "Nausea and vomiting"],
      right: ["Absent bowel sounds (late)", "Feculent vomiting (late sign)", "Severe constant pain (strangulation)", "Fever and tachycardia (strangulation/perforation)"]
    },
    medications: [{ name: "Ondansetron", type: "Antiemetic", action: "5-HT3 receptor antagonist preventing nausea/vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Concomitant apomorphine, severe QT prolongation", pearl: "Used for symptom management. Does not treat the obstruction itself. Administer as ordered." }],
    pearls: ["Never give laxatives or enemas in suspected bowel obstruction", "Feculent vomiting indicates prolonged obstruction and is a very late sign", "A sudden increase in pain intensity may indicate strangulation: report immediately"],
    quiz: [{ question: "Which finding should the nurse report immediately in a patient with bowel obstruction?", options: ["Passage of flatus", "High-pitched bowel sounds", "Sudden severe constant abdominal pain with fever", "Mild nausea"], correct: 2, rationale: "Sudden severe constant pain with fever suggests strangulation (compromised blood supply to the bowel), a surgical emergency requiring immediate intervention." }]
  },

  "bowel-obstruction-rn": {
    title: "Bowel Obstruction",
    cellular: {
      title: "Mechanical and Functional Obstruction",
      content: "Bowel obstruction is classified as mechanical (physical blockage) or functional (paralytic ileus from impaired peristalsis). Small bowel obstruction (SBO) accounts for 80% of cases, most commonly from postoperative adhesions. Large bowel obstruction (LBO) is most commonly caused by colorectal cancer. As the bowel dilates proximal to the obstruction, massive third-spacing of fluid occurs (up to 8L/day can sequester), causing hypovolemia, electrolyte derangements (hypokalemia, metabolic alkalosis from vomiting), and risk of bowel ischemia. The nurse manages fluid resuscitation, NG decompression, electrolyte correction, and monitors for surgical indications."
    },
    riskFactors: ["Prior abdominal/pelvic surgery (adhesions)", "Incarcerated hernia", "Colorectal malignancy", "Crohn's disease with stricture", "Volvulus (sigmoid most common in elderly)", "Diverticular disease", "Gallstone ileus", "Radiation enteritis"],
    diagnostics: ["Interpret abdominal X-ray: dilated loops, air-fluid levels, absence of distal gas", "Evaluate CT abdomen with IV contrast: transition point, closed-loop obstruction, bowel wall enhancement", "Monitor electrolytes: hypokalemia from vomiting, metabolic alkalosis", "Assess lactate level: elevated suggests bowel ischemia", "Monitor CBC: leukocytosis suggests strangulation or perforation", "Track NG tube output volume and character"],
    management: ["Implement aggressive IV fluid resuscitation for third-space losses", "Maintain NG tube to low intermittent suction for decompression", "Replace electrolytes per protocol (potassium, magnesium)", "Administer IV antibiotics if strangulation or perforation suspected", "Coordinate with surgical team: operative vs. non-operative management decision", "For partial SBO: trial of non-operative management with serial exams q4-6h", "Implement VTE prophylaxis per protocol"],
    nursingActions: ["Perform serial abdominal assessments documenting distension, bowel sounds, tenderness", "Manage NG tube: ensure patency, monitor output, provide oral care", "Implement strict I&O with fluid balance calculations", "Assess for signs of strangulation warranting emergent surgery", "Monitor response to conservative management: resolution of distension, return of bowel sounds, passage of flatus", "Implement multimodal pain management and evaluate effectiveness", "Coordinate post-operative ileus prevention: early ambulation, gum chewing"],
    signs: {
      left: ["Colicky cramping pain (SBO: periumbilical; LBO: lower abdomen)", "Progressive abdominal distension", "Nausea and vomiting (early in SBO, late in LBO)", "High-pitched tinkling bowel sounds with rushes"],
      right: ["Absent bowel sounds (complete obstruction or ileus)", "Feculent vomiting (late SBO)", "Constant severe pain (strangulation)", "Peritoneal signs with fever (perforation)", "Hemodynamic instability"]
    },
    medications: [
      { name: "Lactated Ringer's", type: "Isotonic crystalloid", action: "Volume replacement for third-space fluid losses", sideEffects: "Fluid overload if excessive", contra: "Severe hepatic failure (cannot metabolize lactate)", pearl: "Preferred resuscitation fluid. Third-spacing in SBO can be massive: monitor closely and replace aggressively." },
      { name: "Gastrografin", type: "Water-soluble contrast", action: "Oral contrast used diagnostically and therapeutically in adhesive SBO", sideEffects: "Aspiration risk, diarrhea", contra: "Complete obstruction with perforation risk", pearl: "Gastrografin challenge: if contrast reaches cecum on X-ray at 24 hours, obstruction is resolving and surgery can be avoided." }
    ],
    pearls: ["The Gastrografin challenge is both diagnostic and therapeutic: the hyperosmolar contrast draws fluid into the lumen and may help resolve partial adhesive SBO", "Closed-loop obstruction on CT (two points of obstruction along same segment) is a surgical emergency due to high strangulation risk", "Distinguish SBO from LBO: SBO has early vomiting, LBO has early constipation and late vomiting"],
    quiz: [{ question: "Which laboratory finding in a patient with bowel obstruction most strongly suggests bowel ischemia?", options: ["WBC of 12,000", "Potassium of 3.2 mEq/L", "Elevated serum lactate", "Elevated BUN"], correct: 2, rationale: "Elevated serum lactate indicates tissue hypoxia from compromised bowel blood supply (ischemia/strangulation), which is a surgical emergency." }]
  },

  "bowel-obstruction-np": {
    title: "Bowel Obstruction",
    cellular: {
      title: "Advanced Obstruction Pathology",
      content: "Bowel obstruction requires the clinician to differentiate mechanical from functional causes, identify the level and completeness of obstruction, and determine operative vs. non-operative management. In mechanical SBO, adhesive obstruction (60%) can often be managed conservatively with NG decompression and volume resuscitation, while strangulated, closed-loop, or complete obstructions require emergent surgery. In LBO, malignancy must be excluded. Functional ileus is managed by treating the underlying cause (electrolyte correction, medication adjustment, sepsis control). The clinician must interpret imaging, order appropriate labs, prescribe fluid and electrolyte replacement, and determine surgical consultation timing."
    },
    riskFactors: ["Prior abdominal surgery (adhesions in 65-75% of SBO)", "Colorectal carcinoma (60% of LBO)", "Incarcerated hernia", "Crohn's disease stricture", "Sigmoid volvulus (elderly, institutionalized patients)", "Medications causing ileus: opioids, anticholinergics", "Electrolyte derangements: hypokalemia, hypomagnesemia"],
    diagnostics: ["Order CT abdomen/pelvis with IV contrast (gold standard): identifies transition point, closed-loop, strangulation, free air", "Order upright and supine abdominal X-ray: air-fluid levels, dilated loops (>3cm small bowel, >6cm colon, >9cm cecum)", "Order CBC: leukocytosis suggests strangulation; anemia may suggest malignancy", "Order CMP: metabolic alkalosis from vomiting, hypokalemia, elevated BUN (dehydration), pre-renal AKI", "Order serum lactate: elevated suggests bowel ischemia", "Order blood type and screen if surgery anticipated", "Order colonoscopy/sigmoidoscopy for LBO to rule out malignancy and attempt decompression"],
    management: ["Prescribe aggressive IV crystalloid resuscitation (2-4L bolus then maintenance)", "Order NG tube placement for decompression", "Prescribe electrolyte replacement: KCl IV for hypokalemia, magnesium sulfate for hypomagnesemia", "For adhesive SBO: trial of conservative management with serial exams and Gastrografin challenge", "Order emergent surgical consultation for: complete obstruction, strangulation, closed-loop, perforation, failure of conservative management >48-72 hours", "For sigmoid volvulus: order emergent sigmoidoscopic decompression, followed by elective sigmoid resection", "Prescribe DVT prophylaxis: enoxaparin or heparin SQ"],
    nursingActions: ["Determine level and cause of obstruction from imaging interpretation", "Classify as complete vs. partial, simple vs. strangulated", "Determine operative vs. non-operative management approach", "Monitor response to conservative management with serial imaging and clinical exams", "Manage complications: bowel perforation, sepsis, short-bowel syndrome post-resection", "Coordinate multidisciplinary care: surgery, gastroenterology, oncology as indicated"],
    signs: {
      left: ["Colicky abdominal pain with distension", "Vomiting: bilious (proximal SBO) vs. feculent (distal SBO)", "Obstipation (absence of flatus and stool)", "High-pitched metallic bowel sounds"],
      right: ["Constant pain replacing colicky pain (strangulation)", "Peritoneal signs (perforation)", "Hemodynamic instability (sepsis)", "Free air on imaging (perforation)"]
    },
    medications: [
      { name: "Piperacillin-Tazobactam", type: "Extended-spectrum penicillin", action: "Broad-spectrum coverage for intra-abdominal sepsis including anaerobes", sideEffects: "Diarrhea, rash, C. difficile", contra: "Penicillin allergy", pearl: "Prescribed when strangulation or perforation is suspected. Covers polymicrobial enteric flora." },
      { name: "Alvimopan", type: "Peripheral mu-opioid antagonist", action: "Blocks opioid effects on GI tract without crossing BBB", sideEffects: "Nausea, flatulence", contra: "Opioid use >7 days, complete obstruction", pearl: "FDA-approved for post-operative ileus prevention. Given pre-operatively and continued post-op for up to 7 days." }
    ],
    pearls: ["Rule of 3-6-9: small bowel >3cm, colon >6cm, cecum >9cm indicates obstruction on X-ray", "Cecal diameter >12cm carries high perforation risk requiring emergent decompression", "Gastrografin reaching cecum at 24 hours predicts successful conservative management with 97% sensitivity", "Ogilvie syndrome (acute colonic pseudo-obstruction) is treated with neostigmine 2mg IV, not surgery"],
    quiz: [{ question: "An NP evaluates a CT scan showing two adjacent transition points along the small bowel with a U-shaped dilated loop. What does this finding indicate?", options: ["Partial adhesive SBO", "Closed-loop obstruction requiring emergent surgery", "Paralytic ileus", "Gallstone ileus"], correct: 1, rationale: "Two transition points with a U-shaped loop indicate closed-loop obstruction, where a segment of bowel is obstructed at two points. This carries very high strangulation risk and requires emergent surgical intervention." }]
  }
};
