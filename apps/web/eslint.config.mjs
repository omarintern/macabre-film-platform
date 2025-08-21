import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Build outputs
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
      
      // Prisma generated files
      "src/generated/**/*",
      "prisma/generated/**/*",
      "**/generated/**/*",
      
      // Node modules
      "node_modules/**/*",
      
      // Other build artifacts
      ".vercel/**/*",
      "coverage/**/*",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
