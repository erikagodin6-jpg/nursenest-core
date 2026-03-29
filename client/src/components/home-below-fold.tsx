import { lazy } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazySection } from "@/components/lazy-section";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { getEnabledCareers, getCanonicalRoute } from "@shared/careers";
import type { DigitalProduct } from "@shared/schema";
import type { HeroStats } from "@shared/lesson-stats";
import {
  ArrowRight,
  Star,
  Shield,
  BookOpen,
  Brain,
  Stethoscope,
  Pill,
  HeartPulse,
  Activity,
  FlaskConical,
  Baby,
  Lightbulb,
  Target,
  Layers,
  BarChart3,
  Zap,
  GraduationCap,
  Mail,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  TrendingUp,
  PlayCircle,
  Calculator,
  ClipboardCheck,
  Siren,
  Droplets,
  Thermometer,
  TestTubes,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Globe,
  Gamepad2,
  Award,
  Microscope,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CircleCheck,
  Trophy,
  BadgeCheck,
  ShoppingBag,
  Wind,
  Ambulance,
  ScanLine,
} from "lucide-react";

const TrustShowcase = lazy(() => import("@/components/trust-showcase").then(m => ({ default: m.TrustShowcase })));

function formatCount(n: number | undefined): string {
  if (n === undefined || n === 0) return "---";
  if (n < 10) return `${n}`;
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  const tens = Math.floor(n / 10) * 10;
  return `${tens}+`;
}

interface HomeBelowFoldProps {
  region: "US" | "CA";
  heroStats: HeroStats | undefined;
  featuredProducts: DigitalProduct[];
  lessonCount: number;
  questionCount: number;
  storeProductCount: number;
  email: string;
  setEmail: (v: string) => void;
  emailFrequency: string;
  setEmailFrequency: (v: string) => void;
  emailStatus: "idle" | "loading" | "success" | "error";
  emailMessage: string;
  handleEmailSubscribe: () => void;
}

