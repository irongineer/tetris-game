import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // グローバル除外設定
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.*',
      'codecept.conf.js',
      'tests-codecept/**',
      'tests/**',
      'output/**',
    ],
  },

  // Next.js基本設定
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // カスタム設定
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      // TypeScript強化ルール
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error', // 新規: 読み取り専用プロパティの推奨
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // 新規: 読み取り専用パラメータ型（厳格すぎるため無効）
      '@typescript-eslint/no-unused-expressions': 'error', // 新規: 未使用式の検出
      '@typescript-eslint/no-floating-promises': 'error', // 新規: 浮動Promise検出
      '@typescript-eslint/await-thenable': 'error', // 新規: awaitableでない値のawait検出

      // React強化ルール
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // コード品質ルール
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',

      // SonarJS品質ルール拡張
      'sonarjs/cognitive-complexity': ['error', 20], // 複雑度制限を緩和
      'sonarjs/no-duplicate-string': 'off', // テトリスゲームでは色コードなどの重複が多い
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-nested-template-literals': 'error', // 新規: ネストされたテンプレートリテラル防止
      'sonarjs/prefer-immediate-return': 'error', // 新規: 即座の戻り値を推奨
      'sonarjs/no-inverted-boolean-check': 'error', // 新規: 反転されたboolean条件の検出

      // インポート管理ルール (eslint-plugin-importが必要 - 将来追加予定)
      // 'import/no-cycle': 'error',                          // 循環インポートの防止
      // 'import/no-self-import': 'error',                    // 自己インポートの防止
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // テストファイル用緩和設定
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/no-duplicate-string': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-readonly': 'off', // テストファイルでは緩和
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // テストファイルでは緩和
      '@typescript-eslint/no-unused-expressions': 'off', // テストファイルでは緩和
      'no-console': 'off',
    },
  },

  // Prettier設定（競合回避）
  prettierConfig,
];

export default eslintConfig;
