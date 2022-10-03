"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "swiper",
  props: { banner: Array },
  setup(__props) {
    const num = common_vendor.ref(0);
    const selSwip = (e) => {
      num.value = e.detail.current;
    };
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
        a: common_vendor.f(__props.banner, (item, index, i0) => {
          return {
            a: item.banner_cover,
            b: common_vendor.o(($event) => toDetailOrVideo(item.goods_id, item.video_url)),
            c: index
          };
        }),
        b: common_vendor.o(selSwip),
        c: common_vendor.f(__props.banner, (item, index, i0) => {
          return {
            a: index == num.value ? 1 : "",
            b: index
          };
        })
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6578bcc0"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/index/component/swiper.vue"]]);
wx.createComponent(Component);
