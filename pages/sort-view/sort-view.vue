<template>
  <view class="sort-view">
    <!-- 左边 -->
    <view class="sort-left">
        <text :class="{'Select-style':index==select}" @click="selectTab(index,item.sort_name)" v-for="(item,index) in sort_list" :key="index">{{item.sort_name}}</text>
    </view>
    <!-- 右边 -->
    <view class="sort-right">
        <view class="Title" v-if="sort_list.length>0">
          {{sort_list[select].sort_name}}
        </view>
        <view @click="jump(item._id)" class="Commodity" v-for="(item,index) in sort_goods" :key="index">
          <view class="Com-image">
            <image :src="item.goods_cover" mode="aspectFill"></image>
          </view>
          <view class="Com-price">
            <text class="overflow">{{item.goods_title}}</text>
            <text>￥{{item.goods_price}}</text>
          </view>
        </view>
        <!-- 上拉加载 -->
        <view class="loading-hei">
          <Loading v-if="loading"></Loading>
        </view>
    </view>
  </view>
</template>

<script setup>
  import {ref,reactive,onMounted,toRefs} from 'vue'
  import {onReachBottom} from '@dcloudio/uni-app'
  import Loading from '@/pages/loading-component/loading.vue'
  const db=wx.cloud.database()
  const _=db.command
  let loading=ref(false)
  let select=ref(0)
  onMounted(()=>{
    getSort()
  })
  const data=reactive({sort_list:[],sort_goods:[]})
  const {sort_list,sort_goods}=toRefs(data)
  let obj={goods_cover:true,goods_price:true,goods_title:true}
 async function getSort(){
   const res_sort=await db.collection('goods_sort').where({quantity:_.gt(0)}).get()  
   const res_goods=await db.collection('goodsInfo').where({category:res_sort.data[0].sort_name}).field(obj).limit(10).get()
   console.log(res_goods);
    data.sort_list=res_sort.data
    data.sort_goods=res_goods.data
  }
  // 切换
  const selectTab=async(index,sort_name)=>{
    page_n.value=0
    select.value=index
   const res_goods=await db.collection('goodsInfo').where({category:sort_name}).field(obj).limit(10).get()
    data.sort_goods=res_goods.data
  }
  //上拉加载
  let page_n=ref(0)
  onReachBottom(async()=>{
    loading.value=true
    page_n.value++
    let sk=page_n.value*10
    const res_goods=await db.collection('goodsInfo').where({category:data.sort_list[select.value].sort_name}).field(obj).limit(10).skip(sk).get()
    data.sort_goods=[...data.sort_goods,...res_goods.data]
    loading.value=false
  })
  // 跳转详情页
  const jump=(_id)=>{
    wx.navigateTo({url:'/pages/product-details/detail?goods_id='+_id})
  }
  
</script>

<style scoped>
.sort-view{
	display: flex;
}
.sort-left{
	width: 200rpx;
	text-align: center;
	background-color: #f6f6f6;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
}

.sort-left text{
	display: block;
	color: #5f5f5f;
	padding: 20rpx 0;
	border-bottom: 1px solid #FFFFFF;
	font-size: 28rpx;
}
/* 左边选中*/
.Select-style{
	background-color: #FFFFFF !important;
}
/* 右边 */
.sort-right{
	margin: 0 20rpx 0 220rpx;
	flex: 1;
}
.Title{
	padding: 20rpx 0;
	font-size: 28rpx;
	font-weight: bold;
}
.Commodity{
	display: flex;
	height: 150rpx;
	margin-bottom: 20rpx;
}
.Com-image{
	width: 150rpx;
	height: 150rpx;
}
.Commodity image{
	width: 150rpx;
	height: 150rpx;
	border-radius: 10rpx;
}
.Com-price{
	flex: 1;
	position: relative;
	padding-left: 20rpx;
	font-weight: bold;
}
.Com-price text:nth-child(2){
	position: absolute;
	bottom: 0;
	color: #f36825;
}
</style>