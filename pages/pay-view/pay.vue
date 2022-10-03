<template>
  <!-- 收获地址 -->
  <view class="pay-address" v-for="(item,index) in address" :key="index" @click="choiceadd">
    <view class="pay-address-left">
      <image src="../../static/detail/dingdan-dizhi.svg" mode="aspectFit"></image>
    </view>
    <view class="pay-address-name">
      <view class="">
        <text>{{item.name}}</text>
        <text>{{item.mobile}}</text>
      </view>
      <text>{{item.district+item.address}}</text>
    </view>
    <view class="pay-address-right">
      <image src="../../static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
    </view>
  </view>
  <!-- 商品详情 -->
  <view class="pay-goods" v-for="(item,index) in order" :key="index">
    <view class="">
      <image :src="item.goods_image" mode="aspectFill"></image>
    </view>
    <view class="aa" >
      <text class="pay-goods-title">{{item.goods_title}}</text>
      <text class="pay-goods-specs" v-if="item.specs.length>0" v-for="(i,idx) in item.specs" :key="idx">{{i.att_val}}</text>
      <view class="pay-goods-price">
        <text>￥{{item.goods_price}}</text>
         <text v-if="type!='direct'">x{{item.buy_amount}}</text>
         <view class="" v-else>
           <image @click="reduces(item)" :class="{prevent_style:item.buy_amount==1}" src="../../static/detail/jianshao.png" mode="aspectFit"></image>
           <text>{{item.buy_amount}}</text>
           <image @click="adds(item)" src="../../static/detail/tianjia.png" mode="aspectFit"></image>
         </view>
      </view>
    </view>
  </view>
  <!-- 支付按钮-->
 <view style="height: 200rpx;"></view> 
 <view class="set-accounts">
   <view class="">
     ￥{{total_price}}
   </view>
   <view class="" @click="subOrder">
     提交订单
   </view>
 </view>
  
</template>

<script setup>
  import {onMounted,ref,reactive,toRefs,watch,computed,onBeforeUnmount} from 'vue'
  import {onLoad} from '@dcloudio/uni-app'
  import {newAddress} from '@/Acc-config/answer.js'
  import {Public} from '@/Acc-config/public.js'
  const db=wx.cloud.database()
  const re_data=reactive({address:[]})
  const {address}=toRefs(re_data)
  onMounted(async()=>{
    const res=await db.collection('re_address').where({tacitly:true}).get()
    // console.log(res);
    re_data.address=res.data
  })
  // 跳转选择收货地址页面
  const choiceadd=()=>{
    wx.navigateTo({
      url:'/pages/re-address/address'
    })
  }
  // 接收选择收货地址页面，传递的值
  watch(newAddress,(newval)=>{
    re_data.address=newval.data
  })
  const or_data=reactive({order:[],type:'',total_price:0})
  const {order,type,total_price}=toRefs(or_data)
  onLoad((e)=>{
    const data=JSON.parse(e.order)
    or_data.order=data
    or_data.type=e.type
    //计算待支付的总价格
    // console.log(data);
  })
  watch(()=>or_data.order,(newval)=>{
    // console.log(or_data.order);
 or_data.total_price=newval.reduce((prep,item)=>{
      parseFloat((prep+=(item.goods_price*item.buy_amount)).toFixed(1))
       return prep
    },0)
  },{deep:true,immediate:true})
  // 加减
  const reduces=(item)=>{
    item.buy_amount--
    item.subtotal=parseFloat((item.buy_amount*item.goods_price).toFixed(1))
  }
  const adds=(item)=>{
     item.buy_amount++
     item.subtotal=parseFloat((item.buy_amount*item.goods_price).toFixed(1))
  }
  // 提交订单
  import {outTradeNo,codes} from '@/Acc-config/order_number.js'
  import {Wxpay} from '@/Acc-config/wx-pay.js'
  import moment from 'moment'
  const subOrder=async()=>{
    wx.showLoading({title:'正在下单',mask:true})
    // 获取当前时间：年月日，时分秒
    let time=moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
     // 获取当前时间：年月日
    let query_time=moment().utcOffset(8).format('YYYY-MM-DD')
    // 对每个商品生成订单编号，填充随机字符串
    or_data.order.forEach(item=>item.order_number=codes())
   // 商户订单号
   let out_trade_no=outTradeNo()
   
   try{
     // 1.统一下单
     //这里函数的调用是调用的云函数，调用云函数实际上就是后端的操作（在云开发里写在了前端页面，进行一个后端的操作）
     // 这里的请求不是从本地去请求了，而是从云端去请求wx的统一下单的接口，返回要用的支付数据
     var payment=await new Wxpay().place(or_data.total_price,out_trade_no)
     // console.log(payment);
     // 2.提交订单到数据库
     const res=await new Wxpay().subMit(or_data.order,'payment.result',re_data.address,time,query_time,out_trade_no)
     // console.log(res);
     result.out_trade_no=out_trade_no
     // 3.发起拉起支付
     //这里wx提供的支付api是本地的操作，拉出本地支付页面的操作
    const pay=await new Wxpay().payMent('payment.result')
     // console.log(pay);
     // 这里需要注意：如果我们支付成功，但最后没有点击完成的按钮，这里的pay是没有返回值的，也就是商家就收不到客户支付成功的消息，因此这里还需要在后端（云函数端）做处理
     //这里我们要的效果是即使用户没有点击完成按钮，商户也能接收到收款信息，因此在我们支付成功后，不能在这里（前端页面）写之后的操作，也就是更改数据库的某些字段，如支付状态，
     // 我们是在后端也就是云函数端，完成了这一操作，因为它也提供了可以满足上面条件的一个回调函数cloud.cloudPay.unifiedOrder里面的functionName，利用它，我们可以自定义一个回调函数，进行更改数据库的某些字段的操作，且能够满足上面的不点击完成按钮的要求
    //===>
     
   }catch(err){
    //取消支付，捕获错误，这个错误应该是发起支付点击取消后返回的错误，而不是前两个
    if(err && err.errMsg=='requestPayment:fail cancel'){
      if(or_data.type=='cart'){
           let cart=await new Wxpay().deleteCart(or_data.order)
      }  
      // 跳转到订单页面
      wx.hideLoading()
      wx.redirectTo({url:'/pages/all-orders/order'})  
    }else{
      // 支付发生错误
      new Public().toast('支付发生错误')
      await db.collection('order_data').where({out_trade_no}).remove()
    }
   }
  }
  //===>
  onBeforeUnmount(()=>{watcher.close()})//待支付状态也会发起支付，也会触发这个侦听器，这样就操作了两次数据库
  // 4.支付成功或取消支付更改订单字段
  // 用户支付后，该侦听器（是云开发提供的监听数据库某个集合变化的）会做出响应
  //在这里的侦听数据库集合的变化，就完成了用户不点击完成按钮，商户也能接收信息的操作和一些其他操作
  //只监视当前用户信息的变化
  let result=reactive({out_trade_no:''})
  const watcher = db.collection('user_info').watch({
    onChange: (res)=> {
      // console.log(res)
      if(res.docChanges[0].dataType=='update'){//更新操作时才触发，可能初始化也会触发所以做判断
        //a.支付成功修改订单字段为成功，跳转订单页面
        // let state=await
         new Wxpay().state('success',result.out_trade_no)
        //b.支付成功，库存自减，售出自增
        //  let stock=await
       new Wxpay().stock(or_data.order)
        //c.如果是购物车的下单商品数据要删除
        if(or_data.type=='cart'){
          //   let cart=await
           new Wxpay().deleteCart(or_data.order)
        }   
        // 跳转到订单页面
        wx.hideLoading()
        wx.redirectTo({
          url:'/pages/all-orders/order'
        })    
      }
    },
    onError: function(err) {
      
    }
  })
  
