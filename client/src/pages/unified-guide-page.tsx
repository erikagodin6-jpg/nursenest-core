import { useParams } from "wouter";
import { getHealthcareGuideBySlug } from "@shared/healthcare-guide-data";
import HealthcareGuidePage from "./healthcare-guide-page";
import GuidePage from "./guide-page";

export default function UnifiedGuidePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const healthcareGuide = getHealthcareGuideBySlug(slug);
  if (healthcareGuide) {
    return <HealthcareGuidePage />;
  }

  return <GuidePage />;
}
