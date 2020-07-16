# HB库
## 简介
HB库是伙伴经纪人APP使用的原生与H5通信模块，是在cordova基础上。可以通过分辨当前设备环境加载相应模块进行通信。支持web、android、ios。
## 引入
npm package

## API
### 1、创建HB对象
<code>const hb = new HB()</code>
* 创建之后会通过当前环境加载不同的通信模块，如在web浏览器中会加载 hbReq 模块来进行web通信。在ios、android中会加载相应的cordova.js模块

### 2、查看当前环境
<code>hb.hbenv</code>
返回结果:ios、android、web

### 3、发送请求类
<code>hb.req.send(action, params, callback, type, isNode)</code>
* action:操作名
* params:参数
* callback:回调方法
* type:操作类型
* isNode:是否通过Node环境透传

#### type类型
* getRemoteData: 获取远端数据
* nativeAction: 调用设备方法
* 默认:getRemoteData

#### 数据请求方法
* action : 接口名
* params : 参数名
* type :getRemoteData
* isNode : true,通过node透传

#### 设备方法
##### 获取设备信息
* action : getAppInfo（主要用来获取APP版本信息）
* params : {}
* type : nativeAction

##### 获取用户信息
* action : getUserInfo(主要用来获取用户信息、如id、token、电话、userName等)
* params : {}
* type : nativeAction

##### 图片放大
* action : enlargeImg
* params : {index : index(图片序号), list:[](图片数组)}
* type : nativeAction

##### 拨打电话
* action : phoneCall
* params : {phoneNumber : phoneNumber}
* type : nativeAction

##### 调用系统通讯录
* action : pickContact
* params : []
* type : nativeAction

##### 获取地理位置信息（城市名）
* action : getGeoLocation
* pramas : {}
* type : nativeAction

##### 下载文件
* action : downLoadFile
* pramas : {file:file(文件url)}
* type : nativeAction

##### 打开文件
* action : openFile
* pramas : {file:file(文件url)}
* type : nativeAction

##### 检查文件是否已下载完成
* action : checkFilesExist
* pramas : {files:[](文件url数组)}
* type : nativeAction

##### 保存图片到相册
* action : savePics
* pramas : {piclist : piclist(图片url)}
* type : nativeAction

##### 调用分享
* action : share
* pramas : {url : file(url), title:""(分享标题), content:"分享内容", logo:(分享块的图片url)}
* type : nativeAction

##### 调用系统跳转 
* action : changePage
* pramas : {url : url, iosStatusBar : 0(ios状态栏样式), androidStatusBar : 0, title:"标题", canShare:1(是否添加分享右按钮),extension:{}(额外参数例如:shareData:{title:gardenName, content:gardenIntroduce}) }
* type : nativeAction

* 附：各状态栏对应状态
0:ios带statusbar、标题栏、后退按钮
1:ios带statusbar、后退按钮
2:无statusbar、只有后退按钮
3:什么都没有，ios只有statusbar

##### 调用系统回退页面
* action : backPage
* pramas : {needRefresh:1(1表示回退后刷新页面，0不刷新)}
* type : nativeAction
