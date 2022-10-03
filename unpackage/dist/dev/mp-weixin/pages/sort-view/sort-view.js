"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Math) {
  Loading();
}
const Loading = () => "../loading-component/loading.js";
const _sfc_main = {
  __name: "sort-view",
  setup(__props) {
    const db = wx.cloud.database();
    const _ = db.command;
    let loading = common_vendor.ref(false);
    let select = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      getSort();
    });
    const data = common_vendor.reactive({ sort_list: [], sort_goods: [] });
    const { sort_list, sort_goods } = common_vendor.toRefs(data);
    let obj = { goods_cover: true, goods_price: true, goods_title: true };
    async function getSort() {
      const res_sort = await db.collection("goods_sort").where({ quantity: _.gt(0) }).get();
      const res_goods = await db.collection("goodsInfo").where({ category: res_sort.data[0].sort_name }).field(obj).limit(10).get();
      console.log(res_goods);
      data.sort_list = res_sort.data;
      data.sort_goods = res_goods.data;
    }
    const selectTab = async (index, sort_name) => {
      page_n.value = 0;
      select.value = index;
      const res_goods = await db.collection("goodsInfo").where({ category: sort_name }).field(obj).limit(10).get();
      data.sort_goods = res_goods.data;
    };
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      const res_goods = await db.collection("goodsInfo").where({ category: data.sort_list[select.value].sort_name }).field(obj).limit(10).skip(sk).get();
      data.sort_goods = [...data.sort_goods, ...res_goods.data];
      loading.value = false;
    });
    const jump = (_id) => {
      wx.navigateTo({ url: "/pages/product-details/detail?goods_id=" + _id });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(sort_list), (item, index, i0) => {
          return {
            a: common_vendor.t(item.sort_name),
            b: index == common_vendor.unref(select) ? 1 : "",
            c: common_vendor.o(($event) => selectTab(index, item.sort_name), index),
            d: index
          };
        }),
        b: common_vendor.unref(sort_list).length > 0
      }, common_vendor.unref(sort_list).length > 0 ? {
        c: common_vendor.t(common_vendor.unref(sort_list)[common_vendor.unref(select)].sort_name)
      } : {}, {
        d: common_vendor.f(common_vendor.unref(sort_goods), (item, index, i0) => {
          return {
            a: item.goods_cover,
            b: common_vendor.t(item.goods_title),
            c: common_vendor.t(item.goods_price),
            d: common_vendor.o(($event) => jump(item._id), index),
            e: index
          };
        }),
        e: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9469d9a0"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/sort-view/sort-view.vue"]]);
wx.createPage(MiniProgramPage);
