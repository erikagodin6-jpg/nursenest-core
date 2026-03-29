import { ALLIED_HEALTH_PROFESSIONS } from "@/allied/data/allied-health-professions";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";

const REGISTERED_ROUTES = new Set([
  "/",
  "/careers",
  "/allied-health/pricing",
  "/pricing/allied",
  "/institutions",
  "/institutions/faq",
  "/institutions/faculty-dashboard",
  "/diagnostic",
  "/qbank",
  "/allied-health",
  "/allied-health/rrt",
  "/allied-health/paramedic",
  "/allied-health/pharmacy-technician",
  "/allied-health/mlt",
  "/allied-health/imaging",
  "/allied-health/social-work",
  "/allied-health/psychotherapy",
  "/allied-health/addictions",
  "/allied-health/occupational-therapy",
  "/allied-health/physical-therapy",
]);

const REGISTERED_ROUTE_PATTERNS = [
  /^\/allied-health\/[^/]+$/,
  /^\/allied-health\/[^/]+\/[^/]+$/,
  /^\/[^/]+\/mock-exams$/,
  /^\/[^/]+\/dashboard$/,
  /^\/[^/]+\/study-plan$/,
  /^\/[^/]+\/flashcards$/,
  /^\/[^/]+\/sims$/,
  /^\/[^/]+\/tools$/,
  /^\/[^/]+\/lessons$/,
  /^\/[^/]+\/practice-questions$/,
  /^\/[^/]+\/mock-exam$/,
  /^\/[^/]+\/study-guide$/,
  /^\/[^/]+\/questions$/,
  /^\/[^/]+\/questions\/[^/]+$/,
  /^\/careers\/[^/]+$/,
  /^\/pharmacy-technician\/.+$/,
  /^\/paramedic\/.+$/,
  /^\/mlt\/.+$/,
];

function isValidRoute(href: string): boolean {
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return true;
  const path = href.split("?")[0];
  if (REGISTERED_ROUTES.has(path)) return true;
  return REGISTERED_ROUTE_PATTERNS.some(pattern => pattern.test(path));
}

export function validateAlliedRoutes(): { valid: string[]; broken: string[]; warnings: string[] } {
  const valid: string[] = [];
  const broken: string[] = [];
  const warnings: string[] = [];

  for (const profession of Object.values(ALLIED_HEALTH_PROFESSIONS)) {
    const hubLink = `/allied-health/${profession.slug}`;
    if (isValidRoute(hubLink)) {
      valid.push(hubLink);
    } else {
      broken.push(`Allied Health Hub card: ${hubLink}`);
    }

    const resources = profession.studyResources;
    for (const [key, resource] of Object.entries(resources)) {
      if (isValidRoute(resource.link)) {
        valid.push(resource.link);
      } else {
        broken.push(`${profession.shortName} studyResources.${key}: ${resource.link}`);
      }
    }
  }

  for (const [slug, data] of Object.entries(PROFESSION_HUB_DATA)) {
    for (const crossLink of data.crossLinks) {
      if (isValidRoute(crossLink.href)) {
        valid.push(crossLink.href);
      } else {
        warnings.push(`${data.shortName} crossLink "${crossLink.label}": ${crossLink.href} (may be external)`);
      }
    }
  }

  const footerLinks = [
    "/allied-health/rrt", "/allied-health/paramedic", "/allied-health/pharmacy-technician", "/allied-health/mlt", "/allied-health/imaging",
    "/allied-health/occupational-therapy", "/allied-health/physical-therapy", "/allied-health/social-work",
    "/careers", "/pricing/allied",
  ];
  for (const link of footerLinks) {
    if (isValidRoute(link)) {
      valid.push(`footer: ${link}`);
    } else {
      broken.push(`Footer link: ${link}`);
    }
  }

  return { valid, broken, warnings };
}

export function logRouteValidation(): void {
  if (import.meta.env.PROD) return;

  const { broken, warnings } = validateAlliedRoutes();

  if (broken.length > 0) {
    console.warn(
      `[Allied Route Validator] ${broken.length} broken link(s) detected:\n` +
      broken.map(b => `  - ${b}`).join("\n")
    );
  }

  if (warnings.length > 0) {
    console.info(
      `[Allied Route Validator] ${warnings.length} warning(s):\n` +
      warnings.map(w => `  - ${w}`).join("\n")
    );
  }

  if (broken.length === 0 && warnings.length === 0) {
    console.info("[Allied Route Validator] All internal links verified.");
  }
}
