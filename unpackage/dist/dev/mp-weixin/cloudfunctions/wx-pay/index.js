// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lingshi-user-9gqe4ry205449a04'
})

const {noncestr,outTradeNo}=require('./config/public')

// 云函数入口函数  
exports.main = async (event, context) => {
  //统一下单
  const res = await cloud.cloudPay.unifiedOrder({
    "functionName":"pay_cb",//接收异步通知的云函数（用户不点支付成功的完成按钮，我们依然可以收到通知）//在发起统一下单时指定的云函数会在用户完成支付后接收到支付结果回调
    "envId":"lingshi-user-9gqe4ry205449a04",
    "subMchId":"",
    "nonceStr":noncestr(), //随机字符串
    "body":'零食商城下单',
    // "outTradeNo":outTradeNo(), //商户订单号,小程序端传来
    "outTradeNo":event.outTradeNo,
    "totalFee":event.price*100,//单位为分，要支付的价格,小程序端传来
    "spbillCreateIp":'127.0.0.1',
    "tradeType":'JSAPI',
  })
  // console.log(res)

   return res 
}