<template>
  <view class="purchase" >
      <view class="flex-left">
        <!-- plain="true" button镂空，不镂空的话，会有默认样式 -->
        <button plain="true" open-type="share">
          <image src="../../../static/detail/fenxiang.svg" mode="aspectFit"></image>    
          <text>分享</text>
        </button>
      </view>
      <view class="flex-left shopping-amount" @click="gocart">
        <image src="../../../static/detail/gouwuche.svg" mode="aspectFit"></image>
        <text>购物车</text>
        <text class="amount" v-if="goodsInfo.num_shopcart>0">{{goodsInfo.num_shopcart}}</text>
      </view>
      <view class="flex-left" @click="switchcoll(collection)">
        <image v-if="collection==0" src="../../../static/detail/shoucang.svg" mode="aspectFit"></image>
       <image v-else src="../../../static/detail/yishoucang.svg" mode="aspectFit"></image>
        <text>{{collection>0?'已收藏':'收藏'}}</text>
      </view>
      <view v-if="whether" @click="pushSpecs('shopcart',sku_data)" class="flex-right shopping-cart">
        加入购物车
      </view>
      <view v-if="whether" @click="pushSpecs('imbuy',sku_data)" class="flex-right buy">
        立即购买
      </view>
      <!-- 库存不足，商品已下架 -->
     <view v-else class="flex-right buy">
        {{tips}}
      </view>
  </view>
</template>

<script setup>
  import {watch,ref,reactive,toRefs} from 'vue'
  import {login_user} from '@/Acc-config/answer.js'
  import {Public} from '@/Acc-config/public.js'
  import {onShareAppMessage} from '@dcloudio/uni-app'
  import {goodsInfo,shopcart} from '@/Acc-config/place-order.js'

  const db=wx.cloud.database()
 let props=defineProps({
    goods_id:String,
    collection:Number,
    sku_data:Array,
    Goods:Object
  })
  const result=reactive({collection:0,goods_id:'',whether:true,tips:'',goods:{}})
  // console.log(result.goods);
  const {collection,whether,tips}=toRefs(result)
  // let listen=
 watch(props,(newval)=>{
    // console.log(22);
   let {collection,goods_id,Goods}=newval
    result.collection=collection
    result.goods_id=goods_id
    result.goods=Goods
       // console.log(newval.Goods);
    //判断商品是否已经下架，有无库存
    if(result.goods.shelves==false){
      if(result.goods.stock<=0){//商品下架以及库存不足
        result.whether=false
        result.tips='该商品已下架'
      }else{
        result.whether=false
        result.tips='该商品已下架'
      }
    }else if(result.goods.stock<=0){
      if(!result.goods.shelves){
        result.whether=false
        result.tips='该商品已下架'
      }else{
        result.whether=false
        result.tips='该商品已售空'
      }
    }

    // 移除
   // setTimeout(()=>{
   //    listen()
   // },1000)
  })
// 收藏和取消收藏
const switchcoll=async(i)=>{
  const user=wx.getStorageSync('user_info')
  if(!user){login_user.show=true;return}
  if(i===0){
    //收藏
    try{
      await db.collection('collect_goods').add({data:{goods_id:result.goods_id}})
      result.collection++
    }catch(e){
      //TODO handle the exception
      new Public().toast('收藏失败')
    }
  }else{
    //取消收藏
   try{
      await db.collection('collect_goods').where({goods_id:result.goods_id}).remove()
      result.collection=0
   }catch(e){
     //TODO handle the exception
     new Public().toast('取消收藏失败')
   }
  }
}

// 加购或立即购买
import {sku_popup} from '@/Acc-config/answer.js'
const pushSpecs=async(param,skudata)=>{
  const user=wx.getStorageSync('user_info')
  if(!user){login_user.show=true;return}
  if(skudata.length>0){//有规格
    sku_popup.show=true
    sku_popup.judge=param
  }else{//没有规格
  goodsInfo.order.buy_amount=1
    if(param=='shopcart'){//加入购物车
      try{
        let res= await shopcart()
        new Public().toast(res)
      }catch(e){
        //TODO handle the exception
       new Public().toast(err)
      }
    }else{//立即购买
      goodsInfo.order.subtotal=parseFloat((goodsInfo.order.goods_price*goodsInfo.order.buy_amount).toFixed(1))
       sku_popup.show=false
       // 这里当要传递的参数数据很多时，可能会传递不过去，需要进行一次转化
       const str=JSON.stringify([goodsInfo.order])
       wx.navigateTo({//direct单个商品下单
         url:`/pages/pay-view/pay?type=direct&order=${str}`
       })
    }
  }
}
// 跳转购物车
const gocart=()=>{
  wx.switchTab({
    url:'/pages/shopping-cart/shopping-cart'
  })
}
</script>

<style scoped>
.purchase{
	height: 100rpx;
	background-color: #fefefe;
	border-top: 1rpx solid #e3e3e4;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom:68rpx;
}
.purchase image{
	width: 40rpx;
	height: 40rpx;
	display: block;
	padding-bottom: 8rpx;
}
.flex-left{
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 25rpx;
	color: #8a8b90;
}
.flex-left button{
	border: navajowhite;
	padding: inherit !important;
	margin: 0 !important;
	font-size: 25rpx !important;
	line-height: inherit !important;
	color: #8a8b90 !important;
}
.flex-right{
	flex: 2;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
}
.shopping-cart{
	background-color: #fdf5f7;
	color: #ec697f;
	font-weight: bold;
}
.buy{
	background-color: #e9445a;
	color: #fefefe;
	font-weight: bold;
}
.shopping-amount{
	position: relative;
}
.amount{
	position: absolute;
	right: 0;
	top: -4rpx;
	background-color: #e9445a;
	color: #FFFFFF;
	width: 40rpx;
	height: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	border-radius: 50rpx;
}
</style>