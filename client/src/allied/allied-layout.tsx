import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { AlliedNavigation } from "./allied-navigation";
import { AlliedFooter } from "./allied-footer";
import { AlliedSubNav } from "./allied-sub-nav";

export function AlliedLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const isCareerPage = /^\/allied-health\/(rrt|paramedic|pharmacy-technician|pharmacy-tech|mlt|imaging|occupational-therapy|occupational-therapist|physical-therapy|social-work|social-worker|psychotherapy|psychotherapist|addictions|addictions-counsellor|health-info-mgmt|respiratory-therapy|radiologic-technologist|diagnostic-sonography|cardiac-sonographer|occupational-therapy-assistant|physiotherapy-assistant|surgical-technologist)(\/|$)/.test(location);

  return (
    <div className="min-h-screen flex flex-col" data-testid="allied-layout">
      <AlliedNavigation />
      {isCareerPage && <AlliedSubNav />}
      <main className="flex-1">
        {children}
      </main>
      <AlliedFooter />
    </div>
  );
}
