export interface ResidencyProgram {
  hospitalSystem: string;
  programName: string;
  programLength: string;
  specialtyFocus: string[];
  applicationTimeline: string;
  requirements: string[];
  location: string;
  description: string;
  link: string;
}

export interface ResidencyCountry {
  slug: string;
  name: string;
  flag: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  overview: string;
  whyResidency: string;
  programs: ResidencyProgram[];
  faq: { question: string; answer: string }[];
}

export const RESIDENCY_COUNTRIES: ResidencyCountry[] = [
  {
    slug: "united-states",
    name: "United States",
    flag: "\ud83c\uddfa\ud83c\uddf8",
    description: "Explore new grad nurse residency programs at top US hospital systems.",
    metaTitle: "Nurse Residency Programs in the USA \u2013 New Grad Hospital Programs Guide",
    metaDescription: "Complete directory of nurse residency programs in the United States. Find new grad nursing programs by hospital system, specialty, and application timeline.",
    metaKeywords: "nurse residency programs USA, new grad nursing programs, hospital nurse residency, Vizient nurse residency, nursing transition to practice",
    overview: "The United States has the most developed nurse residency landscape in the world. Major health systems offer structured 12\u201324 month programs designed to support new graduate nurses in their transition from student to competent clinician. Programs typically include mentorship, didactic education, evidence-based practice projects, and gradual clinical integration.",
    whyResidency: "Research shows nurse residency programs reduce first-year turnover from 35% to under 10%, improve clinical competence, and increase job satisfaction. They bridge the gap between nursing school education and the realities of bedside practice.",
    programs: [
      { hospitalSystem: "HCA Healthcare", programName: "StaRN Nurse Residency Program", programLength: "14\u201322 weeks (paid)", specialtyFocus: ["Med-Surg", "ICU", "Emergency", "Behavioral Health", "OR"], applicationTimeline: "Rolling admissions year-round", requirements: ["New graduate RN or <1 year experience", "BSN or ADN with BSN commitment", "Active RN license or interim permit"], location: "185+ hospitals across 20 states", description: "The nation's largest nurse residency program. HCA's StaRN includes intensive classroom and simulation training before transitioning to precepted clinical shifts.", link: "https://careers.hcahealthcare.com/" },
      { hospitalSystem: "Kaiser Permanente", programName: "Nurse Residency Program", programLength: "12 months", specialtyFocus: ["Med-Surg", "Ambulatory Care", "Home Health", "ICU"], applicationTimeline: "Applications open February and August; cohorts start April and October", requirements: ["BSN required", "New graduate or <6 months experience", "California RN license"], location: "California, Oregon, Washington, Colorado", description: "A Vizient/AACN-accredited residency embedded within one of the nation's largest integrated health systems, emphasizing evidence-based practice and patient safety.", link: "https://careers.kaiserpermanente.org/" },
      { hospitalSystem: "Mayo Clinic", programName: "Nurse Residency Program", programLength: "12 months", specialtyFocus: ["ICU", "OR", "Med-Surg", "Oncology", "Transplant", "Pediatrics"], applicationTimeline: "Applications open September for January start; January for June start", requirements: ["BSN required", "Graduation within past 12 months", "Eligible for state RN licensure"], location: "Rochester MN, Phoenix AZ, Jacksonville FL", description: "A highly competitive residency at one of the world's top hospitals, featuring monthly seminars, dedicated mentors, and an evidence-based practice project.", link: "https://jobs.mayoclinic.org/" },
      { hospitalSystem: "Cleveland Clinic", programName: "New Graduate Nurse Residency", programLength: "12 months", specialtyFocus: ["Critical Care", "Med-Surg", "Perioperative", "Ambulatory", "Behavioral Health"], applicationTimeline: "Cohorts start January, April, July, October", requirements: ["BSN preferred", "New graduate or <1 year experience", "Ohio or Florida RN license"], location: "Cleveland OH, Florida locations", description: "A CCNE-accredited residency program at a world-renowned academic medical center with structured preceptorship and professional development.", link: "https://jobs.clevelandclinic.org/" },
      { hospitalSystem: "NYU Langone Health", programName: "Nurse Residency Program", programLength: "12 months", specialtyFocus: ["Critical Care", "Med-Surg", "Perioperative", "Emergency", "Oncology"], applicationTimeline: "Applications open Fall for Spring start; Spring for Fall start", requirements: ["BSN required", "New graduate", "New York RN license"], location: "New York City, NY", description: "An academic medical center residency with robust mentorship, monthly didactic sessions, and a capstone evidence-based project presentation.", link: "https://nyulangone.org/careers" },
    ],
    faq: [
      { question: "What is a nurse residency program?", answer: "A nurse residency is a structured transition-to-practice program for new graduate RNs, typically lasting 12 months. It includes mentorship, clinical education, simulation, and professional development to bridge the gap between nursing school and independent practice." },
      { question: "Are nurse residencies paid?", answer: "Yes, nurse residency programs in the US are paid positions. Residents earn a full nursing salary (typically $55,000\u2013$85,000/year depending on location) while receiving additional training and mentorship." },
      { question: "Do I need a BSN for a nurse residency?", answer: "Many top residency programs require a BSN. Some programs (like HCA's StaRN) accept ADN graduates with a commitment to complete a BSN within a set timeframe. Check specific program requirements." },
      { question: "How competitive are nurse residency programs?", answer: "Top programs like Mayo Clinic and NYU Langone are highly competitive with acceptance rates of 10\u201320%. Larger systems like HCA have broader acceptance. Strong clinical rotations, certifications (BLS/ACLS), and leadership experience strengthen applications." },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "\ud83c\udde8\ud83c\udde6",
    description: "Find new graduate nursing programs and transition support across Canadian provinces.",
    metaTitle: "Nurse Residency & New Grad Programs in Canada \u2013 Provincial Guide",
    metaDescription: "Directory of nurse residency and new graduate support programs across Canada. Find transition-to-practice programs by province, hospital, and specialty.",
    metaKeywords: "nurse residency Canada, new grad nursing programs Canada, nursing transition programs Ontario, new graduate nurse Canada, nursing fellowships Canada",
    overview: "Canada's approach to new graduate nursing support varies by province. While formal \u2018residency\u2019 programs are less common than in the US, many provinces offer New Graduate Guarantee programs, extended orientation programs, and transition-to-practice initiatives through major health authorities.",
    whyResidency: "New graduate programs in Canada help address nursing shortages while supporting safe patient care. Programs provide structured mentorship, clinical skill development, and professional socialization during the critical first year of practice.",
    programs: [
      { hospitalSystem: "University Health Network (UHN)", programName: "New Graduate Guarantee Program", programLength: "6 months (full-time supernumerary)", specialtyFocus: ["Med-Surg", "Critical Care", "Oncology", "Neurosciences", "Transplant"], applicationTimeline: "Applications typically open March\u2013April and September\u2013October", requirements: ["BScN or diploma with CNO registration", "New graduate (within 12 months)", "REX-PN or NCLEX-RN pass"], location: "Toronto, Ontario", description: "Ontario's largest academic health network offers supernumerary new grad positions with dedicated preceptors across Toronto General, Toronto Western, and Princess Margaret hospitals.", link: "https://www.uhn.ca/careers" },
      { hospitalSystem: "Alberta Health Services", programName: "Graduate Nurse Transition Program", programLength: "12 months", specialtyFocus: ["Acute Care", "Rural Nursing", "Emergency", "Community Health"], applicationTimeline: "Continuous intake with quarterly cohorts", requirements: ["BScN degree", "CRNA provisional registration", "NCLEX-RN pass or scheduled"], location: "Province-wide \u2013 Alberta", description: "Alberta's province-wide transition program supports new graduates in urban and rural settings, with structured mentorship and gradual independence.", link: "https://www.albertahealthservices.ca/careers/" },
      { hospitalSystem: "BC Children's & Women's Hospital", programName: "New Graduate Nursing Program", programLength: "6\u201312 months", specialtyFocus: ["Pediatrics", "NICU", "Maternity", "Women's Health"], applicationTimeline: "Spring and Fall intake", requirements: ["BSN from recognized program", "BCCNM registration or eligibility", "NCLEX-RN pass"], location: "Vancouver, British Columbia", description: "A specialized pediatric and maternal health new grad program with simulation-based education and progressive clinical responsibilities.", link: "https://www.cw.bc.ca/careers" },
      { hospitalSystem: "SickKids Hospital", programName: "New Graduate Fellowship Program", programLength: "12 months", specialtyFocus: ["Pediatric ICU", "Pediatric Oncology", "Neonatal ICU", "Emergency"], applicationTimeline: "Applications open January for Spring start", requirements: ["BScN degree", "CNO registration", "Pediatric interest/experience"], location: "Toronto, Ontario", description: "A prestigious pediatric fellowship at Canada's leading children's hospital, featuring dedicated education days, advanced simulation, and specialty mentorship.", link: "https://www.sickkids.ca/careers" },
    ],
    faq: [
      { question: "Does Canada have nurse residency programs?", answer: "Canada has fewer formal \u2018residency\u2019 programs compared to the US, but many health authorities offer structured new graduate programs, extended orientations, and transition-to-practice initiatives with mentorship and supernumerary shifts." },
      { question: "What is the New Graduate Guarantee in Ontario?", answer: "Ontario's Nursing Graduate Guarantee (NGG) provides funding for hospitals to offer new graduate nurses 12 weeks of supernumerary orientation followed by employment for up to 6 months. It helps new grads gain experience while supporting hospital staffing." },
      { question: "Are new grad nursing programs in Canada paid?", answer: "Yes, new graduate nursing programs in Canada are paid positions. Graduates receive full nursing salary during their program. Some programs offer supernumerary (extra to staff) shifts during orientation, transitioning to regular staffing." },
    ],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "\ud83c\uddec\ud83c\udde7",
    description: "Explore NHS preceptorship and new graduate nursing support programmes in the UK.",
    metaTitle: "Nurse Preceptorship & New Grad Programmes in the UK \u2013 NHS Guide",
    metaDescription: "Guide to NHS preceptorship and new graduate nursing programmes in the United Kingdom. Find transition support, mentorship, and career development opportunities.",
    metaKeywords: "NHS preceptorship, new grad nursing UK, nurse preceptorship programme, nursing transition UK, newly qualified nurse UK",
    overview: "The UK's approach to supporting newly qualified nurses centers on the NHS Preceptorship Framework. All newly registered nurses are entitled to a structured preceptorship period of at least 12 months, during which they receive mentorship, protected learning time, and gradual increases in responsibility.",
    whyResidency: "NHS preceptorship ensures newly qualified nurses receive the support needed to develop confidence and competence. The framework was strengthened in 2022 with national standards for preceptorship, recognizing the importance of structured transition support.",
    programs: [
      { hospitalSystem: "NHS England", programName: "National Preceptorship Framework", programLength: "12+ months", specialtyFocus: ["All nursing fields", "Adult", "Child", "Mental Health", "Learning Disabilities"], applicationTimeline: "Available to all newly qualified nurses upon NMC registration", requirements: ["NMC registration", "Newly qualified (first year of practice)", "Employed in NHS or approved provider"], location: "England-wide", description: "A standardized national framework ensuring all newly qualified nurses receive structured preceptorship with dedicated preceptors, learning outcomes, and career development planning.", link: "https://www.england.nhs.uk/" },
      { hospitalSystem: "Guy's and St Thomas' NHS Foundation Trust", programName: "Newly Qualified Nurse Programme", programLength: "12 months", specialtyFocus: ["Critical Care", "Emergency", "Medical", "Surgical", "Outpatients"], applicationTimeline: "Cohorts start September and March", requirements: ["NMC registration", "Newly qualified", "Right to work in UK"], location: "London, England", description: "One of London's most prestigious NHS trusts offering structured preceptorship with supernumerary status in the first weeks, study days, and career pathway planning.", link: "https://www.guysandstthomas.nhs.uk/careers" },
      { hospitalSystem: "NHS Scotland", programName: "Flying Start NHS", programLength: "12 months", specialtyFocus: ["All nursing fields"], applicationTimeline: "Available upon employment in NHS Scotland", requirements: ["NMC registration", "First post as newly qualified nurse in NHS Scotland"], location: "Scotland-wide", description: "An online development programme for all newly qualified nurses in Scotland, combining e-learning modules with supervised practice and reflective activities.", link: "https://www.nes.scot.nhs.uk/" },
    ],
    faq: [
      { question: "What is NHS preceptorship?", answer: "NHS preceptorship is a structured period of transition for newly qualified nurses, lasting at least 12 months. It includes mentorship from an experienced nurse, protected learning time, reflective practice, and gradual increases in clinical responsibility." },
      { question: "Is preceptorship mandatory in the UK?", answer: "While not legally mandatory, NHS England's Preceptorship Framework sets national standards that all NHS trusts are expected to implement. The NMC strongly recommends preceptorship for all newly registered nurses." },
      { question: "How do I apply for an NHS preceptorship programme?", answer: "Preceptorship is typically part of your first nursing position in the NHS. When you apply for newly qualified nurse positions through NHS Jobs, the preceptorship programme is included. Look for roles advertised as \u2018Band 5 Newly Qualified Nurse\u2019." },
    ],
  },
];
