module.exports = {
  'env': {
    'commonjs': true,
    'node': true,
    'es2020': true
  },
  'extends': [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
};
