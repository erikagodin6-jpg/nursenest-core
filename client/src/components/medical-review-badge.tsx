import { ShieldCheck, CalendarDays, Linkedin } from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
interface Reviewer {
  name: string;
  credentials: string;
  role: string;
  bio: string;
  linkedIn?: string;
}

const REVIEWERS: Reviewer[] = [
  {
    name: "Erika Godin",
    credentials: "RN, BScN",
    role: "Founder & Clinical Content Director",
    bio: "Registered Nurse and former RPN with direct clinical experience across medical-surgical, community health, and acute care settings. Currently pursuing a Master of Nursing degree. All NurseNest content is authored and reviewed under her clinical oversight.",
    linkedIn: "https://www.linkedin.com/in/erika-godin-rn/",
  },
];

export const MEDICAL_REVIEWERS = REVIEWERS;

interface MedicalReviewBadgeProps {
  lastUpdated?: string;
  className?: string;
}

export function MedicalReviewBadge({ lastUpdated, className = "" }: MedicalReviewBadgeProps) {
  const { t } = useI18n();
  const reviewer = REVIEWERS[0];
  const parsedDate = lastUpdated ? new Date(lastUpdated) : null;
  const displayDate = parsedDate && !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString("en-CA", { year: "numeric", month: "long" })
    : new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long" });

  return (
    <div className={`rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 ${className}`} data-testid="medical-review-badge">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            Medically reviewed by {reviewer.name}, {reviewer.credentials}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {reviewer.role}
          </p>
          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
            {reviewer.bio}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CalendarDays className="w-3 h-3" />
              <span>Last medically reviewed: {displayDate}</span>
            </div>
            {reviewer.linkedIn && (
              <a
                href={reviewer.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                data-testid="link-reviewer-linkedin"
              >
                <Linkedin className="w-3 h-3" />
                <span>{t("components.medicalReviewBadge.linkedin")}</span>
              </a>
            )}
          </div>
          <LocaleLink
            href="/medical-review-team"
            className="inline-block mt-2 text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            data-testid="link-medical-review-team"
          >
            Meet our medical review team →
          </LocaleLink>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            All clinical content on NurseNest is authored and reviewed by Registered Nurses with active clinical experience. Our editorial process follows evidence-based nursing practice standards.
          </p>
        </div>
      </div>
    </div>
  );
}

export function MedicalReviewJsonLd({ title, slug, lastUpdated, description, pageUrl }: {
  title: string;
  slug: string;
  lastUpdated?: string;
  description?: string;
  pageUrl?: string;
}) {
  const reviewer = REVIEWERS[0];
  const baseUrl = "https://www.nursenest.ca";
  const dateStr = lastUpdated || new Date().toISOString().split("T")[0];
  const url = pageUrl || `${baseUrl}/lessons/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": title,
    "url": url,
    "datePublished": dateStr,
    "dateModified": dateStr,
    "description": description || `Clinical nursing study guide: ${title}. Evidence-based pathophysiology, nursing interventions, pharmacology, and exam preparation.`,
    "author": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": baseUrl,
    },
    "reviewedBy": {
      "@type": "Person",
      "name": reviewer.name,
      "jobTitle": reviewer.role,
      "affiliation": {
        "@type": "Organization",
        "name": "NurseNest",
        "url": baseUrl,
      },
    },
    "publisher": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.png`,
      },
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Nurse",
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "NurseNest",
      "url": baseUrl,
    },
    "inLanguage": "en",
    "about": {
      "@type": "MedicalCondition",
      "name": title,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
