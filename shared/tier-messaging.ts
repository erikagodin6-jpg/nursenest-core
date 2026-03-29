export interface TierHeroConfig {
  headline: string;
  subheadline: string;
  stats: { value: string; label: string }[];
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  badges: string[];
}

export interface TierCtaConfig {
  steps: { title: string; description: string }[];
  heading: string;
  subtext: string;
}

export interface TierTestimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface TierTrustConfig {
  testimonials: TierTestimonial[];
  stats: { value: string; label: string }[];
}

export interface TierMessaging {
  hero: TierHeroConfig;
  cta: TierCtaConfig;
  trust: TierTrustConfig;
  examLabel: string;
  requiredKeywords: string[];
  forbiddenTerms: string[];
}

export const TIER_MESSAGING: Record<string, TierMessaging> = {
  rpn: {
    examLabel: "REx-PN",
    requiredKeywords: ["REx-PN", "RPN"],
    forbiddenTerms: [],
    hero: {
      headline: "Retain More. Stress Less. Pass the REx-PN.",
      subheadline: "Our retention-focused learning system uses active recall and spaced repetition to help you master nursing exam prep concepts — so you remember what matters on REx-PN exam day.",
      stats: [
        { value: "240+", label: "RPN Lessons" },
        { value: "12", label: "Body Systems" },
        { value: "1000+", label: "Practice Questions" },
      ],
      primaryCta: { text: "Start Studying Smarter", href: "/register" },
      secondaryCta: { text: "Explore Practice Questions", href: "/exam-prep" },
      badges: ["Active Recall Learning", "REx-PN Aligned", "Spaced Repetition"],
    },
    cta: {
      steps: [
        { title: "Learn the Concept", description: "Understand disease processes in simple, practical clinical terms" },
        { title: "Practice REx-PN Questions", description: "Apply knowledge to exam-style questions with detailed rationales" },
        { title: "Identify Weak Areas", description: "Focus your review on topics that need the most attention" },
        { title: "Build Exam Confidence", description: "Enter your REx-PN feeling prepared and in control" },
      ],
      heading: "Feel Confident Going Into the REx-PN",
      subtext: "Lessons, practice questions, and exam-aligned explanations designed for practical nursing students.",
    },
    trust: {
      testimonials: [
        {
          name: "Priya S.",
          role: "RPN Student, Ontario",
          text: "I passed the REx-PN on my first attempt using NurseNest. The practice questions and clinical simulations were incredibly close to the real exam.",
          rating: 5,
        },
        {
          name: "Jessica L.",
          role: "Practical Nursing Student",
          text: "The study path tells me exactly what to review next, and the questions are at my level. I actually look forward to studying now.",
          rating: 5,
        },
      ],
      stats: [
        { value: "93%", label: "RPN Pass Rate" },
        { value: "4.8/5", label: "Student Rating" },
        { value: "15,000+", label: "RPN Students" },
      ],
    },
  },
  rn: {
    examLabel: "NCLEX-RN",
    requiredKeywords: ["NCLEX-RN", "NCLEX", "RN"],
    forbiddenTerms: ["REx-PN"],
    hero: {
      headline: "Learn Deeper. Remember Longer. Pass the NCLEX-RN.",
      subheadline: "Our evidence-based learning system combines clinical scenarios, active recall, and spaced repetition to strengthen NCLEX preparation — so you retain nursing concepts and pass on your first attempt.",
      stats: [
        { value: "500+", label: "RN Lessons" },
        { value: "12", label: "Body Systems" },
        { value: "3000+", label: "Practice Questions" },
        { value: "Adaptive", label: "Exam Simulator" },
      ],
      primaryCta: { text: "Start Studying Smarter", href: "/register" },
      secondaryCta: { text: "Explore Practice Questions", href: "/nclex-rn-practice-questions" },
      badges: ["Active Recall Learning", "NCLEX Preparation", "Spaced Repetition"],
    },
    cta: {
      steps: [
        { title: "Learn the Pathophysiology", description: "Understand the mechanisms behind each disease process at a clinical level" },
        { title: "Practice NCLEX Reasoning", description: "Solve questions the way NCLEX actually tests critical thinking" },
        { title: "Identify Weak Systems", description: "Target body systems and topics where you need focused review" },
        { title: "Simulate the Exam", description: "Build stamina and confidence with adaptive exam simulation" },
      ],
      heading: "Ready to Pass NCLEX-RN?",
      subtext: "Deep clinical lessons, thousands of practice questions, and an adaptive exam simulator built for nursing students.",
    },
    trust: {
      testimonials: [
        {
          name: "James K.",
          role: "RN Student, British Columbia",
          text: "The adaptive question bank helped me identify my weak areas. After 3 months of studying with NurseNest, I passed the NCLEX-RN with confidence.",
          rating: 5,
        },
        {
          name: "Emily R.",
          role: "RN Student, California",
          text: "As an international student, I needed extra support preparing for the NCLEX-RN. NurseNest's step-by-step rationales helped me understand the clinical reasoning behind each answer.",
          rating: 5,
        },
      ],
      stats: [
        { value: "95%", label: "NCLEX-RN Pass Rate" },
        { value: "4.9/5", label: "Student Rating" },
        { value: "50,000+", label: "RN Students" },
      ],
    },
  },
  np: {
    examLabel: "NP Board",
    requiredKeywords: ["NP", "Nurse Practitioner", "Certification", "Advanced"],
    forbiddenTerms: ["REx-PN"],
    hero: {
      headline: "Think Critically. Retain Deeply. Certify as an NP.",
      subheadline: "Our retention-focused healthcare study platform uses clinical decision training and spaced repetition to build lasting diagnostic reasoning for NP certification exam performance.",
      stats: [
        { value: "800+", label: "Advanced Lessons" },
        { value: "Multi-system", label: "Pathophysiology" },
        { value: "Clinical", label: "Reasoning Modules" },
      ],
      primaryCta: { text: "Start Studying Smarter", href: "/register" },
      secondaryCta: { text: "Explore Practice Questions", href: "/np-exam-practice-questions" },
      badges: ["Clinical Decision Training", "Spaced Repetition", "NP Certification"],
    },
    cta: {
      steps: [
        { title: "Master Advanced Pathophysiology", description: "Deepen understanding of complex multi-system disease processes" },
        { title: "Apply Diagnostic Reasoning", description: "Develop clinical decision-making skills for differential diagnosis" },
        { title: "Integrate Pharmacotherapeutics", description: "Connect pathophysiology to evidence-based prescribing decisions" },
        { title: "Prepare for Certification", description: "Strengthen exam performance with advanced practice-level content" },
      ],
      heading: "Strengthen Your NP Clinical Reasoning",
      subtext: "Advanced pathophysiology, diagnostic reasoning, and pharmacotherapeutics for NP certification success.",
    },
    trust: {
      testimonials: [
        {
          name: "Sarah M.",
          role: "NP Student, Alberta",
          text: "NurseNest's NP-level content is the most thorough I have found. The pharmacology flashcards and differential diagnosis practice were essential for my AANP exam.",
          rating: 5,
        },
        {
          name: "Dr. Rachel T.",
          role: "Family NP Graduate",
          text: "The advanced clinical reasoning modules and board-style questions were exactly what I needed for NP certification. The depth of content is unmatched.",
          rating: 5,
        },
      ],
      stats: [
        { value: "97%", label: "NP Pass Rate" },
        { value: "4.9/5", label: "Graduate Rating" },
        { value: "10,000+", label: "NP Students" },
      ],
    },
  },
};

