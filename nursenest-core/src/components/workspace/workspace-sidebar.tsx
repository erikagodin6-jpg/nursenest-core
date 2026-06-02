"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard, IconLessons, IconEcg, IconLabs, IconClinicalSkills,
  IconFlashcards, IconQuestionBank, IconPracticeTests, IconCat, IconReadiness,
  IconWeakAreas, IconAnalytics, IconReportCards, IconStudyPlan, IconStudyCoach,
  IconNotes, IconBlog, IconSettings, IconChevronLeft, IconChevronRight,
} from "./workspace-icons";
import { ProgramSwitcher, type ProgramOption } from "./program-switcher";
import { WorkspaceNavItem, WorkspaceNavSection, type NavSection } from "./workspace-nav";

type WorkspaceSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  pathwayId: string | null;
  programs: ProgramOption[];
  continueStudyingSlot: ReactNode;
};

function buildNavSections(pathwayId: string | null): NavSection[] {
  const pid = pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : "";

  return [
    {
      id: "learn",
      label: "Learn",
      items: [
        { label: "Lessons", href: `/app/lessons${pid}`, icon: <IconLessons />, tooltip: "Lessons" },
        { label: "ECG Interpretation", href: "/app/ecg", icon: <IconEcg />, tooltip: "ECG Interpretation" },
        { label: "Lab Interpretation", href: "/app/labs", icon: <IconLabs />, tooltip: "Lab Interpretation" },
        { label: "Clinical Skills", href: "/app/clinical-skills", icon: <IconClinicalSkills />, tooltip: "Clinical Skills" },
        { label: "Clinical Media", href: "/app/clinical-media-library", icon: <IconClinicalSkills />, tooltip: "Clinical Media" },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      items: [
        { label: "Flashcards", href: `/app/flashcards${pid}`, icon: <IconFlashcards />, tooltip: "Flashcards" },
        { label: "Question Bank", href: `/app/question-bank${pid}`, icon: <IconQuestionBank />, tooltip: "Question Bank" },
        { label: "Practice Tests", href: `/app/practice-tests${pid}`, icon: <IconPracticeTests />, tooltip: "Practice Tests" },
      ],
    },
    {
      id: "assess",
      label: "Assess",
      items: [
        { label: "CAT Exams", href: `/app/cat${pid}`, icon: <IconCat />, tooltip: "CAT Exams" },
        { label: "Readiness", href: `/app/readiness${pid}`, icon: <IconReadiness />, tooltip: "Readiness Assessment" },
      ],
    },
    {
      id: "analyze",
      label: "Analyze",
      items: [
        { label: "Weak Areas", href: "/app/account/analytics", icon: <IconWeakAreas />, tooltip: "Weak Areas" },
        { label: "Analytics", href: "/app/account/analytics", icon: <IconAnalytics />, tooltip: "Analytics" },
        { label: "Report Cards", href: "/app/account/report-card", icon: <IconReportCards />, tooltip: "Report Cards" },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      items: [
        { label: "Study Plan", href: `/app/study-plan${pid}`, icon: <IconStudyPlan />, tooltip: "Study Plan" },
        { label: "Study Coach", href: "/app/coach", icon: <IconStudyCoach />, tooltip: "Study Coach" },
        { label: "Notes", href: "/app/account/notes", icon: <IconNotes />, tooltip: "Notes" },
      ],
    },
    {
      id: "account",
      label: "Account",
      items: [
        { label: "Blog", href: "/blog", icon: <IconBlog />, tooltip: "Blog", match: "exact" },
        { label: "Settings", href: "/app/account/settings", icon: <IconSettings />, tooltip: "Settings" },
      ],
    },
  ];
}

export function WorkspaceSidebar({
  collapsed,
  onToggleCollapse,
  pathwayId,
  programs,
  continueStudyingSlot,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/app/command-center") || pathname === "/app";
  const navSections = buildNavSections(pathwayId);

  return (
    <aside
      className="nn-workspace-sidebar"
      data-collapsed={collapsed}
      aria-label="Study workspace"
    >
      {/* Brand */}
      <div className="nn-workspace-brand">
        <Link href="/app/command-center" aria-label="NurseNest home">
          <svg
            className="nn-workspace-brand__logo"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="16" fill="var(--semantic-brand, #1aaee0)" opacity="0.12" />
            <path
              d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14c-2.67 0-5.04-1.36-6.44-3.43.03-2.14 4.3-3.32 6.44-3.32s6.41 1.18 6.44 3.32A7.94 7.94 0 0 1 16 24z"
              fill="var(--semantic-brand, #1aaee0)"
            />
          </svg>
        </Link>
        <span className="nn-workspace-brand__text" aria-hidden={collapsed}>
          NurseNest
        </span>
      </div>

      {/* Program Switcher */}
      <ProgramSwitcher
        currentPathwayId={pathwayId}
        programs={programs}
        collapsed={collapsed}
      />

      {/* Scrollable nav */}
      <div className="nn-workspace-sidebar__scroll">
        {/* Continue Studying */}
        {continueStudyingSlot}

        {/* Dashboard (top-level) */}
        <div className="nn-workspace-nav-toplevel">
          <WorkspaceNavItem
            item={{
              label: "Dashboard",
              href: `/app/command-center${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`,
              icon: <IconDashboard />,
              tooltip: "Dashboard",
              match: "prefix",
            }}
            collapsed={collapsed}
          />
        </div>

        <div className="nn-workspace-divider" aria-hidden="true" />

        {/* Nav sections */}
        {navSections.map((section) => (
          <WorkspaceNavSection key={section.id} section={section} collapsed={collapsed} />
        ))}
      </div>

      {/* Collapse toggle */}
      <div className="nn-workspace-sidebar__footer">
        <button
          type="button"
          className="nn-workspace-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span aria-hidden="true">
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </span>
          <span className="nn-workspace-collapse-btn__label">
            {collapsed ? null : "Collapse"}
          </span>
        </button>
      </div>
    </aside>
  );
}
