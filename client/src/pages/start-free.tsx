import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminEditButton } from "@/components/admin-edit-button";
import { useI18n } from "@/lib/i18n";
import { useLocation } from "wouter";
import {
  ArrowRight,
  Compass,
  Heart,
  Brain,
  Wind,
  Droplets,
  Activity,
  BookOpen,
  Lightbulb,
  Target,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Eye,
  Pill,
  Stethoscope,
  TrendingUp,
  Shield,
  GraduationCap,
  FileText,
  BarChart3,
  StickyNote,
  FlaskConical,
} from "lucide-react";

const previewTopics = [
  {
    system: "Cardiovascular",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50",
    snippet: "Understand how compensatory mechanisms initially stabilize hemodynamics yet progressively increase myocardial workload, often masking deterioration until late stages. Trace the RAAS cascade, ventricular remodeling, and why treatment targets specific neurohormonal pathways.",
    lessonCount: 15,
    sampleLesson: "Heart Failure",
  },
  {
    system: "Respiratory",
    icon: Wind,
    color: "text-blue-500",
    bg: "bg-blue-50",
    snippet: "Trace the progression from initial airway inflammation to alveolar destruction, explore the molecular basis of ventilation-perfusion mismatch, and recognize why certain medications target specific receptor subtypes.",
    lessonCount: 12,
    sampleLesson: "COPD & Asthma",
  },
  {
    system: "Neurological",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-50",
    snippet: "Explore how cerebral autoregulation fails under ischemic conditions, why the penumbra zone represents a critical therapeutic window, and how neurotransmitter cascades drive secondary injury patterns.",
    lessonCount: 10,
    sampleLesson: "Stroke & TBI",
  },
  {
    system: "Renal",
    icon: Droplets,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    snippet: "Learn how glomerular filtration pressure depends on afferent-efferent arteriole balance, why nephron loss triggers hyperfiltration injury in remaining units, and how acid-base compensation operates at the tubular level.",
    lessonCount: 8,
    sampleLesson: "Acute Kidney Injury",
  },
];

const painPoints = [
  {
    icon: Brain,
    title: "Theory feels disconnected from clinical reality",
    description: "You understand the textbook definition, but when the question asks what happens next: the gap between knowing and reasoning becomes clear.",
  },
  {
    icon: Layers,
    title: "Memorization without understanding",
    description: "Flashcards and mnemonics can only carry you so far. Without mechanistic understanding, similar-sounding conditions blur together when it matters most.",
  },
  {
    icon: Target,
    title: "Exam questions feel unpredictable",
    description: "You studied everything, but the question asks you to prioritize, differentiate, or anticipate: skills that pure memorization doesn't build.",
  },
  {
    icon: Activity,
    title: "Pathophysiology feels overwhelming",
    description: "When every disease has dozens of facts to remember, it becomes difficult to see the patterns that connect related conditions and guide clinical reasoning.",
  },
];

const premiumPreview = [
  {
    title: "Clinical Reasoning Modules",
    description: "Structured learning experiences designed to mirror the cognitive demands of real clinical decision-making and licensing examinations.",
    icon: Stethoscope,
  },
  {
    title: "Mechanistic Pathophysiology",
    description: "Multi-layered explanations that trace disease processes from cellular disruption through systemic compensation to clinical presentation.",
    icon: Layers,
  },
  {
    title: "Pharmacology with Purpose",
    description: "Medication education built around receptor-level mechanisms of action, explaining not just what drugs do but why they work: and when they fail.",
    icon: Pill,
  },
  {
    title: "Adaptive Assessment",
    description: "Pre-tests and post-tests that measure your growth, identify blind spots, and guide your study priorities with precision.",
    icon: TrendingUp,
  },
  {
    title: "Clinical Pearls & Reasoning Cues",
    description: "Curated insights that experienced clinicians use to connect patterns, anticipate complications, and make confident decisions under pressure.",
    icon: Lightbulb,
  },
  {
    title: "Progress Intelligence",
    description: "Analytics that reveal your strengths across body systems, track improvement over time, and surface the areas that need the most attention.",
    icon: Eye,
  },
];

