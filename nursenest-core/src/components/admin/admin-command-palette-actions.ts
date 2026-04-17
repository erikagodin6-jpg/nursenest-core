import type { LucideIcon } from "lucide-react";
import { Database, LayoutDashboard, ListTodo, Wrench } from "lucide-react";

export type AdminCommandPaletteAction = {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  /** Semantic hue for hover row (matches existing palette patterns). */
  accent: "brand" | "success" | "warning" | "info";
};

/** Quick destinations — filtered at runtime with {@link isNavHrefAllowedForStaffTier}. */
export const ADMIN_COMMAND_PALETTE_ACTIONS: AdminCommandPaletteAction[] = [
  {
    id: "dashboard",
    href: "/admin",
    title: "Admin dashboard",
    subtitle: "Command center overview",
    Icon: LayoutDashboard,
    accent: "brand",
  },
  {
    id: "content",
    href: "/admin/content",
    title: "Content & coverage",
    subtitle: "Metrics and pathway snapshot",
    Icon: Database,
    accent: "warning",
  },
  {
    id: "queue",
    href: "/admin/queue",
    title: "Review queue",
    subtitle: "Content and generation queue",
    Icon: ListTodo,
    accent: "info",
  },
  {
    id: "operations",
    href: "/admin/operations",
    title: "System health",
    subtitle: "Operations and platform status",
    Icon: Wrench,
    accent: "info",
  },
];
