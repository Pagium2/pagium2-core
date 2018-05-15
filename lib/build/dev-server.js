'use strict'
const express = require('express')
const webpack = require('webpack')

const initServer = (webpackConfig) => {
  // default port where dev server listens for incoming traffic
  let port = 5000
  let app = express()

  let compiler = webpack(webpackConfig)
  let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    stats: {
      colors: true,
      chunks: false
    }
  })
  let hotMiddleware = require('webpack-hot-middleware')(compiler)

  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('succeed-module', function(module, cb) {
      if (module.rawRequest.indexOf('.tpl') !== -1) {
        hotMiddleware.publish({ action: 'reload' })
      }
    })
  })

  // serve webpack bundle output
  app.use(devMiddleware)

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware)

  return app.listen(port, function(err) {
    if (err) {
      console.log(err)
      return
    }
    let uri = `http://localhost:${port}`
    console.log('Listening at ' + uri + '\n')
  })
}

module.exports = initServer
