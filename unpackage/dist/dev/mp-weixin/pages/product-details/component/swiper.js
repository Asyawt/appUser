"use strict";
var common_vendor = require("../../../common/vendor.js");
var AccConfig_placeOrder = require("../../../Acc-config/place-order.js");
const _sfc_main = {
  __name: "swiper",
  props: { goods: Object, seckill: Array },
  setup(__props) {
    const props = __props;
    const { goods, seckill } = common_vendor.toRefs(props);
    const seckillShow = common_vendor.ref(false);
    const banner_length = common_vendor.ref(0);
    const curImg = common_vendor.ref(1);
    common_vendor.watch(props, (newval) => {
      banner_length.value = newval.goods.goods_banner.length;
      if (newval.seckill.length == 0) {
        seckillShow.value = false;
        AccConfig_placeOrder.goodsInfo.order.goods_price = newval.goods.goods_price;
        AccConfig_placeOrder.goodsInfo.exist = false;
      } else {
        let start_time = newval.seckill[0].seckill_time.start_time;
        let end_time = newval.seckill[0].seckill_time.end_time;
        const nowdate = currentTime();
        if (start_time > nowdate) {
          seckillShow.value = false;
          AccConfig_placeOrder.goodsInfo.order.goods_price = newval.goods.goods_price;
          AccConfig_placeOrder.goodsInfo.exist = false;
        } else {
          countDown(newval.seckill[0], end_time);
        }
      }
    });
    function currentTime() {
      return Math.round(Date.now() / 1e3);
    }
    const result = common_vendor.reactive({ day: "00", hour: "00", minute: "00", second: "00" });
    const { day, hour, minute, second } = common_vendor.toRefs(result);
    let timer = null;
    function countDown(seckill2, end_time) {
      timer = setInterval(() => {
        let sur = end_time - currentTime();
        let DD = parseInt(sur / 60 / 60 / 24, 10);
        let HH = parseInt(sur / 60 / 60 % 24, 10);
        let MM = parseInt(sur / 60 % 60, 10);
        let SS = parseInt(sur % 60, 10);
        DD = checkTime(DD);
        HH = checkTime(HH);
        MM = checkTime(MM);
        SS = checkTime(SS);
        if (sur > 0) {
          seckillShow.value = true;
          AccConfig_placeOrder.goodsInfo.order.goods_price = seckill2.price_spike;
          AccConfig_placeOrder.goodsInfo.exist = true;
          result.day = DD;
          result.hour = HH;
          result.minute = MM;
          result.second = SS;
        } else {
          seckillShow.value = false;
          AccConfig_placeOrder.goodsInfo.order.goods_price = seckill2.ori_price;
          AccConfig_placeOrder.goodsInfo.exist = false;
          clearInterval(timer);
        }
      }, 1e3);
      function checkTime(time) {
        return time < 10 ? "0" + time : time;
      }
    }
    const changeCurrent = (e) => {
      curImg.value = e.detail.current + 1;
    };
    common_vendor.onBeforeUnmount(() => {
      clearInterval(timer);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(goods).goods_banner, (item, index, i0) => {
          return {
            a: item.image,
            b: index
          };
        }),
        b: common_vendor.o(changeCurrent),
        c: common_vendor.t(curImg.value),
        d: common_vendor.t(banner_length.value),
        e: seckillShow.value
      }, seckillShow.value ? common_vendor.e({
        f: common_vendor.t(common_vendor.unref(goods).sold),
        g: common_vendor.t(common_vendor.unref(seckill)[0].price_spike),
        h: common_vendor.t(common_vendor.unref(seckill)[0].ori_price),
        i: common_vendor.unref(day) != "00"
      }, common_vendor.unref(day) != "00" ? {
        j: common_vendor.t(common_vendor.unref(day))
      } : {}, {
        k: common_vendor.unref(day) != "00"
      }, common_vendor.unref(day) != "00" ? {} : {}, {
        l: common_vendor.t(common_vendor.unref(hour)),
        m: common_vendor.t(common_vendor.unref(minute)),
        n: common_vendor.t(common_vendor.unref(second))
      }) : {
        o: common_vendor.t(common_vendor.unref(goods).goods_price),
        p: common_vendor.t(common_vendor.unref(goods).sold)
      }, {
        q: common_vendor.t(common_vendor.unref(goods).goods_title)
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8901fde4"], ["__file", "C:/Users/Roger/Desktop/uniappProject/lingshi-user/pages/product-details/component/swiper.vue"]]);
wx.createComponent(Component);
