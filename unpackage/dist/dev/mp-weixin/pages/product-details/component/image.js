"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "image",
  props: { goods_details: Array },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.goods_details, (item, index, i0) => {
          return {
            a: item.image,
            b: index
          };
        })
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2b965cb5"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/product-details/component/image.vue"]]);
wx.createComponent(Component);
