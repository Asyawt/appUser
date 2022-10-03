<template>
  <Card :card='card'></Card>
  <!-- 上拉加载 -->
  <view class="loading-hei">
    <Loading v-if="loading"></Loading>
  </view>
  <view class="Tips" v-if="card.length==0">
    没有商品收藏
  </view>
</template>

<script setup>
  import {ref,reactive,toRefs} from 'vue'
  import Card from '@/pages/common-component/Card-goods.vue'
  import Loading from '@/pages/loading-component/loading.vue'
  import {onReachBottom,onShow} from '@dcloudio/uni-app'
  let loading=ref(false)
  const data=reactive({card:[]})
  const {card}=toRefs(data)
  onShow(()=>{
    data.card=[]
    getData()
  })
 async function getData(skip=0){
    const res=await wx.cloud.callFunction({name:'my-collection',data:{skip}})
    console.log(res);
    data.card=[...data.card,...res.result]
  }
  // 上拉加载
  let page_n=ref(0)
  onReachBottom(async()=>{
    loading.value=true
    page_n.value++
    let sk=page_n.value*10
   await getData(sk)
    loading.value=false
  })
  
  
</script>

<style>
page{background-color: #f4f4f4;}
</style>