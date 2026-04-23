import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/(marketing)/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/app/(student)/**"], message: "Marketing layer must not import student-layer modules." },
            { group: ["@/app/(admin)/**"], message: "Marketing layer must not import admin-layer modules." },
            { group: ["@/app/app/**"], message: "Marketing layer must not import legacy student route modules." },
            { group: ["@/app/admin/**"], message: "Marketing layer must not import legacy admin route modules." },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/(student)/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
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
  {
    files: ["src/components/flashcards/flashcards-hub-client.tsx", "src/components/learner-ui/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            "Prefer learner design tokens (`learner-design-system.css`, `nn-ls-ds-*`, `nn-ls-*`) over inline styles so themes stay consistent.",
        },
      ],
    },
  },
  {
    files: ["src/app/(admin)/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/app/(marketing)/**"], message: "Admin layer must not import marketing-layer route modules." },
            { group: ["@/app/(student)/**"], message: "Admin layer must not import student-layer route modules." },
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
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
