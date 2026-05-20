# Jitter / Lottie branded loader (`BrandedPageLoader`)

## Replace the placeholder safely

1. Export **JSON** from Jitter (Bodymovin).
2. **Overwrite** `public/animations/nursenest-loader-jitter.json`, **or** set `NEXT_PUBLIC_NN_JITTER_LOTTIE_SRC` to a stable HTTPS URL, **or** pass `jitterLottieSrc="/animations/your-file.json"` on a specific `BrandedPageLoader`.
3. **Size:** CI fails above **200KB**; **100KB** logs a warning (runtime + test). Optimize in Jitter (merge paths, trim keys, lower point counts) before shipping.
4. **Shape:** The app rejects JSON that is not a minimal valid Lottie object (`v`, `fr`, `ip`, `op`, `w`, `h`, non-empty `layers`) so HTML error pages never reach `lottie-react`.
5. **`prefers-reduced-motion`:** The loader **does not fetch** the JSON when reduced motion is on (sync check at idle + after download). SVG + CSS fallback only.
6. **Paint:** Fetch and parse run only **after** `requestIdleCallback` (or `setTimeout(0)`), so the first paint is not blocked by Lottie network work.

See `src/lib/animations/lottie-loader-guards.ts` for caps and validation.
