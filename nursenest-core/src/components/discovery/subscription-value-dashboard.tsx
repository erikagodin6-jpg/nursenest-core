import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, LockKeyhole, Sparkles } from "lucide-react";
import type { FeatureValueProfile } from "@/lib/discovery/feature-value-communication";

export function SubscriptionValueDashboard({ profile }: { profile: FeatureValueProfile }) {
  return (
    <section className="nn-card nn-student-card-lift rounded-2xl border border-border bg-card p-6 text-foreground shadow-sm" data-testid="subscription-value-dashboard">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Membership value</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">Your Membership Includes</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            See what is included, what you have already used, and the next feature that can help your study plan.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] px-5 py-4 text-left lg:min-w-52">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Feature utilization</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-primary">{profile.utilizationScore}%</p>
          <p className="text-xs text-muted-foreground">
            {profile.usedIncludedCount} of {profile.includedCount} included features used
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="size-4 text-primary" aria-hidden />
            Included in your plan
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {profile.included.map((feature) => (
              <Link
                key={feature.key}
                href={feature.href}
                className="group rounded-xl border border-border bg-card p-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
                data-feature-value-state={feature.used ? "used" : "not-yet-used"}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-semibold text-foreground">{feature.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{feature.description}</span>
                  </span>
                  <span
                    className={[
                      "shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                      feature.used
                        ? "border-primary/25 bg-primary/[0.08] text-primary"
                        : "border-border bg-muted/20 text-muted-foreground",
                    ].join(" ")}
                  >
                    {feature.used ? "Used" : "Not yet used"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Compass className="size-4 text-primary" aria-hidden />
              Try next
            </div>
            {profile.prompts.length > 0 ? (
              <div className="mt-3 space-y-3">
                {profile.prompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={prompt.href}
                    className="group block rounded-xl border border-border bg-card p-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
                  >
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-primary">
                        {prompt.tone === "upgrade" ? <LockKeyhole className="size-4" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground">{prompt.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{prompt.body}</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          {prompt.cta}
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                You have explored the main included features. Keep rotating questions, lessons, flashcards, and analytics.
              </p>
            )}
          </div>

          {profile.upgrades.length > 0 ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.05] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LockKeyhole className="size-4 text-primary" aria-hidden />
                Upgrade discovery
              </div>
              <div className="mt-3 space-y-2">
                {profile.upgrades.map((feature) => (
                  <Link
                    key={feature.key}
                    href={feature.upgradeHref ?? feature.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/[0.04]"
                  >
                    <span>{feature.label}</span>
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
