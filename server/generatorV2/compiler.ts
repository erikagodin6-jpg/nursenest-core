import { storage } from "../storage";

const W = 612;
const H = 792;
const M = 46;
const CONTENT_W = W - M * 2;
const HEADER_H = 30;
const FOOTER_H = 25;
const USABLE_TOP = M + HEADER_H;
const USABLE_BOTTOM = H - M - FOOTER_H;

interface CanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  fill?: string;
  fontFamily?: string;
  rotation: number;
  opacity: number;
  zIndex: number;
  textAlign?: string;
  borderRadius?: number;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

interface CompiledPage {
  id: string;
  title: string;
  objects: CanvasObject[];
  backgroundColor: string;
}

export interface CompilerTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  sectionBg: string;
  headingFont: string;
  bodyFont: string;
  headingColor: string;
  bodyColor: string;
  bodyColorLight: string;
  pearlBg: string;
  pearlBorder: string;
  flagBg: string;
  flagBorder: string;
  coverBg: string;
  coverBgOverlay: string;
  tableBorderColor: string;
  tableRowEven: string;
  tableRowOdd: string;
}

export const COMPILER_THEMES: CompilerTheme[] = [
  {
    id: "soft-clinical",
    name: "Soft Clinical",
    primaryColor: "#7c3aed",
    secondaryColor: "#06b6d4",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    sectionBg: "#f8fafc",
    headingFont: "Inter",
    bodyFont: "Inter",
    headingColor: "#1e293b",
    bodyColor: "#334155",
    bodyColorLight: "#64748b",
    pearlBg: "#ede9fe",
    pearlBorder: "#7c3aed",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#7c3aed",
    coverBgOverlay: "#6d28d9",
    tableBorderColor: "#e2e8f0",
    tableRowEven: "#f8fafc",
    tableRowOdd: "#f1f5f9",
  },
  {
    id: "structured-academic",
    name: "Structured Academic",
    primaryColor: "#1e40af",
    secondaryColor: "#0f766e",
    accentColor: "#b45309",
    backgroundColor: "#ffffff",
    sectionBg: "#f0f4f8",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    headingColor: "#0f172a",
    bodyColor: "#1e293b",
    bodyColorLight: "#475569",
    pearlBg: "#dbeafe",
    pearlBorder: "#1e40af",
    flagBg: "#fef2f2",
    flagBorder: "#b91c1c",
    coverBg: "#1e40af",
    coverBgOverlay: "#1e3a8a",
    tableBorderColor: "#cbd5e1",
    tableRowEven: "#f0f4f8",
    tableRowOdd: "#e2e8f0",
  },
  {
    id: "bold-modern",
    name: "Bold Modern",
    primaryColor: "#dc2626",
    secondaryColor: "#7c3aed",
    accentColor: "#eab308",
    backgroundColor: "#fafafa",
    sectionBg: "#f5f5f5",
    headingFont: "Montserrat",
    bodyFont: "Open Sans",
    headingColor: "#171717",
    bodyColor: "#262626",
    bodyColorLight: "#525252",
    pearlBg: "#fef2f2",
    pearlBorder: "#dc2626",
    flagBg: "#fef9c3",
    flagBorder: "#d97706",
    coverBg: "#171717",
    coverBgOverlay: "#dc2626",
    tableBorderColor: "#d4d4d4",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f5f5f5",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    primaryColor: "#0f172a",
    secondaryColor: "#64748b",
    accentColor: "#0ea5e9",
    backgroundColor: "#ffffff",
    sectionBg: "#fafafa",
    headingFont: "Space Grotesk",
    bodyFont: "DM Sans",
    headingColor: "#0f172a",
    bodyColor: "#374151",
    bodyColorLight: "#6b7280",
    pearlBg: "#f0f9ff",
    pearlBorder: "#0ea5e9",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#0f172a",
    coverBgOverlay: "#1e293b",
    tableBorderColor: "#e5e7eb",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f5f5f5",
  },
  {
    id: "navy-medical",
    name: "Navy Medical",
    primaryColor: "#1e3a5f",
    secondaryColor: "#2563eb",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    sectionBg: "#f0f4f8",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#0f172a",
    bodyColor: "#334155",
    bodyColorLight: "#64748b",
    pearlBg: "#e0f2fe",
    pearlBorder: "#1e3a5f",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#1e3a5f",
    coverBgOverlay: "#0f2744",
    tableBorderColor: "#cbd5e1",
    tableRowEven: "#f0f4f8",
    tableRowOdd: "#e8edf2",
  },
  {
    id: "blush-rose",
    name: "Blush Rose",
    primaryColor: "#be185d",
    secondaryColor: "#9333ea",
    accentColor: "#f59e0b",
    backgroundColor: "#fffbfb",
    sectionBg: "#fdf2f8",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#1e293b",
    bodyColor: "#374151",
    bodyColorLight: "#6b7280",
    pearlBg: "#fce7f3",
    pearlBorder: "#be185d",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#be185d",
    coverBgOverlay: "#9d174d",
    tableBorderColor: "#f3e8ff",
    tableRowEven: "#fdf2f8",
    tableRowOdd: "#fce7f3",
  },
  {
    id: "paper-ink",
    name: "Paper & Ink",
    primaryColor: "#292524",
    secondaryColor: "#57534e",
    accentColor: "#a16207",
    backgroundColor: "#faf8f5",
    sectionBg: "#f5f0ea",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    headingColor: "#1c1917",
    bodyColor: "#292524",
    bodyColorLight: "#78716c",
    pearlBg: "#f5f0ea",
    pearlBorder: "#a16207",
    flagBg: "#fef2f2",
    flagBorder: "#b91c1c",
    coverBg: "#292524",
    coverBgOverlay: "#1c1917",
    tableBorderColor: "#d6d3d1",
    tableRowEven: "#faf8f5",
    tableRowOdd: "#f5f0ea",
  },
  {
    id: "charcoal-clinical",
    name: "Charcoal Clinical",
    primaryColor: "#374151",
    secondaryColor: "#3b82f6",
    accentColor: "#14b8a6",
    backgroundColor: "#ffffff",
    sectionBg: "#f9fafb",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#111827",
    bodyColor: "#374151",
    bodyColorLight: "#6b7280",
    pearlBg: "#f3f4f6",
    pearlBorder: "#374151",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#374151",
    coverBgOverlay: "#1f2937",
    tableBorderColor: "#e5e7eb",
    tableRowEven: "#f9fafb",
    tableRowOdd: "#f3f4f6",
  },
  {
    id: "pastel-lavender",
    name: "Pastel Lavender",
    primaryColor: "#a78bfa",
    secondaryColor: "#c4b5fd",
    accentColor: "#ddd6fe",
    backgroundColor: "#faf8ff",
    sectionBg: "#f5f3ff",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#4c1d95",
    bodyColor: "#5b21b6",
    bodyColorLight: "#7c3aed",
    pearlBg: "#ede9fe",
    pearlBorder: "#a78bfa",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#7c3aed",
    coverBgOverlay: "#6d28d9",
    tableBorderColor: "#ddd6fe",
    tableRowEven: "#faf8ff",
    tableRowOdd: "#f5f3ff",
  },
  {
    id: "pastel-mint",
    name: "Pastel Mint",
    primaryColor: "#6ee7b7",
    secondaryColor: "#a7f3d0",
    accentColor: "#d1fae5",
    backgroundColor: "#f0fdf4",
    sectionBg: "#ecfdf5",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#065f46",
    bodyColor: "#047857",
    bodyColorLight: "#10b981",
    pearlBg: "#d1fae5",
    pearlBorder: "#6ee7b7",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#059669",
    coverBgOverlay: "#047857",
    tableBorderColor: "#a7f3d0",
    tableRowEven: "#f0fdf4",
    tableRowOdd: "#ecfdf5",
  },
  {
    id: "pastel-peach",
    name: "Pastel Peach",
    primaryColor: "#fdba74",
    secondaryColor: "#fed7aa",
    accentColor: "#ffedd5",
    backgroundColor: "#fff7ed",
    sectionBg: "#fffbeb",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#9a3412",
    bodyColor: "#c2410c",
    bodyColorLight: "#ea580c",
    pearlBg: "#ffedd5",
    pearlBorder: "#fdba74",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#ea580c",
    coverBgOverlay: "#c2410c",
    tableBorderColor: "#fed7aa",
    tableRowEven: "#fff7ed",
    tableRowOdd: "#fffbeb",
  },
  {
    id: "pastel-sky",
    name: "Pastel Sky",
    primaryColor: "#7dd3fc",
    secondaryColor: "#bae6fd",
    accentColor: "#e0f2fe",
    backgroundColor: "#f0f9ff",
    sectionBg: "#e0f2fe",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#075985",
    bodyColor: "#0369a1",
    bodyColorLight: "#0284c7",
    pearlBg: "#e0f2fe",
    pearlBorder: "#7dd3fc",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#0284c7",
    coverBgOverlay: "#0369a1",
    tableBorderColor: "#bae6fd",
    tableRowEven: "#f0f9ff",
    tableRowOdd: "#e0f2fe",
  },
  {
    id: "pastel-blush",
    name: "Pastel Blush",
    primaryColor: "#fda4af",
    secondaryColor: "#fecdd3",
    accentColor: "#ffe4e6",
    backgroundColor: "#fff1f2",
    sectionBg: "#ffe4e6",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#9f1239",
    bodyColor: "#be123c",
    bodyColorLight: "#e11d48",
    pearlBg: "#ffe4e6",
    pearlBorder: "#fda4af",
    flagBg: "#fef9c3",
    flagBorder: "#d97706",
    coverBg: "#e11d48",
    coverBgOverlay: "#be123c",
    tableBorderColor: "#fecdd3",
    tableRowEven: "#fff1f2",
    tableRowOdd: "#ffe4e6",
  },
  {
    id: "mono-slate",
    name: "Mono Slate",
    primaryColor: "#475569",
    secondaryColor: "#94a3b8",
    accentColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    sectionBg: "#f8fafc",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#1e293b",
    bodyColor: "#334155",
    bodyColorLight: "#64748b",
    pearlBg: "#f1f5f9",
    pearlBorder: "#475569",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#1e293b",
    coverBgOverlay: "#0f172a",
    tableBorderColor: "#cbd5e1",
    tableRowEven: "#f8fafc",
    tableRowOdd: "#f1f5f9",
  },
  {
    id: "mono-graphite",
    name: "Mono Graphite",
    primaryColor: "#404040",
    secondaryColor: "#737373",
    accentColor: "#a3a3a3",
    backgroundColor: "#fafafa",
    sectionBg: "#f5f5f5",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#171717",
    bodyColor: "#262626",
    bodyColorLight: "#525252",
    pearlBg: "#f5f5f5",
    pearlBorder: "#404040",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#171717",
    coverBgOverlay: "#0a0a0a",
    tableBorderColor: "#d4d4d4",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f5f5f5",
  },
  {
    id: "mono-silver",
    name: "Mono Silver",
    primaryColor: "#6b7280",
    secondaryColor: "#9ca3af",
    accentColor: "#d1d5db",
    backgroundColor: "#ffffff",
    sectionBg: "#f9fafb",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#111827",
    bodyColor: "#374151",
    bodyColorLight: "#6b7280",
    pearlBg: "#f3f4f6",
    pearlBorder: "#6b7280",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#374151",
    coverBgOverlay: "#1f2937",
    tableBorderColor: "#d1d5db",
    tableRowEven: "#f9fafb",
    tableRowOdd: "#f3f4f6",
  },
  {
    id: "mono-steel",
    name: "Mono Steel",
    primaryColor: "#52525b",
    secondaryColor: "#a1a1aa",
    accentColor: "#d4d4d8",
    backgroundColor: "#fafafa",
    sectionBg: "#f4f4f5",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingColor: "#18181b",
    bodyColor: "#27272a",
    bodyColorLight: "#52525b",
    pearlBg: "#f4f4f5",
    pearlBorder: "#52525b",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#27272a",
    coverBgOverlay: "#18181b",
    tableBorderColor: "#d4d4d8",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f4f4f5",
  },
  {
    id: "mono-fog",
    name: "Mono Fog",
    primaryColor: "#78716c",
    secondaryColor: "#a8a29e",
    accentColor: "#d6d3d1",
    backgroundColor: "#fafaf9",
    sectionBg: "#f5f5f4",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    headingColor: "#1c1917",
    bodyColor: "#292524",
    bodyColorLight: "#78716c",
    pearlBg: "#f5f5f4",
    pearlBorder: "#78716c",
    flagBg: "#fef2f2",
    flagBorder: "#b91c1c",
    coverBg: "#292524",
    coverBgOverlay: "#1c1917",
    tableBorderColor: "#d6d3d1",
    tableRowEven: "#fafaf9",
    tableRowOdd: "#f5f5f4",
  },
];

