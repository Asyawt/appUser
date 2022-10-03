<template>
  <view class="eva-content" v-for="(item,index) in eva_data" :key="index">
      <view class="eva-name">
        <view >
          <image :src="item.avatarurl" mode="aspectFill"></image>
        </view>
        <view class="eva-com">
          <text>{{item.nickname}}</text>
          <view class="">
           <text style="padding-right: 10rpx;" v-if="item.specs.length>0" v-for="(i,idx) in item.specs" :key="idx">{{i.att_val}}</text>
          </view>
        </view>
        <view class="eva-time">
          {{item.time}}
        </view>  
      </view>
      <!-- 评价内容 -->
      <view class="eva-text">{{item.eav_text}}</view>
      <view class="eva-image" >
        <view class="" v-if="item.eav_image.length>0" v-for="(i,idx) in item.eav_image" :key="idx">
            <image :src="i.image" mode="aspectFill" @click="previewImg(i.image,index)"></image>
        </view>
      </view>
  </view>
<!-- 没有数据的提示 -->
<view class="Tips" v-if="eva_data.length==0">
  该商品还没有评价
</view>
<!-- 上拉加载 -->
<view class="loading-hei">
  <Loading v-if="loading"></Loading>
</view>
</template>

<script setup>
  import {onLoad,onReachBottom} from '@dcloudio/uni-app'
  import {ref,reactive,toRefs} from 'vue'
  import Loading from '@/pages/loading-component/loading.vue'
  const db=wx.cloud.database()
  const _id=ref('')
  onLoad((e)=>{
    // console.log(e);
    _id.value=e.goods_id
    getEva()
  })
  const data=reactive({eva_data:[]})
  const {eva_data}=toRefs(data)
 async function getEva(sk=0){
    const res=await db.collection('goods_eva').where({goods_id:_id.value}).limit(10).skip(sk).get()
    // console.log(res);
    data.eva_data=[...data.eva_data,...res.data]
  }
  // 上拉加载
  let loading=ref(false)
  let page_n=ref(0)
  onReachBottom(async()=>{
    loading.value=true
    page_n.value++
    let sk=page_n.value*10
    await getEva(sk)
    loading.value=false
  })
  // 预览图片
  import {Public} from '@/Acc-config/public.js'
  const previewImg=(img,index)=>{
    let arr=[]
    data.eva_data[index].eav_image.forEach(item=>{
      arr.push(item.image)
    })
    new Public().previewImg(img,arr)
  }
  
  
</script>

<style scoped>
.itemize view{
	background-color: #fdf4f6;
	padding: 13rpx 0;
	text-align: center;
	font-size: 26rpx;
	width: calc(33.3% - 10rpx*2);
	margin: 10rpx;
	border-radius: 10rpx;
}
.itemize{
	display: flex;
	flex-wrap: wrap;
	margin: 10rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #e3e3e4;
}
/* 用户评价 */
.eva-content{
	margin: 40rpx 20rpx;
}
.eva-name{
	display: flex;
	align-items: center;
	height: 80rpx;
}
.eva-name image{
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
}
.eva-name text{
	display: block;
}
.eva-com{
	flex: 1;
	padding: 0 10rpx;
	height: 70rpx;
}
.eva-com view:nth-child(2){
	font-size: 26rpx;
	color: #8a8b90;
  display: flex;
}
.eva-time{
	align-self: flex-start;
	color: #8a8b90;
	font-size: 26rpx;
}
/* 评论内容 */
.eva-text{
	line-height: 1.3;
	margin: 20rpx 0;
}
.eva-image{
	display: flex;
	flex-wrap: wrap;
}
.eva-image image{
	width: 100%;
	height: 200rpx;
	border-radius: 5rpx;
	display: block;
}
.eva-image view{
	width: calc(33.3% - 5rpx*2);
	margin: 5rpx;
}
</style>