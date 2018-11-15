const app = getApp()

Page({
  data:{
    userInfo: {},
    hasUserInfo: false,
    name: '获取验证码',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: 0,
    mobile: '',
    code: '',
    disabled: false,
    handle: null
  },
  // 返回前一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function() {
    var that = this
    var mobile = that.data.mobile
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (app.showModal(mobile.length == 0, "请输入手机号！")) {
      return;
    }
    if (app.showModal(!(phonetel.test(mobile)), "手机号码有误，请重新填写！")) {
      return;
    }
    // 判断绑定的电话号是否被别人用了
    wx.request({
      url: app.globalData.checkPhone,
      method: "POST",
      data: {
        openid: app.globalData.openid,
        phone: that.data.mobile
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (data) {
        if (data.data.code === 200) {
          console.log("完成验证，没有被他人使用过")
          // 发送验证码
          console.log(app.globalData.getPhoneCode)
          wx.request({
            url: app.globalData.getPhoneCode,
            method: "POST",
            data: {
              openid: app.globalData.openid,
              phone: that.data.mobile
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
              console.log(data)
              if(data.data.code === 200) {
                console.log("获取验证码成功")
                that.setData({
                  time: new Date().getTime(),
                  name: '重新发送(120)'
                })
                var handle = setInterval(that.sendCode, 1000);
                that.setData({
                  handle: handle
                });
              }else if(data.data.code === 500){
                wx.showToast({
                  title: '获取验证码失败',
                  icon: "none"
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }else if (data.data.code === 500) {
          wx.showToast({
            title: '此手机号已被他人使用',
            icon: "none"
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  sendCode: function () {
    var time1 = this.data.time;
    var time2 = new Date().getTime();
    var r = parseInt((120000 - (time2 - time1)) / 1000);
    if (r > 1) {
      this.setData({
        disabled: true,
        name: '重新发送(' + r + ')'
      })
    }
    else {
      this.setData({
        disabled: false,
        name: '发送验证码'
      })
      var handle = this.data.handle;
      if (handle) {
        clearInterval(handle);
      }
    }
  },
  btnclick: function() {
    var that = this
    var mobile = that.data.mobile
    var code = that.data.code
    if (app.showModal(mobile.length == 0, "请输入手机号！")) {
      return;
    }
    if (app.showModal(code.length == 0, "请输入验证码！")) {
      return;
    }
    // console.info("app.globalData.openid=", app.globalData.openid);
    // 完善手机验证信息
    wx.request({
      url: app.globalData.completePhone,
      method: "POST",
      data: {
        openid: app.globalData.openid,
        phone: that.data.mobile
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (data) {
        if(data.data.code === 200) {
          wx.showToast({
            title: '手机号绑定成功',
            icon: "none"
          })
          wx.navigateBack({
            delta: 1
          })
        }else if(data.data.code === 500) {
          wx.showToast({
            title: '手机号绑定失败',
            icon: "none"
          })
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  onShow: function () {
    this.setData({
			  disabled: false
     })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }
})