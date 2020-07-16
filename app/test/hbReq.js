module.exports = {
  reqType: null,
  setType: function (type) {
    this.reqType = type;
  },
  getType: function (type) {
    return this.reqType;
  },
  send: function (action, params, callback, type = "getRemoteData", isNode) {
    const sType = this.reqType;
    const errMsg = { code: "-1", msg: "获取数据出错", data: {} };
    if (sType === "cordova") {
      if (!isNode) {
        const { cordovaExec } = require("./reqSend");
        cordovaExec(action, params, callback, type);
        return;
      }
      const { ajaxPost } = require("./reqSend");
      ajaxPost(action, params, callback);
      return;
    }

    if (sType === "web") {
      const { ajaxPost } = require("./reqSend");
      ajaxPost(action, params, callback);
      return;
    }

    callback(errMsg);
  },
};
