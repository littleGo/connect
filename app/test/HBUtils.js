function error(msg) {
  throw new Error(msg);
}
function isFunction(obj) {
  return type(obj) === "function";
}
function isArray(data) {
  return Array.isArray(data);
}
function isWindow(obj) {
  return obj != null && obj === obj.window;
}
function type(obj) {
  if (obj == null) {
    return obj + "";
  }
  return typeof obj;
}
function isPlainObject(obj) {
  let proto;
  let Ctor;
  if (!obj || obj.toString() !== "[object Object]") {
    return false;
  }
  proto = Object.getPrototypeOf(obj);
  if (!proto) {
    return true;
  }
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString
  );
}
function each(obj, callback) {
  let length;
  let i = 0;
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
}
function device() {
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
}
function load(src, callback) {
  var doc = document,
    head =
      doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
    baseElement = head.getElementsByTagName("base")[0];

  var currentlyAddingScript;

  var node = document.createElement("script");
  node.async = false;
  node.src = src;

  console.log("node src", node.src);

  currentlyAddingScript = node;

  baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);

  currentlyAddingScript = null;

  callback();
}

export {
  error,
  isFunction,
  isArray,
  isWindow,
  type,
  isPlainObject,
  each,
  device,
  load,
};
