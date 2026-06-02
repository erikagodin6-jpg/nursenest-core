import type { ExamQuestion } from "./types";

export const npExamBatch60Questions: ExamQuestion[] = [
  {
    q: "A 28-year-old female presents for contraception counseling. She has a history of migraine with aura, BMI 26, and is a non-smoker. She desires a long-acting reversible method. Which contraceptive is most appropriate?",
    o: ["Levonorgestrel IUD (Mirena) or etonogestrel implant (Nexplanon)", "Combined oral contraceptive pill", "Transdermal contraceptive patch", "Combined vaginal ring (NuvaRing)"],
    a: 0,
    r: "Migraine with aura is an absolute contraindication to estrogen-containing contraceptives (combined OCP, patch, ring) due to increased stroke risk (CDC Category 4). Progestin-only methods are safe. The levonorgestrel IUD (Mirena) and etonogestrel implant (Nexplanon) are both excellent LARC options with >99% efficacy, and both are CDC Category 2 (advantages outweigh risks) for migraine with aura. The IUD also provides 5-8 years of protection with reduced menstrual bleeding. The implant provides 3-5 years of protection. The depo-medroxyprogesterone injection is another progestin-only option but has limitations including bone density concerns.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 52-year-old female presents with hot flashes occurring 10-12 times daily, disrupting sleep and work performance. She is 18 months post-menopause. She has no history of breast cancer, VTE, or cardiovascular disease. Mammogram and Pap smear are current and normal. What is the recommended treatment?",
    o: ["Hormone therapy with low-dose estrogen plus progesterone (for women with uterus) initiated within 10 years of menopause", "Herbal supplements (black cohosh) as first-line therapy", "Gabapentin 300 mg TID as sole treatment", "Testosterone replacement therapy"],
    a: 0,
    r: "Systemic hormone therapy (HT) is the most effective treatment for vasomotor symptoms (hot flashes) and is appropriate for symptomatic women within 10 years of menopause onset or under age 60 who have no contraindications. Women with an intact uterus require combined estrogen-progesterone therapy to prevent endometrial hyperplasia. The benefits outweigh risks when initiated in the 'therapeutic window' (<10 years post-menopause). The lowest effective dose should be used. Herbal supplements have inconsistent evidence and are not first-line. Gabapentin and SSRIs/SNRIs are alternatives for women with HT contraindications. Testosterone is not standard for vasomotor symptoms.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 25-year-old female presents at 12 weeks gestation for her first prenatal visit. She has no significant medical history. What routine prenatal labs should be ordered at this initial visit?",
    o: ["CBC, blood type and Rh, antibody screen, rubella immunity, hepatitis B surface antigen, HIV, syphilis (RPR/VDRL), urine culture, and Pap smear if due", "CBC and urine dipstick only", "Glucose tolerance test and group B strep culture", "Genetic testing and fetal echocardiogram"],
    a: 0,
    r: "The initial prenatal visit includes a comprehensive panel: CBC (anemia screening), blood type with Rh status and antibody screen (Rh incompatibility), rubella immunity (risk for congenital rubella if non-immune), hepatitis B surface antigen (vertical transmission risk), HIV screening (USPSTF recommendation), RPR/VDRL (congenital syphilis prevention), urine culture (asymptomatic bacteriuria treatment reduces pyelonephritis and preterm birth), and Pap smear if due per screening guidelines. The 1-hour glucose challenge test is performed at 24-28 weeks. Group B strep screening is done at 36-37 weeks. Cell-free DNA screening can be offered to all patients but is optional.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 34-year-old female at 32 weeks gestation presents with new-onset hypertension (BP 158/102 confirmed on two readings 4 hours apart), proteinuria (300 mg/24-hour urine), and headache. Labs show: platelets 165,000, AST 38, LDH 180. What is the diagnosis and appropriate management?",
    o: ["Preeclampsia with severe features; magnesium sulfate for seizure prophylaxis, antihypertensives, and plan for delivery at 34-37 weeks depending on stability", "Gestational hypertension; lifestyle modification and weekly BP monitoring", "Chronic hypertension; continue current regimen", "HELLP syndrome; emergent delivery"],
    a: 0,
    r: "New-onset hypertension (>140/90) after 20 weeks with proteinuria (>300 mg/24 hours) defines preeclampsia. The severe BP (>160/110) and headache indicate preeclampsia with severe features. Management includes: IV magnesium sulfate for seizure prophylaxis (prevents eclampsia), antihypertensive therapy (IV labetalol or IV hydralazine acutely, oral labetalol or nifedipine for maintenance), antenatal corticosteroids for fetal lung maturity (32 weeks), and delivery planning (34-37 weeks depending on disease severity and stability). HELLP syndrome requires hemolysis (elevated LDH >600, schistocytes), elevated liver enzymes, and low platelets (<100,000) — not met here. Gestational hypertension lacks proteinuria.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 45-year-old female presents with irregular heavy menstrual bleeding for 6 months with cycles ranging from 18-45 days. Pelvic exam is normal. Pregnancy test is negative. TSH is normal. CBC shows hemoglobin 10.8 g/dL. Endometrial biopsy shows no hyperplasia or malignancy. What is the most appropriate management?",
    o: ["Levonorgestrel IUD (Mirena) for menstrual regulation and endometrial protection", "Hysterectomy as first-line treatment", "Combined OCP continuously without cyclic breaks", "Observation for 6 months and repeat biopsy"],
    a: 0,
    r: "Abnormal uterine bleeding (AUB) in a perimenopausal woman with negative endometrial biopsy is likely due to anovulatory cycles from perimenopause. The levonorgestrel IUD (Mirena) is an excellent first-line treatment as it: reduces menstrual blood loss by 90%, provides endometrial protection against hyperplasia, serves as effective contraception (still needed in perimenopause), and can remain for up to 8 years. Hysterectomy is reserved for failed medical management. Combined OCPs are an option but carry more systemic side effects and may be contraindicated by age-related risk factors. Observation without treatment is inappropriate with ongoing anemia.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 22-year-old female presents with a 3-day history of dysuria, increased frequency, and suprapubic discomfort. She is sexually active and uses a diaphragm. Temperature is 37.0°C. Urinalysis shows positive leukocyte esterase, positive nitrites, and WBC >10/HPF. Urine culture results are pending. What is the appropriate empiric treatment?",
    o: ["Nitrofurantoin 100 mg BID for 5 days or trimethoprim-sulfamethoxazole DS BID for 3 days", "Ciprofloxacin 500 mg BID for 7 days", "Amoxicillin 500 mg TID for 7 days", "Single dose of fosfomycin 3 g only if culture positive"],
    a: 0,
    r: "For uncomplicated cystitis in women, first-line empiric antibiotics per IDSA guidelines are nitrofurantoin (100 mg BID x 5 days) or TMP-SMX DS (BID x 3 days, if local E. coli resistance <20%). Single-dose fosfomycin 3 g is another first-line option. Fluoroquinolones (ciprofloxacin) should be reserved for complicated UTIs or pyelonephritis due to resistance concerns and serious adverse effects (FDA black box warnings for tendon rupture, neuropathy). Amoxicillin has high E. coli resistance rates and is not recommended as empiric therapy. Treatment should not be delayed while awaiting culture results when clinical findings are consistent with cystitis.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 38-year-old female presents with a 2 cm right adnexal cyst found incidentally on ultrasound during evaluation for pelvic pain. The cyst is simple (anechoic, thin-walled, no internal septations or solid components). CA-125 is 18 U/mL (normal <35). What is the recommended management?",
    o: ["Repeat ultrasound in 6-12 weeks; simple cysts <5 cm in premenopausal women typically resolve spontaneously", "Immediate laparoscopic cystectomy", "CT abdomen and pelvis with contrast", "Start oral contraceptives to suppress the cyst"],
    a: 0,
    r: "Simple ovarian cysts <5 cm in premenopausal women are overwhelmingly functional (follicular or corpus luteum cysts) and resolve spontaneously within 1-3 menstrual cycles. Follow-up ultrasound in 6-12 weeks confirms resolution. Surgical intervention is unnecessary for small simple cysts with normal tumor markers. CT imaging adds radiation without clinical benefit when ultrasound is diagnostic. Oral contraceptives prevent formation of new functional cysts but do not hasten resolution of existing cysts. Surgical referral is indicated for cysts >5-7 cm, complex features, solid components, persistent cysts, or elevated tumor markers.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 30-year-old female at 28 weeks gestation presents with a positive 1-hour glucose challenge test (165 mg/dL, threshold 140). What is the next diagnostic step?",
    o: ["3-hour 100 g oral glucose tolerance test (fasting, 1-hr, 2-hr, 3-hr values)", "Diagnose gestational diabetes and start insulin", "Repeat 1-hour glucose challenge in 4 weeks", "Order HbA1c as confirmatory test"],
    a: 0,
    r: "A positive 1-hour glucose challenge test (>140 mg/dL using the two-step approach) requires confirmation with a 3-hour 100 g OGTT. Gestational diabetes is diagnosed when 2 or more values meet or exceed the thresholds (fasting >95, 1-hr >180, 2-hr >155, 3-hr >140 per Carpenter-Coustan criteria). A single elevated screening value does not diagnose GDM. Starting insulin without confirmatory testing is premature. Repeating the screening test delays diagnosis. HbA1c is not the standard diagnostic test for gestational diabetes (it may miss the glucose excursions relevant to fetal outcomes).",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 19-year-old female presents with lower abdominal pain, cervical motion tenderness, and mucopurulent cervical discharge. Temperature is 38.2°C. She is sexually active with a new partner. NAAT for Chlamydia trachomatis is positive. What is the recommended treatment regimen?",
    o: ["IM ceftriaxone 500 mg single dose plus oral doxycycline 100 mg BID for 14 days plus oral metronidazole 500 mg BID for 14 days", "Azithromycin 1 g single dose only", "Oral ciprofloxacin 500 mg BID for 7 days", "IM ceftriaxone 250 mg single dose only"],
    a: 0,
    r: "This patient has pelvic inflammatory disease (PID) evidenced by lower abdominal pain, cervical motion tenderness, and cervical discharge with confirmed Chlamydia. CDC guidelines for PID treatment require coverage of Chlamydia, gonorrhea (often coinfects), and anaerobes: IM ceftriaxone 500 mg (gonorrhea coverage), plus doxycycline 100 mg BID x 14 days (Chlamydia coverage), plus metronidazole 500 mg BID x 14 days (anaerobic coverage). Azithromycin single dose treats uncomplicated chlamydial cervicitis, not PID. Fluoroquinolones are no longer recommended for gonorrhea due to resistance. Treatment should cover polymicrobial etiology. The patient's sexual partner(s) must be treated. Follow-up in 48-72 hours is essential.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 56-year-old postmenopausal female presents with vaginal dryness, dyspareunia, urinary urgency, and recurrent UTIs since menopause 4 years ago. She does not want systemic hormone therapy. What is the most effective treatment?",
    o: ["Low-dose vaginal estrogen (cream, tablet, or ring) for genitourinary syndrome of menopause", "Oral estrogen-progestin combination therapy", "Vaginal moisturizer and lubricant as sole treatment", "Prophylactic antibiotics for UTI prevention only"],
    a: 0,
    r: "Genitourinary syndrome of menopause (GSM) encompasses vaginal dryness, dyspareunia, urinary symptoms, and recurrent UTIs resulting from estrogen deficiency. Low-dose vaginal estrogen is the most effective treatment with minimal systemic absorption (does not require concomitant progesterone in most cases). Options include vaginal estradiol cream, vaginal estradiol tablets (Vagifem), or the estradiol vaginal ring (Estring). It improves vaginal pH, restores lactobacillus flora, reduces UTIs, and improves urogenital symptoms. Systemic HT is unnecessary for isolated GSM. Vaginal moisturizers provide temporary relief but do not address atrophic changes. Prophylactic antibiotics do not treat the underlying cause.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A premature infant born at 28 weeks gestation develops respiratory distress within minutes of birth with grunting, nasal flaring, intercostal retractions, and cyanosis. Chest X-ray shows diffuse ground-glass opacities with air bronchograms bilaterally. What is the diagnosis and immediate treatment?",
    o: ["Respiratory distress syndrome (surfactant deficiency); administer exogenous surfactant via endotracheal tube and initiate CPAP or mechanical ventilation", "Transient tachypnea of the newborn; supportive care only", "Meconium aspiration syndrome; suctioning and antibiotics", "Pneumothorax; needle decompression"],
    a: 0,
    r: "Respiratory distress syndrome (RDS) is caused by surfactant deficiency in premature infants (risk inversely proportional to gestational age). Classic CXR findings include diffuse bilateral ground-glass opacities with air bronchograms and low lung volumes. Treatment includes exogenous surfactant administration (via endotracheal tube, may repeat doses), CPAP or mechanical ventilation for respiratory support, and supplemental oxygen with careful titration (target SpO2 90-95% to avoid ROP). Antenatal corticosteroids (given to mothers before preterm delivery) accelerate lung maturity and reduce RDS incidence. TTN typically occurs in near-term infants delivered by C-section and resolves within 24-72 hours. Meconium aspiration is rare at 28 weeks.",
    s: "Neonatal"
  },
  {
    q: "A term newborn born via vaginal delivery develops jaundice at 14 hours of life. Total serum bilirubin is 12.5 mg/dL. Direct bilirubin is 0.4 mg/dL. Mother's blood type is O+, infant's blood type is A+. DAT (direct Coombs test) is positive. What is the most likely cause and initial management?",
    o: ["ABO incompatibility hemolytic disease; phototherapy based on AAP bilirubin nomogram and serial bilirubin monitoring", "Physiologic jaundice; reassurance and follow-up in 2 days", "Breastfeeding jaundice; supplement with formula", "Biliary atresia; surgical consultation"],
    a: 0,
    r: "Jaundice within the first 24 hours of life is always pathologic. An O-positive mother with an A-positive infant and a positive direct Coombs test (DAT) indicates ABO incompatibility with immune-mediated hemolysis. Anti-A antibodies from the mother cross the placenta and destroy fetal red blood cells. Management includes plotting the bilirubin on the AAP hour-specific nomogram to determine if phototherapy thresholds are met (12.5 mg/dL at 14 hours likely meets criteria), serial bilirubin monitoring every 4-6 hours, and assessment for anemia. Exchange transfusion is reserved for bilirubin approaching critical levels or failed phototherapy. Physiologic jaundice does not appear before 24 hours. Biliary atresia causes direct hyperbilirubinemia.",
    s: "Neonatal"
  },
  {
    q: "A 3-day-old premature infant (born at 30 weeks) develops abdominal distension, bloody stools, feeding intolerance, and bilious vomiting. Abdominal X-ray shows pneumatosis intestinalis (intramural gas) and dilated bowel loops. What is the diagnosis and initial management?",
    o: ["Necrotizing enterocolitis (NEC); NPO, orogastric decompression, IV antibiotics, serial abdominal X-rays, and surgical consultation", "Hirschsprung disease; rectal biopsy", "Malrotation with volvulus; emergent Ladd procedure", "Meconium ileus; Gastrografin enema"],
    a: 0,
    r: "Necrotizing enterocolitis (NEC) is the most common GI emergency in premature infants. The classic triad is abdominal distension, bloody stools, and feeding intolerance. Pneumatosis intestinalis on abdominal X-ray is pathognomonic (Bell stage II). Management includes: NPO (bowel rest for 7-14 days), orogastric tube decompression, IV broad-spectrum antibiotics (ampicillin, gentamicin, and metronidazole), TPN for nutrition, serial abdominal X-rays every 6-8 hours to monitor for perforation (pneumoperitoneum), and surgical consultation. Indications for surgery include perforation (free air), clinical deterioration, or failed medical management. Breast milk (when feeds resume) is protective against NEC recurrence.",
    s: "Neonatal"
  },
  {
    q: "A newborn at 34 weeks gestation is born to a mother with poorly controlled gestational diabetes. At 1 hour of life, the infant becomes jittery, has a weak cry, and appears lethargic. Point-of-care glucose is 28 mg/dL. What is the priority intervention?",
    o: ["IV dextrose 10% bolus (2 mL/kg) followed by continuous dextrose infusion and recheck glucose in 30 minutes", "Breastfeed immediately and recheck glucose in 1 hour", "Observe and recheck glucose in 4 hours", "Administer intramuscular glucagon"],
    a: 0,
    r: "Neonatal hypoglycemia (glucose <45 mg/dL) is common in infants of diabetic mothers due to fetal hyperinsulinism. Symptomatic hypoglycemia (jitteriness, lethargy, weak cry, seizures) with glucose <40 mg/dL requires immediate IV dextrose: D10W bolus at 2 mL/kg over 5-10 minutes followed by continuous D10W infusion at 80-100 mL/kg/day. Glucose should be rechecked within 30 minutes. Breastfeeding alone is appropriate for asymptomatic infants with mildly low glucose. Observation without intervention risks brain injury from prolonged hypoglycemia. IM glucagon is a temporary measure used when IV access is unavailable, as glycogen stores may be depleted. Serial glucose monitoring continues until stable for 12-24 hours.",
    s: "Neonatal"
  },
  {
    q: "A 1-day-old full-term infant develops tachypnea (RR 72), grunting, and mild subcostal retractions. SpO2 is 95% on room air. CXR shows hyperinflated lungs with prominent perihilar interstitial markings and fluid in the minor fissure. The infant was born via elective cesarean section without labor. What is the most likely diagnosis?",
    o: ["Transient tachypnea of the newborn; supportive care with monitoring and supplemental O2 if needed", "Respiratory distress syndrome; administer surfactant", "Pneumonia; start IV antibiotics", "Congenital diaphragmatic hernia; emergent surgery"],
    a: 0,
    r: "Transient tachypnea of the newborn (TTN) results from delayed clearance of fetal lung fluid. Risk factors include cesarean delivery without labor (lack of catecholamine surge and thoracic compression during vaginal delivery that aid fluid clearance), gestational diabetes, and late preterm birth. CXR findings include hyperinflated lungs, prominent perihilar streaking, and fluid in the fissures. TTN is self-limited, typically resolving within 24-72 hours. Management is supportive with O2 supplementation to maintain SpO2 >94%, monitoring for clinical improvement, and NPO or careful feeding. Unlike RDS, surfactant is not indicated. Unlike pneumonia, antibiotics are not needed unless infection cannot be ruled out. The CXR pattern distinguishes TTN from other causes of neonatal respiratory distress.",
    s: "Neonatal"
  },
  {
    q: "A newborn undergoes routine pulse oximetry screening at 24 hours of life. Pre-ductal (right hand) SpO2 is 97%, post-ductal (foot) SpO2 is 88%, yielding a difference >3%. The infant appears comfortable and is feeding well. What does this finding suggest and what is the next step?",
    o: ["Suspect critical congenital heart disease with right-to-left ductal shunting; obtain echocardiogram urgently and consider prostaglandin E1", "Normal newborn variation; repeat screening in 24 hours", "Pulse oximeter malfunction; change the probe", "Peripheral cyanosis from cold stress; warm the infant"],
    a: 0,
    r: "A pre-ductal to post-ductal SpO2 difference >3% (or any reading <95%) on newborn critical congenital heart disease (CCHD) screening is a positive result suggesting right-to-left shunting through the ductus arteriosus. This pattern is seen in duct-dependent lesions such as coarctation of the aorta, interrupted aortic arch, or critical aortic stenosis, where the lower body receives desaturated blood through the PDA. An urgent echocardiogram is needed. If a duct-dependent lesion is confirmed, IV prostaglandin E1 (alprostadil) maintains ductal patency and is life-saving. The infant may appear well initially but can deteriorate rapidly when the PDA closes. This is not a normal finding and should not be attributed to cold stress or equipment malfunction without further evaluation.",
    s: "Neonatal"
  },
  {
    q: "A premature infant born at 26 weeks gestation is now 4 weeks old. Cranial ultrasound shows a grade III intraventricular hemorrhage (IVH) with ventricular dilation. The infant's head circumference is crossing percentiles upward. What complication is developing and what monitoring is essential?",
    o: ["Post-hemorrhagic hydrocephalus; serial head circumference measurements, cranial ultrasounds, and neurosurgery consultation", "Normal variant in premature infants; routine follow-up", "Subdural hematoma from birth trauma; CT head", "Choroid plexus cyst; observation only"],
    a: 0,
    r: "Grade III IVH (blood filling and dilating the ventricles) with progressive ventricular dilation and increasing head circumference indicates post-hemorrhagic hydrocephalus (PHH), a major complication of IVH in premature infants. Monitoring includes serial head circumference measurements (daily in acute phase), serial cranial ultrasounds to assess ventricular size, and neurological assessment. Neurosurgery consultation is essential for potential intervention: temporizing measures include serial lumbar punctures or ventricular reservoir placement, with ventriculoperitoneal (VP) shunt as definitive treatment if hydrocephalus persists. This is not normal — grade III IVH carries significant neurodevelopmental risk. Long-term developmental follow-up is critical.",
    s: "Neonatal"
  },
  {
    q: "A 2-day-old newborn born to a mother with untreated Group B Streptococcus (GBS) colonization develops temperature instability (hypothermia), poor feeding, lethargy, and tachypnea. CBC shows WBC 3,200 with bandemia (28% bands). CRP is elevated. What is the diagnosis and empiric treatment?",
    o: ["Early-onset neonatal sepsis (likely GBS); IV ampicillin plus gentamicin after blood cultures obtained", "Late-onset sepsis; IV vancomycin and cefotaxime", "Viral illness; supportive care only", "Meconium aspiration; suctioning and respiratory support"],
    a: 0,
    r: "Early-onset neonatal sepsis (EOS, presenting within 72 hours of birth) in the setting of maternal GBS colonization without adequate intrapartum prophylaxis is a clinical emergency. Neonatal signs include temperature instability (hypothermia more common than fever in neonates), feeding difficulty, lethargy, tachypnea, and laboratory findings of leukopenia with bandemia (immature:total neutrophil ratio >0.2). Empiric treatment is IV ampicillin (covers GBS, Listeria, and enterococci) plus gentamicin (synergistic killing with ampicillin and gram-negative coverage). Blood cultures MUST be obtained before antibiotics. Lumbar puncture should be performed when the infant is stable enough. Late-onset sepsis (>72 hours) has different empiric coverage. Viral sepsis remains in the differential but empiric antibiotics should not be withheld.",
    s: "Neonatal"
  },
  {
    q: "A premature infant born at 27 weeks gestation has been receiving supplemental oxygen for chronic lung disease. At 36 weeks corrected gestational age, the infant still requires FiO2 0.30 to maintain SpO2 >90%. What is this condition called and what is the long-term management plan?",
    o: ["Bronchopulmonary dysplasia (BPD); gradual oxygen wean, diuretics if needed, nutrition optimization, RSV prophylaxis, and developmental follow-up", "Persistent pulmonary hypertension; start inhaled nitric oxide", "Congenital pneumonia; extended antibiotic course", "Tracheomalacia; surgical airway intervention"],
    a: 0,
    r: "Bronchopulmonary dysplasia (BPD) is defined as the need for supplemental oxygen at 36 weeks corrected gestational age, classified by severity based on oxygen/respiratory support requirements. It is the most common chronic lung disease of prematurity, resulting from lung immaturity, oxygen toxicity, and ventilator-induced lung injury. Management includes: gradual oxygen wean (maintaining SpO2 90-95%), diuretics (furosemide or chlorothiazide) for fluid management, optimal nutrition for lung growth (increased caloric density), palivizumab (RSV prophylaxis — RSV can be devastating in BPD), avoiding secondhand smoke, and close developmental follow-up. Most children with BPD show improvement over the first 2-3 years as new alveoli develop. Persistent pulmonary hypertension presents acutely. Inhaled nitric oxide is for acute pulmonary hypertension, not chronic BPD.",
    s: "Neonatal"
  },
  {
    q: "A 5-day-old full-term newborn presents with persistent jaundice. Total bilirubin is 8.5 mg/dL with a direct (conjugated) bilirubin of 4.2 mg/dL (49% of total). The infant has acholic (pale) stools and dark urine. What diagnosis must be ruled out emergently and how?",
    o: ["Biliary atresia; obtain urgent hepatobiliary ultrasound and HIDA scan, and refer to pediatric surgery", "Physiologic jaundice; observe and recheck in 2 days", "Breast milk jaundice; continue breastfeeding", "ABO incompatibility; phototherapy"],
    a: 0,
    r: "Conjugated (direct) hyperbilirubinemia (direct bilirubin >1 mg/dL or >20% of total) is ALWAYS pathologic and requires urgent evaluation. The combination of direct hyperbilirubinemia, acholic stools (absence of bile in stool), and dark urine (conjugated bilirubin in urine) raises concern for biliary atresia — the most common indication for liver transplantation in children. Early diagnosis is critical because the Kasai portoenterostomy (surgical treatment) has the best outcomes when performed before 60 days of life. Hepatobiliary ultrasound and HIDA scan (hepatobiliary iminodiacetic acid scan) evaluate biliary anatomy and excretion. Physiologic jaundice is unconjugated and self-limited. Breast milk jaundice is unconjugated. ABO incompatibility causes unconjugated hyperbilirubinemia.",
    s: "Neonatal"
  },
  {
    q: "A 35-year-old female at 38 weeks gestation presents with severe right upper quadrant pain, nausea, and vomiting. BP is 162/104 mmHg. Labs show: platelets 68,000, AST 320, ALT 280, LDH 850, hemoglobin 9.8 (from 12.5 at last visit), peripheral smear shows schistocytes. What is the diagnosis and priority management?",
    o: ["HELLP syndrome; stabilize with magnesium sulfate, urgent delivery, and close maternal monitoring", "Acute fatty liver of pregnancy; liver transplant consultation", "Acute hepatitis A; supportive care", "Gallstone pancreatitis; surgical consultation"],
    a: 0,
    r: "HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) is a severe form of preeclampsia spectrum disorder. The diagnostic criteria are met: hemolysis (elevated LDH >600, schistocytes on smear, decreasing hemoglobin), elevated liver enzymes (AST and ALT >2x normal), and low platelets (<100,000). At 38 weeks, the definitive treatment is delivery. Magnesium sulfate is administered for seizure prophylaxis. Blood products (platelets, packed RBCs) should be available. Maternal complications include DIC, placental abruption, hepatic rupture, and renal failure. AFLP is a differential but typically presents with coagulopathy and hypoglycemia. The hypertension and lab pattern make HELLP most likely.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A premature infant born at 29 weeks gestation is stable on nasal CPAP at 1 week of life. An ophthalmology screening exam at 4 weeks reveals zone II, stage 2 retinopathy of prematurity (ROP) with plus disease. What is the critical next step?",
    o: ["Urgent treatment with laser photocoagulation or intravitreal anti-VEGF injection within 48-72 hours", "Continue monitoring with weekly eye exams", "Reduce supplemental oxygen immediately to FiO2 0.21", "No treatment needed until stage 4 ROP"],
    a: 0,
    r: "ROP with plus disease (tortuous, dilated retinal vessels indicating active neovascularization) at any stage requires urgent treatment — plus disease is the key indicator for intervention, not stage alone. Treatment within 48-72 hours of diagnosis is essential to prevent retinal detachment and blindness. Options include laser photocoagulation of the avascular retina (traditional standard) or intravitreal anti-VEGF injection (bevacizumab or ranibizumab, increasingly used for zone I disease). Continued monitoring alone risks progression to retinal detachment. Abruptly reducing oxygen can cause other complications. Waiting until stage 4 (partial retinal detachment) would result in worse visual outcomes. ROP screening is mandated for infants born <32 weeks or <1500 g.",
    s: "Neonatal"
  },
  {
    q: "A 60-year-old female presents with right breast erythema, skin thickening (peau d'orange), nipple retraction, and warmth without a discrete mass. She has no fever or elevated WBC. Mammogram shows diffuse skin thickening and axillary lymphadenopathy. What is the most likely diagnosis?",
    o: ["Inflammatory breast cancer; urgent skin punch biopsy and breast MRI for staging", "Mastitis; prescribe antibiotics for 14 days", "Breast abscess; incision and drainage", "Paget disease of the breast; nipple biopsy"],
    a: 0,
    r: "The combination of diffuse breast erythema, peau d'orange, nipple retraction without a discrete mass, and axillary lymphadenopathy without systemic signs of infection is highly suspicious for inflammatory breast cancer (IBC), a locally advanced, aggressive form of breast cancer. IBC accounts for 1-5% of breast cancers with the worst prognosis among breast cancer subtypes. Diagnosis requires skin punch biopsy showing dermal lymphatic invasion by tumor emboli. Breast MRI evaluates the extent of disease. Treatment is neoadjuvant chemotherapy followed by mastectomy and radiation (modified radical approach). Mastitis typically presents with fever, localized tenderness, and elevated WBC. Paget disease involves eczematous changes of the nipple specifically.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A premature infant born at 25 weeks gestation has a persistently patent ductus arteriosus (PDA) at 10 days of life with a significant left-to-right shunt on echocardiography. The infant has worsening respiratory status requiring increased ventilator support, bounding pulses, and a widened pulse pressure. What is the initial pharmacologic treatment?",
    o: ["IV ibuprofen or indomethacin (prostaglandin synthesis inhibitor) to promote ductal closure", "IV prostaglandin E1 to maintain ductal patency", "Immediate surgical PDA ligation", "Furosemide alone for fluid management"],
    a: 0,
    r: "A hemodynamically significant PDA with left-to-right shunting in a premature infant causes pulmonary overcirculation (worsening respiratory status) and systemic hypoperfusion (bounding pulses, widened pulse pressure, potential for NEC and IVH). Pharmacologic closure with prostaglandin synthesis inhibitors (IV ibuprofen lysine or indomethacin) is first-line treatment. IV ibuprofen has fewer renal side effects and is often preferred. Prostaglandin E1 would KEEP the ductus open — it is used for duct-dependent congenital heart lesions, the opposite of what is needed here. Surgical ligation is reserved for failed pharmacologic closure or contraindications to NSAIDs. Diuretics alone do not promote ductal closure.",
    s: "Neonatal"
  },
  {
    q: "A 55-year-old female with a history of treated breast cancer (ER+, completed tamoxifen 5 years ago) presents with new onset back pain and a serum calcium of 12.8 mg/dL. She has lost 10 lbs over 2 months. Alkaline phosphatase is elevated at 280 U/L. What is the most likely cause and priority evaluation?",
    o: ["Metastatic breast cancer to bone; CT scan, bone scan, and IV bisphosphonate for hypercalcemia", "Primary hyperparathyroidism; check PTH level", "Vitamin D toxicity; check 25-OH vitamin D level", "Osteoporosis with compression fracture; DEXA scan"],
    a: 0,
    r: "In a patient with a history of hormone receptor-positive breast cancer, new back pain, hypercalcemia, weight loss, and elevated alkaline phosphatase (suggesting bone turnover), metastatic breast cancer to bone must be the primary consideration. Bone is the most common site of breast cancer metastasis. Priority evaluation includes CT of chest/abdomen/pelvis, bone scan (nuclear medicine), and tumor markers (CA 15-3, CA 27.29). Hypercalcemia of malignancy should be treated emergently with IV normal saline hydration, IV bisphosphonate (zoledronic acid), and possibly calcitonin for rapid effect. While primary hyperparathyroidism could cause hypercalcemia, the clinical context (cancer history, weight loss, elevated ALP) makes malignancy far more likely.",
    s: "Hematology & Oncology"
  },
  {
    q: "A 32-year-old female presents with a 3-month history of progressive fatigue, unintentional weight gain, constipation, hair loss, and dry skin. She is 6 months postpartum and breastfeeding. TSH is 14.2 mIU/L, free T4 is 0.5 ng/dL, and anti-TPO antibodies are strongly positive at 1:1600. What is the diagnosis and management?",
    o: ["Postpartum thyroiditis progressing to hypothyroidism with underlying Hashimoto thyroiditis; start levothyroxine (safe in breastfeeding)", "Postpartum depression; start SSRI", "Normal postpartum hormonal changes; reassurance", "Sheehan syndrome; pituitary MRI"],
    a: 0,
    r: "Postpartum thyroiditis occurs in 5-10% of women, typically presenting with a transient hyperthyroid phase (1-6 months postpartum) followed by hypothyroidism (4-8 months postpartum). Strongly positive anti-TPO antibodies indicate underlying Hashimoto thyroiditis, which increases the likelihood that hypothyroidism will be permanent (20-30% of postpartum thyroiditis cases). Levothyroxine is first-line treatment and is safe during breastfeeding. While postpartum depression symptoms can overlap with hypothyroidism, thyroid function should be normalized first. These findings are not normal postpartum changes. Sheehan syndrome (postpartum hypopituitarism from pituitary infarction) would show low TSH with low T4, not elevated TSH.",
    s: "Endocrine & Metabolic"
  }
];
