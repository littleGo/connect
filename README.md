# HB 库

## 简介

HB 库是伙伴经纪人 APP 使用的原生与 H5 通信模块，可以通过分辨当前设备环境加载相应模块进行通信

支持 web、android、ios

基于 axios、cordova 实现通信

## 示例

npm start 运行项目, 查看示例 http://localhost:9527/test/

## 引入

两种方式

1. cdn 地址
   v1.0.0 版本
   <code>https://i.cdn.zhaoshang800.com/web-resources/HB/v1.0.0/HB.js</code>

例如：<code>script src="https://i.cdn.zhaoshang800.com/web-resources/HB/v1.0.0/HB.js"</code>

2. 安装 npm 私有包

设置 npm 源
npm config set registry http://nexus.zhaoshang800.local/repository/npm-group/

安装
npm install huoban-hb@1.0.0

## API

### 1、创建 HB 对象

<code>const hb = new HB()</code>

- 创建之后会通过当前环境加载不同的通信模块，如在 web 浏览器中会加载 HBReq 模块来进行 web 通信。在 ios、android 中会加载相应的 cordova.js 模块

### 2、查看当前环境

<code>hb.hbenv</code>
返回结果:ios、android、web

### 3、发送请求类

<code>hb.req.send(action, params, callback, type, isNode)</code>

- action:操作名
- params:参数
- callback:回调方法
- type:操作类型
- isNode:是否通过 Node 环境透传

#### type 类型

- getRemoteData: 获取远端数据
- nativeAction: 调用设备方法
- getLocalData: 获取 app 数据
- 默认:getRemoteData

#### 数据请求方法

- action : 接口名
- params : 参数名
- type :getRemoteData
- isNode : true,通过 node 透传

#### 设备方法

##### 获取设备信息

- action : getAppInfo（主要用来获取 APP 版本信息）
- params : {}
- type : nativeAction

##### 获取用户信息

- action : getUserInfo(主要用来获取用户信息、如 id、token、电话、userName 等)
- params : {}
- type : getLocalData

##### 图片放大

- action : enlargeImg
- params : {index : index(图片序号), list:[](图片数组)}
- type : nativeAction

##### 拨打电话

- action : phoneCall
- params : {phoneNumber : phoneNumber}
- type : nativeAction

##### 调用系统通讯录

- action : pickContact
- params : []
- type : nativeAction

##### 获取地理位置信息（城市名）

- action : getGeoLocation
- pramas : {}
- type : nativeAction

##### 下载文件

- action : downLoadFile
- pramas : {file:file(文件 url)}
- type : nativeAction

##### 打开文件

- action : openFile
- pramas : {file:file(文件 url)}
- type : nativeAction

##### 检查文件是否已下载完成

- action : checkFilesExist
- pramas : {files:[](文件url数组)}
- type : nativeAction

##### 保存图片到相册

- action : savePics
- pramas : {piclist : [](图片 url)}
- type : nativeAction

##### 调用分享

- action : share
- pramas : {url : file(url), title:""(分享标题), content:"分享内容", logo:(分享块的图片 url)}
- type : nativeAction

##### 调用系统跳转

- action : changePage
- <code>
  params:{
    "jumpInfo":{
      "routeKey":"H5_XXXXXX",
      "titleStyle":"0",
      "appTitle":"详情",
      "shareTitle":"XXX",
      "shareContent":"XXX",
      "shareLogo":"XXX",
      "params":[
        {
        "label":"id",
        "value":"43948723594"
        }
      ]
    }
  }
  <code>

- type : nativeAction

- 附：titleStyle:h5 跳转的类型：
  0 - 原生导航栏
  1 - 原生导航栏，右侧显示分享按钮
  2 - H5 导航栏，状态栏内容为黑色
  3 - H5 导航栏，状态栏内容为白色

##### 调用系统回退页面

- action : backPage
- pramas : {needRefresh:1(1 表示回退后刷新页面，0 不刷新)}
- type : nativeAction

更多 api 请查看 showDoc `http://showdoc.zhaoshang800.local/web/#/19?page_id=1661`
