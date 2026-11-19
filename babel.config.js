
module.exports = {
  presets: [
    '@quasar/babel-preset-app'
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ]
    }
  }
}
