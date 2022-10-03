<template>
  <page-container :show='show' positon='bottom' bindenter='onEnter'>
    <view class="space-view">
      <view class="address-title">
        <text>新建收货地址</text>
        <icon type="cancel" size="23" class="icon-small" @click="guanbi"></icon>
      </view>
      <view class="address-input">
        <text>收货人 :</text>
        <input type="text" v-model="result.name">
      </view>
      <view class="address-input">
        <text>手机号码 :</text>
        <input type="text" v-model="result.mobile">
      </view>
      <view class="address-input">
        <text>选择地址 :</text>
        <!-- :range="" -->
        <picker class="flex-left" mode="region"  @change="regiondata" >
          <view>
            <text>{{result.district}}</text>    
            <image src="../../../static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>        
          </view>
        </picker>
      </view>
      <view class="address-input">
        <text>详细地址 :</text>
        <input type="text" v-model="result.address">
      </view>
      <view class="New-address" @click="subMit(_id)">
        {{_id==''?'保存':'修改地址'}}
      </view>
    </view>
  </page-container>
  
  
</template>

<script setup>
  import {show,modify} from '@/Acc-config/answer.js'
  import {onMounted,reactive,toRefs,watch} from 'vue'
  import {Public} from '@/Acc-config/public.js'
  const db=wx.cloud.database()
  function onEnter(){}
  // 接收事件
 const emits=defineEmits(['upLoad'])
  // 输入框的值
  const data=reactive({
    result:{
      name:'',
      mobile:'',
      district:'',
      address:'',
      tacitly:false//判断是否设为默认
    },
    _id:''//判断是提交新数据还是修改数据
  })
  const {result,_id}=toRefs(data)
  // 获得省市区的数据
  let str=''
  const regiondata=(e)=>{
    str=''
    e.detail.value.forEach(item=>str+=item)
    data.result.district=str
  }
  //点击关闭x
  const guanbi=()=>{
    show.value=false
    emptys()
  }
  //保存或修改地址，校验
  const subMit=(id)=>{
    let phone=/^[1][3,4,5,7,8,9][0-9]{9}$/
    switch(true){
      case data.result.name=='': new Public().toast('请输入姓名')
      break;
      case data.result.mobile=='': new Public().toast('请输入手机号')
      break;
      case !phone.test(data.result.mobile): new Public().toast('手机号码格式不正确')
      break;
      case data.result.district=='': new Public().toast('请选择地址')
      break;
      case data.result.address=='': new Public().toast('请填写详细地址')
      break;
      default:subdata(id)
    }
  }
  // 提交数据到数据库
  const subdata=async(id)=>{
     try{
       if(id==''){//提交新地址
         await db.collection('re_address').add({data:data.result})      
       }else{//修改地址
          await db.collection('re_address').doc(id).update({data:data.result})
       }
       show.value=false
       emptys()
       // 触发父组件的方法,更新页面
       emits('upLoad')  
     }catch(e){
       //TODO handle the exception
       new Public().toast('提交失败')
     }
  }
  // 清空输入框的值
  function emptys(){
    data.result.name='',
    data.result.mobile='',
    data.result.district='',
    data.result.address='',
    data.result.tacitly=false
    data._id=''
  }
  // 监听用户修改地址
  watch(modify,(newval)=>{
    Object.assign(data.result,newval.data)
    // console.log(data.result);
    data._id=newval.id
  })
</script>

<style scoped>
.address-title{
	display: flex;
}
.address-title text{
	flex: 1;
	text-align: center;
	font-weight: bold;
}
.address-title icon{
	margin-left: auto;
}
/* 输入部分 */
.address-input{
	display: flex;
	align-items: center;
	margin: 40rpx 0;
	padding-bottom: 40rpx;
	color: #b4b4b4;
	border-bottom: 1rpx solid #e2e2e2;
}
.address-input image{
	width: 40rpx;
	height: 40rpx;
	display: block;
}
.address-input input{
	flex: 1;
	padding: 0 20rpx;
	color: #000000;
}
.flex-left{
	flex: 1;
}
.flex-left view{
	display: flex;
	justify-content: space-between;
}
.flex-left text{
	padding: 0 20rpx;
	color: #000000;
}

</style>