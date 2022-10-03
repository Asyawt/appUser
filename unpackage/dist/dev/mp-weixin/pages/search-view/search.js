"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Math) {
  (Card + Loading)();
}
const Card = () => "../common-component/Card-goods.js";
const Loading = () => "../loading-component/loading.js";
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const db = wx.cloud.database();
    const _ = db.command;
    const keyword = common_vendor.ref("");
    const show = common_vendor.ref(true);
    let card = common_vendor.ref([]);
    let page_n = common_vendor.ref(0);
    common_vendor.watch(keyword, () => {
      if (keyword.value == "") {
        const res = wx.getStorageSync("search_key");
        history.value = res;
        show.value = true;
        card.value = [];
      }
    });
    const Search = async () => {
      if (keyword.value.trim()) {
        page_n.value = 0;
        let search_value = wx.getStorageSync("search_key") || [];
        search_value.unshift(keyword.value);
        wx.setStorageSync("search_key", search_value);
        const res = await searchQuery();
        card.value = res.data;
      }
    };
    const searchQuery = async (sk = 0) => {
      let query = _.or([
        {
          category: db.RegExp({
            regexp: keyword.value,
            options: "i"
          })
        },
        {
          goods_title: db.RegExp({
            regexp: keyword.value,
            options: "i"
          })
        }
      ]);
      const res = await db.collection("goodsInfo").where(query).limit(10).skip(sk).get();
      show.value = false;
      return res;
    };
    let loading = common_vendor.ref(false);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      const res = await searchQuery(sk);
      card.value = [...card.value, ...res.data];
      loading.value = false;
    });
    const history = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      let value = wx.getStorageSync("search_key");
      let res = [...new Set(value)];
      history.value = res;
    });
    const tohistory = async (item) => {
      page_n.value = 0;
      keyword.value = item;
      const res = await searchQuery();
      card.value = res.data;
    };
    const deleteHis = () => {
      wx.removeStorageSync("search_key");
      history.value = [];
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(Search),
        b: keyword.value,
        c: common_vendor.o(($event) => keyword.value = $event.detail.value),
        d: common_vendor.o(Search),
        e: history.value.length > 0 && show.value
      }, history.value.length > 0 && show.value ? {
        f: common_vendor.o(deleteHis),
        g: common_vendor.f(history.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => tohistory(item), index),
            c: index
          };
        })
      } : {}, {
        h: common_vendor.p({
          card: common_vendor.unref(card)
        }),
        i: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        j: show.value == false && common_vendor.unref(card).length == 0
      }, show.value == false && common_vendor.unref(card).length == 0 ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f965d66"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/search-view/search.vue"]]);
wx.createPage(MiniProgramPage);
