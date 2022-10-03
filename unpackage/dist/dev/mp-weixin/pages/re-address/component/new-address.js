"use strict";
var common_vendor = require("../../../common/vendor.js");
var AccConfig_answer = require("../../../Acc-config/answer.js");
var AccConfig_public = require("../../../Acc-config/public.js");
const _sfc_main = {
  __name: "new-address",
  emits: ["upLoad"],
  setup(__props, { emit: emits }) {
    const db = wx.cloud.database();
    const data = common_vendor.reactive({
      result: {
        name: "",
        mobile: "",
        district: "",
        address: "",
        tacitly: false
      },
      _id: ""
    });
    const { result, _id } = common_vendor.toRefs(data);
    let str = "";
    const regiondata = (e) => {
      str = "";
      e.detail.value.forEach((item) => str += item);
      data.result.district = str;
    };
    const guanbi = () => {
      AccConfig_answer.show.value = false;
      emptys();
    };
    const subMit = (id) => {
      let phone = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      switch (true) {
        case data.result.name == "":
          new AccConfig_public.Public().toast("\u8BF7\u8F93\u5165\u59D3\u540D");
          break;
        case data.result.mobile == "":
          new AccConfig_public.Public().toast("\u8BF7\u8F93\u5165\u624B\u673A\u53F7");
          break;
        case !phone.test(data.result.mobile):
          new AccConfig_public.Public().toast("\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E");
          break;
        case data.result.district == "":
          new AccConfig_public.Public().toast("\u8BF7\u9009\u62E9\u5730\u5740");
          break;
        case data.result.address == "":
          new AccConfig_public.Public().toast("\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740");
          break;
        default:
          subdata(id);
      }
    };
    const subdata = async (id) => {
      try {
        if (id == "") {
          await db.collection("re_address").add({ data: data.result });
        } else {
          await db.collection("re_address").doc(id).update({ data: data.result });
        }
        AccConfig_answer.show.value = false;
        emptys();
        emits("upLoad");
      } catch (e) {
        new AccConfig_public.Public().toast("\u63D0\u4EA4\u5931\u8D25");
      }
    };
    function emptys() {
      data.result.name = "", data.result.mobile = "", data.result.district = "", data.result.address = "", data.result.tacitly = false;
      data._id = "";
    }
    common_vendor.watch(AccConfig_answer.modify, (newval) => {
      Object.assign(data.result, newval.data);
      data._id = newval.id;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(guanbi),
        b: common_vendor.unref(result).name,
        c: common_vendor.o(($event) => common_vendor.unref(result).name = $event.detail.value),
        d: common_vendor.unref(result).mobile,
        e: common_vendor.o(($event) => common_vendor.unref(result).mobile = $event.detail.value),
        f: common_vendor.t(common_vendor.unref(result).district),
        g: common_vendor.o(regiondata),
        h: common_vendor.unref(result).address,
        i: common_vendor.o(($event) => common_vendor.unref(result).address = $event.detail.value),
        j: common_vendor.t(common_vendor.unref(_id) == "" ? "\u4FDD\u5B58" : "\u4FEE\u6539\u5730\u5740"),
        k: common_vendor.o(($event) => subMit(common_vendor.unref(_id))),
        l: common_vendor.unref(AccConfig_answer.show)
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4fbd118e"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/re-address/component/new-address.vue"]]);
wx.createComponent(Component);
