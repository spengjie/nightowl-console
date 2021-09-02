module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/max-attributes-per-line': ['warn', {
      'singleline': 10,
      'multiline': {
        'max': 1,
      }
    }],
    'vue/html-closing-bracket-newline': ['warn', {
      'multiline': 'never'
    }],
    'vue/require-default-prop': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'semi': ['warn', 'always', { 'omitLastInOneLineBlock': true }],
    '@typescript-eslint/no-this-alias': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
