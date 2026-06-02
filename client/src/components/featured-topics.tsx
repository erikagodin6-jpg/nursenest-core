import {
  Droplets,
  Pill,
  ShieldAlert,
  Wind,
  Activity,
  Scale,
  Beaker,
  Stethoscope,
  Microscope,
  Clock,
} from "lucide-react";
import { type DifficultyLevel } from "@/lib/difficulty";
import type { LucideIcon } from "lucide-react";

interface TopicCard {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  time: string;
  lessonId: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

interface TierConfig {
  title: string;
  cards: TopicCard[];
}

const difficultyDisplay: Record<DifficultyLevel, { label: string; bg: string; text: string }> = {
  1: { label: "Beginner", bg: "bg-green-100", text: "text-green-700" },
  2: { label: "Easy", bg: "bg-blue-100", text: "text-blue-700" },
  3: { label: "Moderate", bg: "bg-amber-100", text: "text-amber-700" },
  4: { label: "Hard", bg: "bg-orange-100", text: "text-orange-700" },
  5: { label: "Expert", bg: "bg-red-100", text: "text-red-700" },
};

const tierConfigs: Record<string, TierConfig> = {
  rpn: {
    title: "Most Tested Practical Nursing Topics",
    cards: [
      { title: "Fluid & Electrolytes", description: "Understand fluid balance, dehydration, and key electrolyte imbalances", difficulty: 2, time: "8 min", lessonId: "fluid-balance-assessment", icon: Droplets, iconColor: "text-cyan-600", iconBg: "bg-cyan-50" },
      { title: "Medication Safety", description: "Master the rights of medication administration and error prevention", difficulty: 2, time: "6 min", lessonId: "medication-administration-safety", icon: Pill, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
      { title: "Infection Prevention", description: "PPE standards, isolation precautions, and chain of infection", difficulty: 1, time: "5 min", lessonId: "infection-prevention-ppe", icon: ShieldAlert, iconColor: "text-green-600", iconBg: "bg-green-50" },
      { title: "Respiratory Disorders", description: "COPD, asthma, pneumonia and oxygen therapy fundamentals", difficulty: 3, time: "10 min", lessonId: "respiratory-assessment", icon: Wind, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
      { title: "Diabetes Basics", description: "Type 1 vs Type 2, insulin management, and hypoglycemia recognition", difficulty: 2, time: "8 min", lessonId: "diabetes-management-rpn", icon: Activity, iconColor: "text-orange-600", iconBg: "bg-orange-50" },
      { title: "Delegation & Prioritization", description: "Scope of practice, ABCs, and clinical decision frameworks", difficulty: 3, time: "7 min", lessonId: "delegation-rules-scope", icon: Scale, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
    ],
  },
  rn: {
    title: "Most Tested NCLEX Topics",
    cards: [
      { title: "Shock Types", description: "Hypovolemic, cardiogenic, distributive, and obstructive shock pathophysiology", difficulty: 4, time: "12 min", lessonId: "shock-types-recognition-rpn", icon: Activity, iconColor: "text-red-600", iconBg: "bg-red-50" },
      { title: "Acid-Base Disorders", description: "ABG interpretation, metabolic and respiratory acidosis and alkalosis", difficulty: 4, time: "15 min", lessonId: "abg-basics", icon: Beaker, iconColor: "text-indigo-600", iconBg: "bg-indigo-50" },
      { title: "Heart Failure", description: "Left vs right-sided failure, preload, afterload, and nursing priorities", difficulty: 3, time: "10 min", lessonId: "heart-failure", icon: Activity, iconColor: "text-rose-600", iconBg: "bg-rose-50" },
      { title: "Sepsis", description: "SIRS criteria, sepsis bundles, and early recognition", difficulty: 4, time: "12 min", lessonId: "sepsis-screening-rn", icon: ShieldAlert, iconColor: "text-orange-600", iconBg: "bg-orange-50" },
      { title: "Arrhythmias", description: "ECG interpretation, lethal rhythms, and nursing interventions", difficulty: 4, time: "14 min", lessonId: "conduction-system", icon: Activity, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
      { title: "Renal Failure", description: "AKI vs CKD, dialysis, and fluid management", difficulty: 3, time: "11 min", lessonId: "aki-management", icon: Beaker, iconColor: "text-cyan-600", iconBg: "bg-cyan-50" },
    ],
  },
  np: {
    title: "Critical NP Certification Topics",
    cards: [
      { title: "Advanced Cardiovascular", description: "ACS management, hemodynamic monitoring, and advanced cardiac pharmacology", difficulty: 5, time: "18 min", lessonId: "mi-management-np", icon: Activity, iconColor: "text-red-600", iconBg: "bg-red-50" },
      { title: "Endocrine Regulation", description: "Thyroid disorders, adrenal insufficiency, and DKA/HHS management", difficulty: 5, time: "15 min", lessonId: "dka-hhns-np", icon: Microscope, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
      { title: "Renal-Endocrine Interaction", description: "SIADH, diabetes insipidus, and electrolyte cascade effects", difficulty: 5, time: "14 min", lessonId: "siadh-di-np", icon: Beaker, iconColor: "text-cyan-600", iconBg: "bg-cyan-50" },
      { title: "Advanced Respiratory", description: "ARDS, mechanical ventilation, and ventilator management", difficulty: 5, time: "16 min", lessonId: "copd-exacerbation-np", icon: Wind, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
      { title: "Diagnostic Pattern Recognition", description: "Differential diagnosis frameworks and clinical decision-making", difficulty: 5, time: "20 min", lessonId: "differential-diagnosis-np", icon: Stethoscope, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
    ],
  },
};

interface FeaturedTopicsProps {
  activeTier: string;
  onNavigate: (path: string) => void;
}

export function FeaturedTopics({ activeTier, onNavigate }: FeaturedTopicsProps) {
  if (activeTier === "pharmacology") return null;

  const config = tierConfigs[activeTier];
  if (!config) return null;

  return (
    <section data-testid="featured-topics-section" className="mb-10">
      <h2 data-testid="featured-topics-title" className="text-2xl font-bold text-gray-900 mb-6">
        {config.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.cards.map((card) => {
          const diff = difficultyDisplay[card.difficulty];
          const IconComponent = card.icon;
          return (
            <div
              key={card.lessonId}
              data-testid={`featured-topic-card-${card.lessonId}`}
              className="bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer transition-shadow hover:shadow-md flex flex-col"
              onClick={() => onNavigate(`/lessons/${card.lessonId}`)}
            >
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <h3 data-testid={`featured-topic-title-${card.lessonId}`} className="font-bold text-gray-900 mb-1">
                {card.title}
              </h3>
              <p data-testid={`featured-topic-desc-${card.lessonId}`} className="text-sm text-gray-600 mb-4 flex-1">
                {card.description}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    data-testid={`featured-topic-difficulty-${card.lessonId}`}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}
                  >
                    {diff.label}
                  </span>
                  <span data-testid={`featured-topic-time-${card.lessonId}`} className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {card.time}
                  </span>
                </div>
                <button
                  data-testid={`featured-topic-start-${card.lessonId}`}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/lessons/${card.lessonId}`);
                  }}
                >
                  Start Lesson
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}