</script>

<style>
page{
	background-color: #f6f6f6;
}
.aa{
  flex: 1;
}
.pay-address{
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	padding: 20rpx;
	margin-bottom: 20rpx;
}
.pay-address-left image{
	display: block;
	width: 40rpx;
	height: 40rpx;
}
.pay-address-right image{
	display: block;
	width: 30rpx;
	height: 30rpx;
}
.pay-address-name{
	flex: 1;
	padding: 0 20rpx;
}
.pay-address-name view{
	display: flex;
	align-items: center;
}
.pay-address-name view text:nth-child(1){
	padding-right: 10rpx;
	font-weight: bold;
}
.pay-address-name view text:nth-child(2){
	color: #8b8b8d;
}
/* 待支付商品 */
.pay-goods{
	background-color: #FFFFFF;
	display: flex;
	padding: 20rpx 20rpx 40rpx 20rpx;
}
.pay-goods text{
	display: block;
}
.pay-goods image{
	display: block;
	width: 200rpx;
	height: 200rpx;
	margin-right: 20rpx;
	border-radius: 6rpx;
}
.pay-goods-title{
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box !important;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.pay-goods-specs{
	background-color: #fafafa;
	padding: 10rpx;
	display: inline-block !important;
	font-size: 28rpx;
	color: #a4a4a4;
	margin-top: 20rpx;
}
.pay-goods-price{
	padding-top: 50rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
}
.pay-goods-price image{
	width: 50rpx;
	height: 50rpx;
	display: block;
	margin: 0 !important;
}
.pay-goods-price view{
	display: flex;
	align-items: center;
}
.pay-goods-price view text{
	padding: 0 40rpx;
}
/* 结算 */
.set-accounts{
	background-color: #FFFFFF;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 20rpx 68rpx 20rpx;
}
.set-accounts view:nth-child(1){
	color: #fc324a;
	font-size: 35rpx;
	font-weight: bold;
}
.set-accounts view:nth-child(2){
	background-color: #ea445a;
	color: #FFFFFF;
	font-size: 35rpx;
	padding: 15rpx 35rpx;
	border-radius: 10rpx;
}
</style>