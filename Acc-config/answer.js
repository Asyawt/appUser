//一些公用的响应式传值
import {reactive,ref} from 'vue'
//用户没有登录，传值，调出登录框
let login_user=reactive({show:false,response:'none'})
//短视频里点击评论按钮，拉出评论框
let comment_show=reactive({show:false,num:1,goods_id:''})
// 详情页点击底部加购或购买拉起sku弹框
let sku_popup=reactive({show:false,judge:''})//judge判断是点击加购还是立即购买
// 收货地址页面，父组件调用子组件弹窗
let show=ref(false)
//收货地址页面，父组件，用户修改地址传值到子组件
let modify=reactive({data:{},id:''})
//  选择收获地址传值,返回上一页
let newAddress=reactive({data:[]})
// 订单页面点击评价到评价页面，提交评价后携带下标返回上一页面
let eav_index=ref('-1')
export {login_user,comment_show,sku_popup,show,modify,newAddress,eav_index}