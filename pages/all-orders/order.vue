<template>
  <!-- tab切换 -->
  <view class="order-tab">
      <view class="" v-for="(item,index) in tab" :key="index" @click="switchTab(index,item.query)">
        <text>{{item.name}}</text>
        <text :class="{order_Select:index==re}"></text>
      </view>
  </view>
  <view class="" style="height: 60rpx;"></view>
 <!-- 订单数据 --> 
 <view class="order-back" v-for="(item,index) in order_data" :key="index">
   <view class="order-card">
     <view class="">
       <image :src="item.goods_image" mode="aspectFill"></image>
     </view>
     <view class="">
       <text class="order-title-padd">{{item.goods_title}}</text>
       <text class="order-specs" v-if="item.specs.length>0" v-for="(i,idx) in item.specs" :key="idx">{{i.att_val}}</text>
     </view>
     <view class="">
       <text class="order-title-padd order-num">￥{{item.goods_price}}</text>
       <text class="order-num">x{{item.buy_amount}}</text>
     </view>
   </view>
   <!-- 合计 -->
   <view class="order-total">
     <text>合计:</text>
     <text>{{item.subtotal}}</text>
   </view>
   <!-- 支付状态 -->
   <!-- 1.支付成功的状态 -->
   <view class="order-button" v-if="item.pay_success=='success'">
      <!--待发货下面显示的状态：  待发货 申请退款 -->
      <block v-if="item.deliver=='stay'">
        <text class="order-button-a">待发货</text>
        <text class="order-button-b" @click="refund(index,item._id)">申请退款</text>
      </block>
      <!--待收货下面显示的状态： 确认收获 查看物流 申请退款 -->
      <block v-if="item.deliver=='already'">
        <text class="order-button-b" @click="confRece(index,item._id)">确认收获</text>
         <text class="order-button-b" @click="logistics(item.waybill_No,item.goods_image,item.goods_title,item.buy_amount)">查看物流</text>
        <text class="order-button-b" @click="refund(index,item._id)">申请退款</text>
      </block>
      <!--待评价下面显示的状态： 已收货 评价 申请退款 -->
      <block v-if="item.deliver=='rece_goods'">
        <text class="order-button-a">已收货</text>
        <text :class="item.evaluate?'order-button-a':'order-button-b'" @click="eavLuate(item._id,item.goods_id,index,item.evaluate,item.specs)">{{item.evaluate?'已评价':'评价'}}</text>
        <text class="order-button-b" @click="refund(index,item._id)">申请退款</text>
      </block>
      <!-- 申请退款中  -->
      <block v-if="item.deliver=='ref_pro'">
        <text class="order-button-a">申请退款中</text>   
      </block>
      <!-- 退款成功 -->
      <block v-if="item.deliver=='ref_succ'">
        <text class="order-button-a">退款成功</text>   
      </block>
   </view>
   <!-- 2.待支付的状态 -->
   <view class="order-button" v-else-if="item.pay_success=='not_pay'">
        <!-- 待支付下面显示的状态：取消订单 继续支付-->
         <text class="order-button-a" @click="canOrder(item._id,index)">取消订单</text>  
         <text class="order-button-b" @click="conPay(index,item._id,item.subtotal,item)">继续支付</text>  
   </view>
   <!-- 3.已取消订单的状态 -->
   <view class="order-button" v-else-if="item.pay_success=='can_order'">
     <!-- 订单已取消 -->
     <text class="order-button-a">订单已取消</text> 
   </view>
 </view>
  <!-- 没有数据的提示 -->
  <view class="Tips" v-if="order_data.length==0">
    没有订单数据
  </view>
  <!-- 加载提示 -->
 <view class="loading-hei" >
    <Loading v-if="loading"></Loading>
 </view>

</template>