export default function StartFreePage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans transition-colors duration-500">
      <AdminEditButton />
      <SEO
        title={t("pages.startFree.startLearningFreeNursenestClinical")}
        description={t("pages.startFree.exploreNursenestsClinicalNursingEducation")}
        keywords="free nursing education, NCLEX prep free, nursing pathophysiology, clinical reasoning, nursing student resources, free RPN study, free RN exam prep"
        canonicalPath="/start-free"
      />
      <Navigation />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-600">{t("pages.startFree.freeAccessAvailable")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]" data-testid="hero-headline">
              Clinical Nursing Education{" "}
              <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                Built for How You Actually Think
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" data-testid="hero-subheadline">
              NurseNest isn't another study app. It's a structured clinical learning environment that 
              develops the reasoning, pattern recognition, and mechanistic understanding that exams 
              and bedside practice actually demand.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 text-white"
                onClick={() => setLocation("/anatomy")}
                data-testid="button-explore-free"
              >
                Explore Free Content
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-gray-700 bg-white/50"
                onClick={() => setLocation("/pricing")}
                data-testid="button-view-plans"
              >
                View Plans
              </Button>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20 bg-white/50 border-y border-primary/10" data-testid="section-pain-points">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Sound Familiar?
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Most nursing students hit the same walls. The issue isn't effort: it's approach.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {painPoints.map((point, i) => (
                <Card
                  key={i}
                  className="border border-primary/10 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  data-testid={`card-pain-point-${i}`}
                >
                  <CardContent className="p-6 flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                      <point.icon className="w-6 h-6 text-primary/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{point.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{point.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What NurseNest Develops */}
        <section className="py-20" data-testid="section-value-proposition">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                A Different Kind of Preparation
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                NurseNest builds the cognitive architecture that connects isolated facts into 
                clinical reasoning: the skill that separates confident practitioners from uncertain ones.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Mechanistic Understanding", desc: "Build causal models of disease progression rather than memorizing isolated clinical facts" },
                { label: "Pattern Recognition", desc: "See the connections between related pathologies and presentations across body systems" },
                { label: "Clinical Decision Logic", desc: "Develop the prioritization instinct and escalation reasoning that exam questions test" },
                { label: "Compensatory Reasoning", desc: "Understand how the body adapts: and when adaptation becomes failure" },
                { label: "Pharmacological Clarity", desc: "Connect drug mechanisms to disease processes at the receptor level with purpose" },
                { label: "Exam-Aligned Reasoning", desc: "Train the decision logic and prioritization patterns licensing examinations implicitly assess" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-primary/10 hover:border-primary/25 transition-all duration-300 group"
                  data-testid={`value-item-${i}`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Previews */}
        <section className="py-20 bg-white/50 border-y border-primary/10" data-testid="section-content-preview">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Preview What's Inside
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Each body system contains layered clinical content: from cellular mechanisms 
                through pharmacological intervention to nursing-specific reasoning.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {previewTopics.map((topic, i) => (
                <Card
                  key={i}
                  className="border border-primary/10 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  data-testid={`card-preview-${topic.system.toLowerCase()}`}
                >
                  <CardContent className="p-0">
                    <div className="p-6 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 ${topic.bg} rounded-xl flex items-center justify-center`}>
                          <topic.icon className={`w-5 h-5 ${topic.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{topic.system}</h3>
                          <span className="text-xs text-gray-400">{topic.lessonCount} lessons available</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {topic.snippet}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Sample: {topic.sampleLesson}</span>
                      </div>
                    </div>

                    <div className="border-t border-primary/5 bg-primary/[0.02] px-6 py-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-primary/70">
                        Explore this system
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary/50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400 mb-4">
                Plus: Endocrine, Hematology, Pediatrics, OB/Maternity, Mental Health, Oncology, Emergency, and more
              </p>
              <Button
                variant="outline"
                className="rounded-full border-primary/20 hover:bg-primary/5 text-gray-600"
                onClick={() => setLocation("/lessons")}
                data-testid="button-view-all-lessons"
              >
                View Full Lesson Catalog
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Premium Learning Experiences */}
        <section className="py-20" data-testid="section-premium-preview">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Learning Experiences Designed for Depth
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Each element of the platform serves a specific cognitive purpose: building the 
                layered understanding that produces confident, capable nurses.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumPreview.map((item, i) => (
                <Card
                  key={i}
                  className="border border-primary/10 bg-white hover:shadow-md transition-all duration-300 group"
                  data-testid={`card-premium-${i}`}
                >
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Free Content CTA */}
        <section className="py-16 bg-primary/5 border-y border-primary/10" data-testid="section-free-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-primary/10 shadow-lg overflow-hidden">
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">{t("pages.startFree.freeAccess")}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Start with Anatomy & Physiology
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
                  Explore foundational content across 10 body systems: completely free. Build your 
                  physiological foundation before advancing into clinical pathophysiology, pharmacology, 
                  and exam-focused reasoning.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                  {["Cardiovascular", "Respiratory", "Neurological", "Renal", "Endocrine", "GI", "Hematology", "Musculoskeletal", "Integumentary", "Reproductive"].map((sys) => (
                    <div key={sys} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{sys}</span>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 text-white transition-all hover:-translate-y-1"
                  onClick={() => setLocation("/anatomy")}
                  data-testid="button-start-anatomy"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Choose Your Pathway */}
        <section className="py-16" data-testid="section-choose-pathway">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl border border-primary/15 shadow-lg overflow-hidden">
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <Compass className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    {t("pathways.badge")}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {t("startFree.pathways.title")}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
                  {t("startFree.pathways.subtitle")}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { label: t("pathways.card.preNursing.title"), icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: t("pathways.card.rpn.title"), icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: t("pathways.card.rn.title"), icon: Stethoscope, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: t("pathways.card.np.title"), icon: Brain, color: "text-amber-600", bg: "bg-amber-50" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/80 rounded-lg p-3 border border-white">
                      <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 text-white transition-all hover:-translate-y-1"
                  onClick={() => setLocation("/pathways")}
                  data-testid="button-find-pathway"
                >
                  {t("startFree.pathways.cta")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Mechanisms Matter */}
        <section className="py-16 bg-white/50 border-y border-primary/10" data-testid="section-why-mechanisms">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.startFree.whyMechanismsMatter")}</h3>
            <p className="text-gray-600 leading-relaxed">
              In clinical environments and licensing examinations, correct decisions rarely depend on 
              recalling isolated facts. They depend on understanding <em>{t("pages.startFree.why")}</em> physiological systems respond 
              the way they do under stress, injury, and compensation. Many learners spend months memorizing 
              details without ever developing the reasoning structures exams actually reward.
            </p>
          </div>
        </section>

        {/* Cognitive Tension Bridge */}
        <section className="py-12" data-testid="section-cognitive-bridge">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-gray-500 italic leading-relaxed">
              Understanding physiology builds knowledge. Applying it under uncertainty requires trained reasoning.
            </p>
          </div>
        </section>

        {/* Premium Upgrade Psychology */}
        <section className="py-20 bg-primary/[0.02]" data-testid="section-upgrade-psychology">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              When You're Ready for More
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Free content builds your foundation. Premium access unlocks the full depth of 
              clinical reasoning, advanced pathophysiology, pharmacology integration, and 
              structured exam preparation that serious learners need.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {[
                { tier: "RPN / LVN Preparation", focus: "Built for learners developing foundational clinical reasoning and scope-appropriate monitoring, reporting, and intervention skills", price: "From $29.99/mo" },
                { tier: "RN Exam Preparation", focus: "Built for learners preparing for high-stakes clinical judgment examinations and real-world decision-making demands", price: "From $39.99/mo" },
                { tier: "NP Advanced Practice", focus: "Designed for clinicians operating at diagnostic, prescriptive, and differential-reasoning levels", price: "From $49.99/mo" },
              ].map((plan, i) => (
                <Card
                  key={i}
                  className="border border-primary/10 bg-white hover:shadow-md transition-all duration-300 text-left"
                  data-testid={`card-tier-${i}`}
                >
                  <CardContent className="p-6">
                    <h4 className="font-bold text-gray-900 mb-2">{plan.tier}</h4>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{plan.focus}</p>
                    <div className="text-sm font-semibold text-primary">{plan.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-gray-700"
              onClick={() => setLocation("/pricing")}
              data-testid="button-compare-plans"
            >
              Compare Plans & Pricing
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Trust & Authority */}
        <section className="py-16 bg-white/50 border-t border-primary/10" data-testid="section-trust">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: Shield,
                  title: "Evidence-Informed Content",
                  desc: "Developed using established clinical frameworks and contemporary practice standards",
                },
                {
                  icon: GraduationCap,
                  title: "Educator-Designed",
                  desc: "Content structured by nursing education professionals for meaningful learning outcomes",
                },
                {
                  icon: Target,
                  title: "Exam-Aligned Reasoning Frameworks",
                  desc: "Cognitive models reflecting the decision patterns commonly required in licensing examinations",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-3" data-testid={`trust-signal-${i}`}>
                  <div className="mx-auto w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary/70" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-white rounded-xl border border-primary/10 p-6 max-w-2xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{t("pages.startFree.educationalIntegrityProfessionalBoundaries")}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                NurseNest provides independently developed educational content grounded in established physiological 
                principles and widely accepted clinical reasoning frameworks. NurseNest is not affiliated with or endorsed 
                by any licensing or regulatory body. All material is intended solely for educational use.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
