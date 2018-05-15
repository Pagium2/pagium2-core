'use strict'
const util = require('../util')

//返回组件js脚本引入
const getRequireJs = (componentName, pagiumId, moduleName, isBus) => {
  if (isBus) {
    return `require("../buscomponents/${componentName}/index.js")('${moduleName}', '${pagiumId}');`
  } else {
    return `require("../components/${componentName}/index.js")('${moduleName}', '${pagiumId}');`
  }
}

//返回基础组件模板引入
const getRequireTpl = (componentName, pagiumId, data) => {
  return `require("../components/${componentName}/index.tpl?pagiumId=${pagiumId}&name=${componentName}&data=${data}");`
}

//返回基础组件样式引入
const getRequireCss = (componentName, pagiumId, type, isBus) => {
  type = type ? type : 'css'
  if (isBus) {
    return `require("../buscomponents/${componentName}/index.${type}?pagiumId=${pagiumId}");`
  } else {
    return `require("../components/${componentName}/index.${type}?pagiumId=${pagiumId}");`
  }
}

//返回业务组件模板引入
const getgetRequireFa = (componentName, pagiumId, data, moduleName) => {
  return `require("../buscomponents/${componentName}/index.fa?pagiumId=${pagiumId}&name=${componentName}&data=${data}&moduleName=${moduleName}");`
}

module.exports = function (source) {
  console.log('***********基础解析器开始解析***********');
  let reAll = /name="(\w+)"\sdata="(\w+)"(\starget="([\w|,]+)")?/g //寻找带data的所有正则  -- 主要针对基础组件
  let reSingle = /name="(\w+)"\sdata="(\w+)"(\starget="([\w|,]+)")?/ //寻找基础组件的单一正则
  let reNodata = /name="(\w+)"(\starget="([\w|,]+)")?/ //寻找基础组件没有带data的正则
  let reTotal = /{{{(.*?)}}}?/g //寻找所有基础组件的正则

  let reBusSingle = /name="(\w+)"\sisparent\sdata="(\w+)"(\starget="([\w|,]+)")?/
  let reBusNodata = /name="(\w+)"\sisparent(\starget="([\w|,]+)")?/
  let moduleName = util.basename(this.resourcePath, '.pg')

  // 解析模板
  let comItems = []; //基础组件项
  let buscomItems = []; //业务组件项
  let coms = source.match(reTotal)
  let isHaveBus = false; //是否含有父组件

  for (let index in coms) { //轮询pg文件内容
    let com = coms[index]
    let items = [];
    let busItems = [];

    if (com.indexOf('isparent') > -1) { //表示为业务组件（父组件）
      isHaveBus = true;
      let dataobj;
      if(com.indexOf('data')> -1){ //表示为有data
        busItems = com.match(reBusSingle)
        // 获取数据，解析模板
        dataobj = this.query.data(busItems[2])
      }else{
        busItems = com.match(reBusNodata)
        let metaData = this.query.busmeta(busItems[1]).data
        busItems[2] = 'msdata';
        //如果花括号没有data数据，则读取目录
        dataobj = metaData.data;
      }
      buscomItems.push({
        name: busItems[1],
        data: busItems[2],
        target: typeof busItems[4] != 'undefined' ? busItems[4] : '',
        dataobj: dataobj,
        key: `${moduleName}_bus_${index}`
      })
    } else { //表示为基础组件（子组件）
      if (com.indexOf('data') > -1) { // 有data的
        items = com.match(reSingle)
        let metaData = this.query.meta(items[1])
        let dataobj;
        if (items[2].indexOf('msdata') > -1) {
          //如果花括号没有data数据，则读取目录
          dataobj = metaData.data;
        } else {
          // 获取数据，解析模板
          dataobj = this.query.data(items[2])
        }
     
        comItems.push({
          name: items[1],
          data: items[2],
          target: typeof items[4] != 'undefined' ? items[4] : '',
          dataobj: dataobj,
          key: `${moduleName}_${index}`
        })
      } else { //无data
        items = com.match(reNodata)
        let metaData = this.query.meta(items[1])
        // 获取数据，解析模板
        let dataobj = metaData.data;
        comItems.push({
          name: items[1],
          data: 'msdata',
          dataobj: dataobj,
          target: typeof items[4] != 'undefined' ? items[4] : '',
          key: `${moduleName}_${index}`
        })
      }
    }
  }

  // 拼装模块代码
  let items = []
  for (let item of comItems) {
    let metaData = this.query.meta(item.name)
    items.push(getRequireJs(item.name, item.key, moduleName, false))
    items.push(getRequireTpl(item.name, item.key, item.data))
    items.push(getRequireCss(item.name, item.key, metaData.css, false))
  }
  for (let bitem of buscomItems) {
    let metaData = this.query.busmeta(bitem.name)
    items.push(getRequireJs(bitem.name, bitem.key, moduleName, true))
    items.push(getgetRequireFa(bitem.name, bitem.key, bitem.data, moduleName))
    items.push(getRequireCss(bitem.name, bitem.key, metaData.css, true))
  }

  comItems = comItems.concat(buscomItems);
  let result = 'var baseComData =' + JSON.stringify(comItems)
  this.emitFile(`${moduleName}.json.js`, result)
  if(!isHaveBus){
    let reslist = 'var busData = [] ';
    this.emitFile(`${moduleName}.bus.json.js`, reslist)
  }
  
  return items.join('\n')
}
