import js from "@eslint/js";
import tsp from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import eslintComments from "eslint-plugin-eslint-comments";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import reactPlugin from "eslint-plugin-react";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import vitestPlugin from '@vitest/eslint-plugin';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

const flatCompat = new FlatCompat();

export default [
  js.configs.recommended,
  {
    ignores: ["dist", ".eslintrc.cjs", "node_modules"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.es2024,
        vi: true,
        describe: true,
        test: true,
        expect: true,
        it:true,
      },
      parser: tsp,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module",
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // さまざまな推奨設定
  eslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  ...flatCompat.extends("plugin:react-hooks/recommended"),// Flat Config 未対応のプラグインは FlatCompat を使用
  jsxA11yPlugin.flatConfigs.recommended,

// TypeScript ESLint 追加設定
  ...tseslint.config({
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/naming-convention": [//変数名などの規則
        "error",
        { selector: "class", format: ["PascalCase"], suffix: ["Impl"] },
        {
          selector: "interface",
          format: ["PascalCase"],
          suffix: ["Props", "Repository", "Result", "ToBackend", "State"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          suffix: ["Type", "State", "Dispatch", "Store"],
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is"],
        },
      ],
    },
  }),

  // React + Hooks + React Refresh
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-curly-brace-presence": ["error", { props: "always" }],
      "react/jsx-no-useless-fragment": "off",
      "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-sort-props": "error", // Props の並び順をアルファベット順に統一
      "react/destructuring-assignment": "error", // Props などの分割代入を強制
      "react/jsx-fragments": "error", // React Fragment の書き方を統一
      "react/self-closing-comp": "error", // 子要素がない場合は自己終了タグを使う
      "react/jsx-pascal-case": "error", // コンポーネント名をパスカルケースに統一
      "react/prop-types": "off", // Props の型チェックは TS で行う & 誤検知があるため無効化

      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      "react-hooks/exhaustive-deps": "error", // recommended では warn のため error に上書き
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },

  },

  // import plugin
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "always",
          tsx: "always",
          js: "always",
          jsx: "always",
        },
      ],
      "import/order": [
        // import の並び順を設定
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "object",
            "type",
            "index",
          ],
          "newlines-between": "always",//それぞれのグループに間を空ける
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
        },
      ],
    },
  },
  {
    // eslint-plugin-unused-imports の設定(未使用インポートの自動削除)
    plugins: { 'unused-imports': unusedImportsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // 重複エラーを防ぐため typescript-eslint の方を無効化
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Jest / ESLint Comments
  {
    plugins: {
      jest,
      "eslint-comments": eslintComments,
    },
    rules: {
      "eslint-comments/require-description": ["error", { ignore: ["eslint-enable"] }],
      "testing-library/no-unnecessary-act": "off",
    },
  },

  // eslint-plugin-perfectionist
  {
    plugins: { perfectionist: perfectionistPlugin },
    rules: {
      "perfectionist/sort-interfaces": "warn", // interface のプロパティの並び順をアルファベット順に統一
      "perfectionist/sort-object-types": "warn", // Object 型のプロパティの並び順をアルファベット順に統一
    },
  },

  // その他ルール
  {
    rules: {
      "require-await": "error",
      "no-console": ["error", { allow: ["error", "info"] }],
      "no-void": "off",
      "func-names": "off",
      "class-methods-use-this": "off",
      "consistent-return": "off",
      "max-lines": ["error", { max: 1000, skipBlankLines: true, skipComments: true }],
      "no-restricted-syntax": [
        "error",
        { selector: "FunctionDeclaration", message: "Function statements are not allowed." },
      ],
      "no-nested-ternary": "error",
    },
  },

  // テストに関するルール
  jestDomPlugin.configs['flat/recommended'],//マッチャーの正しい仕様を監視
  vitestPlugin.configs.recommended,
  {
    files: ["./src/tests/**/*.tsx", "./src/tests/**/*.ts", "./src/**/*.test.tsx", "./src/**/*.test.ts", "./**/vite.config.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "import/no-default-export": "off",
      "import/no-extraneous-dependencies": "off",
      "jest/consistent-test-it": ["error", { fn: "it" }],
      "no-restricted-syntax": [
        "error",
        { selector: "SwitchStatement", message: "Switch statements are not allowed." },
        { selector: "IfStatement", message: "If statements are not allowed." },
        { selector: "ForStatement", message: "For statements are not allowed." },
        {
          selector: "CallExpression[callee.property.name='forEach']",
          message: "ForEach For statements are not allowed",
        },
        { selector: "FunctionDeclaration", message: "Function statements are not allowed." },
      ],
      "max-lines": ["error", { max: 2000, skipBlankLines: true, skipComments: true }],
    },
  },
  prettier,
];



