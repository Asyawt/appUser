<template>
  <view class="video-return">
   <view class="" :style="{height:v_top+'px'}"></view>
   <view class="video-return-img" :style="{height:v_height+'px'}">
     <view class="">
       <image @click="toback" src="../../static/detail/video-fanhui.svg" mode="aspectFit"></image>
     </view>
   </view>
  </view>
  <view class="trim-video" :style="{height:winHeight+'px'}">
    <!-- 短视频 -->
    <video @play="plays"  id="myVideo" :style="{height:winHeight+'px'}"   picture-in-picture-mode="{{['push', 'pop']}}"   objectFit="cover" :autoplay="true" :show-center-play-btn="false" :controls="false" loop="true" :src="videoData.video_url"></video>
    <!-- 没设z-index，后来者居上，因此这里点击其他自定义内容不会触发事件 -->
    <view class="all-round" @click="pauseVideo"> </view>
    <!-- 自定义播放按钮 -->
    <view class="video-img" @click="playVideo" v-show="showbtn">
      <image src="../../static/detail/video-bofang.svg" mode="aspectFit"></image>
    </view>
    <!-- 其他操作 -->
    <view class="advert-left">
      <view class="goods-det" @click="todetail">
        <image :src="videoData.goods_cover" mode="aspectFill"></image>   
        <view class="goods-price">
          <text>￥{{videoData.goods_price}}</text>
          <text>抢</text>
        </view>
      </view>
      <view class="goods-title overflow">
        {{videoData.goods_title}}
      </view>
    </view>
    <!-- 右边按钮 -->
    <view class="user-right">
      <view class="give-thethu" @click="comments">
        <view class=""><image src="../../static/detail/video-pinglun.svg" mode="aspectFit"></image>
        </view>
        <view class="">
            {{total==0?'评论':total}}
        </view>
      </view>
      <view class="give-thethu comment">
          <view class="" v-if="collection<=0" @click="toCollect">
            <image src="../../static/detail/video-shoucang.svg" mode="aspectFit"></image>  
          </view>
        <view class="" v-else @click="cancelCollect">
            <image src="../../static/detail/video-yishoucang.svg" mode="aspe          ctFit"></image>  
        </view>
          <view class="">
             {{collection<=0?'收藏':'已收藏'}}
          </view>
      </view>
      <view class="give-thethu">
          <button open-type="share" plain>
            <view class="">
            <image src="../../static/detail/video-fenxiang.svg" mode=""></image>
            </view>
            <view class="">
              分享
            </view>
          </button>
      </view>
    </view>
  </view>
  <!-- 评论组件 -->
  <Comment></Comment>
  <!-- 登录组件 -->
  <Login></Login>
</template>

<script setup>
  import {onMounted,reactive,toRefs,watch} from 'vue'
  import Comment from './component/comment.vue'
  import {onLoad,onShareAppMessage} from '@dcloudio/uni-app'
  import Login from '../components/login-view.vue'
  import {login_user} from '@/Acc-config/answer.js'
  import {Public} from '@/Acc-config/public.js'
  import {comment_show} from '@/Acc-config/answer.js'
  const db=wx.cloud.database()
  const video_data=reactive({
    v_height:0,
    v_top:0,
    winHeight:0,
    videoPlay:{},
    showbtn:false
  })
  const { v_height,v_top,winHeight,showbtn}=toRefs(video_data)
  onMounted(()=>{
    const btn_data=wx.getMenuButtonBoundingClientRect()
    video_data.v_height=btn_data.height
    video_data.v_top=btn_data.top
    //获取屏幕的宽高
    video_data.winHeight=wx.getSystemInfoSync().screenHeight
    // 获取视频的上下文
   video_data.videoPlay=wx.createVideoContext('myVideo')
  })
  //自定义播放按钮播放视频
  const playVideo=()=>{
    video_data.showbtn=false
    video_data.videoPlay.play()
  }
  //暂停播放或者继续播放
  const pauseVideo=()=>{
    video_data.showbtn=!video_data.showbtn
    if(video_data.showbtn){
       video_data.videoPlay.pause()
    }else{
       video_data.videoPlay.play()
    }
  }
  //进入时自动播放,隐藏图标 	当开始/继续播放时触发 play 事件
  // const plays=()=>{
  //      video_data.showbtn=false
  // }
  
  //接收上个页面短视频传递的值,请求短视频的数据
  const result=reactive({goods_id:'',videoData:{},total:0,collection:0,logCollection:0})
  const {videoData,total,collection}=toRefs(result)
  onLoad(async(e)=>{
    comment_show.num=1
    //获取本地缓存的用户信息
    const user=wx.getStorageSync('user_info')
    // 
    result.goods_id=e.goods_id
    //获取某一商品的数据
    const goodsInfo=await db.collection('goodsInfo').doc(e.goods_id).field({video_url:true,goods_cover:true,goods_title:true,goods_price:true,seckill:true}).get()
    // console.log(goodsInfo);
    //获取评论条数
    const count=await db.collection('video_comment').where({goods_id:e.goods_id}).count()
    //收藏数据,这里的收藏不会展示总条数，只显示是否收藏
    const collect=await db.collection('collect_goods').where({goods_id:e.goods_id}).get()
    //并发
    Promise.all([goodsInfo,count,collect]).then(async(res)=>{
      //左边抢数据
      result.videoData=res[0].data
      // 评论条数数据
      result.total=res[1].total
      //收藏功能
      result.collection=user?res[2].data.length:0
      result.logCollection=res[2].data.length
      //
      //该商品是否参与秒杀，如果有，就展示秒杀价格
      if(res[0].data.seckill){
         const seckill=await db.collection('seckill').where({goods_id:e.goods_id}).field({price_spike:true}).get()
         // console.log(seckill);
          result.videoData.goods_price=seckill.data[0].price_spike
      }
    }).catch(err=>{
      console.log(err);
    })
  })
