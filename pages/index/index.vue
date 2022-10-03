<template>
  <!-- 搜索框 -->
	<view class="search-back" :style="{height:cus_height+'px'}">
      <view :style="{height:s_top+'px'}" class=""></view>
      <view @click="toSearch" class="search-input" :style="{height:s_height+'px',width:s_left+'px'}">
        <image src="../../static/sousuo.png" mode="widthFix"></image>
        <input type="text" :style="{height:s_height+'px'}" placeholder="请输入搜索的商品" disabled="true">
      </view>
	</view>
  <view class="" :style="{height:cus_height+'px'}"></view>
  <!-- 轮播 -->
  <Swiper style="height: 340rpx;" :banner='banner'></Swiper>
  <!-- 秒杀 -->
  <Flash :seckill='seckill'></Flash>
  <!-- 商品列表 -->
  <Card :card='card'></Card>
  <!-- 加载组件 -->
  <view class="loading-hei" >
     <Loading v-if="loading"></Loading>
  </view>
 
</template>

<script setup>
import {onMounted,reactive,toRefs,ref} from 'vue'
import {onReachBottom} from '@dcloudio/uni-app'
import Swiper from './component/swiper.vue'
import Flash from './component/flash-sale.vue'
import Card from '../common-component/Card-goods.vue'
import Loading from '../loading-component/loading.vue'
const db=wx.cloud.database()
// 获取胶囊按钮的坐标数据
const search_data=reactive({
  s_height:0,
  s_top:0,
  s_left:0,
  cus_height:0
})
const {s_height,s_top,s_left,cus_height}=toRefs(search_data)
onMounted(()=>{
  const but_data=wx.getMenuButtonBoundingClientRect()
  search_data.s_height=but_data.height
  search_data.s_top=but_data.top
  search_data.s_left=but_data.left-30
  search_data.cus_height=but_data.height+but_data.top+5
  goods()
})
// 请求数据
const result=reactive({
  banner:[],
  seckill:[],
  card:[]
  })
  const {banner,seckill,card}=toRefs(result)
  let obj={goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}
  const goods=async()=>{
    //轮播数据
    const banner=await db.collection('banner').where({}).get()
    //秒杀数据
    const seckill=await db.collection('seckill').field({seckill_time:false}).get()
    // 商品数据
    const card=await db.collection('goodsInfo').where({shelves:true}).limit(10).field(obj).orderBy('sold','desc').get()
    //这里我们需要在加载首页时，所有数据都请求回来时一起展示，做一个并发的请求，而不是一个一个请求，这样会导致页面的内容一个一个的出现展示，用Promise.all([]) 
   Promise.all([banner,seckill,card]).then(res=>{
     // console.log(res);
     result.banner=res[0].data
     result.seckill=res[1].data
     result.card=res[2].data
   }).catch(err=>{
     console.log(err);
   })

}
//上拉加载
let loading=ref(false)
let page_n=ref(0)
onReachBottom(async()=>{
  loading.value=true
  page_n.value++
  let sk=page_n.value*10
  const res_goods=await db.collection('goodsInfo').where({shelves:true}).limit(10).skip(sk).field(obj).orderBy('sold','desc').get()
  result.card=[...result.card,...res_goods.data]
  loading.value=false
})
const toSearch=()=>{
  wx.navigateTo({
    url:'/pages/search-view/search'
  })
}
</script>

<style>
page{background-color: #f4f4f4;}
/* 首页自定义搜索框 */
.search-back{
	/* background-color: #4CD964; */
	background-color: #e94b37;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.search-input{
	background: #FFFFFF;
	border-radius: 50upx;
	margin-left: 20rpx;
	display: flex;
	flex-direction: row;
	flex: 1;
	position: relative;
}
.search-input input{
	width: 100%;
	font-size: 30upx;
	color: #b2b2b2;
	padding-left: 80upx;
}
.search-input image{
	width: 35upx;
	height: 35upx;
	position: absolute;
	left: 30upx;
	align-self: center;
}
</style>
