import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Keep the catalog self-contained: it never imports app code.
  {
    files: ["catalog/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/*",
                "next",
                "next/*",
                "react",
                "react/*",
                "../app/*",
                "../components/*",
                "../lib/*",
                "../../*",
              ],
              message: "catalog/ must stay self-contained.",
            },
          ],
        },
      ],
    },
  },
  // The storefront reaches the catalog only through its public exports.
  {
    files: ["app/**", "components/**", "lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/catalog/*"],
              message: 'Import from "@/catalog" instead.',
            },
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