// 监听用户是否登录成功了，如果登录成功了，那么收藏的值取数据库里面存储的值
watch(()=>login_user.response,(newval)=>{
  result.collection=result.logCollection
  // console.log(newval);
})
//点击收藏功能
const toCollect=async()=>{
  const user=wx.getStorageSync('user_info') 
  if(!user){
    login_user.show=true
    return
  }
  try{
    await db.collection('collect_goods').add({data:{goods_id:result.goods_id}})
    // 这里我们确定是添加了一个收藏，没必要再去拉取数据库的数据，因为这里只显示是否收藏，且用<=0来判断，所以
    result.collection++
  }catch(e){
    //TODO handle the exception
    new Public().toast('收藏失败')
  }
  
}
//取消收藏
const cancelCollect=async()=>{
    //判断是否登录
  const user=wx.getStorageSync('user_info')
  if(!user){login_user.show=true;return}
  
  try{
     await db.collection('collect_goods').where({goods_id:result.goods_id}).remove()
    result.collection=0
  }catch(e){
    //TODO handle the exception
     new Public().toast('取消收藏失败')
  }
}
//拉出评论框

 const comments=()=>{
   comment_show.show=true
   //控制只第一次点击时会请求数据
   comment_show.num++
   //传递商品的id
   comment_show.goods_id=result.goods_id
 }
 //分享转发给好友, 页面事件处理函数和onPullDownRefresh()一致
 onShareAppMessage(()=>{
   return{
     title:result.videoData.goods_title,
     path:`/pages/short-video/video?goods_id=${result.goods_id}`,
     imageUrl:result.videoData.goods_cover
   }
 })
 //返回上一页
 const toback=()=>{
   wx.navigateBack({
     delta:1
   })
 }
 // 跳转商品详情
 const todetail=()=>{
   wx.navigateTo({
     url:'/pages/product-details/detail?goods_id='+result.goods_id
   })
 }
</script>

<style scoped>
.video-return{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.video-return-img view{
  height: 100%;
	width: 50rpx;
	display: flex;
	align-items: center;
	padding-left: 20rpx;
}
.video-return-img image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
/* 视频 */
.trim-video{
	width: 100%;
	position: relative;
	overflow: hidden;
}
.trim-video video{
	width: 100%;
}
/* 透明覆盖 */
.all-round{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.01);
}
/* 自定义按钮 */
.video-img image{
	width: 110rpx;
	height: 110rpx;
	z-index: 999;
	/* border: 2px solid #FFFFFF;
	border-radius: 50%; */
}
.video-img{
	width: 110rpx;
	height: 110rpx;
	position: absolute;
	bottom: 0;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
}
/* 详情页和标题 */
.advert-left{
	position: absolute;
	left: 20rpx;
	bottom: 85rpx;
}
.goods-det{
	/* height: 170rpx; */
	width: 300rpx;
	background-color: red;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
}
.goods-det image{
	height: 120rpx;
	width: 300rpx;
	display: block;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
}
.goods-price text{display: block;}
.goods-price{
	display: flex;
	/* align-items: center; */
	justify-content: space-between;
	padding: 9rpx 10rpx;
	font-size: 27rpx;
	color: #FFFFFF;
	font-weight: bold;
}
.goods-title{
	width: 500rpx;
	line-height: 1.5;
	font-size: 30rpx;
	color: #FFFFFF;
}
/* 右边用户操作 */
.user-right{
	position: absolute;
	right: 20rpx;
	bottom: 85rpx;
	width: 100rpx;
	font-size: 25rpx;
	color: #FFFFFF;
}
.user-right image{
	width: 55rpx;
	height: 55rpx !important;
}
.give-thethu{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.give-thethu button{
	border: navajowhite;
	padding: inherit !important;
	margin: 0 !important;
	font-size: 25rpx !important;
	line-height: inherit !important;
	color: #FFFFFF !important;
}
.comment{margin: 60rpx 0;}
</style>