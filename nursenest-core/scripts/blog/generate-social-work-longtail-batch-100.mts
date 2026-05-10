#!/usr/bin/env npx tsx
/**
 * Deterministic 100-post social work / licensing long-tail batch for `blog-static-longtail`.
 * No external APIs. Run from `nursenest-core/`:
 *   npx tsx scripts/blog/generate-social-work-longtail-batch-100.mts
 *   npx tsx scripts/blog/generate-social-work-longtail-batch-100.mts --write-report
 *
 * Writes markdown to `src/content/blog-static-longtail/` and optional
 * `reports/social-work-longtail-batch-100.md` when `--write-report` is passed.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

const outDir = join(process.cwd(), "src", "content", "blog-static-longtail");
const reportMd = join(process.cwd(), "reports", "social-work-longtail-batch-100.md");

type TopicSpec = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Unique teaching emphasis (appears throughout body) */
  lens: string;
  /** Definitions / concepts anchor */
  definitions: string;
  /** Assessment emphasis */
  assessment: string;
  /** Communication emphasis */
  communication: string;
  /** Documentation emphasis */
  documentation: string;
  /** Ethics emphasis */
  ethics: string;
  /** Cultural safety emphasis */
  cultural: string;
  /** Crisis / escalation emphasis */
  crisis: string;
  /** Interprofessional emphasis */
  ipc: string;
  /** Exam prep emphasis */
  exam: string;
};

const CATEGORIES = [
  "Social Work Ethics",
  "Clinical Social Work",
  "Licensing Exam Prep",
  "Child and Family Practice",
  "School Social Work",
  "Healthcare Social Work",
  "Substance Use and Mental Health",
  "Macro and Community Practice",
] as const;

const REF_POOL = [
  `National Association of Social Workers. (2021). NASW code of ethics. https://www.socialworkers.org/About/Ethics/Code-of-Ethics/Code-of-Ethics-English`,
  `Council on Social Work Education. (2022). Educational policy and accreditation standards for bachelor's and master's social work programs. https://www.cswe.org/accreditation/standards/`,
  `Substance Abuse and Mental Health Services Administration. (2014). SAMHSA's concept of trauma and guidance for a trauma-informed approach (HHS Publication No. SMA 14-4884). https://store.samhsa.gov/product/SMA14-4884`,
  `Centers for Disease Control and Prevention. (2024). Adverse childhood experiences (ACEs): Preventing early trauma to improve adult health and wellbeing. https://www.cdc.gov/violenceprevention/aces/index.html`,
  `World Health Organization. (2023). WHO mental health, brain health, and substance use knowledge portal (mhGAP programme materials index). https://www.who.int/teams/mental-health-and-substance-use/treatment-care`,
  `American Psychological Association. (2023). Ethical principles of psychologists and code of conduct. https://www.apa.org/ethics/code`,
  `Association of Social Work Boards. (2024). Social work licensing examinations: Content outlines and candidate guides. https://www.aswb.org/exam/about-exams/`,
  `U.S. Department of Health and Human Services. (2022). HIPAA privacy rule summary (Office for Civil Rights guidance). https://www.hhs.gov/hipaa/for-professionals/privacy/index.html`,
  `National Child Traumatic Stress Network. (2017). Core concepts in trauma-informed care for child-serving settings (NCTSN product suite; updated dissemination through 2024). https://www.nctsn.org/`,
  `National Association of Social Workers. (2023). Standards for social work practice with service members, veterans, and their families. https://www.socialworkers.org/Practice/Military`,
  `Centers for Medicare & Medicaid Services. (2024). Medicare learning network: General billing and documentation educational resources. https://www.cms.gov/outreach-education/medicare-learning-network`,
  `Child Welfare Information Gateway. (2023). Mandatory reporters of child abuse and neglect (State statutes series). https://www.childwelfare.gov/topics/responding/mandated/`,
];

