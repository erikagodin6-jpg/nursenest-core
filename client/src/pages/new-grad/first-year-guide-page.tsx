import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { LeadCaptureInline } from "@/components/new-grad/lead-capture";
import { InternalLinks } from "@/components/new-grad/internal-links";
import { NEW_GRAD_PROFESSIONS, getProfessionBySlug } from "@shared/new-grad-professions";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, ChevronRight, GraduationCap, CheckCircle2,
  AlertTriangle, Clock, MessageSquare, Shield, Target, Star, Brain
} from "lucide-react";

const FIRST_YEAR_SECTIONS = [
  {
    id: "overview",
    title: "First Year Overview",
    icon: BookOpen,
    description: "What to expect during your transition from student to practicing clinician.",
  },
  {
    id: "common-mistakes",
    title: "Common Mistakes to Avoid",
    icon: AlertTriangle,
    description: "Pitfalls that trip up new graduates and how to steer clear of them.",
  },
  {
    id: "shift-preparation",
    title: "Shift & Day Organization",
    icon: Clock,
    description: "How to organize your workday so you feel confident and in control.",
  },
  {
    id: "communication",
    title: "Communication with Senior Staff",
    icon: MessageSquare,
    description: "Build strong professional relationships through effective communication.",
  },
  {
    id: "clinical-confidence",
    title: "Confidence Building",
    icon: Shield,
    description: "Build your professional confidence through structured growth and self-reflection.",
  },
];

interface ShiftPrepContent {
  beforeTitle: string;
  beforeItems: string[];
  duringTitle: string;
  duringItems: string[];
  afterTitle: string;
  afterItems: string[];
}

interface CommunicationContent {
  withSeniors: string;
  withTeam: string;
  withClientsOrPatients: string;
  clientLabel: string;
}

