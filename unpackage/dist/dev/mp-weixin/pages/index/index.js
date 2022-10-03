"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Math) {
  (Swiper + Flash + Card + Loading)();
}
const Swiper = () => "./component/swiper.js";
const Flash = () => "./component/flash-sale.js";
const Card = () => "../common-component/Card-goods.js";
const Loading = () => "../loading-component/loading.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const db = wx.cloud.database();
    const search_data = common_vendor.reactive({
      s_height: 0,
      s_top: 0,
      s_left: 0,
      cus_height: 0
    });
    const { s_height, s_top, s_left, cus_height } = common_vendor.toRefs(search_data);
    common_vendor.onMounted(() => {
      const but_data = wx.getMenuButtonBoundingClientRect();
      search_data.s_height = but_data.height;
      search_data.s_top = but_data.top;
      search_data.s_left = but_data.left - 30;
      search_data.cus_height = but_data.height + but_data.top + 5;
      goods();
    });
    const result = common_vendor.reactive({
      banner: [],
      seckill: [],
      card: []
    });
    const { banner, seckill, card } = common_vendor.toRefs(result);
    let obj = { goods_cover: true, goods_price: true, goods_title: true, sold: true, video_url: true };
    const goods = async () => {
      const banner2 = await db.collection("banner").where({}).get();
      const seckill2 = await db.collection("seckill").field({ seckill_time: false }).get();
      const card2 = await db.collection("goodsInfo").where({ shelves: true }).limit(10).field(obj).orderBy("sold", "desc").get();
      Promise.all([banner2, seckill2, card2]).then((res) => {
        result.banner = res[0].data;
        result.seckill = res[1].data;
        result.card = res[2].data;
      }).catch((err) => {
        console.log(err);
      });
    };
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      const res_goods = await db.collection("goodsInfo").where({ shelves: true }).limit(10).skip(sk).field(obj).orderBy("sold", "desc").get();
      result.card = [...result.card, ...res_goods.data];
      loading.value = false;
    });
    const toSearch = () => {
      wx.navigateTo({
        url: "/pages/search-view/search"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(s_top) + "px",
        b: common_vendor.unref(s_height) + "px",
        c: common_vendor.o(toSearch),
        d: common_vendor.unref(s_height) + "px",
        e: common_vendor.unref(s_left) + "px",
        f: common_vendor.unref(cus_height) + "px",
        g: common_vendor.unref(cus_height) + "px",
        h: common_vendor.p({
          banner: common_vendor.unref(banner)
        }),
        i: common_vendor.p({
          seckill: common_vendor.unref(seckill)
        }),
        j: common_vendor.p({
          card: common_vendor.unref(card)
        }),
        k: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
