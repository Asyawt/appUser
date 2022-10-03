"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../common/vendor.js");
let order_data = common_vendor.reactive({
  address: [],
  order_time: "",
  query_time: "",
  pay_success: "not_pay",
  deliver: "stay",
  evaluate: false,
  waybill_No: "",
  payment: {},
  Re_reason: "",
  out_trade_no: "",
  out_refund_no: ""
});
const db = wx.cloud.database();
const _ = db.command;
class Wxpay {
  constructor() {
  }
  async place(price, outTradeNo) {
    try {
      const res = await wx.cloud.callFunction({ name: "wx-pay", data: { price, outTradeNo } });
      return res.payment;
    } catch (e) {
      return { msg: "\u8BF7\u6C42\u7EDF\u4E00\u4E0B\u5355\u4E91\u51FD\u6570\u51FA\u5DEE", err };
    }
  }
  subMit(order, payment, address, time, query_time, out_trade_no) {
    order_data.payment = payment;
    order_data.address = address;
    order_data.order_time = time;
    order_data.query_time = query_time;
    order_data.out_trade_no = out_trade_no;
    var new_order = order.map((item) => {
      return __spreadValues(__spreadValues({}, item), order_data);
    });
    return new Promise((resolve, reject) => {
      new_order.forEach((item, index) => {
        try {
          db.collection("order_data").add({ data: item });
          if (index == new_order.length - 1) {
            resolve("success");
          }
        } catch (err2) {
          reject(err2);
        }
      });
    });
  }
  payMent(payment) {
    return new Promise((resolve, reject) => {
      wx.requestPayment(__spreadProps(__spreadValues({}, payment), {
        success: (res) => {
          resolve(res);
        },
        fail: (err2) => {
          reject(err2);
        }
      }));
    });
  }
  async state(value, out_trade_no) {
    const user = wx.getStorageSync("user_info");
    if (value == "success") {
      await db.collection("order_data").where({ _openid: user.openid, out_trade_no }).update({ data: { pay_success: "success" } });
      return "success";
    } else {
      await db.collection("order_data").where({ _openid: user.openid, out_trade_no }).update({ data: { pay_success: "not_pay" } });
      return "success";
    }
  }
  stock(order) {
    return new Promise((resolve, reject) => {
      order.forEach(async (item, index) => {
        try {
          await db.collection("goodsInfo").doc(item.goods_id).update({ data: { stock: _.inc(-item.buy_amount), sold: _.inc(item.buy_amount) } });
          await db.collection("skuInfo").where({ sku_id: item.goods_id, "sku.att_data": _.eq(item.specs) }).update({ data: { "sku.$.stock": _.inc(-item.buy_amount) } });
          if (index == order.length - 1) {
            resolve("success");
          }
        } catch (err2) {
          reject(err2);
        }
      });
    });
  }
  deleteCart(cartOrder) {
    return new Promise((resolve, reject) => {
      cartOrder.forEach(async (item, index) => {
        try {
          await db.collection("shop_cart").doc(item._id).remove();
          if (index == cartOrder.length - 1) {
            resolve("success");
          }
        } catch (e) {
          reject(err);
        }
      });
    });
  }
}
exports.Wxpay = Wxpay;
