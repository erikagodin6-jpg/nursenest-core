import type { ExamQuestion } from "./types";

export const npExamBatch32Questions: ExamQuestion[] = [
  {
    q: "A 25-year-old male with schizophrenia on haloperidol 10 mg daily presents with high fever (40.5 C), severe muscle rigidity (lead-pipe), altered mental status, autonomic instability (HR 130, BP 190/110), and CPK 12,000 U/L. What is the diagnosis and emergency treatment?",
    o: ["Neuroleptic malignant syndrome; discontinue haloperidol, initiate aggressive cooling, IV dantrolene, and ICU admission", "Serotonin syndrome; administer cyproheptadine", "Malignant hyperthermia; administer dantrolene without stopping antipsychotic", "Anticholinergic toxicity; administer physostigmine"],
    a: 0,
    r: "NMS is a life-threatening reaction to dopamine antagonists (antipsychotics) characterized by the tetrad: hyperthermia, severe rigidity (lead-pipe), altered mental status, and autonomic instability. Markedly elevated CPK reflects rhabdomyolysis. Treatment: immediately discontinue the causative agent, aggressive cooling, IV fluids, dantrolene (muscle relaxant), and consider bromocriptine (dopamine agonist). ICU monitoring is essential. Mortality is 5-20%. NMS differs from serotonin syndrome (which has clonus, hyperreflexia, and diarrhea rather than lead-pipe rigidity).",
    s: "Psychiatry"
  },
  {
    q: "A 40-year-old female presents with seasonal depression that recurs every winter and remits in spring. PHQ-9 is 12. She has tried sertraline with minimal benefit. What non-pharmacological treatment has the strongest evidence for seasonal affective disorder?",
    o: ["Light therapy using a 10,000-lux light box for 30 minutes each morning within 1 hour of waking", "Melatonin 10 mg at bedtime", "Tanning bed exposure 3 times weekly", "Dark therapy (complete darkness from 6 PM to 8 AM)"],
    a: 0,
    r: "Bright light therapy is the first-line treatment for seasonal affective disorder (SAD), with efficacy comparable to antidepressants. The recommended protocol is 10,000 lux for 20-30 minutes each morning within the first hour of waking. Light suppresses melatonin and shifts circadian rhythms. Response typically occurs within 1-2 weeks. UV-filtered light boxes are used (NOT tanning beds, which have UV skin cancer risk). Combine with CBT for SAD for the best outcomes. Dawn simulation is an alternative.",
    s: "Psychiatry"
  },
  {
    q: "A 30-year-old female with panic disorder on paroxetine 40 mg daily has achieved symptom remission for 12 months. She asks about discontinuing her medication. What should the NP counsel?",
    o: ["Gradual taper over 4-8 weeks minimum to prevent discontinuation syndrome; continue CBT strategies; relapse risk is 30-50% within 6-12 months after SSRI discontinuation", "Stop paroxetine abruptly since symptoms have resolved", "Switch to a benzodiazepine for the taper period", "Continue paroxetine indefinitely without any discontinuation plan"],
    a: 0,
    r: "SSRIs, particularly paroxetine (short half-life, high anticholinergic activity), must be tapered gradually to prevent discontinuation syndrome (dizziness, nausea, electric shock sensations, anxiety, irritability). Recommended taper: reduce by 10-25% every 2-4 weeks. After 12 months of remission, a trial off medication is reasonable, but relapse occurs in 30-50% within 6-12 months. Continued CBT skills provide relapse prevention. Patients should be counseled about early warning signs and when to restart medication.",
    s: "Psychiatry"
  },
  {
    q: "A 50-year-old male presents with nephrotic syndrome (proteinuria 8 g/day, albumin 2.0, hyperlipidemia, edema). Renal biopsy shows diffuse thickening of the glomerular basement membrane with subepithelial spike-and-dome pattern on silver stain. PLA2R antibodies are positive. What is the diagnosis and treatment?",
    o: ["Primary membranous nephropathy; immunosuppressive therapy with rituximab (increasingly first-line) or cyclophosphamide-based regimen plus supportive care", "Minimal change disease; high-dose prednisone", "Focal segmental glomerulosclerosis; calcineurin inhibitor", "Diabetic nephropathy; ACE inhibitor alone"],
    a: 0,
    r: "GBM thickening with subepithelial spike-and-dome pattern and positive PLA2R antibodies is diagnostic of primary membranous nephropathy. PLA2R antibodies are present in 70-80% of primary MN and serve as both diagnostic and monitoring tools. Rituximab (anti-CD20) is increasingly used as first-line (MENTOR trial showed non-inferiority to cyclosporine). Alternative is cyclophosphamide with corticosteroids (Ponticelli regimen). Supportive care includes ACE inhibitor, statins, and edema management.",
    s: "Renal"
  },
  {
    q: "A 60-year-old male with type 2 diabetes and CKD presents with bilateral renal artery stenosis suspected on duplex ultrasound (peak systolic velocity greater than 200 cm/s bilaterally). His creatinine rose from 1.8 to 2.6 after starting lisinopril. What does this clinical picture suggest?",
    o: ["Bilateral renovascular disease with hemodynamically significant stenosis; the creatinine rise after ACE inhibitor initiation is characteristic of bilateral RAS", "Acute tubular necrosis from medication toxicity", "Bilateral ureteral obstruction", "CKD progression unrelated to ACE inhibitor"],
    a: 0,
    r: "Acute creatinine rise (greater than 30% from baseline) after ACE inhibitor or ARB initiation is a classic presentation of bilateral renal artery stenosis. ACE inhibitors reduce efferent arteriolar tone (angiotensin II dependent), and in RAS, this is the primary mechanism maintaining GFR across the stenotic kidney. Removing this mechanism causes acute GFR decline. Management: hold ACE inhibitor, confirm with MRA or CT angiography, and consider renal artery revascularization. Atherosclerotic RAS is common in elderly patients with diabetes and diffuse vascular disease.",
    s: "Renal"
  },
  {
    q: "A 32-year-old G2P1 at 36 weeks gestation presents with sudden onset painless bright red vaginal bleeding. Fetal heart tones are reassuring. Ultrasound confirms complete placenta previa. What is the management?",
    o: ["Hospitalize, type and crossmatch, administer betamethasone for fetal lung maturity if not previously given, and plan for cesarean delivery at 36-37 weeks", "Attempt vaginal delivery with close monitoring", "Perform digital cervical examination to assess dilation", "Discharge home on bed rest with follow-up in 1 week"],
    a: 0,
    r: "Complete placenta previa with bleeding at 36 weeks requires hospitalization, blood product availability (type and crossmatch), and delivery planning. Cesarean delivery is the only safe delivery method for complete placenta previa (vaginal delivery risks catastrophic hemorrhage). If bleeding is controlled and fetus is premature, expectant management with close monitoring may allow corticosteroid administration and fetal maturation. Digital cervical exam is ABSOLUTELY CONTRAINDICATED in placenta previa as it can provoke massive hemorrhage.",
    s: "Women's Health"
  },
  {
    q: "A 40-year-old female presents with secondary amenorrhea for 6 months. Pregnancy test is negative. FSH is 68 mIU/mL (elevated). Estradiol is 12 pg/mL (low). She has hot flashes and vaginal dryness. What is the diagnosis?",
    o: ["Primary ovarian insufficiency (premature ovarian failure); confirm with repeat FSH in 4-6 weeks, offer hormone replacement therapy, and screen for associated conditions", "Hypothalamic amenorrhea; weight gain counseling", "Polycystic ovary syndrome; start combined OCP", "Hyperprolactinemia; check prolactin and MRI pituitary"],
    a: 0,
    r: "Elevated FSH (greater than 40 mIU/mL on 2 occasions, 4-6 weeks apart) with low estradiol and amenorrhea before age 40 defines primary ovarian insufficiency (POI). POI affects 1% of women under 40. Associated conditions to screen for include autoimmune thyroiditis (25%), adrenal insufficiency, and Turner syndrome (karyotype in women under 30). HRT is recommended until the natural age of menopause (50-51) to prevent cardiovascular disease, osteoporosis, and manage vasomotor symptoms. Spontaneous conception occurs in 5-10%.",
    s: "Women's Health"
  },
  {
    q: "A 30-year-old male who has sex with men presents for HIV pre-exposure prophylaxis (PrEP) counseling. He is HIV-negative, has normal renal function, and hepatitis B surface antigen is negative. What is the recommended PrEP regimen and monitoring?",
    o: ["Tenofovir disoproxil fumarate/emtricitabine (TDF/FTC) daily; HIV testing every 3 months, renal function and STI screening every 3-6 months", "Tenofovir/emtricitabine only when anticipating sexual contact", "HIV testing annually while on PrEP", "PrEP is only recommended for IV drug users"],
    a: 0,
    r: "Daily oral TDF/FTC (Truvada) or TAF/FTC (Descovy for non-receptive vaginal sex) reduces HIV acquisition by 99% when taken consistently. PrEP monitoring includes: HIV testing every 3 months (to ensure the patient has not seroconverted), renal function every 3-6 months (TDF nephrotoxicity), STI screening (GC/CT, syphilis) every 3-6 months, and hepatitis B monitoring. On-demand (event-driven) PrEP (2-1-1 dosing) is an alternative for MSM only per IPERGAY trial. PrEP is indicated for all individuals at substantial HIV risk.",
    s: "Infectious Disease"
  },
  {
    q: "A 45-year-old male with a prosthetic heart valve develops fever, new regurgitant murmur, and positive blood cultures for Staphylococcus aureus. TEE shows a 15 mm vegetation with a perivalvular abscess. What is the management?",
    o: ["Urgent cardiac surgery consultation for valve replacement plus prolonged IV antibiotic therapy (minimum 6 weeks)", "IV antibiotics alone for 6 weeks without surgical evaluation", "Oral antibiotics for 2 weeks", "Observation with repeat blood cultures in 1 week"],
    a: 0,
    r: "Prosthetic valve endocarditis with S. aureus is a class I indication for surgical intervention, especially with perivalvular abscess (which antibiotics cannot penetrate) and large vegetation (greater than 10 mm, embolic risk). Surgery involves debridement and valve replacement. Prolonged IV antibiotics (minimum 6 weeks, often combination therapy with nafcillin/vancomycin plus gentamicin plus rifampin) are required post-operatively. Mortality without surgery in complicated prosthetic valve endocarditis exceeds 50%.",
    s: "Infectious Disease"
  },
  {
    q: "A 50-year-old female asks about the recommended vaccines for an upcoming trip to sub-Saharan Africa. She has no chronic medical conditions and has completed routine childhood and adult immunizations including COVID-19. What travel-specific vaccinations should the NP recommend?",
    o: ["Yellow fever vaccine (required), typhoid vaccine, hepatitis A booster if needed, meningococcal vaccine for the meningitis belt, and malaria chemoprophylaxis; consult CDC Travelers' Health", "Routine immunizations only are sufficient", "Rabies vaccine for all travelers", "Yellow fever vaccine is optional for Africa"],
    a: 0,
    r: "Travel to sub-Saharan Africa requires specific immunizations and prophylaxis: yellow fever vaccine (required by many countries and essential for protection), typhoid vaccine (Salmonella typhi risk), hepatitis A (if not immune), meningococcal vaccine (especially for the meningitis belt), and malaria chemoprophylaxis (atovaquone-proguanil, doxycycline, or mefloquine depending on resistance patterns). Rabies pre-exposure prophylaxis is recommended for extended stays or potential animal contact. CDC Travelers' Health website provides country-specific recommendations.",
    s: "Preventive Medicine"
  }
];
