/**
 * 🧊 Public-static marketing layout
 *
 * Minimal shell for purely static / CDN-friendly public routes.
 * - No force-dynamic
 * - No request-time API usage (no headers(), cookies(), auth())
 * - No session dependencies
 * - No Prisma / DB reads
 * - Minimal providers
 * - CDN cacheable, ISR-friendly
 *
 * Routes using this layout render successfully even if:
 *   - auth/session fails
 *   - Prisma fails
 *   - DB is degraded
 *   - deployment invalidates caches
 *
 * DO NOT add runtime providers here. If you need auth-aware UI, use
 * the optional-public-auth-island pattern (client island, lazy loaded).
 */
import type { ReactNode } from "react";
import { SiteHeaderStatic } from "@/components/layout/site-header-static";
import { SiteFooterStatic } from "@/components/layout/site-footer-static";

export default function PublicStaticLayout({ children }: { children: ReactNode }) {
  return (
    <div className="nn-marketing-surface nn-marketing-brand-root flex min-h-screen flex-col">
      <SiteHeaderStatic />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <SiteFooterStatic />
    </div>
  );
}