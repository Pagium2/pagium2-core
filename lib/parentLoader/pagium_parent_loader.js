'use strict'
const util = require('../util')
const loaderUtils = require('loader-utils')

//返回组件js脚本引入
const getRequireJs = (componentName, pagiumId, moduleName) => {
  return `require("../../components/${componentName}/index.js")('${moduleName}', '${pagiumId}');`
}

//返回基础组件模板引入
const getRequireTpl = (componentName, pagiumId, data, index,pn) => {
  return `require("../../components/${componentName}/index.tpl?pagiumId=${pagiumId}&name=${componentName}&data=${data}&isparent=true&index=${index}&pn=${pn}");`
}

//返回基础组件样式引入
const getRequireCss = (componentName, pagiumId, type) => {
  type = type ? type : 'css'
  return `require("../../components/${componentName}/index.${type}?pagiumId=${pagiumId}");`
}

//解析fa文件引用
const fetchSource = function (source, moduleName, params, _me) {
  let reAll = /name="(\w+)"\sdata="(\w+)"(\starget="([\w|,]+)")?/g //寻找带data的所有正则  -- 主要针对基础组件
  let reSingle = /name="(\w+)"\sdata="(\w+)"(\starget="([\w|,]+)")?/ //寻找基础组件的单一正则
  let reNodata = /name="(\w+)"(\starget="([\w|,]+)")?/ //寻找基础组件没有带data的正则
  let reTotal = /{{{(.*?)}}}?/g //寻找所有基础组件的正则
  // 解析模板
  let comItems = []; //基础组件项
  let coms = source.match(reTotal)
  let datas = [];
  if (params.data !== 'msdata') { //有配置数据源
    datas = _me.query.data(params.data);
  } else { //读取业务配置数据
    datas = _me.query.busmeta(params.name).data
  }
  let parentName = params.name;
  for (let index in coms) { //轮询pg文件内容
    let com = coms[index]
    let items = [];
    items = com.match(reNodata)
    let dataobj = datas[index];
    comItems.push({
      name: items[1],
      data: params.data,
      dataobj: dataobj,
      target: typeof items[4] != 'undefined' ? items[4] : '',
      key: `${params.pagiumId}-${moduleName}_bus_${index}`,
      index: index,
      pn:parentName
    })
  }
  return comItems;
}

module.exports = function (source) {
  console.log('***********复合业务解析器开始解析***********');
  let _me = this;
  const params = loaderUtils.parseQuery(this.resourceQuery)
  let moduleName = util.basename(_me.resourcePath, '.fa')
  let comItems = fetchSource(source, moduleName, params, _me);
  let items = [];
  for (let item of comItems) {
    items.push(getRequireJs(item.name, item.key, moduleName))
    items.push(getRequireTpl(item.name, item.key, item.data, item.index,item.pn))
    let metaData = this.query.meta(item.name)
    items.push(getRequireCss(item.name, item.key, metaData.css, false))
  }
  let result = 'var busData =' + JSON.stringify(comItems)
  this.emitFile(`${params.moduleName}.bus.json.js`, result)
  return items.join('\n')
}
