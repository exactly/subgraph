/** @type {import('eslint').Linter.Config} */
module.exports = {
  parserOptions: { project: ['tsconfig.json', 'tsconfig.dev.json'] },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:eslint-comments/recommended',
  ],
  rules: {
    'prefer-const': 'off',
    'import/prefer-default-export': 'off',
    'eslint-comments/no-unused-disable': 'error',
  },
  overrides: [
    {
      files: ['views/**/*.js', '**/.eslintrc.js'],
      extends: ['plugin:node/recommended'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};
