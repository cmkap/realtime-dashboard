module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error'
  }
}
// This ESLint configuration is set up for a TypeScript project with Prettier integration.
// It extends recommended rules from ESLint and TypeScript, and enforces Prettier formatting
// as an error. The '@typescript-eslint/parser' is used to parse TypeScript files,
// and the '@typescript-eslint' plugin provides TypeScript-specific linting rules.
// The 'prettier' plugin ensures that code formatting follows Prettier's style guide
// and reports any discrepancies as errors.