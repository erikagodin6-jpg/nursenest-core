import { NextResponse, type NextRequest } from "next/server";
import {
  internalPathForLanguageSubdomain,
  localeFromLanguageSubdomainHost,
} from "@/lib/i18n/language-subdomains";

const PUBLIC_FILE = /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|png|svg|txt|webmanifest|webp|xml)$/i;

function shouldBypass(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/internal") ||
    pathname.startsWith("/preview") ||
    PUBLIC_FILE.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const locale = localeFromLanguageSubdomainHost(request.headers.get("host"));
  if (!locale || locale === "en") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (shouldBypass(pathname)) return NextResponse.next();

  const internalPathname = internalPathForLanguageSubdomain(locale, pathname);
  if (internalPathname === pathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = internalPathname;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-nn-language-subdomain-locale", locale);
  response.headers.set("x-nn-language-subdomain-internal-path", internalPathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
