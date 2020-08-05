function device() {
  const WIN = window;
  const { location: LOC, navigator: NA } = WIN;
  const UA = NA.userAgent.toLowerCase();
  const test = function (needle) {
    return needle.test(UA);
  };
  const isInHB = test(/partner/);
  const isTouch = "ontouchend" in WIN;
  const isAndroid = test(/android|htc/) || /linux/i.test(NA.platform + "");
  const isIPad = !isAndroid && test(/ipad/);
  const isIPhone = !isAndroid && test(/ipod|iphone/);
  const isIOS = isIPad || isIPhone;
  const isWinPhone = test(/windows phone/);
  const isWeixin = test(/micromessenger/);
  const isPC = !isAndroid && !isIOS && !isWinPhone;

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

export { device, load };