let uidCounter = 0;
function uid(): string {
  return `cv2_${Date.now()}_${++uidCounter}`;
}

function getTheme(themeId?: string): CompilerTheme {
  if (!themeId) return COMPILER_THEMES[0];
  return COMPILER_THEMES.find(t => t.id === themeId) || COMPILER_THEMES[0];
}

function makeHeader(pageNum: number, sectionTitle: string, theme: CompilerTheme, z: number): CanvasObject[] {
  return [
    { id: uid(), type: "rect", x: 0, y: 0, width: W, height: 4, fill: theme.primaryColor, rotation: 0, opacity: 0.85, zIndex: z++ },
    { id: uid(), type: "rect", x: 0, y: 4, width: W, height: 2, fill: theme.secondaryColor, rotation: 0, opacity: 0.5, zIndex: z++ },
    { id: uid(), type: "text", x: M, y: 12, width: 100, height: 14, content: "NurseNest", fontSize: 9, fontWeight: "700", fill: theme.primaryColor, fontFamily: theme.headingFont, rotation: 0, opacity: 0.7, zIndex: z++ },
    { id: uid(), type: "text", x: M + 105, y: 12, width: CONTENT_W - 155, height: 14, content: sectionTitle, fontSize: 7, fontWeight: "500", fill: theme.bodyColorLight, fontFamily: theme.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++ },
    { id: uid(), type: "text", x: M + CONTENT_W - 40, y: 12, width: 40, height: 14, content: `${pageNum}`, fontSize: 8, fontWeight: "600", fill: theme.bodyColorLight, fontFamily: theme.bodyFont, rotation: 0, opacity: 0.35, zIndex: z++, textAlign: "right" },
  ];
}

