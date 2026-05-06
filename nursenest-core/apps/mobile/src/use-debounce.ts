import { useCallback, useEffect, useRef } from "react";

/** Leading-edge debounce for side effects (e.g. CAT advance PATCH). */
export function useDebouncedFn(fn: () => void, ms: number): () => void {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const f = useRef(fn);
  f.current = fn;
  useEffect(
    () => () => {
      if (t.current) clearTimeout(t.current);
    },
    [],
  );
  return useCallback(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => f.current(), ms);
  }, [ms]);
}
