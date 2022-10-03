<template>
  <!-- 公用的sku规格 选择弹框 -->
  <page-container :show='sku_popup.show' position='bottom' bindenter='onEnter'>
    <view class="space-view">
      <!-- sku展示图片价格区域-->
      <view class="space-price">
        <view class="space-goods-img">
          <image :src="goods.goods_cover" mode="aspectFill"></image>
        </view>
        <view class="space-text">
            <view class="space-text-price">
              <text :class="{line:goodsInfo.exist}">￥{{goods.goods_price}}</text>
              <text v-if="goodsInfo.exist">秒杀价:￥{{goodsInfo.order.goods_price}}</text>
            </view>
            <text class="space-text-stock">库存{{goods.stock}}</text>
            <view class="choice">
              <text>{{selects.length>0?'已选择':'请选择'}}</text>
              <text v-if="selects.length==0" v-for="(item,index) in new_sku" :key="index">{{item.att_name}}</text>
              <text v-else v-for="(item,idx) in selects" :key="idx">{{item.att_val}}</text>
            </view>
        </view>
        <view class="space-xx" @click="sku_popup.show=false">
          <image src="../../static/detail/guanbi.svg" mode="aspectFit"></image>
        </view>
      </view>
      <!-- sku选择区域:单规格 -->
      <view class="space-mar" v-if="new_sku.length==1">
        <block v-for="(item,index) in new_sku" :key="index">
        <text class="space-title">{{item.att_name}}</text>
        <view class="space-sku">
          <text v-for="(i,indexs) in item.sku" :key="indexs" :class="{prevent_style:i.stock==0,new_style:selectCss[index]==indexs}" @click="choice(i.att_val,item.att_name,index,indexs)">{{i.att_val}}</text>
        </view>
        </block>
      </view>
      <!-- sku选择区域:多规格 -->
      <view class="space-mar" v-else>
        <block v-for="(item,index) in new_sku" :key="index">
        <text class="space-title">{{item.att_name}}</text>
        <view class="space-sku">
          <text  @click="choice(i.att_val,item.att_name,index,indexs)" v-for="(i,indexs) in item.sku" :key="indexs" :class="{prevent_style:i.act,new_style:selectCss[index]==indexs}">{{i.att_val}}</text>
        </view>
      </block>
      </view>
      <!-- 购买数量 -->
      <view class="Pur-quantity">
        <view class="Pur-title">
          购买数量
        </view>
        <view class="Pur-image">
          <image src="../../static/detail/jianshao.png" mode="aspectFit" @click="reduces" :class="{prevent_style:goods_amount==1}"></image>
          <text>{{goods_amount}}</text>
          <image src="../../static/detail/tianjia.png" mode="aspectFit" @click="plus"></image>
        </view>
      </view>
      <!-- 给一个高度，防止超出页面的区域和底部区域被按钮盖住 -->
      <view class="" style="height: 200rpx;"></view>
      <!-- 底部按钮 -->
      <view class="space-botton" v-if="tips">
        <view class="" @click="subMit(sku_popup.judge)">
         {{sku_popup.judge=='shopcart'?'加入购物车':'立即购买'}}
        </view>
      </view>
      <view class="space-botton" v-else style="opacity: 0.4;">
        <view class="">
         暂无库存
        </view>
      </view>
    </view>
  </page-container>
  
  
</template>

