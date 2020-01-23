const concat = require('concat')

const files = [
  './dist/runtime-es5.js',
  './dist/polyfills-es5.js',
  './dist/scripts.js',
  './node_modules/zone.js/dist/zone.min.js',
  './dist/main-es5.js'
]

concat(files, './dist/bundle.js')
