import "server-only";

import { redirect } from "next/navigation";
import type { EcgRouteLoadResult } from "@/lib/ecg/ecg-route-loader";

export function assertEcgRouteAllowed(
  result: EcgRouteLoadResult,
  callbackPath: string,
): asserts result is Extract<EcgRouteLoadResult, { kind: "ok" }> {
  if (result.kind === "signin") {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }
  if (result.kind === "forbidden_pathway") {
    redirect(`/app/${result.correctSegment}/ecg`);
  }
}
