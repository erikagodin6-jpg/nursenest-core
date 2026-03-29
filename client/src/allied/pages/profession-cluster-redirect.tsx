import { Redirect } from "wouter";
import { getCanonicalRoute } from "@shared/careers";

const CLUSTER_CAREER_MAP: Record<string, string> = {
  rrt: "rrt",
  "social-work": "social-worker",
  psychotherapy: "psychotherapist",
  addictions: "addictions-counsellor",
  "occupational-therapy": "occupational-therapy",
  "physical-therapy": "physical-therapy",
  "health-info-mgmt": "health-info-mgmt",
  paramedic: "paramedic",
  mlt: "mlt",
  imaging: "imaging",
  "pharmacy-technician": "pharmacy-tech",
  "occupational-therapy-assistant": "occupational-therapy-assistant",
  "physiotherapy-assistant": "physiotherapy-assistant",
  "surgical-technologist": "surgical-technologist",
  "radiologic-technologist": "radiologic-technologist",
  "diagnostic-sonography": "diagnostic-sonography",
  "cardiac-sonographer": "cardiac-sonographer",
};

interface ClusterRedirectProps {
  profession: string;
  clusterType: "lessons" | "practice-questions" | "flashcards" | "mock-exam" | "study-guide";
}

export default function ProfessionClusterRedirect({ profession, clusterType }: ClusterRedirectProps) {
  const careerSlug = CLUSTER_CAREER_MAP[profession] || profession;
  const canonical = getCanonicalRoute(careerSlug);

  const redirectMap: Record<string, string> = {
    lessons: `/allied-health/qbank?career=${careerSlug}&view=lessons`,
    "practice-questions": `/allied-health/qbank?career=${careerSlug}`,
    flashcards: `${canonical}/flashcards`,
    "mock-exam": `${canonical}/mock-exams`,
    "study-guide": `${canonical}/study-plan`,
  };

  const target = redirectMap[clusterType] || canonical;
  return <Redirect to={target} />;
}