<script setup>
  // 加购或立即购买
  import {sku_popup} from '@/Acc-config/answer.js'
  import {watch,ref,reactive,toRefs,toRaw,nextTick} from 'vue'
  import {goodsInfo,shopcart} from '@/Acc-config/place-order.js'
  function onEnter(){}
  const props=defineProps({sku_data:Array,goods:Object})
  // 防止异步发生用侦听器,虽然也不会影戏程序运行，但控制台会出现找不到某些值的报错
  const skuData=reactive({goods:{},new_sku:[],all_sku:[],sku_length:0,sku_sort:{},tips:true})
  const {goods,new_sku,tips}=toRefs(skuData)
  //const flag=
  watch(props,(newval)=>{
    // console.log(newval);
    // 这里可以将接收的goods数据，进行一个深拷贝，因为本身自己就是一个父组件里面的子组件，接收的goods数据，也在父组件的其他组件里面接收了，也都使用了watch，但是我们在这个页面里修改了
    // goods的属性值，又因为这里watch侦听的是一个reactive对象，默认开启的深度监视，所以修改goods里面的属性值，会检测到。
    // 为了能够在当前组件修改数据，又不触发其他组件监听，1.可以在当前组件使用深拷贝（这里我们还做了一次转存，所以会有响应式，深拷贝的值是个普通数据），2.也可以让其他页面的监听只监听一次
    //这里修改为了深拷贝
    // console.log(11);
    skuData.goods=JSON.parse(JSON.stringify(newval.goods))
    if(newval.sku_data.length==0) return
    // 取出sku数据，供下面的watch外面的choice函数使用
    const sku_data=newval.sku_data[0].sku[0]
    skuData.all_sku=newval.sku_data[0].sku
    skuData.sku_length=newval.sku_data[0].sku[0].att_data.length
    sku_data.att_data.forEach((item,index)=>{
    skuData.sku_sort={...skuData.sku_sort,...{[item.att_name]:index}}
    })
    // 
    // 这里默认取的是sku数据的第一条，因为我们在后台添加数据的时候，数据的sku的规格属性，都是同时添加和删除的，也是就同一商品的不同规格都有相同的规格属性，所以取第一项，拿到里面规格的条数，再根据规格的长度来判断是单规格还是多规格
    // const sku_data=newval.sku_data[0].sku[0]
    // 取出标题
    const sku_name=sku_data.att_data.map(item=>item.att_name)
    // !!!!!!!!!!!!!!!!!*******************!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!重要
    // 重新整理sku数据，便于符合页面渲染结构
   let new_sku=[]
    for(let i=0;i<sku_name.length;i++){
      const res=newval.sku_data[0].sku.map((item)=>{
        if(sku_name.length==1){
          return {att_val:item.att_data[i].att_val,stock:item.stock}
        }else{
           return {att_val:item.att_data[i].att_val,act:false}
        }
      })
      // console.log(res);
      //数组对象去重
      let obj={}
      let newArr=res.reduce((prev,item)=>{
        if(!obj[item.att_val]){
          prev.push(item)
          obj[item.att_val]=1
        }
        return prev
      },[])
      new_sku.push({att_name:sku_name[i],sku:newArr})
    }
    skuData.new_sku=new_sku
  })
  // 选中规格select:[{att_name:'',att_val:''}]
  const selectdata=reactive({selects:[],selectCss:[]})
  const {selects,selectCss}=toRefs(selectdata)
  // !!!!!!!!!!!!!!!!!*******************!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //!重要
  const choice=(att_val,att_name,index,indexs)=>{
    // 终止监听器watch,因为下面我们的操作修改了props里面的goods的值，所以watch在点击时又会触发
    // flag()
    //一.切换选中添加颜色和展示
    // 1.先查找是否选择了存在该类的类别，如果存在，则判断是否是点击的同一个，如果不存在则，添加该类别
    const name=selectdata.selects.findIndex(item=>item.att_name==att_name)
    if(name>-1){//已经有了该类别，判断是否是点的同一项
        // const val=selectdata.select.findIndex(item=>item.att_val==att_val)
        if(selectdata.selects[name].att_val==att_val){
            // 如果为true,说明我们已经选择过了当前项，这里再次点击，取消删除当前项，去除样式
            selectdata.selects.splice(name,1)
            //样式
            selectdata.selectCss[index]=-1
        }else{
            selectdata.selects[name]={att_name,att_val}//必须赋值
            selectdata.selectCss[index]=indexs
        }      
    }else{//没有该类别，需要往后添加新数据
        selectdata.selects.push({att_name,att_val})
        selectdata.selectCss[index]=indexs
      
    } 
    // 二.查询规格是否存在
    // console.log(selectdata.select);
    // console.log(skuData.all_sku);
    // console.log(skuData.new_sku);     
    let raw=toRaw(skuData)
    raw.all_sku.forEach(item=>item['custom']='')
    selectdata.selects.forEach((sel_item,sel_index)=>{
        raw.all_sku.forEach((ori_item,ori_index)=>{
            ori_item.att_data.forEach((i,idx)=>{           
              if(i.att_name==sel_item.att_name && i.att_val==sel_item.att_val){
                //一.此处查询到库存为0的，custom就标记为选择的字符串           
                raw.all_sku[ori_index].custom+=i.att_val
              }
            })    
        })
    })
    // 在新加一个字段来控制
    raw.new_sku.forEach(item=>{
      item.sku.forEach(i=>{
        i['flag']=true
      })
    })
    let selstr=''
    selectdata.selects.forEach(item=>selstr+=item.att_val)
    if(selstr==''){
      //二.过滤出当前选择的已有规格的库存为0的sku,为一个数组
      // 用var ,后面要使用，为一个全局变量
      var new_res=[]//一向都没选择，或刚开始进来时候的状态
    }else{//选中，选择至少一项，过滤出当前选择的已有规格的库存为0的sku,为一个数组
      var new_res=raw.all_sku.filter(item=>item.custom==selstr)
    }
    // console.log(new_res);
  let newsel=[]
    let a=selectdata.selects.map(i=>JSON.stringify(i))
    for(let i=0;i<new_res.length;i++){
    let b=new_res[i].att_data.map(i=>JSON.stringify(i))  
    let res=b.filter(item=>!(new Set(a).has(item)))
    newsel.push(...res)   
   }
  newsel=[...new Set(newsel)]
  newsel=newsel.map((item)=>JSON.parse(item))
  // console.log(newsel);
  // console.log(raw.new_sku);

  if(newsel.length>0 || selectdata.selects.length>0){
    for(let i=0;i<newsel.length;i++){
       raw.new_sku.forEach((item,index)=>{       
         if(item.att_name==newsel[i].att_name){
           item.sku.forEach((idx)=>{           
             if(idx.att_val!=newsel[i].att_val && idx.flag==true){
               idx.act=true          
             }
             if(idx.att_val==newsel[i].att_val){
                idx.act=false
               idx.flag=false
             }
           })
         }
       })
    }
  }else{
     // 如果没有设置该规格
     raw.new_sku.forEach((item,index)=>{
       item.sku.forEach((i,idx)=>{   
         if(i.act){
           i.flag=true
           i.act=false
         }
        })
      })
    }
  //三.查询选中的sku的图片，价格和库存
    if(selectdata.selects.length==skuData.sku_length){// 首先判断是否所有的规格都选择了，如果没有完全选择  ，则不会请求数据
        skuData.tips=true
        // 对选择的规格按照数据库里的顺序进行排序，方便后面的比较是否相等，（也就是有没有这个规格
        selectdata.selects.sort((a,b)=>{
          return skuData.sku_sort[a.att_name]-skuData.sku_sort[b.att_name]
        })
        // 再在所有的sku数据中去寻找是否有全等于该类sku的数据，再获得其他值（价格。。。     
    let sel_sku=skuData.all_sku.filter((item)=>{
          // 这里是两个数组的比较，转换为字符串
          return JSON.stringify(item.att_data)==JSON.stringify(selectdata.selects)
        })
        // 赋值  
           if(sel_sku.length>0){
             skuData.goods.goods_price=sel_sku[0].price
             skuData.goods.stock=sel_sku[0].stock
             skuData.goods.goods_cover=sel_sku[0].image
               // 四.查询库存是否为0
             if(sel_sku[0].stock==0){
               skuData.tips=false
             }
           }else{
              skuData.tips=false
           }   
        // console.log(sel_sku); 
      } 
}
 
  // 加减商品数量
  const goods_amount=ref(1)
  const reduces=()=>{
    //这里不用判断小于1禁用，因为我们用css判断了
      goods_amount.value--
  }
  const plus=()=>{
    goods_amount.value++
  }
  
  //加入购物车或直接下单
  import {Public} from '@/Acc-config/public.js'
  const subMit=async(e)=>{
    if(selectdata.selects.length!=skuData.new_sku.length){
      new Public().toast('请选择商品规格')
    }else{
      //多规格整理数据，前面的是单规格整理数据
      goodsInfo.order.buy_amount=goods_amount.value
      goodsInfo.order.specs=selectdata.selects
      goodsInfo.order.goods_image=skuData.goods.goods_cover
      goodsInfo.order.goods_price=goodsInfo.exist?goodsInfo.order.goods_price:skuData.goods.goods_price//这个skuData.goods.goods_price选择完后会被更改 
      if(e=='shopcart'){//加入购物车
        // console.log('加入购物车');
        // console.log(goodsInfo);
       try{
         let res= await shopcart()
         new Public().toast(res)
         sku_popup.show=false
       }catch(e){
         //TODO handle the exception
        new Public().toast(err)
       }
      }else{//立即购买
      goodsInfo.order.subtotal=(goodsInfo.order.goods_price*goodsInfo.order.buy_amount).toFixed(1)
       sku_popup.show=false
       // 这里当要传递的参数数据很多时，可能会传递不过去，需要进行一次转化
       const str=JSON.stringify([goodsInfo.order])
       wx.navigateTo({//direct单个商品下单
         url:'/pages/pay-view/pay?type=direct&order='+str
       })
      }
    }
  }
  
