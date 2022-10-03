"use strict";
var common_vendor = require("../../common/vendor.js");
var AccConfig_answer = require("../../Acc-config/answer.js");
var AccConfig_public = require("../../Acc-config/public.js");
if (!Math) {
  (Comment + Login)();
}
const Comment = () => "./component/comment.js";
const Login = () => "../components/login-view.js";
const _sfc_main = {
  __name: "video",
  setup(__props) {
    const db = wx.cloud.database();
    const video_data = common_vendor.reactive({
      v_height: 0,
      v_top: 0,
      winHeight: 0,
      videoPlay: {},
      showbtn: false
    });
    const { v_height, v_top, winHeight, showbtn } = common_vendor.toRefs(video_data);
    common_vendor.onMounted(() => {
      const btn_data = wx.getMenuButtonBoundingClientRect();
      video_data.v_height = btn_data.height;
      video_data.v_top = btn_data.top;
      video_data.winHeight = wx.getSystemInfoSync().screenHeight;
      video_data.videoPlay = wx.createVideoContext("myVideo");
    });
    const playVideo = () => {
      video_data.showbtn = false;
      video_data.videoPlay.play();
    };
    const pauseVideo = () => {
      video_data.showbtn = !video_data.showbtn;
      if (video_data.showbtn) {
        video_data.videoPlay.pause();
      } else {
        video_data.videoPlay.play();
      }
    };
    const result = common_vendor.reactive({ goods_id: "", videoData: {}, total: 0, collection: 0, logCollection: 0 });
    const { videoData, total, collection } = common_vendor.toRefs(result);
    common_vendor.onLoad(async (e) => {
      AccConfig_answer.comment_show.num = 1;
      const user = wx.getStorageSync("user_info");
      result.goods_id = e.goods_id;
      const goodsInfo = await db.collection("goodsInfo").doc(e.goods_id).field({ video_url: true, goods_cover: true, goods_title: true, goods_price: true, seckill: true }).get();
      const count = await db.collection("video_comment").where({ goods_id: e.goods_id }).count();
      const collect = await db.collection("collect_goods").where({ goods_id: e.goods_id }).get();
      Promise.all([goodsInfo, count, collect]).then(async (res) => {
        result.videoData = res[0].data;
        result.total = res[1].total;
        result.collection = user ? res[2].data.length : 0;
        result.logCollection = res[2].data.length;
        if (res[0].data.seckill) {
          const seckill = await db.collection("seckill").where({ goods_id: e.goods_id }).field({ price_spike: true }).get();
          result.videoData.goods_price = seckill.data[0].price_spike;
        }
      }).catch((err) => {
        console.log(err);
      });
    });
    common_vendor.watch(() => AccConfig_answer.login_user.response, (newval) => {
      result.collection = result.logCollection;
    });
    const toCollect = async () => {
      const user = wx.getStorageSync("user_info");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return;
      }
      try {
        await db.collection("collect_goods").add({ data: { goods_id: result.goods_id } });
        result.collection++;
      } catch (e) {
        new AccConfig_public.Public().toast("\u6536\u85CF\u5931\u8D25");
      }
    };
    const cancelCollect = async () => {
      const user = wx.getStorageSync("user_info");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return;
      }
      try {
        await db.collection("collect_goods").where({ goods_id: result.goods_id }).remove();
        result.collection = 0;
      } catch (e) {
        new AccConfig_public.Public().toast("\u53D6\u6D88\u6536\u85CF\u5931\u8D25");
      }
    };
    const comments = () => {
      AccConfig_answer.comment_show.show = true;
      AccConfig_answer.comment_show.num++;
      AccConfig_answer.comment_show.goods_id = result.goods_id;
    };
    common_vendor.onShareAppMessage(() => {
      return {
        title: result.videoData.goods_title,
        path: `/pages/short-video/video?goods_id=${result.goods_id}`,
        imageUrl: result.videoData.goods_cover
      };
    });
    const toback = () => {
      wx.navigateBack({
        delta: 1
      });
    };
    const todetail = () => {
      wx.navigateTo({
        url: "/pages/product-details/detail?goods_id=" + result.goods_id
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(v_top) + "px",
        b: common_vendor.o(toback),
        c: common_vendor.unref(v_height) + "px",
        d: common_vendor.o((...args) => _ctx.plays && _ctx.plays(...args)),
        e: common_vendor.unref(winHeight) + "px",
        f: common_vendor.unref(videoData).video_url,
        g: common_vendor.o(pauseVideo),
        h: common_vendor.o(playVideo),
        i: common_vendor.unref(showbtn),
        j: common_vendor.unref(videoData).goods_cover,
        k: common_vendor.t(common_vendor.unref(videoData).goods_price),
        l: common_vendor.o(todetail),
        m: common_vendor.t(common_vendor.unref(videoData).goods_title),
        n: common_vendor.t(common_vendor.unref(total) == 0 ? "\u8BC4\u8BBA" : common_vendor.unref(total)),
        o: common_vendor.o(comments),
        p: common_vendor.unref(collection) <= 0
      }, common_vendor.unref(collection) <= 0 ? {
        q: common_vendor.o(toCollect)
      } : {
        r: common_vendor.o(cancelCollect)
      }, {
        s: common_vendor.t(common_vendor.unref(collection) <= 0 ? "\u6536\u85CF" : "\u5DF2\u6536\u85CF"),
        t: common_vendor.unref(winHeight) + "px"
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2578cbed"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/short-video/video.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
