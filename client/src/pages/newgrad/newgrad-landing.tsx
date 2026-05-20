import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContentGate } from "@/components/content-gate";
import { useAuth } from "@/lib/auth";
import { useNewGradEntitlements } from "./premium-cta";
import { NEWGRAD_GUIDES } from "@/data/newgrad/guide-content";
import { RESUME_TEMPLATES, INTERVIEW_QUESTION_BANK, CAREER_FRAMEWORKS, SALARY_DATA } from "@/data/newgrad/premium-toolkit";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  ArrowRight, BookOpen, FileText, MessageSquare, Users, Heart,
  DollarSign, Award, TrendingUp, Star, CheckCircle2, Lock,
  Sparkles, GraduationCap, Briefcase, Shield, Target, ChevronRight,
  ChevronDown, HelpCircle, Zap, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
const GUIDE_CARDS = [
  { slug: "guides", title: "Survival Guides", desc: "Transition to practice, shift organization, documentation, and communication essentials.", icon: BookOpen, color: "#6C63FF" },
  { slug: "career", title: "Career Pathways", desc: "Specialization options, continuing education, and leadership development.", icon: TrendingUp, color: "#10B981" },
  { slug: "interview", title: "Interview Prep", desc: "100+ behavioral and clinical questions with STAR framework answers.", icon: MessageSquare, color: "#F59E0B" },
  { slug: "resume", title: "Resume & Applications", desc: "ATS-optimized templates, cover letter frameworks, and application strategies.", icon: FileText, color: "#8B5CF6" },
  { slug: "workplace", title: "Workplace Navigation", desc: "Professional boundaries, team dynamics, and conflict resolution.", icon: Users, color: "#EC4899" },
  { slug: "burnout", title: "Burnout Prevention", desc: "Wellness strategies, self-care practices, and mental health resources.", icon: Heart, color: "#EF4444" },
  { slug: "salary", title: "Salary & Negotiation", desc: "Regional salary data, benefits analysis, and negotiation strategies.", icon: DollarSign, color: "#059669" },
  { slug: "professional-development", title: "Professional Growth", desc: "Career planning frameworks, certification pathways, and portfolio building.", icon: Award, color: "#2563EB" },
  { slug: "clinical-references", title: "Clinical References", desc: "High-acuity clinical guides: sepsis, DKA, hemorrhage, ICU monitoring, cardiac emergencies, and more.", icon: AlertTriangle, color: "#DC2626" },
];

const PREMIUM_FEATURES = [
  { title: "Resume Templates", desc: "4 ATS-optimized nursing resume templates for Med-Surg, ICU, ER, and Pediatrics", icon: FileText },
  { title: "Interview Question Bank", desc: "8+ detailed interview questions with STAR answers, tips, and difficulty ratings", icon: MessageSquare },
  { title: "Salary Data & Negotiation", desc: "Regional salary comparisons and proven negotiation frameworks", icon: DollarSign },
  { title: "Career Planning Frameworks", desc: "Clinical ladder, advanced practice, and leadership career pathways", icon: Target },
  { title: "Portfolio Templates", desc: "Professional portfolio structure with 10 essential sections", icon: Briefcase },
  { title: "Cover Letter Framework", desc: "Customizable cover letter template with unit-specific variations", icon: FileText },
];

const FAQ_DATA = [
  { question: "Is this for Canadian or American nurses?", answer: "Both! Our career guidance, interview prep, and salary data cover both Canadian and American nursing contexts. We include region-specific information for licensing, salary expectations, and workplace norms." },
  { question: "Do I need this if I already have a nursing job?", answer: "Absolutely. Our guides cover workplace navigation, burnout prevention, salary negotiation, and professional development — all essential topics for nurses already in practice. The career pathways and continuing education content helps you plan your next career steps." },
  { question: "What's included in the free content?", answer: "Free users get access to all guide overviews, clinical scenarios, strategies, tips, and professional insights across all 8 categories. The premium New Grad Success Toolkit adds resume templates, interview question banks, salary data tables, career planning frameworks, and portfolio templates." },
  { question: "How is the premium toolkit different from free content?", answer: "The free guides provide comprehensive career advice and strategies. The premium toolkit adds actionable tools: downloadable resume templates, a bank of interview questions with model STAR answers, detailed salary comparison data by region, and structured career planning frameworks." },
  { question: "Can I use this while still in nursing school?", answer: "Yes! We recommend starting 3-6 months before graduation. Begin with interview prep and resume building so you're ready to apply the moment you pass your licensing exam." },
  { question: "Is there a money-back guarantee?", answer: "Yes. We offer a 14-day money-back guarantee on the New Grad Success Toolkit subscription." },
];

