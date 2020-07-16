let url = "https://api.zhaoshang800.com";

if (location.hostname === "app.zhaoshang800.com") {
  url = "https://api.zhaoshang800.com";
}
if (location.hostname === "prepmis.zhaoshang800.com") {
  url = "https://pre.zhaoshang800.com";
}
if (location.hostname == "test.pmis.zhaoshang800.local") {
  url = "http://test.zhaoshang800.local";
}
if (location.hostname == "uat.pmis.zhaoshang800.local") {
  url = "http://uat.zhaoshang800.local";
}
if (location.hostname == "mars.pmis.zhaoshang800.local") {
  url = "http://mars.zhaoshang800.local";
}
if (location.hostname == "dev.pmis.zhaoshang800.local") {
  url = "http://dev.zhaoshang800.local";
}
if (location.hostname == "xdev.pmis.zhaoshang800.local") {
  url = "http://xdev.zhaoshang800.local";
}
if (location.hostname == "sit.pmis.zhaoshang800.local") {
  url = "http://sit.zhaoshang800.local";
}
// 本地测试地址
url = "http://test.zhaoshang800.local";

export { url };