const SHIFT_PREP_BY_PROFESSION: Record<string, ShiftPrepContent> = {
  nursing: {
    beforeTitle: "Before Your Shift",
    beforeItems: [
      "Review your patient assignment and check for new orders from the previous shift",
      "Prepare your brain sheet with room numbers, diagnoses, and medication times",
      "Check your supply cart and stock essential items (flushes, IV supplies, dressings)",
      "Review any patients with critical labs, new admissions, or pending procedures",
    ],
    duringTitle: "During Your Shift",
    duringItems: [
      "Complete assessments systematically — head-to-toe on every patient before charting",
      "Cluster your care tasks by time and proximity to minimize wasted steps",
      "Chart in real time after each patient interaction to avoid end-of-shift documentation pileup",
      "Check in with your charge nurse if your workload becomes unmanageable",
    ],
    afterTitle: "End of Shift",
    afterItems: [
      "Prepare a structured SBAR handoff report for each patient",
      "Verify all orders were completed and document any outstanding items",
      "Debrief with yourself: what went well, what would you do differently?",
    ],
  },
  paramedic: {
    beforeTitle: "Start of Shift",
    beforeItems: [
      "Complete a thorough vehicle and equipment check — verify oxygen, medications, monitor, airway kit",
      "Test communication equipment including radio, MDT, and backup devices",
      "Review any service updates, protocol changes, or operational notices from dispatch",
      "Discuss shift expectations and role responsibilities with your partner",
    ],
    duringTitle: "On Calls",
    duringItems: [
      "Perform scene size-up before patient contact — safety is always your first priority",
      "Follow your systematic primary survey (ABCDE) on every call, regardless of apparent severity",
      "Communicate with dispatch early when you need additional resources — don't wait",
      "Complete your patient care report thoroughly while details are fresh",
    ],
    afterTitle: "Post-Call",
    afterItems: [
      "Restock supplies and verify equipment readiness for the next call",
      "Debrief with your partner after difficult calls — don't bottle up stress",
      "Review any clinical decisions you were uncertain about and look up protocols",
    ],
  },
  "respiratory-therapy": {
    beforeTitle: "Before Your Shift",
    beforeItems: [
      "Review your unit assignments and identify ventilated patients requiring priority attention",
      "Check ventilator settings, circuit integrity, and backup equipment on all your patients",
      "Review ABG results and any pending respiratory orders from the night team",
      "Verify emergency airway equipment is available and functional on each unit you cover",
    ],
    duringTitle: "During Your Shift",
    duringItems: [
      "Prioritize ventilator checks and ABG draws — these are time-sensitive responsibilities",
      "Round with physicians and nurses to stay ahead of respiratory care plan changes",
      "Document ventilator changes, therapy assessments, and clinical reasoning in real time",
      "Respond promptly to rapid response and code blue calls — you are the airway expert",
    ],
    afterTitle: "End of Shift",
    afterItems: [
      "Provide detailed handoff including ventilator weaning progress and pending ABGs",
      "Flag any patients approaching extubation readiness or showing signs of deterioration",
      "Note any equipment issues or supply needs for the incoming therapist",
    ],
  },
  mlt: {
    beforeTitle: "Start of Shift",
    beforeItems: [
      "Run and review quality control on all instruments before processing patient specimens",
      "Check pending specimen queue and prioritize STAT and critical specimens",
      "Review instrument maintenance logs and note any calibration or troubleshooting needs",
      "Verify reagent levels, expiration dates, and supply inventory on your benches",
    ],
    duringTitle: "During Your Shift",
    duringItems: [
      "Process STAT specimens immediately — turnaround time impacts patient care decisions",
      "Apply delta checks and verify critical values before releasing results",
      "Document all QC failures, troubleshooting steps, and corrective actions taken",
      "Communicate critical results to clinicians within your institution's required timeframe",
    ],
    afterTitle: "End of Shift",
    afterItems: [
      "Brief the incoming technologist on pending specimens, QC issues, and instrument status",
      "Complete preventive maintenance tasks and log any outstanding instrument concerns",
      "Ensure all critical values have been reported and documented",
    ],
  },
  imaging: {
    beforeTitle: "Start of Shift",
    beforeItems: [
      "Review the exam schedule and note any special procedures or contrast studies",
      "Verify image receptor calibration and equipment warm-up status",
      "Check lead aprons, thyroid shields, and shielding supplies",
      "Review portable and OR requests that may need immediate attention",
    ],
    duringTitle: "During Your Shift",
    duringItems: [
      "Verify patient identity and exam order before every procedure — three-point check minimum",
      "Position patients carefully using anatomical landmarks — accuracy prevents repeats",
      "Apply ALARA principles: collimate tightly, use appropriate technique, and shield when possible",
      "Critically evaluate each image before sending to PACS — catch errors before the patient leaves",
    ],
    afterTitle: "End of Shift",
    afterItems: [
      "Hand off any pending exams, portable requests, and OR cases to the incoming technologist",
      "Report any equipment issues or quality concerns to your supervisor",
      "Review any repeat images and identify areas for positioning improvement",
    ],
  },
  "occupational-therapy": {
    beforeTitle: "Before Your Day",
    beforeItems: [
      "Review your caseload schedule and prioritize evaluations versus follow-up treatments",
      "Prepare treatment materials and adaptive equipment for each client session",
      "Check for new referrals, discharge orders, or authorization updates",
      "Review previous session notes to ensure continuity in treatment goals",
    ],
    duringTitle: "During Sessions",
    duringItems: [
      "Start each session by checking in on the client's priorities and daily functioning",
      "Use purposeful, occupation-based activities — avoid exercises without functional context",
      "Document progress toward functional goals in real time between sessions",
      "Collaborate with PT, speech therapy, and nursing on shared patient goals",
    ],
    afterTitle: "End of Day",
    afterItems: [
      "Complete all treatment notes and update functional progress measures",
      "Prepare for next-day evaluations by reviewing referral information",
      "Reflect on sessions: were interventions client-centered and occupation-based?",
    ],
  },
  "social-work": {
    beforeTitle: "Before Your Day",
    beforeItems: [
      "Review your client schedule and flag any high-risk or crisis-prone cases",
      "Check for new referrals, court dates, or agency communications requiring immediate response",
      "Prepare assessment tools, resource lists, and documentation templates for scheduled sessions",
      "Review supervision notes and any consultation recommendations from previous sessions",
    ],
    duringTitle: "During Client Sessions",
    duringItems: [
      "Conduct psychosocial assessments using structured frameworks and validated tools",
      "Document safety plans and risk assessments thoroughly for high-risk clients",
      "Connect clients to community resources and follow up on referral outcomes",
      "Practice self-regulation between emotionally demanding sessions",
    ],
    afterTitle: "End of Day",
    afterItems: [
      "Complete clinical notes with clear documentation of interventions and clinical reasoning",
      "Flag any clients requiring urgent follow-up or mandated reporting",
      "Engage in self-care — process the day's emotional content through journaling, peer support, or supervision",
    ],
  },
  psychotherapy: {
    beforeTitle: "Before Sessions",
    beforeItems: [
      "Review treatment plans and previous session notes for each client on your schedule",
      "Prepare therapeutic materials, worksheets, or assessment tools for planned interventions",
      "Center yourself between sessions — take 5-10 minutes for mental preparation",
      "Check for any urgent messages, crisis contacts, or cancellations",
    ],
    duringTitle: "During Sessions",
    duringItems: [
      "Begin with a check-in on the client's presenting state and any between-session developments",
      "Follow the treatment plan while remaining responsive to emerging clinical material",
      "Monitor your own countertransference reactions and bracket personal responses",
      "Administer outcome measures at planned intervals to track therapeutic progress",
    ],
    afterTitle: "After Sessions",
    afterItems: [
      "Write process notes immediately while clinical impressions are fresh",
      "Note any risk factors, safety concerns, or themes to discuss in supervision",
      "Practice a brief decompression routine between demanding sessions",
    ],
  },
  "addictions-counseling": {
    beforeTitle: "Start of Day",
    beforeItems: [
      "Review your client schedule — note anyone recently discharged, in early recovery, or high-risk",
      "Check for any crisis contacts, missed appointments, or re-admission alerts",
      "Prepare group session materials, screening tools, and treatment plan updates",
      "Review medication-assisted treatment (MAT) coordination notes with prescribers",
    ],
    duringTitle: "During Sessions",
    duringItems: [
      "Use motivational interviewing consistently — meet clients at their stage of change",
      "Conduct substance use screenings with validated tools (AUDIT, DAST, CAGE)",
      "Document treatment plan progress, relapse patterns, and recovery milestones",
      "Facilitate group sessions with clear structure, boundaries, and trauma-informed awareness",
    ],
    afterTitle: "End of Day",
    afterItems: [
      "Complete all counseling notes with attention to stage of change and treatment response",
      "Coordinate with case managers on clients needing housing, employment, or legal resources",
      "Practice personal self-care — addictions work carries significant emotional weight",
    ],
  },
};

