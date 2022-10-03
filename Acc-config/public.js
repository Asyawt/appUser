const db=wx.cloud.database()
class Public{
  constructor(){}
  // 登录
  login(){
    return new Promise((resolve,reject)=>{
      wx.getUserProfile({
        desc:'获取用户信息',
        success:async(res)=>{
          // console.log(res);
          //存储数据库之前查询数据库是否存在用户信息，不存在则提交
          const query_openid=await db.collection('user_info').get()
          // console.log(query_openid);
          if(query_openid.data.length>0){
            //存在用户信息
            const user=query_openid.data[0]  //这里因为该条数据是用户自己创建的，所以一个用户只能创建一条，所以取data[0] ？？？
            // 这里可能因为该user_info的权限为仅创建者可读写，所以在我们请求这个数据库的信息时，他不会全部返回所有的数据，而是做一个默认匹配，匹配和当前用户一致的数据，后面的监听器这个数据库集合也是一样
            wx.setStorageSync('user_info',{avatarUrl:user.avatarUrl,nickName:user.nickName,openid:user._openid})
          }else{
            await db.collection('user_info').add({data:{avatarUrl:res.userInfo.avatarUrl,nickName:res.userInfo.nickName,watch_num:1,pay:false}})
            const query=await db.collection('user_info').get()
            const user=query.data[0]
            wx.setStorageSync('user_info',{avatarUrl:user.avatarUrl,nickName:user.nickName,openid:user._openid})
          }
          resolve('success')
        },
        fail:(err)=>{
          reject(err)
        }
      })
    })
  }
  //消息提示框
  toast(title,icon='none'){
    wx.showToast({
      title,
      icon,
      mask:true,
      duration:800
    })
  }

// 调用本地相册或视频
  upLoadImgorVideo(count=1,type='image'){
    return new Promise((resolve,reject)=>{
      wx.chooseMedia({
        count,
        mediaType:[type],
        sourceType:['album']
      }).then((res)=>{
      resolve(res.tempFiles)
     
      }).catch(err=>{
        reject(err);
      })
    })
  }
  // 上传一张图片或视频到云存储
 async uploadCloud(localImg){
    // 这里做图片名称的重写，是为了高并发，防止同时上传相同的图片
    const a=localImg.split('.')
    const imgJpg='.'+a[1]
    // console.log(imgJpg);
    let cloudPath=`${Date.now()}-${Math.floor(Math.random(0,1)*100000)}${imgJpg}`
    return new Promise((resolve,reject)=>{
      // 这里的cloudPath为创建的文件夹名称+文件名称，文件名称必须唯一，可以就用本地存储的生成的字符串，但。。。
    wx.cloud.uploadFile({
      cloudPath:'media/'+cloudPath,
      filePath:localImg,
      success:async(res)=>{
        // console.log(res);
        // 在数据库共享的小程序里面，不能直接使用res.fileID(无效)，必须把fileID转化成https形式，小程序才能使用，调用wx.cloud.getTempFileURL()
        const res_url=await wx.cloud.getTempFileURL({fileList:[res.fileID]})
        // console.log(res_url)
        resolve(res_url.fileList[0].tempFileURL)
      },
      fail:err=>{
        reject()(err);
      }
    })
    })
  }
// 一次上传多张图片到云存储
async allUpload(allImg,key){
  // 必须要包装成一个promise，因为我们要等到所有照片都上传完成，才返回来数据
  return new Promise((resolve,reject)=>{
    let allImgHttps=[]
      allImg.forEach(async(item)=>{
        // 在类里面调用自己的方法加this
        const imgHttps=await this.uploadCloud(item.image)
        allImgHttps.push({[key]:imgHttps})
        if(allImgHttps.length==allImg.length){
          resolve(allImgHttps)
        }
      })
      // 这里不能直接resolve(allImgHttps)，因为上面的上传操作是个异步，还没上传完成，就执行了下面的代码 !!!
      // resolve(allImgHttps)
  })
}
// 预览图片
previewImg(image,arr){
  wx.previewImage({
    current: image, // 当前显示图片的 http 链接
    urls: arr // 需要预览的图片 http 链接列表['httpxx','']
  })
}

}
export {Public}