function makeFooter(theme: CompilerTheme, z: number): CanvasObject[] {
  return [
    { id: uid(), type: "rect", x: 0, y: H - 2, width: W, height: 2, fill: theme.primaryColor, rotation: 0, opacity: 0.3, zIndex: z++ },
    { id: uid(), type: "text", x: M, y: H - 18, width: CONTENT_W * 0.5, height: 12, content: "NurseNest Exam Prep", fontSize: 7, fontWeight: "500", fill: theme.bodyColorLight, fontFamily: theme.bodyFont, rotation: 0, opacity: 0.3, zIndex: z++ },
    { id: uid(), type: "text", x: M + CONTENT_W * 0.5, y: H - 18, width: CONTENT_W * 0.5, height: 12, content: "nursenest.ca", fontSize: 7, fontWeight: "400", fill: theme.bodyColorLight, fontFamily: theme.bodyFont, rotation: 0, opacity: 0.25, zIndex: z++, textAlign: "right" },
  ];
}

function estimateTextHeight(text: string, fontSize: number, width: number): number {
  const avgCharWidth = fontSize * 0.5;
  const charsPerLine = Math.floor(width / avgCharWidth);
  const lines = Math.ceil(text.length / Math.max(charsPerLine, 1));
  return lines * (fontSize * 1.4) + 4;
}

