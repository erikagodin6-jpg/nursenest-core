import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizedBlogPath } from "@/lib/blog/blog-slug-localized";
import { getPublishedLocalizedBlogPostsPage } from "@/lib/blog/safe-localized-blog-queries";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";

type HubKey = "np" | "rpn" | "pn";

type HubConfig = {
  locale: GlobalLocaleCode;
  hub: HubKey;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  title: string;
  description: string;
  eyebrow: string;
};

const HUBS: Record<HubKey, Partial<Record<GlobalLocaleCode, HubConfig>>> = {
  np: {
    fr: {
      locale: "fr",
      hub: "np",
      region: "canada",
      profession: "np",
      exam: "cnple",
      title: "Ressources NP",
      description:
        "Articles cliniques, guides d'examen et ressources de revision pour la preparation NP.",
      eyebrow: "NP Canada",
    },
    es: {
      locale: "es",
      hub: "np",
      region: "us",
      profession: "np",
      exam: "fnp",
      title: "Recursos NP",
      description:
        "Articulos clinicos, guias de examen y recursos de estudio para la preparacion NP.",
      eyebrow: "NP Estados Unidos",
    },
  },
  rpn: {
    fr: {
      locale: "fr",
      hub: "rpn",
      region: "canada",
      profession: "rpn",
      exam: "rex-pn",
      title: "Ressources RPN",
      description:
        "Articles cliniques et guides REx-PN pour les candidates et candidats RPN.",
      eyebrow: "RPN Canada",
    },
  },
  pn: {
    es: {
      locale: "es",
      hub: "pn",
      region: "us",
      profession: "pn",
      exam: "nclex-pn",
      title: "Recursos PN",
      description:
        "Articulos clinicos y guias NCLEX-PN para estudiantes de enfermeria practica.",
      eyebrow: "PN Estados Unidos",
    },
  },
};

function resolveHub(locale: string, hub: HubKey): HubConfig | null {
  return HUBS[hub][locale as GlobalLocaleCode] ?? null;
}

export async function generateLocalizedPathwayContentHubMetadata(params: {
  locale: string;
  hub: HubKey;
}): Promise<Metadata> {
  const config = resolveHub(params.locale, params.hub);
  if (!config) return {};
  return {
    title: `${config.title} | NurseNest`,
    description: config.description,
    alternates: {
      canonical: `/${config.locale}/${config.hub}`,
    },
  };
}

export async function LocalizedPathwayContentHubPage({
  locale,
  hub,
  page,
}: {
  locale: string;
  hub: HubKey;
  page: number;
}) {
  const config = resolveHub(locale, hub);
  if (!config) notFound();

  const posts = await getPublishedLocalizedBlogPostsPage({
    locale: config.locale,
    region: config.region,
    profession: config.profession,
    exam: config.exam,
    page,
    pageSize: 24,
  });

  const totalPages = Math.max(1, Math.ceil(posts.total / posts.pageSize));

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">{config.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {config.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{config.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.posts.map((post) => {
            const href = localizedBlogPath({
              locale: config.locale,
              region: config.region,
              profession: config.profession,
              exam: config.exam,
              slug: post.localizedSlug,
            });
            return (
              <article
                key={post.id}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-rose-200 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                  {config.profession.toUpperCase()} / {config.exam.toUpperCase()}
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-950">
                  <Link href={href}>{post.localizedTitle}</Link>
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.localizedExcerpt}</p>
                <Link
                  href={href}
                  className="mt-5 inline-flex text-sm font-semibold text-rose-600 hover:text-rose-700"
                >
                  {config.locale === "fr" ? "Lire l'article" : "Leer articulo"}
                </Link>
              </article>
            );
          })}
        </div>

        {posts.total === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            {config.locale === "fr"
              ? "Aucun article localise publie pour cette voie pour le moment."
              : "Todavia no hay articulos localizados publicados para esta ruta."}
          </div>
        ) : null}

        {totalPages > 1 ? (
          <nav className="flex items-center justify-between border-t border-slate-200 pt-6 text-sm font-semibold text-slate-700">
            {posts.page > 1 ? (
              <Link href={`/${config.locale}/${config.hub}?page=${posts.page - 1}`}>
                {config.locale === "fr" ? "Page precedente" : "Pagina anterior"}
              </Link>
            ) : (
              <span />
            )}
            <span>
              {posts.page} / {totalPages}
            </span>
            {posts.page < totalPages ? (
              <Link href={`/${config.locale}/${config.hub}?page=${posts.page + 1}`}>
                {config.locale === "fr" ? "Page suivante" : "Pagina siguiente"}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
