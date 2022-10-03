"use strict";
var common_vendor = require("../common/vendor.js");
const goodsInfo = common_vendor.reactive({
  order: {
    goods_id: "",
    goods_image: "",
    goods_title: "",
    goods_price: 0,
    buy_amount: 0,
    specs: [],
    subtotal: 0,
    select: false,
    specsStr: "",
    order_number: ""
  },
  exist: false,
  num_shopcart: 0
});
const db = wx.cloud.database();
const shopcart = () => {
  goodsInfo.order.subtotal = parseFloat((goodsInfo.order.goods_price * goodsInfo.order.buy_amount).toFixed(1));
  let specsStr = "";
  if (goodsInfo.order.specs.length > 0) {
    goodsInfo.order.specs.forEach((i) => specsStr += i.att_val);
  }
  goodsInfo.order.specsStr = specsStr;
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.collection("shop_cart").where({ goods_id: goodsInfo.order.goods_id, specsStr: goodsInfo.order.specsStr }).get();
      if (res.data.length > 0) {
        resolve("\u5DF2\u6DFB\u52A0\u81F3\u8D2D\u7269\u8F66");
      } else {
        await db.collection("shop_cart").add({ data: goodsInfo.order });
        goodsInfo.num_shopcart++;
        resolve("\u52A0\u5165\u8D2D\u7269\u8F66\u6210\u529F");
      }
    } catch (e) {
      reject("\u52A0\u5165\u8D2D\u7269\u8F66\u5931\u8D25");
    }
  });
};
exports.goodsInfo = goodsInfo;
exports.shopcart = shopcart;
