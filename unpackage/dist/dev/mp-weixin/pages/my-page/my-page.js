"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  Login();
}
const Login = () => "../components/login-view.js";
const _sfc_main = {
  __name: "my-page",
  setup(__props) {
    const list_data = common_vendor.reactive({
      whole: [
        {
          index: 0,
          name: "\u67E5\u770B\u5168\u90E8\u8BA2\u5355",
          icon: "/static/detail/xiangyou-jiantou.svg",
          query: {}
        }
      ],
      list: [
        {
          index: 1,
          name: "\u5F85\u4ED8\u6B3E",
          icon: "/static/detail/daifukuan.svg",
          query: { pay_success: "not_pay" }
        },
        {
          index: 2,
          name: "\u5F85\u53D1\u8D27",
          icon: "/static/detail/daifahuo.svg",
          query: { pay_success: "success", deliver: "stay" }
        },
        {
          index: 3,
          name: "\u5F85\u6536\u83B7",
          icon: "/static/detail/daishouhuo.svg",
          query: { pay_success: "success", deliver: "already" }
        },
        {
          index: 4,
          name: "\u5F85\u8BC4\u4EF7",
          icon: "/static/detail/daipingjia.svg",
          query: { pay_success: "success", deliver: "rece_goods", evaluate: false }
        }
      ]
    });
    common_vendor.onShow(() => {
      loginStatus();
    });
    const user = common_vendor.reactive({ userInfo: {}, exist: false });
    const { userInfo, exist } = common_vendor.toRefs(user);
    function loginStatus() {
      const users = wx.getStorageSync("user_info");
      if (users) {
        user.exist = true;
        user.userInfo = users;
      } else {
        user.exist = false;
      }
    }
    const goLogin = () => {
      AccConfig_answer.login_user.show = true;
    };
    common_vendor.watch(() => AccConfig_answer.login_user.response, (newval) => {
      loginStatus();
    });
    const vieworder = (index, query) => {
      if (user.exist) {
        let obj = JSON.stringify({ index, query });
        wx.navigateTo({ url: "/pages/all-orders/order?obj=" + obj });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    };
    const getaddress = () => {
      if (user.exist) {
        wx.navigateTo({ url: "/pages/re-address/address" });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    };
    const mycollect = () => {
      if (user.exist) {
        wx.navigateTo({ url: "/pages/my-collection/collection" });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(exist)
      }, common_vendor.unref(exist) ? {
        b: common_vendor.unref(userInfo).avatarUrl,
        c: common_vendor.t(common_vendor.unref(userInfo).nickName)
      } : {
        d: common_vendor.o(goLogin)
      }, {
        e: common_vendor.f(list_data.whole, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.icon,
            c: common_vendor.o(($event) => vieworder(item.index, item.query), index),
            d: index
          };
        }),
        f: common_vendor.f(list_data.list, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => vieworder(item.index, item.query), index),
            d: index
          };
        }),
        g: common_vendor.o(mycollect),
        h: common_vendor.o(getaddress)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b1deadb0"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/my-page/my-page.vue"]]);
wx.createPage(MiniProgramPage);