export const DEFAULT_HERO: TierHeroConfig = {
  headline: "Learn Faster. Remember Longer. Pass Your Exams.",
  subheadline: "A retention-focused healthcare exam preparation system built on active recall, spaced repetition, and clinical scenarios — designed to help you master nursing concepts and pass with confidence.",
  stats: [
    { value: "500+", label: "Lessons" },
    { value: "12", label: "Body Systems" },
    { value: "1000+", label: "Practice Questions" },
  ],
  primaryCta: { text: "Start Studying Smarter", href: "/register" },
  secondaryCta: { text: "Explore Practice Questions", href: "/exam-prep" },
  badges: ["Active Recall Learning", "Exam Blueprint Aligned", "Spaced Repetition"],
};

export const DEFAULT_CTA: TierCtaConfig = {
  steps: [
    { title: "Learn the Concept", description: "Understand disease processes in clear, practical clinical terms" },
    { title: "Practice Exam Questions", description: "Apply knowledge to exam-style questions with detailed rationales" },
    { title: "Identify Weak Areas", description: "Focus your review on topics that need the most attention" },
    { title: "Build Exam Confidence", description: "Enter your exam feeling prepared and in control" },
  ],
  heading: "Ready to Pass Your Nursing Exam?",
  subtext: "Lessons, practice questions, and exam-aligned explanations designed for your study path.",
};

export function getTierHero(tier: string): TierHeroConfig {
  const normalized = tier === "pharmacology" ? "rpn" : tier;
  return TIER_MESSAGING[normalized]?.hero || DEFAULT_HERO;
}

export function getTierCta(tier: string): TierCtaConfig {
  const normalized = tier === "pharmacology" ? "rpn" : tier;
  return TIER_MESSAGING[normalized]?.cta || DEFAULT_CTA;
}

export function getTierTrust(tier: string): TierTrustConfig | null {
  const normalized = tier === "pharmacology" ? "rpn" : tier;
  return TIER_MESSAGING[normalized]?.trust || null;
}

export function validateTierMessaging(tier: string, title: string, summary: string): { valid: boolean; error?: string } {
  const normalized = tier === "pharmacology" ? "rpn" : tier;
  const config = TIER_MESSAGING[normalized];
  if (!config) return { valid: true };

  const lowerTitle = title.toLowerCase();
  const lowerSummary = summary.toLowerCase();

  for (const term of config.forbiddenTerms) {
    if (lowerTitle.includes(term.toLowerCase()) || lowerSummary.includes(term.toLowerCase())) {
      return {
        valid: false,
        error: `${normalized.toUpperCase()} tier content contains "${term}" which is specific to another tier. Use ${config.examLabel} terminology instead.`,
      };
    }
  }

  return { valid: true };
}
