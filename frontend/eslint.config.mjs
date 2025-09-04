import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJest from "eslint-plugin-jest";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...pluginJest.configs['flat/recommended'],
  },
  {
    ignores: [
      "**/node_modules/",
      "**/coverage/",
      "**/dist/",
      "**/public/",
      "src/migration",
      "tsconfig.json",
      "eslint.config.mjs",
      "public/"
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
      jest: pluginJest
    },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
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
      "arrow-body-style": "off",
      "no-eval": "error",
      // eslint-plugin-jest
      "jest/no-conditional-expect": "warn",
      // eslint-plugin-jest
      "max-len": [
        "warn",
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
      "prettier/prettier": "warn",
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
