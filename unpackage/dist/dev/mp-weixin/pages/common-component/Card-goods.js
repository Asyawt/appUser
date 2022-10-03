"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "Card-goods",
  props: { card: Array },
  setup(__props) {
    const toDetailOrVideo = (id, url) => {
      if (url == "") {
        wx.navigateTo({
          url: `/pages/product-details/detail?goods_id=${id}`
        });
      } else {
        wx.navigateTo({
          url: `/pages/short-video/video?goods_id=${id}`
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.card, (item, index, i0) => {
          return {
            a: item.goods_cover,
            b: common_vendor.t(item.goods_title),
            c: common_vendor.t(item.goods_price),
            d: common_vendor.t(item.sold),
            e: common_vendor.o(($event) => toDetailOrVideo(item._id, item.video_url), index),
            f: index
          };
        })
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c08ea5f8"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/common-component/Card-goods.vue"]]);
wx.createComponent(Component);
