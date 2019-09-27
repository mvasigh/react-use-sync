module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    ecmaVersion: 6,
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.tsx']
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'no-unused-vars': 1,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  }
};
