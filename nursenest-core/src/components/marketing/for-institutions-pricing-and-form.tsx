"use client";

/**
 * Institutional pricing tiers + lead capture form — shared blocks for /for-institutions.
 */
import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

export type ForInstitutionsSharedMessages = Record<string, string>;

function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function ForInstitutionsPricingSection({
  locale,
  m,
  pricingHref,
}: {
  locale: string;
  m: ForInstitutionsSharedMessages;
  pricingHref: string;
}) {
  const contactHref = withMarketingLocale(locale, "/contact");

  return (
    <section id="pricing-section" className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--background))] py-12 lg:py-14">
      <div className="nn-section-shell">
        <h2 className="nn-marketing-h2 mb-3 text-center text-balance text-[var(--palette-heading)]">
          {m["pages.forInstitutions.institutionalPricing"]}
        </h2>
        <p className="nn-marketing-body mx-auto mb-4 max-w-2xl text-center text-[var(--palette-text-muted)]">
          {m["pages.forInstitutions.volumePricingThatScalesWith"]}
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm font-semibold text-[var(--semantic-brand)]">
          {m["pages.forInstitutions.provenToImproveNclexPass"]}
        </p>

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col border border-[color-mix(in_srgb,var(--semantic-border-soft)_75%,var(--border))] bg-[var(--palette-surface)] shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex flex-1 flex-col pt-6 text-center">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-chart-2)]" aria-hidden />
              <h3 className="mb-1 text-xl font-bold text-[var(--palette-heading)]">{m["pages.forInstitutions.smallProgram"]}</h3>
              <p className="mb-4 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.upTo50Seats"]}</p>
              <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">{m["pages.forInstitutions.pricingSmallSeatLine"]}</p>
              <p className="mb-6 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.pricingSmallBillLine"]}</p>
              <ul className="mb-6 space-y-2 text-left text-sm text-[var(--palette-text-muted)]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.fullPlatformAccess"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.instructorDashboard"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.studentProgressTracking"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.assignmentManagement"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.enrollmentCodes"]}
                </li>
              </ul>
              <div className="mt-auto">
                <Button type="button" className="w-full gap-2 rounded-full" onClick={() => scrollToId("contact-form")}>
                  {m["pages.forInstitutions.requestDemo"]} <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative flex flex-col border-2 border-[color-mix(in_srgb,var(--semantic-chart-3)_42%,var(--border))] bg-[var(--palette-surface)] shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-brand))] px-3 py-1 text-xs font-bold text-[var(--color-on-primary,#fff)]">
                {m["pages.forInstitutions.mostPopular"]}
              </span>
            </div>
            <CardContent className="flex flex-1 flex-col pt-6 text-center">
              <Award className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-chart-3)]" aria-hidden />
              <h3 className="mb-1 text-xl font-bold text-[var(--palette-heading)]">{m["pages.forInstitutions.mediumProgram"]}</h3>
              <p className="mb-4 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.51150Seats"]}</p>
              <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">{m["pages.forInstitutions.pricingMediumSeatLine"]}</p>
              <p className="mb-6 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.pricingMediumBillLine"]}</p>
              <ul className="mb-6 space-y-2 text-left text-sm text-[var(--palette-text-muted)]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.everythingInSmall"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.institutionAnalytics"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.programBenchmarking"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.csvBulkEnrollment"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.certificateGeneration"]}
                </li>
              </ul>
              <div className="mt-auto">
                <Button type="button" className="w-full gap-2 rounded-full" onClick={() => scrollToId("contact-form")}>
                  {m["pages.forInstitutions.requestDemo"]} <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col border border-[color-mix(in_srgb,var(--semantic-border-soft)_75%,var(--border))] bg-[var(--palette-surface)] shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex flex-1 flex-col pt-6 text-center">
              <Zap className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-info)]" aria-hidden />
              <h3 className="mb-1 text-xl font-bold text-[var(--palette-heading)]">{m["pages.forInstitutions.largeProgram"]}</h3>
              <p className="mb-4 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.151300Seats"]}</p>
              <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">{m["pages.forInstitutions.pricingLargeSeatLine"]}</p>
              <p className="mb-6 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.pricingLargeBillLine"]}</p>
              <ul className="mb-6 space-y-2 text-left text-sm text-[var(--palette-text-muted)]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.everythingInMedium"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.prioritySupport"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.customReporting"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.apiAccess"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.dedicatedAccountManager"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.lmsIntegrationCanvasBlackboard"]}
                </li>
              </ul>
              <div className="mt-auto">
                <Button type="button" className="w-full gap-2 rounded-full" onClick={() => scrollToId("contact-form")}>
                  {m["pages.forInstitutions.contactSales"]} <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col border border-[color-mix(in_srgb,var(--semantic-border-soft)_75%,var(--border))] bg-[var(--palette-surface)] shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex flex-1 flex-col pt-6 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-[var(--semantic-chart-5)]" aria-hidden />
              <h3 className="mb-1 text-xl font-bold text-[var(--palette-heading)]">{m["pages.forInstitutions.enterprise"]}</h3>
              <p className="mb-4 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.300Seats"]}</p>
              <p className="mb-1 text-3xl font-bold text-[var(--semantic-brand)]">{m["pages.forInstitutions.custom"]}</p>
              <p className="mb-6 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.tailoredToYourProgram"]}</p>
              <ul className="mb-6 space-y-2 text-left text-sm text-[var(--palette-text-muted)]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.everythingInLarge"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.unlimitedProgramSupport"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.customIntegrations"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.enterpriseAnalytics"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.dedicatedOnboarding"]}
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />{" "}
                  {m["pages.forInstitutions.lmsIntegrationCanvasBlackboard2"]}
                </li>
              </ul>
              <div className="mt-auto">
                <Button type="button" className="w-full gap-2 rounded-full" onClick={() => scrollToId("contact-form")}>
                  {m["pages.forInstitutions.contactInstitutionalTeam"]} <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.pricingAnnualNote"]}</p>
        <p className="mt-6 text-center text-sm text-[var(--palette-text-muted)]">
          <Link href={pricingHref} className="nn-link-quiet font-semibold text-[var(--semantic-brand)]">
            {m["pages.forInstitutions.ctaPricing"]}
          </Link>
          {" · "}
          <Link href={contactHref} className="nn-link-quiet font-semibold text-[var(--semantic-brand)]">
            {m["pages.forInstitutions.ctaContact"]}
          </Link>
        </p>
      </div>
    </section>
  );
}

