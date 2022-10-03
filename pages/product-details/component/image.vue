<template>
  <view class="details-img" >
    <block v-for="(item,index) in goods_details " :key="index">
   <image :src="item.image" mode="widthFix"></image>
   </block>
  </view>
  <view class="" style="height: 180rpx;"> </view>
</template>

<script setup>
  defineProps({goods_details:Array})
</script>

<style scoped>
.details-img{
	background-color: #FFFFFF;
	margin: 20rpx 0;
}
.details-img image{
	width: 100%;
	display: block;
}
</style>