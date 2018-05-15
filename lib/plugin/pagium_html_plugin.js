'use strict'
const parse5 = require('parse5')
const minify = require('html-minifier').minify
const util = require('../util')

/**
 * 获取节点开始位置
 * @param  {Object} dom  页面Document
 * @param  {String} flag 节点名称
 * @return {Number}      节点开始位置
 */
const getStart = (dom, flag) => {
  let target = null
  const parseNode = (node) => {
    if (node.childNodes && node.childNodes.length) {
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeName && childNode.nodeName === flag) {
          target = childNode.childNodes[childNode.childNodes.length - 1]
        }
        parseNode(childNode)
      })
    }
  }
  parseNode(dom)
  return target.__location.startOffset
}

/**
 * 打包模板文件
 * @param  {String} location   节点位置
 * @param  {String} moduleName 模板名称
 * @param  {Object} entry      入口列表
 * @param  {Object} assets     构建列表
 * @return {String}            模板内容
 */
const packHtml = (location, moduleName, entry, assets) => {
  let htmlMap = {}
  let htmlList = []
  for (let entryItem in entry) {
    // 处理当前文件
    if (entryItem === moduleName) {
      for (let asset in assets) {
        // 处理当前文件子模板
        let tplPath = util.relative('tpl', asset)
        let htmlKey = util.basename(tplPath)
        if (util.dirname(tplPath).indexOf(location) > -1 &&
          htmlKey.startsWith(entryItem)) {
          htmlList.push(htmlKey)
          htmlMap[htmlKey] = assets[asset]._value
        }
      }
    }
  }

  // 排序页面组件
  htmlList = htmlList.sort()
  let html = ''
  for (let key of htmlList) {
    html += htmlMap[key]
  }
  return html
}

/**
 * 解析json文件
 * @param  {String} location   节点位置
 * @param  {String} moduleName 模板名称
 * @param  {Object} entry      入口列表
 * @param  {Object} assets     构建列表
 * @return {String}            模板内容
 */
const packJson =  (location, moduleName, entry, assets) =>{
    let jsonData;
    for (let entryItem in entry) {
    // 处理当前文件
    if (entryItem === moduleName) {
      for (let asset in assets) {
        if(asset.indexOf('json.js') > -1){
          // let jsonKey = util.basename(asset)
           jsonData = assets[asset]._value
        }
      }
    }
  }
  return jsonData;
}


let PagiumHtmlPlugin = function (options) {}

PagiumHtmlPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation, callback) => {
    compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
      // 获取区域信息
      let document = parse5.parse(htmlPluginData.html, {
        locationInfo: true
      })
      let headStart = getStart(document, 'head')
      let bodyStart = getStart(document, 'body')

      // 拼接页面内容
      let moduleName = util.basename(htmlPluginData.outputName, '.html')
      let headHtml = packHtml('head', moduleName, compiler.options.entry, compilation.assets)
      let bodyHtml = packHtml('body', moduleName, compiler.options.entry, compilation.assets)
      let footHtml = packHtml('foot', moduleName, compiler.options.entry, compilation.assets)
      let scritStr = packJson('./',moduleName, compiler.options.entry, compilation.assets)
      let scriptHtml = '<script>' + scritStr +'</script>';
      //let scriptHtml = '<script src="./' + moduleName + '.json.js"></script>'
      //let scriptbusHtml = '<script src="./' + moduleName + '.bus.json.js"></script>'
      htmlPluginData.html = htmlPluginData.html.substring(0, headStart) + headHtml +
        htmlPluginData.html.substring(headStart, bodyStart) + scriptHtml +bodyHtml + footHtml  +
        htmlPluginData.html.substring(bodyStart)
      htmlPluginData.html = minify(htmlPluginData.html, {
        collapseWhitespace: true
      })
      callback(null, htmlPluginData)
    })
  })
}

module.exports = PagiumHtmlPlugin
