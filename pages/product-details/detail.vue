<template>
  <!-- 导航栏 -->
  <view class="search-back" :style="{opacity:opacity}" v-show="show">
    <view class="" :style="{height:t_top+'px'}"></view>
    <view class="search-input" :style="{height:t_height+'px',paddingRight:t_width+'px'}">
      <view class="tab-jiantou" @click="topage">
        <image src="../../static/detail/video-fanhui.svg" mode="aspectFit"></image>
      </view>
      <view class="tab-view" v-for="(item,index) in tab_name" :key="index" :style="{height:t_height+'px'}" @click="switchTab(index)">
        <text>{{item}}</text>
        <text :class="{active:index==trigger}"></text>
      </view>
    </view>
  </view>
  <!-- 轮播 -->
  <Swipers id='select' class='swipers' :goods='goods' :seckill='seckill'></Swipers>
  <!-- 评价 -->
  <Eva id='select' class='eva' :AllComment='AllComment' :comments='comments'></Eva>
  <!-- 商品详情图 -->
  <Img id='select' class='img' :goods_details='goods.goods_details'></Img>
  <!-- 底部操作 -->
  <Purchase :goods_id='goods_id' :collection='collection' :sku_data='sku_data' :Goods='goods'></Purchase>
  <!--登录弹窗 -->
  <Login></Login>
  <!-- sku选择规格弹框 -->
  <Specs :sku_data='sku_data' :goods='goods'></Specs>
</template>