function makeCoverPage(
  title: string,
  subtitle: string,
  questionCount: number,
  examTarget: string,
  tier: string,
  topics: string,
  theme: CompilerTheme,
): CompiledPage {
  const objs: CanvasObject[] = [];
  let z = 0;

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: theme.coverBg, rotation: 0, opacity: 1, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: theme.coverBgOverlay, rotation: 0, opacity: 0.15, zIndex: z++ });

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 8, fill: theme.accentColor, rotation: 0, opacity: 0.9, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: 0, y: H - 8, width: W, height: 8, fill: theme.accentColor, rotation: 0, opacity: 0.9, zIndex: z++ });

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: 6, height: H, fill: theme.accentColor, rotation: 0, opacity: 0.6, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: W - 6, y: 0, width: 6, height: H, fill: theme.accentColor, rotation: 0, opacity: 0.6, zIndex: z++ });

  objs.push({
    id: uid(), type: "text", x: M + 10, y: 50, width: CONTENT_W - 20, height: 24,
    content: "NurseNest", fontSize: 18, fontWeight: "800", fill: "#ffffff",
    fontFamily: theme.headingFont, rotation: 0, opacity: 0.95, zIndex: z++,
  });
  objs.push({
    id: uid(), type: "text", x: M + 10, y: 78, width: CONTENT_W - 20, height: 14,
    content: "Exam Prep", fontSize: 11, fontWeight: "400", fill: "#ffffff",
    fontFamily: theme.bodyFont, rotation: 0, opacity: 0.65, zIndex: z++,
  });

  objs.push({ id: uid(), type: "rect", x: M + 10, y: 108, width: 60, height: 2, fill: theme.accentColor, rotation: 0, opacity: 0.8, zIndex: z++ });

  const titleBlockY = H * 0.28;
  const titleBlockH = 160;
  objs.push({ id: uid(), type: "rect", x: M, y: titleBlockY, width: CONTENT_W, height: titleBlockH, fill: "#ffffff", borderRadius: 12, rotation: 0, opacity: 0.12, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: M, y: titleBlockY, width: 5, height: titleBlockH, fill: theme.accentColor, borderRadius: 3, rotation: 0, opacity: 0.9, zIndex: z++ });

  objs.push({
    id: uid(), type: "text", x: M + 24, y: titleBlockY + 20, width: CONTENT_W - 48, height: 50,
    content: title, fontSize: 26, fontWeight: "bold", fill: "#ffffff",
    fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++,
  });
  objs.push({
    id: uid(), type: "text", x: M + 24, y: titleBlockY + 78, width: CONTENT_W - 48, height: 25,
    content: subtitle, fontSize: 13, fontWeight: "400", fill: "#ffffff",
    fontFamily: theme.bodyFont, rotation: 0, opacity: 0.75, zIndex: z++,
  });

  const badgeY = titleBlockY + 115;
  const badgeW = 120;
  objs.push({ id: uid(), type: "rect", x: M + 24, y: badgeY, width: badgeW, height: 28, fill: theme.accentColor, borderRadius: 14, rotation: 0, opacity: 0.95, zIndex: z++ });
  objs.push({
    id: uid(), type: "text", x: M + 24, y: badgeY + 6, width: badgeW, height: 16,
    content: `${questionCount} Questions`, fontSize: 11, fontWeight: "700", fill: "#ffffff",
    fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center",
  });

  if (examTarget) {
    objs.push({ id: uid(), type: "rect", x: M + 24 + badgeW + 10, y: badgeY, width: 80, height: 28, fill: "#ffffff", borderRadius: 14, rotation: 0, opacity: 0.2, zIndex: z++ });
    objs.push({
      id: uid(), type: "text", x: M + 24 + badgeW + 10, y: badgeY + 6, width: 80, height: 16,
      content: examTarget.toUpperCase(), fontSize: 10, fontWeight: "600", fill: "#ffffff",
      fontFamily: theme.headingFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "center",
    });
  }

  const metaY = H * 0.68;
  objs.push({ id: uid(), type: "rect", x: M + 10, y: metaY, width: CONTENT_W - 20, height: 1, fill: "#ffffff", rotation: 0, opacity: 0.15, zIndex: z++ });

  if (topics) {
    objs.push({
      id: uid(), type: "text", x: M + 10, y: metaY + 14, width: 80, height: 14,
      content: "Topics:", fontSize: 9, fontWeight: "600", fill: "#ffffff",
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.6, zIndex: z++,
    });
    objs.push({
      id: uid(), type: "text", x: M + 90, y: metaY + 14, width: CONTENT_W - 100, height: 14,
      content: topics, fontSize: 9, fontWeight: "400", fill: "#ffffff",
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++,
    });
  }

  if (tier && tier !== "all") {
    objs.push({
      id: uid(), type: "text", x: M + 10, y: metaY + 32, width: 80, height: 14,
      content: "Tier:", fontSize: 9, fontWeight: "600", fill: "#ffffff",
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.6, zIndex: z++,
    });
    objs.push({
      id: uid(), type: "text", x: M + 90, y: metaY + 32, width: CONTENT_W - 100, height: 14,
      content: tier.toUpperCase(), fontSize: 9, fontWeight: "400", fill: "#ffffff",
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++,
    });
  }

  objs.push({
    id: uid(), type: "text", x: M, y: H - 50, width: CONTENT_W, height: 14,
    content: "nursenest.ca", fontSize: 10, fontWeight: "500", fill: "#ffffff",
    fontFamily: theme.bodyFont, rotation: 0, opacity: 0.4, zIndex: z++, textAlign: "center",
  });

  return { id: uid(), title: "Cover", objects: objs, backgroundColor: theme.coverBg };
}

