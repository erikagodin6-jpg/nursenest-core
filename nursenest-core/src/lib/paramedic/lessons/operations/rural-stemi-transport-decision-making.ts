export const RURAL_STEMI_TRANSPORT_DECISION_MAKING = {
  slug: "rural-stemi-transport-decision-making",
  title: "Rural STEMI Transport Decision-Making",
  level: "advanced",
  estimatedMinutes: 45,
  summary:
    "Advanced EMS transport medicine lesson covering PCI bypass decisions, reassessment during prolonged transport, STEMI deterioration risk, rhythm instability, and operational communication.",
  sections: [
    {
      heading: "Why Rural STEMI Care Is Operationally Different",
      body: [
        "Rural EMS crews often manage STEMI patients during prolonged transport times with delayed access to PCI centers.",
        "Operational decisions made early in transport can significantly affect reperfusion timing and patient deterioration risk.",
      ],
    },
    {
      heading: "Dynamic STEMI Risk During Transport",
      body: [
        "STEMI patients may deteriorate during prolonged transport through worsening ischemia, bradycardia, hypotension, dysrhythmias, and shock.",
        "Reassessment must continue throughout transport rather than ending after the first ECG.",
      ],
    },
    {
      heading: "Repeat ECG and Reassessment Culture",
      body: [
        "Repeat ECGs may reveal evolving STEMI changes or rhythm instability not visible initially.",
        "Changes in diaphoresis, perfusion, mental status, pulse quality, chest pain, or blood pressure should trigger reassessment.",
      ],
    },
    {
      heading: "Transport Prioritization",
      body: [
        "Operational decisions may include PCI bypass, helicopter activation, ALS intercept coordination, or destination reconsideration.",
        "Scene-time delays and transport indecision can worsen reperfusion delay and instability.",
      ],
    },
    {
      heading: "Operational Communication",
      body: [
        "High-quality STEMI communication should include ECG findings, instability trends, reassessment changes, perfusion status, and estimated arrival time.",
        "Transport medicine is not passive. Ongoing communication and reassessment change outcomes.",
      ],
    },
  ],
} as const;
