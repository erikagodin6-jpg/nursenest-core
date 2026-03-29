import { LocaleLink } from "@/lib/LocaleLink";
import { NEW_GRAD_PROFESSIONS, CLINICAL_SKILLS_CATEGORIES, UNIT_GUIDES, CAREER_DEVELOPMENT_PATHS } from "@shared/new-grad-professions";
import { ArrowRight, BookOpen, GraduationCap, TrendingUp, Stethoscope } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface InternalLinksProps {
  currentPath: string;
  profession?: string;
  professionName?: string;
}

export function InternalLinks({ currentPath, profession, professionName }: InternalLinksProps) {
  const { t } = useI18n();
  const profData = profession ? NEW_GRAD_PROFESSIONS[profession] : null;

  const professionLinks = Object.values(NEW_GRAD_PROFESSIONS)
    .filter(p => p.slug !== profession)
    .slice(0, 4)
    .map(p => ({
      href: `/new-grad/${p.slug}`,
      label: `${p.shortName} Career Hub`,
      category: "Profession Hubs",
    }));

  const skillLinks = Object.entries(CLINICAL_SKILLS_CATEGORIES)
    .filter(([key]) => !currentPath.includes(key))
    .slice(0, 3)
    .map(([key, skill]) => ({
      href: `/new-grad/clinical-skills/${key}`,
      label: skill.name,
      category: "Clinical Skills",
    }));

  const unitLinks = Object.entries(UNIT_GUIDES)
    .filter(([key]) => !currentPath.includes(key))
    .slice(0, 3)
    .map(([key, unit]) => ({
      href: `/new-grad/unit-guide/${key}`,
      label: `${unit.name} Guide`,
      category: "Unit Guides",
    }));

  const careerLinks = Object.entries(CAREER_DEVELOPMENT_PATHS)
    .filter(([key]) => !currentPath.includes(key))
    .filter(([_, path]) => !profession || path.fromProfession === profession)
    .slice(0, 3)
    .map(([key, path]) => ({
      href: `/new-grad/career/${key}`,
      label: path.name,
      category: "Career Development",
    }));

  const nurseNestLinks = [
    { href: "/newgrad", label: "New Grad Career Hub", category: "NurseNest Resources" },
    { href: "/newgrad/certifications", label: "Certification Prep", category: "NurseNest Resources" },
    { href: "/newgrad/clinical-references", label: "Clinical References", category: "NurseNest Resources" },
    { href: "/mock-exams", label: "Practice Exams", category: "NurseNest Resources" },
    { href: "/flashcards", label: "Flashcards", category: "NurseNest Resources" },
  ];

  const alliedHealthLinks = [
    { href: "/allied-health/respiratory-therapy", label: "RRT Exam Prep", category: "Allied Health Exam Prep" },
    { href: "/allied-health/paramedic", label: "Paramedic Exam Prep", category: "Allied Health Exam Prep" },
    { href: "/allied-health/medical-laboratory-technologist", label: "MLT Exam Prep", category: "Allied Health Exam Prep" },
    { href: "/allied-health/radiologic-technologist", label: "Radiography Exam Prep", category: "Allied Health Exam Prep" },
  ];

  const allLinks = [
    ...professionLinks,
    ...skillLinks,
    ...unitLinks,
    ...careerLinks,
    ...nurseNestLinks,
    ...alliedHealthLinks,
  ].filter(link => link.href !== currentPath);

  const grouped = allLinks.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof allLinks>);

  const categoryIcons: Record<string, any> = {
    "Profession Hubs": GraduationCap,
    "Clinical Skills": BookOpen,
    "Unit Guides": Stethoscope,
    "Career Development": TrendingUp,
    "NurseNest Resources": BookOpen,
    "Allied Health Exam Prep": BookOpen,
  };

  return (
    <section className="py-12 bg-white border-t border-gray-100" data-testid="section-internal-links">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{t("components.newGradInternalLinks.relatedResources")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => {
              const priority = ["Profession Hubs", "Allied Health Exam Prep", "Clinical Skills", "NurseNest Resources", "Unit Guides", "Career Development"];
              return (priority.indexOf(a) === -1 ? 99 : priority.indexOf(a)) - (priority.indexOf(b) === -1 ? 99 : priority.indexOf(b));
            })
            .slice(0, 4).map(([category, links]) => {
            const CatIcon = categoryIcons[category] || BookOpen;
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CatIcon className="w-4 h-4" />
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.slice(0, 4).map((link) => (
                    <li key={link.href}>
                      <LocaleLink href={link.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1" data-testid={`internal-link-${link.href.replace(/\//g, "-")}`}>
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        {link.label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
