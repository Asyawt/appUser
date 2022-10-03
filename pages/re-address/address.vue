<template>
  <view class="Re-view" v-for="(item,index) in address" :key="index">
    <view class="Re-address Re-flex" @click="choiceAdd(item)">
      <view class="">
        <view class="Re-name Re-flex">
          <text>{{item.name}}</text>
          <text>{{item.mobile}}</text>
        </view>
        <text>{{item.district+item.address}}</text>
      </view>
      <view v-if="item.tacitly">
        <icon type="success_no_circle" class="icon-small" size="23"></icon>
      </view>
    </view>
    <!--设置默认  -->
    <view class="Defa-address Re-flex">
      <view class="Re-flex" :class="{Disable:item.tacitly}" @click="setup(item._id,index)">
        <icon type="success" class="icon-small" size="23" v-if="item.tacitly"></icon>
        <text class="Defa-padd">{{item.tacitly?'已设为默认':'设为默认'}}</text>
      </view>
      <view class="Re-flex">
        <text @click="deleteAdd(item._id,index)">删除</text>
        <text class="Defa-padd" @click="modifys(item)">修改</text>
      </view>
    </view>
  </view>  
  <!-- 没有数据的提示 -->
 <view class="Tips" v-if="address.length==0">
    你还没有添加收获地址
  </view>
  <view style="height:200rpx;"></view>
  <!-- 底部 -->
  <view class="New-address" @click="addAddress">
    ＋ 新建收货地址
  </view>
  <!-- 弹窗 -->
  <AddAddress @upLoad='upLoad'></AddAddress>
  
  
</template>

<script setup>
  import AddAddress from './component/new-address.vue'
  import {show} from '@/Acc-config/answer.js'
  import {onMounted,reactive,toRefs} from 'vue'
  import {Public} from '@/Acc-config/public.js'
  const db=wx.cloud.database()
// 显示弹窗新建地址
  const addAddress=()=>{
    show.value=true
  }
  // 请求数据
  onMounted(()=>{
    getAddress()
  })
  const addressData=reactive({
    address:[]
  })
  const {address}=toRefs(addressData)
 const getAddress=async()=>{
   const res=await db.collection('re_address').get()
   addressData.address=res.data
 } 
 // 这里子组件需要调用父组件的方法，重新请求数据库，更新页面，用自定义事件
 const upLoad=()=>{
      getAddress()
 }
  // 删除
  const deleteAdd=(id,index)=>{
      wx.showModal({content:'确认删除吗?'}).then(async(res)=>{
        if(res.confirm){
          try{
            await db.collection('re_address').doc(id).remove()
            addressData.address.splice(index,1)
          }catch(e){
           new Public().toast('删除失败')
          }
        }
      })
  }
  // 修改地址
  import {modify,newAddress} from '@/Acc-config/answer.js'
  const modifys=(item)=>{
    modify.id=item._id
    //对象中删除多个属性的操作，用到解构和rest参数，为了后面的object.assign使用
    const {_id,_openid,...items}=item
    modify.data=items
    show.value=true
  }
  // 设置默认地址
  const setup=async(id,index)=>{
    // 这里sto里面的数据只可能存在一个！！
    // 存储上一次点击设置默认的数据，方便这次点击后把它（上一次设置为true）改为false
    //(也可排他思想)但这里排他性能差！
    let sto=[]
    addressData.address.forEach((item,indexs)=>{
      if(item.tacitly){
        sto.push({index:indexs,id:item._id})
      }
    })
    try{
      await db.collection('re_address').doc(id).update({data:{tacitly:true}})
      addressData.address[index].tacitly=true
      if(sto.length>0){
        addressData.address[sto[0].index].tacitly=false
        await db.collection('re_address').doc(sto[0].id).update({data:{tacitly:false}})
      
      }
    }catch(e){
      new Public().toast('设置失败')
    }
  }
  // 选择收获地址传值,返回上一页
  const choiceAdd=(item)=>{
     newAddress.data=[item]
     wx.navigateBack({
       delta:1
     })
  }
</script>

<style>
page{
	background-color: #fafafa;
}
.Re-view{
	background-color: #FFFFFF;
	padding: 20rpx;
	margin: 20rpx 0;
}
.Re-address{
	justify-content: space-between;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #e1e1e1;
}
.Re-flex{
	display: flex;
	align-items: center;
}
.Re-name text:nth-child(1){
	font-weight: bold;
	padding-right: 20rpx;
}
.Re-name text:nth-child(2){
	color: #8c8c8c;
}
.Re-name{
	padding-bottom: 20rpx;
}
/* 默认地址 */
.Defa-address text{
	display: block;
	color: #8c8c8c;
}
.Defa-address{
	justify-content: space-between;
	padding-top: 20rpx;
}
.Defa-padd{
	padding-left: 30rpx;
}
/* 禁用点击 */
.Disable{
	pointer-events: none;
}
</style>