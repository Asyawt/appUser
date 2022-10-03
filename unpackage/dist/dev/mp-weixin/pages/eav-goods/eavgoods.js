"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_public = require("../../Acc-config/public.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
const _sfc_main = {
  __name: "eavgoods",
  setup(__props) {
    const db = wx.cloud.database();
    const data = common_vendor.reactive({ goods_id: "", goods_index: 0, specs: [], cloudimage: [] });
    common_vendor.onLoad((e) => {
      const res = JSON.parse(e.query);
      data.goods_id = res.goods_id;
      data.goods_index = res.index;
      data.specs = res.specs;
    });
    const cover = common_vendor.reactive({ eav_text: "", sto_image: [] });
    const { eav_text, sto_image } = common_vendor.toRefs(cover);
    const upImage = async () => {
      const local = await new AccConfig_public.Public().upLoadImgorVideo(9);
      local.forEach((item) => {
        cover.sto_image.push({ image: item.tempFilePath });
      });
    };
    const preView = (img) => {
      let arr = [];
      cover.sto_image.forEach((item) => {
        arr.push(item.image);
      });
      new AccConfig_public.Public().previewImg(img, arr);
    };
    const deleteImg = (index) => {
      cover.sto_image.splice(index, 1);
    };
    const subMit = async () => {
      if (cover.eav_text == "") {
        new AccConfig_public.Public().toast("\u8BF7\u8F93\u5165\u8BC4\u4EF7\u5185\u5BB9");
        return;
      }
      wx.showLoading({
        title: "\u63D0\u4EA4\u4E2D",
        mask: true
      });
      if (cover.sto_image.length > 0) {
        let res = await new AccConfig_public.Public().allUpload(cover.sto_image, "image");
        data.cloudimage = res;
      }
      const user = wx.getStorageSync("user_info");
      let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD");
      let obj = {
        avatarurl: user.avatarUrl,
        nickname: user.nickName,
        eav_text: cover.eav_text,
        goods_id: data.goods_id,
        eav_image: data.cloudimage,
        time,
        specs: data.specs
      };
      try {
        await db.collection("goods_eva").add({ data: obj });
        AccConfig_answer.eav_index.value = data.goods_index;
        new AccConfig_public.Public().toast("\u63D0\u4EA4\u6210\u529F");
        wx.navigateBack({ delta: 1 });
      } catch (e) {
        new AccConfig_public.Public().toast("\u63D0\u4EA4\u5931\u8D25");
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(eav_text),
        b: common_vendor.o(($event) => common_vendor.isRef(eav_text) ? eav_text.value = $event.detail.value : null),
        c: common_vendor.unref(sto_image).length > 0
      }, common_vendor.unref(sto_image).length > 0 ? {
        d: common_vendor.f(common_vendor.unref(sto_image), (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => preView(item.image)),
            c: common_vendor.o(($event) => deleteImg(index)),
            d: index
          };
        })
      } : {}, {
        e: common_vendor.o(upImage),
        f: common_vendor.o(subMit)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/eav-goods/eavgoods.vue"]]);
wx.createPage(MiniProgramPage);