function makeTocPage(sections: { title: string; pageNum: number }[], theme: CompilerTheme): CompiledPage {
  const objs: CanvasObject[] = [];
  let z = 0;

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: theme.backgroundColor, rotation: 0, opacity: 1, zIndex: z++ });
  objs.push(...makeHeader(2, "Table of Contents", theme, z));
  z += 6;

  objs.push({
    id: uid(), type: "text", x: M, y: USABLE_TOP + 10, width: CONTENT_W, height: 30,
    content: "Table of Contents", fontSize: 20, fontWeight: "bold", fill: theme.headingColor,
    fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++,
  });

  objs.push({ id: uid(), type: "rect", x: M, y: USABLE_TOP + 46, width: 50, height: 3, fill: theme.primaryColor, rotation: 0, opacity: 0.8, zIndex: z++ });

  let tocY = USABLE_TOP + 65;

  for (const section of sections) {
    objs.push({
      id: uid(), type: "text", x: M + 8, y: tocY, width: CONTENT_W - 50, height: 16,
      content: section.title, fontSize: 10, fontWeight: "500", fill: theme.bodyColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++,
    });

    objs.push({ id: uid(), type: "rect", x: M + 8, y: tocY + 14, width: CONTENT_W - 60, height: 1, fill: theme.bodyColorLight, rotation: 0, opacity: 0.15, zIndex: z++ });

    objs.push({
      id: uid(), type: "text", x: M + CONTENT_W - 35, y: tocY, width: 35, height: 16,
      content: `${section.pageNum}`, fontSize: 10, fontWeight: "600", fill: theme.primaryColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.7, zIndex: z++, textAlign: "right",
    });

    tocY += 28;
  }

  objs.push(...makeFooter(theme, 900));

  return { id: uid(), title: "Table of Contents", objects: objs, backgroundColor: theme.backgroundColor };
}

function makeSectionDivider(title: string, pageNum: number, theme: CompilerTheme): CompiledPage {
  const objs: CanvasObject[] = [];
  let z = 0;

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: theme.sectionBg, rotation: 0, opacity: 1, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 6, fill: theme.primaryColor, rotation: 0, opacity: 0.8, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: 0, y: 6, width: W, height: 2, fill: theme.accentColor, rotation: 0, opacity: 0.6, zIndex: z++ });

  const centerY = H * 0.38;
  objs.push({ id: uid(), type: "rect", x: M + 40, y: centerY - 10, width: CONTENT_W - 80, height: 80, fill: theme.backgroundColor, borderRadius: 10, rotation: 0, opacity: 0.7, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: M + 40, y: centerY - 10, width: 4, height: 80, fill: theme.primaryColor, borderRadius: 2, rotation: 0, opacity: 0.9, zIndex: z++ });

  objs.push({
    id: uid(), type: "text", x: M + 60, y: centerY + 8, width: CONTENT_W - 120, height: 36,
    content: title, fontSize: 22, fontWeight: "bold", fill: theme.headingColor,
    fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center",
  });

  objs.push({
    id: uid(), type: "text", x: M, y: H - 50, width: CONTENT_W, height: 14,
    content: "NurseNest Exam Prep", fontSize: 9, fontWeight: "500", fill: theme.bodyColorLight,
    fontFamily: theme.bodyFont, rotation: 0, opacity: 0.4, zIndex: z++, textAlign: "center",
  });

  return { id: uid(), title: title, objects: objs, backgroundColor: theme.sectionBg };
}

