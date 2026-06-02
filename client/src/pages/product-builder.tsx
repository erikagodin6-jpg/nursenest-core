import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Plus, Trash2, Save, FileText, Image, Type, Square, Circle,
  Layers, Download, Copy, ShoppingCart, Loader2, Grid3X3, Sparkles,
  AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter,
  Wand2, Shield, AlertTriangle, CheckCircle, LayoutTemplate, Palette,
  Crown, BookOpen, Zap, Target, Brain, ChevronDown, ChevronRight as ChevronR,
  ImagePlus, Star, Award, ClipboardCheck, Lock, Unlock, SwatchBook,
  ZoomIn, ZoomOut, Maximize, Minimize, Move, Group, Ungroup,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Paintbrush
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "@/lib/admin-fetch";
import JSZip from "jszip";

import { useI18n } from "@/lib/i18n";
interface DesignProject {
  id: string;
  title: string;
  slug: string;
  type: string;
  pageSize: string;
  orientation: string;
  createdAt: string;
  updatedAt: string;
  pages?: DesignPage[];
  assets?: DesignAsset[];
}

interface DesignPage {
  id: string;
  projectId: string;
  pageNumber: number;
  canvasJson: any;
  backgroundColor: string;
}

interface DesignAsset {
  id: string;
  projectId: string;
  assetType: string;
  url: string;
  width?: number;
  height?: number;
}

interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  sectionBg: string;
  sectionBgAlt: string;
  headingFont: string;
  bodyFont: string;
  headingColor: string;
  bodyColor: string;
  bodyColorLight: string;
  dangerColor: string;
  successColor: string;
  warningColor: string;
  dividerColor: string;
  badgeBg: string;
  badgeText: string;
  tableBorderColor: string;
  tableRowEven: string;
  tableRowOdd: string;
  pearlBg: string;
  pearlBorder: string;
  flagBg: string;
  flagBorder: string;
  coverBg: string;
  coverBgOverlay: string;
}

const THEMES: ThemeConfig[] = [
  {
    id: "soft-clinical",
    name: "Soft Clinical",
    primaryColor: "#7c3aed",
    secondaryColor: "#06b6d4",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    sectionBg: "#f8fafc",
    sectionBgAlt: "#f1f5f9",
    headingFont: "Inter",
    bodyFont: "Inter",
    headingColor: "#1e293b",
    bodyColor: "#334155",
    bodyColorLight: "#64748b",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#ca8a04",
    dividerColor: "#e2e8f0",
    badgeBg: "#7c3aed",
    badgeText: "#ffffff",
    tableBorderColor: "#e2e8f0",
    tableRowEven: "#f8fafc",
    tableRowOdd: "#f1f5f9",
    pearlBg: "#ede9fe",
    pearlBorder: "#7c3aed",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#7c3aed",
    coverBgOverlay: "#6d28d9",
  },
  {
    id: "structured-academic",
    name: "Structured Academic",
    primaryColor: "#1e40af",
    secondaryColor: "#0f766e",
    accentColor: "#b45309",
    backgroundColor: "#ffffff",
    sectionBg: "#f0f4f8",
    sectionBgAlt: "#e8edf2",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    headingColor: "#0f172a",
    bodyColor: "#1e293b",
    bodyColorLight: "#475569",
    dangerColor: "#b91c1c",
    successColor: "#047857",
    warningColor: "#92400e",
    dividerColor: "#cbd5e1",
    badgeBg: "#1e40af",
    badgeText: "#ffffff",
    tableBorderColor: "#cbd5e1",
    tableRowEven: "#f0f4f8",
    tableRowOdd: "#e2e8f0",
    pearlBg: "#dbeafe",
    pearlBorder: "#1e40af",
    flagBg: "#fef2f2",
    flagBorder: "#b91c1c",
    coverBg: "#1e40af",
    coverBgOverlay: "#1e3a8a",
  },
  {
    id: "bold-modern",
    name: "Bold Modern",
    primaryColor: "#dc2626",
    secondaryColor: "#7c3aed",
    accentColor: "#eab308",
    backgroundColor: "#fafafa",
    sectionBg: "#f5f5f5",
    sectionBgAlt: "#e5e5e5",
    headingFont: "Montserrat",
    bodyFont: "Open Sans",
    headingColor: "#171717",
    bodyColor: "#262626",
    bodyColorLight: "#525252",
    dangerColor: "#dc2626",
    successColor: "#16a34a",
    warningColor: "#d97706",
    dividerColor: "#d4d4d4",
    badgeBg: "#dc2626",
    badgeText: "#ffffff",
    tableBorderColor: "#d4d4d4",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f5f5f5",
    pearlBg: "#fef2f2",
    pearlBorder: "#dc2626",
    flagBg: "#fef9c3",
    flagBorder: "#d97706",
    coverBg: "#171717",
    coverBgOverlay: "#dc2626",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    primaryColor: "#0f172a",
    secondaryColor: "#64748b",
    accentColor: "#0ea5e9",
    backgroundColor: "#ffffff",
    sectionBg: "#fafafa",
    sectionBgAlt: "#f5f5f5",
    headingFont: "Space Grotesk",
    bodyFont: "DM Sans",
    headingColor: "#0f172a",
    bodyColor: "#374151",
    bodyColorLight: "#6b7280",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#e5e7eb",
    badgeBg: "#0f172a",
    badgeText: "#ffffff",
    tableBorderColor: "#e5e7eb",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f5f5f5",
    pearlBg: "#f0f9ff",
    pearlBorder: "#0ea5e9",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#0f172a",
    coverBgOverlay: "#1e293b",
  },
  {
    id: "blush-rose",
    name: "Blush Rose",
    primaryColor: "#be185d",
    secondaryColor: "#e879a0",
    accentColor: "#f9a8d4",
    backgroundColor: "#fffbfc",
    sectionBg: "#fdf2f8",
    sectionBgAlt: "#fce7f3",
    headingFont: "Quicksand",
    bodyFont: "Nunito",
    headingColor: "#831843",
    bodyColor: "#4a044e",
    bodyColorLight: "#9d4e8a",
    dangerColor: "#e11d48",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#fbcfe8",
    badgeBg: "#be185d",
    badgeText: "#ffffff",
    tableBorderColor: "#fbcfe8",
    tableRowEven: "#fdf2f8",
    tableRowOdd: "#fce7f3",
    pearlBg: "#fdf2f8",
    pearlBorder: "#e879a0",
    flagBg: "#fff1f2",
    flagBorder: "#e11d48",
    coverBg: "#9d174d",
    coverBgOverlay: "#be185d",
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    primaryColor: "#7e22ce",
    secondaryColor: "#a78bfa",
    accentColor: "#c4b5fd",
    backgroundColor: "#fdfcff",
    sectionBg: "#f5f3ff",
    sectionBgAlt: "#ede9fe",
    headingFont: "Sora",
    bodyFont: "Outfit",
    headingColor: "#581c87",
    bodyColor: "#3b0764",
    bodyColorLight: "#7c3aed",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#ddd6fe",
    badgeBg: "#7e22ce",
    badgeText: "#ffffff",
    tableBorderColor: "#ddd6fe",
    tableRowEven: "#f5f3ff",
    tableRowOdd: "#ede9fe",
    pearlBg: "#f5f3ff",
    pearlBorder: "#a78bfa",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#6b21a8",
    coverBgOverlay: "#7e22ce",
  },
  {
    id: "sage-wellness",
    name: "Sage Wellness",
    primaryColor: "#166534",
    secondaryColor: "#6ee7b7",
    accentColor: "#a7f3d0",
    backgroundColor: "#fcfefb",
    sectionBg: "#f0fdf4",
    sectionBgAlt: "#dcfce7",
    headingFont: "Raleway",
    bodyFont: "Nunito",
    headingColor: "#14532d",
    bodyColor: "#1a3c24",
    bodyColorLight: "#4ade80",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#bbf7d0",
    badgeBg: "#166534",
    badgeText: "#ffffff",
    tableBorderColor: "#bbf7d0",
    tableRowEven: "#f0fdf4",
    tableRowOdd: "#dcfce7",
    pearlBg: "#ecfdf5",
    pearlBorder: "#6ee7b7",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#15803d",
    coverBgOverlay: "#166534",
  },
  {
    id: "sky-breeze",
    name: "Sky Breeze",
    primaryColor: "#0369a1",
    secondaryColor: "#7dd3fc",
    accentColor: "#bae6fd",

    backgroundColor: "#fcfeff",
    sectionBg: "#f0f9ff",
    sectionBgAlt: "#e0f2fe",
    headingFont: "Poppins",
    bodyFont: "Inter",
    headingColor: "#0c4a6e",
    bodyColor: "#0e3654",
    bodyColorLight: "#38bdf8",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#bae6fd",
    badgeBg: "#0369a1",
    badgeText: "#ffffff",
    tableBorderColor: "#bae6fd",
    tableRowEven: "#f0f9ff",
    tableRowOdd: "#e0f2fe",
    pearlBg: "#f0f9ff",
    pearlBorder: "#7dd3fc",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#075985",
    coverBgOverlay: "#0369a1",
  },
  {
    id: "peach-glow",
    name: "Peach Glow",
    primaryColor: "#c2410c",
    secondaryColor: "#fdba74",
    accentColor: "#fed7aa",
    backgroundColor: "#fffcfa",
    sectionBg: "#fff7ed",
    sectionBgAlt: "#ffedd5",
    headingFont: "Crimson Pro",
    bodyFont: "Source Serif 4",
    headingColor: "#7c2d12",
    bodyColor: "#431407",
    bodyColorLight: "#ea580c",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#fed7aa",
    badgeBg: "#c2410c",
    badgeText: "#ffffff",
    tableBorderColor: "#fed7aa",
    tableRowEven: "#fff7ed",
    tableRowOdd: "#ffedd5",
    pearlBg: "#fff7ed",
    pearlBorder: "#fdba74",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#9a3412",
    coverBgOverlay: "#c2410c",
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    primaryColor: "#a21caf",
    secondaryColor: "#f0abfc",
    accentColor: "#e9d5ff",
    backgroundColor: "#fefcff",
    sectionBg: "#fdf4ff",
    sectionBgAlt: "#fae8ff",
    headingFont: "Quicksand",
    bodyFont: "Poppins",
    headingColor: "#701a75",
    bodyColor: "#4a044e",
    bodyColorLight: "#c026d3",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#f5d0fe",
    badgeBg: "#a21caf",
    badgeText: "#ffffff",
    tableBorderColor: "#f5d0fe",
    tableRowEven: "#fdf4ff",
    tableRowOdd: "#fae8ff",
    pearlBg: "#fdf4ff",
    pearlBorder: "#f0abfc",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#86198f",
    coverBgOverlay: "#a21caf",
  },
  {
    id: "ivory-clinical",
    name: "Ivory Clinical",
    primaryColor: "#2563eb",
    secondaryColor: "#60a5fa",
    accentColor: "#38bdf8",
    backgroundColor: "#fafaf9",
    sectionBg: "#f5f5f4",
    sectionBgAlt: "#e7e5e4",
    headingFont: "Instrument Sans",
    bodyFont: "Karla",
    headingColor: "#1c1917",
    bodyColor: "#292524",
    bodyColorLight: "#78716c",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#d6d3d1",
    badgeBg: "#2563eb",
    badgeText: "#ffffff",
    tableBorderColor: "#d6d3d1",
    tableRowEven: "#fafaf9",
    tableRowOdd: "#f5f5f4",
    pearlBg: "#eff6ff",
    pearlBorder: "#60a5fa",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#1e40af",
    coverBgOverlay: "#2563eb",
  },
  {
    id: "mint-ward",
    name: "Mint Ward",
    primaryColor: "#0d9488",
    secondaryColor: "#5eead4",
    accentColor: "#2dd4bf",
    backgroundColor: "#fafffe",
    sectionBg: "#f0fdfa",
    sectionBgAlt: "#ccfbf1",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "DM Sans",
    headingColor: "#134e4a",
    bodyColor: "#1a3c3a",
    bodyColorLight: "#5eead4",
    dangerColor: "#e11d48",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#99f6e4",
    badgeBg: "#0d9488",
    badgeText: "#ffffff",
    tableBorderColor: "#99f6e4",
    tableRowEven: "#f0fdfa",
    tableRowOdd: "#ccfbf1",
    pearlBg: "#f0fdfa",
    pearlBorder: "#5eead4",
    flagBg: "#fff1f2",
    flagBorder: "#e11d48",
    coverBg: "#0f766e",
    coverBgOverlay: "#0d9488",
  },
  {
    id: "snow-minimal",
    name: "Snow Minimal",
    primaryColor: "#18181b",
    secondaryColor: "#a1a1aa",
    accentColor: "#3b82f6",
    backgroundColor: "#ffffff",
    sectionBg: "#fafafa",
    sectionBgAlt: "#f4f4f5",
    headingFont: "Manrope",
    bodyFont: "Inter",
    headingColor: "#18181b",
    bodyColor: "#3f3f46",
    bodyColorLight: "#a1a1aa",
    dangerColor: "#dc2626",
    successColor: "#16a34a",
    warningColor: "#ca8a04",
    dividerColor: "#e4e4e7",
    badgeBg: "#18181b",
    badgeText: "#ffffff",
    tableBorderColor: "#e4e4e7",
    tableRowEven: "#fafafa",
    tableRowOdd: "#f4f4f5",
    pearlBg: "#f0f9ff",
    pearlBorder: "#93c5fd",
    flagBg: "#fef2f2",
    flagBorder: "#dc2626",
    coverBg: "#18181b",
    coverBgOverlay: "#27272a",
  },
  {
    id: "blush-academic",
    name: "Blush Academic",
    primaryColor: "#9f1239",
    secondaryColor: "#fda4af",
    accentColor: "#fecdd3",
    backgroundColor: "#fffbfb",
    sectionBg: "#fff1f2",
    sectionBgAlt: "#ffe4e6",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    headingColor: "#4c0519",
    bodyColor: "#3b0412",
    bodyColorLight: "#f43f5e",
    dangerColor: "#be123c",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#fecdd3",
    badgeBg: "#9f1239",
    badgeText: "#ffffff",
    tableBorderColor: "#fecdd3",
    tableRowEven: "#fff1f2",
    tableRowOdd: "#ffe4e6",
    pearlBg: "#fff1f2",
    pearlBorder: "#fda4af",
    flagBg: "#fef9c3",
    flagBorder: "#d97706",
    coverBg: "#881337",
    coverBgOverlay: "#9f1239",
  },
  {
    id: "nordic-frost",
    name: "Nordic Frost",
    primaryColor: "#334155",
    secondaryColor: "#94a3b8",
    accentColor: "#0ea5e9",
    backgroundColor: "#f8fafc",
    sectionBg: "#f1f5f9",
    sectionBgAlt: "#e2e8f0",
    headingFont: "Archivo",
    bodyFont: "Karla",
    headingColor: "#0f172a",
    bodyColor: "#1e293b",
    bodyColorLight: "#94a3b8",
    dangerColor: "#dc2626",
    successColor: "#059669",
    warningColor: "#d97706",
    dividerColor: "#cbd5e1",
    badgeBg: "#334155",
    badgeText: "#ffffff",
    tableBorderColor: "#cbd5e1",
    tableRowEven: "#f8fafc",
    tableRowOdd: "#f1f5f9",
    pearlBg: "#f0f9ff",
    pearlBorder: "#7dd3fc",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#1e293b",
    coverBgOverlay: "#334155",
  },
  {
    id: "charcoal-clinical",
    name: "Charcoal Clinical",
    primaryColor: "#60a5fa",
    secondaryColor: "#38bdf8",
    accentColor: "#22d3ee",
    backgroundColor: "#1c1c1e",
    sectionBg: "#2c2c2e",
    sectionBgAlt: "#3a3a3c",
    headingFont: "Manrope",
    bodyFont: "DM Sans",
    headingColor: "#f5f5f7",
    bodyColor: "#d1d1d6",
    bodyColorLight: "#aeaeb2",
    dangerColor: "#ff6b6b",
    successColor: "#34d399",
    warningColor: "#fbbf24",
    dividerColor: "#636366",
    badgeBg: "#60a5fa",
    badgeText: "#0f172a",
    tableBorderColor: "#48484a",
    tableRowEven: "#2c2c2e",
    tableRowOdd: "#3a3a3c",
    pearlBg: "#1e3a5f",
    pearlBorder: "#60a5fa",
    flagBg: "#3b1c1c",
    flagBorder: "#ff6b6b",
    coverBg: "#111113",
    coverBgOverlay: "#1c1c1e",
  },
  {
    id: "navy-medical",
    name: "Navy Medical",
    primaryColor: "#38bdf8",
    secondaryColor: "#7dd3fc",
    accentColor: "#fbbf24",
    backgroundColor: "#0c1929",
    sectionBg: "#152238",
    sectionBgAlt: "#1e2d45",
    headingFont: "IBM Plex Sans",
    bodyFont: "IBM Plex Serif",
    headingColor: "#e0f2fe",
    bodyColor: "#bae6fd",
    bodyColorLight: "#93c5fd",
    dangerColor: "#fb7185",
    successColor: "#4ade80",
    warningColor: "#fbbf24",
    dividerColor: "#2a4a6f",
    badgeBg: "#38bdf8",
    badgeText: "#0c1929",
    tableBorderColor: "#1e3a5f",
    tableRowEven: "#152238",
    tableRowOdd: "#1e2d45",
    pearlBg: "#0c2d48",
    pearlBorder: "#38bdf8",
    flagBg: "#2d1215",
    flagBorder: "#fb7185",
    coverBg: "#071525",
    coverBgOverlay: "#0c1929",
  },
  {
    id: "deep-teal",
    name: "Deep Teal",
    primaryColor: "#2dd4bf",
    secondaryColor: "#5eead4",
    accentColor: "#f0abfc",
    backgroundColor: "#0a1e1e",
    sectionBg: "#14302f",
    sectionBgAlt: "#1e4240",
    headingFont: "Sora",
    bodyFont: "Outfit",
    headingColor: "#ccfbf1",
    bodyColor: "#99f6e4",
    bodyColorLight: "#6ee7b7",
    dangerColor: "#fb7185",
    successColor: "#4ade80",
    warningColor: "#fcd34d",
    dividerColor: "#2d5654",
    badgeBg: "#2dd4bf",
    badgeText: "#042f2e",
    tableBorderColor: "#1e4240",
    tableRowEven: "#14302f",
    tableRowOdd: "#1e4240",
    pearlBg: "#0c3533",
    pearlBorder: "#2dd4bf",
    flagBg: "#2d1215",
    flagBorder: "#fb7185",
    coverBg: "#042f2e",
    coverBgOverlay: "#0a1e1e",
  },
  {
    id: "neon-contrast",
    name: "Neon Contrast",
    primaryColor: "#a3e635",
    secondaryColor: "#facc15",
    accentColor: "#22d3ee",
    backgroundColor: "#09090b",
    sectionBg: "#18181b",
    sectionBgAlt: "#27272a",
    headingFont: "Space Grotesk",
    bodyFont: "DM Sans",
    headingColor: "#fafafa",
    bodyColor: "#d4d4d8",
    bodyColorLight: "#a1a1aa",
    dangerColor: "#f87171",
    successColor: "#4ade80",
    warningColor: "#facc15",
    dividerColor: "#52525b",
    badgeBg: "#a3e635",
    badgeText: "#09090b",
    tableBorderColor: "#3f3f46",
    tableRowEven: "#18181b",
    tableRowOdd: "#27272a",
    pearlBg: "#1a2e05",
    pearlBorder: "#a3e635",
    flagBg: "#2d1215",
    flagBorder: "#f87171",
    coverBg: "#09090b",
    coverBgOverlay: "#18181b",
  },
  {
    id: "matte-scholar",
    name: "Matte Scholar",
    primaryColor: "#a78bfa",
    secondaryColor: "#c4b5fd",
    accentColor: "#fb923c",
    backgroundColor: "#1a1a2e",
    sectionBg: "#232340",
    sectionBgAlt: "#2d2d52",
    headingFont: "Bitter",
    bodyFont: "Karla",
    headingColor: "#e4e4f0",
    bodyColor: "#c8c8dc",
    bodyColorLight: "#a5a5bc",
    dangerColor: "#fb7185",
    successColor: "#4ade80",
    warningColor: "#fbbf24",
    dividerColor: "#4d4d72",
    badgeBg: "#a78bfa",
    badgeText: "#1a1a2e",
    tableBorderColor: "#3b3b5c",
    tableRowEven: "#232340",
    tableRowOdd: "#2d2d52",
    pearlBg: "#2a2248",
    pearlBorder: "#a78bfa",
    flagBg: "#2d1520",
    flagBorder: "#fb7185",
    coverBg: "#0f0f1e",
    coverBgOverlay: "#1a1a2e",
  },
  {
    id: "paper-ink",
    name: "Paper & Ink",
    primaryColor: "#1e293b",
    secondaryColor: "#475569",
    accentColor: "#2563eb",
    backgroundColor: "#ffffff",
    sectionBg: "#f9fafb",
    sectionBgAlt: "#f3f4f6",
    headingFont: "Libre Baskerville",
    bodyFont: "Karla",
    headingColor: "#111827",
    bodyColor: "#1f2937",
    bodyColorLight: "#6b7280",
    dangerColor: "#b91c1c",
    successColor: "#15803d",
    warningColor: "#a16207",
    dividerColor: "#d1d5db",
    badgeBg: "#1e293b",
    badgeText: "#ffffff",
    tableBorderColor: "#d1d5db",
    tableRowEven: "#f9fafb",
    tableRowOdd: "#f3f4f6",
    pearlBg: "#eff6ff",
    pearlBorder: "#93c5fd",
    flagBg: "#fef2f2",
    flagBorder: "#b91c1c",
    coverBg: "#1e293b",
    coverBgOverlay: "#0f172a",
  },
  {
    id: "pastel-lilac",
    name: "Pastel Lilac",
    primaryColor: "#8b5cf6",
    secondaryColor: "#c4b5fd",
    accentColor: "#ddd6fe",
    backgroundColor: "#ffffff",
    sectionBg: "#f5f3ff",
    sectionBgAlt: "#ede9fe",
    headingFont: "Quicksand",
    bodyFont: "Nunito",
    headingColor: "#4c1d95",
    bodyColor: "#5b21b6",
    bodyColorLight: "#8b5cf6",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#ddd6fe",
    badgeBg: "#8b5cf6",
    badgeText: "#ffffff",
    tableBorderColor: "#ddd6fe",
    tableRowEven: "#f5f3ff",
    tableRowOdd: "#ede9fe",
    pearlBg: "#f5f3ff",
    pearlBorder: "#c4b5fd",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#6d28d9",
    coverBgOverlay: "#7c3aed",
  },
  {
    id: "pastel-mint",
    name: "Pastel Mint",
    primaryColor: "#14b8a6",
    secondaryColor: "#99f6e4",
    accentColor: "#ccfbf1",
    backgroundColor: "#ffffff",
    sectionBg: "#f0fdfa",
    sectionBgAlt: "#ccfbf1",
    headingFont: "Poppins",
    bodyFont: "DM Sans",
    headingColor: "#134e4a",
    bodyColor: "#115e59",
    bodyColorLight: "#0d9488",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#99f6e4",
    badgeBg: "#14b8a6",
    badgeText: "#ffffff",
    tableBorderColor: "#99f6e4",
    tableRowEven: "#f0fdfa",
    tableRowOdd: "#ccfbf1",
    pearlBg: "#f0fdfa",
    pearlBorder: "#5eead4",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#0f766e",
    coverBgOverlay: "#14b8a6",
  },
  {
    id: "pastel-blush",
    name: "Pastel Blush",
    primaryColor: "#f472b6",
    secondaryColor: "#fbcfe8",
    accentColor: "#fce7f3",
    backgroundColor: "#ffffff",
    sectionBg: "#fdf2f8",
    sectionBgAlt: "#fce7f3",
    headingFont: "Sora",
    bodyFont: "Outfit",
    headingColor: "#9d174d",
    bodyColor: "#be185d",
    bodyColorLight: "#ec4899",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#fbcfe8",
    badgeBg: "#f472b6",
    badgeText: "#ffffff",
    tableBorderColor: "#fbcfe8",
    tableRowEven: "#fdf2f8",
    tableRowOdd: "#fce7f3",
    pearlBg: "#fdf2f8",
    pearlBorder: "#f9a8d4",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#be185d",
    coverBgOverlay: "#db2777",
  },
  {
    id: "pastel-sky",
    name: "Pastel Sky",
    primaryColor: "#38bdf8",
    secondaryColor: "#bae6fd",
    accentColor: "#e0f2fe",
    backgroundColor: "#ffffff",
    sectionBg: "#f0f9ff",
    sectionBgAlt: "#e0f2fe",
    headingFont: "Inter",
    bodyFont: "Inter",
    headingColor: "#0c4a6e",
    bodyColor: "#075985",
    bodyColorLight: "#0284c7",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#bae6fd",
    badgeBg: "#38bdf8",
    badgeText: "#ffffff",
    tableBorderColor: "#bae6fd",
    tableRowEven: "#f0f9ff",
    tableRowOdd: "#e0f2fe",
    pearlBg: "#f0f9ff",
    pearlBorder: "#7dd3fc",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#0369a1",
    coverBgOverlay: "#0284c7",
  },
  {
    id: "pastel-peach",
    name: "Pastel Peach",
    primaryColor: "#fb923c",
    secondaryColor: "#fed7aa",
    accentColor: "#ffedd5",
    backgroundColor: "#ffffff",
    sectionBg: "#fff7ed",
    sectionBgAlt: "#ffedd5",
    headingFont: "Raleway",
    bodyFont: "Nunito",
    headingColor: "#7c2d12",
    bodyColor: "#9a3412",
    bodyColorLight: "#ea580c",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#fed7aa",
    badgeBg: "#fb923c",
    badgeText: "#ffffff",
    tableBorderColor: "#fed7aa",
    tableRowEven: "#fff7ed",
    tableRowOdd: "#ffedd5",
    pearlBg: "#fff7ed",
    pearlBorder: "#fdba74",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#c2410c",
    coverBgOverlay: "#ea580c",
  },
  {
    id: "pastel-lemon",
    name: "Pastel Lemon",
    primaryColor: "#ca8a04",
    secondaryColor: "#fde68a",
    accentColor: "#fef9c3",
    backgroundColor: "#ffffff",
    sectionBg: "#fefce8",
    sectionBgAlt: "#fef9c3",
    headingFont: "Montserrat",
    bodyFont: "Open Sans",
    headingColor: "#713f12",
    bodyColor: "#854d0e",
    bodyColorLight: "#a16207",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#fde68a",
    badgeBg: "#ca8a04",
    badgeText: "#ffffff",
    tableBorderColor: "#fde68a",
    tableRowEven: "#fefce8",
    tableRowOdd: "#fef9c3",
    pearlBg: "#fefce8",
    pearlBorder: "#fde047",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#a16207",
    coverBgOverlay: "#ca8a04",
  },
  {
    id: "coral-white",
    name: "Coral on White",
    primaryColor: "#f43f5e",
    secondaryColor: "#fda4af",
    accentColor: "#fecdd3",
    backgroundColor: "#ffffff",
    sectionBg: "#fff1f2",
    sectionBgAlt: "#ffe4e6",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Karla",
    headingColor: "#881337",
    bodyColor: "#9f1239",
    bodyColorLight: "#e11d48",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#fecdd3",
    badgeBg: "#f43f5e",
    badgeText: "#ffffff",
    tableBorderColor: "#fecdd3",
    tableRowEven: "#fff1f2",
    tableRowOdd: "#ffe4e6",
    pearlBg: "#fff1f2",
    pearlBorder: "#fb7185",
    flagBg: "#fef9c3",
    flagBorder: "#d97706",
    coverBg: "#be123c",
    coverBgOverlay: "#e11d48",
  },
  {
    id: "ocean-white",
    name: "Ocean on White",
    primaryColor: "#0891b2",
    secondaryColor: "#67e8f9",
    accentColor: "#cffafe",
    backgroundColor: "#ffffff",
    sectionBg: "#ecfeff",
    sectionBgAlt: "#cffafe",
    headingFont: "Space Grotesk",
    bodyFont: "DM Sans",
    headingColor: "#164e63",
    bodyColor: "#155e75",
    bodyColorLight: "#0891b2",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#a5f3fc",
    badgeBg: "#0891b2",
    badgeText: "#ffffff",
    tableBorderColor: "#a5f3fc",
    tableRowEven: "#ecfeff",
    tableRowOdd: "#cffafe",
    pearlBg: "#ecfeff",
    pearlBorder: "#22d3ee",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#155e75",
    coverBgOverlay: "#0e7490",
  },
  {
    id: "emerald-white",
    name: "Emerald on White",
    primaryColor: "#059669",
    secondaryColor: "#6ee7b7",
    accentColor: "#d1fae5",
    backgroundColor: "#ffffff",
    sectionBg: "#ecfdf5",
    sectionBgAlt: "#d1fae5",
    headingFont: "Instrument Sans",
    bodyFont: "Inter",
    headingColor: "#064e3b",
    bodyColor: "#065f46",
    bodyColorLight: "#059669",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#a7f3d0",
    badgeBg: "#059669",
    badgeText: "#ffffff",
    tableBorderColor: "#a7f3d0",
    tableRowEven: "#ecfdf5",
    tableRowOdd: "#d1fae5",
    pearlBg: "#ecfdf5",
    pearlBorder: "#34d399",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#047857",
    coverBgOverlay: "#059669",
  },
  {
    id: "indigo-white",
    name: "Indigo on White",
    primaryColor: "#4f46e5",
    secondaryColor: "#a5b4fc",
    accentColor: "#e0e7ff",
    backgroundColor: "#ffffff",
    sectionBg: "#eef2ff",
    sectionBgAlt: "#e0e7ff",
    headingFont: "Archivo",
    bodyFont: "IBM Plex Sans",
    headingColor: "#312e81",
    bodyColor: "#3730a3",
    bodyColorLight: "#6366f1",
    dangerColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    dividerColor: "#c7d2fe",
    badgeBg: "#4f46e5",
    badgeText: "#ffffff",
    tableBorderColor: "#c7d2fe",
    tableRowEven: "#eef2ff",
    tableRowOdd: "#e0e7ff",
    pearlBg: "#eef2ff",
    pearlBorder: "#818cf8",
    flagBg: "#fef2f2",
    flagBorder: "#ef4444",
    coverBg: "#3730a3",
    coverBgOverlay: "#4338ca",
  },
];

function getTheme(id: string): ThemeConfig {

  return THEMES.find(t => t.id === id) || THEMES[0];
}

function generateCoverPage(w: number, h: number, t: ThemeConfig, opts: {
  title?: string; subtitle?: string; examTarget?: string; badges?: string[];
  includesFlashcards?: boolean; includesQbank?: boolean; pageCount?: number;
  logoUrl?: string;
} = {}): CanvasObject[] {
  const title = opts.title || "STUDY GUIDE";
  const subtitle = opts.subtitle || "High-Yield Review";
  const exam = opts.examTarget || "";
  const badges = opts.badges || [];
  const year = new Date().getFullYear();
  const objs: CanvasObject[] = [];
  let z = 0;

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: t.coverBg, rotation: 0, opacity: 1, zIndex: z++, borderRadius: 0 });

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: w, height: h * 0.4, fill: t.coverBgOverlay, rotation: 0, opacity: 0.3, zIndex: z++, borderRadius: 0 });

  objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.38, width: w, height: 3, fill: t.accentColor, rotation: 0, opacity: 0.8, zIndex: z++ });

  objs.push({ id: uid(), type: "rect", x: w * 0.08, y: h * 0.06, width: w * 0.84, height: h * 0.88, fill: "transparent", rotation: 0, opacity: 0.15, zIndex: z++, borderRadius: 16, stroke: "#ffffff", strokeWidth: 1 });

  if (opts.logoUrl) {
    objs.push({ id: uid(), type: "rect", x: w / 2 - 90, y: h * 0.07, width: 180, height: 60, fill: t.backgroundColor, borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "image" as const, x: w / 2 - 80, y: h * 0.08, width: 160, height: 50, src: opts.logoUrl, rotation: 0, opacity: 0.9, zIndex: z++, tag: "brand-logo", locked: true, filter: `brightness(0) saturate(100%) ${hexToCssFilter(t.primaryColor)}` });
  } else {
    objs.push({ id: uid(), type: "text", x: 46, y: h * 0.12, width: w - 92, height: 16, content: "NurseNest", fontSize: 12, fontWeight: "bold", fill: t.accentColor, fontFamily: t.headingFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "center", tag: "brand-logo", locked: true });
  }

  objs.push({ id: uid(), type: "text", x: 36, y: h * 0.22, width: w - 72, height: 60, content: title.toUpperCase(), fontSize: 36, fontWeight: "bold", fill: "#ffffff", fontFamily: t.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center" });

  objs.push({ id: uid(), type: "text", x: 46, y: h * 0.33, width: w - 92, height: 24, content: subtitle, fontSize: 15, fontWeight: "normal", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: 0.75, zIndex: z++, textAlign: "center" });

  const chipY = h * 0.44;
  const allChips = [];
  if (exam) allChips.push(exam);
  allChips.push(`Updated ${year}`);
  if (opts.includesFlashcards) allChips.push("Flashcards");
  if (opts.includesQbank) allChips.push("QBank");
  if (opts.pageCount) allChips.push(`${opts.pageCount} Pages`);
  allChips.push(...badges);

  const chipW = 100;
  const chipGap = 8;
  const totalChipW = allChips.length * chipW + (allChips.length - 1) * chipGap;
  const chipStartX = (w - totalChipW) / 2;

  allChips.forEach((label, i) => {
    const cx = chipStartX + i * (chipW + chipGap);
    objs.push({ id: uid(), type: "rect", x: cx, y: chipY, width: chipW, height: 24, fill: i === 0 ? t.accentColor : t.primaryColor + "33", borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: cx + 4, y: chipY + 4, width: chipW - 8, height: 16, content: label, fontSize: 9, fontWeight: "bold", fill: i === 0 ? "#ffffff" : "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: i === 0 ? 1 : 0.85, zIndex: z++, textAlign: "center" });
  });

  const featureY = h * 0.56;
  const features = [
    "High-yield content mapped to exam blueprints",
    "Clinical pearls and red flags highlighted",
    "Nursing-first language and prioritization focus",
    "Designed for quick review before the exam",
  ];
  features.forEach((f, i) => {
    objs.push({ id: uid(), type: "text", x: w * 0.15, y: featureY + i * 22, width: w * 0.7, height: 18, content: `✦  ${f}`, fontSize: 10, fontWeight: "normal", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: 0.7, zIndex: z++, textAlign: "center" });
  });

  objs.push({ id: uid(), type: "rect", x: w * 0.25, y: h * 0.78, width: w * 0.5, height: 36, fill: t.accentColor, borderRadius: 18, rotation: 0, opacity: 1, zIndex: z++ });
  objs.push({ id: uid(), type: "text", x: w * 0.25, y: h * 0.78 + 8, width: w * 0.5, height: 20, content: "INSTANT DOWNLOAD", fontSize: 12, fontWeight: "bold", fill: "#ffffff", fontFamily: t.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center" });

  objs.push({ id: uid(), type: "text", x: 46, y: h - 50, width: w - 92, height: 14, content: `© ${year} NurseNest  •  For personal study use only`, fontSize: 8, fontWeight: "normal", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: 0.4, zIndex: z++, textAlign: "center" });

  return objs;
}

type CoverPreset = { id: string; name: string; bgStyle: "gradient" | "solid" | "split"; shapesDensity: number; titleWeight: string; };

const COVER_PRESETS: CoverPreset[] = [
  { id: "soft-pastel", name: "Soft Pastel", bgStyle: "gradient", shapesDensity: 4, titleWeight: "bold" },
  { id: "clinical-minimal", name: "Clinical Minimal", bgStyle: "solid", shapesDensity: 1, titleWeight: "bold" },
  { id: "bold-exam", name: "Bold Exam Focus", bgStyle: "split", shapesDensity: 2, titleWeight: "bold" },
  { id: "neutral-academic", name: "Neutral Academic", bgStyle: "solid", shapesDensity: 0, titleWeight: "600" },
];

function generateStyledCoverPage(w: number, h: number, t: ThemeConfig, preset: CoverPreset, opts: {
  title?: string; subtitle?: string; examTarget?: string; badges?: string[];
  includesFlashcards?: boolean; includesQbank?: boolean; pageCount?: number; questionCount?: number;
  logoUrl?: string;
} = {}): CanvasObject[] {
  const title = opts.title || "STUDY GUIDE";
  const subtitle = opts.subtitle || "High-Yield Review";
  const exam = opts.examTarget || "";
  const year = new Date().getFullYear();
  const objs: CanvasObject[] = [];
  let z = 0;

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: t.coverBg, rotation: 0, opacity: 1, zIndex: z++, borderRadius: 0 });

  if (preset.bgStyle === "gradient") {
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: w, height: h * 0.6, fill: t.coverBgOverlay, rotation: 0, opacity: 0.3, zIndex: z++, borderRadius: 0 });
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.55, width: w, height: h * 0.45, fill: t.primaryColor, rotation: 0, opacity: 0.18, zIndex: z++, borderRadius: 0 });
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.78, width: w, height: h * 0.22, fill: "#000000", rotation: 0, opacity: 0.12, zIndex: z++, borderRadius: 0 });
  } else if (preset.bgStyle === "split") {
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: w, height: h * 0.42, fill: t.coverBgOverlay, rotation: 0, opacity: 0.2, zIndex: z++, borderRadius: 0 });
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.42, width: w, height: h * 0.58, fill: t.accentColor, rotation: 0, opacity: 1, zIndex: z++, borderRadius: 0 });
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.41, width: w, height: 5, fill: "#ffffff", rotation: 0, opacity: 0.35, zIndex: z++ });
  } else {
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.82, width: w, height: h * 0.18, fill: "#000000", rotation: 0, opacity: 0.08, zIndex: z++, borderRadius: 0 });
  }

  for (let s = 0; s < preset.shapesDensity + 3; s++) {
    const shapeX = Math.random() * w * 0.8 + w * 0.1;
    const shapeY = Math.random() * h * 0.35;
    const shapeSize = 30 + Math.random() * 100;
    objs.push({ id: uid(), type: "circle", x: shapeX, y: shapeY, width: shapeSize, height: shapeSize, fill: "#ffffff", rotation: 0, opacity: 0.04 + Math.random() * 0.05, zIndex: z++, borderRadius: 0 });
  }
  for (let s = 0; s < 2; s++) {
    const shapeX = Math.random() * w * 0.4 + w * 0.5;
    const shapeY = h * 0.5 + Math.random() * h * 0.3;
    const shapeSize = 50 + Math.random() * 120;
    objs.push({ id: uid(), type: "circle", x: shapeX, y: shapeY, width: shapeSize, height: shapeSize, fill: t.accentColor, rotation: 0, opacity: 0.06 + Math.random() * 0.04, zIndex: z++, borderRadius: 0 });
  }

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: 5, height: h, fill: t.accentColor, rotation: 0, opacity: 0.7, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: w - 5, y: 0, width: 5, height: h, fill: t.accentColor, rotation: 0, opacity: 0.7, zIndex: z++ });

  if (preset.bgStyle !== "split") {
    objs.push({ id: uid(), type: "rect", x: w * 0.06, y: h * 0.40, width: w * 0.88, height: 2, fill: t.accentColor, rotation: 0, opacity: 0.5, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: w * 0.10, y: h * 0.405, width: w * 0.80, height: 1, fill: "#ffffff", rotation: 0, opacity: 0.2, zIndex: z++ });
  }

  objs.push({ id: uid(), type: "rect", x: w * 0.06, y: h * 0.04, width: w * 0.88, height: h * 0.92, fill: "transparent", rotation: 0, opacity: 0.10, zIndex: z++, borderRadius: 20, stroke: "#ffffff", strokeWidth: 1.5 });
  objs.push({ id: uid(), type: "rect", x: w * 0.10, y: h * 0.06, width: w * 0.80, height: h * 0.88, fill: "transparent", rotation: 0, opacity: 0.05, zIndex: z++, borderRadius: 14, stroke: "#ffffff", strokeWidth: 0.5 });

  if (opts.logoUrl) {
    objs.push({ id: uid(), type: "rect", x: w / 2 - 90, y: h * 0.06, width: 180, height: 60, fill: t.backgroundColor, borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "image" as const, x: w / 2 - 80, y: h * 0.07, width: 160, height: 50, src: opts.logoUrl, rotation: 0, opacity: 0.9, zIndex: z++, tag: "brand-logo", locked: true, filter: `brightness(0) saturate(100%) ${hexToCssFilter(t.primaryColor)}` });
  } else {
    objs.push({ id: uid(), type: "text", x: 46, y: h * 0.09, width: w - 92, height: 16, content: "NurseNest", fontSize: 13, fontWeight: "bold", fill: t.accentColor, fontFamily: t.headingFont, rotation: 0, opacity: 0.85, zIndex: z++, textAlign: "center", tag: "brand-logo", locked: true });
    objs.push({ id: uid(), type: "rect", x: w / 2 - 30, y: h * 0.09 + 20, width: 60, height: 1.5, fill: t.accentColor, rotation: 0, opacity: 0.4, zIndex: z++ });
  }

  const titleY = preset.bgStyle === "split" ? h * 0.17 : h * 0.19;
  objs.push({ id: uid(), type: "text", x: 32, y: titleY, width: w - 64, height: 60, content: title.toUpperCase(), fontSize: preset.bgStyle === "bold-exam" ? 42 : 36, fontWeight: preset.titleWeight, fill: "#ffffff", fontFamily: t.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center" });

  objs.push({ id: uid(), type: "rect", x: w / 2 - 40, y: titleY + 62, width: 80, height: 2.5, fill: t.accentColor, rotation: 0, opacity: 0.8, zIndex: z++ });

  objs.push({ id: uid(), type: "text", x: 46, y: titleY + 72, width: w - 92, height: 24, content: subtitle, fontSize: 14, fontWeight: "300", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: 0.8, zIndex: z++, textAlign: "center" });

  const chipY = preset.bgStyle === "split" ? h * 0.48 : h * 0.46;
  const allChips = [];
  if (exam) allChips.push(exam);
  allChips.push(`Updated ${year}`);
  if (opts.includesFlashcards) allChips.push("Flashcards");
  if (opts.includesQbank) allChips.push("QBank");
  if (opts.pageCount) allChips.push(`${opts.pageCount} Pages`);
  if (opts.badges) allChips.push(...opts.badges);

  const chipW = 90;
  const chipGap = 8;
  const totalChipW = allChips.length * chipW + (allChips.length - 1) * chipGap;
  const chipStartX = (w - totalChipW) / 2;

  allChips.forEach((label, i) => {
    const cx = chipStartX + i * (chipW + chipGap);
    const chipFill = i === 0 ? t.accentColor : "#ffffff18";
    objs.push({ id: uid(), type: "rect", x: cx, y: chipY, width: chipW, height: 26, fill: chipFill, borderRadius: 13, rotation: 0, opacity: 1, zIndex: z++, stroke: i === 0 ? "transparent" : "#ffffff22", strokeWidth: 1 });
    objs.push({ id: uid(), type: "text", x: cx + 4, y: chipY + 5, width: chipW - 8, height: 16, content: label, fontSize: 8.5, fontWeight: "bold", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: i === 0 ? 1 : 0.85, zIndex: z++, textAlign: "center" });
  });

  const featureY = preset.bgStyle === "split" ? h * 0.57 : h * 0.55;
  const features = [
    "High-yield content mapped to exam blueprints",
    "Clinical pearls and red flags highlighted",
    "Nursing-first language and prioritization focus",
    "Designed for quick review before the exam",
  ];
  features.forEach((f, i) => {
    objs.push({ id: uid(), type: "rect", x: w * 0.15, y: featureY + i * 24 + 5, width: 4, height: 4, fill: t.accentColor, borderRadius: 2, rotation: 0, opacity: 0.6, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: w * 0.15 + 12, y: featureY + i * 24, width: w * 0.70 - 12, height: 18, content: f, fontSize: 10, fontWeight: "normal", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: 0.65, zIndex: z++, textAlign: "left" });
  });

  objs.push({ id: uid(), type: "rect", x: w * 0.22, y: h * 0.80, width: w * 0.56, height: 38, fill: preset.bgStyle === "split" ? "#ffffff" : t.accentColor, borderRadius: 19, rotation: 0, opacity: 1, zIndex: z++ });
  objs.push({ id: uid(), type: "rect", x: w * 0.22 + 2, y: h * 0.80 + 2, width: w * 0.56 - 4, height: 34, fill: "transparent", borderRadius: 17, rotation: 0, opacity: 0.15, zIndex: z++, stroke: "#ffffff", strokeWidth: 1 });
  objs.push({ id: uid(), type: "text", x: w * 0.22, y: h * 0.80 + 9, width: w * 0.56, height: 20, content: "INSTANT DOWNLOAD", fontSize: 12, fontWeight: "bold", fill: preset.bgStyle === "split" ? t.coverBg : "#ffffff", fontFamily: t.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center" });

  objs.push({ id: uid(), type: "rect", x: w * 0.15, y: h - 54, width: w * 0.70, height: 1, fill: "#ffffff", rotation: 0, opacity: 0.15, zIndex: z++ });
  objs.push({ id: uid(), type: "text", x: 46, y: h - 44, width: w - 92, height: 14, content: `${year} NurseNest  |  For personal study use only`, fontSize: 8, fontWeight: "300", fill: "#ffffff", fontFamily: t.bodyFont, rotation: 0, opacity: 0.4, zIndex: z++, textAlign: "center" });

  return objs;
}

function generateChapterCoverPage(w: number, h: number, t: ThemeConfig, preset: CoverPreset, opts: {
  chapterTitle: string; chapterNumber: number; totalChapters: number;
}): CanvasObject[] {
  const objs: CanvasObject[] = [];
  let z = 0;
  const useDark = preset.bgStyle === "gradient" || preset.bgStyle === "split";
  const bgFill = useDark ? t.coverBg : t.backgroundColor;
  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: bgFill, rotation: 0, opacity: 1, zIndex: z++ });

  if (useDark) {
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.3, width: w, height: h * 0.40, fill: t.coverBgOverlay, rotation: 0, opacity: 0.2, zIndex: z++ });
  } else {
    objs.push({ id: uid(), type: "rect", x: 0, y: h * 0.28, width: w, height: h * 0.44, fill: t.sectionBg, rotation: 0, opacity: 1, zIndex: z++ });
  }

  objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: 5, height: h, fill: t.primaryColor, rotation: 0, opacity: useDark ? 0.5 : 0.8, zIndex: z++ });

  for (let s = 0; s < 3; s++) {
    const sx = w * 0.5 + Math.random() * w * 0.4;
    const sy = h * 0.05 + Math.random() * h * 0.2;
    const sz = 40 + Math.random() * 70;
    objs.push({ id: uid(), type: "circle", x: sx, y: sy, width: sz, height: sz, fill: useDark ? "#ffffff" : t.primaryColor, rotation: 0, opacity: 0.04, zIndex: z++ });
  }
  for (let s = 0; s < 2; s++) {
    const sx = Math.random() * w * 0.3 + w * 0.1;
    const sy = h * 0.65 + Math.random() * h * 0.25;
    const sz = 30 + Math.random() * 50;
    objs.push({ id: uid(), type: "circle", x: sx, y: sy, width: sz, height: sz, fill: t.accentColor, rotation: 0, opacity: 0.05, zIndex: z++ });
  }

  const numStr = opts.chapterNumber.toString().padStart(2, "0");
  objs.push({ id: uid(), type: "text", x: w * 0.62, y: h * 0.08, width: w * 0.32, height: 120, content: numStr, fontSize: 96, fontWeight: "bold", fill: useDark ? "#ffffff" : t.primaryColor, fontFamily: t.headingFont, rotation: 0, opacity: 0.06, zIndex: z++, textAlign: "right" });

  objs.push({ id: uid(), type: "rect", x: w * 0.08, y: h * 0.32, width: 50, height: 2.5, fill: t.accentColor, rotation: 0, opacity: 0.7, zIndex: z++ });
  objs.push({ id: uid(), type: "text", x: w * 0.08, y: h * 0.28, width: w * 0.84, height: 16, content: `SECTION ${opts.chapterNumber} OF ${opts.totalChapters}`, fontSize: 10, fontWeight: "bold", fill: useDark ? t.accentColor : t.primaryColor, fontFamily: t.bodyFont, rotation: 0, opacity: 0.7, zIndex: z++, textAlign: "left" });

  objs.push({ id: uid(), type: "text", x: w * 0.08, y: h * 0.37, width: w * 0.84, height: 60, content: opts.chapterTitle.toUpperCase(), fontSize: 30, fontWeight: preset.titleWeight, fill: useDark ? "#ffffff" : t.headingColor, fontFamily: t.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });

  objs.push({ id: uid(), type: "rect", x: w * 0.08, y: h * 0.52, width: w * 0.40, height: 1.5, fill: useDark ? "#ffffff" : t.dividerColor, rotation: 0, opacity: 0.25, zIndex: z++ });
  objs.push({ id: uid(), type: "text", x: w * 0.08, y: h * 0.55, width: w * 0.84, height: 18, content: "NurseNest  |  Exam Prep", fontSize: 10, fontWeight: "300", fill: useDark ? "#ffffff" : t.bodyColorLight, fontFamily: t.bodyFont, rotation: 0, opacity: 0.45, zIndex: z++, textAlign: "left" });

  objs.push({ id: uid(), type: "rect", x: w * 0.08, y: h * 0.88, width: w * 0.84, height: 1, fill: useDark ? "#ffffff" : t.dividerColor, rotation: 0, opacity: 0.15, zIndex: z++ });
  return objs;
}

const CONTENT_BLOCK_LIBRARY = [
  { id: "cover", label: "Cover Page", icon: "BookOpen", category: "structure" },
  { id: "toc", label: "Table of Contents", icon: "FileText", category: "structure" },
  { id: "section-divider", label: "Section Divider", icon: "LayoutTemplate", category: "structure" },
  { id: "learning-objectives", label: "Learning Objectives", icon: "Target", category: "content" },
  { id: "key-concepts", label: "Key Concepts / Quick Hits", icon: "Zap", category: "content" },
  { id: "pathophysiology", label: "Pathophysiology", icon: "Brain", category: "content" },
  { id: "signs-symptoms", label: "Signs & Symptoms", icon: "AlertTriangle", category: "content" },
  { id: "assessment", label: "Assessment Findings", icon: "ClipboardCheck", category: "content" },
  { id: "labs-diagnostics", label: "Labs / Diagnostics", icon: "Grid3X3", category: "content" },
  { id: "medications", label: "Treatment & Medications", icon: "Sparkles", category: "content" },
  { id: "nursing-interventions", label: "Nursing Interventions", icon: "Shield", category: "content" },
  { id: "complications", label: "Complications", icon: "AlertTriangle", category: "clinical" },
  { id: "patient-teaching", label: "Patient Teaching", icon: "BookOpen", category: "clinical" },
  { id: "clinical-pearls", label: "Clinical Pearls", icon: "Star", category: "clinical" },
  { id: "exam-tips", label: "Exam Tips", icon: "Award", category: "clinical" },
  { id: "practice-questions", label: "Practice Questions", icon: "ClipboardCheck", category: "assessment" },
  { id: "rationales", label: "Rationales", icon: "Brain", category: "assessment" },
  { id: "summary", label: "Summary One-Pager", icon: "FileText", category: "assessment" },
];

const PRODUCT_PRESETS: { id: string; label: string; blocks: string[] }[] = [
  { id: "cram-guide", label: "Cram Guide", blocks: ["cover", "toc", "learning-objectives", "key-concepts", "pathophysiology", "signs-symptoms", "medications", "nursing-interventions", "clinical-pearls", "exam-tips", "practice-questions", "rationales", "summary"] },
  { id: "question-pack", label: "Question Pack", blocks: ["cover", "practice-questions", "rationales"] },
  { id: "study-plan", label: "Study Plan", blocks: ["cover", "toc", "learning-objectives", "key-concepts", "assessment", "labs-diagnostics", "medications", "clinical-pearls", "summary"] },
  { id: "quick-reference", label: "Quick Reference", blocks: ["cover", "key-concepts", "labs-diagnostics", "medications", "nursing-interventions", "clinical-pearls"] },
];

type PageFlowStep =
  | { type: "cover" }
  | { type: "toc" }
  | { type: "divider"; sectionId: string }
  | { type: "section"; sectionId: string }
  | { type: "questions" }
  | { type: "rationales" }
  | { type: "summary" };

type TemplateBlueprint = {
  id: string;
  label: string;
  description: string;
  icon: string;
  minPages: number;
  maxPages: number;
  defaultPages: number;
  charsPerPage: number;
  sections: { id: string; label: string; weight: number; required: boolean }[];
  pageFlow: PageFlowStep[];
  imageSlots: { id: string; label: string; promptHint: string }[];
  includesQuestions: boolean;
  defaultQuestionCount: number;
  minQuestionCount?: number;
  questionPrimary?: boolean;
};

function buildCramPageFlow(): PageFlowStep[] {
  const secs = ["learning-objectives","pathophysiology","signs-symptoms","assessment","labs-diagnostics","medications","nursing-interventions","complications","patient-teaching"];
  const flow: PageFlowStep[] = [{ type: "cover" }, { type: "toc" }];
  for (const s of secs) { flow.push({ type: "divider", sectionId: s }, { type: "section", sectionId: s }); }
  flow.push({ type: "questions" }, { type: "rationales" }, { type: "summary" });
  return flow;
}

const TEMPLATE_BLUEPRINTS: TemplateBlueprint[] = [
  {
    id: "cram", label: "Cram Guide", description: "Comprehensive exam review with high-yield content, clinical pearls, and practice questions", icon: "",
    minPages: 20, maxPages: 80, defaultPages: 45, charsPerPage: 1800,
    sections: [
      { id: "learning-objectives", label: "Learning Objectives", weight: 0.05, required: true },
      { id: "pathophysiology", label: "Pathophysiology", weight: 0.15, required: true },
      { id: "signs-symptoms", label: "Signs & Symptoms", weight: 0.10, required: true },
      { id: "assessment", label: "Assessment Findings", weight: 0.08, required: true },
      { id: "labs-diagnostics", label: "Labs & Diagnostics", weight: 0.08, required: true },
      { id: "medications", label: "Medications", weight: 0.12, required: true },
      { id: "nursing-interventions", label: "Nursing Interventions", weight: 0.10, required: true },
      { id: "complications", label: "Complications", weight: 0.07, required: true },
      { id: "patient-teaching", label: "Patient Teaching", weight: 0.05, required: false },
      { id: "practice-questions", label: "Practice Questions", weight: 0.15, required: true },
      { id: "rationales", label: "Rationales", weight: 0.05, required: true },
    ],
    pageFlow: buildCramPageFlow(),
    imageSlots: [
      { id: "cover-hero", label: "Cover Illustration", promptHint: "soft pastel medical illustration for nursing study guide cover" },
      { id: "patho-diagram", label: "Pathophysiology Diagram", promptHint: "clean clinical flowchart diagram" },
      { id: "med-icon", label: "Medications Icon", promptHint: "simple flat medication pill icon" },
      { id: "assessment-flow", label: "Assessment Algorithm", promptHint: "nursing assessment decision flowchart" },
    ],
    includesQuestions: true, defaultQuestionCount: 25,
  },
  {
    id: "questions", label: "Question Pack", description: "Focused practice questions with detailed rationales", icon: "📝",
    minPages: 15, maxPages: 200, defaultPages: 30, charsPerPage: 1600,
    sections: [
      { id: "practice-questions", label: "Practice Questions", weight: 0.65, required: true },
      { id: "rationales", label: "Rationales", weight: 0.35, required: true },
    ],
    pageFlow: [{ type: "cover" }, { type: "questions" }, { type: "rationales" }],
    imageSlots: [
      { id: "cover-hero", label: "Cover Illustration", promptHint: "exam practice question book cover illustration" },
    ],
    includesQuestions: true, defaultQuestionCount: 300, minQuestionCount: 300, questionPrimary: true,
  },
  {
    id: "cheatsheet", label: "Cheat Sheet", description: "Quick-reference card with key facts, tables, and algorithms", icon: "⚡",
    minPages: 1, maxPages: 6, defaultPages: 2, charsPerPage: 2200,
    sections: [
      { id: "key-concepts", label: "Key Concepts", weight: 0.30, required: true },
      { id: "labs-diagnostics", label: "Labs Quick Ref", weight: 0.20, required: true },
      { id: "medications", label: "Med Quick Ref", weight: 0.25, required: true },
      { id: "clinical-pearls", label: "Clinical Pearls", weight: 0.25, required: true },
    ],
    pageFlow: [
      { type: "cover" },
      { type: "section", sectionId: "key-concepts" },
      { type: "section", sectionId: "labs-diagnostics" },
      { type: "section", sectionId: "medications" },
      { type: "section", sectionId: "clinical-pearls" },
    ],
    imageSlots: [
      { id: "cover-hero", label: "Cover Illustration", promptHint: "quick reference cheat sheet cover" },
    ],
    includesQuestions: false, defaultQuestionCount: 0,
  },
  {
    id: "studyplan", label: "Study Plan", description: "Structured learning pathway with objectives and milestones", icon: "📅",
    minPages: 5, maxPages: 25, defaultPages: 12, charsPerPage: 1800,
    sections: [
      { id: "learning-objectives", label: "Learning Objectives", weight: 0.10, required: true },
      { id: "key-concepts", label: "Core Concepts", weight: 0.25, required: true },
      { id: "assessment", label: "Self-Assessment", weight: 0.15, required: true },
      { id: "medications", label: "Medication Focus", weight: 0.15, required: true },
      { id: "clinical-pearls", label: "Clinical Pearls", weight: 0.15, required: true },
      { id: "practice-questions", label: "Knowledge Checks", weight: 0.20, required: true },
    ],
    pageFlow: [
      { type: "cover" }, { type: "toc" },
      { type: "section", sectionId: "learning-objectives" },
      { type: "section", sectionId: "key-concepts" },
      { type: "section", sectionId: "assessment" },
      { type: "section", sectionId: "medications" },
      { type: "section", sectionId: "clinical-pearls" },
      { type: "questions" }, { type: "summary" },
    ],
    imageSlots: [
      { id: "cover-hero", label: "Cover Illustration", promptHint: "study plan calendar timeline illustration" },
    ],
    includesQuestions: true, defaultQuestionCount: 15,
  },
  {
    id: "bundle", label: "Bundle", description: "Multi-part product with TOC, chapter covers, and combined content", icon: "📦",
    minPages: 30, maxPages: 120, defaultPages: 60, charsPerPage: 1800,
    sections: [
      { id: "pathophysiology", label: "Pathophysiology", weight: 0.12, required: true },
      { id: "signs-symptoms", label: "Signs & Symptoms", weight: 0.08, required: true },
      { id: "assessment", label: "Assessment", weight: 0.08, required: true },
      { id: "labs-diagnostics", label: "Labs & Diagnostics", weight: 0.08, required: true },
      { id: "medications", label: "Medications", weight: 0.12, required: true },
      { id: "nursing-interventions", label: "Nursing Interventions", weight: 0.08, required: true },
      { id: "complications", label: "Complications", weight: 0.06, required: true },
      { id: "clinical-pearls", label: "Clinical Pearls", weight: 0.08, required: true },
      { id: "practice-questions", label: "Practice Questions", weight: 0.20, required: true },
      { id: "rationales", label: "Rationales", weight: 0.10, required: true },
    ],
    pageFlow: (() => {
      const secs = ["pathophysiology","signs-symptoms","assessment","labs-diagnostics","medications","nursing-interventions","complications","clinical-pearls"];
      const flow: PageFlowStep[] = [{ type: "cover" }, { type: "toc" }];
      for (const s of secs) { flow.push({ type: "divider", sectionId: s }, { type: "section", sectionId: s }); }
      flow.push({ type: "questions" }, { type: "rationales" }, { type: "summary" });
      return flow;
    })(),
    imageSlots: [
      { id: "cover-hero", label: "Cover Illustration", promptHint: "bundle nursing study guide cover" },
      { id: "ch1-icon", label: "Ch 1 Icon", promptHint: "pathophysiology section icon" },
      { id: "ch2-icon", label: "Ch 2 Icon", promptHint: "nursing assessment icon" },
      { id: "ch3-icon", label: "Ch 3 Icon", promptHint: "medication management icon" },
    ],
    includesQuestions: true, defaultQuestionCount: 40,
  },
];

const GUIDED_EXAM_OPTIONS = [
  { id: "rex-pn", label: "REx-PN (Canada)", region: "CA" },
  { id: "nclex-pn", label: "NCLEX-PN (US)", region: "US" },
  { id: "nclex-rn", label: "NCLEX-RN (US)", region: "US" },
  { id: "np", label: "NP (AANP/ANCC)", region: "US" },
];

type CompileStep = "plan" | "ai" | "compile" | "images" | "store-ready" | "done";

function computeSectionBudgets(bp: TemplateBlueprint, targetPages: number) {
  const totalChars = targetPages * bp.charsPerPage;
  let weightSum = 0;
  for (const s of bp.sections) weightSum += s.weight;
  const budgets: Record<string, number> = {};
  for (const s of bp.sections) {
    budgets[s.id] = Math.round((totalChars * s.weight) / (weightSum || 1));
  }
  return { totalChars, budgets };
}

function parseAIJsonResponse(raw: string): any {
  let text = raw.trim();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    text = text.substring(jsonStart, jsonEnd + 1);
  }
  try { return JSON.parse(text); } catch { return null; }
}

function applyThemeToPageObjects(objects: CanvasObject[], oldTheme: ThemeConfig, newTheme: ThemeConfig): CanvasObject[] {
  const colorMap: Record<string, string> = {};
  const keys: (keyof ThemeConfig)[] = [
    "primaryColor","secondaryColor","accentColor","backgroundColor","sectionBg","sectionBgAlt",
    "headingColor","bodyColor","bodyColorLight","dangerColor","successColor","warningColor",
    "dividerColor","badgeBg","badgeText","tableBorderColor","tableRowEven","tableRowOdd",
    "pearlBg","pearlBorder","flagBg","flagBorder","coverBg","coverBgOverlay",
  ];
  for (const k of keys) {
    const oldVal = oldTheme[k] as string;
    const newVal = newTheme[k] as string;
    if (oldVal && newVal && oldVal !== newVal) colorMap[oldVal.toLowerCase()] = newVal;
  }
  const fontMap: Record<string, string> = {};
  if (oldTheme.headingFont !== newTheme.headingFont) fontMap[oldTheme.headingFont] = newTheme.headingFont;
  if (oldTheme.bodyFont !== newTheme.bodyFont) fontMap[oldTheme.bodyFont] = newTheme.bodyFont;

  return objects.map(obj => {
    const updated = { ...obj };
    if (updated.fill) {
      const mapped = colorMap[updated.fill.toLowerCase()];
      if (mapped) updated.fill = mapped;
    }
    if (updated.stroke) {
      const mapped = colorMap[updated.stroke.toLowerCase()];
      if (mapped) updated.stroke = mapped;
    }
    if (updated.fontFamily && fontMap[updated.fontFamily]) {
      updated.fontFamily = fontMap[updated.fontFamily];
    }
    return updated;
  });
}

const BRAND = {
  primary: "#7c3aed",
  secondary: "#06b6d4",
  accent: "#f59e0b",
  danger: "#ef4444",
  success: "#10b981",
  neutral: "#f8fafc",
  textDark: "#1e293b",
  textLight: "#64748b",
  fontHeading: "Inter",
  fontBody: "Inter",
};

const FONT_FAMILIES: { label: string; value: string; category: "sans" | "serif" | "display" | "hand" }[] = [
  { label: "Inter", value: "Inter", category: "sans" },
  { label: "DM Sans", value: "DM Sans", category: "sans" },
  { label: "Poppins", value: "Poppins", category: "sans" },
  { label: "Montserrat", value: "Montserrat", category: "sans" },
  { label: "Raleway", value: "Raleway", category: "sans" },
  { label: "Open Sans", value: "Open Sans", category: "sans" },
  { label: "Nunito", value: "Nunito", category: "sans" },
  { label: "Quicksand", value: "Quicksand", category: "sans" },
  { label: "Outfit", value: "Outfit", category: "sans" },
  { label: "Space Grotesk", value: "Space Grotesk", category: "sans" },
  { label: "Sora", value: "Sora", category: "sans" },
  { label: "Oswald", value: "Oswald", category: "sans" },
  { label: "Manrope", value: "Manrope", category: "sans" },
  { label: "Karla", value: "Karla", category: "sans" },
  { label: "Archivo", value: "Archivo", category: "sans" },
  { label: "IBM Plex Sans", value: "IBM Plex Sans", category: "sans" },
  { label: "Instrument Sans", value: "Instrument Sans", category: "sans" },
  { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans", category: "sans" },
  { label: "Georgia", value: "Georgia", category: "serif" },
  { label: "Playfair Display", value: "Playfair Display", category: "serif" },
  { label: "Lora", value: "Lora", category: "serif" },
  { label: "Merriweather", value: "Merriweather", category: "serif" },
  { label: "Crimson Pro", value: "Crimson Pro", category: "serif" },
  { label: "Source Serif 4", value: "Source Serif 4", category: "serif" },
  { label: "Libre Baskerville", value: "Libre Baskerville", category: "serif" },
  { label: "IBM Plex Serif", value: "IBM Plex Serif", category: "serif" },
  { label: "Bitter", value: "Bitter", category: "serif" },
  { label: "Caveat", value: "Caveat", category: "hand" },
  { label: "Dancing Script", value: "Dancing Script", category: "hand" },
  { label: "Pacifico", value: "Pacifico", category: "hand" },
];

const STOCK_ILLUSTRATIONS: { id: string; label: string; category: string; svg: string }[] = [
  { id: "heart", label: "Heart", category: "anatomy", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 100C60 100 15 70 15 40C15 25 25 15 40 15C50 15 57 22 60 28C63 22 70 15 80 15C95 15 105 25 105 40C105 70 60 100 60 100Z" fill="#ef4444" opacity="0.85"/><path d="M45 35C42 35 38 38 38 42" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/></svg>` },
  { id: "lungs", label: "Lungs", category: "anatomy", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 20V55" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/><path d="M55 30H65" stroke="#6366f1" stroke-width="2.5"/><path d="M52 38H68" stroke="#6366f1" stroke-width="2.5"/><path d="M52 38C40 42 22 55 22 75C22 92 32 100 45 100C55 100 58 90 58 80V55" fill="#a5b4fc" opacity="0.7"/><path d="M68 38C80 42 98 55 98 75C98 92 88 100 75 100C65 100 62 90 62 80V55" fill="#a5b4fc" opacity="0.7"/></svg>` },
  { id: "brain", label: "Brain", category: "anatomy", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 100V70" stroke="#d946ef" stroke-width="2.5"/><ellipse cx="60" cy="55" rx="38" ry="35" fill="#f0abfc" opacity="0.6"/><path d="M60 20C60 20 45 25 42 35C39 45 45 50 50 52C40 55 35 62 38 72C41 82 52 85 60 82C68 85 79 82 82 72C85 62 80 55 70 52C75 50 81 45 78 35C75 25 60 20 60 20Z" fill="#d946ef" opacity="0.5"/><path d="M60 25V82" stroke="#a855f7" stroke-width="1.5" opacity="0.5"/></svg>` },
  { id: "kidney", label: "Kidney", category: "anatomy", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 15C75 15 90 30 90 50C90 65 80 75 75 80C85 90 80 105 65 105C55 105 48 95 50 85C45 90 35 88 30 80C25 72 30 60 40 55C30 50 25 35 35 25C45 15 55 15 60 15Z" fill="#f97316" opacity="0.6"/><path d="M55 40C50 50 50 65 58 75" stroke="#ea580c" stroke-width="2" stroke-linecap="round" opacity="0.7"/></svg>` },
  { id: "stethoscope", label: "Stethoscope", category: "tools", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 15C30 15 25 25 25 35V65C25 80 35 90 50 90H55" stroke="#6366f1" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M80 15C90 15 95 25 95 35V50" stroke="#6366f1" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="70" cy="85" r="12" stroke="#6366f1" stroke-width="3" fill="#e0e7ff"/><circle cx="95" cy="55" r="6" fill="#6366f1"/><circle cx="40" cy="15" r="4" fill="#6366f1"/><circle cx="80" cy="15" r="4" fill="#6366f1"/></svg>` },
  { id: "syringe", label: "Syringe", category: "tools", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="25" width="30" height="60" rx="4" stroke="#0ea5e9" stroke-width="2.5" fill="#e0f2fe"/><rect x="42" y="85" width="16" height="20" rx="2" fill="#0ea5e9" opacity="0.7"/><line x1="50" y1="105" x2="50" y2="115" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round"/><rect x="40" y="15" width="20" height="10" rx="2" stroke="#0ea5e9" stroke-width="2" fill="none"/><line x1="42" y1="45" x2="58" y2="45" stroke="#0ea5e9" stroke-width="1.5" opacity="0.4"/><line x1="42" y1="55" x2="58" y2="55" stroke="#0ea5e9" stroke-width="1.5" opacity="0.4"/><line x1="42" y1="65" x2="58" y2="65" stroke="#0ea5e9" stroke-width="1.5" opacity="0.4"/></svg>` },
  { id: "pill", label: "Pill / Capsule", category: "tools", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="40" width="60" height="35" rx="17.5" fill="#10b981" opacity="0.8"/><rect x="60" y="40" width="30" height="35" rx="5" fill="#059669" opacity="0.8"/><line x1="60" y1="42" x2="60" y2="73" stroke="white" stroke-width="1" opacity="0.4"/></svg>` },
  { id: "iv-bag", label: "IV Bag", category: "tools", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="15" width="50" height="65" rx="8" stroke="#7c3aed" stroke-width="2.5" fill="#ede9fe"/><circle cx="45" cy="12" r="3" fill="#7c3aed"/><circle cx="75" cy="12" r="3" fill="#7c3aed"/><rect x="55" y="80" width="10" height="15" rx="2" fill="#7c3aed" opacity="0.6"/><line x1="60" y1="95" x2="60" y2="110" stroke="#7c3aed" stroke-width="2" stroke-dasharray="3 3"/><rect x="42" y="30" width="36" height="8" rx="2" fill="#7c3aed" opacity="0.15"/><rect x="42" y="45" width="36" height="8" rx="2" fill="#7c3aed" opacity="0.1"/></svg>` },
  { id: "clipboard", label: "Clipboard", category: "tools", svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="70" height="85" rx="6" stroke="#475569" stroke-width="2.5" fill="#f8fafc"/><rect x="42" y="15" width="36" height="16" rx="4" fill="#475569"/><line x1="38" y1="50" x2="82" y2="50" stroke="#cbd5e1" stroke-width="2"/><line x1="38" y1="62" x2="72" y2="62" stroke="#cbd5e1" stroke-width="2"/><line x1="38" y1="74" x2="78" y2="74" stroke="#cbd5e1" stroke-width="2"/><line x1="38" y1="86" x2="65" y2="86" stroke="#cbd5e1" stroke-width="2"/></svg>` },
  { id: "ecg-wave", label: "ECG Wave", category: "clinical", svg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="0,25 15,25 20,25 25,20 30,25 35,25 40,25 45,5 50,45 55,25 60,25 65,25 70,25 75,20 80,25 85,25 90,25 95,5 100,45 105,25 110,25 120,25" stroke="#ef4444" stroke-width="2" fill="none"/></svg>` },
  { id: "dna", label: "DNA Helix", category: "clinical", svg: `<svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 10C25 10 55 25 55 40C55 55 25 55 25 70C25 85 55 85 55 100" stroke="#7c3aed" stroke-width="2.5" fill="none"/><path d="M55 10C55 10 25 25 25 40C25 55 55 55 55 70C55 85 25 85 25 100" stroke="#06b6d4" stroke-width="2.5" fill="none"/><line x1="30" y1="25" x2="50" y2="25" stroke="#a78bfa" stroke-width="1.5" opacity="0.5"/><line x1="28" y1="40" x2="52" y2="40" stroke="#a78bfa" stroke-width="1.5" opacity="0.5"/><line x1="28" y1="55" x2="52" y2="55" stroke="#a78bfa" stroke-width="1.5" opacity="0.5"/><line x1="28" y1="70" x2="52" y2="70" stroke="#a78bfa" stroke-width="1.5" opacity="0.5"/><line x1="30" y1="85" x2="50" y2="85" stroke="#a78bfa" stroke-width="1.5" opacity="0.5"/></svg>` },
  { id: "blood-drop", label: "Blood Drop", category: "clinical", svg: `<svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 10C40 10 15 50 15 72C15 90 26 105 40 105C54 105 65 90 65 72C65 50 40 10 40 10Z" fill="#ef4444" opacity="0.75"/><ellipse cx="35" cy="62" rx="6" ry="10" fill="white" opacity="0.2" transform="rotate(-15 35 62)"/></svg>` },
  { id: "thermometer", label: "Thermometer", category: "tools", svg: `<svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="10" width="16" height="75" rx="8" stroke="#ef4444" stroke-width="2" fill="#fef2f2"/><circle cx="30" cy="95" r="14" stroke="#ef4444" stroke-width="2" fill="#ef4444" opacity="0.7"/><rect x="27" y="40" width="6" height="45" rx="3" fill="#ef4444" opacity="0.6"/><line x1="38" y1="30" x2="44" y2="30" stroke="#94a3b8" stroke-width="1.5"/><line x1="38" y1="42" x2="44" y2="42" stroke="#94a3b8" stroke-width="1.5"/><line x1="38" y1="54" x2="44" y2="54" stroke="#94a3b8" stroke-width="1.5"/></svg>` },
  { id: "bandage", label: "Bandage / Cross", category: "clinical", svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="10" width="30" height="80" rx="6" fill="#ef4444" opacity="0.8"/><rect x="10" y="35" width="80" height="30" rx="6" fill="#ef4444" opacity="0.8"/></svg>` },
  { id: "shield-check", label: "Safety Shield", category: "clinical", svg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10L15 28V58C15 82 30 100 50 110C70 100 85 82 85 58V28L50 10Z" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="2.5"/><polyline points="35,60 45,72 65,48" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: "star-badge", label: "Star Badge", category: "decoration", svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="50,8 61,35 90,38 68,58 74,88 50,74 26,88 32,58 10,38 39,35" fill="#f59e0b" opacity="0.8"/></svg>` },
  { id: "arrow-right", label: "Arrow Right", category: "decoration", svg: `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="30" x2="95" y2="30" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/><polyline points="85,18 100,30 85,42" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` },
  { id: "checkmark-circle", label: "Checkmark", category: "decoration", svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="2.5"/><polyline points="32,52 44,64 68,38" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: "warning-triangle", label: "Warning", category: "decoration", svg: `<svg viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M55 10L5 95H105L55 10Z" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="2.5" stroke-linejoin="round"/><line x1="55" y1="40" x2="55" y2="65" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/><circle cx="55" cy="78" r="3" fill="#f59e0b"/></svg>` },
  { id: "divider-wave", label: "Wave Divider", category: "decoration", svg: `<svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 20Q50 0 100 20Q150 40 200 20Q250 0 300 20Q350 40 400 20" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.4"/></svg>` },
  { id: "divider-dots", label: "Dot Divider", category: "decoration", svg: `<svg viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="10" r="3" fill="#94a3b8" opacity="0.4"/><circle cx="100" cy="10" r="3" fill="#94a3b8" opacity="0.4"/><circle cx="150" cy="10" r="3" fill="#94a3b8" opacity="0.4"/><circle cx="200" cy="10" r="3" fill="#94a3b8" opacity="0.4"/><circle cx="250" cy="10" r="3" fill="#94a3b8" opacity="0.4"/><circle cx="300" cy="10" r="3" fill="#94a3b8" opacity="0.4"/><circle cx="350" cy="10" r="3" fill="#94a3b8" opacity="0.4"/></svg>` },
];

interface CanvasObject {
  id: string;
  type: "text" | "rect" | "circle" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  src?: string;
  borderRadius?: number;
  textAlign?: string;
  zIndex: number;
  locked?: boolean;
  tag?: string;
  groupId?: string;
  filter?: string;
}

function uid() {
  return `obj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function hexToCssFilter(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  return `invert(${Math.round(l * 100)}%) sepia(100%) saturate(${Math.round(s * 1000)}%) hue-rotate(${Math.round(h)}deg)`;
}

function gid() {
  return `grp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DESIGN_COMPONENTS: { label: string; icon: any; tag: string; objects: Partial<CanvasObject>[] }[] = [
  {
    label: "Clinical Pearl",
    icon: Sparkles,
    tag: "clinical-pearl",
    objects: [
      { type: "rect", width: 500, height: 100, fill: "#ede9fe", borderRadius: 12 },
      { type: "rect", x: 0, y: 0, width: 5, height: 100, fill: "#7c3aed", borderRadius: 2 },
      { type: "rect", x: 14, y: 10, width: 110, height: 20, fill: "#7c3aed", borderRadius: 10, opacity: 0.12 },
      { type: "text", x: 22, y: 12, width: 94, height: 16, content: "CLINICAL PEARL", fontSize: 8, fontWeight: "bold", fill: "#7c3aed", fontFamily: "Inter" },
      { type: "text", x: 14, y: 38, width: 472, height: 50, content: "Key insight goes here...", fontSize: 11, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter" },
    ],
  },
  {
    label: "Red Flag",
    icon: AlertTriangle,
    tag: "red-flag",
    objects: [
      { type: "rect", width: 500, height: 100, fill: "#fef2f2", borderRadius: 12 },
      { type: "rect", x: 0, y: 0, width: 5, height: 100, fill: "#ef4444", borderRadius: 2 },
      { type: "rect", x: 14, y: 10, width: 72, height: 20, fill: "#ef4444", borderRadius: 10, opacity: 0.12 },
      { type: "text", x: 22, y: 12, width: 56, height: 16, content: "RED FLAG", fontSize: 8, fontWeight: "bold", fill: "#dc2626", fontFamily: "Inter" },
      { type: "text", x: 14, y: 38, width: 472, height: 50, content: "Critical warning...", fontSize: 11, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter" },
    ],
  },
  {
    label: "Exam Trap",
    icon: Target,
    tag: "exam-trap",
    objects: [
      { type: "rect", width: 500, height: 100, fill: "#fef9c3", borderRadius: 12 },
      { type: "rect", x: 0, y: 0, width: 5, height: 100, fill: "#ca8a04", borderRadius: 2 },
      { type: "rect", x: 14, y: 10, width: 82, height: 20, fill: "#ca8a04", borderRadius: 10, opacity: 0.12 },
      { type: "text", x: 22, y: 12, width: 66, height: 16, content: "EXAM TRAP", fontSize: 8, fontWeight: "bold", fill: "#a16207", fontFamily: "Inter" },
      { type: "text", x: 14, y: 38, width: 472, height: 50, content: "Common test pitfall...", fontSize: 11, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter" },
    ],
  },
  {
    label: "Most Tested",
    icon: Star,
    tag: "most-tested",
    objects: [
      { type: "rect", width: 180, height: 30, fill: "#7c3aed", borderRadius: 15 },
      { type: "rect", x: 2, y: 2, width: 176, height: 26, fill: "transparent", borderRadius: 13, stroke: "#ffffff", strokeWidth: 1, opacity: 0.2 },
      { type: "text", x: 10, y: 6, width: 160, height: 18, content: "MOST TESTED", fontSize: 10, fontWeight: "bold", fill: "#ffffff", fontFamily: "Inter", textAlign: "center" },
    ],
  },
  {
    label: "Common Mistake",
    icon: Shield,
    tag: "common-mistake",
    objects: [
      { type: "rect", width: 500, height: 100, fill: "#fff7ed", borderRadius: 12 },
      { type: "rect", x: 0, y: 0, width: 5, height: 100, fill: "#ea580c", borderRadius: 2 },
      { type: "rect", x: 14, y: 10, width: 120, height: 20, fill: "#ea580c", borderRadius: 10, opacity: 0.12 },
      { type: "text", x: 22, y: 12, width: 104, height: 16, content: "COMMON MISTAKE", fontSize: 8, fontWeight: "bold", fill: "#ea580c", fontFamily: "Inter" },
      { type: "text", x: 14, y: 38, width: 472, height: 50, content: "Students often confuse...", fontSize: 11, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter" },
    ],
  },
  {
    label: "High-Yield Badge",
    icon: Award,
    tag: "high-yield",
    objects: [
      { type: "rect", width: 150, height: 30, fill: "#10b981", borderRadius: 15 },
      { type: "rect", x: 2, y: 2, width: 146, height: 26, fill: "transparent", borderRadius: 13, stroke: "#ffffff", strokeWidth: 1, opacity: 0.2 },
      { type: "text", x: 8, y: 6, width: 134, height: 18, content: "HIGH-YIELD", fontSize: 10, fontWeight: "bold", fill: "#ffffff", fontFamily: "Inter", textAlign: "center" },
    ],
  },
  {
    label: "Confidence Check",
    icon: ClipboardCheck,
    tag: "confidence-check",
    objects: [
      { type: "rect", width: 500, height: 160, fill: "#f0fdf4", borderRadius: 12 },
      { type: "rect", x: 0, y: 0, width: 5, height: 160, fill: "#22c55e", borderRadius: 2 },
      { type: "rect", x: 14, y: 10, width: 140, height: 20, fill: "#22c55e", borderRadius: 10, opacity: 0.12 },
      { type: "text", x: 22, y: 12, width: 124, height: 16, content: "CONFIDENCE CHECK", fontSize: 8, fontWeight: "bold", fill: "#15803d", fontFamily: "Inter" },
      { type: "text", x: 14, y: 40, width: 472, height: 108, content: "[ ] I can explain the pathophysiology\n[ ] I know the priority assessments\n[ ] I can identify key medications\n[ ] I recognize red flags\n[ ] I understand the nursing priorities", fontSize: 10, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter" },
    ],
  },
];

const PAGE_TEMPLATES: { label: string; icon: any; generate: (w: number, h: number) => CanvasObject[] }[] = [
  {
    label: "Cover Page",
    icon: BookOpen,
    generate: (w, h) => generateCoverPage(w, h, getTheme("soft-clinical")),
  },
  {
    label: "Section Divider",
    icon: LayoutTemplate,
    generate: (w, h) => [
      { id: uid(), type: "rect" as const, x: 0, y: 0, width: w, height: h, fill: "#f8fafc", rotation: 0, opacity: 1, zIndex: 0, borderRadius: 0 },
      { id: uid(), type: "rect" as const, x: 0, y: h * 0.28, width: w, height: h * 0.44, fill: "#7c3aed", rotation: 0, opacity: 0.06, zIndex: 1, borderRadius: 0 },
      { id: uid(), type: "rect" as const, x: 0, y: 0, width: 5, height: h, fill: "#7c3aed", rotation: 0, opacity: 0.7, zIndex: 2, borderRadius: 0 },
      { id: uid(), type: "circle" as const, x: w - 60, y: h * 0.1, width: 100, height: 100, fill: "#7c3aed", rotation: 0, opacity: 0.04, zIndex: 2 },
      { id: uid(), type: "rect" as const, x: w * 0.08, y: h * 0.41, width: 50, height: 2.5, fill: "#f59e0b", rotation: 0, opacity: 0.7, zIndex: 3 },
      { id: uid(), type: "text" as const, x: w * 0.08, y: h * 0.37, width: w * 0.84, height: 16, content: "SECTION", fontSize: 10, fontWeight: "bold", fill: "#7c3aed", fontFamily: "Inter", rotation: 0, opacity: 0.6, zIndex: 3 },
      { id: uid(), type: "text" as const, x: w * 0.08, y: h * 0.45, width: w * 0.84, height: 50, content: "SECTION TITLE", fontSize: 30, fontWeight: "bold", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 4, textAlign: "left" },
      { id: uid(), type: "rect" as const, x: w * 0.08, y: h * 0.57, width: w * 0.40, height: 1, fill: "#e2e8f0", rotation: 0, opacity: 0.3, zIndex: 4 },
      { id: uid(), type: "text" as const, x: w * 0.08, y: h * 0.59, width: w * 0.84, height: 20, content: "Subsection description", fontSize: 11, fontWeight: "300", fill: "#64748b", fontFamily: "Inter", rotation: 0, opacity: 0.7, zIndex: 5, textAlign: "left" },
    ],
  },
  {
    label: "Comparison Grid",
    icon: Grid3X3,
    generate: (w, h) => {
      const col = (w - 92) / 2;
      return [
        { id: uid(), type: "rect" as const, x: 0, y: 0, width: w, height: h, fill: "#ffffff", rotation: 0, opacity: 1, zIndex: 0, borderRadius: 0 },
        { id: uid(), type: "text" as const, x: 46, y: 30, width: w - 92, height: 30, content: "COMPARISON", fontSize: 22, fontWeight: "bold", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 1, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: 46, y: 80, width: col - 5, height: 36, fill: "#ef4444", borderRadius: 6, rotation: 0, opacity: 1, zIndex: 2 },
        { id: uid(), type: "text" as const, x: 56, y: 86, width: col - 25, height: 24, content: "HYPER", fontSize: 14, fontWeight: "bold", fill: "#fff", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 3, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: 46 + col + 5, y: 80, width: col - 5, height: 36, fill: "#3b82f6", borderRadius: 6, rotation: 0, opacity: 1, zIndex: 4 },
        { id: uid(), type: "text" as const, x: 56 + col + 5, y: 86, width: col - 25, height: 24, content: "HYPO", fontSize: 14, fontWeight: "bold", fill: "#fff", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 5, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: 46, y: 126, width: col - 5, height: 550, fill: "#fef2f2", borderRadius: 8, rotation: 0, opacity: 1, zIndex: 6, stroke: "#fca5a5", strokeWidth: 1 },
        { id: uid(), type: "rect" as const, x: 46 + col + 5, y: 126, width: col - 5, height: 550, fill: "#eff6ff", borderRadius: 8, rotation: 0, opacity: 1, zIndex: 7, stroke: "#93c5fd", strokeWidth: 1 },
        { id: uid(), type: "text" as const, x: 56, y: 136, width: col - 25, height: 530, content: "Signs & symptoms...\n\nKey values...\n\nInterventions...", fontSize: 10, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 8 },
        { id: uid(), type: "text" as const, x: 56 + col + 5, y: 136, width: col - 25, height: 530, content: "Signs & symptoms...\n\nKey values...\n\nInterventions...", fontSize: 10, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 9 },
      ];
    },
  },
  {
    label: "Medication Table",
    icon: FileText,
    generate: (w, h) => {
      const cw = w - 92;
      const rows = [
        { label: "Drug Class", value: "e.g., Beta Blockers" },
        { label: "Prototype", value: "Metoprolol" },
        { label: "Mechanism", value: "Blocks beta-1 receptors" },
        { label: "Indications", value: "HTN, HF, Angina, Arrhythmias" },
        { label: "Side Effects", value: "Bradycardia, hypotension, fatigue" },
        { label: "Nursing Alerts", value: "Hold if HR < 60, check BP" },
      ];
      const rh = 60;
      const objs: CanvasObject[] = [
        { id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: "#ffffff", rotation: 0, opacity: 1, zIndex: 0, borderRadius: 0 },
        { id: uid(), type: "text", x: 46, y: 30, width: cw, height: 30, content: "MEDICATION SUMMARY", fontSize: 20, fontWeight: "bold", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 1, textAlign: "center" },
      ];
      rows.forEach((r, i) => {
        const y = 80 + i * (rh + 6);
        const bg = i % 2 === 0 ? "#f8fafc" : "#f1f5f9";
        objs.push(
          { id: uid(), type: "rect", x: 46, y, width: cw, height: rh, fill: bg, borderRadius: 6, rotation: 0, opacity: 1, zIndex: 2 + i * 3, stroke: "#e2e8f0", strokeWidth: 1 },
          { id: uid(), type: "text", x: 56, y: y + 6, width: 140, height: 16, content: r.label, fontSize: 10, fontWeight: "bold", fill: BRAND.primary, fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 3 + i * 3 },
          { id: uid(), type: "text", x: 56, y: y + 24, width: cw - 20, height: 30, content: r.value, fontSize: 10, fontWeight: "normal", fill: "#334155", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 4 + i * 3 },
        );
      });
      return objs;
    },
  },
  {
    label: "Algorithm Flow",
    icon: Zap,
    generate: (w, h) => {
      const cx = w / 2;
      return [
        { id: uid(), type: "rect" as const, x: 0, y: 0, width: w, height: h, fill: "#ffffff", rotation: 0, opacity: 1, zIndex: 0, borderRadius: 0 },
        { id: uid(), type: "text" as const, x: 46, y: 30, width: w - 92, height: 30, content: "DECISION ALGORITHM", fontSize: 20, fontWeight: "bold", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 1, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: cx - 110, y: 80, width: 220, height: 44, fill: "#7c3aed", borderRadius: 8, rotation: 0, opacity: 1, zIndex: 2 },
        { id: uid(), type: "text" as const, x: cx - 100, y: 90, width: 200, height: 24, content: "Assessment Finding", fontSize: 12, fontWeight: "bold", fill: "#fff", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 3, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: cx - 130, y: 160, width: 260, height: 44, fill: "#fef9c3", borderRadius: 22, stroke: "#ca8a04", strokeWidth: 2, rotation: 0, opacity: 1, zIndex: 4 },
        { id: uid(), type: "text" as const, x: cx - 120, y: 168, width: 240, height: 28, content: "Is the patient stable?", fontSize: 12, fontWeight: "600", fill: "#92400e", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 5, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: cx - 200, y: 240, width: 170, height: 44, fill: "#dcfce7", borderRadius: 8, stroke: "#22c55e", strokeWidth: 1, rotation: 0, opacity: 1, zIndex: 6 },
        { id: uid(), type: "text" as const, x: cx - 190, y: 248, width: 150, height: 28, content: "YES: Monitor", fontSize: 11, fontWeight: "600", fill: "#166534", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 7, textAlign: "center" },
        { id: uid(), type: "rect" as const, x: cx + 30, y: 240, width: 170, height: 44, fill: "#fef2f2", borderRadius: 8, stroke: "#ef4444", strokeWidth: 1, rotation: 0, opacity: 1, zIndex: 8 },
        { id: uid(), type: "text" as const, x: cx + 40, y: 248, width: 150, height: 28, content: "NO: Intervene", fontSize: 11, fontWeight: "600", fill: "#991b1b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 9, textAlign: "center" },
      ];
    },
  },
  {
    label: "Checklist Page",
    icon: ClipboardCheck,
    generate: (w, h) => [
      { id: uid(), type: "rect" as const, x: 0, y: 0, width: w, height: h, fill: "#ffffff", rotation: 0, opacity: 1, zIndex: 0, borderRadius: 0 },
      { id: uid(), type: "text" as const, x: 46, y: 30, width: w - 92, height: 30, content: "CONFIDENCE CHECKLIST", fontSize: 20, fontWeight: "bold", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 1, textAlign: "center" },
      { id: uid(), type: "rect" as const, x: 46, y: 80, width: w - 92, height: 600, fill: "#f0fdf4", borderRadius: 12, stroke: "#86efac", strokeWidth: 2, rotation: 0, opacity: 1, zIndex: 2 },
      { id: uid(), type: "text" as const, x: 66, y: 100, width: w - 132, height: 560, content: "[ ] I can describe the pathophysiology\n\n[ ] I know the priority nursing assessments\n\n[ ] I can identify key medications and side effects\n\n[ ] I recognize early vs late signs\n\n[ ] I know the red flags requiring immediate action\n\n[ ] I understand the diagnostic findings\n\n[ ] I can teach the patient about their condition\n\n[ ] I am confident in exam-style questions on this topic\n\n[ ] I reviewed common exam traps\n\n[ ] I practiced with case scenarios", fontSize: 12, fontWeight: "normal", fill: "#1e293b", fontFamily: "Inter", rotation: 0, opacity: 1, zIndex: 3 },
    ],
  },
];

const AI_TOOLS = [
  { id: "cram-section", label: "Full Cram Section", icon: BookOpen, prompt: "Generate a comprehensive cram section" },
  { id: "pathophysiology", label: "Pathophysiology", icon: Brain, prompt: "Generate a pathophysiology explanation" },
  { id: "signs-symptoms", label: "Signs & Symptoms", icon: AlertTriangle, prompt: "Generate early vs late signs and symptoms" },
  { id: "diagnostics", label: "Diagnostics", icon: Target, prompt: "Generate key diagnostic findings and lab values" },
  { id: "management", label: "Management", icon: Shield, prompt: "Generate management and treatment priorities" },
  { id: "nursing-priorities", label: "Nursing Priorities", icon: Star, prompt: "Generate priority nursing interventions" },
  { id: "exam-traps", label: "Exam Traps", icon: AlertTriangle, prompt: "Generate common exam traps and distractors" },
  { id: "practice-questions", label: "Practice Questions", icon: ClipboardCheck, prompt: "Generate NCLEX-style practice questions" },
  { id: "high-yield", label: "Condense High-Yield", icon: Zap, prompt: "Condense to high-yield bullet points only" },
  { id: "accuracy-review", label: "Accuracy Review", icon: CheckCircle, prompt: "Review for clinical accuracy and flag issues" },
  { id: "product-listing", label: "Product Listing", icon: ShoppingCart, prompt: "Generate SEO-optimized product listing" },
  { id: "flashcards", label: "Convert to Flashcards", icon: Layers, prompt: "Convert content to flashcard format" },
  { id: "question-bank", label: "Convert to Q-Bank", icon: FileText, prompt: "Convert to structured question bank" },
  { id: "suggest-diagrams", label: "Suggest Diagrams", icon: ImagePlus, prompt: "Suggest medical diagrams to include" },
  { id: "bundle-generator", label: "Bundle: Cram + QBank + Flash + Listing", icon: Crown, prompt: "Generate a full product bundle" },
];

function ProjectListView({ onOpenProject, onCreateNew }: { onOpenProject: (id: string) => void; onCreateNew: () => void }) {
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/api/admin/design-projects`)
      .then(r => { if (!r.ok) throw new Error("Unauthorized"); return r.json(); })
      .then(data => { if (Array.isArray(data)) setProjects(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project and all its pages?")) return;
    await adminFetch(`/api/admin/design-projects/${id}`, { method: "DELETE" });
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-builder-title">{t("pages.productBuilder.digitalProductBuilder")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("pages.productBuilder.createProfessionalStudyMaterialsFor")}</p>
        </div>
        <Button onClick={onCreateNew} className="gap-2" data-testid="button-new-project">
          <Plus className="w-4 h-4" />
          New Product
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">{t("pages.productBuilder.loadingProjects")}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16" data-testid="text-no-projects">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("pages.productBuilder.noDesignProjectsYetClick")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="group cursor-pointer hover:border-primary/30 transition-colors" onClick={() => onOpenProject(project.id)} data-testid={`card-project-${project.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{project.type}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{project.pageSize}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{project.orientation}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded transition-all" data-testid={`button-delete-project-${project.id}`}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function GuidedModeView({ projectId: initialProjectId, onBack, onSwitchToCanvas, onProjectCreated }: { projectId: string | null; onBack: () => void; onSwitchToCanvas: () => void; onProjectCreated?: (id: string) => void }) {
  const { toast } = useToast();
  const [projectId, setProjectId] = useState<string | null>(initialProjectId);
  const [project, setProject] = useState<DesignProject | null>(null);
  const [template, setTemplate] = useState<string>("cram");
  const [topic, setTopic] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [examTier, setExamTier] = useState("nclex-rn");
  const [region, setRegion] = useState("BOTH");
  const [targetPages, setTargetPages] = useState(45);
  const [themeId, setThemeId] = useState("soft-clinical");
  const [coverPreset, setCoverPreset] = useState("soft-pastel");
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [questionCount, setQuestionCount] = useState(25);
  const [includeImages, setIncludeImages] = useState(true);
  const [imageIntensity, setImageIntensity] = useState<"low" | "medium">("low");
  const [autoStoreReady, setAutoStoreReady] = useState(true);
  const titleSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [compileStep, setCompileStep] = useState<CompileStep>("plan");
  const [generating, setGenerating] = useState(false);
  const [stepLabel, setStepLabel] = useState("");
  const [compiledPages, setCompiledPages] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [compiledThemeId, setCompiledThemeId] = useState<string | null>(null);
  const [switchingTheme, setSwitchingTheme] = useState(false);
  const [previewPages, setPreviewPages] = useState<{ id: string; title: string; objects: CanvasObject[]; backgroundColor: string }[]>([]);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const [guidedExporting, setGuidedExporting] = useState(false);
  const [showGuidedPublish, setShowGuidedPublish] = useState(false);
  const [guidedPublishing, setGuidedPublishing] = useState(false);
  const [guidedPublishForm, setGuidedPublishForm] = useState({ title: "", description: "", price: "", category: "Cram Guide" });

  const ensureProject = async (title: string): Promise<string> => {
    if (projectId) {
      if (titleSyncRef.current) clearTimeout(titleSyncRef.current);
      titleSyncRef.current = setTimeout(async () => {
        await adminFetch(`/api/admin/design-projects/${projectId}`, {
          method: "PUT",
          body: { title },
        }).catch(() => {});
      }, 800);
      return projectId;
    }
    const res = await adminFetch("/api/admin/design-projects", {
      method: "POST",
      body: { title, type: "booklet", pageSize: "Letter", orientation: "portrait" },
    });
    if (!res.ok) throw new Error("Failed to create project");
    const created = await res.json();
    setProjectId(created.id);
    setProject(created);
    onProjectCreated?.(created.id);
    return created.id;
  };

  const handleTopicChange = (val: string) => {
    setTopic(val);
    if (val.trim() && projectId) {
      if (titleSyncRef.current) clearTimeout(titleSyncRef.current);
      titleSyncRef.current = setTimeout(async () => {
        await adminFetch(`/api/admin/design-projects/${projectId}`, {
          method: "PUT",
          body: { title: val.trim() },
        }).catch(() => {});
        setProject(prev => prev ? { ...prev, title: val.trim() } : prev);
      }, 800);
    }
  };

  const bp = TEMPLATE_BLUEPRINTS.find(t => t.id === template) || TEMPLATE_BLUEPRINTS[0];
  const theme = getTheme(themeId);
  const preset = COVER_PRESETS.find(p => p.id === coverPreset) || COVER_PRESETS[0];
  const { totalChars, budgets } = computeSectionBudgets(bp, targetPages);
  const STEPS_ORDER: CompileStep[] = ["plan", "ai", "compile", "images", "store-ready", "done"];
  const STEP_LABELS: Record<CompileStep, string> = { plan: "Building Plan", ai: "Generating Content", compile: "Compiling Pages", images: "Generating Images", "store-ready": "Store-Ready Pass", done: "Complete" };

  useEffect(() => {
    setTargetPages(bp.defaultPages);
    setQuestionCount(bp.defaultQuestionCount);
    setIncludeQuestions(bp.questionPrimary ? true : bp.includesQuestions);
  }, [template]);

  useEffect(() => {
    if (!projectId) return;
    adminFetch(`/api/admin/design-projects/${projectId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setProject(data);
          if (data.title && !topic) setTopic(data.title);
        }
      })
      .catch(() => {});
  }, [projectId]);

  const W = 612;
  const H = 792;
  const M = 46;
  const contentW = W - M * 2;

  const renderTOCPage = (th: ThemeConfig, sectionTitles: string[], startPage: number): CanvasObject[] => {
    const objs: CanvasObject[] = [];
    let z = 0;
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: th.backgroundColor, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 5, fill: th.primaryColor, rotation: 0, opacity: 0.8, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: 0, y: 5, width: W, height: 2, fill: th.accentColor, rotation: 0, opacity: 0.5, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: 4, height: H, fill: th.primaryColor, rotation: 0, opacity: 0.06, zIndex: z++ });
    objs.push({ id: uid(), type: "circle", x: W - 50, y: -30, width: 140, height: 140, fill: th.primaryColor, rotation: 0, opacity: 0.03, zIndex: z++ });
    objs.push({ id: uid(), type: "circle", x: -20, y: H - 80, width: 100, height: 100, fill: th.accentColor, rotation: 0, opacity: 0.03, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: M, y: M, width: contentW, height: 60, fill: th.sectionBg, borderRadius: 10, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: M, y: M, width: 4, height: 60, fill: th.primaryColor, borderRadius: 2, rotation: 0, opacity: 0.9, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M + 18, y: M + 8, width: contentW - 36, height: 18, content: "CONTENTS", fontSize: 10, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M + 18, y: M + 26, width: contentW - 36, height: 28, content: "Table of Contents", fontSize: 22, fontWeight: "bold", fill: th.headingColor, fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
    let pgNum = startPage;
    const rowH = 42;
    sectionTitles.forEach((title, i) => {
      const yPos = M + 80 + i * rowH;
      if (yPos + rowH < H - M - 30) {
        const numStr = (i + 1).toString().padStart(2, "0");
        objs.push({ id: uid(), type: "rect", x: M, y: yPos, width: 34, height: 34, fill: th.primaryColor, borderRadius: 8, rotation: 0, opacity: 0.08, zIndex: z++ });
        objs.push({ id: uid(), type: "text", x: M, y: yPos + 7, width: 34, height: 20, content: numStr, fontSize: 14, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.6, zIndex: z++, textAlign: "center" });
        objs.push({ id: uid(), type: "text", x: M + 44, y: yPos + 4, width: contentW - 100, height: 18, content: title, fontSize: 12, fontWeight: "600", fill: th.bodyColor, fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
        objs.push({ id: uid(), type: "rect", x: M + 44, y: yPos + 26, width: contentW - 100, height: 1, fill: th.dividerColor, rotation: 0, opacity: 0.2, zIndex: z++ });
        objs.push({ id: uid(), type: "text", x: M + contentW - 40, y: yPos + 6, width: 40, height: 18, content: `${pgNum}`, fontSize: 11, fontWeight: "600", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.4, zIndex: z++, textAlign: "right" });
      }
      pgNum += 2;
    });
    objs.push({ id: uid(), type: "rect", x: M, y: H - 38, width: contentW, height: 1, fill: th.dividerColor, rotation: 0, opacity: 0.2, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M, y: H - 28, width: 80, height: 12, content: "NurseNest", fontSize: 7, fontWeight: "600", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.25, zIndex: z++, textAlign: "left" });
    return objs;
  };

  const renderSummaryPage = (th: ThemeConfig, topicStr: string): CanvasObject[] => {
    const objs: CanvasObject[] = [];
    let z = 0;
    const year = new Date().getFullYear();
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: th.backgroundColor, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 5, fill: th.primaryColor, rotation: 0, opacity: 0.8, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: 0, y: 5, width: W, height: 2, fill: th.accentColor, rotation: 0, opacity: 0.5, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: 0, y: 0, width: 4, height: H, fill: th.primaryColor, rotation: 0, opacity: 0.06, zIndex: z++ });
    objs.push({ id: uid(), type: "circle", x: W - 80, y: -40, width: 180, height: 180, fill: th.primaryColor, rotation: 0, opacity: 0.03, zIndex: z++ });
    objs.push({ id: uid(), type: "circle", x: -30, y: H - 100, width: 140, height: 140, fill: th.accentColor, rotation: 0, opacity: 0.03, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: M, y: M, width: contentW, height: 80, fill: th.primaryColor, borderRadius: 14, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: M + 3, y: M + 3, width: contentW - 6, height: 74, fill: "transparent", borderRadius: 12, rotation: 0, opacity: 0.15, zIndex: z++, stroke: "#ffffff", strokeWidth: 1 });
    objs.push({ id: uid(), type: "text", x: M + 20, y: M + 10, width: contentW - 40, height: 14, content: "RAPID REVIEW", fontSize: 9, fontWeight: "bold", fill: th.accentColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.8, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M + 20, y: M + 28, width: contentW - 40, height: 26, content: "Key Takeaways", fontSize: 22, fontWeight: "bold", fill: "#ffffff", fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
    objs.push({ id: uid(), type: "text", x: M + 20, y: M + 56, width: contentW - 40, height: 14, content: topicStr, fontSize: 10, fontWeight: "300", fill: "#ffffff", fontFamily: th.bodyFont, rotation: 0, opacity: 0.65, zIndex: z++, textAlign: "left" });

    const tips = [
      "Review each section heading -- can you explain the key concept?",
      "Identify the priority nursing interventions for this topic",
      "Know which assessment findings are critical vs. expected",
      "Understand the medications, their actions, and nursing considerations",
      "Recognize the red flags that require immediate intervention",
      "Practice applying clinical judgment to case-based scenarios",
    ];
    let curY = M + 100;
    tips.forEach((tip, i) => {
      objs.push({ id: uid(), type: "rect", x: M, y: curY, width: contentW, height: 36, fill: i % 2 === 0 ? th.sectionBg : th.backgroundColor, borderRadius: 8, rotation: 0, opacity: 1, zIndex: z++ });
      objs.push({ id: uid(), type: "rect", x: M + 12, y: curY + 12, width: 12, height: 12, fill: "transparent", borderRadius: 3, rotation: 0, opacity: 1, zIndex: z++, stroke: th.primaryColor, strokeWidth: 1.5 });
      objs.push({ id: uid(), type: "text", x: M + 32, y: curY + 8, width: contentW - 48, height: 20, content: tip, fontSize: 10, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "left" });
      curY += 42;
    });

    curY += 12;
    objs.push({ id: uid(), type: "rect", x: M, y: curY, width: contentW, height: 80, fill: th.sectionBg, borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++ });
    objs.push({ id: uid(), type: "rect", x: M, y: curY, width: 4, height: 80, fill: th.accentColor, borderRadius: 2, rotation: 0, opacity: 0.8, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M + 18, y: curY + 12, width: contentW - 36, height: 18, content: "LAST-MINUTE CONFIDENCE CHECK", fontSize: 9, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M + 18, y: curY + 34, width: contentW - 36, height: 36, content: "If you can explain the pathophysiology, identify priority assessments, name key medications, and recognize red flags -- you are ready.", fontSize: 11, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.8, zIndex: z++, textAlign: "left" });

    objs.push({ id: uid(), type: "rect", x: M, y: H - 38, width: contentW, height: 1, fill: th.dividerColor, rotation: 0, opacity: 0.2, zIndex: z++ });
    objs.push({ id: uid(), type: "text", x: M, y: H - 28, width: 80, height: 12, content: "NurseNest", fontSize: 7, fontWeight: "600", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.25, zIndex: z++, textAlign: "left" });
    objs.push({ id: uid(), type: "text", x: M + 80, y: H - 28, width: contentW - 120, height: 12, content: `${year}  |  ${topicStr}`, fontSize: 7, fontWeight: "normal", fill: th.bodyColorLight, fontFamily: th.bodyFont, rotation: 0, opacity: 0.25, zIndex: z++, textAlign: "center" });
    return objs;
  };

  const renderBlocksToPages = (blocks: any[], sectionTitle: string, th: ThemeConfig) => {
    const pages: CanvasObject[][] = [];
    let pageObjs: CanvasObject[] = [];
    let curY = M;
    let z = 0;
    let pageCount = 0;
    const bodyIndent = 12;
    const contentStart = M + bodyIndent;
    const contentInner = contentW - bodyIndent;

    const initPage = () => {
      pageObjs = [];
      z = 0;
      curY = M + 10;
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: th.backgroundColor, rotation: 0, opacity: 1, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 5, fill: th.primaryColor, rotation: 0, opacity: 0.8, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 5, width: W, height: 2, fill: th.accentColor, rotation: 0, opacity: 0.5, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: 4, height: H, fill: th.primaryColor, rotation: 0, opacity: 0.06, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "circle", x: W - 60, y: H - 60, width: 120, height: 120, fill: th.primaryColor, rotation: 0, opacity: 0.02, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "text", x: M, y: 14, width: contentW, height: 12, content: sectionTitle, fontSize: 7, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.35, zIndex: z++, textAlign: "right" });
    };

    const flushPage = () => {
      pageCount++;
      pageObjs.push({ id: uid(), type: "rect", x: M, y: H - 36, width: contentW, height: 1, fill: th.dividerColor, rotation: 0, opacity: 0.2, zIndex: 998 });
      pageObjs.push({ id: uid(), type: "text", x: M, y: H - 28, width: 80, height: 12, content: "NurseNest", fontSize: 7, fontWeight: "600", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.25, zIndex: 999, textAlign: "left" });
      pageObjs.push({ id: uid(), type: "text", x: M + contentW - 40, y: H - 28, width: 40, height: 12, content: `${pageCount}`, fontSize: 8, fontWeight: "600", fill: th.bodyColorLight, fontFamily: th.bodyFont, rotation: 0, opacity: 0.3, zIndex: 999, textAlign: "right" });
      pageObjs.push({ id: uid(), type: "text", x: M + 80, y: H - 28, width: contentW - 120, height: 12, content: sectionTitle, fontSize: 7, fontWeight: "normal", fill: th.bodyColorLight, fontFamily: th.bodyFont, rotation: 0, opacity: 0.25, zIndex: 999, textAlign: "center" });
      pages.push([...pageObjs]);
      initPage();
    };

    const maxY = H - M - 40;

    const ensureSpace = (needed: number) => {
      if (curY + needed > maxY) flushPage();
    };

    initPage();

    for (const block of blocks) {
      const kind = block.kind || block.type || "paragraph";
      const text = block.text || block.content || block.body || "";
      const title = block.title || "";

      if (kind === "heading") {
        const level = block.level || 1;
        if (level === 1) {
          const bh = 48;
          ensureSpace(bh + 4);
          if (curY > M + 20) curY += 8;
          pageObjs.push({ id: uid(), type: "rect", x: M, y: curY, width: contentW, height: bh, fill: th.sectionBg, borderRadius: 8, rotation: 0, opacity: 1, zIndex: z++ });
          pageObjs.push({ id: uid(), type: "rect", x: M, y: curY, width: 4, height: bh, fill: th.primaryColor, borderRadius: 2, rotation: 0, opacity: 0.9, zIndex: z++ });
          pageObjs.push({ id: uid(), type: "text", x: M + 16, y: curY + 10, width: contentW - 28, height: 28, content: text, fontSize: 18, fontWeight: "bold", fill: th.headingColor, fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
          curY += bh + 8;
        } else if (level === 2) {
          const bh = 36;
          ensureSpace(bh);
          if (curY > M + 20) curY += 6;
          pageObjs.push({ id: uid(), type: "rect", x: M, y: curY + bh - 3, width: 50, height: 2, fill: th.accentColor, rotation: 0, opacity: 0.5, zIndex: z++ });
          pageObjs.push({ id: uid(), type: "text", x: M, y: curY, width: contentW, height: bh - 6, content: text, fontSize: 14, fontWeight: "bold", fill: th.headingColor, fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
          curY += bh + 4;
        } else {
          const bh = 28;
          ensureSpace(bh);
          curY += 4;
          pageObjs.push({ id: uid(), type: "rect", x: M, y: curY + 3, width: 3, height: 14, fill: th.secondaryColor, borderRadius: 1, rotation: 0, opacity: 0.5, zIndex: z++ });
          pageObjs.push({ id: uid(), type: "text", x: M + 10, y: curY, width: contentW - 10, height: bh - 6, content: text, fontSize: 12, fontWeight: "600", fill: th.headingColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "left" });
          curY += bh;
        }
      } else if (kind === "paragraph") {
        const lines = Math.max(1, Math.ceil(text.length / 72));
        const bh = Math.max(18, lines * 15 + 6);
        ensureSpace(bh);
        pageObjs.push({ id: uid(), type: "text", x: contentStart, y: curY, width: contentInner, height: bh, content: text, fontSize: 10, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "left" });
        curY += bh + 6;
      } else if (kind === "bullets" || kind === "list") {
        const items = block.items || (typeof text === "string" ? text.split("\n").filter((s: string) => s.trim()) : []);
        ensureSpace(Math.min(items.length * 20 + 12, 200));
        pageObjs.push({ id: uid(), type: "rect", x: contentStart, y: curY, width: contentInner, height: Math.min(items.length * 20 + 8, maxY - curY), fill: th.sectionBg, borderRadius: 8, rotation: 0, opacity: 0.5, zIndex: z++ });
        curY += 6;
        items.forEach((item: string, idx: number) => {
          if (curY + 20 > maxY) flushPage();
          pageObjs.push({ id: uid(), type: "rect", x: contentStart + 10, y: curY + 5, width: 5, height: 5, fill: th.primaryColor, borderRadius: 3, rotation: 0, opacity: 0.5, zIndex: z++ });
          pageObjs.push({ id: uid(), type: "text", x: contentStart + 22, y: curY, width: contentInner - 36, height: 16, content: item.replace(/^[-*]\s*/, "").trim(), fontSize: 10, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
          curY += 20;
        });
        curY += 8;
      } else if (kind === "table") {
        const cols: string[] = block.columns || [];
        const rows: string[][] = block.rows || [];
        const caption = block.caption || "";
        const tblInset = 4;
        const tblW = contentInner - tblInset * 2;
        const colW = cols.length > 0 ? tblW / cols.length : tblW;
        const headerH = 28;
        const rowH = 24;
        const totalH = headerH + rows.length * rowH + (caption ? 20 : 0) + 16;
        ensureSpace(Math.min(totalH, 220));
        if (caption) {
          pageObjs.push({ id: uid(), type: "text", x: contentStart, y: curY, width: contentInner, height: 14, content: caption.toUpperCase(), fontSize: 8, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++, textAlign: "left" });
          curY += 18;
        }
        const tblX = contentStart + tblInset;
        pageObjs.push({ id: uid(), type: "rect", x: contentStart, y: curY - 2, width: contentInner, height: headerH + rows.length * rowH + 6, fill: th.backgroundColor, borderRadius: 10, rotation: 0, opacity: 1, zIndex: z++, stroke: th.tableBorderColor, strokeWidth: 1 });
        pageObjs.push({ id: uid(), type: "rect", x: contentStart, y: curY - 2, width: contentInner, height: headerH + 2, fill: th.primaryColor, borderRadius: 0, rotation: 0, opacity: 0.9, zIndex: z++ });
        cols.forEach((col, ci) => {
          pageObjs.push({ id: uid(), type: "text", x: tblX + ci * colW + 6, y: curY + 5, width: colW - 12, height: 18, content: col, fontSize: 9, fontWeight: "bold", fill: "#ffffff", fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
        });
        curY += headerH;
        rows.forEach((row, ri) => {
          if (curY + rowH > maxY) flushPage();
          const bg = ri % 2 === 0 ? th.tableRowEven : th.tableRowOdd;
          pageObjs.push({ id: uid(), type: "rect", x: contentStart + 1, y: curY, width: contentInner - 2, height: rowH, fill: bg, rotation: 0, opacity: 1, zIndex: z++ });
          row.forEach((cell, ci) => {
            if (ci < cols.length) {
              pageObjs.push({ id: uid(), type: "text", x: tblX + ci * colW + 6, y: curY + 4, width: colW - 12, height: 16, content: cell, fontSize: 9, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
            }
          });
          curY += rowH;
        });
        curY += 12;
      } else if (kind === "callout" || kind === "clinical-pearl" || kind === "clinical_pearl" || kind === "exam_tip" || kind === "trap" || kind === "warning") {
        const flavor = block.flavor || kind;
        let bg = th.pearlBg, accentBar = th.pearlBorder, label = "CLINICAL PEARL", labelColor = th.primaryColor, labelBg = th.pearlBorder;
        if (flavor === "exam_tip" || flavor === "exam-tip") { bg = th.sectionBg; accentBar = th.secondaryColor; label = "EXAM TIP"; labelColor = th.secondaryColor; labelBg = th.secondaryColor; }
        else if (flavor === "trap" || flavor === "exam-trap") { bg = th.flagBg; accentBar = th.warningColor; label = "EXAM TRAP"; labelColor = th.warningColor; labelBg = th.warningColor; }
        else if (flavor === "warning") { bg = th.flagBg; accentBar = th.flagBorder; label = "WARNING"; labelColor = th.dangerColor; labelBg = th.dangerColor; }
        const bodyText = text || block.body || "";
        const titleText = title || block.title || "";
        const bodyLines = Math.max(1, Math.ceil(bodyText.length / 62));
        const bh = Math.max(66, bodyLines * 15 + 46);
        ensureSpace(bh + 12);
        pageObjs.push({ id: uid(), type: "rect", x: contentStart, y: curY, width: contentInner, height: bh, fill: bg, borderRadius: 10, rotation: 0, opacity: 1, zIndex: z++ });
        pageObjs.push({ id: uid(), type: "rect", x: contentStart, y: curY, width: 5, height: bh, fill: accentBar, borderRadius: 2, rotation: 0, opacity: 0.9, zIndex: z++ });
        const badgeW = label.length * 6.5 + 16;
        pageObjs.push({ id: uid(), type: "rect", x: contentStart + 14, y: curY + 8, width: badgeW, height: 18, fill: labelBg, borderRadius: 9, rotation: 0, opacity: 0.15, zIndex: z++ });
        pageObjs.push({ id: uid(), type: "text", x: contentStart + 14 + 8, y: curY + 10, width: badgeW - 16, height: 14, content: label, fontSize: 7, fontWeight: "bold", fill: labelColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "left" });
        if (titleText && titleText.toUpperCase() !== label) {
          pageObjs.push({ id: uid(), type: "text", x: contentStart + 14 + badgeW + 6, y: curY + 10, width: contentInner - badgeW - 40, height: 14, content: titleText, fontSize: 9, fontWeight: "600", fill: labelColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.8, zIndex: z++, textAlign: "left" });
        }
        pageObjs.push({ id: uid(), type: "text", x: contentStart + 16, y: curY + 32, width: contentInner - 32, height: bh - 40, content: bodyText, fontSize: 10, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.95, zIndex: z++, textAlign: "left" });
        curY += bh + 12;
      } else if (kind === "image") {
        const bh = 130;
        ensureSpace(bh + 12);
        pageObjs.push({ id: uid(), type: "rect", x: contentStart + contentInner * 0.1, y: curY, width: contentInner * 0.8, height: bh, fill: th.sectionBg, borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++ });
        pageObjs.push({ id: uid(), type: "rect", x: contentStart + contentInner * 0.1, y: curY, width: contentInner * 0.8, height: bh, fill: "transparent", borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++, stroke: th.dividerColor, strokeWidth: 1 });
        pageObjs.push({ id: uid(), type: "rect", x: contentStart + contentInner * 0.5 - 20, y: curY + bh / 2 - 20, width: 40, height: 40, fill: th.primaryColor, borderRadius: 20, rotation: 0, opacity: 0.08, zIndex: z++ });
        pageObjs.push({ id: uid(), type: "text", x: contentStart + contentInner * 0.1 + 12, y: curY + bh / 2 - 6, width: contentInner * 0.8 - 24, height: 14, content: block.alt || block.promptHint || "Illustration", fontSize: 9, fontWeight: "normal", fill: th.bodyColorLight, fontFamily: th.bodyFont, rotation: 0, opacity: 0.4, zIndex: z++, textAlign: "center" });
        curY += bh + 12;
      } else {
        const lines = Math.max(1, Math.ceil(text.length / 72));
        const bh = Math.max(18, lines * 15 + 6);
        ensureSpace(bh);
        pageObjs.push({ id: uid(), type: "text", x: contentStart, y: curY, width: contentInner, height: bh, content: text, fontSize: 10, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "left" });
        curY += bh + 6;
      }
    }

    if (pageObjs.length > 2) flushPage();

    return pages;
  };

  const renderQuestionBlocksToPages = (blocks: any[], sectionTitle: string, th: ThemeConfig) => {
    const pages: CanvasObject[][] = [];
    let pageObjs: CanvasObject[] = [];
    let curY = M;
    let z = 0;
    let pageCount = 0;
    const maxY = H - M - 36;

    const initPage = () => {
      pageObjs = [];
      z = 0;
      curY = M + 10;
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: th.backgroundColor, rotation: 0, opacity: 1, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 4, fill: th.primaryColor, rotation: 0, opacity: 0.8, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "text", x: M, y: 10, width: contentW, height: 10, content: sectionTitle, fontSize: 6, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.3, zIndex: z++, textAlign: "right" });
    };

    const flushPage = () => {
      pageCount++;
      pageObjs.push({ id: uid(), type: "rect", x: M, y: H - 30, width: contentW, height: 1, fill: th.dividerColor, rotation: 0, opacity: 0.15, zIndex: 998 });
      pageObjs.push({ id: uid(), type: "text", x: M, y: H - 24, width: 60, height: 10, content: "NurseNest", fontSize: 6, fontWeight: "600", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.2, zIndex: 999, textAlign: "left" });
      pageObjs.push({ id: uid(), type: "text", x: M + contentW - 30, y: H - 24, width: 30, height: 10, content: `${pageCount}`, fontSize: 7, fontWeight: "600", fill: th.bodyColorLight, fontFamily: th.bodyFont, rotation: 0, opacity: 0.25, zIndex: 999, textAlign: "right" });
      pages.push([...pageObjs]);
      initPage();
    };

    initPage();

    for (const block of blocks) {
      if (block.kind === "heading") {
        const bh = 28;
        if (curY + bh > maxY) flushPage();
        pageObjs.push({ id: uid(), type: "rect", x: M, y: curY, width: contentW, height: bh, fill: th.sectionBg, borderRadius: 4, rotation: 0, opacity: 1, zIndex: z++ });
        pageObjs.push({ id: uid(), type: "text", x: M + 8, y: curY + 6, width: contentW - 16, height: 16, content: block.text, fontSize: 11, fontWeight: "bold", fill: th.headingColor, fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
        curY += bh + 4;
      } else if (block.kind === "question-compact") {
        const stemLines = Math.max(1, Math.ceil((block.scenario.length + block.stem.length) / 90));
        const optLines = Math.max(1, Math.ceil(block.options.length / 90));
        const qHeight = 8 + stemLines * 9 + optLines * 9 + 4;
        if (curY + qHeight > maxY) flushPage();
        const numW = 28;
        pageObjs.push({ id: uid(), type: "text", x: M, y: curY, width: numW, height: 8, content: `${block.num}.`, fontSize: 7, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.8, zIndex: z++, textAlign: "left" });
        const tagText = `[${block.qType}]`;
        pageObjs.push({ id: uid(), type: "text", x: M + numW, y: curY, width: 40, height: 8, content: tagText, fontSize: 6, fontWeight: "600", fill: th.secondaryColor || th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.5, zIndex: z++, textAlign: "left" });
        curY += 9;
        const combinedStem = (block.scenario + " " + block.stem).trim();
        const stemH = Math.max(9, stemLines * 9);
        pageObjs.push({ id: uid(), type: "text", x: M + 6, y: curY, width: contentW - 12, height: stemH, content: combinedStem, fontSize: 8, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.9, zIndex: z++, textAlign: "left" });
        curY += stemH + 2;
        const optH = Math.max(9, optLines * 9);
        pageObjs.push({ id: uid(), type: "text", x: M + 10, y: curY, width: contentW - 20, height: optH, content: block.options, fontSize: 7.5, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.75, zIndex: z++, textAlign: "left" });
        curY += optH + 3;
        pageObjs.push({ id: uid(), type: "rect", x: M + 20, y: curY, width: contentW - 40, height: 0.5, fill: th.dividerColor, rotation: 0, opacity: 0.15, zIndex: z++ });
        curY += 3;
      }
    }

    if (pageObjs.length > 3) flushPage();
    return pages;
  };

  const renderRationaleBlocksToPages = (blocks: any[], sectionTitle: string, th: ThemeConfig) => {
    const pages: CanvasObject[][] = [];
    let pageObjs: CanvasObject[] = [];
    let curY = M;
    let z = 0;
    let pageCount = 0;
    const maxY = H - M - 36;

    const initPage = () => {
      pageObjs = [];
      z = 0;
      curY = M + 10;
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: H, fill: th.backgroundColor, rotation: 0, opacity: 1, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "rect", x: 0, y: 0, width: W, height: 4, fill: th.accentColor || th.primaryColor, rotation: 0, opacity: 0.7, zIndex: z++ });
      pageObjs.push({ id: uid(), type: "text", x: M, y: 10, width: contentW, height: 10, content: sectionTitle, fontSize: 6, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.3, zIndex: z++, textAlign: "right" });
    };

    const flushPage = () => {
      pageCount++;
      pageObjs.push({ id: uid(), type: "rect", x: M, y: H - 30, width: contentW, height: 1, fill: th.dividerColor, rotation: 0, opacity: 0.15, zIndex: 998 });
      pageObjs.push({ id: uid(), type: "text", x: M, y: H - 24, width: 60, height: 10, content: "NurseNest", fontSize: 6, fontWeight: "600", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.2, zIndex: 999, textAlign: "left" });
      pageObjs.push({ id: uid(), type: "text", x: M + contentW - 30, y: H - 24, width: 30, height: 10, content: `${pageCount}`, fontSize: 7, fontWeight: "600", fill: th.bodyColorLight, fontFamily: th.bodyFont, rotation: 0, opacity: 0.25, zIndex: 999, textAlign: "right" });
      pages.push([...pageObjs]);
      initPage();
    };

    initPage();

    for (const block of blocks) {
      if (block.kind === "heading") {
        const bh = 26;
        if (curY + bh > maxY) flushPage();
        pageObjs.push({ id: uid(), type: "rect", x: M, y: curY, width: contentW, height: bh, fill: th.sectionBg, borderRadius: 4, rotation: 0, opacity: 1, zIndex: z++ });
        pageObjs.push({ id: uid(), type: "text", x: M + 8, y: curY + 5, width: contentW - 16, height: 14, content: block.text, fontSize: 11, fontWeight: "bold", fill: th.headingColor, fontFamily: th.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "left" });
        curY += bh + 4;
      } else if (block.kind === "rationale-compact") {
        const ratLines = Math.max(1, Math.ceil(block.rationale.length / 95));
        const rHeight = 10 + ratLines * 8 + 4;
        if (curY + rHeight > maxY) flushPage();
        pageObjs.push({ id: uid(), type: "text", x: M, y: curY, width: 28, height: 9, content: `Q${block.num}`, fontSize: 7, fontWeight: "bold", fill: th.primaryColor, fontFamily: th.headingFont, rotation: 0, opacity: 0.85, zIndex: z++, textAlign: "left" });
        pageObjs.push({ id: uid(), type: "text", x: M + 28, y: curY, width: 60, height: 9, content: `Ans: ${block.correctAnswer}`, fontSize: 7, fontWeight: "bold", fill: th.accentColor || th.secondaryColor || th.primaryColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.8, zIndex: z++, textAlign: "left" });
        curY += 10;
        const ratH = Math.max(8, ratLines * 8);
        pageObjs.push({ id: uid(), type: "text", x: M + 6, y: curY, width: contentW - 12, height: ratH, content: block.rationale, fontSize: 7, fontWeight: "normal", fill: th.bodyColor, fontFamily: th.bodyFont, rotation: 0, opacity: 0.85, zIndex: z++, textAlign: "left" });
        curY += ratH + 3;
        pageObjs.push({ id: uid(), type: "rect", x: M + 20, y: curY, width: contentW - 40, height: 0.5, fill: th.dividerColor, rotation: 0, opacity: 0.12, zIndex: z++ });
        curY += 4;
      }
    }

    if (pageObjs.length > 3) flushPage();
    return pages;
  };

  const buildAIPrompt = (examCtx: any) => {
    const sectionList = bp.sections
      .filter(s => s.id !== "practice-questions" && s.id !== "rationales")
      .map(s => `  - id: "${s.id}", title: "${s.label}", budget: ~${budgets[s.id] || 800} characters`)
      .join("\n");

    const userInstructions = aiPrompt.trim()
      ? `\nUSER INSTRUCTIONS: ${aiPrompt.trim()}\nUse these instructions to guide the depth, focus, and style of the content. Do NOT echo the user's words — generate original, structured academic content based on their request.`
      : "";

    const requiredIds = bp.sections
      .filter(s => s.id !== "practice-questions" && s.id !== "rationales")
      .map(s => s.id);

    const skeleton = requiredIds.map(id => {
      const label = bp.sections.find(s => s.id === id)?.label || id;
      return `{"id":"${id}","title":"${label}","blocks":[/* FILL */]}`;
    }).join(",\n    ");

    return `You are a nursing exam content expert and visual study-material designer. Generate structured, design-block-oriented study content as valid JSON. Your output will be rendered as a premium Canva-quality study bundle -- NOT a text document.

TOPIC: "${topic}"${userInstructions}
TEMPLATE: ${bp.label}
AUDIENCE: ${examCtx?.label || "Nursing"} students
REGION: ${region === "BOTH" ? "Include both Canadian (metric, SI, C, kg, mmol/L) and US (imperial, F, lbs, mg/dL) values" : region === "CA" ? "Canadian context only (metric, SI units)" : "US context only (imperial, conventional units)"}
TARGET LENGTH: ~${totalChars} total characters across all sections

REQUIRED SECTION IDS (use these EXACT ids -- no renaming, no extra sections):
${requiredIds.map(id => `  - "${id}"`).join("\n")}

SECTION BUDGETS:
${sectionList}

QUESTIONS: Do NOT generate practice questions in this response. Questions are generated separately via a dedicated endpoint. Focus only on the content sections listed above.

BLOCK TYPES YOU MUST USE (mix liberally for visual variety):
- {"kind":"heading","text":"...","level":1|2|3}
- {"kind":"paragraph","text":"..."}
- {"kind":"bullets","items":["item1","item2","item3"]}
- {"kind":"table","columns":["Col1","Col2"],"rows":[["a","b"],["c","d"]],"caption":"optional"}
- {"kind":"callout","flavor":"exam_tip"|"trap"|"clinical_pearl"|"warning","title":"...","body":"..."}

DESIGN RULES (critical for visual quality):
- Return ONLY valid JSON, no markdown, no trailing commas, no comments
- Every section MUST have at least 5-7 blocks for visual density
- Start each section with a level-1 heading, then mix block types aggressively
- Use level-2 and level-3 headings to create visual hierarchy within sections
- Include at least 2 callouts per section (mix clinical_pearl, exam_tip, and trap)
- Include at least 1 table per major section -- tables are high-impact visual blocks
- Keep paragraphs SHORT (2-3 sentences max). Break long text into bullets
- Use bullets for lists of 3+ items. Each bullet should be concise (one key point)
- Tables should have 2-4 columns and 3-6 rows. Use comparison tables where relevant
- Callout titles should be specific to the content, not generic
- Callout bodies should be 1-3 sentences of focused, actionable clinical insight
- Do NOT include keys not listed above

SECTION ID CONTRACT: Each section.id MUST match one of the required IDs listed above EXACTLY. Do NOT invent new IDs, do NOT use spaces, do NOT use CamelCase. Use the hyphenated lowercase IDs as given.

RETURN THIS EXACT STRUCTURE (fill each section's blocks array):
{"sections":[
    ${skeleton}
  ]${includeQuestions ? ',"questions":[{"stem":"...","options":["A)...","B)...","C)...","D)..."],"correct":"A","rationale":"Why A is correct. B is wrong because... C is wrong because... D is wrong because..."}]' : ""}}`;
  };

  const callPipelineStep = async (step: string, previousStepData: any): Promise<any> => {
    const examCtx = GUIDED_EXAM_OPTIONS.find(e => e.id === examTier);
    const sectionDefs = bp.sections
      .filter(s => s.id !== "practice-questions" && s.id !== "rationales")
      .map(s => ({ id: s.id, label: s.label, budget: budgets[s.id] || 800 }));

    const res = await adminFetch("/api/ai/generate-pipeline", {
      method: "POST",
      body: {
        step,
        topic,
        examTarget: examTier,
        region,
        templateLabel: bp.label,
        sections: sectionDefs,
        targetPages,
        includeQuestions,
        questionCount,
        previousStepData,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 422 && err.error === "EMPTY_SECTION") {
        const emptyList = (err.emptySections || [err.section]).join(", ");
        const report = err.sectionReport ? "\n\nSection report:\n" + Object.entries(err.sectionReport).map(([k, v]: any) => `  ${k}: ${v.status} (${v.blocks} blocks, ${v.chars} chars)`).join("\n") : "";
        const rawSnippet = err.rawPreview ? "\n\nRaw model output (first 1500 chars):\n" + err.rawPreview : "";
        throw new Error(`EMPTY_SECTION: Sections with no content: ${emptyList}${report}${rawSnippet}`);
      }
      throw new Error(err.error || err.message || `Pipeline step "${step}" failed`);
    }
    const result = await res.json();
    if (result.data) return result.data;

    if (result._raw) {
      const parsed = parseAIJsonResponse(result._raw);
      if (parsed) return parsed;
    }
    throw new Error(`Pipeline step "${step}" returned invalid data`);
  };

  const fetchQuestionsBatched = async (total: number): Promise<any[]> => {
    setStepLabel(`Generating ${total} questions in batches...`);
    const res = await adminFetch("/api/ai/generate-questions-batch", {
      method: "POST",
      body: {
        topic,
        examTarget: examTier,
        region,
        totalCount: total,
        batchSize: 25,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (err.error === "QUESTION_BATCH_FAILED") {
        const partial = err.partialQuestions || [];
        if (partial.length > 0) {
          toast({ title: `Question generation partially failed`, description: `${partial.length}/${total} questions generated. Continuing with partial set.`, variant: "destructive" });
          return partial;
        }
        throw new Error(`Question batch generation failed: ${err.details || "Unknown error"}`);
      }
      throw new Error(err.error || "Question batch generation failed");
    }
    const data = await res.json();
    return data.questions || [];
  };

  const fetchAIContent = async (examCtx: any): Promise<any> => {
    setStepLabel("Step 1/5: Building content strategy...");
    let strategyData: any;
    try {
      strategyData = await callPipelineStep("strategy", {});
    } catch {
      strategyData = { strategy: { target_level: "average", pain_points: [], transformation: "Master this topic for exam success", narrative_arc: { orientation: "Introduction", system_mastery: "Deep learning", exam_execution: "Apply knowledge" }, clinical_priority_framework: [], visual_motif: "checklist", tone: "clear and confident", difficulty_escalation: "progressive" } };
    }

    setStepLabel("Step 2/5: Designing page blueprint...");
    let blueprintData: any;
    try {
      blueprintData = await callPipelineStep("blueprint", strategyData);
    } catch {
      blueprintData = { pages: [] };
    }

    const accumulated = { ...strategyData, ...blueprintData };

    setStepLabel("Step 3/5: Generating structured content...");
    let contentData = await callPipelineStep("content", accumulated);

    if (!contentData?.sections || contentData.sections.length === 0) {
      setStepLabel("Retrying content generation (fallback)...");
      const prompt = buildAIPrompt(examCtx);
      const res = await adminFetch("/api/ai/generate-content", {
        method: "POST",
        body: { prompt, mode: "guided", examTarget: examTier, topic },
      });
      if (!res.ok) throw new Error("Content generation failed on both pipeline and fallback");
      const data = await res.json();
      if (data.sections?.length > 0) {
        contentData = data;
      } else {
        const raw = data._raw || JSON.stringify(data);
        const parsed = parseAIJsonResponse(raw);
        if (parsed?.sections?.length > 0) contentData = parsed;
        else throw new Error("Could not generate valid content after multiple attempts. The model returned no parseable sections.");
      }
    }

    setStepLabel("Step 4/5: Adding exam authority framing...");
    try {
      const enhanced = await callPipelineStep("enhance", contentData);
      if (enhanced?.sections?.length > 0) contentData = enhanced;
    } catch {}

    setStepLabel("Step 5/5: Quality assurance pass...");
    try {
      const qa = await callPipelineStep("qa", contentData);
      if (qa?.sections?.length > 0) contentData = qa;
    } catch {}

    const effectiveQCount = includeQuestions ? Math.max(questionCount, bp.minQuestionCount || 5) : 0;
    if (includeQuestions && effectiveQCount > 0) {
      setStepLabel(`Generating ${effectiveQCount} validated questions...`);
      try {
        const tbRes = await adminFetch("/api/ai/generate-test-bank", {
          method: "POST",
          body: {
            topic,
            examTarget: examTier,
            questionCount: effectiveQCount,
            difficulty: "mixed",
            questionTypes: ["multiple-choice", "select-all", "ordered-response"],
          },
        });
        const tbData = await tbRes.json().catch(() => ({}));
        if (tbRes.ok && tbData.questions?.length > 0) {
          contentData.questions = tbData.questions;
          if (tbData.countMismatch || tbData.questions.length < effectiveQCount) {
            setStepLabel(`Generated ${tbData.questions.length}/${effectiveQCount} questions`);
            toast({ title: `Generated ${tbData.questions.length}/${effectiveQCount} questions`, description: "Some questions could not be generated. The available set has been included.", variant: "destructive" });
          } else {
            setStepLabel(`Generated ${tbData.questions.length} questions successfully`);
          }
        } else if (tbData.questions?.length > 0 || (tbData.testBank?.questions?.length > 0)) {
          contentData.questions = tbData.questions || tbData.testBank.questions;
          toast({ title: `Partial: ${contentData.questions.length}/${effectiveQCount} questions`, variant: "destructive" });
        } else {
          setStepLabel(`Fallback: generating ${effectiveQCount} questions in batches...`);
          const batchedQs = await fetchQuestionsBatched(effectiveQCount);
          if (batchedQs.length > 0) {
            contentData.questions = batchedQs;
            if (batchedQs.length < effectiveQCount) {
              toast({ title: `Generated ${batchedQs.length}/${effectiveQCount} questions via batch`, variant: "destructive" });
            }
          }
        }
      } catch (e: any) {
        toast({ title: "Question generation issue", description: e.message, variant: "destructive" });
        try {
          setStepLabel(`Retry: generating ${effectiveQCount} questions in batches...`);
          const batchedQs = await fetchQuestionsBatched(effectiveQCount);
          if (batchedQs.length > 0) contentData.questions = batchedQs;
        } catch {}
      }
    }

    return contentData;
  };

  const compileDocument = async () => {
    if (!topic.trim()) { toast({ title: "Enter a topic", variant: "destructive" }); return; }
    setGenerating(true);
    setLastError(null);
    setCompiledPages(0);
    setIsComplete(false);
    const startTime = Date.now();

    try {
      const activeProjectId = await ensureProject(topic.trim());

      setCompileStep("plan");
      setStepLabel("Building content plan from blueprint...");
      const examCtx = GUIDED_EXAM_OPTIONS.find(e => e.id === examTier);
      const sectionTitles = bp.sections.filter(s => s.id !== "practice-questions" && s.id !== "rationales").map(s => s.label);

      setCompileStep("ai");
      setStepLabel("Generating content via AI...");
      const aiData = await fetchAIContent(examCtx);
      const sections: any[] = aiData.sections || [];
      const questions: any[] = aiData.questions || [];

      const normId = (s: string) => (s || "").toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");

      const sectionMap: Record<string, any> = {};
      for (const sec of sections) {
        if (sec.id) sectionMap[sec.id] = sec;
        const idNorm = normId(sec.id);
        if (idNorm && !sectionMap[idNorm]) sectionMap[idNorm] = sec;
        const titleNorm = normId(sec.title);
        if (titleNorm && !sectionMap[titleNorm]) sectionMap[titleNorm] = sec;
        const idUnderscore = (sec.id || "").replace(/_/g, "-");
        if (idUnderscore && !sectionMap[idUnderscore]) sectionMap[idUnderscore] = sec;
      }

      const requiredSectionIds = bp.sections
        .filter(s => s.required && s.id !== "practice-questions" && s.id !== "rationales")
        .map(s => s.id);
      const emptySections: string[] = [];
      const sectionValidation: string[] = [];
      const substantiveKinds = new Set(["bullets", "table", "callout", "paragraph", "checklist", "steps", "flowchart", "decisiontree", "case", "qa", "comparisongrid", "algorithm", "chart"]);
      const nonSubstantiveKinds = new Set(["heading", "sectionTitle", "divider", "spacer"]);
      for (const reqId of requiredSectionIds) {
        const sec = sectionMap[reqId] || sectionMap[normId(reqId)];
        const blocks = sec?.blocks || [];
        let charCount = 0;
        let substantive = 0;
        for (const b of blocks) {
          const txt = (b.text || b.body || b.content || b.caption || "").toString();
          const items = b.items || [];
          const rows = b.rows || [];
          const bChars = txt.length + items.join(" ").length + rows.map((r: any[]) => (r || []).join(" ")).join(" ").length;
          charCount += bChars;
          const kind = (b.kind || b.type || "").toLowerCase();
          if (substantiveKinds.has(kind) && bChars > 10) substantive++;
          else if (!nonSubstantiveKinds.has(kind) && bChars > 20) substantive++;
        }
        const ok = blocks.length >= 3 && charCount >= 400 && substantive >= 4;
        const label = bp.sections.find(s => s.id === reqId)?.label || reqId;
        sectionValidation.push(`${label}: ${ok ? "OK" : "EMPTY"} (${blocks.length} blocks, ${substantive} substantive, ${charCount} chars)`);
        if (!ok) emptySections.push(label);
      }

      if (emptySections.length > 0) {
        const report = sectionValidation.join("\n");
        throw new Error(
          `EMPTY_SECTION: ${emptySections.length} required sections have no content: ${emptySections.join(", ")}.\n\n` +
          `Section report:\n${report}\n\n` +
          `The AI model did not generate usable content for these sections. Try a more specific topic or retry.`
        );
      }

      setCompileStep("compile");
      setStepLabel("Compiling pages from blueprint...");
      let pagesCreated = 0;
      let dividerIndex = 0;

      if (project?.pages && project.pages.length > 1) {
        setStepLabel("Clearing existing pages...");
        for (let i = project.pages.length - 1; i >= 1; i--) {
          await adminFetch(`/api/admin/design-pages/${project.pages[i].id}`, { method: "DELETE" }).catch(() => {});
        }
      }

      const savePage = async (title: string, objects: CanvasObject[]) => {
        if (pagesCreated === 0 && project?.pages?.[0]) {
          await adminFetch(`/api/admin/design-pages/${project.pages[0].id}`, {
            method: "PUT",
            body: { canvasJson: { objects, version: "1.0" }, backgroundColor: "#ffffff", title },
          });
        } else {
          await adminFetch(`/api/admin/design-projects/${activeProjectId}/pages`, {
            method: "POST",
            body: { title, backgroundColor: "#ffffff", canvasJson: { objects, version: "1.0" } },
          });
        }
        pagesCreated++;
        setCompiledPages(pagesCreated);
        setStepLabel(`Compiling... ${pagesCreated} pages`);
      };

      let savedLogoUrl: string | undefined = "/brand-logo.gif";
      try {
        const savedLogos = JSON.parse(localStorage.getItem("nursenest-brand-logos") || "[]");
        if (savedLogos.length > 0) savedLogoUrl = savedLogos[0].url;
      } catch {}

      for (const step of bp.pageFlow) {
        if (step.type === "cover") {
          const actualQCount = includeQuestions ? questions.length : 0;
          const coverObjs = generateStyledCoverPage(W, H, theme, preset, {
            title: topic,
            subtitle: `${examCtx?.label || "Nursing"} ${bp.label}`,
            examTarget: examCtx?.label || "",
            includesFlashcards: false,
            includesQbank: includeQuestions,
            pageCount: actualQCount > 0 ? undefined : targetPages,
            questionCount: actualQCount > 0 ? actualQCount : undefined,
            logoUrl: savedLogoUrl,
          });
          await savePage("Cover", coverObjs);
        } else if (step.type === "toc") {
          const tocObjs = renderTOCPage(theme, sectionTitles, pagesCreated + 1);
          await savePage("Table of Contents", tocObjs);
        } else if (step.type === "divider") {
          dividerIndex++;
          const secDef = bp.sections.find(s => s.id === step.sectionId);
          const divObjs = generateChapterCoverPage(W, H, theme, preset, {
            chapterTitle: secDef?.label || step.sectionId,
            chapterNumber: dividerIndex,
            totalChapters: sectionTitles.length,
          });
          await savePage(secDef?.label || step.sectionId, divObjs);
        } else if (step.type === "section") {
          const sec = sectionMap[step.sectionId]
            || sectionMap[step.sectionId.replace(/_/g, "-")]
            || sections.find((s: any) => s.id === step.sectionId || (s.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === step.sectionId);
          if (sec?.blocks?.length > 0) {
            const contentPages = renderBlocksToPages(sec.blocks, sec.title || step.sectionId, theme);
            for (const pageObjects of contentPages) {
              await savePage(sec.title || step.sectionId, pageObjects);
            }
          }
        } else if (step.type === "questions") {
          if (includeQuestions && questions.length > 0) {
            const QUESTIONS_PER_PAGE = 25;
            for (let batch = 0; batch < questions.length; batch += QUESTIONS_PER_PAGE) {
              const pageQs = questions.slice(batch, batch + QUESTIONS_PER_PAGE);
              const qBlocks: any[] = [];
              if (batch === 0) {
                qBlocks.push({ kind: "heading", text: `Practice Questions (${questions.length} Total)`, level: 1 });
              }
              for (const q of pageQs) {
                const idx = questions.indexOf(q);
                const num = (idx + 1).toString().padStart(3, "0");
                const qType = (q.type || "MCQ").toUpperCase();
                const scenarioText = q.scenario ? ` ${q.scenario}` : "";
                const stemText = q.stem || q.question || "";
                const optionsText = q.options ? q.options.map((o: string) => o.trim()).join("  |  ") : "";
                qBlocks.push({ kind: "question-compact", num, qType, category: q.category || "", scenario: scenarioText, stem: stemText, options: optionsText });
              }
              const qPages = renderQuestionBlocksToPages(qBlocks, `Questions ${batch + 1}-${Math.min(batch + QUESTIONS_PER_PAGE, questions.length)}`, theme);
              for (const pg of qPages) await savePage(`Questions ${batch + 1}-${Math.min(batch + QUESTIONS_PER_PAGE, questions.length)}`, pg);
            }
          }
        } else if (step.type === "rationales") {
          if (includeQuestions && questions.length > 0) {
            const RATIONALES_PER_PAGE = 10;
            for (let batch = 0; batch < questions.length; batch += RATIONALES_PER_PAGE) {
              const pageQs = questions.slice(batch, batch + RATIONALES_PER_PAGE);
              const rBlocks: any[] = [];
              if (batch === 0) {
                rBlocks.push({ kind: "heading", text: "Answer Rationales", level: 1 });
              }
              for (const q of pageQs) {
                const idx = questions.indexOf(q);
                const num = (idx + 1).toString().padStart(3, "0");
                const correctAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : (q.correctAnswer || q.correct || "");
                const ratText = q.rationaleCorrect || q.rationale || "See explanation.";
                const incorrectText = Array.isArray(q.rationaleIncorrect) ? q.rationaleIncorrect.join(" | ") : "";
                const pearlText = q.clinicalPearl ? `Clinical Pearl: ${q.clinicalPearl}` : "";
                const fullRationale = [ratText, incorrectText, pearlText].filter(Boolean).join(" -- ");
                rBlocks.push({ kind: "rationale-compact", num, correctAnswer, rationale: fullRationale });
              }
              const rPages = renderRationaleBlocksToPages(rBlocks, `Rationales ${batch + 1}-${Math.min(batch + RATIONALES_PER_PAGE, questions.length)}`, theme);
              for (const pg of rPages) await savePage(`Rationales ${batch + 1}-${Math.min(batch + RATIONALES_PER_PAGE, questions.length)}`, pg);
            }
          }
        } else if (step.type === "summary") {
          const sumObjs = renderSummaryPage(theme, topic);
          await savePage("Summary", sumObjs);
        }
      }

      if (includeImages && bp.imageSlots.length > 0) {
        setCompileStep("images");
        const maxImages = imageIntensity === "low" ? 6 : 12;
        const slotsToFill = bp.imageSlots.slice(0, maxImages);
        setStepLabel(`Generating ${slotsToFill.length} images (graceful fallback if unavailable)...`);
        for (const slot of slotsToFill) {
          try {
            const imgPromptText = `${slot.promptHint}, topic: ${topic}, style: clean pastel medical illustration, no text, no words`;
            await adminFetch("/api/ai/image-generate", {
              method: "POST",
              body: { prompt: imgPromptText, stylePreset: "nursenest-pastel", themeId, aspectRatio: "1:1", size: "512x512" },
            }).catch(() => {});
          } catch {}
        }
      }

      if (autoStoreReady) {
        setCompileStep("store-ready");
        setStepLabel("Running Store-Ready pipeline...");
        await new Promise(r => setTimeout(r, 300));
      }

      setCompileStep("done");
      setCompiledThemeId(themeId);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setStepLabel(`Complete! ${pagesCreated} pages compiled in ${elapsed}s`);
      setIsComplete(true);
      try {
        const projRes = await adminFetch(`/api/admin/design-projects/${activeProjectId}`);
        if (projRes.ok) {
          const projData = await projRes.json();
          const loadedPages = (projData.pages || []).map((p: any) => ({
            id: p.id,
            title: p.title || `Page ${p.pageNumber}`,
            objects: p.canvasJson?.objects || [],
            backgroundColor: p.backgroundColor || "#ffffff",
          }));
          setPreviewPages(loadedPages);
          setPreviewPageIndex(0);
        }
      } catch {}
      toast({ title: "Draft compiled", description: `${pagesCreated} pages generated for "${topic}" ${bp.label}` });
    } catch (e: any) {
      setLastError(e.message);
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
      setStepLabel("");
    } finally {
      setGenerating(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const renderPageToCanvas = async (pageData: { objects: CanvasObject[]; backgroundColor: string }, w: number, h: number): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = pageData.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, w, h);
    const sorted = [...pageData.objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    for (const obj of sorted) {
      ctx.save();
      ctx.globalAlpha = obj.opacity ?? 1;
      if (obj.rotation) {
        ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        ctx.rotate((obj.rotation * Math.PI) / 180);
        ctx.translate(-(obj.x + obj.width / 2), -(obj.y + obj.height / 2));
      }
      if (obj.type === "rect") {
        ctx.fillStyle = obj.fill || "transparent";
        if (obj.borderRadius) {
          const r = Math.min(obj.borderRadius, obj.width / 2, obj.height / 2);
          ctx.beginPath();
          ctx.roundRect(obj.x, obj.y, obj.width, obj.height, r);
          ctx.fill();
          if (obj.stroke) { ctx.strokeStyle = obj.stroke; ctx.lineWidth = obj.strokeWidth || 1; ctx.stroke(); }
        } else {
          if (obj.fill && obj.fill !== "transparent") ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          if (obj.stroke) { ctx.strokeStyle = obj.stroke; ctx.lineWidth = obj.strokeWidth || 1; ctx.strokeRect(obj.x, obj.y, obj.width, obj.height); }
        }
      } else if (obj.type === "circle") {
        ctx.fillStyle = obj.fill || "transparent";
        ctx.beginPath();
        ctx.ellipse(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, obj.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (obj.stroke) { ctx.strokeStyle = obj.stroke; ctx.lineWidth = obj.strokeWidth || 1; ctx.stroke(); }
      } else if (obj.type === "text") {
        ctx.fillStyle = obj.fill || "#000000";
        const weight = obj.fontWeight || "normal";
        const size = obj.fontSize || 14;
        const family = obj.fontFamily || "Inter";
        ctx.font = `${weight} ${size}px "${family}", sans-serif`;
        ctx.textAlign = (obj.textAlign as CanvasTextAlign) || "left";
        ctx.textBaseline = "top";
        const textX = obj.textAlign === "center" ? obj.x + obj.width / 2 : obj.textAlign === "right" ? obj.x + obj.width : obj.x;
        const content = obj.content || "";
        const lines = content.split("\n");
        const lineHeight = size * 1.3;
        lines.forEach((line, li) => {
          if (obj.y + li * lineHeight < obj.y + obj.height) {
            ctx.fillText(line, textX, obj.y + li * lineHeight, obj.width);
          }
        });
      } else if (obj.type === "image" && obj.src) {
        try {
          const img = await loadImage(obj.src);
          const fit = obj.tag === "brand-logo" ? "contain" : "cover";
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (fit === "cover") {
            const scale = Math.max(obj.width / img.width, obj.height / img.height);
            sw = obj.width / scale;
            sh = obj.height / scale;
            sx = (img.width - sw) / 2;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, obj.x, obj.y, obj.width, obj.height);
        } catch {}
      }
      ctx.restore();
    }
    return canvas;
  };

  const downloadGuidedPages = async () => {
    if (previewPages.length === 0) return;
    setGuidedExporting(true);
    try {
      const W = 612, H = 792;
      const zip = new JSZip();
      const folder = zip.folder(project?.title || "document")!;
      for (let i = 0; i < previewPages.length; i++) {
        setStepLabel(`Rendering page ${i + 1} of ${previewPages.length}...`);
        const pg = previewPages[i];
        const canvas = await renderPageToCanvas(pg, W, H);
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), "image/png"));
        const arrayBuf = await blob.arrayBuffer();
        folder.file(`page-${String(i + 1).padStart(2, "0")}.png`, arrayBuf);
      }
      setStepLabel("Creating ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(project?.title || "document").replace(/\s+/g, "-").toLowerCase()}-pages.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStepLabel(`Complete! ${previewPages.length} pages exported`);
      toast({ title: "Download complete", description: `${previewPages.length} pages bundled into ZIP` });
    } catch (e: any) {
      toast({ title: "Download failed", description: e.message, variant: "destructive" });
    } finally {
      setGuidedExporting(false);
    }
  };

  const publishGuidedToStore = async () => {
    if (!guidedPublishForm.title.trim() || !guidedPublishForm.price) return;
    setGuidedPublishing(true);
    try {
      const priceNum = Number(String(guidedPublishForm.price).replace(/[^0-9.]/g, ""));
      const priceCents = Math.round(priceNum * 100);
      const res = await adminFetch("/api/admin/shop/products", {
        method: "POST",
        body: {
          title: guidedPublishForm.title,
          slug: guidedPublishForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          description: guidedPublishForm.description || guidedPublishForm.title,
          price: priceCents,
          category: guidedPublishForm.category,
          coverImageUrl: null,
          featured: false,
        },
      });
      if (res.ok) {
        toast({ title: "Published to marketplace!", description: "Your product is now listed in the store as a draft." });
        setShowGuidedPublish(false);
      } else {
        const err = await res.json();
        toast({ title: "Publish failed", description: err.error || "Unknown error", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Publish failed", description: e.message, variant: "destructive" });
    } finally {
      setGuidedPublishing(false);
    }
  };

  const switchThemeAfterCompile = async (newThemeId: string) => {
    if (!compiledThemeId || !project) return;
    setSwitchingTheme(true);
    try {
      const oldTheme = getTheme(compiledThemeId);
      const newTheme = getTheme(newThemeId);
      const res = await adminFetch(`/api/admin/design-projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to load project");
      const data = await res.json();
      const pages = data.pages || [];

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const objs = page.canvasJson?.objects || [];
        if (objs.length === 0) continue;
        const reSkinned = applyThemeToPageObjects(objs, oldTheme, newTheme);
        await adminFetch(`/api/admin/design-pages/${page.id}`, {
          method: "PUT",
          body: { canvasJson: { objects: reSkinned, version: "1.0" }, backgroundColor: "#ffffff" },
        });
      }

      setCompiledThemeId(newThemeId);
      setThemeId(newThemeId);
      try {
        const projRes = await adminFetch(`/api/admin/design-projects/${projectId}`);
        if (projRes.ok) {
          const projData = await projRes.json();
          setPreviewPages((projData.pages || []).map((p: any) => ({
            id: p.id,
            title: p.title || `Page ${p.pageNumber}`,
            objects: p.canvasJson?.objects || [],
            backgroundColor: p.backgroundColor || "#ffffff",
          })));
        }
      } catch {}
      toast({ title: "Theme applied", description: `Switched to ${newTheme.name} across all pages` });
    } catch (e: any) {
      toast({ title: "Theme switch failed", description: e.message, variant: "destructive" });
    } finally {
      setSwitchingTheme(false);
    }
  };

  const stepIndex = STEPS_ORDER.indexOf(compileStep);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition" data-testid="button-guided-back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-sm">
            <button onClick={onBack} className="text-gray-400 hover:text-primary transition text-xs font-medium" data-testid="link-guided-drafts">{t("pages.productBuilder.drafts")}</button>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800" data-testid="text-guided-title">{topic || project?.title || "New Product"}</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1 font-medium">{t("pages.productBuilder.guidedMode")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && compiledThemeId && (
            <div className="flex items-center gap-1.5 mr-2" data-testid="section-theme-switch">
              <Palette className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={compiledThemeId}
                onChange={e => switchThemeAfterCompile(e.target.value)}
                disabled={switchingTheme}
                className="h-8 rounded-lg border px-2 text-xs"
                data-testid="select-reskin-theme"
              >
                {THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {switchingTheme && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
            </div>
          )}
          <Button size="sm" variant="outline" onClick={onSwitchToCanvas} disabled={!projectId} className="h-8 text-xs gap-1.5" data-testid="button-switch-canvas">
            <Grid3X3 className="w-3.5 h-3.5" /> Advanced Canvas
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {isComplete && previewPages.length > 0 ? (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-[340px] shrink-0 border-r bg-white overflow-y-auto p-4 space-y-4" data-testid="section-guided-sidebar">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl p-3 border border-green-200">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{stepLabel}</p>
                  <p className="text-[10px] text-green-600/70 mt-0.5">Page {previewPageIndex + 1} of {previewPages.length}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.reskinTheme")}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => switchThemeAfterCompile(t.id)}
                      disabled={switchingTheme || compiledThemeId === t.id}
                      className={`p-2 rounded-lg border text-left transition flex items-center gap-2 ${compiledThemeId === t.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
                      data-testid={`button-reskin-${t.id}`}
                    >
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accentColor }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
                {switchingTheme && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" /> Applying theme...
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t pt-3">
                <label className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.actions")}</label>
                <div className="space-y-1.5">
                  <Button size="sm" onClick={() => { setGuidedPublishForm(f => ({ ...f, title: f.title || topic, description: f.description || `${bp.label}: ${topic}` })); setShowGuidedPublish(true); }} className="w-full h-8 text-xs gap-1.5 bg-green-600 hover:bg-green-700" data-testid="button-guided-publish">
                    <ShoppingCart className="w-3.5 h-3.5" /> Publish to Store
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadGuidedPages} disabled={guidedExporting} className="w-full h-8 text-xs gap-1.5" data-testid="button-guided-download">
                    {guidedExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} {guidedExporting ? "Exporting..." : "Download All Pages (ZIP)"}
                  </Button>
                  <Button size="sm" onClick={onSwitchToCanvas} className="w-full h-8 text-xs gap-1.5" data-testid="button-edit-in-canvas">
                    <Grid3X3 className="w-3.5 h-3.5" /> Edit in Canvas Editor
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsComplete(false); setPreviewPages([]); setStepLabel(""); setCompiledPages(0); setLastError(null); setCompileStep("plan"); }} className="w-full h-8 text-xs gap-1.5" data-testid="button-regenerate">
                    <Wand2 className="w-3.5 h-3.5" /> Regenerate
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.pages")}</label>
                <div className="space-y-1 max-h-[300px] overflow-y-auto" ref={previewScrollRef}>
                  {previewPages.map((pg, i) => (
                    <button
                      key={pg.id}
                      onClick={() => setPreviewPageIndex(i)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition flex items-center gap-2 ${previewPageIndex === i ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                      data-testid={`button-preview-page-${i}`}
                    >
                      <span className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0">{i + 1}</span>
                      <span className="truncate">{pg.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#f0f1f5] flex items-start justify-center p-8" data-testid="section-guided-preview">
              {previewPages[previewPageIndex] && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreviewPageIndex(i => Math.max(0, i - 1))}
                        disabled={previewPageIndex === 0}
                        className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                        data-testid="button-preview-prev"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">{previewPages[previewPageIndex].title}</span>
                      <button
                        onClick={() => setPreviewPageIndex(i => Math.min(previewPages.length - 1, i + 1))}
                        disabled={previewPageIndex === previewPages.length - 1}
                        className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                        data-testid="button-preview-next"
                      >
                        <ChevronR className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">{previewPageIndex + 1} / {previewPages.length}</span>
                  </div>
                  <div
                    className="bg-white rounded-lg shadow-2xl relative overflow-hidden"
                    style={{ width: 612 * 0.85, height: 792 * 0.85, backgroundColor: previewPages[previewPageIndex].backgroundColor }}
                    data-testid="preview-canvas"
                  >
                    <div style={{ transform: "scale(0.85)", transformOrigin: "top left", width: 612, height: 792, position: "relative" }}>
                      {previewPages[previewPageIndex].objects
                        .slice()
                        .sort((a: CanvasObject, b: CanvasObject) => (a.zIndex || 0) - (b.zIndex || 0))
                        .map((obj: CanvasObject) => (
                          <div
                            key={obj.id}
                            style={{
                              position: "absolute",
                              left: obj.x,
                              top: obj.y,
                              width: obj.width,
                              height: obj.height,
                              opacity: obj.opacity ?? 1,
                              transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
                            }}
                          >
                            {obj.type === "rect" && (
                              <div style={{ width: "100%", height: "100%", backgroundColor: obj.fill || "transparent", borderRadius: obj.borderRadius || 0, border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : undefined }} />
                            )}
                            {obj.type === "circle" && (
                              <div style={{ width: "100%", height: "100%", backgroundColor: obj.fill || "transparent", borderRadius: "50%", border: obj.stroke ? `${obj.strokeWidth || 1}px solid ${obj.stroke}` : undefined }} />
                            )}
                            {obj.type === "text" && (
                              <div style={{ fontSize: obj.fontSize || 14, fontWeight: obj.fontWeight || "normal", color: obj.fill || "#000", fontFamily: obj.fontFamily || "Inter", textAlign: (obj.textAlign as any) || "left", lineHeight: 1.4, overflow: "hidden", wordBreak: "break-word" }}>
                                {obj.content}
                              </div>
                            )}
                            {obj.type === "image" && obj.src && (
                              <img src={obj.src} alt={obj.tag === "brand-logo" ? "Brand logo" : "Product image"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: obj.tag === "brand-logo" ? "contain" : "cover", filter: obj.filter || undefined }} />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
        <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-guided-heading">{t("pages.productBuilder.createYourProduct")}</h2>
            <p className="text-sm text-gray-500">{t("pages.productBuilder.chooseATemplateConfigureOptions")}</p>
          </div>

          {generating && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm" data-testid="section-stepper">
              <div className="flex items-center justify-between mb-4">
                {STEPS_ORDER.filter(s => s !== "done").map((s, i) => {
                  const isActive = s === compileStep;
                  const isDone = stepIndex > i;
                  const skip = s === "images" && !includeImages;
                  const skipSR = s === "store-ready" && !autoStoreReady;
                  if (skip || skipSR) return null;
                  return (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isDone ? "bg-green-500 text-white" : isActive ? "bg-primary text-white ring-2 ring-primary/30 animate-pulse" : "bg-gray-200 text-gray-500"}`}>
                        {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-medium hidden sm:block ${isActive ? "text-primary" : isDone ? "text-green-600" : "text-gray-400"}`}>{STEP_LABELS[s]}</span>
                      {i < 4 && <div className={`flex-1 h-0.5 mx-1 ${isDone ? "bg-green-400" : "bg-gray-200"}`} />}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-gray-600">{stepLabel}</span>
              </div>
              {compiledPages > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (compiledPages / Math.max(targetPages, 1)) * 100)}%` }} />
                </div>
              )}
            </div>
          )}

          {lastError && !generating && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-3" data-testid="section-error">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-red-700 block">
                    {lastError.startsWith("EMPTY_SECTION") ? "Empty Section Detected" : lastError.startsWith("QUESTION_BATCH") ? "Question Generation Failed" : "Compilation Error"}
                  </span>
                  <span className="text-xs text-red-600 block mt-1">
                    {lastError.startsWith("EMPTY_SECTION") ? lastError.split("\n\n")[0].replace("EMPTY_SECTION: ", "") : lastError.substring(0, 300)}
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={compileDocument} className="shrink-0 text-xs" data-testid="button-retry">{t("pages.productBuilder.retry")}</Button>
              </div>
              {lastError.includes("Section report:") && (
                <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                  <span className="text-[10px] font-semibold text-red-700 block mb-1.5">{t("pages.productBuilder.sectionValidationReport")}</span>
                  <pre className="text-[10px] text-red-600 whitespace-pre-wrap font-mono leading-relaxed" data-testid="text-section-report">
                    {lastError.split("Section report:")[1]?.split("\n\nRaw model")[0] || ""}
                  </pre>
                </div>
              )}
              {lastError.includes("Raw model output") && (
                <details className="bg-white/60 rounded-lg p-3 border border-red-100">
                  <summary className="text-[10px] font-semibold text-red-700 cursor-pointer">{t("pages.productBuilder.rawModelOutputDebug")}</summary>
                  <pre className="text-[9px] text-gray-600 whitespace-pre-wrap font-mono mt-2 max-h-[200px] overflow-auto leading-relaxed" data-testid="text-raw-preview">
                    {lastError.split("Raw model output (first 1500 chars):")[1]?.substring(0, 1500) || ""}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="space-y-2" data-testid="section-template-select">
            <label className="text-sm font-semibold text-gray-700 block">{t("pages.productBuilder.template")}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TEMPLATE_BLUEPRINTS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  disabled={generating}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${template === t.id ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
                  data-testid={`button-template-${t.id}`}
                >
                  <span className="text-2xl block mb-2">{t.icon}</span>
                  <span className="text-sm font-semibold text-gray-800 block">{t.label}</span>
                  <span className="text-[10px] text-gray-500 block mt-1 leading-tight">{t.description.slice(0, 60)}...</span>
                  <span className="text-[10px] text-primary font-medium block mt-2">{t.minPages}-{t.maxPages} pages</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="space-y-2" data-testid="section-topic">
                <label className="text-sm font-semibold text-gray-700 block">{t("pages.productBuilder.documentTitle")}</label>
                <Input
                  value={topic}
                  onChange={e => handleTopicChange(e.target.value)}
                  placeholder="e.g., Electrolyte Imbalances, Cardiac Assessment"
                  className="h-10 text-sm"
                  disabled={generating}
                  data-testid="input-guided-topic"
                />
              </div>
              <div className="space-y-2" data-testid="section-ai-prompt">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-primary" />
                  AI Prompt
                </label>
                <Textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder={"Describe what you want the AI to generate. Be as specific as you like.\n\nExamples:\n• \"Create a comprehensive study guide about shock types for NCLEX-RN with emphasis on pathophysiology, nursing interventions, and medication management\"\n• \"Explain the differences between Type 1 and Type 2 diabetes including labs, meds, patient teaching, and common NCLEX traps\"\n• \"Build a cardiac assessment review covering heart sounds, ECG interpretation, and emergency interventions\""}
                  className="text-sm min-h-[120px] resize-y"
                  disabled={generating}
                  data-testid="input-guided-prompt"
                />
                <p className="text-[11px] text-gray-400">{t("pages.productBuilder.theAiWillUseYour")}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2" data-testid="section-tier">
                  <label className="text-sm font-semibold text-gray-700 block">{t("pages.productBuilder.examTier")}</label>
                  <select value={examTier} onChange={e => setExamTier(e.target.value)} disabled={generating} className="w-full h-10 rounded-lg border px-3 text-sm" data-testid="select-guided-tier">
                    {GUIDED_EXAM_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2" data-testid="section-region">
                  <label className="text-sm font-semibold text-gray-700 block">{t("pages.productBuilder.region")}</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} disabled={generating} className="w-full h-10 rounded-lg border px-3 text-sm" data-testid="select-guided-region">
                    <option value="BOTH">{t("pages.productBuilder.caUsBoth")}</option>
                    <option value="CA">{t("pages.productBuilder.canadaOnly")}</option>
                    <option value="US">{t("pages.productBuilder.usOnly")}</option>
                  </select>
                </div>
              </div>

              {bp.questionPrimary ? (
                <div className="space-y-2 p-4 rounded-xl bg-gray-50 border" data-testid="section-questions">
                  <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>{t("pages.productBuilder.numberOfQuestions")}</span>
                    <span className="text-primary font-bold">{questionCount}</span>
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <Input
                      type="number"
                      min={bp.minQuestionCount || 5}
                      max={5000}
                      value={questionCount}
                      onChange={e => {
                        const val = Number(e.target.value);
                        const minQ = bp.minQuestionCount || 5;
                        setQuestionCount(val < minQ ? minQ : val);
                      }}
                      disabled={generating}
                      className="w-28 h-8 text-xs"
                      data-testid="input-question-count"
                    />
                    {bp.minQuestionCount && bp.minQuestionCount > 5 && (
                      <span className="text-[10px] text-amber-600 font-medium">Min {bp.minQuestionCount} for {bp.label}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{t("pages.productBuilder.pagesAreCalculatedAutomaticallyFrom")}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2" data-testid="section-pages">
                    <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>{t("pages.productBuilder.targetPages")}</span>
                      <span className="text-primary font-bold">{targetPages}</span>
                    </label>
                    <input
                      type="range"
                      min={bp.minPages}
                      max={bp.maxPages}
                      value={targetPages}
                      onChange={e => setTargetPages(Number(e.target.value))}
                      disabled={generating}
                      className="w-full h-2 accent-primary"
                      data-testid="slider-guided-pages"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>{bp.minPages} min</span>
                      <span>~{totalChars.toLocaleString()} chars budget</span>
                      <span>{bp.maxPages} max</span>
                    </div>
                  </div>

                  {bp.includesQuestions && (
                    <div className="space-y-2 p-4 rounded-xl bg-gray-50 border" data-testid="section-questions">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={includeQuestions} onChange={e => setIncludeQuestions(e.target.checked)} disabled={generating} className="rounded" data-testid="checkbox-include-questions" />
                        <span className="text-sm font-medium text-gray-700">{t("pages.productBuilder.includePracticeQuestions")}</span>
                      </label>
                      {includeQuestions && (
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">{t("pages.productBuilder.count")}</span>
                          <Input
                            type="number"
                            min={bp.minQuestionCount || 5}
                            max={5000}
                            value={questionCount}
                            onChange={e => {
                              const val = Number(e.target.value);
                              const minQ = bp.minQuestionCount || 5;
                              setQuestionCount(val < minQ ? minQ : val);
                            }}
                            disabled={generating}
                            className="w-24 h-8 text-xs"
                            data-testid="input-question-count"
                          />
                          {bp.minQuestionCount && bp.minQuestionCount > 5 && (
                            <span className="text-[10px] text-amber-600 font-medium">Min {bp.minQuestionCount} for {bp.label}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2 p-4 rounded-xl bg-gray-50 border" data-testid="section-images">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={includeImages} onChange={e => setIncludeImages(e.target.checked)} disabled={generating} className="rounded" data-testid="checkbox-include-images" />
                  <span className="text-sm font-medium text-gray-700">{t("pages.productBuilder.includeImages")}</span>
                  <span className="text-[10px] text-gray-400">({bp.imageSlots.length} slots)</span>
                </label>
                {includeImages && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">{t("pages.productBuilder.intensity")}</span>
                    <select value={imageIntensity} onChange={e => setImageIntensity(e.target.value as any)} disabled={generating} className="h-8 rounded-lg border px-2 text-xs" data-testid="select-image-intensity">
                      <option value="low">{t("pages.productBuilder.lowUpTo6")}</option>
                      <option value="medium">{t("pages.productBuilder.mediumUpTo12")}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2" data-testid="section-theme">
                <label className="text-sm font-semibold text-gray-700 block">{t("pages.productBuilder.colorTheme")}</label>
                <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      disabled={generating}
                      className={`p-3 rounded-xl border-2 flex items-center gap-3 transition ${themeId === t.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
                      data-testid={`button-theme-${t.id}`}
                    >
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: t.primaryColor }} />
                        <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: t.secondaryColor }} />
                        <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: t.accentColor }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2" data-testid="section-cover-preset">
                <label className="text-sm font-semibold text-gray-700 block">{t("pages.productBuilder.coverStyle")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {COVER_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setCoverPreset(p.id)}
                      disabled={generating}
                      className={`h-12 rounded-xl border-2 text-xs font-medium transition flex items-center justify-center gap-2 ${coverPreset === p.id ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                      data-testid={`button-guided-cover-${p.id}`}
                    >
                      <div className="w-6 h-4 rounded-sm" style={{ background: p.bgStyle === "gradient" ? `linear-gradient(135deg, ${theme.coverBg}, ${theme.primaryColor})` : p.bgStyle === "split" ? `linear-gradient(180deg, ${theme.coverBg} 50%, ${theme.accentColor} 50%)` : theme.coverBg }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-gray-50 border" data-testid="section-store-ready">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={autoStoreReady} onChange={e => setAutoStoreReady(e.target.checked)} disabled={generating} className="rounded" data-testid="checkbox-auto-store-ready" />
                  <span className="text-sm font-medium text-gray-700">{t("pages.productBuilder.autoStorereadyAfterCompile")}</span>
                </label>
                <p className="text-[10px] text-gray-400 mt-1">{t("pages.productBuilder.normalizeSpacingSafeMarginsAnd")}</p>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2" data-testid="section-plan-preview">
                <span className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.blueprintPreview")}</span>
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-400 mb-1">Page flow: {bp.pageFlow.length} steps</div>
                  {bp.sections.filter(s => s.id !== "practice-questions" && s.id !== "rationales").map(s => {
                    const charBudget = budgets[s.id] || 0;
                    const approxPages = Math.max(1, Math.round(charBudget / bp.charsPerPage));
                    return (
                      <div key={s.id} className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600">{s.label}</span>
                        <span className="text-gray-400">~{charBudget.toLocaleString()} chars / {approxPages} pg</span>
                      </div>
                    );
                  })}
                  {includeQuestions && (
                    <div className="flex items-center justify-between text-[11px] text-blue-600">
                      <span>{t("pages.productBuilder.practiceQuestionsRationales")}</span>
                      <span>{questionCount} Qs</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-primary border-t pt-1 mt-1">
                    <span>{t("pages.productBuilder.totalTarget")}</span>
                    <span>~{targetPages} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4" data-testid="section-generate">
            <Button
              onClick={compileDocument}
              disabled={generating || !topic.trim()}
              className="h-14 px-10 text-base font-semibold gap-2 rounded-2xl shadow-lg"
              data-testid="button-generate-draft"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {generating ? "Compiling..." : `Generate ${bp.label} Draft`}
            </Button>

          </div>

        </div>
      </div>
        )}
      </div>

      {showGuidedPublish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowGuidedPublish(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()} data-testid="dialog-guided-publish">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{t("pages.productBuilder.publishToStore")}</h3>
              <button onClick={() => setShowGuidedPublish(false)} className="text-gray-400 hover:text-gray-600 text-xl">{t("pages.productBuilder.times")}</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{t("pages.productBuilder.productTitle")}</label>
                <Input
                  value={guidedPublishForm.title}
                  onChange={e => setGuidedPublishForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={project?.title || "Enter product title"}
                  data-testid="input-guided-publish-title"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{t("pages.productBuilder.description")}</label>
                <Textarea
                  value={guidedPublishForm.description}
                  onChange={e => setGuidedPublishForm(f => ({ ...f, description: e.target.value }))}
                  placeholder={t("pages.productBuilder.shortDescriptionOfTheProduct")}
                  rows={3}
                  data-testid="input-guided-publish-desc"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{t("pages.productBuilder.priceUsd")}</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={guidedPublishForm.price}
                    onChange={e => setGuidedPublishForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="9.99"
                    data-testid="input-guided-publish-price"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{t("pages.productBuilder.category")}</label>
                  <select
                    value={guidedPublishForm.category}
                    onChange={e => setGuidedPublishForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full h-9 rounded-lg border px-2 text-sm"
                    data-testid="select-guided-publish-category"
                  >
                    <option>{t("pages.productBuilder.cramGuide")}</option>
                    <option>{t("pages.productBuilder.studyBundle")}</option>
                    <option>{t("pages.productBuilder.flashcardDeck")}</option>
                    <option>{t("pages.productBuilder.questionBank")}</option>
                    <option>{t("pages.productBuilder.reviewSheet")}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowGuidedPublish(false)} className="flex-1">{t("pages.productBuilder.cancel")}</Button>
              <Button
                onClick={publishGuidedToStore}
                disabled={guidedPublishing || !guidedPublishForm.title.trim() || !guidedPublishForm.price}
                className="flex-1 bg-green-600 hover:bg-green-700 gap-1.5"
                data-testid="button-guided-publish-confirm"
              >
                {guidedPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CanvasEditorView({ projectId, onBack, initialPresetType }: { projectId: string; onBack: () => void; initialPresetType?: string | null }) {
  const { toast } = useToast();
  const [project, setProject] = useState<DesignProject | null>(null);
  const [pages, setPages] = useState<DesignPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishForm, setPublishForm] = useState({ title: "", description: "", price: "", category: "Cram Guide" });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [undoStack, setUndoStack] = useState<CanvasObject[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasObject[][]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastThemeIdRef = useRef("soft-clinical");

  const [showGrid, setShowGrid] = useState(false);
  const [showMargins, setShowMargins] = useState(true);
  const [brandLock, setBrandLock] = useState(true);
  const [brandVerified, setBrandVerified] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState("soft-clinical");
  const [showLogo, setShowLogo] = useState(true);
  const [leftPanel, setLeftPanel] = useState<"tools" | "components" | "templates" | "ai" | "imagelab" | "brand" | "blocks" | null>("tools");
  const [zoom, setZoom] = useState(85);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [aiTopic, setAiTopic] = useState("");
  const [aiPromptCanvas, setAiPromptCanvas] = useState("");
  const [aiTier, setAiTier] = useState("rn");
  const [aiExamTarget, setAiExamTarget] = useState("nclex-rn");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgNegative, setImgNegative] = useState("");
  const [imgTextFree, setImgTextFree] = useState(true);
  const [imgSize, setImgSize] = useState("1024x1024");
  const [imgCount, setImgCount] = useState(1);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgResults, setImgResults] = useState<{ id: string; url: string }[]>([]);
  const [pageThumbs, setPageThumbs] = useState<Record<string, string>>({});
  const [coverPresetId, setCoverPresetId] = useState("soft-pastel");
  const [autoStoreReady, setAutoStoreReady] = useState(true);
  const [aiStatus, setAiStatus] = useState<{ enabled: boolean; usage: { itemsGenerated: number; tokensUsed: number }; model: string } | null>(null);
  const [tbQuestionCount, setTbQuestionCount] = useState(25);
  const [tbDifficulty, setTbDifficulty] = useState("mixed");
  const [tbQuestionTypes, setTbQuestionTypes] = useState<string[]>(["multiple-choice", "select-all", "ordered-response"]);
  const [tbLoading, setTbLoading] = useState(false);
  const [tbResult, setTbResult] = useState<any>(null);
  const [tbPreviewOpen, setTbPreviewOpen] = useState(false);
  const [tbPublishing, setTbPublishing] = useState(false);
  const [tbPrice, setTbPrice] = useState("14.99");
  const [tbRenderMode, setTbRenderMode] = useState<"full" | "questions-only">("full");
  const [tbExportingPdf, setTbExportingPdf] = useState(false);
  const [tbAudit, setTbAudit] = useState<{ ok: boolean; requestedCount: number; generatedCount: number; countMatch: boolean; byType: Record<string, number>; byCategory: Record<string, number>; errors: string[] } | null>(null);
  const [bundleTargetPages, setBundleTargetPages] = useState(30);
  const [bundleProgress, setBundleProgress] = useState<{ step: string; current: number; total: number } | null>(null);
  const [brandLogos, setBrandLogos] = useState<{ url: string; fileName: string }[]>(() => {
    try {
      const saved = localStorage.getItem("nursenest-brand-logos");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoColor, setLogoColor] = useState<string>("original");

  const theme = getTheme(activeThemeId);
  const themePalette = [
    theme.primaryColor, theme.secondaryColor, theme.accentColor,
    theme.backgroundColor, theme.sectionBg, theme.sectionBgAlt,
    theme.headingColor, theme.bodyColor, theme.bodyColorLight,
    theme.dangerColor, theme.successColor, theme.warningColor,
    theme.badgeBg, theme.badgeText, theme.pearlBg, theme.pearlBorder,
    theme.flagBg, theme.flagBorder, theme.coverBg, theme.coverBgOverlay,
    "#ffffff", "#fff", "#000", "#000000",
  ];

  const CANVAS_WIDTH = 612;
  const CANVAS_HEIGHT = 792;
  const SCALE = zoom / 100;
  const MARGIN = 46;
  const GRID_SIZE = 20;

  const zoomIn = () => setZoom(z => Math.min(200, z + 10));
  const zoomOut = () => setZoom(z => Math.max(25, z - 10));
  const zoomFit = () => setZoom(85);
  const zoomActual = () => setZoom(100);

  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;
  const setSelectedId = (id: string | null) => setSelectedIds(id ? [id] : []);

  const toggleSelect = (id: string, shift: boolean) => {
    if (shift) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const bringForward = () => {
    if (selectedIds.length === 0) return;
    pushUndo();
    const maxZ = Math.max(...objects.map(o => o.zIndex));
    setObjects(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, zIndex: Math.min(maxZ + 1, o.zIndex + 1) } : o));
  };

  const sendBackward = () => {
    if (selectedIds.length === 0) return;
    pushUndo();
    setObjects(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, zIndex: Math.max(0, o.zIndex - 1) } : o));
  };

  const bringToFront = () => {
    if (selectedIds.length === 0) return;
    pushUndo();
    const maxZ = Math.max(...objects.map(o => o.zIndex));
    setObjects(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, zIndex: maxZ + 1 } : o));
  };

  const sendToBack = () => {
    if (selectedIds.length === 0) return;
    pushUndo();
    setObjects(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, zIndex: 0 } : o));
  };

  const toggleLockSelected = () => {
    if (selectedIds.length === 0) return;
    pushUndo();
    const firstObj = objects.find(o => o.id === selectedIds[0]);
    const newLocked = !firstObj?.locked;
    setObjects(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, locked: newLocked } : o));
    toast({ title: newLocked ? "Locked" : "Unlocked" });
  };

  const selectGroupOfObject = (objId: string): string[] => {
    const obj = objects.find(o => o.id === objId);
    if (!obj?.groupId) return [objId];
    return objects.filter(o => o.groupId === obj.groupId).map(o => o.id);
  };

  const getGroupIdsFromSelection = (): Set<string> => {
    const ids = new Set<string>();
    for (const o of objects) {
      if (selectedIds.includes(o.id) && o.groupId) ids.add(o.groupId);
    }
    return ids;
  };

  const groupSelected = () => {
    if (selectedIds.length < 2) {
      toast({ title: "Select 2+ elements to group", variant: "destructive" });
      return;
    }
    const locked = objects.find(o => selectedIds.includes(o.id) && o.locked);
    if (locked) {
      toast({ title: "Locked element", description: "Unlock before grouping", variant: "destructive" });
      return;
    }
    pushUndo();
    const newGroupId = gid();
    setObjects(prev => prev.map(o =>
      selectedIds.includes(o.id) ? { ...o, groupId: newGroupId } : o
    ));
    toast({ title: "Grouped" });
  };

  const ungroupSelected = () => {
    const groupIds = getGroupIdsFromSelection();
    if (groupIds.size === 0) {
      toast({ title: "No groups selected", variant: "destructive" });
      return;
    }
    pushUndo();
    setObjects(prev => prev.map(o =>
      o.groupId && groupIds.has(o.groupId) ? { ...o, groupId: undefined } : o
    ));
    toast({ title: "Ungrouped" });
  };

  const duplicatePage = async (index: number) => {
    const srcPage = pages[index];
    if (!srcPage) return;
    const res = await adminFetch(`/api/admin/design-projects/${projectId}/pages`, {
      method: "POST",
      body: {},
    });
    if (res.ok) {
      const newPage = await res.json();
      const srcData = index === currentPageIndex ? { objects } : srcPage.canvasJson;
      await adminFetch(`/api/admin/design-pages/${newPage.id}`, {
        method: "PUT",
        body: { canvasJson: srcData || { objects: [], version: "1.0" }, backgroundColor: srcPage.backgroundColor },
      });
      newPage.canvasJson = srcData;
      newPage.backgroundColor = srcPage.backgroundColor;
      setPages(prev => [...prev, newPage]);
      toast({ title: "Page duplicated" });
    }
  };

  useEffect(() => {
    adminFetch(`/api/admin/design-projects/${projectId}`)
      .then(r => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(data => {
        setProject(data);
        setPages(data.pages || []);
        if (data.pages?.length > 0) {
          const pageData = data.pages[0].canvasJson;
          setObjects(pageData?.objects || []);
        }
      })
      .catch(() => {});
  }, [projectId]);

  const presetAppliedRef = useRef(false);
  useEffect(() => {
    if (!initialPresetType || !project || presetAppliedRef.current) return;
    const presetMap: Record<string, string> = {
      "bundle": "cram-guide",
      "cram": "cram-guide",
      "cram-guide": "cram-guide",
      "question-pack": "question-pack",
      "cheat-sheet": "quick-reference",
      "study-plan": "study-plan",
      "quick-reference": "quick-reference",
    };
    const presetId = presetMap[initialPresetType];
    if (presetId && objects.length === 0) {
      presetAppliedRef.current = true;
      loadProductPreset(presetId);
    }
  }, [initialPresetType, project]);

  const saveCanvas = useCallback(async () => {
    if (!pages[currentPageIndex]) return;
    setSaving(true);
    try {
      await adminFetch(`/api/admin/design-pages/${pages[currentPageIndex].id}`, {
        method: "PUT",
        body: { canvasJson: { objects, version: "1.0" }, backgroundColor: pages[currentPageIndex].backgroundColor },
      });
      setLastSavedAt(new Date());
    } catch (e) {}
    setSaving(false);
  }, [objects, pages, currentPageIndex]);

  useEffect(() => {
    try { localStorage.setItem("nursenest-brand-logos", JSON.stringify(brandLogos)); } catch {}
  }, [brandLogos]);

  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => { saveCanvas(); }, 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [objects, saveCanvas]);

  const deepCloneObjects = (arr: CanvasObject[]) => arr.map(o => ({ ...o }));

  const pushUndo = () => {
    setUndoStack(prev => [...prev.slice(-20), deepCloneObjects(objects)]);
    setRedoStack([]);
  };

  const undo = () => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setRedoStack(r => [...r, deepCloneObjects(objects)]);
      setObjects(last);
      return next;
    });
  };

  const redo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setUndoStack(u => [...u, deepCloneObjects(objects)]);
      setObjects(last);
      return next;
    });
  };

  const addObject = (type: CanvasObject["type"]) => {
    pushUndo();
    const id = uid();
    const base = { id, x: MARGIN, y: 50, rotation: 0, opacity: 1, zIndex: objects.length };
    let obj: CanvasObject;
    switch (type) {
      case "text":
        obj = { ...base, type: "text", width: CANVAS_WIDTH - MARGIN * 2, height: 40, content: "New Text", fontSize: 18, fontFamily: BRAND.fontBody, fontWeight: "normal", fill: BRAND.textDark, textAlign: "left" };
        break;
      case "rect":
        obj = { ...base, type: "rect", width: 150, height: 100, fill: "#e2e8f0", stroke: "#94a3b8", strokeWidth: 1, borderRadius: 8 };
        break;
      case "circle":
        obj = { ...base, type: "circle", width: 100, height: 100, fill: "#e2e8f0", stroke: "#94a3b8", strokeWidth: 1 };
        break;
      case "image":
        obj = { ...base, type: "image", width: 200, height: 200, src: "" };
        break;
      default: return;
    }
    setObjects(prev => [...prev, obj]);
    setSelectedId(id);
  };

  const updateObject = (id: string, updates: Partial<CanvasObject>) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    const lockedObj = objects.find(o => selectedIds.includes(o.id) && o.locked);
    if (lockedObj) {
      toast({ title: "Locked element", description: "Unlock elements before deleting", variant: "destructive" });
      return;
    }
    if (brandLock && objects.some(o => selectedIds.includes(o.id) && o.tag === "brand-logo")) {
      toast({ title: "Logo protected", description: "Disable Brand Lock to remove the logo", variant: "destructive" });
      return;
    }
    pushUndo();
    setObjects(prev => prev.filter(o => !selectedIds.includes(o.id)));
    setSelectedIds([]);
  };

  const duplicateSelected = () => {
    if (!selectedId) return;
    const obj = objects.find(o => o.id === selectedId);
    if (!obj) return;
    pushUndo();
    const newObj = { ...obj, id: uid(), x: obj.x + 20, y: obj.y + 20, zIndex: objects.length };
    setObjects(prev => [...prev, newObj]);
    setSelectedId(newObj.id);
  };

  const insertDesignComponent = (comp: typeof DESIGN_COMPONENTS[0]) => {
    pushUndo();
    const baseY = 50 + objects.length * 10;
    const newObjs = comp.objects.map((partial, i) => ({
      ...partial,
      id: uid(),
      x: MARGIN + (partial.x || 0),
      y: baseY + (partial.y || 0),
      rotation: 0,
      opacity: 1,
      zIndex: objects.length + i,
      tag: comp.tag,
    } as CanvasObject));
    setObjects(prev => [...prev, ...newObjs]);
    setSelectedId(newObjs[0]?.id || null);
    toast({ title: `${comp.label} added` });
  };

  const insertStockIllustration = (illust: typeof STOCK_ILLUSTRATIONS[0]) => {
    pushUndo();
    const svgBlob = new Blob([illust.svg], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const viewBoxMatch = illust.svg.match(/viewBox="([^"]+)"/);
    let w = 100, h = 100;
    if (viewBoxMatch) {
      const parts = viewBoxMatch[1].split(/\s+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        const aspect = parts[2] / parts[3];
        w = aspect >= 1 ? 120 : Math.round(120 * aspect);
        h = aspect >= 1 ? Math.round(120 / aspect) : 120;
      }
    }
    const obj: CanvasObject = {
      id: uid(), type: "image", x: CANVAS_WIDTH / 2 - w / 2, y: CANVAS_HEIGHT / 2 - h / 2,
      width: w, height: h, src: svgUrl, rotation: 0, opacity: 1, zIndex: objects.length,
      tag: `illust-${illust.id}`,
    };
    setObjects(prev => [...prev, obj]);
    setSelectedId(obj.id);
    toast({ title: `${illust.label} added` });
  };

  const applyPageTemplate = (template: typeof PAGE_TEMPLATES[0]) => {
    if (objects.length > 0 && !confirm("Replace current page content with this template?")) return;
    pushUndo();
    const newObjs = template.generate(CANVAS_WIDTH, CANVAS_HEIGHT);
    setObjects(newObjs);
    toast({ title: `${template.label} template applied` });
  };

  const globalThemeColorIndex = (() => {
    const idx = new Map<string, keyof ThemeConfig>();
    const colorKeys: (keyof ThemeConfig)[] = [
      "primaryColor","secondaryColor","accentColor","backgroundColor","sectionBg","sectionBgAlt",
      "headingColor","bodyColor","bodyColorLight","dangerColor","successColor","warningColor",
      "dividerColor","badgeBg","badgeText","tableBorderColor","tableRowEven","tableRowOdd",
      "pearlBg","pearlBorder","flagBg","flagBorder","coverBg","coverBgOverlay",
    ];
    const skip = new Set(["#ffffff","#fff","#000","#000000","transparent"]);
    for (const t of THEMES) {
      for (const k of colorKeys) {
        const v = (t[k] as string) || "";
        if (v && !skip.has(v.trim().toLowerCase())) idx.set(v.trim().toLowerCase(), k);
      }
    }
    return idx;
  })();

  const mapColorToTheme = (color: string | undefined, oldTheme: ThemeConfig, newTheme: ThemeConfig): string | undefined => {
    if (!color) return color;
    const c = color.toLowerCase();
    const mapping: [string, keyof ThemeConfig][] = [
      [oldTheme.primaryColor, "primaryColor"], [oldTheme.secondaryColor, "secondaryColor"],
      [oldTheme.accentColor, "accentColor"], [oldTheme.backgroundColor, "backgroundColor"],
      [oldTheme.sectionBg, "sectionBg"], [oldTheme.sectionBgAlt, "sectionBgAlt"],
      [oldTheme.headingColor, "headingColor"], [oldTheme.bodyColor, "bodyColor"],
      [oldTheme.bodyColorLight, "bodyColorLight"], [oldTheme.dangerColor, "dangerColor"],
      [oldTheme.successColor, "successColor"], [oldTheme.warningColor, "warningColor"],
      [oldTheme.badgeBg, "badgeBg"], [oldTheme.badgeText, "badgeText"],
      [oldTheme.pearlBg, "pearlBg"], [oldTheme.pearlBorder, "pearlBorder"],
      [oldTheme.flagBg, "flagBg"], [oldTheme.flagBorder, "flagBorder"],
      [oldTheme.coverBg, "coverBg"], [oldTheme.coverBgOverlay, "coverBgOverlay"],
      [oldTheme.dividerColor, "dividerColor"], [oldTheme.tableBorderColor, "tableBorderColor"],
      [oldTheme.tableRowEven, "tableRowEven"], [oldTheme.tableRowOdd, "tableRowOdd"],
    ];
    for (const [oldColor, key] of mapping) {
      if (c === oldColor.toLowerCase()) return newTheme[key] as string;
    }
    const globalKey = globalThemeColorIndex.get(c);
    if (globalKey) return newTheme[globalKey] as string;
    return color;
  };

  const applyThemeToObjects = (objs: CanvasObject[], oldTheme: ThemeConfig, newTheme: ThemeConfig): CanvasObject[] => {
    return objs.map(obj => {
      const updated = { ...obj };
      updated.fill = mapColorToTheme(obj.fill, oldTheme, newTheme);
      updated.stroke = mapColorToTheme(obj.stroke, oldTheme, newTheme);
      if (obj.type === "text") {
        const isHeading = (obj.fontSize || 0) >= 18 || obj.fontWeight === "bold";
        updated.fontFamily = isHeading ? newTheme.headingFont : newTheme.bodyFont;
      }
      if (obj.tag === "brand-logo" && obj.type === "image" && obj.filter) {
        updated.filter = `brightness(0) saturate(100%) ${hexToCssFilter(newTheme.primaryColor)}`;
      }
      if (obj.tag === "brand-logo" && obj.type === "text") {
        updated.fill = newTheme.accentColor;
      }
      return updated;
    });
  };

  const switchTheme = async (newThemeId: string) => {
    const oldTheme = getTheme(activeThemeId);
    const newTheme = getTheme(newThemeId);
    if (oldTheme.id === newTheme.id) return;
    lastThemeIdRef.current = oldTheme.id;
    pushUndo();
    const themedCurrent = applyThemeToObjects(objects, oldTheme, newTheme);
    setObjects(themedCurrent);
    setActiveThemeId(newThemeId);

    try {
      const curPage = pages[currentPageIndex];
      if (curPage) {
        await adminFetch(`/api/admin/design-pages/${curPage.id}`, {
          method: "PUT",
          body: { canvasJson: { objects: themedCurrent, version: "1.0" }, backgroundColor: curPage.backgroundColor },
        });
      }
    } catch {}

    let updatedOther = 0;
    for (let i = 0; i < pages.length; i++) {
      if (i === currentPageIndex) continue;
      const pageObjects: CanvasObject[] = pages[i]?.canvasJson?.objects || [];
      if (pageObjects.length === 0) continue;
      const themed = applyThemeToObjects(pageObjects, oldTheme, newTheme);
      try {
        await adminFetch(`/api/admin/design-pages/${pages[i].id}`, {
          method: "PUT",
          body: { canvasJson: { objects: themed, version: "1.0" }, backgroundColor: pages[i].backgroundColor },
        });
        setPages(prev => {
          const next = [...prev];
          next[i] = { ...next[i], canvasJson: { objects: themed, version: "1.0" } };
          return next;
        });
        updatedOther++;
      } catch {}
    }
    toast({ title: `Theme: ${newTheme.name}`, description: `All ${pages.length} page(s) updated` });
  };

  const THEME_KEYS: (keyof ThemeConfig)[] = [
    "primaryColor","secondaryColor","accentColor",
    "backgroundColor","sectionBg","sectionBgAlt",
    "headingColor","bodyColor","bodyColorLight",
    "dangerColor","successColor","warningColor",
    "dividerColor","badgeBg","badgeText",
    "tableBorderColor","tableRowEven","tableRowOdd",
    "pearlBg","pearlBorder","flagBg","flagBorder",
    "coverBg","coverBgOverlay",
  ];

  const themeColorIndex = (() => {
    const idx = new Map<string, keyof ThemeConfig>();
    for (const t of THEMES) {
      for (const k of THEME_KEYS) {
        const v = (t[k] as string) || "";
        if (v) idx.set(v.trim().toLowerCase(), k);
      }
    }
    return idx;
  })();

  const mapColorToActiveTheme = (color: string | undefined, active: ThemeConfig): string | undefined => {
    if (!color) return color;
    const key = themeColorIndex.get(color.trim().toLowerCase());
    if (!key) return color;
    return active[key] as string;
  };

  const applyActiveThemeToObjects = (objs: CanvasObject[], active: ThemeConfig): CanvasObject[] => {
    return objs.map(obj => {
      const updated = { ...obj };
      updated.fill = mapColorToActiveTheme(obj.fill, active);
      updated.stroke = mapColorToActiveTheme(obj.stroke, active);
      if (obj.type === "text") {
        const isHeading = (obj.fontSize || 0) >= 18 || obj.fontWeight === "bold";
        updated.fontFamily = isHeading ? active.headingFont : active.bodyFont;
      }
      if (obj.tag === "brand-logo" && obj.type === "image" && obj.filter) {
        updated.filter = `brightness(0) saturate(100%) ${hexToCssFilter(active.primaryColor)}`;
      }
      if (obj.tag === "brand-logo" && obj.type === "text") {
        updated.fill = active.primaryColor;
      }
      return updated;
    });
  };

  const forceApplyTheme = (objs: CanvasObject[], target: ThemeConfig): CanvasObject[] => {
    return objs.map(obj => {
      const updated = { ...obj };
      if (updated.fill) {
        const key = globalThemeColorIndex.get(updated.fill.trim().toLowerCase());
        if (key) updated.fill = target[key] as string;
      }
      if (updated.stroke) {
        const key = globalThemeColorIndex.get(updated.stroke.trim().toLowerCase());
        if (key) updated.stroke = target[key] as string;
      }
      if (obj.type === "text") {
        const isHeading = (obj.fontSize || 0) >= 18 || obj.fontWeight === "bold";
        updated.fontFamily = isHeading ? target.headingFont : target.bodyFont;
      }
      if (obj.tag === "brand-logo" && obj.type === "image" && obj.filter) {
        updated.filter = `brightness(0) saturate(100%) ${hexToCssFilter(target.primaryColor)}`;
      }
      if (obj.tag === "brand-logo" && obj.type === "text") {
        updated.fill = target.primaryColor;
      }
      return updated;
    });
  };

  const applyThemeToAllPages = async () => {
    const active = getTheme(activeThemeId);
    await saveCanvas();
    let updatedCount = 0;
    for (let i = 0; i < pages.length; i++) {
      const isCurrent = i === currentPageIndex;
      const pageObjects: CanvasObject[] = isCurrent
        ? objects
        : (pages[i]?.canvasJson?.objects || []);
      if (!pageObjects || pageObjects.length === 0) continue;
      const themed = forceApplyTheme(pageObjects, active);
      if (isCurrent) {
        pushUndo();
        setObjects(themed);
      }
      try {
        await adminFetch(`/api/admin/design-pages/${pages[i].id}`, {
          method: "PUT",
          body: { canvasJson: { objects: themed, version: "1.0" }, backgroundColor: pages[i].backgroundColor },
        });
        setPages(prev => {
          const next = [...prev];
          next[i] = { ...next[i], canvasJson: { objects: themed, version: "1.0" } };
          return next;
        });
        updatedCount++;
      } catch {}
    }
    toast({ title: "Theme applied to all pages", description: `${updatedCount} page(s) updated` });
  };

  const insertLogoFooter = () => {
    pushUndo();
    const logoExists = objects.some(o => o.tag === "brand-logo");
    if (logoExists) return;
    const uploadedLogo = brandLogos.length > 0 ? brandLogos[0] : null;
    if (uploadedLogo) {
      const logoObj: CanvasObject = {
        id: uid(), type: "image" as const,
        x: CANVAS_WIDTH / 2 - 80, y: CANVAS_HEIGHT - 60,
        width: 160, height: 50,
        src: uploadedLogo.url,
        rotation: 0, opacity: 0.7, zIndex: 999,
        tag: "brand-logo", locked: brandLock,
        filter: `brightness(0) saturate(100%) ${hexToCssFilter(theme.primaryColor)}`,
      };
      setObjects(prev => [...prev, logoObj]);
    } else {
      const logoObj: CanvasObject = {
        id: uid(), type: "text", x: CANVAS_WIDTH / 2 - 60, y: CANVAS_HEIGHT - 30,
        width: 120, height: 16, content: "NurseNest", fontSize: 9,
        fontWeight: "600", fill: theme.primaryColor, fontFamily: theme.bodyFont,
        rotation: 0, opacity: 0.5, zIndex: 999, textAlign: "center",
        tag: "brand-logo", locked: brandLock,
      };
      setObjects(prev => [...prev, logoObj]);
    }
  };

  const uploadBrandLogo = async (file: File) => {
    setLogoUploading(true);
    try {
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await adminFetch("/api/admin/brand-logos", {
        method: "POST",
        body: { imageData, fileName: file.name },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setBrandLogos(prev => [...prev, data]);
      toast({ title: "Logo uploaded", description: data.fileName });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setLogoUploading(false);
    }
  };

  const insertBrandLogo = (logoUrl: string, color: string) => {
    pushUndo();
    const tintFilter = color === "original" ? undefined
      : color === "white" ? "brightness(0) invert(1)"
      : color === "black" ? "brightness(0)"
      : `brightness(0) saturate(100%) ${hexToCssFilter(color)}`;
    const newObj: CanvasObject = {
      id: uid(), type: "image" as const,
      x: CANVAS_WIDTH / 2 - 80, y: CANVAS_HEIGHT - 60,
      width: 160, height: 50,
      src: logoUrl,
      rotation: 0, opacity: color === "white" ? 0.9 : 0.7,
      zIndex: 998,
      tag: "brand-logo", locked: brandLock,
      filter: tintFilter,
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId(newObj.id);
    toast({ title: "Logo inserted" });
  };

  const beautifyPage = () => {
    pushUndo();
    const sorted = [...objects].sort((a, b) => a.y - b.y);
    let curY = MARGIN;
    const updated = sorted.map((obj, i) => {
      const snappedX = Math.max(MARGIN, Math.round(obj.x / GRID_SIZE) * GRID_SIZE);
      const clampedW = Math.min(obj.width, CANVAS_WIDTH - MARGIN * 2);
      const newObj = {
        ...obj,
        x: snappedX,
        y: curY,
        width: clampedW,
        zIndex: i,
        fontFamily: obj.type === "text" ? (((obj.fontSize || 0) >= 18 || obj.fontWeight === "bold") ? theme.headingFont : theme.bodyFont) : obj.fontFamily,
      };
      curY += obj.height + 12;
      return newObj;
    });
    setObjects(updated);
    toast({ title: "Page beautified", description: "Aligned, spaced, and themed" });
  };

  const runDesignAudit = () => {
    const issues: string[] = [];
    objects.forEach(obj => {
      if (obj.x < MARGIN - 5 || obj.x + obj.width > CANVAS_WIDTH - MARGIN + 5) issues.push(`"${obj.content?.slice(0, 20) || obj.type}" outside margins`);
      if (obj.type === "text" && obj.fontFamily && obj.fontFamily !== theme.bodyFont && obj.fontFamily !== theme.headingFont) issues.push(`Off-theme font: ${obj.fontFamily}`);
      if (brandLock && obj.type === "text" && obj.fill && !themePalette.includes(obj.fill.toLowerCase())) issues.push(`Off-palette color on "${obj.content?.slice(0, 15) || "text"}"`);
      if (obj.type === "text" && obj.fontSize && obj.fontSize < 8) issues.push(`Very small text: ${obj.fontSize}px`);
    });
    if (showLogo && !objects.some(o => o.tag === "brand-logo")) issues.push("Missing brand logo footer");
    if (issues.length === 0) {
      setBrandVerified(true);
      insertVerifiedBadge();
      toast({ title: "Design Audit Passed", description: "Brand verified badge added" });
    } else {
      setBrandVerified(false);
      setObjects(prev => prev.filter(o => o.tag !== "brand-verified"));
      toast({ title: `Design Audit: ${issues.length} issue(s)`, description: issues.slice(0, 3).join("; "), variant: "destructive" });
    }
  };

  const generateCoverForCurrentProject = (presetOverride?: string) => {
    pushUndo();
    const pid = presetOverride || coverPresetId;
    const preset = COVER_PRESETS.find(p => p.id === pid) || COVER_PRESETS[0];
    const coverObjs = generateStyledCoverPage(CANVAS_WIDTH, CANVAS_HEIGHT, theme, preset, {
      title: project?.title || "Study Guide",
      subtitle: `${EXAM_CONTEXT_MAP[aiExamTarget]?.label || "Nursing"} Review`,
      examTarget: EXAM_CONTEXT_MAP[aiExamTarget]?.label || "",
      badges: EXAM_CONTEXT_MAP[aiExamTarget]?.region === "CA" ? ["Canada"] : EXAM_CONTEXT_MAP[aiExamTarget]?.region === "US" ? ["USA"] : [],
      pageCount: pages.length,
      logoUrl: brandLogos.length > 0 ? brandLogos[0].url : "/brand-logo.gif",
    });
    setObjects(coverObjs);
    toast({ title: "Cover page generated", description: `${preset.name} preset applied` });
  };

  const insertBlockToCanvas = (blockId: string) => {
    const block = CONTENT_BLOCK_LIBRARY.find(b => b.id === blockId);
    if (!block) return;
    if (blockId === "cover") {
      generateCoverForCurrentProject();
      return;
    }
    pushUndo();
    const baseY = objects.length > 0 ? Math.max(...objects.map(o => o.y + o.height)) + 16 : MARGIN;
    const contentWidth = CANVAS_WIDTH - MARGIN * 2;
    const newObjs: CanvasObject[] = [];
    let z = objects.length;

    if (blockId === "section-divider") {
      newObjs.push({ id: uid(), type: "rect", x: 0, y: baseY, width: CANVAS_WIDTH, height: 80, fill: theme.primaryColor, rotation: 0, opacity: 1, zIndex: z++, borderRadius: 0 });
      newObjs.push({ id: uid(), type: "text", x: MARGIN, y: baseY + 20, width: contentWidth, height: 28, content: "SECTION TITLE", fontSize: 22, fontWeight: "bold", fill: "#ffffff", fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center" });
      newObjs.push({ id: uid(), type: "text", x: MARGIN, y: baseY + 50, width: contentWidth, height: 18, content: "Subsection description", fontSize: 12, fontWeight: "normal", fill: "#ffffffcc", fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++, textAlign: "center" });
    } else if (blockId === "toc") {
      newObjs.push({ id: uid(), type: "rect", x: MARGIN, y: baseY, width: contentWidth, height: 200, fill: theme.sectionBg, stroke: theme.dividerColor, strokeWidth: 1, borderRadius: 12, rotation: 0, opacity: 1, zIndex: z++ });
      newObjs.push({ id: uid(), type: "text", x: MARGIN + 16, y: baseY + 12, width: contentWidth - 32, height: 24, content: "TABLE OF CONTENTS", fontSize: 16, fontWeight: "bold", fill: theme.headingColor, fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++ });
      newObjs.push({ id: uid(), type: "text", x: MARGIN + 16, y: baseY + 44, width: contentWidth - 32, height: 140, content: "1. Learning Objectives ........................ 3\n2. Key Concepts ............................... 5\n3. Pathophysiology ............................. 7\n4. Signs & Symptoms .......................... 9\n5. Medications ................................ 11\n6. Nursing Interventions ....................... 13\n7. Practice Questions ......................... 15", fontSize: 11, fontWeight: "normal", fill: theme.bodyColor, fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++ });
    } else {
      newObjs.push({ id: uid(), type: "rect", x: MARGIN, y: baseY, width: contentWidth, height: 32, fill: theme.primaryColor, borderRadius: 8, rotation: 0, opacity: 1, zIndex: z++ });
      newObjs.push({ id: uid(), type: "text", x: MARGIN + 12, y: baseY + 6, width: contentWidth - 24, height: 20, content: block.label.toUpperCase(), fontSize: 13, fontWeight: "bold", fill: "#ffffff", fontFamily: theme.headingFont, rotation: 0, opacity: 1, zIndex: z++ });
      newObjs.push({ id: uid(), type: "rect", x: MARGIN, y: baseY + 40, width: contentWidth, height: 100, fill: theme.sectionBg, stroke: theme.dividerColor, strokeWidth: 1, borderRadius: 8, rotation: 0, opacity: 1, zIndex: z++ });
      newObjs.push({ id: uid(), type: "text", x: MARGIN + 12, y: baseY + 50, width: contentWidth - 24, height: 80, content: `Content for ${block.label} will appear here.\nUse "Generate with AI" to auto-fill this section.`, fontSize: 11, fontWeight: "normal", fill: theme.bodyColor, fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: z++ });
    }

    setObjects(prev => [...prev, ...newObjs]);
    toast({ title: `${block.label} block added` });
  };

  const loadProductPreset = (presetId: string) => {
    const preset = PRODUCT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    if (objects.length > 0 && !confirm(`Replace current content with ${preset.label} preset? This loads ${preset.blocks.length} blocks.`)) return;
    pushUndo();
    setObjects([]);
    setTimeout(() => {
      preset.blocks.forEach((blockId, i) => {
        setTimeout(() => insertBlockToCanvas(blockId), i * 50);
      });
    }, 100);
    toast({ title: `${preset.label} preset loaded`, description: `${preset.blocks.length} blocks queued` });
  };

  const applyBrandTypography = () => {
    pushUndo();
    setObjects(prev => prev.map(obj => {
      if (obj.type !== "text") return obj;
      const isHeading = (obj.fontSize || 0) >= 18 || obj.fontWeight === "bold";
      return { ...obj, fontFamily: isHeading ? theme.headingFont : theme.bodyFont };
    }));
    toast({ title: "Theme typography applied" });
  };

  type LayoutPreset = "stack" | "two-col" | "hero-cards";
  const applyLayoutPreset = (preset: LayoutPreset) => {
    if (objects.length === 0) return;
    pushUndo();
    const contentW = CANVAS_WIDTH - MARGIN * 2;
    const leftX = MARGIN;
    const rightX = MARGIN + contentW / 2 + 8;
    const colW = contentW / 2 - 8;
    const sorted = [...objects].sort((a, b) => a.y - b.y);
    let y = MARGIN;
    const updated = sorted.map((o, i) => {
      if (preset === "stack") {
        const w = Math.min(contentW, o.width);
        const next = { ...o, x: MARGIN, y, width: w, zIndex: i };
        y += next.height + 12;
        return next;
      }
      if (preset === "two-col") {
        const col = i % 2 === 0 ? "left" : "right";
        const x = col === "left" ? leftX : rightX;
        const w = Math.min(colW, o.width);
        const next = { ...o, x, y, width: w, zIndex: i };
        if (col === "right") y += next.height + 12;
        return next;
      }
      if (i === 0 && o.type === "text") {
        const next = { ...o, x: MARGIN, y, width: contentW, fontSize: Math.max(o.fontSize || 18, 26), fontWeight: "bold" as string, zIndex: i };
        y += next.height + 16;
        return next;
      }
      const col = i % 2 === 0 ? "left" : "right";
      const x = col === "left" ? leftX : rightX;
      const w = Math.min(colW, o.width);
      const next = { ...o, x, y, width: w, zIndex: i };
      if (col === "right") y += next.height + 12;
      return next;
    });
    setObjects(updated);
    toast({ title: "Layout applied", description: preset === "stack" ? "Stacked" : preset === "two-col" ? "Two columns" : "Hero + cards" });
  };

  const insertVerifiedBadge = () => {
    if (objects.some(o => o.tag === "brand-verified")) return;
    pushUndo();
    setObjects(prev => [
      ...prev,
      {
        id: uid(), type: "rect" as const, x: CANVAS_WIDTH - MARGIN - 110, y: MARGIN,
        width: 110, height: 22, fill: theme.successColor, borderRadius: 11,
        rotation: 0, opacity: 0.9, zIndex: 999, tag: "brand-verified", locked: true,
      },
      {
        id: uid(), type: "text" as const, x: CANVAS_WIDTH - MARGIN - 105, y: MARGIN + 3,
        width: 100, height: 16, content: "BRAND VERIFIED", fontSize: 9, fontWeight: "bold",
        fill: "#ffffff", fontFamily: theme.bodyFont, rotation: 0, opacity: 1,
        zIndex: 1000, textAlign: "center", tag: "brand-verified", locked: true,
      },
    ]);
  };

  const measureTextHeight = (text: string, width: number, fontSize: number, fontFamily: string, fontWeight: string = "normal"): number => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, Inter, sans-serif`;
    const words = text.split(/\s+/);
    let line = "";
    let lines = 1;
    const maxW = width - 4;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        lines++;
        line = word;
      } else {
        line = test;
      }
    }
    const newlines = (text.match(/\n/g) || []).length;
    return Math.max(lines + newlines, 1) * fontSize * 1.35 + 4;
  };

  const autofitText = (mode: "expand" | "shrink" = "expand") => {
    pushUndo();
    let fixCount = 0;
    setObjects(prev => prev.map(obj => {
      if (obj.type !== "text" || !obj.content) return obj;
      const needed = measureTextHeight(obj.content, obj.width, obj.fontSize || 16, obj.fontFamily || "Inter", obj.fontWeight || "normal");
      if (needed <= obj.height + 2) return obj;
      fixCount++;
      if (mode === "expand") {
        return { ...obj, height: Math.min(needed, CANVAS_HEIGHT - obj.y) };
      }
      let fs = obj.fontSize || 16;
      while (fs > 8) {
        const h = measureTextHeight(obj.content, obj.width, fs, obj.fontFamily || "Inter", obj.fontWeight || "normal");
        if (h <= obj.height + 2) break;
        fs--;
      }
      return { ...obj, fontSize: fs };
    }));
    toast({ title: mode === "expand" ? "Boxes expanded to fit" : "Font shrunk to fit", description: `${fixCount} text element(s) adjusted` });
  };

  const findOverflows = (): string[] => {
    const ids: string[] = [];
    for (const obj of objects) {
      if (obj.type !== "text" || !obj.content) continue;
      const needed = measureTextHeight(obj.content, obj.width, obj.fontSize || 16, obj.fontFamily || "Inter", obj.fontWeight || "normal");
      if (needed > obj.height + 2) ids.push(obj.id);
    }
    return ids;
  };

  const highlightOverflows = () => {
    const ids = findOverflows();
    if (ids.length === 0) {
      toast({ title: "No overflows found" });
      return;
    }
    setSelectedIds(ids);
    toast({ title: `${ids.length} overflowing text element(s)`, description: "Selected for review", variant: "destructive" });
  };

  const makeStoreReady = () => {
    pushUndo();
    const steps: string[] = [];

    setObjects(prev => {
      let arr = [...prev];

      if (showLogo && !arr.some(o => o.tag === "brand-logo")) {
        const uploadedLogo = brandLogos.length > 0 ? brandLogos[0] : null;
        if (uploadedLogo) {
          arr.push({
            id: uid(), type: "image" as const,
            x: CANVAS_WIDTH / 2 - 80, y: CANVAS_HEIGHT - 60,
            width: 160, height: 50, src: uploadedLogo.url,
            rotation: 0, opacity: 0.7, zIndex: 999,
            tag: "brand-logo", locked: brandLock,
            filter: `brightness(0) saturate(100%) ${hexToCssFilter(theme.primaryColor)}`,
          });
        } else {
          arr.push({
            id: uid(), type: "text", x: CANVAS_WIDTH / 2 - 60, y: CANVAS_HEIGHT - 30,
            width: 120, height: 16, content: "NurseNest", fontSize: 9,
            fontWeight: "600", fill: theme.primaryColor, fontFamily: theme.bodyFont,
            rotation: 0, opacity: 0.5, zIndex: 999, textAlign: "center",
            tag: "brand-logo", locked: brandLock,
          });
        }
        steps.push("Logo");
      }

      arr = arr.map(obj => {
        if (obj.type !== "text") return obj;
        const isHeading = (obj.fontSize || 0) >= 18 || obj.fontWeight === "bold";
        return { ...obj, fontFamily: isHeading ? theme.headingFont : theme.bodyFont };
      });
      steps.push("Typography");

      if (brandLock) {
        arr = arr.map(obj => {
          if (obj.type !== "text" || !obj.fill || obj.tag === "brand-verified" || obj.tag === "brand-logo") return obj;
          if (themePalette.includes(obj.fill.toLowerCase())) return obj;
          return { ...obj, fill: theme.headingColor };
        });
        steps.push("Colors");
      }

      const sorted = [...arr].sort((a, b) => a.y - b.y);
      let curY = MARGIN;
      arr = sorted.map((obj, i) => {
        const snappedX = Math.max(MARGIN, Math.round(obj.x / GRID_SIZE) * GRID_SIZE);
        const clampedW = Math.min(obj.width, CANVAS_WIDTH - MARGIN * 2);
        const clampedX = Math.min(snappedX, CANVAS_WIDTH - MARGIN - clampedW);
        const newObj = { ...obj, x: Math.max(MARGIN, clampedX), y: curY, width: clampedW, zIndex: i };
        curY += obj.height + 12;
        return newObj;
      });
      steps.push("Grid + margins");

      arr = arr.map(obj => {
        if (obj.type !== "text" || !obj.content) return obj;
        const needed = measureTextHeight(obj.content, obj.width, obj.fontSize || 16, obj.fontFamily || "Inter", obj.fontWeight || "normal");
        if (needed <= obj.height + 2) return obj;
        return { ...obj, height: Math.min(needed, CANVAS_HEIGHT - obj.y) };
      });
      steps.push("Autofit");

      const issues: string[] = [];
      arr.forEach(obj => {
        if (obj.x < MARGIN - 5 || obj.x + obj.width > CANVAS_WIDTH - MARGIN + 5) issues.push("margin");
        if (obj.type === "text" && obj.fontSize && obj.fontSize < 8) issues.push("small-text");
      });

      arr = arr.filter(o => o.tag !== "brand-verified");

      if (issues.length === 0) {
        setBrandVerified(true);
        arr.push(
          { id: uid(), type: "rect" as const, x: CANVAS_WIDTH - MARGIN - 110, y: MARGIN, width: 110, height: 22, fill: theme.successColor, borderRadius: 11, rotation: 0, opacity: 0.9, zIndex: 999, tag: "brand-verified", locked: true },
          { id: uid(), type: "text" as const, x: CANVAS_WIDTH - MARGIN - 105, y: MARGIN + 3, width: 100, height: 16, content: "BRAND VERIFIED", fontSize: 9, fontWeight: "bold", fill: "#ffffff", fontFamily: theme.bodyFont, rotation: 0, opacity: 1, zIndex: 1000, textAlign: "center", tag: "brand-verified", locked: true },
        );
        steps.push("Verified ✓");
      } else {
        setBrandVerified(false);
        steps.push(`${issues.length} issue(s)`);
      }

      return arr;
    });

    toast({ title: "Store-Ready Pipeline Complete", description: steps.join(" → ") });
  };

  const alignSelected = (dir: "left" | "center" | "right" | "distribute") => {
    if (dir === "distribute") {
      pushUndo();
      const sorted = [...objects].sort((a, b) => a.y - b.y);
      if (sorted.length < 2) return;
      const totalH = sorted.reduce((s, o) => s + o.height, 0);
      const gap = (CANVAS_HEIGHT - MARGIN * 2 - totalH) / (sorted.length - 1);
      let y = MARGIN;
      setObjects(sorted.map(o => { const newO = { ...o, y }; y += o.height + Math.max(8, gap); return newO; }));
      return;
    }
    if (!selectedId) return;
    pushUndo();
    if (dir === "left") updateObject(selectedId, { x: MARGIN });
    else if (dir === "right") {
      const obj = objects.find(o => o.id === selectedId);
      if (obj) updateObject(selectedId, { x: CANVAS_WIDTH - MARGIN - obj.width });
    }
    else if (dir === "center") {
      const obj = objects.find(o => o.id === selectedId);
      if (obj) updateObject(selectedId, { x: (CANVAS_WIDTH - obj.width) / 2 });
    }
  };

  const EXAM_CONTEXT_MAP: Record<string, { label: string; tier: string; region: string; frameworks: string; questionStyle: string; terminology: string; scope: string }> = {
    "rex-pn": {
      label: "REX-PN (Canada)",
      tier: "RPN",
      region: "CA",
      frameworks: "Patient safety priority framework, RPN scope of practice, CNO practice standards, harm reduction, infection control (IPAC)",
      questionStyle: "Computer Adaptive Testing (CAT), case-based clinical scenarios, safety-focused decision making",
      terminology: "RPN (Registered Practical Nurse), CNO, metric units (°C, kg, cm), SI lab values (mmol/L, µmol/L, g/L)",
      scope: "RPN scope: medication administration (excluding IV initiation in some jurisdictions), wound care, patient assessment within scope, delegation from RN"
    },
    "nclex-pn": {
      label: "NCLEX-PN (US)",
      tier: "LPN/LVN",
      region: "US",
      frameworks: "ABCs (Airway-Breathing-Circulation), Maslow's hierarchy, safety and infection control, nursing process",
      questionStyle: "Computer Adaptive Testing (CAT), SATA (select all that apply), prioritization and delegation, fill-in-the-blank calculations",
      terminology: "LPN/LVN (Licensed Practical/Vocational Nurse), State Board of Nursing, imperial units (°F, lbs, in), conventional lab values (mEq/L, mg/dL)",
      scope: "LPN/LVN scope: basic patient care, data collection, medication administration under RN supervision, stable patient assignments"
    },
    "nclex-rn": {
      label: "NCLEX-RN",
      tier: "RN",
      region: "US",
      frameworks: "Clinical Judgment Measurement Model (CJMM), NCSBN Clinical Judgment, ABCs, safety and infection control, evidence-based practice",
      questionStyle: "Next Generation NCLEX (NGN): extended drag-and-drop, cloze, enhanced hotspot, matrix/grid, trend items, case studies with 6 questions each",
      terminology: "RN, NCSBN, State Board of Nursing, imperial units (°F, lbs), conventional lab values (mEq/L, mg/dL, g/dL)",
      scope: "Full RN scope: comprehensive assessment, care planning, IV therapy, delegation to LPN/UAP, patient education, discharge planning"
    },
    "np": {
      label: "NP (AANP/ANCC)",
      tier: "NP",
      region: "US",
      frameworks: "Differential diagnosis, evidence-based prescribing, advanced health assessment, pharmacological and non-pharmacological management",
      questionStyle: "Multiple-choice with complex clinical scenarios, differential diagnosis reasoning, treatment planning, prescription writing",
      terminology: "NP, AANP, ANCC, FNP-BC, autonomous practice vs collaborative practice, DEA prescriptive authority",
      scope: "NP scope: independent assessment, diagnosis, prescribing, referral, advanced procedures, health promotion"
    },
  };

  const runAiTool = async (toolId: string) => {
    if (!aiTopic.trim()) {
      toast({ title: "Enter a topic first", variant: "destructive" });
      return;
    }
    setAiLoading(toolId);
    setAiResult(null);
    try {
      const tool = AI_TOOLS.find(t => t.id === toolId);
      const examCtx = EXAM_CONTEXT_MAP[aiExamTarget] || EXAM_CONTEXT_MAP["nclex-rn"];
      const mode = toolId === "bundle-generator" ? "bundle" : "generate";

      const userInstr = aiPromptCanvas.trim()
        ? `\nUSER INSTRUCTIONS: ${aiPromptCanvas.trim()}\nUse these instructions to guide the depth, focus, and style of the content. Do NOT echo the user's words — generate original, structured academic content based on their request.`
        : "";

      let prompt: string;
      if (mode === "bundle") {
        prompt = `Generate a complete sellable study bundle for: ${aiTopic}.${userInstr}
Exam Target: ${examCtx.label} | Tier: ${examCtx.tier}
Frameworks: ${examCtx.frameworks}
Question Style: ${examCtx.questionStyle}
Terminology: ${examCtx.terminology}
Scope: ${examCtx.scope}

Include comprehensive content pages, flashcards, practice questions, and a marketplace listing.`;
      } else {
        prompt = `${tool?.prompt || "Generate content"} for: ${aiTopic}.${userInstr}
Exam Target: ${examCtx.label} | Tier: ${examCtx.tier}
Frameworks: ${examCtx.frameworks}
Question Style: ${examCtx.questionStyle}
Terminology: ${examCtx.terminology}
Scope: ${examCtx.scope}

Return ONLY valid JSON in this exact schema:
{
  "blocks": [
    { "type": "heading", "content": "..." },
    { "type": "paragraph", "content": "..." },
    { "type": "list", "content": "item 1\\nitem 2\\nitem 3" },
    { "type": "clinical-pearl", "content": "..." },
    { "type": "warning", "content": "..." },
    { "type": "callout", "content": "..." }
  ]
}
Rules: No markdown. No extra keys. Keep paragraphs short (1-4 sentences). Lists must be newline separated.`;
      }

      const res = await adminFetch("/api/ai/generate-content", {
        method: "POST",
        body: { prompt, mode, examTarget: aiExamTarget, topic: aiTopic },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "AI generation failed");
      }

      const data = await res.json();

      if (mode === "bundle") {
        setAiResult(data);
        const pagesPayload = data.pages || [];
        const listing = data.listing;
        pushUndo();
        const preset = COVER_PRESETS.find(p => p.id === coverPresetId) || COVER_PRESETS[0];
        const coverObjs = generateStyledCoverPage(CANVAS_WIDTH, CANVAS_HEIGHT, theme, preset, {
          title: listing?.title || project?.title || "Study Guide",
          subtitle: `${examCtx.label || "Nursing"} Review`,
          examTarget: examCtx.label || "",
          includesFlashcards: (data.flashcards || []).length > 0,
          includesQbank: (data.qbank || []).length > 0,
          pageCount: pagesPayload.length + 1,
          logoUrl: brandLogos.length > 0 ? brandLogos[0].url : "/brand-logo.gif",
        });
        setObjects(coverObjs);
        const bgColor = pages[currentPageIndex]?.backgroundColor || "#ffffff";
        let created = 0;
        for (let pi = 0; pi < pagesPayload.length; pi++) {
          const p = pagesPayload[pi];
          try {
            const chapterTitle = p.title || `Section ${pi + 1}`;
            if (pagesPayload.length > 1) {
              const chapterObjs = generateChapterCoverPage(CANVAS_WIDTH, CANVAS_HEIGHT, theme, preset, {
                chapterTitle,
                chapterNumber: pi + 1,
                totalChapters: pagesPayload.length,
              });
              const chRes = await adminFetch(`/api/admin/design-projects/${projectId}/pages`, {
                method: "POST",
                body: { title: chapterTitle, backgroundColor: bgColor, canvasJson: { objects: chapterObjs, version: "1.0" } },
              });
              if (chRes.ok) { const cp = await chRes.json(); setPages(prev => [...prev, cp]); }
            }
            const contentObjs = p.objects || [];
            const res = await adminFetch(`/api/admin/design-projects/${projectId}/pages`, {
              method: "POST",
              body: { title: `Content Page ${created + 1}`, backgroundColor: bgColor, canvasJson: { objects: contentObjs, version: "1.0" } },
            });
            if (res.ok) {
              const np = await res.json();
              setPages(prev => [...prev, np]);
              created++;
            }
          } catch {}
        }
        toast({ title: "Bundle auto-populated", description: `Cover + ${pagesPayload.length > 1 ? pagesPayload.length + " chapters + " : ""}${created} content page(s) added — click pages to review, use AI to refine` });
      } else {
        const blocks = data.blocks || [];
        setAiResult(blocks);
        toast({ title: "Content generated", description: `${blocks.length} blocks ready to insert` });

        if (autoStoreReady && blocks.length > 0) {
          setTimeout(() => {
            makeStoreReady();
            toast({ title: "Auto Store-Ready complete", description: "Pipeline ran automatically after generation" });
          }, 300);
        }
      }
    } catch (e: any) {
      const code = (e as any).code;
      const desc = code === "AI_RATE_LIMIT" ? "Please wait a moment and try again."
        : code === "AI_QUOTA_EXCEEDED" ? "Daily budget reached. Resets at midnight UTC."
        : e.message;
      toast({ title: "AI Error", description: desc, variant: "destructive" });
    } finally {
      setAiLoading(null);
    }
  };

  const validateTestBankForExport = (data: any, requested: number): { ok: boolean; requestedCount: number; generatedCount: number; countMatch: boolean; byType: Record<string, number>; byCategory: Record<string, number>; errors: string[] } => {
    const questions = Array.isArray(data?.questions) ? data.questions : [];
    const generated = questions.length;
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const errors: string[] = [];
    const VALID_CATS = ["Professional, Ethical & Legal Practice", "Foundations of Practice", "Collaborative Practice", "Nursing Care"];
    const VALID_TYPES = ["MCQ", "SATA", "PRIORITY", "DELEGATION"];
    if (generated !== requested) errors.push(`COUNT MISMATCH: requested ${requested}, got ${generated}`);
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const label = `Q${i + 1}`;
      if (!q || typeof q !== "object") { errors.push(`${label}: not a valid object`); continue; }
      if (!q.id) errors.push(`${label}: missing id`);
      if (!q.category || !VALID_CATS.includes(q.category)) errors.push(`${label}: invalid category`);
      const qType = (q.type || "").toUpperCase();
      if (!VALID_TYPES.includes(qType)) errors.push(`${label}: invalid type "${q.type}"`);
      if (!q.scenario || q.scenario.length < 20) errors.push(`${label}: scenario missing/short`);
      if (!q.stem || q.stem.length < 10) errors.push(`${label}: stem missing/short`);
      if (!Array.isArray(q.options) || q.options.length < 4) errors.push(`${label}: options invalid`);
      if ((qType === "MCQ" || qType === "PRIORITY" || qType === "DELEGATION") && (typeof q.correctAnswer !== "string" || q.correctAnswer.length !== 1)) errors.push(`${label}: ${qType} needs single-letter correctAnswer`);
      if (qType === "SATA" && (!Array.isArray(q.correctAnswer) || q.correctAnswer.length < 2)) errors.push(`${label}: SATA needs array correctAnswer`);
      if (!q.rationaleCorrect || q.rationaleCorrect.length < 20) errors.push(`${label}: rationaleCorrect missing/short`);
      if (!Array.isArray(q.rationaleIncorrect) || q.rationaleIncorrect.length < 1) errors.push(`${label}: rationaleIncorrect missing`);
      if (!q.clinicalPearl || q.clinicalPearl.length < 10) errors.push(`${label}: clinicalPearl missing/short`);
      const t = qType || "UNKNOWN";
      const c = q.category || "Uncategorized";
      byType[t] = (byType[t] || 0) + 1;
      byCategory[c] = (byCategory[c] || 0) + 1;
    }
    const countMatch = generated === requested;
    const ok = errors.length === 0;
    console.log(`[TestBank Audit] requested=${requested} generated=${generated} match=${countMatch} ok=${ok} errors=${errors.length}`);
    if (errors.length > 0) console.warn(`[TestBank Audit] Errors:`, errors.slice(0, 10));
    return { ok, requestedCount: requested, generatedCount: generated, countMatch, byType, byCategory, errors };
  };

  const generateTestBank = async () => {
    if (!aiTopic.trim()) {
      toast({ title: "Enter a topic first", variant: "destructive" });
      return;
    }
    setTbLoading(true);
    setTbAudit(null);
    try {
      const res = await adminFetch("/api/ai/generate-test-bank", {
        method: "POST",
        body: {
          topic: aiTopic,
          customPrompt: aiPromptCanvas.trim() || undefined,
          examTarget: aiExamTarget,
          questionCount: tbQuestionCount,
          difficulty: tbDifficulty,
          questionTypes: tbQuestionTypes,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422) {
        const partialResult = data.testBank || (data.questions ? data : null);
        if (partialResult && Array.isArray(partialResult.questions) && partialResult.questions.length > 0) {
          setTbResult({ ...partialResult, _auditedCount: tbQuestionCount });
        }
        const audit = validateTestBankForExport(partialResult || { questions: [] }, tbQuestionCount);
        setTbAudit(audit);
        toast({
          title: `Generated ${data.generatedCount ?? 0}/${data.requestedCount || tbQuestionCount} questions`,
          description: "Incomplete output. Use Complete Missing to finish.",
          variant: "destructive",
        });
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || "Test bank generation failed");
      }
      const audit = validateTestBankForExport(data, tbQuestionCount);
      setTbAudit(audit);
      setTbResult({ ...data, _auditedCount: tbQuestionCount });
      if (audit.ok) {
        toast({ title: "Test Bank Generated", description: `${audit.generatedCount}/${audit.requestedCount} questions - audit PASSED` });
      } else {
        toast({
          title: `Generated ${audit.generatedCount}/${audit.requestedCount} questions`,
          description: `Audit: ${audit.errors.length} issue(s). Fix before export.`,
          variant: "destructive",
        });
      }
    } catch (e: any) {
      toast({ title: "Generation Failed", description: e.message, variant: "destructive" });
    } finally {
      setTbLoading(false);
    }
  };

  const tbExportAllowed = (): boolean => {
    if (!tbResult?.questions || !tbAudit) return false;
    return tbAudit.ok;
  };

  const tbAuditGate = (): boolean => {
    if (!tbResult?.questions) {
      toast({ title: "No test bank to export", variant: "destructive" });
      return false;
    }
    const expected = tbResult._auditedCount || tbResult.requestedCount || tbQuestionCount;
    const audit = validateTestBankForExport(tbResult, expected);
    setTbAudit(audit);
    if (!audit.ok) {
      toast({
        title: "Export blocked",
        description: audit.errors.length > 0 ? audit.errors[0] : "Validation failed",
        variant: "destructive",
      });
    }
    return audit.ok;
  };

  const exportTestBankJSON = () => {
    if (!tbAuditGate()) return;
    const blob = new Blob([JSON.stringify(tbResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${(tbResult.title || "test-bank").replace(/\s+/g, "-").toLowerCase()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported as JSON" });
  };

  const exportTestBankCSV = () => {
    if (!tbAuditGate()) return;
    const header = "ID,Type,Scenario,Stem,Options,CorrectAnswer,RationaleCorrect,RationaleIncorrect,ClinicalPearl,Category";
    const rows = tbResult.questions.map((q: any) =>
      `${q.id},"${(q.type || "").replace(/"/g, '""')}","${(q.scenario || "").replace(/"/g, '""')}","${(q.stem || "").replace(/"/g, '""')}","${(q.options || []).join(" | ").replace(/"/g, '""')}","${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(",") : q.correctAnswer}","${(q.rationaleCorrect || q.rationale || "").replace(/"/g, '""')}","${(Array.isArray(q.rationaleIncorrect) ? q.rationaleIncorrect.join(" | ") : "").replace(/"/g, '""')}","${(q.clinicalPearl || "").replace(/"/g, '""')}","${q.category || ""}"`
    );
    const csv = header + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${(tbResult.title || "test-bank").replace(/\s+/g, "-").toLowerCase()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${tbResult.questions.length} questions as CSV` });
  };

  const publishTestBankToMarketplace = async () => {
    if (!tbAuditGate() || !tbPrice) return;
    setTbPublishing(true);
    try {
      const title = tbResult.title || `Test Bank: ${aiTopic}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const qCount = (tbResult.questions || []).length;
      const description = `${tbResult.description || ""}\n\n${qCount} exam-style questions with detailed rationales. Includes multiple-choice, select-all-that-apply, and ordered-response formats. Mapped to ${aiExamTarget.toUpperCase()} exam blueprint.`;

      const res = await adminFetch("/api/admin/shop/products", {
        method: "POST",
        body: {
          title,
          slug,
          description: description.trim(),
          shortDescription: `${qCount} ${aiExamTarget.toUpperCase()} practice questions with rationales`,
          price: Math.round(parseFloat(tbPrice) * 100),
          category: "Question Pack",
          examTarget: aiExamTarget,
          featured: false,
        },
      });
      if (res.ok) {
        toast({ title: "Test Bank Published!", description: "Product listed in marketplace as draft." });
      } else {
        const err = await res.json();
        toast({ title: "Publish failed", description: err.error || "Unknown error", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Publish failed", description: e.message, variant: "destructive" });
    } finally {
      setTbPublishing(false);
    }
  };

  const simulateMissingQuestion = () => {
    if (!tbResult?.questions || tbResult.questions.length < 2) {
      toast({ title: "Need at least 2 questions to simulate", variant: "destructive" });
      return;
    }
    const trimmed = { ...tbResult, questions: tbResult.questions.slice(0, -1) };
    setTbResult(trimmed);
    const expected = tbResult._auditedCount || tbResult.requestedCount || tbQuestionCount;
    const audit = validateTestBankForExport(trimmed, expected);
    setTbAudit(audit);
    toast({ title: "Simulated: removed last question", description: `Now ${audit.generatedCount}/${audit.requestedCount}` });
  };

  const toggleTbQuestionType = (type: string) => {
    setTbQuestionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const buildBlockObjects = (block: any, curY: number, baseZIndex: number, contentWidth: number): { objs: CanvasObject[]; height: number } => {
    const blockType = block.type || "paragraph";
    const content = block.content || "";
    const objs: CanvasObject[] = [];

    if (blockType === "heading") {
      objs.push({ id: uid(), type: "text", x: MARGIN, y: curY, width: contentWidth, height: 30, content, fontSize: 18, fontWeight: "bold", fill: BRAND.textDark, fontFamily: BRAND.fontHeading, rotation: 0, opacity: 1, zIndex: baseZIndex, textAlign: "left" });
      return { objs, height: 38 };
    } else if (blockType === "clinical-pearl") {
      objs.push({ id: uid(), type: "rect", x: MARGIN, y: curY, width: contentWidth, height: 70, fill: "#ede9fe", stroke: BRAND.primary, strokeWidth: 2, borderRadius: 10, rotation: 0, opacity: 1, zIndex: baseZIndex });
      objs.push({ id: uid(), type: "text", x: MARGIN + 12, y: curY + 6, width: contentWidth - 24, height: 16, content: "Clinical Pearl", fontSize: 11, fontWeight: "bold", fill: BRAND.primary, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 1 });
      objs.push({ id: uid(), type: "text", x: MARGIN + 12, y: curY + 24, width: contentWidth - 24, height: 40, content, fontSize: 10, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 2 });
      return { objs, height: 80 };
    } else if (blockType === "warning") {
      objs.push({ id: uid(), type: "rect", x: MARGIN, y: curY, width: contentWidth, height: 70, fill: "#fef2f2", stroke: BRAND.danger, strokeWidth: 2, borderRadius: 10, rotation: 0, opacity: 1, zIndex: baseZIndex });
      objs.push({ id: uid(), type: "text", x: MARGIN + 12, y: curY + 6, width: contentWidth - 24, height: 16, content: "Red Flag", fontSize: 11, fontWeight: "bold", fill: BRAND.danger, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 1 });
      objs.push({ id: uid(), type: "text", x: MARGIN + 12, y: curY + 24, width: contentWidth - 24, height: 40, content, fontSize: 10, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 2 });
      return { objs, height: 80 };
    } else if (blockType === "callout") {
      objs.push({ id: uid(), type: "rect", x: MARGIN, y: curY, width: contentWidth, height: 50, fill: "#f0fdf4", stroke: BRAND.success, strokeWidth: 1, borderRadius: 8, rotation: 0, opacity: 1, zIndex: baseZIndex });
      objs.push({ id: uid(), type: "text", x: MARGIN + 12, y: curY + 8, width: contentWidth - 24, height: 34, content, fontSize: 10, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 1 });
      return { objs, height: 58 };
    } else if (blockType === "list") {
      const lines = content.split("\n").filter((l: string) => l.trim());
      const h = Math.max(40, lines.length * 16);
      objs.push({ id: uid(), type: "text", x: MARGIN, y: curY, width: contentWidth, height: h, content: lines.map((l: string) => `• ${l.replace(/^[-•]\s*/, "")}`).join("\n"), fontSize: 10, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex, textAlign: "left" });
      return { objs, height: h + 10 };
    } else if (blockType === "question") {
      const q = block.question || {};
      const qNum = block.questionNumber || "?";
      const qType = (q.type || "MCQ").toUpperCase();
      const scenario = q.scenario || "";
      const stem = q.stem || "";
      const options = Array.isArray(q.options) ? q.options : [];
      const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : (q.correctAnswer || "");
      const rationale = q.rationaleCorrect || q.rationale || "";
      const pearl = q.clinicalPearl || "";

      let totalH = 0;
      objs.push({ id: uid(), type: "rect", x: MARGIN, y: curY, width: contentWidth, height: 0, fill: "#f8fafc", stroke: "#e2e8f0", strokeWidth: 1, borderRadius: 8, rotation: 0, opacity: 1, zIndex: baseZIndex });
      const bgIdx = objs.length - 1;

      totalH += 4;
      objs.push({ id: uid(), type: "text", x: MARGIN + 10, y: curY + totalH, width: contentWidth - 20, height: 16, content: `Q${qNum} [${qType}] - ${q.category || ""}`, fontSize: 9, fontWeight: "bold", fill: BRAND.primary, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 1, textAlign: "left" });
      totalH += 18;

      if (scenario) {
        const scenarioLines = Math.ceil(scenario.length / 75);
        const sH = Math.max(14, scenarioLines * 13);
        objs.push({ id: uid(), type: "text", x: MARGIN + 10, y: curY + totalH, width: contentWidth - 20, height: sH, content: scenario, fontSize: 9, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 2, textAlign: "left" });
        totalH += sH + 4;
      }

      const stemLines = Math.ceil(stem.length / 75);
      const stemH = Math.max(14, stemLines * 13);
      objs.push({ id: uid(), type: "text", x: MARGIN + 10, y: curY + totalH, width: contentWidth - 20, height: stemH, content: stem, fontSize: 10, fontWeight: "600", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 3, textAlign: "left" });
      totalH += stemH + 4;

      const optText = options.join("\n");
      const optH = Math.max(14, options.length * 14);
      objs.push({ id: uid(), type: "text", x: MARGIN + 16, y: curY + totalH, width: contentWidth - 32, height: optH, content: optText, fontSize: 9, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 4, textAlign: "left" });
      totalH += optH + 6;

      objs.push({ id: uid(), type: "text", x: MARGIN + 10, y: curY + totalH, width: contentWidth - 20, height: 14, content: `Answer: ${correct}`, fontSize: 9, fontWeight: "bold", fill: BRAND.success || "#16a34a", fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 5, textAlign: "left" });
      totalH += 16;

      if (rationale) {
        const ratLines = Math.ceil(rationale.length / 75);
        const rH = Math.max(14, ratLines * 12);
        objs.push({ id: uid(), type: "text", x: MARGIN + 10, y: curY + totalH, width: contentWidth - 20, height: rH, content: rationale, fontSize: 8, fontWeight: "normal", fill: "#64748b", fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 6, textAlign: "left" });
        totalH += rH + 4;
      }

      if (pearl) {
        objs.push({ id: uid(), type: "rect", x: MARGIN + 10, y: curY + totalH, width: contentWidth - 20, height: 24, fill: "#ede9fe", stroke: BRAND.primary, strokeWidth: 1, borderRadius: 6, rotation: 0, opacity: 1, zIndex: baseZIndex + 7 });
        objs.push({ id: uid(), type: "text", x: MARGIN + 16, y: curY + totalH + 4, width: contentWidth - 32, height: 16, content: `Pearl: ${pearl}`, fontSize: 8, fontWeight: "600", fill: BRAND.primary, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex + 8, textAlign: "left" });
        totalH += 28;
      }

      totalH += 8;
      objs[bgIdx].height = totalH;
      return { objs, height: totalH + 10 };
    } else {
      const estLines = Math.ceil(content.length / 70);
      const h = Math.max(30, estLines * 14);
      objs.push({ id: uid(), type: "text", x: MARGIN, y: curY, width: contentWidth, height: h, content, fontSize: 10, fontWeight: "normal", fill: BRAND.textDark, fontFamily: BRAND.fontBody, rotation: 0, opacity: 1, zIndex: baseZIndex, textAlign: "left" });
      return { objs, height: h + 8 };
    }
  };

  const insertAiBlocks = () => {
    if (!aiResult || aiResult.length === 0) return;
    pushUndo();
    let curY = MARGIN;
    const existingMaxY = objects.reduce((m, o) => Math.max(m, o.y + o.height), 0);
    if (existingMaxY > MARGIN) curY = existingMaxY + 20;

    const newObjs: CanvasObject[] = [];
    const contentWidth = CANVAS_WIDTH - MARGIN * 2;

    for (const block of aiResult) {
      const { objs, height } = buildBlockObjects(block, curY, objects.length + newObjs.length, contentWidth);
      newObjs.push(...objs);
      curY += height;
    }

    setObjects(prev => [...prev, ...newObjs]);
    setAiResult(null);
    toast({ title: `${newObjs.length} elements inserted` });
  };

  const insertAiBlocksMultiPage = async () => {
    if (!aiResult || aiResult.length === 0) return;
    pushUndo();
    const contentWidth = CANVAS_WIDTH - MARGIN * 2;
    const maxY = CANVAS_HEIGHT - MARGIN;
    const bgColor = pages[currentPageIndex]?.backgroundColor || "#ffffff";

    const pageChunks: CanvasObject[][] = [[]];
    let curY = MARGIN;
    const existingMaxY = objects.reduce((m, o) => Math.max(m, o.y + o.height), 0);
    if (existingMaxY > MARGIN) curY = existingMaxY + 20;

    if (curY >= maxY) {
      pageChunks.push([]);
      curY = MARGIN;
    }

    let zBase = objects.length;

    for (const block of aiResult) {
      const { objs, height } = buildBlockObjects(block, curY, zBase, contentWidth);

      if (curY + height > maxY) {
        if (pageChunks[pageChunks.length - 1].length > 0) {
          pageChunks[pageChunks.length - 1].push({
            id: uid(), type: "text", x: MARGIN, y: CANVAS_HEIGHT - MARGIN - 12,
            width: contentWidth, height: 12, content: "continued…", fontSize: 8,
            fontWeight: "normal", fill: theme.bodyColorLight, fontFamily: theme.bodyFont,
            rotation: 0, opacity: 0.6, zIndex: zBase++, textAlign: "right",
          });
        }
        pageChunks.push([]);
        curY = MARGIN;
        const rebased = buildBlockObjects(block, curY, zBase, contentWidth);
        pageChunks[pageChunks.length - 1].push(...rebased.objs);
        curY += rebased.height;
        zBase += rebased.objs.length;
      } else {
        pageChunks[pageChunks.length - 1].push(...objs);
        curY += height;
        zBase += objs.length;
      }
    }

    setObjects(prev => [...prev, ...pageChunks[0]]);

    let createdPages = 0;
    for (let i = 1; i < pageChunks.length; i++) {
      try {
        const res = await adminFetch(`/api/admin/design-projects/${projectId}/pages`, {
          method: "POST",
          body: { title: `AI Page ${pages.length + i}`, backgroundColor: bgColor, canvasJson: { objects: pageChunks[i], version: "1.0" } },
        });
        if (res.ok) {
          const newPage = await res.json();
          setPages(prev => [...prev, newPage]);
          createdPages++;
        }
      } catch {}
    }

    setAiResult(null);
    toast({
      title: `AI content paginated`,
      description: `Page 1 updated + ${createdPages} new page(s) created`,
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent, objId?: string) => {
    if (objId) {
      const obj = objects.find(o => o.id === objId);
      if (!obj) return;

      if (e.shiftKey) {
        toggleSelect(objId, true);
      } else {
        if (obj.groupId) {
          setSelectedIds(selectGroupOfObject(objId));
        } else {
          setSelectedIds([objId]);
        }
      }

      if (obj.locked) return;
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      setIsDragging(true);
      setDragOffset({ x: e.clientX / SCALE - obj.x, y: e.clientY / SCALE - obj.y });
      e.stopPropagation();
    } else {
      setSelectedIds([]);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedIds.length > 0) {
      const primaryId = selectedIds[selectedIds.length - 1];
      const primaryObj = objects.find(o => o.id === primaryId);
      if (!primaryObj) return;
      const rawX = e.clientX / SCALE - dragOffset.x;
      const rawY = e.clientY / SCALE - dragOffset.y;
      const snappedX = Math.round(rawX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(rawY / GRID_SIZE) * GRID_SIZE;
      const clampedX = Math.max(0, Math.min(snappedX, CANVAS_WIDTH - primaryObj.width));
      const clampedY = Math.max(0, Math.min(snappedY, CANVAS_HEIGHT - primaryObj.height));
      const dx = clampedX - primaryObj.x;
      const dy = clampedY - primaryObj.y;
      setObjects(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, x: o.x + dx, y: o.y + dy } : o));
    }
    if (isResizing && selectedId) {
      const obj = objects.find(o => o.id === selectedId);
      const dx = (e.clientX - resizeStart.x) / SCALE;
      const dy = (e.clientY - resizeStart.y) / SCALE;
      const newW = Math.max(20, Math.min(resizeStart.w + dx, CANVAS_WIDTH - (obj?.x || 0)));
      const newH = Math.max(20, Math.min(resizeStart.h + dy, CANVAS_HEIGHT - (obj?.y || 0)));
      updateObject(selectedId, { width: newW, height: newH });
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging || isResizing) pushUndo();
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    const obj = objects.find(o => o.id === selectedId);
    if (!obj || obj.locked) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, w: obj.width, h: obj.height });
  };

  const switchPage = (index: number) => {
    const leaving = pages[currentPageIndex];
    if (leaving) {
      try {
        const bg = leaving.backgroundColor || "#ffffff";
        const url = makeThumb(objects, bg);
        if (url) setPageThumbs(prev => ({ ...prev, [leaving.id]: url }));
      } catch {}
    }
    saveCanvas();
    setCurrentPageIndex(index);
    const pageData = pages[index]?.canvasJson;
    const pageObjects = pageData?.objects || [];
    setObjects(pageObjects);
    setSelectedId(null);
    setUndoStack([]);
    setRedoStack([]);
  };

  const addPage = async () => {
    const res = await adminFetch(`/api/admin/design-projects/${projectId}/pages`, {
      method: "POST",
      body: {},
    });
    if (res.ok) {
      const page = await res.json();
      setPages(prev => [...prev, page]);
      switchPage(pages.length);
    }
  };

  const deletePage = async (pageId: string, index: number) => {
    if (pages.length <= 1) return;
    if (!confirm("Delete this page?")) return;
    await adminFetch(`/api/admin/design-pages/${pageId}`, { method: "DELETE" });
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    if (currentPageIndex >= newPages.length) switchPage(newPages.length - 1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0 && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") deleteSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") { e.preventDefault(); duplicateSelected(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveCanvas(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        if (e.shiftKey) ungroupSelected();
        else groupSelected();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIds, objects, undoStack, redoStack]);

  const renderPageToCanvas = (pageObjects: CanvasObject[], bgColor: string = "#ffffff"): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH * 2;
    canvas.height = CANVAS_HEIGHT * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const sorted = [...pageObjects].sort((a, b) => a.zIndex - b.zIndex);
    for (const obj of sorted) {
      ctx.save();
      ctx.globalAlpha = obj.opacity ?? 1;
      if (obj.rotation) {
        ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        ctx.rotate((obj.rotation * Math.PI) / 180);
        ctx.translate(-(obj.x + obj.width / 2), -(obj.y + obj.height / 2));
      }
      if (obj.type === "rect") {
        ctx.fillStyle = obj.fill || "#94a3b8";
        if (obj.borderRadius) {
          const r = Math.min(obj.borderRadius, obj.width / 2, obj.height / 2);
          ctx.beginPath();
          ctx.moveTo(obj.x + r, obj.y);
          ctx.lineTo(obj.x + obj.width - r, obj.y);
          ctx.arcTo(obj.x + obj.width, obj.y, obj.x + obj.width, obj.y + r, r);
          ctx.lineTo(obj.x + obj.width, obj.y + obj.height - r);
          ctx.arcTo(obj.x + obj.width, obj.y + obj.height, obj.x + obj.width - r, obj.y + obj.height, r);
          ctx.lineTo(obj.x + r, obj.y + obj.height);
          ctx.arcTo(obj.x, obj.y + obj.height, obj.x, obj.y + obj.height - r, r);
          ctx.lineTo(obj.x, obj.y + r);
          ctx.arcTo(obj.x, obj.y, obj.x + r, obj.y, r);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
        if (obj.stroke) {
          ctx.strokeStyle = obj.stroke;
          ctx.lineWidth = obj.strokeWidth || 1;
          if (obj.borderRadius) ctx.stroke();
          else ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        }
      } else if (obj.type === "circle") {
        ctx.fillStyle = obj.fill || "#3b82f6";
        ctx.beginPath();
        ctx.ellipse(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, obj.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (obj.stroke) { ctx.strokeStyle = obj.stroke; ctx.lineWidth = obj.strokeWidth || 1; ctx.stroke(); }
      } else if (obj.type === "text") {
        ctx.fillStyle = obj.fill || "#000000";
        ctx.font = `${obj.fontWeight || "normal"} ${obj.fontSize || 16}px ${obj.fontFamily || "sans-serif"}`;
        ctx.textAlign = (obj.textAlign as CanvasTextAlign) || "left";
        const lines = (obj.content || "Text").split("\n");
        const lineHeight = (obj.fontSize || 16) * 1.3;
        lines.forEach((line, li) => {
          const tx = obj.textAlign === "center" ? obj.x + obj.width / 2 : obj.textAlign === "right" ? obj.x + obj.width : obj.x;
          ctx.fillText(line, tx, obj.y + (obj.fontSize || 16) + li * lineHeight, obj.width);
        });
      }
      ctx.restore();
    }
    return canvas;
  };

  function makeThumb(pageObjects: CanvasObject[], bgColor: string, maxW = 160, maxH = 210): string {
    try {
      const src = renderPageToCanvas(pageObjects, bgColor);
      const thumb = document.createElement("canvas");
      const scale = Math.min(maxW / CANVAS_WIDTH, maxH / CANVAS_HEIGHT);
      thumb.width = Math.max(1, Math.round(CANVAS_WIDTH * scale));
      thumb.height = Math.max(1, Math.round(CANVAS_HEIGHT * scale));
      const ctx = thumb.getContext("2d");
      if (!ctx) return "";
      ctx.fillStyle = bgColor || "#ffffff";
      ctx.fillRect(0, 0, thumb.width, thumb.height);
      ctx.drawImage(src, 0, 0, thumb.width, thumb.height);
      return thumb.toDataURL("image/png");
    } catch {
      return "";
    }
  }

  useEffect(() => {
    const page = pages[currentPageIndex];
    if (!page) return;
    const id = page.id;
    const bg = page.backgroundColor || "#ffffff";
    const t = window.setTimeout(() => {
      try {
        const url = makeThumb(objects, bg);
        if (url) setPageThumbs(prev => (prev[id] === url ? prev : { ...prev, [id]: url }));
      } catch {}
    }, 250);
    return () => window.clearTimeout(t);
  }, [objects, currentPageIndex, pages]);

  useEffect(() => {
    if (!pages.length) return;
    setPageThumbs(prev => {
      const next = { ...prev };
      let changed = false;
      for (const p of pages) {
        if (next[p.id]) continue;
        const objs: CanvasObject[] = p.canvasJson?.objects || [];
        const bg = p.backgroundColor || "#ffffff";
        try {
          const url = makeThumb(objs, bg);
          if (url) { next[p.id] = url; changed = true; }
        } catch {}
      }
      return changed ? next : prev;
    });
  }, [pages.length]);

  const exportAsImages = async () => {
    setExporting(true);
    try {
      await saveCanvas();
      for (let i = 0; i < pages.length; i++) {
        const pageData = i === currentPageIndex ? { objects } : pages[i]?.canvasJson;
        const pageObjects = pageData?.objects || [];
        const bgColor = pages[i]?.backgroundColor || "#ffffff";
        const canvas = renderPageToCanvas(pageObjects, bgColor);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${project?.title || "design"}-page-${i + 1}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
      toast({ title: `Exported ${pages.length} page(s) as PNG images` });
    } catch (e: any) {
      toast({ title: "Export failed", description: e.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const exportAsPDF = async () => {
    setExporting(true);
    try {
      await saveCanvas();

      const sortedPages = [...pages].sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));

      const pageSequence = sortedPages.map((p, i) => ({
        index: i,
        pageNumber: p.pageNumber,
        id: p.id,
        hasContent: ((i === currentPageIndex ? objects : (p.canvasJson?.objects || [])) as CanvasObject[]).length > 0,
      }));
      console.log("[PDF Export] Page sequence:", JSON.stringify(pageSequence));
      console.log(`[PDF Export] Total pages: ${sortedPages.length}, page[0].pageNumber=${sortedPages[0]?.pageNumber}`);

      if (sortedPages.length === 0) {
        toast({ title: "No pages to export", variant: "destructive" });
        setExporting(false);
        return;
      }

      const { jsPDF } = await import("jspdf");
      const orientation = project?.orientation === "landscape" ? "landscape" : "portrait";
      const pdf = new jsPDF({ orientation: orientation as any, unit: "pt", format: [CANVAS_WIDTH, CANVAS_HEIGHT] });
      for (let i = 0; i < sortedPages.length; i++) {
        if (i > 0) pdf.addPage([CANVAS_WIDTH, CANVAS_HEIGHT], orientation);
        const originalIndex = pages.indexOf(sortedPages[i]);
        const pageData = originalIndex === currentPageIndex ? { objects } : sortedPages[i]?.canvasJson;
        const pageObjects = pageData?.objects || [];
        const bgColor = sortedPages[i]?.backgroundColor || "#ffffff";
        const canvas = renderPageToCanvas(pageObjects, bgColor);
        const dataUrl = canvas.toDataURL("image/png");
        pdf.addImage(dataUrl, "PNG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      pdf.save(`${(project?.title || "design").replace(/[^a-zA-Z0-9]/g, "-")}.pdf`);
      toast({ title: `Exported ${sortedPages.length} page(s) as PDF` });
    } catch (e: any) {
      toast({ title: "PDF export failed", description: e.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const exportThumbnail = (width: number, height: number) => {
    const pageData = pages[0]?.canvasJson;
    const pageObjects = currentPageIndex === 0 ? objects : (pageData?.objects || []);
    const bgColor = pages[0]?.backgroundColor || "#ffffff";
    const srcCanvas = renderPageToCanvas(pageObjects, bgColor);
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = width * 2;
    thumbCanvas.height = height * 2;
    const ctx = thumbCanvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, thumbCanvas.width, thumbCanvas.height);
    const scale = Math.min((width * 2) / srcCanvas.width, (height * 2) / srcCanvas.height);
    const dx = (width * 2 - srcCanvas.width * scale) / 2;
    const dy = (height * 2 - srcCanvas.height * scale) / 2;
    ctx.drawImage(srcCanvas, dx, dy, srcCanvas.width * scale, srcCanvas.height * scale);
    thumbCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `thumbnail-${width}x${height}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
    toast({ title: `Thumbnail ${width}x${height} exported` });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canvasToBlob = (canvas: HTMLCanvasElement, type = "image/png", quality?: number) =>
    new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Failed to create blob"))), type, quality);
    });

  const renderPageToSize = (
    pageObjects: CanvasObject[], bgColor: string,
    targetW: number, targetH: number, fit: "contain" | "cover" = "contain"
  ) => {
    const src = renderPageToCanvas(pageObjects, bgColor);
    const out = document.createElement("canvas");
    out.width = targetW * 2;
    out.height = targetH * 2;
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = bgColor || "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    const scaleX = out.width / src.width;
    const scaleY = out.height / src.height;
    const scale = fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
    const drawW = src.width * scale;
    const drawH = src.height * scale;
    const dx = (out.width - drawW) / 2;
    const dy = (out.height - drawH) / 2;
    ctx.drawImage(src, dx, dy, drawW, drawH);
    return out;
  };

  const drawMockupFrame = (pageCanvas: HTMLCanvasElement, _bgColor: string, targetW: number, targetH: number, label: string) => {
    const out = document.createElement("canvas");
    out.width = targetW * 2;
    out.height = targetH * 2;
    const ctx = out.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, out.width, out.height);
    g.addColorStop(0, "#f8f7ff");
    g.addColorStop(0.5, "#f5fbff");
    g.addColorStop(1, "#fffdf7");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, out.width, out.height);

    const cardX = Math.round(out.width * 0.12);
    const cardY = Math.round(out.height * 0.10);
    const cardW = Math.round(out.width * 0.76);
    const cardH = Math.round(out.height * 0.80);
    const radius = Math.round(out.width * 0.03);

    const roundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w / 2, h / 2);
      c.beginPath();
      c.moveTo(x + rr, y);
      c.lineTo(x + w - rr, y);
      c.arcTo(x + w, y, x + w, y + rr, rr);
      c.lineTo(x + w, y + h - rr);
      c.arcTo(x + w, y + h, x + w - rr, y + h, rr);
      c.lineTo(x + rr, y + h);
      c.arcTo(x, y + h, x, y + h - rr, rr);
      c.lineTo(x, y + rr);
      c.arcTo(x, y, x + rr, y, rr);
      c.closePath();
    };

    ctx.save();
    ctx.shadowColor = "rgba(124,58,237,0.22)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();

    const framePad = Math.round(cardW * 0.06);
    const frameX = cardX + framePad;
    const frameY = cardY + Math.round(cardH * 0.10);
    const frameW = cardW - framePad * 2;
    const frameH = cardH - Math.round(cardH * 0.18);
    const frameR = Math.round(radius * 0.8);
    ctx.fillStyle = "#0f172a";
    roundRect(ctx, frameX, frameY, frameW, frameH, frameR);
    ctx.fill();

    const inset = Math.round(frameW * 0.03);
    const screenX = frameX + inset;
    const screenY = frameY + inset;
    const screenW = frameW - inset * 2;
    const screenH = frameH - inset * 2;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, screenX, screenY, screenW, screenH, Math.round(frameR * 0.7));
    ctx.fill();

    const scaleX = screenW / pageCanvas.width;
    const scaleY = screenH / pageCanvas.height;
    const scale = Math.min(scaleX, scaleY);
    const drawW = pageCanvas.width * scale;
    const drawH = pageCanvas.height * scale;
    const dx = screenX + (screenW - drawW) / 2;
    const dy = screenY + (screenH - drawH) / 2;
    ctx.drawImage(pageCanvas, dx, dy, drawW, drawH);

    ctx.fillStyle = "#1e293b";
    ctx.font = `700 ${Math.round(out.width * 0.022)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(label, out.width / 2, Math.round(cardY + cardH * 0.07));

    ctx.fillStyle = "rgba(30,41,59,0.55)";
    ctx.font = `600 ${Math.round(out.width * 0.016)}px Inter, system-ui, sans-serif`;
    ctx.fillText("NurseNest \u2022 Instant Download", out.width / 2, Math.round(cardY + cardH * 0.94));

    return out;
  };

  const exportInstagramCarousel = async () => {
    setExporting(true);
    try {
      await saveCanvas();
      const title = (project?.title || "design").replace(/[^a-zA-Z0-9]/g, "-");
      for (let i = 0; i < pages.length; i++) {
        const pageData = i === currentPageIndex ? { objects } : pages[i]?.canvasJson;
        const pageObjects = pageData?.objects || [];
        const bgColor = pages[i]?.backgroundColor || "#ffffff";
        const c = renderPageToSize(pageObjects, bgColor, 1080, 1350, "contain");
        const blob = await canvasToBlob(c);
        downloadBlob(blob, `${title}-IG-${String(i + 1).padStart(2, "0")}.png`);
      }
      toast({ title: "Exported Instagram carousel", description: `${pages.length} image(s) 1080x1350` });
    } catch (e: any) {
      toast({ title: "IG export failed", description: e.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const exportEtsyStorePack = async () => {
    setExporting(true);
    try {
      await saveCanvas();
      const title = (project?.title || "design").replace(/[^a-zA-Z0-9]/g, "-");
      const heroPageData = currentPageIndex === 0 ? { objects } : pages[0]?.canvasJson;
      const heroObjects = heroPageData?.objects || [];
      const heroBg = pages[0]?.backgroundColor || "#ffffff";

      const sq = renderPageToSize(heroObjects, heroBg, 600, 600, "cover");
      downloadBlob(await canvasToBlob(sq), `${title}-thumb-600x600.png`);

      const banner = renderPageToSize(heroObjects, heroBg, 1200, 630, "cover");
      downloadBlob(await canvasToBlob(banner), `${title}-banner-1200x630.png`);

      const page1 = renderPageToSize(heroObjects, heroBg, 900, 1200, "contain");
      const mock1 = drawMockupFrame(page1, heroBg, 2000, 2000, "Study Guide Preview");
      downloadBlob(await canvasToBlob(mock1), `${title}-mockup-1.png`);

      const page2Data = pages[1] ? (currentPageIndex === 1 ? { objects } : pages[1]?.canvasJson) : heroPageData;
      const page3Data = pages[2] ? (currentPageIndex === 2 ? { objects } : pages[2]?.canvasJson) : heroPageData;
      const p2Objs = page2Data?.objects || heroObjects;
      const p3Objs = page3Data?.objects || heroObjects;

      const p2 = renderPageToSize(p2Objs, heroBg, 900, 1200, "contain");
      const p3 = renderPageToSize(p3Objs, heroBg, 900, 1200, "contain");
      const mock2 = drawMockupFrame(p2, heroBg, 2000, 2000, "High-Yield Layout");
      const mock3 = drawMockupFrame(p3, heroBg, 2000, 2000, "Exam-Ready Format");
      downloadBlob(await canvasToBlob(mock2), `${title}-mockup-2.png`);
      downloadBlob(await canvasToBlob(mock3), `${title}-mockup-3.png`);

      toast({ title: "Exported Etsy store pack", description: "Thumb + banner + 3 mockups created" });
    } catch (e: any) {
      toast({ title: "Etsy export failed", description: e.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const dollarsToCents = (v: string): number => {
    const n = Number(String(v).replace(/[^0-9.]/g, ""));
    if (!isFinite(n)) return 0;
    return Math.round(n * 100);
  };

  const publishToMarketplace = async () => {
    if (!publishForm.title.trim() || !publishForm.price) return;
    setPublishing(true);
    try {
      await saveCanvas();
      const res = await adminFetch("/api/admin/shop/products", {
        method: "POST",
        body: {
          title: publishForm.title,
          slug: publishForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          description: publishForm.description || publishForm.title,
          price: dollarsToCents(publishForm.price),
          category: publishForm.category,
          coverImageUrl: null,
          featured: false,
        },
      });
      if (res.ok) {
        toast({ title: "Published to marketplace!", description: "Your product is now in the store as a draft." });
        setShowPublishDialog(false);
      } else {
        const err = await res.json();
        toast({ title: "Publish failed", description: err.error || "Unknown error", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Publish failed", description: e.message, variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const selectedObj = objects.find(o => o.id === selectedId);

  const renderLeftPanel = () => {
    if (!leftPanel) return null;

    if (leftPanel === "components") {
      const illustCategories = [...new Set(STOCK_ILLUSTRATIONS.map(i => i.category))];
      return (
        <div className="w-60 bg-white border-r overflow-y-auto shrink-0" data-testid="panel-components">
          <div className="p-3 border-b">
            <span className="text-xs font-semibold text-gray-600">{t("pages.productBuilder.elements")}</span>
          </div>
          <div className="p-3">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t("pages.productBuilder.shapes")}</span>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5 mb-3">
              <button onClick={() => addObject("rect")} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 flex items-center justify-center hover:bg-primary/5 transition" data-testid="button-shape-rect"><Square className="w-5 h-5 text-gray-400" /></button>
              <button onClick={() => addObject("circle")} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 flex items-center justify-center hover:bg-primary/5 transition" data-testid="button-shape-circle"><Circle className="w-5 h-5 text-gray-400" /></button>
              <button onClick={() => { pushUndo(); const id = uid(); setObjects(prev => [...prev, { id, type: "rect" as const, x: MARGIN, y: 50, width: CANVAS_WIDTH - MARGIN * 2, height: 3, fill: theme.dividerColor, rotation: 0, opacity: 1, zIndex: objects.length, borderRadius: 0 }]); setSelectedId(id); }} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 flex items-center justify-center hover:bg-primary/5 transition" data-testid="button-shape-line"><div className="w-6 h-0.5 bg-gray-400 rounded" /></button>
            </div>
          </div>
          <div className="p-3 pt-0">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t("pages.productBuilder.designComponents")}</span>
            <div className="space-y-1 mt-1.5 mb-3">
              {DESIGN_COMPONENTS.map(comp => (
                <button key={comp.tag} onClick={() => insertDesignComponent(comp)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5 text-xs flex items-center gap-2 text-gray-700 hover:text-primary transition-colors" data-testid={`button-comp-${comp.tag}`}>
                  <comp.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{comp.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 pt-0">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t("pages.productBuilder.illustrations")}</span>
            {illustCategories.map(cat => (
              <div key={cat} className="mt-2">
                <span className="text-[9px] font-medium text-gray-400 capitalize">{cat}</span>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {STOCK_ILLUSTRATIONS.filter(i => i.category === cat).map(illust => (
                    <button
                      key={illust.id}
                      onClick={() => insertStockIllustration(illust)}
                      className="aspect-square rounded-lg border border-gray-100 hover:border-primary/40 hover:bg-primary/5 p-1.5 transition flex items-center justify-center group"
                      title={illust.label}
                      data-testid={`button-illust-${illust.id}`}
                    >
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: illust.svg }} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (leftPanel === "templates") {
      return (
        <div className="w-52 bg-white border-r overflow-y-auto shrink-0" data-testid="panel-templates">
          <div className="p-3 border-b">
            <span className="text-xs font-semibold text-gray-600">{t("pages.productBuilder.pageTemplates")}</span>
          </div>
          <div className="p-2 space-y-1">
            {PAGE_TEMPLATES.map(tmpl => (
              <button key={tmpl.label} onClick={() => applyPageTemplate(tmpl)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5 text-xs flex items-center gap-2 text-gray-700 hover:text-primary transition-colors" data-testid={`button-template-${tmpl.label.replace(/\s/g, "-").toLowerCase()}`}>
                <tmpl.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tmpl.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (leftPanel === "ai") {
      return (
        <div className="w-64 bg-white border-r overflow-y-auto shrink-0" data-testid="panel-ai">
          <div className="p-3 border-b">
            <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-primary" /> AI Content Tools
            </span>
          </div>
          <div className="p-3 space-y-3">
            <div>
              <label className="text-[10px] font-medium text-gray-500 block mb-1">{t("pages.productBuilder.topicTitle")}</label>
              <Input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g., Heart Failure" className="text-xs h-8" data-testid="input-ai-topic" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-1">
                <Wand2 className="w-3 h-3 text-primary" /> AI Prompt
              </label>
              <Textarea
                value={aiPromptCanvas}
                onChange={e => setAiPromptCanvas(e.target.value)}
                placeholder={t("pages.productBuilder.describeWhatYouWantGenerated")}
                className="text-xs min-h-[72px] resize-y"
                data-testid="input-ai-prompt-canvas"
              />
              <p className="text-[8px] text-gray-400 mt-0.5">{t("pages.productBuilder.optionalAddsCustomInstructionsTo")}</p>
            </div>
            <div>
              <label className="text-[10px] font-medium text-gray-500 block mb-1">{t("pages.productBuilder.examTarget")}</label>
              <select value={aiExamTarget} onChange={e => setAiExamTarget(e.target.value)} className="w-full text-xs border rounded-md px-2 py-1.5" data-testid="select-ai-exam-target">
                <option value="rex-pn">{t("pages.productBuilder.rexpnCanadaRpn")}</option>
                <option value="nclex-pn">{t("pages.productBuilder.nclexpnUsLpnlvn")}</option>
                <option value="nclex-rn">{t("pages.productBuilder.nclexrnUscaRn")}</option>
                <option value="np">{t("pages.productBuilder.npAanpancc")}</option>
              </select>
            </div>
            <div className="border-t pt-2 space-y-0.5">
              {AI_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => runAiTool(tool.id)}
                  disabled={aiLoading !== null || !aiTopic.trim()}
                  className="w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center gap-2 text-gray-600 hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  data-testid={`button-ai-${tool.id}`}
                >
                  {aiLoading === tool.id ? <Loader2 className="w-3 h-3 animate-spin shrink-0" /> : <tool.icon className="w-3 h-3 shrink-0" />}
                  <span className="truncate">{tool.label}</span>
                </button>
              ))}
            </div>
            {aiResult && Array.isArray(aiResult) && aiResult.length > 0 && (
              <div className="border-t pt-3">
                <div className="bg-primary/5 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-primary mb-1">{aiResult.length} blocks generated</p>
                  <div className="max-h-32 overflow-y-auto text-[9px] text-gray-500 space-y-1 mb-2">
                    {aiResult.slice(0, 5).map((b: any, i: number) => (
                      <p key={i} className="truncate">{b.type}: {(b.content || "").slice(0, 50)}...</p>
                    ))}
                    {aiResult.length > 5 && <p>...and {aiResult.length - 5} more</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button size="sm" onClick={insertAiBlocks} className="h-7 text-[10px] gap-1" data-testid="button-insert-ai">
                      <Plus className="w-3 h-3" /> Insert
                    </Button>
                    <Button size="sm" variant="outline" onClick={insertAiBlocksMultiPage} className="h-7 text-[10px] gap-1" data-testid="button-insert-ai-multipage">
                      <Layers className="w-3 h-3" /> Multi-Page
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {aiResult && aiResult.bundle === true && (
              <div className="border-t pt-3 space-y-2">
                <div className="bg-green-50 rounded-lg p-2.5 border border-green-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <p className="text-[10px] font-semibold text-green-700">{t("pages.productBuilder.bundleOnCanvas")}</p>
                  </div>
                  <div className="text-[10px] text-gray-600 space-y-1">
                    <p>Pages: {(aiResult.pages || []).length} content + cover</p>
                    <p>Flashcards: {(aiResult.flashcards || []).length}</p>
                    <p>QBank: {(aiResult.qbank || []).length}</p>
                    {aiResult.listing?.title && <p>Listing: {aiResult.listing.title}</p>}
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1.5">{t("pages.productBuilder.browsePagesOnTheRight")}</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" data-testid="button-copy-listing" onClick={() => {
                      const listing = aiResult.listing;
                      if (!listing) return;
                      const text = `${listing.title}\n\n${listing.description}\n\n${(listing.bullets || []).join("\n")}`;
                      navigator.clipboard.writeText(text);
                      toast({ title: "Listing copied to clipboard" });
                    }}>{t("pages.productBuilder.copyListing")}</Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" data-testid="button-export-flashcards" onClick={() => {
                      const cards = aiResult.flashcards || [];
                      const csv = "Front,Back\n" + cards.map((c: any) => `"${(c.front || "").replace(/"/g, '""')}","${(c.back || "").replace(/"/g, '""')}"`).join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = "flashcards.csv"; a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: `Exported ${cards.length} flashcards` });
                    }}>{t("pages.productBuilder.exportFlash")}</Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" data-testid="button-export-qbank" onClick={() => {
                      const qbank = aiResult.qbank || [];
                      const blob = new Blob([JSON.stringify(qbank, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = "qbank.json"; a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: `Exported ${qbank.length} questions` });
                    }}>{t("pages.productBuilder.exportQbank")}</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-gray-700">{t("pages.productBuilder.testBankGenerator")}</span>
              </div>
              <p className="text-[9px] text-gray-400 mb-2">{t("pages.productBuilder.generateExamstyleQuestionBanksTo")}</p>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] font-medium text-gray-500 block mb-0.5">{t("pages.productBuilder.questions")}</label>
                  <div className="flex gap-1">
                    {[10, 25, 50, 75].map(n => (
                      <button key={n} onClick={() => setTbQuestionCount(n)} className={`flex-1 h-6 rounded text-[9px] font-medium border transition ${tbQuestionCount === n ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-500 hover:border-primary/30"}`} data-testid={`button-tb-count-${n}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-medium text-gray-500 block mb-0.5">{t("pages.productBuilder.difficulty")}</label>
                  <div className="flex gap-1">
                    {[{v:"easy",l:"Easy"},{v:"mixed",l:"Mixed"},{v:"hard",l:"Hard"}].map(d => (
                      <button key={d.v} onClick={() => setTbDifficulty(d.v)} className={`flex-1 h-6 rounded text-[9px] font-medium border transition ${tbDifficulty === d.v ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-500 hover:border-primary/30"}`} data-testid={`button-tb-diff-${d.v}`}>{d.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-medium text-gray-500 block mb-0.5">{t("pages.productBuilder.questionTypes")}</label>
                  <div className="flex flex-col gap-1">
                    {[{v:"multiple-choice",l:"Multiple Choice"},{v:"select-all",l:"Select All (SATA)"},{v:"ordered-response",l:"Ordered Response"}].map(qt => (
                      <label key={qt.v} className="flex items-center gap-1.5 text-[9px] text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={tbQuestionTypes.includes(qt.v)} onChange={() => toggleTbQuestionType(qt.v)} className="rounded border-gray-300 w-3 h-3 accent-primary" />
                        {qt.l}
                      </label>
                    ))}
                  </div>
                </div>
                <Button size="sm" onClick={generateTestBank} disabled={tbLoading || !aiTopic.trim() || tbQuestionTypes.length === 0} className="w-full h-8 text-[11px] gap-1.5" data-testid="button-generate-test-bank">
                  {tbLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
                  {tbLoading ? "Generating..." : "Generate Test Bank"}
                </Button>
              </div>

              {tbAudit && (
                <div className={`mt-3 rounded-lg border p-2.5 ${tbAudit.ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`} data-testid="panel-tb-audit">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: tbAudit.ok ? "#166534" : "#991b1b" }}>
                      Audit: {tbAudit.ok ? "PASS" : "FAIL"}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${tbAudit.countMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} data-testid="text-tb-count-match">
                      {tbAudit.generatedCount}/{tbAudit.requestedCount}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px] mb-1.5">
                    <span className="text-gray-500">{t("pages.productBuilder.requested")}</span>
                    <span className="font-medium text-gray-700" data-testid="text-tb-requested">{tbAudit.requestedCount}</span>
                    <span className="text-gray-500">{t("pages.productBuilder.generated")}</span>
                    <span className="font-medium text-gray-700" data-testid="text-tb-generated">{tbAudit.generatedCount}</span>
                    <span className="text-gray-500">{t("pages.productBuilder.countMatch")}</span>
                    <span className={`font-medium ${tbAudit.countMatch ? "text-green-700" : "text-red-700"}`} data-testid="text-tb-match">{tbAudit.countMatch ? "true" : "false"}</span>
                  </div>
                  {Object.keys(tbAudit.byType).length > 0 && (
                    <div className="mb-1">
                      <span className="text-[8px] font-semibold text-gray-500 block mb-0.5">{t("pages.productBuilder.byType")}</span>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(tbAudit.byType).map(([t, c]) => (
                          <span key={t} className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[8px]" data-testid={`badge-type-${t}`}>{t}: {c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {Object.keys(tbAudit.byCategory).length > 0 && (
                    <div className="mb-1">
                      <span className="text-[8px] font-semibold text-gray-500 block mb-0.5">{t("pages.productBuilder.byCategory")}</span>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(tbAudit.byCategory).map(([cat, c]) => (
                          <span key={cat} className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full text-[8px]" data-testid={`badge-cat-${cat}`}>{cat}: {c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {tbAudit.errors.length > 0 && (
                    <div className="mt-1.5">
                      <span className="text-[8px] font-semibold text-red-600 block mb-0.5">Errors ({tbAudit.errors.length}):</span>
                      <div className="max-h-20 overflow-y-auto space-y-0.5">
                        {tbAudit.errors.slice(0, 10).map((err, i) => (
                          <p key={i} className="text-[8px] text-red-600" data-testid={`text-tb-error-${i}`}>{err}</p>
                        ))}
                        {tbAudit.errors.length > 10 && <p className="text-[8px] text-red-400">+{tbAudit.errors.length - 10} more</p>}
                      </div>
                    </div>
                  )}
                  <span className={`block text-[8px] mt-1 font-semibold ${tbAudit.ok ? "text-green-600" : "text-red-600"}`} data-testid="text-tb-export-blocked">
                    Export: {tbAudit.ok ? "ENABLED" : "BLOCKED"}
                  </span>
                </div>
              )}

              {tbResult && (
                <div className="mt-3 space-y-2">
                  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                    <p className="text-[11px] font-semibold text-gray-800 mb-0.5">{tbResult.title || "Test Bank"}</p>
                    <p className="text-[9px] text-gray-500 mb-1.5">{(tbResult.questions || []).length} questions generated</p>

                    <button onClick={() => setTbPreviewOpen(!tbPreviewOpen)} className="text-[9px] text-primary hover:text-primary/80 underline mb-1.5 block" data-testid="button-tb-preview-toggle">
                      {tbPreviewOpen ? "Hide Preview" : "Preview Questions"}
                    </button>
                    {tbPreviewOpen && (
                      <div className="max-h-48 overflow-y-auto space-y-2 mb-2">
                        {(tbResult.questions || []).slice(0, 10).map((q: any, i: number) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-[9px]">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="bg-gray-100 text-gray-600 px-1 rounded text-[8px] font-mono">Q{q.id || i + 1}</span>
                              <span className="bg-blue-50 text-blue-600 px-1 rounded text-[8px]">{(q.type || "").toUpperCase()}</span>
                            </div>
                            <p className="text-gray-800 font-medium mb-1">{q.stem}</p>
                            <div className="space-y-0.5 text-gray-600">
                              {(q.options || []).map((opt: string, oi: number) => {
                                const letter = opt.charAt(0);
                                const isCorrect = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(letter) : (q.correctAnswer || "").includes(letter);
                                return (
                                  <p key={oi} className={isCorrect ? "text-green-700 font-medium" : ""}>{opt}</p>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        {(tbResult.questions || []).length > 10 && <p className="text-[8px] text-gray-400 text-center">+{(tbResult.questions || []).length - 10} more questions</p>}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <Button size="sm" variant="outline" onClick={exportTestBankJSON} disabled={!tbExportAllowed()} className="h-7 text-[10px] gap-1" data-testid="button-tb-export-json">
                        <Download className="w-3 h-3" /> JSON
                      </Button>
                      <Button size="sm" variant="outline" onClick={exportTestBankCSV} disabled={!tbExportAllowed()} className="h-7 text-[10px] gap-1" data-testid="button-tb-export-csv">
                        <Download className="w-3 h-3" /> CSV
                      </Button>
                    </div>

                    <button onClick={simulateMissingQuestion} className="text-[8px] text-gray-400 hover:text-red-500 underline block mb-1" data-testid="button-tb-simulate-missing">
                      [Dev] Simulate Missing Question
                    </button>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px] font-semibold text-gray-700">{t("pages.productBuilder.sellThisTestBank")}</span>
                    </div>
                    <p className="text-[9px] text-gray-500 mb-2">{t("pages.productBuilder.publishDirectlyToYourMarketplace")}</p>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[9px] font-medium text-gray-500 block mb-0.5">{t("pages.productBuilder.priceCad")}</label>
                        <Input type="number" step="0.01" min="0" value={tbPrice} onChange={e => setTbPrice(e.target.value)} className="text-xs h-7" placeholder="14.99" data-testid="input-tb-price" />
                      </div>
                      <Button size="sm" onClick={publishTestBankToMarketplace} disabled={tbPublishing || !tbPrice || !tbExportAllowed()} className="w-full h-8 text-[11px] gap-1.5" data-testid="button-tb-publish">
                        {tbPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        {tbPublishing ? "Publishing..." : "Publish to Marketplace"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (leftPanel === "imagelab") {
      const generateImages = async () => {
        if (!imgPrompt.trim()) {
          toast({ title: "Enter a prompt", variant: "destructive" });
          return;
        }
        setImgLoading(true);
        setImgResults([]);
        try {
          const res = await adminFetch("/api/admin/images/generate", {
            method: "POST",
            body: {
              prompt: imgPrompt,
              negativePrompt: imgNegative,
              size: imgSize,
              n: imgCount,
              textFree: imgTextFree,
            },
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Generation failed");
          }
          const data = await res.json();
          setImgResults(data.assets || []);
          toast({ title: "Images generated", description: `${(data.assets || []).length} image(s) ready` });
        } catch (e: any) {
          toast({ title: "Image Error", description: e.message, variant: "destructive" });
        } finally {
          setImgLoading(false);
        }
      };

      const insertImageToCanvas = (url: string) => {
        pushUndo();
        const newObj: CanvasObject = {
          id: uid(),
          type: "image" as const,
          x: MARGIN,
          y: MARGIN,
          width: CANVAS_WIDTH - MARGIN * 2,
          height: 300,
          src: url,
          rotation: 0,
          opacity: 1,
          zIndex: objects.length,
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
        toast({ title: "Image inserted into canvas" });
      };

      return (
        <div className="w-64 bg-white border-r overflow-y-auto shrink-0">
          <div className="p-3 border-b">
            <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <ImagePlus className="w-3.5 h-3.5 text-primary" /> Image Lab
            </span>
          </div>
          <div className="p-3 space-y-3">
            <div>
              <label className="text-[10px] font-medium text-gray-500 block mb-1">{t("pages.productBuilder.prompt")}</label>
              <textarea
                value={imgPrompt}
                onChange={e => setImgPrompt(e.target.value)}
                placeholder={t("pages.productBuilder.aWarmPastelIllustrationOf")}
                className="w-full text-xs border rounded-md px-2 py-1.5 h-24 resize-none"
                data-testid="textarea-img-prompt"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-gray-500 block mb-1">{t("pages.productBuilder.negativePrompt")}</label>
              <textarea
                value={imgNegative}
                onChange={e => setImgNegative(e.target.value)}
                placeholder={t("pages.productBuilder.blurryLowQualityDistorted")}
                className="w-full text-xs border rounded-md px-2 py-1.5 h-12 resize-none"
                data-testid="textarea-img-negative"
              />
            </div>
            <label className="flex items-center gap-2 text-[10px] font-medium text-gray-600 cursor-pointer">
              <input type="checkbox" checked={imgTextFree} onChange={e => setImgTextFree(e.target.checked)} className="rounded" data-testid="checkbox-img-textfree" />
              Text-Free Mode
              <span className="text-gray-400">{t("pages.productBuilder.noWordslabels")}</span>
            </label>
            {imgTextFree && (
              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full" data-testid="badge-text-free">
                Text-Free Mode Active
              </span>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">{t("pages.productBuilder.size")}</label>
                <select value={imgSize} onChange={e => setImgSize(e.target.value)} className="w-full text-[10px] border rounded-md px-2 py-1" data-testid="select-img-size">
                  <option value="1024x1024">{t("pages.productBuilder.square1024x1024")}</option>
                  <option value="1024x1792">{t("pages.productBuilder.portrait1024x1792")}</option>
                  <option value="1792x1024">{t("pages.productBuilder.landscape1792x1024")}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">{t("pages.productBuilder.count2")}</label>
                <select value={imgCount} onChange={e => setImgCount(Number(e.target.value))} className="w-full text-[10px] border rounded-md px-2 py-1" data-testid="select-img-count">
                  <option value={1}>{t("pages.productBuilder.1Image")}</option>
                  <option value={2}>{t("pages.productBuilder.2Images")}</option>
                  <option value={3}>{t("pages.productBuilder.3Images")}</option>
                  <option value={4}>{t("pages.productBuilder.4Images")}</option>
                </select>
              </div>
            </div>
            <Button
              size="sm"
              onClick={generateImages}
              disabled={imgLoading || !imgPrompt.trim()}
              className="w-full h-8 text-[11px] gap-1"
              data-testid="button-generate-images"
            >
              {imgLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImagePlus className="w-3 h-3" />}
              {imgLoading ? "Generating..." : "Generate Images"}
            </Button>
            {imgResults.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                <p className="text-[10px] font-semibold text-gray-600">{imgResults.length} image(s) ready</p>
                <div className="grid grid-cols-2 gap-2">
                  {imgResults.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt={t("pages.productBuilder.generated2")} className="w-full aspect-square object-cover rounded-lg border" />
                      <button
                        onClick={() => insertImageToCanvas(img.url)}
                        className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        data-testid={`button-insert-img-${img.id}`}
                      >
                        <span className="text-white text-[10px] font-medium bg-primary px-2 py-1 rounded">{t("pages.productBuilder.insert")}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (leftPanel === "blocks") {
      const categories = [...new Set(CONTENT_BLOCK_LIBRARY.map(b => b.category))];
      return (
        <div className="w-72 bg-white border-r overflow-y-auto shrink-0" data-testid="panel-blocks">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800">{t("pages.productBuilder.contentBlocks")}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">{t("pages.productBuilder.clickBlocksToAddStructured")}</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.productPresets")}</span>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCT_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => loadProductPreset(p.id)}
                    className="h-12 rounded-xl border hover:bg-primary/5 hover:border-primary/20 text-[10px] font-medium text-gray-600 transition flex flex-col items-center justify-center"
                    data-testid={`button-preset-panel-${p.id}`}
                  >
                    <span className="font-semibold">{p.label}</span>
                    <span className="text-[9px] text-gray-400">{p.blocks.length} blocks</span>
                  </button>
                ))}
              </div>
            </div>
            {categories.map(cat => (
              <div key={cat} className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
                <span className="text-xs font-semibold text-gray-700 block mb-2 capitalize">{cat}</span>
                <div className="space-y-1">
                  {CONTENT_BLOCK_LIBRARY.filter(b => b.category === cat).map(block => (
                    <button
                      key={block.id}
                      onClick={() => insertBlockToCanvas(block.id)}
                      className="w-full text-left px-3 py-2.5 rounded-xl border hover:bg-primary/5 hover:border-primary/20 text-[11px] font-medium text-gray-600 transition flex items-center gap-2.5"
                      data-testid={`button-block-panel-${block.id}`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-primary font-bold">{block.label.charAt(0)}</span>
                      </div>
                      {block.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (leftPanel === "brand") {
      const paletteSwatches: { color: string; label: string }[] = [
        { color: theme.primaryColor, label: "Primary" },
        { color: theme.secondaryColor, label: "Secondary" },
        { color: theme.accentColor, label: "Accent" },
        { color: theme.headingColor, label: "Heading" },
        { color: theme.bodyColor, label: "Body" },
        { color: theme.dangerColor, label: "Danger" },
        { color: theme.successColor, label: "Success" },
        { color: theme.warningColor, label: "Warning" },
        { color: theme.backgroundColor, label: "Page BG" },
        { color: theme.sectionBg, label: "Section" },
      ];

      const textPresets: { label: string; preview: string; fontSize: number; fontWeight: string; fontFamily: string; testId: string }[] = [
        { label: "H1 Heading", preview: "Aa", fontSize: 24, fontWeight: "bold", fontFamily: theme.headingFont, testId: "button-style-heading" },
        { label: "H2 Subhead", preview: "Aa", fontSize: 16, fontWeight: "bold", fontFamily: theme.headingFont, testId: "button-style-h2" },
        { label: "H3 Section", preview: "Aa", fontSize: 14, fontWeight: "600", fontFamily: theme.headingFont, testId: "button-style-subheading" },
        { label: "Body", preview: "Aa", fontSize: 11, fontWeight: "normal", fontFamily: theme.bodyFont, testId: "button-style-body" },
        { label: "Caption", preview: "Aa", fontSize: 9, fontWeight: "600", fontFamily: theme.bodyFont, testId: "button-style-caption" },
        { label: "Footnote", preview: "Aa", fontSize: 8, fontWeight: "normal", fontFamily: theme.bodyFont, testId: "button-style-footnote" },
      ];

      return (
        <div className="w-72 bg-white border-r overflow-y-auto shrink-0" data-testid="panel-brand">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <SwatchBook className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800">{t("pages.productBuilder.brandKit")}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">{t("pages.productBuilder.keepEveryPageOnbrandAnd")}</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">{t("pages.productBuilder.theme")}</span>
                <span className="text-[10px] text-gray-400">{theme.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-[280px] overflow-y-auto pr-1" data-testid="select-brand-theme">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => switchTheme(t.id)}
                    className={`p-2 rounded-xl border-2 flex items-center gap-2 transition text-left ${activeThemeId === t.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
                    data-testid={`button-canvas-theme-${t.id}`}
                  >
                    <div className="flex gap-0.5 shrink-0">
                      <div className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: t.primaryColor }} />
                      <div className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: t.accentColor }} />
                    </div>
                    <span className="text-[9px] font-medium text-gray-600 truncate">{t.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <span className="text-[10px] text-gray-400 block mb-1.5">{t("pages.productBuilder.palette")}</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {paletteSwatches.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 group" title={`${s.label}: ${s.color}`}>
                      <button
                        className="w-8 h-8 rounded-lg border border-gray-200 hover:ring-2 hover:ring-primary/30 transition cursor-pointer"
                        style={{ backgroundColor: s.color }}
                        onClick={() => {
                          if (selectedId) { pushUndo(); updateObject(selectedId, { fill: s.color }); }
                        }}
                        data-testid={`swatch-${s.label.toLowerCase().replace(/\s/g, "-")}`}
                      />
                      <span className="text-[7px] text-gray-400 leading-none">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.coverPreset")}</span>
              <div className="grid grid-cols-2 gap-2">
                {COVER_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setCoverPresetId(p.id); generateCoverForCurrentProject(p.id); }}
                    className={`h-14 rounded-xl border text-[10px] font-medium transition flex flex-col items-center justify-center gap-1 ${coverPresetId === p.id ? "bg-primary/10 border-primary text-primary ring-1 ring-primary/20" : "hover:bg-gray-50 text-gray-600"}`}
                    data-testid={`button-cover-preset-${p.id}`}
                  >
                    <div className="w-6 h-3 rounded-sm" style={{ background: p.bgStyle === "gradient" ? `linear-gradient(135deg, ${theme.coverBg}, ${theme.primaryColor})` : p.bgStyle === "split" ? `linear-gradient(180deg, ${theme.coverBg} 50%, ${theme.accentColor} 50%)` : theme.coverBg }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm space-y-3">
              <span className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.yourLogo")}</span>
              <div className="space-y-2">
                <label className="flex items-center justify-center w-full h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 cursor-pointer transition-colors bg-gray-50/50" data-testid="label-upload-logo">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadBrandLogo(f); e.target.value = ""; }}
                    data-testid="input-upload-logo"
                  />
                  {logoUploading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-[10px]">{t("pages.productBuilder.uploading")}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <ImagePlus className="w-5 h-5" />
                      <span className="text-[10px] font-medium">{t("pages.productBuilder.uploadLogo")}</span>
                      <span className="text-[8px]">{t("pages.productBuilder.pngSvgJpgWebp")}</span>
                    </div>
                  )}
                </label>
                {brandLogos.length > 0 && (
                  <div className="space-y-2">
                    {brandLogos.map((logo, li) => (
                      <div key={li} className="rounded-xl border border-gray-100 bg-white p-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-10 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                            <img src={logo.url} alt={logo.fileName} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-gray-600 truncate">{logo.fileName}</p>
                            <p className="text-[8px] text-gray-400">{t("pages.productBuilder.autotintsWithThemeChanges")}</p>
                          </div>
                          <button onClick={() => setBrandLogos(prev => prev.filter((_, i) => i !== li))} className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-400" data-testid={`button-remove-logo-${li}`}>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            onClick={() => insertBrandLogo(logo.url, "original")}
                            className="h-7 px-2 rounded-lg border text-[9px] font-medium hover:bg-gray-50 flex items-center gap-1 text-gray-600"
                            title={t("pages.productBuilder.originalColours")}
                            data-testid={`button-logo-original-${li}`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-gradient-to-br from-red-300 via-blue-300 to-green-300" />
                            Original
                          </button>
                          <button
                            onClick={() => insertBrandLogo(logo.url, "black")}
                            className="h-7 px-2 rounded-lg border text-[9px] font-medium hover:bg-gray-50 flex items-center gap-1 text-gray-600"
                            title={t("pages.productBuilder.black")}
                            data-testid={`button-logo-black-${li}`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-black border border-gray-300" />
                            Black
                          </button>
                          <button
                            onClick={() => insertBrandLogo(logo.url, "white")}
                            className="h-7 px-2 rounded-lg border text-[9px] font-medium hover:bg-gray-50 flex items-center gap-1 text-gray-600"
                            title={t("pages.productBuilder.whiteForDarkBackgrounds")}
                            data-testid={`button-logo-white-${li}`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-white border border-gray-300" />
                            White
                          </button>
                          {[theme.primaryColor, theme.secondaryColor, theme.accentColor].map((c, ci) => (
                            <button
                              key={ci}
                              onClick={() => insertBrandLogo(logo.url, c)}
                              className="h-7 w-7 rounded-lg border hover:ring-2 hover:ring-primary/30 flex items-center justify-center"
                              title={`Tint: ${c}`}
                              data-testid={`button-logo-tint-${li}-${ci}`}
                            >
                              <div className="w-3.5 h-3.5 rounded-full border border-white/50" style={{ backgroundColor: c }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">{t("pages.productBuilder.brandLock")}</span>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={brandLock} onChange={e => setBrandLock(e.target.checked)} className="rounded" data-testid="checkbox-brand-lock-panel" />
                  {brandLock ? "Active" : "Off"}
                </label>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">{t("pages.productBuilder.whenActivePreventsOffpaletteColors")}</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.textStyles")}</span>
              <div className="space-y-1.5">
                {textPresets.map(tp => (
                  <div key={tp.testId} className="flex items-center gap-2">
                    <div className="flex-1 flex items-baseline gap-2 min-w-0">
                      <span style={{ fontSize: Math.min(tp.fontSize, 16), fontWeight: tp.fontWeight as any, fontFamily: tp.fontFamily, color: theme.headingColor }} className="shrink-0">{tp.preview}</span>
                      <span className="text-[10px] text-gray-500 truncate">{tp.label} ({tp.fontSize}px)</span>
                    </div>
                    <button
                      className="h-6 px-2.5 rounded-lg bg-primary/10 text-primary text-[9px] font-medium hover:bg-primary/20 transition disabled:opacity-30"
                      onClick={() => selectedId && (pushUndo(), updateObject(selectedId, { fontSize: tp.fontSize, fontWeight: tp.fontWeight, fontFamily: tp.fontFamily }))}
                      disabled={!selectedId}
                      data-testid={tp.testId}
                    >{t("pages.productBuilder.apply")}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.quickActions")}</span>
              <div className="space-y-2">
                <button className="w-full h-10 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold" onClick={makeStoreReady} data-testid="button-store-ready">{t("pages.productBuilder.makeStoreready")}</button>
                <button className="w-full h-10 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-medium text-primary" onClick={() => generateCoverForCurrentProject()} data-testid="button-generate-cover">{t("pages.productBuilder.generateCoverPage")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={beautifyPage} data-testid="button-brand-beautify">{t("pages.productBuilder.beautifyLayout")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={runDesignAudit} data-testid="button-brand-audit">{brandVerified ? "Re-Audit (Verified)" : "Run Design Audit"}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={applyBrandTypography} data-testid="button-brand-fonts">{t("pages.productBuilder.applyThemeFonts")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={applyThemeToAllPages} data-testid="button-brand-apply-all">{t("pages.productBuilder.applyToAllPages")}</button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">{t("pages.productBuilder.autoStoreready")}</span>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={autoStoreReady} onChange={e => setAutoStoreReady(e.target.checked)} className="rounded" data-testid="checkbox-auto-store-ready" />
                  {autoStoreReady ? "On" : "Off"}
                </label>
              </div>
              <p className="text-[11px] text-gray-500">{t("pages.productBuilder.autorunStorereadyAfterAiGeneration")}</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.blockLibrary")}</span>
              <p className="text-[10px] text-gray-400 mb-2">{t("pages.productBuilder.clickToAddContentBlocks")}</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {CONTENT_BLOCK_LIBRARY.map(block => (
                  <button
                    key={block.id}
                    onClick={() => insertBlockToCanvas(block.id)}
                    className="w-full text-left px-3 py-2 rounded-xl border hover:bg-primary/5 hover:border-primary/20 text-[10px] font-medium text-gray-600 transition flex items-center gap-2"
                    data-testid={`button-block-${block.id}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    {block.label}
                    <span className="ml-auto text-[9px] text-gray-300">{block.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.productPresets2")}</span>
              <p className="text-[10px] text-gray-400 mb-2">{t("pages.productBuilder.oneclickPresetLoadsAllBlocks")}</p>
              <div className="space-y-1.5">
                {PRODUCT_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => loadProductPreset(p.id)}
                    className="w-full h-9 rounded-xl border hover:bg-gray-50 text-[10px] font-medium text-gray-600 flex items-center justify-between px-3"
                    data-testid={`button-preset-${p.id}`}
                  >
                    {p.label}
                    <span className="text-[9px] text-gray-300">{p.blocks.length} blocks</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.layoutPresets")}</span>
              <div className="space-y-2">
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={() => applyLayoutPreset("stack")} data-testid="button-layout-stack">{t("pages.productBuilder.stackLayout")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={() => applyLayoutPreset("two-col")} data-testid="button-layout-two-col">{t("pages.productBuilder.twoColumnLayout")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={() => applyLayoutPreset("hero-cards")} data-testid="button-layout-hero">{t("pages.productBuilder.heroCardsLayout")}</button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm">
              <span className="text-xs font-semibold text-gray-700 block mb-2">{t("pages.productBuilder.textAutofit")}</span>
              <div className="space-y-2">
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={() => autofitText("expand")} data-testid="button-autofit-expand">{t("pages.productBuilder.expandBoxesToFit")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={() => autofitText("shrink")} data-testid="button-autofit-shrink">{t("pages.productBuilder.shrinkFontToFit")}</button>
                <button className="w-full h-10 rounded-xl border hover:bg-gray-50 text-xs" onClick={highlightOverflows} data-testid="button-find-overflows">{t("pages.productBuilder.findOverflows")}</button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-4 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.display")}</span>
              <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={showLogo} onChange={e => { setShowLogo(e.target.checked); if (e.target.checked) insertLogoFooter(); }} className="rounded" />
                Include logo on pages
              </label>
              <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={showMargins} onChange={e => setShowMargins(e.target.checked)} className="rounded" />
                Margin guides
              </label>
              <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="rounded" />
                Grid overlay
              </label>
            </div>

            <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-white to-green-50 p-4 shadow-sm space-y-1.5">
              <span className="text-xs font-semibold text-gray-700 block">{t("pages.productBuilder.aiStatus")}</span>
              {aiStatus ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${aiStatus.enabled ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-[10px] text-gray-600">{aiStatus.enabled ? "AI Enabled" : "AI Disabled"}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Model: {aiStatus.model}</p>
                  <p className="text-[10px] text-gray-400">Today: {aiStatus.usage.itemsGenerated} items, {aiStatus.usage.tokensUsed.toLocaleString()} tokens</p>
                </>
              ) : (
                <button onClick={async () => {
                  try {
                    const r = await adminFetch("/api/admin/ai-config");
                    if (r.ok) setAiStatus(await r.json());
                  } catch {}
                }} className="text-[10px] text-primary hover:underline" data-testid="button-load-ai-status">{t("pages.productBuilder.loadAiStatus")}</button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "#f6f7fb" }}>
      <div className="h-13 bg-white border-b flex items-center justify-between px-4 shrink-0" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { saveCanvas(); onBack(); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-back-to-projects">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => { saveCanvas(); onBack(); }} className="text-gray-400 hover:text-primary transition-colors text-xs font-medium" data-testid="link-drafts">{t("pages.productBuilder.drafts2")}</button>
            <span className="text-gray-200">/</span>
            <span className="font-semibold text-gray-800 text-sm">{project?.title || "Loading..."}</span>
          </div>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">{project?.type}</span>
          <span className="text-[10px] text-gray-400 tabular-nums">{pages.length} page{pages.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 mr-2 pr-2 border-r border-gray-100">
            {saving ? (
              <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><Loader2 className="w-3 h-3 animate-spin" />{t("pages.productBuilder.saving")}</span>
            ) : lastSavedAt ? (
              <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium" title={`Last saved at ${lastSavedAt.toLocaleTimeString()}`}>
                <CheckCircle className="w-3 h-3" />
                Saved {lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            ) : (
              <span className="text-[10px] text-gray-400">{t("pages.productBuilder.autosaveOn")}</span>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={saveCanvas} className="h-8 text-xs gap-1.5 rounded-lg font-medium border-gray-200 hover:bg-gray-50" data-testid="button-save-canvas"><Save className="w-3.5 h-3.5" /> {t("pages.productBuilder.save")}</Button>
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
            <Button size="sm" variant="ghost" onClick={exportAsPDF} disabled={exporting} className="h-7 text-[11px] gap-1 rounded-md px-2.5 hover:bg-white hover:shadow-sm font-medium" data-testid="button-export-pdf">
              {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />} PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={exportAsImages} disabled={exporting} className="h-7 text-[11px] gap-1 rounded-md px-2.5 hover:bg-white hover:shadow-sm font-medium" data-testid="button-export-png">
              <Image className="w-3 h-3" /> PNG
            </Button>
            <Button size="sm" variant="ghost" onClick={exportInstagramCarousel} disabled={exporting} className="h-7 text-[11px] gap-1 rounded-md px-2.5 hover:bg-white hover:shadow-sm font-medium" data-testid="button-export-ig">
              <ImagePlus className="w-3 h-3" /> IG
            </Button>
            <Button size="sm" variant="ghost" onClick={exportEtsyStorePack} disabled={exporting} className="h-7 text-[11px] gap-1 rounded-md px-2.5 hover:bg-white hover:shadow-sm font-medium" data-testid="button-export-etsy">
              <ShoppingCart className="w-3 h-3" /> Etsy
            </Button>
          </div>
          <Button size="sm" onClick={() => { setPublishForm(f => ({ ...f, title: project?.title || "" })); setShowPublishDialog(true); }} className="h-8 text-xs gap-1.5 rounded-lg font-semibold shadow-sm" data-testid="button-publish-marketplace">
            <ShoppingCart className="w-3.5 h-3.5" /> Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[72px] border-r flex flex-col items-center py-3 shrink-0" style={{ backgroundColor: "#fafafa" }}>
          <div className="flex flex-col items-center gap-0.5 w-full px-[5px]">
            <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-1 self-start pl-2">{t("pages.productBuilder.create")}</span>
            <button onClick={() => setLeftPanel(leftPanel === "templates" ? null : "templates" as any)} className={`w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 ${leftPanel === "templates" ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"}`} data-testid="button-panel-templates">
              <LayoutTemplate className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">{t("pages.productBuilder.templates")}</span>
            </button>
            <button onClick={() => setLeftPanel(leftPanel === "components" ? null : "components" as any)} className={`w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 ${leftPanel === "components" ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"}`} data-testid="button-panel-components">
              <Sparkles className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">{t("pages.productBuilder.elements2")}</span>
            </button>
            <button onClick={() => addObject("text")} className="w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all duration-150" data-testid="button-add-text">
              <Type className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">{t("pages.productBuilder.text")}</span>
            </button>
            <button onClick={() => setLeftPanel(leftPanel === "imagelab" ? null : "imagelab" as any)} className={`w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 ${leftPanel === "imagelab" ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"}`} data-testid="button-panel-imagelab">
              <ImagePlus className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">{t("pages.productBuilder.images")}</span>
            </button>
          </div>
          <div className="w-10 my-2" style={{ borderTop: "1px solid #e5e7eb" }} />
          <div className="flex flex-col items-center gap-0.5 w-full px-[5px]">
            <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-1 self-start pl-2">{t("pages.productBuilder.tools")}</span>
            <button onClick={() => setLeftPanel(leftPanel === "brand" ? null : "brand" as any)} className={`w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 ${leftPanel === "brand" ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"}`} data-testid="button-panel-brand">
              <SwatchBook className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">{t("pages.productBuilder.brand")}</span>
            </button>
            <button onClick={() => setLeftPanel(leftPanel === "ai" ? null : "ai" as any)} className={`w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 ${leftPanel === "ai" ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"}`} data-testid="button-panel-ai">
              <Brain className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">AI</span>
            </button>
            <button onClick={() => setLeftPanel(leftPanel === "blocks" ? null : "blocks" as any)} className={`w-full h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 ${leftPanel === "blocks" ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"}`} data-testid="button-panel-blocks">
              <Grid3X3 className="w-[18px] h-[18px]" />
              <span className="text-[9px] font-semibold leading-none">{t("pages.productBuilder.blocks")}</span>
            </button>
          </div>
          <div className="mt-auto pt-3 w-full flex flex-col items-center gap-1 px-[5px]">
            <button onClick={undo} className="w-full h-7 rounded-lg text-[9px] font-medium hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all" title={t("pages.productBuilder.undoCtrlz")} data-testid="button-undo">{t("pages.productBuilder.undo")}</button>
            <button onClick={redo} className="w-full h-7 rounded-lg text-[9px] font-medium hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all" title={t("pages.productBuilder.redoCtrly")} data-testid="button-redo">{t("pages.productBuilder.redo")}</button>
          </div>
        </div>

        {renderLeftPanel()}

        <div className="flex-1 overflow-auto relative" style={{ backgroundColor: "#f6f7fb" }}>
          <div className="min-h-full w-full flex items-center justify-center px-10 py-10">
            <div className="relative">
              <div className="relative rounded-lg bg-white transition-all duration-200" style={{ boxShadow: "0 25px 60px -10px rgba(0,0,0,0.22), 0 10px 20px -6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)" }}>
                <div
                  ref={canvasRef}
                  className="bg-white relative select-none rounded-lg"
                  style={{ width: CANVAS_WIDTH * SCALE, height: CANVAS_HEIGHT * SCALE }}
                  onMouseDown={(e) => handleCanvasMouseDown(e)}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  data-testid="canvas-area"
                >
                  {showGrid && (
                    <svg className="absolute inset-0 pointer-events-none" width={CANVAS_WIDTH * SCALE} height={CANVAS_HEIGHT * SCALE} style={{ opacity: 0.08 }}>
                      {Array.from({ length: Math.floor(CANVAS_WIDTH / GRID_SIZE) + 1 }).map((_, i) => (
                        <line key={`v${i}`} x1={i * GRID_SIZE * SCALE} y1={0} x2={i * GRID_SIZE * SCALE} y2={CANVAS_HEIGHT * SCALE} stroke="#000" strokeWidth={0.5} />
                      ))}
                      {Array.from({ length: Math.floor(CANVAS_HEIGHT / GRID_SIZE) + 1 }).map((_, i) => (
                        <line key={`h${i}`} x1={0} y1={i * GRID_SIZE * SCALE} x2={CANVAS_WIDTH * SCALE} y2={i * GRID_SIZE * SCALE} stroke="#000" strokeWidth={0.5} />
                      ))}
                    </svg>
                  )}
                  {showMargins && (
                    <div className="absolute pointer-events-none" style={{ left: MARGIN * SCALE, top: MARGIN * SCALE, right: MARGIN * SCALE, bottom: MARGIN * SCALE, border: "1px dashed rgba(124,58,237,0.15)" }} />
                  )}

                  {[...objects].sort((a, b) => a.zIndex - b.zIndex).map(obj => {
                    const isSelected = selectedIds.includes(obj.id);
                    return (
                      <div
                        key={obj.id}
                        style={{
                          position: "absolute",
                          left: obj.x * SCALE,
                          top: obj.y * SCALE,
                          width: obj.width * SCALE,
                          height: obj.height * SCALE,
                          transform: `rotate(${obj.rotation || 0}deg)`,
                          opacity: obj.opacity ?? 1,
                          cursor: obj.locked ? "default" : (isDragging && isSelected ? "grabbing" : "grab"),
                          outline: isSelected ? (selectedId === obj.id ? `2px solid ${theme.primaryColor}` : `2px solid ${theme.primaryColor}59`) : "none",
                          outlineOffset: "2px",
                          zIndex: obj.zIndex,
                          transition: "box-shadow 0.15s ease",
                          boxShadow: isSelected ? `0 0 0 2px ${theme.primaryColor}33` : "none",
                        }}
                        onMouseDown={(e) => handleCanvasMouseDown(e, obj.id)}
                        data-testid={`canvas-object-${obj.id}`}
                      >
                        {obj.type === "text" && (
                          <div style={{ width: "100%", height: "100%", fontSize: (obj.fontSize || 16) * SCALE, fontFamily: obj.fontFamily || "Inter", fontWeight: obj.fontWeight || "normal", color: obj.fill || "#333", textAlign: (obj.textAlign as any) || "left", display: "flex", alignItems: "flex-start", padding: "2px", overflow: "hidden", userSelect: "none", lineHeight: 1.3, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {obj.content}
                          </div>
                        )}
                        {obj.type === "rect" && (
                          <div style={{ width: "100%", height: "100%", backgroundColor: obj.fill || "#e2e8f0", border: obj.stroke ? `${(obj.strokeWidth || 1) * SCALE}px solid ${obj.stroke}` : "none", borderRadius: (obj.borderRadius || 0) * SCALE }} />
                        )}
                        {obj.type === "circle" && (
                          <div style={{ width: "100%", height: "100%", backgroundColor: obj.fill || "#e2e8f0", border: obj.stroke ? `${(obj.strokeWidth || 1) * SCALE}px solid ${obj.stroke}` : "none", borderRadius: "50%" }} />
                        )}
                        {obj.type === "image" && (
                          <div style={{ width: "100%", height: "100%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {obj.src ? <img src={obj.src} alt={obj.tag === "brand-logo" ? "Brand logo" : "Product image"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: obj.tag === "brand-logo" ? "contain" : "cover", filter: obj.filter || undefined }} /> : <Image className="w-8 h-8 text-gray-300" />}
                          </div>
                        )}
                        {isSelected && !obj.locked && selectedIds.length === 1 && (
                          <div className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-primary rounded-full cursor-se-resize border-2 border-white shadow" onMouseDown={handleResizeStart} data-testid="resize-handle" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/90 backdrop-blur-sm px-4 py-2.5" style={{ minWidth: CANVAS_WIDTH * SCALE, boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-2.5">
                  <button onClick={zoomOut} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors" data-testid="button-zoom-out"><ZoomOut className="w-4 h-4" /></button>
                  <input type="range" min={25} max={200} step={5} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-32 h-1 accent-primary" data-testid="slider-zoom" />
                  <button onClick={zoomIn} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors" data-testid="button-zoom-in"><ZoomIn className="w-4 h-4" /></button>
                  <span className="text-[11px] font-semibold text-gray-500 w-10 text-center tabular-nums" data-testid="text-zoom-level">{zoom}%</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                  <button onClick={zoomFit} className={`h-7 px-3 rounded-md text-[10px] font-semibold transition-all ${zoom === 85 ? "bg-white shadow-sm text-gray-700" : "text-gray-500 hover:text-gray-700"}`} data-testid="button-zoom-fit">{t("pages.productBuilder.fit")}</button>
                  <button onClick={zoomActual} className={`h-7 px-3 rounded-md text-[10px] font-semibold transition-all ${zoom === 100 ? "bg-white shadow-sm text-gray-700" : "text-gray-500 hover:text-gray-700"}`} data-testid="button-zoom-100">100%</button>
                  <button onClick={() => setZoom(Math.min(200, Math.round((window.innerHeight - 200) / CANVAS_HEIGHT * 100)))} className="h-7 px-3 rounded-md text-[10px] font-semibold text-gray-500 hover:text-gray-700 transition-all" data-testid="button-zoom-fill">{t("pages.productBuilder.fill")}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-60 bg-white border-l overflow-y-auto shrink-0">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">Pages ({pages.length})</span>
              </div>
              <button onClick={addPage} className="text-[10px] px-2 py-1 rounded-lg border hover:bg-gray-50 text-gray-500 hover:text-primary transition" data-testid="button-add-page">{t("pages.productBuilder.add")}</button>
            </div>
            <div className="space-y-2">
              {pages.map((page, i) => {
                const isActive = i === currentPageIndex;
                const thumbSrc = pageThumbs[page.id] || "";
                return (
                  <div
                    key={page.id}
                    onClick={() => switchPage(i)}
                    className={`group relative rounded-xl border-2 p-1 cursor-pointer transition-all ${isActive ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-transparent hover:border-gray-200"}`}
                    data-testid={`button-page-${i + 1}`}
                  >
                    <div className="w-full aspect-[612/792] rounded-lg overflow-hidden bg-white border border-gray-100">
                      {thumbSrc ? (
                        <img src={thumbSrc} className="w-full h-full object-cover" alt={`Page ${i + 1}`} />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg text-gray-200 font-bold">{i + 1}</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1 px-0.5">
                      <span className="text-[10px] font-medium text-gray-500">{i + 1}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); duplicatePage(i); }} className="text-gray-400 hover:text-primary p-0.5 rounded" data-testid={`button-dup-page-${i + 1}`}>
                          <Copy className="w-3 h-3" />
                        </button>
                        {pages.length > 1 && (
                          <button onClick={(e) => { e.stopPropagation(); deletePage(page.id, i); }} className="text-gray-400 hover:text-red-500 p-0.5 rounded" data-testid={`button-del-page-${i + 1}`}>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={addPage} className="w-full aspect-[612/792] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-primary transition-colors" data-testid="button-add-page-bottom">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-3 border-b">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] text-gray-400">{t("pages.productBuilder.align")}</span>
              <div className="flex gap-1">
                <button onClick={() => alignSelected("left")} className="p-1 rounded hover:bg-gray-100" title={t("pages.productBuilder.alignLeft")} data-testid="button-align-left"><AlignLeft className="w-3.5 h-3.5 text-gray-500" /></button>
                <button onClick={() => alignSelected("center")} className="p-1 rounded hover:bg-gray-100" title={t("pages.productBuilder.alignCenter")} data-testid="button-align-center"><AlignCenter className="w-3.5 h-3.5 text-gray-500" /></button>
                <button onClick={() => alignSelected("right")} className="p-1 rounded hover:bg-gray-100" title={t("pages.productBuilder.alignRight")} data-testid="button-align-right"><AlignRight className="w-3.5 h-3.5 text-gray-500" /></button>
                <button onClick={() => alignSelected("distribute")} className="p-1 rounded hover:bg-gray-100" title={t("pages.productBuilder.distribute")} data-testid="button-distribute"><AlignVerticalJustifyCenter className="w-3.5 h-3.5 text-gray-500" /></button>
              </div>
            </div>
            {selectedIds.length > 1 && (
              <div className="space-y-1.5 mt-2">
                <span className="text-[10px] font-semibold text-gray-600">{selectedIds.length} selected</span>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={bringForward} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-bring-forward"><ArrowUp className="w-3 h-3" />{t("pages.productBuilder.fwd")}</button>
                  <button onClick={sendBackward} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-send-backward"><ArrowDown className="w-3 h-3" />{t("pages.productBuilder.back")}</button>
                  <button onClick={toggleLockSelected} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-lock-toggle"><Lock className="w-3 h-3" />{t("pages.productBuilder.lock")}</button>
                  <button onClick={groupSelected} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-group"><Group className="w-3 h-3" />{t("pages.productBuilder.group")}</button>
                  <button onClick={ungroupSelected} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-ungroup"><Ungroup className="w-3 h-3" />{t("pages.productBuilder.ungroup")}</button>
                  <Button size="sm" variant="destructive" onClick={deleteSelected} className="h-7 text-[10px] gap-1" data-testid="button-delete-multi"><Trash2 className="w-3 h-3" />{t("pages.productBuilder.del")}</Button>
                </div>
              </div>
            )}
          </div>

          {selectedObj && (
            <div className="p-3 border-b" data-testid="panel-properties">
              <span className="text-xs font-semibold text-gray-600 mb-2 block">{t("pages.productBuilder.properties")}</span>
              <div className="space-y-2">
                {selectedObj.type === "text" && (
                  <>
                    <Textarea value={selectedObj.content || ""} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { content: e.target.value }); }} className="text-xs" rows={2} data-testid="input-text-content" />
                    <div>
                      <label className="text-[9px] text-gray-400 block mb-0.5">{t("pages.productBuilder.font")}</label>
                      <select
                        value={selectedObj.fontFamily || "Inter"}
                        onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { fontFamily: e.target.value }); }}
                        className="w-full text-xs border rounded px-2 h-8"
                        style={{ fontFamily: selectedObj.fontFamily || "Inter" }}
                        data-testid="select-font-family"
                      >
                        <optgroup label={t("pages.productBuilder.sansserif")}>
                          {FONT_FAMILIES.filter(f => f.category === "sans").map(f => (
                            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label={t("pages.productBuilder.serif")}>
                          {FONT_FAMILIES.filter(f => f.category === "serif").map(f => (
                            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label={t("pages.productBuilder.handwriting")}>
                          {FONT_FAMILIES.filter(f => f.category === "hand").map(f => (
                            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="flex gap-1.5">
                      <Input type="number" value={selectedObj.fontSize || 16} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { fontSize: Number(e.target.value) }); }} className="text-xs w-16" data-testid="input-font-size" />
                      <select value={selectedObj.fontWeight || "normal"} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { fontWeight: e.target.value }); }} className="text-xs border rounded px-2 flex-1" data-testid="select-font-weight">
                        <option value="300">{t("pages.productBuilder.light")}</option>
                        <option value="normal">{t("pages.productBuilder.regular")}</option>
                        <option value="500">{t("pages.productBuilder.medium")}</option>
                        <option value="600">{t("pages.productBuilder.semibold")}</option>
                        <option value="bold">{t("pages.productBuilder.bold")}</option>
                      </select>
                    </div>
                    <div className="flex gap-1">
                      {(["left", "center", "right"] as const).map(align => (
                        <button key={align} onClick={() => { pushUndo(); updateObject(selectedObj.id, { textAlign: align }); }} className={`flex-1 h-7 text-[10px] rounded border ${selectedObj.textAlign === align ? "bg-primary/10 border-primary text-primary" : "border-gray-200 text-gray-500"}`} data-testid={`button-text-${align}`}>
                          {align}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {selectedObj.type === "image" && (
                  <>
                    <Input placeholder={t("pages.productBuilder.imageUrl")} value={selectedObj.src || ""} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { src: e.target.value }); }} className="text-xs" data-testid="input-image-url" />
                    <div>
                      <label className="text-[9px] text-gray-400 block mb-1">{t("pages.productBuilder.colorTint")}</label>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button onClick={() => { pushUndo(); updateObject(selectedObj.id, { filter: undefined }); }} className={`h-6 px-2 rounded text-[9px] border ${!selectedObj.filter ? "bg-primary/10 border-primary text-primary" : "text-gray-500"}`} data-testid="button-tint-original">{t("pages.productBuilder.original")}</button>
                        <button onClick={() => { pushUndo(); updateObject(selectedObj.id, { filter: "brightness(0)" }); }} className={`h-6 px-2 rounded text-[9px] border ${selectedObj.filter === "brightness(0)" ? "bg-primary/10 border-primary text-primary" : "text-gray-500"}`} data-testid="button-tint-black">
                          <div className="w-3 h-3 rounded-full bg-black border border-gray-300 inline-block align-middle mr-1" />Blk
                        </button>
                        <button onClick={() => { pushUndo(); updateObject(selectedObj.id, { filter: "brightness(0) invert(1)" }); }} className={`h-6 px-2 rounded text-[9px] border ${selectedObj.filter === "brightness(0) invert(1)" ? "bg-primary/10 border-primary text-primary" : "text-gray-500"}`} data-testid="button-tint-white">
                          <div className="w-3 h-3 rounded-full bg-white border border-gray-300 inline-block align-middle mr-1" />Wht
                        </button>
                        {[theme.primaryColor, theme.secondaryColor, theme.accentColor].map((c, ci) => {
                          const f = `brightness(0) saturate(100%) ${hexToCssFilter(c)}`;
                          return (
                            <button key={ci} onClick={() => { pushUndo(); updateObject(selectedObj.id, { filter: f }); }} className={`h-6 w-6 rounded border flex items-center justify-center ${selectedObj.filter === f ? "ring-2 ring-primary" : ""}`} title={c} data-testid={`button-tint-theme-${ci}`}>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-1.5">
                  <div>
                    <label className="text-[9px] text-gray-400">{t("pages.productBuilder.fill2")}</label>
                    <input type="color" value={selectedObj.fill || "#333333"} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { fill: e.target.value }); }} className="w-full h-7 rounded border cursor-pointer" data-testid="input-fill-color" />
                  </div>
                  {(selectedObj.type === "rect" || selectedObj.type === "circle") && (
                    <div>
                      <label className="text-[9px] text-gray-400">{t("pages.productBuilder.stroke")}</label>
                      <input type="color" value={selectedObj.stroke || "#94a3b8"} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { stroke: e.target.value }); }} className="w-full h-7 rounded border cursor-pointer" data-testid="input-stroke-color" />
                    </div>
                  )}
                </div>
                {(selectedObj.type === "rect") && (
                  <div>
                    <label className="text-[9px] text-gray-400">{t("pages.productBuilder.radius")}</label>
                    <Input type="number" value={selectedObj.borderRadius || 0} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { borderRadius: Number(e.target.value) }); }} className="text-xs" data-testid="input-border-radius" />
                  </div>
                )}
                <div className="flex gap-1.5">
                  <div>
                    <label className="text-[9px] text-gray-400">W</label>
                    <Input type="number" value={Math.round(selectedObj.width)} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { width: Number(e.target.value) }); }} className="text-xs" data-testid="input-width" />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400">H</label>
                    <Input type="number" value={Math.round(selectedObj.height)} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { height: Number(e.target.value) }); }} className="text-xs" data-testid="input-height" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-gray-400">{t("pages.productBuilder.opacity")}</label>
                  <input type="range" min={0} max={1} step={0.05} value={selectedObj.opacity ?? 1} onChange={(e) => { pushUndo(); updateObject(selectedObj.id, { opacity: Number(e.target.value) }); }} className="w-full h-1.5" data-testid="input-opacity" />
                </div>
                <div className="flex gap-1 flex-wrap pt-1">
                  <button onClick={bringForward} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-bring-forward-single"><ArrowUp className="w-3 h-3" /></button>
                  <button onClick={sendBackward} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-send-backward-single"><ArrowDown className="w-3 h-3" /></button>
                  <button onClick={bringToFront} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-bring-front"><ChevronsUp className="w-3 h-3" /></button>
                  <button onClick={sendToBack} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-send-back"><ChevronsDown className="w-3 h-3" /></button>
                  <button onClick={toggleLockSelected} className="h-7 px-2 rounded-lg border text-[10px] hover:bg-gray-50 flex items-center gap-1" data-testid="button-lock-single">{selectedObj.locked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}</button>
                </div>
                <div className="flex gap-1.5 pt-1">
                  <Button size="sm" variant="outline" onClick={duplicateSelected} className="h-7 text-[10px] flex-1 gap-1" data-testid="button-duplicate"><Copy className="w-3 h-3" /> {t("pages.productBuilder.dup")}</Button>
                  <Button size="sm" variant="destructive" onClick={deleteSelected} className="h-7 text-[10px] flex-1 gap-1" data-testid="button-delete-object"><Trash2 className="w-3 h-3" /> {t("pages.productBuilder.del2")}</Button>
                </div>
              </div>
            </div>
          )}

          <div className="p-3">
            <span className="text-xs font-semibold text-gray-600 mb-2 block">Layers ({objects.length})</span>
            <div className="space-y-0.5 max-h-40 overflow-y-auto">
              {[...objects].reverse().map(obj => (
                <button key={obj.id} onClick={() => setSelectedId(obj.id)} className={`w-full text-left px-2 py-1 rounded text-[10px] flex items-center gap-2 ${selectedIds.includes(obj.id) ? "bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-600"}`} data-testid={`layer-${obj.id}`}>
                  {obj.type === "text" && <Type className="w-3 h-3" />}
                  {obj.type === "rect" && <Square className="w-3 h-3" />}
                  {obj.type === "circle" && <Circle className="w-3 h-3" />}
                  {obj.type === "image" && <Image className="w-3 h-3" />}
                  <span className="truncate">{obj.groupId ? "[Group] " : ""}{obj.type === "text" ? (obj.content || "Text").slice(0, 20) : obj.tag || obj.type}</span>
                  {obj.locked && <Lock className="w-2.5 h-2.5 text-gray-400 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPublishDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">{t("pages.productBuilder.publishToMarketplace")}</h3>
            <p className="text-sm text-gray-500">{t("pages.productBuilder.createAProductListingFrom")}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t("pages.productBuilder.productTitle2")}</label>
                <Input value={publishForm.title} onChange={(e) => setPublishForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Cardiac Assessment Cram Guide" data-testid="input-publish-title" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t("pages.productBuilder.description2")}</label>
                <Textarea value={publishForm.description} onChange={(e) => setPublishForm(f => ({ ...f, description: e.target.value }))} placeholder={t("pages.productBuilder.describeWhatStudentsWillLearn")} rows={3} data-testid="input-publish-description" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t("pages.productBuilder.priceCad2")}</label>
                  <Input type="number" step="0.01" min="0" value={publishForm.price} onChange={(e) => setPublishForm(f => ({ ...f, price: e.target.value }))} placeholder="19.99" data-testid="input-publish-price" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t("pages.productBuilder.category2")}</label>
                  <select value={publishForm.category} onChange={(e) => setPublishForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" data-testid="select-publish-category">
                    <option value="Cram Guide">{t("pages.productBuilder.cramGuide2")}</option>
                    <option value="Quick Reference">{t("pages.productBuilder.quickReference")}</option>
                    <option value="Flashcard Pack">{t("pages.productBuilder.flashcardPack")}</option>
                    <option value="Printable">{t("pages.productBuilder.printable")}</option>
                    <option value="Bundle">{t("pages.productBuilder.bundle")}</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">{t("pages.productBuilder.aThumbnailWillBeGenerated")}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowPublishDialog(false)} className="flex-1" data-testid="button-cancel-publish">{t("pages.productBuilder.cancel2")}</Button>
              <Button onClick={publishToMarketplace} disabled={publishing || !publishForm.title.trim() || !publishForm.price} className="flex-1 gap-1.5" data-testid="button-confirm-publish">
                {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                {publishing ? "Publishing..." : "Publish Draft"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getQueryParam(key: string): string | null {
  try {
    const search = window.location.search;
    return new URLSearchParams(search).get(key);
  } catch { return null; }
}

export default function ProductBuilderPage() {
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/product-builder/:id");
  const [, paramsLocale] = useRoute("/:locale/admin/product-builder/:id");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [editorMode, setEditorMode] = useState<"guided" | "canvas">("guided");

  useEffect(() => {
    const id = params?.id || paramsLocale?.id;
    if (id) setEditingProjectId(id);
  }, [params?.id, paramsLocale?.id]);

  useEffect(() => {
    const mode = getQueryParam("mode");
    if (mode === "canvas") setEditorMode("canvas");
    const isNew = getQueryParam("new");
    if (isNew === "1") setCreatingNew(true);
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">{t("pages.productBuilder.adminAccessRequired")}</p>
      </div>
    );
  }

  const handleBack = () => {
    setEditingProjectId(null);
    setCreatingNew(false);
    setEditorMode("guided");
    navigate("/admin/product-builder");
  };

  if (editingProjectId || creatingNew) {
    if (editorMode === "guided" || !editingProjectId) {
      return (
        <GuidedModeView
          projectId={editingProjectId}
          onBack={handleBack}
          onSwitchToCanvas={() => setEditorMode("canvas")}
          onProjectCreated={(id) => {
            setEditingProjectId(id);
            setCreatingNew(false);
            navigate(`/admin/product-builder/${id}`);
          }}
        />
      );
    }
    return (
      <CanvasEditorView
        projectId={editingProjectId}
        onBack={handleBack}
      />
    );
  }

  return (
    <ProjectListView
      onOpenProject={(id) => { setEditingProjectId(id); navigate(`/admin/product-builder/${id}`); }}
      onCreateNew={() => setCreatingNew(true)}
    />
  );
}
