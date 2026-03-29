"use client";

import dynamic from "next/dynamic";

const StudyPlanTool = dynamic(() => import("./study-plan-tool").then((m) => m.StudyPlanTool), {
  loading: () => <p className="text-sm text-muted">Loading study planner…</p>,
  ssr: false,
});

export function StudyPlanToolGateway() {
  return <StudyPlanTool />;
}
