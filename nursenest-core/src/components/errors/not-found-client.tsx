"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import type { NotFoundResumeStudying } from "@/lib/ui/not-found-resume";

type NotFoundClientProps = {
  isAuthenticated: boolean;
  resumeStudying: NotFoundResumeStudying | null;
};

function FloatingLogo() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="mx-auto mb-8 flex items-center justify-center"
      animate={
        reduced
          ? {}
          : {
              y: [0, -4, 0],
              rotate: [0, 1.2, 0, -1.2, 0],
              opacity: [0.9, 1, 0.9],
            }
      }
      transition={
        reduced
          ? {}
          : {
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }
      }
      whileHover={reduced ? {} : { rotate: -3, transition: { duration: 0.3 } }}
    >
      <SiteBrandLogoMark variant="hero" />
    </motion.div>
  );
}

export function NotFoundClient({ isAuthenticated, resumeStudying }: NotFoundClientProps) {
  const primaryHref = resumeStudying?.href ?? (isAuthenticated ? "/app" : "/");
  const primaryLabel = resumeStudying?.label ?? (isAuthenticated ? "Return to Dashboard" : "Return Home");

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "var(--background-subtle, var(--nn-presentation-wash, var(--theme-page-bg)))" }}
    >
      <main
        className="w-full max-w-[480px] text-center"
        style={{
          background: "var(--bg-card, var(--theme-card-bg))",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "var(--shadow-card-hover)",
        }}
      >
        <FloatingLogo />

        <p
          className="mb-3 text-xs font-bold uppercase tracking-[0.14em]"
          style={{ color: "var(--theme-primary)" }}
        >
          404
        </p>

        <h1
          className="text-2xl font-extrabold tracking-tight sm:text-3xl"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Page Not Found
        </h1>

        <p
          className="mt-3 max-w-sm mx-auto text-[0.9375rem] leading-relaxed"
          style={{ color: "var(--theme-muted-text)" }}
        >
          This page is not available or may have moved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={primaryHref} className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md">
            {primaryLabel}
          </Link>
          <Link href="/lessons" className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md">
            Go to Lessons
          </Link>
        </div>
      </main>
    </div>
  );
}
