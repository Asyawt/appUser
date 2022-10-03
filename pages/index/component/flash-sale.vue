<template>
  <view class="flash-view">
    <view class="count-down">
      每日秒杀
    </view>
    <view class="flex-view">
      <view @click="toDetailOrVideo(item.goods_id,item.video_url)" class="commodity" v-for="(item,index) in seckill" :key="index">
        <image :src="item.cover" mode="aspectFill"></image>
        <view class="">
          <text class="overflow">{{item.title}}</text>
          <text style="color: #e9445a">￥{{item.price_spike}}</text>
          <text>￥{{item.ori_price}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  defineProps({seckill:Array})
  // 跳转详情页or视频页面
  const toDetailOrVideo=(id,url)=>{
    if(url==''){
      //跳转详情页
      // console.log('详情页');
      wx.navigateTo({
        url:`/pages/product-details/detail?goods_id=${id}`
      })
    }else{
      wx.navigateTo({
        url:`/pages/short-video/video?goods_id=${id}`
      })
    }
  }
</script>

<style scoped>
.flash-view{
	background: linear-gradient(to bottom, #ed7d79 25%, #fceeed 70%);
	border-radius: 20rpx;
	padding: 20rpx 0;
	margin: 30rpx 20rpx 0 20rpx;
}
.count-down{
	color: #FFFFFF;
	padding-bottom: 15rpx;
	padding-left: 20rpx;
	font-style: oblique;
	font-weight: bold;
}
/* 宫格布局 */
.flex-view{
	display: flex;
	flex-wrap: wrap;
	margin: 0 20rpx;
}
.commodity{
	width: calc(25% - 10rpx*2);
	margin: 10rpx;
}
.commodity image{
	width: 100%;
	height: 150rpx;
	border-radius: 20rpx;
}
.commodity view{
	width: 90%;
}
.commodity view text:nth-child(1){
	margin: 10rpx 0;
}
.commodity view text:nth-child(2){
	color: #999999;
	font-weight: bold;
}
.commodity view text:nth-child(3){
	text-decoration: line-through;
	font-size: 25rpx;
	color: #bfbfbf;
	padding-left: 10rpx;
}
.overflow{
  display: block;
	-webkit-line-clamp: 1 !important;
}
</style>