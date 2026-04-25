import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import circularDependency from "vite-plugin-circular-dependency";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

const projectRoot = import.meta.dirname;
const isProduction = process.env.NODE_ENV === "production";
const isReplit = process.env.REPL_ID !== undefined;

function vendorChunk(id: string): string | undefined {
  if (id.includes("\0commonjsHelpers") || id.includes("\0commonjs-")) {
    return "react-core";
  }

  if (
    id.includes("node_modules/react/") ||
    id.includes("node_modules/react-dom/") ||
    id.includes("node_modules/scheduler/") ||
    id.includes("node_modules/react-is/") ||
    id.includes("node_modules/prop-types/") ||
    id.includes("node_modules/react-fast-compare/") ||
    id.includes("node_modules/shallowequal/") ||
    id.includes("node_modules/react-helmet-async/")
  ) {
    return "react-core";
  }

  if (id.includes("node_modules/lucide-react")) return "icons";
  if (id.includes("node_modules/@radix-ui")) return "radix";
  if (id.includes("node_modules/framer-motion")) return "motion";
  if (id.includes("node_modules/@tanstack")) return "tanstack";
  if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) return "charts";
  if (id.includes("node_modules/zod")) return "zod";
  if (id.includes("node_modules/date-fns") || id.includes("node_modules/@date-fns")) return "date-fns";
  if (id.includes("node_modules/react-day-picker")) return "date-picker";
  if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/@hookform")) return "forms";
  if (id.includes("node_modules/jspdf") || id.includes("node_modules/html2canvas")) return "pdf-export";
  if (id.includes("node_modules/dompurify") || id.includes("node_modules/marked")) return "markdown";
  if (id.includes("node_modules/wouter")) return "router";
  if (id.includes("node_modules/@uppy/") || id.includes("node_modules/uppy")) return "uploader";
  if (id.includes("node_modules/cmdk")) return "cmdk";
  if (id.includes("node_modules/embla-carousel")) return "carousel";
  if (id.includes("node_modules/react-resizable-panels")) return "panels";
  if (id.includes("node_modules/next-themes")) return "themes";
  if (id.includes("node_modules/vaul")) return "vaul";
  if (
    id.includes("node_modules/class-variance-authority") ||
    id.includes("node_modules/clsx") ||
    id.includes("node_modules/tailwind-merge")
  ) {
    return "styling";
  }

  return undefined;
}

const plugins = [
  react(),
  ...(!isProduction ? [runtimeErrorOverlay()] : []),
  tailwindcss(),
  metaImagesPlugin(),
  ...(isProduction && process.env.VITE_SKIP_CIRCULAR_CHECK !== "1"
    ? [
        circularDependency({
          exclude: [/[\\/]node_modules[\\/]/],
          circleImportThrowErr: true,
          ignoreDynamicImport: true,
        }),
      ]
    : []),
];

if (!isProduction && isReplit) {
  const [{ cartographer }, { devBanner }] = await Promise.all([
    import("@replit/vite-plugin-cartographer"),
    import("@replit/vite-plugin-dev-banner"),
  ]);

  plugins.push(cartographer(), devBanner());
}

export default defineConfig({
  plugins,

  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "client", "src"),
      "@shared": path.resolve(projectRoot, "shared"),
      "@assets": path.resolve(projectRoot, "attached_assets"),
    },
  },

  css: {
    postcss: {
      plugins: [],
    },
  },

  root: path.resolve(projectRoot, "client"),

  build: {
    outDir: path.resolve(projectRoot, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    cssMinify: "esbuild",
    minify: "esbuild",
    reportCompressedSize: false,
    assetsInlineLimit: 0,

    modulePreload: {
      polyfill: true,
      resolveDependencies: (_filename, deps) => {
        return deps.filter(
          (dep) =>
            !dep.includes("admin-routes") &&
            !dep.includes("admin-") &&
            !dep.includes("instructor-") &&
            !dep.includes("demo-") &&
            !dep.includes("content-editor"),
        );
      },
    },

    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
        chunkFileNames: "assets/chunks/[name]-[hash].js",
        entryFileNames: "assets/chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },

  optimizeDeps: {
    exclude: [
      "i18n-fr",
      "i18n-ar",
      "i18n-es",
      "i18n-de",
      "i18n-zh",
      "i18n-zh-tw",
      "i18n-hi",
      "i18n-pa",
      "i18n-ko",
      "i18n-ja",
      "i18n-pt",
      "i18n-vi",
      "i18n-tl",
      "i18n-ur",
      "i18n-ht",
      "i18n-fa",
      "i18n-th",
      "i18n-tr",
      "i18n-id",
    ],
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});