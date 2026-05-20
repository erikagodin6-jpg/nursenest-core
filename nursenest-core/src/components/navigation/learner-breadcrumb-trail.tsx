import { AnalyticsBreadcrumbTrail } from "@/components/navigation/analytics-breadcrumb-trail";
import type { BreadcrumbCrumb, BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import type { GovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import { resolveSurfaceFromLearnerKind } from "@/lib/breadcrumbs/breadcrumb-surface";
import {
  resolveLearnerBreadcrumbCrumbs,
  type LearnerBreadcrumbInput,
} from "@/lib/breadcrumbs/learner-breadcrumb-resolver";

const DEFAULT_NAV_CLASS = "nn-marketing-caption text-[var(--theme-muted-text)]";

export type LearnerBreadcrumbTrailProps =
  | (LearnerBreadcrumbInput & {
      pathname?: string;
      navClassName?: string;
      className?: string;
      topicSlug?: string;
      competencyId?: string;
      remediationPathwayId?: string;
      ontologyNamespace?: string;
      learnerStateReason?: string | null;
      graphDepth?: number;
      educationalIntent?: string;
    })
  | {
      resolution: BreadcrumbResolution | GovernedBreadcrumbResolution;
      pathname?: string;
      navClassName?: string;
      className?: string;
      topicSlug?: string;
      competencyId?: string;
    };

function crumbsFromProps(props: LearnerBreadcrumbTrailProps): BreadcrumbCrumb[] {
  if ("resolution" in props) return props.resolution.crumbs;
  const { pathname: _p, navClassName: _n, className: _c, topicSlug: _t, competencyId: _comp, ...input } = props;
  return resolveLearnerBreadcrumbCrumbs(input as LearnerBreadcrumbInput);
}

function pathnameFromProps(props: LearnerBreadcrumbTrailProps): string {
  if (props.pathname) return props.pathname;
  if ("kind" in props) {
    switch (props.kind) {
      case "labs-hub":
        return "/app/labs";
      case "coach":
        return "/app/coach";
      case "review":
        return "/app/review";
      case "practice-tests":
      case "practice-test-leaf":
        return "/app/practice-tests";
      case "exam-plan":
        return "/app/exam-plan";
      case "guided":
        return "/app/guided";
      default:
        return "/app";
    }
  }
  return "/app";
}

/**
 * Governed learner breadcrumb row — no BreadcrumbList JSON-LD.
 */
export function LearnerBreadcrumbTrail(props: LearnerBreadcrumbTrailProps) {
  const crumbs = crumbsFromProps(props);
  if (crumbs.length === 0) return null;
  const pathname = pathnameFromProps(props);
  const wrapperClass = props.className ?? "min-h-9 mb-4";
  const navClassName = props.navClassName ?? DEFAULT_NAV_CLASS;
  const breadcrumbSurface =
    "kind" in props
      ? resolveSurfaceFromLearnerKind(props.kind)
      : "surface" in props.resolution
        ? props.resolution.surface
        : undefined;
  const governed = "resolution" in props && "schemaOwner" in props.resolution ? props.resolution : null;

  return (
    <div className={wrapperClass}>
      <AnalyticsBreadcrumbTrail
        items={crumbs}
        pathname={pathname}
        intent={governed?.intent ?? "learner"}
        breadcrumbSurface={breadcrumbSurface}
        schemaOwner={governed?.schemaOwner ?? "none"}
        breadcrumbDepth={governed?.breadcrumbDepth ?? crumbs.length}
        canonicalRoot={governed?.canonicalRoot ?? "lessons"}
        navClassName={navClassName}
        topicSlug={props.topicSlug}
        competencyId={props.competencyId}
        remediationPathwayId={"remediationPathwayId" in props ? props.remediationPathwayId : undefined}
        ontologyNamespace={"ontologyNamespace" in props ? props.ontologyNamespace : undefined}
        learnerStateReason={"learnerStateReason" in props ? props.learnerStateReason : undefined}
        graphDepth={"graphDepth" in props ? props.graphDepth : undefined}
        educationalIntent={"educationalIntent" in props ? props.educationalIntent : undefined}
        sourceSurface={breadcrumbSurface}
      />
    </div>
  );
}
