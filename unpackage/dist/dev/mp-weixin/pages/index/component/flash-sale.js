"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "flash-sale",
  props: { seckill: Array },
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
        a: common_vendor.f(__props.seckill, (item, index, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.price_spike),
            d: common_vendor.t(item.ori_price),
            e: common_vendor.o(($event) => toDetailOrVideo(item.goods_id, item.video_url), index),
            f: index
          };
        })
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-baec19a8"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/index/component/flash-sale.vue"]]);
wx.createComponent(Component);
