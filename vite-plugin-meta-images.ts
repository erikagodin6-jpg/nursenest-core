import type { Plugin, IndexHtmlTransformContext } from 'vite';
import fs from 'fs';
import path from 'path';

export function metaImagesPlugin(): Plugin {
  let injectMetaFn: ((html: string, pathname: string) => Promise<string>) | null = null;
  let seoLoadAttempted = false;

  async function loadSeoMeta() {
    if (seoLoadAttempted) return;
    seoLoadAttempted = true;
    try {
      const seoPath = path.resolve(process.cwd(), 'server', 'seo-meta.ts');
      const seoModule = await import(/* @vite-ignore */ seoPath);
      injectMetaFn = seoModule.injectMeta;
      console.log('[meta-plugin] SEO meta injection loaded');
    } catch (e: any) {
      console.warn('[meta-plugin] Could not load seo-meta (non-fatal):', e.message);
    }
  }

  return {
    name: 'vite-plugin-meta-images',
    enforce: 'pre',

    transformIndexHtml: {
      order: 'pre',
      async handler(html: string, ctx: IndexHtmlTransformContext) {
        html = injectOpenGraphImages(html);

        await loadSeoMeta();
        if (injectMetaFn) {
          try {
            const reqPath = ctx.path ?? '/';
            html = await injectMetaFn(html, reqPath);
          } catch (e: any) {
            console.warn('[meta-plugin] SEO injection failed (non-fatal):', e.message);
          }
        }

        return html;
      },
    },
  };
}

function injectOpenGraphImages(html: string): string {
  const baseUrl = getDeploymentUrl();
  if (!baseUrl) return html;

  const publicDir = path.resolve(process.cwd(), 'client', 'public');
  const opengraphPngPath = path.join(publicDir, 'opengraph.png');
  const opengraphJpgPath = path.join(publicDir, 'opengraph.jpg');
  const opengraphJpegPath = path.join(publicDir, 'opengraph.jpeg');

  let imageExt: string | null = null;
  if (fs.existsSync(opengraphPngPath)) {
    imageExt = 'png';
  } else if (fs.existsSync(opengraphJpgPath)) {
    imageExt = 'jpg';
  } else if (fs.existsSync(opengraphJpegPath)) {
    imageExt = 'jpeg';
  }

  if (!imageExt) return html;

  const imageUrl = `${baseUrl}/opengraph.${imageExt}`;

  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/g,
    `<meta property="og:image" content="${imageUrl}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/g,
    `<meta name="twitter:image" content="${imageUrl}" />`
  );

  return html;
}

function getDeploymentUrl(): string | null {
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return `https://${process.env.REPLIT_INTERNAL_APP_DOMAIN}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  return null;
}
