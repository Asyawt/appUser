"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_public = require("../../Acc-config/public.js");
if (!Math) {
  Loading();
}
const Loading = () => "../loading-component/loading.js";
const _sfc_main = {
  __name: "details",
  setup(__props) {
    const db = wx.cloud.database();
    const _id = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      _id.value = e.goods_id;
      getEva();
    });
    const data = common_vendor.reactive({ eva_data: [] });
    const { eva_data } = common_vendor.toRefs(data);
    async function getEva(sk = 0) {
      const res = await db.collection("goods_eva").where({ goods_id: _id.value }).limit(10).skip(sk).get();
      data.eva_data = [...data.eva_data, ...res.data];
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      await getEva(sk);
      loading.value = false;
    });
    const previewImg = (img, index) => {
      let arr = [];
      data.eva_data[index].eav_image.forEach((item) => {
        arr.push(item.image);
      });
      new AccConfig_public.Public().previewImg(img, arr);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(eva_data), (item, index, i0) => {
          return common_vendor.e({
            a: item.avatarurl,
            b: common_vendor.t(item.nickname),
            c: item.specs.length > 0
          }, item.specs.length > 0 ? {
            d: common_vendor.f(item.specs, (i, idx, i1) => {
              return {
                a: common_vendor.t(i.att_val),
                b: idx
              };
            })
          } : {}, {
            e: common_vendor.t(item.time),
            f: common_vendor.t(item.eav_text),
            g: item.eav_image.length > 0
          }, item.eav_image.length > 0 ? {
            h: common_vendor.f(item.eav_image, (i, idx, i1) => {
              return {
                a: i.image,
                b: common_vendor.o(($event) => previewImg(i.image, index)),
                c: idx
              };
            })
          } : {}, {
            i: index
          });
        }),
        b: common_vendor.unref(eva_data).length == 0
      }, common_vendor.unref(eva_data).length == 0 ? {} : {}, {
        c: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7f7e3e8f"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/eva-details/details.vue"]]);
wx.createPage(MiniProgramPage);
