"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "evaluate",
  props: { AllComment: Number, comments: Array },
  setup(__props) {
    const jumpto = (comments) => {
      if (comments.length > 0) {
        wx.navigateTo({
          url: "/pages/eva-details/details?goods_id=" + comments[0].goods_id
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.AllComment),
        b: __props.AllComment != 0
      }, __props.AllComment != 0 ? {
        c: common_vendor.f(__props.comments, (item, index, i0) => {
          return {
            a: item.avatarurl,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(item.eav_text),
            d: common_vendor.f(item.eav_image, (i, indexs, i1) => {
              return {
                a: i.image,
                b: indexs
              };
            }),
            e: index
          };
        })
      } : {}, {
        d: common_vendor.o(($event) => jumpto(__props.comments))
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-54f6852f"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/product-details/component/evaluate.vue"]]);
wx.createComponent(Component);
