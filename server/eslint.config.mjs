import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/coverage/",
      "**/dist/",
      "**/client/",
      "src/migration",
      "tsconfig.json",
      "eslint.config.mjs",
    ],
  },
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ),
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "module",

      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/return-await": "warn",
      "@typescript-eslint/adjacent-overload-signatures": "off",
      "import/no-extraneous-dependencies": "off",
      "import/prefer-default-export": "off",
      "import/no-cycle": "off",
      "import/first": "off",
      "no-async-promise-executor": "off",
      "no-restricted-syntax": "off",
      "no-return-await": "off",
      "no-console": "off",
      "nonblock-statement-body-position": "off",
      "class-methods-use-this": "off",
      "consistent-return": "off",
      "implicit-arrow-linebreak": "off",
      curly: "off",
      "array-callback-return": "off",
      "no-param-reassign": "off",
      "no-underscore-dangle": "off",
      "max-classes-per-file": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "function-call-argument-newline": ["error", "consistent"],
      "linebreak-style": "off",
      "arrow-body-style": ["error", "as-needed"],
      "no-eval": "error",
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" },
      ],
      "max-len": [
        "error",
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
      "prettier/prettier": "error",
      quotes: [
        "warn",
        "single",
        {
          allowTemplateLiterals: true,
        },
      ],
    },
  },
];
