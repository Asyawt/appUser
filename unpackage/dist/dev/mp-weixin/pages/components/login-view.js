"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
var AccConfig_public = require("../../Acc-config/public.js");
const _sfc_main = {
  __name: "login-view",
  setup(__props) {
    const login = async () => {
      try {
        await new AccConfig_public.Public().login();
        AccConfig_answer.login_user.show = false;
        AccConfig_answer.login_user.response = "success";
      } catch (e) {
        new AccConfig_public.Public().toast("\u767B\u5F55\u5931\u8D25");
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(AccConfig_answer.login_user).show
      }, common_vendor.unref(AccConfig_answer.login_user).show ? {
        b: common_vendor.o(login),
        c: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.login_user).show = false)
      } : {});
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/components/login-view.vue"]]);
wx.createComponent(Component);
