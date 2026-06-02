"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Tooltip shown in collapsed mode */
  tooltip: string;
  /** Match type: "exact" | "prefix" */
  match?: "exact" | "prefix";
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

function isActive(pathname: string, href: string, match: "exact" | "prefix" = "prefix"): boolean {
  const path = pathname.split("?")[0]!;
  const target = href.split("?")[0]!;
  if (match === "exact") return path === target;
  return path === target || path.startsWith(target + "/");
}

export function WorkspaceNavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href, item.match);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.tooltip : undefined}
      className="nn-workspace-nav-item"
    >
      <span className="nn-workspace-nav-item__icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="nn-workspace-nav-item__label">{item.label}</span>
    </Link>
  );
}

export function WorkspaceNavSection({
  section,
  collapsed,
}: {
  section: NavSection;
  collapsed: boolean;
}) {
  return (
    <div className="nn-workspace-section" role="group" aria-labelledby={`nav-section-${section.id}`}>
      <div
        className="nn-workspace-section__label"
        id={`nav-section-${section.id}`}
        aria-hidden={collapsed}
      >
        {section.label}
      </div>
      {section.items.map((item) => (
        <WorkspaceNavItem key={item.href} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}
