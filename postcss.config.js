const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    // purgecss({
    //   content: ['./**/*.ejs']
    // }),
    require('autoprefixer'),
    require("cssnano")({
      preset:'default'
    })
  ]
}