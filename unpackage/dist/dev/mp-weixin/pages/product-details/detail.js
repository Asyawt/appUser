"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_placeOrder = require("../../Acc-config/place-order.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  (Swipers + Eva + Img + Purchase + Login + Specs)();
}
const Swipers = () => "./component/swiper.js";
const Eva = () => "./component/evaluate.js";
const Img = () => "./component/image.js";
const Purchase = () => "./component/purchase.js";
const Login = () => "../components/login-view.js";
const Specs = () => "../components/specs-view.js";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const db = wx.cloud.database();
    const tab_data = common_vendor.reactive({
      tab_name: ["\u5546\u54C1", "\u8BC4\u4EF7", "\u8BE6\u60C5"],
      t_height: 0,
      t_top: 0,
      t_width: 0,
      all_height: 0,
      show: true,
      opacity: 0,
      trigger: 0
    });
    const { tab_name, t_height, t_top, t_width, all_height, show, opacity, trigger } = common_vendor.toRefs(tab_data);
    common_vendor.onMounted(() => {
      const tabdatas = wx.getMenuButtonBoundingClientRect();
      tab_data.t_height = tabdatas.height + 5;
      tab_data.t_top = tabdatas.top;
      tab_data.t_width = tabdatas.width;
      tab_data.all_height = tabdatas.height + tabdatas.top + 5;
    });
    let heightset = common_vendor.reactive({ hei: [] });
    function viewheight() {
      const query = wx.createSelectorQuery();
      query.selectAll("#select").boundingClientRect();
      query.exec((res) => {
        heightset.hei.push(res[0][0].height - tab_data.all_height + 10);
        heightset.hei.push(res[0][1].height + heightset.hei[0]);
      });
    }
    const result = common_vendor.reactive({
      goods_id: "",
      goods: {},
      collection: 0,
      logCollection: 0,
      sku_data: [],
      seckill: [],
      logshopCartNum: 0,
      AllComment: 0,
      comments: []
    });
    const { goods, goods_id, collection, logCollection, sku_data, seckill, shopCartNum, logshopCartNum, AllComment, comments } = common_vendor.toRefs(result);
    common_vendor.onLoad((e) => {
      result.goods_id = e.goods_id;
      const goods2 = db.collection("goodsInfo").doc(e.goods_id).get();
      const collect = db.collection("collect_goods").where({ goods_id: e.goods_id }).get();
      const skuData = db.collection("skuInfo").where({ sku_id: e.goods_id }).field({ sku: true }).get();
      const seckill2 = db.collection("seckill").where({ goods_id: e.goods_id }).field({ ori_price: true, price_spike: true, seckill_time: true }).get();
      const shopCart = db.collection("shop_cart").count();
      const goodsComment = db.collection("goods_eva").where({ goods_id: e.goods_id }).limit(3).get();
      const AllgoodsComment = db.collection("goods_eva").where({ goods_id: e.goods_id }).count();
      const user = wx.getStorageSync("user_info");
      Promise.all([goods2, collect, skuData, seckill2, shopCart, AllgoodsComment, goodsComment]).then((res) => {
        result.goods = res[0].data;
        result.collection = user ? res[1].data.length : 0;
        result.logCollection = res[1].data.length;
        result.sku_data = res[2].data;
        result.seckill = res[3].data;
        AccConfig_placeOrder.goodsInfo.num_shopcart = user ? res[4].total : 0;
        result.logshopCartNum = res[4].total;
        result.AllComment = res[5].total;
        result.comments = res[6].data;
        AccConfig_placeOrder.goodsInfo.order.goods_id = res[0].data._id;
        AccConfig_placeOrder.goodsInfo.order.goods_image = res[0].data.goods_cover;
        AccConfig_placeOrder.goodsInfo.order.goods_title = res[0].data.goods_title;
        AccConfig_placeOrder.goodsInfo.order.specs = [];
        if (result.sku_data.length === 0 && result.seckill.length === 0) {
          AccConfig_placeOrder.goodsInfo.order.goods_price = res[0].data.goods_price;
        }
        common_vendor.nextTick(() => {
          viewheight();
        });
      }).catch((err) => {
        console.log(err);
      });
    });
    let contorl = common_vendor.ref(false);
    common_vendor.onPageScroll((e) => {
      tab_data.opacity = e.scrollTop / 150;
      tab_data.show = e.scrollTop == 0 ? false : true;
      if (contorl.value)
        return;
      if (e.scrollTop >= heightset.hei[tab_data.trigger]) {
        tab_data.trigger++;
      } else if (e.scrollTop < heightset.hei[tab_data.trigger - 1]) {
        tab_data.trigger -= 1;
      }
    });
    const switchTab = (index) => {
      contorl.value = true;
      const i = index == 0 ? ".swipers" : index == 1 ? ".eva" : index == 2 ? ".img" : "";
      const query = wx.createSelectorQuery();
      query.select(i).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function(res) {
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop - tab_data.all_height,
          duration: 200
        });
        setTimeout(() => {
          tab_data.trigger = index;
          contorl.value = false;
        }, 300);
      });
    };
    common_vendor.watch(() => AccConfig_answer.login_user.response, (newval) => {
      result.collection = result.logCollection;
      AccConfig_placeOrder.goodsInfo.num_shopcart = result.logshopCartNum;
    });
    common_vendor.onShareAppMessage(() => {
      return {
        title: result.goods.goods_title,
        path: `/pages/product-details/detail?goods_id=${result.goods_id}`,
        imageUrl: result.goods.goods_cover
      };
    });
    const topage = () => {
      wx.navigateBack({
        delta: 1
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(t_top) + "px",
        b: common_vendor.o(topage),
        c: common_vendor.f(common_vendor.unref(tab_name), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index == common_vendor.unref(trigger) ? 1 : "",
            c: index,
            d: common_vendor.o(($event) => switchTab(index), index)
          };
        }),
        d: common_vendor.unref(t_height) + "px",
        e: common_vendor.unref(t_height) + "px",
        f: common_vendor.unref(t_width) + "px",
        g: common_vendor.unref(opacity),
        h: common_vendor.unref(show),
        i: common_vendor.p({
          id: "select",
          goods: common_vendor.unref(goods),
          seckill: common_vendor.unref(seckill)
        }),
        j: common_vendor.p({
          id: "select",
          AllComment: common_vendor.unref(AllComment),
          comments: common_vendor.unref(comments)
        }),
        k: common_vendor.p({
          id: "select",
          goods_details: common_vendor.unref(goods).goods_details
        }),
        l: common_vendor.p({
          goods_id: common_vendor.unref(goods_id),
          collection: common_vendor.unref(collection),
          sku_data: common_vendor.unref(sku_data),
          Goods: common_vendor.unref(goods)
        }),
        m: common_vendor.p({
          sku_data: common_vendor.unref(sku_data),
          goods: common_vendor.unref(goods)
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/product-details/detail.vue"]]);
_sfc_main.__runtimeHooks = 3;
wx.createPage(MiniProgramPage);