function renderContentBlocksToPages(
  blocks: any[],
  sectionTitle: string,
  startPageNum: number,
  theme: CompilerTheme,
): CompiledPage[] {
  const pages: CompiledPage[] = [];
  let currentObjects: CanvasObject[] = [];
  let curY = USABLE_TOP;
  let z = 10;
  let pageNum = startPageNum;

  function flushPage() {
    const objs = [
      { id: uid(), type: "rect" as const, x: 0, y: 0, width: W, height: H, fill: theme.backgroundColor, rotation: 0, opacity: 1, zIndex: 0 },
      ...makeHeader(pageNum, sectionTitle, theme, 1),
      ...currentObjects,
      ...makeFooter(theme, 900),
    ];
    pages.push({ id: uid(), title: `${sectionTitle} p${pageNum}`, objects: objs, backgroundColor: theme.backgroundColor });
    currentObjects = [];
    curY = USABLE_TOP;
    z = 10;
    pageNum++;
  }

  function ensureSpace(needed: number) {
    if (curY + needed > USABLE_BOTTOM) flushPage();
  }

  for (const block of blocks) {
    const bType = block.type || "paragraph";
    const content = block.content || "";

    if (bType === "heading") {
      const h = 22;
      ensureSpace(h + 8);
      currentObjects.push({
        id: uid(), type: "text", x: M, y: curY, width: CONTENT_W, height: h,
        content, fontSize: 14, fontWeight: "bold", fill: theme.headingColor,
        fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++,
      });
      curY += h + 6;
    } else if (bType === "paragraph") {
      const h = estimateTextHeight(content, 9, CONTENT_W);
      ensureSpace(Math.min(h, 40));
      currentObjects.push({
        id: uid(), type: "text", x: M, y: curY, width: CONTENT_W, height: h,
        content, fontSize: 9, fontWeight: "400", fill: theme.bodyColor,
        fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++,
      });
      curY += h + 4;
    } else if (bType === "bullets" && Array.isArray(block.items)) {
      for (const item of block.items) {
        const bulletText = `  - ${item}`;
        const h = estimateTextHeight(bulletText, 9, CONTENT_W - 15);
        ensureSpace(Math.min(h, 20));
        currentObjects.push({
          id: uid(), type: "text", x: M + 10, y: curY, width: CONTENT_W - 15, height: h,
          content: bulletText, fontSize: 9, fontWeight: "400", fill: theme.bodyColor,
          fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++,
        });
        curY += h + 2;
      }
      curY += 4;
    } else if (bType === "callout" || bType === "pearl") {
      const h = estimateTextHeight(content, 9, CONTENT_W - 30) + 12;
      ensureSpace(h + 8);
      const isPearl = bType === "pearl" || block.variant === "info";
      const bgColor = isPearl ? theme.pearlBg : theme.flagBg;
      const borderColor = isPearl ? theme.pearlBorder : theme.flagBorder;
      currentObjects.push({
        id: uid(), type: "rect", x: M, y: curY, width: CONTENT_W, height: h,
        fill: bgColor, borderRadius: 6, rotation: 0, opacity: 1, zIndex: z++,
      });
      currentObjects.push({
        id: uid(), type: "rect", x: M, y: curY, width: 3, height: h,
        fill: borderColor, borderRadius: 2, rotation: 0, opacity: 0.9, zIndex: z++,
      });
      currentObjects.push({
        id: uid(), type: "text", x: M + 12, y: curY + 6, width: CONTENT_W - 24, height: h - 12,
        content, fontSize: 9, fontWeight: "500", fill: theme.bodyColor,
        fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++,
      });
      curY += h + 6;
    } else if (bType === "table" && Array.isArray(block.headers) && Array.isArray(block.rows)) {
      const colCount = block.headers.length;
      const colW = CONTENT_W / colCount;
      const rowH = 18;
      const totalH = (1 + block.rows.length) * rowH + 4;
      ensureSpace(Math.min(totalH, 60));
      currentObjects.push({
        id: uid(), type: "rect", x: M, y: curY, width: CONTENT_W, height: rowH,
        fill: theme.primaryColor, borderRadius: 0, rotation: 0, opacity: 0.1, zIndex: z++,
      });
      for (let c = 0; c < colCount; c++) {
        currentObjects.push({
          id: uid(), type: "text", x: M + c * colW + 4, y: curY + 2, width: colW - 8, height: rowH - 4,
          content: block.headers[c], fontSize: 8, fontWeight: "bold", fill: theme.headingColor,
          fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++,
        });
      }
      curY += rowH;
      for (let ri = 0; ri < block.rows.length; ri++) {
        const row = block.rows[ri];
        ensureSpace(rowH);
        const rowBg = ri % 2 === 0 ? theme.tableRowEven : theme.tableRowOdd;
        currentObjects.push({
          id: uid(), type: "rect", x: M, y: curY, width: CONTENT_W, height: rowH,
          fill: rowBg, rotation: 0, opacity: 1, zIndex: z++,
        });
        for (let c = 0; c < Math.min(row.length, colCount); c++) {
          currentObjects.push({
            id: uid(), type: "text", x: M + c * colW + 4, y: curY + 2, width: colW - 8, height: rowH - 4,
            content: row[c] || "", fontSize: 8, fontWeight: "400", fill: theme.bodyColor,
            fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++,
          });
        }
        curY += rowH;
      }
      curY += 6;
    }
  }

  if (currentObjects.length > 0) flushPage();
  return pages;
}

