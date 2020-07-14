// import HB from "./hbbis-0.1.10/js/HB.js";
import TEST from "./test/HB";

// var hb = new HB();
// console.log(hb);

const test = new TEST(function () {
  alert(1);
});
console.log(test);
// test.req.send(
//   "/app/appUser/getAreaBranch",
//   {},
//   function (data) {
//     console.log(data, "res");
//   },
//   ""
// );
document.addEventListener("deviceready", function () {
  test.req.send(
    "getUserInfo",
    {},
    function (data) {
      console.log(data, "res");
    },
    "nativeAction"
  );
  test.req.send(
    "/app/appUser/getAreaBranch",
    {},
    function (data) {
      console.log(data, "res");
    },
    "",
    true
  );
});
