import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { LocaleLink } from "@/lib/LocaleLink";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Shield, Star, ChevronRight, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ComparisonData {
  seoTitle: string;
  seoDescription: string;
  seoKeyword: string;
  heroTitle: string;
  heroSubtitle: string;
  competitorName: string;
  competitorPrice: string;
  nurseNestPrice: string;
  features: { feature: string; nurseNest: boolean | string; competitor: boolean | string }[];
  pricingNote: string;
  faqs: { question: string; answer: string }[];
  hubLinks: { label: string; href: string }[];
}

const comparisonData: Record<string, ComparisonData> = {
  "nursenest-vs-uworld": {
    seoTitle: "NurseNest vs UWorld NCLEX: Compare Features & Pricing (2025)",
    seoDescription: "Compare NurseNest ($4.99/mo) vs UWorld ($69/mo) for NCLEX prep. See feature-by-feature comparison of question banks, adaptive testing, flashcards, and NCLEX-PN / REx-PN support.",
    seoKeyword: "nursenest vs uworld nclex prep comparison",
    heroTitle: "NurseNest vs UWorld: Which NCLEX Prep Is Right for You?",
    heroSubtitle: "UWorld charges $69/month for a question bank alone. NurseNest gives you questions, flashcards, adaptive testing, and full NCLEX-PN / REx-PN support — starting at $4.99/month.",
    competitorName: "UWorld",
    competitorPrice: "$69/mo",
    nurseNestPrice: "$4.99/mo",
    features: [
      { feature: "Monthly Price", nurseNest: "$4.99/mo", competitor: "$69/mo" },
      { feature: "Annual Plan Available", nurseNest: "$39/year ($3.25/mo)", competitor: "No annual plan" },
      { feature: "Practice Questions", nurseNest: "4,000+", competitor: "2,100+" },
      { feature: "Next-Gen Item Types (SATA, DnD, Hotspot)", nurseNest: true, competitor: true },
      { feature: "Unlimited Flashcards", nurseNest: true, competitor: false },
      { feature: "AI Flashcard Generation", nurseNest: true, competitor: false },
      { feature: "Spaced Repetition System", nurseNest: true, competitor: false },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: true },
      { feature: "Detailed Rationales", nurseNest: true, competitor: true },
      { feature: "Performance Analytics", nurseNest: true, competitor: true },
      { feature: "NCLEX-PN / REx-PN Support", nurseNest: true, competitor: false },
      { feature: "Canadian Dollar (CAD) Pricing", nurseNest: true, competitor: false },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "Medication Mastery Tool", nurseNest: true, competitor: false },
      { feature: "Safety Hazard Simulator", nurseNest: true, competitor: false },
      { feature: "Free Tier Available", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest Pro costs 93% less than UWorld while offering more study tools including flashcards, clinical simulations, and NCLEX-PN / REx-PN exam support.",
    faqs: [
      { question: "Is NurseNest as good as UWorld for NCLEX prep?", answer: "NurseNest offers 4,000+ NCLEX-style questions with detailed rationales, adaptive CAT testing, and additional tools like flashcards, clinical simulations, and video lectures — all at a fraction of UWorld's price. Many students switch from UWorld to NurseNest for better value." },
      { question: "Does NurseNest have the same question quality as UWorld?", answer: "NurseNest questions are written by nurse educators and cover all NCLEX-RN, NCLEX-PN, and REx-PN test plan categories including next-gen item types like select-all-that-apply, drag-and-drop, and hotspot questions. Each question includes detailed rationales explaining correct and incorrect answer choices." },
      { question: "Can I use NurseNest for Canadian REx-PN preparation?", answer: "Yes. NurseNest is one of the few platforms with dedicated REx-PN content, Canadian pricing in CAD, and exam-specific practice modes — something UWorld does not offer. NurseNest also supports French language for Quebec nursing students." },
      { question: "Does NurseNest offer a money-back guarantee?", answer: "Yes. NurseNest offers a 30-day money-back guarantee on all subscriptions. If you're not satisfied, you receive a full refund — no questions asked. UWorld does not offer a comparable guarantee." },
      { question: "What extra features does NurseNest have that UWorld doesn't?", answer: "NurseNest includes unlimited AI-generated flashcards, spaced repetition, clinical case simulations, medication mastery tools, video micro-lectures, a safety hazard simulator, and NCLEX-PN / REx-PN support — all included in the subscription at a fraction of UWorld's price." },
      { question: "Is UWorld worth the price for NCLEX prep?", answer: "UWorld is a quality question bank, but at $69/month it's one of the most expensive options. NurseNest provides more features — including flashcards, clinical simulations, and video lectures — for $4.99/month, making it a better value for most nursing students." },
      { question: "Does NurseNest have a free option unlike UWorld?", answer: "Yes. NurseNest offers free access to clinical lessons, a daily practice question, and limited flashcard creation with no credit card required. UWorld does not offer a free tier." },
    ],
    hubLinks: [
      { label: "Browse NCLEX Lessons", href: "/lessons" },
      { label: "Try Free Practice Questions", href: "/question-of-the-day" },
      { label: "Explore Mock Exams", href: "/mock-exams" },
      { label: "View All Flashcard Decks", href: "/flashcards" },
      { label: "See All Comparison Pages", href: "/compare/cheapest-nclex-prep" },
    ],
  },
  "nursenest-vs-archer": {
    seoTitle: "NurseNest vs Archer NCLEX Review: Features & Pricing (2025)",
    seoDescription: "Compare NurseNest ($4.99/mo) vs Archer ($59/quarter) for NCLEX prep. Feature comparison of question banks, flashcards, adaptive testing, and Canadian exam support.",
    seoKeyword: "nursenest vs archer nclex review comparison",
    heroTitle: "NurseNest vs Archer Review: Full Feature Comparison",
    heroSubtitle: "Archer charges $59/quarter for question bank access. NurseNest includes questions, flashcards, simulations, and Canadian exam support from $4.99/month.",
    competitorName: "Archer",
    competitorPrice: "$59/quarter",
    nurseNestPrice: "$4.99/mo",
    features: [
      { feature: "Monthly Price", nurseNest: "$4.99/mo", competitor: "~$20/mo (billed quarterly)" },
      { feature: "Annual Plan Available", nurseNest: "$39/year ($3.25/mo)", competitor: "No annual plan" },
      { feature: "Practice Questions", nurseNest: "4,000+", competitor: "1,800+" },
      { feature: "Next-Gen Item Types (SATA, DnD, Hotspot)", nurseNest: true, competitor: "Limited" },
      { feature: "Unlimited Flashcards", nurseNest: true, competitor: false },
      { feature: "AI Flashcard Generation", nurseNest: true, competitor: false },
      { feature: "Spaced Repetition System", nurseNest: true, competitor: false },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: true },
      { feature: "Readiness Predictor / Pass Probability", nurseNest: true, competitor: true },
      { feature: "Detailed Rationales", nurseNest: true, competitor: true },
      { feature: "Performance Analytics", nurseNest: true, competitor: "Basic" },
      { feature: "NCLEX-PN / REx-PN Support", nurseNest: true, competitor: false },
      { feature: "Canadian Dollar (CAD) Pricing", nurseNest: true, competitor: false },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "Medication Mastery Tool", nurseNest: true, competitor: false },
      { feature: "Safety Hazard Simulator", nurseNest: true, competitor: false },
      { feature: "Free Tier Available", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest Pro costs 75% less than Archer on a monthly basis with more learning tools including flashcards, clinical simulations, and NCLEX-PN / REx-PN exam content.",
    faqs: [
      { question: "Is NurseNest better than Archer for NCLEX prep?", answer: "NurseNest offers more practice questions (4,000+ vs 1,800+), unlimited flashcards, clinical simulations, and dedicated NCLEX-PN / REx-PN exam support — all at a lower price than Archer. Both platforms offer adaptive testing, but NurseNest includes more comprehensive study tools." },
      { question: "Does Archer offer Canadian REx-PN content?", answer: "No. Archer focuses exclusively on NCLEX-RN preparation for US students. NurseNest supports both NCLEX-RN and Canadian REx-PN exams with region-specific content, CAD pricing, and French language support." },
      { question: "Which has better adaptive testing — NurseNest or Archer?", answer: "Both platforms offer computer adaptive testing (CAT) that mirrors real exam logic. NurseNest additionally provides probability readiness scoring to estimate your pass likelihood and detailed performance analytics across all NCLEX categories." },
      { question: "Does Archer have flashcards?", answer: "No. Archer does not include flashcards or spaced repetition tools. NurseNest includes unlimited AI-powered flashcard generation, pre-built nursing decks, and a spaced repetition system — all included in the subscription." },
      { question: "Does NurseNest have a free option?", answer: "Yes. NurseNest offers free access to clinical lessons, a daily question, and limited flashcard creation — no credit card required. You can upgrade to Pro for full access starting at $4.99/month." },
      { question: "Can I try NurseNest before committing?", answer: "Yes. NurseNest offers free content access and a 30-day money-back guarantee on paid subscriptions, so you can try it risk-free. Archer does not offer a comparable guarantee." },
      { question: "What study tools does NurseNest have that Archer doesn't?", answer: "NurseNest includes AI-generated flashcards, spaced repetition, clinical case simulations, medication mastery tools, video micro-lectures, a safety hazard simulator, and NCLEX-PN / REx-PN content — none of which are available on Archer." },
    ],
    hubLinks: [
      { label: "Browse NCLEX Lessons", href: "/lessons" },
      { label: "Try Free Practice Questions", href: "/question-of-the-day" },
      { label: "Explore Mock Exams", href: "/mock-exams" },
      { label: "View Pricing Plans", href: "/pricing" },
      { label: "Compare UWorld vs Archer vs NurseNest", href: "/compare/uworld-vs-archer-vs-nursenest" },
    ],
  },
  "nursenest-vs-quizlet": {
    seoTitle: "NurseNest vs Quizlet for Nursing: Compare Features (2025)",
    seoDescription: "Compare NurseNest ($4.99/mo) vs Quizlet+ ($7.99/mo) for nursing exam prep. See why purpose-built nursing tools outperform generic flashcard apps.",
    seoKeyword: "nursenest vs quizlet nursing flashcards comparison",
    heroTitle: "NurseNest vs Quizlet: Purpose-Built Nursing Prep vs Generic Flashcards",
    heroSubtitle: "Quizlet+ costs $7.99/month for generic flashcards. NurseNest gives you nursing-specific questions, AI flashcards, adaptive exams, and clinical simulations for less.",
    competitorName: "Quizlet+",
    competitorPrice: "$7.99/mo",
    nurseNestPrice: "$4.99/mo",
    features: [
      { feature: "Monthly Price", nurseNest: "$4.99/mo", competitor: "$7.99/mo" },
      { feature: "NCLEX Practice Questions", nurseNest: "4,000+", competitor: "None (user-generated only)" },
      { feature: "AI Flashcard Generation", nurseNest: true, competitor: true },
      { feature: "Spaced Repetition", nurseNest: true, competitor: true },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: false },
      { feature: "Nursing-Specific Content", nurseNest: true, competitor: false },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Detailed NCLEX Rationales", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest costs 38% less than Quizlet+ while offering purpose-built nursing exam preparation tools.",
    faqs: [
      { question: "Is NurseNest better than Quizlet for nursing students?", answer: "Yes. While Quizlet is a general-purpose flashcard tool, NurseNest is purpose-built for nursing exam preparation with NCLEX-style questions, adaptive testing, clinical simulations, and expert-written rationales." },
      { question: "Does NurseNest have flashcards like Quizlet?", answer: "Yes. NurseNest includes unlimited AI-powered flashcard generation, spaced repetition, and pre-built nursing decks — plus 4,000+ practice questions that Quizlet doesn't offer." },
      { question: "Why should I pay for NurseNest instead of using free Quizlet decks?", answer: "Free Quizlet nursing decks are user-generated and often contain errors. NurseNest content is created by nurse educators, clinically verified, and aligned with official NCLEX-RN, NCLEX-PN, and REx-PN test plans." },
      { question: "Can I import my Quizlet decks into NurseNest?", answer: "NurseNest lets you create custom flashcard decks and generate cards using AI. While direct import isn't available, AI generation makes it easy to recreate and improve your study sets." },
      { question: "Does NurseNest offer exam simulation?", answer: "Yes. NurseNest provides full-length mock exams with computer adaptive testing (CAT) that mirrors the real NCLEX-PN and REx-PN experience — something Quizlet cannot offer." },
    ],
    hubLinks: [
      { label: "Explore Flashcard Decks", href: "/flashcards" },
      { label: "Try AI Flashcard Generation", href: "/flashcards" },
      { label: "Browse Clinical Lessons", href: "/lessons" },
      { label: "View Pricing Plans", href: "/pricing" },
    ],
  },
  "best-nclex-prep-canada": {
    seoTitle: "Best NCLEX & REx-PN Prep in Canada (2025) | NurseNest",
    seoDescription: "Find the best NCLEX and REx-PN prep for Canadian nursing students. Compare features, CAD pricing, and Canadian exam-specific content across top platforms.",
    seoKeyword: "best nclex prep canada rex-pn study guide",
    heroTitle: "Best NCLEX & REx-PN Prep for Canadian Nursing Students",
    heroSubtitle: "Most NCLEX prep platforms are built for US students. NurseNest is the only platform with dedicated REx-PN content, Canadian pricing, and bilingual support.",
    competitorName: "Other Platforms",
    competitorPrice: "$59–$69/mo USD",
    nurseNestPrice: "From $29.99 CAD/mo",
    features: [
      { feature: "Canadian Dollar (CAD) Pricing", nurseNest: true, competitor: false },
      { feature: "REx-PN Exam-Specific Content", nurseNest: true, competitor: false },
      { feature: "NCLEX-RN Content", nurseNest: true, competitor: true },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Practice Questions", nurseNest: "4,000+", competitor: "Varies" },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: "Some" },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Unlimited Flashcards", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest is the only platform offering Canadian-dollar pricing with REx-PN specific content and bilingual support.",
    faqs: [
      { question: "What is the best NCLEX prep for Canadian students?", answer: "NurseNest is the top choice for Canadian nursing students because it offers REx-PN specific content, CAD pricing, French language support, and content aligned with Canadian nursing competencies." },
      { question: "Does NurseNest support REx-PN preparation?", answer: "Yes. NurseNest is one of the few platforms with dedicated REx-PN content, including practice questions, mock exams, and clinical simulations tailored to Canadian practical nursing." },
      { question: "Can I pay for NurseNest in Canadian dollars?", answer: "Yes. NurseNest offers Canadian Dollar (CAD) pricing for all subscription tiers. Plans start at $29.99 CAD/month for RPN preparation." },
      { question: "Is NurseNest available in French?", answer: "Yes. NurseNest supports French and English, making it ideal for nursing students across all Canadian provinces including Quebec." },
      { question: "How does NurseNest compare to UWorld for Canadian students?", answer: "UWorld focuses exclusively on US NCLEX preparation with USD-only pricing. NurseNest offers Canadian-specific content, REx-PN support, CAD pricing, and French language access." },
    ],
    hubLinks: [
      { label: "Browse RPN Lessons", href: "/lessons?tier=rpn" },
      { label: "Try REx-PN Mock Exams", href: "/mock-exams" },
      { label: "View Canadian Pricing", href: "/pricing" },
      { label: "Explore Clinical Simulations", href: "/case-simulations" },
    ],
  },
  "cheapest-nclex-prep": {
    seoTitle: "Cheapest NCLEX Prep 2025: Affordable Study Tools Compared",
    seoDescription: "Find the most affordable NCLEX prep in 2025. Compare NurseNest ($4.99/mo) vs UWorld ($69/mo) vs Archer ($59/quarter) vs Quizlet+ ($7.99/mo).",
    seoKeyword: "cheapest nclex prep affordable nursing exam study",
    heroTitle: "Cheapest NCLEX Prep in 2025: Full Price Comparison",
    heroSubtitle: "Don't overpay for NCLEX prep. NurseNest starts at $4.99/month — up to 93% cheaper than competitors — with more features included.",
    competitorName: "Competitors",
    competitorPrice: "$7.99–$69/mo",
    nurseNestPrice: "$4.99/mo",
    features: [
      { feature: "NurseNest Pro", nurseNest: "$4.99/mo", competitor: "—" },
      { feature: "Quizlet+", nurseNest: "—", competitor: "$7.99/mo" },
      { feature: "Archer Review", nurseNest: "—", competitor: "$59/quarter (~$20/mo)" },
      { feature: "UWorld NCLEX", nurseNest: "—", competitor: "$69/mo" },
      { feature: "Practice Questions Included", nurseNest: "4,000+", competitor: "Varies" },
      { feature: "Flashcards Included", nurseNest: true, competitor: "Quizlet only" },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: "UWorld & Archer only" },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: "Varies" },
    ],
    pricingNote: "NurseNest Pro at $4.99/month is the most affordable comprehensive NCLEX prep platform available in 2025.",
    faqs: [
      { question: "What is the cheapest NCLEX prep in 2025?", answer: "NurseNest Pro at $4.99/month is the most affordable comprehensive NCLEX prep platform, offering 4,000+ questions, adaptive testing, flashcards, and clinical simulations." },
      { question: "Is cheap NCLEX prep effective?", answer: "Yes. NurseNest's affordable pricing doesn't mean lower quality. All questions are written by nurse educators, include detailed rationales, and cover the full NCLEX-RN and REx-PN test plans." },
      { question: "How much does UWorld cost compared to NurseNest?", answer: "UWorld costs $69/month for their NCLEX question bank alone. NurseNest Pro costs $4.99/month and includes practice questions, flashcards, simulations, and video lectures — 93% less expensive." },
      { question: "Can I study for NCLEX for free?", answer: "NurseNest offers free access to clinical lessons, a daily practice question, and limited flashcard creation. For full access to 4,000+ questions and adaptive exams, Pro starts at $4.99/month." },
      { question: "Does NurseNest offer a yearly plan discount?", answer: "Yes. NurseNest offers a yearly plan at $39/year, which works out to $3.25/month — the best value for long-term NCLEX preparation." },
    ],
    hubLinks: [
      { label: "Start Free Today", href: "/start-free" },
      { label: "View All Pricing Plans", href: "/pricing" },
      { label: "Try Free Practice Questions", href: "/question-of-the-day" },
      { label: "Browse Clinical Lessons", href: "/lessons" },
    ],
  },
  "uworld-vs-archer-vs-nursenest": {
    seoTitle: "UWorld vs Archer vs NurseNest: 3-Way NCLEX Prep Comparison (2025)",
    seoDescription: "Compare UWorld ($69/mo) vs Archer ($59/quarter) vs NurseNest ($4.99/mo) for NCLEX prep. Side-by-side features, pricing, question banks, and study tools.",
    seoKeyword: "uworld vs archer vs nursenest nclex prep comparison 2025",
    heroTitle: "UWorld vs Archer vs NurseNest: Which NCLEX Prep Wins in 2025?",
    heroSubtitle: "The three most popular NCLEX prep platforms compared head-to-head. See how NurseNest stacks up against UWorld and Archer on price, features, and exam coverage.",
    competitorName: "UWorld & Archer",
    competitorPrice: "$20–$69/mo",
    nurseNestPrice: "$4.99/mo",
    features: [
      { feature: "NurseNest Monthly Price", nurseNest: "$4.99/mo", competitor: "—" },
      { feature: "UWorld Monthly Price", nurseNest: "—", competitor: "$69/mo" },
      { feature: "Archer Monthly Price", nurseNest: "—", competitor: "~$20/mo (billed quarterly)" },
      { feature: "Practice Questions", nurseNest: "4,000+", competitor: "UWorld 2,100+ / Archer 1,800+" },
      { feature: "Next-Gen Item Types", nurseNest: true, competitor: "UWorld ✓ / Archer Limited" },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: true },
      { feature: "Detailed Rationales", nurseNest: true, competitor: true },
      { feature: "Unlimited Flashcards", nurseNest: true, competitor: false },
      { feature: "AI Flashcard Generation", nurseNest: true, competitor: false },
      { feature: "Spaced Repetition System", nurseNest: true, competitor: false },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "NCLEX-PN / REx-PN Support", nurseNest: true, competitor: false },
      { feature: "Canadian Dollar (CAD) Pricing", nurseNest: true, competitor: false },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Free Tier Available", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest is 75–93% cheaper than UWorld and Archer while offering more study tools, Canadian exam support, and a free tier.",
    faqs: [
      { question: "Which is the best NCLEX prep — UWorld, Archer, or NurseNest?", answer: "It depends on your priorities. UWorld has strong rationales but costs $69/month with no flashcards or simulations. Archer offers adaptive testing at ~$20/month but lacks Canadian content. NurseNest provides the most features at $4.99/month including 4,000+ questions, flashcards, clinical simulations, and REx-PN support." },
      { question: "How do UWorld, Archer, and NurseNest question banks compare?", answer: "NurseNest has the largest question bank with 4,000+ questions, followed by UWorld (2,100+) and Archer (1,800+). All three include detailed rationales. NurseNest and UWorld support next-gen item types; Archer has limited support." },
      { question: "Which platform is cheapest for NCLEX prep?", answer: "NurseNest is the most affordable at $4.99/month ($39/year). Archer costs approximately $20/month billed quarterly. UWorld is the most expensive at $69/month with no annual discount." },
      { question: "Do any of these platforms support Canadian REx-PN?", answer: "Only NurseNest offers dedicated REx-PN content, Canadian dollar pricing, and French language support. Neither UWorld nor Archer provides Canadian-specific exam preparation." },
      { question: "Can I try any of these platforms for free?", answer: "NurseNest is the only platform offering a free tier with access to clinical lessons, daily questions, and limited flashcard creation. UWorld and Archer require paid subscriptions to access their content." },
      { question: "Which platform has the best study tools beyond questions?", answer: "NurseNest includes AI flashcards, spaced repetition, clinical simulations, video micro-lectures, medication mastery tools, and a safety hazard simulator. UWorld and Archer primarily offer question banks with rationales and limited additional tools." },
    ],
    hubLinks: [
      { label: "NurseNest vs UWorld Detailed Comparison", href: "/compare/nursenest-vs-uworld" },
      { label: "NurseNest vs Archer Detailed Comparison", href: "/compare/nursenest-vs-archer" },
      { label: "View NurseNest Pricing", href: "/pricing" },
      { label: "Start Free Today", href: "/start-free" },
    ],
  },
  "best-uworld-alternatives-nclex": {
    seoTitle: "Best UWorld Alternatives for NCLEX Prep (2025) | Cheaper & Better",
    seoDescription: "Looking for a UWorld alternative? Compare the best NCLEX prep platforms in 2025 — NurseNest, Archer, Quizlet, and more. Save up to 93% with better features.",
    seoKeyword: "best uworld alternatives nclex prep 2025 cheaper",
    heroTitle: "Best UWorld Alternatives for NCLEX Prep in 2025",
    heroSubtitle: "UWorld is popular but costs $69/month. Discover more affordable NCLEX prep alternatives with better features, more questions, and Canadian exam support.",
    competitorName: "UWorld",
    competitorPrice: "$69/mo",
    nurseNestPrice: "$4.99/mo",
    features: [
      { feature: "Monthly Price", nurseNest: "$4.99/mo", competitor: "$69/mo" },
      { feature: "Practice Questions", nurseNest: "4,000+", competitor: "2,100+" },
      { feature: "Next-Gen Item Types", nurseNest: true, competitor: true },
      { feature: "Adaptive Testing (CAT)", nurseNest: true, competitor: true },
      { feature: "Detailed Rationales", nurseNest: true, competitor: true },
      { feature: "Unlimited Flashcards & Spaced Repetition", nurseNest: true, competitor: false },
      { feature: "AI Flashcard Generation", nurseNest: true, competitor: false },
      { feature: "Clinical Case Simulations", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "Medication Mastery Tool", nurseNest: true, competitor: false },
      { feature: "Safety Hazard Simulator", nurseNest: true, competitor: false },
      { feature: "NCLEX-PN / REx-PN Content", nurseNest: true, competitor: false },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Free Tier (No Credit Card)", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest is the #1 UWorld alternative — 93% cheaper with more study tools, more questions, and Canadian exam support included.",
    faqs: [
      { question: "What is the best alternative to UWorld for NCLEX?", answer: "NurseNest is the best UWorld alternative for NCLEX prep. It offers 4,000+ practice questions, adaptive CAT testing, unlimited flashcards, clinical simulations, and video lectures — all for $4.99/month compared to UWorld's $69/month." },
      { question: "Why are students switching from UWorld to NurseNest?", answer: "Students switch because NurseNest offers more practice questions (4,000+ vs 2,100+), includes flashcards and clinical simulations that UWorld doesn't have, supports Canadian REx-PN preparation, and costs 93% less per month." },
      { question: "Is NurseNest as effective as UWorld for passing NCLEX?", answer: "Yes. NurseNest questions are written by nurse educators and aligned with the official NCLEX-RN test plan. The platform includes adaptive CAT testing, detailed rationales, and performance analytics to ensure exam readiness." },
      { question: "What UWorld alternatives are available for Canadian students?", answer: "NurseNest is the only major NCLEX prep platform that also supports Canadian REx-PN preparation with dedicated content, CAD pricing, and French language support. Other alternatives like Archer and Quizlet do not offer Canadian exam content." },
      { question: "Can I get UWorld-quality questions for less money?", answer: "Yes. NurseNest provides expert-written questions with detailed rationales covering all NCLEX test plan categories, plus next-gen item types — at $4.99/month instead of $69/month. Quality doesn't have to come at a premium price." },
      { question: "What features does NurseNest have that UWorld doesn't?", answer: "NurseNest includes AI-powered flashcards, spaced repetition, clinical case simulations, medication mastery tools, video micro-lectures, a safety hazard simulator, and Canadian REx-PN content — none of which are available on UWorld." },
    ],
    hubLinks: [
      { label: "NurseNest vs UWorld Full Comparison", href: "/compare/nursenest-vs-uworld" },
      { label: "UWorld vs Archer vs NurseNest", href: "/compare/uworld-vs-archer-vs-nursenest" },
      { label: "Cheapest NCLEX Prep 2025", href: "/compare/cheapest-nclex-prep" },
      { label: "Start Free Today", href: "/start-free" },
      { label: "View Pricing Plans", href: "/pricing" },
    ],
  },
  "best-rex-pn-question-bank-canada": {
    seoTitle: "Best REx-PN Question Bank in Canada (2025) | NurseNest",
    seoDescription: "Find the best REx-PN question bank for Canadian practical nursing exam prep. Compare question banks, CAD pricing, adaptive testing, and French language support.",
    seoKeyword: "best rex-pn question bank canada practical nursing exam 2025",
    heroTitle: "Best REx-PN Question Bank in Canada (2025)",
    heroSubtitle: "Most NCLEX prep platforms ignore Canadian practical nurses. NurseNest is the only question bank built for REx-PN with Canadian content, CAD pricing, and bilingual support.",
    competitorName: "Other Platforms",
    competitorPrice: "No REx-PN content",
    nurseNestPrice: "From $29.99 CAD/mo",
    features: [
      { feature: "REx-PN Specific Questions", nurseNest: "4,000+", competitor: "None" },
      { feature: "Aligned to Canadian PN Competencies", nurseNest: true, competitor: false },
      { feature: "Adaptive Testing (CAT) Matching REx-PN Format", nurseNest: true, competitor: false },
      { feature: "Canadian Dollar (CAD) Pricing", nurseNest: true, competitor: false },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Detailed Rationales", nurseNest: true, competitor: "N/A" },
      { feature: "REx-PN Mock Exams", nurseNest: true, competitor: false },
      { feature: "Unlimited Flashcards", nurseNest: true, competitor: false },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "Video Micro-Lectures", nurseNest: true, competitor: false },
      { feature: "Medication Mastery Tool", nurseNest: true, competitor: false },
      { feature: "Performance Analytics by PN Category", nurseNest: true, competitor: false },
      { feature: "Free Daily REx-PN Question", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "NurseNest is the only question bank purpose-built for the Canadian REx-PN exam with Canadian dollar pricing and full bilingual support.",
    faqs: [
      { question: "What is the best question bank for the REx-PN exam?", answer: "NurseNest is the best REx-PN question bank in Canada. It's the only platform with 4,000+ questions aligned to Canadian practical nursing competencies, adaptive CAT testing matching the REx-PN format, and CAD pricing." },
      { question: "Does UWorld or Archer have REx-PN questions?", answer: "No. UWorld and Archer focus exclusively on US NCLEX-RN preparation. Neither platform offers REx-PN specific content, Canadian pricing, or French language support. NurseNest is the only major platform supporting the REx-PN." },
      { question: "Can I practice for the REx-PN in French?", answer: "Yes. NurseNest supports both English and French, making it the ideal choice for practical nursing students across all Canadian provinces including Quebec. All questions and rationales are available in both languages." },
      { question: "How does NurseNest's adaptive testing match the REx-PN format?", answer: "NurseNest uses computer adaptive testing (CAT) that mirrors the actual REx-PN exam algorithm. Questions adjust difficulty based on your performance, simulating the real exam experience with Canadian-specific content." },
      { question: "Is there a free way to practice for the REx-PN?", answer: "Yes. NurseNest offers a free daily REx-PN practice question with detailed rationales, free access to clinical lessons, and limited flashcard creation — no credit card required. Upgrade to Pro for full access to 4,000+ questions." },
      { question: "How much does NurseNest cost for Canadian students?", answer: "NurseNest offers Canadian dollar pricing starting at $29.99 CAD/month for RPN preparation. Annual plans are also available at a significant discount. All plans include a 30-day money-back guarantee." },
      { question: "What topics does the REx-PN question bank cover?", answer: "NurseNest REx-PN questions cover all test plan categories including professional practice, nurse-client relationships, assessment and interventions, pharmacology, clinical judgment, and health promotion as defined by Canadian nursing regulators." },
    ],
    hubLinks: [
      { label: "Free REx-PN Practice Questions", href: "/compare/rex-pn-practice-questions-free" },
      { label: "Best NCLEX Prep in Canada", href: "/compare/best-nclex-prep-canada" },
      { label: "Browse RPN Lessons", href: "/lessons?tier=rpn" },
      { label: "Try REx-PN Mock Exams", href: "/mock-exams" },
      { label: "View Canadian Pricing", href: "/pricing" },
    ],
  },
  "rex-pn-practice-questions-free": {
    seoTitle: "Free REx-PN Practice Questions 2025 | NurseNest Canada",
    seoDescription: "Access free REx-PN practice questions for Canadian practical nursing exam prep. Daily questions, detailed rationales, and full mock exams available.",
    seoKeyword: "free rex-pn practice questions canada nursing exam",
    heroTitle: "Free REx-PN Practice Questions for Canadian Nursing Students",
    heroSubtitle: "Prepare for the REx-PN with free daily practice questions, clinical lessons, and NCLEX-style rationales — built specifically for Canadian practical nursing students.",
    competitorName: "Other Platforms",
    competitorPrice: "No REx-PN content",
    nurseNestPrice: "Free + Pro from $4.99/mo",
    features: [
      { feature: "Free Daily REx-PN Question", nurseNest: true, competitor: false },
      { feature: "REx-PN Specific Content", nurseNest: true, competitor: false },
      { feature: "Free Clinical Lessons", nurseNest: true, competitor: false },
      { feature: "Free Flashcard Access", nurseNest: "300 cards free", competitor: false },
      { feature: "Full Question Bank (Pro)", nurseNest: "4,000+ questions", competitor: "No REx-PN" },
      { feature: "Adaptive CAT Mock Exams", nurseNest: true, competitor: false },
      { feature: "Canadian Dollar Pricing", nurseNest: true, competitor: false },
      { feature: "French Language Support", nurseNest: true, competitor: false },
      { feature: "Clinical Simulations", nurseNest: true, competitor: false },
      { feature: "30-Day Money-Back Guarantee", nurseNest: true, competitor: false },
    ],
    pricingNote: "Start with free REx-PN practice questions today. Upgrade to Pro for unlimited access to 4,000+ questions and full mock exams.",
    faqs: [
      { question: "Where can I find free REx-PN practice questions?", answer: "NurseNest offers a free daily REx-PN practice question with detailed rationales, plus free access to clinical lessons and limited flashcard creation — no credit card required." },
      { question: "How many free questions does NurseNest offer?", answer: "NurseNest provides a free question of the day plus access to clinical lessons with embedded practice questions. For unlimited access to 4,000+ questions, upgrade to Pro starting at $4.99/month." },
      { question: "Is NurseNest the best platform for REx-PN prep?", answer: "NurseNest is one of the only platforms with dedicated REx-PN content, Canadian-specific nursing competencies, CAD pricing, and French language support — making it the top choice for Canadian practical nursing students." },
      { question: "Do I need a paid account to access REx-PN content?", answer: "No. You can access free daily questions, clinical lessons, and limited flashcards without paying. Pro access unlocks the full 4,000+ question bank, adaptive mock exams, and clinical simulations." },
      { question: "What topics do REx-PN practice questions cover?", answer: "NurseNest REx-PN questions cover all test plan categories including professional practice, assessment, therapeutic interventions, pharmacology, and clinical judgment as defined by Canadian nursing regulators." },
    ],
    hubLinks: [
      { label: "Free Question of the Day", href: "/question-of-the-day" },
      { label: "Browse RPN Lessons", href: "/lessons?tier=rpn" },
      { label: "Try Free Flashcards", href: "/flashcards" },
      { label: "View Canadian Pricing", href: "/pricing" },
    ],
  },
};

function FeatureTable({ features, nurseNestLabel, competitorLabel }: {
  features: ComparisonData["features"];
  nurseNestLabel: string;
  competitorLabel: string;
}) {
  return (
    <div className="overflow-x-auto" data-testid="comparison-feature-table">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("compare.featureColumn")}</th>
            <th className="text-center py-3 px-4 font-semibold bg-primary/5 text-primary">NurseNest</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-500">{competitorLabel}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50" data-testid={`row-feature-${i}`}>
              <td className="py-3 px-4 font-medium text-gray-700">{row.feature}</td>
              <td className="text-center py-3 px-4 bg-primary/5">
                {typeof row.nurseNest === "boolean" ? (
                  row.nurseNest ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                ) : <span className="font-semibold text-primary">{row.nurseNest}</span>}
              </td>
              <td className="text-center py-3 px-4">
                {typeof row.competitor === "boolean" ? (
                  row.competitor ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                ) : <span className="text-gray-600">{row.competitor}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComparePage() {
  const [, params] = useRoute("/compare/:slug");
  const slug = params?.slug || "";
  const data = comparisonData[slug];
  const { user } = useAuth();
  const { t } = useI18n();

  if (!data) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center" data-testid="text-compare-not-found">
            <h1 className="text-2xl font-bold mb-4">{t("compare.notFound")}</h1>
            <p className="text-gray-500 mb-6">{t("compare.notFoundDesc")}</p>
            <LocaleLink href="/pricing">
              <Button data-testid="button-view-pricing">{t("compare.viewPricing")}</Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <AdminEditButton />
      <SEO
        title={data.seoTitle}
        description={data.seoDescription}
        keywords={data.seoKeyword}
        canonicalPath={`/compare/${slug}`}
        structuredData={faqSchema}
      />
      <Navigation />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <BreadcrumbNav title={data.heroTitle} />
        </div>
        <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 px-4" data-testid="section-compare-hero">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-primary/10 text-primary mb-4 px-4 py-1.5" data-testid="badge-compare">
              <Star className="w-3 h-3 mr-1.5" /> {t("compare.comparisonGuide")}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-compare-title">
              {data.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8" data-testid="text-compare-subtitle">
              {data.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <LocaleLink href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-compare-dashboard">
                    {t("compare.viewDashboard")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </LocaleLink>
              ) : (
                <LocaleLink href="/start-free">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-compare-start-free">
                    {t("compare.startFree")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </LocaleLink>
              )}
              <LocaleLink href="/pricing">
                <Button size="lg" variant="outline" className="px-8" data-testid="button-compare-pricing">
                  {t("compare.viewPricing")}
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-compare-pricing">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-primary/20 bg-primary/5" data-testid="card-nursenest-price">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-primary mb-1">{t("compare.nurseNestPro")}</p>
                  <p className="text-4xl font-bold text-primary">{data.nurseNestPrice}</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium" data-testid="text-guarantee-nursenest">{t("compare.guaranteeShort")}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200" data-testid="card-competitor-price">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-gray-500 mb-1">{data.competitorName}</p>
                  <p className="text-4xl font-bold text-gray-400">{data.competitorPrice}</p>
                  <p className="mt-3 text-sm text-gray-400">{t("compare.noGuarantee")}</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-sm text-gray-500 italic" data-testid="text-pricing-note">{data.pricingNote}</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50/50" data-testid="section-compare-table">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-feature-heading">
              {t("compare.featureComparison")}
            </h2>
            <Card className="overflow-hidden">
              <FeatureTable
                features={data.features}
                nurseNestLabel="NurseNest"
                competitorLabel={data.competitorName}
              />
            </Card>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-compare-cta">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">{t("compare.readyToStudy")}</h2>
            <p className="text-gray-600 mb-6">{t("compare.readyToStudyDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <LocaleLink href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-cta-dashboard">
                    {t("compare.viewDashboard")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </LocaleLink>
              ) : (
                <LocaleLink href="/start-free">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-cta-start-free">
                    {t("compare.startFreeToday")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </LocaleLink>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium" data-testid="text-guarantee-cta">{t("compare.guarantee")}</span>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50/50" data-testid="section-compare-faq">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-faq-heading">
              {t("compare.faqHeading")}
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <Card key={i} data-testid={`card-faq-${i}`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2" data-testid={`text-faq-question-${i}`}>{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed" data-testid={`text-faq-answer-${i}`}>{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4" data-testid="section-compare-links">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6" data-testid="text-links-heading">{t("compare.exploreMore")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.hubLinks.map((link, i) => (
                <LocaleLink key={i} href={link.href}>
                  <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer" data-testid={`link-hub-${i}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="font-medium text-gray-700">{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
