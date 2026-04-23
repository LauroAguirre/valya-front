// import { FlatCompat } from '@eslint/eslintrc'
// import js from '@eslint/js'
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
// // 1. Importação obrigatória do plugin
// import eslintPluginPrettier from 'eslint-plugin-prettier'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all,
// })

// export default [
//   { ignores: ['.next/**'] },

//   // 2. Extends (Configurações base)
//   // 'prettier' aqui vem do eslint-config-prettier e serve apenas para DESLIGAR regras conflitantes
//   ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),

//   // 3. Objeto de Configuração Manual
//   {
//     plugins: {
//       // Aqui registramos o plugin real que executa a regra 'prettier/prettier'
//       prettier: eslintPluginPrettier,
//     },
//     rules: {
//       // Agora o ESLint sabe onde encontrar a definição desta regra
//       'prettier/prettier': 'warn',

//       // Suas outras regras
//       'space-before-function-paren': 'off',
//       'react/prop-types': 'off',
//       'no-use-before-define': 'off',
//       '@typescript-eslint/no-explicit-any': 'off',
//     },
//   },
// ]

import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      'space-before-function-paren': 'off',
      'no-use-before-define': 'off',
    },
  },
]