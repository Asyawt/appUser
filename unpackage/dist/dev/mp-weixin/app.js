"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/sort-view/sort-view.js";
  "./pages/shopping-cart/shopping-cart.js";
  "./pages/my-page/my-page.js";
  "./pages/search-view/search.js";
  "./pages/short-video/video.js";
  "./pages/product-details/detail.js";
  "./pages/pay-view/pay.js";
  "./pages/re-address/address.js";
  "./pages/all-orders/order.js";
  "./pages/eav-goods/eavgoods.js";
  "./pages/order-tracking/track.js";
  "./pages/eva-details/details.js";
  "./pages/my-collection/collection.js";
}
const _sfc_main = {
  onLaunch: function() {
    wx.cloud.init({
      env: "lingshi-user-9gqe4ry205449a04",
      traceUser: true
    });
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
