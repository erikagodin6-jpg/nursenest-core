"use client";

import type { ReactNode } from "react";

export type LearningModuleShellProps = {
  children: ReactNode;
  className: string;
  moduleKey: string;
  legacyRootDataAttribute?: string;
  sidebar: ReactNode;
  mobileStrip: ReactNode;
};

export function LearningModuleShell({
  children,
  className,
  legacyRootDataAttribute,
  moduleKey,
  sidebar,
  mobileStrip,
}: LearningModuleShellProps) {
  const legacyDataAttribute = legacyRootDataAttribute ? { [legacyRootDataAttribute]: "" } : {};

  return (
    <div className={className} data-nn-learning-module-shell="" data-nn-learning-module={moduleKey} {...legacyDataAttribute}>
      <div data-nn-learning-module-frame="">
        <div data-nn-learning-module-sidebar="">{sidebar}</div>
        <div data-nn-learning-module-main="">
          <div data-nn-learning-module-mobile-strip="">{mobileStrip}</div>
          {children}
        </div>
      </div>
    </div>
  );
}
