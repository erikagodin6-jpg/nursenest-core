"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const INPUT_BASE = "nn-premium-auth-input nn-premium-auth-input--block";
const BUTTON_BASE = "nn-premium-auth-primary-button nn-premium-auth-primary-button--block";
const CHECKBOX_BASE = "nn-premium-auth-checkbox";

export type AuthFieldProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  hintId?: string;
  children: ReactNode;
  className?: string;
};

/** Label + optional hint + control — preserves spacing rhythm across auth routes. */
export function AuthField({ id, label, hint, hintId, children, className = "" }: AuthFieldProps) {
  return (
    <div className={`nn-premium-auth-field ${className}`.trim()}>
      <label htmlFor={id} className="nn-premium-auth-label">
        {label}
      </label>
      {children}
      {hint && hintId ? (
        <p id={hintId} className="nn-premium-auth-field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function AuthInput({ className = "", invalid, "aria-describedby": ariaDescribedBy, ...props }: AuthInputProps) {
  return (
    <input
      className={`${INPUT_BASE} ${className}`.trim()}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={ariaDescribedBy}
      {...props}
    />
  );
}

export type AuthPrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AuthPrimaryButton({ className = "", type = "submit", ...props }: AuthPrimaryButtonProps) {
  return <button className={`${BUTTON_BASE} ${className}`.trim()} type={type} {...props} />;
}

export type AuthCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hint?: ReactNode;
  hintId?: string;
};

export function AuthCheckbox({ id, label, hint, hintId, className = "", ...props }: AuthCheckboxProps) {
  return (
    <div className="nn-premium-auth-checkbox-row">
      <input id={id} type="checkbox" className={`${CHECKBOX_BASE} ${className}`.trim()} {...props} />
      <div className="nn-premium-auth-checkbox-copy">
        <label htmlFor={id} className="nn-premium-auth-label nn-premium-auth-label--inline">
          {label}
        </label>
        {hint && hintId ? (
          <p id={hintId} className="nn-premium-auth-field-hint">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export type AuthTextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function AuthTextLink({ href, children, className = "" }: AuthTextLinkProps) {
  return (
    <Link href={href} className={`nn-premium-auth-link ${className}`.trim()}>
      {children}
    </Link>
  );
}

/** Centered secondary route switch (e.g. back to sign in). */
export function AuthInlineLink({ href, children, className = "" }: AuthTextLinkProps) {
  return (
    <Link href={href} className={`nn-premium-auth-link nn-premium-auth-link--center ${className}`.trim()}>
      {children}
    </Link>
  );
}
