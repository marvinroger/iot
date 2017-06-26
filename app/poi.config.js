module.exports = {
  entry: './src/index.js',
  homepage: './', // overwrite homepage from package.json (to use relative URLs)
  html: {
    title: 'IoT',
    template: './index.html'
  },
  babel: {
    babelrc: false // otherwise it uses root babelrc
  }
}
