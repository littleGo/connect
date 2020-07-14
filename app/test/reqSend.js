const errMsg = { code: "-1", msg: "获取数据出错", data: {} };

export function ajaxPost(action, params, callback) {
  const { post } = require("./web/webHttp");
  post(action, params)
    .then((res) => callback(res))
    .catch(() => callback(errMsg));
}

function promiseTimeout(promise, delay) {
  let timeout = new Promise(function (reslove, reject) {
    setTimeout(function () {
      reject("超时");
    }, delay);
  });
  return Promise.race([timeout, promise]);
}

export function cordovaExec(action, params, callback, type) {
  if (!cordova) return;
  //IOS webview 最高只支持10s的通信时间
  function task() {
    const sendParams = {
      action,
      params,
    };
    return new Promise((resolve, reject) => {
      cordova.exec(
        function (data) {
          resolve(data);
        },
        function (err) {
          reject(err);
        },
        "HB",
        type,
        [sendParams]
      );
    });
  }
  promiseTimeout(task(), 20000)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      callback(err);
    });
}
