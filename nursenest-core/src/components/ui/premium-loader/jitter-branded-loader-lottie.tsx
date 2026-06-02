"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  assertLottieLoaderJsonByteSize,
  assertLottieLoaderJsonShape,
  LOTTIE_LOADER_JSON_MAX_BYTES,
  syncPrefersReducedMotion,
} from "@/lib/animations/lottie-loader-guards";
import { BrandedLeafMark } from "@/components/ui/premium-loader/branded-leaf-mark";
import styles from "@/components/ui/premium-loader/premium-loader.module.css";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <BrandedLeafMark className={styles.pageLoaderLeafSvg} aria-hidden />,
});

export type JitterBrandedLoaderLottieProps = {
  /**
   * Bodymovin / Jitter JSON — absolute URL or same-origin path.
   * When omitted, uses `NEXT_PUBLIC_NN_JITTER_LOTTIE_SRC` or the repo placeholder at
   * `/animations/nursenest-loader-jitter.json` (replace with your Jitter export).
   */
  src?: string | null;
  className?: string;
  onModeChange?: (mode: "css" | "lottie") => void;
};

function resolveSrc(prop?: string | null): string {
  if (prop && prop.length > 0) return prop;
  const env = process.env.NEXT_PUBLIC_NN_JITTER_LOTTIE_SRC;
  if (env && env.length > 0) return env;
  return "/animations/nursenest-loader-jitter.json";
}

/**
 * Jitter-friendly Lottie leaf slot for {@link BrandedPageLoader}:
 * - No `fetch()` until browser idle (and never when `prefers-reduced-motion` is true at idle).
 * - JSON size capped (warn / hard max) and minimal Bodymovin shape validation before `lottie-react`.
 * - `lottie-react` is code-split and only mounts after valid JSON is in memory.
 */
export function JitterBrandedLoaderLottie({ src, className, onModeChange }: JitterBrandedLoaderLottieProps) {
  const reduced = useReducedMotion();
  const resolved = useMemo(() => resolveSrc(src), [src]);
  const [idleOpen, setIdleOpen] = useState(false);
  const [data, setData] = useState<unknown | null>(null);
  const [failed, setFailed] = useState(false);
  const [lottieBroken, setLottieBroken] = useState(false);
  const lastMode = useRef<"css" | "lottie" | null>(null);

  /** Clear motion asset when the user (or SSR snapshot) opts out of non-essential motion. */
  useEffect(() => {
    if (reduced) {
      setData(null);
      setFailed(false);
      setLottieBroken(false);
    }
  }, [reduced]);

  /** Open the network gate only after idle — sync `prefers-reduced-motion` so we never schedule a fetch for reduced users. */
  useEffect(() => {
    let cancelled = false;
    const open = () => {
      if (cancelled) return;
      if (syncPrefersReducedMotion()) return;
      setIdleOpen(true);
    };

    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(open, { timeout: 900 });
    } else {
      timeoutId = setTimeout(open, 0);
    }

    return () => {
      cancelled = true;
      if (typeof requestIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      } else if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!idleOpen || reduced) return;

    let cancelled = false;
    setFailed(false);
    setLottieBroken(false);

    const run = async () => {
      if (syncPrefersReducedMotion()) return;
      try {
        const r = await fetch(resolved, { credentials: "same-origin" });
        if (!r.ok) throw new Error(String(r.status));
        if (syncPrefersReducedMotion()) return;

        const cl = r.headers.get("content-length");
        if (cl !== null && cl !== "") {
          const n = Number(cl);
          if (Number.isFinite(n) && n > LOTTIE_LOADER_JSON_MAX_BYTES) {
            throw new Error(`Lottie loader: Content-Length ${n} exceeds cap`);
          }
        }

        const buf = await r.arrayBuffer();
        if (syncPrefersReducedMotion()) return;

        assertLottieLoaderJsonByteSize(buf.byteLength);

        let json: unknown;
        try {
          json = JSON.parse(new TextDecoder("utf-8").decode(buf));
        } catch {
          throw new Error("Lottie loader: response is not valid JSON");
        }

        assertLottieLoaderJsonShape(json);

        if (!cancelled && !syncPrefersReducedMotion()) {
          setData(json);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [idleOpen, reduced, resolved]);

  useEffect(() => {
    const mode: "css" | "lottie" = reduced || failed || !data || lottieBroken ? "css" : "lottie";
    if (lastMode.current === mode) return;
    lastMode.current = mode;
    onModeChange?.(mode);
  }, [reduced, failed, data, lottieBroken, onModeChange]);

  if (reduced || failed || !data || lottieBroken) {
    return <BrandedLeafMark className={cn(styles.pageLoaderLeafSvg, className)} aria-hidden />;
  }

  return (
    <div className={cn(styles.jitterLottieSlot, className)} aria-hidden>
      <Lottie
        animationData={data}
        loop
        className={styles.jitterLottieCanvas}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        onDataFailed={() => setLottieBroken(true)}
      />
    </div>
  );
}
