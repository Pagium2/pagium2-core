var Component = function(pagiumId) {
    this.pagiumId = pagiumId;
  };

  Component.prototype.eventFuc = function(){}

  Component.prototype.onSelect = function(target){
    this.eventFuc(target)
  }

  Component.prototype.setSelected = function(id,pagiumId){
      this.clearSelected(pagiumId);
      this.selectTab(id,pagiumId);
  }

  
  Component.prototype.onSelected = function(e,comData,com,pagiumId){
      var target;
      if($(e.srcElement).attr('class') === 'mint-tab-item'){
        target = e.srcElement
      }else{
        target = e.srcElement.parentNode.parentNode;
      }
      let i =  $(target).attr('data-id')
      this.current = target
      this.onSelect(target)
      this.setSelected(i,pagiumId)
  }

    Component.prototype.selectTab = function(id,pagiumId){

    let domList = $('#' + pagiumId).find('.mint-tab-item')
    for(let i = 0; i <domList.length; i++){
      if(id === $(domList[i]).attr('data-id')){
        $(domList[i]).addClass('is-selected')
      }
    }
  }

  /** 
   * 清除选择
  */
  Component.prototype.clearSelected = function(pagiumId){
    let domList = $('#' + pagiumId).find('.mint-tab-item')
    for(let i = 0; i <domList.length; i++){
      if($(domList[i]).attr('class').indexOf('is-selected') > -1){
        $(domList[i]).removeClass('is-selected')
      }
    }
  }
  
  /**
   * 获取选中dom的索引
   * @param {*} domid 
   * @param {*} comData 
   */
  function getSelectedDomIndex(domid,comData){
    let res = 0;
      for(let i = 0; i<comData.length; i++){
        if(domid === comData[i].id);
        res = i
      }
      return res
  }

  module.exports = function(pageName, pagiumId) {
    var eventManage = require('EventManage');
    var com = new Component(pagiumId);
    var currentObj = eventManage.init(pagiumId,com)
    setTimeout(function() {
        var comData = eventManage.getBaseComData(pagiumId,baseComData);
        $('#' + pagiumId).find('.mint-tab-item').unbind().bind('click',function(e){
          com.onSelected(e,comData,com,pagiumId)
        })
      }, 500)
  };

  