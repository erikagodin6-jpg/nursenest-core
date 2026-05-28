"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ECG_WORKSTATION_NAV, type EcgWorkstationNavSection } from "@/lib/ecg-module/ecg-workstation-nav";
import { cn } from "@/lib/utils";

export function EcgWorkstationSidebar({ sections = ECG_WORKSTATION_NAV }: { sections?: EcgWorkstationNavSection[] }) {
  const pathname = usePathname() ?? "";

  return (
    <aside className="nn-ecg-workstation__sidebar" aria-label="ECG telemetry navigation">
      <Link href="/modules/ecg" className="nn-ecg-workstation__home">
        <span className="nn-ecg-workstation__home-label">Telemetry workstation</span>
        <span className="nn-ecg-workstation__home-title">ECG clinical readiness</span>
      </Link>
      {sections.map((section) => (
        <div key={section.id} className="nn-ecg-workstation__nav-section">
          <p className="nn-ecg-workstation__nav-title">{section.title}</p>
          <ul>
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={cn("nn-ecg-workstation__nav-link", active && "nn-ecg-workstation__nav-link--active")}>
                    <span className="font-semibold">{item.label}</span>
                    {item.description ? <span className="block text-[10px] font-normal opacity-80">{item.description}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}

export function EcgWorkstationMobileStrip({ sections = ECG_WORKSTATION_NAV }: { sections?: EcgWorkstationNavSection[] }) {
  const pathname = usePathname() ?? "";
  const items = sections.flatMap((s) => s.items).slice(0, 6);
  return (
    <nav className="nn-ecg-workstation__mobile-strip" aria-label="ECG quick nav">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("nn-ecg-workstation__chip", (pathname === item.href || pathname.startsWith(`${item.href}/`)) && "nn-ecg-workstation__chip--active")}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
