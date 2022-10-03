<template>
  <!-- 公用的商品列表组件 -->
  <view class="card-view">
    <view  @click="toDetailOrVideo(item._id,item.video_url)" class="Card-stream" v-for="(item,index) in card" :key="index">
      <view class="Card-image">
        <image :src="item.goods_cover" mode="aspectFill"></image>
      </view>
      <view class="Card-title overflow">
        {{item.goods_title}}
      </view>
      <view class="Card-price">
        <text>￥{{item.goods_price}}</text>
        <text>已售{{item.sold}}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  defineProps({card:Array})
    // 跳转详情页or视频页面
  const toDetailOrVideo=(id,url)=>{
    if(url==''){
      //跳转详情页
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
.card-view{
	display: flex;
	flex-wrap: wrap;
	margin: 20rpx 10rpx;
}
.Card-stream{
	width: calc(50% - 10rpx*2);
	margin: 10rpx;
	background: #FFFFFF;
	border-radius: 10rpx;
}
.Card-image{
	height: 400rpx;
}
.Card-stream image{
	width: 100%; 
	height: 400rpx;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
}
.Card-title{
	font-size: 28rpx;
	height: 80rpx;
	line-height: 40rpx;
	margin: 10rpx 15rpx;
}
.Card-price{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15rpx 15rpx 15rpx;
}
.Card-price text:nth-child(1){
	color: #e9445a;
	font-weight: bold;
}
.Card-price text:nth-child(2){
	color: #b0b1b4;
	font-size: 25rpx;
}
</style>