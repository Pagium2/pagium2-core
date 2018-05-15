'use strict'
const util = require('../util')

module.exports = {
  PagiumLoader: util.resolve(__dirname, './pagium_loader'),
  PagiumCssLoader: util.resolve(__dirname, './pagium_css_loader'),
  PagiumTplLoader: util.resolve(__dirname, './pagium_tpl_loader')
}
