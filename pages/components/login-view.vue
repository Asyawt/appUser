<template>
  <!-- 公用的登录弹窗 -->
  <view class="login-view" v-if="login_user.show">
    <view class="login-button">
      <button type="primary" @click="login">登录</button>
      <button @click="login_user.show=false">取消</button>
    </view>
  </view>
</template>

<script setup>
  import {login_user} from '@/Acc-config/answer.js'
  import {Public} from '@/Acc-config/public.js'
  //登录
  const login=async()=>{
  try{
    await new Public().login()
    login_user.show=false
    //这里设计一个响应式字段，来判断是否登录成功，把这个值当作状态传递给父组件，用watch
    login_user.response='success'
  }catch(e){
    //TODO handle the exception
    new Public().toast('登录失败')
  }
  }
</script>

<style >
.login-view{
	position: fixed;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: #FFFFFF;
	z-index: 999;
  animation: post-list-row .3s;
}

@keyframes post-list-row {
	0% {top:100%}
	100%{top:0}
}

.login-button{
	position:absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.login-view button{
	margin: 70rpx;
	width: 400rpx;
}
</style>