<template>
  <view class="Manage" @click="manages">
    {{manage}}
  </view>
  <view class="SH-view" v-for="(item,index) in cart_data" :key="index">
    <view class="SH-icon">
        <icon @click="selects(index,item.select)" type="success" color="#ea445a" v-if="item.select"></icon>
        <icon @click="selects(index,item.select)" type="circle"  v-else></icon>
    </view>
    <view class="SH-img">
      <image :src="item.goods_image" mode="aspectFill"></image>
    </view>
    <view class="SH-right">
      <view class="overflow">
        {{item.goods_title}}
      </view>
      <view class="SH-zhankai"  v-if="item.specs.length>0">
        <text v-for="(i,idx) in item.specs" :key="idx">{{i.att_val}}</text>
      </view>
     <view v-else class="SH-zhankai" style="background-color: initial;"></view>
      <view class="SH-price">      
              <view class="">
                ￥{{item.goods_price}}
              </view>
              <view class="SH-amount">
                <image @click="reduces(index,item._id)" :class="{'prevent_style':item.buy_amount==1}" src="../../static/detail/jianshao.png" mode="aspectFit"></image>
                <text>{{item.buy_amount}}</text>
                <image @click="plus(index,item._id)" src="../../static/detail/tianjia.png" mode="aspectFit"></image>
              </view>  
      </view>
    </view>
  </view>
  <!-- 没有数据的提示 -->
 <view class="Tips" v-if="cart_data.length==0">
    你还没有添加商品到购物车哦
  </view>
  <view class="" style="height: 200rpx;"></view>
  <!-- 底部 -->
  <view class="SH-bottom">
      <block v-if="selectall">
        <icon type="success" color="#ea445a" @click="cancelSelect"></icon>
        <text class="space" @click="cancelSelect">全选</text>
      </block>
      <block v-else>
        <icon type="circle" @click="selectalls"></icon>
        <text class="space" @click="selectalls">全选</text>
      </block>
      <text class="cut-apart"></text>
      <text class="space">合计:</text>
      <text class="SH-total">￥{{totalPrice}}</text>
      <text @click="getInfo(manage)" :class="{'prevent_btn':totalPrice<=0}" class="SH-settle">{{manage=='管理'?'结算':'删除'}}</text>
  </view>
</template>

<script setup>
  import {ref,reactive,onMounted,toRefs,computed} from 'vue'
  // switchTap：只能用于跳转到tabbar页面，并关闭其他非tabbar页面,tabbar之间做切换,tabbar页面不会关闭销毁，只是切换，所以用onshow
  import {onShow} from '@dcloudio/uni-app'
  const db=wx.cloud.database()
  onShow(()=>{
    getCart()
  })
  const data=reactive({cart_data:[]})
  const {cart_data}=toRefs(data)
 async function  getCart(){
    const res=await db.collection('shop_cart').get()
    data.cart_data=res.data
  }
  // 点击管理
  let manage=ref('管理')
  const manages=()=>{
    manage.value=='管理'?manage.value='完成':manage.value='管理'    
  }
  // 加减
 const reduces=(index,_id)=>{
   data.cart_data[index].buy_amount--
   data.cart_data[index].subtotal=parseFloat((data.cart_data[index].goods_price*data.cart_data[index].buy_amount).toFixed(1))
   db.collection('shop_cart').doc(_id).update({data:{buy_amount:data.cart_data[index].buy_amount,subtotal:data.cart_data[index].subtotal}})
 }
 const plus=(index,_id)=>{
   data.cart_data[index].buy_amount++
   data.cart_data[index].subtotal=parseFloat((data.cart_data[index].goods_price*data.cart_data[index].buy_amount).toFixed(1))
   db.collection('shop_cart').doc(_id).update({data:{buy_amount:data.cart_data[index].buy_amount,subtotal:data.cart_data[index].subtotal}})
 }
 // 单个商品选中和取消选中
 function selects(index,select){
   data.cart_data[index].select=!data.cart_data[index].select
 }
 // 监听全选或取消全选
 const totalPrice=computed(()=>{
   return data.cart_data.filter(item=>item.select).reduce((prep,item)=>{
     parseFloat(prep+=(item.goods_price*item.buy_amount)).toFixed(10)
     return prep
   },0)
 })
 const selectall=computed(()=>{
   return data.cart_data.every(item=>item.select)
 })
 // 取消全选
 const cancelSelect=()=>{
    data.cart_data.forEach(item=>item.select=false)
 }
 const selectalls=()=>{
    data.cart_data.forEach(item=>item.select=true)
 }
 // 结算和删除
 const getInfo=(manage)=>{
   if(manage=='管理'){//结算
    const res=data.cart_data.filter(item=>item.select)
    const str=JSON.stringify(res)
     wx.navigateTo({//购物车下单
       url:`/pages/pay-view/pay?type=cart&order=${str}`
     })
   }else{//删除
      data.cart_data.forEach(async(item,index)=>{
        if(item.select){
        await  db.collection('shop_cart').doc(item._id).remove()
        // 这里的删除的下标不能直接用index,因为这里有异步操作，而forEach是不会异步的，所以index的值变化很快，就不是当前的index了，因此我们需要重新换个index去使用
        data.cart_data.splice(data.cart_data.findIndex(i=>i._id==item._id),1)
        }
      })
   }
}
</script>

<style>
page{background-color: #fafafa;}
.Manage{
	padding: 20rpx 20rpx 0 0;
	text-align: right;
}
.SH-view{
	background-color: #FFFFFF;
	display: flex;
	padding: 40rpx 20rpx;
	margin: 20rpx 0;
}
.SH-icon{
	height: 150rpx;
	display: flex;
	align-items: center;
}
.SH-img{
	width: 150rpx;
	height: 150rpx;
	padding: 0 20rpx;
}
.SH-img image{
	width: 150rpx;
	height: 150rpx;
	border-radius: 7rpx;
}
.SH-right{
	flex: 1;
}
.SH-zhankai{
	background-color: #fafafa;
	color: #bdbdbd;
	display: inline-block;
	/* margin: 10rpx 0 20rpx 0; */
	padding: 5rpx 10rpx;
	font-size: 26rpx;
}
.SH-zhankai image{
	width: 20rpx;
	height: 20rpx;
	padding-left: 10rpx;
}
.SH-price{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.SH-price view:nth-child(1){
	color: #ff4b70;
	font-weight: bold;
}
.SH-amount{
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: flex-end;
}
.SH-amount image{
	width: 50rpx;
	height: 50rpx;
}
.SH-amount text{
	padding: 0 30rpx;
}
/* 底部购物车 */
.SH-bottom{
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
}
.SH-bottom text{
	display: block;
}
.space{
	padding: 0 15rpx;
}
.SH-total{
	flex: 1;
	color: #dd4055;
	font-weight: bold;
}
.SH-settle{
	background-color: #ea445a;
	padding: 20rpx 90rpx;
	border-radius: 10rpx;
	color: #FFFFFF;
}
.cut-apart{
	width: 7rpx;
	height: 30rpx;
	background-color: #dadada;
}
.prevent_btn{
	opacity: 0.4;
	pointer-events: none;
}
</style>