export default function NewGradLanding() {
  const { t } = useI18n();
  const { effectiveTier, user } = useAuth();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { hasAnyPremium: hasAccess } = useNewGradEntitlements();

  const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

  return (
    <div className="min-h-screen bg-gray-50" data-testid="newgrad-landing-page">
      <Navigation />
      <SEO
        title={t("pages.newgrad.newgradLanding.newGradCareerHubInterview")}
        description={t("pages.newgrad.newgradLanding.launchYourNursingCareerWith")}
        keywords="new grad nurse interview prep, new graduate nurse resume template, first year nurse survival guide, nursing salary negotiation, new grad nurse career tools, nursing career development, STAR interview answers"
        canonicalPath="/newgrad"
        structuredData={faqStructuredData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Career Hub", url: "https://www.nursenest.ca/newgrad" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-newgrad-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-100 text-blue-700" data-testid="badge-newgrad-hub">
              <GraduationCap className="w-3 h-3 mr-1" /> New Grad Career Hub
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-newgrad-title">
              Navigate Your First Year of Nursing With Confidence
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8" data-testid="text-newgrad-subtitle">
              Free survival guides, 100+ STAR-framework interview questions, ATS-optimized resume templates, salary negotiation scripts, and burnout prevention strategies — built specifically for new graduate nurses in Canada and the US.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/newgrad/guides">
                <Button size="lg" className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700 px-8" data-testid="button-explore-guides">
                  <BookOpen className="w-4 h-4" /> Read Free Survival Guides
                </Button>
              </Link>
              {!hasAccess && (
                <Link href="/subscribe/newgrad">
                  <Button size="lg" variant="outline" className="rounded-full gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8" data-testid="button-get-toolkit">
                    <Sparkles className="w-4 h-4" /> Get the Success Toolkit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="section-guide-cards">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-guides-heading">
            9 Free Career Guides for New Graduate Nurses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive, evidence-based content covering every aspect of your transition from nursing student to confident clinician.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUIDE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.slug} href={`/newgrad/${card.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-gray-100" data-testid={`card-guide-${card.slug}`}>
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-blue-700 transition-colors" data-testid={`text-card-title-${card.slug}`}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-3">
                      Read Guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-14" data-testid="section-premium-toolkit">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200" data-testid="badge-premium">
              <Star className="w-3 h-3 mr-1" /> New Grad Success Toolkit
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-premium-heading">
              Actionable Career Tools for New Graduates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Go beyond guidance with actionable career tools: resume templates, interview question banks, salary data, and career planning frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {PREMIUM_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="border-gray-100" data-testid={`card-premium-feature-${i}`}>
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <ContentGate visibility="preview" requiredTier="newgrad" featureName="the New Grad Success Toolkit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" /> Resume Templates Preview
                  </h3>
                  {RESUME_TEMPLATES.slice(0, 2).map((t) => (
                    <div key={t.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-900">{t.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" /> Interview Questions Preview
                  </h3>
                  {INTERVIEW_QUESTION_BANK.slice(0, 2).map((q) => (
                    <div key={q.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-900">{q.question}</h4>
                      <Badge variant="outline" className="text-[10px] mt-1">{q.category}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </ContentGate>

          {!hasAccess && (
            <div className="mt-8 text-center">
              <Link href="/subscribe/newgrad">
                <Button size="lg" className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 shadow-lg" data-testid="button-unlock-toolkit">
                  <Sparkles className="w-4 h-4" /> Unlock the Full Toolkit — Starting at $14.99/mo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="section-faq">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.newgrad.newgradLanding.frequentlyAskedQuestions")}</h2>
        <div className="space-y-3">
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${i}`}>
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                data-testid={`button-faq-${i}`}
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-500" />
                  <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 pl-12" data-testid={`text-faq-answer-${i}`}>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-14" data-testid="section-cta-bottom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Launch Your Nursing Career?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Get free survival guides, interview prep, and career tools — or unlock the full Success Toolkit with resume templates, salary data, and career planning frameworks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/newgrad/guides">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 gap-2" data-testid="button-start-guides">
                <BookOpen className="w-4 h-4" /> Read Free Survival Guides
              </Button>
            </Link>
            {!hasAccess && (
              <Link href="/subscribe/newgrad">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 gap-2" data-testid="button-cta-toolkit">
                  <Sparkles className="w-4 h-4" /> Get the Success Toolkit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
