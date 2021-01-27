const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    purgecss({
      content: ['./views/*.ejs']
    }),
    require('autoprefixer'),
    require("cssnano")({
      preset:'default'
    })
  ]
}