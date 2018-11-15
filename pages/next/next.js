const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      navbartitle:"",
      hasUserInfo:0,
      userInfo:"",
    imgUrls: [
      'red',
      'green',
      'yellow'
    ],
    gridLayout:[
        "../../static/newImg/1.png",
         "../../static/newImg/2.png",
         "../../static/newImg/3.png",
         "../../static/newImg/4.png",
         "../../static/newImg/5.png",
         "../../static/newImg/6.png",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this
    wx.setStorage({
      key: 'memId',
      data: options.memId,
      navbartitle:"美课优选"
    })
    vm.setData({
      hidden: false
    })
    if (app.globalData.userInfo) {
     
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: 1,
        navbartitle: "美课优选"
      })
     
    } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                app.globalData.userInfo = res.userInfo
                wx.request({
                  url: app.globalData.authWxMessage,
                  data: {
                    openid: app.globalData.openid
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    if (res.data.code == 200) {
                      vm.setData({
                        hasUserInfo: 1,
                        navbartitle: "美课优选"
                      })
                 
                    } else {
                      wx.request({
                        url: app.globalData.register,
                        data: {
                          openid: app.globalData.openid,
                          wxname: app.globalData.userInfo.nickName,
                          gender: app.globalData.userInfo.gender,
                          province: app.globalData.userInfo.province,
                          city: app.globalData.userInfo.city,
                          country: app.globalData.userInfo.country,
                          headUrl: app.globalData.userInfo.avatarUrl
                        },
                        header: {
                          "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function (res) {
                          vm.setData({
                            hasUserInfo: 1,
                            navbartitle: "美课优选"
                          })
                         
                        },
                        fail: function (res) {
                        }
                      })
                    }
                  },
                  fail: function (res) {
                  }
                })
              }
            })
          } else {
            vm.setData({
              hasUserInfo: 2
            })
          }
        }
      })
    }
    if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          hasUserInfo: 1,
          navbartitle: "美课优选"
        })
     
      }
    }
  },
  bindGetUserInfo: function (e) {
    var vm = this
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      var that = this;
      wx.request({
        url: app.globalData.authWxMessage,
        data: {
          openid: app.globalData.openid
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 200) {
            vm.setData({
              hasUserInfo: 1,
              navbartitle: "美课优选"
            })
           
          } else {
            wx.request({
              url: app.globalData.register,
              data: {
                openid: app.globalData.openid,
                wxname: app.globalData.userInfo.nickName,
                gender: app.globalData.userInfo.gender,
                province: app.globalData.userInfo.province,
                city: app.globalData.userInfo.city,
                country: app.globalData.userInfo.country,
                headUrl: app.globalData.userInfo.avatarUrl
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                vm.setData({
                  hasUserInfo: 1,
                  navbartitle: "美课优选"
                })
             
              },
              fail: function (res) {
              }
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  jumpSearch:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
  // callService:function(){
  //   wx.request({
  //     url: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN',
  //   })
  // }
})