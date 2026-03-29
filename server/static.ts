import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectMeta, checkContentExists } from "./seo-meta";
import { SUPPORTED_LOCALES } from "@shared/locales";

let cachedIndexHtml: string | null = null;

const LOCALE_REGEX = new RegExp(
  `^\\/(${[...SUPPORTED_LOCALES].sort((a, b) => b.length - a.length).join("|")})(\\/.*|$)`
);

function extractLocaleAndPath(reqPath: string): { locale: string; strippedPath: string } {
  const localeMatch = reqPath.match(LOCALE_REGEX);
  if (localeMatch) {
    return { locale: localeMatch[1], strippedPath: localeMatch[2] || "/" };
  }
  return { locale: "en", strippedPath: reqPath };
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(`Build directory not found: ${distPath}`);
  }

  const indexHtmlPath = path.resolve(distPath, "index.html");

  // ✅ Cache index.html ONCE
  try {
    cachedIndexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
  } catch (err) {
    console.error("[Static] Failed to read index.html:", err);
  }

  /* -------------------------
     STATIC ASSETS
  ------------------------- */

  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
    })
  );

  app.use(
    express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("sw.js") || filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (/\.(gif|png|jpg|jpeg|svg|ico|webp|avif)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
        } else if (/\.(woff2?)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (/\.(css|js)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=86400");
        }
      },
    })
  );

  /* -------------------------
     SAFE FALLBACK FOR ASSETS
  ------------------------- */

  app.use("/assets/{*path}", (_req, res) => {
    res.status(404).type("text/plain").send("Asset not found");
  });

  /* -------------------------
     MAIN HTML HANDLER
  ------------------------- */

  app.use("/{*path}", async (req, res) => {
    try {
      const html = cachedIndexHtml;
      if (!html) {
        throw new Error("index.html not loaded");
      }

      const { strippedPath } = extractLocaleAndPath(req.path);

      let statusCode = 200;

      // ✅ SAFE content check (no crash)
      try {
        const contentExists = await checkContentExists(strippedPath);
        if (!contentExists) statusCode = 404;
      } catch (err) {
        console.warn("[SEO] checkContentExists failed:", err);
      }

      let injected = html;

      // ✅ SAFE meta injection
      try {
        injected = await injectMeta(html, req.path, {
          isAllied: !!(req as any).isAllied,
        });
      } catch (err) {
        console.warn("[SEO] injectMeta failed:", err);
      }

      const isNoindex = injected.includes('content="noindex');

      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader(
        "X-Robots-Tag",
        isNoindex ? "noindex, follow" : "index, follow"
      );

      res.status(statusCode).send(injected);

    } catch (err) {
      console.error("[Static] Fatal error:", err);

      try {
        res.setHeader("Cache-Control", "no-cache");
        res.sendFile(indexHtmlPath);
      } catch {
        res.status(500).send("Internal server error");
      }
    }
  });
}