<script setup>
  import {reactive,toRefs,ref,onBeforeUnmount,watch} from 'vue'
  import {onLoad,onReachBottom} from '@dcloudio/uni-app'
  import Loading from '@/pages/loading-component/loading.vue'
  import {Public} from '@/Acc-config/public.js'
  const db=wx.cloud.database()
  const re=ref(0)
  const loading=ref(false)
  const data=reactive({
    tab:[
      {
        name:'全部',
        query:{}
      },
      {
        name:'待支付',
        query:{pay_success:'not_pay'}
      },
      {
        name:'待发货',
        query:{pay_success:'success',deliver:'stay'}
      },
      {
        name:'待收货',
        query:{pay_success:'success',deliver:'already'}
      },
      {
        name:'待评价',
        query:{pay_success:'success',deliver:'rece_goods',evaluate:false}
      }
    ]
  })
  const {tab}=toRefs(data)
  onLoad((e)=>{
    let val=JSON.parse(e.obj)
    if(val!={}){
      switchTab(val.index,val.query)
    }else{
       getOrder(0,{})
    }
   
    
  })
  // tab切换
  const switchTab=(index,query)=>{
    page_n.value=0
    res_order.order_data=[]
    re.value=index
    getOrder(0,query)
  }
  // 请求数据
  const res_order=reactive({order_data:[]})
  const {order_data}=toRefs(res_order)
 async function getOrder(sk,query){
    const user=wx.getStorageSync('user_info')
    query['_openid']=user.openid
   const res= await db.collection('order_data').where(query).limit(10).skip(sk).orderBy('order_time','desc').get()
   res_order.order_data=[...res_order.order_data,...res.data]
  }
  // 上拉加载
  let page_n=ref(0)
  onReachBottom(async()=>{
    loading.value=true
    page_n.value++
    let sk=page_n.value*10
    await getOrder(sk,data.tab[re.value].query)
    loading.value=false
  })
  // 继续支付,需要重新获取payment,因为之前的统一下单返回的payment是有有效期的，所以这里需要重新统一下单
  import {outTradeNo} from '@/Acc-config/order_number.js'
  import {Wxpay} from '@/Acc-config/wx-pay.js'
  const conPay=async(index,_id,subtotal,item)=>{
    try{
      // 商户订单号
      let out_trade_no=outTradeNo()
       // 1.统一下单
      var payment=await new Wxpay().place(subtotal,out_trade_no)
      result._id=_id
      result.payment='payment.result'
      result.order_item=item
      result.index=index
      result.out_trade_no=out_trade_no
      // 2.发起拉起支付
      await new Wxpay().payMent('payment.result')    
    }catch(err){
      // 取消支付
    if(err && err.errMsg=='requestPayment:fail cancel'){
      new Public().toast('取消支付')
    }else{
      // 支付发生错误
      new Public().toast('支付发生错误')   
      }
    }  
  }
  // 用户支付后，该侦听器（是云开发提供的监听数据库某个集合变化的）会做出响应
  onBeforeUnmount(()=>{watcher.close()})
  let result=reactive({_id:'',payment:{},order_item:[],index:-1,out_trade_no:''})
  const watcher = db.collection('user_info').watch({
    onChange: (res)=> {
      const user=wx.getStorageSync('user_info')
      if(res.docChanges[0].dataType=='update'){//更新操作时才触发，可能初始化也会触发所以做判断
        // a.更新该条一条数据的某些字段
       db.collection('order_data').where({_openid:user.openid,_id:result._id}).update({data:{pay_success:'success',payment:result.payment,out_trade_no:result.out_trade_no}})       
        //b.支付成功，库存自减，售出自增
        //  let stock=await
        new Wxpay().stock([result.order_item])
        //c.修改本地数据，不需要再发请求，修改状态
        // 如果tab切换在全部上，就更改状态，否则就移除状态
        if(re.value==0){
            res_order.order_data[result.index].pay_success='success'
        }else{
           res_order.order_data.splice(result.index,1)
        }    
      }
    },
    onError: function(err) {
    }
  })
  // 取消订单
  const canOrder=async(_id,index)=>{
    const user=wx.getStorageSync('user_info')
    await db.collection('order_data').where({_openid:user.openid,_id}).update({data:{pay_success:'can_order'}})
    // 如果tab切换在全部上，就更改状态，否则就移除状态
    if(re.value==0){
        res_order.order_data[index].pay_success='can_order'
    }else{
       res_order.order_data.splice(index,1)
    }
  }
  // 退款
  const itemList=['七天无理由退款','商品信息描述不符','质量问题','包装/商品破损/污渍']
  const refund=(index,_id)=>{
    wx.showActionSheet({
      alertText:'退款原因',
      itemList,
      success:async(res)=>{
        // console.log(res.tapIndex)
         const user=wx.getStorageSync('user_info')
         await db.collection('order_data').where({_openid:user.openid,_id}).update({data:{deliver:'ref_pro',Re_reason:itemList[res.tapIndex]}}) 
         // 如果tab切换在全部上，就更改状态，否则就移除状态
         if(re.value==0){
             res_order.order_data[index].deliver='ref_pro'
         }else{
            res_order.order_data.splice(index,1)
         }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  }
  // 确认收获
 const confRece=async(index,_id)=>{
   const user=wx.getStorageSync('user_info')
   await db.collection('order_data').where({_openid:user.openid,_id}).update({data:{deliver:'rece_goods'}})
   if(re.value==0){
       res_order.order_data[index].deliver='rece_goods'
   }else{
      res_order.order_data.splice(index,1)
   }
 }
// 去评价
let eav_id=ref('')
const eavLuate=(_id,goods_id,index,evaluate,specs)=>{
  if(evaluate) return
  eav_id.value=_id
  let query=JSON.stringify({goods_id,index,specs})
  wx.navigateTo({
    url:'/pages/eav-goods/eavgoods?query='+query
  })
}
// 监听提交评价后，返回当前页面，更改当前页面某个数据的评价状态
import {eav_index} from '@/Acc-config/answer.js'
watch(eav_index,(newval)=>{
  // 视图更新
  if(re.value==0){
      res_order.order_data[newval].evaluate=true
  }else{
     res_order.order_data.splice(newval,1)
  }
  // 数据库更新
  const user=wx.getStorageSync('user_info')
  db.collection('order_data').where({_openid:user.openid,_id:eav_id.value}).update({data:{evaluate:true}})
})

// 查看物流
const logistics=(waybill_No,goods_image,goods_title,buy_amount)=>{
  let obj=JSON.stringify({waybill_No,goods_image,goods_title,buy_amount})
  wx.navigateTo({
    url:'/pages/order-tracking/track?value='+obj,
    })
}

</script>

<style>
page{
	background-color: #f8f8f8;
}
.order-tab{
	height: 60rpx;
	background-color: #FFFFFF;
	display: flex;
	justify-content: space-around;
	color: #737373;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
}
.order-tab view{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.order_Select{
	display: block;
	width: 40rpx;
	height: 10rpx;
	border-radius: 50rpx;
	background-color: #ea4050;
	position: absolute;
	bottom: 0;
}
/* 订单卡片 */
.order-back{
	background-color: #fefefe;
	padding: 20rpx;
	margin: 20rpx 0;
}
.order-card image{
	width: 150rpx;
	height: 150rpx;
	display: block;
	border-radius: 8rpx;
}
.order-card{
	display: flex;
}

.order-card view:nth-child(2){
	flex: 1;
	padding: 0 20rpx;
}
.order-title-padd{
	margin-bottom: 20rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
.order-specs{
	background-color: #fafafa;
	font-size: 27rpx;
	color: #767676;
	padding: 10rpx;
	border-radius: 9rpx;
}
.order-num{
	color: #8b8c90;
}
/* 合计 */
.order-total{
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-bottom: 30rpx;
}
.order-total text{
	display: block;
	padding-left: 20rpx;
}
.order-total text:nth-child(1){
	color: #8b8c90;
}
.order-total text:nth-child(2){
	font-weight: bold;
	font-size: 34rpx;
}
/* 按钮 */
.order-button{
	display: flex;
	justify-content: flex-end;
}
.order-button text{
	padding: 15rpx 35rpx;
	margin-left: 20rpx;
	border-radius: 10rpx;
}
.order-button-a{
	border: 1rpx solid #d7d8d8;
	color: #8b8c90;
}
.order-button-b{
	background-color: #ea4050;
	color: #FFFFFF;
}
</style>