</script>

<style scoped>
  .line{
    opacity: 0.5;
    text-decoration: line-through;
  }
.space-goods-img{
	width: 180rpx;
	height: 180rpx;
}
.space-goods-img image{
	width: 180rpx;
	height: 180rpx;
	border-radius: 10rpx;
}
.space-xx{
	width: 30rpx;
	height: 30rpx;
}
.space-xx image{
	width: 30rpx;
	height: 30rpx;
}
.space-price{
	display: flex;
	border-bottom: 1rpx solid #ececed;
	padding-bottom: 20rpx;
}
.space-price text{
	display: block;
}
.space-text{
	flex: 1;
	align-self: flex-end;
	padding: 0 20rpx;
	font-size: 26rpx;
}
.space-text-price{
	display: flex;
	align-items: center;
}
.space-text-price text:nth-child(1){
	color: #e9445a;
	font-size: 40rpx;
}
.space-text-price text:nth-child(2){
	font-size: 30rpx;
	background-color: #e9445a;
	color: #ffffff;
	border-radius: 40rpx;
	padding: 10rpx;
	margin-left: 20rpx;
}
.space-text-stock{
	padding: 8rpx 0;
	color: #8d8e92;
}
.choice{
	display: flex;
	align-items: center;
	color: #8d8e92;
	flex-wrap: wrap;
}
.choice text{
	padding-right: 10rpx;
}
.choice text:nth-child(1){
	color: #333333 !important;
}
.space-mar{
	margin: 20rpx 0;
	border-bottom: 1rpx solid #ececed;
}
.space-title{
	margin-bottom: 20rpx;
	display: block;
	font-weight: bold;
}
.space-sku{
	display: flex;
	flex-wrap: wrap;
}
.space-sku text{
	font-size: 28rpx;
	background-color: #f8f8f8;
	padding: 10rpx 20rpx;
	margin: 0 20rpx 20rpx 0;
	border-radius: 8rpx;
}
.Pur-quantity image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
.Pur-quantity{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.Pur-title{font-weight: bold;}
.Pur-image{
	display: flex;
	align-items: center;
}
.Pur-image text{
	padding: 0 40rpx;
}
.space-botton{
	background-color: #fefefe;
	height: 150rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
.space-botton view{
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	color: #FFFFFF;
	background-color: #e9445a;
	margin: 10rpx 20rpx;
	border-radius: 6rpx;
}

/* 点击后加上新样式 */
.new_style{
	background-color: #e9445a !important;
	color: #FFFFFF;
}

</style>