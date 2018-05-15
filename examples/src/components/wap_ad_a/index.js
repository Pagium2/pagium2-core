var Component = function(pagiumId) {
    this.pagiumId = pagiumId;
  };
  
  module.exports = function(pageName, pagiumId) {
    var eventManage = require('EventManage');
    var com = new Component(pagiumId);
    var currentObj = eventManage.init(pagiumId,com)
  };
  