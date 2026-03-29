"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";

const dict = strings as Record<string, string>;

export function PreNursingLandingClient() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <FlaskConical className="h-3.5 w-3.5" />
          {dict["preNursing.badge"] ?? "Pre-Nursing"}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {dict["preNursing.pageTitle"] ?? "Pre-Nursing Foundations"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--theme-body-text)]">
          {dict["preNursing.pageSubtitle"] ??
            "Build foundational knowledge before nursing school with interactive lessons and checks."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tools/med-math"
            className="nn-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
          >
            Med math &amp; dosage tools
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/signup" className="nn-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
            {dict["preNursing.explorePlans"] ?? "Explore plans"}
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRE_NURSING_MODULE_REGISTRY.map((m) => (
          <Link
            key={m.slug}
            href={`/pre-nursing/${m.slug}`}
            className="nn-card nn-card-interactive group flex flex-col p-5"
            data-testid={`pre-nursing-card-${m.slug}`}
          >
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)] group-hover:text-primary">
              {dict[m.titleKey] ?? m.slug}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">{dict[m.subtitleKey] ?? ""}</p>
            <p className="mt-3 text-xs font-medium text-primary">
              {m.lessons} {dict["preNursing.interactiveLessons"] ?? "interactive lessons"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
