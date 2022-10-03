"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_public = require("../../Acc-config/public.js");
var AccConfig_order_number = require("../../Acc-config/order_number.js");
var AccConfig_wxPay = require("../../Acc-config/wx-pay.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  Loading();
}
const Loading = () => "../loading-component/loading.js";
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const db = wx.cloud.database();
    const re = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const data = common_vendor.reactive({
      tab: [
        {
          name: "\u5168\u90E8",
          query: {}
        },
        {
          name: "\u5F85\u652F\u4ED8",
          query: { pay_success: "not_pay" }
        },
        {
          name: "\u5F85\u53D1\u8D27",
          query: { pay_success: "success", deliver: "stay" }
        },
        {
          name: "\u5F85\u6536\u8D27",
          query: { pay_success: "success", deliver: "already" }
        },
        {
          name: "\u5F85\u8BC4\u4EF7",
          query: { pay_success: "success", deliver: "rece_goods", evaluate: false }
        }
      ]
    });
    const { tab } = common_vendor.toRefs(data);
    common_vendor.onLoad((e) => {
      let val = JSON.parse(e.obj);
      if (val != {}) {
        switchTab(val.index, val.query);
      } else {
        getOrder(0, {});
      }
    });
    const switchTab = (index, query) => {
      page_n.value = 0;
      res_order.order_data = [];
      re.value = index;
      getOrder(0, query);
    };
    const res_order = common_vendor.reactive({ order_data: [] });
    const { order_data } = common_vendor.toRefs(res_order);
    async function getOrder(sk, query) {
      const user = wx.getStorageSync("user_info");
      query["_openid"] = user.openid;
      const res = await db.collection("order_data").where(query).limit(10).skip(sk).orderBy("order_time", "desc").get();
      res_order.order_data = [...res_order.order_data, ...res.data];
    }
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      await getOrder(sk, data.tab[re.value].query);
      loading.value = false;
    });
    const conPay = async (index, _id, subtotal, item) => {
      try {
        let out_trade_no = AccConfig_order_number.outTradeNo();
        var payment = await new AccConfig_wxPay.Wxpay().place(subtotal, out_trade_no);
        result._id = _id;
        result.payment = "payment.result";
        result.order_item = item;
        result.index = index;
        result.out_trade_no = out_trade_no;
        await new AccConfig_wxPay.Wxpay().payMent("payment.result");
      } catch (err) {
        if (err && err.errMsg == "requestPayment:fail cancel") {
          new AccConfig_public.Public().toast("\u53D6\u6D88\u652F\u4ED8");
        } else {
          new AccConfig_public.Public().toast("\u652F\u4ED8\u53D1\u751F\u9519\u8BEF");
        }
      }
    };
    common_vendor.onBeforeUnmount(() => {
      watcher.close();
    });
    let result = common_vendor.reactive({ _id: "", payment: {}, order_item: [], index: -1, out_trade_no: "" });
    const watcher = db.collection("user_info").watch({
      onChange: (res) => {
        const user = wx.getStorageSync("user_info");
        if (res.docChanges[0].dataType == "update") {
          db.collection("order_data").where({ _openid: user.openid, _id: result._id }).update({ data: { pay_success: "success", payment: result.payment, out_trade_no: result.out_trade_no } });
          new AccConfig_wxPay.Wxpay().stock([result.order_item]);
          if (re.value == 0) {
            res_order.order_data[result.index].pay_success = "success";
          } else {
            res_order.order_data.splice(result.index, 1);
          }
        }
      },
      onError: function(err) {
      }
    });
    const canOrder = async (_id, index) => {
      const user = wx.getStorageSync("user_info");
      await db.collection("order_data").where({ _openid: user.openid, _id }).update({ data: { pay_success: "can_order" } });
      if (re.value == 0) {
        res_order.order_data[index].pay_success = "can_order";
      } else {
        res_order.order_data.splice(index, 1);
      }
    };
    const itemList = ["\u4E03\u5929\u65E0\u7406\u7531\u9000\u6B3E", "\u5546\u54C1\u4FE1\u606F\u63CF\u8FF0\u4E0D\u7B26", "\u8D28\u91CF\u95EE\u9898", "\u5305\u88C5/\u5546\u54C1\u7834\u635F/\u6C61\u6E0D"];
    const refund = (index, _id) => {
      wx.showActionSheet({
        alertText: "\u9000\u6B3E\u539F\u56E0",
        itemList,
        success: async (res) => {
          const user = wx.getStorageSync("user_info");
          await db.collection("order_data").where({ _openid: user.openid, _id }).update({ data: { deliver: "ref_pro", Re_reason: itemList[res.tapIndex] } });
          if (re.value == 0) {
            res_order.order_data[index].deliver = "ref_pro";
          } else {
            res_order.order_data.splice(index, 1);
          }
        },
        fail(res) {
          console.log(res.errMsg);
        }
      });
    };
    const confRece = async (index, _id) => {
      const user = wx.getStorageSync("user_info");
      await db.collection("order_data").where({ _openid: user.openid, _id }).update({ data: { deliver: "rece_goods" } });
      if (re.value == 0) {
        res_order.order_data[index].deliver = "rece_goods";
      } else {
        res_order.order_data.splice(index, 1);
      }
    };
    let eav_id = common_vendor.ref("");
    const eavLuate = (_id, goods_id, index, evaluate, specs) => {
      if (evaluate)
        return;
      eav_id.value = _id;
      let query = JSON.stringify({ goods_id, index, specs });
      wx.navigateTo({
        url: "/pages/eav-goods/eavgoods?query=" + query
      });
    };
    common_vendor.watch(AccConfig_answer.eav_index, (newval) => {
      if (re.value == 0) {
        res_order.order_data[newval].evaluate = true;
      } else {
        res_order.order_data.splice(newval, 1);
      }
      const user = wx.getStorageSync("user_info");
      db.collection("order_data").where({ _openid: user.openid, _id: eav_id.value }).update({ data: { evaluate: true } });
    });
    const logistics = (waybill_No, goods_image, goods_title, buy_amount) => {
      let obj = JSON.stringify({ waybill_No, goods_image, goods_title, buy_amount });
      wx.navigateTo({
        url: "/pages/order-tracking/track?value=" + obj
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(tab), (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index == re.value ? 1 : "",
            c: index,
            d: common_vendor.o(($event) => switchTab(index, item.query), index)
          };
        }),
        b: common_vendor.f(common_vendor.unref(order_data), (item, index, i0) => {
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
            e: common_vendor.t(item.goods_price),
            f: common_vendor.t(item.buy_amount),
            g: common_vendor.t(item.subtotal),
            h: item.pay_success == "success"
          }, item.pay_success == "success" ? common_vendor.e({
            i: item.deliver == "stay"
          }, item.deliver == "stay" ? {
            j: common_vendor.o(($event) => refund(index, item._id))
          } : {}, {
            k: item.deliver == "already"
          }, item.deliver == "already" ? {
            l: common_vendor.o(($event) => confRece(index, item._id)),
            m: common_vendor.o(($event) => logistics(item.waybill_No, item.goods_image, item.goods_title, item.buy_amount)),
            n: common_vendor.o(($event) => refund(index, item._id))
          } : {}, {
            o: item.deliver == "rece_goods"
          }, item.deliver == "rece_goods" ? {
            p: common_vendor.t(item.evaluate ? "\u5DF2\u8BC4\u4EF7" : "\u8BC4\u4EF7"),
            q: common_vendor.n(item.evaluate ? "order-button-a" : "order-button-b"),
            r: common_vendor.o(($event) => eavLuate(item._id, item.goods_id, index, item.evaluate, item.specs)),
            s: common_vendor.o(($event) => refund(index, item._id))
          } : {}, {
            t: item.deliver == "ref_pro"
          }, item.deliver == "ref_pro" ? {} : {}, {
            v: item.deliver == "ref_succ"
          }, item.deliver == "ref_succ" ? {} : {}) : item.pay_success == "not_pay" ? {
            x: common_vendor.o(($event) => canOrder(item._id, index)),
            y: common_vendor.o(($event) => conPay(index, item._id, item.subtotal, item))
          } : item.pay_success == "can_order" ? {} : {}, {
            w: item.pay_success == "not_pay",
            z: item.pay_success == "can_order",
            A: index
          });
        }),
        c: common_vendor.unref(order_data).length == 0
      }, common_vendor.unref(order_data).length == 0 ? {} : {}, {
        d: loading.value
      }, loading.value ? {} : {});
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/all-orders/order.vue"]]);
wx.createPage(MiniProgramPage);
