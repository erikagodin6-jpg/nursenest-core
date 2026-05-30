import type { Metadata } from "next";
import { PhysiologyMonitorClient } from "./physiology-monitor-client";

export const metadata: Metadata = {
  title: "Physiology Monitor | NurseNest",
  description: "Simulated deteriorating patient monitor for clinical reasoning training.",
};

export default function PhysiologyMonitorPage() {
  return <PhysiologyMonitorClient />;
}
