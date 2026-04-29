import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Baby,
  BookOpen,
  Brain,
  Briefcase,
  ClipboardList,
  HeartPulse,
  MessageSquare,
  Pill,
  Scale,
  Shield,
  Sparkles,
  Stethoscope,
  Timer,
  Users,
  Wind,
} from "lucide-react";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

export type LessonHubSystemVisual = {
  icon: LucideIcon;
  accentVar: string;
};

/**
 * Icon + accent tokens shared by marketing/app lesson hubs and practice-topic pickers.
 * Keys align with `PathwayLessonSystemSection.systemLabel` and related taxonomy ids.
 */
export const LESSON_HUB_SYSTEM_VISUALS: Record<string, LessonHubSystemVisual> = {
  cardiovascular: { icon: HeartPulse, accentVar: "--semantic-danger" },
  respiratory: { icon: Wind, accentVar: "--semantic-info" },
  neurology: { icon: Brain, accentVar: "--semantic-chart-2" },
  neurological: { icon: Brain, accentVar: "--semantic-chart-2" },
  endocrine: { icon: Activity, accentVar: "--semantic-chart-3" },
  gastrointestinal: { icon: Sparkles, accentVar: "--semantic-chart-5" },
  "renal-genitourinary": { icon: Timer, accentVar: "--semantic-chart-3" },
  renal_genitourinary: { icon: Timer, accentVar: "--semantic-chart-3" },
  renal_urinary: { icon: Timer, accentVar: "--semantic-chart-3" },
  musculoskeletal: { icon: Activity, accentVar: "--semantic-chart-2" },
  "hematology-oncology": { icon: HeartPulse, accentVar: "--semantic-danger" },
  hematology_oncology: { icon: HeartPulse, accentVar: "--semantic-danger" },
  "immune-infectious": { icon: AlertTriangle, accentVar: "--semantic-warning" },
  immune_infectious: { icon: AlertTriangle, accentVar: "--semantic-warning" },
  dermatology: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  integumentary: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  "reproductive-ob-gyn": { icon: Baby, accentVar: "--semantic-chart-5" },
  reproductive_obstetrics: { icon: Baby, accentVar: "--semantic-chart-5" },
  reproductive_maternal_newborn: { icon: Baby, accentVar: "--semantic-chart-5" },
  pharmacology: { icon: Pill, accentVar: "--semantic-brand" },
  pharmacology_prescribing: { icon: Pill, accentVar: "--semantic-brand" },
  cardiovascular_drugs: { icon: Pill, accentVar: "--semantic-danger" },
  cns_drugs: { icon: Pill, accentVar: "--semantic-chart-4" },
  endocrine_drugs: { icon: Pill, accentVar: "--semantic-chart-3" },
  anti_infectives: { icon: Pill, accentVar: "--semantic-warning" },
  pain_sedation: { icon: Pill, accentVar: "--semantic-info" },
  pediatrics: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  "mental-health": { icon: Brain, accentVar: "--semantic-chart-4" },
  mental_health: { icon: Brain, accentVar: "--semantic-chart-4" },
  primary_care: { icon: Stethoscope, accentVar: "--semantic-chart-1" },
  health_assessment: { icon: ClipboardList, accentVar: "--semantic-info" },
  diagnostics_clinical_reasoning: { icon: Activity, accentVar: "--semantic-chart-2" },
  chronic_disease_management: { icon: HeartPulse, accentVar: "--semantic-chart-3" },
  acute_episodic_care: { icon: AlertTriangle, accentVar: "--semantic-warning" },
  womens_health: { icon: Baby, accentVar: "--semantic-chart-5" },
  older_adults: { icon: Users, accentVar: "--semantic-chart-2" },
  "professional-practice-ethics": { icon: MessageSquare, accentVar: "--semantic-chart-4" },
  professional_practice: { icon: Briefcase, accentVar: "--semantic-chart-5" },
  ethics: { icon: MessageSquare, accentVar: "--semantic-chart-4" },
  legal_regulation: { icon: Scale, accentVar: "--semantic-chart-4" },
  documentation: { icon: ClipboardList, accentVar: "--semantic-chart-3" },
  communication: { icon: Users, accentVar: "--semantic-info" },
  scope_of_practice: { icon: Shield, accentVar: "--semantic-chart-2" },
  delegation_supervision: { icon: Briefcase, accentVar: "--semantic-chart-2" },
  leadership_management: { icon: Briefcase, accentVar: "--semantic-chart-5" },
  patient_safety_quality: { icon: AlertTriangle, accentVar: "--semantic-warning" },
  infection_control: { icon: AlertTriangle, accentVar: "--semantic-info" },
  fundamentals_safety: { icon: Shield, accentVar: "--semantic-warning" },
  test_taking: { icon: BookOpen, accentVar: "--semantic-brand" },
  study_strategy: { icon: BookOpen, accentVar: "--semantic-chart-1" },
  exam_strategy: { icon: BookOpen, accentVar: "--semantic-brand" },
  fundamentals: { icon: Stethoscope, accentVar: "--semantic-chart-1" },
  [REVIEW_REQUIRED]: { icon: AlertTriangle, accentVar: "--semantic-warning" },
};

export function getLessonHubSystemVisual(systemLabel: string): LessonHubSystemVisual {
  return LESSON_HUB_SYSTEM_VISUALS[systemLabel] ?? { icon: Activity, accentVar: "--semantic-brand" };
}
