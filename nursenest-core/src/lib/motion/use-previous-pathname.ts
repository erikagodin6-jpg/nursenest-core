/* eslint-disable react-hooks/refs --
 * Intentional `usePrevious` pattern: `ref.current` is read during render to
 * return the pathname from the *prior* commit; `useEffect` writes the new
 * pathname after paint. This is the standard approach for route-enter checks.
 */
import { useEffect, useRef } from "react";

/**
 * Pathname from before the latest effect commit update (`undefined` on first render).
 */
export function usePreviousPathname(pathname: string): string | undefined {
  const ref = useRef<string | undefined>(undefined);
  useEffect(() => {
    ref.current = pathname;
  }, [pathname]);
  return ref.current;
}
