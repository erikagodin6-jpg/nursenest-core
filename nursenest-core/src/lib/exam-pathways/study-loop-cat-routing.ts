import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  appCatWeakFocusPath,
  appPathwayCatSessionStartPath,
  resolvePreferredCatPathwayId,
} from "@/lib/exam-pathways/pathway-cat-flow";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

export type StudyLoopCatAuthState = "signed_in" | "public";
export type StudyLoopCatIntent = "start" | "weak_focus";
export type StudyLoopCatDestinationKind = "public" | "app_start" | "app_weak_focus" | "generic_chooser";

export type ResolveStudyLoopCatDestinationArgs = {
  authState: StudyLoopCatAuthState;
  pathwayId?: string | null;
  availablePathwayIds?: Array<string | null | undefined>;
  intent?: StudyLoopCatIntent;
  topic?: string | null;
  allowGenericChooser?: boolean;
};

export type StudyLoopCatDestination = {
  kind: StudyLoopCatDestinationKind;
  href: string;
  pathwayId: string | null;
  isPathwayScoped: boolean;
  authState: StudyLoopCatAuthState;
  intent: StudyLoopCatIntent;
};

function resolveKnownPathwayId(args: ResolveStudyLoopCatDestinationArgs): string | null {
  const preferred = resolvePreferredCatPathwayId(args.pathwayId, args.availablePathwayIds);
  if (!preferred) return null;
  return getExamPathwayById(preferred) ? preferred : null;
}

export function resolveStudyLoopCatDestination(
  args: ResolveStudyLoopCatDestinationArgs,
): StudyLoopCatDestination {
  const intent = args.intent ?? "start";
  const knownPathwayId = resolveKnownPathwayId(args);

  if (args.authState === "signed_in" && knownPathwayId) {
    if (intent === "weak_focus") {
      return {
        kind: "app_weak_focus",
        href: appCatWeakFocusPath(knownPathwayId, args.topic),
        pathwayId: knownPathwayId,
        isPathwayScoped: true,
        authState: args.authState,
        intent,
      };
    }
    return {
      kind: "app_start",
      href: appPathwayCatSessionStartPath(knownPathwayId),
      pathwayId: knownPathwayId,
      isPathwayScoped: true,
      authState: args.authState,
      intent,
    };
  }

  if (args.authState === "public" && knownPathwayId) {
    const pathway = getExamPathwayById(knownPathwayId)!;
    return {
      kind: "public",
      href: buildExamPathwayPath(pathway, "cat"),
      pathwayId: knownPathwayId,
      isPathwayScoped: true,
      authState: args.authState,
      intent,
    };
  }

  if (args.authState === "signed_in" && intent === "weak_focus") {
    return {
      kind: "app_weak_focus",
      href: appCatWeakFocusPath(null, args.topic),
      pathwayId: null,
      isPathwayScoped: false,
      authState: args.authState,
      intent,
    };
  }

  if (args.allowGenericChooser === false) {
    const fallbackHref = args.authState === "signed_in" ? "/app/practice-tests/start" : HUB.practiceExams;
    return {
      kind: "generic_chooser",
      href: fallbackHref,
      pathwayId: null,
      isPathwayScoped: false,
      authState: args.authState,
      intent,
    };
  }

  return {
    kind: "generic_chooser",
    href: args.authState === "signed_in" ? "/app/practice-tests/start" : HUB.practiceExams,
    pathwayId: null,
    isPathwayScoped: false,
    authState: args.authState,
    intent,
  };
}

export function resolveStudyLoopCatHref(args: ResolveStudyLoopCatDestinationArgs): string {
  return resolveStudyLoopCatDestination(args).href;
}
