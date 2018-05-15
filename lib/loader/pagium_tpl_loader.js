'use strict'
const ejs = require('ejs')
const loaderUtils = require('loader-utils')
const posthtml = require('posthtml')
const util = require('../util')

/**
 * 唯一标识html节点
 * @param  {String} pagiumId 唯一标识
 * @param  {Object} position 页面位置标识
 * @return {Object}          节点对象
 */
const addAttr = (pagiumId, position) => {
  return (tree) => {
    tree.walk((node) => {
      // 仅处理body类型
      if (position == 'body') {
        let attrs = {}
        attrs[pagiumId] = ''
        attrs = node.attrs ? Object.assign(attrs, node.attrs) : attrs
        Object.assign(node, {
          attrs: attrs
        })
      }
      return node
    })
  }
}

module.exports = function (source) {
  const params = loaderUtils.parseQuery(this.resourceQuery)

 // 获取组件位置信息
 let metaData = this.query.meta(params.name)
 let position = metaData.position ? metaData.position : 'body'
 let data;
 let _me = this;
  if(params.isparent){  // true 为业务组件模板
    if (params.data.indexOf('msdata') > -1) {
      //如果花括号没有data数据，则读取目录
     data = _me.query.busmeta(params.pn).data
    } else {
      // 获取数据，解析模板
      data = this.query.data(params.data)
    }
    let index = params.index;
    if(data.length > 1){
      data = data[index];
    }
    source = ejs.render(source, data, {})
    return new Promise((resolve, reject) => {
      source = posthtml().use(addAttr(params.pagiumId, position))
        .process(source, {})
        .then(result => {
          if (position === 'body') {
            source = `<div id="${params.pagiumId}">${result.html}</div>`
          } else {
            source = result.html
          }
          this.emitFile(util.join('bustpl', position, params.pagiumId), source)
          resolve(`module.exports = ''`)
        })
    })
  }else{
    if (params.data.indexOf('msdata') > -1) {
      //如果花括号没有data数据，则读取目录
      data = metaData.data;
    } else {
      // 获取数据，解析模板
      data = this.query.data(params.data)
    }
    source = ejs.render(source, data, {})
    return new Promise((resolve, reject) => {
      source = posthtml().use(addAttr(params.pagiumId, position))
        .process(source, {})
        .then(result => {
          if (position === 'body') {
            source = `<div id="${params.pagiumId}">${result.html}</div>`
          } else {
            source = result.html
          }
          this.emitFile(util.join('tpl', position, params.pagiumId), source)
          resolve(`module.exports = ''`)
        })
    })
  }
}