<script setup>
  import {reactive,ref,toRefs,onMounted,nextTick,watch} from 'vue'
  import Swipers from './component/swiper.vue'
  import Eva from './component/evaluate.vue'
  import Img from './component/image.vue'
  import {onLoad,onShareAppMessage,onPageScroll} from '@dcloudio/uni-app'
  import Purchase from './component/purchase.vue'
  import Login from '../components/login-view.vue'
  import Specs from '@/pages/components/specs-view.vue'
  import {goodsInfo} from '../../Acc-config/place-order.js'
  const db=wx.cloud.database()
  // 静态tab栏渲染数据
  const tab_data=reactive({
    tab_name:['商品','评价','详情'],
    t_height:0,
    t_top:0,
    t_width:0,
    all_height:0,
    show:true,
    opacity:0,//tab的透明度
    trigger:0
    })
  const {tab_name,t_height,t_top,t_width,all_height,show,opacity,trigger}=toRefs(tab_data)
  // 获取胶囊按钮位置
  onMounted(()=>{
    const tabdatas=wx.getMenuButtonBoundingClientRect()
    tab_data.t_height=tabdatas.height+5
    tab_data.t_top=tabdatas.top
    tab_data.t_width=tabdatas.width
    tab_data.all_height=tabdatas.height+tabdatas.top+5
  })
  // 获取轮播，评价，详情每个组件的高度
  let heightset=reactive({hei:[]})
  function viewheight(){
    // 获取组件或节点自身宽高等信息的api
    const query = wx.createSelectorQuery()
    query.selectAll('#select').boundingClientRect()
    query.exec(res=>{
      // console.log(res);
      heightset.hei.push(res[0][0].height-tab_data.all_height+10)//从滚到胶囊底部位置开始计算触发
      heightset.hei.push(res[0][1].height+heightset.hei[0])
      // heightset.hei.push(res[0][2].height+heightset.hei[1])
    })
  }
  // 请求数据，传值
  const result=reactive({
    goods_id:'',
    goods:{},
    collection:0,
    logCollection:0,
    sku_data:[],
    seckill:[],
    // shopCartNum:0,
    logshopCartNum:0,
    AllComment:0,
    comments:[]
    
    })
  const {goods,goods_id,collection, logCollection,sku_data,seckill,shopCartNum, logshopCartNum,AllComment,comments}=toRefs(result)
  onLoad((e)=>{
    // viewheight()
    // console.log(e);
    result.goods_id=e.goods_id
    // 1.获取商品的数据
    const goods=db.collection('goodsInfo').doc(e.goods_id).get()
    //2.获取收藏的商品的数据
    const collect=db.collection('collect_goods').where({goods_id:e.goods_id}).get()
    //3.获取sku的数据
    const skuData=db.collection('skuInfo').where({sku_id:e.goods_id}).field({sku:true}).get()
    //4.获取秒杀数据
    const seckill=db.collection('seckill').where({goods_id:e.goods_id}).field({ori_price:true,price_spike:true,seckill_time:true}).get()
    //5.获取购物车的条数
    const shopCart=db.collection('shop_cart').count()
    //6.获取评价数据
    const goodsComment=db.collection('goods_eva').where({goods_id:e.goods_id}).limit(3).get()
    //评价总条数
     const AllgoodsComment=db.collection('goods_eva').where({goods_id:e.goods_id}).count()
    //取出本地缓存的用户信息
    const user=wx.getStorageSync('user_info')
    // 
    Promise.all([goods,collect,skuData,seckill,shopCart,AllgoodsComment,goodsComment]).then(res=>{
      result.goods=res[0].data//商品的数据
      // console.log(res);
      result.collection=user?res[1].data.length:0//收藏的数据
      result.logCollection=res[1].data.length //登录成功之后获取这里的收藏数据
      result.sku_data=res[2].data //sku
      result.seckill=res[3].data //秒杀
      // result.shopCartNum=user?res[4].total:0//购物车的件数
       goodsInfo.num_shopcart=user?res[4].total:0//购物车的件数
      result.logshopCartNum=res[4].total//登录成功之后获取这里的购物车件数
      result.AllComment=res[5].total//评价总条数
      result.comments=res[6].data//前三条评价
 
    // 取到固定值不变
    goodsInfo.order.goods_id=res[0].data._id
    goodsInfo.order.goods_image=res[0].data.goods_cover
    goodsInfo.order.goods_title=res[0].data.goods_title
    goodsInfo.order.specs=[]//清空之前有规格的时候缓存的数据，当再次进入时如果是没有规格的那么这条数据缓存的是上条数据的规格，所以要清空，其他会直接取代，都做了操作
    // 没有秒杀，sku,取返回价格下单
     if(result.sku_data.length===0 && result.seckill.length===0){
       goodsInfo.order.goods_price=res[0].data.goods_price
     }
      
      
      
      
      
      
      
      
      
      
      
      
      
      // 等商品数据反回来后在计算组件的高度，因为这个高度不是固定，而是根据返回数据的多少自适应的
      nextTick(()=>{
        viewheight()
      })
 
    }).catch(err=>{
      console.log(err);
    })
    
  })
  // 滚动监听
  let contorl=ref(false)
  onPageScroll((e)=>{
    tab_data.opacity=e.scrollTop/150
    tab_data.show=e.scrollTop==0?false:true
    // 控制点1再点3跳转的小bug
    if(contorl.value) return
    if(e.scrollTop>=heightset.hei[tab_data.trigger]){
      //上拉
       tab_data.trigger++
    }else if(e.scrollTop<heightset.hei[tab_data.trigger-1]){
      //下拉
      // 初始的时候console.log(heightset.hei[tab_data.trigger-1]);下拉这个值为undefined，所以下拉也不会走这里
       tab_data.trigger-=1
    }
  })
  // 点击tab跳转指定组件
  const switchTab=(index)=>{
    contorl.value=true
    const i=index==0?'.swipers':index==1?'.eva':index==2?'.img':''
    const query = wx.createSelectorQuery()
    query.select(i).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      // console.log(res);
      wx.pageScrollTo({
//这里因为我们用的是这个api,能获取到组件的自身信息和距离页面的信息，当我们给不同的id或class时，他就会给出相应的节点的信息，利用这点我们可以实现点击切换index
// 获取不同节点的位置信息,利用他当前距离顶部的top和已经滑动的scrollTop,来页面确定要滑动的最终scrollTop
//注：这里的滑动到指定位置的值不是默认的，是计算出来的，不论上一个组件的高度多高都能到滑到指定位置，也可以用上面的heightset.hei里的数据
        scrollTop: res[0].top+res[1].scrollTop-tab_data.all_height,
        duration: 200
      })
      setTimeout(()=>{
        tab_data.trigger=index
        contorl.value=false
      },300)
    })
  }
// 监听登陆是否成功，成功则重新取收藏和购物车
import {login_user} from '@/Acc-config/answer.js'
watch(()=>login_user.response,(newval)=>{
  result.collection=result.logCollection
  // result.shopCartNum=result.logshopCartNum
  goodsInfo.num_shopcart=result.logshopCartNum
})
// 分享,最好放在父组件
onShareAppMessage(()=>{
  return {
    title:result.goods.goods_title,
    path:`/pages/product-details/detail?goods_id=${result.goods_id}`,
    imageUrl:result.goods.goods_cover
  }
})
// 返回上一页面
const topage=()=>{
  wx.navigateBack({
    delta:1
  })
}


</script>

<style>
page{background-color: #f6f6f6;}
.search-back{
	background-color: #FFFFFF;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.search-input{
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.tab-jiantou{
	width: 35rpx;
	height: 35rpx;
}
.tab-jiantou image{
	width: 35rpx;
	height: 35rpx;
}
.tab-view{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.tab-view text:nth-child(2){
	width: 30rpx;
	height: 10rpx;
	border-radius: 10rpx;
	position: absolute;
	bottom: 0;
}
.active{
	background-color: #f67319;
}
</style>