const COMMUNICATION_BY_PROFESSION: Record<string, CommunicationContent> = {
  nursing: {
    withSeniors: "Approach experienced nurses with specific questions rather than vague uncertainty. Instead of 'I don't know what to do,' try 'I'm seeing X finding on my patient — I'm thinking Y intervention, does that sound appropriate?' This shows clinical reasoning and earns respect. Use SBAR when communicating with physicians — it demonstrates professionalism and ensures critical details aren't missed.",
    withTeam: "Build relationships with your interdisciplinary team early. Introduce yourself to respiratory therapists, pharmacists, social workers, and case managers. Knowing who to call for specific concerns saves time and improves patient care. Attend interdisciplinary rounds actively — your bedside observations are valuable.",
    withClientsOrPatients: "Introduce yourself with your name and role at every encounter. Explain procedures in plain language before you begin. Listen to patient and family concerns without rushing — even 30 seconds of active listening builds trust. Use teach-back to verify understanding of discharge instructions.",
    clientLabel: "Patients & Families",
  },
  paramedic: {
    withSeniors: "Your experienced partners are your greatest learning resource. Ask about their clinical reasoning during calls: 'What made you decide to give that medication first?' or 'How did you read that scene differently than I did?' Accept constructive criticism gracefully — field experience is earned through thousands of calls, not classroom hours.",
    withTeam: "Build strong working relationships with dispatch, fire services, and hospital staff. Clear, concise radio reports using a structured format (age, chief complaint, vitals, interventions, ETA) earn professional credibility. Know the receiving hospital's protocols and preferences — this smooths patient handoffs.",
    withClientsOrPatients: "Calm, confident communication reassures panicked patients and families. Introduce yourself, explain what you're doing, and provide honest but compassionate updates. In high-stress situations, use clear, simple instructions. After the emergency stabilizes, take a moment to address the patient's emotional state.",
    clientLabel: "Patients & Bystanders",
  },
  "respiratory-therapy": {
    withSeniors: "When approaching senior RTs or pulmonologists, come prepared with data: current ventilator settings, ABG results, and your clinical observations. Say 'I'm seeing this trend and thinking about this change — do you agree?' This demonstrates clinical thinking. Don't be afraid to advocate for ventilator changes you believe are clinically appropriate.",
    withTeam: "Your relationship with ICU nurses is critical — they are your eyes and ears between rounds. Share your respiratory assessment findings and listen to their bedside observations. Communicate ventilator changes clearly and explain your rationale. Good collaboration with nurses leads to earlier intervention and better patient outcomes.",
    withClientsOrPatients: "Many of your patients are anxious, intubated, or in respiratory distress. For conscious patients, explain each intervention calmly. For ventilated patients, establish a communication method (yes/no questions, communication boards). Educate patients on breathing techniques, inhaler use, and self-management strategies.",
    clientLabel: "Patients & Families",
  },
  mlt: {
    withSeniors: "When calling senior techs about unusual results, present your data systematically: the result, what's abnormal, what troubleshooting you've already done, and what you think the issue might be. Experienced technologists appreciate structured questions. Don't hesitate to ask for help with rare specimen types or procedures you haven't encountered.",
    withTeam: "Your communication with clinicians when reporting critical values must be clear, accurate, and documented. State the patient name, test, result, and that it's a critical value. Ask the clinician to read back the result. Build good relationships with phlebotomists — specimen quality directly impacts your work.",
    withClientsOrPatients: "If you interact with patients during phlebotomy or point-of-care testing, explain procedures clearly and answer questions about specimen collection. When clinicians call about results, be prepared to discuss methodology, reference ranges, and potential interferences professionally.",
    clientLabel: "Clinicians & Patients",
  },
  imaging: {
    withSeniors: "Ask experienced technologists to review your positioning and technique choices, especially for challenging exams. 'Can you check this lateral knee positioning before I expose?' shows diligence, not weakness. Senior techs and radiologists can teach you positioning tricks and technique adjustments that aren't in textbooks.",
    withTeam: "Communicate clearly with referring physicians about exam limitations and contrast protocols. Work collaboratively with nurses during portable exams — coordinate patient positioning and timing. Maintain professional relationships with radiologists by producing consistently high-quality images and asking for feedback on your work.",
    withClientsOrPatients: "Many patients are anxious about radiation or uncomfortable during positioning. Explain each step before you do it. Use plain language: 'I need to take a picture of your chest' instead of 'I'm doing a PA and lateral CXR.' For pediatric or elderly patients, adapt your communication and show extra patience.",
    clientLabel: "Patients & Families",
  },
  "occupational-therapy": {
    withSeniors: "Seek mentorship actively from experienced OTs. Present your clinical reasoning when asking for guidance: 'I'm seeing decreased fine motor coordination affecting ADLs — I'm considering this intervention approach, what do you think?' This demonstrates professional growth. Request to observe senior OTs with complex cases to broaden your intervention repertoire.",
    withTeam: "Collaborate closely with PT and speech therapy to avoid overlapping goals and maximize patient outcomes. Communicate OT's unique contribution to the team — functional independence and meaningful occupation. Participate actively in discharge planning to ensure clients have the adaptive equipment and environmental modifications they need.",
    withClientsOrPatients: "Center your communication around the client's goals and priorities, not your treatment agenda. Ask 'What matters most to you?' before prescribing interventions. Explain the rationale behind therapeutic activities — clients engage more when they understand why an activity builds toward their functional goals.",
    clientLabel: "Clients & Families",
  },
  "social-work": {
    withSeniors: "Approach supervision with specific cases and clear questions. Instead of 'I'm stuck with this client,' present your clinical formulation: 'I'm seeing these risk factors and considering this intervention — what's your perspective?' Use supervision proactively, not reactively. Bring ethical dilemmas early before they become crises.",
    withTeam: "Advocate for your clients' psychosocial needs within the interdisciplinary team. Educate medical staff about social determinants of health, community resources, and discharge barriers. Build referral relationships with community agencies — these connections directly benefit your clients' outcomes.",
    withClientsOrPatients: "Use therapeutic communication skills consistently: active listening, reflection, validation, and unconditional positive regard. Build rapport before assessment. With involuntary clients, acknowledge the power dynamic honestly. With families, balance multiple perspectives while maintaining your client's best interests.",
    clientLabel: "Clients & Families",
  },
  psychotherapy: {
    withSeniors: "Use supervision as a learning space, not a performance review. Present your clinical formulation, intervention choices, and therapeutic process observations. Be transparent about countertransference reactions — your supervisor can help you work through them. Come prepared with specific questions and recorded (with consent) session segments when possible.",
    withTeam: "If working in an agency or hospital, communicate clearly with psychiatrists about medication observations and treatment progress. Coordinate with case managers on clients' practical needs. Maintain appropriate confidentiality while sharing clinically relevant information with the treatment team.",
    withClientsOrPatients: "Therapeutic communication is your core competency. Practice active listening, empathic reflection, and strategic silence. Be genuine — clients sense inauthenticity. Set clear boundaries around session structure, between-session contact, and the therapeutic relationship. Model healthy communication patterns.",
    clientLabel: "Clients",
  },
  "addictions-counseling": {
    withSeniors: "Bring challenging cases to supervision with your clinical observations and treatment questions. Discuss your emotional reactions to client relapse openly — experienced supervisors expect this. Ask about their approaches to resistant clients, co-occurring disorders, and complex family dynamics. Supervision is essential, not optional.",
    withTeam: "Coordinate with prescribers on medication-assisted treatment plans. Communicate with case managers about housing, employment, and legal needs. Build relationships with probation officers, family court workers, and community recovery organizations. Integrated care produces better outcomes than siloed treatment.",
    withClientsOrPatients: "Use motivational interviewing as your default communication approach. Roll with resistance — arguing pushes clients further from change. Maintain unconditional positive regard even when clients relapse. Be honest about treatment expectations while maintaining hope. With families, address enabling patterns compassionately.",
    clientLabel: "Clients & Families",
  },
};

