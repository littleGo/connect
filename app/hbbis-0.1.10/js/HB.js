(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = 
		global.document
      ? factory(global, true)
      : function (w) {
          if (!w.document) {
            throw new Error("HB requires a window with a document");
          }
          return factory(w);
        };
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  "use strict";

  var class2type = {},
    toString = class2type.toString,
    getProto = Object.getPrototypeOf,
    hasOwn = class2type.hasOwnProperty,
    fnToString = hasOwn.toString,
    ObjectFunctionString = fnToString.call(Object),
    arr = [],
    slice = arr.slice;

  var version = "0.0.1",
    HB = function (selector, context) {
      return new HB.fn.init(selector, context);
    };

  HB.fn = HB.prototype = {
    hb: version,

    constructor: HB,

    hbenv: null,
  };

  HB.extend = HB.fn.extend = function () {
    var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !HB.isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (
            deep &&
            copy &&
            (HB.isPlainObject(copy) || (copyIsArray = HB.isArray(copy)))
          ) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && HB.isArray(src) ? src : [];
            } else {
              clone = src && HB.isPlainObject(src) ? src : {};
            }
            target[name] = HB.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  function Identity(v) {
    return v;
  }
  function Thrower(ex) {
    throw ex;
  }
  function adoptValue(value, resolve, reject) {
    var method;
    try {
      if (value && HB.isFunction((method = value.promise))) {
        method.call(value).done(resolve).fail(reject);
      } else if (value && HB.isFunction((method = value.then))) {
        method.call(value, resolve, reject);
      } else {
        resolve.call(undefined, value);
      }
    } catch (value) {
      reject.call(undefined, value);
    }
  }
  HB.extend({
    error: function (msg) {
      throw new Error(msg);
    },

    isFunction: function (obj) {
      return HB.type(obj) === "function";
    },

    isArray: Array.isArray,

    isWindow: function (obj) {
      return obj != null && obj === obj.window;
    },

    type: function (obj) {
      if (obj == null) {
        return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function"
        ? class2type[toString.call(obj)] || "object"
        : typeof obj;
    },

    // env: function(){

    // },

    isPlainObject: function (obj) {
      var proto, Ctor;
      if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
      }
      proto = getProto(obj);
      if (!proto) {
        return true;
      }
      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return (
        typeof Ctor === "function" &&
        fnToString.call(Ctor) === ObjectFunctionString
      );
    },
    each: function (obj, callback) {
      var length,
        i = 0;
      if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }

      return obj;
    },
    Deferred: function (func) {
      var tuples = [
          [
            "notify",
            "progress",
            HB.Callbacks("memory"),
            HB.Callbacks("memory"),
            2,
          ],
          [
            "resolve",
            "done",
            HB.Callbacks("once memory"),
            HB.Callbacks("once memory"),
            0,
            "resolved",
          ],
          [
            "reject",
            "fail",
            HB.Callbacks("once memory"),
            HB.Callbacks("once memory"),
            1,
            "rejected",
          ],
        ],
        state = "pending",
        promise = {
          state: function () {
            return state;
          },
          always: function () {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          catch: function (fn) {
            return promise.then(null, fn);
          },
          pipe: function (/* fnDone, fnFail, fnProgress */) {
            var fns = arguments;

            return HB.Deferred(function (newDefer) {
              HB.each(tuples, function (i, tuple) {
                var fn = HB.isFunction(fns[tuple[4]]) && fns[tuple[4]];
                deferred[tuple[1]](function () {
                  var returned = fn && fn.apply(this, arguments);
                  if (returned && HB.isFunction(returned.promise)) {
                    returned
                      .promise()
                      .progress(newDefer.notify)
                      .done(newDefer.resolve)
                      .fail(newDefer.reject);
                  } else {
                    newDefer[tuple[0] + "With"](
                      this,
                      fn ? [returned] : arguments
                    );
                  }
                });
              });
              fns = null;
            }).promise();
          },
          then: function (onFulfilled, onRejected, onProgress) {
            var maxDepth = 0;
            function resolve(depth, deferred, handler, special) {
              return function () {
                var that = this,
                  args = arguments,
                  mightThrow = function () {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then =
                      returned &&
                      (typeof returned === "object" ||
                        typeof returned === "function") &&
                      returned.then;
                    if (HB.isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred, Identity, special),
                          resolve(maxDepth, deferred, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred, Identity, special),
                          resolve(maxDepth, deferred, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred,
                            Identity,
                            deferred.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = undefined;
                        args = [returned];
                      }
                      (special || deferred.resolveWith)(that, args);
                    }
                  },
                  process = special
                    ? mightThrow
                    : function () {
                        try {
                          mightThrow();
                        } catch (e) {
                          if (HB.Deferred.exceptionHook) {
                            HB.Deferred.exceptionHook(e, process.stackTrace);
                          }
                          if (depth + 1 >= maxDepth) {
                            if (handler !== Thrower) {
                              that = undefined;
                              args = [e];
                            }

                            deferred.rejectWith(that, args);
                          }
                        }
                      };
                if (depth) {
                  process();
                } else {
                  if (HB.Deferred.getStackHook) {
                    process.stackTrace = HB.Deferred.getStackHook();
                  }
                  window.setTimeout(process);
                }
              };
            }

            return HB.Deferred(function (newDefer) {
              tuples[0][3].add(
                resolve(
                  0,
                  newDefer,
                  HB.isFunction(onProgress) ? onProgress : Identity,
                  newDefer.notifyWith
                )
              );
              tuples[1][3].add(
                resolve(
                  0,
                  newDefer,
                  HB.isFunction(onFulfilled) ? onFulfilled : Identity
                )
              );
              tuples[2][3].add(
                resolve(
                  0,
                  newDefer,
                  HB.isFunction(onRejected) ? onRejected : Thrower
                )
              );
            }).promise();
          },
          promise: function (obj) {
            return obj != null ? HB.extend(obj, promise) : promise;
          },
        },
        deferred = {};

      HB.each(tuples, function (i, tuple) {
        var list = tuple[2],
          stateString = tuple[5];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(
            function () {
              state = stateString;
            },
            tuples[3 - i][2].disable,
            tuples[0][2].lock
          );
        }
        list.add(tuple[3].fire);
        deferred[tuple[0]] = function () {
          deferred[tuple[0] + "With"](
            this === deferred ? undefined : this,
            arguments
          );
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    when: function (singleValue) {
      var remaining = arguments.length,
        i = remaining,
        resolveContexts = Array(i),
        resolveValues = slice.call(arguments),
        master = HB.Deferred(),
        updateFunc = function (i) {
          return function (value) {
            resolveContexts[i] = this;
            resolveValues[i] =
              arguments.length > 1 ? slice.call(arguments) : value;
            if (!--remaining) {
              master.resolveWith(resolveContexts, resolveValues);
            }
          };
        };
      if (remaining <= 1) {
        adoptValue(
          singleValue,
          master.done(updateFunc(i)).resolve,
          master.reject
        );
        if (
          master.state() === "pending" ||
          HB.isFunction(resolveValues[i] && resolveValues[i].then)
        ) {
          return master.then();
        }
      }
      while (i--) {
        adoptValue(resolveValues[i], updateFunc(i), master.reject);
      }

      return master.promise();
    },
  });

  HB.each(
    "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
      " "
    ),
    function (i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    }
  );

  function isArrayLike(obj) {
    var length = !!obj && "length" in obj && obj.length,
      type = HB.type(obj);
    if (type === "function" || HB.isWindow(obj)) {
      return false;
    }
    return (
      type === "array" ||
      length === 0 ||
      (typeof length === "number" && length > 0 && length - 1 in obj)
    );
  }

  var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

  HB.Deferred.exceptionHook = function (error, stack) {
    if (
      window.console &&
      window.console.warn &&
      error &&
      rerrorNames.test(error.name)
    ) {
      window.console.warn(
        "HB.Deferred exception: " + error.message,
        error.stack,
        stack
      );
    }
  };

  var rnotwhite = /\S+/g;
  function createOptions(options) {
    var object = {};
    HB.each(options.match(rnotwhite) || [], function (_, flag) {
      object[flag] = true;
    });
    return object;
  }

  HB.readyException = function (error) {
    window.setTimeout(function () {
      throw error;
    });
  };

  HB.Callbacks = function (options) {
    options =
      typeof options === "string"
        ? createOptions(options)
        : HB.extend({}, options);

    var firing,
      memory,
      fired,
      locked,
      list = [],
      queue = [],
      firingIndex = -1,
      fire = function () {
        locked = options.once;
        fired = firing = true;
        for (; queue.length; firingIndex = -1) {
          memory = queue.shift();
          while (++firingIndex < list.length) {
            if (
              list[firingIndex].apply(memory[0], memory[1]) === false &&
              options.stopOnFalse
            ) {
              firingIndex = list.length;
              memory = false;
            }
          }
        }
        if (!options.memory) {
          memory = false;
        }

        firing = false;
        if (locked) {
          if (memory) {
            list = [];
          } else {
            list = "";
          }
        }
      },
      self = {
        add: function () {
          if (list) {
            if (memory && !firing) {
              firingIndex = list.length - 1;
              queue.push(memory);
            }

            (function add(args) {
              HB.each(args, function (_, arg) {
                if (HB.isFunction(arg)) {
                  if (!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                } else if (arg && arg.length && HB.type(arg) !== "string") {
                  add(arg);
                }
              });
            })(arguments);

            if (memory && !firing) {
              fire();
            }
          }
          return this;
        },
        remove: function () {
          HB.each(arguments, function (_, arg) {
            var index;
            while ((index = HB.inArray(arg, list, index)) > -1) {
              list.splice(index, 1);
              if (index <= firingIndex) {
                firingIndex--;
              }
            }
          });
          return this;
        },
        has: function (fn) {
          return fn ? HB.inArray(fn, list) > -1 : list.length > 0;
        },
        empty: function () {
          if (list) {
            list = [];
          }
          return this;
        },
        disable: function () {
          locked = queue = [];
          list = memory = "";
          return this;
        },
        disabled: function () {
          return !list;
        },
        lock: function () {
          locked = queue = [];
          if (!memory && !firing) {
            list = memory = "";
          }
          return this;
        },
        locked: function () {
          return !!locked;
        },
        fireWith: function (context, args) {
          if (!locked) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args];
            queue.push(args);
            if (!firing) {
              fire();
            }
          }
          return this;
        },
        fire: function () {
          self.fireWith(this, arguments);
          return this;
        },
        fired: function () {
          return !!fired;
        },
      };
    return self;
  };

  var readyList = HB.Deferred();

  HB.fn.ready = function (fn) {
    readyList.then(fn).catch(function (error) {
      HB.readyException(error);
    });

    return this;
  };

  var init = (HB.fn.init = function (selector, context) {
    HB.start();
    if (!selector) {
      return this;
    }
    if (HB.isFunction(selector)) {
      return HB.ready !== undefined ? HB.ready(selector) : selector(HB);
    } else {
      return new Error("HB can not spport for this type of selector");
    }
  });

  init.prototype = HB.fn;

  HB.extend({
    isReady: false,
    readyWait: 1,
    holdReady: function (hold) {
      if (hold) {
        HB.readyWait++;
      } else {
        HB.ready(true);
      }
    },
    ready: function (wait) {
      if (wait === true ? --HB.readyWait : HB.isReady) {
        return;
      }
      HB.isReady = true;
      if (wait !== true && --HB.readyWait > 0) {
        return;
      }
      readyList.resolveWith(document, [HB]);
    },
  });

  HB.ready.then = readyList.then;
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    HB.ready();
  }
  if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
  ) {
    window.setTimeout(HB.ready);
  } else {
    document.addEventListener("DOMContentLoaded", completed);
    window.addEventListener("load", completed);
  }

  HB.extend({
    env: function () {
      HB.fn.hbenv = HB.device();
      return HB.fn.hbenv;
    },
    device: function () {
      var WIN = window,
        LOC = WIN["location"],
        NA = WIN.navigator,
        UA = NA.userAgent.toLowerCase();
      //UA = 'partner android'
      var test = function (needle) {
        return needle.test(UA);
      };

      var isTouch = "ontouchend" in WIN,
        isIPad = !isAndroid && test(/ipad/),
        isIPhone = !isAndroid && test(/ipod|iphone/),
        isInHB = test(/partner/),
        isAndroid = test(/android|htc/) || /linux/i.test(NA.platform + ""),
        isIOS = isIPad || isIPhone,
        isWinPhone = test(/windows phone/),
        isWebapp = !!NA["standalone"],
        isXiaoMi = isAndroid && test(/mi\s+/),
        isUC = test(/ucbrowser/),
        isWeixin = test(/micromessenger/),
        isBaiduBrowser = test(/baidubrowser/),
        isChrome = !!WIN["chrome"],
        isBaiduBox = test(/baiduboxapp/),
        isPC = !isAndroid && !isIOS && !isWinPhone,
        isHTC = isAndroid && test(/htc\s+/),
        isBaiduWallet = test(/baiduwallet/);

      var isDebug = !!~("" + LOC["port"]).indexOf("0");

      return isInHB && !isPC
        ? isIOS
          ? "ios"
          : isAndroid
          ? "android"
          : "wp"
        : isPC
        ? "pc"
        : isWeixin
        ? "weixin"
        : isTouch
        ? "touch"
        : null;
    },
  });

  HB.extend({
    //加载script的方法
    load: function (src, callback) {
      var doc = document,
        head =
          doc.head ||
          doc.getElementsByTagName("head")[0] ||
          doc.documentElement,
        baseElement = head.getElementsByTagName("base")[0];

      var currentlyAddingScript;

      var node = document.createElement("script");
      node.async = false;
      node.src = src;

      console.log("node src", node.src);

      currentlyAddingScript = node;

      baseElement
        ? head.insertBefore(node, baseElement)
        : head.appendChild(node);

      currentlyAddingScript = null;

      callback();
    },
    sDic: {
      ios: "./ios/",
      android: "./android/",
      web: "./web/",
    },
    initDevice: function (env) {
      var url = location.protocol + "//test.zhaoshang800.com";
      if (
        location.hostname === "app.zhaoshang800.com" ||
        location.hostname === "manager.zhaoshang800.com"
      ) {
        url = location.protocol + "//app.zhaoshang800.com";
      }
      switch (env) {
        case "ios":
          console.log("initDevice");
          // alert("initDevice")
          HB.load(url + "/HB/dist/cordova/ios/cordova.js", function () {
            HB.checkCordovaReady();
          });
          break;
        // require("ios");
        // HB.checkCordovaReady();break;
        case "android":
          HB.load(url + "/HB/dist/cordova/android/cordova.js", function () {
            //alert("android");
            HB.checkCordovaReady();
          });
          break;
        //HB.initReq("cordova");
        // require("android");
        // HB.checkCordovaReady();break;

        default:
          require("./web/hbHttp");
          HB.initReq("web");
          break;
        // case "ios": var cordova = require("cordova/cordova.js");break;
        // case "android": var cordova= require("cordova/cordova.js");break;
        //default:null;break;
      }
    },
    start: function () {
      HB.initDevice(HB.env());
    },
    checkCordovaReady: function () {
      setTimeout(function () {
        document.addEventListener(
          "deviceready",
          function () {
            //alert("ready");
            HB.initReq("cordova");
          },
          false
        );
      }, 0);
    },
    initReq: function (type) {
      var req = require("./hbReq");
      if (
        type === "cordova" &&
        (HB.fn.hbenv === "ios" || HB.fn.hbenv === "android")
      ) {
        req.setType("cordova");
      } else if (type === "web") {
        req.setType("web");
      } else {
        alert("初始化失败");
      }
      HB.fn.req = HB.req = req;
    },
  });

  HB.fn.extend({});

  if (typeof define === "function" && define.amd) {
    define("HB", [], function () {
      return HB;
    });
  }

  var _HB = window.HB;

  HB.noConflict = function (deep) {
    if (deep && window.HB === HB) {
      window.HB = _HB;
    }
    return HB;
  };

  if (noGlobal) {
    window.HB = HB;
  }
  // if ( !noGlobal ) {
  // 	window.HB = HB;
  // }
  return HB;
});
