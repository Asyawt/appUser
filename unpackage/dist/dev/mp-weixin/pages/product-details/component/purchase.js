"use strict";
var common_vendor = require("../../../common/vendor.js");
var AccConfig_answer = require("../../../Acc-config/answer.js");
var AccConfig_public = require("../../../Acc-config/public.js");
var AccConfig_placeOrder = require("../../../Acc-config/place-order.js");
const _sfc_main = {
  __name: "purchase",
  props: {
    goods_id: String,
    collection: Number,
    sku_data: Array,
    Goods: Object
  },
  setup(__props) {
    const props = __props;
    const db = wx.cloud.database();
    const result = common_vendor.reactive({ collection: 0, goods_id: "", whether: true, tips: "", goods: {} });
    const { collection, whether, tips } = common_vendor.toRefs(result);
    common_vendor.watch(props, (newval) => {
      let { collection: collection2, goods_id, Goods } = newval;
      result.collection = collection2;
      result.goods_id = goods_id;
      result.goods = Goods;
      if (result.goods.shelves == false) {
        if (result.goods.stock <= 0) {
          result.whether = false;
          result.tips = "\u8BE5\u5546\u54C1\u5DF2\u4E0B\u67B6";
        } else {
          result.whether = false;
          result.tips = "\u8BE5\u5546\u54C1\u5DF2\u4E0B\u67B6";
        }
      } else if (result.goods.stock <= 0) {
        if (!result.goods.shelves) {
          result.whether = false;
          result.tips = "\u8BE5\u5546\u54C1\u5DF2\u4E0B\u67B6";
        } else {
          result.whether = false;
          result.tips = "\u8BE5\u5546\u54C1\u5DF2\u552E\u7A7A";
        }
      }
    });
    const switchcoll = async (i) => {
      const user = wx.getStorageSync("user_info");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return;
      }
      if (i === 0) {
        try {
          await db.collection("collect_goods").add({ data: { goods_id: result.goods_id } });
          result.collection++;
        } catch (e) {
          new AccConfig_public.Public().toast("\u6536\u85CF\u5931\u8D25");
        }
      } else {
        try {
          await db.collection("collect_goods").where({ goods_id: result.goods_id }).remove();
          result.collection = 0;
        } catch (e) {
          new AccConfig_public.Public().toast("\u53D6\u6D88\u6536\u85CF\u5931\u8D25");
        }
      }
    };
    const pushSpecs = async (param, skudata) => {
      const user = wx.getStorageSync("user_info");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return;
      }
      if (skudata.length > 0) {
        AccConfig_answer.sku_popup.show = true;
        AccConfig_answer.sku_popup.judge = param;
      } else {
        AccConfig_placeOrder.goodsInfo.order.buy_amount = 1;
        if (param == "shopcart") {
          try {
            let res = await AccConfig_placeOrder.shopcart();
            new AccConfig_public.Public().toast(res);
          } catch (e) {
            new AccConfig_public.Public().toast(err);
          }
        } else {
          AccConfig_placeOrder.goodsInfo.order.subtotal = parseFloat((AccConfig_placeOrder.goodsInfo.order.goods_price * AccConfig_placeOrder.goodsInfo.order.buy_amount).toFixed(1));
          AccConfig_answer.sku_popup.show = false;
          const str = JSON.stringify([AccConfig_placeOrder.goodsInfo.order]);
          wx.navigateTo({
            url: `/pages/pay-view/pay?type=direct&order=${str}`
          });
        }
      }
    };
    const gocart = () => {
      wx.switchTab({
        url: "/pages/shopping-cart/shopping-cart"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(AccConfig_placeOrder.goodsInfo).num_shopcart > 0
      }, common_vendor.unref(AccConfig_placeOrder.goodsInfo).num_shopcart > 0 ? {
        b: common_vendor.t(common_vendor.unref(AccConfig_placeOrder.goodsInfo).num_shopcart)
      } : {}, {
        c: common_vendor.o(gocart),
        d: common_vendor.unref(collection) == 0
      }, common_vendor.unref(collection) == 0 ? {} : {}, {
        e: common_vendor.t(common_vendor.unref(collection) > 0 ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF"),
        f: common_vendor.o(($event) => switchcoll(common_vendor.unref(collection))),
        g: common_vendor.unref(whether)
      }, common_vendor.unref(whether) ? {
        h: common_vendor.o(($event) => pushSpecs("shopcart", __props.sku_data))
      } : {}, {
        i: common_vendor.unref(whether)
      }, common_vendor.unref(whether) ? {
        j: common_vendor.o(($event) => pushSpecs("imbuy", __props.sku_data))
      } : {
        k: common_vendor.t(common_vendor.unref(tips))
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-61ef2cd2"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/product-details/component/purchase.vue"]]);
wx.createComponent(Component);
