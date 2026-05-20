"use client";

import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { SUPPORT_RESPONSE_TIME_COPY, supportMailtoHref } from "@/lib/support/support-policy";

export function SupportEmailAccountMenuLink({
  onActivate,
  className,
  children = "Email Support",
}: {
  onActivate: () => void;
  className: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={supportMailtoHref()}
      role="menuitem"
      className={className}
      onClick={onActivate}
      title={SUPPORT_RESPONSE_TIME_COPY}
    >
      <span className="inline-flex items-center gap-2">
        <Mail className="h-4 w-4 shrink-0 opacity-80" aria-hidden strokeWidth={2} />
        <span>{children}</span>
      </span>
    </a>
  );
}
