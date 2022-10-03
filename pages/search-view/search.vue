<template>
  <view class="search-mar">
    <view class="search-input">
      <image src="../../static/sousuo.png" mode="aspectFill"></image>
      <input type="text" v-model="keyword" :focus="true" confirm-type="search" @confirm="Search">
    </view>
    <view class="" @click="Search">
      搜索
    </view>
  </view>
<!--搜索历史 -->
<!-- 这里的切换显示与隐藏搜索历史，不能简单的用请求回来的数据的长度判断，首先当第一次搜索没有缓存的时候，这个不应该展示（history.length>0），当我们点击了搜索时，无论结果有没有数据，这个搜索历史都应该隐藏，因此在请求回来时更改false,当没有数据时再显示没有数据的提示 -->
<block v-if="history.length>0 && show">
  <view class="history">
    <text>历史记录</text>
    <image @click="deleteHis" src="../../static/detail/shanchu.svg" mode="aspectFill"></image>
  </view>
  <view class="history-text">
    <text @click="tohistory(item)" v-for="(item,index) in history" :key="index">{{item}}</text>
  </view>
</block>
  <!-- 商品展示 -->
  <Card :card='card' />
  <!-- 上拉加载的提示 -->
  <view class="loading-hei">
    <Loading v-if="loading"></Loading>
  </view>
  <!-- 没有数据提示 -->
  <view class="Tips" v-if="show==false && card.length==0">
    没有搜索结果
  </view>
</template>

<script setup>
  import {ref,reactive,onMounted,watch} from 'vue'
  import Card from '../common-component/Card-goods.vue'
  import Loading from '@/pages/loading-component/loading.vue'
  import {onReachBottom} from '@dcloudio/uni-app'
  const db=wx.cloud.database()
  const _ = db.command
  const keyword=ref('')
  const show=ref(true)
  let card=ref([])
  let page_n=ref(0)
  // 
  watch(keyword,()=>{
    if(keyword.value==''){
    const res=  wx.getStorageSync('search_key')
    history.value=res
      show.value=true
      card.value=[]
    }
  })
  // 
  // 搜索
  const Search=async()=>{
  if(keyword.value.trim()){
    page_n.value=0
    //本地缓存搜索历史
    let search_value=wx.getStorageSync('search_key') || []
    search_value.unshift(keyword.value)
     wx.setStorageSync('search_key', search_value)
    const res=await searchQuery()
    card.value=res.data
  }
   
  }
  // 数据库的模糊查询

  const searchQuery=async(sk=0)=>{
    //设置模糊字段匹配
    let query=_.or([
      {
          category: db.RegExp({
            regexp: keyword.value,
            options: 'i',
          })
      },
      {
          goods_title: db.RegExp({
            regexp: keyword.value,
            options: 'i',
          })
      }
    ])
    const res=await db.collection('goodsInfo').where(query).limit(10).skip(sk).get()
    
  // card.value=[...card.value,...res.data]
    show.value=false
    return res
  }
  // 上拉加载（这里不能抽离出去，因为只有组件才有onReachBottom
  let loading=ref(false)
  
  onReachBottom(async()=>{
    loading.value=true
    page_n.value++
    let sk=page_n.value*10
    const res=  await searchQuery(sk)
    card.value=[...card.value,...res.data]
    loading.value=false
  })
  // 取出本地缓存的搜索历史
  const history=ref([])
  onMounted(()=>{
    let value=wx.getStorageSync('search_key')
    //去重
    // let res=Array.from(new Set(value))
    let res=[...new Set(value)]
    history.value=res
  
  })
  // 点击搜索历史
  const tohistory=async(item)=>{
    page_n.value=0
    keyword.value=item
   const res=await searchQuery()
    card.value=res.data
  }
  // 清空搜素历史
  const deleteHis=()=>{
    wx.removeStorageSync('search_key')
    history.value=[]
  }
</script>

<style scoped>
.search-mar{
	margin: 0 20rpx;
	display: flex;
	align-items: center;
}
.search-mar view:nth-child(2){
	height: 70rpx;
	line-height: 70rpx;
	padding-left: 30rpx;
}
.search-input{
	display: flex;
	flex-direction: row;
	flex: 1;
	position: relative;
}
.search-input image{
	width: 35rpx;
	height: 35rpx;
	position: absolute;
	left: 20rpx;
	align-self: center;
}
.search-input input{
	background-color: #f4f4f4;
	width: 100%;
	height: 70rpx;
	padding: 0 20rpx 0 75rpx;
	border-radius: 8rpx;
}
/* 历史记录 */
.history image{
	display: block;
	width: 30rpx;
	height: 30rpx;
}
.history{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 40rpx 20rpx;
	font-size: 30rpx;
	font-weight: bold;
}
.history-text{
	display: flex;
	flex-wrap: wrap;
	margin: 0 20rpx;
}
.history-text text{
	background-color: #f4f4f4;
	margin: 0 20rpx 20rpx 0;
	border-radius: 7rpx;
	padding: 10rpx 20rpx;
	font-size: 28rpx;
}

</style>