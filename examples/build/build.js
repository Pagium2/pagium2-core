'use strict'
const webpack = require('webpack')
const config = require('../config')
const PagiumCore = require('../..')

// Get webpack config
let webpackConfig = PagiumCore.getConfig(config)

webpack(webpackConfig, function(err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
