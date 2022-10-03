<template>
  <view class="tracking-page">
    <view class="tr-goods">
      <view class="">
        <image :src="goods_image" mode="aspectFill"></image>
      </view>
      <view class="tr-text">
        <text class="overflow">{{goods_title}}</text>
        <text>{{buy_amount}}件</text>
      </view>
    </view>
    <view class="fast-mail">
      <image :src="logo" mode="aspectFill"></image>
      <text class="fast-mail-Zh">{{kuaidi}}</text>
      <text>{{nu}}</text>
    </view>
    <!-- 步骤条 -->
    <view class="tracking-view" v-for="(item,index) in progress" :key="index">
      <!-- 左边 -->
      <view class="tracking-left">
        <view  v-if="index==0 && state=='3'" class="active">签</view>
        <view  v-else></view>
        <view ></view>
      </view>
      <!-- 右边 -->
      <view class="tracking-right">
        <view :class="{'active-text':index==0 && state=='3'}">
          {{item.context}}
        </view>
        <view class="">
          {{item.time}}
        </view>
      </view>
    </view>
    <!-- 没有物流轨迹-->
   <view class="Tips" v-if="message==1">
      暂无物流动态
    </view>
  </view>
</template>

<script setup>
import {URLs,KEY,CUSTOMER,KUAIDI} from '@/Acc-config/kuaidi.js'
import {ref,reactive,toRefs} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import md5 from 'js-md5'
const data_goods=reactive({waybill_No:'',goods_image:'',goods_title:'',buy_amount:0})
const {waybill_No,goods_image,goods_title,buy_amount}=toRefs(data_goods)
onLoad((e)=>{
  let res=JSON.parse(e.value)
  data_goods.waybill_No=res.waybill_No
  data_goods.goods_image=res.goods_image
  data_goods.goods_title=res.goods_title
  data_goods.buy_amount=res.buy_amount
  post()
})
// body要请求的参数
function getParams(){
  // com可以不填，num为快递单号（文档
  let param={com:'',num:data_goods.waybill_No}
  // 加密
  let md=md5(JSON.stringify(param)+KEY+CUSTOMER).toUpperCase()
  let obj={
    customer:CUSTOMER,
    sign:md,
    param:JSON.stringify(param)
  }
  return obj
}
const data=reactive({nu:'',state:0,kuaidi:'',logo:'',progress:[],message:0})
const {nu,state,kuaidi,logo,progress,message}=toRefs(data)
function post(){
  uni.request({
    url:URLs,
    method:'POST',
    header:{'Content-Type':'application/x-www-form-urlencoded'},
    data:getParams()
  }).then(res=>{
    // console.log(res);
    if(res.data.message=='ok'){
      data.nu=res.data.nu
      data.state=res.data.state
      const k_name=KUAIDI.filter(item=>item.com==res.data.com)
      data.kuaidi=k_name[0].name
      data.logo=k_name[0].logo
      data.progress=res.data.data     
    }else{
      data.message=1
    }
  }).catch(err=>{
    console.log(err);
  })
}

  
  
</script>

<style scoped>
.tracking-page{
	margin: 20rpx 20rpx 40rpx 20rpx;
}
.tr-goods{
	display: flex;
	margin-bottom: 40rpx;
	border-bottom: 1rpx solid #f2f2f2;
	padding-bottom: 10rpx;
}
.tr-goods image{
	display: block;
	width: 150rpx;
	height: 150rpx;
}

.tr-goods view:nth-child(2){
	flex: 1;
	padding-left: 20rpx;
}
.tr-text text:nth-child(2){
	font-size: 26rpx;
	color: #f42c37;
	padding-top: 20rpx;
}
.fast-mail image{
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	display: block;
}
.fast-mail{
	display: flex;
	align-items: center;
	padding-bottom: 40rpx;
}
.fast-mail-Zh{
	padding: 0 30rpx 0 20rpx;
}
.tracking-view{
	display: flex;
}
.tracking-left{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 40rpx;
}
.tracking-left view:nth-child(2){
	background-color: #cccccc;
	width: 4rpx;
	height: 100%;
}
.tracking-left view:nth-child(1){
	background-color: #cccccc;
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
}
.tracking-right{
	padding: 0 0 40rpx 20rpx;
	width: 100%;
}
.tracking-right view:nth-child(1){
	line-height: 1.5;
	padding-bottom: 10rpx;
}
.tracking-right view:nth-child(2){
	color: #c0c0c0;
	font-size: 26rpx;
}
.active{
	width: 35rpx !important;
	height: 35rpx !important;
	font-size: 22rpx;
	color: #FFFFFF;
	background-color: #f42c37 !important;
	text-align: center;
	line-height: 35rpx;
}
.active-text{
	color: #f42c37;
}
</style>