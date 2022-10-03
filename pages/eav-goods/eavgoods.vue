<template>
  <textarea v-model="eav_text" placeholder="请输入评价内容" :auto-focus='true' 	maxlength='200' cursor-spacing="50">
  </textarea>
  <view class="goods-image">
    <view class="upload-Image" v-if="sto_image.length>0" v-for="(item,index) in sto_image" :key="index">
      <image :src="item.image" mode="aspectFill" @click="preView(item.image)"></image>
      <image src="../../static/detail/shanchu-goods.svg" @click="deleteImg(index)" mode="aspectFit"></image>
    </view>
    <view class="" @click="upImage">
        <image  src="../../static/detail/shuxing-img.png" mode="aspectFill"></image>
    </view>
  </view>
  <view class="newly-added-view back">
    <view class="newly-added" @click="subMit">
      提交
    </view>
  </view>
</template>

<script setup>
  import {onLoad} from '@dcloudio/uni-app'
  import {ref,reactive,toRefs} from 'vue'
  import {Public} from '@/Acc-config/public.js'
  import moment from 'moment'
  const db=wx.cloud.database()
  const data=reactive({goods_id:'',goods_index:0,specs:[],cloudimage:[]})
  onLoad((e)=>{
   const res=JSON.parse(e.query)
    data.goods_id=res.goods_id
    data.goods_index=res.index
    data.specs=res.specs
  })
  // 存储评价内容和图片
  const cover=reactive({eav_text:'',sto_image:[]})
  const {eav_text,sto_image}=toRefs(cover)
  // 上传图片
  const upImage=async()=>{
    const local=await new Public().upLoadImgorVideo(9)
    // console.log(local);
    local.forEach(item=>{
      cover.sto_image.push({image:item.tempFilePath})
    })
  }
  // 预览图片
  const preView=(img)=>{
    let arr=[]
    cover.sto_image.forEach(item=>{
      arr.push(item.image)
    })
    new Public().previewImg(img,arr)//arr必须是个数组字符串
    
  }
  // 删除图片
  const deleteImg=(index)=>{
    cover.sto_image.splice(index,1)
  }
//提交
import {eav_index} from '@/Acc-config/answer.js'
const subMit=async()=>{
  if(cover.eav_text==''){
    new Public().toast('请输入评价内容')
    return
  }
  wx.showLoading({
    title:'提交中',
    mask:true
  })
  // 上传图片到云存储
  if(cover.sto_image.length>0){
   let res= await new Public().allUpload(cover.sto_image,'image')
   data.cloudimage=res
  }
  // 获取头像和昵称数据
   const user=wx.getStorageSync('user_info')
   // 获取当前时间字段的数据
   let time=moment().utcOffset(8).format('YYYY-MM-DD')
   let obj={
     avatarurl:user.avatarUrl,
     nickname:user.nickName,
     eav_text:cover.eav_text,
     goods_id:data.goods_id,
     eav_image:data.cloudimage,
     time,
     specs:data.specs 
   }
   // 提交到数据库
   try{
     await db.collection('goods_eva').add({data:obj})
     eav_index.value=data.goods_index
     // wx.hideLoading()
     new Public().toast('提交成功')
     wx.navigateBack({delta:1})
   }catch(e){
     new Public().toast('提交失败')
   }
  
}
  
  
  
</script>

<style>
page{
	background-color: #f2f2f2;
}
textarea{
	box-sizing: border-box;
	background-color: #FFFFFF;
	padding: 10rpx;
	width: 100%;
	height: 350rpx;
	line-height: 1.5;
	margin-bottom: 20rpx;
}
.goods-image{
	display: flex;
	flex-wrap: wrap;
}
.goods-image view{
	width: calc(33.3% - 5rpx*2);
	height: 200rpx;
	margin: 5rpx;
}
.goods-image image{
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 7rpx;
}
.upload-Image {
	position: relative;
}
.upload-Image image:nth-child(2){
	width: 30rpx !important;
	height: 30rpx !important;
	position: absolute;
	top: 0;
	right: 0;
}
.back{
	background-color: #f2f2f2 !important;
}
</style>