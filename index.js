'use strict'
const fs = require('fs')
const path = require('path')

module.exports = {
  getConfig: require('./lib/build/webpack.config'),
  initServer: require('./lib/build/dev-server')
}
