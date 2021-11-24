module.exports = {
  'env': {
    'commonjs': true,
    'node': true,
    'es2020': true
  },
  'extends': 'eslint:recommended',
  'rules': {
    'no-trailing-spaces': 'error',
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
