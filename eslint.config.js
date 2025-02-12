import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jest from 'eslint-plugin-jest'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      jest,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'jest/no-disabled-tests': 'warn',  // Warn about disabled tests
      'jest/consistent-test-it': ['error', { fn: 'it' }],
    },
  },
  {
      files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'], // Only apply these rules to test files
      env: {
        jest: true, // Enable Jest globals (e.g., describe, it, expect)
      },
      plugins: ['jest'], // Make sure the Jest plugin is used in test files
      rules: {
        'jest/no-focused-tests': 'error', // Disallow focused tests (i.e., `it.only` or `describe.only`)
        'jest/valid-expect': 'error', // Ensure that all `expect` statements are valid
      },
    },
]
