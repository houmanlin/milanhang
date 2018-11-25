const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbartitle: "",
    hasUserInfo: 0,
    userInfo: "",
    hidden:"",

    imgUrls: [

    ],
    gridLayout: [{
        sn: "030",
        url: "../../static/newImg/1.png"
      },
      {
        sn: "031",
        url: "../../static/newImg/2.png"
      },
      {
        sn: "032",
        url: "../../static/newImg/3.png"
      },
      {
        sn: "033",
        url: "../../static/newImg/4.png"
      },
      {
        sn: "034",
        url: "../../static/newImg/5.png"
      },
      {
        url: "../../static/newImg/6.png"
      }
    ],

    gridLayout2:[
      {sn:"035",url:""},
      {sn:"036",url:""}
      ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    
    var vm = this
 
    wx.setStorage({
      key: 'memId',
      data: options.memId,
      navbartitle: "美课优选"
    })
    vm.setData({
      hidden: false
    })
    
    wx.request({
      url: 'http://localhost:8008/a',
      success:function(res){
        debugger;
      }
    })
    //获取轮播图
    wx.request({
      url: app.globalData.getHomePagePath,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
     
        console.log(res.data.list)
        
        if (res.data.code === 200) {
          vm.data.imgUrls = res.data.list
          vm.setData({
            imgUrls: vm.data.imgUrls
          })
        }
      },
      fail: function() {},
      complete: function() {}
    })
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: 1,
        navbartitle: "美课优选"
      })
      vm.getTitle()
    } else {
      wx.getSetting({
        success: function(res) {
          
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(res) {
                app.globalData.userInfo = res.userInfo
           
                
                wx.request({
                  url: app.globalData.authWxMessage,
                  data: {
                    openid: app.globalData.openid
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function(res) {
                    console.log(app.globalData.openid)
                   
                    if (res.data.code == 200) {
                      vm.setData({
                        hasUserInfo: 1,
                        navbartitle: "美课优选"
                      })
                      vm.getTitle()
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
                        success: function(res) {
                          vm.setData({
                            hasUserInfo: 1,
                            navbartitle: "美课优选"
                          })
                          vm.getTitle()
                        },
                        fail: function(res) {}
                      })
                    }
                  },
                  fail: function(res) {}
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

  getTitle:function(){
    const that = this
    //请求
    wx.request({
      url: app.globalData.oneCource,
      data: {
        openid: app.globalData.openid,
        sn: "035"
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        that.data.gridLayout2[0].url = res.data.rows[0].courPic;
        that.setData({
          "gridLayout2[0].url": that.data.gridLayout2[0].url
        })

      }
    })
    wx.request({
      url: app.globalData.oneCource,
      data: {
        openid: app.globalData.openid,
        sn: "036"
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        that.data.gridLayout2[1].url = res.data.rows[0].courPic;
        that.setData({
          "gridLayout2[1].url": that.data.gridLayout2[1].url
        })

      }
    })
  },


  bindGetUserInfo: function(e) {
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
        success: function(res) {
          if (res.data.code == 200) {
            vm.setData({
              hasUserInfo: 1,
              navbartitle: "美课优选"
            })
            vm.getTitle()
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
              success: function(res) {
                vm.setData({
                  hasUserInfo: 1,
                  navbartitle: "美课优选"
                })
                vm.getTitle()
              },
              fail: function(res) {}
            })
          }
        },
        fail: function(res) {
          
          console.log(res);
        }
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  jumpSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  goLayout: function(e) {
    console.log(e);
    var snNum = parseInt(e.currentTarget.dataset.sn)
    wx.navigateTo({
      url: '/pages/curriculum/curriculum-detail/curriculum-detail?indexpage=' + e.currentTarget.dataset.indexpage + "&sn=" + snNum
    })
  },

})