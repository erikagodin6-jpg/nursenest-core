/**
 * 🏝️ Auth Status Island
 *
 * Client-side auth status component for static layouts.
 * Lazy-loaded, failure-isolated, never blocks parent render.
 */
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load the actual auth status component
const AuthStatus = dynamic(() => import('./AuthStatus'), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-24 animate-pulse rounded bg-gray-200" aria-label="Loading auth status" />
  ),
});

/**
 * Static placeholder shown during loading
 */
function StaticAuthPlaceholder() {
  return (
    <div className="h-10 w-24 rounded bg-gray-100" aria-label="Auth status loading">
      <span className="sr-only">Loading authentication status</span>
    </div>
  );
}

/**
 * Auth status island with Suspense boundary
 * 
 * Usage in static layouts:
 * ```tsx
 * <AuthStatusIsland />
 * ```
 */
export function AuthStatusIsland() {
  return (
    <Suspense fallback={<StaticAuthPlaceholder />}>
      <AuthStatus />
    </Suspense>
  );
}
