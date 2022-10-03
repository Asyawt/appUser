const crypto=require('crypto')

// 随机字符串
let noncestr=function(){
  const buf=crypto.randomBytes(16)
  
  return buf.toString('hex')
}
// 商户订单号
// 为了防止高并发，出现相同的，不太好处理
let outTradeNo=function(){
  let chars='ABCDEFGHIJKLMNOPQRSTUVWXYZAabcdefghijklmn1234567890'
  let maxPos=chars.length
  let res=[]
  for (let i = 0; i < 32; i++) {
    // res+=chars.charAt(Math.floor(Math.random()*maxPos))
    res.push(chars.charAt(Math.floor(Math.random()*maxPos)))
    
  }
 
  return  res.join('')
}

module.exports={noncestr,outTradeNo}