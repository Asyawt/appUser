"use strict";
var __defProp = Object.defineProperty;
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
var common_vendor = require("../../common/vendor.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
var AccConfig_placeOrder = require("../../Acc-config/place-order.js");
var AccConfig_public = require("../../Acc-config/public.js");
const _sfc_main = {
  __name: "specs-view",
  props: { sku_data: Array, goods: Object },
  setup(__props) {
    const props = __props;
    const skuData = common_vendor.reactive({ goods: {}, new_sku: [], all_sku: [], sku_length: 0, sku_sort: {}, tips: true });
    const { goods, new_sku, tips } = common_vendor.toRefs(skuData);
    common_vendor.watch(props, (newval) => {
      skuData.goods = JSON.parse(JSON.stringify(newval.goods));
      if (newval.sku_data.length == 0)
        return;
      const sku_data = newval.sku_data[0].sku[0];
      skuData.all_sku = newval.sku_data[0].sku;
      skuData.sku_length = newval.sku_data[0].sku[0].att_data.length;
      sku_data.att_data.forEach((item, index) => {
        skuData.sku_sort = __spreadValues(__spreadValues({}, skuData.sku_sort), { [item.att_name]: index });
      });
      const sku_name = sku_data.att_data.map((item) => item.att_name);
      //!重要
      let new_sku2 = [];
      for (let i = 0; i < sku_name.length; i++) {
        const res = newval.sku_data[0].sku.map((item) => {
          if (sku_name.length == 1) {
            return { att_val: item.att_data[i].att_val, stock: item.stock };
          } else {
            return { att_val: item.att_data[i].att_val, act: false };
          }
        });
        let obj = {};
        let newArr = res.reduce((prev, item) => {
          if (!obj[item.att_val]) {
            prev.push(item);
            obj[item.att_val] = 1;
          }
          return prev;
        }, []);
        new_sku2.push({ att_name: sku_name[i], sku: newArr });
      }
      skuData.new_sku = new_sku2;
    });
    const selectdata = common_vendor.reactive({ selects: [], selectCss: [] });
    const { selects, selectCss } = common_vendor.toRefs(selectdata);
    //!重要
    const choice = (att_val, att_name, index, indexs) => {
      const name = selectdata.selects.findIndex((item) => item.att_name == att_name);
      if (name > -1) {
        if (selectdata.selects[name].att_val == att_val) {
          selectdata.selects.splice(name, 1);
          selectdata.selectCss[index] = -1;
        } else {
          selectdata.selects[name] = { att_name, att_val };
          selectdata.selectCss[index] = indexs;
        }
      } else {
        selectdata.selects.push({ att_name, att_val });
        selectdata.selectCss[index] = indexs;
      }
      let raw = common_vendor.toRaw(skuData);
      raw.all_sku.forEach((item) => item["custom"] = "");
      selectdata.selects.forEach((sel_item, sel_index) => {
        raw.all_sku.forEach((ori_item, ori_index) => {
          ori_item.att_data.forEach((i, idx) => {
            if (i.att_name == sel_item.att_name && i.att_val == sel_item.att_val) {
              raw.all_sku[ori_index].custom += i.att_val;
            }
          });
        });
      });
      raw.new_sku.forEach((item) => {
        item.sku.forEach((i) => {
          i["flag"] = true;
        });
      });
      let selstr = "";
      selectdata.selects.forEach((item) => selstr += item.att_val);
      if (selstr == "") {
        var new_res = [];
      } else {
        var new_res = raw.all_sku.filter((item) => item.custom == selstr);
      }
      let newsel = [];
      let a = selectdata.selects.map((i) => JSON.stringify(i));
      for (let i = 0; i < new_res.length; i++) {
        let b = new_res[i].att_data.map((i2) => JSON.stringify(i2));
        let res = b.filter((item) => !new Set(a).has(item));
        newsel.push(...res);
      }
      newsel = [...new Set(newsel)];
      newsel = newsel.map((item) => JSON.parse(item));
      if (newsel.length > 0 || selectdata.selects.length > 0) {
        for (let i = 0; i < newsel.length; i++) {
          raw.new_sku.forEach((item, index2) => {
            if (item.att_name == newsel[i].att_name) {
              item.sku.forEach((idx) => {
                if (idx.att_val != newsel[i].att_val && idx.flag == true) {
                  idx.act = true;
                }
                if (idx.att_val == newsel[i].att_val) {
                  idx.act = false;
                  idx.flag = false;
                }
              });
            }
          });
        }
      } else {
        raw.new_sku.forEach((item, index2) => {
          item.sku.forEach((i, idx) => {
            if (i.act) {
              i.flag = true;
              i.act = false;
            }
          });
        });
      }
      if (selectdata.selects.length == skuData.sku_length) {
        skuData.tips = true;
        selectdata.selects.sort((a2, b) => {
          return skuData.sku_sort[a2.att_name] - skuData.sku_sort[b.att_name];
        });
        let sel_sku = skuData.all_sku.filter((item) => {
          return JSON.stringify(item.att_data) == JSON.stringify(selectdata.selects);
        });
        if (sel_sku.length > 0) {
          skuData.goods.goods_price = sel_sku[0].price;
          skuData.goods.stock = sel_sku[0].stock;
          skuData.goods.goods_cover = sel_sku[0].image;
          if (sel_sku[0].stock == 0) {
            skuData.tips = false;
          }
        } else {
          skuData.tips = false;
        }
      }
    };
    const goods_amount = common_vendor.ref(1);
    const reduces = () => {
      goods_amount.value--;
    };
    const plus = () => {
      goods_amount.value++;
    };
    const subMit = async (e) => {
      if (selectdata.selects.length != skuData.new_sku.length) {
        new AccConfig_public.Public().toast("\u8BF7\u9009\u62E9\u5546\u54C1\u89C4\u683C");
      } else {
        AccConfig_placeOrder.goodsInfo.order.buy_amount = goods_amount.value;
        AccConfig_placeOrder.goodsInfo.order.specs = selectdata.selects;
        AccConfig_placeOrder.goodsInfo.order.goods_image = skuData.goods.goods_cover;
        AccConfig_placeOrder.goodsInfo.order.goods_price = AccConfig_placeOrder.goodsInfo.exist ? AccConfig_placeOrder.goodsInfo.order.goods_price : skuData.goods.goods_price;
        if (e == "shopcart") {
          try {
            let res = await AccConfig_placeOrder.shopcart();
            new AccConfig_public.Public().toast(res);
            AccConfig_answer.sku_popup.show = false;
          } catch (e2) {
            new AccConfig_public.Public().toast(err);
          }
        } else {
          AccConfig_placeOrder.goodsInfo.order.subtotal = (AccConfig_placeOrder.goodsInfo.order.goods_price * AccConfig_placeOrder.goodsInfo.order.buy_amount).toFixed(1);
          AccConfig_answer.sku_popup.show = false;
          const str = JSON.stringify([AccConfig_placeOrder.goodsInfo.order]);
          wx.navigateTo({
            url: "/pages/pay-view/pay?type=direct&order=" + str
          });
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(goods).goods_cover,
        b: common_vendor.t(common_vendor.unref(goods).goods_price),
        c: common_vendor.unref(AccConfig_placeOrder.goodsInfo).exist ? 1 : "",
        d: common_vendor.unref(AccConfig_placeOrder.goodsInfo).exist
      }, common_vendor.unref(AccConfig_placeOrder.goodsInfo).exist ? {
        e: common_vendor.t(common_vendor.unref(AccConfig_placeOrder.goodsInfo).order.goods_price)
      } : {}, {
        f: common_vendor.t(common_vendor.unref(goods).stock),
        g: common_vendor.t(common_vendor.unref(selects).length > 0 ? "\u5DF2\u9009\u62E9" : "\u8BF7\u9009\u62E9"),
        h: common_vendor.unref(selects).length == 0
      }, common_vendor.unref(selects).length == 0 ? {
        i: common_vendor.f(common_vendor.unref(new_sku), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_name),
            b: index
          };
        })
      } : {
        j: common_vendor.f(common_vendor.unref(selects), (item, idx, i0) => {
          return {
            a: common_vendor.t(item.att_val),
            b: idx
          };
        })
      }, {
        k: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.sku_popup).show = false),
        l: common_vendor.unref(new_sku).length == 1
      }, common_vendor.unref(new_sku).length == 1 ? {
        m: common_vendor.f(common_vendor.unref(new_sku), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_name),
            b: common_vendor.f(item.sku, (i, indexs, i1) => {
              return {
                a: common_vendor.t(i.att_val),
                b: indexs,
                c: i.stock == 0 ? 1 : "",
                d: common_vendor.unref(selectCss)[index] == indexs ? 1 : "",
                e: common_vendor.o(($event) => choice(i.att_val, item.att_name, index, indexs), indexs)
              };
            }),
            c: index
          };
        })
      } : {
        n: common_vendor.f(common_vendor.unref(new_sku), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_name),
            b: common_vendor.f(item.sku, (i, indexs, i1) => {
              return {
                a: common_vendor.t(i.att_val),
                b: common_vendor.o(($event) => choice(i.att_val, item.att_name, index, indexs), indexs),
                c: indexs,
                d: i.act ? 1 : "",
                e: common_vendor.unref(selectCss)[index] == indexs ? 1 : ""
              };
            }),
            c: index
          };
        })
      }, {
        o: common_vendor.o(reduces),
        p: goods_amount.value == 1 ? 1 : "",
        q: common_vendor.t(goods_amount.value),
        r: common_vendor.o(plus),
        s: common_vendor.unref(tips)
      }, common_vendor.unref(tips) ? {
        t: common_vendor.t(common_vendor.unref(AccConfig_answer.sku_popup).judge == "shopcart" ? "\u52A0\u5165\u8D2D\u7269\u8F66" : "\u7ACB\u5373\u8D2D\u4E70"),
        v: common_vendor.o(($event) => subMit(common_vendor.unref(AccConfig_answer.sku_popup).judge))
      } : {}, {
        w: common_vendor.unref(AccConfig_answer.sku_popup).show
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5fd4c8ac"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/components/specs-view.vue"]]);
wx.createComponent(Component);
