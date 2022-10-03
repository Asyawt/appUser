"use strict";
const db = wx.cloud.database();
class Public {
  constructor() {
  }
  login() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F",
        success: async (res) => {
          const query_openid = await db.collection("user_info").get();
          if (query_openid.data.length > 0) {
            const user = query_openid.data[0];
            wx.setStorageSync("user_info", { avatarUrl: user.avatarUrl, nickName: user.nickName, openid: user._openid });
          } else {
            await db.collection("user_info").add({ data: { avatarUrl: res.userInfo.avatarUrl, nickName: res.userInfo.nickName, watch_num: 1, pay: false } });
            const query = await db.collection("user_info").get();
            const user = query.data[0];
            wx.setStorageSync("user_info", { avatarUrl: user.avatarUrl, nickName: user.nickName, openid: user._openid });
          }
          resolve("success");
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  toast(title, icon = "none") {
    wx.showToast({
      title,
      icon,
      mask: true,
      duration: 800
    });
  }
  upLoadImgorVideo(count = 1, type = "image") {
    return new Promise((resolve, reject) => {
      wx.chooseMedia({
        count,
        mediaType: [type],
        sourceType: ["album"]
      }).then((res) => {
        resolve(res.tempFiles);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async uploadCloud(localImg) {
    const a = localImg.split(".");
    const imgJpg = "." + a[1];
    let cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 1e5)}${imgJpg}`;
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: "media/" + cloudPath,
        filePath: localImg,
        success: async (res) => {
          const res_url = await wx.cloud.getTempFileURL({ fileList: [res.fileID] });
          resolve(res_url.fileList[0].tempFileURL);
        },
        fail: (err) => {
          reject()(err);
        }
      });
    });
  }
  async allUpload(allImg, key) {
    return new Promise((resolve, reject) => {
      let allImgHttps = [];
      allImg.forEach(async (item) => {
        const imgHttps = await this.uploadCloud(item.image);
        allImgHttps.push({ [key]: imgHttps });
        if (allImgHttps.length == allImg.length) {
          resolve(allImgHttps);
        }
      });
    });
  }
  previewImg(image, arr) {
    wx.previewImage({
      current: image,
      urls: arr
    });
  }
}
exports.Public = Public;
