export interface RegulatoryBody {
  slug: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  overview: string;
  licensingAuthority: string;
  registrationRequirements: string[];
  credentialRecognition: string;
  examRequirements: string[];
  websiteUrl: string;
  sections: { title: string; content: string }[];
  faq: { question: string; answer: string }[];
}

export const REGULATORY_BODIES: RegulatoryBody[] = [
  {
    slug: "college-of-nurses-of-ontario",
    name: "College of Nurses of Ontario (CNO)",
    shortName: "CNO",
    country: "Canada",
    flag: "\ud83c\udde8\ud83c\udde6",
    description: "Ontario's nursing regulatory body governing RN, RPN, and NP registration and practice standards.",
    metaTitle: "College of Nurses of Ontario (CNO) \u2013 Registration & Licensing Guide",
    metaDescription: "Complete guide to the College of Nurses of Ontario. Learn about RN, RPN, and NP registration requirements, licensing exams, and credential recognition for Ontario nurses.",
    metaKeywords: "College of Nurses Ontario, CNO registration, Ontario nursing license, RPN registration Ontario, NCLEX Ontario, REX-PN Ontario",
    overview: "The College of Nurses of Ontario (CNO) is the regulatory body for nursing in Ontario, Canada. It registers and regulates over 200,000 nurses including Registered Nurses (RNs), Registered Practical Nurses (RPNs), and Nurse Practitioners (NPs). The CNO sets entry-to-practice requirements, practice standards, and professional conduct expectations.",
    licensingAuthority: "The CNO has authority under the Nursing Act, 1991 and the Regulated Health Professions Act, 1991 to regulate nursing practice in Ontario. It protects the public by ensuring nurses meet competency standards.",
    registrationRequirements: [
      "Graduation from an approved nursing program (BScN for RN, diploma for RPN)",
      "Successful completion of the registration exam (NCLEX-RN for RNs, REX-PN for RPNs)",
      "Evidence of language proficiency (English or French)",
      "Current criminal record check with vulnerable sector screening",
      "Jurisprudence examination",
      "Professional liability insurance (or employer coverage)",
    ],
    credentialRecognition: "Internationally Educated Nurses (IENs) must complete the CNO's IEN application process, which includes a competency assessment, possible bridging education, language proficiency testing (IELTS or CELBAN), and successful completion of the NCLEX-RN or REX-PN.",
    examRequirements: [
      "NCLEX-RN for Registered Nurses \u2013 Computer Adaptive Test with 85\u2013150 questions",
      "REX-PN for Registered Practical Nurses \u2013 Computer Adaptive Test covering five competency categories",
      "NP exams specific to NP stream (Adult, Pediatric, or Primary Health Care)",
    ],
    websiteUrl: "https://www.cno.org/",
    sections: [
      { title: "Practice Standards", content: "The CNO publishes practice standards that all Ontario nurses must follow, including standards on therapeutic nurse-client relationships, documentation, medication administration, ethics, and infection prevention. These standards are regularly updated to reflect current evidence-based practice." },
      { title: "Continuing Competence", content: "All CNO registrants must complete annual self-assessment and maintain a learning plan. The CNO conducts random practice reviews and quality assurance programs to ensure ongoing competence. Failure to meet continuing competence requirements can affect registration status." },
      { title: "International Nurse Registration", content: "Ontario actively recruits internationally educated nurses. The CNO streamlined its IEN registration process in 2023, reducing barriers while maintaining public safety standards. IENs may be eligible for supervised practice while completing registration requirements." },
    ],
    faq: [
      { question: "How do I register with the College of Nurses of Ontario?", answer: "Apply online through the CNO website. You'll need to provide proof of education, exam results (NCLEX-RN or REX-PN), language proficiency, criminal record check, and jurisprudence exam completion. Processing typically takes 4\u20138 weeks after all documents are received." },
      { question: "What exams do I need to register as an RN in Ontario?", answer: "Registered Nurses must pass the NCLEX-RN and the CNO Jurisprudence Examination. The NCLEX-RN is a computer-adaptive test covering safe and effective care, health promotion, psychosocial integrity, and physiological integrity." },
      { question: "Can I practice nursing in Ontario with a foreign degree?", answer: "Yes, internationally educated nurses can register with the CNO. You must complete the IEN application process, which may include a competency assessment, bridging education, language proficiency test (IELTS 7.0 overall or CELBAN), and the NCLEX-RN or REX-PN." },
    ],
  },
  {
    slug: "us-state-boards-of-nursing",
    name: "US State Boards of Nursing (NCSBN)",
    shortName: "NCSBN / State Boards",
    country: "United States",
    flag: "\ud83c\uddfa\ud83c\uddf8",
    description: "How US state boards regulate nursing licensure, NCLEX requirements, and the Nurse Licensure Compact.",
    metaTitle: "US State Boards of Nursing & NCSBN \u2013 Licensing & NCLEX Guide",
    metaDescription: "Guide to US State Boards of Nursing and NCSBN. Understand NCLEX requirements, nurse licensure compact, endorsement, and international nurse licensing in the United States.",
    metaKeywords: "State Board of Nursing, NCSBN, NCLEX requirements, Nurse Licensure Compact, US nursing license, nursing endorsement, international nurse USA",
    overview: "Nursing licensure in the United States is regulated at the state level through individual State Boards of Nursing. The National Council of State Boards of Nursing (NCSBN) provides national coordination, develops the NCLEX examinations, and administers the Nurse Licensure Compact (NLC). Each state sets its own specific requirements for licensure, scope of practice, and continuing education.",
    licensingAuthority: "Each of the 50 states (plus DC and US territories) has its own Board of Nursing with authority to license nurses, set practice standards, and discipline licensees. The NCSBN coordinates interstate activities and develops the NCLEX.",
    registrationRequirements: [
      "Graduation from an ACEN or CCNE-accredited nursing program",
      "Successful completion of the NCLEX-RN (for RNs) or NCLEX-PN (for LPN/LVNs)",
      "Criminal background check",
      "State-specific requirements (varies by state)",
      "Application fee (typically $75\u2013$200)",
      "Continuing education for license renewal (varies by state)",
    ],
    credentialRecognition: "Internationally educated nurses must have their credentials evaluated by CGFNS (Commission on Graduates of Foreign Nursing Schools). Requirements include a VisaScreen certificate, CGFNS exam or NCLEX pass, English proficiency (TOEFL/IELTS), and state-specific requirements.",
    examRequirements: [
      "NCLEX-RN for Registered Nurses \u2013 Computer Adaptive Test, 85\u2013150 questions, administered by Pearson VUE",
      "NCLEX-PN for Licensed Practical/Vocational Nurses \u2013 Computer Adaptive Test, 85\u2013150 questions",
      "Some states require jurisprudence exams on state-specific nursing law",
    ],
    websiteUrl: "https://www.ncsbn.org/",
    sections: [
      { title: "Nurse Licensure Compact (NLC)", content: "The NLC allows nurses with a multistate license to practice in any compact state without additional licensure. As of 2024, 41 states participate in the NLC. Nurses must meet uniform licensure requirements and maintain their license in their primary state of residence." },
      { title: "License Endorsement", content: "Nurses licensed in one state can apply for endorsement (reciprocity) in another state. Requirements vary but typically include verification of current license, background check, and state-specific continuing education. NLC members have simplified this process." },
      { title: "Scope of Practice", content: "Nursing scope of practice varies significantly by state, particularly for advanced practice registered nurses (APRNs). Some states grant full practice authority to NPs, while others require collaborative agreements with physicians. Check your state board for specific scope regulations." },
    ],
    faq: [
      { question: "How do I get a nursing license in the United States?", answer: "Complete an accredited nursing program, pass the NCLEX-RN (for RNs) or NCLEX-PN (for LPNs), complete a background check, and apply to your state's Board of Nursing. Requirements and fees vary by state." },
      { question: "What is the Nurse Licensure Compact?", answer: "The NLC allows nurses to hold one multistate license and practice in any compact state. Currently 41 states participate. You must meet uniform licensure requirements and your primary state of residence must be a compact state." },
      { question: "Can I transfer my nursing license to another state?", answer: "Yes, through a process called endorsement. If both states are NLC compact states and you hold a multistate license, you may not need a separate license. Otherwise, apply for endorsement through the new state's Board of Nursing." },
    ],
  },
  {
    slug: "nmc-uk",
    name: "Nursing and Midwifery Council (NMC) UK",
    shortName: "NMC",
    country: "United Kingdom",
    flag: "\ud83c\uddec\ud83c\udde7",
    description: "The UK's nursing regulator setting standards for education, registration, and professional conduct.",
    metaTitle: "NMC UK \u2013 Nursing & Midwifery Council Registration & Standards Guide",
    metaDescription: "Complete guide to the Nursing and Midwifery Council (NMC) UK. Learn about NMC registration, overseas nurse registration, revalidation, and professional standards.",
    metaKeywords: "NMC UK, Nursing Midwifery Council, NMC registration, overseas nurse UK, NMC revalidation, nursing regulation UK, NMC PIN",
    overview: "The Nursing and Midwifery Council (NMC) is the independent regulator for nurses and midwives in the United Kingdom. It maintains a register of over 780,000 professionals, sets standards for education and practice, and investigates fitness to practise concerns. All nurses must hold an active NMC registration (NMC PIN) to practice in the UK.",
    licensingAuthority: "The NMC has statutory authority under the Nursing and Midwifery Order 2001 to regulate nursing and midwifery across England, Scotland, Wales, and Northern Ireland.",
    registrationRequirements: [
      "Completion of an NMC-approved nursing programme (3 years BSc)",
      "Self-declaration of health and character",
      "Disclosure and Barring Service (DBS) check",
      "English language proficiency (IELTS 7.0 overall or OET B in each component)",
      "Annual registration fee (\u00a3120)",
      "Revalidation every 3 years",
    ],
    credentialRecognition: "International nurses and midwives must complete the NMC's overseas registration process: credential review, computer-based test (CBT), and Objective Structured Clinical Examination (OSCE). The process typically takes 3\u20136 months.",
    examRequirements: [
      "CBT (Computer-Based Test) \u2013 for internationally trained nurses, covering UK nursing knowledge",
      "OSCE (Objective Structured Clinical Examination) \u2013 practical assessment of clinical skills",
      "No exam required for UK-trained nurses graduating from NMC-approved programmes",
    ],
    websiteUrl: "https://www.nmc.org.uk/",
    sections: [
      { title: "Revalidation", content: "Every 3 years, NMC registrants must complete revalidation: 450 practice hours (or 900 for dual registration), 35 hours of CPD (including 20 participatory), 5 pieces of practice-related feedback, 5 written reflections, a reflective discussion with a confirmer, and health and character declarations." },
      { title: "The Code", content: "The NMC Code sets out the professional standards that nurses and midwives must follow. It covers four themes: prioritize people, practise effectively, preserve safety, and promote professionalism and trust. Breaches can lead to fitness to practise proceedings." },
      { title: "International Recruitment", content: "The UK actively recruits international nurses to address workforce shortages. The NMC has streamlined its overseas registration process, and NHS trusts run international recruitment programmes offering relocation support, OSCE preparation, and pastoral care." },
    ],
    faq: [
      { question: "How do I register with the NMC?", answer: "UK-trained nurses apply for registration after completing an NMC-approved programme. International nurses must pass the CBT and OSCE, meet English language requirements, and complete the overseas registration application. The process includes a credential review by the NMC." },
      { question: "What is NMC revalidation?", answer: "Revalidation is the process nurses must complete every 3 years to maintain NMC registration. It includes 450 practice hours, 35 hours CPD, written reflections, practice-related feedback, and a discussion with a confirmer. It replaced the previous PREP requirements." },
      { question: "How long does overseas NMC registration take?", answer: "The overseas registration process typically takes 3\u20136 months from initial application to NMC PIN issuance. This includes credential review (6\u20138 weeks), CBT exam scheduling, OSCE booking and completion, and final registration processing." },
    ],
  },
  {
    slug: "ahpra-australia",
    name: "AHPRA \u2013 Australian Health Practitioner Regulation Agency",
    shortName: "AHPRA",
    country: "Australia",
    flag: "\ud83c\udde6\ud83c\uddfa",
    description: "Australia's national nursing registration authority managing registration, standards, and credential assessment.",
    metaTitle: "AHPRA Australia \u2013 Nursing Registration & Credential Assessment Guide",
    metaDescription: "Complete guide to AHPRA nursing registration in Australia. Learn about ANMAC assessment, registration requirements, and pathways for international nurses.",
    metaKeywords: "AHPRA nursing registration, Australian nursing license, ANMAC assessment, nursing registration Australia, international nurse Australia, NMBA standards",
    overview: "The Australian Health Practitioner Regulation Agency (AHPRA) works with the Nursing and Midwifery Board of Australia (NMBA) to regulate nursing and midwifery practice nationally. AHPRA manages registration for over 450,000 nurses and midwives, sets practice standards, and manages notifications (complaints) about practitioners.",
    licensingAuthority: "AHPRA operates under the Health Practitioner Regulation National Law. The NMBA (Nursing and Midwifery Board of Australia) sets nursing standards and policies, while AHPRA handles registration processing and compliance.",
    registrationRequirements: [
      "Completion of an ANMAC-accredited nursing program",
      "English language proficiency (IELTS 7.0 in each band or OET B in each component)",
      "Criminal history check (national and international)",
      "Professional indemnity insurance arrangement",
      "Recency of practice requirements for returning nurses",
      "Annual registration renewal",
    ],
    credentialRecognition: "International nurses must apply for ANMAC (Australian Nursing and Midwifery Accreditation Council) skills assessment. This involves credential verification, English proficiency testing, and potentially completing a bridging program or Outcomes-Based Assessment (OBA) before AHPRA registration.",
    examRequirements: [
      "No national licensing exam for Australian-trained graduates (program accreditation ensures competence)",
      "ANMAC Skills Assessment for internationally qualified nurses",
      "Outcomes-Based Assessment (OBA) may be required for some international applicants",
      "NMBA-approved English language tests (IELTS Academic, OET, PTE Academic, TOEFL iBT)",
    ],
    websiteUrl: "https://www.ahpra.gov.au/",
    sections: [
      { title: "Registration Types", content: "AHPRA offers several registration types: General Registration (for qualified nurses), Provisional Registration (for new graduates awaiting results), Limited Registration (for supervised practice, teaching, or research), Non-Practising Registration (for those not currently practising), and Student Registration." },
      { title: "Practice Standards", content: "The NMBA sets national practice standards including the Registered Nurse Standards for Practice, Code of Conduct, and professional boundaries guidelines. All registered nurses must practice in accordance with these standards, which are reviewed periodically." },
      { title: "International Pathway", content: "Australia has streamlined pathways for international nurses. The Skilled Migration program includes nursing on the Priority Migration Skilled Occupation List. Many health services sponsor international nurses with relocation support and supervised practice arrangements." },
    ],
    faq: [
      { question: "How do I register as a nurse in Australia?", answer: "Australian-trained graduates apply to AHPRA directly after completing an ANMAC-accredited program. International nurses must first complete an ANMAC skills assessment, meet English language requirements, and may need to complete bridging education before AHPRA registration." },
      { question: "Is there a nursing exam in Australia?", answer: "Australia does not have a national licensing exam like the NCLEX. Program accreditation by ANMAC ensures graduate competence. International nurses undergo skills assessment through ANMAC, which may include an Outcomes-Based Assessment." },
      { question: "What English test do I need for Australian nursing registration?", answer: "AHPRA accepts IELTS Academic (7.0 in each band), OET (B in each component), PTE Academic (65 in each component), or TOEFL iBT (24 in listening, reading, writing; 20 in speaking). Results must be within 24 months." },
    ],
  },
  {
    slug: "nursing-council-new-zealand",
    name: "Nursing Council of New Zealand (NCNZ)",
    shortName: "NCNZ",
    country: "New Zealand",
    flag: "\ud83c\uddf3\ud83c\uddff",
    description: "New Zealand's nursing regulatory authority overseeing registration, competence, and professional standards.",
    metaTitle: "Nursing Council of New Zealand \u2013 Registration & Competence Guide",
    metaDescription: "Complete guide to the Nursing Council of New Zealand. Learn about RN and EN registration, competence assessment, and pathways for internationally qualified nurses.",
    metaKeywords: "Nursing Council New Zealand, NCNZ registration, nursing license New Zealand, international nurse NZ, nursing competence NZ, enrolled nurse NZ",
    overview: "The Nursing Council of New Zealand (NCNZ) is the regulatory authority for nurses in Aotearoa New Zealand. It registers approximately 60,000 nurses in two scopes of practice: Registered Nurse (RN) and Enrolled Nurse (EN). The Council sets education standards, assesses competence, and maintains the register of practising nurses.",
    licensingAuthority: "The NCNZ operates under the Health Practitioners Competence Assurance Act 2003. It has authority to set scopes of practice, prescribe qualifications, and take action on competence and conduct concerns.",
    registrationRequirements: [
      "Completion of an NCNZ-approved nursing programme",
      "NCLEX-RN pass (New Zealand adopted NCLEX in 2020)",
      "English language proficiency (IELTS 7.0 overall with 7.0 in each band)",
      "Fit and proper person declaration",
      "New Zealand police vetting",
      "Annual Practising Certificate renewal",
    ],
    credentialRecognition: "Internationally qualified nurses undergo a Competence Assessment Programme (CAP) review. NCNZ assesses qualifications, experience, and competence against New Zealand nursing standards. Applicants may be granted registration directly or required to complete a Competence Assessment Programme.",
    examRequirements: [
      "NCLEX-RN \u2013 adopted by New Zealand in 2020 as the national registration exam for RNs",
      "Competence Assessment Programme (CAP) for some international applicants",
      "No separate exam for enrolled nurses graduating from NZ programmes",
    ],
    websiteUrl: "https://www.nursingcouncil.org.nz/",
    sections: [
      { title: "Te Tiriti o Waitangi", content: "The NCNZ has a commitment to Te Tiriti o Waitangi (Treaty of Waitangi) and ensuring culturally safe nursing practice. All nurses in New Zealand must demonstrate cultural competence, with particular attention to M\u0101ori health equity and culturally safe care for M\u0101ori and Pacific peoples." },
      { title: "Competence Standards", content: "New Zealand nurses must meet competencies across four domains: professional responsibility, management of nursing care, interpersonal relationships, and interprofessional health care. These are assessed through self-review, peer review, and NCNZ audit processes." },
      { title: "International Nurse Pathway", content: "New Zealand has an Immigration Green List that includes registered nurses, facilitating permanent residency. International nurses complete NCNZ's registration process, which includes credential review, English language testing, NCLEX-RN, and potentially a Competence Assessment Programme." },
    ],
    faq: [
      { question: "Does New Zealand use the NCLEX?", answer: "Yes, New Zealand adopted the NCLEX-RN in 2020 as its national registration examination for registered nurses. This replaced the previous State Final Examination. The exam is delivered through Pearson VUE test centres in New Zealand." },
      { question: "How do I register as a nurse in New Zealand?", answer: "Complete an NCNZ-approved nursing programme, pass the NCLEX-RN, meet English language requirements (if applicable), pass police vetting, and apply to the Nursing Council. International nurses undergo additional credential assessment." },
      { question: "Can I work as a nurse in New Zealand with an overseas qualification?", answer: "Yes, internationally qualified nurses can apply for NCNZ registration. The process involves credential review, English language testing, NCLEX-RN, and potentially completing a Competence Assessment Programme. Nursing is on New Zealand's Green List for immigration." },
    ],
  },
];
