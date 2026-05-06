import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

type Props = {
  children: ReactNode;
  /** Route or screen id — no user identifiers. */
  screen: string;
};

/** Screen-level isolation so one subtree failure does not blank the whole shell. */
export function ScreenErrorBoundary({ children, screen }: Props) {
  return <ErrorBoundary scope={`screen:${screen}`}>{children}</ErrorBoundary>;
}
