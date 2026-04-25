import type { IndexHtmlTransformContext, Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type InjectMetaFn = (html: string, pathname: string) => Promise<string>;

const OPEN_GRAPH_IMAGE_NAMES = ["opengraph.png", "opengraph.jpg", "opengraph.jpeg"] as const;

export function metaImagesPlugin(): Plugin {
  let injectMetaFn: InjectMetaFn | null = null;
  let seoLoadPromise: Promise<void> | null = null;

  async function loadSeoMeta(): Promise<void> {
    if (seoLoadPromise) return seoLoadPromise;

    seoLoadPromise = (async () => {
      try {
        const seoPath = path.resolve(process.cwd(), "server", "seo-meta.ts");
        const seoModule = await import(/* @vite-ignore */ pathToFileURL(seoPath).href);

        if (typeof seoModule.injectMeta === "function") {
          injectMetaFn = seoModule.injectMeta as InjectMetaFn;
          console.log("[meta-plugin] SEO meta injection loaded");
        } else {
          console.warn("[meta-plugin] server/seo-meta.ts does not export injectMeta");
        }
      } catch (error) {
        console.warn("[meta-plugin] Could not load seo-meta (non-fatal):", getErrorMessage(error));
      }
    })();

    return seoLoadPromise;
  }

  return {
    name: "vite-plugin-meta-images",
    enforce: "pre",

    transformIndexHtml: {
      order: "pre",
      async handler(html: string, ctx: IndexHtmlTransformContext) {
        let nextHtml = injectOpenGraphImages(html);

        await loadSeoMeta();

        if (injectMetaFn) {
          try {
            nextHtml = await injectMetaFn(nextHtml, ctx.path ?? "/");
          } catch (error) {
            console.warn("[meta-plugin] SEO injection failed (non-fatal):", getErrorMessage(error));
          }
        }

        return nextHtml;
      },
    },
  };
}

function injectOpenGraphImages(html: string): string {
  const baseUrl = getDeploymentUrl();
  const imageName = findOpenGraphImageName();

  if (!baseUrl || !imageName) {
    return html;
  }

  const imageUrl = `${baseUrl}/${imageName}`;

  let nextHtml = replaceMetaContent(html, "property", "og:image", imageUrl);
  nextHtml = replaceMetaContent(nextHtml, "name", "twitter:image", imageUrl);

  return nextHtml;
}

function replaceMetaContent(
  html: string,
  attributeName: "property" | "name",
  attributeValue: string,
  contentValue: string,
): string {
  const metaTagPattern = new RegExp(
    `<meta\\s+([^>]*\\b${attributeName}=["']${escapeRegExp(attributeValue)}["'][^>]*)>`,
    "gi",
  );

  if (metaTagPattern.test(html)) {
    return html.replace(metaTagPattern, (tag) => {
      if (/\bcontent=["'][^"']*["']/i.test(tag)) {
        return tag.replace(/\bcontent=["'][^"']*["']/i, `content="${contentValue}"`);
      }

      return tag.replace(/\s*\/?>$/, ` content="${contentValue}" />`);
    });
  }

  return html.replace(
    /<\/head>/i,
    `  <meta ${attributeName}="${attributeValue}" content="${contentValue}" />\n</head>`,
  );
}

function findOpenGraphImageName(): string | null {
  const publicDir = path.resolve(process.cwd(), "client", "public");

  for (const imageName of OPEN_GRAPH_IMAGE_NAMES) {
    if (fs.existsSync(path.join(publicDir, imageName))) {
      return imageName;
    }
  }

  return null;
}

function getDeploymentUrl(): string | null {
  const rawUrl =
    process.env.VITE_PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.REPLIT_INTERNAL_APP_DOMAIN ||
    process.env.REPLIT_DEV_DOMAIN ||
    null;

  if (!rawUrl) return null;

  const normalizedUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`;

  return normalizedUrl.replace(/\/+$/, "");
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}