function renderQuestionsToPages(
  questions: any[],
  startPageNum: number,
  theme: CompilerTheme,
): { questionPages: CompiledPage[]; rationalePages: CompiledPage[] } {
  const questionPages: CompiledPage[] = [];
  const rationalePages: CompiledPage[] = [];
  let qObjs: CanvasObject[] = [];
  let rObjs: CanvasObject[] = [];
  let qY = USABLE_TOP;
  let rY = USABLE_TOP;
  let qZ = 10;
  let rZ = 10;
  let qPageNum = startPageNum;
  let rPageNum = 1;

  function flushQPage() {
    const objs = [
      { id: uid(), type: "rect" as const, x: 0, y: 0, width: W, height: H, fill: theme.backgroundColor, rotation: 0, opacity: 1, zIndex: 0 },
      ...makeHeader(qPageNum, "Practice Questions", theme, 1),
      ...qObjs,
      ...makeFooter(theme, 900),
    ];
    questionPages.push({ id: uid(), title: `Questions p${qPageNum}`, objects: objs, backgroundColor: theme.backgroundColor });
    qObjs = [];
    qY = USABLE_TOP;
    qZ = 10;
    qPageNum++;
  }

  function flushRPage() {
    const objs = [
      { id: uid(), type: "rect" as const, x: 0, y: 0, width: W, height: H, fill: theme.backgroundColor, rotation: 0, opacity: 1, zIndex: 0 },
      ...makeHeader(rPageNum, "Answer Key & Rationales", theme, 1),
      ...rObjs,
      ...makeFooter(theme, 900),
    ];
    rationalePages.push({ id: uid(), title: `Rationales p${rPageNum}`, objects: objs, backgroundColor: theme.backgroundColor });
    rObjs = [];
    rY = USABLE_TOP;
    rZ = 10;
    rPageNum++;
  }

  for (const q of questions) {
    const stemHeight = estimateTextHeight(q.stem || "", 9, CONTENT_W - 20);
    const choicesHeight = (Array.isArray(q.choices) ? q.choices.length : 4) * 14;
    const totalQHeight = 16 + stemHeight + choicesHeight + 8;

    if (qY + Math.min(totalQHeight, 50) > USABLE_BOTTOM) flushQPage();

    qObjs.push({
      id: uid(), type: "rect", x: M - 2, y: qY - 2, width: CONTENT_W + 4, height: 1, fill: theme.bodyColorLight, rotation: 0, opacity: 0.1, zIndex: qZ++,
    });

    qObjs.push({
      id: uid(), type: "text", x: M, y: qY, width: 25, height: 14,
      content: `Q${q.idx}.`, fontSize: 9, fontWeight: "bold", fill: theme.primaryColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: qZ++,
    });
    qObjs.push({
      id: uid(), type: "text", x: M + 28, y: qY + 1, width: 40, height: 10,
      content: `[${q.type}]`, fontSize: 6, fontWeight: "500", fill: theme.secondaryColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.6, zIndex: qZ++,
    });
    qObjs.push({
      id: uid(), type: "text", x: M + 70, y: qY + 1, width: 60, height: 10,
      content: q.difficulty || "", fontSize: 6, fontWeight: "400", fill: theme.bodyColorLight,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 0.5, zIndex: qZ++,
    });
    qY += 14;

    qObjs.push({
      id: uid(), type: "text", x: M + 10, y: qY, width: CONTENT_W - 15, height: stemHeight,
      content: q.stem || "", fontSize: 9, fontWeight: "400", fill: theme.bodyColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: qZ++,
    });
    qY += stemHeight + 4;

    const choices = Array.isArray(q.choices) ? q.choices : [];
    for (const choice of choices) {
      const label = typeof choice === "object" ? choice.label : "";
      const text = typeof choice === "object" ? choice.text : String(choice);
      if (qY + 14 > USABLE_BOTTOM) flushQPage();
      qObjs.push({
        id: uid(), type: "text", x: M + 18, y: qY, width: 14, height: 12,
        content: `${label})`, fontSize: 8, fontWeight: "600", fill: theme.primaryColor,
        fontFamily: theme.bodyFont, rotation: 0, opacity: 0.7, zIndex: qZ++,
      });
      qObjs.push({
        id: uid(), type: "text", x: M + 34, y: qY, width: CONTENT_W - 42, height: 12,
        content: text, fontSize: 8, fontWeight: "400", fill: theme.bodyColor,
        fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: qZ++,
      });
      qY += 13;
    }
    qY += 10;

    const correctAnswers = Array.isArray(q.correctAnswers) ? q.correctAnswers.join(", ") : "";
    const rationale = typeof q.rationale === "object" ? q.rationale : {};
    const rationaleText = rationale.correctReasoning || "";
    const pearl = q.examPearl || "";
    const rHeight = 20 + estimateTextHeight(rationaleText, 8, CONTENT_W - 25) + (pearl ? 30 : 0) + 10;

    if (rY + Math.min(rHeight, 40) > USABLE_BOTTOM) flushRPage();

    rObjs.push({
      id: uid(), type: "rect", x: M - 2, y: rY - 2, width: CONTENT_W + 4, height: 1, fill: theme.bodyColorLight, rotation: 0, opacity: 0.1, zIndex: rZ++,
    });

    rObjs.push({
      id: uid(), type: "text", x: M, y: rY, width: CONTENT_W, height: 14,
      content: `Q${q.idx}. Correct: ${correctAnswers}`, fontSize: 9, fontWeight: "bold", fill: theme.primaryColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: rZ++,
    });
    rY += 16;

    const rTextH = estimateTextHeight(rationaleText, 8, CONTENT_W - 15);
    rObjs.push({
      id: uid(), type: "text", x: M + 8, y: rY, width: CONTENT_W - 15, height: rTextH,
      content: rationaleText, fontSize: 8, fontWeight: "400", fill: theme.bodyColor,
      fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: rZ++,
    });
    rY += rTextH + 4;

    if (pearl) {
      rObjs.push({
        id: uid(), type: "rect", x: M + 6, y: rY, width: CONTENT_W - 12, height: estimateTextHeight(pearl, 7, CONTENT_W - 30) + 8, fill: theme.pearlBg, borderRadius: 4, rotation: 0, opacity: 1, zIndex: rZ++,
      });
      rObjs.push({
        id: uid(), type: "rect", x: M + 6, y: rY, width: 3, height: estimateTextHeight(pearl, 7, CONTENT_W - 30) + 8, fill: theme.pearlBorder, borderRadius: 2, rotation: 0, opacity: 0.8, zIndex: rZ++,
      });
      rObjs.push({
        id: uid(), type: "text", x: M + 16, y: rY + 4, width: CONTENT_W - 30, height: 14,
        content: `Exam Pearl: ${pearl}`, fontSize: 7, fontWeight: "500", fill: theme.bodyColor,
        fontFamily: theme.bodyFont, rotation: 0, opacity: 0.9, zIndex: rZ++,
      });
      rY += estimateTextHeight(pearl, 7, CONTENT_W - 30) + 14;
    }
    rY += 8;
  }

  if (qObjs.length > 0) flushQPage();
  if (rObjs.length > 0) flushRPage();

  return { questionPages, rationalePages };
}

