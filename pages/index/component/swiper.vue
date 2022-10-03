<template>
  <view class="Rotation-view">
    <view class="swiper-top">
      <view class="">
        <swiper class="swiper" :autoplay="true" :circular="true" interval="2000" duration="1000" @change="selSwip">
        <block v-for="(item,index) in banner" :key="index">
          <swiper-item class="swiper-item" @click="toDetailOrVideo(item.goods_id,item.video_url)">
            <image :src="item.banner_cover" mode="aspectFill"></image>
          </swiper-item>
        </block>
        </swiper>
      </view>
      <!-- 自定义的指示点 -->
      <view class="instruct-view">
        <block v-for="(item,index) in banner" :key="index">
          <view class="instruct" :class="{active:index==num}"></view>
        </block>  
      </view>
    </view>
  </view>
</template>

<script setup>
  import {ref} from 'vue'
  defineProps({banner:Array})
  // 轮播的bindchang时间
  const num=ref(0)
  const selSwip=(e)=>{
    num.value=e.detail.current
  }
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
/* 轮播区域 */
.Rotation-view {
	height: 320rpx;
	/* background: linear-gradient(to bottom, #4CD964 25%, #c0f2c8 100%); */
	background: linear-gradient(to bottom, #e94b37 25%, #e59f95 100%);
	padding: 20rpx 20rpx 0 20rpx;
}

.swiper-top {
	height: 300rpx;
	position: relative;
}

.swiper {
	height: 300rpx !important;
	border-radius: 20rpx;
	overflow: hidden;
	transform: translateY(0);
}

.swiper-item image {
	width: 100%;
	height: 300rpx !important;
}

/* 指示点 */
.instruct-view {
	display: flex;
	justify-content: center;
	position: absolute;
	bottom: 10rpx;
	left: 0;
	width: 100%;
}

.instruct {
	background: #4e90a6;
	height: 10rpx;
	width: 30rpx;
	border-radius: 50rpx;
	margin: 0 10rpx;
}

.active {
	background: #FFFFFF !important;
}
</style>