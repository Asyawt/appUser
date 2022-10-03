"use strict";
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var common_vendor = require("../../common/vendor.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
var AccConfig_public = require("../../Acc-config/public.js");
if (!Math) {
  AddAddress();
}
const AddAddress = () => "./component/new-address.js";
const _sfc_main = {
  __name: "address",
  setup(__props) {
    const db = wx.cloud.database();
    const addAddress = () => {
      AccConfig_answer.show.value = true;
    };
    common_vendor.onMounted(() => {
      getAddress();
    });
    const addressData = common_vendor.reactive({
      address: []
    });
    const { address } = common_vendor.toRefs(addressData);
    const getAddress = async () => {
      const res = await db.collection("re_address").get();
      addressData.address = res.data;
    };
    const upLoad = () => {
      getAddress();
    };
    const deleteAdd = (id, index) => {
      wx.showModal({ content: "\u786E\u8BA4\u5220\u9664\u5417?" }).then(async (res) => {
        if (res.confirm) {
          try {
            await db.collection("re_address").doc(id).remove();
            addressData.address.splice(index, 1);
          } catch (e) {
            new AccConfig_public.Public().toast("\u5220\u9664\u5931\u8D25");
          }
        }
      });
    };
    const modifys = (item) => {
      AccConfig_answer.modify.id = item._id;
      const _a = item, { _id, _openid } = _a, items = __objRest(_a, ["_id", "_openid"]);
      AccConfig_answer.modify.data = items;
      AccConfig_answer.show.value = true;
    };
    const setup = async (id, index) => {
      let sto = [];
      addressData.address.forEach((item, indexs) => {
        if (item.tacitly) {
          sto.push({ index: indexs, id: item._id });
        }
      });
      try {
        await db.collection("re_address").doc(id).update({ data: { tacitly: true } });
        addressData.address[index].tacitly = true;
        if (sto.length > 0) {
          addressData.address[sto[0].index].tacitly = false;
          await db.collection("re_address").doc(sto[0].id).update({ data: { tacitly: false } });
        }
      } catch (e) {
        new AccConfig_public.Public().toast("\u8BBE\u7F6E\u5931\u8D25");
      }
    };
    const choiceAdd = (item) => {
      AccConfig_answer.newAddress.data = [item];
      wx.navigateBack({
        delta: 1
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(address), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.mobile),
            c: common_vendor.t(item.district + item.address),
            d: item.tacitly
          }, item.tacitly ? {} : {}, {
            e: common_vendor.o(($event) => choiceAdd(item)),
            f: item.tacitly
          }, item.tacitly ? {} : {}, {
            g: common_vendor.t(item.tacitly ? "\u5DF2\u8BBE\u4E3A\u9ED8\u8BA4" : "\u8BBE\u4E3A\u9ED8\u8BA4"),
            h: item.tacitly ? 1 : "",
            i: common_vendor.o(($event) => setup(item._id, index)),
            j: common_vendor.o(($event) => deleteAdd(item._id, index)),
            k: common_vendor.o(($event) => modifys(item)),
            l: index
          });
        }),
        b: common_vendor.unref(address).length == 0
      }, common_vendor.unref(address).length == 0 ? {} : {}, {
        c: common_vendor.o(addAddress),
        d: common_vendor.o(upLoad)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/re-address/address.vue"]]);
wx.createPage(MiniProgramPage);
