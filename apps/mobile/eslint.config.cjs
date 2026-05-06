/**
 * Minimal ESLint flat config so `npm run lint` works before optional `eslint-config-expo` tuning.
 * Prefer `npx expo lint` once eslint-config-expo resolves cleanly in your environment.
 */
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  { ignores: [".expo/**", "node_modules/**", "dist/**"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        __DEV__: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        require: "readonly",
        module: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.js"],
    ignores: ["index.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly", __dirname: "readonly" },
    },
  },
  {
    files: ["index.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { __DEV__: "readonly" },
    },
  },
];
