"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
var AccConfig_public = require("../../Acc-config/public.js");
var AccConfig_order_number = require("../../Acc-config/order_number.js");
var AccConfig_wxPay = require("../../Acc-config/wx-pay.js");
const _sfc_main = {
  __name: "pay",
  setup(__props) {
    const db = wx.cloud.database();
    const re_data = common_vendor.reactive({ address: [] });
    const { address } = common_vendor.toRefs(re_data);
    common_vendor.onMounted(async () => {
      const res = await db.collection("re_address").where({ tacitly: true }).get();
      re_data.address = res.data;
    });
    const choiceadd = () => {
      wx.navigateTo({
        url: "/pages/re-address/address"
      });
    };
    common_vendor.watch(AccConfig_answer.newAddress, (newval) => {
      re_data.address = newval.data;
    });
    const or_data = common_vendor.reactive({ order: [], type: "", total_price: 0 });
    const { order, type, total_price } = common_vendor.toRefs(or_data);
    common_vendor.onLoad((e) => {
      const data = JSON.parse(e.order);
      or_data.order = data;
      or_data.type = e.type;
    });
    common_vendor.watch(() => or_data.order, (newval) => {
      or_data.total_price = newval.reduce((prep, item) => {
        parseFloat((prep += item.goods_price * item.buy_amount).toFixed(1));
        return prep;
      }, 0);
    }, { deep: true, immediate: true });
    const reduces = (item) => {
      item.buy_amount--;
      item.subtotal = parseFloat((item.buy_amount * item.goods_price).toFixed(1));
    };
    const adds = (item) => {
      item.buy_amount++;
      item.subtotal = parseFloat((item.buy_amount * item.goods_price).toFixed(1));
    };
    const subOrder = async () => {
      wx.showLoading({ title: "\u6B63\u5728\u4E0B\u5355", mask: true });
      let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
      let query_time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD");
      or_data.order.forEach((item) => item.order_number = AccConfig_order_number.codes());
      let out_trade_no = AccConfig_order_number.outTradeNo();
      try {
        var payment = await new AccConfig_wxPay.Wxpay().place(or_data.total_price, out_trade_no);
        const res = await new AccConfig_wxPay.Wxpay().subMit(or_data.order, "payment.result", re_data.address, time, query_time, out_trade_no);
        result.out_trade_no = out_trade_no;
        const pay = await new AccConfig_wxPay.Wxpay().payMent("payment.result");
      } catch (err) {
        if (err && err.errMsg == "requestPayment:fail cancel") {
          if (or_data.type == "cart") {
            await new AccConfig_wxPay.Wxpay().deleteCart(or_data.order);
          }
          wx.hideLoading();
          wx.redirectTo({ url: "/pages/all-orders/order" });
        } else {
          new AccConfig_public.Public().toast("\u652F\u4ED8\u53D1\u751F\u9519\u8BEF");
          await db.collection("order_data").where({ out_trade_no }).remove();
        }
      }
    };
    common_vendor.onBeforeUnmount(() => {
      watcher.close();
    });
    let result = common_vendor.reactive({ out_trade_no: "" });
    const watcher = db.collection("user_info").watch({
      onChange: (res) => {
        if (res.docChanges[0].dataType == "update") {
          new AccConfig_wxPay.Wxpay().state("success", result.out_trade_no);
          new AccConfig_wxPay.Wxpay().stock(or_data.order);
          if (or_data.type == "cart") {
            new AccConfig_wxPay.Wxpay().deleteCart(or_data.order);
          }
          wx.hideLoading();
          wx.redirectTo({
            url: "/pages/all-orders/order"
          });
        }
      },
      onError: function(err) {
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(address), (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.mobile),
            c: common_vendor.t(item.district + item.address),
            d: index,
            e: common_vendor.o(choiceadd, index)
          };
        }),
        b: common_vendor.f(common_vendor.unref(order), (item, index, i0) => {
          return common_vendor.e({
            a: item.goods_image,
            b: common_vendor.t(item.goods_title),
            c: item.specs.length > 0
          }, item.specs.length > 0 ? {
            d: common_vendor.f(item.specs, (i, idx, i1) => {
              return {
                a: common_vendor.t(i.att_val),
                b: idx
              };
            })
          } : {}, {
            e: common_vendor.t(item.goods_price)
          }, common_vendor.unref(type) != "direct" ? {
            f: common_vendor.t(item.buy_amount)
          } : {
            g: common_vendor.o(($event) => reduces(item)),
            h: item.buy_amount == 1 ? 1 : "",
            i: common_vendor.t(item.buy_amount),
            j: common_vendor.o(($event) => adds(item))
          }, {
            k: index
          });
        }),
        c: common_vendor.unref(type) != "direct",
        d: common_vendor.t(common_vendor.unref(total_price)),
        e: common_vendor.o(subOrder)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/pay-view/pay.vue"]]);
wx.createPage(MiniProgramPage);
