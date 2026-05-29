import type { ElementType } from "react";
import {
  Activity,
  BarChart3,
  BookMarked,
  ClipboardList,
  CircleDollarSign,
  Cpu,
  Crosshair,
  FileDown,
  FileText,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartPulse,
  ImageIcon,
  LayoutDashboard,
  Layers,
  Link2,
  ListTodo,
  Megaphone,
  MessageSquare,
  Package,
  Radar,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Stethoscope,
  TestTube2,
  Users,
  Wrench,
  Workflow,
} from "lucide-react";
import { isNavHrefAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import type { StaffTier } from "@/lib/auth/staff-roles";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: ElementType;
  description?: string;
  badge?: number;
};

export type AdminNavGroup = {
  id: string;
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "overview",
    title: "Overview",
    items: [
      { href: "/admin", label: "Command center", icon: LayoutDashboard },
      { href: "/admin/observability", label: "Observability", icon: Radar },
      { href: "/admin/access", label: "Access & roles", icon: Shield },
      { href: "/admin/learner-qa", label: "Learner QA", icon: GraduationCap },
    ],
  },
  {
    id: "users",
    title: "Users",
    items: [
      { href: "/admin/users", label: "Users & support", icon: Users },
      { href: "/admin/beta", label: "Beta access", icon: FlaskConical },
      { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
      { href: "/admin/waitlist", label: "Waitlist", icon: ListTodo },
      { href: "/admin/demo-users", label: "Demo users", icon: TestTube2 },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    items: [
      { href: "/admin/analytics", label: "Analytics hub", icon: BarChart3 },
      { href: "/admin/analytics/users", label: "Users", icon: Users },
      { href: "/admin/analytics/subscriptions", label: "Subscriptions", icon: CircleDollarSign },
      { href: "/admin/analytics/funnels", label: "Funnels", icon: Workflow },
      { href: "/admin/analytics/study-performance", label: "Study performance", icon: BookMarked },
      { href: "/admin/analytics/product-intelligence", label: "Product intelligence", icon: Sparkles },
      { href: "/admin/analytics/weak-areas", label: "Weak areas", icon: Crosshair },
      { href: "/admin/analytics/educator", label: "Educator analytics", icon: GraduationCap },
      { href: "/admin/analytics/content", label: "Content analytics", icon: Layers },
    ],
  },
  {
    id: "content",
    title: "Content",
    items: [
      { href: "/admin/inventory", label: "Inventory", icon: Package },
      { href: "/admin/content-overview", label: "Content overview", icon: Layers },
      { href: "/admin/content-coverage", label: "Coverage", icon: BarChart3 },
      { href: "/admin/content", label: "Quality & pathways", icon: Layers },
      { href: "/admin/content/page-copy", label: "Page copy", icon: SquarePen },
      { href: "/admin/content-quality", label: "Content quality", icon: ShieldCheck },
      { href: "/admin/lessons", label: "Lessons", icon: GraduationCap },
      { href: "/admin/questions", label: "Question bank", icon: ClipboardList },
      { href: "/admin/study-cards", label: "Study cards", icon: ListTodo },
      { href: "/admin/clinical-scenarios", label: "Clinical scenarios", icon: HeartPulse },
      { href: "/admin/osce-stations", label: "OSCE stations", icon: Stethoscope },
      { href: "/admin/courses", label: "Courses", icon: BookMarked },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
      { href: "/admin/printables", label: "Printables", icon: FileDown },
    ],
  },
  {
    id: "publishing",
    title: "Publishing",
    items: [
      { href: "/admin/hub/publishing", label: "Publishing hub", icon: Megaphone },
      { href: "/admin/content-bulk", label: "Bulk automation", icon: Workflow },
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/seo", label: "SEO", icon: Link2 },
      { href: "/admin/eeat-editorial", label: "E-E-A-T editorial", icon: ShieldCheck },
    ],
  },
  {
    id: "automation",
    title: "Automation",
    items: [
      { href: "/admin/hub/ai", label: "AI tools", icon: Cpu },
      { href: "/admin/generation", label: "Generation", icon: Sparkles },
      { href: "/admin/lessons/generate", label: "Lesson AI", icon: Sparkles },
      { href: "/admin/lessons/generate-batch", label: "Lesson batch AI", icon: Sparkles },
      { href: "/admin/ai/exam-questions", label: "Question AI", icon: Stethoscope },
      { href: "/admin/ai/exam-questions/batch", label: "Question batch", icon: Stethoscope },
      { href: "/admin/ai/flashcards", label: "Flashcard AI", icon: Sparkles },
      { href: "/admin/ai/review", label: "AI review", icon: ClipboardList },
      { href: "/admin/queue", label: "Queue", icon: ListTodo },
      { href: "/admin/automation-logs", label: "Automation logs", icon: Activity },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    items: [
      { href: "/admin/subscriptions", label: "Subscriptions", icon: Activity },
      { href: "/admin/premium-protection", label: "Premium protection", icon: Shield },
      { href: "/admin/fraud", label: "Fraud detection", icon: ShieldAlert },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    items: [
      { href: "/admin/product-availability", label: "Product availability", icon: Package },
      { href: "/admin/operations", label: "Operations", icon: Wrench },
      { href: "/admin/system-status", label: "System status", icon: Server },
      { href: "/admin/diagnostics", label: "Diagnostics", icon: BarChart3 },
      { href: "/admin/diagnostics/cat-blueprint-sessions", label: "CAT blueprint sessions", icon: BarChart3 },
      { href: "/admin/platform-ecosystem", label: "Platform ecosystem", icon: Layers },
      { href: "/admin/i18n", label: "i18n", icon: Globe },
      { href: "/admin/diagnostics/theme-qa", label: "Theme QA", icon: Search },
    ],
  },
];

export function getVisibleAdminNavGroups(staffTier: StaffTier): AdminNavGroup[] {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isNavHrefAllowedForStaffTier(staffTier, item.href)),
  })).filter((group) => group.items.length > 0);
}

export function isAdminNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/analytics") return pathname === "/admin/analytics";
  return pathname === href || pathname.startsWith(`${href}/`);
}
