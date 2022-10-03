"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "shopping-cart",
  setup(__props) {
    const db = wx.cloud.database();
    common_vendor.onShow(() => {
      getCart();
    });
    const data = common_vendor.reactive({ cart_data: [] });
    const { cart_data } = common_vendor.toRefs(data);
    async function getCart() {
      const res = await db.collection("shop_cart").get();
      data.cart_data = res.data;
    }
    let manage = common_vendor.ref("\u7BA1\u7406");
    const manages = () => {
      manage.value == "\u7BA1\u7406" ? manage.value = "\u5B8C\u6210" : manage.value = "\u7BA1\u7406";
    };
    const reduces = (index, _id) => {
      data.cart_data[index].buy_amount--;
      data.cart_data[index].subtotal = parseFloat((data.cart_data[index].goods_price * data.cart_data[index].buy_amount).toFixed(1));
      db.collection("shop_cart").doc(_id).update({ data: { buy_amount: data.cart_data[index].buy_amount, subtotal: data.cart_data[index].subtotal } });
    };
    const plus = (index, _id) => {
      data.cart_data[index].buy_amount++;
      data.cart_data[index].subtotal = parseFloat((data.cart_data[index].goods_price * data.cart_data[index].buy_amount).toFixed(1));
      db.collection("shop_cart").doc(_id).update({ data: { buy_amount: data.cart_data[index].buy_amount, subtotal: data.cart_data[index].subtotal } });
    };
    function selects(index, select) {
      data.cart_data[index].select = !data.cart_data[index].select;
    }
    const totalPrice = common_vendor.computed$1(() => {
      return data.cart_data.filter((item) => item.select).reduce((prep, item) => {
        parseFloat(prep += item.goods_price * item.buy_amount).toFixed(10);
        return prep;
      }, 0);
    });
    const selectall = common_vendor.computed$1(() => {
      return data.cart_data.every((item) => item.select);
    });
    const cancelSelect = () => {
      data.cart_data.forEach((item) => item.select = false);
    };
    const selectalls = () => {
      data.cart_data.forEach((item) => item.select = true);
    };
    const getInfo = (manage2) => {
      if (manage2 == "\u7BA1\u7406") {
        const res = data.cart_data.filter((item) => item.select);
        const str = JSON.stringify(res);
        wx.navigateTo({
          url: `/pages/pay-view/pay?type=cart&order=${str}`
        });
      } else {
        data.cart_data.forEach(async (item, index) => {
          if (item.select) {
            await db.collection("shop_cart").doc(item._id).remove();
            data.cart_data.splice(data.cart_data.findIndex((i) => i._id == item._id), 1);
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(manage)),
        b: common_vendor.o(manages),
        c: common_vendor.f(common_vendor.unref(cart_data), (item, index, i0) => {
          return common_vendor.e({
            a: item.select
          }, item.select ? {
            b: common_vendor.o(($event) => selects(index, item.select))
          } : {
            c: common_vendor.o(($event) => selects(index, item.select))
          }, {
            d: item.goods_image,
            e: common_vendor.t(item.goods_title),
            f: item.specs.length > 0
          }, item.specs.length > 0 ? {
            g: common_vendor.f(item.specs, (i, idx, i1) => {
              return {
                a: common_vendor.t(i.att_val),
                b: idx
              };
            })
          } : {}, {
            h: common_vendor.t(item.goods_price),
            i: common_vendor.o(($event) => reduces(index, item._id)),
            j: item.buy_amount == 1 ? 1 : "",
            k: common_vendor.t(item.buy_amount),
            l: common_vendor.o(($event) => plus(index, item._id)),
            m: index
          });
        }),
        d: common_vendor.unref(cart_data).length == 0
      }, common_vendor.unref(cart_data).length == 0 ? {} : {}, {
        e: common_vendor.unref(selectall)
      }, common_vendor.unref(selectall) ? {
        f: common_vendor.o(cancelSelect),
        g: common_vendor.o(cancelSelect)
      } : {
        h: common_vendor.o(selectalls),
        i: common_vendor.o(selectalls)
      }, {
        j: common_vendor.t(common_vendor.unref(totalPrice)),
        k: common_vendor.t(common_vendor.unref(manage) == "\u7BA1\u7406" ? "\u7ED3\u7B97" : "\u5220\u9664"),
        l: common_vendor.o(($event) => getInfo(common_vendor.unref(manage))),
        m: common_vendor.unref(totalPrice) <= 0 ? 1 : ""
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/shopping-cart/shopping-cart.vue"]]);
wx.createPage(MiniProgramPage);
