export const nursenestTheme = {
  primary: "#CDB4DB",
  secondary: "#FFC8DD",
  accent: "#BDE0FE",

  background: "#FAF7FD",
  cardBackground: "#FFFFFF",

  textPrimary: "#2B2B2B",
  textSecondary: "#6B6B6B",

  inputBorder: "#E6DFF2",
  inputBorderFocus: "#CDB4DB",

  divider: "#E6DFF2",

  buttonShadow: "0 4px 14px rgba(205,180,219,0.25)",
  cardShadow: "0 8px 30px rgba(0,0,0,0.08)",

  tabActiveBackground: "#CDB4DB",
  tabActiveText: "#FFFFFF",
  tabInactiveBackground: "transparent",
  tabContainerBackground: "rgba(205,180,219,0.08)",

  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",

  radius: {
    card: "16px",
    input: "12px",
    button: "12px",
    tab: "10px",
  },

  sizing: {
    inputHeight: "44px",
    buttonHeight: "44px",
    tabHeight: "44px",
    cardMaxWidth: "420px",
    logoWidth: 180,
  },
} as const;

export type NurseNestTheme = typeof nursenestTheme;
