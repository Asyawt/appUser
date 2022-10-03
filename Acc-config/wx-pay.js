// 需要提交到数据库的订单数据
import {reactive} from 'vue'
let order_data=reactive({
  address:[],
  order_time:'',//下单时间:年月日时分秒
  query_time:'',//用于商家查询当天的数据:年月日
  pay_success:'not_pay',//支付成功: success,待支付: not_pay,已取消订单: can_order
  deliver:'stay',//待发货: stay,待收货: already,已收货: rece_goods,退款中: ref_pro, 退款成功: ref_succ
  evaluate:false,//待评价:false,已评价:true
  waybill_No:'',//运单号
  payment:{},// 统一下单返回的数据包 wx_pay
  Re_reason:'',//退款原因
  out_trade_no:'',//商户订单号 wx_pay
  out_refund_no:'' //商户退款单号 wx_pay
})
const db=wx.cloud.database()
const _=db.command
class Wxpay{
  constructor(){}
  //1.请求云函数，获取统一下单返回的数据
  async place(price,outTradeNo){
      try{
        // 调用请求云函数
        const res=await wx.cloud.callFunction({name:'wx-pay',data:{price,outTradeNo}})
        return res.payment
      }catch(e){
        //TODO handle the exception
        return {msg:'请求统一下单云函数出差',err}
      }
  }
  
  // 2.提交订单到数据库
  subMit(order,payment,address,time,query_time,out_trade_no){
    order_data.payment=payment
    order_data.address=address
    order_data.order_time=time
    order_data.query_time=query_time
    order_data.out_trade_no=out_trade_no
    // 重新整理合并订单需要的数据，且要考虑购物车的数据
    //这里new_order是个数组，里面的每一项就是一个商品的订单数据
    var new_order=order.map(item=>{
      return {...item,...order_data}
    })
    //这里因为是我们自己封装的方法，并没异步功能，而里面的操作，上传数据是异步，通常我们会把这个操作封装成promise异步操作，再进行下一次的操作
    return new Promise((resolve,reject)=>{
       new_order.forEach((item,index)=>{
        try{
          db.collection('order_data').add({data:item})
          if(index==new_order.length-1){//这步判断相当于是Promis.all,等每一次的上传操作都成功才返回给上一级的promise成功
            resolve('success')
          }
        }catch(err){
          reject(err)
        }
       })
    })  
  }
  
  // 3.发起支付
  payMent(payment){
    return new Promise((resolve,reject)=>{
      wx.requestPayment({
        ...payment,
        success:(res)=>{
          resolve(res)
        },
        fail:(err)=>{
          reject(err)
        }
      })
    })
  }


// 4.支付成功或取消支付更改订单字段
  async state(value,out_trade_no){
   const user=wx.getStorageSync('user_info')
   if(value=='success'){
     await db.collection('order_data').where({_openid:user.openid,out_trade_no}).update({data:{pay_success:'success'}})
     return 'success'
   }else{
     await db.collection('order_data').where({_openid:user.openid,out_trade_no}).update({data:{pay_success:'not_pay'}})
     return 'success'
   }
 }
// 支付成功：库存自减，售出自增
 stock(order){
    return new Promise((resolve,reject)=>{
      order.forEach(async(item,index)=>{
        try{
          //这里是对总库存数据的一个库存和已售的增减
          await db.collection('goodsInfo').doc(item.goods_id).update({data:{stock:_.inc(-item.buy_amount),sold:_.inc(item.buy_amount)}})
          // 如果有规格，规格里面的库存也需要同样操作，直接查，不用判断，因为查不到就没有
          await db.collection('skuInfo').where({sku_id:item.goods_id,'sku.att_data':_.eq(item.specs)}).update({data:{'sku.$.stock':_.inc(-item.buy_amount)}})
          // 涉及到购物车，有多条订单数据
          if(index==order.length-1){
            resolve('success')
          }
          
        }catch(err){
          //TODO handle the exception
          reject(err)
        }
      })
    })
}
// 删除购物车的下单商品数据
deleteCart(cartOrder){
    return new Promise((resolve,reject)=>{
      cartOrder.forEach(async(item,index)=>{
        try{
          await db.collection('shop_cart').doc(item._id).remove()
          if(index==cartOrder.length-1){
            resolve('success')
          }
        }catch(e){
          //TODO handle the exception
          reject(err)
        }
      })
      
    })
}

}

export {Wxpay}