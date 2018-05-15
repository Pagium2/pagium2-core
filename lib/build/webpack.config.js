'use strict'
const fs = require('fs')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const loaders = require('../loader')
const parentLoaders = require('../parentLoader')
const PagiumHtmlPlugin = require('../plugin/pagium_html_plugin')
const templates = require('../template')
const util = require('../util')

/**
 * 获取入口文件列表
 * @param  {String} src 源代码目录
 * @return {Object}     入口列表
 */
const getEntryMap = (src) => {
  let map = {}
  fs.readdirSync(src).map((item) => {
    if (item.endsWith('.pg')) {
      let name = item.split('.')[0]
      map[name] = [
        util.resolve(src, item),
        util.resolve(__dirname, './dev-client')
      ]
    }
  })
  return map
}

/**
 * 获取出口文件列表
 * @param  {String} src 源代码目录
 * @return {Object}     出口列表
 */
const getHtmlWebpackPluginList = (src) => {
  let items = []
  fs.readdirSync(src).map((item) => {
    if (item.endsWith('.pg')) {
      let name = item.split('.')[0]
      items.push(new HtmlWebpackPlugin({
        filename: `${name}.html`,
        inject: false,
        template: templates.default,
        chunks: [name]
      }))
    }
  })
  return items
}

/**
 * 获取webpack配置
 * @param  {Object} config 项目配置
 * @return {Object}        webpack配置
 */
const getConfig = (config) => {
  return {
    entry: getEntryMap(config.src),
    module: {
      rules: [
        {
          test: /\.fa$/,
          use: [{
            loader: parentLoaders.PagiumLoader,
            options: {
              meta: function(name) {
                let metaDataPath = util.join(config.component, name, 'metadata')
                return require(metaDataPath)
              },
              data: function(key) {
                let dataPath = util.join(config.data, key)
                return require(dataPath)
              },
              busmeta:function(name){
                let busmetaDataPath = util.join(config.buscomponent, name, 'metadata')
                return require(busmetaDataPath)
              }
            }
          }]
        },
        {
        test: /\.pg$/,
        use: [{
          loader: loaders.PagiumLoader,
          options: {
            meta: function(name) {
              let metaDataPath = util.join(config.component, name, 'metadata')
              return require(metaDataPath)
            },
            data: function(key) {
              let dataPath = util.join(config.data, key)
              return require(dataPath)
            },
            busmeta:function(name){
              let busmetaDataPath = util.join(config.buscomponent, name, 'metadata')
              return require(busmetaDataPath)
            }
          }
        }]
      }, 
      {
        test: /\.tpl$/,
        use: [{
          loader: loaders.PagiumTplLoader,
          options: {
            data: function(key) {
              let dataPath = util.join(config.data, key)
              return require(dataPath)
            },
            meta: function(name) {
              let metaDataPath = util.join(config.component, name, 'metadata')
              return require(metaDataPath)
            },
            busmeta:function(name){
              let busmetaDataPath = util.join(config.buscomponent, name, 'metadata')
              return require(busmetaDataPath)
            }
          }
        }]
      }, {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: loaders.PagiumCssLoader
        }]
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: loaders.PagiumCssLoader
        }, {
          loader: 'less-loader'
        }]
      }, {
        test: /\.styl$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: loaders.PagiumCssLoader
        }, {
          loader: 'stylus-loader'
        }]
      }]
    },
    resolve: {
      alias: {
        EventManage: util.resolve(__dirname, '../component/event-manage')
      }
    },
    plugins: [
      new CleanWebpackPlugin([config.dist], {
        root: config.root,
        verbose: true
      }),
      new PagiumHtmlPlugin({
        src: config.src
      })
    ].concat(getHtmlWebpackPluginList(config.src)).concat([
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]),
    output: {
      path: config.dist,
      filename: '[name].js',
      publicPath: config.publicPath
    }
  }
}

module.exports = getConfig