const RELATED_GUIDES: Record<string, { slug: string; label: string }[]> = {
  nursing: [
    { slug: "paramedic", label: "Paramedic First Year Guide" },
    { slug: "respiratory-therapy", label: "RRT First Year Guide" },
  ],
  paramedic: [
    { slug: "nursing", label: "Nursing First Year Guide" },
    { slug: "respiratory-therapy", label: "RRT First Year Guide" },
  ],
  "respiratory-therapy": [
    { slug: "nursing", label: "Nursing First Year Guide" },
    { slug: "paramedic", label: "Paramedic First Year Guide" },
  ],
  mlt: [
    { slug: "imaging", label: "Imaging First Year Guide" },
    { slug: "nursing", label: "Nursing First Year Guide" },
  ],
  imaging: [
    { slug: "mlt", label: "MLT First Year Guide" },
    { slug: "nursing", label: "Nursing First Year Guide" },
  ],
  "occupational-therapy": [
    { slug: "social-work", label: "Social Work First Year Guide" },
    { slug: "nursing", label: "Nursing First Year Guide" },
  ],
  "social-work": [
    { slug: "psychotherapy", label: "Psychotherapy First Year Guide" },
    { slug: "addictions-counseling", label: "Addictions Counseling First Year Guide" },
    { slug: "occupational-therapy", label: "OT First Year Guide" },
  ],
  psychotherapy: [
    { slug: "social-work", label: "Social Work First Year Guide" },
    { slug: "addictions-counseling", label: "Addictions Counseling First Year Guide" },
  ],
  "addictions-counseling": [
    { slug: "psychotherapy", label: "Psychotherapy First Year Guide" },
    { slug: "social-work", label: "Social Work First Year Guide" },
  ],
};

