//var HB = require('HB');
module.exports = {
  reqType: null,
  setType: function(type) {
    this.reqType = type;
  },
  getType: function(type) {
    return this.reqType;
  },
  // native: function(action, params, callback){
  // 	var sType = this.reqType;
  // 	if(sType === "cordova"){
  // 		if(typeof cordova !== undefined){
  // 			var sendParams = {
  // 				"action" : action,
  // 				"params" : params
  // 			}
  // 			//params["action"] = action;
  // 			var def = HB.Deferred();
  // 			var result = null;
  // 			var wait = function(def){
  // 				var tasks = function(){
  // 						cordova.exec(function(data){
  // 						result = data;
  // 						def.resolve();
  // 					},
  // 					// function(){
  // 					// 	def.reject();
  // 					// }, "HB", action, [params]);
  // 					function(){
  // 						def.reject();
  // 					}, "HB", "nativeAction", [sendParams]);
  // 				}
  // 				tasks();
  // 				return def.promise();
  // 			}
  // 			HB.when(wait(def))
  // 				.done(function(){callback(result)})
  // 				.fail(function(){alert("获取数据出错")});
  // 			//cordova.exec(callback, function(){alert("error")}, "HB", action, [params]);
  // 		}
  // 	}
  // },
  send: function(action, params, callback, type, isNode) {
    var sType = this.reqType;
    if (type == undefined) {
      type = "getRemoteData";
    }
    if (sType === "cordova") {
      if (!isNode) {
        if (typeof cordova !== undefined) {
          var sendParams = {
            action: action,
            params: params
          };
          //params["action"] = action;
          // require("hbHttp");
          require("./web/hbHttp");
          var def = HB.Deferred();
          var result = null;
          //IOS webview 最高只支持10s的通信时间
          var timeOuter = window.setTimeout(function() {
            def.reject();
          }, 20000);
          var wait = function(def) {
            var tasks = function() {
              cordova.exec(
                function(data) {
                  result = data;
                  def.resolve();
                },
                // function(){
                // 	def.reject();
                // }, "HB", action, [params]);

                function() {
                  def.reject();
                },
                "HB",
                type,
                [sendParams]
              );
            };
            tasks();
            return def.promise();
          };
          HB.when(wait(def))
            .done(function() {
              window.clearTimeout(timeOuter);
              callback(result);
            })
            //.done(function(){callback(result)})
            .fail(function() {
              callback(
                JSON.parse('{"code":"-1","msg":"获取数据出错","data":{}}')
              );
            });
          //.fail(alert("获取数据出错"));
          //cordova.exec(callback, function(){alert("error")}, "HB", action, [params]);
        }
      } else {
        // require("hbHttp");
        require("./web/hbHttp");
        var url = "https://test.zhaoshang800.com/" + action;
        // if(location.hostname === "app.zhaoshang800.com" || location.hostname === "i.cdn.zhaoshang800.com"){
        // 	url = "https://app.zhaoshang800.com/"+action+"?c=app";
        // }
        if (
          location.hostname === "app.zhaoshang800.com" ||
          location.hostname === "i.cdn.zhaoshang800.com"
        ) {
          url = "https://app.zhaoshang800.com/" + action;
        }
        HB.ajaxSetup({ contentType: "application/json; charset=utf-8" });
        //var param ="{\"action\":\""+action+"\",\"params\":"+JSON.stringify(params)+"}";
        var param = {
          action: action,
          params: params
        };

        param = JSON.stringify(param);

        HB.ajax({
          url: url,
          method: "POST",
          data: param
        })
          .done(function(data) {
            callback(data);
          })
          .fail(function(data) {
            callback(
              JSON.parse('{"code":"-1","msg":"获取数据出错","data":{}}')
            );
          });
      }
    } else if (sType === "web") {
      if (typeof HB.req !== undefined) {
        if (!isNode) {
          var url = "http://dev.api.zhaoshang800.com/";
          if (
            location.hostname === "app.zhaoshang800.com" ||
            location.hostname === "i.cdn.zhaoshang800.com"
          ) {
            url = "https://api.zhaoshang800.com/";
          }
          if (location.hostname == "test.zhaoshang800.com") {
            url = "https://test.zhaoshang800.com/";
          }
          if (location.hostname == "test.pmis.zhaoshang800.com") {
            url = "https://test.zhaoshang800.com/";
          }
          if (location.hostname == "uat.pmis.zhaoshang800.com") {
            url = "http://uat.zhaoshang800.com/";
          }
          if (location.hostname == "titan.zhaoshang800.com") {
            url = "http://mars.zhaoshang800.com/";
          }
          if (location.hostname == "prepmis.zhaoshang800.com") {
            url = "http://pre.zhaoshang800.com/";
          }
          HB.ajaxSetup({ contentType: "application/json; charset=utf-8" });
          HB.ajax({
            url: url + action,
            method: "POST",
            data: params,
            headers: { s: "h5" }
          })
            .done(function(data) {
              callback(data);
            })
            .fail(function(data) {
              callback(
                JSON.parse('{"code":"-1","msg":"获取数据出错","data":{}}')
              );
            });
        } else {
          var url =
            "http://dev.api.zhaoshang800.com/front-end/hbac/hbgetbroker.ac";
          if (location.hostname == "test.zhaoshang800.com") {
            url = "https://test.zhaoshang800.com/front-end/hbac/hbgetbroker.ac";
          }
          if (location.hostname == "test.pmis.zhaoshang800.com") {
            url = "https://test.zhaoshang800.com/front-end/hbac/hbgetbroker.ac";
          }
          if (location.hostname == "uat.pmis.zhaoshang800.com") {
            url = "https://uat.zhaoshang800.com/front-end/hbac/hbgetbroker.ac";
          }
          if (location.hostname == "titan.zhaoshang800.com") {
            url = "https://mars.zhaoshang800.com/front-end/hbac/hbgetbroker.ac";
          }
          if (location.hostname == "prepmis.zhaoshang800.com") {
            url = "https://pre.zhaoshang800.com/front-end/hbac/hbgetbroker.ac";
          }
          if (
            location.hostname === "app.zhaoshang800.com" ||
            location.hostname === "i.cdn.zhaoshang800.com"
          ) {
            url = "https://app.zhaoshang800.com/hbac/hbgetbroker.ac?c=app";
          }
          HB.ajaxSetup({ contentType: "application/json; charset=utf-8" });
          //var param ="{\"action\":\""+action+"\",\"params\":"+JSON.stringify(params)+"}";
          var param = {
            action: action,
            params: params
          };
          param = JSON.stringify(param);
          HB.ajax({
            url: url,
            method: "POST",
            data: param,
            headers: { s: "h5" }
          })
            .done(function(data) {
              callback(data);
            })
            .fail(function(data) {
              callback(
                JSON.parse('{"code":"-1","msg":"获取数据出错","data":{}}')
              );
            });
        }
      }
    } else {
      callback(JSON.parse('{"code":"-1","msg":"获取数据出错","data":{}}'));
    }
  }
};
