"use client";

import type { FormHTMLAttributes, ReactNode } from "react";

export type AuthFormLayoutProps = {
  children: ReactNode;
  /** Stable id for analytics / e2e (`login`, `signup`, etc.) */
  formId: string;
  pending?: boolean;
  className?: string;
} & Pick<FormHTMLAttributes<HTMLFormElement>, "method" | "onSubmit" | "noValidate">;

/**
 * Shared form region — min-heights, pending guard, no layout shift during submit.
 */
export function AuthFormLayout({
  children,
  formId,
  pending = false,
  className = "",
  method = "post",
  onSubmit,
  noValidate,
}: AuthFormLayoutProps) {
  return (
    <form
      className={`nn-premium-auth-form mt-6 space-y-4 ${className}`.trim()}
      data-nn-premium-auth-form={formId}
      data-nn-auth-pending={pending ? "true" : undefined}
      method={method}
      onSubmit={onSubmit}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
}
