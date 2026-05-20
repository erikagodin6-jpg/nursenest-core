import Link from "next/link";

export const LEARNER_FOOTER_SECTIONS = [
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Careers", "/careers"],
      ["Blog", "/blog"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
      ["Cookie Policy", "/cookie-policy"],
      ["Disclaimer", "/disclaimer"],
    ],
  },
  {
    title: "Platform",
    links: [
      ["Pricing", "/pricing"],
      ["Membership Tiers", "/membership-tiers"],
      ["Institutional Pricing", "/for-institutions"],
      ["Enterprise Solutions", "/enterprise-solutions"],
      ["Features", "/features"],
      ["FAQ", "/faq"],
      ["Support", "/support"],
    ],
  },
  {
    title: "Providers",
    links: [
      ["Join as a Provider", "/providers/join"],
      ["Provider Resources", "/providers/resources"],
      ["Credentialing Information", "/providers/credentialing"],
    ],
  },
] as const;

export function LearnerAppFooter() {
  return (
    <footer
      className="mt-10 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
      aria-label="NurseNest footer"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LEARNER_FOOTER_SECTIONS.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
              {section.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {section.links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-[var(--semantic-text-secondary)] transition hover:text-[var(--semantic-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mt-6 border-t border-[var(--semantic-border-soft)] pt-4 text-xs text-[var(--semantic-text-muted)]">
        © {new Date().getFullYear()} NurseNest. All rights reserved.
      </p>
    </footer>
  );
}
