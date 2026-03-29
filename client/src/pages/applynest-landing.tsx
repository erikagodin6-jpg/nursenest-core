import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { APPLYNEST_PROFESSIONS } from "@shared/schema";
import { Heart, Stethoscope, GraduationCap, Wind, Microscope, Radio, Pill, Ambulance, ArrowRight, Briefcase, FileText, MessageSquare, MapPin, CheckCircle, Mail, Star, Shield, ClipboardList, Search, Users, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/seo";

import { useI18n } from "@/lib/i18n";
const iconMap: Record<string, any> = {
  Heart, Stethoscope, GraduationCap, Wind, Microscope, Radio, Pill, Ambulance,
};

export default function ApplyNestLanding() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");

  const { data: profiles } = useQuery({
    queryKey: ["/api/applynest/career-profiles"],
    queryFn: async () => {
      const res = await fetch("/api/applynest/career-profiles");
      return res.json();
    },
  });

  const leadMutation = useMutation({
    mutationFn: async (data: { email: string; profession: string }) => {
      const res = await fetch("/api/applynest/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(err.error || "Failed to sign up");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "You're signed up!", description: "We'll send you job alerts and career resources." });
      setEmail("");
    },
    onError: () => {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      leadMutation.mutate({ email: email.trim(), profession: selectedProfession });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
      <SEO
        title={t("pages.applynestLanding.applynestLandYourFirstHealthcare")}
        description={t("pages.applynestLanding.freeToolsForNewGrad")}
        keywords="new grad nurse jobs, nursing resume help, healthcare interview prep, entry-level healthcare jobs, new graduate nurse resume, nursing job search, healthcare career resources, ATS resume builder, nurse interview questions"
        canonicalPath="/applynest"
      />

      <section className="relative overflow-hidden px-4 py-16 sm:py-24" data-testid="section-applynest-hero">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6" data-testid="badge-hero">
            <Sparkles className="w-4 h-4" />
            Built for New Grad Nurses & Healthcare Professionals
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight" data-testid="text-applynest-title">
            Land Your First Healthcare Job Faster
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8" data-testid="text-applynest-subtitle">
            AI-powered resume builder, healthcare interview prep with real questions & answers, and job search tools — everything new grad nurses and healthcare professionals need to get hired.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-10" data-testid="strip-trust-indicators">
            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <FileText className="w-4 h-4 text-teal-500" /> Resume Builder
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <MessageSquare className="w-4 h-4 text-teal-500" /> Interview Prep
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <Search className="w-4 h-4 text-teal-500" /> Job Listings
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <ClipboardList className="w-4 h-4 text-teal-500" /> Application Tracking
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <GraduationCap className="w-4 h-4 text-teal-500" /> Career Resources
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/applynest/resume-templates">
              <button className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-lg transition-colors shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2" data-testid="button-cta-resume">
                <FileText className="w-5 h-5" />
                Build Your Resume
              </button>
            </Link>
            <Link href="/applynest/job-search-guide">
              <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-teal-700 dark:text-teal-300 font-semibold rounded-xl text-lg transition-colors border-2 border-teal-200 dark:border-teal-700 flex items-center justify-center gap-2" data-testid="button-cta-jobs">
                <Search className="w-5 h-5" />
                Browse Jobs
              </button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2" data-testid="text-microcopy">
            <Zap className="w-3.5 h-3.5 inline-block mr-1 text-teal-500" />
            Free tools to get started — no account required
          </p>
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400" data-testid="text-urgency">
            Your first job starts here
          </p>
        </div>
      </section>

      <section className="px-4 py-16 bg-white dark:bg-gray-950" data-testid="section-feature-cards">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4" data-testid="text-features-title">
            Everything you need to get hired in one place
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Stop piecing together advice from a dozen sites. ApplyNest gives you the complete toolkit to go from graduation to job offer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/applynest/resume-templates">
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 border border-teal-100 dark:border-gray-700 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer" data-testid="card-feature-resume">
                <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-5">
                  <FileText className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.resumeBuilder")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{t("pages.applynestLanding.atsoptimizedHealthcareResumeTemplatesDesigned")}</p>
                <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Build Your Resume <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/applynest/interview-prep">
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-white dark:from-gray-900 dark:to-gray-800 border border-rose-100 dark:border-gray-700 hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-600 transition-all cursor-pointer" data-testid="card-feature-interview">
                <div className="w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center mb-5">
                  <MessageSquare className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.interviewPrep")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{t("pages.applynestLanding.commonHealthcareInterviewQuestionsWith")}</p>
                <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Preparing <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/applynest/job-search-guide">
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border border-blue-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer" data-testid="card-feature-jobs">
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-5">
                  <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.jobBoard")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{t("pages.applynestLanding.healthcarespecificJobSearchResourcesWith")}</p>
                <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 bg-gray-50 dark:bg-gray-900" data-testid="section-social-proof">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3" data-testid="text-social-proof-title">
            Trusted by nursing students and new grads
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-6">
            Join thousands of healthcare graduates who used ApplyNest to land their first clinical positions.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-teal-500" /> {t("pages.applynestLanding.newGradNurses")}</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-teal-500" /> {t("pages.applynestLanding.alliedHealthProfessionals")}</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-teal-500" /> {t("pages.applynestLanding.healthcareStudents")}</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-white dark:bg-gray-950" data-testid="section-lead-capture">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-10 h-10 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.getJobAlertsCareerResources")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign up for weekly healthcare job alerts, interview tips, and career development resources tailored to your profession.
          </p>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 mb-4" data-testid="form-lead-capture">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("pages.applynestLanding.enterYourEmailForJob")}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              data-testid="input-email-signup"
              required
            />
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              data-testid="select-profession"
            >
              <option value="">{t("pages.applynestLanding.allProfessions")}</option>
              {APPLYNEST_PROFESSIONS.map((p) => (
                <option key={p.slug} value={p.slug}>{p.label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={leadMutation.isPending}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              data-testid="button-signup"
            >
              {leadMutation.isPending ? "..." : "Get Alerts"}
            </button>
          </form>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-teal-500" /> {t("pages.applynestLanding.freeCareerResources")}</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-teal-500" /> {t("pages.applynestLanding.8HealthcareProfessions")}</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-teal-500" /> {t("pages.applynestLanding.resumeTemplatesIncluded")}</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900" data-testid="section-profession-cards">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">{t("pages.applynestLanding.chooseYourProfession")}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Explore career guides tailored to your healthcare profession with job market data, salary ranges, licensing requirements, and actionable job search resources.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APPLYNEST_PROFESSIONS.map((prof) => {
              const Icon = iconMap[prof.icon] || Briefcase;
              const profile = Array.isArray(profiles) ? profiles.find((p: any) => p.profession === prof.slug) : undefined;
              return (
                <Link key={prof.slug} href={`/applynest/careers/${prof.slug}`}>
                  <div className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-900" data-testid={`card-profession-${prof.slug}`}>
                    <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{prof.label}</h3>
                    {profile?.salaryRangeJson && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {profile.salaryRangeJson.entry} - {profile.salaryRangeJson.senior}
                      </p>
                    )}
                    <span className="text-teal-600 dark:text-teal-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Career Guide <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-white dark:bg-gray-950" data-testid="section-resources">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{t("pages.applynestLanding.careerResources")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/applynest/resume-templates">
              <div className="group p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer" data-testid="card-resume-templates">
                <FileText className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.resumeTemplates")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("pages.applynestLanding.healthcarespecificResumeTemplatesForNew")}</p>
                <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Templates <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/applynest/interview-prep">
              <div className="group p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer" data-testid="card-interview-prep">
                <MessageSquare className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.interviewPrep2")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("pages.applynestLanding.commonHealthcareInterviewQuestionsWith2")}</p>
                <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Preparing <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link href="/applynest/job-search-guide">
              <div className="group p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer" data-testid="card-job-search">
                <MapPin className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("pages.applynestLanding.jobSearchGuide")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t("pages.applynestLanding.whereToFindHealthcareJobs")}</p>
                <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900" data-testid="section-cross-links">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">{t("pages.applynestLanding.prepareThenApply")}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            ApplyNest works hand-in-hand with NurseNest's exam prep and new grad resources to help you succeed from classroom to career.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/new-grad">
              <div className="group flex items-center gap-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800" data-testid="link-new-grad-hub">
                <Star className="w-8 h-8 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("pages.applynestLanding.newGradSurvivalHub")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("pages.applynestLanding.firstyearGuidesClinicalSkillsUnit")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0 ml-auto" />
              </div>
            </Link>
            <Link href="/mock-exams">
              <div className="group flex items-center gap-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800" data-testid="link-exam-prep">
                <GraduationCap className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("pages.applynestLanding.examPrepMockExams")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("pages.applynestLanding.practiceExamsQuestionBanksAnd")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0 ml-auto" />
              </div>
            </Link>
            <Link href="/free-practice">
              <div className="group flex items-center gap-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800" data-testid="link-test-bank">
                <FileText className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("pages.applynestLanding.testBank")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("pages.applynestLanding.1200PracticeQuestionsOrganizedBy")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0 ml-auto" />
              </div>
            </Link>
            <Link href="/flashcards">
              <div className="group flex items-center gap-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800" data-testid="link-flashcards">
                <Briefcase className="w-8 h-8 text-purple-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("pages.applynestLanding.studyFlashcards")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("pages.applynestLanding.interactiveFlashcardsCoveringPharmacologyPath")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0 ml-auto" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-teal-600 dark:bg-teal-800" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="w-12 h-12 text-teal-200 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">{t("pages.applynestLanding.getCareerUpdatesDelivered")}</h2>
          <p className="text-teal-100 mb-8">{t("pages.applynestLanding.joinHealthcareProfessionalsWhoReceive")}</p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3" data-testid="form-bottom-cta">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("pages.applynestLanding.yourEmailAddress")}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-teal-400 text-white placeholder-teal-200 focus:ring-2 focus:ring-white focus:border-transparent"
              data-testid="input-email-bottom"
              required
            />
            <button
              type="submit"
              disabled={leadMutation.isPending}
              className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50"
              data-testid="button-signup-bottom"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
