"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { NotFoundResumeStudying } from "@/lib/ui/not-found-resume";

type NotFoundClientProps = {
  isAuthenticated: boolean;
  resumeStudying: NotFoundResumeStudying | null;
};

function FloatingLeaf() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="mx-auto mb-8 w-20 sm:w-24"
      animate={
        reduced
          ? {}
          : {
              y: [0, -3, 0],
              rotate: [0, 1.5, 0, -1.5, 0],
              opacity: [0.85, 1, 0.85],
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
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 32"
        className="h-auto w-full"
        aria-hidden
      >
        <path
          d="M6 28 C6 17 14.5 9 25 9 S44 17 44 28 Z"
          fill="var(--theme-primary)"
        />
        <path
          d="M11 28 C11 20.5 17 15 25 15 S39 20.5 39 28 Z"
          fill="var(--theme-card-bg, #fff)"
        />
      </svg>
    </motion.div>
  );
}

export function NotFoundClient({ isAuthenticated, resumeStudying }: NotFoundClientProps) {
  const primaryHref = resumeStudying?.href ?? (isAuthenticated ? "/app" : "/");
  const primaryLabel = resumeStudying?.label ?? (isAuthenticated ? "Return to Dashboard" : "Return Home");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 py-20 text-center">
      <FloatingLeaf />

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
        className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed"
        style={{ color: "var(--theme-muted-text)" }}
      >
        This page is not available or may have moved.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href={primaryHref} className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md">
          {primaryLabel}
        </Link>
        <Link href="/lessons" className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md">
          Go to Lessons
        </Link>
      </div>
    </main>
  );
}
