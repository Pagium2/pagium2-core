'use strict'
const path = require('path')

let resolve = (folder) => {
  return path.resolve(__dirname, folder)
}

module.exports = {
  root: resolve('..'),
  src: resolve('../src/pages'),
  component: resolve('../src/components'),
  buscomponent:resolve('../src/buscomponents'),
  data: resolve('../src/data'),
  dist: resolve('../dist'),
  publicPath: './'
}
