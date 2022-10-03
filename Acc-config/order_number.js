// 商户订单号(一个32位的随机字符串)
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
//订单编号
let codes=function(){
  let code=''
  for(let i=0;i<6;i++){
    code+=Math.floor(Math.random()*10)
  }
  // 时间戳13位
  code=Date.now()+code
  return code
}
export {outTradeNo,codes}