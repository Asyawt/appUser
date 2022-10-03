//商品详情页，各组件之间传值
import {reactive} from 'vue'
const goodsInfo=reactive({
    order:{
      goods_id:'',
      goods_image:'',
      goods_title:'',
      goods_price:0,//秒杀价格或原价，在秒杀的时候做了处理
      buy_amount:0,
      specs:[],
      subtotal:0,
      select:false,
      specsStr:'',//用于查询是否有相同规格，微信的eq有bug
      order_number:''//订单编号
    },
    exist:false,//判断是否存在秒杀或秒杀开始或结束
    num_shopcart:0
})
// 加入购物车
const db=wx.cloud.database()
// const _ = db.command
const shopcart=()=>{
  goodsInfo.order.subtotal=parseFloat((goodsInfo.order.goods_price*goodsInfo.order.buy_amount).toFixed(1))
  let specsStr=''
  if( goodsInfo.order.specs.length>0){//没有规格会报错
    goodsInfo.order.specs.forEach(i=>specsStr+=i.att_val)
  }
  goodsInfo.order.specsStr=specsStr
  return new Promise(async(resolve,reject)=>{
    try{
      // 判断数据库是否出现相同的数据,这里涉及到sepcs数组或对象是否相等的比较用wx提供的_.eq 有bug
      // let res=await db.collection('shop_cart').where({goods_id:goodsInfo.order.goods_id,specs:_.eq(goodsInfo.order.specs)}).get()    
    let res=await db.collection('shop_cart').where({goods_id:goodsInfo.order.goods_id,specsStr:goodsInfo.order.specsStr}).get()   
      if(res.data.length>0){
        resolve('已添加至购物车')
      }else{
        await db.collection('shop_cart').add({data:goodsInfo.order})
        goodsInfo.num_shopcart++
         resolve('加入购物车成功')
      }
      
    }catch(e){
      //TODO handle the exception
      reject('加入购物车失败')
    }
  })
  
}



export {goodsInfo,shopcart}