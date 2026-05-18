export const RESPIRATORY_FAILURE_OPERATIONAL_MASTERY = {
  slug: "respiratory-failure-operational-mastery",
  title: "Respiratory Failure Operational Mastery for EMS",
  profession: "paramedic",
  level: "advanced",
  estimatedMinutes: 45,
  summary:
    "Advanced EMS lesson covering oxygenation failure, ventilation failure, reassessment culture, fatigue recognition, capnography interpretation, transport implications, and operational deterioration patterns.",
  objectives: [
    "Differentiate respiratory distress from respiratory failure",
    "Recognize fatigue and impending ventilatory collapse",
    "Interpret capnography trends operationally",
    "Identify dangerous deterioration patterns",
    "Apply reassessment-based airway management thinking",
    "Integrate transport urgency into respiratory management",
  ],
  sections: [
    {
      heading: "Why EMS Misses Respiratory Failure",
      body: [
        "Many prehospital airway failures occur because crews recognize severe respiratory distress but fail to recognize the transition into respiratory fatigue and ventilatory collapse.",
        "The patient who becomes quieter, slower, or more drowsy is not necessarily improving. In advanced respiratory failure, reduced air movement and decreasing respiratory effort can represent exhaustion and inadequate ventilation.",
        "Operationally, EMS clinicians must think in trends rather than isolated findings. Respiratory failure is usually progressive.",
      ],
    },
    {
      heading: "Oxygenation Versus Ventilation",
      body: [
        "Oxygenation refers to movement of oxygen into the bloodstream. Ventilation refers to movement of carbon dioxide out of the body.",
        "A patient may oxygenate poorly, ventilate poorly, or both simultaneously.",
        "SpO₂ can appear deceptively reassuring in some patients despite worsening ventilation and rising carbon dioxide levels.",
      ],
    },
    {
      heading: "Dangerous Respiratory Failure Patterns",
      body: [
        "Dangerous respiratory trajectories often include worsening fatigue, reduced chest rise, declining mental status, silent chest, cyanosis, and rising EtCO₂.",
        "Patients with severe asthma who suddenly stop wheezing may actually be moving less air, not improving.",
        "Patients with COPD may progressively retain carbon dioxide and become increasingly somnolent as ventilation worsens.",
      ],
    },
    {
      heading: "Capnography and Operational Reassessment",
      body: [
        "Capnography should be interpreted as a dynamic reassessment tool rather than a single number.",
        "Rising EtCO₂ with worsening fatigue and shallow respirations suggests worsening ventilatory failure.",
        "Abrupt waveform changes during resuscitation may suggest changes in perfusion or return of spontaneous circulation.",
      ],
    },
    {
      heading: "Transport Implications",
      body: [
        "Respiratory failure is time-sensitive. Delayed transport can worsen hypoxia, hypercapnia, and peri-arrest physiology.",
        "Operationally, EMS must continually reassess whether the current destination, intercept plan, or airway strategy remains appropriate.",
        "Long rural transport times significantly increase deterioration risk in unstable respiratory patients.",
      ],
    },
    {
      heading: "Common Operational Failures",
      body: [
        "Mistaking fatigue for improvement",
        "Failing to reassess after interventions",
        "Overreliance on pulse oximetry alone",
        "Delayed BVM support",
        "Ignoring declining LOC",
        "Failure to recognize silent chest",
      ],
    },
    {
      heading: "Clinical Integration Scenario",
      body: [
        "A severe asthma patient initially presents tachypneic with loud wheezing. Twenty minutes later, the patient is quieter, increasingly drowsy, and has reduced chest rise. EtCO₂ rises progressively despite oxygen therapy.",
        "Operationally, this represents worsening ventilatory failure and possible impending arrest rather than improvement.",
      ],
    },
  ],
  keyTakeaways: [
    "Respiratory failure is dynamic and progressive",
    "Fatigue can signal deterioration rather than improvement",
    "EtCO₂ trends matter operationally",
    "Reassessment changes interpretation",
    "Transport urgency increases as ventilation worsens",
  ],
} as const;