const EXAM_PREP_LINKS: Record<string, { label: string; href: string }> = {
  nursing: { label: "NCLEX / REX-PN Exam Prep", href: "/mock-exams" },
  paramedic: { label: "NREMT / PCP Exam Prep", href: "/allied-health/paramedic/mock-exams" },
  "respiratory-therapy": { label: "RRT / NBRC Exam Prep", href: "/allied-health/rrt/mock-exams" },
  mlt: { label: "ASCP / CSMLS Exam Prep", href: "/allied-health/mlt/mock-exams" },
  imaging: { label: "ARRT / CAMRT Exam Prep", href: "/allied-health/imaging/mock-exams" },
  "occupational-therapy": { label: "NBCOT Exam Prep", href: "/occupational-therapy/study-plan" },
  "social-work": { label: "ASWB Exam Prep", href: "/social-work/study-plan" },
  psychotherapy: { label: "Registration Exam Prep", href: "/psychotherapy/study-plan" },
  "addictions-counseling": { label: "IC&RC / NAADAC Exam Prep", href: "/addictions-counseling/study-plan" },
};

export default function FirstYearGuidePage() {
  const { t } = useI18n();
  const params = useParams<{ profession: string }>();
  const professionSlug = (params.profession || "").replace("-first-year-guide", "");
  const profession = getProfessionBySlug(professionSlug);

  const { data: guide } = useQuery({
    queryKey: ["/api/new-grad/guides", `${professionSlug}-first-year-guide`],
    queryFn: async () => {
      const res = await fetch(`/api/new-grad/guides/${professionSlug}-first-year-guide`);
      return res.ok ? res.json() : null;
    },
    enabled: !!professionSlug,
  });

  if (!profession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-guide-not-found">{t("pages.newGrad.firstYearGuidePage.guideNotFound")}</h1>
            <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.firstYearGuidePage.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shiftPrep = SHIFT_PREP_BY_PROFESSION[professionSlug] || SHIFT_PREP_BY_PROFESSION.nursing;
  const commContent = COMMUNICATION_BY_PROFESSION[professionSlug] || COMMUNICATION_BY_PROFESSION.nursing;
  const examLink = EXAM_PREP_LINKS[professionSlug];
  const relatedGuides = RELATED_GUIDES[professionSlug] || [];

  const faqData = [
    { question: `How long does the first year in ${profession.shortName} typically feel overwhelming?`, answer: `Most new ${profession.shortName} graduates report feeling significantly more confident by months 6-8. The first 3 months are typically the most challenging as you build clinical routines and relationships. By the end of your first year, tasks that once felt daunting will become second nature.` },
    { question: `What's the biggest mistake new ${profession.shortName} graduates make?`, answer: `Not asking for help early enough. New graduates often feel they should know everything, but experienced colleagues expect questions and prefer you ask rather than guess. Your first year is a learning year — take full advantage of the mentorship and support available to you.` },
    { question: `How can I organize my workday as a new ${profession.shortName} graduate?`, answer: `Develop a consistent pre-work routine: review your assignments, prepare supplies, and mentally prioritize your tasks. During your day, address time-sensitive items first, document in real time, and communicate proactively with your team. Consistency in preparation builds confidence and reduces errors.` },
    { question: `How do I communicate effectively with senior ${profession.shortName} staff?`, answer: `Come prepared with specific observations and questions rather than vague uncertainty. Present your clinical thinking: 'I'm seeing X, I'm thinking Y — does that sound right?' This shows initiative and earns respect. Accept constructive feedback gracefully and follow up on suggestions.` },
    { question: `When will I start feeling confident in ${profession.shortName}?`, answer: `Clinical confidence builds gradually through repetition and positive experiences. Most new graduates notice significant improvement around months 4-6, with a second leap at 9-12 months. Track your growth — you'll be surprised how far you've come when you look back at your first week.` },
  ];

  const faqStructuredData = buildFaqStructuredData(faqData);

  return (
    <div className="min-h-screen flex flex-col" data-testid={`first-year-guide-${professionSlug}`}>
      <Navigation />
      <SEO
        title={`${profession.name} First Year Guide - What to Expect & How to Thrive | NurseNest`}
        description={`Complete first year guide for new ${profession.shortName} graduates. What the first year looks like, common mistakes, workday organization, communication with senior staff, and building confidence.`}
        keywords={`new grad ${profession.shortName}, first year ${profession.shortName}, ${profession.shortName} first year guide, new graduate ${profession.name}, ${profession.shortName} career tips`}
        canonicalPath={`/new-grad/${professionSlug}-first-year-guide`}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: profession.name, url: `https://www.nursenest.ca/new-grad/${professionSlug}` },
          { name: "First Year Guide", url: `https://www.nursenest.ca/new-grad/${professionSlug}-first-year-guide` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-guide-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${profession.colorAccent} 0%, white 100%)` }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.firstYearGuidePage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.firstYearGuidePage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/new-grad/${professionSlug}`} className="hover:text-blue-600">{profession.shortName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: profession.color }} className="font-medium">{t("pages.newGrad.firstYearGuidePage.firstYearGuide")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: profession.color + "20", color: profession.color }}>
            <GraduationCap className="w-4 h-4" />
            First Year Guide
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-guide-title">
            {profession.shortName} First Year <span style={{ color: profession.color }}>{t("pages.newGrad.firstYearGuidePage.guide")}</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Everything you need to navigate your first year as a {profession.name} graduate. From day one orientation through confident independent practice.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/new-grad/${professionSlug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="link-profession-hub">
              {profession.shortName} Hub
            </Link>
            {examLink && (
              <Link href={examLink.href} className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: profession.color }} data-testid="link-exam-prep">
                {examLink.label} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-guide-nav">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.firstYearGuidePage.whatsInside")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FIRST_YEAR_SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" data-testid={`nav-section-${section.id}`}>
                <section.icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: profession.color }} />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="overview" className="py-16" data-testid="section-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7" style={{ color: profession.color }} />
            What Your First Year Looks Like
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>Your first year as a {profession.name} graduate is a transformative journey from academic learning to clinical competence. {profession.careerOverview}</p>
            <div className="bg-blue-50 rounded-xl p-6 mt-6 not-prose">
              <h3 className="font-semibold text-gray-900 mb-3">{t("pages.newGrad.firstYearGuidePage.keyMilestones")}</h3>
              <div className="space-y-2">
                {(profession.firstYearExpectations || []).map((exp, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: profession.color }} />
                    <span className="text-sm text-gray-700">{exp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="common-mistakes" className="py-16 bg-gray-50" data-testid="section-common-mistakes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            Common Mistakes to Avoid
          </h2>
          <div className="space-y-4">
            {(profession.commonChallenges || []).map((challenge, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`mistake-${i}`}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-gray-700">{challenge}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>{t("pages.newGrad.firstYearGuidePage.howToAvoid")}</strong> {(profession.clinicalTips || [])[i] || "Seek mentorship and develop a structured approach to build competence gradually."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shift-preparation" className="py-16" data-testid="section-shift-prep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Clock className="w-7 h-7" style={{ color: profession.color }} />
            Organizing Your Workday
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">{shiftPrep.beforeTitle}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {(shiftPrep.beforeItems || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">{shiftPrep.duringTitle}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {(shiftPrep.duringItems || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: profession.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 md:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-gray-900 mb-3">{shiftPrep.afterTitle}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {(shiftPrep.afterItems || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Star className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="communication" className="py-16 bg-gray-50" data-testid="section-communication">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MessageSquare className="w-7 h-7" style={{ color: profession.color }} />
            Communication with Senior Staff & Colleagues
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                With Experienced {profession.shortName} Staff
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{commContent.withSeniors}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: profession.color }} />
                With Your Interdisciplinary Team
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{commContent.withTeam}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                With {commContent.clientLabel}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{commContent.withClientsOrPatients}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="clinical-confidence" className="py-16" data-testid="section-clinical-confidence">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7" style={{ color: profession.color }} />
            Building Your Confidence
          </h2>
          <p className="text-gray-600 mb-6">Confidence as a new {profession.shortName} graduate doesn't come from knowing everything — it comes from developing reliable systems, asking the right questions, and reflecting on your growth.</p>
          <div className="space-y-4">
            {(profession.clinicalTips || []).map((tip, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-5" data-testid={`confidence-tip-${i}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white" style={{ backgroundColor: profession.color }}>
                  {i + 1}
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadCaptureInline
        profession={professionSlug}
        professionName={profession.name}
        color={profession.color}
        resourceName="First Year Survival Checklist"
        resourceType="first-year-checklist"
      />

      <section className="py-12 bg-white" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Your {profession.shortName} Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href={`/new-grad/${professionSlug}`} className="group" data-testid="crosslink-profession-hub">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all h-full">
                <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: profession.color }} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{profession.shortName} New Grad Hub</h3>
                  <p className="text-xs text-gray-500">{t("pages.newGrad.firstYearGuidePage.completeCareerResourcesAndGuides")}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
              </div>
            </Link>
            {examLink && (
              <Link href={examLink.href} className="group" data-testid="crosslink-exam-prep">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all h-full">
                  <GraduationCap className="w-5 h-5 flex-shrink-0" style={{ color: profession.color }} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{examLink.label}</h3>
                    <p className="text-xs text-gray-500">{t("pages.newGrad.firstYearGuidePage.practiceExamsAndStudyTools")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                </div>
              </Link>
            )}
            <Link href="/new-grad" className="group" data-testid="crosslink-all-professions">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all h-full">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{t("pages.newGrad.firstYearGuidePage.allProfessions")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.newGrad.firstYearGuidePage.exploreGuidesForOtherHealthcare")}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
              </div>
            </Link>
          </div>
          {relatedGuides.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("pages.newGrad.firstYearGuidePage.relatedFirstYearGuides")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedGuides.map((rg, i) => (
                  <Link key={rg.slug} href={`/new-grad/${rg.slug}-first-year-guide`} className="group" data-testid={`crosslink-related-guide-${i}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">{rg.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 flex-shrink-0 ml-auto" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-guide-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.newGrad.firstYearGuidePage.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-xl p-4 group" data-testid={`faq-${i}`}>
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <InternalLinks currentPath={`/new-grad/${professionSlug}-first-year-guide`} profession={professionSlug} professionName={profession.name} />
      <Footer />
    </div>
  );
}
