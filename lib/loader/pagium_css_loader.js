'use strict'
const loaderUtils = require('loader-utils')
const postcss = require('postcss')
const selectorParser = require('postcss-selector-parser')

const addUniqueKey = postcss.plugin('add-unique-key', (opts) => {
  return (root) => {
    root.each(function rewriteSelector(node) {
      if (!node.selector) {
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector)
        }
        return
      }
      node.selector = selectorParser((selectors) => {
        selectors.each((selector) => {
          let node = null
          selector.each((n) => {
            if (n.type !== 'pseudo') node = n
          })
          selector.insertAfter(node, selectorParser.attribute({
            attribute: opts.id
          }))
        })
      }).processSync(node.selector)
    })
  }
})

module.exports = function(source) {
  const params = loaderUtils.parseQuery(this.resourceQuery)
  return new Promise((resolve, reject) => {
    postcss([addUniqueKey({ id: params.pagiumId })])
      .process(source, { from: undefined })
      .then(result => {
        resolve(result.css)
      })
  })
}
