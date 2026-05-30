import Link from "next/link";
import { ArrowRight, Activity, Ambulance, FlaskConical, Heart, Microscope, ShieldCheck } from "lucide-react";

import { MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

const FEATURED_PROFESSIONS = [
  {
    key: "respiratory",
    label: "Respiratory Therapy",
    description: "ABG interpretation, ventilator management, oxygen delivery, and airway pharmacology.",
    href: "/allied-health/respiratory-therapy-exam-prep",
    icon: Activity,
    certifications: "CRT · RRT · NBRC",
  },
  {
    key: "paramedic",
    label: "Paramedicine & EMT",
    description: "Trauma assessment, airway management, emergency protocols, and prehospital judgment.",
    href: "/allied-health/paramedic-exam-prep",
    icon: Ambulance,
    certifications: "NREMT · ACP · PCP",
  },
  {
    key: "mlt",
    label: "Medical Laboratory",
    description: "CBC interpretation, hematology patterns, microbiology, clinical chemistry, and QC.",
    href: "/allied-health/mlt-exam-prep",
    icon: FlaskConical,
    certifications: "CSMLS · ASCP MLT",
  },
  {
    key: "physiotherapy",
    label: "Physiotherapy",
    description: "Movement assessment, gait analysis, therapeutic exercise, and rehabilitation judgment.",
    href: "/allied-health/physiotherapy-exam-prep",
    icon: Heart,
    certifications: "NPTE · PCE · CAPR",
  },
  {
    key: "occupational-therapy",
    label: "Occupational Therapy",
    description: "ADL evaluation, activity analysis, cognitive strategies, and functional goal-setting.",
    href: "/allied-health/occupational-therapy-exam-prep",
    icon: Microscope,
    certifications: "NBCOT · COTEC",
  },
  {
    key: "psw",
    label: "PSW & Community Support",
    description: "Personal care, safety priorities, scope of practice, and community health foundations.",
    href: "/allied-health/psw-hca-exam-prep",
    icon: ShieldCheck,
    certifications: "HCAP · PSW Certificate",
  },
] as const;

/**
 * Homepage section: Allied Health is a dedicated expansion ecosystem.
 * Appears below the main nursing sections — nursing-first, allied as a clear secondary entry.
 * Links to /allied-health/ hub (on-domain discovery) and surfaces 6 featured professions.
 */
export function HomepageAlliedHealthSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="homepage-allied-health-heading"
      data-testid="section-homepage-allied-health"
    >
      <div className="nn-section-shell">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Allied Health Pathways</p>
          <h2
            id="homepage-allied-health-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            A Complete Allied Health Learning Ecosystem
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            NurseNest supports 22+ allied health professions with occupation-specific lessons,
            practice questions, clinical skills, and certification prep — kept entirely separate
            from nursing pathways so the scope stays accurate.
          </p>
        </div>

        {/* ── Profession grid ─────────────────────────────────────────── */}
        <ul
          className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Featured allied health professions"
        >
          {FEATURED_PROFESSIONS.map((profession) => {
            const Icon = profession.icon;
            return (
              <li key={profession.key}>
                <Link
                  href={profession.href}
                  className="group flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
                  data-testid={`allied-profession-card-${profession.key}`}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--theme-card-bg))]"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4 text-[var(--semantic-info)]" />
                  </span>
                  <span className="mt-4 block text-base font-black text-[var(--palette-heading)]">
                    {profession.label}
                  </span>
                  <span className="nn-marketing-body-sm mt-1.5 block flex-1 text-pretty text-[var(--palette-text-muted)]">
                    {profession.description}
                  </span>
                  <span className="mt-3 block text-xs font-bold text-[var(--semantic-info)]">
                    {profession.certifications}
                  </span>
                  <span className="mt-4 inline-flex items-center text-sm font-bold text-[var(--semantic-info)]">
                    Explore pathway
                    <ArrowRight
                      className="ml-1.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Bottom band ─────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--theme-card-bg))] px-6 py-6 text-center sm:px-8">
          <p className="text-sm font-semibold text-[var(--palette-text-muted)]">
            22+ allied health professions including imaging, pharmacy tech, dental hygiene,
            social work, dietetics, sonography, and more.
          </p>
          <Link
            href="/allied-health"
            className={`${MARKETING_SECONDARY_CTA_CLASS} inline-flex`}
            data-testid="allied-health-hub-cta"
          >
            Explore Allied Health
            <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
