import { GraduationCap, MapPin, Clock, DollarSign, FileText, Award, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NursingSchool {
  name: string;
  programTypes: string[];
  location: string;
  tuitionRange: string;
  admissionRequirements: string[];
  licensingOutcomes: string[];
  duration: string;
  applicationLink: string;
  description: string;
}

export interface NursingSchoolCountry {
  slug: string;
  name: string;
  flag: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  overview: string;
  educationSystem: string;
  schools: NursingSchool[];
  faq: { question: string; answer: string }[];
}

export const NURSING_SCHOOL_COUNTRIES: NursingSchoolCountry[] = [
  {
    slug: "canada",
    name: "Canada",
    flag: "\ud83c\udde8\ud83c\udde6",
    description: "Explore accredited nursing programs across Canada, from BScN to NP pathways.",
    metaTitle: "Nursing Schools in Canada \u2013 Accredited Programs & Admissions Guide",
    metaDescription: "Complete directory of nursing schools in Canada. Compare BScN, RPN, and NP programs with tuition, admissions requirements, and licensing outcomes.",
    metaKeywords: "nursing schools Canada, BScN programs, Canadian nursing education, RPN programs Ontario, NP programs Canada",
    overview: "Canada offers world-class nursing education through universities and colleges across all provinces. Programs range from practical nursing diplomas (2 years) to Bachelor of Science in Nursing (4 years) and advanced practice NP degrees. Graduates write the NCLEX-RN or REX-PN for licensure.",
    educationSystem: "Canadian nursing education is regulated provincially. Each province has a regulatory body that approves nursing programs and sets licensure requirements. BScN programs are the entry-to-practice standard for RNs, while practical nursing diplomas prepare RPNs.",
    schools: [
      { name: "University of Toronto \u2013 Bloomberg Faculty of Nursing", programTypes: ["BScN", "MN", "PhD"], location: "Toronto, Ontario", tuitionRange: "$7,000\u2013$9,000 CAD/year (domestic)", admissionRequirements: ["High school diploma with biology, chemistry, math", "Minimum 75% average", "Supplementary application"], licensingOutcomes: ["NCLEX-RN eligibility", "CNO registration"], duration: "4 years (BScN)", applicationLink: "https://bloomberg.nursing.utoronto.ca/", description: "One of Canada's top-ranked nursing programs with strong clinical partnerships at UHN and SickKids." },
      { name: "University of British Columbia \u2013 School of Nursing", programTypes: ["BSN", "MSN", "DNP"], location: "Vancouver, British Columbia", tuitionRange: "$6,500\u2013$8,500 CAD/year (domestic)", admissionRequirements: ["Completion of first-year university prerequisites", "Minimum 72% average", "Personal profile"], licensingOutcomes: ["NCLEX-RN eligibility", "BCCNM registration"], duration: "4 years (BSN)", applicationLink: "https://nursing.ubc.ca/", description: "A research-intensive program emphasizing community health, Indigenous health, and global nursing." },
      { name: "McGill University \u2013 Ingram School of Nursing", programTypes: ["BScN", "MSc(A)", "PhD"], location: "Montreal, Quebec", tuitionRange: "$4,000\u2013$5,500 CAD/year (domestic)", admissionRequirements: ["CEGEP or equivalent", "Strong science prerequisites", "English proficiency"], licensingOutcomes: ["OIIQ exam eligibility", "Quebec nursing license"], duration: "3 years (BScN after CEGEP)", applicationLink: "https://www.mcgill.ca/nursing/", description: "A bilingual nursing program with access to McGill University Health Centre and diverse clinical placements." },
      { name: "Humber College \u2013 Practical Nursing Program", programTypes: ["PN Diploma"], location: "Toronto, Ontario", tuitionRange: "$4,500\u2013$6,000 CAD/year (domestic)", admissionRequirements: ["OSSD or equivalent", "Grade 12 biology, chemistry, English", "Current Standard First Aid"], licensingOutcomes: ["REX-PN eligibility", "CNO RPN registration"], duration: "2 years", applicationLink: "https://www.humber.ca/", description: "A well-regarded practical nursing program with extensive simulation labs and clinical placements across the GTA." },
      { name: "University of Alberta \u2013 Faculty of Nursing", programTypes: ["BScN", "MN", "PhD"], location: "Edmonton, Alberta", tuitionRange: "$6,000\u2013$8,000 CAD/year (domestic)", admissionRequirements: ["High school diploma with biology, chemistry, English", "Competitive admission average", "Criminal record check"], licensingOutcomes: ["NCLEX-RN eligibility", "CRNA registration"], duration: "4 years (BScN)", applicationLink: "https://www.ualberta.ca/nursing/", description: "Alberta's premier nursing school with rural and remote nursing placement options and interprofessional education." },
    ],
    faq: [
      { question: "What exam do Canadian nursing graduates write?", answer: "RN graduates write the NCLEX-RN, while RPN/LPN graduates write the REX-PN (or provincial equivalent). Both exams are computer-adaptive and administered by Pearson VUE." },
      { question: "How long is a nursing degree in Canada?", answer: "A Bachelor of Science in Nursing (BScN/BSN) is typically 4 years. Practical nursing diplomas are 2 years. Accelerated programs for students with prior degrees may be completed in 2 years." },
      { question: "Can international students study nursing in Canada?", answer: "Yes, many Canadian nursing schools accept international students, though tuition is significantly higher (typically $20,000\u2013$40,000 CAD/year). International students must also meet English proficiency requirements." },
    ],
  },
  {
    slug: "united-states",
    name: "United States",
    flag: "\ud83c\uddfa\ud83c\uddf8",
    description: "Find top nursing programs across the USA, from ADN to DNP pathways.",
    metaTitle: "Nursing Schools in the United States \u2013 Top Programs & Admissions Guide",
    metaDescription: "Comprehensive directory of nursing schools in the USA. Compare ADN, BSN, MSN, and DNP programs with tuition, requirements, and NCLEX pass rates.",
    metaKeywords: "nursing schools USA, BSN programs, NCLEX prep, ADN programs, nursing education United States, DNP programs",
    overview: "The United States has the world's largest nursing education system with over 3,000 programs. Entry pathways include Associate Degree in Nursing (ADN, 2 years), Bachelor of Science in Nursing (BSN, 4 years), and accelerated BSN programs for career changers. All graduates must pass the NCLEX-RN or NCLEX-PN for licensure.",
    educationSystem: "US nursing education is accredited by CCNE or ACEN. State Boards of Nursing regulate licensure. The BSN is increasingly preferred by employers, and many hospitals now require BSN within 10 years of hiring (Magnet designation).",
    schools: [
      { name: "Johns Hopkins University \u2013 School of Nursing", programTypes: ["BSN", "MSN", "DNP", "PhD"], location: "Baltimore, Maryland", tuitionRange: "$58,000/year", admissionRequirements: ["Bachelor's degree (accelerated BSN)", "Prerequisite sciences with B or higher", "GRE scores (MSN/DNP)"], licensingOutcomes: ["NCLEX-RN eligibility", "Maryland Board of Nursing"], duration: "15 months (accelerated BSN)", applicationLink: "https://nursing.jhu.edu/", description: "Consistently ranked #1 nationally, known for evidence-based practice and research excellence." },
      { name: "University of Pennsylvania \u2013 School of Nursing", programTypes: ["BSN", "MSN", "DNP", "PhD"], location: "Philadelphia, Pennsylvania", tuitionRange: "$55,000/year", admissionRequirements: ["Strong academic record", "Prerequisite sciences", "Letters of recommendation"], licensingOutcomes: ["NCLEX-RN eligibility", "Pennsylvania State Board"], duration: "4 years (BSN), 12 months (accelerated)", applicationLink: "https://www.nursing.upenn.edu/", description: "An Ivy League nursing program with cutting-edge research and global health opportunities." },
      { name: "Duke University \u2013 School of Nursing", programTypes: ["ABSN", "MSN", "DNP", "PhD"], location: "Durham, North Carolina", tuitionRange: "$52,000/year", admissionRequirements: ["Prior bachelor's degree", "Prerequisite courses", "Clinical experience preferred"], licensingOutcomes: ["NCLEX-RN eligibility", "NC Board of Nursing"], duration: "16 months (ABSN)", applicationLink: "https://nursing.duke.edu/", description: "A top-ranked program integrated with Duke University Medical Center, emphasizing clinical innovation." },
      { name: "University of Michigan \u2013 School of Nursing", programTypes: ["BSN", "MSN", "DNP", "PhD"], location: "Ann Arbor, Michigan", tuitionRange: "$16,000\u2013$50,000/year", admissionRequirements: ["Strong GPA", "Prerequisite sciences", "Personal statement"], licensingOutcomes: ["NCLEX-RN eligibility", "Michigan Board of Nursing"], duration: "4 years (BSN)", applicationLink: "https://nursing.umich.edu/", description: "A top public university nursing program with strong research funding and community health focus." },
      { name: "Miami Dade College \u2013 School of Nursing", programTypes: ["ADN", "BSN"], location: "Miami, Florida", tuitionRange: "$3,500\u2013$12,000/year", admissionRequirements: ["High school diploma or GED", "TEAS exam", "Prerequisite courses"], licensingOutcomes: ["NCLEX-RN eligibility", "Florida Board of Nursing"], duration: "2 years (ADN), 4 years (BSN)", applicationLink: "https://www.mdc.edu/", description: "One of the nation's largest and most diverse nursing programs, offering affordable ADN-to-BSN pathways." },
    ],
    faq: [
      { question: "What is the difference between ADN and BSN?", answer: "An Associate Degree in Nursing (ADN) takes 2 years at a community college, while a Bachelor of Science in Nursing (BSN) takes 4 years at a university. Both qualify graduates for NCLEX-RN, but BSN is increasingly required for career advancement." },
      { question: "How much does nursing school cost in the US?", answer: "Costs vary widely: community college ADN programs can be $3,000\u2013$15,000 total, public university BSN programs $20,000\u2013$60,000, and private universities $100,000+. Financial aid and scholarships are widely available." },
      { question: "What is the NCLEX pass rate for US nursing schools?", answer: "National NCLEX-RN first-time pass rates average around 85\u201390%. Top programs often exceed 95%. State Boards of Nursing publish pass rates for each program, which is a key indicator of program quality." },
    ],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "\ud83c\uddec\ud83c\udde7",
    description: "Discover nursing degree programs across England, Scotland, Wales, and Northern Ireland.",
    metaTitle: "Nursing Schools in the UK \u2013 NMC-Approved Programmes & Admissions Guide",
    metaDescription: "Directory of NMC-approved nursing schools in the United Kingdom. Compare adult, child, mental health, and learning disability nursing programmes.",
    metaKeywords: "nursing schools UK, NMC approved programmes, nursing degree UK, NHS nursing, nursing education England Scotland Wales",
    overview: "The UK offers nursing education through university-based programmes approved by the Nursing and Midwifery Council (NMC). Students choose a field of practice: adult, children, mental health, or learning disabilities. The standard route is a 3-year BSc in Nursing, with NHS-funded placements throughout.",
    educationSystem: "UK nursing education is regulated by the NMC. All programmes must meet NMC standards for education and training. Students spend 50% of their programme in clinical practice within NHS settings. Graduates register with the NMC to practice.",
    schools: [
      { name: "King's College London \u2013 Florence Nightingale Faculty of Nursing", programTypes: ["BSc Nursing", "MSc", "PhD"], location: "London, England", tuitionRange: "\u00a39,250/year (home students)", admissionRequirements: ["UCAS application", "A-levels in sciences", "DBS check", "Health screening"], licensingOutcomes: ["NMC registration"], duration: "3 years (BSc)", applicationLink: "https://www.kcl.ac.uk/nursing", description: "Named after Florence Nightingale herself, this prestigious programme offers placements across Guy's and St Thomas' NHS Foundation Trust." },
      { name: "University of Edinburgh \u2013 Nursing Studies", programTypes: ["BN", "MSc", "PhD"], location: "Edinburgh, Scotland", tuitionRange: "Free for Scottish residents / \u00a39,250 (rest of UK)", admissionRequirements: ["SQA Highers or A-levels", "Health and care experience", "PVG scheme membership"], licensingOutcomes: ["NMC registration"], duration: "4 years (BN)", applicationLink: "https://www.ed.ac.uk/health/nursing-studies", description: "Scotland's leading nursing programme with placements across NHS Lothian and surrounding health boards." },
      { name: "University of Manchester \u2013 School of Health Sciences", programTypes: ["BNurs", "MSc", "PhD"], location: "Manchester, England", tuitionRange: "\u00a39,250/year (home students)", admissionRequirements: ["UCAS application", "A-levels including science subject", "Care experience preferred"], licensingOutcomes: ["NMC registration"], duration: "3 years (BNurs)", applicationLink: "https://www.manchester.ac.uk/", description: "A Russell Group university programme with strong research links and placements across Greater Manchester NHS trusts." },
    ],
    faq: [
      { question: "Is nursing school free in the UK?", answer: "Tuition fees for home students are \u00a39,250/year in England, with NHS learning support grants available. In Scotland, tuition is free for Scottish residents. A \u00a35,000+ annual NHS bursary is available to all nursing students in England." },
      { question: "What fields of nursing can I study in the UK?", answer: "UK nursing programmes offer four fields: adult nursing, children's nursing, mental health nursing, and learning disability nursing. You choose your field at application and specialize throughout the programme." },
      { question: "How do I register as a nurse in the UK?", answer: "After completing an NMC-approved programme, you apply to the Nursing and Midwifery Council for registration. International nurses must pass a CBT (computer-based test) and OSCE (clinical skills assessment)." },
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "\ud83c\udde6\ud83c\uddfa",
    description: "Find AHPRA-accredited nursing programs at Australian universities and colleges.",
    metaTitle: "Nursing Schools in Australia \u2013 AHPRA-Accredited Programs & Guide",
    metaDescription: "Complete directory of nursing schools in Australia. Compare Bachelor of Nursing, enrolled nursing, and postgraduate programs with tuition and registration pathways.",
    metaKeywords: "nursing schools Australia, Bachelor of Nursing Australia, AHPRA registration, enrolled nursing, nursing education Australia",
    overview: "Australia offers nursing education through universities (Bachelor of Nursing, 3 years) and TAFEs (Diploma of Nursing for enrolled nurses, 18 months). All programmes are accredited by the Australian Nursing and Midwifery Accreditation Council (ANMAC) and graduates register with AHPRA.",
    educationSystem: "The Nursing and Midwifery Board of Australia (under AHPRA) regulates nursing practice. A Bachelor of Nursing is the minimum qualification for registered nurses. Enrolled nurses complete a Diploma of Nursing at TAFE or equivalent.",
    schools: [
      { name: "University of Sydney \u2013 Sydney Nursing School", programTypes: ["BN", "MN", "PhD"], location: "Sydney, New South Wales", tuitionRange: "AUD $10,000\u2013$12,000/year (CSP)", admissionRequirements: ["ATAR 80+", "HSC including English and science", "Working With Children Check"], licensingOutcomes: ["AHPRA registration", "NMBA registration"], duration: "3 years (BN)", applicationLink: "https://www.sydney.edu.au/nursing/", description: "Australia's oldest nursing school with placements across Sydney Local Health Districts and specialty hospitals." },
      { name: "Monash University \u2013 School of Nursing and Midwifery", programTypes: ["BN", "BN/BMid", "MN Practice"], location: "Melbourne, Victoria", tuitionRange: "AUD $10,500\u2013$12,000/year (CSP)", admissionRequirements: ["ATAR 70+", "Prerequisite subjects", "Police check"], licensingOutcomes: ["AHPRA registration"], duration: "3 years (BN)", applicationLink: "https://www.monash.edu/nursing/", description: "A highly regarded programme with state-of-the-art simulation facilities and international exchange opportunities." },
      { name: "University of Technology Sydney (UTS) \u2013 Nursing", programTypes: ["BN", "Graduate Entry MN", "DNP"], location: "Sydney, New South Wales", tuitionRange: "AUD $10,000\u2013$11,500/year (CSP)", admissionRequirements: ["ATAR 75+", "English proficiency", "Inherent requirements declaration"], licensingOutcomes: ["AHPRA registration"], duration: "3 years (BN)", applicationLink: "https://www.uts.edu.au/", description: "Known for practice-oriented education with strong industry partnerships and innovative clinical simulation." },
    ],
    faq: [
      { question: "How long is a nursing degree in Australia?", answer: "A Bachelor of Nursing takes 3 years full-time. Enrolled nursing diplomas take 18 months. Graduate-entry Master of Nursing programs for career changers take 2 years." },
      { question: "What is a CSP in Australian nursing education?", answer: "A Commonwealth Supported Place (CSP) means the Australian government subsidizes your tuition. Domestic students typically pay $10,000\u2013$12,000 AUD/year instead of the full fee of $30,000+." },
      { question: "Can I work as a nurse in Australia with a foreign degree?", answer: "Yes, but you must apply to AHPRA for registration. This requires an ANMAC skills assessment, English proficiency (IELTS 7.0 in each band), and potentially a bridging programme." },
    ],
  },
  {
    slug: "philippines",
    name: "Philippines",
    flag: "\ud83c\uddf5\ud83c\udded",
    description: "Explore nursing schools in the Philippines, a global leader in nursing education.",
    metaTitle: "Nursing Schools in the Philippines \u2013 BSN Programs & Board Exam Guide",
    metaDescription: "Directory of top nursing schools in the Philippines. Compare BSN programs, tuition, board exam pass rates, and international career pathways.",
    metaKeywords: "nursing schools Philippines, BSN Philippines, PRC nursing board exam, nursing education Philippines, Filipino nurses abroad",
    overview: "The Philippines is one of the world's largest exporters of nurses, with hundreds of CHED-accredited BSN programmes. Nursing education combines strong clinical training with English-language instruction, preparing graduates for both the Philippine Nursing Licensure Examination and international licensing exams.",
    educationSystem: "The Commission on Higher Education (CHED) regulates nursing programmes. Graduates must pass the Philippine Nursing Licensure Examination administered by the Professional Regulation Commission (PRC). Many Filipino nurses subsequently pursue international licensure in the US, Canada, UK, or Middle East.",
    schools: [
      { name: "University of the Philippines Manila \u2013 College of Nursing", programTypes: ["BSN", "MAN", "PhD Nursing"], location: "Manila", tuitionRange: "PHP 15,000\u2013$30,000/year", admissionRequirements: ["UPCAT exam", "High school diploma", "Strong science background"], licensingOutcomes: ["PRC Nursing Board eligibility", "International licensure pathway"], duration: "4 years (BSN)", applicationLink: "https://www.upm.edu.ph/", description: "The country's premier nursing school, consistently producing top board exam passers with a focus on public health nursing." },
      { name: "University of Santo Tomas \u2013 College of Nursing", programTypes: ["BSN"], location: "Manila", tuitionRange: "PHP 80,000\u2013$120,000/year", admissionRequirements: ["USTET entrance exam", "High school diploma", "Good moral character"], licensingOutcomes: ["PRC Nursing Board eligibility"], duration: "4 years (BSN)", applicationLink: "https://www.ust.edu.ph/", description: "One of Asia's oldest universities with a renowned nursing program and 90%+ board exam pass rate." },
      { name: "Silliman University \u2013 College of Nursing", programTypes: ["BSN", "MAN"], location: "Dumaguete City, Negros Oriental", tuitionRange: "PHP 60,000\u2013$90,000/year", admissionRequirements: ["Entrance exam", "High school diploma", "Interview"], licensingOutcomes: ["PRC Nursing Board eligibility"], duration: "4 years (BSN)", applicationLink: "https://su.edu.ph/", description: "A PAASCU-accredited programme known for excellent clinical training and community health partnerships." },
    ],
    faq: [
      { question: "How long is nursing school in the Philippines?", answer: "The Bachelor of Science in Nursing (BSN) takes 4 years, including theoretical courses and clinical rotations in hospitals, community settings, and public health agencies." },
      { question: "What is the Philippine Nursing Board Exam?", answer: "The Nursing Licensure Examination (NLE) is administered by the PRC twice a year. It covers fundamentals of nursing, medical-surgical nursing, maternal and child health, community health nursing, and professional adjustments." },
      { question: "Can Filipino nurses work abroad?", answer: "Yes, Filipino nurses are highly sought after globally. Many pursue NCLEX (US/Canada), NMC CBT (UK), or HAAD/DHA (Middle East) to work internationally. English-medium education is a significant advantage." },
    ],
  },
  {
    slug: "india",
    name: "India",
    flag: "\ud83c\uddee\ud83c\uddf3",
    description: "Discover nursing colleges across India offering BSc, GNM, and MSc nursing programmes.",
    metaTitle: "Nursing Schools in India \u2013 BSc Nursing, GNM & MSc Programs Guide",
    metaDescription: "Complete directory of nursing schools in India. Compare BSc Nursing, GNM, and MSc programs with fees, eligibility, and career pathways for Indian nurses.",
    metaKeywords: "nursing schools India, BSc Nursing India, GNM nursing, INC approved colleges, nursing education India, Indian nursing council",
    overview: "India has over 4,000 nursing institutions approved by the Indian Nursing Council (INC). Programs include General Nursing and Midwifery (GNM, 3.5 years), BSc Nursing (4 years), Post-Basic BSc Nursing (2 years), and MSc Nursing (2 years). Indian nurses are increasingly sought for international positions.",
    educationSystem: "The Indian Nursing Council (INC) and respective State Nursing Councils regulate nursing education. The National Eligibility cum Entrance Test (NEET) is required for BSc Nursing admission in many states. State nursing registration is required to practice.",
    schools: [
      { name: "AIIMS New Delhi \u2013 College of Nursing", programTypes: ["BSc Nursing", "MSc Nursing", "PhD"], location: "New Delhi", tuitionRange: "INR 1,000\u2013$5,000/year (subsidized)", admissionRequirements: ["NEET qualification", "10+2 with PCB", "Minimum 60% aggregate"], licensingOutcomes: ["State Nursing Council registration"], duration: "4 years (BSc)", applicationLink: "https://www.aiims.edu/", description: "India's most prestigious nursing institution attached to the country's top medical centre, offering heavily subsidized education." },
      { name: "Christian Medical College (CMC) Vellore \u2013 College of Nursing", programTypes: ["BSc Nursing", "MSc Nursing", "PhD"], location: "Vellore, Tamil Nadu", tuitionRange: "INR 50,000\u2013$80,000/year", admissionRequirements: ["CMC entrance exam", "10+2 with PCB", "Christian minority seats available"], licensingOutcomes: ["Tamil Nadu Nurses Council registration"], duration: "4 years (BSc)", applicationLink: "https://www.cmch-vellore.edu/", description: "Internationally recognized for clinical excellence and community health nursing, with missionary healthcare heritage." },
      { name: "Manipal College of Nursing \u2013 MAHE", programTypes: ["BSc Nursing", "MSc Nursing", "PhD"], location: "Manipal, Karnataka", tuitionRange: "INR 1,50,000\u2013$2,50,000/year", admissionRequirements: ["MAHE entrance exam", "10+2 with PCB", "Minimum 50% aggregate"], licensingOutcomes: ["Karnataka State Nursing Council registration"], duration: "4 years (BSc)", applicationLink: "https://manipal.edu/", description: "A leading private nursing school with state-of-the-art simulation labs and international clinical exchange programmes." },
    ],
    faq: [
      { question: "What is the difference between GNM and BSc Nursing in India?", answer: "GNM (General Nursing and Midwifery) is a 3.5-year diploma programme, while BSc Nursing is a 4-year degree programme. BSc Nursing offers better career advancement and international recognition. GNM nurses can pursue Post-Basic BSc Nursing (2 years) to upgrade." },
      { question: "Is NEET required for nursing in India?", answer: "NEET is required for BSc Nursing admission in most government and many private colleges. Some private universities conduct their own entrance exams. GNM programmes may have separate state-level entrance exams." },
      { question: "Can Indian nurses work abroad?", answer: "Yes, Indian nurses can work internationally after meeting destination country requirements. Common pathways include NCLEX for US/Canada, NMC CBT/OSCE for UK, and HAAD/DHA for Middle East. English proficiency tests (IELTS/OET) are typically required." },
    ],
  },
];