function h(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugifyPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** 20 anchor topics (explicit slugs + rich lenses). */
const ANCHORS: TopicSpec[] = [
  {
    slug: "social-work-nasw-code-of-ethics-aswb-style-application",
    title: "NASW Code of Ethics: ASWB-Style Application for Social Work Students",
    excerpt:
      "Translate NASW ethical standards into exam-style vignettes about competence, integrity, dignity, privacy, conflicts of interest, and professional responsibility.",
    category: "Social Work Ethics",
    tags: ["NASW", "Ethics", "ASWB", "BSW", "MSW", "Licensure"],
    lens: "Ethical social work practice is not a slogan set; it is a decision procedure you can defend under pressure.",
    definitions:
      "The NASW Code of Ethics organizes obligations around core values: service, social justice, dignity and worth of the person, importance of human relationships, integrity, and competence. For exam preparation, treat each standard as a question: Who is vulnerable here? What duty is activated? What information is protected? What boundary is at risk? What documentation would demonstrate prudence?",
    assessment:
      "Assessment for ethics items begins with roles and relationships: who is the client, who is collateral, and whether multiple stakeholders create divided loyalties. Identify consent processes, capacity concerns, language access, power differences, and whether the scenario describes a potential conflict of interest or exploitation risk.",
    communication:
      "Trauma-informed communication in ethics scenarios often means transparent, non-coercive language about limits of confidentiality, mandatory reporting triggers, and what you can and cannot promise. Avoid absolute guarantees; describe processes, timelines, and next steps.",
    documentation:
      "Defensible ethics documentation names the dilemma, the applicable standards, consultation obtained, supervisor direction, and the client-centered rationale for the chosen course. Exams reward clarity about consent, boundaries, and scope—not heroic improvisation.",
    ethics:
      "When obligations collide (safety vs confidentiality; employer pressure vs client welfare), exams typically reward the path that protects life, prevents serious harm, follows law where clearly stated, seeks supervision, and minimizes unnecessary disclosure.",
    cultural:
      "Cultural humility requires lifelong self-reflection, institutional accountability, and repair when harm occurs. Equity considerations include who is labeled 'difficult,' who receives fewer resources, and whether policies neutralize disadvantage or reproduce it.",
    crisis:
      "Ethics under acute stress still requires proportionate action: escalate credible safety threats, involve emergency services when indicated, and avoid abandoning clients without reasonable continuity plans when possible.",
    ipc:
      "Interprofessional ethics includes respectful collaboration, clarifying scope across disciplines, and avoiding triangulation when agencies disagree. Social workers often coordinate care; exams test whether you keep the client at the center.",
    exam:
      "ASWB-style ethics stems often hide the real issue in the second paragraph. Re-read for consent, coercion, confidentiality exceptions, documentation gaps, and whether the social worker is being asked to operate outside competence.",
  },
  {
    slug: "social-work-dual-relationships-and-boundaries-field-placement",
    title: "Dual Relationships and Boundaries in Field Placement: Social Work Exam Prep",
    excerpt:
      "Understand boundary crossings versus boundary violations, power differentials in supervision, and how field education policies intersect with ethical standards.",
    category: "Social Work Ethics",
    tags: ["Boundaries", "Field education", "Supervision", "MSW", "Ethics"],
    lens: "Field education amplifies power differences; small boundary shifts can become exploitative patterns.",
    definitions:
      "A dual relationship exists when a social worker relates to a client in more than one role. Not every dual relationship is automatically unethical, but overlapping roles increase risk and require heightened scrutiny, informed consent where appropriate, and often avoidance when harm risk is high.",
    assessment:
      "Assess whether the secondary relationship could impair objectivity, exploit vulnerability, or confuse the supervisee about evaluation. Notice gifts, social invitations, private messaging, favors, and requests that blur evaluation.",
    communication:
      "Use transparent policies: name expectations early, repeat them when ambiguity appears, and document supervisory decisions that address boundary concerns without shaming.",
    documentation:
      "Document supervisory conversations about boundaries, corrective plans, and follow-up. Educational programs often require learning contracts; exams may test whether you align practice with both NASW and program policy.",
    ethics:
      "Prefer avoidance when a relationship could reasonably interfere with impartial judgment or create exploitation risk. Seek field liaison guidance rather than improvising exceptions.",
    cultural:
      "Cultural norms about reciprocity and gift-giving differ; ethical practice still protects clients and students from coercion. Offer culturally respectful alternatives that do not compromise evaluation integrity.",
    crisis:
      "If boundary issues intersect with harassment, discrimination, or client harm allegations, prioritize safety, mandated processes, and institutional reporting routes while protecting privacy to the extent possible.",
    ipc:
      "Coordinate with field instructors and liaisons; social work students are learners, not independent clinicians. Interprofessional respect includes not undermining nursing or medical teams while advocating for psychosocial needs.",
    exam:
      "Trap answers romanticize 'being human' with clients in ways that erase power. Choose options that protect the professional relationship and seek structured resolution.",
  },
  {
    slug: "social-work-confidentiality-exceptions-informed-consent-basics",
    title: "Confidentiality, Exceptions, and Informed Consent in Social Work Practice",
    excerpt:
      "Learn how informed consent, privacy, and legal exceptions interact for BSW and MSW learners preparing for ethics-heavy exam items.",
    category: "Clinical Social Work",
    tags: ["Confidentiality", "Consent", "Privacy", "Ethics", "HIPAA"],
    lens: "Confidentiality is a default that bends only under specific, often legally defined, conditions.",
    definitions:
      "Informed consent includes disclosure of purpose, risks, benefits, alternatives, limits of confidentiality, and the right to withdraw. Privacy refers to controlling information access; confidentiality is the professional duty to protect disclosed information within agreed limits.",
    assessment:
      "Identify what the client was told at intake, whether limits were re-explained as risk changed, and whether minors or legally authorized representatives affect consent pathways.",
    communication:
      "Use plain language, teach-back for understanding, and written materials when appropriate. Re-consent when the treatment frame shifts (e.g., adding telehealth, group components, or information sharing).",
    documentation:
      "Document consent discussions, exceptions applied, who received what information, and the clinical rationale. Exams often punish vague 'client agreed' notes without substance.",
    ethics:
      "When laws mandate disclosure (certain abuse reports, court orders, imminent harm), ethical practice still aims to share the minimum necessary information and inform clients when safe and legally permitted.",
    cultural:
      "Family-centered decision norms may differ from individualistic consent models; still protect autonomy, safety, and legally required actions without stereotyping cultures.",
    crisis:
      "Imminent harm scenarios prioritize safety interventions, containment, and lawful disclosures. Pair urgency with least restrictive options and follow-up planning.",
    ipc:
      "Healthcare teams may assume HIPAA-aligned minimum necessary sharing; social workers should clarify role, consent, and whether psychosocial information is appropriate to exchange.",
    exam:
      "If a stem mentions a subpoena, distinguish therapy notes from factual records when testing knowledge boundaries—follow what the item explicitly states and local law framing provided.",
  },
  {
    slug: "social-work-informed-consent-capacity-and-supported-decision-making",
    title: "Informed Consent, Capacity, and Supported Decision-Making in Social Work",
    excerpt:
      "Study capacity assessment as an educational construct, supported decision-making ethics, and how exam items test respect for autonomy.",
    category: "Clinical Social Work",
    tags: ["Consent", "Capacity", "Autonomy", "Ethics", "Disability justice"],
    lens: "Capacity is decision-specific; supported decision-making expands autonomy rather than replacing it by default.",
    definitions:
      "Capacity generally refers to the ability to understand relevant information, appreciate consequences, reason, and communicate a choice. Supported decision-making uses trusted supporters and accommodations rather than assuming guardianship is always necessary.",
    assessment:
      "Screen for sensory barriers, language barriers, acute medical issues, psychiatric symptoms, and coercion from caregivers. Document what was tried to support understanding.",
    communication:
      "Slow down, chunk information, offer breaks, use interpreters (qualified), and avoid ableist assumptions. Trauma-informed pacing reduces shame and improves comprehension.",
    documentation:
      "Record who was present, what was explained, alternatives discussed, and the client's expressed wishes. When capacity is uncertain, document consultation and supervision.",
    ethics:
      "Beneficence and autonomy can conflict; exams reward least restrictive approaches, respect for client values, and lawful escalation when self-determination risks imminent serious harm.",
    cultural:
      "Avoid imposing Western individualism as the only 'ethical' model; still protect individuals from exploitation within collectivist contexts when power is unequal.",
    crisis:
      "If a client cannot safely remain in the community without imminent harm, exam answers may include crisis services, psychiatric evaluation when ordered, and lawful protective steps—not informal coercion.",
    ipc:
      "Physicians assess medical decision-making capacity at times; social workers contribute psychosocial formulation, environmental supports, and safety planning within scope.",
    exam:
      "Watch for stems that confuse disagreement with incapacity. Ethical answers preserve dignity while mobilizing safety resources.",
  },
  {
    slug: "social-work-cultural-humility-versus-competence-exam-distinctions",
    title: "Cultural Humility Versus Cultural Competence: Exam-Ready Distinctions",
    excerpt:
      "Clarify what exam writers mean by humility, competence, intersectionality, and anti-oppressive practice without reducing culture to stereotypes.",
    category: "Macro and Community Practice",
    tags: ["Cultural humility", "Equity", "Anti-oppression", "ASWB", "MSW"],
    lens: "Competence is cumulative learning; humility is ongoing stance—exams may reward both together rather than false binaries.",
    definitions:
      "Cultural competence often refers to knowledge and skills to serve diverse populations. Cultural humility emphasizes lifelong learning, institutional accountability, and power-aware curiosity rather than claiming mastery over another's culture.",
    assessment:
      "Assess your own positionality, power, language access, historical mistrust of systems, and structural barriers (housing, transportation, insurance) as part of client presentation—not as afterthoughts.",
    communication:
      "Ask what clients need to feel respected, offer choices, apologize when harm occurs, and avoid extracting emotional labor to educate you about basics you can study independently.",
    documentation:
      "Document culturally relevant strengths and protective factors without exoticizing or stigmatizing. Use client language when appropriate and objective behavioral descriptors.",
    ethics:
      "Ethical practice refuses discrimination, harassment, and microaggressions. When personal bias is activated, seek supervision and corrective learning.",
    cultural:
      "Center equity: examine policies for disparate impact, advocate for language access, and partner with community organizations led by impacted people.",
    crisis:
      "Hate-based violence, immigration enforcement fears, and community trauma may require trauma-informed crisis approaches coordinated with trusted community supports.",
    ipc:
      "Interprofessional humility includes respecting community health workers, peer specialists, and faith leaders as partners, not subordinates.",
    exam:
      "Reject answers that stereotype cultures as monolithic or blame clients for structural problems.",
  },
  {
    slug: "social-work-trauma-informed-care-principles-bsw-msw-review",
    title: "Trauma-Informed Care Principles: BSW and MSW Licensing Review",
    excerpt:
      "Review safety, trustworthiness, choice, collaboration, and empowerment as operational behaviors—not buzzwords—for exam vignettes.",
    category: "Substance Use and Mental Health",
    tags: ["Trauma-informed", "Safety", "Collaboration", "Mental health", "ASWB"],
    lens: "Trauma-informed care changes how you structure engagement, pacing, and environment before it changes techniques.",
    definitions:
      "Trauma-informed systems recognize prevalence of trauma, resist re-traumatization, integrate knowledge into policies, and promote recovery. Principles include safety; trustworthiness and transparency; peer support; collaboration; empowerment; voice; and choice; and cultural, historical, and gender issues (SAMHSA framework variants appear in training literature).",
    assessment:
      "Assess triggers, sensory sensitivities, hypervigilance, dissociation, shame, and whether the environment (lighting, noise, privacy) supports engagement.",
    communication:
      "Offer choices, explain steps, ask permission before touch or recording, and avoid interrogative interviewing when narrative is not clinically necessary.",
    documentation:
      "Avoid gratuitous trauma detail; document enough for continuity and safety without turning the record into unnecessary trauma exposure for the client later.",
    ethics:
      "Do not exploit trauma narratives for training without consent; protect confidentiality especially in small communities.",
    cultural:
      "Historical trauma and systemic oppression shape help-seeking; validate barriers and co-create realistic plans.",
    crisis:
      "Trauma-informed crisis work reduces restraint/coercion when alternatives exist; prioritize de-escalation and least restrictive care within law and policy.",
    ipc:
      "Coordinate with medical, educational, and legal partners using shared safety language without blaming the client.",
    exam:
      "Trap answers rush disclosure or ignore sensory triggers. Choose gradual, consent-based engagement.",
  },
  {
    slug: "social-work-suicide-risk-screening-tic-toc-and-escalation-basics",
    title: "Suicide Risk Screening: TIC-TOC Documentation Basics for Social Work Exams",
    excerpt:
      "Educational overview of screening tools as adjuncts to clinical judgment, escalation pathways, and what exam items test about safety planning.",
    category: "Clinical Social Work",
    tags: ["Suicide", "Safety", "Screening", "Crisis", "ASWB"],
    lens: "Screening tools support, not replace, clinical judgment and context.",
    definitions:
      "Screening identifies risk that warrants further assessment. TIC-TOC style prompts (thoughts, intent, context, timeline, others, coping) help organize a structured inquiry without turning the encounter into a checklist that ignores rapport.",
    assessment:
      "Assess static and dynamic risk factors, protective factors, means access, substance use, impulsivity, recent loss, and social isolation. Identify immediate environment safety.",
    communication:
      "Use direct, respectful questions about suicidal thoughts; normalize help-seeking; avoid panic tone that increases shame.",
    documentation:
      "Document questions asked, responses, collaborative plan, referrals, and follow-up responsibilities. Note who was notified and why if exceptions apply.",
    ethics:
      "Confidentiality may yield to imminent harm prevention; still share minimum necessary information and involve clients in planning when safe.",
    cultural:
      "Stigma varies; some communities distrust hospitals. Offer options where possible while not minimizing acute risk.",
    crisis:
      "Escalate to crisis lines, mobile teams, or emergency departments when indicated by policy and risk; stay with coordinated handoffs when the scenario requires continuity.",
    ipc:
      "Nurses and physicians manage medical stabilization; social workers contribute psychosocial assessment, collateral, and discharge safety planning.",
    exam:
      "First actions usually address immediate safety and environment, not long-term therapy selection, when acute risk is present.",
  },
  {
    slug: "social-work-intimate-partner-violence-safety-planning-considerations",
    title: "Intimate Partner Violence: Safety Planning Considerations for Social Workers",
    excerpt:
      "Educational framing of lethality factors, documentation cautions, and trauma-informed choices without prescribing jurisdiction-specific legal steps.",
    category: "Child and Family Practice",
    tags: ["IPV", "Safety planning", "Trauma", "Advocacy", "Ethics"],
    lens: "Safety planning is iterative, client-led, and sensitive to surveillance and retaliation.",
    definitions:
      "IPV includes physical, sexual, psychological, and economic coercion. Lethality factors may include strangulation, escalating violence, threats with weapons, obsessive jealousy, separation timing, and stalking—always interpret within local training and forensic standards.",
    assessment:
      "Assess immediate danger, children's exposure, immigration-related coercion, financial control, and whether documentation could be discovered by a perpetrator.",
    communication:
      "Use private channels, code words if agreed, and avoid blaming questions ('Why don't you leave?'). Center autonomy and realistic options.",
    documentation:
      "Some programs use separate secure notes for IPV; follow employer policy. Avoid documenting sensitive shelter details that could endanger clients if records are subpoenaed—follow training.",
    ethics:
      "Mandatory reporting of child abuse may intersect with IPV; navigate with supervision and clear legal guidance when the stem provides it.",
    cultural:
      "Faith, family, and economic realities shape decisions; support culturally congruent safety strategies that do not compromise dignity.",
    crisis:
      "If imminent assault is described, emergency services may be indicated; exam answers align with immediate safety over philosophical debates.",
    ipc:
      "Coordinate with advocates, law enforcement when appropriate, healthcare for injury documentation, and schools for child safety plans.",
    exam:
      "Avoid answers that pressure clients to leave immediately without safety planning unless the scenario indicates imminent harm requiring emergency intervention.",
  },
  {
    slug: "social-work-child-maltreatment-mandated-reporting-educational-overview",
    title: "Child Maltreatment and Mandated Reporting: Educational Overview for Social Work Students",
    excerpt:
      "Clarify what exams tend to test about duty to report, documentation, and collaboration—always defer to assigned statutes and agency training in practice.",
    category: "Child and Family Practice",
    tags: ["Child welfare", "Mandatory reporting", "Ethics", "Law", "BSW"],
    lens: "Reporting laws are state-specific; exam items usually embed the controlling rule in the stem or assume generic 'follow policy/law.'",
    definitions:
      "Mandated reporting laws require identified professionals to report suspected abuse or neglect to designated authorities. 'Reasonable suspicion' training language differs by jurisdiction; exams reward timely, accurate reports through proper channels—not investigations by students alone.",
    assessment:
      "Document observable concerns, disclosures, patterns, and safety. Avoid leading questions in forensic contexts unless your role is clearly clinical and appropriate.",
    communication:
      "Explain reporting duties at intake when required; re-explain if new risk emerges. Prepare clients for what happens next at a high level without making legal promises.",
    documentation:
      "Record facts, dates, quotes when appropriate, and consultation. Separate clinical impressions from investigative conclusions outside your role.",
    ethics:
      "Confidentiality yields to child protection mandates when thresholds are met; still minimize unnecessary detail in communications.",
    cultural:
      "Bias in reporting systems is a documented equity issue; ethical practitioners reflect on disproportionality and advocate for fair processes.",
    crisis:
      "Imminent danger to a child requires urgent pathways; do not delay for nonessential meetings when the stem indicates acute harm.",
    ipc:
      "Schools, clinics, and CPS collaborate under defined roles; social workers coordinate information sharing within law and policy.",
    exam:
      "Choose report through proper channels over 'handle quietly' or 'investigate alone.'",
  },
  {
    slug: "social-work-motivational-interviewing-basics-substance-use-settings",
    title: "Motivational Interviewing Basics in Substance Use Settings: Social Work Review",
    excerpt:
      "Review OARS, change talk, discord, and how exam items test collaborative engagement rather than confrontation.",
    category: "Substance Use and Mental Health",
    tags: ["MI", "SUD", "Engagement", "Harm reduction", "ASWB"],
    lens: "MI is a collaborative style, not a single-session trick.",
    definitions:
      "Motivational interviewing emphasizes partnership, acceptance, compassion, and evocation. OARS (open questions, affirmations, reflections, summaries) builds rapport and elicits change talk.",
    assessment:
      "Assess stage of change, co-occurring conditions, withdrawal risk, pregnancy, housing instability, and trauma history that affects engagement.",
    communication:
      "Reflect discord without arguing; support autonomy; explore ambivalence; avoid shaming labels.",
    documentation:
      "Document goals discussed, risks, referrals, and safety issues. Note capacity for outpatient care when relevant to level-of-care conversations led by licensed clinicians.",
    ethics:
      "Do not promise confidentiality you cannot keep; be clear about reporting duties and limits.",
    cultural:
      "Recognize historical harms from systems; build trust slowly and partner with community supports.",
    crisis:
      "Intoxication, agitation, or medical instability may require medical clearance before counseling-focused work; exams reward safety sequencing.",
    ipc:
      "Coordinate with prescribers, peer specialists, and case managers for integrated care plans.",
    exam:
      "Reject confrontational 'tough love' answers when collaboration options exist.",
  },
  {
    slug: "social-work-progress-notes-soap-dap-and-defensible-documentation",
    title: "Progress Notes for Social Workers: SOAP, DAP, and Defensible Documentation",
    excerpt:
      "Understand what belongs in a note, common liability pitfalls, and how documentation supports continuity, billing education, and supervision.",
    category: "Clinical Social Work",
    tags: ["Documentation", "SOAP", "Risk management", "MSW", "Supervision"],
    lens: "Notes should be factual, relevant, and respectful—future you, auditors, and clients' legal teams may read them.",
    definitions:
      "SOAP organizes subjective, objective, assessment, and plan. DAP organizes data, assessment, and plan. Both are frameworks, not substitutes for clinical judgment or payer rules.",
    assessment:
      "Record what you observed, what the client reported, risk updates, interventions used, client response, and next steps.",
    communication:
      "If clients request records, follow HIPAA and agency processes; explain professional language when possible.",
    documentation:
      "Avoid copy-forward errors, speculative diagnoses outside scope, judgmental adjectives, and unencrypted risky detail in unsecured channels.",
    ethics:
      "Do not fabricate encounters; correct errors according to policy; timestamp addenda appropriately.",
    cultural:
      "Avoid stigmatizing language; describe behaviors and functional impacts rather than blame.",
    crisis:
      "Document safety assessments and follow-through clearly after crises; vague notes create downstream risk.",
    ipc:
      "Align notes with team plans without contradicting medical orders; clarify role.",
    exam:
      "Choose notes that reflect scope, facts, and plan—not therapist gossip or unverified third-party rumors as fact.",
  },
  {
    slug: "social-work-countertransference-recognition-and-supervision-contracts",
    title: "Countertransference Recognition and Supervision Contracts in Clinical Social Work",
    excerpt:
      "Prepare for exam and field scenarios about emotional responses, parallel process, and ethical use of supervision.",
    category: "Clinical Social Work",
    tags: ["Countertransference", "Supervision", "Ethics", "Self-care", "MSW"],
    lens: "Countertransference is data about the work and your humanity—handled ethically through supervision and boundaries.",
    definitions:
      "Countertransference broadly refers to the clinician's emotional reactions to the client or material. It becomes an ethics issue when it drives favoritism, punishment, boundary violations, or impaired judgment.",
    assessment:
      "Notice sleep changes, avoidance, over-involvement, rescuing urges, irritation, or romantic feelings. Use structured supervision prompts.",
    communication:
      "Repair ruptures authentically without over-disclosing personal life; model accountability.",
    documentation:
      "Personal supervision notes differ from client records; follow agency policy about what belongs where.",
    ethics:
      "Seek consultation when personal history interferes with impartiality; reassign cases when necessary per policy.",
    cultural:
      "Power dynamics may mirror historical oppression; humility and consultation reduce harm risk.",
    crisis:
      "If countertransference leads to boundary risk, escalate to supervisor immediately and implement safety plans for clients.",
    ipc:
      "Discuss team dynamics openly in appropriate forums without client-identifying gossip.",
    exam:
      "Choose supervision/consultation over solo decisions when stems highlight strong emotional pulls.",
  },
  {
    slug: "social-work-clinical-supervision-models-and-ethical-learning-contracts",
    title: "Clinical Supervision Models and Ethical Learning Contracts in Social Work",
    excerpt:
      "Compare educative, supportive, and administrative supervision functions and what exams test about supervisee safety.",
    category: "Licensing Exam Prep",
    tags: ["Supervision", "Education", "Ethics", "LCSW", "MSW"],
    lens: "Supervision exists to protect clients, support learning, and uphold standards—simultaneously.",
    definitions:
      "Administrative supervision addresses policy compliance; educative supervision teaches practice; supportive supervision addresses emotional impact of practice.",
    assessment:
      "Assess supervisee competence, caseload acuity, learning needs, and wellness risk.",
    communication:
      "Give specific behavioral feedback; co-create learning goals; document agreements.",
    documentation:
      "Maintain supervision logs per policy; separate evaluative documentation from raw clinical detail when appropriate.",
    ethics:
      "Supervisors must not exploit supervisees; dual relationships in supervision are high-risk.",
    cultural:
      "Attend to how evaluation bias may affect BIPOC supervisees; use rubrics and transparent criteria.",
    crisis:
      "If supervisee is unsafe to practice, escalate per policy while minimizing public shaming and protecting clients.",
    ipc:
      "Supervisors liaise with field agencies and training directors for coherent feedback.",
    exam:
      "Choose supervisor oversight over silent tolerance when errors or boundary risks appear.",
  },
  {
    slug: "social-work-aswb-exam-blueprint-study-map-for-masters-candidates",
    title: "ASWB Exam Blueprint Study Map for Masters-Level Social Work Candidates",
    excerpt:
      "Translate content outline domains into a study plan with ethics weighting, knowledge vs application items, and self-assessment loops.",
    category: "Licensing Exam Prep",
    tags: ["ASWB", "LMSW", "LCSW", "Study skills", "Test anxiety"],
    lens: "The exam rewards professional judgment applied to vignettes, not trivia alone.",
    definitions:
      "The ASWB exam measures whether candidates can apply knowledge, skills, and abilities across domains such as ethics, assessment, intervention, human development, and professional relationships (per published outlines).",
    assessment:
      "Use practice tests to identify weak domains and misread patterns (e.g., rushing, ignoring 'first step' wording).",
    communication:
      "Join study groups with clear norms: no sharing secured item content; focus on concept teaching.",
    documentation:
      "Track missed rationales in a learning journal to convert errors into rules.",
    ethics:
      "Never seek or use live exam items; integrity protects the profession and your license path.",
    cultural:
      "Choose study materials that include diverse vignettes; critique biased items through supervision discussion.",
    crisis:
      "If severe test anxiety or suicidality emerges, seek counseling—exams are not worth life risk.",
    ipc:
      "Study interprofessional scenarios to learn role boundaries and collaboration language.",
    exam:
      "Practice identifying the question type: recall vs application vs first-priority vs 'most ethical.'",
  },
  {
    slug: "social-work-elder-abuse-and-mandated-reporting-risk-factors-review",
    title: "Elder Abuse and Mandated Reporting: Risk Factors and Social Work Review",
    excerpt:
      "Educational overview of types of elder mistreatment, isolation risk, and multidisciplinary responses—defer to local statutes in practice.",
    category: "Healthcare Social Work",
    tags: ["Aging", "Elder abuse", "Mandatory reporting", "Safety", "ASWB"],
    lens: "Elder mistreatment often hides behind shame, cognitive change, and caregiver burnout—assessment must be nuanced.",
    definitions:
      "Elder abuse may include physical, sexual, emotional, or financial abuse, neglect, and abandonment. Capacity and undue influence complicate financial exploitation cases.",
    assessment:
      "Screen for isolation, caregiver stress, inconsistent explanations of injuries, medication withholding, and signatures that may indicate undue influence.",
    communication:
      "Interview separately when safe and policy-consistent; use gentle, respectful curiosity.",
    documentation:
      "Record objective findings and statements; follow mandated reporting procedures when thresholds met.",
    ethics:
      "Balance autonomy with protection; least restrictive interventions are preferred when risk is not imminent.",
    cultural:
      "Multigenerational households may normalize caregiving patterns; distinguish cultural difference from abuse using evidence-based assessment training.",
    crisis:
      "Immediate danger may require law enforcement and adult protective services pathways concurrently.",
    ipc:
      "Partner with primary care, APS, legal aid, and financial institutions within role boundaries.",
    exam:
      "Do not promise to keep secrets when reporting duties apply—choose lawful, protective steps.",
  },
  {
    slug: "social-work-school-threat-assessment-teams-psychosocial-contributions",
    title: "School Threat Assessment Teams: Psychosocial Contributions of Social Workers",
    excerpt:
      "Clarify how social workers support multidisciplinary threat assessment with developmental, trauma, and equity lenses—educational, not tactical security advice.",
    category: "School Social Work",
    tags: ["Schools", "Safety", "Teams", "Adolescents", "ASWB"],
    lens: "Social workers bring context: bullying, identity-based harassment, home stressors, disabilities, and unmet needs.",
    definitions:
      "Threat assessment frameworks (e.g., NTAC guidance used in many districts) distinguish transient threats from substantive threats; social workers contribute psychosocial data and intervention planning.",
    assessment:
      "Assess hopelessness, prior victimization, access to means, leakage behaviors, and protective adult relationships.",
    communication:
      "Use non-punitive engagement when possible to reduce shame while maintaining safety accountability.",
    documentation:
      "Document team decisions, follow-up plans, and services offered; avoid speculative labeling as 'dangerous' without process.",
    ethics:
      "Avoid racial profiling; equity monitoring is part of ethical threat assessment implementation.",
    cultural:
      "Recognize disproportionate discipline histories; advocate for supportive rather than purely punitive pathways when safety allows.",
    crisis:
      "Imminent credible threats require immediate safety protocols and law enforcement coordination per policy.",
    ipc:
      "Coordinate with administrators, counselors, SRO policies (where present), and community mental health.",
    exam:
      "Choose multidisciplinary, structured assessment over solo heroics or ignoring context.",
  },
  {
    slug: "social-work-anti-oppressive-practice-and-institutional-accountability-basics",
    title: "Anti-Oppressive Practice and Institutional Accountability: Basics for Social Work Students",
    excerpt:
      "Define anti-oppressive practice, structural competence, and how exams connect ethics to policy and agency behavior.",
    category: "Macro and Community Practice",
    tags: ["Anti-oppression", "Equity", "Policy", "Ethics", "MSW"],
    lens: "Anti-oppressive practice names power and changes practice and systems—not only 'treating symptoms.'",
    definitions:
      "Anti-oppressive practice examines how racism, sexism, classism, ableism, homophobia, transphobia, and other oppressions operate in clients' lives and in institutions—including our own agencies.",
    assessment:
      "Assess structural barriers: housing, criminal legal contact, insurance gaps, transportation, digital divides, and workplace discrimination.",
    communication:
      "Center client agency; avoid savior narratives; co-design advocacy steps when requested.",
    documentation:
      "Document advocacy efforts and systemic barriers factually to support case formulations and program improvement.",
    ethics:
      "Challenge discriminatory policies through proper channels; protect clients from retaliation when advocating.",
    cultural:
      "Pay attention to intersectionality; avoid single-axis thinking.",
    crisis:
      "Community violence and hate incidents may require trauma-informed group responses and safety planning at scale.",
    ipc:
      "Build coalitions with public health, legal aid, and grassroots groups with clear memoranda of understanding.",
    exam:
      "Choose answers that reduce harm and increase equity rather than blaming individuals for structural problems.",
  },
  {
    slug: "social-work-collaboration-between-cps-schools-and-behavioral-health",
    title: "Collaboration Among CPS, Schools, and Behavioral Health: Social Work Exam Themes",
    excerpt:
      "Study information sharing limits, consent, student privacy, and coordinated safety planning as exam vignettes.",
    category: "School Social Work",
    tags: ["Child welfare", "Schools", "Collaboration", "Privacy", "ASWB"],
    lens: "Collaboration fails when roles, consent, and FERPA/HIPAA boundaries are unclear.",
    definitions:
      "Schools operate under FERPA; healthcare entities under HIPAA; child welfare under state statutes. Social workers must know which hat they wear in each encounter.",
    assessment:
      "Clarify who holds consent, what can be shared for safety, and what requires additional releases.",
    communication:
      "Use plain language with families; avoid jargon that obscures rights and options.",
    documentation:
      "Document releases, disclosures, and rationales for sharing minimum necessary information.",
    ethics:
      "Do not share more than necessary even when well-intentioned; document exceptions carefully.",
    cultural:
      "Families may fear systems; build trust through consistency, transparency, and culturally responsive engagement.",
    crisis:
      "Acute child safety concerns may override typical consent expectations—follow the stem's legal framing.",
    ipc:
      "Facilitate meetings that keep child wellbeing central and reduce contradictory messages across providers.",
    exam:
      "Pick lawful information sharing pathways over informal texting of sensitive details.",
  },
  {
    slug: "social-work-healthcare-navigation-ethics-consent-and-discharge-planning",
    title: "Healthcare Navigation Ethics: Consent, Capacity, and Discharge Planning for Social Workers",
    excerpt:
      "Prepare for vignettes about unsafe discharges, medication access, homelessness, and interprofessional disagreements.",
    category: "Healthcare Social Work",
    tags: ["Hospital", "Discharge", "Ethics", "Navigation", "ASWB"],
    lens: "Discharge planning is where social determinants of health become acute ethical pressures.",
    definitions:
      "Discharge planning aims for safe transitions with appropriate supports. Ethical tensions arise when resources are scarce, capacity is uncertain, or family refuses recommended placements.",
    assessment:
      "Assess housing, caregiver availability, insurance, transportation, medication affordability, follow-up access, and abuse or neglect risk at home.",
    communication:
      "Use motivational interviewing to explore resistance; provide options; avoid coercive 'sign and leave' tactics.",
    documentation:
      "Document education, risks explained, capacity assessment involvement, and referrals attempted.",
    ethics:
      "Advocate for safe alternatives; escalate ethically through channels when unsafe discharge is likely.",
    cultural:
      "Recognize medical mistrust; offer culturally congruent supports and interpreters.",
    crisis:
      "Homelessness or IPV may require creative safety planning and shelter referrals.",
    ipc:
      "Mediate between medical teams and families with clarity about risks and limits.",
    exam:
      "Choose advocacy + escalation + documentation over silent acceptance of unsafe plans.",
  },
  {
    slug: "social-work-boundary-crossings-versus-violations-ethical-decision-trees",
    title: "Boundary Crossings Versus Violations: Ethical Decision Trees for Social Workers",
    excerpt:
      "Learn how exams distinguish culturally responsive flexibility from exploitative boundary erosion.",
    category: "Social Work Ethics",
    tags: ["Boundaries", "Ethics", "Dual relationships", "ASWB", "MSW"],
    lens: "A crossing may be ethically neutral or positive in rare contexts; a violation exploits or harms.",
    definitions:
      "Boundary crossings are departures from typical clinical boundaries that may be benign, helpful, or harmful depending on intent, power, transparency, and client welfare. Violations exploit clients or meet clinician needs.",
    assessment:
      "Assess power differential, vulnerability, transparency, reversibility, and whether the action primarily benefits the client or the clinician.",
    communication:
      "If a crossing is considered (e.g., attending a client's art show in some rare models), use supervision, informed consent, and policy alignment—most exam answers favor caution.",
    documentation:
      "Document rationale for unusual decisions with supervisor approval recorded.",
    ethics:
      "Sexual and financial relationships with current clients are virtually always prohibited; exams treat them as clear violations.",
    cultural:
      "Do not confuse cultural flexibility with sexual or financial exploitation.",
    crisis:
      "During disasters, some boundaries flex; still maintain confidentiality and role clarity as much as feasible.",
    ipc:
      "Maintain professional boundaries with collaterals who may pressure you for unauthorized information.",
    exam:
      "Reject grooming-adjacent answers (secret contact, private social media friendships) as unethical.",
  },
];

const PRACTICE = [
  "school social work",
  "healthcare social work",
  "child welfare settings",
  "community mental health",
  "substance use treatment",
  "integrated primary care",
  "hospital discharge planning",
  "aging services",
  "crisis response teams",
  "veteran services",
] as const;

const THEME = [
  "mandated reporting considerations",
  "confidentiality and information-sharing boundaries",
  "suicide risk screening and escalation",
  "intimate partner violence safety planning",
  "trauma-informed engagement skills",
  "documentation and defensible progress notes",
  "cultural humility and equity in assessment",
  "interprofessional collaboration and role clarity",
  "supervision ethics and competence limits",
  "strengths-based assessment and goal setting",
] as const;

function categoryForPractice(pi: number): string {
  const p = PRACTICE[pi % PRACTICE.length];
  if (p.includes("school")) return "School Social Work";
  if (p.includes("healthcare") || p.includes("hospital") || p.includes("primary")) return "Healthcare Social Work";
  if (p.includes("child welfare")) return "Child and Family Practice";
  if (p.includes("substance")) return "Substance Use and Mental Health";
  if (p.includes("aging")) return "Healthcare Social Work";
  if (p.includes("veteran")) return "Clinical Social Work";
  if (p.includes("crisis")) return "Clinical Social Work";
  if (p.includes("community")) return "Macro and Community Practice";
  return "Clinical Social Work";
}

function buildGridSpec(index: number): TopicSpec {
  const pi = index % PRACTICE.length;
  const ti = Math.floor(index / PRACTICE.length) % THEME.length;
  const practice = PRACTICE[pi];
  const theme = THEME[ti];
  const slug = `social-work-${slugifyPart(practice)}-${slugifyPart(theme)}-longtail-guide`;
  const title = `${practice.replace(/\b\w/g, (c) => c.toUpperCase())}: ${theme.replace(/\b\w/g, (c) => c.toUpperCase())} — Licensing Prep Guide`;
  const excerpt = `Trauma-informed, exam-oriented review connecting ${theme} to real-world ${practice} contexts for BSW/MSW learners. Educational only; follow agency policy in practice.`;
  const tags = Array.from(
    new Set([
      "Social work",
      "Licensure",
      practice.split(" ")[0]!,
      theme.split(" ")[0]!,
      "ASWB",
    ]),
  ).slice(0, 6);

  const lens = `This guide focuses on how ${theme} shows up in ${practice}, where ethical tensions intensify, and how licensing exams tend to reward client-centered, lawful, supervision-backed judgment.`;
  const definitions = `Foundational concepts include professional values, ethical standards, person-in-environment framing, systems theory, ecological levels (micro/mezzo/macro), and evidence-informed engagement. In ${practice}, these ideas translate into concrete behaviors: transparent consent processes, clear role explanations, attention to power, and documentation that demonstrates prudence rather than perfectionism.`;
  const assessment = `Assessment considerations begin with safety, capacity, culture, language access, and social determinants of health. For ${theme}, gather multi-informant data when appropriate, observe patterns over time, and separate facts from interpretations. Use standardized screens as adjuncts to clinical judgment, not replacements. Note how stigma and prior system harm shape disclosure.`;
  const communication = `Communication strategies include reflective listening, validation without false reassurance, collaborative problem solving, and plain-language explanations of limits and next steps. In ${practice}, pacing matters: rushing can mimic institutional coercion, while endless processing can delay safety. Match communication to developmental level, trauma triggers, and sensory needs.`;
  const documentation = `Documentation pearls include timely, factual, respectful notes that support continuity. Tie interventions to goals, record risk conversations with specificity, and avoid pejorative labels. For ${theme}, show what was assessed, what was discussed, referrals offered, and follow-up plans. Remember: notes may be subpoenaed; write accordingly while staying clinically useful.`;
  const ethics = `Ethics and boundaries require knowing your role, scope, and mandatory duties. When ${theme} intersects with employer pressure, funder demands, or family requests, return to NASW standards: integrity, competence, and dignity. Seek supervision for dual relationships, gifts, technology boundaries, and conflicts of interest.`;
  const cultural = `Cultural safety and equity considerations include auditing implicit bias, ensuring language access, respecting gender identity, addressing disability accommodations, and recognizing historical trauma linked to systems. In ${practice}, partner with community resources led by impacted people when possible and avoid extracting emotional labor.`;
  const crisis = `Crisis and escalation considerations emphasize least restrictive responses, de-escalation, means reduction conversations within scope, and lawful reporting when thresholds are met. If ${theme} involves acute danger, prioritize immediate safety, involve emergency services when indicated, and coordinate handoffs clearly.`;
  const ipc = `Interprofessional collaboration in ${practice} means clarifying roles with nurses, physicians, teachers, probation officers, and advocates. Share minimum necessary information, attend to turf issues without client abandonment, and elevate psychosocial needs in team decisions without practicing medicine.`;
  const exam = `Exam-focused review points: read for the ethical dilemma under the story, identify who holds decision rights, notice mandatory reporting language, and select answers that combine safety with autonomy when possible. For ${theme}, watch for traps that sound clinically sophisticated but ignore consent, scope, or supervision.`;

  return {
    slug,
    title,
    excerpt,
    category: categoryForPractice(pi),
    tags,
    lens,
    definitions,
    assessment,
    communication,
    documentation,
    ethics,
    cultural,
    crisis,
    ipc,
    exam,
  };
}

function allTopics(): TopicSpec[] {
  const out: TopicSpec[] = [...ANCHORS];
  let gridIdx = 0;
  while (out.length < 100) {
    out.push(buildGridSpec(gridIdx));
    gridIdx += 1;
    if (gridIdx > 500) throw new Error("failed to converge to 100 topics");
  }
  // Ensure uniqueness (grid could theoretically collide if slugify truncates); de-dup by suffix.
  const seen = new Set<string>();
  const deduped: TopicSpec[] = [];
  for (const t of out) {
    let slug = t.slug;
    let n = 2;
    while (seen.has(slug)) {
      slug = `${t.slug}-v${n}`;
      n += 1;
    }
    seen.add(slug);
    deduped.push(slug === t.slug ? t : { ...t, slug, excerpt: `${t.excerpt} (guide ${n - 1})` });
  }
  return deduped.slice(0, 100);
}

function internalLinkSlugs(all: TopicSpec[], i: number): string[] {
  const slugs = all.map((t) => t.slug);
  const pick = (k: number) => slugs[(i + k) % slugs.length]!;
  const a = pick(3);
  const b = pick(11);
  const c = pick(29);
  const d = pick(47);
  return Array.from(new Set([a, b, c, d])).filter((s) => s !== slugs[i]);
}

function titleForSlug(all: TopicSpec[], slug: string): string {
  return all.find((t) => t.slug === slug)?.title ?? slug.replace(/-/g, " ");
}

function refsForIndex(i: number): string[] {
  const out: string[] = [];
  for (let k = 0; k < 6; k++) {
    out.push(REF_POOL[(i + k) % REF_POOL.length]!);
  }
  return out;
}

function faq(title: string, slug: string): [string, string][] {
  return [
    [
      `What should I study first related to ${h(title)}?`,
      `Start with safety, consent, and scope, then connect ethics standards to the scenario's setting. Use supervision questions to turn vignettes into decision rules you can reuse on exam day.`,
    ],
    [
      `How is this article different from legal advice?`,
      `It is educational exam preparation. Laws and policies vary by jurisdiction and employer; always follow your agency training, statutes, and consultation requirements in real practice.`,
    ],
    [
      `Why emphasize trauma-informed care here?`,
      `Trauma-informed engagement reduces retraumatization, improves assessment validity, and aligns with contemporary ethical expectations in many practice settings.`,
    ],
    [
      `Can I use ${h(slug)} content as a workplace protocol?`,
      `No. Protocols must be authorized locally. Use this material to build conceptual understanding and study rationales, not as a substitute for employer-approved procedures.`,
    ],
  ];
}

function bodyHtml(spec: TopicSpec, all: TopicSpec[], index: number): string {
  const links = internalLinkSlugs(all, index)
    .map((s) => `<li><a href="/blog/${h(s)}">${h(titleForSlug(all, s))}</a></li>`)
    .join("\n");
  const fq = faq(spec.title, spec.slug)
    .map(([q, a]) => `<h3>${h(q)}</h3>\n<p>${h(a)}</p>`)
    .join("\n");
  const refs = refsForIndex(index).map((r) => `<p>${h(r)}</p>`).join("\n");

  return `<h2>Introduction</h2>
<p>${h(spec.lens)} Social work licensing exams and field placements increasingly evaluate whether you can hold complexity: autonomy alongside safety, confidentiality alongside duty to protect, and culturally responsive care alongside institutional rules. This article is written for BSW and MSW learners, new graduates, and licensing candidates who want a trauma-informed, ethically grounded study scaffold—not a substitute for supervision, statutes, or agency policy.</p>
<p>Throughout, we stay within social work scope. We do not provide medical treatment advice; when health conditions appear, the focus is on psychosocial impact, navigation, collaboration, and referral patterns commonly tested on exams. Educational content here supports exam preparation and professional reasoning practice.</p>
<p>As you read, translate each section into a question you could explain to a peer: What is the ethical tension? What information is missing? What is the least harmful next step? What documentation would demonstrate prudence? That translation builds the automaticity licensing items reward.</p>

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Safety and consent are recurring anchors</strong>: most vignettes punish answers that skip risk assessment or ignore informed consent limits.</li>
  <li><strong>Documentation is an ethics behavior</strong>: timely, factual notes protect clients, teams, and your future memory of complex cases.</li>
  <li><strong>Supervision is a professional tool</strong>, not a personal failure signal: exam answers often prefer consultation over isolated heroics.</li>
  <li><strong>Cultural humility is operational</strong>: it shows up as language access, bias awareness, respectful curiosity, and accountability—not slogans.</li>
  <li><strong>Interprofessional clarity prevents harm</strong>: role confusion breeds errors; good social work names role boundaries and coordinates care.</li>
  <li><strong>Scope discipline matters</strong>: avoid diagnosing or prescribing outside licensure; know what to refer and how to document referral attempts.</li>
</ul>

<h2>Definitions and foundational concepts</h2>
<p>${h(spec.definitions)}</p>
<p>Person-in-environment thinking reminds you that "individual symptoms" often link to housing instability, discrimination, caregiver burden, workplace conditions, trauma history, and neighborhood resources. Licensing exams frequently embed these social determinants as hidden drivers of the presenting problem.</p>
<p>Strengths-based and evidence-informed practice are complementary: strengths-based work refuses to reduce people to deficits, while evidence-informed work integrates research, client values, and clinician expertise. Ethical integration means you do not coerce "best practice" that ignores client goals without transparent discussion.</p>

<h2>Assessment considerations</h2>
<p>${h(spec.assessment)}</p>
<p>Triangulate subjective reports with observable data when possible. For children and vulnerable adults, consider developmental stage, dependency, and power imbalance. For adolescents, attend to privacy expectations alongside safety duties. For older adults, consider sensory changes, cognitive fluctuations, medication effects, and caregiver dynamics without jumping to conclusions.</p>
<p>When standardized measures are used, explain their purpose, obtain appropriate consent, and interpret scores humbly as one data source. Always chart why a tool was chosen and how results influenced the plan—exam items sometimes test whether you understand appropriate use, not just how to score.</p>

<h2>Communication strategies</h2>
<p>${h(spec.communication)}</p>
<p>Motivational interviewing skills—open questions, affirmations, reflections, summaries—help reduce defensiveness in mandated contexts. Psychoeducation should be paced, check understanding, and invite questions. When delivering difficult news, prioritize clarity, compassion, and a plan for follow-up support.</p>
<p>Electronic communication raises new ethics issues: boundary risks, privacy, response-time expectations, and documentation. Prefer agency-approved channels; avoid informal texting unless policy explicitly supports it with safeguards.</p>

<h2>Documentation pearls</h2>
<p>${h(spec.documentation)}</p>
<p>Good notes answer: who was seen, for how long, what was discussed, what changed, what interventions were used, how the client responded, and what comes next. When risk is present, document protective factors, warning signs discussed, and safety plans collaboratively created.</p>
<p>When correcting an error, follow record amendment policies rather than hiding mistakes—integrity standards apply to documentation as much as to direct practice.</p>

<h2>Ethics and boundaries</h2>
<p>${h(spec.ethics)}</p>
<p>Boundary management includes physical boundaries, self-disclosure, gift policies, social media rules, and financial interactions. When uncertainty exists, the ethical sequence is often: pause, seek supervision, consult policy, consider client vulnerability, choose the least exploitative path, and document consultation outcomes.</p>
<p>Technology-assisted services require attention to privacy, verification of identity, crisis planning across distance, and equitable access for clients without reliable devices or data plans.</p>

<h2>Cultural safety and equity considerations</h2>
<p>${h(spec.cultural)}</p>
<p>Structural competence invites you to ask which policies create delays, which forms are unreadable, which hours exclude working families, and which fees block access. Advocacy can be ethical when aligned with client goals and role boundaries.</p>
<p>Anti-oppressive practice also turns inward: examine how teams reproduce bias through triage, language offering, dress codes, and informal hierarchies. Exams may reward answers that reduce stigma and increase access.</p>

<h2>Crisis and escalation considerations</h2>
<p>${h(spec.crisis)}</p>
<p>De-escalation begins with calm voice, reduced stimuli, clear choices, and respectful distance. When weapons or credible threats appear, follow training—this article does not replace security protocols. After crises, prioritize stabilization, follow-up, and documentation of decisions and rationales.</p>
<p>Substance use crises may require medical evaluation for withdrawal; social workers support engagement, transportation barriers, and continuity, within scope.</p>

<h2>Interprofessional collaboration</h2>
<p>${h(spec.ipc)}</p>
<p>Effective teams use shared care plans, clear communication loops, and respectful challenge of unsafe discharges or biased assumptions. Social workers often facilitate family meetings; exams test whether you can keep multiple stakeholders oriented to client-centered outcomes.</p>
<p>When values conflict between medicine and client autonomy, social workers clarify client values, explore alternatives, document thoroughly, and escalate ethically rather than silently accepting harm.</p>

<h2>Exam-focused review points</h2>
<p>${h(spec.exam)}</p>
<p>Practice reading the final sentence first at times—many items place the actual question in the last line. Watch for absolute words ("always," "never") in answer choices; ethics often depends on context. Prefer answers that show transparency, supervision, lawful behavior, and client dignity together rather than clever shortcuts.</p>
<p>For "first step" items, distinguish assessment from intervention, and immediate safety from long-term treatment planning. For "most ethical" items, compare harms and benefits across stakeholders, not only convenience.</p>

<h2>Suggested internal links</h2>
<ul>
${links}
<li><a href="/app/dashboard">Learner dashboard</a> — continue adaptive study after reading.</li>
</ul>

<h2>Premium Lesson CTA</h2>
<p>Pair this long-tail guide with NurseNest premium lessons and adaptive practice to convert vignette anxiety into repeatable decision rules. Use your dashboard to schedule spaced review of ethics, assessment, and safety scenarios alongside your field learning plan.</p>

<h2>FAQ Schema Questions</h2>
${fq}

<h2>APA-7 References</h2>
${refs}
<p><em>Follow your program's citation requirements; links support educational traceability and do not replace local statutes, employer policy, or supervision.</em></p>`;
}

function frontmatter(spec: TopicSpec): string {
  return `---
slug: ${spec.slug}
title: ${spec.title}
excerpt: ${spec.excerpt}
category: ${spec.category}
tags: ${spec.tags.join(", ")}
publishedAt: 2026-05-09
updatedAt: 2026-05-09
seoTitle: ${spec.title} | NurseNest
seoDescription: ${spec.excerpt}
canonicalUrl: /blog/${spec.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Social work practice review board (educational)
disclaimer: This article supports social work education and licensing exam preparation. It is not individualized legal advice, clinical supervision, or a substitute for your agency's policies. It is not individualized medical advice. Always follow local laws, statutes, supervision requirements, and employer procedures in real practice.
---

`;
}

function main(): void {
  const writeReport = process.argv.includes("--write-report");
  const topics = allTopics();
  mkdirSync(outDir, { recursive: true });
  const rows: string[] = [];
  rows.push(`# Social work static long-tail batch (100 posts)`);
  rows.push(``);
  rows.push(`Generated: ${new Date().toISOString()}`);
  rows.push(``);
  rows.push(`| slug | title | word count | validate | internal links | excluded failures |`);
  rows.push(`| --- | --- | ---: | --- | --- | --- |`);

  let minW = 1e9;
  let maxW = 0;
  for (let i = 0; i < topics.length; i++) {
    const spec = topics[i]!;
    const html = bodyHtml(spec, topics, i);
    const wc = countWordsFromHtml(html);
    minW = Math.min(minW, wc);
    maxW = Math.max(maxW, wc);
    if (wc < 1200) {
      throw new Error(`Word count too low for ${spec.slug}: ${wc}`);
    }
    const file = join(outDir, `${spec.slug}.md`);
    writeFileSync(file, frontmatter(spec) + html, "utf8");
    const linkSlugs = internalLinkSlugs(topics, i);
    const failures = wc >= 1200 ? "" : "word count";
    rows.push(
      `| ${spec.slug} | ${spec.title.replace(/\|/g, " ")} | ${wc} | pass | ${linkSlugs.join("; ")} | ${failures} |`,
    );
  }

  rows.push(``);
  rows.push(`## Summary`);
  rows.push(``);
  rows.push(`- posts: ${topics.length}`);
  rows.push(`- word count min/max: ${minW} / ${maxW}`);
  rows.push(``);

  if (writeReport) {
    mkdirSync(join(process.cwd(), "reports"), { recursive: true });
    writeFileSync(reportMd, rows.join("\n") + "\n", "utf8");
    console.log(`Wrote ${reportMd}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        count: topics.length,
        minWords: minW,
        maxWords: maxW,
        outDir,
      },
      null,
      2,
    ),
  );
}

main();
