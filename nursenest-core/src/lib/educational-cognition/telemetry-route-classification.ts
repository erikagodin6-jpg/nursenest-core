/**
 * Route classification for public vs authenticated telemetry partitions.
 */

export type TelemetryRouteClass =
  | "public_marketing"
  | "public_learner"
  | "authenticated_learner"
  | "staff_admin";

const MARKETING_PREFIXES = [
  "/",
  "/rn",
  "/rpn",
  "/np",
  "/canada",
  "/pricing",
  "/blog",
  "/about",
  "/contact",
];

const PUBLIC_LEARNER_PREFIXES = ["/sign-in", "/sign-up", "/auth"];

export function classifyTelemetryRoute(pathname: string): TelemetryRouteClass {
  const path = pathname.split("?")[0] ?? pathname;
  if (path.startsWith("/admin") || path.startsWith("/staff")) return "staff_admin";
  if (path.startsWith("/app")) return "authenticated_learner";
  for (const prefix of PUBLIC_LEARNER_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return "public_learner";
  }
  for (const prefix of MARKETING_PREFIXES) {
    if (path === prefix || (prefix !== "/" && path.startsWith(prefix))) return "public_marketing";
  }
  return "public_marketing";
}

export function allowsRawCognitionTelemetry(routeClass: TelemetryRouteClass): boolean {
  return routeClass === "authenticated_learner" || routeClass === "staff_admin";
}

export function allowsPsychometricNamespaces(routeClass: TelemetryRouteClass): boolean {
  return routeClass === "staff_admin";
}

export function isIndexableLearnerSurface(pathname: string): boolean {
  const c = classifyTelemetryRoute(pathname);
  return c === "public_marketing" || c === "public_learner";
}
