var Component = function (pagiumId) {
  this.pagiumId = pagiumId;
};

Component.prototype.updateTxt = function (id, text) {
  $('#' + id).find('.wap_text').html(text);
}

module.exports = function (pageName, pagiumId) {
  var eventManage = require('EventManage');
  var com = new Component(pagiumId);
  var currentObj = eventManage.init(pagiumId, com)
  setTimeout(function () {
    var comData = eventManage.getBaseComData(pagiumId, baseComData);
  }, 500)
};
