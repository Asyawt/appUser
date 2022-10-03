"use strict";
var common_vendor = require("../../../common/vendor.js");
var AccConfig_answer = require("../../../Acc-config/answer.js");
var AccConfig_public = require("../../../Acc-config/public.js");
if (!Math) {
  Loading();
}
const Loading = () => "../../loading-component/loading.js";
const _sfc_main = {
  __name: "comment",
  setup(__props) {
    const db = wx.cloud.database();
    const showtips = common_vendor.ref(true);
    common_vendor.watch(AccConfig_answer.comment_show, (newval) => {
      if (newval.show && newval.num == 2) {
        relation.goods_id = newval.goods_id;
        getComments(newval.goods_id);
      }
    });
    const getComments = async (goods_id, sk = 0) => {
      const res = await db.collection("video_comment").where({ goods_id }).limit(10).skip(sk).get();
      if (sk == 0) {
        com_data.commentData = res.data;
      } else {
        com_data.commentData = [...com_data.commentData, ...res.data];
      }
      showtips.value = false;
    };
    const com_data = common_vendor.reactive({ content: "", commentData: [] });
    const { content, commentData } = common_vendor.toRefs(com_data);
    const relation = common_vendor.reactive({ goods_id: "" });
    const send = async () => {
      if (!com_data.content.trim())
        return;
      const user = wx.getStorageSync("user_info");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return;
      }
      let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD");
      const obj = {
        avatarurl: user.avatarUrl,
        nickname: user.nickName,
        time,
        content: com_data.content,
        goods_id: relation.goods_id
      };
      try {
        await db.collection("video_comment").add({ data: obj });
        com_data.content = "";
        com_data.commentData.unshift(obj);
        new AccConfig_public.Public().toast("\u8BC4\u8BBA\u6210\u529F");
      } catch (e) {
        new AccConfig_public.Public().toast("\u8BC4\u8BBA\u5931\u8D25");
      }
    };
    const loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    const tolower = async (e) => {
      if (com_data.commentData.length < 10)
        return false;
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      await getComments(relation.goods_id, sk);
      loading.value = false;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.comment_show).show = false),
        b: common_vendor.f(common_vendor.unref(commentData), (item, index, i0) => {
          return {
            a: item.avatarurl,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(item.time),
            d: common_vendor.t(item.content),
            e: index
          };
        }),
        c: common_vendor.unref(commentData).length == 0
      }, common_vendor.unref(commentData).length == 0 ? common_vendor.e({
        d: showtips.value
      }, showtips.value ? {} : {}) : {}, {
        e: loading.value,
        f: common_vendor.o(tolower),
        g: common_vendor.unref(content),
        h: common_vendor.o(($event) => common_vendor.isRef(content) ? content.value = $event.detail.value : null),
        i: common_vendor.o(send),
        j: common_vendor.unref(AccConfig_answer.comment_show).show
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-99df7a82"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/short-video/component/comment.vue"]]);
wx.createComponent(Component);
