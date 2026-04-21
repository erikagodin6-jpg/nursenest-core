"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Loader2,
  Shield,
  Stethoscope,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

export type ForInstitutionsLegacyMessages = Record<string, string>;

type Props = {
  locale: string;
  messages: ForInstitutionsLegacyMessages;
  pricingHref: string;
};

function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function chipLabel(m: ForInstitutionsLegacyMessages): string {
  const raw = m["pages.forInstitutions.forNursingSchoolsAndPrograms"] ?? "";
  const head = raw.split("|")[0]?.trim();
  return head || m["pages.forInstitutions.eyebrow"] || "Institutional";
}

export function MarketingForInstitutionsLegacyClient({ locale, messages: m, pricingHref }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [form, setForm] = useState({
    institutionName: "",
    programType: "RPN",
    estimatedStudentCount: "",
    country: "CA",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });

  const contactHref = withMarketingLocale(locale, "/contact");

  const featureBlocks = [
    { Icon: BookOpen, titleKey: "pages.forInstitutions.feature1Title", descKey: "pages.forInstitutions.feature1Desc" },
    { Icon: Target, titleKey: "pages.forInstitutions.feature2Title", descKey: "pages.forInstitutions.feature2Desc" },
    { Icon: Brain, titleKey: "pages.forInstitutions.feature3Title", descKey: "pages.forInstitutions.feature3Desc" },
    { Icon: BarChart3, titleKey: "pages.forInstitutions.feature4Title", descKey: "pages.forInstitutions.feature4Desc" },
    { Icon: Stethoscope, titleKey: "pages.forInstitutions.feature5Title", descKey: "pages.forInstitutions.feature5Desc" },
    { Icon: Shield, titleKey: "pages.forInstitutions.feature6Title", descKey: "pages.forInstitutions.feature6Desc" },
  ] as const;

  const studentBenefitKeys = [
    "pages.forInstitutions.studentBenefit1",
    "pages.forInstitutions.studentBenefit2",
    "pages.forInstitutions.studentBenefit3",
    "pages.forInstitutions.studentBenefit4",
    "pages.forInstitutions.studentBenefit5",
    "pages.forInstitutions.studentBenefit6",
    "pages.forInstitutions.studentBenefit7",
    "pages.forInstitutions.studentBenefit8",
  ] as const;

  const trustBlocks = [
    { Icon: Target, textKey: "pages.forInstitutions.trustPoint1" },
    { Icon: Brain, textKey: "pages.forInstitutions.trustPoint2" },
    { Icon: BarChart3, textKey: "pages.forInstitutions.trustPoint3" },
    { Icon: Users, textKey: "pages.forInstitutions.trustPoint4" },
    { Icon: BookOpen, textKey: "pages.forInstitutions.trustPoint5" },
  ] as const;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorBanner(null);
    if (!form.institutionName || !form.contactName || !form.email) {
      setErrorBanner(m["pages.forInstitutions.leadRequiredFields"] ?? "Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/institutions/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedStudentCount: parseInt(form.estimatedStudentCount, 10) || 0,
          region: form.country,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setErrorBanner(m["pages.forInstitutions.leadSubmitError"] ?? "Please try again or email us directly.");
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_14%,var(--background))_0%,var(--background)_45%,color-mix(in_srgb,var(--semantic-info)_12%,var(--background))_100%)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--background))] px-4 py-1.5 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
              {chipLabel(m)}
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
              {m["pages.forInstitutions.heroTitle"]}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{m["pages.forInstitutions.heroLead"]}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-full px-8 text-lg`}
                onClick={() => scrollToId("contact-form")}
              >
                {m["pages.forInstitutions.requestDemo"]} <ChevronRight className="h-5 w-5" aria-hidden />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-full border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--border))] px-8 text-lg`}
                onClick={() => scrollToId("pricing-section")}
              >
                {m["pages.forInstitutions.viewPricing"]}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground">{m["pages.forInstitutions.whyProgramsChooseNursenest"]}</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">{m["pages.forInstitutions.builtSpecificallyForCanadianAnd"]}</p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featureBlocks.map(({ Icon, titleKey, descKey }) => (
              <Card key={titleKey} className="border border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,var(--border))] shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--muted))]">
                    <Icon className="h-6 w-6 text-[var(--semantic-brand)]" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{m[titleKey]}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{m[descKey]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color-mix(in_srgb,var(--muted)_28%,var(--background))] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground">{m["pages.forInstitutions.whatStudentsGet"]}</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">{m["pages.forInstitutions.everythingTheyNeedToPrepare"]}</p>
          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {studentBenefitKeys.map((k) => (
              <div key={k} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span className="text-muted-foreground">{m[k]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing-section" className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground">{m["pages.forInstitutions.institutionalPricing"]}</h2>
          <p className="mx-auto mb-4 max-w-2xl text-center text-muted-foreground">{m["pages.forInstitutions.volumePricingThatScalesWith"]}</p>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm font-medium text-[var(--semantic-brand)]">
            {m["pages.forInstitutions.provenToImproveNclexPass"]}
          </p>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col border-2 border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--border))] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--border))]">
              <CardContent className="flex flex-1 flex-col pt-6 text-center">
                <GraduationCap className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-brand)]" aria-hidden />
                <h3 className="mb-1 text-xl font-bold text-foreground">{m["pages.forInstitutions.smallProgram"]}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{m["pages.forInstitutions.upTo50Seats"]}</p>
                <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">
                  {m["pages.forInstitutions.pricingSmallSeatLine"]}
                </p>
                <p className="mb-6 text-sm text-muted-foreground">{m["pages.forInstitutions.pricingSmallBillLine"]}</p>
                <ul className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.fullPlatformAccess"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.instructorDashboard"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.studentProgressTracking"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.assignmentManagement"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.enrollmentCodes"]}
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button type="button" className="w-full gap-2" onClick={() => scrollToId("contact-form")}>
                    {m["pages.forInstitutions.requestDemo"]} <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="relative flex flex-col border-2 border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--border))] shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[var(--semantic-brand)] px-3 py-1 text-xs font-bold text-primary-foreground">
                  {m["pages.forInstitutions.mostPopular"]}
                </span>
              </div>
              <CardContent className="flex flex-1 flex-col pt-6 text-center">
                <Award className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-brand)]" aria-hidden />
                <h3 className="mb-1 text-xl font-bold text-foreground">{m["pages.forInstitutions.mediumProgram"]}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{m["pages.forInstitutions.51150Seats"]}</p>
                <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">
                  {m["pages.forInstitutions.pricingMediumSeatLine"]}
                </p>
                <p className="mb-6 text-sm text-muted-foreground">{m["pages.forInstitutions.pricingMediumBillLine"]}</p>
                <ul className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.everythingInSmall"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.institutionAnalytics"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.programBenchmarking"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.csvBulkEnrollment"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.certificateGeneration"]}
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button type="button" className="w-full gap-2" onClick={() => scrollToId("contact-form")}>
                    {m["pages.forInstitutions.requestDemo"]} <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col border-2 border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--border))] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--border))]">
              <CardContent className="flex flex-1 flex-col pt-6 text-center">
                <Zap className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-brand)]" aria-hidden />
                <h3 className="mb-1 text-xl font-bold text-foreground">{m["pages.forInstitutions.largeProgram"]}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{m["pages.forInstitutions.151300Seats"]}</p>
                <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">
                  {m["pages.forInstitutions.pricingLargeSeatLine"]}
                </p>
                <p className="mb-6 text-sm text-muted-foreground">{m["pages.forInstitutions.pricingLargeBillLine"]}</p>
                <ul className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.everythingInMedium"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.prioritySupport"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.customReporting"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.apiAccess"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.dedicatedAccountManager"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.lmsIntegrationCanvasBlackboard"]}
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button type="button" className="w-full gap-2" onClick={() => scrollToId("contact-form")}>
                    {m["pages.forInstitutions.contactSales"]} <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col border-2 border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--border))] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--border))]">
              <CardContent className="flex flex-1 flex-col pt-6 text-center">
                <Building2 className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-brand)]" aria-hidden />
                <h3 className="mb-1 text-xl font-bold text-foreground">{m["pages.forInstitutions.enterprise"]}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{m["pages.forInstitutions.300Seats"]}</p>
                <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">{m["pages.forInstitutions.custom"]}</p>
                <p className="mb-6 text-sm text-muted-foreground">{m["pages.forInstitutions.tailoredToYourProgram"]}</p>
                <ul className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.everythingInLarge"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.unlimitedProgramSupport"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.customIntegrations"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.enterpriseAnalytics"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.dedicatedOnboarding"]}
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden /> {m["pages.forInstitutions.lmsIntegrationCanvasBlackboard2"]}
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button type="button" className="w-full gap-2" onClick={() => scrollToId("contact-form")}>
                    {m["pages.forInstitutions.contactInstitutionalTeam"]} <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{m["pages.forInstitutions.pricingAnnualNote"]}</p>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href={pricingHref} className="nn-link-quiet font-semibold">
              {m["pages.forInstitutions.ctaPricing"]}
            </Link>
            {" · "}
            <Link href={contactHref} className="nn-link-quiet font-semibold">
              {m["pages.forInstitutions.ctaContact"]}
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-[color-mix(in_srgb,var(--muted)_28%,var(--background))] py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground">{m["pages.forInstitutions.whyNursingProgramsChooseNursenest"]}</h2>
          <div className="space-y-5">
            {trustBlocks.map(({ Icon, textKey }) => (
              <div key={textKey} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--muted))]">
                  <Icon className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
                </div>
                <p className="pt-2 leading-relaxed text-muted-foreground">{m[textKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact-form"
        className="bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_8%,var(--background))_0%,color-mix(in_srgb,var(--semantic-info)_8%,var(--background))_100%)] py-14"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground">{m["pages.forInstitutions.getStarted"]}</h2>
          <p className="mb-8 text-center text-muted-foreground">{m["pages.forInstitutions.tellUsAboutYourProgram"]}</p>

          {errorBanner ? (
            <p className="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--background))] px-4 py-3 text-sm text-[var(--semantic-danger)]">
              {errorBanner}
            </p>
          ) : null}

          {submitted ? (
            <Card className="border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--border))] shadow-md">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[var(--semantic-success)]" aria-hidden />
                <h3 className="mb-2 text-2xl font-bold text-foreground">{m["pages.forInstitutions.thankYou"]}</h3>
                <p className="text-muted-foreground">{m["pages.forInstitutions.weHaveReceivedYourInquiry"]}</p>
                <p className="mt-4 text-sm text-muted-foreground">{m["pages.forInstitutions.leadSubmitSuccess"]}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--border))] shadow-md">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.institutionName"]}</label>
                    <Input
                      value={form.institutionName}
                      onChange={(e) => setForm((p) => ({ ...p, institutionName: e.target.value }))}
                      placeholder="e.g. Humber College"
                      required
                      autoComplete="organization"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.programType"]}</label>
                      <select
                        value={form.programType}
                        onChange={(e) => setForm((p) => ({ ...p, programType: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="RPN">{m["pages.forInstitutions.rpnLpn"]}</option>
                        <option value="RN">{m["pages.forInstitutions.rnBscn"]}</option>
                        <option value="NP">{m["pages.forInstitutions.nursePractitioner"]}</option>
                        <option value="PSW">{m["pages.forInstitutions.pswCna"]}</option>
                        <option value="MULTI">{m["pages.forInstitutions.multiplePrograms"]}</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.estimatedStudents"]}</label>
                      <Input
                        type="number"
                        min={0}
                        value={form.estimatedStudentCount}
                        onChange={(e) => setForm((p) => ({ ...p, estimatedStudentCount: e.target.value }))}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.country"]}</label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="CA">{m["pages.forInstitutions.canada"]}</option>
                      <option value="US">{m["pages.forInstitutions.unitedStates"]}</option>
                      <option value="UK">{m["pages.forInstitutions.unitedKingdom"]}</option>
                      <option value="AU">{m["pages.forInstitutions.australia"]}</option>
                      <option value="OTHER">{m["pages.forInstitutions.other"]}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.contactName"]}</label>
                    <Input
                      value={form.contactName}
                      onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                      placeholder={m["pages.forInstitutions.yourFullName"]}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.email"]}</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder={m["pages.forInstitutions.youinstitutionedu"]}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.phone"]}</label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="(416) 555-0100"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">{m["pages.forInstitutions.messageOptional"]}</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder={m["pages.forInstitutions.tellUsAboutYourProgram2"]}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                    {m["pages.forInstitutions.requestInformation"]}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
