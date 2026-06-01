"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WorkspaceHeader } from "./workspace-header";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import {
  IconDashboard, IconLessons, IconEcg, IconLabs, IconClinicalSkills,
  IconFlashcards, IconQuestionBank, IconPracticeTests, IconCat, IconReadiness,
  IconWeakAreas, IconAnalytics, IconReportCards, IconStudyPlan, IconStudyCoach,
  IconNotes, IconBlog, IconSettings,
} from "./workspace-icons";
import { WorkspaceNavItem, WorkspaceNavSection, type NavSection } from "./workspace-nav";
import { ProgramSwitcher, type ProgramOption } from "./program-switcher";
import type { ContinueStudyingData } from "./continue-studying-card";
import { ContinueStudyingCard } from "./continue-studying-card";

const LS_COLLAPSED_KEY = "nn_sidebar_collapsed";

function readCollapsedFromStorage(): boolean {
  try {
    return localStorage.getItem(LS_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

function writeCollapsedToStorage(v: boolean): void {
  try {
    localStorage.setItem(LS_COLLAPSED_KEY, v ? "true" : "false");
  } catch { /* quota / private mode */ }
}

export type WorkspaceShellProps = {
  /** Page content */
  children: ReactNode;
  /** Streamed-in Continue Studying card (server component via Suspense) */
  continueStudyingSlot: ReactNode;
  /** Current pathway ID from the server */
  pathwayId: string | null;
  /** Programs accessible to this user */
  programs: ProgramOption[];
  /** First name for header avatar */
  userName?: string | null;
  /**
   * Focused mode — exam/flashcard study shells where the sidebar should be hidden
   * and content takes full screen.
   */
  isFocused?: boolean;
  /** Notification count for header bell */
  notificationCount?: number;
};

function buildDrawerNavSections(pathwayId: string | null): NavSection[] {
  const pid = pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : "";
  return [
    {
      id: "learn", label: "Learn",
      items: [
        { label: "Lessons", href: `/app/lessons${pid}`, icon: <IconLessons />, tooltip: "Lessons" },
        { label: "ECG Interpretation", href: "/app/ecg", icon: <IconEcg />, tooltip: "ECG Interpretation" },
        { label: "Lab Interpretation", href: "/app/labs", icon: <IconLabs />, tooltip: "Lab Interpretation" },
        { label: "Clinical Skills", href: "/app/clinical-skills", icon: <IconClinicalSkills />, tooltip: "Clinical Skills" },
      ],
    },
    {
      id: "practice", label: "Practice",
      items: [
        { label: "Flashcards", href: `/app/flashcards${pid}`, icon: <IconFlashcards />, tooltip: "Flashcards" },
        { label: "Question Bank", href: `/app/question-bank${pid}`, icon: <IconQuestionBank />, tooltip: "Question Bank" },
        { label: "Practice Tests", href: `/app/practice-tests${pid}`, icon: <IconPracticeTests />, tooltip: "Practice Tests" },
      ],
    },
    {
      id: "assess", label: "Assess",
      items: [
        { label: "CAT Exams", href: `/app/cat${pid}`, icon: <IconCat />, tooltip: "CAT Exams" },
        { label: "Readiness", href: `/app/readiness${pid}`, icon: <IconReadiness />, tooltip: "Readiness" },
      ],
    },
    {
      id: "analyze", label: "Analyze",
      items: [
        { label: "Weak Areas", href: "/app/account/analytics", icon: <IconWeakAreas />, tooltip: "Weak Areas" },
        { label: "Analytics", href: "/app/account/analytics", icon: <IconAnalytics />, tooltip: "Analytics" },
        { label: "Report Cards", href: "/app/account/report-card", icon: <IconReportCards />, tooltip: "Report Cards" },
      ],
    },
    {
      id: "tools", label: "Tools",
      items: [
        { label: "Study Plan", href: `/app/study-plan${pid}`, icon: <IconStudyPlan />, tooltip: "Study Plan" },
        { label: "Study Coach", href: "/app/coach", icon: <IconStudyCoach />, tooltip: "Study Coach" },
        { label: "Notes", href: "/app/account/notes", icon: <IconNotes />, tooltip: "Notes" },
      ],
    },
    {
      id: "account", label: "Account",
      items: [
        { label: "Blog", href: "/blog", icon: <IconBlog />, tooltip: "Blog", match: "exact" },
        { label: "Settings", href: "/app/account/settings", icon: <IconSettings />, tooltip: "Settings" },
      ],
    },
  ];
}

export function WorkspaceShell({
  children,
  continueStudyingSlot,
  pathwayId,
  programs,
  userName,
  isFocused = false,
  notificationCount = 0,
}: WorkspaceShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mounted = useRef(false);

  // Sync collapse state from localStorage after hydration
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const stored = readCollapsedFromStorage();
    if (stored !== collapsed) setCollapsed(stored);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      writeCollapsedToStorage(next);
      return next;
    });
  }, []);

  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  const continueStudyingForDrawer = continueStudyingSlot;
  const drawerSections = buildDrawerNavSections(pathwayId);
  const fallbackHref = pathwayId
    ? `/app/command-center?pathwayId=${encodeURIComponent(pathwayId)}`
    : "/app/command-center";

  return (
    <div
      className="nn-workspace-shell"
      data-sidebar-collapsed={collapsed}
      data-workspace-focused={isFocused}
    >
      {/* Desktop sidebar — hidden on mobile via CSS */}
      <WorkspaceSidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        pathwayId={pathwayId}
        programs={programs}
        continueStudyingSlot={continueStudyingSlot}
      />

      {/* Mobile drawer */}
      <MobileNavDrawer open={drawerOpen} onClose={handleCloseDrawer}>
        <ProgramSwitcher
          currentPathwayId={pathwayId}
          programs={programs}
          collapsed={false}
        />
        {continueStudyingForDrawer}
        <WorkspaceNavItem
          item={{
            label: "Dashboard",
            href: `/app/command-center${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`,
            icon: <IconDashboard />,
            tooltip: "Dashboard",
          }}
          collapsed={false}
        />
        <div className="nn-workspace-divider" aria-hidden="true" />
        {drawerSections.map((section) => (
          <WorkspaceNavSection key={section.id} section={section} collapsed={false} />
        ))}
      </MobileNavDrawer>

      {/* Main content area */}
      <div className="nn-workspace-main">
        <WorkspaceHeader
          onMenuClick={handleOpenDrawer}
          userName={userName}
          notificationCount={notificationCount}
        />
        <div className="nn-workspace-content">
          {children}
        </div>
      </div>
    </div>
  );
}
