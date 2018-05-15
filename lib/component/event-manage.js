module.exports = (function () {
  // 全局唯一
  var unique;

  function ext(o, n) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
        o[p] = n[p];
    }
    return o;
  }

  var getBaseComData = function(id,list){
 
      let result = {};
      for(let i = 0; i<list.length; i++){
          if(id == list[i].key){
            result = list[i].dataobj
          }
      }
      return result;
  }

  //初始化所有组件
  var init = function (id, com) {
    var currentObj;
    if (id.indexOf('bus') > -1) { //证明是父组件
      var faID = id.split('-')[0];
      var chID = id.split('-')[1];
      currentObj = this.registerFa(faID, chID, com)
    } else {
      currentObj = this.register(id, com)
    }
    return currentObj;
  }

  /**
   * 初始化业务组件
   * @param {*} id 
   * @param {*} com 
   */
  var initFa = function (id, com) {
    var fatherid = id;
    if (!unique) {
      unique = {};
    }
    if (!unique[fatherid]) {
      unique[fatherid] = {}
    }
    var currentObj = ext(unique[fatherid], com);
    return currentObj;
  }


  /**
   * 注册组件
   * @param  {String} pagiumId  组件ID
   * @param  {Object} component 组件对象
   */
  var register = function (pagiumId, component) {
    if (unique) {
      unique[pagiumId] = component;
    } else {
      unique = {};
      unique[pagiumId] = component;
    }
    window.pagiumEventManage = unique;
    return unique[pagiumId]
  };

  var registerFa = function (fatherid, pagiumId, component) {
    if (!unique) {
      unique = {};
    } else {
      if (!unique[fatherid]) {
        unique[fatherid] = {};
        if(!unique[fatherid].children){
          unique[fatherid].children = {};
        }
      }else{
        if(!unique[fatherid].children){
          unique[fatherid].children = {};
        }
      }
    }
    unique[fatherid].children[pagiumId] = component
    return unique[fatherid].children[pagiumId]
  }

  return {
    register: register,
    registerFa: registerFa,
    init: init,
    initFa: initFa,
    getBaseComData:getBaseComData
  }
})();
