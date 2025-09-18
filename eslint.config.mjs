import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  reactPlugin.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/prop-types': 0,
      '@typescript-eslint/no-unnecessary-type-constraint': 0,
      '@typescript-eslint/no-unsafe-assignment': 1,
      '@typescript-eslint/no-misused-promises': 0,
      '@typescript-eslint/require-await': 0,
      '@typescript-eslint/unbound-method': 0,
      '@typescript-eslint/no-unsafe-return': 1,
      '@typescript-eslint/no-floating-promises': 1,
      '@typescript-eslint/no-unsafe-argument': 1,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      'no-constant-condition': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'caughtErrorsIgnorePattern': '_',
          'argsIgnorePattern': '^_'
        }
      ],
      '@typescript-eslint/prefer-promise-reject-errors': 0,
      '@typescript-eslint/only-throw-error': 0,
      'react/jsx-key': 0
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
);