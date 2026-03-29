export interface CountryData {
  slug: string;
  name: string;
  flag: string;
  regulatoryBody: string;
  requiredExams: string[];
  languageTests: string[];
  registrationTimeline: string;
  averageSalary: string;
  visaTypes: string[];
  bridgingPrograms: string;
  workSettings: string[];
  barriers: string[];
  sections: { heading: string; content: string; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
}

export interface MigrationData {
  slug: string;
  sourceCountry: string;
  destinationCountry: string;
  title: string;
  steps: { stepNumber: number; title: string; description: string; timeline?: string }[];
  documents: string[];
  commonMistakes: string[];
  estimatedTimeline: string;
  sections: { heading: string; content: string; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
}

export interface ComparisonData {
  slug: string;
  countryA: string;
  countryB: string;
  title: string;
  points: { aspect: string; valueA: string; valueB: string }[];
  summary: string;
  sections: { heading: string; content: string; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
}

export interface ClusterPageData {
  slug: string;
  title: string;
  sections: { heading: string; content: string; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  relatedLinks: { title: string; href: string }[];
}

export interface ExamPageData {
  slug: string;
  title: string;
  sections: { heading: string; content: string; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  prepTips: string[];
  commonMistakes: string[];
  relatedLinks: { title: string; href: string }[];
}

export const DESTINATION_COUNTRIES: CountryData[] = [
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    regulatoryBody: "NNAS (National Nursing Assessment Service) and Provincial Regulatory Bodies (e.g., CNO, BCCNM)",
    requiredExams: ["NCLEX-RN or REx-PN (depending on designation)", "Jurisprudence exam (varies by province)"],
    languageTests: ["IELTS Academic (minimum 6.5 overall, 7.0 speaking)", "CELBAN (Canadian English Language Benchmark Assessment for Nurses)"],
    registrationTimeline: "6–18 months from application to registration",
    averageSalary: "$70,000–$95,000 CAD per year (varies by province and experience)",
    visaTypes: ["Express Entry (Federal Skilled Worker)", "Provincial Nominee Program (PNP)", "Atlantic Immigration Program"],
    bridgingPrograms: "Several provinces offer bridging programs for internationally educated nurses, including Ontario, British Columbia, Alberta, and Manitoba. These programs provide clinical placements, language support, and orientation to the Canadian healthcare system.",
    workSettings: ["Hospitals", "Long-term care facilities", "Community health centres", "Home care agencies", "Public health departments"],
    barriers: ["Lengthy credential evaluation process through NNAS", "Meeting language proficiency requirements", "Securing supervised clinical practice hours", "Understanding provincial vs. federal regulatory differences", "Cost of credential evaluation and exams ($3,000–$6,000+)"],
    sections: [
      {
        heading: "Overview of Nursing in Canada",
        content: "Canada has a strong demand for internationally educated nurses (IENs), particularly in provinces like Ontario, British Columbia, Alberta, and the Atlantic provinces. The Canadian healthcare system is publicly funded through provincial and territorial health plans, providing universal coverage for medically necessary services.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "To practice as a nurse in Canada, internationally educated nurses must complete a multi-step process involving credential evaluation, language testing, and passing the required licensing examination.",
        bullets: [
          "Step 1: Apply to NNAS for an advisory report on your nursing credentials",
          "Step 2: Submit documents to the provincial regulatory body in your desired province",
          "Step 3: Complete any required bridging or additional education",
          "Step 4: Pass the required language proficiency test (IELTS or CELBAN)",
          "Step 5: Register for and pass the NCLEX-RN or REx-PN examination",
          "Step 6: Apply for registration with the provincial regulatory body",
        ],
      },
      {
        heading: "Immigration Pathways",
        content: "Canada offers several immigration pathways specifically suited for nurses. The Express Entry system, particularly the Federal Skilled Worker Program, is the most common route. Many provinces also have specific Provincial Nominee Programs that prioritize healthcare workers.",
      },
      {
        heading: "Salary and Working Conditions",
        content: "Nursing salaries in Canada are competitive and vary by province, experience level, and specialization. Benefits typically include comprehensive health insurance, pension plans, paid vacation, and professional development opportunities. Unionized positions are common and offer additional protections.",
      },
    ],
    faq: [
      { question: "How long does it take to become a registered nurse in Canada as an IEN?", answer: "The process typically takes 6–18 months from initial application to registration, depending on the province, any additional education requirements, and exam scheduling." },
      { question: "Do I need Canadian work experience to register as a nurse?", answer: "No, Canadian work experience is not required for initial registration. However, some provinces may require supervised practice hours as part of the registration process." },
      { question: "Can I work while waiting for my nursing license in Canada?", answer: "You cannot practice nursing without a license, but you may be eligible to work in healthcare support roles. Some provinces offer interim permits that allow supervised practice." },
      { question: "Which Canadian province is best for international nurses?", answer: "Ontario, British Columbia, and Alberta have the highest demand. Atlantic provinces often have faster processing times and specific immigration programs for healthcare workers." },
    ],
    metaTitle: "How to Become a Nurse in Canada as an International Nurse | Complete Guide",
    metaDescription: "Step-by-step guide for internationally educated nurses to obtain nursing licensure in Canada. Learn about NNAS, NCLEX-RN, immigration pathways, salary expectations, and provincial requirements.",
  },
  {
    slug: "united-states",
    name: "United States",
    flag: "🇺🇸",
    regulatoryBody: "State Boards of Nursing (regulated state by state), CGFNS (Commission on Graduates of Foreign Nursing Schools)",
    requiredExams: ["NCLEX-RN (National Council Licensure Examination)", "CGFNS Certification Program or VisaScreen Certificate"],
    languageTests: ["TOEFL iBT (minimum 83)", "IELTS Academic (minimum 6.5 overall)", "PTE Academic (minimum 53)"],
    registrationTimeline: "3–12 months (varies by state)",
    averageSalary: "$60,000–$120,000 USD per year (varies significantly by state)",
    visaTypes: ["VisaScreen Certificate (required for occupational visa)", "H-1B visa (specialty occupation)", "TN visa (for Canadian and Mexican nationals)", "EB-3 Green Card (employer-sponsored)"],
    bridgingPrograms: "The US does not have standardized bridging programs for IENs, but many employers offer orientation and support. CGFNS provides credential evaluation services.",
    workSettings: ["Hospitals", "Outpatient clinics", "Skilled nursing facilities", "Home health agencies", "Schools and universities"],
    barriers: ["State-by-state licensing requirements", "VisaScreen and CGFNS certification complexity", "Immigration visa backlogs", "High cost of credential evaluation", "Varying scope of practice by state"],
    sections: [
      {
        heading: "Overview of Nursing in the United States",
        content: "The United States has one of the highest demands for nurses globally, with shortages projected to continue growing through 2030 and beyond. International nurses are actively recruited, particularly in states like California, New York, Texas, Florida, and Illinois.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "Licensing in the US is regulated at the state level, meaning requirements can vary. However, all states require passage of the NCLEX-RN examination.",
        bullets: [
          "Step 1: Choose your target state and review their Board of Nursing requirements",
          "Step 2: Apply for credential evaluation through CGFNS or an approved agency",
          "Step 3: Obtain a VisaScreen Certificate (required for immigration purposes)",
          "Step 4: Meet English language proficiency requirements",
          "Step 5: Apply for NCLEX-RN authorization to test (ATT)",
          "Step 6: Pass the NCLEX-RN examination",
          "Step 7: Apply for state licensure",
        ],
      },
      {
        heading: "Immigration Pathways",
        content: "International nurses typically enter the US through employer-sponsored visas. The EB-3 Green Card category is the most common pathway, though processing times can be lengthy. The TN visa is available for Canadian and Mexican nurses under USMCA.",
      },
      {
        heading: "Salary and Working Conditions",
        content: "US nursing salaries vary widely by state, with the highest salaries in California, Hawaii, Massachusetts, Oregon, and Alaska. Benefits vary by employer but often include health insurance, retirement plans, and continuing education support.",
      },
    ],
    faq: [
      { question: "Can I take the NCLEX-RN before moving to the United States?", answer: "Yes, the NCLEX-RN can be taken at Pearson VUE testing centers in many countries worldwide. You must first receive Authorization to Test (ATT) from a US state Board of Nursing." },
      { question: "What is the CGFNS certification and do I need it?", answer: "CGFNS certification validates your nursing education and credentials for US practice. While not all states require it, the VisaScreen Certificate (also from CGFNS) is required for immigration purposes." },
      { question: "How long does the EB-3 Green Card process take for nurses?", answer: "Processing times vary by country of origin. For most countries, it takes 2–5 years, though some nationalities may face longer wait times due to per-country visa caps." },
      { question: "Which US states have the highest demand for international nurses?", answer: "California, Texas, New York, Florida, and Illinois consistently have high demand. Rural areas across many states also actively recruit international nurses." },
    ],
    metaTitle: "How to Become a Nurse in the United States | International Nurse Guide",
    metaDescription: "Complete guide for international nurses seeking licensure in the USA. Learn about NCLEX-RN, CGFNS, VisaScreen, immigration pathways, state requirements, and salary expectations.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
    regulatoryBody: "Nursing and Midwifery Council (NMC)",
    requiredExams: ["CBT (Computer-Based Test)", "OSCE (Objective Structured Clinical Examination)"],
    languageTests: ["IELTS Academic (minimum 7.0 overall, 7.0 in each band)", "OET (minimum B in all four sub-tests)"],
    registrationTimeline: "3–9 months from application to NMC registration",
    averageSalary: "£28,000–£45,000 GBP per year (NHS Agenda for Change bands)",
    visaTypes: ["Health and Care Worker Visa", "Skilled Worker Visa"],
    bridgingPrograms: "Many NHS trusts offer supervised practice programs and OSCE preparation courses. The NMC requires a period of supervised practice for some internationally educated nurses.",
    workSettings: ["NHS hospitals", "Private hospitals", "Community nursing", "Care homes", "GP surgeries"],
    barriers: ["High IELTS/OET score requirements", "OSCE pass rate challenges", "Cost of NMC registration and exams", "Understanding NHS banding system", "Adapting to UK clinical practice standards"],
    sections: [
      {
        heading: "Overview of Nursing in the United Kingdom",
        content: "The UK's National Health Service (NHS) is one of the largest employers of nurses globally and actively recruits international nurses to address ongoing staffing shortages. The NMC oversees registration for all nurses and midwives practicing in the UK.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "International nurses must register with the NMC, which involves a two-part test process and credential verification.",
        bullets: [
          "Step 1: Create an NMC Online account and submit your application",
          "Step 2: Provide evidence of English language proficiency (IELTS or OET)",
          "Step 3: Pass the CBT (Computer-Based Test) covering nursing knowledge",
          "Step 4: Pass the OSCE (Objective Structured Clinical Examination)",
          "Step 5: Receive NMC registration PIN",
          "Step 6: Apply for Health and Care Worker Visa with employer sponsorship",
        ],
      },
      {
        heading: "Immigration Pathways",
        content: "The Health and Care Worker Visa is the primary route for international nurses coming to the UK. It offers reduced visa fees and exemption from the Immigration Health Surcharge, making it an attractive pathway.",
      },
      {
        heading: "Salary and Working Conditions",
        content: "NHS nursing salaries follow the Agenda for Change pay scale, with bands ranging from Band 5 (newly qualified) to Band 9 (senior leadership). Benefits include generous pension schemes, annual leave, and access to continued professional development.",
      },
    ],
    faq: [
      { question: "How much does it cost to register with the NMC?", answer: "NMC registration costs approximately £140. Additional costs include the CBT (~£83), OSCE (~£794), and language test fees. Total costs typically range from £1,500–£3,000." },
      { question: "What is the OSCE pass rate for international nurses?", answer: "OSCE pass rates vary but typically range from 40–70% on the first attempt. Many nurses benefit from OSCE preparation courses before taking the exam." },
      { question: "Can my employer pay for my NMC registration?", answer: "Yes, many NHS trusts and private healthcare employers offer sponsorship packages that cover NMC registration, exam fees, flights, and initial accommodation." },
      { question: "Is UK nursing experience recognized in other countries?", answer: "Yes, UK nursing qualifications and experience are widely recognized internationally, making it a valuable stepping stone for global nursing careers." },
    ],
    metaTitle: "How to Become a Nurse in the UK | International Nurse Registration Guide",
    metaDescription: "Complete guide for international nurses seeking NMC registration in the United Kingdom. Learn about CBT, OSCE, language requirements, NHS employment, and visa pathways.",
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    regulatoryBody: "AHPRA (Australian Health Practitioner Regulation Agency) and NMBA (Nursing and Midwifery Board of Australia)",
    requiredExams: ["NCLEX-RN is not required — Australia uses an outcomes-based assessment", "Skills assessment through ANMAC (Australian Nursing and Midwifery Accreditation Council)"],
    languageTests: ["IELTS Academic (minimum 7.0 in each band)", "OET (minimum B in all four sub-tests)", "PTE Academic (minimum 65 in each section)"],
    registrationTimeline: "3–12 months depending on qualification assessment",
    averageSalary: "$70,000–$100,000 AUD per year",
    visaTypes: ["Skilled Independent Visa (Subclass 189)", "Skilled Nominated Visa (Subclass 190)", "Temporary Skill Shortage Visa (Subclass 482)"],
    bridgingPrograms: "Australia offers bridging programs through various universities and healthcare organizations to help IENs meet NMBA standards. These programs typically include clinical placements and orientation to Australian healthcare.",
    workSettings: ["Public hospitals", "Private hospitals", "Aged care facilities", "Community health centres", "Rural and remote healthcare"],
    barriers: ["Strict English language requirements (7.0 in each IELTS band)", "Lengthy skills assessment process", "Cost of visa application and registration", "Understanding Australian healthcare system differences", "Meeting continuing professional development requirements"],
    sections: [
      {
        heading: "Overview of Nursing in Australia",
        content: "Australia has a growing demand for nurses, particularly in rural and regional areas. The healthcare system is a mix of public (Medicare) and private healthcare, with excellent working conditions and competitive salaries.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "Registration in Australia requires a skills assessment through ANMAC and registration with AHPRA/NMBA.",
        bullets: [
          "Step 1: Apply for a skills assessment through ANMAC",
          "Step 2: Provide evidence of English language proficiency",
          "Step 3: Complete any recommended bridging education or supervised practice",
          "Step 4: Apply for registration with AHPRA",
          "Step 5: Receive NMBA registration",
          "Step 6: Apply for an appropriate skilled visa",
        ],
      },
      {
        heading: "Immigration Pathways",
        content: "Nurses are listed on Australia's skilled occupation list, making several visa pathways available. The Skilled Independent Visa (Subclass 189) allows permanent residency without employer sponsorship, while the Subclass 482 visa requires employer sponsorship.",
      },
      {
        heading: "Salary and Working Conditions",
        content: "Australian nurses enjoy competitive salaries, strong union representation, and excellent working conditions. Penalty rates apply for evening, weekend, and public holiday shifts, significantly boosting take-home pay.",
      },
    ],
    faq: [
      { question: "Do I need to take the NCLEX to work in Australia?", answer: "No, Australia does not use the NCLEX. Instead, you undergo a skills assessment through ANMAC and register with AHPRA/NMBA." },
      { question: "What are the English language requirements for nursing in Australia?", answer: "You need a minimum IELTS score of 7.0 in each band (reading, writing, speaking, listening) or equivalent OET/PTE scores. These are among the strictest in the world." },
      { question: "Is nursing a pathway to permanent residency in Australia?", answer: "Yes, nursing is on the Medium and Long-term Strategic Skills List (MLTSSL), making it eligible for permanent residency visas like the Subclass 189 and 190." },
      { question: "What is the demand for nurses in rural Australia?", answer: "Rural and remote areas have very high demand for nurses and often offer financial incentives, relocation assistance, and additional leave benefits to attract healthcare workers." },
    ],
    metaTitle: "How to Become a Nurse in Australia | International Nurse Guide",
    metaDescription: "Complete guide for international nurses seeking AHPRA registration in Australia. Learn about ANMAC assessment, language requirements, visa pathways, salary, and working conditions.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    regulatoryBody: "Nursing Council of New Zealand (NCNZ)",
    requiredExams: ["Competence Assessment Programme (CAP) — if required", "No standardized exam like NCLEX"],
    languageTests: ["IELTS Academic (minimum 7.0 overall, 7.0 in each band)", "OET (minimum B in all four sub-tests)"],
    registrationTimeline: "3–9 months",
    averageSalary: "$55,000–$80,000 NZD per year",
    visaTypes: ["Skilled Migrant Category Resident Visa", "Essential Skills Work Visa", "Green List Straight to Residence"],
    bridgingPrograms: "New Zealand offers the Competence Assessment Programme (CAP) for internationally qualified nurses who need to demonstrate clinical competence. The programme includes supervised clinical practice and assessment.",
    workSettings: ["District Health Board hospitals", "Private hospitals", "Aged care facilities", "Community health centres", "Maori and Pacific health services"],
    barriers: ["Small job market compared to larger countries", "High language test requirements", "Lower salaries compared to Australia and Canada", "Geographic isolation", "CAP programme availability and cost"],
    sections: [
      {
        heading: "Overview of Nursing in New Zealand",
        content: "New Zealand has a publicly funded healthcare system with growing demand for nurses, especially in aged care, mental health, and rural communities. The country offers an excellent quality of life and is known for its supportive work environment.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "Registration with the Nursing Council of New Zealand requires credential verification and may include completion of the Competence Assessment Programme.",
        bullets: [
          "Step 1: Apply to NCNZ for registration",
          "Step 2: Submit credential verification documents",
          "Step 3: Provide evidence of English language proficiency",
          "Step 4: Complete the CAP programme if required",
          "Step 5: Receive Nursing Council registration",
          "Step 6: Apply for an appropriate work or residence visa",
        ],
      },
      {
        heading: "Immigration Pathways",
        content: "Nursing is on New Zealand's Green List, which provides a straight-to-residence pathway for qualified nurses. This makes New Zealand one of the most accessible countries for international nurses seeking permanent residency.",
      },
      {
        heading: "Salary and Working Conditions",
        content: "While salaries are lower than in Australia or Canada, New Zealand offers excellent work-life balance, strong employment protections, and a supportive healthcare culture.",
      },
    ],
    faq: [
      { question: "Is nursing on New Zealand's Green List?", answer: "Yes, registered nurses are on New Zealand's Green List, which provides a direct pathway to residence for qualified applicants who meet the registration requirements." },
      { question: "Do I need to complete the CAP programme?", answer: "Not all applicants need to complete the CAP. The Nursing Council assesses each application individually and determines whether CAP completion is required based on your qualifications and experience." },
      { question: "How does New Zealand nursing compare to Australia?", answer: "New Zealand offers a lower cost of living and faster immigration processing, though salaries are generally lower. The work environment is often described as more relaxed and community-focused." },
      { question: "Can I transfer my NZ nursing license to Australia?", answer: "The Trans-Tasman Mutual Recognition Agreement allows registered nurses in New Zealand to apply for registration in Australia with streamlined processing." },
    ],
    metaTitle: "How to Become a Nurse in New Zealand | International Nurse Guide",
    metaDescription: "Complete guide for international nurses seeking NCNZ registration in New Zealand. Learn about CAP, language requirements, Green List residency pathway, salary, and working conditions.",
  },
  {
    slug: "ireland",
    name: "Ireland",
    flag: "🇮🇪",
    regulatoryBody: "NMBI (Nursing and Midwifery Board of Ireland)",
    requiredExams: ["Aptitude test or Adaptation period", "No standardized NCLEX-style exam"],
    languageTests: ["IELTS Academic (minimum 6.5 overall, minimum 6.5 in each band)", "OET (minimum B in all four sub-tests)"],
    registrationTimeline: "3–12 months",
    averageSalary: "€35,000–€55,000 EUR per year",
    visaTypes: ["Critical Skills Employment Permit", "General Employment Permit", "Stamp 4 (permanent residency after 2 years with Critical Skills)"],
    bridgingPrograms: "NMBI offers an adaptation and assessment process for international nurses that includes clinical assessment and supervision to verify competence in Irish healthcare settings.",
    workSettings: ["HSE (Health Service Executive) hospitals", "Private hospitals", "Nursing homes", "Community care", "Mental health services"],
    barriers: ["Cost of NMBI registration and assessment", "Limited employer sponsorship compared to UK", "Smaller healthcare system and fewer vacancies", "Recognition of non-EU qualifications", "Adaptation period requirements"],
    sections: [
      {
        heading: "Overview of Nursing in Ireland",
        content: "Ireland has an increasing demand for nurses, driven by population growth and an aging demographic. The health service (HSE) is the primary employer, though the private sector is also growing. Ireland offers EU membership benefits and a high quality of life.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "Registration with NMBI involves credential verification and either an aptitude test or adaptation period.",
        bullets: [
          "Step 1: Apply to NMBI for registration",
          "Step 2: Submit your nursing credentials for assessment",
          "Step 3: Provide evidence of English language proficiency",
          "Step 4: Complete aptitude test or adaptation period if required",
          "Step 5: Receive NMBI registration",
          "Step 6: Apply for a Critical Skills or General Employment Permit",
        ],
      },
      {
        heading: "Immigration Pathways",
        content: "Nursing is on Ireland's Critical Skills Occupation List, making it easier to obtain work permits. After two years on a Critical Skills Employment Permit, nurses can apply for permanent residency (Stamp 4).",
      },
      {
        heading: "Salary and Working Conditions",
        content: "Irish nursing salaries are regulated through public service pay scales. Benefits include pension schemes, paid annual leave, professional development funding, and opportunities for career progression within the HSE.",
      },
    ],
    faq: [
      { question: "Is nursing on Ireland's Critical Skills list?", answer: "Yes, nursing is on Ireland's Critical Skills Occupation List, which provides a streamlined employment permit process and a faster pathway to permanent residency." },
      { question: "Can I work in other EU countries with an Irish nursing license?", answer: "EU/EEA mutual recognition directives allow Irish-registered nurses to apply for registration in other EU member states with simplified processing." },
      { question: "What is the adaptation period for international nurses in Ireland?", answer: "The adaptation period typically lasts 6–12 weeks and involves supervised clinical practice in an Irish healthcare setting to demonstrate competence." },
      { question: "Is the cost of living in Ireland affordable for nurses?", answer: "Dublin has a high cost of living, but other cities like Galway, Cork, and Limerick offer more affordable options. HSE salaries include incremental pay increases." },
    ],
    metaTitle: "How to Become a Nurse in Ireland | International Nurse Guide",
    metaDescription: "Complete guide for international nurses seeking NMBI registration in Ireland. Learn about the aptitude test, language requirements, Critical Skills permits, salary, and EU mobility benefits.",
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    regulatoryBody: "DHA (Dubai Health Authority), HAAD/DOH (Department of Health Abu Dhabi), MOH (Ministry of Health)",
    requiredExams: ["DHA/HAAD/MOH licensing exam (depending on emirate)", "Prometric exam"],
    languageTests: ["English proficiency is generally expected but formal IELTS/OET may not always be required", "Some employers require IELTS 6.0+"],
    registrationTimeline: "1–6 months",
    averageSalary: "AED 8,000–18,000 per month (tax-free, approximately $26,000–$59,000 USD)",
    visaTypes: ["Employment visa sponsored by healthcare employer", "Golden Visa for healthcare professionals (long-term)"],
    bridgingPrograms: "The UAE does not have formal bridging programs. Employers typically provide orientation and on-the-job training for international nurses.",
    workSettings: ["Government hospitals", "Private hospitals and clinics", "Free zone healthcare facilities", "Home healthcare services", "Specialized centres"],
    barriers: ["Understanding different licensing authorities across emirates", "Contract-based employment system", "Cultural adaptation", "Heat and climate adjustment", "Varying quality of employer packages"],
    sections: [
      {
        heading: "Overview of Nursing in the UAE",
        content: "The UAE has rapidly expanded its healthcare sector and relies heavily on internationally educated nurses. Dubai and Abu Dhabi are the primary employment hubs, with world-class healthcare facilities and tax-free salaries.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "The licensing process varies by emirate, with DHA (Dubai), DOH (Abu Dhabi), and MOH each having their own requirements.",
        bullets: [
          "Step 1: Determine which emirate you want to work in",
          "Step 2: Apply for eligibility letter from DHA/DOH/MOH",
          "Step 3: Take the Prometric licensing exam for the relevant authority",
          "Step 4: Submit credentials for dataflow verification",
          "Step 5: Obtain your license upon passing the exam",
          "Step 6: Employer sponsors your work visa",
        ],
      },
      {
        heading: "Immigration and Employment",
        content: "Working in the UAE requires employer sponsorship for visa and residency. Healthcare employers typically handle the visa process and may provide housing, flights, and health insurance as part of employment packages.",
      },
      {
        heading: "Salary and Benefits",
        content: "UAE nursing salaries are tax-free, which significantly increases take-home pay. Benefits packages often include furnished housing or housing allowance, annual flights home, health insurance, and end-of-service gratuity.",
      },
    ],
    faq: [
      { question: "Are nursing salaries in the UAE really tax-free?", answer: "Yes, the UAE does not impose personal income tax, making the entire salary tax-free. This significantly increases the effective compensation compared to countries with income tax." },
      { question: "What is the Prometric exam?", answer: "The Prometric exam is a computer-based licensing test required by UAE health authorities. It tests nursing knowledge across clinical domains and is specific to each licensing authority (DHA, DOH, MOH)." },
      { question: "Do I need to wear special clothing as a nurse in the UAE?", answer: "Most healthcare facilities provide standard nursing uniforms. The UAE is cosmopolitan, and international healthcare workers are accustomed to the multicultural environment." },
      { question: "Can I transfer my UAE nursing license to another country?", answer: "UAE nursing experience is recognized by many countries, but you would need to meet the specific licensing requirements of your target country. The experience gained at leading UAE hospitals is highly valued." },
    ],
    metaTitle: "How to Become a Nurse in the UAE | International Nurse Guide",
    metaDescription: "Complete guide for international nurses seeking DHA, DOH, or MOH licensure in the UAE. Learn about Prometric exams, tax-free salaries, visa sponsorship, and employment benefits.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    regulatoryBody: "SCFHS (Saudi Commission for Health Specialties)",
    requiredExams: ["Saudi Nursing Licensure Exam (SNLE)", "Prometric exam", "Dataflow verification"],
    languageTests: ["English proficiency generally required", "Some employers require IELTS 6.0+"],
    registrationTimeline: "2–6 months",
    averageSalary: "SAR 6,000–15,000 per month (tax-free, approximately $19,000–$48,000 USD)",
    visaTypes: ["Work visa sponsored by employer", "Premium residency (for eligible professionals)"],
    bridgingPrograms: "Saudi Arabia does not have formal bridging programs. Employers provide orientation programs focused on cultural competency and local healthcare protocols.",
    workSettings: ["Ministry of Health hospitals", "National Guard hospitals", "Private hospitals", "Specialized medical centres", "University hospitals"],
    barriers: ["Cultural differences and adaptation", "Contract-based system with strict exit/re-entry", "Varying employer packages and conditions", "Understanding SCFHS requirements", "Social restrictions compared to Western countries"],
    sections: [
      {
        heading: "Overview of Nursing in Saudi Arabia",
        content: "Saudi Arabia is one of the largest employers of international nurses in the Middle East. The country's Vision 2030 initiative has dramatically expanded healthcare investment, creating thousands of new nursing positions across the Kingdom.",
      },
      {
        heading: "Licensure Pathway for International Nurses",
        content: "Licensure in Saudi Arabia requires registration with SCFHS and passing the required examinations.",
        bullets: [
          "Step 1: Apply for SCFHS classification of your nursing qualifications",
          "Step 2: Complete Dataflow verification of your credentials",
          "Step 3: Pass the Saudi Nursing Licensure Exam (SNLE) or Prometric exam",
          "Step 4: Obtain SCFHS professional classification",
          "Step 5: Secure employment with a Saudi healthcare employer",
          "Step 6: Employer processes work visa and residency permit (Iqama)",
        ],
      },
      {
        heading: "Immigration and Employment",
        content: "All employment in Saudi Arabia requires employer sponsorship. Healthcare employers typically provide comprehensive packages including housing, transportation, health insurance, and annual flights home.",
      },
      {
        heading: "Salary and Benefits",
        content: "Salaries are tax-free in Saudi Arabia. Benefits packages are usually comprehensive, including furnished housing or housing allowance, transportation, annual flights, health insurance for the employee and dependents, and end-of-contract bonuses.",
      },
    ],
    faq: [
      { question: "What is SCFHS?", answer: "The Saudi Commission for Health Specialties (SCFHS) is the regulatory body that oversees the licensing and classification of all health professionals in Saudi Arabia, including nurses." },
      { question: "Is it safe for international nurses to work in Saudi Arabia?", answer: "Yes, Saudi Arabia has invested significantly in modern infrastructure and international communities. Healthcare workers are valued and the large international community provides a supportive environment." },
      { question: "What is Dataflow verification?", answer: "Dataflow is a primary source verification service used by SCFHS to authenticate the educational credentials, professional licenses, and employment history of healthcare professionals." },
      { question: "Can I bring my family to Saudi Arabia?", answer: "Yes, many employers sponsor family visas. Healthcare packages often include dependent benefits, school allowances, and family health insurance coverage." },
    ],
    metaTitle: "How to Become a Nurse in Saudi Arabia | International Nurse Guide",
    metaDescription: "Complete guide for international nurses seeking SCFHS licensure in Saudi Arabia. Learn about SNLE, Dataflow verification, tax-free salaries, visa sponsorship, and employment benefits.",
  },
];

export const MIGRATION_PATHWAYS: MigrationData[] = [
  {
    slug: "philippines-to-canada",
    sourceCountry: "Philippines",
    destinationCountry: "Canada",
    title: "Philippines to Canada Nursing Migration Guide",
    estimatedTimeline: "12–24 months total",
    steps: [
      { stepNumber: 1, title: "Verify Eligibility", description: "Confirm you hold an active PRC nursing license and BSN degree from the Philippines. Gather transcripts, PRC registration, and employment certificates.", timeline: "1–2 weeks" },
      { stepNumber: 2, title: "Apply to NNAS", description: "Submit your nursing credentials to the National Nursing Assessment Service for evaluation. NNAS will assess your education against Canadian standards.", timeline: "4–8 months" },
      { stepNumber: 3, title: "Language Testing", description: "Take the IELTS Academic or CELBAN test. Aim for IELTS 7.0 in speaking and 6.5 overall minimum. Many Philippine nurses find speaking and writing sections most challenging.", timeline: "2–3 months preparation" },
      { stepNumber: 4, title: "Provincial Application", description: "Apply to the nursing regulatory body in your target province (e.g., CNO for Ontario, BCCNM for BC). They will review your NNAS report and determine any additional requirements.", timeline: "2–6 months" },
      { stepNumber: 5, title: "Bridging Education", description: "Complete any required bridging programs or additional courses. Some provinces may require supervised practice hours.", timeline: "3–12 months if required" },
      { stepNumber: 6, title: "Write NCLEX-RN or REx-PN", description: "Register for and pass the appropriate licensing exam. Prepare thoroughly using exam prep resources.", timeline: "1–3 months preparation" },
      { stepNumber: 7, title: "Immigration Application", description: "Apply for permanent residency through Express Entry, Provincial Nominee Program, or other applicable immigration programs.", timeline: "6–18 months" },
      { stepNumber: 8, title: "Begin Working", description: "Once licensed and in Canada, begin your nursing career. Many Philippine nurses start in long-term care or hospital settings.", timeline: "Ongoing" },
    ],
    documents: [
      "Valid Philippine PRC nursing license",
      "BSN diploma and official transcripts",
      "Transcript of Records (TOR) from nursing school",
      "PRC Board Rating (including board exam scores)",
      "Employment certificates from all nursing positions",
      "Character references from nursing supervisors",
      "Police clearance (NBI clearance)",
      "Passport (valid for at least 6 months)",
      "IELTS or CELBAN score report",
      "Passport-size photos (recent)",
      "Marriage certificate (if name has changed)",
      "Birth certificate (PSA-authenticated)",
    ],
    commonMistakes: [
      "Not starting the NNAS process early enough — it takes 4–8 months",
      "Underestimating IELTS speaking score requirements",
      "Choosing a province without researching demand and processing times",
      "Not keeping PRC license active during the application process",
      "Submitting unofficial or unverified transcripts to NNAS",
      "Ignoring provincial-specific requirements beyond NNAS",
    ],
    sections: [
      {
        heading: "Why Philippine Nurses Choose Canada",
        content: "Canada is the top destination for Filipino nurses due to strong demand, competitive salaries, excellent immigration pathways, and a large Filipino community. The Philippines has bilateral agreements with several Canadian provinces that facilitate nurse recruitment.",
      },
      {
        heading: "Financial Planning",
        content: "Budget approximately $5,000–$10,000 CAD for the entire process, including NNAS fees ($650+), IELTS ($300+), NCLEX ($360 USD), provincial registration fees, and immigration application costs. Many nurses save or borrow to cover these expenses.",
      },
    ],
    faq: [
      { question: "How many Filipino nurses are in Canada?", answer: "The Philippines is the largest source of internationally educated nurses in Canada, with tens of thousands of Filipino nurses working across all provinces and territories." },
      { question: "Do I need to complete a bridging program in Canada?", answer: "It depends on your NNAS assessment and provincial requirements. Some provinces may require bridging education or supervised practice, while others may grant direct registration eligibility." },
      { question: "Can I work as a personal support worker while waiting?", answer: "Yes, many Filipino nurses work as PSWs or healthcare aides while completing the licensing process, gaining Canadian healthcare experience along the way." },
    ],
    metaTitle: "Philippines to Canada Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete step-by-step guide for Filipino nurses moving to Canada. Learn about NNAS, NCLEX-RN, IELTS, immigration pathways, required documents, and common mistakes to avoid.",
  },
  {
    slug: "india-to-canada",
    sourceCountry: "India",
    destinationCountry: "Canada",
    title: "India to Canada Nursing Migration Guide",
    estimatedTimeline: "12–24 months total",
    steps: [
      { stepNumber: 1, title: "Verify Your Credentials", description: "Ensure your Indian Nursing Council (INC) registration is current and gather all educational transcripts, degree certificates, and experience letters.", timeline: "2–4 weeks" },
      { stepNumber: 2, title: "Apply to NNAS", description: "Submit your nursing credentials to the National Nursing Assessment Service for evaluation against Canadian nursing competencies.", timeline: "4–8 months" },
      { stepNumber: 3, title: "Language Proficiency", description: "Take the IELTS Academic or CELBAN test. Indian nurses typically need focused preparation for the speaking and writing components.", timeline: "2–4 months preparation" },
      { stepNumber: 4, title: "Provincial Application", description: "Apply to your chosen province's nursing regulatory body with your NNAS advisory report.", timeline: "2–6 months" },
      { stepNumber: 5, title: "Additional Education", description: "Complete any bridging programs or additional competency requirements as determined by the provincial regulator.", timeline: "3–12 months if required" },
      { stepNumber: 6, title: "Licensing Exam", description: "Register for and pass the NCLEX-RN or REx-PN examination.", timeline: "1–3 months preparation" },
      { stepNumber: 7, title: "Immigration", description: "Apply through Express Entry, Provincial Nominee Program, or employer-sponsored pathways.", timeline: "6–18 months" },
    ],
    documents: [
      "Indian Nursing Council (INC) registration certificate",
      "BSc Nursing or GNM diploma with transcripts",
      "State Nursing Council registration",
      "Experience certificates from all employers",
      "Character certificates and references",
      "Police clearance certificate",
      "Valid passport",
      "IELTS or CELBAN score report",
      "Birth certificate",
      "Marriage certificate (if applicable)",
    ],
    commonMistakes: [
      "Not recognizing differences between INC and provincial Canadian requirements",
      "Underestimating the time NNAS processing takes",
      "Not maintaining current INC registration",
      "Insufficient IELTS preparation, particularly for writing and speaking",
      "Not researching which provinces have the highest demand",
    ],
    sections: [
      {
        heading: "Why Indian Nurses Choose Canada",
        content: "Canada is an attractive destination for Indian nurses due to strong demand, competitive salaries, excellent quality of life, and large Indian communities across the country. Canada's Express Entry system values healthcare credentials highly.",
      },
    ],
    faq: [
      { question: "Is a BSc Nursing from India recognized in Canada?", answer: "Yes, but it must be evaluated through NNAS. The advisory report will indicate whether your education meets Canadian standards or if additional education is required." },
      { question: "Can GNM diploma holders practice in Canada?", answer: "GNM diploma holders may face additional requirements compared to BSc Nursing graduates. The NNAS assessment will determine what additional education may be needed." },
    ],
    metaTitle: "India to Canada Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Indian nurses migrating to Canada. Learn about NNAS, NCLEX-RN, IELTS, Express Entry, required documents, and step-by-step process for Canadian nursing licensure.",
  },
  {
    slug: "nigeria-to-canada",
    sourceCountry: "Nigeria",
    destinationCountry: "Canada",
    title: "Nigeria to Canada Nursing Migration Guide",
    estimatedTimeline: "12–30 months total",
    steps: [
      { stepNumber: 1, title: "Confirm Eligibility", description: "Verify your Nursing and Midwifery Council of Nigeria (NMCN) registration and gather all educational certificates and transcripts.", timeline: "2–4 weeks" },
      { stepNumber: 2, title: "NNAS Application", description: "Submit credentials to NNAS for evaluation. Nigerian nursing qualifications undergo thorough assessment against Canadian standards.", timeline: "6–12 months" },
      { stepNumber: 3, title: "Language Testing", description: "Take IELTS Academic or CELBAN test. Focus on achieving 6.5+ in all bands with 7.0 in speaking.", timeline: "2–4 months preparation" },
      { stepNumber: 4, title: "Provincial Application", description: "Apply to the regulatory body in your target province. Atlantic provinces and Manitoba often have shorter processing times.", timeline: "3–6 months" },
      { stepNumber: 5, title: "Bridging Requirements", description: "Complete any required bridging education, supervised practice, or additional courses.", timeline: "3–12 months if required" },
      { stepNumber: 6, title: "Pass Licensing Exam", description: "Register for and pass NCLEX-RN or REx-PN.", timeline: "1–3 months preparation" },
      { stepNumber: 7, title: "Immigration Application", description: "Apply through Express Entry, PNP, or Atlantic Immigration Program.", timeline: "6–18 months" },
    ],
    documents: [
      "NMCN registration certificate (current)",
      "Nursing degree or diploma certificates",
      "Official transcripts from nursing school",
      "Employment letters from all nursing positions",
      "Professional references",
      "Police clearance from Nigeria",
      "Valid Nigerian passport",
      "IELTS score report",
      "Birth certificate",
    ],
    commonMistakes: [
      "NNAS processing times for Nigerian credentials can be longer — start early",
      "Not having all transcripts properly verified and authenticated",
      "Overlooking the Atlantic Immigration Program as a faster pathway",
      "Not budgeting adequately for the multi-step process",
    ],
    sections: [
      {
        heading: "Why Nigerian Nurses Choose Canada",
        content: "Canada actively recruits Nigerian nurses due to their strong clinical training and English language skills. The Atlantic Immigration Program and various Provincial Nominee Programs provide accessible pathways for Nigerian healthcare workers.",
      },
    ],
    faq: [
      { question: "How long does NNAS take for Nigerian credentials?", answer: "NNAS processing for Nigerian credentials typically takes 6–12 months due to the verification process with Nigerian educational institutions." },
      { question: "Is the Atlantic Immigration Program good for nurses?", answer: "Yes, the Atlantic Immigration Program offers faster processing and specific provisions for healthcare workers, making it an excellent pathway for Nigerian nurses targeting Atlantic provinces." },
    ],
    metaTitle: "Nigeria to Canada Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Nigerian nurses migrating to Canada. Learn about NNAS, NCLEX-RN, IELTS requirements, immigration pathways, documents needed, and timeline expectations.",
  },
  {
    slug: "philippines-to-us",
    sourceCountry: "Philippines",
    destinationCountry: "United States",
    title: "Philippines to United States Nursing Migration Guide",
    estimatedTimeline: "2–5 years (including visa processing)",
    steps: [
      { stepNumber: 1, title: "Credential Evaluation", description: "Apply for CGFNS Certification Program or credential evaluation through an approved agency.", timeline: "3–6 months" },
      { stepNumber: 2, title: "English Proficiency", description: "Take TOEFL iBT, IELTS, or PTE Academic. Philippine nurses often excel due to English-medium nursing education.", timeline: "1–2 months" },
      { stepNumber: 3, title: "VisaScreen Certificate", description: "Obtain a VisaScreen Certificate from CGFNS, which is required for immigration purposes.", timeline: "2–4 months" },
      { stepNumber: 4, title: "NCLEX-RN Preparation and Exam", description: "Apply for ATT from your target state and pass the NCLEX-RN. The exam can be taken in the Philippines at Pearson VUE centres.", timeline: "2–4 months preparation" },
      { stepNumber: 5, title: "Employer Recruitment", description: "Connect with US healthcare employers or recruitment agencies that sponsor international nurses.", timeline: "1–6 months" },
      { stepNumber: 6, title: "Visa Processing", description: "Employer files EB-3 Green Card petition or H-1B visa application. Processing times vary significantly.", timeline: "1–5 years" },
      { stepNumber: 7, title: "Arrive and Begin Work", description: "Complete employer orientation and begin nursing practice in the United States.", timeline: "Ongoing" },
    ],
    documents: [
      "PRC nursing license (current)",
      "BSN diploma and official transcripts",
      "PRC Board Rating certificate",
      "CGFNS Certification or VisaScreen Certificate",
      "NCLEX-RN pass results",
      "TOEFL/IELTS/PTE score report",
      "Employment certificates",
      "Police clearance (NBI)",
      "Valid passport",
      "Birth certificate (PSA)",
      "Medical examination results",
    ],
    commonMistakes: [
      "Not understanding the lengthy visa processing timeline (2–5 years for EB-3)",
      "Signing unfair recruitment contracts with excessive placement fees",
      "Not researching state-specific licensing requirements",
      "Paying excessive fees to recruitment agencies (this may violate US law)",
    ],
    sections: [
      {
        heading: "Why Filipino Nurses Choose the US",
        content: "The United States offers the highest nursing salaries globally, diverse work environments, and a large Filipino community. The Philippines has been the top source of international nurses for the US for decades.",
      },
      {
        heading: "Understanding Recruitment Practices",
        content: "Be cautious of recruitment agencies. Under US law, employers generally cannot charge nurses recruitment fees. Research agencies thoroughly and understand your rights before signing any contracts.",
      },
    ],
    faq: [
      { question: "Can I take the NCLEX-RN in the Philippines?", answer: "Yes, Pearson VUE has testing centers in Manila and Cebu where you can take the NCLEX-RN after receiving your ATT from a US state Board of Nursing." },
      { question: "How long is the EB-3 Green Card wait for Filipino nurses?", answer: "Processing times for Filipino nurses have improved but can still take 2–5 years from petition filing to visa issuance." },
    ],
    metaTitle: "Philippines to USA Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Filipino nurses migrating to the United States. Learn about CGFNS, NCLEX-RN, VisaScreen, EB-3 Green Card, recruitment practices, and required documents.",
  },
  {
    slug: "india-to-us",
    sourceCountry: "India",
    destinationCountry: "United States",
    title: "India to United States Nursing Migration Guide",
    estimatedTimeline: "2–6 years (including visa processing)",
    steps: [
      { stepNumber: 1, title: "Credential Evaluation", description: "Apply for CGFNS Certification or credential evaluation. Indian nursing degrees are evaluated against US standards.", timeline: "3–6 months" },
      { stepNumber: 2, title: "English Proficiency", description: "Take TOEFL iBT, IELTS, or PTE Academic.", timeline: "2–3 months preparation" },
      { stepNumber: 3, title: "VisaScreen Certificate", description: "Obtain VisaScreen Certificate from CGFNS.", timeline: "2–4 months" },
      { stepNumber: 4, title: "NCLEX-RN", description: "Apply for ATT and pass the NCLEX-RN examination.", timeline: "2–4 months preparation" },
      { stepNumber: 5, title: "Find US Employer", description: "Secure employment with a US healthcare employer willing to sponsor your visa.", timeline: "1–6 months" },
      { stepNumber: 6, title: "Immigration Processing", description: "Employer files EB-3 petition. Indian nationals may face longer wait times due to per-country visa caps.", timeline: "3–10+ years" },
    ],
    documents: [
      "Indian Nursing Council registration",
      "BSc Nursing or GNM certificate and transcripts",
      "State Nursing Council registration",
      "CGFNS Certification or VisaScreen Certificate",
      "NCLEX-RN pass results",
      "TOEFL/IELTS score report",
      "Employment certificates",
      "Police clearance",
      "Valid passport",
    ],
    commonMistakes: [
      "Not understanding India-specific visa backlog issues",
      "Underestimating the total processing timeline",
      "Not considering alternative destinations with faster processing",
      "Paying excessive fees to overseas recruitment agencies",
    ],
    sections: [
      {
        heading: "Why Indian Nurses Choose the US",
        content: "The US offers high salaries and diverse career opportunities. However, Indian nationals face unique challenges due to per-country visa caps that create longer wait times for EB-3 Green Cards.",
      },
      {
        heading: "Important Note on Wait Times",
        content: "Indian nationals face significantly longer EB-3 Green Card processing times due to per-country visa caps. Some Indian nurses consider Canada, Australia, or the UK as alternatives or stepping stones.",
      },
    ],
    faq: [
      { question: "Why are wait times longer for Indian nurses?", answer: "The US has per-country visa caps for employment-based Green Cards. Because of high demand from India, wait times can be significantly longer than for other nationalities." },
      { question: "Should I consider other countries instead?", answer: "Many Indian nurses pursue Canada or Australia first due to faster processing, then consider the US later. Both countries have strong nursing demand and pathways to permanent residency." },
    ],
    metaTitle: "India to USA Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Indian nurses migrating to the United States. Learn about CGFNS, NCLEX-RN, EB-3 visa challenges, per-country caps, and alternative pathways.",
  },
  {
    slug: "nigeria-to-uk",
    sourceCountry: "Nigeria",
    destinationCountry: "United Kingdom",
    title: "Nigeria to United Kingdom Nursing Migration Guide",
    estimatedTimeline: "6–18 months",
    steps: [
      { stepNumber: 1, title: "NMC Application", description: "Create an NMC Online account and begin the registration process. Ensure your Nigerian nursing qualification meets NMC standards.", timeline: "2–4 weeks" },
      { stepNumber: 2, title: "English Language Test", description: "Take IELTS Academic (7.0 each band) or OET (B in all sub-tests). This is often the most challenging step.", timeline: "2–6 months preparation" },
      { stepNumber: 3, title: "CBT Exam", description: "Pass the Computer-Based Test covering nursing knowledge and practice.", timeline: "1–2 months preparation" },
      { stepNumber: 4, title: "OSCE Exam", description: "Pass the Objective Structured Clinical Examination. Many employers sponsor OSCE preparation courses.", timeline: "1–3 months preparation" },
      { stepNumber: 5, title: "NMC Registration", description: "Receive your NMC PIN upon passing both exams.", timeline: "2–4 weeks" },
      { stepNumber: 6, title: "UK Employment", description: "Secure employment with an NHS trust or private employer. Many actively recruit Nigerian nurses.", timeline: "1–3 months" },
      { stepNumber: 7, title: "Health and Care Worker Visa", description: "Apply for the Health and Care Worker Visa with employer sponsorship.", timeline: "2–8 weeks" },
    ],
    documents: [
      "NMCN registration certificate",
      "Nursing degree certificate and transcripts",
      "Employment verification letters",
      "Professional references",
      "IELTS or OET score report",
      "Police clearance from Nigeria",
      "Valid passport",
      "TB test results",
      "CBT and OSCE pass certificates",
    ],
    commonMistakes: [
      "Underestimating IELTS/OET score requirements (7.0 each band is very high)",
      "Not preparing adequately for the OSCE clinical stations",
      "Accepting employment offers without verifying employer legitimacy",
      "Not understanding NMC revalidation requirements",
    ],
    sections: [
      {
        heading: "Why Nigerian Nurses Choose the UK",
        content: "The UK actively recruits Nigerian nurses, with many NHS trusts offering comprehensive recruitment packages including OSCE preparation, flights, accommodation, and mentorship. The shared language and Commonwealth connections make the transition smoother.",
      },
    ],
    faq: [
      { question: "Do NHS trusts sponsor Nigerian nurses?", answer: "Yes, many NHS trusts actively recruit Nigerian nurses and offer sponsorship packages that cover NMC registration costs, OSCE preparation, flights, and initial accommodation." },
      { question: "What is the OSCE pass rate for Nigerian nurses?", answer: "OSCE pass rates vary but preparation courses significantly improve success rates. Many Nigerian nurses pass on their first or second attempt with proper preparation." },
    ],
    metaTitle: "Nigeria to UK Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Nigerian nurses migrating to the UK. Learn about NMC registration, CBT, OSCE, IELTS requirements, NHS recruitment, and Health and Care Worker Visa.",
  },
  {
    slug: "india-to-australia",
    sourceCountry: "India",
    destinationCountry: "Australia",
    title: "India to Australia Nursing Migration Guide",
    estimatedTimeline: "6–18 months",
    steps: [
      { stepNumber: 1, title: "ANMAC Skills Assessment", description: "Apply for a skills assessment through ANMAC. Your Indian nursing qualification will be evaluated against Australian standards.", timeline: "3–6 months" },
      { stepNumber: 2, title: "English Proficiency", description: "Achieve IELTS 7.0 in each band, OET B in all sub-tests, or PTE 65 in each section. This is the most demanding requirement.", timeline: "3–6 months preparation" },
      { stepNumber: 3, title: "Additional Requirements", description: "Complete any bridging education or supervised practice as recommended by ANMAC.", timeline: "3–12 months if required" },
      { stepNumber: 4, title: "AHPRA Registration", description: "Apply for registration with AHPRA/NMBA.", timeline: "2–4 months" },
      { stepNumber: 5, title: "Visa Application", description: "Apply for a Skilled Independent (189), Skilled Nominated (190), or employer-sponsored (482) visa.", timeline: "3–12 months" },
    ],
    documents: [
      "INC registration certificate",
      "BSc Nursing degree and transcripts",
      "State Nursing Council registration",
      "ANMAC skills assessment outcome letter",
      "IELTS/OET/PTE score report",
      "Employment certificates",
      "Police clearance (Indian and any other country of residence)",
      "Valid passport",
      "Health examination results",
    ],
    commonMistakes: [
      "Not achieving 7.0 in each IELTS band — this is the biggest barrier",
      "Not understanding the difference between ANMAC assessment and AHPRA registration",
      "Underestimating the cost of the entire process",
      "Not considering regional/rural employment for additional points",
    ],
    sections: [
      {
        heading: "Why Indian Nurses Choose Australia",
        content: "Australia offers competitive salaries, excellent working conditions, pathways to permanent residency, and a large Indian community. The demand for nurses is particularly strong in rural and regional areas.",
      },
    ],
    faq: [
      { question: "Is the IELTS 7.0 each band requirement strict?", answer: "Yes, Australia's English language requirements for nursing are among the strictest in the world. You must achieve 7.0 in each individual band (reading, writing, speaking, listening), not just overall." },
      { question: "Can I get extra immigration points for rural work?", answer: "Yes, working in designated regional areas can provide additional points for skilled migration visas and may offer additional incentives like higher pay and relocation assistance." },
    ],
    metaTitle: "India to Australia Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Indian nurses migrating to Australia. Learn about ANMAC assessment, AHPRA registration, IELTS requirements, visa pathways, and regional nursing opportunities.",
  },
  {
    slug: "philippines-to-nz",
    sourceCountry: "Philippines",
    destinationCountry: "New Zealand",
    title: "Philippines to New Zealand Nursing Migration Guide",
    estimatedTimeline: "6–18 months",
    steps: [
      { stepNumber: 1, title: "NCNZ Application", description: "Apply to the Nursing Council of New Zealand for registration assessment.", timeline: "2–4 weeks" },
      { stepNumber: 2, title: "Credential Verification", description: "Submit your Philippine nursing credentials including PRC license, BSN transcripts, and experience documentation.", timeline: "2–4 months" },
      { stepNumber: 3, title: "Language Testing", description: "Take IELTS Academic (7.0 each band) or OET (B in all sub-tests).", timeline: "2–4 months preparation" },
      { stepNumber: 4, title: "CAP Programme", description: "Complete the Competence Assessment Programme if required by NCNZ.", timeline: "4–8 weeks" },
      { stepNumber: 5, title: "Registration", description: "Receive Nursing Council registration upon meeting all requirements.", timeline: "2–4 weeks" },
      { stepNumber: 6, title: "Green List Visa", description: "Apply for the Green List Straight to Residence visa or Skilled Migrant Category visa.", timeline: "2–6 months" },
    ],
    documents: [
      "PRC nursing license (current)",
      "BSN diploma and transcripts",
      "PRC Board Rating",
      "Employment certificates",
      "Professional references",
      "IELTS or OET score report",
      "Police clearance (NBI)",
      "Valid passport",
      "Medical examination results",
    ],
    commonMistakes: [
      "Not aware that nursing is on the Green List for direct residency",
      "Underestimating IELTS requirements",
      "Not considering the CAP programme timeline in planning",
      "Comparing NZ salaries to Australia without accounting for cost of living differences",
    ],
    sections: [
      {
        heading: "Why Filipino Nurses Choose New Zealand",
        content: "New Zealand offers a straightforward pathway to permanent residency through its Green List, a welcoming multicultural society, and a growing Filipino community. The healthcare system values the clinical skills Filipino nurses bring.",
      },
    ],
    faq: [
      { question: "Is the Green List pathway faster than other countries?", answer: "Yes, the Green List Straight to Residence pathway can provide permanent residency faster than equivalent programs in Canada, Australia, or the US." },
      { question: "How does the CAP programme work?", answer: "The Competence Assessment Programme involves supervised clinical practice in a New Zealand healthcare setting, typically lasting 4–8 weeks, to demonstrate competence in local practice standards." },
    ],
    metaTitle: "Philippines to New Zealand Nursing Guide | Step-by-Step Migration Pathway",
    metaDescription: "Complete guide for Filipino nurses migrating to New Zealand. Learn about NCNZ registration, CAP programme, Green List residency pathway, and required documentation.",
  },
];

export const COMPARISON_PAGES: ComparisonData[] = [
  {
    slug: "compare-canada-vs-united-states",
    countryA: "Canada",
    countryB: "United States",
    title: "Canada vs United States: Where Should International Nurses Go?",
    summary: "A comprehensive comparison of nursing licensure, salaries, immigration pathways, and working conditions in Canada and the United States for internationally educated nurses.",
    points: [
      { aspect: "Regulatory System", valueA: "Provincial regulatory bodies with NNAS coordination", valueB: "State Boards of Nursing with CGFNS" },
      { aspect: "Licensing Exam", valueA: "NCLEX-RN or REx-PN", valueB: "NCLEX-RN" },
      { aspect: "Language Requirements", valueA: "IELTS 6.5+ or CELBAN", valueB: "TOEFL 83+ or IELTS 6.5+" },
      { aspect: "Average Salary", valueA: "$70,000–$95,000 CAD", valueB: "$60,000–$120,000 USD" },
      { aspect: "Immigration Pathway", valueA: "Express Entry, PNP (6–18 months)", valueB: "EB-3 Green Card (2–5+ years)" },
      { aspect: "Time to Registration", valueA: "6–18 months", valueB: "3–12 months (plus visa wait)" },
      { aspect: "Healthcare System", valueA: "Universal public healthcare", valueB: "Mixed public/private" },
      { aspect: "Work-Life Balance", valueA: "Generally better, unionized", valueB: "Varies widely by employer" },
      { aspect: "Path to Citizenship", valueA: "3 years of permanent residence", valueB: "5 years of permanent residence" },
      { aspect: "Cost of Process", valueA: "$3,000–$6,000 CAD", valueB: "$3,000–$8,000 USD (plus agency fees)" },
    ],
    sections: [
      {
        heading: "Which Country Is Better for International Nurses?",
        content: "Both Canada and the United States offer excellent opportunities for international nurses, but they differ significantly in immigration pathways, salary structures, and healthcare systems. Canada generally offers faster immigration processing and a more straightforward pathway to permanent residency, while the US offers higher earning potential, especially in high-demand states.",
      },
      {
        heading: "Immigration Comparison",
        content: "Canada's Express Entry system provides a relatively fast pathway to permanent residency (often within 6–12 months of receiving an invitation), while the US EB-3 Green Card process can take 2–5+ years, with even longer waits for some nationalities. However, the US offers the TN visa for Canadian citizens, creating a potential two-step pathway.",
      },
      {
        heading: "Salary and Cost of Living",
        content: "US nursing salaries are generally higher, particularly in states like California and New York. However, when factoring in healthcare costs, taxation, and cost of living, the effective compensation gap narrows. Canadian nurses benefit from universal healthcare coverage and generally lower out-of-pocket medical costs.",
      },
    ],
    faq: [
      { question: "Should I go to Canada or the US as an international nurse?", answer: "It depends on your priorities. Canada offers faster immigration processing and universal healthcare, while the US offers higher salaries and more diverse work environments. Many nurses start in Canada and later move to the US if desired." },
      { question: "Can I use my Canadian nursing license in the US?", answer: "No, you need separate licensing in each country. However, NCLEX-RN is used in both countries, so if you pass it in Canada, you may have an easier time obtaining US licensure." },
      { question: "Which country has better work-life balance for nurses?", answer: "Canada generally offers better work-life balance with stronger union protections, more consistent staffing ratios, and better benefits. US conditions vary significantly by state and employer." },
    ],
    metaTitle: "Canada vs United States for International Nurses | Side-by-Side Comparison",
    metaDescription: "Detailed comparison of Canada and the United States for internationally educated nurses. Compare licensing, salaries, immigration pathways, timelines, and quality of life.",
  },
  {
    slug: "compare-canada-vs-united-kingdom",
    countryA: "Canada",
    countryB: "United Kingdom",
    title: "Canada vs United Kingdom: Where Should International Nurses Go?",
    summary: "A comprehensive comparison of nursing licensure, salaries, immigration, and working conditions in Canada and the UK for internationally educated nurses.",
    points: [
      { aspect: "Regulatory Body", valueA: "Provincial bodies + NNAS", valueB: "NMC (centralized)" },
      { aspect: "Licensing Exams", valueA: "NCLEX-RN or REx-PN", valueB: "CBT + OSCE" },
      { aspect: "Language Requirements", valueA: "IELTS 6.5+ or CELBAN", valueB: "IELTS 7.0 each band or OET B" },
      { aspect: "Average Salary", valueA: "$70,000–$95,000 CAD", valueB: "£28,000–£45,000 GBP" },
      { aspect: "Immigration Speed", valueA: "6–18 months to PR", valueB: "Faster visa, 5 years to ILR" },
      { aspect: "Healthcare System", valueA: "Provincial public systems", valueB: "NHS (centralized)" },
      { aspect: "Employer Support", valueA: "Varies by employer", valueB: "NHS often covers costs" },
      { aspect: "Cost of Process", valueA: "$3,000–$6,000 CAD", valueB: "£1,500–£3,000 GBP" },
      { aspect: "Work Settings", valueA: "Diverse public/private mix", valueB: "Primarily NHS" },
      { aspect: "Career Progression", valueA: "Advanced practice roles available", valueB: "NHS banding system" },
    ],
    sections: [
      {
        heading: "Key Differences",
        content: "Canada uses the NCLEX exam system with provincial regulation, while the UK has a centralized NMC with CBT and OSCE exams. The UK generally offers faster initial registration but lower salaries. Canada offers higher earning potential and faster permanent residency.",
      },
      {
        heading: "Which Is Right for You?",
        content: "Choose the UK if you want faster initial placement, employer-sponsored costs, and don't mind lower starting salaries. Choose Canada if you prioritize higher earnings, faster permanent residency, and want to potentially transition to the US later.",
      },
    ],
    faq: [
      { question: "Which country pays international nurses more?", answer: "Canada generally offers higher salaries when converted to the same currency, and the cost of living in many Canadian cities is comparable to or lower than London and major UK cities." },
      { question: "Which is easier to get into — Canada or the UK?", answer: "The UK often has a faster initial placement process, with many NHS trusts actively recruiting and sponsoring international nurses. Canada's process may take longer but offers faster permanent residency." },
    ],
    metaTitle: "Canada vs UK for International Nurses | Side-by-Side Comparison",
    metaDescription: "Detailed comparison of Canada and the United Kingdom for internationally educated nurses. Compare NMC vs NCLEX, salaries, immigration speed, and employer support.",
  },
  {
    slug: "compare-australia-vs-new-zealand",
    countryA: "Australia",
    countryB: "New Zealand",
    title: "Australia vs New Zealand: Where Should International Nurses Go?",
    summary: "A comprehensive comparison of nursing registration, salaries, immigration, and lifestyle in Australia and New Zealand for internationally educated nurses.",
    points: [
      { aspect: "Regulatory Body", valueA: "AHPRA / NMBA", valueB: "NCNZ" },
      { aspect: "Assessment Process", valueA: "ANMAC skills assessment", valueB: "NCNZ registration + CAP" },
      { aspect: "Language Requirements", valueA: "IELTS 7.0 each band", valueB: "IELTS 7.0 each band" },
      { aspect: "Average Salary", valueA: "$70,000–$100,000 AUD", valueB: "$55,000–$80,000 NZD" },
      { aspect: "PR Pathway", valueA: "189/190 skilled visa", valueB: "Green List (direct to residence)" },
      { aspect: "Immigration Speed", valueA: "6–18 months", valueB: "3–9 months (Green List)" },
      { aspect: "Cost of Living", valueA: "Higher (especially Sydney/Melbourne)", valueB: "Lower overall" },
      { aspect: "Demand Level", valueA: "Very high, esp. rural", valueB: "High, growing demand" },
      { aspect: "Trans-Tasman Mobility", valueA: "Can work in NZ easily", valueB: "Can work in Australia easily" },
      { aspect: "Lifestyle", valueA: "Diverse cities, beaches, outback", valueB: "Natural beauty, outdoor lifestyle" },
    ],
    sections: [
      {
        heading: "Comparing the Two Countries",
        content: "Australia and New Zealand are geographically close and have mutual recognition agreements for nursing qualifications. Australia offers higher salaries and more diverse employment options, while New Zealand offers a faster and simpler immigration pathway and lower cost of living.",
      },
      {
        heading: "Trans-Tasman Advantages",
        content: "The Trans-Tasman Mutual Recognition Agreement allows nurses registered in one country to apply for registration in the other with streamlined processing. This means choosing one country doesn't prevent you from eventually working in the other.",
      },
    ],
    faq: [
      { question: "Can I work in both Australia and New Zealand?", answer: "Yes, the Trans-Tasman Mutual Recognition Agreement allows registered nurses to apply for registration in the other country with simplified processing." },
      { question: "Which country is cheaper to live in?", answer: "New Zealand generally has a lower cost of living than Australia, particularly compared to Sydney and Melbourne. However, Auckland can be comparable to some Australian cities." },
    ],
    metaTitle: "Australia vs New Zealand for International Nurses | Side-by-Side Comparison",
    metaDescription: "Detailed comparison of Australia and New Zealand for internationally educated nurses. Compare AHPRA vs NCNZ, salaries, Green List vs skilled visas, and Trans-Tasman mobility.",
  },
];

export const CLUSTER_PAGES: ClusterPageData[] = [
  {
    slug: "english-requirements",
    title: "English Language Requirements for International Nurses",
    metaTitle: "English Language Requirements for International Nurses | Complete Guide",
    metaDescription: "Understand English language proficiency requirements for international nurses in Canada, the US, UK, Australia, and New Zealand. IELTS, OET, TOEFL, CELBAN, and PTE requirements explained.",
    sections: [
      { heading: "Why English Proficiency Matters", content: "English language proficiency is essential for safe nursing practice in English-speaking countries. Regulatory bodies require evidence of proficiency to ensure nurses can communicate effectively with patients, families, colleagues, and other healthcare professionals." },
      { heading: "IELTS Academic", content: "The International English Language Testing System (IELTS) Academic is the most widely accepted English proficiency test for nursing registration worldwide.", bullets: ["Canada: Minimum 6.5 overall, 7.0 speaking (varies by province)", "UK: Minimum 7.0 in each band", "Australia: Minimum 7.0 in each band", "New Zealand: Minimum 7.0 in each band", "Ireland: Minimum 6.5 in each band"] },
      { heading: "OET (Occupational English Test)", content: "The OET is specifically designed for healthcare professionals and tests English in healthcare contexts. It is increasingly accepted as an alternative to IELTS.", bullets: ["Accepted in UK, Australia, New Zealand, Ireland, and some Canadian provinces", "Minimum grade: B in all four sub-tests (Listening, Reading, Writing, Speaking)", "Healthcare-specific content makes it preferred by many nurses"] },
      { heading: "TOEFL iBT", content: "The Test of English as a Foreign Language (TOEFL iBT) is primarily accepted in the United States and some Canadian provinces.", bullets: ["US: Minimum 83 overall (varies by state)", "Some Canadian provinces accept TOEFL as an alternative to IELTS"] },
      { heading: "CELBAN", content: "The Canadian English Language Benchmark Assessment for Nurses is accepted only in Canada and is specifically designed for nurses.", bullets: ["Accepted across all Canadian provinces", "Tests nursing-specific English competence", "Results mapped to Canadian Language Benchmarks (CLB)"] },
      { heading: "PTE Academic", content: "Pearson Test of English Academic is accepted in Australia and some other countries.", bullets: ["Australia: Minimum 65 in each section", "Growing acceptance in other countries"] },
      { heading: "Tips for Success", content: "Preparing for English proficiency tests requires dedicated effort. Here are proven strategies for success.", bullets: ["Start preparation at least 3–6 months before your target test date", "Take a diagnostic test early to identify your weak areas", "Practice with healthcare-specific materials when possible", "Consider OET if you find general IELTS challenging — healthcare context helps", "Record yourself speaking and review for pronunciation and fluency", "Read nursing journals and articles in English daily"] },
    ],
    faq: [
      { question: "Which English test is easiest for nurses?", answer: "Many nurses find the OET easier than IELTS because it uses healthcare-specific content that feels more familiar. However, the best test depends on your individual strengths." },
      { question: "Can I combine scores from multiple test attempts?", answer: "Some countries allow combining scores from multiple attempts (e.g., UK NMC allows combining two sittings within 6 months for IELTS). Check the specific requirements of your target country." },
      { question: "Are there exemptions from English testing?", answer: "Nurses educated in some English-speaking countries may be exempt. For example, nurses from countries like the US, UK, Canada, Australia, NZ, and Ireland are often exempt when applying to other English-speaking countries." },
    ],
    relatedLinks: [
      { title: "IELTS vs OET: Which Is Better for Nurses?", href: "/international-nurses/ielts-vs-oet" },
      { title: "IELTS for Nurses", href: "/ielts-for-nurses" },
      { title: "OET for Nurses", href: "/oet-for-nurses" },
    ],
  },
  {
    slug: "ielts-vs-oet",
    title: "IELTS vs OET for International Nurses: Which Should You Choose?",
    metaTitle: "IELTS vs OET for Nurses | Detailed Comparison & Which to Choose",
    metaDescription: "Compare IELTS Academic and OET for nursing registration. Understand scoring, format, content differences, acceptance by country, and which test is best for your situation.",
    sections: [
      { heading: "Overview", content: "Both IELTS Academic and OET are widely accepted for nursing registration in English-speaking countries. Understanding the differences between them can help you choose the right test and maximize your chances of achieving the required scores." },
      { heading: "Test Format Comparison", content: "IELTS tests general English across four skills (Listening, Reading, Writing, Speaking), while OET tests English in a healthcare context.", bullets: ["IELTS: General academic topics in reading and writing", "OET: Healthcare-specific scenarios in all sections", "IELTS Speaking: 11–14 minutes face-to-face interview", "OET Speaking: Role-play with a patient/carer scenario", "IELTS Writing: Two tasks — graph description and essay", "OET Writing: Write a referral or discharge letter"] },
      { heading: "Scoring Differences", content: "IELTS uses band scores (1.0–9.0) while OET uses letter grades (A–E).", bullets: ["IELTS 7.0 band ≈ OET B grade", "OET B is considered equivalent to IELTS 7.0 for most regulatory bodies", "Some nurses find it easier to achieve OET B than IELTS 7.0"] },
      { heading: "Acceptance by Country", content: "Check which tests your target country accepts before choosing.", bullets: ["Canada: IELTS and CELBAN (OET accepted in some provinces)", "United States: TOEFL, IELTS (OET not widely accepted)", "United Kingdom: IELTS and OET", "Australia: IELTS, OET, and PTE Academic", "New Zealand: IELTS and OET", "Ireland: IELTS and OET"] },
      { heading: "Which Should You Choose?", content: "Consider OET if you work in healthcare and feel more comfortable with clinical English. Choose IELTS if you need general English skills or if your target country doesn't accept OET. If you're targeting multiple countries, IELTS is more universally accepted." },
    ],
    faq: [
      { question: "Is OET easier than IELTS for nurses?", answer: "Many nurses report finding OET easier because the content is healthcare-specific and familiar. However, individual results vary based on your English strengths and preparation." },
      { question: "Can I take both tests?", answer: "Yes, some nurses take both and submit the higher score. This strategy works best when you have time and budget for multiple test attempts." },
      { question: "How long are test scores valid?", answer: "Both IELTS and OET scores are typically valid for 2 years from the test date. Check your regulatory body's specific requirements." },
    ],
    relatedLinks: [
      { title: "English Requirements for International Nurses", href: "/international-nurses/english-requirements" },
      { title: "IELTS for Nurses", href: "/ielts-for-nurses" },
      { title: "OET for Nurses", href: "/oet-for-nurses" },
    ],
  },
  {
    slug: "bridging-programs",
    title: "Bridging Programs for Internationally Educated Nurses",
    metaTitle: "Nursing Bridging Programs for International Nurses | Guide by Country",
    metaDescription: "Comprehensive guide to bridging programs for internationally educated nurses in Canada, the US, UK, Australia, and New Zealand. Learn about program types, duration, costs, and requirements.",
    sections: [
      { heading: "What Are Bridging Programs?", content: "Bridging programs are educational programs designed to help internationally educated nurses (IENs) meet the registration requirements of their destination country. They bridge the gap between international nursing education and local practice standards." },
      { heading: "Canada", content: "Canadian bridging programs are among the most developed globally. They typically include classroom learning, clinical placements, language support, and NCLEX preparation.", bullets: ["Ontario: Multiple universities offer IEN bridging (e.g., Humber College, George Brown)", "British Columbia: BCIT IEN bridging program", "Alberta: Mount Royal University bridging program", "Manitoba: Red River College bridging program", "Duration: 3–12 months depending on assessment outcomes", "Cost: $5,000–$15,000 CAD"] },
      { heading: "Australia", content: "Australian bridging programs focus on meeting ANMAC and NMBA requirements for registration.", bullets: ["Offered by various universities across Australia", "Include clinical placements in Australian healthcare settings", "Duration: 3–12 months", "May qualify for student visa if enrolled full-time"] },
      { heading: "United Kingdom", content: "The UK's OSCE preparation and supervised practice serve as bridging mechanisms for international nurses.", bullets: ["Many NHS trusts offer OSCE preparation courses", "Supervised practice periods for nurses with gaps in practice", "Employer-funded programs are common"] },
      { heading: "How to Choose a Bridging Program", content: "When selecting a bridging program, consider these factors.", bullets: ["Accreditation and recognition by the nursing regulatory body", "Clinical placement opportunities included", "NCLEX or equivalent exam preparation included", "Language support services", "Cost and financial assistance availability", "Program duration and flexibility", "Graduate employment rates"] },
    ],
    faq: [
      { question: "Are bridging programs mandatory?", answer: "Not always. Whether you need a bridging program depends on your credential assessment outcome. Some internationally educated nurses may qualify for direct registration without additional education." },
      { question: "Can I work while completing a bridging program?", answer: "This depends on the program and country. In Canada, some programs are part-time and allow you to work in healthcare support roles. In Australia, full-time programs may qualify for a student visa with work rights." },
      { question: "How much do bridging programs cost?", answer: "Costs vary widely by country and program. In Canada, expect $5,000–$15,000 CAD. Some employers or government programs offer financial assistance." },
    ],
    relatedLinks: [
      { title: "Credential Evaluation for International Nurses", href: "/international-nurses/credential-evaluation" },
      { title: "Nursing in Canada", href: "/international-nurses/canada" },
      { title: "Nursing in Australia", href: "/international-nurses/australia" },
    ],
  },
  {
    slug: "credential-evaluation",
    title: "Credential Evaluation for International Nurses",
    metaTitle: "Nursing Credential Evaluation Guide | NNAS, CGFNS, ANMAC, NMC",
    metaDescription: "Complete guide to credential evaluation for internationally educated nurses. Learn about NNAS, CGFNS, ANMAC, NMC processes, required documents, timelines, and costs.",
    sections: [
      { heading: "What Is Credential Evaluation?", content: "Credential evaluation is the process of assessing your nursing education, training, and experience against the standards of your destination country. It determines whether your qualifications meet the requirements for nursing registration." },
      { heading: "Canada: NNAS", content: "The National Nursing Assessment Service (NNAS) provides advisory reports to provincial regulatory bodies in Canada.", bullets: ["Cost: $650 CAD for initial assessment", "Timeline: 4–8 months", "Documents required: Nursing education transcripts, license verification, language test scores, identification documents", "The advisory report is sent to your chosen provincial regulatory body"] },
      { heading: "United States: CGFNS", content: "The Commission on Graduates of Foreign Nursing Schools provides credential evaluation and VisaScreen certification.", bullets: ["CGFNS Certification Program: $445 USD", "VisaScreen Certificate: $540 USD", "Timeline: 2–6 months", "Required for immigration purposes"] },
      { heading: "Australia: ANMAC", content: "The Australian Nursing and Midwifery Accreditation Council conducts skills assessments for international nurses.", bullets: ["Cost: $500–$800 AUD", "Timeline: 3–6 months", "Determines whether bridging education is needed"] },
      { heading: "United Kingdom: NMC", content: "The Nursing and Midwifery Council assesses international nursing qualifications directly as part of the registration process.", bullets: ["Cost: Part of the NMC registration fee", "Timeline: 2–4 months for initial assessment", "May result in requirement for additional assessments"] },
      { heading: "Tips for Smooth Credential Evaluation", content: "Follow these tips to avoid delays in the credential evaluation process.", bullets: ["Start gathering documents as early as possible", "Use certified translations for non-English documents", "Ensure all transcripts are official and sealed", "Keep copies of everything you submit", "Follow up regularly on the status of your application", "Contact your nursing school early to request documents"] },
    ],
    faq: [
      { question: "How long does credential evaluation take?", answer: "Processing times vary: NNAS (Canada) takes 4–8 months, CGFNS (US) takes 2–6 months, ANMAC (Australia) takes 3–6 months. Starting early is essential." },
      { question: "What if my credentials are found to be insufficient?", answer: "You may be required to complete additional education through bridging programs, take additional courses, or obtain supervised practice experience before being eligible for registration." },
      { question: "Can I apply to multiple countries simultaneously?", answer: "Yes, you can apply for credential evaluation in multiple countries at the same time, though this will increase costs. Each country has its own evaluation process." },
    ],
    relatedLinks: [
      { title: "Bridging Programs for International Nurses", href: "/international-nurses/bridging-programs" },
      { title: "Required Documents for International Nurses", href: "/international-nurses/required-documents" },
      { title: "Nursing Credential Assessment Explained", href: "/nursing-credential-assessment-explained" },
    ],
  },
  {
    slug: "required-documents",
    title: "Required Documents for International Nurse Migration",
    metaTitle: "Documents Needed for International Nurse Migration | Comprehensive Checklist",
    metaDescription: "Complete checklist of documents required for international nurse migration. Learn what you need for credential evaluation, licensing, immigration, and employment in your destination country.",
    sections: [
      { heading: "Overview", content: "Gathering the right documents is one of the most important — and often most time-consuming — steps in the international nursing migration process. Having all required documents ready can significantly speed up your application." },
      { heading: "Education Documents", content: "These documents verify your nursing education.", bullets: ["Official nursing degree or diploma certificate", "Complete official transcripts with course descriptions and grades", "Course syllabi or curriculum outlines (may be required)", "Clinical placement hours documentation", "Proof of program accreditation"] },
      { heading: "Professional Documents", content: "These documents verify your nursing registration and experience.", bullets: ["Current nursing license or registration certificate", "License verification letter from your regulatory body", "Employment verification letters from all nursing employers", "Professional references from nursing supervisors", "Continuing education certificates"] },
      { heading: "Identity and Legal Documents", content: "These documents verify your identity and legal status.", bullets: ["Valid passport (at least 6 months validity)", "Birth certificate", "Marriage certificate (if name has changed)", "Police clearance from all countries of residence", "Passport-size photographs (recent)"] },
      { heading: "Language and Test Results", content: "These documents prove your English proficiency and exam results.", bullets: ["IELTS, OET, TOEFL, or CELBAN score reports", "Licensing exam results (NCLEX, CBT, OSCE, etc.)", "Credential evaluation reports (NNAS, CGFNS, ANMAC)"] },
      { heading: "Immigration Documents", content: "Additional documents required for immigration applications.", bullets: ["Job offer letter from employer (if applicable)", "Employer sponsorship documents", "Proof of funds", "Medical examination results", "Health insurance documentation"] },
    ],
    faq: [
      { question: "Do I need certified translations?", answer: "Yes, all documents not in English must be translated by a certified translator. Some countries have specific requirements for translation certification." },
      { question: "How should I authenticate my documents?", answer: "Many countries require documents to be notarized, apostilled, or verified through official channels. Check your destination country's specific requirements." },
      { question: "What if I can't obtain a document from my home country?", answer: "Contact the credential evaluation agency in your destination country for guidance. Alternative documentation or statutory declarations may be accepted in some cases." },
    ],
    relatedLinks: [
      { title: "Credential Evaluation for International Nurses", href: "/international-nurses/credential-evaluation" },
      { title: "Common Delays in International Nurse Registration", href: "/international-nurses/common-delays" },
    ],
  },
  {
    slug: "common-delays",
    title: "Common Delays in International Nurse Registration",
    metaTitle: "Common Delays in International Nurse Registration | How to Avoid Them",
    metaDescription: "Learn about the most common delays international nurses face during registration and immigration, and strategies to avoid them. Save months in your nursing migration timeline.",
    sections: [
      { heading: "Overview", content: "International nursing registration can take months to years, and many delays are avoidable with proper planning. Understanding common delay points can help you plan your timeline more accurately and take steps to minimize wait times." },
      { heading: "Document-Related Delays", content: "Document issues are the most common cause of delays in the registration process.", bullets: ["Missing or incomplete transcripts from nursing schools", "Delays in obtaining police clearance from home country", "Documents not properly translated or authenticated", "Expired test scores that need to be retaken", "Name discrepancies across documents"] },
      { heading: "Language Test Delays", content: "English language testing can cause significant delays for many international nurses.", bullets: ["Not achieving the required score on the first attempt", "Limited test dates and venue availability", "Waiting for score reports to be sent to regulatory bodies", "Score expiration requiring retesting"] },
      { heading: "Credential Evaluation Delays", content: "The credential evaluation process itself can be lengthy.", bullets: ["NNAS processing backlogs (especially during high-volume periods)", "Difficulty verifying credentials from some countries", "Incomplete applications requiring additional documentation", "Multiple rounds of assessment and review"] },
      { heading: "Immigration Processing Delays", content: "Immigration applications add another layer of potential delays.", bullets: ["Visa processing backlogs", "Medical examination requirements and scheduling", "Per-country visa caps (especially affecting Indian nationals in the US)", "Changes in immigration policy or quotas"] },
      { heading: "How to Minimize Delays", content: "Follow these strategies to keep your application on track.", bullets: ["Start the process 18–24 months before your target arrival date", "Gather all documents before submitting any applications", "Take language tests early and retake if necessary", "Submit complete applications — incomplete ones cause delays", "Follow up regularly with all agencies", "Have backup plans for each step", "Join online communities for tips from nurses who have completed the process"] },
    ],
    faq: [
      { question: "What is the biggest delay in the process?", answer: "Document verification and credential evaluation are typically the longest steps. NNAS (Canada) can take 4–8 months, and immigration processing adds additional time." },
      { question: "Can I speed up the process?", answer: "You can minimize delays by having all documents ready, submitting complete applications, and following up regularly. Some provinces and countries offer expedited processing for healthcare workers." },
    ],
    relatedLinks: [
      { title: "Required Documents for International Nurses", href: "/international-nurses/required-documents" },
      { title: "Registration Timelines by Country", href: "/international-nurses/registration-timelines" },
    ],
  },
  {
    slug: "registration-timelines",
    title: "Nursing Registration Timelines by Country",
    metaTitle: "International Nurse Registration Timelines | Country-by-Country Guide",
    metaDescription: "Detailed registration timelines for international nurses in Canada, the US, UK, Australia, New Zealand, Ireland, UAE, and Saudi Arabia. Plan your nursing migration timeline accurately.",
    sections: [
      { heading: "Overview", content: "Understanding how long the nursing registration process takes in each country is crucial for planning your migration. Here are detailed timelines for each major destination country." },
      { heading: "Canada (6–18 months)", content: "NNAS Assessment: 4–8 months. Provincial application: 2–6 months. Bridging program (if required): 3–12 months. NCLEX-RN registration and exam: 1–3 months. Immigration: 6–18 months (Express Entry) or varies (PNP)." },
      { heading: "United States (3–12 months + visa wait)", content: "CGFNS evaluation: 2–6 months. NCLEX-RN authorization and exam: 1–3 months. State licensing: 1–3 months. Immigration: 2–5+ years (EB-3 Green Card)." },
      { heading: "United Kingdom (3–9 months)", content: "NMC application: 2–4 months. CBT exam: 1–2 months. OSCE exam: 1–3 months. Visa processing: 2–8 weeks. Total from application to working: 3–9 months." },
      { heading: "Australia (3–12 months)", content: "ANMAC skills assessment: 3–6 months. AHPRA registration: 2–4 months. Visa processing: 3–12 months. Bridging program (if required): 3–12 months additional." },
      { heading: "New Zealand (3–9 months)", content: "NCNZ application and assessment: 2–4 months. CAP programme (if required): 4–8 weeks. Green List visa: 2–6 months." },
      { heading: "UAE (1–6 months)", content: "DHA/DOH/MOH application: 1–2 months. Prometric exam: 1–2 months. Dataflow verification: 2–4 weeks. Visa processing: 2–4 weeks." },
      { heading: "Saudi Arabia (2–6 months)", content: "SCFHS classification: 1–3 months. Dataflow verification: 2–4 weeks. SNLE exam: 1–2 months. Employer and visa processing: 1–3 months." },
    ],
    faq: [
      { question: "Which country has the fastest registration process?", answer: "The UAE and Saudi Arabia typically have the fastest processes (1–6 months), followed by the UK (3–9 months). New Zealand's Green List also offers a relatively fast pathway." },
      { question: "Can I work while waiting for registration?", answer: "This varies by country. In some countries, you may be able to work in healthcare support roles. Some jurisdictions offer interim or temporary permits." },
    ],
    relatedLinks: [
      { title: "Common Delays in Registration", href: "/international-nurses/common-delays" },
      { title: "Best Countries for International Nurses", href: "/international-nurses/best-countries" },
    ],
  },
  {
    slug: "best-countries",
    title: "Best Countries for International Nurses in 2025",
    metaTitle: "Best Countries for International Nurses (2025) | Rankings & Guide",
    metaDescription: "Discover the best countries for internationally educated nurses in 2025. Compare salary, immigration ease, quality of life, demand, and career growth across top destinations.",
    sections: [
      { heading: "How We Ranked Countries", content: "We evaluated countries based on nursing demand, salary potential, immigration accessibility, quality of life, career progression opportunities, and support for international nurses." },
      { heading: "1. Canada", content: "Canada ranks #1 for international nurses due to its combination of high salaries, strong demand, excellent immigration pathways (Express Entry, PNP), universal healthcare, and welcoming multicultural society. Multiple provinces actively recruit internationally educated nurses.", bullets: ["Salary: $70,000–$95,000 CAD", "Immigration: Express Entry (6–12 months to PR)", "Demand: Very high across all provinces"] },
      { heading: "2. Australia", content: "Australia offers competitive salaries, excellent working conditions, and pathways to permanent residency. High demand in rural areas provides additional opportunities and immigration points.", bullets: ["Salary: $70,000–$100,000 AUD", "Immigration: Skilled visa pathways to PR", "Demand: Very high, especially rural/regional"] },
      { heading: "3. United Kingdom", content: "The UK's NHS actively recruits international nurses with employer-sponsored packages that often cover costs. Fast visa processing through the Health and Care Worker Visa.", bullets: ["Salary: £28,000–£45,000 GBP", "Immigration: Health and Care Worker Visa", "Demand: Very high across NHS trusts"] },
      { heading: "4. New Zealand", content: "New Zealand's Green List provides direct residency for nurses. Smaller market but excellent quality of life and supportive work environment.", bullets: ["Salary: $55,000–$80,000 NZD", "Immigration: Green List direct to residence", "Demand: High and growing"] },
      { heading: "5. United States", content: "The US offers the highest nursing salaries globally but has longer immigration processing times. Best for nurses who can navigate the visa system.", bullets: ["Salary: $60,000–$120,000 USD", "Immigration: EB-3 Green Card (2–5+ years)", "Demand: Very high nationwide"] },
      { heading: "6. UAE & Saudi Arabia", content: "Middle Eastern countries offer tax-free salaries and comprehensive benefits packages. Best for nurses seeking to save money quickly.", bullets: ["Salary: Tax-free ($25,000–$60,000 USD equivalent)", "Immigration: Employer-sponsored visas", "Demand: High and growing"] },
      { heading: "7. Ireland", content: "Ireland offers EU mobility, Critical Skills visa pathway, and access to the broader European healthcare market.", bullets: ["Salary: €35,000–€55,000 EUR", "Immigration: Critical Skills Employment Permit", "Demand: Growing steadily"] },
    ],
    faq: [
      { question: "Which country pays nurses the most?", answer: "The United States pays the highest absolute salaries, particularly in states like California and Hawaii. However, when adjusted for cost of living and tax, the UAE and Saudi Arabia offer strong effective compensation due to tax-free salaries." },
      { question: "Which country is easiest to migrate to as a nurse?", answer: "New Zealand (Green List) and the UAE/Saudi Arabia generally have the fastest and most straightforward processes. The UK's Health and Care Worker Visa is also relatively streamlined." },
    ],
    relatedLinks: [
      { title: "Highest Paying Countries for International Nurses", href: "/international-nurses/highest-paying-countries" },
      { title: "Visa Sponsorship Nursing Jobs", href: "/international-nurses/visa-sponsorship-jobs" },
    ],
  },
  {
    slug: "highest-paying-countries",
    title: "Highest Paying Countries for International Nurses",
    metaTitle: "Highest Paying Countries for Nurses (2025) | Salary Comparison Guide",
    metaDescription: "Compare nursing salaries across the world's highest-paying countries. Detailed salary data for the US, Canada, Australia, UAE, Saudi Arabia, UK, and more with cost-of-living adjustments.",
    sections: [
      { heading: "Overview", content: "Nursing salaries vary dramatically across countries, and the highest salary doesn't always mean the most money in your pocket. We compare both gross salaries and effective take-home pay after considering taxes, benefits, and cost of living." },
      { heading: "Salary Rankings (Gross)", content: "Here are average nursing salaries by country, ranked from highest to lowest gross pay.", bullets: ["United States: $60,000–$120,000 USD", "Australia: $70,000–$100,000 AUD ($47,000–$67,000 USD)", "Canada: $70,000–$95,000 CAD ($52,000–$71,000 USD)", "UAE: $26,000–$59,000 USD (tax-free)", "Saudi Arabia: $19,000–$48,000 USD (tax-free)", "New Zealand: $55,000–$80,000 NZD ($33,000–$48,000 USD)", "United Kingdom: £28,000–£45,000 GBP ($35,000–$57,000 USD)", "Ireland: €35,000–€55,000 EUR ($38,000–$60,000 USD)"] },
      { heading: "Adjusted for Cost of Living", content: "When adjusted for cost of living, the rankings shift. The UAE and Saudi Arabia rank higher due to tax-free salaries and often-included benefits (housing, flights, insurance). Rural positions in Australia and Canada also offer excellent purchasing power." },
      { heading: "Additional Benefits by Country", content: "Beyond salary, benefits significantly impact total compensation.", bullets: ["Canada: Universal healthcare, pension, strong union benefits", "US: Varies widely — health insurance, 401(k), sign-on bonuses common", "UK: NHS pension, generous annual leave, professional development", "Australia: Penalty rates (25–75% extra for off-hours), superannuation", "UAE/Saudi: Housing, flights, tax-free income, end-of-service gratuity", "New Zealand: Excellent work-life balance, strong leave entitlements"] },
    ],
    faq: [
      { question: "Which country pays the most after taxes?", answer: "The UAE and Saudi Arabia offer the highest after-tax compensation due to zero income tax. Among taxing countries, the US typically offers the highest take-home pay, though this varies by state." },
      { question: "Are nursing salaries in the US worth the immigration hassle?", answer: "US salaries are significantly higher, but the immigration process is longer. Many nurses find it worthwhile, especially in high-paying states. Others prefer Canada or Australia for faster processing with still-competitive salaries." },
    ],
    relatedLinks: [
      { title: "Best Countries for International Nurses", href: "/international-nurses/best-countries" },
      { title: "Canada vs US for Nurses", href: "/international-nurses/compare-canada-vs-united-states" },
    ],
  },
  {
    slug: "visa-sponsorship-jobs",
    title: "Visa Sponsorship Nursing Jobs for International Nurses",
    metaTitle: "Visa Sponsorship Nursing Jobs | How to Find Sponsored Positions",
    metaDescription: "Guide to finding visa sponsorship nursing jobs in Canada, the US, UK, Australia, and the Middle East. Learn about employer sponsorship, recruitment agencies, and how to avoid scams.",
    sections: [
      { heading: "Overview", content: "Many countries and employers actively sponsor international nurses, covering visa costs, relocation, and sometimes licensing expenses. Understanding how visa sponsorship works can help you find the right opportunity and avoid common pitfalls." },
      { heading: "How Visa Sponsorship Works", content: "Visa sponsorship means an employer supports your immigration application by providing a job offer and often covering visa-related costs.", bullets: ["Employer files visa petition or sponsors your work permit", "Some employers cover relocation costs, housing, and licensing fees", "Sponsorship terms and obligations vary by country and employer", "Read all contracts carefully before signing"] },
      { heading: "Countries with Nurse Sponsorship Programs", content: "These countries have established programs for sponsoring international nurses.", bullets: ["Canada: Provincial Nominee Programs, employer-sponsored LMIA", "United States: EB-3 Green Card sponsorship, H-1B visa", "United Kingdom: NHS Trust sponsorship under Health and Care Worker Visa", "Australia: Employer-sponsored 482 visa", "UAE/Saudi Arabia: All employment is employer-sponsored", "Ireland: Critical Skills Employment Permit (employer-backed)"] },
      { heading: "How to Find Sponsored Positions", content: "There are several ways to find employers who sponsor international nurses.", bullets: ["NHS recruitment events and overseas campaigns (UK)", "Provincial health authority recruitment portals (Canada)", "CGFNS-approved recruitment agencies (US)", "Hospital career pages — search for 'international nurse' or 'visa sponsorship'", "Professional nursing associations and their job boards", "LinkedIn and healthcare-specific job platforms"] },
      { heading: "Avoiding Recruitment Scams", content: "Unfortunately, some recruitment agencies take advantage of international nurses. Protect yourself with these guidelines.", bullets: ["Never pay excessive placement fees — in the US, employers generally cannot charge nurses recruitment fees", "Research any recruitment agency thoroughly before engaging", "Get everything in writing before committing", "Check if the agency is registered with relevant authorities", "Be wary of agencies that guarantee employment or visa outcomes", "Connect with other nurses who have used the same agency"] },
    ],
    faq: [
      { question: "Do I have to pay a recruitment agency?", answer: "In many countries, it is illegal for agencies to charge nurses for job placement. In the US, the No Fee Act prohibits charging healthcare workers recruitment fees. Always research your rights in both your home and destination country." },
      { question: "What if my sponsor employer is bad?", answer: "Some visa types tie you to a specific employer temporarily. Research employers thoroughly before committing. Once you have permanent residency, you can change employers freely." },
      { question: "Can I sponsor myself?", answer: "In some countries (like Canada through Express Entry or Australia through the 189 visa), you can apply independently without employer sponsorship if you meet the points requirements." },
    ],
    relatedLinks: [
      { title: "Best Countries for International Nurses", href: "/international-nurses/best-countries" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
];

export const EXAM_PAGES: ExamPageData[] = [
  {
    slug: "nclex-for-international-nurses",
    title: "NCLEX for International Nurses: Complete Preparation Guide",
    metaTitle: "NCLEX for International Nurses | Prep Guide, Tips & Study Plan",
    metaDescription: "Everything international nurses need to know about the NCLEX-RN. Test format, registration process, study strategies, common challenges, and how NurseNest can help you pass.",
    sections: [
      { heading: "What Is the NCLEX-RN?", content: "The National Council Licensure Examination for Registered Nurses (NCLEX-RN) is the licensing exam required in the United States and Canada. It tests your ability to apply nursing knowledge safely and effectively using computer adaptive testing (CAT)." },
      { heading: "NCLEX for International Nurses", content: "As an internationally educated nurse, the NCLEX may test concepts differently than your home country exams. Understanding these differences is key to success.", bullets: ["CAT format adjusts difficulty based on your responses", "Focus on clinical judgment and application, not memorization", "US/Canadian practice standards may differ from your training", "Time management is crucial — you get up to 5 hours", "Next Generation NCLEX (NGN) includes new question types"] },
      { heading: "Registration Process for International Nurses", content: "The registration process differs slightly from domestic candidates.", bullets: ["Apply for credential evaluation (CGFNS for US, NNAS for Canada)", "Apply to a State Board of Nursing or Canadian provincial body", "Receive Authorization to Test (ATT)", "Schedule your exam at a Pearson VUE testing centre", "Available at testing centres worldwide (including Philippines, India, UK)"] },
      { heading: "Study Strategies for International Nurses", content: "International nurses benefit from focused preparation that addresses the unique challenges they face.", bullets: ["Study US/Canadian pharmacology — drug names and protocols may differ", "Practice CAT-format questions extensively", "Focus on clinical judgment and priority-setting questions", "Review maternal-newborn and pediatric nursing (often weaker areas for IENs)", "Use NurseNest's question bank for extensive practice", "Take timed practice exams to build stamina and time management"] },
      { heading: "Common Challenges for International Nurses", content: "Be aware of these common challenges when preparing for the NCLEX.", bullets: ["Unfamiliar drug names (brand vs generic, US vs international names)", "Different clinical procedures and standards of practice", "Cultural differences in nursing assessment and documentation", "CAT format can feel unfamiliar if you're used to paper exams", "Test anxiety from high-stakes nature of the exam"] },
    ],
    faq: [
      { question: "Can I take the NCLEX outside of North America?", answer: "Yes, Pearson VUE offers NCLEX testing at centres worldwide, including locations in the Philippines, India, United Kingdom, Japan, and many other countries." },
      { question: "What score do I need to pass the NCLEX?", answer: "The NCLEX is pass/fail — there is no specific 'score.' The CAT algorithm determines whether you meet the passing standard based on your performance pattern." },
      { question: "How many times can I take the NCLEX?", answer: "You can retake the NCLEX after a 45-day waiting period. There is no limit on the number of attempts, though some states may have specific policies." },
      { question: "How is the NCLEX different from exams in my country?", answer: "The NCLEX uses computer adaptive testing, focuses heavily on clinical judgment, and follows US/Canadian nursing standards. It may test concepts differently than the exams in your home country." },
    ],
    prepTips: [
      "Start with a diagnostic assessment to identify your weak areas",
      "Dedicate 6–12 weeks of focused study before your exam date",
      "Practice at least 100 NCLEX-style questions per day in the final weeks",
      "Review all body systems, not just your areas of expertise",
      "Study US/Canadian pharmacology names and dosages",
      "Take full-length practice exams under timed conditions",
      "Review clinical judgment frameworks and priority-setting models",
    ],
    commonMistakes: [
      "Studying only from textbooks instead of practicing questions",
      "Not adapting to US/Canadian nursing standards and protocols",
      "Underestimating the difficulty of the CAT format",
      "Not managing test anxiety effectively",
      "Cramming instead of consistent, spaced study",
    ],
    relatedLinks: [
      { title: "Start NCLEX Exam Prep", href: "/nclex-rn-practice-questions" },
      { title: "Question Bank", href: "/question-bank" },
      { title: "Study Plans", href: "/study-plan" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
  {
    slug: "rex-pn-for-international-nurses",
    title: "REx-PN for International Nurses: Complete Guide",
    metaTitle: "REx-PN for International Nurses | Exam Guide & Preparation Tips",
    metaDescription: "Everything international nurses need to know about the REx-PN exam for practical nursing licensure in Canada. Format, registration, study tips, and NurseNest prep resources.",
    sections: [
      { heading: "What Is the REx-PN?", content: "The Regulatory Exam for Practical Nurses (REx-PN) is the Canadian licensing exam for Licensed/Registered Practical Nurses (LPN/RPN). It replaced the CPNRE in 2025 and uses computer adaptive testing." },
      { heading: "REx-PN for International Nurses", content: "Internationally educated practical nurses seeking licensure in Canada must pass the REx-PN. The exam tests entry-to-practice competencies for practical nursing in Canada.", bullets: ["CAT format similar to NCLEX-RN", "Tests practical/vocational nursing scope of practice", "Includes Next Generation item types", "Focus on Canadian healthcare context and standards"] },
      { heading: "Registration Process", content: "International practical nurses follow a similar process to RN candidates but through provincial practical nursing regulatory bodies.", bullets: ["Apply to NNAS for credential evaluation", "Apply to provincial practical nursing regulatory body", "Meet language proficiency requirements", "Receive ATT and schedule exam at Pearson VUE", "Pass the REx-PN to obtain practical nursing licensure"] },
      { heading: "Study Strategies", content: "Effective preparation for the REx-PN requires understanding the practical nursing scope of practice in Canada.", bullets: ["Focus on practical nursing competencies and scope of practice", "Study Canadian healthcare system and standards", "Practice CAT-format questions regularly", "Use NurseNest's REx-PN prep resources for targeted practice", "Review areas commonly tested: pharmacology, clinical decision-making, safety"] },
    ],
    faq: [
      { question: "Is the REx-PN the same as the NCLEX?", answer: "No, the REx-PN is specifically for practical nurses (LPN/RPN) in Canada, while the NCLEX-RN is for registered nurses. They use similar CAT technology but test different scopes of practice." },
      { question: "Can I take the REx-PN outside Canada?", answer: "The REx-PN is primarily administered in Canada through Pearson VUE centres. Check with your provincial regulatory body for international testing availability." },
    ],
    prepTips: [
      "Understand the practical nursing scope of practice in Canada",
      "Practice with CAT-format questions daily",
      "Focus on clinical decision-making within the practical nursing scope",
      "Study Canadian pharmacology standards and protocols",
      "Take practice exams to build confidence and stamina",
    ],
    commonMistakes: [
      "Studying RN-level content instead of practical nursing scope",
      "Not understanding the differences between your home country's practical nursing scope and Canada's",
      "Underestimating the importance of Canadian healthcare context",
    ],
    relatedLinks: [
      { title: "REx-PN Exam Prep", href: "/rex-pn-guide" },
      { title: "Start Practice Questions", href: "/question-bank" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
  {
    slug: "ielts-for-nurses",
    title: "IELTS for Nurses: Complete Preparation Guide",
    metaTitle: "IELTS for Nurses | Score Requirements, Tips & Study Plan",
    metaDescription: "Comprehensive IELTS preparation guide for nurses. Learn about score requirements by country, study strategies, test format, and how to achieve the scores you need for nursing registration.",
    sections: [
      { heading: "Why IELTS Matters for Nurses", content: "The IELTS Academic test is the most widely accepted English proficiency exam for nursing registration worldwide. Achieving the required scores is often the biggest challenge for international nurses." },
      { heading: "Score Requirements by Country", content: "Different countries have different IELTS score requirements for nursing registration.", bullets: ["Canada: 6.5 overall, 7.0 speaking (varies by province)", "United Kingdom: 7.0 in each band", "Australia: 7.0 in each band", "New Zealand: 7.0 in each band", "Ireland: 6.5 in each band", "Note: Requirements may change — always verify with the regulatory body"] },
      { heading: "Test Format", content: "IELTS Academic consists of four sections.", bullets: ["Listening: 30 minutes, 40 questions", "Reading: 60 minutes, 40 questions (academic texts)", "Writing: 60 minutes, 2 tasks (graph description + essay)", "Speaking: 11–14 minutes, face-to-face interview"] },
      { heading: "Study Tips for Nurses", content: "Specific strategies to help nurses achieve their target IELTS scores.", bullets: ["Read nursing journals and articles in English daily", "Practice writing referral letters and clinical summaries", "Record yourself discussing clinical topics and review pronunciation", "Listen to English medical podcasts and news", "Take regular practice tests under timed conditions", "Focus on your weakest skill first — most nurses struggle with writing", "Consider IELTS preparation courses designed for healthcare professionals"] },
      { heading: "Common Challenges for Nurses", content: "Nurses frequently face these challenges with IELTS.", bullets: ["Writing Task 2 essay structure and academic vocabulary", "Speaking fluency under exam pressure", "Reading speed for academic passages", "Listening comprehension with different English accents"] },
    ],
    faq: [
      { question: "How long should I prepare for IELTS?", answer: "Most nurses need 3–6 months of dedicated preparation, depending on their current English level. If you're already working in English, you may need less time." },
      { question: "Can I combine IELTS scores from multiple attempts?", answer: "Some regulatory bodies (like the UK NMC) allow combining scores from two test sittings within 6 months. Check your target country's specific policy." },
      { question: "Is IELTS General accepted for nursing?", answer: "No, nursing regulatory bodies require IELTS Academic, not IELTS General Training. Make sure you register for the correct version of the test." },
    ],
    prepTips: [
      "Take a diagnostic test early to identify your target areas",
      "Practice at least 1 hour daily across all four skills",
      "Write practice essays and get feedback from native speakers",
      "Build healthcare vocabulary that will help in both IELTS and clinical practice",
      "Simulate test conditions when doing practice tests",
    ],
    commonMistakes: [
      "Registering for IELTS General instead of IELTS Academic",
      "Not practicing writing enough — it's usually the hardest section",
      "Ignoring time management during reading and writing sections",
      "Not being familiar with different English accents for listening",
    ],
    relatedLinks: [
      { title: "IELTS vs OET Comparison", href: "/international-nurses/ielts-vs-oet" },
      { title: "English Requirements for Nurses", href: "/international-nurses/english-requirements" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
  {
    slug: "oet-for-nurses",
    title: "OET for Nurses: Complete Preparation Guide",
    metaTitle: "OET for Nurses | Score Requirements, Tips & Why Nurses Prefer OET",
    metaDescription: "Comprehensive OET preparation guide for nurses. Learn about scoring, test format, which countries accept OET, study strategies, and why many nurses find OET easier than IELTS.",
    sections: [
      { heading: "What Is OET?", content: "The Occupational English Test (OET) is an English language proficiency test designed specifically for healthcare professionals. Unlike IELTS, OET uses healthcare scenarios and contexts, making it particularly relevant for nurses." },
      { heading: "Why Nurses Prefer OET", content: "Many international nurses choose OET over IELTS for several reasons.", bullets: ["All test content is healthcare-specific and familiar", "Speaking section uses patient role-play scenarios", "Writing section involves writing a referral or discharge letter", "Reading passages are from healthcare journals and publications", "Many nurses report achieving higher scores on OET than IELTS"] },
      { heading: "OET Test Format for Nurses", content: "OET Nursing consists of four sub-tests.", bullets: ["Listening: 40 minutes, healthcare-specific recordings", "Reading: 60 minutes, healthcare texts and scenarios", "Writing: 45 minutes, write a referral/discharge letter based on case notes", "Speaking: 20 minutes, two role-plays with a patient or family member"] },
      { heading: "Scoring and Requirements", content: "OET uses letter grades from A (highest) to E (lowest). Most nursing regulatory bodies require Grade B in all four sub-tests.", bullets: ["Grade B ≈ IELTS 7.0 band score", "UK NMC: Minimum B in all sub-tests", "Australia AHPRA: Minimum B in all sub-tests", "New Zealand NCNZ: Minimum B in all sub-tests", "Some Canadian provinces accept OET B"] },
      { heading: "Study Tips for OET", content: "Effective OET preparation leverages your healthcare background.", bullets: ["Practice writing referral letters using different case note scenarios", "Role-play patient interactions with a study partner", "Read healthcare articles and summarize key information", "Listen to clinical presentations and healthcare podcasts", "Review medical terminology and abbreviations", "Take OET practice tests regularly to track progress"] },
    ],
    faq: [
      { question: "Is OET easier than IELTS for nurses?", answer: "Many nurses report finding OET more comfortable because the content is healthcare-specific. Your clinical experience helps you understand the context, which can improve performance. However, individual results vary." },
      { question: "Where can I take the OET?", answer: "OET is available at test centres in over 40 countries, as well as online through OET@Home. Check the OET website for your nearest testing location." },
      { question: "How long are OET scores valid?", answer: "OET scores are valid for 2 years from the test date. Plan your testing timeline to ensure scores remain valid throughout your registration process." },
    ],
    prepTips: [
      "Use your clinical experience — it's your biggest advantage in OET",
      "Practice writing referral letters with different clinical scenarios",
      "Master the structure of OET writing: purpose, clinical information, social context, and request",
      "Practice speaking naturally about clinical situations",
      "Build healthcare-specific vocabulary beyond your specialty",
    ],
    commonMistakes: [
      "Not practicing the specific OET format (it differs from IELTS significantly)",
      "Writing too much or too little in the writing sub-test",
      "Not reading case notes carefully before writing the referral letter",
      "Forgetting to address all the key information in speaking role-plays",
    ],
    relatedLinks: [
      { title: "IELTS vs OET Comparison", href: "/international-nurses/ielts-vs-oet" },
      { title: "English Requirements for Nurses", href: "/international-nurses/english-requirements" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
  {
    slug: "nursing-credential-assessment-explained",
    title: "Nursing Credential Assessment Explained",
    metaTitle: "Nursing Credential Assessment | NNAS, CGFNS, ANMAC, NMC Explained",
    metaDescription: "Understand how nursing credential assessment works across different countries. Learn about NNAS, CGFNS, ANMAC, and NMC processes, what they evaluate, and how to prepare.",
    sections: [
      { heading: "What Is Credential Assessment?", content: "Credential assessment is the process by which a destination country evaluates whether your nursing education, training, and experience meet their standards for nursing practice. This is a mandatory step in almost every country for international nurses." },
      { heading: "What Gets Assessed", content: "Credential assessment agencies typically evaluate these aspects of your nursing background.", bullets: ["Nursing education program curriculum and hours", "Clinical practice hours and settings", "Course content compared to local nursing education standards", "Professional nursing registration status", "Post-qualification experience and specializations"] },
      { heading: "Major Assessment Agencies", content: "Each country uses different agencies for credential assessment.", bullets: ["Canada: NNAS (National Nursing Assessment Service)", "United States: CGFNS (Commission on Graduates of Foreign Nursing Schools)", "Australia: ANMAC (Australian Nursing and Midwifery Accreditation Council)", "United Kingdom: NMC (Nursing and Midwifery Council) — does internal assessment", "New Zealand: NCNZ (Nursing Council of New Zealand)", "UAE: DHA/DOH/MOH + Dataflow verification", "Saudi Arabia: SCFHS (Saudi Commission for Health Specialties)"] },
      { heading: "How to Prepare", content: "Maximize your chances of a positive credential assessment.", bullets: ["Request official documents from your nursing school early", "Ensure all documents are in English or certified translations", "Provide complete clinical hours documentation", "Include detailed course descriptions and syllabi", "Keep your nursing registration current", "Provide comprehensive employment history"] },
    ],
    faq: [
      { question: "What happens if my credentials are found insufficient?", answer: "You may be directed to complete a bridging program, additional courses, or supervised practice hours. This doesn't mean you can't practice — it means you need additional preparation to meet local standards." },
      { question: "Can I challenge a credential assessment outcome?", answer: "Most agencies have appeal or review processes. If you disagree with the outcome, review the agency's appeal procedures and provide any additional documentation that may support your case." },
    ],
    prepTips: [
      "Start gathering documents at least 6 months before you plan to apply",
      "Contact your nursing school about sending official documents directly",
      "Keep certified copies of all documents",
      "Track all submission deadlines and follow up regularly",
    ],
    commonMistakes: [
      "Submitting unofficial or incomplete transcripts",
      "Not including course descriptions or syllabi",
      "Letting documents expire before submission",
      "Not following up on application status",
    ],
    relatedLinks: [
      { title: "Credential Evaluation Guide", href: "/international-nurses/credential-evaluation" },
      { title: "Required Documents", href: "/international-nurses/required-documents" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
  {
    slug: "how-to-transfer-nursing-license",
    title: "How to Transfer Your Nursing License to Another Country",
    metaTitle: "How to Transfer Your Nursing License Internationally | Step-by-Step Guide",
    metaDescription: "Complete guide to transferring your nursing license to another country. Learn about the process, requirements, timelines, and tips for successful international nursing license transfer.",
    sections: [
      { heading: "Overview", content: "Transferring a nursing license internationally isn't a simple transfer — it's a process of obtaining new licensure in your destination country. Each country has its own registration requirements, and your existing qualifications serve as the basis for your application." },
      { heading: "General Steps", content: "While specific requirements vary by country, the general process follows these steps.", bullets: ["Research the registration requirements of your target country", "Apply for credential evaluation through the appropriate agency", "Meet English language proficiency requirements (if applicable)", "Complete any required additional education or bridging programs", "Pass the required licensing examinations", "Apply for registration with the regulatory body", "Apply for immigration/work visa"] },
      { heading: "Country-Specific Considerations", content: "Key things to know about license transfer to major destination countries.", bullets: ["Canada: NNAS assessment + NCLEX-RN/REx-PN + provincial registration", "US: CGFNS + VisaScreen + NCLEX-RN + state licensing", "UK: NMC registration + CBT + OSCE", "Australia: ANMAC assessment + AHPRA registration", "New Zealand: NCNZ assessment + possible CAP programme", "UAE: Prometric exam + Dataflow verification", "Saudi Arabia: SCFHS classification + SNLE/Prometric"] },
      { heading: "Mutual Recognition Agreements", content: "Some countries have mutual recognition agreements that simplify the process.", bullets: ["Australia ↔ New Zealand: Trans-Tasman Mutual Recognition", "EU member states: Mutual recognition of professional qualifications", "US ↔ Canada: NCLEX-RN is used in both countries (though licensing is separate)"] },
      { heading: "Tips for Success", content: "Follow these guidelines for a smoother license transfer process.", bullets: ["Start the process 12–24 months before your planned move", "Maintain your current license active throughout the process", "Keep detailed records of your clinical experience", "Invest in exam preparation — passing on the first attempt saves time and money", "Join online forums and communities of nurses who have made the same transition", "Consider working with a reputable immigration consultant"] },
    ],
    faq: [
      { question: "Can I practice nursing while waiting for my new license?", answer: "Generally no — you cannot practice nursing without a valid license in your destination country. However, you may be able to work in healthcare support roles depending on local regulations." },
      { question: "How long does the transfer process take?", answer: "Timelines vary significantly by country: UK (3–9 months), Canada (6–18 months), Australia (3–12 months), US (3–12 months plus visa wait). Start early and plan for delays." },
      { question: "Is it easier to transfer within the same country group (e.g., Commonwealth)?", answer: "Not necessarily. Each country has its own requirements regardless of historical connections. However, some mutual recognition agreements (like Australia-NZ) do simplify the process." },
    ],
    prepTips: [
      "Research your destination country's requirements thoroughly before starting",
      "Gather all documents early — this is the most time-consuming step",
      "Take language tests early so you have time to retake if needed",
      "Connect with nurses who have already made the same transition",
      "Budget for all costs upfront to avoid financial surprises",
    ],
    commonMistakes: [
      "Assuming your license will transfer directly (it won't)",
      "Not starting the process early enough",
      "Letting your current license expire during the process",
      "Not budgeting adequately for all steps",
      "Working with unscrupulous recruitment agencies",
    ],
    relatedLinks: [
      { title: "Credential Evaluation Guide", href: "/international-nurses/credential-evaluation" },
      { title: "Best Countries for International Nurses", href: "/international-nurses/best-countries" },
      { title: "International Nursing Hub", href: "/international-nurses" },
    ],
  },
];

export const HUB_PAGE_SECTIONS = [
  {
    heading: "Why International Nurses Are in Demand",
    content: "A global nursing shortage is driving unprecedented demand for internationally educated nurses (IENs). Countries like Canada, the United States, the United Kingdom, Australia, and the Middle East are actively recruiting nurses from around the world. Understanding the licensing requirements, exam processes, and immigration pathways is the first step toward building your nursing career abroad.",
  },
  {
    heading: "Understanding Licensing Differences",
    content: "Every country has its own nursing regulatory body and licensing requirements. Some countries use standardized exams (like the NCLEX in North America), while others use clinical assessments (like the OSCE in the UK). Your existing nursing education and experience form the foundation, but additional steps are always required.",
  },
  {
    heading: "Exam Requirements for International Nurses",
    content: "Most destination countries require internationally educated nurses to pass one or more examinations. These may include knowledge-based exams (CBT, NCLEX, Prometric), clinical assessments (OSCE, CAP), and language proficiency tests (IELTS, OET, TOEFL, CELBAN).",
  },
  {
    heading: "Language Testing",
    content: "English language proficiency is a mandatory requirement in all English-speaking destination countries. The most commonly accepted tests are IELTS Academic and OET (Occupational English Test). Score requirements vary by country, with Australia and the UK having the strictest requirements (7.0 in each band).",
  },
  {
    heading: "Credential Evaluation",
    content: "Before you can take licensing exams, your nursing credentials must be evaluated by the destination country's designated agency. This process verifies that your education and training meet local standards. Major agencies include NNAS (Canada), CGFNS (US), ANMAC (Australia), and NMC (UK).",
  },
  {
    heading: "Immigration Pathways",
    content: "Many countries have specific immigration programs that prioritize healthcare workers. Canada's Express Entry system, the UK's Health and Care Worker Visa, Australia's skilled migration program, and New Zealand's Green List all provide pathways for nurses to live and work permanently.",
  },
  {
    heading: "How NurseNest Helps International Nurses",
    content: "NurseNest provides comprehensive exam preparation resources designed specifically for internationally educated nurses. Our NCLEX-RN and REx-PN question banks, adaptive study plans, and clinical judgment practice help you prepare for the exams that stand between you and your new nursing career.",
  },
];

export const HUB_PAGE_FAQ = [
  { question: "What is the first step for international nurses wanting to work abroad?", answer: "The first step is to research the licensing requirements of your target country. This typically involves credential evaluation, language testing, and passing the required licensing examinations. Start with the country pages on this site for detailed guidance." },
  { question: "Which country is easiest for international nurses to get licensed?", answer: "The UAE and Saudi Arabia typically have the fastest processes (1–6 months). New Zealand's Green List and the UK's Health and Care Worker Visa also offer relatively streamlined pathways. Canada and Australia have strong demand but longer processing times." },
  { question: "Do I need to pass the NCLEX to work as a nurse internationally?", answer: "Only if you want to work in Canada or the United States. Other countries have their own exams — the UK uses CBT and OSCE, Australia uses skills assessment, and the UAE uses Prometric exams." },
  { question: "How much does it cost to transfer a nursing license?", answer: "Costs vary by country: Canada ($3,000–$6,000 CAD), US ($3,000–$8,000 USD), UK (£1,500–£3,000 GBP), Australia ($2,000–$5,000 AUD). This includes credential evaluation, exam fees, language tests, and registration." },
  { question: "Can NurseNest help me prepare for international nursing exams?", answer: "Yes! NurseNest offers comprehensive exam preparation for the NCLEX-RN, REx-PN, and other nursing exams. Our question banks, adaptive study plans, and practice exams are designed to help international nurses succeed." },
];
