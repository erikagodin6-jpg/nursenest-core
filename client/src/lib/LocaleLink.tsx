import { Link, useLocation } from "wouter";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useI18n, type LanguageCode } from "@/lib/i18n";
import { buildLocalePath, getLocaleFromPath } from "@/lib/locale-utils";

const ROUTE_SLUG_MAP: Record<string, Record<string, string>> = {
  fr: {
    "/pricing": "/tarifs",
    "/flashcards": "/cartes-memoire",
    "/lessons": "/lecons",
    "/mock-exams": "/examens-pratiques",
    "/glossary": "/glossaire",
    "/about": "/a-propos",
    "/contact": "/nous-joindre",
    "/faq": "/foire-aux-questions",
    "/blog": "/blogue",
    "/nursing-certifications": "/certifications-infirmieres",
    "/certifications": "/certifications",
  },
  es: {
    "/pricing": "/precios",
    "/flashcards": "/tarjetas-de-memoria",
    "/lessons": "/lecciones",
    "/mock-exams": "/examenes-de-practica",
    "/glossary": "/glosario",
    "/about": "/acerca-de",
    "/contact": "/contacto",
    "/faq": "/preguntas-frecuentes",
    "/blog": "/blog",
    "/nursing-certifications": "/certificaciones-enfermeria",
    "/certifications": "/certificaciones",
  },
  pt: {
    "/pricing": "/precos",
    "/flashcards": "/cartoes-de-estudo",
    "/lessons": "/licoes",
    "/mock-exams": "/simulados",
    "/glossary": "/glossario",
    "/about": "/sobre",
    "/contact": "/contato",
    "/faq": "/perguntas-frequentes",
    "/blog": "/blog",
  },
};

function languageToLocale(lang: LanguageCode): string {
  if (lang === "tl") return "fil";
  return lang;
}

function applySlugMapping(path: string, locale: string): string {
  const mapping = ROUTE_SLUG_MAP[locale];
  if (!mapping) return path;

  for (const [enSlug, localizedSlug] of Object.entries(mapping)) {
    if (path === enSlug || path.startsWith(enSlug + "/") || path.startsWith(enSlug + "?") || path.startsWith(enSlug + "#")) {
      return localizedSlug + path.slice(enSlug.length);
    }
  }
  return path;
}

function stripLocalePrefix(href: string): string {
  const { pathWithoutLocale } = getLocaleFromPath(href);
  return pathWithoutLocale;
}

export function getLocalizedPath(href: string, language: LanguageCode): string {
  const locale = languageToLocale(language);
  const cleanPath = href.startsWith("/") ? href : "/" + href;
  const stripped = stripLocalePrefix(cleanPath);
  const mappedPath = applySlugMapping(stripped, locale);
  return buildLocalePath(locale, mappedPath);
}

export function getLocalizedSlug(href: string, language: LanguageCode): string {
  const locale = languageToLocale(language);
  const cleanPath = href.startsWith("/") ? href : "/" + href;
  const stripped = stripLocalePrefix(cleanPath);
  return applySlugMapping(stripped, locale);
}

export function useLocalizedLink() {
  const { language } = useI18n();

  return (href: string): string => {
    return getLocalizedPath(href, language);
  };
}

interface LocaleLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: ReactNode;
}

export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const { language } = useI18n();
  const localizedSlug = getLocalizedSlug(href, language);
  return <Link href={localizedSlug} {...props}>{children}</Link>;
}
