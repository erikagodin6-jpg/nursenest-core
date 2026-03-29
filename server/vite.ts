import { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { checkContentExists } from "./seo-meta";
import { deLocalizeSlug } from "@shared/localized-slugs";

const viteLogger = createLogger();

const SUPPORTED_LOCALES = [
  "en",
  "fr",
  "es",
  "fil",
  "hi",
  "zh-tw",
  "zh",
  "ar",
  "ko",
  "pt",
  "pa",
  "vi",
  "ht",
  "ur",
  "ja",
  "fa",
  "de",
  "th",
  "tr",
  "id",
] as const;

const LOCALE_PATH_RE = new RegExp(
  `^\\/(${SUPPORTED_LOCALES.map((locale) => locale.replace("-", "\\-")).join("|")})(\\/.*|$)`
);

const BYPASS_PATH_RE = /\.\w{2,5}($|\?)/;

function shouldBypassVite(req: Request): boolean {
  return (
    req.path.startsWith("/api") ||
    req.path.startsWith("/assets") ||
    req.path.startsWith("/vite-hmr") ||
    req.path.startsWith("/@") ||
    req.path.startsWith("/src") ||
    req.path.startsWith("/node_modules") ||
    BYPASS_PATH_RE.test(req.path)
  );
}

function detectLocaleAndPath(reqPath: string) {
  const localeMatch = reqPath.match(LOCALE_PATH_RE);
  const detectedLocale = localeMatch ? localeMatch[1] : "en";
  const strippedPath = localeMatch ? localeMatch[2] || "/" : reqPath;
  const deLocalizedPath =
    detectedLocale !== "en"
      ? deLocalizeSlug(detectedLocale, strippedPath)
      : strippedPath;

  return {
    detectedLocale,
    strippedPath,
    deLocalizedPath,
  };
}

function getClientTemplatePath(): string {
  const viteDir =
    typeof __dirname !== "undefined"
      ? __dirname
      : path.dirname(fileURLToPath(import.meta.url));

  return path.resolve(viteDir, "..", "client", "index.html");
}

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        console.error("[Vite setup] Vite logger reported an error.");
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (shouldBypassVite(req)) {
      return next();
    }

    const { deLocalizedPath } = detectLocaleAndPath(req.path);

    try {
      const contentExists = await checkContentExists(deLocalizedPath);
      res.locals.softStatus = contentExists ? 200 : 404;
    } catch (error) {
      console.error("[Vite setup] checkContentExists failed:", error);
      res.locals.softStatus = 200;
    }

    next();
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = getClientTemplatePath();
      const statusCode = typeof res.locals.softStatus === "number" ? res.locals.softStatus : 200;

      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      const page = await vite.transformIndexHtml(url, template);

      res
        .status(statusCode)
        .set({ "Content-Type": "text/html" })
        .end(page);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error("[Vite setup] Error rendering index.html:", error);
      next(error);
    }
  });
}