export function ForInstitutionsLeadFormSection({ m }: { m: ForInstitutionsSharedMessages }) {
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
    <section
      id="contact-form"
      className="border-t border-[var(--border-subtle)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--background))_0%,color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--background))_55%,var(--background)_100%)] py-12 lg:py-14"
    >
      <div className="nn-section-shell max-w-2xl">
        <h2 className="nn-marketing-h2 mb-3 text-center text-[var(--palette-heading)]">{m["pages.forInstitutions.getStarted"]}</h2>
        <p className="nn-marketing-body mb-8 text-center text-[var(--palette-text-muted)]">{m["pages.forInstitutions.tellUsAboutYourProgram"]}</p>

        {errorBanner ? (
          <p className="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--background))] px-4 py-3 text-sm text-[var(--semantic-danger)]">
            {errorBanner}
          </p>
        ) : null}

        {submitted ? (
          <Card className="border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--border))] bg-[var(--palette-surface)] shadow-md">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[var(--semantic-success)]" aria-hidden />
              <h3 className="mb-2 text-2xl font-bold text-[var(--palette-heading)]">{m["pages.forInstitutions.thankYou"]}</h3>
              <p className="text-[var(--palette-text-muted)]">{m["pages.forInstitutions.weHaveReceivedYourInquiry"]}</p>
              <p className="mt-4 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.leadSubmitSuccess"]}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--border))] bg-[var(--palette-surface)] shadow-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">
                    {m["pages.forInstitutions.institutionName"]}
                  </label>
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
                    <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">
                      {m["pages.forInstitutions.programType"]}
                    </label>
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
                    <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">
                      {m["pages.forInstitutions.estimatedStudents"]}
                    </label>
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
                  <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">{m["pages.forInstitutions.country"]}</label>
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
                  <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">{m["pages.forInstitutions.contactName"]}</label>
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
                    <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">{m["pages.forInstitutions.email"]}</label>
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
                    <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">{m["pages.forInstitutions.phone"]}</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="(416) 555-0100"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--palette-heading)]">{m["pages.forInstitutions.messageOptional"]}</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder={m["pages.forInstitutions.tellUsAboutYourProgram2"]}
                    rows={3}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 rounded-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  {m["pages.forInstitutions.requestInformation"]}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
