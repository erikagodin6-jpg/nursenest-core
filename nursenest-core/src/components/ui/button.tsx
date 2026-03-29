import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

/** Minimal stub: legacy marketing passes full `className`; variant/size are ignored. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={className} {...props} />
));
Button.displayName = "Button";
