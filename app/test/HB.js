import { device, load } from "./HBUtils";
import req from "./HBReq";

class HB {
  constructor() {
    this.hb = "1.0.0";
    this.init();
  }
  init() {
    this.initDevice(this.env());
    return this;
  }
  initDevice(env) {
    switch (env) {
      case "ios":
        load(
          "https://i.cdn.zhaoshang800.com/web-resources/cordova/ios/cordova.js",
          () => {
            this.checkCordovaReady();
          }
        );
        break;
      case "android":
        load(
          "https://i.cdn.zhaoshang800.com/web-resources/cordova/android/cordova.js",
          () => {
            this.checkCordovaReady();
          }
        );
        break;
      default:
        this.initReq("web");
        break;
    }
  }
  env() {
    this.hbenv = device();
    return this.hbenv;
  }
  initReq(type) {
    if (
      type === "cordova" &&
      (this.hbenv === "ios" || this.hbenv === "android")
    ) {
      req.setType("cordova");
    } else if (type === "web") {
      req.setType("web");
    } else {
      alert("初始化失败");
    }
    this.req = req;
  }
  checkCordovaReady() {
    document.addEventListener(
      "deviceready",
      () => {
        this.initReq("cordova");
      },
      false
    );
  }
}

export default HB;