export async function compileGeneration(generationId: string, themeId?: string): Promise<CompiledPage[]> {
  const gen = await storage.getProductGeneration(generationId);
  if (!gen) throw new Error("Generation not found");

  const theme = getTheme(themeId);
  const topic = gen.topic || "Nursing Exam Prep";
  const template = gen.template || "question_pack";
  const allPages: CompiledPage[] = [];
  const tocSections: { title: string; pageNum: number }[] = [];

  const settings = (gen.settings as any) || {};
  const tier = settings.tier || "all";
  const topics = settings.topics || topic;

  const cover = makeCoverPage(
    topic,
    `${gen.examTarget?.toUpperCase() || "REx-PN"} Practice - ${gen.createdCount} Questions`,
    gen.createdCount,
    gen.examTarget || "",
    tier,
    topics,
    theme,
  );
  allPages.push(cover);

  allPages.push({ id: uid(), title: "TOC_PLACEHOLDER", objects: [], backgroundColor: theme.backgroundColor });

  let currentPage = 3;

  if (template === "cram_guide" || template === "hybrid") {
    const contentBlocks = await storage.getContentBlocks(generationId);
    for (const block of contentBlocks) {
      const sectionTitle = block.sectionKey.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      tocSections.push({ title: sectionTitle, pageNum: currentPage });
      const sectionPages = renderContentBlocksToPages(
        Array.isArray(block.blocks) ? block.blocks : [],
        sectionTitle,
        currentPage,
        theme,
      );
      allPages.push(...sectionPages);
      currentPage += sectionPages.length;
    }
  }

  if (template === "question_pack" || template === "hybrid" || template === "premium_exam_pack") {
    const questions = await storage.getGeneratedQuestions(generationId);

    tocSections.push({ title: "Practice Questions", pageNum: currentPage });
    const divider = makeSectionDivider("Practice Questions", currentPage, theme);
    allPages.push(divider);
    currentPage++;

    const { questionPages, rationalePages } = renderQuestionsToPages(questions, currentPage, theme);
    allPages.push(...questionPages);
    currentPage += questionPages.length;

    tocSections.push({ title: "Answer Key & Rationales", pageNum: currentPage });
    const rDivider = makeSectionDivider("Answer Key & Rationales", currentPage, theme);
    allPages.push(rDivider);
    currentPage++;

    allPages.push(...rationalePages);
  }

  const tocPage = makeTocPage(tocSections, theme);
  allPages[1] = tocPage;

  await storage.createGenerationEvent({
    generationId,
    eventType: "compiled",
    payload: { totalPages: allPages.length, template, themeId: theme.id },
  });

  return allPages;
}
