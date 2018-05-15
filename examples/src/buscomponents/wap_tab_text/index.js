var Component = function (pagiumId) {
  this.pagiumId = pagiumId;
};

module.exports = function (pageName, pagiumId) {
  var eventManage = require('EventManage');
  var com = new Component(pagiumId);
  setTimeout(() => {
    var currentObj = eventManage.initFa(pagiumId, com);
    var children = currentObj.children;
    var textObjID = children.index_bus_0;
    var tabObjID = children.index_bus_1;
    tabObjID.eventFuc = function (target) {
      let id = $(target).attr('data-id');
      let text = $(target).html();
      textObjID.updateTxt(textObjID.pagiumId, text)
    }
  }, 500);
};
