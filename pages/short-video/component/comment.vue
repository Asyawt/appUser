<template>
 <page-container :show='comment_show.show' bindenter='onEnter'>
   <view class="space-view">
    
     <view class="chacha" @click="comment_show.show=false">
       <image src="../../../static/detail/guanbi.svg" mode="aspectFit"></image>
     </view>
<!--     这里要用到上拉刷新，但是onReachBottom只能在父组件中使用，而当前的对话框组件是引入进去的子组件，所以用onReachBottom不会起到下拉刷新的效果，因此用到wx提供的 scroll-view--,因为onReachBottom是页面的生命周期，不是组件的> -->
     <scroll-view @scrolltolower="tolower"  scroll-y="true" :show-scrollbar='false' :enhanced='true' class="scroll-hi">
       <view class="messages-views" v-for="(item,index) in commentData" :key="index">
        <view class="messages-name">
          <image :src="item.avatarurl" mode=""></image>
           <view class="nickname">
            {{item.nickname}}
           </view>
           <view class="times">
             {{item.time}}
           </view>
        </view>
        <view class="messages-title">
           {{item.content}}
        </view>
       </view>
       <!-- 没有评论的提示 -->
       <view class="Tips" v-if="commentData.length==0">
        <text  v-if='showtips'>加载中...</text>
        <text  v-else>暂无评论</text>     
       </view>
       <!-- 上拉加载提示 -->
       <view class="loading-hei">
         <Loading v-show="loading"></Loading>
       </view>
     <view class="" style="height: 150rpx;"></view>
     </scroll-view>
     <!-- 输入评论框 -->
     <view class="Comment-box">
       <view class="Comment-box-input">
         <input v-model="content" type="text" placeholder="留下你的评论" confirm-type="send" cursor-spacing="50">
       </view>
       <view class="send-out" @click="send">
         发送
       </view>
     </view>
   </view>
 </page-container>
</template>

<script setup>
  function onEnter(){}
  import {comment_show,login_user} from '@/Acc-config/answer.js'
  import {onMounted,watch,reactive,ref,toRefs} from 'vue'
  import {Public} from '../../../Acc-config/public.js'
  import Loading from '@/pages/loading-component/loading.vue'
  import moment from 'moment'
  const db=wx.cloud.database()
  const showtips=ref(true)
  // import {onLoad,onShow,onHide} from '@dcloudio/uni-app'
  // onShow(()=>{
  //   getComments()
  // })
  // onHide(()=>{
  //   console.log('hide');
  // })
  // 这里想要当点击评论进行展示的时候拉起评论框的值，用生命周期函数不行，因为全程控制这个组件的不是父组件里的v-if，当加载父组件时这个组件就会加载，只不过里面的内容隐藏了，用侦听器
  watch(comment_show,(newval)=>{
    if(newval.show && newval.num==2){
      relation.goods_id=newval.goods_id
      getComments(newval.goods_id)
    }
  })
  //请求评论数据，这里我们还要控制当用户第一次点击评论的时候请求的数据进行缓存，后面再次点击时不会再去拉取数据，只有当用户重新进来的时候才拉取一次数据，设置一个flag来控制，即（num）
  const getComments=async(goods_id,sk=0)=>{
   
    // console.log('112');
    const res=await db.collection('video_comment').where({goods_id}).limit(10).skip(sk).get()
    if(sk==0){
      com_data.commentData=res.data
    }else{
      com_data.commentData=[...com_data.commentData,...res.data]
    }
   showtips.value=false
  }
  //评论的数据
  const com_data=reactive({content:'',commentData:[]})
  const {content,commentData}=toRefs(com_data)
  //提交评论
  const relation=reactive({goods_id:''})//收集商品id
  const send=async()=>{
    if(!com_data.content.trim()) return
    //判断是否登录
    const user=wx.getStorageSync('user_info')
    if(!user){ login_user.show=true;return}
    let time=moment().utcOffset(8).format('YYYY-MM-DD')
    // 整理提交到数据库的数据
    const obj={
      avatarurl: user.avatarUrl, 
      nickname:user.nickName,
      time:time,
      content:com_data.content,
      goods_id:relation.goods_id
    }
    try{
      await db.collection('video_comment').add({data:obj})
      com_data.content=''
      // 这里评论成功展示自己的评论，不会重新去拉取数据库，而是直接在展示的数据里面添加该条评论进行展示，如果去拉取数据库服务器会撑不住，也会影响性能
      com_data.commentData.unshift(obj)
      new Public().toast('评论成功')
    }catch(e){
      //TODO handle the exception
      new Public().toast('评论失败')
    }       
  }
  // 上拉加载
  const loading=ref(false)
  //这个事件要指定一个高度才能触发
  let page_n=ref(0)
  const tolower=async(e)=>{
    if(com_data.commentData.length<10) return false
    loading.value=true
    page_n.value++
    let sk=page_n.value*10
    await getComments(relation.goods_id,sk)
    loading.value=false
  }
</script>

<style scoped>
.chacha{
  position: fixed;
  right: 38rpx;
  z-index: 1;
}
.chacha image{width: 30rpx; height: 30rpx;}
.scroll-hi{height: 100%;}
/* 评论内容 */
.messages-views{
	margin: 20rpx 0;
}
.messages-name image{
	width: 60rpx; height: 60rpx;
	border-radius: 50%;
}
.messages-name{
	display: flex;
	align-items: center;
	height: 60rpx;
}
.nickname{
	flex: 1;
	color: #8a8b90;
	font-size: 30rpx;
	padding-left: 15rpx;
}
.times{
	color: #b0afb4;
	font-size: 25rpx;
}
.messages-title{
	font-size: 30rpx;
	padding-left: 75rpx;
	line-height: 1.4;
	margin: 20rpx 0;
}
/* 固定底部的评论框 */
.Comment-box{
	background-color: #f7f7f7;
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	padding: 10rpx;
	display: flex;
	align-items: center;
	font-size: 27rpx;
	z-index: 99;
	padding-bottom: 68rpx;
}
.Comment-box-input{
	background-color: #FFFFFF;
	border-radius: 10rpx;
	height: 80rpx;
	flex: 1;
}
.Comment-box-input input{
	padding: 0 15rpx;
	height: 80rpx;
}
.send-out{
	background-color: #07c160;
	color: #FFFFFF;
	height: 80rpx;
	line-height: 80rpx;
	width: 150rpx;
	text-align: center;
	border-radius: 10rpx;
	margin-left: 10rpx;
}
.detail-page button{
	margin: 70rpx;
	width: 400rpx;
}
.detail-page{
	position:absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>