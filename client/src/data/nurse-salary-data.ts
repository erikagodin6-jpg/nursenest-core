export interface SalaryBySpecialty {
  specialty: string;
  averageSalary: string;
  salaryRange: string;
  notes: string;
}

export interface SalaryByExperience {
  level: string;
  years: string;
  averageSalary: string;
}

export interface WorkplaceSetting {
  setting: string;
  averageSalary: string;
  notes: string;
}

export interface NurseSalaryCountry {
  slug: string;
  country: string;
  currency: string;
  currencySymbol: string;
  flagEmoji: string;
  averageSalary: string;
  salaryRange: string;
  description: string;
  overview: string;
  salaryBySpecialty: SalaryBySpecialty[];
  salaryByExperience: SalaryByExperience[];
  workplaceSettings: WorkplaceSetting[];
  careerOutlook: string;
  keyFactors: string[];
  faqs: { question: string; answer: string }[];
  relatedCountrySlugs: string[];
}

export const SALARY_COUNTRIES: NurseSalaryCountry[] = [
  {
    slug: "nurse-salary-canada",
    country: "Canada",
    currency: "CAD",
    currencySymbol: "$",
    flagEmoji: "\ud83c\udde8\ud83c\udde6",
    averageSalary: "$78,000 CAD",
    salaryRange: "$55,000 – $105,000 CAD",
    description: "Comprehensive guide to nursing salaries in Canada including average pay by province, specialty, and experience level.",
    overview: "Nursing salaries in Canada vary significantly by province, specialty, and experience level. Registered Nurses (RNs) earn an average of $78,000 CAD per year, while Registered Practical Nurses (RPNs/LPNs) average $55,000 CAD. Nurse Practitioners (NPs) can earn over $105,000 CAD. Salaries are generally higher in northern and remote communities due to isolation premiums, and in provinces with higher cost of living such as Ontario and British Columbia. Canada's publicly funded healthcare system provides stable employment with comprehensive benefits including pension plans, extended health coverage, and paid professional development.",
    salaryBySpecialty: [
      { specialty: "Medical-Surgical", averageSalary: "$72,000", salaryRange: "$60,000 – $85,000", notes: "Most common nursing specialty; widely available positions" },
      { specialty: "ICU / Critical Care", averageSalary: "$85,000", salaryRange: "$72,000 – $100,000", notes: "Premium pay for specialized skills; shift differentials common" },
      { specialty: "Emergency", averageSalary: "$82,000", salaryRange: "$68,000 – $98,000", notes: "Higher pay in urban trauma centres" },
      { specialty: "Operating Room / Perioperative", averageSalary: "$80,000", salaryRange: "$66,000 – $96,000", notes: "Premium for on-call availability" },
      { specialty: "Labour & Delivery", averageSalary: "$78,000", salaryRange: "$65,000 – $95,000", notes: "Specialized training required" },
      { specialty: "Mental Health / Psychiatric", averageSalary: "$76,000", salaryRange: "$62,000 – $92,000", notes: "Growing demand across provinces" },
      { specialty: "Public Health", averageSalary: "$75,000", salaryRange: "$62,000 – $90,000", notes: "Government positions with stable benefits" },
      { specialty: "Nurse Practitioner", averageSalary: "$105,000", salaryRange: "$90,000 – $125,000", notes: "Highest earning nursing role; requires graduate education" },
    ],
    salaryByExperience: [
      { level: "New Graduate", years: "0–1 years", averageSalary: "$60,000 – $68,000" },
      { level: "Early Career", years: "2–4 years", averageSalary: "$68,000 – $76,000" },
      { level: "Mid-Career", years: "5–9 years", averageSalary: "$76,000 – $85,000" },
      { level: "Experienced", years: "10–19 years", averageSalary: "$85,000 – $95,000" },
      { level: "Senior / Advanced", years: "20+ years", averageSalary: "$90,000 – $105,000" },
    ],
    workplaceSettings: [
      { setting: "Hospital (Acute Care)", averageSalary: "$78,000", notes: "Includes shift differentials and overtime" },
      { setting: "Community Health Centre", averageSalary: "$72,000", notes: "Regular hours; strong benefits" },
      { setting: "Long-Term Care", averageSalary: "$68,000", notes: "Growing demand; lower starting salaries" },
      { setting: "Home Care", averageSalary: "$65,000", notes: "Flexible scheduling; travel required" },
      { setting: "Private Clinic", averageSalary: "$70,000", notes: "Regular hours; fewer benefits" },
      { setting: "Remote / Northern Communities", averageSalary: "$95,000+", notes: "Isolation premiums; housing provided" },
    ],
    careerOutlook: "Canada faces a significant nursing shortage projected to continue through 2030. The Canadian Nurses Association estimates the country will need 60,000 additional nurses by 2030. This shortage is driving salary increases, signing bonuses, and improved working conditions across provinces. International nurses are actively recruited, and immigration pathways for nurses have been expanded. The demand is particularly acute in rural and remote communities, long-term care, and critical care specialties.",
    keyFactors: [
      "Province of employment (Ontario, BC, and Alberta generally pay highest)",
      "Union vs. non-union position (most hospital positions are unionized with step-based pay scales)",
      "Specialty certification and advanced education",
      "Shift differentials (evenings, nights, weekends, holidays)",
      "Northern and remote community isolation premiums",
      "Full-time vs. part-time vs. casual employment status",
    ],
    faqs: [
      { question: "What is the average nurse salary in Canada?", answer: "The average RN salary in Canada is approximately $78,000 CAD per year. RPNs/LPNs average $55,000 CAD, and Nurse Practitioners average $105,000 CAD. Salaries vary significantly by province, specialty, and experience." },
      { question: "Which province pays nurses the most in Canada?", answer: "Alberta, Ontario, and British Columbia generally offer the highest nursing salaries. However, northern and remote communities in any province offer significantly higher salaries due to isolation premiums, sometimes exceeding $95,000 CAD for RNs." },
      { question: "Do Canadian nurses get overtime pay?", answer: "Yes. Most nursing positions in Canada are covered by collective agreements that provide overtime pay (typically 1.5x or 2x regular rate) for hours worked beyond the standard schedule. Shift differentials for evenings, nights, and weekends are also common." },
      { question: "How do I increase my nursing salary in Canada?", answer: "Key strategies include obtaining specialty certifications (e.g., CCRN, CEN), pursuing advanced education (BScN, NP), working in high-demand specialties like ICU or OR, accepting positions in northern/remote communities, and negotiating during job offers." },
    ],
    relatedCountrySlugs: ["nurse-salary-united-states", "nurse-salary-united-kingdom", "nurse-salary-australia"],
  },
  {
    slug: "nurse-salary-united-states",
    country: "United States",
    currency: "USD",
    currencySymbol: "$",
    flagEmoji: "\ud83c\uddfa\ud83c\uddf8",
    averageSalary: "$86,000 USD",
    salaryRange: "$52,000 – $130,000+ USD",
    description: "Complete guide to nursing salaries in the United States including average pay by state, specialty, and experience level.",
    overview: "The United States is the largest employer of nurses globally, with over 3.1 million registered nurses. Average RN salaries are approximately $86,000 USD per year, though this varies dramatically by state — from under $60,000 in some southern states to over $130,000 in California and other high-cost areas. The US nursing shortage continues to grow, with the Bureau of Labor Statistics projecting 6% growth in RN employment through 2032. Travel nursing has emerged as a high-paying option, with experienced travel nurses earning $2,000–$4,000+ per week.",
    salaryBySpecialty: [
      { specialty: "Medical-Surgical", averageSalary: "$75,000", salaryRange: "$58,000 – $92,000", notes: "Most common entry point; available nationwide" },
      { specialty: "ICU / Critical Care", averageSalary: "$95,000", salaryRange: "$75,000 – $120,000", notes: "High demand; certification premium" },
      { specialty: "Emergency / Trauma", averageSalary: "$90,000", salaryRange: "$70,000 – $115,000", notes: "Higher in level 1 trauma centres" },
      { specialty: "Operating Room", averageSalary: "$88,000", salaryRange: "$68,000 – $112,000", notes: "On-call pay adds significantly" },
      { specialty: "Labor & Delivery", averageSalary: "$82,000", salaryRange: "$65,000 – $105,000", notes: "Certification preferred" },
      { specialty: "Oncology", averageSalary: "$85,000", salaryRange: "$68,000 – $108,000", notes: "Chemo certification adds premium" },
      { specialty: "CRNA (Nurse Anesthetist)", averageSalary: "$205,000", salaryRange: "$175,000 – $250,000+", notes: "Highest-paid nursing specialty in the US" },
      { specialty: "Nurse Practitioner", averageSalary: "$121,000", salaryRange: "$95,000 – $155,000", notes: "Scope varies by state" },
      { specialty: "Travel Nursing", averageSalary: "$110,000+", salaryRange: "$85,000 – $200,000+", notes: "Variable; includes stipends and housing" },
    ],
    salaryByExperience: [
      { level: "New Graduate", years: "0–1 years", averageSalary: "$58,000 – $72,000" },
      { level: "Early Career", years: "2–4 years", averageSalary: "$68,000 – $82,000" },
      { level: "Mid-Career", years: "5–9 years", averageSalary: "$78,000 – $95,000" },
      { level: "Experienced", years: "10–19 years", averageSalary: "$88,000 – $110,000" },
      { level: "Senior / Advanced Practice", years: "20+ years", averageSalary: "$95,000 – $130,000+" },
    ],
    workplaceSettings: [
      { setting: "Hospital (Acute Care)", averageSalary: "$86,000", notes: "Shift differentials; overtime opportunities" },
      { setting: "Ambulatory Care / Outpatient", averageSalary: "$72,000", notes: "Regular hours; no nights/weekends" },
      { setting: "Home Health", averageSalary: "$68,000", notes: "Flexible schedule; mileage reimbursement" },
      { setting: "Long-Term Care / SNF", averageSalary: "$65,000", notes: "Staffing challenges; growing demand" },
      { setting: "Government / VA", averageSalary: "$82,000", notes: "Federal benefits; loan repayment programs" },
      { setting: "Travel Nursing", averageSalary: "$110,000+", notes: "13-week contracts; housing/stipend included" },
    ],
    careerOutlook: "The US Bureau of Labor Statistics projects 6% growth in RN employment from 2022 to 2032, faster than average for all occupations. The nursing shortage is particularly acute in rural areas, long-term care, and specialty units. This shortage is driving competitive salaries, signing bonuses (often $5,000–$20,000), tuition reimbursement, and loan forgiveness programs. Advanced practice roles (NP, CRNA, CNS) are among the fastest-growing healthcare occupations.",
    keyFactors: [
      "State of employment (California, Hawaii, and Northeast states pay highest; Southern states pay lowest)",
      "Metropolitan vs. rural location",
      "Specialty certification (CCRN, CEN, OCN, etc.)",
      "Advanced degree (BSN vs. ADN affects starting salary by $3,000–$8,000)",
      "Shift differentials and overtime availability",
      "Union vs. non-union facility",
      "Magnet hospital status (typically higher salaries)",
    ],
    faqs: [
      { question: "What is the average nurse salary in the United States?", answer: "The average RN salary in the US is approximately $86,000 USD per year (BLS data). This varies dramatically by state — from approximately $60,000 in Mississippi to over $130,000 in California." },
      { question: "Which state pays nurses the most?", answer: "California consistently has the highest average RN salary at approximately $130,000 USD. Hawaii, Oregon, Washington, and Massachusetts also rank among the top-paying states. However, cost of living must be considered." },
      { question: "How much do travel nurses make?", answer: "Travel nurses typically earn $2,000–$4,000+ per week depending on specialty, location, and contract details. Annual earnings can exceed $100,000–$200,000 including housing stipends, travel reimbursement, and tax-free per diem allowances." },
      { question: "Is a BSN worth more than an ADN?", answer: "Yes. BSN-prepared nurses typically earn $3,000–$8,000 more per year than ADN-prepared nurses. Many hospitals now require or strongly prefer BSN-prepared nurses, and Magnet hospitals require 80% BSN workforce." },
    ],
    relatedCountrySlugs: ["nurse-salary-canada", "nurse-salary-united-kingdom", "nurse-salary-australia"],
  },
  {
    slug: "nurse-salary-united-kingdom",
    country: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    flagEmoji: "\ud83c\uddec\ud83c\udde7",
    averageSalary: "£35,000 GBP",
    salaryRange: "£28,000 – £55,000+ GBP",
    description: "Complete guide to nursing salaries in the United Kingdom including NHS pay bands, specialty pay, and career progression.",
    overview: "Nursing salaries in the United Kingdom are primarily determined by the NHS Agenda for Change (AfC) pay framework, which uses a banding system from Band 5 (newly qualified) to Band 9 (senior leadership). Newly qualified nurses start at Band 5 (approximately £28,000 GBP) and can progress to Band 6 and beyond with experience and specialization. The NHS provides a structured career pathway with annual increments, enhanced pay for unsocial hours, and comprehensive pension and benefits. Private sector nursing salaries may vary and are typically higher in London and Southeast England.",
    salaryBySpecialty: [
      { specialty: "Staff Nurse (Band 5)", averageSalary: "£28,000 – £35,000", salaryRange: "£28,000 – £35,000", notes: "Starting point for newly qualified nurses" },
      { specialty: "Senior Staff Nurse (Band 6)", averageSalary: "£35,000 – £43,000", salaryRange: "£35,000 – £43,000", notes: "2–3 years experience; specialist skills" },
      { specialty: "Ward Manager / Sister (Band 7)", averageSalary: "£43,000 – £50,000", salaryRange: "£43,000 – £50,000", notes: "Leadership and management responsibilities" },
      { specialty: "ICU / Critical Care", averageSalary: "£38,000", salaryRange: "£32,000 – £48,000", notes: "Specialist training required; Band 6–7" },
      { specialty: "A&E / Emergency", averageSalary: "£36,000", salaryRange: "£30,000 – £46,000", notes: "Unsocial hours premium significant" },
      { specialty: "Mental Health", averageSalary: "£35,000", salaryRange: "£28,000 – £45,000", notes: "High demand; community and inpatient roles" },
      { specialty: "Advanced Nurse Practitioner (Band 8a)", averageSalary: "£50,000 – £57,000", salaryRange: "£50,000 – £57,000", notes: "Requires master's degree" },
      { specialty: "Nurse Consultant (Band 8b–8c)", averageSalary: "£57,000 – £70,000+", salaryRange: "£57,000 – £73,000", notes: "Senior clinical and strategic role" },
    ],
    salaryByExperience: [
      { level: "Newly Qualified (Band 5 Entry)", years: "0–1 years", averageSalary: "£28,407" },
      { level: "Band 5 Top", years: "2–4 years", averageSalary: "£34,581" },
      { level: "Band 6 Entry", years: "3–5 years", averageSalary: "£35,392" },
      { level: "Band 6 Top", years: "5–8 years", averageSalary: "£42,618" },
      { level: "Band 7", years: "8–15 years", averageSalary: "£43,742 – £50,056" },
      { level: "Band 8a+", years: "15+ years", averageSalary: "£50,952 – £73,664" },
    ],
    workplaceSettings: [
      { setting: "NHS Hospital", averageSalary: "£35,000", notes: "Structured pay bands; NHS pension; unsocial hours premium" },
      { setting: "NHS Community", averageSalary: "£34,000", notes: "Regular hours; less shift work" },
      { setting: "Private Hospital", averageSalary: "£38,000", notes: "May offer higher base pay; fewer benefits" },
      { setting: "Agency / Bank Nursing", averageSalary: "£40,000+", notes: "Higher hourly rates; no guaranteed hours" },
      { setting: "Care Home / Nursing Home", averageSalary: "£30,000", notes: "Often lower than NHS rates" },
      { setting: "Practice Nurse (GP Surgery)", averageSalary: "£33,000", notes: "Regular hours; no nights/weekends" },
    ],
    careerOutlook: "The NHS faces a nursing vacancy rate of approximately 10%, with over 40,000 unfilled nursing positions across England alone. The UK government has introduced international recruitment programmes, increased university nursing places, and improved NHS pay to address the shortage. International nurses make up approximately 18% of the NHS nursing workforce. Career progression through the AfC banding system provides clear salary growth, and advanced practice roles (ANP, Nurse Consultant) offer salaries above £50,000.",
    keyFactors: [
      "NHS Agenda for Change pay band (Band 5–8)",
      "High Cost Area Supplement (London and surrounding areas receive 5–20% supplement)",
      "Unsocial hours premium (nights, weekends, bank holidays: 30–60% extra)",
      "NHS vs. private sector employment",
      "Specialty and advanced practice qualifications",
      "Full-time vs. part-time vs. bank/agency work",
    ],
    faqs: [
      { question: "What is the starting salary for nurses in the UK?", answer: "Newly qualified nurses in the NHS start at Band 5, which is approximately £28,407 GBP per year (2024/25 rates). This increases with annual increments to a maximum of £34,581 at the top of Band 5." },
      { question: "Do London nurses get paid more?", answer: "Yes. NHS nurses in London receive a High Cost Area Supplement of up to 20% on top of their basic salary. Inner London receives the highest supplement, followed by Outer London and the Fringe area." },
      { question: "How does NHS pay banding work?", answer: "The NHS Agenda for Change pay system assigns roles to bands based on skills, knowledge, and responsibility. Nurses typically start at Band 5 and progress through Bands 6, 7, and 8 with experience, qualifications, and promotion. Each band has multiple pay points with annual increments." },
      { question: "Can international nurses work in the UK NHS?", answer: "Yes. International nurses must pass the NMC Test of Competence (CBT and OSCE) and demonstrate English proficiency (IELTS 7.0 or OET B). Many NHS trusts actively recruit internationally and may offer relocation support, adaptation programs, and visa sponsorship." },
    ],
    relatedCountrySlugs: ["nurse-salary-canada", "nurse-salary-united-states", "nurse-salary-australia"],
  },
  {
    slug: "nurse-salary-australia",
    country: "Australia",
    currency: "AUD",
    currencySymbol: "$",
    flagEmoji: "\ud83c\udde6\ud83c\uddfa",
    averageSalary: "$82,000 AUD",
    salaryRange: "$60,000 – $120,000+ AUD",
    description: "Complete guide to nursing salaries in Australia including average pay by state, specialty, and experience level.",
    overview: "Australia offers competitive nursing salaries with strong employment benefits and a high quality of life. Registered Nurses earn an average of $82,000 AUD per year, with salaries varying by state, specialty, and experience. Enterprise bargaining agreements (EBAs) in the public sector provide structured pay scales with annual increments. Australia actively recruits international nurses to address shortages, particularly in rural and remote areas where salaries can be significantly higher. The Australian healthcare system provides a mix of public (Medicare-funded) and private hospital employment.",
    salaryBySpecialty: [
      { specialty: "Registered Nurse (Grade 2)", averageSalary: "$75,000", salaryRange: "$62,000 – $88,000", notes: "Standard nursing role in public hospitals" },
      { specialty: "ICU / Critical Care", averageSalary: "$90,000", salaryRange: "$75,000 – $108,000", notes: "Specialist allowance applies" },
      { specialty: "Emergency", averageSalary: "$86,000", salaryRange: "$72,000 – $105,000", notes: "Penalty rates for shift work" },
      { specialty: "Operating Theatre", averageSalary: "$84,000", salaryRange: "$70,000 – $102,000", notes: "On-call loading" },
      { specialty: "Mental Health", averageSalary: "$80,000", salaryRange: "$65,000 – $98,000", notes: "Mental health nursing allowance in some states" },
      { specialty: "Midwifery", averageSalary: "$82,000", salaryRange: "$68,000 – $100,000", notes: "Dual registration (nurse + midwife) common" },
      { specialty: "Clinical Nurse Specialist (Grade 3)", averageSalary: "$95,000", salaryRange: "$85,000 – $105,000", notes: "Advanced clinical expertise" },
      { specialty: "Nurse Practitioner", averageSalary: "$115,000", salaryRange: "$100,000 – $135,000", notes: "Master's degree required; prescribing authority" },
    ],
    salaryByExperience: [
      { level: "New Graduate", years: "0–1 years", averageSalary: "$60,000 – $68,000" },
      { level: "Registered Nurse Year 2–4", years: "2–4 years", averageSalary: "$68,000 – $78,000" },
      { level: "Registered Nurse Year 5–8", years: "5–8 years", averageSalary: "$78,000 – $88,000" },
      { level: "Senior RN / Clinical Nurse", years: "8–15 years", averageSalary: "$88,000 – $100,000" },
      { level: "Clinical Nurse Specialist / NP", years: "15+ years", averageSalary: "$95,000 – $135,000" },
    ],
    workplaceSettings: [
      { setting: "Public Hospital", averageSalary: "$82,000", notes: "EBA pay scales; strong benefits; penalty rates" },
      { setting: "Private Hospital", averageSalary: "$78,000", notes: "May offer higher base; different conditions" },
      { setting: "Aged Care", averageSalary: "$68,000", notes: "Growing sector; government wage supplement" },
      { setting: "Community / Primary Health", averageSalary: "$75,000", notes: "Regular hours; less shift work" },
      { setting: "Agency Nursing", averageSalary: "$90,000+", notes: "Higher hourly rates; flexible scheduling" },
      { setting: "Remote / Rural", averageSalary: "$95,000+", notes: "Remote area allowances; accommodation provided" },
    ],
    careerOutlook: "Australia faces a nursing shortage projected to worsen through 2030, driven by population growth, aging demographics, and nurse retirement. The Australian Government has committed to increasing nursing university places and expanding international recruitment pathways. Skilled migration visas for nurses remain a priority occupation. Rural and remote areas offer the highest salaries and strongest demand, with additional incentives including accommodation, relocation assistance, and retention bonuses.",
    keyFactors: [
      "State or territory of employment (NSW and WA generally pay highest)",
      "Public vs. private sector employment",
      "Enterprise bargaining agreement (EBA) pay classification",
      "Penalty rates (evenings +15%, nights +25%, weekends +50–75%, public holidays +150%)",
      "Rural and remote area allowances",
      "Specialty qualifications and postgraduate education",
      "Full-time vs. part-time vs. casual employment",
    ],
    faqs: [
      { question: "What is the average nurse salary in Australia?", answer: "The average Registered Nurse salary in Australia is approximately $82,000 AUD per year. Salaries range from $60,000 for new graduates to over $120,000 for experienced Clinical Nurse Specialists and Nurse Practitioners." },
      { question: "Which state pays nurses the most in Australia?", answer: "New South Wales (NSW) and Western Australia (WA) generally offer the highest nursing salaries. However, remote areas in any state offer significantly higher salaries due to remote area allowances and incentive payments." },
      { question: "What are penalty rates for nurses in Australia?", answer: "Penalty rates in public hospitals typically include: evenings 15% extra, nights 25% extra, Saturdays 50% extra, Sundays 75% extra, and public holidays 150% extra. These are set by enterprise bargaining agreements." },
      { question: "Can international nurses work in Australia?", answer: "Yes. International nurses must register with AHPRA, which requires English proficiency (IELTS 7.0 or OET B), qualification assessment, and potentially a bridging program or supervised practice. Nursing is on Australia's skilled occupation list for migration." },
    ],
    relatedCountrySlugs: ["nurse-salary-canada", "nurse-salary-united-states", "nurse-salary-united-kingdom"],
  },
];

export function getSalaryCountryBySlug(slug: string): NurseSalaryCountry | undefined {
  return SALARY_COUNTRIES.find(c => c.slug === slug);
}

export function getAllSalaryCountrySlugs(): string[] {
  return SALARY_COUNTRIES.map(c => c.slug);
}
