<template>
  <!-- 轮播 -->
  <view class="swiper-view" >
   <swiper :duration="1000" :circular="true" 	autoplay @change="changeCurrent" >
     <swiper-item v-for="(item,index) in goods.goods_banner" :key="index">
       <view class="swiper-item">
         <image class="imageurl" :src="item.image" mode="aspectFill"></image>
       </view>
     </swiper-item>
   </swiper>
   <!--自定义指示点 -->
   <view class="point">
     {{curImg}}/{{banner_length}}
   </view>
  </view>
  <!-- 秒杀 -->
  <view class="seckill" v-if="seckillShow">
    <view class="seckill-top seckill-flex">
      <text>秒杀中</text>
      <text class="seckill-Center">已售 {{goods.sold}}</text>
      <text>距离结束还有：</text>
    </view>
    <view class="seckill-flex">
      <text class="price-spike">￥{{seckill[0].price_spike}}</text>
      <text class="seckill-Center ori-price">￥{{seckill[0].ori_price}}</text>
      <view class="se-time">
        <text v-if="day!='00'">{{day}}</text>
        <text v-if="day!='00'">天</text>
        <text>{{hour}}</text>
        <text>:</text>
        <text>{{minute}}</text>
        <text>:</text>
        <text>{{second}}</text>
      </view>
    </view>
  </view>
  <!-- 普通价格 -->
  <view class="price-view" v-else>
    <view class="">
      ￥{{goods.goods_price}}
    </view>
    <view class="">
      已售{{goods.sold}}
    </view>
  </view>
<!-- 标题 -->
<view class="detail-title">
  {{goods.goods_title}}
</view>

</template>

<script setup>
import {ref,computed,watch,toRefs,reactive,onBeforeUnmount} from 'vue'
import {goodsInfo} from '@/Acc-config/place-order.js'
 const props= defineProps({goods:Object,seckill:Array})
 const {goods,seckill}=toRefs(props)
 const seckillShow=ref(false)
 // console.log(props);
 // 轮播图图片的总数量
 const banner_length=ref(0)
 //轮播图当前的图片值
 const curImg=ref(1)
// const banner_length=computed(()=>{
//   return props.goods.goods_banner.length
// })
// 上个页面异步请求的数据，因为默认时是没有下面的访问的某些字段的，有时控制台会报错，但最终有效果展示，再传值给当前页面，用watch或computed
//let listen=
 watch(props,(newval)=>{
   // console.log(33);
  // console.log(props);
  banner_length.value=newval.goods.goods_banner.length
  if(newval.seckill.length==0){
    //没有秒杀
    seckillShow.value=false
    //设置提交的价格
    goodsInfo.order.goods_price=newval.goods.goods_price
    goodsInfo.exist=false
  }else{
    //有秒杀，判断是否开始
    // 判断服务器返回的开始时间是否大于当前的时间，如果大于，秒杀还没有开始
   let start_time=newval.seckill[0].seckill_time.start_time//服务器返回的开始时间
  let end_time=newval.seckill[0].seckill_time.end_time//服务器返回的结束时间

  // 获取当前时间的时间戳，而我们服务器返回的时间是以秒为单位，这里时毫秒需要转化一次,提到了外面
  // const nowdate=Math.round(Date.now()/1000)
  const nowdate=currentTime()
  if(start_time>nowdate){
    // 未开始
    seckillShow.value=false
    goodsInfo.order.goods_price=newval.goods.goods_price
    goodsInfo.exist=false
  }else{
    // 计算倒计时
    countDown(newval.seckill[0],end_time)
  }
}
  // 移除
 // listen() 
})
 //当前时间戳
 function currentTime(){
   return  Math.round(Date.now()/1000)
 }
 // 计算倒计时
 const result=reactive({day:'00',hour:'00',minute:'00',second:'00'})
 const {day,hour,minute,second}=toRefs(result)
 let timer=null
 function countDown(seckill,end_time){
   timer=setInterval(()=>{
     let sur=end_time-currentTime()
     let DD=parseInt(sur/60/60/24,10)
     let HH=parseInt(sur/60/60%24,10)
     let MM=parseInt(sur/60%60,10)
     let SS=parseInt(sur%60,10)
     DD=checkTime(DD)
     HH=checkTime(HH)
     MM=checkTime(MM)
     SS=checkTime(SS)
     if(sur>0){
       seckillShow.value=true
       //提交的价格设置为秒杀价格
       goodsInfo.order.goods_price=seckill.price_spike
       goodsInfo.exist=true
       //
       result.day=DD
       result.hour=HH
       result.minute=MM
       result.second=SS
     }else{
       // 秒杀结束
       seckillShow.value=false
       //提交的价格设置为原价格
       goodsInfo.order.goods_price=seckill.ori_price
       goodsInfo.exist=false
       //清除定时器
       clearInterval(timer)
     }
   },1000)
   //时间后补0
   function checkTime(time){
     return  time<10?'0'+time:time
   }
 }

// 轮播图的事件，滑动轮播图时触发，打印索引
const changeCurrent=(e)=>{
// console.log(e);
  curImg.value=e.detail.current+1
  }
  // 当正在进行秒杀时间内时，返回上一页面不在当前页面，应当销毁定时器，提升性能
  onBeforeUnmount(()=>{
      clearInterval(timer)
  })
</script>

<style scoped>
.imageurl {
	width: 100%;
	height: 700rpx !important;
}

.swiper-view {
	height: 700rpx !important;
	position: relative;
}
swiper{
	height: 700rpx !important;
}
.point{
	position: absolute;
	bottom: 10rpx;
	right: 20rpx;
	background-color: #333333;
	opacity: 0.5;
	color: #FFFFFF;
	font-size: 25rpx;
	width: 100rpx;
	height: 50rpx;
	border-radius: 50rpx;
	line-height: 50rpx;
	text-align: center;
}
/* 价格 */
.price-view{
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	height: 100rpx;
}
.price-view view:nth-child(1){
	color: #e9445a;
	font-size: 40rpx;
	font-weight: bold;
}
.price-view view:nth-child(2){
	color: #b1b2b5;
}
/* 秒杀 */
.seckill{
	background-color: #e74e64;
	padding: 10rpx 20rpx;
	color: #ffffff;
}
.seckill-flex{
	display: flex;
	align-items: center;
}
.seckill-Center{
	flex: 1;
	padding: 0 20rpx;
}
.seckill-top{
	padding-bottom: 10rpx;
	font-size: 25rpx;
}
.seckill-top text:nth-child(1){
	background-color: #f6d3db;
	padding: 5rpx 15rpx;
	color: #ea4163;
	border-radius: 5rpx;
}
.price-spike{
	font-size: 35rpx;
	font-weight: bold;
}
.ori-price{
	text-decoration: line-through;
	color: #f1b0be;
}
.se-time{
	display: flex;
	align-items: center;
}
.se-time text{
	margin-left: 10rpx;
}
.se-time text:nth-child(odd){
	background-color: #eb6578;
	padding: 2rpx 10rpx;
	border-radius: 10rpx;
}
/* 标题 */
.detail-title{
	padding: 20rpx;
	line-height: 1.5;
	background-color: #FFFFFF;
	margin: 20rpx 0;
}
</style>