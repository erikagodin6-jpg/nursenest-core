import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import tsPlugin from "@typescript-eslint/eslint-plugin";

/**
 * ESLint flat config (v9).
 *
 * Uses eslint-plugin-react-hooks directly rather than eslint-config-next so
 * this config can run from the workspace root without needing `next` co-located
 * in the same node_modules tree.
 */
const eslintConfig = defineConfig([
  // ── TypeScript + JSX parsing for .ts/.tsx files ──
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tseslint.parser },
  },

  // ── React Hooks rules (explicit — not inherited, so they can't silently regress) ──
  {
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // ── Global error boundary: client-only guard ──
  {
    files: ["src/app/global-error.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next/headers",
                "next/cookies",
                "next/server",
                "@/lib/auth",
                "@/lib/auth/**",
                "@/server/**",
              ],
              message: "Global error boundary must stay client-only and request-agnostic.",
            },
          ],
        },
      ],
    },
  },

  // ── Shared pure + client-only modules: no server imports ──
  {
    files: [
      "src/client/**/*.{ts,tsx,js,jsx,mjs,cjs}",
      "src/shared/pure/**/*.{ts,tsx,js,jsx,mjs,cjs}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next/headers",
                "next/cookies",
                "next/server",
                "@/lib/auth",
                "@/lib/auth/**",
                "@/server/**",
              ],
              message: "Shared/client modules must not depend on request-scoped server APIs.",
            },
          ],
        },
      ],
    },
  },

  // ── Layout safety: avoid request APIs in shared layouts ──
  {
    files: ["src/app/**/layout.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next/headers", "next/cookies", "next/server"],
              message: "Route layouts must remain build-safe. Move request APIs into loaders or route handlers.",
            },
          ],
        },
      ],
    },
  },

  // ── Layer isolation: marketing layer ──
  {
    files: ["src/app/(marketing)/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/app/(app)/**"], message: "Marketing layer must not import app-layer modules." },
            { group: ["@/app/(admin)/**"], message: "Marketing layer must not import admin-layer modules." },
            { group: ["@/app/app/**"], message: "Marketing layer must not import legacy student route modules." },
            { group: ["@/app/admin/**"], message: "Marketing layer must not import legacy admin route modules." },
          ],
        },
      ],
    },
  },

  // ── Layer isolation: student layer ──
  {
    files: ["src/app/(app)/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/app/(admin)/**"], message: "Student layer must not import admin-layer modules." },
            { group: ["@/app/admin/**"], message: "Student layer must not import legacy admin route modules." },
          ],
        },
      ],
    },
  },

  // ── Inline-style guard for learner UI ──
  {
    files: ["src/components/flashcards/flashcards-hub-client.tsx", "src/components/learner-ui/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            "Prefer learner design tokens (`styles/tokens.css`, `styles/learner-ds.css`, `lv-*`, `nn-ls-*`) over inline styles so themes stay consistent.",
        },
      ],
    },
  },

  // ── Layer isolation: admin layer ──
  {
    files: ["src/app/(admin)/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/app/(marketing)/**"], message: "Admin layer must not import marketing-layer route modules." },
            { group: ["@/app/(app)/**"], message: "Admin layer must not import app-layer route modules." },
            { group: ["@/app/app/**"], message: "Admin layer must not import legacy student route modules." },
            { group: ["@/app/page"], message: "Admin layer must not import marketing route modules." },
            { group: ["@/app/login/**", "@/app/signup/**", "@/app/pricing/**"], message: "Admin layer must not import marketing route modules." },
            { group: ["@/components/marketing/**", "@/legacy/marketing/**"], message: "Admin layer must not import marketing UI modules." },
            { group: ["@/content/marketing-en.json"], message: "Admin layer must not import marketing content modules." },
          ],
        },
      ],
    },
  },

  // ── Build output ignores ──
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
