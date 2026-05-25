/**
 * 🧊 Static site footer for public-static routes.
 *
 * No session/auth dependencies. Pure static markup.
 * Use this in `(public-static)/layout.tsx` instead of SiteFooter
 * (which may depend on session context).
 */
import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { href: "/pricing", label: "Pricing" },
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/for-institutions", label: "For institutions" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/nclex-question-bank", label: "Question bank" },
    { href: "/flashcards", label: "Flashcards" },
  ],
  "Exam prep": [
    { href: "/nclex-rn", label: "NCLEX-RN" },
    { href: "/canada/rn", label: "Canada RN" },
    { href: "/np", label: "NP" },
    { href: "/rex-pn", label: "REx-PN" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/editorial-policy", label: "Editorial policy" },
  ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/cookie-policy", label: "Cookies" },
    { href: "/acceptable-use", label: "Acceptable use" },
  ],
} as const;

export function SiteFooterStatic() {
  return (
    <footer className="border-t border-[var(--theme-border-soft)] bg-[var(--theme-page-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{heading}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--theme-muted-text)] transition hover:text-[var(--theme-heading-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-[var(--theme-border-soft)] pt-6 text-center text-xs text-[var(--theme-muted-text)]">
          &copy; {new Date().getFullYear()} NurseNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}