export function HomeBelowFold({
  region,
  heroStats,
  featuredProducts,
  lessonCount,
  questionCount,
  storeProductCount,
  email,
  setEmail,
  emailFrequency,
  setEmailFrequency,
  emailStatus,
  emailMessage,
  handleEmailSubscribe,
}: HomeBelowFoldProps) {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100" data-testid="section-career-selector">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.career.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-career-heading">
              {t("home.career.heading")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("home.career.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {getEnabledCareers().map((career) => {
              const ALLIED_IDS = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging"];
              const isAllied = ALLIED_IDS.includes(career.id);
              const IconComponent = ({
                nursing: Stethoscope,
                rrt: Wind,
                paramedic: Ambulance,
                pharmacyTech: Pill,
                mlt: Microscope,
                imaging: ScanLine,
              } as Record<string, typeof BookOpen>)[career.id] || BookOpen;

              const handleCareerClick = () => {
                if (career.id === "nursing") {
                  setLocation("/free-practice");
                } else {
                  const canonical = isAllied ? `/allied-health${getCanonicalRoute(career.slug)}` : (career.routePrefix || "/");
                  setLocation(canonical);
                }
              };

              return (
                <Card
                  key={career.id}
                  className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden"
                  onClick={handleCareerClick}
                  data-testid={`card-career-${career.slug}`}
                >
                  <CardContent className="p-6">
                    {isAllied && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-500 text-white px-2 py-0.5 rounded-full">{t("components.homeBelowFold.alliedHealth")}</span>
                      </div>
                    )}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                      style={{ backgroundColor: career.colorAccent }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: career.color }} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1" data-testid={`text-career-name-${career.slug}`}>
                      {career.shortName}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3" data-testid={`text-career-desc-${career.slug}`}>
                      {career.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {career.examNames.slice(0, 3).map((exam) => (
                        <span
                          key={exam}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: career.color + "30",
                            color: career.color,
                            backgroundColor: career.colorAccent,
                          }}
                        >
                          {exam}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm font-medium group-hover:gap-2 transition-all" style={{ color: career.color }}>
                      <span>{t("home.career.explore")} {career.shortName}</span>
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <LazySection minHeight="400px" rootMargin="300px">
      <section className="py-14 bg-white border-t border-gray-100" data-testid="section-reviews">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-4">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t("home.reviews.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-reviews-heading">
              {t("home.reviews.heading")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("home.reviews.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { name: "Priya S.", role: "RPN Student, Ontario", rating: 5, text: "I passed my practical nursing exam on the first attempt. The question bank and clinical lessons covered everything I saw on exam day. The rationales actually teach you how to think through each question.", tier: "RPN" },
              { name: "James K.", role: "RN Student, British Columbia", rating: 5, text: "The mock exams with strict mode were a game changer. I felt completely prepared walking into the NCLEX-RN. The flashcard decks helped me memorize medications faster than any textbook.", tier: "RN" },
              { name: "Dr. Aisha M.", role: "NP Student, Alberta", rating: 5, text: "The NP question bank is incredibly thorough. Pharmacology questions, clinical management scenarios, and differential diagnosis content were all directly relevant to my AANP certification exam.", tier: "NP" },
              { name: "Sophie L.", role: "RPN Student, Manitoba", rating: 5, text: "Having everything in one place saved me so much time. The pre-test and post-test system for each lesson showed me exactly where my weak spots were so I could focus my study time.", tier: "RPN" },
              { name: "Marcus T.", role: "RN Student, Nova Scotia", rating: 4, text: "The pathophysiology lessons broke down complex topics into clear, digestible sections. Being able to switch languages to French was a huge plus for me as a bilingual student.", tier: "RN" },
              { name: "Dr. Fatima R.", role: "NP Student, Ontario", rating: 5, text: "I recommended NurseNest to my entire cohort. The clinical pearls and medication safety content go beyond surface-level review. This platform genuinely prepares you for advanced practice.", tier: "NP" },
            ].map((review, i) => (
              <Card key={i} className="border border-gray-100 hover:shadow-md transition-shadow" data-testid={`card-review-${i}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`w-4 h-4 ${s < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4" data-testid={`text-review-${i}`}>
                    "{review.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm" data-testid={`text-reviewer-name-${i}`}>{review.name}</p>
                      <p className="text-xs text-gray-500">{review.role}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{review.tier}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-blue-400", "bg-emerald-400", "bg-purple-400", "bg-amber-400"].map((bg, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                    {["P", "J", "A", "S"][i]}
                  </div>
                ))}
              </div>
              <span>{t("home.reviews.joinStudents")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-gray-700">4.9/5</span>
              <span>{t("home.reviews.averageRating")}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="included" className="py-16 bg-gradient-to-b from-white to-primary/5 border-t border-gray-100" data-testid="section-included">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.included.badge")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-included-heading">{t("home.included.heading")}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("home.included.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Target, title: t("home.included.qbank.title"), desc: t("home.included.qbank.desc"), href: "/free-practice", count: formatCount(questionCount), countLabel: t("home.included.countQuestions"), color: "from-blue-500 to-indigo-600" },
              { icon: ClipboardCheck, title: t("home.included.mockExams.title"), desc: t("home.included.mockExams.desc"), href: "/mock-exams", count: "3", countLabel: t("home.included.countExamTiers"), color: "from-purple-500 to-violet-600" },
              { icon: FileText, title: t("home.included.printable.title"), desc: t("home.included.printable.desc"), href: "/shop", count: formatCount(storeProductCount), countLabel: t("home.included.countPacks"), color: "from-emerald-500 to-teal-600" },
              { icon: BookOpen, title: t("home.included.flashcards.title"), desc: t("home.included.flashcards.desc"), href: "/flashcards", count: "140+", countLabel: t("home.included.countDecks"), color: "from-amber-500 to-orange-600" },
              { icon: Stethoscope, title: t("home.included.lessons.title"), desc: t("home.included.lessons.desc"), href: "/lessons", count: formatCount(lessonCount), countLabel: t("home.included.countLessons"), color: "from-rose-500 to-pink-600" },
            ].map((item, i) => (
              <Card
                key={i}
                className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden"
                onClick={() => setLocation(item.href)}
                data-testid={`card-included-${i}`}
              >
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">{item.count} {item.countLabel}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </LazySection>
    </>
  );
}

export default HomeBelowFold;
