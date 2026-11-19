const fs = require('fs')

/**
 * The .babelrc file holds extra rules that Jest needs for transpiling
 * (they only apply when running tests, i.e. NODE_ENV=test).
 * You should keep your application's babel rules in this file.
 */
let extend = undefined

if (fs.existsSync('./.babelrc')) {
  extend = './.babelrc'
}

module.exports = {
  presets: [
    '@quasar/babel-preset-app'
  ],
  extends: extend
}
