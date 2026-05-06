import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React 17+ new JSX transform (no need to import React)
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // This project isn't using PropTypes
      "react/prop-types": "off",
    },
  },
]);
